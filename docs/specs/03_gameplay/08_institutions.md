# Institutions: the war camp, the council of captains, the fairs, the courts of whispers, the guilds and the spells

**Status:** Draft. Written 19 October 2026 as a wave-0 gap spec (master plan §7; inventory rows WE-040, 048, 106 to 108, 127, 140 to 144, 149 to 152, 173 to 178 and the operations rows they pull in). **Priority:** 3. **Phase:** 3. It belongs to **stage 2 of the vanilla removal** ([06_vanilla_removal_and_zero_errors.md](../00_foundation/06_vanilla_removal_and_zero_errors.md) §5) beside [01_warfare.md](01_warfare.md) §15, [02_economy.md](02_economy.md) and [03_diplomacy_and_factions.md](03_diplomacy_and_factions.md), and it follows master plan decisions P5 to P9.

## Purpose

Vanilla's military and economic layer is full of institutions that have a finished interface and no Erdae meaning: the army headquarters, the officer corps, command power, the international market, production licences, lend-lease, the cryptology department, the intelligence agency with its upgrades and operations, the military-industrial organisations and the special projects. Stage 1 left them loaded or empty, and the inventory found no decision for them. The master plan (P6, P8) says what to do in outline: keep the machinery, change the rules and the reading, never only the label ("the reference mods keep modern rules under new names and read false").

This spec gives each institution an Erdae answer: what it becomes, its rules and numbers, what the player sees, how the AI uses it, and which vanilla folders and keys it replaces. The ten answers are: **the War Camp** (army headquarters), **the Council of Captains** (officer corps, ranks, staff slots), **Orders and Valour** (command power and the experience pools), **the Great Fairs** and **Folk Wares** (the international market and consumer goods), **Guild Licences** and **Sending Arms** (licences and lend-lease), **Seals and Codes** (cryptography and the agency upgrades), **the Courts of Whispers** (intelligence agencies), **Court Intrigue** (operations and operatives), **Guilds and Orders** (military-industrial organisations) and **Spells** (special projects).

## Lore basis

### Established (fixed)

| Fact | Source |
| --- | --- |
| Aenor has a strong army; strong institutions kept the kingdom running under the Golden King. | *Golden King*, *Fourth Age Canon Register* |
| Afrit's Hidden Council works through religious institutions, relief networks, foreign envoys and commercial connections; its seats are royal administration, worship, foreign agents and the recovery of artifacts. | *Afrit's Hidden Council* |
| Elzon's dead faded and needed magic that was hard to replenish outside the Dead Lands; potent magic (Glo, Horos's sword) ends Zol's dead and nothing ordinary does. | *Elzon's Order*, *Zol* |
| The Fourth Age had a thousand years of peace, education, science and medicine; farming, medicine and military practice came from engineers, healers and soldiers. | *Fourth Age Canon Register*, *Second Age Progress and Recovery* |
| Aenor traded with the North Lands, the West Lands, the islands, the Magical Lands and the eastern states; ports and caravan roads made kingdoms rich. | *The Fourth Age of Erdae* |
| Dragons come from Dragon Mountain; elven powers command them; Afrit can through corruption. | *Peoples of Erdae* |

### Proposed elsewhere in the vault (used, still proposals)

The Houses of the First Light (grain stores, hospitals, birth rolls, records, from 4A 11); the Lantern Chain's couriers and warding specialists; the universities of Parim and Selen; the Concord's common army in war and free roads in peace; the Council's four seats; the Golden Court as a palace district where offices are bought.

### Proposed by this spec

Every institution name below, every rule and number, every identifier. The word "ransom" in the War Camp section is a design reading of the captured-general system, not a custom of the vault. Nothing here is lore.

### Decisions applied

[INTEGRATION_DECISIONS.md](../INTEGRATION_DECISIONS.md): V2 (resources), S6 and R1 (the sky rule `zin_rule_skies`), E1 (scripted-effect arguments compile to `zin_arg_<name>`), E2 (events time out to their first option), E4, F3, N16 (retired names are replaced everywhere), A9 (sound is synthesised). Master plan P5 (fuel and energy are re-themed, not deleted), P6 (modern systems are reshaped; lend-lease and licences become tribute and loans; the intelligence layer becomes court intrigue; the headquarters and the officer corps stay as Erdae institutions), P7 (grant-only technologies carry restricted content), P8 (magic is special projects; guilds and orders are military-industrial organisations), P9 (race is a variable on country and state; every tooltip reads the variable).

### Start constraints

- No text reachable before `zin_afrit_revealed` names Afrit or calls the Deliverer a demon. The Courts of Whispers and Court Intrigue are the likeliest leak; their text names "the Council's agents" never.
- Nothing here creates a unit, spell or agency at game start that the start situation forbids: no War Camp is deployed, no spell is under way, no agency exists, and every fair contract and licence is empty.
- No spell, rite, ability or upgrade counts as potent magic (rule 1 of [04_magic_and_world_systems.md](04_magic_and_world_systems.md)), lifts a division's piercing toward the deathless armour, or explains the Fading or Zol's "feeding" (rule 6).

## Design

### 0. Overview

| § | Erdae institution | Vanilla surface | Inventory rows | Writer |
| --- | --- | --- | --- | --- |
| 1 | The War Camp | Army HQ sub-units, HQ division, deploy button | WE-048 | `institutions.mjs` |
| 2 | The Council of Captains | Officer Corps window, ranks, chiefs, high command, theorists, manufacturer slots | WE-141, 143, 144 | `institutions.mjs` |
| 3 | Orders and Valour | Command power, abilities, army, navy and air experience | WE-040, 140 | `institutions.mjs` |
| 4 | The Great Fairs, Folk Wares | International Market; consumer goods | WE-108, 127 | `institutions.mjs` (text, rules, defines); economy owns the laws |
| 5 | Guild Licences, Sending Arms | Production licences; lend-lease | WE-106, 107 | `institutions.mjs` (rules); warfare writes the equipment fields |
| 6 | Seals and Codes | Cryptology department, ciphers, the 21 agency upgrades | WE-174, 178 | `institutions.mjs` |
| 7 | The Courts of Whispers | Intelligence agencies | WE-173 | `institutions.mjs` |
| 8 | Court Intrigue | Operations, phases, tokens, operatives, missions | WE-175 to 177, 065, 200 | `institutions.mjs` |
| 9 | Guilds and Orders | Military-industrial organisations, policies, AI weights | WE-151, 152, 199 | `institutions.mjs` |
| 10 | Spells | Special projects, scientists, facilities | WE-149, 150 | `institutions.mjs` |

A single new module writes all ten (internal writers, one test each). §11 lists the files that move from the economy and diplomacy specs to it.

### 1. The War Camp (army headquarters)

**What it becomes.** A Captain-General or a Marshal of the Crown raises a **standard** near the front: tents, a banner, a household guard, quartermasters, sappers and healers. The engine's Army HQ is the same object: a real division, built from the sub-units whose `allow_in_army_hq = yes`, with a deployed leader who gives his modifiers and abilities to the army group in reach. In Erdae the camp is the army's will made visible and also its weakness. It can be attacked, it must stay within reach of the front, and a host without its standard plans slowly.

**Rules (all engine, nothing scripted).**

- Deploying a camp costs Orders (§3) and requisitions a share of the nearby hosts' men and kit, never more than 90 per cent of their strength (`ARMY_HQ_REQUISITION_MINIMUM_REMAINING_PERCENTAGE` stays 10).
- The camp's experience level follows its leader's rank (`GENERAL_RANK_TO_ARMY_HQ_EXP_LEVEL_FACTOR` stays 0.5).
- A host planning with no camp, or a camp too far behind, plans at 80 per cent of the cap (`PLANNING_CAP_NO_HQ_SCALING` 0.8, comms scaling by distance). All defines stay.
- The template editor limits are the engine's (1 wide, 4 high for guards and for support companies).
- **Held for ransom.** The engine's "captured generals" counter is read as captains taken alive. The `operation_rescue_general` operation (§8) is the way home. The text says ransomed or rescued, never a prison camp.

**The fifteen camp sub-units** replace the eighteen vanilla ones (`common/units/zin_hq.txt`, written by `institutions.mjs`; all `regimental = no`, `allow_in_army_hq = yes`, `allow_in_non_army_hq = no`, no DLC condition). Support companies are `group = support` with the categories `category_support_battalions`, `category_divisional_support_battalions`, `category_army`. Their `deployed_leader_modifiers` keep the vanilla values (already valid) except the fuel term, which is dropped (every equipment burns no fuel). Needs name warfare's equipment ([01_warfare.md](01_warfare.md) §3).

| Sub-unit | Replaces | Name (working label) | Needs | Deployed-leader modifiers | Ability enabled | Who |
| --- | --- | --- | --- | --- | --- | --- |
| `zin_hq_banner` | `hq_support_company` | Standard-Bearers | arms 20 | `skill_bonus_factor` 0.2 | none | all |
| `zin_hq_sapper_master` | `hq_engineer` | Master of Sappers | arms 20, camp gear 10 | `fortification_damage` 0.2, `amphibious_invasion_defence` 0.05 | `zin_ab_deeper_trenches` | all except ents, yeti |
| `zin_hq_scout_master` | `hq_recon` | Master of Scouts | arms 20, camp gear 10 | `terrain_trait_xp_gain_factor` 0.2, `recon_factor` 0.1 | `zin_ab_hold_in_depth` | all |
| `zin_hq_provost_marshal` | `hq_military_police` | Provost-Marshal | camp gear 10 | `army_speed_factor` 0.05 | none | not orcs |
| `zin_hq_master_armourer` | `hq_maintenance` | Master Armourer | camp gear 10 | `attrition` −0.1, `equipment_capture_factor` 0.02 | none | all |
| `zin_hq_healers_tent` | `hq_field_hospital` | The Healers' Tent | camp gear 10 | `wounded_chance_factor` −0.25, `sickness_chance` −0.25, `experience_gain_army_unit_factor` 0.1 (company `casualty_trickleback` 0.20, `experience_loss_factor` −0.15) | `zin_ab_healers_afield` | not orcs, the_dead (Volgan swaps it for the necromantic order) |
| `zin_hq_quartermaster_general` | `hq_logistics` | Quartermaster-General | camp gear 10 | `max_commander_army_size` 2, `supply_consumption_factor` −0.05 | `zin_ab_overrun` | all |
| `zin_hq_horn_master` | `hq_signal` | Master of Horns | camp gear 10 | `max_planning` 0.03, `recon_factor_while_entrenched` 0.1, `enemy_operative_capture_chance_factor` 0.1 | `zin_ab_rotate_reserves` | all |
| `zin_hq_harbour_liaison` | `hq_naval_liaison` | Harbour Liaison | camp gear 10 | `shore_bombardment_bonus` 0.15, `extra_marine_supply_grace` 24, `amphibious_invasion` 0.05 | none | coastal realms |
| `zin_hq_eyrie_liaison` | `hq_air_liaison` | Eyrie Liaison | camp gear 10 | `air_cas_efficiency` 0.05, `cas_damage_reduction` 0.05, `air_superiority_bonus_in_combat` 0.05 (the vanilla air-invasion term has no use) | none | `zin_rules_skies_present` only (`active = no` otherwise) |
| `zin_hq_ranger_captain` | `hq_specops` | Ranger-Captain | camp gear 10 | `special_forces_out_of_supply_factor` −0.1, `special_forces_attack_factor` 0.05 | none | men, elves, sun_elves, orcs |
| `zin_hq_household_foot` | `hq_infantry` | Household Foot | arms 60 | none (a guard battalion: org 60, strength 15, width 2, manpower 600) | none | not the great kin |
| `zin_hq_household_riders` | `hq_motorized` | Household Riders | arms 60, mounts 20 | none (speed 9) | none | men, elves, orcs |
| `zin_hq_household_knights` | `hq_light_armor`, `hq_medium_armor`, `hq_heavy_armor` | Household Knights | arms 40, armour 30, mounts 30 | none (armor group, `zin_monsters` excluded) | none | men |
| `zin_hq_household_kin` | (the armoured-car and paratrooper slots) | Great-Kin Guard | the kin gear of the people, 40 | none (`category_zin_monsters`) | none | trolls, giants, ents, yeti |

The armoured-car and paratrooper HQ battalions have no Erdae counterpart and are dropped. Stats beyond those named copy the vanilla HQ values (org 30 for companies, 120 training days, weight 0.1).

**Abilities.** Five of the fourteen generic commander abilities are unlocked by a camp company; §3 lists all of them. The ability ids here are the ZIN ids of that list.

