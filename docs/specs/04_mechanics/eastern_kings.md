# The Eastern Kings and the Caravan Roads

**Status:** Ready. Reviewed 19 October 2026 against CONVENTIONS "Status"; integrated 19 October 2026. **Priority:** 3. **Phase:** 3.

**Depends on** (built first; see "Build order" under Implementation): the calendar ([../00_foundation/01_start_and_calendar.md](../00_foundation/01_start_and_calendar.md); the game still starts 1936.1.1.12 until it is built, and every engine date here is an Erdae year), the rules ([../00_foundation/05_defines_and_rules.md](../00_foundation/05_defines_and_rules.md)), diplomacy, world tension, the historical path, and the Afrit mechanic.

## Purpose

The East Lands are the richest and most divided region of Erdae. This spec defines the mechanic that plays them from the peaceful start to the end of the age:

- **The caravan roads** and the **charters** that Noris and Stabilo compete for, peacefully at first (`zin_east_road_<key>`, `zin_east_inf_<key>`).
- **The caravan rivalry** (`zin_east_rivalry`): how close the two powers are to open war, and how they can make peace instead (the Concord of the Roads).
- **The Noris Treaty and the Stabilo Pact**: how the two blocs court the other eastern crowns (`zin_east_lean`), with the great kingdoms Alerhia, Miaed, Erco and Plutondo at the centre.
- **The Deliverer's generous friends in the east**: how the Hidden Council's eastern branch (owned by the Afrit spec) shows itself in eastern courts, and how eastern pressures push a court toward kneeling or refusing later (`zin_east_kneel_bias`).
- **The eastern coalition** and its **invasion of the Magical Lands** (`zin_eastern_invasion`), independent of Afrit.
- **The King of the East** as the eastern courts live it: who kneels (and becomes a subject of the Dominion of the East, decision S1), who refuses, the Free Crowns, the eastern host, and the East after the King falls.
- **The South Lands desert**: dry roads, wells, and the deep sand that runs off the map.

The focus trees [../05_focus_trees/major/noris.md](../05_focus_trees/major/noris.md) and [../05_focus_trees/major/stabilo.md](../05_focus_trees/major/stabilo.md) drive this mechanic. The tier B trees of Alerhia, Miaed, Erco, Plutondo, Drak, Ostoroth, Gondolin, Mora and Avalon, and the shared tree `shared_east_lands`, call it through the effects and triggers listed here.

The flight east, the proclamation, Afrit's person and the host's divisions belong to [afrit_hidden_council.md](afrit_hidden_council.md). This spec never duplicates them; it feeds them and reacts to them.

## Lore basis

| Fact | Status | Source |
| --- | --- | --- |
| The East Lands lie across a long rift sea east of the Magical Lands and run off the eastern map; Noris, Stabilo, Avalon, Ostoroth, Gondolin, Drak and Mora are named there | established | *Erdae and Its Regions* |
| The South Lands are the great desert of the East Lands and run off the southern map; they include the Noris Desert and the former Sunhot Desert | established | *Erdae and Its Regions* |
| What lies beyond the eastern and southern edges is not fixed | established | *Erdae and Its Regions* |
| Noris (seat Furvior; includes the Noris desert) leads the **Noris Treaty** with Gondolin; Stabilo (seat Postondoroth) competes for the southern trade routes and leads the **Stabilo Pact** with Drak; they are rivals and compete for the caravan roads | established working table | *Great Powers and Relations*, *Kingdoms Factions and Conflicts* (constitutions and origins of the blocs are not detailed), *The Campaign of 4A 1748* |
| Noris camel warriors are a tradition of men | established | *Peoples of Erdae* |
| The Hidden Council builds ties in the East Lands and South Lands as a precaution against losing Aenor; the East's rulers know its people only as the Deliverer's generous friends | established (direction) | *Afrit's Hidden Council*, *The Fourth Age of Erdae*, *The Campaign of 4A 1748* |
| In the final war an eastern coalition crosses seas and mountain approaches to threaten the Magical Lands and the Middle Kingdom; its commanders want wealth, territory, revenge, or deliverance from their own rulers' crises; some are secretly tied to Aurevan's networks; the invasion was neither wholly spontaneous nor wholly his | established | *The Fourth Age of Erdae*, *War of the Last Crowns*, Canon Register |
| Afrit abandons Aenor, exploits his influence over several rulers and takes command of an eastern dominion; he and his allies proclaim him **King of the East**, though states of the East still resist him; the title does not mean every eastern kingdom submits | established | Canon Register, *The Fourth Age of Erdae* |
| Some eastern formations fight Zol's dead and Volgan's troops, suffer terribly and retreat east; abandoned eastern troops join Eindil's temporary coalition | established | *The Fourth Age of Erdae* IX–X |
| Afrit returns with a new eastern host and claims kingship over the East and Middle Lands | established | *The Fourth Age of Erdae* XIV |
| East Lands states keep claims and grievances after the war | established | *Fifth Age Seeds* |
| The caravan roads open 4A 600 to 780 and make Noris and Stabilo rich; the rivalry "never fully ends" | proposed | *Fourth Age Chronology* |
| The eastern branch begins its courtship of East and South Lands courts about 4A 1300 | proposed date | *Fourth Age Chronology* |
| Alerhia, Miaed, Erco and Plutondo are great kingdoms in their own right | map | *The Campaign of 4A 1748* |
| Noris and Stabilo can fight each other, fight Aenor, or fight him; Afrit's eastern clients can follow him or refuse him | proposed (play choices) | *The Campaign of 4A 1748* |
| The East may unite under one king who is not Afrit | proposed outcome, outside canon | *The Campaign of 4A 1748* |
| Rulers and councillors of the East (King Esiurth II, Prince Cereos, King Alerhan III, Lord Furanow, Queen Obmia, Prince Blozan, Kessarion the Envoy) | proposed | [02_characters.md](../02_lore/02_characters.md) |
| The King of the East's realm is the Worshipdom under the cosmetic name "the Dominion of the East"; courts that kneel become its subjects (`zin_autonomy_eastern_client`), not faction members | proposed (decision S1) | [INTEGRATION_DECISIONS.md](../INTEGRATION_DECISIONS.md) |

**Open in the vault and never closed here:** which eastern kings join Afrit willingly (*Open Questions*; owner short list 11, proceeding on "each game decides"); what becomes of the eastern invaders after Eindil's coronation; what lies beyond the eastern and southern map edges. No text in this spec, the trees or their events states any of them as history. Who kneels and who refuses is decided in each game by footholds, crises and choices.

Everything else is **proposed**: the five roads and their names, charters, influence, rivalry, lean, the Concord of the Roads, the kneel bias, the coalition's selection rule, the Free Crowns, the wells and dry lands, every number and every event text.

## Design

### The situation on 1 Thaw 4A 1748

The roads are open and busy. Noris holds the charter of the Salt Road; Stabilo holds the Gold Road; three roads are contested. The two courts despise each other politely: envoys, price wars, a quarrel at a well. Gondolin is in the Noris Treaty and Drak in the Stabilo Pact; every other eastern crown is free and courted by both. The temples of the Deliverer are rich and generous in every eastern city, and nobody thinks that strange.

Nothing is hostile. No eastern country is at war, justifies a war goal or holds a claim on another. No coalition exists. Nothing at start names Afrit or the Hidden Council. The start rivalry opinion between Noris and Stabilo is the start situation's `zin_opinion_caravan_rivalry` (−25, decision N5; [../02_lore/01_start_situation.md](../02_lore/01_start_situation.md)); this spec adds no second one.

### Geography (map today)

