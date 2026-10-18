# Erdae warfare

**Status:** Draft. **Priority:** 3. **Phase:** 3.

## Purpose

ZIN still fights with vanilla rifles, tanks, battleships and aircraft. This spec replaces all of it with the warfare of Erdae in the Fourth Age: hosts of men, elves, orcs, the dead and the great kin; siege engines and walls; galleys and warships; a small, optional sky of griffins and dragons. It also defines the special units the story needs (Zol's deathless dead, the bearer of Glo, Volgan's own presence, dragons), the Great Wall forts, the technology tree with Fourth Age years, doctrines per people, AI templates, the 3D unit pipeline, and the migration from vanilla.

The combat engine stays HOI4's. Every Erdae unit is built from HOI4 sub-units, equipment, technologies and doctrines, so the AI, the division designer and the production screen keep working.

## Lore basis

### Established (fixed)

| Fact | Source |
| --- | --- |
| Start: the Golden King reigns, Eindil has not appeared, Afrit is unrevealed, Erdae seems at peace. | Owner, 18 Oct 2026 |
| The Second Age made real progress in warfare and military technology, medicine and farming; the Fourth Age rebuilt on it. | *Second Age Progress and Recovery*, *The Fourth Age of Erdae* |
| The Golden King built a strong army (and misgoverns the realm). | *Middle Lands and Aenor* |
| Dominions with military identities: Selen's rangers, Kilinti's ents and forest peoples, Hiloron's giants, the riders of Hunhun. | *Middle Lands and Aenor* |
| Peoples of men include Dondor Brutes, Noris camel warriors, Gunwaith clans, Girdon wardens, Buldor companies, Aenor Isle houses, Goodin Sunfolk. Other peoples: elves (Magical Forest, Sunhot, Gala, God Forest Keepers), giants (Hiloron, Titanos ice giants), ents, yeti, orcs, goblins, trolls, ogres, grave hosts, undead, demons (Shachihata, Netherborn, Afrit's demons). Dwarves exist; their homeland is not designated. | *Peoples of Erdae* |
| Sunhot elves are over three metres tall, among the strongest and most peaceful peoples. | *Peoples of Erdae* |
| Volgan's realm has the largest dark army: grave hosts, Netherborn demons, orcs, ogres, monster clans, necromantic orders. His authority does not extend to independent Dark Lands factions. | *Volgans Dead Lands*, *Kingdoms Factions and Conflicts* |
| The Dead Lands are hot, storm-girt and hard to reach by sea. | *Volgans Dead Lands* |
| Zol's dead are sustained by the Old God's own magic. Ordinary weapons may break their shapes but cannot end them. Only potent magic, such as Glo and Horos's sword, destroys them. | *Zol*, *The Fourth Age of Erdae*, *War of the Last Crowns* |
| The dead of the Dead Lands and the dead of Zol's Mistake have no settled taxonomy or relationship. | *Zols Mistake*, *Volgans Dead Lands* |
| Elzon's animated corpses faded and needed continuing magic that was hard to replenish outside the Dead Lands. | *Elzons Order*, *The Third Age of Erdae* |
| Dragons come chiefly from Dragon Mountain and do not form a country. Elven powers can command them; Afrit can, through corruption. | *Peoples of Erdae* |
| Eindil returns on a dragon; with Glo and Horos's blue sword he destroys Zol's dead; Zol later crushes the sword; a shard still wounds Zol's manifestation. | *Fourth Age Canon Register*, *Castle Yeldenne and Glo* |
| Volgan's manifested body is destroyed; whether his spirit survives is open. | *Canon Policy* |
| Western fleets cross the much wider central sea and take the capital. | *War of the Last Crowns*, *Middle Lands and Aenor* |
| The Great Wall of Aenor separates the Middle Lands from the Magical Lands. | *Fourth Age Chronology* (geography established) |
| Alleria of Selen is a ranger and archer. | *Alleria of Selen* |

### Proposed elsewhere in the vault (used, still proposals)

The Great Wall's origin in Elzon's Pale March; Mirolon fortifying its passes (c. 4A 1650); black ships among the islands of the Ocean of Zol (4A 1744); the Triton charts of the Pupor Ocean (4A 702); the Lantern Chain's wardens; Lerendor's fleets guarding the strait; the Worshipdom holding almost no army.

### Proposed by this spec

Every unit name, equipment name, technology name and year, doctrine, stat, ship and beast design, the piercing rule for the deathless, griffins as a beast of war, "grave-host strain", "great being" companies, and all identifiers below. No gunpowder exists in the Fourth Age; crossbows and torsion engines are the most advanced missile weapons (proposed assumption, see open questions).

### Open (this spec never closes them)

Who administers Zol's Mistake (Zol's armies have no named commanders); whether Volgan's spirit survives (Volgan's presence company is removed when his body is destroyed, nothing more); the relationship of Gala and Sunhot elves (separate unit families, no shared lineage text); what Glo bestows after the sword breaks (gameplay keeps a reduced effect, see open questions); the dwarves' homeland (no dwarven units at start); the taxonomy of the dead (Volgan's grave hosts and Zol's deathless are separate unit families with no claimed relation).

### Start constraints

- No great war at start. Every army stands inside its own territory.
- No unit, equipment, technology, doctrine or division name readable before `zin_afrit_revealed` contains "Afrit" or calls the Deliverer a demon. Afrit's bound demons exist only after the reveal.
- Eindil's units do not exist at start. The bearer of Glo, Eindil's host and the Glo shockwave appear only after `zin_glo_with_eindil`.
- Zol's deathless stand only inside the Mistake until `zin_zol_rising`. Wards against death cannot be researched before `zin_zol_rising`.
- No dragon is in any stockpile or air wing at start.

## Design

### 1. Principles

1. **One people, one army.** Each of the ten peoples (`men`, `elves`, `sun_elves`, `orcs`, `trolls`, `giants`, `ents`, `yeti`, `demons`, `the_dead`) fields its own battalions. A country recruits from its people's list plus the shared siege and support lists its people may use.
2. **Armour and piercing carry the lore.** Monsters are hard targets; the deathless are almost untouchable to ordinary arms; magic pierces.
3. **Scarcity, not caps.** Rare beings (dragons, Shachihata, great spirits, the bearer of Glo) use equipment that cannot be produced. Scripts grant it. Losing it loses the unit.
4. **No modern remnants.** No tanks, guns, planes, submarines, radar, rockets, nuclear weapons or motorised units remain loadable.
5. **The engine keeps its hooks.** Supply trucks, trains and convoys keep their engine archetype keys, re-themed as pack trains, wagon trains and merchant cogs.

### 2. Vanilla to Erdae

| Vanilla concept | Erdae concept | Notes |
| --- | --- | --- |
| Infantry | Foot hosts: levies, line infantry, archers, heavy infantry | Per people |
| Cavalry, motorised, mechanised | Cavalry, horse archers, knights, camel riders, raiders | No motor units |
| Tanks | Knights and heavy foot (men); the great kin (trolls, giants, ents, ogres, yeti, Shachihata) | Armour role |
| Artillery, rocket artillery | Catapults, trebuchets, giant hurlers | Siege |
| Anti-tank | Ballistae | Pierce monsters |
| Anti-air | Scorpions (bolt-throwers) | Only matters if the sky is on |
| Support companies | Scouts, sappers, healers, heralds, quartermasters, provosts, armourers, wardens, necromancers | Camp |
| Special forces | Rangers, hill companies, sea soldiers, temple wardens | Special forces cap |
| Aircraft | Griffin riders (fighter), dragon flights (close support) | Game rule; may be off |
| Destroyers, cruisers | War galleys | Screens |
| Battleships | Warships, great warships | Capitals |
| Submarines | Corsairs and black ships | Hidden raiders |
| Carriers | None | Removed |
| Convoys | Merchant cogs | Key `convoy` kept |
| Trains, railways | Wagon trains, the high roads | Keys kept |
| Supply trucks | Pack trains | Key `motorized_equipment` kept |
| Forts, coastal forts | Stone forts, sea forts | Building keys kept |
| Air bases | Eyries | Building key kept |
| Naval bases | Harbours | Building key kept |
| Radar, rocket sites, reactors | None | Disabled by the economy spec |

### 3. Equipment archetypes

All are proposed. Variants are `<archetype>_0` to `_5`. `type` is the HOI4 equipment type used by production and the AI.