**Interface surface.** The unit leader window's "Deploy as Army HQ" button, the Council of Captains' ribbon (deployed count, captured captains), the template editor's "New Army HQ" and the default template name. Text direction: "Raise the Standard" for deploying, "Strike the Standard" for withdrawing, "War Camp" for the template, "Captains Held for Ransom" for the captured counter. The camp's on-map model reuses the foot entity with a banner prop (asset inventory WE-048: one map model, 15 small icons).

**AI.** The engine decides (an army of 10 or more divisions, at most 5 camps, `ARMY_LEADER_MIN_DIVISIONS_FOR_HQ`, `MAX_DEPLOYED_ARMY_HQS`). ZIN adds the AI strategy `zin_inst_camp_pause`: no AI deploys a camp while `zin_world_peace_holds` (the long peace; no army needs one), and a camp is deployed within 30 days of a war with a major. Acceptance 1 and 2 test both.

### 2. The Council of Captains (officer corps)

**What it becomes.** The Officer Corps window is Erdae's council of the host: who commands, which customs the army keeps, which master teaches the theory of war. It is not a bureaucracy. It is the six chairs, nine customs and three schools of one court. Master plan P11 says the officer-corps view is "hidden or replaced" and P6 says it is "kept as an Erdae institution"; this spec follows both by replacing its content, name and art and keeping the screen, because it is the only window that holds the chiefs, the customs and the camp ribbon. Window title and top-bar button read **Council of Captains**; the three command headers read **The Host**, **The Fleet** and **The Winged**; the special-forces header is hidden with its folder.

#### 2.1 Ranks (WE-141)

The engine has four land ranks, four naval ranks, two role names and a five-step ladder for field officers (`DIVISION_EXPERIENCE_TITLE_ARMY_EXPERIENCE_0..4`, thresholds 0, 100, 200, 400, 800 XP, unchanged). Titles are working labels; the text sweep's banned list governs the final wording.

| Engine key | Vanilla reading | Erdae title | Notes |
| --- | --- | --- | --- |
| `cc_leader` | General (corps commander role) | Host-Captain | The role shown under a commander's portrait |
| `fm_leader` | Field Marshal | Marshal | The army-group role |
| `rank1` | Major General | Banneret | Which skill level earns which rank is the engine's |
| `rank2` | Lieutenant General | Warden of Hosts | |
| `rank3` | General | Captain-General | |
| `rank4` | Field Marshal | Marshal of the Crown | The marshal rank |
| `navy_leader` | Admiral | Sea-Lord | The naval role |
| `naval_rank1` | Commodore | Sea-Captain | |
| `naval_rank2` | Rear Admiral | Sea-Warden | |
| `naval_rank3` | Vice Admiral | Admiral | |
| `naval_rank4` | Admiral | Lord Admiral | |
| `DIVISION_EXPERIENCE_TITLE_ARMY_EXPERIENCE_0`, `_1` | Brigadier | Captain of a Hundred | Field officers |
| `_2`, `_3` | Major-General | Banneret | |
| `_4` | Lieutenant-General | Warden of Hosts | |
| `DIVISION_EXPERIENCE_TITLE_DEFAULT` | Officer | Captain | |

The tag-prefixed variants (`<TAG>_DIVISION_EXPERIENCE_TITLE_…`) are not written: 305 tags would need 1,500 keys. A great power may later get its own ladder by the same keys (a build option, not built). The descriptions (`rankN_desc`) stay empty, as in vanilla. The rank badges (8 icons) are bronze studs and chevrons, no stars (asset inventory WE-141).

#### 2.2 Chairs (WE-143, 144)

| Engine slot | Idea category | Erdae chair (working label) | Filled by |
| --- | --- | --- | --- |
| `army_chief` | `military_staff` | Master of the Host | Generated or named character; tier A and B realms |
| `navy_chief` | `military_staff` | Lord of the Fleet | The same, only for realms with a fleet or a coast |
| `air_chief` | `military_staff` | Master of the Eyries | The same, only while `zin_rules_skies_present` and the realm holds or may hold dragons |
| `high_command` ×3 | `military_staff` | Marshals of the Council | Two generated for tier A realms |
| `theorist` | `research_production` | Master of Lore | The characters spec's theorists (named); generated for tier A realms without one |
| `tank_manufacturer`, `naval_manufacturer`, `aircraft_manufacturer`, `materiel_manufacturer`, `industrial_concern` | `research_production` | none | Replaced by the guilds (§9) |

**The five manufacturer slots** stay in the idea-tag file the game keeps (`common/idea_tags/00_idea.txt`, not replaced). With the military-industrial organisations on, the engine hides them; the Linux run confirms (acceptance 4). If it shows five empty slots, the politics screen file is overridden to remove them (interface spec §4.6), and no inert advisor is invented to fill them.

**Chiefs, marshals and masters are characters.** `institutions.mjs` generates them: tier A (the 13 major trees) and tier B (the 71 regional trees) realms, from the country table. Tier C realms leave the chairs empty and may fill them by decision when their tree allows. Ids: `zin_cmd_<role>_<country key>` (`army`, `navy`, `air`, `marshal_1`, `marshal_2`, `master`), names from the country's name pool, portraits from its people's generated set, an advisor role at the chair's slot with cost 150 political power, and traits chosen by seed from the families below. A startup effect recruits and activates them for AI realms (the AI keeps its start advisors for a year, characters spec); the player's realm gets them as hireable. Counts: tier A about 5 each (65), tier B about 2 each (142), about 207 in all.

**Chief traits.** Families are data (`institutions.json`, `chiefTraits`): the module writes `common/country_leader/zin_military_traits.txt` with ids `zin_chief_<family>_<tier>` and tier values.

| Family | Chair | Modifier | Tier 1 / 2 / 3 |
| --- | --- | --- | --- |
| `shield` | army | `army_defence_factor` | 0.05 / 0.10 / 0.15 |
| `spear` | army | `army_attack_factor` | 0.05 / 0.10 / 0.15 |
| `drill` | army | `training_time_factor` | −0.10 / −0.20 / −0.30 |
| `banner` | army | `army_org_factor` | 0.04 / 0.08 / 0.12 |
| `march` | army | `army_speed_factor` | 0.05 / 0.10 / 0.15 |
| `ditch` | army | `dig_in_speed_factor` | 0.10 / 0.20 / 0.30 |
| `old_guard` | army | `experience_gain_army_factor` | −0.10 (with `army_morale_factor` 0.05), one tier |
| `battle_line` | navy | `naval_damage_factor` | 0.05 / 0.10 / 0.15 |
| `raiding` | navy | `convoy_raiding_efficiency_factor` | 0.10 / 0.20 / 0.30 |
| `seamanship` | navy | `naval_speed_factor` | 0.05 / 0.10 / 0.15 |
| `yards` | navy | `experience_gain_navy_factor` | 0.05 / 0.10 / 0.15 |
| `wing_craft` | air | `experience_gain_air_factor` | 0.05 / 0.10 / 0.15 |
| `safe_landings` | air | `air_accidents_factor` | −0.10 / −0.20 / −0.30 |
| `field_support` | air | `army_bonus_air_superiority_factor` | 0.05 / 0.10 / 0.15 |

Tier A chiefs roll tier 2 or 3; tier B tier 1 or 2. The high-command and theorist chairs use the same families (any army family; scholars use the theorist traits of the characters spec).

#### 2.3 The nine customs (spirits)

The Officer Corps window has nine selectable spirit slots (three per command). Vanilla's selectable spirits were in `common/ideas`, which stage 1 replaced, so today every slot is empty. `common/ideas/zin_officer_corps.txt` fills them: **27 ideas**, each category choosing one at the cost the kept idea-tag file sets (20, 35 and 50 political power for the academy, army and command slots of land and sea; 50 for each air slot), with `removal_cost = -1` as the engine sets. Ids `zin_oc_<key>`. Modifiers are the engine's; an idea reads in the window by its category. Values are design targets.

| Category (cost) | Customs (id without `zin_oc_`) | Effects |
| --- | --- | --- |
| `academy_spirit` (20) The Yard | `squires_yard` Squires' Yard; `chair_of_strategy` Chair of Strategy; `veterans_lodge` Veterans' Lodge; `heralds_school` Heralds' School | `experience_gain_army_factor` 0.15; `planning_speed` 0.10 and `max_planning` 0.05; `army_morale_factor` 0.10 and `land_reinforce_rate` 0.01; `recon_factor` 0.10 and `army_speed_factor` 0.03 |
| `army_spirit` (35) Customs of the Host | `shield_wall_custom`; `spear_rush_custom`; `oath_companies`; `foragers` | `army_defence_factor` 0.08 and `dig_in_speed_factor` 0.15; `army_attack_factor` 0.08 and `org_loss_when_moving` 0.05 (the cost); `army_org_factor` 0.06 and `army_morale_factor` 0.06; `supply_consumption_factor` −0.08 and `attrition` −0.05 |
| `division_command_spirit` (50) Banner Customs | `banner_fast`; `free_captains`; `chain_of_banners`; `household_levy` | `army_org_factor` 0.06; `max_planning` 0.10; `planning_speed` 0.10 and `army_org_factor` 0.03; `conscription_factor` 0.05 and `land_reinforce_rate` 0.02 |
| `naval_academy_spirit` (20) The Slip | `pilots_school`; `chart_room`; `rope_and_rigging` | `experience_gain_navy_factor` 0.15; `naval_detection` 0.10; `naval_speed_factor` 0.05 and `naval_attrition` −0.05 |
| `navy_spirit` (35) Customs of the Fleet | `line_of_battle_custom`; `lane_wardens`; `boarders_pride` | `naval_damage_factor` 0.08; `convoy_escort_efficiency` 0.10 and `screening_efficiency` 0.05; `naval_morale_factor` 0.10 and `naval_invasion_capacity` 5 |
| `naval_command_spirit` (50) Banner of the Sea | `sea_lords_council`; `free_corsair_captains`; `harbour_masters` | `navy_org_factor` 0.06; `convoy_raiding_efficiency_factor` 0.15 and `naval_retreat_chance` 0.05; `naval_supply_consumption_factor` −0.10 and `navy_max_range_factor` 0.10 |
| `air_force_academy_spirit` (50) The Roost School | `roost_school`; `wind_masters` | `experience_gain_air_factor` 0.15; `air_weather_penalty` −0.10 and `air_accidents_factor` −0.10 |
| `air_force_spirit` (50) Customs of the Wing | `wing_oaths`; `eyrie_watch` | `air_mission_efficiency` 0.10; `air_range_factor` 0.10 and `air_detection` 0.10 |
| `air_force_command_spirit` (50) Banner of the Wing | `master_of_wings`; `dragon_wardens` | `air_cas_efficiency` 0.10; `air_manpower_requirement_factor` −0.10 and `air_attack_factor` 0.05 |

The six air customs have `visible = { zin_rules_skies_present }`. **AI:** the AI picks the first affordable custom whose category it has not filled, weighted by its stance (Shield-Wall for defenders, Spear-Rush for Dominion and Wild), 3 if the realm is at war and 1 otherwise. In peace the AI buys at most one custom a year, in the order the yard, the customs of the host, the banner customs.

**Preferred tactic and the plot.** The window's preferred-tactic picker (20 Orders to change) lists warfare's tactics ([01_warfare.md](01_warfare.md) §15.2, `common/combat_tactics.txt`); nothing is added here. Its conspiracy bar belongs to the stage-coup activity of the diplomacy spec; its text reads as a plot among the captains.

**Interface surface.** One window (`countryofficercorpview.gui`, kept, re-skinned by the interface spec), 27 custom icons (a shared family per command), 8 rank badges, the politics-screen chair strip, the alert `alert_officer_corps` ("a chair is empty" in Erdae words). Text direction: customs read like the habits of an old army (what the shield wall does when the horn sounds), never like policy. Chairs read as offices of a court.

### 3. Orders and Valour (command power and experience)

**What it becomes.** Command power is **Orders**: the daily trickle of a marshal's attention that pays for the standard's abilities, for promoting a captain and for the mechanics that cost "10 command power" in other specs. The three experience pools are **Army Valour**, **Fleet Valour** and **Sky Valour**: what the host, the fleet and the winged learn from fighting, drilling and sailing, spent on doctrines and designs. The inventory suggested "Renown"; that word is Eindil's gauge (`zin_eindil_renown`, [01_interface.md](../07_interface/01_interface.md)), so the pools take "Valour" (a change the owner can undo, open question 1). The economy spec's workshop policy "Royal Orders" would now clash with "Orders", so it becomes **Royal Warrants** (§9; change request).

