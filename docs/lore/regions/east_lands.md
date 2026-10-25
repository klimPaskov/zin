# Regional dossier: the East Lands

**Requirement:** R-19, with R-21, R-24 (the east is not a field of interchangeable states), R-26 and R-29.
**Status:** Draft of 24 October 2026. Everything not marked **established** is **proposed** (decisions L1 to L3).
**Labels:** **E** established (source key in section 14), **P** proposed, **O** open in canon, **hidden** never public before its story flag (here: Afrit and his council).
**Owner decisions of 24 October 2026 applied ([OD]):** names from other fiction or real myth (Gondolin, Avalon) are replaced directly; drawn labels that do not fit are renamed with the former label kept; the lands south of the South Lands, home of devils, demons and beings of fire and endless suffering, are reference names only and lie off the map; devils are bound to their bodies and return only by the lava rite; gunpowder weapons are common in some realms; no exact age of any being is stated.
**Scope:** the East Lands proper. The great desert (the Noris Desert's southern belt and the Sun Desert) is the South Lands and has its own dossier, [south_lands.md](south_lands.md); Miaed, which the roster files under the East Lands sheet, is treated there.

## 1. Overview

Across the long Rift Sea from the elves lies the richest and most divided land of Aoaz ([C48]). A white snow coast faces the Kusmeel in the north; the steaming Hot Lake fills the middle with fishing cities and salt pans; caravan roads run from the wells of the Noris camel-kings to the bronze-roofed markets of the merchant princes of Stabilo; old river kingdoms with stair-temples line the rift; and in the south-east a mountain mass of black volcanoes, the greatest in the world, smokes over red clay country (P). Men of the East first met Aenor's traders in the First Age, and some of their kings fought for Volgan while others did not ([A1] §2, §4). In 4A 1748 every eastern court is at peace and courted by Noris or Stabilo, and every eastern city has a generous temple of the Deliverer whose friends lend money to princes in trouble (hidden: the temples are Afrit's eastern branch, [AH]). Within a decade, an eastern coalition will cross the rift, and the god-king of Aenor will flee here and be proclaimed King of the East over the courts that kneel ([WLC], [A4] §IX).

## 2. Physical character

| Item | Value | Source |
| --- | --- | --- |
| Extent | The eastern mainland from the rift (x about 0.78) to the Burning Rim at the east edge (x 0.986), y 0.33 to the south edge; 1,352,048 square pixels, the largest region of the map after the Cold Lands | [GM] `region_east_lands`, `edge_east` |
| Climate | Arid to semi-arid with hot summers; snow on the north coast; monsoon rains on the Hot Lake; a volcanic south-east | [GM], [GMS] §2 East Lands |
| Terrain | Desert 30%, plains 22%, mountain 20%, hills 13%, forest 10%, marsh 2%, towns 2%, jungle 1% | [GM] |
| Fertile ground | The Hot Lake shore, the Mora and Ernois Coast (`plain_mora`, "the best farmland of the East Lands"), the Delbiz Grasslands (`plain_delbiz`), the northern coast plain (`plain_gondolin_coast`), the caravan oases | [GM] |

**Ranges.** The Melty Mountains (`range_melty`, drawn Melty and Militiv Mountains), a very long glacier-capped range on the east edge that runs off the map in the north-east, crossed only by the glacier Melty Pass (`pass_melty`) to the Burning Rim's edge road. The Woqood Spires (`range_woqood_alps`, P name), ice-capped along the northern snow coast. The Ernois Mountains (`range_ernois`, P), a coral-red highland east of the Hot Lake. The Noris Rise (`range_noris_rise`, P), a brown ridge across the desert road with the Noris Gap (`pass_noris_gap`) on the Salt Road. The Reeto Heights (`range_reeto`, P), black-rock mountains on the rift coast above the southern lobe, with the smoking Reeto Fire (`volcano_reeto`). The Hardtmuth Mountains (`range_hardtmuth`, drawn Hardtmuth and Mountains of Fire), a volcanic chain on the west coast of the southern lobe with the Hardtmuth Fire, the Fire Mountain and the Hardtmuth Pass on the Sand Road (`volcano_hardtmuth`, `volcano_fire_mountain`, `pass_hardtmuth`). The Drak Mountains (`range_drak`), a brown volcanic ridge with the Drak Furnace (`volcano_drak`). And the **Smoking Teeth** (`range_hellfire`, P name), "the greatest mountain mass of Aoaz": the massif of Mount Ergo (`volcano_ergo`, the highest cone of the east), Mount Argul (`volcano_argon`), the vent field of the Red Lands (`volcano_avalon`, drawn "Avalon Fires"), the Plutondo Vents (`volcano_plutondo`) and the Pego Mountains and Pego Cones (`range_pego`, `volcano_pego`) on the south edge ([GM]).

