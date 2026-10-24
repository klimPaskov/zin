# The Dark Lands

**Requirement:** R-19 regional dossier. **Status:** draft for owner review, 24 October 2026; owner decisions of 24 October 2026 applied. **Region key:** `dark_lands` in the geography model; roster scan "Dark Lands".

**How to read this dossier.** **Established** means the lore vault or an owner ruling says it, with the source in brackets. **Working** means the vault's working political table or the drawn map. **Proposed** means new here or in an earlier spec, and replaceable. Citation keys are in section 14. **Owner decisions of 24 October 2026** [OD] are treated as established: names from other fiction or real myth are replaced directly and ill-fitting labels may be renamed, the old label kept as former label; Smash, the troll king, and the hobgoblin king of the goblins rule their own realms only; gunpowder weapons are common in some realms; devils are corrupted Lesser Spirits who served an Old God and escaped to Aoaz; no exact age of any being is stated.

## 1. Overview

Between the North Lands and the Middle Lands, across narrow straits, lie two dark arms of forest, ridge and volcano around an inner sea, the Sea of Darkness [V: Aoaz and Its Regions]. The Dark Lands were never one nation: men, orcs, goblins, trolls, ogres, giants and demons live here under separate rulers, and not one of them is Volgan's by nature [V: Kingdoms Factions and Conflicts]. In 4A 1748 the orc warkingdom of Goldoroth, beneath its smoking Fire-Mountain, wants the whole region; the human kingdom of Dondor and its sea-orc allies of Belonton hold the Dark Sea Accord against it; and between them stand the free orc holds of the iron hills, the troll king Smash in his forest, a goblin realm under a hobgoblin king in the warm caves of the mountains, a forgotten people of giants in the Giant Forest and a demon lordship on the black southern shore (working table and owner decisions; the last three proposed). Volgan's envoys court them all; most still answer only to themselves [V: The Campaign of 4A 1748]. The two sides keep an armed peace of raids and beacon-fires, and guns are no rarity here [OD].

## 2. Physical character

### Terrain, relief and ranges

"The Darkness ridge and the Goldoroth Mountains at 4 to 5; Dondor lowland 1"; terrain shares forest 30%, mountain 28%, plains 22%, hills 15%, marsh 3%, towns 2%; snow share 0.03 [GM region_dark_lands]. Two arms make the land: the northern **Dondor Arm** (`land_dondor_arm`, about 48,000 pixels: Dondor, Bordon, Dreson, Dulundur and the forests) and the western **Goldoroth Arm** (`land_goldoroth_arm`, about 28,900 pixels, around the Goldoroth Mountains), with small isles in the inner sea (`land_island_016`, `land_island_047`) [GM].

- **The Darkness** (`range_the_darkness`, long; drawn The Darkness, Hills of Dark, Mountains of Dark), the black ridge across the middle of the land [GM; NT].
- The **Goldoroth Mountains** (`range_goldoroth`, peak class 5), black mountains with the **Dark Gate** pass (`pass_dark_gate`) at their foot [GM].
- The **Goldoroth Volcano** (`volcano_goldoroth`), a smoking grey cone above Cocanoor, the Fire-Mountain of the orcs; dormant smoke, no eruption yet [GM].
- Passes: the **Dark Gate**; the drawn **Path of Dark** (`pass_path_of_dark`) along the south foot of the Darkness to the Dun Sea; the proposed **Dondor Pass** (`pass_dark_north`) between the Dark Forests and the ridge [GM].
- Forests: the dense black **Dark Forests** (`forest_dark`) of Dondor's north-east; the **Fonoor and Giant Forests** (`forest_fonoor_giant`) between the Dondor arm and the ridge; the **Troll Forest** (`forest_troll`, drawn **Troy's Forest**) beside Bordon [GM; NT]; the drawn Dough Forest, Dondor Forest and Forest of Nothingness [NT].
- Drawn lands: **The Borderline of Giants** below the Dark Forests; the **Goldoroth Ember Lands**, the dark south of the Goldoroth arm; the **Nothingness** tail pointing at the Middle Lands (`peninsula_nothingness`, proposed) [NT; GM].

### Climate and seasons

Cool, gloomy and overcast, with coastal fog; mild winters and mists [GM region_dark_lands]. Proposed: the volcano's ash and the sea-fogs keep the sun weak, which is one reason the Dark Lands hold more orcs and goblins than anywhere else: the cards say some kinds of orc cannot bear the sun and that sunlight makes goblins drowsy and weak [BC 20; BC 36]. The goblins' deep caves in the Goldoroth Mountains are warm from the volcano. Seasons are told by the Ember-Night and the Tithe of Iron among the orcs and by the Forging among Dondor's men [WB §4], not by month names, which are to follow the twelve main New Gods [V: New Gods; OD].

### Water

