# Historical path and AI

**Status:** Draft. **Priority:** 3. **Phase:** 3 (frame), 5 (full chain).

## Purpose

The established story of the end of the Fourth Age must be able to play out from 1 Thaw 4A 1748 to Eindil's coronation in 4A 1760 with no player, and every step must still be something a player can change. Each mechanic spec already owns its own moments, dates and catch-ups. This spec puts them in one timed sequence of **checkpoints**, defines what the game rule `zin_rule_historical_path` means for the AI, tracks how far a game has left history, and sets the fail-safes that keep the story from stalling.

The checkpoints use the story flags of the [shared contract](../04_mechanics/00_shared_contract.md) and the flags the mechanic specs define. Owners keep their events; this spec owns the order, the windows, the AI policy, the checkpoint states and the watchdog.

## Lore basis

**Established** (*Fourth Age Canon Register*, *The Fourth Age of Erdae*, owner 18 October 2026): the order of events. At the start the Golden King reigns, Eindil has not appeared, Afrit is unrevealed and the world seems at peace. Then: Eindil wakes in the Cold Lands, is helped by tribes and West Lands travellers, does deeds, briefly serves as a western king and makes peace; Afrit murders the Golden King and takes the throne openly; Eindil's crossing fails and he reaches the Islands of the South, then Lorien, who names him; Afrit ambushes his crew, reaches Horos first, wounds him mortally and is wounded by Eindil; Horos gives Glo and his sword to Eindil; Eindil warns Aenor and is not believed; the West crosses and takes the capital, the North leaves the old alliance, the East threatens the Magical Lands, Volgan retakes Mirolon and marches, Zol's dead rise; Afrit abandons Aenor and becomes King of the East; Eindil returns on a dragon with Varner and Golbran; Varner dies; Volgan casts Eindil down and the New Gods restore him; Eindil destroys Volgan's body; Zol manifests, breaks the sword and is forced back as Lorien dies; Afrit returns, casts Eindil from a cliff and claims all Erdae; in the palace Alleria and Golbran help strip his artifacts, Eindil kills him, Golbran dies; Eindil is crowned.

**Proposed** (*Fourth Age Chronology*): every date, from the start on 1 Thaw 4A 1748 to the coronation in 4A 1760; the Truce of the Grey Ford; Chancellor Merovan; the western episodes; Alleria's earlier protection of Eindil.

**Proposed in this spec:** the checkpoint list and windows, the checkpoint states and divergence, the watchdog, the meaning of each rule option for the AI.

## Design

### The game rule

`zin_rule_historical_path` is defined in the foundation's rules file ([00_foundation/05_defines_and_rules.md](../00_foundation/05_defines_and_rules.md)) with the options below; scripts read it through the foundation's triggers `zin_rules_is_historical` and `zin_rules_is_free` (PLAUSIBLE is neither). A per-power rule set to `DEFAULT` follows it; any other option forces that branch for the AI. Rules never act on a player's country.

| Option | Default | AI behaviour | What the path forces |
| --- | --- | --- | --- |
| `HISTORICAL` | yes | AI takes the historical choice every time, inside the chronology's windows | The owners' catch-ups (each spec lists its own) and this spec's War of the Last Crowns date |
| `PLAUSIBLE` | | AI weights favour history (historical option weight ×3) but other routes stay possible. Once `zin_path_divergence` ≥ 50, the favour drops to ×1.5 | The War of the Last Crowns by 1 Thaw 4A 1756 at the latest; owners' catch-ups only where they say so |
| `FREE` | | AI weighs every choice by its own situation | Nothing. Checkpoints still resolve (diverged or skipped) by their deadlines |

Story events outside any country's choice (Eindil's waking and journey floors, the Council's plot clock) run under every option unless their own rule changes them (`zin_rule_eindil_waking`, `zin_rule_golden_king` and the rest).

**Story pace.** `zin_rule_story_pace` (foundation) stretches dates by `zin_story_pace` (1.0, 1.5 or 0.75): a checkpoint date *d* becomes start + (*d* − start) × pace. The builder writes the three shifted date sets into the checkpoint triggers and the tick uses the set that matches the rule. Owner specs that use fixed floor dates must read the same pace (dependency).

### Checkpoint states

Each checkpoint has a global variable `zin_path_cpNN`:

