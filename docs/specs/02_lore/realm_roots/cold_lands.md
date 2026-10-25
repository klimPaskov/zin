# Realm roots: the Cold Lands

**Decision:** K67 (owner, 25 October 2026): every realm carries the ancient history that built its culture, and its sign comes out of that history.
**Status:** every root, sign, hook and proposal below is **proposed** under the vault's [Canon Policy](../../../lore/vault/Canon%20Policy.md); nothing here is established until the owner adopts it.
**Source of the data:** `roots` and `sign` on each realm record of `tools/content/data/world/history/cold_lands.json` (schema `tools/content/lib/history_schema.mjs`), with the added events and divergences named below.
**Companions:** [10_fallen_realms.md](../10_fallen_realms.md) (the Sunfields, adopted K64), [the Cold Lands dossier](../../../lore/regions/cold_lands.md), the vault note [Roots of the Cold Lands](../../../lore/vault/07%20-%20History/Roots%20of%20the%20Cold%20Lands.md), and the deep-past mechanic [deep_past.md](../../04_mechanics/deep_past.md) section 3.6.

## Rules this file keeps

- Yeldenne (YEL) is retired (K56); the town of Yeldenne and the silent castle lie in Pertolor's land, and Horos is story only, so he appears nowhere below.
- Kvittumm's sign and roots show only herds and the winter moot; nothing in this file hints at who sleeps in the ice of the far north-west.
- Who built the castle above Yeldenne, where the yeti came from and where the north-coast raiders sailed from stay open.
- Game text never names a fallen realm before its gate: the JSON prose says "the Sunfields" and "the old king's hall", and this file uses the gated names only where the lore documents already do.
- Dates before Aen are "long before Aen" in the data; no being is given an age.
- Every device is one bold emblem in few flat colours on a field with a hem, sewable as appliqué and embroidery; none uses letters, crosses, a real flag, a religious sign, a snowflake or any of the twelve gods' devices (heraldry spec 1.4 and 1.5).

## The signs at a glance

| Realm | Tag | Sign | Charge class | Root |
| --- | --- | --- | --- | --- |
| Coldor | CLD | the Ember-Horn: a bronze-bound horn with one red coal at its mouth, gold on night-blue | vessel | the coal carried from the last hall of the Sunfields |
| Melkgard | MLK | the Sworn Gauntlet: a closed black iron fist on storm-grey | gauntlet | Zorak's bargain with the Black Wind |
| Horidor | HOR | the Guide-Pole: a grey cairn with a red-ragged pole, on dark green | cairn | the road-wardens of the Neck |
| Fearno | FEA | the Bound Spears: seven spears bound with a red cord, on moss-green | weapon | the refusal on the river |
| Austklev | AUT | the Tusk of Vaestia: an upright spiral tusk, white on sea-red | tusk | the white whale that chose the harbour |
| Worlond | WRL | the Twin Firs: two black firs from one trunk, on gold | tree | the parting at Tarvak |
| Poloto | PLT | the Burned Oar: a white steering oar with a red blade, on deep blue | oar | the burning of the Necromancer's ship |
| Holdon | HLD | the Hand-Hide: a white yeti hand with a black human hand in its palm (black, not red, so it cannot read as a real-world red hand), on sea-green | hand | the Hunting Truce pressed in blood |
| Glimkit | GLI | the Crossing Lantern: a copper lantern with green panes, on black | lantern | Drik's lantern over the channel ice |
| Xison | XIS | the Akahew Chain: three black links in a row, on red | chain | the chain forged from dead riders' iron |
| Pertolor | PRT | the Black-Faced Ram: a white ram with black face and horns, on deep green | beast | the flock out of the whiteout |
| Omar | OMR | the Refusal Skull: a white reindeer skull with antlers, on black | skull (the region's one skull) | the skull sent to the old king's stewards |
| Portogalor | POT | the Keel-Hall: a black keel-up hull with red oar-ports, on white | ship | the raiders who would not sail home |
| Kvittumm | KVI | the Moot-Fire Herd: two white bulls across a red fire, on blue-grey | beast | the following of the herds and the moot of 2A 1312 |
| Orewele | ORW | the Falling Fire: a black star-stone with a red flame-tail, on pale grey | falling star | the sky-iron of the Orewell bog |
| Nivaros | NIV | the Frost-King's Maul: an upright banded stone maul, on ice-blue | hammer | the seat broken into the glacier |
| Yeti Lands | YEI | the Ice-Mark: one great white footprint, on sea-blue | print | the marks of the sung seal-grounds |
| Ghaahu | GHH | the Song-Whorl: one notched white spiral, on slate | spiral | the one song of every clan |
| Vindael | VND | the Wind-Feather: a white skua feather with three red bands, on storm-grey | feather | the shutting of Porideon |

No charge class appears more than twice (beasts twice, the ram and the reindeer), the skull appears once, and the fire appears only as a detail of Coldor's horn and Kvittumm's moot.

## Realm by realm

### Coldor (CLD)

**Roots.** The last fire-keepers of the Sunfields carried a coal of the old king's hearth into the first Long Dark in a clay-lined aurochs horn, and every clan that stayed relit its fire from it. The hearth-law (no feud past a shared fire, a dead fire relit only from the clan fire, the keeper feeds whoever reaches the fire) comes from that winter, Kolar fed the clans of the Hunger Winters at the horn's fire, and the Winter Crown is a crown of keepers whose authority is still the promise that whoever reaches the fire will eat.
**Sign.** The Ember-Horn, hung in the Frost-Hall and touched at every crowning since Queen Ilvra I in 4A 850; the clans' moot-cloths bore it before there was a crown.
**Added to the data.** Event "The Carrying of the Coal" (long before Aen); divergence `cld_horn_taken`.

**Focus branches (tree `coldor`).**
1. **The Keepers of the Coal** (beside "The Winter Crown of Fandanar"): the fire-keepers' council as a political route; spirit "The Hearth-Law" (stability, reduced war-support loss in winter), the decision "Carry the Coal" unlocked.
2. **The Granaries of the Horn** (extends "Winter Stores"): each granary raised at a clan seat adds a winter relief charge to the Long Winters mechanic and raises that clan's lean when spent.
3. **Kolar's Bread** (extends "Law of the Long Winter"): feeding a non-Accord clan in a bitter winter grants a temporary claim of hospitality usable only at the next winter moot.
4. **The Kindled North** (new terminal branch, mutually exclusive with "The Sun Crown"): the keepers' route to a north joined by the fire rather than by the old king's crown (formable below).
5. **The Horn Defended** (extends "The Winter Wall"): the horn moved to a hidden hearth when Fandanar is threatened; protects against `cld_horn_taken`.

**Formable: The Kindled North.** *Entitlement:* the horn's coal relit every clan fire of the north once, and the keepers say it may do so again. *Who:* Coldor. *Requirements:* the focus "The Kindled North"; the decision "Carry the Coal" completed for at least six clan realms (Horidor, Xison, Pertolor, Omar, Kvittumm and one of Fearno, Austklev or Holdon), each of which has been fed in a bitter winter and accepts the coal; the Ember-Horn in Fandanar; "The Sun Crown" not taken. *What changes:* cosmetic name "The Kindled North" on Coldor; the hearth-law spirit becomes a law of every member; the members become autonomous subjects by consent (no war), and any member may leave at a winter moot if the crown fails to open its granaries in a bitter winter.

**Events and decisions.**
- Decision **Carry the Coal** (Coldor; one clan realm per Long Dark; costs political power and a winter relief charge): a fire-keeper carries a coal from the horn to that clan's fire; the clan's event offers to relight from it (lean up, opinion up) or to keep its own fire (a small affront).
- Event **The Coal Goes Out**: if Fandanar is occupied while the horn is there, the coal dies; every clan realm's lean toward Coldor falls and a chain asks which clan fire the Frost-Hall will be relit from (that clan gains lasting favour).
- Event **The Fire-Keepers' Quarrel** (after the Sun Crown loop's first find): the keepers split between "the land was punished" and the finders who say the winters simply came; the choice steers between the Kindled North and the Sun Crown.

