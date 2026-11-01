# World names

The map tool (HOI4 Agent Tools `create_world`) names what the geography model names and gives every other state, strategic region and victory point a formula name: a compass word, a land name and a numeral ("Southwestern Cold Lands II"), "<state> Town", "<realm> District N", "<realm> Settlement N" or "Region N". The tool owns `localisation/replace/world_l_english.yml` and rewrites it on every map write, so the content builder never edits it. The step `tools/content/modules/world_names.mjs` stages `localisation/replace/zin_world_names_l_english.yml` with the same keys and natural values. The request for a native input is `docs/plans/zin-map/naming_request.md`.

## What it does

1. Reads the map in the mod (`history/states`, `map/strategicregions`, `map/definition.csv`, `map/provinces.bmp`) and the tool's current names.
2. Keeps every name that is not a formula: sites and features of the geography model, and derived feature names such as "Konorar Valley". A formula is a compass word, a numeral, "District", "Settlement", "Region N", a trailing "Town" or a trailing "Coast".
3. Renames a kept name that appears twice, such as a site set on two states: the realm's capital seat first, then the state that bears the name, then the larger point.
4. Names the rest.

| Kind | Name |
| --- | --- |
| Victory point with 25 points | The capital of its realm on the roster, even where the model put a feature name on the point. The state that holds it takes the same name, unless the model's name of the point fits a land (The Cursed Square, South Gate Fortress, Sun Desert), in which case the state keeps that. A bay or sea name (Bay of Safeton) goes to the nearest unnamed sea region. |
| The 60 largest Aenoran towns | Hand-composed names from `tools/content/data/world/hand_names.json` (recipes of Aenoran elements such as "crown city", "grey harbour", "high gate"), given in order to the realms' largest unnamed points by points and then by position. |
| Other victory point | A settlement name in the language of the owner, sized by its points (1 to 2 a hamlet, 8 a city, 12 or more a great city). Never a chart ending, which names a land. |
| State | The generator's state kind in the owner's language, shaped by the state's terrain and coast. Unowned land takes the language of the nearest owned state. |
| Land region | A land name in the language of the realm that holds most of it. A range name where mountains make up 40 per cent or more, a wood name where forest makes up half. |
| Sea region | A form and the single-word name of the nearest coastal state: "Bay of X", "X Sound", "Gulf of X", "X Reach", "Sea of X", "X Deep". |
| Zol's Mistake, the Mushroom Forest | No language. English compounds of a theme list ("Ashmoor", "Raven Crag", "Velvet Dell"). |

The names come from the language generator of `docs/specs/02_lore/06_languages.md` through `placeNames`, so they are unique across the whole world, persons included, and carry a gloss. A draw is redrawn when it holds a banned or real-world substring, "waith", a plain English word such as "West", or more than 12 letters (16 for Long Speech). Šodolôrō is written Šodolôro, as all game text writes it.

## Stability

A map write renumbers states, provinces and regions. Each name is drawn from a seed made of the grid position of the place's anchor (the centre of the largest province of a state, the province of a point, the mass centre of a region), not from its id. A write that leaves the land where it is gives the same names.

## Files

- `localisation/replace/zin_world_names_l_english.yml`: the override keys, UTF-8 with BOM, no version marker.
- `docs/design/world_names.json`: every changed key with its name, language, layer, gloss and anchor.
- `tools/content/world_names.test.mjs`: coverage, uniqueness, font, capitals, determinism.

## Interactions

- Runs after `buildWarfare`, the last other user of the shared name registry, so no earlier module's names move.
- `lib/map_features.mjs` reads state names from the tool's file only for display; the override does not change any id or script.
- No icons, sprites or interface files.

## Open points and future work

- The engine's handling of two replace files that define the same key is not verified. If the tool's value wins, the names stay formulas until the tool takes names from the caller.
- Aenoran still names about 860 other places by the generator, so its smaller places share syllables more than the 60 hand-named towns do. `hand_names.json` takes a recipe list for any language, so another language or a longer Aenoran list needs only data.
- Ids renumber when the map is rewritten. Run `node --test tools/content/world_names.test.mjs` after every map write: it fails if a key is left without a name.
