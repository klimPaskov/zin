# Fixes for the error groups of run integ_r3b (handoff)

This is the handoff for the groups of `r3b_profile.md`. The log is from the old 305-row roster; every cause was re-derived from the current builder (156-realm roster) and fixed in the builder modules, data and focus sources, never in the generated game files. A fix is only verified when the next Linux run shows its lines gone: each group below says what only that run can confirm.

The builder now runs `checks/engine_forms.mjs` over the finished staged tree (after the pending stand-ins, before the asset step) and stops on a form the game rejects; `engine_forms.test.mjs` holds a failing and a passing case for each rule. The C3 reference scan (`checks/vanilla_refs.mjs`) knows a new category, `technology`.

## 1. `capital_scope` on countries that do not exist or have no capital (about 6,000 lines)

- Cause: `zin_east_in_region` (`common/scripted_triggers/zin_east.txt`, line 13 in the log) evaluated `capital_scope` on every country of `every_country`, `random_country` and `any_other_country` pools, including tags with no controlled state; `zin_east_at_war_in_the_west` and the effect `zin_east_make_coalition_peace` did the same for enemies.
- Fix (`modules/mech_east.mjs`): a new trigger `zin_east_has_capital` (`exists = yes`, `num_of_controlled_states > 0`) stands before every `capital_scope` of the East Lands. AND stops at the first false line (wiki, Scopes, "Invalid event target"; Triggers, AND), so the capital is never read on such a tag. No new iteration was added.
- Test: `mech_east.test.mjs`, "Every capital_scope of the East Lands follows the capital guard", walks every staged East file and fails on a `capital_scope` without the guard before it in the same block (with a negative case).
- Script check: `hoi4_script_validate` (country trigger) confirmed `exists`, `num_of_controlled_states`, `any_enemy_country` and the state trigger inside `capital_scope` against the installed documentation (syntax, command kind, declared scope); the argument block of `any_enemy_country` stays unchecked by the tool.
- Linux run must confirm: no `capital_scope: invalid event target` from `zin_east.txt` and no "did not have a valid capital state" lines. Other modules still use `capital_scope` without this guard (Afrit host seat, the intrigue Phantom Host, Volgan); they were not in the log and are not changed.

## 2. `invalid database object` for `tech_support`, `tech_recon`, `infantry_weapons`, `infantry_weapons1`, `basic_train` (3,050 lines), and `set_technology: Invalid tech`

- Cause, old roster: the old country histories (`history/countries/Y* - *.txt`, still in the repository from the applied integrated build) set `set_technology = { infantry_weapons = 1 infantry_weapons1 = 1 basic_train = 1 tech_support = 1 tech_recon = 1 }`, five vanilla names, at load and at game start for each of the 305 rows. No kept vanilla script and no other ZIN file names them.
- Cause, current builder: `modules/countries.mjs` wrote the start packages' short keys (`iron_arms = 1`), while the technologies are `zin_tech_iron_arms`; every history of the new roster would have set 30 to 60 invalid technologies, and with no technology no ZIN equipment, sub-unit or hull is unlocked (the root of most of group 6).
- Fix: `modules/technologies.mjs` exports `fullKey`; `countries.mjs` writes `zin_tech_<key> = 1`. The published `docs/design/technology/start_packages.json` keeps the short keys (its readers, forces and the technology tests, expect them).
- Check: the C3 scan defines `technology` from `common/technologies` and holds every ZIN `set_technology` child, `has_tech`, `leads_to_tech`, `is_researching_technology`, `can_research`, a technology's `XOR` list and the `technology` of the research-bonus effects to a defined technology, so a vanilla or short name in ZIN output stops the build. Tests: `engine_forms.test.mjs` (C3 technology names: vanilla names dangle, short names dangle, ZIN names pass) and `build.test.mjs` ("Every history sets defined ZIN technologies").
- Linux run must confirm: no `invalid database object` and no `set_technology: Invalid tech`. The old Y-tag history files go when the staged tree is applied (they are not in the staged tree).

