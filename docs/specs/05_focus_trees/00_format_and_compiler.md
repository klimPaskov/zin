# Focus tree data format and compiler

**Status:** Ready. Reviewed 19 October 2026 against CONVENTIONS "Status"; integrated 19 October 2026. **Priority:** 4. **Phase:** 4.

## Purpose

ZIN needs about 3,500 focuses across 305 countries. Writing them as raw Clausewitz script by hand would make them inconsistent and unsafe to rebuild. Instead, every tree is a JSON data file, and the content builder compiles it into game files, checks it, and writes it through the shared rewrite engine.

The compiler implements decisions S9, E1–E6 and F1–F7 of [INTEGRATION_DECISIONS.md](../INTEGRATION_DECISIONS.md).

## Files

The builder module `tools/content/modules/focus_compiler.mjs` (new, phase 4) reads every tree file, the roster (`tools/content/data/countries.json`), the icon catalog (through `presentation.mjs`, see [02_icon_catalog.md](02_icon_catalog.md)) and the registry of names other modules write, and writes the files below in the builder's one transaction through the shared atomic rewrite engine (`tools/content/apply.mts`).

| Path | What |
| --- | --- |
| `docs/design/focus/<tree>.json` | One tree's data: the source of truth, read by the builder |
| `docs/specs/05_focus_trees/<tier>/<tree>.md` | The design spec the data implements |
| `tools/content/data/focus_arg_codes.json` | The number codes of keyword arguments (E1), copied from each owning spec's code table; a test compares them with the specs |
| `common/national_focus/zin_<tree>.txt` | Compiled tree |
| `common/ideas/zin_focus_<tree>.txt` | Its national spirits |
| `events/zin_<tree>.txt` | Its events (namespace `zin_<tree>`, or the declared namespace and id base) |
| `common/scripted_effects/zin_<tree>.txt`, `common/scripted_triggers/zin_<tree>.txt` | The tree's `scripted_effects` and `scripted_triggers` blocks (F1) |
| `common/opinion_modifiers/zin_<tree>.txt` | The tree's `opinion_modifiers` block (F1) |
| `common/ai_strategy/zin_<tree>.txt` | The tree's `ai_strategies` block (F1) |
| `common/on_actions/zin_focus_layout.txt` | One shared file for all trees: the layout refresh of E4 |
| `localisation/english/zin_focus_<tree>_l_english.yml` | All its text, UTF-8 with BOM |

The compiler writes no sprite file. Focus icons are the catalog's sprites `GFX_focus_zin_<key>` in `interface/zin_catalog_focus_icons.gfx` (shine sprites in `interface/zin_catalog_focus_icons_shine.gfx`, idea pictures `GFX_idea_zin_<key>` in `interface/zin_catalog_ideas.gfx`), all written by `presentation.mjs`. `interface/zin_focus_icons.gfx` holds only the ten people emblems `GFX_focus_zin_<people>` (written by `vanilla_removal.mjs`).

## The tree file

```json
{
  "id": "aenor",
  "tier": "major",
  "countries": ["Aenor"],
  "summary": "One sentence.",
  "event_namespace": "zin_aenor",
  "event_base": 500,
  "spirits": { "golden_court_spirit": { "name": "The Golden Court", "desc": "…", "icon": "crown_gold", "modifier": { "political_power_factor": 0.1 }, "cancel": [ { "global_flag": "zin_golden_king_dead" } ] } },
  "events": { "feast": { "title": "…", "desc": "…", "picture": "court_feast", "options": [ { "name": "…", "effects": [ { "political_power": 25 } ] } ] } },
  "focuses": [ { "key": "lost_cause", "name": "The Lost Cause", "desc": "…", "icon": "banner_league", "x": 4, "y": 0, "days": 70, "effects": [ { "add_spirit": "golden_court_spirit" } ] } ],
  "scripted_effects": { "zin_aenor_offer_treaties": { "args": {}, "effects": [] } },
  "scripted_triggers": { "zin_aenor_tree_ready": { "conditions": [] } },
  "opinion_modifiers": { "envoys_welcomed": { "value": 20, "decay": 0 } },
  "ai_strategies": [ { "country": "Aenor", "type": "befriend", "target": "Selen", "value": 20, "if": [] } ],
  "copy": [ { "from": "shared_east_lands", "module": "E4", "root_at": [14, 1], "root_prerequisite": [["the_mountain_throne"]] } ]
}
```

