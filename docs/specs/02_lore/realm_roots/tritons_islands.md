# Realm roots: Triton's Islands

**Status:** Proposed under decision K67 (owner, 25 October 2026). Every root and sign is labelled `proposed` in [tritons_islands.json](../../../../tools/content/data/world/history/tritons_islands.json), which holds the full texts. The play hooks are proposals for the focus, decision and event owners.
**Companions:** [10_fallen_realms.md](../10_fallen_realms.md) (Margorodai the Sea-Roads and Heulufaenn the Sunfields, adopted K64), [docs/lore/regions/tritons_islands.md](../../../lore/regions/tritons_islands.md) and the vault note [Roots of Triton's Islands](../../../lore/vault/07%20-%20History/Roots%20of%20Triton%27s%20Islands.md).

## Ground rules for builders

- No new tags; identities are cosmetic (`set_cosmetic_tag`). The adopted restoration **Margorodai, the Sea-Roads** (K62 6.6, by Adel's Charter route or Nondondor's crown route) stands; the hooks below feed it and do not duplicate it.
- **Kept open and disputed:** whether the Grey Breath still waits in the Cursed Square's wrecks; what the reef-spirits are (the islanders' belief only); the Square's evil (a belief). The Square was Halgohavnai, learned only from Adel's oldest charts (gated).
- **Senra of the Pupor Isles** (K66) is remembered by every chart-house; the Andaios chart-house's claim on her is a family claim, not a fact, and no banner shows her.
- The chart-islanders look like lean, mixed, weathered sailors of their own culture (K64). The water is never called an Ocean (K66): the Pupor, the inner sea, the Crown Sea.
- **The Margorodai thread.** Several roots meet in the league: Adel's lead, Raerby's cut fish, Pollos's three keys, the Lens's lamp, Halenor's lit shores, Santon's black sail and Benan's dead harbour. A flag per realm, `zin_sea_roads_memory_<tag>`, should record which realms have recovered their part, and the Sea-Roads restoration should ask for at least four of them.
- The corsairs never carry a skull, crossbones or fouled anchor (heraldry 1.4); their signs come from the plague and the borrowed harbours.

## The realms

### Adel (tree `regional_adel`)

**Roots.** The proto-Boreal sailors who came to the arcs named no reef before they proved it by the lead; the league's chart-office stood at Adel from 1A 900, the Andaios chart-house claims Senra of the Pupor Isles and keeps a lead it calls hers, and the Chart Hall became the copy-house of record in 4A 388.
**Sign.** A long tapered sounding lead hanging on its line.

**Focus branches** (the tree holds the Chart Hall, the Charter and the war at sea):
1. *Proved by the Lead.* Chart quality: the newest charts give the buyer naval movement and fewer losses; a false chart sold is a scandal that costs the Hall's standing.
2. *Senra's Lead.* The Andaios relic: a navy spirit and the memory of the supply fleets, which the Western Crossing can borrow.
3. *The First Namers.* The record of who first named each reef: a dispute mechanic with Pollos and Raerby that ends in the Charter's favour or a quarrel.
4. *The League's Oldest Charts.* The existing "Whose Square?" and "The Sea-Roads Rejoined" focuses lead from here; recovering the oldest charts sets Adel's Sea-Roads memory flag.

**Identity.** The adopted *Margorodai* (Charter route).

**Events and decisions.**
- Event "A Reef Without a Name": a pilot finds an unsounded reef.
- Decision "Sell the Newest Chart": to the highest bidder or to a chosen crown (gold or opinion).
- Event "The Square on an Old Chart": the oldest chart shows a harbour where the Cursed Square lies (the K62 gate).

### Raerby (tree `regional_raerby`)

**Roots.** The banks were shared by the oldest law: the first fish of a disputed shoal cut in two before both crews; the league's banks-court sat at Raerby and judged on the water, and its broker-captains keep the freight-book and the one case they have never closed, the Southern Banks.
**Sign.** A great banks-fish cut through its middle by a thin white line.

