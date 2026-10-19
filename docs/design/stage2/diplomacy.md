# Stage 2 integration note: diplomacy, leagues, peace and subjects

Module `tools/content/modules/diplomacy.mjs`, data `tools/content/data/diplomacy*.json` (`diplomacy.json`, `diplomacy_subjects.json`, `diplomacy_peace.json`, `diplomacy_text_{peace,actions,subjects}.json`), test `tools/content/diplomacy.test.mjs` (46 tests; added to `tools/package.json`). Spec: [03_diplomacy_and_factions.md](../../specs/03_gameplay/03_diplomacy_and_factions.md).

## 1. Call to add to `build.mjs`

```js
import { buildDiplomacy } from './modules/diplomacy.mjs';
// before buildVanillaRemoval, so the reference scan sees these files:
const diplomacy = await buildDiplomacy(staged, { countries });
```

`ctx` is `{ countries }` (the roster). Optional `ctx.diplomacy = { externalTemplates, externalRules, externalManifests, externalAutonomy, externalGoals }`: ids another module writes itself. They are then listed (rule groups, tests) and not defined here. The result carries `counts`, `definitions`, `scripts`, `dependencies`, `files`, `localisation` and `factions` (the seven start leagues with leader and member tags, for the politics step).

The builder writes 27 files and 18 templates, 17 joining rules, 39 engine rules, 17 rule groups, 6 goals, 9 oaths, 4 member upgrades, 5 autonomy states, 6 occupation laws, 4 resistance modifiers, 11 peace categories, 34 price modifiers, 32 AI desires, 17 sharing groups, 21 collections and 27 emblems; about 816 replacing and 195 new text keys.

## 2. Disposition rows satisfied (stage 2)

| Row (path) | ZIN file that makes it non-empty |
| --- | --- |
| `common/factions/templates` | `zin_factions.txt` |
| `common/factions/rules` | `zin_factions.txt` |
| `common/factions/rules/groups` | `zin_factions.txt` (single joining group `zin_rule_group_joining`) |
| `common/factions/goals` | `zin_factions.txt` (goals and oaths) |
| `common/factions/icons` | `zin_factions.txt` |
| `common/factions/member_upgrades`, `.../member_groups` | `zin_factions.txt` each |
| `common/factions/upgrades`, `.../upgrades/groups` | `zin_factions.txt`, **comment-only** (see 5) |
| `common/autonomous_states` | `zin_autonomy.txt` |
| `common/peace_conference/{ai_peace,categories,cost_modifiers}` | `zin_peace.txt` each |
| `common/technology_sharing` | `zin_tech_sharing.txt` (diplomacy owns this row; if the technology slice also writes this path the build stops on the duplicate staged file) |
| `common/bop` | `zin_bop.txt` (interim stub `zin_court_balance`, never started) |
| overrides by name | `common/occupation_laws/occupation_laws.txt`, `common/resistance_compliance_modifiers/resistance_modifiers.txt`, `common/modifiers/{AAT,BBA,MUN}_power_balance_modifiers.txt` |

Not written here (other slices of the same spec row): intelligence agencies and upgrades, operations, phases, timed activities, operative code names, scorers.

Extra files the leagues need (all in already replaced folders, no new row): `common/collections/zin_regions.txt` (12 `zin_region_<key>` collections, the held collections and `zin_faction_cores_lost`), `common/scripted_triggers/zin_diplomacy.txt` (`zin_diplo_refusal_binds`, `zin_diplo_is_dark_power`), `common/scripted_effects/zin_diplomacy_leagues.txt`, `common/on_actions/zin_diplomacy_leagues.txt` (one `on_monthly`), `interface/zin_diplomacy.gfx` (interim sprites), and the two text files `localisation/replace|english/zin_leagues_l_english.yml`.

## 3. Engine keys kept (the game or kept vanilla files name them)

- `faction_template_generic`: `NDefines.NFactions.FACTION_DEFAULT_TEMPLATE` names it. Defined as a ZIN fallback no history uses. Politics histories must name the ZIN templates.
- `autonomy_puppet`: the only `default = yes` state with `allowed = always`. The `puppet` effect crashes without one.
- `harsh_quotas_occupation` ("Garrison and Toll") and `forced_labor_occupation` ("Tithe and Levy"): the kept `common/resistance_activity/resistance_activity.txt` tests `occupation_law` against them.
- `faction_goal_unlock_research`, `faction_goal_unlock_military` (the ids sit in the game binary; the contribution rules need `has_faction_military_unlocked`), the member upgrade ids `manpower_contribution_full_enable`, `faction_manpower_sharing1..3`, the group `faction_member_upgrade_manpower_group`, the pool `faction_icon_pool`, every engine rule and rule group key, the 11 peace category keys, `faction_rule_modifier_*` price names, `resistance_25/50/75/90`.
- `GFX_faction_logo_generic` (`FACTION_DEFAULT_ICON`) stays defined by the kept `interface/factions/factions.gfx`.
- Vanilla files left loaded and unaffected: `compliance_modifiers.txt` (calls `occupied_countries.1`, `is_available_to_collaboration_government`; both exist).

Files that must stay vanilla: `common/resistance_activity`, `compliance_modifiers.txt`, `common/wargoals/00_invasion.txt` (text only changes), `common/scripted_diplomatic_actions`, `interface/factions`.

## 4. Open dependencies on other slices (identifiers this module uses)

`result.dependencies` lists them; the test checks the list.

