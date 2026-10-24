# Regional dossier: the South Lands

**Requirement:** R-19, with R-21, R-26 and R-29.
**Status:** Draft of 24 October 2026. Everything not marked **established** is **proposed** (decisions L1 to L3).
**Labels:** **E** established (source key in section 14), **P** proposed, **O** open in canon, **hidden** never public before its story flag.
**Owner decisions of 24 October 2026 applied ([OD]):** the lands south of the South Lands, home of devils, demons and beings of fire and endless suffering, are reference names only and lie off the map; unfitting drawn labels are renamed with the former label kept; no exact age of any being is stated.

## 1. Overview

The South Lands are the great desert of the East Lands, running south off the edge of the known map ([AR]): the Sun Desert's dune sea in the south-west, the Noris Desert's southern belt below the Hot Lake, the volcanic Hardtmuth chain on the east and the Ocean of the Sun on the west ([GMS] §2 South Lands). Almost nothing lives in the open sand; people cling to oases, wadis and the coast road. Miaed's lords sell passage through the Hardtmuth to both great caravan powers, a league of well-clans keeps the oases of the dune sea, sand golems sleep in the dunes and wake angry, and on the clearest days, the desert-folk say, angels can be seen far up in the dry sky ([BC] cards 7, 50). South of the last well, beyond the edge of every map, lie the burning lands of which the southerners speak only in dread (reference names, [OD]).

## 2. Physical character

| Item | Value | Source |
| --- | --- | --- |
| Extent | The southern lobe of the eastern mainland, centred near (0.731, 0.860), running off the south edge (the Line of Sun); 517,520 square pixels | [GM] `region_south_lands`, `edge_south` |
| Climate | Hyper-arid and scorching; two seasons, "hot and burning" | [GM] |
| Terrain | Desert 70%, plains 12%, hills 10%, mountain 6%, towns 2% | [GM] |
| Elevation | Dune sea 1 to 2; Hardtmuth foothills 3 | [GM] |
| Fertile ground | Oases and the western coast road only | [GM] |
| Natural borders | The Ocean of the Sun on the west; the Hardtmuth chain on the east | [GM], [GMS] §6 |

**The Sun Desert** (`desert_sun`): the drawn "Sunhot Desert", renamed Sun Desert by the owner on 19 October; a dune sea with scattered oases whose lobe runs off the south edge ([GM]). **The Noris Desert** (`desert_noris`): the great sand and gravel plain south of the Hot Lake, "part of the South Lands by the vault" ([GM]); its northern wells belong to Noris ([east_lands.md](east_lands.md)). **The Alodale Desert** (`desert_alodale`) of red sand lies at the north-west edge. **The Hardtmuth Mountains** (`range_hardtmuth`, south end) close the east with their volcanoes (`volcano_hardtmuth`, `volcano_fire_mountain`) and the Hardtmuth Pass on the Sand Road (`pass_hardtmuth`).

**Water (one name each).** The **Ocean of the Sun** (`sea_sun_ocean`, drawn) on the west coast; the **Noris Wadi** (`river_noris_wadi`, P), a dry river bed with oasis strings; the **River Mora** (`river_mora`, P), a seasonal outflow of the Hot Lake that dies in the desert. No river reaches the sea.

**Hazards.** Heat that kills a caravan that loses its wells; sandstorms; quicksand in the old wadi beds; sand golems disturbed in their caves (section 9); volcanic ash from the Hardtmuth; and the dread of the south.

**The edge and beyond.** The map ends at the Line of Sun (`edge_south`, drawn "The Line of Sun", established as the south edge's name) in impassable cliffs ([GM]). **Owner decision ([OD]):** the lands south of the South Lands are the home of devils, demons and beings of fire and endless suffering; they are reference names only, off the map. The drawn East-sheet names that read as those lands (the Unforgivable Lands, the Lands of Burning Men, the Devil's Place, the Altering Lands of Death, the Upland of Lava, the Burning Lands of Ocellios) are used here only as what people say lies beyond the last well. Nothing in the game travels there. Whether the Nether below the Ember Lands has any link to these lands is not said ([nether.md](nether.md)).

## 3. Inhabitants

