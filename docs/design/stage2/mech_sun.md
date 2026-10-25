# Mechanic: the Lands of the Sun

Spec: `docs/specs/04_mechanics/lands_of_the_sun.md` (with `00_shared_contract.md`, `00_contract_additions.md` and `docs/specs/INTEGRATION_DECISIONS.md`, which wins where they differ).
Module: `tools/content/modules/mech_sun.mjs`, export `buildMechSun(staged, { countries, assignment?, data? })`.
Data: `tools/content/data/mech_regions_sun.json` (roster names, every number, every spirit row and every player-visible text).
Test: `tools/content/mech_sun.test.mjs`, 48 tests, all passing (`cd tools && node --test content/mech_sun.test.mjs`); it is not yet in the `npm test` script of `tools/package.json`.

## Build call

```js
const mechSun = await buildMechSun(staged, { countries, assignment });
```

`assignment` is the tag-to-people map that `build.mjs` builds from `docs/design/countries.csv` through `loadCountryTable`; without it the module falls back to `defaultPeople`.
The integrator wires the call in `tools/content/build.mjs` after the court, journey and power slices; the working tree already carries that line after `buildMechEast`.
It must run before `buildRules` reads the staged rule files (it writes none) and before the pending-trigger stand-ins are computed, so that the names it defines are not stubbed.
The build returns `{ files, text, definitions, dependencies, externalEvents, counts, tags }` and throws on a roster mismatch, a name missing from `countries.json`, an icon or picture outside the catalog, an unknown modifier key, a missing or unused text, or a banned word.

## Files written

| File | Content |
| --- | --- |
| `common/scripted_effects/zin_sun.txt` | 20 effects |
| `common/scripted_triggers/zin_sun.txt` | 17 triggers |
| `common/decisions/categories/zin_sun.txt` | 3 categories: `zin_sun_counsel`, `zin_sun_mirror`, `zin_sun_council` |
| `common/decisions/zin_sun.txt` | 10 decisions |
| `common/ideas/zin_sun.txt` | 11 spirits |
| `common/opinion_modifiers/zin_sun.txt` | `zin_opinion_warning_dismissed` (-5, decay 0.25) |
| `common/on_actions/zin_sun.txt` | `on_startup`, `on_monthly`, `on_declare_war`, `on_capitulation_immediate`, `on_state_control_changed` |
| `common/ai_strategy/zin_sun.txt` | `zin_sun_peaceful_realms`: 2 befriend and 47 conquer -100 entries |
| `events/zin_sun.txt` | 9 events: `.5`, `.6`, `.10`, `.20`, `.21`, `.30` (news), `.31`, `.35`, `.36` (hidden) |
| `localisation/english/zin_sun_l_english.yml` | 97 keys, UTF-8 with BOM |

The faction files are not written here (see "Spec conflicts and choices").

## Names it defines

