# Realm roots: the Dark Lands

**Status:** Proposed (decision K67, 25 October 2026). Nothing here is canon until the owner adopts it; every root, sign and hook below is labelled **P** under the vault's Canon Policy, and the few established facts it builds on are labelled **E**.
**Data:** the `roots` and `sign` fields of each realm in `tools/content/data/world/history/dark_lands.json`, with the events and divergences added beside them.
**Companions:** [the regional dossier](../../../lore/regions/dark_lands.md) (section "Roots and signs"), the vault note [Roots of the Dark Lands](../../../lore/vault/07%20-%20History/Roots%20of%20the%20Dark%20Lands.md), [10_fallen_realms.md](../10_fallen_realms.md) (Muzerar, whose heir here is Hoorunoron), [deep_past.md](../../04_mechanics/deep_past.md), [dark_lands.md](../../04_mechanics/dark_lands.md) (the armed peace, the Accord, the Iron Yoke and the Free Moot) and [06_heraldry.md](../../08_art_and_assets/06_heraldry.md) sections 1.4 and 1.5.

## Purpose

The owner asked that every realm carry the ancient history that built its culture, and that its sign come out of that history as the Eye came out of Sauron (K67).
The Dark Lands were never one nation and their peoples are not Volgan's by nature (E), so their roots are not the story of one dark power: they are the stories of peoples who were used by masters, left behind by them, or refused them, and each realm's law grew from the way it met a master.
Three threads run through the region and tie its realms together without making them alike: Volgan's war and Dardan, which left orcs, rowers and garrisons stranded on both sides; the Necromancer's levies and the Buried Wars, which made the free holds; and the old stones and forests that older peoples keep.

The guards that bind this region are kept.
No fallen realm is placed in the Dark Lands (E); Hoorunoron is an heir of the drowned Low Country, not a fallen realm.
The demons of Veshazel use no pentagram, which belongs only to the Nether King's seal.
No skull, lidless eye, white hand or black tower appears, no god's device is used, and no sign shows Volgan, Elzon or any named person.
Devils are written only as the roosting fires of the mountains and the islands; their origin and the Old God they served stay sealed (knowledge layers C17, C18).
The Forgotten Giants' name and their stones stay behind the Stone keeping gate in game text (F12); this file and the history data are design data.

## The signs at a glance

| Realm | Sign (device) | Charge class | Root |
| --- | --- | --- | --- |
| Goldoroth | the Crown of Broken Blades, a jagged black crown on fire-red | crown | the Long Walk from Dardan and the law of the ring |
| Dondor | the Garrison Helm, an open-faced ridge-crested helm on blood-red | helm | the garrison that was never relieved, Rovek's helm at Dardan |
| Dark Gate | the Gate-Chain, three great links in an arc on dull gold | chain | the smith's chain of the Buried Wars and Zugash's toll |
| Burnikit | the Fire at the Door, a tunnel-arch with a fire in its mouth on rust-red | arch and fire | the Unpaid and Snikkit's lie to the Necromancer's recruiters |
| Veshazel | the Three Scores, three red claw-scores on ash-grey | claw-mark | the lord's break from the Nether's court and the raked bounds |
| Blackton | the Empty Seat, a tall high seat in white on black | seat | the league of old enemies and the seat no one may take |
| Belonton | the Broken Shackle, an open shackle on sea-green | fetter | the rowers of Volgan's clients' galleys who broke their benches |
| Bordon | Kargesk's Horn, a banded war-horn on dust-ochre | horn | the night the gorge was taken and the Road-Peace |
| Dreson | the Three Piles, three black piles over fen-green on reed-yellow | piles | the escaped levies and the three path-elders |
| Dulundur | the Four Fires, four flames on one hearthstone | fire | the oath of 3A 1150 against the last levy |
| Troll Forest | the King-Stone, a hunched troll-shaped stone on forest-green | standing stone | the dead kings who stand at the forest's edge |
| Hoorunoron | the Dike-Cairn, a cairn standing on water on moss-green | cairn | the dikes of the drowned Low Country carried and raised again |
| The Darks | the Grounded Spear, a spear point-down on blood-red | spear | the Meat Moot of orcs and ogres |
| Skragdurg | Grashdug's Axe, an axe bitten into a stump on charcoal-red | axe and stump | the felling of the Old Black |
| Dun | the Turned Sail, a ship with a half-red, half-white sail on sea-grey | ship | the crooked ancestor and the toll-king's sail |
| Britadon | the Running Boar, a black boar on iron-red | beast | the Hollow and the boars that led the survivors out |
| Wild Lands | the Rag-Pole, a pole with three streaming strips on moor-brown | pole | the field of the last host and the winter rule |

