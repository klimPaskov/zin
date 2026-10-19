# Stage 2 integration note: economy, resources, buildings and the energy system

Module `tools/content/modules/economy.mjs`, data `tools/content/data/economy.json` (resources, energy, buildings, state categories, regions, spirits, treasury, start industry, sprite list) and `economy_text_core.json`, `economy_text_ui.json`, `economy_text_supply.json`, `economy_text_modifiers.json` (Erdae text by group), test `tools/content/economy.test.mjs` (43 tests, in the `test` script). Spec: `docs/specs/03_gameplay/02_economy.md`; defines rows are in `tools/content/data/defines.json`.

## 1. The call to add to `build.mjs`

```js
import { buildEconomy } from './modules/economy.mjs';
// after the warfare module (it reads the equipment keys already staged under common/units/equipment for
// script_enums.txt and the tokens file) and BEFORE buildVanillaRemoval (the reference scan must see these files)
const economy = await buildEconomy(staged, { countries });
```

`ctx`: `{ countries }` (required: the roster; Aenor and every `scan` region must resolve), optional `equipmentKeys` (more archetype keys), `extraTokens`, `skipLoc` (text groups to leave out: `resources`, `buildings`, `facilities`, `building_modifiers`, `state_categories`, `landmark`, `energy`, `fuel`, `alerts`, `topbar`, `state_ui`, `building_ui`, `construction`, `production`, `arsenal`, `trade`, `market`, `supply`, `modifiers`), `yieldToTextSweep` (default true), `game`. It returns the counts (7 resources, 33 buildings, 13 state categories, 17 spirits, 857 replaced and 38 new text keys, plus the list of keys yielded to the text sweep).

**Integrator edits** (not mine to make): remove the `common/buildings` entry of `data/vanilla/silenced.json` (it silences `01_landmark_buildings.txt`; the module now writes that file, so the builder would see a duplicate); set the `zin` lists of the disposition rows below; flip the stage-2 rows. A probe build with the call inserted before `buildVanillaRemoval` passed the C3 rescan, the assets check (after two text icon fixes) and vanilla tests C1 to C5.

## 2. Disposition rows these files satisfy

| Row (path) | ZIN files |
| --- | --- |
| `common/resources/00_resources.txt` (override) | `common/resources/00_resources.txt` |
| `common/buildings/01_landmark_buildings.txt` (override) | `common/buildings/01_landmark_buildings.txt` (one inert `zin_interim_landmark`, the `landmark_spawn` spawn point) |
| `common/script_enums.txt` (override, warfare row; the brief gave it to this slice) | `common/script_enums.txt` |
| `common/synchronized_dynamic_tokens` (replace, warfare row; same) | `common/synchronized_dynamic_tokens/zin_tokens.txt` |
| `common/script_constants` (replaced in stage 1) | adds `common/script_constants/zin_economy_constants.txt` beside `zin_constants.txt` |

Other staged files (all new ZIN names): `common/ideas/zin_economy.txt` (11 regional spirits, 6 timed ideas), `common/on_actions/zin_economy.txt` (startup flags and spirits, the treasury, the monthly runner), `common/scripted_effects/zin_economy.txt` (`zin_economy_add_gold`, `zin_economy_apply_crown_debts`, `zin_economy_monthly_gold`), `common/scripted_triggers/zin_economy.txt` (`zin_economy_aenor_in_debt`), `common/opinion_modifiers/zin_economy.txt` (`zin_opinion_aenoran_gold`), `common/ai_strategy/zin_economy.txt` (`zin_economy_granaries`), `localisation/replace/zin_economy_l_english.yml`, `localisation/english/zin_economy_l_english.yml`.

Kept vanilla (disposition keep, no file written): `common/buildings/00_buildings.txt`, `common/state_category/*`, `common/terrain`, `common/alerts.txt`, `common/defines/00_defines.lua`. Names change through localisation only.