| Engine thing | Erdae name | Engine text key family | Icon |
| --- | --- | --- | --- |
| `command_power` (top bar, text icon `£command_power`) | Orders | `COMMAND_POWER`, `ABILITY_TOOLTIP_*` | a banner on a staff (2 icons: bar and text) |
| `army_experience` | Army Valour | `army_experience` | a shield boss |
| `navy_experience` | Fleet Valour | `navy_experience` | a ship's prow |
| `air_experience` | Sky Valour | `air_experience`; hidden while the sky rule is `none` | a wing |

**Numbers (engine defines unchanged).** Orders start at 0, gain 0.4 a day and cap at 80 (`STARTING_COMMAND_POWER`, `BASE_COMMAND_POWER_GAIN`, `BASE_MAX_COMMAND_POWER`). At the start a realm has saved 50 Orders after 125 days: the long peace. Modifiers that raise the cap and gain are the engine's `max_command_power`, `command_power_gain` and their multipliers; this spec's customs (§2.3) and the trees use them.

**What Orders pay for.**

| Use | Cost | Notes |
| --- | --- | --- |
| An ability of the standard (§3.2) | 0.10 to 0.22 a day while active | Allocated to the deployed camp; the unit leader window shows the allocation |
| Raising the standard | shown on the deploy button | §1 |
| Promoting a captain | 40 (`PROMOTE_LEADER_CP_COST`) | |
| Changing the preferred tactic | 20 (`PREFERRED_TACTIC_COMMAND_POWER_COST`) | |
| Sending an observer to a friendly host | 50 (`BASE_SEND_ATTACHE_CP_COST`) | The military attaché, read as a herald-observer; mastery transfer stays at 0.1 |
| Raising a new captain | extra Orders at the engine's factor (`NEW_LEADER_EXTRA_CP_FACTOR` 2.0) | |
| Mechanic decisions | 10 to 20 each (the Volgan and Dark Lands mechanics, [volgan_southern_dominion.md](../04_mechanics/volgan_southern_dominion.md), [dark_lands.md](../04_mechanics/dark_lands.md)) | Orders are the cost that is neither favour nor treasure |

#### 3.1 Where Valour comes from

