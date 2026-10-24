# Characters of Aoaz, part 1 (R-65)

**Status:** Proposed. **Date:** 24 October 2026. **Requirement:** R-65 (rulers, heirs, advisors, commanders, wizards and named figures, with biographies from the histories; portraits later).
**Scope of this part:** the 74 realms of the regions `middle_lands`, `magical_lands`, `zols_mistake`, `ember_lands`, `east_lands`, `south_lands` and `lands_of_the_sun`. The other regions are part 2.
**Data:** `tools/content/data/world/characters/<region>.json`, one file per region.
**Sources:** the roster `tools/content/data/world/roster.json`, the histories `tools/content/data/world/history/<region>.json`, the regional dossiers `docs/lore/regions/`, the characters spec `docs/specs/02_lore/02_characters.md`, the lore vault figures `docs/lore/vault/03 - Figures/`, `docs/lore/references/magic_and_wizards.md`, `docs/lore/references/knowledge_layers.md`, the voice guide `docs/specs/02_lore/09_voice_and_style.md`, the language data `tools/content/data/world/languages.json` and `languages_new.json`, the cultures data, the existing traits in `common/country_leader/00_zin_leader_traits.txt` and the mechanic data that already defines characters (`mech_afrit.json`, `mech_powers_volgan_text.json`, the Gala, Magical Forest, Mirolon, Noris and Stabilo trees).

Every name in these files that the vault does not establish is proposed and replaceable; renaming a character never changes its id.

## 1. File shape

Each file is a JSON array of realms. A realm carries `tag`, `key`, `name`, `stance`, an optional `stanceNote`, `court` (`great`, `story`, `standard` or `open`), `ruler`, `heir`, `advisors`, `commanders`, `figures` and an optional `notes`.

A character carries:

| Field | Meaning |
| --- | --- |
| `id` | Rulers keep `<TAG>_zin_ruler`, except the contract ids `zin_volgan`, `zin_lorien`, `zin_zol_will` and `zin_aurevan`. Spec and mechanic characters keep their existing ids. New characters use `zin_<tree>_<who>` for major trees, `zin_regional_<tree>_<who>` for regional trees (tree id without `regional_`) and `zin_<realm key>_<who>` for realms on shared trees. |
| `name`, `given`, `house` | The shown name (it may carry a title, as the spec's names do), the given name used for uniqueness checks, and the house, line, clan or byname. |
| `title` | Rulers only: `native` (the realm's language, built from its dictionary; `null` where the language data has no word for the office) and `english`. |
| `office` | Everyone else: the office in plain English. |
| `gender`, `people` | `male`, `female` or `none`; the portrait people (`men`, `elves`, `sun_elves`, `giants`, `dwarves`, `gnomes`, `small_folk`, `goblins`, `hobgoblins`, `orcs`, `ogres`, `ents`, `tree_people`, `demons`, `the_dead`, `spirits`, `mycids`). |
| `born` | Mortals only (men, goblins, hobgoblins, orcs, ogres), on the shared count where 4A 1748 = 6816 (4A year y = 5068 + y). Absent for elves, giants, ents, Baelim, demons, spirits, the dead and the emblems. `null` with a note where the age is open (the Golden King, Bastian, Alleria) or the owning mechanic sets nothing. Dwarves, gnomes and the small folk are long-lived on their cards and get no year (owner question 6). |
| `slot` / `type`, `skill` | Advisors: the HOI4 slot. Commanders: `field_marshal`, `corps_commander` or `navy_leader`, with skills (`level`, `attack`, `defense`, `planning`, `logistics`; navy `maneuvering`, `coordination`). |
| `stance`, `traits` | Rulers carry the realm's stance and two or three leader traits; advisors one trait; commanders one or two unit-leader traits. |
| `bio` / `role` | Rulers: a biography of two to four sentences in the voice guide's chronicler register. Everyone else: a one-sentence role description. Both are player text. |
| `succession` | On the heir: how the realm chooses its next ruler. Where succession is elective, `heir` is a note object (`note`, `succession`) with no character. |
| `portrait` | Rulers: `appearance`, `dress`, `colours` (from the culture palettes and the owner's canon). Everyone else: one line. |
| `canon` | `E` established in the vault; `H` named by the histories; `S` named by the characters spec, a tree or a mechanic; `P` proposed here. |
| `definedBy` | Present where another module already defines the character; this file mirrors it and must not become a second definition (spec acceptance 8 and 9). |
| `recruit` | For figures and story characters: how they enter play. |
| `note`, `formerName`, `stanceNote`, `secret` | Design notes. **Never localised.** `secret` holds gated or sealed truth (knowledge layers A, C and V ids) so that the builder can keep it out of text; no other field contains it. |

## 2. Conventions applied

- **Rulers are the histories' rulers.** Where the characters spec or a tree named a ruler differently, the histories win and the older name is kept in `formerName`.
- **No ruler named after a place.** Where the histories gave a ruler the realm's own name with an ending, the ruler is renamed and the history name kept in `formerName`: Noleka of Noleksun (now Norene of Dalvis), Herrowyn of Herrodon (Ornwen), Andosiel of Andos Enda (Nymeth; the Speaker still bears the lake's name in office, as the bio says), Nolwe of Nolorim (Tavion), Lusmio of Lccimio (Fenith), Elvae of Elvana (Talayi), Igan of Igara (Ranin), Soyai of Soyano (Yunga), and Helia of Olen (Dolara), which was one letter from the realm name Halia.
- **Names come from each realm's language.** Stems, endings, sound laws and house styles follow the language data; each new given name was checked against the generator's banned substrings and modern blocklist, the reserved names (exact and within one letter for names of five letters or more), every other character of this part, the language samples, the histories and dossiers of all regions, the focus designs and the mechanic data. No two characters share a name; given names that sit one letter apart across different realms and cultures remain where the stem inventory is very small (Sunhot above all), and their full names differ.
- **Voice.** Bios and roles follow the voice guide: whole sentences, plain old words, British spelling, no hedging, no trailer words, no modern terms. All player text passes the banned-word data with no error and no review hit, except the word "knot" in the cord sense of the Old Knots faith (rule `bw_units_of_measure_006`), which needs an allowance for the Cursed Lands and Bloody Forest keys.
- **Knowledge layers.** No player text names Afrit, the Hidden Council, Kusven, Eindil, Erdu or Dunda; the Worshipdom shows only its public face; Volgan's arming is Mirolon's belief everywhere outside Mirolon (V9); the black ships are a fishermen's tale (V10); nobody administers Zol's Mistake in any text (V3); no being's age is stated (V23); what the Mirror shows stays belief (V18); no text says where Varner is (E4). Gated truths sit only in `secret`.
- **Established figures keep their canon.** The Golden King has no personal name, no birth year and no relatives; Aurevan the Deliverer is the Worshipdom's public god; Alleria is Selen's ranger and archer; Lorien keeps his Dardan memory; Volgan is a crowned wizard of green magic in a purple cloak with green glowing eyes (owner, K37); Varner and Golbran are story figures recruited by nobody; Bastian is a living human wizard of the Middle Lands with no age and no realm. Eindil and Kusven are absent.
- **Wizards.** At most one named wizard advisor per realm (magic reference 5.1, rule 5). The magic reference's proposed practitioners of my regions are placed as follows: Ederine Kordalis (Aenor theorist), Tanovan Selonis (Selen theorist), Tzaliar (Cursed Lands theorist), Lusithan (Herrodon theorist), Venaelia of the Beacons (Mirolon theorist), Palux (Puvulan theorist), Nurqas (Noris theorist), Helayi of the Noon (Tor Luni, where Godland lies), Ondeya of the Mirror (a Gala figure, since Heveneya holds the Mirror advisor seat) and Norael of the Lamp (an Aenor figure of the Houses, because Aenor has no high priest of its own, N10). New named wizards: Ilwaeth of the Singing Groves (Magical Forest) and Magister Pelina Shindia (Stabilo).
- **Emblems instead of persons.** The Will of Zol, the Rings at the Forest Edge (Mushroom Forest), the Keepers of the God Forest and the King of Demons (no name) are emblem leaders or titles, because the vault keeps who they are open.
- **Courts.** The great powers and story realms (Aenor, the Worshipdom, Magical Forest, Puvulan, Mirolon, Gala, Noris, Stabilo, Selen, Kingson, Hirolon) have fuller courts of up to six advisors, four commanders and named wizards; every other realm has a ruler, an heir or succession note, three advisors and two commanders (one naval where the realm has a fleet, otherwise two land). Zol's Mistake, the Mushroom Forest and the God Forest are `open`: see section 6.
- **Stances** follow `docs/design/countries.csv` where it has a row for the realm's old name, and are proposed by political form where it does not or where the row is a plain default; every departure carries a `stanceNote` (section 5).

## 3. Counts

| Region | Realms | Rulers | Heirs (as characters) | Advisors | Commanders | Figures | Characters |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| middle_lands | 23 | 23 | 6 | 74 | 49 | 2 | 154 |
| magical_lands | 11 | 11 | 1 | 36 | 21 | 2 | 71 |
| zols_mistake | 1 | 1 | 0 | 0 | 2 | 0 | 3 |
| ember_lands | 9 | 9 | 3 | 33 | 22 | 0 | 67 |
| east_lands | 18 | 18 | 11 | 60 | 39 | 1 | 129 |
| south_lands | 2 | 2 | 1 | 6 | 4 | 0 | 13 |
| lands_of_the_sun | 10 | 10 | 0 | 29 | 19 | 1 | 59 |
| **Total** | **74** | **74** | **22** | **238** | **156** | **6** | **496** |

The other 52 realms have elective or open succession and carry a succession note instead of an heir. By source: 10 established, 44 named by the histories, 45 named by the spec, trees or mechanics, 397 proposed here.

## 4. New traits proposed

All are country-leader traits for `common/country_leader/00_zin_leader_traits.txt` (usable by leaders and advisors), with `random = no`. Every modifier is in the installed 1.19.3 `documentation/modifiers_documentation.md`. Values are design targets for the balance pass. "Uses" counts the characters of this part that carry the trait.

### 4.1 Leader traits

| Trait | Name | Modifiers | Uses |
| --- | --- | --- | ---: |
| `zin_trait_horse_lord` | Horse-Lord | `mobilization_speed = 0.10`, `war_support_factor = 0.03` | 5 |
| `zin_trait_pass_lord` | Lord of the Pass | `trade_opinion_factor = 0.10`, `dig_in_speed_factor = 0.10` | 4 |
| `zin_trait_marcher_lord` | Marcher-Lord | `army_core_defence_factor = 0.05`, `war_support_factor = 0.05` | 2 |
| `zin_trait_guild_master` | Master of the Guilds | `production_speed_buildings_factor = 0.05`, `consumer_goods_factor = -0.02` | 5 |
| `zin_trait_cord_mother` | Keeper of the Eldest Cord | `drift_defence_factor = 0.20`, `stability_factor = 0.05` | 2 |
| `zin_trait_hold_lord` | Lord of the Deep Hall | `local_resources_factor = 0.05`, `production_factory_max_efficiency_factor = 0.03` | 1 |
| `zin_trait_hobgoblin_king` | The Biggest Hobgoblin | `recruitable_population_factor = 0.05`, `army_attack_factor = 0.03`, `stability_factor = -0.03` | 1 |
| `zin_trait_hidden_king` | King of a Hidden Holt | `encryption_factor = 0.25`, `army_core_defence_factor = 0.05` | 1 |
| `zin_trait_slow_eldest` | The Eldest Speaks Last | `army_core_defence_factor = 0.15`, `political_power_factor = -0.10` | 2 |
| `zin_trait_cairn_keeper` | Keeper of the Cairns | `army_defence_factor = 0.05`, `stability_factor = 0.05` | 1 |
| `zin_trait_warden_of_the_fields` | Warden of the Fields | `consumer_goods_factor = -0.03`, `stability_factor = 0.05` | 4 |
| `zin_trait_river_king` | Crowned in the Rising | `stability_factor = 0.05`, `research_speed_factor = 0.03` | 3 |
| `zin_trait_banker_prince` | Banker on the Throne | `political_power_gain = 0.10`, `war_support_factor = -0.05` | 2 |
| `zin_trait_forge_prince` | Forge-Prince | `production_factory_max_efficiency_factor = 0.05`, `trade_opinion_factor = 0.05` | 3 |
| `zin_trait_captains_blood` | Captains' Blood | `navy_org_factor = 0.05`, `naval_speed_factor = 0.05` | 4 |
| `zin_trait_fire_tithe` | Payer of the Fire-Tithe | `stability_factor = 0.05`, `consumer_goods_factor = 0.02` | 2 |
| `zin_trait_well_lord` | Lord of the Wells | `heat_attrition_factor = -0.15`, `supply_consumption_factor = -0.05` | 2 |
| `zin_trait_lamp_keeper` | Keeper of the Lamps | `opinion_gain_monthly_factor = 0.10`, `stability_factor = 0.03` | 1 |
| `zin_trait_salt_for_silence` | Salt for Silence | `war_support_factor = -0.10`, `consumer_goods_factor = -0.03` | 1 |
| `zin_trait_storm_pilot` | Storm-Pilot | `naval_speed_factor = 0.10`, `trade_opinion_factor = 0.05` | 1 |
| `zin_trait_pact_lord` | Pact-Bound Lord | `army_morale_factor = 0.05`, `army_attack_factor = 0.05`, `stability_factor = -0.05` | 3 |
| `zin_trait_twin_crowns` | One of Two Crowns | `political_power_factor = -0.05`, `army_defence_factor = 0.05` | 2 |
| `zin_trait_king_of_demons` | King of Demons | `army_morale_factor = 0.10`, `improve_relations_maintain_cost_factor = 0.15` | 1 |
| `zin_trait_radiant_speaker` | Radiant Speaker | `stability_factor = 0.10`, `conscription_factor = -0.05` | 1 |
| `zin_trait_sanctuary_speaker` | Speaker of a Sanctuary | `stability_factor = 0.05`, `research_speed_factor = 0.02` | 5 |
| `zin_trait_temple_debtor` | In the Temple's Debt | `consumer_goods_factor = -0.03`, `drift_defence_factor = -0.10` | 3 |
| `zin_trait_ice_hardy` | Hardy as the Ice | `winter_attrition_factor = -0.15` | 1 |
| `zin_trait_lord_of_the_boats` | Lord of the Boats | `navy_intel_factor = 0.10`, `naval_speed_factor = 0.03` | 2 |
| `zin_trait_mine_king` | Lord of Mines and Forts | `local_resources_factor = 0.05`, `army_core_defence_factor = 0.05` | 2 |
| `zin_trait_secluded_eldest` | Speaks Rarely to Outsiders | `drift_defence_factor = 0.20`, `army_core_defence_factor = 0.05` | 9 |
| `zin_trait_unknown_counsel` | Counsel Nobody Hears | `encryption_factor = 0.25`, `army_core_defence_factor = 0.10` | 3 |
| `zin_trait_keeper_of_the_moot` | Keeper of the Well-Moot | `justify_war_goal_time = 0.5`, `stability_factor = 0.05` | 1 |

`zin_trait_temple_debtor` is a public trait (the histories say openly that the temple's "generous friends" lend to eastern courts); it gives the Afrit and eastern-kings mechanics a hook to test without revealing anything. `zin_trait_unknown_counsel` implies no person, so it is safe for the Will of Zol.

### 4.2 Advisor traits

The slot column is the intended slot; a few are used in a neighbouring slot where the office fits (for example Master of Scouts on high-command wardens).

| Trait | Name | Slot | Modifiers | Uses |
| --- | --- | --- | --- | ---: |
| `zin_adv_captain_general` | Captain-General | army_chief | `army_org_factor = 0.05`, `army_morale_factor = 0.03` | 2 |
| `zin_adv_master_of_horse` | Master of Horse | army_chief | `army_speed_factor = 0.05` | 4 |
| `zin_adv_siege_master` | Master of Siege-Works | army_chief | `army_attack_factor = 0.05` | 3 |
| `zin_adv_quartermaster` | Quartermaster of the Host | army_chief | `supply_consumption_factor = -0.05`, `out_of_supply_factor = -0.05` | 5 |
| `zin_adv_parade_marshal` | Marshal of the Parades | army_chief | `army_morale_factor = 0.03`, `war_support_factor = 0.03`, `army_org_factor = -0.03` | 1 |
| `zin_adv_warden_of_beacons` | Warden of the Beacons | high_command | `army_intel_factor = 0.15`, `dig_in_speed_factor = 0.05` | 8 |
| `zin_adv_master_of_scouts` | Master of Scouts | political_advisor | `army_intel_factor = 0.10`, `civilian_intel_factor = 0.05` | 5 |
| `zin_adv_master_of_ships` | Master of Ships | navy_chief | `navy_org_factor = 0.05`, `naval_speed_factor = 0.05` | 6 |
| `zin_adv_galley_master` | Master of Galleys | navy_chief | `naval_damage_factor = 0.05` | 2 |
| `zin_adv_weather_reader` | Reader of Weather | navy_chief | `naval_speed_factor = 0.05`, `navy_intel_factor = 0.05` | 6 |
| `zin_adv_powder_master` | Master of Powder | theorist | `research_speed_factor = 0.02`, `army_attack_factor = 0.03` | 5 |
| `zin_adv_song_warden` | Singer of Wards | theorist | `army_core_defence_factor = 0.05`, `research_speed_factor = 0.02` | 5 |
| `zin_adv_star_reader` | Reader of Stars | theorist | `supply_consumption_factor = -0.05`, `heat_attrition_factor = -0.10` | 2 |
| `zin_adv_sun_healer` | Healer of the Noon | theorist | `land_reinforce_rate = 0.02`, `attrition = -0.05` | 2 |
| `zin_adv_lantern_warden` | Warden of the Lantern | theorist | `army_morale_factor = 0.03`, `stability_factor = 0.03` | 2 |
| `zin_adv_pact_broker` | Broker of Pacts | political_advisor | `political_power_factor = 0.05`, `army_attack_factor = 0.03`, `stability_factor = -0.02` | 5 |
| `zin_adv_hedge_wise` | Wise of the Hedge | theorist | `drift_defence_factor = 0.10`, `attrition = -0.05` | 7 |

The magical traits follow the magic reference's rule that magic is never a damage multiplier (organisation, supply, attrition, detection and recovery only); `zin_adv_powder_master`, `zin_adv_siege_master` and `zin_adv_pact_broker` are not magic.

The existing traits reused are `zin_trait_gilded_fool`, `zin_trait_seller_of_offices`, `zin_trait_lord_of_the_lost_cause`, `zin_trait_beloved_god`, `zin_trait_beloved_deliverer`, `zin_trait_dread_lord`, `zin_trait_ancient_great_spirit`, `zin_trait_old_god_of_death`, `zin_trait_speaker_of_houses`, `zin_trait_memory_of_dardan`, `zin_trait_ancient_king`, `zin_trait_elected_speaker`, `zin_trait_warband_chief`, and the spec's and Afrit spec's advisor traits; commanders use only the unit-leader keys the warfare spec keeps in stage 2 (`ranger`, `ambusher`, `winter_specialist`, `desert_fox`, `cavalry_leader`, `hill_fighter`, `trait_mountaineer`, `organizer`, `inspirational_leader`, `old_guard`, `career_officer`, `trickster`, `defensive_doctrine`, `offensive_doctrine`, `harsh_leader`, `trait_reckless`, `unyielding_defender`, `naval_invader`, `blue_water_expert`, `green_water_expert`, `bold`) plus `brilliant_strategist`, `inflexible_strategist` and `brave`, which the Volgan mechanic already uses and the stage-2 override must keep.

## 5. Conflicts with the histories, the spec, the trees and the mechanics

### 5.1 Where the histories overrule older names still in use

| Realm | Older name (where it is still used) | Histories, followed here |
| --- | --- | --- |
| Mirolon | High Warden Maeric (`zin_mirolon_maeric` in `mech_powers_volgan_text.json`, the Mirolon tree, a loading quote, Venaelia's entry in the magic reference) | High Warden Mirena of the Passes; Maeric is kept as the lake towns' candidate and heir, with the mechanic's id |
| Mirolon | Envoy Hessa Mencnor laughed out of Parim in 4A 1736 (spec, loading quotes) | Baelan of Paron; Hessa is kept as a second envoy who went with him |
| Noris | King Esiurth II (Noris tree, loading quotes and tips) | King Rasiq ben Tumek |
| Stabilo | Prince Cereos (Stabilo tree, loading quotes and tips) | Prince Pleron Tablo |
| Stabilo | Lady Mylun Azano, treasurer (spec, Stabilo tree) | Renamed Sarella Azano here, because the histories make Mylana Azano head of the house that rules Azano |
| Alerhia | King Alerhan (regional_alerhia tree) | King Kerseus Furanides, called Alerh |
| Erco | Queen Obmia (regional_erco tree) | King Keroth Rhanides |
| Mora | Moira Eraver (regional_mora tree) | Speaker Lorvena of Eraver |
| Naamis | Queen Lorvena of Gondolin (regional_gondolin tree) | Queen Shinah bat Alodar |
| Cursed Lands | the Veiled Elder (regional tree, events_world_lore_3) | Izkala, Mother of the Eldest Cord (the same character) |
| Bloody Forest | Chieftain Rasvan Redbark (regional tree) | Tzorek, son of Amaz |
| Khorvrath | Hazarel the Horned (regional_demon tree) | Lord Morvath; Hazarel is kept as the horned court's herald |
| Dolon | Morvath of the Dead Sea (spec) | Queen Zhorith |
| Nezer | Queen Nazara (regional_nezer tree) | Queen Sathael and Lord Zeruath |
| Nan | Warlord Dumar (regional_nan tree) | Almon the Small |
| Olen | Olena of the Holy Breeze (regional_olen tree) | Helia of the Lamps in the histories, renamed Dolara here under the place rule |
| Drak | King Morod (regional_drak tree) | Forge-Prince Telino Barzio |
| Plutondo | Prince Blozan (regional_plutondo tree) | Prince Blosian Plutides |
| Ostoroth | King Ocellio (regional_ostoroth tree) | King Ernoian Ostorides |
| Rhachia | Tribune Arcon Vel (regional_avalon tree) | Tribune Kaiena of Pordoce |
| Miaed | Lord Furanow (regional_miaed tree) | Lord Tharian of Erdozan |
| The Lands of Light | Radiant Speaker Soyan (regional tree) | Salin of Eldoga |
| Herrodon, Andos Enda, Nolorim, Lccimio | Herrowyn, Andosiel, Nolwe, Lusmio (their regional trees) | Renamed here under the place rule (section 2) |

The tree and quote texts are not edited by this part; their owners need to follow the names above or the owner must choose otherwise.

### 5.2 Other conflicts

1. **Aenor's royal house and the marshal.** The histories make the royal house the House of Hornan, and the spec's Marshal Corwen Hornan (already in a loading-quote attribution) now shares its name. He is kept, and his role says his lake family shares the name and none of the money, so that the Golden King gains no invented relative.
2. **Halmor Infous** (spec) breaks the Aenoran sound rules (no *ou*) and is renamed Halmor Monaris.
3. **Hadric Thorne**, the Volgan mechanic's scout-master, shares his given name with Hadric of Miherta, the histories' first High Warden.
4. **The Grave-Warden** is female in the mechanic data and "his order" in the Volgan tree text.
5. **Volgan's portrait people** is still `the_dead` in `mech_powers_volgan_text.json`; the owner's established look (K37) is a crowned wizard with green magic, a purple cloak and green glowing eyes, which this part uses.
6. **The House of Shindor** (Captain-General Hardfic Shindor, Stabilo tree) sits beside the House of Shindo of the histories (Narino Shindo of Obmi, Pelio Shindo of Pornivior); they read as two houses one letter apart.
7. **Two keepers of the Mirror.** The spec and Gala tree give Heveneya the Mirror; the magic reference proposes Ondeya as its reader. Heveneya keeps the advisor seat and Ondeya is a figure; the owner may merge them.
8. **Helayi of the Noon** is "at Godland" in the magic reference; Godland is a former label of Tor Luni, so she is Tor Luni's advisor.
9. **The Worshipdom's leader.** The histories say the temple-state is "led by a High Confessor"; the builder and decision D1 make Aurevan the Deliverer its country leader, which this part keeps, with Ilvane governing in his name.
10. **Rulers the histories leave unnamed** are named here: the Warden of the Fields of Tirlan (Loddard Heggelum), the Harbour-Master of Safeton (Ronric Safarel), the First Spring-Master of Freshon (Lisovan Tarmon), the Warden of the Guilds of Pazoma (Serette Bellaren, great-granddaughter of Tamric Bellaren), the Archivist of Eldafaen (Lyreth), the eldest keeper of Yavieth (Aelion), the Reeve of Teste (Edovan Selbar) and the Quay-Master of Luv-zhise (Ocellan Furanides).
11. **Stances departing from `countries.csv`** (each with a `stanceNote`): Noleksun, Luv-zhise, Rhachia, Kersian and Mostok to `zin_light_council`; Freshon and Pazoma to `zin_dom_court`; Woqood to `zin_wild_clans`. Realms with no row there: Burrikkrit `zin_wild_tribes`, Olodor, the Mushroom Forest and the God Forest `zin_wild_seclusion`, the Aenor Forest `zin_light_wardens`, the Nether `zin_shadow_dread`, Wahatud `zin_wild_freeholds`. The csv is keyed by pre-roster names and needs the roster's 156 realms.
12. **Unit-leader traits outside the stage-2 list.** `brilliant_strategist`, `inflexible_strategist` and `brave` are used by the Volgan mechanic and here; the stage-2 override of `00_traits.txt` must keep them.

## 6. Simplifications, omissions and blockers

- **Zol's Mistake has no advisors and no named navy leader.** Any named counsellor would imply an administrator (V3), and an emblem such as "the Black Ships" would confirm the fishermen's tale before `zin_zol_rising` (V10). Its commanders are references to the Zol mechanic's First and Second Hosts.
- **The Mushroom Forest and the God Forest have no advisors or commanders.** How the mycids rule themselves and whether the Keepers are Sunhot, Gala or their own kin are open in the vault, and nothing about them is invented; both have emblem leaders.
- **Native titles are `null`** where the language data has no word for the office (speaker, elder, keeper, tribune, warden of the fields, moot-headman and others), which leaves 37 of the 74 rulers with an English title only.
- **No birth years** for dwarves, gnomes and small folk pending owner question 6.
- Portraits are briefs only (R-65 says portraits come later); nothing has been generated.
- The builder (`tools/content/modules/characters.mjs`) does not read these files yet; wiring, localisation keys and recruitment are not part of this task.

## 7. Questions for the owner

1. **Mirolon:** is the High Warden at the start Mirena of the Passes (the histories) or Maeric (the Volgan mechanic, the Mirolon tree and a loading quote)? This part follows the histories and keeps Maeric as the heir.
2. **Names echoing places that were kept:** Hunald of Hunhun (*hun* "horse"), Mirena of Mirolon, Salin of the Lands of Light (one letter from its sanctuary Sali), Lorvena of Mora (close to the Woqood district Lorvens), Ernoian of Ostoroth (close to his county Ernois) and Velaeth of Dunelaeth. Should any of them be renamed like the nine in section 2?
3. **The King of Demons** is shown only by his title; the dossier proposes Kherazel. Does he take a name?
4. **Zol's Mistake:** may it have emblem counsellors or an emblem fleet once the black ships are public, or should it stay with the hosts alone?
5. **The mycids and the God Forest Keepers:** may their courts be described, and how?
6. **Lifespans:** may dwarves, gnomes and the small folk be given birth years, or are they long-lived beings whose ages stay unstated like the elves'?
7. **Corwen Hornan** shares the name of the royal house: keep him with the "no relation" line, or rename him and update the loading quote?
8. **Heveneya and Ondeya:** one keeper of the Mirror or two?
9. **Stances:** confirm the departures from `countries.csv` in section 5.2, item 11.
10. **Native titles:** should the languages owner add words for speaker, elder, keeper and tribune so that every ruler has a title in the realm's own tongue?
