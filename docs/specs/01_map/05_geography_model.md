# Geography model of Erdae

**Status:** Draft. **Date:** 19 October 2026. **Priority:** 1. **Phase:** 1 (map rebuild).

## Purpose

This is the single source from which every layer of the rebuilt map is generated: coast, height, terrain, rivers, lakes, forests, provinces, states and strategic regions. The owner reviewed the current in-game map on 19 October 2026 and found it wrong. The lakes are specks. Aenor looks like a beige desert. Borders are straight lines. The mountains are weak. The map wraps like a globe. Strait crossings, rivers and sea names are missing. Everything feels random.

The model replaces guessing with named, placed, lore-checked features. The structured data is [tools/content/data/geography/erdae.json](../../../tools/content/data/geography/erdae.json). How the placements were checked is in [05_geography_overlay.md](05_geography_overlay.md).

## How to read this spec

- **Established** means the vault or the owner's drawn sheets name it ([Canon Policy](../../lore/vault/Canon%20Policy.md)). Drawn names whose reading is uncertain say so in their notes. **Proposed** means this spec adds it. Proposed names, places and shapes are marked *proposed* and can be replaced.
- Nothing here closes a question the vault leaves open. The place of Dardan is not set. The Sea of Darkness and the Abyss keep the alternatives the vault names; the model picks one for the map and says which.
- The vault wins over the drawings. Every disagreement is in the overlay note.
- Coordinates are normalised: x from 0 (west) to 1 (east), y from 0 (north) to 1 (south), origin top-left. In the 5,120 by 2,560 pixel layout one unit of x is 5,120 pixels and one unit of y is 2,560 pixels.
- Pixel sizes below use that layout. "A pixel" always means one pixel of the 5,120 by 2,560 frame.

## Contents of the model

| Array | Count | What it holds |
| --- | ---: | --- |
| `seas` | 44 | Named seas, oceans, gulfs and one storm belt (water partition of the layout) |
| `lands` | 89 | Landmass outlines of the reference plus one added island |
| `ranges` | 63 | Mountain spines with half-width and elevation |
| `volcanoes` | 16 | Volcano points |
| `rivers` | 32 | River lines, source to mouth, with a width class |
| `lakes` | 12 | Lake polygons |
| `forests` | 37 | Forest polygons |
| `deserts` | 9 | Deserts, black wastes and badlands |
| `marshes` | 10 | Marsh polygons |
| `ice` | 9 | Snowfields and edge ice cliffs |
| `plains` | 20 | Fertile and steppe plains |
| `straits` | 13 | Straits as lines with the two lands they join |
| `passes` | 20 | Passes, gates and fords |
| `sites` | 86 | Cities, castles, peaks, story places and forts |
| `regions` | 19 | The 15 land regions plus four zones |
| `roads` | 5 | The five caravan roads (proposed) |
| `coasts` | 30 | Capes, gulfs, bays, peninsulas and reefs |
| `hills` | 3 | Hill masses and the Abyss chasm |

## 1. World frame

### Extent and orientation

