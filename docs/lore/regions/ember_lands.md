# Regional dossier: the Ember Lands, with the Abyss

**Requirement:** R-19, with R-14 (the Nether has its own dossier, [nether.md](nether.md)), R-21, R-23, R-26, R-28 (Volgan's country gets its own name) and R-29.
**Status:** Draft of 24 October 2026. Everything not marked **established** is **proposed** (decisions L1 to L3).
**Labels:** **E** established (source key in section 14), **P** proposed, **O** open in canon, **hidden** never public before its story flag.
**Owner decisions of 24 October 2026 applied ([OD]):** Nazerun is the old name of Nezer; devils are bound to their bodies and return only by the lava rite; the demon king has an original name and his seat is the Nether ([nether.md](nether.md)); Vez'nan is an old name of Volgan ([OC] §2.7); no country is named after its leader; gunpowder weapons are common in some realms; unfitting and borrowed labels are renamed with the former label kept; no exact age of any being is stated.

## 1. Overview

South of the Middle Lands, behind a belt of storms that kept the First Age's explorers out and an inland heat that kills, lie the Ember Lands: a volcanic island of grey plateau and burning ridges, the forested peninsula of Mirolon on the southern neck of the central landmass, a scatter of storm-beaten isles, and in the far south the Nether ([DL], [GMS] §2 Ember Lands). Volgan, the Great Spirit and principal dark lord, rules the island from Nafeher with grave hosts, demons, orcs, ogres, devils and necromantic orders; he has spent a century rebuilding behind the storms, and in 4A 1748 almost nobody outside Mirolon believes it ([DL], [C48]). Mirolon, the human kingdom he conquered in the First Age and lost after Dardan, keeps beacons lit toward the south; freeholds of salt-makers and fishers live between the two by paying tolls and saying nothing; three demon realms are sworn to Nafeher; and at the east tip of the island a chasm drops into the Abyss, where a huge rhinoceros-headed being called Roka once held a necklace that a thief carried away to the north ([AB], [RO], [NA]).

## 2. Physical character

| Item | Value | Source |
| --- | --- | --- |
| Extent | The main island (bbox x 0.577 to 0.627, y 0.800 to 0.913), the Mirolon peninsula (about x 0.64 to 0.70, y 0.70 to 0.82), the isles, and the added Nether island to the south; 80,032 square pixels in all | [GM] `region_dead_lands`, `land_dead_lands_island`, `peninsula_mirolon`, `land_nether_island` |
| Climate | Hot, dry, storm-lashed coasts; oppressive heat inland and to the south; storm season all year on the coasts | [GM]; E storms and heat ([DL] First Age campaign) |
| Elevation | Volcanic ridges at 5, a grey plateau at 2, chasms | [GM] |
| Terrain | Mountain 30%, hills 25%, desert 20%, forest 10%, plains 10%, marsh 5% | [GM] |
| Fertile ground | Mirolon's forest and marsh; elsewhere little | [GM] |

**The main island.** The Deadlands (`waste_deadlands`), a grey dry plateau, "hot, bare, storm-scoured", is the heart of Volgan's dominion, with Nafeher on it (`site_nafeher`). The Demonic Mountains (`range_demonic`, high peak 5), a burning ridge on the west, carry the Demonic Fire (`volcano_demonic_fire`, P). The Nether Mountains (`range_nether`, 5) run along the south-east with the great vent of the Nether Maw (`volcano_nether_maw`, P); the Abyss lies at the east end of this ridge (`chasm_abyss`, `site_abyss`, `cape_abyss` "Abyss Point"). Two dense dark woods lie below the Demonic Mountains (drawn "Death Forest" and "Hell Forest", `forest_death`, `forest_hell`; renamed in section 13). The scalding Ashwater (`river_dead_ash`, P) crosses the plateau.

**Mirolon.** A peninsula on the southern neck of the central landmass, nearly cut off from the Zilin Hills by the narrow Mirolon Neck inlet (`strait_mirolon_neck`) and separated from Volgan's island by the stormy Mirolon Sound, about 120 pixels wide (`strait_mirolon`) ([GM]; the model answers that Mirolon is not joined to the island by land, [GMS] §13 item 9). The Mirolon Mountains (`range_mirolon_mountains`, 4) cross it from west to east, with the Mirolon Passes (`pass_mirolon`) where they close the land neck from the Zilin side; the Mirolon Forests (`forest_mirolon`), the Great Swamp of Mirolon (`marsh_mirolon`), the River Mirolon (`river_mirolon`, P) and the Lake of Mirolon (`lake_mirolon`, on the Zilin side) give it the only good land in the region. The dark Nan Mountains (`range_nan`, 3) close its southern tip.

**Isles.** Drawn isles: Olen, Vez, Unlo, "Netherbus Island", the "Death Islands" and the "Tonda Rand Islands" ([LBL] Ember Lands); the model has four small unnamed Ember Lands islands (`land_island_010`, `_033`, `_048`, `_054`, `_060`). Proposed: Olen is the cliff-isle of the Holy Breeze off the peninsula's south coast; the Death Islands (renamed the Kherith Isles, section 13) are the volcanic islets in the Sea of Lava where devils lair; Unlo and Vez are isles of Volgan's coast.

**Water (one name each).**

| Water | Model id | Name used here | Note |
| --- | --- | --- | --- |
| The storm belt round the islands | `sea_tempest_reach` | **the Tempest Reach** (P) | E storms ([DL]); a belt of weather over several seas, not a sea of its own |
| West of the island | `sea_deaths_sea` | **Vehmial**, "the West Water" (Mirolic) | Former label Sea of Deaths; it collided with "Sea of Death" and "The Dead's Sea" |
| North of Demon and Dolon | `sea_demonic_sea` | **Veshir**, "ash water" (Infernal) | Former label Demonic Sea |
| Between Mirolon's south coast and the island | `sea_dead_sea` | **Veleeda** | The owner's own drawn name ("Veleeda, the Dead's Sea"); the English half is dropped |
| West of Mirolon | `sea_mernon_sea` | **Sea of Mernon** | Drawn; the other reading "Nanor" is dropped |
| The Nezer and Abyss coast | `sea_nazerch_sea` | **Sea of Nazerch** | Drawn |
| Round the Nether | `sea_lava_sea` | **Sea of Lava** | Drawn; see [nether.md](nether.md) |
| Straits | `strait_mirolon`, `strait_mirolon_neck` | **Mirolon Sound**, **Mirolon Neck** (P) | |

**Hazards.** The Tempest Reach (attrition and port limits, P magic spec); inland heat; ash and lava from three vents; the dead; the Abyss's sheer rim; devils.

## 3. Inhabitants

| People | Culture (data id) | Language | Where | Status |
| --- | --- | --- | --- | --- |
| Men | Wardens of Mirolon (`mirolon_wardens`) | Mirolic, warden dialect | Mirolon | E Mirolon a human kingdom ([DL], [C48]); P culture |
| Men | Ember Lands Freeholders (`dead_lands_freeholds`) | Mirolic, coast dialect | Halia (the salt coast), Nan, Olen | P |
| The dead | Grave Hosts of Volgan (`grave_hosts`) | the Rite-Tongue for offices and gates | Volgan's island | E grave hosts ([DL]) |
| Orcs, goblins, ogres | Volgan's living soldiers (P culture to be written; the model counts orcs 30% and ogres 15% of Volgan's living people, [DEM] minor peoples) | Orcish, Goblin Cant | The plateau and the Demonic Mountains | E orcs, goblins, ogres in Volgan's armies ([DL], [VO]) |
| Demons | Netherborn (`netherborn`) | Infernal | Khorvrath (former label Demon), Dolon, Nezer | E Netherborn serving Volgan ([PA]); E Demon, Dolon, Nezer his satellites (working, [GP]) |
| Devils | none (individuals) | none recorded | The Kherith Isles, the Demonic Mountains, the Nether | E devils in Volgan's First Age army ([A1] §4); [BC] card 46 (the Death Islands, the Nether); owner decisions on devils ([OD], [OC] §2.6) |
| The people of the Abyss | Roka's rhinoceros-headed people (name O) | none recorded (reserved, [LANG] §2) | The Abyss | E ([RO]) |
| Necromantic orders | Living and undead officers of the Dominion | the Rite-Tongue | Nafeher | E ([DL]) |