| Value | State | Meaning |
| ---: | --- | --- |
| 0 | pending | Not yet resolved |
| 1 | historical | Happened as in the chronicle |
| 2 | diverged | Happened another way, or a deadline passed without it |
| 3 | skipped | Can no longer happen (an actor is gone or a precondition is impossible) |

`zin_path_divergence` (0–100) rises by the checkpoint's weight × 10 when it diverges and × 5 when it is skipped. The Chronicle of the Age reads the states ([05_world_tension_and_endings.md](05_world_tension_and_endings.md)).

**The rule against deadlock:** a checkpoint waits only for its predecessors to be **resolved** (1, 2 or 3), never for them to be historical, and every checkpoint has a latest date after which it resolves.

### The checkpoints

Dates are engine dates at the standard pace (month 2 is Ironfrost, 3 Thaw, 4 Rainwake, 5 Sowing, 6 Highsun, 7 Goldfield, 9 Fallowing, 10 Emberleaf, 11 Mistfall). "Historical when" is what makes the state 1; "Diverged when" makes it 2; "Skipped when" makes it 3. The latest date is when a still-pending checkpoint is marked diverged.

| CP | Moment | Owner | Historical when | Target | Latest | Diverged when | Skipped when | Weight |
| ---: | --- | --- | --- | --- | --- | --- | --- | ---: |
| 01 | The peaceful start | world | No war exists; no story flag set | 1748.3.1 | — | — | — | 0 |
| 02 | Eindil wakes | [Eindil's journey](../04_mechanics/eindil_journey.md) | `zin_eindil_awake` (stage 1) | 1749.2.1 | 1752.1.1 | woken under `zin_rule_eindil_waking` EARLY or LATE | — | 2 |
| 03 | The Grey Ford truce breaks | [Western Crossing](../04_mechanics/western_crossing.md) | `zin_west_truce_broken` | 1750.4.1 | 1750.10.1 | `zin_west_truce_permanent`, or still unbroken | Gunwaith or Girdon gone | 1 |
| 04 | Eindil, war-king of the West, makes peace | Eindil's journey, West | `zin_eindil_war_king` (stage 3) | 1750.8.1 | 1751.3.1 | named by another confederation, or the fallback | `zin_eindil_lost` | 2 |
| 05 | The Golden King dies | [Aenor](../04_mechanics/aenor_court_and_succession.md), [Afrit](../04_mechanics/afrit_hidden_council.md) | `zin_golden_king_dead` after `zin_afrit_regicide_ready` | 1750.11.10 | 1753.1.1 | `zin_afrit_regicide_exposed`, `zin_golden_king_survives`, or the King alive at the latest date | — | 5 |
| 06 | Aurevan is crowned | Afrit, Aenor | `zin_aurevan_crowned` | 05 + 14 days | 05 + 90 days | `zin_afrit_kingdom_behind_throne`, or another camp rules | 05 diverged | 5 |
| 07 | The storm; the Islands of the South | Eindil's journey | stage 4 | 1751.3.1 | 1752.3.1 | — | `zin_eindil_lost` | 1 |
| 08 | Lorien names Eindil | Eindil's journey | `zin_eindil_named` (stage 5) | 1752.1.15 | 1753.1.1 | named by another route of the journey spec | Gala Elves gone or `zin_lorien_dead` | 3 |
| 09 | Yeldenne: the ambush, Horos dies, Glo to Eindil | [Yeldenne and Glo](../04_mechanics/yeldenne_and_glo.md), Afrit, Eindil's journey | `zin_horos_dead`, `zin_glo_with_eindil` and `zin_afrit_wounded` (hall case A) | 1753.7.1 | 1754.6.1 | any other hall case (B1, B2, C, D), or Horos alive at the latest date | Mp'E already lost with Glo sealed or dimmed before the heir sails | 5 |
| 10 | Eindil warns Aenor and is denounced | Eindil's journey, Aenor | `zin_aenor_eindil_denounced` | 1754.5.1 | 1755.3.1 | the Aenor realm heeds him | `zin_eindil_lost` | 3 |
| 11 | The War of the Last Crowns | world ([05_world_tension_and_endings.md](05_world_tension_and_endings.md)) | `zin_war_of_last_crowns` on the HISTORICAL date | 1755.4.1 | 1756.3.1 | set on another date or by a dark war | — | 5 |
| 12 | Lerendor leaves the treaty | [Lerendor](../04_mechanics/lerendor_narrow_strait.md) | `zin_leren_withdrawal` within 60 days of 11 | 11 + 30 | 11 + 180 | `zin_leren_treaty_honoured`, `zin_leren_strait_supremacy`, or still in force | Lerendor or Aenor gone | 3 |
| 13 | The Western Crossing | West | `zin_western_crossing` within 60 days of 11 | 11 + 45 | 11 + 365 | the divided or relief route, or no crossing | — | 4 |
| 14 | The eastern invasion | [Eastern kings](../04_mechanics/eastern_kings.md) | `zin_eastern_invasion` within 90 days of 11 | 11 + 60 | 11 + 365 | no coalition forms | — | 3 |
| 15 | Volgan retakes Mirolon and marches | [Volgan](../04_mechanics/volgan_southern_dominion.md) | `zin_mirolon_fallen` then `zin_volgan_marches` | 1755.11.1 | 1756.9.1 | Mirolon holds at the latest date | Volgan gone | 5 |
| 16 | Zol's dead rise | [Zol's Mistake](../04_mechanics/zols_mistake.md) | `zin_zol_rising` | 1755.7.1 | 1756.3.1 | risen on another date, or not by the latest date | `zin_zol_presence_lapsed` | 4 |
| 17 | Afrit abandons Aenor; King of the East; the name is known | Afrit, eastern kings | `zin_afrit_abandoned_aenor`, `zin_afrit_king_of_east`, `zin_afrit_revealed` | 1756.3.1 | 1757.3.1 | `zin_afrit_stand_in_parim`, or no eastern throne | 06 skipped and no Afrit realm | 4 |
| 18 | Western armies take Parim | West | `zin_west_parim_taken` | 1756.6.1 | 1757.3.1 | not taken (battle result; never forced) | 13 diverged | 2 |
| 19 | Eindil returns on a dragon with Varner and Golbran | Eindil's journey, magic | `zin_eindil_returned` with the war running | 1757.3.1 | 1758.6.1 | the quiet return (no war) | `zin_eindil_lost` | 5 |
| 20 | Varner's wards; Varner dies | Eindil's journey, [magic](04_magic_and_world_systems.md) | `zin_varner_dead` | 1757.6.1 | 1758.3.1 | — | Zol never at war with Eindil's host | 3 |
| 21 | Volgan casts Eindil down; the New Gods restore him | Eindil's journey, magic, Volgan | `zin_eindil_restored` | 1757.7.1 | 1758.3.1 | — | Volgan's body already destroyed or Volgan gone; or no Glo (`zin_eindil_lost`) | 4 |
| 22 | Volgan's manifested body is destroyed | Volgan | `zin_volgan_body_destroyed` | 1757.8.1 | 1758.6.1 | not achieved (battle result) | Volgan gone | 5 |
| 23 | Zol manifests and is forced back; Lorien dies | Zol's Mistake | `zin_zol_manifested`, `zin_zol_withdrawn`, `zin_lorien_dead` | 22 + 7 days | 1758.9.1 | manifested without Lorien's death, or never | 16 skipped | 5 |
| 24 | Afrit returns and casts Eindil from the cliff | Afrit, Eindil's journey | `zin_afrit_returned`, `zin_eindil_cast_down`, `zin_afrit_claims_erdae` | 1758.3.1 | 1759.3.1 | any of the three missing at the latest date | `zin_afrit_dead` earlier, or no Afrit realm | 4 |
| 25 | The palace: the artifacts stripped, Afrit and Golbran die | Eindil's journey, Afrit | `zin_afrit_dead`, `zin_golbran_dead`, `zin_afrit_artifacts` = 0 | 1759.3.1 | 1760.3.1 | `zin_afrit_palace_held` | `zin_eindil_lost` | 5 |
| 26 | Eindil is crowned | Aenor | `zin_eindil_crowned` (then the Lost Cause ending) | 1760.3.1 | 1761.3.1 | — | 25 not historical and Eindil cannot be crowned | 5 |

