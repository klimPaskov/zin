# Demography and settlement

**Status:** Draft. **Date:** 19 October 2026. **Priority:** 2. **Phase:** 2 (feeds the state pass of phase 1: population, categories, manpower, factories, victory points).
**Data:** [tools/content/data/world/demography.json](../../../tools/content/data/world/demography.json). **Companions:** [05_world_bible.md](05_world_bible.md), [06_languages.md](06_languages.md), [08_world_in_game.md](08_world_in_game.md). **Reads:** [05_geography_model.md](../01_map/05_geography_model.md) and its section 5 (fertility and population logic).

## Purpose

The map holds 624 million people today: Zol alone holds 37 million, the Cold Lands 200 million and the East Lands 185 million, while Aenor, the richest realm, holds 12.7 million [foundation spec 04, section 7]. That is a generator artefact. This spec says where Erdae's people actually live, how many there are, how they sit in terrain and on rivers, which settlements stand where, and how the numbers become states, manpower, resources, infrastructure and factories. A country's strength follows its land, its rivers and its trade, not a table.

All numbers are **proposed (P)** design targets. They count the living. The dead of Volgan and Zol are raised by mechanics and are not part of the population.

## 1. How many people

| Item | Value |
| --- | --- |
| World total (playable lands) | **86.64 M** |
| Assumed range | 60 to 120 million |
| Reason | A pre-modern world after more than seventeen centuries of peace, better farming and medicine since the Second Age, and the richest river and lake basins in the world: a little above medieval Europe at its peak |
| Largest country | Aenor (9.80 M) |
| Largest city | Parim, 380 thousand (a pre-modern capital of a great kingdom) |
| Least peopled region | Zol's Mistake, 0.14 M outside the dead |

### By region

| Region | Living people | Share | States | People per state | Urban share | Largest city | Character |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| Middle Lands | 24.50 M | 28.3% | 96 | 255 k | 24% | 380 k | The most fertile and populous land by density; Aenor and the Concord dominions; many cities around the lake. |
| East Lands | 21.50 M | 24.8% | 337 | 64 k | 20% | 240 k | The richest and most divided land: river kingdoms, caravan cities, desert tribes. |
| Cold Lands | 10.50 M | 12.1% | 285 | 37 k | 8% | 85 k | Sparse but hardy; clans, herds, western ports; the far north holds the silent castle. |
| West Lands | 8.20 M | 9.5% | 86 | 95 k | 17% | 70 k | Clan hills, river towns, guild ports. |
| North Lands | 6.80 M | 7.8% | 60 | 113 k | 16% | 120 k | Sea-crowns on the strait and small hill kingdoms. |
| Lands of the Sun | 4.00 M | 4.6% | 87 | 46 k | 12% | 55 k | Sun-blessed fields; elves in sanctuaries; Gala; the three realms of Sunfolk. |
| Dark Lands | 3.40 M | 3.9% | 47 | 72 k | 7% | 55 k | Orc holds, Dondor, the troll forest, volcano country. |
| Magical Lands | 2.40 M | 2.8% | 131 | 18 k | 10% | 25 k | Elven realms in groves; the Wall; Dragon Mountain; the Worshipdom valleys. |
| Triton's Islands | 2.00 M | 2.3% | 45 | 44 k | 14% | 20 k | Chart-houses and corsair isles; harbour towns. |
| Dead Lands | 1.90 M | 2.2% | 30 | 63 k | 9% | 60 k | Thin: Mirolon's lake country, coast freeholds, the Nether realms and Volgan's hosts (the dead are not counted). |
| Islands of the South | 1.30 M | 1.5% | 24 | 54 k | 8% | 8 k | Small, poor and hospitable. |
| Zol's Mistake | 0.14 M | 0.2% | 104 | 1 k | 10% | 12 k | Nearly empty; only the town of Furviatlon and a few fishers on the islands; the dead are not counted. |

The Middle Lands are the most fertile and populous land by density: the Great Lake basin and the Vale of Aenor, with Aenor itself two-fifths of the Middle Lands. The East Lands follow, in rivers and oases. The Cold Lands are the largest landmass and hold one person in eight. The Dead Lands are thin. Zol's Mistake is nearly empty outside the town of Furviatlon.

### By people (primary people of each country, with minor-people carve-outs)

| People | Living | Share |
| --- | ---: | ---: |
| Men | 76.93 M | 88.80% |
| Sunhot elves | 3.56 M | 4.11% |
| Orcs | 2.60 M | 3.00% |
| Elves | 2.39 M | 2.76% |
| Living in Volgan's and Zol's realms | 0.28 M | 0.32% |
| Yeti | 0.27 M | 0.31% |
| Demons | 0.18 M | 0.21% |
| Giants | 0.12 M | 0.14% |
| Ents | 0.12 M | 0.14% |
| Goblins | 0.08 M | 0.10% |
| Trolls | 0.05 M | 0.05% |
| Ogres | 0.04 M | 0.05% |
| Mycids | 0.01 M | 0.01% |

Minor peoples carved out of their host country (proposed): goblins 12% of Goldoroth; goblins 8% of Dulundur; orcs 30% of Volgan; ogres 15% of Volgan; demons 10% of Volgan; men 35% of Kilinti; trolls 5% of Goldoroth; mycids 3% of Magical Forest; giants 4% of Hilofrim. The Mushroom Forest sits inside an elven realm and its mycids are a minor people there [O: the vault does not say whether it is a country].

## 2. Density by terrain, climate and fertility

People live where there is water, flat ground, a harbour or a pass ([geography model section 5](../01_map/05_geography_model.md)). The state pass reads the terrain shares of each state's provinces and gives each terrain a **density class** (people per square kilometre, before modifiers).

