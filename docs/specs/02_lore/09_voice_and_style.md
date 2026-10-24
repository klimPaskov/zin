# Voice and style of ZIN

**Status:** Accepted by the owner on 24 October 2026 after reviewing three before-and-after quotes ("Yes, this voice"). **Date:** 24 October 2026.
**Basis:** owner decision K33 of 24 October 2026, in the owner's own words: "Fix quotes as well: right now there is just too much about fishermen or whatever. And also, they are too staccato and dramatic. They should use period-accurate language and also be readable, like casual sentences, not robotic with hedging."
**Applies to:** every line of text a player reads: loading quotes and counsel tips, events and news events, focus, idea and spirit descriptions, decisions and missions, tooltips, the Aoaz bar and panels, and the Chronicle of Aoaz.
**Companions:** [knowledge_layers.md](../../lore/references/knowledge_layers.md) (what text may know), [03_names_and_terms.md](03_names_and_terms.md) (names), [pantheon.md](../../lore/references/pantheon.md) and [calendar.md](../../lore/references/calendar.md) (gods and months), the regional dossiers in `docs/lore/regions/`, the banned-word data `tools/content/data/banned_words.json`, and the loading-screen spec [02_loading_screens_and_quotes.md](../08_art_and_assets/02_loading_screens_and_quotes.md).
**First application:** the rewrite of all 150 loading quotes in `docs/design/text/loading_quotes_v2.json`.

The examples in this file are proposed text, like every quote and line of flavour in ZIN, and the lore under them keeps the status its own source gives it.

## 1. The target in one paragraph

ZIN should read like people of a late-medieval world talking and writing about their own lives.
A ploughman grumbles about the tithe, a guild clerk jokes about the court, a chronicler sets down what happened and what it cost, and an old elf answers a question with more patience than the asker deserves.
The sentences are whole, easy to read aloud and varied in length, and they lean on subordinate clauses the way speech does ("because", "so that", "which is why", "when").
The words are plain and old: king, guild, temple, host, levy, toll, tithe, harvest, roll, seal, road.
The flavour comes from idiom, address and the things people care about, not from archaic grammar, grand vocabulary or a drumbeat of short dramatic sentences.
Nothing sounds like a slogan, a film trailer, a textbook or a machine that is unsure of itself.

## 2. The rules

### 2.1 Diction: period, plain, British

1. **Use the words of the world.** Kings, lords, thanes, wardens, guilds, temples, houses, hosts, levies, companies, banners, tolls, tithes, rolls, charters, seals, granaries, roads, fords, passes, caravans, wells and markets.
2. **Prefer the plain word to the grand one.** Say "started", "ended", "hard", "old", "many", "rich" rather than "commenced", "culminated", "arduous", "ancient beyond reckoning", "myriad", "opulent".
"Ancient" is allowed when it is the plain word for very old; it should not be used as decoration.
3. **British spelling throughout:** armour, honour, harbour, colour, neighbour, plough, grey, defence, centre, travellers, organise, recognise.
4. **Archaic flavour lives in idiom and address, not grammar.** Good: "my lord", "good wife", "by your leave", "mark me", "the old folk say", "in my grandfather's day", "I warrant", "a fair price", "a hard winter", "the twelve keep you".
Bad: "thee", "thou", "thy", "hath", "doth", "'tis", "forsooth", "verily", "ye olde" in ordinary speech.
5. **Thee and thou are allowed only for the old and the liturgical:** a litany of the twelve, an oath formula, an elf of great age speaking formally, a herald reading an ancient charter.
Even there, use them sparingly and correctly ("thou art", "thy", "thee") and never mix them with modern contractions in the same line.
6. **Contractions are natural in speech** ("don't", "won't", "it's", "I'd") and are avoided in the Chronicle, charters, inscriptions and liturgy.
7. **Numbers in prose are written as words** up to a hundred and in round figures ("a thousand years", "twelve centuries"); dates use the Age and year ("4A 1736") and the god-months ("1 Lumae").

### 2.2 Rhythm: whole sentences that flow

