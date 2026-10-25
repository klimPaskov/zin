# Realm roots: the Lands of the Sun

**Status:** Proposed under decision K67 (owner, 25 October 2026). Every root and sign is labelled `proposed` in [lands_of_the_sun.json](../../../../tools/content/data/world/history/lands_of_the_sun.json), which holds the full texts. The play hooks are proposals for the focus, decision and event owners.
**Companions:** [docs/lore/regions/lands_of_the_sun.md](../../../lore/regions/lands_of_the_sun.md) and the vault note [Roots of the Lands of the Sun](../../../lore/vault/07%20-%20History/Roots%20of%20the%20Lands%20of%20the%20Sun.md).

## Ground rules for builders

- No new tags; identities are cosmetic (`set_cosmetic_tag`). Claims, never free cores, and no claim on any elven realm's land by another.
- **Kept open:** where the Gala came from, whether the Gala and the Sunhot are kin, whose kin the God Forest Keepers are, what the standing stones of Tor Luni are, and what lies beyond the south-western sea (Lao). No root, focus or event answers these; the Gala and the Sunhot signs share no line, colour pattern or charge (heraldry spec 1.5), and only the Lands of Light carry a sun.
- The Keepers of the God Forest are forest spirits never fully human-shaped (K57); events describe them only as the Sunhot see them.
- Angels exist and their purpose is unwritten; the watchers record what they see and never prophesy.
- The Lands of the Sun are reached only by sea, and their history is one of long peace: the branches favour shelter, ships and healers over conquest.
- Eindil's coming to Gala (4A 1752) is established; nothing here changes it. Lorien's death in 4A 1757 is established.

## The realms

### Gala (tree `gala`)

**Roots.** The court's memory begins with the First Rain on a dry shore and the spring that rose in a stone courtyard, where a white hind drank first; the court keeps it as the Mirror of First Rain, remembers lineages by its keepers, hunts no deer, and does not speak a vision plainly. Where the Gala came from and whose kin they are stays silent.
**Sign.** A white hind with her head lowered to drink, carried by Lorien's host to Dardan.

