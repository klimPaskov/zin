# Realm roots: the South Lands

**Status:** Proposed under decision K67 (owner, 25 October 2026). Every root and sign is labelled `proposed` in [south_lands.json](../../../../tools/content/data/world/history/south_lands.json), which holds the full texts. The play hooks are proposals for the focus, decision and event owners.
**Companions:** [10_fallen_realms.md](../10_fallen_realms.md) (the Kalioth Crown, adopted K64, whose passes Miaed sold), [docs/lore/regions/south_lands.md](../../../lore/regions/south_lands.md) and the vault note [Roots of the South Lands](../../../lore/vault/07%20-%20History/Roots%20of%20the%20South%20Lands.md).

## Ground rules for builders

- No new tags; identities are cosmetic (`set_cosmetic_tag`) on the existing tags. Claims, never free cores.
- The burning lands beyond the last well stay off the map and are named only in dread (K25); no root, event or focus sends anyone there.
- Angels exist and their purpose is unwritten: no event shows an angel's face, words or purpose, and every sighting stays a belief or a mark (a feather, a spring).
- The well-clans of Wahatud are proposed as dark-skinned people of the deep south, under the owner's answer to Q-103 that the southernmost mainland may have black peoples; the portrait owners should treat this as a proposal until the owner confirms it (see Open Questions).
- Audiences follow K61; the Kalioth thread follows the East Lands file (`zin_kalioth_memory_<tag>`).

## The realms

### Miaed (tree `regional_miaed`)

**Roots.** The gorge-houses found the Hardtmuth paths by following the black ibex, which they never hunt; they sold water and guides to the Kalioth Crown and to the eastern hosts marching north to Volgan, and after Dardan sold water to the starving Kalioth remnant at a price it could not pay, so the law of the passes is water sold to the going and the coming alike.
**Sign.** A black ibex with swept-back horns, the beast of the gorge-mother's tale that showed the first path.

**Focus branches:**
1. *Follow the Ibex.* Mountain warfare and guides: attrition and movement bonuses in the Hardtmuth, and a "guides for hire" decision that sells movement bonuses to another army.
2. *The Price of Water.* The higher-bidder law made a branch: each season Noris and Stabilo bid for passage (an auction event), and Miaed's political power grows with the gap between bids.
3. *The Beaten Come Back.* A knowledge chain into the Kalioth retreat: bones in the gorges, the remnant's iron, and the Kalioth-memory flag; Miaed learns that the diadem claims its passes and gains a defence spirit against Erco's restoration.
4. *Fires for the Mountain.* The pass fires as faith: stability in the dry season, and an omen event when the Hardtmuth Fire wakes.
5. *Close the Hardtmuth.* The existing divergence `miaed_closes_passes`, priced: the Sand Road stops and both powers court Miaed.

**Identity.** *The Lordship of the Ibex Road.* Entitled by the gorge-mother's path and every water sold since. Miaed. Requires the Price of Water and Close the Hardtmuth focuses, all Hardtmuth pass states owned, and neither Noris nor Stabilo with a garrison in the passes. Changes: name and the ibex banner; a permanent passage-toll decision that taxes any army crossing the Hardtmuth; immunity to the Kalioth restoration's claim on the passes while the identity holds.

**Events and decisions.**
- Event "Two Bids for the Season": Noris and Stabilo each offer for the season's passage.
- Event "An Ibex Killed": a foreign guide kills an ibex; the gorge-houses refuse to guide that power's caravans for a year.
- Decision "Sell the Guides": hire out pass guides to an army (gold; that army gains mountain movement).
- Event "Bones in the Upper Gorge": the remnant's dead are found; the pass-lords decide whether to bury them or sell their iron.

### Wahatud (tree `shared_east_lands`, Wahatud module)

**Roots.** The dune-sea clans live by a compact with the sand golems and by the tale of the white dune, where a dying clan-mother left her last water for a stranger and her clan found a spring and a white feather; water is given to refugees before their names, left on the white dune for nobody, and the Well-Moot of 4A 1637 was sworn over the feather.
**Sign.** A single long white feather standing upright, the feather of the white dune.

**Focus branches:**
1. *Water Before the Name.* Refugee policy: the oases take every refugee of the eastern wars (existing divergence `wahatud_shelters_east`), gaining manpower and the Free Crowns' opinion, at a supply cost.
2. *Gold for the Golems.* The compact with the sand golems: returning gold to a buried well reopens it (state resource and supply), while robbing one wakes the golems (attrition on the dune roads).
3. *The Guides Who Do Not Fear.* Desert guides: any army crossing the dune sea needs Wahatud's guides or suffers heavy attrition; the existing divergence `wahatud_guides_withheld`.
4. *Water on the White Dune.* Faith and stability: the monthly offering, and a sky-watch chain that never shows an angel but can find a new spring.
5. *The Moot Holds.* Internal: the Keeper of the Moot rotates each year among the clans, with clan-opinion events.

**Identity.** *The Oases of the Feather.* Entitled by the white dune and the Well-Moot. Wahatud. Requires Water Before the Name, the golem compact kept for five years, and no well poisoned in its land. Changes: name and the feather banner; refugees settle as population in oasis states; a well poisoned by an enemy gives Wahatud a war goal against the poisoner.

**Events and decisions.**
- Event "A Feather on the Sand": an omen of a new spring, never of an angel's coming.
- Event "The Golems Walk": a robbed well wakes the golems, who close the dune roads.
- Decision "Leave Water for Nobody": the monthly offering (stability, a small chance of a new spring).
- Event "A Host Asks for Guides": an army of the coalition asks to cross the dune sea.

## Counts

| Item | Count |
| --- | --- |
| Realms | 2 |
| Focus-branch proposals | 10 (five per realm) |
| New identities | 2 |
| Event and decision proposals | 8 |
