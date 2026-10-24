# Mechanics: the Elves, Lerendor and Volgan powers

Slice: `docs/specs/04_mechanics/elves_wall_and_dragons.md`, `lerendor_narrow_strait.md`, `volgan_southern_dominion.md`.
Modules: `tools/content/modules/mech_elves.mjs`, `mech_lerendor.mjs`, `mech_volgan.mjs`, `mech_powers_ui.mjs`.
Libraries: `lib/mp_kit.mjs` (definition registry, builders, story-pace dates), `lib/mp_check.mjs` (offline command-vocabulary check
against the installed effect and trigger documentation), `lib/mp_gui.mjs` (panel builder), `lib/mp_volgan_core.mjs`,
`mp_volgan_pulse.mjs`, `mp_volgan_content.mjs`.
Data: `data/mech_powers_{elves,lerendor,volgan}.json` (numbers, names, externals) and `*_text.json` (all player text).
Test: `content/mech_powers.test.mjs` (30 tests, in the `npm test` script).

## Wiring in build.mjs

Call after `buildInstitutions` and before the pending-trigger stand-in computation, in this order:

```js
const powersElves  = await buildElves(staged,   { countries, table });
const powersLeren  = await buildLerendor(staged, { countries, table });
const powersVolgan = await buildVolgan(staged,  { countries });          // { defineVolgan: false } is the default
const powersUi     = await buildPowersUi(staged, { countries });
```

Each build returns `{ kit, counts }` and throws on a text, id, picture or reference error. `buildPowersUi` must run last: it reads
the three kits' panel data from the staged files.

## Files written

Per module: `common/scripted_effects/`, `scripted_triggers/`, `decisions/` (+ `decisions/categories/`), `ideas/`, `dynamic_modifiers/`,
`opinion_modifiers/`, `events/`, `on_actions/`, `ai_strategy/`, `common/game_rules/` (Lerendor route, Volgan early war and spirit),
Volgan's `characters/` and `traits/`, `localisation/english/zin_{elves,lerendor,dominion}_l_english.yml`, and a
`interface/zz_zin_*.gfx` per module. The UI module writes `interface/zin_mech_powers.gui`, `common/scripted_guis/zin_mech_powers.txt`,
`common/scripted_localisation/zin_mech_powers.txt`, `interface/zz_zin_mech_powers.gfx` and
`localisation/english/zin_mech_powers_l_english.yml`. Windows: `zin_dominion_window` (open trigger `zin_ui_dominion_open`),
`zin_watch_window` (`zin_ui_watch_open`), `zin_strait_window` (`zin_ui_strait_open`).

Counts: Elves 28 effects, 19 triggers, 17 decisions in 3 categories, 11 ideas, 24 events, 3 dynamic modifiers, 7 opinions, 24 AI
strategies. Lerendor 18 effects, 34 triggers, 9 decisions in 2 categories, 8 ideas, 17 events, 3 dynamic modifiers, 7 opinions,
the rule `zin_rule_leren_route`. Volgan about 42 effects, 30 triggers, 16 decisions in 3 categories, 10 spirits, 16 events, 2 dynamic
modifiers, 5 opinions, 6 characters and one trait, 2 rules.

## Pending-trigger stand-ins now defined here

`zin_elves_is_magical_realm`, `zin_leren_is_north_crown`, `zin_leren_is_dark_shore`. The inert stubs in
`zz_zin_pending_triggers.txt` vanish on the next build once these are defined (the build computes the stubs from what is undefined).

## Hooks for the events slice

Events written here (fired and defined): all `zin_elves.*` except .9, .51, .70, .71; all `zin_lerendor.*` except .14; the Lerendor
start and strait events; Volgan's start and pulse events. Events written by the events slice and only *fired* here:
`zin_dominion.10` to `.14`, `.17` to `.19`, `.23`, `.24`; `zin_elves.9`, `.51`, `.70`, `.71`; `zin_leren.30` to `.33`, `.35`, `.36`;
`zin_lerendor.14`; `zin_volgan.8`. Their options should call these effects: `zin_dominion_champion_falls`,
`zin_dominion_member_breaks_free`, `zin_dominion_let_mirolon_go`, `zin_dominion_hold_mirolon`, `zin_dominion_end_compact`,
`zin_volgan_strike_zol`, `zin_dominion_war_started`, `zin_dominion_mirolon_falls`, `zin_dominion_mirolon_capitulated`.