**The demons.** The vault's account makes demons corrupted angels, among the immortal Great Folk ([PA]); they are distinct from devils, who are corrupted Lesser Spirits that once served an Old God and escaped to Aoaz ([OC] §2.6). Demons are 3.6 to 5 metres tall, cunning, fight with horns, claws and fire thrown from hand and mouth, and some can step from place to place; the older and more famous can be summoned by rite ([BC] card 48). Not all demons serve Volgan ([NE], [KD]).

**The devils.** Huge (20 to 30 metres), very few, evil, fighting with strength, claws, teeth, horns, wings and fire; "many devils serve Volgan" ([BC] card 46, where Volgan is written Vez'nan). **Owner decision:** devils are bound to their bodies, and a dead devil returns only by the lava rite, its skull thrown into lava ([OD]). Which Old God they served, and when they came to Aoaz, are not known to anyone in Aoaz (O; [OC] §6 item 5).

**Population.** The model gives the Ember Lands 1.9 million living people in 13 countries and 30 states (the dead are not counted): Mirolon 800,000, the eight freeholds 652,100 together, Volgan 300,000, the three demon realms 148,100 ([DEM]). Revised (P): the total stays about 1.9 million, but the demon realms' figures are mostly not demons. Demons are immortal Great Folk and few: perhaps 1,500 in Khorvrath, 1,200 in Dolon and 2,500 in Nezer, ruling thralls, orc and goblin labourers and men of the old coast; the rest of each realm's people are those subjects. Volgan's 300,000 living subjects are orcs, ogres, goblins and men of the plateau oases (the model's minor-people shares). Mirolon's 800,000 are plausible for a forested, watered peninsula with a lake and a swamp.