The two contract flags without a clear single setter are now placed: `zin_war_of_last_crowns` is set by world systems (CP 11); `zin_eastern_invasion` by the eastern kings spec (CP 14).

### What the fail-safes may and may not do

- **May force** (under the options above): story events of the world or of AI countries; declarations of war by AI under HISTORICAL, made by the owner's event with `create_wargoal` and `declare_war_on`; the War of the Last Crowns flag.
- **May never force:** a battle result, a state's control, a capitulation, or any choice a human makes for their own country. Player choice events put the historical option first and carry `timeout_days = 30`; a timeout counts as the player's refusal (diverged), never as acceptance.
- **Never early:** no fail-safe reveals Afrit before 1754.6.1, shows Eindil before checkpoint 02, or starts a great war before checkpoint 11. The Grey Ford feud (CP 03) is a border war (`start_border_war`) between Gunwaith and Girdon, so no major takes part.

### The path tick

Runs monthly from the world tick, after the ending checks:

1. For each pending checkpoint whose predecessors are resolved:
   - if its skip condition holds, resolve it as skipped;
   - if its historical condition holds, resolve it as historical;
   - if its diverged condition holds, or the date passes its latest date, resolve it as diverged.
2. **Watchdog.** Every checkpoint must be resolved by its latest date + 30 days. If one is not (a predecessor stuck, a missing owner hook), it is resolved as skipped, `log = "ZIN path: checkpoint NN stalled"` is written, and the global flag `zin_path_stalled` is set. Acceptance runs fail on this flag.
3. After each resolution, add the checkpoint's weight to `zin_path_divergence` as above.

