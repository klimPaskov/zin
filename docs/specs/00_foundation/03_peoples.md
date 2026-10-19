# Peoples

**Status:** Ready. Reviewed 19 October 2026 against CONVENTIONS "Status"; integrated 19 October 2026. **Priority:** 3. **Phase:** 3.

## Purpose

Each country belongs to a people of Erdae. The people sets the country's national character (manpower, attrition, combat strengths), its portraits and names, which units it can raise, and which focus branches and events it sees. This spec fixes the people list, what each people does in war, economy and politics, which vault peoples are still missing and when to add them, and the hooks other systems use.

## Lore basis

**Established (vault, *Peoples of Erdae*, *Hierarchy of Being*):**

- Beings below the spirits are **Great Folk** (immortal: elves, angels, demons) and **Common Folk** (mortal: men, dwarves). Only Common Folk are mortal.
- The vault does **not** settle the rank, mortality or origin of giants, ents, yeti, mycids, arcanists, orcs, goblins, trolls, ogres, grave hosts or undead. Do not infer it from their names.
- Elves: the peaceful democratic elves of the Magical Forest; the **Sunhot elves** of the Lands of the Sun, over three metres tall, among the strongest and most peaceful; the **Gala elves** of the Lands of the Sun under Lorien; the **God Forest Keepers**. The relationship of Gala and Sunhot elves is **open**.
- Demons are corrupted angels (existing account). They include the Shachihata, the Netherborn serving Volgan, and Afrit's demons.
- Men include the Middle Kingdom peoples, Dondor Brutes, Noris camel warriors, Gunwaith clans, Girdon wardens, Buldor companies, Aenor Isle houses and Goodin Sunfolk; the ancient Ainu are the First Men (exact meaning open).
- Dwarves are Common Folk; **their homeland is open**.
- Giants: Hiloron giants, Titanos ice giants, Forgotten Giants. Ents: Kilinti Forest ("Kilinti's ents and forest peoples", *Middle Lands and Aenor*). Yeti; mycids of the Mushroom Forest; arcanists of the Zhen Hills; orcs, goblins, trolls, ogres, grave hosts, undead.
- Monster societies are independent and diverse, not one obedient faction. Dark Lands men, orcs, goblins, trolls, ogres, giants and demons live under separate rulers.
- Dragons come from Dragon Mountain and do not form a country. Elven powers can command them; Afrit can through corruption.
- Volgan's realm holds grave hosts, Netherborn demons, orcs, ogres, monster clans and necromantic orders.
- Zol's dead are sustained by his magic; only potent magic, such as Glo's, can end them. Elzon's dead in Aenor faded and cost magic to renew.
- Elves and men have been estranged since Edran's attack on the Dead Lands; the Elven Refusal still stands.
- Roka belongs to a people of large rhinoceros-headed humanoids of the Abyss; **their name is open**.

**Proposed (this spec):** every modifier, the split of orcs and goblins, the minor-people mechanism, the regional tradition flags, the reserved keys and all numbers.

## Design

### 1. The ten peoples in game

Built by `tools/content/modules/peoples.mjs` (`PEOPLES`): each is a permanent national spirit `zin_people_<key>` and a country flag of the same name, applied once in `on_startup` (`common/on_actions/zin_startup.txt`). Each people also has a graphical culture `zin_<key>_gfx` (`modules/units3d.mjs`, in game since 19 October 2026) and two portraits per sex (`modules/portraits.mjs`). Counts are from `docs/design/countries.csv` (19 October 2026).

