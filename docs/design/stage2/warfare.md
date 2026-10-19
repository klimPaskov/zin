# Stage 2 integration note: units, equipment, ships, dragons and the winged, unit names

Module `tools/content/modules/warfare.mjs`, data `tools/content/data/warfare_units.json`, `warfare_equipment.json`, `warfare_naval.json`, `warfare_names.json`, `warfare_text.json`, `warfare_models.json`, the id list `warfare_ids.json` (regenerate with `node tools/content/write_warfare_ids.mjs`), test `tools/content/warfare.test.mjs` (64 tests, in the `test` script). Specs: `docs/specs/03_gameplay/01_warfare.md` sections 3, 4, 6.3, 7, 8, 14, 15 and `09_naval_air_doctrines.md` sections 1, 2, 4.

## 1. The call to add to `build.mjs`

```js
import { buildWarfare } from './modules/warfare.mjs';
// after buildNames (it draws place names from the language generator, whose registry buildNames resets), before buildEconomy
// (script_enums.txt and the tokens file list the archetypes staged here) and before buildVanillaRemoval (the C3 scan must see these files)
const warfare = await buildWarfare(staged, { countries, pools });
```

`ctx` is `{ countries, pools? }`: the roster of `data/countries.json` and the `pools` Map that `buildNames` returns (the agents' code names are the callsigns of each country's pool; without it the module runs `buildNames` itself on a scratch set and resets the shared name registry, so pass it). Optional `raw` (a loaded copy of the data, for tests). After the call `ctx.model` holds the checked model and `ctx.model.ids` the ids. Returns the counts: 61 sub-units (55 land, 4 ships, 2 air), 33 archetypes (29 equipment lines and 4 hulls), 92 equipment types, 16 ship modules, 5 hull upgrades, 11 equipment groups, 50 combat tactics, 52 host groups, 205 ship groups, 1,272 host names, 3,060 ship names, 1,406 agent names, 65 dragon-flight lists, 575 text keys and 117 replaced keys. Calling it twice in one process needs a fresh `buildNames` first (the registry makes every name unique in the world, so the second run would draw other names).

The economy call can now drop `requiredEnumEntries()`: `equipmentKeys` should be `warfareIds.archetypes` plus the equipment types the institutions slice names (read `data/warfare_ids.json`, or the staged files under `common/units/equipment`, which the economy module already scans).

## 2. Disposition rows these files satisfy (update the `zin` lists; the current ones name placeholders)

| Row (path) | ZIN files |
| --- | --- |
| `common/units` | `zin_men.txt`, `zin_elves.txt`, `zin_sun_elves.txt`, `zin_orcs.txt`, `zin_kin.txt`, `zin_demons.txt`, `zin_dead.txt`, `zin_siege.txt`, `zin_camp.txt`, `zin_great_beings.txt`, `zin_ships.txt`, `zin_air.txt` (the institutions slice adds `zin_hq.txt`; the row names `zin_units.txt`, which is not written) |
| `common/units/equipment` | `zin_equipment_land.txt`, `zin_equipment_naval.txt`, `zin_equipment_air.txt`, `zin_equipment_granted.txt` (the row names `zin_equipment.txt`) |
| `common/units/equipment/modules` | `zin_ship_modules.txt` (the row names `zin_modules.txt`) |
| `common/units/equipment/upgrades` | `zin_upgrades.txt` |
| `common/units/names` | `zin_names.txt` |
| `common/units/names_divisions` | `zin_names_divisions.txt` |
| `common/units/names_ships` | `zin_names_ships.txt` |
| `common/units/names_railway_guns` | `zin_names_railway_guns.txt` |
| `common/units/codenames_operatives` | `zin_operative_codenames.txt` (the brief gave it to this slice; the diplomacy slice must not write it) |
| `common/unit_tags` | `zin_unit_tags.txt` |
| `common/equipment_groups` | `zin_equipment_groups.txt` |
| `common/combat_tactics.txt` (override) | `common/combat_tactics.txt` |

Other staged files: `interface/zin_units.gfx` (three counter sprites per sub-unit), `interface/zin_equipment.gfx` (`GFX_<type>_medium` and `GFX_archetype_<archetype>_medium` for every type and archetype), `gfx/entities/zin_warfare.asset` (one `<id>_entity` per land sub-unit), `localisation/english/zin_warfare_l_english.yml` (575 new keys), `localisation/replace/zin_warfare_l_english.yml` (117 keys the game also defines: the category and group names, the 50 tactic names, and the text of the kept keys `convoy`, `train_equipment` and `motorized_equipment` with their variants), `docs/design/warfare/units3d_report.json` (which model each sub-unit borrows and which have none), `docs/design/warfare/unit_stats.json` (the solved factors, for review).

Remove from the integrator's side: the `silenced.json` entries of the five folders above are already gone; the stage-1 stub `common/units/names_divisions/zin_division_names.txt` (group `ZIN_HOSTS`, written by `vanilla_silence.mjs`) is now redundant. This module does not define `ZIN_HOSTS`, so either keep the stub or drop it; it must not be defined twice.

## 3. Vanilla files overridden by name, kept, bridges, engine minimums

