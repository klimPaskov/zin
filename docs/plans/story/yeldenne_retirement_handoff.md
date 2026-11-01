# Yeldenne retirement handoff (K56)

**Decision.** Owner decision K56 (`docs/specs/INTEGRATION_DECISIONS.md`, 25 October 2026): Yeldenne is a small town, not a country or a state. The realm Yeldenne (YEL) is retired. The town and the Castle of Yeldenne lie in Pertolor's land as named places. Horos is story only and never a character.

**Result.** The roster has 155 realms. The Y8H migration row now merges into Pertolor (PRT). The castle's state, id 1063 (old capital of Yeldenne, Y8H), is owned by Pertolor. The migration dry run reports zero changes. The focus, character, history and mechanic surfaces named below are updated.

## Changes, by surface

**Roster and migration**
- `tools/content/data/world/roster.json`: the Yeldenne realm entry is removed (155 realms). The Y8H migration row changes from `kept` into `yeldenne` to `merged` into `pertolor` (newTag PRT), with the K56 reason.
- `tools/content/data/world/state_assignment.json`: regenerated with `node tools/migrations/roster_state_assignment.mjs --apply`. State 1063 moves from YEL to PRT (rule `merged`). The file is written with LF line endings, as the generator writes it.
- `tools/content/data/forces_geography.json`: regenerated with `node tools/content/write_forces_geography.mjs`. Only the YEL key is gone and PRT gains 1063.
- `tools/content/data/world/demography.json`: the Castle of Yeldenne entry's country is now Pertolor.
- `tools/migrations/roster_migration.mjs --apply` (run once after the Y8H change) rewrote four country references to Pertolor: `docs/design/focus/coldor.json` (three focuses: a non-aggression pact, an event target, an exists check and a guarantee), `docs/design/focus/regional_yeti_lands.json` (one non-aggression), `docs/design/focus/shared_cold_lands.json` (one non-aggression). One further match, the journey stage name in `tools/content/data/mech_journey_eindil.json`, was a place, so it now reads "Castle of Yeldenne". The dry run is clean again.

**Characters and portraits**
- `tools/content/data/world/characters/cold_lands.json`: the Yeldenne block is removed. Horos (`zin_horos`, ruler) and the Warden of Mp'E (`zin_yeldenne_warden`, figure) are retired. Five valley people move to Pertolor's `advisors` and `commanders` arrays under their existing ids: `zin_regional_yeldenne_aldek` (Headman of Simoto), `..._alddok` (Bearer of the Loaf), `..._ezhkar` (Captain of the Valley Bows), `..._stenulv` (Watcher of the Ormolak Road), `..._zenvar` (Keeper of the Charcoal Yards). Their ids keep the old prefix; renaming them would touch the portrait pools and the icon registry, so it is left for the owner.
- Recruitment: the five are recruited through Pertolor's court, which the characters module writes into Pertolor's history. The lead's rule (recruited in an existing realm's history, enters play by role) is met by that path. I did not run the staged history check; see risks.
- `tools/content/data/world/portrait_pools.json` and `portrait_pools.base.json`: the five pool entries are retagged `PRT`. The warden and Horos pool references are removed (both pools keep `characters: []`). The Horos pending-portrait entry (Q-32) is removed.
- Retired characters, for the record: Horos (`zin_horos`) and the Warden of Mp'E (`zin_yeldenne_warden`) are not carried anywhere else.

