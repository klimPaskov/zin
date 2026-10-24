# The West Lands

**Requirement:** R-19 regional dossier. **Status:** draft for owner review, 24 October 2026; owner decisions of 24 October 2026 applied. **Region key:** `west_lands` in the geography model; roster scan "West-Earth" (the drawing headed NORTH EARTH).

**How to read this dossier.** **Established** means the lore vault or an owner ruling says it, with the source in brackets. **Working** means the vault's working political table or the drawn map. **Proposed** means new here or in an earlier spec, and replaceable. Citation keys are in section 14. **Owner decisions of 24 October 2026** [OD] are treated as established: names built on "-waith" and names from other fiction or myth are replaced directly (the old label kept as former label); dwarves hold the great ranges of the West and North Lands and the Great Wall range; the small folk get an original people name and homeland; gunpowder weapons are common in some realms; no exact age of any being is stated.

## 1. Overview

South of the Cold Lands, joined to them by a broad mountain neck, the West Lands are a wet, green, crowded country of downs, river plains, dark forest, hard mountains and long peninsulas facing a sea so wide that Aenor has never been able to rule it for long [V: Aoaz and Its Regions; V: Fourth Age Map of Aoaz]. The West already had peoples and kingdoms when Aenor's First Age settlers came, and the wars that followed are remembered in every western court [V: The First Age of Aoaz §2]. In 4A 1748 the clan kingdom of **Gunwyn** (former label Gunwaith) and the river wardens of Girdon keep an uneasy truce after half a century of border war, the guild ports of Kradlon and Corogon grumble at Aenoran tariffs, the companies of Buldor sell their swords and their gunners to anyone, and the dwarves of the western ranges dig gold and forge guns in halls no man may enter uninvited [OD]. In sheltered corners live peoples the southern charts never drew: the small folk of the **Bykkwyn** in their green vale behind guarded passes, and hidden gnome villages in the deep wood (both proposed). Within seven years these quarrelling courts will cross the sea together and take Parim (established outcome, proposed timing [V: The Campaign of 4A 1748]).

## 2. Physical character

### Terrain, relief and ranges

Lowland at elevation 1 with forested uplands at 2 and short ranges at 4; terrain shares plains 38%, forest 36%, hills 12%, mountain 8%, marsh 3%, towns 3%; snow share 0.04 [GM region_west_lands].

- The **Herlitz Mountains** (`range_herlitz`, long) form the west spine of the Kradlon Peninsula and continue south-west as the dry, bare **Dusty Mountains** (`range_dusty`): the West's greatest range and the first dwarf country [GM; OD].
- The **Fog and Eye Mountains** (`range_fog_eye`) cross the land west to east south of Girdon and divide the Girdon plain from Buldor; the proposed **Fog Gap** (`pass_fog_gap`) carries the road [GM].
- The **Bolpor and Boldor Mountains** (`range_bolpor_boldor`) form the east flank of the Kulolo valley and fall to the Blue Sea: the second dwarf country [GM; OD].
- Small ranges: the **Erg Mountains** (`range_erg`) at the tip of Gunwyn's western finger; the **Black Hills** (`range_black_hills`) at Kradlon's south-west tip; the olive-brown **Corogon Highlands** (`range_corogon_hills`) [GM]; the drawn North Mountain, South Mountain, Soot Hills and Ergo heights [NT].
- In the north the **Neridor Mountains** and the **Worlond Forest** belt divide the West from the Cold Lands; the **Neck Road** is the only road [GM pass_neck_road].

Open land: the proposed **Gunwyn Downs** (`plain_gunwaith`) north of the Grey River; the drawn **Thenon** olive lowland (`plain_thenon`); and the drawn **Ronbo Grasslands** (`plain_ronbo_grasslands`) below the Herlitz range [GM].

Forest: the proposed **West Wood** (`forest_west_wood`), the great dark forest block holding the drawn Girdon and Buldor woods, the **Cologon Forest** (`forest_cologon`, reading may be "Corogon"), the wet **Swamp Forests** (`forest_swamp`) on the Herlitz foothills and the **North Forests**, its north-east lobe [GM; NT].

Peninsulas: the long south-west tail of the **Kradlon Peninsula** (`peninsula_kradlon`); the **Corogon Peninsula** (`peninsula_corogon`) south-east of Buldor; the curled **Varnondor Peninsula** (`peninsula_varnondor`), a separate land in the model's silhouette (`land_island_002`) [GM].

### Climate and seasons

Cool temperate and wet, with mild summers and cold wet winters; snow only near the neck [GM region_west_lands; V: Aoaz and Its Regions]. Proposed: rain comes off the Crown Ocean and the Blue Sea, so the eastern slopes are wettest and the Dusty Mountains, in the rain shadow of the Herlitz range, are the dry corner of the West. Thenon's olive lowland, the Ronbo basin and the Corogon Highlands are the warmest ground (proposed, from the drawn colours [GM plain_thenon; GM range_corogon_hills]). Seasonal customs are dated by flood, harvest and the closing of the Neck Road, not by month names, which are to follow the twelve main New Gods [V: New Gods; OD].

### Water