1. **No staccato chains.** Two or three short declaratives in a row ("The victory was real. So was the price.") are the commonest fault of the old text; join them with a conjunction or a clause, or let the second idea grow out of the first.
2. **Vary the length.** A line may be one long sentence with two clauses, or a long sentence followed by a short natural one; it should not be three short ones of the same length.
3. **No two-beat punchlines.** The pattern "X is Y, and Ys do Z" or "A did this. B did that." makes every line sound like an aphorism machine; use it once in a great while, never as the house style.
4. **No fragments as sentences.** "Entered here as a curiosity." and "Travellers' advice: go north." are notes, not speech; a scribe can write a note, but then it should read like a real scribe's note, with a subject and a verb.
5. **Let people explain themselves the way people do:** with "because", "so", "which is why", "and that is how", "when", "until", "if".
6. **Sayings may be short but must be sayings.** A real proverb is usually one sentence with a turn inside it ("A guest is fed first and questioned in spring"), not a pair of clipped statements.

### 2.3 Tone: no melodrama, no trailer voice

1. **Understate.** The people of Aoaz have lived with war, plague and the dead for four ages; they speak of terrible things plainly, often wryly, and the reader feels the weight without being told to.
2. **No portentous closers.** Cut lines that end on a doom-laden turn ("and doors open", "the earth remembers", "the dead were never told") unless the speaker is someone who would really talk that way, such as a priest at a grave.
3. **No trailer words** used for effect: doom, darkness rising, fate, destiny, the end of all things, shadows gathering, nothing will ever be the same.
4. **Humour is welcome** and is the main tool against melodrama: market jests, soldiers' grumbling, peasants' complaints, the dry wit of courts.
5. **Fear is shown through behaviour,** not announced: a fisherman who will not put in at a black island, a mother who keeps the lamp lit, a scout who counts the dust on a road.

### 2.4 No hedging, no robotic phrasing

1. **Cut every hedge that the speaker would not use:** "arguably", "in many ways", "to some extent", "it could be said", "it is said that perhaps", "some might argue", "it is worth noting", "notably", "interestingly", "essentially", "ultimately".
2. **Uncertainty belongs to people, not to the narrator.** When the knowledge layers require doubt, give the doubt to a speaker: "the fishermen swear", "my grandmother told me", "the scholars of Parim have argued about it for three hundred years".
A sentence with a believer in it is confident about the belief; it does not need "perhaps" as well.
3. **No explaining to the reader.** People do not tell each other what everyone in their world knows ("The Houses of the First Light, an institution that keeps the grain stores, ..."); they mention it in passing and the reader learns from the passing.
4. **No modern abstractions:** "dynamics", "factors", "impact", "framework", "narrative", "legacy" in the modern sense, "resources" as a mass noun, "key" as an adjective, "strategic", "logistics", "infrastructure", "population" in speech (folk, people, mouths to feed).

### 2.5 No modern words

The banned-word data (`tools/content/data/banned_words.json`) is part of this guide, and its error rules fail the build.
The traps that matter most for prose are below; the data is the complete list.

| Do not write | Write instead |
| --- | --- |
| stability, war support, manpower, political power | calm, will to war, levies, authority |
| division, battalion, regiment, corps, general, colonel | host, company, banner, captain-general, captain, serjeant |
| government, nation, national, citizen, civilian, propaganda | rule, court, realm, realm-wide, townsfolk, common folk, proclamation |
| chancellor, minister, cabinet, president, parliament, senate | Keeper of the Seals, councillor, council, Speaker, moot, Speakers' Hall |
| factory, industry, steel, coal, oil, fuel, electricity | workshop, armoury, craft, iron, charcoal, essence, lamp oil only by allowance |
| gun, cannon, rifle, tank, artillery, bomb | missile fire, catapult, trebuchet, bow, heavy foot, siege engines, fire-raid |
| convoy, railway, truck, motorised, mechanised | merchant fleet, high road, wagon train, mounted |
| operation, tactical, strategic, logistics | scheme, campaign, supply, the roads |
| kilometres, metres, kilograms, tons | miles, paces, pounds, loads, days of march |
| real months, weekdays and years | the god-months, the Age and year |

Gunpowder weapons are common in some realms by the owner's decision of 24 October 2026, but which realms is not decided, and the build still bans the words; until both are settled no text names a firearm.

### 2.6 No implementation talk

