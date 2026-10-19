# Craft, building and scholarship technologies

**Status:** Draft. Written 19 October 2026 as a wave-0 gap spec (master plan §7; inventory rows WE-013 to WE-018 and their neighbours). **Priority:** 3. **Phase:** 3. It is part of **stage 2 of the vanilla removal** ([06_vanilla_removal_and_zero_errors.md](../00_foundation/06_vanilla_removal_and_zero_errors.md) §5), beside [01_warfare.md](01_warfare.md) §15, and it adds one builder module that writes the whole technology tree.

## Purpose

Vanilla's industry and electronics tabs hold about 49 technologies that Erdae cannot keep: machine tools, assembly lines, synthetic oil, radio, radar, computing, encryption, rocketry. The economy spec ([02_economy.md](02_economy.md)) says the two folders stay and are "re-themed", and the warfare spec names the folders in its §11, but no spec says which technologies Erdae has there, what they do, when they appear, what they unlock, or who may research them. This spec does.

It designs 54 researchable technologies in the two civilian folders (`industry_folder`, `electronics_folder`): masonry, mining, guild methods, granaries and fields, the Great Halls and Village Forges (a choice), shipwrights, essence-craft, peoples' crafts, scholarship, seals and codes, and beacon craft. It adds seven hidden technologies that keep unused vanilla buildings locked. It also fixes the rules the whole tree obeys (folders, categories, years, costs, layout, start knowledge, the research slot economy) and cross-checks the warfare spec's technology section against them, because both specs are written to the same builder module and the same files.

## Lore basis

### Established (fixed)

| Fact | Source |
| --- | --- |
| The Second Age made real progress in warfare and military technology, disease treatment and cures, and farming and famine prevention. These came from engineers, farmers, healers and soldiers, not from a god. | *Second Age Progress and Recovery* |
| The Fourth Age had more than a thousand years of peace, prosperity, education, science, medicine and strong institutions. | *Fourth Age Canon Register* |
| Cities grew around the Great Lake, ports expanded, and Aenor traded with the North Lands, West Lands, the islands, the Magical Lands and the eastern states. | *The Fourth Age of Erdae* (prologue) |
| Dragons come from Dragon Mountain; the Dead Lands are hot and storm-girt; the Great Wall of Aenor divides the Middle Lands from the Magical Lands. | *Peoples of Erdae*, *Volgan's Dead Lands* |
| Magic in Erdae is constrained. Ordinary craft magic is not potent magic. | *Magic and Sustenance in Erdae*, [04_magic_and_world_systems.md](04_magic_and_world_systems.md) rule 1 |

### Proposed elsewhere in the vault (used, still proposals)

Second Age farming and medicine examples (crop rotation, irrigation canals, seed reserves, improved storage, communal harvest rules); the Houses of the First Light keeping grain stores and records from 4A 11; the universities of Parim and Selen from 4A 340; the Great Lake ports rebuilt in 4A 40 to 120; the East Lands caravan roads (4A 600 to 780); the Triton charts (4A 702); Elzon's fortified Pale March, rebuilt in stone as the Great Wall (4A 96).

### Proposed by this spec

Every technology name, year, cost, effect and identifier below, the six new `zin_cat_*` categories, the seven gate technologies, the band table, the slot rules and the start-knowledge caps. None of it is lore. No technology states a date as history; a year says only when a realm of the Fourth Age may first learn the craft cheaply. Nothing here places the dwarves (open in the vault) or explains the Fading.

### Decisions applied

[INTEGRATION_DECISIONS.md](../INTEGRATION_DECISIONS.md): V2 (resources are Iron, Timber, Horses, Stone, Gold, Essence, Grain), E6 (doctrine boosts compile to `add_doctrine_cost_reduction`, other research boosts to `add_tech_bonus`), R1 (rules in `RULE_GROUP_ZIN`), N16 (retired names are replaced everywhere). Master plan P5 (the energy system is re-themed as Provisions), P7 (hidden grant-only technologies carry restricted content), P8 (magic runs through special projects, [08_institutions.md](08_institutions.md)).

### Start constraints

- No technology, folder or category text readable before `zin_afrit_revealed` names Afrit or calls the Deliverer a demon.
- No craft technology lifts a division's piercing or touches the deathless invariant of [01_warfare.md](01_warfare.md) §5; none counts as potent magic.
- Zol researches nothing here. Its single research slot has nothing to choose in these folders (`allow_branch` hides every row from Zol).

## Design

### 1. What replaces what

Vanilla keys are not kept. A search of the installed game found no loaded file outside the replaced folders that reads a vanilla technology key, apart from sprite names in `interface/Technologies.gfx` (harmless), `intelligence_agency_upgrades.txt` (the override rewrites its two `has_tech` tests, see [08_institutions.md](08_institutions.md)) and the faction goals (replaced). Every key is therefore a ZIN key, `zin_tech_<name>`. The tables below show keys without the prefix.

| Vanilla group | Inventory | Count | Erdae line | Count | What changes |
| --- | --- | ---: | --- | ---: | --- |
| Machine tools, assembly lines, flexible and streamlined line | WE-013 | 6 | **Guild Methods** | 6 | Same effects and the same choice at the end: Pattern Books (flexible) or Masters' Benches (streamlined) |
| Improved and advanced equipment conversion (energy gain) | WE-013 | 2 | **Granaries and Fields** | 2 | Provisions gain (`energy_gain_factor`) from seed reserves and irrigation; irrigation also raises population growth |
| Concentrated industry | WE-014 | 5 | **Great Halls** | 5 | One roof, one capacity gain; XOR with the Forges |
| Dispersed industry | WE-014 | 5 | **Village Forges** | 5 | Many small forges; efficiency and repair instead of the air-damage cut, which has no use without strategic bombing |
| Construction 1 to 5 | WE-015 | 5 | **Masonry** | 5 | Build speed and repair |
| Excavation 1 to 5 | WE-015 | 5 | **Mining** | 5 | Resource yield, each step with one named resource |
| Fuel silos, refining, synthetic oil and rubber | WE-016 | 15 | none | 0 | Removed. The buildings stay locked by gate technologies (§3.4) |
| Electronic and mechanical engineering root, radio | WE-017 | 4 | none | 0 | Removed. The root becomes the scholarship root; radio's tasks go to heralds and beacons (warfare §11.5, `zin_tech_heralds`) |
| Radar | WE-017 | 4 | **Beacon Craft** | 4 | Unlocks `radar_station` (Beacon Towers) by level |
| Computing | WE-018 | 4 | **Scholarship** | 4 (+ root) | Research speed from scriptoria, libraries and universities (the same total, +0.28) |
| Encryption and decryption | WE-018 | 6 | **Seals** and **Codes** | 6 | The same modifiers, `encryption` and `decryption` |
| Fire control, rocketry, atomic research | WE-018, WE-019 | 10 | none | 0 | Removed. Rocket sites and reactors stay locked by gate technologies |
| Fortification | WE-012 | 5 | warfare's Engines and Walls | n/a | Owned by [01_warfare.md](01_warfare.md) §11.3; see the cross-check in §8 |
| Special-project technologies | WE-023 | 6 | none | 0 | Removed with the folder |
| New, with no vanilla line | | | **Shipwrights**, **Essence-Craft**, **Peoples' Crafts** | 3 + 4 + 4 | The shipwright, magical-craft and people-specific crafts the brief asks for |

The folder and line names are working labels. The count is 54 researchable technologies (inventory estimate "about 40"; the extra 14 come from the three new lines), so the generated icon count for these folders is 54 and not 40 ([08_art_and_assets/03_full_asset_inventory.md](../08_art_and_assets/03_full_asset_inventory.md) takes the new total).

### 2. Folders and categories