The East Lands are the 35 countries whose region in `tools/content/data/countries.json` is `South-Earth` (the vault's map name for the East Lands), holding 337 states at start.

| Area | Countries | Note |
| --- | --- | --- |
| The rift coast (west) | Alerhia, Delbiz Grasslands, Fosoco | Across the rift from The End, Lccimio, Luv-zhise, Lengoli and Lusteli in the Magical Lands; Alerhia lies nearest the Zilin Hills |
| The north coast | Gondolin, Woqood, Orato, Fladev, Hacsen, Vigodor, Cream, Lorvens | Faces the Ocean of Zol; the Zol spec sends its rumours here. Gondolin itself has no coastal state on today's map (east lands owner question 11) |
| The centre | Noris (Furvior), Mylunur, Mora, The Moco, Kersian, Mostok | The road junction; Noris borders Stabilo, Alerhia and six more |
| The north-east | Ostoroth, Ernois, Grova, Nethnu, Eraver | The Lake Road |
| The south | Stabilo (Fudol today), Drak, Plutondo, Erco, Oreton, Obmi, Avalon, Olor, Furro, Arcon, Azano, Pornivior | The Gold and Sand Roads |
| The south-west | Miaed, Alerhia's desert half | The desert passes; both border the Lands of Light |

Lorvens's place in the table follows its capital (Liohado) on the map; the builder places nothing by this table.

**Postondoroth** is today Drak's capital victory point (state 1107), not Stabilo's (Stabilo's capital is Fudol, state 659). The map accuracy spec (row S5) moves or renames it so that Postondoroth is Stabilo's capital (east lands owner question 2; proceeding on the move). Until S5 lands, `zin_is_site_postondoroth` resolves to the state that holds the Postondoroth victory point (Drak's today); event text uses "Postondoroth" only as the name of Stabilo's court, and nothing else in this spec changes.

### 1. The caravan roads

Five roads (all names proposed). Each road is a fixed list of states the builder computes from the map at build time: the shortest land path over state adjacency between its waypoints (capital or victory-point states), fixed for the whole game and written into the site trigger `zin_is_site_road_<key>`. Conquest never changes the lists.

| Key | Name | Waypoints | Start charter | Start influence (Noris / Stabilo) |
| --- | --- | --- | --- | --- |
| `salt` | The Salt Road | Furvior → Mylunur → Gondolin's capital | Noris | 70 / 10 |
| `gold` | The Gold Road | Plutondo's capital → Postondoroth → Fudol → Mostok → Kersian → Azano → Alerhia's capital | Stabilo | 10 / 70 |
| `rift` | The Rift Road | Furvior → Delbiz Grasslands's capital → the `zin_is_site_rift_east` state of Alerhia with a naval base nearest to it (fewest state steps; ties: lowest state id) | free | 40 / 30 |
| `lake` | The Lake Road | Furvior → Mora → Ernois → Ostoroth's capital | free | 35 / 25 |
| `sand` | The Sand Road | Fudol → Obmi → Olor → Erco's capital, with a branch Obmi → Arcon → Pornivior → Miaed's capital | free | 25 / 40 |

**Influence** `zin_east_inf_<key>` (on Noris and on Stabilo, 0–100) is each power's weight on a road: factors, wells, guards, bribes.

**Charter** `zin_east_road_<key>` (global; 0 free, 1 Noris, 2 Stabilo) says who holds the road's charter. The monthly update (`zin_east_monthly`) applies, per road:

| Rule | Result |
| --- | --- |
| Free road; one side has influence ≥ 60 and at least 20 more than the other | That side gains the charter |
| Held road; the holder's influence < 40 and the other side's ≥ 60 | The charter passes |
| One side's alliance (itself, its subjects and its faction) controls two thirds or more of the road's states | That side gets influence 100 and the other 0 (conquest) |
| Noris or Stabilo no longer exists | Its charters become free; the survivor gets +20 influence on each |
| `zin_east_roads_concord` is set | Charters freeze; both sides count every road as half held (see the Concord) |

A charter change fires `zin_east.10` (news to both powers and to every court on that road), adds rivalry +5, gives the loser the flag `zin_east_in_crisis` for 365 days and the opinion modifier `zin_east_charter_lost` toward the winner.

**Monthly influence drift** (proposed):

| Source | Per month |
| --- | ---: |
| Side whose alliance controls more of the road's states | +0.5 |
| Charter holder (merchants stay where they are) | +0.3 |
| Country variable `zin_east_caravan_bonus` (sum of tree spirits; applies to every road) | +bonus |
| Influence above 80 | -0.2 |

**Caravan wealth.** Dynamic modifier `zin_east_caravan_wealth` on Noris and on Stabilo, from the number of charters held (`zin_east_charters`, 0–5; a Concord road counts 0.5):

- `political_power_gain` = 0.05 × charters;
- `trade_opinion_factor` = 0.05 × charters;
- `consumer_goods_factor` = -0.01 × charters.

**Courts on a road** drift toward its charter holder: a court that owns at least one state of a held road moves 0.1 a month toward the holder for each such road (through `zin_east_add_lean`).

**Decisions** (category `zin_east_roads`, below) move influence: send a great caravan, buy the road lords, undercut the rival, dig wells. The trees add influence and `zin_east_caravan_bonus`.

### 2. The caravan rivalry

`zin_east_rivalry` (global, 0–100, start 40) measures how near Noris and Stabilo are to open war.

| Source | Change |
| --- | ---: |
| A charter changes hands | +5 |
| `zin_east_undercut_rival` | +3 |
| Economy spec's Caravan Quarrel pressed / paid (its options call `zin_east_add_rivalry`) | +5 / -2 |
| Trouble at the Wells (`zin_east.15`): punish / blood-price / joint inquiry accepted | +3 / -2 / -3 |
| Talks at the Wells accepted / refused | -10 / +3 |
| A free road where both sides have influence ≥ 40 | +0.3 a month |
| Both powers refuse the King of the East | -0.5 a month |
| One kneels and the other refuses | +1 a month |
| Monthly drift toward 40 | ±0.2 |
| Hub decision Feed the Caravan Quarrel (eastern branch) | +5 |
| The trees | see the tree specs |

| Rivalry | Effect |
| ---: | --- |
| 60+ | `zin_east.15` (Trouble at the Wells) can fire, mean time 240 days, alternating between the two powers |
| 75+, `zin_gathering_dark` ≥ 25 and after 1 Thaw 4A 1751 (`zin_east_caravan_war_open`) | The Caravan War focus of each tree becomes available; it grants `zin_cb_caravan_roads` through `zin_diplo_grant_cb` (diplomacy spec) |
| 90+ | AI weight for the Caravan War focus ×3 |
| 15 or less | `zin_east_concord_of_the_roads` becomes available |

**The Concord of the Roads** (proposed). When rivalry is 15 or less, either power may propose a Concord (`zin_east.23`). If both sign: global flag `zin_east_roads_concord`; both get `zin_east_shared_roads`; charters freeze; every road counts as half held for both; opinion modifier `zin_east_concord` (+30) both ways; rivalry cannot rise above 30 for 1,825 days. The Concord ends if either declares war on the other (`on_declare_war` clears the flag, removes the idea and the opinion modifiers). It is an outcome of play, never history; the cap lapses after five years, so the rivalry the vault says "never fully ends" can always return (east lands owner question 9; proceeding on the Concord as a play outcome).

**The Caravan War.** When Noris and Stabilo are at war with each other, global flag `zin_east_caravan_war` is set (cleared at peace), both get `zin_east_caravan_war_strain`, and `zin_east.25` announces it. Road conquest (above) does most of the economic damage. The trees' Caravan Peace focus fires `zin_east.26` to the losing side: give up the winner's claimed road states, or fight on.

### 3. The courts of the East: lean, the Treaty and the Pact

**Lean** `zin_east_lean` (every East Lands country except Noris and Stabilo, -100 to +100): positive leans to Furvior, negative to Postondoroth.

| Court | Start lean | Note |
| --- | ---: | --- |
| Gondolin | 70 | Noris Treaty member |
| Mylunur | 30 | The Salt Road's wells |
| Delbiz Grasslands | 20 | The Rift Road |
| Ostoroth | 15 | Highland kingdom of the Lake Road |
| Mora | 10 | Lake republic between Ostoroth and Noris |
| Alerhia | 0 | Courted by both; both great roads end in it |
| Kersian, The Moco | 0 | Between the two powers |
| Miaed | -10 | The Sand Road's pass branch |
| Avalon | -10 | Revolutionary republic of the Red Lands |
| Mostok | -15 | The Gold Road |
| Erco | -20 | Mountain kingdom of the south |
| Obmi, Oreton | -20 | Neighbours of Stabilo |
| Plutondo | -30 | Neighbour of Drak |
| Drak | -70 | Stabilo Pact member |
| Every other East Lands country | 0 | |

Lean moves through the court decisions, focuses, road drift and events. `zin_east_add_lean` (scoped to the court, argument `value`) is the only way to change it.

**The great kingdoms** (map: great kingdoms in their own right). Rulers from the characters spec (proposed). Footholds from the Afrit spec's start table.

| Court | Ruler | States | Where | Roads | Lean | Footholds | Pressures in play (proposed; tendencies, not destiny) |
| --- | --- | ---: | --- | --- | ---: | ---: | --- |
| **Alerhia** | King Alerhan III | 26 | Westernmost; desert and mountains on the rift coast facing the southern Magical Lands and the Zilin Hills; borders the Lands of Light | Gold (west end), Rift (port) | 0 | 3 | Largest eastern court and the one that faces the rift: highest coalition weight at start. Both rivals want its roads. |
| **Miaed** | Lord Furanow of the Passes | 19 | South-west; the desert passes of the South Lands; borders the Lands of Light; near the Dead Lands' eastern edge | Sand (pass branch) | -10 | 3 | A South Lands court; its passes make it a gate, not a road-builder. |
| **Erco** | Queen Obmia of Erco | 16 | The southern mountains | Sand (east end) | -20 | 3 | Mines and mountain forts; far from the rift. |
| **Plutondo** | Prince Blozan | 16 | South-east, between Drak and Erco; desert, hills and a coast | Gold (east end) | -30 | 3 | Populous; the Stabilo Pact's natural next member. |

**Joining the blocs.** The factions exist at start (diplomacy spec): the Noris Treaty (Noris, Gondolin) and the Stabilo Pact (Stabilo, Drak). With the trees' opening focuses, Noris may invite a court at lean 50 or more and Stabilo at lean -50 or less (`zin_east_invite_to_league`, event `zin_east.70`). AI acceptance = |lean| − 20, +20 if the court borders the inviter, −30 if it borders the rival.

**Protection.** On the trees' banner and unification branches, a court at |lean| 80 or more (60 on the unification routes) may be offered protection (`zin_east_offer_protection`, event `zin_east.71`): accept → the court becomes a subject (`puppet`); AI chance = |lean| − 40, ×2 if the court is at war with a stronger neighbour.

**Dominance** `zin_east_dominance` (Noris and Stabilo, 0–100) = 100 × (East Lands states controlled by the power and its subjects + 0.5 × states controlled by its faction members) ÷ the frozen East Lands state count (collection `zin_region_east_lands`, 337 states today). Start: Noris about 8, Stabilo about 6. The unification routes read it.

### 4. The Deliverer's generous friends in the East

The Hidden Council's eastern branch and the network of footholds belong to the Afrit spec: `zin_footholds`, the caps, *Open a House*, *Close the Houses*, the hub's decisions, and the eastern candidates. In the East the network wears a public face: temples, relief houses and **generous friends** who lend to princes in trouble. Kessarion the Envoy (characters spec, proposed) heads the eastern branch as Corvel's man in the East, under the Seat of Whispers (east lands owner question 7; proceeding on that). He is visible only to the hub. This spec creates no character, and no public text names him.

This spec adds three things.

**Temple loans** (`zin_east.30`, The Generous Friends Offer a Loan). Fires for an East Lands court with footholds 2 or more that has `zin_east_in_crisis` or stability below 40%; mean time 365 days; at most once per 730 days per court; never after `zin_afrit_dead`.

| Option | Effect | AI |
| --- | --- | --- |
| Accept the loan | Timed idea `zin_east_temple_loan` (365 days); `zin_afrit_add_footholds(1)` (within the cap); flag `zin_east_owes_temples` (1,095 days) | 60, +30 in crisis; 0 with an audit flag from a tree (`zin_east_court_audit` from the shared and tier B trees, `zin_noris_audit`, `zin_stabilo_audit`) |
| Decline politely | nothing | 40 |
| Borrow from Postondoroth instead | Only if Stabilo has `zin_stabilo_ledger_open` and the court is not at war with Stabilo: `zin_stabilo_add_debt(10)` on the court, political power +50 for the court; tells Stabilo (`zin_east.32`) | 50 if the court's lean ≤ 0 |

This is the only temple-loan event: decision O4 retires the lore spec's generic `zin_lore.191` ([../02_lore/04_fourth_age_history_for_play.md](../02_lore/04_fourth_age_history_for_play.md)), so a court never gets two loan offers.

**The kneel bias** `zin_east_kneel_bias` (every East Lands country, -100 to +100), recomputed monthly by `zin_east_update_bias`. It sums eastern pressures that the Afrit spec's acceptance table cannot see. **Proposed dependency:** the Afrit spec adds it to the AI chance in `zin_afrit.51` (The Deliverer Comes East) and uses it, after footholds, to break ties in its historical auto-accept.

| Factor | Bias |
| --- | ---: |
| Coalition member (`zin_east_coalition_member`) | +15 |
| `zin_east_owes_temples` | +10 |
| `zin_east_in_crisis` | +10 |
| Leads a faction | -15 |
| Member of a faction whose leader has `zin_afrit_refused_east` | -20 |
| Stabilo debt (`zin_stabilo_debt`, Stabilo tree) 30 or more | -10 (-20 if Stabilo has `zin_stabilo_rival_banks`) |
| `zin_east_pledged` (a tree route) | +100 |
| A tree's resist route flag (`zin_east_route_resist`, `zin_noris_route_shield`, `zin_stabilo_route_free`) | -100 |
| A tree's unification route flag (`zin_noris_route_high_king`, `zin_stabilo_route_empire`) | -50 |
| AI country under the rule's REFUSE_AFRIT or UNITE_WITHOUT_AFRIT branch (`zin_east_rule_refuse` or `zin_east_rule_unite`, wrapping the rules spec's `zin_rules_ai_branch_east_*`) | -100 |

The sum is clamped to -100…100. Bias is 0 on day one and is first computed on the first monthly update, after the Afrit spec's startup has set footholds.

**Pledged courts.** A court with `zin_east_pledged` (Noris's The Deliverer's Sword, Stabilo's Treasurer of the East, or a tier B tree) has asked the friends to count it among the faithful. **Proposed dependency:** the Afrit spec treats a pledged court with footholds 3 or more as an eastern candidate even below footholds 4.

**Eastern branch decisions** (added to the Afrit spec's hub category `zin_afrit_council`, implemented in this spec's decision file; visible only when `zin_afrit_is_hub`; text speaks of "the Council" and "the eastern branch" and names the master only through `[zin_loc_deliverer]`, so no `zin_east` key contains the word Afrit):

| Decision | Available | Cost | Effect |
| --- | --- | ---: | --- |
| `zin_east_feed_the_quarrel` (Feed the Caravan Quarrel) | Noris and Stabilo both have footholds 3+; rivalry < 90 | 50 PP | rivalry +5; `zin_afrit_add_veil(-1)`; 180-day cooldown |
| `zin_east_whisper_of_the_rift` (A Whisper of the Rift) | `zin_golden_king_dead`; not `zin_eastern_invasion` | 75 PP | every East Lands court with footholds 3+ gets `zin_east_rift_whispered` for 365 days (coalition weight +10); `zin_afrit_add_veil(-2)`; once |
| `zin_east_report` | always | 0 | private report `zin_east.31`: footholds, bias and coalition weight of every East Lands court |

### 5. The eastern coalition and the invasion of the Magical Lands

The invasion is the East's own ambition. It is not ordered by Afrit (Afrit spec, interaction table) and it happens whether or not Afrit later goes east.

**Coalition weight** `zin_east_coalition_weight` (temporary, per East Lands country, Noris and Stabilo included):

| Factor | Weight |
| --- | ---: |
| 10 × footholds | 0–50 |
| Owned states ÷ 2, rounded down | up to 15 |
| Owns a `zin_is_site_rift_east` state (`zin_east_faces_rift`) | +20 |
| `zin_east_rift_ambition` (Alerhia's Lord of the Crossing; other trees may set it) | +15 |
| Ruling ideology Dominion | +10 |
| `zin_east_in_crisis` | +10 |
| `zin_east_rift_whispered` | +10 |
| `zin_east_kneel_bias` ÷ 5 | -20 to +20 |
| Ruling ideology Light | -30 |
| Already at war | -20 |
| A tier B or C court on its resist route (`zin_east_route_resist`) | -50 |
| Noris or Stabilo on a tree resist route (`zin_noris_route_shield`, `zin_stabilo_route_free`) | -100 |
| A human player's country | computed the same way; a human is never auto-joined |

At start Alerhia is the heaviest court (about 65); Noris is about 52; most courts are 30 to 45. Play changes this.

**Steps.**

1. **Envoys speak of the rift** (`zin_east.40`). After `zin_golden_king_dead` + 365 days, or from 1 Thaw 4A 1753, every court with footholds 3 or more hears of Aenor's troubles and the rich elven lands across the rift. Flavour; sets `zin_east_rift_talk`. No war.
2. **The coalition gathers** (hidden `zin_east.41`). Fires 30 days after `zin_war_of_last_crowns`; outside the historical rule it may also fire when `zin_gathering_dark` ≥ 70 after 1 Thaw 4A 1754. It runs once (global flag `zin_east_coalition_formed`). It computes weights. The **leader** is the AI or human country with the highest weight among East Lands countries with 8 or more states (ties: most states, then tag; flag `zin_east_coalition_leader`); a human leader gets `zin_east.42` with the leader's text and may decline, and then the next one leads. Every other country with weight 50 or more gets `zin_east.42`. Under the historical path (`zin_rules_is_historical`), if fewer than two AI countries join, the AI countries with the highest weights join until there are two members besides the leader. If no country has 8 or more states, or no leader accepts, no coalition forms (checkpoint 14 diverges).
3. **The coalition asks** (`zin_east.42`): join (flag `zin_east_coalition_member`; idea `zin_east_coalition_ambition`) or stay out. AI chance = weight. A human always chooses.
4. **The crossing of the rift** (`zin_east.43`, 30 days after `.41`). The leader sets the one-day flag `zin_story_war` (diplomacy spec: story wars are exempt from the peace-breaker rule), then declares war (`declare_war_on`, type `take_state_focus`, on the target's `zin_is_site_rift_west` states) on up to three Magical Lands realms that own `zin_is_site_rift_west` states, those with the most such states first (ties: tag); every member joins with `add_to_war`. Sets global flag `zin_eastern_invasion` (diplomacy spec name; the world tick adds its +2 to the Gathering Dark, so this event adds none). Members with footholds 3 or more gain `zin_cb_eastern_ambition` (diplomacy spec) on Aenor and the Magical Lands realms through `zin_diplo_grant_cb`, 730 days. Calls the elves spec's `zin_elves_on_eastern_invasion` (that spec keeps a monthly fallback). Adds the checkpoint 14 strategy: every member `add_ai_strategy` `conquer` 80 toward each target. Public news. The Wall Accord is not broken (diplomacy spec). Elven realms defend themselves under the Refusal's rules.
5. **The host turns west** (`zin_east.44`). The leader declares war on Aenor (again with `zin_story_war`) 120 days after `zin_eastern_invasion` if the coalition controls three or more Magical Lands states, or in any case on 1 Deepwinter 4A 1756 (`1756.1.1`, moved by the story pace) under the historical path. Sets `zin_east_turns_west`. Members join. This gives the Afrit spec's flight condition "Aenor at war with an East Lands country". Under the historical path the target is Aenor whoever rules it: the vault says the invasion was neither spontaneous nor wholly under Aurevan's control.
6. **The coalition breaks** (`zin_east.45`). When `zin_afrit_king_of_east` is set, every coalition member with `zin_afrit_refused_east` chooses: make peace (white peace with each enemy it fights in the Magical and Middle Lands) or fight on for its own gain. AI: peace 70%.
7. **Abandoned companies** (`zin_east.46`). On `zin_eindil_returned`, every East Lands country still at war in the Middle or Magical Lands chooses: let its stranded companies serve the stranger's coalition (country flag `zin_east_companies_with_eindil`, read by the Eindil spec's "Call the Stranded Armies"; army experience +10) or order them home (manpower +5,000). AI: serve 60% if it refused the King of the East, 10% otherwise.

### 6. The King of the East, as the East lives it

The Afrit spec owns the flight (`zin_afrit_flee_east`), the candidate event `zin_afrit.51`, the proclamation (`zin_afrit_proclaim_king_of_east`, sets `zin_afrit_king_of_east`), the Worshipdom's cosmetic name **the Dominion of the East**, and the host's divisions. By decision S1, a court that kneels becomes a **subject of the Worshipdom with the autonomy state `zin_autonomy_eastern_client`** (diplomacy spec) and carries `zin_afrit_eastern_client`; it does not join a faction. Refusers carry `zin_afrit_refused_east`. Below, "the Dominion" means the Worshipdom while `zin_afrit_king_of_east` holds.

This spec adds what the East does around those beats.

**Before kneeling.** `zin_east_prepare_kneel` (scoped to the kneeling court) runs first:

- stores the ruling ideology in `zin_east_old_ideology` (0 Light, 1 Dominion, 2 Shadow, 3 Wild);
- if the court is in a faction (the Noris Treaty, the Stabilo Pact or the Free Crowns), `leave_faction`, and its former faction leader gets the opinion modifier `zin_east_knelt` toward it;
- if the court is already a subject of another country (for example Noris's or Stabilo's), it stays that country's subject: it takes the flag and gives the Dominion military access (`give_military_access`), but is not made the Dominion's subject. Kneeling never frees a subject.

Then, for a court that is not anyone's subject, the Dominion makes it a subject: `set_autonomy = { target = <court> autonomy_state = zin_autonomy_eastern_client end_wars = no end_civil_wars = no }`. **Dependency (met by the Afrit spec):** the kneel option of `zin_afrit.51` calls `zin_east_prepare_kneel` and then this `set_autonomy`, instead of joining a faction (decision S1).

**Courts that are not candidates.** Every East Lands court that got no `zin_afrit.51` gets `zin_east.50` (A King in the East) 30 days after the proclamation: send gifts (opinion of the Dominion +20; no subject relation), refuse (flag `zin_afrit_refused_east`, so it counts as a refuser), or keep silent (nothing). AI: refuse when it borders a refuser that leads a faction; gifts when bias ≥ 30; otherwise silent. Under the historical path, if fewer than two East Lands countries carry `zin_afrit_refused_east` once every `zin_east.50` has been answered, the AI courts with the lowest `zin_east_kneel_bias` (ties: most states, then tag) refuse until two do: the vault fixes that states of the East resisted him, never which ones.

**The Free Crowns** (proposed). Refusing courts may stand together.

- Every refuser gets the idea `zin_east_free_crowns` while `zin_afrit_king_of_east` holds and `zin_afrit_dead` does not.
- The **First of the Free Crowns** (flag `zin_east_free_crowns_leader`, `zin_east.51`) is the first refuser to take a tree's resist focus; otherwise, 60 days after the proclamation, the refuser with the most states that leads a faction, else the refuser with the most states.
- The First may invite refusers into its faction (`zin_east_rally_free_crowns`, targeted; event `zin_east.70` with Free Crowns text; AI accepts at 70%). If the First leads no faction, the first acceptance makes it found one: `create_faction_from_template = zin_faction_free_crowns` (proposed template "The Free Crowns", joining rule `zin_faction_rule_join_east_lands` from the diplomacy spec), then `add_to_faction`.
- Refusers gain `zin_cb_free_east` (new) on the Dominion and on every country with `zin_afrit_eastern_client`, while `zin_afrit_king_of_east` holds and `zin_afrit_dead` does not.
- Opinion `zin_east_free_crown_kin` (+20) among refusers; `zin_east_knelt` (-25) from each refuser toward each client.

**The eastern host** (`zin_east.52`, The King Calls His Host). When `zin_afrit_returned` is set, every client gets: send levies (manpower -10,000; country flag `zin_east_sent_levies`, which Noris's `zin_noris_riders_for_host` also counts as; **proposed dependency:** the Afrit spec's host adds 1 division per two clients with that flag) or send gold (political power -100; the Dominion political power +100) or delay (bias -20; the Dominion's opinion -25). AI: levies 60, gold 30, delay 10.

**After the King.** When `zin_afrit_dead` is set, `zin_east_after_the_king` runs once (`zin_east.60` to every East Lands court):

- former clients: every client still a subject of the Worshipdom is released (`end_puppet`, run by the Worshipdom; **dependency, met by the Afrit spec:** its `zin_afrit_die` releases no client and leaves this release to this effect); idea `zin_east_kings_debt` (730 days); their governments return to their pre-kneeling ideology if it changed (from `zin_east_old_ideology`; restored with `set_politics`, ruling party of that ideology, elections allowed as before);
- refusers: idea `zin_east_vindicated` (730 days);
- `zin_east_free_crowns` and the cause `zin_cb_free_east` end;
- rivalry is set to at least 50: the old quarrels return (vault: claims and grievances remain).

### 7. The unified East (proposed outcome)

One of the proposed outcomes is that the East unites under a king who is not Afrit. Noris (High King of the Sands) and Stabilo (The Prince of All Roads) each have a unification route.

- `zin_cb_high_king` (new): the route holder → East Lands courts with lean of the wrong sign (Noris: lean < 0; Stabilo: lean > 0) and courts that knelt to the King of the East. Granted by the route's war focus, only after `zin_war_of_last_crowns` or `zin_afrit_king_of_east`. 730 days.
- `zin_east_declare_united` (from the route's last focus): needs `zin_east_dominance` ≥ 50, the country not `zin_afrit_eastern_client`, and no other country with `zin_east_united`. Sets global flag `zin_east_united`, idea `zin_east_united_crown`, news `zin_east.80`. The text says "an outcome of this game", never history. World systems read `zin_east_united` for the proposed ending One King in the East (`zin_ending_eastern_king`, [../03_gameplay/05_world_tension_and_endings.md](../03_gameplay/05_world_tension_and_endings.md)); this spec sets no ending flag.

### 8. The South Lands desert

**Where.** The vault puts the South Lands in the great desert of the East Lands, running off the southern map; this spec treats the on-map desert band as the South Lands (owner short list 6, proceeding on "the on-map desert of the East Lands"). `zin_is_region_south_lands` (state trigger, generated) is true for an East Lands state whose dominant terrain is desert (most of its land provinces have terrain `desert` in `map/definition.csv`) and whose centroid (mean pixel of its provinces in `map/provinces.bmp`) lies at least 1,550 pixel rows below the top edge of the 2,560-row map (proposed). The builder computes the list from the map; it is fixed for the game. Today this is about 84 states. A **South Lands court** (`zin_east_is_south_court`) owns at least half its states in the South Lands: today Noris, Stabilo, Alerhia, Miaed, Mostok, Obmi and Oreton. The build prints both lists; the numbers here are design targets.

**Dry land.** Every South Lands state without wells carries the state dynamic modifier `zin_east_dry_land` (`supply_factor` -0.25, `truck_attrition_factor` 0.25). A state with the state flag `zin_east_wells` carries `zin_east_wells` instead (`supply_factor` 0.10, `local_resources_factor` 0.10). Dry land hurts every army that marches there, the owner's too; wells help everyone who holds the state.

**Digging wells.** Decision `zin_east_dig_wells` (state-targeted, below), opened by the trees' desert focuses (`zin_east_wells_unlocked`). Tier B and C South Lands courts get it from their own trees.

**Dry years** (`zin_east.36`, Dry Wells). Mean time 540 days for a South Lands court: dig deeper (−25 PP; a random owned dry state gets wells) or ration water (stability −3% for 90 days).

**The deep sand.** The South Lands run off the southern map (established). Decision-free event `zin_east.35` (Into the Deep Sand) is fired by the trees' expedition focuses: a caravan goes south and comes back with salt, glass and stories. The text **never** says what lies beyond the map's edge (established as not fixed). Options: "Mark the wells they found" (a random owned dry state gets wells) / "Sell the stories" (political power +25).

**Names.** The Noris Desert is a state name (map). The vault's "former Sunhot Desert" is a superseded place name; player text calls it only "the South Lands" or "the southern desert".

### 9. Interaction with other systems

| System | Reads from this spec | Calls or sets for this spec |
| --- | --- | --- |
| Afrit ([afrit_hidden_council.md](afrit_hidden_council.md)) | `zin_east_kneel_bias` (proposed input to `zin_afrit.51` and the historical tie-break), `zin_east_pledged`, `zin_east_prepare_kneel`, `zin_east_sent_levies`, `zin_eastern_invasion`, `zin_east_turns_west` | `zin_footholds` (via `zin_afrit_add_footholds`), `zin_afrit_is_hub`, `zin_afrit_eastern_client`, `zin_afrit_refused_east`, `zin_afrit_king_of_east`, `zin_afrit_returned`, `zin_afrit_dead`, `zin_afrit_revealed`, `zin_afrit_purge_houses`, `zin_afrit_add_veil`, the names spec's `zin_loc_deliverer` (N16); the kneel makes the court a subject (decisions S1, O5) |
| Diplomacy ([../03_gameplay/03_diplomacy_and_factions.md](../03_gameplay/03_diplomacy_and_factions.md)) | `zin_eastern_invasion` (its flag; set here) | the Noris Treaty and Stabilo Pact (`zin_faction_noris_treaty`, `zin_faction_stabilo_pact`), `zin_faction_rule_join_east_lands`, the autonomy state `zin_autonomy_eastern_client`, `zin_diplo_grant_cb`, `zin_cb_caravan_roads`, `zin_cb_eastern_ambition`, `zin_story_war`, the collection `zin_region_east_lands` |
| Economy ([../03_gameplay/02_economy.md](../03_gameplay/02_economy.md)) | `zin_east_add_rivalry` in its Caravan Quarrel event | `zin_econ_east_lands`; the start opinion `zin_opinion_caravan_rivalry` (start situation spec, decision N5) |
| World systems ([../03_gameplay/05_world_tension_and_endings.md](../03_gameplay/05_world_tension_and_endings.md)) | `zin_eastern_invasion` (one of the war's fronts; +2 to the meter, applied by the world tick), `zin_east_united` (ending One King in the East) | `zin_war_of_last_crowns`, `zin_gathering_dark` (this spec adds nothing to the meter itself) |
| Rules and historical path ([../00_foundation/05_defines_and_rules.md](../00_foundation/05_defines_and_rules.md), [../03_gameplay/06_historical_path_and_ai.md](../03_gameplay/06_historical_path_and_ai.md)) | checkpoint 14 (`zin_eastern_invasion`), part of checkpoint 17 | `zin_rule_ai_east`, `zin_rules_is_historical`, `zin_rules_ai_branch_east_<option>`, `zin_story_pace` |
| Aenor ([aenor_court_and_succession.md](aenor_court_and_succession.md)) | `zin_east_turns_west` | war target; `zin_golden_king_dead`; its succession after the flight |
| Eindil's journey ([eindil_journey.md](eindil_journey.md)) | `zin_east_companies_with_eindil` (proposed reader: its Call the Stranded Armies) | `zin_eindil_returned` |
| Magical Lands and elves | the war of the rift; `zin_elves_on_eastern_invasion` is called by `zin_east.43` | the Refusal's defence rules |
| Lore ([../02_lore/04_fourth_age_history_for_play.md](../02_lore/04_fourth_age_history_for_play.md)) | — | `zin_lore.191` is retired; `zin_east.30` is the only temple-loan event (O4) |
| Zol's Mistake | — | rumours to the north coast (its `zin_mistake.2`) |
| The trees (Noris, Stabilo, the nine tier B courts, `shared_east_lands`) | every effect and trigger below | the tree flags named in this spec (`zin_noris_*`, `zin_stabilo_*`, `zin_east_route_resist`, `zin_east_court_audit`, `zin_east_rift_ambition`, `zin_east_pledged`, `zin_east_wells_unlocked`, `zin_east_courts_noris`, `zin_east_courts_stabilo`), and the tree-declared effects `zin_noris_monthly`, `zin_stabilo_monthly`, `zin_stabilo_add_debt` and variable `zin_stabilo_debt` |

### 10. The historical path

Fixed floor dates in this spec (1 Thaw 4A 1751, 1 Thaw 4A 1753, 1 Thaw 4A 1754, 1 Deepwinter 4A 1756) are historical-path dates. They move with the story pace exactly as the historical path spec's checkpoints do (decision V4): date *d* becomes start + (*d* − start) × `zin_story_pace`. The builder writes the three shifted dates into generated triggers `zin_east_after_<key>` (`caravan_war`, `rift_talk`, `early_coalition`, `turn_west`); scripts never compare raw dates.

Every event carries `timeout_days = 30`, and a timed-out event takes its first option (decision E2). A human-facing choice event on the path therefore puts the non-committal option first and the historical option second: `.42` (Stay out, then Join), `.45` (Fight on, then Make peace), `.46` (Order them home, then Let them serve), `.50` (Keep silent first), `.52` (Delay first) and `.70`/`.71` (Decline or Refuse first). AI chances are unchanged.

| Date (proposed) | In the East |
| --- | --- |
| 1 Thaw 4A 1748 | Peace. Rivalry 40. Noris holds the Salt Road, Stabilo the Gold Road; three roads free. |
| 4A 1748–1750 | Caravans and envoys. Noris usually wins the Rift Road; Stabilo the Sand Road. Rivalry 45–55. Temple loans to courts that lose charters. |
| Mistfall 4A 1750 | The Golden King dies; eastern courts send mourners (lore flavour). |
| 4A 1751–1754 | The Treaty and the Pact court the great kingdoms; each gains one or two members. Trouble at the Wells. Envoys speak of the rift (`zin_east.40`, from Mistfall 4A 1751). No war between Noris and Stabilo. |
| 1 Rainwake 4A 1755 | `zin_war_of_last_crowns` (world systems): the coalition gathers 30 days later (leader most often Alerhia) and crosses the rift 30 days after that: `zin_eastern_invasion` (checkpoint 14, target 60 days after checkpoint 11). |
| By 1 Deepwinter 4A 1756 | The host turns west: war with Aenor (`zin_east_turns_west`). |
| From 1 Thaw 4A 1756 | Afrit goes east (Afrit spec; checkpoint 17). At least two eastern courts kneel and become the Dominion's subjects; at least two refuse; the Free Crowns gather. Refusers in the coalition mostly make peace. |
| 4A 1757 | `zin_eindil_returned`: abandoned eastern companies join the stranger's coalition. |
| 4A 1758 | `zin_afrit_returned`: clients send the host. Free Crowns fight the Dominion of the East where they border it. |
| 4A 1759 | `zin_afrit_dead`: clients carry the King's Debt; refusers are vindicated; rivalry back to 50 or more. |
| 4A 1760 | The East is divided and armed; claims and grievances remain. |

Which courts kneel is not listed: it is decided in each run by footholds, the bias, the rule and the players.

### Peace gates

| Action | Earliest |
| --- | --- |
| Any eastern wargoal or claim on another eastern court | `zin_war_of_last_crowns`, or the Caravan War gate (rivalry ≥ 75 and `zin_gathering_dark` ≥ 25 and after 1 Thaw 4A 1751), or `zin_afrit_king_of_east` (Free Crowns and unification causes) |
| The coalition | 30 days after `zin_war_of_last_crowns`; or `zin_gathering_dark` ≥ 70 after 1 Thaw 4A 1754 outside the historical path |
| War on Aenor | `zin_eastern_invasion` |
| Caravan War under the historical path (AI) | `zin_war_of_last_crowns`, and only between a client and a refuser |
| The trees' route junctions | `zin_afrit_king_of_east`, `zin_eastern_invasion`, or `zin_golden_king_dead` after 1 Thaw 4A 1753 |

Nothing in this spec fires in 4A 1748 except the startup, the monthly update, road decisions and flavour.

## Implementation

### Builder module, data and tests

- **Module:** `tools/content/modules/mech_eastern_kings.mjs`, exporting `buildEasternKings(staged, { zin, countries })`. `tools/content/build.mjs` imports it and calls it after the diplomacy, world-tension, rules and Afrit mechanic modules and before vanilla removal (whose reference scan and C3 dangling-name check must see these files). It writes every game file below into the `Staged` set with `staged.text`, `cw()` and `yml()` from `tools/content/lib/core.mjs`; `apply.mts` applies them in the same atomic transaction as everything else. No game file is hand-edited.
- **Data:** `tools/content/data/mechanics/eastern_kings.json` (owner-editable, proposed values): the five roads (key, display name, waypoints by country name or victory-point name, start charter, start influences), the start lean table, the South Lands row threshold (1,550), every number in this spec's tables (thresholds, drifts, costs, cooldowns, AI weights), and the event picture of each event.
- **Map inputs** (read-only, from the politics step's output in the mod): `history/states/*.txt` (owners, provinces, victory points, naval bases), `map/definition.csv` (province type and terrain), `map/provinces.bmp` (24-bit, 5,120 × 2,560; two provinces are adjacent when their pixels touch), `map/strategicregions/*.txt` (sea regions), and `countries.json` (`scan` = `South-Earth` marks the East Lands, `Magical Lands` the Magical Lands). From these the module computes, deterministically (stable sort by state id): the East Lands state list (states owned at start by East Lands countries), the South Lands list (section 8), the rift sea (every sea strategic region whose sea provinces touch land provinces of both an East Lands and a Magical Lands state), `zin_is_site_rift_east` / `_west` (land states of each side touching a rift-sea province), the two seats (the states holding the Furvior and Postondoroth victory points), and each road (breadth-first shortest path over land state adjacency inside the East Lands, between consecutive waypoints; ties: lowest state id). Country names resolve to tags through `countries.json`; scripts never contain a tag that is not generated.
- **Tests:** `tools/content/mech_eastern_kings.test.mjs` (`node --test`), added to the `test` script of `tools/package.json` when the module lands. It builds into a temporary staged set and asserts the build-test items of the acceptance list.

### Build order and what exists today

This mechanic writes nothing until its dependencies are built: the calendar, the rules (`zin_rule_ai_east`, `zin_rules_*` triggers, `zin_story_pace`), diplomacy (factions, collections, the autonomy state, `zin_diplo_grant_cb`), world tension (`zin_gathering_dark`, `zin_war_of_last_crowns`), the Afrit mechanic (footholds, flags), the names spec's `zin_loc_deliverer`, the Noris and Stabilo trees (their declared effects). Until each tree lands, the module writes the tree-declared names it calls (`zin_noris_monthly`, `zin_stabilo_monthly`, `zin_stabilo_add_debt`, `zin_stabilo_debt`) as no-op stubs marked `# stub until <tree>`, and the stubs disappear when the focus compiler stages the real ones; the build's C3 check fails on any name left dangling. It replaces no interim stub of vanilla removal (`zin_world.1`, `zin_interim_category` and the Long Peace tree stay until their own owners replace them). Every country still runs the interim Long Peace tree today, so until the tree phase the focus-driven parts (invitations, routes, wells, unification) stay closed and only the startup, the monthly update, the road decisions and the story events run.

### Files

| Path | Written by | Content |
| --- | --- | --- |
| `common/scripted_effects/zin_east.txt` | `mech_eastern_kings.mjs` | Mechanic effects below |
| `common/scripted_triggers/zin_east.txt` | same | Mechanic triggers below, the `zin_east_after_<key>` date triggers (three pace sets) |
| `common/scripted_triggers/zin_sites.txt` (rows only) | `modules/sites.mjs`, from rows this module computes | `zin_is_site_furvior`, `zin_is_site_postondoroth`, `zin_is_site_road_<key>`, `zin_is_site_rift_east`, `zin_is_site_rift_west`, `zin_is_region_south_lands`, `zin_is_region_east_lands`. Decision E7: `build.mjs` gathers every module's site rows into the one file; identical rows merge, conflicting rows fail the build. This module writes no site file of its own |
| `common/ideas/zin_east.txt` | same | Mechanic ideas |
| `common/dynamic_modifiers/zin_east.txt` | same | `zin_east_caravan_wealth`, `zin_east_dry_land`, `zin_east_wells`, the causes `zin_cb_free_east` and `zin_cb_high_king` (in the diplomacy spec's form: a targeted `generate_wargoal_tension_against`) |
| `common/opinion_modifiers/zin_east.txt` | same | Opinion modifiers below |
| `common/factions/templates/zin_east.txt` | same | `zin_faction_free_crowns` (The Free Crowns, created with `create_faction_from_template`, decision E3; script-only: `visible = { always = no }`, `can_leader_join_other_factions = no`; `default_rules = { zin_faction_rule_join_east_lands war_declaration_rule_faction_leader_only call_to_war_rule_faction_leader_only change_leader_rule_never faction_peace_rule_liberation_focus }`; icon from the diplomacy spec's pool; no manifest). The diplomacy spec lists it among the factions formed in play |
| `common/decisions/categories/zin_east.txt`, `common/decisions/zin_east.txt` | same | Categories `zin_east_roads`, `zin_east_courts`, `zin_east_ledger`; the three hub decisions in `zin_afrit_council`; Stabilo's four Ledger decisions |
| `events/zin_east.txt` | same | Namespace `zin_east` (mechanic-owned; may use `trigger` and `mean_time_to_happen`) |
| `common/on_actions/zin_east.txt` | same | `on_startup` → `zin_east.1`; `on_declare_war` (Caravan War flag, Concord end); `on_peace` (clear the Caravan War flag; remove `zin_east_coalition_ambition`); `on_capitulation` (`zin_east_in_crisis`) |
| `common/scripted_localisation/zin_east.txt` | same | Road names, charter holder names, lean words, client/refuser text switches |
| `localisation/english/zin_east_l_english.yml` | same | All text (UTF-8 with BOM, Windows-1252 characters only) |

The content builder resolves country names to tags. Scripts refer to the two powers through generated triggers `zin_is_noris` and `zin_is_stabilo` and event targets `zin_east_noris` and `zin_east_stabilo` set on startup.

**The monthly update.** `zin_east.2` is a hidden country event that runs `zin_east_monthly`, then picks the event target `zin_east_runner` anew (Noris; Stabilo if Noris is gone; else the East Lands country with the most states) and schedules itself there in 30 days (`country_event = { id = zin_east.2 days = 30 }`), so the chain survives the runner's end.

**Pictures and icons.** Events use only pictures already in the game, and a gated picture only where its gate flag is already set (catalog rule 4, decision E5): `GFX_zin_evt_generic_peace` (.10, .20, .21, .23, .32), `GFX_zin_evt_generic_court` (.15, .16, .26, .40, .42, .70–.73), `GFX_zin_evt_houses` (.30), `GFX_zin_evt_council_chamber` (.31), `GFX_zin_evt_generic_wilds` (.35, .36), `GFX_zin_evt_eastern_court` (.50, .51, .52, .60; all fire after the flight, so its gate `zin_afrit_abandoned_aenor` is set), `GFX_zin_evt_generic_war` (.45, .46); news events use `GFX_zin_news_generic_peace` (.24, .27), `GFX_zin_news_generic_war` (.25, .43, .44) and `GFX_zin_news_generic_court` (.80, which can fire without the flight). The caravan picture `traders_road_south` is not used: its gate `zin_eindil_awake` is not set when these events fire. Ideas and decisions use catalog icons by full sprite name: `GFX_idea_zin_house_first_light` (temple loan), `_ship_voyage` (coalition ambition), `_banner_league` (Free Crowns), `_handshake_oath` (shared roads), `_caravan` (caravan war strain; road decisions), `_tribute_chest` (King's debt), `_banner_plain` (vindicated), `_crown_hailed` (united crown), `_envoy` (court decisions), `_ledger_coins` (Ledger), `_eye_watchful` (hub decisions), `_granary` (wells). Categories have no picture until the art pipeline adds one.

**Requested pictures** (proposed subjects; not catalog keys yet, so each event uses the fallback until the key is added through the icon catalog's "Adding a key"; [../05_focus_trees/02_icon_catalog.md](../05_focus_trees/02_icon_catalog.md)):

| Wanted key | Shows | Gate | Use until added | For |
| --- | --- | --- | --- | --- |
| `caravan_road` | A camel caravan on a desert road between two walled towns | — | `generic_peace` | .10, .20, .21, .32 (also asked by the Noris and Stabilo trees) |
| `desert_wells` | Diggers and camels around a stone well in deep sand | — | `generic_wilds` | .15, .16, .36 |
| `rift_sails` | Sails on a narrow sea seen from a wooded shore (already requested by the war events and the elves spec) | `zin_eastern_invasion` | `generic_sea` (news: `generic_war`) | .43 |
| `deep_sand` | A lone caravan walking into dunes under a white sky; nothing beyond is shown | — | `generic_wilds` | .35 |
| `caravan_roads_category` | The five roads drawn as threads on a sand-coloured map, no lettering | — | none (categories may stay without a picture) | category `zin_east_roads` |

### Variables

| Variable | Scope | Range | Start | Meaning |
| --- | --- | --- | --- | --- |
| `zin_east_rivalry` | global | 0–100 | 40 | Caravan rivalry |
| `zin_east_road_salt`, `_gold`, `_rift`, `_lake`, `_sand` | global | 0–2 | 1, 2, 0, 0, 0 | Charter holder |
| `zin_east_inf_salt`, `_gold`, `_rift`, `_lake`, `_sand` | Noris, Stabilo | 0–100 | table in section 1 | Road influence |
| `zin_east_charters` | Noris, Stabilo | 0–5 | 1 | Charters held (half for Concord roads) |
| `zin_east_caravan_bonus` | Noris, Stabilo | 0–3 | 0 | Monthly influence bonus from spirits |
| `zin_east_lean` | each East Lands court | -100–100 | table in section 3 | Lean to Furvior (+) or Postondoroth (−) |
| `zin_east_dominance` | Noris, Stabilo | 0–100 | computed | Share of the East |
| `zin_east_kneel_bias` | each East Lands country | -100–100 | computed | Eastern pressures toward kneeling |
| `zin_east_coalition_weight` | temp | — | — | Coalition selection |
| `zin_east_old_ideology` | each client | 0–3 | set at kneeling | Ruling ideology before kneeling: 0 Light, 1 Dominion, 2 Shadow, 3 Wild |
| `zin_east_cw_pp`, `zin_east_cw_trade`, `zin_east_cw_cg` | Noris, Stabilo | derived | derived | Inputs of `zin_east_caravan_wealth` |
| `zin_east_rule_roll` | global | 0–2 | set on startup when `zin_rule_ai_east` = RANDOM | 0 DEFAULT, 1 REFUSE_AFRIT, 2 UNITE_WITHOUT_AFRIT |

Every write goes through a scripted effect that clamps the range.

### Flags

| Flag | Kind | Set by |
| --- | --- | --- |
| `zin_eastern_invasion` | global (diplomacy spec name) | `zin_east.43` |
| `zin_east_coalition_formed` | global | `zin_east.41` |
| `zin_east_turns_west` | global | `zin_east.44` |
| `zin_east_roads_concord` | global | the Concord |
| `zin_east_caravan_war` | global, cleared at peace | `on_declare_war` / `on_peace` |
| `zin_east_united` | global | `zin_east_declare_united` |
| `zin_east_coalition_leader`, `zin_east_coalition_member` | country | coalition steps |
| `zin_east_in_crisis` | country, 365 days | charter lost, capitulation, stability < 30% (monthly check) |
| `zin_east_owes_temples` | country, 1,095 days | temple loan |
| `zin_east_rift_whispered` | country, 365 days | hub decision |
| `zin_east_rift_talk` | country | `zin_east.40` |
| `zin_east_pledged` | country | tree route focuses |
| `zin_east_free_crowns_leader` | country | `zin_east.51` |
| `zin_east_companies_with_eindil` | country | `zin_east.46` |
| `zin_east_sent_levies` | country | `zin_east.52` levies option; Noris's `zin_noris_riders_for_host` counts the same |
| `zin_east_wells_unlocked` | country | tree focuses |
| `zin_east_wells` | state | `zin_east_dig_wells`, events |

Read here, set by the trees: `zin_east_route_resist`, `zin_east_court_audit`, `zin_east_rift_ambition` (regional and shared trees), `zin_east_courts_noris`, `zin_east_courts_stabilo`, `zin_noris_*` and `zin_stabilo_*` route and branch flags (Noris and Stabilo trees). Set by other systems: `zin_afrit_eastern_client`, `zin_afrit_refused_east` (Afrit), `zin_story_war` (diplomacy's one-day story-war flag, set here before each declaration).

### Scripted triggers

| Trigger | Scope | True when |
| --- | --- | --- |
| `zin_is_noris`, `zin_is_stabilo` | country | generated tag checks |
| `zin_is_region_east_lands` | state | the state is in the frozen East Lands list |
| `zin_is_region_south_lands` | state | section 8 |
| `zin_is_site_road_salt`, `_gold`, `_rift`, `_lake`, `_sand` | state | the state is on that road |
| `zin_is_site_rift_east` | state | East Lands coastal state on the rift sea (generated from the sea regions between the Magical Lands and the East Lands) |
| `zin_is_site_rift_west` | state | Magical Lands coastal state on the rift sea |
| `zin_is_site_furvior`, `zin_is_site_postondoroth` | state | the two seats |
| `zin_east_is_court` | country | capital in the East Lands; not Noris or Stabilo |
| `zin_east_is_south_court` | country | section 8 |
| `zin_east_faces_rift` | country | owns a `zin_is_site_rift_east` state |
| `zin_east_caravan_war_open` | country (Noris or Stabilo) | rivalry ≥ 75, `zin_gathering_dark` ≥ 25 and `zin_east_after_caravan_war`; or `zin_war_of_last_crowns` |
| `zin_east_question_open` | any | `zin_afrit_king_of_east`, or `zin_eastern_invasion`, or (`zin_golden_king_dead` and `zin_east_after_rift_talk`) |
| `zin_east_after_caravan_war`, `_rift_talk`, `_early_coalition`, `_turn_west` | any | the date is past 1 Thaw 4A 1751, 1 Thaw 4A 1753, 1 Thaw 4A 1754, 1 Deepwinter 4A 1756, shifted by `zin_story_pace` (generated: one `date >` test per pace value) |
| `zin_east_rule_refuse`, `zin_east_rule_unite` | country | AI country and (`zin_rules_ai_branch_east_refuse_afrit` / `_unite_without_afrit`, or `zin_rule_ai_east` = RANDOM with `zin_east_rule_roll` 1 / 2) |
| `zin_east_free_crown` | country | has `zin_afrit_refused_east`, `zin_afrit_king_of_east` set, `zin_afrit_dead` not set |

### Scripted effects

| Effect | Scope | Args | Does |
| --- | --- | --- | --- |
| `zin_east_monthly` | runner | — | Influence drift, charters, wealth values, rivalry drift, lean drift, dominance, bias, crisis flags, dry-land modifiers on newly dry states; the `.15`, `.40`, `.41` checks; then calls the tree-declared `zin_noris_monthly` on Noris and `zin_stabilo_monthly` on Stabilo if they exist |
| `zin_east_add_road_influence` | Noris or Stabilo | `road`, `value` | Adds, clamps 0–100 |
| `zin_east_add_all_roads` | Noris or Stabilo | `value` | The above on all five roads |
| `zin_east_add_rivalry` | any | `value` | Adds, clamps 0–100; respects the Concord cap |
| `zin_east_add_lean` | court | `value` | Adds, clamps -100–100 |
| `zin_east_refresh_wealth` | Noris or Stabilo | — | Counts charters; sets `zin_east_cw_*` |
| `zin_east_update_bias` | East Lands country | — | Section 4 |
| `zin_east_update_dominance` | Noris or Stabilo | — | Section 3 |
| `zin_east_prepare_kneel` | court | — | Section 6: stores the ideology, leaves a faction, sets the former leader's opinion; for a subject of another country, military access to the Dominion instead |
| `zin_east_claim_road` | Noris or Stabilo | `road` | `add_state_claim` on every state of the road owned by the rival or a court of the rival's faction; only with a peace gate open |
| `zin_east_claim_rift` | coalition member | — | `add_state_claim` on every `zin_is_site_rift_west` state controlled by its side |
| `zin_east_offer_coalition_peace` | any | — | `zin_east.45` to every coalition member now, whatever the King of the East |
| `zin_east_grant_free_cb` | free crown | — | `zin_diplo_grant_cb` with `zin_cb_free_east` on the Worshipdom (the Dominion of the East) and on every country with `zin_afrit_eastern_client`, 1,825 days; removed early by `zin_east_after_the_king` |
| `zin_east_grant_high_king_cb` | Noris or Stabilo | — | `zin_diplo_grant_cb` with `zin_cb_high_king` on every valid target, 730 days |
| `zin_east_declare_united` | Noris or Stabilo | — | Section 7 |
| `zin_east_after_the_king` | any | — | Section 6: releases clients still subject to the Worshipdom, ideas, ideology restore, ends the Free Crowns causes, rivalry floor 50 |
| `zin_east_dig_wells_in` | state | — | State flag, swap modifiers, infrastructure +1 |
| `zin_east_wells_random` | country | — | `zin_east_dig_wells_in` on a random owned dry South Lands state |

**Arguments** (decision E1). Scripted effects take no parameters in 1.19.3: every call with arguments, here and in the trees, compiles to temporary variables `zin_arg_<name>` set just before the call (`zin_arg_value`, `zin_arg_road`). The keyword argument `road` is a number code: salt 1, gold 2, rift 3, lake 4, sand 5. Calls written `zin_afrit_add_footholds(1)` and `zin_stabilo_add_debt(10)` follow the same rule with their owners' argument names.

**Focus layouts** (decision E4). After its other work, `zin_east_monthly` runs `mark_focus_tree_layout_dirty` for every East Lands country, so tree branches that read this spec's variables in `available` refresh; `allow_branch` in the eastern trees holds only start-fixed conditions.

### Ideas (mechanic)

| Key | Name | Modifiers | Added / removed |
| --- | --- | --- | --- |
| `zin_east_temple_loan` | Generous Friends | political_power_gain 0.15, stability_factor 0.03 | Temple loan, 365 days |
| `zin_east_coalition_ambition` | Beyond the Rift | war_support_factor 0.05, army_attack_factor 0.05 | Joining the coalition; removed at peace with every Magical Lands realm |
| `zin_east_free_crowns` | The Free Crowns | army_defence_factor 0.05, stability_factor 0.03, war_support_factor 0.05 | Refusers, while the King of the East reigns |
| `zin_east_shared_roads` | The Concord of the Roads | consumer_goods_factor -0.03, trade_opinion_factor 0.10, political_power_gain 0.05 | Both powers, while the Concord holds |
| `zin_east_caravan_war_strain` | The Roads at War | consumer_goods_factor 0.03, war_support_factor 0.05 | Both powers, while at war with each other |
| `zin_east_kings_debt` | The King's Debt | stability_factor -0.05, political_power_gain -0.10 | Former clients, 730 days after `zin_afrit_dead` |
| `zin_east_vindicated` | Vindicated | stability_factor 0.05, war_support_factor 0.03 | Refusers, 730 days after `zin_afrit_dead` |
| `zin_east_united_crown` | The United East | political_power_gain 0.25, stability_factor 0.05, trade_opinion_factor 0.10 | `zin_east_declare_united` |

### Dynamic modifiers

| Key | Scope | Modifiers |
| --- | --- | --- |
| `zin_east_caravan_wealth` | country | political_power_gain = `zin_east_cw_pp`; trade_opinion_factor = `zin_east_cw_trade`; consumer_goods_factor = `zin_east_cw_cg` |
| `zin_east_dry_land` | state | supply_factor -0.25, truck_attrition_factor 0.25 |
| `zin_east_wells` | state | supply_factor 0.10, local_resources_factor 0.10 |

### Opinion modifiers

| Key | Value | Notes |
| --- | ---: | --- |
| `zin_east_charter_lost` | -15 | loser → winner; decays 1 a month |
| `zin_east_court_gifts` | +15 | court → giver; decays 0.5 a month |
| `zin_east_wells_quarrel` | -10 | both ways after `zin_east.15`; decays 1 a month |
| `zin_east_concord` | +30 | Noris ↔ Stabilo while the Concord holds |
| `zin_east_free_crown_kin` | +20 | among refusers |
| `zin_east_knelt` | -25 | refuser → client; former faction leader → client |

Opinion modifiers decay through the engine's `decay` field. The start rivalry opinion between Noris and Stabilo is the start situation's `zin_opinion_caravan_rivalry` (−25; decision N5). This spec does not define it.

### Decisions

**Category `zin_east_roads` (The Caravan Roads)**, visible to Noris and Stabilo. Shows the five roads, holders and influence through scripted localisation.

| Key | Available | Cost | Effect | AI |
| --- | --- | ---: | --- | --- |
| `zin_east_send_caravan_<road>` (five) | the road's charter is not own; 60-day cooldown each | 30 PP | own influence +8 on that road | roads where own influence is 45–75 first |
| `zin_east_buy_road_lords` (targeted: a court owning a road state) | 120-day cooldown per target | 50 PP | lean +10 toward self; own influence +4 on each road through the target | courts on contested roads |
| `zin_east_undercut_rival` | rivalry < 90; 120-day cooldown | 50 PP | the rival -5 influence on every road where both are 20+; rivalry +3 | only when rivalry < 60 or under FREE |
| `zin_east_talks_at_the_wells` | rivalry ≥ 20; not at war with the rival; 365-day cooldown | 75 PP | `zin_east.20` to the rival | when rivalry ≥ 70, except under `zin_rules_is_historical` after `zin_east_after_rift_talk` (the last two years before the war) |
| `zin_east_concord_of_the_roads` | rivalry ≤ 15; no Concord; at peace with the rival | 100 PP | `zin_east.23` to the rival | always when available |
| `zin_east_dig_wells` (state-targeted) | `zin_east_wells_unlocked`; owned South Lands state without wells; 30-day cooldown | 40 PP | `zin_east_dig_wells_in` | states on own roads first |

**Category `zin_east_courts` (Courts of the East)**, visible to Noris with `zin_east_courts_noris` and Stabilo with `zin_east_courts_stabilo` (tree flags). Targets: `zin_east_is_court`, not at war with the actor.

| Key | Requires | Cost | Effect | Cooldown |
| --- | --- | ---: | --- | --- |
| `zin_east_court_envoys` | — | 25 PP | lean ±10 toward the actor | 120 days per target |
| `zin_east_court_gifts` | `zin_noris_envoys` / `zin_stabilo_envoys` | 50 PP | lean ±15; `zin_east_court_gifts` | 365 days per target |
| `zin_east_invite_to_league` | `zin_noris_open_treaty` and lean ≥ 50 / `zin_stabilo_open_pact` and lean ≤ -50; target in no faction | 25 PP | `zin_east.70` | 180 days per target |
| `zin_east_offer_protection` | Noris `zin_noris_banner` or `zin_noris_route_high_king` / Stabilo `zin_stabilo_pact_under_prince` or `zin_stabilo_route_empire`; |lean| ≥ 80 (≥ 60 on a unification route) | 100 PP | `zin_east.71` | 365 days per target |
| `zin_east_rally_free_crowns` | `zin_east_free_crowns_leader`; target `zin_east_free_crown`, in no faction | 25 PP | `zin_east.70` (Free Crowns text) | 90 days per target |

`zin_east_rally_free_crowns` is visible to any First of the Free Crowns, not only Noris and Stabilo.

**Category `zin_east_ledger` (The Ledger of the East)**, visible to Stabilo with `zin_stabilo_ledger_open`. Its four decisions (Lend, Great Loan, Call In a Debt, Forgive a Debt) are specified in [../05_focus_trees/major/stabilo.md](../05_focus_trees/major/stabilo.md) and implemented in this spec's decision file, because the focus compiler writes no decision files.

### Events (namespace `zin_east`)

| Id | Title | For | Trigger | Options (AI) |
| --- | --- | --- | --- | --- |
| .1 | (hidden) The Roads Open | runner | on_startup | Variables, charters, leans, event targets, dry-land modifiers |
| .2 | (hidden) The Caravan Month | runner | every 30 days | `zin_east_monthly` |
| .10 | A Charter Changes Hands | Noris, Stabilo, courts on the road | charter change | Acknowledge (winner: "The road is ours"; loser: "We will win it back") |
| .15 | Trouble at the Wells | Noris or Stabilo | rivalry ≥ 60; MTTH 240 days | Punish the raiders: rivalry +3, war support +2% (AI 40) / Pay the blood-price: -25 PP, rivalry -2 (AI 40) / Ask for a joint inquiry: fires `.16` (AI 20) |
| .16 | A Joint Inquiry | the rival | `.15` | Agree: rivalry -3 (AI 50, ×0.5 at rivalry ≥ 80) / Refuse: rivalry +2, `zin_east_wells_quarrel` |
| .20 | Talks at the Wells | the rival | `zin_east_talks_at_the_wells` | Talk: rivalry -10, opinion +10 both (AI 60, ×0.3 if its charters < the proposer's) / Refuse: rivalry +3 |
| .21 | The Answer from the Wells | proposer | after `.20` | Result text |
| .23 | A Concord of the Roads | the rival | `zin_east_concord_of_the_roads` | Sign (AI 80) / Not yet (rivalry +3) |
| .24 | The Concord of the Roads | all East Lands (news) | Concord signed | Acknowledge |
| .25 | The Caravan War | all East Lands (news) | Noris and Stabilo at war | Acknowledge |
| .26 | Terms at the Wells | the losing power | tree Caravan Peace focus | Yield the claimed road states (`transfer_state`; white peace) (AI 70 if it controls under half its core states) / Fight on |
| .27 | The Caravan Peace | all East Lands (news) | `.26` yield | Acknowledge |
| .30 | The Generous Friends Offer a Loan | court | section 4 | Accept / Decline / Borrow from Postondoroth |
| .31 | Report of the Eastern Branch | hub (private; `zin_afrit_is_hub`) | `zin_east_report` | One option; names the master only through `[zin_loc_deliverer]` |
| .32 | A Debtor Comes to Postondoroth | Stabilo | `.30` third option | Acknowledge |
| .35 | Into the Deep Sand | Noris, Stabilo or a South Lands court | tree expedition focuses | Mark the wells / Sell the stories |
| .36 | Dry Wells | South Lands court | MTTH 540 days | Dig deeper / Ration the water |
| .40 | Envoys Speak of the Rift | courts with footholds 3+ | section 5 step 1 | "Rich lands, weak kings" (flag) / "Old tales" (political power +10) |
| .41 | (hidden) The Coalition Gathers | runner | section 5 step 2 | Selection |
| .42 | The Eastern Coalition Asks | candidate courts | `.41` | Join (AI = weight) / Stay out |
| .43 | The Crossing of the Rift | all (news) | 30 days after `.41` | Acknowledge |
| .44 | The Host Turns West | all (news) | section 5 step 5 | Acknowledge |
| .45 | The Coalition Breaks | coalition members that refused the King; any member when a tree calls `zin_east_offer_coalition_peace` | `zin_afrit_king_of_east`, or that effect | Make peace (AI 70 for refusers, 30 for others; +20 with `zin_stabilo_bought_off`) / Fight on |
| .46 | Abandoned Companies | eastern countries at war in the Middle or Magical Lands | `zin_eindil_returned` | Let them serve the stranger / Order them home |
| .50 | A King in the East | East Lands courts that were not candidates | 30 days after the proclamation | Send gifts / Refuse him / Keep silent |
| .51 | First of the Free Crowns | the chosen refuser | section 6 | "We stand together" |
| .52 | The King Calls His Host | clients | `zin_afrit_returned` | Send levies / Send gold / Delay |
| .60 | The King of the East Is Fallen | every East Lands court | `zin_afrit_dead` | Text by status (client, refuser, neither) |
| .70 | An Invitation from Furvior / Postondoroth / the Free Crowns | target | invite decisions | Join (AI = |lean| − 20, borders +20, borders the rival −30; Free Crowns 70) / Decline (lean −10 toward the inviter) |
| .71 | An Offer of Protection | target | `zin_east_offer_protection` | Accept (inviter `puppet`s the target) / Refuse (lean −20 toward the inviter) |
| .72 | The Answer of the Courts | inviter | after `.70` / `.71` | Result text |
| .73 | The High King Asks Homage | a great kingdom | unification focuses | Pay homage (`.71` accept) (AI = |lean| − 20) / Refuse (the asker gains claims on its road states) |
| .80 | The East United | all (news) | `zin_east_declare_united` | Acknowledge |

**The secret** (decisions D1, D3). Before `zin_afrit_revealed`, every text calls him "the Deliverer", "King Aurevan" or "the King of the East" through `[zin_loc_deliverer]` (the names spec's two-face label, decision N16); no text visible to a non-hub country names the Hidden Council or the eastern branch, and no key in `zin_east_l_english.yml` contains the word "Afrit" or "demon" in any form (the name only ever arrives through `zin_loc_deliverer`, which switches at the reveal). Hub-only texts (`zin_east.31`, the three hub decisions) sit behind `zin_afrit_is_hub`.

### Game rules

No new rule. `zin_rule_ai_east` (defines and rules spec; group `RULE_GROUP_ZIN`, first option `DEFAULT`, decision R1; its options read "Refuse the Deliverer" and "Unite without the Deliverer" on the rule screen). Rules act only on AI countries, never on a player's.

| Option | Effect on AI eastern courts |
| --- | --- |
| `DEFAULT` | Follows `zin_rule_historical_path`. HISTORICAL: kneeling by the Afrit table plus bias, with the Afrit spec's auto-accept; coalition with at least two members; at least two refusers; no Caravan War before the war; unification route weight 0. PLAUSIBLE: as HISTORICAL with unification weight 10. FREE: every weight as written. |
| `REFUSE_AFRIT` | Bias -100 for every AI eastern court (`zin_east_rule_refuse`); pledging routes weight 0. The coalition still forms. |
| `UNITE_WITHOUT_AFRIT` | As REFUSE_AFRIT (`zin_east_rule_unite`); the AI power with the higher `zin_east_dominance` (ties: Noris) takes its unification route (weight 1000); the other takes its resist route. |
| `RANDOM` | On startup `zin_east.1` rolls 0–2 with `random_list` and stores it in `zin_east_rule_roll` (DEFAULT, REFUSE_AFRIT or UNITE_WITHOUT_AFRIT for the whole game); `zin_east_rule_refuse` and `zin_east_rule_unite` read the roll. |

### Defines

None.

### Map and site dependencies

This spec's sites are computed by this module (above) from the map and handed to the key-sites module as rows (decision E7); the key sites table ([../01_map/02_key_sites.md](../01_map/02_key_sites.md)) owns and lists them: `zin_is_site_furvior`, `zin_is_site_postondoroth`, `zin_is_site_road_<key>` (five), `zin_is_site_rift_east`, `zin_is_site_rift_west`, and the region triggers `zin_is_region_east_lands`, `zin_is_region_south_lands`. Postondoroth should be Stabilo's capital (map row S5); until then the trigger follows the victory point (section "Geography").

## AI

- **Startup** (`add_ai_strategy`): Noris and Stabilo `antagonize` each other (20); Noris `befriend` Gondolin, Mylunur, Mora; Stabilo `befriend` Drak, Plutondo, Obmi; both `befriend` Alerhia (10).
- **Roads.** Each power sends a caravan whenever a road it does not hold has its influence between 45 and 75, and buys road lords on contested roads once a year.
- **Courts.** Envoys to the three highest-lean courts first; invites at the threshold; never invites a court the rival guarantees.
- **Rivalry.** Before the war the AI undercuts only when rivalry is below 60; it proposes talks at rivalry 70 or more; it proposes the Concord whenever available.
- **Caravan War.** Under the historical path the AI never takes the Caravan War focus before `zin_war_of_last_crowns`, and then only if one power is a client and the other a refuser. Under FREE it weighs relative strength (factories and divisions) ×2 when stronger.
- **Coalition.** The AI joins by weight. On the crossing every member gets `add_ai_strategy` `conquer` 80 toward each target (historical path checkpoint 14). A coalition leader keeps at least 60% of its divisions on the rift front until `zin_east_turns_west` (`front_unit_request` toward the targets); after it, `conquer` 100 toward Aenor.
- **Free Crowns.** Refusers bordering the Dominion of the East or a client get `prepare_for_war` toward it; the First of the Free Crowns invites every refuser.
- **After the King.** Former clients and refusers lose all war strategies against each other after `zin_afrit_dead` + 180 days, unless they are already at war.

## Acceptance

Each item says how it is decided: **(a)** build test in `tools/content/mech_eastern_kings.test.mjs` (`npm test` in `tools/`); **(b)** the isolated Linux run (one in-game year at the end of phase 3, decision S8; longer observer runs where named); **(c)** a scripted scenario with HOI4 Agent Tools (`hoi4_scenario_test` / `hoi4_mechanic_test`) on the mod source.

1. **(a)** The staged tree contains every file in the Files table; every `zin_east_*` effect, trigger, idea, dynamic modifier, opinion modifier, decision and event id is defined exactly once; every id this spec references is defined in the staged tree (the build's C3 check passes); every event and decision has its localisation keys.
2. **(a)** The generated lists are non-empty and stable: 337 East Lands states (or the current count from `countries.json`, asserted equal); each road is a connected chain of East Lands states that contains its waypoint states; `zin_is_site_rift_east` and `_west` are non-empty; the South Lands list is printed and every state in it is an East Lands state; a second build yields byte-identical files.
3. **(a)** No string in `zin_east_l_english.yml` contains "Afrit", "demon" or "Sunhot"; every player-visible text that names the Deliverer does so through `[zin_loc_deliverer]`; no `zin_east` file contains a retired name of the contract register (the names check); the only texts that mention the Council or the eastern branch belong to `zin_east.31` and the three hub decisions, all gated by `zin_afrit_is_hub`.
4. **(a)** No `zin_east` script contains a literal date comparison other than inside the generated `zin_east_after_<key>` triggers, and those hold three dates each (one per story pace).
5. **(a)** Every modifier key used is in `modifiers_documentation.md` of 1.19.3 (`political_power_gain`, `trade_opinion_factor`, `consumer_goods_factor`, `supply_factor`, `truck_attrition_factor`, `local_resources_factor`, `stability_factor`, `war_support_factor`, `army_attack_factor`, `army_defence_factor`, `generate_wargoal_tension_against`); every effect and trigger used is in the effect and trigger documentation; the HOI4 Agent Tools script validator reports no errors for the generated files.
6. **(b)** A new game (after the calendar is built: 1 Thaw 4A 1748): rivalry 40; charters Salt = Noris, Gold = Stabilo, Rift, Lake and Sand free; influences and leans as tabled; no East Lands country at war, justifying a war goal or holding a claim; every South Lands state without wells has `zin_east_dry_land`.
7. **(c)** Every `declare_war_on`, `create_wargoal` and `add_state_claim` in `zin_east` files and the Noris and Stabilo trees is unreachable on day one (scenario run with the start flags; the peace gates hold).
8. **(c)** Raising a road's influence by effect flips the charter by the rules, fires `zin_east.10` and changes `zin_east_charters`; `zin_east_caravan_wealth`'s inputs follow the charter count.
9. **(c)** `zin_east.15` can fire only at rivalry 60 or more; the Caravan War focus is unavailable at rivalry below 75, at `zin_gathering_dark` below 25, or before `zin_east_after_caravan_war`.
10. **(c)** With `zin_war_of_last_crowns` set under HISTORICAL: `zin_east.41` forms a coalition with at least two members besides the leader; `zin_eastern_invasion` is set 30 days later, each target owns a `zin_is_site_rift_west` state, and `zin_story_war` was set before each declaration; `zin_east_turns_west` follows by the shifted 1 Deepwinter 4A 1756.
11. **(c)** With `zin_afrit_king_of_east` set and two courts kneeling through `zin_afrit.51`: each kneeling court that was nobody's subject is a subject of the Worshipdom with `zin_autonomy_eastern_client` and in no faction; a kneeling subject of Noris stays Noris's subject and gives military access; under HISTORICAL at least two East Lands countries carry `zin_afrit_refused_east` after `zin_east.50`.
12. **(c)** Setting `zin_afrit_dead`: every client is released, carries `zin_east_kings_debt` and is back on its stored ideology; refusers carry `zin_east_vindicated`; `zin_east_free_crowns` and `zin_cb_free_east` are gone; rivalry is at least 50.
13. **(c)** With `zin_rule_ai_east` = REFUSE_AFRIT, no AI East Lands court kneels in `zin_afrit.51` and the coalition still forms; with UNITE_WITHOUT_AFRIT, the power with the higher dominance takes its unification route.
14. **(b)** The one-year Linux run at the end of phase 3 produces no new error.log lines from `zin_east` files, and the monthly runner fires twelve times (one hidden `zin_east.2` a month, logged by the test harness).
15. **(b)** The 12-year historical observer run (`zin_rule_historical_path` = HISTORICAL, the run the world tension spec calibrates on), when the Afrit, world and Eindil systems exist: no war between Noris and Stabilo before `zin_war_of_last_crowns`; checkpoint 14 historical; at least two clients and two refusers in 4A 1756; `zin_east.46` fires on `zin_eindil_returned`; after `zin_afrit_dead` former clients carry `zin_east_kings_debt`. With UNITE_WITHOUT_AFRIT, `zin_east_united` is set in at least one of five such runs by 4A 1760.
16. **(a)** Every event sets `timeout_days = 30`; no `zin_east` event uses `traders_road_south`, and `eastern_court` only in `.50`, `.51`, `.52` and `.60`; no file defines `zin_lore.191`; `zin_sites.txt` holds this module's site rows exactly once; `zin_east_monthly` contains `mark_focus_tree_layout_dirty`.

## Open questions

Every question below is in [OPEN_QUESTIONS.md](../OPEN_QUESTIONS.md) (section "east lands" and the owner's short list); the work proceeds on the stated proposal.

1. **Which eastern kings join Afrit willingly** is open in the vault (short list 11; east lands 1). Proceeding on: each game decides by footholds, the kneel bias, crises and choices; no court is fixed.
2. The five roads (Salt, Gold, Rift, Lake, Sand), their names and routes (east lands 8). Proceeding on the five roads as written.
3. Postondoroth sits in Drak's land on today's map (east lands 2). Proceeding on moving Stabilo's capital there (map spec S5); until then the site trigger follows the victory point.
4. The South Lands: on-map desert band or beyond the map (short list 6; east lands 3). Proceeding on the on-map desert of the East Lands, running on off the map.
5. Is the Concord of the Roads an acceptable play outcome, given that the rivalry "never fully ends" (east lands 9)? Proceeding on yes, capped at five years.
6. Is Kessarion Corvel's man in the East (east lands 7)? Proceeding on yes.

Settled since the draft: where the King of the East sits and what eastern clients are (decisions S1 and O5: the Worshipdom as the Dominion of the East; kneeling courts become `zin_autonomy_eastern_client` subjects, never members of a faction); which start opinion stays (decision N5: `zin_opinion_caravan_rivalry`); the temple loan's single owner (O4: `zin_east.30`).