**Water (one name each).**

| Water | Model id | Name used here | Note |
| --- | --- | --- | --- |
| The northern ocean | `sea_zol_ocean` | **Kusmeel** (E) | Its black islands are Zol's Mistake ([ZM]) |
| The rift | `sea_magical_ocean`, `zone_rift` | **the Rift Sea** (P) | The East sheet's "Khadon Ocean" and the Magical sheet's "The Magical Ocean" are one water ([magical_lands.md](magical_lands.md)) |
| The rift's southern reach | `sea_mushroom_seas` | **the Reeto Sea** (P; drawn "Reeto Seas") | Former labels Mushroom Seas, Reeto Seas |
| The gulf under the Smoking Teeth | `gulf_hellfire` | **the Gulf of the Teeth** (P) | Lava-warmed water; the drawn "Flaming Ocean" and "Ocean of the Hellfire" are this one gulf |
| The south-west ocean | `sea_sun_ocean` | **Ocean of the Sun** (drawn) | The South Lands' coast |
| The great lake | `lake_hot` | **the Hot Lake** (drawn) | About 330 by 315 pixels; hot springs, steaming reed shallows (`marsh_hot_lake_reeds`), salt pans |
| Rivers | `river_gondolin`, `river_fosoco`, `river_mora`, `river_melt`, `river_noris_wadi` | **Shaar-Sheek** "Ice River" (Noric; former model name Gondolin River), **Fosoco River**, **River Mora** (a seasonal wadi), **the Meltwater**, **Noris Wadi** | All P |
| Straits and capes | `strait_rift_narrows`, `strait_rift_north`, `cape_gondolin`, `bay_rift_delbiz` | **the Rift Narrows**, **North Mouth of the Rift**, **Naamis Cape** (former model name Gondolin Cape), **Delbiz Bay** | P |

**Forests and other land.** The Flaming Forests (`forest_flaming`), a dark red-leaved wood east of the Noris Desert; the Obmi Jungle (`forest_obmi`); the Mora Woods; the Alerhia Woods; the Oreton Woods; the wood of the north coast (`forest_gondolin`, renamed **the Naamis Wood**). The white snow country of Woqood (`ice_woqood`). The red sands of the Alodale Desert (`desert_alodale`) and the Plutondo Dunes (`desert_plutondo`).

**Hazards.** Dust storms and dry years on the roads; the boiling springs and steam-shallows of the Hot Lake; lava flows and ash from the Smoking Teeth (four active cones); devils on Mount Ergo (section 9); ogre raiders in the Reeto Heights (P); blizzards on the Woqood coast; and the still black sea of the north, from which, in 4A 1744, fishermen report black ships ([FC] IV, P date).

**The edge and beyond.** The map ends in the impassable lava cliffs and dune walls of the Burning Rim (`edge_east`) and, in the south, the Line of Sun (`edge_south`) ([GM]). **Owner decision ([OD]):** the lands south of the South Lands are the home of devils, demons and beings of fire and endless suffering, and they appear only as reference names, off the map. The East sheet's drawn labels that read as those lands become such reference names (section 13): the Unforgivable Lands, the Lands of Burning Men, the Devil's Place, the Altering Lands of Death, the Upland of Lava and the Burning Lands of Ocellios. Eastern people speak of them as belief and dread, never from a traveller's report.

## 3. Inhabitants