No charge class appears more than twice: fire twice (Burnikit's fire in an arch, Dulundur's four flames), stone twice (the troll King-Stone and the giants' cairn) and fetter twice if chain and shackle are counted together.
The only beast is Britadon's boar, justified by its story: the boars led the survivors out of the hills and the clan never hunts them.

## Realm by realm

### Goldoroth (tree `goldoroth`)

**Roots (P).** The Volcano Clans began in the iron hills, where the oldest orc holds were dug long before Aen.
Their songs turn on the march to Dardan: the four great clan-lines sent their young to Volgan's host, the orcs held the forward lines and died there, and the masters left them on the field.
The few who came home walked north through hostile country, and the Fire-Speakers chant the Long Walk from Dardan at every Ember-Night.
From the walk came the ring (a chief who cannot win his place with his own hands may not send others to die) and the saying that no spirit rules the Dark, which many orcs broke by fighting on in Volgan's name through the Second Age.
The Fire-Mountain became holy later, as the one master that never left them.
In 4A 1748 the grief divides the court between those who will never march for a southern master again and those who want the Middle Lands for the orcs themselves.

**Sign (P).** The Crown of Broken Blades: the beaten chiefs' blades, snapped at the hilt, hammered into Skarag's crown at Sungodor in 4A 1452, with one blade added by every Warking.

**Focus-branch ideas.**
1. **The Long Walk** (beside The Fire-Mountain Speaks): the Fire-Speakers chant the walk's hills; a chain that ends in a choice between *The Vow of the Walk* (refuse every southern bargain; locks Kneel to Nafeher and The Southern Bargain, adds a spirit with defence and war support against Volgan's side) and *This Time for Ourselves* (unlocks claims across the Southern Dark Strait at a stability cost while Volgan stands).
2. **The Crown Takes a Blade** (after Master of the Clans): each successful ring challenge adds a blade; a counter variable `zin_goldoroth_blades` grows the Warking's legitimacy (political power and army leader skill) and raises the chance of a challenge, so a long reign is strong and dangerous.
3. **The Ring Before the Moot** (in the moot branch, beside The Law of the Moot): a reform route that turns the ring into a fixed contest each Ember-Night, trading the risk of sudden civil war for a yearly stability check.
4. **Names of the Fallen Hills** (after The Ash Rites): a pilgrimage branch to the hills of the Long Walk inside the Middle Lands and the North that gives claims only as cultural "memory" modifiers, never cores, and opinion bonuses with free orc holds.

**Formable or restorable identity.**
- **Gruzgoroth of the Walk** (cosmetic identity of Goldoroth). Entitlement: the realm the walkers would have built had they come home to a free Dark Lands. Who: Goldoroth. Requirements: The Vow of the Walk taken, the Dark Gate and Bordon under the Iron Yoke or allied, no oath to Nafeher at any time, Volgan's envoys hunted (Hunt the Southern Envoys done), the Accord at peace or broken. Changes: the realm takes its own name in the game text, the Warking's title becomes Walk-King, the ring succession gains the yearly contest, and the Free Moot holds' opinion of Goldoroth no longer falls when the Yoke is light.

**Events and decisions.**
- Event *The Walk Is Chanted* (yearly at the Ember-Night): the Fire-Speakers ask the Warking to name the fallen hills (stability) or to speak of the south instead (war support, Fire-Speaker anger).
- Event *A Blade for the Crown* (on every ring challenge): the challenger is broken and his blade added, or the Warking falls and the new one takes the crown with the old blades.
- Decision *Send Back the Southern Gifts* (Southern question category): costs political power, raises the Vow's spirit for a year and hurts Volgan's opinion.

### Dondor (tree `regional_dondor`)

**Roots (P).** Dondor's men are the garrison that was never relieved: Ainic soldiers kept on the plain by Aen's heirs and paid in iron bars from Aenor's forges.
When the ships stopped about 1A 352 the last pay-chest was divided, one bar to each hearth, and the captains swore at the stockade to hold the plain as if the relief were still coming.
That chest is the Hearth-Iron; a house that loses its bar loses its seat at the clan-moot.
Dromand of the Barand was given the last captain's helm instead of a crown, and the orcs' scorn, Brute-King, became a boast.
Living beside orcs taught the men that orcs are neighbours and not one enemy, which is why Rovek could lead Dark Lands soldiers into the Grand Alliance (E, proposed figure) and why Brunmar of the Urdung closed the Burning Gate of Nezer in 2A 1388.

**Sign (P).** The Garrison Helm: the last captain's helm, which makes every king; Rovek lifted it on a spear at Dardan under the Charter of Free Banners, and the spears of the Burning Gate hang around it at Notbuton.

