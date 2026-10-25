# Regional dossier: the Lands of the Sun

**Requirement:** R-19, with R-21, R-24 (fewer, smaller elven realms; on 19 October the roster had 41 sun-elf countries here), R-26 and R-29.
**Status:** Draft of 24 October 2026. Everything not marked **established** is **proposed** (decisions L1 to L3).
**Labels:** **E** established (source key in section 14), **P** proposed, **O** open in canon, **hidden** never public before its story flag.
**Owner decisions of 24 October 2026 applied ([OD]):** names from other fiction or real myth (Heaven, Godland) and real-world names are replaced directly; repetitive or unfitting drawn labels are renamed with the former label kept; Zol does not appear in person in the War of the Last Crowns, his most loyal servant Edvoid (name to be replaced) does; the twelve main New Gods answer the twelve needs of mortals and lesser New Gods also exist; the dead are Zol's; no exact age of any being is stated.

## 1. Overview

In the far south-west of the world, at the corner where the map runs off its southern edge, lies a small, sunny, wonderfully fertile land of grasslands, terraces, ash-rich volcanic slopes and warm seas, with a chain of islands to the north ([AR], [GMS] §2 Lands of the Sun). Here live the Sunhot elves, over three metres tall, among the strongest and most peaceful peoples of Aoaz, and among them the Gala elves, whose king Lorien led his host to Dardan in the First Age and still remembers it ([PA], [LO]). Men live here too: the Goodin Sunfolk, who farm the fields and sail the coasts, and who in 4A 1748 far outnumber the tall elves whose sanctuaries they serve (P). The land looks north over the Sea of Gods, which the Sunhot believe is the nearest earthly water to the gods' own realm (belief). In a few years, a stranger driven by storms from the Islands of the South will come to Gala; Lorien will tell him who he is and send him north (E, [4R]; hidden: the stranger is Eindil).

## 2. Physical character

| Item | Value | Source |
| --- | --- | --- |
| Extent | The mainland in the south-west corner (bbox x 0.020 to 0.103, y 0.889 to 1.0, running off the south edge; 76,720 square pixels) and the Ihuy and Soyano island groups to the north (y 0.71 to 0.78); 92,928 square pixels in all | [GM] `land_lands_of_the_sun`, `region_lands_sun`, `land_island_011` and others |
| Climate | Warm temperate to subtropical and sunny; long dry summers, short mild winters | [GM] |
| Elevation | The Sun and Sukro Mountains at 4; volcanoes at 4 to 5 | [GM] |
| Terrain | Plains 40%, forest 22%, hills 15%, mountain 12%, jungle 5%, marsh 4%, desert 2% | [GM] |
| Fertile ground | The Sun Grasslands (`plain_sun_grasslands`, drawn "Sunhot Grasslands", renamed by the owner on 19 October), the ash soils of the Good Volcanoes, Sun Lake | [GM] |
| Natural borders | "The Sun Mountains and Sukro Mountains split the realms; the Sea of Gods bounds the north" | [GM], [GMS] §6 |

**Relief.** The Sun Mountains (`range_sun`) and the narrow Sukro Mountains (`range_sukro`, reading uncertain) run north and south through the mainland and split it into a western lowland of jungle and sanctuaries and an eastern lowland of grass and lake. The two Good Volcanoes (`volcano_good_1`, `volcano_good_2`), dormant, stand on the north-east shore and have given that coast "gentle, fertile ash". The Great Volcano (`volcano_great`, smoking) stands on the island of Hol in the Ihuy group ([GM]). The Sun Gate (`site_sun_gate`, drawn "Sunhot Gate", renamed by the owner) is proposed as the pass between the Sun and Sukro Mountains at the mainland's southern edge.

**Water (one name each).**