- Effects: `zin_sun_add_gala_counsel`, `zin_sun_add_old_lords`, `zin_sun_add_concord`, `zin_sun_add_clarity`, `zin_sun_spend_clarity`, `zin_sun_startup`, `zin_sun_mirror_vision`, `zin_sun_send_warning`, `zin_sun_prophecy_fear`, `zin_sun_heed_warning`, `zin_sun_form_noon_league`, `zin_sun_lorien_rides`, `zin_sun_lorien_falls`, `zin_sun_refresh_foreign_hold`, `zin_sun_refresh_president`, `zin_sun_refresh_mirror`, `zin_sun_monthly`, `zin_sun_on_declare_war`, `zin_sun_on_capitulation`, `zin_sun_on_state_control`.
- Triggers: `zin_sun_is_lands_of_the_sun_country` (the 47 roster tags of scan "Sunhot"), `zin_sun_is_sunhot_realm`, `zin_sun_is_elven_realm`, `zin_sun_is_gala`, `zin_sun_mirror_available`, `zin_sun_league_needed`, `zin_sun_is_runner`, `zin_sun_lorien_leads`, `zin_sun_counsel_grows`, `zin_sun_sight_true_north`, `_south`, `_seas`, `_east`, `_centre`, `zin_sun_has_warnable_sight`, `zin_sun_has_any_sight`, `zin_sun_has_heeded_any`.
- Decisions: `zin_sun_audience` (25 PP, 120 days), `zin_sun_ask_timber` (needs 40 counsel, spends 20), `zin_sun_ask_sun_guard` (needs 60, spends 30), `zin_sun_speak_quarrel` (*Speak for a Sunhot Quarrel*, flag `zin_gala_mediator`, spends 10), `zin_sun_look_mirror` (50 PP, 180 days), `zin_sun_send_word`, `zin_sun_send_word_half`, `zin_sun_send_word_free` (50, 25 and 0 PP), `zin_sun_old_lords` (75 PP, 365 days), `zin_sun_raise_league` (50 PP).
- Spirits: `zin_sun_council_timber`, `zin_sun_heeded_north`, `_south`, `_seas`, `_east`, `zin_sun_kings_ride`, `zin_sun_old_powers_stand_1`, `_2`, `_3`, `zin_sun_king_fallen`, `zin_sun_mourning`.
- Variables: `zin_gala_counsel`, `zin_gala_old_lords`, `zin_sun_last_sight` (Gala Elves); `global.zin_sun_concord`, `global.zin_mirror_clarity`, `global.zin_sun_league_peace_days`; `zin_sun_warned_sight` (warned country); temporary `zin_arg_value`, `zin_arg_target`, `zin_arg_sight` (decision E1, sight codes north 1, south 2, seas 3, east 4, centre 5, any 0), `zin_sun_seen`, `zin_sun_pick`, `zin_sun_cost`, `zin_sun_regain`, `zin_sun_stand_days`, `zin_sun_mid_states`.
- Global flags: `zin_sun_started`, `zin_sun_noon_council`, `zin_sun_noon_league`, `zin_sun_concord_rallied`, `zin_sun_foreign_hold`, `zin_mirror_stilled`, `zin_lorien_rides`, `zin_lorien_dead` (contract flag; set only by `zin_sun_lorien_falls`).
- Country flags: `zin_sun_council_president`, `zin_sun_sight_<sight>` (730 days), `zin_sun_heeded_<sight>` (730 days), `zin_sun_warned_aenor`.

## Names it uses that other owners must define

Not defined by any module yet:

| Name | Kind | Owner and spec |
| --- | --- | --- |
| `zin_world_add_gathering_dark`, `global.zin_gathering_dark` | effect, variable | world systems module; `docs/specs/03_gameplay/05_world_tension_and_endings.md` |
| `zin_diplo_lift_refusal` | effect | diplomacy gameplay effects; `docs/specs/03_gameplay/03_diplomacy_and_factions.md` (`zin_refusal_lifted` itself is already read by `diplomacy.mjs`) |
| `zin_is_site_gala`, `zin_is_region_lands_of_the_sun`, `zin_is_region_middle_lands` | state triggers | key-sites table `tools/content/modules/sites.mjs` (decision E7); `docs/specs/01_map/02_key_sites.md` |
| `zin_lorien` | character | characters module; `docs/specs/02_lore/02_characters.md` (the game still has the generated ruler `<Gala Elves>_zin_ruler`) |
| `zin_sun.40`, `zin_sun.42` | events | the war events owner; `docs/specs/06_events/03_war_of_the_last_crowns.md` (texts as `lands_of_the_sun.md` section 7) |
| `zin_gala_still_water_spirit`, `zin_gala_gala_endures_spirit` | spirits | Gala tree through the focus compiler; `docs/specs/05_focus_trees/major/gala.md`, data `docs/design/focus/gala.json` |
| `zin_gala_audiences`, `zin_gala_mirror_open`, `zin_gala_true_traces`, `zin_gala_cautious_seers`, `zin_gala_share_sight`, `zin_gala_kings_warning`, `zin_gala_mediator`, `zin_gala_courtyard_guarded`, `zin_gala_ready_to_ride` | country flags | Gala tree (all nine are in `gala.json`) |

Already defined by their owners:

| Name | Owner |
| --- | --- |
| `zin_elves_goodwill` | `modules/mech_elves.mjs` (`elves_wall_and_dragons.md`) |
| `zin_afrit_add_veil`, `zin_afrit_regicide_ready` | `modules/mech_afrit.mjs` and `lib/mech_afrit_script.mjs` (`afrit_hidden_council.md`) |
| `zin_rules_is_historical`, `zin_rules_is_free` | `modules/rules.mjs` (`00_foundation/05_defines_and_rules.md`) |
| `zin_faction_noon_league`, `zin_faction_rule_join_sun_realms` | `modules/diplomacy.mjs`, data `data/diplomacy.json` (`noon_league`, `sun_realms`) |
| `zin_mistake_power`, `zin_zol_rising` | `modules/mech_zol.mjs` (`zols_mistake.md`) |
| `zin_dominion_strength` | `modules/mech_volgan.mjs` (`volgan_southern_dominion.md`) |
| `global.zin_west_resolve` | `modules/mech_crossing.mjs` (`western_crossing.md`) |
| `zin_council_influence`, `zin_golden_king_dead` | `modules/mech_aenor.mjs` and `lib/mech_aenor_script.mjs` (`aenor_court_and_succession.md`) |
| `zin_aurevan_crowned` | `lib/mech_afrit_script.mjs` |
| `zin_war_of_last_crowns` | Aenor and the world events |
| `zin_east_rift_talk` | `modules/mech_east.mjs` (`eastern_kings.md`) |
| `global.zin_eindil_host` | the journey (`modules/mech_eindil_scripts.mjs`) |
| `zin_people_elves`, `zin_people_sun_elves` | `modules/peoples.mjs` (start flags) |
| `zin_region_islands_of_the_south` | `modules/economy.mjs` (start flags) |
| `zin_story_war` | the war gate shared with `mech_crossing.mjs` and `mech_east.mjs` (diplomacy spec) |

## Events it fires but does not define

- `zin_sun.40` "The Old Lords Ride" (news to every country, picture `vast_shadow` gated on `zin_zol_manifested`), fired by `zin_sun_lorien_rides`.
- `zin_sun.42` "After the King" (Gala Elves, 14 days after the fall; three stewards: `zin_gala_caleon`, `zin_gala_sulestien`, a council leader; each sets `zin_gala_steward_chosen`), fired by `zin_sun_lorien_falls`.
- `zin_sun.43` is never defined or fired (decision O4: Lorien's death news is the Zol spec's `zin_mistake.23`).

The callers that this slice expects: Zol's `zin_mistake.22` option A calls `zin_sun_lorien_rides`; Zol's `zin_mistake.23` calls `zin_sun_lorien_falls` before `zin_zol_withdraw`; the journey's `zin_eindil.52` calls `zin_sun_spend_clarity` with 30; the Gala and Sunhot trees call the adders, `zin_sun_mirror_vision` and `zin_sun_form_noon_league`.

## Completed in this pass

The module had been stopped mid-work; this pass found and completed the following against the spec.

- Asks (section 3): *Ask the Noon Council for Timber and Ships* needed only the 20 it spends and *Ask the Sun Guard* only its 30; they now need 40 and 60 counsel (`zin_sun_need_counsel_40` and `_60` requirement lines) and still spend 20 and 30.
- *Speak for a Sunhot Quarrel* (section 3): the Elvana and Igara pair the spec names was resolved but never used; Elvana and Igara are now always a valid pair, besides any two Sunhot realms with negative opinion.
- *Send Word of the Vision* (section 5): the full-price decision showed beside the discounted one when only one Gala flag was set; exactly one of the three prices now shows for each flag combination.
  The decisions no longer require `zin_gala_mirror_open` (the spec needs only a seen sight); the Worshipdom is excluded by AI weight only (spec AI section); the warning is sent once to Aenor by the AI (`zin_sun_warned_aenor`); `zin_sun_send_warning` honours its `sight` argument (it ignored it).
- AI heeding (section 5): the weights did not sum to 100 and left out the other elven realms; heed is now 10 + opinion / 2 (steps of 20), +30 for Selen, Mirolon, Kingson, Hiloron (Hirolon), the Magical Forest and every elven realm, Aenor's court 10 before the Golden King's death and 0 once Aurevan is crowned, and the dismissal is 100 minus heed.
- AI joining (section 4): join is 40 + concord / 2 and *Keep apart* the rest of 100 (it summed to more than 100).
- *Gala Asks the Sun Guard* (`.6`): AI 80, 10 when the president is at war or its opinion of the Gala Elves is below 0, with the refusal the rest of 100; the guarantee names the Gala Elves' tag.
- Counsel (section 3): the monthly gain resumes after Lorien's death once *Gala Endures* has been taken (`zin_sun_counsel_grows`); *Lorien leads* now means the ruling leader.
- The League (section 4): *Raise the Noon League* requires the presidency; the AI never raises it on the historical path (Acceptance 7, `zin_rules_is_historical`).
- The concord rally (section 4) now also fires when the Gala site itself is taken, and a foreign hold sets `zin_sun_foreign_hold` at once instead of waiting for the monthly refresh.
- Exile (section 6): the host is never the conqueror itself or a capitulated realm, and the Magical Forest is used only if it exists.
- The runner: when the Lands of Light fell between two runs, nobody held the presidency and the monthly runner stopped for good; the first Sunhot realm now runs once and hands the presidency on.
- The Mirror category was hidden while the Mirror was stilled, which also hid the warnings and *Send Word to the Old Lords*; it is always shown to the Gala Elves, and *Look Into the Mirror* keeps its own gate.
- `zin_sun.36` used the scope `CONTROLLER`; it uses `controller`.
- Magic numbers moved into the data file: the spirit rows (`ideas`), the Old Powers tiers, the League's monthly peace step, the opinion modifier, the old lords' maximum and every AI weight.
- Text: the counsel category no longer says that Lorien "outlived four ages" (no age is stated, owner decision K18); *Gala Asks the Sun Guard* no longer says "not as kin and not as subjects" (the bond of the two peoples stays open).