**Focus-branch ideas.**
1. **The Pay-Chest** (after The Brute-King's Hall): the Hearth-Iron is counted; a census-like branch that grants manpower and a spirit *Every Hearth a Bar* (recruitable population, stability) and lets the king strip a disloyal house of its bar (a decision below).
2. **Rovek's Flank** (in the army branch, after The Shield-Line): the doctrine of the veterans who held Dardan's flank against Volgan's scouts; adds recon and defence bonuses and a special-forces-style "beacon scout" template unlock.
3. **The Garrison That Stayed** (after Friends Beyond the Straits): Dondor asks Aenor to acknowledge the old garrison; the outcome is either *The Relief Came Late* (an Aenor opinion and trade boost) or *We Relieve Ourselves* (a pride spirit and refusal of foreign guarantees).
4. **The Gate's Spears** (after Old Debts of the Alliance): the spears of the Burning Gate are carried south again, unlocking the divergence `dnd_helm_south` as a volunteer route to the Middle Lands.

**Formable or restorable identity.**
- **The Free Banners of the Dark** (restorable identity). Entitlement: the Dark Lands company of the Grand Alliance that fought under the Charter of Free Banners. Who: Dondor, or Belonton if Dondor no longer exists. Requirements: at war with Volgan's side or with the dead, the Accord standing, at least three free holds of the Dark Lands (any of Dulundur, Bordon, Dreson, Britadon, the Darks) in its faction, Rovek's Flank done. Changes: a cosmetic name, a faction named for the Charter, members keep their own flags and governments (no annexation through the identity), and every member gains a shared defence spirit while the war lasts.

**Events and decisions.**
- Event *The Helm Is Set* (at each king's making): the helm fits (stability) or the moot whispers that it sits loose (a rival line's support grows).
- Event *A House Without Iron* (random, low weight): a house has sold its bar for powder; restore it, shame it or let it go.
- Decision *Strip the Hearth-Bar* (Dondor category): removes a disloyal house's seat; political power gain, stability loss, rival line support grows.

### Dark Gate (tree `shared_dark_lands`)

**Roots (P).** The pass is the throat of the Goldoroth arm: Volgan's envoys came north by it and the arm's orcs went south by it to the Southern Burning; after Dardan the broken bands came back through it and paid the first toll in food and weapons.
In the Buried Wars free orcs broke the Necromancer's carts on a smith's chain stretched across the narrows by night, and Zugash, of that band, hung a three-link chain across the narrows in 3A 880.
The law is that nothing passes unpaid and uncounted, not kin and not a Great Spirit's envoys; since 4A 1470 the chain that made Doldes free has been the yoke it pays.

**Sign (P).** The Gate-Chain: three great black links in an arc on dull gold, the toll-sign of the road south.

**Focus-branch ideas.**
1. **The Tally of the Gate** (in module D2, after Forge-Pits): the tally-keepers' notches become intelligence on everyone who uses the pass; gives intel on Goldoroth and the Southern Dominion and a trade income.
2. **Raise the Chain** (in module D3, after No Master but Our Own): the gate-chief closes the pass to Cocanoor's tribute-takers, the divergence `drk_chain_closed`, which is also the route to the identity below.
3. **The Old Toll of Dardan** (in module D7, after Strangers from the South): Volgan's envoys are tolled like caravans; choose to toll them double (money, Volgan anger) or to refuse them the pass (Goldoroth's southern contacts cut).

**Formable or restorable identity.**
- **The Free Gate of Doldes** (restorable). Entitlement: the six centuries before 4A 1470, when the gate-hold tolled the road for nobody's crown. Who: Dark Gate. Requirements: free of the Iron Yoke (not a subject of Goldoroth), Raise the Chain done, Doldes held through one war with Goldoroth. Changes: a cosmetic name, a toll spirit that taxes every army crossing the pass (attrition and supply penalty for armies without military access) and an event each time an army of another realm passes.