| Class | People per km2 | Terrain | Where |
| --- | ---: | --- | --- |
| rich_plain | 55 | Alluvial or loess plain of high fertility | Vale of Aenor, Hunhun Downs, Novez Fields, Eekedor Vale, Teste Vale |
| farmland | 40 | Open farmland, orchard and fen-edge | Safeton coast, Lands of the Sun fields, Delbiz Grasslands edge |
| downs | 25 | Rolling hills and downs | Gunwaith Downs, North Lands coasts |
| woodland | 9 | Forest and managed woodland (dense forest counts half) | Selen Weald, West Wood, Magical Forest edges |
| pasture | 6 | Steppe, moor and upland pasture | Hunhun and Konori downs, Cold Lands moors |
| jungle | 6 | Warm jungle | Obmi Jungle |
| marsh | 4 | Marsh and fen | Great Swamp of Mirolon, Papz Swamp, Saeton Swamp |
| mountain | 3 | Mountains and high passes | Magic Mountains, Isengar Mountains, Crown Mountains |
| tundra | 0.8 | Tundra and taiga | Far Cold Lands |
| desert_oasis | 35 | Oasis strip and wadi | Noris Wadi, Hot Lake, the Sand Road wells |
| desert | 0.3 | Open desert and dune sea | Noris Desert, Alodale Desert, Sun Desert, Plutondo Dunes |
| ice | 0.05 | Ice sheet and glacier | Mp'E, Titanos Heights |
| wasteland | 0.02 | Black wasteland | Zol's Mistake outside Furviatlon |
| reef_island | 30 | Reef island with fishing coast | Triton's Islands, Islands of the South |

### Modifiers

| Modifier | Factor | Rule |
| --- | ---: | --- |
| River or lake within 40 pixels | x2 | River of width 2 or more, or any lake (geography model section 5) |
| Coast with a natural harbour | x1.15 | A port victory point every 150 to 250 pixels |
| Crossroads, mine, pass town | x1.1, x1.1, x1.05 | Settlement placement rules of section 4 |
| Fertility | x0.5 to x1.5 | From the geography model's fertility class (very high plains 1.5; poor soil 0.5) |
| History | x1.1 restored land, x1.15 core of the long peace, x0.8 orc-raided march, x0.5 ruined battlefield, x0.25 Black Roots scar | The Cursed Lands carry the scar; the Vale carries the long peace |
| People | men x1, orcs x0.9, goblins x0.9, trolls x0.15, elves x0.15, sun_elves x0.15, giants x0.05, yeti x0.08, ents x0.03, demons x0.1, the_dead x0 | Long-lived and giant peoples are few |

### The rule for a state's people

state_people = region_calibration × Σ over land provinces of (province_area × density_class(terrain) × river/lake/coast/crossroads modifiers × fertility × history × people_factor). region_calibration is chosen so that the region total equals the region target within 1%. Settlements of the settlement list are then added on top as their stated sizes minus the people already counted for their province.

The computed regional totals above must be reproduced by this rule within 1%. The model's **check** fails the build otherwise (section 9).

## 3. The settlement hierarchy

| Rank | Size | Rule for where it stands | Examples |
| --- | --- | --- | --- |
| **Capital of a great power** | 50,000 to 380,000 | At the heart of the realm's best land: a lake bluff, a river mouth, a hill of wells or a harbour | Parim, Furvior, Postondoroth, Sonargur |
| **Great city** | 100,000 and up | At a river mouth, a lake shore, a great harbour or the junction of two caravan roads | Porrenva, Erdozan, Vobibiz |
| **City** | 20,000 to 100,000 | At a ford, a bridge, a harbour, a mine or the junction of two roads | Hifeco, Safeton's Lotrenri, Arligon |
| **Market town** | 5,000 to 20,000 | A day's walk from the next market, at a ford, pass, lake bay or crossroads | Most dominion seats |
| **Village** | under 5,000 | Beside water, 3 to 6 km apart in rich land, 15 to 40 km in poor | Not placed individually |
| **Fort** | 200 to 3,000 | On passes, fords, the Great Wall, Mirolon's passes, the Isengard march | Kingson's gate, Lunhrim |
| **Shrine and hostel** | 20 to 500 | On pilgrim roads, wells, reefs and holy hills | Zilin hostels, the Seven Wells |

### Counts by region (a city larger than s follows a Zipf law: n(s) = largest city / s)

| Region | Urban people | Cities of 100 k+ | Cities of 20 to 100 k | Market towns | Villages | Forts and shrines |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Middle Lands | 5.88 M | 3 | 16 | 501 | 44,333 | 681 |
| East Lands | 4.30 M | 2 | 10 | 377 | 40,952 | 597 |
| Cold Lands | 0.84 M | 0 | 4 | 72 | 23,000 | 292 |
| West Lands | 1.39 M | 0 | 3 | 135 | 16,205 | 228 |
| North Lands | 1.09 M | 1 | 5 | 77 | 13,600 | 189 |
| Lands of the Sun | 0.48 M | 0 | 2 | 43 | 8,381 | 111 |
| Dark Lands | 0.24 M | 0 | 2 | 17 | 7,529 | 94 |
| Magical Lands | 0.24 M | 0 | 1 | 21 | 5,143 | 67 |
| Triton's Islands | 0.28 M | 0 | 1 | 25 | 4,095 | 56 |
| Dead Lands | 0.17 M | 0 | 3 | 9 | 4,117 | 53 |
| Islands of the South | 0.10 M | 0 | 0 | 11 | 2,848 | 36 |
| Zol's Mistake | 0.01 M | 0 | 0 | 2 | 300 | 4 |
| **World** | **15.03 M** | **6** | **47** | **1,290** | **170,503** | **2,408** |

Only cities and above are named in this spec (the 100 settlements of section 8). The generator names towns and villages at build time by the rules of [06_languages.md](06_languages.md).

### The greatest cities

| City | Country | People | Why it is big |
| --- | --- | ---: | --- |
| Parim | Aenor | 380 k | Crown city; seat of the Golden King, the Concord Council and the University |
| Postondoroth | Stabilo | 240 k | Seat of the caravan princes; the Hall of Scales |
| Furvior | Noris | 210 k | Seat of the camel kings; city of the Seven Wells |
| Porrenva | Alerhia | 160 k | Stair-city of the river kings |
| Sonargur | Lerendor | 120 k | Seat of the united Leren crown; the Singing Quay |
| Erdozan | Miaed | 120 k | Desert-pass capital |
| Vobibiz | Plutondo | 110 k | Southern river capital |
| Atonto | Erco | 95 k | River kingdom capital |
| Fandanar | Coldor | 85 k | Seat of the Winter Crown; the Frost-Hall |
| Bulligon | Gunwaith | 70 k | Seat of the northern crown of the West Lands |
| Ohitus | Ostoroth | 70 k | Lake Road capital |
| Dolepar | Aenor | 62 k | Great Lake port and shipyard |
| Nafeher | Volgan | 60 k | Seat of Volgan; a great city at most [E working seat]; victory point Neleelon today |
| Gonnois | Mora | 60 k | Lake-city council town |
| Silesire | Aenor | 55 k | River-mouth grain port |
| Cocanoor | Goldoroth | 55 k | Seat of the Warking beneath the Fire-Mountain; victory point Fabdernor today |

