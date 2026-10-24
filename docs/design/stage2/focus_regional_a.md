# Focus slice regional_a: Cold Lands, Dark Lands and Ember Lands tier B trees

**Date:** 19 October 2026. **Specs:** [cold_lands.md](../../specs/05_focus_trees/regional/cold_lands.md), [dark_lands.md](../../specs/05_focus_trees/regional/dark_lands.md), [ember_lands.md](../../specs/05_focus_trees/regional/ember_lands.md).

## What this slice is

17 tier B tree data files, one per country, compiled by the existing `modules/focus_compiler.mjs`. This slice adds **no builder module**: nothing to wire in `build.mjs`. The compiler already reads `docs/design/focus/*.json`.

| Region | Trees (focuses / spirits / events) |
| --- | --- |
| Cold Lands | `regional_isengard` 45/8/2, `regional_horidor` 32/10/1, `regional_windwaith` 34/9/2, `regional_fearno` 37/9/3, `regional_titanos` 30/6/1, `regional_yeti_lands` 30/8/1 |
| Dark Lands | `regional_dondor` 49/16/8, `regional_blackton` 39/14/6, `regional_dulundur` 36/10/4, `regional_bordon` 31/6/4, `regional_dreson` 31/10/2, `regional_troll_forest` 30/9/3 |
| Ember Lands | `regional_nezer` 32/9/3, `regional_demon` 30/6/3, `regional_dolon` 30/7/2, `regional_olen` 32/10/6, `regional_nan` 30/10/7 |

Totals: 578 focuses, 157 spirits, 58 events (94 options), 42 tree-declared scripted effects, 34 scripted triggers, 24 opinion modifiers, 11 AI strategies, 0 new art keys. Every focus has full localisation text (name and description), every spirit, event and option has text. The compiler writes the usual files per tree (`common/national_focus/zin_<tree>.txt`, `common/ideas/zin_focus_<tree>.txt`, `events/zin_<tree>.txt`, scripted effects and triggers, opinion modifiers, AI strategies, `localisation/english/zin_focus_<tree>_l_english.yml`).

## Files written

- `docs/design/focus/regional_<name>.json` x 17 (the tree data, source of truth).
- `tools/content/data/focus_registry_regional_a.json`: names of other owners that the trees use and the compiler cannot yet read from staged files. The compiler's `loadRegistry` already merges every `focus_registry_<slice>.json`. Remove a name when its module lands. It lists no name that a tree declares (`zin_shared_cold_lands_lean_neighbours` is the Cold shared tree's, `zin_shared_has_coast` the Concord shared tree's), because a registry name that a tree also declares fails as a collision.
- `tools/content/focus_regional_a.test.mjs` (52 tests, added to the `test` script of `tools/package.json`).
- This note.

No shared file was edited (`focus_registry.json`, `build.mjs`, other modules untouched).

## Mechanic names the trees call (owners must write them)

