# Lerendor and the Treaty of the Narrow Strait

**Status:** Draft. **Priority:** 3. **Phase:** 3.

## Purpose

Lerendor is the united crown of Lerendor and Lerenwaith, the strongest power of the North Lands and the northern counterweight to Aenor. Its whole story in the Fourth Age is one question: what does the North owe Aenor? This spec defines the mechanic that asks it:

- **Strait standing** (`zin_strait_standing`): how Lerendor stands under the Treaty of the Narrow Strait, from bitter (-100) to trusted (+100).
- **The toll quarrel**: the strait dues and the old grievance of 4A 1716, the main peacetime lever on standing.
- **The Leren Compact and the smaller crowns**: who in the North Lands looks to Sonargur and who to Parim, and how far Lerendor can lead them (`zin_leren_hegemony`).
- **Three routes**: honour the treaty, break it, or turn it into Leren supremacy over the strait.
- **The withdrawal at the war**: the established break with Aenor, timed to the War of the Last Crowns.
- **The Dark Lands across the straits** and **Zol's dead from the north**: the two dangers on Lerendor's other shores.

The focus tree [../05_focus_trees/major/lerendor.md](../05_focus_trees/major/lerendor.md) drives this mechanic. Other specs touch it only through the scripted effects, triggers and flags listed here.

## Lore basis

| Fact | Status | Source |
| --- | --- | --- |
| Lerendor and Lerenwaith are one crown and one country | established (owner merge) | *Great Powers and Relations*, *Erdae and Its Regions* |
| Seat at Sonargur | established working seat (constructed name, replaceable) | *Great Powers and Relations* |
| Lerendor leads the **Leren Compact**; its rival is Aenor | established working table | *Great Powers and Relations*, *Kingdoms Factions and Conflicts* |
| The working table lists Eekedor and Andos Enda in the Compact; the map starts it with Eekedor only | working table vs map | *Great Powers and Relations*; mod history |
| The North Lands lie north of the Middle Lands across a narrow strait; the Dark Lands lie between Lerendor and the Middle Lands across narrow straits | established geography | *Erdae and Its Regions* |
| In the final war the northern lands **withdraw from the old alliance** with Aenor; this is political separation, and the North Lands are not one unanimous enemy | established | *Fourth Age Canon Register*, *War of the Last Crowns*, *The Fourth Age of Erdae* §VIII–IX |
| Zol's forces move from the black north **through islands and straits** toward the settled kingdoms; ordinary weapons cannot end Zol's dead, only potent magic | established | *The Fourth Age of Erdae* §IX, *Zol* |
| Northern companies join Eindil's temporary coalition without surrendering their independence; competing northern interests remain after the war | established (chronicle and *War of the Last Crowns*) | *The Fourth Age of Erdae* §X, *Fifth Age Seeds* |
| The name **Treaty of the Narrow Strait** for the old alliance; its date 4A 512 | proposed | *Fourth Age Chronology* |
| The union of the Leren crowns by marriage in 4A 411 | proposed | *Fourth Age Chronology* |
| The **toll quarrel** of 4A 1716, when Leren envoys were humiliated in Parim | proposed | *Fourth Age Chronology* |
| Lerendor can honour the treaty, abandon it, or become master of the strait | proposed (play choices, not history) | *The Campaign of 4A 1748* |
| The withdrawal falls in 4A 1755; the start is 1 Thaw 4A 1748 | proposed dates | *Fourth Age Chronology* |
| Avarin of Lerenwaith, a Second Age envoy | proposed character | *Second Age Proposed Characters* |

Everything else in this spec is **proposed**: the standing scale, toll levels, union cohesion, hegemony, the Lerenwaith estates, the arbitration at Eekedor, the North shore and strait sites, all characters, all numbers and all event text.

This spec never states as history who wins the War of the Last Crowns, what treaty the North signs after it, or anything the vault leaves open about Zol's servants. Outcomes offered by gameplay are labelled as outcomes.

## Design

### The situation on 1 Thaw 4A 1748

The treaty is in force. Aenor and Lerendor are at peace and trade freely. Aenoran ships pay the old fixed due at the strait. The Leren court remembers 1716 and resents Parim, but nobody plans a war. Lerendor leads the Leren Compact with Eekedor. Sensai, Molot, R'en, Mina and the other small crowns are independent and courted by both Sonargur and Parim.

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
| A toll incident: seize / waive | -5 / +3 |
| Renew oaths to Aurevan's crown / delay / refuse | +15 / -5 / -15 |
| Honour Aenor's call to war / delay / refuse | +20 / -10 / -25 |
| Focus effects | see the tree spec |
| Aenor, Afrit and Eindil specs | through `zin_leren_add_strait_standing` only |