| People | Culture | Language | Where | Status |
| --- | --- | --- | --- | --- |
| Men | Pass-lords of Miaed (the roster's `river_kings`, P to separate a desert-pass culture) | Alerhic, a desert dialect with Noric loans | The Hardtmuth passes and the south coast | P; the vault names "caravan peoples, oasis keepers; Miaed on the south shore" ([GM] people) |
| Men | Oasis-folk of Wahatud (P, new) | Noric, a dune dialect | The oases of the Sun Desert | P (after "oasis keepers", [GM]) |
| Men | Caravan peoples (Noris riders, caravan princes' factors) | Noric, Stabilic | On the roads, seasonally | P |
| Sand golems | none | none recorded | Caves and dunes of the Noris Desert | [BC] card 7 |
| Angels | none recorded (their speech, Choral, is reserved, [LANG] §2) | | The sky above the Sun Desert and the Lands of the Sun | E angels are immortal Great Folk whose history is unwritten ([PA]); [BC] card 50 places them "mostly in Sunhot and the Sunhot Desert" |

**Population.** The model gives Miaed 788,100 people in 19 states ([DEM] Miaed) and the South Lands no other country; its region note says "caravan peoples, oasis keepers". Revised (P): Miaed about 450,000 (the coast road, the pass valleys and Erdozan; 19 states of a hyper-arid lobe at desert density cannot hold more), Wahatud about 160,000 at the oases, and some 60,000 caravan folk moving with the seasons: **about 670,000 in all**. People live only where water is: oasis strips and wadis carry up to 35 per square kilometre, the open dune sea about 0.3 ([DEM] density classes).

## 4. Livelihoods and resources

| Resource | Where | Notes |
| --- | --- | --- |
| Passage tolls | The Hardtmuth Pass and the coast road | Miaed's wealth ([FT] `regional_miaed`) |
| Dates, water, camel fodder | The oases | Wahatud sells water by the skin (P) |
| Salt | The dry lake beds of the dune sea | P |
| Glass sand | The white dunes near the coast | Sold to the lake glass-makers of the East and to Aenor (P) |
| Dyes, silk, sun-fruit | Carried on the Sand Road | [WB] §7 |
| Bitumen (the fuel resource of the game) | Under the Noris Desert | [GMS] §2 resource table |
| Gold | The sand golems' caves | Golems like gold ([BC] card 7); those who rob them seldom return (P) |

## 5. Institutions and political forms

| Realm | Form | Notes |
| --- | --- | --- |
| **Miaed** | A lordship of the passes: the **Lord of the Passes** chosen from the pass-holding houses, each house keeping one gorge | P; the focus tree's "Lords of the Passes" ([FT] `regional_miaed`) |
| **Wahatud** | A league of well-clans: each oasis is a clan, and a Well-Moot at the greatest oasis settles water disputes | P; Noric well-law ([WB] Well-Oath) |

**Hidden.** Afrit built ties in the East Lands and the South Lands as a precaution against losing Aenor ([A4] §II, E); in 4A 1748 Miaed's court is one of the "great kingdoms" the council's eastern branch courts ([EK] §3, P).

## 6. Beliefs and faiths

| Faith | Held by | Belief | Truth versus belief |
| --- | --- | --- | --- |
| The Well-Oath | Wahatud, the caravans | A well is a promise from the earth; sharing water makes kin ([WB] §4, P) | |
| The River Temples, in a dry form | Miaed | The pass-lords keep a temple stair at Erdozan though they have no river; they honour the rain (P) | The twelve main New Gods answer the twelve needs of mortals and lesser New Gods also exist ([OD]); no names are invented. |
| The Sky-Watch (P) | Oasis-folk | Angels are the New Gods' messengers and are seen only by those who do not ask for them | Belief; the angels' history and purpose are unwritten (O, [PA]). |
| Dread of the burning south | Everyone | Beyond the last well lie lands of fire where the wicked suffer without end | Reference names only ([OD]); never a traveller's report. Mortals may be wrong about the dead, whose god is Zol (E, [ZO]). |
| The Faith of the Deliverer | Erdozan's court and the caravan towns | Public worship (E) | Hidden: Afrit ([AF]). |

**Holy sites (P).** The Well-Moot oasis; the dry temple stair of Erdozan; the "Angels' Dune", a white dune where the oasis-folk leave water for nobody.

## 7. History

| Date | Event | Label |
| --- | --- | --- |
| Before 1A | The desert already runs off the edge of the known world; what lies beyond is not fixed. | E ([AR]) |
| Before 1A | The Eastern tongues' desert speech is carried into the dune sea by the first well-clans. | P |
| 1A | Aenoran explorers chart southern and eastern shores without knowing the lands behind them. | E broad ([A1] §2) |
| 1A about 1150 to 1500 | Rulers of the southern lands ally with Volgan; not all of them. | E ([A1] §4) |
| 2A, 3A | The desert is far from the wars of the Middle Lands; its wells change hands between clans. | P |
| 4A 600 to 780 | The caravan roads open; the Sand Road runs through the Hardtmuth Pass; Miaed's pass-houses become rich. | P ([FC] II) |
| about 4A 1300 | The Hidden Council's eastern branch begins to court the eastern and southern courts. | P ([FC] III); hidden |
| 4A 1600s | The Well-Moot of Wahatud is sworn after a war of poisoned wells. | P |
| **4A 1748** | **Start: peace.** | owner, [C48] |
| 4A 1755 to 1758 | The eastern coalition and the King of the East; Miaed must choose to kneel, refuse or keep silent. | E King of the East ([A4] §IX); P Miaed's part ([EK] §6) |

**Trade routes.** The Sand Road from Stabilo through the Hardtmuth Pass and along the coast; the oasis strings of the Noris Wadi; Miaed's coast road (P, [EK] §1). **The Sand Road does not reach the Lands of the Sun**: in the game layout the Lands of the Sun lie in the far south-west corner of the world, thousands of pixels away across the sea ([GM] `land_lands_of_the_sun`), although the world bible and the eastern spec describe a Sand Road to them and a border between Miaed and the Lands of Light (section 13).

**Local legends (P).** The oasis-folk say a sand golem guards every buried well and gives it back to whoever brings it gold. The pass-lords of Miaed say their founder bargained with the mountain and paid it in the first caravan's bells.

## 8. Neighbours and relations

| Neighbour | Relation |
| --- | --- |
| Noris | Rival and partner at the wells; the Salt and Sand Roads (P) |
| Stabilo | Miaed's best customer on the Sand Road (P) |
| Alerhia, Erco | Alerhic kin of the pass-lords (P) |
| The Ember Lands and the Islands of the South across the Ocean of the Sun | Distant; storm-bound coasts (P) |
| The burning lands beyond the south edge | Dread; no contact (reference names, [OD]) |

## 9. Wildlife and creatures

| Creature | Habitat | Effect | Source |
| --- | --- | --- | --- |
| Sand golems | Caves and dune surfaces of the Noris Desert | 2 to 5 metres tall, look like sand and are hard to see, peaceful unless disturbed, then furious; hard skin; fight with sand, stones and strength; immortal by the card; like gold. Caravans keep to marked tracks; robbing their caves is death | [BC] card 7; their rank or kind is open |
| Angels | High in the clear sky | Immortal, friendly, rarely come down; seen as a sign, never as a threat | E angels ([PA]); [BC] card 50 |
| Camels | Everywhere on the roads | The only beasts that cross the dune sea | P |
| Salt-hawks (P) | The dry lake beds | Taken young and trained by the oasis-folk | P (Noric *baaz* "hawk") |
| Glass-vipers (P) | The white dunes | Pale, nearly invisible snakes; their bite is slow but sure | P |

## 10. Settlements

| Place | Realm | Why there | Status |
| --- | --- | --- | --- |
| Erdozan | Miaed | At the mouth of the great pass where the Sand Road reaches the coast; 120,000 | P ([DEM]); the roster's capital |
| Miaed coast towns | Miaed | Every sheltered cove of the Ocean of the Sun with a spring | P |
| **Biir-Raab** (Noric "great well") | Wahatud | The greatest oasis of the dune sea, seat of the Well-Moot; about 15,000 | P |
| Pass-forts of the Hardtmuth | Miaed | Each gorge of the chain | P |

## 11. Roster proposal (proposed)

**Before:** 1 country (Miaed, Y18, on the East Lands sheet, [ROS]); 0 elven. **After:** 2 countries; 0 elven.

| Name | People and culture | Political form | Capital | Extent | Why it exists |
| --- | --- | --- | --- | --- | --- |
| **Miaed** | Men, pass-lords | Lordship of the passes | Erdozan | The Hardtmuth passes and the south coast; about 8 states (from 19) | E name on the south shore ([GM] `site_miaed`) |
| **Wahatud** (Noric "people of the oases") | Men, oasis-folk | League of well-clans | Biir-Raab | The oases of the Sun Desert; about 4 states | The vault's "oasis keepers" ([GM] people) |

**Wild lands, not countries (P):** the open dune sea of the Sun Desert (sand golems), the deep southern sand toward the edge.

| Current row | Change | Reason |
| --- | --- | --- |
| Miaed (Y18) | Kept; 19 to about 8 states | A pass-and-coast realm, not the whole desert |
| *(new)* | Wahatud | The oasis keepers need a polity |

**Counts:** 1 before, 2 after. Elven realms: 0 before, 0 after.

## 12. Gameplay role

**Mechanics.** *Eastern kings* §8 ([EK]) already defines the South Lands' dry land (supply and attrition penalties without wells), digging wells, dry years and the "Into the Deep Sand" expedition, which never says what lies beyond the edge; this dossier adds (P): sand-golem events on any army that marches through dune states without a guide ("The Sand Wakes"); the Well-Moot (Wahatud gains political power when water is shared, loses stability when a well is poisoned); and angel sightings as rare morale events that are never explained.

**Focus trees.** `regional_miaed` (19 focuses, "the Lords of the Passes") stays; Wahatud gets a small tree (wells, the moot, the guides, the golems' gold). Both answer the King of the East through the shared eastern modules.

**Events (P).** "The Sand Wakes"; "An Angel Over the Dunes"; "Gold for the Golems"; "A Well Poisoned"; "What the Caravan Saw" (the deep-sand expedition returns with stories of fire to the south; the text never confirms them).

**AI (P).** Miaed sells passage to whoever pays more and kneels to the King of the East only if both Noris and Stabilo are weakened; Wahatud never joins wars and always offers water to refugees.

## 13. Questions for the owner

1. **The Sand Road and the Lands of the Sun.** The world bible's Sand Road runs "south-west across the Sun Desert to the Lands of the Sun" with "a pass at Sun Gate", and the eastern spec says Miaed and Alerhia border the Lands of Light ([WB] §7; [EK] §3). In the game layout the Lands of the Sun are in the far south-west corner and the Sun Gate is there ([GM] `site_sun_gate`, `land_lands_of_the_sun`), across the sea from the South Lands. May the Sand Road end at Miaed's coast, with the Lands of the Sun reached only by sea?
2. **Angels.** The angel card places angels "mostly in Sunhot and the Sunhot Desert"; the Sun Desert is the renamed Sunhot Desert. May angels be seen above the South Lands as well as the Lands of the Sun?
3. **Sand golems' nature.** The card calls them immortal; are they spirits, made beings, or something else (bestiary question 9)?

### Renamed labels (owner decisions applied; former label kept)

| Former label | Reason | New name |
| --- | --- | --- |
| Sunhot Desert | owner's rename of 19 October 2026 | **Sun Desert** |
| Miaed's working culture `river_kings` | a desert-pass realm has no river | **pass-lords of Miaed** (culture) |

## 14. Sources

| Key | File and heading |
| --- | --- |
| [AR] | `docs/lore/vault/05 - Geography/Aoaz and Its Regions.md` (South Lands row; edges of the known map) |
| [PA] | `docs/lore/vault/04 - Peoples/Peoples of Aoaz.md` (Great Folk: angels) |
| [ZO], [AF] | `docs/lore/vault/03 - Figures/Zol.md`; `Afrit.md` |
| [A1] | `docs/lore/vault/07 - History/The First Age of Aoaz.md` (§2, §4) |
| [A4] | `docs/lore/vault/07 - History/The Fourth Age of Aoaz.md` (§II, §IX) |
| [FC] | `docs/lore/vault/07 - History/Fourth Age Chronology.md` (II, III) |
| [C48] | `docs/lore/vault/07 - History/The Campaign of 4A 1748.md` |
| [OD] | Owner decisions of 24 October 2026 relayed by the coordinator (the burning south off the map; renames; no exact ages) |
| [GM] | `tools/content/data/geography/aoaz.json` (`region_south_lands`, `desert_sun`, `desert_noris`, `desert_alodale`, `range_hardtmuth`, `pass_hardtmuth`, `sea_sun_ocean`, `river_noris_wadi`, `river_mora`, `site_miaed`, `site_sun_gate`, `land_lands_of_the_sun`, `edge_south`) |
| [GMS] | `docs/specs/01_map/05_geography_model.md` (§2 South Lands; §2 resource table; §6) |
| [DEM] | `tools/content/data/world/demography.json` (Miaed; density classes; settlements) |
| [WB] | `docs/specs/02_lore/05_world_bible.md` (§4 Well-Oath; §7 trade routes) |
| [LANG] | `docs/specs/02_lore/06_languages.md` (§2 reserved languages); `languages.json` (`noric`, `alerhic`) |
| [ROS] | `tools/content/data/countries.json` (Y18 Miaed) |
| [BC] | `docs/lore/sources/bestiary_cards_part1.md` (card 7 Sand Golem), `bestiary_cards_part2.md` (card 50 Angel) |
| [EK] | `docs/specs/04_mechanics/eastern_kings.md` (§3, §6, §8) |
| [FT] | `docs/design/focus/regional_miaed.json` (summary) |
