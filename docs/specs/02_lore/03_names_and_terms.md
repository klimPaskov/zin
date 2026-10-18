# Names and terms

**Status:** Draft. **Priority:** 2. **Phase:** 2.

## Purpose

One glossary for every name a player can read: places, peoples, institutions, artifacts, titles and named events. It fixes the canonical spelling, records superseded names, marks what is established and what is proposed, and says which terms are hidden until a story flag. Writers of localisation, focus text and events use it; the content compiler enforces parts of it.

The vault stays canon. This file only indexes it.

## Lore basis

Vault: *Canon Policy*, *Names and Retcons*, *Erdae and Its Regions*, *Fourth Age Map of Erdae*, *Middle Lands and Aenor*, *Zols Mistake*, *Volgans Dead Lands*, *Nether*, *Abyss*, *Selen*, *Peoples of Erdae*, *Spirits and Their Ranks*, *Old Gods*, *New Gods*, *Holy Seven*, the politics notes, the artifact notes, *Fourth Age Chronology*, *The Campaign of 4A 1748*, *The Fourth Age of Erdae*, *Open Questions*. Map: `docs/name_table.csv` (711 drawn labels) and `localisation/replace/world_l_english.yml`.

Labels: **E** established; **W** working map-design table; **P** proposed; **O** open; **S** superseded (never in player text).

## Design

### Spelling rules

1. Use the canonical spellings: **Eindil**, **Zol's Mistake**, **Aenor**, **Šodolôrō**, **Golbran**, **Kilinti**, **Eekedor**, **R'en**, **Mp'E**.
2. Never use **Einendil**, **Edvoid**, **Rush**, **Gorbat** or **Klinti** in player text.
3. The game font draws only Windows-1252. **Šodolôrō** contains ō, which it cannot draw. In game text write **Šodolôro** (Š and ô are in Windows-1252; only the last letter changes). Specs and design files keep the canonical spelling.
4. Possessives keep the apostrophe: Zol's Mistake, Triton's Islands, Afrit's (after the reveal only).
5. Regions are capitalised as names: the Cold Lands, the Middle Lands. "Erdae" is the continent; "ZIN" is the wider universe and never appears in player text as a place.
6. Ages: "the Fourth Age"; dates as "1 Thaw, 4A 1748" in prose. Numbered ages are 1A, 2A, 3A, 4A.
7. Proposed names are written as names in game text (players do not see labels), but every proposed name has one localisation key so the owner can replace it.

### Places: regions

| Name | St. | Notes |
| --- | --- | --- |
| Erdae | E | The continent |
| Cold Lands | E | North-west; largest landmass; reaches off the west and north edges |
| West Lands | E | South of the Cold Lands; drawn sheet headed "North Earth" (S as a name) |
| Triton's Islands | E | West of the West Lands, around the Pupor Ocean; drawn as "Tornado Islands" (S) |
| North Lands | E | North of the Middle Lands across a narrow strait; "North Earth" in First Age texts means this region (S as a name); drawn sheet folder "East-Earth" |
| Dark Lands | E | Between the North Lands and the Middle Lands |
| Middle Lands | E | Geographic centre; formerly "Rush Land" (S) |
| Aenor Isle | E | Off the Middle Lands' west coast; part of the Middle Lands; formerly "Rush Islands" (S) |
| Magical Lands | E | East of the Middle Lands, same landmass |
| Zol's Mistake | E | The whole black north and every black island of the Ocean of Zol; formerly "Edvoid's Mistake" (S) |
| East Lands | E | Across the rift sea; drawn as "South-Earth" (S) |
| South Lands | E | The great desert of the East Lands, off the southern edge |
| Dead Lands | E | South of the Middle Lands; Volgan's domain |
| Islands of the South | E | Two arcs south of the West Lands |
| Lands of the Sun | E | Far south-west; formerly "Sunhot" as a place (S); the Sunhot elves keep their name |

### Places: seats, sites and features

