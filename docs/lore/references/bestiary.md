# The bestiary of Aoaz, and its ecology in play

**Status:** Draft for the owner's review. **Date:** 24 October 2026. **Requirements:** R-40 (the bestiary grows from the transcribed cards) and R-41 (habitats, behaviour and rarity reach travel, farming, settlement, trade, war and local tradition).
**Data:** [tools/content/data/world/bestiary.json](../../../tools/content/data/world/bestiary.json) holds every entry of this file in machine-readable form, with the same ids.
**Companions:** the card transcriptions and canon checks ([bestiary_cards.md](../sources/bestiary_cards.md), [part 1](../sources/bestiary_cards_part1.md), [part 2](../sources/bestiary_cards_part2.md)), [knowledge_layers.md](knowledge_layers.md) (what player text may know), [magic_and_wizards.md](magic_and_wizards.md), the voice guide [09_voice_and_style.md](../../specs/02_lore/09_voice_and_style.md), and the regional dossiers in `docs/lore/regions/`.
**Sources read:** the 31 cards and the figure drawings of the transcriptions; the owner's decisions K9 to K37 in `docs/specs/INTEGRATION_DECISIONS.md`; the vault (Canon Policy, `02 - Spirits/*`, `04 - Peoples/Peoples of Aoaz.md`, the figure pages of Horos, Golbran, Kusven, Roka and the King of Demons, the Abyss, the Castle of Yeldenne); section 9 and the inhabitants, livelihoods and hazards of all fifteen dossiers; the roster `tools/content/data/world/roster.json`; the dictionaries of `languages.json` and `languages_new.json`; `warfare_units.json` and `warfare_equipment.json`; `economy.json`; and the modifier documentation of the installed game (`documentation/modifiers_documentation.md`) with the vanilla state modifiers that use `attrition_for_controller`, `army_speed_factor_for_controller` and `local_supplies_for_controller` (`common/dynamic_modifiers/0_dynamic_modifiers.txt`, `skirmishes_against_imro`; `SEA_dynamic_modifiers.txt`).

## How to read this file

