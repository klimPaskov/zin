# Stage 2 integration note: the story events of the journey, the war and the world (`zin_eindil`, `zin_lastwar`, `zin_lore`)

Module `tools/content/modules/events_world.mjs`, notation and checks `tools/content/lib/ew_script.mjs` and `tools/content/lib/ew_check.mjs`; data `tools/content/data/events_world.json` (rules, groups, ideas, opinion modifiers, secret register, externals), `events_world_eindil_1.json` to `_3.json`, `events_world_lastwar.json` and `events_world_lore_1.json` to `_3.json`; test `tools/content/events_world.test.mjs` (42 tests, appended to the `test` script of `tools/package.json`). Specs: `docs/specs/06_events/02_eindil_journey.md`, `03_war_of_the_last_crowns.md`, `05_flavour_and_world.md` and `docs/specs/02_lore/04_fourth_age_history_for_play.md`. Spec 05 says one module writes the whole `zin_lore` namespace, which is why the history-for-play events are here too.

## 1. The call to add to `build.mjs`

```js
import { buildEventsWorld } from './modules/events_world.mjs';
// after buildPresentation (the picture keys), BEFORE buildVanillaRemoval and the text sweep:
const world = await buildEventsWorld(staged, { countries });
```

It returns `{ events: { zin_eindil, zin_lastwar, zin_lore }, files, keys }` and stages 18 files. The module does not call the focus compiler's event writer: that writer has no trigger blocks, description variants, recipient loops or rule-based AI weights, and its namespaces are tree namespaces, so no id can clash.

`events_crown.mjs` runs the story ticks (convention C6). Pass the two blocks this module writes:

```js
const crown = await buildEventsCrown(staged, { countries, storyBlocks: ['reign', 'lastwar', 'ending', 'lore'] });
```

`zin_story_tick_lastwar` (war of the Last Crowns) and `zin_story_tick_lore` (the 400 series) are the two effects it must call. Both are guarded by `zin_story_done_*` flags, and the lastwar block does nothing until `zin_war_of_last_crowns` is set.

## 2. Files written (18)

| Path | Content |
| --- | --- |
| `events/zin_eindil.txt` | 88 events (83 country, 5 news), ids 10 to 169 |
| `events/zin_lastwar.txt` | 28 events (27 country, 1 news), ids 10 to 113 |
| `events/zin_lore.txt` | 127 events (125 player-facing, 2 hidden: `.20` rule check, `.100` scheduler), ids 1 to 414 |
| `localisation/english/zin_eindil_story_l_english.yml`, `zin_lastwar_l_english.yml`, `zin_lore_l_english.yml` | 1027 keys, UTF-8 with BOM, via the builder's `yml()`. The Eindil file is named `_story_` because the journey module owns `zin_eindil_l_english.yml` |
| `common/scripted_triggers/zin_events_world.txt` | `zin_story_rules_plausible`, `zin_story_rules_plausible_diverged` (global divergence of 50 or more), `zin_eindil_is_crowning_realm` |
| `common/scripted_effects/zin_eindil_events.txt` | `zin_eindil_after_host_raised` (the invitations after the Host exists) |
| `common/scripted_effects/zin_lastwar_story.txt` | `zin_story_tick_lastwar` |
| `common/scripted_effects/zin_lore.txt`, `zin_lore_story.txt` | `zin_lore_schedule_flavour` (the dated flavour events, per country), `zin_story_tick_lore` (the 400 series) |
| `common/scripted_triggers/zin_lore_flavour.txt` | `zin_is_zol_coast_country` |
| `common/on_actions/zin_lore.txt` | one `on_startup` block, guarded by `zin_lore_started`, firing `zin_lore.100` two hours in |
| `common/ai_strategy/zin_lastwar.txt` | five front requests `zin_lastwar_hold_west/north/south/parim/wall` |
| `common/ideas/zin_lastwar.txt`, `zin_lore.txt` | `zin_lastwar_marches_hold`, `zin_lore_jubilee_feast`, `zin_lore_old_report` |
| `common/opinion_modifiers/zin_lastwar.txt`, `zin_lore.txt` | 5 and 4 modifiers |

## 3. Counts by kind