The tick never runs an owner's event itself. Owners fire their moments; the tick only records and resolves. The War of the Last Crowns (CP 11) is fired by the world tick of the tension spec.

### How the AI follows or diverges

- **Focus trees.** Every major tree marks its historical branch. Historical focuses carry `ai.modifiers` `{ "factor": 10, "if": [ { "check": "zin_rules_is_historical" } ] }`; alternative branches `{ "factor": 0, … }` under HISTORICAL. Under PLAUSIBLE the factors are 3 and 1 (1.5 and 1 once `zin_path_divergence` ≥ 50). Under FREE no path factor applies.
- **Events.** Every choice that matters to the path puts the historical option first. `ai_chance`: HISTORICAL 100/0; PLAUSIBLE 75/25, then 60/40 once divergence ≥ 50; FREE uses the owner's situational weights.
- **Situational weights** are each owner's (for example Lerendor's standing, the West's resolve, the East's footholds, Volgan's strength, Zol's power). This spec requires every owner to list them so FREE play is predictable.
- **AI strategy plans.** `common/ai_strategy_plans/zin_<tree>_historical.txt` for each tier A country, enabled by `zin_rules_is_historical`, listing focus order, laws and research weights; a `zin_<tree>_plausible.txt` variant enabled under PLAUSIBLE.
- **War direction.** When a war checkpoint fires, its owner's event adds AI strategies with `add_ai_strategy`. The minimum set, which owners may extend:

| CP | Who | Strategy |
| --- | --- | --- |
| 03 | Gunwaith, Girdon | border war only; no `conquer` |
| 13 | The Western Crossing faction | `invade` Aenor's coast 100; `conquer` the Aenor realm 100 |
| 14 | The eastern coalition | `conquer` the Magical Lands realms on the rift 80 |
| 15 | Volgan | `conquer` Mirolon 150; after `zin_volgan_marches`, `conquer` the Aenor realm 100 |
| 16 | Zol | `conquer` the North Lands coast and Aenor 80; avoids potent-magic armies (Zol spec) |
| 19–26 | Eindil's host and the Lost Cause | `area_priority` and `front_unit_request` against Zol, then Volgan, then Afrit's realm |
| 24 | Afrit's realm | `conquer` the controller of Parim 150 |