- **Rivers:** the drawn **Giant River** (`river_giant`), through the Giant Forest along the south foot of the Darkness into the inner sea; the proposed **Dondor Water** (`river_dondor`) to the northern sea [GM].
- **Lake:** the drawn **Soun Lake** (`lake_soun`) under Bordon [GM].
- **Marsh:** the proposed **Dondor Fen** (`marsh_dondor_fen`) along the Giant River's lower course; Dreson's fens [GM; FT regional_dreson].
- **Seas, one name each** (the drawn names collide, and this dossier proposes one name per water):
  - the **Sea of Darkness** (`sea_darkness_sea`, vault name), the sheltered inner sea between the two arms [V: Aoaz and Its Regions]. The model's proposed **Gulf of Darkness** (`gulf_inner_dark`) names the same water and is dropped; its mouth, the proposed **Dark Channel** (`strait_dondor_goldoroth`), is kept as a strait.
  - the **Dulundur Sea** (`sea_dark_sea`, former label "The Dark Sea"; the drawing reads "Dulundur / The Dark Sea" [NT]), north of Dondor. "The Dark Sea" beside "the Sea of Darkness" names two waters with one idea; the drawing's own first line, Dulundur, is kept.
  - the **Dun Sea** (`sea_dun_sea`) at the east mouth of the inner channel [GM].
  - **Gaelmael**, "the Grey Water" (`sea_death_sea`, former label Sea of Death), the southern strait water between the Dark Lands and the Middle Lands. The drawn "Sea of Death" collided with the Dead Lands' drawn "Sea of Deaths" and "The Dead's Sea", which the owner's rule forbids [HO §5.1]; the Dead Lands dossier renames those, and the Middle Lands dossier proposes the Aenoran name Gaelmael (*gael* "grey" + *mael* "sea") for this water. This dossier adopts it so that the water has one name; the orcs of the Goldoroth shore call it *Gnashagh*, "bone-water" (Orcish *gnash* "bone" + *agh* "water" [LG §3.18]), a local usage only. The drawn **Islands of Death** beside it keep their name.
  - the **Gold Wides** (`sea_gold_wides`) off Goldoroth's south-east shore [GM].
  - the **Sea of Dolon** (`sea_dolon_left_sea`, drawn "The Leat Sea of Dolon", reading uncertain; the model reads "Left"), south of the Goldoroth Islands, the water that leads toward Dolon of the Ember Lands [GM; NT].
  - the **Belonton Water** (`sea_dark_west_sea`, former model name "Western Dark Strait"), off Belonton and the Goldoroth Islands, open to the Crown Ocean; renamed because a sea called a strait beside two real straits confuses [GM].
- **Straits:** the **Northern Dark Strait** (`strait_dark_north`, established) between the Dondor arm and Lerendor, 25 to 35 pixels; the **Southern Dark Strait** (`strait_dark_south`, established) between Goldoroth's south shore and the Middle Lands' west cape, about 30 pixels [V: Aoaz and Its Regions; GM]. Neither place is confirmed by the owner [GM notes].

### Hazards

Fog on every coast; ash-falls from the Fire-Mountain; the fens of Dreson that "swallow armies" [FT regional_dreson]; troll country at night; the devils' roosts of the Goldoroth Mountains and the Islands of Death [BC 46]; bone-hounds and raiders on the moors; and, late in the age, Zol's dead on the shores of the northern strait [MS dark_lands, Phases].

## 3. Inhabitants

### Peoples, cultures and languages

| People | Culture | Language | Where | Status |
| --- | --- | --- | --- | --- |
| Men | Dondor Brutes | Dondric | Dondor and Blackton | "Dondor Brutes" established [V: Peoples of Aoaz]; culture proposed [WB §3.1] |
| Men | Leren settlers | Leren | Blackton's harbours | proposed [DM minorities; WB §1] |
| Orcs | Volcano Clans | Orcish, Volcano dialect | Goldoroth, the Dark Gate | proposed [WB §3.4] |
| Orcs | Iron Clans | Orcish, Iron dialect | Bordon, Dreson, Dulundur, Fondor, Britadon, Dun | proposed [WB §3.4] |
| Orcs | Sea Orcs | Orcish, sea dialect | Belonton and its isles | proposed [WB §3.4] |
| Orcs and others | Wild Holds | Orcish with many loans | the Wild Lands and the Doltu marsh | proposed [WB §3.4] |
| Goblins, with hobgoblins | the Ellenmoor warrens (proposed) | Goblin Cant | Burnikit, under the Goldoroth Mountains; goblin quarters in many orc holds | goblins established [V: Peoples of Aoaz]; realm proposed |
| Ogres | the ogre clans of the Darkness | Orcish | The Darks, beside orcs | ogres established as an independent Dark Lands people [V: Kingdoms Factions and Conflicts] |
| Trolls | the forest trolls of Smash | Trollish | the Troll Forest | established people and separate polity [V: Great Powers and Relations]; Smash from the card [BC 13; OD] |
| Giants | the giants of the Giant Forest (proposed) | Giants' Speech | the Giant Forest by the Giant River | independent Dark Lands giants established [V: Kingdoms Factions and Conflicts]; place proposed from the drawn labels [NT] |
| Demons | the lords of Veshazel (proposed) | Infernal | the Goldoroth Ember Lands | independent Dark Lands demons established [V: Kingdoms Factions and Conflicts]; place proposed |
| Devils | not a people of the land | — | the Goldoroth Mountains and the Islands of Death | card [BC 46]; nature owner decision [OD] |

**Languages.** Orcish is an isolate of closed syllables and throat sounds with no *e* (proposed [LG §3.18]); its dialects mark the clans. **Dondric** is Old Ainic "worn down by centuries of living beside orc holds", with Orcish loan-words [LG §3.4]: the one place where an Ainic tongue and Orcish share words, explained by contact. The chart names Bordon, Dreson and Goldoroth carry an *e* or the Aenoran *-dor* that Orcish lacks, because they are Aenor's chart forms; the orcs' own form of Goldoroth is *Gruzgoroth* (proposed [LG §7]).

### Population

The model gives **3.4 million** in 24 countries and 47 states (42 per pixel, as dense as the North Lands), with Goldoroth at 545,800, the Troll Forest at 19,000 trolls and every one-state orc hold at a formula figure [DM regions; DM countries].