| Kind | Eindil | Lastwar | Lore |
| --- | --- | --- | --- |
| Country events | 83 | 27 | 127 less hidden |
| News events | 5 | 1 | 0 |
| Hidden events | 0 | 0 | 2 |
| Options | 144 | 50 | 182 |
| Checkpoints (C9) | 4 (`.32` 4, `.50` 8, `.82` 10, `.88` 19) | 0 | 0 |

Flavour: 15 opening events for human players (`zin_lore.1` to `.15`, three paragraphs each: situation, belief, want), 7 history events 101 to 107, the 110 to 221 history set, 300 to 346 scheduled flavour (date windows counted in days from the game start, so `1 Highsun 1748` is offset 92 (the spec's figure)), 350 to 380 regional world events and the 400 series with story flags.

## 4. How the journey is split with the mechanics slice

The journey engine (`modules/mech_eindil.mjs`, `mech_eindil_scripts.mjs`, `data/mech_journey_eindil.json`) owns `zin_eindil.1` to `.7`, the pulse, every stage entry, the hosts, battles, the hunt, the palace and the coronation. This module writes only the narrative events (10 to 169) and never a clock. What it takes from the engine, all registered by the engine's files:

- host variables `zin_eindil_ice_host`, `_ford_host`, `_trial_host`, `_wreck_host`, `_reef_host`, `_shrine_host`, `_host_candidate` and the rest, read with the `to=var:NAME` recipient of `lib/ew_script.mjs`;
- effects `zin_eindil_set_host` (argument `zin_arg_role`), `_hold_guest`, `_name_him`, `_bearer_effects`, `_compute_ambush`, `_ambush_resolved`, `_make_dragon_pact`, `_pick_host_candidate`, `_raise_host`, `_cliff_effects`, `_recover`, `_lose_heir`, `_to_the_forest`, `_wound`, `_add_regard`, `_add_renown`, `_add_delay`;
- triggers `zin_eindil_is_host`, `_has_host`, `_historical`, `_zol_in_field`, `_army_near`, `_floor_reached`; flags `zin_eindil_confed_member`, `_quiet_return`, `_let_land`, `_stage_3_done`;
- the spirits, traits and the four Eindil opinion modifiers (so this module's opinion file holds only the `zin_lore` and `zin_lastwar` ones).

The test reads those files and fails if a name the events use is in neither the register, the specs nor the engine's text.

## 5. Spec conflicts and my choices

1. **Ids `zin_eindil.1` and `.2`** (start-up and pulse) and the pace-dated stage triggers are in spec 02, but the journey spec 04 and the mechanics slice implement them. I do not write them; `RANGES.zin_eindil` is 10 to 169, and ids 170 to 199 stay reserved.
2. **`zin_eindil.71`** (the ambush) calls the engine's `zin_eindil_compute_ambush` (decision N9, logged by the engine), hands the sum to `zin_eindil_ambush_resolved` and stores `zin_eindil_ambush_result` (1 strong, 2 few, 3 failed). The `zin_afrit_ambush_ordered` flag the spec names is replaced by its inverse: the event does not fire when the hub's `zin_afrit.33` option "Let them land" set `zin_eindil_let_land`.
3. **Option keys** are `.a`, `.b`, `.c`, `.e` and so on, skipping `d` (the description key) and `t` (the title key).
4. **Checkpoint order (C9).** `.32`, `.50`, `.82` and `.88` list the non-committal option first; `hist` marks the historical one and the AI weights follow C8 (historical 100 and 0, plausible 75 and 25, 60 and 40 once divergence is 50 or more, free by table).
5. **`zin_lore.191`** is retired (O4) and not written.
6. **The `.83` warning** never says "brother", and the Eindil name is absent from every text a country can read before `zin_eindil_named` (the test lists the events).
7. **Secrets.** "Afrit" and "Hidden Council" appear only in `_hub` and `_revealed` variants and in `zin_lore.2`, `.220` and `.221` (hub-only events for the Worshipdom). The two-faced texts use `[zin_loc_deliverer]` and `[zin_loc_eindil]`.
8. **Open questions stay open.** No text says what happened to Volgan's spirit, which arm Eindil lost, what the Necklace does, Zol's form, Merovan's fate or Dardan's place; the test holds regular expressions against each.
9. **Banned words.** The text rule set bans stability, manpower, government and the other modern words of the rule set; the prose avoids them and the test checks every key.
10. **Focus compiler defect (also in the crown note):** it writes `clear_country_flag`; the 1.19.3 documentation names it `clr_country_flag`. This module uses the documented names.
11. **`hoi4_script_validate`** returned `WORKSPACE_CONTEXT_NOT_FOUND` here, so engine vocabulary is checked by the test against the installed `effects_documentation.md` and `triggers_documentation.md` instead.

## 6. What other slices must provide

Events this module fires but does not define (`externals.events`): `zin_afrit.10`, `zin_afrit.33`, `zin_glo.5`, `zin_aenor.160`, `zin_leren.45`, `zin_reign.83`, `zin_dominion.16`, `zin_world.45`, `zin_ending.80`.

Effects it calls (`externals.effects`): `zin_aenor_add_camp_support`, `_add_concord_loyalty`, `_add_council_influence`, `_add_court_corruption`, `_add_lost_cause`, `zin_afrit_add_footholds`, `_add_veil`, `zin_cold_reward_ice_host`, `zin_eindil_add_delay`, `_add_regard`, `_add_renown`, `_hold_guest`, `_set_host`, `_wound`, `zin_elves_add_wall_grievance`, `zin_glo_add_power`, `zin_leren_add_strait_standing`, `zin_mirolon_add_passes`, `_add_proof`, `zin_sun_add_gala_counsel`, `_spend_clarity`, `zin_volgan_add_dominion_strength`, `zin_war_grant_dragons`, `zin_west_add_grudge`, `_add_unity`, `_end_ford_war`, `_on_war_king`, `zin_world_add_gathering_dark`.

Names requested (not yet in the register):

| Name | Owner and use |
| --- | --- |
| `zin_gala_word_from_the_north` | Gala tree focus "Word From the North": country flag; `zin_eindil.163` does not fire while it is set |
| `zin_eindil_name_named` | localisation key "Eindil", defined by the journey data (`mech_journey_eindil.json`) |
| `zin_name_aurevan` | terms module: the public name nested in `zin_lore.2` |
| `zin_eindil_let_land` | Afrit hub `zin_afrit.33`, option "Let them land": global flag read by the engine and by `.71` |

`events_crown.mjs` must list `'lastwar'` and `'lore'` among its `storyBlocks` (section 1). The 26 story flags that spec 05 fixes (F1) are checked by `zin_lore.20` when the rule `zin_rule_debug_checks` is on; no flavour event sets one.

## 7. Known findings and what is not finished

- **Asset uniqueness check.** `checks/assets.mjs` reports `UNIQ_EVENT_CHAIN` when two events one step apart share a picture, and `UNIQ_EVENT_PICTURE_CAP` above eight events per picture. The specs' catalog gives the journey several linked events one picture (for example `generic_war` 31 times, `generic_wilds` 27, `generic_court` 23, and about fifty chained pairs). These are pending art, like the other slices' findings: either accept them into `docs/design/validation/asset_baseline.json` or commission distinct art for the chained events. I did not touch the baseline.
- **The full `npm test` run** passes 1189 of 1190 tests. The one failure, `content/build.test.mjs` "The build is deterministic", fails in the assets stage on 813 new `UNIQ_EVENT_CHAIN` errors from other slices (for example `zin_stabilo`); `build.mjs` does not yet call this module, so none of them are mine.
- **Not run in the game** (the brief forbids it): no event has been seen on screen. The mechanics slices were still being written when this note was finished, so a renamed engine effect would show up as a failing "Engine vocabulary" or "References" test.

## Integration round 3 (24 October 2026)

The module is wired in `tools/content/build.mjs` after the mechanic slices, and the crown events call `zin_story_tick_lastwar` and `zin_story_tick_lore` (`storyBlocks` with all four blocks; `integration_r3.md`, section 1). The chained pictures of section 7 were resolved with other catalog pictures; the events of other namespaces that this module fires and no module writes yet are declared pending in `tools/content/data/pending_names.json`.