- `id`: lowercase letters, digits and underscores; unique. Focus ids compile to `zin_<id>_<key>`, spirits to `zin_<id>_<key>`. A regional tree's id is `regional_<name>`, so its spirits are `zin_regional_<name>_<key>` (F4); a shared tree's id is `shared_<region>`.
- `tier`: `major`, `regional` or `shared`.
- `countries`: exact country names. A shared tree lists every country it covers. Every country has exactly one tree.
- `event_namespace`, `event_base` (optional, S9): a tree may share its mechanic's namespace; its event `n` then compiles to `<namespace>.<event_base + n>`. Without them events are `zin_<id>.<n>`.
- Every block except `focuses` is optional.

### A focus

| Field | Meaning |
| --- | --- |
| `key` | Unique in the tree; never equal to a spirit key of the tree (F3) |
| `name`, `desc` | Text; `desc` one to three sentences |
| `icon` | Key from the icon catalog ([02_icon_catalog.md](02_icon_catalog.md)), or a two-face icon (catalog rule 3) |
| `x`, `y` | Grid position; no two focuses share one; a focus sits below every prerequisite |
| `days` | Multiple of 7; usually 35 or 70 |
| `prerequisite` | List of groups; a focus needs one focus from every group: `[["a"], ["b", "c"]]` means a and (b or c) |
| `mutually_exclusive` | Keys; made symmetric by the compiler |
| `available`, `bypass` | Lists of conditions |
| `allow_branch` | List of conditions under the E4 rule (below) |
| `ai` | `{ "base": 10, "modifiers": [ { "factor": 2, "if": [conditions] } ] }`; compiled to `ai_will_do` with `modifier = { factor = … }` blocks |
| `filters` | Search filters: political, research, industry, stability, war_support, manpower, annexation, army, navy, air |
| `module` | Shared trees only: the module tag (`"E4"`) that a `copy` block names |
| `effects` | List of effects |

**`allow_branch` (E4).** `allow_branch` holds conditions fixed at game start: `people`, `country`, a game rule (`rule`), and the country's start region or start coast, which the compiler resolves at build time into `original_tag` lists. The conditions that change in play only at the refresh points of E4 may also stand there: the ruling ideology (ruling-party change); subject and overlord status (puppet, release, subject freed, annex, peace conference); owned states, so coast, borders and state counts (annex, peace conference); and story flags whose setters refresh layouts: the ones E4 names (`zin_eindil_awake`, `zin_eindil_war_king`, journey stage 6, `zin_west_set_route`, the region monthly runners) and any other setter that the tree spec records as calling `mark_focus_tree_layout_dirty` for the tree's countries. A branch head that uses one of these repeats the same condition in `available`, so a stale layout never lets the wrong country take the branch. Every other condition that changes in play goes into `available` only; the compiler fails the build when it finds one in `allow_branch`.

**Layout refresh (E4).** The compiler writes `common/on_actions/zin_focus_layout.txt` once for all trees. It runs `mark_focus_tree_layout_dirty` for the country concerned (and its overlord or new owner where there is one) in `on_ruling_party_change`, `on_puppet`, `on_release_as_puppet`, `on_subject_free`, `on_annex` and `on_peaceconference_ended`. The story setters named above call `mark_focus_tree_layout_dirty` for every country of their region themselves; that is their owners' work (journey, Western Crossing and region mechanics).

### A spirit

| Field | Meaning |
| --- | --- |
| key | Unique in the tree and never equal to a focus key of the tree (F3); the convention for a spirit that a focus of the same name adds is the suffix `_spirit` |
| `name`, `desc` | Text |
| `icon` | Catalog key; optional when a focus adds, swaps in or times the spirit (catalog "How a tree names its art", rule 2) |
| `modifier` | Modifiers from the game's modifier documentation |
| `research_bonus`, `equipment_bonus` | Optional engine blocks of the idea |
| `cancel` | Optional list of conditions (F1); compiled to the idea's `cancel` trigger, so the engine removes the spirit when they hold |

### Effects

Each effect is an object with one key. The compiler expands it to valid script.

