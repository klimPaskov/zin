# Stage 2 integration note: technologies, doctrines and research sharing

Module `tools/content/modules/technologies.mjs` (library `tools/content/lib/tech_layout.mjs`), data `tools/content/data/technologies.json` (craft and scholarship rows, gates, folder and category tables, AI focuses), `technologies_warfare.json` (114 warfare rows), `technologies_doctrines.json`, `technologies_packages.json` (start packages, start doctrines, research sharing), `technologies_ids.json` (ids written by other slices), test `tools/content/technologies.test.mjs` (47 tests, in the `test` script).

## 1. The call to add to `build.mjs`

```js
import { buildTechnologies } from './modules/technologies.mjs';
// after buildVanillaRemoval (it replaces that module's stage-1 common/ai_focuses/zin_ai_focuses.txt in the staged set)
// and before computeBridges / the C3 rescan (the scan must see these files)
const technologies = await buildTechnologies(staged, { countries, assignment });
```

`ctx` is `{ countries, assignment? }`: the roster of `data/countries.json`, and optionally the `Map` tag -> people that `build.mjs` already holds (`assignment`); without it the module uses `defaultPeople`. It returns counts (168 technologies, 7 gates, 13 folders, 26 categories, 15 grand doctrines, 37 subdoctrines, 11 tracks, 8 sharing groups, 15 packages). Exports for other modules: `technologyPackages(model)`, `startFor(...)`, `technologyBlock`, `technologyIconKeys`, `doctrineIconKeys`, `prepareModel`.

