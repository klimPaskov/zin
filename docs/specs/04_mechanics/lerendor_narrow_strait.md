# Lerendor and the Treaty of the Narrow Strait

**Status:** Ready. Reviewed 19 October 2026 against CONVENTIONS "Status"; integrated 19 October 2026. **Priority:** 3. **Phase:** 3. Built by `tools/content/modules/mech_lerendor_strait.mjs`; depends on the calendar ([../00_foundation/01_start_and_calendar.md](../00_foundation/01_start_and_calendar.md)) being built, because every date below is an Erdae engine date (the game still starts 1936.1.1.12 today).

## Purpose

Lerendor is the united crown of Lerendor and Lerenwaith, the strongest power of the North Lands and the northern counterweight to Aenor. Its whole story in the Fourth Age is one question: what does the North owe Aenor? This spec defines the mechanic that asks it:

- **Strait standing** (`zin_strait_standing`): how Lerendor stands under the Treaty of the Narrow Strait, from bitter (-100) to trusted (+100).
- **The toll quarrel**: the strait dues and the old grievance of 4A 1716, the main peacetime lever on standing.
- **The Leren Compact and the smaller crowns**: who in the North Lands looks to Sonargur and who to Parim, and how far Lerendor can lead them (`zin_leren_hegemony`).
- **Three routes**: honour the treaty, break it, or turn it into Leren supremacy over the strait.
- **The withdrawal at the war**: the established break with Aenor, timed to the War of the Last Crowns.
- **The Dark Lands across the straits** and **Zol's dead from the north**: the two dangers on Lerendor's other shores.

The focus tree [../05_focus_trees/major/lerendor.md](../05_focus_trees/major/lerendor.md) drives this mechanic; the North Lands trees ([../05_focus_trees/regional/north_lands.md](../05_focus_trees/regional/north_lands.md)) move the smaller crowns' lean. Other specs touch it only through the scripted effects, triggers and flags listed here.

The treaty meets the Western Crossing ([western_crossing.md](western_crossing.md)) in three places, and both specs say the same thing: the West's declaration of war on Aenor is a defensive war for Aenor, so it fires the call to honour the treaty (section 6); the West's resolve reads Lerendor's route and withdrawal; and the West sails across the central sea, not through the Narrow Strait, so closing the strait (section 8) never stops a western sailing.

## Lore basis

| Fact | Status | Source |
| --- | --- | --- |
| Lerendor and Lerenwaith are one crown and one country | established (owner merge) | *Great Powers and Relations*, *Erdae and Its Regions* |
| Seat at Sonargur | established working seat (constructed name, replaceable) | *Great Powers and Relations* |
| Lerendor leads the **Leren Compact**; its rival is Aenor | established working table | *Great Powers and Relations*, *Kingdoms Factions and Conflicts* |
| The working table lists Eekedor and Andos Enda in the Compact; the map starts it with Eekedor only. Decided (S5): Andos Enda, an elven realm bound by the Elven Refusal, is **not** in the Compact at the start; Lerendor can court it | working table vs map; decision S5 | *Great Powers and Relations*; [INTEGRATION_DECISIONS.md](../INTEGRATION_DECISIONS.md) |
| The North Lands lie north of the Middle Lands across a narrow strait; the Dark Lands lie between Lerendor and the Middle Lands across narrow straits | established geography | *Erdae and Its Regions* |
| The Narrow Strait of the treaty is the strait between the North Lands and the Middle Lands; the straits between the Dark Lands and its neighbours are the Dark Lands spec's northern and southern Dark Straits | proposed (owner short list 3, working proposal) | [OPEN_QUESTIONS.md](../OPEN_QUESTIONS.md); [dark_lands.md](dark_lands.md) |
| In the final war the northern lands **withdraw from the old alliance** with Aenor; this is political separation, and the North Lands are not one unanimous enemy | established | *Fourth Age Canon Register*, *War of the Last Crowns*, *The Fourth Age of Erdae* §VIII–IX |
| Zol's forces move from the black north **through islands and straits** toward the settled kingdoms; ordinary weapons cannot permanently kill Zol's dead; Glo's magic and Horos's sword can destroy them | established | *The Fourth Age of Erdae* §IX, *Zol* |
| Northern companies join Eindil's temporary coalition without surrendering their independence; competing northern interests remain after the war | established (chronicle and *War of the Last Crowns*) | *The Fourth Age of Erdae* §X, *Fifth Age Seeds* |
| The name **Treaty of the Narrow Strait** for the old alliance; its date 4A 512 | proposed | *Fourth Age Chronology* |
| The union of the Leren crowns by marriage in 4A 411 | proposed | *Fourth Age Chronology* |
| The **toll quarrel** of 4A 1716, when Leren envoys were humiliated in Parim | proposed | *Fourth Age Chronology* |
| Lerendor can honour the treaty, abandon it, or become master of the strait | proposed (play choices, not history) | *The Campaign of 4A 1748* |
| The withdrawal falls in 4A 1755; the start is 1 Thaw 4A 1748 | proposed dates | *Fourth Age Chronology* |
| Avarin of Lerenwaith, a Second Age envoy (memory only; this spec uses her in no event) | proposed character | *Second Age Proposed Characters* |

Everything else in this spec is **proposed**: the standing scale, toll levels, union cohesion, hegemony, the Lerenwaith estates, the arbitration at Eekedor, the North shore and strait sites, all characters, all numbers and all event text.

This spec never states as history who wins the War of the Last Crowns, what treaty the North signs after it, or anything the vault leaves open about Zol's servants. Outcomes offered by gameplay are labelled as outcomes.

## Design

### The situation on 1 Thaw 4A 1748

The treaty is in force. Aenor and Lerendor are at peace and trade freely. Aenoran ships pay the old fixed due at the strait. The Leren court remembers 1716 and resents Parim, but nobody plans a war. Lerendor leads the Leren Compact with Eekedor. Sensai, Molot, R'en, Mina and the other small crowns are independent and courted by both Sonargur and Parim. Andos Enda, an elven realm of the Magical Lands, exchanges friendly letters with Sonargur (proposed, Magical Lands trees) but stays outside the Compact (decision S5).

**Start state from the [start situation](../02_lore/01_start_situation.md)**, read or removed here, never redefined (decision N5 naming): opinion `zin_opinion_toll_of_1716` ("The Toll of 1716", −20, Lerendor toward Aenor) and `zin_opinion_northern_pride` ("Northern Pride", −10, Aenor toward Lerendor). This spec adds `zin_leren_treaty_partner` (+20, both ways) at the start. Standing starts at this spec's −15, which the start situation also uses (decision V1: the owning mechanic's value).

**What exists today (commit ca01fa3).** The Compact exists as a politics-step faction with Eekedor. Neither start opinion above is in the game yet (the vanilla-removal module defines only three other start opinions), and no country carries a `zin_region_<key>` flag. This mechanic depends on the start-situation build, the economy spec's region flags and the diplomacy spec's faction template `zin_faction_leren_compact`; its build test fails, naming the missing key, if any is absent from the staged tree. It creates no country tag (the total stays at 380 of the 439 the flag sheet allows) and replaces no interim stub: the interim Long Peace tree stays until the Lerendor tree replaces it for Lerendor.

**"Aenor"** in this spec is the country with Aenor's own tag, the crown that signed the treaty. A civil-war breakaway (`zin_aenor_is_realm` but another tag) is not a treaty partner.

