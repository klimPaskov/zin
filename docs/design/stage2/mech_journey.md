# Stage 2: the Journey mechanics (Eindil, Yeldenne and Glo, the Western Crossing)

Implements `docs/specs/04_mechanics/eindil_journey.md`, `yeldenne_and_glo.md` and `western_crossing.md`.
Modules: `tools/content/modules/mech_yeldenne.mjs`, `mech_eindil.mjs` (with `mech_eindil_scripts.mjs`), `mech_crossing.mjs`.
Shared helpers: `tools/content/lib/mech_journey_lib.mjs`. Data: `tools/content/data/mech_journey_{glo,eindil,west,geography}.json`.
Test: `tools/content/mech_journey.test.mjs` (51 tests, listed in `tools/package.json`).

## 1. Wiring into `build.mjs`

None of this is wired yet (the brief forbids editing `build.mjs`). The integrator adds, in this order and before `buildVanillaRemoval`
(its reference scan must see these files). `countries` is the roster loaded from `data/countries.json`:

```js
import { buildYeldenneGlo } from './modules/mech_yeldenne.mjs';
import { buildEindilJourney } from './modules/mech_eindil.mjs';
import { buildWesternCrossing } from './modules/mech_crossing.mjs';
// after the flag/country modules (Eindil's host flag reads Selen's staged flag), before buildVanillaRemoval:
const glo = await buildYeldenneGlo(staged, { countries });
const eindil = await buildEindilJourney(staged, { countries });
const west = await buildWesternCrossing(staged, { countries });
```

Each call returns `{ counts, definitions, scripts, dependencies, files, localisation, startup, tags }`
(Eindil adds `stageFloors`, `firedEvents`; the crossing adds `anchors`, `geography`; Glo adds `hallState`).
Feed `definitions` into the cross-slice definition check and `dependencies` into the "named but undefined" report.