## 4. Regions by population character

### Middle Lands

- **People:** 24.50 M (28.3% of the world) in 30 countries and 96 states; 255 thousand per state. Urban share 24%; largest city 380 thousand.
- **Density:** Great Lake basin and plains: the best fed land of Erdae; about 40 to 55 people per square kilometre on the plains and up to 110 beside the Aenar, the Great River and the Great Lake shore.
- **Dominant cultures:** Lake Aenorans 68%, Selen Rangers 9%, March-Folk 8%.
- **Minorities and mixed lands:** Aenor holds many dominions of its own culture; the Selen, Kilinti and Hiloron border has men, ents and giants living side by side; the south marches mix march-folk with refugees from the Dead Lands coast; the Veiled and Redbark are enclaves inside Aenor's roads.

### East Lands

- **People:** 21.50 M (24.8% of the world) in 35 countries and 337 states; 64 thousand per state. Urban share 20%; largest city 240 thousand.
- **Density:** Rivers and oases carry the people; the deserts hold almost none. River valleys and lake shores run 70 to 110 per square kilometre; the open desert under one.
- **Dominant cultures:** River-Kings of the East 36%, Caravan Princes 29%, Lake Road Cities 19%.
- **Minorities and mixed lands:** Noric, Stabilic and Alerhic peoples mix at the crossroads; caravan towns host every tongue; the Hidden Council's eastern clients are present in every city. [secret]

### Cold Lands

- **People:** 10.50 M (12.1% of the world) in 31 countries and 285 states; 37 thousand per state. Urban share 8%; largest city 85 thousand.
- **Density:** The largest landmass but sparse: coastal and valley farms 12 to 20 per square kilometre, the interior under two, the far north-west almost none.
- **Dominant cultures:** Ice Clans 65%, Winter-Crown Folk 16%, Windwaith Seafarers 9%.
- **Minorities and mixed lands:** Ice clans mix with yeti and giants at the high valleys; Windwaith and the western ports have Gunwaithic traders.

### West Lands

- **People:** 8.20 M (9.5% of the world) in 21 countries and 86 states; 95 thousand per state. Urban share 17%; largest city 70 thousand.
- **Density:** Temperate hills and river plains: 20 to 35 per square kilometre.
- **Dominant cultures:** Gunwaith Clans 51%, Western Guildmen 33%, Girdon Wardens 11%.
- **Minorities and mixed lands:** Gunwaith clans and Girdon wardens mix along the Grey Ford; guild towns have Aenoran merchants; Buldor companies recruit from every clan.

### North Lands

- **People:** 6.80 M (7.8% of the world) in 28 countries and 60 states; 113 thousand per state. Urban share 16%; largest city 120 thousand.
- **Density:** Coastal belts and fjord valleys: 15 to 30 per square kilometre.
- **Dominant cultures:** Free Crowns of the North 62%, Leren of the Strait 38%.
- **Minorities and mixed lands:** The strait coast is Leren; the inland crowns are Free Crowns; Blackton on the Dark Lands coast is mixed Dondor and Leren; Leren sailors settle R'en.

### Lands of the Sun

- **People:** 4.00 M (4.6% of the world) in 47 countries and 87 states; 46 thousand per state. Urban share 12%; largest city 55 thousand.
- **Density:** Very fertile but thinly peopled: the Sunhot elves are few and long-lived; 10 to 20 per square kilometre.
- **Dominant cultures:** Western Sanctuary Sunhot 41%, Isle Sunhot 25%, Sunhot Elves of the Light 23%.
- **Minorities and mixed lands:** The Sunfolk of Goodin live among the Sunhot; the Gala court has a few men and Sunhot courtiers.

### Dark Lands

- **People:** 3.40 M (3.9% of the world) in 24 countries and 47 states; 72 thousand per state. Urban share 7%; largest city 55 thousand.
- **Density:** Hills, forest, marsh and volcano: 6 to 14 per square kilometre.
- **Dominant cultures:** Iron Clans 37%, Volcano Clans 32%, Dondor Brutes 22%.
- **Minorities and mixed lands:** Goblins live in orc holds, trolls in the Troll Forest; Dondor and Blackton hold human towns beside orc hills; Belonton and the sea orcs share islands with Leren fishers.

### Magical Lands

- **People:** 2.40 M (2.8% of the world) in 22 countries and 131 states; 18 thousand per state. Urban share 10%; largest city 25 thousand.
- **Density:** Rich forest land held by long-lived elves: 4 to 8 per square kilometre in the realms, near nothing in the black areas.
- **Dominant cultures:** Rift-Coast Elves 35%, Council Elves of the Magical Forest 28%, Hill-Kingdom Elves 15%.
- **Minorities and mixed lands:** Mushroom-forest mycids live inside an elven realm [O]; the Worshipdom valleys are men inside the elven region; the rift coast has Alerhic merchants.

### Triton's Islands

- **People:** 2.00 M (2.3% of the world) in 34 countries and 45 states; 44 thousand per state. Urban share 14%; largest city 20 thousand.
- **Density:** Small islands, fully used coasts: 25 to 40 per square kilometre on inhabited isles.
- **Dominant cultures:** Chart-Islanders 68%, Corsair Lords 32%.

### Dead Lands

- **People:** 1.90 M (2.2% of the world) in 13 countries and 30 states; 63 thousand per state. Urban share 9%; largest city 60 thousand.
- **Density:** Hot desert and hills, storm-girt coasts: lake country and the north coast 8 to 15, the interior under one.
- **Dominant cultures:** Wardens of Mirolon 42%, Dead Lands Freeholders 34%, Grave Hosts of Volgan 16%.
- **Minorities and mixed lands:** Mirolon's wardens, coast freeholders and the Nether realms; Volgan's Dominion holds orcs, ogres and demons beside the dead.

### Islands of the South

- **People:** 1.30 M (1.5% of the world) in 19 countries and 24 states; 54 thousand per state. Urban share 8%; largest city 8 thousand.
- **Density:** Reef islands with fishing coasts: 20 to 35 per square kilometre.
- **Dominant cultures:** Southern Islanders 100%.

### Zol's Mistake

- **People:** 0.14 M (0.2% of the world) in 1 countries and 104 states; 1 thousand per state. Urban share 10%; largest city 12 thousand.
- **Density:** Black wasteland: 0.02 per square kilometre outside Furviatlon.
- **Dominant cultures:** Zol's Dead 100%.

