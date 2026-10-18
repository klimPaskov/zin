# ZIN overhaul plan

ZIN becomes a full Hearts of Iron IV overhaul set in Erdae in the Fourth Age, during the Golden King's reign. It aims past the scope of the Lord of the Rings mod: every country gets real content, every major power its own mechanic, and the interface is themed for Erdae. All art is new. Nothing is copied from any other mod.

Owner decisions (17 October 2026):
- Start during the Golden King's reign. His hidden murder by Afrit, the succession war and Einendil happen during play.
- Erdae calendar in the Fourth Age, not 1936.
- Art: every asset is image-generated (owner, 17 October 2026); code only slices, resizes and converts it.
- Erdae only: the Crossing to Earth is out of scope.
- Priority now: mechanics, interface, countries and states.
- Lore (18 October 2026): the owner's vault, `docs/lore/vault/`, is canon; follow its Canon Policy (established versus proposed). Eindil is the canonical spelling. After the Golden King's murder, Afrit takes the throne openly; the War of the Last Crowns follows on five fronts, ending with Eindil's coronation. The central sea is much wider.

## Stages

| Stage | Delivers | Done when |
| --- | --- | --- |
| 1. Foundation | Calendar and start date, defines, Erdae ideologies and alignments, peoples, game rules, countries and states pass (names, leaders, flags, resources, categories), themed top bar and panels | A campaign starts, runs 60 days and reloads in the Linux game with no new errors from ZIN files |
| 2. Warfare | Fantasy unit types, equipment, technologies and doctrines replacing the modern ones; navies of galleys and longships; beasts instead of aircraft where it fits | Every country can recruit, research and fight with the new roster |
| 3. Aenor | Aenor Unity and Afrit's Influence meters, the Golden Court, satellite charters, the death clock, the hidden murder, the four-camp succession war, Einendil | The succession can resolve each way in test runs |
| 4. Dark powers | Volgan's dominion and grave musters, Afrit's footholds and the Worshipdom, Zol's Mistake and its roaming dead | Each power plays differently and the AI uses its mechanic |
| 5. Every country | Unique trees for the great powers; one tree per region for every other country, with branches by people and alignment; no country falls back to vanilla | All 297 countries have Erdae content |
| 6. World systems | The Great Wall of Aenor, Glo and the Castle of Yeldenne, dragons, the Lost Cause council, the three endings | Each ending is reachable |

## Foundation design

- **Calendar.** The game starts in Fourth Age year 1001 (a placeholder until the lore fixes the year). The start date, end date and every history date move together. The date display reads as the Fourth Age.
- **Ideologies.** Four Erdae ideologies replace the modern ones, each with stances for different peoples:
  - **Light:** cooperative and protective rule.
  - **Dominion:** crowns and courts that rule by force or wealth (the Golden Court).
  - **Shadow:** Volgan, Afrit and the dead.
  - **Wild:** unaligned, tribal and isolationist peoples.
- **Peoples.** Each country carries one people (men, elves, giants, ents, dwarves, yeti, orcs and goblins, trolls and ogres, the dead, demons, mycids). Its people decides recruitment, attrition, terrain skill, unit access and some focus branches.
- **Countries and states.** Every country gets an image-generated flag, a leader, ministers, a people and an ideology. Every state gets a category, manpower, resources and buildings that fit its region, so the Cold Lands, the South Lands desert and the Dead Lands play differently.
- **Interface.** A themed top bar shows each country's own meters. Mechanic panels open from it: Aenor's court, Afrit's footholds, Volgan's dominion. Custom frames, colours and a loading screen complete it.

## Engineering rules

- Content is produced by deterministic generators in this repository and written through the shared atomic rewrite engine.
- Every stage passes offline validation with the HOI4 Agent Tools inspectors and an isolated Linux game run under the shared lock.
- The Windows game, launcher and settings stay untouched.
- Text is short and keyed for later replacement by the owner's lore.
