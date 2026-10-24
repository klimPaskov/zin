# Characters of Aoaz, part 2 (R-65)

**Status:** Proposed. **Date:** 24 October 2026. **Requirement:** R-65 (rulers, heirs, advisors, commanders, wizards and named figures, with biographies from the histories; portraits later).
**Scope of this part:** the 82 realms of the regions `cold_lands`, `north_lands`, `west_lands`, `dark_lands`, `tritons_islands` (the Pupor Isles) and `islands_of_the_south`. Part 1 ([characters_part1.md](characters_part1.md)) covers the other 74 realms.
**Data:** `tools/content/data/world/characters/<region>.json`, one file per region.
**Sources:** the roster `tools/content/data/world/roster.json`, the histories `tools/content/data/world/history/<region>.json`, the regional dossiers `docs/lore/regions/`, the characters spec `docs/specs/02_lore/02_characters.md`, the major trees (Coldor, Lerendor, Gunwyn, Goldoroth) and the regional trees of these six regions, the Dark Lands, Cold Lands and Yeldenne and Glo mechanics, `docs/lore/references/magic_and_wizards.md`, `docs/lore/references/knowledge_layers.md`, the voice guide `docs/specs/02_lore/09_voice_and_style.md`, the language and culture data, `docs/design/countries.csv` and the owner decisions K1 to K40.

Every name that the vault does not establish is proposed and replaceable; renaming a character never changes its id.

## 1. File shape

The files use part 1's shape exactly (part 1, section 1): a JSON array of realms with `tag`, `key`, `name`, `stance`, optional `stanceNote`, `court`, `ruler`, `heir`, `advisors`, `commanders`, `figures`; characters with `id`, `name`, `given`, `house`, `title` (rulers) or `office`, `gender`, `people`, `born`, `slot` or `type` and `skill`, `traits`, `bio` (rulers) or `role`, `succession` (heirs), `portrait`, `canon` (`E`, `H`, `S`, `P`), and the never-localised design fields `formerName`, `definedBy`, `recruit`, `note` and `secret`.

Two additions to part 1's people list are needed for portraits: `yeti`, `trolls`, `dwarf_goblins` and `spirits` (Horos) are used here as the roster gives them, and `unknown` is used once, for Gwilid of Corogon, whose kind is not established.

## 2. Conventions applied

