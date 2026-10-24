# Error log profile of the first running integrated build (run integ_r3b, 24 October 2026)

The integrated build at `2b5f1de` ran 600 s at top speed in the Linux harness without a crash; `error.log` held 14,964 lines (the in-game counter showed 14,909). The groups below cover nearly all of them. The error-budget pass runs after the roster migration, because the old Y-tags and dynamic tags account for many lines.

| Lines | Cause | Where | Fix direction |
| ---: | --- | --- | --- |
| about 6,000 | `capital_scope` evaluated on countries that do not exist or have no capital (1,520 `invalid event target` in the trigger file, the rest as "Country ... did not have a valid capital state" for every Y-tag and D-tag) | `common/scripted_triggers/zin_east.txt` (East Lands mechanic, `tools/content/modules/mech_east*.mjs`) | guard with `exists = yes` and `has_capital` style checks before `capital_scope`; never iterate non-existing tags |
| 3,050 | `invalid database object` for the vanilla technologies `tech_support`, `tech_recon`, `infantry_weapons`, `infantry_weapons1`, `basic_train` (610 each) | a kept vanilla script or a ZIN file still naming vanilla technologies | find every reference (C3 should have caught it: extend the vanilla reference check to technology names in `has_tech`/`set_technology` and database-object variables) |
| 564 | `Failed to create orders group` | AI or history unit orders | inspect the AI strategy plans and unit history for orders on invalid targets |
| 424 | `Malformed token: var:zin_arg_who` | a scripted effect in `common/scripted_effects/zin_*` (decision E1 argument variables) | temporary variables need `temp:`-style use or a different pattern; read the effect and the wiki's data-structures section |
| 214 | `recruit_character should only happen in game/history` | `common/on_actions/zin_inst.txt` (institutions slice) | create characters in history or with a valid in-game pattern |
| about 300 | equipment variant errors (`Could not find proper equipment variant`, `does not have any equipment variant for type zin_hull_galley_N`, `Trying to fill variant where none exist`) | `history/units/*_world.txt` and starting stockpiles (forces slice) | create the variants in the country history before the units and stockpiles use them |
| 118 | parse errors (`unexpected token`) | `common/scripted_effects/zin_goldoroth.txt` | fix the generated syntax in the Goldoroth tree's effects |
| small | `Multiple convoy types are not supported` (warfare writes `convoy_0` and `convoy_1`), unexpected `desc` in `common/game_rules/*.txt`, `set_technology: Invalid tech` in country history | warfare, rules, history | per the crash-hunt note of 24 October |

The full log is kept outside the repository; rerun the harness to regenerate it (`tools/acceptance/run.sh`).