| Name | St. | Notes |
| --- | --- | --- |
| Parim | W | Aenor's seat |
| The Golden Court | P | Palace district of Parim, completed 4A 1733 (P); also the King's party |
| The Great Lake | E | Aenor's heartland |
| The Great Wall of Aenor | E | Between the Middle Lands and the Magical Lands; runs from the Organ Mountains past Lunhrim and around Kingson (E geography) |
| The Pale March | P | Elzon's fortified line, rebuilt as the Great Wall |
| Organ Mountains, Lunhrim | E (owner) | The Wall's ends; exact places O |
| Selen | E | Middle Lands dominion of rangers |
| Kingson | E | Wall-gate dominion |
| Sonargur | W | Lerendor's seat |
| Fandanar | W | Coldor's seat |
| Furvior | W | Noris's seat |
| Postondoroth | W | Stabilo's seat |
| Cocanoor | W | Goldoroth's seat |
| Notbuton | W | Dondor's seat |
| Nafeher | W | Volgan's seat |
| Furviatlon | W | Seat of Zol's Mistake; who governs it is O |
| Šodolôrō | E | In Zol's Mistake; in game "Šodolôro" |
| Zilin Hills | E | The Worshipdom's valleys |
| Castle of Yeldenne | E | Horos's castle in Mp'E; the vault also writes "Castle Yeldenne". Game text uses **Castle of Yeldenne** |
| Mp'E | E | The frozen north of the Cold Lands; Yeldenne's state |
| Dragon Mountain | E | Home of dragons; not a country. The map has both "Dragon Mountain" and "Dragon's Mountain"; use **Dragon Mountain** |
| Mushroom Forest, Magic Mountains | E | Magical Lands features |
| The Abyss | E | In the Dead Lands; Roka's domain; not the Void, not the Nether |
| The Nether | E | South of the Dead Lands; seat of the King of Demons |
| The Void | E | Where Volgan was banished; a realm, not on the map |
| Dardan | E battle; O place | Never placed on the map until the owner decides |
| The palace cliff | E event; O place | Near Parim, scripted only |
| Eindil's ice | E region (Cold Lands); P exact place | A remote north-west state |
| Bridge of the Three Oaths, Girdon's Winter Ford | P | Eindil's western episodes |
| The Grey Ford | P | Where Gunwaith and Girdon signed their truce in 4A 1745 |
| The Mirror of First Rain | P | Lorien's spring at Gala |
| The central sea | E | Between the West Lands and the Middle Lands; much wider than drawn. Its proper name is not established (O) |

### Places: seas

| Name | St. | Notes |
| --- | --- | --- |
| Ocean of Zol | E | The northern ocean of Zol's Mistake; formerly "Ocean of Edvoid" (S) |
| Pupor Ocean | E | Encircled by Triton's Islands |
| Sea of Darkness | E | Dark Lands |
| Sea of Gods | E | Lands of the Sun |
| Leren Ocean, Sea of R'en | drawn | North Lands |
| The Ocean of Peace | drawn | South-west of the Middle Lands |
| Sea of Death, Demonic Sea, The Dead's Sea | drawn | Dead Lands |
| All other drawn seas | drawn | As in `docs/name_table.csv`; uncertain readings stay flagged and are not used in game text |

Drawn labels that still carry a superseded word ("Rush Ocean", "Rush Forest", "Rush Mountains") need new names before they appear in game text. Proposed: **Crown Ocean**, **Crown Forest**, **Crown Mountains** (P).

### Peoples

| Name | St. | Notes |
| --- | --- | --- |
| Men | E | Common Folk; many regional kinds (Middle Kingdom peoples, Dondor Brutes, Noris camel warriors, Gunwaith clans, Girdon wardens, Buldor companies, Aenor Isle houses, Goodin Sunfolk) |
| The First Men; the Ainu | E | The ancient, stronger, longer-lived men. What "Ainu" names exactly is O: use "the First Men" in game text |
| Elves | E | Great Folk: the elves of the Magical Forest, the Sunhot elves, the Gala elves, the God Forest Keepers |
| Sunhot elves | E | Over three metres tall; strongest and most peaceful; Lands of the Sun |
| Gala elves | E | Lorien's people. Their relationship to the Sunhot elves is O |
| Dwarves | E | Common Folk; homeland O: never place them |
| Giants | E | Hiloron giants, Titanos ice giants, Forgotten Giants |
| Ents | E | The people of Kilinti Forest |
| Yeti, mycids, arcanists of the Zhen Hills | E | — |
| Orcs, goblins, trolls, ogres | E | Many independent societies; not one obedient faction |
| Demons | E | Corrupted angels in the order-of-beings account; includes Shachihata, Netherborn (serving Volgan) and Afrit's demons |
| Angels | E | Great Folk; history unwritten |
| Grave hosts, the undead | E | Volgan's necromantic dead |
| Zol's dead | E | Sustained by an Old God's own magic; ordinary weapons cannot end them. Never call them Volgan's |
| Dragons | E | From Dragon Mountain; not a country; elves can command them |
| Rhinoceros-headed people of the Abyss | E | Roka's people; their name is O |
| Easterlings | E (First Age usage) | Archaic name for East Lands peoples; use only in old texts |

