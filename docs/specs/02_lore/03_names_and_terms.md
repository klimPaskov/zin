# Names and terms

**Status:** Ready. Reviewed 19 October 2026 against CONVENTIONS "Status"; integrated 19 October 2026. **Priority:** 2. **Phase:** 2.

## Purpose

One glossary for every name a player can read: places, peoples, institutions, artifacts, titles and named events. It fixes the canonical spelling, records superseded names, marks what is established and what is proposed, and says which terms are hidden until a story flag. Writers of localisation, focus text and events use it; the content builder's text checks enforce it.

The vault stays canon. This file only indexes it. Where a mechanic spec owns the public label of its own variable (Aenor's Temple Favour, Afrit's Houses of the First Light), that label is used here.

## Lore basis

Vault: *Canon Policy*, *Names and Retcons*, *Erdae and Its Regions*, *Fourth Age Map of Erdae*, *Middle Lands and Aenor*, *Zols Mistake*, *Volgans Dead Lands*, *Nether*, *Abyss*, *Selen*, *Peoples of Erdae*, *Spirits and Their Ranks*, *Old Gods*, *New Gods*, *Holy Seven*, the politics notes, the artifact notes, *Fourth Age Chronology*, *The Campaign of 4A 1748*, *The Fourth Age of Erdae*, *Open Questions*. Map: `docs/name_table.csv` (711 drawn labels) and `localisation/replace/world_l_english.yml`. Decisions: [INTEGRATION_DECISIONS.md](../INTEGRATION_DECISIONS.md) D3, D4, N10, N16, O5, O7, S4, S11.

Labels: **E** established; **W** working map-design table; **P** proposed; **O** open; **S** superseded (never in player text).

## Design

### Spelling rules

1. Use the canonical spellings: **Eindil**, **Zol's Mistake**, **Aenor**, **Šodolôrō**, **Golbran**, **Kilinti**, **Eekedor**, **R'en**, **Mp'E**.
2. Never use **Einendil**, **Edvoid**, **Rush**, **Gorbat**, **Klinti** or **Huhun** in player text.
3. The game font draws only Windows-1252. **Šodolôrō** contains ō, which it cannot draw. Game text writes **Šodolôro** (S11). Š and ô are in Windows-1252 and in every font ZIN uses (checked 19 October 2026 in the installed `gfx/fonts`). Specs and design files keep the canonical spelling.
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
| South Lands | E | The great desert of the East Lands (the Noris desert and the former Sunhot desert), which extends south off the map. On the map it is the East Lands' southern desert (owner short list 6, proposal) |
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
| Organ Mountains, Lunhrim | E (owner) | The Wall's ends; exact places O (owner short list 3) |
| Selen | E | Middle Lands dominion of rangers |
| Kingson | E | Wall-gate dominion |
| Hunhun | E (working satellite list) | The riders' dominion. The vault's historical "Huhun" is treated as the same place, spelled Hunhun in game text (owner short list 15, proposal) |
| Sonargur | W | Lerendor's seat |
| Fandanar | W | Coldor's seat |
| Furvior | W | Noris's seat |
| Postondoroth | W | Stabilo's seat |
| Cocanoor | W | Goldoroth's seat |
| Notbuton | W | Dondor's seat |
| Nafeher | W | Volgan's seat |
| Furviatlon | W | Seat of Zol's Mistake; who governs it is O |
| Šodolôrō | E | In Zol's Mistake; in game "Šodolôro" (S11) |
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
| Eindil's ice | E region (Cold Lands); P exact place | A remote north-west state (`zin_is_site_eindil_ice`) |
| Bridge of the Three Oaths, Girdon's Winter Ford | P | Eindil's western episodes |
| The Grey Ford | P | Where Gunwaith and Girdon signed their truce in 4A 1745 |
| The Mirror of First Rain | P | Lorien's spring at Gala |
| The central sea | E | Between the West Lands and the Middle Lands; much wider than drawn. Its proper name is not established (O); game text says "the central sea" |

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

Drawn labels that carry a superseded word get new names in game text: **Crown Ocean**, **Crown Forest**, **Crown Mountains** for "Rush Ocean", "Rush Forest" and "Rush Mountains" (P). Drawn labels that use "Sunhot" as a place become **Sun Desert**, **Sun Gate** and **Sun Grasslands** (P). The politics step writes these names; the superseded-name check below fails the build until it does.

### Peoples