**Revision proposed: about 1.6 million.** The model's own density note gives 6 to 14 per square kilometre for "hills, forest, marsh and volcano" [DM §4 Dark Lands], against 20 to 35 for the West Lands at 30 per pixel; the region's total, at 42 per pixel, contradicts its own note. Applying the note gives about 0.9 million; the cards make orcs "the most common monsters" and most numerous here [BC 20], and short-lived, fast-breeding peoples press hard on their land, so this dossier proposes about 1.6 million. **Trolls:** the cards make forest trolls as tall as old trees, moving in groups of three to five [BC 59], with a king far larger [BC 13]; nineteen thousand would strip the forest bare. Proposed: about 600 trolls. **Giants:** a few hundred. **Demons:** about 2,000 with their thralls. Proposed distribution: Goldoroth 0.50 M; Dondor 0.25 M; Blackton 0.20 M; Dulundur 0.15 M; Belonton 0.08 M; Burnikit 0.06 M (goblins, with a few thousand hobgoblins); The Darks 0.06 M (orcs and ogres); Fondor 0.06 M; Bordon 0.05 M; Dun 0.05 M; Britadon 0.05 M; Dreson 0.04 M; the Dark Gate 0.04 M; the Wild Lands 0.03 M; the Troll Forest about 600; the giants a few hundred; Veshazel about 2,000.

### Where they live and why

Men live where the land is flattest and feeds best: the **Dondor plain** and the **Giant River valley** [GM region_dark_lands], and the harbour towns of Blackton on the iron road's end. Orcs fill the **iron hills** of the middle Dark Lands and the volcano country of Goldoroth, where iron, ash-glass and the cloud-dimmed sun suit them; sea orcs live on the southern isles; goblins live deep in the warm rock of the Goldoroth Mountains and in quarters under the orc holds [WB §3.4]. Trolls keep their forest; ogres live in the caves of the Darkness and with orcs in the forests [BC 22]. The giants keep to the Giant Forest beyond the Borderline that men and orcs do not cross. The demons hold the black south where nothing else wants to live.

## 4. Livelihoods and resources

The economy spec weights the Dark Lands at iron 2, timber 1, horses 1, stone 2, gold 0, essence 1, grain 1, development 0.30: "forge-pits of the orc holds" [EC].

| Resource | Where and why (proposed unless marked) |
| --- | --- |
| Iron | The iron hills of Dulundur, Bordon, Dreson and Britadon; Goldoroth's forge-pits; Dondor's hills and the **Iron Road** to the straits [WB §7 trade routes]. |
| Stone | Black stone of the Goldoroth Mountains; ash-glass from the volcano's slopes (Zuriath's trade [WB §6.6]). |
| Timber | The Fonoor Forest, felled for the strait's ships [WB §6.6]; the Dark Forests, which few dare to cut. |
| Grain | The Dondor plain and the Giant River valley. |
| Horses | Few; the orcs ride bone-hounds, not horses. |
| Essence | Proposed: the essence weight (1) lies in the Goldoroth Mountains' deep fire-vents, near the devils' roosts; the orcs' Fire-Speakers work it, and what feeds the vents is not stated. |