### Divine and spirit orders

| Term | St. | Notes |
| --- | --- | --- |
| He Who Was, Is and Will Be | E | The supreme Creator; almost unknown to mortals |
| The Holy Seven | E | Creators of the Old and New Gods; few believe they existed. Mythic names (Seven Before Names, Seven Who Never Were…) are P and unselected |
| Old Gods | E | Zol is the only one in Erdae |
| New Gods | E | Younger gods; Glernaen is one. Names and number mostly O |
| Great Spirit, Lesser Spirit | E | The two spirit ranks. "Sovereign Spirit" is rejected: never use it |
| Great Folk, Common Folk | E | Immortal and mortal peoples |
| The Fading | E | What limits the Old Gods; cause O |
| Damned Spirits | E | Deep-dwelling spirits |

### Institutions, polities and agreements

| Name | St. | Notes |
| --- | --- | --- |
| Aenor, the Middle Kingdom | E | Formerly "Rush" (S). Adjective: Aenoran |
| Middle Kingdom Concord | W | Aenor and its chartered dominions |
| Charters of Parim | P | 4A 3; the dominions' constitution |
| Concord Council | P | First held 4A 212 |
| The Lost Cause | E | The Golden King's league "against the powers of the dark" |
| The Golden Court | P | The King's party of office-buyers and courtiers; also the succession camp (E camp name) |
| Free Dominions | E | Succession camp |
| Afrit's supporters | E | Succession camp; before the reveal, game text calls it **the Deliverer's Faithful** (P) |
| Eindil's popular host | E | Succession camp; before `zin_eindil_named`, **the Stranger's Host** (P) |
| Afrit's Hidden Council | E | The god's secret council; four seats (P structure) |
| Houses of the First Light | P | Hospitals, grain stores and birth rolls of the kingdom |
| The Worshipdom | E | Temple-state in the Zilin Hills |
| Leren Compact | W | Lerendor and Eekedor (membership of Andos Enda unresolved) |
| Treaty of the Narrow Strait | P name, E "old alliance" | 4A 512 (P) |
| Northern Accord | W | Coldor and Horidor |
| Noris Treaty | W | Noris and Gondolin |
| Stabilo Pact | W | Stabilo and Drak |
| Dark Sea Accord | W | Dondor and Belonton |
| Southern Dominion | W | Volgan, Demon, Dolon, Nezer |
| Truce of the Grey Ford | P | Gunwaith and Girdon, 4A 1745 |
| The Wall Accord | P | 4A 96; the elves and the crown agree to keep the Wall |
| Universities of Parim and Selen | P | Founded 4A 340 |
| The Grand Alliance | E | Edran's First Age alliance |
| Charter of Free Banners | P | The Grand Alliance's charter |
| Elzon's Order | E; "the Pale Regency" P | The Third Age occupation |
| The Lantern Chain | P | Varner's Third Age network of healers and wardens |

### Artifacts

| Name | St. | Notes |
| --- | --- | --- |
| Glo | E | Green crystal holding part of Glernaen's power; Horos's own heart |
| Horos's blue sword | E | Given to Eindil; later crushed by Zol |
| The Necklace of the Abyss | E | Roka's necklace; Afrit's greatest artifact; Eindil wears it at the end |
| Ring of Doors | P name; E a ring | Afrit's escape artifact |
| Crown of Witnesses | P | Draws power from prepared oaths |
| Bracelet of the First Seal | P | Part of Afrit's personal shield |
| The Mirror of First Rain | P | A spring, not an object |