## 4. Livelihoods and resources

| Resource | Where | Notes |
| --- | --- | --- |
| Salt | The salt coast of Halia; Dolon's pans | Salt is the freeholds' wealth and the mourners' rite ([WB] §4) |
| Fish | Veleeda, the Sea of Mernon | |
| Timber, marsh grain, reed paper | Mirolon | [WB] Wardens of Mirolon |
| Obsidian, sulphur, ash-glass | The Demonic and Nether Mountains | Dolon's kilns ([FT] `regional_dolon`) |
| Black powder | Dolon's forges, for Volgan's orc companies | Owner decision that gunpowder weapons are common in some realms ([OD]); the orc card's "catapults, cannons and so on" ([BC] card 20); P that the Dominion is one such realm |
| Bitumen (the fuel resource of the game) | The plateau's sunken basins | [GMS] §2 resource table |
| The dead | Volgan's grave-fields | Not a resource in the economy; a manpower of their own in the mechanic ([VSD] §3) |
| Essence (game resource) | Where the Ember Lands' native magic sustains necromancy | E that the Ember Lands' magic sustained Elzon as Aenor's did not ([DL] Third Age) |

## 5. Institutions and political forms

| Realm | Form |
| --- | --- |
| **Puvulan** (Volgan's realm; former label "Volgan") | A dominion ruled by a Great Spirit through lieutenants, necromantic orders and sworn realms; the **Southern Dominion** is its league (E working table, [GP]); "the Veil of Storms" hides its strength (P, [VSD] §2) |
| **Khorvrath** (former label Demon), **Dolon**, **Nezer** | Demon lordships, each under a lord or queen who keeps a pact-name; sworn to Nafeher (E working table; P pact law, [WB] Netherborn). Nezer is a confederacy of two crowns of one family ([FT] `regional_nezer`, P) |
| **Mirolon** | A free warden-realm: the High Warden is chosen for life by the pass-lords and lake towns (P, [VSD] proposed) |
| **Halia** (the salt coast) | A league of freeholds under headmen who pay Volgan's tolls in silence (P) |
| **Nan** | A warlord's realm of isles and peninsulas (P, [FT] `regional_nan`) |
| **Olen** | A shrine-realm on the cliffs of the Holy Breeze (P, [FT] `regional_olen`) |

**Volgan (E).** A Great Spirit of immense age and the principal dark lord; once the servant of a New God whom he overcame; not an Old God; his authority does not extend automatically to the Dark Lands or to all demons ([VO], [DL], [NR]). Seat Nafeher (working, [GP]). The country is not named after him (R-28): proposed name **Puvulan**, the Rite-Tongue *puvu* "dust" + *lan* "field", the necromantic orders' name for the grey plateau that the map calls the Deadlands. His old name Vez'nan survives in the drawn labels "Deadlands of Vez", "Vez Forest" and "Vez Nan" ([LBL]); those labels are renamed so that no land carries the lord's name (section 13).

## 6. Beliefs and faiths

| Faith | Held by | Belief | Truth versus belief |
| --- | --- | --- | --- |
| The Dread Cult (`grave_cult`) | The necromantic orders, many orcs | Volgan is worshipped as a god; a rite of Names and Gates ([WB] §4, P) | E Volgan is a Great Spirit, not a god ([VO]); worship does not make him one ([RK]). |
| The Pact-Rite | Demons | Every lord keeps a pact and a pact-name; oaths are blood and ash (P) | The demon king's pacts bind the living; the dead stay Zol's ([OD]); see [nether.md](nether.md). |
| The Warden's Vigil | Mirolon | The New Gods as watchers; a lamp lit toward the south in every tower (P) | The twelve main New Gods answer the twelve needs of mortals; lesser New Gods also exist ([OD]); no names are invented. |
| The Mourning Customs | The freeholds | Bury quickly and deep, with salt, and say nothing of Zol or Volgan at the grave (P) | E: Zol is the Old God of Death; Volgan's necromancy is not authority over Death ([DL]). |
| The lava rite | Devils, and those who serve them | A devil's skull thrown into lava brings the devil back | Established as the only way a devil returns ([OD]); who performs it is P. |

**Holy and dreaded sites (P).** The Gate of Nafeher; the grave-fields behind the storms; the Holy Breeze shrines of Olen; the beacon towers of Mirolon; the lava-rite pits on the Kherith Isles; the rim of the Abyss, where nobody prays.

## 7. History

| Date | Event | Label |
| --- | --- | --- |
| Before 1A | Volgan, once a New God's servant, overcomes that god and founds his own dominion; the date and the god's name are unknown. | E ([VO]); O date and name |
| Before 1A | Roka's rhinoceros-headed people already live in the Abyss. | E people ([RO]); P date |
| 1A | Storms and heat keep Aenoran explorers out; men chart coasts without knowing the lands behind them. | E ([A1] §2, [DL]) |
| 1A about 1150 to 1500 | Volgan invades Mirolon and makes it the opening of a vast campaign. | E ([DL], [A1] §4); P dates |
| Late 1A | Volgan's armies include demons, devils, orcs, goblins, Great Spirits, dragons and Damned Spirits released from deep underground. | E ([A1] §4) |
| By 1A 1675 | After Dardan Volgan is banished to the Void; Elzon gathers the remnants and repels Edran's invasion of the Ember Lands with heavy losses. | E ([DL], [A1] §7) |
| 1A 1675 and after | Mirolon is freed after Dardan; its coast cousins stay and pay tolls to whoever holds the island. | P ([WB] Mirolon, Freeholders) |
| 2A | Elzon, Great Spirit and Great Necromancer, holds the Dead Lands; his seat is at **Nazerun**, the old name of Nezer. | E Elzon's role ([EZ]); owner decision on Nazerun ([OD]); P that Nazerun was his seat ([BC] card 61) |
| 2A | Demons raid Aenor through portals from the Nether; the Burning Gate of Nezer is closed by a garrison, an elven company and Dark Lands soldiers. | E raids ([2R]); P episode ([A2] §IV) |
| 2A | Elzon frees Volgan's presence from the Void with old magic linked to Zol. | E ([2R]) |
| 2A 2133 | Elzon takes Aenor. | E ([EO]) |
| 3A | Volgan, too weak to leave the Ember Lands, commands Elzon from here; the Ember Lands' magic sustains Elzon as Aenor's does not. | E ([DL] Third Age) |
| 3A 1260 | Elzon dies permanently; Volgan remains alive. | E outcome; P date ([3R]) |
| 4A 1611 | A master thief takes the Necklace of the Abyss from Roka's domain and carries it north. | E theft ([RO], [NA]); P date and thief's name ([FC] III) |
| about 4A 1650 | Volgan's strength returns; Demon (Khorvrath), Dolon and Nezer swear to him as the Southern Dominion; Mirolon fortifies its passes. | P ([FC] III) |
| 4A 1736 | Mirolon's envoy warns Parim and is laughed at. | P ([FC] IV) |
| **4A 1748** | **Start: peace.** Volgan has rebuilt for a century; only Mirolon's scouts take the signs seriously. | E ([C48]) |
| 4A 1755 | Volgan retakes Mirolon and marches north with an army greater than any since the First Age. | E ([A4] §IX, [WLC]); P date |
| 4A 1757 | Volgan's hosts fight Zol's dead before the two briefly align; restored by the New Gods, Eindil breaks Volgan's manifested body; the Dominion loses much of its supernatural order. Whether Volgan's spirit survives is open. | E ([VO], [WLC]); O spirit; P date |

**Trade routes (P).** The Salt Run from the freehold coast to Mirolon; the storm-pilots' route through the Tempest Reach, known to Nan's wayfinders; tribute galleys from Dolon to Nafeher.

**Local legends (P).** Mirolon's wardens say the beacons were first lit by a child who saw the storms part in the wrong direction. The freeholders say a thief once came through their coast going south and, years later, came back going north and did not grow older (the thief's unending life is E, [AF] and [NA]; his passage here is P). Volgan's orcs say nobody comes back up from the Abyss except the one who stole from it.