| Key | Name | Countries | Where | Order (vault) | 3D infantry today |
| --- | --- | ---: | --- | --- | --- |
| `men` | Men | 209 | Everywhere | Common Folk | yes |
| `elves` | Elves | 24 | Magical Lands; Gala Elves, Gala, North Gala | Great Folk | yes (warden) |
| `sun_elves` | Sunhot Elves | 41 | Lands of the Sun | Great Folk | no |
| `orcs` | Orcs and Goblins (to be renamed "Orcs") | 21 | Dark Lands holds, Goldoroth | open | yes (warrior) |
| `demons` | Demons | 3 | Demon, Dolon, Nezer | Great Folk | no |
| `giants` | Giants | 2 | Hiloron, Titanos | open | no |
| `the_dead` | Grave Hosts | 2 | Volgan, Zol | open | yes (revenant) |
| `ents` | Ents | 1 | Kilinti | open | no |
| `yeti` | Yeti | 1 | Yeti Lands | open | no |
| `trolls` | Trolls | 1 | Troll Forest | open | yes (brute) |

### 2. Roles and modifiers

Current modifiers stay unless the "target" column changes them. Every modifier named here exists in the 1.19.3 modifier documentation; the builder's `assertModifiers` rejects any other.

| People | War | Economy | Politics | Current modifiers | Target changes |
| --- | --- | --- | --- | --- | --- |
| Men | Numerous, adaptable; every unit type | Builders and traders | Every stance; mortal rulers | `recruitable_population_factor 0.1`, `production_speed_buildings_factor 0.05` | add `monthly_population 0.1` |
| Elves | Few, skilled, patient; rangers and archers; only elven powers can command dragons (unit hook) | Small, long-lived, learned | Kinship councils; immortal rulers; slow to change | `research_speed_factor 0.1`, `army_org_factor 0.1`, `experience_gain_army_factor 0.1`, `recruitable_population_factor -0.35` | add `monthly_population -0.5`, `drift_defence_factor 0.2` |
| Sunhot Elves | Very strong, very few, reluctant | Rich land, small numbers | Sanctuaries; peaceful | `army_attack_factor 0.15`, `army_defence_factor 0.15`, `war_support_factor -0.1`, `recruitable_population_factor -0.5` | add `monthly_population -0.5`, `acclimatization_hot_climate_gain_factor 0.5` |
| Orcs (split, section 3) | Mass infantry and raiders | Poor, plundering | Tribes and warlords; quarrelsome | `recruitable_population_factor 0.25`, `army_org_factor -0.1`, `stability_factor -0.1`, `army_attack_factor 0.05` | add `equipment_capture_factor 0.1`; rename "Orcs" |
| Demons | Elite shock troops | Little | Dread lordship | `army_attack_factor 0.2`, `recruitable_population_factor -0.4`, `stability_factor -0.05` | none |
| Giants | Heavy shock and siege | Quarry and herd | Clans, wardens | `army_attack_factor 0.2`, `army_speed_factor -0.05`, `recruitable_population_factor -0.5` | add `breakthrough_factor 0.1` |
| Grave Hosts | Hosts raised by mechanics, not by population | None of their own | Grave or dread rule | `recruitable_population_factor 0.4`, `attrition -0.25`, `stability_factor 0.2`, `research_speed_factor -0.2` | `recruitable_population_factor -0.5` (the living are few; Volgan's and Zol's hosts come from their mechanics), add `supply_consumption_factor -0.3` |
| Ents | Unbreakable forest defence | Forests | Wardens | `army_defence_factor 0.25`, `army_speed_factor -0.2`, `recruitable_population_factor -0.6` | add `army_core_defence_factor 0.1` |
| Yeti | Winter warfare | Herding, hunting | Clans | `winter_attrition -0.5`, `acclimatization_cold_climate_gain_factor 0.5`, `heat_attrition 0.25`, `recruitable_population_factor -0.25` | none |
| Trolls | Brutal shock, poorly led | Little | Tribes | `army_attack_factor 0.15`, `army_org_factor -0.1`, `recruitable_population_factor -0.2` | none |

**Text fixes.** The Grave Hosts description in `peoples.mjs` still says "they never tire, never starve and never forget". The vault does not establish this. It becomes "The restless dead, raised and held by dark power." Descriptions must not state a people's rank or mortality unless the vault does: Men may be called mortal, and elves and demons Great Folk; no other description may use "mortal", "immortal", "Great Folk" or "Common Folk".