| Effect | Example |
| --- | --- |
| Political power, stability, war support | `{ "political_power": 50 }`, `{ "stability": 0.05 }`, `{ "war_support": 0.05 }` |
| Experience | `{ "army_experience": 10 }`, `navy_experience`, `air_experience` |
| Manpower | `{ "manpower": 5000 }` |
| Spirits | `{ "add_spirit": "k" }`, `{ "remove_spirit": "k" }`, `{ "swap_spirit": ["old", "new"] }`, `{ "timed_spirit": { "key": "k", "days": 180 } }`. A short key names this tree's spirit (`zin_<tree>_<key>`); a full id starting with `zin_` names an idea owned by a mechanics spec, which the compiler checks exists (S9) |
| Events | `{ "event": "k" }`, `{ "event": { "key": "k", "days": 3 } }`, `{ "event_for": { "country": "Name", "key": "k" } }`. A key with a namespace (`zin_west.12`) names a mechanic's event by its full id (F2); the compiler checks that the owner's module writes it. Trees fire mechanic events only this way or through their own `scripted_effects` (F2) |
| Flags and variables | `{ "flag": "x" }`, `{ "flag": { "name": "x", "days": 180 } }` (timed country flag, S9), `{ "clear_flag": "x" }`, `{ "global_flag": "x" }`, `{ "variable": { "name": "x", "add": 1 } }` |
| Politics | `{ "popularity": { "ideology": "light", "value": 0.1 } }`, `{ "government": "light" }` |
| Buildings | `{ "building": { "type": "industrial_complex", "level": 1, "where": "capital" } }`; `where` is `capital`, `random_owned`, `random_coastal` or a site key. A site key means a random owned state for which `zin_is_site_<key>` is true (F5; the triggers are the key-sites table's, [01_map/02_key_sites.md](../01_map/02_key_sites.md)); `region:<key>` likewise means a random owned state for which the key-sites table's `zin_is_region_<key>` is true. With no such state the effect does nothing and shows a tooltip. `bunker`, `coastal_bunker` and `naval_base` are province buildings in 1.19.3: the compiler places them in a province of the chosen state (a coastal province for `coastal_bunker` and `naval_base`) |
| Research | `{ "research": { "categories": ["land_doctrine"], "bonus": 0.5, "uses": 1 } }`. Doctrine categories compile to `add_doctrine_cost_reduction = { name category cost_reduction uses }`, because doctrines cost experience in 1.19.3; all other categories compile to `add_tech_bonus` (E6) |
| Equipment | `{ "equipment": { "type": "infantry_equipment", "amount": 500 } }` |
| Countries | `{ "annex": "Name" }`, `{ "puppet": "Name" }`, `{ "wargoal": { "target": "Name", "type": "annex_everything" } }`, `{ "claims_on": "Name" }`, `{ "cores_on": "Name" }`, `{ "guarantee": "Name" }`, `{ "non_aggression": "Name" }` |
| Opinion | `{ "opinion": { "target": "Name", "modifier": "k", "both_ways": true } }`; a short key names this tree's `opinion_modifiers` entry (`zin_<tree>_<key>`), a full id another owner's modifier |
| Factions | `{ "faction": "warden_league" }` creates a faction from the template `zin_faction_<key>` (`create_faction_from_template`, E3; templates and joining rules belong to the diplomacy spec or the spec it names); `{ "invite": "Name" }`, `{ "join_faction_of": "Name" }` |
| Scopes and logic | `{ "for_country": { "country": "Name", "effects": [] } }`, `{ "if": { "limit": [], "then": [], "else": [] } }` |
| Mechanic calls | `{ "call": "zin_aenor_add_council_influence", "args": { "value": 5 } }` names a scripted effect the mechanics spec or this tree defines (calling convention below) |
| Text | `{ "tooltip": "Shown text." }` |
| Escape hatch | `{ "raw": "script" }`; counted and reviewed; avoid |

Wherever an effect or condition names a country, it may also name `ROOT`, `FROM` or `OVERLORD` (S9).

### Calling convention for scripted effects (E1)

Scripted effects take no parameters in 1.19.3. A call with `args` compiles to one `set_temp_variable = { zin_arg_<name> = <value> }` per argument, written just before `<effect> = yes`:

| Argument kind | Compiles to | Example |
| --- | --- | --- |
| Number | the number | `{ "value": 5 }` → `set_temp_variable = { zin_arg_value = 5 }` |
| Country (`Name`, `ROOT`, `FROM`, `OVERLORD`) | the country, read by the effect as `var:zin_arg_<name>` | `{ "who": "FROM" }` → `set_temp_variable = { zin_arg_who = FROM }` |
| Keyword | the number code its owner lists, from `tools/content/data/focus_arg_codes.json` | charter `old` 0, `golden` 1, `shield` 2, `free` 3, `wall` 4; camp `court` 1, `faithful` 2, `dominions` 3, `host` 4 (the values of `zin_aenor_ruling_camp`) |

Specs write such calls as `call effect(args)` or `call effect{name: value}`; both mean the same. The effect's owner reads the temporary variables and lists the codes of its keyword arguments in its spec. A keyword with no listed code fails the build. Tree-declared effects follow the same convention: their `args` object declares each argument's kind and, for a keyword, its codes.

**Opinion helper.** A tree that declares `opinion_modifiers` also gets a generated scripted effect `zin_<tree>_opinion` (contract pattern) for its events and for mechanics that need it: `zin_arg_who` is the other country, `zin_arg_modifier` the 1-based position of the modifier in the block, and `zin_arg_both` 1 for both ways.

### Data blocks (F1)

| Block | Shape | Compiles to |
| --- | --- | --- |
| `scripted_effects` | `{ "<full id>": { "args": {…}, "effects": [ … ] } }`; ids start with `zin_<tree>_` | `common/scripted_effects/zin_<tree>.txt` |
| `scripted_triggers` | `{ "<full id>": { "conditions": [ … ] } }` | `common/scripted_triggers/zin_<tree>.txt` |
| `opinion_modifiers` | `{ "<key>": { "value": 20, "decay": 0.5, "months": 0, "trade": false } }` | `common/opinion_modifiers/zin_<tree>.txt`, ids `zin_<tree>_<key>` |
| `ai_strategies` | List of `{ "country": "Name" or "all", "type": "befriend", "target": "Name", "value": 20, "if": [conditions] }`; `type` is an engine strategy (`befriend`, `alliance`, `antagonize`, `conquer`, `protect`, `prepare_for_war`, `area_priority`, …) | `common/ai_strategy/zin_<tree>.txt`; one plan per entry, enabled by the country and the `if` conditions |
| `copy` | List of `{ "from": "<shared tree>", "module": "<tag>", "root_at": [x, y], "root_prerequisite": [[…]] }` | The module's focuses copied into this tree (below) |
| spirit `cancel` | List of conditions on a spirit | The idea's `cancel` trigger |

**Copies.** A `copy` entry takes every focus of the shared tree tagged with that `module`, gives it this tree's id (`zin_<tree>_<key>`), moves it by the offset between the module's root and `root_at`, replaces the root's prerequisite with `root_prerequisite` (or none), and re-declares the module's spirits, opinion modifiers and tree-declared effects under this tree's prefix. The compiler then checks the whole tree as one; a copied key or position that collides with the tree's own fails the build.

### Conditions

`{ "flag": "x" }`, `{ "not_flag": "x" }`, `{ "global_flag": "x" }`, `{ "exists": "Name" }`, `{ "at_war": true }`, `{ "at_war_with": "Name" }`, `{ "after": "1750.1.1" }`, `{ "before": "1755.1.1" }`, `{ "focus_done": "key" }`, `{ "spirit": "k" }`, `{ "ideology": "shadow" }`, `{ "people": "elves" }`, `{ "rule": { "name": "zin_rule_historical_path", "option": "HISTORICAL" } }`, `{ "is_subject": true }`, `{ "subject_of": "Name" }`, `{ "country": "Name" }`, `{ "stability_above": 0.5 }`, `{ "variable": { "name": "x", "above": 10 } }`, `{ "check": "zin_aenor_council_dominant" }` (a scripted trigger from a mechanics spec or the tree), `{ "not": [] }`, `{ "or": [] }`, `{ "raw": "script" }`.

Ideology keys are `light`, `dominion`, `shadow` and `wild`; people keys are those of the peoples spec.

**Story dates.** `after` and `before` dates are story dates: the compiler shifts them with `paceDate()` from `tools/content/lib/story_dates.mjs` and writes one test per `zin_rule_story_pace` option, so every tree date moves with `zin_story_pace` (V4, R2).

### Events

`{ "title", "desc", "picture", "hidden", "options": [ { "name", "effects", "ai_chance" } ] }`. `ai_chance` has the shape of a focus's `ai` (`base` and `modifiers`). Events are triggered only by effects unless they declare `"trigger"` and `"mean_time_to_happen"` (allowed only in mechanics-owned event files).

Every compiled event sets `timeout_days = 30`. A timed-out event takes its **first** option, so an event a human answers at a story checkpoint lists its non-committal option first and its historical option second (E2).

A gated picture may be used only by an event that cannot fire before the gate flag: its trigger requires the flag, every effect that fires it sits behind the flag, or the effect that fires it sets the flag first (catalog rule 4, E5).

## Compiler checks

The build fails when any of these fail:

1. Every country in the roster has exactly one tree; every name in a tree exists.
2. Keys are unique; every prerequisite and exclusive exists; no cycles; a focus sits below its prerequisites; positions are unique (copied modules included).
3. `days` are multiples of 7; costs between 1 and 20 weeks.
4. Icons and event pictures exist in their catalogs (missing art falls back to a generic icon with a warning until the art phase).
5. Modifiers exist in the game's modifier documentation, including its templated families such as `production_speed_<building>_factor` and `state_production_speed_<building>_factor` for real building types; ideology and people keys are valid; scripted effects and triggers named by `call` and `check` exist; every namespaced event and full idea id exists in its owner's module.
6. **Key collisions (F3).** No spirit key equals a focus key of the same tree, and no compiled focus, spirit, event, effect, trigger or opinion-modifier id equals an id another module writes: a mechanic's decision, idea or opinion modifier, a warfare sub-unit, a character, or another tree's id. Two such ids would share a localisation key.
7. Every keyword argument of a `call` has a code in `focus_arg_codes.json`; every argument a tree-declared effect reads is passed (E1).
8. `allow_branch` holds only the conditions the E4 rule allows, and every refreshed condition there is repeated in the branch head's `available`.
9. Text is non-empty and uses only Windows-1252 characters; no superseded names (Einendil, Edvoid, Rush), no retired name of [00_contract_additions.md](../04_mechanics/00_contract_additions.md) (the shared name check `tools/content/checks/names.mjs`, N16), and no reveal of Afrit's name in any text reachable before the reveal flag (`zin_afrit_revealed`).
10. `raw` blocks are reported; a major tree may use at most ten.

After compiling, the HOI4 Agent Tools focus inspector and script validator check the staged files; the focus renderer produces a review image for each major tree.

## Shared trees

A shared tree covers many countries. Text uses `[ROOT.GetName]` and `[ROOT.GetAdjective]`. Branches open by people, start region or start coast through `allow_branch`, and by ideology, overlord or story state through `allow_branch` with the matching `available` (E4), so one tree reads differently for an orc hold and a human freehold. Shared trees tag their modules (`"module"`) so tier B trees can copy them.

A tier's focus range ([01_tiers_and_coverage.md](01_tiers_and_coverage.md)) counts the whole tree, not one country's view of it (F6).

## Story hooks owned by Aenor (F7)

A tree that fires an event to "the Aenor realm that holds Parim" writes `{ "call": "zin_aenor_event_for_parim", "args": { "event": "k", "days": 0 } }`. An event id cannot sit in a variable, so the compiler writes this call as the Aenor mechanic's effect (which saves the global event target `zin_aenor_parim_realm`) followed by `event_target:zin_aenor_parim_realm = { country_event = { id = <event> days = <days> } }` ([aenor_court_and_succession.md](../04_mechanics/aenor_court_and_succession.md)). Trees declare no `_event_for_parim` helpers of their own; the per-tree helpers are retired.

## Acceptance

1. `npm test` in `tools/` compiles a synthetic tree that uses every effect, condition and block above and compares the staged files with expected output.
2. Negative tests: a spirit key equal to a focus key, a tree id equal to a mechanic decision id, a keyword argument without a code, a changing condition in `allow_branch` without its `available` repeat, an ideology test in `allow_branch` of a tree with no refresh, a retired name in text, and a copied position on top of a tree focus each fail the build.
3. A call with arguments compiles to `set_temp_variable` lines for every `zin_arg_` name and then `<effect> = yes`; a doctrine research boost compiles to `add_doctrine_cost_reduction` and any other to `add_tech_bonus`; every compiled event has `timeout_days = 30`.
4. `common/on_actions/zin_focus_layout.txt` exists once and names the six on_actions of E4.
5. In the Linux run, a compiled tree shows its icons from `interface/zin_catalog_focus_icons.gfx`, and `error.log` has no line from a compiled tree file.