- **Ids.** Rulers keep `<TAG>_zin_ruler`, except Horos, who keeps the contract id `zin_horos`. Every id that the characters spec, a tree or a mechanic already declared is kept, even where the character is renamed (for example `zin_coldor_harl`, `zin_regional_isengard_veska`, `zin_lerendor_ostvar`, `zin_goldoroth_snikkit`). New characters follow part 1: `zin_<tree>_<who>` on major trees (`zin_coldor_`, `zin_lerendor_`, `zin_gunwaith_`, `zin_goldoroth_`), `zin_regional_<tree>_<who>` on regional trees (with the trees' old ids such as `regional_isengard`, `regional_windwaith`, `regional_titanos`), and `zin_<realm key>_<who>` on shared trees.
- **Rulers are the histories' rulers.** Where the histories name a ruler, that ruler is used (Ferlin III, Lunvaera in place of Vaestia, Ezhan Isenmar, Huk, Grumhal, Furla Hozen, Plickit the Broad, Herlic, Pernia Lothor, Hemmia Stubbel, Hrokorn Durnast, Stulmar Kunerm, Oslin IX, Hradin Ilmord, Gorduth, Dunmar, Skritix, Thazael, Rukhag of the Ghashak, Smash, Dorunas, and the eight island rulers). Where the histories leave a ruler unnamed, one is proposed (section 5.3).
- **No ruler named after a place.** Every ruler whose name was a place, a realm or a former label, or the realm's own name with an ending, is renamed (section 5.1). Toponymic bynames that a culture uses by custom are kept and marked in `note`: the Yonic *nau* bynames of the island rulers, Girdon's and Wennarith's ford- and ferry-names, and the Mustnom boss who bears his cave's name in office.
- **Names come from each realm's language.** Given names, houses and bynames follow the stems, endings, sound laws and house styles of Coldic, Leren, Gunwaithic, Dondric, Orcish, Goblin Cant, Pack-Tongue, Dwarvish, Hearth-Speech, Infernal, Tritonic, Yonic, the Giants' Speech, Trollish and the Yeti Speech in `languages.json` and `languages_new.json`. Every name was checked by script against every name in part 1, every other character here, the reserved names (exact and within one letter for names of five letters or more), the roster's realms, capitals and former labels, every city and established name in the histories and the language data, and the banned-word data. Tree characters with English, Slavic or real-world names, or with sounds their language lacks, are renamed (section 5.2). English bynames in the world's own register ("the Gift-Giver", "Long-Stride", "Mossback") are kept.
- **Births.** `born` is given for men, orcs, goblins, hobgoblins and ogres on the shared count (4A year y = 5068 + y), as part 1 does. It is absent for dwarves, the small folk and dwarf goblins (long-lived or unsettled peoples; part 1, owner question 6), and for giants, yeti, trolls, demons and Horos, whose ages are never stated (K18).
- **Voice and knowledge layers.** Bios and roles follow the voice guide and pass the banned-word data with no error and no review hit. No player text names Afrit, the Hidden Council, Eindil, Kusven, Erdu or Dunda, states a being's age, or claims Volgan's arming as fact; the stranger in the ice, the Southern Dominion's envoys and the drowned shrine's name appear only as the histories already make them public. Glo is named only in a `note`; Horos's bio speaks of "the light at his breast". Gwilid's possible identity with Gektor sits in `secret`.
- **Great Spirits and figures (K38, K40).** Horos follows the owner's drawing and reads as a being of magic; giants, yeti, trolls and demons are described as plainly not men.
- **Wizards.** At most one named wizard per realm (magic reference 5.1). The magic reference's practitioners of these regions are placed as follows: Ezhdok, storm-speaker of the Black Gallery, is renamed Ulvdok (Melkgard theorist); Seilina of Adel (Adel navy advisor); Borgun, iron-keeper of Notbuton (Dondor theorist); Skarash, Fire-Speaker of the Iron Clans (a Goldoroth figure, since Bredo holds the Fire-Speaker seat at court). Gwilid of Corogon is a figure. Other magical advisors are hedge-wise fire-keepers, wind-readers, litany-singers and tally-keepers, none of them a named wizard.
- **Courts.** Great powers and story realms have fuller courts: Lerendor, Coldor, Gunwyn and Goldoroth (`great`, five advisors, four commanders and a named wizard or figure where the sources give one) and Yeldenne, Kvittumm, Girdon, Dondor, Enhis Is Rond and Howan (`story`). Every other realm has a ruler, an heir or succession note, three advisors and two commanders, one of them naval where the realm keeps ships.
- **Stances** follow `docs/design/countries.csv` through each realm's former labels and old tags; the seven realms with no row (Ghaahu, Hrakbrund, Brundahrim, Gromkerm, Burnikit, Veshazel, Hoorunoron) take the builder's default for their people (`countries.mjs`) and carry a `stanceNote`.
- **Mechanic and tree characters are mirrored, not redefined.** Horos (`zin_horos`), the Warden of Mp'E (`zin_yeldenne_warden`, a figure), Forge-Mistress Ulgra, Nubrik Many-Knives and Rask Black-Sail carry `definedBy`; tree-recruited characters carry `recruit` with the focus that recruits them.

## 3. Counts

| Region | Realms | Rulers | Heirs (as characters) | Advisors | Commanders | Figures | Characters |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| cold_lands | 20 | 20 | 5 | 63 | 42 | 2 | 132 |
| north_lands | 12 | 12 | 7 | 38 | 26 | 0 | 83 |
| west_lands | 14 | 14 | 2 | 44 | 30 | 1 | 91 |
| dark_lands | 17 | 17 | 0 | 55 | 38 | 1 | 111 |
| tritons_islands | 11 | 11 | 2 | 33 | 22 | 0 | 68 |
| islands_of_the_south | 8 | 8 | 0 | 26 | 18 | 0 | 52 |
| **Total** | **82** | **82** | **16** | **259** | **176** | **4** | **537** |

The other 66 realms have elective, acclaimed, ring-won or hidden succession and carry a succession note instead of an heir. By source: 1 established (Horos), 27 named by the histories, 30 named and kept from the spec, trees, mechanics or magic reference, 479 proposed here (including the renamed spec and tree characters). Together with part 1 the world has 1,033 named characters, with no given name used twice except the one conflict in section 5.4.

## 4. New traits proposed

All are country-leader traits for `common/country_leader/00_zin_leader_traits.txt` (usable by leaders and advisors), with `random = no`; every modifier is in the installed 1.19.3 `documentation/modifiers_documentation.md`. Values are design targets for the balance pass. Part 1's new traits are reused wherever they fit (`zin_trait_pass_lord`, `zin_trait_marcher_lord`, `zin_trait_guild_master`, `zin_trait_hold_lord`, `zin_trait_slow_eldest`, `zin_trait_cairn_keeper`, `zin_trait_warden_of_the_fields`, `zin_trait_banker_prince`, `zin_trait_forge_prince`, `zin_trait_captains_blood`, `zin_trait_lamp_keeper`, `zin_trait_storm_pilot`, `zin_trait_pact_lord`, `zin_trait_twin_crowns`, `zin_trait_ice_hardy`, `zin_trait_lord_of_the_boats`, `zin_trait_mine_king`, `zin_trait_secluded_eldest`, `zin_trait_horse_lord`; advisor traits `zin_adv_hedge_wise`, `zin_adv_weather_reader`, `zin_adv_powder_master`, `zin_adv_master_of_scouts`, `zin_adv_pact_broker`, `zin_adv_song_warden`, `zin_adv_star_reader`).

### 4.1 Leader traits

| Trait | Name | Modifiers | Uses |
| --- | --- | --- | ---: |
| `zin_trait_bread_right` | The Bread-Right of the Frost-Hall | `stability_factor = 0.03`, `opinion_gain_monthly_factor = 0.10`, `war_support_factor = -0.05` | 1 |
| `zin_trait_refuser_of_crowns` | Refuser of Crowns | `drift_defence_factor = 0.15`, `war_support_factor = 0.03` | 6 |
| `zin_trait_free_steading` | First Among Free Lords | `drift_defence_factor = 0.10`, `stability_factor = 0.03` | 1 |
| `zin_trait_eldest_song` | The Eldest's Song | `stability_factor = 0.05`, `winter_attrition_factor = -0.10` | 2 |
| `zin_trait_brute_king` | Brute-King | `army_defence_factor = 0.05`, `war_support_factor = 0.05` | 1 |
| `zin_trait_big_snik` | Big Snik | `production_factory_max_efficiency_factor = 0.03`, `trade_opinion_factor = 0.10` | 1 |
| `zin_trait_troll_king` | King of the Night | `army_core_defence_factor = 0.20`, `army_attack_factor = 0.03` | 1 |
| `zin_trait_contract_book` | Keeper of the Contract-Book | `experience_gain_army = 0.05`, `trade_opinion_factor = 0.05` | 1 |
| `zin_trait_sea_king` | Sea-King | `navy_org_factor = 0.05`, `convoy_raiding_efficiency_factor = 0.10` | 1 |
| `zin_trait_wreck_right` | Lord of the Wreck-Right | `convoy_raiding_efficiency_factor = 0.05`, `naval_detection = 0.05` | 1 |
| `zin_trait_ransom_tide` | Sworn to the Ransom Tide | `convoy_raiding_efficiency_factor = 0.10`, `stability_factor = -0.03` | 3 |
| `zin_trait_reader_of_names` | Reader of the Names | `stability_factor = 0.05`, `drift_defence_factor = 0.10` | 2 |
| `zin_trait_guest_right` | Keeper of the Guest-Right | `opinion_gain_monthly_factor = 0.15`, `stability_factor = 0.03` | 4 |

### 4.2 Advisor traits

| Trait | Name | Slot | Modifiers | Uses |
| --- | --- | --- | --- | ---: |
| `zin_adv_storm_speaker` | Storm-Speaker | theorist | `winter_attrition_factor = -0.10`, `naval_speed_factor = 0.05` | 2 |
| `zin_adv_tally_keeper` | Keeper of the Wave-Tally | theorist | `drift_defence_factor = 0.15`, `stability_factor = 0.02` | 6 |
| `zin_adv_fire_speaker` | Fire-Speaker of the Holds | theorist | `stability_factor = 0.03`, `army_morale_factor = 0.03` | 1 |

The storm-speaker and fire-speaker traits follow the magic reference's rule that magic shows as endurance, supply and weather, never as damage.

### 4.3 Traits owned by mechanics, and commander traits

- `zin_horos_guardian` (Yeldenne and Glo mechanic) and `zin_trait_forge_mistress` (Dark Lands mechanic, Ulgra) are referenced, not defined here.
- New commanders use only the stage-2 unit-leader keys that part 1 lists. Commanders that trees already declared keep their trees' traits, which lie outside that list and must be kept by the stage-2 override of `00_traits.txt`: `spotter` (Vindael, Adel, Varnondor), `inshore_fighter` (Pollos, Nondondor, Seite Islands, Corogon, Varnondor), `seawolf` (Nondondor, Halenor), `blockade_runner` (Lerendor), `fortress_buster` (Nivaros), `trait_engineer` (Girdon, Kradlon), `skirmisher` (Lambin, Buldor) and `infantry_leader` (Buldor).

## 5. Renames and conflicts

### 5.1 Rulers renamed

| Realm | Former name (where it is still used) | New name | Reason |
| --- | --- | --- | --- |
| Coldor | Queen Vaestia (histories, spec, Coldor tree, loading quotes and tips, voice guide) | Queen Lunvaera | Vaestia is Austklev's harbour town |
| Horidor | Chieftain Ollon (spec; Horidor tree focus *Ollon's Hearth*) | Cairn-Chief Kerald Azling | Ollondo is the moot town |
| Fearno | Lord Esrom of Fearno (spec, Fearno tree) | First Lord Ulvald Azening | Esrom is Kvittumm's moot-place |
| Eekedor | Speaker Pertav Oirt (spec, Eekedor tree) | Speaker Pertav Perhkov | Oirt is a vale town; the histories name the Perhkov house |
| R'en | Prince Renan (spec, R'en tree) | Prince Agnek Farnur | The realm's own name |
| Molot | Margrave Wokla (spec, Molot tree) | Margrave Valdur Ostvar | Leren writes no w; the histories name the Ostvar |
| Tolvael | Lady Agniya (spec, Tolvael tree) | Queen Vigild Agtos | Agniy is a hill crown of Heodwa |
| Mina | Lord Etonar (spec, Mina tree) | King Valdik Korn | Etonia is the realm's ore hills |
| Lambin | Lord Werl (spec; Lambin tree branch *Lord Werl's Court*) | Lord Cadric of the Granaries | Echoes Werlendor |
| Buldor | Emric of the Grey Banner (histories); Company-Lord Datidon Rook (spec) | Captain-General Tarnic of the Grey Banner | Emric is Werlendor's founder; Datidon is Wennarith's seat |
| Kradlon | First Guildsman Trilo Kradd (spec, Kradlon tree) | First Guildsman Brannic Tanuow | Trilino and Kradlon |
| Corogon | Consul Sobra Canak (spec, Corogon tree) | Consul Sarieth of the House of Gwennow | Sobre and Canako are places |
| Blackton | Lord Haclton (spec, Blackton tree) | Moot-Speaker Bruna Gorvik | Reads as the realm's name; Blackton is a moot league |
| Bordon | Chief Bordag (spec, Bordon tree) | Chief Gruzash | The hold's own name |
| Dreson | Chief Dresk (spec, Dreson tree) | Chief Mudgash | The hold's own name |
| Dulundur | Chief Dulgash (spec, Dulundur tree) | Chief Ghorzug | The realm's own name |
| Troll Forest | Troy the Old (spec, Troll Forest tree) | King Smash | The histories and the owner (K22); Troy is a real place |
| Adel | Speaker Sanderz (spec, Adel tree) | Speaker Tinaios Andaios | Sanderz is the seat |
| Raerby | Captain-Speaker Lemo Raer (spec, Raerby tree) | Captain-Speaker Daios Raeros | Lemo is a town of Raerby |
| Pollos | Guild-Master Hesos Pol (spec, Pollos tree) | Guild-Master Pamon Polai | Hesos is a town of Pollos |
| Nondondor | King Benan (spec, Nondondor tree) | Sea-King Kusaros of the Kilai | Benan is a neighbouring realm |
| Halenor | Sea-Lord Orvak Halen (Halenor tree; focus *Orvak's Oath*) | Wreck-Lord Sonaios of the Mondon | Orvak is not Tritonic; Halen echoes the realm |
| Yongyong | Maiyan nau Yongwa (histories) | Elder Suayan nau Yongwa | Maiyan nau Lamowan is Howan's founder of the house for the shipwrecked |

The spec's place-named island rulers (Speaker Tich Howa, Priest-Elder Enhis, Elder Ancha, Chief Lua Verd) are already replaced by the histories' rulers, which are used.

### 5.2 Spec and tree characters renamed (ids kept)

Coldor: Chancellor Essen Hendair to Essen Hending (banned word; Hendair is a former label), Harbour-Master Alorio Siul to Yorim Siulair (Alorio is the port), Captain Harl to Brannar of the Cold Coast (Harl was also Dondor's), Warden Ysolde to Essaka of the Far Ice (a name from older legend).
Melkgard: Veska the Gift-Giver to Vaeska (one letter from Veskel). Horidor: Old Tarvo to Old Stenim (the Coldic word for forest), Maela Highcairn to Ketvia of the High Cairn. Fearno: Steward Ilse Morrow to Alvka Grindak, Huntmaster Hroth Vael to Vordan Brannson. Nivaros: Old Mother Hrimla to Old Mother Auraena, Skarn Glacier-Hand to Huumar Glacier-Hand (the Giants' Speech has no k). Yeti Lands: Oruk Long-Stride to Ghoram Long-Stride (no k). Vindael: Odo Fenn to Yorek Margson, Tamsin Gale to Sigrvia Skarrak.
Lerendor: Chancellor Ilse Relendion keeps her name as Keeper of the Treaty Rolls; Maelis of Lerenwaith to Maelis of Veskel; Lord Admiral Hellek Fargur to Ormik Brannkov (Hellekton and Fargur); Marshal Agnar Solenkov to Ostmund Gunndal (Solenkovi); Ostvar Greysail to Hegar Greysail (the Ostvar are Molot's house); Torvald Hesk to Torvik Hesk. Eekedor, R'en, Molot, Tolvael and Mina: every tree advisor and commander had an English, Slavic or real-world name and is renamed in Leren (the `formerName` of each records the old one).
Gunwyn: Thane Datid Werlen to Ruaric ap Garan, Captain Sarudo Bolpor to Emrow of the Rawdwyn, Admiral Ostra Velk to Gwenda Chavnow. Girdon, Lambin, Buldor, Kradlon, Corogon and Varnondor: every tree character with an English or real-world name is renamed in Gunwaithic; Lady Sevra of the Capes is kept.
Goldoroth: Snikkit Many-Knives to Nubrik Many-Knives (Snikkit is the histories' first Big Snik). Dondor: Gethra Ironjaw to Beraga Ironjaw (Dondric has no th), Wenna Saltbrow to Zilka Saltbrow, Old Harl to Old Grimak, Captain Draga Hollin to Draga Gollun (no h). Blackton: all four tree characters renamed. Dreson: Ylsa Eel-Wife to Nagha Eel-Wife (no y), Varga Bog-Runner to Burga Bog-Runner (no v).
Pupor Isles: Adel's Ysmay Corran and Edda Brine, Pollos's Marra and Teo Saltash, Raerby's Osk Faran and Ilka Raer, Nondondor's Admiral Saric Benan (Thenon's founder and a neighbouring realm), Halenor's Rhea Stormwake and Seite's Captain Brann (Tolvael's founder) are renamed in Tritonic; Old Gull and Tamsa of the Seite are kept.
Magic reference: Ezhdok of the Black Gallery to Ulvdok (Ezhdok Siulak is Orewele's founder in the histories).

### 5.3 Rulers the histories leave unnamed, named here

Haldar Grinson (Kvittumm), Ulvald Azening (Fearno), Stenvar Ezhair (Austklev), Yorvan Hozening (Worlond), Torild Margak (Poloto), Torvar Grindair (Holdon), Ezhim Esroming (Xison), Branald Hozening (Pertolor), Grinor (Omar), Kerdan Azlak (Portogalor), Kolvar Siulak (Orewele), Nuhiya (Ghaahu), Agnek Farnur (R'en), Valdur Ostvar (Molot), Ormar (Keredor-Hellekton, the heir crowned twice in 4A 1702), Vigild Agtos (Tolvael), Hilvi Ishor (Tolhon), Ingmund of Nuatax (Heodwa Lands), Valdik Korn (Mina), Maelvi of the Hold (Dolpar), Snokust (Mustnom), Dyfric (Werlendor), Cadric (Lambin), Cadlic (Thenon), Cadieth Pellkow (Saopon), Tarnic (Buldor), Brannic Tanuow (Kradlon), Sarieth (Corogon), Nesiwen (Wennarith), Ghorlak (Dark Gate), Bruna Gorvik (Blackton), Gruzash (Bordon), Mudgash (Dreson), Ghorzug (Dulundur), Zugmok (The Darks), Grumzag (Skragdurg), Zuraka (Dun), Karguk (Britadon), Ghashnag (Wild Lands), and the Pupor rulers of section 5.1 plus Lemaios Finon (Fineger), Benaios of Sondor (Windy Lands), Dairos the Red (Santon), Urion the Quiet (Benan) and Ilonai (The Lens).

### 5.4 Other conflicts

1. **Stulmar twice in the histories.** The West Lands history names Gromkerm's lord Stulmar Kunerm, and the Middle Lands history (used by part 1) names Kunhrim's lord Stulmar of the Kramast; both are `H`. This is the only given name used twice in the world.
2. **Tree focus names that carry old names** need their tree owners: Horidor *Ollon's Hearth*, Nivaros *Skarn's Band*, Girdon *Aldo's Wardens*, Lambin *Lord Werl's Court*, Halenor *Orvak's Oath*, Lerendor *The Chancellor of Lerendor's North*. Melkgard's *Heirs of Isenmar* and Girdon's *Pernia's Seal* still match.
3. **Loading quotes, tips and the voice guide** attribute lines to Queen Vaestia; they need Queen Lunvaera (or the owner keeps Vaestia, question 1). Lawspeaker Ilurda, King Herlic, Ferlin III, Dunmar and Gorduth are unchanged.
4. **Gwilid and Gektor.** The West Lands dossier renames the card's Gektor as Gwilid, the forgetful wizard of Corogon; the magic reference keeps Gektor as the owner's sorcerer-chief who traps and bleeds lesser spirits. One figure, Gwilid, carries both, with the bleeding in `secret`.
5. **Huk** has a k, which the Giants' Speech lacks; the histories and the spec both use it, so it is kept as the name men give him.
6. **Rask Black-Sail** (Dark Lands mechanic) shares the byname of Hanei of the Black Sail, Santon's founder; kept because a Goldoroth focus is named after it.
7. **Old Siula** (Eindil's journey events) is one letter from the Siulak house of Orewele and the drawn locality Siulas; kept because event text uses her. She is a Kvittumm figure.
8. **Isenmar** keeps the Coldic *isen* "iron", which echoes the former label Isengard.
9. **Holdon** is a kingdom with the `zin_light_council` stance in `countries.csv` (its old democratic row); kept, since the fair-keeping crown governs with the coast clans.

## 6. Simplifications, omissions and limitations

- **Near names remain.** 161 pairs of given names across the world sit one letter apart (for example Yorim and Zorim, Daios and Dairos), because the Coldic, Leren, Tritonic, Orcish and Yonic stem inventories are small; every full name differs, and same-realm pairs were removed.
- **Native titles** are built only from the dictionaries (`Koldtawra`, `Melkyarl`, `Karnvord`, `Halvyarl`, `Yarl`, `Tawr`, `Aar`, `Aarna`, `Baur`, `Karg`, `Karga`, `Ark`, `Snikbak`, `Zarkhan`, `Baaru`, `Tawros`, `Tiruunoronar`, `Huhal`, `Gak`); speakers, elders, margraves, princes, consuls, guildsmen, wardens and keepers have `native: null`, as in part 1.
- **Birth years** are absent for dwarves, the small folk and dwarf goblins (owner question 6 of part 1 applies to all three).
- **No heir character** where succession is elective, acclaimed, won in the ring or hidden (66 realms); the notes say how each realm chooses.
- **Portraits are briefs only**; nothing is generated, and nothing is wired into the builder (`characters.mjs` does not read these files yet), as in part 1.

## 7. Questions for the owner

1. **Coldor:** keep Queen Lunvaera, or keep Vaestia as the queen's name and rename Austklev's harbour town instead?
2. **Stulmar:** which dwarf lord keeps the name, Gromkerm's or Kunhrim's?
3. **Gwilid and Gektor:** one being under two names, or two beings of Corogon?
4. **Bynames from places by custom:** may the island rulers keep their *nau* bynames (nau Kea, nau Pon), Girdon's wardens their ford-names (Pernia Lothor) and Mustnom's boss his cave-name in office?
5. **Huk and Isenmar:** keep both, or rename to fit the Giants' Speech and to drop the Isengard echo?
6. **Veshazel's stance:** Dread Lordship (the builder's default for demons) or Worship-Cult, which fits its pacts?
7. **Tree names:** may the tree and quote owners take the renames of section 5, or should any former name be restored?
