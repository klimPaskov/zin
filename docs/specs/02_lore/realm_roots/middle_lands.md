# Realm roots and signs: the Middle Lands

**Status:** proposed (owner decision K67, 25 October 2026, asked for this lore; none of it is adopted yet). **Priority:** 2 (lore). **Phase:** 2 (text), with play hooks for later implementation.
**Source of the lore:** the `roots` and `sign` fields of every realm in [`tools/content/data/world/history/middle_lands.json`](../../../../tools/content/data/world/history/middle_lands.json), labelled `proposed`, and the new events that join the roots to 4A 1748. This file summarises them and turns them into play hooks; the history file is the text of record.
**Companions:** [10_fallen_realms.md](../10_fallen_realms.md) (the deep past these roots lean on), [06_heraldry.md](../../08_art_and_assets/06_heraldry.md) (the forbidden list the signs respect), the dossier [middle_lands.md](../../../lore/regions/middle_lands.md#roots-and-signs) and the vault note [Roots of the Middle Lands](../../../lore/vault/07%20-%20History/Roots%20of%20the%20Middle%20Lands.md).

## How to read this file

Every sign is one bold emblem in few flat colours, made so that a weaver could sew it on a war-banner, and every sign comes out of a deed, a relic or a custom of the realm's roots. The flag designers draw the flags from the `sign.device` field; the colours named there are the story's colours, and the designers may move them to keep the region's small flags apart (06_heraldry.md 1.2 and 1.3).
No sign carries a god's device, a letter, a cross, a real-world flag or a named person.
The hooks below are proposals for later implementation. Branch names are working labels, not localisation; each names the existing tree it extends. The rule of the fallen realms holds throughout: no drowned or broken realm returns as a new tag, no hook grants free cores, and no hook answers an open question of the vault.

The formables are identities a realm earns from its own history, not unions of a region. Most are cosmetic identities on the realm's own tag with a changed name, flag and a new mechanic; where a hook would need a new tag, it says so and is left as an owner question.

## Signs at a glance

| Realm | Sign | Root it comes from |
| --- | --- | --- |
| Aenor | a black cloak lined red, spread from a gold crown-clasp | the Mantling: Aen's cloak spread over the kneeling kings of the War of Men |
| Selen | three arrows bound point-down with a green withy | the three broken bands who swore the Quiet Law to the Lord of the Weald |
| Kingson | a red-hot ember in black iron tongs | the vigil ember carried hearth to hearth under the Order's ban on fire |
| Hirolon | a squared field-stone with one black notch | the dike-stone that is the first stone of the Eldest Cairn |
| Tirlan | an upright wicker grain-pannier | the pannier thrown ashore by the grain ship, which carries the harvest-share |
| Konori | a white felt with red tassels and a black open hook-brand | the felt pressed from every Hundred's founding herd |
| Hunhun | a riderless saddled mare at the gallop | the banner-mare who died under Aen's banner in the last battle |
| Klungori Guard | a goblin war-helm hung upside down | the warren-boss's helm from the Tunnel Fight, and the last company's oath |
| Herez | a great iron key, bit downward | the key of the last Kalioth fort, given to Hezar with the march |
| Noleksun | a ditching spade with a stepped blade | the spades of the Oath of Eight Hearths and the ditches under the fields |
| Kilinti | a fallen oak bough with acorns | the bough the eldest oak let fall as the Timber Bargain |
| Safeton | a black hull keel-up rising from mud | the hulls hidden in the Safen mud under the Order |
| Freshon | a white ox kneeling | the drovers' ox that knelt and found the warm spring |
| Pazoma | a bronze bell with a sword-blade clapper | the guild-hall bell cast from the swords of the One Crown's peace |
| Orohaf | a white steering-oar upright, blade down | the Water clan's steerswoman on the Night of the Sea |
| Fotan | a black chain drawn taut across the field | Ostvar's anchor-chain stretched across the landing |
| Kunhrim | the Deep King's crown above a band of sea | the drowned Great Hall and the Deep King's last command |
| Burrikkrit | a shuttered lantern, one shutter open | the first warband's lantern and the promise that outlived its maker |
| Olodor | a crown beaten from a pot's gold rim | the first village-king crowned with the rim of his full pot |
| Dunelaeth | a silver beech leaf on a grave-mound | the grave-beeches the household would not leave |
| Aenor Forest | a closed black pine-cone | the closed cones laid at the edge after every death of the forest |
| Cursed Lands | a grey cord looped in one black knot | the black knot of the Night of the Sea on the Last Cord |
| Bloody Forest | a red oak leaf letting fall one red drop | the cord-trees that bleed for the drowned |

## Realm by realm

### Aenor (AEN), tree `aenor`

**Roots.** The kingdoms of the Vale fought the War of Men for centuries; Aen ended it by bargain as much as by victory, and the Mantling, his cloak spread over the kneeling kings so that none knelt to another, is the image of the Peace of the One Crown. The Mantle was carried off with the sacred objects when Volgan took the capital in 1A 1612, and Edran was crowned in a dyed copy. Aen's hundreds of sons made a nobility that argues over which branch is first, never over whether it is royal.
**Sign.** The Mantle of Aen: shelter under one law; to the Orran heirs and the West, the cloth over a conquest.

**Focus branches** (extending the 140-focus tree):
1. *Under the Mantle* (working label), beside the Concord branch: re-swear the Peace of the One Crown with each dominion in turn. Each re-swearing is a decision that costs the crown a concession (a tax remitted, a charter right confirmed) and raises the dominion's loyalty; the branch's payoff is a spirit that lowers the cost of the Concord levies while every dominion is under the Mantle. A dominion that refuses becomes a target for the Lost Cause's frontier companies, which the Golden King can send and the Council can forbid.
2. *The Mantle Sought*: a hidden branch that opens after Volgan's march north begins. Envoys, scholars of Parim and Herez's scouts look for the lost Mantle; a mission chain in the southern marches ends in a captured Puvulan baggage train or a Mirolonese reliquary that may hold it. Whether the true Mantle survives is decided by a roll weighted by the scouting effort, and a false Mantle can be proclaimed anyway at a legitimacy risk.
3. *The Orran Debt*: answer the Orran heirs' grudge over the river names. Three paths: acknowledge the Orran names in the charters (relations with the Cursed Lands and the Bloody Forest rise and the Golden Court's nobles object), buy the debt off with grain and salt for the downs, or crush the grudge with a Grey March that history says fails.
4. *Which Branch Is First*: during the four-camp succession, every claimant cites a different son of Aen. A decision family lets the player fund genealogists for a camp; each funded proof shifts noble support, and Eindil's arrival as Ein's son overrides every proof at once.

