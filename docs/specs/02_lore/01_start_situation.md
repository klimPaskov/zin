# The start situation: Erdae on 1 Thaw 4A 1748

**Status:** Draft. **Priority:** 2. **Phase:** 2.

## Purpose

This spec describes the world on the first day of play, power by power and region by region. It says what every player can see, what is hidden and from whom, and what each great power believes and wants. Every generator, mechanic, focus tree and event that touches the start must agree with it.

It is a digest of the lore vault for implementers. It never replaces the vault. Where this file and the vault disagree, the vault wins and this file is corrected.

## Lore basis

### Sources

- Vault: *Canon Policy*, *Fourth Age Chronology*, *The Campaign of 4A 1748*, *The Fourth Age of Erdae*, *Fourth Age Canon Register*, *Great Powers and Relations*, *Kingdoms Factions and Conflicts*, *Afrits Hidden Council*, *The Lost Cause*, *Houses of the First Light*, the figure notes, *Erdae and Its Regions*, *Volgans Dead Lands*, *Zols Mistake*, *Open Questions*.
- Specs: [README](../README.md), [CONVENTIONS](../CONVENTIONS.md), [shared contract](../04_mechanics/00_shared_contract.md), [start and calendar](../00_foundation/01_start_and_calendar.md), [map accuracy](../01_map/01_map_accuracy.md), [key sites](../01_map/02_key_sites.md), [tiers and coverage](../05_focus_trees/01_tiers_and_coverage.md).
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
| Afrit governs Aenor through priests, schools, relief houses, councillors and royal puppets; ordinary people revere him as a New God and do not know the name Afrit | E |
| Public name **Aurevan** for the Deliverer | P |
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

1. **Nothing reveals Afrit.** No text a non-Worshipdom player can read names Afrit, calls the Deliverer a demon, or says the Deliverer rules Aenor. The Hidden Council is not named to anyone but the Worshipdom. (Shared contract, "The secret".)
2. **Nothing shows Eindil.** Eindil is not on any country's roster, in any portrait list, in any focus or decision text, or on the map. The global flag `zin_eindil_awake` is not set.
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
| The Lost Cause | Yes: a royal league "against the powers of the dark" | Its weakness is visible only to Aenor | — |
| Chancellor Merovan (P name) as royal chancellor | Yes | His Council seat: everyone but the Worshipdom | `zin_afrit_revealed` |
| The Deliverer, public name Aurevan (P), as a beloved New God | Yes | — | — |
| The name Afrit, his demonic form, his brotherhood with Eindil | No | Everyone but the Worshipdom | `zin_afrit_revealed` (name and nature); Horos's words at Yeldenne (brotherhood, to Eindil only) |
| The Hidden Council and its four seats | No | Everyone but the Worshipdom | `zin_afrit_revealed` |
| The plot against the Golden King (decided 4A 1746, P) | No | Everyone but the Worshipdom | Aenor succession events, or never |
| The Worshipdom as a temple-state of three valleys in the Zilin Hills | Yes | Its role as the Council's hub | `zin_afrit_revealed` |
| The Necklace of the Abyss and the lesser artifacts | No | Everyone but the Worshipdom | Yeldenne events, then the reveal |
| Sevrin the immortal thief (P name) | No | Everyone but the Worshipdom | Afrit mechanic events |
| Volgan and his Southern Dominion | Yes: on the map, an old dark realm behind storms | The size of his hosts: everyone but Volgan and, partly, Mirolon | Intelligence; `zin_volgan_marches` |
| Zol's Mistake | Yes: a black, nearly empty wasteland | The stirring of the dead | Northern flavour; `zin_zol_rising` |
| Zol's servants | No | Everyone, including Zol's player (their identities are not established, O) | Never invented |
| Horos and the Castle of Yeldenne | Yes: a remote castle of legend | That Glo is Horos's own heart (P: kept as a late reveal) | Yeldenne events |
| King Lorien and the Gala elves | Yes | — | — |
| Eindil | No | Everyone | `zin_eindil_awake` (as an unnamed stranger), `zin_eindil_named` (by name) |
| Varner and Golbran | Legend only: the wizard of the Unbinding and his servant | Where they are and that they will return | `zin_eindil_returned` |
| The King of Demons | Legend only: a king in the Nether | Everything (O) | Owner decision |