**Where history can diverge (L3).** Mirolon can hold the passes, fall, or go into exile; the sworn demon realms can seek their own road; the freeholds can kneel as client crowns or shelter refugees; Volgan can break the veil early or wait ([VSD] §8 to §10).

## 8. Neighbours and relations

| Neighbour | Relation | Why |
| --- | --- | --- |
| Mirolon and Puvulan | Silent hostility | E rivalry ([GP]) |
| Mirolon and Herez, the Zilin Hills | Distant cousins; the Herez road | P |
| Mirolon and Aenor | Laughed at | P envoy ([FC] IV) |
| Puvulan and the Dark Lands holds | Envoys; most answer only to themselves | E ([KF]) |
| Puvulan and the Nether | A bargain, not obedience | E the King of Demons' relation to Volgan is open ([KD]); P ([nether.md](nether.md)) |
| Puvulan and Zol's Mistake | Clash, then a brief alliance in the war | E ([WLC]) |
| Puvulan and the Magical Lands | Volgan wants Glo; elves remember Edran's invasion | E ([KF], [ER]) |

## 9. Wildlife and creatures

| Creature | Habitat | Effect | Source |
| --- | --- | --- | --- |
| Rhinoceros-headed giants (the people of the Abyss; the card calls them "Rhino-heads") | The Abyss | 15 to 25 metres tall, the greatest of them Roka; they fight with horn, hands and feet; the card says they live alone and are always evil, which the vault's rule that monster peoples are diverse does not allow as a fact for all of them | [BC] cards 8, 18; [RO]; [PA] caution |
| Devils | The Kherith Isles, the Demonic Mountains | See section 3 | [BC] card 46; [OD] |
| Wurghs (former card name wargs) | With Volgan's orcs and goblins | Mounts of the orc riders | [BC] card 15 |
| Ogres | The Demonic Mountains' caves | Volgan's heavy infantry | [BC] card 22; E ogres in his realm ([DL]) |
| Ash-crows (P) | The plateau | Follow the grave hosts | P |
| Marsh herons | The Great Swamp of Mirolon | The heron is Mirolon's heraldic bird ([WB] Wardens of Mirolon) | P |

