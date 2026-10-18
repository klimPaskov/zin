# Characters

**Status:** Draft. **Priority:** 2. **Phase:** 2.

## Purpose

This spec lists every character the game needs at the start and every hidden figure who appears later: the rulers of the 13 tier A powers and the key tier B countries, their councillors and generals, and the story figures. For each it gives the status in the lore, when the character appears, the role in game terms, and what portrait art is needed. Generators build `common/characters` and the character localisation from it.

It is a digest. The vault's figure notes stay canon. Every name not found in the vault is **proposed** here and stays replaceable.

## Lore basis

### Sources

Vault figure notes (*Golden King*, *Afrit*, *Aurevan the Deliverer*, *Chancellor Merovan (proposed)*, *Eindil*, *Alleria of Selen*, *Lorien*, *Horos*, *Volgan*, *Zol*, *Varner*, *Golbran*, *Sevrin the Unending (proposed)*, *Harion the Restorer (proposed)*, *Glernaen*, *King of Demons*, *Roka*, *Ein*, *Aen*, *King Edran*), *Afrits Hidden Council*, *The Lost Cause*, *Kingdoms Factions and Conflicts*, *The Fourth Age of Erdae*, *Fourth Age Canon Register*, *Open Questions*, *Names and Retcons*; the [shared contract](../04_mechanics/00_shared_contract.md); the country roster.

### Labels

**E** established; **P** proposed (by the vault or by this spec); **O** open in the vault, never closed by text.

### Established characters at a glance

| Character | Established | Open (never stated as fact) |
| --- | --- | --- |
| The Golden King | Poor, greedy late ruler; sells offices; founded the Lost Cause; Afrit's puppet; murdered by Afrit | Personal name, exact years, relatives, dealings with Afrit |
| Afrit / the Deliverer | Son of Ein, grandson of Aen, brother of Eindil; publicly a New God under a human name; holds the Necklace of the Abyss; mortal beneath his protections | Public name (Aurevan is P); true divine rank; birth order |
| Eindil | Son of Ein, son of Aen; woke in the Cold Lands without memory | Birth order; cause of his sleep; appearance; which arm he loses |
| Chancellor Merovan | A Council member is left in charge of Aenor (E) | His name (P); his fate |
| Alleria of Selen | Ranger and archer of Selen; helps kill Afrit | Training, family, age, fate |
| Lorien | King of the Gala elves since the First Age; dies fighting Zol | — |
| Horos | Great Spirit; lord of the Castle of Yeldenne; Glo is his heart | Fate of his spirit after he turns to dust |
| Volgan | Great Spirit; principal dark lord; his manifested body is destroyed | Whether his spirit survives; his appearance |
| Zol | Old God of Death; cannot take a body; servants sustain him | Who administers Zol's Mistake; identities of his servants |
| Varner | Lesser Spirit wizard of the Magical Lands; dies in the last war | Ritual, writings |
| Golbran | Small purple humanoid servant of Varner; dies saving Eindil | Species, origin |
| The immortal thief | Stole the Necklace; granted unending life | Name (Sevrin is P); rules of his immortality; fate |

## Design

### Rules for characters