**Historical target:** standing about -60 to -75 by Thaw 4A 1755, so the AI withdraws when the war begins. The acceptance run checks this range.

### 2. The toll quarrel and the strait dues

The strait is Lerendor's wealth. Every ship between the Leren sea and the Aenoran sea pays at Sonargur, except as the treaty limits it. In 4A 1716 Lerendor claimed a higher due from Aenoran ships; its envoys were laughed out of Parim (proposed). The quarrel was never settled.

**Toll level** `zin_leren_toll_level` (Lerendor, 0–4; start 1):

| Level | Name | Who may set it | Effect through dynamic modifier `zin_leren_strait_dues` |
| --- | --- | --- | --- |
| 0 | Free Passage | any time | political_power_gain 0, consumer_goods_factor 0; standing +0.3/month |
| 1 | The Treaty Toll | any time | political_power_gain +0.05, consumer_goods_factor -0.01 |
| 2 | Leren Dues | any time | political_power_gain +0.10, consumer_goods_factor -0.02 |
| 3 | Full Strait Dues | after focus Full Strait Dues | political_power_gain +0.15, consumer_goods_factor -0.03 |
| 4 | The Iron Toll | supremacy route, focus The Iron Toll | political_power_gain +0.25, consumer_goods_factor -0.04; every North Lands country loses 0.5 lean per month |

Levels 3 and 4 also cost 0.5 lean per month with coastal North Lands crowns whose merchants pay the toll (`zin_leren_monthly`).

