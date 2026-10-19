# Vanilla removal and zero errors

**Status:** Draft. **Priority:** 1. **Phase:** 1.

The work starts in phase 1 and finishes in phase 7. Each stage in section 5 names its phase.

## Purpose

ZIN is finished only when `error.log` has **no line caused by a ZIN file and no line caused by vanilla content the mod leaves active** ([PROGRAM.md](../PROGRAM.md), goal 2). Today most lines come from vanilla content that is still loaded but points at things ZIN has removed. This spec covers five things:

1. It lists every vanilla content folder of the installed game (`common`, `events`, `history`, `interface`, `localisation`, plus the few `gfx`, `portraits`, `country_metadata` and `tutorial` files that hold vanilla content).
2. It decides one of three actions for each folder: **replace** (`replace_path`, with the ZIN content that takes its place), **override** (ship files with the same name), or **keep** (the engine needs it, with the reason).
3. It sets the order of removal, so that no stage crashes the game or creates new errors.
4. It classifies today's baseline of 1,902 lines.
5. It sets the error budget for each stage and the checks that hold it.

Music and sound folders are covered in [08_art_and_assets/04_music_and_sound.md](../08_art_and_assets/04_music_and_sound.md). Map files (`map/`) belong to [01_map](../01_map/).

## Lore basis

| Fact | Status | Source |
| --- | --- | --- |
| On 1 Thaw 4A 1748 the Golden King reigns, Eindil has not appeared, Afrit is unrevealed and Erdae seems at peace | owner-fixed | *The Campaign of 4A 1748* |
| Nothing a player sees is vanilla unless it is engine-generic; no modern words where players read | owner goal, 18 October 2026 | [PROGRAM.md](../PROGRAM.md) |
| About 300 crowns, dominions, clans and island lordships divide Erdae; the mod has 305 countries | established working table | *The Campaign of 4A 1748*, roster |
| No firearms, aircraft or atomic weapons in the setting | design (absence in the vault) | [05_defines_and_rules.md](05_defines_and_rules.md) |
| Every disposition, stage, budget and file name below | **proposed** | this spec |

Removal matters for the lore as well as for the log. Vanilla content that stays loaded can show 1936 text, modern names or vanilla advisors to a ZIN country. Today every ZIN country falls back to the vanilla generic focus tree and gets vanilla generic advisors from `history/general/generic_advisors.txt`.

## Design

### 1. Rules for removal

1. **Three actions only.** Each vanilla folder or file is `replace` (a `replace_path` line in the descriptor, with ZIN files in the same folder), `override` (a ZIN file with the same relative path and name, which hides the vanilla file whatever it contains), or `keep` (left loaded on purpose, with the reason recorded). Nothing else is allowed, such as hoping a vanilla file is never read.
2. **`replace_path` does not reach subfolders.** It unloads only the files directly inside the named folder (wiki, *Modding*, replace_path). Each subfolder needs its own line. Today's `replace_path="common/decisions"` leaves the 57 files of `common/decisions/categories` loaded, and they produce the `ETH_`, `ENG_` and `CHI_decision_categories.txt` errors in the baseline.
3. **No empty replaced folder.** Every replaced folder ships at least one ZIN file with at least one valid definition. Some folders crash the game when they are empty: national focus, continuous focus, country tags without enough dynamic tags, AI templates, units, unit leader, and states (wiki, *Troubleshooting*, "Common crash causes"). The builder fails a build whose replaced folder has no definition.
4. **Both descriptors.** A `replace_path` line works only if it is in both `descriptor.mod` and the user-side `mod/zin.mod` (wiki, *Modding*). The builder writes `descriptor.mod`, and the sync step copies the `replace_path` lines into `zin.mod`. A check fails when the two sets differ. Today they match: 12 lines each.
5. **Replacements are ZIN content.** A ZIN file that takes the place of a vanilla file uses ZIN keys, ZIN text and ZIN conditions. It may keep a vanilla key where history files or the engine read it, such as the law keys `civilian_economy` and `limited_conscription` that [02_economy.md](../03_gameplay/02_economy.md) renames, or the engine hook triggers in section 3.6. It never carries vanilla country conditions, decision ids or text. Overrides of engine data files that hold only lists of identifiers (`common/script_enums.txt`, `sound/category.asset`) may be generated from the installed file at build time plus ZIN entries. This follows the precedent in [01_warfare.md](../03_gameplay/01_warfare.md) §15.2, and the spec that owns each such file names it.
6. **Leftovers count against ZIN.** A vanilla file the mod leaves loaded belongs to ZIN for the error budget. Its lines are ZIN's lines.
7. **No removal without a reference scan.** Before a folder is replaced, the builder scans every file that stays loaded (kept vanilla files and every ZIN file) for references into that folder. A reference to a removed definition fails the build (section 4, check C3).
8. **Every stage runs the crash tests.** Careless `replace_path` use is the most common cause of crashes (wiki, *Troubleshooting*). Every stage of section 5 runs the Aenor start test R1 and the start cases L1 of [01_acceptance.md](../09_validation/01_acceptance.md) before it is committed.

### 2. The baseline

**Source:** the owner's last Windows run, `Documents/Paradox Interactive/Hearts of Iron IV/logs/error.log`, written 18 October 2026 23:10, game version 1.19.3 (Operation Postern). The file was read from disk. The game was not launched, controlled or captured. The bookmark still started in 1936, so lines after load carry the date 1936.01.01.12.

**Total: 1,902 lines.**

