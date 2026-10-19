# Stage 2 integration note: cultures, faiths and the per-state culture data

Module `tools/content/modules/cultures.mjs` (library `tools/content/lib/cultures_model.mjs`, checks `tools/content/checks/cultures_check.mjs`), data `tools/content/data/cultures_game.json`, per-state data `docs/design/world/state_cultures.json`, tests `tools/content/cultures.test.mjs` (added to the `test` script of `tools/package.json`). It implements spec [08_world_in_game.md](../../specs/02_lore/08_world_in_game.md) sections 1, 6, 13 and 14 over the world bible's data (`tools/content/data/world/*.json`).

## 1. The call to add to `build.mjs`

```js
import { buildCultures } from './modules/cultures.mjs';
// after buildPeoples (same countries, same on_startup block); before the vanilla-removal scan (C3 must see these files)
const cultures = await buildCultures(staged, { countries /*, table: Map(tag|name -> { culture, culture2, faith, language }) */ });
// then put cultures.startup into zin_startup.txt beside peopleStartup:
//   ${peopleStartup}\n${cultures.startup}\n${uiStartup}
```

`ctx` is `{ countries }` as every module receives it. Optional: `table` (owner overrides by tag or country name, for the `culture`, `culture2` and `faith` columns `countries.csv` will gain), `geography` (a `Set` of geography ids; default reads `data/geography/erdae.json`), `pictureOf` (idea picture resolver, tests), `quiet`. The module runs its own checks first and throws, listing every finding, when one fails. It returns `{ startup, model, mappings, coverage, warnings, counts }`; with today's data `counts` is 305 countries, 53 cultures, 106 culture ideas (53 first and 53 second culture), 38 faith spirits, 81 festivals, 469 triggers, 40 scripted effects.

Dynamic tags (the 75 civil-war tags) have no row: a story effect gives them a culture with `zin_culture_set` (section 4).

## 2. Files written

| File | Content |
| --- | --- |
| `common/ideas/zin_cultures.txt` | `zin_culture_<key>` (53), `zin_culture2_<key>` (53, half strength, always `hidden_ideas`) and `zin_faith_<key>` (38). Tier 1 and 2 culture ideas and all faith spirits are visible national spirits (`country`, picture `zin_people_<people>` until the art track ships `zin_culture_<key>.dds`); tier 3 culture ideas are `hidden_ideas`. The split is the data key `idea_category` (set every tier to `hidden_ideas` to hide all). All carry `allowed = { always = no }`, `allowed_civil_war = { always = yes }`, `removal_cost = -1` |
| `common/scripted_triggers/zin_cultures.txt` | `zin_is_culture_<key>`, `zin_includes_culture_<key>` (dominant or second), `zin_is_language_<id>`, `zin_is_faith_<key>` (country scope, flags); `zin_state_is_culture_<key>`, `zin_state_includes_culture_<key>`, `zin_state_is_faith_<key>`, `zin_state_culture_matches_owner`, `zin_state_culture_same_kin_as_owner`, `zin_state_culture_foreign_to_owner`, `zin_state_faith_matches_owner`, `zin_state_has_minority_culture` (state scope, variables) |
| `common/scripted_triggers/zin_faiths.txt` | `zin_faith_<key>_festival_active`, `zin_faith_<key>_<festival>_active`, `zin_state_has_holy_site_<key>` |
| `common/scripted_effects/zin_cultures.txt` | `zin_culture_clear`, `zin_culture_set` |
| `common/scripted_effects/zin_faiths.txt` | `zin_faith_<key>_hold_festival` (one per faith with festivals) |
| `common/scripted_localisation/zin_cultures.txt` | `zin_culture_name`, `zin_culture_adjective`, `zin_culture_text`, `zin_culture2_name`, `zin_faith_name`, `zin_faith_text`, `zin_language_name` (country), `zin_state_culture_name`, `zin_state_culture_adjective`, `zin_state_culture2_name`, `zin_state_faith_name` (state) |
| `localisation/english/zin_cultures_l_english.yml` | 671 keys: names, adjectives, descriptions, spirit names and tooltips, clergy titles, festival names, language names, fallbacks |
| `docs/design/world/state_cultures.json` | The per-state table, staged byte for byte (it is owner-editable and has its own spec in the file) |
| `docs/design/world/culture_coverage.json` | Coverage report: totals, gaps, per culture / faith / language |
| `docs/design/world/culture_mappings.json` | The mappings of section 5 as data, and the names the Chronicle prints |