Player text never mentions values, caps, modifiers, flags, updates, reworks, builds or game rules except where a tooltip must state a mechanical effect.
Flavour text never says "this event", "this focus" or "the player"; it speaks to "you" as the ruler, or about the realm.
Counsel tips may name the interface ("the Realm panel", "the Aoaz bar") because their job is to teach it, and they speak plainly in the second person.

### 2.7 No exact ages of beings

No text gives a figure for the age or lifespan of any god, spirit, elf, giant, man or beast (Canon Policy, Ages of beings; knowledge layers V23).
Write "older than the roads", "of a great age", "who remembers Dardan", "who has seen more winters than the cairns can count".
The lengths of the Ages are not ages of beings and may be stated; customs that count years, such as a giant's cairn stone for each winter, may be described without giving a total.

### 2.8 Knowledge layers

Every line speaks from inside Aoaz and knows only what its speaker's world knows ([knowledge_layers.md](../../lore/references/knowledge_layers.md), sections 1.2 and 3).

1. **Sealed facts never appear,** in any voice, as hint, riddle or joke: the wider world's true shape, Erdu and Dunda, Zol's creator, Zol's divine servants, which god Volgan served, and the name and identity of Zol's servant who appears in the last war.
**Kusven is never named in public text** and nothing alludes to his name's meaning; the black north's servant appears only behind its gate and only as "a Great Spirit of the black north" or similar (C24, C25).
2. **Zol never appears in person** in any text about the War of the Last Crowns (C26); before the war he is spoken of only as the Old God of Death whose name the black north bears, in the voice of people who fear him.
3. **Gated facts stay behind their gates:** the Deliverer is Aurevan the Deliverer in public text, the Houses of the First Light are a trusted institution, the Royal Council is only the Royal Council, the Man from the Ice is not named, and Varner's whereabouts are legend.
4. **Belief needs a believer in the same sentence:** "the Bowl-Bearers say", "pilgrims hold", "the Gala keep".
5. **A dispute stays a dispute,** and a mystery stays a question: text may say that nobody knows why the black north is called a Mistake, and may not suggest why.
6. **The Worshipdom shows only its public face:** pilgrims, valleys, couriers, blessings and kind abbots.

## 3. Before and after

Each pair shows a line from the current text, what is wrong with it, and the same idea in the target voice.