In the long peace combat gives nothing. The engine does pay for drilling (units in training, the naval training mission, the wing exercises mission; the `experience_gain_<unit>_training_factor` modifiers scale it, and ZIN's fuel use of 0 makes it free), but only a trickle, and doctrine mastery from training is scaled by `TRAINING_MASTERY_GAIN_FACTOR` 0.1. A peaceful realm would take years to afford a doctrine. The three decisions below are a floor on top of the engine's training, not a replacement; acceptance 6 measures the total, and the decisions' gains are the first lever if it is off. Three decisions in the category `zin_inst_valour` (every realm) pay for drilling with something other than favour:

| Decision | Who | Cost | Gain | Cooldown |
| --- | --- | --- | --- | --- |
| Great Manoeuvres (`zin_inst_great_manoeuvres`) | Any realm with 5 or more divisions, not at war with a major | 20 Orders; 25 political power; 300 camp gear and 200 arms consumed; the hosts of the realm lose 2 per cent strength (`damage_units`, drill accidents) | Army Valour 8 plus 1 for each 5 divisions, to 20 | 180 days |
| Sea Trials (`zin_inst_sea_trials`) | Any realm with 6 or more ships | 15 Orders; 15 political power; ships lose 5 per cent strength | Fleet Valour 6 plus 1 for each 4 ships, to 15 | 180 days |
| Wing Trials (`zin_inst_wing_trials`) | A realm with a dragon flight (or griffin riders under `beasts`) | 15 Orders; 20 political power; the wings lose 5 per cent strength | Sky Valour 6 plus 2 for each flight, to 12 | 240 days |

The cost is wear and stores, not only favour, and a realm short of arms cannot drill. `damage_units` generates no tooltip, so each decision adds a custom effect tooltip that states the wear. At the cooldown and gains above, a peaceful great power gains about 25 Army Valour a year: a subdoctrine (100) every four years, so two or three across the campaign. War is faster, as intended. Targets (acceptance 6) test it.

**Start values** (history, written by the politics step from `institutions.json`): Valour is just enough for one subdoctrine at the start.

| Class | Army | Fleet | Sky |
| --- | ---: | ---: | ---: |
| Tier A, men and orcs | 150 | 100 (coastal only) | 0 |
| Volgan | 200 | 50 | 0 |
| Elven powers | 120 | 60 | 50 (dragon holders only) |
| Tier B | 100 | 50 (coastal only) | 0 |
| Tier C | 50 | 0 | 0 |
| Zol, Yeldenne | 0 | 0 | 0 |

The grand doctrines are set in history (warfare §13.3), so the 100 beyond pays for the first subdoctrine.

#### 3.2 The abilities of the standard

`common/abilities/zin_abilities.txt` (written here; warfare §15.2 hands it over) holds the engine's generic commander abilities with ZIN ids and no tag, focus or DLC test. The glider-plane ability has no Erdae counterpart and is dropped. Costs are per day while active; durations are in hours. The effects keep the vanilla modifiers (valid, checked); only the names change.

| ZIN id | Vanilla | Name (working label) | Cost/day | Duration | Effect in one line |
| --- | --- | --- | ---: | ---: | --- |
| `zin_ab_charge_home` | force attack | Press the Attack | 0.22 | 168 | Offence up, breakthrough up, cannot retreat while attacking, casualties up |
| `zin_ab_stand_fast` | last stand | Stand to the Last | 0.22 | 168 | Defence up, entrenchment up, cannot retreat while defending |
| `zin_ab_war_council` | staff office plan | Council of War | 0.12 | 168 | Planning speed ×4 |
| `zin_ab_siege_engines` | siege artillery | Raise the Engines | 0.10 | 168 | Fort damage ×2 and collateral up |
| `zin_ab_ships_gathered` | faster naval invasion planning | Gather the Ships | 0.10 | 168 | Naval invasion preparation +50% |
| `zin_ab_probe` | probing attack | Probe the Line | 0.10 | until stopped | Keeps entrenchment on attack, offence −20% |
| `zin_ab_ford_and_raft` | makeshift bridges | Fords and Rafts | 0.10 | 168 | River crossing penalty −40% |
| `zin_ab_foraging` | extra supplies | Forage the Country | 0.20 | 168 (cooldown 504) | No supply penalty for a week |
| `zin_ab_healers_afield` | extra medics | Healers Afield | 0.22 | 336 | Casualty trickleback +4%; needs `zin_hq_healers_tent` |
| `zin_ab_deeper_trenches` | deeper dig-in | Deeper Ditches | 0.12 | 168 | Dig-in speed ×7; needs `zin_hq_sapper_master` |
| `zin_ab_hold_in_depth` | defence in depth | Defence in Depth | 0.10 | until stopped | Max dig-in +3, planning −50%; needs `zin_hq_scout_master` |
| `zin_ab_overrun` | front overrun | Ride Them Down | 0.10 | until stopped | Less organisation lost moving, less planning decay; needs `zin_hq_quartermaster_general` |
| `zin_ab_rotate_reserves` | rotating reserves | Rotate the Reserves | 0.12 | 168 | Reinforcement rate +6%; needs `zin_hq_horn_master` |

#### 3.3 Interface surface and AI

The top bar shows Orders and the three Valour pools (the Erdae bar of the interface spec is separate and holds the mechanic meters). The alert `alert_doctrine_unlock` reads "a doctrine can be taken" in Erdae words. **AI:** the engine's AI spends Orders on abilities; ZIN's strategy `zin_inst_valour_ai` has the AI use Great Manoeuvres, Sea Trials and Wing Trials only when no war is on, Valour is below 100 and Orders are at least 40 (about once a year). Nothing else is added.

### 4. The Great Fairs and Folk Wares (the International Market and consumer goods)

**What the Fairs become.** The international market is where realms put surplus arms on a stall, set a price level, and let strangers buy in return for the work of their workshops, carried by merchant ships. In Erdae it is **the Great Fairs**: the stalls at the Great Lake ports, the caravan towns of the East Lands, the Pupor Ocean harbours. The machinery is unchanged because the production screen depends on its buttons; the reading and the limits are Erdae's.

| Engine part | Erdae reading |
| --- | --- |
| Market access (`give_market_access`, "give access") | A **Fair Charter**: leave to set up stalls in a realm's markets. Two-way by default (`REQUEST_AUTOMATION_AUTO_ACCEPT_MARKET_ACCESS_DEFAULT` true) |
| Add equipment to the market | **Set out stalls**: surplus kit offered at a price |
| Purchase contract, draft, subsidy | A **fair contract**: a buyer lends the output of Guild Workshops (up to 15 per contract) over 30 days (`PURCHASE_CONTRACT_DELIVERY_TOTAL_DAYS`); a subsidy is a patron's coin |
| Price levels (0.75, 1.0, 1.25) | **Bargain**, **Fair price**, **Dear** |
| Convoys | **Merchant Fleets** carry the goods; sunk fleets show in the contract's warning |
| `can_access_market = no` | The law **Closed Roads** (`closed_economy`) shuts a realm out |

**Rules (what is new).**

- **Stalls carry what a seller has produced.** Granted and rare equipment never trades: every `zin_*` archetype that is granted (deathless bonds, Shachihata, the bearer of Glo and its shard, Volgan's presence, a great spirit, Zol made flesh, dragons) has `can_license = no`, `lend_lease_cost = 0` and `can_be_lend_leased = { always = no }`, and is never in surplus. The Linux run checks that the "add to market" list shows none (acceptance 7).
- **People bind what a buyer can use.** A buyer can hold any equipment, but only a sub-unit that needs it can field it; a man's realm that buys elven arms owns arms its hosts cannot carry. The market does not special-case this, and the AI's market purchasing is driven by need (below).
- **The wide sea costs.** Contracts between West Lands and Middle Lands buyers cross the central sea and need many fleets; before `zin_tech_deep_water_hulls` the ocean cogs do not exist, so such a contract delivers only a fraction and the contract window warns (`MIN_DELIVERY_LIMIT_WARNING_UI` 0.8).
- **The East's roads.** Noris and Stabilo trade by caravan: their regional spirit's `trade_opinion_factor` (economy spec) helps their charters; the Caravan Quarrel (economy event) can shut a charter.
- **War closes a stall.** A war cancels contracts with the enemy as the engine does; the Dark Lands' raids are flavour and do not.
- **Defines.** `NDefines.NMarket` is unchanged (price factors 0.75 and 1.25, conversion 2.0, 15 workshops, 30 days).

**AI** (`common/ai_strategy/zin_institutions.txt`, types the installed game uses): `equipment_market_for_sale_threshold` and `_min_for_sale` per archetype (arms 500 surplus, bows 300, mounts 200, engines 60, camp gear 400; hulls and convoys never for sale), `equipment_market_buying_threshold` for arms and bows (buy only when stockpile is under 20 per cent of need, only while `zin_gathering_dark` is 25 or more), `equipment_market_spend_factories` 3, `equipment_market_trade_desire` toward each chartered dominion and toward the realms of its own faction (+60), and none toward a dark power (`zin_diplo_is_dark_power`). A peaceful AI therefore sells surplus and does not hoard; a frightened one buys.

**Interface surface.** The ten market windows (`interface/international_market/`, kept and re-skinned by the interface spec), the production screen's market buttons, the contract draft and the access overview. Text direction: stalls, charters, cartloads, harbour dues; prices are said, not graphed. Art: 13 market pictures (a stall, a scale, a ledger, a cog at quay, a caravan).

**Folk Wares (consumer goods).** The engine takes a share of the realm's civilian factories for consumer goods, set by the economy laws' `consumer_goods_expected_value` and shifted by `consumer_goods_factor` spirits (the economy spec uses both without a name). The share is **Folk Wares**: the part of the Guild Workshops that serves the people (pots, cloth, tools) and not the host. Text direction: the top-bar tooltip reads "Folk Wares: [share] of the Guild Workshops serve the people", the laws' text names the mood of each ladder step, and the spirits' tooltips say "more Folk Wares" or "fewer" without percentages in the name. One icon (a loaf and a bolt of cloth), and the key `consumer_goods` is kept.

### 5. Guild Licences and Sending Arms (licences and lend-lease)

**Guild Licences.** In vanilla a licence lets a country produce another's equipment design at a speed penalty, for a cost in factories. In Erdae it is a **guild licence**: a smiths' guild lends its pattern to a friendly crown for a fee in workshops. The engine's rules hold: the licensee needs the licensor's equipment tech difference to be worth it, pays `BASE_LICENSE_IC_COST`, builds at `LICENSE_EQUIPMENT_BASE_SPEED` −0.25 plus a tech-difference term (−0.05 a year of difference, to 4 years), −0.10 outside a faction, and loses −0.50 if it builds an unlicensed copy. Acceptance by the AI follows `LICENSE_ACCEPTANCE_*` (opinion factor 0.4; a subject asks with a base of 15; a year of tech difference adds 2 on a base of 10; the same faction adds 20). **Subjects therefore take their overlord's patterns easily: that is the Concord's tribute in arms.**

| Archetype group | `can_license` | Why |
| --- | --- | --- |
| Arms, bows, armour, mounts, camp gear, wards | yes | Ordinary guild craft |
| Elven arms | yes | Only a realm that can produce elven arms can use the licence (`can_be_produced`), so it passes between elven realms only |
| Troll, giant, ent, yeti, ogre gear | yes | Same; the kin peoples' own trade |
| Catapults, trebuchets, ballistae, scorpions | yes | Engines |
| Galley, warship, raider hulls, convoys, wagon and pack trains | yes | Shipwrights lend plans |
| Great warship hull | yes | Flagship fittings are the buyer's own gold |
| Grave arms, nether arms | yes | Passes only between realms that can produce them (Volgan and its sworn realms) |
| Every granted archetype (§4); griffins | **no** | Granted or bred, never copied |

The licence window, the diplomacy action and the production screen's licence pickers are the engine's; the text reads "pattern", "lend", "fee". **Warfare's equipment files** write `can_license` (warfare §3 and §15.2 gain the column above).

**One define must change.** `NProduction.LICENSE_IC_COST_YEAR_INCREASE` counts "for every year of equipment after 1936". ZIN equipment years run 1600 to 1790, so the term would be negative or huge. ZIN sets it to **0** (a flat licence cost) and keeps `BASE_LICENSE_IC_COST` at 1 until the Linux run shows the fee in workshops (target: 2 to 6 for a men's arms pattern; acceptance 8). The other licence defines count differences between equipment years and need no change.

**Sending Arms (lend-lease).** The engine lets a country loan stockpiled equipment to another, delivered monthly (`LEND_LEASE_DELIVERY_TOTAL_DAYS` 30), weighted by `lend_lease_cost`, with war-score and tension effects and with the law ladder's `lend_lease_tension` (the economy laws already carry it). In Erdae it is **sending arms**: a lord lends the host of a friend. Rules (proposed):

- `can_be_lend_leased` on every lendable archetype is `{ zin_inst_lend_ok = yes }` (FROM is the receiver): true when the two are in one faction, or overlord and subject, or the sender has opinion 50 or more of the receiver, **and** the sender is not under the Elven Refusal toward a human receiver (`zin_diplo_refusal_binds`, diplomacy), **and** neither is a dark power unless both are in the Southern Dominion.
- Weights (`lend_lease_cost`): arms 1, bows 1, armour 2, mounts 2, camp gear 0.5, wards 3, catapults 4, ballistae and scorpions 3, trebuchets 8, convoys 0 (a fleet is not a gift). Hulls and every granted archetype are not lendable.
- **Loans, not gifts.** The lender may recall at will (the engine's cancel); the receiver's units hold the arms as the lender's until recalled. The text reads "loan", never "aid package".
- **Tribute.** An overlord of `zin_autonomy_chartered_dominion` or `zin_autonomy_sworn_realm` may demand arms: the same action, with the subject's AI accepting (`send_lend_lease_desire` +60 toward an overlord). No separate tribute system exists.

**AI.** The AI sends arms to allies at war and to subjects (`send_lend_lease_desire` +40 same faction, +60 overlord), never to a realm it has a rivalry with, and never when its own stockpile is under 150 per cent of need. Bound elves never send to a human realm (diplomacy).

### 6. Seals and Codes (cryptography and the agency upgrades)

**What it becomes.** The cryptology system is a contest of secrets between courts: each realm has a **cipher strength** and each reader a **decryption power**; a realm that reads another's letters gets foreknowledge of its movements and a battlefield edge, and the letters of a realm that is read are shown to the reader as intelligence. In Erdae the cipher is **the seal** (wax, thread, pattern and the courier's word) and the reading is **the cipher wheel** and the letter-count. The engine's numbers stay: base cipher level 12,000, 4,250 per upgrade, active bonuses for 30 days.

| Engine thing | Erdae name |
| --- | --- |
| Cryptology department (agency branch `branch_crypto`) | The Reading Room |
| Cipher strength (`crypto_strength`, modifier `encryption`) | Seal strength |
| Decryption power (`decryption_power`, modifier `decryption`) | Reading skill |
| Start decryption on a target | Begin reading |
| Intel advantage in combat ("Intel Advantage") | Foreknowledge |
| Broken ciphers ("Broken Enemy Ciphers") | Letters read |
| The alerts `alert_enemy_crypto_is_broken`, `alert_no_crypto_is_being_decrypted` | "We have read their seals" and "No letters are being read" |
| Head of Cryptology (faction intelligence role) | Keeper of Seals |
| Head of Operations, Spymaster | Keeper of Whispers, Master of Whispers |

The technologies Seals and Codes ([07_industry_and_electronics_techs.md](07_industry_and_electronics_techs.md) §4.3) give the base `encryption` and `decryption`; the Reading Room's upgrades add the agency's strength.

#### 6.1 The twenty-one agency upgrades

`common/intelligence_agency_upgrades/intelligence_agency_upgrades.txt` is **overridden** by a file generated from the installed one (vanilla removal rule 5). The upgrade ids, levels and modifiers stay (the engine and AI read them). The builder changes only: the one `original_tag = ENG` AI condition is dropped; `has_tech = radio` becomes `has_tech = zin_tech_heralds` (warfare §11.5); the two `has_tech = mechanical_computing` tests become `has_tech = zin_tech_universities`; every `picture` and `frame` moves to ZIN sprites (`GFX_zin_agency_<upgrade>`); the text moves to ZIN keys. Names are working labels.

| Branch (name) | Upgrade id | Erdae name | Levels | Reads as |
| --- | --- | --- | ---: | --- |
| `branch_intelligence` (Informants) | `upgrade_economy_civilian` | Market Informants | 1 | Civilian intelligence from stalls and counting-houses |
| | `upgrade_army_department` | Barracks Informants | 1 | Army intelligence |
| | `upgrade_naval_department` | Harbour Informants | 1 | Navy intelligence |
| | `upgrade_airforce_department` | Eyrie Informants | 1 | Air intelligence (hidden while the sky rule is `none`) |
| `branch_defense` (Watch and Ward) | `upgrade_passive_defense` | Watchful Households | 4 | Hostile deeds against the realm cost more |
| | `upgrade_anti_partisan` | Root Out the Hidden | 2 | Rooting out resistance |
| `branch_operation` (Daring Work) | `upgrade_blueprint_stealing` | Copyists' Bribes | 1 | Stealing patterns |
| | `upgrade_portable_radios` | Rider Relays | 1 | Coordinated strikes (needs `zin_tech_heralds`) |
| | `upgrade_invisible_ink` | Secret Writing | 1 | More intelligence from agents, safer theft |
| | `upgrade_plastic_explosives` | Fire-Pots and Pitch | 1 | Sabotage and rebel supply |
| | `upgrade_suicide_pills` | Hidden Poison | 1 | Agents die rather than talk |
| `branch_operative` (Schools of Whispers) | `upgrade_training_centers` | Courtier Schools | 1 | A further agent and easier recruiting |
| | `upgrade_commando_training` | Knife-School | 1 | Agents may become hard fighters |
| | `upgrade_interrogation_techniques` | The Questioners | 1 | Captured agents talk more |
| | `upgrade_diplo_training` | The Envoy's Tongue | 1 | Trade and pressure missions |
| | `upgrade_psycho_warfare` | Whisper Campaigns | 1 | Tales and factions |
| `branch_crypto` (The Reading Room) | `upgrade_form_department` | Found the Reading Room | 1 | Unlocks reading; cipher level +1 and reading skill +25 |
| | `upgrade_decryption_boost` | Cipher Wheels in Hand | 2 | Reading skill |
| | `upgrade_decryption_boost_2` | Learned Tables | 3 | Reading skill (needs `zin_tech_universities`) |
| | `upgrade_crypto_strength` | The School of Seals | 2 | Seal strength |
| | `upgrade_crypto_strength_2` | Learned Seals | 3 | Seal strength (needs `zin_tech_universities`) |

The engine's cost to upgrade is five workshops over 30 days (`AGENCY_UPGRADE_DAYS`, civilian factories used by `modifiers_during_progress`), and every fifth upgrade adds one operative slot to a maximum of one (`AGENCY_UPGRADE_PER_OPERATIVE_SLOT`, `MAX_OPERATIVE_SLOT_FROM_AGENCY_UPGRADES`). These are unchanged. The upgrades sprites (21 icons) are drawn from Erdae things: a scale, a lantern, a quill, a seal, a thread, a coin, a key (the 12 neutral seals of the interface spec are the agency logos, §7).

**AI** (`ai_strategy`): `intelligence_agency_branch_desire_factor` `branch_crypto` 2000, `branch_defense` 1000, `branch_intelligence` 1000, `branch_operation` 500, `branch_operative` 100 for a peaceful AI (the engine's default pattern, with ZIN ids); `intelligence_agency_usable_factories` 5 (10 for the great powers); `become_head_of_crypto` and `become_spymaster` for the faction leader. **Interface surface:** the agency window, the cryptology window and the intel ledger's decryption lines. **Acceptance** 9.

### 7. The Courts of Whispers (intelligence agencies)

**What it becomes.** An agency is the court's house of informants: a name, a seal, a few agents and a budget of workshop hands. Every people has its own. `common/intelligence_agencies/zin_agencies.txt` replaces the 70 country agencies with one record per people (several names each, picked at random) plus the Worshipdom's, with `available = { has_country_flag = zin_people_<key> }` (P9: the variable, never a tag). The neutral seals (12 pictures of the interface spec) are the logo pool, one picture per record.

| People or realm | Names (working labels) | Seal |
| --- | --- | --- |
| men | The Quiet Hands; The Sealed Room; The Lamp-Keepers | key, quill, sealed scroll |
| elves | The Leaf-Watchers; The Long Listeners | owl feather, moth |
| sun_elves | The Sunward Listeners | hooded lantern |
| orcs | The Pit-Whisperers; The Ash Ears | spool of thread |
| trolls | The Bridge-Listeners | cloak pin |
| giants | The Far-Watchers | hourglass |
| ents | The Slow Roots | moth |
| yeti | The Snow-Trackers | coin |
| demons | The Oathbound Ears | ring |
| the dead (Volgan only) | The Grave-Listeners | closed book |
| Worshipdom (public face) | The Almoners' Roll | hooded lantern |

The Worshipdom's name is its public face and says nothing of the Council. The Council's own "Whispers" seat is the Afrit mechanic, never an agency. **Zol cannot found one:** creation costs five workshops (`AGENCY_CREATION_FACTORIES`) and takes 30 days, and Zol has one (economy spec).

**Rules.** Unchanged engine rules: found for five workshops over 30 days, upgrade for five more per step, an operative slot after the fifth step. At the start **no realm has an agency** (the start constraint). The engine's AI founds one when its civilian factories reach about 25 (`AGENCY_AI_BASE_NUM_FACTORIES`), so only the great powers do, around 4A 1750 to 1752. Text direction: the court of the realm, never a ministry; the agency's picture is a seal, never a mask or a veil (those belong to the Deliverer's icons, interface spec). **Replaces:** `common/intelligence_agencies/00_intelligence_agencies.txt` (replace folder). **Inventory:** WE-173.

### 8. Court Intrigue (operations and operatives)

**What it becomes.** Operations are the long deeds of agents: taking service in a rival's household, copying a guild's secrets, burning a granary, raising the captains against a king. Operatives are the agents, with a codename, a nation, traits and a record. The engine's machinery (network strength in a state, operatives on a mission, operations of several phases with a risk roll, tokens earned by infiltration) is a ready-made court-intrigue game, and it stays whole. What changes is what the deeds are, what they cost in Erdae's goods, how they read, and which of them exist.

**Rules kept.** An operation needs an agency, a minimum network strength in the target state, a number of free operatives, and spends days; it chains random phases chosen by weight; it ends in an outcome with a risk roll for each agent (captured, killed, exposed). Tokens (placed by infiltration) unlock steals and sabotage. The network is grown by operatives on missions. All engine defines (`NIntel`, `NOperatives`) stay.

**What the Erdae court adds.** Nothing in the engine; two rules in text only: (a) **no gunpowder, no wire, no radio** (the phases are rewritten); (b) **a rescue is a ransom** when the captive is a captain (§1).

#### 8.1 The twenty operations

All 20 files-level operations of the installed `00_operations.txt` are kept under their engine ids in `common/operations/zin_operations.txt` (the diplomacy spec listed 19; `operation_rescue_general` was missed and is added). The historical and national ones leave with the folder. Days, network strength, operatives, risk and experience keep the vanilla values; equipment moves to Erdae goods (workshop-hands are `civilian_factories` as the engine defines them).

| Engine id | Erdae name (working label) | Court reading | Days | Net | Agents | Risk | Cost in Erdae goods | Token needed → given |
| --- | --- | --- | ---: | ---: | ---: | ---: | --- | --- |
| `operation_infiltrate_civilian` | Take Service at Court | An agent takes a place in a rival household | 90 | 35 | 2 | 0.1 | none | → Seat in the Household |
| `operation_infiltrate_armed_forces_army` | Enlist on the Roll | A name on a rival's muster rolls | 75 | 50 | 2 | 0.1 | none | → Name on the Roll |
| `operation_infiltrate_armed_forces_navy` | Sign Aboard | A berth in a rival's fleet | 75 | 50 | 2 | 0.1 | none | → Berth Aboard |
| `operation_infiltrate_armed_forces_airforce` | Befriend the Roost | A friend among a rival's dragon-keepers or riders | 75 | 50 | 2 | 0.1 | none | → Place in the Roost (sky rule on) |
| `operation_steal_tech_civilian` | Copy a Guild's Secrets | Pattern-books copied | 120 | 35 | 3 | 0.2 | none (cost factor 0.05) | Seat → a technology bonus |
| `operation_steal_tech_army` | Copy the Smiths' Patterns | Arms and engines | 120 | 50 | 3 | 0.2 | none | Name → a technology bonus |
| `operation_steal_tech_navy` | Copy the Shipwrights' Plans | Hull plans | 120 | 50 | 3 | 0.2 | none | Berth → a technology bonus |
| `operation_steal_tech_airforce` | Copy the Roost-Lore | Dragon-keepers' lore | 120 | 50 | 3 | 0.2 | none | Place → a technology bonus |
| `operation_targeted_sabotage_industry` | Spoil the Workshops | Pitch and fire in the halls | 90 | 35 | 3 | 0.2 | none | Hidden Friends |
| `operation_targeted_sabotage_infrastructure` | Cut the Roads | A bridge, a ford | 90 | 35 | 3 | 0.2 | none | Hidden Friends |
| `operation_targeted_sabotage_resources` | Flood the Mines | Drowned shafts, blighted fields | 90 | 35 | 3 | 0.2 | none | Hidden Friends |
| `operation_make_resistance_contacts` | Find the Hidden | Friends among the unwilling | 60 | 40 | 2 | 0.1 | none | → Hidden Friends |
| `operation_boost_resistance` | Arm the Hidden | Arms for rebels (cost factor 0.25) | 50 | 35 | 2 | 0.2 | none | Hidden Friends |
| `operation_coup_government` | Raise the Captains | The captains rise against their lord | 180 | 70 | 2 | 0.3 | arms 12,000 | none |
| `operation_collaboration_government` | Seat a Friendly Regent | A conquered land governed by a friend | 90 | 50 | 2 | 0.1 | camp gear 200, arms 1,000, 10 Guild Workshops for 60 days | none |
| `operation_coordinated_strike` | The Dawn Blow | Agents open a gate as the host arrives | 3 | 70 | 2 | 0.3 | 15 Guild Workshops for 5 days | none |
| `operation_rescue_operative` | Bring Our Own Home | Free a captured agent | 35 | 30 | 1 | 0.1 | none (cost factor 0) | none |
| `operation_rescue_general` | Ransom a Captain | Free a captured captain | 35 | 30 | 1 | 0.1 | none (cost factor 0) | none |
| `operation_fake_intel` | Plant False Letters | A forged letter for the enemy's seals | 60 | 40 | 2 | 0 | none | none |
| `operation_capture_cipher` | Steal the Cipher-Book | A courier's book, copied | 75 | 40 | 2 | 0.2 | none | none |

Tokens: five, `token_civilian`, `token_army`, `token_navy`, `token_airforce` (hidden while the sky rule is `none`) and `token_resistance_contacts`; the file `common/operation_tokens/00_OperationTokens.txt` is **kept** (generic engine tokens, vanilla removal §3.3) and its text re-themed: Seat in the Household, Name on the Roll, Berth Aboard, Place in the Roost, Hidden Friends.

#### 8.2 Phases

Phases are the random scenes inside an operation. `common/operation_phases/zin_operation_phases.txt` holds about 60 generic phases (the historical and national phases leave with the folder), grouped in the engine's families. A phase has a name, a description, an outcome line (and a different one if an agent was hurt), an optional requirement and an optional equipment cost; those that vanilla gave to aeroplanes, submarines and radio are rewritten. Names are working labels.

| Family | Count | Phases (themes) |
| --- | ---: | --- |
| Infiltration | 4 | By the border; by a night ship; **by wing** (a dragon-keeper's favour; needs the sky rule); through the embassy (when at peace) |
| Exfiltration | 4 | By the border; to ground (a safe house); by a sea pickup; **by wing** (sky rule) |
| Free an agent or a captain | 3 + 3 | In transit; at the camp; with hidden tools; (captains) a ransom parley, a stormed hold, a disguised carriage |
| Steal patterns | 5 | A bribed clerk; a charming apprentice; a copied plan-chest; a stolen model; a talkative foreman |
| Infiltrate a force | 4 | A bribe; a lover; a prisoner turned; a believer |
| Sabotage | 8 | Pitch in the halls; stalled meetings; a broken bridge; a collapsed gallery; stolen signposts; stranded carts; a burned granary; spoiled mining tools |
| Resistance contacts | 3 | Beacon codes; carrier birds; a briefing in a barn |
| Resistance support | 4 | Hidden armouries; arms handed out; teaching drill; joining the bands |
| Capture the cipher | 5 | A bribed courier; a raid on the seal-room; a seduced scribe; a smuggled book; a copied wheel |
| False letters | 7 | Decoy camp-fires; false signal horns; deliberate leaks; the market's rumours; a turned agent; planted proofs; a released prisoner |
| Collaboration | 3 | A planning council; training a garrison; friendly captains |
| Coordinated strike | 5 | Scouting; marking targets; cutting the signal fires; guiding the host; seizing the bridges |
| The coup | 2 | The captains meet; the standard is raised |

#### 8.3 Operatives

- **Traits.** The twelve operative traits keep their modifiers (`type = operative` in the unit-leader file the warfare spec overrides, [01_warfare.md](01_warfare.md) §15.2) and take Erdae names: commando → Knife-Hand; seducer → Honeyed Tongue; infiltrator → Gate-Walker; master interrogator → Questioner; linguist → Many Tongues; double agent → Turncoat; tough → Hard to Break; safe cracker → Lock-Wise; well groomed → Courtier's Polish; natural orator → Pulpit Voice; escape artist → Slips the Chains; demolition expert → Fire-Setter. No trait names a firearm or a drug.
- **Skill ladder** (`operative_skill_1` … `_5`): Runner, Courier, Whisperer, Shadow, Master of Whispers.
- **Missions** (the engine's operative missions): Build Intel Network → Weave a Web of Informants; Quiet Intel Network → Let the Web Sleep; Counter Intelligence → Guard the Court; Root Out Resistance → Root Out the Hidden; Boost Ideology → Raise a Faction; Propaganda → Spread a Tale; Control Trade → Hold the Purse; Diplomatic Pressure → Press the Envoys. Text keys `OPERATIVE_MISSION_*`.
- **Code names.** Lists by people from the names module's syllable pools (`common/units/codenames_operatives`, the diplomacy spec).
- **Recruiting.** Operatives are recruited when a slot is free (30 days after the first slot, `AGENCY_OPERATIVE_RECRUITMENT_TIME`); their nationality is the realm's or a foreigner's by the engine's rules.
- **Operative events.** ZIN writes none (vanilla's operative events are in the replaced `events` folder). The outcomes show in the operation window and the log. The operative event window of the interface spec stays unused (its `U` row), and the Linux run confirms no event is needed (acceptance 10).

**The secret.** Operation text mentions "a rival household", "a foreign court", "an enemy's seals", never a named hidden power. The Hidden Council never uses these operations on the player by script; the AI of the Worshipdom uses them as any realm does. A realm that exposes the Council's agent does so through the Afrit mechanic's own events (`zin_aenor_expose_plot`), not through an operation.

**AI** (types the installed game uses): `operative_operation` weights per stance: Dominion and Wild favour Take Service at Court (8), Enlist on the Roll (6), Cut the Roads (3); Light favours Take Service at Court (6) and Find the Hidden (4); no stance uses Raise the Captains below `zin_gathering_dark` 40 or against a realm in the same faction; `operative_mission` favours Weave a Web of Informants and Guard the Court (weights 10 and 8) in peace; `operation_equipment_priority` for Raise the Captains and the Regent (arms first); `become_spymaster` for a faction leader. The probability tool checks four named scenarios (§Acceptance 11).

**Interface surface.** The agency window (`countryintelligenceagencyview.gui`), the operative window, the operation planner, the intel ledger. All re-skinned by the interface spec; no new window. **Replaces:** `common/operations`, `common/operation_phases` (replace folders), `common/operation_tokens` text. **Inventory:** WE-065, 175 to 177, 200.

### 9. Guilds and Orders (military-industrial organisations)

**What it becomes.** The economy spec names nine Erdae workshops, one per equipment group, and turns the organisations on ([02_economy.md](02_economy.md), "Erdae workshops"). This section gives them rules, trees and policies. The engine object is a **military-industrial organisation**: it has funds that grow as its manufacturer lines produce and its design teams research, a size that steps up, a tree of traits unlocked with funds, one attached policy, and a task capacity (how many lines and technologies it serves, default 3). In Erdae it is a **guild** (a craft that sells to any crown), a **lodge** or **stud** (a royal or learned body), or an **order** (a craft bound by vow to a house or a creed).

| Workshop (economy id) | Kind | Equipment (warfare group) | Research categories (07) | Who |
| --- | --- | --- | --- | --- |
| `zin_workshop_smiths` The Smiths' Guild | guild | arms, troll, giant, yeti, ogre gear | `zin_cat_arms`, `zin_cat_kin` | per economy |
| `zin_workshop_bowyers` The Bowyers' Hall | guild | bows | `zin_cat_bows` | men, orcs |
| `zin_workshop_armourers` The Armourers' Hall | guild | armour | `zin_cat_armour` | men, orcs, giants |
| `zin_workshop_shipwrights` The Shipwrights' Guild | guild | hulls | `zin_cat_galleys`, `zin_cat_warships`, `zin_cat_yards` | every coastal country |
| `zin_workshop_engineers` The Engineers' Lodge | lodge | catapults, trebuchets, ballistae, scorpions | `zin_cat_siege`, `zin_cat_walls` | men, elves, sun_elves, orcs, giants |
| `zin_workshop_stud` The Royal Stud | stud | mounts | `zin_cat_mounts` | men, elves, orcs |
| `zin_workshop_wardsmiths` The Wardsmiths | order | wards | `zin_cat_wards` | men, elves (after their ward techs) |
| `zin_workshop_elven_forges` The Leaf-Forges | order | elven arms | `zin_cat_arms` | elves, sun_elves |
| `zin_workshop_dark_forges` The Grave-Forges | order | grave and nether arms | `zin_cat_dark_rites` | Volgan, demons |

`allowed` is the economy spec's list, written as people and country tests (P9). The engine creates one instance per allowed country at start; none has unlocked a trait. A kind is a name and a capstone's character (below), not an engine type.

**One tree shape for all nine.** Ten traits and the initial trait. This keeps the files generated and the balance testable; each workshop differs by its equipment stats, its technology gates and its capstone. Positions on a grid (x 0 to 6, y 0 to 4); three columns with headers **Methods**, **Patterns**, **Standing**.

| Token | Column and row | Parent | Bonus (all nine) |
| --- | --- | --- | --- |
| `m1` | Methods, 0 | none | `production_cost_factor` −0.05 |
| `m2` | Methods, 1 | `m1` | `production_efficiency_gain_factor` 0.10 |
| `m3` | Methods, 2 | `m2` | `production_efficiency_cap_factor` 0.10 |
| `p1` | Patterns, 0 | none | the workshop's first equipment stats |
| `p2` | Patterns, 1 | `p1` | the second |
| `p3` | Patterns, 2 | `p2` | the third |
| `s1` | Standing, 0 | none | `military_industrial_organization_research_bonus` 0.10 |
| `s2` | Standing, 1 | `s1` | `military_industrial_organization_task_capacity` 1 |
| `s3` | Standing, 2 | `s2` | `military_industrial_organization_funds_gain` 0.25 |
| `cap` | Capstone, 3 | all of `m3`, `p3`, `s3` | The workshop's signature; `special_trait_background = yes` |

Equipment stats and production keys are the engine's: `reliability`, `build_cost_ic`, `soft_attack`, `hard_attack`, `defense`, `breakthrough`, `armor_value`, `maximum_speed`, `naval_speed`, `naval_range`, `max_strength`, `ap_attack`, and `production_resource_need_factor` for a signature saving. The caps below are design targets.

| Workshop | Initial trait | `p1` | `p2` | `p3` | Capstone (name; bonus) | Technology gates |
| --- | --- | --- | --- | --- | --- | --- |
| Smiths' Guild | `build_cost_ic` −0.05, `reliability` 0.05 | `defense` 0.04, `reliability` 0.05 | `soft_attack` 0.05, `breakthrough` 0.04 | `hard_attack` 0.04, `reliability` 0.05 | The Master's Mark; `reliability` 0.10, `defense` 0.05, `soft_attack` 0.05, Iron need −0.10 | `m2` `zin_tech_standard_patterns`; `m3` `zin_tech_division_of_labour`; `p3` `zin_tech_forged_steel` |
| Bowyers' Hall | `build_cost_ic` −0.05 | `soft_attack` 0.05 | `reliability` 0.05 | `breakthrough` 0.04, `soft_attack` 0.04 | The Composite Secret; `soft_attack` 0.10, `reliability` 0.05, Timber need −0.10 | `p2` `zin_tech_composite_bows`; `p3` `zin_tech_crossbows` |
| Armourers' Hall | `armor_value` 0.03 | `armor_value` 0.04 | `defense` 0.05, `build_cost_ic` −0.03 | `armor_value` 0.05 | The Tempered Plate; `armor_value` 0.10, `defense` 0.05, Iron need −0.10 | `p1` `zin_tech_mail`; `p3` `zin_tech_full_plate` |
| Shipwrights' Guild | `naval_speed` 0.03 | `naval_speed` 0.05 | `max_strength` 0.05, `armor_value` 0.05 | `naval_range` 0.08 | The Master Shipwrights; `max_strength` 0.10, `naval_speed` 0.05, `build_cost_ic` −0.05 | `m2` `zin_tech_dry_docks`; `m3` `zin_tech_great_yards`; `p3` `zin_tech_deep_water_hulls` |
| Engineers' Lodge | `build_cost_ic` −0.05 | `soft_attack` 0.05 | `reliability` 0.08 | `hard_attack` 0.05 | The Great Engines; `soft_attack` 0.10, `reliability` 0.08, `build_cost_ic` −0.05 | `p1` `zin_tech_torsion_engines`; `p3` `zin_tech_great_engines` |
| Royal Stud | `maximum_speed` 0.03 | `maximum_speed` 0.04, `reliability` 0.05 | `breakthrough` 0.05 | `defense` 0.04 | The Great Studs; `maximum_speed` 0.08, `breakthrough` 0.08, Horses need −0.10 | `p2` `zin_tech_war_horses`; `p3` `zin_tech_great_studs` |
| Wardsmiths | `reliability` 0.05 | `reliability` 0.05, `build_cost_ic` −0.03 | `defense` 0.04 | `ap_attack` 1 | The Warded Cloth; `reliability` 0.10, `defense` 0.05, `ap_attack` 1, Essence need −0.10 | `p1` `zin_tech_lantern_wards`; `p3` `zin_tech_hallowed_arms` |
| Leaf-Forges | `reliability` 0.05 | `defense` 0.05 | `soft_attack` 0.05, `reliability` 0.05 | `hard_attack` 0.04 | The Song-Forged; `reliability` 0.10, `defense` 0.05, `soft_attack` 0.05 | `p2` `zin_tech_leaf_steel`; `p3` `zin_tech_elven_mastery` |
| Grave-Forges | `reliability` 0.05 | `soft_attack` 0.05 | `reliability` 0.05, `build_cost_ic` −0.05 | `defense` 0.05 | The Deep Forging; `soft_attack` 0.08, `defense` 0.05, `reliability` 0.05, Essence need −0.10 | `p1` `zin_tech_grave_binding`; `p3` `zin_tech_deeper_rites` |

Every `s2` needs `zin_tech_libraries` and every `s3` `zin_tech_universities` ([07_industry_and_electronics_techs.md](07_industry_and_electronics_techs.md)); every capstone needs `zin_tech_scholars_conclaves`. **The deathless invariant.** No trait touches `ap_attack` on arms, bows, engines, mounts or kin gear. The Wardsmiths' two flat points (`p3` and the capstone) are the only piercing in the trees; the warfare calculator (warfare acceptance 6) includes them, and the invariant holds with room to spare because wards pierce at 30 to 45 against armour 80.

**Policies.** Twelve, in `common/military_industrial_organization/policies/zin_workshop_policies.txt`. One attaches to each workshop (the engine allows one), at a cost of 10 (`cost`) with a 60-day change cooldown (`cooldown`), available from size 2 (`has_mio_size > 1`).

| Policy | Kind | Allowed | Effect |
| --- | --- | --- | --- |
| `zin_mio_guild_charters` Guild Charters | generic | every workshop | `production_bonus` same-as-workshop: `production_cost_factor` −0.08 |
| `zin_mio_masters_marks` Master's Marks | generic | every workshop | `equipment_bonus` same-as-workshop: `reliability` 0.10 |
| `zin_mio_royal_warrants` Royal Warrants | generic | every workshop | `production_bonus` same-as-workshop: `production_capacity_factor` 0.10 |
| One signature policy per workshop (nine): `zin_mio_<workshop>_sign` | signature | its workshop (by its equipment type) | The workshop's capstone stat at half strength, a trade-off penalty of 0.05 on a second stat. Names: Iron Hall, Quiver Ledger, Plate Tally, Slip and Keel, Engine Yard, Stud Book, Lantern Count, Leaf-Song, Grave-Ledger |

The economy spec calls the third generic policy **Royal Orders**; with Orders now the command-power name (§3) it is **Royal Warrants** (change request).

**AI.** `common/military_industrial_organization/ai_bonus_weights/zin_ai_bonus_weights.txt` replaces the aircraft-and-tank stat weights with Erdae's: a `default` block (`reliability` 4, `build_cost_ic` 3.85, `soft_attack` 5, `hard_attack` 3, `defense` 4, `breakthrough` 3, `armor_value` 4, `maximum_speed` 2, `naval_speed` 3, `naval_range` 1, `max_strength` 3, `ap_attack` 5, every air stat 1) and one block per equipment type (arms: `soft_attack` 8, `defense` 6; bows: `soft_attack` 9; armour: `armor_value` 8; mounts: `maximum_speed` 6, `breakthrough` 5; hulls: `max_strength` 6, `naval_speed` 5). Each organisation carries `ai_will_do` 1 (2 for the people's main arms workshop, the economy spec). The AI funds a workshop's tree in the order `m1`, `p1`, `s1`, then the rest, buying the capstone last.

**Interface surface.** The six organisation windows and the policy picker (kept, re-skinned); trait icons are a shared family (reliability, speed, cost, breakthrough, size, funds, research, defence; about 20 icons, asset inventory WE-152) plus three policy icons and nine signature icons; departments use the workshop's emblem. Text direction: a guild's voice (ledgers, marks, apprentices); orders speak in oaths. **Replaces:** the three MIO folders (replace); **Inventory:** WE-151, 152, 199.

### 10. Spells (special projects)

**What it becomes.** A special project in vanilla is a long, risky piece of research done in a facility by a named scientist, with prototype iterations that either help or go wrong, ending in a permanent reward. In Erdae it is a **spell**: a rite worked by a scholar in a circle of stones, built piece by piece, with a risk that the working leaves a mark. This is master plan P8: magic is research with a cost, and the cost is a scar. The economy spec's one hidden "interim great work" is removed; the four specialisation keys stay because the kept facility buildings name them.

**The four rites.**

| Engine specialisation | Rite (working label) | Facility building | Erdae name | Notes |
| --- | --- | --- | --- | --- |
| `specialization_land` | War Rites | `land_facility` | Warding Circle | Wards, hallowing |
| `specialization_naval` | Tide Rites | `naval_facility` | Tide Circle | Coastal states only (`only_costal`) |
| `specialization_air` | Sky Rites | `air_facility` | Roost Circle | Hidden while the sky rule is `none` |
| `specialization_nuclear` | Deep Rites | `nuclear_facility` | Deep Circle | The rare rituals (P6: rockets and nukes are rare rituals); the largest risks |

A circle is a building in one state, one per state of a rite (`level_cap` state 1, group `special_project_facility`), costing 10,000 to 15,000 base like the vanilla facilities, and it needs supply in its province (3 for full speed, `NEEDED_SUPPLY_FOR_FULL_SPEED_PROJECT`): the wagon road must reach the stones. `show_on_map`, the spawn point and the models are the engine's; the art spec supplies four circle models or one reused with four prop sets.

**The scholars.** Characters with a scientist role, skilled in rites (levels 0 to 5, thresholds 100/100/300/700/1500 experience). A scholar's level speeds a project by −100% to +25% (`SCIENTIST_SKILL_LEVEL_SPEED_MODIFIER`); a scholar not working a spell does **basic research**: breakthrough points for his rite and a small bonus to technologies marked for that rite (07, the Basic-research column). Up to three supportive scholars may sit beside the first (`AMOUNT_OF_SUPPORTIVE_SCIENTISTS`). Scholars start with a realm (below) or are hired for 25 to 100 political power by the engine's cost table.

| Class | Scholars at start |
| --- | --- |
| Tier A | 3 (elven powers 4), skills by people: men land and one by coast or Deep; elves Deep and Sky; orcs land and Deep; Volgan Deep (3) and land; demons Deep |
| Tier B | 1 |
| Tier C | 0 |
| Zol, Yeldenne | 0 |

`generate_scientist_character` creates them on startup, with skills by people, one trait in a third of cases (`RECRUIT_SCIENTIST_ONE_TRAIT_CHANCE` 0.35), portraits from the people's set. About 113 scholars in all.

**Scholar traits** (`common/scientist_traits/zin_scholar_traits.txt`; modifiers only the project modifiers allow):

| Trait | Effect |
| --- | --- |
| `zin_sch_gifted` Gifted | `special_project_speed_factor` 0.10, `scientist_breakthrough_bonus_factor` 0.05, `scientist_research_bonus_factor` 0.05 |
| `zin_sch_loremaster` Loremaster | `special_project_speed_factor` 0.05, `scientist_breakthrough_bonus_factor` 0.02 |
| `zin_sch_artificer` Artificer | `special_project_speed_factor` 0.05, `scientist_research_bonus_factor` 0.02 |
| `zin_sch_bright` Quick Student | `special_project_speed_factor` 0.05, `scientist_xp_gain_factor` 0.05 |
| `zin_sch_steady_hand` Steady Hand | `special_project_speed_factor` 0.03; backlash weights ×0.5 (§ below) |
| `zin_sch_restless` Restless | `special_project_speed_factor` 0.15; backlash weights ×1.5 |
| `zin_sch_cautious` Cautious | `special_project_speed_factor` −0.05; backlash weights ×0.5 |
| `zin_sch_elder_memory` Elder Memory | `scientist_xp_gain_factor` 0.15 (elves only) |
| `zin_sch_old_lore` Keeper of Old Lore | `scientist_research_bonus_factor` 0.05, `scientist_breakthrough_bonus_factor` 0.03 |
| `zin_sch_marked` Marked | `special_project_speed_factor` −0.05, `scientist_breakthrough_bonus_factor` −0.05; earned by backlash, removed by Lifting the Curse |

**The nine spells** (`common/special_projects/projects/zin_spells.txt`; ids `zin_sp_<key>`). Fields as the installed projects use them: `specialization`, `project_tags`, `ai_will_do`, `allowed`, `available`, `breakthrough_cost` (points of the rite, earned by basic research), `prototype_time` (`sp_time.prototype`: short 45, medium 60, long 100, very long 200), `complexity` (`sp_complexity`: small 15 to 25 per cent of the project per iteration, medium 15 to 20, large 10 to 15, insane 5 to 10), `project_output`. Names are working labels.

| Project | Rite | Needs | Who | Break-through | Time | Complexity | Output (permanent unless stated) |
| --- | --- | --- | --- | ---: | --- | --- | --- |
| `zin_sp_lantern_ward` The Lantern Ward | War | `zin_tech_lantern_wards` | men, giants | 1 | short | small | Idea: wardens company `max_organisation` +10; `zin_ward_equipment` `build_cost_ic` −0.10, `reliability` 0.10 |
| `zin_sp_hallowed_ground` Hallowed Ground | War | `zin_tech_lantern_wards` | men, elves, sun_elves, giants | 1 | medium | medium | The circle's state gains `zin_inst_hallowed`: `local_supplies_for_controller` 0.15, `enemy_attrition` 0.10 |
| `zin_sp_calm_waters` Calm Waters | Tide | `zin_tech_harbour_works` | coastal realms except Volgan and Zol | 1 | short | small | Idea: `navy_weather_penalty` −0.25, `naval_attrition` −0.05 |
| `zin_sp_sea_sight` Sea-Sight | Tide | `zin_tech_triton_charts` | coastal realms | 1 | medium | medium | Idea: `naval_detection` 0.15; hulls `surface_detection` +0.10 |
| `zin_sp_dragon_speech` Dragon-Speech | Sky | `zin_tech_dragon_lore`; `zin_dragon_flights` ≥ 1 | Realms holding dragons | 1 | medium | medium | `zin_dragon_equipment` `reliability` 0.10, `air_range` 0.10; `air_accidents_factor` −0.20 |
| `zin_sp_wind_reading` Wind-Reading | Sky | `zin_tech_horn_chains` | Any, sky rule on | 1 | short | small | Idea: `air_weather_penalty` −0.25, `air_detection` 0.10 |
| `zin_sp_wellspring_rite` The Wellspring Rite | Deep | `zin_tech_ley_stone_channels` | Any except Zol | 2 | long | large | `country_resource_oil` +4 (Essence) |
| `zin_sp_lifting_the_curse` Lifting the Curse | Deep | `zin_tech_universities` | Any except Zol and Volgan | 1 | medium | medium | Removes every scar in the circle's state and neighbours; removes `zin_sch_marked` from its scholars |
| `zin_sp_grave_binding_rite` The Grave-Binding Rite | Deep | `zin_tech_deeper_rites` | Volgan | 2 | long | large | Idea: `army_org_factor` 0.05 and `casualty_trickleback` 0.05 for grave-host templates |

The Deep Rites' large costs and long times are the point: "rare rituals". A realm can run one project at a time per circle, one circle per rite.

*Rules of the six rules of magic.* None of the outputs is potent magic or lifts piercing; none creates a dragon (dragons are granted, warfare §6.3, and Dragon-Speech only tunes those a realm holds); none explains anything. Zol has no scholar, no circle and no spell. The Worshipdom may run any spell; its text never says whose circle it is.

**Backlash and scars.** Every prototype iteration rolls one reward from the pool (`common/special_projects/prototype_rewards/zin_spells.txt`, tokens `zin_sp_reward_<name>`). Base weights and effects:

| Reward | Weight | Effect |
| --- | ---: | --- |
| Steady Work (small, medium, large) | 2 in all | Scholar experience in the rite (`sp_scientist_xp_gain` low, medium, high); each once per project |
| Insight | 1.5 | One use of a 50% research bonus in the rite's category (`add_tech_bonus`: wards, galleys, skies, essence-craft); once |
| Clear Morning | 1 | `add_project_progress_ratio` +0.10 |
| A Wasted Night | 1 | Nothing |
| Burned Hands | 0.5 | The working scholar is injured 60 days (`injure_scientist_for_days`); progress −0.05 |
| **Scarred Ground** | 0.4 | The circle's state takes a scar for 365 days (below); at most one scar per state |
| Marked | 0.2 | The scholar gains `zin_sch_marked` |
| Wild Surge | 0.3 | The realm takes `zin_inst_wild_surge` for 90 days: stability −0.03, `army_morale_factor` −0.05 |
| Lost Notes | 0.5 | `add_project_progress_ratio` −0.15 |

The five bad rewards sum to 1.9. **Multipliers on the bad weights:** × (1 + `zin_gathering_dark` ÷ 100) (the Dark's meter: the working goes worse as the dark gathers, with no word saying why); × 0.5 for `zin_sch_steady_hand` or `zin_sch_cautious`; × 1.5 for `zin_sch_restless`; × 2 on insane complexity. At the start meter of 10 the bad weights total 2.1 against 5.5 of good and empty, so about 28 per cent of iterations go wrong and about one project in four leaves a scar (about 6 per cent of iterations roll Scarred Ground; a small project runs 4 to 7 iterations).

**The four scars** (state dynamic modifiers in `common/dynamic_modifiers/zin_scars.txt`, 365 days, one per state):

| Scar | Rite | Modifiers |
| --- | --- | --- |
| `zin_inst_scar_hollow` Hollow Ground | War | `state_production_speed_buildings_factor` −0.30, `local_supplies_for_controller` −0.15 |
| `zin_inst_scar_wrecked` Wrecked Moorings | Tide | `state_production_speed_buildings_factor` −0.30, `local_resources_factor` −0.15 |
| `zin_inst_scar_scorched` Scorched Roost | Sky | `state_production_speed_buildings_factor` −0.30, `local_supplies_for_controller` −0.15 |
| `zin_inst_scar_blighted` Blighted Wellspring | Deep | `local_resources_factor` −0.40, `state_production_speed_buildings_factor` −0.20 |

A scar is a map object: the player sees the state's icon and tooltip, and Lifting the Curse is the way to clear it. The text of a scar never names a cause beyond "the working went wrong".

**AI.** The engine runs projects (`ai_will_do` 1 each). ZIN's strategies `zin_inst_build_<rite>_circle` (`build_building`, value 10) enable on: the realm has a scholar skilled in the rite, at least 15 Guild Workshops, no circle of that rite, and for Tide a coastal state; Deep Rites only for a realm with Essence extracted 5 or more; Sky only with the sky rule on and a dragon or griffin holder. The AI starts the cheaper spell of each rite first (War: the Lantern Ward; Tide: Calm Waters; Sky: Wind-Reading; Deep: the Wellspring Rite). Volgan's AI runs the Grave-Binding Rite once the Dominion is strong.

**Interface surface.** The seven project windows (`interface/special_projects/`, kept and re-skinned by the interface spec), the facility cards and blueprints (nine blueprint pictures), the scholar cards, the project windows' reward cards. Art: nine project icons (`GFX_<project id>`), four rite emblems, four circle models or prop sets, ten scholar-trait icons. **Replaces:** the four special-project folders (replace) and `common/scientist_traits`. **Inventory:** WE-149, 150.

### 11. Defines, files that move, and the hooks other specs call

**Defines** (institutions block of `tools/content/data/defines.json`, schema of that file):

| Category | Key | Vanilla | ZIN | Why |
| --- | --- | --- | --- | --- |
| `NProduction` | `LICENSE_IC_COST_YEAR_INCREASE` | 1 | 0 | The term counts years after 1936; ZIN equipment years are 1600 to 1790 (§5) |

All other defines named here (`NMarket`, `NIntel`, `NOperatives`, `NProject`, `NMilitary` command power, `NDoctrines`) stay at their installed values.

**Files that move to `institutions.mjs`.**

| File | From | Note |
| --- | --- | --- |
| `common/intelligence_agencies/zin_agencies.txt`, `common/intelligence_agency_upgrades/intelligence_agency_upgrades.txt`, `common/operations/zin_operations.txt`, `common/operation_phases/zin_operation_phases.txt` | [03_diplomacy_and_factions.md](03_diplomacy_and_factions.md) (`diplomacy.mjs`) | The diplomacy spec keeps codenames, scorers, timed activities, occupation, peace, sharing |
| `common/military_industrial_organization/organizations/zin_workshops.txt`, `policies/zin_workshop_policies.txt`, `ai_bonus_weights/zin_ai_bonus_weights.txt` | [02_economy.md](02_economy.md) (`economy.mjs`) | The workshop names and who may found them stay the economy spec's |
| `common/special_projects/project_tags/zin_spells.txt`, `projects/zin_spells.txt`, `prototype_rewards/zin_spells.txt`, `specialization/zin_spells.txt` | economy (the interim great work) | The interim project and `zin_spec_great_works` are deleted |
| `common/abilities/zin_abilities.txt`, `common/scientist_traits/zin_scholar_traits.txt` | [01_warfare.md](01_warfare.md) §15.2 (`warfare.mjs`) | Warfare keeps units, equipment, doctrines, commander traits |

**Hooks other specs call.** The scripted effects `zin_inst_grant_scholar` (country; argument `rite`) and `zin_inst_add_scar` (state; argument `rite`) are the only ways other specs touch the spells (a story event may scar a state). `zin_inst_war_camp_deployed` (country) is a trigger the AI strategies read.

## Implementation

### Builder module and data

A new module, `tools/content/modules/institutions.mjs`, with one internal writer per section group (war: §1 to 3; trade: §4, 5; intrigue: §6 to 8; craft: §9, 10), reads `tools/content/data/institutions.json` (new) and runs in the same build as the warfare, economy and technology modules (stage 2). It exports `loadInstitutions()` for the politics step (start Valour, scholars). Tests: `tools/content/institutions.test.mjs` (new), with a negative test for each rule.

`institutions.json` sections: `ranks`, `chairs`, `chiefTraits`, `customs`, `valour` (decisions, start values), `abilities`, `hq` (the fifteen sub-units), `market` (AI strategy rows), `licences` (the archetype table), `lend` (weights), `agencyUpgrades` (the 21 rows with their rewrites), `agencies`, `operations` (20), `phases` (about 60), `tokens`, `operativeTraits`, `missions`, `workshops` (nine trees), `policies` (12), `aiWeights`, `rites` (4), `scholars`, `scholarTraits`, `spells` (9), `rewards`, `scars`, `defines`.

### Game files

| File | Kind | Content |
| --- | --- | --- |
| `common/units/zin_hq.txt` | generated | The fifteen camp sub-units |
| `common/abilities/zin_abilities.txt` | generated, stage 2 replace | The thirteen abilities |
| `common/ideas/zin_officer_corps.txt` | generated | The 27 customs |
| `common/characters/zin_chiefs.txt` | generated | About 207 chiefs, marshals and masters |
| `common/country_leader/zin_military_traits.txt` | generated | The chief traits (14 families, tiers 1 to 3) |
| `common/decisions/zin_inst.txt`, `common/decisions/categories/zin_inst.txt` | generated | The three Valour decisions |
| `common/scripted_effects/zin_inst.txt`, `common/scripted_triggers/zin_inst.txt` | generated | `zin_inst_grant_scholar`, `zin_inst_add_scar`, `zin_inst_lend_ok`, `zin_inst_war_camp_deployed` |
| `common/on_actions/zin_inst.txt` | generated | `on_startup`: recruit and activate the chiefs; create the scholars; start Valour; no spell or agency |
| `common/ai_strategy/zin_institutions.txt` | generated | Market, lend-lease, agency, operation, valour, camp and circle strategies |
| `common/intelligence_agencies/zin_agencies.txt`; `common/intelligence_agency_upgrades/intelligence_agency_upgrades.txt` | generated, stage 2 | §6, 7 (the latter generated from the installed file, rule 5) |
| `common/operations/zin_operations.txt`; `common/operation_phases/zin_operation_phases.txt` | generated, stage 2 replace | §8 |
| `common/military_industrial_organization/organizations/zin_workshops.txt`, `policies/zin_workshop_policies.txt`, `ai_bonus_weights/zin_ai_bonus_weights.txt` | generated, stage 2 replace | §9 |
| `common/special_projects/{project_tags,projects,prototype_rewards,specialization}/zin_spells.txt`; `common/scientist_traits/zin_scholar_traits.txt` | generated, stage 2 replace | §10 |
| `common/dynamic_modifiers/zin_scars.txt`, `common/ideas/zin_institutions.txt` | generated | Scars; outputs and timed ideas (`zin_inst_hallowed` is a state modifier; spell outputs are ideas `zin_sp_out_<key>`) |
| `common/equipment` fields `can_license`, `lend_lease_cost`, `can_be_lend_leased` | warfare writes them | From the §5 table |
| `common/defines/zin_defines.lua` row | via `defines.json` | §11 |
| `localisation/english/zin_inst_l_english.yml`; ranks, abilities, upgrades, operations, phases, tokens, traits, missions, market and alert text in `localisation/replace/` or whole-file overrides when complete (vanilla removal §3.5) | generated | All text. Banned list applies |
| `interface/zin_institutions.gfx` | generated | Agency, market, spell, ability and rank sprites |

### Names and identifiers it creates

See "Names this spec registers".

### Engine keys checked (game 1.19.3, 19 October 2026)

- **Sub-unit fields:** `allow_in_army_hq`, `allow_in_non_army_hq`, `deployed_leader_modifiers`, `enable_ability`, `regimental`, `essential` (read from the installed `hq_support.txt`).
- **Defines:** `NMilitary.STARTING_COMMAND_POWER`, `BASE_COMMAND_POWER_GAIN`, `BASE_MAX_COMMAND_POWER`, `PROMOTE_LEADER_CP_COST`, `PREFERRED_TACTIC_COMMAND_POWER_COST`, `BASE_SEND_ATTACHE_CP_COST`, `NEW_LEADER_EXTRA_CP_FACTOR`, `ARMY_HQ_REQUISITION_MINIMUM_REMAINING_PERCENTAGE`, `GENERAL_RANK_TO_ARMY_HQ_EXP_LEVEL_FACTOR`, `PLANNING_CAP_NO_HQ_SCALING`, `DIVISIONAL_COMMANDER_RANK_XP_THRESHOLD`; `NProduction.LICENSE_*`, `LEND_LEASE_DELIVERY_TOTAL_DAYS`; `NMarket.*`; `NIntel.AGENCY_*`, `CRYPTO_*`; `NProject.*`; `NDoctrines.TRAINING_MASTERY_GAIN_FACTOR`.
- **Idea categories** (kept `common/idea_tags/00_idea.txt`): `academy_spirit`, `army_spirit`, `division_command_spirit`, `naval_academy_spirit`, `navy_spirit`, `naval_command_spirit`, `air_force_academy_spirit`, `air_force_spirit`, `air_force_command_spirit`, `military_staff`, `research_production`.
- **AI strategy types:** `equipment_market_buy`, `_buying_threshold`, `_for_sale_threshold`, `_for_sale_factor`, `_min_for_sale`, `_max_for_sale`, `_spend_factories`, `_trade_desire`, `send_lend_lease_desire`, `intelligence_agency_branch_desire_factor`, `intelligence_agency_usable_factories`, `operative_mission`, `operative_operation`, `operation_equipment_priority`, `become_spymaster`, `become_head_of_crypto`, `become_head_of_operations`, `build_building`.
- **Effects:** `generate_scientist_character`, `add_scientist_role`, `add_scientist_xp`, `add_scientist_trait`, `injure_scientist_for_days`, `add_project_progress_ratio`, `give_market_access`, `create_production_license`, `activate_advisor`, `damage_units`, `add_equipment_to_stockpile`, `add_dynamic_modifier`. **Trigger:** `can_construct_building`, `has_mio_size`, `has_mio_equipment_type`.
- **Modifiers** (checked against the installed documentation): all the modifier names in the tables above.

### Crash risks

- The replaced abilities folder must hold valid definitions and every `enable_ability` must name one of them.
- The agency-upgrade override must keep every `branch_*` and `upgrade_*` id and every `level` count (the UI, AI and `has_done_agency_upgrade` read them).
- Every phase an operation names must exist; every token an operation requires must exist.
- Every MIO `equipment_type` must be in `script_enum_equipment_bonus_type` (warfare's override adds the archetypes), and every `research_categories` entry must be a category of [07_industry_and_electronics_techs.md](07_industry_and_electronics_techs.md) §2.2. A workshop whose group no realm can produce errors silently.
- The four specialisation keys must be defined in the replaced `specialization` folder (the kept facility buildings name them); an unknown specialisation in a building is a load error.
- Special projects need the engine constants in `common/script_constants/special_project_constants.txt` (`sp_time`, `sp_complexity`, `sp_scientist_xp_gain`), which stage 1 bridged with their numbers; keep them.
- A scientist needs a portrait: the kept generic scientist portraits (`portraits/998_scientist_portraits.txt`) serve.
- A hull module or equipment named by a policy but not in the enum is dropped silently.

## AI

Summarised where each institution is described: §1 (camps), §2.3 (customs; chiefs hired for AI realms), §3.3 (Valour decisions), §4 (the Fairs), §5 (licences and sending arms), §6 (upgrades), §8 (operations), §9 (workshops), §10 (circles and spells). The file `common/ai_strategy/zin_institutions.txt` carries all strategies; each is enabled only with its institution, and none runs before `zin_start_peace` is lifted except those that explicitly say peace.

## Acceptance

1. **Camp.** On the start date no War Camp is deployed and no AI deploys one during 365 days of peace (Linux run, three seeds). A scenario test at war with a major: the AI deploys a camp for an army of 10 divisions within 30 days. The template editor lists fifteen camp sub-units and no vanilla name (builder test on `common/units/zin_hq.txt` and the staged localisation).
2. **Camp rules.** The deploy button of a Marshal in Aenor's force succeeds; the camp's division is valid for the creating country's people (a builder test over all 305 countries: each can field at least one household battalion).
3. **Council.** The Officer Corps window shows nine selectable customs per realm (27 in all), the chairs filled for tier A and B realms by startup, and no empty vanilla spirit slot (Linux run, screenshot). A builder test checks the 27 customs, the 14 chief families and the rank keys (no vanilla title remains in `ranks_l_english` replacement).
4. **Manufacturer slots.** In the Linux run, the politics screen shows no empty manufacturer or concern slot with the military-industrial organisations on; if it does, the screen file override removes them.
5. **Orders and abilities.** The 13 abilities exist; every `enable_ability` resolves; Orders gain at 0.4 a day from 0 (Linux run, console `command_power` read at day 125).
6. **Valour.** A peaceful AI great power raises its Army Valour by 20 to 30 a year with the three decisions and does not run out of arms (Linux run, 365 days). Targets for the 12-year observer run: 2 to 4 subdoctrines taken.
7. **Fairs.** The "add to market" list shows no granted archetype (Linux run, console to give a country every granted archetype and open the window). A Closed Roads realm cannot open a charter. A builder test verifies every granted archetype has `can_license = no` and `can_be_lend_leased = { always = no }`.
8. **Licences and lend-lease.** The licence fee for a men's arms pattern between two Concord realms reads 2 to 6 workshops (Linux run). A lend-lease from a bound elf to a human realm is refused. Negative: a builder test fails a licensable archetype with a `year` that makes the fee negative.
9. **Seals and Codes.** The agency file keeps all 21 upgrade ids and level counts; no `has_tech` names a vanilla technology; no `original_tag` remains (builder test over the generated file). The Reading Room can be founded and a reading can begin (Linux run).
10. **Intrigue.** The operations file holds the 20 ids, every phase and token resolves, no vanilla phase text remains. A scenario test completes "Take Service at Court" between two AI realms and yields the Seat token with no event window error. A builder test finds no Afrit in any operation, phase, token or agency text.
11. **AI audit.** The probability tool compares four scenarios before and after implementation: Aenor at peace (prefers Market Informants, Weave a Web), Dondor at war with Goldoroth (prefers Enlist on the Roll, Cut the Roads), a Concord dominion (no intrigue), Volgan at start (prefers Barracks Informants). Rankings hold.
12. **Guilds.** Each of the nine workshops has 10 traits and the initial trait, valid parents, one capstone, and a gate technology that exists (builder test); no trait touches `ap_attack` except the two Wardsmith points; the warfare invariant calculator passes with them. A founded workshop shows its tree (Linux run).
13. **Spells.** The four specialisations are defined; a scholar in a Warding Circle completes a basic-research breakthrough; the Lantern Ward completes in the Linux run (accelerated by console); across 200 scripted iterations the share of bad rewards at meter 10 is 25 to 31 per cent and one project in five to one in three leaves a scar; Lifting the Curse clears it. No spell is available to Zol.
14. **No leak.** The names spec check T2 finds no "Afrit" and no Deliverer-as-demon text in any file of this spec.
15. **Zero errors.** The Linux run's `error.log` has no line from these files within the stage-2 budget ([06_vanilla_removal_and_zero_errors.md](../00_foundation/06_vanilla_removal_and_zero_errors.md) §6).
16. **Inventory closed.** WE-040, 048, 065, 106 to 108, 127, 140 to 144, 149 to 152, 173 to 178, 199, 200 are marked `done` or `partial` (where art waits) with the file names above.

## Open questions

All proceed on the labelled proposal; the owner's answers go to [OPEN_QUESTIONS.md](../OPEN_QUESTIONS.md).

1. **Valour or Renown.** Name the three pools Valour (not Renown, which is Eindil's gauge)? **Proposal, in use:** Valour.
2. **Royal Orders.** Rename the third workshop policy Royal Warrants so that Orders means command power only? **Proposal, in use:** yes.
3. **A tenth workshop.** The Houses of the First Light as the maker of camp gear? **Proposal, in use:** no; camp gear has no group and the Houses stay a story institution, so that nothing public points to Afrit's network.
4. **The Officer Corps screen.** It exists only for players with the Gotterdammerung expansion. **Proposal, in use:** the content is written for everyone and the screen is the DLC's; ZIN files carry no DLC test.
5. **Ransom.** Should the engine's captured-general counter be a real ransom decision? **Proposal, in use:** text only, with "Ransom a Captain" as the operation.
6. **Great-power ladders.** Own rank titles for the nine great powers? **Proposal, in use:** none until the text sweep.
7. **Agencies at start.** Should the great powers start with an agency? **Proposal, in use:** none; the AI founds them around 4A 1750.
8. **Fair seasons.** Should the Fairs have a season (a modifier in the fair months) once the calendar spec exposes a season variable? **Proposal, in use:** no; the Fairs run all year.
9. **Spell count.** Nine spells are enough for the first release; more may follow per people. **Proposal, in use:** nine.
10. **The dragon-keepers.** "Befriend the Roost" and "Dragon-Speech" assume dragon-keepers and riders exist as people of the court. **Proposal, in use:** kept as flavour only; no lore is claimed.

## Names this spec registers

Patterns are listed once; the owner is this spec. "Also used by" names the specs that read the name.

| Name | Kind | Scope | Meaning | Owner | Also used by |
| --- | --- | --- | --- | --- | --- |
| `institutions.mjs`, `data/institutions.json` | builder module, data | — | Writer of the ten institutions | this spec | 01_warfare, 02_economy, 03_diplomacy_and_factions |
| `zin_hq_<key>` (the fifteen of §1) | sub-unit | country | Camp sub-units | this spec | 01_warfare |
| `zin_ab_<key>` (the thirteen of §3.2) | ability | commander | Commander abilities | this spec | 01_warfare |
| `zin_oc_<key>` (the 27 of §2.3) | idea | country | Customs of the Council of Captains | this spec | trees (may name them) |
| `zin_chief_<family>_<tier>` | leader trait | character | Chief traits | this spec | 02_characters |
| `zin_cmd_<role>_<country key>` | character | country | Generated chiefs, marshals, masters | this spec | 02_characters |
| `zin_inst_valour`, `zin_inst_great_manoeuvres`, `zin_inst_sea_trials`, `zin_inst_wing_trials` | decision category and decisions | country | The Valour decisions | this spec | — |
| `zin_inst_lend_ok` | scripted trigger | country (FROM receiver) | Lend-lease may go from this realm to FROM | this spec | 01_warfare (equipment files), 03_diplomacy_and_factions |
| `zin_inst_war_camp_deployed` | scripted trigger | country | A camp is deployed | this spec | AI strategies |
| `zin_inst_grant_scholar`, `zin_inst_add_scar` | scripted effect | country, state | Hooks for story use of the spells | this spec | event specs |
| `zin_inst_build_<rite>_circle` | AI strategy | country | Circle building | this spec | — |
| `zin_mio_<key>`, `zin_mio_<workshop>_sign` | MIO policy | organisation | The twelve policies | this spec | 02_economy |
| `zin_sp_<key>` (the nine of §10), `zin_sp_out_<key>`, `zin_sp_reward_<name>`, `zin_sp_tag_<rite>` | special project, idea, reward, tag | country | The spells | this spec | — |
| `zin_sch_<key>` (the ten of §10) | scientist trait | character | Scholar traits | this spec | 02_characters |
| `zin_inst_scar_<kind>`, `zin_inst_hallowed`, `zin_inst_wild_surge` | dynamic modifier / idea | state / country | Scars, hallowing, wild surge | this spec | 04_magic_and_world_systems |
| `zin_agency_<people>` (pattern from diplomacy) | agency record | country | Courts of Whispers records (§7) | this spec | 03_diplomacy_and_factions |
| `GFX_zin_agency_<upgrade>` | sprite | — | Agency upgrade pictures | this spec | 08_art_and_assets |
| Command power, experience and rank text | localisation | — | Orders; Army, Fleet and Sky Valour; ranks of §2.1 | this spec | 07_interface |