### 3. Missing peoples

| People | Vault status | Add when | How (*proposed*) |
| --- | --- | --- | --- |
| Goblins | Established, distinct from orcs | Phase 3 | New key `goblins`, "Goblins". Modifiers `recruitable_population_factor 0.3`, `army_speed_factor 0.05`, `army_attack_factor -0.05`, `stability_factor -0.1`. Which Dark Lands holds are goblin holds is the owner's question ([OPEN_QUESTIONS](../OPEN_QUESTIONS.md), short list 12, foundation 8); the work proceeds on its proposal: goblins are a minor people of some orc holds, every Dark Lands hold stays `orcs` as its primary people, and the owner can change a row in `countries.csv`. |
| Ogres | Established; in Volgan's realm and the Dark Lands | Phase 3 | New key `ogres`, "Ogres". Modifiers `army_attack_factor 0.15`, `army_org_factor -0.05`, `recruitable_population_factor -0.3`. A minor people of Volgan; primary only where the owner assigns it. |
| Dwarves | Established Common Folk; **homeland open** | Only after the owner names a homeland | Reserve key `dwarves`. No dwarven country and no primary assignment until then. The "Dwarc Forest" label on the North Lands sheet is not evidence of a homeland. Modifiers when added: `production_factory_efficiency_gain_factor 0.1`, `army_defence_factor 0.05`, `recruitable_population_factor -0.1`. |
| Mycids | Established, Mushroom Forest (Magical Lands) | When the map names the Mushroom Forest as a state | Reserve key `mycids`. The Mushroom Forest is a label today; no country holds a region by that name. The work proceeds on the short-list proposal: the Mushroom Forest lies inside an elven realm, and mycids become a minor people of that realm. No modifiers until the vault describes them. |
| Arcanists | Established, Zhen Hills | When the Zhen Hills are placed on the map | Reserve key `arcanists`. The Zhen Hills are not on any sheet label. Nothing until placed. |
| Angels | Established Great Folk; history not written | After the owner writes their history | Reserve key `angels`. No country, unit or event. |

**Subgroups that are not separate keys** (they use an existing key and get flavour only):

| Group | Key | Note |
| --- | --- | --- |
| Gala elves | `elves` | Their relationship to the Sunhot elves is open: text never states it |
| God Forest Keepers | `elves` | God Forest is a Lands of the Sun label; which country is theirs is open (foundation 9); until answered no country is named theirs |
| Netherborn | `demons` | Volgan's demons; minor people of Volgan |
| Shachihata | `demons` | Beyond the map today (one of eight off-map polities) |
| Forgotten Giants | `giants` | Place not fixed |
| Undead | `the_dead` | Same key as grave hosts; Zol's and Volgan's dead differ through their mechanics (foundation 10 proceeds on one key) |
| Ainu (First Men) | none | A past lineage, not a living people at the start |
| Roka's people | none | Unnamed in canon: do not name them; no country |
| Dragons | none | Not a people or a country; [04_magic_and_world_systems.md](../03_gameplay/04_magic_and_world_systems.md) and the air layer (S6) own them |

### 4. Minor peoples