## External dependencies (unresolved until their owners land)

- Tree focuses: `zin_lerendor_faithful_to_the_crown`, `_hold_the_capes`, `_strait_watch`, `_the_watch_holds`,
  `zin_magical_forest_close_the_wall_roads`, `zin_volgan_descend_into_the_abyss`. The tree flags `zin_lerendor_*` (tree spec) and
  `zin_leren_*` (mechanic spec) are both honoured through `zin_leren_tree_<key>`.
- Foundation game rule `zin_rule_dark_powers` (option AGGRESSIVE); wrappers `zin_rules_*`, `zin_world_*` (`zin_world_add_gathering_dark`,
  `zin_world_give_dragon`), `zin_afrit_add_footholds`, `zin_economy_add_gold`, `zin_diplo_*`, `zin_aenor_event_for_parim`.
- Sites triggers `zin_is_site_*` and `zin_is_region_north_lands` (the map and site slice).
- Idea `zin_elves_the_old_refusal`, spirits `zin_magical_forest_wyrm_songs`, `zin_shared_magical_lands_wyrm_songs`, character
  `zin_magical_forest_perlan`, character `zin_volgan` and `zin_eindil` (characters slice; see conflict below).
- Warfare: `unlock_subunit = zin_abyss_folk` in `zin_volgan_spawn_abyss_host` (the id list `data/warfare_ids.json` must keep it;
  the build refuses otherwise). Technologies: `zin_rules_skies_*` need nothing from this slice.
- The Kindred faction template, joining rule `zin_faction_rule_join_elven_kin` and manifest belong to the diplomacy slice; the Elves
  mechanic only calls them.

## Spec conflicts and choices

- Module names: the brief's `mech_lerendor`/`mech_volgan` are used, not the specs' longer names.
- `take_state` wargoals are replaced by claims plus `take_claimed_state` (script cannot name state ids without the map).
- The fallback runner for Magical Lands picks the first realm, not the largest.
- Healers and wardens costs refresh monthly (variable costs); Wanderer missions use three timed slot flags.
- Start events fire one day after start. Lerendor dates are plain per spec; Elves and Volgan floors are story-pace shifted.
- `zin_volgan` as a character conflicts with the focus compiler check F3 (character id equal to tree id `volgan`), so
  `defineVolgan` defaults to false. Define him in the characters slice under a different id or relax F3.
- New names added: `zin_elves_in_kindred`, `zin_elves_realm_occupied`, `zin_elves_dark_power_holds_state`, `zin_elves_is_elven_country`
  (every realm of the elf people, Gala included), `zin_elves_tends_roosts`, `zin_elves_wanderers_room`, `zin_elves_open_gates`,
  `zin_elves_bar_gates`, `zin_leren_appeal_heard`, `zin_leren_marriage_ties`, `zin_leren_gate_*`, `zin_dominion_watch_with_mirolon`,
  `zin_dominion_clash_ready`, `zin_dominion_compact_active`.

## Art

Decision and category pictures reuse catalog icons through `interface/zz_zin_*.gfx`; window markers use catalog icons; portraits use
existing people sprites. Event pictures `dragon_roosts`, `elven_moot` and `rift_sails` are requested but not yet used.

## Open items

- The Volgan panel shows counts, not Dark Lands rows; the Mirolon cooldown shows ready or waiting.
- Disposition rows for `common/unit_leader` and `common/characters` may need the new files.
- Ideas, characters and opinions are "pending categories" in the current `computeBridges` call.
- MCP `hoi4_script_validate` could not be used (no registered workspace); evidence is the offline `mp_check.mjs` vocabulary check
  (0 problems) and the 30 tests.