- **Rivers:** the drawn **Kulolo River** (`river_kulolo`), between the Bolpor and Boldor ranges, ending in the Ilurdor lagoon, the line between Girdon and Saopon; the proposed **Grey River** (`river_grey`), the border of Gunwyn and Girdon, crossed at the proposed **Grey Ford** (`pass_grey_ford`) where the Neck Road meets the Kulolo road; the proposed **Ronbo Water** (`river_hky`) to the Kradlon Ocean [GM].
- **Lakes called seas:** the drawn **Ergo Sea** (`lake_ergo_sea`), an inland lake of the Girdon highlands fed by the Kulolo, and the drawn **Ilurdor Sea** (`lake_ilurdor`), a lagoon at the Kulolo's mouth [GM]. The West calls any water too wide to shout across a "sea" (proposed usage), which is why the drawn names are kept.
- **Marsh:** the drawn **Papz Swamp** (`marsh_papz`, reading uncertain) on the Corogon Peninsula and the proposed **Kulolo Fen** (`marsh_kulolo_fen`) [GM].
- **Seas, one name each:** the **Blue Sea** (`sea_blue_sea`) between the West's east coast and the central sea; the **Crown Ocean** (`sea_crown_ocean`, proposed name for the wide central sea, drawn "Rush Ocean", superseded); the **Kradlon Ocean** (`sea_kradlon_ocean`) in the bay between the Kradlon and Corogon peninsulas and south of it; the **Norrai Ocean** (`sea_tritons_ocean`, former label Triton's Ocean, a name of Greek myth [OD]) to the north-west [GM]. The model also proposes a **Bay of Kradlon** (`bay_kradlon`) for "the drawn Kradlon Ocean": the same water named twice. Proposed: keep the drawn Kradlon Ocean and drop the Bay of Kradlon.
- **Strait:** the proposed **Corogon Narrows** (`strait_corogon`) between the Corogon and Varnondor peninsulas, about 40 pixels across [GM].

### Hazards