**Restorable identity: the Mantled Crown.** Name: *the Kingdom under the Mantle* (cosmetic on AEN). Entitlement: the Mantling and the Peace of the One Crown. Who: Aenor only, after the succession is settled. Requirements: the true or proclaimed Mantle held, every chartered dominion re-sworn or annexed by consent (no conquest), and the Peace unbroken for two years. Changes: name and flag (the Mantle on lake blue without the Golden Court's gilt), a spirit that makes any war between Concord members cost heavy stability for the aggressor, and a new decision to judge disputes between dominions as Aen did. A false Mantle carries a hidden flag that a later event can expose.

**Events and decisions.** The Mantle Carried Off as a history entry the scholars can read; the yearly Mantling Day where the king either spreads the cloak in person (stability, cost in gold for the feast) or sends the Golden Court's gilt copy (the dominions notice); a Hunhun rider's riderless mare refusing the Golden King at a Gathering, which ties to Hunhun's sign.

### Selen (SEL), tree `regional_selen`

**Roots.** Three bands broken in the War of Men fled into the Weald in one winter and swore to the Lord of the Weald, a Wild Spirit whose rank the moots will not discuss, with three arrows laid point-down at the oak that is now the Moot Tree. The Quiet Law, the habit of sheltering the hunted, and Edran's hiding all come from that winter.
**Sign.** Three arrows bound point-down: the Weald draws no bow first. Cut the withy, and the arrows point up for the Host of Selen.

**Focus branches:**
1. *The Withy Cut* (beside the Warden Host): the Host of Selen's muster becomes a visible state. Cutting the withy is a decision that switches the realm's banner variant to arrows points up, unlocks ranger divisions and the spirit of the Warden Host, and makes the Quiet Law's stability bonus lapse until the withy is bound again; the AI cuts it only when at war on its own ground.
2. *The Lord of the Weald*: tree-wardens ask the Weald before the hunt. A short chain of three focuses gives three answers drawn from the moot-books (shelter, silence, refusal), each a different spirit; the branch never states what the Lord is.
3. *The Fourth Arrow*: the moots debate whether the Stranger and his host can be sheltered under the Quiet Law. Sheltering him binds a fourth arrow to the sign for the rest of the campaign (a flag variant) and makes Selen the Stranger's first refuge, at the cost of the Golden King's anger.
4. *The Red Winter Answered*: settle the feud with the Bloody Forest either by hostages at the cord-trees or by burning the forest rim again; the first opens a trade of hides and arrows, the second a raid-and-reprisal mission chain.

**Restorable identity: the Three Glades Sworn.** Name: *the Weald of the Quiet Law* (cosmetic on SEL). Entitlement: the oath of the three bands. Who: Selen after the Wardens' Moot focus. Requirements: Vothrim, Svenlor and Ulgus states held, the Roll Quarrel won (Selen keeps its birth rolls), and the withy bound at peace. Changes: the moots elect the First Warden instead of the House of Svenlor holding it; a spirit grants refugees from any war a stability and manpower trickle; the Concord cannot levy Selen's rangers without the moot's vote.

**Events and decisions.** The Three Arrows shooting at midsummer as a yearly event with a ranger-skill outcome; a stranger arriving at a glade asking for one night's shelter (shelter, question, hand over), which feeds the existing *the_stranger_handed_over* divergence; the withy-cutting decision itself.

### Kingson (KIN), tree `regional_kingson`

**Roots.** The vale tells that Aen set one of his sons to keep a fire at the pass, and the watch-families descend from the men who fed it. Under the Order's ban on fire they carried the vigil ember hearth to hearth in iron tongs for nearly twelve centuries and carried it up to open the forts in 3A 1244.
**Sign.** The ember in the tongs: the watch never goes out.

**Focus branches:**
1. *The Ember in the Tongs* (beside the Gate of Kingson): the Pass Vigil becomes a value, the vigil's strength, raised by lighting forts and lowered by tolls taken unfairly or forts left dark. At high vigil the pass forts get defence and the Reading of Names gives a war-support event; at low vigil the families grumble.
2. *The King's Son's Fire*: genealogists of the vale argue the vale descends from a son of Aen. The branch lets Kingson claim a seat in the succession councils of Aenor as a branch of the line (a weak claim the Concord laughs at), or renounce it and win the elves' trust.
3. *The Tolls Forgiven*: undo the Toll of Silver's shame with the Magical Forest; paths of halving the silver toll, opening the eastern fort in winter, or keeping the toll and losing elven goods.
4. *Carry the Ember Back*: if the pass falls, the ember goes back into the hearths. A resistance branch that keeps the vale alive under occupation, with a mission to carry the ember up again and retake the forts from the inside, as in 3A 1244.

**Restorable identity: the Vigil of the Pass.** Name: *the Vigil-Lordship of Kingson* (cosmetic on KIN). Entitlement: the families' twelve centuries of vigil. Who: Kingson. Requirements: every pass fort held and lit, the Kingson Pass not lost in the war, and the Accord of the Passes kept with the elves. Changes: the Pass-Lord becomes Warden of the Vigil, chosen by the families at the Reading of Names; a spirit doubles the pass forts' supply and makes the Magical Forest's eastern fort a shared fort.

**Events and decisions.** The Night of the Passes, when every fort lights its fire at once (a choice to light it in defiance of a besieger); the tongs taken from the wall at a Pass-Lord's choosing; a family that lets its hearth go cold.

### Hirolon (HIR), tree `regional_hiloron`

**Roots.** The giants were the Low Country's partners who raised its sea-dikes; their keepers warned the Moot that the land was asked for too much, and on the Night of the Sea they left for the ring and laid the first stone of the Eldest Cairn, a dike-stone with the Moot's notch. The giants who would not come went north-east.
**Sign.** The notched field-stone: a dike holds while its builders keep faith.

**Focus branches:**
1. *The Dike-Craft* (beside Cairn and Quarry): the giants' old craft returns as a service. Hirolon sells dike-building to the lake ports and the Isle Houses as a decision (giants are tied down for a season; the buyer gains coastal forts and harbour capacity); the branch ends in the Dike-Craft art the fallen realms addendum names.
2. *The Keepers' Warning Kept*: the ring's law against asking the land too much becomes a spirit that blocks every land-draining modifier in Hirolon and earns the Cursed Lands' respect; a later event offers the giants a magic of the field from a stranger, which they refuse or take at a cost the land remembers.
3. *Speak the Count*: the existing Eldest Cairn chain gains a meeting with the Veiled. When the Cord and the Stone are brought together (the Two Counts), the giants say only that the land was asked for too much, and the year of the Night of the Sea becomes known in play.
4. *The Cairn-Line North-East*: an envoy to the giants who went north-east behind their own cairn-line. The branch only opens the door: the two sides' keepers each say the other forgot the count, and a joint stone-laying is a long, uncertain mission.

**Restorable identity: the Ring of the Cairn-Keepers.** Name: *the Cairn Kingdom* (cosmetic on HIR). Entitlement: the Old Promise and the Cairn Treaty, made sovereign to sovereign. Who: Hirolon. Requirements: the Two Counts completed, the Old Promise unbroken in the war, and the ring never entered by an enemy. Changes: the High Chief becomes Keeper of the Eldest Cairn; a spirit makes the ring's states nearly impossible to hold for an invader; the tenancy of the Hilofrim herders can be turned into a charter of the ring's own.

**Events and decisions.** The yearly stone of the Eldest Cairn; a herder asking how many stones are in a giant's cairn (a breach of custom with a comic and a grave outcome); the dike-stone shown to a Concord envoy.

### Tirlan (TIR), tree `shared_small_folk`

**Roots.** Kin of the Ronbo basin's small folk, burned out in the settlement wars, blown south on an Aenoran grain ship and put ashore at the Hilorn mouth with the ship's grain-pannier; the giants swore the Old Promise and the first share went up in the pannier.
**Sign.** The pannier: the share is paid and the promise holds; carried out of the valleys, it would mean the giants have need of them.

**Focus branches** (the Old Promise branch):
1. *The Pannier Carried Up*: the harvest-share becomes a visible yearly payment to Hirolon; a good harvest lets the Warden add more (Hirolon's giants defend Tirlan more readily), a bad one triggers the Wet Year precedent.
2. *Kin Across the Sea*: a long letter chain with Dobbum through Aenoran and Leren ships. Each letter answered unlocks a small exchange (orchard cuttings, a recipe, a stamped loaf), and the chain ends in the first meeting since 1A 612 if a ship can be found.
3. *The Pannier Goes Out*: if Hirolon is attacked, the small folk carry the pannier over the Saddle full of food for the giants' host. A supply decision that turns Tirlan's harvest into Hirolon's war-supply.

**Formable identity.** Tirlan has none of its own; the shared one is under Dobbum (the Two Halves of One Table).

**Events and decisions.** The landing remembered at the stone of the Hilorn Gap; a household that wants to go out into the world (it ties to the existing *the_small_folk_leave* divergence).

### Konori (KON), tree `regional_konori`

**Roots.** The horse came over the old Eastern road long before Aen, and the Hundreds' first mothers caught the herds the road-people left. The Hundreds fought each other until the white felt was pressed from every founding herd's hair, with an open hook at its heart that is no Hundred's brand.
**Sign.** The felt: one voice for all the Hundreds and none above them.

**Focus branches:**
1. *Every Hundred's Hand* (the Hundreds branch): the lifting becomes a mechanic. At each succession every Hundred must lift; Hundreds the king has angered can refuse, and a king lifted without all of them is weaker until he wins them back with remounts, grazing rights or a raid.
2. *The Mares of the Road-People*: the plateau's breed was founded on eastern mares. A breeding branch with Delbiz-like eastern stock bought through Noleksun's fairs restores the breed's name lost in the Long Drought.
3. *The Remount Felt*: settle the remount quarrel with Hunhun by swearing it on the felt (one contract, two downs) or by riding against them at the fairs.
4. *The Felt Hidden Again*: if the plateau is overrun, the felt is rolled into a saddle-blanket and passed between Hundreds; a resistance branch whose victory condition is the felt raised again at the ford.

**Restorable identity: the Felt of All the Hundreds.** Name: *the Hundreds of the Felt* (cosmetic on KON). Entitlement: the oath of 1A 288. Who: Konori. Requirements: every Hundred lifting the reigning king, the Arrovez ford held, the remount quarrel ended. Changes: the king's title becomes Lifted King; a spirit gives cavalry organisation and makes the AI of Konori never break an oath sworn on the felt; a decision lets the king swear a treaty on the felt, binding every Hundred.

**Events and decisions.** A Hundred brands a horse with the open hook (a crime: banish the Hundred, pardon it, or claim it as a sign); the lifting event.

### Hunhun (HNH), tree `regional_hunhun`

**Roots.** The horse-thanes of the eastern Vale kingdoms; a Hunhun rider carried Aen's banner for nothing and his mare died under it in the last battle; she lies in the first horse-barrow under her empty saddle, and the Horse-Oath was sworn on her barrow.
**Sign.** The riderless mare: the downs ride for the crown, not the man, and the mare stops only for the true heir of Aen.

**Focus branches:**
1. *The Empty Saddle* (beside The Old Freedoms of the Ride): every Gathering leads the riderless mare for the crown. If the king on the throne is unlawful in the downs' eyes, the mare is led away from him, a stability hit for Aenor and a war-support gain in Hunhun.
2. *The Mare Stops*: a hidden branch for Eindil's road. When Ein's son is proven, the downs offer him the saddle, a large cavalry gift and a legitimacy event; this is the natural seat of the existing Ride with the Heir.
3. *Horse-Barrows Facing East*: the barrows become a holy ground the Order never took. A branch that reopens the barrow-roads as fast cavalry routes and gives scouts against the south.

**Restorable identity: the Riders of the First Oath.** Name: *the Gathering of the First Oath* (cosmetic on HNH). Entitlement: the first riders to swear to the One Crown. Who: Hunhun, only after the lawful king of Aenor is crowned. Requirements: the riderless mare given to the lawful king, the remount contract held, Noloreh and Hunhun under one Gathering. Changes: the Horse-Lord becomes the crown's Rider of the First Oath with a seat in the royal council; the Konori riders get an opinion penalty they can turn into a rivalry event.

**Events and decisions.** The Gathering's mare led round the horse-lines; the Konori claim that they swore first (an argument event with a debate or a fair fight).

### Klungori Guard (KLU), tree `shared_concord_dominions`

**Roots.** The South Pass was the old Eastern road, the Kalioth's for a century and the Order's goblins' after. Klungor's two hundred were the heirs of the Unbinding's last company, sworn not to disband until the last of the Order's creatures left the range; the inverted helm of the warren-boss hangs on their tower.
**Sign.** The inverted helm: the truce holds because the last breaker hangs on our wall.

**Focus branches** (as a branch of the shared Concord tree, gated to KLU):
1. *The Unfinished Oath*: the last company's oath becomes a goal. A decision family offers three ways to finish it: clear the warrens with Kunhrim (a hard war underground), buy the goblins out of the range with the under-roads' secret sold to them by Burrikkrit, or declare the truce a keeping of the oath. Each ends the Guard's founding purpose differently.
2. *The Helm on the Wall*: the helm becomes a warning. If a warren-boss tests the truce, the Guard can show the helm (the boss backs down or is made the next helm) instead of lighting the war-beacon.
3. *The Pilgrims' Guard*: the pilgrim fee becomes either an honest escort or a toll, deciding the Guard's quarrel with Noleksun.

**Restorable identity: the Last Company.** Name: *the Last Company of the Unbinding* (cosmetic on KLU). Entitlement: the oath of 3A 1260. Who: the Klungori Guard, if the oath is finished by clearing the range. Requirements: no goblin warren left in the Cursed Mountains or the Giant Mountains' southern caves, the Lamp Truce ended without the Guard breaking it first. Changes: the company is released from its oath; it can disband into a lordship (normal march politics) or swear a new oath to hold the South Pass against Volgan, with a spirit of veteran infantry and the helm taken down from the wall.

**Events and decisions.** The twelve-year-olds sworn on the tower; the night nobody slept in the pass alone and someone did.

### Herez (HER), tree `regional_herez`

**Roots.** The old Eastern road ran through these downs, the hill-folk kept a word for riders from the east who do not leave, and the Kalioth held them for a century. Edran gave Hezar the iron key of the last Kalioth fort at Hugomon; the march-lord is Keeper of the Key.
**Sign.** The iron key: the southern road is locked, and Herez holds the key.

**Focus branches:**
1. *Lock the Road* (beside The Eastern Forts): the key becomes a decision. Locking the road closes the southern road to all traffic (Noleksun's fairs suffer, Puvulan's scouts are blinded); opening it brings trade and spies. The AI locks it when the south arms.
2. *The Forts of the Enemy*: the old Kalioth forts are rebuilt as Herez's line. Each fort restored gives a fort level and a small chance of finding Kalioth goods (iron, maps of the South Pass), and the last fort found holds an old Kalioth war-map that warns of the road Volgan's allies used.
3. *The Word for Eastern Riders*: the hill-folk's word becomes a spy network along the old road. A branch of scouting missions that reveals the Puvulan muster earlier than Parim believes.
4. *Heard at Last*: the existing *herez_heard* divergence gets a path: carry the key to Parim and lay it before the Concord Council, a dramatic event that either makes the Council listen or humiliates the march.

**Restorable identity: the March of the Key.** Name: *the March of the Key* (cosmetic on HER). Entitlement: Edran's gift. Who: Herez. Requirements: every old fort of the downs restored and held, the southern road locked in the face of the first Puvulan host and held for a year. Changes: the Marcher-Lord becomes Keeper of the Key with a right to call the Concord levies to the south once per war; a spirit of defence on the hills.

**Events and decisions.** A stranger from the south held at the gate until his business is known; the key turned in the old gate at a succession.

### Noleksun (NOL), tree `regional_noleksun`

**Roots.** The downs were the western march of an Eastern kingdom long before Aen, whose farmers cut the stone-lined ditches; the western branch of its royal house faded here. The eight towns found the ditches under their drains and swore the Oath of Eight Hearths with eight spades.
**Sign.** The stepped spade: what lies under the fields belongs to those who farm them.

**Focus branches** (beside the existing The Old Ditches):
1. *Dig Further*: the Chief Speakers let the scholars dig. A dig mission chain uncovers the old ditch lining, then a stair of stone, then a sealed channel; the knowledge gate of the deep past reveals that the ditches are the western march of the Bridge Kingdom only when the dig is finished, and Alerhia's scribes write at once.
2. *The Law of the Ditch*: the confederacy's law becomes a mechanic of shared roads and water; no town may close its drains on another, so a decision that raises one town's tolls lowers the others' unless the moot agrees.
3. *The Kalioth Forts on the Downs*: the eastern occupiers' forts can be pulled down for stone (cheap building) or kept against the south (a defence line Herez wants to share).
4. *The Treasury Opened*: the confederacy's war-chest is spent on the Lost Cause, on the Free Dominion, or on buying the tax-farm back from the Golden Court.

**Restorable identity: the Western March of the Stair.** Name: *the Stair-March of the Eight Towns* (cosmetic on NOL; working label until the owner names it). Entitlement: the ditches, once the dig proves them. Who: Noleksun after Dig Further. Requirements: the dig finished, Saelori and the eight towns held, and an envoy exchanged with Alerhia. Changes: a new adjective and a flag with the stepped spade on the old march colours; Alerhia's opinion rises or falls by its own claim (an owner question: does a revived Eastern march give Alerhia a reason to claim the downs?); the ditch-craft gives farm output. No cores on Eastern land.

**Events and decisions.** The second ditch under the first; a Parim scholar asking about the steps; a farmer who refuses to let anyone dig his field.

### Kilinti (KIL), tree `regional_kilinti`

**Roots.** The ents stood before men named the forest; the edge-folk were let stay on condition that they speak for it. When Aen's kingdom asked for oaks, the eldest oak let fall a single bough before the envoy, and the Timber Bargain has held four ages: every tree that falls and none that stands. The ents pulled the Black Roots out by hand.
**Sign.** The fallen bough: we give what falls and nothing that stands.

**Focus branches:**
1. *What Falls* (beside Timber for the Crown): the timber Kilinti owes the crown becomes a seasonal yield driven by storms; a storm year is rich, a calm year poor, and the Golden Court's demand for more starts the Great Felling question again.
2. *The Reeve's Voice*: the Reeves speak for the ents; a decision family lets the player choose how faithfully. A Reeve who speaks for himself gains short-term gold and risks the precedent of 2A 725.
3. *The Roots Pulled Out*: when the dead come north in the war, the ents can walk once more to an edge and pull up the dead's roots; a one-time large defensive event against Zol's dead in Kilinti's neighbourhood, with a year of silence after.

**Restorable identity: the Grove of the Bargain.** Name: *the Grove of the Fallen Bough* (cosmetic on KIL). Entitlement: the Timber Bargain. Who: Kilinti. Requirements: the Great Felling refused again in play, no standing tree sold for the whole campaign, the Black Roots or the dead turned at the edge. Changes: the Reeve's office becomes hereditary in the edge-villages; a spirit that makes any army that fells trees in Kilinti suffer attrition.

**Events and decisions.** The seventh-spring Ent-Moot; a lord's envoy asking a question and waiting three springs.

### Safeton (SFT), tree `shared_concord_dominions`

**Roots.** Barge-folk of the Safen poured lake water into the sea at every spring sailing long before Aen; the ship-houses took the harbour in the Grey Breath and survived the Order by sinking their hulls in the mud.
**Sign.** The keel-up hull: we go under and come up again.

**Focus branches** (gated to SFT):
1. *Hulls in the Mud*: the Order-years craft returns. Safeton can hide its fleet in the Safen mud when an enemy approaches (the ships are safe and useless) and raise it on one tide (a burst of naval strength).
2. *By Hull, Not by House*: the council votes by hull; building ships raises a house's vote, and a house that builds too many can try to make itself lord.
3. *Lake Water to the Sea*: the spring sailing becomes the harbour's trade year; a good sailing season grants trade and the Isle Houses' timber.

**Formable identity.** None of its own; the harbour's ambition goes into the shared Concord tree's free-council path.

**Events and decisions.** The spring pouring of lake water; a ship-house child shown where the hulls once lay.

### Freshon (FRE), tree `shared_concord_dominions`

**Roots.** A drover's ox dying of thirst knelt at the crossing and warm water rose; the first spring-house of Sulethe was raised over its grave. Water before questions; the spring-houses became the hospitals of the southern Vale; Freshon also knelt to the Golden King for its charter.
**Sign.** The kneeling ox: water before questions, healing for any who come.

**Focus branches** (gated to FRE):
1. *Carts of the Kneeling Ox*: the spring-houses send carts to the wounded of any army; a hospital network that reduces attrition and casualties for the Concord, and gives Freshon a neutrality claim in war.
2. *The Debt to the Golden Court*: buy the debts back (gold and trade), let the charter be revoked, or keep kneeling.
3. *The Ox's Horns*: a search for the horns lost in the Demon Gates raids, which a scholar thinks went into the Nezer trade; a long mission with a stability prize.

**Formable identity.** None of its own.

**Events and decisions.** A king and a drover arriving at the spring on the same day (who drinks first); Pazoma's guild-masters mocking the kneeling ox in the Concord Council.

### Pazoma (PAZ), tree `shared_concord_dominions`

**Roots.** The craftsmen of the kings beaten in the War of Men were spared on condition that they make for the peace and never for war; the seven guilds cast the guild-hall bell in 1A 410 from the swords the One Crown's peace took from the lords, with one blade kept for its clapper.
**Sign.** The bell with the sword clapper: the sword serves the bell.

**Focus branches** (gated to PAZ):
1. *No Blade in Horlomon*: the guild law against forging weapons becomes a choice in the war; keeping it gives stability and trade, breaking it opens arms workshops and a guild schism event.
2. *The Bell Rung*: the bell becomes a protest mechanic; ringing it against a royal tax risks a riot and forces a council response, as in 4A 1610.
3. *The Marked Books*: the hidden books of the Order's years, found by their printed bell, give research bonuses and a lead on the Registers of the Lost.

**Formable identity.** None of its own.

**Events and decisions.** A guild election rung in; a smith caught forging a sword in the bay.

### Orohaf (ORH), tree `regional_asgard`

**Roots.** The Isle Houses are the Low Country's Water clan; its eldest woman steered the last boat through the Night of the Sea, and the five houses descend from the daughters aboard. The queen is chosen holding her house's steering-oar at the turn of the tide. The divers know of the mound west of the isle and have never dived for it.
**Sign.** The white steering-oar: we steered through the night the land drowned.

**Focus branches** (beside the existing The Tide-Chambers Opened, The Queens' Rite and The Mound at Low Water):
1. *The Steerswoman's Oar*: the queen's choosing becomes a contested event among the five houses at every succession, each house's oar a candidate with its own fleet bonus.
2. *Dive at the Mound*: the existing dive for the Mothers' Stone gains the houses' taboo; the queen must break the custom of never diving for it, or win the Veiled's leave first by sharing the Cord (the Veiled count it theft otherwise).
3. *The Water Clan Remembered*: a branch of letters with the Cursed Lands and the Bloody Forest, ending in the Moot of Mothers decision their trees already hold, with Orohaf as the Water clan's voice.

**Restorable identity: the Queenship of the Five Oars.** Name: *the Five Oars of the Isle* (cosmetic on ORH). Entitlement: the Tide-Oath. Who: Orohaf. Requirements: the five houses reconciled at a succession, the Mothers' Stone raised or the Veiled's leave won, Borrak never taken. Changes: the queen gains the power to refuse a crossing fleet passage; a spirit for divers and shipwrights.

**Events and decisions.** The tide-chamber choosing; a boat-burning for the dead.

### Fotan (FOT), tree `shared_concord_dominions`

**Roots.** The oldest crossing between the North and the Vale, worked by ferry-families who paid no one; the ferry-folk once heard knocking under the landing that stopped in 1A 1660. Ostvar's anchor-chain closed the landing to the Order's tribute ships.
**Sign.** The taut chain: the crossing is ours to open and to shut.

**Focus branches** (gated to FOT, the free-land path):
1. *Draw the Chain*: the chain becomes a decision to close the crossing to one crown's ships (Aenor or Lerendor), with the toll loss and the other crown's gratitude.
2. *Kin in Molot*: the Ostvar name joins Fotan and Molot. An envoy chain discovers or denies the kinship; a confirmed kin gives a defensive bond across the strait.
3. *What Knocked Under the Landing*: a scholar or a dwarf of Hrakbrund asks about the knocking. The branch leads only to a sealed passage under the landing that the dwarves ask Fotan to leave shut (the Sea-Door's mystery stays kept).

**Formable identity.** None of its own.

**Events and decisions.** A Leren timber ship refusing the toll after the Toll of Parim; a link of the chain stolen.

### Kunhrim (KUN), tree `shared_delving_holds`

**Roots.** The eastern gate of the Stone Road, whose Great Hall drowned when the Damned Spirits came into the roads and the sea was let in; Kunhrim says the Deep King gave the order. The Sea-Door with the names of the last delvers, the call for a moot, and the coldness to elves come from it.
**Sign.** The Deep King's crown above the sea: the Stone Road had one king and Kunhrim keeps his word.

**Focus branches** (Kunhrim's branch of the shared holds tree):
1. *Call the Moot of Four Holds*: the hold sends envoys to the three others; each refusal or acceptance is a separate event, Brundahrim and Gromkerm demanding that Kunhrim first own the urging. Owning it costs the hold's pride (stability) and wins the moot.
2. *The Last Command*: the Deep King's last command held in trust becomes a claim to speak first in any moot and a reason for the existing *Lords of the Great Wall* payoff.
3. *Names at the Door*: read the names of the last delvers at the Sea-Door (the gated knowledge of the deep past); a ceremony with a war-support gain and the hint that the door must stay shut.

**Shared formable: the Stone Road Reconvened.** Name: *the Moot of the Stone Road* (a league, not a new tag; each hold keeps its tag). Entitlement: one tongue in four holds and the Deep King's lamp. Who: any of the four holds, once all four agree. Requirements: the grudge settled (Kunhrim owns the urging or the western holds forgive it), the Deep King's lamp brought to one hold, all four holds at peace with each other. Changes: a faction-like compact with a shared research of the deep crafts, the holds' iron sold at one price, and a decision to choose a Deep King, which none has done since the drowning; the AI only chooses one when all four holds trust each other. Opening a Sea-Door remains the separate risky act of the fallen realms spec.

**Events and decisions.** An elven envoy at the Western Gate; the Iron Charter tested by an elf on the road.

### Burrikkrit (BRR), tree `regional_burrikkrit`

**Roots.** The Order's hired warbands came in 3A 38 with one shuttered lantern and a promise of the whole range; the promise outlived the Necromancer because nobody could dig them out.
**Sign.** The half-open lantern: while the lamp burns the warren stands.

**Focus branches** (beside The Lamp in the Throne-Cave and the Lamp Truce):
1. *Shutters Open*: the warren-bosses' shields show how many shutters they dare; a mechanic of boss boasts the king must answer, by fighting, feeding or ignoring them.
2. *The Promise Kept*: the warrens' claim to the range by stubbornness becomes a decision to demand recognition from the Concord (refused, laughed at, or granted for the under-roads' secret).
3. *Relit from Its Own Flame*: the lantern passes at a king's death; a succession event in which the biggest goblin who can hold the lantern wins.

**Formable identity.** None; the warrens' ambition is to be left in the range.

**Events and decisions.** A lantern going out in a warren; the Guard showing the helm.

### Olodor (OLO), tree `shared_middle_free`

**Roots.** A beaten king's treasury hidden in the hills, taken by the gnomes and then by a warlord, and the deaths of everyone who carried a coin of it away; the gnomes learned that gold has a memory. The first village-king was crowned with the rim of his full pot.
**Sign.** The pot-rim crown: a king is as lucky as what he was given.

**Focus branches** (the Olodor branch of the shared tree, beside The Pots of Tovodor):
1. *The Pot Is Full*: crownings happen whenever a pot fills with freely given gold; a decision family of gifts (from Parim's masons, from travellers) that can raise new village-kings, each a small luck spirit.
2. *Gold with a Memory*: a thief takes gnome gold; the gnomes let the luck work (a chain of misfortunes for the thief's realm) or take it back by force (and lose their luck).
3. *The Beaten King's Coin*: a coin of the old treasury turns up in Parim; finding it leads to the rest of the treasury's fate and a choice to return it or keep it.

**Formable identity.** None; the gnomes would rather not be found.

**Events and decisions.** A mason who knocks before he cuts; a crowning.

### Dunelaeth (DNL), tree `shared_middle_free`

**Roots.** Hill elves of the western woods, kin of Herrodon, who planted a beech on every grave; the household would not leave its dead of the Ember Lands campaign and sent Herrodon a leaf instead of an answer.
**Sign.** The beech leaf on the mound: we stay with our dead.

**Focus branches** (the Dunelaeth branch, beside The Graves of Thamiel):
1. *The Leaf Returned*: answer Herrodon at last; return home and leave the graves (Herrodon's welcome, the graves untended), bring Herrodon's envoys to stand at the graves (a reconciliation that keeps both), or refuse again.
2. *Guides Who Will Not Leave*: the pass-road guides become a scouting service to the Concord or to the Stranger's host, at the risk of the household being drawn into war.
3. *The Beeches Speak*: the wind through the grave-beeches; a mood event series that reveals nothing more than the household believes.

**Formable identity: the Kin Rejoined.** Name: *the Western Hall of Herrodon* (cosmetic on DNL as a subject or union with Herrodon; owner question). Entitlement: the shared descent. Who: Dunelaeth with Herrodon's agreement. Requirements: Herrodon's envoys stand at the graves, the household keeps the Kingdom Forests. Changes: elven unit access and the Kindred Song's western form recognised in Herrodon.

**Events and decisions.** Herrodon's third envoy; an Eldest's burial among the beeches.

### Aenor Forest (ANR), tree `shared_middle_free`

**Roots.** The Baelim's oldest stand predates men's stories; every death of the forest is followed by a year of silence and rows of closed cones laid at the edge; the rangers think the Baelim listen to something under the roots.
**Sign.** The closed cone: what falls is kept, and the forest waits.

**Focus branches** (the stands branch):
1. *The Year of Silence*: after any battle or felling in the forest, a year of silence follows; during it the forest cannot be entered by any army.
2. *Cones at the Edge*: the closed cones become a counter of the forest's dead; past a threshold, a rare event the owner must approve could open them (left as an owner question; nothing in the text says what happens).
3. *Water at the Edge*: Selen's dry-summer gift of water, which the Baelim may or may not drink, as a friendship value with Selen.

**Formable identity.** None.

**Events and decisions.** A ranger sent in with water; the voices for nine nights.

### Cursed Lands (CUR), tree `regional_cursed_lands`

**Roots.** The Veiled are the eldest heirs of the Low Country; every field the sea took was a black knot on the Moot's cord, and the Last Cord lies in the eldest barrow. The Black Roots soured the downs, the second land to die of asking; the hood is the mourning hood for the drowned.
**Sign.** The black knot: what was taken is never untied.

**Focus branches** (beside What the Cords Count and The Moot of Mothers):
1. *Every Crown Asks*: the Veiled refuse every crown; each foreign demand (tax, passage, levy) is recorded as a knot on the cord, and when the cord is long enough the cord-mothers can call a Grey March in reverse, a raid on the asker's roads.
2. *The Two Counts*: bring the Cord to Hirolon's Stone (the existing gated reveal), with the Veiled's choice to show the Last Cord or keep it hidden.
3. *The Sour Ground Healed*: a long, uncertain branch to heal the downs with roots and mushrooms, never with magic; it is the realm's only expansion, inward.

**Restorable identity: the Moot of Mothers.** Name: *the Moot of the Cords* (cosmetic on CUR; not a revival of the drowned realm, and the owner should confirm that the name does not read as one). Entitlement: the Last Cord. Who: the Cursed Lands, with the Bloody Forest and Orohaf invited. Requirements: the existing Moot of Mothers focus in both Orran trees, the Two Counts made, the Isle Houses' voice won. Changes: a moot of the three heirs as a league (each keeps its tag), a shared law that no member asks the land for more than it gives, and the cord-mothers' power to end feuds between members.

**Events and decisions.** A child's naming with a black knot; a scholar asking to see the cord.

### Bloody Forest (BLO), tree `regional_bloody_forest`

**Roots.** The Wolf, Bear and Raven clans of the Low Country went north into the red-oak forest and hung their mothers' cords in the oaks, which bleed when cut; war-chiefs serve one war and the mothers end feuds. They want the Vale's Orran river names back.
**Sign.** The bleeding leaf: the forest bleeds for its dead and its dead are counted.

**Focus branches** (beside The Red Cords, One Tongue in Two Woods and River Names Spoken):
1. *The War-Chief's Year*: the moot chooses a war-chief for a raid or a war and takes the office back at the peace; a mechanic of a temporary leader with strong war bonuses who must be stood down, or who refuses.
2. *River Names Spoken*: the existing focus becomes a campaign; Redbark singers in the Vale speak the rivers' Orran names, a propaganda war with Aenor that the Concord can ignore, ban or answer.
3. *The Dead in the Red Oaks*: the forest's belief that counted names cannot be raised becomes a defence against Zol's dead in the forest, which the narration keeps as belief.

**Restorable identity.** Shares the Moot of Mothers with the Cursed Lands.

**Events and decisions.** A cord-tree cut by a stranger; the reading of the burned names.

## Counts

| Region | Realms | Focus-branch proposals | Formable or restorable identities | Event and decision proposals |
| --- | --- | --- | --- | --- |
| Middle Lands | 23 | 76 | 14 (2 of them shared leagues) | 51 |

## Questions for the owner

Recorded in the vault's [Open Questions](../../../lore/vault/09%20-%20Development/Open%20Questions.md); the main ones for this region:

1. Does Kingson's sign (an ember in tongs) replace the earlier upright sword, and Kunhrim's drowned crown keep the Deep King's crown of the current design?
2. May the Lord of the Weald stay a Wild Spirit of unstated rank, as the Selen roots leave it?
3. May a cosmetic Moot of the Cords and a Stair-March of the Eight Towns exist without reading as a return of a fallen realm?
4. What, if anything, may the closed cones of the Aenor Forest ever do?
5. Kilinti's fallen oak bough and the Magical Forest's proposed Speaking Bough are both fallen boughs; one of them should change, or the two flags must be drawn so that they cannot be confused.
