# Focus tree data format and compiler

**Status:** Ready. **Priority:** 4. **Phase:** 4.

## Purpose

ZIN needs about 3,500 focuses across 305 countries. Writing them as raw Clausewitz script by hand would make them inconsistent and unsafe to rebuild. Instead, every tree is a JSON data file, and the content builder compiles it into game files, checks it, and writes it through the shared rewrite engine.

## Files

| Path | What |
| --- | --- |
| `docs/design/focus/<tree>.json` | One tree's data: the source of truth, staged into the mod repository by the builder |
| `docs/specs/05_focus_trees/<tier>/<tree>.md` | The design spec the data implements |
| `common/national_focus/zin_<tree>.txt` | Compiled tree |
| `common/ideas/zin_focus_<tree>.txt` | Its national spirits |
| `events/zin_<tree>.txt` | Its events (namespace `zin_<tree>`) |
| `common/scripted_effects/zin_<tree>.txt`, `common/scripted_triggers/zin_<tree>.txt` | Shared logic the tree declares |
| `localisation/english/zin_focus_<tree>_l_english.yml` | All its text |
| `interface/zin_focus_icons.gfx` | Icon sprites for the shared icon catalog |

## The tree file

```json
{
  "id": "aenor",
  "tier": "major",
  "countries": ["Aenor"],
  "summary": "One sentence.",
  "spirits": { "golden_court": { "name": "The Golden Court", "desc": "…", "icon": "crown_gold", "modifier": { "political_power_factor": 0.1 } } },
  "events": { "feast": { "title": "…", "desc": "…", "picture": "court_feast", "options": [ { "name": "…", "effects": [ { "political_power": 25 } ] } ] } },
  "focuses": [ { "key": "lost_cause", "name": "The Lost Cause", "desc": "…", "icon": "banner_league", "x": 4, "y": 0, "days": 70, "effects": [ { "add_spirit": "golden_court" } ] } ]
}
```

- `id`: lowercase letters, digits and underscores; unique. Focus ids compile to `zin_<id>_<key>`.
- `tier`: `major`, `regional` or `shared`.
- `countries`: exact country names. A shared tree lists every country it covers. Every country has exactly one tree.

### A focus

| Field | Meaning |
| --- | --- |
| `key` | Unique in the tree |
| `name`, `desc` | Text; `desc` one to three sentences |
| `icon` | Key from the icon catalog ([02_icon_catalog.md](02_icon_catalog.md)) |
| `x`, `y` | Grid position; no two focuses share one; a focus sits below every prerequisite |
| `days` | Multiple of 7; usually 35 or 70 |
| `prerequisite` | List of groups; a focus needs one focus from every group: `[["a"], ["b", "c"]]` means a and (b or c) |
| `mutually_exclusive` | Keys; made symmetric by the compiler |
| `available`, `bypass`, `allow_branch` | Lists of conditions |
| `ai` | `{ "base": 10, "modifiers": [ { "factor": 2, "if": [conditions] } ] }` |
| `filters` | Search filters: political, research, industry, stability, war_support, manpower, annexation, army, navy, air |
| `effects` | List of effects |

### Effects

Each effect is an object with one key. The compiler expands it to valid script.