## Spec conflicts and choices

- Names: the spec's Implementation names `mech_lands_of_the_sun.mjs`, `buildLandsOfTheSun(staged, countries, assignment)`, `data/mechanics/lands_of_the_sun.json` and `mech_lands_of_the_sun.test.mjs`; the brief's `mech_sun.mjs`, `buildMechSun(staged, { countries, assignment })`, `mech_regions_sun.json` and `mech_sun.test.mjs` are used.
- Faction files: the spec has this module write `common/factions/templates/zin_sun.txt` and `common/factions/rules/zin_sun.txt`; `diplomacy.mjs` already writes the template `zin_faction_noon_league` and the joining rule `zin_faction_rule_join_sun_realms` from `data/diplomacy.json`, so this module only calls them.
  The integrator should check that the diplomacy template is script-only (`visible = { always = no }`, `can_leader_join_other_factions = no`) as the spec asks.
- `zin_sun.40` and `zin_sun.42`: the spec puts them in this namespace and its events table; the brief assigns their definition to the war events owner, and owner decision K4 holds back new manifestation content, so they are fired here and written there.
- The presidency flag is set on the Lands of Light at the start too (the spec sets it only once the Lands of Light is gone), so the trees read one flag in every case.
- `zin_sun_league_needed` reads the flag `zin_sun_foreign_hold` (set at once on a control change, recomputed monthly) instead of scanning every state each time a trigger is read.
- *Send Word of the Vision* is three decisions because a decision cost takes no variable; each has a per-target cooldown of 365 days, which the spec does not give (it stops the same warning being sent again and again).
  "FREE lets Gala warn more often" is a factor of 1.5 on the decision's AI (the number is this module's proposal).
- AI weights in steps (opinion steps of 20, concord steps of 20): `ai_chance` takes no variable.
- The AI keeps a reserve of 15 counsel above an ask's need before it asks.
- No story date: the spec has no dated beat of its own (4A 1752 is the journey's, 4A 1757 Zol's), so the slice writes no date trigger; the test fails on any fixed `date >` or `date <` outside a three-pace story-date trigger.
- `zin_rule_ai_elves` is not read: nothing in this spec maps to its `MARCH` option, and the Refusal is the diplomacy and elves modules'.
- Pictures: the flavour spec (`06_events/05_flavour_and_world.md`) reserves `gala_court` for `zin_lore.7`, while this spec uses it for `.5`, `.6`, `.10`, `.20` and `.21` (its own fallback until `mirror_courtyard` exists); the module follows this spec.
- The shared vocabulary check `lib/mp_check.mjs` does not list `has_country_leader` as a parameter block; the test flattens that block before the check and checks the trigger itself against the documentation.
  Adding `has_country_leader` to the `PARAMS` set of `mp_check.mjs` (outside this slice) would remove the need.

## Art it needs

- Event picture `mirror_courtyard` (requested in the icon catalog, no art): `zin_sun.10` and `zin_sun.20` use `gala_court` until it exists.
- Event picture `king_fallen_gala` (requested, no art) for `zin_sun.42`, which its event owner writes; until then the spec names `gala_court`.
- Decisions and categories use idea icons of the catalog (`GFX_idea_zin_envoy`, `timber_mill`, `pass_fort`, `olive_branch`, `mirror_rain`, `scroll_sealed`, `forest_ancient`, `banner_league`, `gala_sun`, `concord_circle`); there are no dedicated `GFX_decision_zin_sun_*` sprites and no category pictures.
- Every spirit icon the spec names exists in the catalog (`timber_mill`, `beacon`, `fort_wall`, `lighthouse`, `eye_watchful`, `gala_sun`, `forest_ancient`, `banner_laid_down`, `tree_silver`).

