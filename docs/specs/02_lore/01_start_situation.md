# The start situation: Erdae on 1 Thaw 4A 1748

**Status:** Ready. Reviewed 19 October 2026 against CONVENTIONS "Status"; integrated 19 October 2026. **Priority:** 2. **Phase:** 2.

## Purpose

This spec describes the world on the first day of play, power by power and region by region. It says what every player can see, what is hidden and from whom, and what each great power believes and wants. Every generator, mechanic, focus tree and event that touches the start must agree with it.

It is a digest of the lore vault for implementers. It never replaces the vault. Where this file and the vault disagree, the vault wins and this file is corrected. Where a start value here differs from the mechanic that owns the variable, the owning mechanic wins ([INTEGRATION_DECISIONS.md](../INTEGRATION_DECISIONS.md) V1). The same holds for the start values and start forces of a mechanic's own realm (R3) and for start footholds (R4); the values below already follow the owners.

## Lore basis

### Sources

- Vault: *Canon Policy*, *Fourth Age Chronology*, *The Campaign of 4A 1748*, *The Fourth Age of Erdae*, *Fourth Age Canon Register*, *Great Powers and Relations*, *Kingdoms Factions and Conflicts*, *Afrits Hidden Council*, *The Lost Cause*, *Houses of the First Light*, the figure notes, *Erdae and Its Regions*, *Volgans Dead Lands*, *Zols Mistake*, *Open Questions*.
- Specs: [README](../README.md), [CONVENTIONS](../CONVENTIONS.md), [INTEGRATION_DECISIONS](../INTEGRATION_DECISIONS.md), [shared contract](../04_mechanics/00_shared_contract.md), [start and calendar](../00_foundation/01_start_and_calendar.md), [map accuracy](../01_map/01_map_accuracy.md), [key sites](../01_map/02_key_sites.md), [known issues](../01_map/03_known_issues.md), [tiers and coverage](../05_focus_trees/01_tiers_and_coverage.md), [flavour and world events](../06_events/05_flavour_and_world.md).
- Country roster: 305 countries (name, region, states, people, ideology, stance, overlord, role), from `docs/design/countries.csv` and the politics step.

### Labels used in this file

| Label | Meaning |
| --- | --- |
| **E** | Established in the vault (owner statement or unmodified canon). Fixed. |
| **W** | Working map-design table (*Great Powers and Relations*). Used by the map; not fixed narrative canon. |
| **P** | Proposed, by the vault's proposal notes or by this spec. A draft until the owner adopts it. |
| **O** | Open in the vault. Gameplay may offer outcomes; text must never state one as history. |

### Key facts

