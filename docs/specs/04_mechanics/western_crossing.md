# The West Lands and the Western Crossing

**Status:** Ready. Reviewed 19 October 2026 against CONVENTIONS "Status"; integrated 19 October 2026. **Priority:** 3. **Phase:** 3. Built by `tools/content/modules/mech_western_crossing.mjs`; depends on the calendar ([../00_foundation/01_start_and_calendar.md](../00_foundation/01_start_and_calendar.md)) being built, because every date below is an Erdae engine date (the game still starts 1936.1.1.12 today).

## Purpose

The West Lands are two dozen kingdoms, republics and companies south of the Cold Lands, across the wide central sea from Aenor. Their Fourth Age story runs from a weary truce at home to an invasion of the Middle Kingdom, and from the capture of Parim to soldiers stranded beside the people they conquered. This spec defines the mechanic that carries that story:

- **The old grudge** (`zin_west_grudge`): how much each western court resents Aenor's old conquests and present tariffs.
- **The Truce of the Grey Ford** (`zin_west_truce`): the fragile peace between Gunwaith and Girdon, how it breaks, and the Grey Ford Feud.
- **Eindil's temporary war-kingship**: how the western side of the journey's stage 3 feeds the West's unity.
- **The Ford Council and the West's course** (`zin_west_unity`, `zin_west_resolve`): whether the West stays divided, crosses the sea for revenge, or sails to Aenor's defence.
- **The fleet** (`zin_west_fleet`): ships enough to cross a sea much wider than the old maps drew.
- **The Western Crossing**: the pledges, the faction, the sailings and the landings.
- **Taking Parim**, the occupation strain, **the evacuation**, **the stranded armies**, and their place in **Eindil's coalition**.

The focus tree [../05_focus_trees/major/gunwaith.md](../05_focus_trees/major/gunwaith.md) drives most of it. The other western courts act through events and decisions here and through their regional trees ([../05_focus_trees/regional/west_lands.md](../05_focus_trees/regional/west_lands.md): Girdon, Lambin, Buldor, Kradlon, Corogon, Varnondor; the shared West Lands tree). Shared names come from [00_shared_contract.md](00_shared_contract.md) and [00_contract_additions.md](00_contract_additions.md).

The Crossing meets the Treaty of the Narrow Strait ([lerendor_narrow_strait.md](lerendor_narrow_strait.md)) in three places, and both specs say the same thing: the West's declaration of war on Aenor is a defensive war for Aenor, so it can fire Lerendor's call to honour the treaty (`zin_leren.20`); Lerendor's route changes the West's resolve (section 4); and the West sails across the central sea, not through the Narrow Strait, so closing the strait never stops a sailing (section 7).

## Lore basis

| Fact | Status | Source |
| --- | --- | --- |
| The West Lands lie south of the Cold Lands, joined by a broad neck; Gunwaith, Girdon, Kradlon, Corogon, Varnondor | established | *Erdae and Its Regions* |
| The central sea between the West Lands and the Middle Lands is much wider than drawn; this is why Aenor's conflicts with the West persist | established (owner) | *Fourth Age Map of Erdae* |
| In the First Age Aenoran settlers, colonies and claims reached the West Lands, which already had their own kingdoms, and caused repeated wars; the grievance survives. Every western court remembers that Aenor once tried to rule it; the chronicle speaks of "ancient Aenoran conquests" | established | *The First Age of Erdae*, *The Campaign of 4A 1748*, *The Fourth Age of Erdae* §IX |
| Aenor Isle lies off the Middle Lands' west coast, is part of the Middle Lands and includes Asgard | established | *Erdae and Its Regions* |
| Gunwaith and Girdon are rivals | established | *The Campaign of 4A 1748* |
| Gunwaith clans, Girdon wardens and Buldor companies are peoples of men | established | *Peoples of Erdae* |
| Eindil is taken south by West Lands travellers, makes peace between rivals and is chosen temporary war-king by several rulers of one western confederation; he lays the title down once the peace is secured | established | *The Fourth Age of Erdae* §IV, *Fourth Age Canon Register* |
| Western kingdoms plan a great crossing to end their ancient rivalry with Aenor; Eindil warns of it | established | *The Fourth Age of Erdae* §VIII |
| Western fleets cross the enlarged central ocean; some kings seek revenge, others want the capital before a weakened kingdom can threaten them again; the army lands, seizes ports, occupies the capital and claims the human throne | established | *The Fourth Age of Erdae* §IX, *War of the Last Crowns* |
| Aenor's defenders retreat toward the western-held capital; western commanders accept surrenders; Zol's dead and Volgan make the occupation impossible; the western fleet prepares to evacuate; some soldiers escape, others are stranded beside the Aenorians they conquered | established | *The Fourth Age of Erdae* §IX |
| Stranded western soldiers join Eindil's temporary coalition; he does not demand that the western kingdoms give up their independence; competing western interests remain | established | *The Fourth Age of Erdae* §X, *War of the Last Crowns* |
| The Gunwaith–Girdon wars from about 4A 1702; the Truce of the Grey Ford in 4A 1745; the Western Crossing in 4A 1755; Parim taken in 4A 1756 | proposed dates | *Fourth Age Chronology* |
| The names Truce of the Grey Ford, Grey Ford, Bridge of the Three Oaths, Girdon's Winter Ford, the Gunwaith trial; the epithets "the Man from the Ice" and "the King Without a House" | proposed | *Fourth Age Chronology*, *The Fourth Age of Erdae* §IV ([02_lore/03_names_and_terms.md](../02_lore/03_names_and_terms.md)) |
| The West can stay divided, cross for revenge, or join the defence; "a western crown holds Parim" as a play outcome | proposed (play choices, not history) | *The Campaign of 4A 1748* |

**Proposed by this spec:** the grudge, truce, unity, resolve, fleet and strain measures; the Grey Ford Feud as a border war; the Ford Council; the pledges and sailings; the landing on Aenor Isle; the evacuation ports; every number, event and decision.

**Kept open** (text never answers): where exactly the fleets crossed and landed (the vault lists it as open; the landing sites below are gameplay sites, labelled proposed); which western ruler claimed the human throne; which rulers made Eindil war-king (the journey spec builds the Grey Ford Confederation from regard); what becomes of the exiled westerners after the war (*The Fourth Age of Erdae*, follow-up 9); the scope of Aenor's early rule in the West and what Aenor still claims there (*The First Age of Erdae*, open question 10). Before `zin_afrit_revealed` no text names Afrit; Aenor's god-king is "King Aurevan" or "the Deliverer" (decisions D1, D3).

## Design

### The situation on 1 Thaw 4A 1748