## 10. Settlements

| Place | Realm | Why there | Status |
| --- | --- | --- | --- |
| Nafeher | Puvulan | On the grey plateau behind the storms, far from any shore a fleet could reach; a large city, not a giant one; about 60,000 living | W seat ([GP]); P ([DEM]) |
| Miherta | Mirolon | On the lake and the peninsula's north shore; about 50,000 | P ([DEM], [GM] `site_mirolon`) |
| Pass-forts of Mirolon | Mirolon | At the Mirolon Passes | P |
| Miherze | Khorvrath | In the Nether foothills; about 20,000 | P ([DEM]) |
| Unzeky | Dolon | A pact-hall on Veleeda's salt coast; about 12,000 | P ([DEM]) |
| Gelroze | Nezer | In the Nezer hills; about 22,000 | P ([DEM]) |
| Larorun | Nan | A warlord's fort in the Nan Mountains; about 10,000 | P ([DEM]) |
| **Halon** (Mirolic "salt place") | Halia | The largest salt pans of the Veleeda coast | P |
| Olen's shrine-town | Olen | On the cliffs of the Holy Breeze | Drawn "Holy Breeze" ([LBL]) |
| The rim of the Abyss | none | Abyss Point | E Abyss in the Ember Lands ([AB]); P placement chosen by the model ([GM] `chasm_abyss`) |

