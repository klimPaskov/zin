# Peoples

**Status:** Draft. **Priority:** 3. **Phase:** 3.

## Purpose

Each country belongs to a people of Erdae. The people sets the country's national character (manpower, attrition, combat strengths), its portraits and names, which units it can raise, and which focus branches and events it sees. This spec fixes the people list, what each people does in war, economy and politics, which vault peoples are still missing and when to add them, and the hooks other systems use.

## Lore basis

**Established (vault, *Peoples of Erdae*, *Hierarchy of Being*):**

- Beings below the spirits are **Great Folk** (immortal: elves, angels, demons) and **Common Folk** (mortal: men, dwarves). Only Common Folk are mortal.
- The vault does **not** settle the rank, mortality or origin of giants, ents, yeti, mycids, arcanists, orcs, goblins, trolls, ogres, grave hosts or undead. Do not infer it from their names.
- Elves: the peaceful democratic elves of the Magical Forest; the **Sunhot elves** of the Lands of the Sun, over three metres tall, among the strongest and most peaceful; the **Gala elves** under Lorien; the **God Forest Keepers**. The relationship of Gala and Sunhot elves is **open**.
- Demons are corrupted angels (existing account). They include the Shachihata, the Netherborn serving Volgan, and Afrit's demons.
- Men include the Middle Kingdom peoples, Dondor Brutes, Noris camel warriors, Gunwaith clans, Girdon wardens, Buldor companies, Aenor Isle houses and Goodin Sunfolk; the ancient Ainu are the First Men (exact meaning open).
- Dwarves are Common Folk; **their homeland is open**.
- Giants: Hiloron giants, Titanos ice giants, Forgotten Giants. Ents: Kilinti Forest. Yeti; mycids of the Mushroom Forest; arcanists of the Zhen Hills; orcs, goblins, trolls, ogres, grave hosts, undead.
- Monster societies are independent and diverse, not one obedient faction. Dark Lands men, orcs, goblins, trolls, ogres, giants and demons live under separate rulers.
- Dragons come from Dragon Mountain and do not form a country. Elven powers can command them; Afrit can through corruption.
- Volgan's realm holds grave hosts, Netherborn demons, orcs, ogres, monster clans and necromantic orders.
- Zol's dead are sustained by his magic; only potent magic, such as Glo's, can end them. Elzon's dead in Aenor faded and cost magic to renew.
- Elves and men have been estranged since Edran's attack on the Dead Lands; the Elven Refusal still stands.
- Roka belongs to a people of large rhinoceros-headed humanoids of the Abyss; **their name is open**.

**Proposed (this spec):** every modifier, the split of orcs and goblins, the minor-people mechanism, the reserved keys and all numbers.

## Design

### 1. The ten peoples today

Built by `modules/peoples.mjs`: each is a permanent national spirit `zin_people_<key>` and a country flag of the same name, applied in `on_startup`.

| Key | Name | Countries | Where | Order (vault) |
| --- | --- | ---: | --- | --- |
| `men` | Men | 209 | Everywhere | Common Folk |
| `elves` | Elves | 24 | Magical Lands; Gala Elves, Gala, North Gala | Great Folk |
| `sun_elves` | Sunhot Elves | 41 | Lands of the Sun | Great Folk |
| `orcs` | Orcs and Goblins | 21 | Dark Lands holds, Goldoroth | open |
| `demons` | Demons | 3 | Demon, Dolon, Nezer | Great Folk |
| `giants` | Giants | 2 | Hiloron, Titanos | open |
| `the_dead` | Grave Hosts | 2 | Volgan, Zol | open |
| `ents` | Ents | 1 | Kilinti | open |
| `yeti` | Yeti | 1 | Yeti Lands | open |
| `trolls` | Trolls | 1 | Troll Forest | open |

### 2. Roles and modifiers

Current modifiers stay unless the "target" column changes them. Every modifier exists in the game's documentation.

