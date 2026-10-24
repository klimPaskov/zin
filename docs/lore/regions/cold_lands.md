# The Cold Lands

**Requirement:** R-19 regional dossier. **Status:** draft for owner review, 24 October 2026; owner decisions of 24 October 2026 applied. **Region keys:** `cold_lands` and `windwaith` in the geography model (the key keeps its old spelling until the map data is migrated); roster scan "Cold Lands".

**How to read this dossier.** Every statement carries its status. **Established** means the lore vault or an owner ruling says it, with the source in brackets. **Working** means the vault's working political table or the drawn map. **Proposed** means new here or in an earlier spec, and replaceable. Citation keys are explained in section 14. **Owner decisions of 24 October 2026** [OD] are treated as established: names from other fiction or real myth are replaced directly; names built on "-waith" are replaced and the northern regions use no "waith" name; ill-fitting or repetitive labels may be renamed with the old label kept as former label; goblins avoid the deep cold but hold sheltered valleys of the southern Cold Lands; dwarves hold the great ranges of the West and North Lands and the Great Wall range; no exact age of any being is stated.

## 1. Overview

The Cold Lands are the largest landmass of Aoaz and the least known: a white country of ice plains, three great ranges and a long dark winter, reaching off the north and west of the map into lands no chart has fixed [V: Aoaz and Its Regions]. Men have lived beside the ice here since before Aen, in clans that herd reindeer, hunt seal and keep their fires through the Long Dark, and Aenor's First Age ships gave the land the chart name Coldor (proposed reading). In 4A 1748 the Winter Crown of Coldor rules the frozen interior and the western ports from Fandanar and leads the Northern Accord with Horidor, while the warlords of **Melkgard** (former label Isengard) refuse to kneel behind their black forts (working table, renamed [OD]). Around them live free steadings and road clans, goblin holds in the warm-spring valleys of the southern mountains [OD], two peoples of yeti, the ice giants of **Nivaros** (former label Titanos), and the sealers of the **Vindael** ice arm (former label Windwaith). In a sheltered high valley of the far north, Mp'E, an ordinary small town lives below a silent castle where Horos sits with Glo in his breast (established). Somewhere in the far north-west, in ice older than any crown, a man sleeps whom nobody in Aoaz is looking for (established that he wakes here; nothing shows it at the start).

## 2. Physical character

### Terrain, relief and ranges

The heart of the land is a flat snow plain at elevation 1, the drawn **Frozen Lands of Coldor** (`ice_frozen_lands_of_coldor`), inside the wider permanent **Snowfields of the Cold Lands** (`ice_cold_lands_field`, proposed name) [GM]. Terrain shares in the model are plains 74%, mountain 12%, hills 9%, forest 4% and marsh 1%, with a snow share of 0.9 [GM region_cold_lands]. Three great ranges break the plain [GM region_cold_lands]:

- The **Icy Mountains** (`range_icy_mountains`, peak class 5) run down the west coast above Tinton, ice-sheathed to the sea.
- The **Isengar Mountains** (`range_isengar_mountains`, peak class 5; the drawn name is not the borrowed one and is kept) and the proposed **Yeldenne Heights** (`range_yeldenne_heights`) wall the high valley of Mp'E on the east and west; the proposed **Isengar Pass** (`pass_isengar`) is its one way in.
- The **Cold Mountains** (`range_cold_mountains`, peak class 5, the highest range of the north) run west to east as the Naepu and Fearno ridges and then curve north along the east coast.

Lesser relief: the **Coldor Mountains** (`range_coldor_mountains`) along the south coast facing the Yeti Lands, whose deep southern valleys hold warm springs (proposed; see the goblin holds below); the **Neridor Mountains** (`range_neridor_mountains`, drawn Meridor or Neridor, reading uncertain), the rampart of the neck toward the West Lands, crossed at the proposed **Neridor Gap** (`pass_neridor_gap`); the lone **Hendair Hills** (`range_hendair_hills`) in the Coldor plain; the **Olsuaon Massif** (`range_olsuaon`); and the proposed heights of the giants in the far north-west (`range_titanos_heights`, proposed name **Nivaros Heights**). The drawn **Frozen Mountains** and **Seteno Mountains** lie in the part of the drawing cropped from the mosaic, beyond the playable edge [NT].

The map edges are the proposed **Hoarfrost Barrier** (`ice_frozen_barrier`, west) and the **Roof Cliffs** (`ice_northern_cliffs`, north): impassable ice cliffs where the known world stops [GM]. What lies beyond is not fixed [V: Aoaz and Its Regions].

### Climate and seasons

Arctic and subarctic: long dark winters, short cool summers and blizzards on the coasts [GM region_cold_lands]. The clans count the year in two halves, **the Long Dark and the Long Light** (proposed [WB §3.1 Winter-Crown Folk]), and the turn between them is the night when every hearth is relit from the clan fire. The twelve months are to be named after the twelve main New Gods [V: New Gods; OD], so this dossier dates seasonal customs by the Long Dark and the Long Light, never by the old month names. Snow lies on the interior all year. The south coast (Poloto, Holdon, Fentene), the west coast below the Icy Mountains, the Fandan valley, the warm-spring valleys of the Coldor Mountains and the sheltered valley of Mp'E have a short green summer (proposed, from the model's fertility note [GM region_cold_lands]). The far north-west has almost none.

### Water