## 3. `Failed to create orders group` (564 lines)

- Finding: all 564 lines come in one tick, the first hour after unpausing (1748.3.1.13), and never again. No ZIN file gives orders: no history order of battle carries orders or armies, and the AI strategies that create orders groups (`put_unit_buffers`, `garrison`, `invade`, `area_priority`) are gated by story flags that are not set at the start. In the same run all 1,035 divisions logged "locked equipment requirements" and the fleets failed to spawn (groups 2 and 6): the AI's first army assignment ran on divisions whose equipment no country had unlocked.
- Fix: none specific; the cause is not established from the files. The technology and variant fixes give the divisions and ships their equipment, which is the most likely trigger.
- Linux run must confirm: whether the 564 lines disappear. If they stay, the next step is a run with the error log captured at the first AI tick and the AI's army groups read from a save (`hoi4-save-inspection`).

## 4. `Malformed token: var:zin_arg_who` (424 lines; also `var:zin_arg_target`, `var:global.zin_eindil_host`)

- Cause: the target field of `add_opinion_modifier` and `reverse_add_opinion_modifier` takes no `var:` token. The generated opinion helper of every focus tree (`zin_<tree>_opinion`, `modules/focus_compiler.mjs`) wrote `target = var:zin_arg_who` 288 times; `zin_elves_goodwill` (`modules/mech_elves.mjs`), `zin_west_join_coalition_effects` (`modules/mech_crossing.mjs`) and option f of `zin_eindil.82` (`data/events_world_eindil_3.json`) did the same. The temporary variable itself is fine: it has no scope prefix and keeps its value inside the effect block (wiki, Data structures, Temporary variables).
- Fix: the effect scopes to the country the variable holds (`var:zin_arg_who = { ... }`, as vanilla `instantiate_collaboration_government` does with a temp variable) and names the caller as `PREV`: the caller's opinion of the target is `reverse_add_opinion_modifier = { target = PREV }` from there, the other way round `add_opinion_modifier = { target = PREV }`. Same meaning, both directions.
- Check: engine-forms rule `opinion_var_target`; `focus.test.mjs` (the opinion helper writes no `target = var:` and scopes to `var:zin_arg_who`).
- Script check: `hoi4_script_validate` (country effect) confirmed `if`, `check_variable`, `remove_opinion_modifier`, `create_equipment_variant`, `set_temp_variable` and `activate_advisor`; it reports `var:zin_arg_who` as a scope it does not resolve, so the two opinion effects inside it are checked only against the vanilla `target = PREV` precedent (104 uses in vanilla).
- Linux run must confirm: no `Malformed token: var:` lines, and in game that the opinion helper still gives both modifiers.

## 5. `recruit_character should only happen in game/history files` (214 lines from `zin_inst.txt`)