#### 2.1 Folders (`common/technology_tags/zin_technology_tags.txt`, all 13)

The tag file is replaced whole (vanilla removal §3.3). Warfare's seven folders, the two civilian folders and the four doctrine folders the engine's doctrine ledger still names. The keys of the two civilian folders and of the doctrine folders stay vanilla's, because the research window and the doctrine ledger name them and keeping them costs nothing; the other keys are warfare's.

| Folder key | Name (working label) | Ledger | Owner of its rows | Visible when |
| --- | --- | --- | --- | --- |
| `zin_arms_folder` | Arms and Armour | army | warfare | always |
| `zin_mounts_folder` | Mounts and Kin | army | warfare | always |
| `zin_engines_folder` | Engines and Walls | army | warfare | always |
| `zin_lore_folder` | Lore and Wards | army | warfare | always |
| `zin_camp_folder` | Camp and Road | army | warfare | always |
| `zin_naval_folder` | Galleys and Warships | navy | warfare | always |
| `zin_skies_folder` | Eyries | air | warfare | `zin_rules_skies_present` (the sky rule is not `none`) |
| `industry_folder` | Craft and Works | civilian | this spec | always |
| `electronics_folder` | Letters and Beacons | civilian | this spec | always |
| `land_doctrine_folder`, `naval_doctrine_folder`, `air_doctrine_folder` | Land, sea and sky doctrine | army, navy, air | warfare, [09_naval_air_doctrines.md](09_naval_air_doctrines.md) | air: `zin_rules_skies_present` |
| `special_forces_doctrine_folder` | (hidden) | hidden | warfare | never (`available = { always = no }`) |

No folder has a DLC condition. `zin_rules_skies_present` and `zin_rules_skies_beasts` are scripted triggers (names registered below) that wrap `has_game_rule` for the sky rule `zin_rule_skies`: the first is true for `dragons_only` and `beasts`, the second only for `beasts`.

#### 2.2 Categories

Categories drive research bonuses (focus and idea `research` blocks), the AI's research choice and the workshops' `research_categories`. The file defines exactly these:

| Group | Categories | Notes |
| --- | --- | --- |
| Warfare's thirteen | `zin_cat_arms`, `_bows`, `_armour`, `_mounts`, `_kin`, `_siege`, `_walls`, `_wards`, `_dark_rites`, `_camp`, `_galleys`, `_warships`, `_skies` | [01_warfare.md](01_warfare.md) §11; trees already name them |
| New in this spec (six) | `zin_cat_granaries`, `zin_cat_yards`, `zin_cat_essence_craft`, `zin_cat_scholarship`, `zin_cat_seals`, `zin_cat_beacons` | One per line that no existing category covers |
| Kept engine categories | `industry`, `construction_tech`, `excavation_tech` | Trees, the compiler and the economy spec name them; they are never renamed (the trees' note "kept until the economy spec renames it" is closed: they stay) |
| Doctrine categories | `land_doctrine`, `naval_doctrine`, `air_doctrine`, `special_forces_doctrine` | The compiler writes `add_doctrine_cost_reduction` for them (E6) |

Every other vanilla category (`nuclear`, `rocketry`, `radar_tech`, `electronics`, `encryption_tech`, the 40 `mio_cat_*`) is dropped. The workshops ([08_institutions.md](08_institutions.md) §9) therefore name `zin_cat_*` categories in `research_categories`. Category text (`<category>` and `<category>_research`) reads in Erdae terms, for example the research bonus of `zin_cat_seals` reads as a bonus for seals, never for encryption.

**Check C3 finds the rest.** A replaced tag file must still define every category that a kept file names. The reference scan (vanilla removal check C3) runs over `interface/*.gui`, `common/alerts.txt` and the other kept files; a category it finds that is not above is added here or the kept file is overridden.

#### 2.3 AI research focuses

`common/ai_focuses/zin_ai_focuses.txt` was written in stage 1 with vanilla category names (`armor`, `infantry_weapons`, `motorized_equipment`, `naval_equipment`, `light_air`). Once the technologies are replaced those names no longer exist, so stage 2 rewrites the file (module: `technologies.mjs`, which takes the file from `vanilla_removal.mjs`). The nine focus keys stay (the engine and the continuous focuses read them). The wiki states the AI researches a technology only if one of its categories is listed in some focus, so **every category above appears in at least one focus** (build test).

| Focus key | Categories and weights |
| --- | --- |
| `ai_focus_defense` | `zin_cat_walls` 5, `construction_tech` 2, `zin_cat_siege` 2, `zin_cat_beacons` 1 |
| `ai_focus_aggressive` | `zin_cat_mounts` 5, `zin_cat_kin` 3, `zin_cat_siege` 2 |
| `ai_focus_war_production` | `industry` 10, `construction_tech` 2, `excavation_tech` 2, `zin_cat_yards` 2 |
| `ai_focus_military_equipment` | `zin_cat_arms` 50, `zin_cat_bows` 15, `zin_cat_armour` 12, `zin_cat_siege` 8, `zin_cat_camp` 6.5, `zin_cat_wards` 6, `zin_cat_dark_rites` 6 |
| `ai_focus_military_advancements` | `land_doctrine` 100, `zin_cat_armour` 10, `zin_cat_camp` 5 |
| `ai_focus_peaceful` | `industry` 15, `construction_tech` 5, `zin_cat_scholarship` 10, `zin_cat_granaries` 8, `zin_cat_essence_craft` 4, `zin_cat_seals` 2 |
| `ai_focus_naval` | `zin_cat_galleys` 5, `zin_cat_warships` 5, `naval_doctrine` 100, `zin_cat_yards` 3 |
| `ai_focus_naval_air` | `zin_cat_skies` 4 |
| `ai_focus_aviation` | `air_doctrine` 50, `zin_cat_skies` 20 |

### 3. Rules every technology obeys

#### 3.1 Years, costs and the bands

- **Years** are Fourth Age years, 1500 to 1790. This spec's rows run 1600 to 1766. A technology at or before 1745 is **starting knowledge** for the realms whose package covers it (§3.3). 1746 to 1760 is the campaign window. After 1760 is the sandbox, which runs to 4A 1800 (decision V3).
- **Research cost** is a multiplier of `NDefines.NTechnology.BASE_TECH_COST` (165, [05_defines_and_rules.md](../00_foundation/05_defines_and_rules.md)). Rule: **1.5** for 1745 and earlier, **2.0** for 1746 to 1760, **2.5** after 1760 (the warfare rule, with 1746 and 1747 on the campaign side). Exceptions are written in the `cost` column: the scriptorium root 1.0, seals 1.0, codes 1.5, beacon craft 1.25 (the vanilla ratios).
- **Ahead of time.** `BASE_YEAR_AHEAD_PENALTY_FACTOR` is restored to 2 in stage 2. A technology costs more before its year; the vanilla tree shows the year bands that end the penalty as text boxes, and so does ours (§5).
- **Slot-days.** At default research speed one research point is one slot-day, and a cost of 1.0 is `BASE_TECH_COST` days (wiki, *Technology modding*). A 2.0 technology is 330 slot-days; a 1.5 technology 247; a 2.5 technology 412.

#### 3.2 Paths, dependencies, exclusion and gates

- `requires` is a `path` parent in the same line (one tile, one drawn connector). `needs` is a `dependencies` entry: all must be researched, and no line is drawn, so cross-line requirements never disturb the layout.
- A line root has no path parent and therefore its own gridbox (§5). Roots with `needs` show that requirement in the tooltip.
- **XOR.** `XOR` is written on both sides. The Great Halls and Village Forges roots are exclusive, and so are Pattern Books and Masters' Benches. **An exclusive root is never starting knowledge** (§3.3), so every realm makes the choice itself.
- **Grant-only.** A technology with `grantOnly` has `allow = { always = no }`, no folder and no position. Only the seven gate technologies are grant-only in this spec, and the script grants none of them.
- **People-restricted.** `who` becomes `allow_branch`: the tile and its descendants are hidden from everyone else. Peoples are tested with `has_country_flag = zin_people_<key>`; named countries are resolved from the roster at build time (Volgan and Zol are never matched by people, because both are `the_dead`).

#### 3.3 Start knowledge

The politics step writes `set_technology` from the package export. The caps below are for this spec's rows; warfare §13.3 lists the other folders.

| Package (warfare §13.3) | Craft and scholarship technologies known at start |
| --- | --- |
| Concord, Great crowns | All with year ≤ 1745, except exclusive roots and rows restricted to other peoples |
| Island and sea | Year ≤ 1700; the Shipwrights line to 1745; Beacon Craft to 1720 |
| Common men | Year ≤ 1700 |
| Tribal | Year ≤ 1650; no scholarship above Libraries; no seals or codes |
| Elves, Sunhot | Year ≤ 1700; Scholarship, Essence-Craft, Beacon Craft and their own craft to 1745 |
| Orcs | Year ≤ 1650 in Masonry, Mining and Guild Methods; Scriptoria only; Forge-Pits |
| Kin (trolls, giants, ents, yeti) | Year ≤ 1600 (Dressed Stone, Scriptoria); giants also Quarry-Songs |
| Dominion (Volgan) | Year ≤ 1730 in every line; Vent-Forges; Wellspring Tapping and Ley-Stone Channels |
| Nether (Demon, Dolon, Nezer) | Year ≤ 1650 in Masonry, Mining; Vent-Forges for demons |
| Mistake (Zol) | None |

A technology a package knows is granted with `set_technology` in country history, so its `on_research_complete` does not run (the Great Library is above every cap on purpose).

#### 3.4 Gate technologies (keep unused buildings locked)

In vanilla a building that **no technology lists** in `enable_building` is unlocked from the start; a building that some technology lists stays locked until one is researched. Stage 2 removes every vanilla technology, so every building that vanilla gates by technology would become buildable on day one unless a ZIN technology still lists it. Seven grant-only technologies do that job. Each lists its building at level 1; none is researched, granted or shown.

| Gate (`zin_tech_gate_<key>`) | Building it keeps locked | Used by Erdae? |
| --- | --- | --- |
| `rocket_site` | `rocket_site` | no |
| `mega_gun` | `mega_gun_emplacement` | no |
| `nuclear_reactor` | `nuclear_reactor` | no |
| `nuclear_reactor_heavy_water` | `nuclear_reactor_heavy_water` | no |
| `commercial_reactor` | `commercial_nuclear_reactor` | no |
| `fuel_silo` | `fuel_silo` | no |
| `synthetic_refinery` | `synthetic_refinery` | no |

Three other tech-gated buildings are unlocked by ordinary rows: `radar_station` by Beacon Craft (this spec), `anti_air_building` by warfare's `zin_tech_scorpions`, and `stronghold_network` by warfare's `zin_tech_curtain_walls` (a cross-check, §8). The economy spec's acceptance 2 ("no ZIN technology unlocks the unused buildings") still holds, and a new test proves the other half: no unused building is constructible (§Acceptance).

*Evidence status.* That unlisted buildings default to unlocked is read from how vanilla's tech-less buildings (infrastructure, arms factories) behave and from the `hide_if_missing_tech` and `missing_tech_loc` fields of the gated ones. The Linux run settles it (acceptance 6). If it shows unlisted buildings stay locked, the gates remain as harmless belt and braces.

### 4. The technologies

Keys are shown without `zin_tech_`. `x, y` is the absolute slot in the folder (§5). `Year` and `Cost` follow §3.1; `Path` is the same-line parent, `Needs` the cross-line dependencies, `XOR` the exclusive twin. Effects use the engine's modifier names (checked against the installed `modifiers_documentation.md`; the `local_resources_<resource>_factor`, `country_resource_<resource>` families are the dynamic ones, §Implementation). The resource keys are the engine's: `steel` Iron, `aluminium` Timber, `tungsten` Stone, `chromium` Gold, `oil` Essence, `coal` Grain. This table is the data: `technologies.json` holds the same rows as objects (schema in §Implementation), and a build test compares the two.

#### 4.1 Lines (defaults a row inherits)

| Line | Folder | Column | Categories | Basic-research specialisation | `ai_will_do` base |
| --- | --- | ---: | --- | --- | ---: |
| Masonry | industry | 0 | `industry`, `construction_tech` | none | 30 |
| Mining | industry | 2 | `industry`, `construction_tech`, `excavation_tech` | none | 5; ×5 when the realm has a resource at 0 and a border state with one |
| Guild Methods | industry | 4 | `industry` | none | 40 |
| Granaries and Fields | industry | 6 | `industry`, `construction_tech`, `excavation_tech`, `zin_cat_granaries` | none | 15; ×5 while Provisions run short (`energy_ratio` < 0.9) |
| Great Halls | industry | 8 | `industry` | none | 25; ×3 with 20 or more Guild Workshops, ×0 after Village Forges |
| Village Forges | industry | 10 | `industry` | none | 25; ×3 with fewer than 20 Guild Workshops, ×0 after Great Halls |
| Shipwrights | industry | 12 | `industry`, `zin_cat_yards` | `specialization_naval` | 10; ×3 when the realm has a Shipwrights' Guild |
| Essence-Craft | industry | 14 | `industry`, `zin_cat_essence_craft` | `specialization_nuclear` | 8; ×4 with Essence extracted ≥ 5 |
| Peoples' Crafts | industry | 16 | `industry`, `zin_cat_essence_craft` | `specialization_nuclear` | 20 |
| Scholarship | electronics | 0 | `zin_cat_scholarship` | `specialization_nuclear` | 50 |
| Seals | electronics | 2 | `zin_cat_seals` | none | 2; ×6 when `zin_gathering_dark` ≥ 25 or at war |
| Codes | electronics | 4 | `zin_cat_seals` | none | 2; ×6 when `zin_gathering_dark` ≥ 25 or at war |
| Beacon Craft | electronics | 6 | `zin_cat_beacons` | `specialization_air`, `specialization_nuclear` | 1; ×5 at war with a realm across water |

`ai_will_do` uses the `factor` form of vanilla, with no tag, DLC or date conditions. The basic-research specialisations connect the technologies to the spell facilities of [08_institutions.md](08_institutions.md) §10: a scholar working in a matching circle speeds these technologies up. The four specialisation keys are the engine's, kept because the kept facility buildings name them.

#### 4.2 Craft and Works (`industry_folder`, 39 technologies)

| Key | Name (working label) | Line | x, y | Year | Cost | Path | Needs | XOR | Effects | Unlocks | Who |
| --- | --- | --- | --- | ---: | ---: | --- | --- | --- | --- | --- | --- |
| `dressed_stone` | Dressed Stone | Masonry | 0, 0 | 1600 | 1.5 | - | - | - | production_speed_buildings_factor 0.1; industry_repair_factor 0.1 | - | all |
| `lime_mortar` | Lime Mortar | Masonry | 0, 2 | 1680 | 1.5 | dressed_stone | - | - | production_speed_buildings_factor 0.1; industry_repair_factor 0.1 | - | all |
| `arch_and_vault` | Arch and Vault | Masonry | 0, 4 | 1725 | 1.5 | lime_mortar | - | - | production_speed_buildings_factor 0.1; industry_repair_factor 0.1 | - | all |
| `masons_lodges` | Masons' Lodges | Masonry | 0, 10 | 1752 | 2 | arch_and_vault | - | - | production_speed_buildings_factor 0.1; industry_repair_factor 0.1 | - | all |
| `great_scaffolds` | Great Scaffolds | Masonry | 0, 16 | 1761 | 2.5 | masons_lodges | - | - | production_speed_buildings_factor 0.1; industry_repair_factor 0.1 | - | all |
| `pit_props` | Pit Props | Mining | 2, 2 | 1650 | 1.5 | - | dressed_stone | - | local_resources_factor 0.1; local_resources_steel_factor 0.05 | - | all |
| `quarry_wedges` | Quarry Wedges | Mining | 2, 4 | 1710 | 1.5 | pit_props | - | - | local_resources_factor 0.1; local_resources_tungsten_factor 0.05 | - | all |
| `drainage_wheels` | Drainage Wheels | Mining | 2, 6 | 1745 | 1.5 | quarry_wedges | - | - | local_resources_factor 0.1; local_resources_chromium_factor 0.05 | - | all |
| `deep_shafts` | Deep Shafts | Mining | 2, 10 | 1753 | 2 | drainage_wheels | - | - | local_resources_factor 0.1; local_resources_steel_factor 0.05; local_resources_tungsten_factor 0.05 | - | all |
| `assayers_rolls` | Assayers' Rolls | Mining | 2, 18 | 1763 | 2.5 | deep_shafts | - | - | local_resources_factor 0.1; local_resources_steel_factor 0.05; local_resources_tungsten_factor 0.05; local_resources_chromium_factor 0.05 | - | all |
| `water_wheels` | Water-Wheels | Guild Methods | 4, 2 | 1650 | 1.5 | - | - | - | production_factory_max_efficiency_factor 0.1; equipment_conversion_speed 0.2 | - | all |
| `trip_hammers` | Trip-Hammers | Guild Methods | 4, 4 | 1710 | 1.5 | water_wheels | - | - | production_factory_max_efficiency_factor 0.1; equipment_conversion_speed 0.2 | - | all |
| `standard_patterns` | Standard Patterns | Guild Methods | 4, 6 | 1746 | 2 | trip_hammers | - | - | production_factory_max_efficiency_factor 0.1; equipment_conversion_speed 0.2 | - | all |
| `division_of_labour` | Division of Labour | Guild Methods | 4, 12 | 1755 | 2 | standard_patterns | - | - | production_factory_max_efficiency_factor 0.1; equipment_conversion_speed 0.2 | - | all |
| `pattern_books` | Pattern Books | Guild Methods | 3, 16 | 1762 | 2.5 | division_of_labour | - | masters_benches | production_factory_max_efficiency_factor 0.1; line_change_production_efficiency_factor 0.2 | - | all |
| `masters_benches` | Masters' Benches | Guild Methods | 5, 16 | 1762 | 2.5 | division_of_labour | - | pattern_books | production_factory_max_efficiency_factor 0.1; production_factory_efficiency_gain_factor 0.1 | - | all |
| `seed_reserves` | Seed Reserves | Granaries and Fields | 6, 4 | 1700 | 1.5 | - | lime_mortar | - | energy_gain_factor 0.15 | - | all |
| `irrigation_canals` | Irrigation Canals | Granaries and Fields | 6, 10 | 1752 | 2 | seed_reserves | drainage_wheels | - | energy_gain_factor 0.15; monthly_population 0.05 | - | all |
| `great_halls` | Great Halls | Great Halls | 8, 8 | 1748 | 2 | - | standard_patterns | village_forges | industrial_capacity_factory 0.15; industrial_capacity_dockyard 0.1; global_building_slots_factor 0.1 | - | all |
| `vaulted_halls` | Vaulted Halls | Great Halls | 8, 10 | 1751 | 2 | great_halls | - | - | industrial_capacity_factory 0.15; industrial_capacity_dockyard 0.1; global_building_slots_factor 0.1 | - | all |
| `covered_yards` | Covered Yards | Great Halls | 8, 12 | 1754 | 2 | vaulted_halls | - | - | industrial_capacity_factory 0.15; industrial_capacity_dockyard 0.1; global_building_slots_factor 0.1 | - | all |
| `treadwheel_cranes` | Treadwheel Cranes | Great Halls | 8, 14 | 1758 | 2 | covered_yards | - | - | industrial_capacity_factory 0.15; industrial_capacity_dockyard 0.1; global_building_slots_factor 0.1 | - | all |
| `crown_foundries` | Crown Foundries | Great Halls | 8, 18 | 1764 | 2.5 | treadwheel_cranes | - | - | industrial_capacity_factory 0.15; industrial_capacity_dockyard 0.1; global_building_slots_factor 0.1 | - | all |
| `village_forges` | Village Forges | Village Forges | 10, 8 | 1748 | 2 | - | standard_patterns | great_halls | industrial_capacity_factory 0.1; industrial_capacity_dockyard 0.1; line_change_production_efficiency_factor 0.1; production_factory_start_efficiency_factor 0.05; industry_repair_factor 0.1; global_building_slots_factor 0.1 | - | all |
| `roadside_smithies` | Roadside Smithies | Village Forges | 10, 10 | 1751 | 2 | village_forges | - | - | industrial_capacity_factory 0.1; industrial_capacity_dockyard 0.1; line_change_production_efficiency_factor 0.1; production_factory_start_efficiency_factor 0.05; industry_repair_factor 0.1; global_building_slots_factor 0.1 | - | all |
| `charcoal_leagues` | Charcoal-Burners' Leagues | Village Forges | 10, 12 | 1754 | 2 | roadside_smithies | - | - | industrial_capacity_factory 0.1; industrial_capacity_dockyard 0.1; line_change_production_efficiency_factor 0.1; production_factory_start_efficiency_factor 0.05; industry_repair_factor 0.1; global_building_slots_factor 0.1 | - | all |
| `travelling_smiths` | Travelling Smiths | Village Forges | 10, 14 | 1758 | 2 | charcoal_leagues | - | - | industrial_capacity_factory 0.1; industrial_capacity_dockyard 0.1; line_change_production_efficiency_factor 0.1; production_factory_start_efficiency_factor 0.05; industry_repair_factor 0.1; global_building_slots_factor 0.1 | - | all |
| `steading_foundries` | Steading Foundries | Village Forges | 10, 18 | 1764 | 2.5 | travelling_smiths | - | - | industrial_capacity_factory 0.1; industrial_capacity_dockyard 0.1; line_change_production_efficiency_factor 0.1; production_factory_start_efficiency_factor 0.05; industry_repair_factor 0.1; global_building_slots_factor 0.1 | - | all |
| `slipways` | Slipways | Shipwrights | 12, 2 | 1650 | 1.5 | - | dressed_stone | - | production_speed_dockyard_factor 0.1; industrial_capacity_dockyard 0.1 | - | all |
| `dry_docks` | Dry Docks | Shipwrights | 12, 6 | 1735 | 1.5 | slipways | arch_and_vault | - | production_speed_dockyard_factor 0.1; industrial_capacity_dockyard 0.1 | - | all |
| `great_yards` | Great Yards | Shipwrights | 12, 14 | 1758 | 2 | dry_docks | division_of_labour | - | production_speed_dockyard_factor 0.15; industrial_capacity_dockyard 0.15 | - | all |
| `wellspring_tapping` | Wellspring Tapping | Essence-Craft | 14, 4 | 1700 | 1.5 | - | pit_props | - | local_resources_oil_factor 0.2 | - | all |
| `ley_stone_channels` | Ley-Stone Channels | Essence-Craft | 14, 6 | 1741 | 1.5 | wellspring_tapping | - | - | local_resources_oil_factor 0.2 | - | all |
| `phials_and_vials` | Phials and Vials | Essence-Craft | 14, 12 | 1755 | 2 | ley_stone_channels | - | - | country_resource_oil 2 | - | all |
| `deep_wells` | Deep Wells | Essence-Craft | 14, 18 | 1765 | 2.5 | phials_and_vials | great_library | - | local_resources_oil_factor 0.25 | - | all |
| `leaf_craft` | Leaf-Craft | Peoples' Crafts | 16, 0 | 1640 | 1.5 | - | - | - | local_resources_aluminium_factor 0.2; production_speed_buildings_factor 0.05 | - | elves, sun_elves |
| `forge_pits` | Forge-Pits | Peoples' Crafts | 16, 2 | 1665 | 1.5 | - | - | - | production_speed_arms_factory_factor 0.1; local_resources_steel_factor 0.1 | - | orcs, trolls |
| `quarry_songs` | Quarry-Songs | Peoples' Crafts | 16, 4 | 1710 | 1.5 | - | - | - | local_resources_tungsten_factor 0.25 | - | giants |
| `vent_forges` | Vent-Forges | Peoples' Crafts | 16, 6 | 1745 | 1.5 | - | - | - | local_resources_oil_factor 0.2; production_speed_arms_factory_factor 0.1 | - | Volgan, demons |

Notes on rows. Exclusive roots (`great_halls`, `village_forges`) cost 2.0 and are researchable from 1 Thaw 4A 1748 with no ahead-of-time penalty; they need `standard_patterns` (1746). The two Guild Methods endings are exclusive and share the cost 2.5. Restricted rows sit in column 16 at different years so that no two tiles share a slot, and a realm sees at most one of them. `deep_wells` needs `great_library` (electronics folder); `irrigation_canals` needs `drainage_wheels`, so Provisions growth rides on the mining line.

#### 4.3 Letters and Beacons (`electronics_folder`, 15 technologies)

| Key | Name (working label) | Line | x, y | Year | Cost | Path | Needs | XOR | Effects | Unlocks | Who |
| --- | --- | --- | --- | ---: | ---: | --- | --- | --- | --- | --- | --- |
| `scriptoria` | Scriptoria | Scholarship | 0, 0 | 1600 | 1 | - | - | - | research_speed_factor 0.03 | - | all |
| `libraries` | Libraries | Scholarship | 0, 2 | 1680 | 1.5 | scriptoria | - | - | research_speed_factor 0.04 | - | all |
| `universities` | Universities | Scholarship | 0, 6 | 1730 | 1.5 | libraries | - | - | research_speed_factor 0.05 | - | all |
| `scholars_conclaves` | Scholars' Conclaves | Scholarship | 0, 12 | 1756 | 2 | universities | - | - | research_speed_factor 0.08 | - | all |
| `great_library` | The Great Library | Scholarship | 0, 18 | 1764 | 2.5 | scholars_conclaves | - | - | research_speed_factor 0.08 | +1 research slot | all |
| `wax_seals` | Wax Seals | Seals | 2, 4 | 1700 | 1 | - | libraries | - | encryption 1 | - | all |
| `cipher_scripts` | Cipher Scripts | Seals | 2, 6 | 1740 | 1 | wax_seals | universities | - | encryption 1 | - | all |
| `sealed_couriers` | Sealed Couriers | Seals | 2, 14 | 1757 | 1 | cipher_scripts | scholars_conclaves | - | encryption 1 | - | all |
| `cipher_wheels` | Cipher Wheels | Codes | 4, 6 | 1735 | 1.5 | - | libraries | - | decryption 1 | - | all |
| `letter_counts` | Letter Counts | Codes | 4, 10 | 1752 | 1.5 | cipher_wheels | universities | - | decryption 1 | - | all |
| `reading_rooms` | Reading Rooms | Codes | 4, 16 | 1760 | 1.5 | letter_counts | scholars_conclaves | - | decryption 1 | - | all |
| `watch_fires` | Watch Fires | Beacon Craft | 6, 2 | 1650 | 1.25 | - | - | - | naval_detection 0.05 | radar_station L2 | all |
| `horn_chains` | Horn Chains | Beacon Craft | 6, 4 | 1720 | 1.25 | watch_fires | - | - | naval_detection 0.05; air_detection 0.05 | radar_station L4 | all |
| `far_seeing_glass` | Far-Seeing Glass | Beacon Craft | 6, 12 | 1756 | 1.25 | horn_chains | universities | - | naval_detection 0.1 | radar_station L5 | all |
| `glass_towers` | Glass Towers | Beacon Craft | 6, 18 | 1766 | 1.25 | far_seeing_glass | scholars_conclaves | - | naval_detection 0.1; air_detection 0.1 | radar_station L6 | all |

Notes on rows.

- **The Great Library** carries `on_research_complete = { add_research_slot = 1 }` with `on_research_complete_limit = { amount_research_slots < 5 }` (so the tooltip shows only when the slot is real), and `allow = { amount_research_slots < 5 }` so that a realm already at five slots cannot research it for the slot alone. No realm has it at start.
- **Scholarship adds up** to +0.28 research speed at the top (0.03 + 0.04 + 0.05 + 0.08 + 0.08), the same total as vanilla's electronics root and computing line.
- **Seals and Codes** give the engine's `encryption` and `decryption` modifiers, one per step. They sit beside the agency's cryptology department (the Reading Room, [08_institutions.md](08_institutions.md) §6): the department sets the cipher strength, these set the base. The engine's `allow_branch` that hid them when the agency was on is not copied; ZIN has no DLC tests.
- **Beacon Craft** unlocks `radar_station` (Beacon Towers) by level: Watch Fires level 2, Horn Chains level 4, Far-Seeing Glass level 5, Glass Towers level 6. The vanilla chain gave the building through special-project technologies; ours is ordinary research. No state starts with a beacon tower.
- `far_seeing_glass` and `glass_towers` need Universities and Scholars' Conclaves because the lens-grinders are scholars. Their detection bonuses stack with the building's own.

### 5. Layout rules

The same rules draw every technology folder, including warfare's. `technologies.mjs` computes the positions, the gridboxes and the folder window from the rows; no coordinate is typed by hand.

1. **One line, one column.** A line is a vertical chain (`format = "UP"`: x runs left to right, y top to bottom). Columns are two slots apart (140 pixels), the pitch of the vanilla year headers. A slot is 70 by 70 pixels (`slotsize` stays 70, or every connector would show a gap).
2. **One row, one era.** The vertical position is a function of the year, the same in every folder, so a row reads as an era across the whole window:

| Row y | 0 | 2 | 4 | 6 | 8 | 10 | 12 | 14 | 16 | 18 | 20 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Years | to 1649 | 1650–1699 | 1700–1729 | 1730–1747 | 1748–1750 | 1751–1753 | 1754–1756 | 1757–1759 | 1760–1762 | 1763–1767 | 1768–1790 |

   The band edge between rows 6 and 8 is the campaign start; a thin bronze rule is drawn there with the caption "1 Thaw 4A 1748". Every row has a caption in the left gutter with its years (text boxes, `instantTextBoxType`, one key per row, `zin_techtree_year_<y>`). A line never has two tiles in one band; if two rows of a line would share a band, one of the years is wrong (a build test).
3. **One gridbox per root.** Every row without a `path` parent gets a gridbox named `<key>_tree` placed so that its tile lands on the row's absolute slot. Descendants carry coordinates relative to their root (x minus the root's x, y minus the root's y); an exclusive twin sits at x −1 or +1. All gridboxes use `slotsize 70 × 70`.
4. **Cross-line needs draw nothing.** `dependencies` carry no connector, so a need never creates a second gridbox candidate. `ignore_for_layout` is therefore never required; the build fails if a row has two `path` parents.
5. **Folder windows.** Each folder is a container window named exactly like its key, with a tiled background (largest 1230 × 766), a vertical scrollbar (rows reach y = 20, 1,400 pixels plus the header), the row captions, and the gridboxes. The item containers are `techtree_<folder>_item` and `techtree_<folder>_small_item`. Every tile in this spec's two folders uses the small item (they unlock no equipment), forced with `force_use_small_tech_layout = yes`.
6. **Tab and sprites.** The tab is `<folder>_tab` (two frames: open and closed) in the `folder_tabs` strip, which has room for twelve emblems; the thirteen folders include the hidden special-forces one, which has none. A tile's icon is `GFX_<tech key>_medium`, so for example `GFX_zin_tech_water_wheels_medium` (the asset inventory's `GFX_zin_tech_<key>` is read with the engine suffix). Sprites are written to `interface/zin_technologies.gfx` from the generated icons.
7. **Colours.** Researched, available, unavailable and researching backgrounds are the five default sprites re-skinned; exclusive twins use the red-wax backing of the focus tree. Peoples' crafts use a plate with the people's emblem. These are art directions for [07_interface/02_full_ui_reskin.md](../07_interface/02_full_ui_reskin.md).
8. **The window file.** `interface/countrytechtreeview.gui` and `.gfx` are overridden by a file generated from the installed one at build time (vanilla removal rule 5): the vanilla folder windows are dropped, the ZIN windows inserted. `technologies.mjs` writes it, because it is the only module that knows the gridboxes. The interface spec lists the file as owned by the warfare spec; that moves here (§8).