- State triggers `zin_is_region_<key>` for the 12 regions (`sites.mjs`, E7): used by the region collections, joining rules and the Volgan AI desire.
- Scripted triggers: `zin_leren_is_north_crown`, `zin_leren_is_dark_shore` (Lerendor), `zin_cold_is_clan_realm` (Cold Lands), `zin_elves_is_magical_realm` (elves), `zin_sun_is_lands_of_the_sun_country` (Sun), `zin_afrit_rules_here`, `zin_afrit_is_hub` (Afrit; used by `zin_diplo_is_dark_power`).
- Country variables (undefined is harmless, goals just never fire): `zin_concord_loyalty`, `zin_leren_lean`, `zin_cold_lean`, `zin_eindil_regard`. Flags used by joining rules (`zin_refusal_lifted`, `zin_lost_cause_member`, `zin_lost_cause_shield`, `zin_west_stranded`, `zin_east_companies_with_eindil`, `zin_cold_joins_crossing`, `zin_tritons_corsair_haven`, `zin_mirolon_league_friend`, `zin_aenor_free_dominion`, `zin_region_*`, `zin_people_elves`, `zin_people_sun_elves`) are plain flags.
- Hidden event `occupied_countries.2` (the 90% uprising, called by `resistance_90`): stage 1 bridges it as an inert event. Removing the bridge needs a real ZIN event of that id from the occupation/war slice. `occupied_countries.1` (collaboration choice) still has its one-option stub.
- The disposition and the sites slice must agree that `zin_sites.txt` defines all 12 region triggers, or the collections log errors.
- Elves, Lands of the Sun, eastern kings and Dark Lands specs say they write `zin_faction_rule_join_elven_kin`, `_sun_realms`, templates `zin_faction_kindred`, `_noon_league`, `_free_crowns` and the autonomy state `zin_autonomy_tributary_hold` themselves. This module defines all of them (the brief and the registry list them; the single joining group must resolve). If those modules write them, pass the ids in `ctx.diplomacy.external*` and delete the module's copy, or the integrator removes theirs. The manifest `zin_faction_manifest_kindred` is defined here too.

## 5. Choices and spec deviations

1. **Faction upgrade folders.** The installed game ships `upgrades/upgrades.txt` and `upgrades/groups/upgrade_groups.txt` as 0-byte files: the research, intelligence and doctrine sharing levels are built into the engine. There is no format to write. ZIN ships comment-only files. Check C2 would fail them: either add `emptyAllowed` (reason: "vanilla ships the files empty; engine-built") to those two rows, or change them to `keep` (the vanilla 0-byte files hold no vanilla content). The member upgrades ("Common Muster", "Joint Watch") carry the re-themed upgrade kinds.
2. **`main_fallback_law` is not a key of 1.19.3** (absent from the game binary, only a stale comment). `The Light Hand` is `default_law` and `starting_law`. `missing_garrison_law` sits on a hidden law (`zin_occupation_missing_garrison`), as in the vanilla structure, not on No Garrison: scaling a law toward a law with `required_garrison_factor = -1` would shrink the garrison it measures.
3. **Autonomy levels tuned** so no two states share a `min_freedom_level` (wiki): Vassal 0.4, Sworn Realm 0.1 (0 is the annexed level), Tributary Hold 0.35, Eastern Client 0.45, Chartered Dominion 0.5. All ZIN states have `is_puppet = yes` (Aenor, Volgan, Afrit and Dark Lands scripts call `end_puppet`), `allowed = always` (the specs call `puppet` and then `set_autonomy`) and `allowed_levels_filter` listing only themselves, so a subject only moves by script or to freedom. Vassal is filtered the same way. Rule text key `RULE_DESC_ZIN_SUBJECT`.
4. **Hold the Line** (spec: no core lost for 365 days at war) is counted by a monthly effect: 30 days added while the league is at war and `zin_faction_cores_lost` is empty, reset otherwise. **Widen the League** records the league's size once, plus two.
5. **Two engine unlock goals added** (`faction_goal_unlock_research`, `faction_goal_unlock_military`): without them the faction research and manpower rules can never open. Simplified completion: four members (and some oath progress for the military one).
6. **Manifest regions.** Stabilo's "southern roads" reads the East Lands like Noris (spec "as above"). The Kindred's oath reads all Magical Lands states, not only elven-owned ones at the start.
7. **Interim sprites.** `interface/zin_diplomacy.gfx` defines `GFX_zin_faction_<key>` (+ `_miniature`) for 17 leagues and 10 spares, and `GFX_<autonomy id>_icon`, pointing at textures of the installed game. The art stage replaces the `texturefile` lines. No texture is copied.
8. **Casus belli.** The ten `zin_cb_*` names and descriptions are written. The dynamic modifiers (`CB_TENSION`), `zin_diplo_grant_cb`, the decisions, events, ideas and `on_declare_war` logic of the spec's gameplay table are not part of this slice.
9. The politics step needs: `create_faction_from_template = { template = zin_faction_<key> name = ZIN_FACTION_<TAG> }` and `set_autonomy` to `zin_autonomy_chartered_dominion` (26 Aenor subjects) and `zin_autonomy_sworn_realm` (Demon, Dolon, Nezer); `result.factions` has the lists.

## 6. Verification done

`node --test tools/content/diplomacy.test.mjs`: 46 tests pass; `npm test` passes 351. The test builds with the roster and checks: group and rule resolution, template contents against the spec table, the installed triggers, effects and modifiers (documentation), every replaced text key against the installed localisation (exists, placeholders kept, not equal to the vanilla line), the banned-word list on all text, determinism, and negative cases (unknown modifier, duplicate id, missing prerequisite, vanilla names, dropped engine keys, unknown country, modern words).
Not verified: game load (no run), `hoi4_script_validate` (no workspace registered), the Linux acceptance runs.