Options: `ctx.eindil.hostFlag === false` skips the derived flag (`gfx/flags/zin_host_of_eindil.tga` and the `medium`/`small` sizes,
graded toward ice blue from Selen's flag). `ctx.eindil.cosmeticFile` stages `common/countries/cosmetic.txt`. Tests may pass
`gloData`, `eindilData`, `westData` to replace the JSON.

`node tools/content/write_journey_geography.mjs` regenerates `data/mech_journey_geography.json` (Middle Lands states, ports, 5 westernmost
mainland ports, 14 strategic regions) from the map data.

## 2. Files written (50 in all)

Yeldenne and Glo (16): `common/script_constants/zin_glo_constants.txt`, `common/ideas/zin_glo.txt` (5 spirits),
`common/country_leader/` and `common/unit_leader/zin_yeldenne_glo.txt`, `common/dynamic_modifiers/zin_glo.txt` (3),
`common/opinion_modifiers/zin_glo.txt` (2), `common/characters/zin_yeldenne_glo.txt` (the Warden, `zin_yeldenne_warden`),
`events/zin_glo.txt` (23), `common/decisions/categories/zin_glo.txt` (2), `common/decisions/zin_glo.txt` (8),
`common/scripted_triggers/zin_glo.txt` (12), `common/scripted_effects/zin_glo.txt` (32), `common/on_actions/zin_glo.txt`,
`common/ai_strategy/zin_glo.txt`, `interface/zin_glo.gfx`, `localisation/english/zin_glo_l_english.yml` (132 keys).

Eindil (19): constants, `common/ideas/zin_eindil.txt` (14), unit and country leader traits (12), opinion modifiers (6), characters
(`zin_eindil`, `zin_varner`, `zin_golbran`, `zin_eindil_companion_1/_2`), scripted triggers (36), scripted effects (70),
`events/zin_eindil_mech.txt` (hidden `.1` and `.2`), decision categories (3: guest, host, palace) and decisions (10),
`common/game_rules/zin_eindil.txt` (`zin_rule_eindil_journey`), on_actions, ai_strategy, the three host flags, `interface/zin_eindil.gfx`,
`localisation/english/zin_eindil_mech_l_english.yml` (145 keys).

Western Crossing (15): constants, ideas (9), `zin_west_strain_mod`, opinion modifiers (6), `events/zin_west.txt` (35 events),
categories (2: council, crossing) and decisions (10, one a mission), triggers (17), effects (37), `zin_rule_west_route`, on_actions,
`common/ai_areas/zin_west.txt`, ai_strategy, `interface/zin_west.gfx`, localisation (190 keys).

## 3. Design in brief

- **Pulses.** No `on_daily`, `on_weekly` or `on_monthly`. Each mechanic runs a hidden event that re-arms itself every 7 days
  (`zin_glo.2`, `zin_eindil.2`, `zin_west.2`; the crossing does its monthly part every 4th pulse).
- **Arguments.** Scripted effects take none (E1); callers set temp variables `zin_arg_<name>` first.
- **Story pace (V4/R2).** Dates are compared as `date > X` in three OR branches on `global.zin_story_pace`. The Eindil stage floors are day
  offsets compared with `global.zin_eindil_age` (clock minus delay); stage 1 uses `global.zin_eindil_wake_age`
  (rule EARLY/LATE plus 0..20 days of jitter). Peace gates in decisions are fixed dates; floors are paced.
- **Eindil stage machine.** `zin_eindil_pulse` runs `update_clock`, `flag_watch`, `guest_rules`, `stage_runner`, `check_advance`.
  `zin_eindil_ready_1..12` are the stage triggers; the highest ready stage starts (`zin_arg_to`). Hosts are stored in globals
  (`zin_eindil_ice_host`, `bridge_host`, `ford_host`, `trial_host`, `confed_leader`, `departure_host`, `wreck_host`, `reef_host`,
  `shrine_host`, `gala_host`, `port_1..3`, `landing_host`, `stage8_host`, `host_candidate`).
- **Glo.** The hall pulse goes to the owner of Mp'E (state 1063). `zin_glo_resolve_hall` takes `zin_arg_case` (A, B1, B2, C, D). Score is
  wards plus 30 plus 10 plus 10 plus random(-10..10) minus the attacker (15 per `global.zin_afrit_artifacts`, or 40 for Volgan). Only
  `zin_glo_transfer` moves the Glo state (`zin_arg_to` 1/2/3).
- **Crossing.** The Winter Ford and Three Oaths feud is a border war (`start_border_war`, `on_win = zin_west.23`, ending through
  `zin_west_end_ford_war` with `how` 0/1/2). Landing and evacuation ladders are generated from the geography file.

## 4. Event references

Defined here (the mechanic's own): `zin_glo.1`, `.2`, `.3` (hidden), `.5`, `.11`, `.20-.25`, `.30`, `.40`, `.41`, `.50`, `.51`, `.60-.64`, `.70`, `.80`;
`zin_eindil.1`, `.2` (hidden); `zin_west` (35 events including the added `zin_west.3`, The Question of the Sea).

Referenced, defined by the events engineers (`events_eindil.mjs`, `docs/specs/06_events/02_eindil_journey.md`), all `zin_eindil.*`:
10, 12, 20, 23, 30, 31, 33, 40, 45, 46, 50, 60, 61, 70, 73, 80, 84, 86, 90, 94, 96, 98, 99, 100, 102, 130, 131, 132, 140, 163, 169.
`.97`, `.101` (Zol's) and `.140` are not fired by the pulse. `.140` is reached through the provided `zin_eindil_lose_heir`.
The `zin_eindil.1`/`.2` events share the `zin_eindil` namespace with `events/zin_eindil.txt`; a repeated `add_namespace` is harmless.

Hooks and helper effects for the events engineers (all defined here): `zin_eindil_lose_heir`, `zin_eindil_cliff_effects`,
`zin_eindil_recover`, `zin_eindil_name_him`, `zin_eindil_make_dragon_pact`, `zin_eindil_to_the_forest`, `zin_eindil_palace_reset`,
`zin_eindil_hold_guest`, `zin_eindil_refresh_layouts`, `zin_eindil_refresh_portrait`, `zin_eindil_set_host` (`zin_arg_role` 0/1 corps
commander, 2 field marshal, 3 advisor "Guest of Lorien", 4 none), `zin_eindil_compute_ambush` (formula N9, hook `zin_eindil_ambush_resolved`),
`zin_eindil_battles`, `zin_eindil_raise_host`, `zin_eindil_create_dynamic_host`, `zin_eindil_go_to_parim`, `zin_eindil_after_coronation`.
For Afrit and others: `zin_glo_hall_historical`, `zin_glo_heir_arrives`, `zin_glo_afrit_strikes`, `zin_glo_follow_bearer`.

## 5. Dependencies on other slices (not defined here)

The full list is in each module's `dependencies`. The ones that matter:

- Afrit (`afrit_hidden_council`): `zin_afrit_artifacts`, `_at_yeldenne`, `_hall_at_once`, `_is_hub`, `_rules_here`, `_wound`, `_begin_palace_battle`,
  `_claims_aoaz`, `_dead`, `_holds_parim`, `_returned`, `_revealed`, `_seat_whispers`, `_sent_others`, `_stand_in_parim`, `zin_worshipdom_*`.
- Aenor: `zin_aenor_is_realm`, `zin_aenor_people_choose` (called by `.130`), `zin_aenor_ruled_by_captains`, `zin_lost_cause_member`.
- Key sites (`sites.mjs`, E7): `zin_is_site_{eindil_ice,parim,south_shrine,three_oaths,winter_ford,yeldenne_landing}`, `zin_aenor_fallback_seat`,
  `zin_controls_sea_central`, globals `zin_site_{parim,three_oaths,winter_ford}`. Until then the stand-in file fakes them.
- Foundation rules: `zin_rules_is_historical`, `zin_rules_is_free`, `zin_rule_eindil_waking`.
- Characters: `zin_horos` (see section 6), `zin_alleria`.
- Diplomacy: `zin_cb_broken_truce` (the crossing grants it as a dynamic modifier with `scope = <target>` because `zin_diplo_grant_cb` does
  not exist), `zin_faction_western_crossing`, `zin_faction_lost_cause`, `zin_diplo_is_dark_power`, `zin_opinion_grey_ford_truce`.
- World systems: `zin_world_add_gathering_dark`, `zin_world_is_dragon_keeper`, `zin_gathering_dark`, `zin_war_grant_dragons`,
  `zin_elves_add_roost_bond`, and the world flags (`zin_war_of_last_crowns`, `zin_zol_rising`/`_manifested`/`_withdrawn`, `zin_eindil_crowned`,
  `_named`, `_returned`, `_war_king`, `zin_aurevan_crowned`, `zin_golden_king_dead`, `zin_eastern_invasion`, `zin_volgan_marches`).
- Regional trees: `zin_regional_yeldenne_glernaens_wards`, `_wards_2`, `_seal_keepers`, `zin_yeldenne_guides`, the Gunwaith ideas,
  `zin_west_old_claims`, `zin_asgard_harbours_barred`, `zin_leren_*`, `zin_east_companies_with_eindil`, `zin_gala_great_ship`, `zin_cold_hall_respected`.
- Economy: `zin_region_{west,east}_lands` country flags set on startup (`zin_region_middle_lands` is read by the Eindil scripts).

## 6. Spec conflicts and choices

- `zin_horos` is the contract id of the Yeldenne ruler, but the current character is `Y8H_zin_ruler`. The characters module must rename it.
- `zin_glo_wave` is state-scoped (the spec's `state` argument is dropped); `zin_glo_wave_battlefield` calls it on `global.zin_eindil_battlefield`.
- Battlefield selection is a random Zol-held, Aenor-cored state, not "most divisions" (no portable count trigger).
- `zin_glo.50/.51` use ungated `generic_wilds` and `ember_lands_storm` pictures in place of the gated `vast_shadow`.
- Conditional costs use twin decisions: `zin_glo_seek_as_bearer_called`, `zin_eindil_rally_rebels_unaided`.
- The spec id `zin_west_crossing_host` is the template id; its display name is "Crossing Host".
- `zin_west_choose_course` and `zin_west_convene_council` exist as both a decision and an effect (different kinds, no clash).
- The per-friend `befriend` strategy in `zin_eindil_join_coalition` uses `meta_effect`; it is untested in the game.
- `zin_west_envoy_welcome` is in the data file, not in the module.

## 7. Art needs (none are drawn here)

Decision and category pictures for the 8 Glo, 10 Eindil and 10 crossing decisions and the 7 categories (the gfx files point at existing sprites
until art arrives); Eindil portraits E1 to E7 and the Warden portrait; the `zin_host_of_eindil` flag (derived automatically, redraw welcome);
the `yeldenne_hall` news crop; icons for the two game rules (none exist). The specs describe no GUI window for this slice, so the interface track has
nothing to build; the decisions use the stock decision screen.

## 8. Open items for the integrator

1. Wire the three calls (section 1) and add the cosmetic tag entry if `ctx.eindil.cosmeticFile` is used (the Host of Eindil needs its tag name in `cosmetic.txt`).
2. Register the focus argument codes for `zin_eindil_aid_host` `type` and `zin_eindil_set_host` `role` in `focus_arg_codes.json` (not done: the file is not mine).
3. Remove the stand-in definitions from `zz_zin_pending_triggers.txt` for names defined here (see `definitions`).
4. Rename `Y8H_zin_ruler` to `zin_horos` (section 6).
5. Rule texts: `zin_rule_eindil_journey` ("The Stranger's Road") and `zin_rule_west_route` ("The West's Course") carry their option names and descriptions in the data files and localisation; DEFAULT follows the Historical Path rule. Neither rule has an icon.
6. The Linux-run and scenario acceptance lines from the specs were not run.
7. `build.test.mjs` "The build is deterministic" fails because the whole build stops on the asset baseline check (813 new `UNIQ_EVENT_CHAIN` errors in `events/zin_stabilo.txt`
   and similar, from another slice); it is not caused by these modules, which are not wired.

## Integration round 3 (24 October 2026)

The three modules are wired in `tools/content/build.mjs` (`integration_r3.md`, section 1); the Host of Eindil flag is not staged (`hostFlag: false`: a recolour made in code is new art, listed in `docs/plans/zin-art/pending_from_integration.md`). The Glo decision category `zin_glo_bearer` is `zin_glo_cat_bearer` (its text key collided with the warfare sub-unit of the same id), and the Glo and West decision sprites carry the prefixes `zin_glo_` and `zin_west_`. The names this slice uses from owners not yet written are declared in `tools/content/data/pending_names.json`. Items 1 and 3 of section 8 are done; items 2 and 4 remain.