### Titles and epithets

| Title | St. | Who | Notes |
| --- | --- | --- | --- |
| First of His Name | E | Aen; later claimed by Aurevan | — |
| The Golden King | E | Aenor's king | His personal name is O |
| The Deliverer | E | Afrit's public religious identity | Always safe before the reveal |
| Aurevan, Aurevan the Deliverer | P | Afrit's public name | Candidates: Aelorin, Arvedan, Vaelorian, Elarion |
| King of Aenor, First of His Name, and New God of Men | E (King of Men, New God); P (full form) | Aurevan after the crowning | — |
| King of the East | E | Afrit after he abandons Aenor | — |
| New God of Deliverance, Protection and Renewal | P (chronicle detail) | The Deliverer's worship | — |
| The Man from the Ice; the King Without a House | P | Eindil before he is named | — |
| Eindil, son of Ein | E | After Lorien names him | — |
| The Restorer | P | Harion, first restored king | — |
| The Unending | P | Sevrin | — |
| The Great Necromancer | E | Elzon | — |
| King of Demons | E | Lord of the Nether | Name O |
| Lord-Commander, First Warden, Hierarch, Lawspeaker, Warden of the Rolls… | P | Court titles in [02_characters.md](02_characters.md) | — |

### Named events

| Name | St. | When |
| --- | --- | --- |
| The War of Men | E | Before 1A |
| Battle of Dardan | E | Late First Age |
| The Elven Refusal | E event, P name | Second Age |
| The Last Tithe | P name, E outcome | End of the Third Age |
| The War of Unbinding | P | Late Third Age |
| The Thousand-Year Jubilee | P | 4A 1000 |
| The theft of the Necklace | E; date P (4A 1611) | Fourth Age |
| The War of the Last Crowns | P name, E war | 4A 1755 (P) |
| The Western Crossing | P name, E event | 4A 1755 (P) |

### Superseded names

| Superseded | Current | Where the old name may survive |
| --- | --- | --- |
| Einendil | Eindil | Archived sources only |
| Edvoid; Edvoid's Mistake; Ocean of Edvoid | Zol; Zol's Mistake; Ocean of Zol | Archived sources; two internal strategic-region file names (rename on next map rebuild) |
| Rush; Rush Kingdom | Aenor, the Middle Kingdom | Archived sources |
| Rush Land | Middle Lands | Drawn sheet names |
| Rush Islands | Aenor Isle | Drawn sheet names |
| Rush Ocean, Rush Forest, Rush Mountains | Crown Ocean, Crown Forest, Crown Mountains (P) | Drawn labels |
| Klinti, Klinti Forests | Kilinti, Kilinti Forests (one country) | Drawn labels |
| Gorbat | Golbran | Owner's retelling |
| North Earth (as a region) | North Lands | First Age texts, drawn sheet heading |
| Tornado Islands | Triton's Islands | Drawn sheet heading |
| Sunhot (as a place) | Lands of the Sun | Drawn labels (Sunhot Desert, Sunhot Gate, Sunhot Grasslands) |
| The 100,000-year and 5,000-year ages of Eindil | No numeric age | Archived sources |
| The 128-year Third Age | At least 1,200 years | Archived sources |
| Sovereign Spirit (as a rank) | Great Spirit or Lesser Spirit | Never |

**Unresolved pair:** **Huhun** (historical) and **Hunhun** (working satellite list) may or may not be the same place (O). The country is Hunhun; do not merge the names in text.

### Labels before and after a reveal

Some things have a public label and a true one. Before the flag, every country except the one named sees only the public label.