- **Rivers.** The proposed **Fandan River** (`river_fandan`, width 2, long) is the one great river: from the Yeldenne Heights through the Neridor Gap to the Cold Ocean at Poloto, the natural line between Coldor and Melkgard [GM]. The proposed **Naepu River** (`river_naepu`) runs north-east to the Siroler coast; the proposed **Orewell Water** (`river_orewell`) flows north from the Orewell lowland [GM].
- **Lakes.** The proposed **Cold Tarn** (`lake_ice_tarn`) at the head of the Naepu [GM].
- **Seas, one name each:** the **Frozen Ocean** (`sea_frozen_ocean`) in the north, whose inner bay is the proposed **Gulf of Minnolomak** (`gulf_northern_bay`); **Pandar** (`sea_pandar_frozen_seas`, drawn "Pandar - The Frozen Seas"; proposed single name Pandar, because "Frozen Seas" beside "Frozen Ocean" names one idea twice); the **Norrai Ocean** (`sea_tritons_ocean`, former label Triton's Ocean, renamed because "Triton" is a name of Greek myth [OD]; Tritonic *norrai* "the north", what the Pupor islanders call this water) between the Cold Lands, the West Lands and the Pupor Isles; the **Cold Ocean** (`sea_cold_ocean`) south of Poloto; and the **Siroler Seas** (`sea_siroler_seas`) off the east coast [GM]. The drawn **Sea of Odor** lies beyond the mosaic crop [NT].
- **Straits.** The proposed **Coldor Channel** (`strait_coldor_channel`) between the Coldor coast and the Yeti Lands shelf, crossable on the ice in deep winter [GM]. The **Vindael arm** is joined to the mainland only by winter sea-ice [GM region_windwaith].

**Contradiction in the model.** The region record says rivers are open only about two months, while `river_fandan` says the Fandan is frozen four months a year [GM]. Proposed reconciliation: the upper Fandan and the interior streams freeze for about ten months; the lower Fandan below the Neridor Gap, warmed by the coast, is open for about eight. This matters for the Neck Road and Poloto's harbour season.

### Hazards

The Long Dark itself; whiteout blizzards on the coasts; sea-ice that opens under sleds in the thaw; crevasse fields on the Frozen Lands of Coldor; avalanches in the Cold Mountains; the edge cliffs; and winter attrition for any army that has not learned the north (proposed; the Long Winters model it [MS cold_lands §3]). Bitter winters come about one year in five (proposed weights [MS cold_lands §3]).

## 3. Inhabitants

### Peoples, cultures and languages

| People | Culture | Language | Where | Status |
| --- | --- | --- | --- | --- |
| Men | Winter-Crown folk | Coldic, crown dialect | Coldor: the Fandan valley, the Coldor plain, the western ports | culture proposed [WB §3.1]; Coldor working |
| Men | Ice clans | Coldic, clan dialect (Yeti and Giant loan-words) | Horidor, Fearno, the north-west, the road clans, the coasts | proposed [WB §3.1] |
| Men | Melkgard warlords | Coldic, march dialect (forge-words) | the Isengar valley's east side and Minnolomak | proposed [WB §3.1, renamed] |
| Men | Vindael seafarers | Coldic, coast dialect, with Gunwyn sea-talk | the Vindael ice arm | proposed [WB §3.1, renamed] |
| Goblins | Glimkit warrens (proposed) | Goblin Cant | the warm-spring valleys of the Coldor Mountains | owner decision [OD]; holds proposed |
| Yeti | two song-lines (proposed below) | Yeti Speech (sung) | the southern shelf and the northern heights | people established [V: Peoples of Aoaz] |
| Giants | Ice giants of Nivaros | Giants' Speech, northern dialect | the far north-west heights | people established [V: Peoples of Aoaz] |
| Horos | a Great Spirit, not a people | Elder name | the castle at Mp'E | established [V: Castle of Yeldenne and Glo] |

Coldic is the oldest living tongue of men in the north-west, a Boreal language related to the western Gunwyn speech and to Tritonic and not to the Ainic speech of Aenor (proposed [LG §1, §3.7]). Shared Boreal words (*tawr* "king", *marg* "sea") come from common ancestry; the chart ending *-dor* in Coldor, Horidor and Neridor comes from Aenor's First Age charts (proposed [LG §5]). **No "waith" names.** The owner has ruled that names built on "-waith" read as borrowed and that the northern regions use none [OD]; the chart ending once stamped on shores is retired, and no Cold Lands place name is built on the Coldic shore-word *vait* either, so that nothing echoes it. The Cold Lands' substrate for high places is the Giants' Speech and the Yeti Speech (proposed [LG §5]): the Huk heights are older than the clans.

**Goblins.** The owner's goblin card says goblins live where it is warm and avoid the cold [BC 36]; the owner has ruled that they avoid the deep cold but hold sheltered valleys of the southern Cold Lands [OD]. Proposed: the deep valleys on the southern face of the Coldor Mountains are warmed by hot springs, and the goblins of **Glimkit** live in warrens around them, where the drawn glens of Agoron and Belor lie [NT]. With them live a few hobgoblins, their defenders and heavy labourers [BC 29].

**Dwarves** hold the great ranges of the West Lands and the North Lands and the Great Wall range [OD], not the Cold Lands. The dwarf card's uncertain "[?Orewell?]" [BC 44] is read here as the Orewell iron that the western dwarves buy: a dwarf factor-house at Guerlon (proposed).

### Population

The demography model gives the Cold Lands **10.5 million** people in 285 states and 31 countries, with Coldor at 1.63 million, Fearno 0.77 million, the Vindael arm 0.74 million, the Yeti Lands 272,000 yeti and the ice giants 59,400 [DM regions; DM countries].

**Revision proposed: about 2.5 million.** The model's own density note says coastal and valley farms carry 12 to 20 people per square kilometre, the interior under two and the far north-west almost none [DM §4 Cold Lands]. The region has a snow share of 0.9 and three-quarters of its land is snow plain [GM region_cold_lands]. Applying those densities (about a tenth habitable coast and valley at about 15, three-tenths tundra and moor at about 1, the rest ice at 0.05), and comparing with the West Lands' 20 to 35 on temperate land four times smaller [DM §4 West Lands], gives about 2.4 to 2.7 million. Ten and a half million would make the frozen north hold more people than the temperate West Lands and the North Lands together. Further corrections:

- **Vindael:** the model gives 742,000 people to an arm the geography model calls an arctic ice shelf with no fertility and "sparse tribes" [GM region_windwaith]. Proposed: about 40,000 sealers, whalers and harbour folk.
- **Giants:** the vault says giants are few and enormous [WB §2 Giants]; 59,400 would need more seal and caribou than the north holds. Proposed: about 3,000.
- **Yeti:** 272,000 yeti on 22 states is a nation the size of a West Lands kingdom. Proposed: about 40,000 in two ranges (25,000 on the southern shelf, 15,000 in the northern heights).
- **Goblins:** about 15,000 in the warm valleys (proposed).
- **Yeldenne:** the castle and its valley town, about 3,000.

Proposed distribution (living people): Coldor 0.82 M; Melkgard 0.30 M; Fearno 0.25 M; Horidor 0.22 M; Worlond 0.16 M; Xison 0.12 M; Austklev 0.10 M; Pertolor 0.09 M; Holdon 0.08 M; Poloto 0.06 M; Orewele 0.06 M; Celen 0.05 M; Portogalor 0.05 M; Omar 0.05 M; Vindael 0.04 M; Glimkit 15,000; the Yeti Lands 25,000; Ghaahu 15,000; Nivaros 3,000; Yeldenne 3,000. Urban share stays near the model's 8% [DM regions].

### Where they live and why

People follow open water, fish and grass. The densest belt is the **Fandan valley** from Fandanar down to the Neridor Gap, where the river opens in the Long Light, sedge meadows feed horses and the Neck Road brings western grain (proposed). The **west coast** below the Icy Mountains (Alorio, Akahew, Andgas, Norrak) lives by the harbour trade with the West Lands and the sealing grounds of Pandar [NT; DM settlements]. The **south coast** (Holdon, Fentene, Poloto) faces the Cold Ocean, which freezes late, and trades with the yeti across the Coldor Channel (proposed). The **warm-spring valleys** of the Coldor Mountains shelter the goblins. The **Isengar valley** (Mp'E and Melkgard's march) is sheltered from the north wind by its ranges [GM region_cold_lands]. The **interior moors** of Fearno and the north-west carry reindeer clans that move with the herds. The ice heart is empty except for herders crossing it and the white wolves that follow the herds.

## 4. Livelihoods and resources

The economy spec weights the Cold Lands at iron 3, timber 2, horses 1, stone 2, gold 0, essence 0 and grain 0, with development 0.25 [EC region table].

| Resource | Where and why (proposed unless marked) |
| --- | --- |
| Iron | The forges of Minnolomak, fed by bog-ore and the rock-ore of the Isengar Mountains; the Orewell mines, worked by men and bought by dwarf factors from the western holds; the Hendair Hills; the goblins' small, clever smithies. |
| Timber | The Worlond Forest on the neck (`forest_worlond`, dense conifer) for ship timbers and charcoal. Coldor sells timber to the West [MS cold_lands §7]. |
| Horses | A short, shaggy northern horse bred in the Fandan meadows (proposed name *snevhest*, Coldic "snow-horse"), hardy but few. |
| Stone | Dark stone and turf for halls; the black stone of the Melkgard forts [WB §3.1]. |
| Gold, essence | None worth working. Glo at Mp'E is an artefact and a Great Spirit's heart, never a resource [V: Castle of Yeldenne and Glo]. |
| Grain | Almost none grown: oats and barley in the Fandan valley, on the south coast and in the warm valleys in good summers. |

Other livelihoods: reindeer herding; sealing and walrus-hunting on Pandar and the Yeti Shallows; whaling in the Siroler Seas and off the Vindael arm; fur trapping; amber from the west coast; walrus ivory and the tusks of the "spear-whale" (proposed); goblin lamp-oil, traps and hot-spring salts traded at Fentene (proposed).

**Coldor's power is bread, not ore.** The world bible says Coldor "rules by grain and fire: it feeds the clans in hard winters" [WB §5 Coldor], and the mechanic lets Coldor feed the steadings [MS cold_lands §2], while the resource table gives the region no grain [EC]. Proposed reconciliation: Coldor's bread is **stored and bought**: the crown's granaries at Fandanar and Alorio hold western grain bought with iron, furs and timber over the Neck Road and by sea, and the crown's right to open them in the Long Dark is the root of its authority.

## 5. Institutions and political forms

- **The Winter Crown of Coldor** (proposed constitution [WB §3.1]): passes to the eldest child of either sex; advised by a council of clan-fire keepers; hearth-law (no feud may be carried past a shared fire). Its authority rests on the Frost-Hall's fire, the granaries and the western ports.
- **The Northern Accord** (working name [V: Great Powers and Relations]): a league of Coldor and Horidor, not a crown; members keep their chiefs, swear mutual defence and send their chiefs to Fandanar's Frost Moot (proposed).
- **Melkgard** (working rival [V: Great Powers and Relations], renamed): a warlord holds the realm through **oath-companies** sworn to him personally; the heir is the best sworn man (proposed [WB §3.1]). Melkgard refused the Winter Crown when Coldor united the interior (proposed, 4A 850 [V: Fourth Age Chronology §II]).
- **The winter moots** of the clans (proposed [MS cold_lands §2]): each chief is chosen by the clan moot, and feuds are settled before the Long Dark; a clan fed by a crown in a hard winter owes it at the next moot.
- **Fearno's hall of many lords** (proposed [FT regional_fearno]): steading lords sit as equals and choose a first lord for a term; the Free Steadings are a third pole between Fandanar and Minnolomak.
- **Horidor's cairn moot** (proposed [FT regional_horidor]): chiefs who keep the cairn roads over the Neridor Gap.
- **The Vindael harbour council** (proposed [WB §3.1]): captains elect a Speaker; land and catch are held by ship-share.
- **Poloto** (proposed): a free port governed by its harbour guild.
- **Glimkit** (proposed, from the goblin and hobgoblin cards [BC 29; BC 36]): each warren obeys its cleverest goblin; the warrens of the valley answer to one big hobgoblin chief who rules this valley and no other. The owner's rule that the hobgoblin king rules only his own realm [OD] concerns the goblin king of the Dark Lands; Glimkit's chief is a lesser lord who owes him nothing.
- **The yeti** (proposed [WB §3.7]): no state; the Eldest sings the clans' names at the winter gathering, and the clans follow the one whose song carries furthest.
- **The ice giants** (proposed [WB §3.6]): a Frost-King chosen by the cairn-keepers, who count each giant's life in stones.
- **Yeldenne** (established ruler [V: Castle of Yeldenne and Glo]): Horos is lord of the castle; the valley town keeps its own headman and the custom of feeding the hall (proposed). After Horos dies a Warden of Mp'E leads the realm (proposed [MS yeldenne_and_glo]).

## 6. Beliefs and faiths

**What people believe** (all proposed unless marked):

- **The Winter Hearth** [WB §4]: the hearth-fire is the first law; in the Long Dark every house lets its fire die and relights it from the clan fire. Holy sites: each clan's fire and the **Frost-Hall at Fandanar**, whose fire is said never to have gone out since the crown's founding. Clergy: fire-keepers. The dead are burned on stone pyres so that no cold remains.
- **The Storm Court** [WB §4]: captains and warlords bargain with the spirits of wind and water and keep a token of each. Holy sites: the wind-towers of the Vindael headlands and the Black Gallery of the Melkgard forts. The Elemental Spirits are a proposed nature [V: Spirit Natures]; mortals often mistake Lesser Spirits for gods [V: Religious Knowledge and False Gods].
- **The Warren Luck** of the goblins: a lamp kept burning in every warren; a lamp gone out is a warren doomed [WB §4]. The hot springs are "the mountain's breath", and bathing in them is the goblins' one solemn rite (proposed).
- **The Cairn-Faith** of the giants and **the Hum** of the yeti (sub-regions below).
- **The New Gods** are honoured at the hearth without names. The owner has ruled that twelve main New Gods answer the twelve needs of mortals and that lesser New Gods also exist [OD]; the clans pray to "the god of the hearth's need" or "the god of the hunt's need" as the need arises, naming no god, because the names are not yet written [V: New Gods].
- **The Faith of the Deliverer** is present but thin: Houses of the First Light at Alorio and Poloto keep grain and birth rolls for the ports (proposed; the Afrit spec gives every Cold Lands realm except Yeldenne a start foothold of 1 [MS cold_lands, Decisions applied]).

**Holy and feared places:** the Frost-Hall; the clan fires; the Black Gallery; the hot springs of Glimkit; the hum-caves; the giants' cairn-fields and the Frost-King's throne; the **Silent Road** that leads past the town of Mp'E to the castle, where clans leave bread at the road's start and nobody walks on (proposed [WB §7 Pilgrim roads], reconciled with the owner's ordinary town: the town is ordinary, the road beyond it is not).

**Truth kept apart from belief.** Horos is a Great Spirit and Glo carries the power of Glernaen, the mightiest New God [V: Castle of Yeldenne and Glo; V: Glernaen]. The people of Mp'E call him **the Watcher in the Hall** and believe he is a sleeping king of the old north who will wake if the valley breaks its bread-custom (proposed belief). Players read only "a crystal of old and holy power" until the guardian dies [WB §5 Yeldenne]. The far north-west carries no legend of a sleeper at the start [SS Cold Lands].

## 7. History

| Date | Status | Event |
| --- | --- | --- |
| Before 1A, undated | established | Men live for thousands of years before Aen, in kingdoms of their own [V: The Ainu and the First Men; V: Timeline]. |
| Before 1A | proposed | Boreal-speaking clans already herd and seal in the north-west when Aenor's ships arrive; the giants and the yeti are older still in the clans' tales [WB §2 Men; LG §5]. |
| Ages unknown | established | Horos guards Glo "through the ages" at Castle Yeldenne [V: Castle of Yeldenne and Glo]. When the castle was built and by whom is open. |
| Ages unknown | established (place), open (time) | Eindil is placed in a magical sleep and later wakes in the Cold Lands [V: Eindil; V: Open Questions]. |
| 1A, first half (about 1 to 800, working illustration) | established event, proposed date | Aenoran voyages reach the Cold Lands [V: The First Age of Aoaz §2]. Proposed: the charts name the coast Coldor ("ice-land"); trading posts at Alorio and the Fandan mouth. |
| 1A, about 400 | proposed | **The Charting of the Neck.** Aenoran surveyors cross the Neridor Gap and draw the first road from the Fandan to the West Lands. |
| 1A, about 800 to 1150 | proposed | As Aenor weakens, its northern posts fall to clan chiefs; the Alorio post becomes a free harbour. |
| 1A, late | established | The Grand Alliance draws on the West Lands, North Lands, islands, Magical Lands and parts of the Dark Lands [V: The First Age of Aoaz §5]; the Cold Lands are not among the peoples listed. Proposed: no Cold Lands realm marches to Dardan, and the north remembers the war only as "the southern burning". |
| 2A, early centuries | proposed | **The Hunger Winters.** The plagues of the Age of Long Grief [V: The Second Age of Aoaz §I] reach the ports by ship; three bitter winters in one generation break the coastal clans; the Fandan valley chief opens his stores to every clan, the founding legend of the Frost-Hall's custom of bread. |
| 2A, about 600 | proposed | The first Frost-Hall is raised at Fandanar around a fire brought from the eastern Fandan clans. |
| 2A, about 1000 | proposed | **The Warm Valleys.** Goblin warrens driven north by the wars of the Long Grief cross the Coldor Channel's winter ice and settle around the hot springs of the Coldor Mountains; the south-coast clans first fight them, then trade with them. |
| 2A, about 1300 | proposed | **The old pacts**: a hunting truce with the southern yeti and a toll-peace with the ice giants (origin of the mechanic's pacts [MS cold_lands §4]). |
| 2A, late | proposed | Warlords first fortify the Isengar valley against raiders from the Frozen Ocean coast; the Black Gallery is cut into the rock below Minnolomak. |
| 2A 2133 | established | Elzon conquers Aenor; the Third Age begins [V: The Third Age of Aoaz]. |
| 3A, 1 to 1260 (proposed length) | proposed | Elzon's Order never reaches the Cold Lands; Aenoran refugees come north by sea in small numbers; western trade replaces southern trade at Alorio. |
| 3A, about 700 | proposed | **The March of Bones.** Necromancers of Elzon's Order buy dead from a starving coastal clan; the Fandan chiefs burn the buyers' ship at Poloto, and the Winter Hearth's rule that the dead are burned takes its present force. |
| 4A 1 | established event, proposed date | Elzon dies; human monarchy is restored at Parim [V: Fourth Age Chronology §I]. |
| 4A 702 | proposed | The Pupor islanders' charts are sold to every crown [V: Fourth Age Chronology §II]; Vindael opens a regular whaling route south. |
| 4A 850 | proposed | **The Winter Crown.** Coldor's kings bring the frozen interior under one crown; Melkgard refuses and becomes Coldor's rival [V: Fourth Age Chronology §II]. Proposed: the crown is first worn by a queen of the Fandan line, and the Northern Accord is sworn at the Neridor Gap. |
| 4A 851 to 1100 | proposed | **The Forty Winters' Quarrel** between Fandanar and Minnolomak: raids across the Fandan, never a declared war; the March Forts are built on both banks. |
| 4A about 1300 | proposed | Fearno's steading lords refuse both crowns and found the Free Steadings. |
| 4A 1611 to 1700 | proposed local echo of Afrit's gathering of artefacts [V: Fourth Age Chronology §III] | Southern scholars ask in Alorio about "a castle in the ice"; the clans send them away. |
| 4A 1748 | established start, proposed date | Peace; Coldor and Horidor hold the Accord; Melkgard keeps its forts manned [SS Cold Lands]. |
| 4A 1749 | established event, proposed date | Eindil wakes in the far north-west; tribes find him and nurse him; late in the year West Lands traders take him south [V: Fourth Age Chronology §V; V: The Fourth Age of Aoaz]. Proposed: the Celen reindeer clans are his hosts, and he goes south over the Neck Road. |
| 4A 1752 | proposed | The March Forts: a border war between Coldor and Melkgard [MS cold_lands §9]. |
| 4A 1753 | established event, proposed date | Eindil lands below Mp'E; his crew is killed in an ambush; Afrit reaches the hall first and wounds Horos and is wounded by Eindil; Horos gives Glo to Eindil and turns to dust [V: Castle of Yeldenne and Glo; V: Fourth Age Canon Register]. |
| 4A 1753 to 1754 | proposed | Coldor sells timber to the West [MS cold_lands §9]. |
| 4A 1755 to 1760 | proposed | The War of the Last Crowns: the Cold Lands stand apart on the historical path [MS cold_lands §8]; the vault says nothing about them in the final war. |

**Where the region can diverge** (play, never history): Melkgard can swear to the Accord, be humbled or be conquered; Coldor can join the Western Crossing, send White Companies to Eindil's coalition, or stand apart [MS cold_lands §1, §8]; Coldor's wardens can watch over the man from the ice, and Coldor's watch-fires can warn the castle of the temple party [MS cold_lands §5, §6]; the yeti and the giants can close their lands to every crown [MS cold_lands §4]; the goblins of Glimkit can sell lamp-oil and traps to Melkgard or open their valley to a crown that guards their springs.

## 8. Neighbours and relations

| Neighbour | Relation (proposed unless marked) |
| --- | --- |
| West Lands | The Neck Road over the Neridor Gap and the Worlond Forest is the only land link and closes in winter [GM pass_neck_road]. Gunwyn (former label Gunwaith) buys furs, iron and timber and sells grain and cattle; the western dwarves buy Orewell ore. Eindil goes south this way. |
| The Pupor Isles (former label Triton's Islands) | Across the Norrai Ocean: charts and sailcloth for whale-oil and ivory. |
| Aenor and the Middle Lands | Distant: Aenoran merchants buy furs at Alorio; the Houses of the First Light keep a foothold in the ports. |
| North Lands | Across Londolo (former label Great Sea of the Leviathan, a name of real myth [OD]) far to the east; little contact. |
| Zol's Mistake | No shared coast on today's map; if the map gives a Cold Lands coast on the Kusmeel, it joins the fishermen's rumours [MS cold_lands §8]. |
| Erdae | The drawing's route note **"The Path to Erdae"** lies in the far north beyond the playable edge [NT; names traceability]. Belief only (proposed): the far clans say a path of sea-ice in the deepest winters leads to a land of its own magic, and that strangers who claim to come from it are met once in a lifetime. The owner's rule allows that travellers occasionally arrive from Erdae [HO §3]; nothing else is stated. |
| Within the region | Coldor and Melkgard: rivalry (opinion "Cold Rivalry" −30 [SS Relations]); Coldor and Horidor: the Accord; the clans lean to whoever feeds them in hard winters [MS cold_lands §2]; the yeti and giants keep old pacts; Holdon and Glimkit trade and quarrel over the springs. |

## 9. Wildlife and creatures

| Creature | Habitat | Rarity | Effect on travel, farming and war |
| --- | --- | --- | --- |
| Reindeer (proposed main herd beast) | interior moors, Fearno, the north-west | common | The clans' whole wealth; herds decide where clans move and where armies find meat. |
| White wolves (proposed: winter packs larger than southern wolves) | the Frozen Lands, following the herds | common in the Long Dark | Raid herds and stragglers; furs are a trade good. |
| Great white bears (proposed) | sea-ice of Pandar, the Yeti Shallows, the Vindael arm | uncommon | Kill sealers on the ice; a bear-skin is a chief's mantle. |
| Seals, walrus | Pandar, the Yeti Shallows, the Siroler Seas | common | Oil, hide and ivory; the sealing season sets the coastal calendar. |
| Whales, including the long-tusked "spear-whale" (proposed) | the Siroler Seas and off the Vindael arm | seasonal | Whale-oil lamps light the Long Dark; Vindael's wealth. |
| *Snevhest*, the northern horse (proposed) | the Fandan meadows | few | Coldor's cavalry is small and hardy; hence horses 1 [EC]. |
| Sled dogs (proposed) | everywhere men live | common | Winter transport and the ice sleds of war [WB §3.1]. |
| **Bone-hounds** (former card name "warg", a name from other fiction, replaced [OD]) | with the goblins of Glimkit; nowhere else in the north | few | Wolf-like beasts that goblins ride, crushing and digesting bones [BC 15]; here a cold-hardy, shaggy kind kept in the warm valleys and ridden only in summer. |
| Yeti and ice giants | see sub-regions | peoples, not beasts | Pacts and tolls decide who may cross the snow. |

No sea serpent is placed here; the serpent card names its waters only with a Tolkien name and an uncertain reading [BC 12].

## 10. Settlements

| Settlement | Realm | Size (proposed, revised) | Why it stands there |
| --- | --- | --- | --- |
| **Fandanar** | Coldor | about 32,000 (model 85,000 [DM settlements]) | Drawn [NT]; working seat [V: Great Powers and Relations]. In the Fandan valley where the Neck Road leaves the river; the Frost-Hall and the crown granaries. |
| **Alorio** | Coldor | about 10,000 (model 22,000) | Drawn [NT]. The best harbour of the west coast; the Harbour-Master's seat; a House of the First Light. |
| **Hendak** (former label Hodor, a name from other fiction [OD]) | Coldor | about 2,500 | Coldic house stem *hend* + *-ak* "place": the house-seat of the Hendair line under the Hendair Hills. |
| **Akahew**, **Andgas** | Xison | about 5,000 and 3,000 | Drawn [NT]. Market towns where the upland road meets the coast road. |
| **Norrak** (former label Narnia, a name from other fiction [OD]) | Xison | about 2,000 | Coldic *norr* "north" + *-ak*: the moor town of the Rion herders. |
| **Minnolomak** | Melkgard | about 12,000 (model 30,000) | Drawn [NT]. At the mouth of the main Isengar pass; the warlord's fort-city and forges; the Black Gallery below. |
| **Ollondo** | Horidor | about 6,000 | Drawn [NT]. On the valley road below the Neridor Gap. |
| **Azenoalion** | Fearno | about 5,000 | Drawn [NT]. The hall-town of the Free Steadings on the Naepu. |
| **Vaestia** | Austklev | about 4,000 | Drawn [NT]. Where the east-coast forest meets the coast road. |
| **Fandhavn** (proposed) | Poloto | about 9,000 | At the Fandan mouth on the Cold Ocean; the longest-open harbour of the north. |
| **Fentene** | Holdon | about 3,000 | Drawn [NT], near the Yeti Lands label. Proposed: the **snowline fair** town where yeti and goblins trade fur, ivory, lamp-oil and salts for iron and grain. |
| **Glimkit** (proposed) | Glimkit | a warren-town of about 4,000 | Goblin Cant *glim* "lamp" + *-kit* "little place": the warrens around the largest hot spring of the Coldor Mountains, in the drawn glens of Agoron and Belor [NT]. |
| **Porideon** | Vindael | about 4,000 (model 24,000) | The council port on the westward headland of the ice arm [DM settlements]. |
| **Guerlon** | Orewele | about 3,000 | Drawn [NT]; the iron town at the Orewell mines, with a dwarf factor-house (proposed). |
| **Esrom**, **Ezhan** | Celen | about 1,500 each | Drawn [NT]; the moot-towns of the reindeer clans in the Long Dark. |
| **Hul'…** (drawn, reading incomplete) | Yeldenne | about 1,500 | Drawn beside Mp'E but hidden by a seam [NT]. Proposed: the ordinary town of the valley (decision L2 [HO §5.1]); the castle is a site above it, not the capital. |
| **Xitore** | Nivaros | a hall, not a town | The Frost-King's ice-throne on the glacier plain [DM settlements]. |

The drawn localities beyond the playable edge (Luivinen, Ludghis, Siulas, Eciele, Setondse, Furlst, Hiteglsosn [NT]) are proposed as names the clans give to camps and lands beyond the Hoarfrost Barrier: places in songs and traders' tales, not in the game.

## Sub-regions in depth

### The far north-west

**Land.** The corner west and north of Fandanar: the Olsuaon Massif, the giants' heights, the Orewell lowland and the ice beyond, with the drawn lands Celen, Radeon, Gaadon and Orewele on the playable side and Grindok, Essenus, Azlen, Prorough, Sil Lands and the Luria Ice Lands on the cropped side [NT]. The model proposes that **Eindil's Ice** (`site_eindil_ice`) lies here [GM]. The mechanic marks these states as `zin_is_region_far_northwest` with supply and attrition penalties (proposed [MS cold_lands §5]).

**People.** The **Celen reindeer clans** (proposed merger of the drawn Celen, Radeon and Gaadon): nomads who winter at the moot-towns Esrom and Ezhan and summer on the giants' foothills. Their chiefs are chosen at the winter moot and their wealth is counted in herds. They are proposed as the "tribes of the north-west" who find Eindil [V: Fourth Age Chronology §V]. Coldic personal stems such as *grin*, *essen*, *azl*, *siul* and *esr* echo the drawn names of the cropped lands [LG §3.7], so the clans beyond the edge are kin of the Celen.

**Gameplay.** The ice host's lean, Coldor's wardens and the Neck Road hooks of the journey [MS cold_lands §5]. Nothing visible at the start hints at a sleeper [SS Cold Lands].

### The warm valleys of Glimkit

**Land.** The deep southern valleys of the Coldor Mountains, where the drawn glens Agoron and Belor lie [NT], warmed by hot springs that keep snow off the valley floors in all but the bitterest winters (proposed). Steam fogs, sulphur crusts and soft green moss make them unlike anything else in the north.

**People.** Goblins: small, clever, short-lived, lovers of gold and fine things, weakened by sunlight and fond of warm caves [BC 36], with a few hobgoblins as guards and carriers [BC 29]. They mine the valleys' copper and iron, make the best traps and lamps of the north, ride bone-hounds in summer and keep out of the open snow. Owner rule: goblins avoid the deep cold but hold sheltered valleys of the southern Cold Lands [OD].

**Relations.** Holdon trades with them at Fentene and quarrels with them over the springs; the yeti of the shelf avoid their smoke; Coldor's crown has never taxed them.

### Mp'E and the Castle of Yeldenne

**Land.** A high valley between the Yeldenne Heights and the Isengar Mountains, entered by the Isengar Pass; the nearest water is the head of the northern bay, the proposed **Landing below Mp'E** (`site_yeldenne_landing`) [GM]. The model calls it "the sheltered Isengar valley", one of the few inhabited places of the north [GM region_cold_lands].

**People and rule.** Horos, a Great Spirit and enormous armoured knight, is lord of the castle; Glo is his crystalline heart [V: Castle of Yeldenne and Glo]. Who else lives in the castle is open [WB §5 Yeldenne]. Below it lies an ordinary small town of Coldic-speaking herders and charcoal-burners (the drawn **Hul'…**, proposed) with its own headman and the custom of leaving bread at the start of the Silent Road (proposed). The valley pays no tax to Melkgard or Coldor; both let it be because its people say the hall's lord kills those who come too close, which the owner's Horos card also says [BC 25]. The card's name for his castle is Tolkien-derived and is not used [OD]; the card's statement that the castle lies underground is read as a hall cut into the mountain beneath the castle (proposed).

**After the hall.** On the historical path Afrit's party reaches the hall first and Horos dies in 4A 1753 [V: Castle of Yeldenne and Glo]; a Warden of Mp'E then leads the realm [MS yeldenne_and_glo]. The vault's statement that "Zol eventually crushes Horos's sword in battle" [V: Castle of Yeldenne and Glo] is superseded by the owner's ruling that Zol does not appear in the War of the Last Crowns and that his most loyal servant, Edvoid (name to be replaced), appears instead [HO §2.4; OD]; the Zol's Mistake dossier carries the consequence.

### The Yeti Lands and Ghaahu

**Land.** The drawing names two yeti countries far apart: the **Yeti Lands**, a pale shelf of low snowy hills south of the Coldor Mountains across the Coldor Channel, with the **Yeti Shallows** along the coast toward the neck (`hills_yeti_lands` [GM]; [NT]), and the drawn **North Yeti Lands**, a snow plain among the Cold Mountains in the north-east (`ice_north_yeti_lands` [GM]). Today one country holds both [RO Yeti Lands].

**People (proposed).** One people with one sung speech, in two song-lines that rarely meet. The **shelf clans**, who call their land *Haruhu* ("coast-country" in Yeti Speech [LG §3.22]), hunt seal and walrus on the Yeti Shallows and trade at the snowline fair of Fentene. The **height clans**, *Ghaahu* ("high country"), follow wild herds through the Cold Mountains and are almost never seen by men. The yeti believe the mountain hums and must be answered at dusk (the Hum [WB §4]); a clan with no hum is lost. Their eldest sings the clans' names at the Eldest's Fire [FT regional_yeti_lands]. Their rank and origin are open [V: Peoples of Aoaz].

**Proposal:** two realms, the **Yeti Lands** (vault name kept) and **Ghaahu** (former label North Yeti Lands, renamed because it only repeats its neighbour's name [OD]).

### Nivaros (former label Titanos)

**Land.** The heights and glacier plain of the far north-west (`range_titanos_heights`, proposed name Nivaros Heights) [GM; DM settlements Xitore].

**People.** The ice giants of the drawn Titanos are established [V: Peoples of Aoaz]; the name echoes the Titans of Greek myth and is replaced [OD] by **Nivaros**, Giants' Speech *nivar* "snow" + *-os* "seat" [LG §3.21]. Proposed: about 3,000 giants who live long and name late, hunt seal and caribou, and keep a **Frost-King** chosen by the cairn-keepers on a throne of ice at Xitore [WB §3.6]. The Cairn-Faith leaves one stone for each year of a giant's life [WB §4]. The giants charge a toll in meat or iron on the herd roads through their heights [FT regional_titanos]. Their speech is kin to that of the giants of **Hirolon**, the sovereign giant kingdom of the Middle Lands [OD], which explains the shared root *oron* "giant" [LG §3.21]. The vault's "Forgotten Giants", whose place is open [V: Peoples of Aoaz], are not placed here.

### The Vindael arm (former label Windwaith)

**Land.** A long snow arm reaching south-west off the Cold Lands, an island in the model joined to the mainland only by winter ice (`ice_windwaith`, `land_island_001`, `region_windwaith`): arctic, wind-scoured, plains 80%, no fertility, sparse tribes [GM]. **Name:** "Windwaith" is built on "-waith" and is replaced [OD] by **Vindael**, Coldic *vind* "wind" + *ael* "island": the wind-isle, which is what the model says it is.

**People.** The Vindael seafarers (proposed culture [WB §3.1]): pilots, whalers and sealers who live in a few harbour towns on the sheltered southern shore. A council of captains elects a Speaker (proposed). The regional tree gives them the carrying trade, a Harbour Compact or free harbours, hulls for the West and a coast watch [FT regional_windwaith]. With about 40,000 people the carrying trade is a whaling and freight fleet of perhaps sixty hulls, not a great sea power (proposed).

## 11. Roster proposal

**Proposed.** Twenty realms where the roster has thirty-one. The reduction removes one-valley clan realms that differ only in name, keeps every working-table power and every people with its own life, and adds two realms (Ghaahu and the goblin valley of Glimkit). Names from other fiction or myth and "-waith" names are replaced directly [OD].

| Realm (local name) | People and culture | Political form | Capital | Approximate extent | Why it exists |
| --- | --- | --- | --- | --- | --- |
| **Coldor** | men, Winter-Crown folk | crown (the Winter Crown) | Fandanar | the Fandan valley, the Frozen Lands of Coldor, the Hendair Hills, the west coast with Alorio | Working great power [V: Great Powers and Relations]; "the frozen interior and the western ports" requires the west coast. |
| **Melkgard** (former label Isengard, a Tolkien name) | men, Melkgard warlords | warlord march of oath-companies | Minnolomak | the Isengar valley's eastern side, the north coast to the Gulf of Minnolomak | Working rival of Coldor [V: Great Powers and Relations]. Coldic *melk* "black" + *gard* "stronghold": the black-stone forts. |
| **Horidor** | men, ice clans | clan moot; Accord member | Ollondo | the lower Fandan, the Neridor Gap, the Neridor Mountains | Working ally of Coldor [V: Great Powers and Relations]; keeper of the Gap. |
| **Fearno** | men, ice clans | hall of many lords (the Free Steadings) | Azenoalion | the eastern interior moors and the Naepu River | The largest free realm and the third pole [FT regional_fearno]. |
| **Austklev** (former label Wonderland, a name from other fiction) | men, ice clans | coastal jarldom | Vaestia | the east coast, its forest and the cape (former Wonderland Point, now Austklev Point) | Coldic *aust* "east" + *klev* "cliff"; whalers and timber facing the Siroler Seas. |
| **Worlond** | men, ice clans | forest lordship | a forest town (proposed *Tarvak*, Coldic "forest-place") | the Worlond Forest on the neck | Timber of the north; a stage of the Neck Road. |
| **Poloto** | men, coast folk | free port under its harbour guild | Fandhavn (proposed) | the Poloto plain and Poloto Head | The vault's "free towns of the coast" [V: The Campaign of 4A 1748]; the Fandan mouth. |
| **Holdon** | men, ice clans | coast kingdom | Fentene | the south coast facing the Coldor Channel | The snowline fair; trade with yeti and goblins. |
| **Glimkit** | goblins, with hobgoblins | warren-valley under a hobgoblin chief | Glimkit | the warm-spring valleys of the Coldor Mountains (the drawn glens Agoron and Belor) | Owner decision on goblins in sheltered southern valleys [OD]. |
| **Xison** | men, ice clans | road league of upland clans | Akahew | the uplands between Fandanar and the west coast | Traders of the high road. |
| **Pertolor** | men, ice clans | herders' valley lordship | a vale town | the sheep vale and the plain east of Melkgard (former label Londor, a name from other fiction, now *Faaennar*, Coldic "field-place") | A clan realm both crowns court. |
| **Omar** | men, ice clans | single clan | a hill-fort | the border moor between Melkgard and Mp'E | Melkgard's nearest neighbour and the clan most often pressed. |
| **Portogalor** | men, ice clans | sealers' coast | a harbour on the north coast | the north coast and the Olsuaon Massif | Sealing and the Frozen Ocean trade. |
| **Celen** | men, reindeer clans | herding confederacy | Esrom | the far north-west moors and the giants' foothills | The tribes who nurse Eindil (proposed). |
| **Orewele** | men, ice clans, with a dwarf factor-house | mining clan | Guerlon | the Orewell lowland | The iron of the far north, sold to the western dwarves. |
| **Nivaros** (former label Titanos, a name of Greek myth) | giants, ice giants | Frost-King's court | Xitore | the Nivaros Heights | Established people [V: Peoples of Aoaz]. |
| **Yeti Lands** (*Haruhu*) | yeti, shelf clans | clan web under the Eldest's song | the largest cave-gathering (proposed) | the southern shelf and the Yeti Shallows | Established [V: Aoaz and Its Regions]. |
| **Ghaahu** (former label North Yeti Lands, repetitive) | yeti, height clans | clan web | a hum-cave (proposed) | the snow plain among the Cold Mountains | A separate yeti land with a different life. |
| **Yeldenne** | Horos (Great Spirit); a small town of men | guardian's domain | the town of Mp'E (drawn **Hul'…**); the castle is a site | the valley of Mp'E | Established [V: Castle of Yeldenne and Glo]; decision L2 [HO §5.1]. |
| **Vindael** (former label Windwaith, a "-waith" name) | men, Vindael seafarers | harbour council | Porideon | the Vindael ice arm | Established arm [V: Aoaz and Its Regions], renamed. |

**Comparison with the current roster (31 rows, tags Y01 to Y8H [RO]).**

| Current row | Fate (proposed) | Why |
| --- | --- | --- |
| Y01 Coldor | kept, enlarged | Takes the western ports and the Hendair hills. |
| Y1Q Greenle (Alorio) | merged into Coldor | Coldor rules "the western ports" [V: Great Powers and Relations]; Harbour-Master Alorio Siul already serves Coldor [Characters spec]. |
| Y1P Felkond | merged into Coldor | A river crossing on Coldor's western road. |
| Y1U Hendair | merged into Coldor | Chancellor Essen Hendair is a Coldor courtier [Characters spec]. |
| Y1V Agoron, Y1W Belor | merged into the new Glimkit | Tiny glens at the Coldor Mountains [NT]: the goblins' warm valleys. |
| Y02 Isengard | kept, renamed Melkgard | Tolkien name. |
| Y03 Horidor | kept, enlarged | Takes the Neridor Gap. |
| Y22 Neridor | merged into Horidor | The drawn Ollondo, Horidor's capital, stands beside the Neridor label [NT]. |
| Y21 Fearno | kept, enlarged | |
| Y20 Naepu | merged into Fearno | Fearno's capital Azenoalion lies on the Naepu [NT]. |
| Y06 Wonderland | kept, renamed Austklev | Name from other fiction. |
| Y24 Worlond | kept | |
| Y25 Hozoson | merged into Worlond | A glen of the forest belt. |
| Y23 Poloto | kept, form changed | A free port, not a clan realm. |
| Y05 Holdon | kept | Gains the snowline fair at Fentene, today the Yeti Lands' capital. |
| Y1T Xison | kept, enlarged | |
| Y1S Rion, Y1R Yeneldmore | merged into Xison | Moor and valley clans of the same road. |
| Y1Y Pertolor | kept, enlarged | |
| Y1Z Londor | merged into Pertolor, renamed Faaennar | Name from other fiction (*Dark Souls*). |
| Y1O Omar | kept | |
| Y1N Portogalor | kept | |
| Y1I Celen | kept, enlarged | |
| Y1K Radeon, Y1M Gaadon | merged into Celen | Clans of the same herds. |
| Y1L Orewele | kept | Gains a dwarf factor-house (proposed). |
| Y1J Titanos | kept, renamed Nivaros | Name of Greek myth. |
| Y1X Yeti Lands | split | The southern shelf stays the Yeti Lands; the north-east becomes Ghaahu. |
| Y04 Windwaith | kept, renamed Vindael, population cut | "-waith" name. |
| Y8H Yeldenne | kept, capital changed | The valley town becomes the capital; the castle a site. |

## 12. Gameplay role

**Mechanics already specified** [MS cold_lands]: the defiance of Melkgard (spec name: Isengard), the Accord's reach and the three ways to settle the rivalry (the Open Hand, the Iron Hand and the war that makes Melkgard kneel); the clans' lean and the winter moots; the Long Winters with bread as political power; the old pacts with the yeti and the giants; the far north-west and the journey's hooks; Mp'E and the silent castle; the Neck Road and timber for the West; the three courses in the final war (stand apart, timber and ships for the West, the White Companies). Glo, Horos and the hall belong to [MS yeldenne_and_glo]; Eindil's stages to the journey spec. The specs and focus files still use the former labels; renaming them follows the owner's decisions.

**Additions this dossier proposes:**

- **The granaries.** Coldor's bread-power as a store filled by western grain bought with iron and timber; a closed Neck Road or a western war empties the store and weakens the crown's lean in the next hard winter.
- **The snowline fair** at Fentene: a yearly event where Holdon, Coldor, the yeti and the goblins trade; a good fair raises the yeti pact, a raid on it breaks the pact.
- **The warm valleys.** Glimkit's springs and lamp-oil are worth guarding; a crown that protects them gains goblin traps and lamps (small bonuses to forts and night fighting), a crown that seizes them gains an unruly warren; in a bitter winter, clans may seek shelter in the valleys and test the goblins' patience.
- **The Orewell iron.** The western dwarves' factors buy Orewell ore; Melkgard and Coldor bid for the mines, and a Melkgard that holds them gains defiance.
- **The two yeti peoples.** The shelf clans can be courted; the height clans of Ghaahu cannot be reached until a shelf eldest vouches for an envoy.
- **The sealing and whaling seasons** for Vindael, Portogalor and Austklev.
- **Divergence hooks:** a Celen chief who does not trust the stranger; Coldor's guides saving Eindil's crew (already a human-only divergence in the spec); Melkgard's warlord selling the Isengar Pass to the temple party; the Warden of Mp'E calling the valley's men to guard the empty hall.

**Focus-tree themes.** Coldor: court, granaries, ports, the Accord, Melkgard, the old peoples, the silent castle, the far ice, the final war [FT coldor]. Melkgard: forts, gifts to the steadings, never to kneel or a seat at the Accord [FT regional_isengard]. Fearno: the Free Steadings. Vindael: carrying trade and the coast watch. Nivaros and the yeti: open or closed to every crown. Glimkit (new, proposed): the springs, the lamp-trade, the bone-hound riders, a valley closed or opened to one crown.

**AI behaviour (proposed).** Coldor feeds the clans in hard winters and courts Melkgard by the Iron Hand on the historical path; Melkgard spends gifts on its bordering clans and never asks for the Accord while defiance is above 30; the yeti and giants accept truces at moderate lean and close their lands if attacked; Glimkit never leaves its valleys and joins no faction; Vindael signs a Harbour Compact only when Coldor's lean is positive [MS cold_lands, AI].

## 13. Questions for the owner

1. **Population.** May the Cold Lands be revised from 10.5 million to about 2.5 million (the Vindael arm from 742,000 to about 40,000, the yeti from 272,000 to about 40,000, the ice giants from 59,400 to about 3,000)? The reasoning is in section 3; it moves about 8 million people out of the world total.
2. **The town of Mp'E.** The drawn town beside Mp'E reads "Hul'…" and is hidden by a seam [NT]. What is its full name?
3. **The Path to Erdae.** Is the route note a real sea-ice crossing that people of the far north use, or only a legend [HO §3]?
4. **The lands beyond the edge.** Are Grindok, Essenus, Azlen, Prorough, the Luria Ice Lands and the other cropped labels [NT] beyond the known world (proposed: songs and traders' tales only), or should the map include them?
5. **The Cold Lands and Dardan.** The vault does not list the Cold Lands among the Grand Alliance's peoples [V: The First Age of Aoaz §5]. Did any Cold Lands realm fight against Volgan?

## 14. Sources

Citation keys used in this dossier:

- **[OD]** owner decisions of 24 October 2026, relayed by the coordinator: renaming of ill-fitting labels; no "-waith" names; names from other fiction or myth replaced directly; Hirolon a sovereign giant kingdom; goblins in sheltered southern Cold Lands valleys; dwarves in the great ranges of the West and North Lands and the Great Wall range; the hobgoblin king and Smash rule their own realms only; Kusven is Zol's most loyal servant who appears in the War of the Last Crowns; no exact ages; twelve main New Gods answering the twelve needs of mortals, and lesser New Gods.
- **[V: note §heading]** lore vault `docs/lore/vault/`: `05 - Geography/Aoaz and Its Regions.md`; `04 - Peoples/Peoples of Aoaz.md`; `04 - Peoples/The Ainu.md`; `06 - Politics/Great Powers and Relations.md`; `07 - History/Fourth Age Chronology.md` §I to §V; `07 - History/The Campaign of 4A 1748.md`; `07 - History/Timeline.md`; `07 - History/The First Age of Aoaz.md` §2, §5; `07 - History/The Second Age of Aoaz.md` §I; `07 - History/The Third Age of Aoaz.md`; `07 - History/The Fourth Age of Aoaz.md`; `07 - History/Fourth Age Canon Register.md`; `03 - Figures/Eindil.md`, `Horos.md`, `Glernaen.md`; `08 - Artifacts/Castle of Yeldenne and Glo.md`; `01 - Cosmology/New Gods.md`; `01 - Cosmology/Religious Knowledge and False Gods.md`; `02 - Spirits/Spirit Natures.md`; `09 - Development/Open Questions.md`.
- **[HO §n]** `docs/zin-handoff/01-CONTEXT-AND-CANON.md` (§2.4 Zol does not appear; §3 the wider world; §5.1 decisions L1 to L3).
- **[GM id]** `tools/content/data/geography/aoaz.json`; spec `docs/specs/01_map/05_geography_model.md`.
- **[NT]** `docs/name_table.md`, `tools/content/data/labels.json`; the Path to Erdae row also in `docs/lore/names_traceability.md`.
- **[RO]** `tools/content/data/countries.json` (scan "Cold Lands").
- **[DM]** `docs/specs/02_lore/07_demography_and_settlement.md` §1, §4 and `tools/content/data/world/demography.json`.
- **[WB §n]** `docs/specs/02_lore/05_world_bible.md` (§2, §3.1, §3.6, §3.7, §4, §5, §6.3, §7).
- **[LG §n]** `docs/specs/02_lore/06_languages.md` (§1, §3.7 Coldic, §3.19 Goblin Cant, §3.21 Giants' Speech, §3.22 Yeti Speech, §5, §7) and `tools/content/data/world/languages.json`.
- **[SS]** `docs/specs/02_lore/01_start_situation.md` (Cold Lands; Relations at the start).
- **[EC]** `docs/specs/03_gameplay/02_economy.md` (region resource table).
- **[MS file §n]** `docs/specs/04_mechanics/cold_lands.md`, `yeldenne_and_glo.md`.
- **[FT file]** `docs/design/focus/coldor.json`, `regional_isengard.json`, `regional_horidor.json`, `regional_fearno.json`, `regional_windwaith.json`, `regional_titanos.json`, `regional_yeti_lands.json`, `regional_yeldenne.json`, `shared_cold_lands.json`.
- **[BC n]** `docs/lore/sources/bestiary_cards_part1.md` and `bestiary_cards_part2.md`, card index n (12 sea serpent, 15 warg, 25 Horos, 29 hobgoblin, 36 goblin, 44 dwarf).
- **[Characters spec]** `docs/specs/02_lore/02_characters.md`.
