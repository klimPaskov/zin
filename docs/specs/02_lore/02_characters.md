# Characters

**Status:** Ready. Reviewed 19 October 2026 against CONVENTIONS "Status"; integrated 19 October 2026. **Priority:** 2. **Phase:** 2.

## Purpose

This spec lists every character the game needs at the start and every hidden figure who appears later: the rulers of the 13 tier A powers and the key tier B countries, their councillors and generals, and the story figures. For each it gives the status in the lore, when the character appears, the role in game terms, and what portrait art is needed. The content builder writes `common/characters` and the character localisation from it.

It is a digest. The vault's figure notes stay canon. Every name not found in the vault is **proposed** here and stays replaceable. Where a mechanic spec owns a character (the Afrit spec's Council seats and their staff, the Aenor spec's collective leaders, the Volgan spec's lieutenants and Mirolon's court, the Zol spec's hosts, the Yeldenne spec's Warden of Mp'E), that spec's definition wins and this file repeats it. Where this file and a Ready tree or mechanic named the same figure differently, the tree or mechanic wins and this file follows (decision O7).

## Lore basis

### Sources

Vault figure notes (*Golden King*, *Afrit*, *Aurevan the Deliverer*, *Chancellor Merovan (proposed)*, *Eindil*, *Alleria of Selen*, *Lorien*, *Horos*, *Volgan*, *Zol*, *Varner*, *Golbran*, *Sevrin the Unending (proposed)*, *Harion the Restorer (proposed)*, *Glernaen*, *King of Demons*, *Roka*, *Ein*, *Aen*, *King Edran*), *Afrits Hidden Council*, *The Lost Cause*, *Kingdoms Factions and Conflicts*, *The Fourth Age of Erdae*, *Fourth Age Canon Register*, *Open Questions*, *Names and Retcons*; the [shared contract](../04_mechanics/00_shared_contract.md) and its [additions](../04_mechanics/00_contract_additions.md); [INTEGRATION_DECISIONS.md](../INTEGRATION_DECISIONS.md) (D1, D4, N7, N10, N13, S4, O6, O7); the [Afrit spec](../04_mechanics/afrit_hidden_council.md), [Aenor spec](../04_mechanics/aenor_court_and_succession.md) and [Zol spec](../04_mechanics/zols_mistake.md); the country roster.

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
2. **Eindil is absent.** `zin_eindil` is defined but recruited by no country until `zin_eindil_awake`. Before `zin_eindil_named` he is shown as "the Man from the Ice" (P, D4), never as Eindil.
3. **Open questions stay open.** No character text states Afrit's or Eindil's birth order, the Golden King's personal name, Zol's administrator, Volgan's final fate or Golbran's origin.
4. **Proposed names are swappable.** Every proposed name is one localisation key. Renaming a character never changes its id.
5. **Countries by name.** The data file names countries; the builder resolves tags.
6. **Ids.** Rulers keep the generated id `<TAG>_zin_ruler` (the contract uses it for Aenor). Characters shared across systems use `zin_<name>` (as the contract's `zin_merovan`). Characters used by one country only use `zin_<tree>_<name>`, where `<tree>` is the country's focus tree id from [tiers and coverage](../05_focus_trees/01_tiers_and_coverage.md).

### Portrait rules

- Every portrait is image-generated; nothing is copied from another mod (CONVENTIONS). Every generation is recorded in `art/source/provenance.jsonl`.
- One style for all leaders: painted bust, dark neutral background, warm key light; regional dress per people.
- A character whose look changes with the story has one portrait per **state**; scripts switch with `set_portraits`.
- No portrait of a later state may be shown before its flag.
- **Horos** must match the established description: an enormous knight in yellow-green armour, branching dark points on the helm, glowing blue eyes, a large blue sword, a green crystal at his breast. His portrait is generated from this text only, not from the owner's private drawings (A6, owner short list 14).
- **Golbran** is small, purple and humanoid (E); no other features are established.
- **Eindil's late state** (after the cliff) must not show which arm is lost (O): a cloak covers both shoulders.
- **Zol** never has a figure. His leader picture and his hosts' pictures are emblems (a black sigil on a void).

Portrait needs are summarised under Implementation.

### The great powers' courts (tier A)

Columns: **Id**; **Name** shown; **St.** status; **Appears**; **Role** in game (slot or command); **Traits / skill** (design targets); **Portrait**.

Rulers also carry the ideology spec's leader trait where it names one ([02_ideologies_and_politics.md](../00_foundation/02_ideologies_and_politics.md)): `zin_trait_gilded_fool` (the Golden King), `zin_trait_beloved_god` (Aurevan), `zin_trait_dread_lord` (Volgan), `zin_trait_guardian_spirit` (Horos). Lorien carries `zin_trait_memory_of_dardan` and other ancient rulers `zin_trait_ancient_king` (N7).

#### Aenor

| Id | Name | St. | Appears | Role | Traits / skill | Portrait |
| --- | --- | --- | --- | --- | --- | --- |
| `<Aenor>_zin_ruler` | The Golden King | E (title); personal name O | Start | Country leader, stance Golden Court | `zin_trait_gilded_fool`, `zin_trait_seller_of_offices`, `zin_trait_lord_of_the_lost_cause` | A heavy man in his forties under too much gold leaf; gilded crown; rings on every finger (P look). One state. |
| `zin_merovan` | Chancellor Merovan | P name; E role | Start | Aenor's head of government (political advisor shown as Chancellor); holds the royal seals. His Council seat, the Seat of Seals, is shown only to the Worshipdom | `zin_trait_keeper_of_seals` | An old, quiet courtier in dark robes with the chain of the seals; kind face (P). One state. |
| `zin_aenor_halmor` | Lord Treasurer Halmor Infous | P | Start | Political advisor; leader of the Golden Court faction; sells offices | `zin_trait_office_broker` | Plump, smiling, fur-trimmed, ledger in hand (P). |
| `zin_eronel` | Prince Eronel of Arcedor | P | Start (court figure, not recruited as leader) | The Golden Court's candidate in the succession: a cousin from a collateral line of Aen (P; owner short list 2) | Leader traits if crowned: `zin_trait_gilded_heir` | Young, handsome, overdressed (P). |
| `zin_aenor_corwen` | Marshal Corwen Hornan | P | Start | Field marshal; loyal to the crown, honest | skill 4 (atk 3, def 4, plan 4, log 3); `old_guard`, `defensive_doctrine` | Grey veteran in Aenoran plate (P). |
| `zin_aenor_isra` | Admiral Isra Leimon | P | Start | Navy leader of the Great Lake and the Ocean of Peace | skill 3; `green_water_expert` | Naval coat, lake-blue (P). |
| `zin_tarec` | Lord-Commander Tarec Belurith | P | Start | Corps commander; leads the Lost Cause's frontier companies; a true believer in the league's purpose | skill 3 (atk 3, def 3, plan 2, log 3); `ranger`, `inspirational_leader` | Weathered frontier officer, Lost Cause badge (P). |
| `zin_ilsabet` | Master Ilsabet Vothrim | P | Start | Theorist at the University of Parim; the Lost Cause's scholar of the First Men; later can gather proof of Eindil's ancestry (P direction from the vault) | `zin_trait_scholar_of_the_first_men` | Middle-aged scholar with ink-stained hands and genealogies (P). |
| `zin_aenor_sefan` | Sefan Daldar, Warden of the Rolls | P | Start | Intelligence advisor; keeps the Houses of the First Light's birth rolls; a Council client without knowing it | `zin_trait_keeper_of_rolls` | Clerk in grey with a tally-staff (P). |

The Aenor spec's collective leaders (`zin_aenor_golden_regency`, `zin_aenor_concord_speaker`, `zin_aenor_captains_regency`) are defined by that spec and recruited only by its succession events. They avoid inventing relatives of the Golden King. Aenor has no high priest of its own: the Council's seat of worship is Ilvane in the Worshipdom (N10). Where an event needs Parim's public high priest (for example at a crowning), the text names "the High Confessor" (`zin_ilvane`), in public terms only.

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
| `<Noleksun>_zin_ruler` | Chief Speaker Noleka | P | Start | Ruler of the frontier confederacy | — | Frontier speaker in plain wool (P). |
| `<Cursed Lands>_zin_ruler` | The Veiled Elder | P title only | Start | Ruler of a secluded people who want to be left alone; nothing more is invented | — | Veiled figure, face unseen (P). |
| `<Bloody Forest>_zin_ruler` | Chieftain Rasvan Redbark | P | Start | Ruler of the hostile woodland tribes | — | Tribal chief in red-stained leather (P). |

#### Worshipdom

The Council's four seats and their holders follow the Afrit spec (N10, N13, O7): Seals (Merovan, in Aenor), Censers (Ilvane), Whispers (Corvel, with Kessarion leading his eastern branch) and Relics (Sevrin, with Ossar as the Reliquary's scholar). Kessarion and Ossar are lesser characters: they serve under a seat and hold none. The structure is proposed in the vault; its membership is not established, so every holder is proposed.