**Not covered by this slice** (the brief's folder list excludes them; the institutions slice holds them in `institutions_craft.json`): `common/military_industrial_organization/*`, `common/special_projects/*`, `common/technologies`' `zin_industry.txt`. Nothing here needs a bridge.

## 3. The energy system (master plan P5)

P5 says "fuel for the forges (charcoal and coal)". The Ready economy spec, the glossary (entries `energy`, `fuel`) and the text sweep spec (line 408: P5 "reads Provisions and Stored Essence") settle it, and the banned list forbids `coal`, `fuel` and `energy`. The Erdae version:

| Engine | Erdae | Detail |
| --- | --- | --- |
| energy (`NGame.ENERGY_RESOURCE = "coal"`) | **Provisions**, fed by **Grain** (the `coal` key) | 9 Provisions per Grain extracted (`RESOURCE_TO_ENERGY_COEFFICIENT`, unchanged) on top of a base |
| `BASE_COUNTRY_ENERGY_PRODUCTION` 10 | **12** | a realm of ten buildings is fed by the base alone; the base alone feeds about 18 (assumed demand model below) |
| fuel bar (`FUEL_RESOURCE = "oil"`) | **Stored Essence**; fuel silo = Essence Vault, refinery = Essence Still | present, never spent (every equipment burns 0); the vault buildings are never unlocked |
| `energy_infrastructure` | **Granaries** | unchanged engine effect: -0.075 Provisions needed per Road level in the state |
| `industrial_infrastructure` | **Mine and Quarry Roads** | +10 per cent store yield per Road level |
| `NAI.NUM_FACTORIES_IN_STATE_TO_WANT_ENERGY_REDUCTION` 6 | **3** | armouries are a third of the workshops, so six in one state is rare |
| `NAI.TOTAL_STATE_EXTRACTED_RESOURCES_FOR_BUILDING_RESOURCE_CAP_BUILDING` 30 | **12** | Erdae deposits are small |

**Effect of a shortfall** (the engine's, worded in the alert): each Guild Workshop yields less and the Works speed falls; each Armoury yields less and the Forge Output falls; each Shipwright yields less and the Yard Output falls. The gap between powered and unpowered output stays the game's (5 against 4 for workshops, 4.5 against 3.5 for armouries, 2.5 against 2 for yards): hunger slows the realm, it does not stop it.

**Design model** (assumed from the comments of the installed defines, to be measured in the Linux run with `energy_ratio` and the top bar tooltip): one building costs `min(6.6, 0.25 + 0.0225 x all buildings)`; supply is `12 + 9 x Grain used`. Aenor's 52 buildings need about 74 Provisions, so about 7 Grain. The state pass must therefore put Grain in states: **until it does, every realm with more than about 18 buildings is starved** (today no state carries `coal`). The AI builds Granaries when `energy_ratio < 0.9` (`common/ai_strategy/zin_economy.txt`).

**Names and texts.** Resources: Essence (`oil`, frame 1), Timber (`aluminium`, 2), Horses (`rubber`, 3), Stone (`tungsten`, 4), Iron (`steel`, 5), Gold (`chromium`, 6), Grain (`coal`, 7). Energy keys (`TOPBAR_ENERGY_*`, `TOPBAR_*COAL*`, `ENERGY_DEMAND`, `RECEIVED_ENERGY`, `PRODUCTION_STATE_ENERGY_*`, the five `alert_lack_of_power*`, the `alert_out_of_fuel*` family, `FUEL*`) are in the groups `energy` and `fuel` of `economy_text_core.json`.

## 4. Sprite keys the art track needs

Strips: `GFX_resources_strip` (7 frames 27x27 in the key order above, `gfx/interface/resources_strip.dds`) and `GFX_missing_resources_strip`; `GFX_buildings_strip` (31 frames 46x46, `gfx/interface/buildings/building_icon_strip.dds`; the 17 used buildings get Erdae icons by their `icon_frame`, the rest a plain plate). Text icons: `energy_texticon` (Provisions), `energy_consumption_texticon` (Grain eaten), `out_of_power_texticon` (empty sack), `power_balance_texticon`, `fuel_texticon` (vial), `civ_factory`, `civ_factory_output`, `mil_factory`, `nav_dockyard_texticon`, `production_cost`, `navprod_cost`, `consumer_goods_texticon` (Folk Wares), `convoy_texticon` (Merchant Fleet), `supply_texticon`, `supply_hub_texticon`, `naval_supply_hub_texticon`, `infrastructure_texticon`, `railways_texticon`, `train_texticon`, `resources_to_market_icon`, `market_subsidy_small_texticon`. Top bar: `fuel_icon`, `topbar_convoys`, `industrial_capacity_icon`, `consumer_goods_icon`. Alert frames of `GFX_global_alert_icons`: `alert_lack_of_power`, `alert_lack_of_resources`, `alert_out_of_fuel`, `alert_free_civilian_factories`, `alert_free_military_factories`, `alert_free_naval_dockyards`, `alert_low_supply`, `alert_very_low_supply`, `alert_base_low_supply`, `alert_base_very_low_supply`, `alert_trade_import_unfullfilled`. Idea pictures: none new (catalog icons `GFX_idea_zin_<picture>`). The same list is in `economy.json` under `sprites`.

## 5. Text

857 replaced keys (the installed game defines them; `localisation/replace`) and 38 new keys. Placeholders, colour codes and text icons follow the vanilla key (tested); no value equals the vanilla value (C5); no banned error or review word appears. **English only**; the nine other languages copy it at stage 4.

**Overlap with the text sweep.** `data/text/*.json` already writes 115 of these keys (the energy and fuel alerts, the free-building and resource alerts, the supply, railway and fuel keys of `core`, four map mode keys). By default the module yields every key the sweep's `lit`, `neutral` and `engine` lists hold, so no key is defined twice. The sweep's `alerts.energy.json` says the energy section is the economy engineer's: the Erdae wording, glossary-driven, is already there and agrees with this note (Provisions, Grain, Stored Essence); the reference wording of this slice stays in `economy_text_core.json`. The institutions slice may also write the Great Fairs (group `market`) and the four circle names (`facilities`): switch the group off with `skipLoc` if it does.

Not written here (other modules): window titles (`PRODUCTION_PRODUCTION_LABEL`, `CONSTRUCTION_VIEW_LABLE`, `LOGISTICS_LOGISTICS_LABEL`, `TRADE_TRADE`: the interface spec), railway-gun, carrier, rocket and missile keys, licences, agents, ranks, and the 22 vanilla landmark texts (unreachable: no landmark loads).

## 6. Choices and spec conflicts (no spec was edited)

1. **P5 against V2.** The master plan's "charcoal and coal" is read as Provisions and Stored Essence (section 3).
2. **State category names.** `city` and `wasteland` read **Chartered City** and **Barren Waste**: the spec names (City, Wasteland) equal the vanilla values, which check C5 forbids.
3. **Landmark.** `zin_interim_landmark` has no `country_modifiers`: the spec's empty `enable_for_controllers = { }` would apply to every controller, and no modifier is needed to be inert. It has no `show_on_map`, so no model or map row is required.
4. **Template modifiers.** `production_speed_dockyard_factor` and `production_speed_arms_factory_factor` are template instances that `assertModifiers` rejects; the module validates against the documentation's templates and the building types.
5. **Treasury.** Spec behaviour kept. `zin_economy_add_gold` does nothing in a realm without the flag `zin_economy_has_treasury` (set on Aenor at startup). Scripts use literal numbers; the same numbers are in `zin_economy_constants.txt` for the interface to read. `PREV = { add_to_variable ... }` inside `every_subject_country` counts the tribute.
6. **Resource trade costs** stay `cic = 0.125`, `convoys = 0.1` for all seven (spec).
7. **Facility names** (Warding, Tide, Roost and Deep Circle) are the institutions spec's, in group `facilities`.
8. **Regional mapping.** Roster `scan` to region: Rush Land and Rush Islands to Middle Lands, East-Earth to North Lands, South-Earth to East Lands, Sunhot to Lands of the Sun, Ocean of Edvoid to Zol's Mistake (flag only, no spirit).
9. **Defines.** Three rows with `fromStage` 2 (section 3). `ENERGY_RESOURCE` and `RESOURCE_TO_ENERGY_COEFFICIENT` are unchanged and not written.

## 7. Dependencies on other slices (names from the contract; none is defined here)

- Aenor mechanic: variables `zin_court_corruption`, `zin_concord_loyalty`; global flag `zin_golden_king_dead`; the monthly runner reads them and sets none.
- Diplomacy: autonomy state `zin_autonomy_chartered_dominion` (used in `every_subject_country`; an unknown autonomy state is a load error if the diplomacy slice lacks it); global flags `zin_wall_accord`, `zin_elves_cold_roads`, `zin_elves_wall_roads_closed`.
- Special projects (institutions slice): the kept `00_buildings.txt` names `specialization_naval`, `_air`, `_land`, `_nuclear` on the four facilities; those four keys must stay defined in the replaced `specialization` folder or the buildings fail to load.
- Technologies slice: `technologies.md` expects the seven gate buildings and `radar_station`, `anti_air_building`, `stronghold_network`, `air_base` to stay defined; they do (kept file). No ZIN technology may enable `synthetic_refinery`, `fuel_silo`, `rocket_site`, the reactors, dams or canals.
- Warfare: stage `common/units/equipment` before this call so `script_enums.txt` and the tokens file list the ZIN archetypes. If the warfare module also writes those two files the builder stops with a duplicate; one of the two must give them up.
- State pass (politics step): resources from the region weights in `economy.json` (`regions`, `worldTotals`, `specialSites`, `startIndustry`); Grain (`coal`) in particular.
- Interface: the Erdae bar and Aenor's panel read `zin_aenor_gold` and `constant:zin_economy.gold_max`.

## 8. Known limits

- **C2 on the tokens file.** `zin_tokens.txt` is a list of bare words like the vanilla file; check C2's `definesSomething` counts keyed entries only, so it reads this replaced folder as empty. The row needs `emptyAllowed` or `definesSomething` must accept a bare list.
- Not finished: the treasury decisions (`zin_aenor_treasury`) and the five economic events (`zin_economy.1` to `.5`) wait for the mechanics wave, because they call Aenor, Western Crossing and eastern kings effects that no module defines yet; the opinion modifier and the timed ideas they use are staged. The AI weights of those decisions go with them.
- The design model of section 3 is unmeasured; no game was run.
