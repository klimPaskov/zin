# The West Lands and the Western Crossing

**Status:** Draft. **Priority:** 3. **Phase:** 3.

## Purpose

The West Lands are two dozen kingdoms, republics and companies south of the Cold Lands, across the wide central sea from Aenor. Their Fourth Age story runs from a weary truce at home to an invasion of the Middle Kingdom, and from the capture of Parim to soldiers stranded beside the people they conquered. This spec defines the mechanic that carries that story:

- **The old grudge** (`zin_west_grudge`): how much each western court resents Aenor's old conquests and present tariffs.
- **The Truce of the Grey Ford** (`zin_west_truce`): the fragile peace between Gunwaith and Girdon, how it breaks, and the Grey Ford Feud.
- **Eindil's temporary war-kingship**: how the western side of the journey's stage 3 feeds the West's unity.
- **The Ford Council and the West's course** (`zin_west_unity`, `zin_west_resolve`): whether the West stays divided, crosses the sea for revenge, or sails to Aenor's defence.
- **The fleet** (`zin_west_fleet`): ships enough to cross a sea much wider than the old maps drew.
- **The Western Crossing**: the pledges, the faction, the sailings and the landings.
- **Taking Parim**, the occupation strain, **the evacuation**, **the stranded armies**, and their place in **Eindil's coalition**.

The focus tree [../05_focus_trees/major/gunwaith.md](../05_focus_trees/major/gunwaith.md) drives most of it. The other western courts act through events and decisions here and through their regional trees (Girdon, Lambin, Buldor, Kradlon, Corogon, Varnondor; the shared West Lands tree). Shared names come from [00_shared_contract.md](00_shared_contract.md).

## Lore basis

| Fact | Status | Source |
| --- | --- | --- |
| The West Lands lie south of the Cold Lands, joined by a broad neck; Gunwaith, Girdon, Kradlon, Corogon, Varnondor | established | *Erdae and Its Regions* |
| The central sea between the West Lands and the Middle Lands is much wider than drawn; this is why Aenor's conflicts with the West persist | established (owner) | *Fourth Age Map of Erdae* |
| Aenor once conquered and settled the West in the First Age; every western court remembers it | established | *The Fourth Age of Erdae*, *The Campaign of 4A 1748* |
| Gunwaith and Girdon are rivals | established | *The Campaign of 4A 1748* |
| Gunwaith clans, Girdon wardens and Buldor companies are peoples of men | established | *Peoples of Erdae* |
| Eindil is taken south by West Lands travellers, makes peace between rivals and is chosen temporary war-king by several rulers of one western confederation; he lays the title down once the peace is secured | established | *The Fourth Age of Erdae* §IV, *Fourth Age Canon Register* |
| Western kingdoms plan a great crossing to end their ancient rivalry with Aenor; Eindil warns of it | established | *The Fourth Age of Erdae* §VIII |
| Western fleets cross the enlarged central ocean; some kings seek revenge, others want the capital before a weakened kingdom can threaten them again; the army lands, seizes ports, occupies the capital and claims the human throne | established | *The Fourth Age of Erdae* §IX, *War of the Last Crowns* |
| Aenor's defenders retreat toward the western-held capital; western commanders accept surrenders; Zol's dead and Volgan make the occupation impossible; the western fleet prepares to evacuate; some soldiers escape, others are stranded beside the Aenorians they conquered | established | *The Fourth Age of Erdae* §IX |
| Stranded western soldiers join Eindil's temporary coalition; he does not demand that the western kingdoms give up their independence; competing western interests remain | established | *The Fourth Age of Erdae* §X, *War of the Last Crowns* |
| The Gunwaith–Girdon wars from about 4A 1702; the Truce of the Grey Ford in 4A 1745; the Western Crossing in 4A 1755; Parim taken in 4A 1756 | proposed dates | *Fourth Age Chronology* |
| The names Truce of the Grey Ford, Grey Ford, Bridge of the Three Oaths, Girdon's Winter Ford, the Gunwaith trial | proposed | *Fourth Age Chronology*, *The Fourth Age of Erdae* §IV |
| The West can stay divided, cross for revenge, or join the defence; "a western crown holds Parim" as a play outcome | proposed (play choices, not history) | *The Campaign of 4A 1748* |

**Proposed by this spec:** the grudge, truce, unity, resolve, fleet and strain measures; the Grey Ford Feud as a border war; the Ford Council; the pledges and sailings; the landing on Aenor Isle; the evacuation ports; every number, event and decision.

**Kept open** (text never answers): where exactly the fleets crossed and landed (the vault lists it as open; the landing sites below are gameplay sites, labelled proposed); which western ruler claimed the human throne; which rulers made Eindil war-king (the journey spec builds the Grey Ford Confederation from regard); what becomes of the exiled westerners after the war. Before `zin_afrit_revealed` no text names Afrit; Aenor's god-king is "King Aurevan" or "the Deliverer".

## Design

### The situation on 1 Thaw 4A 1748