**Focus branches:**
1. *Cut the First Fish.* Arbitration: Raerby can settle quarrels between island realms (political power, opinion), beginning with a cut fish.
2. *The Court-Ship.* A mobile court: a decision to anchor over a disputed bank and force a hearing.
3. *The Freight-Book.* Hulls for hire (existing divergence `rae_hulls_hire`) and the convoy trade.
4. *The Case Never Closed.* The Southern Banks peace (existing divergence `rae_banks_peace`); success sets Raerby's Sea-Roads memory flag, as the banks-court restored.

**Identity.** None; Raerby is the court, and the court's consent is its role in the Sea-Roads restoration.

**Events and decisions.**
- Event "Two Crews, One Shoal": a hearing on the water.
- Decision "Anchor the Court-Ship": force a hearing on the Southern Banks.
- Event "A False Entry": a broker-captain keeps the book dishonestly.

### Pollos (tree `regional_pollos`)

**Roots.** The league's strong-room had three locks and three keys held by three captains; in the Grey Breath the last living key-holder carried all three home to Pollos, which claims the strong-room by survival, and three guild-masters still turn their keys together.
**Sign.** Three keys hanging from one ring.

**Focus branches:**
1. *Three Keys Together.* Treasury law: the Charter's treasury cannot be lent by one guild-master (existing divergence `pll_treasury_loan` needs all three).
2. *The Coin at the Door.* Market honesty: every coin weighed; a counterfeiting event and the quay gallows.
3. *The Market Closed.* The existing divergence `pll_market_closed` against a crown that attacks the isles.
4. *The League's Purse.* The strong-room's oldest ledgers: proof of the league's dues and Pollos's Sea-Roads memory flag.

**Identity.** None.

**Events and decisions.**
- Event "One Key Missing": a guild-master dies and his key is contested.
- Decision "Open the Strong-Room": lend the Charter's treasury (all three keys).
- Event "False Silver": coiners are caught on the quay.

### Nondondor (tree `regional_nondondor`)

**Roots.** Kusion of the Kilai beat the corsair captains in 2A 760 and, having no gold, crowned himself with his ship's anchor cable; his line is the only hereditary crown of the arcs, claims the league's one law needs a crown to keep it, and presses the Southern Banks.
**Sign.** A crown twisted from a ship's anchor cable.

**Focus branches:**
1. *The Cable Crown.* Succession: the heir must have commanded a ship, and each king twists his own crown (legitimacy).
2. *Writ or Rope.* Corsair policy: license or hang (existing divergence `nnd_hang_corsairs`), each feeding the crown's route to the Sea-Roads.
3. *The Banks Pressed.* The existing divergence `nnd_press_banks`.
4. *One Law for Every Flag.* The crown's claim to the league's law: a diplomacy branch that leads to the crown route of the Sea-Roads restoration.

**Identity.** The adopted *Margorodai* (crown route).

**Events and decisions.**
- Event "A Crown Twisted": a new king's crowning.
- Decision "Grant a Writ": license a corsair captain (raiders for the crown).
- Event "The Hanging Season Again": the western fleets threaten Kudaini.

### Fineger (tree `shared_tritons_islands`)

**Roots.** The pilots' isles keep the most of the Sunfields' old words; their forefathers crossed the frozen channel to the Kile Islands behind a white ram, and a pilot is still the ram of his ship, goes first and is paid first.
**Sign.** A white ram's head with heavy curled horns.

**Focus branches** (a Fineger module):
1. *The Ram Goes First.* Pilots: any fleet entering the northern waters needs Fineger's pilots or suffers attrition (existing divergences `fng_pilots_crossing` and `fng_pilots_withheld`).
2. *The Old Words.* The Sunfields' sea-words: a knowledge branch that feeds the Heulufaenn discovery (the Boreal kin "Three Names, One Land" of K62) as the island kin.
3. *Kelp and Sheep.* The poor isles' living; famine resilience and the debt to Raerby.
4. *The Norrai Pilotage.* The compact with Vindael extended into a northern pilot league with the Cold Lands ports.

**Identity.** None.

**Events and decisions.**
- Event "Ice in the Poolho": a Speaker candidate must pilot a ship through.
- Decision "Hang the Ram at the Bow": hire a pilot to a foreign fleet.
- Event "The Sunfield Word": a Coldic scholar hears a Fineger pilot use a word of the old north (the Boreal kin gate).

