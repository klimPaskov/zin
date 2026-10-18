# Countries and states

**Status:** Draft. **Priority:** 3. **Phase:** 3.

## Purpose

Set the data standard for all 305 countries and 1,332 states: what every record must contain, where it comes from, which values it starts with, and what is done and missing today. Mechanics, focus trees and events assume these standards hold.

## Lore basis

**Established (vault):**

- Erdae holds about 280 polities (working figure); the map holds 305 (*Great Powers and Relations*, *The Campaign of 4A 1748*).
- The working table of great powers, seats, alliances and rivals: Aenor (Parim, Middle Kingdom Concord, 26 satellites), Zol (Furviatlon), Volgan (Nafeher, Southern Dominion: Demon, Dolon, Nezer), Lerendor (Sonargur, Leren Compact), Coldor (Fandanar, Northern Accord), Noris (Furvior, Noris Treaty), Stabilo (Postondoroth, Stabilo Pact), Goldoroth (Cocanoor), Dondor (Notbuton, Dark Sea Accord). It is working map design, not fixed narrative canon.
- Bordon, Dreson, Dulundur, Troll Forest, Nolorim and Herez stay separate. Kilinti with the Kilinti Forests is one country; Lerendor with Lerenwaith is one country.
- Cursed Lands and Bloody Forest resist Aenor. Seat names not drawn on the maps are constructed and replaceable; no capital carries an antagonist's or a region's name.
- Zol's Mistake is a barren wasteland, barely peopled, roamed by the dead. The Dead Lands are hot, storm-girt and hard to reach by sea. Aenor is rich and strong.
- Start situation (owner, 18 October 2026): the Golden King reigns, Eindil has not appeared, Afrit is unrevealed, nobody who matters is at war.

**Proposed (this spec):** every number, state category label, resource label, manpower formula, start value and file format below.

## Design

### 1. Sources of truth

| Data | Source of truth | Written by |
| --- | --- | --- |
| Provinces, states, strategic regions, terrain | Map step of HOI4 Agent Tools | map rewrite |
| Owners, capitals, cores, country and state names, factions, subjects, start values | Politics step (`.tmp/zin-politics-v4.mts` today) | politics step |
| People, ideology, stance, ruler overrides | `docs/design/countries.csv` (owner-editable) | owner; the builder fills missing rows |
| Ideologies, peoples, rulers, advisors, names, portraits, flags, localisation | ZIN content builder (`.tmp/zin-content`) | content builder |
| State names chosen by the owner | `docs/design/state_names.csv` (new, proposed) | owner |
| Regional terrain identity | `docs/design/region_profiles.json` (new, proposed; section 7) | design |

Every file reaches the mod through the shared atomic rewrite engine. Generated game files are never hand-edited.

### 2. Countries are named, not tagged

- Specs, CSVs, focus data and generator inputs name countries by **name** ("Lerendor"), never by tag.
- Tags follow the politics order and change when the map changes. Generators resolve names to tags at build time and fail on an unknown or duplicate name.
- Country names are unique. A name containing a comma is not allowed (today the builder replaces commas with spaces; make it an error).
- Tag-specific files (`common/countries/<TAG> - <name>.txt`, `history/countries/...`, `gfx/flags/<TAG>.tga`) are build outputs keyed by the current tag.

### 3. `docs/design/countries.csv`

Today: `tag,country,people,ideology,stance`, 305 rows. Rows match by name first; `tag` is informational. The builder rewrites the file each build, keeping owner values and filling missing rows from defaults.

Proposed columns (added in this order; empty means "use default"):

| Column | Meaning | Validation |
| --- | --- | --- |
| `tag` | Current tag, written by the builder | informational |
| `country` | Country name | must exist in the roster |
| `people` | Primary people key ([03_peoples.md](03_peoples.md)) | known, not reserved |
| `ideology` | Derived from `stance`; written by the builder | must match the stance |
| `stance` | Ruler stance ([02_ideologies_and_politics.md](02_ideologies_and_politics.md)) | known |
| `minor_peoples` | Up to two people keys separated by `;` | known, not the primary |
| `tradition` | Tradition flag key of men ([03_peoples.md](03_peoples.md) section 5) | known |
| `ruler` | Ruler name override | Windows-1252; no superseded names; not "Afrit" |
| `ruler_sex` | `m` or `f` | |
| `notes` | Free text for the owner | ignored by the build |