**Dates.** The only fixed dates here are peace gates (1751.3.1 for the Question of the Strait; 1749.3.1 to 1755.12.31 for the fishermen's tales). They are not historical floor dates, so they do not read `zin_story_pace` (decision V4); the historical timing comes from relative delays after the story flags.

Nothing at start is hostile. No wargoal, no claim on Aenor and no war-only decision is available before a story flag or a deliberate route choice (see [Peace gates](#peace-gates)).

### 1. Strait standing

`zin_strait_standing` (Lerendor, -100 to 100; shared contract) measures how Lerendor stands under the treaty. High means the treaty is trusted on both sides. Low means the North feels bound by a treaty that serves only Parim.

**Start value:** -15 (proposed; the grievance of 1716 is unresolved).

**Bands** (proposed). The band is refreshed whenever standing changes and monthly.

| Band | Range | Spirit on Lerendor | Meaning |
| --- | --- | --- | --- |
| Trusted | 40 to 100 | `zin_leren_treaty_trusted` | The honour route is cheap; Aenor's calls are welcome |
| Strained | -39 to 39 | none | The usual state |
| Broken faith | -100 to -40 | `zin_leren_treaty_broken_faith` | Withdrawal is possible after the King's death; the AI withdraws when the war comes |

**Monthly drift** (proposed targets; applied by `zin_leren_monthly`):

| Source | Per month |
| --- | --- |
| Toll level 0 (free passage) | +0.3 |
| Toll level 1 (treaty toll) | 0 |
| Toll level 2, 3, 4 | -0.2, -0.4, -0.6 |
| Aenor's `zin_court_corruption` at 70 or more (the Golden Court's insolent envoys) | -0.1 |
| Route flag: honour / break / supremacy | +0.5 / -0.2 / -0.4 |
| Treaty already ended (`zin_leren_withdrawal`) | no drift; standing is frozen |

**One-off changes** (proposed):

| Cause | Change |
| --- | --- |
| Aenor pays redress in the toll quarrel | +20 |
| Toll quarrel sent to arbitration | +5, then +10 or -5 by the ruling |
| Aenor mocks the Leren envoys again | -10 |
| `zin_leren_appeal_to_the_treaty` decision | +5 |
| Lerendor calls Aenor to its own defensive war (the diplomacy spec's `zin_diplo.11`): Aenor sends the host / sends words | +15 / −10 |
| A toll incident: seize / waive | -5 / +3 |
| Renew oaths to Aurevan's crown / delay / refuse | +15 / -5 / -15 |
| Honour Aenor's call to war / delay / refuse | +20 / -10 / -25 |
| Focus effects | see the tree spec |
| Aenor, Afrit, Eindil, diplomacy and the North Lands trees | through `zin_leren_add_strait_standing` only |

**Historical target:** standing about -60 to -75 by Thaw 4A 1755, so the AI withdraws when the war begins. The acceptance run checks the range -75 to -55.

### 2. The toll quarrel and the strait dues

The strait is Lerendor's wealth. Every ship between the Leren sea and the Aenoran sea pays at Sonargur, except as the treaty limits it. In 4A 1716 Lerendor claimed a higher due from Aenoran ships; its envoys were laughed out of Parim (proposed). The quarrel was never settled.

**Toll level** `zin_leren_toll_level` (Lerendor, 0–4; start 1):

| Level | Name | Who may set it | Effect through dynamic modifier `zin_leren_strait_dues` |
| --- | --- | --- | --- |
| 0 | Free Passage | any time | political_power_gain 0, consumer_goods_factor 0; standing +0.3/month |
| 1 | The Treaty Toll | any time | political_power_gain +0.05, consumer_goods_factor -0.01 |
| 2 | Leren Dues | any time | political_power_gain +0.10, consumer_goods_factor -0.02 |
| 3 | Full Strait Dues | after focus *Full Strait Dues* (tree flag `zin_leren_full_dues`) | political_power_gain +0.15, consumer_goods_factor -0.03 |
| 4 | The Iron Toll | supremacy route, after focus *The Iron Toll* (tree flag `zin_leren_iron_toll`) | political_power_gain +0.25, consumer_goods_factor -0.04; every North Lands country loses 0.5 lean per month |

Levels 3 and 4 also cost 0.5 lean per month with coastal North Lands crowns whose merchants pay the toll (`zin_leren_monthly`).

**The toll quarrel chain** (events `zin_leren.10`–`.13`, opened by the tree's Reopen the Toll Quarrel focus):

1. Lerendor reads the old toll rolls and decides whether to press the claim.
2. Aenor receives the envoys. Options: pay redress, send the case to arbitration in Eekedor, or mock the envoys as in 1716. The AI chance of mocking rises with Aenor's `zin_court_corruption`; on the historical path the Golden Court mocks them.
3. Lerendor hears Parim's answer. Redress removes the grievance spirit and opens the cheap honour route. Mockery swaps it for a harsher one and raises standing loss.
4. Arbitration (proposed: before the Eekedor council) rules after 60 days: for Lerendor with chance 50 + Eekedor's lean ÷ 4 (the Eekedor tree's *An Impartial Bench* moves that lean halfway to 0).

Owner question 2 proceeds on this proposal: the quarrel is about Aenoran ships paying at Sonargur.

Random toll incidents (`zin_leren.15`) fire while the toll is 2 or more and the treaty stands, about once every two years.

**The Golden Court's answer on the historical path.** In `zin_leren.11` the AI of Aenor mocks the envoys ("Laugh them out") whenever `zin_rules_is_historical` is true and the Golden King reigns; otherwise it uses the weights in the events table.

### 3. The union of the two crowns

Lerendor and Lerenwaith are one country, but they were two crowns until 4A 411 (proposed). The tree's court branch is about keeping them one throne. `zin_leren_union_cohesion` (Lerendor, 0–100, start 55) drives a dynamic modifier `zin_leren_union`:

- stability_factor = (cohesion − 50) / 500, so -0.10 to +0.10;
- political_power_factor = (cohesion − 50) / 1000, so -0.05 to +0.05.

Cohesion moves through focuses, events and these monthly sources: -0.2 while toll level is 3 or 4 (Lerenwaith's inland lords pay for the strait captains' quarrel); +0.2 while the estates' spirit is active. At 25 or below, `zin_leren.80` (The Lerenwaith Question) can fire. No route ever splits Lerenwaith into a separate country: the owner merged them.

### 4. The Leren Compact and the smaller crowns

The Compact is the in-game faction Lerendor leads at start (localised "Leren Compact"; Eekedor is its member). The diplomacy spec owns its template `zin_faction_leren_compact` and joining rule `zin_faction_rule_join_leren` (`zin_leren_is_north_crown` or `zin_leren_is_dark_shore`, or a Lerendor subject, and not bound by the Elven Refusal). The North Lands' other 26 crowns are independent (today's map: 28 North Lands countries, 60 states).

**Lean** `zin_leren_lean` (each North Lands country except Lerendor, each Dark Lands coastal country (section 9) and Andos Enda; -100 Parim to +100 Sonargur):

| Country | Start lean | Note |
| --- | ---: | --- |
| Eekedor | 60 | Compact member, commercial republic |
| Mina | 15 | |
| The Hold | 15 | |
| Tolhon | 10 | island principality |
| Belg | 10 | |
| Sensai | -5 | the most populous North Lands crown; proud |
| Molot | -20 | marcher state that balances Lerendor |
| R'en | -25 | the southern gateway between the Leren and Aenor seas; lives on Aenoran trade |
| every other North Lands country | 5 | |
| Andos Enda | 10 | Magical Lands elven realm; courtable, not a member (S5) |

Lean moves through Compact decisions (below), focuses, toll levels and Aenor's counter-courting. Aenor's spec may court the same crowns by calling `zin_leren_add_lean` with negative values.

**Andos Enda (decision S5).** Lerendor may court it with envoys, trade charters and marriage pacts like a North Lands crown (scripted trigger `zin_leren_is_compact_target`). It cannot be invited while it is bound by the Elven Refusal: the invitation needs its country flag `zin_refusal_lifted` (diplomacy spec) and the Andos Enda clause of the diplomacy spec's joining rule `zin_faction_rule_join_leren`. Protection is never offered to it.

**Hegemony** `zin_leren_hegemony` (Lerendor, 0–100), recomputed monthly by `zin_leren_update_hegemony`:

- For every state in the North Lands (`zin_is_region_north_lands`) that is not one of Lerendor's six starting states: weight 1 if controlled by a Compact member; 1.5 if controlled by Lerendor or a Lerendor subject.
- Hegemony = min(100, 100 × total weight ÷ 54). At start it is about 2 (Eekedor's one state).

Dynamic modifier `zin_leren_hegemony_mod`: political_power_gain = hegemony ÷ 400 (up to +0.25); faction_trade_opinion_factor = hegemony ÷ 500 (up to +0.20).

| Hegemony | Unlocks |
| ---: | --- |
| 20 | Compact Levies focus effects at full strength |
| 40 | Supremacy route can be chosen |
| 60 | One Banner for the North can offer protection (subjecthood) |
| 80 | The Leren Hegemony outcome focus |

### 5. The three routes

The tree's focus **The Question of the Strait** opens three mutually exclusive route focuses. Each sets a country flag on Lerendor.

The AI's route follows this spec's game rule `zin_rule_leren_route` (Game rules, below) under the foundation's precedence ([../00_foundation/05_defines_and_rules.md](../00_foundation/05_defines_and_rules.md)): `DEFAULT` follows `zin_rule_historical_path` (HISTORICAL: break; PLAUSIBLE: the free weights with break ×3; FREE: the free weights in the AI section); any other option forces its branch. Scripts read it through the foundation's generated triggers `zin_rules_ai_branch_leren_<option>`. Rules never act on a player's country.

| Route | Flag | Opens when | What it means |
| --- | --- | --- | --- |
| **Honour the Treaty** | `zin_leren_route_honour` | standing ≥ -30 | Lerendor keeps the old alliance. When Aenor is attacked, the North comes. After the King's death it must decide whether it serves Aenor's crown or Aenor's realm. |
| **The North Stands Apart** (break; historical) | `zin_leren_route_break` | standing ≤ 30 | Lerendor withdraws from the treaty at the war, holds its own coasts against Zol's dead and keeps out of Aenor's wars. Northern companies may still join Eindil's coalition, as free men. |
| **Mastery of the Strait** (supremacy) | `zin_leren_route_supremacy` | hegemony ≥ 40, or focus `zin_lerendor_masters_of_the_strait_waters` (*Masters of the Strait Waters*) done | Lerendor tears up the treaty and uses the war to make the North master of the strait: R'en, the far shore and the Dark Lands coast. |

The Question itself is available only after `zin_golden_king_dead`, or from 1 Thaw 4A 1751, or when standing is at or beyond ±60. Nothing in 4A 1748 can force the choice.

Route outcomes the other specs may read:

| Global flag | Set when | Meaning |
| --- | --- | --- |
| `zin_leren_withdrawal` (contract) | Lerendor leaves the treaty | Historical 4A 1755 |
| `zin_leren_treaty_honoured` (new) | Lerendor joins Aenor's defensive war under the treaty | Outcome, not history |
| `zin_leren_strait_supremacy` (new) | Lerendor proclaims itself Sovereign of the Narrow Sea | Outcome "Lerendor becomes master of the strait" (proposed outcome) |

### 6. Honouring the treaty: the call to war

The treaty is not a HOI4 guarantee: Lerendor is never pulled into a war automatically. Instead, while `zin_leren_treaty_in_force` holds, the monthly check fires `zin_leren.20` (Aenor Calls on the Treaty) when Aenor has a defensive war (`has_defensive_war_with`) against a country that is not in Lerendor's faction, not Lerendor's subject and not yet flagged. When it fires, every country then at war with Aenor gets country flag `zin_leren_called_against`, so one war with many attackers (the Western Crossing's pledged hosts) calls once; the monthly check clears the flag from a country once Aenor is no longer at war with it, so a later war calls again. FROM of the event is the first unflagged attacker. This is decision O9's rule: when Aenor's defensive war has many attackers, the treaty is called once.

**On the historical path the first call is the Western Crossing's war** (4A 1755: the West's declaration on Aenor, [western_crossing.md](western_crossing.md) section 7), or Volgan's if he declares first. Lerendor's AI refuses on the break route; at the standing it has by then (−55 or lower), the refusal withdraws it from the treaty at once. On the honour route Lerendor may join Aenor against the Crossing; the West's sailings then count Leren fleets in their naval-control test.

Options in this order (decision E2: a timed-out event takes its first option, so the non-committal answer comes first and the historical one second):

| Option | Effect | AI chance |
| --- | --- | --- |
| Ask for time | standing -10; the event repeats once after 90 days (country flag `zin_leren_asked_for_time`) | no route 40; honour 10; otherwise 0 |
| Refuse (historical) | standing -25; if standing is then -40 or lower, `zin_leren_withdraw` | break and supremacy 100; no route 20; honour 0 |
| Honour the oath | `zin_leren_join_aenor_defence` (Lerendor joins every defensive war of Aenor via `add_to_war`, `targeted_alliance` = Aenor); standing +20; global flag `zin_leren_treaty_honoured`; news `zin_leren.33` | honour route 90; no route 40; break and supremacy 0 |

A human Lerendor that lets the event time out asks for time; the repeat that follows times out to the same answer, and the AI fallback does not act for a human, so `zin_leren.36` and the withdrawal triggers decide.

Aenor is told by `zin_leren.21`. Aenor's own obligation to Lerendor is the diplomacy spec's (`zin_diplo.11` *The North Calls on the Treaty*, [../03_gameplay/03_diplomacy_and_factions.md](../03_gameplay/03_diplomacy_and_factions.md)); it reads `zin_leren_treaty_in_force` and changes standing through `zin_leren_add_strait_standing`.

### 7. The withdrawal at the war

The established break happens when the War of the Last Crowns begins. `zin_leren_withdraw` (scripted effect) does all of it:

1. Sets global flag `zin_leren_withdrawal` and global variable `zin_leren_withdrawal_date` (= `global.date`, shown by the interface's Strait panel as "Withdrawn on [date]"); freezes `zin_strait_standing`.
2. Removes opinion modifier `zin_leren_treaty_partner` both ways and adds `zin_leren_treaty_broken` both ways.
3. Ends military access between Aenor and Lerendor both ways (`diplomatic_relation = { country = … relation = military_access active = no }`).
4. Removes Lerendor from any faction Aenor leads (`leave_faction`; not the case at start; possible on the honour route).
5. Adds `zin_leren_treaty_torn` to Lerendor for 365 days and removes `zin_leren_grievance_unanswered`.
6. Calls `zin_world_add_gathering_dark` with 4 (the world tension spec's value).
7. Fires `zin_leren.30` for Lerendor, `zin_leren.31` for Aenor and news `zin_leren.32` for everyone.

The Western Crossing reads the flag: the West's resolve gains +5 once the North has left Aenor.

The withdrawal is **not** a declaration of war on Aenor. On the break route no wargoal against Aenor is ever generated. On the supremacy route, claims on the far shore come from separate focuses after the withdrawal.

**Triggers of the withdrawal:**

| Path | When |
| --- | --- |
| Break route focus Withdraw from the Treaty | `zin_war_of_last_crowns`, or `zin_golden_king_dead` and standing ≤ -60 |
| Supremacy route focus Tear Up the Treaty | same conditions |
| Refusing Aenor's call at standing ≤ -40 | any time (historically the call caused by the Western Crossing's war, 4A 1755) |
| AI fallback `zin_leren.35` (hidden) | 30 days after `zin_war_of_last_crowns`, if Lerendor is AI, not on the honour route, standing ≤ -40 and the treaty still stands |
| Player prompt `zin_leren.36` | 14 days after `zin_war_of_last_crowns`, if a human Lerendor has taken no route: honour now, withdraw now, or wait |

### 8. Closing the strait

On the break and supremacy routes, and on any route while Lerendor is at war, the decision `zin_leren_close_the_strait` (targeted) shuts the strait to one country's shipping. Target: a country at war with Lerendor, or, after `zin_leren_withdrawal`, any country at war that is not in Lerendor's faction. Requires `zin_leren_guards_strait` (Lerendor or its subjects control Sonargur and every `zin_is_site_strait_north` state: its own shore of the strait) and either the tree flag `zin_leren_seas_closed` (*Close the Northern Seas*) or the completed focus `zin_lerendor_strait_watch` (*The Strait Watch*). Cost 50 political power. The target gets `zin_leren_strait_closed` for 180 days and opinion modifier `zin_leren_strait_closed_on_us`.

Closing the strait slows and shortens the target's own fleets (the spirit's modifiers). It does not stop the Western Crossing's scripted sailings, which cross the central sea, not the strait ([western_crossing.md](western_crossing.md) section 7; decision O9). Closing needs only Lerendor's own shore (O9).

**Holding the whole strait.** `zin_leren_holds_strait` is stricter: Lerendor or its subjects also control R'en's strait states (`zin_is_site_strait_gateway`). It gates *Sovereign of the Narrow Sea*, the strait-barred hook and the world tension outcome *Master of the Strait* (decision O9: these need R'en's coast too). On the historical path R'en stays its own, so Lerendor guards the strait but does not hold it.

### 9. The Dark Lands across the straits

South-west of Sonargur, across narrow straits, lie the Dark Lands: Goldoroth the orc kingdom that wants the whole region, Dondor and its Dark Sea Accord with Belonton, the free human towns of Blackton, and a dozen orc and goblin holds. Volgan's agents court them; most answer only to themselves (established).

The mechanic gives Lerendor three tools, all opened by the tree's Dark Shore branch:

- **Lean** also exists on Dark Lands coastal countries (`zin_leren_lean`, start 0; Blackton 10; Dondor 10; Goldoroth -20; the same values as the Dark Lands spec's table). The Compact decisions accept Dark Lands targets once the tree flag `zin_leren_dark_shore` (*Across the Dark Straits*) is set. The Dark Lands spec's `zin_dark.31` and the Goldoroth raids also move this lean.
- **Protection**: Blackton and coastal holds may accept Leren protection (`zin_leren.71`) once the tree flag `zin_leren_dark_protection` (*The Dark Shore Protectorate*) is set, at lean 80, or at lean 60 on the supremacy route or when the target has the Blackton tree's flag `zin_regional_blackton_seeks_protection`.
- **Wars on the Dark Shore** open only when Goldoroth is at war with Dondor or Blackton, or after `zin_war_of_last_crowns`.

Learning of Volgan's agents in the holds (tree event `zin_lerendor.10`) sets country flag `zin_leren_heard_whispers`. It reveals nothing about Volgan's march. The Dark Straits themselves (sites, tolls, closing) belong to the [Dark Lands](dark_lands.md) spec.

### 10. Zol's dead from the north

Zol's Mistake is the black north and the islands of the Ocean of Zol. When Zol's dead rise (`zin_zol_rising`, Zol's Mistake spec), they come "through islands and straits". Proposed reading: the Narrow Strait is one of their roads south to the Middle Lands, so Lerendor stands in their path whatever its route.

Before `zin_zol_rising`, Lerendor sees only hints: fishermen's tales of black ships (`zin_leren.50`, flavour; no gameplay advantage beyond a flag). After it:

- `zin_leren.51` (The Dead on the Northern Shore) fires for Lerendor and every North Lands country with a coast; Lerendor's AI switches to defence (see AI).
- The tree's Long Watch branch unlocks its war focuses.
- Scripted trigger `zin_leren_strait_barred` is true while `zin_leren_holds_strait`, Lerendor is at war with Zol (`zin_is_zol`), and focus `zin_lerendor_hold_the_capes` or `zin_lerendor_the_watch_holds` is completed. **Proposed hook for the Zol spec:** while it is true, Zol's crossing into the Middle Lands through the strait is slowed or redirected. The Zol spec decides how; this spec only provides the trigger.
- Ordinary Leren troops cannot permanently kill Zol's dead (established). Focus Seek the Old Wards sets `zin_leren_seeks_wards`; the magic and world systems spec ([../03_gameplay/04_magic_and_world_systems.md](../03_gameplay/04_magic_and_world_systems.md)) decides whether that grants access to warding units or magic. This spec gives no such power itself.

### 11. The Deliverer, Aurevan and Eindil

- The Deliverer's temples exist in Lerendor as everywhere (Lerendor starts with footholds 2, Afrit spec). Focuses and events change `zin_footholds` only by calling the Afrit spec's `zin_afrit_add_footholds` (argument `value`, scope the target country). Afrit owns the name; this spec and the Afrit spec mean the same effect (decision N11).
- When `zin_aurevan_crowned` is set, Aurevan's envoys ask Lerendor to renew its oaths (`zin_leren.41`). No text names Afrit before `zin_afrit_revealed` (decisions D1, D3).
- When the journey's *Warnings of the Heir* (`zin_eindil.83`, which reaches every great power) fires, it also fires `zin_leren.45` for Lerendor (the war events spec's wiring): the rumour of a stranger in Aenor whom Parim calls an impostor, with Lerendor's own small choice. No monthly check fires `.45`. Text names him through `[zin_loc_eindil]` ("the Man from the Ice" before `zin_eindil_named`, decision D4).
- Eindil-dependent focuses (Faithful to the Realm, Free Companies, Northern Companies, A Treaty Among Equals) read the contract flags `zin_eindil_named`, `zin_eindil_returned`, `zin_afrit_dead` and `zin_eindil_crowned`.

### 12. The historical path

| Date (proposed) | Event |
| --- | --- |
| 1 Thaw 4A 1748 | Peace. Standing -15. Toll 1. The Compact is Lerendor and Eekedor. |
| 4A 1749 | Lerendor reopens the toll quarrel. The Golden Court mocks the envoys (-10). Toll raised to Leren Dues. |
| Mistfall 4A 1750 | The Golden King dies (`zin_leren.40`). Aurevan is crowned; his envoys ask for renewed oaths; the court delays (-5). |
| 4A 1751 | The Question of the Strait. Lerendor stands apart (break route). |
| 4A 1752–1754 | The Compact grows (Mina, The Hold and two or three small crowns; hegemony about 20–30). Fishermen's tales. Eindil's warning is heard and dismissed. |
| Thaw 4A 1755 | Standing about -60 to -75. |
| 1 Rainwake 4A 1755 (CP 11) | `zin_war_of_last_crowns`. Within weeks the West declares war on Aenor; Aenor's call (`zin_leren.20`) is refused and Lerendor withdraws (`zin_leren_withdrawal`, CP 12: within 60 days of the war; the hidden fallback `zin_leren.35` withdraws at day 30 if no call came). |
| 4A 1755 (from Goldfield) | `zin_zol_rising` (CP 16): the dead reach the northern shore. Lerendor guards its shore and closes the strait to belligerents. |
| 4A 1757 | `zin_eindil_returned` (CP 19): free northern companies join Eindil's coalition (focus *Free Companies for the Coalition*, flag `zin_leren_companies_with_eindil`). Lerendor stays independent. |
| 4A 1759–1760 | After Afrit's death or Eindil's crowning, Lerendor may offer a treaty among equals. Whether one is signed is a play outcome; the vault leaves the post-war order open. |

### Peace gates

| Action | Earliest |
| --- | --- |
| Any wargoal or claim against Aenor | supremacy route and `zin_leren_withdrawal` |
| Wargoal against R'en | supremacy route and (`zin_war_of_last_crowns` or R'en at war with Lerendor's faction) |
| Wargoals on the Dark Shore | Goldoroth at war with Dondor or Blackton, or `zin_war_of_last_crowns` |
| Closing the strait | Lerendor at war, or after `zin_leren_withdrawal` |
| Long Watch war focuses | `zin_zol_rising` |
| The Question of the Strait | `zin_golden_king_dead`, or from 4A 1751.3.1, or standing at ±60 |

## Implementation

### Builder module, data and test

- **Module:** `tools/content/modules/mech_lerendor_strait.mjs`, exporting `buildLerendorStrait(staged, ctx)`, imported by `tools/content/build.mjs` like the existing modules and applied in the same atomic transaction (`tools/content/apply.mts`). It writes every file below through `staged.text()` with the `cw()` serializer and `yml()` for localisation; nothing is hand-edited.
- **Data:** `tools/content/data/mechanics/lerendor_strait.json`: the lean table by country name (North Lands, Dark Lands coastal countries, Andos Enda); the toll level values; the AI befriend list. Country names resolve to tags through `tools/content/data/countries.json`; an unknown name fails the build. "Lerendor", "Aenor" and "Andos Enda" resolve to tags at build time. Site and region triggers come from the key-sites module (`tools/content/modules/sites.mjs`, which runs before this module).
- **Test:** `tools/content/mech_lerendor_strait.test.mjs`, added to the `test` script in `tools/package.json` when the module lands. It asserts the build-test acceptance lines below; `assertModifiers` from `tools/content/lib/core.mjs` checks every modifier key against the installed `modifiers_documentation.md`.

### Files

| Path | Content |
| --- | --- |
| `common/scripted_effects/zin_leren.txt` | Mechanic effects below |
| `common/scripted_triggers/zin_leren.txt` | Mechanic triggers below, with the generated tag checks `zin_is_lerendor` and `zin_leren_is_aenor` |
| `common/ideas/zin_leren.txt` | Mechanic spirits |
| `common/dynamic_modifiers/zin_leren.txt` | `zin_leren_strait_dues`, `zin_leren_union`, `zin_leren_hegemony_mod` |
| `common/opinion_modifiers/zin_leren.txt` | Opinion modifiers below |
| `common/decisions/categories/zin_leren.txt`, `common/decisions/zin_leren.txt` | Categories `zin_leren_strait` and `zin_leren_compact` |
| `events/zin_leren.txt` | Namespace `zin_leren` (mechanic-owned; may use `trigger` and `mean_time_to_happen`). The tree's events are the separate namespace `zin_lerendor` |
| `common/on_actions/zin_leren.txt` | `on_startup` → `zin_leren.1`; `on_monthly_<Lerendor tag>` → `zin_leren_monthly`. On_actions merge, so this file stands beside `zin_startup.txt` |
| `common/ai_strategy/zin_leren.txt` | The AI strategies of the AI section |
| `common/game_rules/zin_leren.txt` | `zin_rule_leren_route` (group `RULE_GROUP_ZIN`, the foundation's format; first option `DEFAULT`, decision R1) |
| `localisation/english/zin_leren_l_english.yml` | All text, the rule texts included |

Scripts refer to Lerendor through `zin_is_lerendor` and the global event target `zin_leren_country` (saved by `zin_leren.1`), and to the treaty partner through `zin_leren_is_aenor` (Aenor's own tag).

### Variables

| Variable | Scope | Range | Start | Meaning |
| --- | --- | --- | --- | --- |
| `zin_strait_standing` | Lerendor | -100–100 | -15 | Contract variable |
| `zin_leren_toll_level` | Lerendor | 0–4 | 1 | Strait dues |
| `zin_leren_union_cohesion` | Lerendor | 0–100 | 55 | Unity of the two crowns |
| `zin_leren_hegemony` | Lerendor | 0–100 | computed | Lerendor's lead over the North Lands |
| `zin_leren_lean` | each North Lands country, each Dark Lands coastal country, Andos Enda | -100–100 | tables above | Lean to Sonargur (+) or Parim (-) |
| `zin_leren_withdrawal_date` | global | date | unset | Date of the withdrawal (interface) |
| `zin_leren_toll_pp`, `zin_leren_toll_cg`, `zin_leren_union_stab`, `zin_leren_union_pp`, `zin_leren_heg_pp`, `zin_leren_heg_trade` | Lerendor | derived | derived | Values read by the dynamic modifiers; set by `zin_leren_monthly` and the setter effects |

### Flags

| Flag | Kind | Set by |
| --- | --- | --- |
| `zin_leren_withdrawal` | global (contract) | `zin_leren_withdraw` |
| `zin_leren_treaty_honoured` | global | honour option of `zin_leren.20` |
| `zin_leren_strait_supremacy` | global | `zin_leren_declare_supremacy` |
| `zin_leren_route_honour`, `zin_leren_route_break`, `zin_leren_route_supremacy` | Lerendor | route focuses |
| `zin_leren_toll_redressed`, `zin_leren_toll_mocked`, `zin_leren_toll_arbitrated` | Lerendor | toll quarrel (`zin_leren_toll_mocked` is read by the Eekedor tree) |
| `zin_leren_toll_ready` | Lerendor | `zin_leren.10` "The debt is still owed" |
| `zin_leren_oath_to_new_king` | Lerendor | `zin_leren.41` option renew |
| `zin_leren_heard_whispers`, `zin_leren_heard_fishermen`, `zin_leren_heard_eindil`, `zin_leren_seeks_wards` | Lerendor | events and focuses |
| `zin_leren_called_against` | every country at war with Aenor when `zin_leren.20` fires | stops `zin_leren.20` repeating within one war (cleared when Aenor is no longer at war with it) |
| `zin_leren_asked_for_time` | Lerendor, 90 days | "Ask for time" in `zin_leren.20` |
| `zin_leren_barred_news` | global | `zin_leren.55` has fired |
| Tree flags read here | Lerendor | `zin_leren_compact_open`, `zin_leren_envoys`, `zin_leren_tariff`, `zin_leren_marriages`, `zin_leren_open_compact`, `zin_leren_one_banner`, `zin_leren_dark_shore`, `zin_leren_dark_protection`, `zin_leren_full_dues`, `zin_leren_iron_toll`, `zin_leren_seas_closed` (set by the Lerendor tree) |

### Scripted triggers

| Trigger | Scope | True when |
| --- | --- | --- |
| `zin_is_lerendor` | country | the country is Lerendor (generated tag check) |
| `zin_leren_is_aenor` | country | the country has Aenor's tag (generated tag check) |
| `zin_leren_treaty_in_force` | any | Lerendor and Aenor exist and `zin_leren_withdrawal` is not set |
| `zin_leren_honours_treaty` / `zin_leren_stands_apart` / `zin_leren_seeks_supremacy` | any | Lerendor has the matching route flag |
| `zin_leren_strait_trusted` / `zin_leren_strait_broken` | any | standing ≥ 40 / ≤ -40 |
| `zin_leren_guards_strait` | any | Lerendor or its subjects control Sonargur (`zin_is_site_sonargur`) and every `zin_is_site_strait_north` state |
| `zin_leren_holds_strait` | any | `zin_leren_guards_strait`, and Lerendor or its subjects control every `zin_is_site_strait_gateway` state (R'en's strait coast) |
| `zin_leren_strait_barred` | any | `zin_leren_holds_strait`, Lerendor at war with Zol (`zin_is_zol`), and focus `zin_lerendor_hold_the_capes` or `zin_lerendor_the_watch_holds` completed |
| `zin_leren_is_north_crown` | country | capital state has `zin_is_region_north_lands`; not Lerendor |
| `zin_leren_is_dark_shore` | country | capital state has `zin_is_region_dark_lands` and the country owns a coastal state (`is_coastal`) |
| `zin_leren_is_compact_target` | country | `zin_leren_is_north_crown`, or `zin_leren_is_dark_shore` with Lerendor's flag `zin_leren_dark_shore`, or the country is Andos Enda (generated tag check); not at war with Lerendor |
| `zin_leren_question_open` | Lerendor | `zin_golden_king_dead`, or after 1751.3.1, or standing ≥ 60 or ≤ -60 |

### Scripted effects

Scripted effects take no parameters in 1.19.3 (decision E1): every argument below compiles to a temporary variable `zin_arg_<name>` set just before the call (`zin_arg_value`, `zin_arg_level`; `zin_arg_target` holds a country). No effect uses the `$name$` syntax.

| Effect | Scope | Does |
| --- | --- | --- |
| `zin_leren_add_strait_standing` (`value`) | any | If the treaty is in force: add to Lerendor's standing, clamp -100–100, refresh band |
| `zin_leren_set_toll_level` (`level`) | Lerendor | Set level, refresh `zin_leren_strait_dues` values |
| `zin_leren_add_union_cohesion` (`value`) | Lerendor | Add, clamp 0–100, refresh `zin_leren_union`; fires `.81` the first time cohesion reaches 80 |
| `zin_leren_add_lean` (`value`) | target country | Add to that country's lean, clamp -100–100 |
| `zin_leren_update_hegemony` | Lerendor | Recompute hegemony and its modifier values |
| `zin_leren_update_treaty_band` | Lerendor | Swap band spirits |
| `zin_leren_monthly` | Lerendor | Drift standing, cohesion and lean; update hegemony and band; add or remove `zin_leren_keepers_of_the_strait`; clear stale `zin_leren_called_against`; fire the `zin_leren.20`, `.35`, `.36`, `.55`, `.80` checks; fire tree event `zin_lerendor.14` once when focus `zin_lerendor_faithful_to_the_crown` is done and `zin_afrit_king_of_east` is set; last, `mark_focus_tree_layout_dirty` for Lerendor and every North Lands country (decision E4) |
| `zin_leren_clear_grievances` | Lerendor | Remove `zin_leren_grievance_1716` and `zin_leren_grievance_unanswered`, and opinion modifiers `zin_opinion_toll_of_1716` (start situation) and `zin_leren_envoys_mocked` |
| `zin_leren_withdraw` | any | The withdrawal (section 7) |
| `zin_leren_join_aenor_defence` | Lerendor | `add_to_war` for each of Aenor's defensive wars; sets `zin_leren_treaty_honoured` |
| `zin_leren_invite_to_compact` (`target`) | Lerendor | Fire `zin_leren.70` for target |
| `zin_leren_offer_protection` (`target`) | Lerendor | Fire `zin_leren.71` for target |
| `zin_leren_close_strait` (`target`) | Lerendor | Timed idea on target, opinion modifier, `zin_leren.90` |
| `zin_leren_claim_r_en` | Lerendor | `add_state_claim` on every state R'en owns; war goal `puppet_wargoal_focus` on R'en (`create_wargoal`) if the peace gate is open |
| `zin_leren_claim_far_shore` | Lerendor | `add_state_claim` on every `zin_is_site_strait_south` state; war goal `take_state_focus` on each owner if the peace gate is open |
| `zin_leren_declare_supremacy` | Lerendor | Set `zin_leren_strait_supremacy`, news `zin_leren.60`, toll level 4 allowed |

Effects owned by other specs that this spec calls: `zin_world_add_gathering_dark` ([world tension](../03_gameplay/05_world_tension_and_endings.md)); `zin_afrit_add_footholds` ([Afrit](afrit_hidden_council.md)). Specs that call this spec's effects: Aenor and the North Lands trees (`zin_leren_add_lean`), diplomacy (`zin_leren_add_strait_standing` in `zin_diplo.11`), Dark Lands (`zin_leren_add_lean`), the Eekedor tree (`zin_leren_add_strait_standing`).

Engine keys used (checked in the 1.19.3 documentation): effects `add_to_war`, `add_to_faction`, `leave_faction`, `puppet`, `create_wargoal`, `add_state_claim`, `diplomatic_relation`, `add_opinion_modifier`, `remove_opinion_modifier`, `add_dynamic_modifier`, `add_timed_idea`, `swap_ideas`; triggers `has_defensive_war_with`, `is_subject_of`, `is_in_faction_with`, `controls_state`, `is_coastal`, `has_completed_focus`, `has_game_rule`, `has_navy_size`; AI strategy types `befriend`, `prepare_for_war`, `garrison`, `protect`.

### Spirits (mechanic)

All are ideas in `common/ideas/zin_leren.txt` (idea category `country`); timed ones are added with `add_timed_idea`.

| Key | Name | Modifiers | Icon (`GFX_idea_zin_<key>`, in game) | Added / removed |
| --- | --- | --- | --- | --- |
| `zin_leren_grievance_1716` | The Grievance of 1716 | `war_support_factor` 0.03, `political_power_gain` -0.05 | `toll_house` | Start; removed by redress or arbitration won; swapped for the next on mockery |
| `zin_leren_grievance_unanswered` | An Insult Unanswered | `war_support_factor` 0.05, `stability_factor` -0.02 | `seal_wax` | Toll quarrel mocked; removed by withdrawal or by Renew the Oaths of 512 |
| `zin_leren_treaty_trusted` | The Treaty Trusted | `stability_factor` 0.03, `consumer_goods_factor` -0.02, `opinion_gain_monthly_factor` 0.10 | `scroll_treaty` | Band |
| `zin_leren_treaty_broken_faith` | Broken Faith | `war_support_factor` 0.05, `stability_factor` -0.03, `drift_defence_factor` 0.10 | `chain_broken` | Band |
| `zin_leren_treaty_torn` | The Treaty Torn | `war_support_factor` 0.05, `stability_factor` -0.05, `political_power_gain` 0.10 | `scroll_sealed` | Withdrawal, 365 days |
| `zin_leren_strait_closed` | The Strait Is Closed | `naval_speed_factor` -0.10, `navy_max_range_factor` -0.15, `consumer_goods_factor` 0.02 | `strait_chain` | On a target, 180 days |
| `zin_leren_keepers_of_the_strait` | Keepers of the Strait | `naval_detection` 0.10, `convoy_raiding_efficiency_factor` 0.10, `positioning` 0.05 | `lighthouse` | While `zin_leren_guards_strait` and Lerendor is at war; monthly check |
| `zin_leren_charter_trade` | Compact Trade Charters | `consumer_goods_factor` -0.01 | `ledger_coins` | Decision `zin_leren_trade_charter`, 365 days; re-adding refreshes the timer (does not stack) |

### Dynamic modifiers

| Key | Modifiers (variable-valued) | Icon |
| --- | --- | --- |
| `zin_leren_strait_dues` | `political_power_gain` = `zin_leren_toll_pp`; `consumer_goods_factor` = `zin_leren_toll_cg` | `GFX_idea_zin_toll_house` |
| `zin_leren_union` | `stability_factor` = `zin_leren_union_stab`; `political_power_factor` = `zin_leren_union_pp` | `GFX_idea_zin_two_crowns` |
| `zin_leren_hegemony_mod` | `political_power_gain` = `zin_leren_heg_pp`; `faction_trade_opinion_factor` = `zin_leren_heg_trade` | `GFX_idea_zin_banner_league` |

### Opinion modifiers

| Key | Value | Notes |
| --- | ---: | --- |
| `zin_leren_treaty_partner` | +20 | `trade = yes`; Aenor ↔ Lerendor at start |
| `zin_leren_envoys_mocked` | -20 | Lerendor → Aenor when the envoys are mocked; decays 1 per month |
| `zin_leren_treaty_broken` | -40 | both ways on withdrawal; decays 0.5 per month |
| `zin_leren_compact_kin` | +15 | between Compact members; added on joining |
| `zin_leren_strait_closed_on_us` | -30 | target → Lerendor; decays 1 per month |

Start modifiers from the start situation are read or removed here, never redefined: `zin_opinion_toll_of_1716` (−20, removed by redress, a won arbitration or `zin_leren_clear_grievances`) and `zin_opinion_northern_pride` (−10, left to decay by its own rules). This spec defines no second opinion for the toll grievance, and the mocked envoys' opinion is `zin_leren_envoys_mocked`; the name `zin_leren_toll_mocked` is only the flag (contract register, retired list).

### Decisions

Category pictures are `GFX_decision_cat_picture_zin_leren_strait` and `GFX_decision_cat_picture_zin_leren_compact` (art inventory B1, not generated yet); until they exist the categories use the in-game icons `GFX_idea_zin_strait_chain` and `GFX_idea_zin_alliance_rings`.

**Category `zin_leren_strait` (The Narrow Strait)**, visible to Lerendor.

| Key | Available | Cost | Effect | AI |
| --- | --- | --- | --- | --- |
| `zin_leren_toll_lower` | level > 0; 90-day cooldown | 25 PP | level -1; standing +3 | honour route: when level > 1 |
| `zin_leren_toll_raise` | level < max (2; 3 with `zin_leren_full_dues`; 4 with `zin_leren_iron_toll`); 90-day cooldown | 25 PP | level +1; standing -3 | break: up to 2; supremacy: up to max |
| `zin_leren_appeal_to_the_treaty` | treaty in force; 180-day cooldown | 50 PP | standing +5; Aenor opinion +5 | honour route only |
| `zin_leren_close_the_strait` (targeted) | section 8 | 50 PP | `zin_leren_close_strait` | AI section |

**Category `zin_leren_compact` (The Leren Compact)**, visible to Lerendor once the tree flag `zin_leren_compact_open` (*The Leren Compact*) is set. Targets: `zin_leren_is_compact_target`.

| Key | Requires (tree flag) | Cost | Effect | Cooldown |
| --- | --- | --- | --- | --- |
| `zin_leren_send_envoys` | `zin_leren_envoys` (*Envoys to the Northern Crowns*) | 25 PP | lean +10 | 120 days per target |
| `zin_leren_trade_charter` | `zin_leren_tariff` (*The Compact Tariff*) | 50 PP | lean +15; timed idea `zin_leren_charter_trade` on Lerendor for 365 days | once per target |
| `zin_leren_marriage_pact` | `zin_leren_marriages` (*Marriages Across the North*) | 75 PP | lean +25; target opinion +20 | once per target |
| `zin_leren_invite_to_compact` | `zin_leren_open_compact` (*Open the Compact*); lean ≥ 50; target not in a faction; target allowed by the joining rule (Andos Enda only with `zin_refusal_lifted`) | 25 PP | `zin_leren.70` | 180 days per target |
| `zin_leren_offer_protection` | `zin_leren_one_banner` (*One Banner for the North*) or supremacy route; hegemony ≥ 60; lean ≥ 80 (≥ 60 on supremacy); Dark Lands targets also need `zin_leren_dark_protection` (and ≥ 60 with `zin_regional_blackton_seeks_protection`); never Andos Enda | 100 PP | `zin_leren.71` | 365 days per target |

### Events (namespace `zin_leren`)

| Id | Title | For | Trigger | Options (AI) |
| --- | --- | --- | --- | --- |
| .1 | (hidden) Startup | Lerendor | on_startup | Set variables, leans, spirits, `zin_leren_treaty_partner`, event target |
| .10 | The Toll Rolls of 1716 | Lerendor | focus *Read the Toll Rolls* | "The debt is still owed" (flag `zin_leren_toll_ready`; +25 PP; AI 80) / "Let old ledgers lie" (standing +5; the quarrel focus still possible; AI 20) |
| .11 | Leren Envoys Demand Redress | Aenor | focus *Reopen the Toll Quarrel* | Pay redress: -75 PP, standing +20 (AI 20) / Arbitration at Eekedor: standing +5, `.13` in 60 days (AI 30) / Laugh them out of the Golden Court: +25 PP, standing -10, flag mocked (AI 50, ×1.5 if `zin_court_corruption` ≥ 60; always under `zin_rules_is_historical` while the Golden King reigns) |
| .12 | Parim's Answer | Lerendor | after `.11` | One option per outcome; mockery swaps the grievance spirit and adds `zin_leren_envoys_mocked` |
| .13 | The Arbitration of Eekedor | Lerendor and Aenor | 60 days after `.11` | Ruling for Lerendor (chance 50 + Eekedor lean ÷ 4): standing +10, grievance removed; for Aenor: standing -5 |
| .15 | A Merchantman Refuses the Toll | Lerendor | MTTH 720 days; toll ≥ 2; treaty in force | Seize the cargo (+30 PP, standing -5; AI 40, supremacy ×2) / Waive it (standing +3; AI 40, honour ×2) / Refer it to Parim (-25 PP; AI 20) |
| .20 | Aenor Calls on the Treaty | Lerendor | monthly check, section 6 | Ask for time / Refuse (hist) / Honour (AI: section 6; order per E2) |
| .21 | The North Answers | Aenor | after `.20` | Acknowledge |
| .30 | The Treaty of the Narrow Strait Is Ended | Lerendor | `zin_leren_withdraw` | "The North stands alone" |
| .31 | The North Withdraws | Aenor | `zin_leren_withdraw` | Acknowledge (the Aenor spec may add options) |
| .32 | The Narrow Strait Treaty Ends | all (news) | `zin_leren_withdraw` | Acknowledge |
| .33 | The Old Alliance Holds | all (news) | `zin_leren_treaty_honoured` set | Acknowledge |
| .35 | (hidden) The Court Decides | Lerendor | AI fallback, section 7 | `zin_leren_withdraw` |
| .36 | The War and the Treaty | Lerendor (human) | 14 days after `zin_war_of_last_crowns`, no route | Wait (repeats in 60 days, standing -5) / Withdraw now (hist) / Honour now (sets honour flag, fires `.20`) (order per E2) |
| .40 | The Golden King Is Dead | Lerendor | `zin_golden_king_dead` | Send mourners (-25 PP, standing +3; AI 40, honour ×2) / A cold letter (standing -3; AI 60, historical 100) |
| .41 | Envoys of the New King | Lerendor | `zin_aurevan_crowned` | Renew the oaths: standing +15, `zin_afrit_add_footholds` 1, flag (AI 20; honour ×3) / Delay: standing -5 (AI 60; historical 100) / Refuse: standing -15, war support +3% (AI 20; supremacy ×3) |
| .45 | Talk of a Stranger in Aenor | Lerendor | fired by the journey's `zin_eindil.83` | Parim calls him an impostor (standing +2; AI 80, historical 100) / Send someone to hear him (flag `zin_leren_heard_eindil`; -25 PP; AI 20) |
| .50 | Black Ships Among the Islands | Lerendor | MTTH 540 days, 1749.3.1 to 1755.12.31, needs flag `zin_leren_heard_fishermen` (*Hear the Fishermen*) | Flavour; +5 navy experience |
| .51 | The Dead on the Northern Shore | Lerendor and coastal North Lands crowns | `zin_zol_rising` | "To the capes" (war support +10%) |
| .55 | The Strait Barred | all (news) | `zin_leren_strait_barred` first true (flag `zin_leren_barred_news`) | Acknowledge |
| .60 | Sovereign of the Narrow Sea | all (news) | `zin_leren_declare_supremacy` | Acknowledge |
| .70 | An Invitation from Sonargur | target | `zin_leren_invite_to_compact` | Join (`add_to_faction` from Lerendor; `zin_leren_compact_kin`) (AI chance = lean; 0 while bound by the Elven Refusal) / Decline (lean -10) |
| .71 | Sonargur Offers Protection | target | `zin_leren_offer_protection` | Accept (Lerendor `puppet`s target) (AI chance = lean − 40, ×2 if target at war with Zol) / Refuse (lean -20) |
| .72 | Answer from the North | Lerendor | after `.70`/`.71` | Result text |
| .80 | The Lerenwaith Question | Lerendor | cohesion ≤ 25; MTTH 180 days | Grant the estates' petition (-50 PP, cohesion +15; AI 60) / Hold firm (cohesion +5, stability -5%, war support +3%; AI 40) |
| .81 | One Throne Again | Lerendor | cohesion ≥ 80 first time | Flavour; stability +3% |
| .90 | The Strait Is Closed | target | `zin_leren_close_strait` | Acknowledge |

Before `zin_afrit_revealed`, every text above calls Aenor's new king "King Aurevan" or "the Deliverer"; none names Afrit.

**Pictures** (all in game today; each respects the icon catalog's gate). Events, `GFX_zin_evt_<key>`: `.10`, `.15`, `.30` strait_toll; `.11`, `.12`, `.31` leren_envoys; `.41` coronation (gate `zin_golden_king_dead`, always set before Aurevan is crowned); `.13`, `.21`, `.45`, `.70`, `.71`, `.72`, `.80` generic_court; `.20`, `.36` generic_war; `.40` king_is_dead; `.50` black_ships_tale; `.51` zol_rising (gate `zin_zol_rising`); `.81` generic_peace; `.90` generic_sea. News, `GFX_zin_news_<key>`: `.32`, `.55`, `.60` strait_toll; `.33` generic_war. The `ending_strait_master` picture is gated on the ending flag, so `.60` does not use it. The art inventory's planned `zin_leren` set (`sonargur_chain`, `leren_fleet`, `toll_quay`, `compact_hall`, `ice_harbour`, `strait_storm`) replaces some of these when it is generated (art request).

### Game rules

`zin_rule_leren_route`, in this spec's own file `common/game_rules/zin_leren.txt` (the foundation lists it among the rules in their owners' files; group `RULE_GROUP_ZIN`, decision R1). Options: `DEFAULT` (first and default: follows `zin_rule_historical_path`, section 5), `historical` (break route, withdrawal at the war), `honour`, `supremacy`, `free` (weights from court spirits, standing and hegemony). Rule and option texts name neither Afrit nor Eindil. The foundation's `rules.mjs` generates `zin_rules_ai_branch_leren_<option>` from it. It replaces the foundation's former AI rule for Lerendor (R1).

### Defines

None.

### Map and site dependencies

**Key sites.** Every site and region trigger comes from the key-sites spec ([../01_map/02_key_sites.md](../01_map/02_key_sites.md)): `tools/content/modules/sites.mjs` resolves each row of `tools/content/data/sites.json` and writes `common/scripted_triggers/zin_sites.txt`. Placement follows owner short-list question 3's working proposal (the Narrow Strait lies between the North Lands and the Middle Lands).

| Trigger | Rule there (proposed) |
| --- | --- |
| `zin_is_site_sonargur` | Lerendor's capital state (row "Sonargur"; naval base of level 3 or more on the strait is a map requirement there) |
| `zin_is_site_strait_north` | Lerendor's states on the strait's sea regions, Sonargur included |
| `zin_is_site_strait_south` | the Middle Lands and Dark Lands states on the same sea regions (the far shore) |
| `zin_is_site_strait_gateway` (key sites row; decision E7) | R'en's states on the strait's sea regions (the gateway between the Leren and Aenor seas); rule `owned` R'en, filter `on_sea` the strait sea regions |
| `zin_is_region_north_lands`, `zin_is_region_dark_lands` | the start owner's roster region |

The Dark Lands' own straits (`zin_is_site_dark_strait_*`) are the Dark Lands spec's; this spec reads none of them.

**Fleet at the start.** Lerendor's starting galleys and warships belong to the warfare spec's start forces ("Lerendor guards the strait"), not to this module.

## AI

- **Strategies** (`common/ai_strategy/zin_leren.txt`): from the start, Lerendor `befriend` Eekedor, Mina and The Hold (value 50). After `zin_zol_rising`: `prepare_for_war` against Zol (100) and `garrison` (value 50) on the `zin_is_site_strait_north` states.
- **Toll:** the AI raises the toll to 2 within the first year of the historical path (in 4A 1749, after the mockery); to 3 only on supremacy; lowers to 1 on honour.
- **Compact decisions:** the AI sends envoys to the three highest-lean targets first; invites any target at lean ≥ 60, and only while `zin_gathering_dark` ≥ 25 (the diplomacy spec's faction rule); never targets a crown that Aenor guarantees (`has_guaranteed`).
- **Routes** follow section 5. Free weights (`free`, and `DEFAULT` under FREE): honour = 50 + standing; break = 50 − standing ÷ 2; supremacy = hegemony (×2 with focus `zin_lerendor_admiralty_ascendant`). PLAUSIBLE multiplies break by 3.
- **Closing the strait:** after `zin_leren_withdrawal` and on the break or supremacy route, the AI closes the strait on every country at war (not in Lerendor's faction) with `has_navy_size` > 9 ships, Zol first, one per month while PP ≥ 100. Never on the honour route; never on a member of Lerendor's faction.
- **Aenor's AI** answer in `.11` uses its court corruption (and mocks under the historical path); in `.20` Lerendor's AI follows its route (section 6).

## Acceptance

Each line says how it is decided: **[build]** an assertion in `tools/content/mech_lerendor_strait.test.mjs` run by `npm test` in `tools/`; **[Linux]** the isolated Linux run (one in-game year at the end of phase 3, decision S8; error.log gets no new line from a `zin_leren` file); **[scenario]** a scripted HOI4 Agent Tools run (`hoi4_scenario_test` or `hoi4_mechanic_test`) on the mod source.

1. **[build]** Every file in the Files table is staged; every event, decision, idea, opinion modifier, dynamic modifier, scripted trigger and scripted effect named here is defined exactly once; every one referenced is defined here or in a spec this one links to; every localisation key exists in `zin_leren_l_english.yml` (UTF-8 with BOM).
2. **[build]** Every modifier key passes `assertModifiers`; every engine effect, trigger and AI strategy type named in Implementation appears in the installed 1.19.3 documentation; every country name in the data file resolves.
3. **[build]** No `create_wargoal`, `declare_war_on` or `add_state_claim` in a `zin_leren` file is reachable without its peace-gate trigger (static scan of the staged scripts).
4. **[build]** The secret check: no `zin_leren` text reachable by a country other than the Worshipdom before `zin_afrit_revealed` contains "Afrit" or "Hidden Council"; Eindil's name appears only through `[zin_loc_eindil]`.
5. **[build]** No `zin_leren` opinion modifier shares its name with a `zin_leren` flag, no retired name of the contract register appears in a `zin_leren` file, and `zin_opinion_toll_of_1716` is defined once (start situation), not here.
6. **[scenario]** A new game on 1 Thaw 4A 1748: Lerendor has standing -15, toll 1, cohesion 55, hegemony 1 to 3; Eekedor is in the Leren Compact and Andos Enda is not; Lerendor is at peace; no Leren war goal or claim exists.
7. **[scenario]** Changing standing by script crosses bands correctly: spirits swap at 40 and -40; after `zin_leren_withdraw` the standing no longer changes.
8. **[scenario]** Every toll level changes the dynamic modifier values; level 3 needs `zin_leren_full_dues`; level 4 needs `zin_leren_iron_toll`.
9. **[scenario]** With the treaty in force, a declaration of war on Aenor by a West Lands leader joined by three pledged members fires `zin_leren.20` once; a second month of the same war does not fire it again; with Lerendor on the break route at standing -60, refusing sets `zin_leren_withdrawal` the same day.
10. **[scenario]** `zin_leren_close_strait` on a Western Crossing member before a western sailing leaves that sailing's division count unchanged.
11. **[scenario]** Historical observer run 4A 1748–1756, `zin_rule_historical_path` HISTORICAL and `zin_rule_leren_route` DEFAULT: the toll quarrel is mocked in 4A 1749 and the toll is 2 by the end of 4A 1749; later in the same run: standing is between -75 and -55 on 1 Thaw 4A 1755; `zin_leren_withdrawal` is set within 60 days of `zin_war_of_last_crowns`; Lerendor never declares war on Aenor; Lerendor is at war with Zol within 90 days of `zin_zol_rising`.
12. **[scenario]** `zin_rule_leren_route = honour`: Lerendor joins Aenor's defensive war in 4A 1755, `zin_leren_treaty_honoured` is set and `zin_leren_withdrawal` is not. `supremacy`: in at least one of five runs Lerendor reaches hegemony 40 or more, withdraws, claims R'en and the far shore, and sets `zin_leren_strait_supremacy`.
13. **[scenario]** A human Lerendor that lets `zin_leren.20` time out asks for time (the first option): standing −10 and no withdrawal from the timeout; `zin_leren.45` fires only from `zin_eindil.83`.
14. **[build]** Every `zin_leren` event sets `timeout_days = 30`; `zin_leren_monthly` contains `mark_focus_tree_layout_dirty`; `zin_rule_leren_route` is in `RULE_GROUP_ZIN` with `DEFAULT` first.

## Open questions

The owner questions of this spec are listed in [OPEN_QUESTIONS.md](../OPEN_QUESTIONS.md) (section "lerendor", 1 to 6; short list 3). Question 1 is settled by decision S5. The work proceeds on these labelled proposals:

1. **Andos Enda and the Compact.** Settled (S5): not a member at the start; courtable; invitable only once the Elven Refusal is lifted for it (section 4).
2. **The toll quarrel.** Proposal: Aenoran ships paying at Sonargur (section 2).
3. **Where the Narrow Strait lies.** Proposal (owner short list 3, also the key-sites spec's): between the North Lands and the Middle Lands; the Dark Lands straits are the Dark Lands spec's (Map and site dependencies).
4. **A lore name for the Leren king.** Settled (open questions 28): the characters spec's King Ferlin III is the ruler; this spec's texts say "the king" and name him only through the character.
5. **Do the smaller crowns withdraw on their own?** Proposal: only Lerendor withdraws from the treaty; each smaller crown answers through its own tree and lean (North Lands trees), never by a scripted withdrawal here.
6. **A peaceful supremacy.** Proposal: not built now; supremacy stays the war route (the toll, protection and claims), and a purchase of R'en can be added later without changing these names.