Spring floods on the Kulolo and the Grey River (the river wardens' whole calling); fog in the Fog and Eye range and on the Ilurdor lagoon; fever in the Papz Swamp and the Kulolo Fen; winter closing the Neck Road; autumn gales on the Kradlon Ocean; rockfalls and the dwarves' closed doors in the high ranges; and the wide crossing to Aenor, which the owner made "much larger" so that direct rule from the Middle Lands has always failed [V: Fourth Age Map of Aoaz] (all hazards proposed except the sea's width).

## 3. Inhabitants

### Peoples, cultures and languages

| People | Culture | Language | Where | Status |
| --- | --- | --- | --- | --- |
| Men | Gunwyn clans | Gunwyn, hill dialect | Gunwyn, Werlendor, Lambin, Thenon | people established ("Gunwaith clans" [V: Peoples of Aoaz], renamed [OD]); culture proposed [WB §3.1] |
| Men | Girdon wardens | Gunwyn, river dialect | Girdon, Wennarith, the Kulolo | "Girdon wardens" established [V: Peoples of Aoaz] |
| Men | Western guildmen | Gunwyn, guild dialect (Aenoran loan-words for law and trade) | Kradlon, Corogon, Saopon | proposed [WB §3.1] |
| Men | Buldor companies | Gunwyn, company cant | Buldor and its barracks-towns | "Buldor companies" established [V: Peoples of Aoaz] |
| Men | Aenoran merchants | Aenoran | guild-town quarters | proposed minority [DM minorities] |
| Dwarves | the western holds (own name unwritten) | Dwarvish (reserved, unwritten [LG §2]); Gunwyn with men | the Herlitz and Dusty Mountains; the Bolpor and Boldor Mountains | owner decision on dwarven homelands [OD]; holds proposed |
| Small folk | the **Bykkwyn** (proposed people name) | their own hearth-speech (unwritten) and Gunwyn | **Dolw-Grewn** (proposed homeland; former label Hky) | card [BC 32]; owner decision [OD] |
| Gnomes | not named | unwritten | Olodor in the North Forests (proposed) | card [BC 38] |
| Gwilid (former card name Gektor) | a wizard of unknown kind (drawn as a green one-eyed creature) | — | Sempos in Corogon (card reading uncertain) | card [BC 57; HO §4.3] |

The western men speak **Gunwyn** (the languages spec's "Gunwaithic", renamed with the kingdom [OD]), a Boreal tongue kin to Coldic and Tritonic and unrelated to Aenor's Ainic speech (proposed [LG §1, §3.8]): noun first, adjective after, joined by a hyphen (Chalwe-Gwit, "White Hall"), with gw, ch and a soft th. **No "waith" names.** The owner has ruled that names built on "-waith" read as borrowed [OD]; the West's chief kingdom is renamed **Gunwyn**, "the folk of Gun" (*gun-*, the old clan name, open in meaning [LG §3.8], + *-wyn* "the folk of"), and the chart ending that Aenor's First Age ships once stamped on shores is retired everywhere. The guild dialect is full of Aenoran law-words because the guild ports grew where Aenoran ships first traded [WB §3.1 Western Guildmen]; that is the West's one shared vocabulary with Aenor, explained by contact.

### Population

The model gives **8.2 million** in 21 countries and 86 states, urban share 17%, largest city 70,000 [DM regions]. The density note (20 to 35 per square kilometre on temperate hills and river plains [DM §4 West Lands]) agrees with the land, and this dossier keeps the regional total. It changes the distribution: the model gives every one-state guild town exactly 108,000 people [DM countries], which follows a formula, not the land. Proposed (living people): Gunwyn 1.45 M; Corogon with Sobre and Forbo 0.95 M; Lambin 0.85 M; Kradlon 0.75 M; Varnondor with Oslinod and Trilino 0.65 M; Buldor with Toples and Sarudon 0.62 M; Girdon with Lothoro 0.60 M; Wennarith with Pernogon 0.60 M; Werlendor 0.55 M; Saopon with Canako 0.50 M; Thenon 0.40 M; Dolw-Grewn about 0.12 M (small folk, with a few thousand men of the Watch); the dwarf holds about 70,000 (Chalwe-Brenn 40,000, Garth-Stenn 30,000; proposed); Olodor perhaps 6,000 gnomes (proposed). Total about 8.1 M.

### Where they live and why

The **Girdon plain** and the **Kulolo valley** are the breadbasket: alluvial fields, fords and bridge-towns (proposed, from the model's fertility list [GM region_west_lands]). The **Gunwyn Downs** carry cattle and oats on rolling downs (proposed). The **Corogon coast** and the **Kradlon peninsula** hold the guild ports that look across the Crown Ocean and the Kradlon Ocean. The **West Wood** is thinly peopled: woodcutters, charcoal-burners, the hidden gnomes and the outlaws the wardens hunt. The **Ronbo basin** below the Herlitz range feeds horses and, in the sheltered vale of Dolw-Grewn, the small folk's farms. The dwarves live inside the **Herlitz–Dusty** and **Bolpor–Boldor** ranges, where the gold, the gems and the hard stone are (proposed, from the dwarf card [BC 44]).

## 4. Livelihoods and resources

The economy spec weights the West Lands at iron 2, timber 2, horses 3, stone 1, gold 0, essence 0, grain 2, development 0.40: "horses, freeholds and mercenary companies" [EC].

| Resource | Where and why (proposed unless marked) |
| --- | --- |
| Horses | The Ronbo Grasslands and the Lothoro valley breed the West's horses; Gunwyn's light riders descend from chariot-clans [WB §3.1]. |
| Grain | The Girdon plain, the Kulolo valley and Lambin's downs; Lambin's granaries make it the West's neutral ground [FT regional_lambin]; grain goes north over the Neck Road to Coldor's stores. |
| Iron | Bog-iron of the Swamp Forests; the dwarves' deep ore of the Bolpor and Boldor Mountains; the sword-smiths of Gunwyn. |
| Timber | The West Wood and the Cologon Forest; the oak of the Varnondor capes builds the hulls of the Crossing [MS western_crossing §6]. |
| Stone | The Fog and Eye range for Girdon's bridge-towns; dwarf-cut stone for the guild halls. |
| Gold | **Proposed change:** the dwarf card says dwarves dig mountains for gold and precious stones [BC 44], and the owner places dwarves in the West's great ranges [OD]; this dossier proposes a small gold weight (1) for the West Lands from the dwarf mines of the Herlitz and Dusty Mountains, where the economy table has 0 [EC]. The gnomes of Olodor also dig gold, but keep it hidden [BC 38]. |
| Essence | None. Gwilid of Corogon trades in "magic stones" whose source the card does not give [BC 57]. |

Other livelihoods: cattle and wool on the downs; cloth, dye (Sarudon), glass, books and ships in the guild ports [WB §3.1]; tolls at fords, bridges and the Fog Gap; mercenary service (Buldor); fishing in the Kradlon Ocean and the Ilurdor lagoon; olives and wine in Thenon and the Corogon Highlands; the small folk's grain and smoking-leaf (proposed). **Powder-guns** (owner: gunpowder weapons are common in some realms [OD]): proposed, the dwarf holds and Kradlon's guild workshops make handguns and bombards; Buldor's companies hire out gunners; Gunwyn's clans despise guns as unfit for oath-bound fighting. Saltpetre is dug in the dry Dusty Mountains (proposed).

## 5. Institutions and political forms

- **Clan kingship** (Gunwyn, Werlendor, Thenon; proposed [WB §3.1]): a king acclaimed at a standing stone and bound by the **Lawspeaker**, judge and priest at once; the clan chiefs hold the real power; inheritance by the clan moot among the king's kin; oath-law and wergild. The Lawspeaker's law is the one Eindil submits to in Gunwyn (proposed episode [V: Fourth Age Chronology §V]).
- **The river wardens** (Girdon, Wennarith; proposed [WB §3.1]): a Warden-Speaker chosen by the ford-wardens, who are magistrates; land held by ford-share; a river-court.
- **Guild leagues** (Kradlon, Saopon) and **the consulate of Corogon** (proposed [WB §3.1; FT regional_corogon]): guild councils elect a First Guildsman or Consul; law is the guild book.
- **The Buldor companies** (proposed [WB §3.1]): company-lords elect a Captain-General; law is the contract-book; a fallen banner ends a company.
- **The capes kingdom of Varnondor** (proposed [FT regional_varnondor]): a king whose lanterns and sea watch guard the approaches the old Aenoran fleets used.
- **Lambin's downs lordship** (proposed): a lord whose granaries make Lambin the neutral ground where feuding courts meet.
- **The dwarf holds** (proposed, from the dwarf card [BC 44]): each hold is ruled from its deepest hall by a lord of the eldest delving line; dwarves are proud and quarrelsome, fight with axes and hammers and never with bows, wear their beards long, and dislike elves. Men trade with them only at the hold's outer gate.
- **The Bykkwyn of Dolw-Grewn** (proposed): family farms under a moot of the eldest householders; their passes kept by a sworn company of men, the **Ronbo Watch**, bound at a standing stone and paid in grain and leaf, while the dwarves of Chalwe-Brenn keep the high passes above them closed. These are the card's "guards" who keep evil out [BC 32].
- **The gnome villages of Olodor** (proposed, from the card [BC 38]): every village has one king, whose work is to lead and to crown those gnomes who have filled their pot with gold; the villages are hidden and deal with men only through gifts.
- **Common western institutions** (proposed): the **Ford Council**, the moot of western courts that the Western Crossing spec convenes [MS western_crossing §4]; the Truce of the Grey Ford of 4A 1745 [V: Fourth Age Chronology §IV]; and the **Charter of Free Banners**, Edran's First Age promise that western rulers fight under their own banners (proposed name [V: The First Age of Aoaz §5]), still quoted in western courts.

## 6. Beliefs and faiths

**What people believe** (proposed [WB §4]):

- **The Standing Stones** (Gunwyn, Girdon, Buldor): an oath sworn at a standing stone binds the stone, the swearer and the clan; the Lawspeaker remembers every oath. Holy sites: the **Stone of the Grey Ford** and the **Oath-Ring of Gunwyn**.
- **The River Wardens' Rite** (Girdon, Wennarith): each river has a keeper spirit; the wardens feed it a loaf at the flood and keep the ford clear. Mortals may mistake a Lesser Spirit for a god [V: Religious Knowledge and False Gods]; whether a river keeper exists is not stated.
- **The Guild Halls** (guild ports): the owner has ruled that twelve main New Gods answer the twelve needs of mortals and that lesser New Gods also exist [OD]; each guild honours the god whose need its craft serves, unnamed because the gods' names are not written [V: New Gods]. Contracts are sworn on the guild book, not on a god.
- **The Banner-Oath** (Buldor): the banner is the company's soul.
- **The Lamp and the Furrow**: household images of the New Gods shared with Aenor [WB §4].
- **The Faith of the Deliverer** is weak and suspect in the West: it is Aenor's god, and the Houses of the First Light keep quarters only in the guild ports where Aenoran merchants live (proposed). When the Deliverer is crowned in Parim, western grudge rises [MS western_crossing §1].
- **The dwarves** keep their rites inside the holds; men know only that a dwarf swears by the stone of his hold (proposed). **The Bykkwyn** keep a hearth-faith of their own that men do not see (proposed); **the gnomes** believe gold freely given brings luck and gold taken brings ill luck [BC 38].

**Truth kept apart from belief.** The Deliverer worshipped in the guild ports is secretly Afrit [V: Afrit's Hidden Council]; no western text says so before the reveal. The stones and rivers have spirits only in belief.

## 7. History

| Date | Status | Event |
| --- | --- | --- |
| Before 1A | established | The West Lands already have inhabitants and kingdoms before Aenoran settlers arrive [V: The First Age of Aoaz §2]. |
| Before 1A | proposed | Boreal-speaking clans hold the downs and rivers; the first standing stones are raised at the fords. The dwarves already hold the Herlitz and Bolpor ranges; the clans know them as the "stone-folk behind the doors". |
| 1A, first half (about 1 to 800, working illustration) | established event, proposed date | Aenoran explorers, colonies, trade stations and claims reach the West Lands and cause repeated wars with the peoples there [V: The First Age of Aoaz §2]. |
| 1A, about 200 | proposed | **The Naming of the Charts.** Aenoran ships chart the coast and stamp chart forms on it (Kradlon, Corogon, Varnondor); the clans keep their own names in song. The western grudge begins with who got to name the coast [WB creative frame 1]. |
| 1A, about 300 to 700 | proposed | **The Settler Wars.** Aenoran colonies at the Kradlon and Corogon harbours fight the clans for the river plains; Girdon's fords become the frontier the wardens are sworn to hold. The dwarves sell arms to both sides and let neither into their halls. |
| 1A, about 800 to 1150 | established direction | Parts of the West Lands resist Aenor's authority as its bad kings weaken it [V: The First Age of Aoaz §3]. Proposed: Gunwyn and Girdon become kingdoms in their own right; the colonies become guild towns that pay no tax to Parim. |
| 1A, late | established | West Lands forces join Edran's Grand Alliance under their own banners; dwarves join the Alliance too [V: The First Age of Aoaz §5]. Proposed: **Taryn of Gunwyn** demands recognition of western independence before joining; **Brunek of the Stone Roads**, the dwarven engineer who holds Dardan's crossings (proposed figure, homeland open in the vault [V: The First Age of Aoaz §5]), comes from the western holds. |
| By 1A 1675 | established | Dardan; the West's grievance survives the victory [V: The First Age of Aoaz §8]. |
| 2A, early | proposed (vault proposed episode) | At the council on guarding the Dead Lands, western rulers insist that Aenor first abandon its claims; no settlement emerges [V: The Second Age of Aoaz]. |
| 2A, middle | proposed | **The Company Age.** Plague and famine empty the southern valleys; landless clansmen form the first sworn companies at Buldor and sell their swords to the guild towns. |
| 2A, late | established direction, proposed detail | Elzon's war turns men, elves and dwarves against each other [V: The Second Age of Aoaz §I]. Proposed: the western dwarves close their doors to men for three generations after a guild town's mercenaries loot a dwarf gate-hall. |
| 2A 2133 | established event | Elzon takes Aenor [V: The Third Age of Aoaz]. Proposed (vault narrative): western kingdoms refuse the royal summons or fight their own campaigns at sea [V: The Second Age of Aoaz]. |
| 3A, 1 to 1260 (proposed length) | proposed | Elzon's Order never crosses the wide sea. The West is free but cut off; Aenoran refugee families settle in the guild ports; the western courts trade with the Pupor Isles and the Cold Lands instead of Aenor. |
| 3A, about 900 | proposed | **The Ronbo Oath.** Clansmen of Thenon and Kradlon swear at a standing stone to guard the passes of Dolw-Grewn, where the Bykkwyn had given them grain in a famine; the Ronbo Watch is born, and the dwarves of Chalwe-Brenn, who trade with the Bykkwyn for leaf and cheese, close the high passes above. |
| 3A, late | proposed | **The first powder.** Dwarf smiths of the Dusty Mountains learn to make a burning powder from the range's saltpetre; within a century Kradlon's workshops buy the secret. |
| 4A 150 to 212 | proposed | Aenoran merchants return to the West for the first time since the First Age wars; western lords accept the trade, not the old claims [V: Fourth Age Chronology §I]. |
| 4A 702 | proposed | The Pupor islanders' charts are sold to every crown [V: Fourth Age Chronology §II]; western pilots learn the island routes. |
| 4A about 1400 | proposed | Aenor's tariffs on western wool and horses begin; Kradlon's guilds pay the heaviest duties [MS western_crossing §1]. |
| 4A 1702 | proposed | The Gunwyn–Girdon wars divide the West; each side courts Aenoran gold and resents it [V: Fourth Age Chronology §III]; Buldor's gunners serve both. |
| 4A 1745 | proposed | Gunwyn and Girdon sign the **Truce of the Grey Ford** after half a century of war [V: Fourth Age Chronology §IV]. |
| 4A 1748 | established start, proposed date | The West is divided and at peace; the truce holds [V: The Campaign of 4A 1748]. |
| 4A 1749 to 1750 | established events, proposed dates and places | Eindil comes south with western travellers; at the **Bridge of the Three Oaths**, **Girdon's Winter Ford** and in **Gunwyn** he keeps the peace (proposed episodes); when the truce breaks, one western confederation makes him its temporary war-king, and he makes peace and lays the title down [V: The Fourth Age of Aoaz; V: Fourth Age Canon Register]. |
| 4A 1751 | established event, proposed date | Eindil's ship for Aenor is driven south by storms to the Islands of the South [V: Fourth Age Chronology §V]. |
| 4A 1755 | established event, proposed date | **The Western Crossing:** western fleets cross the enlarged central ocean; some kings seek revenge for ancient conquests, others want the capital before a weakened Aenor can threaten them again [V: The Fourth Age of Aoaz §IX]. |
| 4A 1756 | established event, proposed date | Western armies occupy Parim [V: War of the Last Crowns]. |
| 4A 1756 to 1757 | established | Zol's dead and Volgan make the occupation impossible; the western fleet evacuates; some soldiers are stranded and later join Eindil's coalition without their kingdoms giving up independence [V: The Fourth Age of Aoaz §IX, §X]. |
| After 4A 1760 | established direction | The West keeps its claims and grievances [V: Fifth Age Seeds]. |

**Where the region can diverge** (play): the truce can hold for ever, break early or end in a decided feud; the West can stay divided, cross for revenge, keep to its own shore or sail to Aenor's relief; a western crown can hold Parim [V: The Campaign of 4A 1748; MS western_crossing §5, §12]; Aenoran gold can buy individual courts out of the Crossing [EC]; the dwarves can sell their guns to the Crossing, to Aenor or to nobody; the Ronbo Watch can fail and open Dolw-Grewn to war (proposed).

## 8. Neighbours and relations

| Neighbour | Relation (proposed unless marked) |
| --- | --- |
| Aenor | The old grudge (opinion "Old Claims Remembered" −15 [SS Relations]); tariffs, Aenoran gold, the memory of conquest [V: The Campaign of 4A 1748]. The crossing runs from the Corogon Narrows and Kradlon toward Aenor Isle [WB §7 trade routes]. |
| Cold Lands | The Neck Road to Fandanar; grain and cattle north, furs, iron and timber south; the western dwarves' factors buy Orewell ore. |
| The Pupor Isles (former label Triton's Islands) | Charts and pilots; Corogon's merchants fear the corsair isles [WB §6.4]; the chart-houses sell to both sides. |
| North Lands | The dwarves of the West and those of the North Lands' great ranges know of each other and trade by sea at rare intervals (proposed). |
| Islands of the South | Far south across the Long Sea; storms carry ships there, as they carry Eindil [V: The Fourth Age of Aoaz]. |
| Within the region | Gunwyn and Girdon under truce ("Truce of the Grey Ford" −10 [SS Relations]); Buldor hired by both; Kradlon and Corogon trade rivals and tariff allies; Lambin the neutral ground; Varnondor the sea watch; the dwarves trade at their gates and trust no court; the Bykkwyn and the gnomes trusted by few and known by fewer. |

## 9. Wildlife and creatures

| Creature | Habitat | Rarity | Effect |
| --- | --- | --- | --- |
| Red deer and boar (proposed; on Gunwyn's arms [WB §3.1]) | the downs and the West Wood | common | Hunting rights are clan rights; boar-hunts are how chiefs show strength. |
| Wolves and brown bears (proposed) | the West Wood, the neck | uncommon | Threats to herds. |
| Ronbo horses (proposed) | the Ronbo Grasslands, Lothoro | herds | The horse resource; western light cavalry. |
| The **ford-pike** of the Kulolo (proposed: a river pike as long as a boat) | deep pools above the fords | rare | Takes dogs and children at the fords; the wardens' loaf at the flood is said to be for the river's keeper, and the pike is said to be its hound. |
| Herons and fen-fowl (proposed) | the Ilurdor lagoon, the Kulolo Fen | common | Fowling feeds the fen towns. |
| Mountain goats and the dwarves' pack-goats (proposed) | the Herlitz and Bolpor ranges | common | The dwarves' beasts of burden on the high paths. |
| Bone-hounds (former card name "warg", replaced [OD]) | none settled | — | The card ties them to orcs and goblins [BC 15]; the West has neither. |

No creature here is a renamed copy of another region's beast. The Vinocorne and the Coniferon belong to the Middle Lands' forest [BC 3; BC 40] and the Corallus to the Middle Lands' waters [BC 65].

## 10. Settlements

| Settlement | Realm | Size (proposed) | Why it stands there |
| --- | --- | --- | --- |
| **Bulligon** | Gunwyn | about 50,000 (model 70,000 [DM settlements]) | Near the Neck Road where it leaves the neck for the downs; the Oath-Ring; seat of the northern crown. |
| **Arligon** | Girdon | about 40,000 [DM settlements] | At the main ford of the Grey River; the bridge-town of the wardens. |
| **Bridge of the Three Oaths** | Gunwyn (north bank) | a bridge-town of about 3,000 | Proposed episode site on the Gunwyn bank of the Grey Ford [GM site_bridge_three_oaths]. |
| **Girdon's Winter Ford** | Girdon (south bank) | a ford-village | Proposed episode site [GM site_winter_ford]. |
| **Bolbin** | Kradlon | about 38,000 [DM settlements] | Guild port on the western sea at the root of the peninsula; gun-workshops (proposed). |
| **Oslodon** | Corogon | about 40,000 | Trading port on the bay facing the central sea; the consuls' hall. |
| **Sempos** (card reading uncertain) | Corogon | a small town | Drawn on Gwilid's card [BC 57]; proposed as a hill-town of the Corogon Highlands where the wizard keeps his books. |
| **Varlibo** and the **Varnondor staging port** | Varnondor | about 20,000 and 6,000 | The royal seat on the plain and the proposed harbour of the Crossing [GM site_varnondor_staging]. |
| **Toples** | Buldor | about 16,000 | Drawn land [NT]; the company capital, a town of toll-houses at the crossroads of the southern roads. |
| **Lochon** (proposed) | Saopon | about 18,000 | Gunwyn *loch* + *-on*: the guild town on the Ilurdor lagoon at the Kulolo's mouth. |
| **Faennon** (proposed) | Lambin | about 18,000 | Gunwyn *faenn* "field" + *-on*: the granary town below the hills. |
| **Datidon** | Wennarith | about 9,000 | Drawn city on the Varnondor peninsula's coast [NT]; the ferry-wardens' town. |
| **Caer-Erg** (proposed) | Werlendor | about 7,000 | "The hill-fort of the Erg" at the Erg spur. |
| **Tummin** (proposed) | Thenon | about 6,000 | "Little hill" in the olive lowland. |
| **Bykkin** (proposed) | Dolw-Grewn | a large village | Gunwyn "little place"; the Bykkwyn's market at the foot of the Ronbo passes. |
| **The Outer Gate of Chalwe-Brenn** (proposed) | Chalwe-Brenn | a gate-hall and market of about 4,000 | Where the Ronbo road meets the Herlitz range; the only place men trade with the dwarves. |
| **The Outer Gate of Garth-Stenn** (proposed) | Garth-Stenn | about 3,000 | Above the Kulolo valley, where dwarf iron and guns go down to Saopon. |

## Sub-regions in depth

### Dolw-Grewn and the Ronbo basin (former label Hky)

**Land.** The drawn land **Hky** lies between Thenon and the **Ronbo Grasslands**, below the Herlitz and Dusty Mountains and the drawn Soot Hills, with the Ronbo Water running south to the Kradlon Ocean [NT; GM plain_ronbo_grasslands; GM river_hky]. Proposed: a warm basin of small fields and orchards, closed on three sides by hills and mountains, reached by two passes. **Name:** the owner has ruled that the small folk get an original homeland name [OD]: **Dolw-Grewn**, Gunwyn "the Green Vale" (*dolw* "valley" + *grewn* "green" [LG §3.8]); Hky is kept as its former label.

**People.** The owner's card describes a small people, about a metre or a little more in height and living somewhat longer than men, who farm in peace, drink and smoke a great deal, rarely wear boots and almost never leave their land, which "evil cannot enter, because these lands are protected by guards" [BC 32]. The card's Tolkien words are replaced [OD]: the people are the **Bykkwyn**, a name they share with the men around them, from the Gunwyn *bykk* "small" + *wyn* "the folk of" [LG §3.8], which the small folk themselves took up long ago; their hearth-names are kept among themselves. Their guards are the **Ronbo Watch** (section 5) and the dwarves who close the high passes. They grow grain and a smoking leaf (proposed: *hearth-leaf*) that they trade only through the Watch and the dwarf gate.

**Why there.** Out of reach of Aenor's ships, off the route of the Gunwyn–Girdon wars, with warm sheltered soil and dwarf neighbours who want leaf and cheese: a place where a people that never leaves can survive.

### The western dwarf holds

**Land.** The **Herlitz and Dusty Mountains**, the long west spine of the Kradlon Peninsula, and the **Bolpor and Boldor Mountains** on the east flank of the Kulolo valley [GM]. The owner places dwarves in the great ranges of the West Lands [OD].

**People (proposed, from the dwarf card [BC 44]).** Dwarves are strong, heavy and about a man's chest high, with proper long beards; they dig the mountains for gold and precious stones; they fight with axes and hammers and never with bows or light weapons; they are often proud and quarrelsome and dislike elves. Their own names and speech are unwritten (Dwarvish is reserved [LG §2]); men call the two holds by Gunwyn names: **Chalwe-Brenn**, "the Mountain Hall", in the Herlitz and Dusty Mountains, and **Garth-Stenn**, "the Stone Fort", in the Bolpor and Boldor Mountains. The card's names for dwarf homelands that come from Tolkien are not used [OD].

**Why they matter.** Gold, gems, deep iron and the West's first powder-guns (proposed); closed doors that no western army has opened; neighbours of the Bykkwyn and of the Kulolo towns.

### The North Forests and Olodor (proposed home of the gnomes)

**Land.** The north-east lobe of the West Wood, the drawn **North Forests**, between the Ergo highlands, the Ergo Sea and the Bolpor Mountains [GM forest_west_wood; NT].

**People.** The gnome card says gnomes live in **Olodor** and **Steadtler**, stand under a metre tall, live for many centuries, build small houses inside trees or in the ground, are always hidden, crown those who fill their pot with gold, dig gold with gnome-miners, keep one king to each village, and return luck for gold freely given and ill luck for gold taken [BC 38]. Proposed: **Olodor** is the gnomes' country in the North Forests; Steadtler is left for the owner to place. The card's word for a crowned gnome comes from Irish folklore and its famous gnome's name from Warcraft; both are replaced [OD]: a crowned gnome is a **Gold-Crown**, and the famous gnome is not used.

### Gwilid of Corogon (former card name Gektor)

The owner's card describes a wizard drawn as a green one-eyed creature with an oar, taller than a man, who collects books, magic stones and ritual things, hires strangers for tasks and pays them in local money, gold or gems, forgets what he meant to do, is friendly, respectful and self-confident, sees very well and fights with a staff that is his second eye; he lives in Corogon, at "[?Sempos?]" [BC 57; HO §4.3]. The card's name is the Estonian form of Hector of Troy and is replaced [OD] by **Gwilid**, the name the people of Corogon give him (Gunwyn stem *gwil* + *-id* [LG §3.8]). Proposed: a famous and slightly absurd figure of the guild ports whom everyone has a story about. **Contradiction:** the card says he often summons Great Spirits and kills them with armies of men, but Great Spirits are the high immortal order whose deaths are rare, age-defining events [BC 57 canon check; V: Spirits and Their Ranks]. He is not Bastian, the famous wizard of men, whose details are undecided [HO §2.5].

## 11. Roster proposal

**Proposed.** Fifteen realms where the roster has twenty-one. The vault's campaign note speaks of "two dozen kingdoms" [V: The Campaign of 4A 1748], a proposed figure; fifteen still crowd the land and each has its own life. Former labels are given where names are replaced [OD].

| Realm (local name) | People and culture | Political form | Capital | Approximate extent | Why it exists |
| --- | --- | --- | --- | --- | --- |
| **Gunwyn** (former label Gunwaith) | men, Gunwyn clans | clan kingship bound by the Lawspeaker | Bulligon | the Gunwyn Downs from the neck to the Grey River | Established kingdom [V: Aoaz and Its Regions], renamed: "-waith" name [OD]. |
| **Werlendor** | men, Gunwyn clans | clan kingship (a rival branch of Gunwyn's royal kin) | Caer-Erg | the Erg finger and the north-west coast | A hill kingdom with its own grievance against Bulligon. |
| **Lambin** | men, Gunwyn clans | downs lordship | Faennon | the eastern downs and their granaries | The neutral ground and the West's granary [FT regional_lambin]. |
| **Thenon** | men, Gunwyn clans | clan kingship | Tummin | the Thenon olive lowland | A warm lowland of olives and cattle. |
| **Dolw-Grewn** (former label Hky) | small folk, the Bykkwyn, with men of the Ronbo Watch | moot of householders under a sworn guard | Bykkin | the Ronbo basin below the Herlitz range | Homeland of the small folk [BC 32; OD]. |
| **Chalwe-Brenn** (Gunwyn exonym) | dwarves | dwarf hold under the lord of the deepest hall | the deep hall; men trade at the Outer Gate | the Herlitz and Dusty Mountains | Dwarves hold the West's great ranges [OD]. |
| **Garth-Stenn** (Gunwyn exonym) | dwarves | dwarf hold | the deep hall; Outer Gate above the Kulolo | the Bolpor and Boldor Mountains | As above. |
| **Girdon** | men, Girdon wardens | river-warden commonwealth | Arligon | the Girdon plain, the Grey River's south bank, the Lothoro horse valley | Established rival of Gunwyn [V: The Campaign of 4A 1748]. |
| **Saopon** | men, western guildmen | guild league of the Kulolo towns | Lochon | the Kulolo mouth, the Ilurdor lagoon, the Kulolo Fen | The Kulolo's trade and the line with Girdon [GM region_west_lands]. |
| **Buldor** | men, Buldor companies | company state | Toples | the land south of the Fog and Eye range | Established people [V: Peoples of Aoaz]. |
| **Kradlon** | men, western guildmen | guild league | Bolbin | the Kradlon Peninsula's coast and the Ronbo shore | Established [V: Aoaz and Its Regions]. |
| **Corogon** | men, western guildmen | consulate of merchant houses | Oslodon | the Corogon Peninsula, the Corogon Highlands, the Papz Swamp | Established [V: Aoaz and Its Regions]; home of Gwilid [BC 57]. |
| **Varnondor** | men, Gunwyn clans | capes kingdom | Varlibo | the Varnondor Peninsula's western capes | Established [V: Aoaz and Its Regions]; the sea watch. |
| **Wennarith** (former label Argo, the ship of Greek myth) | men, Girdon wardens | ferry-warden commonwealth | Datidon | the Varnondor Peninsula's eastern rivers and bend | Ferrymen of the peninsula's rivers; Gunwyn *wennar* "river" + *-ith* "shore-place". |
| **Olodor** | gnomes | hidden villages under village kings | none fixed (hidden) | the North Forests lobe of the West Wood | Home of the gnome card's people [BC 38]. |

**Comparison with the current roster (21 rows [RO]).**

| Current row | Fate (proposed) | Why |
| --- | --- | --- |
| Y07 Gunwaith | kept, renamed Gunwyn | "-waith" name [OD]. |
| Y26 Werlendor | kept | |
| Y27 Lambin | kept | |
| Y28 Thenon | kept | |
| Y29 Hky | kept, renamed Dolw-Grewn, people changed | Homeland of the Bykkwyn. |
| Y08 Girdon | kept, enlarged | A two-state realm cannot have fought a long war against a twelve-state crown; it gains the Lothoro horse valley. |
| Y2A Lothoro | merged into Girdon | Girdon's sworn riders. |
| Y2E Saopon | kept, enlarged | |
| Y2G Canako | merged into Saopon | A canal town of the same fen. |
| Y2B Buldor | kept, enlarged | |
| Y2C Toples, Y2D Sarudon | merged into Buldor | One-state toll and dye towns at Buldor's crossroads [NT positions]; Toples becomes the capital. |
| Y09 Kradlon | kept, smaller | Gives the Herlitz range to the dwarves. |
| Y0A Corogon | kept, enlarged | |
| Y2F Sobre, Y2H Forbo | merged into Corogon | The port and the pass-fort of the same peninsula [NT positions]. |
| Y0B Varnondor | kept, enlarged | |
| Y2K Oslinod, Y2L Trilino | merged into Varnondor | Oslinod is "named for an old king", and Varnondor's king is Oslin [WB §6.4; Characters spec]; Trilino is a tanners' quay of the same capes. |
| Y2I Argo | kept, renamed Wennarith | Name of Greek myth [OD]. |
| Y2J Pernogon | merged into Wennarith | The river bend of the same ferry wardens. |
| (new) | Chalwe-Brenn, Garth-Stenn | Dwarves [OD]. |
| (new) | Olodor | Gnomes (proposed). |

## 12. Gameplay role

**Mechanics already specified** [MS western_crossing]: the old grudge, the Truce of the Grey Ford and the Grey Ford Feud (a border war), Eindil's temporary war-kingship (owned by the journey spec), the Ford Council, unity and resolve, the West's course, the fleet and the wide sea, the Western Crossing, taking Parim, the occupation strain, the evacuation and the stranded armies, joining Eindil's coalition; Aenor's tariffs, subsidies and the hire of Buldor companies [EC]. The specs and focus files still use the former label Gunwaith; renaming them follows the owner's decision.

**Additions proposed here:**

- **Dwarf gold and guns.** The dwarf holds sell gold, iron and powder-guns at their gates; a court that wins their favour gains gunners and siege bombards for the Crossing, and one that insults them (a raid, a broken contract, an elven envoy at court) loses access for years.
- **The Ronbo Watch.** Dolw-Grewn's safety is a value the Watch keeps; western wars, famine or a crossing that strips the clans of men lower it; at zero, raiders or refugees enter the vale and the Bykkwyn must choose to leave for the first time.
- **Gold for luck.** A country may gift gold to the hidden gnomes of Olodor for a luck spirit; taking from them brings ill luck (the card's rule [BC 38]).
- **Gwilid's errands.** A Corogon decision chain where the wizard hires strangers for tasks, pays in gold or gems and forgets half of what he asked: odd rewards and comic events, with no power over Great Spirits until the owner rules on his kind.
- **Horse fairs** at Girdon and the Ronbo; **floods** on the Kulolo and the Grey River as yearly events for the warden realms.

**Focus-tree themes.** Gunwyn: holding the clans, the truce, the Ford Council, the question of the sea [FT gunwaith]. Girdon: truce or feud, river wealth, the host [FT regional_girdon]. Kradlon and Corogon: tariffs, trade or memory, arms for the Crossing [FT regional_kradlon; FT regional_corogon]. Varnondor: the sea watch [FT regional_varnondor]. Buldor: contracts and the war that pays [FT regional_buldor]. Lambin: the peacemakers' ground [FT regional_lambin]. The shared western tree for the smaller courts [FT shared_west_lands]. New, proposed: the dwarf holds (the deep halls, the gate-trade, the powder secret, a door opened to one ally), Dolw-Grewn (the Watch, the leaf trade, staying home or going out) and Olodor (hidden villages, Gold-Crowns, a friend among men).

**AI behaviour (proposed).** Gunwyn's war-thanes press the truce on the historical path; Girdon answers raids with the blood-price more often than in kind; the guild leagues weigh tariffs against Aenoran gold; Buldor takes the highest bid; the dwarf holds never send armies beyond their ranges but sell arms to the strongest buyer; Dolw-Grewn and Olodor never declare war and join no faction; on the historical path the West crosses in 4A 1755 [MS western_crossing, AI].

## 13. Questions for the owner

1. **Gwilid's kind.** What kind of being is the wizard of your card, and can he really kill Great Spirits with armies of men [BC 57]? Where is Sempos?
2. **Steadtler.** Your gnome card names Steadtler beside Olodor [BC 38]. Where is it?
3. **Girdon's size.** Girdon holds two states while the northern crown holds twelve [RO], yet they fought for about forty-three years (4A 1702 to 1745, proposed dates). May Girdon gain the Lothoro valley and the Girdon plain, or should the war be shorter?
4. **"North Earth".** The West Lands drawing is headed NORTH EARTH, while the vault says "North Earth" in the First Age story means the North Lands and must not return as a separate place [V: Fourth Age Map of Aoaz; NT]. Is the heading only a drawing label?
5. **Where the fleets crossed.** The vault keeps the crossing and landing places open [V: Open Questions]; the region's ports, fleet and staging site depend on the answer.

## 14. Sources

- **[OD]** owner decisions of 24 October 2026, relayed by the coordinator (renames, no "-waith" names, direct replacement of borrowed names, dwarven homelands, the small folk's original name and homeland, gunpowder, no exact ages, the twelve main New Gods and the lesser New Gods).
- **[V: note §heading]** lore vault `docs/lore/vault/`: `05 - Geography/Aoaz and Its Regions.md`; `05 - Geography/Fourth Age Map of Aoaz.md`; `04 - Peoples/Peoples of Aoaz.md`; `06 - Politics/Afrits Hidden Council.md`; `07 - History/The First Age of Aoaz.md` §2, §3, §5, §8; `07 - History/The Second Age of Aoaz.md`; `07 - History/The Third Age of Aoaz.md`; `07 - History/The Fourth Age of Aoaz.md` §IV, §IX, §X; `07 - History/Fourth Age Chronology.md` §I to §V; `07 - History/The Campaign of 4A 1748.md`; `07 - History/War of the Last Crowns.md`; `07 - History/Fourth Age Canon Register.md`; `07 - History/Fifth Age Seeds.md`; `01 - Cosmology/New Gods.md`; `01 - Cosmology/Religious Knowledge and False Gods.md`; `02 - Spirits/Spirits and Their Ranks.md`; `09 - Development/Open Questions.md`.
- **[HO §n]** `docs/zin-handoff/01-CONTEXT-AND-CANON.md` (§2.5 Bastian, §4.3 card table).
- **[GM id]** `tools/content/data/geography/aoaz.json`; spec `docs/specs/01_map/05_geography_model.md`.
- **[NT]** `docs/name_table.md`, `tools/content/data/labels.json` (sheet West-Earth).
- **[RO]** `tools/content/data/countries.json` (scan West-Earth).
- **[DM]** `docs/specs/02_lore/07_demography_and_settlement.md` §1, §4 and `tools/content/data/world/demography.json`.
- **[WB §n]** `docs/specs/02_lore/05_world_bible.md` (creative frame, §3.1 western culture cards, §4, §5, §6.4, §7).
- **[LG §n]** `docs/specs/02_lore/06_languages.md` (§1, §2, §3.8 Gunwaithic, §5) and `tools/content/data/world/languages.json`.
- **[SS]** `docs/specs/02_lore/01_start_situation.md` (West Lands; Relations at the start).
- **[EC]** `docs/specs/03_gameplay/02_economy.md` (region table; Aenoran gold; Buldor decision).
- **[MS western_crossing §n]** `docs/specs/04_mechanics/western_crossing.md`.
- **[FT file]** `docs/design/focus/gunwaith.json`, `regional_girdon.json`, `regional_kradlon.json`, `regional_corogon.json`, `regional_varnondor.json`, `regional_buldor.json`, `regional_lambin.json`, `shared_west_lands.json`.
- **[BC n]** `docs/lore/sources/bestiary_cards_part1.md` and `bestiary_cards_part2.md` (3, 15, 32, 38, 40, 44, 57, 65).
- **[Characters spec]** `docs/specs/02_lore/02_characters.md`.
