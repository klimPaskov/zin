# Realm roots: the East Lands

**Status:** Proposed under decision K67 (owner, 25 October 2026). Nothing here is established canon; every root and sign is labelled `proposed` in [east_lands.json](../../../../tools/content/data/world/history/east_lands.json), which holds the full texts. The play hooks are design proposals for the focus, decision and event owners and are not yet accepted design.
**Companions:** [10_fallen_realms.md](../10_fallen_realms.md) (Tarkia and the Kalioth Crown, adopted K64), [eastern_kings.md](../../04_mechanics/eastern_kings.md) (the eastern mechanic), [docs/lore/regions/east_lands.md](../../../lore/regions/east_lands.md) (the dossier), and the vault note [Roots of the East Lands](../../../lore/vault/07%20-%20History/Roots%20of%20the%20East%20Lands.md).

## Ground rules for builders

- **No new tags.** Every identity below is a cosmetic identity (`set_cosmetic_tag`) on the realm's existing tag, with its own banner drawn from the sign's story.
- **Claims, never free cores,** and only on land the roots say the realm or its ancestors truly held.
- **The adopted restorations stand and are not duplicated:** Alerhia as Tarkia (the Bridge Kingdom) and Erco as Rhabtarkia (the Kalioth Crown) are defined in the K62 addendum, section 6.6. The identities here are different identities or lead into those.
- **Gates.** Fallen realms are named in game text only behind their knowledge gates; dates before Aen appear only as "long before Aen"; the Deliverer's temples stay Afrit's in secret.
- **Audiences (K61).** Events go to the realm, the realms its roots bind it to, and neighbours by minor report; none is world news.
- **The Kalioth thread.** Several eastern roots meet in the Kalioth Crown (Noris's locked wells, Stabilo's false ox, Drak's broken collars, Plutondo's glass shares, Mostok's Knife-Ground, Azano's unpaid tally, Obmi's fever road, Pornivior's devils' road). A shared flag, `zin_kalioth_memory_<tag>`, should record which realms have learned their own part, so that Erco's diadem route (K62 6.4) can read who will resist it.

## The realms

### Noris (tree `noris`)

**Roots.** The desert tribes were the drovers of the Bridge Kingdom, then the water-bearers of the Kalioth Crown, whose water-masters locked the wells with iron lids; after Dardan the tribes broke the lids and swore that water would never belong to one man, which is the Well-Oath, the Seven Wells dug in common and the king chosen by the well-lords.
**Sign.** An upright rider's lance with a water-gourd hung beneath the blade: Qasud ben Melar ended the War of the Eighth Well by offering water from the Seven Wells on his lance, and no rider follows a king whose gourd the well-lords will not fill.

**Focus branches** (new branches for the 112-focus tree):
1. *The Broken Lids.* Discover the iron well-lids kept at the Seven Wells; rewards a national spirit for water-sharing supply in desert states and unlocks the Kalioth-memory flag; links to Erco's diadem route as an opponent (`zin_opinion_old_tribute` deepened).
2. *The Gourd Is Filled.* A war-preparation chain where the well-lords fill or refuse the gourd: each focus needs a well-lord approval check (stability and tribe opinion), and success grants a temporary war spirit; refusal blocks offensive war goals for a year.
3. *Kin by Water.* Diplomacy branch: offer water-kinship to Wahatud, Woqood and Naamis (the other Well-Oath peoples) for non-aggression and guaranteed passage; unlocks the "Shared Wells" decision.
4. *The Riders Without Engines.* Make the Powder Refusal a doctrine choice: a cavalry and raiding line (attrition and supply raids) that is mutually exclusive with the existing powder adoption, so that scorning powder is a real path and not a lack of one.

**Identity.** *The Well-Kingdom of the Seven Tribes.* Entitled by the Seven Wells, dug in common after the Unlocking. Noris alone. Requires the Shared Wells decision taken with at least two Well-Oath peoples, all desert well states owned, and the Powder Refusal kept. Changes: cosmetic name and the gourd-lance banner on white; a water-kinship spirit that lowers attrition for every army in a kin realm's desert states; claims on the Noris Wadi oasis states only.

**Events and decisions.**
- Event "An Empty Gourd": if stability falls below a constant, the well-lords refuse to fill the gourd before a war; options to give up the war or call a well-moot (political power and a stability test).
- Decision "Shared Wells": sign water-kinship with one Well-Oath realm (political power; both gain the kin opinion and transit).
- Event "The Lid in Erco's Hall": when Erco wears the diadem, Noris learns the Kalioth wore its water-masters' iron and gains a war goal against it.

### Stabilo (tree `stabilo`)

**Roots.** The bronze towns' weighers kept the King's Measure of the Bridge Road, a bronze ox; they sent the Kalioth kings a false ox of lead and hid the true one, so the caravan princes hold that an honest weight between partners is holy and that a weight given to a tyrant may be false.
**Sign.** A crouching bronze ox with a lifting ring: the Measure itself, drawn out for the first weighing of the Gold Road, on which every Prince of the Scales swears.

**Focus branches:**
1. *The Measure Shown.* A Hall of Scales branch: the yearly showing of the Ox becomes a trade event with a temporary trade and consumer-goods modifier; a later focus lets the Prince lend the Ox to a weigh-house of another court (Mostok, Kersian, Azano), binding it to Stabilo's sphere.
2. *The Lead Ox.* A covert-diplomacy branch rooted in the false ox: false weights for enemies (tribute paid to an overlord counts less), unlocked only while Stabilo is a subject or tributary; a scandal risk if discovered.
3. *Weighed Against the Ox.* A reform of the bench of houses: houses that borrowed from the Deliverer's temples are weighed at the Ox; choosing to expose them splits the bench (existing divergence `stabilo_bench_splits`) but removes the hidden debt modifier.
4. *Pontoseno.* A knowledge gate: the ledgers' name for the old bridge, learned by research of the Hall's oldest tallies; grants a trade bonus with Alerhia and Delbiz and a role in Alerhia's Bridge Kingdom ambition as the keeper of its weights.

**Identity.** *The Principality of the Measure.* Entitled by the King's Measure, older than any eastern crown but Alerhia's stair. Stabilo alone. Requires the Ox lent to two other courts' weigh-houses, the Gold Road states owned or allied, and no temple debt. Changes: name and the ox banner; the Measure spirit (trade, factory output in towns on the Gold Road); Stabilo becomes the guarantor of weights in Alerhia's Tarkia ambition, which then needs Stabilo's consent instead of a stability test.

**Events and decisions.**
- Event "The Ox Is Weighed": yearly; a small chance the city's standard is found false, starting a hunt for the cheat among the houses.
- Decision "Lend the Measure": send the Ox's copy to a junction city (political power, opinion, sphere).
- Event "A Lead Ox in Barzoth": if Erco opens the wall, the miners find a lead ox among the Kalioth treasures, and Stabilo learns why its forefathers were never punished.

### Alerhia (tree `regional_alerhia`)

**Roots.** The primary shadow of Tarkia: after the Breaking the valley raised a stair above the flood and crowned the man who carried the first stone; its scribes keep the empty line of the old title, and it refused the Black Tribute in 1A 1214.
**Sign.** A white stair of five steps with a river-king's crown on the top step.

**Focus branches** (the tree's existing "Read the First Stair" leads into these):
1. *The Empty Line.* The scribes reveal the title they never write; a gated chain that unlocks the Tarkia ambition of the K62 addendum earlier but costs opinion with the Free Crowns if pursued while the coalition forms.
2. *The Stair Below the Gods.* Internal law: the king who keeps the valley in a flood (a flood-season event) gains legitimacy; a king who flees loses the crown to the scribe-council (a regency).
3. *The Burned Hulls.* Refusal politics: a branch that lets Alerhia refuse a foreign claimant (the King of the East or the diadem) with a bonus to defence and to the Free Crowns' opinion, rooted in 1A 1214.
4. *Five Steps Above the Flood.* Building and flood control along the river (infrastructure and agriculture in valley states); the sixth step is a late-game monument focus that requires surviving a great flood event.

**Identity.** None of its own beyond the adopted *Tarkia, the Bridge Kingdom* (K62 6.6); the branch above is its door.

**Events and decisions.**
- Event "The Flood Season": a recurring flood test of the king (stay, or leave the valley).
- Event "Black Sails at the River Mouth": when the eastern coalition asks for the river fleet, the 1A 1214 refusal is quoted back; options follow the existing divergences `alerhia_crosses_rift` and `alerhia_closes_river`.
- Decision "Write the Empty Line": the scribes write out the title (only after the Bridge Road is raised); unlocks the restoration's last step.

### Naamis (tree `regional_gondolin`)

**Roots.** The north coast harbours gave Volgan ships and none returned; the harbour-mothers rebuilt and swore that no fleet would sail for a foreign lord on a man's word, which is why a queen rules with ship-masters who may refuse her ships.
**Sign.** The Returning Ship, double-prowed and mastless, which rows out to the North Mouth every year.

**Focus branches:**
1. *The Rowing to the North Mouth.* A yearly rite chain; completing it gives the queen's legitimacy and a navy morale spirit, and it is the first place the black ships of the Kusmeel are seen from the coast.
2. *The Mothers' Oath.* A naval-law branch: the council of ship-masters must vote any foreign expedition; a strong-council route (refusal possible, defensive bonuses) against a queen's-word route (faster mobilisation, legitimacy risk).
3. *The Debt to the Clans.* A Woqood branch building on the Ice Winter: watch-fires on the snow coast, shared sealing fleets, and the Woqood alliance or protectorate (existing divergence `woqood_joins_naamis`).
4. *Ships for the Coalition.* The existing choice to carry the coalition (`naamis_carries_coalition`) made heavy by the oath: the queen must break the mothers' oath, which starts a council crisis.

**Identity.** *The Sea Crown of the Mothers.* Entitled by the harbour-mothers who rebuilt the coast. Naamis. Requires the Rowing completed three times, the Woqood clans allied or protected, and no fleet sent for a foreign lord. Changes: name and the Returning Ship banner; convoy and coastal defence bonuses on the Kusmeel coast; a claim on the Woqood coast only by the clans' consent event.

**Events and decisions.**
- Event "The Names at the North Mouth": yearly; in 4A 1750 or later the rowers see lights among the black isles (the Orato report confirmed).
- Event "The Oath Broken": if Naamis carries the coalition, the ship-masters refuse a share of the fleet.
- Decision "Feed the Clans": spend food (supply or political power) in a hard winter for Woqood opinion and the clans' muster.

### Drak (tree `regional_drak`)

**Roots.** Slave-smiths of the Kalioth forges broke their collars after Dardan and swore under the Furnace never to wear a master's iron; masters are made by striking a ring from an apprentice's neck, and the descendants of slaves now forge powder for other men's wars.
**Sign.** An open iron collar broken at its hinge.

**Focus branches:**
1. *The Ring Struck Off.* A guild branch that turns the master's rite into research and production speed for artillery and powder; each tier "strikes a ring" and adds a master-smith advisor.
2. *No Master but the Forge.* A sovereignty branch against the Furnace Oath's clause that binds Drak to Stabilo's weigh-houses; breaking it frees trade but costs the Stabilo Pact (existing divergence `drak_sells_powder_widely`).
3. *The Kalioth Forges.* When Erco's miners open the wall, Drak learns where its forefathers' forges were; a claim-free route to buy or seize the old forge state's output, with a strong refusal of the diadem.
4. *The Furnace Wakes.* A disaster-preparedness branch for the Drak Furnace (existing divergence `drak_furnace_wakes`): walls facing the mountain, evacuation and ash-harvested sulphur.

**Identity.** *The Free Forges.* Entitled by the collars broken after Dardan. Drak. Requires the Furnace Oath's Stabilo clause broken or bought out, three master-smith advisors, and the diadem never worn in Erco. Changes: name and the broken-collar banner; powder and artillery production bonuses; Drak may sell to any court without the Pact's leave, and every realm that holds a former Kalioth forge state gets a negative opinion.

**Events and decisions.**
- Event "An Iron Ring": an apprentice is made a master; small research boost or a smith leaves for a rival court.
- Event "The Diadem Upright": if Erco wears the diadem, Drak's forge-houses vote whether to arm Erco or the realms against it.
- Decision "Buy Back the Oath": pay Stabilo to end the weigh-house clause (gold and political power).

### Rhachia (tree `regional_avalon`)

**Roots.** After the Rhachia Fires buried the Red Lands, mothers who lived through the ash in the caves fired clay figures of their dead and founded the kilns; the Red Hearth holds the clay to be the mothers' bone, and every king of the Red Lands, from the Kalioth to the Kings of the Kilns, was a stranger who taxed it.
**Sign.** A seated clay mother-figure, which Moiria carried at the head of the rising of 4A 1719.

**Focus branches:**
1. *The Refiring.* A spring rite that sets stability and recruitable population; skipping it in war costs stability.
2. *The Kiln-Mothers' Vote.* Constitutional: the kiln-mothers become a second chamber beside the tribune; strengthens the commonwealth against the restoration (existing divergence `rhachia_restoration`).
3. *Tribunes Abroad.* The tribunes' model spreads (existing divergence `rhachia_tribunes_spread`) through propaganda focuses aimed at Mora's and Erco's villages; rewards claims never, but subject-free influence.
4. *The Caves of the Vent-Field.* Exploration of the caves where the first mothers lived; finds the oldest figures and a relic modifier; risk from the Rhachia Fires.

**Identity.** *The Commonwealth of the Red Hearth.* Entitled by the first mothers of the caves. Rhachia. Requires the Kiln-Mothers' Vote, the caves explored, and the heir of the Kings of the Kilns dead, renounced or exiled abroad. Changes: name and the clay-mother banner on ash white; the Red Hearth spirit (stability, consumer goods from the kilns); two villages of a neighbouring realm may petition to join by event.

**Events and decisions.**
- Event "The Heir at Porrenva": the deposed heir offers to halve the kiln-tax; the kiln-mothers' answer depends on the refiring.
- Event "A Mother Cracks in the Kiln": an omen event before a war.
- Decision "Carry the Eldest Mother": raise the eldest figure before a defensive war for a defence bonus, at the risk of losing it if the capital falls.

### Erco (tree `regional_erco`)

**Roots.** The iron height of the Kalioth Crown; its mine-lords shut the passes on the beaten host in 2A 12, walled up the last king's diadem and swore to keep seven forts and pay what the mountain asks, and the realm lives over a buried crown.
**Sign.** The Kalioth diadem upside down, its seven points downward, as the mine-lords left it.

**Focus branches** (the tree's "The Wall Nobody Strikes", "Wall It Up Again", "Melt the Diadem" and "Wear the Diadem" already exist):
1. *The Seven Points.* Make the seven forts the diadem's seven points: each fort focus restores a fort and adds one point to a counter that the three diadem choices read.
2. *What the Old Kings Paid.* A fire-tithe branch that reveals the Kalioth paid the mountain too (shared with Pornivior's discovery); options to keep paying, to fortify Atonto (existing divergence `erco_refuses_tithe`), or to seek the devils' old road terms.
3. *The Banner Turned.* Cosmetic and political: wearing the diadem turns the banner's crown upright; walling it up again keeps it downward and grants the mine-folk's loyalty spirit; melting it removes the crown from the banner and leaves the seven forts as seven iron studs.
4. *The Pretender's Gold.* The existing divergence `erco_kalioth_claim`: a pretender of the old line with foreign gold; a counter-intelligence chain.

**Identity.** The adopted *Rhabtarkia, the Kalioth Crown* (K62 6.6) is the wearing route. A second identity for the walling route: *The Mine-Lords' Kingdom*, entitled by the oath of 2A 12; requires the diadem walled up again and all seven forts restored; changes the name and keeps the downward diadem; grants fort and mining bonuses and a permanent opinion bonus with Alerhia and Noris.

**Events and decisions.**
- Event "The Miner Who Struck the Wall": a miner breaks the ban; the shafts reveal the diadem's fate (the K62 gate).
- Decision "Show the Walled Place": each new Rhanid king is shown the wall (stability for the coronation).
- Event "Points Upward": if the diadem is worn, every Kalioth-memory realm receives a minor report naming what it remembers.

### Plutondo (tree `regional_plutondo`)

**Roots.** The valley ploughed the vents' ash long before Aen and calls it the breath of what sleeps beneath the East; it was the Kalioth's granary, rented the Crown's iron ploughs, chipped its own from vent-glass, and turned its grain barges to the besiegers in 2A 12.
**Sign.** A black glass ploughshare, point downward, edged in ember red.

**Focus branches:**
1. *The Glass Share.* Agriculture on ash: farm and population bonuses in vent states, with an eruption risk counter that grows with each tier.
2. *The Barges Turned.* A grain-power branch: Plutondo can withhold grain from a power (like Mora), with a war-support penalty for the target; rooted in 2A 12.
3. *Out of the Ledgers.* Debt branch against Stabilo's houses: refuse, renegotiate or pay in grain; links to the existing divergence `plutondo_toll_war`.
4. *The Breath of the Vents.* A belief branch shared with Mora's lake and the Tarkia mystery: the valley's tellers record the vents' rhythm; never answers the mystery, but grants an early warning of the existing divergence `plutondo_vents_wake`.

**Identity.** *The Princedom of the Ash.* Entitled by the first ploughing and the granaries turned against the Kalioth. Plutondo. Requires no debt to Stabilo, the Glass Share complete, and the diadem never worn in Erco (or, if worn, Plutondo at war with it). Changes: name and the glass-share banner; the valley is never claimable by the Kalioth restoration while the identity holds; grain-withholding becomes a standing decision.

**Events and decisions.**
- Event "The Vents Breathe Out": a yearly risk; good years add farm output, bad years start the Vent Year again.
- Decision "Withhold the Barges": deny grain to a power at war (target war support down, own trade down).
- Event "A Glass Share Breaks": an omen chain that precedes an eruption.

### Ostoroth (tree `regional_ostoroth`)

**Roots.** The cedar-folk cut the cedar the Bridge Kingdom carried west and turned their axes on each other when the bridge broke; the lake-readers' shrine held the clans together, and its closed lantern made the king in 3A 515.
**Sign.** The closed cedar lantern of the Truce of the Shrine.

**Focus branches:**
1. *The Lake-Readers.* The shrine's three laws become national law; the lake-readers act as an advisor slot with stability and a once-per-war ceasefire option.
2. *Cedar for the West.* Revive the cedar trade with the far halls; trade with the Middle Lands through the Rift ports, and a relic of the bridge-era cedar roof found in a western hall (knowledge gate).
3. *The Lantern Moves.* Mobilisation rooted in the Lakeshore Quarrel: once the lantern moves, the three counts' levies muster as one (manpower and organisation spirit).
4. *The Lake Road League.* The existing divergence `ostoroth_lake_league` with Mora and Kersian, framed as a league under the lantern rather than a crown.

**Identity.** *The Kingdom of the Lantern.* Entitled by the shrine's king-making. Ostoroth. Requires the lake-readers' laws, the Lake Road League sworn, and the Lantern Peace with Mora kept unbroken. Changes: name and the lantern banner; the league's members gain the lantern's protection (a defensive guarantee) and Ostoroth leads the league.

**Events and decisions.**
- Event "Steam on the Water": the lake-readers read the morning; a random small bonus or warning.
- Event "A Light on the Lake at Night": a fugitive claims the lake's protection; shelter or hand over.
- Decision "Float the King's Lantern": the yearly Lantern Float (stability, count loyalty).

### Mora (tree `regional_mora`)

**Roots.** The lake towns are the people who stayed when the lake turned hot in the Breaking; they lived on steam-eels and salt, sing the Litany low so as not to wake the lake, and bought their freedom with three harvests.
**Sign.** The white steam-eel, the one fish that lives where nothing else can.

**Focus branches:**
1. *Do Not Wake the Lake.* A quiet-lake law (no war drums on the water, no naval yards on the lake) that gives stability and protects the salt pans; breaking it for a lake fleet raises the Year of Steam risk.
2. *Bought, Not Won.* Buy rather than fight: decisions to buy out claims, debts or a raiding force with grain; rooted in the Purchase of 3A 802.
3. *The Granary of the East.* The existing grain role (`mora_withholds_grain`) deepened with storage, sale and refusal focuses.
4. *The Eels Return.* A recovery branch after a Year of Steam: the banner is flown reversed until the eels are netted again (a temporary penalty and its lifting).

**Identity.** *The Bought Commonwealth of the Lake.* Entitled by the Purchase of Gonnois. Mora. Requires the quiet-lake law kept, the granary complete, and a claim bought out by grain. Changes: name and the eel banner; buying peace becomes a standing decision (a white peace bought with grain and gold at a price that scales with the enemy's strength).

**Events and decisions.**
- Event "The Lake Turns Over": the Year of Steam can return; more likely if the quiet-lake law is broken.
- Decision "Buy the Raiders Off": pay grain to end a raid or a border war.
- Event "Hosts at the Granary Gate": every army that crosses the East must buy Mora's grain or take it.

### Delbiz (tree `shared_east_lands`)

**Roots.** The horse-lords keep the eastern half of Qadurum, its pillars and the Gate-Horses said to descend from the last horses that came back over the bridge; their law is the fair's law, and the king is the master of the fair.
**Sign.** The broken column with the horse-head capital, on which the first fair-king swore.

**Focus branches** (a Delbiz module in the shared tree):
1. *The Gate-Horses.* A breeding line that is never sold: cavalry quality bonuses, and a decision to gift one Gate-Horse to another court for opinion (once per decade).
2. *The Fair Among the Pillars.* A trade and diplomacy branch where envoys meet at the fair; neutral ground for peace talks, like Cereosa.
3. *Keeper of the Eastern Gate.* The Delbiz role in the Tarkia ambition (K62 lists Delbiz as keeper of the eastern gate): consent or refusal, and the price of consent.
4. *Horses for the Coalition.* The existing divergence `delbiz_mounts_coalition`, with the Gate-Horses as the line the horse-lords will not sell.

**Identity.** *The Fair-Kingdom of the Eastern Gate.* Entitled by the pillars of Qadurum. Delbiz. Requires the Gate-Horses kept unsold, the fair a recognised neutral ground (two peace deals signed there), and independence from Alerhia. Changes: name and the pillar banner; Delbiz gains a veto event over Alerhia's Tarkia ambition (consent, price, or refusal).

**Events and decisions.**
- Event "A Buyer for the Gate-Horses": a great power offers a fortune for the old line.
- Decision "Host the Talks Among the Pillars": offer the fair as neutral ground (opinion and political power).
- Event "The Murrain Returns": the herds sicken; the Gate-Horses' fate decides the fair's morale.

### Kersian (tree `shared_east_lands`)

**Roots.** Aenoran exiles fleeing the Necromancer poured the Vale's water into Osrale's cistern and swore the city would stand on Aenor's water until it could be carried home; every Lantern-Warden drinks from it, and a stranger from the west may drink before he is asked his name.
**Sign.** The sealed two-handled jar of Vale water.

**Focus branches** (a Kersian module):
1. *The Cistern Oath.* Refuge policy (existing divergence `kersian_refuge`): drink before questions; refugees from the western war become manpower and a stability risk.
2. *Water for Parim.* A diplomatic line to Aenor: the jar sent west with every caravan becomes an envoy chain, earning Aenor's guarantee or its indifference.
3. *Free Under Two Masters.* The Peace of Cereosa: balance Noris and Stabilo, or fall to one (existing divergence `kersian_bought`).
4. *Carry the Water Home.* A late branch: if Aenor stands after the war, the city may carry a jar to the Vale, a ceremony event that ends the oath and changes the city's spirit.

**Identity.** *Osrale of the Vale Water.* Entitled by the exiles' oath. Kersian. Requires the Cistern Oath, Water for Parim and a guarantee from Aenor or the Free Crowns. Changes: name and the jar banner; refugees from the west give manpower and research instead of a stability cost.

**Events and decisions.**
- Event "A Stranger at the Cistern": a western refugee of rank asks to drink.
- Decision "Send a Jar West": a yearly gift to Parim (opinion with Aenor).
- Event "The Water Carried Home": after the war, if Aenor stands.

### Mostok (tree `shared_east_lands`)

**Roots.** The crossing was the Kalioth tax-masters' Knife-Ground; the weighers who built Cereosa tied every blade into its sheath at the gate, and the city became the one place in the East where nobody draws.
**Sign.** The sheathed sword with its hilt tied by a white cord, which will be cut only if Cereosa is attacked.

**Focus branches** (a Mostok module):
1. *The Tied Blade.* Neutrality law: peace conferences and contracts held at Cereosa give both sides an opinion bonus; Mostok gains political power from each.
2. *The Knife-Ground Remembered.* A knowledge chain into the Kalioth tolls; finds the old toll-rolls that name which courts' ancestors paid (feeds the Kalioth-memory flag).
3. *Close the Junction.* The existing divergence `mostok_closes_junction`: deny passage to any host marching west.
4. *The Cord Is Cut.* A last-stand branch available only when Cereosa is attacked: the whole city arms (manpower, fort and defence bonuses).

**Identity.** None; Mostok's strength is its neutrality, and a crown would end it. The branch above replaces an identity.

**Events and decisions.**
- Event "A Cut Cord in the Weighers' Hall": a caravan master draws inside the walls.
- Decision "Host a Peace in Cereosa": offer the hall to two warring realms (both must accept).
- Event "Garrison at the Gate": a great power breaches the Peace (`mostok_garrisoned`); the cord is cut.

### Azano (tree `shared_east_lands`)

**Roots.** The Azani were Kalioth tally-lords spared because they held everyone's debts; the last king died owing them, and their creed is that a debt outlives the debtor and the right ledgers outlive kings.
**Sign.** Two halves of a split tally-stick, the paid and the unpaid.

**Focus branches** (an Azano module):
1. *The House's Ledgers.* Debt-diplomacy: call in or forgive debts of named courts, with opinion and gold swings.
2. *The King's Half.* A relic chain: the lost half of the last king's tally is in the walled hall in Erco; if Erco opens the wall, Azano may claim the half and the debt, a lever on the Kalioth restoration.
3. *The Free Crowns' Purse.* The existing divergence `azano_backs_free_crowns`.
4. *The Heir the House Accepts.* Succession under the house (existing divergence `azano_house_fails`), with marriage into Prudo or a stranger adopted.

**Identity.** None; the house is the realm. The King's Half chain gives it a lever instead.

**Events and decisions.**
- Event "A Debt Older Than the Debtor": an heir of a borrowing court is presented with his grandfather's tally.
- Decision "Split a Stick": seal a loan to another court (gold now, influence later).
- Event "The Other Half": Erco's shafts reveal the king's half of the tally.

### Obmi (tree `shared_east_lands`)

**Roots.** The jungle edge was the end of the Kalioth fever road, where condemned men who lived through three wet seasons were freed; their descendants taught the factors to tap the gum, and the hornbill led the town upslope in the fever of 4A 1319.
**Sign.** The black hornbill with its great casque.

**Focus branches** (an Obmi module):
1. *Where the Hornbill Nests.* Disease resistance: fever risk reduced by moving settlements upslope; attrition reduction in jungle.
2. *The Fever Road.* Jungle warfare: hardwood siege engines and jungle infantry, rooted in the freed men.
3. *Gum for the Pact.* The existing gum trade and its quarrel (`obmi_cuts_drak`).
4. *Count the Wet Seasons.* A people's calendar that strengthens recruitable population from the old families.

**Identity.** None.

**Events and decisions.**
- Event "The Hornbills Move": an early warning before a fever (`obmi_fever_returns`).
- Decision "Close the Felling Ground": spare a nest for a season (stability; timber output down).
- Event "The Fever-Post": the factors find the Kalioth fever-road camp and its carved survivors' marks (Kalioth-memory flag).

### Pornivior (tree `shared_east_lands`)

**Roots.** Nerhuus sits on the Kalioth southern road, where the Crown paid the devils of Mount Ergo for passage; when the caravan of 4A 744 vanished and left only its scales, the city took up the Kalioth payment without knowing it.
**Sign.** The balance-scale with its beam snapped, which hangs in the wardens' hall.

**Focus branches** (a Pornivior module):
1. *The Scorched Stone.* The tithe as policy: pay, raise or withhold (existing `pornivior_withholds_tithe`), each with devil-raid risk and political power cost.
2. *Whose Road Was This?* A knowledge chain into the Alerhic chronicles that reveals the Kalioth paid the devils; the city learns the old terms and may use them, at the risk of drawing the devils into a war.
3. *The City Without Enemies.* Trade with everyone: a neutrality and trade line.
4. *The Mountain Empties.* The existing divergence `pornivior_mountain_empties`: if the devils answer a summons south, the city must decide whether to reclaim the upper slopes.

**Identity.** None; Pornivior is held by its tithe.

**Events and decisions.**
- Event "The Tithe Is Weighed": yearly; a short weight brings a warning from the mountain.
- Decision "Carry the Tithe Up": the yearly payment (gold and political power).
- Event "The Kalioth Terms": the chronicles reveal what the old kings paid and for what.

### Woqood (tree `shared_east_lands`)

**Roots.** The boat clans refused Volgan their boats and fled north onto the ice; the Grandmother Under the Ice showed them the breathing-holes, and nobody hunts north of the last floe, where the Kusmeel goes black.
**Sign.** The moot's single harpoon with a toggle head, held by the Harpoon-Speaker.

**Focus branches** (the shared tree's sealer module):
1. *The Moot's Harpoon.* A clan-moot government branch: the Harpoon-Speaker's winter authority and the moot's veto on war.
2. *The Last Floe.* A watch on the black water: watch-fires along the Kusmeel coast (existing `woqood_watches_north`), intelligence on Zol's Mistake, and the taboo against hunting north.
3. *The Refusers.* Pride in refusing Volgan: a defensive spirit against any claimant of the East, and a refusal of the coalition unless attacked.
4. *The Sea Crown's Bread.* Ties to Naamis after the Ice Winter (existing `woqood_joins_naamis`).

**Identity.** None.

**Events and decisions.**
- Event "A White Seal with Dark Eyes": a hunter takes the forbidden seal; a bad winter follows unless the moot makes amends.
- Event "Black Water Beyond the Floe": the watchers see the black ships from the ice.
- Decision "Share the First Seal": the winter rite (stability, manpower).

### Orato (tree `shared_east_lands`)

**Roots.** The families of Orato and Fladev fled onto the heights in the flood of the Breaking and blew horns to call their boats home; a watcher with a horn sits on every headland each night and counts the lights on the Kusmeel.
**Sign.** The great horn of the northern height.

**Focus branches** (the shared tree's island-watch module):
1. *The Headland Horns.* A watch network giving intelligence on the Kusmeel and Zol's Mistake; the source of the black-ship reports.
2. *Believe the Fishers.* The existing divergence `orato_believed`: send word with proof to Naamis and Noris; success makes the courts take the north seriously.
3. *The Heights Again.* An evacuation branch for the existing divergence `orato_abandoned`: the families go up to the heights as in the Breaking.
4. *The Heir's Horn.* Succession: an heir is accepted when the boats hear him blow the great horn.

**Identity.** None.

**Events and decisions.**
- Event "A Horn in the Night": a new sighting among the black isles.
- Decision "Carry the Proof to Duum-Saah": a costly envoy with a fisher's evidence.
- Event "Nobody Came": if no court answers by a set date, the families' trust in the lord falls.

## Counts

| Item | Count |
| --- | --- |
| Realms | 18 |
| Focus-branch proposals | 72 (four per realm) |
| New identities | 11 (Noris, Stabilo, Naamis, Drak, Rhachia, Erco's Mine-Lords' Kingdom, Plutondo, Ostoroth, Mora, Delbiz, Kersian); Alerhia and Erco also lead into the adopted K62 restorations, and Mostok, Azano, Obmi, Pornivior, Woqood and Orato deliberately have none |
| Event and decision proposals | 54 (three per realm) |