**Remove from `vanilla_removal.mjs`** (the integrator's edit, not mine): the `AI_FOCUSES` writer and its `technologyCategories()` check. The module overwrites the file with `staged.files.set`, so it works either way if it runs second; if it ran first, vanilla_removal's `staged.text` would throw a duplicate.

## 2. Disposition rows these files satisfy

| Row (path) | ZIN files (update the `zin` list) |
| --- | --- |
| `common/technologies` | `zin_arms.txt`, `zin_mounts.txt`, `zin_engines.txt`, `zin_lore.txt`, `zin_camp.txt`, `zin_naval.txt`, `zin_skies.txt`, `zin_industry.txt`, `zin_scholarship.txt`, `zin_gates.txt` (the row names `zin_technologies.txt`, which is not written: the specs name these ten) |
| `common/technology_tags` | `zin_technology_tags.txt` |
| `common/technology_sharing` | `zin_tech_sharing.txt` (the diplomacy slice must not write it: the brief gave it to this slice) |
| `common/doctrines/folders`, `/grand_doctrines`, `/tracks` | `zin_doctrines.txt` in each |
| `common/doctrines/subdoctrines/land`, `/sea`, `/air`, `/special_forces` | `zin_doctrines.txt` in each (the special-forces file holds the hidden `zin_sub_hidden_special_forces`) |
| `common/ai_focuses` (stage 1, rewritten) | `zin_ai_focuses.txt` |

Other staged files: `common/scripted_triggers/zin_technologies.txt` (`zin_rules_skies_present`, `zin_rules_skies_beasts`, `zin_tech_not_zol`, ten `zin_tech_people_<key>`), `common/scripted_effects/zin_technologies.txt` (`zin_tech_sharing_sync`), `common/scripted_effects/zin_naval_air.txt` (`zin_inst_air_start`), `common/on_actions/zin_technologies.txt` (startup, monthly, join-faction), `interface/zin_technologies.gfx`, `interface/zin_doctrines.gfx`, `localisation/english/zin_technologies_l_english.yml` (all text; one file for technologies and doctrines), `localisation/replace/zin_technologies_l_english.yml` (the keys the installed game also defines: `industry`, `construction_tech`, `excavation_tech`, `land_doctrine`, `naval_doctrine`, `air_doctrine`, `special_forces_doctrine`, the six kept folder keys and their `_research` / `_desc` forms), `docs/design/technology/layout.json` and `docs/design/technology/start_packages.json`.

## 3. Vanilla files overridden by name, kept, bridges

- No ZIN file overrides a vanilla file by name: every folder is replaced.
- Keep vanilla: `interface/Technologies.gfx` (nothing reaches its sprites), `interface/countrytechtreeview.gui/.gfx` and `countrydoctrinetreeview.gui` until the tree-view override below exists, `interface/technology_sharing.gfx` (the groups use `GFX_technology_sharing_default`), `interface/doctrines/*` (window chrome), `common/unit_tags` is the warfare slice's.
- A scan of every loaded vanilla file outside the replaced folders found no technology, doctrine or category reference except those GUI/sprite names. **No bridges are provided and none are needed.**
- Engine minimums kept: tech folders `industry_folder`, `electronics_folder`, `land_doctrine_folder`, `naval_doctrine_folder`, `air_doctrine_folder`, `special_forces_doctrine_folder`; categories `industry`, `construction_tech`, `excavation_tech` and the four doctrine categories; doctrine folder keys `land`, `naval`, `air`, `special_forces`; the nine engine AI focus keys.

## 4. What I expect from other slices (ids, all listed in `technologies_ids.json`)

- **warfare.mjs**: the 60 sub-units, the equipment archetypes with variants `_0`..`_5` (the highest variant a technology unlocks: arms 5, bows 4, armour 4, elven arms 3, mounts 3, catapults 3, wards 3, troll/giant/ent/yeti/ogre gear 2, grave and nether arms 2, deathless 2, griffins 2, ballistae 2, trebuchets 2, scorpions 1, camp gear 0; hulls galley 2, warship 2, great warship 1, raider 1; `convoy_0/1`, `train_equipment_0/1`, `motorized_equipment_0..2`), the sixteen ship modules (only `zin_mod_planking` is ungated by design), `category_zin_archers/_dead/_great_beings/_monsters/_siege` in `common/unit_tags`, `category_front_line` and the engine categories the tracks name, the game rule `zin_rule_skies` (options `dragons_only`, `beasts`, `none`), `zin_dragon_flights` and `zin_war_dragon_pact`. **Camel line:** the camel host unlocks only `zin_men_camel_riders`; if warfare makes camels a separate archetype or variants, gate them under `zin_tech_camel_corps`. **Equipment gating:** anything a technology lists is locked until researched, so warfare must not give `zin_dragon_equipment` or the great-being equipment a technology (they are granted).
- **economy.mjs**: the `specialization_nuclear/_naval/_air` keys in `common/special_projects/specialization`; buildings `radar_station` (max 6), `anti_air_building` (5), `stronghold_network`, `air_base` (10) and the seven gate buildings stay defined; workshops' `research_categories` use the `zin_cat_*` names.
- **politics step / warfare.mjs**: read `docs/design/technology/start_packages.json` (per country: package, technologies without prefix, land grand doctrine, naval grand and sub doctrine). Apply the naval doctrines only to countries that have ships; set `set_technology` with the `zin_tech_` prefix. No land subdoctrine is set at start (the spec sets none).
- **Afrit / Zol mechanics**: grant `zin_tech_bound_demons` and `zin_tech_deathless_tide_1..3` with `set_technology`; call `mark_technology_tree_layout_dirty = yes` for every country when `zin_afrit_revealed` and `zin_zol_rising` are set (three rows read those global flags in `allow`/`allow_branch`). `zin_war_grant_dragons` calls `zin_inst_air_start`. Region flags `zin_region_east_lands`, `zin_region_middle_lands`, `zin_region_tritons_islands` (diplomacy) are read by camel host and AI weights only.
- **peoples**: flags `zin_people_<key>` are set at startup; `zin_tech_people_*` read them. The peoples module sets them in `zin_startup.txt`; this module's startup marks every country's tree dirty after it (file order).
- **Art (war_art.mjs)**: ship DDS files under `gfx/interface/technologies/zin/<key>.dds` (168) and `gfx/interface/doctrines/zin/<name>.dds` (grand doctrines, subdoctrines, `<track>_bg/_icon`, `<folder>_ledger/_tab`, `decor_<folder>`; see `doctrineIconKeys`). The sprite files point each sprite at its own DDS when it exists and at `gfx/interface/zin/frame.dds` until then (no vanilla texture, no missing sprite). War_art must not redefine these sprites.

## 5. What the research tree view needs (`countrytechtreeview.gui` is now this slice's)

I did **not** write the GUI: the spec fixes the geometry (70 px slots, 140 px columns, format `UP`, one gridbox per root) but not the window chrome, tab strip, item containers or the folder backgrounds, and those wait for the interface art. `docs/design/technology/layout.json` holds everything computable: per folder the gridboxes (name `<root>_tree`, pixel position from origin 150, 60, size 100x140, slotsize 70, format `UP`), every tile (absolute and root-relative slot, sprite name), the used rows and the row captions (`zin_techtree_year_<y>`, plus `zin_techtree_year_start` for the 1 Thaw 4A 1748 rule between rows 6 and 8). The generated file must contain, for each of the nine visible folders (`zin_arms_folder`, `zin_mounts_folder`, `zin_engines_folder`, `zin_lore_folder`, `zin_camp_folder`, `zin_naval_folder`, `zin_skies_folder`, `industry_folder`, `electronics_folder`): a container window named like the folder with those gridboxes, a tab `<folder>_tab` (two frames) in `folder_tabs`, and `techtree_<folder>_item` and `techtree_<folder>_small_item` (every tile uses the small item: all rows set `force_use_small_tech_layout`). The vanilla folder windows and tabs are dropped. The four doctrine folders need no tree window (the new doctrine system builds from data); the engine's doctrine ledger names the four `*_doctrine_folder` keys, which exist.

## 6. Choices and spec conflicts (none of the specs was edited)

1. **Counts:** 114 warfare technologies, not 115: warfare 11.5 lists 14 camp rows (the inventory counts 15). Total 54 + 114 = 168 visible rows + 7 gates.
2. **Banned words:** displayed names avoid `banned_words.json` (keys keep the spec's ids): Forged/Tempered/Mountain Iron, Leaf-Forging, Slaked Lime (key `lime_mortar`), Many Hands (`division_of_labour`), Veteran File-Leaders, Camel Host, Engine Crews, Siege Parks (`zin_sub_siege_trains`). A test scans every string with the banned list.
3. **Elven Hulls** year 1500 -> 1600 (its path parent Oared Galleys is 1600).
4. **People visibility:** Catapults is widened to elves and sun elves (Torsion Engines needs it and both may research it); Wardsong to sun elves (Old Songs needs it); Mail, Iron Arms and Plate and Mail include Volgan (his package grants them); Siege Towers and Fire-Pots carry the `who` of their dependency. A child may not be visible to someone who cannot see its path parent or research its dependency (build check).
5. **Path versus dependency:** a path parent must be in the same line; any other prerequisite is a `dependencies` entry (no connector). Several warfare techs are therefore single-tile roots with their own gridbox.
6. **Kin Harness** "requires any kin tech" is an `allow` with `OR = { has_tech ... }`; Hallowed Arms, Wards Against Death and Warded Hulls read `has_global_flag = zin_zol_rising` in `allow`; Bound Demons and the three Deathless Tide rows are visible only to the Afrit-revealed world or to Zol and never researchable (`allow = { always = no }`); they are not "gates" (no `grantOnly`).
7. **No piercing anywhere:** Hallowed Arms' "arms piercing +2" is dropped (a tech block cannot target an archetype and `ap_attack` is closed to techs and doctrines, a build check); the ward equipment variants and sub-unit stats carry piercing. `patrol_coordination` is a ship stat, so it sits in galley blocks.
8. **Modern modifiers** (`fuel`, `nuclear`, `rocket`, `tank`, ...) are refused in technologies and doctrines (the spec's planted `fuel_gain_factor` is a real game modifier, so the check is by theme). The spec's AI conditions that have no trigger ("a border state with a resource", "realm across water", "Guild Workshops") use `has_resources_in_country`, `has_war` and `num_of_military_factories`.
9. **Third reward:** 150 mastery for every subdoctrine (spec rule for sea and sky, applied to land). No tactics are enabled (none specified). No hidden grand doctrine for the special-forces folder; if the Linux run logs the orphan track, add one.
10. **Research sharing:** 0.10 per member, one group per start faction (`is_in_faction_with <leader tag>`) plus `zin_research_leagues` (faction-sharing, everyone else). The picture is the engine's `GFX_technology_sharing_default`. Membership comes from `zin_tech_sharing_sync` (monthly, on join, at start) because `on_join_faction` misses `add_to_faction`.
11. **AI focuses:** `special_forces_doctrine` is added (weight 1 to `ai_focus_military_advancements`) so every category appears in a focus.
12. **Not run:** the HOI4 Agent Tools MCP tools are exposed but refuse here (no registered workspace for this session), so `hoi4_tech_inspect`, `hoi4_tech_render` and `hoi4_script_validate` were not run; triggers, effects, modifiers (families expanded) and unit tags are checked against the installed documentation by the module instead. Layout, tooltips and mastery rates are unobserved until the Linux run.

## 7. Inventory

Closed by these files: WE-001, 002, 003, 004, 007, 008, 010, 012, 013, 014, 015, 017, 018, 020, 021, 022, 029, 030, 031, 032, 033, 034, 035, 036, 037 (text); WE-005, 006, 009, 011, 016, 019, 023, 195 closed by removal (nothing is written). WE-024 (icons, 168 sprites reserved), WE-025/026/027 (view chrome, window text), WE-028 (defines), WE-038/039/040 stay open for art and interface.
