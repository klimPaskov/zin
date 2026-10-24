# Stage 2 integration note: the crown events (the Golden King, the succession, the endings)

Module `tools/content/modules/events_crown.mjs`, notation library `tools/content/lib/crown_script.mjs`, name register reader `tools/content/lib/crown_names.mjs`; data `tools/content/data/events_crown_reign1.json`, `events_crown_reign2.json` (namespace `zin_reign`), `events_crown_ending.json` (`zin_ending`), `events_crown_world.json` (`zin_world` 100 to 107 and 110 to 112), `events_crown_hooks.json` (hooks, runner, epilogue, opinion modifiers, idea) and `events_crown_chronicle.json` (the Chronicle, camp names, lists); test `tools/content/events_crown.test.mjs` (47 tests, about 600 assertions, appended to the `test` script of `tools/package.json`). Specs: `docs/specs/06_events/01_golden_king_and_succession.md` and `04_endings.md`.

## 1. The call to add to `build.mjs`

```js
import { buildEventsCrown } from './modules/events_crown.mjs';
// after buildPresentation (picture keys), BEFORE buildVanillaRemoval (its reference scan must see these files) and the text sweep:
const crown = await buildEventsCrown(staged, { countries, storyBlocks: ['reign', 'ending'] });
```

- `storyBlocks`: the namespaces whose runner blocks `zin_story_tick` calls (convention C6). Default `['reign', 'ending']`. When the events-world module (`zin_lastwar`, `zin_lore`) writes `zin_story_tick_lastwar` / `zin_story_tick_lore`, pass `['reign', 'lastwar', 'ending', 'lore']`. **This module owns `common/scripted_effects/zin_story.txt`**; no other module may write it.
- `scheduler` (default true) writes `common/on_actions/zin_crown_story.txt` (`on_monthly` calls `zin_story_tick`). `zin_story_tick` guards itself with the timed global flag `zin_story_tick_guard` (25 days), so the world module's step 9 may call it as well; pass `scheduler: false` once it does, if wanted.
- It returns `{ counts, files, dependencies, definitions, used, texts, scripts }`. `dependencies` lists every trigger, effect, flag, variable, idea and character used and owned by someone else (`{ name, kind, owner }`); feed its `trigger` rows to the builder's inert-trigger stand-in file (`zz_zin_pending_triggers.txt`) until the owners ship.

## 2. Files written (17)