| Fact | Label |
| --- | --- |
| The Golden King reigns. Eindil has not appeared. Afrit is unrevealed. Erdae seems at peace; no great war at the start. | E (owner, 18 October 2026) |
| The start date 1 Thaw, 4A 1748; the Golden King in his nineteenth year since his coronation in 4A 1729 | P (vault chronology) |
| More than a thousand years of genuine peace and prosperity after Elzon's fall | E |
| "Seventeen centuries of peace" as the public phrase | P (*The Campaign of 4A 1748*; only "more than a thousand years" is established) |
| Afrit governs Aenor through priests, schools, relief houses, councillors and royal puppets; ordinary people revere him as a New God and do not know the name Afrit | E |
| Public name **Aurevan** for the Deliverer | P (owner short list 1; the work proceeds on Aurevan) |
| The Golden King is greedy, sells offices, rewards flatterers, founded the Lost Cause, and is effectively Afrit's puppet | E |
| Afrit holds the Necklace of the Abyss (stolen by a thief granted unending life) and other artifacts | E (necklace, thief); P (names of three lesser artifacts, thief's name Sevrin) |
| Volgan has recovered his strength and will retake Mirolon and march north | E |
| Zol cannot take a body; his power grows very slowly; his dead stir in the north | E |
| Horos guards Glo in the Castle of Yeldenne in the Cold Lands | E |
| Lorien reigns over the Gala elves | E |
| The North Lands will withdraw from the old alliance; the West will cross the sea; an eastern coalition will invade | E (as later events); P (dates, treaty name) |
| The Council's secret decision of 4A 1746 to remove the Golden King | P |

## Design

### The three rules of the start

1. **Nothing reveals Afrit.** No text a non-Worshipdom player can read names Afrit, calls the Deliverer a demon, or says the Deliverer rules Aenor. The Hidden Council is not named to anyone but the Worshipdom (shared contract, "The secret"). The world learns the name Afrit at his flight east, or earlier only when a player exposes the plot (D3).
2. **Nothing shows Eindil.** Eindil is not on any country's roster, in any portrait list, in any focus or decision text, or on the map. The global flag `zin_eindil_awake` is not set. When he appears, players read only "the Man from the Ice" until Lorien names him (D4).
3. **No great war.** No country is at war on 1 Thaw 4A 1748. No war goal is being justified. No story flag of the shared contract is set.

The start must also *feel* ordinary. Courts quarrel, prices rise, envoys take offence. The player should believe, for the first months, that this is a peaceful realm-management game.

### The shape of the world

Erdae has known peace for more than seventeen centuries (E for "more than a thousand years"; P for the exact count). Some 300 crowns, dominions, clans and island lordships divide the continent: the vault's working figure is about 280 polities (W); the map holds 305.

Beneath the peace, five pressures build. Each is hidden, dismissed or seen by only a few. No single power sees them all.

| # | Pressure | Truth (E unless marked) | Who sees it at the start | How the player meets it |
| --- | --- | --- | --- | --- |
| 1 | The rot at the centre | The Golden King is a fool; Aenor's real government is the Hidden Council of the god its people love | The Council only. Courtiers see corruption, not the Council. | Aenor's court corruption, sold offices, an over-friendly temple; the Worshipdom player sees everything |
| 2 | The dark in the south | Volgan has rebuilt his armies for a century and means to take Mirolon and march north | Mirolon's scouts and wardens. Northern courts think him a spent legend. | Mirolon's warnings; rumours in Aenor; low intel on the Dead Lands |
| 3 | The dead in the north | Zol's dead stir in the islands of the Ocean of Zol; ordinary weapons cannot end them | Island fishermen nobody believes | Flavour events on northern coasts; nothing military |
| 4 | Old grudges in the west and north | The West remembers Aenor's First Age conquests; the North Lands chafe under the Treaty of the Narrow Strait (P name) | Everyone, but as grudges over wine, not war plans | Negative opinion, trade quarrels, tariff events |
| 5 | Ambition in the east | The East Lands are rich, divided and full of the Council's clients, who know their patron only as the Deliverer's generous friends | The clients themselves, without knowing what they serve | Wealthy eastern courts, temple gifts, rivalries between Noris and Stabilo |

### Visible and hidden at the start

| Element | Visible to every player | Hidden from whom | Revealed by |
| --- | --- | --- | --- |
| Aenor, its Golden King, the Middle Kingdom Concord | Yes | — | — |
| The Golden Court and sold offices | Yes: a byword for vanity | — | — |
| The Lost Cause | Yes: a royal league "against the powers of the dark", an institution inside Aenor's mechanic, not a game faction (S3) | Its weakness is visible only to Aenor | — |
| Chancellor Merovan (P name) as royal chancellor | Yes | His Council seat (the Seat of Seals): everyone but the Worshipdom | `zin_afrit_revealed` |
| The Deliverer, public name Aurevan (P), as a beloved New God | Yes | — | — |
| The Worshipdom as a Light temple-state (stance Sanctuary, party "The Faithful of the Deliverer") of three valleys in the Zilin Hills, led by Aurevan the Deliverer (D1) | Yes | Its role as the Council's hub; its true Shadow allegiance | `zin_afrit_revealed` (it turns Shadow then) |
| The name Afrit, his demonic form, his brotherhood with Eindil | No | Everyone but the Worshipdom | `zin_afrit_revealed` (name and nature; historically at his flight east, 4A 1756, D3); Horos's words at Yeldenne (brotherhood, to Eindil only) |
| The Hidden Council and its four seats | No | Everyone but the Worshipdom | `zin_afrit_revealed` |
| The plot against the Golden King (decided 4A 1746, P) | No | Everyone but the Worshipdom | Aenor succession events, or never |
| The Necklace of the Abyss and the lesser artifacts | No | Everyone but the Worshipdom | Yeldenne events, then the reveal |
| Sevrin the immortal thief (P name) | No | Everyone; the Worshipdom meets him through its focus *A Guest of the Reliquary* | Afrit mechanic |
| Volgan and his Southern Dominion | Yes: on the map, an old dark realm behind storms | The size of his hosts: everyone but Volgan and, partly, Mirolon | Intelligence; `zin_volgan_marches` |
| Zol's Mistake | Yes: a black, nearly empty wasteland, led by an emblem, "The Will of Zol" (S4) | The stirring of the dead | Northern flavour; `zin_zol_rising` |
| Zol's servants | No | Everyone, including Zol's player (their identities are not established, O) | Never invented |
| Horos and the Castle of Yeldenne | Yes: a remote castle of legend | That Glo is Horos's own heart (E, kept as a late reveal in text) | `zin_horos_dead` |
| King Lorien and the Gala elves | Yes | — | — |
| Eindil | No | Everyone | `zin_eindil_awake` (as "the Man from the Ice"), `zin_eindil_named` (by name) |
| Varner and Golbran | Legend only: the wizard of the Unbinding and his servant | Where they are and that they will return | `zin_eindil_returned` |
| The King of Demons | Legend only: a king in the Nether | Everything (O) | Owner decision |

### What each great power believes and wants

Thirteen tier A powers, plus Dondor and Yeldenne for their story weight. "Believes" is what its court thinks is true. "Wants" is what it will pursue if left alone. These columns are the source for the opening events `zin_lore.1`–`.15` ([05_flavour_and_world.md](../06_events/05_flavour_and_world.md)).

| Power | Seat | Face at the start | Believes | Wants | Hidden truth |
| --- | --- | --- | --- | --- | --- |
| **Aenor** | Parim (W) | The richest and strongest kingdom, under a vain king | The peace is permanent; the Deliverer protects the crown; Volgan is a legend; the dominions grumble but will obey | The King wants glory, gold and a triumph for his Lost Cause. The court wants offices. The dominions want lower taxes. | The Council governs and has decided the King must die (P, 1746). Aenor is the god's principal seat. |
| **Worshipdom** | Zilin Hills (E) | A small pilgrim temple-state of the Deliverer, almost unarmed | (Its rulers know the truth.) The Golden King is a liability; the Lost Cause could become a rival centre of power. | To take Aenor's crown openly, gather the remaining artifacts, win Glo, and keep the eastern courts as a reserve | It is the hub of the Hidden Council's couriers, confessors and agents (E that Afrit has networks everywhere; P that the Worshipdom is the visible hub). |
| **Lerendor** | Sonargur (W) | United Leren crown, proud, master of a strong fleet | Aenor despises the North; the toll humiliation of 4A 1716 (P) proves it; the treaty serves Parim | To honour, break or bend the Treaty of the Narrow Strait (P name) into Leren supremacy over the strait | Nothing hidden from itself; it does not know how weak Aenor's centre is. |
| **Volgan** | Nafeher (W) | An ancient, quiet dark realm behind storms and heat | The kingdoms of men always divide; his time is coming | To retake Mirolon, march north, and possess Glo | His strength has returned (E). Demon, Dolon and Nezer are sworn to him (W). |
| **Zol** | Furviatlon (W) | A black, almost empty wasteland | (No court; no beliefs are written for it.) | To grow, very slowly; to extend his dead beyond the Mistake when conditions allow | Who administers the Mistake for Zol is unknown (O). Never invent it. |
| **Magical Forest** | not named (W) | The oldest and most peaceful elven realm, an elected council of houses (P) | Men break alliances; the Elven Refusal still stands; the Great Wall keeps the peace | To stay apart, keep the dragons safe, and keep the Wall a customs line, not a border of war | It does not know the Deliverer's nature. Varner lives somewhere in the Magical Lands (E that he is of the Magical Lands; P that he is present in 1748). |
| **Gala Elves** | not named (W) | An ancient court under King Lorien, far in the south-west | Human kings turn common victories into dominion; still, Erdae's fate matters | To keep its memory and its distance | Lorien remembers Dardan and the First Men (E). |
| **Coldor** | Fandanar (W) | The great crown of the frozen interior and the western ports | Isengard is the enemy; the Cold Lands are their own world | To bring Isengard to heel and keep the Northern Accord with Horidor | Eindil sleeps in the ice of the far north-west, beyond any court's knowledge (E that he wakes in the Cold Lands). |
| **Noris** | Furvior (W) | Eastern great power of camel riders, deserts and caravan roads | Stabilo is the rival that matters; Aenor is a distant market | To own the caravan roads and keep the Noris Treaty with Gondolin | Some eastern courts are the Council's clients (E direction). Which kings follow Afrit willingly is open (O). |
| **Stabilo** | Postondoroth (W) | Central eastern trade power | Noris is the rival that matters | To win the southern trade routes and keep the Stabilo Pact with Drak | As Noris. |
| **Gunwaith** | not named (W) | Northern crown of the West Lands, tired after fifty years of war with Girdon | The Truce of the Grey Ford (P) is fragile; Aenor once tried to rule the West and still taxes it through tariffs | Peace at home, lower tariffs, and the old claims of Parim buried for good | The West will cross the sea together within seven years (E outcome, P timing). |
| **Goldoroth** | Cocanoor (W) | Orc kingdom of the inner Dark Lands | The Dark Lands should be one kingdom: its kingdom | To subdue Dondor and the free holds | Volgan's agents court the Dark Lands holds (E that they court; not automatically his). |
| **Mirolon** | not named (W) | Human realm on the lakes and coasts of the northern Dead Lands, free again after Volgan's First Age conquest | Volgan is arming; nobody in the north will listen | To hold the northern passes and win allies | Its warnings are true (E that Volgan retakes Mirolon on the historical path). |
| **Dondor** | Notbuton (W) | Human kingdom of the northern Dark Lands, leader of the Dark Sea Accord | Goldoroth is the danger | To survive Goldoroth with Belonton's help | — |
| **Yeldenne** | Castle of Yeldenne, Mp'E (E) | A remote castle and its silent lord | (Horos guards Glo against every claimant.) | To keep Glo from the unworthy | Horos knows who Afrit is and why Ein denied him (E). |

### Region by region

Each entry gives the situation, the countries that matter, the live tensions and the hooks for play. Roster facts (people, ideology, overlord) come from the country roster.

#### Middle Lands and Aenor Isle

- **Aenor, the Middle Kingdom** (Parim) rules the heart of the Middle Lands and leads the **Middle Kingdom Concord** (W name) of its 26 chartered dominions (W). The map has the Middle Lands dominions and Asgard on Aenor Isle as subjects.
- The Golden King has reigned since 4A 1729 (P). He sold offices within a year of his crowning and completed the **Golden Court**, a palace district of gilded halls, in 4A 1733 (P names and dates). Seventeen centuries of institutions keep the kingdom running (E that strong institutions keep it running; P the count).
- **The Lost Cause**, founded 4A 1741 (P date), is the King's league against "the powers of the dark". Its court branch is ceremonial; its frontier companies, rangers and scholars are real (E direction). It is an institution inside Aenor's mechanic, not a game faction (S3), and it has no honorary foreign crown at the start: Parim laughed at Mirolon's envoy (O8).
- **The dominions** keep their own lords and laws under the **Charters of Parim** (P, 4A 3): Selen's rangers, Kilinti's ents, Hiloron's giants, the riders of Hunhun, Kingson behind the Great Wall, Herez on the southern marches, Konori on the eastern steppe, Noleksun on the south-east frontier, Asgard on Aenor Isle, and the rest (E names; P constitution).
- **Selen** is the dominion most likely to act on its own and the natural voice of the Free Dominions in a succession. Alleria of Selen is a ranger there (E).
- **Cursed Lands** and **Bloody Forest** reject the crown (E). They are hostile enclaves, not at war: raids and closed borders, nothing more.
- **The Great Wall of Aenor** runs from the Organ Mountains past Lunhrim and around Kingson, between the Middle Lands and the Magical Lands (E geography; P origin in Elzon's Pale March and the Wall Accord of 4A 96).
- **Tensions:** dominion taxes and loyalty; the Lost Cause's empty treasury; Golden Court office-sellers against honest officials; Selen's independence.
- **Hooks:** court corruption events, office sales, the Lost Cause's triumph, Selen's petitions, the Mirolonese warning remembered.

#### Magical Lands

- The elves of the Magical Lands were never conquered, not even by Elzon (E).
- **Magical Forest:** the oldest and most peaceful realm, democratic and very old (E roster role); ruled by an elected council of houses (P constitution).
- Around it lie smaller elven realms. **Herrodon** and **Andos Enda** are old rivals (W). **Nolorim** guards the high passes (E name; roster). **Lccimio** and **The End** are large elven realms (roster). Andos Enda is bound by the Elven Refusal and is not in the Leren Compact at the start (S5).
- Only the elven powers can command the dragons of **Dragon Mountain** (E). The dragons are not a country (E).
- **The Worshipdom** sits in the **Zilin Hills**: three valleys around a hermitage of the Deliverer, founded about 4A 1520 (P). It holds almost no army. Pilgrims, couriers and confessors pass through it to every court (P that it is the visible hub).
- **Tensions:** Herrodon against Andos Enda; customs disputes at the Wall; pilgrims crossing elven lands.
- **Hooks:** dragon sightings, the Wall's customs, elven memories of the Refusal, pilgrim caravans to Zilin.

#### North Lands

- **Lerendor**, the united crown of Lerendor and Lerenwaith since 4A 411 (P date), leads the **Leren Compact** (W) with Eekedor. Andos Enda is not a member at the start (S5); Lerendor can court it.
- The **Treaty of the Narrow Strait** (P name for the established "old alliance", P date 4A 512) binds the North Lands to defend Aenor in war.
- Lerendor's envoys were humiliated in Parim over a disputed toll in 4A 1716 (P). The Leren court has doubted the treaty since.
- **Molot** is a marcher state balancing Lerendor; **R'en** is the gateway between the Leren and Aenor seas; **Sensai**, **Mina** and twenty smaller crowns look to Lerendor or Parim as it suits them (roster).
- **Tensions:** strait tolls, fleet pride, Molot's independence.
- **Hooks:** toll quarrels, fleet reviews, a treaty debate at court.

#### Cold Lands

- **Coldor** rules the frozen interior and the western ports from Fandanar and leads the **Northern Accord** (W) with **Horidor**. **Isengard** is its fortified rival (W). Coldor's kings united the interior in 4A 850 and Isengard refused (P).
- The Cold Lands are the largest landmass and the least known (E). The **Yeti Lands**, the ice giants of **Titanos**, the maritime republic of **Windwaith**, **Fearno** and the free towns of the coast live by trade, herding and hunting.
- In **Mp'E**, the frozen north, Horos sits in the **Castle of Yeldenne** with Glo (E).
- Somewhere in the far north-west, in ice older than Aenor, Eindil still sleeps (E that he wakes in the Cold Lands). This is **not shown** at the start in any way; no legend or omen foreshadows a sleeper (F2 of the flavour spec).
- **Tensions:** Coldor against Isengard; ports against the interior.
- **Hooks:** hard winters, Isengard's border forts, legends of the silent castle.

#### West Lands

- Two dozen kingdoms crowd the West Lands. **Gunwaith** (northern crown) and **Girdon** (river republic) fought for half a century and signed the **Truce of the Grey Ford** in 4A 1745 (E rivalry; P truce and dates). The truce holds at the start.
- **Kradlon**, **Corogon**, **Varnondor**, **Lambin** and the **Buldor** companies trade with Aenor across the wide central sea and resent its tariffs (P).
- Every western court remembers that Aenor once tried to rule the West (E).
- **Tensions:** the truce; Aenoran tariffs; old claims.
- **Hooks:** tariff disputes, truce-day festivals, border lords testing the truce.

#### Triton's Islands

- **Adel**, **Pollos**, **Raerby**, **Nondondor**, **Halenor**, the **Seite Islands** and some thirty island lordships arc around the Pupor Ocean (E names). They live by fishing, piracy and charting. The islanders charted the Pupor Ocean in 4A 702 and sold the charts to every crown (P).
- **Tensions:** piracy, fishing rights, naval frontiers (Nondondor).
- **Hooks:** chart sales, pirate trials, storms.

#### Dark Lands

- **Goldoroth**, an orc kingdom united about 4A 1450 (P), wants the whole region (W). **Dondor**, a human kingdom, leads the **Dark Sea Accord** (W) with Belonton against it.
- **Bordon**, **Dreson**, **Dulundur**, the **Troll Forest**, **Blackton** and a dozen orc and goblin holds belong to nobody (E that they are independent).
- Volgan's agents court them all; most answer only to themselves (E).
- Goldoroth and Dondor are in an **armed peace**, not a war: border raids are flavour events, never a declared war at the start.
- **Hooks:** raids, a volcano's omens, Volgan's envoys refused or received.

#### Dead Lands

- **Volgan** rules from Nafeher (W). His **Southern Dominion** (W) includes **Demon**, **Dolon** and **Nezer** as sworn realms.
- In the far south lie the **Nether**, seat of the King of Demons, and the **Abyss**, where Roka once held the Necklace of the Abyss (E). On the map the Nether is Volgan's realm, with the King's court as a pact (owner short list 5, proposal).
- **Mirolon**, the human realm Volgan conquered in the First Age, is free again and stands in his way (E rivalry). It fortified its northern passes about 4A 1650 (P). In 4A 1736 its envoy warned Parim that the Dead Lands were arming; the court laughed (P).
- **Nan**, **Olen** and the small human freeholds of the north coast are independent (roster).
- The Dead Lands are hot, storm-girt and hard to reach by sea (E).
- **Tensions:** Mirolon against Volgan, in silence; Mirolon's lonely warnings.
- **Hooks:** scouts' reports, storms that wreck curious ships, demon-bargains refused.

#### Zol's Mistake

- The whole black north and every black island of the Ocean of Zol belong to **Zol**, the Old God of Death (E). The land is almost empty of the living (E). Its seat is **Furviatlon** (W). Šodolôrō lies within it (E; game text writes Šodolôro, S11).
- The realm's leader is an emblem, "The Will of Zol", which says nothing about who administers the Mistake (S4). Who administers it for Zol is unknown and is **not invented** (O).
- Zol cannot take a body; his servants sustain his presence; his power grows very slowly (E).
- Island fishermen told of black ships among the islands in 4A 1744 (P). Nobody at court believed them.
- **Hooks:** fishermen's tales, a drowned village, ships that do not return. Nothing military.

#### East Lands and South Lands

- The East Lands are the richest and most divided region (P). **Noris** with **Gondolin** (Noris Treaty, W) and **Stabilo** with **Drak** (Stabilo Pact, W) compete for the caravan roads, which opened in 4A 600 to 780 (P).
- **Alerhia**, **Miaed**, **Erco**, **Plutondo** and **Ostoroth** are great kingdoms in their own right (map). **Mora** is a lake republic; **Avalon** a republic of the Red Lands (roster).
- The Council's eastern branch has courted these courts for four centuries (E direction; P "four centuries"). Its clients know only the Deliverer's generous friends: temples, relief houses, loans and gifts.
- Which eastern kings will follow Afrit willingly is **open** (O). Foothold values differ by country (the Afrit spec's start table); no text may say who will follow him.
- The **South Lands** are the great desert of the East Lands (on the map, the Noris desert and the former Sunhot desert), which stretches south off the map (E; owner short list 6, proposal).
- **Hooks:** caravan wars of prices, temple gifts, Noris–Stabilo border incidents.

#### Islands of the South

- **Howan**, **Nara**, **Verde**, **Enhis Is Rond** and some fifteen more island realms are small, poor and hospitable (P characterisation).
- One shrine repeats Aen's name without understanding it (P). A reef is feared for drowned voices (P).
- **Hooks:** island feasts, sea legends, shipwrecks. Nothing about a stranger: he has not come.

#### Lands of the Sun

- The **Sunhot elves**, over three metres tall and among the strongest and most peaceful peoples of Erdae (E), live in many small realms. **The Lands of Light** is the largest (roster; P that it leads).
- The **Gala Elves** keep their ancient court under **King Lorien**, who fought at Dardan (E).
- The relationship between the Gala elves and the Sunhot elves is **open** (O). The vault carries a proposal (*The Campaign of 4A 1748*); game text must stay neutral and never state it.
- The roster also has separate countries named **Gala** and **North Gala** (tier C). Their link to the Gala Elves is not established; text must not imply one.
- **Hooks:** sun festivals, Lorien's audiences, pilgrims to the Sea of Gods.

### Relations at the start

All relations below are peaceful. Opinion values are design targets. Each modifier is a permanent opinion modifier (no decay) applied once on startup; a mechanic may remove it later.

| Key (`zin_opinion_<key>`) | From | To | Name | Value | Label |
| --- | --- | --- | --- | ---: | --- |
| `toll_of_1716` | Lerendor | Aenor | The Toll of 1716 | −20 | P |
| `northern_pride` | Aenor | Lerendor | Northern Pride | −10 | P |
| `old_claims` | Every West Lands country | Aenor | Old Claims Remembered | −15 | E grievance, P value |
| `grey_ford_truce` | Gunwaith | Girdon, and back | Truce of the Grey Ford | −10 | P |
| `caravan_rivalry` | Noris | Stabilo, and back | Caravan Rivalry | −25 | W rivalry, P value (N5) |
| `cold_rivalry` | Coldor | Isengard, and back | Cold Rivalry | −30 | W |
| `border_raids` | Goldoroth | Dondor, and back | Border Raids | −40 | W |
| `old_rivalry` | Herrodon | Andos Enda, and back | Old Rivalry | −20 | W |
| `watchers_of_the_passes` | Mirolon | Volgan | Watchers of the Passes | −50 | E rivalry, P value |
| `old_estrangement` | Magical Forest, Gala Elves, every elven realm | Aenor | Old Estrangement (the memory of Edran's folly and the Refusal) | −10 | E history, P value (N6) |
| `concord_charters` | Every Concord dominion | Aenor | Concord Charters | +20 | P |
| `pilgrim_road` | Every country except Volgan, Demon, Dolon, Nezer and Zol | Worshipdom | Pilgrim Road | +10 | P |

The Truce of the Grey Ford is also an engine truce between Gunwaith and Girdon for 730 days, to 1 Thaw 4A 1750. The diplomacy spec adds the Wall Accord at the start (non-aggression pacts and `zin_opinion_wall_accord` +15 between Aenor and the elven realms on the Wall; [03_diplomacy_and_factions.md](../03_gameplay/03_diplomacy_and_factions.md)).

Factions at the start, as the politics step already writes them: Middle Kingdom Concord, Southern Dominion, Leren Compact, Northern Accord, Noris Treaty, Stabilo Pact, Dark Sea Accord (W). Overlord links follow the roster.

### The first year

4A 1748 is the peaceful year (P). Nothing visible happens beyond the ordinary quarrels of courts. Flavour events ([04_fourth_age_history_for_play.md](04_fourth_age_history_for_play.md), [05_flavour_and_world.md](../06_events/05_flavour_and_world.md)) fill it. The first story event on the historical path is Eindil's waking, early in 4A 1749 (P date: 1 Ironfrost 4A 1749 in the Eindil's journey spec). The Golden King dies in Mistfall 4A 1750 and Eindil is crowned in 4A 1760 on the historical path (P dates, *Fourth Age Chronology*).

## Implementation

### What is in the game today (commit `ca01fa3`)

The game still opens on `1936.1.1.12`; the calendar spec ([01_start_and_calendar.md](../00_foundation/01_start_and_calendar.md)) moves it to `1748.3.1.12` and owns that change. Only the 305 ZIN tags and the dynamic tags D01–D75 exist. Every country runs the interim "Long Peace" tree. The Worshipdom already shows as Light (`zin_light_sanctuary`), led by "Aurevan the Deliverer", with a description that keeps the secret (D1, D2 fixed). Aenor starts with 0% Shadow (D5, fixed). No start opinion, truce or start spirit of this spec is applied yet. `common/opinion_modifiers/00_zin_opinion_modifiers.txt` (vanilla removal module) defines three of the keys below (`zin_opinion_caravan_rivalry`, `zin_opinion_old_estrangement`, `zin_opinion_cold_rivalry`) without applying them.

### Builder module and data

All files below are written by a new content-builder module, `tools/content/modules/start_situation.mjs`, called from `tools/content/build.mjs` after `characters` and before `vanilla_removal` (so check C3 sees its definitions), and applied in the same atomic transaction as the rest of the build.

| Path | Kind | What |
| --- | --- | --- |
| `tools/content/data/start_situation.json` (new) | builder data | One source for the relations table (key, from, to as country names or roster groups, value, text), the truce, the start spirits and the AI peace window. Country names resolve to tags through `tools/content/data/countries.json`; roster groups (region, people, overlord) resolve through `docs/design/countries.csv`. |
| `common/opinion_modifiers/zin_start.txt` | generated | The twelve `zin_opinion_<key>` modifiers of the relations table. The module takes over the three start keys from `vanilla_removal.mjs`, which stops writing them, so each key is defined once. |
| `common/ideas/zin_start.txt` | generated | The start national spirits below |
| `common/scripted_triggers/zin_lore.txt` | generated | `zin_afrit_secret_kept`, `zin_eindil_known_by_name` |
| `common/on_actions/zin_start_situation.txt` | generated | `on_startup`: the opinion modifiers (`add_opinion_modifier`), the truce (`set_truce = { target = <Girdon> days = 730 }` from Gunwaith) and the start spirits (`add_ideas`), for every country by resolved tag |
| `common/ai_strategy/zin_start_peace.txt` | generated | The start peace strategy (AI section) |
| `localisation/english/zin_start_l_english.yml` | generated | Opinion and spirit names and descriptions |

Country histories (`history/countries/*.txt`) come from the politics step and are not changed by this spec: the start relations live in the startup effect, not in history.

The opening events `zin_lore.1`–`.15` and the debug check `zin_lore.20` are written by `tools/content/modules/events_zin_lore.mjs` (new; it writes the whole `zin_lore` namespace, `events/zin_lore.txt`, for this spec, [04_fourth_age_history_for_play.md](04_fourth_age_history_for_play.md) and [05_flavour_and_world.md](../06_events/05_flavour_and_world.md)). Their text is the flavour spec's; this spec owns when they fire.

### Start values of shared variables

Each owning mechanic sets its own variable on startup. This table is the lore target, already equal to the owners' values (V1).

| Variable | Scope | Start value | Owner | Reason |
| --- | --- | ---: | --- | --- |
| `zin_gathering_dark` | global | 10 | [world tension](../03_gameplay/05_world_tension_and_endings.md) | The world seems at peace; the pressures are real but hidden |
| `zin_council_influence` | Aenor | 65 | [Aenor](../04_mechanics/aenor_court_and_succession.md) | The Council governs; the King is a puppet |
| `zin_court_corruption` | Aenor | 70 | Aenor (V1) | Nineteen years of sold offices |
| `zin_concord_loyalty` | each dominion | As the Aenor spec's dominion table (for example Selen 45, Noleksun 40, Herez 50, Hunhun 55, Kilinti 60, Kingson 65) | Aenor | Taxes grumbled at; Selen acts on its own |
| `zin_aenor_lost_cause` | Aenor | 20 | Aenor | Mostly ornament; real frontier companies |
| `zin_footholds` | every country | As the Afrit spec's start table (R4; first matching row wins): Aenor 5; Middle Kingdom Concord dominions of men 2 (Selen 1; dominions of other peoples 1); Fotan 1; Cursed Lands and Bloody Forest 0; the six Dead Lands freeholds 1; every Cold Lands country except Yeldenne 1; Alerhia, Erco, Plutondo, Miaed, Noris, Stabilo 3; other East Lands courts 2; Lerendor and Dondor 2; other countries of men 1; elven realms 1; orc, goblin and troll holds 0; Volgan, his sworn realms, Zol and Yeldenne 0 | [Afrit](../04_mechanics/afrit_hidden_council.md) | Networks everywhere; strongest in Aenor (E); agents even in the Lands of the Sun (E). The values never say which kings will follow him. |
| `zin_afrit_artifacts` | global | 4 | Afrit | The Necklace and three lesser artifacts gathered 4A 1611 to 1700 (P) |
| `zin_eindil_stage` | global | 0 | [Eindil's journey](../04_mechanics/eindil_journey.md) | He has not woken |
| `zin_dominion_strength` | Volgan | 45 | [Volgan](../04_mechanics/volgan_southern_dominion.md) (V1) | A century of rebuilding; not yet ready (march historically 4A 1755) |
| `zin_mistake_power` | Zol | 35 | [Zol's Mistake](../04_mechanics/zols_mistake.md) (V1) | Grows very slowly every day (E) |
| `zin_strait_standing` | Lerendor | −15 | [Lerendor](../04_mechanics/lerendor_narrow_strait.md) | Resentment since 4A 1716 (P) |

**Start forces** (R3). A mechanic's own realm starts with the forces that mechanic sets. Zol starts with **no divisions** ([Zol's Mistake](../04_mechanics/zols_mistake.md), [warfare](../03_gameplay/01_warfare.md)); Yeldenne starts with none (the politics step stops writing its one division); Volgan's and Mirolon's start forces and values are set by the Volgan mechanic's `zin_dominion.1` and nowhere else.

### Story flags at the start

None of the shared contract's global flags is set. A builder test asserts that no generated file sets one in history or on startup. In particular `zin_eindil_awake`, `zin_golden_king_dead`, `zin_aurevan_crowned`, `zin_afrit_revealed` and `zin_war_of_last_crowns` must be unset.

### Characters at the start

Full list in [02_characters.md](02_characters.md).

- Recruited: every tier A and named tier B ruler, their named councillors and generals, Alleria of Selen, Horos, King Lorien, Volgan, Mirolon's High Warden Maeric (made leader by the Volgan mechanic's startup), and the Deliverer as the Worshipdom's leader (`zin_aurevan`, public name only). Ilvane, Corvel, Kessarion and Ossar are hireable advisors of the Worshipdom only (N13).
- Defined but recruited by nobody: `zin_eindil`, `zin_varner`, `zin_golbran`, and `zin_sevrin` (he joins the Worshipdom later through the Afrit spec's focus).
- Zol's leader is the emblem "The Will of Zol" (`zin_zol_will`, O6); Zol has no character portrait or body (E, shared contract, S4).

### Opinion modifiers

`common/opinion_modifiers/zin_start.txt`, ids `zin_opinion_<key>` with the keys and values of the relations table, `decay` absent (permanent). Applied with `add_opinion_modifier = { target = <tag> modifier = zin_opinion_<key> }` in the startup effect. "And back" rows are applied in both directions.

### Start national spirits (proposed)

Every modifier below exists in the 1.19.3 modifier documentation (checked 19 October 2026). The owning mechanic spec may replace a spirit; until then these are the targets. Each spirit is an idea in category `country` with `allowed = { always = no }` and `removal_cost = -1`.

| Id | Who | Modifiers | Removed when |
| --- | --- | --- | --- |
| `zin_world_long_peace` | Every country except Volgan, Demon, Dolon, Nezer, Zol and the Worshipdom | `war_support_factor = -0.10`, `justify_war_goal_time = 0.5`, `army_org_factor = -0.05` | `on_war` for that country, or `zin_war_of_last_crowns` is set (world tick removes it everywhere) |
| `zin_elves_the_old_refusal` | Magical Forest, Gala Elves and every elven realm | `justify_war_goal_time = 1.0`, `drift_defence_factor = 0.20` | Elven mechanic events, or `zin_refusal_lifted` on that realm |
| `zin_west_old_claims` | Every West Lands country | `opinion_gain_monthly_factor = -0.10` (distrust) | Removed by the Western Crossing mechanic, which owns the rule: the war-king's peace removes it from every confederation member, and joining Eindil's coalition (`zin_west_join_coalition_effects`) removes it from the joiner. `zin_western_crossing` does not remove it ([western_crossing.md](../04_mechanics/western_crossing.md)) |
| `zin_aenor_seventeen_centuries` | Aenor | `stability_factor = 0.10`, `production_speed_buildings_factor = 0.10` (the institutions that keep a bad king's kingdom running) | Aenor mechanic events (succession war) |

Mirolon's start spirits are the Volgan mechanic's (R3): the earlier draft's `zin_mirolon_watchers_of_the_passes` is dropped; the opinion `zin_opinion_watchers_of_the_passes` stays.

**Start spirits owned elsewhere.** Some start spirits belong to a mechanic or a tree. This module applies only the ones marked "this module"; the table lets a reader see the whole first day.

| Spirit | Who | Added by |
| --- | --- | --- |
| `zin_volgan_long_recovery`, `zin_volgan_storm_girt_realm` | Volgan | Volgan mechanic, `zin_dominion.1` |
| `zin_mirolon_long_watch`, `zin_mirolon_unheeded_warnings` | Mirolon | Volgan mechanic, `zin_dominion.1` |
| `zin_coldor_ports_against_interior` | Coldor | Cold Lands mechanic, `zin_cold.1` |
| `zin_goldoroth_quarrelsome_clans` | Goldoroth | Dark Lands mechanic, `zin_dark.1` |
| `zin_gunwaith_weary_clans` | Gunwaith | Western Crossing mechanic, `zin_west.1` |
| The six Cold Lands tree spirits `zin_regional_<tree>_<key>` (F4): Isengard `refusal_of_850`, Horidor `chiefs_of_the_cairns`, Windwaith `sails_council`, Fearno `proud_fearno`, Titanos `the_frost_kings_court`, the Yeti Lands `eldests_fire` | those countries | this module, from rows in `start_situation.json` ([regional Cold Lands](../05_focus_trees/regional/cold_lands.md)) |
| The six Triton's Islands tree spirits `zin_regional_adel_chart_hall_pride`, `zin_regional_pollos_the_market_isle`, `zin_regional_raerby_broker_captains`, `zin_regional_nondondor_the_contested_banks`, `zin_regional_halenor_wreck_right`, `zin_regional_seite_islands_isle_moot_custom` | those countries | this module ([regional Triton's Islands](../05_focus_trees/regional/tritons_islands.md)) |
| The six West Lands tree spirits `zin_regional_girdon_long_feuds_toll`, `zin_regional_lambin_downs_granaries`, `zin_regional_buldor_company_books`, `zin_regional_kradlon_aenoran_duties`, `zin_regional_corogon_tariff_squeeze`, `zin_regional_varnondor_approach_watchers` | those countries | this module ([regional West Lands](../05_focus_trees/regional/west_lands.md)) |

The tree spirits are defined in their trees' idea files by the focus compiler; this module only adds them on startup (`add_ideas`), so each id is defined once. The 18 rows sit in `start_situation.json` beside this spec's own spirits. Tree specs that name `docs/design/start_situation.json` mean `tools/content/data/start_situation.json`.

### Scripted triggers

| Trigger | True when |
| --- | --- |
| `zin_afrit_secret_kept` | `NOT = { has_global_flag = zin_afrit_revealed }` |
| `zin_eindil_known_by_name` | `has_global_flag = zin_eindil_named` |

Every text that differs before and after a reveal chooses with these triggers, so the rule lives in one place.

### Events (namespace `zin_lore`)

| Id | Purpose | Fires |
| --- | --- | --- |
| `zin_lore.1` to `zin_lore.15` | Opening event for each tier A power and for Dondor and Yeldenne: the country's situation, beliefs and wants as above, nothing hidden from that country. Text in [05_flavour_and_world.md](../06_events/05_flavour_and_world.md). | Day 1, from the hidden startup event `zin_lore.100`, human players only (`is_ai = no`), for the matching country |
| `zin_lore.20` | Hidden check: writes a `log` line ("ZIN start: …") and sets the global flag `zin_start_check_failed` if any contract story flag is set or any war exists on the first day | `on_startup`, when the game rule `zin_rule_debug_checks` is on |

The Worshipdom's opening event (`zin_lore.2`) is the only text at the start that may say Afrit; it is shown only to the Worshipdom.

`zin_rule_debug_checks` (options `OFF` default, `ON`) is defined in the foundation's rules file `common/game_rules/zin_game_rules.txt` ([05_defines_and_rules.md](../00_foundation/05_defines_and_rules.md)); the Linux acceptance runs set it on.

### Defects in the current mod

| Where | Today | Required | State |
| --- | --- | --- | --- |
| Worshipdom ruler (`localisation/english/zin_rulers_l_english.yml`) | "Aurevan the Deliverer" | The Worshipdom's leader becomes `zin_aurevan`, shown through `[zin_loc_deliverer]` ([02_characters.md](02_characters.md)) | name fixed (D1); character id changes in phase 2 |
| Worshipdom description (the bookmark's `ZIN_FOURTH_AGE_DESC_worshipdom`, [frontend](../07_interface/03_main_menu_and_frontend.md)) | Safe temple-state text | Keep; it never names Afrit or the Hidden Council (D1) | fixed (D2) |
| Worshipdom stance | `zin_light_sanctuary` | Light, Sanctuary until `zin_afrit_revealed` (D1) | fixed |
| Yeldenne description (the bookmark's `ZIN_FOURTH_AGE_DESC_yeldenne`, frontend) | "guards Glo, his own heart" | "guards Glo, a crystal of old and holy power" until `zin_horos_dead` (the frontend's text) | open: frontend builder, phase 2 |
| Role texts (`docs/design/country_roles.csv`, [countries and states](../00_foundation/04_countries_and_states.md)) | Treated as design data that may name Afrit | Never name Afrit or the Hidden Council (D1–D3): the bookmark's listed countries show their role texts as `ZIN_FOURTH_AGE_DESC_<key>`, so the secret scan (acceptance 3) covers every role text | rule |

### Bookmark

The bookmark "The Fourth Age" ([start and calendar](../00_foundation/01_start_and_calendar.md)) describes the start in two sentences, for example: "For seventeen centuries Erdae has known peace. In Parim the Golden King counts his gold, and the temples of the Deliverer are full." It names no hidden danger.

## AI

- No AI country declares war, justifies a war goal or sends volunteers before 1 Thaw 4A 1749, except where a mechanic event explicitly allows it. `common/ai_strategy/zin_start_peace.txt` holds `zin_start_peace`: `enable` while the date is before `1749.3.1` and no contract story flag is set, `abort_when_not_enabled = yes`, with `ai_strategy = { type = avoid_starting_wars value = 400 }` and `ai_strategy = { type = send_volunteers_desire value = -100 }`. Story wars declared by owners' events are not blocked by it (they use `declare_war_on`).
- AI opinion follows the relations table; AI does not improve relations with Volgan or Zol.
- Mirolon's AI fortifies its northern border from the start; it does not attack.
- The Worshipdom's AI does nothing visible beyond its mechanic's hidden actions.

## Acceptance

1. On 1 Thaw 4A 1748, `has_war` is false for every country (Linux start run, all 305 countries checked through `zin_lore.20` with `zin_rule_debug_checks = ON`).
2. No shared-contract story flag is set at the start (builder test on the staged files, and `zin_lore.20` does not set `zin_start_check_failed`).
3. No text reachable before `zin_afrit_revealed` by a country other than the Worshipdom contains "Afrit", "demon" applied to the Deliverer, or "Hidden Council" (secret scan of [03_names_and_terms.md](03_names_and_terms.md) over all localisation, including rulers, country descriptions, ideas, ideologies, events and bookmarks).
4. The strings "Eindil" and "Einendil" appear in no text reachable before `zin_eindil_awake`, and `zin_eindil` is recruited by no country at the start.
5. Each shared variable has the start value in the table above (Linux run, console `list_vars` on day 1 for Aenor, Volgan, Zol, Lerendor and global scope).
6. On day 2 every relation of the table is present with its value, and Gunwaith and Girdon have a truce to 1 Thaw 4A 1750 (Linux run, console check of five sample pairs; builder test that every pair in the data resolves to two existing tags).
7. A human player of each of the fifteen countries receives its opening event on day 1; the Worshipdom's is the only one naming Afrit.
8. 60 days run without any AI war declaration (Linux run).
9. Every modifier, trigger and effect named in this spec exists in the 1.19.3 documentation (builder check through `assertModifiers`).
10. On day 1 the 18 tree start spirits of the table above are present on their countries and defined once (builder test: each id appears in exactly one ideas file; Linux run, console check of Isengard, Adel and Girdon); no country has `zin_lost_cause_member`; Zol and Yeldenne own no division; footholds match the Afrit spec's table, Fotan and the six Dead Lands freeholds at 1 (Linux run, `list_vars` on four sample countries).

## Open questions

All proceed on the labelled proposal; the owner's answers go to [OPEN_QUESTIONS.md](../OPEN_QUESTIONS.md).

1. May start-year flavour foreshadow a sleeper in the north-west ice (a legend, not a sighting)? **Proposal, in use:** no (lore digest question 5).
2. Does the Golden King have a living heir or close kin? **Proposal, in use:** no name shown, childless (owner short list 2; [02_characters.md](02_characters.md)).
3. Is "seventeen centuries" of peace the intended public phrase? **Proposal, in use:** yes, as in *The Campaign of 4A 1748* (lore digest question 8).

Settled by decisions and no longer open here: Andos Enda stays out of the Leren Compact (S5); the Worshipdom shows Light Sanctuary until the reveal (D1); the Lost Cause is an institution, not a faction (S3), with no honorary crown at the start (O8); start footholds follow the Afrit spec (R4); a mechanic's own realm keeps its own start values and forces (R3).