### Melkgard (MLK)

**Roots.** The Ormolak valley was raided from the Frozen Ocean coast for ages; in 2A 1779 Zorak went down into the windy cliff below Minnolomak and bargained with the storm the Storm Court calls the Black Wind, which Fandanar's fire-keepers call a devil, a corrupted servant who fled an Old God (belief, disputed, never confirmed). He forged the Sworn Gauntlet from a broken raider's keel-bolts, cut the Black Gallery, refused the Iron Crown that still hangs unworn there, and gave the march its laws: no crown, oaths sworn hand in gauntlet, a token for every wind that sinks an enemy, no bread not taken or earned.
**Sign.** The Sworn Gauntlet: burned on Zorak's pyre and taken out whole, worn by every warlord chosen over his predecessor's pyre.
**Added to the data.** Event "The Bargain in the Cliff" (2A 1779); divergence `mlk_gauntlet_lost`.

**Focus branches (tree `regional_isengard`).**
1. **Down into the Cliff** (after "The Old Refusal"): the Storm Court route; renewing the Black Wind's token gives a naval and coastal-defence spirit and a hidden counter of the wind's favour, with a risk event each time it is renewed.
2. **Hand in the Gauntlet** (extends "Oath-Brothers of the March"): oath-companies as a manpower law; each company sworn is a division template bonus and a loyalty check in defeat.
3. **The Unworn Crown** (extends "The Iron Crown of Isengard" spirit): a choice to keep the crown unworn (stability, defiance) or to wear it at last (a political-power surge, the oath-companies split: civil war chance).
4. **Zorak's March** (new branch after "Never Kneel"): bring the north coast and the border moor into the gauntlet (formable below).
5. **Tokens of the Wind** (extends "Watch on the March"): every enemy ship sunk adds a token; at five tokens a unique coastal-battle bonus.

**Formable: Zorak's March.** *Entitlement:* Zorak's first oath bound the whole north coast against the raiders, and the Black Gallery holds the tokens of every wind that defended it. *Who:* Melkgard. *Requirements:* "Zorak's March" focus; Portogalor and Omar sworn into the gauntlet (subjects by the decision "Swear into the Gauntlet") or held; the Black Wind's token renewed once; the Iron Crown still unworn. *What changes:* cosmetic name "Zorak's March"; every subject's chief is chosen over a pyre (succession events), Portogalor's keel-oath is set aside (its sealers become the march's fleet), and the defiance meter can no longer fall below its middle band.