- Cause: the institutions slice recruited the 212 chiefs of the Council of Captains in `on_startup` (`common/on_actions/zin_inst.txt`). The wiki (Character modding): recruitment cannot take place outside country history.
- Fix (`modules/institutions.mjs`, `build.mjs`): the start effect keeps only `activate_advisor` for AI realms (plus scholars and Valour); `chiefRecruits` hands the chiefs to the country package, which writes `recruit_character` in each country history beside the courts.
- Check: engine-forms rule `recruit_on_actions` (no `recruit_character` in any on_action); `institutions.test.mjs` (none in the on_action, every chief handed to the histories, one `activate_advisor` per chief); `build.test.mjs` (every activated chief is recruited in a history).
- Queued, not fixed: 92 other `recruit_character` uses sit in in-game effects (focus trees, mechanic effects and events: Aenor court, Afrit, Dark Lands, Lerendor, Gala, Glo, Eindil, Volgan, the regional trees' hire effects). The log shows the same warning for them, and by the wiki such a character may never appear. Each needs the vanilla pattern: recruit in history, keep the character hidden or roleless until the effect gives the role (`add_country_leader_role`, `add_advisor_role`, `promote_character`). That is a change in many owners' modules and character data; the build reports the count ("recruit_character in N in-game effects") so it stays visible.
- Linux run must confirm: no warning from `zin_inst.txt`, and the chiefs present as advisors for AI realms.

## 6. Equipment variant errors (about 300 lines)

- Causes: (a) no technology was set (group 2), so `zin_arms_equipment_N`, bows, mounts, camp, ogre and grave gear had no variant: "selecting latest version", "Trying to fill variant where none exist", "locked equipment requirements"; (b) the hulls are modular archetypes (`module_slots`), which have no variant until one is created, and the ships of the order of battle named none: "does not have any equipment variant for type zin_hull_galley_N", "Could not find proper equipment variant. Skip creating Ship".
- Fix: (a) the technology fix. (b) `modules/forces.mjs` writes, for each country with a fleet, one `create_equipment_variant` per hull type it uses (named after the hull variant, the ship-name group of the fleet, the hull variant's default modules from `warfare.mjs` `shipModuleRows`), and every ship carries `version_name`; `countries.mjs` writes the blocks in the history after the technologies. Vanilla precedent: `history/countries/ENG - Britain.txt` creates its variants after `set_naval_oob`, and the order-of-battle ships name them with `version_name`.
- Check: engine-forms rule `ship_variant` (every modular-hull ship names a variant its owner's history creates); `forces.test.mjs` ("Every ship names the variant its country history creates"); `build.test.mjs`.
- Linux run must confirm: no variant lines. Unconfirmed engine detail: `zin_mod_planking` (the default protection module of every hull) is unlocked by no technology; if the game refuses a locked module in `create_equipment_variant`, the variant lines return and planking needs an unlock (or `allow_without_tech`).

## 7. Parse errors in `zin_goldoroth.txt` (118 lines; the same cause in `zin_regional_blackton.txt`, `zin_regional_horidor.txt`, and the Bloody Forest tree)

- Cause: raw effects in the focus sources called scripted effects with parameter blocks (`zin_politics_set_stance = { STANCE = zin_dom_conquest }`, `zin_politics_add_drift = { IDEOLOGY = shadow VALUE = 5 }`). HOI4 scripted effects take no parameters (decision E1): the game read `STANCE` as an effect and the parser lost its place for the rest of the file.
- Fix: the five calls in `docs/design/focus/goldoroth.json`, `regional_blackton.json`, `regional_horidor.json` (two) and `regional_bloody_forest.json` are `call` effects with `args`; the compiler writes `set_temp_variable = { zin_arg_stance = <code> }` (or `zin_arg_ideology`, `zin_arg_value`) and `= yes`. The stance code is derived, not copied: `checks/focus_checks.mjs` `codesFor` builds the table from the stance order of `modules/ideologies.mjs`, the same order as `stanceCode` of the court modules. `zin_politics_set_stance` (pending, owner the politics module) is listed in `data/focus_registry.json`.
- Check: engine-forms rule `effect_arguments` (a ZIN scripted effect called with a block of uppercase keys); it found the Bloody Forest and Horidor drift calls that the profile had not named.
- Linux run must confirm: no `unexpected token` and no `Invalid effect 'STANCE'`/`'IDEOLOGY'` lines in those files.

## 8. Small groups

- `Multiple convoy types are not supported`: warfare defined `convoy_0` (Merchant Cog) and `convoy_1` (Ocean Cog). The game supports one convoy type (vanilla defines only `convoy_1`). Fix: one variant under the engine key `convoy_1`, the Merchant Cog, unlocked by Merchant Cogs (`data/warfare_equipment.json`, `data/technologies_warfare.json`); `data/warfare_ids.json` regenerated with `write_warfare_ids.mjs`. Check: rule `convoy_types`, `warfare.test.mjs`. **Simplification for the owner to review:** the Ocean Cog (80 strength, speed 13, Deep-Water Hulls) is gone; Deep-Water Hulls keeps its naval range bonus, and its text still speaks of ocean cogs. If the owner wants the ocean cog back, it can only be a technology bonus on the one convoy type.
- Rule-level `desc` in `common/game_rules/*.txt` (`zin_game_rules.txt`, `zin_dominion.txt`, `zin_west.txt`, `zin_eindil.txt`, `zin_leren.txt`, `zin_war_rules.txt`): the game reads `desc` only inside an option (vanilla `00_game_rules.txt` has none at rule level). Removed from the six writers (`rules.mjs`, `mech_crossing.mjs`, `mech_eindil.mjs`, `mech_lerendor.mjs`, `lib/mp_volgan_content.mjs`, `vanilla_removal.mjs`); the `<RULE>_DESC` localisation stays defined and unused for now. Check: rule `rule_desc`.
- `set_technology: Invalid tech` in country history: group 2.

## Also fixed (same files, outside the eight groups)

- `has_opinion_modifier = { target = ... modifier = ... }` is not a valid trigger (the trigger takes a modifier name only): the guards before `remove_opinion_modifier` in `zin_eindil_regard_opinion` (`mech_eindil_scripts.mjs`) and the Grey Ford feud (`mech_crossing.mjs`) are dropped, as removing an absent modifier does nothing. These were the `Invalid trigger 'target'`/`'modifier'` and the parser errors in `zin_eindil.txt` and `zin_west.txt`.

## Queued (reported by the build, not enforced)

The second pass (docs/plans/zin-errors/powder_and_pass2_handoff.md) fixed every item below, the recruit_character calls included (recruited in the home realm's history and moved with set_nationality); that file records each fix and the check that keeps it fixed.

- 92 `recruit_character` uses in in-game effects (group 5).
- Three `has_opinion_modifier` triggers with a target block, whose meaning needs the owner's choice: `zin_gunwaith_fought_beside` (`docs/design/focus/gunwaith.json`) and two AI modifiers of `events/zin_ending.txt` (crown events data). The trigger cannot test a target; a flag set with the opinion modifier is the likely replacement.
- Not addressed, seen in the same log: `Malformed token: zin_*_equipment` in `common/ai_strategy/zin_institutions.txt`, `Unexpected token: state_trigger` in `zin_dominion.txt` and `zin_mistake.txt` decisions, `Unknown modifier: slot` in `zin_afrit_traits.txt`, `any_country` used as an effect in `zin_afrit.txt` decisions, `Invalid effect 'trigger'` in `zin_mistake.txt`, airframe names in `script_enum_equipment_bonus_type`, and `Found no grid box for tech` in the technology view.

## Verification of this change

Built and tested on a clean worktree of `2a958b5a` with only these changes (other agents were editing the shared checkout at the time), a private TEMP and `ZIN_ART` at a snapshot whose `jobs/provenance.jsonl` is the committed `art/source/provenance.jsonl` (the session's older snapshot predates the accepted realm flag sheets, so the asset step failed on 16 flag provenance errors that are not part of this change).

- `node tools/content/build.mjs`: exit 0; engine forms 0 problems (reported: `recruit_character` in 92 in-game effects, `has_opinion_modifier` with a block in 3 places); C3 clean with the technology category.
- `cd tools && npm test`: 1,556 tests, 1,552 pass, 0 fail, 4 skipped (the skips are the existing ones), the two build-determinism tests included.
- `hoi4_script_validate` on the changed trigger and effect bodies: see groups 1 and 4; it checks syntax, command kind and declared scope only, and leaves argument blocks and the `var:` scope unchecked.
- Not verified: anything in the game. Every group above needs the next Linux run.