### Halenor (tree `regional_halenor`)

**Roots.** The first shore-fires guided kin home and could guide strangers onto the rocks; after the Grey Breath darkened the league's lit shores the islanders lived on wrecks, and Lusai of the Mondon set an empty fire-basket at Sonrale in 3A 280 that each wreck-lord swears to light or leave dark.
**Sign.** An empty iron fire-basket on a tall pole.

**Focus branches** (the tree holds wreckers or wayfinders):
1. *The Empty Basket.* Each lord's oath: a choice at succession between wreckers (wreck income) and wayfinders (Lamp-House opinion, convoy safety).
2. *The Lit Shores of the League.* Halenor's shores once lit for the Sea-Roads: relighting them sets Halenor's Sea-Roads memory flag and ends the Lamp Quarrel.
3. *The Storm Fleet.* Gale-season raiding with the wreck-right (existing divergence `hln_wreck_fleet`).
4. *The Wayfinder Lord's Songs.* The lord of 4A 1690 remembered: a culture branch that makes the wayfinder oath popular among the islanders.

**Identity.** None.

**Events and decisions.**
- Event "The Gale Season": light the shore-fires or leave them dark.
- Decision "Fill the Basket": swear as a wayfinder for life (wreck income lost; Lens and Charter opinion gained).
- Event "A Wreck Worth a Kingdom": a rich wreck tempts a wayfinder lord.

### Windy Lands (tree `shared_tritons_islands`)

**Roots.** Boreal sailors thrown onto the windward capes lived through their first winter by flying sail-cloth kites to catch seabirds; the kite is their oldest tool and first prayer, a cape-lord holds his seat as a kite-flier holds a line, and the kite fleet fishes banks nobody else can reach.
**Sign.** A diamond fishing kite with a long rag tail streaming.

**Focus branches** (a Windy Lands module):
1. *Hold the Line.* League unity: the four cape-lords, one voice each gale season.
2. *The Kite Fleet.* Windward banks fishing and kite-spotting (naval detection).
3. *What the Wind Brings.* The wreck-right of the capes and the debt to Raerby.
4. *The Charter or the Convoys.* The existing divergences `wnd_charter` and `wnd_raid_convoys`.

**Identity.** None.

**Events and decisions.**
- Event "A Line Let Go": a cape-lord fails in a gale and is replaced.
- Decision "Fly the Kites Over the Sea": spot a fleet in the gale season.
- Event "Raerby's Third": the old wreck debt is called in.

### Seite Islands (tree `regional_seite_islands`)

**Roots.** The grey seals bore the first wrecked pilots ashore, so the reef-spirits came as seals and no household kills one; the households swore in 2A 1340 that the fathers' banks belong to their children, and every household speaks at the moot.
**Sign.** A grey seal rising from the water.

**Focus branches:**
1. *The Fathers' Banks.* A defence of the banks against Nondondor (existing divergences `sei_banks_war` and `sei_banks_shared`).
2. *Every Household Speaks.* The moot as government: slow decisions, high legitimacy.
3. *The Reef-Shrines.* Tokens left by every passing pilot: opinion with every island realm, and a pilgrimage-of-pilots decision.
4. *The Seals' Messengers.* A belief branch: a seal killed brings a bad season; protecting them gives fishing output.

**Identity.** None.

**Events and decisions.**
- Event "The Sea-King's Envoys": sent home again, every year.
- Decision "Read Under the Shrine": the moot-reader's yearly reading (stability).
- Event "A Seal on the Beach": a seal killed by a foreign crew.

### Santon (tree `shared_tritons_islands`)

**Roots.** In the Grey Breath ships of the dead flew black sails; corsairs sailed into the emptied harbours of the outer arc under black sails nobody would approach, and Hanei of the Black Sail took Straton in 2A 130 and made the captains swear the Ransom Tide law.
**Sign.** A black sail, full-bellied, without ship or mast.

**Focus branches** (a Santon module):
1. *The Black Sail Raised.* Prize-taking: raiding output, and a captain made by raising the sail in Straton.
2. *The Ransom Tide.* Ransom economics: captives ransomed or given to the sea, with opinion consequences.
3. *Straton Burned Again.* Defence against Corogon's oath.
4. *In a Crown's Pay.* The existing divergences `snt_licensed` and `snt_prey_evacuation`.

