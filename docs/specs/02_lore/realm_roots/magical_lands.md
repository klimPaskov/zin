# Realm roots: the Magical Lands

**Status:** Proposed (decision K67, 25 October 2026). Nothing here is canon until the owner adopts it; every root, sign and hook below is labelled **P** under the vault's Canon Policy, and the few established facts it builds on are labelled **E**.
**Data:** the `roots` and `sign` fields of each realm in `tools/content/data/world/history/magical_lands.json`, with the events, divergences and customs added beside them.
**Companions:** [the regional dossier](../../../lore/regions/magical_lands.md) (section "Roots and signs"), the vault note [Roots of the Magical Lands](../../../lore/vault/07%20-%20History/Roots%20of%20the%20Magical%20Lands.md), [10_fallen_realms.md](../10_fallen_realms.md) (Tarkia, whose heirs here are Luv-zhise, Eldafaen and Lccimio), [deep_past.md](../../04_mechanics/deep_past.md) (the Two Gates loop) and [06_heraldry.md](../../08_art_and_assets/06_heraldry.md) sections 1.4 and 1.5.

## Purpose

The owner asked that every realm carry the ancient history that built its culture, and that its sign come out of that history as the Eye came out of Sauron (K67).
The Magical Lands were never conquered (E), so their roots are not stories of empire: each is the deed, gift, loss or oath from which one small community's law grew, and each sign is the object or creature at the centre of that deed.
The guards that bind this region are kept: the Worshipdom is written only as its public story, Yavieth shows a shed scale and the mountain and never a dragon, the mycids are written only as others see them, no sun goes to any elven house, the kinship of the Gala and Sunhot elves stays open, Varner's dwelling is never placed, and no fallen realm's own name appears in game-facing data.

## The signs at a glance

| Realm | Sign (device) | Charge class | Root |
| --- | --- | --- | --- |
| Magical Forest | the Speaking Bough, a fallen bough laid level | bough | the First Listening under the oldest Singing Grove |
| Herrodon | the Hall-Owl, a white owl with raised wings | bird | the White Winter and the First Queen |
| Andos Enda | the Court-Boat, an empty lake-boat with a curled prow | boat | the Year of the Broken Weirs and the court afloat |
| Nolorim | the Cracked Horn, a war-horn with a split bell | horn | the night Mirolon burned and the warning came too late |
| Lccimio | the Pledge-Tree, a fruit tree in white blossom | tree | the seed pledge to the eastern friends before the neck broke |
| Eldafaen | the Broken Spears, a spear in two halves laid apart | weapon | the spears of the Ember Lands' fallen broken at the road's end |
| Yavieth | the First Scale, a shed scale above the three spurs | scale and mountain | the refused gift that began the dragon bond |
| Teste | the Dusk Swallow, a diving swallow | bird | the swallows that led the refugee families into the vale |
| Luv-zhise | the Western Gate, a half arch broken at its crown | arch | the drowned city on the neck and the ferries over its road |
| Mushroom Forest | the Bale-Mark, a pale cap on a black severed root | fungus | the belt that rotted the Black Roots, as others saw it |
| Worshipdom | the Hermit's Loaf, a hand offering a round loaf | hand | the famine winter on the old road's wells (public story) |

No charge class appears more than twice (bird twice, plant twice if bough and tree are counted together), no sign repeats another region's grammar, and the Worshipdom's device is the public arms the heraldry guard already requires.

## Realm by realm

### Magical Forest (tree `magical_forest`)

**Roots (P).** Long before Aen the houses that became the council came into the Living Forest from many directions and feuded over glades and springs.
They met under the oldest Singing Grove meaning to fight and, by their telling, stayed to listen because the grove was singing.
The first precedent was made there: a house speaks only while it holds a bough the grove has let fall, and no one breaks a bough from a living tree to get a turn.
From it come the council's vote, the book of precedents, the rule of fallen wood only (written even into the Worshipdom's grant), and the Speaking Bough kept in the council-hall at Lyrion.
The rule was broken once, in 3A 802, when the houses felled the northern wood against the Black Roots, and each house carried a bough of its felled trees to Lyrion, where the heap lies as the book's one page in wood.

**Sign (P).** A fallen bough laid level, leafed at one end, mist grey on deep wood green.
Sirael carried a bough of the grove at Dardan instead of a standard; after the Ember Lands the houses sewed it on every company's cloth.
It is never shown upright or held, because no house owns it.