| Item | Value |
| --- | --- |
| Map size | 5,120 by 2,560 pixels, ratio 2 to 1 (the engine limit at this height) |
| Orientation | North is up, east is right. Erdae is **flat**: no globe, no poles, no wrap |
| Layout | The game layout of 18 October 2026: the cleaned reference with the central sea widened |
| Central sea | The **Crown Ocean** (*proposed*; drawn Rush Ocean is superseded): x 0.30 to 0.52, y 0.40 to 0.80, about 1,150 pixels west to east |
| Landmasses | Western Mainland (Cold Lands and West Lands), Central Mainland (Middle Lands, Magical Lands, Mirolon), Eastern Mainland (East Lands and South Lands), Northern Wastes (Zol's Mistake), the North Lands isle, the Dark Lands arms, the Dead Lands island, the Lands of the Sun, and the island groups |

### The edges (no wrap)

The vault says the far west and north of the Cold Lands, and the far east and south of the East Lands and South Lands, run off the known map, and that what lies beyond is not fixed. The model keeps that open and closes the map with impassable edges. HOI4 wraps the map left to right, so the edges are explicit.

| Edge | Name | What is there | Rule |
| --- | --- | --- | --- |
| West | The Hoarfrost Barrier (*proposed*) | Vault: the far west and north of the Cold Lands extend beyond the known map, what lies beyond is not fixed. The model leaves it unfixed: a cliff. | impassable ice cliff along x=0 where the Cold Lands run off the map; open sea columns where the Pandar and Santon seas touch the edge become impassable "edge sea". Nothing crosses to x=1. |
| North | The Roof Cliffs and the Ashen Cliffs (*proposed*) | The Cold Lands and Zol's Mistake both run off the north edge. | impassable cliffs: ice over the Cold Lands, black basalt over Zol's Mistake; open sea on the north edge becomes impassable edge sea. |
| East | The Burning Rim (*proposed*) | Vault: the East Lands and the South Lands run off the east and south edges. | impassable lava cliffs and dune walls on the East Lands' east edge; one column of impassable edge sea where water meets the edge. The east edge never touches the west edge. |
| South | The Line of Sun | Drawn names at the bottom of the Sunhot sheet. | impassable cliffs on the South Lands and the Lands of the Sun; edge sea elsewhere. The drawn labels The Line of Sun and The Sky of Erdae name this edge. |

Wrap rule: Provinces on x<0.004 and x>0.996 must be impassable edge provinces; no adjacency joins the west edge to the east edge. The Cold Lands west edge and the East Lands east edge are 5,000 pixels apart in the world and must stay that way.

Edge provinces are impassable, carry no buildings and have no adjacency to the opposite edge. Lands that run off an edge end in a cliff, not in a coast.

### Coordinate frames

The first plan was to measure everything against the working drawing. The working drawing is the owner's un-rearranged mosaic of the thirteen sheets. In it the East Lands, the Dead Lands and the Magical Lands sit elsewhere and at other scales than on the game map, and the central sea is narrow. A rasteriser that used it would rebuild the old layout.

So the model uses two frames:

1. **World frame** (primary): the game layout. Every feature has `geometry` here.
2. **Drawing frame**: every feature on a registered sheet also has `drawing`, its position in the working drawing (0 to 1 of 3,200 by 2,323 pixels), computed through the per-sheet transforms in `sheets`. The transforms were fitted by landmark and shape and are good to about 0.015 units (80 pixels). Features outside any sheet (the central sea, the added Nether island, edges) have no `drawing`.

## 2. The regions

Each region has an outline in `regions`. The outline is derived from the layout, so it follows the coast. Terrain targets are HOI4 terrain shares (they sum to 1). HOI4 has no ice terrain, so snow land counts as plains and the snow share is listed separately.

### Summary table

| Region | Plains | Forest | Hills | Mountain | Desert | Marsh | Jungle | Urban | Snow part of plains |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Cold Lands | 74% | 4% | 9% | 12% | 0% | 1% | 0% | 0% | 90% |
| Windwaith arm (Cold Lands) | 80% | 0% | 12% | 8% | 0% | 0% | 0% | 0% | 95% |
| West Lands | 38% | 36% | 12% | 8% | 0% | 3% | 0% | 3% | 4% |
| Triton's Islands | 34% | 22% | 20% | 14% | 0% | 2% | 8% | 0% | 0% |
| North Lands | 42% | 20% | 18% | 15% | 0% | 2% | 0% | 3% | 25% |
| Dark Lands | 22% | 30% | 15% | 28% | 0% | 3% | 0% | 2% | 3% |
| Middle Lands | 50% | 20% | 12% | 12% | 0% | 2% | 0% | 4% | 0% |
| Aenor Isle | 50% | 20% | 25% | 0% | 0% | 0% | 0% | 5% | 0% |
| Magical Lands | 15% | 45% | 15% | 22% | 0% | 3% | 0% | 0% | 4% |
| Zol's Mistake | 55% | 0% | 15% | 8% | 20% | 2% | 0% | 0% | 0% |
| East Lands | 22% | 10% | 13% | 20% | 30% | 2% | 1% | 2% | 12% |
| South Lands | 12% | 0% | 10% | 6% | 70% | 0% | 0% | 2% | 0% |
| Dead Lands | 10% | 10% | 25% | 30% | 20% | 5% | 0% | 0% | 0% |
| Islands of the South | 40% | 30% | 12% | 4% | 0% | 4% | 10% | 0% | 0% |
| Lands of the Sun | 40% | 22% | 15% | 12% | 2% | 4% | 5% | 0% | 0% |

Urban is a share of provinces made urban by the cities, not of land. Percentages are rounded and may sum to 99 or 101.

### Cold Lands

Northwest, the largest landmass, running off the west and north edges. It is one huge snow plain edged by sea on the south and east. The Yeti Lands shelf and the Worlond Forest form the neck that joins it to the West Lands.

| Item | Value |
| --- | --- |
| Climate | Arctic and subarctic; long dark winters, short cool summers; blizzards on the coasts. |
| Seasons | Frozen from Deepwinter to Thaw; rivers open only two months. |
| Elevation profile | Flat ice plain 1, broken by three great ranges (Icy, Isengar, Cold Mountains) at 4 to 5. |
| Terrain targets | plains 74%, forest 4%, hills 9%, mountain 12%, marsh 1% |
| Provinces per state | 5 / 8 / 12 (min / typical / max), province area about 2400 pixels |
| Peoples | Tribes, giants of Titanos, yeti, free coastal towns; Coldor in the west, Isengard in the north, Horidor in the south-east. |
| Fertile areas | Almost none inland. People live on the south and west coasts (Narnia, Andgas, Poloto), in the sheltered Isengar valley (Mp'E) and along the Fandan River; herding and sealing. |
| Major ranges | Icy Mountains, Isengar Mountains, Yeldenne Heights, Coldor Mountains, Cold Mountains, Neridor Mountains |
| Natural borders | Coldor and Isengard: the Fandan River and the Isengar Mountains. Coldor and Horidor: the Naepu ridge and the Naepu River. Cold Lands and West Lands: the Neridor Mountains and the Worlond Forest belt; the Neck Road is the only road. |

- **Rivers.** Fandan River (*proposed*, long) from the Yeldenne Heights through the Neridor gap to Poloto. Naepu River and Orewell Water (*proposed*, short). Rivers are frozen four months a year.
- **Lakes.** Cold Tarn (*proposed*, small). The reference shows only a thin streak.
- **Coast.** Cape Tinton, Poloto Head, Wonderland Point; the Gulf of Minnolomak (*proposed*) in the north-east; the Pandar sea on the west coast.
- **Passes.** The Neck Road and the Neridor Gap; the Isengar Pass into the Yeldenne valley.
- **Sites.** Fandanar; the Castle of Yeldenne at Mp'E; Eindil's Ice in the far north-west (*proposed*); the Landing below Mp'E (*proposed*).

### Windwaith arm

The long snow arm that leaves the Cold Lands to the south-west along the west edge. Part of the Cold Lands by the vault.

| Item | Value |
| --- | --- |
| Climate | Arctic, wind-scoured. |
| Seasons | Frozen most of the year. |
| Elevation profile | Low ice shelf 1 to 2. |
| Terrain targets | plains 80%, hills 12%, mountain 8% |
| Provinces per state | 6 / 9 / 12 (min / typical / max), province area about 2400 pixels |
| Peoples | Sparse tribes. |
| Fertile areas | None. |
| Major ranges | none |
| Natural borders | The arm is bounded by the Pandar sea and the Triton's Ocean; it joins the Cold Lands over the sea only by the ice in winter. |

- Bounded by the Pandar sea and Triton's Ocean. Ice shelf only; no rivers.

### West Lands

South of the Cold Lands, joined by the neck. A forested body with three peninsulas: Kradlon in the south-west, Corogon in the south, Varnondor in the south-east. Gunwaith in the north, Girdon in the middle, Buldor below it.

| Item | Value |
| --- | --- |
| Climate | Cool temperate; wet; snow only near the neck with the Cold Lands. |
| Seasons | Mild; cold, wet winters. |
| Elevation profile | Lowland 1 with forested uplands 2 and three short ranges at 4 (Herlitz, Boldor, Fog). |
| Terrain targets | plains 38%, forest 36%, hills 12%, mountain 8%, marsh 3%, urban 3% |
| Provinces per state | 3 / 5 / 8 (min / typical / max), province area about 1100 pixels |
| Peoples | Two dozen kingdoms: Gunwaith, Girdon, Kradlon, Corogon, Varnondor, Lambin, Buldor companies. |
| Fertile areas | The Girdon plain, the Kulolo valley, the Ronbo Grasslands and the Corogon coast; ports on the Blue Sea and the Crown Ocean. |
| Major ranges | Herlitz Mountains, Dusty Mountains, Fog and Eye Mountains, Bolpor and Boldor Mountains, Erg Mountains, Corogon Highlands |
| Natural borders | Gunwaith and Girdon: the Grey River, crossed at the Grey Ford. Girdon and Buldor: the Fog and Eye ridge. Girdon and Saopon: the Kulolo River. Corogon and Varnondor: the strait of 40 pixels between their peninsulas. |

- **Rivers.** Grey River (*proposed*) between Gunwaith and Girdon; the Kulolo River (drawn) between the Bolpor and Boldor ranges to the Ilurdor lagoon; Ronbo Water (*proposed*).
- **Lakes.** Ergo Sea and Ilurdor Sea (drawn as seas, in fact inland waters).
- **Forests.** The West Wood (*proposed* name for the dark block), Cologon Forest, Swamp Forests. **Marshes.** Papz Swamp, Kulolo Fen (*proposed*).
- **Coast.** Kradlon, Corogon and Varnondor peninsulas; Bay of Kradlon; Corogon Narrows between the last two.
- **Sites.** The Grey Ford, the Bridge of the Three Oaths and Girdon's Winter Ford (all *proposed*, from the chronicle); the Varnondor staging port (*proposed*).

### Triton's Islands

Two arcs of islands that curl round the Pupor Ocean, with a western arc (Pollos, Benan, Nondondor) and an eastern arc (Adel, Raerby).

| Item | Value |
| --- | --- |
| Climate | Maritime, windy, storm-prone (the drawn Tornado Islands). |
| Seasons | Gales in autumn. |
| Elevation profile | Arcs of low ridges 2 to 4 around the Pupor Ocean. |
| Terrain targets | plains 34%, forest 22%, hills 20%, mountain 14%, marsh 2%, jungle 8% |
| Provinces per state | 2 / 3 / 5 (min / typical / max), province area about 700 pixels |
| Peoples | Island lordships: Adel, Pollos, Raerby, Nondondor; fishers, pirates, chart houses. |
| Fertile areas | Sheltered inner shores of the arcs. |
| Major ranges | Adel Mountains, Benan Mountains, Raerby and Hapos Mountains |
| Natural borders | Every island is its own border; the arcs enclose the Pupor Ocean. |

- **Seas.** Pupor Ocean (vault), Windy Seas, Seas of Lemo, Amarelo Seas, Santon Ocean. **Reef.** The Cursed Square.
- Each island has a short ridge and a lee shore; the inner shores are the only farmland.

### North Lands

A compact isle north of the Middle Lands across the Narrow Strait. Lerenwaith's snow country in the north-west, Lerendor's highland ring in the centre, Eekedor's vale in the east, R'en on the southern cape.

| Item | Value |
| --- | --- |
| Climate | Cool temperate maritime; snow in Lerenwaith. |
| Seasons | Cold winters, mild summers. |
| Elevation profile | Lowland 1 with a highland ring 3 to 4 round the Evian lake. |
| Terrain targets | plains 42%, forest 20%, hills 18%, mountain 15%, marsh 2%, urban 3% |
| Provinces per state | 3 / 5 / 7 (min / typical / max), province area about 1000 pixels |
| Peoples | Lerendor and Lerenwaith (one crown), Eekedor, Molot, R'en, Sensai, Mina. |
| Fertile areas | Eekedor Vale and the Leren shore; the Leren River valley; strait ports (Sonargur, R'en). |
| Major ranges | Loron Mountains, Wely and Fair Mountains, Solondor Mountains, Etonia and Renann Mountains |
| Natural borders | North Lands and Middle Lands: the Narrow Strait. North Lands and Dark Lands: the Northern Dark Strait. Lerenwaith and Lerendor: the Loron highland. |

- **Lakes.** Evian Sea and Sea of R'en (drawn as seas, inland lakes). **River.** Leren River (*proposed*) from the Evian lake to Sonargur.
- **Straits.** The Narrow Strait (south, to the Middle Lands) and the Northern Dark Strait (south-west, to the Dark Lands).
- **Sites.** Sonargur on the strait with a naval base; Eekedor; R'en, the gateway.

### Dark Lands

Two arms of land around an inner sea: the Dondor arm in the north and east, the Goldoroth arm in the west and south, with the black tail of the Nothingness Peninsula. West of the Middle Lands.

| Item | Value |
| --- | --- |
| Climate | Cool, gloomy, overcast; coastal fog. |
| Seasons | Mild winters; mists. |
| Elevation profile | The Darkness ridge and the Goldoroth Mountains at 4 to 5; Dondor lowland 1. |
| Terrain targets | plains 22%, forest 30%, hills 15%, mountain 28%, marsh 3%, urban 2% |
| Provinces per state | 3 / 6 / 9 (min / typical / max), province area about 1100 pixels |
| Peoples | Dondor, Goldoroth, Bordon, Dreson, Dulundur, Troll Forest and orc holds. |
| Fertile areas | Dondor plain and the Giant River valley; little else. |
| Major ranges | The Darkness, Goldoroth Mountains |
| Natural borders | Dondor and Goldoroth: the Darkness ridge and the inner sea. Goldoroth and Bordon: the Goldoroth Mountains. Dark Lands and its neighbours: the two straits. |

- **Ranges.** The Darkness (a black ridge across the middle) and the Goldoroth Mountains. **Volcano.** Goldoroth Volcano.
- **Seas.** The Dark Sea, the Sea of Darkness (the inner sea, *placement proposed*), Dun Sea, Sea of Death, Gold Wides.
- **River.** The Giant River (drawn) along the foot of the Darkness; **forests** Dark Forests, Troll Forest, Fonoor.
- **Straits.** Northern Dark Strait to the North Lands; Southern Dark Strait to the Middle Lands. The vault says "narrow straits"; the model makes both sea-only crossings.

### Middle Lands

The centre of the world. A rounded land facing the Crown Ocean on the west. The Vale of Aenor fills the middle; the Great Lake lies in the south-west; the Great Wall bounds the east; Selen's wood fills the north-west; the Bloody Forest and the Organ cape close the north-east.

| Item | Value |
| --- | --- |
| Climate | Warm temperate, humid, long growing season. |
| Seasons | Mild; wet springs; light frost. |
| Elevation profile | Plains 1, Konori plateau 2, Wall belt 4 to 5 on the east. |
| Terrain targets | plains 50%, forest 20%, hills 12%, mountain 12%, marsh 2%, urban 4% |
| Provinces per state | 3 / 4 / 6 (min / typical / max), province area about 650 pixels |
| Peoples | Aenor and the Concord: Selen, Kilinti, Kingson, Hiloron, Konori, Hunhun, Herez; Cursed Lands and Bloody Forest apart. |
| Fertile areas | Erdae's richest land: the Vale of Aenor, the Great Lake shore, Novez Fields, Safeton, Hunhun Downs. |
| Major ranges | Great Wall of Aenor, Organ Mountains, Lunhrim, Gigantic Mountains, Crown Mountains, Hiloff Rim |
| Natural borders | Aenor and the Magical Lands: the Great Wall. Aenor and Selen: the River Selenar. Aenor and Hiloron: the Grano hills and River Hilorn. Aenor and Kingson: the Gigantic Mountains and the Great River gorge. Aenor and Bloody Forest: the Crown Mountains (north). Aenor and Herez and the Cursed Lands: the Grey Hills. |

- **Plains.** The Vale of Aenor, Hunhun Downs, Novez Fields, Safeton Coast, Konori Downs, Kingson Vale. This replaces the beige desert of the reference.
- **Rivers.** Aenar, the Great River (drawn), Selenar, Safen, Hilorn, Konorar (all *proposed* except the Great River).
- **Lake.** The Great Lake: about 205 by 200 pixels, four lobes.
- **Forests.** Selen Weald, Kilinti Forests, Bloody Forest, Hiloron Woods, Safeton Wood, Crown Forest, Stone Forest, Kingdom Forests.
- **Hills.** Hiloff Rim along the west coast, the Grano and Deodolor hills, the Grey Hills in the south.
- **Wall.** See section 3.

### Aenor Isle

A small isle west of the Middle Lands: Asgard in the west, Rish in the middle, Tinta Hills in the east. Asgard Sound is 130 pixels wide.

| Item | Value |
| --- | --- |
| Climate | Warm maritime. |
| Seasons | Mild. |
| Elevation profile | Low 1 to 3. |
| Terrain targets | plains 50%, forest 20%, hills 25%, urban 5% |
| Provinces per state | 2 / 3 / 4 (min / typical / max), province area about 500 pixels |
| Peoples | Asgard and the isle houses. |
| Fertile areas | All of it. |
| Major ranges | Tinta Hills |
| Natural borders | The isle is its own border. |

### Magical Lands

East of the Middle Lands on the same landmass. The Wall belt on the west; the Magic Mountains' snow ridges behind it; the Magical Forest, the Mushroom Forest and the rift coast to the east; the Herrodon Mountains along the north rim; the Zilin Hills in the south.

| Item | Value |
| --- | --- |
| Climate | Cool temperate, damp, mist. |
| Seasons | Equable; enchanted warmth in the forest. |
| Elevation profile | Magic Mountains and the Wall belt 4 to 5, Herrodon Mountains 5, forest basin 2. |
| Terrain targets | forest 45%, plains 15%, hills 15%, mountain 22%, marsh 3% |
| Provinces per state | 3 / 6 / 10 (min / typical / max), province area about 1400 pixels |
| Peoples | Twenty-one elven realms: Magical Forest, Herrodon, Andos Enda, Nolorim and others; mycids; the Worshipdom in the Zilin Hills. |
| Fertile areas | Forest clearings, the Teste Vale, the Elwen river and the rift shore. |
| Major ranges | Magic Mountains, Herrodon Mountains, Lustras Hills, Nolorim Heights, Dragon Mountain |
| Natural borders | Magical Lands and Middle Lands: the Great Wall. Herrodon and Andos Enda: Andos Water. The Magical Forest and the Mushroom Forest: the Elwen River. Nolorim and the Worshipdom: the Lake of Mirolon. Magical Lands and the East Lands: the Rift. |

- **Ranges.** Magic Mountains (three ridges), Herrodon Mountains (massive, elevation 5), Lustras Hills, Nolorim Heights, Cursed Mountains, Dragon Mountain.
- **Forests.** Magical Forest (with Living Forest and Fallen Forest), Mushroom Forest, Zilin Forests, Forests of Darkhere.
- **Rivers.** Elwen River (through the Magical Forest to the rift), Andos Water (Herrodon and Andos Enda border), Lozo Water, Teste Brook (all *proposed*). **Lakes.** Lake Lozo, Lake of Mirolon.
- **Sites.** Dragon Mountain; the Zilin Hills with three valleys; the Boundary Groves; Nolorim's high passes.

### Zol's Mistake

A vast black wasteland at the north edge and every black island of the Ocean of Zol. The black oval of Šodolôrō lies in the middle of the ocean.

| Item | Value |
| --- | --- |
| Climate | Cold, still, ashen; no seasons to speak of. |
| Seasons | Dim year-round; black frost. |
| Elevation profile | Barren plateau 1 to 2, the Barren Crown ridge 3. |
| Terrain targets | plains 55%, hills 15%, desert 20%, mountain 8%, marsh 2% |
| Provinces per state | 8 / 12 / 16 (min / typical / max), province area about 3500 pixels |
| Peoples | Almost none; the dead roam. Furviatlon is a town. |
| Fertile areas | None. Settlement only at Furviatlon and the island of Šodolôrō. |
| Major ranges | The Barren Crown |
| Natural borders | The Ocean of Zol is the only border; every black island belongs to the Mistake. |

- **Terrain.** Black rock, ash and dust plains; the Barren Crown (*proposed*) is a low ridge. Population and infrastructure are near zero outside Furviatlon.
- **Edge.** The Ashen Cliffs close the north edge.

### East Lands

East of the rift, running off the east and south edges. A snow coast in the north (Woqood), the Hot Lake basin in the middle, the Noris Desert south of it, the Melty Mountains on the east edge, and the Hellfire Range with its volcanoes in the south-east.

| Item | Value |
| --- | --- |
| Climate | Arid to semi-arid; hot summers; snow on the north coast; volcanic south-east. |
| Seasons | Dry; monsoon rains on the Hot Lake. |
| Elevation profile | Hot Lake basin 1; Melty, Hellfire and Hardtmuth ranges 5; volcanoes 5. |
| Terrain targets | plains 22%, desert 30%, hills 13%, mountain 20%, forest 10%, marsh 2%, jungle 1%, urban 2% |
| Provinces per state | 3 / 5 / 8 (min / typical / max), province area about 1300 pixels |
| Peoples | Noris, Stabilo, Gondolin, Drak, Alerhia, Miaed, Avalon, Mora, Ostoroth. |
| Fertile areas | The Hot Lake shore, Mora, Ernois, Delbiz Grasslands, the Gondolin coast and the caravan oases. |
| Major ranges | Melty Mountains, Woqood Alps, Hardtmuth Mountains, Hellfire Range, Pego Mountains, Drak Mountains, Ernois Mountains, Reeto Heights |
| Natural borders | Noris and Stabilo: the Noris Rise and the Flaming Forests. Noris and Gondolin: the Fosoco River and the Woqood Alps. Stabilo and Drak: the Drak Mountains. East Lands and the Magical Lands: the Rift Sea. |

- **Mountains.** Melty, Woqood Alps, Hardtmuth, Hellfire, Pego, Drak, Ernois, Reeto Heights, Noris Rise.
- **Volcanoes.** Mount Ergo, Mount Argon, Avalon Fires, Plutondo Vents, Drak Furnace, Pego Cones, Hardtmuth Fire, Fire Mountain, Reeto Fire.
- **Lake.** Hot Lake, about 330 by 315 pixels. **Rivers.** Gondolin, Fosoco, Mora, Meltwater (all *proposed*) and the dry Noris Wadi.
- **Roads.** The five caravan roads (*proposed*): Salt, Gold, Rift, Lake, Sand.
- **Rift.** The Rift Narrows (about 200 pixels) is the one crossing for the eastern coalition.

### South Lands

The great desert of the East Lands, running off the south edge: the Sun Desert lobe in the south-west with its coast on the Ocean of the Sun, and the southern belt of the Noris Desert.

| Item | Value |
| --- | --- |
| Climate | Hyper-arid desert; scorching. |
| Seasons | Two seasons: hot and burning. |
| Elevation profile | Dune sea 1 to 2; the Hardtmuth foothills 3. |
| Terrain targets | desert 70%, plains 12%, hills 10%, mountain 6%, urban 2% |
| Provinces per state | 6 / 9 / 14 (min / typical / max), province area about 3000 pixels |
| Peoples | Caravan peoples, oasis keepers; Miaed on the south shore. |
| Fertile areas | Oases and the western coast road only. |
| Major ranges | Hardtmuth Mountains (south end) |
| Natural borders | The Ocean of the Sun on the west; the Hardtmuth chain on the east. |

- The Sun Desert (the owner renamed the drawn Sunhot Desert label on 19 October) is a dune sea with scattered oases. The Hardtmuth chain bounds it on the east.

### Dead Lands

An island group south of the Middle Lands behind a storm belt: the main island (Demon, Dolon, Nafeher's plateau, Nezer), the Nether island to the south (*added*), and Mirolon on the southern neck of the central landmass.

| Item | Value |
| --- | --- |
| Climate | Hot, dry, storm-lashed coast; oppressive heat inland and south. |
| Seasons | Storm season year-round on the coasts. |
| Elevation profile | Volcanic ridges 5, grey plateau 2, chasms. |
| Terrain targets | hills 25%, mountain 30%, desert 20%, forest 10%, plains 10%, marsh 5% |
| Provinces per state | 3 / 5 / 8 (min / typical / max), province area about 900 pixels |
| Peoples | Volgan at Nafeher; Demon, Dolon, Nezer; Mirolon (free); the Nether and the Abyss. |
| Fertile areas | Mirolon's forest and marsh; elsewhere little. |
| Major ranges | Mirolon Mountains, Demonic Mountains, Nether Mountains, Nan Mountains |
| Natural borders | Mirolon and Volgan: Mirolon Sound. The Dead Lands island is bounded by the Tempest Reach. |

- **Storm coast.** The Tempest Reach (*proposed*) rings the islands: attrition and port limits (magic spec).
- **Mountains.** Demonic Mountains, Nether Mountains, Mirolon Mountains, Nan Mountains. **Volcanoes.** Demonic Fire, Nether Maw, Mount Nether.
- **The Abyss.** A chasm at the east tip of the main island. **The Nether.** The volcanic island to the south.
- **Mirolon.** Forest, marsh and a neck of land; the sea of Mirolon Sound lies between it and Volgan's island.

### Islands of the South

Two arcs of small islands south of the West Lands: Verde in the west, Enhis Is Rond (the ring island) in the middle, Howan and Nara in the east.

| Item | Value |
| --- | --- |
| Climate | Tropical oceanic. |
| Seasons | Warm; trade-wind seasons. |
| Elevation profile | Low islands 1 to 3. |
| Terrain targets | plains 40%, forest 30%, hills 12%, jungle 10%, marsh 4%, mountain 4% |
| Provinces per state | 1 / 2 / 3 (min / typical / max), province area about 500 pixels |
| Peoples | Howan, Nara, Verde, Enhis Is Rond; hospitable fisherfolk. |
| Fertile areas | All lagoon shores. |
| Major ranges | Wide Mountains |
| Natural borders | Each island is its own border. |

- **Journey sites.** Howan is the wreck island; the shrine beneath the tide lies off the southern shore of Enhis Is Rond; the night reef lies off Nara. All three placements are *proposed*.

### Lands of the Sun

A corner landmass in the far south-west that runs off the south edge, with the Ihuy Islands to the north.

| Item | Value |
| --- | --- |
| Climate | Warm temperate to subtropical; sunny. |
| Seasons | Long dry summers, short mild winters. |
| Elevation profile | Sun and Sukro Mountains 4; volcanoes 4 to 5. |
| Terrain targets | plains 40%, forest 22%, hills 15%, mountain 12%, desert 2%, jungle 5%, marsh 4% |
| Provinces per state | 2 / 3 / 5 (min / typical / max), province area about 800 pixels |
| Peoples | Sunhot elves, Gala elves, Goodin sunfolk; many small realms. |
| Fertile areas | Sun Grasslands, the Good Volcanoes' ash soils, Sun Lake. |
| Major ranges | Sun Mountains, Sukro Mountains |
| Natural borders | The Sun Mountains and Sukro Mountains split the realms; the Sea of Gods bounds the north. |

- **Mountains.** Sun and Sukro Mountains. **Volcanoes.** Great Volcano (on Hol), Good Volcanoes (two cones). **Forests.** God Forest, Hot Forest. **Plains.** Sun Grasslands. **Lake.** Sun Lake.
- **Sites.** Gala (Lorien's court) with the Mirror of First Rain (*proposed*); Sun Gate; Heaven, Flame, Godland, Elvana, Igara, Hengyang. The Sea of Gods lies off the north-east shore.

### Resource-bearing areas (*proposed*)

The politics step may rebalance these. They follow the rock and climate.

| Resource | Where | Why |
| --- | --- | --- |
| Steel and coal | Goldoroth Mountains and the Darkness (Dark Lands); Cold Mountains (Cold Lands); Herlitz range (West Lands) | Old iron-bearing ridges |
| Chromium | Hardtmuth Mountains; Herrodon Mountains | Volcanic and ultramafic rock |
| Tungsten | Giant and Gigantic Mountains (the Wall belt) | Granite spine; Aenor holds the Aenor side |
| Aluminium | Hellfire Range and Pego Mountains | Weathered volcanic slopes |
| Oil | Noris Desert and the Dead Lands plateau | Sunken basins |
| Rubber | Obmi Jungle, Hot Forest (Lands of the Sun), the Ihuy islands | The only jungles |
| Food and manpower | Vale of Aenor, Hunhun Downs, Novez Fields, Mora, Sun Grasslands | See section 5 |
| None | Zol's Mistake outside Furviatlon | Barren by the vault |

## 3. Key sites

Each row gives the placement rule and what the map must hold. Coordinates are in the world frame. The site spec ([02_key_sites.md](02_key_sites.md)) resolves scripts by name, so a rebuilt map changes one generated file.

| Site | Status | Position | Placement rule and terrain demands |
| --- | --- | --- | --- |
| The Great Lake | established place; shape *proposed* | 0.600, 0.620 (3072, 1587) | A lake of 200 by 200 pixels, four lobes, polygon `lake_great_lake`. At least eight lake provinces. Three or more coastal victory points on its shore (ports on all four sides). Fed by the Aenar and the Great River, drained south by the Safen. Parim on the north shore. It is the heart of Aenor and must be unmistakable on every map mode. |
| The Great Wall of Aenor | established; course *proposed* | spine from 3308, 1070 to 3313, 1848 | Continuous mountain barrier, elevation 5, core about 60 pixels wide and 150 to 250 pixels with its flanking ranges and foothills (the zone is 300 pixels wide), from the Organ cape on the Narrow Strait to the south coast. No gaps except four gates. A fort line on the Aenor side with level-5 forts. Terrain: mountain with hills foothills. It separates the Middle Lands from the Magical Lands and has no "horn" into the Magical Lands. |
| Organ Mountains | established; place *proposed* | 0.648, 0.440 (3318, 1126) | North end of the Wall: basalt columns reaching the sea at the Organ cape. Elevation 5. |
| Lunhrim | established; place *proposed* | 0.662, 0.517 (3389, 1324) | The great fortress massif of the Wall between the Organ Mountains and Kingson. Elevation 5; the highest ground of the Wall belt on the Aenor side. |
| Kingson | established | 0.654, 0.585 (3348, 1498) | The capital sits in the Kingson Vale (uplands, elevation 2), a valley ringed by mountains on all four sides: Lunhrim and the Organ Mountains north, the Magic and Dragon mountains east, the Crown Mountains south, the Gigantic Mountains west. One gorge (the Great River) leads west to the Great Lake; the Kingson Gate leads east. This answers "Kingson should be ringed by mountains". |
| Dragon Mountain | established | 0.656, 0.655 (3359, 1677) | A massif of elevation 5 at the south-east corner of the Kingson ring, just east of the wall line (Magical Lands side). Three roost spurs. Not a country. A state of its own, owned by the nearest elven realm. |
| Parim | established seat; place *proposed* | 0.598, 0.572 (3062, 1464) | North shore of the Great Lake on a lake bluff where the River Aenar enters. The palace cliff over the water is the same state. The largest city; victory point 50. Plains all round. |
| Selen | established | 0.588, 0.482 (3011, 1234) | Edge of the Selen Weald by the River Selenar. Forest, hills, glades. |
| The Abyss | established; place *proposed* | 0.619, 0.893 (3169, 2286) | A deep chasm at the east tip of the Dead Lands island (the vault leaves its position open; the model picks "geographically accessible chasm" from the vault's alternatives). A hill province ring with a sheer rim. It is **not** the Void and **not** the Nether. |
| The Nether | established; place *proposed* | 0.600, 0.935 (3072, 2394) | Volcanic island south of the Dead Lands island, seat of the King of Demons. The reference has no land there; the rebuild adds the island `land_nether_island` (about 270 by 80 pixels). Sea of Lava around it. |
| Šodolôrō (Šodolôro in game text) | established | 0.690, 0.298 (3533, 763) | The black oval island in the middle of the Ocean of Zol. Written Šodolôro in game text. A victory point in Zol's Mistake. |
| Furviatlon | established working seat | 0.766, 0.168 (3922, 430) | South coast of the Mistake facing the Ocean of Zol. At most a town. Barren rock around it. |
| Zilin Hills | established | 0.691, 0.705 (3538, 1805) | Brown hills south of the Magical Forest, elevation 3, with three valleys for the Worshipdom. The Lake of Mirolon lies on their west. |
| Narrow Strait | established; place *proposed* | line from 2995, 1070 to 3302, 1096 | Between R'en's south cape and the Organ cape of the Middle Lands. 40 to 60 pixels at its narrowest. Sea crossing only. Naval bases at Sonargur and on the Aenor side. The owner has not confirmed the place; the proposal stands (short list 3). |
| Bloody Forest | established | 0.630, 0.436 | Dense dark wood on the north-east coast beside the Organ Mountains. Resists Aenor. Forest with a hill under it. |
| Sun Desert | established; renamed | 0.700, 0.890 (3584, 2278) | A dune sea in the south-west lobe of the East Lands, running off the south edge. Desert terrain; oases on the Sand Road. The coast faces the Ocean of the Sun. |
| Castle of Yeldenne at Mp'E | established; place *proposed* | 0.188, 0.093 (963, 238) | Frozen north of the Cold Lands, in a high valley between the Yeldenne Heights and the Isengar Mountains. State named Mp'E. |
| Dardan | established; place open | not placed | **Do not place.** No feature, label or victory point may be named Dardan. See `unplaced` in the JSON. |
| East Lands volcanoes and ranges | drawn and *proposed* | Hellfire Range spine from 4378, 2342 to 5059, 2202 | The greatest mountain mass of Erdae: elevation 5, core about 110 pixels wide with foothills to 280. Nine volcanoes (Ergo, Argon, Avalon, Plutondo, Drak, Pego, Hardtmuth, Fire Mountain, Reeto). Melty Mountains run along the east edge; the Hardtmuth chain on the south-west. |
| Dead Lands storm coast | established | polygon `sea_tempest_reach` | A storm belt round the Dead Lands islands, `kind: storm_belt` (about 600 pixels across). Port capacity and attrition modifiers come from the magic spec; fleets need a storm-hardened port. |
| Pupor Ocean | established | 0.068, 0.610 | The sea inside the Triton arcs. Sheltered, shallow, ringed by islands. |
| Sea of Darkness | established; reading open | 0.500, 0.466 | The inner sea of the Dark Lands between the Dondor arm and the Goldoroth arm. The drawn grey island of that name is a separate land (the model calls the whole body the Gulf of Darkness). The owner has not said whether it opens to other seas; it opens to the Crown Ocean through the Dark Channel. |
| Sea of Gods | established | 0.135, 0.935 | The warm pale sea on the north-east shore of the Lands of the Sun. Placement *proposed*. |
| Ocean of Zol | established | 0.790, 0.250 | The ocean between Zol's Mistake and the Herrodon coast, scattered with black islands. |
| Gala and the Mirror of First Rain | Gala established; Mirror *proposed* | 0.094, 0.950 (481, 2432) | Court of Lorien on the mainland of the Lands of the Sun; the Mirror is a spring in an old elven courtyard. |
| Mirolon passes | *proposed* | 0.664, 0.775 | The passes that close the Mirolon neck. The vault says Volgan takes Mirolon's northern passes; on the map Mirolon is a peninsula, so the passes close its northern neck and a sea crossing (Mirolon Sound) separates it from Volgan. |

Other gates and forts of the Wall: Kingson Gate (0.676, 0.575), Organ Coast Road (0.640, 0.424), South Gate (0.653, 0.690), Lunhrim Notch (0.663, 0.500). Each has a level-5 fort on its Aenor side (`site_great_wall_*_fort`).

## 4. Why the land looks like this (geography and history)

Everything in this table is *proposed* unless marked, and links geography to the vault's history. It does not close open questions.

| Feature | Proposed reason | Vault link |
| --- | --- | --- |
| The Great Wall | Elzon's Order raised a fortified line (the Pale March) against the Magical Lands; the Wall Accord of 4A 96 kept it and rebuilt it in stone | *The Campaign of 4A 1748*, *Fourth Age Chronology* (proposed in the vault) |
| The Vale of Aenor | Second Age irrigation, crop rotation and soil cures made the plain the richest farmland in Erdae; Varner cleansed the Third Age grave-fields | *Fourth Age of Erdae* prologue |
| The wide central sea | Aenor's rule over the West Lands always depended on ships and ports | *First Age*, *Fourth Age Map* |
| The Dead Lands storm belt | Fierce storms at sea and heat to the south kept First Age explorers out | *Volgan's Dead Lands* |
| Zol's Mistake | A black wasteland that existed before Aen; the reason is not explained | *Zol's Mistake* (open) |
| The rift sea | A long sea between the Magical Lands and the East Lands | *Erdae and Its Regions* |
| Dardan | Not placed; the First Age note proposes a plain in the southern approaches of the Middle Lands | *First Age* (proposal only) |
| The Hellfire Range | A great volcanic mass at the south-east edge; the drawn lava ocean | owner's drawing |

## 5. Fertility and population logic

People live where there is water, flat ground, a harbour or a pass. The rasteriser sets population density, infrastructure and state size from these rules.

| Rule | Effect | Examples |
| --- | --- | --- |
| River valleys and lake shores are the densest | Population ×2 within 40 pixels of a river of width 2 or more or a lake | Aenar, Great River, the Great Lake shore, Kulolo, Hot Lake |
| Alluvial and loess plains | Fertility high or very high; states of 3 to 4 provinces | Vale of Aenor, Hunhun Downs, Novez Fields, Safeton, Mora, Eekedor Vale, Teste Vale |
| Coasts with a natural harbour | A port victory point every 150 to 250 pixels | Safeton, Sonargur, R'en, Asgard, Poloto, Varnondor |
| Passes and fords | A fortified town at each | Kingson Gate, Great River Gorge, the Grey Ford, the Neck Road |
| Dense forest, high mountain, dune sea, snow and black waste | Thin: half density and states of 8 to 12 provinces | The West Wood, Magical Forest (elven villages only), Sun Desert, Zol's Mistake |
| Oases and meltwater | Small bright spots in deserts | Noris Wadi, Hot Lake, the Sand Road |

## 6. Natural borders

Country and state borders follow these lines. A border may leave a line only to keep a city whole.

| Border | Natural line |
| --- | --- |
| Cold Lands | Coldor and Isengard: the Fandan River and the Isengar Mountains. |
| Cold Lands | Coldor and Horidor: the Naepu ridge and the Naepu River. |
| Cold Lands | Cold Lands and West Lands: the Neridor Mountains and the Worlond Forest belt; the Neck Road is the only road. |
| Windwaith arm (Cold Lands) | The arm is bounded by the Pandar sea and the Triton's Ocean; it joins the Cold Lands over the sea only by the ice in winter. |
| West Lands | Gunwaith and Girdon: the Grey River, crossed at the Grey Ford. |
| West Lands | Girdon and Buldor: the Fog and Eye ridge. |
| West Lands | Girdon and Saopon: the Kulolo River. |
| West Lands | Corogon and Varnondor: the strait of 40 pixels between their peninsulas. |
| Triton's Islands | Every island is its own border; the arcs enclose the Pupor Ocean. |
| North Lands | North Lands and Middle Lands: the Narrow Strait. |
| North Lands | North Lands and Dark Lands: the Northern Dark Strait. |
| North Lands | Lerenwaith and Lerendor: the Loron highland. |
| Dark Lands | Dondor and Goldoroth: the Darkness ridge and the inner sea. |
| Dark Lands | Goldoroth and Bordon: the Goldoroth Mountains. |
| Dark Lands | Dark Lands and its neighbours: the two straits. |
| Middle Lands | Aenor and the Magical Lands: the Great Wall. |
| Middle Lands | Aenor and Selen: the River Selenar. |
| Middle Lands | Aenor and Hiloron: the Grano hills and River Hilorn. |
| Middle Lands | Aenor and Kingson: the Gigantic Mountains and the Great River gorge. |
| Middle Lands | Aenor and Bloody Forest: the Crown Mountains (north). |
| Middle Lands | Aenor and Herez and the Cursed Lands: the Grey Hills. |
| Aenor Isle | The isle is its own border. |
| Magical Lands | Magical Lands and Middle Lands: the Great Wall. |
| Magical Lands | Herrodon and Andos Enda: Andos Water. |
| Magical Lands | The Magical Forest and the Mushroom Forest: the Elwen River. |
| Magical Lands | Nolorim and the Worshipdom: the Lake of Mirolon. |
| Magical Lands | Magical Lands and the East Lands: the Rift. |
| Zol's Mistake | The Ocean of Zol is the only border; every black island belongs to the Mistake. |
| East Lands | Noris and Stabilo: the Noris Rise and the Flaming Forests. |
| East Lands | Noris and Gondolin: the Fosoco River and the Woqood Alps. |
| East Lands | Stabilo and Drak: the Drak Mountains. |
| East Lands | East Lands and the Magical Lands: the Rift Sea. |
| South Lands | The Ocean of the Sun on the west; the Hardtmuth chain on the east. |
| Dead Lands | Mirolon and Volgan: Mirolon Sound. |
| Dead Lands | The Dead Lands island is bounded by the Tempest Reach. |
| Islands of the South | Each island is its own border. |
| Lands of the Sun | The Sun Mountains and Sukro Mountains split the realms; the Sea of Gods bounds the north. |
| Aenor and the Dark Lands | The Southern Dark Strait (sea only) |
| Mirolon and Volgan | Mirolon Sound (sea only) |
| Worshipdom | The ring of the Zilin Hills; the Lake of Mirolon on its west |

## 7. Names

**Established** names are in the vault or on the owner's drawn sheets. A drawn name with an uncertain reading has the uncertainty in its record. **Proposed** names are created for this model in the style of the region. Spelling follows the vault (Kilinti, Dreson, Troll Forest, Šodolôrō).

### Established names (vault and drawings)

| Kind | Names |
| --- | --- |
| Seas and oceans | Amarelo Seas, Cold Ocean, Demonic Sea, Dun Sea, Gold Wides, Gorlab Sea, Great Sea of the Leviathan, Ihuy Seas, Kradlon Ocean, Leren Ocean, Mushroom Seas, Ocean of Peace, Ocean of Zol, Ocean of the Sun, Onp Ocean, Pandar, the Frozen Seas, Pupor Ocean, Rim Ocean, Santon Ocean, Sea of Darkness, Sea of Death, Sea of Deaths, Sea of Gods, Sea of Lava, Sea of Mernon, Sea of Monsters, Sea of Nazerch, Seas of Lemo, Seas of Lusain, Sharp Seas, Siroler Seas, The Blue Sea, The Dark Sea, The Dead's Sea, The Frozen Ocean, The Left Sea of Dolon, The Long Sea, The Magical Ocean, The Seas of Light, Triton's Ocean, Windy Seas |
| Mountain ranges | Adel Mountains, Benan Mountains, Black Hills, Bolpor and Boldor Mountains, Cold Mountains, Coldor Mountains, Corogon Highlands, Crown Mountains (north), Crown Mountains (south arc), Cursed Mountains, Demonic Mountains, Deodolor Hills, Dragon Mountain, Drak Mountains, Dusty Mountains, Erg Mountains, Etonia and Renann Mountains, Fog and Eye Mountains, Giant Mountains, Gigantic Mountains, Goldoroth Mountains, Grano Mountains, Great Wall of Aenor, Hardtmuth Mountains, Hendair Hills, Herlitz Mountains, Herrodon Mountains, Hiloff Rim, Icy Mountains, Isengar Mountains, Loron Mountains, Lunhrim, Lustras Hills, Magic Mountains (middle ridge), Magic Mountains (south ridge), Magic Mountains (wall section), Magic Mountains (west ridge), Melty Mountains, Mirolon Mountains, Nan Mountains, Neridor Mountains, Nether Mountains, Olsuaon Massif, Organ Mountains, Pego Mountains, Raerby and Hapos Mountains, Solondor Mountains, Sukro Mountains, Sun Mountains, The Darkness, The Grey Hills, Tinta Hills, Wely and Fair Mountains, Wide Mountains |
| Volcanoes | Avalon Fires, Goldoroth Volcano, Good Volcanoes, Good Volcanoes (second cone), Great Volcano, Hardtmuth Fire, Mount Argon, Mount Ergo, Plutondo Vents |
| Rivers | Kulolo River, River Tich, The Giant River, The Great River |
| Lakes | Ergo Sea, Evian Sea, Hot Lake, Ilurdor Sea, Lake Lozo, Lake of Mirolon, Sea of R'en, Semi Sea, Soun Lake, Sun Lake, The Great Lake |
| Forests | Alerhia Woods, Bloody Forest, Cologon Forest, Dark Forests, Death Forest, Dwarc and Swy Forests, Eagle Forest, Enhis Forest, Fallen Forest, Flaming Forests, Fonoor and Giant Forests, Forests of Darkhere, God Forest, Hell Forest, Hiloron Woods, Hot Forest, Kilinti Forests, Kingdom Forests, Light Forests of Yang, Living Forest, Magical Forest, Mirolon Forests, Mora Woods, Mushroom Forest, Obmi Jungle, Oreton Woods, Safeton Wood, Stone Forest, Swamp Forests, Taith Forests, Troll Forest, Worlond Forest, Zilin Forests |
| Deserts and wastes | Alodale Desert, Black Islands of the Ocean of Zol, Cursed Lands, Isle of Šodolôrō, Noris Desert, Sun Desert, The Deadlands, Zol's Mistake |
| Marshes | Papz Swamp, Saeton Swamp, The Great Swamp of Mirolon, Verde Mangroves |
| Snowfields | Frozen Lands of Coldor, Lerenwaith, North Yeti Lands, Windwaith, Woqood |
| Plains | Delbiz Grasslands, Greenland, Hunhun Downs, Konori Downs, Mora and Ernois Coast, Novez Fields, Poloto, Rish, Ronbo Grasslands, Safeton Coast, Sun Grasslands, Teste Vale, Thenon, Ulgus Glades, Zuman Uplands |
| Hills | The Abyss, Yeti Lands, Zilin Hills |
| Straits | Northern Dark Strait, Southern Dark Strait, The Narrow Strait, The Rift Narrows |
| Passes | Dark Gate, Path of Dark |
| Capes, gulfs, bays, peninsulas | Cape Tinton, Corogon Peninsula, Isemkei Bay, Kradlon Peninsula, Mirolon Peninsula, Poloto Head, The Cursed Square, Varnondor Peninsula, Wonderland Point |
| Sites and places | Adel, Alerhia, Andos Enda, Asgard, Avalon, Bordon, Castle of Yeldenne, Cocanoor, Demon and Dolon, Dragon Mountain, Drak, Dreson, Dulundur, Eekedor, Elvana, Enhis Is Rond, Fandanar, Flame, Furviatlon, Gala, Girdon, Godland, Gondolin, Gunwaith, Heaven, Hengyang, Herez, Herrodon, Hiloron, Horidor, Hot Lake, Howan, Hunhun, Igara, Isengard, Kilinti, Kingson, Konori, Kradlon, Magical Forest, Miaed, Mirolon, Mora, Mushroom Forest, Nafeher, Nan, Nara, Nezer, Nolorim, Nondondor, Noris, Notbuton, Ostoroth, Parim, Pollos, Postondoroth, R'en, Raerby, Safeton, Selen, Sonargur, Stabilo, Sun Desert, Sun Gate, The Abyss, The Nether, Verde, Zilin Hills, Šodolôrō |

### Proposed names

| Kind | Names |
| --- | --- |
| Seas and oceans | Crown Ocean, The Tempest Reach, Western Dark Strait |
| Mountain ranges | Ernois Mountains, Hellfire Range, Nolorim Heights, Noris Rise, Reeto Heights, The Barren Crown, Titanos Heights, Woqood Alps, Yeldenne Heights |
| Volcanoes | Demonic Fire, Drak Furnace, Fire Mountain, Mount Nether, Nether Maw, Pego Cones, Reeto Fire |
| Rivers | Adel Burn, Andos Water, Ashwater, Dondor Water, Elwen River, Fandan River, Fosoco River, Furvi Run, Gil'dul Water, Gondolin River, Grey River, Konorar, Leren River, Lozo Water, Meltwater River, Naepu River, Noris Wadi, Orewell Water, R'en Water, River Aenar, River Hilorn, River Mirolon, River Mora, River Safen, River Selenar, Ronbo Water, Sunwater, Teste Brook |
| Lakes | Cold Tarn |
| Forests | Crown Forest, Gondolin Wood, Selen Weald, The West Wood |
| Deserts and wastes | Plutondo Dunes |
| Marshes | Dondor Fen, Eekedor Reeds, Hot Lake Reeds, Kulolo Fen, Sun Lake Shallows, Zilin Fens |
| Snowfields and edges | Snowfields of the Cold Lands, The Ashen Cliffs, The Hoarfrost Barrier, The Roof Cliffs |
| Plains | Eekedor Vale, Gondolin Coast, Gunwaith Downs, Kingson Vale, The Vale of Aenor |
| Straits | Asgard Sound, Coldor Channel, Corogon Narrows, Dark Channel, Mirolon Neck, Mirolon Sound, Mouth of the Leren Ocean, North Mouth of the Rift, Pollos Passage |
| Passes | Dondor Pass, Fog Gap, Great River Gorge, Hardtmuth Pass, Isengar Pass, Kingson Gate, Lunhrim Notch, Melty Pass, Mirolon Passes, Neridor Gap, Nolorim East Pass, Nolorim West Pass, Noris Gap, Organ Coast Road, South Gate, The Boundary Groves, The Grey Ford, The Neck Road |
| Capes, gulfs, bays, peninsulas | Abyss Point, Bay of Kradlon, Bay of Safeton, Cape of Elvana, Delbiz Bay, Dondor Head, Furviatlon Cape, Gondolin Cape, Gulf of Darkness, Gulf of Minnolomak, Hellfire Gulf, Herrodon Head, Hiloron Head, Mushroom Head, Nothingness Peninsula, Novez Bay, Organ Cape, R'en Cape, Selen Point, Sonargur Point, The Night Reef |
| Roads | The Gold Road, The Lake Road, The Rift Road, The Salt Road, The Sand Road |
| Sites and places | Bridge of the Three Oaths, Eindil's Ice, Girdon's Winter Ford, Great Lake port (east shore), Great Lake port (north shore), Great Lake port (south shore), Great Lake port (west shore), Kingson Gate Fortress, Lunhrim Fortress, Mirror of First Rain, North Wall Fort (Organ), South Gate Fortress, The Landing below Mp'E, The Palace Cliff, The Three Valleys, The shrine beneath the tide, Varnondor staging port |

Renames. The owner renamed the drawn Sunhot place labels to Sun Desert, Sun Gate and Sun Grasslands on 19 October. The drawn Rush Ocean, Rush Mountains and Rush Forest carry the superseded name Rush; the model proposes Crown Ocean, Crown Mountains and Crown Forest (owner question 10 of the names spec). The old records keep the superseded name as `alias`.

## 8. Coordinates

Geometry types in `geometry`: `Point` (a coordinate pair), `LineString` (rivers, ranges, straits, roads, passes), `Polygon` (one outer ring, optional holes; rings are closed implicitly) and `MultiPolygon`. Ranges are lines with `halfWidth` (half of the mountain core, in x units) and `foothillFactor` 0.8 (the hills ring each side is 0.8 half-widths wide). Rivers carry `width` 1, 2 or 3. Every feature has `elevation` 0 to 5 (0 sea, 1 lowland, 2 upland, 3 hills, 4 mountain, 5 high peak).

Key ranges (spine ends in world coordinates):

| Range | Elevation | Half-width (px) | Ends |
| --- | ---: | ---: | --- |
| Cold Mountains | 5 | 34 | 0.250, 0.150 to 0.384, 0.070 |
| The Darkness | 4 | 34 | 0.490, 0.440 to 0.542, 0.519 |
| Goldoroth Mountains | 5 | 37 | 0.468, 0.462 to 0.510, 0.497 |
| Great Wall of Aenor | 5 | 31 | 0.646, 0.418 to 0.647, 0.722 |
| Organ Mountains | 5 | 43 | 0.646, 0.410 to 0.658, 0.478 |
| Lunhrim | 5 | 43 | 0.658, 0.478 to 0.671, 0.545 |
| Gigantic Mountains | 5 | 37 | 0.650, 0.498 to 0.640, 0.652 |
| Giant Mountains | 5 | 37 | 0.662, 0.648 to 0.649, 0.723 |
| Dragon Mountain | 5 | 43 | 0.656, 0.642 to 0.664, 0.668 |
| Herrodon Mountains | 5 | 40 | 0.663, 0.398 to 0.726, 0.372 |
| Demonic Mountains | 5 | 31 | 0.585, 0.845 to 0.594, 0.887 |
| Nether Mountains | 5 | 31 | 0.600, 0.880 to 0.622, 0.893 |
| Melty Mountains | 5 | 34 | 0.975, 0.520 to 0.990, 0.720 |
| Hardtmuth Mountains | 5 | 40 | 0.752, 0.805 to 0.780, 0.935 |
| Hellfire Range | 5 | 55 | 0.855, 0.915 to 0.988, 0.860 |

## 9. Mapping onto HOI4

| Feature | HOI4 result |
| --- | --- |
| plains | plains (fertility field raises supply and population) |
| forests | forest (density dense or fungal = forest; jungle = jungle) |
| ranges | mountain at the spine (elevation 4 to 5), hills in the foothill ring of 2.2 half-widths (elevation 3) |
| hills | hills |
| deserts | desert (kind black_waste and dust_plateau paint plains or hills with a black or grey ground texture) |
| marshes | marsh |
| ice | plains in a snow climate (HOI4 has no ice terrain; snow comes from the strategic region weather); cliffs at map edges are impassable |
| lakes | lakes province type |
| seas | ocean province type |
| volcanoes | mountain with a lava ground texture (elevation 5) |

Paint order: ocean, lakes, plains, desert, marsh, forest, hills, mountain, then rivers, then urban; later wins.

River width classes: 1 = river width 1 (narrow river); 2 = width 3; 3 = width 6 plus wider mouth.

### Province density

| Region | Provinces per state (min / typical / max) | Province area (px) |
| --- | --- | ---: |
| Cold Lands | 5 / 8 / 12 | 2400 |
| Windwaith arm (Cold Lands) | 6 / 9 / 12 | 2400 |
| West Lands | 3 / 5 / 8 | 1100 |
| Triton's Islands | 2 / 3 / 5 | 700 |
| North Lands | 3 / 5 / 7 | 1000 |
| Dark Lands | 3 / 6 / 9 | 1100 |
| Middle Lands | 3 / 4 / 6 | 650 |
| Aenor Isle | 2 / 3 / 4 | 500 |
| Magical Lands | 3 / 6 / 10 | 1400 |
| Zol's Mistake | 8 / 12 / 16 | 3500 |
| East Lands | 3 / 5 / 8 | 1300 |
| South Lands | 6 / 9 / 14 | 3000 |
| Dead Lands | 3 / 5 / 8 | 900 |
| Islands of the South | 1 / 2 / 3 | 500 |
| Lands of the Sun | 2 / 3 / 5 | 800 |

Rule: Use region density.provincesPerState as the typical state size; inside a region make provinces 40 percent smaller (more provinces per state) on features with fertility high or very high and along coasts and the Great Lake shore, and 60 percent larger on wilderness (ice, black waste, dune sea, dense forest).

Seas: open ocean provinces of about 12,000 to 20,000 pixels; narrow straits, the Great Lake and sheltered seas use provinces of 1,500 to 4,000 pixels so a crossing is at least two provinces wide. Every strait in `straits` keeps at least two sea provinces across.

## 10. Changes the owner will see

1. The Great Lake becomes a real lake: about 240 by 215 pixels with four lobes and ports, instead of a 124 by 173 pixel blue patch.
2. The Vale of Aenor is plains and farmland, not beige desert: the dry yellow patches of the reference inside the Middle Lands are re-typed fertile plains.
3. The Great Wall of Aenor is a continuous mountain barrier of elevation 5 from the Organ cape to the south coast, with Lunhrim, the Kingson ring and four gates; Kingson sits in a valley ringed by mountains.
4. Rivers: 25 named rivers drawn from source to mouth, used as borders (Grey River, Fandan, Selenar, Aenar, Great River, Kulolo, Andos Water and others); lakes of every size are named.
5. Mountains and volcanoes are massive and named: the Hellfire Range with seven East Lands volcanoes, the Melty and Hardtmuth ranges, Herrodon Mountains, and the volcanoes of the Dead Lands; the map no longer wraps and has four impassable edges.

## 11. Implementation

| File | Content | Written by |
| --- | --- | --- |
| `tools/content/data/geography/erdae.json` | The machine-readable model | design data (this spec) |
| `docs/specs/01_map/05_geography_overlay.md` | How placement was checked; drawing artefacts | this spec |

A map rasteriser (not part of this spec) reads the JSON and writes the height, terrain, river and province inputs for the map rewrite. It never reads the owner's drawings. Site rules in [02_key_sites.md](02_key_sites.md) and the map accuracy table [01_map_accuracy.md](01_map_accuracy.md) resolve against the names here.

## 12. Acceptance

1. The JSON parses and every feature has `id`, `name`, `established`, `kind`, `elevation` and `geometry`.
2. Every polygon feature except lakes, seas, edges and the storm belt has at least 70 percent of its area on land of the layout.
3. The Great Lake is at least 150 by 150 pixels; the Wall is continuous from the Organ cape to the south coast; Kingson lies inside a closed ring of elevation 4 or 5.
4. No feature is named Dardan.
5. No wrap: the first and last pixel columns are edge provinces.
6. A rasterised check render shows no mountain on open sea, no river that leaves land, and no lake on the coast.

## 13. Open questions for the owner

Each proceeds on its proposal. Copies go to [OPEN_QUESTIONS.md](../OPEN_QUESTIONS.md) when this spec is integrated.

| # | Question | Proceeds on |
| --- | --- | --- |
| 1 | Is the game layout of 18 October (the cleaned 5,120 by 2,560 reference) the frame for the rebuild, with the working drawing used only for shapes? | Yes. The drawing frame is provided as a secondary field. |
| 2 | Where do the Organ Mountains and Lunhrim stand, and which side of the Wall is Kingson? | Organ Mountains at the north end on the Narrow Strait; Lunhrim mid-wall; Kingson inside a ring of mountains on the Aenor side; the Wall on the Magic Mountains' west foot. |
| 3 | Is the Narrow Strait the water between R'en and the Organ cape (short list 3)? | Yes. The two Dark Straits are the water between the Dark Lands and each neighbour; all three are sea-only crossings. |
| 4 | Is the Sea of Darkness an inland sea, and what is the drawn grey island of that name? | An inner sea that opens to the Crown Ocean; the grey island is a separate land. |
| 5 | What is the central sea called? | Crown Ocean (replaces the superseded Rush Ocean). |
| 6 | How big may the Great Lake be? | About 205 by 200 pixels (the reference shows 124 by 173). |
| 7 | Should the Dead Lands be larger? In the layout they are small (about 270 by 300 pixels for the main island). | Keep the layout; add the Nether island; scale only on the owner's word. |
| 8 | Is the Abyss a chasm, a hidden depth, or a boundary of magic? | A geographically accessible chasm at the east tip of the Dead Lands island. |
| 9 | Is Mirolon joined to Volgan's island by land? | No. Mirolon Sound separates them; Mirolon's passes close its northern neck. |
| 10 | Where are the Worshipdom's three valleys in the Zilin Hills? | Three valleys of the brown hills, with the Lake of Mirolon on the west. |
| 11 | Which island is Howan (the wreck), which has the shrine, which has the night reef? | Howan the wreck island; the ring island Enhis Is Rond the shrine; Nara the reef (all placements *proposed*). |
| 12 | How far does the South Lands desert reach? | The Sun Desert lobe and the Noris Desert south of the Hot Lake (the spec of 18 October proposed "desert states at or below row 1,550 of 2,560"). |
| 13 | The drawing shows a Wall of Rush on the Middle Lands' north-west coast. Is it the Great Wall? | No. The vault puts the Great Wall in the east; the north-west rim is only a coastal ridge (Hiloff Rim). |
| 14 | Are the new river names welcome (Aenar, Selenar, Safen, Fandan, Grey River, Elwen and others)? | Yes; they are placeholders in each region's style. |
| 15 | What lies beyond the edges? | Nothing: cliffs of ice, basalt, lava and dunes close the map; the vault leaves the beyond open. |
| 16 | Should the Mushroom Forest be forest terrain or jungle terrain? | Forest with fungal density. |
| 17 | Should Gondolin get a coast on the northern sea? | Yes: the Gondolin Coast plain reaches the snow coast. |
| 18 | Do the elves want volcanoes in the Magical Lands? | No. The Magical Lands keep their snow ridges, not fire. |