| Id | Name | St. | Appears | Role | Traits / skill | Portrait |
| --- | --- | --- | --- | --- | --- | --- |
| `zin_aurevan` | "Aurevan the Deliverer" before the reveal; "Afrit" after (see Implementation, names that change) | E character; P public name | Start | The Worshipdom's country leader (Light, Sanctuary; D1). Becomes King of Aenor on `zin_aurevan_crowned`; King of the East on `zin_afrit_king_of_east` | `zin_trait_beloved_god`, `zin_trait_beloved_deliverer`. After the reveal `zin_trait_false_god` replaces `zin_trait_beloved_deliverer` | States: **A1** the Deliverer: radiant, human, ageless, white and gold, no crown, no horns, no shadow (P look). **A2** King Aurevan: as A1 with Aenor's crown. **A3** Afrit: the acquired demonic form, still recognisably a man of Aen's line. **A4** King of the East: A3 in eastern dress. A3 and A4 only after `zin_afrit_revealed`. |
| `zin_ilvane` | Ilvane, High Confessor | P (N10) | Start (hireable by the Worshipdom only) | Political advisor; Seat of Censers (worship). Leads the Worshipdom while Afrit rules elsewhere (Afrit spec) | `zin_trait_high_confessor` (Afrit spec) | Tall priest in white and gold, a censer on a chain (P). |
| `zin_corvel` | Corvel, Master of Couriers | P | Start (hireable by the Worshipdom only) | Political advisor; Seat of Whispers (foreign agents, couriers, confessors; head of the eastern branch) | `zin_trait_master_of_couriers` (Afrit spec) | Lean traveller in dust-grey, a courier's satchel (P). |
| `zin_kessarion` | Kessarion the Envoy | P | Start (hireable by the Worshipdom only) | Political advisor (intelligence); head of Corvel's eastern branch under the Seat of Whispers ([eastern kings](../04_mechanics/eastern_kings.md)); no public text names him | `zin_trait_envoy_of_many_courts` | Elegant traveller in eastern silks (P). |
| `zin_sevrin` | Sevrin the Unending | P name; E existence | Defined at start, hidden; the Worshipdom gains him through the Afrit spec's focus *A Guest of the Reliquary* (`a_guest_who_does_not_age`) | Political advisor (an advisor, not an operative; N13); Seat of Relics (recovery and keeping of artifacts) | `zin_trait_unending_thief` (Afrit spec) | Unageing man with old eyes, dark travelling clothes (P). |
| `zin_ossar` | Magister Velan Ossar | P | Start (hireable by the Worshipdom only) | Theorist; the Reliquary's scholar under Sevrin, keeping its work while Sevrin stays hidden | `zin_trait_seeker_of_relics` | Gaunt scholar with a sealed casket (P). |
| `zin_worshipdom_lozan` | Abbot-Steward Lozan Heron | P | Start | Political advisor; runs the pilgrim valleys (public role, no Council seat) | `zin_trait_pilgrim_steward` | Plain-robed abbot (P). |
| `zin_worshipdom_nolivar` | Brother-Captain Nolivar | P | Start | Corps commander of the Pilgrim Guard (the valley wardens) | skill 2; `trickster` | Temple guard in white tabard (P). |