## 5. How people become game numbers

### State category

Category follows the settlement and the people (keys and slots are the engine's; names belong to the economy spec).

| Key | Rule |
| --- | --- |
| wasteland | state_people under 25,000 and no settlement of 5,000 |
| enclave | one-province hold with under 60,000 people |
| tiny_island | island of one province |
| small_island | island of two to four provinces |
| large_island | island of five or more provinces |
| pastoral | pasture, tundra or upland, under 90,000 |
| rural | 90,000 to 200,000 with no settlement of 20,000 |
| town | largest settlement 5,000 to 20,000, or 150,000 to 280,000 people |
| large_town | largest settlement 20,000 to 40,000 |
| city | largest settlement 40,000 to 100,000 |
| large_city | largest settlement 100,000 to 250,000, or a regional capital |
| metropolis | largest settlement 250,000 or more, or a great power capital with 100,000 or more |
| megalopolis | Parim only (380,000) |

### Manpower, factories, infrastructure

- **Manpower per state:** state manpower = state_people × 0.11 (the share of men of fighting age who could be raised in a war); a people may multiply it by its recruitable_population_factor.
- **Share by people:** men 0.11, orcs 0.14, goblins 0.12, trolls 0.09, elves 0.04, sun_elves 0.03, giants 0.05, yeti 0.08, ents 0.02, demons 0.05, the_dead 0.
- **Starting workshops, armouries, shipwrights:** workshops = urban_people ÷ 75,000 × (region_dev ÷ 0.60); armouries = workshops × 0.45 in Aenor and Lerendor, × 0.55 in orc and Volgan lands, × 0.5 elsewhere; shipwrights = coastal urban_people ÷ 400,000. Round to the nearest whole building; no factory in a state under 25,000 people.
- **Infrastructure:** infrastructure level = 1 + floor(density rank of the state in its region ÷ 0.25); roads follow settlement size (a settlement of 20,000 or more has level 3; of 100,000 or more level 4); the Restoration roads give the Middle Lands +1.
- **Resources:** Resources keep the economy spec's region weights; population does not change them. Essence and Gold stay scarce.
- **Per-people modifiers** stay as in [03_peoples.md](../00_foundation/03_peoples.md); the people factor above only scales how many there are.

### Targets by country class

| Class | People | Workshops | Armouries | Shipwrights | Divisions |
| --- | --- | ---: | ---: | ---: | --- |
| Great power of men (Aenor) | 8.5 to 9.5 million | 32 | 14 | 6 | 14 to 18 |
| Great power of men (Lerendor, Coldor, Noris, Stabilo, Gunwaith) | 1.2 to 3.5 million | 10 to 16 | 6 to 8 | 2 to 6 | 8 to 12 |
| Orc and dark great powers (Goldoroth, Volgan) | 0.5 to 0.9 million living | 5 to 6 | 7 to 14 | 0 to 1 | Goldoroth 8 to 10, Volgan 16 |
| Regional power (tier B) | 0.2 to 1.5 million | 2 to 8 | 1 to 4 | 0 to 3 | 2 to 6 |
| Concord dominion | 0.1 to 0.6 million | 1 to 5 | 0 to 2 | 0 to 2 | 1 to 3 |
| Minor realm (tier C) | 0.01 to 0.2 million | 0 to 2 | 0 to 1 | 0 to 1 | 1 to 3 |

A country's strength follows its land, its rivers and its trade. The class table gives the usual outcome of the formulas. It is never a target to be forced.

### Targets by region

Region development (share of building slots filled): Middle Lands 0.60, East Lands 0.50, Cold Lands 0.25, West Lands 0.40, North Lands 0.45, Lands of the Sun 0.40, Dark Lands 0.30, Magical Lands 0.35, Triton's Islands 0.30, Dead Lands 0.30, Islands of the South 0.25, Zol's Mistake 0.00. The state pass multiplies workshops by development ÷ 0.60.

### The largest countries by people (all 305 are in the data file)

| Country | Region | Culture | States | People | Urban people |
| --- | --- | --- | ---: | ---: | ---: |
| Aenor | Middle Lands | Lake Aenorans | 18 | 9.80 M | 2.47 M |
| Alerhia | East Lands | River-Kings of the East | 26 | 2.40 M | 0.48 M |
| Coldor | Cold Lands | Winter-Crown Folk | 24 | 1.63 M | 0.13 M |
| Freshon | Middle Lands | Lake Aenorans | 4 | 1.42 M | 0.34 M |
| Pazoma | Middle Lands | Lake Aenorans | 4 | 1.42 M | 0.34 M |
| Delbiz Grasslands | East Lands | River-Kings of the East | 17 | 1.33 M | 0.27 M |
| Selen | Middle Lands | Selen Rangers | 7 | 1.33 M | 0.32 M |
| Erco | East Lands | River-Kings of the East | 16 | 1.25 M | 0.25 M |
| Plutondo | East Lands | River-Kings of the East | 16 | 1.25 M | 0.25 M |
| Lerendor | North Lands | Leren of the Strait | 6 | 1.24 M | 0.20 M |
| Stabilo | East Lands | Caravan Princes | 14 | 1.23 M | 0.25 M |
| Noris | East Lands | Noris Camel Warriors | 24 | 1.22 M | 0.24 M |
| Gunwaith | West Lands | Gunwaith Clans | 12 | 1.20 M | 0.20 M |
| Noleksun | Middle Lands | March-Folk | 8 | 1.04 M | 0.25 M |
| The Lands of Light | Lands of the Sun | Sunhot Elves of the Light | 15 | 0.93 M | 0.11 M |
| Lambin | West Lands | Gunwaith Clans | 10 | 0.85 M | 0.14 M |
| Mostok | East Lands | Caravan Princes | 12 | 0.83 M | 0.17 M |
| Mirolon | Dead Lands | Wardens of Mirolon | 6 | 0.80 M | 0.07 M |
| Miaed | East Lands | River-Kings of the East | 19 | 0.79 M | 0.16 M |
| Fosoco | East Lands | River-Kings of the East | 10 | 0.78 M | 0.16 M |
| Fearno | Cold Lands | Ice Clans | 25 | 0.77 M | 0.06 M |
| Drak | East Lands | Caravan Princes | 11 | 0.76 M | 0.15 M |
| Azano | East Lands | Caravan Princes | 11 | 0.76 M | 0.15 M |
| Kingson | Middle Lands | Wall-Folk | 4 | 0.76 M | 0.18 M |
| Safeton | Middle Lands | Lake Aenorans | 2 | 0.76 M | 0.18 M |
| Isengard | Cold Lands | Isengard Warlords | 12 | 0.74 M | 0.06 M |
| Windwaith | Cold Lands | Windwaith Seafarers | 12 | 0.74 M | 0.06 M |
| Sensai | North Lands | Free Crowns of the North | 7 | 0.72 M | 0.12 M |
| Tieri | Middle Lands | Lake Aenorans | 2 | 0.71 M | 0.17 M |
| Mondon | Middle Lands | Lake Aenorans | 2 | 0.71 M | 0.17 M |

## 6. Population and culture together

### Cultural minorities and mixed lands

- **Middle Lands.** Aenor holds many dominions of its own culture; the Selen, Kilinti and Hiloron border has men, ents and giants living side by side; the south marches mix march-folk with refugees from the Dead Lands coast; the Veiled and Redbark are enclaves inside Aenor's roads.
- **North Lands.** The strait coast is Leren; the inland crowns are Free Crowns; Blackton on the Dark Lands coast is mixed Dondor and Leren; Leren sailors settle R'en.
- **West Lands.** Gunwaith clans and Girdon wardens mix along the Grey Ford; guild towns have Aenoran merchants; Buldor companies recruit from every clan.
- **Cold Lands.** Ice clans mix with yeti and giants at the high valleys; Windwaith and the western ports have Gunwaithic traders.
- **Dark Lands.** Goblins live in orc holds, trolls in the Troll Forest; Dondor and Blackton hold human towns beside orc hills; Belonton and the sea orcs share islands with Leren fishers.
- **Magical Lands.** Mushroom-forest mycids live inside an elven realm [O]; the Worshipdom valleys are men inside the elven region; the rift coast has Alerhic merchants.
- **East Lands.** Noric, Stabilic and Alerhic peoples mix at the crossroads; caravan towns host every tongue; the Hidden Council's eastern clients are present in every city. [secret]
- **Lands of the Sun.** The Sunfolk of Goodin live among the Sunhot; the Gala court has a few men and Sunhot courtiers.
- **Dead Lands.** Mirolon's wardens, coast freeholders and the Nether realms; Volgan's Dominion holds orcs, ogres and demons beside the dead.

### Refugees and old migrations

The Second Age scattered the Aenorans into Selen, the steppe and Asgard; the Third Age pushed some into the Magical Lands' borders as guests of the elves; the Fourth Age brought them home. The result is three Aenoran refuge cultures (Selen Rangers, Steppe Riders, Isle Houses) that are Aenoran in speech and not in habit, and a wall of watch-families along the Great Wall. After the Fall of Aenor the Mirolonese moved to the north coast of the Dead Lands and back. The marchers settled the empty southern ground after the Second Age famine. These histories are why a state's culture can differ from its owner's.

### Core and claim logic at the start

- Every country cores its own states at the start. No claims at the start (foundation spec).
- A people that lived in a state before a conquest keeps it as a cultural claim for play: the Gunwaith claim nothing from Aenor at the start but resent its old charts; the Veiled and Redbark never accept Aenor's authority; Leren crowns resist Lerendor's supremacy but accept its protection.
- Resistance follows culture: a state of a different culture than its ruler's adds +20% resistance target; a state of a people of Great Folk ruled by Common Folk adds +10%; a state whose faith differs from the ruler's adds +5%; the Wall-Folk and Lake Aenorans treat each other as one culture.

### Which states resist which rulers (starting values, proposed)

| Ruler | State of | Resistance | Why |
| --- | --- | --- | --- |
| Aenor | A Concord dominion of men | low | Chartered; keeps its own lord |
| Aenor | The West Lands | strong | Old settler wars; tariffs |
| Aenor | The Cursed Lands, the Bloody Forest | total | Old defeat; they refuse every charter |
| Aenor | A Magical Lands elven realm | strong | The Elven Refusal; elves will not be ruled by men |
| Lerendor | A Free Crown of the North | medium | Prides itself on independence, accepts protection |
| Coldor | Isengard | strong | The refusal of 4A 850 |
| Coldor | An Ice Clan | low | Fed in hard winters |
| Goldoroth | A free orc hold | strong | Holds do not pay |
| Goldoroth | Dondor or Blackton | total | Human towns beside orc hills |
| Volgan | Mirolon | total | The Watchers of the Passes |
| Noris | A Stabilo-led trade city | strong | The caravan rivalry |
| Any outsider | A Sunhot realm | passive | The Sunhot are strong and unwarlike; they do not rise but they do not serve |
| Any man | Kilinti or Hiloron | strong | Ents and giants answer to protectors only |
| Any ruler | A culture whose faith differs | +5% resistance target | Per rule above |

## 7. Implementation

| Step | Change | Written by | File |
| --- | --- | --- | --- |
| State population | Region calibration and the state rule of section 2, from terrain shares and rivers | The politics step's state pass, reading `demography.json` and the geography model | `history/states/*` (manpower), `docs/design/state_population.json` (new, for review) |
| Categories | Section 5 rules | The state pass | `history/states/*` |
| Settlements | The 100 settlements of section 8 become victory points; their sizes set the category, the infrastructure and the victory-point value (capitals of great powers 30 to 50, Parim 50; regional capitals 10 to 20) | The state pass and the generator of [06_languages.md](06_languages.md) | `map/*`, `localisation/english/victory_points_l_english.yml` |
| Starting factories | The formulas of section 5 replace the category-driven counts | The state pass | `history/states/*` (buildings) |
| Data check | The population-versus-geography check of section 9 | `tools/content/checks/world_data.mjs` (the foundation spec's data check, extended) | build log |

This spec replaces the manpower base table of [04_countries_and_states.md](../00_foundation/04_countries_and_states.md) section 7 for the state pass: the category bases there become slot classes only, and manpower follows the population here. Until the state pass reads `demography.json`, the older table stays in force.

## 8. The 100 most important settlements

Placement uses countries, capital states and named features of the geography model, never pixel coordinates. If a named feature does not exist in the model at build time, the state pass falls back to the capital state of the country and the nearest feature of the kind named. Names marked as drawn or working-table are used as given; the rest are proposals produced by [06_languages.md](06_languages.md).

| # | Settlement | Country | People | Culture | Role | People (thousand) | Placement rule |
| ---: | --- | --- | --- | --- | --- | ---: | --- |
| 1 | Parim | Aenor | Men | Lake Aenorans | Crown city; seat of the Golden King, the Concord Council and the University | 380 | In Aenor's capital state, on the Great Lake's north shore at the mouth of the largest river that enters it; palace on the headland, Golden Court north of the bridges. |
| 2 | Dolepar | Aenor | Men | Lake Aenorans | Great Lake port and shipyard | 62 | On the Great Lake's south shore at the best deep-water bay, in an Aenor state with a naval base. |
| 3 | Silesire | Aenor | Men | Lake Aenorans | River-mouth grain port | 55 | On the Great Lake's east shore where the largest eastern river enters it. |
| 4 | Kerepael | Aenor | Men | Lake Aenorans | Fortress town on the road to the Wall | 34 | In the Aenor state nearest Kingson, where the main east road leaves the plain for the foothills. |
| 5 | Hifeco | Selen | Men | Selen Rangers | Dominion capital; the University of Selen | 38 | In Selen's capital state, at the forest edge where the first road leaves the wood; the University stands on the hill above. |
| 6 | Arrovez | Konori | Men | Steppe Riders | Steppe royal seat | 22 | In Konori's capital state, at the river ford on the steppe edge. |
| 7 | Ollolor | Kilinti | Ents | Ents of Kilinti | Moot-grove of the ents | 4 | In Kilinti's capital state, inside the oldest grove; no walls. |
| 8 | Deolofson | Kingson | Men | Wall-Folk | Gate town of the Great Wall | 26 | In Kingson's capital state, where the main road crosses the Great Wall. |
| 9 | Lunhrim | Kingson | Men | Wall-Folk | Wall fort at one end of the Great Wall [E name; place O] | 8 | On the Great Wall line, at the end the owner has not placed; proceeds at the Wall's northern end near the foothills. |
| 10 | Bedogus | Hiloron | Giants | Hill Giants of Hiloron | Giants' hall above the cairn-fields | 5 | In Hiloron's capital state, on the highest hill. |
| 11 | Lotrenri | Safeton | Men | Lake Aenorans | Lake haven | 30 | In Safeton's capital state, on a sheltered bay of the Great Lake west of Parim. |
| 12 | Saelori | Noleksun | Men | March-Folk | Frontier moot town | 18 | In Noleksun's capital state, at the crossing of the south-eastern roads. |
| 13 | Borrak | Asgard | Men | Isle Houses of Asgard | Harbour of Aenor Isle; shipwrights | 28 | In Asgard's capital state, in the best natural harbour facing the central sea. |
| 14 | Ulrono | Hunhun | Men | Steppe Riders | Riders' gathering ground | 14 | In Hunhun's capital state, on the open plain at the permanent gathering ground; mostly tents. |
| 15 | Hugomon | Herez | Men | March-Folk | Southern march fort | 12 | In Herez's capital state, on the pass where the southern road enters the marches. |
| 16 | Hordorton | Freshon | Men | Lake Aenorans | Spring market | 40 | In Freshon's capital state, around the spring where the lake road meets the south road. |
| 17 | Horlomon | Pazoma | Men | Lake Aenorans | Rich lake town | 45 | In Pazoma's capital state, on a deep lake bay. |
| 18 | Morluma | Cursed Lands | Men | The Veiled | Hidden cord-hall | 3 | In the Cursed Lands' capital state, deep in the sour ground; no road leads to it. |
| 19 | Giritren | Bloody Forest | Men | Redbark Tribes | Tree-halls of the Redbark tribes | 6 | In the Bloody Forest's capital state, in the oldest stand of red oak. |
| 20 | Hungohon | Klungori Guard | Men | Wall-Folk | Garrison town of the Wall's southern flank | 9 | In Klungori Guard's capital state, on the Wall road south of Kingson. |
| 21 | Ulton | Belurithon | Men | March-Folk | March town | 7 | In Belurithon's capital state, on the southern frontier road. |
| 22 | Sonargur | Lerendor | Men | Leren of the Strait | Seat of the united Leren crown; the Singing Quay | 120 | In Lerendor's capital state, on the strait shore at the best natural harbour; naval base level 3 or more. |
| 23 | Perhy | Eekedor | Men | Leren of the Strait | Arbitration town of the North | 14 | In Eekedor's capital state, on the inlet that is its harbour. |
| 24 | Farnardur | R'en | Men | Leren of the Strait | Gateway of the strait | 18 | In R'en's capital state, at the narrowest point of the strait. |
| 25 | Altovian | Molot | Men | Free Crowns of the North | Marcher fortress | 12 | In Molot's capital state, behind the marsh line. |
| 26 | Agtosai | Sensai | Men | Free Crowns of the North | Seat of the largest free crown | 16 | In Sensai's capital state, in the long vale. |
| 27 | Gilvian | Mina | Men | Free Crowns of the North | Mining crown's town | 9 | In Mina's capital state, below the ore hills. |
| 28 | Fandanar | Coldor | Men | Winter-Crown Folk | Seat of the Winter Crown; the Frost-Hall | 85 | In Coldor's capital state, in the interior valley between the Frozen Mountains and the Cold Mountains. |
| 29 | Minnolomak | Isengard | Men | Isengard Warlords | Warlord's fort-city | 30 | In Isengard's capital state, at the mouth of the main pass of the Isengar Mountains. |
| 30 | Ollondo | Horidor | Men | Ice Clans | Clan-realm seat allied to Coldor | 14 | In Horidor's capital state, on the valley road to Fandanar. |
| 31 | Porideon | Windwaith | Men | Windwaith Seafarers | Council port of the wind-coast | 24 | In Windwaith's capital state, on the westward headland. |
| 32 | Alorio | Greenle | Men | Windwaith Seafarers | Western port; the Harbour-Master's seat | 22 | In Greenle's capital state, in the best harbour of the western coast. |
| 33 | Vaestia | Wonderland | Men | Ice Clans | Coast-and-forest seat | 11 | In Wonderland's capital state, where the forest meets the coast road. |
| 34 | Fentene | Yeti Lands | Yeti | Yeti Clans | The largest cave-gathering of the yeti | 4 | In the Yeti Lands' capital state, in the highest valley. |
| 35 | Xitore | Titanos | Giants | Ice Giants of Titanos | Ice-throne of the Frost-King | 3 | In Titanos's capital state, on the glacier plain. |
| 36 | Castle of Yeldenne | Yeldenne | Men | Ice Clans | Horos's castle, keeper of Glo [E]; victory point Simoto today | 2 | In the state named Mp'E, in the frozen north of the Cold Lands; exact place O. |
| 37 | Bulligon | Gunwaith | Men | Gunwaith Clans | Seat of the northern crown of the West Lands | 70 | In Gunwaith's capital state, near the neck road to the Cold Lands. |
| 38 | Arligon | Girdon | Men | Girdon Wardens | Warden-town of the river fords | 40 | In Girdon's capital state, at the main ford of the river that borders Gunwaith. |
| 39 | Bolbin | Kradlon | Men | Western Guildmen | Guild port | 38 | In Kradlon's capital state, on the western sea. |
| 40 | Oslodon | Corogon | Men | Western Guildmen | Trading port | 34 | In Corogon's capital state, on the bay facing the central sea. |
| 41 | Varlibo | Varnondor | Men | Gunwaith Clans | Lowland royal seat | 20 | In Varnondor's capital state, on the plain. |
| 42 | Toplipor | Buldor | Men | Buldor Companies | Barracks-town of the companies | 16 | In Buldor's capital state, at the crossroads of the southern roads. |
| 43 | Arropon | Lambin | Men | Gunwaith Clans | Farm-and-hill seat | 18 | In Lambin's capital state, below the hills. |
| 44 | Aunaza | Adel | Men | Chart-Islanders | Chart-house league seat | 20 | In Adel's capital state, in the best harbour of the Adel Mountains' island. |
| 45 | Montah | Pollos | Men | Chart-Islanders | Trading league harbour | 14 | In Pollos's capital state, on the harbour. |
| 46 | Seidailos | Raerby | Men | Chart-Islanders | Seafaring league harbour | 12 | In Raerby's capital state, below the Raerby Mountains. |
| 47 | Kudaini | Nondondor | Men | Corsair Lords | Sea-king's cliff harbour | 9 | In Nondondor's capital state, on the cliff harbour that holds the isles' naval frontier. |
| 48 | Cocanoor | Goldoroth | Orcs | Volcano Clans | Seat of the Warking beneath the Fire-Mountain; victory point Fabdernor today | 55 | In Goldoroth's capital state, at the foot of the Goldoroth Volcano. |
| 49 | Notbuton | Dondor | Men | Dondor Brutes | Seat of the Dondor kings; victory point Dunnoor today | 30 | In Dondor's capital state, on the forest edge facing the straits. |
| 50 | Dontadur | Blackton | Men | Dondor Brutes | Free human coast town | 14 | In Blackton's capital state, on the coast. |
| 51 | Lesderle | Dulundur | Orcs | Iron Clans | Largest free orc hold | 18 | In Dulundur's capital state, in the largest valley. |
| 52 | Notle | Belonton | Orcs | Sea Orcs | Sea-orc harbour | 7 | In Belonton's capital state, on the borderland coast. |
| 53 | Fablundor | Troll Forest | Trolls | Troll Tribes | Troll heap-hall | 3 | In the Troll Forest's capital state, in the heart of the forest. |
| 54 | Doldes | Dark Gate | Orcs | Volcano Clans | Gate hold on the road south | 6 | In Dark Gate's capital state, at the pass. |
| 55 | Gollonlon | Fondor | Orcs | Iron Clans | Hold town at the Fonoor Forest | 6 | In Fondor's capital state, at the forest edge. |
| 56 | Dobudo | Dunbulinor | Orcs | Iron Clans | Hold town | 6 | In Dunbulinor's capital state, in the hills. |
| 57 | Nafeher | Volgan | Living in Volgan's and Zol's realms | Grave Hosts of Volgan | Seat of Volgan; a great city at most [E working seat]; victory point Neleelon today | 60 | In Volgan's capital state, on the inland plateau behind the storms. |
| 58 | Miherta | Mirolon | Men | Wardens of Mirolon | Warden-town on the lake | 50 | In Mirolon's capital state, on the Lake of Mirolon. |
| 59 | Gelroze | Nezer | Demons | Netherborn | Hall of Queen Nazara | 22 | In Nezer's capital state, in the Nezerun hills. |
| 60 | Miherze | Demon | Demons | Netherborn | Hall of Hazarel the Horned | 20 | In Demon's capital state, in the Nether foothills. |
| 61 | Unzeky | Dolon | Demons | Netherborn | Salt-coast pact-hall | 12 | In Dolon's capital state, on the Dead Sea. |
| 62 | Larorun | Nan | Men | Dead Lands Freeholders | Hill warlord's fort | 10 | In Nan's capital state, in the Nan Mountains. |
| 63 | Memate | Magical Forest | Elves | Council Elves of the Magical Forest | Seat of the First Speaker; tree-city | 25 | In the Magical Forest's capital state, inside the Living Forest. |
| 64 | Ennaton | Nolorim | Elves | Pass-Warden Elves | Pass-warden hold | 6 | In Nolorim's capital state, on the high pass. |
| 65 | Verozo | Herrodon | Elves | Hill-Kingdom Elves | Hill-kingdom hall | 14 | In Herrodon's capital state, on the Herrodon Mountains' lower slope. |
| 66 | Enliras | Andos Enda | Elves | Lake Elves | Lake-realm water garden | 12 | In Andos Enda's capital state, on its main lake. |
| 67 | Lenlakron | Worshipdom | Men | Zilin Pilgrim-Folk | Pilgrim town of the Zilin Hills [secret hub] | 9 | In the Worshipdom's capital state, in the central of the three Zilin valleys. |
| 68 | Lenkei | The End | Elves | Rift-Coast Elves | Rift-coast lantern city | 15 | In The End's capital state, on the rift sea shore. |
| 69 | Hidirim | Lccimio | Elves | Rift-Coast Elves | Rift-coast realm seat | 14 | In Lccimio's capital state, on the rift sea shore. |
| 70 | Dragon Mountain Roost | Herrodon | Elves | Hill-Kingdom Elves | Roost-hold at Dragon Mountain [E feature] | 2 | In the Dragon Mountain state, held by the nearest elven realm. |
| 71 | Furvior | Noris | Men | Noris Camel Warriors | Seat of the camel kings; city of the Seven Wells | 210 | In Noris's capital state, on a hill of wells at the junction of the Salt Road and the Sand Road. |
| 72 | Postondoroth | Stabilo | Men | Caravan Princes | Seat of the caravan princes; the Hall of Scales | 240 | In Stabilo's capital state (the capital moves here [map S5]), at the Gold Road's great harbour-market. |
| 73 | Porrenva | Alerhia | Men | River-Kings of the East | Stair-city of the river kings | 160 | In Alerhia's capital state, on the river above the flood-line. |
| 74 | Erdozan | Miaed | Men | River-Kings of the East | Desert-pass capital | 120 | In Miaed's capital state, at the great pass. |
| 75 | Atonto | Erco | Men | River-Kings of the East | River kingdom capital | 95 | In Erco's capital state, on its river. |
| 76 | Vobibiz | Plutondo | Men | River-Kings of the East | Southern river capital | 110 | In Plutondo's capital state, on its river. |
| 77 | Ohitus | Ostoroth | Men | Lake Road Cities | Lake Road capital | 70 | In Ostoroth's capital state, on the Lake Road. |
| 78 | Gonnois | Mora | Men | Lake Road Cities | Lake-city council town | 60 | In Mora's capital state, on the Hot Lake. |
| 79 | Reerenta | Gondolin | Men | Noris Camel Warriors | Ally of Noris | 45 | In Gondolin's capital state, on the desert's northern edge. |
| 80 | Pordoce | Avalon | Men | Red Lands Tribunes | Kiln-city of the Red Lands | 35 | In Avalon's capital state, on the red clay. |
| 81 | Cereosa | Mostok | Men | Caravan Princes | Central trade city | 40 | In Mostok's capital state, at the central road junction. |
| 82 | Furtonlin | Delbiz Grasslands | Men | River-Kings of the East | Grassland kingdom capital | 28 | In Delbiz Grasslands' capital state, on the rift coast. |
| 83 | Kerdoco | Obmi | Men | Caravan Princes | Jungle-edge city | 30 | In Obmi's capital state, at the jungle edge. |
| 84 | Pehami | Woqood | Men | Noris Camel Warriors | North-coast desert capital | 25 | In Woqood's capital state, on the Ocean of Zol coast. |
| 85 | Delgidor | Arcon | Men | Caravan Princes | Southern city on the Gold Road | 24 | In Arcon's capital state, on the Gold Road. |
| 86 | Liohado | Lorvens | Men | Lake Road Cities | Northern coast city | 18 | In Lorvens's capital state, on the coast. |
| 87 | Torsain | Howan | Men | Southern Islanders | Island harbour | 8 | In Howan's capital state, in the lee of the reef. |
| 88 | Yumhuy | Nara | Men | Southern Islanders | Island harbour | 7 | In Nara's capital state, behind the reef. |
| 89 | Jinsain | Enhis Is Rond | Men | Southern Islanders | Harbour near the tide-shrine [P] | 5 | In Enhis Is Rond's capital state, near the southern shore where the shrine lies. |
| 90 | Eldoga | The Lands of Light | Sunhot elves | Sunhot Elves of the Light | Seat of the Radiant Speaker | 55 | In the Lands of Light's capital state, in the largest valley. |
| 91 | Sodoli | Gala Elves | Elves | Gala Elves | Court of King Lorien; the Mirror's courtyard [P] | 12 | In the Gala Elves' capital state, in the old courtyard garden above the harbour. |
| 92 | Googavis | Elvana | Sunhot elves | Western Sanctuary Sunhot | Sanctuary town | 9 | In Elvana's capital state, in its sanctuary vale. |
| 93 | Repgin | Igara | Sunhot elves | Western Sanctuary Sunhot | Sanctuary town | 8 | In Igara's capital state, in its sanctuary vale. |
| 94 | Ileslia | Hengyang | Sunhot elves | Isle Sunhot | Isle sanctuary harbour | 12 | In Hengyang's capital state, on the island's main harbour. |
| 95 | Ilonlen | Poyang | Sunhot elves | Isle Sunhot | Isle realm harbour | 14 | In Poyang's capital state, on its main island. |
| 96 | Sudoni | Heaven | Sunhot elves | Western Sanctuary Sunhot | Pilgrimage town | 6 | In Heaven's capital state, on the shore. |
| 97 | Menmic | Flame | Sunhot elves | Western Sanctuary Sunhot | Pilgrimage town | 5 | In Flame's capital state, below the Great Volcano [E label]. |
| 98 | Wefolen | Godland | Sunhot elves | Western Sanctuary Sunhot | Pilgrimage town on the Sea of Gods | 7 | In Godland's capital state, on the shore of the Sea of Gods [E label]. |
| 99 | Furviatlon | Zol | Living in Volgan's and Zol's realms | Zol's Dead | Seat of Zol's realm; at most a town; who governs it is open [O] | 12 | In Zol's capital state, inland on the black plain. |
| 100 | Sodoloro | Zol | Living in Volgan's and Zol's realms | Zol's Dead | A named place in the Mistake [E]; written Sodolôrō in documents; the game font cannot draw ō | 1 | On the Šodolôrō label in Zol's Mistake [E]. |

## 9. Acceptance

1. **Build:** `demography.json` parses; the 305 countries sum to 86.64 M (60 to 120 million) and each region sums to its target within 1%.
2. **Build:** population-versus-geography check: no state has more than 1.5 million people; no state of black waste, ice or open desert has more than 30,000 people unless it holds a listed settlement; every river-side or lake-side state has at least 1.4 times the density of its inland neighbours of the same terrain.
3. **Build:** Aenor ranks first in people and workshops and among the top three in manpower; Zol has under 150 thousand people and no workshops; Parim is the only megalopolis and the largest city; no city exceeds 400 thousand.
4. **Build:** every settlement of section 8 names a country in the roster and a placement rule that resolves to one state; none uses a pixel coordinate.
5. **Build:** culture coverage check: every country has exactly one dominant culture and every culture is used by at least one country, except the goblin warrens (a minor people).
6. **Linux run (start as Aenor):** the world population shown in the statistics matches the sum of state manpower divided by the manpower share, within 5%.

## 10. Open questions

All proceed on their proposals.

1. Is a world of about 87 million right, or should it be nearer 60 or 120? **Proposal in use:** 87 million.
2. Should Parim be the only city above 300 thousand? **Proposal in use:** yes; Postondoroth (240 k) and Furvior (210 k) are the next.
3. Where do the dwarves live, and should they hold any settlement? **Proposal in use:** nowhere; no settlement is dwarven.
4. Should Zol's Mistake keep Furviatlon as a town of 12 thousand? **Proposal in use:** yes, at most a town; who lives there stays open.