- Overridden by name: `common/combat_tactics.txt` only. It is the installed file read at build time (vanilla removal rule 5) without the five tactics that name a tag or a removed unit (`tactic_banzai_charge`, `tactic_grand_banzai_charge`, `tactic_masterful_blitz`, `tactic_masterful_delay`, `tactic_sf_armor_supported_assault`), with `has_trait` names mapped to the traits the characters spec defines (`aggressive_assaulter` and `urban_assault_specialist` to `offensive_doctrine`, `panzer_leader` and `panzer_expert` to `cavalry_leader`, `combined_arms_expert`, `fast_planner` and `trait_engineer` to `organizer`), `has_unit_type = engineer` to `zin_support_sappers`, and no pointer to a dropped tactic.
- Kept vanilla and relied on: `common/units/critical_parts` (`on_fire`, `rudder_jammed`, `damaged_light_guns`, `damaged_heavy_guns`), `common/units/unit_modifiers` (no ZIN sub-unit modifier is registered; no ZIN doctrine uses one), `interface/subuniticons.gfx` (the `GFX_group_*_icon` sprites of the five groups used), `interface/texticons.gfx`.
- No bridges. A scan of the staged tree with this module added reaches the C3 rescan without a dangling name (probe build, 19 October 2026).
- Engine minimums kept defined: `convoy`, `train_equipment`, `motorized_equipment` and their variants, in ZIN files with ZIN bodies and the engine's stat names; `motorized_equipment` has the stub sub-unit `zin_support_pack_train` (`active = no`, no technology unlocks it), so the AI finds a consumer. Every engine sub-unit category stays declared. The railway-gun name folder holds one group with `can_use = { always = no }`.

## 4. How the numbers work