The two generated documents are also seeded in the repository with the bytes the builder writes, so a build that changes nothing shows no diff. `cultures.test.mjs` fails when the repository copies differ from the builder's output (rewrite them from the staged tree after a data change).

## 3. Design decisions

- **A country carries its culture the way it carries its people.** Idea and flag of the same name, set once in `on_startup` (`startup` lines, same layout as `buildPeoples`), plus the country variables `zin_culture_id`, `zin_culture2_id`, `zin_faith_id`, `zin_language_id` (numbers in `cultures_game.json`: `cultures.*.id` 1-53, `faiths.*.id` 1-39, `language_ids` 1-24). Flags: `zin_culture_<key>`, `zin_culture2_<key>`, `zin_language_<id>`, `zin_faith_<key>`. States carry `zin_state_culture`, `zin_state_culture2`, `zin_state_faith` and the flag `zin_holy_site_<faith>`. No trigger lists a tag (P9); a test asserts it.
- **Modifiers.** 3 to 5 per culture, 2 to 4 per faith, all checked by `assertModifiers`, each value within `bounds` (default plus 26 per-modifier bounds, tunable in the data file), no two cultures with identical modifiers or more than 60 percent of their keys in common. Themes follow the bible rows (rule, livelihood, war, magic) of each culture: recruitment (`conscription_factor`, `monthly_population`), supply (`supply_consumption_factor`, `heat_attrition_factor`, `winter_attrition_factor`), construction (`production_speed_buildings_factor`), research, stability, influence on neighbours (`trade_opinion_factor`, `opinion_gain_monthly_factor`, `justify_war_goal_time`), leaders (`army_leader_cost_factor`, `army_leader_start_level` for Gala, `female_random_admiral_chance` for the Isle Houses), attitude to magic (`special_project_speed_factor`: Council elves +0.12, Dondor -0.15; the key `magic` records the attitude). A second culture applies at `secondary_factor` 0.5; `army_leader_start_level` is dropped from it.
- **Faith spirits** for all 38 faiths with text (the open faith of Zol's Dead has none and a recorded name, "No Faith Recorded"). Hooks: a festival is a timed country flag (`zin_faith_<key>_hold_festival` with `zin_arg_festival` = position 1..n, E1); holy sites are geography ids (`holy_sites`) that the state function turns into the state flag `zin_holy_site_<faith>`. No event is written.
- **Secrets.** The Deliverer's faith and the Zilin Pilgrim-Folk carry public text only: no Afrit, no Eindil, no Hidden Council, no birth rolls (a check fails the build on those words). The hub description of the Faith of the Deliverer belongs to the Worshipdom track.
- **Per-state data** is keyed by geography feature id (`state_cultures.json`: 6 enclave and 35 mixed rules). Never by state number, so a regenerated map changes nothing here. The politics step calls `resolveStateCulture` (section 4).

## 4. Interfaces (all exported by `modules/cultures.mjs`)

```js
const model = await loadCultureModel();                       // data files; { game, world, assignments, languages, state }
resolveCountryCultures(model, countries, table?)               // { rows: Map(tag -> { culture, culture2, faith, language }), missing, problems }

// the politics step, once per state, with the geography features that cover it and its owner's row:
resolveStateCulture(model, { owner: { culture, culture2?, faith? }, features: ['forest_kilinti', 'region_middle_lands'] })
// -> { culture, faith, language, minorities: [{ culture, faith, share }], holy_sites: [faith], resistance: { target, level, explicit }, rules: [ids] }
stateStartupLines(model, [{ state: <id>, ...result }])         // `\t\t\t<id> = { set_variable = ... set_state_flag = ... }` lines for on_startup

portraitPoolFor(model, key)     // { pool, kit: people, tier, per_sex (6/4/2, goblins 1), total, unique }   374 portraits in all
flagStyleFor(model, key)        // { motif, alt, shape: rect | swallowtail | pennant, palette: [3 colours] }
buildingStyleFor(model, key)    // one of the 51 kits          musicMoodFor(model, key)   // one of the 14 palettes
unitGroupFor(model, key)        // one of the 21 groups
graphicalCultureFor(model, key, availableSet?)   // { key, group: zin_<group>_gfx, fallback: zin_<people>_gfx }; key = fallback while the group's culture is not in availableSet
chronicleNames(model)           // { cultures: { name, adjective, spirit, summary }, faiths: { name, short, clergy, summary }, languages }
cultureMappings(model)          // all of the above per culture (what culture_mappings.json holds)
```

Effects take no parameters (E1). To give a run-time country (a civil-war tag) its culture:

```
set_temp_variable = { zin_arg_culture = 1 }  set_temp_variable = { zin_arg_culture2 = 0 }
set_temp_variable = { zin_arg_faith = 1 }    set_temp_variable = { zin_arg_language = 1 }
zin_culture_set = yes
```

Scripted localisation, country scope: `[ROOT.zin_culture_name]`, `[ROOT.zin_faith_name]`, `[ROOT.zin_language_name]`; state scope: `[<state>.zin_state_culture_name]`, `[<state>.zin_state_faith_name]`.

## 5. Disposition rows these files satisfy (the integrator updates the `zin` lists)

`common/ideas`: `zin_cultures.txt`. `common/scripted_triggers`: `zin_cultures.txt`, `zin_faiths.txt`. `common/scripted_effects`: `zin_cultures.txt`, `zin_faiths.txt`. `common/scripted_localisation`: `zin_cultures.txt`. Other staged files: the localisation file and three documents under `docs/design/world/`.

For `content/data/focus_registry.json` (names other modules write): `zin_is_culture_<key>`, `zin_includes_culture_<key>`, `zin_is_language_<id>`, `zin_is_faith_<key>`, `zin_state_is_culture_<key>`, `zin_state_is_faith_<key>`, `zin_faith_<key>_festival_active`, ideas `zin_culture_<key>`, `zin_culture2_<key>`, `zin_faith_<key>`.

## 6. What I expect from other slices

- **countries.mjs / countries.csv**: three new columns `culture`, `culture2`, `faith`, owner-editable; load them into the `table` of `ctx` (the module takes `Map(tag or name -> { culture, culture2, faith, language })` and validates it).
- **portraits.mjs**: `portraitPoolFor` gives the pool key and size per culture; the portrait pool file gains one block per culture (the country block lists its culture's sprites first).
- **units3d.mjs**: `graphicalCultureFor(model, key, new Set(definedCultures))` returns the culture to put in each country file; it falls back to `zin_<people>_gfx` until `zin_<group>_gfx` exists.
- **art track**: the culture and faith icon keys (`cultures.*.icon`, `faiths.*.icon`; 53 and 38, unique) are the names of the idea icon jobs; a shipped `gfx/interface/ideas/zin_culture_<key>.dds` or `zin_faith_<key>.dds` is picked up by the next build (it also needs its sprite in a `.gfx`).
- **music, buildings, flags**: the key strings of the mappings are the art directions of spec 08 sections 5, 7 and 12.
- **characters.mjs / names.mjs**: `rows.get(tag).language` and `.dialect` are the language and dialect of each country; ruler titles come from the language data.
- **text sweep**: `The Old Knots` is a `review` hit of the banned list (rule `bw_units_of_measure_006`, "knots"). It is the faith's name from the bible; an allowance in `data/banned_words.json` (key `zin_fname_old_knots`, `zin_faith_old_knots`) closes it, or the owner renames the faith.
- **spec 08 section 1** names the triggers `zin_culture_is_<id>` and `zin_faith_is_<id>`; the implemented names are `zin_is_culture_<key>` and `zin_is_faith_<key>` (the brief of this slice). The spec line follows.

## 7. Checks and tests

`node tools/content/checks/cultures_check.mjs [--report file]` runs the checks against the country table (exit 1 on an error, warnings on stderr). The build runs them too. Findings, by code: `file-duplicate`, `duplicate`, `set`, `ids`, `country-culture`, `country-faith`, `language`, `modifier`, `similar`, `unused`, `faith-unkept`, `mapping`, `text`, `secret`, `festival`, `site`, `state-rule`. Today: 0 errors, 3 warnings (Yeldenne keeps no faith although its culture has one; the two `Knots` hits above). Coverage: every country has a culture and a faith; every culture is used except the goblin warrens (a minor people, documented by `unused`); every faith is kept by a culture; every culture has a language except Zol's Dead (`no_language_cultures`); every language but the liturgical Old Ainic is spoken by a culture.

`cd tools && node --test content/cultures.test.mjs` (also in `npm test`) covers the build, the files, determinism, the triggers, the localisation, the mappings, the state function and one negative test per check: an unknown modifier, a country without a culture, duplicate keys (in the raw JSON, ids, spirits, icons, rules, countries), out-of-bounds values, culture and faith gaps, secret and banned words, mapping and festival errors, and bad state rules.