### 4. What every country must have

| Item | Standard | Today |
| --- | --- | --- |
| Name, definite name, adjective | `<TAG>`, `<TAG>_DEF`, `<TAG>_ADJ` in `world_l_english.yml` | done (305) |
| Role text | `<TAG>_WORLD_DESC`: one or two plain sentences, true to the vault, no modern words (republic, workers, industrial, revolutionary, federation) | **stale**: written for the old map build. Examples that contradict the lore: Selen "independent ... principal counterweight to Aenor" (it is an Aenor subject), Hiloron "lake republic" (Hiloron's giants), Girdon "industrial river republic", Kradlon "workers republic", Avalon "revolutionary republic". Worshipdom's text names Afrit and the Hidden Council (breach of the secret). Rewrite all 305. |
| Colour | Unique map colour | done |
| Flag | Image-generated `gfx/flags/<TAG>.tga` 82×52, `medium/` 41×26, `small/` 10×7 | done (305 base flags) |
| Ideology flags | `<TAG>_<ideology>.tga` only for countries whose government the story can change; cosmetic-tag flags for story names | missing |
| Cosmetic names | Ideology names `<TAG>_<ideology>` (+ `_DEF`, `_ADJ`) where a story changes a realm's name; cosmetic tags named `zin_cosmetic_<country>_<key>`, for example `zin_cosmetic_aenor_ashen` "The Ashen Throne" after the reveal (proposed) | missing |
| Graphical culture | By people, until 3D sets per people exist ([08_art_and_assets](../08_art_and_assets/)) | all `western_european_gfx` |
| Capital | A named victory point in the capital state; lore seats per [01_map_accuracy.md](../01_map/01_map_accuracy.md) | done; five seats need renames (S5 to S9) |
| Ruler | Per [02_ideologies_and_politics.md](02_ideologies_and_politics.md) section 6 | done except the Worshipdom ("Afrit"), Zol (person portrait) and canon ids |
| Parties | Four party names | missing |
| Advisors | Three or more political advisors | missing |
| People | Primary people idea and flag | done |
| Stance spirit | `zin_stance_<stance>` | missing |
| Start values | Section 5 | uniform today |
| Order of battle | `history/units/<TAG>_world.txt`; Erdae units from the warfare spec | vanilla infantry, 392 divisions |
| Technology | Erdae technologies from the warfare spec | vanilla `infantry_weapons` and similar |
| Economy laws | Re-themed laws from the economy spec | vanilla `limited_conscription civilian_economy export_focus` |
| Subjects and factions | As the working table (section 6) | done: 26 Aenor subjects, 3 Volgan subjects, 7 factions |
| AI strategy | `common/ai_strategy/zin_*.txt` by name | missing |
| Focus tree | One tree per [01_tiers_and_coverage.md](../05_focus_trees/01_tiers_and_coverage.md) | missing |

### 5. Start values by country class

Design targets; history files set them, defines only give fallbacks.

| Class | Countries | Stability | War support | Research slots | Divisions |
| --- | --- | ---: | ---: | ---: | --- |
| Aenor | Aenor | 0.55 (a rotting court) | 0.15 | 4 | 14 to 18 |
| Great powers of men and orcs | Lerendor, Coldor, Noris, Stabilo, Goldoroth, Gunwaith, and Dondor if it stays a great power | 0.65 | 0.2 | 4 | 8 to 12 |
| Volgan | Volgan | 0.8 | 0.6 (a century of rearming) | 3 | 16; more from its mechanic, hidden from others |
| Zol | Zol | 1.0 | per Zol's mechanic | 1 | per Zol's mechanic; no recruitable living armies |
| Elven powers | Magical Forest, Gala Elves | 0.8 | 0.05 | 4 / 3 | 6 / 2 |
| Mirolon | Mirolon | 0.6 | 0.45 (only Mirolon takes the signs seriously) | 3 | 6 |
| Demon realms | Demon, Dolon, Nezer | 0.7 | 0.5 | 2 | 2 |
| Worshipdom | Worshipdom | 0.9 | 0.05 | 2 | 1 (temple guard) |
| Yeldenne | Yeldenne | 1.0 | 0.5 | 1 | 1 |
| Regional powers | Tier B | 0.6 | 0.15 | 3 | 2 to 6 |
| Concord dominions | Aenor's subjects | 0.6 | 0.1 | 2 | 1 to 3 |
| Minor realms | Tier C | 0.6 | 0.1 | 2 | 1 to 3 |

Major status: the nine working-table powers get `set_major = yes` in history (see [05_defines_and_rules.md](05_defines_and_rules.md), `MIN_MAJOR_COUNTRIES`).

### 6. The peaceful start: invariants

The build fails if any of these is false at 1 Thaw 4A 1748:

1. No country is at war; no history file contains `declare_war`, `create_wargoal`, `add_threat` or `start_civil_war`.
2. No story flag from the shared contract is set.
3. `zin_eindil` is not recruited by any country and appears in no starting text.
4. No starting text names Afrit or calls the Deliverer a demon (see [00_shared_contract.md](../04_mechanics/00_shared_contract.md), "The secret").
5. Shadow rulers are only Volgan, Zol, Demon, Dolon and Nezer.
6. Factions are exactly the seven working alliances: Middle Kingdom Concord, Southern Dominion, Leren Compact, Northern Accord, Noris Treaty, Stabilo Pact, Dark Sea Accord. Their members follow the working table: the Leren Compact adds Eekedor and Andos Enda; the Northern Accord Horidor; the Noris Treaty Gondolin; the Stabilo Pact Drak; the Dark Sea Accord Belonton. Today the Leren Compact lacks Andos Enda (open question 6).
7. No claims at start. Cores: every country cores its own states.

### 7. States

**Names.** 941 of 1,332 states carry placeholders such as "The End District 10". Standard: each state takes, in order, (1) the owner's name from `state_names.csv`, (2) a drawn label inside the state, (3) a generated name from the syllables of its sheet, as settlements are named today. Never "District N", never an antagonist's or region's name, never a near-copy of a drawn name. `state_names.csv` keys rows by the province id of the state's main victory point, which survives state renumbering; the map step reports any row whose province vanished.

**Categories.** Engine keys stay; names are re-themed (proposed):

| Key | Shown as | Rule |
| --- | --- | --- |
| `wasteland` | Wasteland | Zol's Mistake outside Furviatlon; deep Dead Lands |
| `enclave` | Outpost | single-province holds |
| `tiny_island` | Islet | small islands |
| `pastoral` | Herding Lands | steppe, tundra, uplands |
| `rural` | Farmland | most countryside |
| `town` | Market Town | |
| `large_town` | Walled Town | |
| `city` | City | |
| `large_city` | Great City | capitals of regional powers |
| `metropolis` | Royal City | capitals of great powers (not Zol, not Volgan) |
| `megalopolis` | Crown City | Parim only |

Today: 450 cities, 17 large cities, 7 metropolises, 1 megalopolis (in Volgan's realm), and Zol holds a metropolis. Fix: Parim is the only megalopolis; Furviatlon at most a town; Nafeher at most a great city.

**Manpower.** State manpower = category base × people factor × region factor (proposed).

| Category | Base | | People | Factor | | Region | Factor |
| --- | ---: | --- | --- | ---: | --- | --- | ---: |
| wasteland | 5,000 | | men | 1.0 | | Middle Lands, Aenor Isle | 1.3 |
| enclave | 10,000 | | orcs, goblins | 1.1 | | East Lands | 1.1 |
| tiny_island | 15,000 | | elves | 0.4 | | West, North Lands | 1.0 |
| pastoral | 60,000 | | Sunhot elves | 0.3 | | Triton's, Islands of the South | 0.8 |
| rural | 120,000 | | yeti, ogres | 0.3 | | Dark Lands, Lands of the Sun | 0.7 |
| town | 220,000 | | trolls | 0.4 | | Cold Lands, Magical Lands | 0.6 |
| large_town | 350,000 | | demons | 0.2 | | Dead Lands | 0.4 |
| city | 550,000 | | giants | 0.15 | | Zol's Mistake | 0.02 |
| large_city | 900,000 | | ents | 0.1 | | | |
| metropolis | 1,400,000 | | the dead (living population) | 0.05 | | | |
| megalopolis | 2,500,000 | | | | | | |

Today the world holds 623 million. Zol holds 37.2 million (should be under 1 million); the Cold Lands 200.7 million and the East Lands 185.1 million dwarf the Middle Lands (40.2 million; Aenor 12.7 million). After the formula, Aenor must rank in the top three countries by manpower.

**Resources.** Engine keys stay; names are re-themed in the economy spec ([03_gameplay](../03_gameplay/)). Proposed labels: `steel` Iron, `aluminium` Timber, `tungsten` Stone, `chromium` Silver, `rubber` Hides, `oil` Naval Stores (or provisions, as the economy spec decides); `coal` unused unless the economy spec adopts it. Distribution follows the region profile below. Today Zol holds 1,422 of the world's 2,967 steel; it must hold none (only what its mechanic adds).

**Buildings.**

| Building | Standard | Today |
| --- | --- | --- |
| `infrastructure` | 1 to 5 by region profile | average 2.0 to 3.5 |
| `industrial_complex`, `arms_factory` | Workshops and armouries; by category slots; Aenor first in total factories | 1,378 and 641; Zol 82, Coldor 45, Magical Forest 38, Aenor 33 |
| `dockyard` | Coastal states only; great ports | 59 |
| `naval_base` | Every coastal capital, the Great Lake ports, the strait at Sonargur | 204 levels in 186 provinces |
| `bunker` | The Great Wall (level 5 on the Aenor side, map spec G5); Mirolon's northern passes (K9) | missing |
| `air_base`, `radar_station`, `rocket_site`, `nuclear_reactor`, `synthetic_refinery`, `fuel_silo`, anti-air | None | 26 air base levels in 14 provinces: remove |
| Supply nodes, railways | Re-themed as roads and waystations by the warfare spec | engine data from the map step |

**Victory points.** Capitals of great powers 30 to 50 (Parim 50); regional capitals 10 to 20; key sites per [02_key_sites.md](../01_map/02_key_sites.md). Today 1,498 victory points.

**Region profiles** (`region_profiles.json`, proposed targets):

| Region | Today: states, manpower, factories | Terrain and climate | Categories | Infrastructure | Resources |
| --- | --- | --- | --- | --- | --- |
| Middle Lands | 95, 40.2M, 133 | Plains, farmland, the Great Lake; mild | towns and cities; Parim | 4 (roads rebuilt after the Restoration, proposed) | Iron, Stone, some Silver |
| Aenor Isle | 1, 0.4M, 3 | Island | walled town | 3 | Iron |
| North Lands | 60, 19.6M, 98 | Coasts, hills; cool | cities on the strait | 3 to 4 | Iron, Naval Stores |
| Cold Lands | 285, 200.7M, 494 | Snow, tundra, forest; harsh winters | herding lands, farmland; western ports | 1 to 2 inland, 3 coast | Iron, Timber, Hides |
| West Lands | 86, 37.8M, 147 | Hills, forest; temperate | walled towns, cities | 3 | Iron, Timber |
| Triton's Islands | 45, 5.4M, 104 | Islands, coasts | towns, islets | 2 to 3 | Naval Stores, Hides |
| Dark Lands | 47, 9.7M, 88 | Hills, forest, marsh | farmland, outposts | 2 | Iron, Stone |
| Magical Lands | 131, 61.6M, 192 | Forest, mountains (Magic Mountains, Dragon Mountain) | farmland, towns | 2 to 3 | Timber, Silver |
| Zol's Mistake | 104, 37.2M, 82 | Wasteland, black islands | wasteland; Furviatlon a town | 1 | none |
| Dead Lands | 30, 4.1M, 57 | Desert and hills inland, hot; storms on the coast (map spec G7) | farmland, outposts; Nafeher a great city | 1 to 2 | Iron, Stone |
| East Lands | 337, 185.1M, 419 | Plains, desert (Noris), caravan roads; warm | towns and cities on the roads | 3 to 4 on the roads, 2 off them | Silver, Stone, Iron, Naval Stores |
| Islands of the South | 24, 3.4M, 60 | Small islands; warm | islets, towns | 2 | Hides, Naval Stores |
| Lands of the Sun | 87, 18.2M, 142 | Forest (God Forest), plains; hot | farmland, towns | 2 to 3 | Timber, Hides |

### 8. Done and missing

| Area | Done | Missing |
| --- | --- | --- |
| Roster | 305 countries, names, adjectives, colours, flags, capitals | role texts rewritten; Dondor holds 1 state while the working table makes it a great power |
| Politics | Ideology, stance and people per country; rulers; 7 factions; subjects | party names, advisors, stance spirits, ideology flags, cosmetic names; Worshipdom and Zol ruler fixes; Fourth Age dates (`last_election "1932.1.1"` today) |
| States | 1,332 states with owners, cores, categories, manpower, resources, buildings, victory points | names (941), category fixes, manpower formula, resource re-theme and redistribution, Zol and Dead Lands per lore, removal of air bases, wall and pass forts |
| Engine data | Strategic regions, supply, railways | strategic region names (map spec N1) |
| Start | | 1936 bookmark ([01_start_and_calendar.md](01_start_and_calendar.md)); Aenor start crash ([03_known_issues.md](../01_map/03_known_issues.md)) |

## Implementation

| Step | Change | Files |
| --- | --- | --- |
| Country table | Parse quoted CSV; new columns; reject commas in names; reserved people keys | `.tmp/zin-content/modules/countries.mjs` |
| Rulers | Canon ids from the contract; drop "Afrit"; Zol's emblem leader | `modules/characters.mjs`, `localisation/english/zin_rulers_l_english.yml` |
| Role texts | 305 rewritten descriptions in a data file `docs/design/country_roles.csv` (name, text), owner-editable | politics step, `localisation/replace/world_l_english.yml` |
| Start values | Class table above; Fourth Age `last_election`; popularities from the politics spec | politics step, `history/countries/*` |
| Factions | Members per section 6 | politics step |
| State pass (new) | Names, categories, manpower formula, resources, buildings, forts, air removal, from `region_profiles.json` and `state_names.csv` | politics step, `history/states/*`, `localisation/replace/world_l_english.yml` |
| Category names | Re-themed labels | `localisation/replace/zin_state_categories_l_english.yml` (content builder) |
| Ideology flags and cosmetic tags | Image-generated art; `set_cosmetic_tag` from mechanic specs | art module, `gfx/flags/` |
| AI strategy | Peaceful start (`conquer`, `antagonize` 0 before the story starts) | `common/ai_strategy/zin_peace.txt` |
| Data check (new) | All rules in sections 2, 4, 6 and 7 | `.tmp/zin-content/build.test.mjs` plus a staged-tree check |

The data check reports: countries without four party names, role texts with banned words or "Afrit", states named "District", states without a category, Zol states with resources or factories, air bases anywhere, a megalopolis other than Parim, any war or wargoal in history, and any modifier or define not in the game's documentation.

## AI

- Before `zin_golden_king_dead`, `zin_peace.txt` keeps every AI from planning wars (`conquer` and `antagonize` 0); the historical path spec takes over afterwards ([06_historical_path_and_ai.md](../03_gameplay/06_historical_path_and_ai.md)).
- Subjects keep the engine's subject AI; Concord dominions get `befriend` toward Aenor.
- AI build priorities per region profile follow the economy spec.

## Acceptance

1. The data check passes on the staged tree.
2. A new game on 1 Thaw 4A 1748 shows no war, the seven factions, Aenor's 26 subjects and Volgan's three.
3. No state name contains "District"; every country shows a role text without modern words.
4. Aenor ranks first in factories and in the top three in manpower; Zol has under 1 million manpower, no factories and no resources at start.
5. Parim is the only megalopolis; no air base exists.
6. Changing a country's people in `countries.csv` and rebuilding changes only that country's people idea, flag and portraits.
7. The game starts as Aenor, Volgan, Zol, Lerendor and the Magical Forest and runs 60 days in the Linux test without new errors.

## Open questions

1. Dondor holds one state. Should it grow to great-power size, or drop from the great powers on the map?
2. Should the nine working-table powers be the game's majors, or should the Magical Forest and Mirolon count too?
3. Approve the re-themed category and resource labels.
4. Should the Cold Lands and East Lands stay this large in manpower, or be scaled down as the formula proposes?
5. Does the owner want to name states directly in `state_names.csv`, or accept generated names first?
6. The working table puts Andos Enda, an elven realm of the Magical Lands, in the Leren Compact. Add it at the start, or leave it out because the elves stand apart (the Elven Refusal)?
