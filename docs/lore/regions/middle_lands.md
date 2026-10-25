# Regional dossier: the Middle Lands

**Requirement:** R-19 (regional dossiers), with R-21, R-22 (Hirolon has its own dossier, [hirolon.md](hirolon.md)), R-24, R-25, R-26 and R-29.
**Status:** Draft of 24 October 2026. Everything not marked **established** is **proposed** under decisions L1 to L3 and needs the owner's acceptance.
**Labels:** **E** established (with its source key from section 14), **P** proposed, **O** open in canon (never answered here), **hidden** true but never public before the matching story flag.
**Scope:** the Middle Lands with Aenor Isle, which the vault counts as part of them ([AR]). Hirolon, the giants' kingdom inside the Middle Lands, is treated in [hirolon.md](hirolon.md); this file only summarises it.

## 1. Overview

The Middle Lands are the warm, wet, deep-soiled heart of Aoaz: a rounded land between the wide Crown Sea on the west and the enormous natural range called the Great Wall of Aenor on the east, with the Great Lake shining in its south-west and the Vale of Aenor, the best farmland in the world, spread around it. Here Aen ended the War of Men and founded Aenor, here the First Age capital fell to Volgan, here Elzon ruled for more than twelve centuries, and here a restored crown has kept seventeen centuries of peace (E: [A1], [A3], [C48]). In 4A 1748 the Middle Kingdom is rich, crowded and badly ruled: a Golden King sells offices in Parim, his chartered dominions grumble, and the beloved god of the realm is not what his worshippers believe (hidden). Yet the Middle Lands are not one long run of human kingdoms. Ents walk the Kilinti Forests and the walking tree-people called the Baelim (former card name Coniferons) the great Aenor Forest of the north (owner decision of 24 October 2026), the sovereign giants of Hirolon keep their ring of hills in the west, dwarves hold the great range itself, gnomes hide in the hills beside the capital, a goblin king rules the caves of the southern range, the descendants of Aen's beaten enemies keep their own tongue in the Bloody Forest and the Cursed Lands, and a small company of elves still lives on the wrong side of the mountains (P unless marked).

**Owner decisions of 24 October 2026 applied in this file ([OD]):** Hirolon (former label Hiloron) is a sovereign giant kingdom that treats with Aenor; "Rush" is the old name of Aenor, so the drawn Rush Forest is **the Aenor Forest**, the largest forest of the Middle Lands and home of the Coniferons (renamed Baelim in this file), a walking tree-people separate from the ents (ents and Baelim never share a forest); the small folk of the hobbit card get an original people name and homeland; dwarves hold the great ranges of the West and North Lands and the Great Wall range; Edvoid (name to be replaced) is Zol's most loyal servant in the War of the Last Crowns; gunpowder weapons are common in some realms; Bastian is a living human wizard of the Fourth Age, famous in the Middle Lands; no exact age of any being is stated; the twelve main New Gods answer the twelve needs of mortals and lesser New Gods also exist; the Deliverer's cult has a feast, not a month; names from other fiction or real myth are replaced directly, and drawn labels that do not fit are renamed with the old label kept as a former label.

## 2. Physical character

### 2.1 The land as a whole

| Item | Value | Source |
| --- | --- | --- |
| Extent | About 740 by 770 pixels of the 5,120 by 2,560 game layout (x 0.535 to 0.680, y 0.420 to 0.720); 221,008 square pixels | [GM] `region_middle_lands` |
| Elevation | Plains (class 1) in the Vale and around the lake; the Konori plateau (2); the range belt on the east at 4 to 5 | [GM] `region_middle_lands` |
| Climate | Warm temperate, humid, long growing season; mild winters with light frost; wet springs | [GM], [GMS] §2 Middle Lands |
| Terrain mix | Plains 50%, forest 20%, hills 12%, mountain 12%, marsh 2%, towns 4% | [GM] |
| Fertility | The richest land of Aoaz: the Vale of Aenor (`plain_vale_of_aenor`), the Great Lake shore, Novez Fields (`plain_novez`), the Safeton Coast (`plain_safeton`), Hunhun Downs (`plain_hunhun`) | [GM]; Aenor is fertile, never desert (owner rule, [RQ] R-11) |

**Seasons (P).** Westerly winds off the Crown Sea bring rain from autumn to late spring; the summer is long and warm and the Vale gets two harvests of barley in good years. The range on the east catches the last of the rain, so its western face is forested and its eastern face (the Magical Lands side) is misty rather than dry. Frost touches the Konori plateau and the high Kingson Vale every winter but rarely the lake shore.

**Rivers (all P except the Great River).** The River Aenar (`river_aenar`) leaves the Lunhrim foothills, crosses Konori and the Vale and enters the Great Lake under the Parim bluff; it is the main river of the kingdom and the barge road of the grain. The Great River (`river_great`, drawn, reading uncertain) drains the Kingson Vale through the only gorge in the Gigantic Mountains into the lake; the corallus card calls a river of this valley the "Kingson River" ([BC] card 65), which is probably the same water (owner question 5). The River Selenar (`river_selenar`) runs from under the northern Crown Mountains across the Selen glades to the Sea of Monsters and divides Selen from the Vale. The River Safen (`river_safen`) is the lake's outflow to the south coast at Safeton. The Konorar (`river_konorar`) flows north to the Narrow Strait beside the Bloody Forest. The River Hilorn (`river_hilorn`) belongs to Hirolon.

**Hazards.** Spring floods on the Aenar and the Safen; the reed swamp of Saeton (`marsh_saeton`) on the lake's south-east shore with its coralluses ([BC] card 65); winter fogs on the lake; the poisoned blossoms of the tzikor in the Aenor Forest ([BC] card 3, "Rush Forest"); rockfall and snow in the range; the sour, barren ground of the Cursed Lands (`waste_cursed_lands`, E that they exist and resist Aenor: [ML], [GP]). Dragons cross the range from Dragon Mountain and sometimes take herds (P, after [PA] that dragons come chiefly from Dragon Mountain).

### 2.2 Coasts, seas and straits (one name each)

| Water | Model id | Name used here | Note |
| --- | --- | --- | --- |
| The wide central sea between the West Lands and the Middle Lands | `sea_crown_ocean` | **Crown Sea** (P) | Replaces the superseded drawn "Rush Ocean". The owner widened this sea ([AR], [OC] Fourth Age map) |
| Off the north-west coast | `sea_monsters_sea` | **Sea of Monsters** (drawn) | Sea serpents are seen here (P, after [BC] card 12, which places them in unplaced seas) |
| Off the south-west coast | `sea_peace_ocean` | **Ocean of Peace** (drawn) | The pilgrim and trade route to the south |
| The sea of the Narrow Strait | `sea_leren_ocean`, `strait_narrow` | **Leren Ocean** and **the Narrow Strait** (drawn, E strait) | The North Lands lie across it ([AR]) |
| North-east, between R'en and the Bloody Forest | `sea_rim_ocean` | **Rim Ocean** (drawn) | |
| Between Aenor Isle and the mainland | `strait_aenor_isle` | **the Inner Sea** (P; drawn "Inner Seas" on the Rush Islands sheet, [LBL]) | Replaces the model's proposed "Asgard Sound" |
| South-west strait to the Dark Lands | `strait_dark_south`, `sea_death_sea` | **Gaelmael**, "the Grey Water" (P, Aenoran) | The drawn "Sea of Death" collides with the Ember Lands' "Sea of Deaths" and "The Dead's Sea"; this name must be agreed with the Dark Lands dossier |
| Bays | `bay_novez`, `bay_safeton` | **Novez Bay**, **Bay of Safeton** (P) | |
| Capes | `cape_organ`, `cape_selen`, `cape_hiloron` | **Organ Cape**, **Selen Point**, **Hirolon Head** (former label Hiloron Head) (P) | |

Two drawn sea labels of the Rush Land sheet are not in the model: "Lotloren Sea" and "Semi Sea" ([LBL]); the model makes Semi Sea a small tarn in the Organ foothills (`lake_semi_sea`). The drawn "Lotloren Sea" echoes another fiction's name and is renamed **Nimmael**, Aenoran "low sea" (former label Lotloren Sea); the proposal makes it the shallow bay inside Selen Point.

### 2.3 Aenor and Parim

The Vale of Aenor (`plain_vale_of_aenor`, P name) is a plain of deep black soil from the Selen woods to the Great Lake, 85 percent open land, the rest copses and orchards ([GM] note). The River Aenar crosses it from north-east to south-west. Its northern edge rises into the ochre Konori Downs (`plain_konori`), its western edge into the Grano and Deodolor hills, and its south-east into the Hunhun Downs. North of the lake lie the Stone Forest (`forest_stone`, a sparse petrified wood) and, above it, the brown Deodolor Hills (`range_deodolor`).

**Parim** (`site_parim`, E as the map-design capital, [ML]) stands on a lake bluff on the north shore of the Great Lake where the Aenar enters it; the palace stands on the cliff above the water (`site_palace_cliff`, P), which fits the vault's account that Afrit throws Eindil from a cliff into water below ([A4] §XIV; the place of that cliff is P). The city has three parts (P): the lower town of quays, granaries and bargemen along the river mouth; the bridges and guild halls of the middle town; and on the bluff the palace, the House of the First Light and the Golden Court, a district of gilded halls completed in 4A 1733 ([FC] IV, P).

### 2.4 The Great Lake

The Great Lake (`lake_great_lake`, E heartland) is a four-lobed inland water of about 205 by 200 pixels, which the model keeps at eight or more lake provinces with at least three coastal victory points ([GM] note). Its north lobe lies under Parim, its west lobe faces the Grano hills and Hirolon, its east lobe receives the Great River from the Kingson gorge, and its south lobe drains by the Safen to the sea. The shores are the densest farmland in Aoaz: the demography model puts up to 110 people per square kilometre beside the lake ([DEM] Middle Lands). The south-west shore holds the Novez Fields; the south-east shore the Saeton reeds. Fogs and sudden squalls make lake sailing a guild craft (P). Coralluses, crocodile-like animals seven to ten metres long, live in the lake and the swamps and attack anyone who enters their waters ([BC] card 65).

### 2.5 Selen

