# Story AI and the magic module

**Date:** 25 October 2026. **Agent:** the story AI and magic agent (subagent of the ZIN lead). **Branch:** `zin/integration-r3`.
**Scope:** the "not done" list of [framework_handoff.md](framework_handoff.md) section 8 and owner question 4 of [wiring_completion_handoff.md](wiring_completion_handoff.md): the AI strategy plans and paced MTTH of `docs/specs/03_gameplay/06_historical_path_and_ai.md`, the Gathering Dark's tier rules of `05_world_tension_and_endings.md`, the magic module of `04_magic_and_world_systems.md` (with `zin_world.45` and the two interventions), the relabelled world tension widget and step 10 of the world tick.
**Canon:** K1 to K50 of `docs/specs/INTEGRATION_DECISIONS.md`; voice `docs/specs/02_lore/09_voice_and_style.md`. No text names Afrit, Eindil, Zol or Kusven, and the Gods' Gift names no god.
**Disposition:** implemented with evidence; the open items are under "Simplifications, omissions and blockers". Everything the canon does not state is **proposed**: every event, decision, spirit and widget text, the plans' research and law weights, Bastian's letter, the fort weight and the reading of "a cause".

## 1. What was built

| Path | What it is |
| --- | --- |
| `tools/content/modules/story_ai.mjs`, `data/story_ai.json` | The story AI: plans, standing strategies, the paced MTTH, `zin_story_ai_month`, `zin_ui_refresh`, the widget labels |
| `tools/content/modules/world_magic.mjs`, `data/world_magic.json` | The world layer of magic and its weekly tick |
| `tools/content/write_storm_seas.mjs`, `data/storm_seas.json` | The storm belt computed from the map (sea regions 248 and 252 today, 20 coastal sea provinces) |
| `tools/content/story_ai.test.mjs` (10 tests), `world_magic.test.mjs` (12 tests) | Registered in `tools/package.json` |
| `tools/content/modules/rules.mjs` | One generated wrapper more per per-power rule: `zin_rules_ai_default_<power>` (the rule is DEFAULT) |
| `tools/content/modules/vanilla_removal.mjs` | Its `zin_mtth.txt` stub is written only when the story AI has not written the file |
| `tools/content/modules/events_mech_war.mjs`, `events_mech_war.test.mjs` | `data/events_mech_world.json` is deleted: `zin_world.45` lives in the magic module now (51 war events) |
| `tools/content/build.mjs` | `buildStoryAi` and `buildWorldMagic` run right before the world tension module; the summary line carries `story.ai` and `story.magic` |
| `data/pending_names.json`, `data/story_wiring.json` | The `magic_world` owner is gone (its five names are defined); a "magic and story AI" owner row for the new files |
| `docs/specs/04_mechanics/00_contract_additions.md`, `docs/zin_dynamic_effects.md`, `docs/design/alternate_history.{json,md}`, `docs/specs/03_gameplay/04_magic_and_world_systems.md` | Contract rows, effect documentation, two plan rows with their status, the spec's implementation status |

### 1.1 The story AI (06 spec, "How the AI follows or diverges")