| Name | St. | Notes |
| --- | --- | --- |
| Men | E | Common Folk; many regional kinds (Middle Kingdom peoples, Dondor Brutes, Noris camel warriors, Gunwaith clans, Girdon wardens, Buldor companies, Aenor Isle houses, Goodin Sunfolk) |
| The First Men; the Ainu | E | The ancient, stronger, longer-lived men. What "Ainu" names exactly is O: use "the First Men" in game text |
| Elves | E | Great Folk: the elves of the Magical Forest, the Sunhot elves, the Gala elves, the God Forest Keepers |
| Sunhot elves | E | Over three metres tall; strongest and most peaceful; Lands of the Sun |
| Gala elves | E | Lorien's people. Their relationship to the Sunhot elves is O |
| Dwarves | E | Common Folk; homeland O: never place them (owner short list 12, proposal) |
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
| Middle Kingdom Concord | W | Aenor and its 26 chartered dominions |
| Charters of Parim | P | 4A 3; the dominions' constitution |
| Concord Council | P | First held 4A 212 |
| The Lost Cause | E | The Golden King's league "against the powers of the dark"; an institution inside Aenor's mechanic at the start (S3) |
| The Golden Court | P | The King's party of office-buyers and courtiers; also the succession camp (E camp name) |
| Free Dominions | E | Succession camp |
| Afrit's supporters | E | Succession camp; before the reveal, game text calls it **the Deliverer's Faithful** (P) |
| Eindil's popular host | E | Succession camp; before `zin_eindil_named`, **the Stranger's Host** (P) |
| Afrit's Hidden Council | E | The god's secret council; four seats (P structure): Seals, Censers, Whispers, Relics (Afrit spec) |
| The Faithful of the Deliverer | P | The Worshipdom's party until the reveal (D1) |
| Houses of the First Light | P | Hospitals, grain stores and birth rolls of the kingdom; the public face of the footholds |
| The Worshipdom | E | Temple-state in the Zilin Hills |
| Leren Compact | W | Lerendor and Eekedor. Andos Enda is not a member at the start (S5) |
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
| The Black Compact | P | The Volgan–Zol truce (`zin_black_compact`, N2; Volgan spec) |
| The Free Crowns | P | Eastern courts that refuse the King of the East (eastern kings spec) |
| The Kindred of the Woods | P | The Magical Lands elves' defensive league (elves spec) |
| The Noon League | P | The Lands of the Sun's defensive league (Lands of the Sun spec) |
| The Pupor Charter | P | The chart houses' league of Triton's Islands (shared Triton's Islands tree) |
| The Free Crowns of the North | P | Sensai's league of free North Lands crowns (regional North Lands tree) |
| The Warden League | P | Mirolon's league of the free south (Mirolon tree) |

### Artifacts

| Name | St. | Notes |
| --- | --- | --- |
| Glo | E | Green crystal holding part of Glernaen's power; Horos's own heart |
| Horos's blue sword | E | Given to Eindil; later crushed by Zol (flag `zin_horos_sword_broken`, N1) |
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
| Aurevan, Aurevan the Deliverer | P | Afrit's public name | Candidates: Aelorin, Arvedan, Vaelorian, Elarion (owner short list 1) |
| King of Aenor, First of His Name, and New God of Men | E (King of Men, New God); P (full form) | Aurevan after the crowning | — |
| King of the East | E | Afrit after he abandons Aenor | — |
| The Dominion of the East | P | Cosmetic name of Afrit's realm as King of the East (S1) | Shown only after `zin_afrit_king_of_east` |
| New God of Deliverance, Protection and Renewal | P (chronicle detail) | The Deliverer's worship | — |
| The Man from the Ice; the King Without a House | P | Eindil before he is named | Only these before `zin_eindil_named` (D4) |
| Eindil, son of Ein | E | After Lorien names him | — |
| The Will of Zol | P | The emblem that leads Zol's realm (S4) | Never a person |
| The First Host, the Second Host, … | P | Zol's host commanders | Formations, not persons |
| The Restorer | P | Harion, first restored king | — |
| The Unending | P | Sevrin | — |
| The Great Necromancer | E | Elzon | — |
| King of Demons | E | Lord of the Nether | Name O |
| High Confessor, Master of Couriers | P | Ilvane, Corvel (Afrit spec, N10) | Public titles; their Council seats are hidden. The Council's only priest is the High Confessor (N16) |
| The Envoy; the Reliquary's scholar | P | Kessarion, Ossar (Afrit spec, N13) | Shown only to the Worshipdom |
| High King of the Sands; The Prince of All Roads | P | Noris's and Stabilo's unification titles (eastern kings spec, Noris and Stabilo trees) | Titles of a play outcome, never history |
| The Ember Herald, Steward of Nafeher; the Grave-Warden | P | Volgan's lieutenants (Volgan spec, O7) | — |
| High Warden | P | Maeric of Mirolon (Volgan spec, O7) | — |
| The Warden of Mp'E | P title; name O | Yeldenne's leader after Horos (Yeldenne and Glo spec) | — |
| Lord-Commander, First Warden, Lawspeaker, Warden of the Rolls… | P | Court titles in [02_characters.md](02_characters.md) | — |

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
| Huhun | Hunhun (P, same place) | Vault history notes |
| North Earth (as a region) | North Lands | First Age texts, drawn sheet heading |
| Tornado Islands | Triton's Islands | Drawn sheet heading |
| Sunhot (as a place) | Lands of the Sun; Sun Desert, Sun Gate, Sun Grasslands (P) | Drawn labels |
| The 100,000-year and 5,000-year ages of Eindil | No numeric age | Archived sources |
| The 128-year Third Age | At least 1,200 years | Archived sources |
| Sovereign Spirit (as a rank) | Great Spirit or Lesser Spirit | Never |
| Hierarch Aubren | Ilvane, High Confessor (N10) | Retired spec drafts |

### Labels before and after a reveal

Some things have a public label and a true one. Before the flag, every country except the one named sees only the public label. Each pair is one scripted localisation key `zin_loc_<concept>`.

| Concept | Key | Public label (before) | True label (after) | Flag | Who sees the truth earlier |
| --- | --- | --- | --- | --- | --- |
| Afrit | `zin_loc_deliverer` | Aurevan the Deliverer (P) | Afrit | `zin_afrit_revealed` (historically at his flight east, D3) | The Worshipdom |
| The Hidden Council | `zin_loc_council` | the Royal Council | Afrit's Hidden Council | `zin_afrit_revealed` | The Worshipdom |
| Council influence (`zin_council_influence`) | `zin_loc_council_influence` | Temple Favour (Aenor spec) | The Hidden Hand (Aenor spec) | `zin_afrit_revealed`, or Aenor's `zin_aenor_hidden_hand_seen` | The Worshipdom |
| Footholds (`zin_footholds`) | `zin_loc_footholds` | Houses of the First Light (Afrit spec) | The Deliverer's Footholds (P) | `zin_afrit_revealed` | The Worshipdom |
| Afrit's supporters (succession camp) | `zin_loc_camp_faithful` | the Deliverer's Faithful (P) | Afrit's supporters | `zin_afrit_revealed` | The Worshipdom |
| Eindil | `zin_loc_eindil` | the Man from the Ice (P) | Eindil, son of Ein | `zin_eindil_named` | Nobody |
| Eindil's popular host | `zin_loc_camp_host` | the Stranger's Host (P) | Eindil's Host | `zin_eindil_named` | Nobody |
| Glo | `zin_loc_glo` | a crystal of old and holy power | Horos's own heart | `zin_horos_dead` | Yeldenne |
| The thief | `zin_loc_thief` | (not mentioned) | Sevrin the Unending (P) | Afrit mechanic event | The Worshipdom |
| The lesser artifacts | `zin_loc_artifacts` | Graces of the Deliverer | Ring of Doors, Crown of Witnesses, Bracelet of the First Seal (P) | `zin_afrit_revealed` | The realm Afrit rules and the Worshipdom |
| The plot against the Golden King | `zin_loc_kings_death` | a sudden death | Afrit's murder of the Golden King | `zin_afrit_revealed` | The Worshipdom |

### Adjectives

| Country | In game today (politics step, `<TAG>_ADJ`) | Required |
| --- | --- | --- |
| Aenor | Aenorian | **Aenoran** (vault usage). The Aenor start crash was the flag sheet, not the adjective ([known issues](../01_map/03_known_issues.md) §1), so the politics step changes it in phase 2 |
| Lerendor | Lerendor | **Leren** (vault usage: "the Leren court") |
| Mirolon | Mirolon | **Mirolonese** (vault usage) |
| Others | country name | Keep until a regional spec chooses |

### Never in player text

Einendil; Edvoid; Rush (as a place or kingdom); Klinti; Gorbat; Huhun; Hierarch; Sovereign Spirit; Sunhot as a place name; "Afrit" and "Hidden Council" before the reveal (except to the Worshipdom); "Eindil" before `zin_eindil_named`; any name for Zol's administrator, the King of Demons, Roka's people, Volgan's former New God patron, or Glernaen's fellow gods.

## Implementation

### Builder module, data and checks

A new content-builder module, `tools/content/modules/terms.mjs`, writes the scripted localisation and the term keys. A new check, `tools/content/checks/text_terms.mjs`, runs on every build over the whole staged tree (all localisation, including the politics step's `localisation/replace/world_l_english.yml`, state names and victory point names) and from `npm test` in `tools/`.

| Path | Kind | What |
| --- | --- | --- |
| `tools/content/data/glossary.json` (new) | builder data | Term, kind, status (E/W/P/O/S), canonical spelling, in-game spelling, superseded forms, key (`zin_name_<key>` for proposed names) |
| `tools/content/data/secret_terms.json` (new) | builder data | Gated terms: term, pattern, flag, countries allowed earlier (by name), allowed files or event ids (for example `zin_lore.2`, `zin_lore.220`, `zin_lore.221`) |
| `common/scripted_localisation/zin_lore.txt` | generated by `terms.mjs` | One `defined_text` per row of the reveal table, named as there. Each tests the flag with the start spec's triggers `zin_afrit_secret_kept` and `zin_eindil_known_by_name`, and the earlier viewer with the Afrit spec's `zin_afrit_is_hub` or `zin_afrit_rules_here` on ROOT |
| `localisation/english/zin_terms_l_english.yml` | generated by `terms.mjs` | One key per proposed name: `zin_name_<key>` (for example `zin_name_aurevan`, `zin_name_afrit`, `zin_name_eindil`, `zin_name_treaty_narrow_strait`), including `zin_name_<realm>_ruler` for every proposed regional ruler the tree specs name (for example `zin_name_halenor_ruler`, `zin_name_seite_ruler`); the characters module reads these keys for the ruler names |

### Checks

| # | Check | Fails when |
| --- | --- | --- |
| T1 | Superseded names | Any value in a ZIN localisation file contains a superseded name of the table (whole word, case-insensitive), outside an allowlisted archive key. "Dragon's Mountain" is reported as a duplicate of "Dragon Mountain" |
| T2 | Gated terms | A gated term appears in a value that can be shown before its flag to a country that is not allowed. The check follows keys into events, decisions, focuses, ideas, characters, ideologies, parties, country names and descriptions, bookmarks and tooltips. A value that uses the `zin_loc_<concept>` key instead passes. Events and files listed in `secret_terms.json` pass for their allowed country |
| T3 | Encoding | A localisation file is not UTF-8 with BOM, or a value holds a character outside Windows-1252 |
| T4 | Glyphs | A character used in ZIN text is missing from one of the installed fonts the interface draws text with (`gfx/fonts/vic_*.fnt`, `garamond_*.fnt`, `Arial12.fnt`, `cg_*.fnt`, read-only). The typewriter fonts lack Š; ZIN text drawn with them never uses it |
| T5 | Proposed names | A proposed name of the glossary appears in a value as literal text instead of through its `zin_name_<key>` key (event and focus text may embed the key as `$zin_name_<key>$`) |
| T6 | Retired labels | A localisation value still uses a retired scripted localisation or label of the contract register, for example `[zin_afrit_name]` instead of `[zin_loc_deliverer]` (N16); runs with the build's names check `tools/content/checks/names.mjs` |

## AI

None.

## Acceptance

1. T1 passes over the whole staged mod; a test build with "Edvoid" planted in a state name fails.
2. T2 passes; a test build with a deliberate "Afrit" in an Aenor event fails, and the same text through `[zin_loc_deliverer]` passes.
3. T3 and T4 pass; "Šodolôro" is drawn by every font T4 reads (builder test).
4. T5 passes: every proposed name in game text comes from a `zin_name_<key>` key.
5. Each `zin_loc_<concept>` key returns the public label before its flag and the true label after it (scenario test setting each flag by console in the Linux run).
6. T6 passes; a test build with `[zin_afrit_name]` planted in an event description fails.

## Open questions

All proceed on the labelled proposal; the owner's answers go to [OPEN_QUESTIONS.md](../OPEN_QUESTIONS.md).

1. What is the central sea called? **Proposal, in use:** no name; "the central sea" (lore digest question 10).
2. Are "Crown Ocean", "Crown Forest", "Crown Mountains" and the "Sun" names right for the drawn labels? **Proposal, in use:** as above (lore digest questions 10 and 11).
3. Are Huhun and Hunhun the same place? **Proposal, in use:** yes, spelled Hunhun (owner short list 15).
4. Approve or replace the public labels "the Deliverer's Faithful" and "the Stranger's Host". **Proposal, in use:** these labels (lore digest question 16).

Settled and no longer open here: Šodolôro in game text (S11); Castle of Yeldenne (this spec, lore digest question 11); Temple Favour replaces the earlier draft label "Counsel of the Temples" (Aenor spec owns it).
