# Mechanics: the Dark Lands

Spec: `docs/specs/04_mechanics/dark_lands.md` (with `00_shared_contract.md`, `00_contract_additions.md`, the interface spec `docs/specs/07_interface/01_interface.md` section 7a, and `docs/specs/INTEGRATION_DECISIONS.md`, which wins where they differ).
Modules: `tools/content/modules/mech_dark.mjs` (export `buildMechDark(staged, { countries, assignment?, data?, panels? })`, the scripted triggers and the core effects; also exports `BLOCS`, `HOLD_PEOPLES`, `FORBIDDEN_TEXT`, `DARK_DEPENDENCIES`, `stanceCode`, `loadDarkData`), `mech_dark_content.mjs` (startup, pulse, ideas, modifiers, opinions, characters, traits, decisions, events, on_actions, AI), `mech_dark_panels.mjs` (the Horde and Accord windows and the scripted localisation).
Libraries: `lib/mech_kit.mjs` (renderers, story-pace dates, text guard), `modules/peoples.mjs` (default peoples), `modules/ideologies.mjs` (stance order for `zin_politics_set_stance`).
Data: `tools/content/data/mech_regions_dark.json` (roster names, the region's sway table, every number, AI weight and opinion value, all player text).
Test: `tools/content/mech_dark.test.mjs` (32 tests, all passing; run `cd tools && node --test content/mech_dark.test.mjs`).
The spec names the module `mech_dark_lands.mjs` and the data `data/mechanics/dark_lands.json`; the slice keeps the regional modules' names.

## Wiring in build.mjs

The call is already in `tools/content/build.mjs` (after `buildMechCold`); the integrator keeps it after the court, journey and power slices and before `buildRules` and the pending-trigger stand-ins:

```js
const mechDark = await buildMechDark(staged, { countries, assignment });
```

`assignment` is the tag -> people map built from `docs/design/countries.csv` through `loadCountryTable`; the holds (orc and troll realms) are derived from it, with the peoples module's defaults when it is absent.
Pass `panels: false` when the interface module builds the themed `zin_horde` and `zin_accord` panels: the windows and their texts are then left out, and the scripted localisation stays.
The build returns `{ files, text, definitions, dependencies, externalEvents, counts, tags, holdTags, swayTags, content, windows }` and throws on a roster mismatch (missing country, wrong region, wrong state count), unused or missing text, a banned word, a forbidden name (Erdae, Arda, Afrit, the Hidden Council, the King of Demons, Eindil), an unknown picture, icon or modifier.
The rule `zin_rule_ai_goldoroth` and its wrappers come from `modules/rules.mjs` (row in `data/game_rules.json`); this slice writes no game rule file.

## Files written

| File | Content |
| --- | --- |
| `common/scripted_triggers/zin_dark.txt` | 32 triggers (4 story-pace date triggers) |
| `common/scripted_effects/zin_dark.txt` | 42 effects |
| `common/ideas/zin_dark.txt` | 18 spirits |
| `common/dynamic_modifiers/zin_dark.txt` | `zin_dark_accord_shield`, state `zin_dark_troll_woods`, the cause `zin_cb_hold_defiance` |
| `common/opinion_modifiers/zin_dark.txt` | 14 |
| `common/decisions/categories/zin_dark.txt`, `common/decisions/zin_dark.txt` | 6 categories, 32 decisions (the spec's 24 and 8 tree-flag variants) |
| `events/zin_dark.txt` | 34 events: the spec's 31 shown events, the hidden start `.1` and the hidden clash callbacks `.2`, `.3`, `.4` |
| `common/characters/zin_dark.txt` | 6 characters |
| `common/unit_leader/zin_dark_traits.txt`, `common/country_leader/zin_dark_traits.txt` | `zin_trait_black_iron_warlord`, `zin_trait_forge_mistress` |
| `common/on_actions/zin_dark.txt` | `on_startup`, `on_monthly_<Goldoroth>`, `on_monthly_<Dondor>`, `on_declare_war`, `on_capitulation` |
| `common/ai_strategy/zin_dark.txt` | 45 strategies |
| `interface/zin_dark_panels.gui`, `common/scripted_guis/zin_dark_panels.txt` | windows `zin_horde_window`, `zin_accord_window`; scripted GUIs `zin_horde`, `zin_horde_launcher`, `zin_accord`, `zin_accord_launcher` |
| `common/scripted_localisation/zin_dark.txt` | `zin_dark_band_name`, `zin_dark_sway_band_name`, `zin_dark_sway_line` |
| `localisation/english/zin_dark_l_english.yml` | 312 keys (UTF-8 with BOM) |

## Names it defines

Effects: `zin_dark_add_border_tension`, `zin_dark_refresh_shield`, `zin_dark_add_accord_resolve`, `zin_goldoroth_refresh_temper`, `zin_goldoroth_add_temper`, `zin_goldoroth_refresh_favours`, `zin_goldoroth_add_favour`, `zin_goldoroth_apply_sway`, `zin_goldoroth_add_sway`, `zin_goldoroth_yoke_check`, `zin_goldoroth_take_tributary`, `zin_goldoroth_tribute_on_capitulation`, `zin_goldoroth_refresh_unity`, `zin_goldoroth_crown_heir`, `zin_goldoroth_warking_takes_field`, `zin_goldoroth_core_dark_lands`, `zin_goldoroth_claim_strait_shores`, `zin_goldoroth_proclaim_one_kingdom`, `zin_goldoroth_kneel`, `zin_dark_add_volgan_pact`, `zin_dark_grant_hold_cb`, `zin_dark_grant_raid_cb`, `zin_goldoroth_wargoal_defiant`, `zin_goldoroth_wargoal_sworn`, `zin_goldoroth_wargoal_strait_south`, `zin_goldoroth_rally_free_dark`, `zin_goldoroth_offer_access_against_dead`, `zin_dark_start_border_clash`, `zin_dark_end_clash`, `zin_dark_blood_price_paid`, `zin_dark_answer_raid`, `zin_dark_resolve_raid`, `zin_dark_startup`, `zin_dark_refresh_panel_rows`, `zin_dark_on_zol_rising`, `zin_dark_on_body_destroyed`, `zin_dark_pulse`, `zin_dark_found_free_moot`, `zin_dark_join_free_moot`, `zin_dark_leave_free_moot`, `zin_dark_on_declare_war`, `zin_dark_on_capitulation`.
Arguments follow decision E1 (`zin_arg_<name>` temporary variables): `bloc` volcano 1, iron 2, war 3, warrens 4; `kind` march 1, hold 2, corsair 3; `strait` north 1, south 2; `target` bordering -1, holds -2, else the country; `answer` beacons 1, blood-price 2, in kind 3; `result` won 1, lost 2, cancelled 3.
Triggers: `zin_dark_is_dark`, `zin_dark_is_hold`, `zin_dark_is_free_hold`, `zin_dark_is_tributary`, `zin_dark_is_accord_member`, `zin_dark_is_sea_master`, `zin_dark_is_runner`, `zin_dark_tension_band_quiet`, `_uneasy`, `_bloody`, `_brink`, `zin_goldoroth_unity_at_least`, `zin_dark_date_yoke`, `zin_dark_date_war_floor`, `zin_dark_date_defiance_cb`, `zin_dark_date_clash_historical`, `zin_goldoroth_war_open`, `zin_goldoroth_may_war_dondor`, `zin_goldoroth_refuses_masters`, `zin_goldoroth_seeks_the_south`, `zin_dark_hold_under_cocanoor`, `zin_dark_hold_in_moot`, `zin_dark_hold_fears_cocanoor`, `zin_dark_took_southern_gifts`, `zin_dark_hold_at_war_with_goldoroth`, `zin_dark_rule_independent`, `zin_dark_rule_sworn`, `zin_dark_holds_strait_shore`, `zin_dark_shore_barred`, `zin_dark_moot_eligible`, `zin_dark_moot_may_be_called`, `zin_dark_outnumbers_threefold`.
Ideas: the 18 spirits of the spec's table (`zin_dark_restless_clans` to `zin_dark_watch_the_shore`).
Opinions: the spec's ten, plus `zin_dark_beacons_lit` (+5), `zin_dark_corsair_outrage` (-10), `zin_dark_host_shown` (-5), `zin_dark_stood_with_accord` (+10).
Decisions: the spec's ids, with `zin_dark_levy_shore_tolls` for its `zin_dark_shore_tolls`, and the variants `zin_dark_raid_marches_swift`, `zin_dark_great_moot_central`, `zin_dark_blood_contest_cheap`, `zin_dark_send_gifts_cheap`, `zin_dark_offer_iron_yoke_cheap`, `zin_dark_one_fire_hard`, `zin_dark_light_beacons_chain`, `zin_dark_muster_brutes_drill`.
Characters: `zin_goldoroth_bredo`, `_sungor`, `_britag`, `_ulgra`, `_snikkit`, `_rask` (Rask is not recruited at the start).
Flags set here beyond the spec's table: `zin_dark_clash_active`, `zin_dark_shore_warned`, `zin_dark_south_silent`, `zin_dark_was_sworn`, `zin_dark_fray_sent`, `zin_goldoroth_kneeled`, `zin_goldoroth_challenged` (365 days), `zin_goldoroth_raid_lately` (60 days, AI), the variant cooldown flags `zin_dark_cd_raid_marches`, `_great_moot`, `_light_beacons`, `_muster_brutes`, and the panel flags `zin_ui_horde_open`, `zin_ui_accord_open`.
Global variables: `zin_dark_border_tension`, `zin_dark_accord_resolve`, `zin_dark_rule_roll`, `zin_dark_states_total`, `zin_dark_raid_dark_added`, `zin_dark_raid_quiet_until`, `zin_dark_challenger`, `zin_dark_invite_result`, `zin_dark_yoke_result`, `zin_dark_moot_attacker`, `zin_dark_moot_victim`, `zin_dark_member_count`; arrays `zin_dark_sway_rows`, `zin_dark_accord_rows`.

## Names it uses that other owners must define

| Owner | Spec | Names |
| --- | --- | --- |
| key-sites table, `modules/sites.mjs` (not written yet) | `01_map/02_key_sites.md` | `zin_is_region_dark_lands`, `zin_is_site_goldoroth_march`, `zin_is_site_sea_of_darkness_coast`, `zin_is_site_dark_strait_north_shore`, `zin_is_site_dark_strait_south_shore`, `zin_is_site_dark_strait_far_shore`, `zin_is_site_dark_strait_south_far`, `zin_is_site_ocean_of_zol_coast`, `zin_is_site_troll_forest`, `zin_is_site_parim` |
| foundation rules, `modules/rules.mjs` (exists) | `00_foundation/05_defines_and_rules.md` | `zin_rules_ai_branch_goldoroth_independent`, `zin_rules_ai_branch_goldoroth_sworn_to_volgan`, `zin_rules_ai_random_goldoroth`, `zin_rules_is_historical`, `global.zin_story_pace` |
| foundation politics, `politics.mjs` (not written yet) | `00_foundation/02_ideologies_and_politics.md` | `zin_politics_set_stance` (called with `zin_arg_stance = 12`, `zin_shadow_horde` in the ideologies order, the convention of `lib/mech_aenor_script.mjs`) |
| world systems (not written yet) | `04_mechanics/04_magic_and_world_systems.md`, `05_world_tension_and_endings.md` | `zin_world_add_gathering_dark`, `global.zin_gathering_dark`, global flag `zin_war_of_last_crowns` |
| Volgan, `modules/mech_volgan.mjs` (exists) | `04_mechanics/volgan_southern_dominion.md` | `zin_volgan_add_dominion_strength`, `zin_volgan_add_veil`, variable `zin_volgan_pact`, global flags `zin_volgan_marches`, `zin_volgan_body_destroyed`; Volgan tree focus `zin_volgan_goldoroth_question` |
| Lerendor, `modules/mech_lerendor.mjs` (exists) | `04_mechanics/lerendor_narrow_strait.md` | `zin_leren_add_lean`, variable `zin_leren_lean`; Lerendor tree focuses `zin_lerendor_friends_of_the_dark_sea_accord`, `zin_lerendor_bargain_with_goldoroth` |
| Aenor, `modules/mech_aenor.mjs` (exists) | `04_mechanics/aenor_court_and_succession.md` | variables `zin_court_corruption`, `zin_aenor_lost_cause` |
| diplomacy, `modules/diplomacy.mjs` (exists) | `03_gameplay/03_diplomacy_and_factions.md` | the cause `zin_cb_orc_raids`, the name and description of `zin_cb_hold_defiance`, autonomy states `zin_autonomy_tributary_hold`, `zin_autonomy_sworn_realm`, the faction `zin_faction_dark_sea_accord` at the start, the event `zin_diplo.23` (not defined anywhere yet) |
| Zol's Mistake, `modules/mech_zol.mjs` (exists) | `04_mechanics/zols_mistake.md` | global flag `zin_zol_rising` |
| economy, `modules/economy.mjs` | `03_gameplay/02_economy.md` | country flag `zin_region_dark_lands` |
| peoples, `modules/peoples.mjs` | `00_foundation/03_peoples.md` | country flags `zin_people_orcs`, `zin_people_trolls`; `zin_people_minor_goblins` has no owner yet (owner's short list 12) |
| Goldoroth tree (focus compiler) | `05_focus_trees/major/goldoroth.md` | ideas `zin_goldoroth_quarrelsome_clans`, `zin_goldoroth_warrens_heard`, `zin_goldoroth_sworn_to_nafeher`; flags `zin_goldoroth_raids_open`, `_moot_open`, `_sway_open`, `_swift_raids`, `_blood_price`, `_contests`, `_tallymen`, `_centralised`, `_master_of_clans`, `_heir_<bloc>`, `_yoke_cheap`, `_light_yoke`, `_hard_yoke`, `_clash_open`, `_no_masters`, `_southern_bargain`, `_hunt_open`, `_corsairs`, `_tolls_open`, `_strait_wardens`, `_mercy`, `_ash_rites`; global flag `zin_dark_truce_against_dead` (`zin_goldoroth.18`); the callers of `zin_goldoroth_kneel` (`zin_goldoroth.14`) and of the war-goal, claim, rally and proclamation effects; recruiting `zin_goldoroth_rask` |
| regional Dark Lands trees | `05_focus_trees/regional/dark_lands.md` | `zin_regional_dondor_beacon_chain`, `zin_regional_dondor_muster_drill`, `zin_regional_blackton_paid_corsairs`, `zin_dark_trolls_for_pay` (Troll Forest) |
| lore flavour events | `02_lore/04_fourth_age_history_for_play.md` | `zin_lore.161` sets `zin_dark_took_southern_gifts` |
| heraldry, `data/world/heraldry.json` | `00_foundation` heraldry | cosmetic tag `zin_cosmetic_goldoroth_great` |
| warfare, vanilla removal, portraits, ui | `03_gameplay/01_warfare.md` and the interface specs | equipment `zin_arms_equipment`; advisor traits `zin_adv_sage`, `zin_adv_war_speaker`; leader traits `offensive_doctrine`, `trickster`; sprites `GFX_zin_portrait_orcs_*`, `GFX_zin_frame`, `GFX_zin_button`, `GFX_zin_rule` |

## Events it fires but does not define

`zin_dark.80` "Dead on the Dark Shore" and `zin_dark.82` "The South Falls Silent" belong to the war events spec (`06_events/03_war_of_the_last_crowns.md`).
They are fired through two hooks that act once: `zin_dark_on_zol_rising` (every Dark Lands country with a northern-strait shore or an Kusmeel coast) and `zin_dark_on_body_destroyed` (every Dark Lands country recorded as sworn, pact 3 or Volgan's subject, by `zin_dark_was_sworn` before the fall).
The pulse calls both when it sees `zin_zol_rising` or `zin_volgan_body_destroyed`; the Zol rising and Volgan's broken body may call them directly to fire the same day, and must not fire `zin_dark.80` or `.82` themselves.
`zin_diplo.23` (the honorary-crown invitation) is fired by `zin_dark.30` and is the diplomacy slice's.
`zin_dark.80`'s option uses the spirit `zin_dark_watch_the_shore`, defined here.

## Spec conflicts and choices

- The pulse runs on `on_monthly_<Goldoroth>` and `on_monthly_<Dondor>` behind `zin_dark_is_runner`, not as a 30-day self-scheduling `zin_dark.1`; `zin_dark.1` is the start only. The half-written module ran it from an every-country `on_monthly` block: that block is gone (see Findings).
- `zin_diplo_grant_cb` is not called: no module defines it, and its `cb` argument cannot be a temporary variable. The two causes are added in the diplomacy spec's form (`add_dynamic_modifier` with the target as scope, 365 days).
- `zin_autonomy_tributary_hold` is written by the diplomacy module (`data/diplomacy_subjects.json`), not in the spec's `common/autonomous_states/zin_tributary_hold.txt`. Its `min_freedom_level` there is 0.35; this spec says 0.4. The diplomacy data needs that change (outside this slice).
- The decision is `zin_dark_levy_shore_tolls`: the spec's `zin_dark_shore_tolls` is also the opinion modifier's id.
- A tree flag that changes a cost, cooldown or threshold makes a second decision that shares the text; both set a cooldown flag for the shorter wait, so switching variants never skips a cooldown.
- Option order follows the spec where the half-written module had reversed it (E2: a timed-out event takes the first option): Join for `.20`, Bend the knee for `.50`, Swear for `.70`, The Moot rides for `.71`.
- The border clash callbacks are the hidden `.2`, `.3`, `.4`, which apply the result once and fire `.16`, `.17`, `.18` to Goldoroth and Dondor. The states come from event targets, as vanilla `FRA.txt` does.
- `zin_dark.45` "A New Warking" is a news event for the Dark Lands; the succession itself runs in `.44`'s option, whose win chance is drawn from 50 + War-Clans favour / 4, at most 75.
- `.42` "Then let them raid": the raid's own +8 plus +2, so +10 in all.
- `.10` and `.85` carry no effect: the raid results and the hunt's opinions are applied where they happen. The hunt no longer adds `zin_dark_refused_nafeher`.
- The blood-price decision pays its 40 Authority as its cost and does not pay again; the victim's option pays 40.
- The beacons give resolve +3 to an Accord member; a hold outside the Accord gets the opinion of Dondor +5 instead.
- Only a raid on an Accord member adds to the Gathering Dark and resets the 90-day calm of the border.
- AI chances follow the spec's formulas in ten-point steps of the variable they read (an `ai_chance` reads no variables). The refusal or decline options mirror the accept steps so the two come to about 100.
- The challenge has a 365-day guard (`zin_goldoroth_challenged`) so a bloc left low by the succession does not challenge every month.
- `zin_goldoroth_warking_takes_field` acts on the reigning Warking (the country leader), not on Britag.
- `zin_goldoroth_kneel` sets the Shadow government with `set_politics` and the stance through `zin_politics_set_stance`.
- `zin_goldoroth_wargoal_strait_south` pastes the chosen state into a `take_state` war goal through `meta_effect` (a generator takes state ids only).
- The levy on a strait's far shore is read as Lerendor's (north) or Aenor's (south), not "the far shore's largest owner".
- Sea mastery counts every country that owns a Sea of Darkness coast state, not only Dark Lands countries; the spirit moves only when the master changes.
- The holds are the orc and troll realms of the people assignment. Blackton takes gifts, Show the Host, the Accord's invitation and the envoy hunt; the Iron Yoke and the marriage go only to holds, so Blackton is never yoked.
- `allowed` blocks name tags: they are read when the game starts, before any startup flag.
- Goldoroth befriends Dulundur, Bordon and Dreson (the tier B holds with the highest start sway) rather than a monthly choice of the three highest; it conquers defiant holds first at war and sworn holds after Volgan marches on the Black Iron route.
- `zin_goldoroth_rally_free_dark`'s "+10 opinion" uses `zin_dark_gifts` (+10).
- The on_declare_war "Accord membership checks" refresh the shield when a Dark Lands country is a party.
- The windows use the interface spec's names (`zin_horde_window`, `zin_accord_window`, `zin_ui_horde_open`, `zin_ui_accord_open`) with their own visibility triggers until `zin_ui_has_horde_panel` and `zin_ui_has_accord_panel` exist. They show text rows and dynamic lists, not gauges; each opens from a launcher beside the Realm button.
- A hold sees only its own sway band, as the line `[ROOT.zin_dark_sway_line]` of the Free Holds category.

## Findings

- Every-country periodic actions: the half-written `common/on_actions/zin_dark.txt` had an every-country `on_monthly` block. It is replaced by `on_monthly_<Goldoroth>` and `on_monthly_<Dondor>`; the slice has no `on_daily`, `on_weekly` or `on_monthly` left.
- Rule breaks fixed in the module: an unscoped `has_dynamic_modifier` on targeted causes; a raw `has_game_rule` read; a pact effect that lowered a sworn country to 2; the sway caps applied out of order (Blackton in the Accord would have kept 40); the Accord's blood-price paid twice; the Moot's call sent to the attacked member itself; a joiner given opinion of itself; raw flags in `available` blocks (now tooltipped); Show the Host using the -15 raid opinion; the border clash reading stale global state variables; the Warking's field role given to Britag.

## Zol correction footprint

This slice reads no Zol-manifestation name: no `zin_zol_manifested`, no `zin_zol_manifest`, no text that brings Zol in person (the test refuses one).
Its Zol names are `zin_zol_rising` (read by the pulse), the Zol tag in `zin_dark_shore_barred` and `zin_goldoroth_offer_access_against_dead`, and the hook `zin_dark_on_zol_rising` that fires the events slice's `zin_dark.80`.

## Art

Every event uses an existing catalog picture: `generic_war` (raids, clashes, the horde, the Moot's ride, news), `generic_sea` (Black Sails), `generic_court` (moots, the yoke, the Accord, Parim), `generic_peace` (the clash ends), `generic_wilds` (Troll Silver), `leren_envoys` (Notbuton calls on the North), `southern_warning` (Envoys Hunted).
Wanted, not in the catalog: a fire-lit moot hall at Cocanoor under the Fire-Mountain (moots, challenges, the new Warking), an orc raid on a border steading (raids), a black-sailed galley raid (corsairs), a hold's chief bending the knee (the Iron Yoke), the moot stone of the free holds (the Free Moot), the beacon chain on the dark coast (the Accord), the Troll Forest (Troll Silver), Cocanoor's banners over the inner Dark (the unity and one-kingdom news).
Every spirit, category and decision icon is a catalog icon; the spec's dedicated icons are not drawn.
The windows use `GFX_zin_frame`, `GFX_zin_button`, `GFX_zin_rule` and `GFX_closebutton`; the interface spec's headers `GFX_zin_header_horde` and `GFX_zin_header_accord`, the gauge sprites and a launcher icon do not exist yet.
Portraits use the existing orc sprites `GFX_zin_portrait_orcs_male_1`, `_male_2`, `_female_1`; the six characters have no portraits of their own.

## Open items

- The site triggers, `zin_politics_set_stance`, `zin_world_add_gathering_dark`, `zin_diplo.23`, `zin_people_minor_goblins` and the tree flags stay inert until their owners land.
- The diplomacy data should set `zin_autonomy_tributary_hold`'s `min_freedom_level` to 0.4 (spec section 5).
- The interface module should take over the two windows (`panels: false`) with gauges, the heir mark and paged rows.
- The Zol and Volgan modules may call `zin_dark_on_zol_rising` and `zin_dark_on_body_destroyed` for same-day events.
- The spec's scenario acceptance items (12-year AI run, `SWORN_TO_VOLGAN` route, border-war state owners, the slow-pace war floor in game) need a live run; the offline evidence is the 32 tests, including the engine-vocabulary check against the installed effect, trigger and modifier documentation.