| Id | Category | Lines | Example | Cause | Fixed in stage |
| --- | --- | ---: | --- | --- | --- |
| B1 | `Invalid Decision ID for unlock_decision_tooltip` | 557 | `... CZE_a_divided_nation_sudentenland_germans_cooperate` | Vanilla effects (national focuses, ideas, scripted effects, characters) name vanilla decisions. `common/decisions` is already replaced, so those decisions no longer exist. | 1 |
| B2 | `Invalid Decision ID for targeted decision effect` | 145 | `BUL_purchase_military_vehicles` | same | 1 |
| B3 | `Invalid Decision ID for activate_mission` / `activate_mission_tooltip` | 107 | `SIA_war_fervor_coup` | same | 1 |
| B4 | `Invalid Decision ID for add_days_mission_timeout` | 46 | `JAP_kwantung_army_impatience` | same | 1 |
| B5 | `Invalid Decision ID for activate decision effect` | 21 | `women_in_the_workforce`, `form_commonwealth` | same | 1 |
| B6 | `Invalid decision in has_active_timed_decision` / `has_decision trigger` | 133 | `has_active_mission = TUR_etatism_crisis_2` | Vanilla triggers name removed decisions | 1 |
| B7 | `Trigger failed to validate: <file>:<line>` | 133 | `common/national_focus/spain.txt` (20), `common/scripted_triggers/PRC_scripted_triggers.txt` (16), `common/ideas/_economic.txt` (12), `common/ideas/_manpower.txt` (10) | The pair line of B6, giving the vanilla file. 27 files: 14 national focus, 5 scripted triggers, 4 ideas, 3 decision categories, 1 scripted effects, 1 characters | 1 |
| B8 | `<TAG> - is missing a history file` | 728 | `GER - is missing a history file.` | All 364 vanilla tags are still defined in `common/country_tags/00_countries.txt`. Each is logged twice, at load and at game start. ZIN's 739 `history/countries/<TAG> - inactive world.txt` files hold only a comment, and the engine skips a file with no content, so it treats them as missing. Stage 1 now removes the vanilla tags and deletes the inactive files (stage 1, step 2). | 1 |
| B9 | `Error loading flag ... KOM` / `Unsupported format` | 12 | `gfx/flags/KOM_democratic.tga` | Vanilla tag Komi still exists, and its vanilla flag file has a format the engine refuses. Gone with the vanilla tags. | 1 |
| B10 | `<theater>: region list contains invalid entries (max id = 275!)` | 11 | `barbarossa_north` | Vanilla `common/ai_faction_theaters` names vanilla strategic region ids above ZIN's 275 | 1 |
| B11 | `Entity referenced in equipment graphic database does not exist` / `Failed to find entity ... for attachment` | 6 | `GER_super_heavy_armor_entity` | Vanilla `gfx/interface/equipmentdesigner/graphic_db/00_tank_icons.txt` and a By Blood Alone vehicle entity name three entities that vanilla 1.19.3 never defines (also logged with no mod). Stage 1 defines them as clones of the nearest vanilla models (`gfx/entities/zin_vanilla_model_gaps.asset`, a bridge until stage 2). | 1 |
| B12 | `The game has loc key collisions` | 1 | see `text.log` | `localisation/replace/world_l_english.yml` redefines vanilla `STATE_<n>` and `VICTORY_POINTS_<n>` keys. The engine still reports these as duplicates in `text.log` (10 keys listed) and writes this one line. | 1 |
| B13 | `Ship in port is too far away from center` | 2 | `prov 819 stack 19` | ZIN naval base position (map data) | 1 (map owner) |
| | **Total** | **1,902** | | | |

The 876 lines of B1–B5 carry no file name. They come from the vanilla folders listed under B7 together with vanilla scripted effects and focus effects that the engine validates at load. They disappear when stage 1 replaces those folders. The classifier in section 4 rechecks this after the stage.

`baseline_errors.json` ([01_acceptance.md](../09_validation/01_acceptance.md)) records these categories with their text patterns, counts and the date. Later runs are compared with it category by category.

### 3. Dispositions

Counts are from the installed game, version 1.19.3, measured on 18 October 2026. "Tag refs" counts references to the 364 vanilla tags, outside comments. **Stage** refers to section 5. "Owner" is the spec that writes the ZIN replacement. This spec owns the stub and the check.

#### 3.1 Already replaced (descriptor today)

| Folder | ZIN content today | Remaining work |
| --- | --- | --- |
| `history/states` | 1,332 Erdae states | none |
| `history/countries` | 305 country histories plus 739 empty "inactive" files for inherited tags | Stage 1 deletes the inactive files with the vanilla tags (stage 1, step 2). |
| `history/units` | `<TAG>_world.txt` OOBs | Warfare replaces the vanilla units in them |
| `map/strategicregions`, `map/supplyareas` | Erdae regions | map specs |
| `common/bookmarks` | `world.txt` (dated 1936, to be fixed by the calendar spec) | [01_start_and_calendar.md](01_start_and_calendar.md) |
| `common/on_actions` | `world.txt` (empty block), `zin_startup.txt` | mechanic specs add `zin_*.txt` |
| `common/ai_areas`, `common/ai_strategy`, `common/ai_strategy_plans` | Erdae areas and plans | [06_historical_path_and_ai.md](../03_gameplay/06_historical_path_and_ai.md) |
| `common/decisions` | none yet: no definition, which breaks rule 3 | Stage 1 adds `zin_decisions_interim.txt` with one hidden ZIN decision (`zin_interim_noop`, `visible = { always = no }`). Mechanic specs replace it. |
| `events` | none yet | Stage 1 adds `zin_world.txt`, holding namespace `zin_world` and one hidden event, until [06_events](../06_events/) lands |

#### 3.2 Common: political and national content