The West is at peace. Gunwaith and Girdon keep the Truce of the Grey Ford, signed three years ago after half a century of border war. Kradlon, Corogon, Varnondor, Lambin and the Buldor companies trade with Aenor across the wide sea and resent its tariffs. Every court remembers the old conquests, but as a grudge spoken over wine. No western court plans a war on anyone. Nothing in this spec can start a war in 4A 1748 (see [Peace gates](#peace-gates)).

Start state written by the [start situation](../02_lore/01_start_situation.md) and used here: opinion `zin_opinion_old_claims` ("Old Claims Remembered", −15, every West Lands country toward Aenor); opinion `zin_opinion_grey_ford_truce` ("Truce of the Grey Ford", −10, Gunwaith and Girdon both ways); the engine truce between Gunwaith and Girdon (`set_truce`, 730 days, to 1 Thaw 1750); spirit `zin_west_old_claims` on every West Lands country. This spec adds no pact at the start (owner question 4 proceeds on "the engine truce is enough").

**What exists today (commit ca01fa3).** None of the four start items above is in the game yet: the vanilla-removal module defines only three start opinions (`zin_opinion_caravan_rivalry`, `zin_opinion_old_estrangement`, `zin_opinion_cold_rivalry`), and no country carries a `zin_region_<key>` flag. This mechanic depends on the start-situation build and on the economy spec's region flags; its build test fails, naming the missing key, if any of them is absent from the staged tree. It creates no country tag (the tag total stays at 380 of the 439 the flag sheet allows) and replaces no interim stub: the interim Long Peace tree, `zin_world` events and `zin_interim_category` stay until their own specs replace them.

**"West Lands country"** means a country with the economy spec's country flag `zin_region_west_lands` (21 countries, 86 states on today's map). **The Aenor realm** means a country for which the Aenor spec's `zin_aenor_is_realm` is true. **The foe** is the Aenor realm the Crossing declared war on, stored as global event target `zin_west_foe` at the launch (section 7); before the launch, events "to the Aenor realm" go to the Aenor realm that controls Parim (`zin_is_site_parim`), or to Aenor's own tag if none does.

**Dates and story pace.** Dates marked *(paced)* are historical floor dates; per decision V4 they read `zin_story_pace`: a date *d* becomes 1748.3.1 + (*d* − 1748.3.1) × pace, and the builder writes the three shifted dates into one scripted trigger per date (`zin_west_past_<key>`, section Implementation). Unmarked dates are peace gates and never move.

### 1. The old grudge (`zin_west_grudge`)

Each West Lands country carries `zin_west_grudge` (0–100): how much it resents Aenor. It is the main input to the West's resolve and to each court's answer when the Ford Council calls for a crossing.

**Start values (proposed):**

| Country | Grudge | Why |
| ---: | ---: | --- |
| Kradlon | 60 | Its guild workshops pay the heaviest Aenoran duties |
| Gunwaith | 55 | The northern crown; the old claims of Parim are a living insult |
| Corogon | 50 | Trading republic squeezed by Parim's tariffs |
| Varnondor | 45 | Guards the sea approaches the old Aenoran fleets used |
| Lambin | 45 | |
| Girdon | 40 | Busy with Gunwaith; Aenoran gold paid for its war |
| Buldor | 35 | Its companies serve whoever pays, Aenor included |
| every other West Lands country | 40 | |

**Monthly drift** (applied by `zin_west_monthly`):

| Source | Per month |
| --- | ---: |
| `zin_gathering_dark` ≥ 40 (fear makes old wounds ache) | +0.2 |
| Spirit `zin_west_aenoran_gold` on the country (Aenor's subsidy) | −0.5 |
| Country flag `zin_eindil_heeded` | −0.2 |
| Toward 40 when nothing else applies (only above 70 or below 20) | ±0.1 |

**One-off changes:**

| Cause | Change |
| --- | ---: |
| Aenoran tariff event `zin_lore.141` ([02_lore/04_fourth_age_history_for_play.md](../02_lore/04_fourth_age_history_for_play.md)): grumble / pay | +3 / +1 |
| Economy event "Western Tariffs": protest / pay | +5 / +2 |
| Aenor's decision "Subsidise a Western Court" ([economy](../03_gameplay/02_economy.md)) on the country | −10, and spirit `zin_west_aenoran_gold` for 180 days |
| `zin_west.10` (tariff protest; the protester is FROM: Gunwaith's *No Tariff Without Answer* or Kradlon's *The Guilds' Petition*) answered: lower / refuse | −10 / +10 on the protester |
| `zin_aurevan_crowned` (event `zin_west.15`) | +5 on every West Lands country |
| Heeding Eindil's warning (option "Heed the warning" of journey event `zin_eindil.83`, which sets country flag `zin_eindil_heeded`) | −15 on that country, applied by the monthly pulse the first month it sees the flag (country flag `zin_west_heed_counted` stops a repeat) |
| Focus effects | see the Gunwaith and West Lands trees |

All changes go through `zin_west_add_grudge` (one country) or `zin_west_add_grudge_all` (every West Lands country). Values clamp to 0–100. The other specs' events above call these effects in their own options (dependency list).

### 2. The Truce of the Grey Ford (`zin_west_truce`)

`zin_west_truce` (global, 0–100, start 40) is how firmly the truce between Gunwaith and Girdon holds. It exists only while global flag `zin_west_truce_broken` is not set.

**Drift** (monthly, proposed): −0.5 base (raids, old feuds); −0.5 while Gunwaith has spirit `zin_gunwaith_war_thanes`; +0.5 while Gunwaith has `zin_gunwaith_kings_peace`; +0.3 while the Ford Commission sits (flag `zin_west_ford_commission`); −0.3 while `zin_gathering_dark` ≥ 25.

**Raids at the ford.** While truce < 50, `zin_west.21` *A Raid at the Ford* fires to Gunwaith or Girdon (alternating; global flag `zin_west_raid_girdon_next` records whose turn it is) with mean time 240 days: answer in kind (truce −10, war support +2 %; AI 40, ×3 for Gunwaith with `zin_gunwaith_war_thanes`, historical ×3 for Gunwaith), pay the blood-price (−25 PP, truce +5; AI 40), or, with the Ford Commission sitting, refer it to the commission (truce +3; AI 60).

**The truce breaks** (`zin_west_break_truce`) at the first of:

| Path | When |
| --- | --- |
| Truce reaches 0 (Gunwaith's war-thanes, raids answered in kind and *Answer the Ford Raids* drive it down) | any time after 1 Thaw 1749 (`1749.3.1`) |
| Historical rule (`zin_west_historical`) | 1 Rainwake 1750 (`1750.4.1`, *paced*), if not broken earlier; checked by the monthly pulse |
| Either side's decision `zin_west_end_the_truce` (needs truce ≤ 20 and `zin_gathering_dark` ≥ 25) | any time after 1 Thaw 1750 (`1750.3.1`). A border war is not a declared war, and the decision needs the Gathering Dark at 25, so the diplomacy spec's peace-breaker rule never applies to it |

**Who broke it.** The attacker in the border war is the country in scope when the truce reaches 0, if that is Gunwaith or Girdon (the side that answered a raid in kind, took the focus or took the decision); otherwise, and always on the historical rule, Gunwaith. Global flag `zin_west_feud_girdon_attacked` records it when Girdon attacks, so `cancel_border_war` and `has_border_war_between` name the states the right way round. Owner question 5 proceeds on "Gunwaith's war-thanes break it".

Gunwaith's focus *Blood at the Grey Ford* follows the break; it never causes it. `zin_west_break_truce` does:

1. Sets global flags `zin_west_truce_broken` and `zin_west_grey_ford_war`.
2. Removes `zin_opinion_grey_ford_truce` both ways and adds `zin_west_ford_blood` (−30, both ways, decays 1 a month); grants `zin_cb_broken_truce` both ways for 730 days through `zin_diplo_grant_cb` (args `cb`, `target`, `days`). A border war is not a declared war, so the engine truce (to 1 Thaw 1750) should not block it; acceptance 11 decides it in the Linux run. If the engine does block it, the truce-at-0 path is gated to 1 Thaw 1750 in the same build.
3. Starts **the Grey Ford Feud**, a border war (`start_border_war`) between the Gunwaith state and the Girdon state of `zin_is_site_grey_ford` (the key-sites rows `zin_is_site_three_oaths` and `zin_is_site_winter_ford`, ids in `global.zin_site_three_oaths` and `global.zin_site_winter_ford`; `change_state_after_war = no`; `minimum_duration_in_days = 60`; `combat_width = 80`; `num_provinces = 4` a side; the attacker's `on_win` and the defender's `on_lose` fire `zin_west.23` with the attacker as winner, the other two the reverse; both `on_cancel` fire nothing). A border war keeps the conflict local: Girdon has two states and cannot be overrun in a season, which matches a feud a third party must end.
4. Fires `zin_west.22` *Blood at the Grey Ford* to both sides and news `zin_west.25` to every West Lands country; unity −10.
5. The journey reads `zin_west_grey_ford_war` as "a war between West Lands countries is running" and fires *The Grey Ford Breaks* (`zin_eindil.30`, journey stage 3).

**How the feud ends** (`zin_west_end_ford_war`, argument `how`, the single exit; it fires news `zin_west.26` *Peace at the Ford*):

| Ending | Trigger | Effect |
| --- | --- | --- |
| **The war-king's peace** (historical; `how = peace`, code 0: a call that sets no argument, as the journey makes it, leaves `zin_arg_how` at 0 and takes this row) | journey event `zin_eindil.33` *The War-King's Terms*, both belligerents accept | `cancel_border_war`; clears `zin_west_grey_ford_war`; unity +25; every confederation member's grudge −5; truce is not restored, but the journey spirit `zin_eindil_war_kings_peace` holds both sides for 730 days; non-aggression pact (`diplomatic_relation`, `relation = non_aggression_pact`; it has no engine expiry); `zin_west_ford_blood` removed both ways; `zin_west_old_claims` removed from every confederation member |
| **The feud is decided** (`how = decided`) | the border war ends with a winner: `zin_west.23` (hidden) | Winner war support +5 %, loser stability −5 %; unity −5; `zin_west.24` *After the Feud* to both: make peace (non-aggression pact, unity +5; AI 60, historical 100) or stay hostile (keeps the casus belli; AI 40) |
| **Gunwaith escalates** (`how = escalated`) | Gunwaith's *Girdon Must Bend* focus; never on the historical path | `cancel_border_war`; clears the flag; a full war follows only from that tree's war focus |

The journey's *The War-King's Terms* already calls `zin_west_end_ford_war` instead of `white_peace` ([eindil_journey.md](eindil_journey.md), stage 3).

**A lasting peace.** Gunwaith's focus *The Ford Holds* (needs truce ≥ 70 and the truce unbroken) sets `zin_west_truce_permanent`: no truce decay, unity +15, the feud can no longer start. The journey then uses its own fallback (*Feud on the Grey Ford*, a feud without war). This is an outcome, not history.

### 3. Eindil's temporary war-kingship

The war-kingship itself (the Grey Ford Confederation, *A Crown Offered*, *The War-King's Terms*, *The Crown Laid Down*: events `zin_eindil.30` to `.35`) belongs to [Eindil's journey](eindil_journey.md), stage 3. This spec adds what it means for the West. The journey calls one entry point, `zin_west_on_war_king` (argument `event`), in the options below; the war-king's peace calls `zin_west_end_ford_war` instead (dependency).

| Journey outcome | `event` | Western effect |
| --- | --- | --- |
| A confederation names him war-king (*A Crown Offered*, "Name him war-king") | `named` | unity +5 (they acted together) |
| The war-king's peace is accepted by both sides | — | `zin_west_end_ford_war` (`how = peace`, above): unity +25; every confederation member's grudge −5 (a stranger made the peace Parim never offered) |
| A belligerent fights on (*The War-King's Terms*, "Fight on") | `refused` | unity −10; the feud goes on as a border war |
| *The Crown Laid Down*: released with honour | `released` | unity +5; global flag `zin_west_remembers_war_king` (read by the coalition rules in section 11) |
| He leaves by night (the confederation tried to keep him) | `fled` | unity −15 (the journey dissolves the confederation) |

"Confederation member" is read from the journey spirit `zin_eindil_war_kings_banner` at the moment of the call.

**Proposed reading:** the war-king's peace is what lets the West act as one again, and the West then turns its old grudge outward. The same peace that Eindil made makes the Crossing possible. Text never says he intended it.

Western text names him through the characters spec's scripted localisation `[zin_loc_eindil]`: "the Man from the Ice" before `zin_eindil_named` (decision D4), "Eindil" after. Text may also call him "the stranger", and "the King Without a House" once `zin_eindil_war_king` is set ([02_lore/02_characters.md](../02_lore/02_characters.md)). No western text is reachable before `zin_eindil_awake` that mentions him at all.

### 4. The Ford Council, unity and resolve

**The Ford Council** (proposed name) is the meeting of western crowns at the Grey Ford, where the truce was signed. It is not a faction; membership is a country flag.

- Convened by Gunwaith's focus *Convene the Ford Council* or, if Gunwaith does not exist or has not done so by 1 Thaw 1752 (`1752.3.1`), by the decision `zin_west_convene_council` for the anchor (the first existing country in the builder's anchor list: Gunwaith, then the other West Lands countries by start states, most first; scripted trigger `zin_west_is_anchor`). Needs `zin_west_council_can_meet`: the Grey Ford Feud is not running (`zin_west_grey_ford_war` not set) and either `zin_eindil_war_king`, `zin_west_truce_permanent` or the date is after 1 Thaw 1751 (`1751.3.1`). Its tooltip reads "The West is at peace with itself." Owner question 1 proceeds on "the convener leads, Gunwaith on the historical path".
- `zin_west_convene_council` sets global flag `zin_west_council` and variable `global.zin_west_convener` (the convening country), unity +15, and fires `zin_west.30` *The Ford Council Convenes* to every West Lands country: send a delegate (country flag `zin_west_council_member`; unity +2) or stay away. AI: send if grudge ≥ 35 or opinion of the convener ≥ 0.

**Unity** `zin_west_unity` (global, 0–100, start 15): how far the West can act as one.

| Source | Change |
| --- | --- |
| Monthly while `zin_west_council` is set | +0.5 |
| Monthly per pair of West Lands countries at war with each other (`has_war_with`; the border war does not count) | −1 |
| Truce broken / the war-king's peace | −10 / +25 |
| Council delegates | +2 each |
| Gunwaith's diplomacy focuses | +3 to +15 |
| A West Lands country annexes another by war | −15 |

**Resolve** `zin_west_resolve` (global, 0–100) is recomputed monthly by `zin_west_monthly`:

`resolve = 0.5 × G + 0.3 × unity + 0.2 × fleet + bonuses`

- *G* is the state-weighted average grudge of council members (of every West Lands country before the council meets).
- Bonuses: +5 with `zin_golden_king_dead`; +10 while an Aenor realm is in a civil war (`has_civil_war`); +5 with `zin_leren_withdrawal` (the North has left Aenor); −5 while Lerendor is on the honour route and the treaty is in force (`zin_leren_honours_treaty` and `zin_leren_treaty_in_force`: Leren fleets may answer for Aenor, section 7); +15 with `zin_war_of_last_crowns`; −10 while the Aenor realm that controls Parim has a Light government (`has_government = democratic`), is at peace with every West Lands country, and `zin_gathering_dark` < 25.

Start value about 29 (state-weighted grudge 44.5 on today's map). Historical target: 60 to 70 by Thaw 1755, about 80 once the War of the Last Crowns begins.

### 5. The West's course

Gunwaith's focus *The Question of the Sea* (needs `zin_west_council` and unity ≥ 40) opens three mutually exclusive route focuses. The chosen route is stored in `global.zin_west_route` and one global flag, both set only by `zin_west_set_route`, which then runs `mark_focus_tree_layout_dirty` for every West Lands country (decision E4: the trees' route branches use `available`, not `allow_branch`). If Gunwaith cannot choose (gone, or not convener), the convener gets the decision `zin_west_choose_course` with the same three options, available after 1 Thaw 1753 (`1753.3.1`).

The AI's route follows this spec's game rule `zin_rule_west_route` (Game rules, below) under the foundation's precedence ([../00_foundation/05_defines_and_rules.md](../00_foundation/05_defines_and_rules.md)): `DEFAULT` follows `zin_rule_historical_path` (HISTORICAL: crossing, then sail home; PLAUSIBLE: the conditions below with the crossing weight ×3; FREE: the conditions below); any other option forces its branch. Scripts read it through the foundation's generated triggers `zin_rules_ai_branch_west_<option>`. Rules never act on a player's country.

| Route | Flag | AI condition (`free`, and `DEFAULT` under FREE or PLAUSIBLE) | What it means |
| --- | --- | --- | --- |
| **Cross for the Old Claims** (historical) | `zin_west_route_crossing` | resolve ≥ 50 | The West prepares the Crossing. It launches when the War of the Last Crowns begins, or earlier if resolve is overwhelming. |
| **The West Keeps Its Own Shore** | `zin_west_route_divided` | resolve < 40 | The council breaks up. No crossing; each court goes its own way; Gunwaith's tree turns to the home lands. |
| **The Western Relief** | `zin_west_route_relief` | average Eindil regard of council members ≥ 25 and the convener has `zin_eindil_heeded`, or `zin_afrit_revealed` | The West sails to defend the Middle Lands against Volgan, Zol and the dark, as allies, not conquerors. |

On the divided route: `zin_west_council` is cleared; every West Lands country gets `zin_west_own_shore` (365 days); news `zin_west.80`. Individual courts can still use `zin_cb_old_grudge` against Aenor alone; the AI never does on this route.

### 6. The fleet and the wide sea (`zin_west_fleet`)

`zin_west_fleet` (global, 0–100, start 10) is the shipping gathered for a crossing: transports, war galleys, island charters. It is the lift capacity of the Crossing and of the evacuation.

| Source | Change |
| --- | ---: |
| Decision `zin_west_build_crossing_ships` (any council member with ≥ 1 dockyard and Timber, decision V2: hulls are built from Timber, engine key `aluminium`, `has_resources_in_country` amount > 4; 50 PP; 120 days; 180-day cooldown) | +3, or +5 with ≥ 3 dockyards (`num_of_naval_factories`) |
| Gunwaith's ship focuses and the West Lands trees' yard focuses | +1 to +15 each |
| Coldor sells timber and hulls (decision `zin_cold_sell_timber_west`, [cold lands](cold_lands.md); historically in 4A 1753 and 4A 1754) | +5 per sale |
| Triton's charter (Gunwaith's *Charts of the Pupor Ocean*, event `zin_gunwaith.5` to Adel) | +5 |
| Any other spec | through `zin_west_add_fleet` only |
| Each sailing that meets enemy naval control (section 7) | −10 |
| Monthly decay while no route is chosen and the council is not sitting (ships return to trade) | −0.3 |

Historical target: 55 to 65 by Thaw 1755.

**Lift.** One sailing carries at most `floor(fleet ÷ 3)` divisions (20 at fleet 60).

### 7. The Western Crossing

**The Call to Cross.** Gunwaith's focus *The Call to Cross* (crossing route) calls `zin_west_call_pledges`:

1. Creates the faction **The Western Crossing** (proposed name) led by the convener, if it does not exist: `create_faction_from_template = zin_faction_western_crossing` (the diplomacy spec's template, joining rule `zin_faction_rule_join_crossing` and rules `war_declaration_rule_faction_leader_only`, `call_to_war_rule_faction_leader_only`, `change_leader_rule_never`, `faction_peace_rule_conquest_focus`).
2. Fires `zin_west.31` *The Call to Cross* to every council member and every other West Lands country.

| Option | Effect | AI chance (dynamic) |
| --- | --- | --- |
| **Pledge the host** | Joins the faction (`add_to_faction` from the leader); country flag `zin_west_pledged`; variable `zin_west_pledge` = 2 + floor(grudge ÷ 20) divisions (2 to 7); unity +2 | grudge − 20 + (unity − 50) ÷ 2, ×0.75 with `zin_west_aenoran_gold` (the economy spec's −25 %) |
| **Send ships, not men** | Fleet +3; flag `zin_west_ships_only`; no faction, no war | remainder up to 70 |
| **Refuse** | Grudge −5; opinion `zin_west_refused_the_call` (convener toward the refuser) | the rest |

Historical rule: pledge if grudge ≥ 45; ships if 30 to 44; refuse below 30. Expected pledges: Gunwaith, Kradlon, Corogon, Varnondor, Lambin and two or three smaller crowns; Girdon pledges if it accepted the war-king's peace (owner question 7 proceeds on this proposal). Coldor and Triton's Islands countries join only through their own specs' effects (`zin_cold_join_crossing`, `zin_tritons_join_crossing`), never by this event.

**When the Crossing can sail.** Scripted trigger `zin_west_crossing_ready`:

- route is crossing; the faction exists with at least three members (`zin_west_pledged`);
- fleet ≥ 50 and resolve ≥ 60;
- `zin_war_of_last_crowns` is set, **or** (date after 1 Thaw 1754, resolve ≥ 80 and an Aenor realm is in a civil war or at war with a great power). The second branch is the **early crossing**; the AI never takes it under the historical rule.

**Launch** (`zin_west_launch_crossing`, from Gunwaith's *Launch the Crossing* or, when Gunwaith is not the leader, the leader's decision `zin_west_launch`):

1. Sets the contract flag `zin_western_crossing`; locks the route.
2. Saves the foe: the Aenor realm that controls Parim (`zin_is_site_parim`), or Aenor's own tag if no realm does (global event target `zin_west_foe`).
3. The leader sets the diplomacy spec's one-day country flag `zin_story_war` (a story war is exempt from the peace-breaker rule), creates war goals on the foe (`create_wargoal`, type `take_state_focus`, on Parim's state and on every `zin_is_site_west_landing_shore` state the foe owns) and declares war (`declare_war_on`, type `take_state_focus`, on Parim's state). Asgard's isle state is owned by Asgard, the foe's subject, which enters the war as a subject; it needs no war goal. Historical wars are declared by script, not justified ([diplomacy](../03_gameplay/03_diplomacy_and_factions.md)).
4. Every pledged member is added to the war (`add_to_war`, `targeted_alliance` = the leader, `enemy` = the foe).
5. `zin_world_add_gathering_dark` 5 (10 for an early crossing), the values the world tension spec lists.
6. Fires `zin_west.40` *Where Shall the Host Land?* to the leader and news `zin_west.41` *The Western Crossing* to every country.

**What the declaration means for the North.** The foe now has a defensive war. While the Treaty of the Narrow Strait is in force, Lerendor's monthly check fires its call `zin_leren.20` *Aenor Calls on the Treaty* once for this war ([lerendor_narrow_strait.md](lerendor_narrow_strait.md), section 6). On the historical path Lerendor refuses and withdraws; on the honour route it may join the foe's war against the Crossing, and its fleets then count for the naval-control test below.

**The sailings.** The pledged hosts do not need the AI to plan a naval invasion across the wide sea. Each sailing is scripted (`zin_west_sail`):

| Step | What happens |
| --- | --- |
| Landing site | First sailing: the leader's choice in `zin_west.40`: **Aenor Isle first** (historical; Asgard's state, the only `zin_is_site_west_landing_isle` state on today's map; owner question 3 proceeds on this proposal) or **straight to the mainland shore** (the `zin_is_site_west_landing_shore` state with the fewest foe divisions). If Asgard has country flag `zin_asgard_harbours_barred` (Asgard tree, *Bar the Harbours*), the isle option is not available and the first sailing goes to the shore. Second sailing: always the mainland shore. |
| Beachhead | If the landing state is not controlled by a faction member: armies in it that are not the faction's are teleported to their owner's capital (`teleport_armies`, state scope, `limit` = not in the faction), then `set_state_controller_to` the leader. State flag `zin_west_beachhead`. |
| The host | Each member pays `zin_west_pledge` × 10,000 manpower (`add_manpower`) and × 1,000 equipment (`add_equipment_to_stockpile`, negative amount), then creates that many divisions of its template `zin_west_crossing_host` in the beachhead (`create_unit` with `prioritize_location` = the landing state's generated coastal province, `allow_spawning_on_enemy_provs = yes`, `count`). Members that cannot pay send what they can (minimum 1 division). Until the warfare build (stage 2) the template is 6 vanilla `infantry` and 1 `artillery_brigade` paying `infantry_equipment`; after it, 6 `zin_men_infantry` and 1 `zin_men_archers` paying `zin_arms_equipment` ([01_warfare.md](../03_gameplay/01_warfare.md)). `zin_west.1` creates the template on every West Lands country with the `division_template` effect. |
| Lift | At most `floor(fleet ÷ 3)` divisions per sailing. Pledges beyond the lift wait for the next sailing (decision `zin_west_second_sailing`, 90 days later). Two sailings at most (`zin_west_sailings`); then the members fight with what they have. |
| The sea | If any country at war with the leader on the foe's side has naval control (`has_naval_control`, which counts that country's friends) of any strategic sea region in the central-sea list at the moment of sailing (the key-sites country trigger `zin_controls_sea_central`): event `zin_west.44` *Storm and Sail*: a quarter of that sailing's divisions (rounded down) are not created; fleet −10. Leren fleets count only if Lerendor is in that war. |
| The strait | The sailings cross the central sea, not the Narrow Strait. Lerendor's *Close the Strait* (`zin_leren_strait_closed` on a member) never stops or shrinks a sailing; it only slows and shortens the member's own fleets, as its spirit says. |
| After landing | Timed spirit `zin_west_beachhead_host` on every member with divisions ashore (180 days); news to the foe `zin_west.42` *Sails on the Western Sea*. AI strategies come from `common/ai_strategy/zin_west.txt` (AI section). |

Members keep their home armies. A player may also invade by the normal naval route; the warfare spec makes that need `zin_tech_deep_water_hulls`.

**Rumours of a western fleet.** When fleet first reaches 40 on the crossing route, `zin_west.90` fires to the Aenor realm that controls Parim: fortify the western shore (two `coastal_bunker` levels in every naval-base province of each `zin_is_site_west_landing_shore` state it owns, `add_building_construction` with `instant_build = yes`; −75 PP; AI 30, ×0 historical under Aurevan), send gold west (Aenor's "Subsidise a Western Court" costs half for 365 days, country flag `zin_west_subsidy_half`; AI 30) or dismiss the tale (+25 PP; AI 40, historical under Aurevan 100). The text calls it "talk of ships in western yards", not a plan of war.

### 8. Taking Parim

**The surrenders.** "Western commanders accepted surrenders" (established). While the faction controls three or more states owned by an Aenor realm, Gunwaith's focus *Accept the Surrenders* (or the leader's decision `zin_west_accept_surrenders`) calls `zin_west_grant_surrenders`, which adds `zin_west_generous_conquerors` (less resistance, more compliance) to every member.

**The Captains yield the city.** After Afrit abandons Aenor (`zin_afrit_king_of_east`), the Aenor spec's Captains' Regency rules Aenor with its armies retreating from the east (`zin_aenor.300`). Event `zin_west.55` *The Keys of Parim* fires to the Aenor realm that controls Parim when:

- `zin_afrit_king_of_east` is set and the realm is ruled by the Captains' Regency (`zin_aenor_ruled_by_captains`), and
- the faction's members together have at least 8 divisions in Middle Lands mainland states (generated scripted effect `zin_west_count_ashore`, which sets `global.zin_west_ashore` from `num_divisions_in_states` threshold checks over the generated Middle Lands mainland list; Aenor Isle is not counted), and
- on the historical rule, the date is after 1 Sowing 1756 (`1756.5.1`, *paced*).

| Option | Effect | AI |
| --- | --- | --- |
| **Yield the city to spare it** (historical) | The realm's armies in Parim's state are teleported to a random state of `global.zin_west_parim_fallback` (rebuilt in the option from every state for which `zin_aenor_fallback_seat` is true and that the realm controls; `teleport_armies` with `to_state_array`; if none is left, to the realm's capital); `set_state_controller_to` the faction leader; the realm's stability −10 %; `zin_lost_cause_add_strength` −5 (the diplomacy spec's entry point to the Lost Cause) | historical always; otherwise 50 % if the faction's divisions ashore outnumber the realm's in the Middle Lands, else 10 % |
| **Fight for every street** | Timed spirit `zin_west_parim_defiant` on the realm (180 days); the city must be taken in battle | the rest |

Whether Parim is yielded or stormed, the first time a faction member controls Parim's state (checked in the option above and by the monthly pulse), `zin_west_take_parim` runs:

1. Global flag `zin_west_parim_taken`; news `zin_west.56` *Western Banners over Parim*.
2. The leader chooses through `zin_west_choose_parim` (`choice` = claim or pledge): Gunwaith by its focus pair *Claim the Throne of Men* / *Hold Parim as a Pledge*; any other leader by event `zin_west.57`:
   - **Claim the throne of men** (historical; established "claiming the human throne"): flag `zin_west_throne_claimed`; spirit `zin_west_claimant_of_parim` on the leader; opinion `zin_west_conquerors` (−50) from every Aenor realm toward the leader; `zin_world_add_gathering_dark` 3. AI: historical 100; otherwise 70.
   - **Hold Parim as a pledge**: flag `zin_west_parim_pledge`; strain −10; opinion `zin_west_pledge_holders` (−20) only. AI: historical 0; otherwise 30.
3. The Aenor spec's triggers that read Parim (`zin_aenor_parim_lost`) do the rest on Aenor's side.

Who sits on the claimed throne is not named: the leader's ruler is "the western claimant" in text. The vault leaves the claimant open (owner question 2 proceeds on "unnamed").

### 9. The occupation strain (`zin_west_strain`)

`zin_west_strain` (global, 0–100) measures how untenable the conquest is. It rises only while faction members control states owned by an Aenor realm.

| Source | Per month |
| --- | ---: |
| Base: an army across a wide sea | +1.5 |
| Fleet below 40 | +1 |
| Zol (`zin_is_zol`) has divisions in any Middle Lands state (after `zin_zol_rising`) | +3 |
| `zin_volgan_marches` and Volgan (`zin_is_volgan`) has divisions in any Middle Lands state | +3 |
| An eastern army (`zin_eastern_invasion` set, and a country with `zin_region_east_lands` at war with the foe) has divisions in the Middle Lands | +1 |
| Spirit `zin_gunwaith_western_garrison` (focus *Governors of Parim*) on any member | −1 |
| Hold-route spirit `zin_west_hold_fast` | −1 |

"Has divisions in the Middle Lands" is the generated `num_divisions_in_states` check over the Middle Lands state list (`count > 0`).

Dynamic modifier `zin_west_strain_mod` on every member with divisions in the Middle Lands: `army_morale_factor` −strain ÷ 500 (to −0.20), `supply_consumption_factor` +strain ÷ 500 (to +0.20). The pulse writes the two values into each member's variables `zin_west_strain_morale` and `zin_west_strain_supply`.

**The Shore Calls.** `zin_west.60` fires to the faction leader at the first of: strain ≥ 70; or, on the historical rule, 1 Mistfall 1756 (`1756.11.1`, *paced*) if `zin_west_parim_taken`, `zin_zol_rising` and `zin_volgan_marches` are all set; or 1 Longnight 1756 (`1756.12.1`, *paced*) regardless.

| Option | Effect | AI |
| --- | --- | --- |
| **Sail home** (historical) | `zin_west_begin_evacuation` | historical always; dynamic when strain ≥ 60 |
| **Hold what we took** | Flag `zin_west_route_hold` and `zin_west_route` = 4; spirit `zin_west_hold_fast` on members; asked again at strain 90 | dynamic (`free`, or `DEFAULT` under FREE or PLAUSIBLE) when strain < 60; always under `crossing_hold` |

On the hold route, strain 100 fires `zin_west.64` *The Host Breaks*: every member's divisions in the Middle Lands take 40 % organisation and 20 % strength damage (`damage_units` with `ratio = yes`), and `zin_west_begin_evacuation` runs at once with half the lift.

### 10. The evacuation and the stranded armies

`zin_west_begin_evacuation`:

1. Sets global flag `zin_west_evacuation`; fires `zin_west.61` *The Fleet at the Shore* to every member.
2. Marks every coastal state in the Middle Lands or on Aenor Isle that the faction controls and that has a naval base with state flag `zin_west_evacuation_port`.
3. Starts the 60-day mission `zin_west_fleet_waits` for the leader (`activate_mission`). Every 7 days, the hidden event `zin_west.65` teleports every faction member's armies standing in an evacuation port to their owner's capital (`teleport_armies`, limit `has_country_flag = zin_west_pledged`). Players have 60 days to march their divisions to the ports. With `lift_factor` 0.5 (*The Host Breaks*), only every second port state (in generated order) is flagged.
4. When the mission ends (`timeout_effect`), `zin_west_resolve_evacuation` runs once over every Middle Lands and Aenor Isle state where member divisions remain:
   - With chance equal to the lift chance (`min(80, fleet)` %, × `lift_factor`), the state's member armies are teleported home (the fleet found them on some other shore).
   - Otherwise they stay. Their owner gets country flag `zin_west_stranded` and spirit `zin_west_stranded_host`.
5. Then `zin_west.62` *Terms on the Shore* fires to the foe (or, if the foe no longer exists, to every Aenor realm at war with the leader):

| Option | Effect | AI |
| --- | --- | --- |
| **Let them stand with us** (historical) | The realm gives military access to every stranded country (`give_military_access`); then `white_peace` with every member; opinion `zin_west_fought_beside` is added later, not now | historical always; dynamic if the realm is at war with Zol or Volgan |
| **Let them go, but not on our soil** | `white_peace`; no access (the engine moves the stranded divisions out; they count as evacuated) | dynamic when not at war with a dark power |
| **No terms** | The war goes on; the stranded must surrender or fight | never for the AI |

6. Sets `zin_west_evacuated`; news `zin_west.66`; removes `zin_west_claimant_of_parim`. The faction stays in being while any member is stranded or at war with a dark power (the diplomacy spec's `zin_diplo_is_dark_power`); otherwise it dissolves (`dismantle_faction`).

The Linux run must confirm that military access given before the white peace keeps the stranded divisions in place (acceptance 8). If it does not, the build switches to the fallback: a non-aggression pact plus `give_military_access` right after the peace.

**Stranded.** A stranded country:

- carries `zin_west_stranded_host` (supply and morale penalties, but higher defence: men with nowhere to run);
- gets `zin_west.63` *Those Left Behind*: send word home (−25 PP, stability +3 %) or make the best of it (war support +5 %);
- is invited to Eindil's coalition (section 11) and to fight Volgan and Zol;
- keeps its independence and its home government; the stranded divisions are simply still in the Middle Lands.

### 11. Joining Eindil's coalition

When Eindil returns (`zin_eindil_returned`), the journey's *Coalition of the Living* (`zin_eindil.94`) invites "countries with armies stranded in the Middle Lands". This spec sets how the West answers:

- Every country with `zin_west_stranded` is invited, whatever its regard.
- AI acceptance (dynamic): 30 % + regard % (journey rule) + 40 % for a stranded country + 15 % with `zin_west_remembers_war_king`; historical rule: every stranded country accepts. The journey adds these two terms to its acceptance chance (dependency).
- Joining calls `zin_eindil_join_coalition`; then `zin_west_join_coalition_effects` adds opinion `zin_west_fought_beside` (+30) both ways with the Host of Eindil and every Aenor realm in the coalition, spirit `zin_west_beside_former_foes`, and removes `zin_west_old_claims`. The West Lands trees' "join coalition" focuses call the same pair.
- Joining makes no country a subject (established).

**The long way home.** After `zin_afrit_dead` or `zin_eindil_crowned`, every stranded country gets `zin_west.70`: **Bring them home** (`zin_west_bring_home`: armies in Middle Lands states teleported to the capital; spirits removed; stability +5 %; AI 60) or **Let those who wish stay** (the host divisions in every second stranded state, in generated order, are disbanded: `delete_unit` with `division_template = zin_west_crossing_host`, `state`, `disband = yes`, which returns their manpower and equipment; opinion +15 with every Aenor realm; AI 40). Neither option is written as what history did; the text says "in this telling" (owner question 6 proceeds on "left open").

### 12. The other courses

**The Western Relief** (route relief). `zin_west_launch_relief` needs `zin_war_of_last_crowns` and an accepted request (`zin_west.50` *Letters from the West* to the Aenor realm that controls Parim: grant passage, `give_military_access` to every pledged member, global flag `zin_west_relief_granted`, AI 100 if at war with a dark power, else 20 / refuse; the relief route is never taken on the historical rule, so the event does not fire there). It uses the same sailings, landing in friendly ports (the realm's `zin_is_site_west_landing_shore` states) without a beachhead or teleport, and adds every pledged member to the realm's wars against Volgan, the Southern Dominion and Zol (`add_to_war`), and against Afrit's country once `zin_afrit_revealed`. Pledged members that are not Shadow become honorary members of the Lost Cause (country flag `zin_lost_cause_member`, the diplomacy spec's honorary-crown terms) and the league gains strength (`zin_lost_cause_add_strength` 5); each member gains Eindil regard +15 (`zin_eindil_add_regard`). No strain; the stranded rules do not apply (allies sail home through friendly ports). `zin_world_add_gathering_dark` −3. News `zin_west.51`.

**The West Keeps Its Own Shore** (route divided): see section 5. Gunwaith's *First Crown of the West* line plays it.

**A western crown holds Parim** (proposed outcome, never history): on the hold route, if a faction member controls Parim on 1 Thaw 1760 (`1760.3.1`, an outcome date, not paced), or the foe capitulates to the faction, global flag `zin_west_holds_parim` is set and news `zin_west.71` fires. The world tension spec reads it for the outcome *A Western Crown in Parim* (`zin_ending_western_crown`). If Eindil has returned and the holder's regard is ≥ 50, `zin_west.72` *The Heir Asks for Parim* lets the holder give the city to the Host of Eindil (`set_state_controller_to`; `white_peace` with the Host; regard +25) instead. AI: give 50, keep 50.

### 13. The historical path

The checkpoints are the historical-path spec's ([../03_gameplay/06_historical_path_and_ai.md](../03_gameplay/06_historical_path_and_ai.md)): CP 03, 04, 13 and 18 are this spec's or shared with it.

| Date (proposed) | Event | CP |
| --- | --- | --- |
| 1 Thaw 4A 1748 | Peace. Truce 40, unity 15, fleet 10, resolve about 29. | 01 |
| 4A 1748–1749 | Gunwaith's war-thanes press; raids at the ford; truce falls. Aenoran tariffs feed the grudge. | |
| 1 Rainwake 4A 1750 | The truce breaks; the Grey Ford Feud (border war). | 03 |
| 4A 1750 | The Grey Ford Confederation names the stranger war-king; his peace ends the feud; unity +25; he lays the title down. Mistfall: the Golden King dies; Aurevan is crowned (grudge +5 everywhere). | 04 |
| 4A 1751 | Gunwaith convenes the Ford Council. | |
| 4A 1752–1754 | Ships are built; Coldor sells timber (1753, 1754); Triton's charts are bought. The Question of the Sea: the West chooses to cross. Eindil's warning (1754) is dismissed. | |
| 1 Rainwake 4A 1755 | `zin_war_of_last_crowns` (CP 11): the Call to Cross, the pledges, the launch within 60 days. Lerendor refuses Aenor's call and leaves the treaty (CP 12). First sailing to Aenor Isle; second to the mainland shore. `zin_western_crossing`. | 13 |
| 4A 1756 | Afrit abandons Aenor (from 1 Thaw). The Captains yield Parim (from 1 Sowing). `zin_west_parim_taken`; the throne of men claimed. | 18 |
| Mistfall 4A 1756 – Deepwinter 4A 1757 | The Shore Calls; the 60-day evacuation; some armies stranded. Terms on the Shore: white peace with access. | |
| Thaw 4A 1757 | Eindil returns; the stranded join his coalition. | 19 |
| 4A 1759–1760 | After Afrit's death, the long way home. | |

### Peace gates

| Action | Earliest |
| --- | --- |
| The Grey Ford Feud | truce at 0 after 1 Thaw 1749; historical 1 Rainwake 1750; decision after 1 Thaw 1750 |
| Any western war goal on Aenor | crossing route and `zin_west_crossing_ready`; or `zin_cb_old_grudge` (diplomacy: `zin_gathering_dark` ≥ 40) |
| Early crossing | after 1 Thaw 1754, resolve ≥ 80, Aenor in civil war or at war with a great power |
| The Western Relief landing | `zin_war_of_last_crowns` |
| Gunwaith's war on Girdon (full war) | feud ended, `zin_gathering_dark` ≥ 25 or `zin_war_of_last_crowns`; never historical |

## Implementation

### Builder module, data and test

- **Module:** `tools/content/modules/mech_western_crossing.mjs`, exporting `buildWesternCrossing(staged, ctx)`, imported by `tools/content/build.mjs` like the existing modules and applied in the same atomic transaction (`tools/content/apply.mts`). It writes every file below through `staged.text()` with the `cw()` serializer and `yml()` for localisation; nothing is hand-edited.
- **Data:** `tools/content/data/mechanics/western_crossing.json`: the grudge table by country name; the anchor order (Gunwaith first, then the other West Lands countries by start states, most first, ties by name); the template battalions before and after the warfare build. Country names resolve to tags through `tools/content/data/countries.json`; an unknown name fails the build. State lists come from the key-sites module's output `docs/design/map/sites_resolved.json` (`tools/content/modules/sites.mjs`, which runs before this module): the landing states and their coastal landing provinces, the Middle Lands state list (`zin_is_region_middle_lands` without the Aenor Isle state), and the evacuation candidates (Middle Lands states with a naval base).
- **Pace:** the module writes one scripted trigger per *paced* date (`zin_west_past_truce_break`, `_keys_of_parim`, `_shore_calls`, `_shore_calls_late`), each an OR of three branches on `global.zin_story_pace` (1.0, 1.5, 0.75) with the shifted dates.
- **Test:** `tools/content/mech_western_crossing.test.mjs`, added to the `test` script in `tools/package.json` when the module lands. It asserts the build-test acceptance lines below; `assertModifiers` from `tools/content/lib/core.mjs` checks every modifier key against the installed `modifiers_documentation.md`.

### Files

| Path | Content |
| --- | --- |
| `common/scripted_effects/zin_west.txt` | Effects below |
| `common/scripted_triggers/zin_west.txt` | Triggers below, the generated anchor, pace and Middle Lands division-count triggers |
| `common/ideas/zin_west.txt` | Mechanic spirits |
| `common/dynamic_modifiers/zin_west.txt` | `zin_west_strain_mod` |
| `common/opinion_modifiers/zin_west.txt` | Opinion modifiers below |
| `common/decisions/categories/zin_west.txt`, `common/decisions/zin_west.txt` | Categories `zin_west_council` (The Ford Council) and `zin_west_crossing` (The Western Crossing); the mission `zin_west_fleet_waits` (a decision with `days_mission_timeout = 60` and `timeout_effect`) |
| `events/zin_west.txt` | Namespace `zin_west` (mechanic-owned; may use `trigger` and `mean_time_to_happen`) |
| `common/on_actions/zin_west.txt` | `on_startup` → `zin_west.1`; `on_monthly` with `limit = { zin_west_is_anchor = yes }` → `zin_west.2`; `on_annex` (unity −15 when a West Lands country annexes another; ROOT the winner, FROM the annexed). On_actions merge, so this file stands beside `zin_startup.txt` |
| `common/ai_strategy/zin_west.txt` | The AI strategies of the AI section, each enabled by the mechanic's flags |
| `common/ai_areas/zin_west.txt` | Area `zin_area_middle_lands` (the land strategic regions that hold Middle Lands states, from `sites_resolved.json`) for Gunwaith's `area_priority` |
| `common/game_rules/zin_west.txt` | `zin_rule_west_route` (group `RULE_GROUP_ZIN`, the foundation's format) |
| `localisation/english/zin_west_l_english.yml` | All text, the rule texts included |

The template `zin_west_crossing_host` is not written into `history/units` (the politics and warfare steps own that folder): `zin_west.1` creates it on every West Lands country with the `division_template` effect.

### Variables

| Variable | Scope | Range | Start | Meaning |
| --- | --- | --- | --- | --- |
| `zin_west_grudge` | each West Lands country | 0–100 | table | Resentment of Aenor |
| `zin_west_truce` | global | 0–100 | 40 | Strength of the Truce of the Grey Ford |
| `zin_west_unity` | global | 0–100 | 15 | How far the West acts as one |
| `zin_west_resolve` | global | 0–100 | computed | Will to cross |
| `zin_west_fleet` | global | 0–100 | 10 | Shipping for a crossing; lift |
| `zin_west_strain` | global | 0–100 | 0 | Untenability of the occupation |
| `zin_west_route` | global | 0–4 | 0 | 0 none, 1 divided, 2 crossing, 3 relief, 4 hold (crossing that refused to sail home) |
| `zin_west_convener` | global (country) | — | unset | The Ford Council's convener and the faction leader |
| `zin_west_pledge` | pledged country | 1–7 | — | Divisions pledged |
| `zin_west_sailings` | global | 0–2 | 0 | Sailings made |
| `zin_west_strain_morale`, `zin_west_strain_supply` | member | derived | — | Values for `zin_west_strain_mod` |
| `zin_west_ashore` | global | 0–40 | 0 | Faction divisions in Middle Lands mainland states (set by `zin_west_count_ashore`) |
| `zin_west_parim_fallback` | global array of states | — | — | Built in `zin_west.55` from `zin_aenor_fallback_seat` |
| `zin_west_foe` | global event target | — | unset | The Aenor realm the Crossing declared war on |

### Flags

| Flag | Kind | Meaning |
| --- | --- | --- |
| `zin_western_crossing` | global (contract) | The West has crossed the central sea |
| `zin_west_truce_broken` | global | The Truce of the Grey Ford is broken |
| `zin_west_grey_ford_war` | global, cleared at peace | The Grey Ford Feud is running |
| `zin_west_truce_permanent` | global | The truce became a lasting peace |
| `zin_west_ford_commission` | global | The Ford Commission sits |
| `zin_west_remembers_war_king` | global | The war-king was released with honour |
| `zin_west_council` | global | The Ford Council sits |
| `zin_west_council_member` | country | Sends a delegate |
| `zin_west_route_divided`, `zin_west_route_crossing`, `zin_west_route_relief`, `zin_west_route_hold` | global | The West's course |
| `zin_west_pledged`, `zin_west_ships_only` | country | Answer to the Call to Cross |
| `zin_west_beachhead`, `zin_west_evacuation_port` | state | Landing state; port of the evacuation |
| `zin_west_parim_taken` | global | A western army has held Parim |
| `zin_west_throne_claimed`, `zin_west_parim_pledge` | country (leader) | Choice at Parim |
| `zin_west_evacuation`, `zin_west_evacuated` | global | Evacuation started / done |
| `zin_west_stranded` | country | Some of its army stayed in the Middle Lands |
| `zin_west_holds_parim` | global | Outcome: a western crown holds Parim |
| `zin_west_raid_girdon_next`, `zin_west_feud_girdon_attacked` | global | Whose turn the next raid is; Girdon attacked in the feud |
| `zin_west_heed_counted` | country | The grudge fall for heeding Eindil was applied |
| `zin_west_fleet_rumour` | global | `zin_west.90` has fired |
| `zin_west_subsidy_half` | country (Aenor realm), 365 days | Aenor's western subsidies cost half (read by the economy decision) |
| `zin_west_relief_granted` | global | The Aenor realm granted the relief passage |
| `zin_story_war` | country, 1 day (diplomacy's flag) | Set before the launch's declaration |

### Scripted triggers

| Trigger | Scope | True when |
| --- | --- | --- |
| `zin_west_is_western` | country | `has_country_flag = zin_region_west_lands` (economy spec's region flag) |
| `zin_west_council_can_meet` | any | section 4 |
| `zin_west_question_open` | any | `zin_west_council` and unity ≥ 40 |
| `zin_west_crossing_ready` | any | section 7 |
| `zin_west_in_crossing` | country | flag `zin_west_pledged` and in the faction led by `zin_west_convener` |
| `zin_west_controls_parim` | any | a faction member controls the state with `zin_is_site_parim` |
| `zin_west_holds_aenor_states` | any | a faction member controls ≥ 1 state owned by an Aenor realm (`zin_aenor_is_realm`) |
| `zin_west_strain_high` | any | strain ≥ 70 |
| `zin_west_historical` | any | `zin_rule_west_route` is `historical`, or it is `DEFAULT` and the foundation's `zin_rules_is_historical` is true (`zin_rules_ai_branch_west_historical`). Read by the Gunwaith and West Lands trees for "hist ×" |
| `zin_west_is_anchor` | country | Generated: the first existing country in the anchor list |
| `zin_west_past_truce_break`, `zin_west_past_keys_of_parim`, `zin_west_past_shore_calls`, `zin_west_past_shore_calls_late` | any | Generated *paced* dates 1750.4.1, 1756.5.1, 1756.11.1, 1756.12.1 |
| `zin_west_has_divisions_in_middle_lands` | country | Generated: `num_divisions_in_states` (`count > 0`) over the Middle Lands list |
| `zin_is_site_grey_ford`, `zin_is_site_west_landing_isle`, `zin_is_site_west_landing_shore` | state | Key-site triggers (Map and site dependencies) |
| `zin_is_region_west_lands`, `zin_is_region_middle_lands` | state | Shared region triggers (Map and site dependencies) |

### Scripted effects

| Effect | Scope | Does |
| --- | --- | --- |
| `zin_west_add_grudge` (`value`) | West Lands country | Adds, clamps 0–100 |
| `zin_west_add_grudge_all` (`value`) | any | Every West Lands country |
| `zin_west_add_truce` (`value`) | any | Adds if the truce is unbroken, clamps; at 0 calls `zin_west_break_truce` |
| `zin_west_add_unity` (`value`) | any | Adds, clamps |
| `zin_west_add_fleet` (`value`) | any | Adds, clamps |
| `zin_west_add_strain` (`value`) | any | Adds, clamps; checks the Shore Calls |
| `zin_west_break_truce` | any | Section 2 |
| `zin_west_end_ford_war` (`how` = peace 0, decided 1, escalated 2) | any | Section 2 |
| `zin_west_convene_council` | country (convener) | Section 4 |
| `zin_west_set_route` (`route`) | any | Sets `zin_west_route` and its flag; divided route side effects |
| `zin_west_call_pledges` | country (convener) | Section 7 |
| `zin_west_launch_crossing` | country (leader) | Section 7 |
| `zin_west_sail` (`sailing` = 1 or 2) | country (leader) | One sailing, landing and host creation |
| `zin_west_take_parim` | country (controller) | Section 8 |
| `zin_west_choose_parim` (`choice` = claim, pledge) | country (leader) | Section 8, step 2 |
| `zin_west_grant_surrenders` | country (leader) | Adds `zin_west_generous_conquerors` to every faction member (used by the decision and Gunwaith's focus) |
| `zin_west_begin_evacuation` (`lift_factor`, default 1) | any | Section 10 |
| `zin_west_resolve_evacuation` | any | Section 10, step 4 |
| `zin_west_launch_relief` | country (leader) | Section 12 |
| `zin_west_bring_home` | country | Teleports its armies in Middle Lands states home; removes `zin_west_stranded_host` and `zin_west_beside_former_foes` |
| `zin_west_on_war_king` (`event` = named, refused, released, fled) | any | Section 3; called by the journey |
| `zin_west_join_coalition_effects` | country | Section 11, after `zin_eindil_join_coalition` |
| `zin_west_count_ashore` | any | Generated; sets `global.zin_west_ashore` |
| `zin_west_monthly` | anchor | Drift; heeded-warning check; resolve; strain; dynamic modifier values; historical break; Parim check; Shore Calls check; fleet-rumour check; last, `mark_focus_tree_layout_dirty` for every West Lands country (E4) |

**Arguments** (decision E1). Scripted effects take no parameters in 1.19.3: each argument compiles to a temporary variable `zin_arg_<name>` set just before the call (`zin_arg_value`; keyword codes: `how` as above; `route` divided 1, crossing 2, relief 3, hold 4, as `zin_west_route`; `sailing` 1 or 2; `choice` claim 1, pledge 2; `event` named 1, refused 2, released 3, fled 4; `lift_factor` a number, 1 when unset). No effect uses the `$name$` syntax.

Effects owned by other specs that this spec calls: `zin_diplo_grant_cb`, `zin_lost_cause_add_strength` ([diplomacy](../03_gameplay/03_diplomacy_and_factions.md)); `zin_world_add_gathering_dark` ([world tension](../03_gameplay/05_world_tension_and_endings.md)); `zin_eindil_add_regard`, `zin_eindil_join_coalition` ([journey](eindil_journey.md)). This spec never calls `zin_aenor_add_lost_cause` directly; the diplomacy entry point does.

Engine effects used (checked in the 1.19.3 effect documentation): `start_border_war`, `cancel_border_war`, `create_wargoal`, `declare_war_on`, `add_to_war`, `white_peace`, `give_military_access`, `diplomatic_relation`, `teleport_armies`, `set_state_controller_to`, `create_unit`, `delete_unit`, `division_template`, `damage_units`, `add_manpower`, `add_equipment_to_stockpile`, `add_building_construction`, `create_faction_from_template`, `add_to_faction`, `dismantle_faction`, `add_opinion_modifier`, `add_dynamic_modifier`, `activate_mission`, `set_truce` (start situation). Triggers: `has_naval_control` (takes a strategic region id), `has_civil_war`, `has_border_war_between`, `has_war_with`, `has_government`, `controls_state`, `num_divisions_in_states`, `num_of_naval_factories`, `has_resources_in_country`, `any_province_building_level`, `is_in_faction_with`, `has_game_rule`. AI strategy types (`common/ai_strategy/_documentation.md`): `invade`, `conquer`, `area_priority`, `put_unit_buffers`, `befriend`, `prepare_for_war`.

### Spirits (mechanic)

All except `zin_west_old_claims` are ideas in `common/ideas/zin_west.txt` (idea category `country`); timed ones are added with `add_timed_idea`.

| Key | Name | Modifiers | Icon (`GFX_idea_zin_<key>`, in game) | Added / removed |
| --- | --- | --- | --- | --- |
| `zin_west_old_claims` | Old Claims Remembered | `opinion_gain_monthly_factor` −0.10 | `charter_old` | Defined and added at the start by the start situation (not redefined here). This spec, its owning mechanic, replaces the removal rule: removed by the war-king's peace (confederation members) or by joining Eindil's coalition, not by `zin_western_crossing` |
| `zin_west_aenoran_gold` | Aenoran Gold | `political_power_gain` 0.10 | `coin_chest` | Aenor's subsidy; 180 days |
| `zin_west_own_shore` | Our Own Shore | `stability_factor` 0.05, `political_power_gain` 0.05 | `banner_plain` | Divided route; 365 days |
| `zin_west_beachhead_host` | The Beachhead | `army_defence_factor` 0.10, `supply_consumption_factor` −0.10 | `ship_voyage` | Each sailing; 180 days |
| `zin_west_generous_conquerors` | Generous Conquerors | `resistance_target_on_our_occupied_states` −0.10, `compliance_growth_on_our_occupied_states` 0.10 | `olive_branch` | *Accept the Surrenders* |
| `zin_west_claimant_of_parim` | Claimant to the Throne of Men | `political_power_gain` 0.20, `war_support_factor` 0.05, `stability_factor` −0.05 | `throne_gold` | Throne claimed; removed on evacuation |
| `zin_west_parim_defiant` | Parim Will Not Yield | `army_core_defence_factor` 0.15 | `palace_parim` | Aenor realm; 180 days |
| `zin_west_hold_fast` | Hold What We Took | `army_defence_factor` 0.10, `stability_factor` −0.05 | `sword_shield` | Hold route |
| `zin_west_stranded_host` | Stranded Beyond the Sea | `army_morale_factor` −0.05, `army_defence_factor` 0.10, `land_reinforce_rate` −0.02 | `shipwreck` | Stranded; removed by `zin_west_bring_home` |
| `zin_west_beside_former_foes` | Beside Former Foes | `army_morale_factor` 0.10, `army_org_factor` 0.05 | `banner_league` | Joining Eindil's coalition; removed by `zin_west_bring_home` |

### Dynamic modifiers

| Key | Modifiers |
| --- | --- |
| `zin_west_strain_mod` | `army_morale_factor` = `zin_west_strain_morale` (the pulse stores it negative, −strain ÷ 500); `supply_consumption_factor` = `zin_west_strain_supply` (+strain ÷ 500); `icon = GFX_idea_zin_storm_sea` |

### Opinion modifiers

| Key | Value | Notes |
| --- | ---: | --- |
| `zin_west_conquerors` | −50 | Aenor realm → leader, throne claimed; decays 1 a month |
| `zin_west_pledge_holders` | −20 | Aenor realm → leader, pledge; decays 1 a month |
| `zin_west_fought_beside` | +30 | Both ways, stranded or relief member ↔ Host of Eindil and Aenor realms in the coalition |
| `zin_west_refused_the_call` | −10 | Convener → refuser; decays 1 a month |
| `zin_west_ford_blood` | −30 | Gunwaith ↔ Girdon when the truce breaks; decays 1 a month; removed by the war-king's peace |

Existing modifiers from the start situation are read or removed, not redefined: `zin_opinion_old_claims`, `zin_opinion_grey_ford_truce` (decision N5 naming). The Gunwaith tree's `zin_gunwaith_heal_the_ford` removes `zin_west_ford_blood` too.

### Decisions

Category pictures are `GFX_decision_cat_picture_zin_west_council` and `GFX_decision_cat_picture_zin_west_crossing` (art inventory B1, not generated yet); until they exist the categories use the in-game icons `GFX_idea_zin_grey_ford` and `GFX_idea_zin_ship_voyage`.

**Category `zin_west_council` (The Ford Council)**, visible to West Lands countries.

| Key | Who | Available | Cost | Effect | AI |
| --- | --- | --- | --- | --- | --- |
| `zin_west_convene_council` | the anchor (`zin_west_is_anchor`) | after 1 Thaw 1752; `zin_west_council_can_meet`; not `zin_west_council` | 50 PP | `zin_west_convene_council` | always |
| `zin_west_end_the_truce` | Gunwaith or Girdon | truce ≤ 20; after 1 Thaw 1750; `zin_gathering_dark` ≥ 25 | 25 PP | `zin_west_break_truce` | dynamic 20 with war-thanes; historical never |
| `zin_west_choose_course` | convener, not Gunwaith | `zin_west_question_open`; after 1 Thaw 1753 | 50 PP | Three options as in section 5 | by route conditions |
| `zin_west_build_crossing_ships` | council member with a dockyard and Timber (section 6) | route crossing or relief, or council sitting; 180-day cooldown | 50 PP, 120 days | fleet +3 (+5 with ≥ 3 dockyards) | every member with ≥ 100 PP |
| `zin_west_send_envoys` (targeted) | convener | council sitting; target a non-member West Lands country | 25 PP | target grudge +5; opinion +10; 120-day cooldown per target | targets with grudge ≥ 30 |

**Category `zin_west_crossing` (The Western Crossing)**, visible to faction members.

| Key | Who | Available | Cost | Effect |
| --- | --- | --- | --- | --- |
| `zin_west_launch` | leader, if Gunwaith is not leader | `zin_west_crossing_ready` | — | `zin_west_launch_crossing` |
| `zin_west_accept_surrenders` | leader, if Gunwaith is not leader | ≥ 3 Aenor-owned states controlled | 50 PP | `zin_west_grant_surrenders` |
| `zin_west_second_sailing` | leader | 90 days after the first (timed flag); pledges outstanding; `zin_west_sailings` = 1 | — | `zin_west_sail` (2) |
| `zin_west_sound_the_retreat` | leader | `zin_west_holds_aenor_states`; strain ≥ 40 | 25 PP | `zin_west_begin_evacuation` early |

### Events (namespace `zin_west`)

| Id | Title | For | Trigger | Options (AI) |
| --- | --- | --- | --- | --- |
| .1 | (hidden) Startup | every West Lands country | on_startup | Variables, grudge table, the host template; on Gunwaith the Gunwaith tree's start spirit `zin_gunwaith_weary_clans` (country histories come from the politics step) |
| .2 | (hidden) Western pulse | anchor | monthly | `zin_west_monthly` |
| .10 | A Protest from the West | Aenor realm that controls Parim | Gunwaith's *No Tariff Without Answer* or Kradlon's *The Guilds' Petition* (FROM = protester) | Lower the duty: −50 PP, protester grudge −10 (AI 20; ×2 if not ruled by the Golden Court) / Refuse: protester grudge +10, unity +3 (AI 80) |
| .15 | A God on Aenor's Throne | every West Lands country | `zin_aurevan_crowned` | "The temples rejoice; the old claims stir." grudge +5 |
| .20 | The Ford Commission | Girdon | Gunwaith focus *The Ford Commission* | Sit with them: flag `zin_west_ford_commission`, truce +10 (AI 70; ×0.4 if Gunwaith has `zin_gunwaith_war_thanes`) / Decline: truce −5 (AI 30) |
| .21 | A Raid at the Ford | Gunwaith or Girdon | MTTH 240 days, truce < 50 | section 2 |
| .22 | Blood at the Grey Ford | Gunwaith and Girdon | `zin_west_break_truce` | "To the ford!" |
| .23 | (hidden) The Feud Decided | winner of the border war | `on_win` / `on_lose` of the border war | `zin_west_end_ford_war` (`how = decided`) |
| .24 | After the Feud | both | `.23` | Make peace (AI 60; hist 100) / Stay hostile (AI 40) |
| .25 | The Grey Ford Is Broken | West Lands (news) | `zin_west_break_truce` | OK |
| .26 | Peace at the Ford | West Lands (news) | `zin_west_end_ford_war` | OK |
| .30 | The Ford Council Convenes | every West Lands country | `zin_west_convene_council` | Send a delegate / Stay away (AI: section 4) |
| .31 | The Call to Cross | West Lands countries | `zin_west_call_pledges` | Refuse / Pledge the host (hist) / Send ships, not men (AI: section 7; order per E2) |
| .40 | Where Shall the Host Land? | leader | launch | Aenor Isle first (AI 70, hist 100; unavailable with `zin_asgard_harbours_barred`) / Straight to the mainland shore (AI 30) |
| .41 | The Western Crossing | all (news) | launch | OK |
| .42 | Sails on the Western Sea | the foe | each sailing | OK |
| .44 | Storm and Sail | leader | sailing under enemy naval control | OK |
| .50 | Letters from the West | Aenor realm that controls Parim | Gunwaith's *Letters to Parim*, or the relief leader's first launch attempt | Grant passage / Refuse (AI: section 12) |
| .51 | The Western Relief | all (news) | relief landing | OK |
| .55 | The Keys of Parim | Aenor realm that controls Parim | section 8 | Fight for every street / Yield (hist) (AI: section 8; order per E2, so a human's timeout never hands over Parim) |
| .56 | Western Banners over Parim | all (news) | `zin_west_take_parim` | OK |
| .57 | The Throne of Men | leader | `zin_west_take_parim` | Claim the throne (hist) / Hold Parim as a pledge |
| .60 | The Shore Calls | leader | section 9 | Sail home (hist) / Hold what we took (AI: section 9) |
| .61 | The Fleet at the Shore | members | evacuation | OK (tooltip: march to the ports within 60 days) |
| .62 | Terms on the Shore | the foe | after the mission | section 10 |
| .63 | Those Left Behind | each stranded country | evacuation resolved | Send word home (AI 50) / Make the best of it (AI 50) |
| .64 | The Host Breaks | members | strain 100 on hold route | OK |
| .65 | (hidden) The boats come in | leader | every 7 days during the mission | teleports armies in ports |
| .66 | The Western Fleet Sails Home | all (news) | `zin_west_evacuated` | OK |
| .70 | The Long Way Home | each stranded country | `zin_afrit_dead` or `zin_eindil_crowned` | Bring them home (AI 60) / Let those who wish stay (AI 40) |
| .71 | A Crown Across the Sea | all (news) | `zin_west_holds_parim` | OK |
| .72 | The Heir Asks for Parim | holder of Parim | hold route, `zin_eindil_returned`, regard ≥ 50 | Give him the city (AI 50) / Keep it (AI 50) |
| .80 | The West Keeps Its Own Shore | West Lands (news) | divided route | OK |
| .90 | Talk of Ships in Western Yards | Aenor realm that controls Parim | fleet 40 on the crossing route (once, flag `zin_west_fleet_rumour`) | Fortify the shore / Send gold west / Dismiss the tale (AI: section 7) |

**Timeouts** (decision E2). Every `zin_west` event sets `timeout_days = 30` and takes its first option on timeout. The two human-facing choices that decide a historical checkpoint (`.31` for CP 13, `.55` for CP 18) put the non-committal option first and the historical one second; AI chances follow the options, not their order.

**Pictures** (all in game today; each respects the icon catalog's gate). Events, `GFX_zin_evt_<key>`: `.10`, `.50` generic_court; `.15` coronation (gate `zin_golden_king_dead`); `.20`, `.24`, `.30` grey_ford_truce; `.21`, `.22`, `.31`, `.55`, `.64` generic_war; `.40`, `.42`, `.44`, `.60` western_crossing (gate `zin_western_crossing`, set before each fires); `.57` golden_court; `.61`, `.90` generic_sea; `.62`, `.63`, `.70` generic_peace; `.72` war_king (gate `zin_eindil_awake`). News, `GFX_zin_news_<key>`: `.25`, `.56`, `.71` generic_war; `.26`, `.80` generic_peace; `.41` western_crossing; `.51`, `.66` generic_sea. The `ending_western_crown` news picture is gated on the ending flag, so `.71` does not use it. Hidden events have none. The art inventory's planned `zin_west` set (`ford_council_tent`, `western_muster`, `western_shipyards`, `horse_fair_west`, `crossing_embark`, `clan_moot_west`) replaces some of these when it is generated (art request).

### Game rules

`zin_rule_west_route`, in this spec's own file `common/game_rules/zin_west.txt` (the foundation lists it among the rules in their owners' files; group `RULE_GROUP_ZIN`, decision R1). Options: `DEFAULT` (first and default: follows `zin_rule_historical_path`, section 5), `historical` (crossing route, launch on the war, sail home, the stranded join Eindil), `crossing_hold` (crossing, never sail home), `relief`, `divided`, `free` (AI weights from resolve, regard and unity). Rule and option texts name neither Afrit nor Eindil. The foundation's `rules.mjs` generates `zin_rules_ai_branch_west_<option>` from it. It replaces the foundation's former AI rule for the West (R1); the Western route's AI weights are this spec's (R6).

### Defines

None.

### Map and site dependencies

**Key sites.** Every site and region trigger comes from the key-sites spec ([../01_map/02_key_sites.md](../01_map/02_key_sites.md)): `tools/content/modules/sites.mjs` resolves each row of `tools/content/data/sites.json` and writes `common/scripted_triggers/zin_sites.txt`. This spec reads these rows, all present in that table:

| Trigger | Rule there (proposed) |
| --- | --- |
| `zin_is_site_grey_ford` | the Gunwaith–Girdon state pair with the longest shared border; its two halves are `zin_is_site_three_oaths` (Gunwaith) and `zin_is_site_winter_ford` (Girdon) |
| `zin_is_site_west_landing_isle` | Asgard's and Aenor's states on Aenor Isle with a naval base (Asgard's state today) |
| `zin_is_site_west_landing_shore` | the three to five Middle Lands states of Aenor or its dominions with a naval base nearest the West Lands across the central sea |
| `zin_is_site_parim` | Parim |
| `zin_aenor_fallback_seat` | Aenor's fallback seat near Parim, not Parim (the key sites table owns it, decision E7; this spec only reads it, state scope) |
| `zin_controls_sea_central` | country scope: `has_naval_control` of any central-sea strategic region (`sea_central` in `sites.json`); the key sites table owns it (E7: strategic regions have no usable trigger scope) |
| `zin_is_region_west_lands`, `zin_is_region_middle_lands` | the start owner's roster region |

## AI

- **Grudge and pledges** follow the chances in sections 1 and 7. Under the historical rule the thresholds are fixed.
- **Ford Council:** the AI convener takes *The Question of the Sea* when available and picks the route by section 5. Under `free` (and `DEFAULT` under FREE, or PLAUSIBLE before the ×3), crossing weight = resolve, divided weight = 100 − resolve, relief weight = average council regard × 2 (×0 before `zin_eindil_named`).
- **Fleet:** every AI member takes `zin_west_build_crossing_ships` whenever available and PP ≥ 100.
- **The Crossing:** the leader launches within 7 days of `zin_west_crossing_ready` on the war branch; never early under the historical rule.
- **AI strategies** (`common/ai_strategy/zin_west.txt`; each block's `enable` names the flag): after `zin_western_crossing`, every faction member: `invade` the foe (value 200), `conquer` the foe (150); the leader: `area_priority` `zin_area_middle_lands` (100). After `zin_west_evacuation` and until `zin_west_evacuated`: `put_unit_buffers` (ratio 1.0, states = the evacuation candidates) so their armies march to the shore. For a stranded country: `befriend` every Aenor realm and the Host of Eindil (100); `prepare_for_war` and `conquer` toward Volgan and Zol (100); `conquer` toward every Aenor realm −1000 after the white peace. These match the historical-path spec's strategy row for CP 13 in kind; the values here win for this faction.
- **Parim:** the Aenor AI yields under the historical rule (section 8).
- **What remains** when the mission ends may be stranded; under the historical rule at least one member is stranded because the lift chance is capped at 80 %.

## Acceptance

Each line says how it is decided: **[build]** an assertion in `tools/content/mech_western_crossing.test.mjs` run by `npm test` in `tools/`; **[Linux]** the isolated Linux run (one in-game year at the end of phase 3, decision S8; error.log gets no new line from a `zin_west` file); **[scenario]** a scripted HOI4 Agent Tools run (`hoi4_scenario_test` or `hoi4_mechanic_test`) on the mod source. Dates are at the standard story pace.

1. **[build]** Every file in the Files table is staged; every event, decision, idea, opinion modifier, dynamic modifier, scripted trigger and scripted effect named here is defined exactly once; every one referenced is defined here or in a spec listed under Dependencies; every localisation key exists in `zin_west_l_english.yml` (UTF-8 with BOM).
2. **[build]** Every modifier key passes `assertModifiers`; every engine effect, trigger and AI strategy type named in Implementation appears in the installed 1.19.3 documentation; every country name in the data file resolves.
3. **[build]** No `start_border_war`, `create_wargoal` or `declare_war_on` in a `zin_west` file is reachable without its peace-gate trigger (static scan of the staged scripts); `declare_war_on` is always preceded by `zin_story_war`.
4. **[build]** The secret check: no `zin_west` text reachable by a country other than the Worshipdom before `zin_afrit_revealed` contains "Afrit" or "Hidden Council"; Eindil's name appears only through `[zin_loc_eindil]` or after a `zin_eindil_named` gate; no `zin_west` event can fire before `zin_eindil_awake` with text about him.
5. **[scenario]** A new game on 1 Thaw 4A 1748: grudge values as tabled; truce 40, unity 15, fleet 10, strain 0, resolve 27 to 31; Gunwaith and Girdon at peace with the engine truce and opinions in place; no western war goal or claim exists.
6. **[scenario]** `zin_west_break_truce` run on 1 Thaw 1749, while the engine truce stands, starts the Grey Ford Feud (`has_border_war_between` true). If the engine refuses, the build gates the truce-at-0 path to 1 Thaw 1750 and the scenario passes on that date.
7. **[scenario]** At the first sailing, with the foe holding naval control of a central-sea region: *Storm and Sail* fires, a quarter of the host is not created, fleet −10. With Lerendor closing the strait on the leader instead: the sailing is unchanged.
8. **[Linux]** Military access given before `white_peace` keeps stranded divisions in the foe's states (console check of division positions 30 days after *Terms on the Shore*); if not, the fallback of section 10 is built and passes the same check.
9. **[Linux]** Historical run, 4A 1748 to 4A 1760, `zin_rule_historical_path` HISTORICAL and `zin_rule_west_route` DEFAULT: the truce breaks between 1 Rainwake and 1 Highsun 1750; the feud ends by the war-king's peace in 1750; the Ford Council convenes by 1 Thaw 1753; the crossing route is chosen; resolve ≥ 60 and fleet ≥ 50 by 1 Thaw 1755; `zin_western_crossing` is set within 60 days of `zin_war_of_last_crowns`. Phase 3 checks this up to the end of its one-year run; the full span is the phase 5 chain run.
10. **[Linux]** On that run: at least 12 western divisions stand in the Middle Lands within 120 days of the launch; `zin_west_parim_taken` is set in 4A 1756; the evacuation resolves before 1 Thaw 1757; at least one West Lands country has `zin_west_stranded`; every stranded country is in Eindil's coalition within 60 days of `zin_eindil_returned`.
11. **[scenario]** `zin_rule_west_route = divided`: no western country declares war on Aenor before 1760 in three seeds. `relief`: western divisions land in friendly ports, are at war with Volgan or Zol, and never at war with an Aenor realm. `crossing_hold`: *The Shore Calls* takes "Hold what we took".
12. **[scenario]** The Keys of Parim: with the Captains' Regency ruling and 8 faction divisions ashore after 1 Sowing 1756, the yield option moves the realm's armies out of Parim's state into a fallback state and `zin_west_parim_taken` is set the same day.
13. **[build]** Every `zin_west` event sets `timeout_days = 30`; `zin_west_set_route` and `zin_west_monthly` contain `mark_focus_tree_layout_dirty`; `zin_rule_west_route` is in `RULE_GROUP_ZIN` with `DEFAULT` first; `zin_west.1` adds `zin_gunwaith_weary_clans` to Gunwaith; no `zin_west` file contains a retired name of the contract register.
14. **[scenario]** A human Aenor realm that lets `zin_west.55` time out fights for every street; Parim is not handed over by the timeout.

## Dependencies on other specs

- [Eindil's journey](eindil_journey.md): stage 3 reads `zin_west_grey_ford_war` and ends the feud with `zin_west_end_ford_war` (both already in that spec); `zin_eindil.94` invites every `zin_west_stranded` country with the +40 % and +15 % terms (already there). *A Crown Offered*, "Fight on" and both options of *The Crown Laid Down* call `zin_west_on_war_king` (named, refused, released, fled; already there). *Enforce the War-King's Peace* is the journey's own war and keeps the journey's gates.
- [Diplomacy](../03_gameplay/03_diplomacy_and_factions.md): template `zin_faction_western_crossing` and joining rule `zin_faction_rule_join_crossing`; the causes `zin_cb_broken_truce` and `zin_cb_old_grudge`; `zin_diplo_grant_cb`, `zin_lost_cause_add_strength`, `zin_story_war`, `zin_diplo_is_dark_power`, the honorary-crown terms.
- [Aenor](aenor_court_and_succession.md): `zin_aenor_is_realm`, `zin_aenor_ruled_by_captains`, `zin_aenor_parim_lost`, `zin_aenor.300`.
- [Lerendor](lerendor_narrow_strait.md): `zin_leren.20` on the Crossing's war; `zin_leren_honours_treaty`, `zin_leren_treaty_in_force` and `zin_leren_withdrawal` for resolve; `zin_leren_strait_closed` does not touch the sailings.
- [Afrit](afrit_hidden_council.md): `zin_afrit_king_of_east`; its pressure event `zin_afrit.50` counts `zin_western_crossing`.
- [Economy](../03_gameplay/02_economy.md): `zin_region_<key>` flags; "Subsidise a Western Court" also calls `zin_west_add_grudge` (−10), adds `zin_west_aenoran_gold` for 180 days and costs half while the Aenor realm has `zin_west_subsidy_half` (set on it by `zin_west.90`); "Western Tariffs" calls `zin_west_add_grudge` (+5 / +2); "Hire the Buldor Companies" is unavailable while Buldor has the Gunwaith tree's timed flag `zin_west_buldor_west`.
- [Start situation](../02_lore/01_start_situation.md): the two opinions, the truce and the start spirit; [lore events](../02_lore/04_fourth_age_history_for_play.md): `zin_lore.141` calls `zin_west_add_grudge`; [characters](../02_lore/02_characters.md): `[zin_loc_eindil]`.
- [Cold Lands](cold_lands.md): `zin_cold_sell_timber_west` adds fleet; `zin_cold_join_crossing`. [Triton's Islands](../05_focus_trees/regional/tritons_islands.md): `zin_tritons_join_crossing`. [Middle Lands trees](../05_focus_trees/regional/middle_lands.md): Asgard's `zin_asgard_harbours_barred`.
- [Warfare](../03_gameplay/01_warfare.md): the unit and equipment keys of the host template after stage 2; `zin_tech_deep_water_hulls` for ordinary invasions.
- [World tension](../03_gameplay/05_world_tension_and_endings.md): `zin_war_of_last_crowns`, `zin_world_add_gathering_dark`; reads `zin_western_crossing` and `zin_west_holds_parim`.
- [Historical path](../03_gameplay/06_historical_path_and_ai.md): CP 03, 04, 13, 18; [foundation rules](../00_foundation/05_defines_and_rules.md): the precedence rule, `zin_rules_is_historical`, `zin_rules_ai_branch_west_*` (generated from this spec's rule), `zin_story_pace`; [calendar](../00_foundation/01_start_and_calendar.md).
- [Key sites](../01_map/02_key_sites.md): the rows above, the region triggers and `sites_resolved.json`; `sites.mjs` runs before this module.

## Open questions

The owner questions of this spec are listed in [OPEN_QUESTIONS.md](../OPEN_QUESTIONS.md) (section "west and cold lands", 1 to 7; short list 9). The work proceeds on these labelled proposals:

1. **Who led the Crossing?** Proposal: the Ford Council's convener, Gunwaith on the historical path (section 4).
2. **Who claimed the throne of men?** Proposal: unnamed, "the western claimant" (section 8).
3. **Where did the fleets land?** Proposal: Aenor Isle first, then the Middle Lands' west shore (section 7).
4. **The truce at the start.** Proposal: the engine truce to 1 Thaw 1750 is enough; no pact (start situation).
5. **Who broke the truce?** Proposal: Gunwaith's war-thanes (section 2).
6. **The stranded after the war.** Proposal: left open; both choices offered "in this telling" (section 11).
7. **Girdon in the Crossing.** Proposal: Girdon may pledge if it accepted the war-king's peace (section 7).
