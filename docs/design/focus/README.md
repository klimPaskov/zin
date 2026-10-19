# Focus tree data

One JSON file per tree: `docs/design/focus/<tree id>.json`. These files are the source of truth. The content builder (`tools/content/modules/focus_compiler.mjs`) reads every file here, checks it and compiles it to the game files listed in [00_format_and_compiler.md](../../specs/05_focus_trees/00_format_and_compiler.md). Never edit the compiled files. The design of each tree is its spec under `docs/specs/05_focus_trees/`; [01_tiers_and_coverage.md](../../specs/05_focus_trees/01_tiers_and_coverage.md) lists the 95 tree ids. An empty folder is valid: the build then writes no tree.

## Rules for a file

- The file name is the tree id and equals the `id` field. The id uses lowercase letters, digits and underscores. A regional tree's id starts with `regional_`, a shared tree's with `shared_`.
- The schema is strict. An unknown field, a missing required field or a wrong type fails the build with the path of the value. Country names must be names of the roster (`tools/content/data/countries.json`); the compiler resolves them to tags.
- Keys (focus, spirit, event, opinion modifier) are lowercase and never start with `zin_`; the compiler adds the prefix `zin_<id>_`. A full id that starts with `zin_` names something another owner writes (an idea, an opinion modifier, a namespaced event such as `zin_west.12`).
- Output keeps the order of the file, so reordering the file changes the compiled files but never their meaning. Compiled files are byte-identical for identical input.
- Text uses Windows-1252 characters only. Descriptions are one to three sentences. A text that names Afrit or the Hidden Council must carry `text_gate: "zin_afrit_revealed"` and be provably reachable only after that flag; every other text must not name them.

## Top level

| Field | Meaning |
| --- | --- |
| `id`, `tier`, `countries`, `focuses` | Required. `tier` is `major`, `regional` or `shared`. |
| `summary` | Optional sentence for readers of the file. Not compiled. |
| `event_namespace`, `event_base` | Optional (S9). A tree may share its mechanic's namespace: event `n` compiles to `<namespace>.<event_base + n>`. Without them events are `zin_<id>.<n>`. |
| `name_prefixes` | Optional list such as `["zin_north_"]`. Tree-declared effects and triggers must start with `zin_<id>_` or one of these prefixes, for names a spec fixed before the tree id was chosen. |
| `spirits`, `events`, `scripted_effects`, `scripted_triggers`, `opinion_modifiers`, `ai_strategies`, `copy` | Optional blocks (F1), below. |

## Focus

`key`, `name`, `desc`, `icon`, `x`, `y` and `days` are required. `icon` is a catalog key or `{ "default": key, "after": [ { "global_flag": flag, "icon": key } ] }` for a two-face icon. `days` is a multiple of 7 from 7 to 140. Optional: `prerequisite` (a list of groups; one focus from every group), `mutually_exclusive` (made symmetric by the compiler), `available`, `bypass`, `allow_branch`, `ai` (`{ "base": n, "modifiers": [ { "factor": n or "add": n, "if": [conditions] } ] }`), `filters` (political, research, industry, stability, war_support, manpower, annexation, army, navy, air), `module` (shared trees), `effects`, `text_gate`, and `relative_to` (a focus key: `x` and `y` are then offsets from that focus and compile to `relative_position_id`).

`allow_branch` may hold the conditions fixed at game start (`people`, `country`, `rule`, `region`) and, at the refresh points of decision E4, `ideology`, `is_subject`, `subject_of`, the triggers and flags listed under `branch` in `tools/content/data/focus_registry.json`, and tree triggers made only of those. A condition that changes at a refresh point must be repeated in the same focus's `available`. Anything else belongs in `available` only. The coast of a country's start cannot be resolved at build time (the roster has no coast data): use the shared `check zin_shared_has_coast`.

## Spirit

`name` and `desc` are required. `icon` is optional when a focus adds, swaps in or times the spirit: the spirit then shows the icon of the first focus, in file order, that does so. `modifier` is checked against the game's modifier documentation, including `production_speed_<building>_factor` and `state_production_speed_<building>_factor`. Optional: `research_bonus` (`{ category: number }`), `equipment_bonus` (`{ type: { stat: number or boolean } }`), `cancel` (conditions; the engine removes the spirit when they hold), `module`, `text_gate`.

## Events

