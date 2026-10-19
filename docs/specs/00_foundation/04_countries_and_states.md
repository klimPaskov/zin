# Countries and states

**Status:** Ready. Reviewed 19 October 2026 against CONVENTIONS "Status"; integrated 19 October 2026. **Priority:** 3. **Phase:** 3 (the data defects of section 8 are fixed in phase 1).

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

**Decided (INTEGRATION_DECISIONS):** D1 and D2 (the Worshipdom's public face), D5 (Aenor 0% Shadow), S4 (Zol's emblem leader), S5 (Andos Enda is not in the Leren Compact at the start), V2 (the seven resources), S6 (dragons use the air layer), S12 (the tag total stays below 439), R3 (a start force of a mechanic's own realm follows that mechanic: Zol and Yeldenne start with no divisions), E3 (factions are made from templates).

**Proposed (this spec):** every number, manpower formula, start value, file format and data check below.

## Design

### 1. Sources of truth

| Data | Source of truth | Written by |
| --- | --- | --- |
| Provinces, states, strategic regions, terrain | Map step of HOI4 Agent Tools | map rewrite |
| Owners, capitals, cores, country and state names, factions, subjects, start values, tags, country files, histories, the bookmark | Politics step (HOI4 Agent Tools checkout, `.tmp/zin-politics-v4.mts`, outside this repository; files listed in `.hoi4-agent-world.json`) | politics step |
| People, ideology, stance, ruler overrides | `docs/design/countries.csv` (owner-editable) | owner; the content builder fills missing rows |
| Ideologies, peoples, rulers, advisors, names, portraits, flags, ZIN localisation | ZIN content builder (`tools/content/build.mjs`; files listed in `.zin-content.json`) | content builder |
| State names chosen by the owner | `docs/design/state_names.csv` (new, *proposed*) | owner |
| Country role texts | `docs/design/country_roles.csv` (new, *proposed*) | owner-editable; first filled from this spec's rules |
| Regional terrain and economic identity | `docs/design/region_profiles.json` (new, *proposed*; section 7). Resource and development columns belong to [02_economy.md](../03_gameplay/02_economy.md) | design |

Every file reaches the mod through the shared atomic rewrite engine. Generated game files are never hand-edited.

### 2. Countries are named, not tagged

- Specs, CSVs, focus data and generator inputs name countries by **name** ("Lerendor"), never by tag.
- Tags follow the politics order and change when the map changes. Generators resolve names to tags at build time and fail on an unknown or duplicate name.
- Country names are unique. A name containing a comma is not allowed. Today `modules/countries.mjs` replaces commas with spaces; it becomes an error.
- Tag-specific files (`common/countries/<TAG> - <name>.txt`, `history/countries/<TAG> - <name>.txt`, `gfx/flags/<TAG>.tga`) are build outputs keyed by the current tag.
- **Tag budget.** Only the 305 ZIN tags (first, in `common/country_tags/00_zin_countries.txt`) and the 75 dynamic tags D01–D75 (`zz_zin_dynamic_countries.txt`) exist: 380 in all. The total must stay below 439, vanilla's own count, or the flag sheet overflows and the game divides by zero ([03_known_issues.md](../01_map/03_known_issues.md) section 1). The politics step's test already fails above 439; the builder's data check repeats it.

### 3. `docs/design/countries.csv`

Today: `tag,country,people,ideology,stance`, 305 rows, written by `writeCountryTable` in `modules/countries.mjs`. Rows match by name first; `tag` is informational. The builder rewrites the file each build, keeping owner values and filling missing rows from defaults.

Columns added in this order (*proposed*; empty means "use default"). Fields are parsed as quoted CSV (RFC 4180), so `notes` may hold commas.

| Column | Meaning | Validation |
| --- | --- | --- |
| `tag` | Current tag, written by the builder | informational |
| `country` | Country name | must exist in the roster (`tools/content/data/countries.json`) |
| `people` | Primary people key ([03_peoples.md](03_peoples.md)) | known, not reserved |
| `ideology` | Derived from `stance`; written by the builder | must match the stance |
| `stance` | Ruler stance ([02_ideologies_and_politics.md](02_ideologies_and_politics.md)) | known |
| `minor_peoples` | Up to three people keys separated by `;` | known, not reserved, not the primary |
| `tradition` | Tradition flag key of men ([03_peoples.md](03_peoples.md) section 5); Fotan's row is `middle_kingdom` | known; people must be `men` |
| `ruler` | Ruler name override | Windows-1252; no superseded names; not "Afrit" |
| `ruler_sex` | `m` or `f` | |
| `notes` | Free text for the owner | ignored by the build |

### 4. What every country must have

"In game" is the state on 19 October 2026 (commit `ca01fa3`).

| Item | Standard | In game |
| --- | --- | --- |
| Name, definite name, adjective | `<TAG>`, `<TAG>_DEF`, `<TAG>_ADJ` in `localisation/replace/world_l_english.yml` | done (305) |
| Role text | One or two plain sentences per country in `docs/design/country_roles.csv`, true to the vault, no modern words (republic, workers, industrial, revolutionary, federation), never naming Afrit or the Hidden Council (D1–D3). The frontend builder turns the role texts of the bookmark's listed countries into their `ZIN_FOURTH_AGE_DESC_<key>` descriptions where [03_main_menu_and_frontend.md](../07_interface/03_main_menu_and_frontend.md) gives no text of its own; the old bookmark keys `<TAG>_WORLD_DESC` are retired with the new bookmark (phase 2) | today's `<TAG>_WORLD_DESC` texts are **stale** except the Worshipdom (a safe public text since 19 October). Examples that contradict the lore: Selen "independent ... principal counterweight to Aenor" (it is an Aenor subject), Hiloron "lake republic" (Hiloron's giants), Girdon "industrial river republic", Kradlon "workers republic", Avalon "revolutionary republic". Rewrite all 305 from `country_roles.csv`. |
| Colour | Unique map colour | done |
| Flag | Image-generated `gfx/flags/<TAG>.tga` 82×52, `medium/` 41×26, `small/` 10×7 | done (305 base flags) |
| Ideology flags | `<TAG>_<ideology>.tga` only for countries whose government the story can change; cosmetic-tag flags for story names | missing |
| Cosmetic names | Ideology names `<TAG>_<ideology>` (+ `_DEF`, `_ADJ`) where a story changes a realm's name; cosmetic tags named `zin_cosmetic_<country>_<key>`, for example `zin_cosmetic_aenor_ashen` "The Ashen Throne" after the reveal (*proposed*) | missing |
| Graphical culture | `zin_<people>_gfx` ([03_peoples.md](03_peoples.md)) | done |
| Capital | A named victory point in the capital state; lore seats per [01_map_accuracy.md](../01_map/01_map_accuracy.md) | done; five seats need renames or moves (S5 to S9) |
| Ruler | Per [02_ideologies_and_politics.md](02_ideologies_and_politics.md) section 6 | done, with the safe Worshipdom and Zol names; the contract ids and Zol's emblem portrait are missing |
| Parties | Four party names | missing |
| Advisors | Three or more political advisors | three generated councillors per country (`history/general/zin_general.txt`); named advisors missing |
| People | Primary people idea and flag | done |
| Stance spirit | `zin_stance_<stance>` | missing |
| Start values | Section 5 | uniform: stability 0.6, war support 0.4 (great powers) or 0.2, research slots 4 or 3 |
| Order of battle | `history/units/<TAG>_world.txt`; Erdae units from the warfare spec, written by its module from stage 2 (the politics step stops writing `history/units` then); none for Zol and Yeldenne (R3) | vanilla infantry, 392 divisions; Yeldenne holds one |
| Technology | Erdae technologies from the warfare spec | vanilla `infantry_weapons` and similar |
| Economy laws | Laws from the economy spec | ZIN laws under the vanilla keys (`common/ideas/00_zin_laws.txt`); histories add `limited_conscription civilian_economy export_focus` |
| Subjects and factions | As the working table (section 6) | done: 26 Aenor subjects, 3 Volgan subjects, 7 factions |
| AI strategy | The peaceful-start strategy (AI section) | interim stub only |
| Focus tree | One tree per [01_tiers_and_coverage.md](../05_focus_trees/01_tiers_and_coverage.md) | the interim tree "The Long Peace" for every country |

### 5. Start values by country class

Design targets; history files set them, defines only give fallbacks.

| Class | Countries | Stability | War support | Research slots | Divisions |
| --- | --- | ---: | ---: | ---: | --- |
| Aenor | Aenor | 0.55 (a rotting court) | 0.15 | 4 | 14 to 18 |
| Great powers of men and orcs | Lerendor, Coldor, Noris, Stabilo, Goldoroth, Gunwaith, Dondor | 0.65 | 0.2 | 4 | 8 to 12 |
| Volgan | Volgan | 0.8 | 0.6 (a century of rearming) | 3 | 16; more from its mechanic, hidden from others |
| Zol | Zol | 1.0 | per Zol's mechanic | 1 | 0 (R3); hosts come only from Zol's mechanic; no recruitable living armies |
| Elven powers | Magical Forest, Gala Elves | 0.8 | 0.05 | 4 / 3 | 6 / 2 |
| Mirolon | Mirolon | 0.6 | 0.45 (only Mirolon takes the signs seriously) | 3 | 6 |
| Demon realms | Demon, Dolon, Nezer | 0.7 | 0.5 | 2 | 2 |
| Worshipdom | Worshipdom | 0.9 | 0.05 | 2 | 1 (temple guard) |
| Yeldenne | Yeldenne | 1.0 | 0.5 | 1 | 0 (R3; the Yeldenne and Glo spec) |
| Regional powers | Tier B | 0.6 | 0.15 | 3 | 2 to 6 |
| Concord dominions | Aenor's subjects | 0.6 | 0.1 | 2 | 1 to 3 |
| Minor realms | Tier C | 0.6 | 0.1 | 2 | 1 to 3 |

Major status: the nine working-table powers (Aenor, Zol, Volgan, Lerendor, Coldor, Noris, Stabilo, Goldoroth, Dondor) get `set_major = yes` in history, and `NCountry.MIN_MAJOR_COUNTRIES` is 9 ([05_defines_and_rules.md](05_defines_and_rules.md)). Dondor stays a great power and grows on the map (owner short list 8 proposal).

### 6. The peaceful start: invariants

The build fails if any of these is false at the start date:

1. No country is at war; no history file contains `declare_war`, `create_wargoal`, `add_threat` or `start_civil_war`.
2. No story flag from the shared contract is set.
3. `zin_eindil` is not recruited by any country and appears in no starting text.
4. No starting text names Afrit or calls the Deliverer a demon (see [00_shared_contract.md](../04_mechanics/00_shared_contract.md), "The secret").
5. Shadow rulers are only Volgan, Zol, Demon, Dolon and Nezer.
6. Factions are exactly the seven working alliances: Middle Kingdom Concord, Southern Dominion, Leren Compact, Northern Accord, Noris Treaty, Stabilo Pact, Dark Sea Accord. Members: the Concord holds Aenor's 26 subjects; the Southern Dominion Demon, Dolon and Nezer; the Leren Compact Eekedor (Andos Enda stays out, S5); the Northern Accord Horidor; the Noris Treaty Gondolin; the Stabilo Pact Drak; the Dark Sea Accord Belonton. The game matches this today. The Lost Cause is an institution of Aenor's mechanic, not a faction (S3).
7. No claims at start. Cores: every country cores its own states.
8. The tag total is below 439 (section 2).

### 7. States

**Names.** 941 of 1,332 states carry placeholders such as "The End District 10". Standard: each state takes, in order, (1) the owner's name from `state_names.csv`, (2) a drawn label inside the state, (3) a generated name from the syllables of its sheet, as settlements are named today. Never "District N", never an antagonist's or region's name, never a near-copy of a drawn name. `state_names.csv` (columns `province`, `name`, `notes`) keys rows by the province id of the state's main victory point, which survives state renumbering; the politics step reports any row whose province vanished. Generated names come first and the owner overrides them later (foundation 14 proposal).

**Categories.** Engine keys and slots stay. Names belong to [02_economy.md](../03_gameplay/02_economy.md) ("State category names"). This spec decides which state gets which category:

| Key | Rule |
| --- | --- |
| `wasteland` | Zol's Mistake outside Furviatlon; the deep Dead Lands |
| `enclave` | single-province holds |
| `tiny_island`, `small_island`, `large_island` | islands by land province count: 1, 2 to 4, 5 or more |
| `pastoral` | steppe, tundra, uplands |
| `rural` | most countryside |
| `town`, `large_town`, `city` | by settlement weight (today's politics-step rule) |
| `large_city` | capitals of regional powers; at most Nafeher among the dark realms |
| `metropolis` | capitals of great powers (not Zol, not Volgan) |
| `megalopolis` | Parim only |

Today: 450 cities, 17 large cities, 7 metropolises, 1 megalopolis (state 299, in Volgan's realm), and Zol holds a metropolis; no wasteland, enclave or island category is used. Fix: Parim is the only megalopolis; Furviatlon at most a town; Nafeher at most a large city.

**Manpower.** State manpower = category base × people factor × region factor (*proposed*). The people is the owner's primary people at the start. Scaling the Cold Lands and East Lands down by this formula is the foundation 13 proposal.

| Category | Base | | People | Factor | | Region | Factor |
| --- | ---: | --- | --- | ---: | --- | --- | ---: |
| wasteland | 5,000 | | men | 1.0 | | Middle Lands, Aenor Isle | 1.3 |
| enclave | 10,000 | | orcs, goblins | 1.1 | | East Lands | 1.1 |
| tiny_island | 15,000 | | elves | 0.4 | | West, North Lands | 1.0 |
| small_island | 30,000 | | Sunhot elves | 0.3 | | Triton's, Islands of the South | 0.8 |
| pastoral | 60,000 | | yeti, ogres | 0.3 | | Dark Lands, Lands of the Sun | 0.7 |
| rural | 120,000 | | trolls | 0.4 | | Cold Lands, Magical Lands | 0.6 |
| large_island | 150,000 | | demons | 0.2 | | Dead Lands | 0.4 |
| town | 220,000 | | giants | 0.15 | | Zol's Mistake | 0.02 |
| large_town | 350,000 | | ents | 0.1 | | | |
| city | 550,000 | | the dead (living population) | 0.05 | | | |
| large_city | 900,000 | | | | | | |
| metropolis | 1,400,000 | | | | | | |
| megalopolis | 2,500,000 | | | | | | |

No state falls below 30,000 (the politics step's `STATE_MANPOWER_FLOOR`, which stays as a safety floor although it was not the crash's cause). Today the world holds 624 million. Zol holds 37.2 million (target under 1 million); the Cold Lands 200.7 million and the East Lands 185.1 million dwarf the Middle Lands (40.2 million; Aenor 12.7 million). After the formula, Aenor must rank in the top three countries by manpower.

**Resources.** Engine keys stay; the names are V2's (Iron, Timber, Horses, Stone, Gold, Essence, Grain) and belong to [02_economy.md](../03_gameplay/02_economy.md), whose region weights the state pass reads from `region_profiles.json`. Today Zol holds 1,422 of the world's 2,967 `steel`; it must hold none (only what its mechanic adds).

**Buildings.**

| Building | Standard | Today |
| --- | --- | --- |
| `infrastructure` | 1 to 5 by region profile | average 2.0 to 3.5 |
| `industrial_complex`, `arms_factory` | Workshops and armouries; by category slots; Aenor first in total factories | 1,378 and 641; Zol 82, Coldor 45, Magical Forest 38, Aenor 33 |
| `dockyard` | Coastal states only; great ports | 59 |
| `naval_base` | Every coastal capital, the Great Lake ports, the strait at Sonargur | 204 levels in 186 provinces |
| `bunker` | The Great Wall (level 5 on the Aenor side, map spec G5); Mirolon's northern passes (K9) | missing |
| `air_base` | None at the start. Dragons and griffins use the air layer (S6); eyries are built in play under the warfare spec's sky rule | 26 levels in 14 provinces: remove |
| `radar_station`, `rocket_site`, `nuclear_reactor`, `synthetic_refinery`, `fuel_silo` | None | none |
| Supply nodes, railways | Re-themed as roads and waystations by the warfare spec | engine data from the map step |

**Victory points.** Capitals of great powers 30 to 50 (Parim 50); regional capitals 10 to 20; key sites per [02_key_sites.md](../01_map/02_key_sites.md). Today 1,498 victory points.

**Region profiles** (`region_profiles.json`, *proposed* targets; resource and development columns from the economy spec):

| Region | Today: states, manpower, factories | Terrain and climate | Categories | Infrastructure |
| --- | --- | --- | --- | --- |
| Middle Lands | 95, 40.2M, 133 | Plains, farmland, the Great Lake; mild | towns and cities; Parim | 4 (roads rebuilt after the Restoration, *proposed*) |
| Aenor Isle | 1, 0.4M, 3 | Island | large island | 3 |
| North Lands | 60, 19.6M, 98 | Coasts, hills; cool | cities on the strait | 3 to 4 |
| Cold Lands | 285, 200.7M, 494 | Snow, tundra, forest; harsh winters | pastoral, rural; western ports | 1 to 2 inland, 3 coast |
| West Lands | 86, 37.8M, 147 | Hills, forest; temperate | large towns, cities | 3 |
| Triton's Islands | 45, 5.4M, 104 | Islands, coasts | towns, islands | 2 to 3 |
| Dark Lands | 47, 9.7M, 88 | Hills, forest, marsh | rural, enclaves | 2 |
| Magical Lands | 131, 61.6M, 192 | Forest, mountains (Magic Mountains, Dragon Mountain) | rural, towns | 2 to 3 |
| Zol's Mistake | 104, 37.2M, 82 | Wasteland, black islands | wasteland; Furviatlon a town | 1 |
| Dead Lands | 30, 4.1M, 57 | Desert and hills inland, hot; storms on the coast (map spec G7) | rural, enclaves; Nafeher a large city | 1 to 2 |
| East Lands | 337, 185.1M, 419 | Plains, desert (Noris), caravan roads; warm | towns and cities on the roads | 3 to 4 on the roads, 2 off them |
| Islands of the South | 24, 3.4M, 60 | Small islands; warm | islands, towns | 2 |
| Lands of the Sun | 87, 18.2M, 142 | Forest (God Forest), plains; hot | rural, towns | 2 to 3 |

### 8. Done and missing

| Area | Done | Missing |
| --- | --- | --- |
| Roster | 305 countries, names, adjectives, colours, flags, capitals; only ZIN and dynamic tags (380) | role texts rewritten; Dondor holds 1 state while the working table makes it a great power |
| Politics | Ideology, stance and people per country; rulers with safe Worshipdom and Zol names; 7 factions; subjects; Aenor 0% Shadow | party names, named advisors, stance spirits, ideology flags, cosmetic names; contract ruler ids and Zol's emblem portrait; Fourth Age dates (`last_election "1932.1.1"` today) |
| States | 1,332 states with owners, cores, categories, manpower, resources, buildings, victory points | names (941), category fixes, manpower formula, resource redistribution, Zol and Dead Lands per lore, removal of air bases, wall and pass forts |
| Engine data | Strategic regions, supply, railways | strategic region names (map spec N1) |
| Start | The start crash is fixed (flag sheet, 19 October) | the 1936 bookmark ([01_start_and_calendar.md](01_start_and_calendar.md)) |
| Data (phase 1) | `countries.csv` and the game agree on every ruling ideology and stance | the roster `tools/content/data/countries.json` carries a stale `ideology` field for 76 countries: Demon, Dolon, Nezer and Zol read Wild (Shadow in `countries.csv`; `zin_shadow_dread` for the three demon realms), Coldor, Lerendor and Dondor Wild (Dominion; Coldor `zin_dom_crown`), Noris Light (Dominion), Hiloron and the Worshipdom Shadow (Light; Hiloron `zin_light_wardens`), Kradlon and Avalon Shadow (Wild), Volgan Dominion (Shadow), Bloody Forest Dominion (Wild), Belonton Light (Wild), and 61 Light realms Wild; `countries.mjs` rewrites the field from `countries.csv`. The `tradition` column does not exist yet; Fotan's row gets `middle_kingdom` when it is added. Yeldenne's one division is removed (R3) |

## Implementation

| Step | Change | Written by | Files |
| --- | --- | --- | --- |
| Country table | Quoted CSV parsing; the new columns; reject commas in names; reserved people keys | `tools/content/modules/countries.mjs` | `docs/design/countries.csv` |
| Rulers | Contract ids; Zol's emblem leader | `tools/content/modules/characters.mjs` ([02_ideologies_and_politics.md](02_ideologies_and_politics.md)) | `common/characters/zin_rulers.txt`, `localisation/english/zin_rulers_l_english.yml` |
| Role texts | 305 descriptions in `docs/design/country_roles.csv` (`country`, `text`); the listed countries' texts become `ZIN_FOURTH_AGE_DESC_<key>`; with the new bookmark the politics step stops writing `WORLD_BOOKMARK_*` and `<TAG>_WORLD_DESC` | `tools/content/modules/frontend.mjs` (the frontend spec) | `localisation/english/zin_frontend_l_english.yml` |
| Start values | Class table above; `set_major`; Fourth Age `last_election`; popularities from the politics spec; from stage 2 the ZIN technologies, doctrines and autonomy states (warfare and diplomacy package exports) | politics step, reading `countries.csv` and a class table `docs/design/country_classes.json` (new: country name → class) | `history/countries/*` |
| Name fixes (phase 2) | Yeldenne's role text and bookmark text keep the secret of Glo ("a crystal of old and holy power" until `zin_horos_dead`, start-situation spec); Aenor's adjective becomes "Aenoran" and the drawn "Sunhot" place labels become Sun Desert, Sun Gate and Sun Grasslands (names spec) | politics step | `localisation/replace/world_l_english.yml`, `state_names_l_english.yml`, `victory_points_l_english.yml` |
| Factions | Members per section 6, each faction made with `create_faction_from_template` from the diplomacy spec's templates (E3) | politics step | `history/countries/*` |
| State pass (new) | Names, categories, manpower formula, resources, buildings, forts, air base removal | politics step, reading `region_profiles.json`, `state_names.csv` and the map | `history/states/*`, `localisation/english/state_names_l_english.yml`, `victory_points_l_english.yml` |
| Ideology flags and cosmetic tags | Image-generated art; `set_cosmetic_tag` from mechanic specs | art jobs in `tools/content/art/flag-jobs.mjs`; `common/countries/cosmetic.txt` in vanilla-removal stage 3 | `gfx/flags/` |
| Peaceful-start AI | AI section | `tools/content/modules/politics.mjs` | `common/ai_strategy/zin_peace.txt` |
| Data check (new) | All rules in sections 2, 4, 6 and 7 | `tools/content/checks/world_data.mjs`, run by `build.test.mjs` on the mod's politics-step files plus the staged tree | — |

The data check reports: a tag total of 439 or more; a roster `ideology` that differs from `countries.csv`; a `tradition` on a country whose people is not `men`; a division in Zol's or Yeldenne's start history; countries without four party names; role texts with banned words or "Afrit"; states named "District"; states without a category; Zol states with resources or factories; air bases anywhere; a megalopolis other than Parim; any war or wargoal in history; and any modifier or define not in the game's documentation. It runs in G1 of [01_acceptance.md](../09_validation/01_acceptance.md); each rule has a negative test with a synthetic fixture.

## AI

- **Peaceful start.** Engine tension is 0 at the start and D6 keeps Dominion and Shadow from justifying war goals below 25% tension ([02_ideologies_and_politics.md](02_ideologies_and_politics.md)). On top of that, `common/ai_strategy/zin_peace.txt` gives every country one strategy `zin_peace_<tag>` (*proposed*): `allowed = { original_tag = <TAG> }`, `enable` while `zin_golden_king_dead` is not set, `abort` when it is, and `ai_strategy = { type = declare_war id = <TAG> value = -1000 }` toward every other country of its own roster region and toward every great power. After the King's death the historical-path spec's strategies take over ([06_historical_path_and_ai.md](../03_gameplay/06_historical_path_and_ai.md)). The file sits in that spec's folder, `common/ai_strategy`, and replaces the interim stub `zin_interim_ai_strategy.txt` there.
- Subjects keep the engine's subject AI; Concord dominions get `ai_strategy = { type = befriend id = <Aenor tag> value = 50 }` in the same file.
- AI build priorities per region profile follow the economy spec.

## Acceptance

1. **Build:** the data check passes on the mod and the staged tree, and each rule's negative test fails as planted.
2. **Linux run (start as Aenor, clock unpaused per [01_acceptance.md](../09_validation/01_acceptance.md)):** the diplomacy view shows no war, the seven factions, Aenor's 26 subjects and Volgan's three, and Andos Enda outside the Leren Compact. No war starts while the clock runs.
3. **Build:** no state name contains "District"; every role text and every `ZIN_FOURTH_AGE_DESC_<key>` passes the banned-word list and names no Afrit.
4. **Build:** Aenor ranks first in factories and in the top three in manpower; Zol has under 1 million manpower, no factories and no resources at the start.
5. **Build:** Parim is the only megalopolis; no air base exists.
6. **Build:** changing a country's people in `countries.csv` and rebuilding changes only that country's people idea, flag, graphical culture and portraits (determinism test with a planted change).
7. **Linux run (phase 1):** the game starts as Aenor, Volgan, Zol, Lerendor and the Magical Forest (case L1) and runs with the clock unpaused without a crash, within the error budget of [06_vanilla_removal_and_zero_errors.md](06_vanilla_removal_and_zero_errors.md).

## Open questions

All proceed on their proposals; the owner's copies are in [OPEN_QUESTIONS.md](../OPEN_QUESTIONS.md).

1. Dondor holds one state. Proceeds on: grow it to hold its own against Goldoroth (short list 8, foundation 11).
2. Should the nine working-table powers be the game's majors? Proceeds on: yes, nine (foundation 12).
3. The category and resource names belong to the economy spec (foundation 13).
4. Should the Cold Lands and East Lands keep their manpower? Proceeds on: scale them down by the formula (foundation 13).
5. Name states directly or accept generated names first? Proceeds on: generated first, owner overrides in `state_names.csv` (foundation 14).
6. Andos Enda and the Leren Compact: decided by S5 (not a member at the start).
