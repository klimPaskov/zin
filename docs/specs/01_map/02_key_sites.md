# Key sites

**Status:** Ready. Reviewed 19 October 2026 against CONVENTIONS "Status"; integrated 19 October 2026. **Priority:** 1. **Phase:** 1.

## Purpose

Places that mechanics, events or focus trees refer to. Each needs a stable, named state or victory point so scripts can target it. Scripts find sites only through scripted triggers named for the site (for example `zin_is_site_parim`), never through raw state numbers, so a map rebuild changes one generated file. This spec is the single table of those sites: every site trigger, every region trigger, the rule that resolves each one on the map, and what the map must hold. Under decision E7 it owns every `zin_is_site_*` and `zin_is_region_*` trigger, `zin_aenor_fallback_seat` and `zin_controls_sea_central`; no other spec defines one.

## Lore basis

- Established places (vault, *Erdae and Its Regions*, *Middle Lands and Aenor*, *Zols Mistake*, *Volgans Dead Lands*, *Abyss*, *Nether*, *Castle of Yeldenne and Glo*, *The Campaign of 4A 1748*): Parim, the Great Lake, the Great Wall of Aenor (from the Organ Mountains past Lunhrim and around Kingson), Kingson, Selen, the Zilin Hills, Dragon Mountain, the Abyss, the Nether, Šodolôrō (game text: Šodolôro, S11), the black islands of the Ocean of Zol, Mp'E and the Castle of Yeldenne. Working seats (established working table, constructed names, replaceable): Sonargur, Fandanar, Furvior, Postondoroth, Cocanoor, Notbuton, Nafeher, Furviatlon.
- Established events with open places: Eindil wakes in the Cold Lands; Afrit casts Eindil off a cliff after the palace battle; the battle of Dardan (First Age).
- Proposed in the vault: the Golden Court as the King's party, the Mirror of First Rain, the Bridge of the Three Oaths, the Winter Ford, the southern island episode.
- **Proposed (this spec):** every trigger name not already in the contract additions, every resolving rule, the global site variables and the data format.
- Open places stay open: Dardan is not placed; the Organ Mountains, Lunhrim and the Narrow Strait proceed on the owner short-list 3 proposal (the strait lies between the North Lands and the Middle Lands); the Nether proceeds on short-list 5 (Volgan's realm).

## Design

### 1. How a site is resolved

Each site is one row of `tools/content/data/sites.json`. A row has a key, a kind and a rule.

| Kind | Generated trigger (state scope) | Example |
| --- | --- | --- |
| `state` | one state: `zin_is_site_<key> = { state = <id> }` | `zin_is_site_parim` |
| `list` | several states: `zin_is_site_<key> = { OR = { state = <id> … } }` | `zin_is_site_great_wall` |
| `region` | the roster region of the state's owner at the start: `zin_is_region_<key>` | `zin_is_region_dark_lands` |

The rule is one of these (all *proposed*). "Adjacent" means two provinces whose pixels touch in `map/provinces.bmp`; "state steps" counts adjacent-state moves.

| Rule | Resolves to |
| --- | --- |
| `capital` (country name) | that country's capital state at the start |
| `vp` (victory point name, or province id) | the state that holds the named victory point |
| `state_name` (name) | the state with that localised name |
| `owned` (country names, optional filter) | the states those countries own at the start, filtered by `coastal`, `naval_base`, `adjacent_to` (a country or site) or `on_sea` (sea strategic regions) |
| `border` (two country names) | the states of each side that touch the other |
| `nearest` (target site, filter) | the state passing the filter with the fewest state steps to the target; ties: lowest state id |
| `farthest` (from site, within list, filter) | the state of the list with the most state steps from the site; ties: lowest state id |
| `path` (waypoint sites) | the shortest land path of states between consecutive waypoints; ties: lowest state ids |
| `same_as` (site) | the same state as another site |
| `data` (file) | a state list another spec's module writes; the row names the file |

A rule that resolves to no state, or a `state` row that resolves to more than one, fails the build. Results are frozen per build: conquest never changes a site.

Every `state` site also gets a global variable `zin_site_<key>` (*proposed*) holding its state id, set by the startup effect `zin_sites_set_variables`, so effects can target it (`var:global.zin_site_parim`, `var:global.zin_site_three_oaths`).

**One file from every module (E7).** A builder module that reads sites may declare the rows it needs (`export const SITE_ROWS`, same format as `sites.json`). `build.mjs` gathers those rows and the rows of `sites.json` and hands them to `modules/sites.mjs`, which writes the one file `common/scripted_triggers/zin_sites.txt`. Identical rows merge; two rows with the same key and a different kind or rule fail the build, naming both modules. Every row, wherever it is declared, appears in the table of section 3; a declared row missing from the table fails the build too, so this table stays the master.

### 2. Region triggers

`zin_is_region_<key>` is true for a state whose owner's roster region (`tools/content/data/countries.json`, `scan`) was `<key>` at the start. Keys follow the economy spec's `zin_region_<key>` flags ([02_economy.md](../03_gameplay/02_economy.md)); the diplomacy spec's frozen collections `zin_region_<key>` hold the same states.

| Trigger | Roster region | Read by |
| --- | --- | --- |
| `zin_is_region_middle_lands` | Middle Lands and Aenor Isle | Western Crossing, diplomacy |
| `zin_is_region_north_lands` | North Lands | Lerendor |
| `zin_is_region_cold_lands` | Cold Lands | Cold Lands |
| `zin_is_region_west_lands` | West Lands | Western Crossing |
| `zin_is_region_tritons_islands` | Triton's Islands | diplomacy |
| `zin_is_region_dark_lands` | Dark Lands (47 states today) | Lerendor, Dark Lands |
| `zin_is_region_magical_lands` | Magical Lands | elves |
| `zin_is_region_zols_mistake` | Zol's Mistake and the Ocean of Zol | Magical Lands trees |
| `zin_is_region_dead_lands` | Dead Lands | warfare, world systems |
| `zin_is_region_east_lands` | East Lands | eastern kings |
| `zin_is_region_islands_of_the_south` | Islands of the South | diplomacy |
| `zin_is_region_lands_of_the_sun` | Lands of the Sun | Lands of the Sun |

Sub-region lists (kind `list`):

| Trigger | Rule | Read by |
| --- | --- | --- |
| `zin_is_region_south_lands` | East Lands states whose dominant terrain is desert and whose centre lies at or below map row 1550 of 2560 (84 states today; short-list 6 proposal) | [eastern_kings.md](../04_mechanics/eastern_kings.md) |
| `zin_is_region_far_northwest` | the 12 Cold Lands states with the most state steps from Fandanar on the north-west edge, unless the owner draws a line | [cold_lands.md](../04_mechanics/cold_lands.md) |
| `zin_is_region_mpe_approach` | states adjacent to Mp'E | Cold Lands, Yeldenne and Glo |

`zin_is_dark_lands_state` (Dark Lands spec) means the same as `zin_is_region_dark_lands`; the generator writes it as an alias until that spec uses the region name (the contract's retired table lists it; only this module may write it).

### 3. The site table

"Map today" is the politics output of 19 October 2026 (commit `ca01fa3`). Map changes go through the map rewrite and the politics step ([01_map_accuracy.md](01_map_accuracy.md)).

**Seats**

| Trigger | Site | Lore | Kind, rule | Map requirement | Map today | Read by |
| --- | --- | --- | --- | --- | --- | --- |
| `zin_is_site_parim` | Parim | established working seat | state, `capital` Aenor | Aenor capital; victory point 50; palace landmark when landmarks exist | state 238 "Parim"; victory point 25 (raise to 50) | Aenor, Afrit, Volgan, Western Crossing, trees |
| `zin_is_site_kingson` (new) | Kingson | established | state, `capital` Kingson | Satellite on the wall | Kingson's states named "Kingson District N" | wall, Aenor |
| `zin_is_site_selen` (new) | Selen | established | state, `capital` Selen | Victory point at its capital | state 202 "Selen" | Aenor, Eindil |
| `zin_is_site_sonargur` | Sonargur | established working seat | state, `capital` Lerendor | Lerendor capital; naval base of level 3 or more on the strait | capital state 6, victory point "Sonargur"; no naval base yet | Lerendor |
| `zin_is_site_fandanar` | Fandanar | established working seat | state, `capital` Coldor | Coldor capital | matches (state 426) | Cold Lands |
| `zin_is_site_furvior` | Furvior | established working seat | state, `capital` Noris | Noris capital | matches (state 558) | eastern kings |
| `zin_is_site_postondoroth` | Postondoroth | established working seat | state, `vp` Postondoroth | Stabilo's seat (map accuracy S5) | a victory point in Drak's state 1107; Stabilo's capital is Fudol (east lands question 2; proceeds on the map accuracy action) | eastern kings, Stabilo |
| `zin_is_site_cocanoor` | Cocanoor | established working seat | state, `capital` Goldoroth | capital victory point named Cocanoor (S6) | "Fabdernor" (state 1154) | Dark Lands |
| `zin_is_site_notbuton` | Notbuton | established working seat | state, `capital` Dondor | capital victory point named Notbuton (S7) | "Dunnoor" (state 161) | Dark Lands |
| `zin_is_site_nafeher` | Nafeher | established working seat | state, `capital` Volgan | capital victory point named Nafeher (S8); a large city, not the megalopolis | "Neleelon" (state 299, the only megalopolis) | Volgan, Volgan tree |
| `zin_is_site_furviatlon` | Furviatlon | established working seat | state, `capital` Zol | capital victory point named Furviatlon (S9); at most a town | "Fobuler" (state 502) | Zol |
| `zin_is_site_yeldenne` | Castle of Yeldenne, Mp'E | established | state, `capital` Yeldenne | state named Mp'E; capital victory point named Castle of Yeldenne (S11) | state 1063 "Simoto" | Yeldenne and Glo |
| `zin_is_site_gala` | Gala and the Mirror of First Rain | Gala established; the Mirror proposed | state, `capital` Gala Elves | Gala Elves' capital; the Mirror is a scripted site here, no separate state | capital "Sodoli" | Lorien, Lands of the Sun |
| `zin_is_site_mirolon_seat` | Mirolon's seat | constructed name | state, `capital` Mirolon | — | capital "Miherta" (accepted, map accuracy S12) | Volgan |
| `zin_is_site_zilin_hills` (new) | The Zilin Hills | established (Worshipdom) | list, `owned` Worshipdom | the Worshipdom's three states | capital state 1034 "Lenlakron" | Afrit, elves |

**Sites of the story**

| Trigger | Site | Lore | Kind, rule | Map requirement | Map today | Read by |
| --- | --- | --- | --- | --- | --- | --- |
| `zin_is_site_eindil_ice` | Eindil's ice | region established (the Cold Lands); exact place proposed | state, `farthest` from Fandanar within `zin_is_region_far_northwest`, not a capital | none | resolves | Eindil, Cold Lands |
| `zin_is_site_yeldenne_landing` | The landing below Mp'E | proposed | state, `nearest` to `zin_is_site_yeldenne`, filter coastal (the coastal state nearest Mp'E) | none | resolves | Eindil (landfall, event `zin_eindil.70`), Cold Lands, flavour events |
| `zin_is_site_grey_ford` | The Grey Ford | proposed | list, `border` Gunwaith–Girdon: the pair of states (one per side) with the longest shared border | none | resolves | Western Crossing, Gunwaith |
| `zin_is_site_three_oaths` | Bridge of the Three Oaths | proposed (vault episode) | state, the Gunwaith state of `zin_is_site_grey_ford` | none | resolves | Eindil |
| `zin_is_site_winter_ford` | Girdon's Winter Ford | proposed (vault episode) | state, the Girdon state of `zin_is_site_grey_ford` | none | resolves | Eindil |
| `zin_is_site_south_shrine` | The shrine beneath the tide | proposed | state, `capital` Enhis Is Rond (the journey spec's and the Islands of the South trees' proposal: the shrine lies off its southern shore) | none | resolves | Eindil (`zin_eindil.43`), Enhis Is Rond tree |
| `zin_is_site_palace_cliff` | The palace cliff | established event, place open | state, `same_as` `zin_is_site_parim` | no map change | — | Eindil, Afrit |
| `zin_aenor_fallback_seat` | Aenor's fallback seat | proposed | list, the three Aenor states with the fewest state steps to Parim, not Parim; resolved once per build and frozen as a fixed state list (E7: this table owns it; the Aenor spec only reads it) | none | resolves | Aenor |
| `zin_is_site_aenor_court_lands` | Parim's hinterland estates | proposed | list, `owned` Aenor, filter `adjacent_to` Parim | none | resolves | Aenor |
| `zin_is_site_aenor_temple_cities` | The Great Lake cities | proposed | list, `owned` Aenor, filter `on_sea` the Great Lake, not Parim | the Great Lake as a named water region | resolves once the lake is named | Aenor |
| `zin_is_site_aenor_marches` | Aenor's marches | proposed | list, `owned` Aenor, filter `adjacent_to` any country that is neither Aenor nor its subject, or a `zin_is_site_great_wall` state | none | resolves | Aenor |

**Geography**

| Trigger | Site | Lore | Kind, rule | Map requirement | Map today | Read by |
| --- | --- | --- | --- | --- | --- | --- |
| `zin_is_site_great_lake_ports` (new) | The Great Lake ports | established region | list, `owned` Aenor, filter `on_sea` the Great Lake | three or more coastal victory points on the lake | map label only | Aenor economy, navy, the Golden King events (`zin_reign`), Aenor tree |
| `zin_is_site_great_wall` | The Great Wall of Aenor | established geography | list, `data`: the map step's traced wall line, Aenor-side states | level-5 fort in every wall-side province on the Aenor side (map accuracy G5); labels for the Organ Mountains and Lunhrim at its ends (K6) | border only; no forts | warfare, elves, diplomacy, trees |
| `zin_is_site_elven_wall` | The elven side of the Wall | proposed | list, elven-realm states adjacent to a `zin_is_site_great_wall` state | none | resolves | Magical Forest |
| `zin_is_site_nolorim_passes` | Nolorim's high passes | proposed | list, `owned` Nolorim, filter mountain terrain | none | resolves | elves |
| `zin_is_site_boundary_groves` | The Boundary Groves | proposed | state, the Herrodon state with the longest border with Andos Enda | none | resolves | elves, Magical Lands |
| `zin_is_site_dragon_mountain` (new) | Dragon Mountain | established; not a country | state, `state_name` Dragon Mountain | a named state in the Magical Lands, owned by the nearest elven realm (K2) | map label only | dragons, world systems |
| `zin_is_site_mirolon_passes` | Mirolon's northern passes | proposed | list, `owned` Mirolon, filter `adjacent_to` Volgan (Mirolon core states that border a Volgan core state) | forts on the border (K9) | no forts | Volgan, Mirolon, Mirolon tree |
| `zin_is_site_abyss` | The Abyss | established | state, `state_name` the Abyss (today the state whose name contains "Abyss": 298) | a state named the Abyss in the Dead Lands (K3) | state 298 "Vez Nan / Abyss" | Volgan, Volgan tree |
| `zin_is_site_nether` | The Nether | established | state, `same_as` `zin_is_site_nafeher` until the map step gives the Nether its own state, then `state_name` the Nether | a named state in the south of the Dead Lands, owned by Volgan (K4, short-list 5 proposal) | part of state 299 (Volgan's capital state), so it shares that state today | Volgan, Volgan tree |
| `zin_is_site_troll_forest` | The Troll Forest | established (stays separate) | state, `capital` Troll Forest | — | resolves | Dark Lands |
| `zin_is_site_goldoroth_march` | Goldoroth's march | proposed | list, `owned` Goldoroth, filter `adjacent_to` Dondor or Belonton | none | resolves | Dark Lands, Goldoroth |
| `zin_is_site_sea_of_darkness_coast` | The Sea of Darkness coast | drawn sea name | list, every state with a coastal province on the Sea of Darkness sea regions | the sea region named (map accuracy N1) | sea regions unnamed | Dark Lands |
| `zin_is_site_sodoloro` | Šodolôrō | established | state, `vp` Šodolôro | a named victory point in Zol's Mistake (K8) | region label only | Zol |
| `zin_is_site_ocean_of_zol_island` | The black islands | established | list, Zol's states with no land path to the Mistake's mainland | none | resolves | Zol |
| `zin_is_site_ocean_of_zol_coast` | The Ocean of Zol coast | established sea | list, every state with a coastal province on an Ocean of Zol sea region | the sea regions named (N1) | sea regions unnamed | Zol, Magical Lands, Dark Lands, East Lands (with `zin_is_region_east_lands` for the East Lands' northern coast), flavour events |
| `zin_is_site_rift_west` | The rift coast of the Magical Lands | established (the rift sea) | list, Magical Lands states with a coastal province on the rift sea regions | the rift sea regions named | unnamed | eastern kings, elves, trees |
| `zin_is_site_rift_east` | The rift coast of the East Lands | established | list, East Lands states on the same sea regions | as above | unnamed | eastern kings, elves |
| `zin_is_site_road_salt`, `_gold`, `_rift`, `_lake`, `_sand` | The five caravan roads | proposed | list, `path` through the waypoints of [eastern_kings.md](../04_mechanics/eastern_kings.md) ("Five roads") | none | resolves | eastern kings, Noris, Stabilo |
| `zin_is_site_strait_north` | The Leren shore of the Narrow Strait | strait established; place on the short-list 3 proposal | list, `owned` Lerendor, filter `on_sea` the strait sea regions (includes Sonargur) | the strait sea regions named | unnamed | Lerendor |
| `zin_is_site_strait_south` | The far shore of the strait | as above | list, Middle Lands and Dark Lands states on the same sea regions | as above | unnamed | Lerendor |
| `zin_is_site_strait_gateway` (new) | R'en's strait coast, the gateway between the Leren and Aenor seas | proposed | list, `owned` R'en, filter `on_sea` the strait sea regions | as above | unnamed | Lerendor (`zin_leren_holds_strait`, the strait-barred hook and the *Master of the Strait* outcome, O9) |
| `zin_is_site_dark_strait_north` | The northern strait of the Dark Lands | straits established; places open (Dark Lands question 1) | list, both shores of the sea regions between the Dark Lands and the North Lands | the straits' sea regions named | unnamed | Dark Lands |
| `zin_is_site_dark_strait_south` | The southern strait of the Dark Lands | as above | list, both shores of the sea regions between the Dark Lands and the Middle Lands | as above | unnamed | Dark Lands, Goldoroth |
| `zin_is_site_dark_strait_north_shore`, `zin_is_site_dark_strait_south_shore` | The Dark Lands side of each strait | as above | lists, the `zin_is_region_dark_lands` states of `_north` and of `_south` | as above | unnamed | Dark Lands (`zin_dark.80`, `zin_dark_shore_barred`), Dark Lands trees |
| `zin_is_site_dark_strait_north_far`, `zin_is_site_dark_strait_south_far` | The far side of each strait | as above | lists, the other states of `_north` and of `_south` | as above | unnamed | Dark Lands, Goldoroth (`zin_goldoroth_wargoal_strait_south`) |
| `zin_is_site_dark_strait_shore`, `zin_is_site_dark_strait_far_shore` | Either strait's Dark Lands side; either far side | as above | lists, the union of the two `_shore` lists; the union of the two `_far` lists | as above | unnamed | Dark Lands (`zin_goldoroth_claim_strait_shores`) |
| `zin_is_site_isengard_march` | The Isengard march | proposed | list, `border` Coldor–Isengard | level-3 forts on Isengard's side | no forts | Cold Lands, Coldor |
| `zin_is_site_neck_road` | The Neck Road | proposed | list, `path` Fandanar → Gunwaith's capital over the neck between the Cold Lands and the West Lands | none | resolves | Cold Lands |
| `zin_is_site_west_landing_isle` | The Aenor Isle landing | proposed | list, `owned` Asgard and Aenor on Aenor Isle, filter `naval_base` | — | Asgard's state | Western Crossing |
| `zin_is_site_west_landing_shore` | The Middle Lands west shore | proposed | list, the three to five Middle Lands states of Aenor or its dominions with a naval base, nearest the West Lands across the central sea | naval bases | resolves | Western Crossing |
| `zin_controls_sea_central` | Control of the central sea | the sea established (owner, G3) | country-scope trigger, `OR = { has_naval_control = <id> … }` over `sea_central` (below) | the sea regions listed in `sites.json` | resolves | Western Crossing |
| `zin_is_site_mushroom_forest` | The Mushroom Forest | established (Magical Lands); the state proposed | state, `state_name` Mushroom Forest, inside the elven realm that holds the forest (owner question 12 proposal); the row carries `"pending": true`, so the module writes no trigger until the map names the state | a named state | label only | flavour event `zin_lore.372`, built only once the trigger exists |

**Sites that are not states:** the Golden Court (a district of Parim, scripted as a Parim modifier; proposed name), the Mirror of First Rain (at `zin_is_site_gala`), the Fire-Mountain above Cocanoor (event flavour), Dardan (not placed until the owner decides; no row).

**Retired site names** (the build's name check fails on them): `zin_is_site_east_north_coast` (use `zin_is_site_ocean_of_zol_coast` with `zin_is_region_east_lands`) and `zin_is_sea_central` (use `zin_controls_sea_central`, E7).

**Sea regions.** Strategic-region scope has no usable triggers in 1.19.3 (only `hidden_trigger` and `meta_trigger`), so a sea test cannot be a strategic-region trigger. The central sea is a list of sea strategic region ids in `sites.json` (`sea_central`), and the generator writes the country-scope trigger `zin_controls_sea_central` (*proposed*): `OR = { has_naval_control = <id> … }`. The Western Crossing reads it; the strategic-region trigger `zin_is_sea_central` is retired (E7).

## Implementation

| File | Content | Written by |
| --- | --- | --- |
| `tools/content/data/sites.json` (new) | One row per site of section 3 (a `pending` flag on rows that wait for the map), plus the region keys, the named sea regions (`sea_central`, the Great Lake, the strait, the Dark Lands straits, the rift sea, the Ocean of Zol, the Sea of Darkness) by strategic region id | design data |
| `common/scripted_triggers/zin_sites.txt` (new) | Every `zin_is_site_*`, `zin_is_region_*` and list trigger, `zin_aenor_fallback_seat`, the alias `zin_is_dark_lands_state`, `zin_controls_sea_central`; one file for every module's rows (E7) | `tools/content/modules/sites.mjs` (new), from `sites.json` and the `SITE_ROWS` that `build.mjs` gathers from the other modules |
| `common/scripted_effects/zin_sites.txt` (new) | `zin_sites_set_variables` (global `zin_site_<key>` for every `state` site), called from `on_startup` in `common/on_actions/zin_startup.txt` | `sites.mjs` |
| `docs/design/map/sites_resolved.json` (new) | Every site with its resolved state ids and names, for review and for other modules (landing provinces, road lists) | `sites.mjs` |

`sites.mjs` reads the mod's politics-step files: `history/states/*.txt` (owners, provinces, victory points, naval bases), `map/definition.csv` (province type and terrain), `map/provinces.bmp` (adjacency), `map/strategicregions/*.txt` (sea regions), `localisation/english/state_names_l_english.yml` and `victory_points_l_english.yml` (names), and `tools/content/data/countries.json` (capitals, regions). It runs after the politics step and before any module that reads site results. Map changes themselves (renames, new states, forts, naval bases, victory point values) are the politics step's, listed in [01_map_accuracy.md](01_map_accuracy.md).

## Acceptance

1. **Build:** every row of `sites.json` resolves; a `state` row resolves to exactly one state and a `list` row to at least one (negative test: a planted row naming a missing victory point fails the build).
2. **Build:** `zin_sites.txt` is the only ZIN file that defines a `zin_is_site_*` or `zin_is_region_*` trigger; two modules declaring one key identically produce one definition, and a planted conflicting row (same key, other rule) fails the build naming both modules (negative test); no retired site name appears in a staged file. `zin_sites.txt` defines every trigger of section 3 and section 2 exactly once (rows marked `pending` excepted), and no ZIN file outside it tests a raw state id where a site exists (scan for `state = <id>` in generated script outside `zin_sites.txt` and the politics step's files).
3. **Build:** every site trigger named in another spec's file (`zin_is_site_*`, `zin_is_region_*`) is defined in `zin_sites.txt`; `hoi4.script_validate` reports no error in the file.
4. **Offline:** `hoi4.map_inspect` finds every map requirement marked done in the table: the named states and victory points, the wall forts, the naval base at Sonargur.
5. **Phase 1 report:** the table's "Map today" column is regenerated from `sites_resolved.json` and every row reads "resolves" or "matches" or has a recorded owner decision.
6. **Linux run (start as Aenor):** console checks show `global.zin_site_parim` equal to Parim's state id and `zin_is_site_parim` true for that state only.

## Open questions

All proceed on their proposals; the owner's copies are in [OPEN_QUESTIONS.md](../OPEN_QUESTIONS.md).

1. Where are Dardan, the Organ Mountains, Lunhrim and the Narrow Strait (short list 3)? Proceeds on: Dardan unplaced; labels at the Wall's two ends; the strait between the North Lands and the Middle Lands.
2. Who owns the Nether (short list 5)? Proceeds on: Volgan.
3. Where are the Dark Lands straits (Dark Lands question 1)? Proceeds on: the sea regions between the Dark Lands and each neighbouring landmass; the map phase records which straits are land crossings.
4. Should Stabilo's capital move to Postondoroth (east lands question 2)? Proceeds on the map accuracy action S5: move the capital; the site follows the victory point either way.