| Archetype | Name | HOI4 type | Who can produce (`can_be_produced`) | Used by |
| --- | --- | --- | --- | --- |
| `zin_arms_equipment` | Arms (spear, sword, axe, shield) | `infantry` | every people except ents, yeti, the_dead, demons | Foot, cavalry, special forces of men, orcs, giants |
| `zin_bows_equipment` | Bows and crossbows | `infantry` | men, orcs | Archers, horse archers, rangers, goblins |
| `zin_armour_equipment` | Mail and plate | `support` | men, orcs, giants | Heavy infantry, knights, temple wardens |
| `zin_mounts_equipment` | War mounts (horses; camels as a variant line) | `support` | men, elves, orcs, the_dead | Cavalry and riders |
| `zin_elven_arms_equipment` | Elven arms and longbows | `infantry` | elves, sun_elves | All elven battalions |
| `zin_camp_equipment` | Camp gear (tools, tents, horns, healers' kits) | `support` | all | Support companies |
| `zin_ward_equipment` | Wards (lantern-glass, hallowed tokens, wardsong) | `support` | men (after `zin_tech_lantern_wards`), elves (after `zin_tech_wardsong`) | Warden and wardsinger companies |
| `zin_catapult_equipment` | Catapults | `artillery` | men, orcs, the_dead, giants | Catapult battalions and companies |
| `zin_trebuchet_equipment` | Trebuchets | `artillery` | men, the_dead | Trebuchet battalions |
| `zin_ballista_equipment` | Ballistae | `anti_tank` | men, elves, sun_elves, the_dead | Ballista companies |
| `zin_scorpion_equipment` | Scorpions | `anti_air` | men, elves, sun_elves | Scorpion companies |
| `zin_troll_gear_equipment` | Troll gear (iron-bound clubs, hide plates) | `infantry` | trolls | Troll brutes |
| `zin_giant_gear_equipment` | Giant gear (great weapons, slings) | `infantry` | giants | Giant hosts, hurlers |
| `zin_ent_grove_equipment` | Grove wardings (stone, sap, the moot's care) | `infantry` | ents | Ent groves |
| `zin_yeti_gear_equipment` | Yeti gear (bone and hide) | `infantry` | yeti | Yeti bands |
| `zin_ogre_gear_equipment` | Ogre gear | `infantry` | orcs, the_dead | Ogre brutes |
| `zin_grave_arms_equipment` | Grave arms | `infantry` | Volgan only | Grave hosts, grave riders, necromancers |
| `zin_nether_arms_equipment` | Nether arms | `infantry` | demons, Volgan | Netherborn, bound demons |
| `zin_deathless_equipment` | Deathless bonds | `infantry` | nobody (granted) | Zol's deathless |
| `zin_shachihata_equipment` | Shachihata | `infantry` | nobody (granted) | Shachihata |
| `zin_glo_blade_equipment` | The bearer of Glo | `support` | nobody (granted) | Glo bearer company |
| `zin_volgan_presence_equipment` | Volgan's presence | `support` | nobody (granted) | Volgan's presence company |
| `zin_great_spirit_equipment` | A great spirit | `support` | nobody (granted) | Great spirit company |
| `zin_zol_manifestation_equipment` | Zol made flesh | `support` | nobody (granted) | Zol manifestation company |
| `motorized_equipment` (kept key) | Pack trains | `motorized` | all | Supply hubs only; no unit needs it |
| `train_equipment` (kept key) | Wagon trains | `train` | all | High roads (railways) |
| `convoy` (kept key) | Merchant cogs | `convoy` | all with a harbour | Trade and transport |
| `zin_hull_galley` | Galley hull | `screen_ship` | all with a dockyard | War galleys |
| `zin_hull_warship` | Warship hull | `capital_ship` | all with a dockyard | Warships |
| `zin_hull_great_warship` | Great warship hull | `capital_ship` | all with a dockyard | Great warships |
| `zin_hull_raider` | Raider hull | `submarine` | all with a dockyard | Corsairs, black ships |
| `zin_griffin_equipment` | Griffins | `fighter` | men (rule on) | Griffin riders |
| `zin_dragon_equipment` | Dragons | `cas` | nobody (granted) | Dragon flights |

Every equipment has `fuel_consumption = 0`. Resource costs use the economy spec's re-themed resources; until then use vanilla keys: arms and armour `steel`; bows `steel` 1; mounts none (manpower and IC); engines `steel` and `tungsten`; elven arms `chromium` (rare stuff); hulls `steel`. Equipment with "nobody" has `is_buildable = no` and `can_be_produced = { always = no }`.

**Vanilla slot map.** `infantry_equipment` becomes arms, bows, elven, kin, grave and nether arms; `support_equipment` becomes camp gear and wards; `artillery_equipment` becomes catapults and trebuchets; `anti_tank_equipment` becomes ballistae; `anti_air_equipment` becomes scorpions. Tank chassis, armoured cars, motorised, mechanised, amphibious, rocket, railway guns, helicopters, missiles, nuclear weapons, floating harbours and all airframes except two are removed.

### 4. Land units

Stats are targets for a battalion with the 1748 baseline variant (`_1`), equipment and sub-unit combined. Org = organisation, HP = strength, SA/HA = soft/hard attack, Def, Brk = breakthrough, Arm = armour, Prc = piercing, Spd = km/h, W = combat width, MP = manpower, Days = training. Reference: men line infantry equals vanilla 1936 infantry.

#### 4.1 Men

| Key | Name | Role (HOI4 group, categories) | Needs | Org | HP | SA | HA | Def | Brk | Arm | Prc | Spd | W | MP | Days |
| --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `zin_men_levy` | Levy | infantry; militia, front_line, all_infantry | arms 80 | 40 | 20 | 4 | 0.5 | 16 | 1.5 | 0 | 2 | 4 | 2 | 1000 | 45 |
| `zin_men_infantry` | Line Infantry | infantry; front_line, light_infantry, all_infantry | arms 100 | 60 | 25 | 6 | 1 | 22 | 3 | 0 | 5 | 4 | 2 | 1000 | 90 |
| `zin_men_archers` | Archers | infantry; front_line, all_infantry, zin_archers | bows 100, arms 20 | 50 | 18 | 9 | 0.5 | 14 | 2 | 0 | 4 | 4 | 2 | 800 | 120 |
| `zin_men_heavy_infantry` | Heavy Infantry | infantry; front_line, all_infantry | arms 100, armour 60 | 55 | 28 | 7 | 2 | 28 | 6 | 8 | 8 | 3.5 | 2 | 1000 | 120 |
| `zin_men_hill_companies` | Hill Companies | infantry; special_forces, mountaineers | arms 100 | 70 | 25 | 6 | 1 | 24 | 4 | 0 | 5 | 4 | 2 | 1000 | 150 |
| `zin_men_sea_soldiers` | Sea Soldiers | infantry; special_forces, marines | arms 100 | 70 | 25 | 6 | 1 | 22 | 4 | 0 | 5 | 4 | 2 | 1000 | 150 |
| `zin_men_rangers` | Rangers | infantry; special_forces, rangers, zin_archers | bows 60, arms 40 | 70 | 22 | 7 | 1 | 18 | 5 | 0 | 6 | 5 | 2 | 800 | 150 |
| `zin_men_cavalry` | Cavalry | mobile; cavalry, front_line | mounts 100, arms 60 | 70 | 25 | 6 | 1 | 14 | 5 | 0 | 5 | 9 | 2 | 800 | 120 |
| `zin_men_horse_archers` | Horse Archers | mobile; cavalry, zin_archers | mounts 100, bows 80 | 60 | 20 | 9 | 0.5 | 10 | 6 | 0 | 4 | 9 | 2 | 700 | 150 |
| `zin_men_knights` | Knights | armor; tanks, all_armor | mounts 60, armour 60, arms 40 | 50 | 22 | 9 | 4 | 10 | 18 | 12 | 10 | 8 | 2 | 500 | 180 |
| `zin_men_camel_riders` | Camel Riders | mobile; cavalry | mounts (camel line) 100, arms 60 | 70 | 25 | 6 | 1 | 14 | 5 | 0 | 5 | 8 | 2 | 800 | 120 |
| `zin_men_temple_wardens` | Valley Wardens | infantry; special_forces | arms 80, armour 20 | 60 | 25 | 6 | 1 | 24 | 3 | 2 | 6 | 4 | 2 | 600 | 120 |

Terrain: rangers +20% attack in forest and hills; hill companies +25% attack and defence in hills and mountains; sea soldiers +40% amphibious attack; camel riders +20% attack in desert, -20% in forest and marsh; knights -30% attack in forest, marsh, mountain, urban. Camel riders need `zin_tech_camel_corps` (East Lands and desert realms; Noris camel warriors). Valley wardens are the Worshipdom's only unit; their name never mentions the Deliverer's nature.

#### 4.2 Elves and Sunhot elves

| Key | Name | Role | Needs | Org | HP | SA | HA | Def | Brk | Arm | Prc | Spd | W | MP | Days |
| --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `zin_elves_warden` | Elven Wardens | infantry; front_line, all_infantry | elven arms 100 | 75 | 25 | 8 | 2 | 28 | 5 | 2 | 10 | 5 | 2 | 700 | 160 |
| `zin_elves_archers` | Elven Archers | infantry; front_line, all_infantry, zin_archers | elven arms 100 | 60 | 18 | 11 | 1 | 16 | 3 | 0 | 6 | 5 | 2 | 600 | 160 |
| `zin_elves_riders` | Elven Riders | mobile; cavalry | mounts 80, elven arms 60 | 70 | 24 | 8 | 2 | 16 | 7 | 0 | 6 | 10 | 2 | 600 | 180 |
| `zin_elves_rangers` | Forest Rangers | infantry; special_forces, rangers | elven arms 100 | 75 | 22 | 9 | 1 | 20 | 5 | 0 | 8 | 5.5 | 2 | 600 | 180 |
| `zin_sun_elves_guard` | Sun Guard | infantry; front_line, all_infantry | elven arms 120 | 70 | 40 | 9 | 3 | 30 | 8 | 10 | 12 | 4.5 | 2 | 800 | 180 |
| `zin_sun_elves_bowmen` | Sun Bowmen | infantry; front_line, all_infantry, zin_archers | elven arms 100 | 65 | 30 | 12 | 1 | 18 | 4 | 2 | 6 | 4.5 | 2 | 700 | 180 |

Elven wardens and rangers +20% attack and defence in forest. Sunhot battalions are huge and few: high HP and armour, low recruitable population (people idea). Gala elves use the elven list; no text links Gala and Sunhot lineage.

#### 4.3 Orcs, goblins and ogres

| Key | Name | Role | Needs | Org | HP | SA | HA | Def | Brk | Arm | Prc | Spd | W | MP | Days |
| --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `zin_orcs_warrior` | Orc Warband | infantry; front_line, all_infantry | arms 100 | 45 | 25 | 8 | 1.5 | 16 | 5 | 2 | 5 | 4.5 | 2 | 1000 | 60 |
| `zin_orcs_goblins` | Goblin Skirmishers | infantry; militia, all_infantry | bows 60 | 35 | 15 | 5 | 0.5 | 12 | 3 | 0 | 2 | 5 | 1 | 600 | 30 |
| `zin_orcs_raiders` | Orc Raiders | mobile; cavalry | mounts 100, arms 60 | 45 | 22 | 8 | 1 | 10 | 6 | 0 | 4 | 9 | 2 | 800 | 90 |
| `zin_ogres_brutes` | Ogre Brutes | armor; zin_monsters, all_armor | ogre gear 40 | 40 | 50 | 12 | 6 | 14 | 14 | 15 | 10 | 4 | 3 | 300 | 120 |

Orc mounts are unnamed until the owner decides (open question 2). Orc warbands +10% attack at night (`land_night_attack` through the people idea). Ogres are available to orc realms and to Volgan.

#### 4.4 The great kin

| Key | Name | People | Role | Needs | Org | HP | SA | HA | Def | Brk | Arm | Prc | Spd | W | MP | Days |
| --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `zin_trolls_brute` | Troll Brutes | trolls | armor; zin_monsters | troll gear 40 | 40 | 60 | 14 | 8 | 16 | 16 | 22 | 14 | 3.5 | 3 | 250 | 150 |
| `zin_giants_host` | Giant Host | giants | armor; zin_monsters | giant gear 40 | 50 | 70 | 14 | 10 | 24 | 14 | 20 | 18 | 4 | 4 | 200 | 180 |
| `zin_giants_hurlers` | Giant Hurlers | giants | artillery; artillery, line_artillery, zin_siege | giant gear 30 | 30 | 30 | 30 | 5 | 6 | 2 | 10 | 12 | 4 | 3 | 150 | 180 |
| `zin_ents_grove` | Ent Grove | ents | armor; zin_monsters | grove wardings 40 | 60 | 90 | 10 | 12 | 40 | 8 | 30 | 20 | 2.5 | 4 | 150 | 240 |
| `zin_yeti_band` | Yeti Band | yeti | infantry; front_line, zin_monsters | yeti gear 60 | 55 | 40 | 10 | 3 | 20 | 10 | 6 | 6 | 5 | 3 | 300 | 120 |

Terrain: ents +40% defence and +20% attack in forest, -50% speed elsewhere; yeti +25% attack in snow-bound hills and mountains (terrain blocks) and no winter attrition (people idea); giants +30% attack against forts (`fort` block). Kilinti ("ents and forest peoples") and Hiloron also recruit men levies, archers and rangers. Troll Forest recruits goblin skirmishers beside its brutes (proposed).

#### 4.5 Demons

| Key | Name | Who | Role | Needs | Org | HP | SA | HA | Def | Brk | Arm | Prc | Spd | W | MP | Days |
| --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `zin_demons_netherborn` | Netherborn | Demon, Dolon, Nezer, Volgan | infantry; front_line, all_infantry | nether arms 100 | 60 | 35 | 12 | 4 | 16 | 12 | 10 | 12 | 5 | 2 | 400 | 150 |
| `zin_demons_shachihata` | Shachihata | granted only | armor; zin_monsters, special_forces | Shachihata 1 | 40 | 150 | 30 | 20 | 20 | 30 | 40 | 40 | 4 | 6 | 50 | 365 |
| `zin_demons_bound` | Bound Demons | Afrit's country, only after `zin_afrit_revealed` | infantry; front_line, all_infantry | nether arms 100 | 60 | 35 | 12 | 4 | 16 | 12 | 10 | 12 | 5 | 2 | 300 | 120 |

Netherborn ignore heat attrition and suffer +50% winter attrition (people idea). Bound demons are a separate unit from the Netherborn because the vault does not say all demons share one origin. Their technology, unit and equipment text is hidden until the reveal; the Afrit mechanic grants their technology.

#### 4.6 The dead

| Key | Name | Who | Role | Needs | Org | HP | SA | HA | Def | Brk | Arm | Prc | Spd | W | MP | Days |
| --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `zin_the_dead_revenant` | Grave Host | Volgan | infantry; front_line, all_infantry, zin_dead | grave arms 100 | 80 | 30 | 6 | 1 | 24 | 3 | 4 | 4 | 3.5 | 2 | 200 | 30 |
| `zin_dead_grave_riders` | Grave Riders | Volgan | mobile; cavalry, zin_dead | mounts 80, grave arms 60 | 70 | 28 | 7 | 1 | 14 | 6 | 4 | 5 | 8 | 2 | 200 | 60 |
| `zin_dead_necromancers` | Necromantic Order | Volgan | support company; support_battalions | grave arms 10 | 60 | 5 | 2 | 0 | 3 | 1 | 0 | 8 | - | 0 | 50 | 120 |
| `zin_zol_deathless` | The Deathless | Zol | infantry; front_line, all_infantry, zin_dead | deathless bonds 100 | 30 | 30 | 7 | 2 | 26 | 5 | 80 | 8 | 4 | 2 | 20 | 30 |
| `zin_zol_deathless_crews` | Black Ship Crews | Zol | infantry; marines, zin_dead | deathless bonds 100 | 30 | 25 | 7 | 2 | 22 | 5 | 80 | 8 | 4 | 2 | 20 | 30 |

- **Grave hosts** are cheap in manpower and slow. Necromantic orders add `casualty_trickleback` through the Grave Muster doctrine. **Grave-host strain (proposed):** monthly, Volgan's grave-host battalions standing outside the Dead Lands lose 2% strength (section 6.5). This extends the established fading of Elzon's corpses outside the Dead Lands; it says nothing about how Volgan's dead relate to Zol's.
- **The deathless** have very high armour and low organisation. Ordinary arms break their shapes (they lose organisation and retreat) but barely harm their strength. Zol refills them from his growing power, not from manpower (section 6.1).

#### 4.7 Siege

| Key | Name | Role | Needs | Org | HP | SA | HA | Def | Brk | Arm | Prc | Spd | W | MP | Days |
| --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `zin_siege_catapult` | Catapults | artillery; artillery, line_artillery, zin_siege | catapults 12 | 20 | 6 | 22 | 2 | 6 | 2 | 0 | 5 | 3.5 | 3 | 500 | 120 |
| `zin_siege_trebuchet` | Trebuchets | artillery; artillery, line_artillery, zin_siege | trebuchets 8 | 15 | 6 | 36 | 4 | 4 | 2 | 0 | 8 | 2.5 | 4 | 600 | 150 |
| `zin_support_catapults` | Catapult Company | support; artillery, support_artillery, zin_siege | catapults 6 | 0 | 0.6 | 12 | 1 | 4 | 1 | 0 | 5 | 3.5 | 0 | 300 | 120 |
| `zin_support_ballistae` | Ballista Company | support; anti_tank, zin_siege | ballistae 6 | 0 | 0.6 | 2 | 12 | 6 | 1 | 0 | 40 | 3.5 | 0 | 300 | 120 |
| `zin_support_scorpions` | Scorpion Company | support; anti_air, zin_siege | scorpions 6 | 0 | 0.6 | 1 | 1 | 4 | 0 | 0 | 5 | 3.5 | 0 | 300 | 120 |

Catapults get `fort = { attack = 0.4 }`, trebuchets `fort = { attack = 0.8 }`, giant hurlers `fort = { attack = 0.5 }`. Scorpions have air attack 12. Scorpion companies exist only when the sky rule is not "none".

#### 4.8 Camp (support companies)

| Key | Name | Replaces | Needs | Effect target |
| --- | --- | --- | --- | --- |
| `zin_support_scouts` | Scouts | recon | camp gear 10, mounts 10 | recon 2; +10% forest and hills movement |
| `zin_support_sappers` | Sappers | engineer | camp gear 20 | breakthrough +0.5 multiplier; `fort = { attack = 0.25 }`; `river = { attack = 0.2 }` |
| `zin_support_healers` | Field Healers | field hospital | camp gear 20 | casualty trickleback 0.3; experience loss -30% |
| `zin_support_heralds` | Heralds and Beacons | signal | camp gear 10 | initiative +15% |
| `zin_support_quartermasters` | Quartermasters | logistics | camp gear 20 | supply use -15% |
| `zin_support_provosts` | Provosts | military police | camp gear 10 | suppression +; occupation garrisons |
| `zin_support_armourers` | Armourers | maintenance | camp gear 20 | reliability +; equipment capture |
| `zin_support_wardens` | Wardens | (new) | wards 20 | piercing 30 (`_1`) to 45 (`_3`); soft attack small |
| `zin_elves_wardsingers` | Wardsingers | (new) | wards 20 | piercing 50; org +5 for the division |

Ents, yeti and trolls may use scouts only. Orcs may not use healers or heralds. Volgan replaces healers with necromantic orders.

#### 4.9 Great beings (support companies of one)

| Key | Name | Equipment | Granted by | Effect target |
| --- | --- | --- | --- | --- |
| `zin_glo_bearer` | The Bearer of Glo | `zin_glo_blade_equipment` 1 | Eindil's journey, on `zin_glo_with_eindil`, to the country Eindil serves | Piercing 300, SA 20, HA 20; division piercing then passes the deathless armour |
| `zin_volgan_presence` | Volgan Himself | `zin_volgan_presence_equipment` 1 | Volgan mechanic, on `zin_volgan_marches` | SA 60, HA 30, piercing 200; removed on `zin_volgan_body_destroyed` |
| `zin_great_spirit` | A Great Spirit | `zin_great_spirit_equipment` 1 each | Volgan mechanic (his "great spirits"), up to 3 | SA 15, piercing 60, org +10 |
| `zin_zol_manifestation` | Zol Made Flesh | `zin_zol_manifestation_equipment` 1 | Zol mechanic, on `zin_zol_manifested`, for a limited time | SA 100, HA 60, piercing 300; removed on `zin_zol_withdrawn` |

A great being can only exist in a division that also has at least one line battalion. Each has `category_zin_great_beings` so doctrines and scripts can find it.

#### 4.10 Who recruits what

| People | Line battalions | Siege | Camp | Notes |
| --- | --- | --- | --- | --- |
| men | 4.1 | all | all | Camel riders by region; valley wardens Worshipdom only |
| elves | 4.2 elves | ballistae, scorpions, catapults | scouts, sappers, healers, heralds, wardsingers | Dragon flights by pact |
| sun_elves | 4.2 Sunhot | ballistae, scorpions | scouts, healers, heralds | |
| orcs | 4.3 | catapults | scouts, sappers, provosts, armourers | |
| trolls | troll brutes, goblin skirmishers | none | scouts | |
| giants | 4.4 giants, plus men levy, infantry, archers | hurlers, catapults | all | Hiloron, Titanos |
| ents | ent groves, plus men levy, archers, rangers | none | scouts, healers | Kilinti |
| yeti | yeti bands | none | scouts | |
| demons | Netherborn | catapults | scouts, sappers | Shachihata by grant |
| the_dead (Volgan) | grave hosts, grave riders, orcs, ogres, Netherborn | catapults, trebuchets, ballistae | scouts, sappers, necromancers, quartermasters | Great beings by grant |
| the_dead (Zol) | deathless, black ship crews | none | none | Great being by grant |

### 5. Armour, piercing and the deathless

The vanilla piercing table is replaced (define, section Implementation):

| Our piercing / their armour | Damage dealt |
| --- | --- |
| 1.00 or more | 100% |
| 0.75 | 80% |
| 0.50 | 60% |
| 0.25 | 35% |
| below 0.25 | 10% |

Division piercing is the engine's blend of the best and the average sub-unit piercing (`NMilitary.ARMOR_VS_AVERAGE = 0.4`, unchanged). This gives:

| Attacker | Division piercing (target) | vs troll brutes (22) | vs deathless (80) |
| --- | ---: | --- | --- |
| Men line host, 1748 | 5 to 8 | 35% | 10% |
| Men host with ballista company | 18 to 22 | 80% to 100% | 10% |
| Men host with wardens `_3` and hallowed arms | 28 to 32 | 100% | 35% |
| Elven host with wardsingers | 28 to 34 | 100% | 35% |
| Any host with the bearer of Glo | 120 or more | 100% | 100% |

**Balance invariant (testable).** No mortal or elven technology at any year up to 4A 1790 lifts a division's piercing to half the deathless armour. Only the bearer of Glo, the Glo shockwave (6.2) and the softened game rule break this. This keeps the established rule: ordinary arms cannot end Zol's dead; only potent magic can.

### 6. Special units and their rules

#### 6.1 Zol's deathless

- `zin_deathless_equipment` cannot be produced. Each month the Zol mechanic calls `zin_war_feed_deathless`, which adds `zin_mistake_power × 25` bonds to Zol's stockpile (target: 0 at power 0, 2,500 a month at power 100). Before `zin_zol_rising` the feed is capped at what keeps the starting garrison full.
- The deathless sub-units need almost no manpower (20). Zol's realm is "almost empty of the living".
- Zol's army idea `zin_war_deathless_nature`: `attrition = -0.75`, `winter_attrition_factor = -1`, `heat_attrition_factor = -0.5`, `out_of_supply_factor = -0.8`, `no_supply_grace = 240`, `army_org_regain = 0.25` (they re-form fast).
- Zol's divisions have no named commanders. The generator gives Zol nameless unit leaders shown as "a Deathless Captain" with no portrait text implying an administrator (open question 6).
- Game rule `zin_rule_deathless = softened` adds idea `zin_war_deathless_softened` to Zol: `equipment_bonus = { zin_deathless_equipment = { armor_value = -45 } }`.

#### 6.2 Glo

- On `zin_glo_with_eindil`, `zin_war_grant_glo_bearer` gives the country holding `zin_eindil` one `zin_glo_blade_equipment`, creates the template "The Host of the Ice" (`zin_eindil_host`: 6 men infantry or the country's line battalions, 2 archers, the bearer, scouts) and spawns one division led by Eindil. Eindil gets unit leader trait `zin_trait_glo_bearer`.
- **Glo shockwave** decision `zin_war_glo_shockwave` (state-targeted, for the country holding the bearer): available when Eindil's division is in or next to a state holding Zol's divisions. Effect: `damage_units` on Zol's divisions in that state, `org_damage = 1.0`, `str_damage = 0.6`. Cost 50 command power; cooldown 60 days. Unavailable after `zin_zol_manifested` (the blade is crushed, established).
- After `zin_zol_manifested`, the bearer's equipment is swapped to the "Shard" variant: piercing 120 instead of 300 (it still wounds the manifestation, established; how much Glo keeps is open, see open question 5).

#### 6.3 Dragons

- Dragon flights are air wings of `zin_air_dragon_flight` with `land_air_wing_size = 3`. `zin_dragon_equipment` cannot be produced.
- `zin_war_grant_dragons` (country scope, argument `amount`) adds dragons to the stockpile and adds `amount` to `zin_dragon_flights`. Only the magic and world systems spec decides who receives dragons and when: elven realms through pacts with Dragon Mountain, Afrit's country through corruption after the reveal, and the dragon Eindil rides in 4A 1757 (one dragon to the country Eindil serves).
- Lost dragons are not replaced. A country never holds more dragons than `zin_dragon_flights × 3`.
- With `zin_rule_skies = none`, dragons are not air wings. `zin_war_grant_dragons` then adds the timed idea `zin_war_dragon_ally` (`army_attack_factor = 0.05`, `army_morale_factor = 0.05`) for 180 days per flight.

#### 6.4 Volgan's presence and great spirits

`zin_volgan_presence` appears with `zin_volgan_marches` in a division led by `zin_volgan`. On `zin_volgan_body_destroyed`, `zin_war_remove_volgan_presence` removes the equipment from stockpile and divisions, and the company is deleted. Text says only that his body is broken.

#### 6.5 Grave-host strain

Monthly (`zin_war.20`, hidden), for each state outside the Dead Lands (`NOT = { zin_is_region_dead_lands = yes }`) where Volgan has divisions (`divisions_in_state` with `unit = zin_the_dead_revenant`), `damage_units` deals `str_damage = 0.02` to Volgan's grave-host templates there. Necromantic orders halve it (two template families: with and without necromancers). The Volgan mechanic may lift it with `zin_dominion_strength` above 80.

### 7. Navies

#### 7.1 Ships

| Sub-unit | Name | HOI4 type | Hull | HP | Org | Speed (kn) | Range (km) | Light atk | Heavy atk | Ram (torpedo) | Armour | AA | Visibility | Notes |
| --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| `zin_ship_galley` | War Galley | screen_ship | `zin_hull_galley` | 40 | 40 | 22 | 500 | 3 | 0 | 10 | 1 | 1 | 9 | Fast, short-ranged; lookouts give sub detection 6 |
| `zin_ship_warship` | Warship | capital_ship | `zin_hull_warship` | 180 | 35 | 16 | 2500 | 6 | 14 | 0 | 8 | 3 | 18 | Sails; ballista decks |
| `zin_ship_great_warship` | Great Warship | capital_ship | `zin_hull_great_warship` | 320 | 35 | 14 | 3000 | 8 | 24 | 0 | 14 | 4 | 26 | 4A 1758 |
| `zin_ship_raider` | Corsair | submarine | `zin_hull_raider` | 30 | 35 | 18 | 2000 | 0 | 0 | 12 | 0 | 0 | 3 | Hidden raider; convoy raiding |

The ram uses the torpedo stat: big early-round damage at close range. Raiders use submarine stealth for corsairs and Zol's black ships.

#### 7.2 Modules (fixed slots; no free slots)

| Slot | Modules |
| --- | --- |
| `fixed_propulsion` | Oars (galley), Sails, Oars and Sail, Elven Sails (elves; +speed, +range), Black Sails (Zol; no crew needed) |
| `fixed_armament` (1 to 3 by hull) | Ram, Ballista Battery, Catapult Deck, Fire-Pots, Archers' Deck |
| `fixed_protection` | Planking, Bronze Sheathing, Warded Hull (wards; resists boarding by the dead) |
| `fixed_crew` | Boarding Party (marines; naval invasion), Lookouts (detection), Rowers' Benches (galley speed) |

Each hull has default modules and the history creates named variants, so navies work with or without the ship designer. Critical parts reuse fitting vanilla parts (`on_fire`, `rudder_jammed`) re-localised.

#### 7.3 The sea and the story

- **The wide central sea.** Galleys cannot cross it. A western invasion of Aenor needs `zin_tech_deep_water_hulls` (navy range +20%, ocean-going cogs). Acceptance checks that a West Lands naval invasion plan to Aenor's coast is valid after that technology and invalid without it.
- **The Dead Lands storms.** The map and world systems specs put a permanent storm and attrition on Dead Lands sea zones. `zin_tech_storm_rigging` (`naval_attrition = -0.15`) eases it.
- **Lerendor guards the strait** (proposed detail): strong galley and warship fleet at start.
- **Black ships** (proposed 4A 1744 rumour): Zol starts with three corsairs among the islands of the Ocean of Zol; they stay in Zol's waters until `zin_zol_rising`.

### 8. The skies

Game rule `zin_rule_skies`:

| Option | Effect |
| --- | --- |
| `beasts` (default) | Griffin riders (fighter) for men; dragon flights (close support, port and naval strike) by grant |
| `dragons_only` | Dragon flights only; the Eyries folder shows dragon lore only; scorpions stay |
| `none` | No air units; the Eyries folder and scorpions hidden; dragons become the timed idea of 6.3 |

| Sub-unit | Name | HOI4 type | Wing size | Air atk | Air def | Agility | Speed | Range | Ground atk | Naval strike | Cost |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| `zin_air_griffin_riders` | Griffin Riders | fighter | 20 | 18 | 14 | 45 | 150 | 300 | 2 | 0 | 3 IC each |
| `zin_air_dragon_flight` | Dragon Flight | cas | 3 | 60 | 150 | 25 | 220 | 900 | 90 | 30 | granted |

Griffins are a proposed creature (open question 1). Air bases are **eyries**. Strategic bombing, naval bombers, transports, scouts, carriers and missiles are removed. Air superiority matters less: `NMilitary.ENEMY_AIR_SUPERIORITY_IMPACT = -0.20`, `ENEMY_AIR_SUPERIORITY_SPEED_IMPACT = -0.15`. Volgan and Zol have no fliers unless a mechanic grants dragons (open question 3).

If the engine requires modular airframes for air sub-units, each beast is a frame with one fixed slot and one default module, and no designer choices.

### 9. Fortification and the Great Wall

Building keys stay: `bunker` = stone fort, `coastal_bunker` = sea fort. Forts are placed by the map and politics steps; this table is their target.

| Site | Fort | Source |
| --- | --- | --- |
| The Great Wall of Aenor: every wall-side province on the Aenor side (`zin_is_site_great_wall`) | land 5 | Map spec G5 |
| Kingson's wall gate province | land 6 | Key sites (wall gate) |
| Mirolon's northern passes | land 4 | Key sites (proposed) |
| Isengard's border with Coldor | land 3 | Start situation ("fortified rival") |
| Parim | land 3, sea 2 | Capital |
| Sonargur and the strait | sea 3 | Key sites |
| Great Lake ports | sea 1 | Key sites |
| Nafeher | land 4 | Volgan's seat (proposed) |

Wall states carry the dynamic modifier `zin_war_great_wall` (state scope): `land_bunker_effectiveness_factor = 0.20`, `local_supply_impact_factor = -0.10`, `enemy_army_speed_factor = -0.10`. It applies to whoever controls the state. The world systems spec owns wall upkeep, garrisons and the wall's story; this spec owns the forts and the modifier. Wall technology: `zin_tech_wall_wardens`, `zin_tech_bastions`, `zin_tech_curtain_walls` (section 11).

### 10. Logistics

- Railways are **the high roads**; trains are **wagon trains** (`train_equipment` key kept); supply trucks are **pack trains** (`motorized_equipment` key kept, variants `_0` to `_2`). No combat unit needs them.
- Supply hubs are **depots**. Their art and names change; their mechanics do not.
- Winter and heat matter more: Cold Lands and Dead Lands attrition comes from the map (terrain, weather) and the people ideas; technologies `zin_tech_winter_quarters` and `zin_tech_water_caravans` reduce it.

### 11. Technology tree

Fourth Age years. Techs at or before 1745 are starting knowledge (by package, section 13). The historical campaign runs 1748 to 1760; late techs run to 1790 for the sandbox. `research_cost` 1.5 for starting-era techs, 2.0 for 1748–1760, 2.5 after. Folders are proposed; the interface spec draws them.

| Folder key | Name | Ledger |
| --- | --- | --- |
| `zin_arms_folder` | Arms and Armour | army |
| `zin_mounts_folder` | Mounts and Kin | army |
| `zin_engines_folder` | Engines and Walls | army |
| `zin_lore_folder` | Lore and Wards | army |
| `zin_camp_folder` | Camp and Road | army |
| `zin_naval_folder` | Galleys and Warships | navy |
| `zin_skies_folder` | Eyries (hidden when `zin_rule_skies = none`) | air |

The economy spec re-themes `industry_folder` and `electronics_folder`. No ZIN folder has a DLC condition.

New technology categories (`common/technology_tags`): `zin_cat_arms`, `zin_cat_bows`, `zin_cat_armour`, `zin_cat_mounts`, `zin_cat_kin`, `zin_cat_siege`, `zin_cat_walls`, `zin_cat_wards`, `zin_cat_dark_rites`, `zin_cat_camp`, `zin_cat_galleys`, `zin_cat_warships`, `zin_cat_skies`. Focus and idea research bonuses name these.

`allow_branch` limits people branches; the triggers use `has_country_flag = zin_people_<key>` and, for Volgan, Zol and the Worshipdom, the generator-resolved country.

#### 11.1 Arms and Armour

| Key | Name | Year | Requires | Unlocks / effect | Who |
| --- | --- | ---: | --- | --- | --- |
| `zin_tech_iron_arms` | Iron Arms | 1600 | - | arms `_0`; levy, line infantry | all with arms |
| `zin_tech_forged_steel` | Forged Steel | 1700 | iron arms | arms `_1` | |
| `zin_tech_tempered_steel` | Tempered Steel | 1749 | forged steel | arms `_2` | |
| `zin_tech_pattern_welding` | Pattern-Welded Blades | 1753 | tempered | arms `_3` | |
| `zin_tech_master_forges` | The Master Forges | 1758 | pattern | arms `_4` | |
| `zin_tech_mountain_steel` | Mountain Steel | 1772 | master forges | arms `_5` | |
| `zin_tech_hunting_bows` | Hunting Bows | 1600 | - | bows `_0`; archers | men, orcs |
| `zin_tech_composite_bows` | Composite Bows | 1700 | hunting bows | bows `_1` | |
| `zin_tech_war_longbows` | War Longbows | 1750 | composite | bows `_2` | |
| `zin_tech_crossbows` | Crossbows | 1754 | longbows | bows `_3` (piercing +3) | |
| `zin_tech_windlass_crossbows` | Windlass Crossbows | 1762 | crossbows | bows `_4` | |
| `zin_tech_mail` | Mail Shirts | 1650 | iron arms | armour `_0`; heavy infantry | men, orcs, giants |
| `zin_tech_plate_and_mail` | Plate and Mail | 1720 | mail | armour `_1` | |
| `zin_tech_full_plate` | Full Plate | 1752 | plate and mail | armour `_2` | |
| `zin_tech_tempered_plate` | Tempered Plate | 1759 | full plate | armour `_3` | |
| `zin_tech_masterwork_plate` | Masterwork Plate | 1775 | tempered plate | armour `_4` | |
| `zin_tech_shield_wall_drill` | Shield-Wall Drill | 1700 | mail | `category_all_infantry` defence +5% | |
| `zin_tech_hill_companies` | Hill Companies | 1720 | iron arms | hill companies | men |
| `zin_tech_sea_soldiers` | Sea Soldiers | 1730 | iron arms | sea soldiers | men |
| `zin_tech_ranger_craft` | Ranger Craft | 1740 | composite bows | rangers | men |
| `zin_tech_pike_squares` | Pike Squares | 1755 | tempered steel | infantry defence +5%, breakthrough +5% | men |
| `zin_tech_veteran_sergeants` | Veteran Sergeants | 1763 | pike squares | infantry org +5 | |
| `zin_tech_elven_arms` | Elven Arms | 1500 | - | elven arms `_0`, `_1`; wardens, archers | elves, sun_elves |
| `zin_tech_leaf_steel` | Leaf-Steel | 1750 | elven arms | elven arms `_2` | elves, sun_elves |
| `zin_tech_elven_mastery` | Elven Mastery | 1760 | leaf-steel | elven arms `_3` | elves, sun_elves |
| `zin_tech_forest_rangers` | Forest Rangers | 1600 | elven arms | elven rangers | elves |
| `zin_tech_sun_guard` | The Sun Guard | 1500 | elven arms | Sun Guard, Sun Bowmen | sun_elves |
| `zin_tech_warband_iron` | Warband Iron | 1600 | - | orc warbands, goblins | orcs, trolls, the_dead (Volgan) |
| `zin_tech_blackened_iron` | Blackened Iron | 1752 | warband iron | orc and goblin attack +10% | orcs |
| `zin_tech_valley_wardens` | Valley Wardens | 1600 | iron arms | valley wardens | Worshipdom |

#### 11.2 Mounts and Kin

| Key | Name | Year | Requires | Unlocks / effect | Who |
| --- | --- | ---: | --- | --- | --- |
| `zin_tech_riding_horses` | Riding Horses | 1600 | - | mounts `_0`; cavalry | men, elves, orcs, Volgan |
| `zin_tech_war_horses` | War Horses | 1700 | riding horses, mail | mounts `_1`; knights | men |
| `zin_tech_camel_corps` | Camel Corps | 1650 | riding horses | camel line; camel riders | men of the East Lands and desert realms |
| `zin_tech_horse_archery` | Horse Archery | 1740 | war horses, composite bows | horse archers | men |
| `zin_tech_great_studs` | Great Studs | 1751 | war horses | mounts `_2` | |
| `zin_tech_couched_lance` | The Couched Lance | 1755 | great studs | knights breakthrough +10% | men |
| `zin_tech_remount_depots` | Remount Depots | 1760 | great studs | cavalry org +5, reinforce | |
| `zin_tech_plains_destriers` | Destriers of the Plains | 1768 | remount depots | mounts `_3` | |
| `zin_tech_elven_steeds` | Elven Steeds | 1500 | elven arms | elven riders | elves |
| `zin_tech_raider_mounts` | Raider Mounts | 1650 | warband iron | orc raiders | orcs |
| `zin_tech_troll_brood` | Troll Brood | 1600 | - | troll gear `_0`; brutes | trolls |
| `zin_tech_giant_kin` | Giant Kin | 1600 | - | giant gear `_0`; host, hurlers | giants |
| `zin_tech_ent_moots` | The Moots | 1500 | - | grove wardings `_0`; groves | ents |
| `zin_tech_yeti_hunts` | Yeti Hunts | 1600 | - | yeti gear `_0`; bands | yeti |
| `zin_tech_ogre_pacts` | Ogre Pacts | 1650 | warband iron | ogre gear `_0`; ogres | orcs, Volgan |
| `zin_tech_kin_harness` | Kin Harness | 1752 | any kin tech | all kin gear `_1` | kin peoples, orcs, Volgan |
| `zin_tech_kin_mastery` | Kin Mastery | 1764 | kin harness | all kin gear `_2` | |

#### 11.3 Engines and Walls

| Key | Name | Year | Requires | Unlocks / effect | Who |
| --- | --- | ---: | --- | --- | --- |
| `zin_tech_catapults` | Catapults | 1600 | - | catapults `_0`; catapult battalion and company | men, orcs, the_dead, giants, demons |
| `zin_tech_torsion_engines` | Torsion Engines | 1700 | catapults | catapults `_1`; ballistae `_0`; ballista company | men, elves, sun_elves, the_dead |
| `zin_tech_trebuchets` | Counterweight Trebuchets | 1750 | torsion | trebuchets `_0`; trebuchet battalion | men, the_dead |
| `zin_tech_scorpions` | Scorpions | 1751 | torsion | scorpions `_0`; scorpion company (sky rule on) | men, elves, sun_elves |
| `zin_tech_siege_towers` | Siege Towers and Rams | 1752 | catapults | sappers breakthrough +10% | |
| `zin_tech_fire_pots` | Fire-Pots | 1753 | torsion | catapult soft attack +10% | |
| `zin_tech_great_engines` | Great Engines | 1757 | trebuchets | catapults `_2`, trebuchets `_1`, ballistae `_1` | |
| `zin_tech_engine_corps` | Engine Corps | 1763 | great engines | siege org +5, reliability | |
| `zin_tech_master_engines` | Master Engines | 1772 | engine corps | catapults `_3`, trebuchets `_2`, ballistae `_2`, scorpions `_1` | |
| `zin_tech_stone_forts` | Stone Forts | 1600 | - | (forts buildable; baseline) | all |
| `zin_tech_layered_walls` | Layered Walls | 1700 | stone forts | `land_bunker_effectiveness_factor = 0.10` | |
| `zin_tech_harbour_chains` | Harbour Chains | 1720 | stone forts | `coastal_bunker_effectiveness_factor = 0.10` | |
| `zin_tech_wall_wardens` | Wall Wardens | 1749 | layered walls | `max_dig_in = 2`, `dig_in_speed_factor = 0.10` | |
| `zin_tech_bastions` | Bastions | 1756 | wall wardens | `land_bunker_effectiveness_factor = 0.15` | |
| `zin_tech_curtain_walls` | Curtain Walls | 1762 | bastions | land and coastal effectiveness +0.10 | |

#### 11.4 Lore and Wards

| Key | Name | Year | Requires | Unlocks / effect | Who |
| --- | --- | ---: | --- | --- | --- |
| `zin_tech_field_healers` | Field Healers | 1650 | - | camp gear; healers company | living peoples |
| `zin_tech_lantern_wards` | Lantern Wards | 1700 | field healers | wards `_1`; wardens company (piercing 30) | men, giants |
| `zin_tech_hallowed_arms` | Hallowed Arms | 1755 | lantern wards; `has_global_flag = zin_zol_rising` | wards `_2` (piercing 38); arms piercing +2 via `equipment_bonus` | men, giants |
| `zin_tech_wards_against_death` | Wards Against Death | 1757 | hallowed arms; `zin_zol_rising` | wards `_3` (piercing 45) | men, giants |
| `zin_tech_wardsong` | Wardsong | 1500 | elven arms | wards (elven line, piercing 50); wardsingers | elves |
| `zin_tech_old_songs` | The Old Songs | 1752 | wardsong | elven battalions org +5 | elves, sun_elves |
| `zin_tech_grave_binding` | Grave Binding | 1600 | - | grave arms `_0`, `_1`; grave hosts | Volgan |
| `zin_tech_necromantic_orders` | Necromantic Orders | 1650 | grave binding | necromancers | Volgan |
| `zin_tech_deeper_rites` | Deeper Rites | 1752 | necromantic orders | grave arms `_2`; grave host org +10 | Volgan |
| `zin_tech_grave_riders` | Grave Riders | 1754 | deeper rites, riding horses | grave riders | Volgan |
| `zin_tech_nether_pacts` | Nether Pacts | 1600 | - | nether arms `_0`, `_1`; Netherborn | demons, Volgan |
| `zin_tech_nether_forges` | Nether Forges | 1753 | nether pacts | nether arms `_2` | demons, Volgan |
| `zin_tech_bound_demons` | (hidden name until reveal) | 1700 | `zin_afrit_revealed` | bound demons | Afrit's country; granted by the Afrit mechanic |
| `zin_tech_deathless_tide_1` to `_3` | The Deathless Tide | 1600 / 1755 / 1758 | not researchable; granted at `zin_mistake_power` 0, 40, 70 | deathless bonds `_0` to `_2`; crews; black sails | Zol |

Rites and tide techs sit in the folder only for the countries that may have them (`allow_branch`), so no other player sees them.

#### 11.5 Camp and Road

| Key | Name | Year | Requires | Unlocks / effect |
| --- | --- | ---: | --- | --- |
| `zin_tech_scouts` | Scouts | 1600 | - | scouts company |
| `zin_tech_sappers` | Sappers | 1650 | scouts | sappers company |
| `zin_tech_wagon_trains` | Wagon Trains | 1680 | - | `train_equipment_0` |
| `zin_tech_supply_columns` | Supply Columns | 1700 | wagon trains | `motorized_equipment_0`; `supply_factor = 0.05` |
| `zin_tech_heralds` | Heralds and Beacons | 1700 | scouts | heralds company |
| `zin_tech_quartermasters` | Quartermasters | 1720 | supply columns | quartermasters company |
| `zin_tech_provosts` | Provosts | 1730 | sappers | provosts company |
| `zin_tech_armourers` | Armourers | 1740 | sappers | armourers company |
| `zin_tech_high_roads` | The High Roads | 1745 | supply columns | `train_equipment_1`, `motorized_equipment_1`; `supply_node_range = 0.10` |
| `zin_tech_winter_quarters` | Winter Quarters | 1750 | quartermasters | `winter_attrition_factor = -0.10` |
| `zin_tech_water_caravans` | Water Caravans | 1750 | quartermasters | `heat_attrition_factor = -0.10` |
| `zin_tech_war_camps` | War Camps | 1753 | quartermasters | `land_reinforce_rate = 0.02` |
| `zin_tech_field_kitchens` | Field Kitchens | 1758 | war camps | `attrition = -0.05` |
| `zin_tech_great_depots` | Great Depots | 1764 | field kitchens | `motorized_equipment_2`; `supply_factor = 0.10` |

#### 11.6 Galleys and Warships

| Key | Name | Year | Requires | Unlocks / effect | Who |
| --- | --- | ---: | --- | --- | --- |
| `zin_tech_oared_galleys` | Oared Galleys | 1600 | - | galley hull `_0`; oars, ram, archers' deck, planking | all coastal |
| `zin_tech_merchant_cogs` | Merchant Cogs | 1600 | - | `convoy_0` | all coastal |
| `zin_tech_harbour_works` | Harbour Works | 1650 | cogs | naval base repair +; lookouts | |
| `zin_tech_sailing_warships` | Sailing Warships | 1680 | cogs | warship hull `_0`; sails, oars and sail | |
| `zin_tech_triton_charts` | The Triton Charts | 1702 | sailing warships | `navy_max_range_factor = 0.10` | |
| `zin_tech_war_galleys` | War Galleys | 1730 | oared galleys | galley hull `_1`; ballista battery, rowers' benches | |
| `zin_tech_corsair_craft` | Corsair Craft | 1730 | war galleys | raider hull `_0` | |
| `zin_tech_high_castled_warships` | High-Castled Warships | 1745 | sailing warships | warship hull `_1`; catapult deck | |
| `zin_tech_boarding_parties` | Boarding Parties | 1749 | war galleys | boarding party; `naval_invasion_capacity = 10` | |
| `zin_tech_deep_water_hulls` | Deep-Water Hulls | 1752 | high-castled | `navy_max_range_factor = 0.20`; `convoy_1` (ocean cogs) | |
| `zin_tech_fire_ships` | Fireships | 1753 | boarding parties | fire-pots | |
| `zin_tech_bronze_sheathing` | Bronze Sheathing | 1755 | deep-water | bronze sheathing | |
| `zin_tech_great_warships` | Great Warships | 1758 | deep-water | great warship hull `_0` | |
| `zin_tech_storm_rigging` | Storm Rigging | 1760 | deep-water | `naval_attrition = -0.15` | |
| `zin_tech_master_shipwrights` | Master Shipwrights | 1765 | great warships | all hulls next variant | |
| `zin_tech_warded_hulls` | Warded Hulls | 1757 | lantern wards; `zin_zol_rising` | warded hull | men |
| `zin_tech_elven_hulls` | Elven Hulls | 1500 | oared galleys | elven sails | elves (Gala's ships, Lorien's gift) |

#### 11.7 Eyries (air; rule-dependent)

| Key | Name | Year | Requires | Unlocks | Who |
| --- | --- | ---: | --- | --- | --- |
| `zin_tech_eyries` | Eyries | 1700 | - | griffins `_0`; griffin riders | men; rule `beasts` |
| `zin_tech_griffin_harness` | Griffin Harness | 1752 | eyries | griffins `_1` | |
| `zin_tech_sky_lances` | Sky Lances | 1758 | harness | griffins `_2` | |
| `zin_tech_dragon_lore` | Dragon Lore | 1500 | - | dragon flight sub-unit (dragons only by grant) | elves; any country granted dragons gets it with the grant |
| `zin_tech_dragon_kinship` | Dragon Kinship | 1755 | dragon lore | dragons `air_attack` +10% via `equipment_bonus` | elves |

### 12. Doctrines

ZIN uses the doctrine system of grand doctrines, tracks and subdoctrines. All vanilla land, sea and air doctrines are replaced. The special forces folder is removed (it is DLC-gated and hidden). Each grand doctrine has `available` and `visible` on the people (and country, for Volgan and Zol).

#### 12.1 Land tracks

| Track | Name | Mastery from |
| --- | --- | --- |
| `zin_track_foot` | Foot | `category_all_infantry` |
| `zin_track_siege` | Siege | `category_artillery`, `category_line_artillery`, `category_support_battalions` |
| `zin_track_mounted` | Mounted and Kin | `category_cavalry`, `category_all_armor`, `category_zin_monsters` |
| `zin_track_command` | Command | all front-line categories |

#### 12.2 Land grand doctrines

| Key | Name | People | Activation effects (targets) | Milestones (foot / siege / mounted / command) |
| --- | --- | --- | --- | --- |
| `zin_gd_shield_wall` | The Shield Wall | men | `army_defence_factor = 0.10`, `max_dig_in = 2` | infantry defence +5% / `army_artillery_attack_factor = 0.05` / cavalry org +5 / `planning_speed = 0.10` |
| `zin_gd_horse_and_lance` | Horse and Lance | men | `army_speed_factor = 0.05`, `cavalry_attack_factor = 0.10` | `org_loss_when_moving = -0.10` / support catapults +5% / knights breakthrough +10% / `breakthrough_factor = 0.05` |
| `zin_gd_great_muster` | The Great Muster | men, orcs | `conscription_factor = 0.15`, `land_reinforce_rate = 0.02` | levy and warband org +5 / siege reliability / `cavalry_defence_factor = 0.05` / `combat_width_factor = -0.05` |
| `zin_gd_old_ways` | The Old Ways | elves | `terrain_penalty_reduction = 0.15`, `experience_gain_army_factor = 0.10` | archers soft attack +10% / ballistae +5% / riders speed +10% / `initiative_factor = 0.10` |
| `zin_gd_sun_guard` | The Sun Guard | sun_elves | `army_defence_factor = 0.15`, `army_org_factor = 0.05` | guard HP +10% / scorpions +10% / riders org +5 / `max_planning = 0.10` |
| `zin_gd_warband` | Blood and Warband | orcs, trolls | `army_attack_factor = 0.10`, `land_night_attack = 0.10` | warband attack +10% / catapults +5% / ogres and trolls breakthrough +10% / `org_loss_at_low_org_factor = -0.10` |
| `zin_gd_strength_of_the_wild` | Strength of the Wild | giants, ents, yeti | `army_defence_factor = 0.10`, `attrition = -0.10` | kin defence +10% / hurlers +10% / kin attack +10% / `dig_in_speed_factor = 0.20` |
| `zin_gd_nether_fury` | Nether Fury | demons | `army_attack_factor = 0.10`, `army_morale_factor = 0.10` | Netherborn attack +10% / catapults +5% / Shachihata HP +10% / `breakthrough_factor = 0.10` |
| `zin_gd_grave_muster` | The Grave Muster | Volgan | `army_org_factor = 0.10`, `casualty_trickleback = 0.10` | grave host defence +10% / trebuchets +10% / grave riders speed +10% / `org_damage_multiplier = 0.05` |
| `zin_gd_deathless_tide` | The Deathless Tide | Zol | `army_org_regain = 0.15`, `attrition = -0.20` | deathless defence +10% / none / none / `planning_speed = 0.15` |

XP cost 100, as vanilla. Unit-specific bonuses are written as sub-unit or category blocks in the doctrine, not as country modifiers.

#### 12.3 Land subdoctrines

| Track | Subdoctrines (key: theme) |
| --- | --- |
| Foot | `zin_sub_shield_and_spear` (defence, dig-in); `zin_sub_archer_screens` (archer soft attack, `category_zin_archers`); `zin_sub_levy_drill` (militia org, training time); `zin_sub_skirmish_lines` (speed, recon); `zin_sub_warband_rush` (attack, org loss; orcs, trolls); `zin_sub_forest_ways` (forest attack; elves); `zin_sub_grave_ranks` (grave host org; Volgan) |
| Siege | `zin_sub_siege_trains` (fort attack); `zin_sub_field_engines` (support catapults); `zin_sub_bolt_walls` (ballistae, scorpions); `zin_sub_sappers_craft` (river and fort crossing) |
| Mounted and Kin | `zin_sub_heavy_charge` (knights); `zin_sub_raiding_riders` (speed, supply); `zin_sub_horse_archery` (horse archers); `zin_sub_kin_handling` (monster org and attack) |
| Command | `zin_sub_war_councils` (planning); `zin_sub_hold_the_line` (defence when outnumbered: `dont_lose_dig_in_on_attack`, `recon_factor_while_entrenched`); `zin_sub_long_marches` (attrition, speed); `zin_sub_ambush_and_raid` (night, terrain); `zin_sub_dread` (dark peoples only: `org_damage_multiplier`) |

Each subdoctrine has three rewards. Subdoctrines restricted to a people use `available`.

#### 12.4 Naval and air doctrines

| Folder | Grand doctrines | Tracks |
| --- | --- | --- |
| naval | `zin_gd_command_of_the_sea` (warship battle lines: `naval_damage_factor = 0.10`, `positioning = 0.05`); `zin_gd_oar_and_ram` (galleys and coasts: `screening_efficiency = 0.10`, `naval_speed_factor = 0.05`, `naval_invasion_prep_speed = 0.10`); `zin_gd_corsair_fleets` (raiders: `convoy_raiding_efficiency_factor = 0.15`, `naval_retreat_chance = 0.10`) | `zin_track_galleys` (screen_ship), `zin_track_warships` (capital_ship), `zin_track_raiders` (submarine), `zin_track_sea_lanes` (convoy) |
| air (rule on) | `zin_gd_wings_of_the_mountain` (dragon pacts; elves: `air_attack_factor = 0.10`, `air_cas_efficiency = 0.10`); `zin_gd_griffin_eyries` (men: `air_agility_factor = 0.10`, `air_range_factor = 0.10`) | `zin_track_griffins` (fighter), `zin_track_dragons` (cas) |

Zol uses `zin_gd_corsair_fleets` only.

### 13. Starting forces and knowledge, 1 Thaw 4A 1748

All forces are at home and at peace. Most armies have little experience: Erdae has known peace for seventeen centuries.

#### 13.1 Great powers and lore realms

| Country | Divisions | Main templates | Start XP | Navy | Notes |
| --- | ---: | --- | ---: | --- | --- |
| Aenor | 36 | Royal hosts, knights, siege trains; 6 wall garrisons | 0.05 (wall 0.2) | 8 galleys, 4 warships | "Built a strong army" (E) |
| Lerendor | 16 | Northern hosts, sea soldiers | 0.1 | 12 galleys, 8 warships | Fleets guard the strait (P) |
| Coldor | 16 | Northern hosts, cavalry | 0.1 | 6 galleys, 3 warships | |
| Isengard | 10 | Heavy hosts | 0.2 | 2 galleys | Forts on Coldor border |
| Noris | 14 | Camel riders, hosts | 0.1 | 4 galleys | Camel warriors (E) |
| Stabilo | 12 | Hosts, cavalry | 0.1 | 4 galleys | |
| Gunwaith, Girdon | 8 each | Clan hosts, wardens | 0.3 | 4 galleys each | Fifty years of war ended 4A 1745 (P) |
| Goldoroth | 14 | Warbands, ogres | 0.3 | 2 galleys | Armed peace with Dondor |
| Dondor | 10 | Brute hosts | 0.3 | 3 galleys | |
| Mirolon | 10 | Hill and line hosts on the passes | 0.3 | 3 galleys | Watches the passes |
| Volgan | 40 | 20 grave hosts, 10 dominion vanguards, 10 monster clans | 0.4 | 4 galleys | Low intel for others; all inside the Dead Lands |
| Demon, Dolon, Nezer | 4 each | Netherborn hosts | 0.3 | none | |
| Zol | 8 | Deathless hosts in the interior of the Mistake | 0.3 | 3 corsairs (black ships) | Nothing near another realm's border |
| Magical Forest | 12 | Warden hosts, riders | 0.1 | none | No dragons deployed |
| Gala Elves | 4 | Warden hosts | 0.2 | 3 galleys (elven sails) | |
| Worshipdom | 1 | Valley wardens | 0.05 | none | "Almost no army" (P) |
| Yeldenne | 0 | - | - | - | The castle's guard is the Yeldenne mechanic, not an army |
| Selen | 3 | 2 ranger divisions, 1 host | 0.3 | none | Selen's rangers (E) |
| Kingson | 4 | Wall wardens | 0.2 | none | Wall gate |
| Hiloron | 3 | Giant hosts with men | 0.05 | none | |
| Kilinti | 3 | Ent groves with forest archers | 0.05 | none | |
| Hunhun | 4 | Riders | 0.1 | none | Riders of Hunhun (E) |

#### 13.2 Every other country

`divisions = clamp(1 + round(states × 0.6), 1, 18)`; tier B × 1.25 (rounded). Templates come from the people and region (section AI). Coastal countries get `ceil(coastal states / 2)` galleys. Equipment stockpile: 1.2 × need (Volgan 1.5). One military factory line producing the people's main arms at 50% efficiency.

#### 13.3 Technology packages

| Package | Who | Knows |
| --- | --- | --- |
| Concord | Aenor, Middle Lands men, Asgard | every tech up to 1745 in arms, mounts (men), engines and walls, camp, naval; lantern wards |
| Great crowns | Lerendor, Coldor, Isengard, Noris, Stabilo, Gunwaith, Girdon, Dondor, Mirolon, tier B men | as Concord, without lantern wards |
| Island and sea | Triton's Islands, Windwaith | Great crowns naval set; arms up to 1700 |
| Common men | tier C men | up to 1700 |
| Tribal | Cold Lands tribes, Islands of the South, small island lordships | up to 1650; oared galleys |
| Elves | elven realms | elven arms (to `_1`), forest rangers, elven steeds, wardsong, elven hulls, dragon lore, torsion engines, camp up to 1700 |
| Sunhot | sun_elves | elven arms, Sun Guard, torsion engines, camp up to 1700 |
| Orcs | orc realms | warband iron, raider mounts, catapults, forged steel; Goldoroth also ogre pacts |
| Kin | trolls, giants, ents, yeti | their kin tech, scouts; giants also mail and catapults |
| Dominion | Volgan | grave binding, necromantic orders, nether pacts, ogre pacts, warband iron, forged steel, plate and mail, torsion engines, riding horses, camp up to 1720 |
| Nether | Demon, Dolon, Nezer | nether pacts, catapults, scouts, sappers |
| Mistake | Zol | deathless tide 1, oared galleys, corsair craft |

Starting grand doctrines (`set_grand_doctrine` in history): Shield Wall for Aenor, the Concord, Lerendor, Dondor, Mirolon and Isengard; Horse and Lance for Hunhun, Noris, Stabilo and Coldor; Great Muster for other men and orcs that are not Goldoroth; Blood and Warband for Goldoroth and Troll Forest; Old Ways, Sun Guard, Strength of the Wild, Nether Fury, Grave Muster and Deathless Tide by people. Naval: Command of the Sea for Lerendor and Aenor; Corsair Fleets for Triton's Islands and Zol; Oar and Ram for everyone else with a navy.

### 14. 3D unit pipeline

#### 14.1 Pilot units

| Asset id | Sub-units it serves | Reference | State |
| --- | --- | --- | --- |
| `zin_men_infantry` | men levy, line infantry, heavy infantry, sea soldiers, hill companies (until their own models) | Owner-approved 18 Oct 2026, `docs/assets/hoi4_3d_model_jobs/models_3d/zin_men_infantry/refs/original/meshy_input.png` | Waiting for Meshy |
| `zin_elves_warden` | all elven foot | same layout | Waiting for Meshy |
| `zin_orcs_warrior` | orc warbands, goblins (scaled 0.75) | same layout | Waiting for Meshy |
| `zin_the_dead_revenant` | grave hosts (Volgan only) | same layout | Waiting for Meshy |
| `zin_trolls_brute` | troll brutes, ogres (until their own model) | same layout | Waiting for Meshy |

Meshy work is blocked until the HOI4 Mod Setup launcher bug is fixed (roadmap). Zol's deathless get their own model later; they never reuse the revenant, because the vault does not tie the two kinds of dead together.

#### 14.2 Route (the kit's `hoi4-3d-model-pipeline`)

1. One clean, weapon-free `meshy_input.png` per asset (done for the pilots). No turnaround sheets go to Meshy.
2. Meshy 7 geometry; one supported rig attempt and one action attempt per missing role for bipeds; Blender recovery after that. Non-bipeds (ents, giants if their anatomy fails the rig, dragons, griffins) go straight to Blender.
3. Weapons are separate attachment entities, as vanilla rifles are. Each weapon (spear, sword, shield, axe, bow, club) gets its own approved weapon-only image and Meshy 7 geometry task, by analogy with the kit's firearm route (needs owner approval of the new references, open question 9).
4. Calibrate against the installed vanilla infantry mesh and entity (`generic_western_european_rifle_infantry_mesh`, `infantry_entity`, scale 0.8). Apply entity scale once. Size targets: men, elves, orcs, revenants = vanilla infantry height; trolls 1.6×; Sunhot elves 1.5×; giants 2.2×; ents 2.5×.
5. PDX material audit; `.mesh` and `.anim` export through the locked `io_pdx_mesh`; byte-level reimport proof.
6. Actions for every land unit: `idle`, `move`, `attack`, `defend`, `retreat`, `death`. `training` and `support_attack` reuse `idle` and `attack` until made.
7. Bespoke counters (large and map) matched to the vanilla green counter palette, made by the icon worker from generated art.
8. Sound: selection, movement, attack and death roles from licensed external sources with provenance, as the kit requires (open question 10). No generated audio.
9. Never launch the Windows game. Live evidence comes from the Linux run.

#### 14.3 Naming

| Item | Pattern | Example |
| --- | --- | --- |
| Sub-unit sprite | the asset id | `sprite = zin_men_infantry` |
| Generic entity | `<asset id>_entity` | `zin_men_infantry_entity` |
| Culture entity | `<gfx culture>_<asset id>_entity` | `zin_north_gfx_zin_men_infantry_entity` |
| Mesh | `<asset id>_mesh` | `zin_men_infantry_mesh` |
| Animations | `<asset id>_<action>` | `zin_men_infantry_attack` |
| Weapon entity | `zin_weapon_<name>_entity` | `zin_weapon_spear_entity` |
| Model files | `gfx/models/units/zin/<asset id>/` | |
| Counters | `GFX_unit_<sprite>_icon_medium`, `_medium_white`, `_small` | `GFX_unit_zin_men_infantry_icon_medium` |
| Equipment art | `GFX_<equipment>_medium`, archetype `GFX_archetype_<archetype>_medium` | |

The division's model is its highest-`priority` battalion. Priorities: great kin 700, knights 650, line foot 600, archers 590, cavalry 599, siege 500.

#### 14.4 Graphical cultures

`common/graphicalculturetype.txt` keeps the vanilla list and adds (proposed):

| Culture | Who |
| --- | --- |
| `zin_middle_gfx` | men of the Middle Lands and Aenor Isle |
| `zin_north_gfx` | men of the North Lands and Cold Lands |
| `zin_west_gfx` | men of the West Lands and Triton's Islands |
| `zin_east_gfx` | men of the East Lands and the Dark Lands |
| `zin_south_gfx` | men of the Dead Lands (Mirolon) and the Islands of the South |
| `zin_elves_gfx`, `zin_sun_elves_gfx`, `zin_orcs_gfx`, `zin_dead_gfx`, `zin_demons_gfx`, `zin_kin_gfx` | the other peoples |

Each has a `_2d` twin for the portraits spec. Only men's cultures change models (their uniforms differ); other peoples' sprites are already unique. Until a culture entity exists, the generic entity shows.

### 15. Migration from vanilla

#### 15.1 Replace (add to `descriptor.mod`)

| Path | Why |
| --- | --- |
| `common/units`, `common/units/equipment`, `common/units/equipment/modules`, `common/units/equipment/upgrades` | All sub-units, equipment and modules are ZIN's |
| `common/units/names`, `common/units/names_divisions`, `common/units/names_ships`, `common/units/names_railway_guns` | Erdae names; railway gun names emptied |
| `common/technologies`, `common/technology_tags` | ZIN tree, folders and categories |
| `common/doctrines/folders`, `common/doctrines/grand_doctrines`, `common/doctrines/tracks`, `common/doctrines/subdoctrines/land`, `.../sea`, `.../air`, `.../special_forces` | ZIN doctrines; special forces folder removed |
| `common/unit_tags` | Vanilla categories plus `category_zin_monsters`, `category_zin_dead`, `category_zin_great_beings`, `category_zin_siege`, `category_zin_archers` |
| `common/ai_templates`, `common/ai_equipment`, `common/ai_navy/fleet`, `common/ai_navy/goals`, `common/ai_navy/taskforce` | ZIN AI |
| `common/special_projects/projects`, `.../project_tags`, `.../prototype_rewards` | No modern projects |
| `common/equipment_groups`, `common/military_industrial_organization/organizations` | Name vanilla equipment; the economy spec may add Erdae workshops |
| `common/raids` | Air, nuclear and paratrooper raids name removed units |

`common/ai_strategy`, `history/units`, `common/decisions`, `events` and `common/on_actions` are already replaced.

#### 15.2 Overwrite single files

| File | Change |
| --- | --- |
| `common/script_enums.txt` | Vanilla content plus every ZIN equipment archetype in `script_enum_equipment_bonus_type`, so `equipment_bonus` accepts them |
| `common/graphicalculturetype.txt` | Vanilla list plus ZIN cultures |
| `common/defines/zin_defines.lua` | Warfare block (Implementation) |

#### 15.3 Keep, re-theme only

`common/combat_tactics.txt`, `common/terrain`, `common/abilities`, `common/aces`, `common/unit_leader` (traits re-localised; panzer, air and submarine traits hidden through `allowed`), buildings keys `bunker`, `coastal_bunker`, `naval_base`, `air_base`, `anti_air_building` (names and art changed by the economy spec), `motorized_equipment`, `train_equipment`, `convoy` keys, critical parts. `gfx/entities` stays (buildings need it); no ZIN sprite points to a vanilla unit entity.

#### 15.4 Must be replaced or emptied by their owning specs

These vanilla folders name vanilla equipment, techs or sub-units and will log errors once warfare lands: `common/national_focus` (focus spec), `common/ideas` and `common/scripted_effects`, `common/scripted_triggers`, `common/scripted_localisation` (politics and mechanics), `common/operations`, `common/operation_phases`, `common/intelligence_agency_upgrades` (diplomacy), `common/factions`, `common/bop`, `common/timed_activities`, `common/synchronized_dynamic_tokens`, `common/scientist_traits`, `common/country_leader` (foundation). Warfare lands only after these are replaced, or in the same build.

#### 15.5 People ideas

The existing ideas in `common/ideas/zin_peoples.txt` give some peoples `army_attack_factor` and `army_defence_factor`. Unit stats now carry that strength. The peoples spec moves those combat modifiers out (or halves them) when warfare lands, keeping recruitment, attrition and acclimatisation modifiers. Target people modifiers that stay: yeti `winter_attrition_factor = -0.5`; Netherborn realms `heat_attrition_factor = -1`, `winter_attrition_factor = 0.5`; orcs `land_night_attack = 0.10`; ents `army_speed_factor = -0.1`.

#### 15.6 Order of work

1. Data and generator (units, equipment, techs, doctrines as JSON).
2. Replace paths, script enums, defines; restore the ahead-of-time penalty.
3. History: technologies, doctrines, templates, OOB, stockpiles for all 305 countries.
4. AI templates, strategies, naval and air designs.
5. Localisation and placeholder icons (generated); then counters; then 3D pilots as Meshy unblocks.
6. Special units and their scripted effects once the owning mechanics exist.

## Implementation

### Generator data

All warfare content is generated by the ZIN content builder from `docs/design/warfare/`: `units.json`, `equipment.json`, `technologies.json`, `doctrines.json`, `templates.json` (AI and history), `start_forces.json`, `naval.json`, `air.json`. The builder writes through the shared rewrite engine. Never hand-edit generated files.

### Game files

| File | Content |
| --- | --- |
| `common/units/zin_men.txt`, `zin_elves.txt`, `zin_sun_elves.txt`, `zin_orcs.txt`, `zin_kin.txt`, `zin_demons.txt`, `zin_dead.txt`, `zin_siege.txt`, `zin_camp.txt`, `zin_great_beings.txt`, `zin_ships.txt`, `zin_air.txt` | Sub-units |
| `common/units/equipment/zin_*.txt`, `modules/zin_ship_modules.txt` | Equipment, hulls, modules |
| `common/units/names_divisions/zin_*.txt`, `names_ships/zin_*.txt` | Names by people and region |
| `common/technologies/zin_arms.txt`, `zin_mounts.txt`, `zin_engines.txt`, `zin_lore.txt`, `zin_camp.txt`, `zin_naval.txt`, `zin_skies.txt` | Techs |
| `common/technology_tags/zin_technology.txt` | Categories and folders |
| `common/doctrines/...` | Folders, grand doctrines, tracks, subdoctrines |
| `common/unit_tags/zin_categories.txt` | Categories |
| `common/ai_templates/zin_*.txt`, `common/ai_equipment/zin_*.txt`, `common/ai_navy/...`, `common/ai_strategy/zin_war.txt` | AI |
| `common/scripted_effects/zin_war.txt`, `common/scripted_triggers/zin_war.txt` | Shared logic |
| `common/dynamic_modifiers/zin_war.txt`, `common/ideas/zin_war.txt` | Modifiers and ideas |
| `common/decisions/zin_war.txt`, `common/decisions/categories/zin_war.txt` | Glo shockwave |
| `events/zin_war.txt` | Namespace `zin_war` |
| `common/on_actions/zin_war.txt` | Startup and monthly hooks |
| `common/game_rules/zin_war_rules.txt` | Rules |
| `history/countries/*` (generated blocks), `history/units/*` | Techs, doctrines, OOB |
| `gfx/entities/zin_units.asset`, `zin_units.gfx`, `gfx/models/units/zin/...` | 3D |
| `interface/zin_units.gfx`, `zin_equipment.gfx`, `zin_technologies.gfx`, `zin_doctrines.gfx` | Sprites |
| `sound/zin_units.asset` | Sounds |
| `localisation/english/zin_war_l_english.yml` | All text |

### Scripted triggers

| Trigger | Scope | Meaning |
| --- | --- | --- |
| `zin_is_site_great_wall` | state | The state is a Great Wall state (generated from the map's wall list) |
| `zin_is_region_dead_lands` | state | The state lies in the Dead Lands region |
| `zin_war_has_deathless_in_state` | state | Zol has divisions with `zin_zol_deathless` in this state |
| `zin_war_can_shockwave` | country | Holds the bearer of Glo, `zin_glo_with_eindil` set, `zin_zol_manifested` not set |

### Scripted effects

| Effect | Scope | What it does |
| --- | --- | --- |
| `zin_war_feed_deathless` | Zol | Adds `zin_mistake_power × 25` deathless bonds (cap before `zin_zol_rising`) |
| `zin_war_grant_glo_bearer` | country | Adds the bearer equipment, the Eindil host template and division, the leader trait |
| `zin_war_glo_shockwave` | state | `damage_units` on Zol's divisions in the state; event `zin_war.3` to both sides |
| `zin_war_grant_dragons` | country | Argument `amount`: adds dragons, raises `zin_dragon_flights`, grants dragon lore; or the timed idea when the sky rule is none |
| `zin_war_grant_volgan_presence` | Volgan | Adds the presence equipment and attaches it to Volgan's division |
| `zin_war_remove_volgan_presence` | Volgan | Removes it everywhere |
| `zin_war_grant_great_spirit` | Volgan | Adds one great spirit (max 3) |
| `zin_war_grant_zol_manifestation` / `zin_war_remove_zol_manifestation` | Zol | Zol mechanic's manifestation unit |
| `zin_war_grant_shachihata` | country | Adds one Shachihata (demons, Volgan) |
| `zin_war_build_great_wall` | global | Sets fort levels on wall states and adds `zin_war_great_wall` (used by the generator check and by world systems repairs) |

### Variables and flags

| Name | Kind | Scope | Meaning |
| --- | --- | --- | --- |
| `zin_dragon_flights` | variable 0–10 | country | Dragon flights the country may hold under its pact |
| `zin_war_dragon_pact` | country flag | country | The country has a dragon pact (set by world systems) |
| `zin_war_shockwave_used` | country flag (timed) | country | Shockwave cooldown |

### Events (`zin_war`)

| Event | Purpose |
| --- | --- |
| `zin_war.1` | Hidden, `on_startup`: apply rule ideas (skies, deathless), assert start constraints in debug builds (no Zol unit outside the Mistake, no granted equipment) |
| `zin_war.2` | "Dragons Answer the Call": shown to the receiver of `zin_war_grant_dragons` |
| `zin_war.3` | "The Light of Glo": report of a shockwave, to both sides |
| `zin_war.4` | "Shapes That Will Not Stay Broken": first war against Zol after `zin_zol_rising`; explains that ordinary arms cannot end the deathless |
| `zin_war.5` | "Wards Against Death": `zin_zol_rising` opens the ward techs to men |
| `zin_war.6` | "The Blade Is Broken": on `zin_zol_manifested`, swaps the bearer to the shard variant, shockwave ends |
| `zin_war.7` | Hidden: on `zin_volgan_body_destroyed`, removes Volgan's presence |
| `zin_war.20` | Hidden monthly: grave-host strain; deathless feed (if the Zol mechanic delegates it) |

### Game rules

| Rule | Options |
| --- | --- |
| `zin_rule_skies` | `beasts` (default), `dragons_only`, `none` |
| `zin_rule_deathless` | `canon` (default), `softened` |

### Defines (warfare block of `zin_defines.lua`)

| Define | Value |
| --- | --- |
| `NDefines.NMilitary.PIERCING_THRESHOLDS` | `{ 1.00, 0.75, 0.50, 0.25, 0.00 }` |
| `NDefines.NMilitary.PIERCING_THRESHOLD_DAMAGE_VALUES` | `{ 1.00, 0.80, 0.60, 0.35, 0.10 }` |
| `NDefines.NMilitary.ENEMY_AIR_SUPERIORITY_IMPACT` | `-0.20` |
| `NDefines.NMilitary.ENEMY_AIR_SUPERIORITY_SPEED_IMPACT` | `-0.15` |
| `NDefines.NTechnology.BASE_YEAR_AHEAD_PENALTY_FACTOR` | `2` (restored from 0; see the start and calendar spec) |

### Localisation

Short, plain names as in the tables. Descriptions one or two sentences. Bound demons, their tech and equipment use keys whose text is filled only after `zin_afrit_revealed` (scripted localisation shows "Unknown" before). No Afrit, Einendil, Edvoid or Rush.

## AI

### Templates (`common/ai_templates`)

| Template | People | Role | Target (regiments; support) |
| --- | --- | --- | --- |
| `zin_ai_men_line_host` | men | infantry | 6 line infantry, 2 archers; scouts, sappers |
| `zin_ai_men_levy_garrison` | men | garrison | 4 levy |
| `zin_ai_men_heavy_host` | men | infantry (attack) | 4 heavy infantry, 2 archers, 1 catapult; sappers, catapult company, healers |
| `zin_ai_men_riders` | men | cavalry | 4 cavalry, 2 horse archers; scouts |
| `zin_ai_men_knights` | men | armor | 2 knights, 2 cavalry, 2 heavy infantry; ballista company |
| `zin_ai_men_siege_train` | men | artillery | 2 trebuchets, 2 catapults, 2 line infantry; sappers |
| `zin_ai_men_sea_soldiers` | men | marines | 6 sea soldiers |
| `zin_ai_men_rangers` | men | special forces | 4 rangers; scouts |
| `zin_ai_men_warded_host` | men | infantry (after `zin_zol_rising`) | 6 heavy infantry, 2 archers; wardens, sappers |
| `zin_ai_elves_host` | elves | infantry | 4 wardens, 3 archers; wardsingers, scouts |
| `zin_ai_elves_riders` | elves | cavalry | 4 riders, 2 archers |
| `zin_ai_sun_guard` | sun_elves | infantry | 4 guard, 2 bowmen; scorpions |
| `zin_ai_orcs_warband` | orcs | infantry | 7 warriors, 2 goblins; scouts |
| `zin_ai_orcs_brute_host` | orcs | armor | 2 ogres, 5 warriors |
| `zin_ai_trolls_host` | trolls | armor | 3 brutes, 2 goblins |
| `zin_ai_giants_host` | giants | armor | 3 giant hosts, 1 hurlers |
| `zin_ai_ents_grove` | ents | armor | 3 groves, 2 archers (men) |
| `zin_ai_yeti_bands` | yeti | infantry | 4 bands |
| `zin_ai_nether_host` | demons | infantry | 5 Netherborn; sappers |
| `zin_ai_volgan_grave_host` | Volgan | infantry | 8 grave hosts, 1 ogres; necromancers |
| `zin_ai_volgan_vanguard` | Volgan | armor | 4 Netherborn, 2 ogres, 2 orc warbands; ballistae |
| `zin_ai_volgan_monster_clan` | Volgan | infantry | 3 ogres, 4 orc warbands, 2 goblins |
| `zin_ai_zol_deathless` | Zol | infantry | 8 deathless |
| `zin_ai_zol_crews` | Zol | marines | 6 black ship crews |

Countries next to Troll Forest, the Dark Lands or the Dead Lands add a ballista company to their line host.

### Strategy

- **Peace first.** Until a contract story flag or 1 Thaw 4A 1749, the AI builds only to its starting army plus 10% (`ai_strategy` with the start plan of the historical path spec). No AI declares war (start situation spec).
- **Role ratios** by people: men 55% infantry, 15% cavalry, 10% armor (knights), 10% artillery, 10% garrison; elves 60/25/0/15 (archers inside infantry); orcs 70/15/10/5; Volgan 50/10/25/15; Zol 100% deathless.
- **Production.** Arms first, then bows or armour, then mounts and engines. Zol never orders deathless bonds (cannot). Elves never order dragons.
- **Zol** keeps all divisions inside the Mistake until `zin_zol_rising` (historical path spec). **Volgan** keeps them inside the Dead Lands until `zin_volgan_marches`.
- **Glo shockwave.** The AI uses it whenever available and Zol's divisions in the target state total at least 4.
- **Dragons.** Elven AI uses dragon flights only on close support in states it owns or borders, unless at war.
- **Doctrines.** `ai_will_do` per grand doctrine: 10 for the people's starting doctrine, 1 for the others, 0 for unavailable ones.
- **Navy.** Galleys patrol and escort; warships form the strike force; corsairs raid convoys. A West Lands AI builds deep-water hulls and cogs only after the Western Crossing mechanic prepares the crossing. `ai_equipment` gives one default design per hull and people.
- **Air.** Men with eyries keep griffins at 10% of their military production when at war, 0% in peace.

## Acceptance

1. **No vanilla left.** The staged mod defines no vanilla sub-unit, equipment, technology or doctrine key except the kept `convoy`, `train_equipment` and `motorized_equipment`. The Linux run's `error.log` has no "unknown equipment", "unknown technology" or "unknown sub unit" lines from ZIN or vanilla files.
2. **Everyone can fight.** A generator test over all 305 countries: each can recruit at least one line template from its people, research at least one technology in every folder it sees, and, if coastal, build one ship.
3. **Start constraints.** On 1 Thaw 4A 1748: no country at war; no division outside its owner's territory; no Zol division outside Zol's states; no `zin_glo_blade_equipment`, `zin_dragon_equipment`, `zin_volgan_presence_equipment`, `zin_zol_manifestation_equipment` or `zin_shachihata_equipment` anywhere; the bound-demon tech and unit are invisible to every country.
4. **Secret.** The compiler's secret scan finds no "Afrit" or Deliverer-as-demon text in any warfare localisation reachable before `zin_afrit_revealed`.
5. **Deathless invariant.** An offline calculator in the builder tests computes division piercing for the best template of every people at tech years 1748, 1755, 1760, 1775 and 1790: every ratio against the deathless armour stays below 0.5; with the bearer of Glo it is at least 1.0.
6. **Deathless in play.** A scenario test (HOI4 Agent Tools scenario tester, then the Linux run): an Aenor host of 10 divisions against 8 deathless divisions for 60 days leaves the deathless with at least 85% strength; one shockwave removes at least 50% of the strength in its state.
7. **Research years.** Every tech's `start_year` is between 1500 and 1790; no starting tech shows an ahead-of-time penalty; a 1750 tech researched in 1748 shows one.
8. **Doctrines.** Each people sees at least one land grand doctrine; only Zol sees the Deathless Tide; only Volgan sees the Grave Muster.
9. **Navy and the sea.** A West Lands naval invasion plan to Aenor's coast is invalid without `zin_tech_deep_water_hulls` and valid with it (Linux run).
10. **Skies rule.** With `none`, no air sub-unit, air tech or scorpion is visible; with `beasts`, Aenor can build griffins.
11. **Great Wall.** Every `zin_is_site_great_wall` state has forts at level 5 or more on the Aenor side and the `zin_war_great_wall` modifier.
12. **365-day Linux run.** The AI recruits ZIN templates, produces ZIN equipment and researches ZIN techs; no new errors.
13. **Validation tools.** HOI4 Agent Tools script validation and tech inspection pass; the tech renderer produces a review image of every folder.
14. **3D pilots.** Each pilot passes the kit's evidence list (calibration, actions, reimport proof, counters); every sub-unit sprite has an entity or a recorded fallback to the generic entity.
15. **Script enums.** Every ZIN archetype named in an `equipment_bonus` is listed in `script_enum_equipment_bonus_type`.

## Open questions

1. **The sky.** Keep griffins (a proposed creature, not in the vault), use dragons only, or remove air entirely?
2. **Orc mounts.** What, if anything, do orc raiders ride?
3. **Dragons and the dark.** Dragons served Volgan in the First Age. May Volgan receive dragons in the Fourth Age, and how?
4. **Gunpowder.** Is the Fourth Age free of gunpowder, with crossbows and torsion engines as the peak?
5. **Glo after the sword.** Gameplay keeps a reduced bearer effect (piercing 120) after Zol crushes the sword, and ends the shockwave. The vault leaves Glo's remaining power open. Is this acceptable as gameplay only?
6. **Zol's commanders.** Zol's divisions are led by nameless "Deathless Captains". Acceptable, given that who administers the Mistake is open?
7. **Two kinds of dead.** Volgan's grave hosts and Zol's deathless are separate unit families with separate models and no stated relation. Confirm.
8. **Dwarves.** Their homeland is open. Should dwarves appear at all (for example as hired engineers), or wait for the lore?
9. **Weapon references.** The pilots are weapon-free. May the 3D route make separate weapon-only references (spear, sword, shield, axe, bow, club) for owner approval?
10. **Unit sound.** The kit requires licensed external audio with provenance. Is that acceptable for ZIN, given that all art is generated?
11. **Sunhot elves at war.** They are "among the most peaceful" peoples. Should their AI ever attack, or only defend?
12. **Grave-host strain.** Volgan's grave hosts lose strength outside the Dead Lands, extending the Third Age rule about Elzon's corpses. Keep it?
13. **Great spirits as units.** Volgan's "great spirits" become rare support companies (up to three). Acceptable, or should they be generals only?
14. **Yeldenne's army.** Yeldenne starts with no divisions; Horos and the castle's protections are a mechanic. Confirm.

## Dependencies

- [Start and calendar](../00_foundation/01_start_and_calendar.md): start date; this spec restores the ahead-of-time penalty.
- Peoples and politics (00_foundation): people flags and ideas; combat modifiers moved out (15.5).
- [Map accuracy](../01_map/01_map_accuracy.md), [key sites](../01_map/02_key_sites.md): wall states, fort levels, Dead Lands storms, Mirolon's passes, Dragon Mountain.
- [Start situation](../02_lore/01_start_situation.md): peaceful start, the secret, Worshipdom's tiny army, generals and characters.
- Economy (03_gameplay): resources, buildings (eyries, harbours, forts), industry and electronics folders, MIOs.
- [Magic and world systems](04_magic_and_world_systems.md): dragons, Glo, the Great Wall, the deathless, Dead Lands storms.
- [Historical path and AI](06_historical_path_and_ai.md): war timing, peace-first AI.
- [Shared contract](../04_mechanics/00_shared_contract.md) and the mechanics specs: Zol (`zin_mistake_power`, manifestation), Volgan (`zin_dominion_strength`, presence), Afrit (bound demons, corrupted dragons), Eindil's journey (bearer of Glo, the dragon), Western Crossing.
- [Focus tree format](../05_focus_trees/00_format_and_compiler.md): research bonuses use the new tech categories; equipment effects use ZIN archetypes.
- 07_interface: technology folder and doctrine GUIs. 08_art_and_assets: icons, counters, 3D pipeline. 09_validation: Linux run and offline checks.
