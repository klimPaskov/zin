# Regional dossier: Hirolon (Hiloron), the kingdom of giants

**Requirement:** R-19 and R-22 (Hirolon "restored with its geography and the mountains that enclose it; settlements, population, history, relations and the effects of the enclosure"), with R-21 and R-26.
**Status:** Draft of 24 October 2026. Everything not marked **established** is **proposed** (decisions L1 to L3).
**Labels:** **E** established (source key in section 14), **P** proposed, **O** open in canon, **hidden** never public before its story flag.
**Owner decision of 24 October 2026 ([OD], answering Q-05):** the realm is **Hirolon** (former label **Hiloron**, the spelling of the vault, the roster and the drawn sheets) and it is a **sovereign** giant kingdom that treats with Aenor, not a dominion under the Charters of Parim. The file writes Hirolon and keeps "Hiloron" only where it quotes a source. Further decisions applied: the small folk of the hobbit card get an original people name and homeland; names from other fiction are replaced directly; no exact age of any being is stated.

## 1. Overview

In the west of the Middle Lands, between the Crown Ocean and the Great Lake, a ring of grey hills and coastal ridges closes around a high wooded basin. This is the land of the hill giants, written Hiloron in the vault and on the owner's map ([ML], [AR], [LBL]) and Hirolon in the overhaul's requirement (R-22). The giants are few, enormous and slow to anger, and they remember everything: every year of a giant's life is a stone on a cairn, and the cairn-fields of the basin are the oldest records in the Middle Lands (P, [WB] Hill Giants). They held crossings for King Edran's Grand Alliance in the First Age (E that giants joined the Alliance, [A1] §5; P that Hiloron's giants held the crossings at Dardan, [A1] §6). In 4A 1748 they live as they always have, behind their hills, with a people far smaller than men farming the low valleys under their protection and hill-herders of men on the eastern slopes. The giants' realm is sovereign: it has never taken a charter from Parim and treats with the Middle Kingdom as one crown with another ([OD]).

## 2. Physical character

### 2.1 Where it is

| Feature | Model id | Description | Source |
| --- | --- | --- | --- |
| Seat | `site_hiloron` (0.560, 0.608) | "Satellite; giants." | [GM] |
| Hiloron Woods | `forest_hiloron` | Highland woods of the giants of Hiloron (normal density, upland class 2) | [GM] |
| Grano Mountains | `range_grano` (centre 0.568, 0.579), NW to SE, hills (3) | "Grey hills between Hiloron and the Great Lake" | [GM] |
| Hiloff Rim | `range_hiloff_rim` (centre 0.550, 0.541), N to S, hills (3), long | "Coastal ridge on the west shore from Selen to Hiloron (the brown rim drawn as the Wall of Rush on the north-west coast)" | [GM]; [GMS] §13 item 13 |
| River Hilorn | `river_hilorn` (0.558, 0.602), stream | "Proposed short river from the Hiloron woods to the Crown Ocean" | [GM] |
| Hirolon Head (former label Hiloron Head) | `cape_hiloron` (0.538, 0.560) | "Westernmost cape of the Middle Lands" | [GM] |
| Natural border with Aenor | `region_middle_lands` | "Aenor and Hiloron: the Grano hills and River Hilorn" | [GM], [GMS] §6 |
| Drawn labels | Rush Land sheet: "Hiloron", "Hilofrim", "Grano", "Hiloff Rim"; Magical Lands sheet: "Hiloron Mountains" | | [LBL] |

### 2.2 The enclosure (P)

The task and R-22 describe a kingdom "enclosed by mountains". The current model gives only part of a ring, and at hill height: the Hiloff Rim on the west and the Grano Mountains on the east, both class 3. The proposal completes and raises the ring:

| Side | Ridge | Proposed change | Why |
| --- | --- | --- | --- |
| West | **The Hiloff Rim**, the giants' sea wall | Raise the stretch from Hirolon Head to the Hilorn mouth to mountain (4); keep the northern stretch toward Selen at hills (3) | The drawn "Wall of Rush" is a brown rim; giants would choose a sea-cliff to guard their coast |
| East and north-east | **The Grano Mountains** | Raise to mountain (4) along the crest; keep one saddle at hills (3) | The Grano hills are the model's border with Aenor |
| South | **Groonar** (P, Giants' Speech *groon* "stone" + *-ar* "peak") | New short ridge, mountain (4), from the Grano's south end to the coast north of Novez Bay | Closes the ring; the model has no feature here |
| North | The Hiloff Rim's inland spur meeting the Grano's north end | Hills (3) with dense woods | A low, wooded closure toward Selen |

**The two openings (P).** *The Hilorn Gap* in the west, where the River Hilorn cuts through the Rim to the sea; a small harbour at its mouth faces the Inner Sea and Aenor Isle. *The Grano Saddle* in the east, a single cart road over the Grano to the west shore of the Great Lake (the port the Middle Lands dossier calls Grafas). Everything else is steep, wooded and stony; men can walk over it, armies cannot.

**The "Hiloron Mountains" label.** The Magical Lands sheet carries a drawn label "Hiloron Mountains" ([LBL]); the model places no feature of that name. This may mean the owner drew the giants' mountains on another sheet, or it may be a separate range in the east. It is listed as a question (section 13) and, if it is the Grano and the Rim, the name would serve the whole ring.

### 2.3 Terrain, climate, water and hazards

- **Basin.** A high wooded bowl (class 2) about 60 by 80 pixels (P estimate from the feature positions), with the Hiloron Woods on its upper slopes and three low valleys along the Hilorn and its two head-streams (P).
- **Climate.** Warm temperate like the rest of the Middle Lands ([GM] `region_middle_lands`), but the ring holds fog: mornings are grey, summers cooler than on the lake, winters mild by the sea. Rain comes in off the Crown Ocean and falls on the Rim first, so the western slopes are wet and mossy and the eastern Grano is drier and grey.
- **Water.** The River Hilorn and its head-streams; springs at the foot of the Grano; no lake. The coast outside the Rim faces the Crown Ocean and, to the south-west, the strait to the Dark Lands that the Middle Lands dossier calls the Grey Water (drawn "Sea of Death"; `strait_dark_south` runs from the Goldoroth shore to "the Middle Lands' west cape", [GM]).
- **Hazards.** Rockfall on the Rim; fog on the Grano road; chiromaws in the Rim's caves ([BC] card 53, "the Wall of Rush"); the occasional storm-surge at the Hilorn mouth; and, from the sea, raiders out of the Dark Lands strait in bad centuries (P).

## 3. Inhabitants

### 3.1 Peoples

| People | Culture and language | Where | Status |
| --- | --- | --- | --- |
| Hill giants | Hill Giants of Hiloron (`hill_giants`); the Giants' Speech, Hiloron dialect | The upper woods, the cairn-fields and the ring's crests | E: "Hiloron giants" ([PA]), "Hiloron's giants" among the original dominions ([ML]); rank, mortality and origin O |
| Small folk (Tirim) | Not yet in the data; P to speak Aenoran with their own words for farm and home | The three low valleys of the Hilorn | P placement after the hobbit card ([BC] card 32); owner decision: an original people name and homeland ([OD]); proposed Tirim of Tirlan |
| Men | Hill-herders of Hilofrim (P; the roster gives them the culture `wall_folk`, which does not fit herders); Aenoran | The eastern slopes of the Grano and the saddle road | P |

**The giants.** No source fixes their height; the vault says only "Hiloron giants" ([PA]) and the world bible "a few and enormous" ([WB] §2). They speak the Giants' Speech, slow and deep, with long vowels and r, n and m; its Hiloron dialect keeps final -un where the Titanos ice giants shorten it ([LANG] `gigantic`). A Titanos giant and a Hiloron giant understand each other, which the proposal explains by an ancient common people split by the sea (P).

**The small folk.** The card: 1.0 to 1.3 metres tall, long-lived, farming, peaceful and free of danger, drinking and smoking a great deal; "evil cannot enter The Shire, because these lands are protected by guards"; they rarely leave and rarely wear boots ([BC] card 32). The proposal makes the giants those guards and the ring that land. The card's words "hobbit" and "The Shire" are borrowed names and are replaced directly by the owner's decision ([OD]): the people are **the Tirim**, Aenoran "the small ones" (former card name hobbits), and their homeland is **Tirlan**, Aenoran "the small fields" (former card name The Shire). Both names are proposed; in English text the people are also "the small folk".

**The herders.** Men of the Aenoran hill dialect who graze sheep on the eastern Grano, trade wool and cheese at the saddle and serve as the giants' go-betweens with Parim. The roster calls them Hilofrim (`Y4T`), "hill herders on Hiloron's border who trade with the giants" ([WB] §6.1).

### 3.2 Population

| People | Model | Revised (P) | Why |
| --- | ---: | ---: | --- |
| Giants | 56,800 (all of Hiloron's people, [DEM] Hiloron) | about 8,000 | A giant eats as much as a dozen men (P); a basin of this size could not feed 56,800 giants, and the world bible calls them "few". The demography model's own people factor for giants is 0.05 ([DEM] density modifiers). |
| Small folk | 0 | about 90,000 | The three valleys are the most closely farmed land of the ring; small folk need little land each. |
| Men (Hilofrim herders) | 189,400 (Hilofrim) | about 60,000 | Upland pasture, not farmland ([DEM] density class "pasture": 6 per square kilometre). |
| **Total** | **246,200** | **about 158,000** | |

The giants live in clan halls on the upper slopes near their cairn-fields; the small folk in the valleys where the Hilorn's water and the morning fog keep the soil soft; the herders on the dry eastern Grano where nobody else wants to live.

## 4. Livelihoods and resources

| Resource or work | Who | Notes |
| --- | --- | --- |
| Barley, beans, orchards, honey, beer, a dried smoking herb | Small folk | The basin's food; the card's drinking and smoking (P) |
| Stone | Giants | The giants quarry the grey Grano stone and set the cairns; Parim buys giant-cut blocks for its quays (P) |
| Timber | Giants, by gift | The Hiloron Woods are cut only by the giants' leave (P) |
| Wool, cheese, hides | Herders | Sold at the Grano Saddle (P) |
| Fish | Small folk, herders | At the Hilorn mouth (P) |
| Great-horned cattle | Giants | P: the giants keep a large slow breed that only they can handle, used to haul stone |
| Labour | Giants | In Parim's eyes the giants' strength is the ring's export: they lift what cranes cannot, for a price paid in grain (P) |
| Game resources | Stone (tungsten-bearing granite) is placed by the model in the Giant and Gigantic Mountains, not here ([GMS] §2 resource table); the ring has no iron | |

## 5. Institutions and political forms

**The giants' government (P).** A **High Chief** (Giants' Speech *oronar*, "king", [LANG] `gigantic` titles) is chosen by the cairn-keepers, who count years by stones; a council of clan chiefs sits with him; a dispute is judged by which party can name the older cairn ([WB] Hill Giants, P). The giants' focus tree calls the realm "the lake republic of the giants: a council of chiefs" ([FT] `regional_hiloron`), and the Aenor court spec lists "giants of the lake" ([ACS] §3); the realm does not touch the Great Lake in the model (the Grano lies between), so "lake" is a defect to correct (section 13).

**The small folk (P).** A moot of households in each valley under a **Warden of the Fields**, chosen by the households for seven years; they pay a share of each harvest to the giants' halls and in return no stranger enters the valleys without a giant's leave (the Old Promise, section 7).

**The herders (P).** Village headmen; they hold their grazing as tenants of the giants and their law is Aenoran custom.

**Status: sovereign (owner decision, [OD]).** Hirolon is a kingdom outside the Concord, bound to Aenor by a treaty of friendship and passage (P name: **the Cairn Treaty**, 4A 3, sworn on the same day as the Charters of Parim but separate from them). The treaty gives Parim the right to buy stone and hire giants, gives Aenoran carts passage over the Grano Saddle, and promises that no Aenoran army enters the ring uninvited (P). The ring is why the giants never needed a crown's protection. In play Hirolon is an independent country with friendly opinion of Aenor, Selen and Kilinti; it can be guaranteed, courted or threatened, but it has no Concord loyalty, levies or charter.

**Sources to correct.** The vault's original story lists "Hiloron's giants" among Aenor's dominions ([ML] "The older original story recognizes dominions including … Hiloron's giants"), the working table makes Hiloron a satellite ([GP]), the campaign page lists it among the dominions under the Charters ([C48]), and the Aenor court spec puts it among the 26 chartered dominions ([ACS] §3). Under the owner's decision those entries must be rewritten; the vault itself already leaves open "whether each original dominion is constitutionally a satellite or an internal division" ([ML]), and "dominion" in the original story can be read as "a land of the Middle Kingdom's world".

## 6. Beliefs and faiths

| Faith | Held by | Belief | Truth versus belief |
| --- | --- | --- | --- |
| The Cairn-Faith | Giants | A giant leaves one stone for each year of life; the great cairns are the giants' memory ([WB] §4, P) | The giants' rank and origin are open (O); the faith claims nothing about them. |
| The Old Promise (P) | Small folk | The giants promised the small folk's first mothers that no evil would enter the valleys, and the promise is kept as long as the harvest-share is paid | Belief; the giants say the promise was theirs to make and is not a god's. |
| The Lamp and the Furrow | Small folk, herders | The New Gods at the hearth (P, [WB] §4) | Twelve New Gods name the twelve months; names undecided ([OC] §2.3). |
| The Faith of the Deliverer | Herders, a few small folk | Public worship of the Deliverer (E); a small House of the First Light stands at the Grano Saddle (P) | Hidden: the Deliverer is Afrit ([AF]). The giants have never let a House inside the ring (P). |

**Holy sites (P).** The Cairn-Fields of the upper basin; the Eldest Cairn, said to be older than Aen; the stone at the Hilorn Gap where the Old Promise was sworn.

## 7. History

| Date | Event | Label |
| --- | --- | --- |
| Before 1A | Giants already hold the western hills; their cairns are older than any border. | E that giants exist ([PA]); P date ([WB] §1) |
| Before 1A | **The Old Promise:** small folk fleeing the wars of men's kingdoms come to the ring; the giants give them the low valleys and swear that no evil will enter them. | P |
| Before 1A | The War of Men passes the ring by: Aen's armies and his enemies both go round it. | P |
| About 1,500 to 900 BA | The hill giants of the low country are the partners of the Orran moot: they raise the long sea-dikes from field-stone and keep their cairn-fields on the high ground, and they are never its subjects. | Established (owner, 25 October 2026; decision K64) |
| About 900 to 621 BA | The cairn-keepers warn the Moot of Mothers that its overdraw of the land's magic will drown the fields. The Moot divides and does not heed them, and the giants keep their own count in stone: the land, they say, was asked for too much. | Established (owner, 25 October 2026; decision K64) |
| About 620 BA | After the Night of the Sea the giants withdraw into the ring, and the Eldest Cairn receives its first stone. One stone is laid in every year since the sea came, so the count measures years since an event and never the age of a being. | Established (owner, 25 October 2026; decision K64) |
| 1A, early centuries | Aenoran traders reach the ring by the Grano Saddle; the name "Hiloron" enters the charts, read as "the giants' hill" (Aenoran *hil* with Giants' Speech *oron*). | P; the reading is [LANG] §7 |
| Late 1A | Giants join Edran's Grand Alliance. | E ([A1] §5) |
| By 1A 1675 | Hiloron's giants defend the crossings of Dardan beside dwarf engineers. Dardan's place is open. | P ([A1] §6, proposed course of the battle); O place |
| 2A | Sea-orc raids out of the Dark Lands strait burn the Hilorn mouth; the giants raise beacon-cairns along the Rim. | P |
| 2A | Famine years bring Vale refugees to the Grano Saddle; the giants let them graze the eastern slopes as tenants: the first Hilofrim herders. | P |
| 2A 2133 | Elzon takes Aenor. | E ([EO]) |
| 3A about 400 | **The Siege of the Stones:** Elzon's dead come to the Hilorn Gap; the giants roll the cairn-stones down on them. Elzon, short of the power to sustain his hosts in Aenor ([A3]), leaves the ring under a tribute of stone and never garrisons it. | E that Elzon's power was limited in Aenor; P siege |
| 3A | The ring shelters fugitives of the Selen resistance; the giants hand none of them over. | P |
| 4A 3 | While the dominions take the Charters of Parim, the giants refuse a charter and swear the Cairn Treaty of friendship and passage with the restored crown. | E sovereign ([OD]); P treaty ([FC] I for the Charters) |
| 4A about 600 | The herders of Hilofrim are recognised as a separate dominion (current roster) or as the giants' tenants (this proposal). | P |
| 4A 1100s | The Houses of the First Light ask to build in the valleys and are refused; one House is allowed at the Saddle. | P |
| **4A 1748** | **Start: peace.** | owner, [C48] |
| 4A 1755 to 1759 | The War of the Last Crowns; the West lands at Aenor Isle and the west coast (P) and the ring becomes a refuge for the Vale's children and a gate the westerners cannot force (P). | E war ([WLC]); P part |

**Local legends (P).** Every giant child is shown the cairn of the giant who first spoke to men. The small folk say the fog in the valleys is the giants' breath, laid over them at night. The herders say a giant once carried a whole flock over the Grano in a winter storm and asked only for the bell of the lead ram.

**Where history can diverge (L3).** The ring can open to the West, to Volgan or to a false king, or stay shut to all; the small folk can leave for the first time; the giants can march out, which nobody alive has seen.

## 8. Neighbours and relations

| Neighbour | Relation | Why |
| --- | --- | --- |
| Aenor | Friendly; the Cairn Treaty between two sovereign crowns | Parim buys stone and strength; the giants want only to be left alone (E sovereign, [OD]; P treaty) |
| Selen | Friendship | Woodland and hill neighbours ([WB] §7) |
| Kilinti | Friendship; the ents and the giants are the two oldest peoples of the Middle Lands (P) | [WB] Hill Giants |
| Aenor Isle | Trade across the Inner Sea from the Hilorn mouth | P |
| Olodor (gnomes) | Distant, curious | Both hidden peoples; the gnomes pay the giants in gold for Grano stone (P) |
| The Dark Lands across the Grey Water | Old enmity with the sea orcs of the strait | P |
| Titanos (Cold Lands) | Kin in speech, never met in living memory | E Titanos ice giants exist ([PA]); P kinship |

## 9. Wildlife and creatures

| Creature | Habitat | Effect | Source |
| --- | --- | --- | --- |
| Chiromaws | Caves of the Hiloff Rim | Night raids on the valleys' stores; the giants block the cave mouths with boulders | [BC] card 53 ("the Wall of Rush") |
| Great-horned cattle (P) | The giants' upland pastures | Haul stone; the only beasts the giants keep | P |
| Rim kites (P) | The sea cliffs of the Hiloff Rim | Take lambs on the Grano; the herders' chief complaint | P |
| Sea serpents | Off Hirolon Head in the Sea of Monsters | Fishermen keep inside the Hilorn mouth | [BC] card 12 (its seas unplaced) |
| Red deer, boar | Hiloron Woods | Hunted only by the giants' leave | P |

## 10. Settlements

| Place | Kind | Why there | Status |
| --- | --- | --- | --- |
| **Torunalos** (Giants' Speech *torunal* "throne" + *-os* "seat") | The High Chief's hall, about 2,000 giants and small-folk servants | On the highest hill of the basin above the cairn-fields, where the whole ring can be seen | P; replaces the roster's working capital "Bedogus" ([ROS] Y0Q), which does not follow the Giants' Speech (no ending in -on, -os, -un, -ar, -oron) |
| The Cairn-Fields | Holy ground | Upper slopes | P |
| **Tirbur** (Aenoran "small town") | The small folk's market village, about 3,000 | Where the Hilorn's two head-streams meet in the largest valley | P |
| **Maruunos** (Giants' Speech *maruun* "river" + *-os*) | Harbour at the Hilorn mouth, about 2,500 | The only landing on the ring's coast | P |
| **Hilofrim** | Herders' market and the House at the Saddle, about 4,000 | At the eastern foot of the Grano Saddle, on the road to the lake | Drawn label ([LBL]) used as a town |

## 11. Roster proposal (proposed)

| Name | People and culture | Political form | Capital | Extent | Why it exists |
| --- | --- | --- | --- | --- | --- |
| **Hirolon** (former label Hiloron) | Giants (Hill Giants of Hiloron), with herder tenants | Sovereign giants' kingdom under a High Chief, bound to Aenor by the Cairn Treaty | Torunalos | The ring's crests, the upper basin and the eastern Grano; 2 states | E giants of the western Middle Lands; R-22 |
| **Tirlan** (former card name The Shire) | Small folk (Tirim) | Moot of households under a Warden of the Fields; a protectorate of Hirolon | Tirbur | The three Hilorn valleys; 1 state | R-21 small folk; card 32's protected farming land |

| Current row | Tag | Change | Reason |
| --- | --- | --- | --- |
| Hiloron | Y0Q | Renamed Hirolon; made sovereign (no longer Aenor's subject); ideology changed from Shadow to Light ([ACS] §3 known issue) | Owner decision ([OD]); the giants are not a dark realm |
| Hilofrim | Y4T | Merged into Hirolon as its herder tenants; "Hilofrim" survives as a town | Interchangeable dominion row; its men live on the giants' land |
| *(new)* | | Tirlan, a protectorate of Hirolon | R-21 |

**Counts:** 2 countries before (Hiloron, Hilofrim), 2 after (Hirolon, Tirlan). Elven realms: 0 before, 0 after.

## 12. Gameplay role

- **The enclosure in play (P).** All Hirolon states get the terrain of the raised ring (mountain borders, hills inside); only the Hilorn Gap and the Grano Saddle connect to the outside with normal movement; every other border province carries heavy attrition and a river-like crossing penalty. A permanent spirit **The Ring of Stones**: +defence and dig-in for Hirolon and Tirlan's own divisions, −15 percent trade and research speed (isolation). The giants' units are few, slow and very strong: a single "giant company" battalion type with high breakthrough and organisation, low speed, and a heavy food cost (P).
- **Food and protection.** Tirlan supplies Hirolon's food (a scripted transfer of consumer goods or a food resource if the economy spec has one, P); Hirolon guarantees Tirlan by a permanent subject relation.
- **Focus tree.** `regional_hiloron` (32 focuses: "a council of chiefs, the memory of the crossings, the giant host and the price of stone", [FT]) is kept and rethemed from "lake republic" to "the Ring": branches for the Cairn-Keepers (memory, the crossings of Dardan without naming its place), the Stone Trade (Parim's quays, giants for hire), the Old Promise (Tirlan, food, the small folk's first journey outside), and the Giant Host (opening the ring in the War of the Last Crowns). Tirlan gets a small tree (10 to 15 focuses): the harvest-share, the Warden's moot, the first traveller, the hiding of children in war.
- **Events (P).** "A Stranger at the Saddle" (a House of the First Light asks to build in the valleys; refusing angers the Deliverer's faithful, accepting gives the Hidden Council a foothold, hidden); "The Siege of the Stones Remembered" (on the 4A 1755 war: open the ring to refugees or close it); "The Small Folk Leave" (a once-in-a-game decision for Tirlan to send help outside); "Sea-Orcs at the Hilorn" (a Dark Lands raid).
- **Decisions (P).** Hire Giants for Parim's Works (Aenor pays grain, Hirolon gains political power); Open the Grano Saddle to an Army (military access, once per war); Raise the Beacon-Cairns (coastal fort levels).
- **AI behaviour (P).** Hirolon never declares offensive war; joins a defensive war only if a ring state is attacked or Selen or Kilinti is overrun; accepts refugees; keeps the Cairn Treaty unless Aenor's ruler is a usurper or an army crosses the Saddle uninvited. Tirlan never acts.
- **Divergences.** The ring can be the last free land of the Middle Lands, a western bridgehead if the herders open the Saddle, or a giants' kingdom that steps into history for the first time.

## 13. Questions for the owner

1. **The enclosure.** May the Hiloff Rim (west stretch) and the Grano Mountains be raised from hills to mountains, and a new southern ridge (proposed Groonar) be added, so that the giants' land is truly enclosed? Is the drawn "Hiloron Mountains" label on the Magical Lands sheet this ring, or another range?
2. **"Lake republic".** The giants' focus tree and the Aenor court spec call Hiloron a lake realm, but the model puts the Grano hills between it and the Great Lake. Should Hirolon reach the lake shore, or should the trees drop "lake"?
3. **The small folk's home.** May the Tirim (the hobbit card's people) live inside the giants' ring, guarded by the giants (the card's "protected by guards"), or should their homeland be elsewhere?
4. **The giants' nature.** Their height, rank and origin are open in the vault; may the dossier's working assumption that a giant eats as much as about a dozen men (which sets the population at about 8,000) stand?

Note for the record: "Hiloron" reads in the languages as Aenoran *hil* "hill" with the Giants' Speech *oron* "giant", or as the Giants' Speech *hilor* "hill" with *-on* ([LANG] §7, `gigantic`); "Hirolon" has no reading in the Giants' Speech and resembles a Mirolic name (Mirolic *hira* "river", the ending *-on*, the pattern of Mirolon). The owner's decision for Hirolon stands; the language data should give "Hirolon" a Giants' Speech reading (proposed: *hir-* an old Giants' Speech word for "ring", so "Hirolon" is "the ring-land of the giants") so that it does not read as Mirolic.

### Renamed labels (owner decisions of 24 October 2026 applied directly; former label kept)

| Former label | Origin | New name | Language and meaning |
| --- | --- | --- | --- |
| Hiloron | owner's spelling decision | **Hirolon** | proposed reading above |
| hobbit (card 32) | Tolkien | **Tirim**, "the small ones"; in English text "the small folk" | Aenoran *tir* "small" + *-im* "the people of" |
| The Shire (card 32) | Tolkien | **Tirlan**, "the small fields" | Aenoran *tir* "small" + *lan* "field" |
| Hiloron Head (`cape_hiloron`) | follows the realm's name | **Hirolon Head** | |
| Bedogus (working capital, Y0Q) | not Giants' Speech | **Torunalos** | Giants' Speech *torunal* "throne" + *-os* "seat" |

## 14. Sources

| Key | File and heading |
| --- | --- |
| [ML] | `docs/lore/vault/05 - Geography/Middle Lands and Aenor.md` (opening paragraphs on dominions and satellites) |
| [AR] | `docs/lore/vault/05 - Geography/Aoaz and Its Regions.md` (Middle Lands row) |
| [PA] | `docs/lore/vault/04 - Peoples/Peoples of Aoaz.md` (Other peoples and creatures: Giants) |
| [GP] | `docs/lore/vault/06 - Politics/Great Powers and Relations.md` (Aenor row) |
| [A1] | `docs/lore/vault/07 - History/The First Age of Aoaz.md` (§5 The new king and the Grand Alliance; §6 Proposed course of the battle) |
| [A3] | `docs/lore/vault/07 - History/The Third Age of Aoaz.md` (opening; Why the long rule holds together) |
| [EO] | `docs/lore/vault/06 - Politics/Elzons Order.md` |
| [FC] | `docs/lore/vault/07 - History/Fourth Age Chronology.md` (I. The Restoration) |
| [C48] | `docs/lore/vault/07 - History/The Campaign of 4A 1748.md` (The Middle Lands: Aenor and the Concord) |
| [WLC] | `docs/lore/vault/07 - History/War of the Last Crowns.md` |
| [AF] | `docs/lore/vault/03 - Figures/Afrit.md` |
| [OC] | `docs/zin-handoff/01-CONTEXT-AND-CANON.md` §2.3 |
| [OQ] | `docs/zin-handoff/OWNER-QUESTIONS.md` (Q-05, Q-06, now answered) |
| [OD] | Owner decisions of 24 October 2026 relayed by the coordinator (Hirolon sovereign with former label Hiloron; original names for the small folk and their homeland; direct replacement of borrowed names; no exact ages) |
| [GM] | `tools/content/data/geography/aoaz.json` (`site_hiloron`, `forest_hiloron`, `range_grano`, `range_hiloff_rim`, `river_hilorn`, `cape_hiloron`, `strait_dark_south`, `region_middle_lands`) |
| [GMS] | `docs/specs/01_map/05_geography_model.md` (§2 resource table; §6 Natural borders; §13 item 13) |
| [DEM] | `tools/content/data/world/demography.json` (countries Hiloron and Hilofrim; density classes and people factors) |
| [WB] | `docs/specs/02_lore/05_world_bible.md` (§1; §2 Giants; §3.6 Hill Giants of Hiloron; §4; §6.1; §7) |
| [LANG] | `docs/specs/02_lore/06_languages.md` (§3.21 Giants' Speech; §7 How the vault's names fit); `tools/content/data/world/languages.json` (`gigantic`, `aenoran`, `mirolic`) |
| [ROS] | `tools/content/data/countries.json` (Y0Q Hiloron, Y4T Hilofrim) |
| [LBL] | `tools/content/data/labels.json` (Rush Land; Magical Lands "Hiloron Mountains") |
| [BC] | `docs/lore/sources/bestiary_cards_part1.md` (card 12 Seaserpent, card 32 Hobbit), `bestiary_cards_part2.md` (card 53 Chiromaw) |
| [ACS] | `docs/specs/04_mechanics/aenor_court_and_succession.md` (§3 The 26 dominions; known issue on Hiloron's ideology) |
| [FT] | `docs/design/focus/regional_hiloron.json` (summary) |