## 11. Roster proposal (proposed)

**Before:** 13 countries ([ROS] scan Ember Lands), 0 elven. **After:** 8 countries here, 0 elven; the Nether becomes its own country in [nether.md](nether.md) (from Volgan's regions).

| Name | People and culture | Political form | Capital | Extent | Why it exists |
| --- | --- | --- | --- | --- | --- |
| **Puvulan** (former label Volgan) | The dead, orcs, ogres, goblins, men; necromantic orders | Dominion of a Great Spirit | Nafeher | The plateau, the Demonic Mountains, the Abyss's rim, Unlo and Vez isles; 6 states | E Volgan's realm ([DL]); renamed by R-28 |
| **Khorvrath** (former label Demon) | Demons over thralls | Demon lordship sworn to Nafeher | Miherze | The Nether foothills of the island; 1 state | E working satellite ([GP]); a country should not be called by a people's common name; Infernal *khorv* "horn" + *-rath* "realm" (the horned court, [FT] `regional_demon`) |
| **Dolon** | Demons over thralls | Demon lordship, the Dominion's forge | Unzeky | The salt coast of the island; 1 state | E working satellite |
| **Nezer** (old name Nazerun) | Demons over thralls | Confederacy of two demon crowns | Gelroze | The Nezer hills and the Sea of Nazerch coast; 2 states | E working satellite; owner decision on Nazerun |
| **Mirolon** | Men, wardens | Free warden-realm | Miherta | The peninsula north of the Nan Mountains; 6 states | E rival of Volgan |
| **Halia** (Mirolic "salt country") | Men, freeholders | League of freeholds | Halon | The salt coast of the peninsula on Veleeda; 3 states | Merges Mirodor, Mencnon, Bennen, Gelon and Dra, five interchangeable freeholds of one culture |
| **Nan** | Men, freeholders under a warlord | Warlord's realm | Larorun | The Nan Mountains and the southern isles; 1 to 2 states | Drawn; E name ([DL]) |
| **Olen** | Men, freeholders | Shrine-realm | Olen's shrine-town | The isle of the Holy Breeze and the lamp-cliffs; 3 states | Absorbs Luminor |

**Not countries (P):** the Abyss (Roka's domain; whether Roka lives, rules or guards anything is open, so no country is made for him); the Kherith Isles (devils).

| Current row | Tag | Change |
| --- | --- | --- |
| Volgan | Y8D | Renamed Puvulan; loses the Nether to its own country ([nether.md](nether.md)) |
| Demon | Y7T | Renamed Khorvrath |
| Dolon, Nezer | Y7U, Y10 | Kept |
| Mirolon, Nan, Olen | Y0Y, Y0Z, Y7R | Kept; Olen absorbs Luminor (Y7O) |
| Mirodor, Mencnon, Bennen, Gelon, Dra | Y7M, Y7N, Y7P, Y7Q, Y7S | Merged into Halia |

**Counts:** 13 before, 8 after (9 with the Nether). Elven realms: 0 before, 0 after.

## 12. Gameplay role

**Mechanics.** *Volgan's Southern Dominion* ([VSD]) stays the region's main mechanic: dominion strength, the Veil of Storms, grave musters, the sworn realms' oaths, the Nether pact (now with a real country, [nether.md](nether.md)), the Abyss envoys, the Dark Lands pacts, Mirolon's proof and passes, the reconquest, the march north, the clash and the Black Compact with Zol's forces, and the broken body. Changes (P): every text and tag that says "Volgan" for the country says Puvulan; the freehold rows collapse into Halia with one tribute decision; a **devils** layer: Puvulan may call devils from the Kherith Isles (a rare elite division that, when destroyed, can return only through the lava-rite decision on an owned volcanic state); black powder for the orc companies after the "Dolon's Forge" focus.

**Focus trees ([FT]).** `volgan` (114 focuses, renamed for Puvulan), `mirolon` (83), `regional_demon` (renamed Khorvrath), `regional_dolon`, `regional_nezer`, `regional_nan`, `regional_olen`, `shared_dead_lands` (six freeholds, cut to Halia's own small tree).

**Events (P).** "The Storms Part Wrong" (Mirolon's proof); "A Skull in the Lava" (a devil returns); "Salt for Silence" (Halia's tribute); "The Thief Came This Way" (the freeholds remember); "The Rim of the Abyss" (envoys go down; the depths answer, are silent, or answer in wrath, [VSD] §6).

**AI (P).** Puvulan waits behind the veil until the historical war unless its strength and the gathering dark allow an early break; the demon realms keep their oaths while Volgan's body stands; Mirolon scouts and fortifies; Halia and Olen pay and shelter.

## 13. Questions for the owner

1. **Mirolon's "northern passes".** The vault's proposed chronology says Mirolon fortifies "its northern passes", but in the model Volgan's island lies south of Mirolon across the sea, and the passes close the peninsula's land neck to the north. Do the passes guard Mirolon from the north, or are they the gate Volgan must take north after he has landed?
2. **The people of the Abyss.** Is "Rhino-Head" the people's name? The card's "always evil" conflicts with the vault's rule that monster peoples are diverse.
3. **Puvulan.** Do you accept Puvulan ("the dust fields", Rite-Tongue) as the name of Volgan's realm?

### Renamed labels (owner decisions applied directly; former label kept)

| Former label | Reason | New name | Language and meaning |
| --- | --- | --- | --- |
| Volgan (country) | named after its leader (R-28) | **Puvulan** | Rite-Tongue *puvu* "dust" + *lan* "field" |
| Demon (country) | a people's common name as a realm | **Khorvrath** | Infernal "horn-realm" |
| Deadlands of Vez, Vez, Vez Forest, Vez Nan | Vez'nan is Volgan's old name; no land carries the lord's name | **Qaurlan** (the capital district, Rite-Tongue "black field"); **Exhoros** (the isle of Vez, "ash isle"); **Vokh-Nazur** (the forest, Infernal "dark wood"); **Nimlol** (Vez Nan, Mirolic "low pass") | as given |
| Sea of Deaths | contradicts Sea of Death and The Dead's Sea | **Vehmial** | Mirolic "west water" |
| The Dead's Sea | duplicate of the drawn Veleeda | **Veleeda** | owner's drawn name |
| Demonic Sea | repetitive with the realm names | **Veshir** | Infernal "ash water" |
| Death Forest, Hell Forest | repetitive death-names | **Vokh-Gul** (Death Forest; Infernal *vokh* "forest" with the Mirolic loan *gul* "grave"), **Vokh-Ashkar** (Hell Forest, "fire forest") | Infernal |
| Death Islands | repetitive death-names | **the Kherith Isles** | Infernal *kherith* "ember" |
| The Hell (drawn region), Netherbus Island | the demons' "hell" of card 48 read as the Nether | folded into the Nether ([nether.md](nether.md)) | |
| Tinta Rocky Lands | repeats Aenor Isle's Tinta | **Gragia** | Mirolic *grag* "cliff" + *-ia* "country" |
| Demonwig, Dum, Neferun, Hill of Wo, Gelcon Mountains, Tonda Rand Islands | unused drawn labels | kept as state and place names inside Puvulan and Khorvrath, except Demonwig, which becomes **Khorvazel** ("horn-hold") | |

## 14. Sources

| Key | File and heading |
| --- | --- |
| [DL] | `docs/lore/vault/05 - Geography/Volgans Ember Lands.md` (all headings) |
| [AB] | `docs/lore/vault/05 - Geography/Abyss.md` |
| [NE] | `docs/lore/vault/05 - Geography/Nether.md` |
| [PA] | `docs/lore/vault/04 - Peoples/Peoples of Aoaz.md` (Great Folk: demons; caution) |
| [GP], [KF] | `docs/lore/vault/06 - Politics/Great Powers and Relations.md`; `Kingdoms Factions and Conflicts.md` |
| [EO] | `docs/lore/vault/06 - Politics/Elzons Order.md` |
| [VO], [EZ], [RO], [KD], [AF] | `docs/lore/vault/03 - Figures/Volgan.md`, `Elzon.md`, `Roka.md`, `King of Demons.md`, `Afrit.md` |
| [NA] | `docs/lore/vault/08 - Artifacts/Necklace of the Abyss.md` |
| [NR], [RK] | `docs/lore/vault/09 - Development/Names and Retcons.md`; `01 - Cosmology/Religious Knowledge and False Gods.md` |
| [A1], [A2], [2R], [3R], [A4] | `docs/lore/vault/07 - History/The First Age of Aoaz.md` (§2, §4, §7); `The Second Age of Aoaz.md` (§IV); `Second Age Canon Register.md`; `Third Age Canon Register.md`; `The Fourth Age of Aoaz.md` (§IX, §XII) |
| [FC], [C48], [WLC], [ER] | `docs/lore/vault/07 - History/Fourth Age Chronology.md` (III, IV); `The Campaign of 4A 1748.md` (The Ember Lands); `War of the Last Crowns.md`; `The Elven Refusal.md` |
| [OC] | `docs/zin-handoff/01-CONTEXT-AND-CANON.md` §2.6 (devils), §2.7 (Vez'nan), §6 |
| [OD] | Owner decisions of 24 October 2026 relayed by the coordinator (Nazerun; devils and the lava rite; the demon king; gunpowder; renames; no exact ages) |
| [GM] | `tools/content/data/geography/aoaz.json` (ids as cited) |
| [GMS] | `docs/specs/01_map/05_geography_model.md` (§2 Ember Lands; §2 resource table; §13 items 7 to 9) |
| [DEM] | `tools/content/data/world/demography.json` (Ember Lands; minor peoples; settlements) |
| [WB] | `docs/specs/02_lore/05_world_bible.md` (§3.1 Wardens of Mirolon, Freeholders; §3.9 Grave Hosts; §3.10 Netherborn; §4; §6.7) |
| [LANG] | `docs/specs/02_lore/06_languages.md` (§2, §3.5 Mirolic, §3.6 Rite-Tongue, §3.24 Infernal); `languages.json` |
| [ROS], [LBL] | `tools/content/data/countries.json` (scan Ember Lands); `tools/content/data/labels.json` (Ember Lands) |
| [BC] | `docs/lore/sources/bestiary_cards_part1.md` (cards 8, 15, 18, 20, 22), `bestiary_cards_part2.md` (cards 46, 48, 61) |
| [VSD] | `docs/specs/04_mechanics/volgan_southern_dominion.md` (lore basis; §2 to §10) |
| [FT] | `docs/design/focus/*.json` (volgan, mirolon, regional_demon, regional_dolon, regional_nezer, regional_nan, regional_olen, shared_dead_lands) |