- **E** is established (the owner's cards as reconciled by his decisions, or the vault); **P** is proposed here or in a dossier and replaceable; **O** is open, a question nobody in the world can answer and the owner has not settled. The JSON's `canon` field is `established` when the creature itself and its main traits are E, even if its new name is P, and `proposed` when the creature is new.
- **Sizes** are given against a man, because that is how the people of Aoaz measure a beast; the card's own figure follows in brackets for the art and model pipelines (a man is 1.8 m on every card). Player text uses paces, men's heights and comparisons, never metres.
- **No age of any being is stated** (K18; Canon Policy, Ages of beings). Every life span on the cards is dropped; where long life matters, it is written as relative age ("outlives a man's grandsons").
- **Names from other fiction or real myth are replaced** with names from the local languages, the former card name kept as `formerName` (K14, K27). Renamed creatures are the owner's own beasts under a new word, never new creatures.
- **Seas are named without "Ocean"** (K29). Where a map sea still carries the word, this file uses its own word alone or a plain description: the central sea, the Frozen sea, the Norrai water, the Leren water, the Rim, the Onp, the Kradlon water, the Pupor inner sea, the Santon water, the Sun sea of the South Lands and the Peace water.
- **Belief needs a believer.** Under "Belief and truth" the believer is named in the same sentence; the truth that follows is for writers and builders only, and "Public text" says what player-facing text may say.
- **One creature, one name.** A beast that lives in several lands keeps one name, with the local words listed beside it; section 2.8 records every duplicate in the dossiers that this file merges or tells apart.

## 1. The creatures of the cards

Thirty-one cards, each with the drawings that belong to it. Every claim of the card is kept unless an owner decision or the vault changes it, and the change is named under "Reconciled".

### 1.1 Tzikor (former card name Vinocorne)

**Kind:** other, a moving plant. **Size:** from a tall man's height to three times it (card 2 to 6 m, drawn 4 m). **Habitat:** the Aenor Forest of the Middle Lands, in sunny clearings and at the edges of the Baelim groves. **Rarity:** uncommon, and hard to see.
**Name:** Orran *tzikor* "thorn", the word of the Redbark of the neighbouring Bloody Forest, borrowed by the Selen rangers (P, Middle Lands dossier §2.5a).

**Behaviour.** A tzikor stands among the forest flowers with one to four great white blossoms with yellow hearts on arching stems, above a body of leaf and woody stem that a traveller takes for a flowering shrub until it moves. It walks slowly on two legs that end in pointed woody stakes, strikes with thorned arms that pierce like spears, and shoots poison from its blossoms when something comes close. Its sap, which the card calls blood, is so poisonous that the skin it touches begins to rot, which is why the rangers fight it with long blades and never with their hands.

**Belief and truth.** The Selen rangers say a tzikor flowers only where a man has died in the wood, and their woodcutters will not work a clearing that shows white flowers out of season. The truth (P) is that the tzikor gathers in the sunny clearings where the forest's dead also lie longest unburied, so the rangers' rule keeps men alive whatever its reason. The Redbark, who named it, call it a plant that hunts, and nobody in Aoaz has settled whether they are right.

**Relations.** Redbark poisoners milk the blossoms for arrow-venom (P). The thorn-bees of the forest's edge take its nectar and make the numbing thorn-honey (section 2.6). The Baelim let it be, and men take this as a sign that the two are of one mind, which is not known.

**In play.** Part of the Aenor Forest's attrition; the woodcutters' event "White Flowers in the Clearing"; the Redbark's venom arrows. Never a unit.

**Reconciled.** Every card claim is kept except its life span (K18); "Rush Forest" is the Aenor Forest (K21); the name is replaced (K27). **Public text:** the tzikor by name, its thorns, poison and flowers.

### 1.2 The King of Demons (card title "Satan")

**Kind:** other, a figure: a demon, and so of the corrupted angels of the vault's account. **Size:** five times a man's height (card 9.8 m). **Seat:** the Nether, in the Halls under Mount Nether (E seat, K15; the Halls are P, Nether dossier). **Rarity:** unique.
**Name:** an original name is not chosen yet (K15); the card's real-world name is a former label only and never appears in any text.

**Behaviour.** The card makes him the king of the demons, very powerful and wise, red-skinned, with great curved black horns, bat wings, a long tail, gold at his wrists and ankles and a trident whose three prongs are clusters of red crystal blades, which he throws and kills with. He can be summoned by a rite and bargained with, and his pacts give a mortal a power in life, as the card's example has it, to throw fire from the hands.

**Belief and truth.** The pact-sellers of Veshazel tell their buyers that the king owns a bargainer after death, because the fear makes men pay promptly. The truth (E, K15) is that his pacts bind the living and the souls of the dead remain Zol's, so whatever the king takes, he takes while the bargainer lives (P: service, tribute, thralls and the keeping of a bargain to the letter). His title does not make every demon his subject (vault).

**In play.** The pact-craft of the Nether ([magic_and_wizards.md](magic_and_wizards.md) §3.13): a decision "Bargain with the Nether" whose price is paid in life. Not a unit. Demon art may use the card's pentagram and never the cross (K26).

**Reconciled.** Name and seat by K15; the card's age is dropped (K18); the card's uncertain "Teitonis or Tritonis" is superseded by the Nether. **Public text:** "the King of Demons", without a name; his pacts as the believer's account.

### 1.3 Sand golem

**Kind:** other; whether golems are made beings, bound spirits or a people is open (O, card canon check). **Size:** one and a half to nearly three times a man (card 2 to 5 m, drawn 3 m). **Habitat:** the Noris Desert of the South Lands, in caves and walking the dune surfaces, and the desert's northern edge below the wells of Noris. **Rarity:** uncommon.
**Name:** the Noris call them *hoolkaar*, Noric "sand-stone" (*hool* + *kaar*, P); the Common Speech keeps "sand golem".

**Behaviour.** A sand golem is a broad, long-armed figure of brown sand and stone with spires of rock and crystal growing from its head and shoulders, so like the dunes that a caravan may camp beside one without knowing it. It is peaceful until it is disturbed and then very angry, and it fights with thrown sand, hurled stones (drawing 11 shows one with a boulder) and its own great strength, behind a skin that arrows and spears hardly mark. The card says golems like gold and cannot die of age.

**Belief and truth.** The caravan-masters of Stabilo say a golem is a dune that remembers being a man, and they will not light a fire on a dune that has moved in the night. The oasis-folk leave a bead of gold at a cave mouth they must pass, and swear it works. The truth (P) is that the golems gather gold into their caves, which is why the desert's richest sands lie in golem country and why robbing a golem's cave is the surest death in the South (South Lands dossier §9).

**In play.** Off-track attrition in golem country; the event "The Golem's Cave"; the decision "Mine the Southern Sands", which reads the economy's gold of the southern desert (`economy.json`, `specialSites.noris_south_desert`) as golem gold. Never a unit.

**Reconciled.** All card claims kept; "immortal" read as "does not die of age" pending the owner's ruling on their rank. **Public text:** what caravans and the oasis-folk say; never a rank.

### 1.4 Roka

**Kind:** other, a figure: the greatest of the people of the Abyss. **Size:** more than twenty men stood on one another's shoulders (card 42 m). **Seat:** his great castle in the Abyss of the Ember Lands, where he is served. **Rarity:** unique.

**Behaviour.** Roka is the King of the Abyss, very strong, rhinoceros-headed, in black plate trimmed with gold under a deep-blue cape, and his weapon is a long-hafted hammer with a head of grey stone that crackles with blue light and sends a shock through the ground when it strikes. He wore the Necklace of the Abyss, whose crystal, the card's "stone of Abyss", made him stronger.

**Belief and truth.** Volgan's orcs say nobody comes back up from the Abyss except the one who stole from it (Ember Lands dossier, legends). The truth (E) is that a master thief sent by Afrit took the necklace in the Fourth Age (P date 4A 1611), so in 4A 1748 Roka no longer wears it; what that cost him and what became of him are open (V5).

**In play.** No direct mechanic. The warfare data's Abyss-folk (`zin_abyss_folk`, script unlock) describe them as coming "when Volgan calls"; nothing in the vault binds the Abyss to Volgan, so the grant should come only from a story event, such as a bargain or a wrong done to the Abyss, and never as standing service (P, section 3.5).

**Reconciled.** The card's age is dropped (K18); "immortal" stands as his nature, his rank is open. **Public text:** Roka by name, "Roka's people", the necklace's theft only behind its gate (knowledge layers A6).

### 1.5 Sea serpent

**Kind:** beast. **Size:** as long as five to eleven men laid end to end (card 10 to 20 m, drawn 12.5 m). **Habitat:** deep water; most of all the Sea of Monsters off the north-west of the Middle Lands, and the deep middle of the central sea; seen off Hirolon Head. **Rarity:** rare.

**Behaviour.** The serpent is a long, thick sea snake that comes in several colours, the drawn one green with leaf-like scales, a row of orange spikes down its back, a horned snout, a bearded jaw and a broad finned tail. Its scales are so hard that no ordinary sword goes through them, and it swims faster than any ship under oar or sail; it rears out of the water to take small boats, and the card shows a ship sinking under one.

**Belief and truth.** The captains of Orohaf say a serpent follows a ship that carries a corpse, and they bury their dead at sea before they reach the Sea of Monsters. The truth (P) is that serpents follow the shoals and the ships that follow the shoals; the drawn name "Sea of Monsters" is the sailors' own record of them.

**In play.** No modifier can be put on a sea, so the serpents act through coastal events: ships lost on the Sea of Monsters, a carcass washed ashore that yields serpent-scale, and the rule that ships keep to the coast. Ballistae are the one weapon that answers them. Never a unit.

**Reconciled.** The card's "Belegaer" is a Tolkien name and is dropped; its deep sea is read as the central sea (P). The card's "[?Trenin?] Sea", where they are most numerous, is read as the Sea of Monsters (P, owner question 2). The speed figure and the life span are dropped (K18; the speed is written as a comparison). They are not placed in the Pupor Isles' waters unless the owner says that the Trenin Sea means them (Pupor Isles dossier §9).

### 1.6 Smash

**Kind:** other, a figure: the king of the forest trolls of the Troll Forest and of no others (K22). **Size:** the height of a hill, sixty men and more (card 112 m). **Seat:** the great cave of Holos in the heart of the Troll Forest of the Dark Lands, where many trolls live and guard him (P placement, Dark Lands dossier). **Rarity:** unique.

**Behaviour.** Smash is green-brown, tusked and pot-bellied, with grey iron cuffs on his wrists, and he is so strong that the card shows his fist crushing a castle tower and men standing on his open palm. Sunlight slowly turns him to stone, so he keeps to his cave by day and walks at night, when he seeks out castles and villages and smashes them.

**Belief and truth.** The men of Bordon point to a stone hill shaped like a crouching man and say it is a troll who stayed out past dawn, and the trolls neither confirm nor deny it. The truth is the card's: the sun stiffens a troll slowly, so a troll caught out is slowed, then stilled, and Smash, the largest, has the longest walk home (E trait, P detail).

**In play.** The night raids of the Troll Forest and its "troll silver" (Dark Lands dossier §12); when an army invades the forest, Smash wakes (a story grant, section 3.5). Smash as the forest's unique commander is P.

**Reconciled.** "King of the trolls" is limited to his forest by K22; the card's "Holos" is his cave; the card's age is dropped. **Public text:** Smash by name, his night walks and his forest.

### 1.7 Wurgh, or bone-hound (former card name warg)

**Kind:** beast. **Size:** a shoulder as high as a man's chest or over his head, and twice that when it rears (card 1.4 to 1.9 m at the shoulder, drawn 1.6 m). **Habitat:** with orcs and goblins only: the moors and forests of the Dark Lands, the Forests of Darkhere under Burrikkrit, the warm valleys of Glimkit, the warrens of Burnikit and Volgan's island. None in the West, the North or the free lands of men. **Rarity:** common in the Dark Lands, uncommon on the surface elsewhere.
**Names:** *wurgh*, Orcish "wolf", is the creature's name (Middle Lands dossier, [LANG]); men of the north and west call it the **bone-hound**, for its jaws. These are two words for one beast, not two beasts.

**Behaviour.** A wurgh is a massive, shaggy, wolf-like beast with a black muzzle, small ears, narrow yellow eyes and a bristling rust-and-black mane, its shoulders standing higher than its hips. It sees better in the dark than by day, attacks with its claws and its weight, and its jaws, which the card makes three times stronger than a lion's, crush bone so that it eats and digests the whole of what it kills. It eats everything smaller than itself, and when it is hungry it eats things larger.

**Kinds (P, after the card's "there are many kinds").** The **moor wurgh** of the Dark Lands is the big war-mount of the orc raiders. The **warren wurgh** of Burrikkrit and Burnikit is smaller, short-coated and pale-eyed, bred by the goblins to carry a rider in a tunnel as well as on a road. The **shaggy wurgh** of Glimkit grows a thick winter coat in the warm valleys and is ridden only in summer, because the deep cold kills it as it kills its riders' courage.

**Belief and truth.** Herders of the southern Vale say a bone-hound that has tasted a man will eat nothing else afterwards. The truth is the card's: it eats anything at all, and the herders' losses are mostly their sheep.

**Relations.** Orcs ride them for speed (card 20), goblins ride them on the surface (card 36), and the orc raiders of the warfare data ride "shaggy mounts that no one else will ride" (`zin_orcs_raiders`), which are wurghs. Men hunt them and do not tame them.

**In play.** Herd raids on the southern roads of the Middle Lands and the Dark Lands moors; the war mount of orc raiders and of proposed goblin riders; the decision "Break Wurgh Pups to the Saddle" for orc and goblin realms; the idea "Eyes in the Dark" for wurgh-riding realms.

**Reconciled.** The Tolkien name is replaced (K14); the card's "all parts of the world" is read inside Aoaz as "wherever orcs and goblins live". **Public text:** wurghs and bone-hounds by those names.

### 1.8 The people of the Abyss (card title "Rhino-Head")

**Kind:** people; their rank, their name and their history are open (V4). **Size:** eight to fourteen men tall (card 15 to 25 m, drawn 17 m). **Habitat:** the Abyss at the east end of the Nether Mountains in the Ember Lands. **Rarity:** rare.

**Behaviour.** They are huge, heavily muscled rhinoceros-headed folk with grey or brown hide, small ears, pale blue eyes and one or two horns; an ordinary one in the drawings goes bare-chested in a leather pauldron and broad trousers on three-toed feet. They fight with the horn, the fists and the feet, and they usually live alone.

**Belief and truth.** The card says they are always evil, and Volgan's orcs say the same. The vault holds that the monster peoples of Aoaz are diverse and serve no single master, so this file keeps the card's word as the orcs' belief and leaves each of Roka's people to answer for itself (P). Their solitude and Roka's served castle are reconciled thus (P): they keep apart on the ledges and galleries of the Abyss and come together only at Roka's hall.

**In play.** `zin_abyss_folk` by story grant only (section 3.5).

**Reconciled.** "Rhino-Head" is a working label of the card and is never a public name (V4: "Roka's people" or "the rhinoceros-headed folk of the Abyss"). **Public text:** as V4.

### 1.9 Orcs

**Kind:** people. **Size:** about a man, from a little shorter to a head taller (card 1.6 to 2.1 m). **Habitat:** almost everywhere, most of all the Dark Lands (Goldoroth and its iron hills, the free holds, the sea orcs of Belonton and the southern isles), and Volgan's island; caves, forests and sometimes castles. **Rarity:** the commonest of the monster peoples.

**Behaviour.** The card calls orcs "like a man and a pig put together", fierce, quarrelsome and short-lived compared with men, and says there are very many kinds of them, some of which cannot bear the sun. They fight with blades, bows and bare hands, and with catapults and black-powder guns where they have them (card 20; K19; Goldoroth carries gunpowder in the roster). They ride wurghs when they need speed.

**Belief and truth.** The card calls orcs stupid and weak, which the soldiers of Dondor repeat with feeling. The truth is that the word fits a common warband, not orc rule: Goldoroth has held the inner Dark Lands together and fought Dondor for centuries (vault), and its Fire-Speakers keep a craft of their own (magic reference §3.11).

**Beasts.** Wurghs to ride; the black boar (Orcish *grunt*) to hunt and to paint on shields; the raven (*krah*) for omens and banners; the ash-moth swarms of the Fire-Mountain, which the Fire-Speakers read.

**In play.** The existing orc sub-units; the wurgh mounts; ash-moth omens.

**Reconciled.** All card claims kept; the life span becomes "short-lived". **Public text:** free.

### 1.10 Ogres

**Kind:** people. **Size:** half again to twice a man's height (card 2.8 to 3.5 m, drawn 3.1 m). **Habitat:** caves and mountains, and forests where they live with orcs: the caves of the Darkness in the Dark Lands (the orc and ogre moot of the Darks), the Reeto Heights of the East Lands, and the caves of the Demonic Mountains in Volgan's island. **Rarity:** few.

**Behaviour.** The card's ogre is like a giant orc and looks like a troll, but it is smaller and weaker, a little cleverer, and the sun does not harm it. It eats only meat and kills with a club or a thrown stone; its sight is very poor, ogres are often very fat, and many are born with crooked limbs or other infirmities.

**Belief and truth.** The caravan-masters of the Rift Road say a Reeto ogre can be hired for meat and fought off with fire, and both are true often enough to be risky.

**In play.** The existing Ogre Brutes; the event "Ogres on the Rift Road"; the decision "Hire Reeto Ogres" for caravan realms of the East (section 3.7).

**Reconciled.** All card claims kept; "disabilities" is written "infirmities". **Public text:** free.

### 1.11 Horos

**Kind:** spirit, a Great Spirit (E). **Size:** three men tall (card 5.5 m). **Seat:** Castle Yeldenne at Mp'E in the Cold Lands, on his throne in the halls beneath the castle (E, Castle of Yeldenne and Glo); the card's name for those halls, Tol Hithi, is a former label, and an original name is not chosen (P here: Coldic *Dounhalv*, "the deep hall", the name the valley folk would give it). **Rarity:** unique.

**Behaviour.** Horos is an enormous knight in yellow-green plate with blue light in his eyes and a helm crowned with branching thorn-like spikes, and his sword, which glows pale blue, is among the strongest in this part of the world. He sits on his throne as if asleep, with Glo before him, wakes when anyone comes too close and kills the intruder; nothing pierces his armour, and his eyes see everything.

**Belief and truth.** The herders and charcoal-burners of the valley below the castle say the hall's lord kills those who come too close, and leave bread at the start of the Silent Road (Cold Lands dossier). They are right. "Immortal" on the card is his nature: he does not age, and he can still be killed, as he is in 4A 1753 on the historical path (E); how Afrit found the gap in armour that nothing pierces stays open.

**In play.** The existing Yeldenne and Glo mechanic; nothing in this file adds to it.

**Reconciled.** The castle is Yeldenne (K24); the card's age is dropped. **Public text:** the valley's beliefs; Glo's true nature only behind `zin_horos_dead`.

### 1.12 Men

**Kind:** people. **Size:** the measure (card 1.6 to 1.9 m). **Habitat:** every land of Aoaz, most of all the Middle Lands (the card's "Rush", the old name of Aenor). **Rarity:** the commonest people.

**Behaviour.** The card says men are much cleverer than the monster peoples, fight orcs most of all, and build knights, shields, stone castles and siege engines, which the vault's whole history bears out. The vault adds that the first men lived longer and were more gifted in magic than their descendants (E).

**The card's list of lesser peoples.** The card names orcs, trolls, goblins, wargs, "[?wuuks?]", ologs and cyclopes as the folk men outwit. Orcs, trolls, goblins and wurghs have their entries here. "Olog" is a Tolkien troll-name, "wuuks" is an uncertain reading, and cyclopes appear nowhere else; none of the three enters the bestiary until the owner says what they are (owner question 6).

**In play.** The beasts men keep are in section 2.1 and the table of section 3.5.

**Reconciled.** The life span is dropped (K18). **Public text:** free.

### 1.13 Hobgoblins

**Kind:** people, a goblin kind. **Size:** a head taller than a tall man (card 2 to 2.4 m, drawn 2.2 m). **Habitat:** with goblins, as their defenders and heavy workers; most numerous in **Burrikkrit**, the warrens under the Cursed Mountains and the southern Giant Mountains of the Middle Lands (the card's "Ellenmoor", replaced: Goblin Cant "tunnel-mountain"), a few in Glimkit and Burnikit, and none at all in some warrens. **Rarity:** uncommon.

**Behaviour.** A hobgoblin is a bigger, stouter goblin, warty and bald, with long ears ringed in gold and a beard, who carries the stone the small goblins cannot and holds the warren's gate with a great mallet. The king of Burrikkrit is a hobgoblin who simply grew very big, and he rules his own realm only (K22).

**Belief and truth.** The goblins of Burrikkrit say their king grew very big and very wise together, and that anyone who doubts the second may say so to the first. The truth is that he grew big; the wisdom is a matter of opinion in the warrens.

**In play.** Burrikkrit builds faster in its warren states, because hobgoblins carry the stone (section 3.3).

**Reconciled.** The single goblin king is limited to his realm (K22); Ellenmoor is renamed. **Public text:** free.

### 1.14 Krors

**Kind:** other, living stones; their rank and origin are open (O). **Size:** two and a half to five men tall (card 4.5 to 9 m, drawn 5.5 m). **Habitat:** the Lustras Hills south of the Herrodon Mountains in the Magical Lands (the card's "Salomonanos", read as the drawn Sacomananos, P placement). **Rarity:** uncommon.

**Behaviour.** A kror is a gorilla-shaped thing of black stone with boulder shoulders, a skull-like face and very long arms, which walks on its knuckles and hurls stones at anything that moves. The card calls krors completely indifferent and says they want to kill all the time, and that they do not die of age.

**Belief and truth.** The hill elves of Herrodon say the krors are the hills' own anger and that a traveller who stands still long enough is taken for a stone and left alone. Nobody has tried it often enough to say, and the truth is open.

**In play.** Nobody settles the Lustras Hills, and an army that marches through them is stoned (section 3.2). Never a unit.

**Reconciled.** All card claims kept. **Public text:** what the hill elves say; never a rank.

### 1.15 The small folk (card title "Hobbit")

**Kind:** people. **Size:** chest-high to a man (card 1.0 to 1.3 m). **Homelands:** **Dobbum** (Hearth-Speech "the home vale"; Gunwyn Dolw-Grewn), inland in the Ronbo basin of the West Lands behind strong neighbours, and **Tirlan** inside Hirolon's ring of mountains under the giants' protection (K35). **Names:** their own word for themselves is the Hearth-folk; men call them the Tirim (Common Speech) or the Bykkwyn (Gunwyn). **Rarity:** a people, rarely seen abroad.

**Behaviour.** The small folk live a farming life that is peaceful and free of danger, drink and smoke a great deal, rarely wear boots and rarely leave home, and the card says nothing ever happens to them, because their land is guarded. For Dobbum the guards are the dwarves who close the high passes and the Ronbo Watch; for Tirlan they are the giants (roster, K35).

**Beasts (P).** Pigs, geese, bees and a few ponies; they hunt nothing larger than a rabbit and are much troubled by rooks.

**Belief and truth.** The Gunwyn say the small folk are lucky. The truth is that they are well guarded and well hidden, and that they have chosen their neighbours with great care.

**In play.** "Nothing ever happens to them": while their guards stand, Dobbum and Tirlan are excluded from every beast raid and pest event of this file (section 3.3). Drawings 4 and 26 show small armed warriors who may be their own watch; that is not decided.

**Reconciled.** Names and homelands by K14 and K35; the life span is dropped. **Public text:** the names above.

### 1.16 Golbran (card title "Gorbatik")

**Kind:** other, a figure whose kind is unknown (E). **Size:** shoulder-high to a man (card 1.4 m). **Home:** the Magic Mountains of the Magical Lands, by the card; in 4A 1748 nobody says where he is. **Rarity:** unique.

**Behaviour.** Golbran is Varner's small grey-violet helper, with a smooth domed head and large round yellow eyes, a wizard who knows a great many spells and kills demons above everything else; the drawing shows him on a rock with blue magic wound about his fists inside a dome of pale light. He does not age, and he can die (K20), as he does in the palace at the end of the War of the Last Crowns.

**In play.** The journey and the last war, under their own gates (knowledge layers E5).

**Reconciled.** Gorbatik is Golbran (K20); the card's age is dropped. **Public text:** legend only before his gate.

### 1.17 Goblins

**Kind:** people. **Size:** a little shorter than a man (card 1.4 to 1.8 m). **Habitat:** inside mountains and caves where it is warm: Burrikkrit in the Middle Lands, Glimkit in the hot-spring valleys of the Coldor Mountains (K22), Burnikit in the warm rock of the Goldoroth Mountains, quarters under the orc holds and Volgan's island; they avoid the deep cold. **Rarity:** common.

**Behaviour.** The card's goblin is like an orc but smaller and weaker, cleverer, and better with tools; goblins love gold, jewels and fine objects, eat food that has gone bad, live in close, foul air, and so are sickly and shorter-lived than men. The sun makes them drowsy and weak, so they ride wurghs to cross open country quickly, and they fight in armour with axes, swords, bows, knives and spears.

**Beasts.** Wurghs to ride; rats and bats to eat when the hunting is poor; mukroms, which they trap and cannot sell (Middle Lands dossier); and the lamps without which no warren is lucky.

**Belief and truth.** In the Dark Lands the goblins keep a lamp burning in every warren and say a warren whose lamp goes out is doomed (the Warren Luck). The truth is that a warren whose lamp has gone out has usually lost its air, which dooms it quickly.

**In play.** The existing Goblin Skirmishers; wurgh riders (P); goblin lamps, traps and hot-spring salts as trade goods at Fentene.

**Reconciled.** "In the cold goblins do not live" is read with K22. **Public text:** free.

### 1.18 Gnomes of Olodor, and the gold-crowned

**Kind:** people. **Size:** hip-high to a man (card 0.7 to 1 m, drawn 0.9 m). **Habitat:** Olodor, the gnomes' name for the Deodolor Hills north of the Stone Forest in the Middle Lands, and the holts under the Stendorler ridge (the card's "Olodor and Steadtler", read as the drawn names, P; Middle Lands dossier). **Rarity:** rare to meet, because their villages are hidden.

**Behaviour.** Gnomes are small, bearded and long-lived, living in little houses inside trees or under the ground, and they love the open country and keep their villages so well hidden that men find one only by accident. A gnome who works hard is paid in gold, and when his pot is full he is crowned and called **gold-crowned** (the card's "Leprechaun", replaced), and dresses in green ever after; gnome-miners dig the gold, and every village has one king, who leads it and crowns the rich. Bring gnomes gold of your own free will and they give you luck; do the opposite and they give you bad luck. Their own saying, from the card, is that with gold you can do anything.

**Beasts.** The red-and-yellow finches the drawing shows at a gnome's hand are the **tirri** (Gnomish "bird", P), which the gnomes keep about their holts and which sing at strangers (section 2.1).

**Belief and truth.** Men of the Vale say a gnome's luck is real, and the Parim scholars say it is only what follows from making a friend of a people who see everything. Both may be right; the vault does not say.

**In play.** The decision "Bring Gold to Olodor" (Middle Lands dossier §12) and the event "A Gnome Door in the Bridge"; the tirri hide the holts from spies.

**Reconciled.** The Irish folklore word and the Warcraft name are replaced or dropped (K14); the most famous gnome stays unnamed. **Public text:** free.

### 1.19 Baelim (former card name Coniferon)

**Kind:** people, the walking tree people of the Aenor Forest, separate from the ents of Kilinti; ents and Baelim never share a forest (K21). **Size:** six to seventeen men tall, as tall as the forest's oldest trees (card 10 to 30 m, drawn 15 m). **Habitat:** the Aenor Forest, the largest forest of the Middle Lands. **Rarity:** few. **Names:** Aenoran *bael* "tree" with *-im* "the people of"; one of them is a **Baelen**. They speak the Low Speech.

**Behaviour.** A Baelen is a massive tree-shaped being with reddish bark-skin of vertical grain, a blocky head with yellow eyes and mouth, and a dark crown of foliage that grows from its shoulders like a mane; its skin is not quite wood but a little softer, and its blood is yellow, liquid and yet hard, like resin. The Baelim are strong and very slow, and they are hard to notice, because a Baelen standing still is a tree to anyone but a ranger.

**Belief and truth.** The Selen rangers say the voices that come out of the Aenor Forest are low and angry. The Konori riders say they are only slow, and the truth (P) lies with the riders: men hear only the lowest notes of the Low Speech, and the rest is too deep for them.

**Relations.** No one cuts the Aenor Forest; men take fallen wood at its edges with care. A fallen Baelen limb gives a hard yellow resin, and taking resin from a living Baelen is the gravest crime the forest knows (P).

**In play.** The forest is not cut (no Timber in its states), invaders march slowly and lose men, the Baelim walk against an invader (a people's unit, section 3.5), and the event "The Baelim Speak" (Middle Lands dossier).

**Reconciled.** Name by K27; the life span is dropped. **Public text:** the Baelim by name and the rangers' account.

### 1.20 Dwarf goblins

**Kind:** people, a people of their own, neither dwarves nor goblins (K22). **Size:** hip-high to a man (card 0.7 to 1 m, drawn 0.9 m). **Habitat:** caves and the insides of hills in the North Lands near Lerendor, in the road-warrens of **Mustnom** (roster; they speak the Pack-Tongue), and on every road of Aoaz, since they are rarely at home. **Rarity:** uncommon at home, common on the roads.

**Behaviour.** Dwarf goblins are small but strong and tough, green-skinned, very long-eared, often in a tall flat-topped black hat, and they travel the world looking for foods and goods with a pack on their backs wider than themselves. At home the work is done by thralls (the card's "slaves") under a boss, and returning travellers give the boss food and necessary things, which he shares out, as when he gives iron to the smith for an axe. On the road they trade fairly enough, a bag of gold for a side of meat, but a customer who gets cheeky is beaten and robbed, and if he fights back they run. They live longer than dwarves do, and a dwarf goblin pedlar may sell to the grandson of his first customer.

**Beasts (P).** None: a dwarf goblin carries his own load and says a mule eats the profit.

**In play.** Pedlar events at any market (section 3.7); Mustnom's trade.

**Reconciled.** "[?Lerendor?]" is the hills near Lerendor (K22); the life span is dropped. **Public text:** free.

### 1.21 Dwarves

**Kind:** people. **Size:** chest- to shoulder-high to a man (card 1.3 to 1.5 m, drawn 1.4 m). **Habitat:** the great ranges of the West and North Lands and the Great Wall range (K22): **Kunhrim** in Lunhrim and the Gigantic Mountains (the card's "Gigantic Mountain", where "many" live), **Brundahrim** and **Gromkerm** in the Herlitz and Bolpor ranges of the West, and **Hrakbrund** in the High Mountains of the North (the card's "High Mountain"); the card's "[?Orewell?]" is the Orewell iron of the Cold Lands that their factors buy. **Rarity:** a people of the deep holds.

**Behaviour.** Dwarves are strong, heavy, long-bearded and long-lived; they dig deep for gold and gems, fight with axes and hammers and never with bows or light weapons, are often arrogant and quarrelsome, and do not like elves.

**Beasts.** Pack-goats on the high paths, mules at the gates, and nothing to ride: a dwarf on a horse, the men of Kingson say, is a dwarf who has lost a wager (P). They keep no war beast.

**In play.** "Hire Kunhrim Carriers" (Middle Lands dossier): the pack-goat strings carry a host's supply over the Lunhrim Notch. The warfare data has no dwarf people key in its recruit table; the dwarf holds need their own line (heavy foot, and black powder where the roster gives it), which is a gap for the warfare spec.

**Reconciled.** Homelands by K22; the Tolkien range names are dropped. **Public text:** free.

### 1.22 Devils

**Kind:** spirit: corrupted Lesser Spirits who once served an Old God and escaped to Aoaz; not every devil served Zol (E, K15, Canon Policy). **Size:** eleven to seventeen men tall (card 20 to 30 m, drawn 25 m). **Habitat:** the **Kherith Isles** in the Sea of Lava (the card's "Death Islands"), the Demonic Mountains of Volgan's island, the Burning Shore of the Nether, the peaks of the Goldoroth Mountains in the Dark Lands, and Mount Ergo and Mount Argul above Pornivior in the East Lands (the card's "Pornyior" and "Ergos"). **Rarity:** very few.

**Behaviour.** The drawn devil is gaunt and black, skull-faced and ram-horned, with tattered red bat wings on grey bone, a clawed tail and hooves, and a glow of yellow-green fire in its belly. Devils fight with strength, claws, teeth, horns, wings and fire and kill everyone in front of them, and many of them serve Volgan. A devil is bound to its body and can be killed, and a slain devil comes back only through the lava rite, in which its skull is thrown into lava (E, K15).

**Belief and truth.** The people of Pornivior pay the mountain a fire-tithe and believe it keeps the devils away, and they say a devil once took a whole caravan and left only the scales. The truth (E, East Lands dossier) is that a tithe does not bind a devil. Where the devils came from is sealed in player text: it may say they are ancient and terrible, and a named people may hold a belief about their service, never which Old God (knowledge layers C17, C18).

**In play.** A devil is a granted war-beast for the realms that keep a lava site and the rite (section 3.5); the decision "The Lava Rite"; the fire-tithe; the devil lairs as dead ground.

**Reconciled.** Nature and return by K15; the card's "immortal" means they do not age. Who performs the rite is open (owner question 5). The Dark Lands dossier's "Islands of Death" are these Kherith Isles. **Public text:** as C17 and C20.

### 1.23 Demons

**Kind:** people: corrupted angels, among the immortal Great Folk (vault; in player text only as the elves' or scholars' belief, C19). **Size:** twice to nearly three times a man (card 3.6 to 5 m, drawn 4 m). **Habitat:** the Nether (the card's "hell", read as the Nether, P), the mountains of the Ember Lands (Khorvrath, Dolon and Nezer carry demon households in the roster), Veshazel on the black southern shore of the Dark Lands, and the southern isles of the Ember Lands (the card's "South Islands", read as those isles, P; the Islands of the South hold none). **Rarity:** rare.

**Behaviour.** The drawn demon is red, thin and ribbed, short-horned and big-eared, with huge bat wings, and holds a ball of fire in his hand; demons are very evil and cunning, fight with horns, claws, fire thrown from the hand and the mouth, and cunning, and some can step from one place to another without crossing between. The older and more famous can be summoned by a rite; the rest cannot. The vault knows the Netherborn who serve Volgan, the huge and rare Shachihata, and Afrit's demons.

**In play.** The existing Netherborn, Bound Host and Shachihata; the summoning rite belongs to the Nether's pact-craft. Drawing 51, a winged red demon eating a small creature, is unidentified.

**Reconciled.** The card's real-world symbols: pentagram allowed, cross never (K26). **Public text:** as C19.

### 1.24 Angels

**Kind:** people, immortal Great Folk (E). **Size:** nearly twice a man (card 3 m). **Habitat:** the sky, mostly over the Lands of the Sun and the Sun Desert of the South Lands, where it is warm and clear and does not rain. **Rarity:** rare to see.

**Behaviour.** The drawn angel is a weathered, fair-haired woman-like figure with a leaf wreath, pointed ears and a green shift, and great grey-and-gold feathered wings; angels are very friendly, usually do not kill, keep to their own lives, come down to the ground very rarely, fly very well and fight, when they must, with wings and strength.

**Belief and truth.** The terrace farmers of the Lands of the Sun and the oasis-folk of the South take an angel seen in the sky as a good sign for the year. Their history is open (C21), and the pointed ears they share with the Sunhot are not taken as kinship (owner, open).

**In play.** An omen event that steadies the realms below (section 3.7). Never a unit.

**Reconciled.** All card claims kept. **Public text:** the omen, the sightings.

### 1.25 Mukrom (former card name Chiromaw)

**Kind:** beast. **Size:** waist- to shoulder-high to a man (card 0.9 to 1.5 m, drawn 1.2 m). **Habitat:** caves only: the caves and galleries of the Great Wall range (the card's "Wall of Rush"), the caves of the Hiloff Rim in Hirolon (where the model reads the drawn "Wall of Rush"), the Deodolor Hills of Olodor, and the Cursed Mountains above Burrikkrit. **Rarity:** common underground.
**Name:** Dwarvish *mukk* "night" and *hrom* "cave", as the men of Kingson shorten the dwarves' *mukkahrom* (P). The card's name belongs to another fiction (K14).

**Behaviour.** A mukrom is a small, thin, bat-winged cave beast with an enormous two-lobed head, huge yellow-green eyes with slit pupils and a mouth so packed with long fangs that it fills half its face; its wings are grey and torn, its legs short and taloned. It sees only in the dark, and sunlight dries it up, so it leaves the caves only at night, to raid stores, galleries and holts and to kill with its claws and teeth. It is thin and weak, and dangerous in numbers.

**Belief and truth.** The dwarves of Kunhrim say a mukrom can hear a lamp being lit. It cannot, but it sees the light a long way off, which comes to the same thing.

**In play.** "Mukroms in the Stores" and "Clear the Galleries" (section 3.7); the giants of Hirolon block the cave mouths with boulders.

**Reconciled.** Name replaced; the life span is dropped. **Public text:** mukroms by name.

### 1.26 The Beasts of the Mistake (card title "Beast")

**Kind:** beast. **Size:** twice a man and more (card 3 to 4.5 m, drawn 3.5 m). **Habitat:** the black mainland of Zol's Mistake. **Rarity:** many, at night.

**Behaviour.** A Beast is a huge, round-shouldered thing covered in long black fur, with small red eyes under a fringe of hair and a mouth of jagged teeth, its long arms hanging to the ground. Beasts are like bears but faster and stronger, can be seen only at night, attack everyone they see, and like the flesh of men best.

**Belief and truth.** The fishermen of the outer isles of the Kusmeel will not land on the mainland after dark, and they say the night itself walks there. The truth (E, card and vault) is that the Beasts are the main servants of Kusven, Zol's most loyal servant, which is sealed: player text never names their master and calls them only "the Beasts of the black north" (C24, C25).

**In play.** Night marches on the Mistake are deadly and keep the living off the mainland (Zol's Mistake dossier); late in the age they come to the Kusmeel shores (a gated event). Whether they fight in the last war as a granted host is owner question 7.

**Reconciled.** "Kusven's Mistake" is Zol's Mistake; "Kusven's minions" are Kusven's (K29). **Public text:** as above.

### 1.27 Gektor

**Kind:** other: a sorcerer-chief whose kind is open (V20). **Size:** head and shoulders above a tall man (card 2.5 m). **Home:** Corogon in the West Lands, in a place the card calls "[?Sempos?]", unplaced. **Rarity:** unique.

**Behaviour.** Gektor is a bulky green figure with a single great ringed eye inside a deep hood from which two red horn-tips show, and he carries an oar-shaped staff that is both his second eye and his weapon. He collects books, magic stones and things fit for rites, hires strangers to fetch them and pays in the local coin, gold or gems, is friendly, respectful and very sure of himself, and has a dreadful memory. He traps and bleeds lesser spirits (K23); his claim that he summons Great Spirits and kills them with hosts of men is a boast.

**In play.** "Gektor's Errand" and the Bleeding Stone (magic reference §3.15 and section 3.7); the small spirits he preys on are in section 2.6.

**Reconciled.** By K23; the card's age is dropped. **Public text:** his trade, and the boast always as his own claim.

### 1.28 Forest trolls, or stone trolls

**Kind:** people. **Size:** eight to ten men tall (card 15 to 18 m, drawn 16 m). **Habitat:** the Troll Forest beside Bordon in the Dark Lands, which the trolls call *Grootoom* (Trollish "the great forest place"); the card's other homes are Tolkien names and are dropped. **Rarity:** few; about six hundred (Dark Lands dossier, P).

**Behaviour.** A forest troll is a huge, hunched creature with lumpy grey-violet skin like stone, a small head sunk between its shoulders, small yellow eyes and two short tusks, dressed in a leather apron, with a club and a skull at its belt. Trolls are very strong, slow-witted and always hungry, go about in groups of three to five, keep to the shade, and turn to stone in sunlight. Their faith is the Hunger and the Stone, with bog burials and stone-heaps.

**Belief and truth.** The envoys of Bordon say every troll is Smash's subject. The truth is narrower: Smash is the king of these trolls in this forest (K22), and the oldest unbeaten troll leads each group (P).

**In play.** The Troll Forest's attrition and night raids, troll silver, the existing Troll Brutes, and Smash's waking.

**Reconciled.** Cards 13 and 59 say "burn" and "turn to stone"; this file reads both as a slow stiffening into stone. **Public text:** free.

### 1.29 Elzon

**Kind:** spirit, a Great Spirit and the Great Necromancer (E). **Size:** nearly twice a man (card 3.3 m). **Home:** Nezer in the Ember Lands (the card's "Nazerun", its old name, K24), and Aenor while he ruled it. **Rarity:** unique, and dead: he died for good at the end of the Third Age (E).

**Behaviour.** The drawings show a tall hooded figure in purple-brown with no face in the hood but darkness, rising from a black pool before a purple whirl of light, and raising a corpse with long clawed fingers. He was wise and evil, brought Volgan back, helped him raise others, and killed elves above all and forced them to his side.

**In play.** History only; his remnants are Volgan's necromantic orders and the scars of the Black Roots.

**Reconciled.** The card's age is dropped. **Public text:** the Necromancer of the Third Age.

### 1.30 Kusven (card title "Kusven")

**Kind:** spirit, a Great Spirit made by Zol and Zol's most loyal servant (E, K11, K29). **Size:** more than twice a man in his ordinary form (card 4.3 m, "ordinary"), which implies greater ones. **Home:** Šodolôrō in Zol's Mistake (E). **Rarity:** unique.

**Behaviour.** The drawings show a hunched black shrouded bulk with pale, bony, long-clawed limbs and a gleaming slit where a face should be, drawing the soul out of a kneeling knight in a storm of darkness. He is evil, feeds on souls and grows stronger, covets the whole of Aoaz and is feared by everyone. The card's "every day he quietly demolishes cities" is read as a slow, hidden working (P), since the Fourth Age is an age of real peace and the Mistake is nearly empty (vault).

**In play.** The Zol mechanic and the last war; his Beasts are entry 1.26.

**Reconciled.** By K29 and the vault page. **Public text:** sealed: never named, never identified, never alluded to; after the servant appears, only "a Great Spirit of the black north" (C24, C25).

### 1.31 Corallus

**Kind:** beast. **Size:** as long as four to five men laid end to end (card 7 to 10 m). **Habitat:** the waters of the Middle Lands only: the Great Lake, the Saeton reeds on its south-east shore, the Great River from the Kingson gorge (the card's "Kingson River"), and a swamp the card calls "[?Dorap?]", read here as a reed marsh of the old Dariap lands on the lake shore (P). **Rarity:** common in the reeds, rare in open water.

**Behaviour.** A corallus is a long crocodile-like reptile of green and blue-green scale with a frilled pink-green crest and a row of rounded orange scutes from head to tail, and it can rise and walk on two long legs. It attacks anyone at all who comes into its water, is very hard to see while it lies in it, and is very fast on land and faster in water. It outlives several generations of the wardens who watch for it.

**Belief and truth.** The lake bargemen say a corallus never takes a man who has paid his toll at Parim, which the toll-men repeat with a straight face. The lake towns pay corallus-wardens to watch the fords and the reed-beds, and that, not the toll, is what keeps the bargemen alive.

**In play.** The reeds' attrition, "Coralluses in the Reeds", "Pay the Corallus-Wardens", and corallus hide (sections 3.2 to 3.4). The West Lands' ford-pike is a different creature (section 2.3).

**Reconciled.** All card claims kept but the life span. The name is also the name of a real-world genus of snakes; the dossiers keep it, and a local name can replace it if the owner wishes. **Public text:** free.

## 2. The wider bestiary

The entries below are new unless marked; most come from the dossiers' section 9, merged and set side by side so that no beast is the same beast under a different name in the next land. Each lists its use, its danger and the land it shapes.

### 2.1 Beasts of burden, mounts and herds

**Horses** (E that horses exist and are a resource; breeds P). Every realm of men that rides keeps horses, and the economy's Horses resource stands for them and for every other mount (`economy.json`; War Mounts equipment). The breeds differ in ways that matter on campaign:

| Breed | Where | Character | In play (P) |
| --- | --- | --- | --- |
| Hunhun horse | Hunhun and the Konori Downs (Middle Lands) | Big-boned, quiet, bred for the Concord's cavalry and its knights | "Hunhun Remounts": cavalry and knights attack +5% for Aenor and its dominions |
| Ronbo horse | the Ronbo Grasslands and Lothoro (West Lands) | Light, quick and tireless; the western light cavalry | Horse archers speed +5%; the West's Horses weight is the highest of any region |
| *Snevhest*, the snow-horse | the Fandan meadows (Cold Lands) | Short, shaggy, hardy and few | Mounted hosts of Coldor: winter attrition -10% |
| Hill pony | Heodwa (North Lands) | Small and sure-footed; the inland crowns' mounts | Cavalry in hills and mountains: speed +10% |
| Elven grey | the Teste Vale (Magical Lands) | Tall and silent; carries the elven riders through the forest | Elven riders in forest: speed +10% |
| Noric desert horse | the wells of Noris (East Lands) | Thin-legged, fast, drinks little; kept beside the camels | Part of Noris's Horses; raiders' speed |
| The dead horses of the grave riders | Volgan's island | Dead horses under dead riders, silent and quick | Grave riders draw no Horses, and fade beyond the Ember Lands like the rest of the dead |

**Camels** (E). The only beasts that cross the dune sea, the wealth of the Noris camel-kings and the Stabilo caravans, and the mounts of the Noris camel warriors; a caravan master trusts his camels further than his scales.

**Mules and asses** (P). The pack trains of every land, and above all the mule strings of Kingson that carry everything that crosses the Great Wall by the Kingson Pass; the warfare data's Pack Trains are these.

**Cattle and oxen** (P). Oxen plough the Vale of Aenor and draw its grain to the barges. The **great-horned cattle** of the giants' upland pastures in Hirolon are a breed apart: huge, slow and patient, the only beasts the giants keep, and they haul the stone of the giants' cairns and walls.

**Lake buffalo** (P). Black water-oxen of the Hot Lake shore and the Mora coast of the East Lands, which wallow in the warm shallows, pull the salt-boilers' sledges and plough the wet lake fields.

**Reindeer** (P). The whole wealth of the Cold Lands clans, herded across the interior moors, Fearno and the far north-west; the herds decide where the clans move, and where an army in the north finds meat.

**Mountain ox** (P). A long-haired wild ox of the Cold Mountains that moves in slow herds through the high snows; the yeti height clans of Ghaahu follow it and call it *gharu*, Yeti Speech "herd", and men almost never see either.

**Pack-goats of the holds** (P). Strong, sure-footed goats bred by the dwarves from the wild mountain goats of the Herlitz and Bolpor ranges and the Great Wall range; a string of them carries a dwarf factor's iron down paths no mule can climb.

**Dragon-tithe goats** (P). The roost-keepers' herds under Dragon Mountain in Yavieth, which the dragons are allowed to take; the keepers say a dragon that eats the tithe does not need to look further.

**Sheep** (P). Everywhere there is grass. Two flocks are their own: the small dark **skerry sheep** of the Pupor Isles, which graze the kelp on the shore when the salt grass is gone, and the lambs of the Grano hills in Hirolon, which the rim kites take.

**Sled dogs and herd dogs** (P). Every Cold Lands household keeps dogs; in winter they draw the sleds, in war the ice-sleds of the clans, and in summer they work the reindeer.

**Salt-hawks** (P; Noric *baaz* "hawk"). Hawks of the dry lake beds of the South Lands, taken young and trained by the oasis-folk; they find water, game and strangers, and a trained one is a gift fit for an eastern king.

**Tirri** (P). The red-and-yellow finches of the gnomes of Olodor (Gnomish *tirri* "bird"), which live about the hidden holts, sing at anyone they do not know, and so warn a village long before a stranger finds its door.

**Griffins** (P, and only under the game rule `zin_rule_skies = beasts`; warfare spec). If they exist, wild griffins nest on the crags of the Crown Mountains and the western face of Lunhrim, and the riders of Konori take the eggs and raise the young in eyries; outside that rule no griffin appears in any text.

**Cinder-hounds** (P, Nether dossier). The hunting beasts of the demon houses on the Burning Shore: lean, ash-grey hounds that do not feel the heat and run down thralls who flee.

**What each people rides and loads.**

| People | Ride | Load and draw | To war |
| --- | --- | --- | --- |
| Men of the Middle Lands | Hunhun horses | oxen, Kingson mules | cavalry and knights |
| Men of the West Lands | Ronbo horses | oxen, mules | light cavalry and horse archers |
| Men of the North Lands | hill ponies | ponies, carts | few riders; the strait is their road |
| Men of the Cold Lands | snevhest | reindeer, sled dogs | ice-sleds and a small cavalry |
| Men of the East and South deserts | camels, Noric horses | camels | camel warriors |
| Men of the Hot Lake | horses | lake buffalo | foot and boats |
| Island men of the Pupor Isles and the Islands of the South | nothing | boats and their own backs | sea soldiers |
| Elves of the Magical Lands | elven greys | none worth the name | elven riders; dragons by pact |
| Sunhot elves | nothing (they are too tall for any horse) | men's beasts | foot, the Sun Guard |
| Dwarves | nothing | pack-goats, mules at the gates | foot only |
| Dwarf goblins | nothing | their own backs | none |
| Goblins and hobgoblins | wurghs | hobgoblins carry the stone | skirmishers, wurgh riders (P) |
| Orcs | wurghs | captured oxen, slaves | raiders on wurghs |
| Ogres and trolls | nothing | nothing | themselves |
| Giants | nothing | great-horned cattle (Hirolon) | themselves, and thrown stone |
| Yeti | nothing | nothing | themselves |
| Small folk | ponies, a few | ponies, pigs to market | none |
| Gnomes | nothing | baskets | none |
| Demons of the Nether | nothing | thralls | cinder-hounds to hunt |
| Volgan's dominion | dead horses | the living and the dead | grave riders |

### 2.2 Game and fur

**Red deer** (P). The downs and the West Wood of the West Lands, the Selen Weald and the Bloody Forest of the Middle Lands, and the Hiloron Woods, where they are hunted only by the giants' leave; in the West, hunting rights are clan rights.

**Wild boar** (P). The same black-bristled boar runs in the West Wood, the Middle Lands' woods and the Dark Forests, where the orcs call it *grunt* and paint it on their shields; it is on Gunwyn's arms, and a West Lands chief shows his strength at the boar-hunt.

**Elk** (P). The Dwarc and Swy Forests of the North Lands and Lerendor's North, hunted for meat and hide.

**Wolves** (P). The grey wolf of the West Wood, the North Lands and the Middle Lands' woods; in the Cold Lands the same wolf runs in larger packs and turns white in the Long Dark, following the reindeer and taking the stragglers. Wolves press the herds of Lerendor's North in hard winters, and their furs go south.

**Brown bears** (P). The West Wood, the West's mountain neck and the northern forests; a threat to herds and a prize for a furrier.

**Reed-lynx** (P). A small grey lynx of the Eekedor Reeds whose fur is the badge of office of Eekedor's merchant council.

**White fox** (P). The trappers' fox of the Cold Lands' tundra and coasts, whose winter pelt is the commonest fur of the northern markets.

**Silver harts** (P). Pale deer of the Living Forest of the Magical Lands, the elves' heraldic beast, hunted by nobody; the elves say a silver hart seen at dawn means a quarrel will end well.

**Lions** (P, after card 15, which compares the wurgh's jaws with a lion's). The Delbiz Grasslands and the dry hills above the Mora coast in the East Lands, where they take cattle and the river-kings hunt them as a royal right.

### 2.3 Predators and pests

**Ice bears** (P). Great white bears of the sea-ice of Pandar, the Yeti Shallows, the Vindael arm and the Woqood coast of the East Lands; one name for one bear, whatever the coast. They kill sealers on the ice, and a bear-skin is a Cold Lands chief's mantle.

**Mist-wolves** (P, Magical Lands dossier). Pale, silent wolves of the deadwood of the Fallen Forest that hunt in the mist; travellers go round, and the elves do not say what made the forest fall.

**Rim kites** (P, Hirolon dossier). Big red kites of the sea cliffs of the Hiloff Rim, which take lambs on the Grano and are the herders' chief complaint.

**Ford-pike** (P, West Lands dossier). A river pike as long as a boat that lies in the deep pools above the Kulolo fords and takes dogs and children; the river wardens' loaf thrown in at the flood is said to be for the river's keeper, and the pike to be its hound.

**Glass-vipers** (P). Pale, nearly invisible snakes of the white dunes of the South Lands, whose bite is slow but sure.

**Jungle apes** (P). Big, clever apes of the Hot Forest in the Lands of the Sun, which raid the terraces' fruit and steal anything shiny.

**Ash-moths** (P). Grey moths that breed on the warm slopes of the Goldoroth Fire-Mountain and swarm after each ash-fall, stripping the fields of the orc holds; the Fire-Speakers read the swarms.

**Dune locusts** (P). Red locusts that rise from the Alodale sands in dry years and come down on the wadi farms and oasis gardens of the South and East Lands.

**Fen-midges** (P). The biting midges of every fen, which bring the fevers of the Eekedor Reeds, the Kulolo Fen, the Papz Swamp, Dreson's fens and the Zilin Fens; the same midge in all of them, worst in summer.

**Granary rats** (P). The rats of every granary and every ship, worst after a mild winter; the goblins call them *skrat* and eat them.

**Ice-borers** (P). Pale, blind, hairless burrowers that tunnel in the glacier ice of the Cold Mountains and under the snow crust of the Frozen Lands of Coldor, eating what freezes there; their tunnels make the crevasse fields, which open under sleds in the thaw.

### 2.4 Birds of use and omen

**Ravens and crows** (P). Everywhere, and the orcs' bird of omen (*krah*) on the banners of the Dark Lands; on Volgan's grey plateau the crows go grey with ash and follow the grave hosts, which is why the freeholders call them ash-crows.

**Herons** (P). The fens and lagoons of the West Lands, the Nimmael shallows and the Great Swamp of Mirolon, where the heron is the wardens' heraldic bird; fowling feeds the fen towns.

**Sea-eagles** (P). The skerries and the Eagle Forest of the North Lands, beside the ships and gulls on Lerendor's arms.

**Storm-petrels** (P). Small dark birds of the outer seas of the Pupor Isles, which the islanders call drowned souls and whose flight tells a sailor that the gale is coming.

**Sun-cranes** (P). Tall white cranes of Sun Lake and its shallows, the Sunhot's heraldic bird, protected by law.

**Seabird colonies** (P). The bird isle Kamu Hawin in the Islands of the South, the outer rocks of the Pupor Isles and the cliffs of every northern coast; eggs for food, feathers for trade, and on Kamu Hawin the guano that feeds the island terraces. On the Pupor Isles, climbing the cliffs for eggs is a boy's trial.

### 2.5 The waters

**Sea by sea.** Each water keeps one name; the creatures in bold have their own entries.

| Water | Region | What lives there |
| --- | --- | --- |
| The Sea of Monsters | Middle Lands, north-west | **Sea serpents** most of all; shoal fish along the coast; ships keep inshore |
| The central sea | between the West and Middle Lands | Serpents in its deep middle; herring and seals on its shelves |
| The Peace water | Middle Lands, south-west | Dolphins and tunny on the pilgrim route south |
| The Inner Sea and Nimmael | Middle Lands, Aenor Isle | Shoal fish, eels and herons in the shallows |
| The Narrow Strait and the Leren water | Middle and North Lands | **Strait-whales** in winter; cod and seals |
| The Rim | Middle and North Lands | Seals in the fog |
| Gaelmael, the Grey Water | Dark and Middle Lands | Sharks that follow ships; the Goldoroth orcs call it *Gnashagh*, "bone-water" |
| The Great Lake | Middle Lands | **Coralluses** in the reeds; pike and whitefish in the open water |
| Londolo | North Lands, west | The strait-whales' summer water; great shoals |
| The Onp | North Lands | Seals |
| Dolpar and the Sea of R'en | North Lands, inland | Whitefish and pike |
| The Frozen sea and the Gulf of Minnolomak | Cold Lands | Seals and **ice bears** |
| Pandar | Cold Lands | **Seals and walrus**, ice bears; the sealing grounds |
| The Siroler Seas | Cold Lands, east | **Spear-whales** and other whales |
| The Norrai water | Cold Lands, Pupor Isles | Herring and seals |
| The Cold water off Poloto, and the Coldor Channel | Cold Lands | Late-freezing fishing water; seals; the winter ice road to the yeti |
| The Blue Sea and the Kradlon water | West Lands | Herring and seals; autumn gales |
| The Ergo Sea and the Ilurdor lagoon | West Lands, lakes | **Ford-pike** in the Kulolo above them; herons and fen-fowl |
| The Pupor inner sea and the Windy Seas | Pupor Isles | Herring and white fish, kelp beds, seals; **storm-petrels** in the gales |
| The Seas of Lemo, the Amarelo Seas and the Santon water | Pupor Isles | Shoal fish; the Cursed Square's reefs |
| The Sea of Darkness, the Dulundur Sea, the Dun Sea and the Gold Wides | Dark Lands | **Eels** in the fens that drain to them; the sea orcs' fisheries |
| The Sea of Dolon and the Belonton Water | Dark Lands | Sea-orc fishing grounds |
| The Tempest Reach | Ember Lands | Nothing anyone has stayed to count |
| Vehmial, Veshir, Veleeda, the Sea of Mernon and the Sea of Nazerch | Ember Lands | Mirolon's coast fishers take rays and mackerel in the Veleeda; the rest is little fished |
| The Sea of Lava | Ember Lands, Nether | Nothing lives in it; **glass-beetles** on the Burning Shore |
| The Kusmeel and the Still Sea | Zol's Mistake, the north | Seals and cold-water fish off the outer isles; the sea birds avoid the black isles, and the fishermen say the fish of the still water taste of nothing |
| The Rift Sea and the Gorlab Sea | Magical and East Lands | Shoal fish of the rift coast |
| The Reeto Sea | Magical and East Lands, south | **Spore-lights** where the Mushroom Forest's spores fall on the water |
| The Gulf of the Teeth | East Lands | **Steam-crabs** by the hot vents |
| The Hot Lake | East Lands | **Steam eels** in the hottest water; lake buffalo on the shore |
| The Sun sea of the South Lands | South and East Lands | Tunny and flying fish off the coast road |
| The Long Sea | Islands of the South | **Sharks** in their season; the **boat-breakers** of the whale-road at Yowi-yoor; reef fish, crabs and **sea turtles** |
| The Seas of Lusain, the Sharp Seas and the Ihuy Sea | Islands of the South, Lands of the Sun | **Dolphins**; **pearl oysters** on the reefs of Howan and the isles of the Sunhot |
| The Sea of Gods, the Bright Sea, Sala Olar and Sala Nyel | Lands of the Sun | Dolphins and warm-water fish |
| Sun Lake | Lands of the Sun | **Sun-cranes** in the shallows |

**Seals and walrus** (P). Pandar, the Yeti Shallows, the Siroler Seas, the Onp, the North Lands' strait, the Pupor Isles' outer rocks, the Woqood coast, where they are white, and the outer isles of the Kusmeel; oil, hide and walrus ivory, and the sealing season that sets the calendar of every northern coast.

**Spear-whales** (P). Long-tusked whales of the Siroler Seas and the waters off the Vindael arm, whose oil lights the Long Dark and whose tusks are the finest ivory of the north; Vindael's wealth.

**Strait-whales** (P). Great grey whales that winter in the Leren water and the Narrow Strait and summer in Londolo; their coming opens the Ship-Blessing, and the Litany forbids killing one inside the strait.

**Boat-breakers** (P; Yonic *yoru*, "the great one"). The great whales of the whale-road in the channel of Yowi-yoor, which the islanders hunt from canoes and which sink boats when they turn; a boat-breaker's jaw is hung over the door of the hall whose men took it.

**Herring and the shoal fish** (P). The herring of the Pupor inner sea, the white fish of the Windy Seas, the cod of the strait and the shoals of every coast, salted and sold inland; the Southern Banks of the Pupor Isles are fought over for them.

**Sharks** (P). The Long Sea in their season, when the outer reefs of the Islands of the South close, and Gaelmael, where they follow ships.

**Sea turtles** (P; Yonic *wanu*). The lagoons and beaches of the Islands of the South; food and shell, and a turtle painted on a shield is an elder's sign.

**Pearl oysters** (P). The reefs of Howan and the lagoons of the Sunhot isles; one oyster, two pearl trades.

**Dolphins** (P). The warm seas from the Peace water to the Sea of Gods; Sunhot and island sailors alike say a dolphin under the bow means the ship will make harbour, and neither will harm one.

**Steam-crabs** (P). Red crabs of the hot vents of the Gulf of the Teeth under the volcanoes of the East Lands, taken by the shore villages and sold boiled, which saves the cooking.

**Spore-lights** (P). Small glowing jellies of the Reeto Sea that bloom on summer nights where the spores of the Mushroom Forest fall on the water; the Luv-zhise ferrymen steer by them across the Rift Narrows.

**Lake fish** (P). The pike and whitefish of the Great Lake, the lake towns' food, and the whitefish of Dolpar in the North.

**Eels** (P). The fens of Dreson and the Dondor Fen in the Dark Lands, Dreson's food and trade, and the shallows of Nimmael.

**Steam eels** (P). Pale eels of the hottest shallows of the Hot Lake, the only fish that lives there and the salt-boilers' food; the salt-boilers say the lake is warm because something under it breathes.

### 2.6 Beings of special places

**Dragon Mountain and the Magic Mountains: dragons** (E that dragons come chiefly from Dragon Mountain, form no country, and that elven powers command them and Afrit can do so through corruption; the rest P). The dragons roost on the three spurs of Dragon Mountain and range over the high Magic Mountains; they are free allies of the elves, bound by an old bond that the roost-keepers of Yavieth hold, and they take cattle on both sides of the range, in the Kingson Vale and the eastern downs. They shed scale at the roosts, and **dragon-scale**, gathered by the keepers and sold at Kingson, is the Magical Lands' richest trade and the clearest case of a beast's part that carries essence: this file reads the economy's Essence of Dragon Mountain (`specialSites`, 12) as that scale. The roost-keepers say a dragon never forgets a name and never says one.

**The Aenor Forest.** The **Baelim** and the **tzikor** (section 1), and the **thorn-bees** (P): small black bees of the forest's edge that take the nectar of the tzikor's blossoms and make a dark honey that numbs the mouth, which the healers of Parim buy for pain and the Redbark buy for other purposes. The forest's other beasts are the deer, boar and wolves of the Selen Weald, and they walk carefully.

**The Magical Forest.** The **silver harts** of the Living Forest and the **mist-wolves** of the Fallen Forest (sections 2.2 and 2.3), and the **small spirits** of its springs and groves below.

**The Lustras Hills.** The **krors** (section 1.14), and nothing else that anyone has seen.

**The Mushroom Forest: giant fungi** (P). A belt of giant fungi along the rift shore, some as tall as towers, whose spores thicken the summer air until strangers can hardly breathe; the mycids live there (E), and nothing is said of them here beyond that (O). The fungi give dyes and spore-cloth, traded through Luv-zhise, and the **spore-lights** of the Reeto Sea are their gift to the water.

**The Hot Lake and the Smoking Teeth coast.** The **steam eels** and the **lake buffalo**, the **steam-crabs**, and on the Flaming Forests east of the Noris Desert the **flame-silk moth** (P): a red moth whose caterpillars strip the forest's red leaves in the dry season and spin cocoons of a red silk that does not fade, which the merchant princes of Stabilo sell at the price of gold. In the season the moths fly, the swarms are thick enough to blind a caravan, and the caravans wait.

**Hol's Great Volcano: fire-lizards** (P). Basking lizards of the warm slopes of the Great Volcano on Hol in the Ihuy isles, whose shed skins the isle folk weave into a cloth that does not catch fire, which the smiths of the mainland prize.

**Zol's Mistake.** The **Beasts** (section 1.26); **the dead** below; and **black lichen** (P), the only growing thing on the rock, which the fishers of the outer isles burn and which gives off a cold grey smoke.

**The Nether.** **Devils** and **demons** (section 1), **cinder-hounds** (section 2.1), and **glass-beetles** (P, Nether dossier): black beetles of the Halls that feed on sulphur, whose shells are the Nether's glass. Below the Halls lie the Roots, where the heat is unbearable to mortals, and whatever lives there is left unexplained (see the Damned Spirits below).

**The Abyss.** Roka and his people (sections 1.4 and 1.8); the rim of the Abyss, where nobody prays.

**The ice.** The **ice bears** of the sea-ice, the **spear-whales**, the **ice-borers** of the glaciers, the **mountain ox** and the yeti who follow it, the ice giants of Nivaros, who hunt seal and caribou and charge a toll in meat or iron on the herd roads, and at Mp'E, Horos.

**The small spirits of springs, groves, winds and hearths** (P; magic reference §3.15; the vault's Wild and Elemental Spirits are proposed natures). Minor spirits below the rank of a named Lesser Spirit, which the Lawspeakers and River Wardens of the West honour, the elves sing to and Gektor traps in stones and bleeds. They are seldom seen, and a spring whose spirit has been taken runs thin.

**Damned Spirits** (E that they live very deep underground and that Volgan released some in the First Age; everything else O). Whatever lives in the deepest places, below the dwarves' lowest gallery and the Nether's Roots, is not described here, because the vault leaves its nature, societies and allegiance open.

**The dead** (E). Not wildlife, but they shape travel as beasts do: the wandering dead of Zol's Mistake, who are not Zol's soldiers and are never recruited (Zol's Mistake dossier), Volgan's grave hosts, which fade when carried far from the Ember Lands (E), and Zol's sustained dead of the last war, which ordinary iron cannot end and wards can only hold back (E).

### 2.7 Index by region

| Region | Creatures (card entries in bold) |
| --- | --- |
| Middle Lands (with Hirolon) | **tzikor**, **Baelim**, **corallus**, **mukrom**, **wurgh**, **hobgoblins**, **goblins**, **gnomes**, **dwarves**, **men**, **small folk** (Tirlan), sea serpents; Hunhun horses, Kingson mules, oxen, great-horned cattle, Grano sheep, tirri, griffins (rule), red deer, wild boar, wolves, rim kites, thorn-bees, herons, lake fish, eels, strait-whales, fen-midges, granary rats, dragons over the range |
| North Lands | **dwarves** (Hrakbrund), **dwarf goblins** (Mustnom), **men**; hill ponies, elk, wolves, brown bears, reed-lynx, sea-eagles, seals, strait-whales, shoal fish, lake fish, fen-midges |
| Cold Lands | **Horos**, **goblins** and **hobgoblins** (Glimkit), **wurghs** (shaggy kind), **men**; snevhest, reindeer, mountain ox, sled dogs, sheep, wolves, white fox, ice bears, ice-borers, seals and walrus, spear-whales |
| West Lands | **dwarves** (Brundahrim, Gromkerm), **small folk** (Dobbum), **Gektor**, **men**; Ronbo horses, pack-goats, red deer, wild boar, wolves, brown bears, ford-pike, herons, fen-midges, small spirits |
| Dark Lands | **orcs**, **ogres**, **forest trolls**, **Smash**, **wurghs**, **goblins** and **hobgoblins** (Burnikit), **devils** (Goldoroth peaks), **demons** (Veshazel), **men**; wild boar, ravens, ash-moths, eels, fen-midges, sharks of Gaelmael |
| Ember Lands (with the Nether and the Abyss) | **King of Demons**, **Roka**, the **people of the Abyss**, **devils**, **demons**, **Elzon** (history), **orcs**, **ogres**, **goblins**, **wurghs**; dead horses, cinder-hounds, glass-beetles, ash-crows, herons, the dead |
| East Lands | **devils** (Mount Ergo, Mount Argul), **ogres** (Reeto Heights), **sand golems** (the desert's edge), **men**; camels, Noric horses, lake buffalo, lions, ice bears and white seals of Woqood, steam eels, steam-crabs, flame-silk moths, dune locusts, spore-lights |
| South Lands | **sand golems**, **angels**, **men**; camels, salt-hawks, glass-vipers, dune locusts |
| Magical Lands | **krors**, **Golbran**, **mukroms** (Cursed Mountains), **men**; dragons, elven greys, dragon-tithe goats, silver harts, mist-wolves, giant fungi, spore-lights, small spirits |
| Lands of the Sun | **angels**, **men**; sun-cranes, pearl oysters, jungle apes, fire-lizards, dolphins |
| Islands of the South | **men**; sea turtles, boat-breakers, sharks, pearl oysters, dolphins, seabird colonies, reef fish |
| Pupor Isles | **men**; skerry sheep, shoal fish, seals, storm-petrels, seabird colonies; sea serpents only if the owner places them here |
| Zol's Mistake | **Kusven**, the **Beasts of the Mistake**; the dead, black lichen, seals and cold-water fish of the outer isles |

### 2.8 Duplicates resolved

| In the dossiers | Resolution |
| --- | --- |
| "Wurghs" (Middle Lands, Ember Lands) and "bone-hounds" (Cold, Dark and West Lands) | One beast: *wurgh* is its name, "bone-hound" the men's word; its kinds differ by use, not by region alone (entry 1.7) |
| Ash-moths of Goldoroth and ember-moths of the Flaming Forests | Two different insects: the ash-moth is a grain pest born of ash-falls; the Flaming Forests' moth is the flame-silk moth, a silk-bearer whose caterpillars eat red leaves |
| White wolves of the Cold Lands and the wolves of the West and North | One wolf; the northern packs are larger and white in winter |
| Great white bears of the Cold Lands and snow bears of Woqood | One beast, the ice bear |
| White seals of Woqood and the seals of the north | One family; the Woqood seals are white |
| Marsh herons of Mirolon and the herons of the western fens | One bird |
| Pearl oysters of Howan and of the Sunhot isles | One oyster |
| Ash-crows of Volgan's plateau and the ravens and crows of every land | One family; the ash-crows are crows greyed by ash |
| The corallus of the Middle Lands and the ford-pike of the Kulolo | Two creatures: a reptile of the lakes and reeds, and a fish of the western fords |
| The spear-whale, the strait-whale and the boat-breaker | Three whales of three kinds: tusked, great grey, and the great toothed whale of the south |
| Mist-wolves of the Fallen Forest | A creature of its own, not a wolf of the common kind |
| The Kherith Isles (Ember Lands) and the "Islands of Death" (Dark Lands) | One place, the card's Death Islands, in the Sea of Lava |

## 3. Ecology in play

Every number below is a proposal for the systems that own it (warfare, economy, regional mechanics). The systems choose the final values through their own balance work and, for anything weighted, the probability audit of the repository.

### 3.1 Principles

1. **Habitats are state flags.** Each creature that matters to play marks its states with a flag set in state history, `zin_hab_<id>` (for example `zin_hab_corallus`, `zin_hab_aenor_forest`), so that events, modifiers and AI read one list and nothing is hard-coded by state number.
2. **Tuning lives in script constants.** One file, `common/script_constants/bestiary.txt`, holds every magnitude below under `constant:bestiary.<key>`, and the dynamic modifiers read them through variables where a field rejects constants.
3. **Effects are state dynamic modifiers on the vanilla pattern.** `attrition_for_controller`, `army_speed_factor_for_controller`, `local_supplies_for_controller`, `state_resources_factor`, `local_resources_factor`, `state_production_speed_buildings_factor`, `local_building_slots_factor` and `local_intel_to_enemies` are state-capable modifiers in the installed documentation, and vanilla uses the first three together in a state modifier (`skirmishes_against_imro`).
4. **No whole-world pulse is added.** Beast events fire from the generic realm pulse that the owner allowed (K34: each country once a month in four weekly batches), filtered at once by the realm's own habitat flags, or from decisions and the realm's own `on_daily_TAG`; festivals fire only where the realm's faith gives them (K30).
5. **No sea can carry a modifier.** Serpents, sharks and whales act on fleets through events on coastal states and harbours.
6. **The small folk's luck is a rule.** While their guards stand, Dobbum and Tirlan are excluded from every raid and pest event here.
7. **Text keeps the knowledge layers.** A beast event's prose gives belief to a believer and never names Kusven, the demon king or a devil's Old God.

### 3.2 Travel, terrain and supply

| Habitat flag | Creature | Effect on armies of the controller | Who escapes it |
| --- | --- | --- | --- |
| `zin_hab_corallus` (Saeton reeds, the lake's reed shores, the Great River fords) | corallus | `attrition_for_controller` +0.05; `army_speed_factor_for_controller` -0.05 | realms that pay the corallus-wardens: halved |
| `zin_hab_aenor_forest` | Baelim and tzikor | attrition +0.10 (tzikor 0.05, Baelim 0.05); speed -0.15 | the Aenor Forest realm and realms at peace with it: no Baelim share |
| `zin_hab_troll_forest` | forest trolls, Smash | attrition +0.15; speed -0.10 | the Troll Forest; realms that pay troll silver: no attrition |
| `zin_hab_kror` (Lustras Hills) | krors | attrition +0.15; speed -0.20 | nobody |
| `zin_hab_mistake` (the Mistake's mainland) | the Beasts, the dead | attrition +0.20; `local_supplies_for_controller` -0.50 | nobody living |
| `zin_hab_spore_forest` (Mushroom Forest), in Rasthel, Kerun and Aurlan | giant fungi | `local_supplies_for_controller` -0.30 | the mycids and Luv-zhise |
| `zin_hab_sand_golem` (golem tracts of the Noris Desert) | sand golems | attrition +0.05 where roads are below level 2, the "marked tracks" | caravan realms with roads built |
| `zin_hab_fen` (the fens of section 2.3), in summer | fen-midges | attrition +0.05 | realms with field healers: halved |
| `zin_hab_glacier` (Frozen Lands of Coldor, Cold Mountains), in the thaw months Lumae to Vaelei | ice-borers | attrition +0.05 | Cold Lands realms (the Long Winters spirit) |
| `zin_hab_devil_lair` (Kherith Isles, Demonic Mountains, Goldoroth peaks, Mount Ergo, Mount Argul) | devils | attrition +0.10 | realms that keep the lava rite |
| `zin_hab_dead_wood` (Fallen Forest) | mist-wolves | attrition +0.05 | the elves of the Magical Forest |
| `zin_hab_flame_silk` (Flaming Forests), in the dry season | flame-silk moths | speed -0.10 | nobody; caravans wait |
| Lunhrim Notch states | dwarves' pack-goats | `local_supplies` +0.20 for a realm that has hired Kunhrim carriers | |
| Cold Lands herd states | reindeer | `local_supplies` +0.30 for the owner | |

### 3.3 Farming and settlement

| Creature | Where | Effect (P) |
| --- | --- | --- |
| Krors | Lustras Hills | Category Barren Waste; no buildings; never settled |
| Baelim | Aenor Forest | No Timber is drawn; the forest is never cut; the realm's states keep their trees |
| Devils | the lair states | `local_building_slots_factor` -0.5: "the Smoking Teeth uplands are emptied by ash and devils" (East Lands dossier) |
| Ash-moths | Goldoroth slopes | After an ash-fall, `local_resources_factor` -0.25 (Grain) for 180 days |
| Dune locusts | wadi farms of the South and East | In a dry year, `local_resources_factor` -0.30 (Grain) for 120 days |
| Wurghs | the southern Vale and Herez roads, the Dark Lands moors | In a raid, `local_resources_factor` -0.10 (Horses) for 120 days |
| Dragons | the Kingson Vale and the eastern downs | In a raid, `local_resources_factor` -0.05 (Horses) for 60 days; none for realms that keep the dragon-tithe or are bound to Yavieth |
| Coralluses | lake reed states | In a bad year, `local_resources_factor` -0.15 (Grain) for 90 days |
| Mukroms | cave states of Kunhrim, Olodor, Hirolon and Burrikkrit | In a raid, `local_resources_factor` -0.10 (Grain) for 90 days |
| Granary rats | any realm after a mild winter | Provisions -10% for 60 days; each level of Granaries cuts the chance |
| Fen-midges | fen states in summer | `local_manpower` -0.10 for 90 days |
| Hobgoblins | Burrikkrit's warren states | `state_production_speed_buildings_factor` +0.10 |
| Great-horned cattle | Hirolon | `state_production_speed_buildings_factor` +0.10 for forts |
| Lake buffalo | Hot Lake shore states | `local_resources_factor` +0.10 (Grain) |
| Seabird colonies | terrace states of the Islands of the South that trade with Kamu Hawin | `local_resources_factor` +0.10 (Grain) |
| Shoal fish | fishing harbour states of the Pupor Isles and the North Lands | +1 Grain per state with a harbour of level 2 or more (fish feed the Provisions) |
| Lake fish | Great Lake shore states | +1 Grain per lake town state |
| Tirri | Olodor | `local_intel_to_enemies` -0.50: the holts are hard to spy on |
| Small folk | Dobbum, Tirlan | No beast or pest event while their guards stand |

### 3.4 Trade

The economy has seven resources (Essence, Timber, Horses, Stone, Iron, Gold, Grain) and no separate trade goods or trade income. This file proposes that beast goods reach the game in four ways: as a resource where one fits, as Aenor's treasury where the crown buys, as a small `consumer_goods_factor` relief for the realms whose folk live by the trade, and as decisions, ideas or traits that pay authority for a timed gain.

| Good | From | Where it comes from and goes | Engine reading (P) |
| --- | --- | --- | --- |
| Horses, camels | horses, camels | West, Middle, Noris, the deserts | the Horses resource |
| Dragon-scale | dragons | the roosts of Dragon Mountain, sold at Kingson | Essence: Dragon Mountain's 12; "Buy Dragon-Scale at Kingson" +2 Essence for 365 days |
| Baelim resin from fallen limbs | Baelim | the Aenor Forest edge, sold at Selen | +1 Essence for 365 days, by event only |
| Gold of the golems' sands | sand golems | the southern Noris Desert | "Mine the Southern Sands" +2 Gold, with the golems' wrath |
| Gnome gold | gnomes | Olodor | luck, not gold: the gnomes keep it |
| Flame-silk | flame-silk moths | the Flaming Forests, through Stabilo | +1 Gold per silk state |
| Pearls | pearl oysters | Howan, the Sunhot isles | +1 Gold per pearl state |
| Furs | wolves, ice bears, white foxes, brown bears, reed-lynx | the Cold and North Lands, sold south | idea "The Fur Fairs" for Coldor, Fearno and Vindael: `consumer_goods_factor` -0.02 |
| Ivory | walrus, spear-whales | Pandar, the Siroler Seas | part of "The Fur Fairs" |
| Whale-oil | spear-whales, and strait-whales that die of age | Vindael | idea "Lamps of the Long Dark" for Vindael: `consumer_goods_factor` -0.02 |
| Corallus hide | coralluses | the lake towns | flavour; the shield-makers of Parim |
| Serpent-scale | sea serpents washed ashore | the Sea of Monsters' coast | one-off event: the commander trait "Serpent-Scale Mail" |
| Thorn-honey | thorn-bees | the Aenor Forest edge, sold at Parim | "Thorn-Honey for the Healers" |
| Tzikor venom | tzikor | the Redbark of the Bloody Forest | idea "Thorn-Venom Arrows" for the Bloody Forest realm |
| Fire-lizard cloth | fire-lizards | Hol, sold to the mainland smiths | +5% armoury output for one year by decision |
| Spore-cloth and dyes | giant fungi | the Mushroom Forest, through Luv-zhise | idea "The Spore Quays" for Luv-zhise: `consumer_goods_factor` -0.02 |
| Nether glass | glass-beetles | the Halls of the Nether | flavour; the Nether's gifts to Volgan's court (+10 opinion by event) |
| Salt-hawks | salt-hawks | the South's oases, sold to eastern courts | a diplomatic gift: +10 opinion |
| Herring | shoal fish | the Pupor Isles' banks, salted | Grain, as section 3.3 |
| Goblin lamps, traps and hot-spring salts | goblins | Glimkit, at Fentene | +10 opinion between Glimkit and Holdon while the Fentene fair runs |

### 3.5 War

**Mounts are equipment and are researched.** Horses, camels, wurghs and the dead horses are all War Mounts (`zin_mounts_equipment`, drawn on the Horses resource), so a people's own riders come by technology as they do now, and the breeds act as ideas (the table of section 2.1). Wurgh-riding realms take the idea "Eyes in the Dark": `land_night_attack` +0.10.

**A proposed rider line for goblins.** The goblin realms (Burrikkrit, Glimkit, Burnikit) have no people key in the warfare recruit table and no riders. Proposed: a goblin people key with the Goblin Skirmishers and a new **Goblin Wurgh-Riders** sub-unit (`zin_goblin_wurgh_riders`, mobile, light, fast, poor in daylight), unlocked by the decision "Break Wurgh Pups to the Saddle".

**Monster units come by story, never by research.**

| Unit | Who receives it | How | Limits |
| --- | --- | --- | --- |
| Troll Night-Host of Holos (P, `zin_trolls_night_host`) | the Troll Forest when an enemy holds one of its states; or a realm that has paid troll silver five years running and asks for it in a war against a neighbour of the forest | event grant of two battalions and Smash as a unique commander with the traits "Walks by Night" (+night attack) and "Stone at Dawn" (-speed) | dissolves at peace |
| A devil (P, `zin_devil`, granted equipment like the Shachihata) | realms that hold a lava-rite site and keep the rite: Puvulan, Khorvrath, Veshazel | one devil per rite; a slain devil leaves its skull (`zin_devil_skulls`), and "The Lava Rite" restores it | one devil per realm at a time; the rite costs 100 authority and 60 days |
| Abyss-folk (`zin_abyss_folk`, script) | a realm that strikes a bargain with the Abyss, or the Abyss itself against a realm that wrongs it | story event | never standing service to Volgan |
| Dragon flights (existing grant) | realms bound to Yavieth's bond | the roost-keepers' word | the elves' consent, or Afrit's corruption |
| The Baelim walk (P, `zin_baelim_walk`, a people's unit like the ent grove) | the Aenor Forest realm | when an enemy holds a forest state | very slow; strong in forest; never leaves the forest |
| Night Beasts of the black north (P, owner question 7) | the black north (`country:Zol`) | after the servant-appearance gate | never before; never recruited by anyone else |
| Griffin riders (existing, rule-gated) | men under `zin_rule_skies = beasts` | eyries technology and "Bring Griffin Eggs Down" | the rule only |

**Never units:** krors, sand golems, sea serpents, coralluses, tzikor, mukroms, angels and the wandering dead of the Mistake. Ballistae ("they pierce the hides of monsters", warfare data) are the answer to the beasts that do fight.

### 3.6 Local tradition

| Custom | People | Creature | In play (P) |
| --- | --- | --- | --- |
| The Ship-Blessing | the Leren of the strait | strait-whale | Maelwen festival: calm +5% for 30 days; killing a whale in the strait breaks the Litany: calm -10% |
| The boar-hunt | West Lands clan chiefs | wild boar | decision every two years: -10 authority, calm +3% and will to war +5% for 180 days |
| The bear-skin mantle | Cold Lands clans | ice bear | a chief who takes a bear in his own hand: +25 authority, once per ruler |
| The wardens' loaf at the flood | West Lands river wardens | ford-pike | Maelwen festival: calm +3% in river states |
| Troll silver | realms beside the Troll Forest | trolls | yearly decision: -30 authority, no night raids |
| The fire-tithe | Pornivior and the Smoking Teeth villages | devils | yearly decision: -15 authority, calm +5% (the people sleep sound; the devils are not bound) |
| The dragon-tithe | Yavieth and its friends | dragons | dragon herd raids stop for its keepers |
| Gold for luck | Olodor's neighbours | gnomes | "Bring Gold to Olodor" |
| The silver hart's peace | the elves of the Magical Forest | silver harts | a realm that hunts one loses 50 opinion with every elven realm |
| The robbed cave | the oasis-folk and the caravans | sand golems | robbing a golem's cave is death, and the golems remember |
| The Warren Luck | goblins | (the lamp) | a lamp gone out: the warren's event of bad air |
| The bread on the Silent Road | the herders of Mp'E | Horos | flavour only |
| Drowned souls | Pupor islanders | storm-petrels | fleets of Pupor realms that read the petrels: storm losses at sea -10% |
| The egg-climb | Pupor boys | seabirds | flavour only |
| The turtle shield | island elders | sea turtles | flavour only |
| The boat-breaker's jaw | the whale-road islanders | boat-breakers | festival when a hall takes one: calm +5% |
| The Fire-Speakers' reading | Goldoroth | ash-moths | after a swarm, Goldoroth may read it: will to war +5% or calm +5% |
| The roost-keepers' saying | Yavieth | dragons | flavour only |
| The lion hunt | the river-kings of the East | lions | royal decision: +15 authority, a chance of a royal death |

### 3.7 Events and decisions

| Proposed name | Where and who | When (P) | Effect (P) |
| --- | --- | --- | --- |
| Coralluses in the Reeds | owners of `zin_hab_corallus` states | MTTH 24 months; ×0.5 with the wardens paid | the reed state loses 15% Grain for 90 days, or the realm pays 10 authority for a hunt |
| Pay the Corallus-Wardens | the same | decision, yearly, 10 authority | halves the reeds' attrition and the event |
| White Flowers in the Clearing | owners of states on the Aenor Forest's edge | MTTH 36 months | woodcutters lost: -10% Timber in the state for 90 days, or send rangers: -10 authority |
| A Baelen Falls | the Aenor Forest's neighbours | MTTH 60 months | resin: +1 Essence for 365 days; taking resin from a living Baelen instead brings the Baelim to war |
| The Baelim Speak | (Middle Lands dossier) | | as there |
| Wurgh Raid on the Herds | owners of herd states beside `zin_hab_wurgh` | MTTH 18 months | -10% Horses for 120 days; hunt the pack with cavalry (-5 authority) and, for orcs and goblins, a chance of pups |
| Break Wurgh Pups to the Saddle | orc and goblin realms | decision, 25 authority, 180 days | unlocks goblin wurgh riders, or +1 Horses in a hold state for two years |
| The Troll King Walks | owners of states beside the Troll Forest who are hostile or have not paid troll silver | MTTH 12 months at peace, 4 at war | one fort level or one building lost in a border state |
| A Dragon over the Vale | owners of the Kingson Vale and the eastern downs | MTTH 36 months | -5% Horses for 60 days; none for realms that keep the dragon-tithe |
| Buy Dragon-Scale at Kingson | the holder of Kingson, and realms at peace with Yavieth | decision, yearly, 25 authority | +2 Essence for 365 days |
| Ash on the Fields | Goldoroth's slope states, after the volcano's ash-fall event | on the ash-fall | -25% Grain for 180 days; the Fire-Speakers' reading |
| Serpent off Hirolon Head | realms with harbours on the Sea of Monsters | MTTH 48 months | one merchant fleet or one galley lost |
| A Serpent on the Shore | the same | MTTH 240 months | serpent-scale: the commander trait "Serpent-Scale Mail" (+1 defence) |
| The Golem's Cave | Noris and the South's caravan realms | MTTH 60 months, or from "Mine the Southern Sands" | take the gold (+2 Gold for 365 days, then the golems' wrath: attrition +0.15 in the state for 180 days) or seal the cave (calm +3%) |
| Mine the Southern Sands | owners of the southern desert states | decision, 50 authority | +2 Gold; the golem event's chance ×3 |
| Mukroms in the Stores | owners of cave states in Kunhrim, Olodor, Hirolon and Burrikkrit | MTTH 24 months | -10% Grain in the state for 90 days |
| Clear the Galleries | the same | decision, 20 authority (10 for goblins) | no mukrom event for 730 days |
| Fever in the Reeds | owners of `zin_hab_fen` states | MTTH 12 months in summer | -10% levies in the state for 90 days; field healers and thorn-honey halve it |
| Drain the Fen | the same | decision, a three-year project | removes the midge modifier; the eels and fowling of the fen are lost (-1 Grain) |
| Thorn-Honey for the Healers | Selen, Aenor and the forest's neighbours | decision, 15 authority | attrition -5% for 180 days |
| Rats in the Granaries | any realm, through the K34 pulse | MTTH 60 months after a mild winter | Provisions -10% for 60 days; Granaries cut the chance |
| Locusts on the Wadi Farms | South and East desert-margin realms | MTTH 60 months in a dry year | -30% Grain in the state for 120 days |
| Stones from the Hills | any realm with an army in `zin_hab_kror` | each month there, a 25% chance | the army loses 300 levies and 10% organisation |
| Wolves in the Long Dark | owners of the herd states of Lerendor's North and the Cold Lands | MTTH 24 months in winter | -5% Grain or Horses in the state for 60 days |
| A Bear on the Ice | Cold Lands and Woqood sealing realms | MTTH 24 months in the sealing season | a sealing party lost, or a bear taken (see the bear-skin mantle) |
| The Strait-Whale Comes | the strait realms | each Maelwen | the Ship-Blessing |
| Ogres on the Rift Road | East caravan realms on the Rift Road | MTTH 24 months | -10% resources in the road state for 90 days |
| Hire Reeto Ogres | the same | decision, 20 authority | no ogre event for two years, and the caravans' guards count as a garrison (`local_supplies` +0.10 in the road states) |
| Dwarf Goblin Pedlars at the Gate | any realm with a market town, once in a reign | MTTH 120 months | buy (10 authority for +1 of a chosen resource for 180 days), refuse, or haggle too hard and be robbed |
| Gektor's Errand | West Lands realms | (magic reference §5.2) | gold for a fetched book or stone; a stone may hold a small spirit, and freeing it angers Gektor |
| The Bleeding Stone | West Lands realms only | (magic reference §5.2) | +2 Essence for two years; a 30% chance of the Hollow Ground scar: -25% resources in the state for five years |
| Bargain with the Nether | any ruler who finds the pact-sellers | decision chain | a timed power for a price paid in life; never a soul |
| The Lava Rite | realms that keep a devil | decision, 100 authority, 60 days, a lava-rite state | a slain devil returns |
| An Angel Seen over the Terraces | Lands of the Sun and South Lands realms | MTTH 60 months | calm +5% for 180 days |
| The Silver Hart Seen | the Magical Forest's realms | MTTH 60 months | calm +5% for 180 days |
| Lights on the Reeto Water | Luv-zhise and the Rift Narrows ferry realms | each summer | flavour, and night crossings of the Narrows for ferries |
| The Beasts on the Shore | owners of coastal states on the Kusmeel, after `zin_zol_rising` | MTTH 6 months | one building lost or 2% levies of the state lost |
| Bring Griffin Eggs Down | Aenor, only under the `beasts` rule, with eyries | decision, 50 authority | griffins equipment |
| A Gnome Door in the Bridge; Bring Gold to Olodor | (Middle Lands dossier) | | as there, the gold for luck paid from the treasury for Aenor (25) or as 2 Gold sent to Olodor for 365 days by others |

### 3.8 AI

- AI armies avoid `zin_hab_kror` and `zin_hab_mistake` states unless they are at war with the state's owner, and avoid `zin_hab_aenor_forest` unless at war with the forest.
- An AI realm beside the Troll Forest pays troll silver when it has the authority and is not at war with the forest; the Troll Forest's AI never attacks first.
- AI realms take "Pay the Corallus-Wardens", "Clear the Galleries" and "Hire Kunhrim Carriers" when their states carry the flag, and never "Drain the Fen" while at war.
- AI goblin and orc realms take "Break Wurgh Pups" once, early; AI Noris and Stabilo take "Mine the Southern Sands" only when short of Gold.
- No AI realm takes a living Baelen's resin, hunts a silver hart or kills a strait-whale.
- Every weighted value here goes through the repository's probability audit before it ships.

### 3.9 Assets the systems will need

All art is generated (K32 for creatures: the drawings are references, never used as they are), recorded in `art/source/provenance.jsonl` and wired under stable names before it is made.

- **State-modifier icons** (`interface/` modifier `.gfx`, `GFX_modifiers_zin_hab_<id>`): corallus reeds, Aenor Forest, Troll Forest, Lustras stones, the Mistake's night, spore-air, golem tracts, fen fever, crevasse fields, devil lairs, the dead wood, flame-silk swarms.
- **Event pictures** (`GFX_report_event_zin_beast_<id>`): reeds, white flowers, wurgh raid, the troll king walking, a dragon over the vale, ash on the fields, a serpent off a headland, a golem's cave, mukroms in a store, a fen at dusk, rats, locusts, a bear on the ice, the strait-whale, an angel over the terraces, the lava rite.
- **Idea and decision icons** for the breeds of section 2.1, "Eyes in the Dark", troll silver, the fire-tithe, the corallus-wardens, dragon-scale, thorn-honey and the boar-hunt.
- **Unit art and counters** for the goblin wurgh riders, the troll night-host, the devil, the Baelim walk and the night beasts, through the 3D model pipeline and the counter rules of the project.

## 4. Questions for the owner

1. **Card sizes.** The cards make Smash the height of sixty men, Roka more than twenty, the devils and the Baelim eleven to seventeen and the forest trolls eight to ten. Should the models and pictures keep these sizes, or may they be scaled to read on the game's map and screens?
2. **The sea serpents' waters.** The card's "Belegaer" is a Tolkien name and its "[?Trenin?] Sea" is unplaced. This file reads them as the central sea and the Sea of Monsters. Is that right, or do you mean another water, such as the Pupor Isles' seas?
3. **Sand golems and krors.** Both are immortal on the cards and stand outside the vault's ranks. Are they made beings, bound spirits or a kind of living stone? The answer decides whether wards, spirit-craft and Gektor's sorcery can touch them.
4. **Griffins.** The warfare spec allows griffin riders under a game rule. Do griffins exist in Aoaz at all, and if so, where do they nest?
5. **The lava rite.** Who may perform it: only the devils' own servants, Volgan's orders, or anyone who has a devil's skull and a lava pit? The answer decides which realms can keep a devil.
6. **The Human card's lesser peoples.** What are the card's "[?wuuks?]", "ologs" and "cyclopes"? Should any of them enter the bestiary, under original names?
7. **The Beasts of the Mistake in the last war.** Should Kusven's Beasts fight in the War of the Last Crowns as a host of the black north, or stay a terror of the Mistake's mainland only?

## 5. Sources

- [BC n]: the card or drawing with index n in the transcriptions (`docs/lore/sources/bestiary_cards_part1.md`, `_part2.md`).
- [K n]: the owner's decisions in `docs/specs/INTEGRATION_DECISIONS.md`.
- Vault: `Canon Policy.md`, `04 - Peoples/Peoples of Aoaz.md`, `02 - Spirits/Spirits and Their Ranks.md`, `02 - Spirits/Damned Spirits.md`, `02 - Spirits/Spirit Natures.md`, `03 - Figures/Horos.md`, `Golbran.md`, `Kusven.md`, `Roka.md`, `King of Demons.md`, `05 - Geography/Abyss.md`, `08 - Artifacts/Castle of Yeldenne and Glo.md`, `09 - Development/Names and Retcons.md`.
- Dossiers: `docs/lore/regions/*.md`, sections 2, 3, 4, 9, 12 and 13.
- References: [knowledge_layers.md](knowledge_layers.md) (C17 to C25, V4, V5, V20, V23), [magic_and_wizards.md](magic_and_wizards.md) (§2, §3.13, §3.15, §5.2), the voice guide.
- Data: `tools/content/data/world/roster.json`, `languages.json`, `languages_new.json`, `tools/content/data/warfare_units.json`, `warfare_equipment.json`, `economy.json`.
- Engine: `documentation/modifiers_documentation.md` of the installed game (the state modifiers named in section 3.1) and the vanilla state modifiers `skirmishes_against_imro` (`common/dynamic_modifiers/0_dynamic_modifiers.txt`) and the `SEA_dynamic_modifiers.txt` block that combines `local_supplies_for_controller`, `army_speed_factor_for_controller` and `attrition_for_controller`.