**Focus-branch ideas.**
1. **The Speaking Bough** (council branch, after The Council of Houses): a short chain in which the First Speaker picks up the bough, the houses debate in turn and the player chooses whether to let the old houses or the open houses speak first; it adds a spirit, *The Bough Passed* (political power gain, stability), and unlocks the decision Pass the Bough below.
2. **The Hardest Page** (beside The Old Groves): the boughs of the Fallen Forest are read as a precedent; the branch ends in a choice between *Never Again the Axe* (defence and stability inside forest states, no forestry building) and *The Axe Is a Precedent* (allows the felling of a state's forest in war for fort and supply bonuses, at a Kinship cost).
3. **Bough Before Banner** (military branch, after Wardens of the Woods): Sirael's custom of a bough instead of a standard gives the forest's divisions a recon and organisation bonus while defending and a penalty on attack outside elven land, so the Refusal is felt in the army.
4. **The Living Wood Unbroken** (economy, after The Forest Provides): a slow, cheap-resource path built on fallen wood only, which grows production on essence and timber without deforestation and is locked out by The Axe Is a Precedent.
5. **The Pilgrims' Condition** (after Courtesy to the Hermitage): the seventh-year renewal of the Zilin grant becomes an inspection; the player can renew quietly, renew with inspectors or refuse, feeding the existing Questions About the Quiet Valleys line without revealing anything before its gate.

**Formable or restorable identity.**
- **The Moot of the First Listening** (cosmetic identity of the Magical Forest). Entitlement: the council's founding precedent belongs to every house of the Kindred, not only the forest's. Who: the Magical Forest. Requirements: The Elder Moot and The Speaking Bough done, an Elder Moot held at which all seven elven realms answered, Kinship above its high threshold, the Refusal question answered by vote rather than by the First Speaker alone, not at war with any elven realm. Changes: a cosmetic name and adjective, a council government label, the decision Pass the Bough to the Kin (each elven realm may hold the bough for one moot, granting its realm a voice on one Kindred decision), and no claim, core or annexation on any elven land.

**Events and decisions.**
- Event *The Bough From the Floor* (each new First Speaker): pick up the bough in silence (stability), or speak before picking it up (political power, opinion loss with the old houses).
- Event *A Bough Broken From the Living Tree* (the divergence `the_bough_broken`, in a heated Refusal debate): the walk-out of the houses that will not sit with the speaker.
- Decision *Pass the Bough* (council category): spend political power to give the floor to the old or the open houses for a year, shifting the existing old-houses/open-houses balance.
- Decision *Read the Boughs of the Felled Wood* (once per war, at war): a stability and war support gain that makes Never Again the Axe binding for the war.

### Herrodon (tree `regional_herrodon`)

**Roots (P).** Long before Aen the hill elves lived on both faces of the range and had houses but no hall.
In the White Winter the snow came off the Herrodon rim in one night and buried the summer camps.
A herd-keeper, remembered only as the First Queen, followed a white owl to a hollow under the crags, kept a fire there and brought most of the houses in by spring.
She was acclaimed in the hollow that became Verozo and given its key, and the houses swore that no one of the hills would be left out in the snow again.
The queenship by acclamation, the summons home of 2A 3, the empty seat of the lost household and the protection of Teste all come from that oath, and no hill elf harms an owl.

**Sign (P).** A white owl with wings raised, facing out, on night slate.
The queens' wardens first carried it as a banner of search, white so the lost could see it at dusk, and the houses of the west came home behind it in 2A 3.

**Focus-branch ideas.**
1. **The Banner of Search** (after The Queen's Peace): the queen's duty to bring home the lost becomes a rescue-and-shelter branch that gives refugee and attrition bonuses in mountain and snow states and unlocks the decision Send Out the Hall-Owl.
2. **The Third Summons** (replacing the plain end of Songs of the Western Groves): Herrodon asks Dunelaeth home a third time; the branch carries envoys, gifts and a final answer event and leads to the identity below.
3. **The Hall-Key Laid Down** (succession, beside A Crown Above the Houses): the queen's abdication rule as play; the player may prepare an acclamation in the hall, raising stability in the hand-over and avoiding the crisis K59 allows, or let the queen keep the key past her strength.
4. **Owls in the Roof-Beams** (intelligence, after The Queen's Wardens): night watchers in the hill houses give intel and counter-intel against Andos Enda and against any power in the Lustras Hills or Teste.
5. **Shelter Under the Rim** (after Healers of Herrodon): the Teste bargain deepened, with grain-for-guard terms, an option to grant the commune a seat in the hall, and a choice in the war whether Herrodon shelters refugees of the eastern invasion.

**Formable or restorable identity.**
- **Herrodon of Both Faces** (cosmetic identity). Entitlement: before the summons of 2A 3 the hill houses lived on both faces of the range, and the lost household of Dunelaeth is the last of them. Who: Herrodon. Requirements: The Third Summons done, Dunelaeth answering yes by its own event (its opinion of Herrodon high, Dunelaeth not a subject of a human crown, not at war), the empty seat filled. Changes: a cosmetic name, Dunelaeth joined by consent as a member household (peaceful annexation of Dunelaeth's one state only, with a core there), the Hall-Owl banner now shows the owl over both faces of the hill, and Aenor's opinion of Herrodon falls a little because a realm of the western woods left the Middle Lands' world.

**Events and decisions.**
- Event *The White Winter Returns* (rare, in a hard winter in Herrodon or Teste): avalanches on the rim; the queen goes out herself (stability, a risk to her life) or sends the wardens (attrition).
- Event *An Owl Is Killed* (a stranger, a Teste farmer or an envoy kills an owl): a diplomatic small crisis with Teste or a foreign envoy.
- Decision *Send Out the Hall-Owl* (when a friendly country loses a state or a capital): Herrodon offers shelter for a year, gaining opinion and manpower from the sheltered.
- Decision *Keep the Empty Seat* (yearly, until the identity forms): a small political power cost that keeps Dunelaeth's opinion of Herrodon from decaying.

### Andos Enda (tree `regional_andos_enda`)

**Roots (P).** Long before Aen the lake elves were boat-folk who took the waters' names and moved them when the water changed, and their oldest custom is to shelter a stranger one night and send him on at dawn.
In the Year of the Broken Weirs, a few years before 1A 480, a drought made the groves break each other's weirs, and the children of the grove of Ilawen drowned in a loosed race.
Enlire of that grove called the groves onto the largest lake and held the first Water-Court in her own boat, so that no grove owned the court's ground, and the Weir Compact was sworn there.
The court still sits afloat, the Speaker owns no land, and the federation fears every dry summer.

**Sign (P).** A slender, empty lake-boat with a tall curled prow, water silver on lake teal.
The Court-Boat at Enliras is the same boat, rebuilt plank by plank, and it is empty because any grove may come aboard.

**Focus-branch ideas.**
1. **The Court Afloat** (after The Federal Moot): the Water-Court's law as government; the branch strengthens Every Grove Its Voice with a decision to judge disputes and gives a spirit that lowers the cost of laws and improves stability while the court stays on the water.
2. **The Dry Summer** (economy, after Resin and Timber): a water-management branch of weirs and reservoirs that protects the federation from drought events and shares water with Teste and Herrodon for opinion.
3. **Guests at Dusk** (diplomacy, after Letters from Sonargur): the guest-night as policy; Andos Enda carries envoys and refugees on and gains opinion with whoever it carries, and in the war it may choose to keep guests longer (the existing divergence `the_lakes_shelter`).
4. **Enlire's Peace** (rivalry, before The Groves Shared with Herrodon): the Speaker offers to judge the Boundary Groves afloat, which Herrodon may accept or refuse; acceptance ends the feud without either side yielding its rites.

**Formable or restorable identity.**
- **The Water-Court of the Kindred** (cosmetic identity, not territorial). Entitlement: the court that ended the first war over water between elves is the oldest standing court of the Kindred. Who: Andos Enda. Requirements: The Court Afloat and Enlire's Peace done, the Boundary Groves settled by the court, at least four elven realms with high opinion of Andos Enda, not in the Leren Compact or in it with the Water-Court's independence kept by event. Changes: a cosmetic name, the decision Bring the Quarrel Aboard available to any elven realm (Andos Enda judges a dispute between two Kindred realms and both gain stability), and the Speaker's title becomes a Kindred office; no land changes hands.

**Events and decisions.**
- Event *The Lakes Fall* (in a drought): break the weirs to save the capital's water (production, opinion loss with every grove) or share the low water (stability loss, Kindred opinion gain).
- Event *A Plank of the Court-Boat* (rare): the boat needs a new plank and two groves both want to give it.
- Decision *Bring the Quarrel Aboard* (after the identity): as above.
- Decision *Carry the Guest On* (when a refugee wave or an envoy reaches the Andos Water): pass the guests on at dawn to a chosen realm, which gains manpower and gives opinion.

### Nolorim (tree `regional_nolorim`)

**Roots (P).** Before the oath the crag families were herders of the heights who traded with Mirolon's shore and counted its people as neighbours.
On the night Volgan fell on Mirolon in 1A 1150, their eldest herder, Nolanwe, blew the great horn of the heights until its bell split, and the warning still came too late.
At dawn the families swore, each to one post, that nothing of Volgan's would come up through the heights and that the warning would never come late again.
The cracked horn hangs at Ennaton, every Pass-Warden swears on it, and the wardens stay closer to Mirolon's people than most elves are to any men.

**Sign (P).** A curved war-horn with a split bell, dawn silver on pass grey-green, shown cracked so that every post-captain remembers the warning that came too late.

**Focus-branch ideas.**
1. **The Horn-Calls** (after The Wardens' Oath): a signalling network of horn-posts that gives intel on the Lake of Mirolon and the South Pass and lets Nolorim pass warnings to Mirolon, Herez and the Kindred by decision.
2. **Herders of the Heights** (expanding the existing focus): the pre-oath herding life returns as an economy of milk, wool and mountain pasture, with a choice whether the families may leave their posts in summer.
3. **Neighbours of the Shore** (diplomacy, new): the old friendship with Mirolon's shore; it unlocks military access, a joint watch and the identity below, and makes Mirolon's opinion of Nolorim the strongest it has with any elven realm.
4. **The Unmade Warden** (beside Hold Every Pass): rules for a broken vigil, letting the post-captains elect a new Pass-Warden in the field (the divergence `the_vigil_broken`) without a stability collapse.
5. **The Horn Mended or Kept** (late choice): mend the horn and turn to the Kindred, or keep it cracked and swear to Mirolon (the divergence `the_horn_mended`).

**Formable or restorable identity.**
- **The Lake Wardenship** (cosmetic identity). Entitlement: the Oath of the Posts was sworn for Mirolon's shore as much as for the elves. Who: Nolorim. Requirements: Neighbours of the Shore done, Mirolon exists and has high opinion of Nolorim, the horn kept cracked, the warning of the south sent in time (the divergence `the_wardens_warn`), not at war with Mirolon. Changes: a cosmetic name, a permanent joint watch with Mirolon (shared intel, military access both ways), and the right to garrison the East Pass posts with Mirolon's men; no claim on Mirolon's land.

**Events and decisions.**
- Event *Fires Round the Lake* (when the south marches or Volgan's arming is reported): blow the horn-calls at once (Mirolon warned, a risk of a false alarm) or wait for proof.
- Event *A Late Word* (if a warning is sent after a hostile army crosses): the Pass-Warden is shamed and may be unmade.
- Decision *Sound the Horn-Calls* (Nolorim category): send the warning to a chosen neighbour, who gains a defence bonus for 90 days.
- Decision *Count the Crossing* (yearly): the count of pilgrims and strangers, giving intel on the Worshipdom's traffic without revealing anything gated.

### Lccimio (tree `regional_lccimio`)

**Roots (P).** Long before Aen the shore-houses lived beside eastern families they could reach on foot, took guest-names from those friendships and received orchard seed in return.
When the neck broke, the houses sealed the seed in jars as a pledge that the friendship would be taken up again, and the foreign sounds in their names are the guest-names.
The quay-book of 2A 300 came from the same reckoning, that friendship is kept by rules and not by trust alone.
The jars were opened in 4A 610 for the northern orchards, and every new Elder plants a tree of the old seed-line.

**Sign (P).** A round-headed fruit tree in white blossom, quay silver on rift teal, shown in blossom and never in fruit because the pledge is not yet kept.

**Focus-branch ideas.**
1. **The Guest-Names** (diplomacy, after Talk on the Eastern Quays): the houses search their rolls for the eastern families of their guest-names; the branch gives opinion and trade with East Lands realms that can be shown to descend from the old friends, and feeds the deep-past Two Gates loop.
2. **The Seed-Line** (economy, after Orchard Roads): orchards and wine as a growing export to Parim and the East, with each completed focus planting a tree in the quay-garden (a counter that later events read).
3. **The Quay-Book Revised** (law, after The Patient Council): the plague law extended or relaxed, choosing between quarantine resilience and faster eastern trade.
4. **The Shore's Own Peace** (late, before The Rift Burns): the divergence `the_pledge_kept` as a branch; Lccimio negotiates a separate peace with an eastern court at a Kindred cost, or turns the envoy away and keeps faith with the moot.

**Formable or restorable identity.**
- **The Long Shore of the Two Friendships** (cosmetic identity). Entitlement: the shore-houses were friends of the eastern families before the land broke, and their guest-names are the proof. Who: Lccimio. Requirements: The Guest-Names and The Seed-Line done, an eastern realm (Alerhia or Delbiz by default) at high opinion that accepts the pledge by event, the eastern coalition not yet across the rift or the realm outside it, not at war with any elven realm. Changes: a cosmetic name, a lasting trade and research agreement with the accepting eastern realm, the Pledge-Tree shown in fruit, and an opinion loss with the Magical Forest; no land is claimed on either shore.

**Events and decisions.**
- Event *A Name From Across the Water* (an eastern envoy or merchant speaks a guest-name): welcome him as kin (opinion with his realm) or treat him as a stranger.
- Event *The Seed Fails* (a blight in the orchards): replant from the old seed-line at a cost or from eastern seed.
- Decision *Plant for the Elder* (each new Elder): a small cost for stability and orchard output.
- Decision *Close the Quay-Book* (in an epidemic or a war): ships turned away from one harbour are turned away from all, at a trade cost and a resilience gain.

### Eldafaen (tree `regional_the_end`)

**Roots (P).** Long before Aen the house kept the treaty of passage at the road's end at Lenkei, a house of witnesses whose duty was to see who came along the road.
After the Ember Lands, the companies laid the spears of their fallen at the road's end, and the witnesses broke each spear across the treaty-stone and wrote each name before they let the living pass; that was the Archive's first book, in 2A 9.
The Archive's rule that no elf should march before the names of the last war are read, its record of the Refusal, its right to refuse any reader and its spring reading of the names all come from that day.
The unfinished book of 3A 1180 lies in the same hall, and the loremasters say only that both are records of something that stopped.

**Sign (P).** A spear broken in two, the halves laid apart, quay silver on night sea, sewn on the cloth that covers the Book of the Fallen and never shown mended.

**Focus-branch ideas.**
1. **The Witnesses of the Road** (after The Long Memory): the house's office from before the Archive; a branch of watching the old roads and the southern shore that gives intel on landings and on travellers, and feeds Watch the Last Shore.
2. **Names Before Spears** (after The Archive of the End): the spring reading becomes a Kindred rite; Eldafaen can require it before any elven realm goes to war, which the other realms may honour (a war support gain) or ignore (the divergence `the_names_unread`).
3. **The Heap of Spears** (military, before Wardens of the End): the broken-spear custom shapes a defensive army that may never fight outside elven land and gains a strong defence bonus at home.
4. **The Archive Carried** (late, after Hold the Last Shore): the copying and carrying of the books inland (the divergence `the_archive_carried`), with a chain that decides which realm keeps them.
5. **The Treaty-Stone** (with the existing Rolls of the Two Shores, The Treaty Opened and The Treaty Kept Shut): the stone where the spears were broken is also where the treaty is sworn, so the deep-past ask of the Archive is answered at the stone.

**Formable or restorable identity.**
- **The House of Witnesses** (restorable office, cosmetic). Entitlement: before it kept books the house kept the road, and its office of witnessing is older than any realm of men in Aoaz. Who: Eldafaen. Requirements: The Witnesses of the Road and Names Before Spears done, the treaty of passage answered either way through the deep-past loop, the Book of the Fallen still at Lenkei or carried and returned. Changes: a cosmetic name; the decision Bear Witness, which lets Eldafaen record a war's cause before it starts (the aggressor's war support falls and the defender's rises), and a lasting opinion bonus with every realm that has ever had its names read; no land.

**Events and decisions.**
- Event *The Spring Reading* (yearly): the names are read at the road's end; in a year of war the reading is longer and some realm's envoy walks out.
- Event *A New Heap* (after the first elven losses in the War of the Last Crowns): the companies lay down spears again, and the loremasters must decide whether to break them.
- Decision *Read the Names to the Moot* (before the Elder Moot votes on war): every Kindred realm loses war support and gains stability for the vote.
- Decision *Bear Witness* (after the identity): as above.

### Yavieth (tree `shared_magical_lands`, module M9 Keepers of the Roosts with its own root)

**Roots (P).** Long before Aen elves fleeing a hard winter sheltered under the three spurs, and a dragon came among them, spared them and left one shed scale by their fire.
Their eldest climbed to give it back and the dragon would not take it, and the bond began with that refused gift.
From it come the fellowship without a ruler, the eldest who climbs to speak, the keepers' rule of shed scale only and no dragon's blood, the goats that are the dragons' when they want them, and the keepers' word without which no realm asks a dragon for help.
The bond was wounded when Volgan's corrupted dragons took two roosts of the western spur in 1A 1600, and the keepers will not say how the spur was cleaned.

**Sign (P).** A single shed scale, point down, above the three spurs of Dragon Mountain, keeper silver on slope green; the dragon itself is never shown, because a dragon is no one's sign.

**Focus-branch ideas.**
1. **The First Scale** (root of a Yavieth module): the keeping of the scale at Thoriveniel; it gives stability and makes the theft event below possible.
2. **The Refused Gift** (after Songs for the Wyrms): the bond as diplomacy; elven realms ask the keepers' word through Yavieth, which gains opinion and a share of the scale trade.
3. **The Western Spur** (after Guard the Roosts): the wound of 1A 1600; a defensive branch against corruption that protects dragons from a dark power's turning (the divergence `a_dragon_corrupted`) and asks what the keepers did on the spur, without answering it.
4. **No Dragon's Blood** (economy, after the scale trade): a scale trade that stays a sale of what is given up, with a choice to raise Kingson's price or keep it fair.

**Formable or restorable identity.**
- **The Fellowship of the Spurs** (cosmetic identity). Entitlement: the bond was given to the first keepers, not to any realm, and every realm of the Kindred already asks through them. Who: Yavieth. Requirements: The Refused Gift and The Western Spur done, every elven realm at good opinion of Yavieth, no dragon corrupted this game, the First Scale at Thoriveniel. Changes: a cosmetic name, the keepers' word as a decision that every Kindred realm must take before it may use a dragon, and Yavieth's neutrality guaranteed by the Kindred; no land.

**Events and decisions.**
- Event *The First Scale Is Gone* (the divergence `the_first_scale_taken`): the keepers search, accuse or climb without it.
- Event *A Scale Still Warm* (rare): a dragon leaves a scale beside a keeper's fire, as in the first story, and the keepers must decide whose it is.
- Decision *The Eldest Climbs* (when a Kindred realm asks for a dragon): the keepers' word, with a chance of a yes that depends on Kinship and on whether the asker has broken the bond's rules.
- Decision *Give the Goats* (in a hard year): feed the dragons from the herds to keep them off other realms' cattle.

### Teste (tree `shared_magical_lands`, modules M1, M2 and M3 with a Teste root)

**Roots (P).** The men of Teste descend from the rangers and field-folk of the Vale who fled Elzon's Order over the Kingson Pass early in the Third Age with seed-grain sewn into their hoods.
The lake elves sent them on at dawn, and at dusk Halvar saw swallows dropping into a valley under the Herrodon rim and led the families down after them into the empty Teste Vale.
The founding-day gate shut at dawn and opened at dusk, the bargain to feed Herrodon, the old ranger speech, the yearly Reeve, the limit on a Reeve's years and the rule that no one pulls down a swallow's nest all come from that road.
The commune still sows a handful of the hood-seed line first in every field.

**Sign (P).** A swallow diving with swept wings, straw on vale green, the bird the families followed down, shown diving and never rising.

**Focus-branch ideas.**
1. **The Hood-Seed** (economy, a Teste root): the seed-line as a farming branch that improves food and the grain bargain with Herrodon and Andos Enda.
2. **The Harvest Moot** (politics): the yearly Reeve and the limit on terms, with a choice between a Reeve for one year and a longer-serving Reeve in war.
3. **The Road Back** (late, after the war begins): the divergence `teste_sends_grain_west` as a branch that sends grain over the Kingson Pass to the Vale of Aenor, at a cost to Herrodon's bargain.
4. **Nests Under the Eaves** (a small stability branch): the swallow customs; it gives resilience to disasters and an event chain with the krors of the Lustras Hills.

**Formable or restorable identity.**
- **The Vale Remembered** (cosmetic identity). Entitlement: Teste's families are exiles of the Vale of Aenor, and their speech is the Vale's old ranger speech. Who: Teste. Requirements: The Road Back done, grain sent west in the war, Aenor or the realm holding the Vale at high opinion, Herrodon's bargain kept (Herrodon at good opinion). Changes: a cosmetic name, a lasting opinion and trade bond with Aenor, the Teste Vale guaranteed by both Herrodon and Aenor, and the event below in which families of the Vale and of Teste meet; Teste stays where it is and gains no land west of the pass.

**Events and decisions.**
- Event *Sent Away at Dawn* (the founding day, yearly): the gate is shut at dawn and opened at dusk; in war the commune may keep it shut (the divergence `the_gate_kept_shut`).
- Event *Families Over the Pass* (after The Road Back): descendants of those who stayed in the Vale cross to Teste and ask after their kin.
- Decision *Sow the Hood-Seed First* (each spring): a small cost for a harvest bonus and stability.

### Luv-zhise (tree `shared_magical_lands`, module M7 Watch the Rift with its own root and the existing focus Ferries over the Drowned Road)

**Roots (P).** The quay-folk are Alerhic boat-families whose oldest songs make them the people of the city that stood astride the neck before it broke, the city whose halves now lie under the fungal belt and the Delbiz grass.
They stayed on the water between the halves and have ferried travellers over the drowned road ever since, steering by the tops of drowned pillars.
The shared Quay-Master's office of the river and temple families, the Lake Litany, the pillar-marks every pilot must learn, the habit of siding with whoever holds the crossing and the temple families' hope that the city's halves will stand on one shore again all come from that loss.
Every Quay-Master crosses once a year without a fare, after Blosian's crossing in the storm of 4A 140, and is sworn in under the half arch of the Western Gate.

**Sign (P).** A half arch broken at its crown, rising from one pier, quay ochre on narrows teal; the other half stands on the far shore.

**Focus-branch ideas.**
1. **The Pillar-Marks** (navy and trade): the pilots' knowledge of the drowned road gives naval speed and defence in the Rift Narrows and makes the Narrows dangerous to any fleet without a Luv-zhise pilot.
2. **The Fare Not Taken** (politics): the yearly crossing and the swearing under the gate, giving stability and opinion with Lccimio and the elves.
3. **Ferries Sunk or Sold** (late, beside the existing divergences `the_ferries_sunk` and `the_ferries_sold`): a branch that prepares to sink the ferries or to sell the crossing, so the choice is made with consequences already built.
4. **The Far Half** (with the deep-past Two Gates loop): the temple families' hope; Luv-zhise helps clear the western gate under the caps and courts Delbiz over the eastern half (the divergence `the_gate_rejoined`).

**Formable or restorable identity.**
- **The Ferries of the Two Gates** (cosmetic identity, subordinate to the deep-past restoration). Entitlement: the quay-folk are the people of the drowned city by their own songs, and they have kept its crossing without a break. Who: Luv-zhise. Requirements: The Far Half done, both gates cleared in the Two Gates loop, Delbiz at good opinion or a subject of the same overlord, not in the eastern coalition. Changes: a cosmetic name, a ferry harbour at the eastern gate shared with Delbiz by treaty, and the arch shown whole; the city's own old name appears only behind the deep past's crossing gate, and if Alerhia restores the Bridge Kingdom, Luv-zhise becomes its free port rather than a rival.

**Events and decisions.**
- Event *A Pilot Without the Marks* (a foreign ship wrecks on the drowned pillars): demand salvage, return the crew or sell the wreck.
- Event *The Gate in a Storm* (rare): a winter storm threatens the half arch, and the quay-houses must pay to shore it up.
- Decision *Cross Without a Fare* (yearly): the Quay-Master's crossing for stability and elven opinion.
- Decision *Sink the Ferries* (the existing decision Close the Rift Narrows, rooted here): the crossing closed for a season.

### Mushroom Forest (tree `shared_magical_lands`, a minimal Mushroom Forest root)

**Roots (P).** Only what others have seen is written, as the guard on the mycids requires.
The rift-coast elves' rolls say the fungal belt already stood on the shore when the neck broke, and that it grew over the western half of the drowned city.
When the Black Roots reached the rift coast in 3A 820, the fungi grew over them and the dead roots rotted there; whether the mycids did it, allowed it or only lived through it is not known.
Since 4A 388 the mycids have come to Luv-zhise's market in rings with fungi, dyes and spore-cloth, and every bale bears a stamped mark of a pale cap rising from a black severed root.

**Sign (P).** The Bale-Mark, a pale cap on a black severed root, cap cream and loam dark on spore purple; what it means to the mycids has never been said, and nothing is invented about it.

**Focus-branch ideas.** Kept deliberately small, because nothing may be invented about the mycids' rule (dossier section 5).
1. **The Rot That Feeds** (defence): the belt's resistance to corruption and poison, giving the realm resistance to dark magic and attrition on invaders.
2. **The Rings at the Market** (trade): more trade through Luv-zhise, with no change to how the mycids decide anything.
3. **Stems Over the Pillars** (with the deep-past Two Gates loop): the mycids' passage for the diggers of the western gate, given or withheld by opinion.

**Formable or restorable identity.** None is proposed: a formable would require knowing how the mycids rule or what they call themselves, which the vault does not say.

**Events and decisions.**
- Event *The Bale-Mark Changes* (very rare, after the Black Roots are spoken of in a Kindred event): the mark on the bales is different one season, and the traders argue about why.
- Decision *Ask the Rings for Passage* (the dossier's Ask the Mycids for Passage, for other realms).

### Worshipdom (tree `worshipdom`; public story only)

**Roots (P, public).** Long before Aen an old road of the East ran through the Zilin Hills to the South Pass, with stone wells and hostels in the three valleys whose foundations lie under the herb-meadows.
The road died when the land to the east broke, and the valleys belonged to the healing herbs, which the elves would not cut.
A hermit of the Deliverer came in 4A 1520 because the old wells still ran, and in the famine winter of the hermitage's third year he baked bread from its one oven for every traveller over the South Pass and gave each loaf before he asked the stranger's name.
The rule that a pilgrim house feeds and doctors a guest before asking who he is, the hostels, physicians, famine stores and couriers, and the strict keeping of the elves' condition of 4A 1524 all grew from that winter, and the hermit's oven is lit on feast days in Lenlakron.

**Sign (P).** A hand reaching up from the base and offering a round loaf, bread brown on hostel white, shown over the door of every pilgrim house; it is the public arms the heraldry guard requires and nothing in it touches the hidden layer.

**Focus-branch ideas.** These add to the public face only and touch no two-face focus or gated text.
1. **The Wells of the Old Road** (after Mend the Pilgrim Roads): the old wells and hostel foundations restored as pilgrim stations, giving supply and pilgrim income on the South Pass road.
2. **The Hermit's Oven** (after Grain of Charity): the famine winter's rule as a charity branch that sends grain to realms struck by famine, gaining opinion.
3. **No Living Tree** (after Friends Among the Elves): the elves' condition kept strictly, raising the Magical Forest's opinion and protecting the seventh-year renewal of the grant.

**Formable or restorable identity.** None is proposed: the Worshipdom's identities belong to its own tree and to the Afrit mechanic, and any public identity added here would risk touching the hidden layer.

**Events and decisions.**
- Event *Bread Before Names* (a famine in a neighbouring realm): the houses feed its people before they ask who they are (opinion, alms spent).
- Event *The Seventh-Year Renewal* (every seventh year, shared with the Magical Forest's Pilgrims' Condition branch): the grant of the valleys is renewed.
- Decision *Light the Hermit's Oven* (on feast days): a pilgrim-season bonus.
- The divergence `the_oven_cold` is public: in a hard famine the houses ask names before feeding, and the pilgrims' trust wavers.

## Counts

| Kind | Count |
| --- | --- |
| Focus-branch ideas | 46 (Magical Forest 5, Herrodon 5, Andos Enda 4, Nolorim 5, Lccimio 4, Eldafaen 5, Yavieth 4, Teste 4, Luv-zhise 4, Mushroom Forest 3, Worshipdom 3) |
| Formable or restorable identities | 9 (none for the Mushroom Forest and the Worshipdom, by the guards) |
| Events and decisions | 41 (22 events, 19 decisions) |

## Data added

Each realm in `magical_lands.json` gained `roots` and `sign` after its `founding`, one or two events (five dated "long before Aen" with `beforeAen`), one divergence (none for the Mushroom Forest), and the region gained five customs: `speaking_bough`, `no_one_left_in_the_snow`, `court_afloat`, `names_before_spears` and `the_fare_not_taken`.
No earlier content was removed.

## Open questions for the owner

1. May the Magical Forest's sign be a fallen bough instead of the Singing Grove's tree, so that the forest's banner speaks of the council's law rather than of woodland?
2. May Herrodon's queens descend in custom from a herd-keeper acclaimed in the White Winter, and may the owl be the hill elves' own bird?
3. Is the lake elves' first Speaker Enlire and the drowning at Ilawen acceptable as the federation's founding grief?
4. May the Nolorim wardens have been herders and neighbours of Mirolon's shore before 1A 1150, with the Cracked Horn as their sign?
5. May the shore-houses' guest-names come from friendships with eastern families before the neck broke, given that the elves and the Bridge Kingdom were neighbours, never subjects?
6. May Eldafaen's Archive begin with the breaking of the fallen's spears in 2A 9?
7. May the mycids' bales carry a mark that outsiders can see, without anything said about what it means to them?
8. May the Worshipdom's public story place the ruins of an old eastern road's wells in the Zilin Hills, matching the Bridge Road's course in the fallen-realms spec?
