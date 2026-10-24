# Mechanics: the Cold Lands

Spec: `docs/specs/04_mechanics/cold_lands.md` (with `00_shared_contract.md`, `00_contract_additions.md` and `docs/specs/INTEGRATION_DECISIONS.md`, which wins where they differ).
Module: `tools/content/modules/mech_cold.mjs` (export `buildMechCold(staged, { countries, data? })`; also exports `COLD_DEPENDENCIES`, `coldExternals`, `numberWord`, `resolveText`).
Libraries: `lib/mech_kit.mjs` (renderers, story-pace dates, text guard), `lib/calendar.mjs` (month names, start year).
Data: `tools/content/data/mech_regions_cold.json` (roster names, every number, the season clock, every AI weight, all player text).
Test: `tools/content/mech_cold.test.mjs` (40 tests, all passing; run `cd tools && node --test content/mech_cold.test.mjs`).
The spec names the module `mech_cold_lands.mjs` and the data `data/mechanics/cold_lands.json`; the slice keeps the regional modules' names.

## Wiring in build.mjs

Call after the court, journey and power slices, before `buildRules` and the pending-trigger stand-ins:

```js
const cold = await buildMechCold(staged, { countries });
```

It returns `{ files, text, definitions, dependencies, externalEvents, counts, tags }` and throws on a roster, text, placeholder, picture, icon or modifier error.
The rule `zin_rule_cold_isengard` and its wrappers come from `modules/rules.mjs` (row in `data/game_rules.json`); this slice writes no game rule file.

## Files written