The earlier draft's separate priest of Parim is retired by N10: Ilvane is the one seat of worship. Kessarion and Ossar stay (N13).

#### Lerendor

| Id | Name | St. | Appears | Role | Traits / skill | Portrait |
| --- | --- | --- | --- | --- | --- | --- |
| `<Lerendor>_zin_ruler` | King Ferlin III of Lerendor and Lerenwaith | P | Start | Country leader, High Crown | `zin_trait_strait_pride` | Tall northern king, sea-blue mantle (P). |
| `zin_lerendor_ilse` | Chancellor Ilse Relendion | P | Start | Political advisor; holds that the treaty pays | `zin_trait_treaty_keeper` | Stern stateswoman (P). |
| `zin_lerendor_hellek` | Lord Admiral Hellek Fargur | P | Start | Navy leader; wants Leren mastery of the strait | skill 4; `blue_water_expert`, `bold` | Admiral in sealskin (P). |
| `zin_lerendor_agnar` | Marshal Agnar Solenkov | P | Start | Field marshal | skill 3; `career_officer` | Grey-bearded northern marshal in sea-blue mail (P). |

#### Volgan

| Id | Name | St. | Appears | Role | Traits / skill | Portrait |
| --- | --- | --- | --- | --- | --- | --- |
| `zin_volgan` (renamed from `<Volgan>_zin_ruler`) | Volgan | E | Start | Country leader, Dread Lordship; field marshal in person on the historical path | `zin_trait_dread_lord`, `zin_trait_ancient_great_spirit` | His appearance is not established (O; lore digest question 13). P: a vast armoured silhouette wreathed in heat-haze, face hidden. One state. On `zin_volgan_body_destroyed` the Volgan mechanic removes his country-leader and unit-leader roles only; the character is neither killed nor retired, because his spirit's fate is O. |
| `zin_volgan_ember_herald` | The Ember Herald | P | Defined at start; recruited by the Volgan tree's "The Lieutenants Assemble" | General (a Great Spirit of Volgan's court); Steward of Nafeher and country leader after the body breaks | as the Volgan spec sets | Faceless figure of embers (P; until art exists, the people portrait `the_dead`). |
| `zin_volgan_grave_warden` | The Grave-Warden | P | as above | General; heads the necromantic orders | as the Volgan spec sets | Hooded grave-lord (P; fallback `the_dead`). |
| `zin_volgan_ghorvak` | Ghorvak of the Hundred Clubs | P | as above | General; ogre clan chief of the Dead Lands | as the Volgan spec sets | Ogre chief with a ring of clubs (P; fallback `orcs`). |
| `<Demon>_zin_ruler` | Hazarel the Horned | P | Start | Ruler of Demon, Volgan's sworn realm | — | Horned demon lord (P). |
| `<Dolon>_zin_ruler` | Morvath of the Dead Sea | P | Start | Ruler of Dolon | — | Demon lord in salt-crusted iron (P). |
| `<Nezer>_zin_ruler` | Queen Nazara of Nezerun | P | Start | Ruler of Nezer | — | Demon queen in ember-red (P). |

Volgan's three lieutenants are defined by the [Volgan mechanic](../04_mechanics/volgan_southern_dominion.md) in `common/characters/zin_dominion.txt` (decision O7); this file repeats them and `characters.json` carries no second definition. The earlier draft's Nazerch, Unlo, Vezrun and the Voice of Nafeher are dropped.

The **King of Demons** in the Nether has no character until the owner decides who he is (O).

#### Zol

As the Zol spec defines (S4): the leader is an emblem and the hosts are numbered formations, not persons.

| Id | Name | St. | Appears | Role | Traits / skill | Portrait |
| --- | --- | --- | --- | --- | --- | --- |
| `zin_zol_will` (renamed from `<Zol>_zin_ruler`; O6) | The Will of Zol | E (Zol); P (emblem name) | Start | Country leader, Grave Dominion. An emblem for the Old God's will; it says nothing about who administers the Mistake | `zin_trait_old_god_of_death` (no trait that implies a person) | **Emblem, not a figure:** a black sigil on a void (Zol spec). |
| `zin_zol_host_1` … `zin_zol_host_12` | The First Host, The Second Host, … The Twelfth Host | P | Defined at start; recruited by Zol's mechanic when it raises hosts | Field marshal (the First Host) and generals. Formations, not persons; Zol's general name list holds only these ordinals, so the game never generates a personal name | skill 3 (the First Host 4); `unyielding_defender` | The same emblem with a numeral (P). |