| Water | Model id | Name used here | Note |
| --- | --- | --- | --- |
| The warm sea off the north-east shore | `sea_gods_sea` | **Sea of Gods** (E) | Established place ([AR]); placement proposed in the model |
| North of the Lands of the Sun | `sea_light_seas` | **the Bright Sea** (Common Speech; Sunhot *Sala Aila*) | Former label "The Seas of Light"; the plural is dropped and the name no longer pairs with the Dead Lands' death-seas |
| Among the Ihuy islands | `sea_ihuy_seas` | **the Ihuy Sea** | Former label "Ihuy Seas" |
| Drawn, not in the model | | "The Yellow Sea" becomes **Sala Olar**, "the Golden Sea" (Sunhot); "The Sea of the Dreams" becomes **Sala Nyel**, "the Moon Sea" (Sunhot) | The first is a real-world sea name; the second repeats the realm name "Dreamland" |
| The south edge | `edge_south` | **the Line of Sun** (drawn, E edge name) | The drawn "The Ling of Sun" is a reading of it; "The Sky of Aoaz" names the same edge ([GM]) |
| River and lake | `river_sunwater`, `lake_sun`, `marsh_sun_lake` | **Sunwater** (P), **Sun Lake** (drawn), **Sun Lake Shallows** (P) | |