- **Plans.** `common/ai_strategy_plans/zin_<tree>_historical.txt` for the 13 tier A trees (288 focuses in all) and `zin_<tree>_plausible.txt` (two plans each: the historical focuses x3 while `zin_path_divergence` is below 50, x1.5 from 50) for 11 of them. Each plan lists the tree's historical branch in `ai_national_focuses`, with research category and law weights (proposed) and `weight = 2` so it outranks the generic people plans of `forces.mjs`. The focus order is derived from the tree's own AI marks (`historicalOrder`): a focus is historical when a modifier under the historical path raises it, its prerequisites come with it, nothing the path rules out (weight 0) is listed, and only one side of a mutual exclusion stays. Lengths: Aenor 7, Lerendor 29, Volgan 9, Zol 19, the Worshipdom 63, the Magical Forest 32, Gala 11, Coldor 21, Noris 10, Stabilo 14, Gunwyn 40, Goldoroth 31, Mirolon 2.
- **Enable rules (no direct per-power rule test).** A power with a historical branch wrapper reads it (`zin_rules_ai_branch_afrit_historical`, `_cold_historical`, `_leren_historical`, `_west_historical`; Goldoroth `_goldoroth_independent` plus the path rule); a power whose rule has no historical branch reads `zin_rules_is_historical` and `zin_rules_ai_default_<power>` (Aenor, the elves, the East); Volgan and Zol read `zin_zol_ai_route_appointed`; Gala and Mirolon the path rule alone. The Worshipdom and Coldor get no plausible plan: their owners map PLAUSIBLE to the free branch (R6, the owner wins).
- **Standing strategies** (`common/ai_strategy/zin_path.txt`, 166 blocks): `zin_path_peace_<tag>` for every realm of the roster (`prepare_for_war` -50 while the Gathering Dark is below 25, unless the AI is at war with that realm or holds a war goal on it); `zin_path_dark_forts` (from 50, a realm bordering a dark power and not one itself: `build_building` `bunker` 50); `zin_path_grey_ford_gnw` and `_gir` (CP03: `conquer` -1000 between Gunwyn and Girdon while the truce is broken and the War of the Last Crowns has not begun); `zin_path_afrit_parim_<tag>` (CP24: the false god's realm, returned and alive, `conquer` 150 on whichever of Aenor, Gunwyn, Girdon, Selen, Kingson, Herez or Puvulan controls Parim). The other war checkpoints of the 06 table already have their owners' strategies (`zin_west`, `zin_east`, `zin_dominion`, `zin_mistake`, `zin_eindil`), so they are not repeated.
- **Peace after the false god** (`zin_story_ai_month`, called monthly by the magic tick): once `zin_afrit_dead` is set, every AI realm at war with his realm makes a white peace with it, once (`zin_story_ai_afrit_peace`).
- **Paced MTTH** (`common/mtth/zin_mtth.txt`, which replaces the vanilla-removal stub): `zin_story_mean_time` (365 days x 1.5 or 0.75 by `zin_story_pace`); `zin_story_ai_hist_share` and `zin_story_ai_alt_share` (HISTORICAL 100/0, PLAUSIBLE 75/25 then 60/40 at divergence 50, FREE 50/50); `zin_story_ai_focus_favour` (10, 3, 1.5, 1). They are the path's shares in one place for the owners to read through `mtth:`; no owner reads them yet.

### 1.2 The world tick's step 10

`zin_ui_refresh` (`common/scripted_effects/zin_ui.txt`) raises the panels' dirty tick (`zin_ui_tick`, country and global) and calls each staged panel refresh behind its owner's trigger: the Golden Court, the Hidden Council, the Presence, the Narrow Strait, the Southern Dominion and Mirolon's watch (six in the full build). The world tension module already calls whatever step-10 effect is staged, so the tick now runs `every_country = { limit = { is_ai = no } zin_ui_refresh = yes }` (build summary `uiStep: 1`). `zin_chr_count_unread` is not written: the Chronicle (`07_interface/04_chronicle_codex.md`) has no module yet, and the tick will call it the build after that module stages it.

### 1.3 The magic module (04 spec)

- **Potent magic** (`zin_has_potent_magic`): Glo carried by the worthy (`zin_glo_is_bearer_host`), Lorien's ride (the flag `zin_potent_magic`, set only by `zin_mistake.22`) and Varner's wards. A test proves no generated file sets the flag.
- **The interventions, once each.** `zin_world_raise_varners_wards` (`zin_varner_wards_raised`): the host (`global.zin_eindil_host`, else the caller) takes Varner's Wards for 90 days (organisation and defence +10%, potent); every other realm at war with Zol's Mistake on the host's side takes the Wizard's Shelter (defence +10%, organisation lost moving -10%, not potent) and `zin_world.40`. `zin_world_grant_new_gods_gift` (`zin_world_gods_gift_given`, because the journey sets `zin_eindil_restored` before the call): only while `zin_glo_state` is 1, the host takes the Gods' Gift for 365 days (organisation +5%, will to war +10%, attack +25% against Puvulan); the report `zin_world.45` (moved here unchanged) is fired by `zin_eindil.98`.
- **Dragons.** The pool `global.zin_dragons_free` starts at 6 and only falls. `zin_world_give_dragon` (argument `zin_arg_to`) takes one and calls warfare's `zin_war_grant_dragons`. The Dragon Pact (elven realms of the Magical Lands: the Keeper, or a realm the Keeper likes at 50 while the roost bond is 40; at war with a dark power or the eastern threat, or the Gathering Dark at 50; fewer than three Pacts; 150 Authority, 100 for a trusted Keeper). Bound by Corruption (the false god's realm after the reveal: the Keeper unguarded with three footholds, or two while the bond is below 30; fewer than two; 100 Authority and one foothold; +1 Gathering Dark; the elves' `zin_elves_on_dragon_corrupted` once; the news `zin_world.50`). Eindil's dragon is taken from the pool once when `zin_eindil_dragon_pact` is set. Dragon Mountain is the capital state of Yavieth; while a realm that is not elven owns it, the pool is frozen and the mountain hurts non-elven companies each month (`zin_world.56` once per owner).
- **The Great Wall.** The holder (most `zin_is_site_great_wall` states) may take the Wall Watch (25 Authority, 180 days of repairs: fort building +50%, cooldown 365). The Wall Unmanned (`zin_world.59`, at most every 90 days) and the Wall Is Breached (`zin_world.60`, once per war: +3 to the Gathering Dark and The Wall Has Fallen, stability -5% for 180 days, on the holder; the spec names Aenor, which is the holder on the historical map) are checked monthly.
- **The Ember Lands.** The weekly storm pulse damages fleets of realms outside the Ember Lands in the storm seas (strength 4%, organisation 10%; half with `zin_tech_storm_rigging`); `zin_world.65` warns a realm with a fleet once when it goes to war with a coastal Ember Lands realm; every realm outside the Ember Lands avoids the storm seas (`naval_avoid_region` 200). Storm-Girt Coasts (amphibious defence +50%) on the nine Ember Lands realms; the heat (enemy attrition +20%) on their 27 states, the deep heat (+40%) on the Nether realm's two states and the Abyss (state 298).
- **The weekly tick** (`zin_world_magic_tick`): one self-scheduling hidden event `zin_world.30` on one runner country (the world runners' list), guarded by `zin_world_tick_week`; an annexed runner hands it on (`zin_world.31`); every fourth week it runs the monthly steps. Never an every-country `on_weekly`.
- **A wizard: A Letter to Bastian** (proposed, `docs/lore/references/magic_and_wizards.md` 4.2 and 5.2): once per game a Middle Lands realm may write to Bastian; `zin_world.35` names his price (75 Authority to a wardens' hall) for a year of Bastian's Counsel (research +5%, stability +3%). The AI writes only once the Gathering Dark is at 50.
- **Spells** are the institutions slice's nine special projects (`08_institutions.md` section 10); nothing here makes a spell potent magic.

### 1.4 The world tension widget

`localisation/replace/zin_gathering_dark_l_<language>.yml` (ten languages, as the text sweep writes): `THREAT_WINDOW_NAME` "The Gathering Dark", `THREAT_TOOLTIP` "The Gathering Dark / The courts' alarm stands at ...", `WORLD_TENSION_NAME` "Gathering Dark", `WORLD_TENSION_WARS` "Wars Waged", `SORT_BY_TENSION`, `HINT_WORLD_TENSION`, `HINT_WORLD_TENSION_TEXT`, `_TEXT_2` and `BUTTON_HINT_WORLD_TENSION`. Each keeps its vanilla placeholders, colour and icon codes (text scan X9; test). The exact meter, its tier and its sources stay the Aoaz bar's (interface owner): a vanilla key cannot carry scripted localisation without breaking its signature.

## 2. MCP evidence

- **GUI** (`hoi4_gui_inspect`, `hoi4_gui_render`; session server, workspace `mod_zin_86bac5c64231`, revision `be74ca98…`): `world_tension_popup` inspected (470 elements, no missing sprite or key) and rendered at 1920x1080 before the change: "World Tension history", columns "World Tension" and "Current Wars". After the change the released 4.4.0 renderer (revision `c1f1a745…`, the file placed in the mod for the render and removed again) still drew the vanilla words: it does not apply `localisation/replace` over keys the installed game defines. The new labels were then rendered as element text values: "The Gathering Dark" and "Wars of the Living" wrapped onto two lines in the 100-pixel sort buttons (`sort_value_button text measures 84x32 inside 100x29`, `show_wars_button 68x32 inside 100x29`); the labels became "Gathering Dark" and "Wars Waged" and the re-render has no overflow (cropped image sha256 `1760f5be…`). The topbar tooltip is not rendered by the tool (hover text).
- **Probability** (released server 4.4.0 through `scratchpad/mcp_call.mjs`, workspace `zin`, snapshot sources under the ignored `.tmp/ai_magic_audit/`): no `PROBABILITY_GAME_VERSION_UNSUPPORTED`. `decision_ai_will_do`:

| Scenario | Dragon Pact | Corruption | Wall Watch | Bastian |
| --- | --- | --- | --- | --- |
| HISTORICAL, the Magical Forest at peace, dark 10 | not available, 0 | | | |
| HISTORICAL, the Magical Forest at war with a dark power, before Wings Over the Woods | 0 (the focus owns the Pact) | | | |
| FREE, Herrodon at war with a dark power, dark 80 | 200 | | | |
| FREE, Herrodon at peace, dark 80 | 100 | | | |
| pool empty / three Pacts made | not available | | | |
| the Worshipdom after the reveal, none bound, dark 40 | | 100 | 0 | 0 |
| one bound, not King of the East, dark 60 | | 0 | 0 | 2 |
| one bound, King of the East | | 100 | 0 | 2 |
| roosts guarded | | not available | | |
| Aenor holds the Wall, threatened, dark 55 | | | 100 | 2 |
| Aenor holds the Wall, quiet, dark 10 | | | 0 | 0 |

  `event_option_ai_chance` on `zin_world.35`: 0.70 / 0.30 with 150 Authority, 0 / 1.00 with 20. Unresolved: the Pact a year after Wings Over the Woods (the 4.4.0 adapter cannot take a completed focus as true; the weight is the same 100 or 200 as FREE by reading). `ai_strategy_factor` on `zin_path.txt` and on the plans: `no_weighted_surfaces` (strategy values and plan weights are fixed numbers, nothing to evaluate). The MTTH entries of `zin_mtth.txt` have no adapter; they are covered by `story_ai.test.mjs` only. No AI weight of another owner was changed, so no audit-patch-compare cycle applies.
- **Scripts** (`hoi4_script_validate`, installed documentation, country scope): the wall, storm, mountain and storm-warning bodies: syntax, command kinds and scopes supported (`damage_units`, `divisions_in_state` through `meta_trigger`, `is_controlled_by`, `has_navy_size`, `every_owned_state`); unresolved are the mod's own helpers, the `event_target:` scopes and ten argument blocks the documentation does not specify (`valid` null as the tool reports).

## 3. Build and tests

- `story_ai.test.mjs` (10) and `world_magic.test.mjs` (12), with `rules.test.mjs` and `events_mech_war.test.mjs`: 48 of 48 pass.
- First full build of this pass (before another agent's flag work reached the asset gate): exit 0, 7,134 staged files; `story.ai` 35 plans, 288 listed focuses, 166 strategies, 6 panel refreshes; `story.magic` 10 triggers, 9 effects, 6 ideas, 4 decisions, 10 events, 2 storm seas, 27 heated states, 3 deep-heat states; `story.world.uiStep` 1; story wiring `enforced: all; failures 0`. Suite of that run: 1,657 tests, 1,650 pass, 6 fail, 1 skipped; none of the six touches this pass (warfare's new `zin_zol_manifestation` equipment in the forces and warfare tests, `zin_west_fought_beside_` in the crown names register, the roster migration's dry run, and the determinism test's child build).
- Final run: section 7.

## 4. Icons and pictures

No new art. Decisions and the category use icon catalog pictures through `interface/zz_zin_world_magic.gfx`: `GFX_decision_zin_world_dragon_wing` (dragon_wing), `_dragon_mountain`, `_fort_wall`, `_wizard_tower`, `GFX_decision_category_zin_world_magic` (dragon_mountain). Spirits use `GFX_idea_zin_<key>` of the catalog (ward_circle, lantern_chain, new_gods_light, storm_sea, fort_wall, staff_arcane); the heat modifiers sun_veiled and abyss_stair. Events use existing pictures: generic_war (`.40`, `.59`, `.60`), war_king (`.45`), unmasking (`.50`, news), generic_wilds (`.56`), ember_lands_storm (`.65`), generic_court (`.35`). Own art for the dragon pact, the wall and Bastian is an art-pass item.

## 5. What only a Linux run can confirm

- That `zin_world.30` keeps its weekly chain over a long game and that `damage_units` with `region` hurts fleets in the storm belt (acceptance 4 of the 04 spec).
- That `set_temp_variable = { zin_w_id = THIS }` in state scope stores the state id that `meta_trigger` pastes into `divisions_in_state`.
- That `has_war_together_with = PREV` selects the host's allies for the shelter, and that `white_peace` from the AI realm's side ends only its war with the false god's realm.
- That the plans' `ai_national_focuses` and `focus_factors` steer the tier A AI as intended, and that `weight = 2` makes them the chosen plans over the people plans.
- That the relabelled keys show in the topbar tooltip and the popup in every language.

## 6. Simplifications, omissions and blockers

1. **Dragons are not yet delivered**: `zin_war_grant_dragons` is warfare's pending stand-in (inert), so a Pact or binding takes a dragon from the pool and grants nothing until the warfare module writes it. Warfare's report `zin_war.2` does not exist and is not fired.
2. **The Wall is inert** until the key-sites table defines `zin_is_site_great_wall` (a stand-in that is always false): no holder, so no Wall Watch, Unmanned or Breached.
3. **Dragon Mountain** is the roster's capital state of Yavieth (state id from the roster), not `zin_is_site_dragon_mountain`; switch when the key-sites table lands. The name table renames the site Thoriveniel as Yavieth's capital; the texts keep the vault's "Dragon Mountain" (owner question 4).
4. **The storm belt** is two sea regions on today's map. When `create_world` writes the new map, `world_magic.test.mjs` fails until `node tools/content/write_storm_seas.mjs` regenerates and someone reviews `data/storm_seas.json` (the spec's intent).
5. **Spec deviations, each deliberate:** the events sit in `events/zin_world_magic.txt`, not `events/zin_world.txt` (C6; the tension test keeps that file to 1 to 29); the weekly pulses run on one runner, not an every-country `on_weekly` (K34 and the brief); the decisions' AI is inline `ai_will_do`, not `common/mtth/zin_world_magic.txt`, so the probability tools read real weights; the elves' corruption hook is called by the decision, not by the news event's immediate block (a major news event's immediate may run once per receiver).
6. **Proxies:** the Wall Unmanned counts up to three companies per wall state; `zin_world.65` warns on going to war with a coastal Ember Lands realm with a fleet, not on a first loss (the game has no trigger for a fleet's sea region); "a cause" in the peace rule is a war goal (`has_wargoal_against`), not a claim; the fort rule's "+50%" is `build_building` `bunker` 50.
7. **Bastian** gets no advisor role: he is a roleless figure of the characters data and recruiting during play is queued in the second error pass (another agent's area); the letter gives a year's counsel spirit instead. Gektor's Errand (the reference's other wizard hook) is not written.
8. **Plans:** the focus orders are as long as the trees' historical marks allow (Aenor 7, Mirolon 2); the research and law weights are proposed; the Worshipdom and Coldor have no plausible plan (owner mapping).
9. **MTTH shares** are written but no owner reads them yet; owners keep their own option weights (R6).
10. **The widget tooltip** shows only the relabelled engine value; the tier, the change and the sources are the Aoaz bar's, which the interface module has not built. The renderer could not show the replace file (section 2).
11. **`zin_chr_count_unread`** waits for the Chronicle module (section 1.2).

## 7. Final build and suite

`scratchpad/verify.sh aimagic3` on the shared tree with every change of this pass: every step passes through the story wiring check (`enforced: all; failures 0`), the text scan (0 failing; the scan's one finding against this pass, "pilots" in `zin_world.65`, was fixed before this run) and the engine forms (0 problems); the build then stops at the asset gate on one error that is not this pass's: `PROV_UNREVIEWED art/source/flags/flags-sheet-09.png` (the waiting realm `UNW` of the concurrent late-characters work). Because the staged tree is not written, the suite reports 1,646 tests, 1,627 pass, 18 fail, 1 skipped: 16 failures read the missing staged tree (ENOENT), plus the crown names register (`zin_west_fought_beside_`, another agent's) and the roster migration's dry run (known). None of them names a file of this pass. Rerun the build once that flag sheet has its review line.

## 8. Owner questions

1. A Letter to Bastian: once per game, for a Middle Lands realm, 75 Authority to a wardens' hall for a year of Bastian's Counsel, and the AI writes only once the Gathering Dark is at 50. Is this how Bastian should enter play, or should he become an advisor (or stay out of play)?
2. The popup's column labels are "Gathering Dark" and "Wars Waged" because the buttons are narrow; the window title and tooltip say "The Gathering Dark". Acceptable?
3. The Worshipdom and Coldor keep their owners' mapping (PLAUSIBLE plays like FREE), so they get no plausible plan. Should they lean to history under PLAUSIBLE like the others?
4. Dragon Mountain: the texts say "Dragon Mountain" while the name table gives Yavieth's capital the name Thoriveniel. Which name should the dragon texts use?
5. Bound by Corruption takes one foothold from the Keeper and adds one to the Gathering Dark, as the spec says; should the Keeper be told when it happens (today only the elves' hook and the news tell)?

## Skills

Used: `hoi4-ai-strategies` (plans, strategy tokens), `hoi4-mtth` (the paced entries), `hoi4-events` (structure, pictures, timeouts, localisation), `hoi4-decisions-missions` (costs, custom cost text, tooltips, AI), `hoi4-scripted-gui` (inspect, render, the label defect found and fixed). No skill was created or updated; one reusable lesson for the skill maintainer: the 4.4.0 probability tools take a snapshot only from a workspace-relative path (an ignored `.tmp/` folder inside the mod works), and the GUI renderer does not apply `localisation/replace` over installed keys, so relabels are previewed with element `.text` values.