Zol's servants (Great Spirits, Lesser Spirits, New Gods) exist (E) but their identities are unspecified (O). No character represents them.

#### Magical Forest

| Id | Name | St. | Appears | Role | Traits / skill | Portrait |
| --- | --- | --- | --- | --- | --- | --- |
| `<Magical Forest>_zin_ruler` | First Speaker Lusiel Velakorin | P | Start | Country leader; first among the elected houses (P constitution) | `zin_trait_speaker_of_houses`, `zin_trait_ancient_king` | Ancient elf in leaf-green, silver circlet (P). |
| `zin_magical_forest_perlan` | Perlan, Warden of the Dragon Roosts | P | Start | Political advisor; keeper of the elven pact with the dragons (E that elves command dragons; P office) | `zin_trait_dragon_warden` | Elf with dragon-scale cloak (P). |
| `zin_magical_forest_aenwe` | Loremaster Aenwe Lozari | P | Start | Theorist; remembers the Third Age and Varner | `zin_trait_elder_memory` | Elf scholar with a silver-bound book (P). |
| `zin_magical_forest_herrian` | Marshal Herrian Lustel | P | Start | Field marshal | skill 4; `ranger`, `defensive_doctrine` | Elf marshal in leaf-mail (P). |
| `zin_magical_forest_ithrandel` | Ithrandel, Captain of the Long Patrols | P (Magical Forest tree) | Defined at start; recruited by the tree's *Captains of the Houses* | Corps commander, skill 3; a younger captain beside Herrian | `ranger`, `trickster` | Young elf captain in patrol greens (P). |

#### Gala Elves

| Id | Name | St. | Appears | Role | Traits / skill | Portrait |
| --- | --- | --- | --- | --- | --- | --- |
| `zin_lorien` (renamed from `<Gala Elves>_zin_ruler`) | King Lorien | E | Start | Country leader; dies on `zin_lorien_dead` | `zin_trait_memory_of_dardan` (N7) | Immeasurably old elf king, sun-gold and white (P look). One state. |
| `zin_gala_heveneya` | Heveneya, Keeper of the Mirror | P (the Mirror of First Rain is P) | Start | Theorist | `zin_trait_keeper_of_the_mirror` | Elf with a water-filled bowl (P). |
| `zin_gala_sulestien` | Sulestien, Master of the King's Ships | P | Start | Navy leader; fits the ship Lorien gives Eindil (the crew's deaths are E; Sulestien need not sail) | skill 3; `blue_water_expert` | Elf captain in sea-white (P). |
| `zin_gala_tangsiel` | Tangsiel of the Sunward Guard | P | Start | Corps commander | skill 4; `desert_fox` | Elf guard captain in sun-gold mail (P). |

#### Coldor