**Focus branches** (the 82-focus tree already holds the Mirror, the King's Ships and the Noon Council):
1. *The Hind's Spring.* A sacred-site branch: the courtyard of the First Rain as a state modifier, with the rule that no Gala hunts a deer turned into a forest-preservation and supply bonus.
2. *The Late Banner.* Memory of Dardan: the hind's host as an elite army that arrives late and decisive (a reinforcement bonus on allied fronts), unlocked only when an ally asks.
3. *The Folded Banner.* The Refusal of 2A 2121: a diplomacy branch that refuses a king who turns victory into a crown, with opinion swings toward Aenor and the elven realms.
4. *Said Too Plainly.* A Mirror branch where a keeper's vision can be spoken plainly (a strong bonus that also forces the shown future as a mission) or kept veiled.

**Identity.** None; Gala's name is older than any identity it could take. The hind's banner is its only sign.

**Events and decisions.**
- Event "The Hind at the Spring": a white hind is seen at the Mirror's courtyard; an omen of guests.
- Decision "Unfold the Banner": the hind's host marches beyond the Lands of the Sun (only when an ally asks or the dead rise), with a large war-support cost to the court's grief.
- Event "A Deer Killed on the Shore": a foreign crew hunts on Gala's shore; the court's answer sets its opinion of that crown.

### The Lands of Light (tree `regional_the_lands_of_light`)

**Roots.** The first Sunhot built their sanctuaries with one tall door facing noon so that the sun stands in it on the longest day; the noon-door of Eldoga is their oldest sign, a door open in daylight, a guest at noon never refused, and a quarrel judged at noon where nothing hides. The Radiant Speaker was first chosen to share water in the drought of 1A 840.
**Sign.** A tall narrow doorway with the noon sun standing in it, the one sun among the banners of the Lands of the Sun.

**Focus branches:**
1. *Judged at Noon.* A justice branch: quarrels between the Sunhot realms are settled in the sun court (Noon Council judgements as events), with stability and council-opinion rewards.
2. *The Shares of the Drought.* Water and food sharing among the sanctuaries; a crisis decision in dry years.
3. *The Door Open at Noon.* Guest and refuge law: shelter refugees and foreign envoys; ties to the storm-driven stranger.
4. *Ask the Villages.* The levy question rooted in the guest-right (existing divergence `light_villages_refuse`): ask the Sunfolk villages, earn their consent with grants, or do without.
5. *Help Sent North.* The existing divergence `light_sends_help`: the Noon Council sends ships and companies north for the first time since Dardan.

**Identity.** *The Realm of the Noon-Door.* Entitled by the oldest sanctuary and the drought council. The Lands of Light. Requires the Noon Council at full strength (every Sunhot realm seated), Ask the Villages completed with consent, and peace among the Sunhot realms for ten years. Changes: name and the noon-door banner; the Radiant Speaker's judgements become binding (Elvana and Igara may be ordered to end their quarrel, at an opinion cost).

**Events and decisions.**
- Event "The Longest Day": the sun stands in the noon-door; a yearly stability and council event.
- Decision "Judge at Noon": settle a dispute between two Sunhot realms.
- Event "A Guest at Noon": an armed foreign envoy arrives at the noon hour and may not be refused.

### Elvana (tree `regional_elvana`)

**Roots.** The healers of the cape learned from the white silk-moth that its thread closes wounds; they became the weavers and healers of the Sunhot, offer every cloth to the sick before it is sold, and keep a bloodless rivalry with Igara that they enjoy.
**Sign.** A white silk-moth with broad wings spread, woven in the moth's own thread.

**Focus branches:**
1. *The Moth-Thread.* Medicine: a healers' spirit that lowers casualties and raises recovered manpower; a later focus lets Elvana send healers north (existing divergence `elvana_healers_north`).
2. *Cloth for the Sick First.* A charity and trade branch: silk exports after the sick are served; the trade bonus rises when the sanctuary's hospital is full.
3. *The Quarrel We Enjoy.* The rivalry with Igara made a game: song, weaving and petition contests at the Noon Council with prestige (political power) rewards and losses.
4. *One Cape, Two Shores.* Serve the shrines of both shores: infrastructure and a stability bonus in the Elvini shore state.

**Identity.** *The Twin Sanctuaries of the Moth and the Crane.* Entitled by the Weavers' Judgement, which found the two realms equal. Elvana or Igara, whichever unites the two (existing divergence `elvana_igara_union`) by marriage of houses or a Noon Council judgement. Requires the union and both shrines kept. Changes: one realm under a joint banner (moth and crane facing, the only banner of the region with two charges), the quarrel ends, and with it the contest rewards.

**Events and decisions.**
- Event "A Moth Year": the moths swarm and the thread harvest is great.
- Decision "Challenge Igara": open a contest at the Noon Council.
- Event "Healers for the North": a northern crown asks for Elvana's healers.

### Igara (tree `shared_lands_of_the_sun`)

**Roots.** The sun-cranes danced on the dry shallows until the rain came, and the shrine's keepers have danced the crane-dance in every drought since; the cranes belong to the shrine, and the Quarrel of the Shallows with Elvana has never shed a drop of blood.
**Sign.** A sun-crane dancing with its wings raised and one leg lifted.

**Focus branches** (an Igara module):
1. *The Crane-Dance.* A drought rite: in dry years the dance lowers the drought penalty; a keeper must have danced it to hold the shrine.
2. *The Shrine's Birds.* Protection of the shallows: a crane killed brings a dry-year event; protecting them is a stability bonus.
3. *Outvote Elvana.* Council politics: Igara's standing at Noon measured by votes won against Elvana; the existing divergence `igara_council_seat`.
4. *The Shrine Lost.* The existing divergence `igara_shrine_lost`: a recovery branch that rebuilds the shrine or lets it pass into memory.

**Identity.** The shared *Twin Sanctuaries of the Moth and the Crane* (see Elvana).

**Events and decisions.**
- Event "The Cranes Come Down": the cranes arrive early or late, an omen for the harvest.
- Decision "Dance on the Shallows": in a drought (stability, harvest).
- Event "Elvana's Petition": the yearly claim to the cranes, answered with two petitions.

### Yeni Alang (tree `regional_heaven`)

**Roots.** The terrace-folk learned that when every ribbon on the field poles hangs dead still the sky is clearest; on such a day in 1A 1201 a watcher saw wings, and the house of Sudoni has kept the Roll of Wings since, writing what it sees and never calling it prophecy.
**Sign.** A tall pole with one long ribbon hanging straight down, the still ribbon.

**Focus branches:**
1. *The Roll of Wings.* A record branch: each sighting adds to a counter that gives research and stability; two watchers must agree.
2. *Still Days.* A terrace-agriculture branch: the ribbon-poles read the wind for the harvest (farm output).
3. *Letters to the Mirror.* Correspondence with Gala's keepers: shared intelligence and a joint omen event; never a prophecy.
4. *Word to the North.* The existing divergence `yeni_alang_watchers_north`: the watchers send what they see north in the war years.

**Identity.** None; the house refuses to be a crown.

**Events and decisions.**
- Event "Wings on a Still Day": a sighting; the house writes it if two watchers agree.
- Event "The Empty Sky": a year without wings; the house fasts (stability down, then up when a sighting returns).
- Event "Wings Descend": the existing divergence `yeni_alang_wings_descend`, which the Roll has never recorded; its outcome stays unwritten beyond what the watchers see.

### Tor Luni (tree `regional_godland`)

**Roots.** The quarrying elves found the standing stones already raised by nobody remembered and swore never to cut them, breaking their first chisels at the stones' feet; in 4A 1588 every chisel set to a stone broke.
**Sign.** The two halves of a broken quarrier's chisel.

**Focus branches:**
1. *The First Chisel.* Initiation of quarriers: building speed and a quarry state modifier, with the oath as stability.
2. *White Stone for Every Shore.* The stone trade: exports to the region and, later, to Aenor (existing divergence `tor_luni_stone_north`).
3. *The Pilgrims' Hostels.* Pilgrims to the Sea of Gods: consumer goods and trade from the hostels.
4. *Dig Beneath the Stones?* The existing divergence `tor_luni_stones_opened`: a Keeper may let scholars dig; the branch never reveals what the stones are, and any digging carries the 4A 1588 omen.

**Identity.** None.

**Events and decisions.**
- Event "A Chisel Breaks Against the Stone": an omen whenever building is rushed.
- Decision "Break the First Chisels": a yearly initiation (manpower among the quarriers, stability).
- Event "Scholars at Wefolen": foreign scholars ask to dig.

### Ihuy (tree `shared_lands_of_the_sun`)

**Roots.** The isle Sunhot came by outrigger canoe, the last Sunhot to cross the water; when Hol's ash fell in 3A 66 seven canoes, one from each island, fed them all, and each island keeps one canoe that belongs to all seven.
**Sign.** An outrigger canoe with seven paddles held upright.

**Focus branches** (an Ihuy module):
1. *The Seven Canoes.* Mutual aid among the isles: shared supply and a disaster-relief decision.
2. *Pearls for Hol.* Mourning lost ships at the foot of Hol; a stability rite and an early warning of the existing divergence `ihuy_hol_wakes`.
3. *The Reef-Words.* Trade on the southern reefs; ties to the Islands of the South (existing divergence `ihuy_southern_isles`).
4. *The Strait Line.* Relations with Soyano over the strait fisheries.

**Identity.** None.

**Events and decisions.**
- Event "Hol Smokes": a ship is lost and the mountain smokes harder.
- Decision "Paddle One Canoe": call the seven canoes in a crisis (supply to any isle).
- Event "A Southern Canoe at Holang": the islands of the south ask for a treaty.

### Soyano (tree `regional_hengyang`)

**Roots.** Every white ship's keel is measured from the Mother-Keel, the keel of the first white ship of the isles, laid along the noon shadow of a standing tree; the Archipelago Council chose its first Tide-Speaker at the turn of the tide so that no isle could claim the office.
**Sign.** A bare curved white keel with its stem and stern posts.

**Focus branches:**
1. *Laid Beside the Mother-Keel.* Naval production quality: ships built true (a naval design and production bonus).
2. *The White Ships of Gala.* The court contract: hulls for Gala and the trade they bring.
3. *Ships for a Northern Crown.* The existing divergence `soyano_sells_ships`, with a council vote.
4. *The Fleet North.* The existing divergence `soyano_fleet_north`: the only Sunhot realm whose ships could carry a host.

**Identity.** None.

**Events and decisions.**
- Event "A Keel Out of True": a shipwright breaks the rule; the launch is forbidden.
- Decision "Name a Ship for the Tide": a launch rite (navy experience).
- Event "A Northern Buyer": a crown of the north offers for white ships.

### Goodin (tree `regional_goodin`)

**Roots.** The Sunfolk landed as boat-folk driven out by the Long Grief and walked up to the first sanctuary with their spears reversed; a guest fights for his host by his own choice, which is why Goodin alone raises its levies freely.
**Sign.** A spear reversed, its point resting on the ground line.

**Focus branches:**
1. *Spears Reversed.* The guest-soldier tradition: free levies, and a decision to lend companies to any Sunhot realm that asks.
2. *A Well for Every Steading.* Talae's request made a building branch (infrastructure and supply in steadings).
3. *A Full Seat at Noon.* The existing divergence `goodin_full_seat`: trade levies for a full seat.
4. *Where the Boats Came From.* The Sunfolk's own songs about the coasts across the water; a culture branch that never names the coast, with a stability and recruitment bonus.
5. *A Host of Our Own.* The existing divergence `goodin_host_north`.

**Identity.** *The Guest-Realm of Goodin.* Entitled by the guest-right and the reversed spears. Goodin. Requires a full seat at the Noon Council and Spears Reversed. Changes: name and the reversed-spear banner; the Sunhot realms may ask Goodin's levies without their own village consent, and Goodin becomes the council's sworn arm with an opinion bonus from every Sunhot realm.

**Events and decisions.**
- Event "A Host Asks a Guest": a Sunhot realm asks Goodin to fight; refusing breaks the guest's custom.
- Decision "Lend the Spears": send companies to a Sunhot realm (manpower out, opinion in).
- Event "The Songs of the Boats": the elders sing of the coasts across the water; the place is never named.

### God Forest (tree `shared_lands_of_the_sun`)

**Roots.** The wood was already closed and kept when the first sanctuary rose; the Sunhot believe it grew from one seed the Keepers planted, the Keepers are never quite shaped like anyone, and their only recorded deeds are refusals and returns, the last a living vine with a winged seed inside.
**Sign.** A great winged seed with one long curved wing.

**Focus branches** (a God Forest module, small and mostly closed):
1. *The Closed Wood.* Isolation: high defence and attrition for any army entering, no trade, no diplomacy beyond the edge.
2. *The Edge Meeting.* Whoever meets the Keepers at the wood's edge speaks for them: a limited diplomacy branch with the Sunhot realms only.
3. *Shelter in the Wood.* The existing divergence `god_forest_shelters`: refugees from the coast and isles taken in, never seen again until the war ends.
4. *The Wood Opens.* The existing divergence `god_forest_opens`: the Keepers open the wood to one realm in the war years; what they want stays unstated.

**Identity.** None.

**Events and decisions.**
- Event "A Vine Returned": an invitation or demand sent back tied with a living vine.
- Event "The Pilgrims Come Out": pilgrims who walked in come out with nothing to say.
- Decision "Leave Gifts at the Edge": the Sunhot realms' offering (opinion with the forest; nothing promised).

## Counts

| Item | Count |
| --- | --- |
| Realms | 10 |
| Focus-branch proposals | 42 (four for each realm, five for the Lands of Light and Goodin) |
| New identities | 3 (the Realm of the Noon-Door, the Twin Sanctuaries of the Moth and the Crane for Elvana or Igara, the Guest-Realm of Goodin); Gala, Yeni Alang, Tor Luni, Ihuy, Soyano and the God Forest deliberately have none |
| Event and decision proposals | 30 (three per realm) |