| Path | Content |
| --- | --- |
| `events/zin_reign.txt` | 54 events, ids 10 to 87 |
| `events/zin_ending.txt` | 26 events: lead-up 1 to 4, aftermath 10 to 80 |
| `events/zin_world_endings.txt` | `zin_world.100` to `.107` (major news) and `.110` to `.112` (Chronicle, Your Part, The Age Has Turned). `events/zin_world.txt` stays the world module's |
| `localisation/english/zin_reign_l_english.yml`, `zin_ending_l_english.yml` | 519 keys, UTF-8 with BOM: titles, descriptions (public, `_hub`, `_revealed*`, `_dominion`, `_exposed` variants), options, tooltips, opinion modifier names, the idea, the Chronicle |
| `common/scripted_effects/zin_reign.txt` | `zin_reign_on_king_dead`, `zin_reign_on_thirty_days`, `zin_reign_on_crowning` |
| `common/scripted_effects/zin_ending.txt` | `zin_ending_start_epilogue` (argument `ending`), `zin_ending_heir_lost` |
| `common/scripted_effects/zin_reign_story.txt`, `zin_ending_story.txt`, `zin_story.txt` | `zin_story_tick_reign`, `zin_story_tick_ending`, `zin_story_tick` |
| `common/scripted_triggers/zin_crown_dates.txt` | 11 date triggers `zin_reign_date_<key>` and `zin_ending_date_lead_1/2`: three `zin_story_pace` date sets plus an unset-pace fallback |
| `common/scripted_localisation/zin_reign.txt` | `zin_loc_camp_faithful`, `zin_loc_camp_host` (the register gives this spec the owner's name; the Aenor module must not define them) |
| `common/scripted_localisation/zin_ending.txt` | `zin_loc_chronicle_cp01` to `_cp26`, `_p1` to `_p5`, `_heading`, `_meter`, `_unknown`, `_pages`, `zin_loc_your_part`, `zin_loc_endings_possible`, `zin_loc_outcomes_possible`, `zin_loc_ending_lost_cause_cost` and their sub-keys |
| `common/opinion_modifiers/zin_reign.txt`, `zin_ending.txt` | 5 + 11 modifiers |
| `common/ideas/zin_reign.txt` | `zin_reign_anniversary` (stability +0.03, consumer goods +0.02) |
| `common/on_actions/zin_crown_story.txt` | the monthly scheduler |

## 3. Decisions and spec conflicts

1. **One module, three namespaces.** The brief names `events_crown.mjs`; the spec's C6 names `events_zin_reign.mjs` and `events_zin_ending.mjs` and a test `events.test.mjs`. The files and ids are those of the specs. Not the focus compiler's event writer: it has no trigger, description variants, recipient loops or rule-based AI weights; ids cannot clash (the compiler's namespaces are tree namespaces).
2. **Option keys are `<id>.opt<N>`**, not `.a/.b/.c/.d`: a fourth option `.d` would collide with the description key (`zin_reign.31` has four options).
3. **Order.** C8 says the historical option is first; the spec table lists `zin_reign.21` with the great embassy first. History (the letter of condolence) is written first; a timeout therefore costs nothing. No `zin_reign`/`zin_ending` event is a checkpoint choice, so C9 needs no `checkpoint`; the notation and a test support it.
4. **`fire_only_once` is global** (a country receiving it blocks every other country, wiki "Event modding"), so it is not used on per-country events; once-only behaviour comes from the `zin_story_done_*` flags (C6), a timed `zin_story_seen_reign_17`, and guards at fire time (`trigger` blocks, valid with `is_triggered_only`). Hidden events are not needed: recipients are evaluated when the hook runs and every event re-checks them in its `trigger`; the hidden relay events the spec hints at would use ids outside 10 to 87. Every `immediate` block is wrapped in `hidden_effect`, and chain events fired from options stay out of the tooltip.
5. **Title `zin_reign.42`** is "The Oath to the New King" (the spec's "King Aurevan" would write the public name literally, against C1).
6. **"Chancellor"** is an error word of the text sweep (`bw_modern_society_012`) and is Merovan's canon title (contract, characters, loading tips). It is the one banned word kept (`ALLOWED_WORDS`); the tests and the build check every other error word. The owner may rename the title; the sweep rule or the title must change.
7. **Opinion direction** where the spec says "opinion toward X": the modifier named for an action that wins favour (`zin_reign_mourned_king`, `zin_reign_gifts_to_god_king`, `zin_ending_temple_paid`, `_dues_paid`, `_homage_paid`, `_gifts_to_parim`, `_envoys_south`) is the **holder's opinion of the actor**; a grievance (`zin_ending_old_claims`, `_dues_resented`) is the actor's opinion of the holder; `zin_ending_open_roads` is every court's opinion of the crown; `zin_ending_treaty_of_equals` both ways.
8. **Date firing.** The monthly tick fires a dated event on the first tick on or after its date (true from the day before, so a tick on the 1st fires it; at pace 1.5 and 0.75 the shifted date can fall mid-month and the event comes at the next tick). A failed condition skips the event.
9. **Chronicle "early / late"** (lines 02 and 11): line 02 reads the rule `zin_rule_eindil_waking` (EARLY, LATE), line 11 reads the global flags `zin_ending_cp11_early/late`, set by `zin_story_tick_ending` the first month `zin_war_of_last_crowns` is seen (early when `zin_world_date_last_crowns` was not yet true). The historical lines 17, 24, 25 need `zin_afrit_revealed`; otherwise the diverged line stands in. Line 05's diverged text has a public and a `_revealed` form.
10. **Focus compiler defect found:** `modules/focus_compiler.mjs` writes `clear_country_flag`; the 1.19.3 documentation names the effect `clr_country_flag` (this module uses it; the global form is `clr_global_flag`). Not edited here.
11. `zin_aenor.201` is **not** fired by `zin_reign.20` (the spec says only "hands over"); the Aenor module fires it one day after `.20`, or the player sees it twice.
12. **Codex.** The Chronicle codex entries 627 to 630 (07_interface/04_chronicle_codex.md) end with the lines of the Chronicle of the Age. `zin_loc_chronicle_pages` returns the whole of it (heading, five paragraphs, meter, closing line); the codex module calls that one key. Entry data belongs to `modules/chronicle.mjs`, not here.

## 4. Names this slice adds (all inside the module's own files)

Scripted: `zin_reign_date_<e10|e11|e13|e14|e16_1748|e16_1749|e53|e80_1752|e80_1753>`, `zin_ending_date_lead_1/2`, `zin_ending_heir_lost` (effect: for the journey's `zin_eindil.140`, which should call it instead of firing `zin_ending.80` itself, so the right realm receives it), `zin_story_tick_guard` (timed global flag), `zin_ending_volgan_near` (spec), `zin_ending_cp11_known/early/late` (global flags), saved global event targets `zin_ending_t_eindil_aenor`, `zin_ending_t_afrit_realm`, `zin_ending_t_united_crown`; temporary variables `zin_t_ending`, `zin_t_deep`, `zin_t_camp_1..4`, `zin_t_weak(_code)`, `zin_t_best(_code)`. Opinion modifiers (extra to the spec): `zin_reign_mourning_snub` (-5), `zin_reign_selen_slight` (-5), `zin_reign_gifts_to_god_king` (+15), `zin_reign_honour_withheld` (-10). Ending codes for `zin_arg_ending`: lost_cause 1, children_of_volgan 2, ashen_throne 3, golden_court 4, western_crown 5, strait_master 6, eastern_king 7, unfinished 8 (the world spec's numbers; add to `data/focus_arg_codes.json` if a tree calls it).
Proposed names written literally (a future `zin_name_<key>` pass can replace them): Merovan, Ilvane's title "High Confessor", Tarec, Eronel, Ilsabet, Selen's "First Warden".

## 5. What other slices must do or provide

| Owner | Must do | For |
| --- | --- | --- |
| Aenor mechanic | fire `zin_reign.19` (one day before `zin_aenor.200`), `.37` (secession), `.50`/`.55`/`.60` (by ruling camp, from `zin_aenor.210`), `.70` (3 days after `.250`), `.71` (and set `zin_reign_councils_war`), `.73`, `.86` (1 day after `.300`); call `zin_reign_on_king_dead` at the end of `zin_aenor_open_succession` and `zin_reign_on_thirty_days` in `zin_aenor.201`; fire `zin_aenor.201` after `.20`; read `zin_reign_asked_ledgers`; define `zin_aenor_camp_*`, `zin_aenor_ruling_camp`, `zin_aenor_dominion_restless/defiant`, `zin_aenor_add_council_influence` (all used; the register lists some only in spec text) | Acts II to VII |
| Afrit mechanic | call `zin_reign_on_crowning` at the end of `zin_afrit_crown_aurevan`; fire `.65` (from `zin_afrit.23`), `.81` (`.32`), `.82` (`.34`), `.83` (`.40` *Denounce him*), `.85` (3 days after `zin_afrit_reveal`); define `zin_loc_deliverer`, `zin_afrit_add_footholds`, `zin_afrit_purge_houses`, `zin_afrit_add_veil` | Acts IV to VII |
| Eindil's journey | `zin_eindil.82` historical option fires `.83`; `zin_eindil.140` calls `zin_ending_heir_lost`; define `zin_loc_eindil`, `zin_eindil_add_regard`, `zin_eindil_friend`, `zin_eindil_is_host` | `.83`, `zin_ending.80` |
| World | `zin_world_reach_ending` fires the news `zin_world.100` to `.107` (`major = yes`, one call per ending) and calls `zin_ending_start_epilogue` with `zin_arg_ending`; create the ending spirits (`zin_world_no_crown_over_crowns` and the rest; the news option adds the holder's spirit only when missing); set `zin_gathering_dark`, `zin_story_pace`, `zin_world_date_children`, `zin_world_date_last_crowns`; call `zin_story_tick` (optional, the scheduler covers it); `events/zin_world.txt` must hold no id from 100 to 119 | endings |
| Path | write `zin_path_cp01` to `_cp26` (0 to 3) | Chronicle |
| Diplomacy, East, Volgan, Dark Lands, Lerendor, elves | `zin_east_is_court`, `zin_is_volgan`, `zin_volgan_children_ready`, `zin_dominion_is_dark_lands_country`, `zin_leren_holds_strait`, `zin_elves_is_wall_realm`, `zin_dark_add_volgan_pact`, `zin_volgan_add_oath`, `zin_east_lean`, `zin_east_united_crown` | endings |
| Events-world module | `zin_story_tick_lastwar`, `zin_story_tick_lore` (not written here) and the `storyBlocks` option above | C6 |

The 98 names the module uses and does not define are in `crown.dependencies` (16 effects, 30 triggers, 41 flags, 38 variables, 9 ideas, 2 characters; the 26 `zin_path_cpNN` are variables).

## 6. Art

No new picture is needed: every key exists (`presentation-cells.json`). The ending news use the `ending_*` news crops; `zin_world.110` to `.112` use `chronicle`. The standard 210 x 176 crops `GFX_zin_evt_ending_<key>` the endings spec requests are not used; the art track may generate them and `zin_ending.10/.20/.30/.40/.50/.60/.70` can then switch picture. `temple_parim_interior` (requested by 01) is still requested: `zin_reign.31`, `.81`, `.82` use `hermitage` and `.80`, `.87` use `houses` until it exists.

## 7. Open items and limits

- The hoi4-agent-tools MCP had no registered workspace in this session, so `hoi4_script_validate` / `hoi4_event_inspect` were not run; the module's own check reads every generated key against the installed documentation instead (`checkEngine`), and the tests read the register of shared names.
- Not verified in the game: `on_monthly` firing on the first of the month (the date triggers are true from the day before), `[?ROOT.var|0]` in tooltips, `recruit_character = zin_eronel` when the characters module already attached him, the Chronicle's length in the event window (about 26 short lines).
- `zin_reign.34`'s "two strongest non-ruling camps" is computed in temporary variables (`strongest_two_non_ruling`): the weakest of the non-ruling camps is skipped.
- The text-sweep rule `bw_modern_society_012` against "Chancellor" (see 6 above).

## Integration round 3 (24 October 2026)

`build.mjs` passes `storyBlocks: ['reign', 'lastwar', 'ending', 'lore']` now that the world events are wired. The monthly scheduler `common/on_actions/zin_crown_story.txt` is an every-country `on_monthly` (CLAUDE.md rule 8); it is recorded for the lead in `integration_r3.md`, section 8.