Other livelihoods: tolls on the Iron Road, the Black Road (Bordon's caravan inns [FT regional_bordon]), the Dark Gate and the Dun Sea; fishing and salt (sea orcs); eels, peat and bog-iron (Dreson [FT regional_dreson]); charcoal (Fondor); war-spoils and tribute; mercenary service to Volgan's envoys. **Guns:** the owner rules that gunpowder weapons are common in some realms [OD], and the orc card says orcs use catapults and cannons when they can [BC 20]. Proposed: Goldoroth's siege forges cast great bombards, the goblins of Burnikit make the best powder and small handguns of the region, and Dondor's beacon towers keep a few guns bought dearly from the goblins; the free holds use axes, javelins and slings.

## 5. Institutions and political forms

- **The Warking of Goldoroth** (proposed [WB §3.4; FT goldoroth]): acclaimed by the clan chiefs at the moot below the Fire-Mountain; holds the throne until a stronger challenger breaks him in the ring. The **Iron Yoke**: tributary holds that pay Cocanoor in iron (proposed [MS dark_lands §5]).
- **The Brute-King of Dondor** (proposed [WB §3.1; FT regional_dondor]): chosen by the clan-moot from the strongest line; law is the blood-price; leader of the **Dark Sea Accord** (working [V: Great Powers and Relations]).
- **Blackton's Town Moot** (proposed [FT regional_blackton]): five walled harbour towns that choose between a moot and a lord's charter.
- **Belonton's sea-chiefs** (proposed [WB §3.4]): a confederacy of sea-orc holds whose Sea-Chief is chosen by voyages won; Dondor's partner in the Accord.
- **The Free Moot of the holds** at Dulundur (proposed [WB §3.4]): the iron holds settle tolls and iron prices; Dulundur's **Four Fires**, four valleys under one hall [FT regional_dulundur].
- **Bordon, the Road-Hold** and **Dreson, the Fen-Hold** (proposed [FT regional_bordon; FT regional_dreson]): holds whose chiefs keep the iron and the ring until challenged; Dreson's reed-council in a hall on black piles.
- **Smash's forest** (owner decision [OD]; card [BC 13]): Smash is king of the trolls of the Troll Forest and of no others; the trolls serve and guard him in his great cave, Holos. Proposed: under him the troll families keep the old rule that the oldest unbeaten troll leads each group [WB §3.5].
- **Burnikit** (owner decision [OD]; cards [BC 29; BC 36]): the goblin warrens of the Goldoroth Mountains under the **hobgoblin king**, a hobgoblin who "simply grew very big"; he rules this realm only. Hobgoblins are its guards and heavy labourers.
- **The Darks' orc–ogre moot** (proposed): four forest holds where orc chiefs and ogre clan-heads sit in one moot; ogres are few, strong and meat-eating, and orcs need their strength [BC 22].
- **The giants of the Giant Forest** (proposed): a few clans under cairn-keepers, apart from every moot.
- **Veshazel** (proposed): a demon lordship whose lord keeps a pact-name known only to his pact [WB §4 Pact-Rite], outside the Southern Dominion and courted by it.
- **The Wild Lands** (proposed [WB §3.4]): broken clans with no council; a hold that grows too big splits; held by whoever stays through a winter.

## 6. Beliefs and faiths

**What people believe** (proposed [WB §4]):

- **The Skull and the Fire** (orc clans): the clan honours its dead on skull-cairns and its mountain with a fire that never goes out. Holy sites: the skull-cairns and the **Fire-Mountain above Cocanoor**. Clergy: Fire-Speakers. The orcs do not say what lives in the mountain [WB §4]. The devil card places devils in the Goldoroth Mountains [BC 46]; whether the orcs' fire-cult knows or honours them is not stated here.
- **Hearth-Iron** (Dondor): a bar of iron kept at every hearth and passed to the eldest; the New Gods honoured as the forges that make iron. The owner rules that twelve main New Gods answer the twelve needs of mortals and that lesser New Gods exist [OD]; Dondor's smiths pray to the god whose need is the forge, naming no god [V: New Gods].
- **The Salt Tithe** (sea orcs), **the Luck of the Hold** (wild holds), **the Warren Luck** (goblins: a lamp kept burning; a lamp gone out is a warren doomed), **the Hunger and the Stone** (trolls: bog burials and stone-heaps), **the Cairn-Faith** (giants), **the Pact-Rite** (demons) [WB §4].
- **Volgan's envoys** promise much and are refused more often than they are heard; Volgan is a Great Spirit, though some call him a god [V: Religious Knowledge and False Gods].

**Truth kept apart from belief.** Devils are corrupted Lesser Spirits who formerly served an Old God and escaped to Aoaz; not every devil served Zol [OD; HO §2.6]. Many serve Volgan [BC 46]. The Dark Lands peoples know them only as the winged fires of the mountains and the islands.

## 7. History

| Date | Status | Event |
| --- | --- | --- |
| Before 1A | established | Men live for thousands of years before Aen [V: Timeline]. Proposed: the oldest orc holds are dug into the iron hills; the giants already keep the Giant Forest. |
| Before 1A, undated | owner decision | Devils, corrupted Lesser Spirits who served an Old God, escape to Aoaz [OD; HO §2.6]; when is open [HO §6]. Proposed: their roosts in the Goldoroth Mountains and the Islands of Death are older than the orc kingdom. |
| 1A, first half | proposed | Aenoran ships chart the coasts and leave chart names (Dondor, Bordon, Goldoroth); proposed: Aen's northern garrisons left in the Dark Lands become the ancestors of Dondor's men [WB §3.1 Dondor Brutes]. |
| 1A, second millennium | established | Volgan opens contacts with powers in the Dark Lands; the alliances are selective; orcs and goblins are in his armies [V: The First Age of Aoaz §4]. |
| 1A, late | established | Portions of the Dark Lands join Edran's Grand Alliance [V: The First Age of Aoaz §5]. Proposed: **Rovek of Dondor** leads Dark Lands soldiers who know Volgan's allies [V: The First Age of Aoaz §5]. |
| 2A, early | established | Many orcs and goblins keep fighting for Volgan after his banishment; the independent Dark Lands return to turmoil [V: The Second Age of Aoaz §I]. |
| 2A, middle | proposed (vault episode) | **The War of the Black Roads**: Elzon's followers try to control the routes through the Dark Lands; an independent confederation opposes them; Aenor briefly backs it [V: The Second Age of Aoaz]. |
| 2A, late | established direction | **The Opening of the Passes**: orc and goblin armies descend from the Dark Lands and rise from deep underground [V: The Second Age of Aoaz]. Proposed: the goblin warrens of Ellenmoor open their deep ways for Elzon's hosts and close them again when he does not pay. |
| 3A, 1 to 1260 (proposed length) | established direction | Elzon relies on orc and goblin forces [V: Elzon's Order]. Proposed: **the Buried Wars** (3A 431 to 690) between Elzon's garrisons and the holds erode his manpower [V: The Third Age of Aoaz]. |
| 3A, about 1000 | proposed | **The Great Lamp.** The goblin warrens under the Goldoroth Mountains raise one big hobgoblin as their king to keep Elzon's recruiters out; the kingship of Burnikit is born. |
| 4A, first centuries | established | The great invasions of orcs and goblins have ceased [V: The Fourth Age of Aoaz]. |
| 4A about 1100 to 1450 | proposed | Orc clans move from the hills into the volcano country and the iron hills [WB §1 migrations]. |
| 4A about 1450 | proposed | **Orc warlords unite the inner Dark Lands as Goldoroth**; its wars with Dondor begin [V: Fourth Age Chronology §III]. |
| 4A about 1500 | proposed | Goldoroth's first bombards, bought from Burnikit's powder-makers, break Dondor's southern stockades; Dondor answers with beacon towers. |
| 4A about 1600 | proposed | **The Dark Sea Accord** of Dondor and Belonton (working name [V: Great Powers and Relations]) is sworn on an iron bar and a skull sunk in the sea. |
| 4A 1748 | established start, proposed date | Armed peace: raids, gifts, tribute, beacons, envoys from the south; no war [SS Dark Lands; MS dark_lands, Phases]. |
| 4A 1755 to 1757 | proposed | Goldoroth's war for the Dark Lands; the Accord stands or breaks; sworn holds open Volgan's northern front [MS dark_lands, Phases]. |
| 4A 1755 to 1757 | established | Zol's forces move through islands and straits toward the settled kingdoms [V: The Fourth Age of Aoaz §IX]; the coasts of the northern strait watch for them (proposed [MS dark_lands, Phases]). |
| 4A 1757 to 1760 | proposed | Sworn holds lose their master when Volgan's body is destroyed; Goldoroth consolidates [MS dark_lands, Phases]. |

**Where the region can diverge** (play): Goldoroth can unite the Dark Lands, be broken by the Accord, or swear to Volgan; the free holds can bow to the Iron Yoke or hold the Free Moot together; Smash can wake his forest against an invader; the hobgoblin king can sell powder to every side; the demons of Veshazel can join the Southern Dominion or stay free [MS dark_lands §2 to §7; FT goldoroth].

## 8. Neighbours and relations

| Neighbour | Relation (proposed unless marked) |
| --- | --- |
| North Lands | Across the Northern Dark Strait: Leren ships at Blackton, Lerendor's lean on the Dark Shore [MS lerendor_narrow_strait §9]. |
| Middle Lands and Aenor | Across the Southern Dark Strait and Gaelmael; Aenor once backed the free confederation against Elzon [V: The Second Age of Aoaz]. |
| Ember Lands | Volgan's envoys from Nafeher court every hold; his authority does not extend to the independent Dark Lands [V: Volgans Ember Lands]; the Sea of Dolon leads south toward Dolon. |
| Zol's Mistake | The dead come through the straits late in the age [V: The Fourth Age of Aoaz §IX]. |
| Within the region | Goldoroth and Dondor: armed peace [SS Relations]; Dondor and Belonton: the Accord; the free holds: Goldoroth presses them and Dondor needs their iron [WB §3.4]; the Troll Forest and the giants are left alone; Burnikit sells to everyone; Veshazel is shunned. |

## 9. Wildlife and creatures

| Creature | Habitat | Rarity | Effect |
| --- | --- | --- | --- |
| **Bone-hounds** (former card name "warg", a name from other fiction, replaced [OD]) | with orcs and goblins, in caves and forests | common here | Wolf-like, ridden by orcs and goblins, see well in the dark, crush and digest bones [BC 15]; the Dark Lands' cavalry. |
| Black boar (Orcish *grunt* [LG §3.18]) and ravens (*krah*) | the forests | common | Hunting, omens, banners. |
| Ash-moths (proposed: grey moths that breed on the volcano's warm slopes) | the Goldoroth slopes | swarms after ash-falls | Strip fields after an ash-fall; the Fire-Speakers read their swarms. |
| Fen eels (proposed) | Dreson's fens, the Dondor Fen | common | Dreson's food and trade [FT regional_dreson]. |
| Forest trolls | the Troll Forest | few | As tall as old trees, stone-skinned, always hungry, in groups of three to five; they turn to stone in sunlight and keep to the shade [BC 59]. |
| Devils | the Goldoroth Mountains, the Islands of Death | very few | Huge, winged, horned, fighting with claws and fire; many serve Volgan; a dead devil can be raised again by a rite that throws its skull into lava [BC 46]. Nature: corrupted Lesser Spirits [OD]. |
| Ogres | caves of the Darkness | few | Meat-eaters with clubs and thrown stones, poor-sighted, stronger than orcs [BC 22]. |

## 10. Settlements

| Settlement | Realm | Size (proposed) | Why it stands there |
| --- | --- | --- | --- |
| **Cocanoor** | Goldoroth | about 30,000 (model 55,000 [DM settlements]) | Working seat [V: Great Powers and Relations] at the foot of the Fire-Mountain; cliff-city of black stone and red light [WB §3.4]. |
| **Notbuton** | Dondor | about 18,000 (model 30,000) | Working seat; on the forest edge facing the straits [DM settlements]. |
| **Dontadur** | Blackton | about 12,000 | The largest of the five walled harbours, where the Iron Road meets the sea [WB §7]. |
| **Lesderle** | Dulundur | about 10,000 | The hall of the Four Fires in the largest valley [DM settlements]. |
| **Notle** | Belonton | about 5,000 | The sea-orc harbour on the borderland coast [DM settlements]. |
| **Doldes** | Dark Gate | about 5,000 | The gate hold on the road south [DM settlements]. |
| **Zubudor** | Bordon | about 4,000 | The Road-Hold's caravan inns on the Black Road. |
| **Dolido** | Dreson | about 3,000 | The reed-council's hall on black piles. |
| **Holos** | Troll Forest | a great cave | Smash's cave, where many trolls live and guard him [BC 13]; in the forest's heart (proposed placement). |
| **Ellenmoor** | Burnikit | warrens of about 15,000 | The card's caves where hobgoblins are most numerous [BC 29], proposed as the warm caves under the Goldoroth Mountains; the hobgoblin king's hall. |
| **Gollonlon** | Fondor | about 5,000 | At the Fonoor Forest's edge [DM settlements]. |
| **Dobudo** | Dun | about 4,000 | On the Dun Sea. |
| **Veshazel** (proposed) | Veshazel | a black hold | Infernal *vesh* "ash" + *-azel* "hold" [LG §3.24]: the demon lord's seat on the Goldoroth Ember Lands. |

## Sub-regions in depth

### Goldoroth and the Fire-Mountain

The orc warkingdom of the inner Dark Lands, united about 4A 1450 (proposed), around the Fire-Mountain above Cocanoor [V: Fourth Age Chronology §III; GM volcano_goldoroth]. Its Volcano Clans speak slow, deep Orcish, march under a Warking and keep siege forges that cast bombards [WB §3.4; OD]. It wants the whole region and has not the strength to take it [WB §5 Goldoroth]. Its tree runs from the moot and the forge-pits to one kingdom of the Dark [FT goldoroth].

### The Troll Forest (former label Troy's Forest)

**Name.** The drawing reads "Troy's Forest" [NT] and earlier specs give the trolls a leader "Troy the Old" [Characters spec]; Troy is a name of real myth and history and is replaced [OD]. The vault's name **Troll Forest** stays; the trolls' own name for it is proposed as *Grootoom*, Trollish *groot* "forest" + *-oom* "great place" [LG §3.20].

**People.** Forest trolls [BC 59] under **Smash**, king of the trolls of this forest only [OD; BC 13]: by far the largest troll, who slowly turns to stone in sunlight and so walks at night, when he seeks out castles and villages and smashes them [BC 13]. His trolls live with him in the great cave of **Holos** [BC 13]. The vault keeps the Troll Forest a separate polity that belongs to nobody [V: Great Powers and Relations; V: The Campaign of 4A 1748]; Smash's kingship is over trolls, not over the region. The regional tree gives the forest "troll silver", a forest nobody enters and envoys sent back lighter [FT regional_troll_forest].

### Burnikit and the caves of Ellenmoor (proposed)

**Land.** The warm deep caves under the Goldoroth Mountains, heated by the volcano (proposed). **People.** Goblins, smaller and weaker than orcs but cleverer and more skilled with tools, lovers of gold and fine things, short-lived and often sickly from rotten food and bad air, weakened by sunlight [BC 36]; hobgoblins, bigger and stouter, are their guards and carry stone, and are most numerous in the caves of Ellenmoor [BC 29]. **Rule.** The hobgoblin king rules Burnikit and no other goblins [OD]; goblin quarters under the orc holds are not his. **Name.** Goblin Cant *burnik* "fire" + *-it* "nest" [LG §3.19]: the fire-nest.

### The Giant Forest and the Borderline of Giants (proposed)

**Land.** The drawn **Giant Forest**, the **Giant River** and **The Borderline of Giants** below the Dark Forests [NT; GM river_giant]. **People.** A few hundred giants, the vault's independent Dark Lands giants [V: Kingdoms Factions and Conflicts], who keep the forest behind a line of cairns that men and orcs do not cross. They may be the vault's **Forgotten Giants**, whose place is open [V: Peoples of Aoaz]; this dossier proposes the Giant Forest as their home and asks the owner. **Name.** *Hoorunoron*, Giants' Speech *hoorun* "forest" + *-oron* "giants' land" [LG §3.21].

### Veshazel and the Goldoroth Ember Lands (proposed)

**Land.** The drawn **Goldoroth Ember Lands**, the black south of the Goldoroth arm facing the Sea of Dolon [NT]. **People.** Demons, corrupted angels in the existing account [V: Peoples of Aoaz]: the vault's independent Dark Lands demons under a ruler of their own [V: Kingdoms Factions and Conflicts]. Proposed: a lord who keeps a pact-name, with a few hundred demons and their thralls, courted by the Southern Dominion and by Goldoroth, sworn to neither. The demon card says demons are evil and cunning, cast fire from hand and mouth, and some can move in a blink from place to place [BC 48].

### The Islands of Death

The drawn dots east of the black island Goldoroth [NT], proposed as the devil card's "Death Islands" [BC 46]: a roost of devils, shunned by every ship. No realm; nominally within Goldoroth's waters.

## 11. Roster proposal

**Proposed.** Seventeen realms where the roster has twenty-four, with every people the vault and the owner place here given a realm or a clear place. The four realms the vault keeps separate (Bordon, Dreson, Dulundur, the Troll Forest [V: Great Powers and Relations]) stay separate.

| Realm (local name) | People and culture | Political form | Capital | Approximate extent | Why it exists |
| --- | --- | --- | --- | --- | --- |
| **Goldoroth** (*Gruzgoroth*) | orcs, Volcano Clans | warkingdom under a Warking | Cocanoor | the Goldoroth arm's heart: the volcano, South and West Goldor, Sungodor, Gord, Zuriath | Working power [V: Great Powers and Relations]. |
| **Dark Gate** | orcs, Volcano Clans | tributary gate-hold of the Iron Yoke | Doldes | the Dark Gate pass and Bold's border | The pass that tolls every caravan [WB §6.6]. |
| **Burnikit** | goblins, with hobgoblins | warren-kingdom under the hobgoblin king | Ellenmoor | the deep caves of the Goldoroth Mountains | Owner decision on the hobgoblin king [OD]; cards [BC 29; BC 36]. |
| **Veshazel** | demons | demon lordship | Veshazel | the Goldoroth Ember Lands | Vault's independent Dark Lands demons [V: Kingdoms Factions and Conflicts]. |
| **Dondor** | men, Dondor Brutes | clan-moot kingdom; leads the Dark Sea Accord | Notbuton | the Dondor plain, the Dondor Forest, the lower Giant River, the Dondor Fen | Working power [V: Great Powers and Relations]; grown from one state, as the foundation spec proposes [WB §5 Dondor]. |
| **Blackton** | men, Dondor Brutes and Leren | league of five walled harbour towns | Dontadur | the eastern coast towns | Free human towns of the coast [V: The Campaign of 4A 1748]. |
| **Belonton** | orcs, Sea Orcs | sea-orc confederacy | Notle | the Belonton borderlands and isles, the Gull Kingdom's cliffs, the Lestern Isles | Working Accord partner [V: Great Powers and Relations]. |
| **Bordon** | orcs, Iron Clans | Road-Hold | Zubudor | the Black Road's gorge by Soun Lake | Separate polity [V: Great Powers and Relations]. |
| **Dreson** (drawn Bredo) | orcs, Iron Clans | Fen-Hold under a reed-council | Dolido | the fens | Separate polity [V: Great Powers and Relations]. |
| **Dulundur** | orcs, Iron Clans | four valleys under the Four Fires; host of the Free Moot | Lesderle | the long valley's four holds | Separate polity [V: Great Powers and Relations]. |
| **Troll Forest** (*Grootoom*; former label Troy's Forest) | trolls, forest trolls | troll king's forest | Holos | the Troll Forest | Separate polity [V: Great Powers and Relations]; Smash [OD]. |
| **Hoorunoron** | giants | cairn-kept forest enclave | a cairn-hall by the Giant River | the Giant Forest beyond the Borderline | Vault's independent Dark Lands giants [V: Kingdoms Factions and Conflicts]. |
| **The Darks** | orcs and ogres | orc–ogre moot of four holds | a forest hold | the Dark Forests' band and the Hills of Dark | Ogres are an independent Dark Lands people [V: Kingdoms Factions and Conflicts]. |
| **Fondor** | orcs, Iron Clans | timber and charcoal hold | Gollonlon | the Fonoor Forest with Colost | The strait's timber. |
| **Dun** | orcs, mixed holds | swing crown of the eastern peninsula | Dobudo | the Dun peninsula with Dunbulinor | The Dun Sea's tolls. |
| **Britadon** | orcs, Iron Clans | iron hold | a hill hold | the south-east iron hills with Beriath | Iron of the south-east coast. |
| **Wild Lands** | orcs and broken clans | wild land without a council | none fixed | the Wild Lands moor and the Doltu marsh | A contested wild land "held by whoever stays through a winter" [WB §6.6]. |

**Comparison with the current roster (24 rows, tags Y19 to Y8C [RO]).**

| Current row | Fate (proposed) | Why |
| --- | --- | --- |
| Y1A Goldoroth | kept, enlarged | Takes the volcano clans' holds. |
| Y48 Sungodor, Y4C Gord, Y4A Zuriath | merged into Goldoroth | The hold where the first Warking was acclaimed, the Warking's chain-smiths, the ash-glass ridge [WB §6.6]. |
| Y1A's Goldoroth Ember Lands | split off as Veshazel | Independent demons. |
| Y49 Dark Gate | kept, enlarged | |
| Y4B Bold | merged into Dark Gate | Its border strip lies under the same pass [NT]. |
| Y19 Dondor | kept, enlarged | One state cannot lead an Accord against an orc kingdom. |
| Y4I Blackton | kept | |
| Y1B Belonton | kept, enlarged | |
| Y4E Gull Kingdom, Y4G Lestern Isles | merged into Belonton | Sea-orc holds of the same coast [WB §3.4]. |
| Y43 Bordon, Y44 Dreson, Y4H Dulundur, Y45 Troll Forest | kept | Vault: separate polities. |
| Y4K The Darks | kept, people changed | Orcs with ogres. |
| Y8C Fondor | kept, enlarged | |
| Y4J Colost | merged into Fondor | Charcoal-burners of the same forest [WB §6.6]. |
| Y1C Dun | kept, enlarged | |
| Y4L Dunbulinor | merged into Dun | The toll-gatherers of the same peninsula [NT]. |
| Y4F Britadon | kept, enlarged | |
| Y4D Beriath | merged into Britadon | A neighbouring headland hold [NT]. |
| Y47 Wild Lands | kept, form changed | A wild land. |
| Y46 The Doltu | merged into the Wild Lands | Broken clans of the same moor and marsh. |
| (new) | Burnikit, Hoorunoron | Goblins and giants. |

## 12. Gameplay role

**Mechanics already specified** [MS dark_lands]: the armed peace (border tension, raids as decisions and events, beacon-fires); the Dark Sea Accord's resolve; Goldoroth's horde and its four clan blocs; sway, the Iron Yoke and unity; the free holds and the Free Moot; Volgan's agents and the pact; the Sea of Darkness and sea mastery; the straits; the war for the Dark Lands; the Gathering Dark; the four phases of the age. The spec's rule that no named hold is goblin until the owner decides is answered by the owner's decision on the hobgoblin king [OD].

**Additions proposed here:**

- **Powder.** Burnikit sells powder and handguns to the highest bidder; Goldoroth's bombards need it, and an Accord that buys Burnikit's favour denies it to Cocanoor.
- **Smash's night raids.** The troll king walks at night; an army that camps in the Troll Forest suffers night attacks; a realm that leaves the forest alone and pays its "troll silver" is spared.
- **The giants' Borderline.** Crossing the cairn-line of Hoorunoron angers the giants, who then join any war against the crosser.
- **Veshazel's pact.** A demon lordship that can lend fire and terror for a price, and that the Southern Dominion wants as its northern foothold.
- **Devils.** Rare devil events from the Goldoroth Mountains and the Islands of Death; Volgan's agents can call them.
- **Ash-falls** from the Fire-Mountain as harvest events.

**Focus-tree themes.** Goldoroth: the moot, the forge-pits, the Fire-Mountain, the Iron Yoke, the armed peace, the southern question, the dead on the shore, one kingdom of the Dark [FT goldoroth]. Dondor: the Brute-King's hall, the beacon hills, the Accord [FT regional_dondor]. Blackton, Bordon, Dreson, Dulundur, the Troll Forest [FT regional_*]. The shared tree for the smaller holds [FT shared_dark_lands]. New, proposed: Burnikit (the hobgoblin king, powder, the deep ways) and Hoorunoron (the cairn-line, the old forest, a door opened once).

**AI behaviour (proposed).** Goldoroth raids and gifts until the war; Dondor keeps the Accord; the free holds bow to the Yoke only when Goldoroth is strong; the Troll Forest and Hoorunoron never attack first; Burnikit never joins a faction; Veshazel swears to Volgan only when he marches [MS dark_lands, AI].

## 13. Questions for the owner

1. **Population.** May the Dark Lands be revised from 3.4 million to about 1.6 million, and the trolls from 19,000 to about 600 (section 3)?
2. **The Forgotten Giants.** Are the giants of the drawn Giant Forest and the Borderline of Giants the vault's Forgotten Giants [V: Peoples of Aoaz; NT]?
3. **Gaelmael.** The Middle Lands dossier proposes Gaelmael for the drawn "Sea of Death" between the Dark Lands and the Middle Lands, and this dossier follows it; may the drawn name be retired?
4. **The straits.** The model's places for the Northern and Southern Dark Straits are unconfirmed proposals [GM]. Are they right?
5. **Leaders named after their realms.** Earlier specs name the chiefs after their holds or labels: Chief Bordag of Bordon, Chief Dresk of Dreson, Chief Dulgash of Dulundur, Chief Belon of Belonton, Lord Haclton of Blackton (from the drawn "Haclton Fable"), Bredo the Fire-Speaker (from Dreson's drawn label Bredo) [Characters spec]. May they get personal names from Orcish and Dondric stems?

## 14. Sources

- **[OD]** owner decisions of 24 October 2026, relayed by the coordinator (direct replacement of borrowed names; renaming of ill-fitting labels; Smash and the hobgoblin king rule their own realms only; gunpowder; devils; no exact ages; the twelve main and the lesser New Gods).
- **[V: note §heading]** lore vault `docs/lore/vault/`: `05 - Geography/Aoaz and Its Regions.md`; `05 - Geography/Volgans Ember Lands.md`; `04 - Peoples/Peoples of Aoaz.md`; `06 - Politics/Great Powers and Relations.md`; `06 - Politics/Kingdoms Factions and Conflicts.md`; `06 - Politics/Elzons Order.md`; `07 - History/The First Age of Aoaz.md` §4, §5; `07 - History/The Second Age of Aoaz.md` §I and the Dark Lands sections; `07 - History/The Third Age of Aoaz.md`; `07 - History/The Fourth Age of Aoaz.md` §IX; `07 - History/Fourth Age Chronology.md` §III; `07 - History/The Campaign of 4A 1748.md`; `07 - History/Timeline.md`; `01 - Cosmology/New Gods.md`; `01 - Cosmology/Religious Knowledge and False Gods.md`.
- **[HO §n]** `docs/zin-handoff/01-CONTEXT-AND-CANON.md` (§2.6 devils; §5.1 rules F1 to F8 on seas; §6 chronology issues).
- **[GM id]** `tools/content/data/geography/aoaz.json`; spec `docs/specs/01_map/05_geography_model.md`.
- **[NT]** `docs/name_table.md`, `tools/content/data/labels.json` (sheet Dark Lands).
- **[RO]** `tools/content/data/countries.json` (scan Dark Lands).
- **[DM]** `docs/specs/02_lore/07_demography_and_settlement.md` §1, §4 and `tools/content/data/world/demography.json`.
- **[WB §n]** `docs/specs/02_lore/05_world_bible.md` (§1, §3.1 Dondor Brutes, §3.4 orc and goblin cultures, §3.5 trolls, §4, §5 Goldoroth and Dondor, §6.6, §7).
- **[LG §n]** `docs/specs/02_lore/06_languages.md` (§3.4 Dondric, §3.18 Orcish, §3.19 Goblin Cant, §3.20 Trollish, §3.21 Giants' Speech, §3.24 Infernal, §7).
- **[SS]** `docs/specs/02_lore/01_start_situation.md` (Dark Lands; Relations at the start).
- **[EC]** `docs/specs/03_gameplay/02_economy.md`.
- **[MS file]** `docs/specs/04_mechanics/dark_lands.md`, `lerendor_narrow_strait.md`.
- **[FT file]** `docs/design/focus/goldoroth.json`, `regional_dondor.json`, `regional_blackton.json`, `regional_bordon.json`, `regional_dreson.json`, `regional_dulundur.json`, `regional_troll_forest.json`, `shared_dark_lands.json`.
- **[BC n]** `docs/lore/sources/bestiary_cards_part1.md` and `bestiary_cards_part2.md` (13 Smash, 15 warg, 20 orc, 22 ogre, 29 hobgoblin, 36 goblin, 46 devil, 48 demon, 59 forest troll).
- **[Characters spec]** `docs/specs/02_lore/02_characters.md`.