**Forests.** The God Forest (`forest_god`, dense; the vault's God Forest Keepers live there, [PA]) south of Sun Lake, and the Hot Forest (`forest_hot`, jungle) in the south-west.

**Hazards.** Few: dry summers and wildfire on the grass; the smoking Great Volcano on Hol; storms that drive ships from the Islands of the South onto these coasts, as they drove the stranger in 4A 1751 (P date, [FC] V).

## 3. Inhabitants

| People | Culture (data id) | Language | Where | Status |
| --- | --- | --- | --- | --- |
| Sunhot elves | Sunhot Elves of the Light (`sunhot_light`), Western Sanctuary Sunhot (`sunhot_western`), Isle Sunhot (`sunhot_isles`) | Sunhot | The sanctuaries of the mainland and the isles | E people, "over three metres tall, among the strongest and most peaceful" ([PA]); P cultures |
| Gala elves | Gala Elves (`gala_court`) | Galic | Gala on the north-east shore | E Gala elves under Lorien ([LO], [PA]); their relation to the Sunhot elves is O |
| God Forest Keepers | none written (P: a small, secluded elven community) | unrecorded | The God Forest | E name among the elves ([PA]); everything else P |
| Men | Goodin Sunfolk (`goodin_sunfolk`) | Sunhot with a Sunfolk accent; Aenoran for trade | The grasslands, the coasts, the guest-towns of every sanctuary | E Goodin Sunfolk ([PA]); P that they are the majority |
| Angels | none recorded | Choral (reserved, [LANG] §2) | The sky; rarely seen on the ground | E angels exist ([PA]); [BC] card 50 "mostly in Sunhot" |

**Variation between the elven communities (P).** The Sunhot of the Light keep a Radiant Speaker and large sanctuaries; the western sanctuaries are small houses of song, weaving and healing; the isle Sunhot are sailors and pearl-farmers with the reef-words of the Islands of the South; the Gala elves are the oldest court of all and keep their own tongue, Galic, the most conservative elven speech ([LANG] §1); the God Forest Keepers live apart in their wood and are hardly seen. Sunhot and Galic place names never share a stem, so that no text implies a kinship the vault leaves open ([LANG] §8).

**Population.** The model gives the Lands of the Sun 4.0 million people in 47 countries and 87 states, 3.56 million of them Sunhot elves, more than all the elves of the Magical Lands ([DEM]). The model's own region note says "the Sunhot elves are few and long-lived", and the vault calls them among the most peaceful peoples, not the most numerous. Revised (P):

| People | Model | Revised (P) | Why |
| --- | ---: | ---: | --- |
| Sunhot elves | 3,556,800 | about 420,000 | Great Folk, immortal, few; three-metre elves on a small land |
| Gala elves | 176,900 (three realms) | about 35,000 | A remnant court |
| God Forest Keepers | 0 | about 4,000 | A secluded wood |
| Goodin Sunfolk and other men | 265,500 | about 1,500,000 | The fields of a very fertile land need farmers; the Sunfolk are the farmers, boatmen and guest-town people of every realm |
| **Total** | **4,000,000** | **about 1,960,000** | |

People live on the Sun Grasslands, the ash coast of the Good Volcanoes, the shores of Sun Lake and the harbours of the isles; the mountains, the God Forest and the Hot Forest are thin.

## 4. Livelihoods and resources

| Resource | Where | Notes |
| --- | --- | --- |
| Grain, fruit, sun-fruit, wine | The Sun Grasslands, the ash coast, the terraces | [WB] §7 ("sunfruit" on the Sand Road) |
| Pearls, fish, salt | The isles | P ([WB] §6.12 isle trades) |
| White stone | The high places (Tor Luni) | P ([FT] `regional_godland`: "quarrying the white stone that builds half the realms") |
| Ships | Gala and the Soyano isles | Lorien's exceptionally fast ship is E ([A4] §V); the "best white ships" P ([FT] `regional_hengyang`) |
| Silk, dyes, glass | The sanctuaries | P |
| Rubber (game resource) | The Hot Forest, the Ihuy isles | [GMS] §2 resource table |
| Pilgrims | The Sea of Gods shore | The Noon Road by sea from the Great Lake ports ([WB] §7) |

**Trade.** By sea only: to the Islands of the South, to Aenor by the Ocean of Peace crossing, and, rarely, to the West Lands ([WB] §7). The Lands of the Sun have no land road to the East or the South Lands (section 13).

## 5. Institutions and political forms

| Realm | Form | Notes |
| --- | --- | --- |
| **Gala** | An old court under King Lorien, who reigns as long as he wills | E king ([LO]); P constitution ([WB] Gala Elves) |
| **The Lands of Light** | A sanctuary realm under a Radiant Speaker chosen by the sanctuaries; chairs the Noon Council | P ([WB], [LS] §4) |
| **Elvana**, **Igara** | Small sanctuary realms, each under a Speaker chosen by its sanctuary; a loud, bloodless rivalry | P ([FT] `regional_elvana`) |
| **Yeni Alang** (former label Heaven) | The High Terraces: a house of sky-watchers under the eldest watcher | P ([FT] `regional_heaven`) |
| **Tor Luni** (former label Godland) | The High Places: a quarrying sanctuary under a Keeper of the Stones | P ([FT] `regional_godland`) |
| **Ihuy** | A council of island Speakers around the Great Volcano | P |
| **Soyano** | The Archipelago Council of the northern isles under a Tide-Speaker | P ([FT] `regional_hengyang`) |
| **Goodin** | The Sunfolk Steadings: elders of the guest-towns; a realm of men among the tall realms | E Goodin Sunfolk; P form ([FT] `regional_goodin`) |
| **God Forest** | The Keepers' household; no ruler is named | E Keepers ([PA]); P form |

**The Noon Council (P, [LS] §4).** A council of the Sunhot realms, with Gala as an honoured guest and Goodin admitted to a guest's seat; it settles quarrels and keeps the sanctuary roads open. The Sunhot honour Lorien's memory but owe his crown nothing (P, [C48]).

**Hidden.** Afrit's agents operate even in the Lands of the Sun ([A4] §VI, E): one reports that a man claiming descent from Aen has left Lorien with a ship.

## 6. Beliefs and faiths

| Faith | Held by | Belief | Truth versus belief |
| --- | --- | --- | --- |
| The Noon Pilgrimage | Sunhot, Sunfolk | The Lands of the Sun are the nearest earthly place to the gods' realm that mortals call Heaven; sanctuaries look out over the Sea of Gods (P, [WB] §4) | Belief. Eindil's spirit reaches a divine realm he understands as Heaven ([A4] §XI, E); nothing says it lies near here. The twelve main New Gods answer the twelve needs of mortals and lesser New Gods also exist ([OD]); no names are invented. |
| The Far Shore (P) | The isle Sunhot | Beyond the south-western sea lies a land the old songs call Lao, where the gods dwell and souls go | Belief only; interpretations differ ([OC] §3). The dead are Zol's ([OD]). |
| The Mirror Vigil | Gala | The Mirror of First Rain shows true traces of the past and possible futures; a prophecy shown too plainly makes people do what it shows | E Lorien's vision; P the Mirror ([MF], [A4] §V) |
| The Sky-Watch | Yeni Alang, the oasis-folk of the far desert | Angels are seen over the terraces on still days (P) | Angels exist (E, [PA]); their purpose is unwritten. |

**Holy sites (P).** The Mirror of First Rain at Gala (`site_mirror_first_rain`, P); the Sea of Gods shore below Tor Luni; the standing stones of Tor Luni, "older than any Sunhot record" ([FT] `regional_godland`); the God Forest; the sanctuaries of the Lands of Light.

## 7. History

| Date | Event | Label |
| --- | --- | --- |
| Before 1A | The Sunhot elves hold the land; they tell that their tallness is the sun's gift. | E people ([PA]); P telling ([WB]) |
| Before 1A | The Gala elves already keep their court; whether they came from elsewhere is open. | E Lorien's great age ([LO]); O origin and kinship |
| Before 1A | The standing stones of Tor Luni are raised by nobody the Sunhot remember. | P |
| Late 1A | Edran's Grand Alliance reaches Lorien; Aenor knew little of the Gala before; one of the first great meetings of their courts. | E ([A1] §5) |
| Late 1A | Lorien leads his formidable host to Dardan and helps break Volgan's power; the Gala host saves a collapsing flank. | E host at Dardan ([A1] §5, [LO]); P battle detail ([A1] §6) |
| By 1A 1675 | Edran's invasion of the Ember Lands against elven advice; Lorien's people pay for a decision they opposed. | E ([A1] §7, [ER]) |
| 2A | The Gala mourn; the elven kingdoms refuse to send armies to save Aenor from Elzon. | E ([ER], [2R]) |
| 2A, 3A | Sunfolk farmers and boatmen settle the sanctuary shores as guests and stay. | P ([WB] Goodin Sunfolk) |
| 4A, early | The Noon Council forms. | P |
| **4A 1748** | **Start: peace.** | owner |
| 4A 1752 | A stranger driven from the Islands of the South reaches Gala; Lorien speaks with him for weeks, recognises Eindil, son of Ein, son of Aen, and sends him north with a ship, armour, a sword and a crew of westerners, islanders and Gala elves. | E ([4R], [A4] §V); P date; hidden identity |
| 4A 1757 | Lorien returns with Gala elves and ancient lords and spirits to defend the living, and dies. The vault has him die fighting Zol in person; by the owner's correction, Zol does not appear, and Lorien dies in the struggle with Zol's most loyal servant, Kusven. | E Lorien's death ([LO], [WLC]); owner correction ([OC] §2.4, [OD]); P date |
| After 4A 1760 | What becomes of Gala after Lorien is open. | O ([A4] follow-up 6) |

**Local legends (P).** The Sunfolk say the Good Volcanoes were put to sleep by a song and must not be sung near. The isle Sunhot say Hol's Great Volcano smokes when a ship is lost. The Gala keep a garden for the dead of Dardan, far from Dardan ([WB] §7).

**Where history can diverge (L3).** Lorien can refuse the stranger, keep him at Gala, or march early; the Noon Council can send help north, which no Sunhot realm has done since Dardan; Afrit's agents can be caught.

## 8. Neighbours and relations

| Neighbour | Relation | Why |
| --- | --- | --- |
| The Islands of the South | Close by sea; storm-driven strangers | E ([A4] §IV) |
| Aenor | Distant; pilgrims by the Ocean of Peace; the Gala distrust kings who turn victories into crowns | E Lorien's view ([A4] §V); P pilgrims |
| The Magical Lands | Distant elven kin in speech; the memory of Dardan | E Lorien at Dardan; O kinship |
| The West Lands | Rare traders | P |
| Inside: Elvana and Igara | Bloodless rivalry | P |

## 9. Wildlife and creatures

| Creature | Habitat | Effect | Source |
| --- | --- | --- | --- |
| Angels | The high sky over the terraces | Immortal, friendly, rarely come down; seen as a sign | E ([PA]); [BC] card 50 |
| Sun-cranes (P) | Sun Lake and its shallows | The Sunhot's heraldic bird; protected | P |
| Pearl-oysters | The isles' lagoons | The isle Sunhot's trade | P |
| Jungle apes of the Hot Forest (P) | The Hot Forest | Raid the terraces' fruit | P |
| Fire-lizards (P) | The warm slopes of Hol's Great Volcano | Basking reptiles whose shed skins the isle folk weave | P |

## 10. Settlements

| Place | Realm | Why there | Status |
| --- | --- | --- | --- |
| Sodoli | Gala | The old courtyard garden above the harbour, with the Mirror's spring; about 12,000 | P ([DEM], [WB]) |
| Eldoga | The Lands of Light | The largest valley of the eastern lowland; about 55,000 | P ([DEM]) |
| Googavis | Elvana | Its sanctuary vale on two shores (Elvana and the drawn Elvini) | P ([DEM]) |
| Repgin | Igara | Its sanctuary vale | P ([DEM]) |
| Sudoni | Yeni Alang | On the terraces above the western shore | P ([DEM]) |
| Wefolen | Tor Luni | On the shore of the Sea of Gods below the quarries | P ([DEM]) |
| **Holang** (Sunhot "Hol place") | Ihuy | The harbour of Hol under the Great Volcano | P |
| Ileslia | Soyano | The main harbour of the northern isles | P ([DEM]) |
| Elgagen | Goodin | The largest Sunfolk steading on the grass | P ([ROS]) |
| The Keepers' Glade | God Forest | Deep in the God Forest | P |

## 11. Roster proposal (proposed)

**Before:** 47 countries ([ROS] scan Sunhot): 41 Sunhot, 3 Gala, 3 of men. **After:** 10 countries: 7 Sunhot, 2 other elven (Gala, God Forest), 1 of men.

| Name | People and culture | Political form | Capital | Extent | Why it exists |
| --- | --- | --- | --- | --- | --- |
| **Gala** | Gala elves | Lorien's court | Sodoli | The north-east shore; 2 states | E; absorbs the rows Gala Elves, Gala and North Gala |
| **The Lands of Light** | Sunhot of the Light, Sunfolk villages | Sanctuary realm under a Radiant Speaker | Eldoga | The eastern lowland and the Sun Grasslands; 6 states | Drawn largest realm; absorbs Land of the Sun, Beforelands of Gulia, Menga, Sono, Sunweli, Sensun, Sali, Helen, Dein Lands, Flame, Lovis |
| **Elvana** | Western Sanctuary Sunhot | Sanctuary realm | Googavis | The Cape of Elvana and the Elvini shore; 2 states | Drawn "Lands of Elvana" |
| **Igara** | Western Sanctuary Sunhot | Sanctuary realm | Repgin | South of Sun Lake; 1 state | Drawn "Lands of Igara" |
| **Yeni Alang** (former label Heaven) | Western Sanctuary Sunhot | House of sky-watchers | Sudoni | The western terraces; 2 states | Heaven is a real-world religious name ([OD]); Sunhot *yeni alang* "high valley" |
| **Tor Luni** (former label Godland) | Western Sanctuary Sunhot | Quarrying sanctuary | Wefolen | The high places by the Sea of Gods; 2 states | Godland is a borrowed name ([OD]); Sunhot *tor luni* "white stone"; absorbs Godson, Godton, Godrela, Sun God Land |
| **Ihuy** | Isle Sunhot | Council of island Speakers | Holang | The Ihuy group with Hol, Hel, Tei, Armic, Ofos, Sus, Rana; 3 states | Drawn Ihuy Islands |
| **Soyano** | Isle Sunhot | Archipelago Council | Ileslia | The northern isles with the former Hengyang, Poyang, Tangsie, Wenyene, Pinion, Heilmon, Yungin, Loyol, Biggen; 3 states | Drawn Soyano Islands |
| **Goodin** | Goodin Sunfolk (men) | Steadings under guest-town elders | Elgagen | The western grasslands; 2 states | E Goodin Sunfolk; absorbs Goodton and Guuden |
| **God Forest** | God Forest Keepers (elves) | The Keepers' household | The Keepers' Glade | The God Forest; 1 state | E Keepers ([PA]) |

| Current rows | Change | Reason |
| --- | --- | --- |
| Gala Elves, Gala, North Gala | Merged into Gala | One court; the vault knows only Lorien's Gala |
| The Lands of Light | Kept, grows | |
| Elvana, Igara | Kept | |
| Heaven | Renamed Yeni Alang | Real-world religious name |
| Godland | Renamed Tor Luni | Borrowed name |
| Godson, Godton, Godrela, Sun God Land | Merged into Tor Luni | Repetitive "God-" labels |
| Land of the Sun, Beforelands of Gulia, Menga, Sono, Sunweli, Sensun, Sali, Helen, Dein Lands, Flame, Lovis | Merged into the Lands of Light | Interchangeable one-state sanctuaries; "Land of the Sun" repeats the region's name; "Helen" is a real given name of Greek myth; their names survive as district names where they fit |
| Sunny, Via, Him, Dreamland | Removed; their land goes to the Lands of Light and Yeni Alang | Placeholder-like English or Latin words |
| Hengyang, Poyang, Tangsie, Wenyene, Pinion, Heilmon, Yungin, Loyol, Biggen, Soyano | Merged into Soyano | Hengyang and Poyang are real-world place names; the rest are one-state isle realms |
| Hol, Hel, Tei, Armic, Ofos, Sus, Rana | Merged into Ihuy | One-state isle realms |
| Goodin, Goodton, Guuden | Merged into Goodin | One people of men |
| *(new)* | God Forest | The vault's Keepers |

**Counts:** 47 before, 10 after. Sun-elf realms: 41 before, 7 after. Other elven realms: 3 before (the three Gala rows), 2 after (Gala, God Forest).

## 12. Gameplay role

**Mechanics.** *Lands of the Sun* ([LS]) stays: the peaceful start, Lorien's counsel, the Noon Council, the Mirror of First Rain, Lorien himself, the old lords' last march, Afrit's agents. Changes (P): the realm list shrinks to ten; the Noon Council's seats become seven Sunhot realms plus Gala and Goodin as guests; the old lords' last march (4A 1757) now meets Zol's servant, not Zol ([OD]); the Sunfolk majority gives the Lands of the Sun real manpower for the first time, but only Goodin raises it freely, while the Sunhot realms must ask their Sunfolk villages through a decision.

**Focus trees ([FT]).** `gala` (82 focuses) stays; `regional_the_lands_of_light`, `regional_elvana`, `regional_goodin` stay; `regional_heaven` is renamed for Yeni Alang, `regional_godland` for Tor Luni, `regional_hengyang` for Soyano; `regional_poyang` is folded into Soyano's tree; `shared_lands_of_the_sun` (39 realms) shrinks to Igara, Ihuy and the God Forest.

**Events (P).** "A Ship From the Storm" (the stranger's arrival, hidden identity); "The Watchers See Wings" (angels over Yeni Alang); "Hol Smokes"; "The Keepers Close the Wood"; "A Question for Gala" (Afrit's agent asks about the stranger, hidden).

**AI (P).** No realm declares war; the Noon Council answers threats with ships and envoys; Gala follows the vault's path unless the player diverges.

## 13. Questions for the owner

1. **The Lands of Light's "border with the East".** The world bible, the eastern spec and the Lands of Light tree describe a border with Miaed and Alerhia and a Sand Road ending at the Sun Gate ([WB] §7; [EK] §3; [FT] `regional_the_lands_of_light`), but in the game layout the Lands of the Sun lie in the far south-west corner, far across the sea from the East and the South Lands ([GM] `land_lands_of_the_sun`). The drawn Sunhot sheet also carries Dark Lands names (Goldoroth Mountains, Dark Gate, Belonton Border, Bold Borders, Beriath) ([LBL] Sunhot), which shows how the sheets once touched. May the Lands of the Sun be reached only by sea, as this dossier assumes?
2. **The Sunfolk majority.** May men be the great majority of the Lands of the Sun, with the tall Sunhot elves few and ruling their sanctuaries?
3. **The God Forest Keepers.** Are they elves of their own, Sunhot, or Gala?
4. **Flame and the Great Volcano.** The world bible puts the realm Flame "below the Great Volcano", but the model places the Great Volcano on the island of Hol and Flame on the mainland's south edge ([GM] `volcano_great`, `site_flame`). Which is right?

### Renamed labels (owner decisions applied directly; former label kept)

| Former label | Reason | New name | Language and meaning |
| --- | --- | --- | --- |
| Heaven | real-world religious name | **Yeni Alang** | Sunhot "high valley" |
| Godland | borrowed name | **Tor Luni** | Sunhot "white stone" |
| Hengyang (country, island) | a real-world city name | the island **Ossi Luni** in Soyano | Sunhot "white harbour" |
| Poyang (country, island) | a real-world lake name | the island **Yala Lisi** in Soyano | Sunhot "spring fields" |
| The Seas of Light | plural; pairs with the Ember Lands' death-seas | **the Bright Sea** (*Sala Aila*) | Sunhot "bright sea" |
| The Yellow Sea | a real-world sea name | **Sala Olar**, "the Golden Sea" | Sunhot |
| The Sea of the Dreams | repeats "Dreamland" | **Sala Nyel**, "the Moon Sea" | Sunhot |
| Sun God Land, Godson, Godton, Godrela, Dreamland, Sunny, Him, Via, Helen, Land of the Sun | repetitive, placeholder-like or borrowed | merged (section 11) | |
| Sunhot Grasslands, Sunhot Gate | owner's rename of 19 October | **Sun Grasslands**, **Sun Gate** | |

## Roots and signs (proposed, K67)

Written for the owner's decision K67 (25 October 2026): every realm carries the ancient history that built its culture and the sign born of it, so that its banner is its own sign and carries its own story. The full texts are the `roots` and `sign` of each realm in [lands_of_the_sun.json](../../../tools/content/data/world/history/lands_of_the_sun.json), the vault note is [Roots of the Lands of the Sun](../vault/07%20-%20History/Roots%20of%20the%20Lands%20of%20the%20Sun.md), and the focus-branch, identity and event proposals are in [realm_roots/lands_of_the_sun.md](../../specs/02_lore/realm_roots/lands_of_the_sun.md). Everything in this section is **P**; the open points stay open and are listed in the vault note.

| Realm | Root | Sign (the flag device) | Label |
| --- | --- | --- | --- |
| **Gala** | The court's memory begins with the First Rain and the spring of the Mirror, where a white hind drank first; no Gala hunts a deer, and no vision is said plainly. | A white hind with her head lowered to drink, on deep harbour blue. | P |
| **The Lands of Light** | The first Sunhot built their sanctuaries with a tall door facing noon; the noon-door of Eldoga is their oldest sign, and the Radiant Speaker was first chosen to share water in the drought of 1A 840. | A tall narrow doorway with the noon sun standing in it as a plain gold disc, on sanctuary white. | P |
| **Elvana** | The healers of the cape learned from the white silk-moth that its thread closes wounds, and became the Sunhot's weavers and healers. | A white silk-moth with its broad wings spread, on deep loom violet. | P |
| **Igara** | The sun-cranes danced on the dry shallows until the rain came, and the shrine's keepers dance it in every drought. | A sun-crane dancing with its wings raised and one leg lifted, in crane white on shallows gold. | P |
| **Yeni Alang** | The terrace-folk learned that when every ribbon hangs still the sky is clearest; on such a day the first watcher saw wings. | A tall pole with one long ribbon hanging straight down from its head, in white on clear sky blue. | P |
| **Tor Luni** | The quarriers found the standing stones raised by nobody remembered and swore never to cut them, breaking their first chisels at their feet. | The two halves of a broken quarrier's chisel, the bladed half set point downward below the handle half with a gap between them, in quarry white on deep sea violet. | P |
| **Ihuy** | When Hol's ash fell in 3A 66, seven canoes, one from each island, fed them all. | A long outrigger canoe seen from the side with seven paddles held upright, in pearl white on ash grey. | P |
| **Soyano** | Every white ship's keel is measured from the Mother-Keel of the first white ship. | A bare curved white keel with its stem and stern posts rising at either end and no planks, on deep tide blue. | P |
| **Goodin** | The Sunfolk landed as boat-folk driven out by the Long Grief and walked up to the first sanctuary with their spears reversed, as guests who would fight for their hosts. | A spear reversed, its point downward resting on a ground line, in ash brown and iron grey on harvest gold. | P |
| **God Forest** | The Sunhot believe the wood grew from one seed the Keepers planted; the Keepers answered the Noon Council with a living vine and a winged seed inside it. | A great winged seed, a single seed with one long curved wing, in pale leaf green on deep forest green. | P |

## 14. Sources

| Key | File and heading |
| --- | --- |
| [AR] | `docs/lore/vault/05 - Geography/Aoaz and Its Regions.md` (Lands of the Sun row) |
| [PA] | `docs/lore/vault/04 - Peoples/Peoples of Aoaz.md` (Great Folk: Sunhot, Gala, God Forest Keepers, angels; Mortal peoples: Goodin Sunfolk; First Age ethnic history) |
| [LO] | `docs/lore/vault/03 - Figures/Lorien.md` |
| [MF] | `docs/lore/vault/08 - Artifacts/Mirror of First Rain (proposed).md` |
| [A1], [2R], [A4] | `docs/lore/vault/07 - History/The First Age of Aoaz.md` (§5 to §7); `Second Age Canon Register.md`; `The Fourth Age of Aoaz.md` (§IV to §VI, §XI, §XIII, follow-up decisions) |
| [4R], [FC], [C48], [ER], [WLC] | `docs/lore/vault/07 - History/Fourth Age Canon Register.md`; `Fourth Age Chronology.md` (V); `The Campaign of 4A 1748.md` (The Lands of the Sun); `The Elven Refusal.md`; `War of the Last Crowns.md` |
| [OC] | `docs/zin-handoff/01-CONTEXT-AND-CANON.md` §2.4 (Zol's servant), §3 (Lao as belief) |
| [OD] | Owner decisions of 24 October 2026 relayed by the coordinator (renames; Kusven as Zol's servant; the twelve main and the lesser New Gods; the dead are Zol's; no exact ages) |
| [GM] | `tools/content/data/geography/aoaz.json` (ids as cited) |
| [GMS] | `docs/specs/01_map/05_geography_model.md` (§2 Lands of the Sun; §2 resource table; §6) |
| [DEM] | `tools/content/data/world/demography.json` (Lands of the Sun region, peoples, countries, settlements) |
| [WB] | `docs/specs/02_lore/05_world_bible.md` (§2 Sunhot elves; §3.1 Goodin Sunfolk; §3.2 Gala Elves; §3.3 Sunhot cultures; §4; §6.12; §7) |
| [LANG] | `docs/specs/02_lore/06_languages.md` (§1, §2, §3.14 Galic, §3.15 Sunhot, §8 culture rules); `languages.json` (`sunhot`, `galic`) |
| [ROS], [LBL] | `tools/content/data/countries.json` (scan Sunhot); `tools/content/data/labels.json` (Sunhot) |
| [BC] | `docs/lore/sources/bestiary_cards_part2.md` (card 50 Angel) |
| [LS] | `docs/specs/04_mechanics/lands_of_the_sun.md` (§1 to §8) |
| [EK] | `docs/specs/04_mechanics/eastern_kings.md` (§3) |
| [FT] | `docs/design/focus/*.json` (gala, regional_the_lands_of_light, regional_heaven, regional_godland, regional_hengyang, regional_poyang, regional_elvana, regional_goodin, shared_lands_of_the_sun) |