The West is at peace. Gunwaith and Girdon keep the Truce of the Grey Ford, signed three years ago after half a century of border war. Kradlon, Corogon, Varnondor, Lambin and the Buldor companies trade with Aenor across the wide sea and resent its tariffs. Every court remembers the old conquests, but as a grudge spoken over wine. No western court plans a war on anyone. Nothing in this spec can start a war in 4A 1748 (see [Peace gates](#peace-gates)).

Start state written by the [start situation](../02_lore/01_start_situation.md) and used here: opinion `zin_opinion_old_claims` ("Old Claims Remembered", −15, every West Lands country toward Aenor); opinion `zin_opinion_grey_ford_truce` ("Truce of the Grey Ford", −10, Gunwaith and Girdon both ways); the engine truce between Gunwaith and Girdon (`set_truce`) to 1 Thaw 1750; spirit `zin_west_old_claims` on every West Lands country. This spec adds no pact at the start.

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
| Aenoran tariff event `zin_lore.141`: grumble / pay | +3 / +1 |
| Economy event "Western Tariffs": protest / pay | +5 / +2 |
| Aenor's decision "Subsidise a Western Court" ([economy](../03_gameplay/02_economy.md)) on the country | −10, and spirit `zin_west_aenoran_gold` for 180 days |
| `zin_west.10` (tariff protest) answered: lower / refuse | −10 / +10 on the protester |
| `zin_aurevan_crowned` (event `zin_west.15`) | +5 on every West Lands country |
| Heeding Eindil's warning (journey event 83) | −15 on that country |
| Focus effects | see the Gunwaith tree |

All changes go through `zin_west_add_grudge` (one country) or `zin_west_add_grudge_all` (every West Lands country). Values clamp to 0–100.

### 2. The Truce of the Grey Ford (`zin_west_truce`)

`zin_west_truce` (global, 0–100, start 40) is how firmly the truce between Gunwaith and Girdon holds. It exists only while global flag `zin_west_truce_broken` is not set.

**Drift** (monthly, proposed): −0.5 base (raids, old feuds); −0.5 while Gunwaith has spirit `zin_gunwaith_war_thanes`; +0.5 while Gunwaith has `zin_gunwaith_kings_peace`; +0.3 while the Ford Commission sits (flag `zin_west_ford_commission`); −0.3 while `zin_gathering_dark` ≥ 25.

**Raids at the ford.** While truce < 50, `zin_west.21` *A Raid at the Ford* fires to Gunwaith or Girdon (alternating) with mean time 240 days: answer in kind (truce −10, war support +2 %), pay the blood-price (−25 PP, truce +5), or, with the Ford Commission sitting, refer it to the commission (truce +3).

**The truce breaks** (`zin_west_break_truce`) at the first of:

| Path | When |
| --- | --- |
| Truce reaches 0 (Gunwaith's war-thanes, raids answered in kind and *Answer the Ford Raids* drive it down) | any time after 1 Thaw 1749 |
| Historical rule (`zin_rule_historical_path` or `zin_rule_west_route` = historical) | 1 Rainwake 1750 (`1750.4.1`), if not broken earlier |
| Either side's decision `zin_west_end_the_truce` (needs truce ≤ 20 and `zin_gathering_dark` ≥ 25) | any time after 1 Thaw 1750; the breaker gets `zin_diplo_peace_breaker` if Gathering Dark < 25 (diplomacy rule) |

Gunwaith's focus *Blood at the Grey Ford* follows the break; it never causes it. `zin_west_break_truce` does:

1. Sets global flags `zin_west_truce_broken` and `zin_west_grey_ford_war`.
2. Removes `zin_opinion_grey_ford_truce` both ways and adds `zin_west_ford_blood` (−30, both ways, decays 1 a month); grants `zin_cb_broken_truce` both ways for 730 days through `zin_diplo_grant_cb`. A border war is not a declared war, so the engine truce (to 1 Thaw 1750) does not block it; the Linux run confirms this (acceptance 11). If it does block it, the truce-at-0 path waits for 1 Thaw 1750.
3. Starts **the Grey Ford Feud**, a border war (`start_border_war`) between the Gunwaith and Girdon states that hold `zin_is_site_grey_ford` (attacker: the side that broke the truce, Gunwaith on the historical path; `change_state_after_war = no`; `minimum_duration_in_days = 60`; `combat_width = 80`; 4 provinces a side). A border war keeps the conflict local: Girdon has two states and cannot be overrun in a season, which matches a feud a third party must end.
4. Fires `zin_west.22` *Blood at the Grey Ford* to both sides and news `zin_west.25` to every West Lands country; unity −10.
5. The journey reads `zin_west_grey_ford_war` as "a war between West Lands countries is running" and fires *The Grey Ford Breaks* (journey stage 3).

**How the feud ends** (`zin_west_end_ford_war`, the single exit):

| Ending | Trigger | Effect |
| --- | --- | --- |
| **The war-king's peace** (historical) | journey event 33 *The War-King's Terms*, both accept | `cancel_border_war`; clears `zin_west_grey_ford_war`; unity +25; truce is not restored, but `zin_eindil_war_kings_peace` (journey spirit) holds both sides for 730 days; non-aggression pact for 730 days; `zin_west_ford_blood` removed both ways |
| **The feud is decided** | the border war ends with a winner (`on_win` / `on_lose`) | Winner war support +5 %, loser stability −5 %; unity −5; `zin_west.24` *After the Feud* lets both sides make peace (non-aggression pact, unity +5) or stay hostile (keeps the casus belli) |
| **Gunwaith escalates** | Gunwaith's *Girdon Must Bend* line; never on the historical path | The feud ends; a full war follows only from that tree's war focus |

The journey spec currently ends the western war with `white_peace`. With a border war it must call `zin_west_end_ford_war` instead (dependency, see below).

**A lasting peace.** Gunwaith's focus *The Ford Holds* (needs truce ≥ 70 and the truce unbroken) sets `zin_west_truce_permanent`: no truce decay, unity +15, the feud can no longer start. The journey then uses its own fallback (*Feud on the Grey Ford*, a feud without war). This is an outcome, not history.

### 3. Eindil's temporary war-kingship

The war-kingship itself (the Grey Ford Confederation, *A Crown Offered*, *The War-King's Terms*, *The Crown Laid Down*) belongs to [Eindil's journey](eindil_journey.md), stage 3. This spec adds what it means for the West:

| Journey outcome | Western effect |
| --- | --- |
| A confederation names him war-king | Members get unity +5 at once (they acted together) |
| The war-king's peace is accepted by both sides | `zin_west_end_ford_war` (above); unity +25; every confederation member grudge −5 (a stranger made the peace Parim never offered) |
| A belligerent fights on (journey "Fight on") | unity −10 |
| *The Crown Laid Down*: released with honour | unity +5; global flag `zin_west_remembers_war_king` (read by the coalition rules in section 11) |
| He leaves by night (the confederation tried to keep him) | unity −15; the confederation dissolves |

**Proposed reading:** the war-king's peace is what lets the West act as one again, and the West then turns its old grudge outward. The same peace that Eindil made makes the Crossing possible. Text never says he intended it.

All western text before `zin_eindil_named` calls him "the stranger", "the Man from the Ice" or "the King Without a House".

### 4. The Ford Council, unity and resolve

**The Ford Council** (proposed name) is the meeting of western crowns at the Grey Ford, where the truce was signed. It is not a faction; membership is a country flag.

- Convened by Gunwaith's focus *Convene the Ford Council* or, if Gunwaith does not exist or has not done so by 1 Thaw 1752, by the decision `zin_west_convene_council` for the West Lands country with the most states. Needs `zin_west_council_can_meet`: the Grey Ford Feud is not running (`zin_west_grey_ford_war` not set) and either `zin_eindil_war_king`, `zin_west_truce_permanent` or the date is after 1 Thaw 1751. Its tooltip reads "The West is at peace with itself."
- `zin_west_convene_council` sets global flag `zin_west_council` and variable `global.zin_west_convener` (the convening country), unity +15, and fires `zin_west.30` *The Ford Council Convenes* to every West Lands country: send a delegate (country flag `zin_west_council_member`; unity +2) or stay away. AI: send if grudge ≥ 35 or opinion of the convener ≥ 0.

**Unity** `zin_west_unity` (global, 0–100, start 15): how far the West can act as one.

| Source | Change |
| --- | --- |
| Monthly while `zin_west_council` is set | +0.5 |
| Monthly per war between two West Lands countries | −1 |
| Truce broken / the war-king's peace | −10 / +25 |
| Council delegates | +2 each |
| Gunwaith's diplomacy focuses | +3 to +15 |
| A West Lands country annexes another by war | −15 |

**Resolve** `zin_west_resolve` (global, 0–100) is recomputed monthly by `zin_west_monthly`:

`resolve = 0.5 × G + 0.3 × unity + 0.2 × fleet + bonuses`

- *G* is the state-weighted average grudge of council members (of every West Lands country before the council meets).
- Bonuses: +5 with `zin_golden_king_dead`; +10 while an Aenor realm is in a civil war (`has_civil_war`); +5 with `zin_leren_withdrawal`; +15 with `zin_war_of_last_crowns`; −10 while Aenor's crown is held by a Light government at peace with every western country and `zin_gathering_dark` < 25.

Start value about 29. Historical target: 60 to 70 by Thaw 1755, about 80 once the War of the Last Crowns begins.

### 5. The West's course

Gunwaith's focus *The Question of the Sea* (needs `zin_west_council` and unity ≥ 40) opens three mutually exclusive route focuses. The chosen route is stored in `global.zin_west_route` and one global flag. If Gunwaith cannot choose (gone, or not convener), the convener gets the decision `zin_west_choose_course` with the same three options, available after 1 Thaw 1753.

| Route | Flag | AI condition (dynamic rule) | What it means |
| --- | --- | --- | --- |
| **Cross for the Old Claims** (historical) | `zin_west_route_crossing` | resolve ≥ 50 | The West prepares the Crossing. It launches when the War of the Last Crowns begins, or earlier if resolve is overwhelming. |
| **The West Keeps Its Own Shore** | `zin_west_route_divided` | resolve < 40 | The council breaks up. No crossing; each court goes its own way; Gunwaith's tree turns to the home lands. |
| **The Western Relief** | `zin_west_route_relief` | average Eindil regard of council members ≥ 25 and the convener has `zin_eindil_heeded`, or `zin_afrit_revealed` | The West sails to defend the Middle Lands against Volgan, Zol and the dark, as allies, not conquerors. |

On the divided route: `zin_west_council` is cleared; every West Lands country gets `zin_west_own_shore` (365 days); news `zin_west.80`. Individual courts can still use `zin_cb_old_grudge` against Aenor alone; the AI never does on this route.

### 6. The fleet and the wide sea (`zin_west_fleet`)

`zin_west_fleet` (global, 0–100, start 10) is the shipping gathered for a crossing: transports, war galleys, island charters. It is the lift capacity of the Crossing and of the evacuation.

| Source | Change |
| --- | ---: |
| Decision `zin_west_build_crossing_ships` (any council member with ≥ 1 dockyard; 50 PP; 120 days; 180-day cooldown) | +3, or +5 with ≥ 3 dockyards |
| Gunwaith's ship focuses | +3 to +15 each |
| Coldor sells timber and hulls (decision `zin_cold_sell_timber_west`, [cold lands](cold_lands.md)) | +5 per sale |
| Triton's charter (Gunwaith's *Charts of the Pupor Ocean*, answered by an island league) | +5 |
| Each sailing that meets enemy naval control (section 7) | −10 |
| Monthly decay while no route is chosen and the council is not sitting (ships return to trade) | −0.3 |

Historical target: 55 to 65 by Thaw 1755.

**Lift.** One sailing carries at most `floor(fleet ÷ 3)` divisions (20 at fleet 60).

### 7. The Western Crossing

**The Call to Cross.** Gunwaith's focus *The Call to Cross* (crossing route) calls `zin_west_call_pledges`:

1. Creates the faction **The Western Crossing** (proposed name; template `zin_faction_western_crossing`, joining rule `zin_faction_rule_join_crossing`) led by the convener, if it does not exist.
2. Fires `zin_west.31` *The Call to Cross* to every council member and every other West Lands country.

| Option | Effect | AI chance (dynamic) |
| --- | --- | --- |
| **Pledge the host** | Joins the faction; country flag `zin_west_pledged`; variable `zin_west_pledge` = 2 + floor(grudge ÷ 20) divisions (2 to 7); unity +2 | grudge − 20 + (unity − 50) ÷ 2, ×0.75 with `zin_west_aenoran_gold` |
| **Send ships, not men** | Fleet +3; flag `zin_west_ships_only`; no faction, no war | remainder up to 70 |
| **Refuse** | Grudge −5; opinion of the convener −10 | the rest |

Historical rule: pledge if grudge ≥ 45; ships if 30 to 44; refuse below 30. Expected pledges: Gunwaith, Kradlon, Corogon, Varnondor, Lambin and two or three smaller crowns; Girdon pledges if it accepted the war-king's peace (proposed).

**When the Crossing can sail.** Scripted trigger `zin_west_crossing_ready`:

- route is crossing; the faction exists with at least three members (`zin_west_pledged`);
- fleet ≥ 50 and resolve ≥ 60;
- `zin_war_of_last_crowns` is set, **or** (date after 1 Thaw 1754, resolve ≥ 80 and an Aenor realm is in a civil war or at war with a great power). The second branch is the **early crossing**; the AI never takes it under the historical rule.

**Launch** (`zin_west_launch_crossing`, from Gunwaith's *Launch the Crossing* or the convener's decision of the same name):

1. Sets the contract flag `zin_western_crossing`; locks the route.
2. The leader creates a war goal against the Aenor realm that controls Parim (`zin_is_site_parim`; if none, the largest Aenor realm): `create_wargoal` of type `take_state_focus` on Parim's state and every `zin_is_site_west_landing_isle` and `zin_is_site_west_landing_shore` state it owns, then `declare_war_on` the same. Historical wars are declared by script, not justified ([diplomacy](../03_gameplay/03_diplomacy_and_factions.md)).
3. Every pledged member is added to the war (`add_to_war`).
4. `zin_world_add_gathering_dark` 5 (10 for an early crossing).
5. Fires `zin_west.40` *Where Shall the Host Land?* to the leader and news `zin_west.41` *The Western Crossing* to every country.

**The sailings.** The pledged hosts do not need the AI to plan a naval invasion across the wide sea. Each sailing is scripted (`zin_west_sail`):

| Step | What happens |
| --- | --- |
| Landing site | First sailing: the leader's choice in `zin_west.40`: **Aenor Isle first** (historical; the first `zin_is_site_west_landing_isle` state) or **straight to the mainland shore** (the `zin_is_site_west_landing_shore` state with the fewest Aenor-realm divisions). Second sailing: always the mainland shore. |
| Beachhead | If the landing state is not controlled by the coalition: enemy armies in it are teleported to their capital (`teleport_armies`, limit not in the faction), then `set_state_controller_to` the leader. State flag `zin_west_beachhead`. |
| The host | Each member pays `zin_west_pledge` × 10,000 manpower and × 1,000 infantry equipment (placeholder type until the warfare spec), then creates that many divisions of template `zin_west_crossing_host` (warfare spec) in the beachhead state (`create_unit`). Members that cannot pay send what they can (minimum 1 division). |
| Lift | At most `floor(fleet ÷ 3)` divisions per sailing. Pledges beyond the lift wait for the next sailing, 90 days later. Two sailings at most; then the members fight with what they have. |
| The sea | If the Aenor realm or its faction has naval control (`has_naval_control`) of any `zin_is_sea_central` region at the moment of sailing: event `zin_west.44` *Storm and Sail*: a quarter of that sailing's divisions are not created; fleet −10. |
| After landing | Timed spirit `zin_west_beachhead_host` on every member with divisions ashore (180 days). The AI gets `add_ai_strategy` `invade` (Aenor, 200) and `conquer` (Aenor, 150). |

Members keep their home armies. A player may also invade by the normal naval route.

**Rumours of a western fleet.** When fleet reaches 40 on the crossing route, `zin_west.90` fires to the ruling Aenor realm: fortify the western shore (two `coastal_bunker` levels in each `zin_is_site_west_landing_shore` state; −75 PP), send gold west (opens Aenor's subsidies at half cost for 365 days) or dismiss the tale (historical under Aurevan: +25 PP). The text calls it "talk of ships in western yards", not a plan of war.

### 8. Taking Parim

**The surrenders.** "Western commanders accepted surrenders" (established). While the faction controls three or more states owned by an Aenor realm, Gunwaith's focus *Accept the Surrenders* (or the leader's decision `zin_west_accept_surrenders`) adds `zin_west_generous_conquerors` (less resistance, more compliance) to every member.

**The Captains yield the city.** After Afrit abandons Aenor (`zin_afrit_king_of_east`), the Aenor spec's Captains' Regency rules Aenor with its armies retreating from the east. Event `zin_west.55` *The Keys of Parim* fires to the Aenor realm that holds Parim when:

- `zin_afrit_king_of_east` is set and the realm is ruled by the Captains' Regency (`zin_aenor_ruled_by_captains`), and
- the faction has at least 8 divisions in Middle Lands mainland states (`zin_is_region_middle_lands`), and
- on the historical rule, the date is after 1 Sowing 1756.

| Option | Effect | AI |
| --- | --- | --- |
| **Yield the city to spare it** (historical) | Aenor's armies in Parim's state are teleported to `zin_aenor_fallback_seat` (the generated list of Aenor-controlled states nearest Parim); `set_state_controller_to` the faction leader; Aenor stability −10 %, `zin_aenor_add_lost_cause` −5 | historical always; dynamic 50 % if the faction outnumbers the realm's divisions in the Middle Lands |
| **Fight for every street** | Timed spirit `zin_west_parim_defiant` on the realm (core defence +, 180 days); the city must be taken in battle | the rest |

Whether Parim is yielded or stormed, the first time a faction member controls Parim's state, `zin_west_take_parim` runs:

1. Global flag `zin_west_parim_taken`; news `zin_west.56` *Western Banners over Parim*.
2. The leader chooses through `zin_west_choose_parim` (`choice` = claim or pledge): Gunwaith by its focus pair *Claim the Throne of Men* / *Hold Parim as a Pledge*; any other leader by event `zin_west.57`:
   - **Claim the throne of men** (historical; established "claiming the human throne"): flag `zin_west_throne_claimed`; spirit `zin_west_claimant_of_parim` on the leader; the Aenor realm's opinion −50 (`zin_west_conquerors`); Gathering Dark +3.
   - **Hold Parim as a pledge**: flag `zin_west_parim_pledge`; strain −10; opinion −20 only.
3. The Aenor spec's triggers that read Parim (`zin_aenor_parim_lost`) do the rest on Aenor's side.

Who sits on the claimed throne is not named: the leader's ruler is "the western claimant" in text. The vault leaves the claimant open.

### 9. The occupation strain (`zin_west_strain`)

`zin_west_strain` (global, 0–100) measures how untenable the conquest is. It rises only while faction members control states owned by an Aenor realm.

| Source | Per month |
| --- | ---: |
| Base: an army across a wide sea | +1.5 |
| Fleet below 40 | +1 |
| Zol has divisions in any Middle Lands state (after `zin_zol_rising`) | +3 |
| `zin_volgan_marches` and Volgan has divisions in any Middle Lands state | +3 |
| An eastern army (`zin_eastern_invasion` and an eastern country at war with Aenor) has divisions in the Middle Lands | +1 |
| Spirit `zin_gunwaith_western_garrison` (focus *Governors of Parim*) | −1 |
| Hold-route spirit `zin_west_hold_fast` | −1 |

Dynamic modifier `zin_west_strain_mod` on every member with divisions in the Middle Lands: `army_morale_factor` −strain ÷ 500 (to −0.20), `supply_consumption_factor` +strain ÷ 500 (to +0.20).

**The Shore Calls.** `zin_west.60` fires to the faction leader at the first of: strain ≥ 70; or, on the historical rule, 1 Mistfall 1756 if `zin_west_parim_taken`, `zin_zol_rising` and `zin_volgan_marches` are all set; or 1 Longnight 1756 regardless.

| Option | Effect | AI |
| --- | --- | --- |
| **Sail home** (historical) | `zin_west_begin_evacuation` | historical always; dynamic when strain ≥ 60 |
| **Hold what we took** | Flag `zin_west_route_hold`; spirit `zin_west_hold_fast` on members; asked again at strain 90 | dynamic when strain < 60 |

On the hold route, strain 100 fires `zin_west.64` *The Host Breaks*: every member's divisions in the Middle Lands take 40 % organisation and 20 % strength damage (`damage_units` with `ratio = yes`), and `zin_west_begin_evacuation` runs at once with half the lift.

### 10. The evacuation and the stranded armies

`zin_west_begin_evacuation`:

1. Sets global flag `zin_west_evacuation`; fires `zin_west.61` *The Fleet at the Shore* to every member.
2. Marks every coastal state in the Middle Lands or on Aenor Isle that the faction controls and that has a naval base with state flag `zin_west_evacuation_port`.
3. Starts the 60-day mission `zin_west_fleet_waits` for the leader. Every 7 days, the hidden event `zin_west.65` teleports every faction member's armies standing in an evacuation port to their owner's capital (`teleport_armies`, limit `has_country_flag = zin_west_pledged`). Players have 60 days to march their divisions to the ports.
4. When the mission ends, `zin_west_resolve_evacuation` runs once over every Middle Lands and Aenor Isle state where member divisions remain:
   - With chance equal to the lift chance (`min(80, fleet)` %), the state's member armies are teleported home (the fleet found them on some other shore).
   - Otherwise they stay. Their owner gets country flag `zin_west_stranded` and spirit `zin_west_stranded_host`.
5. Then `zin_west.62` *Terms on the Shore* fires to the Aenor realm at war with the faction:

| Option | Effect | AI |
| --- | --- | --- |
| **Let them stand with us** (historical) | The realm gives military access to every stranded country (`give_military_access`); then `white_peace` with every member; opinion `zin_west_fought_beside` is added later, not now | historical always; dynamic if the realm is at war with Zol or Volgan |
| **Let them go, but not on our soil** | `white_peace`; no access (the engine moves the stranded divisions out; they count as evacuated) | dynamic when not at war with a dark power |
| **No terms** | The war goes on; the stranded must surrender or fight | never for the AI |

6. Sets `zin_west_evacuated`; news `zin_west.66`. The faction stays in being while any member is stranded or at war with a dark power; otherwise it dissolves (`dismantle_faction`).

The Linux run must confirm that military access given before the white peace keeps the stranded divisions in place (acceptance 8). If it does not, the fallback is a 365-day non-aggression pact plus `give_military_access` after the peace.

**Stranded.** A stranded country:

- carries `zin_west_stranded_host` (supply and morale penalties, but higher defence: men with nowhere to run);
- gets `zin_west.63` *Those Left Behind*: send word home (−25 PP, stability +3 %) or make the best of it (war support +5 %);
- is invited to Eindil's coalition (section 11) and to fight Volgan and Zol;
- keeps its independence and its home government; the stranded divisions are simply still in the Middle Lands.

### 11. Joining Eindil's coalition

When Eindil returns (`zin_eindil_returned`), the journey's *Coalition of the Living* (journey event 94) invites "countries with armies stranded in the Middle Lands". This spec sets how the West answers:

- Every country with `zin_west_stranded` is invited, whatever its regard.
- AI acceptance (dynamic): 30 % + regard % (journey rule) + 40 % for a stranded country + 15 % with `zin_west_remembers_war_king`; historical rule: every stranded country accepts.
- Joining calls `zin_eindil_join_coalition`; adds opinion `zin_west_fought_beside` (+30) both ways with the Host of Eindil and every Aenor realm in the coalition; and spirit `zin_west_beside_former_foes`.
- Joining makes no country a subject (established).

**The long way home.** After `zin_afrit_dead` or `zin_eindil_crowned`, every stranded country gets `zin_west.70`: **Bring them home** (`zin_west_bring_home`: armies in Middle Lands states teleported to the capital; spirit removed; stability +5 %) or **Let those who wish stay** (half the stranded divisions are deleted, the country gets 10,000 manpower back and opinion +15 with the Aenor realm). Neither option is written as what history did; the text says "in this telling".

### 12. The other courses

**The Western Relief** (route relief). `zin_west_launch_relief` needs `zin_war_of_last_crowns` and an accepted request (`zin_west.50` *Letters from the West* to the Aenor realm: grant access, AI yes if at war with a dark power, historical rule no). It uses the same sailings, landing in friendly ports without a beachhead, and adds every pledged member to the realm's wars against Volgan, the Southern Dominion and Zol (`add_to_war`), and against Afrit's country once `zin_afrit_revealed`. Members join the Lost Cause (`zin_lost_cause_member`; `zin_lost_cause_add_strength` 5) and gain Eindil regard +15 (`zin_eindil_add_regard`). No strain; the stranded rules do not apply (allies sail home through friendly ports). Gathering Dark −3.

**The West Keeps Its Own Shore** (route divided): see section 5. Gunwaith's *First Crown of the West* line plays it.

**A western crown holds Parim** (proposed outcome, never history): on the hold route, if a faction member controls Parim on 1 Thaw 1760, or the Aenor realm capitulates to the faction, global flag `zin_west_holds_parim` is set and news `zin_west.71` fires. The world systems spec reads it as an outcome. If Eindil has returned and the holder's regard is ≥ 50, `zin_west.72` *The Heir Asks for Parim* lets the holder give the city to the Host of Eindil (`set_state_controller_to`; white peace with the Host; regard +25) instead.

### 13. The historical path

| Date (proposed) | Event |
| --- | --- |
| 1 Thaw 4A 1748 | Peace. Truce 40, unity 15, fleet 10, resolve about 29. |
| 4A 1748–1749 | Gunwaith's war-thanes press; raids at the ford; truce falls. Aenoran tariffs feed the grudge. |
| 1 Rainwake 4A 1750 | The truce breaks; the Grey Ford Feud (border war). |
| 4A 1750 | The Grey Ford Confederation names the stranger war-king; his peace ends the feud; unity +25; he lays the title down. Mistfall: the Golden King dies; Aurevan is crowned (grudge +5 everywhere). |
| 4A 1751 | Gunwaith convenes the Ford Council. |
| 4A 1752–1754 | Ships are built; Coldor sells timber; Triton's charts are bought. The Question of the Sea: the West chooses to cross. Eindil's warning (1754) is dismissed. |
| Rainwake 4A 1755 | `zin_war_of_last_crowns`: the Call to Cross, the pledges, the launch within 60 days. First sailing to Aenor Isle; second to the mainland shore. `zin_western_crossing`. |
| 4A 1756 | Afrit abandons Aenor. The Captains yield Parim (from Sowing). `zin_west_parim_taken`; the throne of men claimed. |
| Mistfall 4A 1756 – Ironfrost 4A 1757 | The Shore Calls; the evacuation; some armies stranded. Terms on the Shore: white peace with access. |
| Thaw 4A 1757 | Eindil returns; the stranded join his coalition. |
| 4A 1759–1760 | After Afrit's death, the long way home. |

### Peace gates

| Action | Earliest |
| --- | --- |
| The Grey Ford Feud | truce at 0 after 1 Thaw 1749; historical 1 Rainwake 1750; decision after 1 Thaw 1750 |
| Any western war goal on Aenor | crossing route and `zin_west_crossing_ready`; or `zin_cb_old_grudge` (diplomacy: `zin_gathering_dark` ≥ 40) |
| Early crossing | after 1 Thaw 1754, resolve ≥ 80, Aenor in civil war or at war with a great power |
| The Western Relief landing | `zin_war_of_last_crowns` |
| Gunwaith's war on Girdon (full war) | feud ended, `zin_gathering_dark` ≥ 25 or `zin_war_of_last_crowns`; never historical |

## Implementation

### Files

| Path | Content |
| --- | --- |
| `common/scripted_effects/zin_west.txt` | Effects below |
| `common/scripted_triggers/zin_west.txt` | Triggers below |
| `common/ideas/zin_west.txt` | Mechanic spirits |
| `common/dynamic_modifiers/zin_west.txt` | `zin_west_strain_mod` |
| `common/opinion_modifiers/zin_west.txt` | Opinion modifiers below |
| `common/decisions/categories/zin_west.txt`, `common/decisions/zin_west.txt` | Categories `zin_west_council` (The Ford Council) and `zin_west_crossing` (The Western Crossing) |
| `common/missions` (in `common/decisions/zin_west.txt`) | `zin_west_fleet_waits` |
| `events/zin_west.txt` | Namespace `zin_west` (mechanic-owned; may use `trigger` and `mean_time_to_happen`) |
| `common/on_actions/zin_west.txt` | `on_startup` → `zin_west.1`; `on_monthly` of the anchor → `zin_west.2`; `on_annex` (unity −15 for West–West annexation) |
| `common/game_rules/zin_west.txt` | `zin_rule_west_route` |
| `history/units/zin_west.txt` | Template `zin_west_crossing_host` for every West Lands country (warfare spec fills the battalions; placeholder 6 infantry, 1 artillery) |
| `localisation/english/zin_west_l_english.yml` | All text |

The content builder resolves country names to tags. The anchor country for the monthly pulse is Gunwaith; if it does not exist, the West Lands country with the most states.

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
| `zin_west_historical` | any | `zin_rule_west_route` = historical or `zin_rule_historical_path` is on |
| `zin_is_site_grey_ford`, `zin_is_site_west_landing_isle`, `zin_is_site_west_landing_shore`, `zin_is_region_west_lands`, `zin_is_region_middle_lands`, `zin_is_sea_central` | state / strategic region | generated site and region tests (see Map and site dependencies) |

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
| `zin_west_end_ford_war` (`how` = peace, decided, escalated) | any | Section 2 |
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
| `zin_west_bring_home` | country | Teleports its armies in Middle Lands states home; removes `zin_west_stranded_host` |
| `zin_west_monthly` | anchor | Drift; resolve; strain; dynamic modifier values; Shore Calls check |

Effects owned by other specs that this spec calls: `zin_diplo_grant_cb`, `zin_lost_cause_add_strength` ([diplomacy](../03_gameplay/03_diplomacy_and_factions.md)); `zin_world_add_gathering_dark` (world systems); `zin_eindil_add_regard`, `zin_eindil_join_coalition` ([journey](eindil_journey.md)); `zin_aenor_add_lost_cause` ([Aenor](aenor_court_and_succession.md)).

Engine effects used (all in the effect documentation): `start_border_war`, `cancel_border_war`, `create_wargoal`, `declare_war_on`, `add_to_war`, `white_peace`, `give_military_access`, `teleport_armies`, `set_state_controller_to`, `create_unit`, `damage_units`, `create_faction_from_template`, `add_to_faction`, `dismantle_faction`, `add_ai_strategy`, `add_opinion_modifier`, `add_dynamic_modifier`, `activate_mission`. Triggers: `has_naval_control`, `has_civil_war`, `has_border_war_between`, `controls_state`, `divisions_in_state`, `is_in_faction_with`.

### Spirits (mechanic)

| Key | Name | Modifiers | Added / removed |
| --- | --- | --- | --- |
| `zin_west_old_claims` | Old Claims Remembered | `opinion_gain_monthly_factor` −0.10 | Start, every West Lands country (start spec); removed by the war-king's peace (members) or by joining Eindil's coalition |
| `zin_west_aenoran_gold` | Aenoran Gold | `political_power_gain` 0.10 | Aenor's subsidy; 180 days |
| `zin_west_own_shore` | Our Own Shore | `stability_factor` 0.05, `political_power_gain` 0.05 | Divided route; 365 days |
| `zin_west_beachhead_host` | The Beachhead | `army_defence_factor` 0.10, `supply_consumption_factor` −0.10 | Each sailing; 180 days |
| `zin_west_generous_conquerors` | Generous Conquerors | `resistance_target_on_our_occupied_states` −0.10, `compliance_growth_on_our_occupied_states` 0.10 | *Accept the Surrenders* |
| `zin_west_claimant_of_parim` | Claimant to the Throne of Men | `political_power_gain` 0.20, `war_support_factor` 0.05, `stability_factor` −0.05 | Throne claimed; removed on evacuation |
| `zin_west_parim_defiant` | Parim Will Not Yield | `army_core_defence_factor` 0.15 | Aenor realm; 180 days |
| `zin_west_hold_fast` | Hold What We Took | `army_defence_factor` 0.10, `stability_factor` −0.05 | Hold route |
| `zin_west_stranded_host` | Stranded Beyond the Sea | `army_morale_factor` −0.05, `army_defence_factor` 0.10, `land_reinforce_rate` −0.02 | Stranded; removed by `zin_west_bring_home` |
| `zin_west_beside_former_foes` | Beside Former Foes | `army_morale_factor` 0.10, `army_org_factor` 0.05 | Joining Eindil's coalition; removed by `zin_west_bring_home` |

### Dynamic modifiers

| Key | Modifiers |
| --- | --- |
| `zin_west_strain_mod` | `army_morale_factor` = −`zin_west_strain_morale`; `supply_consumption_factor` = `zin_west_strain_supply` |

### Opinion modifiers

| Key | Value | Notes |
| --- | ---: | --- |
| `zin_west_conquerors` | −50 | Aenor realm → leader, throne claimed; decays 1 a month |
| `zin_west_pledge_holders` | −20 | Aenor realm → leader, pledge; decays 1 a month |
| `zin_west_fought_beside` | +30 | Both ways, stranded or relief member ↔ Host of Eindil and Aenor realms in the coalition |
| `zin_west_refused_the_call` | −10 | Convener → refuser |
| `zin_west_ford_blood` | −30 | Gunwaith ↔ Girdon when the truce breaks; decays 1 a month; removed by the war-king's peace |

Existing modifiers from the start situation are read or removed, not redefined: `zin_opinion_old_claims`, `zin_opinion_grey_ford_truce`.

### Decisions

**Category `zin_west_council` (The Ford Council)**, visible to West Lands countries.

| Key | Who | Available | Cost | Effect | AI |
| --- | --- | --- | --- | --- | --- |
| `zin_west_convene_council` | West Lands country with most states | Gunwaith has not convened by 1 Thaw 1752; `zin_west_council_can_meet` | 50 PP | `zin_west_convene_council` | always |
| `zin_west_end_the_truce` | Gunwaith or Girdon | truce ≤ 20; after 1 Thaw 1750; `zin_gathering_dark` ≥ 25 | 25 PP | `zin_west_break_truce` | dynamic 20 with war-thanes; historical never |
| `zin_west_choose_course` | convener, not Gunwaith | `zin_west_question_open`; after 1 Thaw 1753 | 50 PP | Three options as in section 5 | by route conditions |
| `zin_west_build_crossing_ships` | council member with a dockyard | route crossing or relief, or council sitting; 180-day cooldown | 50 PP, 120 days | fleet +3 (+5 with ≥ 3 dockyards) | every member with ≥ 100 PP |
| `zin_west_send_envoys` (targeted) | convener | council sitting; target a non-member West Lands country | 25 PP | target grudge +5; opinion +10; 120-day cooldown per target | targets with grudge ≥ 30 |

**Category `zin_west_crossing` (The Western Crossing)**, visible to faction members.

| Key | Who | Available | Cost | Effect |
| --- | --- | --- | --- | --- |
| `zin_west_launch` | leader, if Gunwaith is not leader | `zin_west_crossing_ready` | — | `zin_west_launch_crossing` |
| `zin_west_accept_surrenders` | leader, if Gunwaith is not leader | ≥ 3 Aenor-owned states controlled | 50 PP | `zin_west_grant_surrenders` |
| `zin_west_second_sailing` | leader | 90 days after the first; pledges outstanding | — | `zin_west_sail` (2) |
| `zin_west_sound_the_retreat` | leader | `zin_west_holds_aenor_states`; strain ≥ 40 | 25 PP | `zin_west_begin_evacuation` early |

### Events (namespace `zin_west`)

| Id | Title | For | Trigger | Options (AI) |
| --- | --- | --- | --- | --- |
| .1 | (hidden) Startup | every West Lands country | on_startup | Variables, grudge table |
| .2 | (hidden) Western pulse | anchor | monthly | `zin_west_monthly` |
| .10 | A Protest from the West | Aenor realm | Gunwaith focus *No Tariff Without Answer* | Lower the duty: −50 PP, protester grudge −10 (AI 20; ×2 if not ruled by the Golden Court) / Refuse: protester grudge +10, unity +3 (AI 80) |
| .15 | A God on Aenor's Throne | every West Lands country | `zin_aurevan_crowned` | "The temples rejoice; the old claims stir." grudge +5 |
| .20 | The Ford Commission | Girdon | Gunwaith focus | Sit with them: flag `zin_west_ford_commission`, truce +10 (AI 70; 30 if Girdon's grudge of Gunwaith is high) / Decline: truce −5 |
| .21 | A Raid at the Ford | Gunwaith or Girdon | MTTH 240 days, truce < 50 | section 2 |
| .22 | Blood at the Grey Ford | Gunwaith and Girdon | `zin_west_break_truce` | "To the ford!" |
| .24 | After the Feud | both | the border war decided | Make peace / Stay hostile |
| .25 | The Grey Ford Is Broken | West Lands (news) | `zin_west_break_truce` | OK |
| .26 | Peace at the Ford | West Lands (news) | `zin_west_end_ford_war` | OK |
| .30 | The Ford Council Convenes | every West Lands country | `zin_west_convene_council` | Send a delegate / Stay away |
| .31 | The Call to Cross | West Lands countries | `zin_west_call_pledges` | Pledge the host / Send ships, not men / Refuse |
| .40 | Where Shall the Host Land? | leader | launch | Aenor Isle first (hist) / Straight to the mainland shore |
| .41 | The Western Crossing | all (news) | launch | OK |
| .42 | Sails on the Western Sea | Aenor realm | each sailing | OK |
| .44 | Storm and Sail | leader | sailing under enemy naval control | OK |
| .50 | Letters from the West | Aenor realm | relief route | Grant passage / Refuse |
| .51 | The Western Relief | all (news) | relief landing | OK |
| .55 | The Keys of Parim | Aenor realm | section 8 | Yield / Fight for every street |
| .56 | Western Banners over Parim | all (news) | `zin_west_take_parim` | OK |
| .57 | The Throne of Men | leader | `zin_west_take_parim` | Claim the throne (hist) / Hold Parim as a pledge |
| .60 | The Shore Calls | leader | section 9 | Sail home (hist) / Hold what we took |
| .61 | The Fleet at the Shore | members | evacuation | OK (tooltip: march to the ports within 60 days) |
| .62 | Terms on the Shore | Aenor realm | after the mission | section 10 |
| .63 | Those Left Behind | each stranded country | evacuation resolved | Send word home / Make the best of it |
| .64 | The Host Breaks | members | strain 100 on hold route | OK |
| .65 | (hidden) The boats come in | leader | every 7 days during the mission | teleports armies in ports |
| .66 | The Western Fleet Sails Home | all (news) | `zin_west_evacuated` | OK |
| .70 | The Long Way Home | each stranded country | `zin_afrit_dead` or `zin_eindil_crowned` | Bring them home / Let those who wish stay |
| .71 | A Crown Across the Sea | all (news) | `zin_west_holds_parim` | OK |
| .72 | The Heir Asks for Parim | holder of Parim | hold route, `zin_eindil_returned`, regard ≥ 50 | Give him the city / Keep it |
| .80 | The West Keeps Its Own Shore | West Lands (news) | divided route | OK |
| .90 | Talk of Ships in Western Yards | Aenor realm | fleet 40 on the crossing route | Fortify the shore / Send gold west / Dismiss the tale (hist under Aurevan) |

### Game rules

`zin_rule_west_route` (group "ZIN story"): `historical` (default: crossing route, launch on the war, sail home, stranded join Eindil), `crossing_hold` (crossing, never sail home), `relief`, `divided`, `free` (AI weights from resolve, regard and unity). `zin_rule_historical_path` forces `historical`.

### Defines

None.

### Map and site dependencies

New rows for the key sites table ([../01_map/02_key_sites.md](../01_map/02_key_sites.md)), generated into `common/scripted_triggers/zin_sites.txt`:

| Trigger | Needs (proposed) |
| --- | --- |
| `zin_is_site_grey_ford` | The Gunwaith and Girdon border states on the river where the truce was signed (one per side). The Bridge of the Three Oaths and Girdon's Winter Ford (existing rows) should sit near it |
| `zin_is_site_west_landing_isle` | Aenor Isle states with a naval base (Asgard's and Aenor's) |
| `zin_is_site_west_landing_shore` | Middle Lands west-coast states with a naval base, nearest the West Lands |
| `zin_is_sea_central` | The strategic sea regions of the widened central sea (strategic-region scope) |
| `zin_is_region_west_lands`, `zin_is_region_middle_lands` | State-scope region tests (the pattern the Lerendor spec introduced) |
| `zin_aenor_fallback_seat` | A generated array of Aenor states nearest Parim, for the yielded garrison (Aenor spec may own it) |

## AI

- **Grudge and pledges** follow the chances in sections 1 and 7. Under the historical rule the thresholds are fixed.
- **Ford Council:** the AI convener takes *The Question of the Sea* when available and picks the route by `zin_rule_west_route`; on `free`, crossing weight = resolve, divided weight = 100 − resolve, relief weight = average regard × 2 (×0 before `zin_eindil_named`).
- **Fleet:** every AI member takes `zin_west_build_crossing_ships` whenever available and PP ≥ 100.
- **The Crossing:** the leader launches within 7 days of `zin_west_crossing_ready` on the war branch; never early under the historical rule. After landing, members get `add_ai_strategy` `invade` and `conquer` toward the Aenor realm; Gunwaith's tree adds `area_priority` toward the Middle Lands.
- **Parim:** the Aenor AI yields under the historical rule (section 8).
- **Evacuation:** on *The Fleet at the Shore* the AI members get `add_ai_strategy` `put_unit_buffers` (ratio 1.0, the evacuation ports) for 60 days so their armies march to the shore; what remains when the mission ends may be stranded.
- **Stranded:** AI strategy `befriend` toward the Aenor realm and the Host of Eindil; `prepare_for_war` and `conquer` toward Volgan and Zol; never `conquer` toward an Aenor realm after the white peace.

## Acceptance

1. A new game on 1 Thaw 4A 1748: grudge values as tabled; truce 40, unity 15, fleet 10, strain 0; Gunwaith and Girdon at peace with the engine truce and opinions in place; no western war goal or claim exists; no text names Eindil or Afrit.
2. No effect in this spec can start a war or a border war before the peace gates (scan of every `start_border_war`, `create_wargoal`, `declare_war_on` against the gate triggers).
3. Historical AI run, 4A 1748 to 4A 1760, `zin_rule_historical_path` on: the truce breaks between 1 Rainwake and 1 Highsun 1750; the feud ends by the war-king's peace in 1750; the Ford Council convenes by 1752; the crossing route is chosen; resolve ≥ 60 and fleet ≥ 50 by Thaw 1755; `zin_western_crossing` is set within 60 days of `zin_war_of_last_crowns`.
4. On that run: at least 12 western divisions stand in the Middle Lands within 120 days of the launch; `zin_west_parim_taken` is set in 4A 1756; the evacuation resolves before 1 Thaw 1757; at least one West Lands country has `zin_west_stranded`; every stranded country is in Eindil's coalition within 60 days of `zin_eindil_returned`.
5. With `zin_rule_west_route = divided`: no western country declares war on Aenor before 1760 in three seeds.
6. With `zin_rule_west_route = relief`: western divisions land in friendly ports and fight Volgan or Zol; no war with Aenor.
7. Scenario: Aenor holds naval control of the central sea at the first sailing: *Storm and Sail* fires, a quarter of the host is lost, fleet −10.
8. Scenario: military access before `white_peace` keeps stranded divisions in Aenor's states (Linux run, console check of division positions); if not, the fallback in section 10 is implemented and passes the same check.
9. The compiler's secret check passes: no `zin_west` text reachable before `zin_afrit_revealed` names Afrit; no text visible before `zin_eindil_awake` mentions the stranger.
10. Every modifier key here exists in the game's modifier documentation; every engine effect and trigger named exists in the effect and trigger documentation.
11. Scenario: `zin_west_break_truce` run on 1 Thaw 1749, while the engine truce stands, starts the Grey Ford Feud; if the engine refuses, the truce-at-0 path is gated to 1 Thaw 1750 and the scenario repeats on that date.

## Dependencies on other specs

- [Eindil's journey](eindil_journey.md): stage 3 must read `zin_west_grey_ford_war` as its "western war is running" test and end the feud with `zin_west_end_ford_war` instead of `white_peace`; event 94 must apply the stranded acceptance bonus of section 11 and invite every `zin_west_stranded` country.
- [Diplomacy](../03_gameplay/03_diplomacy_and_factions.md): new faction template `zin_faction_western_crossing` and joining rule `zin_faction_rule_join_crossing` (West Lands, Triton's Islands, or a Cold Lands country with `zin_cold_joins_crossing`); the casus belli `zin_cb_broken_truce` is granted by `zin_west_break_truce`.
- [Aenor](aenor_court_and_succession.md): `zin_aenor_ruled_by_captains`, `zin_aenor_parim_lost`, `zin_aenor_is_realm`; owns or accepts `zin_aenor_fallback_seat`.
- [Economy](../03_gameplay/02_economy.md): "Subsidise a Western Court" also calls `zin_west_add_grudge` (−10) and adds `zin_west_aenoran_gold`.
- [Cold Lands](cold_lands.md): `zin_cold_sell_timber_west` adds fleet.
- Warfare spec (not yet written): template `zin_west_crossing_host`; equipment and ship types.
- World systems: reads `zin_western_crossing` and `zin_west_holds_parim`; owns `zin_world_add_gathering_dark`.
- Historical path ([03_gameplay/06_historical_path_and_ai.md](../03_gameplay/06_historical_path_and_ai.md), not yet written): the dates in section 13 are its western checkpoints.

## Open questions

1. **Who led the Crossing?** This spec makes the convener of the Ford Council the leader, Gunwaith on the historical path. Was it Gunwaith, another crown, or a council with no single leader?
2. **Who claimed the throne of men?** The text names only "the western claimant". Should a ruler be named?
3. **Where did the fleets land?** The spec proposes Aenor Isle first, then the Middle Lands' west shore. Is Aenor Isle the right stepping stone?
4. **The truce at the start.** The start-situation spec writes an engine truce to 1 Thaw 1750 with −10 opinion. Should the Truce of the Grey Ford also be a non-aggression pact, or is the engine truce enough?
5. **Who broke the truce?** The historical path has Gunwaith's war-thanes break it. Should it be Girdon, a raid by neither, or left as an accident at the ford?
6. **The stranded after the war.** Should the stranded stay as settlers, go home, or should the game leave both open (as now)?
7. **Girdon in the Crossing.** Did Girdon cross with Gunwaith after the war-king's peace? The spec lets it pledge if it accepted the peace.