**History**
- `tools/content/data/world/history/cold_lands.json`: the Yeldenne country block is removed. The founding story, the dynasty of the headmen, the three events (The First Loaf, The Warlord's Climb, The Southern Pilgrims) and the two divergences (`yel_warden_calls` and `yel_bread_broken`, renamed `prt_mp_warden_calls` and `prt_mp_bread_broken`) move into Pertolor's entry. Pertolor's `today` gains one sentence placing the valley of Mp'E, Simoto and the castle in the lordship. The `prt_due_unpaid` consequence now reads "the town of Simoto shuts its doors". Simoto's city entry is Pertolor's; the loaf custom's realm is Pertolor.

**Glo mechanic** (kept, rehomed; see decision D1 below)
- `tools/content/modules/mech_yeldenne.mjs`: the hall is `data.hallState` (1063) instead of the Yeldenne capital. Every country-tag use of Yeldenne is replaced by a hall-owner scope (`hallOwner(...)`) or by `TAG.keeper`. Removed: the warden install effect, the `zin_glo_request_northern_watch` effect (used only by the retired focus tree), the seal-keeper idea removal, the regional wards idea removals, the Horos character retirement, the `zin_horos_guardian` trait on the startup event, the Warden character file, and the Yeldenne leader-trait file (no leader traits remain). Startup, the hall-falls effect, the event 64 options and the guard decision all now target the hall owner. The AI strategy (`zin_glo_leave_the_hall_alone`) and the annex check now target `TAG.keeper` (Pertolor).
- `tools/content/data/mech_journey_glo.json`: `countries` gains `keeper: Pertolor` (the `yeldenne` key is removed); `hallState: 1063` is added; `characters` is empty; the two Yeldenne country-leader traits (`zin_horos_guardian`, `zin_yeldenne_warden_trait`) are removed.
- `tools/content/modules/historical_path.mjs`: the hall-holder step uses `T.keeper` (Pertolor) and `T.hallState` (read from the Glo data file).
- `tools/content/modules/mech_eindil_scripts.mjs`: the three flags `zin_yeldenne_beacon`, `zin_yeldenne_coast_watch`, `zin_yeldenne_guides` now have no setter (see risks).

**Cold Lands**
- `tools/content/modules/mech_cold.mjs`: the Yeldenne constant is `KEEPER = tag('Pertolor')`. Yeldenne is removed from the clan-realm exclusion (Pertolor, which already held the default lean, is now an ordinary clan realm). The hall-guard guarantee check uses KEEPER. The `tags.yeldenne` output key becomes `keeper`.
- `tools/content/data/mech_regions_cold.json`: `expectedCountries` 20 becomes 19; Yeldenne is removed from the core list and Pertolor is added to it (the cold module resolves tags from `core`).

**Realm life, institutions, Afrit, forces, warfare, cultures, languages, tech packages, events**
- `tools/content/data/realm_life.json` and `tools/content/modules/realm_life.mjs`: Yeldenne is removed from story rulers (characters, traits, realms), historical courts, the story-war-side list and the story-ruler note. Horos is no story character.
- `tools/content/data/institutions.json`: Yeldenne is removed from tier B and from `noValour`.
- `tools/content/data/mech_afrit.json`: Yeldenne is removed from the zero-foothold list; the cold-lands foothold row loses its `notName` filter.
- `tools/content/modules/countries.mjs`: Yeldenne's stance entry is removed.
- `tools/content/data/forces_templates.json` and `warfare_ids.json` (two entries each for the ice-clans host): Yeldenne is removed.
- `tools/content/data/world/cultures.json`: Yeldenne's entry is removed from the ice-clans country list (Pertolor is already there).
- `tools/content/data/world/languages.json`: Yeldenne's kind is `town` (was `country`).
- `tools/content/data/technologies_packages.json`: the named map entry for Yeldenne is removed.
- `tools/content/data/events_world_lore_1.json`: the lore opener event 15 ("The Year 1748", a human start for Yeldenne) is removed. The scheduler and the events test count are updated to fourteen openers.
- `tools/content/data/events_crown_hooks.json` and `events_crown_reign1.json`: Yeldenne is removed from the exclusion lists and recipient lists.

**Focus**
- `docs/design/focus/regional_yeldenne.json` is deleted (36 focuses, 8 spirits, 9 events). `git show HEAD:docs/design/focus/regional_yeldenne.json` restores it. Its focus keys: the_long_watch, wake_the_wards, the_blue_sword, the_frozen_gate, glernaens_old_protections, the_hall_of_pillars, the_unyielding_hall, the_wardens_of_mpe, herds_of_the_frozen_north, the_tithe_roads, envoys_to_fandanar, the_tribes_of_the_ice, the_yeti_compact, watchers_on_the_coast, petition_the_lost_cause, the_judgment_seat, the_roll_of_the_rejected, eyes_in_the_south, the_guardian_endures, signs_among_the_pilgrims, rumours_of_the_ice, await_the_worthy, light_the_shore_beacon, send_guides_to_the_landing, the_hall_falls_silent, ride_after_the_bearer, the_wardens_ride_south, banners_of_mpe, the_swords_oath, keep_the_empty_hall, the_frozen_fortress, the_last_record, seal_the_hall, deny_the_dark, open_for_the_heir, seek_a_second_bearer. Its spirits: glernaens_wards, glernaens_wards_2, wardens, roll_of_the_rejected, eyes_in_the_south_spirit, wardens_host, frozen_fortress, seal_keepers.
- `tools/content/data/focus_registry_regional_d.json`: 17 trees; `zin_glo_request_northern_watch` and `zin_yeldenne_add_wards` are removed from the name list.
- Focus totals: 17 regional_d trees in the test; the build totals are 564 focuses, 145 spirits and 45 events in the regional tests.

**Docs**
- `docs/specs/04_mechanics/yeldenne_and_glo.md` and `docs/specs/05_focus_trees/regional/yeldenne.md`: a retirement note at the top. The rest of each spec still describes the realm and needs the owner's rewrite; it is marked, not rewritten.
- `docs/plans/zin-lead/TRACKER.md`: the roster row, the focus-trees row (98 trees, 4,763 focuses) and the characters row (1,140) are updated.

## Tests changed

Every change makes the test describe the retirement, and none removes coverage without a replacement assertion.
- `tools/content/roster.test.mjs`: 156 becomes 155 realms (two places), the character-id count 1142 becomes 1140 with the reason in a comment, and a new assertion that no YEL tag remains.
- `tools/content/realm_life.test.mjs`: Horos is removed from the story-ruler list, with an assertion that he is not a story character.
- `tools/content/institutions.test.mjs`: the Yeldenne valour row assertion becomes "no row".
- `tools/content/forces.test.mjs`: the Yeldenne start, tier and division assertions become retirement assertions (no entry, no order-of-battle file, not in tier B, no division count).
- `tools/content/mech_cold.test.mjs`: `YEL` becomes `KEEP` (Pertolor); the lean counts become expectedCountries minus 2; the clan trigger assertion now asserts Pertolor is not excluded.
- `tools/content/mech_journey.test.mjs`: the Yeldenne tag constant is removed; the falls and startup assertions check the hall state and the keeper; "no install_warden, no retire_character".
- `tools/content/focus_regional_d.test.mjs`: the Yeldenne spec row and its set and assertions are removed; 18 trees become 17; the totals become [564, 145, 45] and the unique-id count is exact; the Deliverer test asserts no regional text names the Deliverer; the ward-score test is replaced by a retirement test.
- `tools/content/events_world.test.mjs`: the lore id range loses 15, the lore total becomes 126, the opener count becomes fourteen, and the Yeldenne opener and its loc check are removed.
- `tools/content/mech_court.test.mjs`: Yeldenne is removed from the zero-foothold list.

## Decisions for the owner

- **D1 Glo keeper.** The Glo mechanic is kept, not deleted. Deleting the module would cut Glo out of the Eindil journey (`mech_eindil_scripts.mjs`, `historical_path.mjs`, `world_magic.mjs`, `mech_zol_script.mjs`), the Afrit council, the Zol script and the UI. The vault keeps Glo as canon, and K56 keeps the castle as a place. The keeper is now the owner of the castle's state (Pertolor). This is a design choice the owner should confirm.
- **D2 Lore opener.** The 1748 opener for Yeldenne is removed. A Pertolor opener would be a new design decision.
- **D3 Horos's name.** The Horos character and the Warden are removed; the warden's text in the hall events ("the Warden's steward", "a rider from Mp'E brings the Warden's word") is narrative and remains.
- **D4 Ai conquer block.** `zin_glo_leave_the_hall_alone` now blocks AI conquest of Pertolor (the hall keeper) while Horos lives, where it used to block Yeldenne. It is a balance-relevant change.

## Remaining risks and open items

- **Flags with no setter.** `zin_yeldenne_beacon`, `zin_yeldenne_coast_watch` and `zin_yeldenne_guides` were set only by the retired tree. The Eindil ambush-strength subtractions and the landing-guide branch no longer fire. A Pertolor or shared route needs to set them, or the owner accepts the loss. This is a gameplay change.
- **Focus trees that reference the hall.** `coldor.json`, `regional_yeti_lands.json` and `shared_cold_lands.json` now name Pertolor. Their text still reads "Castle of Yeldenne" as a place. The focus compiler resolves the names; the regional and shared tests passed.
- **Recruitment check not run on the staged history.** The five valley people are recruited through Pertolor's characters block. I did not inspect Pertolor's staged history file. The owner's rule requires it.
- **Mod-root generated outputs.** The mod root still holds generated files that name Yeldenne (for example `localisation/english/zin_focus_regional_yeldenne_l_english.yml`, `common/national_focus/zin_regional_yeldenne.txt`, the state and tag files). They regenerate when the parent runs the build and apply step. I did not run the apply step.
- **UI lane files (not touched, per the constraint).** `tools/content/data/ui/icon_registry.json` (about 66 Yeldenne focus, spirit and event rows), `tools/content/data/ui/icon_shares.json` (two focus rows). They name retired ids; the icon-registry checks may flag them.
- **Flag and heraldry files (not touched).** `tools/content/data/flags-cells.json` (Yeldenne cell), `tools/content/data/world/heraldry.json`, `tools/content/heraldry/*` (the generator already excludes YEL; `k68_designs.mjs` keeps a retired comment). The flag agent owns them.
- **Geography import (not touched).** `tools/content/data/geography/import/aoaz.geography.json` (site `site_yeldenne_landing` has `"country": "YEL"`) and `name_table.json` mention YEL as a source field. Those are import records, not runtime; left as they are.
- **Docs not rewritten.** `docs/design/stage2/focus_regional_d.md`, `docs/design/stage2/mech_journey.md`, `docs/design/stage2/mech_cold.md`, `docs/design/validation/asset_baseline.json`, the plans under `docs/plans/zin-art/`, and most of the two specs' bodies.
- **Character ids keep the old prefix** (`zin_regional_yeldenne_*`). Renaming is an owner-level decision.
- **Baseline failures.** The build was already failing before my changes (in `mech_kit`, with `zin_horde_sway_row`, and in `mech_dark_panels`), in other lanes' uncommitted work. The suite had 26 failing tests before my changes. See the verify result below for the difference.

## Verify

`verify.sh yel` (after the last source edits, the full suite ran 1,695 tests: 1,672 pass, 21 fail, 2 skipped). The build still exits 1 at `tools/content/lib/mech_court_gui.mjs` line 91 ("zin_realm_window: tab 1 runs past the body"), a UI-lane file that was already modified before this work, so the staged-tree tests fail for that reason. The baseline before this work had 26 failures from the same build break and from the UI and flag lanes. The Yeldenne-specific test files pass: 331 of 331 across roster, cold lands, realm life, journey, regional focus, forces and events world; 66 of 66 in assets; 263 of 263 in court, events, alternate history, warfare, super events and world magic.

## Follow-up: the landing and Glo-hall flags move to Pertolor

Pertolor has no tree of its own. Its focuses sit in `docs/design/focus/shared_cold_lands.json` (the shared cold-lands tree, twelve countries), so the new focuses are gated to Pertolor with `allow_branch` on the scripted trigger `zin_shared_cold_lands_is_pertolor` (`tag = PRT`). Other countries in that tree never see the branch.

**Landing focuses (ambush strength).** `watchers_on_the_coast` (flag `zin_pertolor_coast_watch`), `light_the_shore_beacon` (`zin_pertolor_beacon`) and `send_guides_to_the_landing` (`zin_pertolor_guides`) sit at x 30 to 31, y 2 to 4, under `watchers_on_the_snow`. The original beacon bypass on `zin_horos_dead` is dropped, since Horos is story only. The original guides stage check `zin_regional_yeldenne_stage_6_or_7` has no Pertolor equivalent and is dropped; the guides keep the original AND prerequisite on the beacon and on `await_the_worthy`. The AI factors follow the originals: beacon and guides drop to 0 when `zin_eindil_historical` holds; the coast watch keeps its factor 0.3 before 1750.

**Glo-hall branch.** `await_the_worthy`, `seal_the_hall`, `deny_the_dark`, `open_for_the_heir` and `seek_a_second_bearer` port the hall chain. The flags are renamed to `zin_glo_awaits_heir`, `zin_glo_seal_warded`, `zin_glo_calls_heir` and `zin_glo_calls_bearer`, and `zin_glo_hall_unyielding` is the setter the retired tree held. The mutual exclusion between `open_for_the_heir` and `seek_a_second_bearer` is kept. The original `zin_horos_dead` bypasses are dropped, and the hall-branch entry is `watchers_on_the_snow`, not `the_light_is_gone`, because `the_light_is_gone` requires `zin_horos_dead`. `the_unyielding_hall` (setter `zin_glo_hall_unyielding`, AI factor 0.3 before 1750) is ported at (27,3) under `leave_the_castle_be`; its ward effect is dropped with the retired ward idea. The retired `zin_regional_yeldenne_call_bearers` effect fired a retired Yeldenne event, so it is dropped.

**Renames in readers.** `tools/content/modules/mech_yeldenne.mjs` (the Glo hall readers and the two seeker decisions), `tools/content/modules/mech_eindil_scripts.mjs` (the ambush subtractions; the "no setter yet" dependency note is removed), `tools/content/mech_journey.test.mjs`, the journey formula and flag rows in `docs/specs/06_events/02_eindil_journey.md`, `docs/specs/04_mechanics/eindil_journey.md` and `docs/specs/04_mechanics/00_contract_additions.md`. `docs/design/stage2/mech_journey.md` and the Yeldenne spec bodies still name the old flags and are open for the owner's rewrite.

**Open items.** The shared cold-lands tree now holds 79 focuses against the F6 shared-tree range of 40 to 70 (`tools/content/checks/focus_checks.mjs`, `tier_range`), so the focus compiler stops the build; the owner or lead must choose between raising that cap, moving the Pertolor branch to its own regional tree, or trimming the branch. The verify run also shows four new test failures from the added focuses (focus counts, the spec key table, the tier-range test, and a text-rules test in `tools/content/focus_shared_a.test.mjs`); the spec table for `shared_cold_lands` is not yet updated. The icons used are reused from the existing catalog (`lighthouse`, `beacon`, `heir_rolls`, `compass_rose`, `crystal_green`, `ward_circle`, `frozen_gate`, `potent_blade`); each focus will get its own icon under lane I4. The probability gate on the AI weights (`hoi4_ai_probability_auditor` baseline and compare) is not yet run, and the MCP focus routes could not resolve the shared tree (see the verify notes).

## Current state: Pertolor's own regional tree (supersedes the shared-tree move above)

The shared cold-lands tree no longer carries Pertolor. The nine focuses added there were moved out, and `docs/design/focus/shared_cold_lands.json` is back to its pre-edit bytes except for the removal of `Pertolor` from its `countries` list (pre-edit copy: `scratchpad/prt_pre/shared_cold_lands.json`).

Pertolor now has `docs/design/focus/regional_pertolor.json`: tier regional, 32 focuses (the F6 range is 30 to 50), country `Pertolor`. Its branches are the headmen and the town (Simoto, the loaf custom, the charter, the valley road and levy, the wall, the Unyielding Hall), the Ram's Due (the Due Paid, the Due Untouched event, the Ram Fair, the Long Light, the Black-Faced Flock and its wool and mutton), Cousins to Both Crowns (the Melkgard and Coldor matches as mutually exclusive non-aggression pacts), the coast watch and landing (the flags `zin_pertolor_coast_watch`, `zin_pertolor_beacon`, `zin_pertolor_guides` and the await focus `zin_glo_awaits_heir`), and the Glo hall (`zin_glo_seal_warded`, `zin_glo_calls_heir`, `zin_glo_calls_bearer`, with the mutually exclusive pair). The spirits are `faith_high_ground` and `black_faced_line`; the events are `pertolor_headmen_council` and `pertolor_due_untouched`.

Wiring: `tools/content/data/world/roster.json` now gives Pertolor `focusTier` regional and `focusTree` regional_pertolor; `docs/specs/05_focus_trees/01_tiers_and_coverage.md` moves Pertolor from the shared list (now 22 countries) to Tier B (replacing the retired Yeldenne entry); `tools/content/data/focus_registry_shared_a.json` is back to its earlier state. The spec table is `docs/specs/05_focus_trees/regional/pertolor.md`, generated from the tree's JSON.

Retired or open: the Horos-gated content (the Judgment Seat, the Guardian Endures, the Restorable Identity "Wardens of the Silent Road" whose gate is `zin_horos_dead`), the ward effects, the Wardens of Mp'E spirit, the claimant event, and the Yeldenne stage check. The restorable identity needs a Pertolor-side gate from the owner before it is built.

Verify (`verify.sh prt`, latest run): the focus compiler passes for all trees, and the focus-count, tree-coverage and text-rule tests pass. The build stops later, at the asset stage, with 45 new `PROV_*` errors for `art/source/ui/headers/*.png` and `art/source/technologies/technology-22/23.png` (other lanes' art, not touched here), so story-wiring has not run. The suite shows 19 failures, all in build-dependent tests that read the staged tree. The MCP `hoi4.focus_inspect` with `treeId` `regional_pertolor` returns `FOCUS_TREE_NOT_FOUND` (workspace `mod_zin_86bac5c64231`); render and lint were not run because the staged tree is not produced. The probability audit of the AI weights (`hoi4_ai_probability_auditor`, baseline and compare) is not yet run.