| Folder | Files | Tag refs | Action | ZIN replacement | Stage | Owner |
| --- | ---: | ---: | --- | --- | ---: | --- |
| `common/national_focus` | 81 | 93,871 | replace | `zin_interim_default.txt`: one shared interim tree, `default = yes`, of six focuses ("The Long Peace": stability, trade, roads, temple gifts, muster rolls, the old leagues) built by the focus compiler. Later the 13 major, 71 regional and 11 shared trees replace it. Needs at least one tree, or the game crashes at `common/countries/cosmetic.txt`. | 1 | [05_focus_trees](../05_focus_trees/) |
| `common/continuous_focus` | 1 | 27 | replace | `zin_continuous.txt`: one palette with ZIN continuous focuses (re-themed generic ones: stability, war support, recruitment, works). Must not be empty. | 1 | [02_economy.md](../03_gameplay/02_economy.md) |
| `common/focus_inlay_windows` | 6 | 345 | replace | `zin_inlays.txt` with one inlay used by the Aenor tree. Until then the file holds one definition gated `visible = { always = no }`. | 1 | focus trees |
| `common/ideas` | 213 | 17,326 | replace | `00_zin_laws.txt` holds the economy, conscription and trade laws under the vanilla keys that history and the engine read, with ZIN names and modifiers, and no vanilla country conditions. Its name starts with `00_` so that it loads before tag-named files (wiki, *Idea modding*). `zin_peoples.txt` exists. `zin_hidden.txt` holds the character-slot ideas that law modifiers need. | 1 | economy, peoples |
| `common/idea_tags` | 1 | 0 | keep | Engine slot categories (`country`, `government`, `military_staff`, ...). Re-named through localisation only. | — | — |
| `common/characters` | 232 | 23,429 | replace | `zin_rulers.txt` exists. [02_characters.md](../02_lore/02_characters.md) adds court, generals and hidden figures. | 1 | characters |
| `common/country_leader` | 4 | 1,046 | replace | `00_zin_leader_traits.txt`: ZIN ruler traits (`zin_trait_ancient_king`, `zin_trait_memory_of_dardan` and the rest of the characters spec), shipped in stage 1 beside the vanilla files. The folder is replaced with the unit-leader trait overrides, because the kept `common/unit_leader/00_traits.txt` names the vanilla advisor traits (`specialist_advisor_trait = army_chief_offensive_1` and the rest; about 100 malformed-token lines in the first stage-1 Linux run). | 2 | characters |
| `common/unit_leader` | 13 | 135 | override 5 files, keep 8 | Never `replace_path`: it crashes at `map/rocketsites.txt` (wiki). Override `00_traits.txt`, `ETH_traits.txt`, `JAP_traits.txt`, `NSB_traits.txt` and `SWE_traits.txt` with ZIN files of the same names that hold ZIN commander traits and no vanilla tag or DLC country condition. Keep the eight `00_*_skills.txt` and `SIA_traits.txt` (engine skill tables, no tag refs). | 2 | warfare |
| `common/scientist_traits` | 1 | 0 | replace | `zin_scholar_traits.txt` (scholars and artificers) | 2 | warfare |
| `common/names` | 1 | 364 | replace | `zin_names.txt` exists (3,051 lines) and ships beside the vanilla file until then. The engine generates party leaders for every defined tag, so the folder is replaced together with the vanilla tags, in stage 1 (the first stage-1 Linux run, which kept the tags, logged 1,756 failed name generations). | 1 | peoples |
| `common/dynamic_modifiers` | 11 | 4,635 | replace | `zin_dynamic_modifiers.txt` (casus belli and mechanic modifiers of the diplomacy and mechanic specs). Until then, one placeholder modifier with no effect, `zin_interim_marker`. | 1 | diplomacy, mechanics |
| `common/modifiers` | 5 | 58 | override 3, keep 2 | Keep `00_static_modifiers.txt` and `01_event_modifiers.txt`: the engine applies static modifiers by name. Override `AAT_`, `BBA_` and `MUN_power_balance_modifiers.txt` with files of the same names that hold one unused ZIN modifier each. Stage 2 empties them of meaning together with `common/bop`. | 2 | diplomacy |
| `common/bop` | 10 | 707 | replace | `zin_bop.txt`, for balance-of-power mechanics the mechanic specs choose (for example the Golden Court's camps). Until then, one balance gated to no country. | 2 | mechanics |
| `common/opinion_modifiers` | 13 | 553 | replace | `00_zin_opinion_modifiers.txt`: the generic modifiers the engine and diplomacy need, re-themed, plus `zin_opinion_*` from the contract (for example `zin_opinion_caravan_rivalry`) | 1 | diplomacy |
| `common/autonomous_states` | 21 | 151 | replace | `zin_autonomy.txt`: `autonomy_puppet` (renamed Vassal) plus the three ZIN autonomy states, including `zin_autonomy_eastern_client` | 2 | [03_diplomacy_and_factions.md](../03_gameplay/03_diplomacy_and_factions.md) |
| `common/occupation_laws` | 1 | 110 | override | `occupation_laws.txt`: ZIN occupation laws (re-themed, no tag conditions) | 2 | diplomacy |
| `common/resistance_activity` | 1 | 0 | keep | Engine resistance actions, generic | — | — |
| `common/resistance_compliance_modifiers` | 2 | 3 | override 1 | `resistance_modifiers.txt` without vanilla tag conditions. Keep `compliance_modifiers.txt`. | 2 | diplomacy |
| `common/scripted_effects` | 52 | 17,949 | replace | `zin_<system>.txt` per system from the contract. `00_zin_engine.txt` holds every effect that a kept vanilla file still calls (found by check C3). | 1 | all systems |
| `common/scripted_triggers` | 54 | 13,630 | replace | `zin_<system>.txt` per system. `00_zin_engine_hooks.txt` holds the triggers the engine calls by name: `should_initiate_resistance`, `should_activate_active_crypto_bonuses`, `should_not_activate_active_crypto_bonuses`, `is_diplomatic_action_valid_stage_coup` and `is_diplomatic_action_valid_boost_party_popularity`, with ZIN bodies. It also holds any trigger a kept vanilla file calls (check C3). | 1 | all systems |
| `common/scripted_localisation` | 42 | 287,207 | replace | `zin_realm.txt` exists. The interface and mechanic specs add more. | 1 | interface |
| `common/scripted_guis` | 17 | 57 | replace | `zin_realm.txt` exists. The vanilla `.gui` files of removed scripted GUIs stay in `interface/` and are never opened (section 3.7). | 1 | interface |
| `common/scripted_diplomatic_actions` | 1 | 0 | keep | Generic engine actions; no vanilla references | — | — |
| `common/script_constants` | 4 | 136 | replace | `zin_constants.txt`: the `state_groups` and `country_groups` the ZIN mechanics need. The vanilla files name vanilla state ids, which mean other states in ZIN, and vanilla tags. `special_project_constants.txt` goes with special projects in stage 2. | 1 | mechanics |
| `common/collections` | 2 | 32 | replace | `zin_regions.txt` (`zin_region_<key>`, diplomacy spec) and `zin_generic_collections.txt` | 1 | diplomacy |
| `common/mtth` | 1 | 1 | replace | `zin_mtth.txt` (story mean times, [06_historical_path_and_ai.md](../03_gameplay/06_historical_path_and_ai.md)) | 1 | historical path |
| `common/timed_activities` | 1 | 0 | replace | `zin_timed_activities.txt`: the coup activity with ZIN equipment needs | 2 | diplomacy, warfare |
| `common/synchronized_dynamic_tokens` | 1 | 19 | replace | `zin_tokens.txt`: ZIN equipment and unit tokens | 2 | warfare |
| `common/difficulty_settings` | 1 | 11 | override | `00_difficulty.txt`: custom difficulty entries for the great powers, by name resolved to tags (Aenor, Lerendor, Volgan, Zol, the Worshipdom, Coldor, Noris, Stabilo, Goldoroth) | 3 | foundation |
| `common/game_rules` | 1 | 175 | override | `00_game_rules.txt`: the 16 generic rules (`allow_wargoals` … `allow_scorched_earth`) and the three peace score rules, re-themed in text. The 70 vanilla country rules are dropped. ZIN rules stay in `zin_game_rules.txt` ([05_defines_and_rules.md](05_defines_and_rules.md) §3). | 1 | foundation |
| `common/achievements.txt` | 1 | 1,160 | override | ZIN has no Steam achievements. Same-name file with one ZIN ribbon-free achievement that can never be earned (`possible = { always = no }`). Mod achievements, if the owner wants them, go in `common/achievements/` (wiki, *Achievement modding*). | 3 | foundation |
| `common/ribbons`, `common/unit_medals` | 1, 1 | 2, 66 | override | `00_ribbons.txt`, `00_default.txt`: ZIN entries with no vanilla tag | 3 | warfare |
| `common/medals`, `common/aces` | 1, 1 | 0, 0 | keep | Generic engine data. Re-themed through localisation (aces become dragon-rider renown if dragons use the air layer, S6). | — | warfare |
| `common/profile_backgrounds`, `common/profile_pictures` | 1, 1 | 18, 67 | override | ZIN career-profile entries for the great powers, with art from the art pipeline | 3 | art |
| `common/frontend/backgrounds` | 1 | 0 | replace | `zin_backgrounds.txt` ([01_interface.md](../07_interface/01_interface.md) §13) | 4 | interface |

#### 3.3 Common: military, technology and intelligence

All replacements in this group belong to [01_warfare.md](../03_gameplay/01_warfare.md) §15 unless noted. They land together in stage 2, because each folder names the others.

| Folder | Files | Tag refs | Action | ZIN replacement |
| --- | ---: | ---: | --- | --- |
| `common/units` | 45 | 10 | replace | ZIN sub-units. Every equipment needs a sub-unit, or the AI crashes (wiki). |
| `common/units/equipment`, `/modules`, `/upgrades` | 45, 3, 3 | 52 | replace | ZIN equipment archetypes and modules. Keep the keys `convoy`, `train_equipment` and `motorized_equipment` defined in ZIN files. |
| `common/units/critical_parts`, `common/units/unit_modifiers` | 1, 1 | 0 | keep | Engine parts and modifiers, re-localised (warfare §15.3) |
| `common/units/names`, `/names_divisions`, `/names_ships`, `/names_railway_guns` | 8, 100, 65, 11 | 5,197 | replace | Erdae host and ship names per people. Railway gun names get one ZIN file with an empty generic list. |
| `common/units/codenames_operatives` | 14 | 60 | replace | `zin_operative_codenames.txt` (agents of courts) — diplomacy |
| `common/technologies`, `common/technology_tags` | 13, 1 | 678 | replace | ZIN tree, folders and categories |
| `common/technology_sharing` | 11 | 400 | replace | `zin_tech_sharing.txt`: groups for the ZIN leagues (diplomacy) |
| `common/doctrines/folders`, `/grand_doctrines`, `/tracks`, `/subdoctrines/land`, `/sea`, `/air`, `/special_forces` | 2, 5, 5, 4, 4, 4, 1 | 142 | replace | ZIN doctrines. The special forces subfolder gets one hidden ZIN subdoctrine, so that it is not empty. |
| `common/unit_tags` | 1 | 0 | replace | Vanilla categories plus the ZIN categories (warfare §15.1) |
| `common/equipment_groups` | 1 | 0 | replace | ZIN groups for workshop organisations |
| `common/military_industrial_organization/organizations` | 55 | 4,771 | replace | `zin_workshops.txt`: the economy spec's Erdae workshops, or one generic workshop per equipment group |
| `common/military_industrial_organization/policies`, `/ai_bonus_weights` | 4, 1 | 3 | replace | `zin_workshop_policies.txt`, `zin_ai_bonus_weights.txt` |
| `common/special_projects/projects`, `/project_tags`, `/prototype_rewards`, `/specialization` | 6, 1, 5, 1 | 37 | replace | `zin_great_works.txt`: one project per tag (for example the wall works, warded hulls). An empty set crashes or errors, so one hidden project stays until the economy spec fills the folder. |
| `common/raids`, `common/raids/categories` | 8, 1 | 378 | replace | No air, nuclear or paratrooper raids. `zin_raids.txt` holds land infiltration raids re-themed as night raids, and one category file. |
| `common/abilities` | 6 | 26 | replace | `zin_abilities.txt`: generic commander abilities, re-themed. This supersedes the "keep" of warfare §15.3, because five of the six vanilla files are tag-specific. |
| `common/combat_tactics.txt` | 1 | 6 | override | Same file name. Vanilla content minus the three `JAP` and `SOV` tactics, generated by the warfare module (rule 5) |
| `common/ai_templates`, `common/ai_equipment`, `common/ai_navy/fleet`, `/goals`, `/taskforce` | 15, 22, 8, 8, 8 | 1,395 | replace | ZIN AI templates for every ZIN template role. A missing template crashes the AI (wiki). |
| `common/ai_focuses` | 8 | 0 | replace | `zin_ai_focuses.txt` ([06_historical_path_and_ai.md](../03_gameplay/06_historical_path_and_ai.md)) — stage 1 with the focus folder |
| `common/ai_faction_theaters` | 1 | 108 | replace | `zin_theaters.txt`: one theater per Erdae region, built from the 275 strategic regions. This fixes B10. Stage 1. |
| `common/operations`, `common/operation_phases` | 6, 16 | 163 | replace | `zin_operations.txt`, `zin_operation_phases.txt`: the court intrigue operations of the diplomacy and Afrit specs. Stage 2. |
| `common/operation_tokens` | 1 | 0 | keep | Generic engine tokens |
| `common/intelligence_agencies` | 1 | 136 | replace | `zin_agencies.txt`: the agency names and emblems of Erdae courts (art pipeline). Stage 2. |
| `common/intelligence_agency_upgrades` | 1 | 1 | override | Same file name, with the one vanilla tag condition removed (rule 5). Stage 2. |
| `common/scorers/country` | 4 | 34 | override | Same four file names, ZIN targets with no vanilla tag weights. Stage 2. |
| `common/factions/goals`, `/rules`, `/rules/groups`, `/templates`, `/upgrades`, `/upgrades/groups`, `/member_upgrades`, `/member_upgrades/member_groups`, `/icons` | 4, 9, 1, 10, 1, 1, 1, 1, 1 | 605 | replace | The ZIN leagues (Middle Kingdom Concord and the others), goals and the `zin_faction_rule_*` rules, keeping the vanilla rule keys the diplomacy spec reuses. Stage 2. |
| `common/peace_conference/ai_peace`, `/categories`, `/cost_modifiers` | 15, 1, 18 | 794 | replace | `zin_ai_peace.txt`, `zin_peace_categories.txt` (keeps the vanilla category keys, re-themed), `zin_peace_costs.txt`. Stage 2. |

#### 3.4 Common: countries and engine data

| Folder or file | Files | Tag refs | Action | Why or ZIN replacement | Stage |
| --- | ---: | ---: | --- | --- | ---: |
| `common/country_tags` | 2 | 367 | replace | `00_zin_countries.txt` (the 305 tags) and `zz_zin_dynamic_countries.txt` (`dynamic_tags = yes`, then D01–D50, the same count as vanilla). With too few dynamic tags the game crashes in `savegame.hoi4` or `map/cities.txt` (wiki). Today's `zz_world_countries.txt` becomes `00_zin_countries.txt`. The dynamic list keeps vanilla's 75 tags (D01–D75): 305 + 75 = 380 tags, fewer than vanilla's 439. Pulled forward to stage 1 (step 2). | 1 |
| `common/country_tag_aliases` | 1 | 37 | override | `tag_aliases.txt` with the aliases the Aenor succession needs, or one alias with an impossible trigger | 3 |
| `common/countries/colors.txt` | 1 | — | override (exists) | ZIN colours | — |
| `common/countries/cosmetic.txt` | 1 | 537 | override | ZIN cosmetic tags (Aenor breakaways, Host of Eindil) | 3 |
| `common/countries/<country>.txt` (440) | 440 | 0 | keep | Loaded only through the paths in `country_tags`. After stage 3 nothing points at them. | — |
| `common/defines` | 3 | 32 | keep, add | Never override `00_defines.lua`. Add `zin_defines.lua` ([05_defines_and_rules.md](05_defines_and_rules.md)). Stage 1 sets `NGame.HANDS_OFF_START_TAG` to the tag of **Verde** (proposed), because `HAI` no longer exists. | 1 |
| `common/ideologies` | 1 | 0 | override (exists) | `00_ideologies.txt` | — |
| `common/buildings/00_buildings.txt` | 1 | 0 | keep | Engine building types; economy spec re-themes the names | — |
| `common/buildings/01_landmark_buildings.txt` | 1 | 28 | override | Same name. ZIN landmarks of the key sites (for example the Golden Court, the Great Wall), or none: one landmark with `enable_for_controllers = { }` and no state | 2 |
| `common/resources` | 2 | 0 | override | `00_resources.txt`: Iron, Timber, Horses, Stone, Gold, Essence and Grain (V2) | 2 |
| `common/state_category`, `common/terrain`, `common/wargoals` | 13, 1, 1 | 0 | keep | Engine data with no vanilla references. The economy spec re-themes their names. | — |
| `common/modifier_definitions` | 2 | 0 | keep | Script modifiers that kept files may use; ZIN adds `zin_modifier_definitions.txt` | — |
| `common/strategic_locations` | 1 | 0 | keep | Generic location bonuses | — |
| `common/map_modes` | 1 (doc) | 0 | keep | Documentation only; ZIN adds `zin_footholds.txt` | — |
| `common/generation` | 1 | 0 | keep | Engine generation table | — |
| `common/acclimatation.txt`, `ai_attitudes.txt`, `ai_personalities.txt`, `alerts.txt`, `event_modifiers.txt`, `region_colors.txt`, `triggered_modifiers.txt`, `weather.txt` | 8 | 0 | keep | Engine-wide data with no vanilla tags, decisions or equipment | — |
| `common/script_enums.txt` | 1 | 0 | override | Vanilla content plus ZIN equipment archetypes (warfare §15.2) | 2 |
| `common/graphicalculturetype.txt` | 1 | 0 | override (exists) | Vanilla list plus ZIN cultures | — |
| `common/msgrdk_achievements.json` | 1 | 0 | keep | Microsoft Store achievement table. The Steam build does not use it. | — |

#### 3.5 History, events, localisation

| Folder | Files | Action | ZIN content | Stage |
| --- | ---: | --- | --- | ---: |
| `history/general` | 4 | replace | `zin_general.txt`: generic councillors of ZIN courts by people (the characters spec), replacing `generic_advisors.txt`. The vanilla file gives modern advisors to every ZIN country today. | 1 |
| `history/countries`, `history/states`, `history/units` | 364, 1,081, 609 | replaced | see 3.1 | — |
| `events` | 128 | replaced | `zin_*.txt` per namespace | — |
| `localisation/<language>/` | 207 English files | keep | Engine and interface text. Unused vanilla keys log nothing. | — |
| `localisation/english/state_names_l_english.yml`, `victory_points_l_english.yml` | 2 | override | ZIN state and victory point names move from `localisation/replace/world_l_english.yml` into same-name files that hold only ZIN keys. This fixes B12 without the `replace` folder. | 1 |
| Vanilla UI text that ZIN re-themes (month names, `WORLD_TENSION_NAME`, music player, menus) | — | override by file | A vanilla localisation file is overridden whole only when ZIN supplies its own text for **every** key in it, or the key belongs to a definition ZIN has removed (for example the titles of removed vanilla songs). The builder reads the key list from the installed file, and ZIN text comes from `docs/design/text/ui/<file>.json`. No vanilla text is copied. Until a file's text is complete, its few keys go in `localisation/english/replace/`, and the B12 collision line is allowed for that stage only (section 6). | 1–4 |

#### 3.6 Engine hooks that must survive replacement

| Hook | Lives in | ZIN action |
| --- | --- | --- |
| `should_initiate_resistance`, `should_activate_active_crypto_bonuses`, `should_not_activate_active_crypto_bonuses` | vanilla `common/scripted_triggers/00_resistance_initiate_triggers.txt` | ZIN bodies in `00_zin_engine_hooks.txt` |
| `is_diplomatic_action_valid_<token>` (two exist) | vanilla `00_diplo_action_valid_triggers.txt` | ZIN bodies, with the same DLC gating |
| Law idea keys read by history and the engine | vanilla `common/ideas/_economic.txt`, `_manpower.txt` | `00_zin_laws.txt` (3.2) |
| Static modifiers by name | `common/modifiers/00_static_modifiers.txt` | kept |
| Peace action category keys | `common/peace_conference/categories` | ZIN file keeps the keys |
| Unit leader skill tables | `common/unit_leader/00_*_skills.txt` | kept |
| `on_actions` the engine fires (`on_startup` and the rest) | `common/on_actions` | ZIN files ([01_acceptance.md](../09_validation/01_acceptance.md) lists the ones in use) |

Check C3 finds any further hook. A trigger or effect named by a kept vanilla file and defined only in a replaced folder fails the build, until ZIN defines it.

#### 3.7 Interface, gfx and other vanilla files

| Path | Action | Why or ZIN content | Stage |
| --- | --- | --- | ---: |
| `interface/*.gui`, `*.gfx` (292 entries) | keep | Engine windows and sprites. No `replace_path`: every engine window needs its definition. ZIN re-themes through its own `zin_*.gfx`, `zin_*.gui` and the overrides the interface spec names. The interface spec avoids overriding `topbar.gui`. | — |
| Vanilla scripted-GUI windows (`AST_cabinet_trust_scripted_gui.gui`, `GER_inner_circle_scripted_gui.gui` and 16 more) | keep | Never shown once `common/scripted_guis` is replaced. They log nothing. | — |
| `interface/credits.txt` | keep | Paradox's own credits. ZIN credits, including audio attribution, are in the Chronicle codex and `docs/credits/` ([04_music_and_sound.md](../08_art_and_assets/04_music_and_sound.md)). | — |
| `gfx/loadingscreens` | replace (stage 1, with the presentation module) | ZIN loading screens and every file that kept sprites name in that folder: `load_1`–`load_9` and their `_small` versions, `load_5.dds` (`GFX_frontend_bg`) and `loading_screen_border_small.dds` ([08_art_and_assets](../08_art_and_assets/) loading screens spec). DLC `.gfx` files name 13 more `_small` files (`load_lar_small.dds`, `load_nsb2_small.dds`, ...). The Linux run checks whether they log missing textures. If they do, ZIN ships generated thumbnails under those names. | 4 |
| `gfx/interface/equipmentdesigner/graphic_db` | replace | ZIN equipment graphic database for ZIN chassis and hulls. Fixes B11. | 2 |
| `gfx/entities` | keep | Buildings and map items need it. The vanilla vehicle entity in B11 is overridden by name once `hoi4.source_lookup` locates it, or it stops loading with the vanilla equipment. | 2 |
| `gfx/flags` | keep | Flags load per tag. After stage 3 no vanilla tag remains, so no vanilla flag is read. | — |
| `portraits/00_portraits.txt` | override | Same name. ZIN portrait sets by graphical culture, with no vanilla tag blocks (39 today) ([02_characters.md](../02_lore/02_characters.md)) | 2 |
| `country_metadata/00_country_metadata.txt` | override | `default` plus the great powers, with ZIN career-profile backgrounds | 3 |
| `tutorial/tutorial.txt` | override | `tutorial = { }`. The vanilla tutorial names vanilla state 550 (Eritrea), which is a different state in ZIN. An invalid tutorial file is a known crash at country selection (wiki). | 1 |
| `music/`, `sound/` | see [04_music_and_sound.md](../08_art_and_assets/04_music_and_sound.md) | | 4 |
| `map/` | map specs | | — |
| `dlc/*` | none | DLC files load at the same paths as base files, so the actions above cover them (wiki: edit `dlc/.../music/x.txt` as `music/x.txt`) | — |

### 4. Checks

| Id | Check | Runs in | Fails when |
| --- | --- | --- | --- |
| C1 | **Disposition coverage** | builder, G1 | A folder or top-level file under the installed `common`, `events`, `history`, `interface`, `localisation`, `portraits`, `country_metadata`, `tutorial` or `gfx/loadingscreens` has no row in `docs/design/vanilla/dispositions.json`. A new game version that adds a folder fails here. |
| C2 | **Descriptor integrity** | builder, G1 | `descriptor.mod` and `zin.mod` differ in `replace_path`; a replaced folder has no ZIN file with a definition; a `replace_path` names a folder that the dispositions file does not mark as replace |
| C3 | **Loaded-vanilla references** | builder, G3 (`hoi4.source_lookup`, `hoi4.mod_index`) | Any file that stays loaded (kept vanilla, overridden, ZIN) names a decision, idea, technology, equipment, sub-unit, scripted trigger, scripted effect, character, event, opinion modifier, dynamic modifier or (after stage 3) country tag that no loaded file defines |
| C4 | **Stub hygiene** | builder | An interim stub (`zin_interim_*`) can become visible, available or fire; a stub is still present after its owner spec has shipped real content |
| C5 | **No vanilla text** | builder | A ZIN localisation file contains a value byte-identical to a vanilla value of the same key, except keys the dispositions file allowlists. The allowlist holds proper nouns only, and there are none yet. |
| C6 | **Error budget** | after G4 | `tools/content/checks/error_budget.mjs` reads the Linux run's `error.log` through `hoi4.error_log` (scope `mod` and `all`), classifies every line with `baseline_errors.json` patterns, and fails above the stage budget (section 6) or on any line outside the allowlist from stage 3 on |
| C7 | **text.log** | after G4 | `text.log` lists any duplicate key from stage 1 on, except keys in a declared `replace` file for that stage |

### 5. Order of removal

Each stage is one build, one Linux run (L1 for the eight start cases, R1–R3, L8) and one commit. The stage passes when its budget holds and nothing crashes. If a stage crashes, it is bisected by folder: revert half the new `replace_path` lines and rerun.

**Stage 1: stop the leftovers (phase 1).** This stage does not depend on gameplay specs. It uses stubs.

1. Write `dispositions.json`, `baseline_errors.json` and the C1–C7 checks with negative tests (a planted dangling decision reference, an empty replaced folder, a descriptor mismatch).
2. **Remove the vanilla tags (pulled forward from stage 3, 19 October 2026).** Replace `common/country_tags` with ZIN's 305 tags in `00_zin_countries.txt`, loaded first, and vanilla's 75 dynamic tags in `zz_zin_dynamic_countries.txt`; replace `common/names`; delete the 739 inactive history files; set `HANDS_OFF_START_TAG`. This clears B8 and B9.
   - **Why it cannot wait: the flag-sheet crash.** Every Windows crash since 18 October (`EXCEPTION_INT_DIVIDE_BY_ZERO` at `hoi4.exe+0x1240ab6`, Aenor start, menu and running game alike) is the engine placing a country's flag in its flag texture sheet by tag index. The disassembly divides the index (less one) by the per-page capacity, then the remainder by the column count of that page, read from a per-page array. In all three minidumps the page index is 1 and that column count is 0. With 364 vanilla and 75 dynamic tags ahead of them, ZIN's tags had indices 440–744, so loading a high-index ZIN flag crashed. Vanilla's 439 tags fit the first page; 380 do too. Which flags load, and when, depends on timing, which is why the crash looked random and why earlier fixes (the 30,000 manpower floor) seemed to help.
   - **Linux evidence, 19 October 2026 (isolated runs, start as Aenor).** Every change to these files made the start unstable: bodies without a capital (`set_research_slots = 3`), capital-only bodies, politics bodies, and deleting the 300 comment-only duplicates of ZIN tags. Together they crashed 6 of 12 starts (SIGSEGV just after the game view opens). Every start that left the files alone ran: the live mod twice, and the stage-1 overlay without these changes in every run. B8 lines cleared whenever a body was present, so the B8 fix itself works. **Read again after the flag-sheet finding:** these changes moved which flags load first, and the crashes were the flag sheet, not the files. None of those runs unpaused the clock.
   - 300 of the 739 files belong to tags that are ZIN countries and sit beside their real history files. The other 75 belong to the dynamic tags D01–D75, which the engine never asks for history.
3. Add `replace_path` for `common/decisions/categories`, `common/national_focus`, `common/continuous_focus`, `common/focus_inlay_windows`, `common/ai_focuses`, `common/ideas`, `common/characters`, `common/scripted_effects`, `common/scripted_triggers`, `common/scripted_localisation`, `common/scripted_guis`, `common/dynamic_modifiers`, `common/opinion_modifiers`, `common/script_constants`, `common/collections`, `common/mtth`, `common/ai_faction_theaters` and `history/general`. Ship the ZIN files and stubs of section 3, and the overrides of `common/game_rules/00_game_rules.txt`, `tutorial/tutorial.txt`, `common/achievements.txt` (pulled forward from stage 3: it names 51 vanilla focuses and 28 vanilla characters) and the state, victory point and strategic region name files. Add the interim decision and event stubs (3.1), and interim stubs in `common/ai_strategy` and `common/ai_strategy_plans`, which were replaced before stage 1 and held no definition.
   - **Narrowed after the first Linux run (19 October 2026).** `common/names` moved to stage 3 (the engine generates party leaders for every defined tag, and without the vanilla name lists it logged 1,756 failed name generations); it came back to stage 1 with the vanilla tags (step 2). `common/country_leader` moves to stage 2: the kept `common/unit_leader/00_traits.txt` names the vanilla advisor traits. ZIN ships `zin_names.txt` and `00_zin_leader_traits.txt` beside the vanilla files until then.
   - **Pulled forward from stage 4 (19 October 2026):** `gfx/loadingscreens` and `common/frontend/backgrounds`, because the presentation module (`tools/content/modules/presentation.mjs`) ships the 24 loading screens, the three main-menu backgrounds and the background list. Their thumbnails live in `gfx/interface/zin/loadingscreens`.
   - Every focus icon needs a `<icon>_shine` sprite, and the folder needs one title-bar style (`00_zin_titlebar_styles.txt`), or the engine logs one line per focus.
4. Run C3 on the result. Folders kept until stage 2 (technologies, organisations, operations, factions, peace conference, `bop`) and the DLC song lists (`music/*.txt`, kept until stage 4) still name definitions that stage 1 removes: scripted triggers and effects, and also national focuses, ideas, characters (as values and as scope keys, for example `PHI_vicente_lava = { }` in the workshop files), dynamic modifiers, decision categories, events, collections, script constants, AI theaters and one opinion modifier. C3 lists each one, and the builder resolves each in one of two ways:
   - **Bridge.** Define the same name in a ZIN file with an inert body: `always = no` for triggers, an empty body for effects, never-allowed ideas and decision categories, never-available shared focuses, never-enabled dynamic modifiers, hidden triggered-only events, empty collections and constant entries, characters with no role. Triggers and effects go in `00_zin_engine_hooks.txt` and `00_zin_engine.txt`, the rest in `zz_zin_bridge_*.txt` files. Bridges carry identifiers only (the special-project constant groups also keep their numbers, because the engine reads them). Mark each `# bridge: remove in stage N`, where N is the stage that removes the last kept file using it. C4 fails a build whose bridges are due.
   - **Pull forward.** Move that folder's replacement into stage 1.

   A name used by a vanilla file that is never removed is not a bridge but a permanent ZIN definition, like the engine hooks (3.6): `clear_sabotaged_resources_if_necesary` and `sabotaged_resources` (called by `common/resistance_activity`), `is_available_to_collaboration_government` and the event `occupied_countries.1` (called by `compliance_modifiers.txt`; the event does nothing until the diplomacy spec gives it a choice), the idea `received_attache` and the 29 opinion modifiers the engine applies by name.
5. The map owner fixes the naval base position of province 819 (B13).

**Stage 2: military and economy (phase 3, with warfare, economy and diplomacy).** Replace or override every row of 3.3, `common/bop`, the three power-balance modifier files, `common/autonomous_states`, `common/occupation_laws`, `resistance_modifiers.txt`, `common/timed_activities`, `common/synchronized_dynamic_tokens`, `common/scientist_traits`, the five unit leader trait files, `common/resources`, `01_landmark_buildings.txt`, `common/script_enums.txt`, `portraits/00_portraits.txt` and `gfx/interface/equipmentdesigner/graphic_db`. This is warfare §15.6's order. The equipment, technology, unit, AI template and doctrine folders land in one build, because each names the others.

**Stage 3: remove the vanilla tags (end of phase 3).** Precondition: C3 with tag checking switched on reports zero references to vanilla tags in loaded files. The tag list, the name lists, the inactive files and `HANDS_OFF_START_TAG` moved to stage 1 (step 2). Stage 3 overrides `cosmetic.txt`, `tag_aliases.txt`, `00_difficulty.txt`, `achievements.txt`, `00_ribbons.txt`, `unit_medals/00_default.txt`, the profile files and `00_country_metadata.txt`.

**Stage 4: presentation (phase 7).** `gfx/loadingscreens`, `common/frontend/backgrounds`, the music and sound replacements of [04_music_and_sound.md](../08_art_and_assets/04_music_and_sound.md), and every whole-file localisation override whose ZIN text is complete. After this stage nothing remains in `localisation/english/replace/` unless the allowlist names it.

**The descriptor at the end** (both files):

```
replace_path="history/states"
replace_path="history/countries"
replace_path="history/units"
replace_path="history/general"
replace_path="map/strategicregions"
replace_path="map/supplyareas"
replace_path="events"
replace_path="common/bookmarks"
replace_path="common/on_actions"
replace_path="common/ai_areas"
replace_path="common/ai_strategy"
replace_path="common/ai_strategy_plans"
replace_path="common/ai_focuses"
replace_path="common/ai_faction_theaters"
replace_path="common/ai_templates"
replace_path="common/ai_equipment"
replace_path="common/ai_navy/fleet"
replace_path="common/ai_navy/goals"
replace_path="common/ai_navy/taskforce"
replace_path="common/decisions"
replace_path="common/decisions/categories"
replace_path="common/national_focus"
replace_path="common/continuous_focus"
replace_path="common/focus_inlay_windows"
replace_path="common/ideas"
replace_path="common/characters"
replace_path="common/country_leader"
replace_path="common/scientist_traits"
replace_path="common/names"
replace_path="common/country_tags"
replace_path="common/dynamic_modifiers"
replace_path="common/bop"
replace_path="common/opinion_modifiers"
replace_path="common/autonomous_states"
replace_path="common/scripted_effects"
replace_path="common/scripted_triggers"
replace_path="common/scripted_localisation"
replace_path="common/scripted_guis"
replace_path="common/script_constants"
replace_path="common/collections"
replace_path="common/mtth"
replace_path="common/timed_activities"
replace_path="common/synchronized_dynamic_tokens"
replace_path="common/units"
replace_path="common/units/equipment"
replace_path="common/units/equipment/modules"
replace_path="common/units/equipment/upgrades"
replace_path="common/units/names"
replace_path="common/units/names_divisions"
replace_path="common/units/names_ships"
replace_path="common/units/names_railway_guns"
replace_path="common/units/codenames_operatives"
replace_path="common/unit_tags"
replace_path="common/equipment_groups"
replace_path="common/technologies"
replace_path="common/technology_tags"
replace_path="common/technology_sharing"
replace_path="common/doctrines/folders"
replace_path="common/doctrines/grand_doctrines"
replace_path="common/doctrines/tracks"
replace_path="common/doctrines/subdoctrines/land"
replace_path="common/doctrines/subdoctrines/sea"
replace_path="common/doctrines/subdoctrines/air"
replace_path="common/doctrines/subdoctrines/special_forces"
replace_path="common/military_industrial_organization/organizations"
replace_path="common/military_industrial_organization/policies"
replace_path="common/military_industrial_organization/ai_bonus_weights"
replace_path="common/special_projects/projects"
replace_path="common/special_projects/project_tags"
replace_path="common/special_projects/prototype_rewards"
replace_path="common/special_projects/specialization"
replace_path="common/raids"
replace_path="common/raids/categories"
replace_path="common/abilities"
replace_path="common/operations"
replace_path="common/operation_phases"
replace_path="common/intelligence_agencies"
replace_path="common/factions/goals"
replace_path="common/factions/icons"
replace_path="common/factions/member_upgrades"
replace_path="common/factions/member_upgrades/member_groups"
replace_path="common/factions/rules"
replace_path="common/factions/rules/groups"
replace_path="common/factions/templates"
replace_path="common/factions/upgrades"
replace_path="common/factions/upgrades/groups"
replace_path="common/peace_conference/ai_peace"
replace_path="common/peace_conference/categories"
replace_path="common/peace_conference/cost_modifiers"
replace_path="common/frontend/backgrounds"
replace_path="gfx/loadingscreens"
replace_path="gfx/interface/equipmentdesigner/graphic_db"
replace_path="music"
replace_path="music/hoi2"
replace_path="music/hoi3"
```

That is 95 lines. The three music lines are owned by the music spec.

### 6. Error budget

A line counts against ZIN when it names a ZIN file or identifier, or comes from a vanilla file the mod leaves loaded (rule 6). The budget covers every log line of the run: main menu load, country selection, play and save/load.

| After stage | Budget (lines, Linux acceptance run) | Allowed categories |
| --- | ---: | --- |
| Baseline | 1,902 | B1–B13 |
| 1 | **≤ 20** | B11 (vanilla equipment entities, until their clones are confirmed) and up to 2 lines of B12 if a `replace` file is still needed. Nothing else, and no new category. B8 and B9 left with the vanilla tags (stage 1, step 2). **B14** (vanilla tags named by the generic vanilla files that stay loaded: technologies, faction goals and rules, generic naval goals and organizations, occupation laws, leader traits, scorers; 638 lines in the applied build on 19 October) is exempt up to 650 lines and may not grow. The single-country vanilla files are silenced (`tools/content/data/vanilla/silenced.json`: comment-only ZIN files of the same names, 349 files). |
| 2 | **≤ 13** | B12 |
| 3 | **≤ 1** | B12 only, while a `replace` file remains |
| 4 and every later build | **0** | Allowlist only |

**The allowlist** (`docs/design/validation/error_allowlist.json`, new) holds lines that no mod file can affect. It starts empty. A line may join it only when all three of these hold:

1. It also appears, with the same text pattern, in a Linux control run of the same game version with no mod enabled.
2. Its source is not a file the mod can override or replace (engine code, a DLC archive, the graphics driver, the Linux platform layer).
3. The entry records the text pattern, the reason, the control run's date and game version, and the date it was added.

[01_acceptance.md](../09_validation/01_acceptance.md) lists the entries, as [PROGRAM.md](../PROGRAM.md) requires. A line that also appears without the mod but comes from a file ZIN could override (for example a broken vanilla flag of a tag ZIN still defines) is not allowlisted. It is fixed.

**First entry (19 October 2026).** `Could not find DLC '<name>' in store backend.` (`dlc.cpp`, 3 lines: Anniversary Pack, Poland: United and Ready, Rocket Launcher Unit Pack). The Linux store layer writes these lines while it registers DLC, before any mod loads. They appear in the Linux control run with no mod enabled (game 1.19.3, main menu), and the Windows baseline does not have them. B11 also appears in that control run, but it comes from vanilla files ZIN can override, so it stays in the stage budget, not on the allowlist.

**Runtime lines.** The budget applies to the 60-day start runs, the one-year runs and the observer runs to 4A 1760 and 4A 1800. Runtime lines from ZIN scripts (for example invalid event targets, scripted localisation that returns nothing, a variable on the wrong scope) count from stage 1 on and have no allowance.

## Implementation

| File | Content | Generator |
| --- | --- | --- |
| `docs/design/vanilla/dispositions.json` (new) | One row per vanilla folder or file: path, action, ZIN files, stage, owner spec, reason. Section 3 is generated from it. | data |
| `docs/design/validation/baseline_errors.json` (new) | B1–B13 with regex patterns, counts, source run and date | data |
| `docs/design/validation/error_allowlist.json` (new) | Empty at the start | data |
| `docs/design/text/ui/<vanilla file>.json` (new) | ZIN text for whole-file localisation overrides, one key per vanilla key | data |
| `tools/content/modules/vanilla_removal.mjs` (new) | Writes the `replace_path` lines into `descriptor.mod`, the stubs (`zin_interim_*`), the overrides of section 3 that no other spec owns (`tutorial.txt`, `00_game_rules.txt`, `achievements.txt`, `tag_aliases.txt`, `00_country_metadata.txt`, the inactive history bodies), and the engine hook file `00_zin_engine_hooks.txt` | builder |
| `tools/content/modules/localisation_overrides.mjs` (new) | Whole-file localisation overrides from the installed key lists and `docs/design/text/ui/` | builder |
| `tools/content/checks/vanilla_refs.mjs` (new) | C1, C2, C3, C4, C5. Reads the installed game read-only, never copies text out of it into the mod (except the identifier-only overrides of rule 5). Uses `hoi4.mod_index` and `hoi4.source_lookup` on the staged mod for C3. | builder test |
| `tools/content/checks/error_budget.mjs` (new) | C6, C7 | after G4 |
| `tools/content/sync/zin_mod_descriptor.mjs` (new) | Copies the `replace_path` lines into `mod/zin.mod` through the shared rewrite engine | sync step |

Everything is written through the shared atomic rewrite engine with the rest of the build. The installed game is read-only. The Windows game is never launched. Live evidence comes only from the isolated Linux run.

Interim stubs are named `zin_interim_<what>`. They have no effect, are never visible (`visible = { always = no }`, `allowed = { always = no }` or `potential = { always = no }`), and C4 removes them when the owning spec ships.

## AI

- The AI loses the vanilla AI strategy, focus and template files with stage 1 and stage 2. Until the historical-path spec ships its AI files, the stub folders give the AI nothing to choose. The start must still be peaceful: the acceptance run checks that no war starts in 60 days.
- `common/ai_faction_theaters` is rebuilt from ZIN strategic regions, so faction AI reads real theaters.
- The hands-off tag change in stage 3 affects only `-hands_off` runs. The Linux observer runs use the `observe` command.

## Acceptance

1. The baseline classifier, run on the 18 October 2026 log, yields exactly the counts of section 2 (total 1,902).
2. C1–C7 pass on every build. Each has a negative test: a planted folder with no disposition, a descriptor mismatch, an empty replaced folder, a dangling decision reference, a visible stub, a copied vanilla localisation value, and a log over budget.
3. After stage 1 the Linux run's `error.log` has at most 20 lines, all in B9, B11 or B12. The Aenor start (R1) and the eight L1 starts do not crash.
4. After stage 1 a ZIN country's focus tree is the ZIN interim tree, and its advisors are ZIN councillors, not vanilla generic advisors.
5. After stage 3 the country list has exactly the 305 ZIN tags plus the dynamic tags, and the log has no `missing a history file` line.
6. After stage 4, and on every later build, the log has zero lines outside the allowlist across the start runs, a one-year run and the observer runs. `text.log` lists no duplicate key.
7. In three cold Linux launches after stage 4, no vanilla loading screen, main menu background, music track or focus tree appears.
8. No step launches, automates or captures the Windows game. No vanilla text is copied into a ZIN file, except the identifier-only overrides of rule 5.

## Open questions

1. **Interim inactive tags.** Is filling the 739 inactive history files (stage 1) acceptable as a stopgap, or should stage 1 wait and remove the vanilla tags at once? Removing them at once needs stage 2's warfare work first. Proposed: the stopgap.
2. **Interim focus tree.** Is a six-focus interim tree "The Long Peace" acceptable until the shared trees land, or should ZIN countries show no tree at all? (An empty national focus folder crashes, so at least one tree must exist.)
3. **Hands-off tag.** Verde (proposed) has no story role. Does the owner prefer another country?
4. **Mod achievements.** ZIN ships no Steam achievements. Does the owner want ZIN's own career-profile achievements (`common/achievements/`), for example for each ending?
5. **Localisation `replace` folder.** The baseline shows that keys in `localisation/replace/` still count as collisions. If the Linux test confirms the same for `localisation/english/replace/`, ZIN text must cover whole vanilla files before any vanilla UI string is re-themed. Accept that this makes some re-theming wait for stage 4?
6. **Vanilla vehicle entity (B11).** If the missing entities come from DLC that is not installed here, the lines may differ between players. Proposed: the warfare stage overrides the referring files, so that the lines cannot come back whatever DLC a player owns.