| People | War | Economy | Politics | Current modifiers | Target changes |
| --- | --- | --- | --- | --- | --- |
| Men | Numerous, adaptable; every unit type | Builders and traders | Every stance; mortal rulers | `recruitable_population_factor 0.1`, `production_speed_buildings_factor 0.05` | add `monthly_population 0.1` |
| Elves | Few, skilled, patient; rangers and archers; only elven powers can command dragons (unit hook) | Small, long-lived, learned | Kinship councils; immortal rulers; slow to change | `research_speed_factor 0.1`, `army_org_factor 0.1`, `experience_gain_army_factor 0.1`, `recruitable_population_factor -0.35` | add `monthly_population -0.5`, `drift_defence_factor 0.2` |
| Sunhot Elves | Very strong, very few, reluctant | Rich land, small numbers | Sanctuaries; peaceful | `army_attack_factor 0.15`, `army_defence_factor 0.15`, `war_support_factor -0.1`, `recruitable_population_factor -0.5` | add `monthly_population -0.5`, `acclimatization_hot_climate_gain_factor 0.5` |
| Orcs (split, below) | Mass infantry and raiders | Poor, plundering | Tribes and warlords; quarrelsome | `recruitable_population_factor 0.25`, `army_org_factor -0.1`, `stability_factor -0.1`, `army_attack_factor 0.05` | add `equipment_capture_factor 0.1`; rename "Orcs" |
| Demons | Elite shock troops | Little | Dread lordship | `army_attack_factor 0.2`, `recruitable_population_factor -0.4`, `stability_factor -0.05` | none |
| Giants | Heavy shock and siege | Quarry and herd | Clans, wardens | `army_attack_factor 0.2`, `army_speed_factor -0.05`, `recruitable_population_factor -0.5` | add `breakthrough_factor 0.1` |
| Grave Hosts | Hosts raised by mechanics, not by population | None of their own | Grave or dread rule | `recruitable_population_factor 0.4`, `attrition -0.25`, `stability_factor 0.2`, `research_speed_factor -0.2` | `recruitable_population_factor -0.5` (the living are few; Volgan's and Zol's hosts come from their mechanics), add `supply_consumption_factor -0.3` |
| Ents | Unbreakable forest defence | Forests | Wardens | `army_defence_factor 0.25`, `army_speed_factor -0.2`, `recruitable_population_factor -0.6` | add `army_core_defence_factor 0.1` |
| Yeti | Winter warfare | Herding, hunting | Clans | `winter_attrition -0.5`, `acclimatization_cold_climate_gain_factor 0.5`, `heat_attrition 0.25`, `recruitable_population_factor -0.25` | none |
| Trolls | Brutal shock, poorly led | Little | Tribes | `army_attack_factor 0.15`, `army_org_factor -0.1`, `recruitable_population_factor -0.2` | none |

**Text fixes.** The Grave Hosts description says "they never tire, never starve and never forget". The vault does not establish this. Proposed: "The restless dead, raised and held by dark power." Descriptions must not state a people's rank or mortality unless the vault does.

### 3. Missing peoples

| People | Vault status | Add when | How (proposed) |
| --- | --- | --- | --- |
| Goblins | Established, distinct from orcs | Phase 3 | New key `goblins`, "Goblins". Modifiers `recruitable_population_factor 0.3`, `army_speed_factor 0.05`, `army_attack_factor -0.05`, `stability_factor -0.1`. The owner assigns goblin holds in `countries.csv`; until then every Dark Lands hold stays `orcs`. |
| Ogres | Established; in Volgan's realm and the Dark Lands | Phase 3 | New key `ogres`. Modifiers `army_attack_factor 0.15`, `army_org_factor -0.05`, `recruitable_population_factor -0.3`. Minor people of Volgan; primary only where the owner assigns it. |
| Dwarves | Established Common Folk; **homeland open** | Only after the owner names a homeland | Reserve key `dwarves`. No dwarven country and no primary assignment until then. The "Dwarc Forest" label on the North Lands sheet is not evidence of a homeland. Proposed modifiers when added: `production_factory_efficiency_gain_factor 0.1`, `army_defence_factor 0.05`, `recruitable_population_factor -0.1`. |
| Mycids | Established, Mushroom Forest (Magical Lands) | When the map names the Mushroom Forest as a state | Key `mycids`. The Mushroom Forest is a label today; no country holds a region by that name. The owner decides whether it is its own country or a minor people of the realm that holds it. No modifiers until the vault describes them. |
| Arcanists | Established, Zhen Hills | When the Zhen Hills are placed on the map | Reserve key `arcanists`. The Zhen Hills are not on any sheet label. Nothing until placed. |
| Angels | Established Great Folk; history not written | After the owner writes their history | Reserve key `angels`. No country, unit or event. |