**Identity.** The shared *Captaincy of the Ransom Tide* (below).

**Events and decisions.**
- Event "A Better Captain": a rival raises his sail in the harbour.
- Decision "Ransom the Captives": by the next tide-feast (gold, opinion).
- Event "The Sign of the Dead": an old plague-ship's black sail is found, and the islands fear the Grey Breath.

### Benan (tree `shared_tritons_islands`)

**Roots.** The corsairs of the Benan Mountains hold the Cursed Square, the ruin of the Holy Harbour, in name and never sail into it; Urai the Lame taught that a corsair is a crab in a borrowed shell that must never crawl into the shell its owner died in, and nothing is taken from the Square.
**Sign.** A hermit crab in a spiral shell with its claws raised.

**Focus branches** (a Benan module):
1. *The Haven's Peace.* Torni's dues and peace: a corsair haven that other corsairs pay to use.
2. *Held in Name.* The Square as Benan's own in name: a diplomacy lever in the Sea-Roads restoration, whose relighting must buy, bargain with or fight Benan.
3. *The Tribute Late.* The Charter's tribute: raid when it is late.
4. *A Dead Man's Shell.* The taboo of the Square tested: a captain who sails in finds the wreck of 2A 1507, and the Grey Breath risk is rolled (kept disputed).

**Identity.** The shared *Captaincy of the Ransom Tide* (below).

**Events and decisions.**
- Event "A Corsair Who Sailed Into the Square": he does not come back, or comes back sick.
- Decision "Hang a Shell at the Masthead": admit a corsair to the haven (dues, raiders).
- Event "The Relighters Come": a Sea-Roads restoration asks Benan for the Square.

### The Lens (tree `shared_tritons_islands`)

**Roots.** The first sailors kept fires on the capes and the Sea-Roads made the first lit passages; after the Wreck of the Square in 2A 1507 the glass-blowers of the round isle swore to keep the passages lit for every flag, Saneros blew the great lamp-glass in one breath, and since 4A 1544 nobody touches a lamp.
**Sign.** A glass-blower's pipe with a round glowing gather at its tip.

**Focus branches** (a Lens module):
1. *One Breath.* Keepers' oath: each Keeper blows a lamp-glass; neutrality as a protected status.
2. *The League's Own Light.* The lamp the order relit; the Lens is the lamp any relighting of the Square needs (sets the Lens's Sea-Roads memory flag).
3. *Darken the Lamps.* The existing divergence `len_lamps_dark`.
4. *The Isle Seized.* The existing divergence `len_attacked`: every chart-house turns on the attacker.

**Identity.** None; the order takes no crown.

**Events and decisions.**
- Event "A Lamp Put Out": a realm darkens a lamp; every chart-house refuses its charts.
- Decision "Blow the Keeper's Glass": the oath of a new Keeper.
- Event "A Light on the Square": someone asks the Lens for a lamp to relight the Holy Harbour.

## A shared identity of the corsair isles

**The Captaincy of the Ransom Tide** (proposed). Entitled by the black sails of the Grey Breath and the borrowed harbours: the corsair isles were made by the league's death, and they are the one heir of Margorodai that would never relight it. Formed by Santon or Benan. Requires the other corsair isle a subject or ally, the Ransom Tide sworn by every captain of both, and the Sea-Roads restoration not formed (or broken). Changes: the former takes a captaincy name under the black sail (Santon) or the crab (Benan), whichever formed it, with the other's sign as its standard at sea; raiding and convoy-interdiction bonuses; a permanent rivalry with any Sea-Roads restorer and with Corogon. It is the corsairs' answer to the Sea-Roads, not a crown: the captaincy passes to the best captain by event.

## Counts

| Item | Count |
| --- | --- |
| Realms | 11 |
| Focus-branch proposals | 44 (four per realm) |
| New identities | 1 (the Captaincy of the Ransom Tide, for Santon or Benan); Adel and Nondondor lead into the adopted Margorodai restoration, and the shared Sea-Roads memory flags give every other island its part in it |
| Event and decision proposals | 33 (three per realm) |