| Before | Fault | After |
| --- | --- | --- |
| Dardan cost millions of lives and left a wasteland. The victory was real. So was the price. | Staccato, two-beat closer, trailer tone | The Grand Alliance won at Dardan, and the chroniclers who counted the dead afterwards gave up long before they reached the end, for the field was a wasteland and half the kingdoms of men had buried their sons in it. |
| Men, elves, dwarves, giants and spirits stood in one alliance. It happened once. The chroniclers still argue about why it worked. | Clipped fragments, modern explanatory tone | Men, elves, dwarves, giants and spirits once stood together under King Edran's banners, and no age since has managed it again, though the scholars of Parim have spent a good many winters arguing about how he did it. |
| The spirits did not destroy Volgan. They stripped his strength and cast him into the Void. A banishment is a door, and doors open. | Portentous closer, aphorism machine | The spirits did not kill Volgan when they beat him; they stripped him of his strength and threw him into the Void, and any warden of Mirolon will tell you that what is thrown out can find its way back. |
| Nothing lives in Zol's Mistake. Things walk there anyway. | Trailer voice, fishing cliché | My father sailed past the black shore once in his life, and all he would ever say about it was that nothing grows there and something walks there, and that he would thank me not to ask him again. |
| 4A 1744. Fishermen speak of black ships among the islands of the Ocean of Zol. Entered here as a curiosity. | Fragment, superseded sea name | 4A 1744: the fishermen who came in this spring speak of black ships seen among the islands of the Kusmeel, and the harbour-master has had their tale written down, though he does not believe a word of it. |
| The New Gods are young, the proverb says. Young as the mountains are young. | Riddling, mock-profound | The priests of the twelve call the New Gods young, which makes the old women laugh, because by that reckoning the mountains behind the village are young as well. |
| In the Cold Lands a guest is fed first and questioned in spring. | Acceptable as a proverb, but bare | In the Cold Lands a stranger at the door is given a seat by the fire and a bowl before anyone asks his name, and the questions can wait until the thaw. |
| Gold does not rust. Gold does not bend. Let the crown that wears it do the same. | Slogan rhythm | Gold neither rusts nor bends, and the king who had these words cut above his doors meant that his crown should do the same, though the goldsmiths of Parim will tell you that pure gold bends very easily. |
| An army is not a parade that happens to carry swords. | Modern quip | I have told the court every spring for ten years that a host which drills only for the king's birthday will fight like one, and every spring they thank me and order new plumes. |
| Winter is the only king every tribe of the Cold Lands obeys. | Slogan | Every clan of the Cold Lands has refused some king or other in its time, but I have yet to meet one that refused the winter. |
| The dead are not wicked. They are only tired, and someone will not let them rest. | Mock-tender aphorism | When we lay the raised dead down again we speak to them gently, because the poor things meant no harm and only wanted to sleep, and it was someone else who would not let them. |
| Never ask an ent the way. You will arrive, but your grandchildren will be there to greet you. | Joke with a stock shape | If you ask an ent of Kilinti the way through the forest he will tell you truly and in full, but bring a loaf and a blanket, because the telling will last longer than the walk. |
| It is said that perhaps the Old Gods merely sleep. | Hedged, narrator holds a belief | Half the priests in Parim will tell you the Old Gods are dead and the other half that they only sleep, and the fishwives, who have heard both sermons, keep a lamp lit either way. |
| The realm's strategic logistics network is improved. | Modern words, implementation voice | The new high roads are open, and the wagon trains reach the border in half the days it took last year. |
| Arguably the most important trade route in the East Lands. | Hedge, textbook | Every caravan master in the East will tell you that if the salt road closes for a season, half the markets between the rift and the desert close with it. |
| Stability +5%. The people feel safe. | Banned word, flat | The people sleep sound and pay their dues on time. (The tooltip states the effect in the game's own terms.) |

## 4. Registers and voices

Each register below describes who speaks, how they speak, what they talk about, and what they avoid.
A register is a habit of speech, not a costume; two speakers of the same register should still sound like two people.

### 4.1 The chronicler

**Who:** the writers of *The Chronicle of Aoaz*, *The Annals of Parim*, *The Annals of Gunwyn*, harbour rolls and temple rolls.
**How:** measured, complete sentences in the past tense, with dates by Age and year; no contractions; judgement given quietly in a closing clause; a little dryness allowed.
**About:** what happened, who did it, what it cost and what it led to.
**Avoid:** dramatic present tense, rhetorical questions, one-word sentences, and certainty about matters the world disputes.

- *In the last years of the Second Age the Necromancer took Aenor, and those who had fought him longest saw their own dead rise against them, so that every battle lost cost the kingdom twice over.*
- *4A 1736: an envoy of Mirolon came before the court and warned it that the south was arming; the court heard her courteously, gave her supper and sent her home, and the annalist has recorded no reply.*

### 4.2 The proverb or saying

**Who:** a people, a trade or a place, never a single named person.
**How:** one sentence, sometimes two, in the present tense, with a turn inside it; earthy images from the speaker's own life (bread, cattle, tolls, weather, wells, wagons, the hearth).
**About:** how the world works, as the speaker's people have learned it.
**Avoid:** the "X is Y. Y does Z." two-beat, abstractions, and morals that a modern self-help book would print.

- *Pay the toll at Kingson with a smile, because the toll-man will be there next year and you may not.*
- *A well shared makes kin, and a well sealed makes enemies for seven generations.*

### 4.3 The soldier

**Who:** levies, serjeants, captains, wardens, scouts, company men and their marshals.
**How:** short practical sentences that still join up; grumbling, gallows humour, plain talk about food, boots, pay, weather and officers; "lads", "the captain", "the line".
**About:** marching, waiting, the enemy's habits, the court's ignorance, comrades.
**Avoid:** speeches about glory, slogans, any modern military word (see 2.5).

- *Watch the dust on the southern road, lad, because a scout's eyes will lie to you about how many are coming and how fast, but the dust never does.*
- *The court gave us new banners for the jubilee and no new boots, so we shall march to the border looking very fine and limping.*

### 4.4 The priest of the twelve

**Who:** the clergy of the twelve main New Gods: the Counsellors of Glernaen, the Bowl-Bearers of Sulethe, the Lamp-Mothers of Lumae, the Rain-Priests of Maelwen, the Cradle-Wives of Vaelei, the Guest-Masters of Rasthel, the Watch-Chaplains of Kerun, the Furrow-Priests of Aurlan, the Oath-Keepers of Ailtal, the Anvil-Priests of Irumas, the Name-Readers of Gaelor, the Star-Watchers of Naisa, and the Reckoners who keep the calendar.
**How:** warm, practical and a little formal; teaching through custom ("we break a bowl on the threshold when the fever leaves"); liturgy may use "thou" and "thy" in an oath or litany; never preachy.
**About:** the need each god answers, the rites of the household and the season, kindness to strangers, the dead and the living.
**Avoid:** claiming that a god acted as plain fact (it is the believer's account), theology lectures, and anything about the Holy Seven except as the oldest of fables.
The names, needs and rites of the twelve are proposed in [pantheon.md](../../lore/references/pantheon.md) and are public once the owner approves them.

- *We put the fires out on the last night of Sulethe and light them again at dawn from the common hearth, so that no house in the village begins the year with a fire of its own making.*
- *Ask Ailtal to witness your bargain if you like, but she is a goddess of kept promises, and she has never yet been known to help a man who meant to break one.*

### 4.5 The elf

**Who:** the elves of the Magical Forest, Herrodon, Andos Enda, Nolorim, the roost-keepers of Yavieth, the Gala and the Sunhot of the Lands of the Sun.
**How:** courteous, patient, unhurried, long sentences with exact words; dry understatement; they speak of centuries as men speak of seasons, without boasting and without giving their own ages; formal "thou" only from the oldest, and then rarely.
**About:** memory, precedent, the forest and the dragons, the debts of King Edran's war, the shortness of men's memories, said kindly.
**Avoid:** mystic riddles, condescension spelled out, prophecy.

- *Men often ask why we did not come when the Necromancer marched on Aenor, and we answer that we had come once already, for King Edran, and were still burying what that cost us.*
- *A decision of the houses is judged as one judges a young tree, by what it shelters when the men who planted it are long dead.*

### 4.6 The dwarf

**Who:** the delving-clans of Kunhrim in the Great Wall range, and the holds of the great ranges of the West and North Lands.
**How:** blunt, proud, a little quarrelsome; craft words (seam, vein, gallery, anvil, hammer, measure); prices and debts remembered exactly; dislike of elves and of bows, by the owner's dwarf card.
**About:** stone, ore, honest work, bad customers, the shortness of the surface-folk's patience.
**Avoid:** pantomime Scots or northern-English dialect spelling, and any home of the dwarves beyond the ranges the owner named (their homeland is open, V11).

- *We sell iron to the men of Kingson by the honest pound and to the elves by the elvish pound, which is the same weight at twice the price, and nobody on either side of the mountains has ever complained to our faces.*
- *A gallery is cut for a hundred years, and the man who cuts it badly will hear about it from his grandsons' grandsons.*

### 4.7 The giant

**Who:** the hill giants of Hirolon, the ice giants of Nivaros, the giants of the Giant Forest in the Dark Lands.
**How:** slow, simple words, long sentences joined by "and"; patience and a long memory; humour so gentle that men miss it; their cairns and stones; never a number for their ages.
**About:** stones, hills, winters, the small folk they protect, men who hurry.
**Avoid:** stupidity jokes, and the Hirolon giants being anyone's subjects: Hirolon is a sovereign kingdom that treats with Aenor.

- *Men come up the hill to ask what we remember, and we tell them, and they go down again in a great hurry to write it on a skin that will rot before the stone does.*
- *The Tirim plant their barley in our valleys and we keep the passes for them, and in all the winters of the cairns that bargain has never needed a scribe.*

### 4.8 The goblin

**Who:** the goblins and hobgoblins of Glimik in the Great Wall range, of Glimkit in the warm valleys of the southern Cold Lands, and of the warrens under the Goldoroth Mountains.
**How:** quick, sly, greedy and funny; short bursts that still form sentences; love of gold, lamps and clever tools; contempt for orcs' brains and for daylight.
**About:** loot, bargains, lamps, the hobgoblin king who simply grew very big, the stupidity of big folk.
**Avoid:** pure villainy, and making the hobgoblin king rule more than his own realm.

- *The sun makes a goblin sleepy, which is why we let the big folk have the day, since it is plainly all they are good for.*
- *Our king was only a hobgoblin once, like any other, but he ate well and grew, and now he is very big and very wise, and anyone who says the second does not follow from the first can say it to him.*

### 4.9 The trader

**Who:** caravan masters of Noris and Stabilo, guild merchants of Kradlon and Corogon, toll-men, money-lenders, pedlars and market-wives.
**How:** shrewd, cheerful, numerical, full of weights and measures, scales, prices and roads; jokes about princes and customs officers.
**About:** roads, tolls, wells, scales, partners, risk, the next fair.
**Avoid:** modern economics ("market forces", "supply chain", "profit margin").

- *A caravan master carries three sets of scales, one for buying, one for selling and one for the customs house, and he trusts none of them as far as he trusts his camels.*
- *In Postondoroth they weigh gold, salt and promises on the same scale, and somehow it is only ever the promises that come up light.*

### 4.10 The peasant

**Who:** ploughmen, shepherds, herders, cottagers, millers, alewives, woodcutters, grandmothers.
**How:** homely and concrete, with weather, animals, rents, tithes and neighbours; complaint as an art form; "my old mother used to say".
**About:** the harvest, the lord, the priest, the tax, the road, the river, the dead in the old fields.
**Avoid:** quaint rustic spelling ("'e were"), and noble-peasant speeches.

- *The steward came for the tithe the week after the hail, so we gave him a tenth of the hail, and he was not pleased with it.*
- *Rain for the barley, a priest for the fever and a lamp for the road, my mother would say, and if you have all three you have no business grumbling about the fourth.*

### 4.11 The court letter

**Who:** kings, queens, councillors, envoys, heralds and the Keeper of the Seals, writing to one another.
**How:** formal courtesy, long balanced sentences, titles and styles ("Our cousin of Lerendor", "Your Majesty's servant"), the royal "we" for monarchs; the barb is wrapped in politeness.
**About:** treaties, tolls, marriages, insults, grain, debts, the precedence of crowns.
**Avoid:** modern diplomatic vocabulary ("bilateral", "sanctions", "summit"), and plain abuse.

- *We thank our good cousin of Lerendor for his letter concerning the strait dues, and we have read it twice with great attention, once for its courtesy and once to see whether the figures improved on a second reading.*
- *Your Majesty's servant begs leave to observe that the treasury is not empty, since it contains a great many promissory notes, all of them bearing Your Majesty's own seal.*

### 4.12 A dark power

**Who:** Volgan, heard only through Mirolon's songs and the words his envoys carry; the necromantic orders of his dominion; the demon lords of the Nether; orc warkings.
**How:** calm, patient, reasonable and cold; the menace lies in what is said quietly; no ranting, no cackling, no "mortals" and "puny".
**About:** patience, the divisions of men, debts called in, the way kingdoms forget.
**Avoid:** quoting Zol, Kusven, the Deliverer himself, Horos or Eindil at all (loading-screen spec, attribution style); claiming Volgan's arming as fact outside Mirolon's own voice before his march (V9).

- *Volgan does not hate the kingdoms of men, the old song has him say; he has only learned that they quarrel, and he has never been in a hurry.*
- *The lords of the Nether keep every bargain to the letter, and that is exactly what the men who bargain with them forget to fear.*

### 4.13 Other voices

The same habits apply to the voices this guide does not list separately: scholars of the University of Parim (precise, ironic, fond of footnotes), wizards such as Bastian (learned, a little vain, never giving their age), the small folk of Tirlan and Dolw-Grewn (comfortable, sociable, fond of food and gossip, wary of big folk's quarrels), the walking tree people of Aenor Forest, the Baelim (heard only through what woodcutters and rangers report, because men hear only low voices), orcs (boastful, loud, practical about killing), trolls (few words, hunger and stone), yeti (the hum of the mountain), and the faithful of the Worshipdom (gentle, welcoming and only ever its public face).

## 5. The surfaces

| Surface | Voice | Length | Rules |
| --- | --- | --- | --- |
| Loading quotes | One register per quote, with an attribution line | Under 220 characters of text | One idea of the world per quote; see sections 6 and 7 |
| Counsel tips | Plain second person, the voice of a trusted adviser | Under 220 characters | State the gameplay fact exactly; no flavour that obscures it; interface names allowed |
| Events | Narrator in the chronicler's register; speakers in their own registers inside the text | As the event spec gives | The narrator knows only what the viewing country knows; options are the ruler's own words, short and in the first person or the imperative ("Send the grain north." "We will not pay.") |
| News events | A herald's or chronicler's report, past tense | Short | Who, what, where and what people say about it; no commentary from outside the world |
| Focus descriptions | The court explaining a course to its ruler, or the chronicler describing a policy | Two to four sentences | Say what the realm does and why it matters to the people in it; no "this focus gives" |
| Idea and spirit descriptions | Describe the state of the realm as its people feel it | One to three sentences | Present tense; no numbers in the prose; the modifier block shows the effects |
| Decisions | A short title in plain words; a description in the court's voice | One or two sentences | The cost and effect live in the tooltip; the prose says what is being done |
| Tooltips | Plain, exact, mechanical | As short as clarity allows | The only place where effects are stated directly; use the game's own terms (authority, calm, will to war, levies) |
| The Chronicle of Aoaz | The chronicler | Entries of a paragraph | Past tense, dates by Age and year, judgement in a quiet closing clause; respects the knowledge layers of the viewing country |

## 6. How quotes carry the world

Owner rule F7 asks that quotes carry lore, never god-versus-man trivia; this guide reads that as follows.

1. **Every quote teaches one true thing about Aoaz** (a place, a people, a custom, a quarrel, a piece of history or a belief) and its `basis` names the source of that thing with its status.
2. **The truth sits in the details, not in a lesson.** A quote about a toll at Kingson tells the reader that the pass is the only wheel road through the Great Wall and that two peoples share it, without saying so as a geography lesson.
3. **Ordinary life first.** Most quotes should come from people at work and at home (ploughmen, smiths, toll-men, priests, soldiers, carters, midwives, scholars, herders), because that is where a world feels lived in; kings and dark lords are seasoning.
4. **Spread the world.** Quotes are drawn from all fourteen regions and many peoples, and no single trade or theme is allowed to dominate; in particular, fishing, nets, boats and the sea are limited to a handful across the whole set.
5. **No cosmic trivia.** Quotes do not play with the ranks of gods and spirits for the sake of a riddle, do not set gods against men as a joke, and do not explain the metaphysics; when a quote touches the divine it does so through a rite, a custom or a believer's habit.
6. **Respect the faiths of each region.** The twelve are honoured across most of Aoaz, but the East and the South keep their own faiths (the Well-Oath, the Creed of the Honest Scale, the River Temples, the Lake Litany, the Red Hearth), the islands their own (the Wave-Tally, the Tide-Houses, the Chart-Faith), and the peoples of the hills and forests their own; a quote from those lands speaks in their faith.
7. **Hidden things stay hidden** (section 2.8), and proposed lore is never written as settled where the vault leaves it open.

## 7. Attribution lines

The attribution follows the text after `\n- ` and names who is speaking or where the words come from.

1. **Named speakers** are used where the lore has them: established figures (Aen, King Edran, Varner, Lorien, the Golden King, Alleria of Selen) and the proposed characters of [02_characters.md](02_characters.md), each with a title ("Queen Vaestia of Coldor", "Lawspeaker Ilurda of Gunwyn", "Merovan, Keeper of the Seals").
Words given to the long dead are framed as remembered: "Words the heralds give to Aen, First of His Name", "As the elves remember Varner".
2. **Sayings are attributed to a people, a trade or a place:** "Saying of the Gunwyn clans", "Carters' saying, Vale of Aenor", "Proverb of the dwarves of Kunhrim", "Market jest of Parim".
3. **Written sources are named:** *The Chronicle of Aoaz* with its age, *The Annals of Parim*, *The Annals of Gunwyn*, *The Harbour Rolls of Sonargur*, a rule or inscription with its place ("Inscription over the gate of Kingson").
4. **Some voices are never quoted:** Zol, Kusven, the Deliverer himself, Horos and Eindil; Volgan only through Mirolon's songs.
5. **Titles must pass the banned-word scan:** "Chancellor" is banned, so Merovan is "Keeper of the Seals"; "General" is a review word, so use "Marshal" or "Captain-General".
6. **Attribution lines are short:** a name and a title, or a kind of saying and a place, never a sentence.
7. **No quotation marks, no `$`, no square brackets,** and only Windows-1252 characters; plain ASCII is preferred (loading-screen spec, section 7).

## 8. Canon checklist for writers

| Write | Never write | Note |
| --- | --- | --- |
| Aoaz | Erdae, Arda | Erdae is only the small neighbouring continent and needs an allowance |
| the Ember Lands | the Ember Lands | Volgan's country; the realm is proposed as Puvulan |
| the Kusmeel | the Kusmeel, the Kusmeel | The sea north of Zol's Mistake |
| the Pupor Isles | Triton's Islands | |
| Gunwyn | Gunwaith | No "-waith" name anywhere |
| Lerendor and Veskel | Lerendor and Lerendor's North | One crown |
| Vindael | Windwaith | The Cold Lands' ice arm |
| Orohaf | Asgard | Aenor Isle's harbour |
| Melkgard | Isengard | |
| Nivaros | Titanos | The ice giants |
| Naamis, Rhachia | Gondolin, Avalon | East Lands realms |
| Soyano, Ossi Luni | Hengyang | Lands of the Sun |
| Yeni Alang, Tor Luni | Heaven, Godland | |
| Hirolon | Hiloron | A sovereign giant kingdom |
| the Baelim, the walking tree people of Aenor Forest | Coniferons | Separate from the ents of Kilinti |
| the small folk, the Tirim of Tirlan, the Bykkwyn of Dolw-Grewn | hobbits, the Shire | Names proposed |
| wurghs, bone-hounds | wargs | |
| the Great Wall of Aenor, a natural mountain range | a built wall, the Pale March | Forts hold its passes |
| the Accord of the Passes (4A 96) | the Wall Accord | Proposed |
| the god-months, Glernaen to Naisa | Deepwinter, Thaw, Highsun, Harvest and the other farming names | Names proposed in [calendar.md](../../lore/references/calendar.md) |
| a sea, a strait, a water, a gulf | any name with "Ocean" | Owner's request of 24 October 2026 for this rewrite; the map's sea names are being renamed by their own owners |
| Zol, the Old God of Death | Zol in person in the last war | |
| (nothing) | Kusven, or any hint of his name | Sealed |
| Eindil | Einendil | |

## 9. The reading-aloud test

Before a line is accepted, read it aloud once.

1. Would a person of this world say or write it this way, in this situation?
2. Does it run as one breath or two, without stopping on every full stop?
3. Is there a word a person of a late-medieval world would not know?
4. Does it end on a clever turn that it has not earned?
5. Does it hedge where the speaker would not?
6. Does it tell the reader something true about Aoaz, and is its basis right?
7. Does it keep the knowledge layers: no sealed fact, no ungated secret, belief with a believer?
8. If it sounds like a slogan, a trailer or a textbook, rewrite it.

## 10. Open points

- The owner has not yet approved the names of the twelve gods and the god-months (Q-01 answers in [pantheon.md](../../lore/references/pantheon.md)); text that uses them stays proposed until he does.
- The replacement names in the regional dossiers (Gunwyn, Veskel, Orohaf, Melkgard, Nivaros, Naamis, Rhachia, Baelim, Tirim and the others) are proposals; if the owner changes one, the quotes that use it change with it.
- The sea names on the map still carry "Ocean" in several dossiers; this guide avoids them in text until they are renamed.
- Which realms use gunpowder is undecided, and the banned-word data still forbids the words.
- The banned-word rule for "Kusven" still offers "Zol" as its replacement, which predates the correction that Kusven, now Kusven, is Zol's servant; the data's owner should change the hint, and Kusven needs a sealed rule in `secret_terms.json` (knowledge layers C25).