**Subgroups that are not separate keys** (they use an existing key and get flavour only):

| Group | Key | Note |
| --- | --- | --- |
| Gala elves | `elves` | Their relationship to the Sunhot elves is open: text never states it |
| God Forest Keepers | `elves` | God Forest is a Lands of the Sun label; owner assigns the country |
| Netherborn | `demons` | Volgan's demons; minor people of Volgan |
| Shachihata | `demons` | Beyond the map today (one of eight off-map polities) |
| Forgotten Giants | `giants` | Place not fixed |
| Undead | `the_dead` | Same key as grave hosts; Zol's and Volgan's dead differ through their mechanics |
| Ainu (First Men) | none | A past lineage, not a living people at the start |
| Roka's people | none | Unnamed in canon: do not name them; no country |
| Dragons | none | Not a people or a country; the world systems spec owns them |

### 4. Minor peoples

Many realms mix peoples (Volgan's especially). A country has **one primary people** (idea and flag `zin_people_<key>`) and up to **two minor peoples** (flag `zin_people_minor_<key>` only, no modifiers). Minor peoples unlock that people's units and focus branches but not its national spirit.

Proposed starting minor peoples: Volgan: `demons`, `orcs` (and `ogres` once added); Magical Forest and other elven powers: none; Goldoroth: `trolls`; Kilinti: `men` (forest peoples, established "ents and forest peoples"); Aenor: none. The owner sets the rest in `countries.csv`.

### 5. Regional traditions of men (proposed)

Men are one key, but the vault names regional traditions. Each becomes a country flag `zin_tradition_<key>` used by focus branches, unit names and events, with no modifiers.

| Flag | Tradition | Countries |
| --- | --- | --- |
| `zin_tradition_middle_kingdom` | Middle Kingdom peoples | Aenor and Concord dominions |
| `zin_tradition_dondor_brutes` | Dondor Brutes | Dondor |
| `zin_tradition_camel_riders` | Noris camel warriors | Noris |
| `zin_tradition_gunwaith_clans` | Gunwaith clans | Gunwaith |
| `zin_tradition_girdon_wardens` | Girdon wardens | Girdon |
| `zin_tradition_buldor_companies` | Buldor companies | Buldor |
| `zin_tradition_isle_houses` | Aenor Isle houses | Asgard |
| `zin_tradition_sunfolk` | Goodin Sunfolk | Goodin |
| `zin_tradition_rangers` | Selen's rangers (established) | Selen |
| `zin_tradition_riders` | Riders of Hunhun (established) | Hunhun |

### 6. Hooks other systems use

| Hook | Name | Use |
| --- | --- | --- |
| Primary people | flag and idea `zin_people_<key>` | Focus condition `{ "people": "<key>" }` in the [focus compiler](../05_focus_trees/00_format_and_compiler.md) |
| Minor people | flag `zin_people_minor_<key>` | Unit access, branches |
| Scripted trigger | `zin_people_is_<key>` | Primary people |
| Scripted trigger | `zin_people_includes_<key>` | Primary or minor |
| Scripted trigger | `zin_people_is_great_folk` | Elves, Sunhot elves, demons (and angels if ever added). Nothing else. |
| Scripted trigger | `zin_people_is_common_folk` | Men (and dwarves when added). Nothing else. |
| Unit access | People technologies with `allow = { zin_people_includes_<key> = yes }` | Warfare spec in [03_gameplay](../03_gameplay/) |
| Portraits | `portraits/zin_portraits.txt` per tag by people | Today 2 per sex per people; target 6, plus unique portraits for every named character |
| Names | `common/names/zin_names.txt` | Today by region; target by region and people (an orc hold and a human town in the same region sound different) |
| Graphical culture | `common/countries/*.txt` | Today every country is `western_european_gfx`; the 3D unit sets per people replace it ([08_art_and_assets](../08_art_and_assets/)) |
| Rulers | Great Folk rulers never expire; Common Folk rulers may be replaced by succession events (Phase 8) | politics |
| Resistance | `the_dead` controllers raise `resistance_target` in living states they occupy | warfare, occupation |
| Opinion | Static opinion modifier `zin_opinion_old_estrangement` (-10) of elven countries toward Aenor (established estrangement) | diplomacy spec |
| Manpower density | Per people target in [04_countries_and_states.md](04_countries_and_states.md) | states |

## Implementation

| File | Change | Generator |
| --- | --- | --- |
| `common/ideas/zin_peoples.txt` | 10 ideas now; add `goblins`, `ogres`; rename `orcs` to "Orcs"; target modifiers | `modules/peoples.mjs` |
| `common/on_actions/zin_startup.txt` | Primary idea and flag; minor flags; tradition flags | `modules/peoples.mjs` reading `countries.csv` columns `people`, `minor_peoples`, `tradition` |
| `common/scripted_triggers/zin_peoples.txt` | `zin_people_is_<key>`, `zin_people_includes_<key>`, `zin_people_is_great_folk`, `zin_people_is_common_folk` | new, generated from `PEOPLES` |
| `localisation/english/zin_peoples_l_english.yml` | Names and descriptions | same |
| `gfx/interface/ideas/zin_people_<key>.dds` | Emblems for the new keys (image-generated) | art module |
| `gfx/leaders/zin/<people>_<sex>_<n>.dds` | Portraits for new keys; more variants | art module |

Reserved keys (`dwarves`, `mycids`, `arcanists`, `angels`) are listed in `PEOPLES_RESERVED`; the build rejects them in `countries.csv` until they move into `PEOPLES`.

No events of its own. People flavour events belong to regional event specs.

## AI

- The AI does not choose peoples. People-gated focus branches carry AI weights in their trees.
- AI army templates come from the warfare spec and use people units where available.
- Peoples with negative recruitable population (elves, Sunhot elves, giants, ents) get an AI strategy to keep smaller, higher-quality armies (warfare spec).

## Acceptance

1. Every country has exactly one primary people; the build fails on an unknown or reserved key.
2. `zin_people_is_great_folk` is true only for elves, Sunhot elves and demons; no text calls giants, ents, yeti, orcs, trolls or the dead Great Folk or Common Folk.
3. Goblins and ogres exist as ideas with emblems; no country is assigned to them without an owner row.
4. No dwarven, mycid, arcanist or angel country exists.
5. Volgan shows minor peoples demons and orcs; Zol and Volgan raise no large armies from recruitable population at start (their manpower comes from their mechanics).
6. Every people modifier exists in the modifier documentation (build check).

## Open questions

1. Where is the dwarven homeland? Until answered, dwarves appear nowhere.
2. Is the Mushroom Forest its own country of mycids, or part of an elven realm?
3. Where are the Zhen Hills?
4. Which Dark Lands holds are goblins rather than orcs, and which are ogres?
5. Who lives in the Castle of Yeldenne besides Horos? Today the country's people is men.
6. Which country is the God Forest Keepers'?
7. Should Zol's dead and Volgan's grave hosts be separate peoples rather than one key?