### 6. The research slot economy

**Sources of slots.** The politics step sets slots by class (foundation §5: 4, 3, 2 or 1). Every other source is capped so that no realm passes five.

| Source | Slots | Rule |
| --- | ---: | --- |
| Class start | 1 to 4 | History |
| The Great Library | +1 | Technology, once, only below five |
| Tree rewards | up to +1 | A major tree's research focus may add a slot only while `amount_research_slots < 5`; the compiler checks that every `add_research_slot` is guarded |
| Characters | 0 | Scholars never add slots; they speed one facility's project (§10 of the institutions spec) |

**Sources of speed.** Scholarship (+0.28 at the top), the research-speed spirits of the regional economy ideas (`zin_econ_magical_lands` +0.05, economy spec), and trees. The engine floor `MIN_RESEARCH_SPEED` is 0.1.

**Costs.** §3.1. The ahead-of-time penalty makes a technology a year early cost far more than waiting, so slots are spent on the era a realm lives in. `BASE_RESEARCH_POINTS_SAVED` (30 per slot) stays.

**Capacity over the campaign window (4A 1748 to 1760, 4,383 days, default speed).**

| Slots | Slot-days | Technologies of cost 2.0 (330 days) |
| ---: | ---: | ---: |
| 1 | 4,383 | 13 |
| 2 | 8,766 | 26 |
| 3 | 13,149 | 40 |
| 4 | 17,532 | 53 |

