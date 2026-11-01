# MCP request: names for states, strategic regions and victory points from the caller

Filed 2 November 2026 by the ZIN naming pass. Disposition: queued for the HOI4 Agent Tools worker. ZIN works around it meanwhile (see "Workaround in the mod").

## Task

Let `create_world` take the names of states, strategic regions and victory points from the caller, by position, so that `localisation/replace/world_l_english.yml` is written with natural names in a single definition per key.

## Tool

`hoi4.map_rewrite`, operation `create_world` (runtime 4.6.4, `dist/hoi4_agent_tools/map/world.js` and `dist/hoi4_agent_tools/map/gameplay/names.js`).

## Inputs available today and why they fall short

| Route | What it names | Why it does not serve ZIN |
| --- | --- | --- |
| Geography model `sites` | A victory point and, through the best candidate, its state | A site also gives victory points, ports, mines and fortifications (importance 1 to 5). Naming 2,600 places this way would invent 2,600 sites and change the economy and the harbours. |
| Geography model `places` | The victory point of the land province nearest the place, only when no river or lake name applies first (`names.js`: `riverIndex`, then `lakeShore`, then `places.get(id)`) | A river or lake beside a province takes precedence, so the name cannot be guaranteed. Every place enters `modelHash` and the geography report. The nearest-province reach is 2% of the map width (about 100 pixels), so the call is not exact. |
| `reference.labels` kind `state`, `region`, `sea` | The state or strategic region of the nearest province to the label | Works for states and regions. Two labels in one state join as "A / B". Each label also writes a `WORLD_GEOGRAPHY_n` key. It names no victory point. |
| `reference.cities` | A victory point of the province under the point | Applied only in the branch of `world.js` that runs without a geography (`economy === undefined`). With a geography the economy plan overwrites `cityNames` from `economy.names.victory`. |

So states and regions can be named from the call file, victory points cannot, and a label-per-state route (about 3,300 labels) is tied to coordinates that only exist after the partition is known.

## Current behaviour

`nameWorld` (`names.js`) names a state from its best candidate (site, lake shore, river valley, range foothills, place coast, region, land). Names shared by several states get a compass word and a Roman numeral by position (`uniqueNames`). A victory point without a site, river or lake takes "<state> Town". A feature the model does not name gets "<realm> District N", "<realm> Settlement N" or "Region N" (`MAP_NAME_PLACEHOLDER`).

On the ZIN map (commit d9a0e9fc, 2,656 states, 2,665 victory points, 701 strategic regions) 2,471 state names, 2,565 victory point names and 604 region names are formula names such as "Southwestern Cold Lands II" and "Southwestern Cold Lands II Town". The tool counted 1,289 pure placeholders.

## Wanted change

An optional `names` input on `create_world`, as an inline object or a workspace-relative `namesPath` JSON file (like `geographyPath`):

```json
{
  "states": [{ "at": { "x": 3061, "y": 1464 }, "name": "Parim" }],
  "victoryPoints": [{ "at": { "x": 3061, "y": 1464 }, "name": "Parim" }],
  "regions": [{ "at": { "x": 3100, "y": 1500 }, "name": "The Vale of Aenor" }]
}
```

- `at` is a world pixel (top-left origin, like `reference.labels`). A state takes the name when the pixel lies in one of its provinces. A victory point takes it when the pixel lies in its province. A strategic region takes it when the pixel lies in one of its provinces, land or sea.
- A caller name wins over every model-derived name. Names the caller does not give keep today's behaviour.
- Diagnostics: `MAP_NAME_UNMATCHED` (a point that lies on no province of the wanted kind), `MAP_NAME_POINT_DUPLICATE` (two names for one feature), `MAP_NAME_DUPLICATE` (a text used twice), and `MAP_NAME_PLACEHOLDER` counted after the override.
- No localisation key beyond `STATE_n`, `VICTORY_POINTS_n` and `STRATEGICREGION_n`. No `WORLD_GEOGRAPHY_n` keys.
- A name table in the call is part of the request hash, so an unchanged call still returns `MAP_CHANGES_UNCHANGED`.

Optional and lower priority: report, with the preview, the pixel of every state, province-with-victory-point and strategic region (`anchor`: the centre of the largest province), so a caller can key a name table without reading `provinces.bmp`.

## Evidence

- `dist/hoi4_agent_tools/map/gameplay/names.js`: `uniqueNames`, `compass`, `roman`, the `Town` fallback and `MAP_NAME_PLACEHOLDER`.
- `dist/hoi4_agent_tools/map/world.js` lines 1192 to 1210 (label names), 1285 to 1291 (economy names overwrite city names) and 1354 to 1358 (city names only without an economy).
- `localisation/replace/world_l_english.yml` of commit d9a0e9fc, which holds the counts above.

## Priority

Medium. The game works with the workaround. The request removes a second definition of 6,000 keys and the dependence on replace-file load order.

## Workaround in the mod

`tools/content/modules/world_names.mjs` stages `localisation/replace/zin_world_names_l_english.yml` with the same keys and natural values. `zin_` sorts after `world_`, and the files of a replace folder load in name order, so the ZIN value should win. This is not verified in the game: the Linux run must confirm which value shows and that the log holds no duplicate-key line for these keys. If the engine keeps the first definition, the names stay formulas until this request lands. The pass is keyed by geography, not by id (the anchor of each place is its largest province's centre), so a map write that renumbers the states keeps the names where the land is unchanged.

## Acceptance

1. A `create_world` call with `namesPath` writes `world_l_english.yml` with the given names for the keys whose points match, and `MAP_NAME_UNMATCHED` is empty.
2. A second identical call returns `MAP_CHANGES_UNCHANGED`.
3. With the table covering every state, victory point and region, `MAP_NAME_PLACEHOLDER` reports zero and no compass-plus-numeral name remains.
4. ZIN then removes `modules/world_names.mjs` from the build and emits the same table as the call input.