| Concept | Public label (before) | True label (after) | Flag | Who sees the truth earlier |
| --- | --- | --- | --- | --- |
| Afrit | the Deliverer; Aurevan the Deliverer (P) | Afrit | `zin_afrit_revealed` | The Worshipdom |
| The Hidden Council | the Royal Council; its pull on Aenor shown as **Counsel of the Temples** (P) | Afrit's Hidden Council | `zin_afrit_revealed` | The Worshipdom |
| Council influence (`zin_council_influence`) | Counsel of the Temples | The Hidden Council's Grip (P) | `zin_afrit_revealed` | The Worshipdom |
| Footholds (`zin_footholds`) | Temples and Relief Houses (P) | The Deliverer's Footholds (P) | `zin_afrit_revealed` | The Worshipdom |
| Afrit's supporters (succession camp) | the Deliverer's Faithful (P) | Afrit's supporters | `zin_afrit_revealed` | The Worshipdom |
| Eindil | the Man from the Ice (P) | Eindil, son of Ein | `zin_eindil_named` | Nobody |
| Eindil's popular host | the Stranger's Host (P) | Eindil's Host | `zin_eindil_named` | Nobody |
| Glo | a crystal of old and holy power | Horos's own heart | `zin_horos_dead` | Yeldenne |
| The thief | (unknown) | Sevrin the Unending (P) | Afrit mechanic event | The Worshipdom |
| The lesser artifacts | (unknown) | Ring of Doors, Crown of Witnesses, Bracelet of the First Seal (P) | `zin_afrit_revealed` | The Worshipdom |
| The plot against the Golden King | (unknown; his death is "sudden") | Afrit's murder of the Golden King | `zin_afrit_revealed` | The Worshipdom |

### Adjectives

| Country | In game today | Required |
| --- | --- | --- |
| Aenor | Aenorian | **Aenoran** (vault usage). Change only after the Aenor start crash is solved, because the adjective is a crash suspect ([known issues](../01_map/03_known_issues.md)) |
| Lerendor | Lerendor | **Leren** (vault usage: "the Leren court") |
| Mirolon | Mirolon | **Mirolonese** (vault usage) |
| Others | country name | Keep until a regional spec chooses |

### Never in player text

Einendil; Edvoid; Rush (as a place or kingdom); Klinti; Gorbat; Sovereign Spirit; "Afrit" and "Hidden Council" before the reveal (except to the Worshipdom); "Eindil" before `zin_eindil_named`; any name for Zol's administrator, the King of Demons, Roka's people, Volgan's former New God patron, or Glernaen's fellow gods.

## Implementation

| Path | What |
| --- | --- |
| `docs/design/glossary.json` (new) | Term, kind, status, canonical spelling, in-game spelling, superseded forms |
| `docs/design/secret_terms.json` (new) | Gated terms: term, flag, countries allowed earlier. Read by the compiler's secret scan |
| `common/scripted_localisation/zin_lore.txt` | `zin_loc_deliverer`, `zin_loc_eindil` and one `defined_text` per public/true pair above, named `zin_loc_<concept>` |
| `localisation/english/zin_terms_l_english.yml` | One key per proposed name: `zin_name_<key>` (for example `zin_name_aurevan`, `zin_name_treaty_narrow_strait`) |

Compiler checks (added to the focus compiler's text check and run over all localisation):

1. No superseded name from the table appears in any localisation file.
2. No gated term appears in text reachable before its flag, unless the text is shown only to an allowed country. Text that needs a gated term uses the `zin_loc_<concept>` scripted localisation instead.
3. Every character in game text is Windows-1252.
4. "Dragon's Mountain" is reported as a duplicate of "Dragon Mountain".

## AI

None.

## Acceptance

1. The superseded-name check passes over the whole mod.
2. The gated-term check passes: a test build with a deliberate "Afrit" in an Aenor event fails, and the same text through `[zin_loc_deliverer]` passes.
3. Šodolôro renders in game without missing glyphs (Linux screenshot of its victory point label, attached to the phase report).
4. Every proposed name in game text comes from a `zin_name_<key>` key.

## Open questions

1. Is "Šodolôro" acceptable in game text, or should the owner choose another font-safe form?
2. Do the drawn "Rush Ocean", "Rush Forest" and "Rush Mountains" need names (Crown Ocean, Crown Forest, Crown Mountains are proposed), and what is the central sea called?
3. Are Huhun and Hunhun the same place?
4. Should game text use "Castle of Yeldenne" or "Castle Yeldenne"?
5. Should the drawn "Sunhot" labels (Sunhot Desert, Sunhot Gate, Sunhot Grasslands) be renamed now that Sunhot is no longer a place name?
6. Approve or replace the public labels "Counsel of the Temples", "the Deliverer's Faithful" and "the Stranger's Host".