Effects: Cold `zin_cold_add_lean`, `zin_cold_add_lean_all`, `zin_cold_add_defiance`, `zin_cold_start_march_war`; Dark `zin_goldoroth_add_sway` (`target`, `value`), `zin_goldoroth_add_temper`, `zin_dark_add_accord_resolve`, `zin_dark_add_border_tension`, `zin_dark_add_volgan_pact` (`target`, `value`), `zin_dark_found_free_moot`, `zin_dark_join_free_moot` (new hooks, see dark_lands spec section 6); Lerendor `zin_leren_add_lean`, `zin_leren_offer_protection` (`target`); Dead `zin_volgan_add_oath` (`target`, `value`), `zin_volgan_add_dominion_strength`, `zin_volgan_add_nether_pact`, `zin_mirolon_add_proof`; journey `zin_eindil_add_regard`, `_renown`, `_aid_host` (`manpower`, `equipment`, `type`: 0 arms, 1 giant gear, 2 yeti gear), `_join_coalition`; `zin_lost_cause_add_strength`; `zin_afrit_add_footholds`; `zin_west_add_fleet`.
Triggers: `zin_cold_historical`, `zin_cold_march_war_allowed`, `zin_dark_is_accord_member`, `zin_dark_is_tributary` (listed as an allow_branch refresh check: tributary status changes only at the E4 refresh points), `zin_eindil_friend`, `zin_goldoroth_seeks_the_south`, `zin_lost_cause_exists`, `zin_rules_is_historical`, `zin_rules_is_free`, `zin_is_site_isengard_march`.
Events: `zin_dark.30`, `.31`, `.75` (named by focuses); `zin_dark.20` and `.71` (fired from raw helper effects). Ideas: `zin_cold_harbour_compact`, `zin_dark_troll_hirelings`. Faction template: `zin_faction_free_steadings` (Fearno's *Call the Free Steadings*; joining rule from the diplomacy spec). Flags read: `zin_dark_moot_member`, `zin_dark_refused_yoke`, `zin_dominion_own_road`, `zin_leren_dark_shore`, `zin_dominion_tributary_friend`, `zin_mirolon_league_friend`, `zin_cold_isengard_sworn` and the story flags of the contract.
Names used only inside raw helper bodies (not checked by the compiler): `zin_cold_is_clan_realm`, `zin_dark_is_hold`, `zin_dark_is_free_hold`, `zin_dark_date_defiance_cb`, `zin_is_site_goldoroth_march`, `zin_cold_accord_kin`, `zin_goldoroth_unity`, `zin_dominion_oath`, `zin_volgan_nether_bargain`, `_nether_bent`, `_gate_pact`.

Characters: the six Cold trees recruit `zin_regional_<tree>_<person>` (`brana`, `veska`, `tarvo`, `maela`, `odo`, `tamsin`, `ilse`, `hroth`, `hrimla`, `skarn`, `sima`, `oruk`) through tree effects `zin_regional_<tree>_recruit_<person>`; the characters module must define them. Dark and Dead advisors are recruited at start by the characters module; no focus recruits them.

## Names this slice introduces

- Country flags set: `zin_regional_dondor_beacon_chain`, `_muster_drill`, `_stands_with_living` (read by the Dark Lands mechanic and the Goldoroth tree), `zin_regional_blackton_free_harbour`, `_seeks_protection`, `_paid_corsairs` (730 days), `zin_regional_windwaith_free_harbours`, `_heard_fishermen`, `zin_eindil_safe_harbour` (journey hook), `zin_regional_titanos_open_to_pacts`, `_apart`, `zin_regional_yeti_lands_open_to_truce`, `_apart`, `zin_regional_fearno_steadings_path`, `zin_regional_troll_forest_any_coin`, `zin_dark_petitioned_parim`, `zin_dark_gifts_returned`, `zin_dark_oath_sworn`, `zin_dark_trolls_for_pay`, `zin_dark_took_southern_gifts`, `zin_cold_winter_stores`, `zin_lost_cause_member`, **`zin_name_horidor_cairn_king`** (Horidor's *The Cairn Crown* sets it; the names module should rename Ollon's title from it; the spec names a localisation key but nobody defined it).
- Opinion modifiers (`zin_regional_<tree>_<key>`): isengard `marriage` +20; horidor `left_accord` -25; fearno `friendship` +20; titanos `fair_toll` +10; dondor `beacon_kin`, `iron_trade` +10, `same_shore` +15, `polite_refusal` +5; blackton `good_customers` +15, `chains_for_envoys` -15, `iron_trade`; dulundur `iron_friends` +15, `gifts_returned` -10, `holds_kin` +10, `sent_south` -15; bordon `road_friends` +15, `turned_back` -15; dreson `no_chains` -5, `fen_kin` +10, `gifts_drowned` -15; troll_forest `lighter_envoys` -10; olen `healers_sent` +15 (decay 0.25); nan `pilots_friend` +15, `exiles_carried` +20 (decay 0.25).
- Idea given to Volgan by Nan's event: `zin_regional_nan_pilots_of_nafeher` (spirit key `pilots_of_nafeher`).
- Scripted effects and triggers are named `zin_regional_<tree>_<verb>` as in the specs.

## Choices and spec conflicts

1. **Banned words.** The text sweep's banned list and the glossary forbid several words of the specs' names: *Convoys to the Heir* is *Ships to the Heir's Host*; *The Windward Squadron* is *The Windward Fleet*; every "pilot" (Strait Pilots, Pilots of the Cold Coast, Storm Pilots, Pilots for Hire/Nafeher/the Wardens/No One, Pilots of Nan) reads "wayfinder" or "guide". Focus keys keep the spec's words (keys are not text).
2. **Raw.** The dark and dead specs say "Raw blocks: none", but their tree-declared effects and triggers need engine script the effect vocabulary lacks (`recruit_character`, `every_neighbor_country`, `add_to_war`, `white_peace`, `send_equipment`, ...). Those bodies are `raw` inside `scripted_effects` and `scripted_triggers` only (42 effects, 34 triggers); no focus, event or spirit holds a raw block (tested).
3. **Trigger arguments.** `zin_regional_<tree>_oath_at_least (value)` cannot be called by `check` (no arguments), so the sworn realms read `variable zin_dominion_oath above n` directly. `zin_regional_dulundur_steady_small_halls` declares `target` and `value` only because its body sets those temporary variables for the mechanic call; the focus passes dummy values.
4. **Politics effects.** `zin_politics_add_drift` and `zin_politics_set_stance` take the parameter style `IDEOLOGY`/`STANCE` in the politics spec; the trees call them through tiny tree effects (`zin_regional_horidor_cairn_politics`, `_cairn_stance`, `zin_regional_blackton_council_stance`) with that syntax.
5. **War goals.** `zin_regional_isengard_wargoal_march` and `zin_regional_dulundur_wargoal_tributaries` add `add_claim_by` to the border states and create `take_claimed_state` goals (`generator = owned_states`, the vanilla pattern) instead of `take_state_focus`, which needs literal state ids. `has_border_war_with` replaces the spec's `has_border_war_between` (state-level in 1.19.3).
6. **AI formulas.** "20 + lean / 2" style weights are step modifiers; the compiler's AI block has no arithmetic. Contested double values use one modifier value (Blackton `good_customers` 15, Bordon `road_friends` 15, Olen `healers_sent` 15 for Mirolon and Aenor).
7. **Event option order.** Offers that another realm can refuse list the refusal first (E2: a timed-out event takes the first option). Mechanic-style events keep the spec's order.
8. **Unplaceable spec conditions.** Dulundur's moot triggers approximate `zin_cb_hold_defiance` by `zin_dark_date_defiance_cb` plus a hold that refused the yoke. Windwaith's `harbour_for_strangers` and Fearno's hidden tales follow the spec text.
9. **Global variables** in conditions use the compiler's `global.` prefix (`global.zin_gathering_dark`, `global.zin_dark_border_tension`, `global.zin_dark_accord_resolve`, `global.zin_eindil_stage`), which the compiler gained from the major_b slice; this slice depends on it.

## Open items

- None of the raw helper scripts has been run in the game; they are written against the installed documentation and checked for names only. The `hoi4_script_validate` tool had no workspace in this session.
- The icons and pictures are all catalog keys; nothing is requested from the art track.
- `docs/design/focus/README.md` and the tier spec are untouched.