Selen is the north-west of the Middle Lands: the dense, dark Selen Weald (`forest_selen`, P name), the Ulgus Glades on its north coast (`plain_selen_glades`, drawn; the model places them on Selen's north coast, while the world bible places Ulgus's orchards on the lake's east shore: section 13), and the coastal ridge of the Hiloff Rim (`range_hiloff_rim`) on its western edge. The River Selenar is its southern border with the Vale. Selen Point faces the Sea of Monsters.

### 2.5a The Aenor Forest

**Owner decision ([OD]):** the drawn "Rush Forest" is **the Aenor Forest**, the largest forest of the Middle Lands, home of the Baelim ([BC] cards 3, 40; "Rush" is the old name of Aenor).

**Renamed creatures (owner addition of 24 October 2026: the card names are borrowed).** The walking tree-people of the Coniferon card are named **Baelim** (one of them a **Baelen**), Aenoran *bael* "tree" with *-im* "the people of" (*-en* "dweller"), the word the Selen rangers and Konori riders who live round the forest use; former card name: Coniferon ([BC] card 40). The moving flower-creature of the Vinocorne card is named **tzikor**, Orran *tzikor* "thorn", the word of the Redbark of the neighbouring Bloody Forest, borrowed by the Selen rangers with its Orran *tz* (a loan explained by centuries of contact at the forest edge, [LANG] §5); former card name: Vinocorne ([BC] card 3). The model's `forest_crown` (proposed name "Crown Forest", alias Rush Forest) is only "the aqua wood of the north coast" ([GM]); the map must rename it and enlarge it until it is larger than the Selen Weald (P extent): from the Selenar's head-waters east along the north coast to the Konorar and up the north slopes of the Crown Mountains, between Selen, Konori and the Bloody Forest. It is an old mixed wood of giant conifers (the Baelim's kin-trees, P), aqua-green in the drawing, very wet, with deep moss and few paths. Men do not cut it; the tzikor, moving flowering plants, grow in its clearings ([BC] card 3). Ents never live in it; the ents' forest is Kilinti ([OD]).

### 2.6 Kilinti

The Kilinti Forests (`forest_kilinti`, E, drawn Klinti; [GP] counts Kilinti and the Kilinti Forests as one country) lie in the middle of the land between the Vale and the Konori Downs, a dense old wood on the upper Aenar. The seat Kilinti (`site_kilinti`) is in the oldest grove. The wood is well watered; its edges are farmed by men; its heart has not been cut in living memory (P).

### 2.7 Kingson inside its ring of mountains

Kingson (`site_kingson`, E name) lies in the Kingson Vale (`plain_kingson_vale`, `zone_kingson_vale`, P names), a high valley floor (class 2) ringed on every side by mountains ([GMS] §13 question 2, proceeding): the Gigantic Mountains on the west (`range_gigantic`), the Lunhrim massif on the north (`range_lunhrim`), the westernmost ridge of the Magic Mountains on the east (`range_magic_wall`) and the southern arc of the Crown Mountains on the south (`range_rush_south`, drawn "Rush Mountains"). The Great River gathers the vale's streams and leaves westward through the only low way, the Great River Gorge (`pass_great_river_gorge`), to the Great Lake. Eastward, a single pass leads out between Lunhrim and Dragon Mountain into the Magical Lands (`pass_kingson_gate`, the model's "Kingson Gate"; P to call it **the Kingson Pass** in geography and keep "the Gate" only as the valley's own word for it). The vale has medium fertility, cold winters, short summers and good pasture; it is the only farmland inside the range.

### 2.8 Aenor Isle

Aenor Isle (`region_aenor_isle`, E as part of the Middle Lands, [AR]) lies off the west coast across the Inner Sea, about 130 pixels from the Hirolon coast ([GM] `strait_aenor_isle`). It is low (class 1 to 3), warm and maritime, and fertile everywhere: its green heart is Rish (`plain_aenor_isle`, drawn), its east end the brown Tinta Hills (`range_tinta`), and its west end the harbour-realm of **Orohaf** (`site_asgard`; former label Asgard, a name from Norse myth, replaced under the owner's decision [OD]; Aenoran *oro* "island" + *haf* "harbour") facing the Sea of Monsters. The drawn sheet names five lands on the isle: Asgard (now Orohaf), Rish, Tinta, Holod and Faber ([LBL]). **Model defect:** the model's isle polygon has a second box over the mainland coast, and its Rish and Tinta Hills points lie on the mainland (x 0.541 to 0.554) outside the isle's own land polygon (x 0.512 to 0.535) ([GM] `region_aenor_isle`, `plain_aenor_isle`, `range_tinta`, `land_aenor_isle`); the map work must move them onto the isle.

### 2.9 The Great Wall of Aenor: a natural range

**Established:** the Great Wall of Aenor runs from the Organ Mountains past Lunhrim and around Kingson and separates the Middle Lands from the Magical Lands ([C48] "The Middle Lands"; [GM] `range_great_wall`). **Owner correction of 24 October 2026:** it is an enormous **natural** mountain range; no artificial wall, no megastructure gates; fortified passes and watchtowers only where history explains them ([OC] §2.2). The model's notes still describe "the man-made wall on its east crest" and "four named gates" with level-5 forts, and the vault's proposed 4A 96 Wall Accord rebuilds Elzon's Pale March in stone ([GM] `range_great_wall`, `zone_great_wall`; [FC] I; [GMS] §4); all three are superseded by the correction and must be rewritten (section 13).

The name, proposed: the First Age charts called the range "the Great Wall of Aenor" because it stood like a wall along the whole eastern edge of Aen's kingdom, and no Aenoran road could cross it except at one pass (P).

**The range from north to south** (all ids from [GM]; descriptions of snow, passes and routes P):

**Owner decision ([OD]):** dwarves hold the Great Wall range (as they hold the great ranges of the West and North Lands). In this dossier the dwarf hold of **Kunhrim** holds the range from the Organ Mountains to the Kingson ring and the Giant Mountains' high crest; the goblins of Glimik are an older-than-the-peace enclave in the Cursed Mountains and the caves under the Giant Mountains' southern end, and the two peoples have an armed truce (P).

| Section | Id | Height | Character | What crosses it |
| --- | --- | --- | --- | --- |
| Organ Mountains | `range_organ_mountains` | high peak (5) | Fluted basalt columns rising straight from the Narrow Strait at the Organ Cape (owner description in the model). Black cliffs, no soil, permanent ice in the gullies above the midline of the columns. | **The Organ Coast Road** (`pass_organ_coast_road`): a shelf under the cliffs that is dry for a few hours at each low tide. Single file only; drowned twice a day; held from the Bloody Forest side; used by smugglers, Redbark raiders and couriers who cannot wait for the Kingson Pass. Closed to armies. |
| Northern foothills | `range_crown_north`, `lake_semi_sea` | hills (3) | The northern Crown Mountains on the Konori side; the small tarn of the Semi Sea in the Organ foothills. | Herd paths only. |
| Lunhrim | `range_lunhrim`, peak at (0.661, 0.515) | high peak (5) | The great massif of the range, drawn as "Kunhrim" on the Rush Land sheet ([GM] note). Snow lies above the upper third all year; glaciers feed the Aenar's head-streams. The dwarf hold of Kunhrim is delved into its western face (P, section 3.7). | **The Lunhrim Notch** (`pass_lunhrim`, mountain 4): a high saddle closed to wheels, snowbound from late autumn to late spring; open on foot to rangers, elven envoys and dwarf carriers, and to dragons in the air. |
| The Kingson ring | `range_gigantic`, `range_magic_wall`, `range_rush_south` | 4 to 5 | The ring around the Kingson Vale (section 2.7). The Gigantic Mountains are the dwarves' "Gigantic Mountain" of their card ([BC] card 44). | **The Kingson Pass** (`pass_kingson_gate`, hills 3): the one wheel road through the range, east from the vale between Lunhrim and Dragon Mountain; snow closes it for about two months in deep winter. **The Great River Gorge** (`pass_great_river_gorge`): the only low road between the vale and the lake plain. Together they form the single trade and war road between the two lands. |
| Dragon Mountain | `range_dragon_mountain`, `site_dragon_mountain` | high peak (5), the highest of the belt | Stands at the south-east corner of the ring just east of the range line, so it belongs to the Magical Lands; roosts on three spurs ([GM] note). Dragons chiefly come from here and form no country (E, [PA]). | Nothing on foot; the dragons' sky. |
| Cursed Mountains and the Forests of Darkhere | `range_cursed_mountains`, `forest_darkhere` | mountain (4) | A narrow dark ridge at the south end of the ring and a dense wood below it. The goblin warrens of Glimik open under this ridge (P). | Goblin under-roads (P, below). |
| Giant Mountains | `range_giant` | high peak (5) | The long wild southern ridge down to the south coast (drawn Giant Mountains and Cursed Mountains). Impassable along most of its length: knife ridges, scree and no water. Lake Lozo lies in the fold at its eastern foot ([GM] `lake_lozo`). | **The South Pass** (`pass_south_gate`, hills 3): the Herez road between the Giant Mountains and the Cursed Lands, leading to the Zilin Hills and Nolorim. **The goblin under-roads** (P): caves and old tunnels under the Giant Mountains, known in full only to the goblins; Elzon's garrisons used them (section 7). |
| The Grey Hills | `range_grey_hills` | hills (3) | Brown hills of the south coast above Herez; they are the Middle Lands' southern edge, not part of the range. | Open. |

**Snowlines and seasons (P).** Permanent snow lies above the high-peak class: the summits of the Organ Mountains, Lunhrim, the Gigantic Mountains and the Giant Mountains are white all year, and the Magic Mountains' parallel ridges behind them are drawn snow-capped ([GM] `range_magic_1`). The mountain-class notches (Lunhrim) close for five to six months; the hill-class passes (Kingson, South) close for one to two months in the worst winters only. The western face is wetter and wooded (the Kingdom Forests at the foot of Lunhrim, `forest_kingdom`); the eastern face is misty and mossy.

**How the range shapes the Middle Lands (P).**

- *Terrain and settlement.* The range is a barrier about 150 to 250 pixels wide with its foothills ([GM] `range_great_wall`); nobody farms it except in the Kingson Vale. Settlement stops at the foothills: the Konori steppe, the Hunhun Downs and the Herez marches end where the slope begins. Inside the range live peoples who want the stone and the dark: the dwarves of Kunhrim, the goblins of Glimik, the chiromaws of the caves ([BC] card 53 places chiromaws in "the Wall of Rush"; the model reads the drawn "Wall of Rush" as the Hiloff Rim, so their caves are proposed in both).
- *Trade.* Every cart between the two lands goes through the Great River Gorge and the Kingson Pass. Kingson lives on this. Silver, healing herbs and dragon-scale come west; iron, grain, cloth and glass go east ([WB] §7 "The Wall Road", P). Dwarf iron from Kunhrim comes down to Kingson.
- *Cultural contact.* The range keeps elves and men apart. Contact is funnelled through Kingson's market, the pilgrim road over the South Pass to the Zilin Hills, and the small elven company that stayed in the Kingdom Forests on the western side (section 3.8). Men of the Vale know elves as courteous strangers ([WB] Lake Aenorans).
- *War.* An army can cross only at the Kingson Pass (with the gorge behind it) and the South Pass; the Organ shelf and the Lunhrim Notch admit raiders, not hosts. Whoever holds Kingson holds the road. The vault's eastern coalition threatens the Magical Lands from the rift, not the range ([WLC] phase 1), so in the War of the Last Crowns the range shields Aenor's east, while the goblin under-roads are the one route the defenders do not watch (P).
- *Fortified passes, and why.* Watch-forts stand only where history put them (P): the Kingson Pass forts were first raised by Elzon's Order in the Third Age to keep the unconquered elves out of the vale (E that the Magical Lands were never conquered, [EO], [A3]); after Elzon's death the restored crown and the elven realms agreed, in **the Accord of the Passes** of 4A 96 (P; it replaces the vault's proposed "Wall Accord"), that men keep the forts on the western side of the two wheel passes and elves the eastern side, and that tolls are taken at Kingson. The South Pass has a tower on each side for the same reason; the Klungori Guard keeps the western one against the goblins. The Organ shelf and the Lunhrim Notch have only beacons.

## 3. Inhabitants

### 3.1 Peoples, cultures and languages

| People | Culture (data id) | Language | Where | Status |
| --- | --- | --- | --- | --- |
| Men | Lake Aenorans (`lake_aenoran`) | Aenoran, lake dialect | The Vale, the lake, Parim | P culture over E people ([PA]: "Middle Kingdom peoples") |
| Men | Selen Rangers (`selen_ranger`) | Aenoran, ranger dialect | Selen, the Aenor Forest's western edge | E rangers of Selen ([ML], [SE]) |
| Men | Steppe Riders (`steppe_rider`) | Aenoran, rider dialect | Konori Downs, Hunhun Downs | E riders of Huhun or Hunhun ([ML]) |
| Men | Wall-Folk (`wall_folk`), P to rename "Vale-Folk of Kingson" because there is no wall | Aenoran, march dialect | Kingson Vale, the South Pass | P |
| Men | March-Folk (`march_folk`) | Aenoran, march dialect | Herez, Noleksun, the southern marches | P |
| Men | Isle Houses (`isle_houses`) | Aenoran, isle dialect | Aenor Isle | P |
| Men | Leren-Aenoran strait folk (P, new) | Leren and Aenoran | Fotan on the Narrow Strait | P (section 11) |
| Men | The Veiled (`veiled_folk`) | Orran | The Cursed Lands | P culture; E that the Cursed Lands resist Aenor ([GP]) |
| Men | Redbark Tribes (`redbark_tribes`) | Orran | The Bloody Forest | P culture; E that it resists Aenor |
| Ents | Ents of Kilinti (`kilinti_ents`) | the Long Speech | Kilinti Forests | E ([PA]: ents are the people of Kilinti Forest) |
| Dwarves | Delving-clans of Kunhrim (P, new) | Dwarvish (no language data yet; [LANG] §2 reserves it) | The Great Wall range from the Organ Mountains to the Kingson ring, chiefly the Lunhrim massif and the Gigantic Mountains | Owner decision: dwarves hold the Great Wall range ([OD]); the card puts "many" in "Gigantic Mountain" ([BC] card 44); the hold's name and form P |
| Gnomes | Holt-folk of Olodor (P, new) | none recorded; they speak Aenoran to outsiders (P) | Deodolor Hills and the Stone Forest, under the Stendorler quarries | P placement after [BC] card 38 ("Olodor and Steadtler"); Q-23 |
| Goblins and hobgoblins | Goblin Warrens (`goblin_warrens`), as the people of a realm | Goblin Cant | Giant and Cursed Mountains | P; R-25 asks for a goblin kingdom in the mountains; [BC] cards 29, 36 |
| Elves | The Kingdom Forest company (P, new) | Sylvan, an old western form | Kingdom Forests at the foot of Lunhrim | P (section 3.8) |
| Giants, small folk | see [hirolon.md](hirolon.md) | | Hirolon | |
| Tree-people | Baelim (former card name Coniferons) | none recorded; men hear low voices | Aenor Forest | Card statement ([BC] card 40); owner decision: separate from the ents, never in the same forest ([OD]) |

**Languages and names.** Aenoran is the Common Speech; its dialects mark the cultures (lake, ranger, rider, march, isle) and its sound laws (th > t, w > v, s > z between vowels, final -a > -e) shape every new name in this file ([LANG] §1). Old Ainic is kept for royal names, law and holy sites. Orran is the substrate of river and forest names and survives as a living tongue only among the Veiled and the Redbark (P, [LANG] §5). Shared roots between the Middle Lands peoples are explained by descent from Aen's kingdom (all the Aenoran dialects), by long contact (Selen ranger words in the ent-edge villages), or by conquest (Orran river names under Aenoran towns).

### 3.2 Population

The demography model gives the Middle Lands 24.5 million living people, 28 percent of the world, in 30 countries and 96 states, with Parim at 380,000 and an urban share of 24 percent ([DEM] Middle Lands). That total is plausible: a warm, twice-harvested plain after seventeen centuries of peace, Second Age farming and Third Age cleansing of the grave-fields ([A4] prologue) can carry about 40 people per square kilometre on average. The distribution needs revision.

| Group | Model | Revised (P) | Why |
| --- | ---: | ---: | --- |
| Aenor with Tieri, Dariap, Mondon, Stendorler merged | 11,931,700 | about 11,900,000 | Unchanged: the Vale and the north shore are the densest land. |
| Selen with Vothrim, Svenlor, Ulgus merged | 2,438,400 | about 1,900,000 | The Weald interior is dense forest; only the glades, the coast and the river edge are farmed. |
| Konori | 532,700 | about 530,000 | Dry plateau steppe; unchanged. |
| Hunhun with Noloreh | 532,700 | about 560,000 | Rich downs; slightly up. |
| Kingson with Olvinc-un | 1,136,400 | about 420,000 | The model counts four Kingson states as farmland; the ringed vale is small and high. |
| Kunhrim (was steppe riders on the Lunhrim massif) | 319,600 | about 60,000 (45,000 dwarves, 15,000 men carriers and smiths) | Riders cannot live on a high-peak massif; dwarves can. |
| Klungori Guard | 378,800 | about 120,000 | A mountain march. |
| Herez with Belurithon | 911,400 | about 700,000 | Marches with empty roads. |
| Noleksun | 1,041,600 | about 1,040,000 | Unchanged. |
| Kilinti | 189,400 (123,100 ents) | about 75,000 (2,500 ents, 72,500 men) | Ents are few, huge and slow; a forest cannot hold a hundred thousand of them, and the vault never says they are many. |
| Safeton with Novez | 1,112,700 | about 1,110,000 | Unchanged. |
| Freshon, Pazoma | 2,840,800 | about 2,500,000 | Rich lake towns, slightly lower. |
| Orohaf (Aenor Isle; former label Asgard) | 260,400 | about 300,000 | All of the isle is fertile. |
| Fotan | 355,100 | about 300,000 | |
| Cursed Lands | 59,200 | about 40,000 | Sour ground. |
| Bloody Forest | 213,100 | about 90,000 | Hunting tribes in dense wood. |
| Glimik (goblins, new) | 0 | about 85,000 (75,000 goblins, 10,000 hobgoblins) | Warrens in the southern range, under land the model leaves thin. |
| Olodor (gnomes, new) | 0 | about 12,000 | Hidden holts; the card says their villages are hard to find. |
| Kingdom Forest elves (new) | 0 | about 5,000 | A remnant. |
| Aenor Forest Baelim (new) | 0 | about 1,500 | A slow, huge tree-people; no men live inside the forest. |
| **Total, without Hirolon** | 24,253,800 | **about 21,650,000** | Hirolon adds about 160,000 ([hirolon.md](hirolon.md)). The region falls about 2.7 million below the model; the world total stays inside its 60 to 120 million range ([DEM] world). |

Where people live and why: along water first (the Aenar, the Great River, the lake shore and the Safen, where the model doubles density), then on the loess plains, then in the forest edges; the range, the Cursed Lands and the deep Weald are thin ([GMS] §5). Old battlefields and the soured ground of the Third Age are still underpeopled ([DEM] density modifiers: ruined battlefield ×0.5, Black Roots scar ×0.25).

### 3.3 Aenor and Parim

The Vale is Lake Aenoran country: farmers, bargemen, scribes, guildsmen and the crown's clerks. Every town has a House of the First Light that is clinic, grain store and school ([WB] Lake Aenorans; the Houses are P, [HF]). Parim holds about 380,000 people ([DEM]); its second and third cities are the lake ports Dolepar (62,000) and Silesire (55,000) and the road fortress Kerepael (34,000) ([DEM] settlements; names P). The noble houses all claim descent from one of Aen's hundreds of sons ([A1] §3, E that he had hundreds of sons), so rival claims are ordinary.

### 3.4 Selen

Selen's people are rangers, woodsmen and scholars: the moots of the Weald, the University of Selen (4A 340, [FC] II, P) and the hunting towns of the glades. They sheltered the survivors of the Fall of Aenor in 2A 2133 and bred the resistance that outlasted Elzon (P, [WB]). Alleria of Selen, ranger and archer, is one of them (E, [AS]).

### 3.5 Kilinti

The ents are the people of the Kilinti Forest (E, [PA]); their rank, mortality and origin are open (O). Perhaps two or three thousand of them stand in the groves (P). Seventy thousand men live at the edges: woodcutters' kin who keep the forest's accounts and speak for the ents in the Concord (P, [WB]). The Baelim of the Aenor Forest (former card name Coniferons) are "tree-like beings", strong and very slow, ten to thirty metres tall, with skin softer than wood and yellow blood ([BC] card 40); they are a people separate from the ents, and the two never share a forest ([OD]).

### 3.6 Kingson inside its ring

The vale-folk descend from families who held the valley through Elzon's occupation and were granted the pass watch at the Accord of the Passes (P). They farm the vale, keep the forts on the western side of the Kingson Pass and live on the tolls of the only wheel road through the range. Dwarf carriers from Kunhrim come down to their market every week (P).

### 3.7 The peoples inside the range

- **Dwarves of Kunhrim.** The owner has decided that dwarves hold the great ranges of the West and North Lands and the Great Wall range ([OD]). The dwarf card puts dwarves in six mountains, "and many in Gigantic Mountain"; they are 1.3 to 1.5 metres tall, long-lived, dig for gold and gems, fight with axes and hammers but never bows, are proud and quarrelsome, and do not like elves ([BC] card 44). The only drawn Gigantic Mountains are the western side of the Kingson ring, so the proposal makes the Lunhrim massif and the Gigantic Mountains the heart of the Great Wall range's dwarf hold, with outer delvings in the Organ Mountains and on the Giant Mountains' high crest (P). The drawn label "Kunhrim" (the model's uncertain reading of Lunhrim) is proposed as the dwarves' own name for the massif and their hold. Their dislike of elves explains why the hold faces west and sells its iron to men. A dwarven engineer, "Brunek of the Stone Roads", is a proposed First Age character whose homeland is not set ([A1] §5); Kunhrim would be his. The dwarves make black powder and cast bombards: gunpowder weapons are common in some realms by owner decision ([OD]), and Kunhrim is proposed as one of them; its bombards stand in the Kingson Pass forts and its powder is sold to Aenor's crown and to nobody else (P).
- **Goblins and hobgoblins of Glimik (P).** Goblins live inside mountains and caves where it is warm, never in the cold; they love gold and fine objects, are cleverer with tools than orcs, ride wolf-like beasts on the surface (the card's "wargs", renamed **wurghs** after the Orcish *wurgh* "wolf") and are made drowsy by the sun ([BC] cards 36, 15). Hobgoblins are bigger goblins, 2 to 2.4 metres, the warrens' defenders and heavy workers; "the king of the goblins is also a hobgoblin who simply grew very big", and they are most numerous in caves the card calls "Ellenmoor" ([BC] card 29), a name too close to another fiction's and replaced here by the Goblin Cant **Burrikkrit**, "tunnel-mountain" (former card name Ellenmoor). The proposal places Burrikkrit in the Cursed Mountains and under the southern end of the Giant Mountains: warm, cave-riddled, above the dark Forests of Darkhere, inside the range the dwarves hold. Their history (section 7) makes them the left-behind garrisons of Elzon's Order; dwarves and goblins keep an armed truce. The goblins too make crude powder for mining and for fire-pots thrown in the tunnels (P). Their king rules his own realm only, not the goblins of the world (P, after Q-21).
- **Gnomes of Olodor (P).** Gnomes are 0.7 to 1 metre tall, long-lived, live in small houses inside trees or in the ground, love nature, hide their villages, mine gold, and give luck to those who bring them gold; every village has one king, who crowns the richest gnomes ([BC] card 38; the card's word for a rich gnome, "Leprechaun", comes from Irish folklore and is replaced by the Common Speech **gold-crowned**). The card names their homes "Olodor and Steadtler". The proposal reads "Olodor" as the gnomes' name for the Deodolor Hills north of the Stone Forest (the drawn label contains it) and "Steadtler" as the drawn Stendorler, the grey-stone ridge whose quarry cut the bridges of Parim ([WB] §6.1). The gnome holts therefore lie within a day's walk of the capital, and almost nobody in Parim knows it.
- **Chiromaws.** Thin, cave-bound creatures 0.9 to 1.5 metres tall that see only in the dark, dry up in sunlight and kill with claws and teeth; they live in caves in "Olodor and the Wall of Rush" ([BC] card 53). They are pests of the gnome holts and the dwarf galleries (P).

### 3.8 The elves on the western side (P)

The Kingdom Forests (`forest_kingdom`, drawn) lie in a dense strip at the foot of Lunhrim on the **Middle Lands** side of the range ([GM] region `middle_lands`), while the roster puts an elven country called "Kingdom" (seven states) on the Magical Lands sheet ([ROS] Y80). The proposal reconciles the two: a small company of elves who would not leave their western woods when the range became the boundary between men and elves, about five thousand strong, living in the Kingdom Forests on the road to the Kingson Pass. The Herrodon tree already speaks of "the lost kin of the west" ([FT] `regional_herrodon`). Proposed Sylvan name: **Dunelaeth**, "the king's wood", a translation of the drawn label.

### 3.9 Aenor Isle

The isle houses are shipwrights and fishers ruled by their eldest women; the isle took in mainland refugees in the Second Age (P, [WB] Isle Houses). About 300,000 people live there (revised, section 3.2).

## 4. Livelihoods and resources

| Resource | Where | Notes |
| --- | --- | --- |
| Grain (barley, wheat), orchards, wine | The Vale, Novez Fields, the Safeton Coast, the Selen slopes | The granary of Aoaz ([GMS] §2 resource table: food and manpower) |
| Horses | Hunhun Downs, Konori Downs | The Hunhun breed carries the Concord's lancers (P, [WB] Steppe Riders) |
| Timber | Selen Weald, Kilinti edges (by the ents' leave only), Kingdom Forests | Kilinti's charter "asks only for timber" ([FT] `regional_kilinti`) |
| Fish | The Great Lake (pike, whitefish), the coasts, Aenor Isle | |
| Stone | Stendorler's grey ridge; the Grano hills | The bridges of Parim (P) |
| Iron | Kunhrim (Lunhrim massif) | P; dwarf-mined, sold at Kingson |
| Gold and gems | Kunhrim; the gnome holts of Olodor | Gnomes mine gold ([BC] card 38); dwarves dig gold and gems ([BC] card 44) |
| Tungsten-bearing granite (game resource) | Giant and Gigantic Mountains | [GMS] §2 resource table; the Aenor side |
| Essence (game resource) | Scarce; the Kilinti groves and the eastern foothills where the range meets the Magical Lands' magic | P after [DEM] "Essence and Gold stay scarce" |
| Ships | Aenor Isle, Safeton, Parim's lake yards | |
| Cloth, glass, paper, bells, books | Parim, Dariap, Pazoma | Lake Aenoran crafts ([WB]) |
| Tolls | Kingson Pass, the Narrow Strait (Fotan), the Great River Gorge | |

Livelihood by people (P): Lake Aenorans farm, trade and copy; rangers hunt, cut and teach; riders breed horses and sell remounts; vale-folk farm and keep tolls; dwarves mine and smith; gnomes mine gold and keep hidden gardens; goblins mine, trap and trade stolen and salvaged goods at the edges, and sell captured chiromaws to nobody; ents keep the forest and let men take fallen wood; the Redbark hunt and dye leather; the Veiled grow roots and mushrooms in sour ground.

## 5. Institutions and political forms

**Aenor (E kingdom).** A hereditary crown of Aen's descendants ([ML], [A1]), now under the Golden King, crowned 4A 1729 (P date), who sells offices and spends the treasury on the Golden Court (E character, [GK]). Institutions older than any king keep the kingdom running: the Concord courts, the universities, and the Houses of the First Light that keep grain, hospitals and birth rolls (P, [HF], [C48]). **Hidden:** the real government is the Hidden Council of the Deliverer, who is Afrit ([AH]); nobody outside it knows. Proposed law (P, [A1] §1): the Peace of the One Crown forbids private war between lords.

**The Middle Kingdom Concord (E working table, [GP]).** Aenor leads the Concord of its chartered dominions. The working table says 26 satellites; the proposal below (section 11) reduces the number of governments while keeping **26 charter-seats** in the Concord Council: a dominion that absorbs a neighbour keeps that neighbour's charter-seat and vote (P). The Charters of Parim of 4A 3 make the dominions self-governing members of a common defence (P, [FC] I).

**The Lost Cause (E).** The Golden King's league against "the powers of the dark", founded 4A 1741 (P date); its court branch is ornament, its frontier companies, rangers and scholars are real (E direction, [LC]).

**Political forms of the Middle Lands, by realm (P):**

| Realm | Form | Succession and law |
| --- | --- | --- |
| Aenor | Crown with a council that governs | Hereditary; the Concord Council's acclaim (P, [WB]) |
| Selen | Council of woodland moots under a First Warden | Elected by the moots; the Quiet Law |
| Konori | Steppe kingdom of the Hundreds | King acclaimed on a white felt |
| Hunhun | Riders' moot under a Horse-Lord | Chosen at the summer Gathering |
| Kingson | Vale lordship holding the pass | The Pass-Lord (title "Gate-Lord" kept as the vale's word) from the watch-families |
| Klungori Guard | A sworn garrison company that holds land | The Captain elected by the sworn |
| Herez | March lordship | Marcher-Lord, confirmed by Parim |
| Noleksun | Confederacy of eight towns | Chief Speaker elected by households |
| Safeton | Harbour republic | A council of ship-houses |
| Freshon, Pazoma | Chartered towns that bought Golden Charters | Merchant councils |
| Orohaf | Island queenship | A queen chosen from the great houses; inheritance through daughters |
| Fotan | Free lordship outside the Concord | Hereditary lords with a strait toll |
| Kilinti | Ent moot with a council of edge-villages | "The Eldest speaks last"; the men keep the accounts |
| Kunhrim | Council of delving-clans | Clan elders; outsiders deal with the Hold-Speaker (P) |
| Olodor | Hidden village-kings | Each village has one king, who crowns the rich ([BC] card 38) |
| Glimik | Warren-kingdom under a hobgoblin king | The biggest hobgoblin rules; warren-bosses below |
| Cursed Lands | Council of cord-mothers | Through the mother's line |
| Bloody Forest | Clans of cord-mothers; war-chiefs per raid | Through the mother's line |
| Dunelaeth | An elven household of a few hundred houses | Its Elder, chosen by the houses |

**Wizards and magic.** Licensed wardens work under the Houses of the First Light (P, [WB] Lake Aenorans). **Bastian** is a living human wizard of the Fourth Age, famous in the Middle Lands (owner decision, [OD]). Proposed: he keeps no tower of the Houses and holds no royal licence, travels the Vale and the lake towns, and is consulted by the Selen moots and the Lost Cause's scholars; the court thinks him a showman, the countryside a healer (P). His discipline, limits and allegiances beyond this are not invented here.

## 6. Beliefs and faiths

| Faith | Held by | What believers hold | Truth versus belief |
| --- | --- | --- | --- |
| The Faith of the Deliverer | Lake Aenorans, the court, most towns | The Deliverer, a New God of deliverance, protection and renewal, saved Aoaz when the Great Necromancer fell; a tenth of the first harvest goes to the Houses of the First Light (P doctrine, [WB] §4) | Public worship is E ([AF]). **Hidden:** the Deliverer is Afrit, son of Ein ([AF], [4R]); his true rank is open (O, [CP]). |
| The Lamp and the Furrow | Every Aenoran household | The New Gods honoured at the hearth in two folk images, a lamp that never goes out and rain over ploughed fields (P, [WB] §4) | The twelve main New Gods answer the twelve needs of mortals and name the twelve months; lesser New Gods also exist (owner decision, [OD]); their names are undecided and are not invented here. Glernaen, god of power and wisdom, is the mightiest (E, [OC] §2.3, [GL]). The Deliverer's cult keeps a feast, the Day of Deliverance, not a month ([OD]). |
| The Green Lords | Selen rangers | Every old wood has a Lord of the Green, a spirit asked before an arrow is loosed (P) | Wild Spirits are a proposed nature in the vault ([SN]); mortals may mistake spirits for gods (E, [RK]). |
| The Horse-Oath | Konori and Hunhun riders | An oath sworn on a horse is carried to the sky (P) | |
| The Pass Vigil (P rename of `stone_vigil`, "the Stone Vigil") | Kingson, Klungori Guard | The pass is a promise to those who held it against Elzon's garrisons; a watch-family is born to its post (P) | The "Names Wall" and "Accord-Day of the Wall Accord" of the old card are replaced by the Reading of Names at the pass forts and Accord-Day of the Accord of the Passes. |
| The Tide-Houses | Aenor Isle | The dead go out with the tide and return with it (P) | |
| The Old Knots | The Veiled, the Redbark | Names are knots in the mother's cord; a stolen name is a cut knot (P) | Orran custom older than Aenor (P). |
| The Slow Rite | Ents | No rites a man can see; the Ent-Moot every seventh spring (P) | |
| Dwarf and gnome faiths | Kunhrim, Olodor | Unwritten; P only that gnomes believe gold freely given brings luck ([BC] card 38) | Left open until the owner speaks on dwarves. |
| The Warren Luck | Glimik | A warren lives while its lamp burns ([WB] §4, P) | |

**Holy sites (P).** The House of the First Light at Parim; the Moot Tree of Selen; the Moot-Grove of Kilinti; the horse-barrows of the Hunhun Downs; the tide-chambers of Orohaf; the knot-trees of the Bloody Forest; the cord-halls of the Cursed Lands; the Lamp-Hole of Glimik's throne-cave. **Dardan** is a place of memory, but its location is open; no site is named for it (O, [A1] §10; [GM] `unplaced`).

**Rumours and beliefs about the wider world (belief only).** Lake sailors say that ships from the far west sometimes reach the Crown Sea's outer isles, and that their crews speak of a land called Haven; nobody in Parim has met one (belief, [OC] §3). Priests of the Deliverer teach that the souls of the good go south over the sea to the gods' dwelling, which some call Lao; others deny it (belief, [OC] §3).

## 7. History

Ages: First Age 1,675 years (E), Second 2,133 (E), Third at least 1,200 with 1,260 proposed, Fourth more than 1,000 with 1,760 proposed and the campaign starting in 4A 1748 ([CP], [FC]).

| Date | Event | Label |
| --- | --- | --- |
| Before 1A | Men have lived in many kingdoms for thousands of years; the earliest are stronger, longer-lived and more magical. | E [A1] §1, [AI] |
| Before 1A | Ents hold Kilinti; giants hold the western hills; dragons nest on Dragon Mountain. | E that these peoples exist ([PA]); P that they predate Aen here |
| Before 1A | The Orran-speaking kingdoms of the Middle Lands rule the river valleys; their names survive under Aenoran towns. | P [WB] §1 |
| Before 1A | The War of Men, hundreds of years long, kills many thousands; Aen unites the kingdoms of men. | E [A1] §1 |
| About 1,500 to 900 BA | The Low Country (Muzerar) is at its height: Orran-speaking men keep three harvests a year on the low fields from the Aenor Isle shore to the Konorar valley, behind the hill giants' sea-dikes, and the Moot of Mothers at Ozelkak governs without a king or a crown. Its law is kept on knotted cords, and the long peace between the clans is later called the Peace of the Cords. | Established (owner, 25 October 2026; decision K64) |
| About 900 to 621 BA | The Long Settling: the cord-mothers draw on the magic of the land for the third harvest and for the Moot's long rule, the ground settles below the sea, and every field the sea takes is tied as a black knot on the Moot's cord. The giants' cairn-keepers warn the Moot, the mothers divide, and the party that would draw harder wins. | Established (owner, 25 October 2026; decision K64) |
| About 620 BA | The Night of the Sea: a storm-tide breaks the last dikes in one winter, and the sea takes Ozelkak and the low fields in a single night. The Mothers' Mound, the top of Ozelkak's greatest mound, breaks the water as a reef west of Aenor Isle at the lowest spring tides. The Eldest Cairn in Hirolon receives its first stone, and its keepers add one stone in every year since the sea came. | Established (owner, 25 October 2026; decision K64) |
| About 620 to 1 BA | The Orran successor houses of the river valleys fight over a shrinking land until the War of Men, which Aen ends by making one crown over the kingdoms: the thing the Low Country never had. | Established (owner, 25 October 2026; decision K64) |
| 1A 1 | Aen's victory founds Aenor in the Middle Lands. | E [A1], [TL] |
| 1A 1 | The Peace of the One Crown forbids private war; the beaten Orran houses withdraw into the Bloody Forest and the land later called the Cursed Lands. | P [A1] §1, [WB] |
| 1A 1, the Withdrawal | The Orran houses that will not kneel lay the Last Cord in the eldest barrow of the Cursed Lands, and the cord-mothers keep the yearly count on knotted cords; the Redbark keep the river names that the Vale took from them. | Established (owner, 25 October 2026; decision K64) |
| After 1A 1 | The Isle Houses of Orohaf, rock-cut moot-halls on the last eastern hill of Aenor Isle that flood at high water, keep the Low Country's last law: their eldest women choose the queen at the turn of the tide in the tide-chambers, and the dead are given to the tide. | Established (owner, 25 October 2026; decision K64) |
| 1A about 1 to 800 | Centuries of peace; the Roads of Aen; lake ports; exploration and colonies in the West Lands, wars with the West's own peoples. | E broad [A1] §2; P dates |
| About 2,000 BA onward | The dwarves cut the Stone Road under the dry low country, joining the western ranges, the Great Wall range and the High Mountains of the North Lands under the seas, with Kunhrim's delvers at its western gate. | Established (owner, 25 October 2026; decision K64) |
| 1A about 300 | The dwarves of Kunhrim open their western galleries to Aenoran trade; the Lunhrim Notch becomes a carriers' path. | P |
| 1A about 800 to 1150 | Bad kings, succession wars and revolts weaken Aenor. | E broad [A1] §3; P dates |
| 1A about 1150 to 1500 | Volgan invades Mirolon and conquers outward. | E [A1] §4, [DL]; P dates |
| About 1A 1500 to 1675 | The Kalioth Crown, Volgan's ally, holds Herez, Noleksun and the South Pass for about a century, and its stone forts stand on the downs of Herez. The ditches of the Bridge Kingdom's western march still lie under Noleksun's fields, which keep drinking from them. | Established (owner, 25 October 2026; decision K64) |
| 1A about 1500 to 1650 | The reigning king dies and Volgan's armies take the capital; its First Age name and its relation to Parim are open. | E [A1] §4; O name |
| Late 1A | Edran is crowned outside the occupied capital and gathers the Grand Alliance of men, elves, dwarves, giants, spirits and island peoples. | E [A1] §5, [ED]; P coronation detail |
| Late 1A | In Volgan's war the Damned Spirits rise from the deep, and the Deep King lets the sea into the Stone Road, so that Tromahrim drowns under the Sea of Monsters with the spirits inside it. Each of the four holds keeps a sealed Sea-Door. Who gave the order is disputed between Kunhrim and the western holds. | Established (owner, 25 October 2026; decision K64); the order's author Open |
| By 1A 1675 | The Battle of Dardan kills millions; Volgan is stripped and banished to the Void; Edran's invasion of the Ember Lands fails against Elzon. Dardan's place is open. | E [A1] §6–7; O place |
| By 1A 1675 | At Dardan the Kalioth host stands with Volgan's and dies there. | Established (owner, 25 October 2026; decision K64) |
| 2A, early | Edran rebuilds Aenor and dies of disease. | E [2R] |
| 2A | The Registers of the Lost record the dead by name; later necromancers use them. | P [A2] §II |
| 2A | Famines and plagues (the Grey Breath, the Grave Fever) return for generations; farming, medicine and fortification advance. | E broad [2R]; P plague names |
| 2A | Demons raid Aenor through portals from the Nether. | E [2R] |
| 2A | Refugees from the Vale settle in the Selen Weald, the Hunhun Downs and Aenor Isle. | P [WB] §1 |
| 2A, last centuries | Elzon's "war from within" divides men, elves and dwarves; orc and goblin armies pass through regions thought secure, some rising from deep underground. | E [2R] "Second conquest"; P "Opening of the Passes" |
| 2A 2133 | Elzon takes Aenor and founds his order; the elves send no armies. | E [EO], [ER] |
| 3A 1 to 180 | Elzon's living governors and undead hosts secure the Vale; revolts hold out in forest and mountain strongholds (Selen, the Kunhrim galleries). | P [A3] |
| 3A, early | Elzon garrisons the southern range caves with goblin warbands to watch the unconquered elves and the South Pass; they are paid in plunder and never leave. | P (origin of Glimik) |
| 3A | Elzon's Order fortifies the Kingson Pass against the elves of the Magical Lands, which it never conquers. | E unconquered [EO]; P forts (replaces the "Pale March" wall) |
| 3A 691 to 910 | The Black Roots: Elzon tries to turn Aenor's magic to sustain the dead; the land of the Veiled sours and stays sour. | P [BR] |
| 3A 1111 to 1235 | Varner and Golbran spread counterspells; the Lantern Chain shelters villages. | E Varner resists [VA]; P names and dates |
| 3A 1236 to 1259 | The War of Unbinding: human armies cut the anchors around the capital. | P [WU] |
| 3A 1260 | The Last Tithe: Elzon dies permanently; the Deliverer protects the people in the collapse and is acclaimed a New God. | E outcome [A3], [EO]; P date and name; hidden: the Deliverer is Afrit |
| 4A 1 | Harion of Selen, a good king of a collateral line of Aen, is crowned at Parim. | E good king [A3]; P name, place |
| 4A 3 | The Charters of Parim bind the surviving dominions to the crown. | P [FC] I |
| 4A 4 to 60 | Varner's Unbinding makes the old grave-fields farmable again (the Quiet Fields). | P [FC] I, [WB] §7 |
| 4A 11 | The Houses of the First Light receive royal charters. | P [FC] I |
| 4A 40 to 120 | Roads, canals and the Great Lake ports are rebuilt. | P [FC] I |
| 4A 96 | The Accord of the Passes: men keep the western forts of the Kingson and South Passes, elves the eastern; tolls at Kingson. The goblins of the southern caves are left in place under the "Lamp Truce" because no army can dig them out. | P; replaces the vault's proposed Wall Accord ([OC] §2.2, §6 item 3) |
| 4A 212 | The first Concord Council at Parim. | P [FC] II |
| 4A 340 | The universities of Parim and Selen are founded. | P [FC] II |
| 4A 512 | The Treaty of the Narrow Strait with the North Lands. | P name of the E "old alliance" [FC] II |
| 4A 1000 | The Thousand-Year Jubilee at Parim. | P [FC] II |
| about 4A 1100 | The Hidden Council takes its lasting form. | P [FC] III; hidden |
| 4A 1420 | The Roll Quarrel: the Selen moots refuse to let the Houses keep their birth rolls; the Houses give way in Selen and gain them everywhere else. | P |
| 4A 1716 | Leren envoys are humiliated in Parim over a disputed toll; Fotan's strait toll is the pretext. | P [FC] III; Fotan's part P |
| 4A 1729 | The Golden King is crowned and sells offices within the year. | E figure [GK]; P date |
| 4A 1733 | The Golden Court is completed in Parim. | P [FC] IV |
| 4A 1736 | A Mirolonese envoy's warning is laughed out of Parim. | P [FC] IV |
| 4A 1741 | The Lost Cause is founded. | E founding [LC]; P date |
| 4A 1746 | The Hidden Council decides the King must die. | P [FC] IV; hidden |
| **4A 1748** | **Start: peace.** | owner, [C48] |
| 4A 1750 | The Golden King dies; the temples proclaim the Deliverer King of Aenor. | E [GK], [AF]; P date; hidden that it is murder |
| 4A 1754 | A stranger warns Aenor and is denounced; Alleria of Selen protects him. | E warning [4R]; P date; hidden identity (Eindil) |
| 4A 1755 to 1757 | The War of the Last Crowns: the West takes the capital; the East attacks the Magical Lands; Volgan marches from the south; Zol's dead come from the north. Zol does not appear in person; his most loyal servant does: Kusven. | E war [WLC]; owner decisions [OC] §2.4, [OD]; P dates |
| 4A 1758 to 1759 | The false king returns from the East, retakes the capital and dies in the palace battle. | E [WLC], [4R]; P dates; place of the palace P (Parim) |
| 4A 1760 | Eindil is crowned King of Aenor; the Fourth Age ends. | E coronation; P date |

**Trade routes (P).** The Roads of Aen radiate from the lake; the Great River Gorge and the Kingson Pass carry the range trade; the Narrow Strait carries northern timber and fish; the Crown Sea crossing carries western wool and horses to Aenor Isle; the Ocean of Peace carries pilgrims south ([WB] §7).

**Local legends (P).** The Stone Forest: the trees "that heard Aen's last horn and stood still" north of the lake; the bargemen say they creak in fog. The Kunhrim dwarves say Lunhrim was named "Kunhrim" before men had words, and men only lost a letter. The goblins of Glimik tell that Elzon promised them the whole range and that a promise outlives the promiser. Selen's rangers say no bow is drawn in the Hallow Month because the woods once hid a king.

**Where history can diverge (L3).** The Golden King survives or dies early; the four succession camps (Golden Court, Free Dominions, Afrit's supporters, Eindil's popular host) are E as camps and open as victors ([KF]). The Concord can fracture into Free Dominions or hold. The goblins of Glimik can sell the under-roads to Volgan, to the West, or to Aenor. Kunhrim can close its iron to a false king. The Kingdom Forest elves can guide or refuse an army over the Lunhrim Notch.

## 8. Neighbours and relations

| Neighbour | Relation at 4A 1748 | Why |
| --- | --- | --- |
| The Magical Lands elves | Courteous estrangement; the Accord of the Passes; tolls quarrel at Kingson | The Elven Refusal after Edran's folly (E, [ER]); tolls (P) |
| The North Lands (Lerendor) | Treaty and grudge | Treaty of the Narrow Strait (P name of the E old alliance); the toll quarrel of 4A 1716 (P) |
| The West Lands | Old grievance, present trade | First Age settlement wars (E [ML]); tariffs (P) |
| The Dark Lands | Watched across the Grey Water | Orc holds; Goldoroth's ambition (E working table [GP]) |
| The Ember Lands (Mirolon, Volgan) | Mirolon is a friend Parim laughs at; Volgan a legend | E rivalry [GP]; P envoy |
| Zol's Mistake | Unknown; fishermen's rumours | E [C48] |
| Hirolon | A sovereign kingdom that treats with Aenor; friendship | Owner decision ([OD]); [hirolon.md](hirolon.md) |
| Inside: Kunhrim and the elves | Cold | Dwarves dislike elves ([BC] card 44) |
| Inside: Glimik and everyone | Armed truce | The Lamp Truce of 4A 96 (P) |
| Inside: Selen, Kilinti, Hirolon | Friendship | Woodland and hill neighbours (P [WB] §7) |
| Inside: Bloody Forest and Selen | Raids at the edge | P [WB] |

## 9. Wildlife and creatures

| Creature | Habitat | Rarity | Effect on travel, farming, war | Source |
| --- | --- | --- | --- | --- |
| Corallus | The Great Lake, the Saeton reeds, the Great River | Common in the reeds, rare in open water | Fords and reed-cutting are dangerous; lake towns pay corallus-wardens; barges keep to the channels | [BC] card 65 |
| Tzikor (former card name Vinocorne) | Aenor Forest | Uncommon, hard to see | A moving flowering plant 2 to 6 metres tall with thorns as its main weapon, poison shot from its blossoms and blood that rots skin; woodcutters avoid flowering clearings | [BC] card 3 |
| Baelim (former card name Coniferons) | Aenor Forest | A people, few | Tree-people 10 to 30 metres tall, slow and strong; their low, angry voices are heard in the wood; the forest is not cut | [BC] card 40; [OD] |
| Chiromaw | Caves of the range and of the Hiloff Rim; the gnome hills | Common underground | Raids on galleries and holts at night; dries up in sun | [BC] card 53 |
| Wurgh (former card name warg) | With the goblins of Glimik; the Forests of Darkhere | Uncommon on the surface | Goblin riders on the southern roads; herders lose stock | [BC] card 15 |
| Dragons | Over the range from Dragon Mountain | Rare | Take herds in the Kingson Vale and the eastern downs; never under any man's command | E [PA]; P effects |
| Hunhun horses | Hunhun and Konori Downs | Domestic | The Concord's cavalry | P |
| Lake pike and whitefish | Great Lake | Common | The lake towns' food | P [WB] |
| Red deer, boar, wolves | Selen Weald, Bloody Forest | Common | Hunting economy of the rangers and the Redbark | P |
| Sea serpents | Sea of Monsters | Rare | Ships keep to the coast; scales no ordinary sword pierces | [BC] card 12 (its seas are unplaced) |

## 10. Settlements

| Place | Realm | Kind | Why it stands there | Status |
| --- | --- | --- | --- | --- |
| Parim | Aenor | Crown city, 380,000 | Lake bluff at the Aenar's mouth: river barges meet lake ships; a cliff to defend; the Selen resistance held the port in the War of Unbinding and Harion chose it over the ruined old seat (P). Whether Parim is also the First and Second Age capital is open. | E seat [ML]; P reasons |
| Dolepar | Aenor | Lake port and shipyard, 62,000 | Best deep-water bay on the south lobe | P [DEM] |
| Silesire | Aenor | Grain port, 55,000 | Where the Great River enters the east lobe | P [DEM] |
| Kerepael | Aenor | Road fortress, 34,000 | Where the east road leaves the plain for the gorge | P [DEM] |
| Hifeco | Selen | Seat and University town, 38,000 | Where the first road leaves the Weald on the Selenar | P [DEM] |
| Arrovez | Konori | Steppe seat, 22,000 | The river ford at the steppe edge | P [DEM] |
| Ulrono | Hunhun | Gathering ground, 14,000 | The permanent summer gathering on the open downs; mostly tents | P [DEM] |
| Deolofson | Kingson | Pass town, 26,000 | At the vale's centre where the Great River and the pass road meet | P [DEM] (working name) |
| Kerdun ("iron fort", Aenoran) | Kunhrim | The dwarves' outer hall and market, about 6,000 | At the foot of the Lunhrim galleries above the vale, where carts can reach | P |
| Glimzig ("lamp hall", Goblin Cant) | Glimik | The hobgoblin king's throne-cave in the caves of Burrikkrit, about 9,000 | Deep under the Cursed Mountains, warm and dry, far from any road | P; Burrikkrit replaces the card's "Ellenmoor" ([BC] card 29) |
| Olodor holts | Olodor | Hidden villages of a few hundred each | Inside the Deodolor Hills and under old trees of the Stone Forest | P |
| Thamiel ("the hill", Sylvan) | Dunelaeth | Elven household, about 2,000 | A hill in the Kingdom Forests above the pass road | P |
| Ollolor | Kilinti | Moot-grove; no walls | The oldest grove | P [DEM] |
| Hungohon | Klungori Guard | Garrison town, 9,000 | The western foot of the South Pass | P [DEM] |
| Hugomon | Herez | March fort, 12,000 | Where the south road enters the marches | P [DEM] |
| Saelori | Noleksun | Moot town, 18,000 | The crossing of the south-eastern roads | P [DEM] |
| Lotrenri | Safeton | Haven, 30,000 | The Safen mouth: lake and sea meet | P [DEM]; the model's port is `site_safeton` |
| Hordorton | Freshon | Spring market, 40,000 | A spring where the lake road meets the south road | P [DEM] |
| Horlomon | Pazoma | Lake town, 45,000 | A deep lake bay | P [DEM] |
| Borrak | Orohaf | Harbour of the isle, 28,000 | The best natural harbour, facing the open sea | P [DEM] |
| Morluma | Cursed Lands | Hidden cord-hall, 3,000 | Deep in the sour ground; no road reaches it | P [DEM] |
| Giritren | Bloody Forest | Tree-halls, 6,000 | The oldest stand of red oak | P [DEM] |
| Fotan's seat (name from the roster, Deoreh) | Fotan | Strait town | The narrowest crossing of the Leren Ocean on the Middle Lands side | P |

The great-lake ports required by the model (`site_great_lake_port_1` to `_4`) are Dolepar (south), Silesire (east), Parim (north) and a west-shore port under the Grano hills (P name **Grafas**, Aenoran "grey ford").

## 11. Roster proposal (proposed)

**Before:** 30 countries in the Middle Lands and Aenor Isle ([ROS] scans "Rush Land" and "Rush Islands"), 0 elven. **After:** 23 countries in the whole region, of which 21 are in this dossier and 2 (Hirolon, Tirlan) in [hirolon.md](hirolon.md); 1 elven (Dunelaeth, which comes from the Magical Lands row "Kingdom").

| Name (local language) | People and culture | Political form | Capital | Approximate extent | Why it exists |
| --- | --- | --- | --- | --- | --- |
| **Aenor** | Men, Lake Aenorans | Crown with a council (hidden: governed by the Deliverer's council) | Parim | The Vale, the lake's north and east shores, Stendorler's ridge, the old Tieri, Dariap and Mondon lands; about 22 states | Aen's kingdom; the core. E |
| **Selen** | Men, Selen Rangers | Council of woodland moots | Hifeco | The Weald and the Ulgus Glades; about 9 states | Ranger country; absorbs Vothrim, Svenlor and Ulgus, keeping their charter-seats |
| **Konori** | Men, Steppe Riders | Steppe kingdom | Arrovez | Konori Downs; 5 states | E dominion |
| **Hunhun** | Men, Steppe Riders | Riders' moot | Ulrono | Hunhun Downs and the old Noloreh steppe-march; 5 states | E riders; absorbs Noloreh |
| **Kingson** | Men, vale-folk of Kingson | Pass lordship | Deolofson | The ringed vale and the gorge; 3 states | E name; holds the only wheel road through the range; absorbs Olvinc-un |
| **Klungori Guard** | Men, vale-folk and march-folk | Sworn garrison company | Hungohon | The western foot of the South Pass; 2 states | Drawn name; watches Glimik and the South Pass |
| **Herez** | Men, March-Folk | March lordship | Hugomon | The Grey Hills and the southern marches; 6 states | E dominion; absorbs Belurithon |
| **Noleksun** | Men, March-Folk | Eight-town confederacy | Saelori | South-eastern frontier; 8 states | Unchanged |
| **Kilinti** | Ents, with men at the edges | Ent moot | Ollolor | The Kilinti Forests; 4 states | E |
| **Safeton** | Men, Lake Aenorans | Harbour republic | Lotrenri | South coast, Safen mouth, Novez Fields; 3 states | Absorbs Novez |
| **Freshon** | Men, Lake Aenorans | Chartered spring-town (Golden Charter) | Hordorton | 4 states | Kept for the Golden Charter mechanic ([ACS] §3) |
| **Pazoma** | Men, Lake Aenorans | Chartered lake guild-city (Golden Charter) | Horlomon | 4 states | Kept for the Golden Charter mechanic |
| **Orohaf** (former label Asgard) | Men, Isle Houses | Island queenship | Borrak | Aenor Isle; 2 states | E Asgard on Aenor Isle ([AR]); renamed because the label is from Norse myth ([OD]) |
| **Fotan** | Men, Leren-Aenoran strait folk | Free lordship outside the Concord | Deoreh | The Narrow Strait shore; 1 to 2 states | Drawn; given a reason: it refused the Charters to keep its strait toll and leans to Lerendor |
| **Kunhrim** | Dwarves, delving-clans | Council of clans; a chartered member of the Concord (the Iron Charter: iron for the crown, no elf on its roads) | Kerdun | Lunhrim massif and northern Gigantic Mountains; 2 states | R-21 dwarves; card "Gigantic Mountain"; replaces the riders "Kunhrim" (Y4V); Q-19 |
| **Glimik** | Goblins and hobgoblins | Warren-kingdom under a hobgoblin king | Glimzig | Cursed and Giant Mountains, the Forests of Darkhere's edge; 2 states | R-25 goblin kingdom in the mountains; cards 29 and 36 |
| **Olodor** | Gnomes | Hidden village-kings; an enclave | the holt of the eldest village-king | Deodolor Hills; 1 state | Card 38; Q-23 |
| **Dunelaeth** | Elves, the Kingdom Forest company | Elven household | Thamiel | Kingdom Forests; 1 state | Reconciles the forest's place with the roster's elven "Kingdom"; R-24 scattered elves |
| **Aenor Forest** | Baelim (former card name Coniferons) | Forest domain without a crown: a slow moot in which the Eldest speaks for the stand | Baeldran (Aenoran "old tree"), the oldest stand | The north-coast forest between Selen, Konori and the Bloody Forest; 3 states | Owner decision: the largest forest of the Middle Lands, home of the Baelim ([OD]) |
| **Cursed Lands** | Men, the Veiled | Council of cord-mothers | Morluma | 1 state | E, resists Aenor |
| **Bloody Forest** | Men, Redbark Tribes | Clan moot | Giritren | 3 states | E, resists Aenor |
| *(Hirolon and Tirlan: see [hirolon.md](hirolon.md))* | | | | | |

**Wild lands, not countries (P):** the high snows of Lunhrim and the Organ Mountains (held on the map by Kunhrim and Aenor), the Forests of Darkhere (goblin and wurgh country, held by Glimik).

**Comparison with the current roster ([ROS], 19 October):**

| Current row | Tag | Change | Reason |
| --- | --- | --- | --- |
| Aenor | Y0L | Kept; grows | Absorbs Tieri, Dariap, Mondon, Stendorler, whose interchangeable lake-town rows add nothing |
| Selen | Y0M | Kept; grows | Absorbs Vothrim, Svenlor, Ulgus |
| Konori | Y0N | Kept | |
| Kilinti | Y0O | Kept; people revised | Ents few, men many |
| Kingson | Y0P | Kept; grows | Absorbs Olvinc-un |
| Hiloron | Y0Q | Renamed Hirolon (former label Hiloron); sovereign, outside the Concord | Owner decision ([OD]); see [hirolon.md](hirolon.md) |
| Safeton | Y0R | Kept; grows | Absorbs Novez |
| Noleksun | Y0S | Kept | |
| Fotan | Y4M | Kept; people changed to strait folk | Given a reason to be free |
| Ulgus | Y4N | Merged into Selen | Its glades are on Selen's coast ([GM]) |
| Vothrim | Y4O | Merged into Selen | Interchangeable ranger row |
| Stendorler | Y4P | Merged into Aenor; gnomes under its ridge | Card "Steadtler" |
| Olvinc-un | Y4Q | Merged into Kingson | |
| Svenlor | Y4R | Merged into Selen | |
| Tieri | Y4S | Merged into Aenor | |
| Hilofrim | Y4T | Merged into Hirolon | See [hirolon.md](hirolon.md) |
| Klungori Guard | Y4U | Kept; reason changed | Watches Glimik, not a masonry wall |
| Kunhrim | Y4V | People changed to dwarves | Riders cannot live on a high-peak massif |
| Hunhun | Y4W | Kept; grows | Absorbs Noloreh |
| Dariap | Y4X | Merged into Aenor | |
| Novez | Y4Y | Merged into Safeton | |
| Noloreh | Y4Z | Merged into Hunhun | |
| Mondon | Y50 | Merged into Aenor | |
| Freshon | Y51 | Kept | |
| Belurithon | Y52 | Merged into Herez | |
| Pazoma | Y53 | Kept | |
| Cursed Lands | Y54 | Kept | |
| Herez | Y55 | Kept; grows | |
| Bloody Forest | Y8E | Kept | |
| Asgard | Y0T | Kept; renamed Orohaf | Norse myth ([OD]) |
| Kingdom (Magical Lands sheet) | Y80 | Moved here as Dunelaeth, reduced from 7 states to 1 | Its forest is on the Middle Lands side |
| *(new)* | | Glimik, Olodor, Aenor Forest (Baelim) | R-25; owner decision on the Aenor Forest |

**Counts.** Middle Lands and Aenor Isle: 30 before, 23 after (21 here plus Hirolon and Tirlan). Elven realms in this dossier: 0 before, 1 after (Dunelaeth, moved from the Magical Lands' 21). Concord charter-seats: 26 kept (P), held by 13 dominions (Selen, Konori, Hunhun, Kingson, Klungori Guard, Herez, Noleksun, Kilinti, Safeton, Freshon, Pazoma, Asgard, Kunhrim) ; outside the Concord stand sovereign Hirolon and its protectorate Tirlan, Fotan, Glimik, Olodor, Dunelaeth, the Aenor Forest, the Cursed Lands and the Bloody Forest.

## 12. Gameplay role

**Mechanics (existing specs, with the changes this dossier needs).**

- *Aenor court and succession* ([ACS]): the Golden Court corruption, temple favour (hidden), the Concord loyalty bands, the charters, the Lost Cause, the death clock and the four-camp succession stay. The dominion table must change to the merged roster; each absorbing dominion carries the extra charter-seats as a Council weight (P). The Wall Charter becomes the **Pass Charter** for the dominion that owns a pass state (Kingson at start; Klungori Guard).
- *Elves, the range and dragons* ([EWD]): "the Wall Accord" becomes the Accord of the Passes; the Wall grievance becomes the **pass-tolls grievance** at Kingson; "gates in wartime" become the forts of the Kingson and South Passes; "Dragons over the Wall" stay as dragons over the range.
- *Map:* the range is impassable terrain except the Kingson Pass and the South Pass (wheel roads, forts on both sides), the Lunhrim Notch and the Organ shelf (infantry only, heavy attrition, closed in winter), and the goblin under-roads (a hidden adjacency between Glimik's states and the Zilin side, usable only by Glimik and its allies or after a decision buys the guides) (P).

**Focus-tree themes (existing trees, [FT]):** `aenor` (140 focuses), `regional_selen`, `regional_kingson`, `regional_kilinti`, `regional_konori`, `regional_hunhun`, `regional_herez`, `regional_noleksun`, `regional_asgard` (renamed for Orohaf), `regional_cursed_lands`, `regional_bloody_forest`, `shared_concord_dominions`. Changes (P): the Kingson tree's "Wall-gate" focuses become pass, toll and gorge focuses; the shared dominion tree loses the merged rows; new small trees for **Kunhrim** (iron for whom: the crown, the West, or nobody; the old grudge against elves; the Lunhrim Notch), **Glimik** (the Lamp Truce, the under-roads as a secret to sell, the hobgoblin succession, warg cavalry, gold-hunger), **Olodor** (hidden, luck for gold, a chance to be found), **Dunelaeth** (the lost kin: return east, stay as guides, or join the Kindred).

**Events (P).** "A Gnome in the Bridge" (a Parim mason finds a gnome door under Stendorler); "The Lamp Truce Questioned" (a new Pass-Lord wants Glimik's caves cleared); "Iron Withheld" (Kunhrim refuses to sell to the false king); "Coralluses in the Reeds" (a harvest disrupted); "The Baelim Speak" (rangers hear voices in the Aenor Forest); "The Lost Kin" (Herrodon sends envoys to Dunelaeth); "Under the Giant Mountains" (an army offers gold for the goblin under-roads).

**Decisions (P).** Buy the under-roads (Glimik); Bring gold to Olodor (luck: small stability and research bonus for a year, never for a ruler who seized gold); Hire Kunhrim carriers (supply bonus over the Lunhrim Notch); Open the Notch to elven envoys.

**AI behaviour (P).** Glimik never declares war first, sells the under-roads to the highest bidder in a war, and joins whoever controls Kingson if threatened; Kunhrim refuses alliances with elven realms and sides with whoever holds Parim lawfully; Olodor never acts unless found; Dunelaeth follows the Kindred if it forms.

**Divergences (L3).** A surviving Golden King, a Free Dominions Concord, a goblin-guided invasion through the range, a dwarf embargo that starves a usurper of iron, a Kingson that closes the pass to everyone.

## 13. Questions for the owner

1. **The Great Wall's material in the sources.** The geography model (`range_great_wall`, `zone_great_wall`, `changesFromToday`), the model spec ([GMS] §4 and §13 item 2), the vault's 4A 96 Wall Accord ([FC] I), the culture data (`wall_folk`, `stone_vigil`), the elves spec ([EWD] §5) and the Kingson tree still describe a man-made wall and gates. This dossier proposes the **Accord of the Passes** (4A 96) instead: do you accept it, and may "the Gate" stay as the Kingson Vale's own word for the Kingson Pass?
2. **Goblins inside the dwarves' range (R-25, Q-21).** The dwarves hold the Great Wall range by your decision; may the hobgoblin king's realm of Glimik remain an enclave inside it, in the Cursed Mountains and under the Giant Mountains' southern end, as Elzon's left-behind garrisons?
3. **Gnomes (Q-23).** Is the gnome card's "Olodor" the drawn Deodolor Hills and its "Steadtler" the drawn Stendorler?
4. **The Great River and the Kingson River.** Is the corallus card's "Kingson River" the drawn Great River of the Kingson Vale, and where is its "Dorap Swamp" ([BC] card 65)?
5. **The 26 charters.** Hirolon is sovereign, so the working table's 26 Aenoran satellites ([GP]) cannot all be separate realms on a varied map. May the Concord keep 26 charter-seats held by 13 dominions, or must 26 separate dominions exist?
6. **The capital's history.** Is Parim also the First and Second Age capital, or a Fourth Age choice? (The vault leaves it open: [ML], [A2] §X.)
7. **Daldar.** The drawn Rush Land sheet names a region "Daldar" inside Aenor ([LBL]). Is it related to Dardan, whose place is open?
8. **Ulgus.** The model puts the Ulgus Glades on Selen's north coast; the world bible puts Ulgus's orchards on the lake's east shore. Which is right?
9. **The Aenor Forest's size.** The model's `forest_crown` is a small north-coast wood; making it the largest forest of the Middle Lands takes land from Selen, Konori and the Bloody Forest. Is the extent proposed in section 2.5a right?

Map and data defects found (no decision needed, recorded for the map work): Rish and the Tinta Hills of Aenor Isle lie on the mainland in the model (section 2.8); several drawn labels have no place yet ("Hornan's Kos", "Arcedor", "Leimon", "Infous", "Huno", "Eronola", "Dewon Wood", [LBL] Rush Land) and are proposed as state and settlement names inside Aenor.

### Renamed labels and names (owner decisions of 24 October 2026 applied directly; former label kept)

| Former label | Origin or reason | New name | Language and meaning |
| --- | --- | --- | --- |
| Asgard (Aenor Isle) | Norse myth | **Orohaf** | Aenoran *oro* "island" + *haf* "harbour" |
| Rush Forest (cards 3, 40), model "Crown Forest" | "Rush" is Aenor's old name | **Aenor Forest** | owner's own name |
| Coniferon (card 40) | borrowed creature name | **Baelim** (one **Baelen**) | Aenoran *bael* "tree" + *-im* "the people of" (*-en* "dweller") |
| Vinocorne (card 3) | borrowed creature name | **tzikor** | Orran *tzikor* "thorn", from the Redbark, borrowed into Selen speech |
| Lotloren Sea | echoes Tolkien's Lothlórien | **Nimmael** | Aenoran *nim* "low" + *mael* "sea" |
| Ellenmoor (card 29) | echoes Tolkien's Ettenmoors | **Burrikkrit** (the caves), **Glimzig** (the throne-cave) | Goblin Cant *burrik* "tunnel" + *krit* "mountain"; *glim* "lamp" + *zig* "hall" |
| warg (card 15) | Tolkien | **wurgh** | Orcish *wurgh* "wolf" ([LANG]) |
| Leprechaun (card 38) | Irish folklore | **gold-crowned** | Common Speech description |
| Gelbin Mekkatorque (card 38) | Warcraft | dropped; the famous gnome stays unnamed | |
| Steadtler (card 38) | resembles the Staedtler brand | read as the drawn **Stendorler** | Aenoran chart form |
| Kingdom (Y80), "Kingdom Forests" | an English word as a realm name | **Dunelaeth** | Sylvan "the king's wood" |
| Sea of Death (strait to the Dark Lands) | contradicts the Ember Lands' Sea of Deaths and The Dead's Sea | **Gaelmael**, "the Grey Water" | Aenoran *gael* "grey" + *mael* "sea" (to be agreed with the Dark Lands dossier) |
| Wall-Folk, Stone Vigil (culture and faith ids) | there is no wall | **Vale-Folk of Kingson**, **the Pass Vigil** | Common Speech |
| Blue Mountain, Grey Mountain, Iron Hills (dwarf card 44) | Tolkien | not used in the Middle Lands; the West and North Lands dossiers name their ranges | |

## 14. Sources

Keys used above (vault paths are under `docs/lore/vault/`):

| Key | File and heading |
| --- | --- |
| [CP] | `Canon Policy.md` (Priority; Current calendar) |
| [AR] | `05 - Geography/Aoaz and Its Regions.md` (region table) |
| [ML] | `05 - Geography/Middle Lands and Aenor.md` (all headings) |
| [SE] | `05 - Geography/Selen.md` |
| [DL] | `05 - Geography/Volgans Ember Lands.md` (First Age campaign) |
| [PA] | `04 - Peoples/Peoples of Aoaz.md` (Great Folk; Mortal peoples; Other peoples) |
| [AI] | `04 - Peoples/The Ainu.md` |
| [GP] | `06 - Politics/Great Powers and Relations.md` (table) |
| [KF] | `06 - Politics/Kingdoms Factions and Conflicts.md` (Main succession factions) |
| [LC] | `06 - Politics/The Lost Cause.md` |
| [AH] | `06 - Politics/Afrits Hidden Council.md` |
| [HF] | `06 - Politics/Houses of the First Light.md` |
| [EO] | `06 - Politics/Elzons Order.md` |
| [A1] | `07 - History/The First Age of Aoaz.md` (§1 to §10) |
| [A2] | `07 - History/The Second Age of Aoaz.md` (§II, §IX, §X) |
| [2R] | `07 - History/Second Age Canon Register.md` (Established facts) |
| [A3] | `07 - History/The Third Age of Aoaz.md` (proposed chronology) |
| [A4] | `07 - History/The Fourth Age of Aoaz.md` (Prologue, §III, §XIV) |
| [4R] | `07 - History/Fourth Age Canon Register.md` |
| [FC] | `07 - History/Fourth Age Chronology.md` (I to V) |
| [C48] | `07 - History/The Campaign of 4A 1748.md` (The Middle Lands; Where history can turn) |
| [TL] | `07 - History/Timeline.md` |
| [ER] | `07 - History/The Elven Refusal.md` |
| [WLC] | `07 - History/War of the Last Crowns.md` (phases) |
| [BR], [WU] | `07 - History/Black Roots.md`, `War of Unbinding.md` |
| [GK], [AF], [AS], [ED], [VA], [GL] | `03 - Figures/Golden King.md`, `Afrit.md` and `Afrit the Deliverer.md`, `Alleria of Selen.md`, `King Edran.md`, `Varner.md`, `Glernaen.md` |
| [SN], [RK] | `02 - Spirits/Spirit Natures.md`; `01 - Cosmology/Religious Knowledge and False Gods.md` |
| [OC] | `docs/zin-handoff/01-CONTEXT-AND-CANON.md` §2.2 (natural range), §2.3 (twelve New Gods), §2.4 (Zol's servant), §2.5 (Bastian), §3 (wider world), §6 |
| [OQ] | `docs/zin-handoff/OWNER-QUESTIONS.md` (Q-11, Q-14, Q-21, Q-23) |
| [OD] | Owner decisions of 24 October 2026 relayed by the coordinator: renaming of unfitting and borrowed labels, Hirolon sovereign, the Aenor Forest and its tree-people, the renaming of Coniferon and Vinocorne, small folk, dwarves in the great ranges, Kusven as Zol's servant, gunpowder, Bastian, no exact ages, the twelve main and the lesser New Gods, the Deliverer's feast |
| [RQ] | `docs/zin-handoff/02-TOTAL-OVERHAUL-SPEC.md` (R-11, R-19, R-21, R-24 to R-29) |
| [GM] | `tools/content/data/geography/aoaz.json` (ids as cited) |
| [GMS] | `docs/specs/01_map/05_geography_model.md` (§2 Middle Lands, Aenor Isle; §4; §5; §13) |
| [DEM] | `tools/content/data/world/demography.json` (regions, countries, settlements, density modifiers); `docs/specs/02_lore/07_demography_and_settlement.md` §4 |
| [WB] | `docs/specs/02_lore/05_world_bible.md` (§1, §3.1, §4, §6.1, §7) |
| [LANG] | `docs/specs/02_lore/06_languages.md` (§1, §2, §5, §7); `tools/content/data/world/languages.json` (aenoran, orran, goblin, sylvan) |
| [ROS] | `tools/content/data/countries.json` (scans Rush Land, Rush Islands, Magical Lands) |
| [LBL] | `tools/content/data/labels.json` (Rush Land, Rush Islands) |
| [BC] | `docs/lore/sources/bestiary_cards_part1.md` and `bestiary_cards_part2.md` (cards 3, 12, 15, 29, 36, 38, 40, 44, 53, 65) |
| [ACS] | `docs/specs/04_mechanics/aenor_court_and_succession.md` (§3, §4) |
| [EWD] | `docs/specs/04_mechanics/elves_wall_and_dragons.md` (§5) |
| [FT] | `docs/design/focus/*.json` (summaries of the trees named) |