| People | Culture (data id) | Language | Where | Status |
| --- | --- | --- | --- | --- |
| Men | Noris Camel Warriors (`noris_riders`) | Noric, desert dialect | Noris, the desert wells | E Noris camel warriors ([PA]); P culture |
| Men | Woqood sealers (P, new) | Noric, a northern dialect | The Woqood snow coast | P; the roster gives this coast the desert culture, which does not fit snow |
| Men | Sea-crown folk of Naamis (P; the roster's `noris_riders`) | Noric | The north coast plain | P |
| Men | Caravan Princes (`caravan_princes`) | Stabilic | Stabilo, Drak, Azano, Mostok, Obmi, Pornivior | P |
| Men | River-Kings of the East (`river_kings`) | Alerhic, court dialect | Alerhia, Delbiz, Erco, Plutondo | P |
| Men | Lake Road Cities (`lake_road_cities`) | Alerhic, lake dialect | Ostoroth, Mora, Kersian | P |
| Men | Red Lands Tribunes (`red_lands_tribunes`) | Alerhic, clay dialect | Rhachia (former label Avalon) | P |
| Men | Island fishers of Orato (P) | Noric | Orato and Fladev | P |
| Ogres | Ogre clans of the Reeto caves (P) | none recorded | The Reeto Heights | E that ogres exist ([PA]); [BC] card 22 (caves and mountains, few, meat-eaters); P placement |
| Devils | none (individuals) | none recorded | Mount Ergo and Mount Argul | P placement after [BC] card 46 ("Ergos"); owner decisions on devils ([OD], [OC] §2.6) |

**Languages.** The Eastern family's three tongues ([LANG] §1): Noric (long vowels, q and kh, hyphenated constructs), Stabilic (clusters pl pr tr st, endings in -o -a -io) and Alerhic (rh and th, kingdoms in -ia). The family shares roots, which is why Noric *biir* "well", Stabilic *bro* and Alerhic *biria* look alike: one people before the roads (P). Aenoran is the trade speech of the caravan towns.

**Population.** The demography model gives the East Lands 21.5 million in 35 countries and 337 states, with Postondoroth at 240,000 and Furvior at 210,000 ([DEM] East Lands). Without Miaed (South Lands), 20.7 million. Revised (P): **about 19.8 million**, because the Woqood snow coast cannot carry ten lake-city states (the model gives Cream alone 599,100) and the Smoking Teeth uplands are emptied by ash and devils. People live where water is: the Hot Lake shore and the Mora coast (up to 110 per square kilometre), the river valleys of the rift, the oasis strings of the Salt Road; the open desert holds under one per square kilometre ([DEM] East Lands).

## 4. Livelihoods and resources

| Resource | Where | Notes |
| --- | --- | --- |
| Salt and dye | The Hot Lake pans; the Salt Road | Noris's charter road ([EK] §1) |
| Gold, bronze | Stabilo's southern hills; the Gold Road | P |
| Grain, fruit | The Mora and Ernois Coast, the Delbiz Grasslands, the river valleys | |
| Camels | Noris | The camel-kings' wealth |
| Horses | The Delbiz Grasslands | P |
| Fish, cedar, lanterns | The Lake Road cities | [WB] §7 |
| Furs, seal-fat, ivory | The Woqood coast | P |
| Black powder | Drak's forges at the Drak Furnace; Stabilo's companies | Owner decision that gunpowder weapons are common in some realms ([OD]); P that the caravan princes are such realms: bombards on their walls, hand-tubes in their hired companies; the Noris riders despise it |
| Game resources | Chromium in the Hardtmuth; aluminium in the Smoking Teeth and Pego; bitumen under the Noris Desert; rubber in the Obmi Jungle | [GMS] §2 resource table |
| Tolls | The five caravan roads | [EK] §1 |

## 5. Institutions and political forms

The East is deliberately not one kind of state (P):

| Realm | Form |
| --- | --- |
| Noris | Camel-kingship: the king chosen by the well-lords from one line, war-leader of the tribes ([WB] Noris) |
| Stabilo | Merchant principality: a Prince first among a bench of houses ([WB] Stabilo) |
| Alerhia | River kingship: a king who takes his river's name, with a temple scribe-council |
| Naamis | Sea crown: a queen and a council of ship-masters (P) |
| Drak | Mining princedom of the forge-houses |
| Rhachia | Tribunes' commonwealth: village heads elect a tribune; the towns rose against a king in 4A 1719 ([FT] `regional_avalon`, P) |
| Erco | Mountain kingdom with mines and forts |
| Plutondo | Princedom of the southern valley |
| Ostoroth | Highland kingdom of the Lake Road |
| Mora | Lake-city council under a Speaker |
| Delbiz | Grassland horse-kingdom |
| Kersian, Mostok | Free cities at road junctions, ruled by their market councils |
| Azano | House-city of one merchant family |
| Obmi | Jungle-edge city of rubber and timber traders |
| Pornivior | City under the shadow of the devils' mountains, which pays the "fire-tithe" to keep them away (P) |
| Woqood | League of sealers' clans |
| Orato | Island fishing lordship |

**Leagues (E working table, [GP]):** the Noris Treaty (Noris with the realm formerly called Gondolin, now Naamis) and the Stabilo Pact (Stabilo with Drak). **Hidden:** the Hidden Council's eastern branch has courted these courts for four centuries; its public face is the temples and the generous friends ([AH], [EK] §4).

## 6. Beliefs and faiths

| Faith | Held by | Belief | Truth versus belief |
| --- | --- | --- | --- |
| The Well-Oath | Noris, Naamis, Woqood (P), Orato | Sharing water makes kin; the New Gods are honoured at wells in the form of their rain ([WB] §4) | |
| The Creed of the Honest Scale | Caravan princes | An honest weight pleases the New Gods | |
| The River Temples | River-kings | The river is the oldest god we can see; the New Gods in temples above the flood-line | The twelve main New Gods answer the twelve needs of mortals, and lesser New Gods also exist ([OD]); no names are invented. |
| The Lake Litany | Lake Road cities | Merchants and fishers pray together at the water | |
| The Red Hearth | Rhachia | The red clay is the bone of the first mothers | |
| The Faith of the Deliverer | Every city's temple | The Deliverer saved Aoaz and lends to the needy (E public worship) | **Hidden:** the Deliverer is Afrit and the temples are his eastern branch ([AH]). |
| The fire-tithe (P) | Pornivior and the Smoking Teeth villages | Devils keep away from those who pay the mountain | Belief and custom; devils are corrupted Lesser Spirits who once served an Old God and escaped to Aoaz, and many serve Volgan ([OC] §2.6); a tithe does not bind them. |

**Beliefs about the burning south (belief only).** The southern peoples say the burning lands beyond the desert are where devils and demons dwell and the damned suffer without end; caravan-masters swear no road goes there. These are reference names and dread, not travellers' knowledge ([OD]).

**Holy sites (P).** The Seven Wells of Noris; the Hall of Scales at Postondoroth; the Flood-Court and the temple stair of Porrenva; the lake-shrines of Mora and Ostoroth; the kiln-shrines of Rhachia.

## 7. History

| Date | Event | Label |
| --- | --- | --- |
| Before 1A | The river valleys of the rift coast are as old as any kingdom of men; the Eastern family of tongues splits into desert, trade and river speech. | P ([WB] River-Kings) |
| Before 1A | The rift-coast elves trade with eastern men across the rift. | P |
| About 3,000 to 2,300 BA | The Bridge Kingdom (Tarkia) holds the joined shores: the western East Lands, the isthmus with Qadurum astride it, and the Bridge Road west along the southern edge of the elven woods into the south-east of the Middle Lands. Its stair-temples stand above the flood-line, and its scribes write the reed letters from which the Alerhic script descends. | Established (owner, 25 October 2026; decision K64) |
| About 2,300 to 2,250 BA | A war between two heirs breaks the isthmus; the sea comes in from the Gorlab and Reeto seas, and within a lifetime the Rift Sea lies between the shores. What broke the bridge stays a mystery, with the temple chronicles and the rift-coast elves' rolls in rivalry. | Established (owner, 25 October 2026; decision K64); the cause Open |
| After the Breaking | Qadurum splits: its western half lies under the Mushroom Forest beside Luv-zhise, and its eastern half under the grass near Furtonlin, where the horse-fair is held among fallen pillars. The temple scribes tell that Alerhia's first stair was raised above the flood-line so that the river and the gods would each have a place. | Established (owner, 25 October 2026; decision K64) |
| 1A, first half | Aenoran traders make contact with the peoples of the East, the Easterlings. | E ([A1] §2) |
| 1A about 500 | The Kalioth kings rise in the mountains of the southern East. | Established (owner, 25 October 2026; decision K64) |
| 1A about 1000 | The Kalioth kings proclaim Rhabtarkia, the Greater Bridge Kingdom, and swear to rejoin the shores; the Alerhic river crowns defy them. | Established (owner, 25 October 2026; decision K64) |
| 1A, before Volgan's war | Devils, corrupted Lesser Spirits who once served an Old God, have escaped to Aoaz; some lair on the Smoking Teeth cones. | E devils' nature ([OC] §2.6); P place and date |
| 1A about 1150 to 1500 | Volgan allies with rulers of the eastern and southern lands; eastern client rulers give him ships and landing sites. Not all Easterlings join him. | E alliances selective ([A1] §4); P ships |
| 1A 1214 | Alerhia refuses the Black Tribute, which the Kalioth kings pay to Volgan instead. | Established (owner, 25 October 2026; decision K64) |
| About 1A 1500 to 1675 | The Kalioth Crown holds Herez, Noleksun and the South Pass with Volgan for about a century, and for that century its claim to be Tarkia restored looks like the truth. | Established (owner, 25 October 2026; decision K64) |
| By 1A 1675 | Eastern men fight on both sides; after Dardan the eastern clients fall with Volgan's host. | E ([A1] §4); P aftermath |
| By 1A 1675 | At Dardan the Kalioth host stands with Volgan's and dies there. The provinces of the Kalioth Crown beyond the Melty Pass fall silent, and what became of them stays a mystery. | Established (owner, 25 October 2026; decision K64); their fate Open |
| 2A 12 | After Dardan the western garrisons starve, the mine-lords of the southern mountains shut the passes against the beaten host and besiege the last Kalioth king in his hall, and Erco is founded. The last king's iron diadem is walled up in the hall of Barzoth by mine-lords who will neither wear it nor melt it. | Established (owner, 25 October 2026; decision K64) |
| 2A | The East is far from Elzon's war; its kings fight their own wars over the rivers. | P |
| 3A | The East trades with Elzon's Aenor through the rift ports and the Lake Road; nobody in the East is conquered by him. | P |
| 4A 600 to 780 | The great caravan roads open; Noris and Stabilo grow rich on them and become rivals. | P ([FC] II) |
| about 4A 1300 | The Hidden Council's eastern branch begins to court the eastern courts. | P ([FC] III); hidden |
| 4A 1500s | Drak's forges learn to make black powder from the Furnace's sulphur; bombards spread to the caravan cities. | P (owner decision that gunpowder is common in some realms, [OD]) |
| 4A 1719 | The towns of the Red Lands rise against their king and found the tribunes' commonwealth. | P ([FT] `regional_avalon`) |
| 4A 1744 | Fishermen of the Kusmeel islands tell of black ships; no court believes them. | P ([FC] IV); Orato's fishermen P |
| **4A 1748** | **Start: peace.** The roads are open; nobody is at war ([EK] situation). | owner, [C48] |
| 4A 1755 | The eastern coalition crosses the rift and threatens the Magical Lands and the Middle Kingdom. | E ([WLC], [A4] §IX); P date |
| 4A 1756 | Afrit abandons Aenor and takes command of an eastern dominion; he and his allies proclaim him **King of the East**, though many eastern states resist. | E ([A4] §IX, [4R]); P date |
| 4A 1758 | Afrit returns west with a new eastern host. | E ([A4] §XIV); P date |
| 4A 1759 | Afrit dies; the eastern rulers who backed him face what follows, which is open. | E death; O aftermath ([A4] follow-up 9) |

**Trade routes (P, [EK] §1):** the Salt Road (Noris to the Hot Lake pans), the Gold Road (Stabilo's mines to the lake and to Alerhia), the Rift Road (north and south along the rift shore), the Lake Road (round the Hot Lake), the Sand Road (south-west into the South Lands).

**Local legends (P).** The camel-kings say the Seven Wells were dug by seven brothers who quarrelled over an eighth. The salt-boilers of the Hot Lake say the lake is warm because something under it breathes. The people of Pornivior say a devil once took a whole caravan and left only the scales.

**Where history can diverge (L3).** The coalition can fail to form or stop at the Rift Narrows; Noris or Stabilo can unite the East without Afrit, or refuse him and lead the Free Crowns of the East; the courts can kneel or not ([EK] §6, §7).

## 8. Neighbours and relations

| Neighbour | Relation | Why |
| --- | --- | --- |
| The Magical Lands | Old trade, rising ambition | E coalition threat ([WLC]) |
| The Middle Kingdom | A market; the god's temples | P; hidden |
| The South Lands | The Sand Road; Miaed's passes | [south_lands.md](south_lands.md) |
| Zol's Mistake | The black isles of the north coast | E ([ZM]); P fear |
| Inside: Noris and Stabilo | Rivalry over the roads | E working table ([GP]) |
| Inside: everyone and Pornivior's devils | Dread | P |

## 9. Wildlife and creatures

| Creature | Habitat | Effect | Source |
| --- | --- | --- | --- |
| Camels | The desert roads | The caravans' and the Noris riders' mounts | E camel warriors ([PA]) |
| Devils | Lairs on Mount Ergo and Mount Argul | Huge (20 to 30 metres), few, evil; strength, claws, teeth, horns, wings and fire; many serve Volgan; bound to their bodies, and a dead devil returns only by the lava rite, its skull thrown into lava ([OD]) | [BC] card 46; [OD]; [OC] §2.6 |
| Ogres | Caves of the Reeto Heights | Few, near-blind meat-eaters with clubs and thrown stones; raid the Rift Road; hired as caravan guards by the bold | [BC] card 22; P placement |
| Lake-steam eels (P) | The hot shallows of the Hot Lake | The salt-boilers' food and the only fish that lives in the hottest water | P |
| Ember-moths (P) | The Flaming Forests | Swarms in the dry season that strip the red leaves; caravans wait them out | P |
| White seals and snow bears (P) | The Woqood coast | The sealers' livelihood and danger | P |
| Sand golems | The Noris Desert's edge | See [south_lands.md](south_lands.md) | [BC] card 7 |

## 10. Settlements

| Place | Realm | Why there | Status |
| --- | --- | --- | --- |
| Furvior | Noris | A hill of wells where the Salt Road meets the Sand Road; 210,000 | W seat ([GP]); P |
| Postondoroth | Stabilo | The Gold Road's great harbour-market; 240,000 | W seat ([GP]); the roster puts it in Drak today, to be moved ([EK] geography) |
| Porrenva | Alerhia | On the river above the flood-line; 160,000 | P ([DEM]) |
| Atonto | Erco | On its river; 95,000 | P ([DEM]) |
| Vobibiz | Plutondo | The southern valley's river; 110,000 | P ([DEM]) |
| Ohitus | Ostoroth | On the Lake Road; 70,000 | P ([DEM]) |
| Gonnois | Mora | On the Hot Lake; 60,000 | P ([DEM]) |
| **Duum-Saah** (Noric "coast hall") | Naamis | The best harbour of the north coast plain; 45,000 | P; replaces the working "Reerenta" |
| Pordoce | Rhachia | The red-clay kiln-city; 35,000 | P ([DEM]) |
| **Castronuro** (Stabilic "fire fort") | Drak | Under the Drak Furnace, where the forges get their sulphur | P; Drak's seat once Postondoroth moves to Stabilo |
| Cereosa | Mostok | The central road junction; 40,000 | Drawn city label ([LBL]) |
| Furtonlin | Delbiz | On the rift coast; 28,000 | P ([DEM]) |
| Kerdoco | Obmi | At the jungle edge; 30,000 | P ([DEM]) |
| Pehami | Woqood | On the Kusmeel coast; 25,000 | P ([DEM]) |

## 11. Roster proposal (proposed)

**Before:** 35 rows on the East Lands sheet ([ROS] scan South-Earth), 34 without Miaed; 0 elven. **After:** 18 countries; 0 elven.

| Name | People and culture | Political form | Capital | Extent | Why it exists |
| --- | --- | --- | --- | --- | --- |
| **Noris** | Men, Noris camel warriors | Camel-kingship | Furvior | The northern desert, the wells, the Salt Road; absorbs The Moco and Mylunur | E great power ([GP]) |
| **Stabilo** | Men, caravan princes | Merchant principality | Postondoroth | The southern hills and the Gold Road; absorbs Arcon, Furro, Olor, Oreton | E great power |
| **Alerhia** | Men, river-kings | River kingship | Porrenva | The great river valley on the rift | Drawn great kingdom ([C48]) |
| **Naamis** (former label Gondolin) | Men, sea-crown folk | Sea crown | Duum-Saah | The north coast plain; absorbs Hacsen and Vigodor | E Noris's ally ([GP]); Gondolin is a Tolkien name ([OD]) |
| **Drak** | Men, caravan princes and forge-houses | Mining princedom | Castronuro | The Drak Mountains | E Stabilo's ally |
| **Rhachia** (former label Avalon) | Men, Red Lands tribunes | Tribunes' commonwealth | Pordoce | The Red Lands | Drawn "Avalon / The Red Lands"; Avalon is Arthurian ([OD]); Alerhic *rhachia* "red" |
| **Erco** | Men, river-kings | Mountain kingdom | Atonto | The southern mountains and river | Drawn great kingdom |
| **Plutondo** | Men, river-kings | Princedom | Vobibiz | The southern valley under the Plutondo Vents | Drawn great kingdom |
| **Ostoroth** | Men, Lake Road cities | Highland kingdom | Ohitus | The north-east lakes; absorbs Ernois, Grova, Nethnu | Drawn "Lands of Ostoroth" |
| **Mora** | Men, Lake Road cities | Lake-city council | Gonnois | The Hot Lake's east shore and the Mora coast; absorbs Eraver | Drawn |
| **Delbiz** | Men, river-kings | Grassland horse-kingdom | Furtonlin | The Delbiz Grasslands and the Fosoco River; absorbs Fosoco | Drawn; the short name drops "Grasslands" from the country name |
| **Kersian** | Men, Lake Road cities | Free city | Osrale | A road junction | Kept as one of two free cities |
| **Mostok** | Men, caravan princes | Free city | Cereosa | The central road junction | Drawn city Cereosa |
| **Azano** | Men, caravan princes | House-city | Ceralon | A southern trade city | Kept for its house |
| **Obmi** | Men, caravan princes | Jungle-edge city | Kerdoco | The Obmi Jungle's edge | Drawn Obmi Jungle |
| **Pornivior** | Men, caravan princes | City under the devils' mountains | Nerhuus | The slopes below Mount Ergo | Card "Pornyior" ([BC] card 46) |
| **Woqood** | Men, Woqood sealers | League of sealers' clans | Pehami | The snow coast; absorbs Cream and Lorvens | Drawn snow country |
| **Orato** | Men, island fishers | Island lordship | Nodoqood | Orato and Fladev | Drawn islands; the fishermen who see the black ships |

**Wild lands, not countries (P):** Mount Ergo and Mount Argul (devils; the card's "Ergos"), the Reeto caves (ogres), the high Melty glaciers, the Plutondo Dunes.

| Current rows | Change |
| --- | --- |
| Noris, Stabilo, Alerhia, Drak, Erco, Plutondo, Ostoroth, Mora, Kersian, Mostok, Azano, Obmi, Pornivior, Woqood, Orato (15) | Kept (some renamed or regrown) |
| Gondolin (Y12) | Renamed Naamis |
| Avalon (Y17) | Renamed Rhachia |
| Delbiz Grasslands (Y5J) | Renamed Delbiz |
| The Moco, Mylunur | Merged into Noris |
| Arcon, Furro, Olor, Oreton | Merged into Stabilo (interchangeable caravan cities) |
| Hacsen, Vigodor | Merged into Naamis |
| Cream, Lorvens | Merged into Woqood (a snow coast cannot hold lake cities) |
| Ernois, Grova, Nethnu | Merged into Ostoroth |
| Eraver | Merged into Mora |
| Fosoco | Merged into Delbiz |
| Fladev | Merged into Orato |
| Miaed | Moved to [south_lands.md](south_lands.md) |

**Counts:** 34 before (35 with Miaed), 18 after. Elven realms: 0 before, 0 after.

## 12. Gameplay role

**Mechanics.** *Eastern kings* ([EK]) stays: the five caravan roads, the Noris and Stabilo rivalry, lean and the leagues, temple loans (hidden branch), the coalition and the invasion of the Magical Lands, the King of the East and the Free Crowns. With 18 courts the lean table and the road waypoints must be redrawn: the Salt Road runs Furvior to Duum-Saah; the Gold Road runs Vobibiz, Postondoroth, Mostok, Kersian, Azano and Porrenva (P). New (P): **the fire-tithe** (Pornivior and Erco pay political power to keep the devils quiet; unpaid, a devil raid event hits a random Hellfire state); **black powder** (Drak and Stabilo start with a research bonus for forts and siege engines; the Noris tree can choose to adopt it or scorn it).

**Focus trees ([FT]).** `noris` (112), `stabilo` (111), `regional_alerhia`, `regional_gondolin` (renamed Naamis), `regional_avalon` (renamed Rhachia), `regional_drak`, `regional_erco`, `regional_plutondo`, `regional_ostoroth`, `regional_mora`; `shared_east_lands` shrinks from 24 courts to the eight small ones (Delbiz, Kersian, Mostok, Azano, Obmi, Pornivior, Woqood, Orato), with module branches for the sealers, the island watchers and the devils' tithe.

**Events (P).** "Black Ships Off Orato"; "The Mountain Asks Its Tithe"; "A Devil's Skull in the Lava" (a devil returns); "Powder at the Gate" (a Noris tribe refuses bombards); "The Generous Friends Offer a Loan" (hidden branch, [EK] §4).

**AI (P).** Noris and Stabilo compete by roads, not wars, until 4A 1750; Pornivior always pays the tithe; Woqood and Orato stay out of the coalition unless attacked.

## 13. Questions for the owner

1. **The burning south.** May the East sheet's labels the Unforgivable Lands, the Lands of Burning Men, the Devil's Place, the Altering Lands of Death, the Upland of Lava and the Burning Lands of Ocellios be the off-map reference names of the lands beyond the South Lands?
2. **Devils on the map.** The devil card places devils in "Pornyior" and "Ergos"; may a few lair on Mount Ergo and Mount Argul inside the map, with the city of Pornivior below them?
3. **Woqood's people.** May the snow coast get a northern sealers' culture of the Noric tongue instead of the desert camel culture?
4. **Unused drawn labels.** Shindor (also on the Sunhot sheet), Hardfich, Tumo, Luthuus, Finingrenros, Esiurth, the Lands of Liotus, the Blozan Lands and the Vodohool Forests ([LBL] South-Earth): may they become state and place names inside the eighteen realms (proposed: Hardfich a Hardtmuth town of Stabilo, Esiurth a Noris well-town, the Blozan Lands Plutondo's upland)?

### Renamed labels (owner decisions of 24 October 2026 applied directly; former label kept)

| Former label | Origin or reason | New name | Language and meaning |
| --- | --- | --- | --- |
| Gondolin (realm, river, wood, cape, coast) | Tolkien | **Naamis**; river **Shaar-Sheek**; **Naamis Wood**, **Naamis Cape**, **Naamis Coast** | Noric *naam* "sea" + *-is* "country"; *shaar-sheek* "ice river" |
| Avalon (realm, "Avalon Fires") | Arthurian legend | **Rhachia**; the vents **the Rhachia Fires** | Alerhic *rhachia* "red" |
| Shachihata (drawn region; also a demon kind in the vault, [PA]) | a real-world company name | **Ashkarith** for the demon kind; the region label becomes an off-map reference name | Infernal *ashkar* "fire" + *-ith* |
| Morodor (drawn region) | echoes Tolkien's Mordor | **Kalioth**, a dry upland of Erco | Alerhic *kalia* "dark" + *-oth* "high place" |
| Khadon Ocean, The Magical Ocean | two names for one sea | **the Rift Sea** | Common Speech |
| Flaming Ocean, Ocean of the Smoking Teeth | two names for one gulf | **the Gulf of the Teeth** | Common Speech |
| Mushroom Seas, Reeto Seas | two names, plural | **the Reeto Sea** | drawn |
| Delbiz Grasslands (country) | a landscape as a realm name | **Delbiz** | drawn |

## 14. Sources

| Key | File and heading |
| --- | --- |
| [AR], [ZM] | `docs/lore/vault/05 - Geography/Aoaz and Its Regions.md` (East Lands, South Lands rows); `Zols Mistake.md` |
| [PA] | `docs/lore/vault/04 - Peoples/Peoples of Aoaz.md` (Great Folk: Shachihata; Mortal peoples: Noris camel warriors; Other peoples: ogres) |
| [GP] | `docs/lore/vault/06 - Politics/Great Powers and Relations.md` (Noris, Stabilo rows) |
| [AH] | `docs/lore/vault/06 - Politics/Afrits Hidden Council.md` |
| [A1] | `docs/lore/vault/07 - History/The First Age of Aoaz.md` (§2, §4) |
| [A4] | `docs/lore/vault/07 - History/The Fourth Age of Aoaz.md` (§II, §IX, §XIV, follow-up decisions) |
| [4R] | `docs/lore/vault/07 - History/Fourth Age Canon Register.md` |
| [FC] | `docs/lore/vault/07 - History/Fourth Age Chronology.md` (II, III, IV) |
| [C48] | `docs/lore/vault/07 - History/The Campaign of 4A 1748.md` (The East Lands and the South Lands) |
| [WLC] | `docs/lore/vault/07 - History/War of the Last Crowns.md` |
| [OC] | `docs/zin-handoff/01-CONTEXT-AND-CANON.md` §2.6 (devils) |
| [OD] | Owner decisions of 24 October 2026 relayed by the coordinator (renames; the burning south off the map; devils' bodies and the lava rite; gunpowder; no exact ages) |
| [GM] | `tools/content/data/geography/aoaz.json` (ids as cited; `edge_east`, `edge_south`) |
| [GMS] | `docs/specs/01_map/05_geography_model.md` (§2 East Lands; §2 resource table) |
| [DEM] | `tools/content/data/world/demography.json` (East Lands region, countries, settlements) |
| [WB] | `docs/specs/02_lore/05_world_bible.md` (§3.1 eastern cultures; §4; §5 Noris, Stabilo; §6.10; §7) |
| [LANG] | `docs/specs/02_lore/06_languages.md` (§1); `tools/content/data/world/languages.json` (`noric`, `stabilic`, `alerhic`, `infernal`) |
| [ROS] | `tools/content/data/countries.json` (scan South-Earth) |
| [LBL] | `tools/content/data/labels.json` (South-Earth) |
| [BC] | `docs/lore/sources/bestiary_cards_part1.md` (card 7 Sand Golem, card 22 Ogre), `bestiary_cards_part2.md` (card 46 Devil) |
| [EK] | `docs/specs/04_mechanics/eastern_kings.md` (situation, geography, §1, §3 to §8) |
| [FT] | `docs/design/focus/*.json` (noris, stabilo, regional_alerhia, regional_gondolin, regional_avalon, shared_east_lands) |