**Events and decisions.**
- Event *An Envoy at the Chain* (when Volgan's envoys pass): toll, double toll or turn back.
- Decision *Lower the Chain for a Host* (Dark Gate category): grants one realm military access through the pass for a price in iron or gold, the gate's way of choosing a side.

### Burnikit (tree `shared_dark_lands`)

**Roots (P).** The goblins lived in the warmest rock before any warking.
Their grief is the Unpaid: in 2A 2110 the warrens opened the deep ways to the Necromancer for a promised price, and neither the price nor the goblins taken as guides and levies came back; a notch on the Unpaid Stick marks each one.
Their trick is the Fire at the Door: in 3A 1004 Snikkit lit sulphur fires in every deep way's mouth and told the recruiters the warrens were burning with sickness.
From the grief comes payment first; from the trick come the Big Sniks and the craft of the yellow crusts, which became the Dark Lands' first powder in 4A 1566.

**Sign (P).** The Fire at the Door: Snikkit's lie, painted at every warren's mouth and burned into every powder keg.

**Focus-branch ideas.**
1. **The Unpaid Stick** (in module D10, after The Warrens Below): a branch about the old debt; any realm that pays the Unpaid (a decision below) wins a lasting powder monopoly, the divergence `bun_unpaid_paid`.
2. **The Fire at the Door** (in module D3): the warrens' defence; deep ways can be shut with sulphur fires, a large defence and attrition bonus inside the warren states and a rule that the warrens can never be entered by the deep ways.
3. **The Yellow Crusts** (in module D2): the powder craft as an industry branch, with the existing powder sales to Goldoroth and Dondor as its trade outcomes and a research bonus for black-powder equipment.
4. **One Voice for All** (in module D1): the Big Snik's office; a choice between a Big Snik who lies for everyone (diplomatic bonuses, low trust) and one who tells the truth once (a single binding treaty).

**Formable or restorable identity.** None proposed: the warrens' law forbids any crown, and the Big Snik is not a king (roster decision, E).

**Events and decisions.**
- Decision *Pay the Unpaid* (available to any realm with Burnikit in its diplomacy list): a large gold-and-political-power cost scaled by the stick's notches; Burnikit then sells powder to that realm alone.
- Event *Smoke in the Deep Ways* (when a foreign army enters a warren state): the Big Snik lights the fires; the army suffers attrition, and Burnikit's opinion of its owner drops.

### Veshazel (tree `shared_dark_lands`)

**Roots (P).** The hall's telling is that its lord was of a house of the Nether's court that lost the right to open portals in the Third Age, when the portals closed as the houses quarrelled with Elzon's order.
Rather than serve a rival house he took the house's pact-name out of the court, which the court counts as theft, and walked north by uncharted vents and shores to the Ash Fields in 4A 1180, where only devils roosted.
He raked the bounds with three claw-scores and raised a hall of pressed ash.
The hall swears to no master because a house that serves loses its name, binds its thralls by blood and ash and marks them with the scores, and fears the court it left.
A thrall who has served seven winters may ask the lord for a name.

**Sign (P).** The Three Scores: the raked bounds, the thralls' mark and the seal of every pact; no pentagram, which is the Nether King's alone.

**Focus-branch ideas.**
1. **The Stolen Name** (in module D1): the pact-name the lord carried away; a chain that strengthens the lordship (political power, a demon recruitment pool) and raises the chance that the Nether's court comes to reclaim it, the divergence `ves_court_reclaims`.
2. **A Name for Seven Winters** (in module D11): the thralls' custom turned into a loyalty mechanic; thralls who are given names add manpower and stability, while a lord who refuses names keeps a larger demon share of power.
3. **The Bounds Raked Wider** (in module D3): the lord marks new ground on the Goldoroth shore, a claim chain that Goldoroth answers with the existing southern question.

**Formable or restorable identity.**
- **The Unsworn House** (restorable). Entitlement: a house of demons with its own pact-name, owing nothing to the Nether's king. Who: Veshazel. Requirements: the court's reclaiming house defeated (`ves_court_reclaims` war won), no oath to the Southern Dominion, The Stolen Name done. Changes: the lordship is recognised as a house in its own right; a cosmetic name, the Pact-Rite decisions of the Nether become available to Veshazel's own neighbours through it (the lord bargains with the living as the king does), and the Nether's opinion of Veshazel is fixed at hostile.

**Events and decisions.**
- Event *The Court Remembers* (low weight, rising with The Stolen Name): an envoy of the Nether asks for the name back; refuse, bargain or yield (yielding ends the lordship's independence).
- Decision *Mark a Thrall* (Veshazel category): recruits mortal thralls from refugees and debtors of the coasts, costing opinion with Dondor and Dreson.

### Blackton (tree `regional_blackton`)

**Roots (P).** The five harbours grew where two old enemies met: the beaches below the Iron Road launched the iron holds' raids across the Northern Dark Strait in the Raiding Years, and Leren fleets burned them.
The Leren merchants of 4A 1071 were grandchildren of the burners, and they married the grandchildren of the raiders.
The league of 4A 1102 gave the harbour-keys to one moot and set a high seat in the moot-hall that nobody may sit in, so that no Dondric or Leren house could rule the other; the charter quarrel of 4A 1688 was a request to sit in it.

**Sign (P).** The Empty Seat: white on black, the founders' seat that every moot-speaker turns to before the vote.

**Focus-branch ideas.**
1. **The Seat Stays Empty** (after The Town Moot Sits): the moot renews the oath; a spirit that rewards trade and stability and forbids the Lord's Charter route while it lasts.
2. **Someone Sits Down** (after The Lord's Charter): the charter route made explicit as the divergence `blk_seat_filled`, with a short civil quarrel among the towns that decides whether the new lord holds all five.
3. **The Burned Beaches** (after The Leren Quarter): the old raids are remembered and forgiven; a reconciliation chain with Lerendor that opens Leren protection without the charter.

**Formable or restorable identity.**
- **The Lordship of Dontadur** (identity change, not a union). Entitlement: the seat was built for a lord. Who: Blackton. Requirements: Someone Sits Down done and the quarrel won with all five towns held. Changes: the league becomes a lordship with a hereditary lord, a cosmetic name and government label, Leren or Dondric court culture depending on the lord's house, and the moot's stability bonus is lost.

**Events and decisions.**
- Event *The Speaker Turns to the Seat* (yearly moot): the oath is spoken (stability), or a burgher hesitates (charter support grows).
- Decision *Call the Moot Under the Seat* (Blackton category): forces a vote on a war or a treaty; success binds all five towns, failure costs stability.

### Belonton (tree `shared_dark_lands`)

**Roots (P).** The sea orcs were rowers chained to the benches of Volgan's clients' galleys; stranded in the Belonton waters after Dardan, they broke their shackles, drowned their overseers and took the isles and the coast with the masters' own ships.
From the benches they kept the Salt Tithe (the masters' share now paid to the sea), the Sea-Chief chosen by voyages won, and the oath never to row for a master again.
The Accord of 4A 1604 holds because both its peoples were left behind by masters who never came back.

**Sign (P).** The Broken Shackle: each rower kept his own; at Notle in 3A 940 each captain threw one into the harbour and the Sea-Chief nailed the last to his mast.

**Focus-branch ideas.**
1. **The Bench-Oath** (in module D8, after Harbour of the hold): the oath renewed; a naval spirit and a lock on any subject or faction membership under Goldoroth or the Southern Dominion.
2. **The Salt Tithe** (in module D8): the yearly offering of salt as a navy and trade mechanic; paying it in full keeps the crews' morale, withholding it raises money and risks a mutiny event.
3. **Left Behind Together** (in module D5, after The Oath of the Accord): the Accord's root told to both peoples; strengthens the Accord's resolve and unlocks the joint identity under Dondor above.
4. **The Galleys Offered** (in module D7): Volgan's admirals' offer, the divergence `bln_bench_offer`, as a split-the-confederacy choice.

**Formable or restorable identity.** Belonton may take **The Free Banners of the Dark** if Dondor has fallen (see Dondor).

**Events and decisions.**
- Event *Galleys from the South* (when the Southern Dominion musters): accept, refuse or burn the galleys in harbour.
- Decision *Throw a Shackle* (Belonton category): spend navy experience to renew the bench-oath after a defeat at sea, restoring the naval spirit.

### Bordon (tree `regional_bordon`)

**Roots (P).** The Black Road is the oldest road of the iron hills, black with the slag spread on it long before Aen.
In 3A 700 Kargesk brought the free runners through the gorge by blowing a great horn from the cliff-top at the garrison's change of watch, and by dawn the runners held the gorge.
When the barracks became caravan inns the horn became the Road-Peace: from its note until the caravan leaves, no blade may be drawn on it.
The Night of the Trolls of 4A 1390 is Bordon's grief because the smashed caravan had left the road and the horn's peace.

**Sign (P).** Kargesk's Horn on dust-ochre, the road-wardens' sign.

**Focus-branch ideas.**
1. **The Road-Peace** (after Caravan Inns): a trade and neutrality branch; while it lasts, every realm using the Black Road gains trade and the realm gains money, and a breach fires the divergence `bor_peace_broken`.
2. **Blow the Horn** (after Warband of the Road): a war route in which the horn calls every hold that uses the road to Bordon's side against a breaker of the peace.
3. **The Camp Beyond the Road** (after Envoys on the Road): a short troll-diplomacy chain with the Troll Forest that sets the troll silver at the road's edge and ends the old grief of 4A 1390.

**Formable or restorable identity.** None proposed: Bordon's root is a peace on a road, not a crown.

**Events and decisions.**
- Event *Blades in the Gorge* (when an army fights inside Bordon's states while it is not at war with them): the horn sounds; demand blood-price, call the holds or let it pass.
- Decision *Grant the Road-Peace* (Bordon category): extend the peace to one realm's armies (military access with no war participation), paid in gold.

### Dreson (tree `regional_dreson`)

**Roots (P).** The fen orcs are the levies who would not go: in 3A 520 a column taken in chains for the Necromancer's garrisons broke its chains and fled into the fens.
Three eel-fishers among them knew the paths and drove the first three piles at Dolido; the reed-council are their heirs, who teach the paths only by walking them, so that no map of the fens exists.
The fen-law is that no chains enter the fens, and a captive who reaches the reeds is free.

**Sign (P).** The Three Piles on reed-yellow, first embroidered when the Free Moot asked the fens for a band.

**Focus-branch ideas.**
1. **No Chains in the Fens** (the existing focus, extended): the fen-law as a refugee mechanic; Dreson gains manpower from runaways of Veshazel and Goldoroth, the divergence `dre_no_chains`, at the price of their anger.
2. **The Walked Paths** (after Hidden Paths): the paths taught by walking, a branch that grants the fens' defence and the guide trick in war (an enemy army in a fen state can be led astray by a decision).
3. **The Three Elders** (after Fen Law): the reed-council's three path-elders as a government mechanic; choose which elder speaks for war, trade or refuge.

**Formable or restorable identity.** None proposed: the reed-council is its own identity, and the fens refuse a crown (The Reed Crown focus stays the only crown route).

**Events and decisions.**
- Event *A Runaway at the Reeds* (when a neighbour holds slaves or thralls): take him in, return him, or sell him back.
- Decision *Lead Them Astray* (Dreson category, at war): an enemy army in a fen state loses organisation and strength; usable once per war, mirroring the Reed Drowning.

### Dulundur (tree `regional_dulundur`)

**Roots (P).** The four valleys kept four fire-rites long before Aen (fire in an iron basket, on a flat stone, in a pit and on an open hearth) and despised each other's.
The Necromancer's last levy came for all four at once, and in 3A 1150 the chiefs lit their fires on one hearthstone at Lesderle and swore they would burn together or not at all.
The hall speaks only when all four agree, an envoy who asks one valley to break away is put out, and the goblins who ran messages on the night of the oath keep a lamp beside the fires.
The Free Moot of 4A 1488 offered the free holds the same bargain.

**Sign (P).** The Four Fires on one hearthstone, so that every valley sees its own fire and none stands above the others.

**Focus-branch ideas.**
1. **Four Rites, One Stone** (after Chiefs of the Four Valleys): each valley's rite becomes a small bonus (iron basket: industry; flat stone: stability; pit: defence; hearth: manpower), and the player may favour one at the cost of the others' opinion.
2. **Carry the Fire** (after The Moot Stone): the Four Fires carry a fire to every Free Moot hold, the divergence `dul_fires_carried`, leading to the identity below.
3. **The Goblins' Lamp** (after Speak to the Holds): the goblin quarters' messengers become a spy network among the holds, adding intel and a decision to warn the Moot of an attack.

**Formable or restorable identity.**
- **The Hall of Many Fires** (lore-born federation, not a conquest formable). Entitlement: the oath of 3A 1150 extended to every free hold, as the Free Moot of 4A 1488 offered. Who: Dulundur. Requirements: Carry the Fire done, at least four other free holds (Bordon, Dreson, Britadon, the Darks, Skragdurg, Dun) have lit a fire from Lesderle (each accepts by an event), none of them under the Iron Yoke. Changes: Dulundur becomes the Hall of Many Fires; the other holds become autonomous subjects that keep their own chiefs, flags and laws (no annexation), a shared spirit gives defence to every member, and an envoy who asks one fire to break away is answered by all.

**Events and decisions.**
- Event *A Fire Gutters* (when one valley's chief is courted by Goldoroth): relight it with gifts, shame the chief, or let it go out (the divergence `dul_fire_out`).
- Decision *Light a Fire from Lesderle* (for each Free Moot hold): offer the hold the oath; it accepts or refuses by its own AI weights.

### Troll Forest (tree `regional_troll_forest`)

**Roots (P).** The trolls' oldest telling is the King-Stones: a troll king too great and too old walks out of Holos at the end of a night and faces the dawn, and the sun makes him a stone that keeps watch for ever.
The forest's edge is ringed with these stones, which the trolls name and feed with silver and bones; the bounds are where the kings stand, the oldest unbeaten troll leads each group because he must earn his stone, and silver belongs to the kings, which is the root of the troll silver.
Smash is already turning, and his trolls say his stone will be the greatest.

**Sign (P).** The King-Stone, the shape the trolls daub in ash and silver on the one standard they carry.

**Focus-branch ideas.**
1. **The Kings at the Edge** (after The Forest Law): the King-Stones as the forest's defence; a spirit that adds defence and attrition at the forest's border states and forbids forestry by anyone.
2. **Silver for the Stones** (after Troll Silver): the troll silver tied to the stones; realms that pay can cross, and each payment strengthens a king-stone's watch (a stacking defence variable).
3. **The Dawn Walk** (late tree, after Long Memories): Smash's own walk into the dawn as the divergence `tro_king_stone`, a succession event that renews the forest under a younger king and resets the troll-silver bargains.

The tree's text still names "Troy the Old", a name the owner replaced; the tree owner should rename it to Smash (noted, not changed here).

**Formable or restorable identity.** None proposed: the trolls form nothing, and the forest belongs to nobody (E).

**Events and decisions.**
- Event *A Stone Stands at Dawn* (when an old troll leader dies): the trolls name a new King-Stone; realms that paid the silver are asked to pay the new stone.
- Decision *Lay Silver at a Stone* (for any realm bordering the forest): pays troll silver for passage and peace.

### Hoorunoron (tree `shared_dark_lands`)

**Roots (P).** The giants of Hoorunoron are the Forgotten Giants (E, K64 M5), the giants of the low hills of the drowned Low Country, who raised its sea-dikes as partners of the cord-mothers (E, K64).
Their cairn-keepers warned the Moot; after the Night of the Sea they carried the stones of the broken dikes north-east, one under each arm, and raised them again as the Borderline of Giants.
The line is a dike rebuilt on dry land, which is why it may not be crossed.
The oldest stones of their count lie at its head by the Giant River.
They say of the Low Country only that the land was asked for too much (E, kept mystery).
The giants of the Giant Forest beside their hills are a different people (E, K66), of whom the Forgotten Giants say nothing.

**Sign (P).** The Dike-Cairn: a cairn standing on water, painted on the great hide in the cairn-hall at Maruunos.

**Focus-branch ideas.**
1. **The Line Holds** (in module D3): the Borderline as a dike; a defence spirit at the border states and the existing rule that a crosser has the giants as an enemy (divergence `hoo_crossed`).
2. **The Head of the Line** (in module D11): the oldest stones shown to a realm that has kept the line, the divergence `hoo_head_of_line`, which joins the deep past's Stone keeping so the giants' count can be laid beside Hirolon's and the Cursed Lands' Cord.
3. **The Door Opened Once** (in module D6): the giants' own road through their hills, opened once to a realm that kept the line (the existing divergence `hoo_door_once`).

**Formable or restorable identity.**
- **The Giants of Humaran** (restorable identity, gated by the Stone keeping). Entitlement: Humaran is the giants' own name for the low sea over the drowned land; the identity restores the name of the partners of the Low Country. Who: Hoorunoron. Requirements: The Head of the Line done, the deep past's Two Counts known to at least one realm, the Borderline unbroken for the whole game. Changes: the realm's name and adjective appear only after the gate, the giants open diplomacy with Hirolon and the Cursed Lands (opinion, non-aggression), and nothing of what lies under the sea is revealed.

**Events and decisions.**
- Event *Stones Across the Line* (when a woodcutter or patrol crosses): carry them back (warning), break their camp, or let them stay (the line weakens).
- Decision *Lay a Stone at the Line* (for any neighbour): a gift that raises the giants' opinion and makes the neighbour's armies exempt from the crosser rule for one war.

### The Darks (tree `shared_dark_lands`)

**Roots (P).** The forest orcs say they came home from Dardan and found the hills full; the ogres say they walked from the sunrise long before Aen, from lands where their kin live beyond a sea (belief; ogres live on both sides of the eastern seas, K64 Tarkia note).
In the hard winter of 4A 1222 Grimduth walked into the ogres' caves with meat on a spear turned point-down, and the Meat Moot was made: spears grounded before the moot sits, meat before words, and nothing decided until both peoples agree.
The Broken Cairn of 4A 1483 is the moot's shame, and its people may not touch a cairn.

**Sign (P).** The Grounded Spear on blood-red, its shaft still wound in the thong that tied the meat.

**Focus-branch ideas.**
1. **Meat Before Words** (in module D1): the moot's two voices as a government mechanic; every focus that changes law needs a "both agree" check (a scripted trigger on orc and ogre support variables).
2. **The Ogres' Walk** (in module D10, after Ogre Chiefs): the ogres' tale of the sunrise; opens a diplomatic hook with ogre peoples beyond the Dark Lands and the ogre recruitment the tree already has.
3. **Atone for the Cairn** (in module D6): the moot rebuilds the Broken Cairn, the divergence `dak_cairn_rebuilt`, ending the giants' grudge.

**Formable or restorable identity.** None proposed: the moot is a bond of two peoples, not a crown.

**Events and decisions.**
- Event *A Spear Lifted* (when an envoy offers to hire the ogres alone): refuse together, or let the ogres go (the divergence `dak_ogres_hired`, with a moot crisis).
- Decision *Share the Meat* (the Darks category, in a hard winter): spend resources to keep both peoples fed and raise stability.

### Skragdurg (tree `shared_dark_lands`)

**Roots (P).** The Fonoor timber built the raiders' boats of the Raiding Years; at the forest's edge grew the Old Black, whose shade kept the sun off the felling camps and whose felling the camps feared would bring the forest's revenge.
Grashdug felled it in 4A 1120 and left his axe in the stump, and the camps built the forest-hold around it; every chief must fell a great tree before he may swear on the stump.
The hold cuts what others fear, sells to anyone, plants a sapling for every great tree and never cuts within sight of the giants' cairns.

**Sign (P).** Grashdug's Axe bitten into the stump, branded on the hold's timber before it was ever sewn.

**Focus-branch ideas.**
1. **The Oath on the Stump** (in module D1): each chief's felling as a succession test; a strong chief gains political power, a weak one loses the camps' trust.
2. **Timber for Any Hull** (in module D8): the neutral timber trade made explicit, with the divergence `skr_timber_one` as a war-time choice and a dockyard bonus for whichever side buys.
3. **A Sapling for Every Tree** (in module D2): a sustainable forestry branch that keeps the forest's revenge at bay (a stability modifier that falls whenever the hold over-fells in war).

**Formable or restorable identity.** None proposed.

**Events and decisions.**
- Event *The Axe Is Drawn* (the divergence `skr_axe_drawn`): the camps panic; restore the axe, defy the fear or let the camps go.
- Decision *Fell a Great Tree* (Skragdurg category, for a new chief): a short cost in timber and time that confirms the chief.

### Dun (tree `shared_dark_lands`)

**Roots (P).** The Zhaggul claim a crooked forefather, an orc ship-captain of the First Age who sold each side of the war the other's crossing and was paid by neither (their own boast; no other record has his name).
Rukhesk took Dobudo in 4A 1300 and set up the turned sail, whose halves are dyed in the colours of paying neighbours and turned whenever the payment changes.
A promise lasts as long as its price, and the house fears that a buyer who learns he was sold will come back, which is why Dobudo's walls are the strongest on the Dun Sea.

**Sign (P).** The Turned Sail, half red and half white.

**Focus-branch ideas.**
1. **Turn the Sail** (in module D8, The Swing of the Dark Seas): the swing as a seasonal mechanic; the toll-king chooses each half-year which neighbour's colour faces the channel, gaining that neighbour's money and the other's anger.
2. **The Captain's Lesson** (in module D7): the ancestor's tale; Dun can sell an enemy's movements to its rival once per war (intel and money) at the risk of the divergence `dun_sold_returns`.
3. **Walls for the Day They Come Back** (in module D3): Dobudo's walls as a fort branch tied to the fear of the cheated buyer.

**Formable or restorable identity.** None proposed: Dun's root forbids it a lasting loyalty, and so a lasting identity.

**Events and decisions.**
- Event *The Sail Turns* (when the channel's paymaster changes): ships of the old paymaster are turned away.
- Decision *Sell the Hour* (Dun category, at peace or at war): sells a neighbour's naval movements to its rival; money and intel, opinion loss if discovered.

### Britadon (tree `shared_dark_lands`)

**Roots (P).** The south-east hills sank the deepest shaft of the Dark Lands, the Hollow, and in Volgan's war, when the Damned Spirits rose from beneath the mountains (E), something breathed out of it that the hill-orcs will not describe (P, kept unexplained).
The black boars fled first to the headlands, and the orcs who followed them lived; the survivors sealed the Hollow with slag and stone.
No shaft goes deeper than the Brakgul measure, and nobody hunts the black boar; the iron goes by sea rather than through Goldoroth's lands.

**Sign (P).** The Running Boar, painted on the slag that seals the Hollow.

**Focus-branch ideas.**
1. **The Brakgul Measure** (in module D2, after Black Iron Seams): wide pits and shallow galleries as a slower, safer mining branch; steady resources without the risk events.
2. **Below the Measure** (in module D2, alternative): deeper shafts for more iron, with a rising chance of the divergence `brt_hollow_opened`; mutually exclusive with the Measure.
3. **Iron by Sea** (in module D8): the sea trade that avoids Goldoroth, with a choice to sell all to the Accord (`brt_accord_iron`).

**Formable or restorable identity.** None proposed.

**Events and decisions.**
- Event *The Boars Run* (rare, after a deep shaft): the pits are emptied; obey the boars (lose production for a year) or keep digging (risk the Hollow).
- Decision *Seal the Hollow Again* (Britadon category, after the Hollow opens): a large cost that ends its effects.

### Wild Lands (tree `shared_dark_lands`)

**Roots (P).** The free holds' last host of the Buried Wars was broken on the moor about 3A 690, and no hold would settle a field of so many dead, so the moor became the refuge of those no hold would have.
The winter rule of 4A 1500 gives the land to whoever stays through a winter; nobody is asked his clan, the winter-holder of Zudertu speaks until the thaw, and a camp that grows too large splits.
On the first snow the winter-holder plants a bare pole and every band ties on a strip of its old clan-cloth.

**Sign (P).** The Rag-Pole with three streaming strips for all the clans that are no longer anyone's.

**Focus-branch ideas.**
1. **Tie a Strip to the Pole** (in module D1): the moor's outcasts as a manpower mechanic; each winter, bands driven out of other holds join (manpower) and their former holds' opinion falls.
2. **The Field of the Last Host** (in module D7): the battlefield's memory; a war-support spirit against the dead and the Necromancer's heirs, and an event when Zol's dead land on the northern shores.
3. **One Chief Through Many Winters** (in module D1): the divergence `wil_one_chief` as a route that makes the moor a hold at the price of its refuge.

**Formable or restorable identity.** None proposed: a hold of outcasts that becomes a crown stops being the Wild Lands (the divergence `wil_one_chief` covers the change).

**Events and decisions.**
- Event *First Snow at Zudertu* (yearly): who holds the winter camp; a strong band, a newcomer or a split.
- Decision *March Under the Rag-Pole* (Wild Lands category): the divergence `wil_outcast_host`; the bands march on the hold that drove most of them out, which must pay or fight.

## Counts

| Kind | Number |
| --- | --- |
| Focus-branch ideas | 55 |
| Formable or restorable identities | 7 (Gruzgoroth of the Walk, the Free Banners of the Dark, the Free Gate of Doldes, the Unsworn House, the Lordship of Dontadur, the Hall of Many Fires, the Giants of Humaran) |
| Events and decisions | 36 |

## Open points for the owner

These are recorded as lines in the vault's Open Questions.

1. May the demons of Veshazel be a house that broke from the Nether's court in the Third Age, carrying its pact-name away?
2. May the sea orcs of Belonton descend from the rowers of Volgan's clients' galleys stranded after Dardan?
3. May Dondor's men have been paid in iron bars, so that the Hearth-Iron is the garrison's last pay-chest?
4. Who are the giants of the Giant Forest, the people K66 sets apart from the Forgotten Giants, and do they have a realm or only a place?
5. Was something under Britadon's Hollow one of the Damned Spirits' risings, or should it stay unexplained (the proposal keeps it unexplained)?