**Events and decisions.**
- Decision **Go Down into the Cliff** (once per warlord): the Black Wind answers with favour (storm in the next naval battle on the north coast), demands a price (a warlord's son sent to the Gallery for a winter) or is silent; a Fandanar fire-keeper's letter calling it a devil can follow (opinion of Coldor falls).
- Decision **Swear into the Gauntlet** (Omar, Portogalor, Pertolor or a border clan): an oath-ceremony that makes the target a subject; Omar answers with the skull (see Omar).
- Event **The Gauntlet from the Ashes**: at each warlord's death the gauntlet is taken from the pyre; a rare outcome finds it cracked, opening a succession crisis.

### Horidor (HOR)

**Roots.** The Sunfields' road-wardens raised cairns and red-ragged guide-poles along the Neridor Gap for the clans walking south, under orders to keep them until the walkers came home; nobody did, and the wardens' children kept them anyway. From that come the cairn-due, the ban on pulling down a cairn even in war, the moot that keeps the road rather than the people, the cairn-names that are the clans' history, and the welcome of the Gunwyn clans as the walkers who never came back.
**Sign.** The Guide-Pole: the red rag on a pole over a cairn, Horidor's banner since the first moot of 2A 340, set by each new chief on the highest cairn.
**Added to the data.** Event "The Wardens' Cairns" (long before Aen); divergence `hor_cairns_pulled`.

**Focus branches (tree `regional_horidor`).**
1. **The Names of the Cairns** (after "Voices of the Cairns"): the cairn-names read as history; a research bonus to the Sunfields loop's guides and a stability spirit "The Road Remembers".
2. **The Walkers' Welcome** (new, links to "Highland Envoys"): Gunwyn treated as returning kin; opinion and a trade route, unlocking the Sunfields loop's "Kin over the Neck" for Horidor as well as Coldor.
3. **Raise the Guide-Poles** (extends "The Cairn Roads"): supply and attrition relief on the Neck Road states in winter, and a fort bonus at the Gap.
4. **The Wardens' Road** (new terminal, alternative to "The Cairn Crown"): the restored office of road-wardens over the whole Neck (formable below).

**Formable: The Wardens' Road.** *Entitlement:* the Sunfields' road-wardens kept the whole road from the Gap to the forest's edge, and Horidor's moot is their heir. *Who:* Horidor. *Requirements:* the focus; Worlond in Horidor's league or allied, with the Twin Firs standing; the Neck Road open three Long Lights running; Gunwyn's opinion above a threshold. *What changes:* cosmetic name "The Wardens' Road"; the cairn-due becomes a toll on the whole Neck (income); every Neck state counts as Horidor's for the Neck Road Compact; closing the Gap (`hor_close_gap`) costs less but is felt across both regions.

**Events and decisions.**
- Decision **Set the Guide-Pole** (each new chief): the ceremony; a whiteout outcome can kill the chief on the cairn and open an election.
- Event **A Cairn Pulled Down** (a hostile army in the Gap): the `hor_cairns_pulled` divergence; every Cold Lands clan's opinion of the offender falls.
- Event **The Walkers' Song** (Gunwyn envoy at Ollondo): a Gunwyn singer names a cairn the clans thought forgotten; a step toward the Sunfields loop's Three Names.

### Fearno (FEA)

**Roots.** In Fearno's telling the last king of the old hall called the clans to bring him their herds, and the moor clans of the Naepu bound their spears together on the river ice and refused; they lived while the hall died. From that come the belief that a crown eats first and feeds last, a first lord chosen only to speak and only for a term, stores open to every hungry neighbour, and the spear each lord lays in the bundle at the moot. The steadings repeated the refusal at Azenoalion in 4A 1304 and would refuse a Sunfields crown even if offered as their own.
**Sign.** The Bound Spears: seven spears, one for each steading that swore in 4A 1304, bound by a red cord the eldest lord ties and the first lord cuts.
**Added to the data.** Event "The Refusal on the River" (long before Aen); divergence `fea_cord_uncut`.

**Focus branches (tree `regional_fearno`).**
1. **The Spear-Binding** (after "The Hall of Many Lords"): the moot as a mechanic; each steading lord's consent counted, and a focus can be blocked by a lord's withheld spear (a small event chain).
2. **No Steading Hungry** (extends "Stores Against the Winter"): steading stores pooled; Fearno can feed its own and its neighbours in a bitter winter without Coldor (counter to Coldor's lean).
3. **Refuse the Sun Crown** (new, available when Coldor or Melkgard begins the Sunfields loop's last step): claims against the free steadings are answered by a war-support and defence spirit and a call to every free realm.
4. **The Bound North** (new terminal after "Call the Free Steadings"): the free clans' league (formable below).
5. **The Raiders' Banners** (extends "Wardens of Fearno"): the banners of 4A 1112 as a war trophy; a winter-warfare doctrine bonus against Melkgard.

**Formable: The Bound North.** *Entitlement:* the refusal on the river was the act of free clans together, not of one steading, and the bundle has room for more spears. *Who:* Fearno. *Requirements:* the focus; at least three of Omar, Xison, Kvittumm, Austklev or Pertolor lay a spear in the bundle (decision "Lay a Spear in the Bundle", their consent event); neither the Sun Crown nor the Kindled North formed; at peace with both crowns. *What changes:* cosmetic name "The Bound North"; a defensive league (faction) whose members keep their own governments, a first lord chosen among all members every seven years by an election event, and a rule that the league breaks if any member accepts a crown.

**Events and decisions.**
- Decision **Lay a Spear in the Bundle** (target a free clan realm): invitation to the league.
- Event **The Cord Uncut** (`fea_cord_uncut`): a first lord refuses to yield at the end of his term; choose to wait, depose him or let Fandanar or Minnolomak back him.
- Event **The River Tale** (when Coldor's fire-keepers send the Sunfields belief "the land was punished"): the steadings answer with their own telling; opinion falls and Fearno gains war support against any Sun Crown.

### Austklev (AUT)

**Roots.** The east coast was peopled from the sea: a storm-driven crew followed a white spear-whale through the Siroler pack to the water below the cliffs, where it beached; they built a hall of its ribs and swore the whale-oath over its tusk (no white whale hunted, the first catch to the sea, every whale to one harbour). The whale-tithe of 4A 612 and the rule that a jarl must have captained a crew grow from that oath, and the coast answers to its harbour because "the whale chose the harbour and no queen did".
**Sign.** The Tusk of Vaestia, upright beside the jarl's seat, flown on red sailcloth from the boom's winch-post since 4A 612.
**Added to the data.** Event "The Whale's Harbour" (long before Aen); divergence `aut_white_whale`.

**Focus branches (tree `shared_cold_lands`, a country-gated Austklev module).**
1. **The Whale-Oath** (after "The Steading Hall"): the oath as a law; a naval supply and stability spirit that breaks if `aut_white_whale` fires.
2. **The First Catch** (extends "Fishing Fleets"): a yearly offering decision with a good-season or poor-season roll.
3. **The Jarl Who Followed the Whale** (extends "The Elders Speak"): succession by captaincy; heirs must lead a voyage (an event that can kill or prove them).
4. **Whale-Fat for the Long Dark** (extends "Fires Through the Long Night"): trade of whale-oil to every Cold Lands realm, which raises Austklev's opinion and gives it a lever in bitter winters (K58: a whaling technology line of harpoons, try-works and ice-hulls).

**Formable:** none of its own; Austklev is a natural member of Fearno's Bound North.

**Events and decisions.**
- Decision **Give Back the First Catch** (each Long Light).
- Event **The White Whale Sighted**: a white spear-whale off Vaestia; a foreign whaler means to hunt it (stop it, buy it off, or let it happen and face `aut_white_whale`).
- Event **The Tusk Cracks** (rare, after a bad season): the jarl's authority is questioned by a moot of captains.

### Worlond (WRL)

**Roots.** The walkers of the Sunfields who went on south and the clans who could walk no further parted at the clearing of Tarvak, each planting a fir; the firs grew into one trunk, so that the forest belongs to both lands and neither may cut it. The Stage Law (fire, dry wood and fodder for any traveller from either side, and no forest man taking sides) comes from the parting, and the Hozening lords swear their office with one hand on each side of the Twin Firs.
**Sign.** The Twin Firs, sewn on the forest clans' fire-cloths before there was a lord and taken by Yorak Hozening in 4A 1214.
**Added to the data.** Event "The Parting at Tarvak" (long before Aen); divergence `wrl_firs_felled`.

**Focus branches (tree `shared_cold_lands`, a Worlond module beside "Steadings on the Neck").**
1. **The Stage Law** (extends "Toll-Posts on the Neck"): attrition relief and supply for any non-hostile army on the Neck, and a neutrality spirit that rejects military access to either side's enemy.
2. **The Oath Under the Firs** (extends "The Elders Speak"): succession by walking the whole road (heir event chain).
3. **Both Halves of One Tree** (new): balanced timber contracts with Coldor and the West; leaning to one side lowers the other's opinion.
4. **Charcoal of the Neck** (extends "The Smithies"): charcoal for Coldic and Gunwyn forges (K58: a forest-craft technology line).

**Formable:** a partner of Horidor's Wardens' Road, not a formable of its own.

**Events and decisions.**
- Decision **Swear Under the Firs** (new lord).
- Event **Fire in the Forest** (summer, repeatable): a burn like Hozoson's; the Twin Firs may be threatened (spend to save them).
- Event **Choose a Half** (in the last war, when the West asks for the whole cut): `wrl_timber_west` with the Stage Law's cost.

### Poloto (PLT)

**Roots.** The guild counts from two ships: the Aenoran post's ship of about 1A 310, whose Coldic pilot read the river ice and trained the guild's first pilots, and the Necromancer's ship of 3A 702, which Harbour-Master Zenka Grindair burned and pushed off the quay with the first pilot's oar. Older pilots add that the Fandan mouth was where the Sunfields' last sea-craft put out west. The harbour laws (no loading of the dead, a pilot or no protection, the harbour book of every ship and refusal, sell to all and bow to none) come from those ships.
**Sign.** The Burned Oar, the master's staff charred red on the night of the March of Bones, carried at the head of every harbour procession.
**Added to the data.** Event "The Pilot of the Post" (1A 310); divergence `plt_dead_ship`.

**Focus branches (tree `shared_cold_lands`, its "Free Towns" module with a Poloto layer).**
1. **The Harbour Book** (extends "Charters of the Towns"): a neutrality and trade spirit; every foreign navy using the port is recorded (opinion effects when wars end).
2. **The Pilots' Guild** (extends "The Harbour Wall"): river-ice pilots as a naval-supply and convoy bonus in winter months (K58: an ice-pilotage technology line).
3. **No Ship of the Dead** (new, available once the dead are abroad in the last war): the port's open stand against the dead; ties into `plt_dead_ship`.
4. **Fandhavn Stays Free** (extends "A League of Free Towns"): resist `plt_crown_port` with the guild's purse.

**Formable:** none; Poloto's identity is its freedom.

**Events and decisions.**
- Decision **Read the River Ice** (each thaw): open the harbour early (trade gain, wreck risk) or wait.
- Event **The Red Line in the Book** (anniversary of 3A 702, once): a visiting southern priest asks to see the entry; the port's memory raises war support against the dead.
- Event **A Ship Asks for the Dead** (rare, last war): `plt_dead_ship`.

### Holdon (HLD)

**Roots.** After the Sunfields broke, the coast clans and the shelf yeti fought the Red Ice for the seal-grounds until in 2A 1288 the Eldest came alone to the snowline at Fentene, an old Sunfields market-ground, and pressed its hand in seal-blood on a hide; the eldest chief pressed his own hand inside it. The fair-peace, the withdrawal rule on the seal-grounds, the goblins' welcome and the judging of every king by his fair come from the Hand-Hide, which each Grindair king renews.
**Sign.** The Hand-Hide: the fair-pennant raised while the peace holds, the kingdom's banner since 4A 1120.
**Added to the data.** Event "The Red Ice" (2A 925); divergence `hld_hide_burned`.

**Focus branches (tree `shared_cold_lands`, a Holdon module beside "Markets for All Comers").**
1. **The Fair-Peace** (new): the snowline fair as a yearly event chain with a fair score; a good fair raises the yeti pact and the king's legitimacy, a bad one lowers both.
2. **Renew the Hand-Hide** (succession): each new king's first fair (event with a chance of the Eldest refusing).
3. **Between Springs and Shelf** (extends "Hearth Law"): arbitration of the springs quarrel with Glimkit by grain for grazing.
4. **Envoys of the Hand** (new): Holdon as the only crown that can carry another crown's envoy to the shelf Eldest (a diplomatic service sold to Coldor or Melkgard).

**Formable: The Fair-Kingdom of Fentene.** *Entitlement:* the Hand-Hide binds men and yeti in one peace, and the yeti once came to the fair as equals. *Who:* Holdon. *Requirements:* ten good fairs in a row; the Yeti Lands' Eldest presses its hand on a new hide (event, needs the yeti pact at its top band); Glimkit at peace with Holdon. *What changes:* cosmetic name "The Fair-Kingdom of Fentene"; the Yeti Lands become a protected partner (not a subject) with a joint defence of the shelf, and Holdon's king gains a seat in the Eldest's Fire (a yearly event).

**Events and decisions.**
- Event **The Fair at Fentene** (each Long Light): the fair's outcome.
- Event **The Hide Burned** (`hld_hide_burned`).
- Decision **Go Alone to the Snowline** (only after the hide is lost): the king walks out alone to the Eldest; success restores the truce, failure kills him.

### Glimkit (GLI)

**Roots.** Driven north by the wars of the Long Grief around 2A 1000, a goblin column reached the frozen Coldor Channel in the Long Dark; the lamp-keeper Drik saw the steam-plume of the great spring of Agoron and led them over the ice by a lantern closed with horn panes, and those who lost sight of it froze. The Warren Luck (a lantern in every warren lit from Drik's, a warren doomed while its lantern is out, the springs as the mountain's breath, no goblin on open snow without a lantern-bearer) comes from the crossing, and the warrens obey the lantern-keepers more than the hobgoblin chief.
**Sign.** The Crossing Lantern, hanging in the hall of the great spring at Drikzig; its shape marked the goblin trappers at the first fair of 2A 1290.
**Added to the data.** Event "The Lantern Winter" (3A 1092); divergence `gli_lantern_out`.

**Focus branches (tree `shared_cold_lands`, a goblin module; a regional tree `regional_glimkit` is the better home if the owner wants one).**
1. **The Lantern-Keepers** (replaces the steading-hall politics for goblins): the keepers as the real council; the chief's decisions can be overruled.
2. **The Mountain's Breath** (new): the springs as a state modifier; protecting them gives winter attrition immunity in the valleys.
3. **Traps and Lamps** (extends "The Smithies"): goblin traps for forts and night fighting sold to one crown (K58: a goblin trap-craft and lantern-glass technology line).
4. **Bone-Hound Riders** (extends "The Clan Host"): summer cavalry with a winter penalty.
5. **Light a Warren** (new): lanterns lit from Drik's carried to goblins elsewhere in the north (Holdon's springs); a quiet expansion by settlement rather than war.

**Formable:** none; the warrens join no league.

**Events and decisions.**
- Event **A Lantern Goes Out** (repeatable, low chance): a warren must be relit from the hall (cost, or lose the warren's state output for a year).
- Event **Drik's Lantern Threatened** (war in the valleys): `gli_lantern_out`.
- Decision **Sell Lanterns to a Crown**: the `gli_sell_melkgard` and `gli_open_valley` paths with the lantern's price.

### Xison (XIS)

**Roots.** The uplands were the Sunfields' amber road, and the upland clans descend from its carriers. After both crowns' riders burned the waystations in 4A 895, the three clans forged a chain at Akahew in 4A 902 from the stirrup-iron and bridle-iron of the riders who had died on their road and stretched it across the road on two posts. Each clan keeps its stretch, tolls are shared, only the speaker lifts the chain, and crown wagons pay like any carter.
**Sign.** The Akahew Chain, three links for Xison, Rion and Yeneldmore; the speakers' seal keeps the Esroming reindeer.
**Added to the data.** Events "The Amber Road" (long before Aen) and "The Burning of the Stations" (4A 895); divergence `xis_chain_cut`.

**Focus branches (tree `shared_cold_lands`, a Xison module beside "Sledge Tracks").**
1. **Lift the Chain** (new): military access as a moot decision; armies that pass without leave trigger `xis_chain_cut`.
2. **The Three Links** (extends "The Clan Moot Sits"): the three clans' speakers rotate; each speaker favours a different trade (amber, hides, tolls).
3. **The Amber Road** (extends "Furs and Iron"): amber trade to the west coast and the West Lands.
4. **The Toll Unbowed** (new): reopen the 4A 1360 toll quarrel with Coldor, winning back a full toll or a seat at the Frost Moot (`xis_crown_road`).

**Formable:** member candidate of Fearno's Bound North.

**Events and decisions.**
- Decision **Lift the Chain for an Army** (request from any crown).
- Event **The Chain Cut** (`xis_chain_cut`).
- Event **Amber from the Old Road** (rare): an amber necklace from a cairn on the moor holds a bronze clasp of the Sunfields (a small step for the deep-past finds).

### Pertolor (PRT)

**Roots.** A shepherd clan of the Sunfields lost its flock in a whiteout, and in the thaw the flock came down out of the valley of Mp'E behind a black-faced ram; the clan settled where the ram stopped and has paid the ram's due ever since, a loaf and a fleece left each Long Light at the start of the Silent Road beyond the town of Yeldenne. Nobody of the vale walks the Silent Road, the black-faced rams are never sold, and the town of Yeldenne below the silent castle, in the vale's land since K56, is treated as kin and never taxed. The vale keeps faith with whatever feeds it and asks no questions of the high ground.
**Sign.** The Black-Faced Ram, first stitched on the cloth in which the due is carried, hung over the wool-market at Minsentia in 4A 760.
**Added to the data.** Event "The Flock out of the Whiteout" (long before Aen); divergence `prt_due_unpaid`.

**Focus branches (Pertolor has no tree of its own; proposed: a Pertolor module in `shared_cold_lands`, and the retired `regional_yeldenne` content folded into it where it concerns the town).**
1. **The Ram's Due** (new): the yearly due as a decision; paid, it keeps a stability spirit "Faith with the High Ground"; unpaid, `prt_due_unpaid`.
2. **Cousins to Both Crowns** (extends "Between the Two Halls"): the marriage politics of the Hozening lords; each crown's marriage offer as an event.
3. **The Black-Faced Line** (extends "Furs and Iron"): wool and mutton exports; a supply bonus to whichever crown the vale favours.
4. **The Town Below the Castle** (new): Yeldenne's town as a protected place; its headman's counsel.
5. **Wardens of the Silent Road** (gated by `zin_horos_dead`): what the vale does when the hall above Yeldenne falls silent for good (restorable identity below).

**Restorable identity: Wardens of the Silent Road.** *Entitlement:* the vale has paid the due and kept the road unwalked for longer than any crown has existed, and the town of Yeldenne is its kin. *Who:* Pertolor, only after `zin_horos_dead`. *Requirements:* the ram's due never left unpaid in the campaign; the town of Yeldenne's state owned; the focus "Wardens of the Silent Road". *What changes:* the title "Wardens of the Silent Road" on the lord; the vale guards the empty hall (a defensive spirit in the Mp'E states); a closed event chain lets the wardens decide whether anyone may walk the road now (story-gated, never naming what was there before the gate).

**Events and decisions.**
- Decision **Carry the Ram's Due** (each Long Light).
- Event **The Due Untouched** (rare): the loaf and fleece are still there in the next Long Light; the shepherds are frightened, and only an offering of the best ram settles them (no explanation is ever given).
- Event **Two Weddings** (Melkgard and Coldor both propose): `prt_choose_crown` with the ram's cloth unquartered or quartered.

### Omar (OMR)

**Roots.** In the last winters of the Sunfields the Omar forebears ate one bull at their own fire and sent its skull and antlers back on a sledge to the old king's stewards: the clan had eaten its own and owed nothing. They wandered with that refusal as their only law until Kerdok built Vaesdeon on the border moor in 2A 1520; a chief must spend a winter alone on the moor, and every debt is cut on the antler-tally in the hill-fort. The skull went to Melkgard in 4A 1150 for the same reason, and the tally now shows a debt to each crown.
**Sign.** The Refusal Skull, over the gate of Vaesdeon and on the shields of the siege of 4A 1412; the notched hem copies the tally.
**Added to the data.** Event "The Skull to the Stewards" (long before Aen); divergence `omr_tally_cleared`.

**Focus branches (tree `shared_cold_lands`, an Omar module beside "Between the Two Halls").**
1. **The Antler-Tally** (new): the clan's debts to Coldor and Melkgard as two counters; gifts raise them and repayments fill them.
2. **A Winter Alone** (succession): the heir's lone winter as an event that can kill, harden (a leader trait) or break him.
3. **Send the Skull** (new, a reaction to an oath demand): a war-support and defence spirit and a guaranteed answer to "Swear into the Gauntlet".
4. **Pay Neither** (extends "Our Own Snow"): keep both debts open as leverage; each crown's lean is capped while the debts stand.

**Formable:** member candidate of Fearno's Bound North.

**Events and decisions.**
- Decision **Fill a Notch** (repay one crown in kind).
- Event **The Tally Cleared** (`omr_tally_cleared`).
- Event **The Skull Sent a Third Time**.

### Portogalor (POT)

**Roots.** The sealers descend from the north-coast sea-raiders whose songs begin at sea and say only that something in the far north was worse than any wind (Fandanar's belief that they fled the country of the dead is neither confirmed nor denied). When the last fleet broke at the Gulf of Minnolomak in 3A 410, Ulvar Azlak turned the last hulls keel-up as halls so that nobody could sail back. Keel-roofed halls, buried and never burned hulls, the new captain's night under the first keel, and raiding remembered with pride and forbidden by law come from that night.
**Sign.** The Keel-Hall, painted in pitch on the sealskin raised over the beach to tell Melkgard's watchers the raiders had come to stay; the red oar-ports are the oars burned that night.
**Added to the data.** Event "The Keel-Halls" (3A 411); divergence `pot_keel_launched`.

**Focus branches (tree `shared_cold_lands`, a Portogalor module beside "The Cold Coast").**
1. **Under the First Keel** (succession): the captain's night; a bad omen can bar a candidate.
2. **The Raiders' Oath** (new): the law against raiding as a spirit (stability, trade with Melkgard) that the realm can break.
3. **Launch the First Keel** (new, last war): the raider route (`pot_keel_launched`, K59's raider realms): a naval-raiding spirit and a lasting reputation cost.
4. **Bear-Mantles** (extends "The Clan Host"): the Bear Winter's captains as elite coastal troops.

**Formable: Azlak's Fleet** (dark route). *Entitlement:* the sealers are the raiders' heirs, and the keels are still there. *Who:* Portogalor. *Requirements:* "Launch the First Keel"; three naval raids carried out; Melkgard at war or humbled. *What changes:* cosmetic name "Azlak's Fleet"; raiding becomes a decision category, the coast's trade with Melkgard and Coldor ends, and the keel-oath cannot be restored for the rest of the game.

**Events and decisions.**
- Event **What the Songs Do Not Say** (rare): a sealer brings back a carved prow-beast from the far ice; the fire-keepers' belief is spoken aloud, and the lord chooses whether to burn, bury or keep it (the open question stays open in every outcome).
- Decision **Bury a Hull** (when a ship is lost): a small stability gain.

### Kvittumm (KVI)

**Roots.** When the Sunfields' fields failed, the forebears of the reindeer clans followed the herds north-west into the ice country and learned from them how to live there; the herd's law (the people move with the herd, no fenced grazing, a herdless clan taken in) is the oldest law of the far north-west. The moot's law is younger: in 2A 1312 the Frost-King would treat with one voice only, so the clans brought one reindeer each to the moot-fire at Esrom and swore to speak as one. The clans know the oldest reindeer roads and where the ice gives back old timbers and bronze, which they carry to the fire-keepers and never sell.
**Sign.** The Moot-Fire Herd, stitched on the hide spread before the moot-chief, which the toll-peace envoys carried to Xitore.
**Added to the data.** Event "The Following of the Herds" (long before Aen); divergence `kvi_moot_split`.

**Focus branches (tree `shared_cold_lands`, its "Far Edge of the World" module with a Kvittumm layer).**
1. **The Herd's Law** (extends "The Elders Speak"): herd size as a stability and manpower source; a bad calving year event chain.
2. **One Voice at the Fire** (extends "The Clan Moot Sits"): the moot's unity counter; below its floor, `kvi_moot_split`.
3. **Guides to the Old Halls** (already in the deep-past spec): the clans' knowledge of the reindeer roads raises the odds of every ice-walk.
4. **The Toll-Peace Kept** (extends "Kin of the High Snows"): good relations with Nivaros; a share of the giants' counsel in ice-walks.

**Formable:** member candidate of Fearno's Bound North; Kvittumm keeps to the herds and is never the seat of a formable.

**Events and decisions.**
- Event **The Year Without Calves** (repeatable in bitter winters): the 4A 1095 precedent; the clans go south to Guerlon or ask a crown for help.
- Decision **Bring a Find to the Fire-Keepers** (after a find): the deep-past find's handover to Coldor, raising opinion.
- Event **The Moot Splits** (`kvi_moot_split`).

### Orewele (ORW)

**Roots.** In the Night of the Falling Fire, a burning stone came down over the far north-west and struck the Orewell lowland, where the bog has run red since; herders who followed the light found black iron that took an edge no bronze could match and stayed to dig it. The giants call the lowland the place where the sky broke and take their toll there in iron; the iron is dug with thanks at the shaft-head, the first bloom of each smelting goes back to the bog, and no weapon is forged for a crown that has not paid for the ore. Brundahrim's factors chartered Guerlon in 4A 1302 because the ore smelts truer than any other in the north.
**Sign.** The Falling Fire, scratched over every shaft-head and stamped by the dwarves on every ingot of Orewell ore.
**Added to the data.** Event "The Night of the Falling Fire" (long before Aen); divergence `orw_deep_red`.

**Focus branches (tree `shared_cold_lands`, an Orewele module beside "The Smithies").**
1. **Thanks at the Shaft-Head** (new): the customs as an industry spirit; breaking them (forcing the first bloom into a forge) raises output and risks unrest.
2. **The Sky-Iron** (new, K58): a regional technology line, "Orewell sky-iron" (better infantry and support equipment for buyers who hold an ore contract).
3. **The Factor-House** (extends "The Trading Post"): the dwarf factors as a trade partner; the `orw_dwarf_hold` risk when debts mount.
4. **The Deepest Red Water** (new): `orw_deep_red`, the choice of one buyer.

**Formable:** none; the lowland's fate is to be bid for.

**Events and decisions.**
- Decision **Sell the Season's Ore** (each Long Light): to Brundahrim, Coldor or Melkgard.
- Event **The Pumps Break** (the 4A 1677 precedent repeated): the dwarves will mend them for a share of the mines.
- Event **A Stone from the Sky** (very rare): a shooting star over the far north-west; the miners take it as the sky's favour (an output bonus), and the giants send to ask what the clan saw.

### Nivaros (NIV)

**Roots.** The ice giants say the snow breathes in and out over the ages; when it breathed out over the Fandan meadows they did not go down before it, because the first Frost-King of the cairn-keepers' song broke the glacier with a stone maul to make the seat at Xitore and taught them to stay where the ice is. The Frost-King is chosen and never born, a stone is laid for every winter a giant lives and no giant tells a man the height of any cairn, the heights are shut to arms, and passage is never free. The giants of Hirolon share their speech and stones, and the cairn-keepers say only that the two peoples knew each other once.
**Sign.** The Frost-King's Maul, laid across each Frost-King's knees at his enthronement, with an iron band added for each who keeps the toll-peace.
**Added to the data.** Event "The Seat in the Ice" (long before Aen); divergence `niv_maul_raised`.

**Focus branches (tree `regional_titanos`).**
1. **The Seat in the Ice** (after "The Frost-King's Hall"): the enthronement as a succession event chain run by the cairn-keepers.
2. **The Snow's Breath** (extends "Memory of the Giants"): the giants' counsel to ice-walkers (the deep-past hook) and a winter-warfare spirit for allies.
3. **Nothing Given Unpaid** (extends "The Toll Roads"): toll income from every crossing army or herd; free passage is impossible by law.
4. **Raise the Maul** (extends "Giants Against the Dark"): `niv_maul_raised`, the giants' march south against the dead.
5. **Stones for Hirolon** (new): an envoy chain to Hirolon in the Middle Lands, if both giant realms exist; the two cairn customs compared (no ages are told).

**Formable:** none; the giants keep their own realm.

**Events and decisions.**
- Event **A Frost-King Chosen** (succession).
- Decision **Lay the Toll-Stone** (a crown pays for a passage season).
- Event **The Band Added** (a Frost-King who kept the peace dies): an iron band added to the maul; a good omen for the toll-peace.

### Yeti Lands (YEI)

**Roots.** The shelf yeti do not tell where they came from. In the songs of Haruhu the first thing on the shelf was the Hum, answered at dusk by every clan so that the mountain knows the clan is there; a clan without a song is lost. After the Red Ice with the coast clans, the Eldest sang the hunting truce at Fentene in 2A 1288, and the clans have cut a great footprint at the edge of every seal-ground that is theirs ever since. The Eldest's Fire, the singer whose song carries furthest, and the rule that only a shelf Eldest may vouch for a stranger to the high snows come from the truce.
**Sign.** The Ice-Mark: the footprint the yeti call the mark that says this ice is sung for, hung on the oldest hide at the Eldest's Fire in Ghaumbhu.
**Added to the data.** Event "The First Ice-Mark" (2A 1289); divergence `yei_mark_crossed`.

**Focus branches (tree `regional_yeti_lands`).**
1. **The Hum Answered** (after "The Eldest's Fire"): the dusk song as a stability source; a clan falling silent is an event.
2. **The Ice-Marks** (extends "The Hunting Truce"): seal-grounds as states with marks; a crossing triggers `yei_mark_crossed`.
3. **Sung, Not Sworn** (extends "The Old Truces"): treaties with men count only once sung at the fair; a diplomatic spirit that makes agreements slow and unbreakable.
4. **Vouch for an Envoy** (extends "Trackers for the Crown"): the `yei_vouch` divergence as a decision.

**Formable:** partner in Holdon's Fair-Kingdom of Fentene.

**Events and decisions.**
- Decision **Vouch for an Envoy to the Heights**.
- Event **The Marks Crossed** (`yei_mark_crossed`).
- Event **A Clan Falls Silent**: a yeti clan stops answering the Hum; the others search for it (it may be found, lost to a bear winter or found sheltering with the goblins).

### Ghaahu (GHH)

**Roots.** The height clans hold that every clan's song is one turn of a single song begun before the clans, and that a broken-off song waits to be taken up; that is why they sang a year of dusks for the clan buried in 4A 1515 and gave its turn to another clan. They follow wild herds, live in song-caves and keep no truce with men, who are "a turn not yet sung"; the one envoy of 4A 1270 brought back a horn wound with the spiral of the song, and since the hunters lost in 4A 1650 no man has been received at Huummal.
**Sign.** The Song-Whorl, carved on horn, bone and cave walls, painted beside Huummal's mouth and on a height clan's breast before war.
**Added to the data.** Event "The Turn Taken Up" (4A 1516); divergence `ghh_song_given`.

**Focus branches (tree `regional_yeti_lands` covers the shelf; proposed: a Ghaahu layer in the same tree, gated by country).**
1. **The One Song** (new root for Ghaahu): the song as the realm's law; a broken turn is a stability debt until taken up.
2. **The Closed Snows** (extends "The White Silence"): the heights shut to men; any army without height guides suffers heavy attrition.
3. **A Turn for the Sung** (new): `ghh_song_given`, the reward for a crown that kept faith with the shelf.
4. **The Avalanche Song** (new): mourning as a mechanic; losses in war are sung for, which raises war support against the killer.

**Formable:** none.

**Events and decisions.**
- Event **The Envoy at Huummal** (after a shelf vouching): received or turned away.
- Event **A Turn Broken** (a clan lost in war or avalanche).

### Vindael (VND)

**Roots.** The sealers of the wind-isle descend from the Sunfields' seafarers who stayed on the ice arm when their kin went west. In the First Age the island league leased Porideon as a watering-place and taught the arm its ship-shares and harbour book; when the league's ships brought the Grey Breath north early in the Second Age, the sealers cut them loose on a gale and shut the harbour for nine years, and the arm did not empty. Wind-tokens, the season of waiting for a ship from a sick harbour, ship-shares and the Speaker's book of every ship let in and turned away come from that shutting.
**Sign.** The Wind-Feather, a skua feather banded for the gales a crew has come through; the first council's feather hangs over the harbour book.
**Added to the data.** Event "The Shutting of Porideon" (2A 85); divergence `vnd_harbour_shut`.

**Focus branches (tree `regional_windwaith`).**
1. **The Harbour Book** (extends "The Speaker's Seat"): every ship let in or turned away recorded; a quarantine law that blocks disease and spy events.
2. **Wind-Tokens** (extends "The Windward Harbours"): crews' tokens given to the towers; a naval morale bonus that grows with gales survived.
3. **The Old Lease** (extends "Charts and Soundings"): Porideon's place in the league's northern road; joins the deep-past Sea-Roads loop (`zin_deep_sea_roads`) as the harbour any relighting of the northern road needs.
4. **Shut the Harbour** (new, last war): `vnd_harbour_shut` as the neutral route.

**Restorable identity: The Northern Water of the Sea-Roads** (gated by the Sea-Roads loop). *Entitlement:* Porideon was the league's northern harbour and the one that did not empty. *Who:* Vindael. *Requirements:* the Sea-Roads loop's league charts recovered by Adel or Nondondor; a Norrai Pilotage compact standing; a decision "Open the Old Lease". *What changes:* the title "Keepers of the Northern Water" on the Speaker; Vindael becomes the restored league's northern harbour (a trade and naval-supply bond with the league's restorer), never a subject.

**Events and decisions.**
- Event **A Sick Ship off the Headland** (repeatable): turn it away, make it wait a season, or let it in.
- Decision **Open the Old Lease** (Sea-Roads loop).
- Event **The Feather's Last Band** (a famous crew lost): the wind-towers mourn; morale and opinion of the pilots' isles.

## Counts

- Focus-branch proposals: 82 (Coldor 5, Melkgard 5, Horidor 4, Fearno 5, Austklev 4, Worlond 4, Poloto 4, Holdon 4, Glimkit 5, Xison 4, Pertolor 5, Omar 4, Portogalor 4, Kvittumm 4, Orewele 4, Nivaros 5, Yeti Lands 4, Ghaahu 4, Vindael 4).
- Formable or restorable identities: 8 (the Kindled North, Zorak's March, the Wardens' Road, the Bound North, the Fair-Kingdom of Fentene, Wardens of the Silent Road, Azlak's Fleet, the Northern Water of the Sea-Roads).
- Event and decision proposals: 55.

## Owner choices

The questions below are recorded in the vault's Open Questions: whether the Black Wind is a devil or a storm spirit, whether the north-coast raiders fled the country of the dead, whether the giants of Nivaros and Hirolon were once one people, whether Glimkit and Pertolor should get regional trees, and whether the Kindled North and the Sun Crown should exclude each other.