| File | Content |
| --- | --- |
| `common/scripted_effects/zin_cold.txt` | 27 effects |
| `common/scripted_triggers/zin_cold.txt` | 12 triggers (4 story-pace date triggers) |
| `common/ideas/zin_cold.txt` | 6 spirits |
| `common/dynamic_modifiers/zin_cold.txt` | 3 (`zin_cold_reach_mod`, `zin_cold_winter_mod`, state `zin_cold_far_ice`) |
| `common/opinion_modifiers/zin_cold.txt` | 6 |
| `common/decisions/categories/zin_cold.txt`, `common/decisions/zin_cold.txt` | 3 categories, 11 decisions (the spec's 9 and two cost variants) |
| `events/zin_cold.txt` | 23 events: the spec's 20 and the border-war results `.34`, `.35`, `.36` |
| `common/on_actions/zin_cold.txt` | `on_startup`, `on_monthly_<TAG>` for the 31 Cold Lands tags, `on_declare_war` |
| `common/ai_strategy/zin_cold.txt` | 4 strategies |
| `localisation/english/zin_cold_l_english.yml` | 129 keys (125 data texts, 4 aliased decision texts) |

## Names it defines

Effects: `zin_cold_add_lean`, `zin_cold_add_lean_all`, `zin_cold_add_defiance`, `zin_cold_update_reach`, `zin_cold_start_march_war`, `zin_cold_end_march_war`, `zin_cold_isengard_swears`, `zin_cold_add_yeti_pact`, `zin_cold_add_giant_pact`, `zin_cold_set_winter_values`, `zin_cold_roll_winter`, `zin_cold_end_winter`, `zin_cold_feed`, `zin_cold_feed_by_isengard`, `zin_cold_open_neck_road`, `zin_cold_sell_timber`, `zin_cold_chart_far_ice`, `zin_cold_reward_ice_host`, `zin_cold_send_wardens`, `zin_cold_join_crossing`, `zin_cold_sail_white_companies`, `zin_cold_schedule_seasons`, `zin_cold_next_mistfall`, `zin_cold_next_moot`, `zin_cold_monthly`, `zin_cold_on_declare_war`, `zin_cold_startup`.
Triggers: `zin_cold_is_cold`, `zin_cold_is_clan_realm`, `zin_cold_historical`, `zin_cold_date_march_open`, `zin_cold_date_march_historical`, `zin_cold_date_timber_1`, `zin_cold_date_timber_2`, `zin_cold_march_war_allowed`, `zin_cold_isengard_may_swear`, `zin_cold_isengard_settled`, `zin_cold_winter_is_hard`, `zin_cold_is_runner`.
Ideas: `zin_cold_bread_from_fandanar`, `zin_cold_sworn_to_the_accord`, `zin_cold_neck_road_trade`, `zin_cold_harbour_compact`, `zin_cold_hall_guard`, `zin_cold_far_ice_charted_idea`.
Opinions: `zin_cold_accord_kin`, `zin_cold_fed_us`, `zin_cold_hall_friend`, `zin_cold_temple_swords`, `zin_cold_marriage_kin`, `zin_cold_road_refused`.
Decisions: `zin_cold_send_envoys`(`_cheap`), `zin_cold_feed_the_steadings`(`_cheap`), `zin_cold_invite_to_accord`, `zin_cold_offer_protection`, `zin_cold_bread_for_isengard`, `zin_cold_winter_gifts`, `zin_cold_isengard_feeds`, `zin_cold_sell_timber_west`, `zin_cold_renew_old_pact`.
Flags set here: the spec's flags table, plus `zin_cold_march_war_active`, `zin_cold_charter_ready`, `zin_cold_charter_sent`, `zin_cold_fed_this_winter`, `zin_cold_raided_this_winter`, `zin_cold_yeti_refused`, `zin_cold_giant_refused`, timed `zin_cold_yeti_waiting`, `zin_cold_giant_waiting`, timed `zin_cold_month_ran`.
Global variables: `zin_cold_winter`, `zin_cold_march_winner`, `zin_cold_invader`, `zin_cold_isengard_seat`, `zin_cold_due_mistfall`, `zin_cold_due_moot`, `zin_cold_due_thaw`, `zin_cold_delay`.

## Names it uses that other owners must define

| Owner | Spec | Names |
| --- | --- | --- |
| key-sites table, `modules/sites.mjs` (not written yet; inert stubs under I9 until then) | `01_map/02_key_sites.md` | `zin_is_region_cold_lands`, `zin_is_region_far_northwest`, `zin_is_site_yeldenne`, `zin_is_site_isengard_march`, `zin_is_site_eindil_ice`, `zin_is_site_parim` |
| foundation rules, `modules/rules.mjs` (exists) | `00_foundation/05_defines_and_rules.md` | `zin_rules_is_historical`, `zin_rules_ai_branch_cold_historical`, `global.zin_story_pace`, the rule `zin_rule_cold_isengard` |
| western crossing, `modules/mech_crossing.mjs` (exists) | `04_mechanics/western_crossing.md` | `zin_west_add_fleet`; global flags `zin_west_council`, `zin_west_route_divided`, `_crossing`, `_relief`, `_hold`; `global.zin_west_convener` |
| Eindil journey, `modules/mech_eindil*.mjs` (exists) | `04_mechanics/eindil_journey.md` | `zin_eindil_add_regard`, `zin_eindil_add_renown`, `zin_eindil_join_coalition` |
| Yeldenne and Glo, `modules/mech_yeldenne.mjs` (exists) | `04_mechanics/yeldenne_and_glo.md` | `zin_yeldenne_add_wards`, `zin_horos_dead`, `zin_yeldenne_forewarned` (set here), `zin_glo_petitioned` |
| Afrit, `modules/mech_afrit.mjs` (exists) | `04_mechanics/afrit_hidden_council.md` | `zin_afrit_at_yeldenne` |
| world systems (not written yet) | `04_mechanics/04_magic_and_world_systems.md` | `global.zin_gathering_dark` (no module sets it today) |
| economy, `modules/economy.mjs` | `03_gameplay/02_economy.md` | country flag `zin_region_cold_lands` |
| start situation, `modules/vanilla_removal.mjs` | `02_lore/01_start_situation.md` | opinion `zin_opinion_cold_rivalry` (defined there; this slice only adds and removes it) |
| Coldor tree (focus compiler, `docs/design/focus/coldor.json`) | `05_focus_trees/major/coldor.md` | idea `zin_coldor_ports_against_interior` (tree spirit `ports_against_interior`); flags `zin_coldor_accord_decisions`, `zin_coldor_accord_open`, `zin_coldor_cheap_envoys`, `zin_cold_open_hand`, `zin_cold_iron_hand`, `zin_cold_winter_stores`, `zin_cold_timber_market`, `zin_cold_watch_fires`, `zin_cold_hall_respected`, `zin_cold_route_crossing` |
| regional Cold Lands trees | `05_focus_trees/regional/cold_lands.md` | `zin_regional_yeti_lands_open_to_truce`, `zin_regional_yeti_lands_apart`, `zin_regional_titanos_open_to_pacts`, `zin_regional_titanos_apart`, `zin_regional_windwaith_free_harbours` |
| warfare, `data/warfare_ids.json` | `03_gameplay/01_warfare.md` | sub-units `zin_men_infantry`, `zin_men_archers`, `zin_men_cavalry`, `zin_support_scouts`, `zin_support_healers`, `zin_support_quartermasters`; equipment `zin_arms_equipment`; names group `ZIN_HOSTS` |
| diplomacy | `03_gameplay/03_diplomacy_and_factions.md` | the Northern Accord faction (`zin_faction_northern_accord`, Coldor leading, Horidor in it at the start) is assumed, not named in script; `zin_lost_cause_add_strength` is called by the Coldor tree, not here |

The test checks the list both ways: every name the script reads and does not define is listed, and every listed name is used.
The spec's site rows `zin_is_site_neck_road`, `zin_is_site_fandanar`, `zin_is_region_mpe_approach` and `zin_is_site_yeldenne_landing` are read by the trees and the journey, not by this module; the key-sites table still owes them.

## Events it fires but does not define

None. Its events are fired by others: `zin_cold.30`, `.33`, `.51`, `.52`, `.61`, `.71` by the Coldor tree, `zin_cold.70` by the Gunwaith tree; `zin_cold_send_wardens` and `zin_cold_reward_ice_host` are called from the journey's events 11 and 12.

## What was completed or fixed in the interrupted module

- Rule reads go through `zin_rules_ai_branch_cold_historical` (R1, rules wrappers); the three unused direct `has_game_rule` triggers are gone.
- Seasons (section 3): the startup schedules Mistfall after 245 days and Deepwinter after 306; each season event queues the next from its due day, and Mistfall queues the Thaw 120 days on; the 159 calendar-window checks are gone. The runner fires a season whose queued event was lost with a vanished anchor.
- The monthly runner hangs on `on_monthly_<TAG>` of the 31 Cold Lands tags instead of the every-country `on_monthly`, with a month flag so a tie between fallback anchors runs once.
- The March Forts use event targets for the two states, as vanilla `FRA` does; `.36` (cancel) only clears the war flag.
- The Winter Charter applies the offered −5 and the refusal +5 (section 1 sources table and the events table).
- AI chances follow the spec: `.40` join = lean, `.41` accept = lean − 40 (doubled at war), `.51`/`.52` accept = 60 + lean ÷ 2, doubled when open, nil when apart (the refusal weight was zeroed when apart, leaving no option); `.71` refusal weight no longer vanishes when Windwaith lacks Free Harbours; feeding needs 100 Authority and lean −20 to 50; no Accord decision AI targets a realm Isengard guarantees (the invitation used to block players too).
- `.71` does nothing when Windwaith already holds the compact; `.61` uses `zin_glo_petitioned` for "never petitioned", drops the extra hall-friend opinions and uses the `yeldenne_hall` picture; `.50` does not fire against a realm at war with Coldor.
- The hall guard spirit is removed when Coldor no longer guarantees Yeldenne (section 6 spirits table).
- Renewing a refused pact waits 180 days after the refusal (section 4), through a timed flag.
- Timber needs `zin_west_council` or one of the four `zin_west_route_*` flags (section 7); the historical AI sells exactly twice, more only on *Timber and Ships for the West*.
- Every number, AI weight and the season clock moved into the data; the text takes its numbers and month names through placeholders.
- Decision requirements read as texts of their own (`zin_cold_tt_*`), never as raw flags or variables.
- Dead names were removed: `zin_cold_pact_is_open`, the `_hearth` flags.

## Spec conflicts and choices

- The clan realms bordering Isengard get −20 by a start-time `is_neighbor_of` test, not from build-time adjacency (the spec's builder paragraph); the result is the same and needs no map read.
- `zin_cold_reward_ice_host` reads `zin_arg_value` (its callers, the Coldor tree and the journey's `@call ... 5`, pass a value), not `zin_arg_target` as the arguments paragraph says.
- "Charting the far ice" halves the far ice's attrition through `attrition` −0.05 on Coldor; the engine has no country modifier for a state's `local_supplies`, so the supply half is not reproduced.
- Envoy AI weights by lean bands rather than picking exactly "the three highest-lean clans first".
- The White Companies are placed by `create_unit`'s `country_score` (faction members, then Aenor), which cannot ask for "coastal and nearest the West".
- *A Share of the Plunder* joins the war against the original Aenor tag; an Aenor successor realm is not followed.
- `.60` keeps its AI at "Keep out of it" under every rule; the spec states only the historical rule.
- K27: the "-waith" country names are written as `[TAG.GetName]` in every text, so the texts follow the rename when it lands.
- The monthly runner is a per-tag hook list (31 hooks), the CLAUDE.md-allowed form; see the finding below.

## Art it needs that does not exist

The asset inventory (`08_art_and_assets/03_full_asset_inventory.md` §5.3) asks for four `zin_cold` event pictures that the catalog (`data/presentation-cells.json`) lacks: `steading_winter` (now `generic_wilds` on `.11`, `.12`, `generic_court` on `.21`), `isengard_walls` (now `generic_war` on `.31`, `.32`), `yeti_hunt` (now `generic_wilds` on `.51`, `.52`, `generic_war` on `.50`), `ice_road_caravan` (now `generic_peace` on `.70`).
Decision and category icons reuse catalog idea icons (`banner_league`, `war_drums`, `timber_mill`, `envoy`, `alms_bread`, `handshake_oath`, `pass_fort`, `granary`, `tribute_chest`, `yeti_claw`); the Coldor proposals `northern_accord`, `march_forts`, `yeti_pact`, `giant_pact`, `far_ice` (§A1) do not exist yet.

## Zol correction footprint

None: the slice uses no `zin_zol_*` name, no `zin_zol_manifested` and no Zol text (a test enforces it).

## Every-country loops and rule breaks found

- Finding: the interrupted module hung `zin_cold_monthly` on the every-country `on_monthly`; it now uses `on_monthly_<TAG>` hooks. The sibling modules `mech_dark_content.mjs`, `mech_east_content.mjs` and `mech_sun.mjs` still use an every-country `on_monthly` (outside this slice; not changed).
- No `<=` or `>=`, no hard-coded tuning numbers in script text, no player text about implementation history.

## Validation

- `mech_cold.test.mjs`, 40 tests: spec values (written in the test, apart from the data) with 14 data mutations that the check must catch, determinism, parse and braces, operators, BOM, engine vocabulary against the installed effect and trigger documentation (meta_effect text expanded; `start_border_war` and `has_dynamic_modifier` taken as parameter blocks), modifiers, localisation keys, banned and modern words, Erdae and Arda, "-waith", secrets, events and pictures, references, peace gates, rule reads, story-pace dates, seasons, the monthly runner, tooltips, roster guards; each rule has a negative test.
- MCP `hoi4_script_validate` on the season queue, the border war and the runner fragment: every command kind and scope matches the documentation; argument blocks are unchecked by the tool (`SCRIPT_CHECK_PARTIAL`), so the parameters rest on the cited documentation and the vanilla `FRA` precedent.

## Open items

- `global.zin_gathering_dark` has no setter yet, so off the historical rule the March Forts open only through Isengard's defiance of 80.
- The meta_effect delay (`[?global.zin_cold_delay|0]`) follows `mech_crossing.mjs`'s precedent but is unproven in game; the Linux run should confirm Mistfall on 1 Mistfall 1748 and the Thaw on 1 Thaw 1749.
- The text still says "Isengard"; K27 names only the "-waith" names, so the owner may want to look at it too.
- Month names follow `lib/calendar.mjs`; the god-month calendar (K3, K10) will change them through the placeholder.
