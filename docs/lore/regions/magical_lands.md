# Regional dossier: the Magical Lands

**Requirement:** R-19, with R-21, R-24 (fewer, smaller, scattered elven realms), R-26 and R-29.
**Status:** Draft of 24 October 2026. Everything not marked **established** is **proposed** (decisions L1 to L3).
**Labels:** **E** established (source key in section 14), **P** proposed, **O** open in canon, **hidden** never public before its story flag.

## 1. Overview

East of the Great Wall of Aenor, on the same landmass as the Middle Lands, lie the Magical Lands: snow ridges, mist, the largest and oldest forest in Aoaz, a coast of giant fungi along a long rift sea, and Dragon Mountain, from which the dragons come ([AR], [PA]). The elves here were never conquered, not even by Elzon, and they did not send armies to save the men of Aenor after King Edran's folly in the Dead Lands ([ER], [A3]). In 4A 1748 they live in a handful of small realms scattered where their histories put them: the peaceful elected houses of the Magical Forest, a hill queen on the northern rim, a federation of lake groves, pass-wardens in the southern crags, a long shore of orchards on the rift, and a few hundred keepers of the dragon roosts (P). Much of the land belongs to nobody: living stones in the Lustras Hills, a fallen wood where something once tried to poison the forest's magic, an empty northern coast that faces the black sea, and the high snows where a wizard and his small purple servant are only a legend (P). Men live here too: the descendants of Third Age refugees in the Teste Vale, the traders of a mixed port on the rift, and the pilgrims of the Worshipdom in the Zilin Hills, a gentle temple-state whose true master nobody knows (hidden).

## 2. Physical character

### 2.1 The land

| Item | Value | Source |
| --- | --- | --- |
| Extent | x 0.635 to 0.790, y 0.330 to 0.720 of the game layout; 585,584 square pixels (much of it mountain) | [GM] `region_magical_lands` |
| Elevation | The range belt and the Magic Mountains 4 to 5; the Herrodon Mountains 5; the forest basin 2 | [GM] |
| Climate | Cool temperate, damp, misty; equable seasons with "enchanted warmth in the forest" | [GM], [GMS] §2 Magical Lands |
| Terrain mix | Forest 45%, mountain 22%, hills 15%, plains 15%, marsh 3% | [GM] |
| Fertile ground | Forest clearings, the Teste Vale (`plain_herrodon_vale`), the Elwen valley and the rift shore | [GM] |
| Natural borders | The Great Wall (with the Middle Lands); Andos Water (Herrodon and Andos Enda); the Elwen River (Magical Forest and Mushroom Forest); the Lake of Mirolon (Nolorim and the Worshipdom); the Rift (with the East Lands) | [GM], [GMS] §6 |

### 2.2 Ranges, from west to east and north to south

- **The Great Wall of Aenor** (`range_great_wall`) on the west: a natural range (owner correction, [OC] §2.2), described in full in [middle_lands.md](middle_lands.md) §2.9. By owner decision the dwarves hold the range ([OD]); its eastern face looks down on the elves, and the dwarves' dislike of elves keeps their galleries opening westward (P). From the elven side its passes are the Kingson Pass (east end below Lunhrim), the Lunhrim Notch and the South Pass; the elves keep the eastern watch-forts of the two wheel passes under the Accord of the Passes of 4A 96 (P).
- **The Magic Mountains**: three snow-capped parallel ridges east of the range (`range_magic_1`, `range_magic_2`, `range_magic_3`), mountain (4) with high peaks; the westernmost ridge forms the east side of the Kingson ring (`range_magic_wall`). The Gorbatik card puts Varner's helper "in the mountains of Magic Mountain" ([BC] card 34).
- **The Herrodon Mountains** (`range_herrodon`): the massive northern rim, high peak (5), "the brown highland of Herrodon and Andos Enda against the Ocean of Zol" ([GM]); with Herrodon Head (`cape_herrodon`) and Isemkei Bay (`bay_isemkei`, drawn "Isemkei Sea", reading uncertain) cut into it.
- **The Lustras Hills** (`range_lustras`): hills (3) south of the Herrodon Mountains.
- **Dragon Mountain** (`range_dragon_mountain`, `site_dragon_mountain`): the highest massif of the range belt, at the south-east corner of the Kingson ring, with roosts on three spurs; the green strip of Greenland (`plain_greenland`, drawn) lies beneath it on the elven side.
- **The Cursed Mountains** (`range_cursed_mountains`): a narrow dark ridge at the south end of the Kingson ring, above the Forests of Darkhere (`forest_darkhere`); the goblin warrens of Glimik open under it (P, [middle_lands.md](middle_lands.md)).
- **The Nolorim Heights** (`range_nolorim`, P name): high crags of the southern frontier, with **the Nolorim West Pass** facing the Herez road and **the Nolorim East Pass** above the Lake of Mirolon (`pass_nolorim_west`, `pass_nolorim_east`). The model faces them south and east (owner question 8 of the model; [GM] note).
- **The Zilin Hills** (`hills_zilin`, `site_zilin_hills`): brown dark hills south of the Magical Forest with three valleys ([GM]).

### 2.3 Forests and fens