Many realms mix peoples (Volgan's especially). A country has **one primary people** (idea and flag `zin_people_<key>`) and up to **three minor peoples** (flag `zin_people_minor_<key>` only, no modifiers). Minor peoples unlock that people's units and focus branches but not its national spirit. The cap is three (*proposed*) so that Volgan can carry every people the vault places in his realm.

Starting minor peoples (*proposed*): Volgan: `demons`, `orcs`, and `ogres` once the key exists; Goldoroth: `trolls`; Kilinti: `men` (its forest peoples); Magical Forest and other elven powers: none; Aenor: none. The owner sets the rest in `countries.csv` (column `minor_peoples`, [04_countries_and_states.md](04_countries_and_states.md) section 3). `peoples.mjs` holds these defaults, as it holds the primary defaults today (`BY_NAME`).

### 5. Regional traditions of men (*proposed*)

Men are one key, but the vault names regional traditions. Each becomes a country flag `zin_tradition_<key>` used by focus branches, unit names and events, with no modifiers. It is set in `on_startup` beside the people flag.

| Flag | Tradition | Countries |
| --- | --- | --- |
| `zin_tradition_middle_kingdom` | Middle Kingdom peoples | Aenor, the Concord dominions whose people is `men`, and Fotan (*proposed*: a free Middle Lands realm of men that the shared Concord tree treats as Middle Kingdom kin; `countries.csv` row `tradition = middle_kingdom`, a phase 1 data fix) |
| `zin_tradition_dondor_brutes` | Dondor Brutes | Dondor |
| `zin_tradition_camel_riders` | Noris camel warriors | Noris |
| `zin_tradition_gunwaith_clans` | Gunwaith clans | Gunwaith |
| `zin_tradition_girdon_wardens` | Girdon wardens | Girdon |
| `zin_tradition_buldor_companies` | Buldor companies | Buldor |
| `zin_tradition_isle_houses` | Aenor Isle houses | Asgard |
| `zin_tradition_sunfolk` | Goodin Sunfolk | Goodin |
| `zin_tradition_rangers` | Selen's rangers (established) | Selen |
| `zin_tradition_riders` | The riders of Huhun (established); placed on Hunhun, on the short-list proposal that Huhun and Hunhun are one place (short list 15) | Hunhun |

### 6. Hooks other systems use

| Hook | Name | Use |
| --- | --- | --- |
| Primary people | flag and idea `zin_people_<key>` | Focus condition `{ "people": "<key>" }` in the [focus compiler](../05_focus_trees/00_format_and_compiler.md) |
| Minor people | flag `zin_people_minor_<key>` | Unit access, branches |
| Scripted trigger | `zin_people_is_<key>` | Primary people (`has_country_flag = zin_people_<key>`) |
| Scripted trigger | `zin_people_includes_<key>` | Primary or minor |
| Scripted trigger | `zin_people_is_great_folk` | Elves, Sunhot elves, demons (and angels if ever added). Nothing else. |
| Scripted trigger | `zin_people_is_common_folk` | Men (and dwarves when added). Nothing else. |
| Unit access | People technologies with `allow = { zin_people_includes_<key> = yes }` | [01_warfare.md](../03_gameplay/01_warfare.md) |
| Portraits | `portraits/zin_portraits.txt` per tag by people | Today 2 per sex per people (`VARIANTS = 2`); target 6, plus unique portraits for every named character ([02_characters.md](../02_lore/02_characters.md)) |
| Names | `common/names/zin_names.txt` (`modules/names.mjs`) | Today by region; target by region and people (an orc hold and a human town in the same region sound different) |
| Graphical culture | `zin_<people>_gfx` in `common/graphicalculturetype.txt` and every country file | In game since 19 October 2026; the 2D culture is still `western_european_2d`. 3D units per people come from the warfare and art specs ([08_art_and_assets](../08_art_and_assets/)) |
| Rulers | Great Folk rulers never expire; Common Folk rulers may be replaced by succession events (phase 8) | [02_ideologies_and_politics.md](02_ideologies_and_politics.md) |
| Resistance | `the_dead` controllers raise `resistance_target` in living states they occupy | warfare, occupation |
| Opinion | Opinion modifier `zin_opinion_old_estrangement` (−10; N6) of elven countries toward Aenor (established estrangement). It is defined in `00_zin_opinion_modifiers.txt` today | [03_diplomacy_and_factions.md](../03_gameplay/03_diplomacy_and_factions.md) applies it |
| Manpower density | Per people factor | [04_countries_and_states.md](04_countries_and_states.md) section 7 |

## Implementation

| File | Change | Written by |
| --- | --- | --- |
| `common/ideas/zin_peoples.txt` | 10 ideas today; add `goblins`, `ogres`; rename `orcs` to "Orcs"; target modifiers | `tools/content/modules/peoples.mjs` (`PEOPLES`) |
| `common/on_actions/zin_startup.txt` | Primary idea and flag (today); minor flags and tradition flags (new) | `peoples.mjs`, called from `build.mjs`, reading `countries.csv` columns `people`, `minor_peoples`, `tradition` |
| `common/scripted_triggers/zin_peoples.txt` (new) | `zin_people_is_<key>`, `zin_people_includes_<key>`, `zin_people_is_great_folk`, `zin_people_is_common_folk` | `peoples.mjs`, generated from `PEOPLES` |
| `localisation/english/zin_peoples_l_english.yml` | Names and descriptions, with the text fixes | `peoples.mjs` |
| `common/graphicalculturetype.txt` | Add `zin_goblins_gfx`, `zin_ogres_gfx` | `modules/units3d.mjs` (`cultureOf`) |
| `gfx/interface/ideas/zin_people_<key>.dds`, `interface/zin_peoples.gfx` | Emblems for the new keys | image jobs in `tools/content/art/asset-jobs.mjs`, recorded in `art/source/provenance.jsonl`; sliced by the art module |
| `gfx/leaders/zin/<people>_<sex>_<n>.dds`, `portraits/zin_portraits.txt` | Portraits for the new keys; more variants | `asset-jobs.mjs` jobs; `modules/portraits.mjs` |

Reserved keys (`dwarves`, `mycids`, `arcanists`, `angels`) go in a new `PEOPLES_RESERVED` list in `peoples.mjs`. `modules/countries.mjs` rejects them in `countries.csv` until they move into `PEOPLES`, as it rejects unknown keys today.

No events of its own. People flavour events belong to regional event specs.

## AI

- The AI does not choose peoples. People-gated focus branches carry AI weights in their trees.
- AI army templates come from the warfare spec and use people units where available.
- Peoples with negative recruitable population (elves, Sunhot elves, giants, ents) get an AI strategy to keep smaller, higher-quality armies (warfare spec).

## Acceptance

1. **Build:** every country has exactly one primary people; the build fails on an unknown or reserved key (negative test: a planted `dwarves` row).
2. **Build:** `zin_people_is_great_folk` is true only for elves, Sunhot elves and demons; a text scan of `zin_peoples_l_english.yml` finds "mortal", "immortal", "Great Folk" and "Common Folk" only in the descriptions of men, elves, Sunhot elves and demons (negative test: the old Grave Hosts text fails).
3. **Build:** goblins and ogres exist as ideas with emblems and graphical cultures; no country has them as primary people without an owner row.
4. **Build:** no dwarven, mycid, arcanist or angel country exists; no country has more than three minor peoples.
5. **Linux run (start case of Volgan):** a console check (`has_country_flag`) shows `zin_people_the_dead`, `zin_people_minor_demons` and `zin_people_minor_orcs`; Volgan's and Zol's recruitable manpower at the start is below 10% of Aenor's.
6. **Build:** every people modifier exists in the modifier documentation.

## Open questions

All proceed on their proposals; the owner's copies are in [OPEN_QUESTIONS.md](../OPEN_QUESTIONS.md) (short list 12 and 15, foundation 6–10).

1. Where is the dwarven homeland? Until answered, dwarves appear nowhere.
2. Is the Mushroom Forest its own country of mycids, or part of an elven realm? Proceeds on: part of an elven realm.
3. Where are the Zhen Hills? Until placed, no arcanists.
4. Which Dark Lands holds are goblins rather than orcs, and which are ogres? Proceeds on: minor peoples of some orc holds; primaries stay `orcs`.
5. Who lives in the Castle of Yeldenne besides Horos? Proceeds on: the country's people stays `men`.
6. Which country is the God Forest Keepers'? Proceeds on: none named.
7. Should Zol's dead and Volgan's grave hosts be separate peoples? Proceeds on: one key, `the_dead`.