`options` (at least one) and `title`, `desc`, `picture` are required, except on a hidden event. Every event of a tree carries a number `n`, or none does (then they are numbered from 1 in file order). `news: true` makes a news event; its picture must have a news crop, a country event's a standard crop. `hidden: true` makes a hidden event with no title, description or picture and exactly one option whose `effects` run at once. An option has `name`, `effects` and `ai_chance` (the shape of a focus's `ai`). The first option is the default when the event times out after 30 days (E2): put the non-committal option first. Tree events have no `trigger` or `mean_time_to_happen`; they are fired by effects. A gated picture (icon catalog rule 4) should be used only by an event that cannot fire before its gate flag; unprovable cases are warnings.

## Effects

Each effect is an object with one key, except `call`, which also takes `args`. The vocabulary is the table of the spec: `political_power`, `stability`, `war_support`, `army_experience`, `navy_experience`, `air_experience`, `manpower`, `add_spirit`, `remove_spirit`, `swap_spirit`, `timed_spirit`, `event`, `event_for`, `flag` (also `{ name, days }`), `clear_flag`, `global_flag`, `variable` (`add` or `set`), `popularity`, `government`, `building`, `research`, `equipment`, `annex`, `puppet`, `wargoal`, `claims_on`, `cores_on`, `guarantee`, `non_aggression`, `opinion`, `faction`, `invite`, `join_faction_of`, `for_country`, `if` (`limit`, `then`, optional `else`), `call`, `tooltip` and `raw`. Country fields accept a roster name, or `ROOT`, `FROM` and `OVERLORD`.

`building.where` is `capital`, `random_owned`, `random_coastal`, a site key (`zin_is_site_<key>`) or `region:<key>` (`zin_is_region_<key>`). A province building goes into every province of the chosen state that fits: coastal ones for `coastal_bunker` and `naval_base`, victory-point provinces for `bunker`. A `research` effect needs a focus or event to name it, so it is not allowed in a scripted effect.

`call` writes one `set_temp_variable = { zin_arg_<name> = value }` per argument and then `<effect> = yes`. A number passes as itself; a country name or `ROOT`, `FROM`, `OVERLORD` as that country; `{ "variable": name }` copies a variable; a keyword passes as its number code from the effect's owner (`tools/content/data/focus_arg_codes.json`) or from the `args` declaration of a tree-declared effect, and a keyword without a code fails the build. Every argument a tree-declared effect declares must be passed. The call of `zin_aenor_event_for_parim` is written as the Aenor effect followed by the event for its saved target (F7).

## Conditions

`flag`, `not_flag`, `global_flag`, `exists`, `at_war`, `at_war_with`, `after`, `before`, `focus_done`, `spirit`, `ideology`, `people`, `rule`, `is_subject`, `subject_of`, `country`, `region` (all roster countries of that start region, as `original_tag`), `stability_above`, `variable` (`above`, `below` or `equals`), `check` (a scripted trigger), `not`, `or`, `and` and `raw`. `not` compiles to the engine's `NOT`, which is true when none of its conditions holds. `after` and `before` take a story date and compile to one test per `zin_rule_story_pace` option. The `country` condition takes a roster name only.

## Blocks

- `scripted_effects`: `{ "<full id>": { "args": { name: "number" | "country" | { "keyword": { word: code } } }, "effects": [...], "module": tag } }`.
- `scripted_triggers`: `{ "<full id>": { "conditions": [...], "module": tag } }`.
- `opinion_modifiers`: `{ "<key>": { "value": n, "name": text, "decay": n, "months": n, "trade": bool, "module": tag } }`. Without `name` the text is the key in title case. A tree with opinion modifiers also gets the generated effect `zin_<id>_opinion` (`zin_arg_who`, `zin_arg_modifier` as the 1-based position in the block, `zin_arg_both`).
- `ai_strategies`: `{ "country": name or "all", "type": ..., "target": ..., "value": n, "if": [...] }`; `all` means every country of the tree.
- `copy`: `{ "from": shared tree, "module": tag, "root_at": [x, y], "root_prerequisite": [[...]] }`. A shared tree tags its module's focuses, spirits, opinion modifiers, effects and triggers with `module`. The module has exactly one root, a focus with no prerequisite inside the module. The compiler moves the module so the root sits at `root_at`, replaces the root's prerequisite, and renames the module's effects and triggers to this tree's prefix. Module events are not copied.

## Checks

The build runs every check of the spec on the whole tree after copies are expanded; the list is in `tools/README.md`. `node tools/content/build.mjs` prints the counts, and `npm test` in `tools/` runs the compiler's tests on synthetic trees (`tools/content/fixtures/focus/`).