## Zol correction footprint

The slice never reads `zin_zol_manifested` and no text of it names Zol (the test asserts both).
These names belong to Lorien's ride against the manifested Old God and change when the Great Spirit's identity (owner question Q-03, decisions K4 and K11) is settled:

- `common/scripted_effects/zin_sun.txt`: `zin_sun_lorien_rides` (called by Zol's `zin_mistake.22` option A; sets `zin_lorien_rides`; `add_to_war` or `declare_war_on` against the Zol tag; `zin_sun_kings_ride`; `zin_sun_old_powers_stand_1` to `_3` for every country at war with Zol; fires `zin_sun.40`) and `zin_sun_lorien_falls` (called by `zin_mistake.23` "Lorien Challenges Zol"; sets `zin_lorien_dead`; `zin_sun_king_fallen`, `zin_sun_mourning`; fires `zin_sun.42`).
- `common/ideas/zin_sun.txt`: `zin_sun_kings_ride`, `zin_sun_old_powers_stand_1`, `_2`, `_3`, `zin_sun_king_fallen`, `zin_sun_mourning`.
- Global flags `zin_lorien_rides` (also read by `zin_sun_on_capitulation`) and `zin_lorien_dead`.
- Text keys `zin_sun_kings_ride(_desc)`, `zin_sun_old_powers_stand_1` to `_3(_desc)` (`_3_desc` speaks of "an Old God's victory"), `zin_sun_king_fallen(_desc)`, `zin_sun_mourning(_desc)`.
- Data numbers `kings_ride_days`, `stand_days_base`, `stand_days_per_lord`, `stand_days_max`, `stand_tiers`, `king_fallen_days`, `mourning_days`, `after_king_days`, `concord_mourning`.
- External events `zin_sun.40` (picture gated on `zin_zol_manifested` in the spec) and `zin_sun.42`.
- Not manifestation, but tied to Zol: the north sight reads Zol's `zin_mistake_power`, and *Send Word to the Old Lords* opens on `zin_zol_rising`.

## Every-country loops and rule findings

- `common/on_actions/zin_sun.txt` has an `on_monthly` block, which the engine runs for every country; the spec asks for it ("`on_monthly` (`zin_sun_monthly` in the runner's scope)").
  Its body runs once a month, behind `zin_sun_is_runner` (the Gala Elves, else the Council's president), but the runner test is evaluated for every country every month.
  This pass added no further every-country hook; moving the runner into the world monthly tick (decision R5) or onto `on_monthly_<Gala Elves tag>` with a president fallback would end the every-country evaluation, and is left to the integrator and the owner.
- Inside the runner, `zin_sun_refresh_foreign_hold` and `zin_sun_refresh_mirror` scan every state and `zin_sun_refresh_president` loops over every country once a month.
- `common/on_actions/zin_sun.txt` also hooks `on_declare_war`, `on_capitulation_immediate` and `on_state_control_changed`; these are event hooks, not periodic loops.
- No `<=` or `>=`, no direct `has_game_rule` (the AI reads `zin_rules_is_historical` and `zin_rules_is_free`), no fixed date.

## Open items

- Add `content/mech_sun.test.mjs` to the `npm test` script in `tools/package.json` (integrator).
- The Linux and scenario acceptance checks of the spec (Acceptance 5 to 11) have not been run; the evidence is the 48 offline tests, including the vocabulary check against the installed effect, trigger and modifier documentation.
- The HOI4 Agent Tools routes (`hoi4_event_inspect`, `hoi4_probability_inspect`, `hoi4_script_validate`) were not used in this pass; the AI weights were checked by the test's own evaluator (heed and dismiss, join and keep apart, watch and refuse each sum to 100 in the tested scenarios).
- `zin_sun_monthly` may run twice in the one month in which a lost presidency is handed on (the new president can run again in the same pulse).
- The interface row for the Gala Elves in the Aoaz bar (Counsel, Clarity, Old Lords) is the interface spec's; it only reads `zin_gala_counsel`, `global.zin_mirror_clarity` and `zin_gala_old_lords`.