1. **The secret holds.** Before `zin_afrit_revealed`, no character's name, title, trait, description or portrait shown to a country other than the Worshipdom reveals Afrit, his demonic form or the Hidden Council.
2. **Eindil is absent.** `zin_eindil` is defined but recruited by no country until `zin_eindil_awake`. Before `zin_eindil_named` he is shown as "the Man from the Ice" (P), never as Eindil.
3. **Open questions stay open.** No character text states Afrit's or Eindil's birth order, the Golden King's personal name, Zol's administrator, Volgan's final fate or Golbran's origin.
4. **Proposed names are swappable.** Every proposed name is one localisation key. Renaming a character never changes its id.
5. **Countries by name.** The data file names countries; the builder resolves tags.
6. **Ids.** Rulers keep the generated id `<TAG>_zin_ruler` (the contract uses it for Aenor). Characters shared across systems use `zin_<name>` (as the contract's `zin_merovan`). Characters used by one country only use `zin_<tree>_<name>`, where `<tree>` is the country's focus tree id from [tiers and coverage](../05_focus_trees/01_tiers_and_coverage.md).

### Portrait rules

- Every portrait is image-generated; nothing is copied from another mod (CONVENTIONS).
- One style for all leaders: painted bust, dark neutral background, warm key light; regional dress per people.
- A character whose look changes with the story has one portrait per **state**; scripts switch with `set_portraits`.
- No portrait of a later state may be shown before its flag.
- **Horos** must match the established description: an enormous knight in yellow-green armour, branching dark points on the helm, glowing blue eyes, a large blue sword, a green crystal at his breast.
- **Golbran** is small, purple and humanoid (E); no other features are established.
- **Eindil's late state** (after the cliff) must not show which arm is lost (O): a cloak covers both shoulders.
- **Zol** never has a figure. His leader picture is a sigil.

Portrait needs are summarised under Implementation.

### The great powers' courts (tier A)

Columns: **Id**; **Name** shown; **St.** status; **Appears**; **Role** in game (slot or command); **Traits / skill** (design targets); **Portrait**.

#### Aenor

| Id | Name | St. | Appears | Role | Traits / skill | Portrait |
| --- | --- | --- | --- | --- | --- | --- |
| `<Aenor>_zin_ruler` | The Golden King | E (title); personal name O | Start | Country leader, stance Golden Court | `zin_trait_seller_of_offices`, `zin_trait_lord_of_the_lost_cause` | A heavy man in his forties under too much gold leaf; gilded crown; rings on every finger (P look). One state. |
| `zin_merovan` | Chancellor Merovan | P name; E role | Start | Political advisor shown as Chancellor; holds the royal seals. Council seat: royal administration, shown only to the Worshipdom | `zin_trait_keeper_of_seals` | An old, quiet courtier in dark robes with the chain of the seals; kind face (P). One state. |
| `zin_hierarch` | Hierarch Aubren of Parim | P | Start | Theorist; highest priest of the Deliverer in Aenor. Council seat: worship, Worshipdom view only | `zin_trait_voice_of_the_temples` | White and gold vestments, sunburst pectoral (P). One state. |
| `zin_aenor_halmor` | Lord Treasurer Halmor Infous | P | Start | Political advisor; leader of the Golden Court faction; sells offices | `zin_trait_office_broker` | Plump, smiling, fur-trimmed, ledger in hand (P). |
| `zin_eronel` | Prince Eronel of Arcedor | P | Start (court figure, not recruited as leader) | The Golden Court's candidate in the succession: a cousin from a collateral line of Aen (P) | Leader traits if crowned: `zin_trait_gilded_heir` | Young, handsome, overdressed (P). |
| `zin_aenor_corwen` | Marshal Corwen Hornan | P | Start | Field marshal; loyal to the crown, honest | skill 4 (atk 3, def 4, plan 4, log 3); `old_guard`, `defensive_doctrine` | Grey veteran in Aenoran plate (P). |
| `zin_aenor_isra` | Admiral Isra Leimon | P | Start | Navy leader of the Great Lake and the Ocean of Peace | skill 3; `green_water_expert` | Naval coat, lake-blue (P). |
| `zin_tarec` | Lord-Commander Tarec Belurith | P | Start | Corps commander; leads the Lost Cause's frontier companies; a true believer in the league's purpose | skill 3 (atk 3, def 3, plan 2, log 3); `ranger`, `inspirational_leader` | Weathered frontier officer, Lost Cause badge (P). |
| `zin_ilsabet` | Master Ilsabet Vothrim | P | Start | Theorist at the University of Parim; the Lost Cause's scholar of the First Men; later can gather proof of Eindil's ancestry (P direction from the vault) | `zin_trait_scholar_of_the_first_men` | Middle-aged scholar with ink-stained hands and genealogies (P). |
| `zin_aenor_sefan` | Sefan Daldar, Warden of the Rolls | P | Start | Intelligence advisor; keeps the Houses of the First Light's birth rolls; a Council client without knowing it | `zin_trait_keeper_of_rolls` | Clerk in grey with a tally-staff (P). |

#### Concord dominions (tier B, story weight)

| Id | Name | St. | Appears | Role | Traits / skill | Portrait |
| --- | --- | --- | --- | --- | --- | --- |
| `<Selen>_zin_ruler` | First Warden Daeric Svenlor | P | Start | Selen's leader; the voice of the Free Dominions in the succession | `zin_trait_free_dominion` | Green-cloaked warden-lord (P). |
| `zin_alleria` | Alleria of Selen | E | Start | Corps commander of Selen's rangers; later Eindil's protector (P earlier role) | skill 3 (atk 4, def 2, plan 3, log 2); `ranger`, `ambusher` | Ranger with a long bow, hood down; age not shown as old or young (O). States: ranger (start); resistance leader (after `zin_afrit_revealed`). |
| `<Kingson>_zin_ruler` | Lord Arcen of the Gate | P | Start | Ruler of the Wall gate dominion | — | Wall-warden in grey stone-coloured mail (P). |
| `<Kilinti>_zin_ruler` | Eldest Gronnar of Kilinti | P | Start | Ruler; an ent | — | Ent elder, bark and moss (P). |
| `<Hiloron>_zin_ruler` | High Chief Oronas | P | Start | Ruler; a giant | — | Giant chief (P). |
| `<Hunhun>_zin_ruler` | Horse-Lord Hunald | P | Start | Ruler of the riders | — | Rider in horsehair crest (P). |
| `<Konori>_zin_ruler` | King Sventor of Konori | P | Start | Ruler of the eastern steppe kingdom | — | Steppe king (P). |
| `<Herez>_zin_ruler` | Marcher-Lord Heziel | P | Start | Ruler of the southern marches | — | Marcher lord facing south (P). |
| `<Asgard>_zin_ruler` | Queen Faberra of Asgard | P | Start | Ruler of the Aenor Isle houses | — | Island queen, sea-grey (P). |
| `<Noleksun>_zin_ruler` | Chief Speaker Noleka | P | Start | Ruler of the frontier confederacy | — | — (P) |
| `<Cursed Lands>_zin_ruler` | The Veiled Elder | P title only | Start | Ruler of a secluded people who want to be left alone; nothing more is invented | — | Veiled figure, face unseen (P). |
| `<Bloody Forest>_zin_ruler` | Chieftain Rasvan Redbark | P | Start | Ruler of the hostile woodland tribes | — | Tribal chief in red-stained leather (P). |

#### Worshipdom

| Id | Name | St. | Appears | Role | Traits / skill | Portrait |
| --- | --- | --- | --- | --- | --- | --- |
| `zin_aurevan` | Shown as `[zin_loc_deliverer]`: "Aurevan the Deliverer" before the reveal; "Afrit" after | E character; P public name | Start | The Worshipdom's country leader. Becomes King of Aenor on `zin_aurevan_crowned`; King of the East on `zin_afrit_king_of_east` | Public: `zin_trait_beloved_deliverer`. After the reveal: `zin_trait_false_god` replaces it | States: **A1** the Deliverer: radiant, human, ageless, white and gold, no crown, no horns, no shadow (P look). **A2** King Aurevan: as A1 with Aenor's crown. **A3** Afrit: the acquired demonic form, still recognisably a man of Aen's line. **A4** King of the East: A3 in eastern dress. A3 and A4 only after `zin_afrit_revealed`. |
| `zin_worshipdom_lozan` | Abbot-Steward Lozan Heron | P | Start | Political advisor; runs the pilgrim valleys | `zin_trait_pilgrim_steward` | Plain-robed abbot (P). |
| `zin_kessarion` | Kessarion the Envoy | P | Start (visible to the Worshipdom only) | Council seat: foreign agents; head of the eastern branch. Intelligence advisor | `zin_trait_envoy_of_many_courts` | Elegant traveller in eastern silks (P). |
| `zin_ossar` | Magister Velan Ossar | P | Start (Worshipdom only) | Council seat: recovery of artifacts. Theorist | `zin_trait_seeker_of_relics` | Gaunt scholar with a sealed casket (P). |
| `zin_sevrin` | Sevrin the Unending | P name; E existence | Start (Worshipdom only, as an operative) | The immortal thief; Afrit mechanic missions (requires the operative system; without it, events only) | operative traits `operative_infiltrator`, `operative_escape_artist` | Unageing man with old eyes, dark travelling clothes (P). |
| `zin_worshipdom_nolivar` | Brother-Captain Nolivar | P | Start | Corps commander of the Pilgrim Guard | skill 2; `trickster` | Temple guard in white tabard (P). |

The four Council seats are royal administration (Merovan), worship (the Hierarch), foreign agents (Kessarion) and artifact recovery (Ossar). The structure is proposed in the vault; its membership is not established, so all four holders are proposed.

#### Lerendor

| Id | Name | St. | Appears | Role | Traits / skill | Portrait |
| --- | --- | --- | --- | --- | --- | --- |
| `<Lerendor>_zin_ruler` | King Ferlin III of Lerendor and Lerenwaith | P | Start | Country leader, High Crown | `zin_trait_strait_pride` | Tall northern king, sea-blue mantle (P). |
| `zin_lerendor_ilse` | Chancellor Ilse Relendion | P | Start | Political advisor; holds that the treaty pays | `zin_trait_treaty_keeper` | Stern stateswoman (P). |
| `zin_lerendor_hellek` | Lord Admiral Hellek Fargur | P | Start | Navy leader; wants Leren mastery of the strait | skill 4; `blue_water_expert`, `bold` | Admiral in sealskin (P). |
| `zin_lerendor_agnar` | Marshal Agnar Solenkov | P | Start | Field marshal | skill 3; `career_officer` | — (P) |

#### Volgan

| Id | Name | St. | Appears | Role | Traits / skill | Portrait |
| --- | --- | --- | --- | --- | --- | --- |
| `zin_volgan` (`<Volgan>_zin_ruler` today) | Volgan | E | Start | Country leader, Dread Lordship; field marshal in person on the historical path | `zin_trait_ancient_great_spirit` | His appearance is not established (O). P: a vast armoured silhouette wreathed in heat-haze, face hidden. One state; retired, not "killed", on `zin_volgan_body_destroyed` (his spirit's fate is O). |
| `zin_volgan_nazerch` | Nazerch the Grave-Marshal | P | Start | Field marshal of the grave hosts | skill 5; `harsh_leader`, `organizer` | Armoured corpse-lord (P). |
| `zin_volgan_unlo` | Unlo of the Netherborn | P | Start | Corps commander of Netherborn demons (Netherborn serve Volgan, E) | skill 4; `trait_reckless`, `offensive_doctrine` | Netherborn demon (P). |
| `zin_volgan_vezrun` | Vezrun Hundred-Banners | P | Start | Corps commander of Volgan's orc hosts | skill 3; `hill_fighter` | Orc warlord under many banners (P). |
| `zin_volgan_voice` | The Voice of Nafeher | P | Start | Intelligence advisor; herald and spymaster. Rank and kind not set | — | Masked herald (P). |
| `<Demon>_zin_ruler` | Hazarel the Horned | P | Start | Ruler of Demon, Volgan's satellite | — | Horned demon lord (P). |
| `<Dolon>_zin_ruler` | Morvath of the Dead Sea | P | Start | Ruler of Dolon | — | — (P) |
| `<Nezer>_zin_ruler` | Queen Nazara of Nezerun | P | Start | Ruler of Nezer | — | — (P) |

The **King of Demons** in the Nether has no character until the owner decides who he is and who owns the Nether (O).

#### Zol

| Id | Name | St. | Appears | Role | Traits / skill | Portrait |
| --- | --- | --- | --- | --- | --- | --- |
| `<Zol>_zin_ruler` | Zol | E | Start | Country leader, Grave Dominion. Represents the Old God himself, not an administrator | `zin_trait_old_god_of_death` | **Sigil, not a figure:** a black sun over a grey shore (P). |
| `zin_zol_drowned_captain` | The Drowned Captain | P | Start | Field marshal of the dead hosts. A title for a host's command, **not** an administrator of the Mistake | skill 4; `unyielding_defender` | Faceless shape under water-dark mail (P). |
| `zin_zol_hollow_tide` | The Hollow Tide | P | Start | Corps commander for the island dead | skill 3; `naval_invader` | Shapes rising from surf (P). |

Zol's servants (Great Spirits, Lesser Spirits, New Gods) exist (E) but their identities are unspecified (O). No character represents them.

#### Magical Forest

| Id | Name | St. | Appears | Role | Traits / skill | Portrait |
| --- | --- | --- | --- | --- | --- | --- |
| `<Magical Forest>_zin_ruler` | First Speaker Lusiel Velakorin | P | Start | Country leader; first among the elected houses (P constitution) | `zin_trait_speaker_of_houses` | Ancient elf in leaf-green, silver circlet (P). |
| `zin_magical_forest_perlan` | Perlan, Warden of the Dragon Roosts | P | Start | Political advisor; keeper of the elven pact with the dragons (E that elves command dragons; P office) | `zin_trait_dragon_warden` | Elf with dragon-scale cloak (P). |
| `zin_magical_forest_aenwe` | Loremaster Aenwe Lozari | P | Start | Theorist; remembers the Third Age and Varner | `zin_trait_elder_memory` | — (P) |
| `zin_magical_forest_herrian` | Marshal Herrian Lustel | P | Start | Field marshal | skill 4; `ranger`, `defensive_doctrine` | — (P) |

#### Gala Elves

| Id | Name | St. | Appears | Role | Traits / skill | Portrait |
| --- | --- | --- | --- | --- | --- | --- |
| `zin_lorien` (`<Gala Elves>_zin_ruler` today) | King Lorien | E | Start | Country leader; dies on `zin_lorien_dead` | `zin_trait_memory_of_dardan` | Immeasurably old elf king, sun-gold and white (P look). One state. |
| `zin_gala_heveneya` | Heveneya, Keeper of the Mirror | P (the Mirror of First Rain is P) | Start | Theorist | `zin_trait_keeper_of_the_mirror` | Elf with a water-filled bowl (P). |
| `zin_gala_sulestien` | Sulestien, Master of the King's Ships | P | Start | Navy leader; fits the ship Lorien gives Eindil (the crew's deaths are E; Sulestien need not sail) | skill 3; `blue_water_expert` | — (P) |
| `zin_gala_tangsiel` | Tangsiel of the Sunward Guard | P | Start | Corps commander | skill 4; `desert_fox` | — (P) |

#### Coldor

| Id | Name | St. | Appears | Role | Traits / skill | Portrait |
| --- | --- | --- | --- | --- | --- | --- |
| `<Coldor>_zin_ruler` | Queen Vaestia of Coldor | P | Start | Country leader, High Crown (keeps today's female portrait slot) | `zin_trait_winter_crown` | Queen in white furs (P). |
| `zin_coldor_essen` | Chancellor Essen Hendair | P | Start | Political advisor | — | — (P) |
| `zin_coldor_alorio` | Harbour-Master Alorio Siul | P | Start | Political advisor for the western ports | `zin_trait_port_master` | — (P) |
| `zin_coldor_grindok` | Marshal Grindok Azlen | P | Start | Field marshal | skill 4; `winter_specialist`, `trait_mountaineer` | — (P) |

#### Noris and Stabilo

| Id | Name | St. | Appears | Role | Traits / skill | Portrait |
| --- | --- | --- | --- | --- | --- | --- |
| `<Noris>_zin_ruler` | King Esiurth II of Noris | P | Start | Country leader, High Crown | `zin_trait_caravan_master` | Desert king in indigo (P). |
| `zin_noris_alodar` | Alodar Kersi, Master of Caravans | P | Start | Political advisor | `zin_trait_caravan_broker` | — (P) |
| `zin_noris_tumo` | Rider-General Tumo Furan | P | Start | Field marshal of the camel riders | skill 4; `cavalry_leader`, `desert_fox` | — (P) |
| `<Stabilo>_zin_ruler` | Prince Cereos of Postondoroth | P | Start | Country leader, High Crown | `zin_trait_caravan_master` | Merchant-prince (P). |
| `zin_stabilo_mylun` | Lady Mylun Azano, Treasurer of the Pact | P | Start | Political advisor | `zin_trait_caravan_broker` | — (P) |
| `zin_stabilo_hardfic` | General Hardfic Shindor | P | Start | Field marshal | skill 3; `organizer` | — (P) |

No eastern character is marked as a future follower of Afrit. Which eastern kings join him willingly is open (O); it is decided in play by the Afrit and East mechanics.

#### Gunwaith

| Id | Name | St. | Appears | Role | Traits / skill | Portrait |
| --- | --- | --- | --- | --- | --- | --- |
| `<Gunwaith>_zin_ruler` | King Herlic of Gunwaith | P | Start | Country leader; signed the Truce of the Grey Ford (P) | `zin_trait_truce_maker` | Western king, clan plaid and iron circlet (P). |
| `zin_gunwaith_ilurda` | Lawspeaker Ilurda | P | Start | Theorist; keeper of Gunwaith's laws (the law Eindil later submits to, P episode) | `zin_trait_lawspeaker` | — (P) |
| `zin_gunwaith_datid` | Thane Datid Werlen | P | Start | Political advisor; wants the truce broken | `zin_trait_war_party` | — (P) |
| `zin_gunwaith_sarudo` | Captain Sarudo Bolpor | P | Start | Field marshal | skill 3; `hill_fighter` | — (P) |

#### Goldoroth

| Id | Name | St. | Appears | Role | Traits / skill | Portrait |
| --- | --- | --- | --- | --- | --- | --- |
| `<Goldoroth>_zin_ruler` | Warking Gorduth of Cocanoor | P | Start | Country leader, Conquering Host | `zin_trait_warking` | Orc king in volcanic black iron (P). |
| `zin_goldoroth_bredo` | Bredo the Fire-Speaker | P | Start | Theorist; volcano shaman | — | — (P) |
| `zin_goldoroth_sungor` | Sungor of the Volcano Clans | P | Start | Political advisor | — | — (P) |
| `zin_goldoroth_britag` | Warchief Britag | P | Start | Field marshal | skill 4; `offensive_doctrine` | — (P) |

#### Mirolon

| Id | Name | St. | Appears | Role | Traits / skill | Portrait |
| --- | --- | --- | --- | --- | --- | --- |
| `<Mirolon>_zin_ruler` | First Warden Aldis Veleran | P | Start | Country leader, Warden Host | `zin_trait_warden_of_the_passes` | Lake-country warden in blue-grey (P). |
| `zin_mirolon_bennar` | Captain Bennar of the Passes | P | Start | Corps commander of the scouts who watch the Dead Lands | skill 3; `hill_fighter`, `ranger` | Scout with a dust-scarf (P). |
| `zin_mirolon_hessa` | Envoy Hessa Mencnor | P | Start | Political advisor; the envoy laughed out of Parim in 4A 1736 (P) | `zin_trait_unheeded_warning` | Old envoy (P). |

### Other key tier B rulers

All proposed (P). Country leaders only; their councils are written in the regional specs. Portraits: one each, regional dress and people.

| Country | Region | Name | Note |
| --- | --- | --- | --- |
| Dondor | Dark Lands | King Dunmar of Dondor | Leads the Dark Sea Accord |
| Belonton | Dark Lands | Chief Belon | Dondor's ally (tier C, but in the Accord) |
| Troll Forest | Dark Lands | Troy the Old | A troll |
| Bordon | Dark Lands | Chief Bordag | Orc hold |
| Dreson | Dark Lands | Chief Dresk | Orc hold |
| Dulundur | Dark Lands | Chief Dulgash | Orc hold |
| Blackton | Dark Lands | Lord Haclton | Human freehold |
| Isengard | Cold Lands | Warlord Ezhan Isenmar | Coldor's rival |
| Horidor | Cold Lands | Chieftain Ollon | Coldor's ally |
| Windwaith | Cold Lands | Speaker Furla Hozen | Maritime republic |
| Titanos | Cold Lands | Frost-King Huk | Ice giant |
| Yeti Lands | Cold Lands | Grumhal the Eldest | Yeti |
| Fearno | Cold Lands | Lord Esrom of Fearno | — |
| Yeldenne | Cold Lands | Horos | E; see story figures |
| Eekedor | North Lands | Speaker Pertav Oirt | Leren Compact |
| Molot | North Lands | Margrave Wokla | Marcher state |
| R'en | North Lands | Prince Renan | Strait gateway |
| Sensai | North Lands | Lady Agniya | — |
| Mina | North Lands | Lord Etonar | — |
| Girdon | West Lands | Warden-Speaker Pernia Lothor | Signed the Truce of the Grey Ford (P) |
| Kradlon | West Lands | First Guildsman Trilo Kradd | Workers' republic |
| Corogon | West Lands | Consul Sobra Canak | Trading republic |
| Varnondor | West Lands | King Oslin of Varnondor | — |
| Lambin | West Lands | Lord Werl of Lambin | — |
| Buldor | West Lands | Company-Lord Datidon Rook | The Buldor companies |
| Adel | Triton's Islands | Speaker Sanderz | Island federation |
| Pollos | Triton's Islands | Guild-Master Hesos Pol | Trading league |
| Raerby | Triton's Islands | Captain-Speaker Lemo Raer | Seafaring republic |
| Nondondor | Triton's Islands | King Benan of Nondondor | — |
| Nan | Dead Lands | Warlord Dumar of Vez Nan | — |
| Olen | Dead Lands | Olena of the Holy Breeze | — |
| Gondolin | East Lands | Queen Lorvena of Gondolin | Noris Treaty |
| Drak | East Lands | King Morod of Drak | Stabilo Pact |
| Alerhia | East Lands | King Alerhan III | — |
| Miaed | East Lands | Lord Furanow of the Passes | — |
| Erco | East Lands | Queen Obmia of Erco | — |
| Plutondo | East Lands | Prince Blozan | — |
| Ostoroth | East Lands | King Ocellio of Ostoroth | — |
| Mora | East Lands | Speaker Moira Eraver | Lake republic |
| Avalon | East Lands | Tribune Arcon Vel | Revolutionary republic |
| Herrodon | Magical Lands | Queen Herrowyn | Rival of Andos Enda |
| Andos Enda | Magical Lands | Speaker Andosiel | Rival of Herrodon |
| Nolorim | Magical Lands | Pass-Warden Nolwe | — |
| Lccimio | Magical Lands | Elder Lusmio | — |
| The End | Magical Lands | Warden Endaril | — |
| The Lands of Light | Lands of the Sun | Radiant Speaker Soyan | Sunhot elves |
| Howan | Islands of the South | Speaker Tich Howa | — |
| Nara | Islands of the South | Elder Ancha | — |
| Verde | Islands of the South | Chief Lua Verd | — |
| Enhis Is Rond | Islands of the South | Priest-Elder Enhis | Candidate keeper of the shrine that repeats Aen's name (P; the shrine's island is not fixed) |

Every other country keeps its generated ruler name until its regional spec names it. Generated names that read as jokes in English (for example "Dodo Zudotern", "Blackness Dole", "Uptons Pudor") are replaced in the table above or flagged for the regional spec.

### Story figures and hidden figures

| Id | Name shown | St. | When | Role | Portrait |
| --- | --- | --- | --- | --- | --- |
| `zin_eindil` | "the Man from the Ice" until `zin_eindil_named`; "the King Without a House" may be used after `zin_eindil_war_king`; "Eindil, son of Ein" after `zin_eindil_named` | E character; P epithets | `zin_eindil_awake` (P 4A 1749) | Defined at start, recruited by nobody. Role and owner country follow the Eindil's journey spec | States: **E1** the Man from the Ice: gaunt, frost-burned, ragged furs, no crown. **E2** war-king of the West: plain armour, a borrowed banner. **E3** son of Ein: Lorien's armour and sword. **E4** bearer of Glo: Horos's blue sword, green light at his breast. **E5** restored: lightning in the eyes. **E6** the wounded king: cloak over both shoulders (arm O). **E7** crowned, wearing the Necklace of the Abyss. |
| `zin_varner` | Varner | E | `zin_eindil_returned` (P 4A 1757) | Lesser Spirit wizard; defined, not recruited at start; legend only | Wise wizard (appearance not established; P: weathered, grey-cloaked). Retired on `zin_varner_dead`. |
| `zin_golbran` | Golbran | E | With Varner | Varner's small purple servant; origin O | Small purple humanoid; no other features invented. |
| `zin_horos` (`<Yeldenne>_zin_ruler` today) | Horos | E | Start | Yeldenne's country leader; dies on `zin_horos_dead` | Established look (see portrait rules). One state. |
| `zin_sevrin` | Sevrin the Unending | P name | Worshipdom only at start; to others through Afrit events | See Worshipdom | See Worshipdom |
| `zin_merovan` | Chancellor Merovan | P | Start; governs Aenor while Afrit travels (E role, P 4A 1753) | See Aenor | See Aenor |

**Figures in events only (no character):**

| Figure | St. | Use |
| --- | --- | --- |
| The tribal elder who finds Eindil, "Old Siula" | P | Eindil's journey events; belongs to whichever country holds `zin_is_site_eindil_ice` |
| Lorien's crew of western friends, island navigators and Gala elves | E (crew and their deaths) | Event art; unnamed |
| The dragon that carries Eindil | E (a dragon); P (a free ally entrusted by the elves) | Event art; not a character, not a unit leader |
| Glernaen and the New Gods | E (Glernaen); O (other gods' names and domains) | Event art only; no faces resolved; no portraits |
| Zol's bodily manifestation | E (rare, temporary) | Event art only on `zin_zol_manifested`; never a portrait |
| The King of Demons | E (exists); O (name, nature, relations) | None until the owner decides |
| Roka | E (rhinoceros-headed, of the Abyss); O (fate) | Memory text only |
| The Golden King's murderer | O (method and agent) | The Aenor mechanic decides how the death is shown; text before the reveal never says Afrit caused it |

### Historical figures named in text only

These never appear as characters. Status is the vault's.

| Figure | St. | Remembered as |
| --- | --- | --- |
| Aen, First of His Name | E | Founder of Aenor; the greatest man who ever lived |
| Ein, son of Aen | E | A king of the old line; little is told |
| King Edran | E | Gatherer of the Grand Alliance; his Dead Lands folly |
| Elzon, the Great Necromancer | E | The conqueror who ruled Aenor through the Third Age; permanently dead |
| Harion the Restorer | P | The first restored king, of Selen |
| Taryn of Gunwaith | P | Western commander at Dardan |
| Senra of Triton's Islands | P | Fleet captain of the Grand Alliance |

## Implementation

### Files

| Path | What |
| --- | --- |
| `docs/design/characters.json` (new) | Source of truth: id, country name, name key, status, appears-when, roles, traits, skills, portrait states |
| `common/characters/zin_rulers.txt` | Generated rulers; ruler names and portraits now come from `characters.json` where it has an entry |
| `common/characters/zin_lore_characters.txt` | Generated: councillors, generals, story figures |
| `common/country_leader/zin_traits.txt` | Leader and advisor traits below |
| `localisation/english/zin_characters_l_english.yml` | Names, titles, trait text |
| `common/scripted_localisation/zin_lore.txt` | `zin_loc_deliverer`, `zin_loc_eindil` |
| `interface/zin_portraits_lore.gfx` | Sprites `GFX_zin_portrait_<id>` and `GFX_zin_portrait_<id>_<state>` |
| `gfx/leaders/zin/lore/` | Generated portrait files |

### Recruitment at the start

- Every character with "Start" is recruited by its country in the 1748 country history with `recruit_character`.
- `zin_eindil`, `zin_varner` and `zin_golbran` are defined and recruited by nobody.
- `zin_sevrin`, `zin_kessarion` and `zin_ossar` are recruited only by the Worshipdom.
- The Worshipdom's leader is `zin_aurevan`; the generated `<Worshipdom>_zin_ruler` is removed.
- For Volgan, Gala Elves and Yeldenne, the builder renames the generated ruler ids to the contract ids (`zin_volgan`, `zin_lorien`, `zin_horos`) or aliases them; the contract ids are what other systems use.

### Scripted localisation

| Key | Returns |
| --- | --- |
| `zin_loc_deliverer` | "Aurevan the Deliverer" when `zin_afrit_secret_kept`; "Afrit" otherwise. For the Worshipdom's own country: "Afrit" always. |
| `zin_loc_eindil` | "the Man from the Ice" before `zin_eindil_named`; "Eindil" after |

The public name sits in one key, `zin_name_aurevan`, so the owner can replace Aurevan with another candidate (Aelorin, Arvedan, Vaelorian, Elarion) in one place.

### Story changes to characters

| Trigger | Change | Effect used |
| --- | --- | --- |
| `zin_golden_king_dead` | Golden King dies | `kill_country_leader` in Aenor (Aenor mechanic) |
| `zin_aurevan_crowned` | `zin_aurevan` becomes Aenor's leader; portrait A2 | `add_country_leader_role`, `set_portraits` (Aenor and Afrit mechanics) |
| `zin_afrit_revealed` | Name to "Afrit" through `zin_loc_deliverer`; portrait A3; trait `zin_trait_false_god` | `set_portraits`, `add_country_leader_trait`, `remove_country_leader_trait` |
| `zin_eindil_awake` | `zin_eindil` enters play as E1 | Eindil's journey spec |
| `zin_eindil_named` | Name to "Eindil" through `zin_loc_eindil`; portrait E3 | `set_portraits` |
| `zin_horos_dead`, `zin_lorien_dead`, `zin_varner_dead`, `zin_golbran_dead`, `zin_afrit_dead` | The character dies | `kill_country_leader` or `retire_character` |
| `zin_volgan_body_destroyed` | Volgan leaves the field; text says his body was destroyed, not that he died | `retire_character`; never "killed" in text |

### Traits (proposed)

Country-leader and advisor traits in `common/country_leader/zin_traits.txt`. Modifiers are checked against the game's modifier documentation. Values are design targets.

| Trait | Modifiers |
| --- | --- |
| `zin_trait_seller_of_offices` | `political_power_gain = 0.15`, `stability_factor = -0.05`, `consumer_goods_factor = 0.03` |
| `zin_trait_lord_of_the_lost_cause` | `war_support_factor = 0.05`, `opinion_gain_monthly_factor = 0.10` |
| `zin_trait_beloved_deliverer` | `stability_factor = 0.10`, `political_power_factor = 0.15`, `intel_network_gain_factor = 0.25` |
| `zin_trait_false_god` | `political_power_factor = 0.15`, `stability_factor = -0.10`, `war_support_factor = 0.05` |
| `zin_trait_keeper_of_seals` | `political_power_factor = 0.10`, `stability_factor = 0.05` |
| `zin_trait_voice_of_the_temples` | `stability_factor = 0.05`, `drift_defence_factor = 0.15` |
| `zin_trait_office_broker` | `political_power_gain = 0.10`, `consumer_goods_factor = 0.02` |
| `zin_trait_gilded_heir` | `political_power_factor = -0.10`, `stability_factor = -0.05` |
| `zin_trait_scholar_of_the_first_men` | `research_speed_factor = 0.03` |
| `zin_trait_keeper_of_rolls` | `civilian_intel_factor = 0.10`, `monthly_population = 0.05` |
| `zin_trait_free_dominion` | `autonomy_gain_global_factor = 0.10`, `stability_factor = 0.05` |
| `zin_trait_pilgrim_steward` | `opinion_gain_monthly_factor = 0.15` |
| `zin_trait_envoy_of_many_courts` | `intel_network_gain_factor = 0.20`, `improve_relations_maintain_cost_factor = -0.15` |
| `zin_trait_seeker_of_relics` | `research_speed_factor = 0.03`, `civilian_intel_factor = 0.10` |
| `zin_trait_strait_pride` | `navy_org_factor = 0.05`, `naval_damage_factor = 0.05`, `improve_relations_maintain_cost_factor = 0.10` |
| `zin_trait_treaty_keeper` | `trade_opinion_factor = 0.10`, `stability_factor = 0.05` |
| `zin_trait_ancient_great_spirit` | `army_morale_factor = 0.10`, `army_org_factor = 0.10`, `conscription = 0.02` |
| `zin_trait_old_god_of_death` | `army_core_defence_factor = 0.20`, `attrition = -0.10` |
| `zin_trait_speaker_of_houses` | `stability_factor = 0.10`, `drift_defence_factor = 0.10` |
| `zin_trait_dragon_warden` | `experience_gain_army = 0.05` (until the dragon mechanic replaces it) |
| `zin_trait_elder_memory` | `research_speed_factor = 0.05` |
| `zin_trait_memory_of_dardan` | `stability_factor = 0.10`, `army_defence_factor = 0.10`, `research_speed_factor = 0.05` |
| `zin_trait_keeper_of_the_mirror` | `research_speed_factor = 0.03`, `army_intel_factor = 0.10` |
| `zin_trait_winter_crown` | `winter_attrition_factor = -0.15`, `stability_factor = 0.05` |
| `zin_trait_port_master` | `trade_opinion_factor = 0.10`, `naval_speed_factor = 0.05` |
| `zin_trait_caravan_master` | `trade_opinion_factor = 0.15`, `consumer_goods_factor = -0.03` |
| `zin_trait_caravan_broker` | `trade_opinion_factor = 0.10` |
| `zin_trait_truce_maker` | `stability_factor = 0.05`, `war_support_factor = -0.05` |
| `zin_trait_lawspeaker` | `stability_factor = 0.05` |
| `zin_trait_war_party` | `war_support_factor = 0.05` |
| `zin_trait_warking` | `army_attack_factor = 0.05`, `justify_war_goal_time = -0.10` |
| `zin_trait_warden_of_the_passes` | `army_intel_factor = 0.10`, `dig_in_speed_factor = 0.10` |
| `zin_trait_unheeded_warning` | `war_support_factor = 0.05` |

Unit-leader traits are the game's own (`ranger`, `ambusher`, `winter_specialist`, `desert_fox`, `cavalry_leader`, `hill_fighter`, `trait_mountaineer`, `organizer`, `inspirational_leader`, `old_guard`, `career_officer`, `trickster`, `defensive_doctrine`, `offensive_doctrine`, `harsh_leader`, `trait_reckless`, `unyielding_defender`, `naval_invader`, `blue_water_expert`, `green_water_expert`, `bold`) until the warfare spec adds Erdae traits.

### Portrait needs (summary)

| Group | Count | States | Notes |
| --- | ---: | ---: | --- |
| Tier A rulers (12 figures + Zol sigil) | 13 | Aurevan 4, others 1 | Highest quality; Horos to the established description |
| Tier A councillors and generals, and the three Southern Dominion rulers | 47 | 1 each | Small advisor and unit-leader portraits derived by code from the large one |
| Concord dominion rulers and Alleria | 12 | Alleria 2 | — |
| Other key tier B rulers (Horos included) | 50 | 1 | — |
| Story figures (Eindil, Varner, Golbran) | 3 | Eindil 7 | No Eindil art may be referenced by any start file |
| **Total images** | about 135 | | Every generation recorded in `art/source/provenance.jsonl` |

## AI

- AI recruits only characters marked "Start" and never recruits `zin_eindil`, `zin_varner` or `zin_golbran`; those enter only through mechanic effects.
- AI keeps the start advisors in their slots for the first year (no early swaps), so the court reads as written.
- The AI field marshals listed above command the AI's main army; generated generic leaders fill the rest.

## Acceptance

1. Every character with "Start" exists, is recruited by the right country, and has a name in localisation and a portrait sprite (placeholder allowed until the art phase, with a warning).
2. `zin_eindil`, `zin_varner` and `zin_golbran` are recruited by no country on 1 Thaw 4A 1748.
3. No character text or name visible to a non-Worshipdom country before `zin_afrit_revealed` contains "Afrit", and the Worshipdom's leader is shown as "Aurevan the Deliverer" (compiler secret scan; scenario test reading the leader's name).
4. `zin_loc_eindil` returns "the Man from the Ice" when `zin_eindil_named` is unset and "Eindil" when set (scenario test).
5. Every trait's modifiers exist in the modifier documentation; every unit-leader trait exists in the game's trait files (validator).
6. No character text states the Golden King's personal name, Afrit's or Eindil's birth order, Zol's administrator, or Golbran's origin (review checklist).
7. The Zol leader picture is a sigil and contains no figure (art review).

## Open questions

1. Should the Golden King have a personal name? Candidates in the Middle Lands style: Arcedan VII, Leimar II, Hornan IV. This spec shows only "The Golden King".
2. Is the Golden King childless, so that a collateral cousin (Prince Eronel, P) is the Golden Court's candidate? Or does he have an heir?
3. Is Aurevan approved as the public name, or one of Aelorin, Arvedan, Vaelorian, Elarion?
4. May the Worshipdom's player see the Deliverer as "Afrit" from the first day (this spec says yes: the contract allows text shown only to Afrit's own country)?
5. What do Volgan and Varner look like? Both are needed for portraits.
6. May the owner's private Horos drawings be used as image-generation references, or must the portrait be generated from the written description only?
7. Before Lorien names him, may players read "Eindil" anywhere (for example in tooltips), or only "the Man from the Ice"? This spec says only the epithet.
8. Should Coldor's ruler be a queen (keeping today's female portrait slot) or a king?