**Demand.** This spec's two folders hold 20 technologies dated 1746 to 1760 (6,146 slot-days) and 9 later ones (3,506). The warfare folders hold 42 and 11 (about 13,900 and 4,500). A great power sees, after people and exclusion filters, about 50 campaign-window technologies in all folders: 16,500 slot-days against a capacity of 17,500 to 22,000 (with scholarship). A two-slot realm covers about half. The tuning is therefore not "researching is scarce" but "researching is a choice": the tree is year-gated, the exclusions bite, and the sandbox horizon (to 4A 1800, 52 years) is where the cost 165 is balanced. **Targets** (acceptance 8): by 1 Thaw 4A 1760 an AI great power has researched 60 to 90 per cent of the visible technologies dated 1760 or earlier, and an AI two-slot realm 30 to 55 per cent. If the observer run falls outside, the levers in order are `BASE_TECH_COST` (defines data), the band costs (`costRule` in the data file), then the speed bonuses.

**Zol and Yeldenne** have one slot and nothing to choose in these folders. Zol's slot idles; the AI never fills it.

### 7. Text direction

Names, descriptions and tooltips are written by the implementer from this direction; the working labels above are not final prose.

- **Voice.** The craft of people who have not needed to hurry. Names are trades and tools (a wheel, a hammer, a lodge), never inventions with a modern ring. A description is one or two sentences about what the craft changes in a village or a court, then the engine line.
- **What the player reads.** Each description states the practical gain in plain words; the engine tooltip below it carries the numbers. No description claims the craft was invented in a year.
- **Seals and Codes** read as scribes' craft: wax, thread, sealed pouches, letter-counting. They never read as machines.
- **Beacon Craft** reads as watch fires, horns and glass on towers. Nothing says radar or wireless.
- **Essence-Craft** reads as careful, local, dangerous work at known wells. It never explains what Essence is or where it comes from (rule 6 of [04_magic_and_world_systems.md](04_magic_and_world_systems.md): the unknown stays unknown).
- **Peoples' Crafts** each carry one line of their people's voice (the elves' living wood, the orcs' pit-fires, the giants' singing stones, the vents of the Dead Lands) and nothing about origins.
- **Avoid** the words on the banned list of [05_world_tension_and_endings.md](05_world_tension_and_endings.md) and the master plan's text sweep: factory, assembly line, machine, radio, radar, computer, encryption, fuel, nuclear.
- **Dynamic text.** The Great Library's description reads the live slot count; the exclusive roots' tooltips name the twin they shut out.

### 8. Cross-checks and changes to other specs

This spec is written against [01_warfare.md](01_warfare.md) §11 and §15, the economy spec and the vanilla removal spec. These items are changes or confirmations the integrator must apply; none is applied here.

| # | Spec and place | Change |
| --- | --- | --- |
| 1 | Warfare §15.2 (`common/technologies`, `common/technology_tags`) and economy "Builder module and data" (`zin_industry.txt`) | **One writer.** `tools/content/modules/technologies.mjs` writes every technology file: warfare's seven (`zin_arms.txt` … `zin_skies.txt`) from `data/warfare/technologies.json`, and `zin_industry.txt`, `zin_scholarship.txt` and `zin_gates.txt` from `data/technologies.json`. `warfare.mjs` keeps units, equipment, doctrines, templates and start forces; `economy.mjs` drops the `zin_industry.txt` row. One module means one layout, one cost rule and one set of tests for 170 technologies |
| 2 | Warfare §15.2, `common/technology_tags` | `zin_technology_tags.txt` is written by `technologies.mjs` from the folder and category tables of §2 (warfare's 13 categories plus the six here and the kept ones) |
| 3 | Warfare §15.7 (start packages) | `technologies.mjs` exports the technology half of `start_packages.json` (§3.3 rules, one list per package); `warfare.mjs` merges it with the doctrines and writes the single file the politics step reads |
| 4 | Vanilla removal §5, stage 2 list; warfare §15.2 | **Add `common/ai_focuses/zin_ai_focuses.txt`** to the stage-2 rewrite (§2.3). Its stage-1 version names vanilla categories that stop existing |
| 5 | Warfare §11.3 (Engines and Walls) | Carry fort-level unlocks. The vanilla fortification technologies give `bunker_max_level_terrain_limit` and `coastal_bunker_max_level_terrain_limit`; without them no technology raises the buildable fort level. Proposed: Stone Forts +2 land and +2 coastal, Layered Walls +1 land, Harbour Chains +1 coastal, Wall Wardens +1 land, Bastions +1 land, Curtain Walls +1 land and +1 coastal. `zin_tech_curtain_walls` also lists `enable_building = { building = stronghold_network level = 1 }`. The Great Wall's level 5 and 6 forts come from history and need no unlock |
| 6 | Warfare §11.4 and 11.6 | Warfare's `zin_tech_heralds` serves the agency upgrade that vanilla ties to radio ([08_institutions.md](08_institutions.md) §6 names the test) |
| 7 | [05_defines_and_rules.md](../00_foundation/05_defines_and_rules.md), content rule "No technology … grants … `radar_station`" | **Conflict.** The inventory (WE-017, WE-169) and the economy spec keep Beacon Towers. This spec unlocks `radar_station` through Beacon Craft. Proposal: the defines spec drops `radar_station` from the barred list (reactors and rocket sites stay barred). Watch fires and horns fit the lore; the building cannot end a war |
| 8 | Economy acceptance 2 and "Buildings" intro | Add the gate technologies (§3.4); the sentence "unlocked only by technologies the ZIN tree never contains" is true only with them |
| 9 | Interface spec ([02_full_ui_reskin.md](../07_interface/02_full_ui_reskin.md) §4.7, "the file owned by the warfare spec") | `countrytechtreeview.gui` is owned by `technologies.mjs` (§5.8) |
| 10 | Warfare §11 intro | Cost rule, band table and the `who` syntax are this spec's §3; warfare's `Who` column maps to `allow_branch` as §3.2 says |
| 11 | Asset inventory WE-024 | Icon count is 54 for the civilian folders (not about 40), plus none for the seven gates (they have no folder) |
| 12 | Warfare §12.3 (special forces folder) | The hidden `zin_sub_hidden_special_forces` needs a `track` that exists; see [09_naval_air_doctrines.md](09_naval_air_doctrines.md) §9 |

## Implementation

### Builder module and data

| Path | Kind | Content |
| --- | --- | --- |
| `tools/content/modules/technologies.mjs` (new) | builder module | Reads both data files, validates, lays out, and stages every technology file below. Exports `technologyPackages()` and `technologyBlock()` (the shared writer) |
| `tools/content/lib/tech_layout.mjs` (new) | library | Bands, positions, gridboxes, the folder window text (§5) |
| `tools/content/data/technologies.json` (new) | builder data | This spec's rows (§4), the folder and category tables (§2), the band and cost rules (§3.1), the gate rows (§3.4), the AI focus table (§2.3) |
| `tools/content/data/warfare/technologies.json` (warfare spec) | builder data | Warfare's rows in the same row schema |
| `tools/content/technologies.test.mjs` (new) | test | Acceptance 1 to 5 and the negative tests |
| `common/technologies/zin_industry.txt` | generated, stage 2 | The 39 `industry_folder` technologies |
| `common/technologies/zin_scholarship.txt` | generated, stage 2 | The 15 `electronics_folder` technologies |
| `common/technologies/zin_gates.txt` | generated, stage 2 | The seven gate technologies |
| `common/technologies/zin_arms.txt`, `zin_mounts.txt`, `zin_engines.txt`, `zin_lore.txt`, `zin_camp.txt`, `zin_naval.txt`, `zin_skies.txt` | generated, stage 2 | Warfare's rows |
| `common/technology_tags/zin_technology_tags.txt` | generated, stage 2 | 13 folders, all categories |
| `common/ai_focuses/zin_ai_focuses.txt` | generated, stage 2 (rewrite) | §2.3 |
| `common/scripted_triggers/zin_technologies.txt` | generated | `zin_rules_skies_present`, `zin_rules_skies_beasts`, `zin_tech_not_zol`, and `zin_tech_people_<key>` wrappers |
| `interface/zin_technologies.gfx` | generated | One `GFX_<tech key>_medium` per researchable technology; the folder tab sprites and background sprites |
| `interface/countrytechtreeview.gui`, `.gfx` | generated override, stage 2 | §5.8 |
| `localisation/english/zin_technologies_l_english.yml` | generated | Folder, category, technology names and descriptions; row captions |

The dispositions rows for `common/technologies`, `common/technology_tags` and `common/ai_focuses` already exist; stage 2 updates their `zin` lists to these files.

### Row schema (`technologies.json`)

The file is `{ "schema": 1, "bands": [...], "costRule": {...}, "folders": [...], "categories": [...], "lines": [...], "technologies": [...], "gates": [...], "aiFocuses": {...} }`. Every object is validated; unknown fields are errors.

| Field | Type | Meaning |
| --- | --- | --- |
| `bands[]` | `{ to: int, y: even int }` | Upper year of each row (§5.2); the last band has `to` 9999 |
| `costRule` | `{ start: number, campaign: number, sandbox: number, campaignFrom: int, sandboxFrom: int }` | 1.5, 2.0, 2.5, 1746, 1761 |
| `folders[]` | `{ key, ledger: army|navy|air|civilian|hidden, name, available?: triggerName, doctrine?: bool, tab?: frameIndex }` | §2.1 |
| `categories[]` | `{ key, kept?: bool, group }` | §2.2 |
| `lines[]` | `{ key, folder, column: int, categories: [], specialization?: [], ai: { base: number, modifiers?: [{ factor, when }] } }` | §4.1 |
| `technologies[].key` | string, `^zin_tech_[a-z0-9_]+$` | Unique |
| `.name` | string | Working label; the localisation key is the technology key |
| `.line` | string | A `lines[].key` |
| `.x` | int | Absolute column; defaults to the line's column; ±1 for an exclusive twin |
| `.year` | int 1500–1790 | Drives the row (`y`, derived) and the cost |
| `.cost` | number? | Only when it differs from `costRule` |
| `.requires` | `[key]` | At most one (a second path parent is an error) |
| `.needs` | `[key]` | Cross-line `dependencies` |
| `.xor` | `[key]` | Both sides must list each other |
| `.modifiers` | `{ modifier: number }` | Country modifiers, written directly in the technology; names checked (below) |
| `.blocks` | `[{ target, terrain?, stats: {} }]` | Sub-unit or category stat blocks (warfare's rows use these) |
| `.unlocks` | `{ equipment: [], modules: [], subunits: [], buildings: [{ building, level }], tactics: [] }` | The `enable_*` lists |
| `.who` | `{ peoples?: [], countries?: [], not?: [] }` | Becomes `allow_branch` |
| `.allow` | triggerName? | Becomes `allow` (for example `zin_zol_rising` windows) |
| `.onComplete` | effectName? | Becomes `on_research_complete` (with its limit) |
| `.grantOnly` | bool | `allow = { always = no }`, no folder |
| `.specialization` | `[key]?` | Adds `special_project_specialization`; defaults to the line's |
| `.ai` | `{ base?, modifiers? }` | Defaults to the line's |
| `.inventory` | `[row id]` | Inventory rows the technology closes |

**Derived, never typed:** `y` (from `bands`), `cost` (from `costRule`), the gridbox, `start_year` (= `year`), `folder` position, `categories` (line defaults plus extras), and start-package membership (§3.3).

**Validation (build fails on any):** keys unique and well formed; year in 1500 to 1790; `y` and `cost` match the rules; a `requires` or `needs` parent exists and is not later than the child; no cycle; XOR symmetric; no two simultaneously visible tiles on one slot; a line with two tiles in one band; a restricted row with no `who`; a gate that is not `grantOnly`; a non-gate row that lists `rocket_site`, a reactor, `fuel_silo`, `synthetic_refinery` or `mega_gun_emplacement`; a modifier absent from the installed `modifiers_documentation.md` after expanding the dynamic families.

### Engine keys checked (game 1.19.3, 19 October 2026)

- **Technology fields** (`research_cost`, `start_year`, `folder`, `path`, `dependencies`, `XOR`, `categories`, `allow`, `allow_branch`, `enable_building`, `on_research_complete`, `on_research_complete_limit`, `special_project_specialization`, `force_use_small_tech_layout`, `ai_will_do`): read from the installed vanilla technologies and the technology wiki page.
- **Modifiers:** `production_speed_buildings_factor`, `industry_repair_factor`, `local_resources_factor`, `production_factory_max_efficiency_factor`, `equipment_conversion_speed`, `line_change_production_efficiency_factor`, `production_factory_efficiency_gain_factor`, `production_factory_start_efficiency_factor`, `energy_gain_factor`, `monthly_population`, `industrial_capacity_factory`, `industrial_capacity_dockyard`, `global_building_slots_factor`, `production_speed_dockyard_factor`, `production_speed_arms_factory_factor`, `research_speed_factor`, `encryption`, `decryption`, `naval_detection`, `air_detection`.
- **Dynamic families** (not matched by the builder's `assertModifiers` pattern, which reads only `## name` headings): `local_resources_<resource>_factor` and `country_resource_<resource>`, for the seven engine resource keys. `technologies.mjs` expands each family from that list and checks the result against the documentation's family heading (`## local_resources_<Resource>_factor`, `## country_resource_<Resource>`).
- **Effect:** `add_research_slot`. **Trigger:** `amount_research_slots`. **Building keys:** `radar_station` (`state_max = 6`), and the seven gated buildings.

### Crash risks

- A tile with no gridbox does not render; the validation rejects a root that is not a gridbox root.
- `XOR` on one side only makes no exclusion; the validation checks both sides.
- A category named in a row but missing from the tag file breaks bonuses silently; the validation compares them.
- Replacing the tag file drops categories that kept files name; check C3 reports them (§2.2).
- A removed building gate makes unused buildings constructible (§3.4).
- A folder window without its tab, container and item containers cannot be used by the player; the AI can still research there. The override of `countrytechtreeview.gui` is checked by `hoi4_tech_render` with `view = folder` for each folder.

## AI

- **Research.** The AI picks by `ai_will_do` (the line table), `ai_focuses` (§2.3) and the engine's cost and bonus factors. The XOR roots read the realm's Guild Workshops: 20 or more favours Great Halls, fewer favours Village Forges; a realm with neither condition rolls the base 25 each way.
- **Peace first.** Seals, Codes and Beacon Craft stay at weight 2 and 1 until `zin_gathering_dark` reaches 25 or the realm is at war, so a peaceful AI builds libraries and mills before it builds watch fires.
- **Slots.** The AI researches the Great Library when it is the cheapest unlocked Scholarship tile (base 50); it is never forced.
- **Zol and Yeldenne** do not research here.
- **Probability audit.** The hoi4 probability tool compares the weights above before and after implementation for four named scenarios: a Concord dominion at peace, Aenor at peace, Lerendor with a navy, Volgan at start. Expected: libraries and masonry outrank Beacon Craft in all four; Shipwrights outrank Mining for Lerendor; Essence-Craft outranks Mining for Volgan.

## Acceptance

1. **Data.** `technologies.json` validates against the schema; it holds 54 researchable rows (39 and 15) and 7 gates; all keys, years and costs satisfy §3.1; every `y` matches the bands; no two visible tiles share a slot.
2. **Table equals data.** A test parses the tables of §4.2 and §4.3 and compares them, field by field, with the data file. A change to one without the other fails.
3. **Modifiers.** Every modifier of every row exists in `modifiers_documentation.md` (dynamic families expanded). Negative: a planted `fuel_gain_factor` row fails.
4. **Folders and categories.** The tag file holds 13 folders and every category of §2.2; the Eyries folder carries the sky-rule trigger; every category appears in an AI focus; no vanilla category survives (builder test). C3 reports no reference to a missing category.
5. **Tools.** HOI4 Agent Tools technology inspection (`lint`, `trace`, `unlocks`) passes for both folders; `hoi4_tech_render` produces a folder image for each folder, a dependencies view for the Guild Methods line and the exclusive pair, and an assets view with no missing sprite.
6. **Linux run (clock unpaused, one in-game year).** (a) For Aenor on 1 Thaw 4A 1748 the constructible-building trigger `can_construct_building` is false in every owned state for `rocket_site`, `fuel_silo`, `synthetic_refinery`, `nuclear_reactor`, `nuclear_reactor_heavy_water`, `commercial_nuclear_reactor`, `mega_gun_emplacement` and `radar_station`, and true for `radar_station` after `watch_fires` is granted (level 2 only until `horn_chains`). (b) Researching `great_halls` makes `village_forges` unresearchable and the reverse. (c) A technology dated 1750 researched in 1748 shows an ahead-of-time cost. (d) The Great Library adds one research slot below five and none at five. (e) The research window shows the twelve visible folder tabs without an error line.
7. **Zero errors.** The Linux run's `error.log` has no "unknown technology", "unknown category" or "unknown folder" line from these files (stage-2 budget, vanilla removal §6).
8. **Pacing.** The 4A 1760 observer run meets the targets of §6 for an AI great power and an AI two-slot realm.
9. **Start.** For every package row of §3.3 a builder test lists the granted keys; no package grants an exclusive root, a restricted row to the wrong people, or any row to Zol.
10. **Inventory closed.** WE-013, WE-014, WE-015, WE-017 and WE-018 are marked `done` with the file names above; WE-016, WE-019 and WE-023 are marked `done` as removed with the gates; WE-001 and WE-002 note the shared tag file; WE-024 notes 54 icons.

## Open questions

All proceed on the labelled proposal; the owner's answers go to [OPEN_QUESTIONS.md](../OPEN_QUESTIONS.md).

1. **Beacon Towers.** May a pre-modern watch system exist (cross-check 7)? **Proposal, in use:** yes, as ordinary research.
2. **Count.** Is 54 civilian technologies right, or should the three new lines shrink to reach "about 40"? **Proposal, in use:** 54; the extra lines carry the shipwright, essence and peoples' content the brief asks for.
3. **The fifth research slot.** Should one scholarly line, rather than trees, gate the fifth slot? **Proposal, in use:** yes, the Great Library, with trees allowed one more only below five.
4. **Gate technologies.** Are they needed? **Proposal, in use:** yes, until the Linux run shows otherwise (acceptance 6).
5. **Dwarves.** If the vault places them, they would take a Peoples' Craft (a mountain-hall line). **Proposal, in use:** none until the lore places them (owner short list 12).

## Names this spec registers

| Name | Kind | Scope | Meaning | Owner | Also used by |
| --- | --- | --- | --- | --- | --- |
| `zin_tech_<key>` (the 54 rows of §4 and seven `zin_tech_gate_<key>` rows) | technology | country | The craft, scholarship and gate technologies | this spec | 08_institutions (traits, upgrades), 01_warfare (cross-checks), economy |
| `zin_cat_granaries`, `zin_cat_yards`, `zin_cat_essence_craft`, `zin_cat_scholarship`, `zin_cat_seals`, `zin_cat_beacons` | technology category | country | New research-bonus categories (pattern `zin_cat_<key>` is owned by 01_warfare; these six are listed here) | this spec | trees, 08_institutions (workshops) |
| `industry_folder`, `electronics_folder` | technology folder | country | Kept engine keys, shown as "Craft and Works" and "Letters and Beacons" | this spec | 01_warfare, economy |
| `zin_rules_skies_present` | scripted trigger | country | The sky rule is not `none`; gates the Eyries folder, the air doctrine folder and the air hooks | this spec | 01_warfare, 09_naval_air_doctrines, 08_institutions |
| `zin_rules_skies_beasts` | scripted trigger | country | The sky rule is `beasts` (griffin riders and their doctrine) | this spec | 09_naval_air_doctrines, 01_warfare |
| `zin_tech_not_zol` | scripted trigger | country | The country is not Zol (resolved from the roster at build time) | this spec | 01_warfare |
| `zin_techtree_year_<y>` | localisation key | — | Row captions of the technology windows | this spec | 07_interface |
| `technologies.mjs`, `data/technologies.json`, `lib/tech_layout.mjs` | builder module, data, library | — | The technology writer | this spec | 01_warfare, 02_economy |