| Id | Name | St. | Appears | Role | Traits / skill | Portrait |
| --- | --- | --- | --- | --- | --- | --- |
| `<Coldor>_zin_ruler` | Queen Vaestia of Coldor | P (lore digest question 15: queen, keeping today's female portrait slot) | Start | Country leader, High Crown | `zin_trait_winter_crown` | Queen in white furs (P). |
| `zin_coldor_essen` | Chancellor Essen Hendair | P | Start | Political advisor | `zin_adv_treasurer` | Grey-haired chancellor in fur-lined black (P). |
| `zin_coldor_alorio` | Harbour-Master Alorio Siul | P | Start | Political advisor for the western ports | `zin_trait_port_master` | Weathered harbour official (P). |
| `zin_coldor_grindok` | Marshal Grindok Azlen | P | Start | Field marshal | skill 4; `winter_specialist`, `trait_mountaineer` | Marshal in snow-white cloak (P). |

#### Noris and Stabilo

| Id | Name | St. | Appears | Role | Traits / skill | Portrait |
| --- | --- | --- | --- | --- | --- | --- |
| `<Noris>_zin_ruler` | King Esiurth II of Noris | P | Start | Country leader, High Crown | `zin_trait_caravan_master` | Desert king in indigo (P). |
| `zin_noris_alodar` | Alodar Kersi, Master of Caravans | P | Start | Political advisor | `zin_trait_caravan_broker` | Caravan master in sand-coloured robes (P). |
| `zin_noris_tumo` | Rider-General Tumo Furan | P | Start | Field marshal of the camel riders | skill 4; `cavalry_leader`, `desert_fox` | Rider-general with a veil and lance (P). |
| `<Stabilo>_zin_ruler` | Prince Cereos of Postondoroth | P | Start | Country leader, High Crown | `zin_trait_caravan_master` | Merchant-prince (P). |
| `zin_stabilo_mylun` | Lady Mylun Azano, Treasurer of the Pact | P | Start | Political advisor | `zin_trait_caravan_broker` | Treasurer with scales and seals (P). |
| `zin_stabilo_hardfic` | General Hardfic Shindor | P | Start | Field marshal | skill 3; `organizer` | General in bronze scale (P). |

No eastern character is marked as a future follower of Afrit. Which eastern kings join him willingly is open (O); it is decided in play by the Afrit and East mechanics.

#### Gunwaith

| Id | Name | St. | Appears | Role | Traits / skill | Portrait |
| --- | --- | --- | --- | --- | --- | --- |
| `<Gunwaith>_zin_ruler` | King Herlic of Gunwaith | P | Start | Country leader; signed the Truce of the Grey Ford (P) | `zin_trait_truce_maker` | Western king, clan plaid and iron circlet (P). |
| `zin_gunwaith_ilurda` | Lawspeaker Ilurda | P | Start | Theorist; keeper of Gunwaith's laws (the law Eindil later submits to, P episode) | `zin_trait_lawspeaker` | Old woman with a staff of carved law-marks (P). |
| `zin_gunwaith_datid` | Thane Datid Werlen | P | Start | Political advisor; wants the truce broken | `zin_trait_war_party` | Scarred war-thane (P). |
| `zin_gunwaith_sarudo` | Captain Sarudo Bolpor | P | Start | Field marshal | skill 3; `hill_fighter` | Clan captain in hill plaid (P). |

#### Goldoroth

| Id | Name | St. | Appears | Role | Traits / skill | Portrait |
| --- | --- | --- | --- | --- | --- | --- |
| `<Goldoroth>_zin_ruler` | Warking Gorduth of Cocanoor | P | Start | Country leader, Conquering Host | `zin_trait_warking` | Orc king in volcanic black iron (P). |
| `zin_goldoroth_bredo` | Bredo the Fire-Speaker | P | Start | Theorist; volcano shaman | `zin_adv_sage` | Orc shaman with ash-marked face (P). |
| `zin_goldoroth_sungor` | Sungor of the Volcano Clans | P | Start | Political advisor | `zin_adv_war_speaker` | Orc clan chief in red iron (P). |
| `zin_goldoroth_britag` | Warchief Britag | P | Start | Field marshal | skill 4; `offensive_doctrine` | Orc warchief with a spiked helm (P). |

#### Mirolon

| Id | Name | St. | Appears | Role | Traits / skill | Portrait |
| --- | --- | --- | --- | --- | --- | --- |
| `zin_mirolon_maeric` (replaces the generated `<Mirolon>_zin_ruler` on startup) | High Warden Maeric | P (Volgan mechanic, Mirolon tree) | Start | Country leader, stance `zin_light_wardens` (an elective warden-realm, owner short list 7, proposal) | `zin_trait_warden_of_the_passes` | Lake-country warden in blue-grey (P). |
| `zin_mirolon_selda` | Captain Selda Varrow | P (Volgan mechanic) | Defined at start, not recruited | General of the Pass Watch | as the Volgan spec sets | Pass captain in dust-grey mail (P). |
| `zin_mirolon_hadric` | Hadric Thorne, Scout-Master | P (Volgan mechanic) | Defined at start; recruited by the Mirolon tree's *The Scout-Master's School* | Intelligence advisor | as the Volgan spec sets | Lean scout-master with a spyglass (P). |
| `zin_mirolon_bennar` | Captain Bennar of the Passes | P | Start | Corps commander of the scouts who watch the Dead Lands | skill 3; `hill_fighter`, `ranger` | Scout with a dust-scarf (P). |
| `zin_mirolon_hessa` | Envoy Hessa Mencnor | P | Start | Political advisor; the envoy laughed out of Parim in 4A 1736 (P) | `zin_trait_unheeded_warning` | Old envoy (P). |

Maeric, Selda and Hadric are defined by the Volgan mechanic in `common/characters/zin_dominion.txt` (O7); the earlier draft's "First Warden Aldis Veleran" is dropped. Bennar and Hessa are this spec's.

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
| Kradlon | West Lands | First Guildsman Trilo Kradd | Guild republic |
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
| Avalon | East Lands | Tribune Arcon Vel | Republic of the Red Lands |
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

Every other country keeps its generated ruler name until its regional spec names it. The builder rejects a generated ruler or councillor name listed in `tools/content/data/name_blocklist.json` (new; seeded with names that read as jokes in English, for example "Dodo Zudotern", "Blackness Dole", "Uptons Pudor") and draws again with the next seed.

### Story figures and hidden figures

| Id | Name shown | St. | When | Role | Portrait |
| --- | --- | --- | --- | --- | --- |
| `zin_eindil` | "the Man from the Ice" until `zin_eindil_named`; "the King Without a House" may be used in event text after `zin_eindil_war_king`; "Eindil, son of Ein" after `zin_eindil_named` | E character; P epithets | `zin_eindil_awake` (P 1 Ironfrost 4A 1749) | Defined at start, recruited by nobody. Role and owner country follow the Eindil's journey spec | States: **E1** the Man from the Ice: gaunt, frost-burned, ragged furs, no crown. **E2** war-king of the West: plain armour, a borrowed banner. **E3** son of Ein: Lorien's armour and sword. **E4** bearer of Glo: Horos's blue sword, green light at his breast. **E5** restored: lightning in the eyes. **E6** the wounded king: cloak over both shoulders (arm O). **E7** crowned, wearing the Necklace of the Abyss. |
| `zin_varner` | Varner | E | `zin_eindil_returned` (P 4A 1757) | Lesser Spirit wizard; defined, not recruited at start; legend only | Wise wizard (appearance not established, lore digest question 13; P: weathered, grey-cloaked). Retired on `zin_varner_dead`. |
| `zin_golbran` | Golbran | E | With Varner | Varner's small purple servant; origin O | Small purple humanoid; no other features invented. |
| `zin_horos` (renamed from `<Yeldenne>_zin_ruler`) | Horos | E | Start | Yeldenne's country leader; dies on `zin_horos_dead` | Established look (see portrait rules). One state. |
| `zin_yeldenne_warden` | The Warden of Mp'E (P title; personal name O) | P | Defined at start; Yeldenne's leader after Horos dies ([Yeldenne and Glo](../04_mechanics/yeldenne_and_glo.md), which defines it) | Country leader | as that spec sets | A hooded warden in grey-green before a dim hall, face unseen (P). |
| `zin_sevrin` | Sevrin the Unending | P name | Hidden at start; joins the Worshipdom through the Afrit spec | See Worshipdom | See Worshipdom |
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
| Taryn of Gunwaith | P | Western commander at Dardan (lore digest question 17: used as a remembered hero) |
| Senra of Triton's Islands | P | Fleet captain of the Grand Alliance (same) |

## Implementation

### What is in the game today (commit `ca01fa3`)

- `tools/content/modules/characters.mjs` writes `common/characters/zin_rulers.txt` (one `<TAG>_zin_ruler` per country, recruited by the politics step's histories) and `localisation/english/zin_rulers_l_english.yml`. Canon rulers already carry their names: "The Golden King", "Volgan", "The Will of Zol", "Aurevan the Deliverer", "Horos", "King Lorien".
- `tools/content/modules/vanilla_removal.mjs` writes `common/country_leader/00_zin_leader_traits.txt`, which already holds every country-leader and advisor trait of this spec and the ideology spec, and `history/general/zin_general.txt` with three generated councillors for every court.
- `tools/content/modules/portraits.mjs` writes the portrait database `portraits/zin_portraits.txt` and the generated portrait sprites (two of each sex per people).

### Builder module and data

`characters.mjs` grows to read `tools/content/data/characters.json` (new) and write every character of this spec. `vanilla_removal.mjs` keeps its trait table until stage 2 of the vanilla removal, when `common/country_leader` is replaced: the trait table then moves into `characters.mjs`, which writes the same file name.

| Path | Kind | What |
| --- | --- | --- |
| `tools/content/data/characters.json` (new) | builder data | One entry per character: id, country name, name key, status, appears-when, roles (leader, advisor slot and cost, field marshal, corps commander, navy leader), traits, skills, portrait states and prompt reference |
| `tools/content/data/name_blocklist.json` (new) | builder data | Generated names the builder must not use |
| `common/characters/zin_rulers.txt` | generated | Rulers; names and portraits from `characters.json` where it has an entry, the generated pools elsewhere. For Volgan, the Gala Elves, Yeldenne and Zol the ruler id is the contract id (`zin_volgan`, `zin_lorien`, `zin_horos`, `zin_zol_will`), and the Worshipdom's ruler is `zin_aurevan`. The politics step's `recruit_character` lines for those five countries name the same ids (builder test). |
| `common/characters/zin_lore_characters.txt` | generated | Councillors, generals and story figures, including `zin_kessarion` and `zin_ossar` (the Afrit spec places them under its seats), every tree character listed below, and `zin_aurevan`, `zin_merovan` |
| `common/characters/zin_afrit_council.txt`, `zin_dominion.txt`, the Aenor and Yeldenne character files | written by their mechanic modules | `zin_ilvane`, `zin_corvel`, `zin_sevrin` (Afrit); Volgan's lieutenants and Mirolon's Maeric, Selda and Hadric (Volgan); the collective leaders (Aenor); `zin_yeldenne_warden` (Yeldenne and Glo). `characters.json` holds no second definition; a builder test fails on an id defined twice |
| `common/country_leader/00_zin_leader_traits.txt` | generated | Leader and advisor traits (table below, the ideology spec's traits and the Afrit spec's advisor traits) |
| `localisation/english/zin_characters_l_english.yml` | generated | Names, titles, trait text |
| `common/scripted_localisation/zin_lore.txt` | generated (names-and-terms module) | `zin_loc_deliverer`, `zin_loc_eindil` |
| `interface/zin_portraits_lore.gfx` | generated (portraits module) | Sprites `GFX_zin_portrait_<id>` and `GFX_zin_portrait_<id>_<state>` |
| `gfx/leaders/zin/lore/` | generated (portraits module) | Portrait files cut from image-generated sheets |
| `portraits/00_portraits.txt` | generated (portraits module), stage 2 | Overrides the vanilla file (vanilla removal §3.7): ZIN portrait sets by graphical culture `zin_<people>_gfx`, with no vanilla tag block |

### Characters from the trees

`characters.json` also holds every character a tree spec lists, so each is defined once by `characters.mjs`:

- **Regional trees** (pattern `zin_regional_<tree>_<who>`, contract additions): the courts of the tier B regional trees, recruited by their tree-declared `zin_regional_<tree>_recruit_<who>` effects or at the start as each tree says. The regional A trees add 52 entries (Cold Lands 12, Dark Lands 22, Dead Lands 18); the regional B trees add their own court tables.
- **Major trees:** for example `zin_magical_forest_ithrandel` (above) and Lerendor's `zin_lerendor_maelis`, `zin_lerendor_brannoc`, `zin_lerendor_ostvar` and `zin_lerendor_hesk` ([Lerendor tree](../05_focus_trees/major/lerendor.md)), recruited by the tree's `zin_<tree>_recruit` calls.
- **Proposed regional rulers** keep the id `<TAG>_zin_ruler`; their names sit in `zin_name_<realm>_ruler` keys (names spec pattern), so the owner can rename them in one place.

Tree specs that name `docs/design/characters.json` mean this file, `tools/content/data/characters.json`.

### Recruitment at the start

- Every character with "Start" is recruited by its country on 1 Thaw 4A 1748: rulers through the politics step's `recruit_character` line; every other character through `recruit_character` in the characters module's startup block (`common/on_actions/zin_characters.txt`, `on_startup`), so the politics step's histories need no new lines.
- `zin_eindil`, `zin_varner`, `zin_golbran` and `zin_sevrin` are defined and recruited by nobody.
- `zin_ilvane`, `zin_corvel`, `zin_kessarion` and `zin_ossar` are advisors with `allowed = { original_tag = <Worshipdom> }`, hireable from the start (Afrit spec).
- `zin_zol_host_1` … `_12` are recruited by the Zol mechanic when it raises hosts (`recruit_character`), never at start.
- Named councillors replace the generated ones: a court with named councillors in `characters.json` is left out of the `history/general/zin_general.txt` country list.

### Names that change with the story

| Character | Before | After | How |
| --- | --- | --- | --- |
| `zin_aurevan` | "Aurevan the Deliverer" (the public name sits in the key `zin_name_aurevan`, so the owner can swap in Aelorin, Arvedan, Vaelorian or Elarion in one place) | "Afrit" | `set_character_name` to the key `zin_name_afrit`, run by the Afrit spec's `zin_afrit_reveal` |
| `zin_eindil` | "the Man from the Ice" | "Eindil" | `set_character_name` to `zin_name_eindil`, run on `zin_eindil_named` by the Eindil's journey spec |

The Worshipdom reads "Afrit" in its own events, decisions and panel from day 1 through `[zin_loc_deliverer]` (names spec); the character's own name shows the public name to everyone until the reveal, because a character name is one string for all viewers.

### Scripted localisation

| Key | Returns |
| --- | --- |
| `zin_loc_deliverer` | "Afrit" when the viewing country is the Worshipdom (`zin_afrit_is_hub`) or `zin_afrit_revealed` is set; otherwise "Aurevan the Deliverer" (from `zin_name_aurevan`) |
| `zin_loc_eindil` | "the Man from the Ice" before `zin_eindil_named`; "Eindil" after |

### Story changes to characters

| Trigger | Change | Effect used |
| --- | --- | --- |
| `zin_golden_king_dead` | Golden King dies | `kill_country_leader` in Aenor (Aenor mechanic) |
| `zin_aurevan_crowned` | `zin_aurevan` becomes Aenor's leader; portrait A2 | `add_country_leader_role`, `set_portraits` (Aenor and Afrit mechanics) |
| `zin_afrit_revealed` | Name "Afrit"; portrait A3; trait `zin_trait_false_god` replaces `zin_trait_beloved_deliverer` | `set_character_name`, `set_portraits`, `add_country_leader_trait`, `remove_country_leader_trait` |
| `zin_eindil_awake` | `zin_eindil` enters play as E1 | Eindil's journey spec |
| `zin_eindil_named` | Name "Eindil"; portrait E3 | `set_character_name`, `set_portraits` |
| `zin_horos_dead`, `zin_lorien_dead`, `zin_varner_dead`, `zin_golbran_dead`, `zin_afrit_dead` | The character dies | `kill_country_leader` or `retire_character` |
| `zin_volgan_body_destroyed` | Volgan leaves the field; the Ember Herald becomes country leader; text says his body was destroyed, not that he died | `remove_country_leader_role` and `remove_unit_leader_role` (Volgan mechanic); never `retire_character` or `kill_country_leader`, never "killed" in text |

### Traits (proposed)

Country-leader and advisor traits in `common/country_leader/00_zin_leader_traits.txt`. Every modifier below exists in the 1.19.3 modifier documentation; the builder's `assertModifiers` check fails the build otherwise. Values are design targets and are the values in the game today.

| Trait | Modifiers |
| --- | --- |
| `zin_trait_seller_of_offices` | `political_power_gain = 0.15`, `stability_factor = -0.05`, `consumer_goods_factor = 0.03` |
| `zin_trait_lord_of_the_lost_cause` | `war_support_factor = 0.05`, `opinion_gain_monthly_factor = 0.10` |
| `zin_trait_beloved_deliverer` | `stability_factor = 0.10`, `political_power_factor = 0.15`, `intel_network_gain_factor = 0.25` |
| `zin_trait_false_god` | `political_power_factor = 0.15`, `stability_factor = -0.10`, `war_support_factor = 0.05` |
| `zin_trait_keeper_of_seals` | `political_power_factor = 0.10`, `stability_factor = 0.05` |
| `zin_trait_office_broker` | `political_power_gain = 0.10`, `consumer_goods_factor = 0.02` |
| `zin_trait_gilded_heir` | `political_power_factor = -0.10`, `stability_factor = -0.05` |
| `zin_trait_scholar_of_the_first_men` | `research_speed_factor = 0.03` |
| `zin_trait_keeper_of_rolls` | `civilian_intel_factor = 0.10`, `monthly_population = 0.05` |
| `zin_trait_free_dominion` | `autonomy_gain_global_factor = 0.10`, `stability_factor = 0.05` |
| `zin_trait_pilgrim_steward` | `opinion_gain_monthly_factor = 0.15` |
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
| `zin_trait_envoy_of_many_courts` | `intel_network_gain_factor = 0.20`, `improve_relations_maintain_cost_factor = -0.15` |
| `zin_trait_seeker_of_relics` | `research_speed_factor = 0.03`, `civilian_intel_factor = 0.10` |

`zin_trait_voice_of_the_temples` belonged to the retired priest of Parim (N10); it stays defined in the game today but no character uses it, and it leaves the trait table when `characters.mjs` takes it over. The Afrit spec's `zin_trait_high_confessor`, `zin_trait_master_of_couriers` and `zin_trait_unending_thief` join the table with that spec's values.

**Commander traits.** The unit-leader traits named above (`ranger`, `ambusher`, `winter_specialist`, `desert_fox`, `cavalry_leader`, `hill_fighter`, `trait_mountaineer`, `organizer`, `inspirational_leader`, `old_guard`, `career_officer`, `trickster`, `defensive_doctrine`, `offensive_doctrine`, `harsh_leader`, `trait_reckless`, `unyielding_defender`, `naval_invader`, `blue_water_expert`, `green_water_expert`, `bold`) are defined in `common/unit_leader/00_traits.txt`. Stage 2 overrides that file with the warfare spec's commander traits, which keep these keys with Erdae names ([01_warfare.md](../03_gameplay/01_warfare.md) §15).

### Portrait needs (summary)

| Group | Count | States | Notes |
| --- | ---: | ---: | --- |
| Tier A rulers (12 figures + the Zol emblem) | 13 | Aurevan 4, others 1 | Highest quality; Horos to the established description |
| Tier A councillors and generals, the Worshipdom's seat holders and their staff (Kessarion, Ossar), Volgan's three lieutenants, Mirolon's court, Ithrandel, and the three Southern Dominion rulers | 50 | 1 each | Small advisor and unit-leader portraits are cut by code from the large one |
| Zol's host emblems | 1 | 12 numerals | One emblem; numerals added by code from generated numeral art |
| Concord dominion rulers and Alleria | 12 | Alleria 2 | — |
| Other key tier B rulers (Horos and the Warden of Mp'E included) | 51 | 1 | — |
| Story figures (Eindil, Varner, Golbran) | 3 | Eindil 7 | No Eindil art may be referenced by any start file |
| **Total images** | about 140 | | Every generation recorded in `art/source/provenance.jsonl` |

Until a character's portrait exists, the builder uses its people's generated portrait with a build warning (never a vanilla portrait).

## AI

- AI recruits only characters marked "Start" and never recruits `zin_eindil`, `zin_varner`, `zin_golbran` or `zin_sevrin`; those enter only through mechanic effects.
- AI keeps the start advisors in their slots for the first year: their `ai_will_do` is 0 for dismissal and the generated councillors of those courts are not defined.
- The AI field marshals listed above command the AI's main army; generated generic leaders fill the rest. Zol never generates a named leader (its name list holds only the host ordinals).

## Acceptance

1. Every character with "Start" exists, is recruited by the right country on day 1, and has a name in localisation and a portrait sprite (the people fallback is allowed until the art phase, with a build warning) (builder test over `characters.json`; Linux run, console check of the five tier A courts).
2. `zin_eindil`, `zin_varner`, `zin_golbran` and `zin_sevrin` are recruited by no country on 1 Thaw 4A 1748.
3. No character text or name visible to a non-Worshipdom country before `zin_afrit_revealed` contains "Afrit", and the Worshipdom's leader is shown as "Aurevan the Deliverer" (secret scan of [03_names_and_terms.md](03_names_and_terms.md); Linux run reading the leader's name).
4. `zin_loc_eindil` returns "the Man from the Ice" when `zin_eindil_named` is unset and "Eindil" when set (scenario test with the flag set by console).
5. Every trait's modifiers exist in the modifier documentation (`assertModifiers`); every unit-leader trait named here is defined by a loaded file (check C3).
6. No character text states the Golden King's personal name, Afrit's or Eindil's birth order, Zol's administrator, or Golbran's origin (phrase scan with a list from this spec, plus review).
7. The Zol leader and host pictures are emblems with no figure (art review recorded in `provenance.jsonl`).
8. No file defines a name retired by N10 or the contract register's retired list; `zin_kessarion` and `zin_ossar` are each defined once and recruitable only by the Worshipdom (builder test).
9. Zol's leader is `zin_zol_will` in `zin_rulers.txt` and in the politics step's `recruit_character` line; Mirolon's leader on 1 Thaw 4A 1748 is `zin_mirolon_maeric`; `zin_volgan_ember_herald`, `zin_volgan_grave_warden`, `zin_volgan_ghorvak` and `zin_yeldenne_warden` are defined once, by their mechanic files; no id is defined both by `characters.json` and by a mechanic file (builder test).
10. In a scenario test, setting `zin_volgan_body_destroyed` leaves `zin_volgan` defined with no leader role and makes `zin_volgan_ember_herald` Volgan's country leader.

## Open questions

All proceed on the labelled proposal; the owner's answers go to [OPEN_QUESTIONS.md](../OPEN_QUESTIONS.md).

1. Should the Golden King have a personal name (candidates Arcedan VII, Leimar II, Hornan IV) and a living heir? **Proposal, in use:** no name shown; childless; Prince Eronel as the Golden Court's candidate (owner short list 2).
2. Is Aurevan approved as the public name? **Proposal, in use:** Aurevan (owner short list 1).
3. What do Volgan and Varner look like? **Proposal, in use:** the looks given above (lore digest question 13).
4. May the owner's private Horos drawings guide the portrait? **Proposal, in use:** no; the text description only (A6, owner short list 14).
5. Should Coldor's ruler be a queen or a king? **Proposal, in use:** Queen Vaestia (lore digest question 15).

Settled and no longer open here: "Eindil" is never shown before Lorien names him (D4); the Worshipdom's own texts say "Afrit" from day 1, while the character name changes at the reveal (this spec); Lerendor's ruler is King Ferlin III (open questions 28, Lerendor question 4); Kessarion and Ossar stay as lesser characters of the Council (N13); Volgan's lieutenants and Mirolon's ruler follow the Volgan mechanic (O7); Zol's leader is `zin_zol_will` (O6).