- **Peace.** Wars started by the path end through the engine's peace conferences or the owners' scripted peaces (the West's "Terms on the Shore", Zol's withdrawal, the Steward's peace with Mirolon). This spec adds one rule: after `zin_afrit_dead`, every AI country still at war only because of Afrit's realm accepts white peace.

### The player in the path

- A player's country is never driven by the fail-safes. Its choices resolve checkpoints as historical or diverged.
- World moments (Eindil's waking, the journey's floors, the Council's plot) still happen around the player, who can change them through mechanics: an Aenor player can expose the plot; a Yeldenne player can raise the wards; a Gala player can turn Eindil away; a Lerendor player can honour the treaty.
- After a divergence the next checkpoints use their "diverged" and "skipped" columns; the owners' alternative routes take over.

## Implementation

### Files

| Path | Content |
| --- | --- |
| `docs/design/path/checkpoints.json` | The table as data: id, owner, flags for historical, diverged and skipped, target and latest dates (three pace sets), weight |
| `common/scripted_triggers/zin_path.txt` | Generated: `zin_path_cpNN_historical`, `zin_path_cpNN_diverged`, `zin_path_cpNN_skipped`, `zin_path_cpNN_due` |
| `common/scripted_effects/zin_path.txt` | `zin_path_tick`, `zin_path_resolve` (args `cp`, `state`) |
| `events/zin_path.txt` | Namespace `zin_path`: `zin_path.1` hidden startup check (no war, no story flag, `zin_eindil` unrecruited; logs and sets `zin_path_stalled` on failure) |
| `common/ai_strategy_plans/zin_*_historical.txt`, `zin_*_plausible.txt` | AI plans for tier A countries |
| `common/ai_strategy/zin_path.txt` | Standing strategies enabled by the war checkpoints' flags |
| `localisation/english/zin_path_l_english.yml` | Chronicle lines for each checkpoint and state |

### Variables and flags

| Name | Kind | Meaning |
| --- | --- | --- |
| `zin_path_cp01` … `zin_path_cp26` | global variables, 0–3 | Checkpoint states |
| `zin_path_divergence` | global variable, 0–100 | How far the world has left history |
| `zin_path_stalled` | global flag | The watchdog had to skip a checkpoint (test failure marker) |

### Build checks

1. Every flag named in the checkpoint table is defined in the contract or in the owner spec named.
2. Every checkpoint has a latest date and a skip condition, except 01 and 11, which cannot be skipped.
3. No checkpoint's latest date is before a predecessor's target date.

## AI

The whole spec is AI policy. In short:

- Under HISTORICAL, a 12-year observer run reaches checkpoint 26 and the Lost Cause ending.
- Under PLAUSIBLE, the AI leans to history until the world has clearly drifted, then plays its situation.
- Under FREE, the AI never favours history; the world systems and the endings still work.
- No AI strategy targets a country before the checkpoint that justifies it; tier 1 of the Gathering Dark keeps `prepare_for_war` negative.

## Acceptance

1. **Observer, HISTORICAL, 3 seeds**, 1 Thaw 4A 1748 to 1 Deepwinter 4A 1761: every checkpoint resolves; 02, 05, 06, 08, 09, 11, 16, 17, 19, 25 and 26 are historical in every seed; `zin_ending_lost_cause` is set; `zin_path_stalled` is never set; the contract flags appear in the contract's historical order.
2. **Observer, FREE, 3 seeds:** every checkpoint resolves by its latest date + 30 days; `zin_path_stalled` is never set; an ending or `zin_ending_unfinished` is reached by 4A 1770.
3. **Start check:** on 1 Thaw 4A 1748 no war exists, `zin_eindil` is recruited by nobody, no contract story flag is set, and no reachable text names Afrit.
4. **No early great war:** under any option, no war with a major on each side exists before `zin_war_of_last_crowns` unless a cause of the diplomacy spec was used.
5. **Player protection:** as Lerendor under HISTORICAL, honouring the treaty leaves `zin_leren_withdrawal` unset, marks CP 12 diverged, and the war still begins.
6. **Skip test:** annexing Yeldenne by console in 4A 1750 resolves CP 09 as diverged or skipped (per the hall rules), and checkpoints 10 to 26 still resolve.
7. **Lost heir test:** setting `zin_eindil_lost` by console in 4A 1756 skips 19, 21 and 25 (and 26 resolves diverged); the endings spec reaches another ending or the fallback; no stall.
8. **Pace test:** under `zin_rule_story_pace` SLOW, CP 11 resolves historical on the shifted date (1 Rainwake 4A 1755 moved by half the days since the start).

## Open questions

1. Are the windows right? In particular, how late may the Golden King's death come before the path counts it as diverged (here 1 Deepwinter 4A 1753)?
2. Should PLAUSIBLE stop favouring history once the world has drifted far (here at divergence 50), or keep favouring it to the end?
3. When should the world learn the name Afrit on the historical path: at Eindil's warning (4A 1754) or at Afrit's flight (4A 1756, as the Afrit spec proposes)?
4. If Lorien cannot name Eindil, may another route name him, or does the journey end there?
5. Which western crown leads the Western Crossing on the historical path (the West spec proposes Gunwaith)?