- **Equipment carries the per-piece stats; the sub-unit scales them.** A sub-unit's stat is the `need`-weighted blend of its equipment times `(1 + factor)`. The module solves the factor that puts the blend on the spec table (`solveUnit`), so the spec's targets hold for the baseline variant (`_1`, or `_0` where a line has no `_1`). Every land equipment has speed 4; the sub-unit's `maximum_speed` factor sets the spec speed (cavalry 9 is `1.25`). Armour within one point and hardness are left to the equipment. Hardness is not written on sub-units (no vanilla sub-unit sets it). Whether the engine averages mixed equipment this way is unobserved: if it does not, the Linux run shows the difference in the division designer (`docs/design/warfare/unit_stats.json` has every target and factor).
- **Piercing.** Wards pierce 25, 30, 38, 45 (men, giants), wardsingers 50 (elves reach ward `_1` only, so the figure stays); ballistae 40 to 46; the bearer of Glo 300 (shard 120), Volgan 200, a great spirit 60, Zol made flesh 300. `divisionPiercing` (0.4 average, 0.6 best) of every template of the spec, per people, at 1748, 1755, 1760, 1775 and 1790, stays under half the deathless armour (80); with Glo it passes it (test).
- **Ships.** The hull totals are the spec table with the default modules; the bare hull stat is `total / (1 + multipliers) - added`. A module that does not fit a hull is barred by a `module_count_limit` of 0 on that hull (the spec's four categories cannot say it). Every hull has a required propulsion and protection slot, one to three armament slots and one crew slot; the base variants default to Planking and the hull's own propulsion (and a ram on galleys and corsairs) because the other modules wait for later technologies; the spec's full loadouts (two Ballista Racks and Lookouts on a warship, and so on) are for the history's `create_equipment_variant` and the AI designs.

## 5. What I expect from other slices

- **Technologies** (read, written by them): the scripted trigger `zin_rules_skies_beasts` (griffin production), the unlocks listed in `technologies_warfare.json` (every id resolves; the module refuses a dangling one). Granted gear has no technology: dragons, the great beings, Shachihata are `active` and gated by the stock a script grants; the deathless bonds wait for `zin_tech_deathless_tide_1`.
- **Mechanics (Zol, Volgan, Glo, Afrit, the Western Crossing)**: `unlock_subunit = zin_abyss_folk` before the Abyss Host is created (it is `active = no`, recruited by nobody); grant stock with `add_equipment_to_stockpile` of the **archetype** (`zin_deathless_equipment`, `zin_dragon_equipment`, `zin_glo_blade_equipment`, ...) or the type; the Glo swap uses `zin_glo_blade_equipment_shard`. A story template that names a sub-unit uses the ids in `warfare_ids.json`.
- **Not in this slice and still needed for the stage to load** (the brief gave them to others): `common/ai_templates`, `common/ai_equipment`, `common/ai_navy/*` (they name this module's sub-units, hulls and modules; vanilla files naming removed ones are errors or an AI crash), `common/abilities`, `common/raids`, the five unit-leader trait files, `common/scientist_traits`, `history/units` (it must stock `zin_arms_equipment_1` for `infantry_equipment_1`, `train_equipment_0` or `_1` and `convoy_0` for the vanilla keys, and name a host group from `warfare_ids.json`), `gfx/interface/equipmentdesigner/graphic_db` (the disposition row has no writer yet; it names vanilla vehicle entities), the ship designer windows (`equipment_designer_zin_hull_galley`, ... in `interface/equipmentdesigner/ships`), `common/script_enums.txt` and the tokens file (economy), the `zin_war` scripted effects, events, ideas, game rules and defines (`zin_war_grant_dragons`, `zin_dragon_flights`, `zin_rule_skies`, the special-forces cap defines that let rangers, hill companies and sea soldiers be built).
- **Characters**: the traits `ranger`, `ambusher`, `cavalry_leader`, `organizer`, `offensive_doctrine`, `defensive_doctrine`, `trickster`, `unyielding_defender` (used by the tactics).
- **Art**: counters (`gfx/interface/counters/divisions_large/zin/<id>.dds`, `divisions_small/zin/<id>.dds`, `counters/zin_small/<id>.dds`), equipment pictures (`gfx/interface/equipment/zin/<type>.dds`, `gfx/interface/archetypes/zin/<archetype>.dds`). A sprite whose picture does not exist yet points at `gfx/interface/zin/frame.dds`; the art module must not redefine these sprite names.
- **Models**: ships, dragons, griffins, convoys, trains and Zol's dead have no entity (the spec's "counter only"). If the Linux run logs missing-entity lines for them, stand-in entities go into `gfx/entities/zin_warfare.asset`.

## 6. Choices and spec conflicts (no spec was edited)

1. **Banned words.** The spec's "Ballista Battery" reads **Ballista Rack** (`battery` is banned); keys keep the spec's id `zin_mod_ballista_battery`. Other names avoid `marine`, `tank`, `steel`, `knots` and the rest of the banned list (a test scans every value).
2. **Producers.** The spec gives arms to "every people except ents, yeti, the dead, demons", yet Kilinti recruits men's levy, archers and rangers and Volgan fields orc warbands, so arms are also produced by ents and by Volgan (country test), bows by ents, armour by Volgan, catapults by elves, Sunhot elves and demons (the technology data widened them), wards by Sunhot elves and giants. Grave arms are Volgan's alone; Zol produces nothing.
3. **Camels** share the horse mounts archetype (the technology data gives the camel host no separate variant); the sub-unit's terrain blocks and speed set the difference.
4. **Sub-unit unlocks.** `tech` units are `active = no`; granted units (great beings, Shachihata) are `active = yes` and gated by their stock; `zin_abyss_folk` is `active = no` and `script`-unlocked; the pack-train stub is never unlocked. A test ties each unit to the technology data.
5. **Dragons and griffins** are non-modular air equipment (`type = cas` and `fighter`), as the spec's primary design says; the precedent is the engine's own non-modular missile. The Linux run decides whether a granted wing deploys (fallback: a one-slot airframe under the same keys). Dragons have `air_bombing 0`.
6. **Naval signs.** `naval_torpedo_damage_reduction_factor` on the Warded Hull is **+0.1** (the installed modules use a positive value for less damage taken); the spec's minus sign is read as "damage reduced". The Boarding Party's invasion capacity is not a module stat, so it is the technology's `naval_invasion_capacity`.
7. **Siege and cavalry models.** A siege battalion shows its crew (the men's model) and riders show the man without the mount; both are recorded as borrowed in the 3D report. 47 of 55 land sub-units borrow one of the five models (decision P13); Zol's dead and the ships, flights, griffins and Zol made flesh have none.
8. **Names.** Host, ship and agent names come from `placeNames` per culture: one host group per culture (`ZIN_HOSTS_<CULTURE>`, 24 numbers, more for the cultures with a great power: Lake Aenorans 40, Leren sea-kings 32, Volgan 44, Coldor 28; the culture's noun, an English ordinal and a place of its own language), four ship groups per culture (`ZIN_SHIPS_<CULTURE>_<HULL>`, from rivers and lakes, towns, mountains and seas, woods and sites), Zol's ordinal hosts and nameless black ships, the generic block of `names/` keyed by sub-unit id and hull alias, and dragon flights for 65 elven and Sunhot realms. Dynamic tags have no group; templates must pin `division_names_group` from `warfare_ids.json`.
9. **Tactics.** Only the engine tactic keys stay (no Erdae-only tactic is added: no technology enables one). 50 are kept; all are renamed in the replace file.
10. **Unit categories.** Spec 4.1 to 4.8 categories are written as listed plus `category_army`; the armoured group's monsters carry `category_tanks` and `category_all_armor` (the doctrines name `category_all_armor`).
11. **Equipment years** are the technology years (1500 to 1790); archetype `year` is the earliest variant.

## 7. Inventory

Closed by these files: WE-041, 042, 043 (no modern mobile unit; pack trains kept), 044, 045, 046, 049, 050, 051, 052, 058 (sub-unit text), 062, 063, 064, 065, 067, 068, 084, 085, 086, 089 (nothing written), 090, 091, 092, 093, 094, 095, 096, 097 (names, sprites registered), 195. Open for art, interface or other slices: WE-048 (institutions), 053 to 057 and 097 (pictures), 066, 069 to 083 (models, sounds, particles), 098, 099, 101 to 108 (economy and interface), 135 to 137, 147 (characters), 154 to 170.