| Effect | Example |
| --- | --- |
| Political power, stability, war support | `{ "political_power": 50 }`, `{ "stability": 0.05 }`, `{ "war_support": 0.05 }` |
| Experience | `{ "army_experience": 10 }`, `navy_experience`, `air_experience` |
| Manpower | `{ "manpower": 5000 }` |
| Spirits | `{ "add_spirit": "k" }`, `{ "remove_spirit": "k" }`, `{ "swap_spirit": ["old", "new"] }`, `{ "timed_spirit": { "key": "k", "days": 180 } }`. A short key names this tree's spirit (`zin_<tree>_<key>`); a full id starting with `zin_` names an idea owned by a mechanics spec, which the compiler checks exists |
| Events | `{ "event": "k" }`, `{ "event": { "key": "k", "days": 3 } }`, `{ "event_for": { "country": "Name", "key": "k" } }` |
| Flags and variables | `{ "flag": "x" }`, `{ "clear_flag": "x" }`, `{ "global_flag": "x" }`, `{ "variable": { "name": "x", "add": 1 } }` |
| Politics | `{ "popularity": { "ideology": "light", "value": 0.1 } }`, `{ "government": "light" }` |
| Buildings | `{ "building": { "type": "industrial_complex", "level": 1, "where": "capital" } }`; `where` is capital, random_owned, random_coastal or a site key |
| Research | `{ "research": { "categories": ["land_doctrine"], "bonus": 0.5, "uses": 1 } }` |
| Equipment | `{ "equipment": { "type": "infantry_equipment", "amount": 500 } }` |
| Countries | `{ "annex": "Name" }`, `{ "puppet": "Name" }`, `{ "wargoal": { "target": "Name", "type": "annex_everything" } }`, `{ "claims_on": "Name" }`, `{ "cores_on": "Name" }`, `{ "guarantee": "Name" }`, `{ "non_aggression": "Name" }` |
| Factions | `{ "faction": "Name of faction" }`, `{ "invite": "Name" }`, `{ "join_faction_of": "Name" }` |
| Scopes and logic | `{ "for_country": { "country": "Name", "effects": [] } }`, `{ "if": { "limit": [], "then": [], "else": [] } }` |
| Mechanic calls | `{ "call": "zin_aenor_add_council_influence", "args": { "value": 5 } }` names a scripted effect the mechanics spec defines |
| Text | `{ "tooltip": "Shown text." }` |
| Escape hatch | `{ "raw": "script" }`; counted and reviewed; avoid |

### Conditions

`{ "flag": "x" }`, `{ "not_flag": "x" }`, `{ "global_flag": "x" }`, `{ "exists": "Name" }`, `{ "at_war": true }`, `{ "at_war_with": "Name" }`, `{ "after": "1750.1.1" }`, `{ "before": "1755.1.1" }`, `{ "focus_done": "key" }`, `{ "spirit": "k" }`, `{ "ideology": "shadow" }`, `{ "people": "elves" }`, `{ "is_subject": true }`, `{ "subject_of": "Name" }`, `{ "country": "Name" }`, `{ "stability_above": 0.5 }`, `{ "variable": { "name": "x", "above": 10 } }`, `{ "check": "zin_aenor_council_dominant" }` (a scripted trigger from a mechanics spec), `{ "not": [] }`, `{ "or": [] }`, `{ "raw": "script" }`.

Ideology keys are `light`, `dominion`, `shadow` and `wild`; people keys are those of the peoples spec.

### Events

`{ "title", "desc", "picture", "hidden", "options": [ { "name", "effects", "ai_chance" } ] }`. Events are triggered only by effects unless they declare `"trigger"` and `"mean_time_to_happen"` (allowed only in mechanics-owned event files).

## Compiler checks

The build fails when any of these fail:

1. Every country in the roster has exactly one tree; every name in a tree exists.
2. Keys are unique; every prerequisite and exclusive exists; no cycles; a focus sits below its prerequisites; positions are unique.
3. `days` are multiples of 7; costs between 1 and 20 weeks.
4. Icons and event pictures exist in their catalogs (missing art falls back to a generic icon with a warning until the art phase).
5. Modifiers exist in the game's modifier documentation, including its templated families such as `production_speed_<building>_factor` and `state_production_speed_<building>_factor` for real building types; ideology and people keys are valid; scripted effects and triggers named by `call` and `check` exist.
6. Text is non-empty and uses only Windows-1252 characters; no superseded names (Einendil, Edvoid, Rush) and no reveal of Afrit's name in any text reachable before the reveal flag (`zin_afrit_revealed`).
7. `raw` blocks are reported; a major tree may use at most ten.

After compiling, the HOI4 Agent Tools focus inspector and script validator check the staged files; the focus renderer produces a review image for each major tree.

## Shared trees

A shared tree covers many countries. Text uses `[ROOT.GetName]` and `[ROOT.GetAdjective]`. Branches open with `allow_branch` conditions on the country's people, ideology, overlord, coast or region, so one tree reads differently for an orc hold and a human freehold.