The **Magical Forest** (`forest_magical`) is a vast old forest of 80 percent canopy, "the largest wood of Aoaz"; within it lie the **Living Forest** (`forest_living`) in the north-west and the **Fallen Forest** (`forest_fallen`) in the north ([GM]). The **Mushroom Forest** (`forest_mushroom`) is "an east coast belt of giant fungi along the rift shore" and the home of the mycids ([GM]; E mycids, [PA]). The **Zilin Forests** (`forest_zilin`) are a narrow wood beside the Giant Mountains; the **Zilin Fens** (`marsh_zilin_fens`, P) lie between Lake Lozo and the Lake of Mirolon.

### 2.4 Water (one name each)

| Water | Model id | Name used here | Note |
| --- | --- | --- | --- |
| The northern ocean | `sea_zol_ocean` | **Ocean of Zol** (E) | Drawn "Ocean of Edvoid" / "Edvoid Ocean", superseded ([ZM]); every black island in it belongs to Zol's Mistake |
| The sea at the north end of the rift | `sea_gorlab_sea` | **Gorlab Sea** | Drawn, reading uncertain (Gorlab or Cololab) |
| The bay in the Herrodon highland | `bay_isemkei` | **Isemkei Bay** | The drawn "Isemkei Sea" is a bay; one name, singular |
| The long sea between the Magical Lands and the East Lands | `sea_magical_ocean`, `zone_rift` | **the Rift Sea** (P, after the vault's "long rift sea", [AR]) | The two drawn names of the same water, "The Magical Ocean" (Magical sheet) and "Khadon Ocean" (East sheet), become former labels |
| The southern reach of the rift | `sea_mushroom_seas` | **the Reeto Sea** (P) | The two drawn names "Mushroom Seas" and "Reeto Seas" are the same water; the plural is dropped |
| The narrowest crossing | `strait_rift_narrows` | **the Rift Narrows** (E that a rift separates the lands; P name) | About 200 pixels between the Mushroom Forest coast and the Delbiz coast ([GM]) |
| The north mouth of the rift | `strait_rift_north` | **North Mouth of the Rift** (P) | Between Andos Enda and the island of Fladev |
| Rivers | `river_elwen`, `river_andos`, `river_lozo_out`, `river_teste` | **Elwen River**, **Andos Water**, **Lozo Water**, **Teste Brook** (all P) | The Elwen runs from the Magic Mountains east through the forest to the rift |
| Lakes | `lake_lozo`, `lake_mirolon` | **Lake Lozo** (drawn), **Lake of Mirolon** (drawn) | Lozo lies in the fold west of the Magical Forest along the Giant Mountains' foot |

Drawn islands without model ids: "Magic Islands", "Dlomntod" and "Medek" ([LBL] Magical Lands). Proposed: the Magic Islands are the islets of Isemkei Bay; Dlomntod and Medek are two islands in the Gorlab Sea (P, section 13).

### 2.5 Hazards

Mist that lasts for days in the forest; snow and avalanche on the Magic Mountains and the Herrodon rim; living stones in the Lustras Hills that throw boulders at anything that moves ([BC] card 30, "Salomonanos", P placement); the spore-air of the Mushroom Forest, which strangers find hard to breathe in summer (P); wild dragons that take cattle; and the stillness of the Ocean of Zol on the north coast, which sailors fear more than storms (E that nights of still seas are a sign of Zol's influence, [A2] §VII proposed manifestation; P that it reaches this coast).

## 3. Inhabitants

### 3.1 Peoples, cultures and languages

| People | Culture (data id) | Language | Where | Status |
| --- | --- | --- | --- | --- |
| Elves | Council Elves of the Magical Forest (`forest_council_elves`) | Sylvan, high dialect | The Living Forest and the core of the Magical Forest | E: "peaceful democratic elves of the Magical Forest" ([PA]); P culture |
| Elves | Hill-Kingdom Elves (`hill_kingdom_elves`) | Sylvan, hill dialect | Herrodon, on the northern rim | P culture |
| Elves | Lake Elves (`lake_elves`) | Sylvan, lake dialect | Andos Enda and the Andos Water groves | P culture |
| Elves | Pass-Warden Elves (`pass_wardens`) | Sylvan, pass dialect | Nolorim | P culture; E name Nolorim |
| Elves | Rift-Coast Elves (`rift_coast_elves`) | Sylvan, coast dialect | Lccimio and Eldafaen on the rift | P |
| Elves | Roost-keepers (P, new) | Sylvan | Greenland under Dragon Mountain (Yavieth) | P |
| Men | Teste valley-folk (P, new) | Aenoran, an old ranger dialect | The Teste Vale | P |
| Men | Zilin Pilgrim-Folk (`zilin_pilgrims`) | Aenoran, pilgrim dialect | The Worshipdom's three valleys | P; hidden purpose |
| Men and elves | Quay-folk of Luv-zhise (P, new) | Alerhic and Sylvan, with a trade cant | The port at the Rift Narrows | P |
| Mycids | none written | unrecorded (the language is reserved until the vault describes them, [LANG] §2) | The Mushroom Forest | E that they live there ([PA]); everything else P or O |
| Krors | living stones; no culture | none | The Lustras Hills | Card statement ([BC] card 30); placement P |

**Variation between elven communities (P).** The council elves vote and keep a book of precedents; the hill elves acclaim a queen in her hall; the lake elves name their houses after waters and move the name when they move; the pass-wardens are families who have kept one pass for centuries; the rift-coast elves have dealt with men of the East for thousands of years and their names carry foreign sounds; the roost-keepers are few, wild and closer to the dragons than to the council. All speak Sylvan, the daughter of an Elder Elvish nobody speaks ([LANG] §1), and all hold the Kindred Song, but they do not agree about men, about the Refusal or about the dragons.

### 3.2 Population

| Group | Model | Revised (P) | Why |
| --- | ---: | ---: | --- |
| Elven realms | 2,224,000 in 21 realms ([DEM]) | about 380,000 in 7 realms | The elves are Great Folk and immortal ([HB]); they bear few children, and the demography model's own note says "rich forest land held by long-lived elves" and its people factor for elves is 0.15 ([DEM]). Twenty-one elven realms of up to 234,800 people each are not few or scattered (R-24). |
| Kingdom (elves) | 117,400 | moved to the Middle Lands as Dunelaeth, about 5,000 | Its forest is on the Middle Lands side |
| Worshipdom | 176,100 | about 150,000 | Three valleys and the pilgrim hostels |
| Teste (men) | 0 | about 55,000 | The only fertile vale of the north |
| Luv-zhise (men and elves) | 167,700 (as elves) | about 80,000 (65,000 men, 10,000 elves, 5,000 mycid traders) | A port, not a realm |
| Mycids | 11,800 (minor people inside the Magical Forest, [DEM]) | about 12,000 | Unchanged |
| **Total** | **2,400,000** | **about 680,000** | Leaves most of the Magical Lands wild, which the land's name and the dragons suggest |

| Elven realm | Revised elves (P) |
| --- | ---: |
| Magical Forest | 180,000 |
| Lccimio | 60,000 |
| Herrodon | 55,000 |
| Andos Enda | 50,000 |
| Nolorim | 15,000 |
| Eldafaen | 8,000 |
| Yavieth | 6,000 |

People live along the Elwen, in the forest clearings, the Teste Vale and the quays of the rift; nobody lives on the Herrodon crest, in the Lustras Hills, the Fallen Forest or the Lost Lands (P).

## 4. Livelihoods and resources

| Resource | Where | Notes |
| --- | --- | --- |
| Timber, but rarely cut | The Magical Forest | Elves take fallen wood only (P) |
| Silver | The Magic Mountains | Elven silver goes west by the Kingson Pass ([WB] §7 "The Wall Road") |
| Healing herbs | The Living Forest, the Zilin Hills | The Worshipdom's hostels buy them (P) |
| Dragon-scale | Shed at the roosts of Dragon Mountain | Traded at Kingson by the roost-keepers (P, [WB] §7) |
| Fruit and wine | The orchards of Lccimio on the rift | P |
| Grain | The Teste Vale | The men of Teste feed Herrodon and Andos Enda (P) |
| Fungi, dyes, spore-cloth | The Mushroom Forest | Traded through Luv-zhise (P) |
| Fish | The Rift Sea, Lake Lozo | P |
| Essence (game resource) | Strongest here: the Living Forest, the Kindred groves, Dragon Mountain | The Magical Lands' magic is local and independent ([BR], [WB] Council Elves) |
| Chromium-bearing rock (game resource) | The Herrodon Mountains | [GMS] §2 resource table |
| Pilgrims' alms | The Worshipdom | P; hidden use |

## 5. Institutions and political forms

| Realm | Form | Succession, law, notes |
| --- | --- | --- |
| **Magical Forest** | Elected council of houses with a First Speaker (P constitution for the E "democratic and very old" elves) | The houses vote; the First Speaker may serve for centuries; law is the council's book of precedents ([WB] Council Elves) |
| **Herrodon** | Hill queenship ("a queen among her houses", [FT] `regional_herrodon`) | Acclaimed in the hall by the hall-keepers, never by blood alone (P) |
| **Andos Enda** | Federation of lake groves under a Speaker ([FT] `regional_andos_enda`) | A Water-Court judges weirs and boats (P) |
| **Nolorim** | Pass-wardenship: a Pass-Warden elected by the post-captains | Holds office until a vigil is broken (P, [WB] Pass-Warden Elves) |
| **Lccimio** | Council of elder houses ("the Long Shore", [FT] `regional_lccimio`) | Quay-book law (P) |
| **Eldafaen** (drawn The End) | A house of loremasters keeping the Archive | The Archivist chosen by the loremasters (P, after [FT] `regional_the_end` "the Archive") |
| **Yavieth** (drawn Greenland) | A fellowship of roost-keepers | No ruler; the eldest keeper speaks to the dragons (P) |
| **Teste** | Valley commune of men under the protection of Herrodon | A Reeve chosen yearly (P) |
| **Luv-zhise** | Free port of mixed peoples, a council of quay-houses | Rift law; tolls (P) |
| **Mushroom Forest** | Isolated community of the mycids | Unknown; nothing is invented about their rule (O) |
| **Worshipdom** | Temple-state under a High Confessor | Public: a pilgrim house with almost no army ([C48], P). **Hidden:** the hub of the Deliverer's council, whose master is Afrit ([AH], [WB] §5) |

**The Kinship and the Kindred (P, [EWD] §3).** No elven realm commands another. The Magical Forest may call an Elder Moot; a defensive league, the Kindred of the Woods, can form when an outsider attacks. The Elven Refusal still binds every realm: elves help elves, not the human crown ([ER]).

**The dragons (E).** Dragons come chiefly from Dragon Mountain and form no country; elven powers can command them, and Afrit can do so through corruption ([PA]). Proposed: the roost-keepers of Yavieth hold the bond, and no realm commands a dragon without their word ([EWD] §8, adapted).

**Wizards (E and P).** Varner, a wise wizard and Lesser Spirit of the Magical Lands, and his small purple servant Golbran helped the elves and men withstand Elzon through the Third Age (E, [VA], [GB]); in 4A 1748 they are legend and nobody says where they are (P, [EWD] §9). The Gorbatik card describes "Varner's helper" living in the Magic Mountains, a wise wizard who kills demons ([BC] card 34); whether Gorbatik is Golbran is Q-16.

## 6. Beliefs and faiths

| Faith | Held by | Belief | Truth versus belief |
| --- | --- | --- | --- |
| The Kindred Song | All elves | The world was sung; to listen well is a duty; elves tell many stories of how their kind began and hold none to be fact ([WB] §4, P) | The origin of the Great Folk is open (O, [HB]). |
| The Dragon-Watch | Roost-keepers, hill elves | The dragons are free allies, not beasts (P) | E that elven powers command dragons ([PA]). |
| Wild Spirits of the wood | Elves of the Living Forest, the men of Teste | The forest has spirits that answer song (P) | Wild Spirits are a proposed nature ([SN]); the elves do not call them gods. |
| The Faith of the Deliverer | The Worshipdom, pilgrims, the men of Teste and Luv-zhise in part | The Deliverer saved Aoaz and keeps the peace (P doctrine; E public worship, [AF]) | **Hidden:** the Deliverer is Afrit. The elven wardens "ask no questions and remember Varner" ([WB] §5). |
| The River Temples | The Alerhic men of Luv-zhise | The river is the oldest god we can see; the New Gods above the flood-line ([WB] §4, P) | The twelve main New Gods answer the twelve needs of mortals and name the months, and lesser New Gods also exist ([OD]); names undecided. |

**Holy sites (P).** The Singing Groves of the Living Forest; the three spurs of Dragon Mountain; the Boundary Groves on the Andos Water (`pass_boundary_groves`), a holy place both Herrodon and Andos Enda claim to tend; the Archive of Eldafaen; the pilgrim hostels of the Zilin Hills (public), which are also the council's meeting places (hidden).

**The arcanists.** The vault lists "arcanists of the Zhen Hills" among Aoaz's peoples without placing the hills ([PA]); the Zilin Hills here have a similar name. Whether they are the same hills is a question (section 13); nothing is assumed.

## 7. History

| Date | Event | Label |
| --- | --- | --- |
| Before 1A | Elves hold the Magical Lands; dragons nest on Dragon Mountain; the elves already command them. | E that elves and dragons exist and that elves command dragons ([PA]); P date |
| Before 1A | The rift coast trades with men of the East for thousands of years. | P ([WB] Rift-Coast Elves) |
| 1A | Elves of the Magical Lands are courteous strangers to Aen's kingdom; the range is the border. | P |
| Late 1A | Volgan's army includes corrupted elves and dragons. | E ([A1] §4); which elves is open |
| Late 1A | Elves of the Magical Lands join Edran's Grand Alliance; their elected war-speaker (proposed Sirael) fights at Dardan beside Lorien. | E that they join ([A1] §5); P name |
| By 1A 1675 | Edran's invasion of the Dead Lands, against elven advice, kills many elves; trust between elves and men breaks. | E ([A1] §7, [ER]) |
| 2A | The elves no longer trust every Aenoran request for soldiers; individual healers still help. | E ([A2] §II, [ER]) |
| 2A, late | Elzon's war from within sets men, elves and dwarves against each other with forged messages and corrupted leaders. | E ([2R]); P details |
| 2A, late | The elves of the north coast (the old realm of Filion, P) abandon the shore under the Herrodon rim when the stillness of the black sea creeps onto it; the Lost Lands are empty ever since. | P |
| 2A 2133 | Elzon takes Aenor; the elven kingdoms send no armies (the Elven Refusal). | E ([ER], [EO]) |
| 3A | The Magical Lands are never conquered; elves, Varner and Golbran resist Elzon's magic. | E ([A3], [3R]) |
| 3A, early | Refugees of the Vale cross the Kingson Pass; the lake elves shelter them and send them on at dawn; some settle the empty Teste Vale under Herrodon's protection. | P (after [WB] Lake Elves) |
| 3A | Elzon's Order fortifies the Kingson and South Passes against the elves. | P (replaces the "Pale March" wall, [OC] §2.2) |
| 3A 691 to 910 | The Black Roots: Elzon's attempt to turn the land's magic fails against elven resistance and Varner. **The Fallen Forest:** where the dead roots reached the northern wood, the elves cut the trees themselves to cut the anchors; the felled wood still lies where it fell. | P ([A3], [BR]); the Fallen Forest story P |
| 3A 1236 to 1260 | The War of Unbinding; the elves hold their own magical sites but do not reconstitute the Grand Alliance. | P ([WU]) |
| 4A 96 | The Accord of the Passes with the restored crown: elves keep the eastern forts of the Kingson and South Passes; tolls at Kingson. | P (replaces the vault's proposed Wall Accord) |
| 4A, early centuries | The Alerhic quay-houses of Luv-zhise are granted a charter by the rift-coast elves; the port becomes the crossing to the East. | P |
| about 4A 1520 | The Worshipdom grows around a hermitage of the Deliverer in the Zilin Hills; the elves allow three valleys as pilgrim ground. | P ([FC] III) |
| 4A 1748 | **Start: peace.** No elven realm is at war ([EWD] §1). | owner, [C48] |
| 4A 1755 | The eastern coalition crosses the rift and threatens the Magical Lands. | E ([WLC] phase 1, [A4] §IX) |
| 4A 1757 | Eindil returns on a dragon, which elven allies of the Magical Lands entrust to him as a free ally; Varner dies in the war. | E dragon, Varner's death ([4R]); P that elves entrust it ([A4] §X) |
| 4A 1760 | Eindil is crowned in Aenor; what Varner's death means for the Magical Lands is open. | E ([4R]); O ([A4] follow-up 6) |

**Trade routes (P).** The Kingson Pass road (silver, herbs, dragon-scale west; iron, grain and glass east); the pilgrim road over the South Pass to the Zilin Hills; the Rift Road and the Luv-zhise ferries across the Rift Narrows; the lake boats of the Andos Water.

**Schisms (P).** The **Question of the Refusal** has divided the elves since 2A: the Magical Forest keeps it, Lccimio's shore-houses would trade it away for eastern peace, Herrodon's queen would set it aside if the dragons were threatened. The **Boundary Groves** quarrel between Herrodon and Andos Enda is the oldest feud in the Kindred ([GP] working rivalry; [EWD] §6).

**Local legends (P).** The roost-keepers say a dragon never forgets a name and never says one. The men of Teste say their grandmothers' grandmothers were sent away at dawn and came back at dusk. The loremasters of Eldafaen keep a book that ends in the middle of a sentence; they will not say who stopped writing.

**Where history can diverge (L3).** The elves can keep the Refusal, set it aside and march, or close the passes and hide the woods ([FT] `magical_forest` summary); the eastern coalition can be stopped at the Rift Narrows by Luv-zhise and Lccimio; the dragons can be corrupted, freed or bound by pact; the Worshipdom can be exposed early.

## 8. Neighbours and relations

| Neighbour | Relation | Why |
| --- | --- | --- |
| Aenor and the Concord | Courteous estrangement; the Accord of the Passes; quarrels over tolls at Kingson | E Refusal ([ER]); P Accord |
| Kunhrim's dwarves | Cold | Dwarves do not like elves ([BC] card 44) |
| Glimik's goblins | Hostile, watched | The goblins are Elzon's left-behind garrisons (P, [middle_lands.md](middle_lands.md)) |
| Dunelaeth | The lost kin of the west | P |
| The East Lands across the rift | Old trade, new fear | E the eastern coalition threatens the Magical Lands ([WLC]) |
| Lerendor | Andos Enda's letters with Sonargur | E working table (Andos Enda in the Leren Compact, [GP]); P that it is not in the Compact at the start ([EWD] §6) |
| Mirolon | Neighbour across the Lake of Mirolon and the Mirolon Neck | P |
| Zol's Mistake | Feared across the Ocean of Zol | P |
| The Gala elves | Memory of Dardan; distant kin in speech | E Lorien at Dardan ([LO]); O kinship |

## 9. Wildlife and creatures

| Creature | Habitat | Rarity | Effect | Source |
| --- | --- | --- | --- | --- |
| Dragons | Dragon Mountain, the high Magic Mountains | Few | Free allies of the elves; take cattle; an air arm in war | E [PA]; P effects |
| Krors | The Lustras Hills | Uncommon | Living stones 4.5 to 9 metres tall, immortal, indifferent and murderous, fond of throwing stones; nobody settles the hills | [BC] card 30 (placement P; "Salomonanos" read as the drawn Sacomananos) |
| Mycids | The Mushroom Forest | A people, not game | Traders through Luv-zhise | E [PA] |
| Giant fungi | The Mushroom Forest | Common | Spore-air; supply penalty for armies; dye trade | P |
| Chiromaws | Caves of the Cursed Mountains | Common underground | Night raiders | [BC] card 53 |
| Silver harts (P) | The Living Forest | Rare | Hunted by nobody; the elves' heraldic beast | P |
| Mist-wolves (P) | The Fallen Forest | Uncommon | Pale wolves of the deadwood; travellers go round | P |
| Dragon-shy goats (P) | Greenland under Dragon Mountain | Common | The roost-keepers' herds, which the dragons are allowed to take | P |

## 10. Settlements

| Place | Realm | Kind | Why there | Status |
| --- | --- | --- | --- | --- |
| **Lyrion** (Sylvan *lyra* "song" + *-ion* "great place") | Magical Forest | Tree-city, about 25,000 | Inside the Living Forest at the oldest Singing Grove | P; replaces the working capital "Memate" ([ROS] Y8F), which does not follow Sylvan |
| Verozo | Herrodon | Hill hall, about 14,000 | The lower slope of the Herrodon Mountains above the Teste Vale | P ([DEM]) |
| Enliras | Andos Enda | Lake-water garden, about 12,000 | On the largest lake of the Andos Water | P ([DEM]) |
| Ennaton | Nolorim | Pass-warden hold, about 6,000 | On the West Pass above the Herez road | P ([DEM]) |
| Hidirim | Lccimio | Rift-coast quay town, about 14,000 | The best harbour of the northern rift shore | P ([DEM]) |
| Lenkei | Eldafaen | The Archive, about 3,000 | The southern end of the rift coast where the old roads stop | P ([DEM]) |
| **Thoriveniel** (Sylvan *thori* "eagle" + *veniel* "valley") | Yavieth | Roost-keepers' camp, about 1,000 | In Greenland under the three spurs | P |
| **Testebur** (Aenoran "Teste town") | Teste | Valley market, about 6,000 | Where the Teste Brook leaves the vale | P |
| Luv-zhise | Luv-zhise | Free port, about 30,000 | On the Mushroom coast at the Rift Narrows, the shortest crossing to the East | P; drawn name kept |
| Lenlakron | Worshipdom | Pilgrim town, about 9,000 | The central of the three Zilin valleys | P ([DEM]); hidden hub |

## 11. Roster proposal (proposed)

**Before:** 22 countries on the Magical Lands sheet ([ROS]), 21 of them elven. **After:** 11 countries, 7 of them elven; the elven "Kingdom" moves to the Middle Lands as Dunelaeth.

| Name (local language) | People and culture | Political form | Capital | Approximate extent | Why it exists |
| --- | --- | --- | --- | --- | --- |
| **Magical Forest** | Elves, council elves | Elected council of houses | Lyrion | The Living Forest and the core of the Magical Forest; 8 states | E oldest, never-conquered realm; absorbs Dulo-Dulo and Heron |
| **Herrodon** | Elves, hill elves | Hill queenship | Verozo | The south slope of the Herrodon Mountains; 3 states | E name and rivalry; absorbs Velakton |
| **Andos Enda** | Elves, lake elves | Federation of lake groves | Enliras | The Andos Water and its lakes; 3 states | E name; absorbs Perloia and Ossa |
| **Nolorim** | Elves, pass-wardens | Pass-wardenship | Ennaton | The Nolorim Heights and passes; 2 states | E name; absorbs Nolivorak |
| **Lccimio** | Elves, rift-coast elves | Council of elder houses | Hidirim | The northern rift shore from Mushroom Head to the Gorlab Sea; 3 states | Absorbs Lengoli and Lusteli |
| **Eldafaen** (former label The End) | Elves, loremasters | House of the Archive | Lenkei | The southern rift shore; 1 state | Absorbs Endelond; the Archive is a distinct community |
| **Yavieth** (former label Greenland) | Elves, roost-keepers | Fellowship without a ruler | Thoriveniel | Greenland under Dragon Mountain and the mountain; 1 state | Holds the dragon bond; the drawn land beneath the mountain |
| **Teste** | Men, Teste valley-folk | Valley commune under Herrodon's protection | Testebur | The Teste Vale; 1 state | Men in the north: Third Age refugees |
| **Luv-zhise** | Men (Alerhic quay-houses) with elves and mycid traders | Free port of quay-houses | Luv-zhise | The coast at the Rift Narrows; 1 state | The crossing to the East; its "foreign sounds" ([WB]) explained by mixing |
| **Mushroom Forest** | Mycids | Isolated community | none recorded | The fungal belt of the rift coast; 3 states | E mycids of the Mushroom Forest; O their rule |
| **Worshipdom** | Men, Zilin pilgrims | Temple-state | Lenlakron | The three Zilin valleys; 3 states | P visible hub; hidden purpose |

**Wild lands, not countries (P):** the Lustras Hills (krors; the drawn Sacomananos), the Lost Lands (the north coast; the drawn label, formerly Filion), the Fallen Forest's heart, the crest of the Herrodon Mountains, the high snows of the Magic Mountains (where Golbran or Gorbatik is said to live), Dragon Mountain's summit.

| Current row | Tag | Change | Reason |
| --- | --- | --- | --- |
| Herrodon | Y0V | Kept; 6 to 3 states | Smaller |
| Andos Enda | Y0W | Kept; 5 to 3 states | Absorbs Perloia, Ossa |
| Nolorim | Y0X | Kept; 2 states | Absorbs Nolivorak |
| Sacomananos | Y7V | Removed; becomes the Lustras Hills wild land of the krors | Card 30 "Salomonanos" |
| Velakton | Y7W | Merged into Herrodon | Interchangeable hill realm |
| Teste | Y7X | People changed to men; 3 to 1 state | Fertile vale; refugee history |
| Filion | Y7Y | Removed; its coast becomes the Lost Lands | The drawn "Lost Lands"; R-24 |
| Nolivorak | Y7Z | Merged into Nolorim | Interchangeable pass realm |
| Kingdom | Y80 | Moved to the Middle Lands as Dunelaeth, 7 to 1 state | Its forest is on the western side ([GM] `forest_kingdom`) |
| Endelond | Y81 | Merged into Eldafaen | |
| The End | Y82 | Renamed Eldafaen; 13 to 1 state | "The End" is an English word, not Sylvan |
| Lccimio | Y83 | Kept; 14 to 3 states | Smaller |
| Luv-zhise | Y84 | People changed to a mixed port; 10 to 1 state | Its foreign sounds |
| Lengoli | Y85 | Merged into Lccimio | |
| Lusteli | Y86 | Merged into Lccimio | |
| Greenland | Y87 | Renamed Yavieth; roost-keepers | Real-world name; the land under Dragon Mountain |
| Perloia | Y88 | Merged into Andos Enda | |
| Ossa | Y89 | Merged into Andos Enda | Also a real mountain of Greek myth |
| Dulo-Dulo | Y8A | Merged into the Magical Forest | |
| Heron | Y8B | Merged into the Magical Forest | |
| Magical Forest | Y8F | Kept; 17 to 8 states | Smaller, with the Fallen Forest left wild |
| Worshipdom | Y8G | Kept; ideology label to be reviewed (it is "communism" in the roster) | |
| *(new)* | | Mushroom Forest (mycids) | R-21 |

**Counts:** 22 countries before, 11 after. Elven realms: 21 before, 7 after (and 1 more, Dunelaeth, in the Middle Lands). States held by elven realms: 128 of the region's 131 before ([ROS]), 21 after (P estimate; the rest go to the men's, mycids' and wild lands).

## 12. Gameplay role

**Mechanics.** *Elves, the range and dragons* ([EWD]) stays the region's main mechanic with these changes (P): the realm table shrinks to the seven realms; "Wall realms" become **pass realms** (Nolorim, Yavieth, the Magical Forest by the Kingson Pass forts); the Wall grievance becomes the pass-tolls grievance; the Keeper of the Roosts is Yavieth (Magical Forest by alliance); the Kinship starts higher (fewer, older realms, about 45 instead of 35); the Herrodon and Andos Enda rivalry is unchanged. *The eastern invasion* ([EK] §5) targets the rift realms: Lccimio, Luv-zhise, Eldafaen and the Mushroom Forest, so the mycids and the men of the port are the first to be hit. *The Worshipdom* stays the hidden hub of the Afrit mechanic ([AH]).

**Focus trees ([FT]).** `magical_forest` (121 focuses) stays; `regional_herrodon`, `regional_andos_enda`, `regional_nolorim`, `regional_lccimio`, `regional_the_end` (renamed Eldafaen) stay; `shared_magical_lands` (15 small realms) is cut to a shared tree for Yavieth and Teste, or replaced by two small trees (P). New small trees: **Luv-zhise** (tolls, ferries, who to let across, the quay-houses' choice in the invasion) and **Mushroom Forest** (minimal: spores, slow growth, trade; nothing invented about their rule). The Worshipdom tree (116 focuses) stays.

**Events (P).** "The Stones Are Moving" (krors come down from the Lustras Hills onto the Teste road); "Spore Season" (attrition in the Mushroom Forest); "A Letter in an Old Hand" (Varner's counsel, after [EWD] §9); "The Lost Lands Are Quiet" (fishermen report black ships, linking to Zol's rumours); "The Archive's Unfinished Sentence" (Eldafaen reveals an old record about the sons of Ein: hidden until the story allows).

**Decisions (P).** Call the Elder Moot; Tend the Roosts; Ferry the Pilgrims (Luv-zhise and the Worshipdom); Close the Rift Narrows (Luv-zhise sinks the ferries in war); Ask the Mycids for Passage.

**AI (P).** Elven realms never declare offensive wars before the War of the Last Crowns; they join the Kindred when attacked; Herrodon and Andos Enda quarrel but never fight under the historical rule; Luv-zhise sides with whoever holds the rift crossing; the Mushroom Forest never acts.

**Divergences.** The elves march; the eastern coalition is broken at the Narrows; a dragon is corrupted; the Worshipdom is exposed; the Lost Lands become the landing of Zol's dead.

## 13. Questions for the owner

1. **How few elven realms (R-24)?** This proposal keeps seven in the Magical Lands (Magical Forest, Herrodon, Andos Enda, Nolorim, Lccimio, Eldafaen, Yavieth) and moves one to the Middle Lands. Is seven right, or should the rift coast be a single realm?
2. **Sacomananos and the krors.** Is the Kror card's "Salomonanos" the drawn Sacomananos, and may that land become the krors' wild hills (no elven realm)?
3. **The mycids.** May the Mushroom Forest be the mycids' own land rather than part of an elven realm (the world bible leaves it open)?
4. **The Zilin Hills and the Zhen Hills.** Are the vault's "arcanists of the Zhen Hills" in the Zilin Hills, or elsewhere?
5. **Gorbatik and Golbran (Q-16).** Does the card's Gorbatik, who lives in the Magic Mountains, mean Golbran?
6. **Hill elves and the roosts.** The world bible makes the northern hill elves keepers of the Dragon Mountain roosts, which lie at the far south of the Magical Lands; this dossier gives the roosts to a small fellowship under the mountain. Which is right?
7. **Unplaced drawn labels.** "Modhi Rodirik", "Magic Islands", "Dlomntod" and "Medek" ([LBL] Magical Lands): where are they?
8. **The two names of the rift sea.** May the Magical Ocean and the Khadon Ocean become one water, the Rift Sea, and the Mushroom Seas and Reeto Seas one water, the Reeto Sea?

**Renamed labels (owner decisions of 24 October 2026 applied directly; former label kept):**

| Label | Origin | Proposed replacement | Language and meaning |
| --- | --- | --- | --- |
| Greenland | a real-world country name | **Yavieth** | Sylvan *yaviel* "green" with the ending *-eth* |
| Ossa | a mountain of Greek myth | merged into Andos Enda; the lake keeps the Sylvan **Ilawen** ("little lake") | Sylvan *ila* "lake" + *-wen* |
| Heron | an English bird name used as a country | merged; no replacement needed | |
| The End | an English phrase used as a country name (not borrowed from fiction, but not a Sylvan name) | **Eldafaen** | Sylvan *elda* "old" + *faen* "coast" |

## 14. Sources

| Key | File and heading |
| --- | --- |
| [AR] | `docs/lore/vault/05 - Geography/Aoaz and Its Regions.md` (Magical Lands row) |
| [ZM] | `docs/lore/vault/05 - Geography/Zols Mistake.md` (Former terms) |
| [PA] | `docs/lore/vault/04 - Peoples/Peoples of Aoaz.md` (Great Folk; Other peoples; First Age ethnic history) |
| [HB] | `docs/lore/vault/01 - Cosmology/Hierarchy of Being.md` |
| [SN] | `docs/lore/vault/02 - Spirits/Spirit Natures.md` |
| [GP] | `docs/lore/vault/06 - Politics/Great Powers and Relations.md` |
| [AH] | `docs/lore/vault/06 - Politics/Afrits Hidden Council.md` |
| [EO] | `docs/lore/vault/06 - Politics/Elzons Order.md` |
| [A1] | `docs/lore/vault/07 - History/The First Age of Aoaz.md` (§4, §5, §7) |
| [A2] | `docs/lore/vault/07 - History/The Second Age of Aoaz.md` (§II, §VII) |
| [2R] | `docs/lore/vault/07 - History/Second Age Canon Register.md` |
| [A3], [3R] | `docs/lore/vault/07 - History/The Third Age of Aoaz.md`; `Third Age Canon Register.md` |
| [A4] | `docs/lore/vault/07 - History/The Fourth Age of Aoaz.md` (§IX, §X, follow-up decisions) |
| [4R] | `docs/lore/vault/07 - History/Fourth Age Canon Register.md` |
| [FC] | `docs/lore/vault/07 - History/Fourth Age Chronology.md` (III) |
| [C48] | `docs/lore/vault/07 - History/The Campaign of 4A 1748.md` (The Magical Lands) |
| [ER] | `docs/lore/vault/07 - History/The Elven Refusal.md` |
| [WLC] | `docs/lore/vault/07 - History/War of the Last Crowns.md` |
| [BR], [WU] | `docs/lore/vault/07 - History/Black Roots.md`; `War of Unbinding.md` |
| [VA], [GB], [AF], [LO] | `docs/lore/vault/03 - Figures/Varner.md`, `Golbran.md`, `Afrit.md`, `Lorien.md` |
| [OC] | `docs/zin-handoff/01-CONTEXT-AND-CANON.md` §2.2, §2.3 |
| [OD] | Owner decisions of 24 October 2026 relayed by the coordinator (renaming of unfitting and borrowed labels; dwarves hold the Great Wall range; twelve main and lesser New Gods; no exact ages) |
| [GM] | `tools/content/data/geography/aoaz.json` (ids as cited) |
| [GMS] | `docs/specs/01_map/05_geography_model.md` (§2 Magical Lands; §2 resource table; §6; §13) |
| [DEM] | `tools/content/data/world/demography.json` (regions, countries, settlements, density modifiers, minorities) |
| [WB] | `docs/specs/02_lore/05_world_bible.md` (§3.2 elven cultures; §3.1 Zilin Pilgrim-Folk; §4; §5 The Worshipdom, The Magical Forest; §6.9; §7) |
| [LANG] | `docs/specs/02_lore/06_languages.md` (§1, §2, §3.13 Sylvan); `tools/content/data/world/languages.json` (`sylvan`, `aenoran`, `alerhic`) |
| [ROS] | `tools/content/data/countries.json` (scan Magical Lands) |
| [LBL] | `tools/content/data/labels.json` (Magical Lands) |
| [BC] | `docs/lore/sources/bestiary_cards_part1.md` (card 30 Kror), `bestiary_cards_part2.md` (card 34 Gorbatik, card 44 Dwarf, card 53 Chiromaw) |
| [EWD] | `docs/specs/04_mechanics/elves_wall_and_dragons.md` (§1, §2, §3, §5, §6, §8, §9) |
| [EK] | `docs/specs/04_mechanics/eastern_kings.md` (§5) |
| [FT] | `docs/design/focus/*.json` (summaries: magical_forest, regional_herrodon, regional_andos_enda, regional_nolorim, regional_lccimio, regional_the_end, shared_magical_lands, worshipdom) |