**The toll quarrel chain** (events `zin_leren.10`–`.13`, opened by the tree's Reopen the Toll Quarrel focus):

1. Lerendor reads the old toll rolls and decides whether to press the claim.
2. Aenor receives the envoys. Options: pay redress, send the case to arbitration in Eekedor, or mock the envoys as in 1716. The AI chance of mocking rises with Aenor's `zin_court_corruption`; on the historical path the Golden Court mocks them.
3. Lerendor hears Parim's answer. Redress removes the grievance spirit and opens the cheap honour route. Mockery swaps it for a harsher one and raises standing loss.
4. Arbitration (proposed: before the Eekedor council) rules after 60 days, 50/50 weighted by Eekedor's lean.

Random toll incidents (`zin_leren.15`) fire while the toll is 2 or more and the treaty stands, about once every two years.

### 3. The union of the two crowns

Lerendor and Lerenwaith are one country, but they were two crowns until 4A 411 (proposed). The tree's court branch is about keeping them one throne. `zin_leren_union_cohesion` (Lerendor, 0–100, start 55) drives a dynamic modifier `zin_leren_union`:

- stability_factor = (cohesion − 50) / 500, so -0.10 to +0.10;
- political_power_factor = (cohesion − 50) / 1000, so -0.05 to +0.05.

Cohesion moves through focuses, events and these monthly sources: -0.2 while toll level is 3 or 4 (Lerenwaith's inland lords pay for the strait captains' quarrel); +0.2 while the estates' spirit is active. At 25 or below, `zin_leren.80` (The Lerenwaith Question) can fire. No route ever splits Lerenwaith into a separate country: the owner merged them.

### 4. The Leren Compact and the smaller crowns

The Compact is the in-game faction Lerendor leads at start (localised "Leren Compact"; Eekedor is its member). The North Lands' other 26 crowns are independent.

**Lean** `zin_leren_lean` (each North Lands country except Lerendor, -100 Parim to +100 Sonargur):

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

Lean moves through Compact decisions (below), focuses, toll levels and Aenor's counter-courting. Aenor's spec may court the same crowns by calling `zin_leren_add_lean` with negative values.

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

| Route | Flag | Opens when | What it means |
| --- | --- | --- | --- |
| **Honour the Treaty** | `zin_leren_route_honour` | standing ≥ -30 | Lerendor keeps the old alliance. When Aenor is attacked, the North comes. After the King's death it must decide whether it serves Aenor's crown or Aenor's realm. |
| **The North Stands Apart** (break; historical) | `zin_leren_route_break` | standing ≤ 30 | Lerendor withdraws from the treaty at the war, holds its own coasts against Zol's dead and keeps out of Aenor's wars. Northern companies may still join Eindil's coalition, as free men. |
| **Mastery of the Strait** (supremacy) | `zin_leren_route_supremacy` | hegemony ≥ 40, or focus Masters of the Strait Waters done | Lerendor tears up the treaty and uses the war to make the North master of the strait: R'en, the far shore and the Dark Lands coast. |

The Question itself is available only after `zin_golden_king_dead`, or from 1 Thaw 4A 1751, or when standing is at or beyond ±60. Nothing in 4A 1748 can force the choice.

Route outcomes the other specs may read:

| Global flag | Set when | Meaning |
| --- | --- | --- |
| `zin_leren_withdrawal` (contract) | Lerendor leaves the treaty | Historical 4A 1755 |
| `zin_leren_treaty_honoured` (new) | Lerendor joins Aenor's defensive war under the treaty | Outcome, not history |
| `zin_leren_strait_supremacy` (new) | Lerendor proclaims itself Sovereign of the Narrow Sea | Outcome "Lerendor becomes master of the strait" (proposed outcome) |

### 6. Honouring the treaty: the call to war

The treaty is not a HOI4 guarantee: Lerendor is never pulled into a war automatically. Instead, while `zin_leren_treaty_in_force` holds, the monthly check fires `zin_leren.20` (Aenor Calls on the Treaty) once per war when Aenor has a defensive war against a country that is not Lerendor's ally.

| Option | Effect | AI chance |
| --- | --- | --- |
| Honour the oath | `zin_leren_join_aenor_defence` (Lerendor joins every defensive war of Aenor via `add_to_war`); standing +20; global flag `zin_leren_treaty_honoured`; news `zin_leren.33` | high on honour route; 0 on break and supremacy |
| Ask for time | standing -10; the event repeats once after 90 days | medium when no route |
| Refuse | standing -25; if standing is then -40 or lower, `zin_leren_withdraw` | high on break and supremacy |

Aenor is told by `zin_leren.21`. Aenor's own obligation to Lerendor is the Aenor spec's concern; it reads `zin_leren_treaty_in_force`.

### 7. The withdrawal at the war

The established break happens when the War of the Last Crowns begins. `zin_leren_withdraw` (scripted effect) does all of it:

1. Sets global flag `zin_leren_withdrawal`; freezes `zin_strait_standing`.
2. Removes opinion modifier `zin_leren_treaty_partner` both ways and adds `zin_leren_treaty_broken` both ways.
3. Ends military access between Aenor and Lerendor (`diplomatic_relation`, `military_access`, `active = no`).
4. Removes Lerendor from any faction Aenor leads (not the case at start; possible on the honour route).
5. Adds `zin_leren_treaty_torn` to Lerendor for 365 days.
6. Calls `zin_world_add_gathering_dark` with 4.
7. Fires `zin_leren.30` for Lerendor, `zin_leren.31` for Aenor and news `zin_leren.32` for everyone.

The withdrawal is **not** a declaration of war on Aenor. On the break route no wargoal against Aenor is ever generated. On the supremacy route, claims on the far shore come from separate focuses after the withdrawal.

**Triggers of the withdrawal:**

| Path | When |
| --- | --- |
| Break route focus Withdraw from the Treaty | `zin_war_of_last_crowns`, or `zin_golden_king_dead` and standing ≤ -60 |
| Supremacy route focus Tear Up the Treaty | same conditions |
| Refusing Aenor's call at standing ≤ -40 | any time |
| AI fallback `zin_leren.35` (hidden) | 30 days after `zin_war_of_last_crowns`, if Lerendor is AI, not on the honour route, standing ≤ -40 and the treaty still stands |
| Player prompt `zin_leren.36` | 14 days after `zin_war_of_last_crowns`, if a human Lerendor has taken no route: honour now, withdraw now, or wait |

### 8. Closing the strait

On the break and supremacy routes, and on any route while Lerendor is at war, the decision `zin_leren_close_the_strait` (targeted) shuts the strait to one country's shipping. Target: a country at war with Lerendor, or, after `zin_leren_withdrawal`, any country at war that is not in Lerendor's faction. Requires `zin_leren_holds_strait` and the focus Close the Northern Seas or The Strait Watch. Cost 50 political power. The target gets `zin_leren_strait_closed` for 180 days and opinion modifier `zin_leren_strait_closed_on_us`.

### 9. The Dark Lands across the straits

South-west of Sonargur, across narrow straits, lie the Dark Lands: Goldoroth the orc kingdom that wants the whole region, Dondor and its Dark Sea Accord with Belonton, the free human towns of Blackton, and a dozen orc and goblin holds. Volgan's agents court them; most answer only to themselves (established).

The mechanic gives Lerendor three tools, all opened by the tree's Dark Shore branch:

- **Lean** also exists on Dark Lands coastal countries (`zin_leren_lean`, start 0; Blackton 10; Dondor 10; Goldoroth -20). The Compact decisions accept Dark Lands targets once the focus Across the Dark Straits is done.
- **Protection**: Blackton and coastal holds may accept Leren protection (`zin_leren.71`) at lean 80, or on the supremacy route at lean 60.
- **Wars on the Dark Shore** open only when Goldoroth is at war with Dondor or Blackton, or after `zin_war_of_last_crowns`.

Learning of Volgan's agents in the holds (tree event) sets country flag `zin_leren_heard_whispers`. It reveals nothing about Volgan's march.

### 10. Zol's dead from the north

Zol's Mistake is the black north and the islands of the Ocean of Zol. When Zol's dead rise (`zin_zol_rising`, Zol's Mistake spec), they come "through islands and straits". Proposed reading: the Narrow Strait is one of their roads south to the Middle Lands, so Lerendor stands in their path whatever its route.

Before `zin_zol_rising`, Lerendor sees only hints: fishermen's tales of black ships (`zin_leren.50`, flavour; no gameplay advantage beyond a flag). After it:

- `zin_leren.51` (The Dead on the Northern Shore) fires for Lerendor and every North Lands country with a coast; Lerendor's AI switches to defence (see AI).
- The tree's Long Watch branch unlocks its war focuses.
- Scripted trigger `zin_leren_strait_barred` is true while Lerendor controls every `zin_is_site_strait_north` state, is at war with Zol, and has completed Hold the Capes or The Watch Holds. **Proposed hook for the Zol spec:** while it is true, Zol's crossing into the Middle Lands through the strait is slowed or redirected. The Zol spec decides how; this spec only provides the trigger.
- Ordinary Leren troops cannot permanently end Zol's dead (established). Focus Seek the Old Wards sets `zin_leren_seeks_wards`; the world-systems spec decides whether that grants access to warding units or magic. This spec gives no such power itself.

### 11. The Deliverer, Aurevan and Eindil

- The Deliverer's temples exist in Lerendor as everywhere. Focuses change `zin_footholds` (Afrit's variable) by calling `zin_afrit_add_footholds` (proposed name; see contract additions).
- When `zin_aurevan_crowned` is set, Aurevan's envoys ask Lerendor to renew its oaths (`zin_leren.41`). No text names Afrit before `zin_afrit_revealed`.
- When Eindil's warning reaches the courts (`zin_leren.45`), Lerendor hears of a stranger in Aenor whom Parim calls an impostor.
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
| 4A 1755 | `zin_war_of_last_crowns`: Lerendor withdraws from the treaty (`zin_leren_withdrawal`). `zin_zol_rising`: the dead reach the northern shore. Lerendor holds the North and closes the strait to belligerents. |
| 4A 1757 | `zin_eindil_returned`: free northern companies join Eindil's coalition as volunteers. Lerendor stays independent. |
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

### Files

| Path | Content |
| --- | --- |
| `common/scripted_effects/zin_leren.txt` | Mechanic effects below |
| `common/scripted_triggers/zin_leren.txt` | Mechanic triggers below |
| `common/ideas/zin_leren.txt` | Mechanic spirits |
| `common/dynamic_modifiers/zin_leren.txt` | `zin_leren_strait_dues`, `zin_leren_union`, `zin_leren_hegemony_mod` |
| `common/opinion_modifiers/zin_leren.txt` | Opinion modifiers below |
| `common/decisions/categories/zin_leren.txt`, `common/decisions/zin_leren.txt` | Two decision categories |
| `events/zin_leren.txt` | Namespace `zin_leren` (mechanic-owned; may use `trigger` and `mean_time_to_happen`) |
| `common/on_actions/zin_leren.txt` | `on_startup` → `zin_leren.1`; `on_monthly_<Lerendor tag>` → `zin_leren_monthly` |
| `common/game_rules/zin_leren.txt` | `zin_rule_leren_route` |
| `localisation/english/zin_leren_l_english.yml` | All text |

The content builder resolves "Lerendor", "Aenor" and other names to tags at build time. Scripts refer to Lerendor through a generated scripted trigger `zin_is_lerendor` and an event target `zin_leren_country` set on startup.

### Variables

| Variable | Scope | Range | Start | Meaning |
| --- | --- | --- | --- | --- |
| `zin_strait_standing` | Lerendor | -100–100 | -15 | Contract variable |
| `zin_leren_toll_level` | Lerendor | 0–4 | 1 | Strait dues |
| `zin_leren_union_cohesion` | Lerendor | 0–100 | 55 | Unity of the two crowns |
| `zin_leren_hegemony` | Lerendor | 0–100 | computed | Lerendor's lead over the North Lands |
| `zin_leren_lean` | each North Lands and Dark Lands coastal country | -100–100 | table above | Lean to Sonargur (+) or Parim (-) |
| `zin_leren_toll_pp`, `zin_leren_toll_cg`, `zin_leren_union_stab`, `zin_leren_union_pp`, `zin_leren_heg_pp`, `zin_leren_heg_trade` | Lerendor | derived | derived | Values read by the dynamic modifiers; set by `zin_leren_monthly` |

### Flags

| Flag | Kind | Set by |
| --- | --- | --- |
| `zin_leren_withdrawal` | global (contract) | `zin_leren_withdraw` |
| `zin_leren_treaty_honoured` | global (new) | honour option of `zin_leren.20` |
| `zin_leren_strait_supremacy` | global (new) | `zin_leren_declare_supremacy` |
| `zin_leren_route_honour`, `zin_leren_route_break`, `zin_leren_route_supremacy` | Lerendor | route focuses |
| `zin_leren_toll_redressed`, `zin_leren_toll_mocked`, `zin_leren_toll_arbitrated` | Lerendor | toll quarrel |
| `zin_leren_oath_to_new_king` | Lerendor | `zin_leren.41` option renew |
| `zin_leren_heard_whispers`, `zin_leren_heard_fishermen`, `zin_leren_heard_eindil`, `zin_leren_seeks_wards` | Lerendor | events and focuses |
| `zin_leren_called_<war>` | Lerendor, temporary | stops `zin_leren.20` repeating within one war (cleared when Aenor has no defensive war) |

### Scripted triggers

| Trigger | Scope | True when |
| --- | --- | --- |
| `zin_is_lerendor` | country | the country is Lerendor (generated tag check) |
| `zin_leren_treaty_in_force` | any | Lerendor and Aenor exist and `zin_leren_withdrawal` is not set |
| `zin_leren_honours_treaty` / `zin_leren_stands_apart` / `zin_leren_seeks_supremacy` | any | Lerendor has the matching route flag |
| `zin_leren_strait_trusted` / `zin_leren_strait_broken` | any | standing ≥ 40 / ≤ -40 |
| `zin_leren_holds_strait` | any | Lerendor or its subjects control every `zin_is_site_strait_north` state and Sonargur (`zin_is_site_sonargur`) |
| `zin_leren_strait_barred` | any | `zin_leren_holds_strait`, Lerendor at war with Zol, and Hold the Capes or The Watch Holds completed |
| `zin_leren_is_north_crown` | country | capital state has `zin_is_region_north_lands`; not Lerendor |
| `zin_leren_is_dark_shore` | country | capital state has `zin_is_region_dark_lands` and the country is coastal |
| `zin_leren_question_open` | Lerendor | the Question of the Strait's availability rule |

### Scripted effects

All take parameters with the `$name$` syntax.

| Effect | Scope | Does |
| --- | --- | --- |
| `zin_leren_add_strait_standing` (`value`) | any | If the treaty is in force: add to Lerendor's standing, clamp -100–100, refresh band |
| `zin_leren_set_toll_level` (`level`) | Lerendor | Set level, refresh `zin_leren_strait_dues` values |
| `zin_leren_add_union_cohesion` (`value`) | Lerendor | Add, clamp 0–100, refresh `zin_leren_union` |
| `zin_leren_add_lean` (`value`) | target country | Add to that country's lean, clamp -100–100 |
| `zin_leren_update_hegemony` | Lerendor | Recompute hegemony and its modifier values |
| `zin_leren_update_treaty_band` | Lerendor | Swap band spirits |
| `zin_leren_monthly` | Lerendor | Drift standing, cohesion and lean; update hegemony and band; add or remove `zin_leren_keepers_of_the_strait`; fire the `zin_leren.20`, `.35`, `.36`, `.55`, `.80` checks; fire tree event `zin_lerendor.14` once when focus Faithful to the Crown of Parim is done and `zin_afrit_king_of_east` is set |
| `zin_leren_clear_grievances` | Lerendor | Remove `zin_leren_grievance_1716` and `zin_leren_grievance_unanswered` and opinion modifiers `zin_leren_toll_grievance` and `zin_leren_toll_mocked` |
| `zin_leren_withdraw` | any | The withdrawal (section 7) |
| `zin_leren_join_aenor_defence` | Lerendor | `add_to_war` for each of Aenor's defensive wars; sets `zin_leren_treaty_honoured` |
| `zin_leren_invite_to_compact` (`target`) | Lerendor | Fire `zin_leren.70` for target |
| `zin_leren_offer_protection` (`target`) | Lerendor | Fire `zin_leren.71` for target |
| `zin_leren_close_strait` (`target`) | Lerendor | Timed idea on target, opinion modifier, `zin_leren.90` |
| `zin_leren_claim_r_en` | Lerendor | `add_state_claim` on every state R'en owns; wargoal `puppet_wargoal_focus` on R'en if the peace gate is open |
| `zin_leren_claim_far_shore` | Lerendor | `add_state_claim` on every `zin_is_site_strait_south` state; wargoal `take_state_focus` on each owner if the peace gate is open |
| `zin_leren_declare_supremacy` | Lerendor | Set `zin_leren_strait_supremacy`, news `zin_leren.60`, toll level 4 allowed |

### Spirits (mechanic)

| Key | Name | Modifiers | Added / removed |
| --- | --- | --- | --- |
| `zin_leren_grievance_1716` | The Grievance of 1716 | war_support_factor 0.03, political_power_gain -0.05 | Start; removed by redress or arbitration won; swapped for the next on mockery |
| `zin_leren_grievance_unanswered` | An Insult Unanswered | war_support_factor 0.05, stability_factor -0.02 | Toll quarrel mocked; removed by withdrawal or by Renew the Oaths of 512 |
| `zin_leren_treaty_trusted` | The Treaty Trusted | stability_factor 0.03, consumer_goods_factor -0.02, opinion_gain_monthly_factor 0.10 | Band |
| `zin_leren_treaty_broken_faith` | Broken Faith | war_support_factor 0.05, stability_factor -0.03, drift_defence_factor 0.10 | Band |
| `zin_leren_treaty_torn` | The Treaty Torn | war_support_factor 0.05, stability_factor -0.05, political_power_gain 0.10 | Withdrawal, 365 days |
| `zin_leren_strait_closed` | The Strait Is Closed | naval_speed_factor -0.10, navy_max_range_factor -0.15, consumer_goods_factor 0.02 | On a target, 180 days |
| `zin_leren_keepers_of_the_strait` | Keepers of the Strait | naval_detection 0.10, convoy_raiding_efficiency_factor 0.10, positioning 0.05 | While `zin_leren_holds_strait` and Lerendor is at war; monthly check |
| `zin_leren_charter_trade` | Compact Trade Charters | consumer_goods_factor -0.01 | Decision `zin_leren_trade_charter`, 365 days; re-adding refreshes the timer (does not stack) |

### Dynamic modifiers

| Key | Modifiers (variable-valued) |
| --- | --- |
| `zin_leren_strait_dues` | political_power_gain = `zin_leren_toll_pp`; consumer_goods_factor = `zin_leren_toll_cg` |
| `zin_leren_union` | stability_factor = `zin_leren_union_stab`; political_power_factor = `zin_leren_union_pp` |
| `zin_leren_hegemony_mod` | political_power_gain = `zin_leren_heg_pp`; faction_trade_opinion_factor = `zin_leren_heg_trade` |

### Opinion modifiers

| Key | Value | Notes |
| --- | ---: | --- |
| `zin_leren_treaty_partner` | +20 | trade = yes; Aenor ↔ Lerendor at start |
| `zin_leren_toll_grievance` | -15 | Lerendor → Aenor at start; removed on redress |
| `zin_leren_toll_mocked` | -20 | Lerendor → Aenor; decays 1 per month |
| `zin_leren_treaty_broken` | -40 | both ways on withdrawal; decays 0.5 per month |
| `zin_leren_compact_kin` | +15 | between Compact members; added on joining |
| `zin_leren_strait_closed_on_us` | -30 | target → Lerendor; decays 1 per month |

### Decisions

**Category `zin_leren_strait` (The Narrow Strait)**, visible to Lerendor.

| Key | Available | Cost | Effect | AI |
| --- | --- | --- | --- | --- |
| `zin_leren_toll_lower` | level > 0; 90-day cooldown | 25 PP | level -1; standing +3 | honour route: when level > 1 |
| `zin_leren_toll_raise` | level < max (2, 3 with Full Strait Dues, 4 with The Iron Toll); 90-day cooldown | 25 PP | level +1; standing -3 | break: up to 2; supremacy: up to max |
| `zin_leren_appeal_to_the_treaty` | treaty in force; 180-day cooldown | 50 PP | standing +5; Aenor opinion +5 | honour route only |
| `zin_leren_close_the_strait` (targeted) | section 8 | 50 PP | `zin_leren_close_strait` | at war, on enemies with navies |

**Category `zin_leren_compact` (The Leren Compact)**, visible to Lerendor after focus The Leren Compact. Targets: `zin_leren_is_north_crown`, plus `zin_leren_is_dark_shore` after Across the Dark Straits. None of these target a country at war with Lerendor.

| Key | Requires | Cost | Effect | Cooldown |
| --- | --- | --- | --- | --- |
| `zin_leren_send_envoys` | Envoys to the Northern Crowns | 25 PP | lean +10 | 120 days per target |
| `zin_leren_trade_charter` | The Compact Tariff | 50 PP | lean +15; timed idea `zin_leren_charter_trade` on Lerendor for 365 days | once per target |
| `zin_leren_marriage_pact` | Marriages Across the North | 75 PP | lean +25; target opinion +20 | once per target |
| `zin_leren_invite_to_compact` | Open the Compact; lean ≥ 50; target not in a faction | 25 PP | `zin_leren.70` | 180 days per target |
| `zin_leren_offer_protection` | One Banner for the North or supremacy route; lean ≥ 80 (≥ 60 on supremacy); hegemony ≥ 60 | 100 PP | `zin_leren.71` | 365 days per target |

### Events (namespace `zin_leren`)

| Id | Title | For | Trigger | Options (AI) |
| --- | --- | --- | --- | --- |
| .1 | (hidden) Startup | Lerendor | on_startup | Set variables, leans, spirits, opinion modifiers, event target |
| .10 | The Toll Rolls of 1716 | Lerendor | focus Read the Toll Rolls | "The debt is still owed" (flag ready; +25 PP) / "Let old ledgers lie" (standing +5; the quarrel focus still possible) |
| .11 | Leren Envoys Demand Redress | Aenor | focus Reopen the Toll Quarrel | Pay redress: -75 PP, standing +20 (AI 20) / Arbitration at Eekedor: standing +5, `.13` in 60 days (AI 30) / Laugh them out of the Golden Court: +25 PP, standing -10, flag mocked (AI 50, ×1.5 if `zin_court_corruption` ≥ 60) |
| .12 | Parim's Answer | Lerendor | after `.11` | One option per outcome; mockery swaps the grievance spirit |
| .13 | The Arbitration of Eekedor | Lerendor and Aenor | 60 days after `.11` | Ruling for Lerendor (chance 50 + Eekedor lean ÷ 4): standing +10, grievance removed; for Aenor: standing -5 |
| .15 | A Merchantman Refuses the Toll | Lerendor | MTTH 720 days; toll ≥ 2; treaty in force | Seize the cargo (+30 PP, standing -5) / Waive it (standing +3) / Refer it to Parim (-25 PP) |
| .20 | Aenor Calls on the Treaty | Lerendor | monthly check, section 6 | Honour / Ask for time / Refuse |
| .21 | The North Answers | Aenor | after `.20` | Acknowledge |
| .30 | The Treaty of the Narrow Strait Is Ended | Lerendor | `zin_leren_withdraw` | "The North stands alone" |
| .31 | The North Withdraws | Aenor | `zin_leren_withdraw` | Acknowledge (the Aenor spec may add options) |
| .32 | The Narrow Strait Treaty Ends | all (news) | `zin_leren_withdraw` | Acknowledge |
| .33 | The Old Alliance Holds | all (news) | `zin_leren_treaty_honoured` set | Acknowledge |
| .35 | (hidden) The Court Decides | Lerendor | AI fallback, section 7 | `zin_leren_withdraw` |
| .36 | The War and the Treaty | Lerendor (human) | 14 days after `zin_war_of_last_crowns`, no route | Honour now (sets honour flag, fires `.20`) / Withdraw now / Wait (repeats in 60 days, standing -5) |
| .40 | The Golden King Is Dead | Lerendor | `zin_golden_king_dead` | Send mourners (-25 PP, standing +3) / A cold letter (standing -3) |
| .41 | Envoys of the New King | Lerendor | `zin_aurevan_crowned` | Renew the oaths: standing +15, `zin_afrit_add_footholds` 1, flag (AI 20; honour ×3) / Delay: standing -5 (AI 60) / Refuse: standing -15, war support +3% (AI 20; supremacy ×3) |
| .45 | A Stranger's Warning | Lerendor | 180 days after `zin_glo_with_eindil` (stand-in until the Eindil spec names the warning step) | Send someone to hear him (flag heard Eindil; -25 PP) / Parim calls him an impostor (standing +2) |
| .50 | Black Ships Among the Islands | Lerendor | MTTH 540 days, 4A 1749–1755, needs focus Hear the Fishermen | Flavour; flag heard fishermen; +5 navy experience |
| .51 | The Dead on the Northern Shore | Lerendor and coastal North Lands crowns | `zin_zol_rising` | "To the capes" (war support +10%) |
| .55 | The Strait Barred | all (news) | `zin_leren_strait_barred` first true | Acknowledge |
| .60 | Sovereign of the Narrow Sea | all (news) | `zin_leren_declare_supremacy` | Acknowledge |
| .70 | An Invitation from Sonargur | target | `zin_leren_invite_to_compact` | Join (add to Lerendor's faction; `zin_leren_compact_kin`) (AI chance = lean) / Decline (lean -10) |
| .71 | Sonargur Offers Protection | target | `zin_leren_offer_protection` | Accept (Lerendor `puppet`s target) (AI chance = lean − 40, ×2 if target at war with Zol) / Refuse (lean -20) |
| .72 | Answer from the North | Lerendor | after `.70`/`.71` | Result text |
| .80 | The Lerenwaith Question | Lerendor | cohesion ≤ 25; MTTH 180 days | Grant the estates' petition (-50 PP, cohesion +15) / Hold firm (cohesion +5, stability -5%, war support +3%) |
| .81 | One Throne Again | Lerendor | cohesion ≥ 80 first time | Flavour; stability +3% |
| .90 | The Strait Is Closed | target | `zin_leren_close_strait` | Acknowledge |

Before `zin_afrit_revealed`, every text above calls Aenor's new king "King Aurevan" or "the Deliverer"; none names Afrit.

### Game rules

`zin_rule_leren_route` (Lerendor AI route): `historical` (default: break route, withdrawal at the war), `honour`, `supremacy`, `free` (weights from court spirits, standing and hegemony). When `zin_rule_historical_path` is on, the AI uses `historical` whatever this rule says.

### Defines

None.

### Map and site dependencies

These site triggers come from the key sites table ([../01_map/02_key_sites.md](../01_map/02_key_sites.md)); this spec asks for new rows:

| Trigger | Needs |
| --- | --- |
| `zin_is_site_sonargur` | Lerendor's capital state (row "Sonargur and the strait") |
| `zin_is_site_strait_north` (new) | The Leren-shore states on the Narrow Strait, including Sonargur and R'en's coast |
| `zin_is_site_strait_south` (new) | The far-shore states across the strait (Middle Lands and Dark Lands coasts) |
| `zin_is_region_north_lands`, `zin_is_region_dark_lands` (new) | State-scope region tests generated from the region table |

Lerendor needs a naval base of at least level 3 at Sonargur and a starting fleet of two strait squadrons of the warfare spec's galleys (proposed) in `history/units`.

## AI

- Startup: `add_ai_strategy` for Lerendor: `befriend` Eekedor, Mina and The Hold (value 50); `naval_dominance` style weights through spirits with `ai_focus_naval_factor` (tree).
- Toll: the AI raises the toll to 2 within the first year of the historical route; to 3 only on supremacy; lowers to 1 on honour.
- Compact decisions: AI sends envoys to the three highest-lean crowns first; invites any crown at lean ≥ 60; never targets a crown that Aenor guarantees.
- Routes follow `zin_rule_leren_route`. With `free`: honour weight = 50 + standing; break weight = 50 − standing ÷ 2; supremacy weight = hegemony (×2 with Admiralty Ascendant).
- After `zin_zol_rising`: AI strategy `prepare_for_war` against Zol; garrison weight on `zin_is_site_strait_north` states; decision Close the Strait on any belligerent that sends fleets through.
- Aenor's AI answer in `.11` uses its court corruption; in `.20` Lerendor's AI follows its route.

## Acceptance

1. A new game on 1 Thaw 4A 1748: Lerendor has standing -15, toll 1, cohesion 55, hegemony about 2; Eekedor is in the Leren Compact; Lerendor is at peace; no Leren wargoal or claim exists.
2. No decision or event in this spec can start a war before a story flag or a route choice (scan of every `create_wargoal`, `declare_war_on` and `add_state_claim` against the peace gates).
3. Changing standing by script crosses bands correctly: spirits swap at 40 and -40.
4. Every toll level changes the dynamic modifier; level 3 needs Full Strait Dues; level 4 needs The Iron Toll.
5. Historical AI run, 4A 1748 to 4A 1760 with `zin_rule_historical_path`: the toll quarrel is mocked; standing is between -75 and -55 on Thaw 4A 1755; `zin_leren_withdrawal` is set within 60 days of `zin_war_of_last_crowns`; Lerendor never declares war on Aenor; Lerendor fights Zol after `zin_zol_rising`.
6. With `zin_rule_leren_route = honour`: Lerendor joins Aenor's defensive war in 4A 1755 and `zin_leren_treaty_honoured` is set; `zin_leren_withdrawal` is not.
7. With `zin_rule_leren_route = supremacy`: Lerendor reaches hegemony 40 or more, withdraws, claims R'en and the far shore, and sets `zin_leren_strait_supremacy` in at least one of five runs.
8. The compiler's secret check passes: no `zin_leren` text reachable before `zin_afrit_revealed` names Afrit.
9. Every modifier key used here exists in the game's modifier documentation.
10. 60 days of the Linux run produce no new errors from `zin_leren` files.

## Open questions

1. The working table puts **Andos Enda**, an elven federation of the Magical Lands, in the Leren Compact; the map starts the Compact with Eekedor only. Should Andos Enda join at start, be courtable, or be dropped?
2. Is the toll quarrel about Aenoran ships paying at Sonargur (as proposed here), or about Leren ships paying in Aenoran ports?
3. Where exactly is the Narrow Strait: between the North Lands and the Middle Lands, between the North Lands and the Dark Lands, or both? The site lists need it.
4. Should the Leren king have a lore name? The map's generated ruler name stands until then.
5. Do the North Lands' smaller crowns also withdraw from Aenoran alliances on their own, or only through Lerendor?
6. Does the owner want a peaceful, non-war version of supremacy (purchase of R'en, a toll empire) as well as the war version?