### What each great power believes and wants

Thirteen tier A powers, plus Dondor and Yeldenne for their story weight. "Believes" is what its court thinks is true. "Wants" is what it will pursue if left alone.

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
| **Mirolon** | not named (W) | Human republic on the lakes and coasts of the northern Dead Lands, free again after Volgan's First Age conquest | Volgan is arming; nobody in the north will listen | To hold the northern passes and win allies | Its warnings are true (E that Volgan retakes Mirolon on the historical path). |
| **Dondor** | Notbuton (W) | Human kingdom of the northern Dark Lands, leader of the Dark Sea Accord | Goldoroth is the danger | To survive Goldoroth with Belonton's help | — |
| **Yeldenne** | Castle of Yeldenne, Mp'E (E) | A remote castle and its silent lord | (Horos guards Glo against every claimant.) | To keep Glo from the unworthy | Horos knows who Afrit is and why Ein denied him (E). |

### Region by region

Each entry gives the situation, the countries that matter, the live tensions and the hooks for play. Roster facts (people, ideology, overlord) come from the country roster.

#### Middle Lands and Aenor Isle

- **Aenor, the Middle Kingdom** (Parim) rules the heart of the Middle Lands and leads the **Middle Kingdom Concord** (W name) of its satellites. The working table gives 26 satellites (W); the map has the Middle Lands dominions and Asgard on Aenor Isle as satellites.
- The Golden King has reigned since 4A 1729 (P). He sold offices within a year of his crowning and completed the **Golden Court**, a palace district of gilded halls, in 4A 1733 (P names and dates). Seventeen centuries of institutions keep the kingdom running (E).
- **The Lost Cause**, founded 4A 1741 (P date), is the King's league against "the powers of the dark". Its court branch is ceremonial; its frontier companies, rangers and scholars are real (E direction).
- **The dominions** keep their own lords and laws under the **Charters of Parim** (P, 4A 3): Selen's rangers, Kilinti's ents, Hiloron's giants, the riders of Hunhun, Kingson behind the Great Wall, Herez on the southern marches, Konori on the eastern steppe, Noleksun on the south-east frontier, Asgard on Aenor Isle, and the rest (E names; P constitution).
- **Selen** is the dominion most likely to act on its own. The roster calls it the principal counterweight to Aenor. Alleria of Selen is a ranger there (E).
- **Cursed Lands** and **Bloody Forest** reject the crown (E). They are hostile enclaves, not at war: raids and closed borders, nothing more.
- **The Great Wall of Aenor** runs from the Organ Mountains past Lunhrim and around Kingson, between the Middle Lands and the Magical Lands (E geography; P origin in Elzon's Pale March and the Wall Accord of 4A 96).
- **Tensions:** dominion taxes and loyalty; the Lost Cause's empty treasury; Golden Court office-sellers against honest officials; Selen's independence.
- **Hooks:** court corruption events, office sales, the Lost Cause's triumph, Selen's petitions, the Mirolonese warning remembered.

#### Magical Lands

- The elves of the Magical Lands were never conquered, not even by Elzon (E).
- **Magical Forest:** the oldest and most peaceful realm, democratic and very old (E roster role); ruled by an elected council of houses (P constitution).
- Around it lie smaller elven realms. **Herrodon** and **Andos Enda** are old rivals (W). **Nolorim** guards the southern frontier (roster). **Lccimio** and **The End** are large elven realms (roster).
- Only the elven powers can command the dragons of **Dragon Mountain** (E). The dragons are not a country (E).
- **The Worshipdom** sits in the **Zilin Hills**: three valleys around a hermitage of the Deliverer, founded about 4A 1520 (P). It holds almost no army. Pilgrims, couriers and confessors pass through it to every court (P that it is the visible hub).
- **Tensions:** Herrodon against Andos Enda; customs disputes at the Wall; pilgrims crossing elven lands.
- **Hooks:** dragon sightings, the Wall's customs, elven memories of the Refusal, pilgrim caravans to Zilin.

#### North Lands

- **Lerendor**, the united crown of Lerendor and Lerenwaith since 4A 411 (P date), leads the **Leren Compact** (W) with Eekedor. (The working table also lists Andos Enda; see open questions.)
- The **Treaty of the Narrow Strait** (P name for the established "old alliance", P date 4A 512) binds the North Lands to defend Aenor in war.
- Lerendor's envoys were humiliated in Parim over a disputed toll in 4A 1716 (P). The Leren court has doubted the treaty since.
- **Molot** is a marcher state balancing Lerendor; **R'en** is the gateway between the Leren and Aenor seas; **Sensai**, **Mina** and twenty smaller crowns look to Lerendor or Parim as it suits them (roster).
- **Tensions:** strait tolls, fleet pride, Molot's independence.
- **Hooks:** toll quarrels, fleet reviews, a treaty debate at court.

#### Cold Lands

- **Coldor** rules the frozen interior and the western ports from Fandanar and leads the **Northern Accord** (W) with **Horidor**. **Isengard** is its fortified rival (W). Coldor's kings united the interior in 4A 850 and Isengard refused (P).
- The Cold Lands are the largest landmass and the least known (E). The **Yeti Lands**, the ice giants of **Titanos**, the maritime republic of **Windwaith**, **Fearno** and the free towns of the coast live by trade, herding and hunting.
- In **Mp'E**, the frozen north, Horos sits in the **Castle of Yeldenne** with Glo (E).
- Somewhere in the far north-west, in ice older than Aenor, Eindil still sleeps (E that he wakes in the Cold Lands). This is **not shown** at the start in any way.
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

- **Volgan** rules from Nafeher (W). His **Southern Dominion** (W) includes **Demon**, **Dolon** and **Nezer** as satellites.
- In the far south lie the **Nether**, seat of the King of Demons, and the **Abyss**, where Roka once held the Necklace of the Abyss (E). Who owns the Nether on the map is an open map question.
- **Mirolon**, the human realm Volgan conquered in the First Age, is free again and stands in his way (E rivalry). It fortified its northern passes about 4A 1650 (P). In 4A 1736 its envoy warned Parim that the Dead Lands were arming; the court laughed (P).
- **Nan**, **Olen** and the small human freeholds of the north coast are independent (roster).
- The Dead Lands are hot, storm-girt and hard to reach by sea (E).
- **Tensions:** Mirolon against Volgan, in silence; Mirolon's lonely warnings.
- **Hooks:** scouts' reports, storms that wreck curious ships, demon-bargains refused.

#### Zol's Mistake

- The whole black north and every black island of the Ocean of Zol belong to **Zol**, the Old God of Death (E). The land is almost empty of the living (E). Its seat is **Furviatlon** (W). Šodolôrō lies within it (E).
- Who administers it for Zol is unknown and is **not invented** (O).
- Zol cannot take a body; his servants sustain his presence; his power grows very slowly (E).
- Island fishermen told of black ships among the islands in 4A 1744 (P). Nobody at court believed them.
- **Hooks:** fishermen's tales, a drowned village, ships that do not return. Nothing military.

#### East Lands and South Lands

- The East Lands are the richest and most divided region (P). **Noris** with **Gondolin** (Noris Treaty, W) and **Stabilo** with **Drak** (Stabilo Pact, W) compete for the caravan roads, which opened in 4A 600 to 780 (P).
- **Alerhia**, **Miaed**, **Erco**, **Plutondo** and **Ostoroth** are great kingdoms in their own right (map). **Mora** is a lake republic; **Avalon** a revolutionary republic of the Red Lands (roster).
- The Council's eastern branch has courted these courts for four centuries (E direction; P "four centuries"). Its clients know only the Deliverer's generous friends: temples, relief houses, loans and gifts.
- Which eastern kings will follow Afrit willingly is **open** (O). Foothold values may differ by country; no text may say who will follow him.
- The **South Lands** desert stretches south off the map (E).
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

All relations below are peaceful. Opinion values are design targets.

| From | To | Relation | Value | Label |
| --- | --- | --- | ---: | --- |
| Lerendor | Aenor | Opinion "The Toll of 1716" | −20 | P |
| Aenor | Lerendor | Opinion "Northern Pride" | −10 | P |
| Every West Lands country | Aenor | Opinion "Old Claims Remembered" | −15 | E grievance, P value |
| Gunwaith | Girdon | Opinion "Truce of the Grey Ford"; truce until 1 Thaw 4A 1750 | −10 | P |
| Girdon | Gunwaith | as above | −10 | P |
| Noris | Stabilo, and back | Opinion "Caravan Rivalry" | −25 | W rivalry, P value |
| Coldor | Isengard, and back | Opinion "Cold Rivalry" | −30 | W |
| Goldoroth | Dondor, and back | Opinion "Border Raids" | −40 | W |
| Herrodon | Andos Enda, and back | Opinion "Old Rivalry" | −20 | W |
| Mirolon | Volgan | Opinion "Watchers of the Passes" | −50 | E rivalry, P value |
| Magical Forest, Gala Elves, every elven realm | Aenor | Opinion "Edran's Folly" (the memory of the Refusal) | −10 | E history, P value |
| Every Concord dominion | Aenor | Opinion "Concord Charters" | +20 | P |
| Every country except Volgan, Demon, Dolon, Nezer and Zol | Worshipdom | Opinion "Pilgrim Road" | +10 | P |

Factions at the start, as the politics step already writes them: Middle Kingdom Concord, Southern Dominion, Leren Compact, Northern Accord, Noris Treaty, Stabilo Pact, Dark Sea Accord (W). Overlord links follow the roster.

### The first year

4A 1748 is the peaceful year (P). Nothing visible happens beyond the ordinary quarrels of courts. Flavour events (see [04_fourth_age_history_for_play.md](04_fourth_age_history_for_play.md)) fill it. The first story event on the historical path is Eindil's waking, early in 4A 1749 (P date).

## Implementation

### Data

| Path | What |
| --- | --- |
| `docs/design/start_situation.json` (new) | One source for start variables, opinion modifiers, truces and start spirits; read by the content builder |
| `common/opinion_modifiers/zin_start.txt` | Opinion modifiers below |
| `common/ideas/zin_start.txt` | Start national spirits below |
| `common/scripted_triggers/zin_lore.txt` | Lore triggers below |
| `common/scripted_localisation/zin_lore.txt` | Display names that change with the story (see [03_names_and_terms.md](03_names_and_terms.md)) |
| `events/zin_lore.txt` | Namespace `zin_lore`: opening events and flavour |
| `history/countries/*.txt` | Generated; start relations, spirits, variables |

### Start values of shared variables

Owned by the mechanics specs; these are the lore targets they start from.

| Variable | Scope | Start value | Reason |
| --- | --- | ---: | --- |
| `zin_gathering_dark` | global | 10 | The world seems at peace; the pressures are real but hidden |
| `zin_council_influence` | Aenor | 70 | The Council governs; the King is a puppet |
| `zin_court_corruption` | Aenor | 60 | Nineteen years of sold offices |
| `zin_concord_loyalty` | each dominion | 55 default; Selen 40, Noleksun 45, Herez 50, Hunhun 50, Kilinti 55, Konori 55, Hiloron 60, Kingson 60, Asgard 65 | Taxes grumbled at; Selen is the counterweight |
| `zin_footholds` | every country | Aenor 5; Worshipdom 5; Concord dominions 3; East Lands and South Lands courts 1–3 (builder spreads by size, never by a chosen list of future allies); North Lands, West Lands, Triton's Islands, Islands of the South 1; Cold Lands, Dark Lands, Magical Lands, Lands of the Sun 0–1; Volgan, his satellites, Zol, Yeldenne 0 | Networks everywhere; strongest in Aenor (E); agents even in the Lands of the Sun (E) |
| `zin_afrit_artifacts` | global | 4 | The Necklace and three lesser artifacts gathered 4A 1611 to 1700 (P) |
| `zin_eindil_stage` | global | 0 | He has not woken |
| `zin_dominion_strength` | Volgan | 55 | A century of rebuilding; not yet ready (march historically 4A 1755) |
| `zin_mistake_power` | Zol | 20 | Grows very slowly every day (E) |
| `zin_strait_standing` | Lerendor | −20 | Resentment since 4A 1716 (P) |

### Story flags at the start

None of the shared contract's global flags is set. The builder asserts this on the generated history. In particular `zin_eindil_awake`, `zin_golden_king_dead`, `zin_aurevan_crowned`, `zin_afrit_revealed` and `zin_war_of_last_crowns` must be unset.

### Characters at the start

Full list in [02_characters.md](02_characters.md).

- Recruited: every tier A and tier B ruler, their named councillors and generals, Alleria of Selen, Horos, King Lorien, Volgan, the Deliverer as the Worshipdom's leader (`zin_aurevan`, public name only).
- Defined but recruited by nobody: `zin_eindil`, `zin_varner`, `zin_golbran`.
- Recruited to the Worshipdom as an operative only: `zin_sevrin` (operatives are visible only to their own country).
- Zol has no character portrait or body (E, shared contract).

### Opinion modifiers

`common/opinion_modifiers/zin_start.txt`, ids `zin_opinion_<key>`; values from the relations table. Keys: `toll_of_1716`, `northern_pride`, `old_claims`, `grey_ford_truce`, `caravan_rivalry`, `cold_rivalry`, `border_raids`, `old_rivalry`, `watchers_of_the_passes`, `edrans_folly`, `concord_charters`, `pilgrim_road`. All are permanent (no decay) until a mechanic removes them. Applied with `add_opinion_modifier` in country history.

The Truce of the Grey Ford is written with `set_truce` between Gunwaith and Girdon, lasting to 1 Thaw 4A 1750 (730 days).

### Start national spirits (proposed)

Modifier names are checked against the game's modifier documentation. The owning mechanics spec may replace each spirit; until then these are the targets.

| Id | Who | Modifiers | Removed when |
| --- | --- | --- | --- |
| `zin_world_long_peace` | Every country except Volgan, Demon, Dolon, Nezer, Zol and the Worshipdom | `war_support_factor = -0.10`, `justify_war_goal_time = 0.5`, `army_org_factor = -0.05` | The country goes to war, or `zin_war_of_last_crowns` is set |
| `zin_mirolon_watchers_of_the_passes` | Mirolon | `army_intel_factor = 0.15`, `dig_in_speed_factor = 0.15`, `enemy_operative_detection_chance_factor = 0.10` | Mirolon falls |
| `zin_elves_the_old_refusal` | Magical Forest, Gala Elves and every elven realm | `justify_war_goal_time = 1.0`, `drift_defence_factor = 0.20` | Elven mechanic events |
| `zin_west_old_claims` | Every West Lands country | `opinion_gain_monthly_factor = -0.10` (toward everyone; flavour of distrust) | Western Crossing or Eindil's war-kingship |
| `zin_aenor_seventeen_centuries` | Aenor | `stability_factor = 0.10`, `production_speed_buildings_factor = 0.10` (the institutions that keep a bad king's kingdom running) | Aenor mechanic events (succession war) |

### Scripted triggers

| Trigger | True when |
| --- | --- |
| `zin_afrit_secret_kept` | `NOT = { has_global_flag = zin_afrit_revealed }` |
| `zin_eindil_known_by_name` | `has_global_flag = zin_eindil_named` |

Every text that differs before and after a reveal chooses with these triggers, so the rule lives in one place.

### Events (namespace `zin_lore`)

| Id | Purpose | Fires |
| --- | --- | --- |
| `zin_lore.1` to `zin_lore.15` | Opening event for each tier A power and for Dondor and Yeldenne: "The Year 1748", the country's situation in three short paragraphs, its beliefs and wants as above, nothing hidden | `on_startup`, human players only, for the matching country |
| `zin_lore.20` | Hidden check, debug builds only: logs to the error log if any contract flag is set or any war exists on the first day | `on_startup`, when the `zin_rule_debug_checks` game rule is on |

The Worshipdom's opening event (`zin_lore.2`) is the only text at the start that may say Afrit; it is shown only to the Worshipdom.

### Defects in the current mod to fix

| Where | Today | Required |
| --- | --- | --- |
| `localisation/english/zin_rulers_l_english.yml`, Worshipdom ruler | "Afrit" | The Worshipdom's leader is `zin_aurevan`, shown through `[zin_loc_deliverer]` as "Aurevan the Deliverer" |
| `localisation/replace/world_l_english.yml`, Worshipdom description | Names Afrit and the Hidden Council | "A temple-state of the Deliverer in the Zilin Hills. It holds three valleys and little else; pilgrims from every court pass through it." |
| Worshipdom ideology stance `zin_shadow_worship` ("Power flows from worship, bargains and corruption") | Visible to everyone at the start; marks the Worshipdom as a dark power | Show a public Light stance until `zin_afrit_revealed`; see open question 2 |
| `localisation/replace/world_l_english.yml`, Yeldenne description | "guards Glo, his own heart" | "guards Glo, a crystal of old and holy power" until Glo passes to Eindil (`zin_glo_with_eindil`) |
| `docs/design/countries.csv` role text for the Worshipdom | Names Afrit | Keep as design data only; never feed it to player text |

### Bookmark

The bookmark "The Fourth Age" ([start and calendar](../00_foundation/01_start_and_calendar.md)) describes the start in two sentences, for example: "For seventeen centuries Erdae has known peace. In Parim the Golden King counts his gold, and the temples of the Deliverer are full." It names no hidden danger.

## AI

- No AI country declares war, justifies a war goal or sends volunteers before 1 Thaw 4A 1749, except where a mechanic event explicitly allows it. Implement with `ai_strategy` entries of type `declare_war` at a strong negative value in a start AI strategy plan, removed on that date or on any contract story flag.
- AI opinion follows the relations table; AI does not improve relations with Volgan or Zol.
- Mirolon's AI fortifies its northern border from the start; it does not attack.
- The Worshipdom's AI does nothing visible beyond its mechanic's hidden actions.

## Acceptance

1. On 1 Thaw 4A 1748, `has_war` is false for every country (checked by the Linux start test across all 305 countries).
2. No shared-contract story flag is set at the start (generator test on the staged history and the debug check `zin_lore.20`).
3. No text reachable before `zin_afrit_revealed` by a country other than the Worshipdom contains "Afrit", "demon" applied to the Deliverer, or "Hidden Council" (compiler secret scan over all localisation, including rulers, country descriptions, ideas, ideologies, events and bookmarks).
4. The strings "Eindil" and "Einendil" appear in no text reachable before `zin_eindil_awake`, and `zin_eindil` is recruited by no country at the start.
5. Each shared variable has the start value in the table above, within the mechanic spec's tuning.
6. Every opinion modifier and the Gunwaith–Girdon truce exist at the start (scenario test).
7. A human player of each tier A power receives its opening event; the Worshipdom's is the only one naming Afrit.
8. 60 days run without any AI war declaration.

## Open questions

1. The working table lists Andos Enda in the Leren Compact, while *The Campaign of 4A 1748* names only Eekedor, and the roster has Andos Enda as an elven realm of the Magical Lands. Is Andos Enda a Leren Compact member at the start?
2. Should the Worshipdom show a public Light stance (for example "Temple-State") until the reveal, so its Shadow ideology does not give the secret away? This spec recommends yes.
3. May start-year flavour foreshadow a sleeper in the north-west ice (a legend, not a sighting)? This spec keeps it out until the owner says yes.
4. Does the Golden King have a living heir or close kin? The vault leaves his relatives open; this spec proposes he is childless so the succession is a true crisis ([02_characters.md](02_characters.md)).
5. Is the "seventeen centuries" of peace the intended public phrase, given that only "more than a thousand years" is established?
6. Should the Lost Cause be a game faction at the start, or a court institution inside Aenor's mechanic?
