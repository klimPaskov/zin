# Alternate history: the course of the age and every way off it

**Status:** proposed design (24 October 2026). **Requirement:** R-46 (decision L3). **Acceptance:** A-46. **Machine-readable twin:** [alternate_history.json](alternate_history.json) (the beat table, divergences, soft-locks and the measure's weights, for tests).

## 1. Purpose

The vault's storyline is the main historical direction of ZIN, as the Second World War is in the base game: it is what happens when nobody diverges (L3).

This document lists every story beat from 1 Lumae 4A 1748 to the endings, who can change each beat and how, what keeps the story coherent after each change, what in the current implementation can hang or contradict itself, how far a game has moved from history, how the start can vary, and the generic systems that keep every realm alive when the story leaves its road.

It is the beat-by-beat divergence table that decision L3 names as `04_mechanics/10_alternate_history.md`; that file was never written, and this document takes its place.

It extends the checkpoint frame of [06_historical_path_and_ai.md](../specs/03_gameplay/06_historical_path_and_ai.md) (CP01 to CP26, their windows, the AI policy and the watchdog) and does not replace it: each beat below belongs to one checkpoint, and the checkpoint's weight is the beat's weight in the measure.

## 2. Sources and evidence

- Canon: the vault notes *The Campaign of 4A 1748*, *Fourth Age Chronology*, *The Journey of Eindil*, *War of the Last Crowns*, *The Last Battle in the Palace*, *Possible Endings*, *Fifth Age Seeds*, *Fourth Age Canon Register* and the figures (Golden King, Eindil, Afrit, Volgan, Zol, Kusven, now Kusven, Varner, Golbran, Lorien, Alleria of Selen, Horos).

- Owner corrections K1 to K27 in [INTEGRATION_DECISIONS.md](../specs/INTEGRATION_DECISIONS.md) override the vault and the specs, in particular K2 (the Great Wall of Aenor is a natural mountain range), K4 and K11 (Zol does not appear in the war; his most loyal servant does) and K13 (Hirolon is a sovereign giant kingdom).

- Owner decisions of 24 October 2026 (relayed by the coordinator): the Ember Lands region is named **the Ember Lands**; Kusven is named **Kusven**; the sea north of Zol's Mistake is **Kusmeel**; the twelve main New Gods (Glernaen, Sulethe, Lumae, Maelwen, Vaelei, Rasthel, Kerun, Aurlan, Ailtal, Irumas, Gaelor, Naisa) name the months and the game opens on 1 Lumae 4A 1748; the East and South Lands keep their own faith and calendar.

- Specs: [06_events](../specs/06_events/) 01 to 05, [04_mechanics](../specs/04_mechanics/) (the shared contract, the contract additions and every mechanic spec), [05_world_tension_and_endings.md](../specs/03_gameplay/05_world_tension_and_endings.md), [06_historical_path_and_ai.md](../specs/03_gameplay/06_historical_path_and_ai.md).

- Implementation: the event data `tools/content/data/events_crown_*.json`, `events_world*.json`, the mechanic data `tools/content/data/mech_*.json`, the modules and libraries under `tools/content/`, the integration notes in [stage2](stage2/), and the round-3 staged tree that the integrator built on 24 October 2026 at 12:31 (`%TEMP%/zin-int-r3`; cited as `staged:` below).

- **Limits.** The integration was in progress while this was written: the build of 11:43 stopped on 50 dangling names (`%TEMP%/zin-build0.err`), so a finding may already be fixed in the next build. The soft-lock audit reads the data and the staged scripts; it is not a game run. The HOI4 MCP routes were not used: this is a design document and edits no engine-facing file.

## 3. Names, calendar and conventions

- **Calendar.** Months are named after the twelve main New Gods. The order below is the order of the owner's list, which puts Lumae third and so matches the opening on the first day of the third month; it is an inference to confirm (owner question Q4).

| No. | Month | Former working name |
| --- | --- | --- |
| 1 | Glernaen | Deepwinter |
| 2 | Sulethe | Ironfrost |
| 3 | Lumae | Thaw |
| 4 | Maelwen | Rainwake |
| 5 | Vaelei | Sowing |
| 6 | Rasthel | Highsun |
| 7 | Kerun | Goldfield |
| 8 | Aurlan | Harvest |
| 9 | Ailtal | Fallowing |
| 10 | Irumas | Emberleaf |
| 11 | Gaelor | Mistfall |
| 12 | Naisa | Longnight |

- Dates are engine dates (`YYYY.M.D`) at the standard pace. Every story date reads `zin_story_pace` (V4, R2): a date *d* becomes start + (*d* - start) x pace, with pace 1, 1.5 or 0.75 (`zin_rule_story_pace`). Text shown to an East or South Lands court names no god-month; it says "in the spring of the year" or gives the year.

- **Kusven** (formerly Edvoid) is Zol's most loyal servant, a Great Spirit; Zol himself does not appear in the War of the Last Crowns. Flags and scripts that assumed Zol in person are re-designed in section 9. **Kusmeel** replaces the "Ocean of Edvoid" label. **The Ember Lands** replace "the Dead Lands" in text; script keys such as `zin_region_dead_lands` are renamed by the names migration, not here.

- **States** of a checkpoint: 0 pending, 1 historical, 2 diverged, 3 skipped (06 spec). The deadlock rule stands: a checkpoint waits only for its predecessors to be resolved, never for them to be historical, and every checkpoint resolves by its latest date.

- **Divergence kinds:** early, late, different (the beat happens another way or by another actor), never, opposite, actor_dead, actor_captured, actor_annexed, actor_absent. **Magnitude** (for the measure): 0 historical, 0.25 shifted in time, 0.5 another way or another actor, 0.75 replaced by its successor, 1 never or the opposite; a skipped checkpoint counts 0.5.

- **Who can diverge:** a player always chooses for their own realm (rules never act on a player's country); the AI follows `zin_rule_historical_path` (HISTORICAL x10 on historical focuses and 100/0 on historical event options; PLAUSIBLE x3 and 75/25, dropping to x1.5 and 60/40 at divergence 50; FREE situational) and the per-power rules whose DEFAULT follows it (R1). A human-facing event that decides a checkpoint lists its non-committal option first, so a timeout never accepts history for the player (E2).

## 4. The beat table

45 beats, 151 divergences. The overview comes first; each beat's detail follows with its divergences, consequences and successors.

| Beat | CP | Weight | Name | Target | Latest | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| B01 | CP01 | 0 | The peaceful start | 1748.3.1 | - | world systems; historical path (06_historical_path_and_ai.md) |
| B02 | CP05 | 5 | The Council's verdict and the regicide plot | 1750.10.15 | 1753.1.1 | Afrit (afrit_hidden_council.md), Aenor death clock (aenor_court_and_succession.md section 5) |
| B03 | CP02 | 2 | Eindil wakes | 1749.2.1 | 1752.1.1 | Eindil's journey (mech_eindil.mjs, mech_eindil_scripts.mjs) |
| B04 | CP04 | 2 | The road south (Three Oaths, Winter Ford, Gunwaith) | 1749.10.1 | 1751.3.1 | Eindil's journey; Western Crossing |
| B05 | CP03 | 1 | The Grey Ford truce breaks | 1750.4.1 | 1750.10.1 | Western Crossing (mech_crossing.mjs) |
| B06 | CP04 | 2 | Eindil, war-king of the West, makes peace | 1750.8.1 | 1751.3.1 | Eindil's journey; Western Crossing |
| B07 | CP05 | 5 | The Golden King dies | 1750.11.10 | 1753.1.1 | Aenor (zin_aenor.200, zin_aenor_open_succession) with the crown events (zin_reign.19 to .26) |
| B08 | CP06 | 5 | The Thirty Days: four camps contend | 1750.12.10 | 1751.2.8 | Aenor (zin_aenor.201, zin_aenor.210 The Seals of Parim, zin_aenor_give_seals); crown events zin_reign.30 to .37 |
| B09 | CP06 | 5 | Aurevan is crowned | 1750.11.24 | 1751.2.8 | Afrit (zin_afrit.20 to .21, zin_afrit_crown_aurevan, zin_reign_on_crowning) |
| B10 | CP06 | 5 | The god-king's first year | 1751.1.1 | 1752.1.1 | Afrit, crown events |
| B11 | CP07 | 1 | The storm and the Islands of the South | 1751.3.1 | 1752.3.1 | Eindil's journey |
| B12 | CP08 | 3 | Lorien names the Man from the Ice | 1752.1.15 | 1753.1.1 | Eindil's journey; Lands of the Sun |
| B13 | CP09 | 5 | The voyage north; Afrit learns and sails | 1753.1.1 | 1753.7.1 | Eindil's journey (stage 6); Afrit (zin_afrit.31, .32, zin_afrit_northern_voyage, zin_afrit.8) |
| B14 | CP09 | 5 | The ambush on the shore | 1753.5.1 | 1753.9.1 | Eindil's journey (zin_eindil.70 to .72); Afrit (zin_afrit.33) |
| B15 | CP09 | 5 | The hall of Horos: Horos dies, Glo and the blue sword pass to Eindil | 1753.7.1 | 1754.6.1 | Yeldenne and Glo (mech_yeldenne.mjs, zin_glo_resolve_hall) |
| B16 | CP10 | 3 | The warnings; Aenor denounces the impostor; Alleria protects him | 1754.5.1 | 1755.3.1 | Eindil's journey (stage 8), Aenor, Selen |
| B17 | CP19 | 5 | The forest, Varner and Golbran, the dragon | 1756.6.1 | 1757.8.1 | Eindil's journey; elves and dragons |
| B18 | CP11 | 5 | The War of the Last Crowns begins | 1755.4.1 | 1756.3.1 | world systems (world_tension.mjs, zin_world.20) |
| B19 | CP12 | 3 | Lerendor leaves the Treaty of the Narrow Strait | 1755.5.1 | 1755.10.1 | Lerendor (mech_lerendor.mjs) |
| B20 | CP13 | 4 | The Western Crossing | 1755.5.15 | 1756.4.1 | Western Crossing (mech_crossing.mjs) |
| B21 | CP14 | 3 | The eastern invasion of the Magical Lands | 1755.6.1 | 1756.4.1 | eastern kings (mech_east.mjs); elves |
| B22 | CP15 | 5 | Volgan retakes Mirolon | 1755.11.1 | 1756.9.1 | Volgan (mech_volgan.mjs, mp_volgan_*.mjs) |
| B23 | CP15 | 5 | Volgan marches north | 1755.12.1 | 1756.9.1 | Volgan |
| B24 | CP16 | 4 | Zol's dead rise | 1755.7.1 | 1756.3.1 | Zol's Mistake (mech_zol.mjs, lib/mech_zol_script.mjs) |
| B25 | CP17 | 4 | Afrit abandons Aenor; the name is known | 1756.3.1 | 1757.3.1 | Afrit (zin_afrit.50, zin_afrit_flee_east, zin_afrit_reveal, zin_afrit.43, .45, .53) |
| B26 | CP17 | 4 | Afrit is proclaimed King of the East | 1756.4.1 | 1757.3.1 | Afrit, eastern kings (S1, O5) |
| B27 | CP18 | 2 | Western armies take Parim | 1756.6.1 | 1757.3.1 | Western Crossing (zin_west_take_parim); battle result, never forced |
| B28 | CP18 | 2 | Crushed between two darks; the West evacuates | 1756.9.1 | 1757.6.1 | Volgan (zin_volgan_zol_clash, zin_dominion.13), Western Crossing (evacuation), events (zin_lastwar.61, .62) |
| B29 | CP19 | 5 | Eindil returns on a dragon; the Host of Eindil | 1757.3.1 | 1758.6.1 | Eindil's journey (stage 9) |
| B30 | CP19 | 5 | The wave of Glo; the coalition of the living | 1757.4.1 | 1758.6.1 | Eindil's journey; Glo |
| B31 | CP20 | 3 | The Black Compact | 1757.4.1 | 1757.9.1 | Volgan (zin_dominion.14 offers once, O4), Zol (zin_mistake.16 answer), zin_dominion.15 |
| B32 | CP20 | 3 | Varner dies shielding the living | 1757.6.1 | 1758.3.1 | Eindil's journey (zin_eindil.96, .97), elves (zin_elves.51) |
| B33 | CP21 | 4 | Volgan casts Eindil down; the New Gods restore him | 1757.7.1 | 1758.3.1 | Eindil's journey (battles 1 and 2), Volgan (zin_dominion.16) |
| B34 | CP22 | 5 | Volgan's manifested body is destroyed | 1757.8.1 | 1758.6.1 | Volgan (zin_volgan_destroy_body, zin_dominion.17 to .19, .23) |
| B35 | CP23 | 5 | Kusven, Zol's most loyal servant, comes forth and breaks the blue sword | 1757.8.8 | 1758.9.1 | Zol's Mistake, re-designed (today zin_zol_manifest and zin_mistake.20, .21) |
| B36 | CP23 | 5 | Lorien and the ancient spirits die; Kusven withdraws | 1757.9.1 | 1758.9.1 | Lands of the Sun (zin_sun_lorien_rides, zin_sun_lorien_falls), Zol (re-designed zin_mistake.22 to .25) |
| B37 | CP26 | 5 | Hailed as king on the field | 1757.10.1 | 1758.9.1 | Eindil's journey (battle 5, zin_eindil.102) |
| B38 | CP24 | 4 | Afrit returns from the East | 1758.2.1 | 1759.3.1 | Afrit (zin_afrit.60, zin_afrit_return), eastern kings (zin_east.52) |
| B39 | CP24 | 4 | The cliff: Eindil cast down; Afrit claims all Aoaz | 1758.3.1 | 1759.3.1 | Afrit (zin_afrit.61, .62), journey (zin_eindil.110, .112) |
| B40 | CP24 | 4 | Below the cliff: Alleria's rescue | 1758.6.1 | 1759.6.1 | Eindil's journey (zin_eindil.111, .113, zin_eindil_recover) |
| B41 | CP25 | 5 | The palace: the artifacts stripped; Afrit and Golbran die | 1759.3.1 | 1760.3.1 | Afrit (O2: zin_afrit_begin_palace_battle, zin_afrit.70 to .76, zin_afrit_die), journey (zin_eindil.120 to .127) |
| B42 | CP26 | 5 | Eindil is crowned King of Aenor | 1760.3.1 | 1761.3.1 | Aenor (zin_aenor.400, zin_aenor_crown_eindil), journey (zin_eindil.130 to .132, zin_eindil_go_to_parim) |
| B43 | ENDING | - | Children of Volgan | - | - | world systems; Volgan (zin_volgan_children_ready) |
| B44 | ENDING | - | The Ashen Throne | - | - | world systems; Afrit (zin_afrit_ashen_throne_ready) |
| B45 | ENDING | - | Judgement of the proposed outcomes; the Age Unfinished; the sandbox | 1762.1.1 | 1770.1.1 | world systems |

### I. The seeming peace

#### B01. The peaceful start (CP01)

- **Canon:** established (owner, 18 October 2026).

- **Historical outcome:** On 1 Lumae 4A 1748 the Golden King reigns, Eindil has not appeared, Afrit is unrevealed and no country is at war with anybody who matters.

- **Trigger:** Game start (`1748.3.1`). Start check `zin_path.1` (hidden, path module): no war, no contract story flag, `zin_eindil` recruited by nobody, no reachable text naming Afrit (D1, D3 of INTEGRATION_DECISIONS). Dominion and Shadow carry `generate_wargoal_tension = 0.25` (D6).

- **Who can diverge:** The start-variety rule (`zin_rule_start_variety`); any player from the first day (only causes allow war while the Gathering Dark is below 25).

| Id | Kind | Who | Divergence | m | Consequence | Successor or fallback |
| --- | --- | --- | --- | --- | --- | --- |
| B01.D1 | different | game rule | Start variety LIGHT or FULL draws the start values listed under game-start variety. | 0 | Start values move inside the lore; every beat reads them as variables, so no beat changes owner. | None needed. `zin_start_variety_drawn` records the draw and the Chronicle names it; variety never counts as divergence. |
| B01.D2 | early | player | A player declares a cause war in 1748 or 1749. | 0.25 | Peace-breaker spirit `zin_diplo_peace_breaker` for 180 days and +2 Gathering Dark (diplomacy spec); the Grey Ford may break earlier (B05 D2). | CP01 stays historical (it judges the opening day only); the way code `early_war` is stored for the Chronicle. |
| B01.D3 | different | game rule (FULL only) | A border feud between two minor realms runs at the start (variety V6). | 0 | A `start_border_war` between tier C realms only; never a great power, never a war. | Start check accepts border conflicts; the feud ends within 90 days or by `zin_realm.40` terms. |

#### B02. The Council's verdict and the regicide plot (CP05)

- **Canon:** established (Afrit engineers the death); dates and instruments proposed.

- **Historical outcome:** The Council judges the King a liability (`zin_afrit.10`), chooses the physician (`zin_afrit.11`), and the plot reaches 100 (`zin_afrit.14` The Plot Is Ready), setting `zin_afrit_regicide_ready`.

- **Trigger:** `global.zin_afrit_regicide_plot` grows through `zin_afrit_add_plot` (Worshipdom focuses). Fallback `zin_afrit_historical_fallbacks` readies the plot by 15 Irumas 4A 1750 (`zin_afrit_date_regicide_fallback`, `mech_afrit.json` dates.regicideFallback `1750.10.15`, paced) under the historical branch unless `zin_rule_golden_king_death = NO_AI_PLOT`.

- **Flags:** `zin_afrit_regicide_ready`, `zin_afrit_plot_ready_seen`.

- **Who can diverge:** Worshipdom (player or AI); Aenor (player: physicians, Lost Cause focuses that delay the clock); Selen and Mirolon watchers (`watch` terms); rules `zin_rule_golden_king_death`, `zin_rule_afrit`.

| Id | Kind | Who | Divergence | m | Consequence | Successor or fallback |
| --- | --- | --- | --- | --- | --- | --- |
| B02.D1 | early | Worshipdom, start variety V2 | The plot is hastened (Choose the Night, up to 180 days through `zin_aenor_hasten_death_clock`) or starts more advanced. | 0.25 | The King dies before the war-king beat; the journey reads flags, not order, so stage 3 still runs. | None; CP05 way `early`. |
| B02.D2 | late | Aenor, rule DELAYED | The clock is delayed (`zin_aenor_delay_death_clock`, Council faltering x0.6). | 0.25 | The King may outlive the latest date (1 Glernaen 4A 1753) and CP05 resolves diverged. | B07 D2. |
| B02.D3 | different | Aenor, any watcher, veil below 15 | The plot is exposed (`zin_aenor_expose_plot` sets `zin_golden_king_plot_exposed`). | 1 | Council veil -30; the Council's War (`zin_aenor.260`) or the Council scatters; the name may be known early (D3). | B07 D3 or D4; B25 D3 (early reveal). |
| B02.D4 | never | Worshipdom (player), rule NO_AI_PLOT or zin_rule_afrit DORMANT | The Council never strikes. | 1 | The Golden King lives; B09, B10 and the god-king's flight cannot happen in their canon form. | The Golden Court Endures becomes reachable; Afrit's open bid comes from the Worshipdom later (B25 D4, B38 D5); stage 12 uses the reduced-Afrit gate (SL-09). |
| B02.D5 | actor_annexed | any conqueror | The Worshipdom ceases to exist before the plot is ready. | 0.5 | The Aenor clock sets `zin_afrit_regicide_ready` itself (Aenor spec section 5); Merovan acts in Parim. | Afrit's seat moves by role R02 (SL-11); the regicide goes ahead without the hub. |
| B02.D6 | actor_annexed | any conqueror | Aenor (Y0L) is annexed or capitulates with the King alive. | 0.75 | The clock stops; today the King simply never dies (SL-25). | New `zin_golden_king_exiled` and `zin_realm.50` A Court in Exile to the realm that shelters him; CP05 skipped; the Golden Court ending is closed. |

### II. The man from the ice

#### B03. Eindil wakes (CP02)

- **Canon:** established (wakes in the Cold Lands, helped by tribes); timing proposed.

- **Historical outcome:** Hunters find a man in the ice; stage 1 starts and `zin_eindil.10` The Man in the Ice goes to the owner of `zin_is_site_eindil_ice`.

- **Trigger:** Stage floor 1 `1749.2.1` plus 0 to 20 days of jitter (`wake_jitter` 21), compared with `global.zin_eindil_age` (paced); rule `zin_rule_eindil_waking` (EARLY Rasthel 1748, LATE Sulethe 1751). Sets `zin_eindil_awake`.

- **Flags:** `zin_eindil_awake`.

- **Who can diverge:** The waking rule; the ice host (`.10` Bind him); Coldor and Isengard (`.11` Summon him).

| Id | Kind | Who | Divergence | m | Consequence | Successor or fallback |
| --- | --- | --- | --- | --- | --- | --- |
| B03.D1 | early | rule EARLY | He wakes in Rasthel 4A 1748. | 0.25 | Every later floor still holds; the journey waits at the floors. | None; CP02 way `early` (Chronicle line 02 reads the rule). |
| B03.D2 | late | rule LATE | He wakes in Sulethe 4A 1751. | 0.25 | Stage floors 2 to 4 are already past, so stages run at their minimum gaps; CP04, CP07 and CP08 can pass their latest dates. | Later checkpoints resolve diverged by date (never stall); the war of the West can start without a war-king (B05 D1 logic). |
| B03.D3 | late | ice host, Coldor, Isengard | He is bound (+120 days) or summoned (+30 days). | 0.25 | Delay and regard changes; the binder is resented and gets no invitation. | None; the delay is bounded by `delay_max` 900. |
| B03.D4 | actor_annexed | any conqueror | The ice site's state changes owner, or a dark power holds it. | 0 | The owner of the state is the host. | Role R16 (ice host): if a dark power holds the site, the nearest Cold Lands realm that is not a dark power hosts him. |

#### B04. The road south (Three Oaths, Winter Ford, Gunwaith) (CP04)

- **Canon:** established direction; episodes proposed.

- **Historical outcome:** `zin_eindil.20` The Bridge of the Three Oaths, `.21` Girdon's Winter Ford, `.22` Judgment in Gunwaith, `.23` The King Without a House; renown rises.

- **Trigger:** Stage 2 floor `1749.10.1`, at least `stage2_after` 150 days after stage 1; hosts are the owners of `zin_is_site_three_oaths` and `zin_is_site_winter_ford` and Gunwaith (or the owner of its former capital).

- **Who can diverge:** The bridge host, Girdon, Gunwaith (player or AI).

| Id | Kind | Who | Divergence | m | Consequence | Successor or fallback |
| --- | --- | --- | --- | --- | --- | --- |
| B04.D1 | different | bridge host | Burn the grain (`.20` B). | 0 | Resented; burned granaries. | None. |
| B04.D2 | late | Girdon | Close the ford (`.21` B). | 0.25 | +60 days; resented. | None. |
| B04.D3 | late | Gunwaith | Make an example (`.22` B). | 0.25 | +180 days; Gunwaith less likely to pledge later. | Stage 3 falls back after `stage4_fallback` 270 days if the feud has not called him. |
| B04.D4 | actor_annexed | any conqueror | Gunwaith or Girdon is gone. | 0 | The event goes to the owner of the site or of the former capital (journey data). | Role R05. |

#### B05. The Grey Ford truce breaks (CP03)

- **Canon:** established rivalry; truce and dates proposed.

- **Historical outcome:** Raids wear down the Truce of the Grey Ford until it breaks into a border war between Gunwaith and Girdon (`start_border_war`, `zin_west.23` on win).

- **Trigger:** `global.zin_west_truce` falls from `truce_start` 40 below `truce_raid_below` 50 with raids (`raid_chance_percent` 12); sets `zin_west_truce_broken`, `zin_west_grey_ford_war`; target `1750.4.1`, latest `1750.10.1`.

- **Flags:** `zin_west_truce_broken`, `zin_west_grey_ford_war`.

- **Who can diverge:** Gunwaith, Girdon (player or AI); Girdon's ford commission; the Gunwaith tree (`zin_west_truce_permanent`).

| Id | Kind | Who | Divergence | m | Consequence | Successor or fallback |
| --- | --- | --- | --- | --- | --- | --- |
| B05.D1 | never | Gunwaith tree, Girdon commission | The truce is made permanent. | 1 | No feud, so no confederation and no war-king. | B06 D3: stage 4 starts by its fallback; CP03 and CP04 diverged; the West's unity starts higher, so the Crossing is likelier (B20). |
| B05.D2 | early | start variety V7, a raid player | The truce breaks before Eindil arrives. | 0.25 | The confederation forms early and waits. | The confederation offers the crown when he arrives (`.32`). |
| B05.D3 | actor_annexed | any conqueror | Gunwaith or Girdon no longer exists. | 0.5 | CP03 skipped. | Role R05 picks the next feud: the two bordering West Lands realms with the lowest mutual opinion; failing that the stage 4 fallback. |
| B05.D4 | different | player | A belligerent declares a full war instead of the border war. | 0.5 | Peace-breaker penalty; the war-king can only end it by white peace; western unity falls. | The war-king's terms become a white peace (`zin_west_end_ford_war` how 2); B20 leans toward D1. |

#### B06. Eindil, war-king of the West, makes peace (CP04)

- **Canon:** established.

- **Historical outcome:** `zin_eindil.32` A Crown Offered (checkpoint, non-committal option first, E2), `.33` The War-King's Terms, `.34` The Crown Laid Down, `.35` news; sets `zin_eindil_war_king`.

- **Trigger:** Stage 3 floor `1750.4.1`; stage 4 starts on `zin_eindil_stage_3_done`, `zin_eindil_war_king` or `stage4_fallback` 270 days.

- **Flags:** `zin_eindil_war_king`, `zin_eindil_stage_3_done`.

- **Who can diverge:** The confederation leader (player or AI); Gunwaith and Girdon (terms).

| Id | Kind | Who | Divergence | m | Consequence | Successor or fallback |
| --- | --- | --- | --- | --- | --- | --- |
| B06.D1 | never | confederation, belligerents | The crown is refused (`.32` B) or the belligerents fight on (`.33` B). | 1 | A lasting western war; unity falls; no war-king. | Stage 4 by fallback; the Crossing leans divided (B20 D1). |
| B06.D2 | different | confederation leader | Keep the war-king (`.34` B). | 0.5 | The confederation dissolves when he leaves; he still leaves at the floor (guest rules). | None. |
| B06.D3 | different | B05 D1 | No feud exists to end. | 0.75 | Only `.23` The King Without a House runs. | Stage 4 fallback; CP04 way `fallback`. |

### III. The god-king

#### B07. The Golden King dies (CP05)

- **Canon:** established (Afrit murders him); date proposed.

- **Historical outcome:** At the feast of Gaelor the King dies (`zin_reign.19` one day before `zin_aenor.200`); `zin_reign_on_king_dead` fires the bells, mourners, funeral and the dominions' word.

- **Trigger:** N15: `zin_afrit_regicide_ready` and `zin_aenor_king_clock` below 30 after the floor; HISTORICAL death rule fixes the clock at (975 + 0 to 20) x pace days. Sets `zin_golden_king_dead`. Target `1750.11.10`, latest `1753.1.1`.

- **Flags:** `zin_golden_king_dead`.

- **Who can diverge:** Aenor (player), the Worshipdom, rules `zin_rule_golden_king_death` and `zin_rule_afrit`.

| Id | Kind | Who | Divergence | m | Consequence | Successor or fallback |
| --- | --- | --- | --- | --- | --- | --- |
| B07.D1 | early | Worshipdom | Hastened death. | 0.25 | The Thirty Days fall before the war-king. | None. |
| B07.D2 | late | Aenor, rule DELAYED | Delayed death past the target. | 0.25 | Calibration of the Gathering Dark lags. | If alive at the latest date, D3 logic: CP05 diverged. |
| B07.D3 | never | Aenor (exposure, Council's War won) | The King survives (`zin_golden_king_survives`). | 1 | The Council is broken; the name may be known early; `zin_aenor.460` The King and the Stranger lets the King name Eindil heir or refuse him. | Coronation variant: Eindil crowned as the King's heir after the Afrit chain (B42 D4); the Golden Court Endures is reachable; SL-31 blocks a second plot. |
| B07.D4 | different | Faithful in the Council's War | The plot is exposed and the Faithful win the civil war. | 1 | Merovan rules as Lord Protector "in the Deliverer's name"; the god-king's crowning comes after the war. | B09 D4 (crowned openly); B25 D3. |
| B07.D5 | different | clock without the Worshipdom | The King dies without the Council's hand (clock reaches 0 with the hub gone). | 0.5 | The Faithful camp is weaker in the Thirty Days. | New flag `zin_golden_king_natural`; the Chronicle line 05 uses its diverged text. |
| B07.D6 | actor_annexed | any conqueror | Aenor is annexed with the King alive. | 0.75 | See B02 D6. | `zin_golden_king_exiled`; CP05 skipped. |

#### B08. The Thirty Days: four camps contend (CP06)

- **Canon:** established camps; victor open.

- **Historical outcome:** The Faithful camp wins; `zin_aenor_give_seals` fires `zin_afrit.20` The Seals Pass to the Deliverer to the Worshipdom.

- **Trigger:** Camp support `zin_aenor_camp_court`, `_faithful`, `_dominions`, `_host` after 30 days; rule `zin_rule_ai_aenor_succession` (DEFAULT follows the path; GOLDEN_COURT, FREE_DOMINIONS, RANDOM).

- **Flags:** `zin_aenor_faithful_rule` (country).

- **Who can diverge:** Aenor (player), every Concord dominion (secession `zin_reign.37`), Selen (`zin_reign.25`), the Worshipdom, the rule.

| Id | Kind | Who | Divergence | m | Consequence | Successor or fallback |
| --- | --- | --- | --- | --- | --- | --- |
| B08.D1 | different | Aenor, rule GOLDEN_COURT | The Court wins: the Regency of Gold (`zin_reign.50` to `.53`). | 1 | Prince Eronel asks for the crown (`.52`); Afrit stays behind the throne or waits. | CP06 diverged; `zin_aenor_regency_endures` counts for the Golden Court Endures (endings fix E-04). |
| B08.D2 | different | Aenor, rule FREE_DOMINIONS | The Dominions win: the Concord of Equals (`zin_reign.55` to `.57`). | 1 | Charters freed; the Free Dominions league may form; Afrit's grip loosens. | CP06 diverged; the god-king's flight becomes the Council's withdrawal (B25 D4). |
| B08.D3 | different | Aenor | The Host wins: the Hailed King before his time (`zin_reign.60`). | 1 | Only when `zin_aenor_host_available`; O1 still keeps Eindil out of Aenor's leader slot until the coronation. | CP06 diverged; the crown waits for B42. |
| B08.D4 | different | dominions | Dominions secede during the Thirty Days (`zin_aenor_secede_dominion`). | 0.5 | The Concord shrinks; seceded realms join the Free Dominions. | None. |
| B08.D5 | actor_annexed | any conqueror | The Worshipdom no longer exists when the Faithful win. | 0.75 | `zin_aenor_give_seals` already recruits Merovan and sets the Faithful stance without a god-king. | CP06 diverged; Afrit's seat by role R02. |

#### B09. Aurevan is crowned (CP06)

- **Canon:** established (Afrit takes the throne openly under his public name).

- **Historical outcome:** `zin_afrit.20` hist option calls `zin_afrit_crown_aurevan` (sets `zin_aurevan_crowned`); `zin_afrit.21` news; `zin_reign.40` to `.43`, `zin_elves.9`, `zin_leren.41`, `zin_west.15` answer the crowning.

- **Trigger:** Target CP05 + 14 days, latest CP05 + 90 days.

- **Flags:** `zin_aurevan_crowned`.

- **Who can diverge:** The Worshipdom (player or AI).

| Id | Kind | Who | Divergence | m | Consequence | Successor or fallback |
| --- | --- | --- | --- | --- | --- | --- |
| B09.D1 | different | Worshipdom | The Council raises a pliant heir (`zin_afrit_raise_pliant_heir`, Eronel; `zin_afrit_kingdom_behind_throne`, `zin_reign.65`, `.66`). | 1 | Afrit stays hidden; no god-king to flee. | B25 D4; the Golden Court Endures only if the King lived. |
| B09.D2 | never | B08 D1 to D3 | Another camp rules. | 1 | No crowning within 90 days. | CP06 diverged; the Ashen Throne needs Parim later (B44). |
| B09.D3 | late | Worshipdom (player) | The player waits on `zin_afrit.20`. | 0.25 | E2: a timeout takes the first, non-committal option; the AI fallback crowns him (SL-04 fix). | Timeout successor: if neither crowning nor pliant heir 30 days after `zin_aenor_faithful_rule`, the AI Worshipdom crowns Aurevan; a human Worshipdom keeps the choice and CP06 resolves at its latest date. |
| B09.D4 | different | Faithful after the Council's War | Crowned openly after an early exposure. | 0.5 | The name is already known; Aurevan reigns unmasked (`zin_afrit_unmasked`). | None. |

#### B10. The god-king's first year (CP06)

- **Canon:** established (opponents are silenced); events proposed.

- **Historical outcome:** `zin_afrit.22` Dissenters at Court (30 days after `.21`), `zin_reign.43` The First Edict, `.44` Scholars Question the Genealogy, `.45` What Is the Lost Cause For?, `.46` The Golden Court Changes Its Robes.

- **Trigger:** `zin_reign_on_crowning` chain.

- **Who can diverge:** The Worshipdom, Aenor's court (player when Aenor is played under Aurevan), Master Ilsabet.

| Id | Kind | Who | Divergence | m | Consequence | Successor or fallback |
| --- | --- | --- | --- | --- | --- | --- |
| B10.D1 | different | Worshipdom | Dissenters are spared. | 0 | The veil thins; watchers gain. | None. |
| B10.D2 | different | Aenor court | Ilsabet's genealogy spreads (`zin_reign.44`). | 0.25 | Veil -; Lost Cause +; early suspicion of an impostor god. | None; may hasten B25 D3. |
| B10.D3 | different | Lost Cause captains | The Lost Cause turns from the crown (`zin_aenor_lost_cause` at 60 or more). | 0.25 | It becomes Eindil's army earlier. | B29 D5. |

### IV. The heir of Aen

#### B11. The storm and the Islands of the South (CP07)

- **Canon:** established.

- **Historical outcome:** `zin_eindil.40` West Over the Sea, `.41` Wreck on the Southern Isles (wreck host, proposed Howan), `.42` to `.46`, `.158`, `.159`.

- **Trigger:** Stage 4 floor `1751.3.1`.

- **Who can diverge:** The departure host, the wreck host, the islands.

| Id | Kind | Who | Divergence | m | Consequence | Successor or fallback |
| --- | --- | --- | --- | --- | --- | --- |
| B11.D1 | late | departure host | Let him find passage himself (`.40` B). | 0.25 | +30 days. | None. |
| B11.D2 | different | wreck host | Sell the news (`.41` B, fires `zin_glo.5`). | 0.25 | +60 days; hunters in the isles (`.46`); ambush strength +1 (N9). | None; feeds B14. |
| B11.D3 | late | islands | Hold him to the offer (`.44` B). | 0.25 | +60 days; resented. | None. |
| B11.D4 | actor_annexed | any conqueror | The wreck host is gone or under a dark power. | 0 | The journey picks Nara or Verde. | Role R17 (wreck host). |

#### B12. Lorien names the Man from the Ice (CP08)

- **Canon:** established; Mirror of First Rain proposed.

- **Historical outcome:** `zin_eindil.50` A Stranger at Gala (checkpoint), `.51`, `.160`, `.52` The Mirror of First Rain, `.54` Lorien's Gift, `.161`; `zin_eindil_name_him` sets `zin_eindil_named` (D4: before this he is only "the Man from the Ice").

- **Trigger:** Stage 5 floor `1752.1.15`; host `zin_eindil_pick_gala_host` (Gala Elves, else Lorien's employer, else the owner of Gala's capital); naming fallback after `naming_fallback` 400 days.

- **Flags:** `zin_eindil_named`.

- **Who can diverge:** Gala (player or AI); whoever holds Gala; Lorien's survival.

| Id | Kind | Who | Divergence | m | Consequence | Successor or fallback |
| --- | --- | --- | --- | --- | --- | --- |
| B12.D1 | late | Gala | Turn him away (`.50` B). | 0.25 | +180 days; the naming and Afrit's report move later. | Naming fallback still names him. |
| B12.D2 | actor_annexed | any conqueror | Gala is annexed or Lorien is dead or held by another realm. | 0.75 | The host falls back to Lorien's employer or Gala's capital owner; without Lorien there is no gift (ship, armour, crew). | New `zin_eindil.170` The Mirror Without Its King (reserved 170 to 199): the Mirror names him; voyage takes `voyage_days` 150; ambush crew weaker; CP08 skipped. |
| B12.D3 | different | Gala (player) | Gala builds the great ship (focus, `zin_gala_great_ship`). | 0 | The voyage takes 120 days, not 150 (once SL-20 is fixed). | None. |

#### B13. The voyage north; Afrit learns and sails (CP09)

- **Canon:** established (Afrit travels after him); Merovan left in Parim proposed.

- **Historical outcome:** Lorien's ship sails (`zin_eindil.60`), calls at ports (`.61`, `.162`); Afrit hears of the stranger leaving Gala (`zin_afrit.31`, N8), chooses Go north and lie in wait (`zin_afrit.32` hist), sails (60 days, 30 with `zin_worshipdom_cold_maps`) and `zin_afrit.8` sets `zin_afrit_at_yeldenne`.

- **Trigger:** Stage 6 floor `1753.1.1` and `stage6_after_named` 70 days after the naming.

- **Flags:** `zin_afrit_at_yeldenne`.

- **Who can diverge:** The Worshipdom; the ports of call; Gala.

| Id | Kind | Who | Divergence | m | Consequence | Successor or fallback |
| --- | --- | --- | --- | --- | --- | --- |
| B13.D1 | different | Worshipdom | Take Glo at once (`zin_afrit_hall_at_once`). | 1 | Hall case C (Afrit alone): Horos repels him (C1) or is slain and seals Glo (C2). | B15 D3 or D4. |
| B13.D2 | different | Worshipdom | Send others (`zin_afrit_sent_others`). | 0.5 | Council agents ambush; ambush -1; no Afrit in the hall. | Hall case B2. |
| B13.D3 | never | Worshipdom | Stay in Parim. | 0.5 | No ambush by Afrit; Afrit unwounded. | Hall case B2; B39 more dangerous. |
| B13.D4 | different | ports | A port reports the ship (`.61` C). | 0 | Ambush +1. | None. |
| B13.D5 | actor_annexed | any conqueror | Afrit has no realm (Worshipdom gone and no Aurevan realm). | 0.5 | Only the Council's hunters act. | Role R02; hall case B2. |

#### B14. The ambush on the shore (CP09)

- **Canon:** established (all the crew is killed).

- **Historical outcome:** `zin_eindil.70` Landfall, `zin_afrit.33` The Ambush on the Shore, `zin_eindil.71` The Ambush (`zin_eindil_compute_ambush`, N9: base 5 plus terms; result 1 strong, 2 few, 3 failed), `.72` Alone in the Snow.

- **Trigger:** `.71` fires when `zin_afrit_at_yeldenne` or `zin_afrit_sent_others`, and not `zin_eindil_let_land`.

- **Flags:** `global.zin_eindil_ambush_result`.

- **Who can diverge:** The Worshipdom; the landing owner; the ports.

| Id | Kind | Who | Divergence | m | Consequence | Successor or fallback |
| --- | --- | --- | --- | --- | --- | --- |
| B14.D1 | different | dice, landing owner | The ambush fails (result 3) or few die (2). | 0.5 | Companions `zin_eindil_companion_1/_2` survive and serve the Host later. | Hall case still A if Afrit was first. |
| B14.D2 | different | Worshipdom | Let them land (`zin_afrit.33` B, `zin_eindil_let_land`). | 0.5 | No ambush; the crew reaches the hall. | Hall case A or B1. |
| B14.D3 | different | landing owner | Guides inland (`.70` B). | 0.25 | Ambush -1. | None. |
| B14.D4 | actor_annexed | any conqueror | The landing site changes owner. | 0 | The landing owner is the state owner. | Role R09 (owner of Mp'E). |

#### B15. The hall of Horos: Horos dies, Glo and the blue sword pass to Eindil (CP09)

- **Canon:** established.

- **Historical outcome:** Case A: 14 days after `.71` resolves with 2 or more, `zin_glo.21` The Heart of Horos: `zin_horos_dead`, `zin_glo_with_eindil` (Glo state 1, power 100), `zin_afrit_wounded`; Horos gives the blue sword and turns to dust.

- **Trigger:** Hall pulse to the owner of Mp'E (state 1063); cases A, B1, B2, C, D; score test for C and D (wards + 30 + 10 + 10 + random(-10..10) - attacker).

- **Flags:** `zin_horos_dead`, `zin_glo_with_eindil`, `zin_afrit_wounded`.

- **Who can diverge:** Yeldenne (wards decisions, the Warden), the Worshipdom, Volgan (grave hunt), whoever annexes Mp'E.

| Id | Kind | Who | Divergence | m | Consequence | Successor or fallback |
| --- | --- | --- | --- | --- | --- | --- |
| B15.D1 | different | Worshipdom | Case B1 Two Against One (`zin_glo.23`). | 0.5 | Afrit badly wounded; Glo passes. | None. |
| B15.D2 | different | Worshipdom absent | Case B2 The Willing Gift (`zin_glo.22`). | 0.5 | Afrit unwounded and stronger later. | None. |
| B15.D3 | different | Yeldenne wards | Case C1 The Hall Holds (`zin_glo.24`, `zin_horos_endures`, Gathering Dark -3). | 0.5 | Horos lives; Eindil arrives later. | Case B2 when he arrives; CP09 diverged. |
| B15.D4 | actor_dead | Worshipdom or Volgan | Case C2 or D2: Horos slain, Glo sealed (state 2, `zin_glo_sealed`). | 1 | Eindil can open the seal after `seal_open_days` 30; a dark power can defile it in 365 days (545 warded) to Glo dimmed (state 3). | If dimmed: no wave and no restoration (`zin_eindil.99`, `zin_eindil_lost`); a second bearer (state 4) only after the heir is lost; the Lost Cause closes. |
| B15.D5 | actor_annexed | any conqueror | Mp'E is annexed before the hall resolves (`zin_glo.63`). | 0.75 | The hall rules follow the state; the Warden leads. | CP09 diverged or skipped by the hall rules (path acceptance 6). |
| B15.D6 | late | journey delays | Eindil arrives after the latest date with Horos alive. | 0.25 | CP09 diverged by date. | Case B2 when he arrives. |

#### B16. The warnings; Aenor denounces the impostor; Alleria protects him (CP10)

- **Canon:** established (warned, not believed); Alleria's earlier role proposed.

- **Historical outcome:** `zin_eindil.80` A Stranger on Selen's Shore, `.81` Alleria's Watch, `.164`, `.165` Ilsabet's Rolls, `.82` The Impostor (checkpoint; denounce is historical), `.83` Warnings of the Heir (never names Afrit, D3), `.84` to `.85`, `.166`, `.167`.

- **Trigger:** Stage 8 floor `1754.1.1`; host Selen. Denouncing sets `zin_aenor_eindil_denounced` (today a country flag, SL-18) and `zin_afrit_impostor_denounced`.

- **Flags:** `zin_aenor_eindil_denounced`, `zin_afrit_impostor_denounced`.

- **Who can diverge:** The Aenor realm (player), Selen, every great power (heeding), the Worshipdom.

| Id | Kind | Who | Divergence | m | Consequence | Successor or fallback |
| --- | --- | --- | --- | --- | --- | --- |
| B16.D1 | opposite | Aenor | Aenor heeds him. | 1 | Prepared defences (`zin_lastwar.10`); if Aurevan rules Aenor, a heeding court turns on its god and the veil falls. | CP10 diverged; B25 D3 possible. |
| B16.D2 | actor_captured | Selen, Aenor | He is handed over or seized (`.81` B, `.82` C). | 0.25 | In chains (`.85`), then An Empty Cell (`.166`), +60 days. | None; he cannot die before stage 9. |
| B16.D3 | actor_annexed | any conqueror | Selen no longer exists or stands on Afrit's side. | 0.5 | The substitute host takes the stage. | Role R10 (stage 8 host). |
| B16.D4 | actor_absent | any | Alleria is not available (character retired or her employer gone). | 0.5 | Her rescue and her arrow are missing later. | Role R11; palace stage 1 without her (B41 D3). |
| B16.D5 | different | great powers | Many crowns heed him (`zin_eindil_heeded`). | 0.25 | Prepared defenders; western grudge drifts down. | None. |

#### B17. The forest, Varner and Golbran, the dragon (CP19)

- **Canon:** established (returns on a dragon with Varner and Golbran); the forest stay proposed.

- **Historical outcome:** `zin_eindil.86` The Bearer in the Forest, `.87` Varner and Golbran, `.168`, `.88` A Dragon's Pact (checkpoint), `.169`; `zin_eindil_dragon_pact`.

- **Trigger:** Stage 8 after the warnings; `zin_eindil_to_the_forest` once the war runs.

- **Flags:** `zin_eindil_dragon_pact`.

- **Who can diverge:** The Magical Forest, the Keeper of Dragon Mountain.

| Id | Kind | Who | Divergence | m | Consequence | Successor or fallback |
| --- | --- | --- | --- | --- | --- | --- |
| B17.D1 | late | Keeper | Refuse the dragon (`.88` B). | 0.25 | The return waits, at most to 1 Kerun 4A 1757, and stage 9 opens on `zin_eindil_date_1758_03` at the latest. | None. |
| B17.D2 | actor_annexed | any conqueror | The Magical Forest is gone or hostile. | 0.5 | Varner and Golbran come to the host directly. | Role R12. |
| B17.D3 | never | dragon corrupted (magic spec) | No dragon can carry him. | 0.5 | He returns by land. | Stage 9 by date with the land-return text of `zin_eindil.90`. |

### V. The War of the Last Crowns

#### B18. The War of the Last Crowns begins (CP11)

- **Canon:** established (several overlapping wars); the name proposed.

- **Historical outcome:** `zin_world.20` sets `zin_war_of_last_crowns`; news to everyone; no war is forced, each front is its owner's.

- **Trigger:** HISTORICAL: `1755.4.1` paced. PLAUSIBLE: the first of the Gathering Dark at 65 after `1754.3.1`, a dark power at war with a non-dark major, or `1756.3.1`. FREE: the first two only.

- **Flags:** `zin_war_of_last_crowns`.

- **Who can diverge:** The rules; any player whose war makes a dark power fight a major.

| Id | Kind | Who | Divergence | m | Consequence | Successor or fallback |
| --- | --- | --- | --- | --- | --- | --- |
| B18.D1 | early | PLAUSIBLE or FREE triggers, Volgan AGGRESSIVE | The war begins early (`zin_ending_cp11_early`). | 0.25 | Fronts open before the warnings land. | None. |
| B18.D2 | late | PLAUSIBLE | The war begins late (`zin_ending_cp11_late`). | 0.25 | The journey waits (stage 9 needs the war or 1758.3.1). | None. |
| B18.D3 | never | FREE | No dark power fights a major. | 1 | Nothing starts the Last Crowns as one war. | New rule: the first front that becomes historical (CP12 to CP16) sets the flag with `zin_war_piecemeal`; with no front at all, stage 9 is the quiet return and the age goes to judgement. |

#### B19. Lerendor leaves the Treaty of the Narrow Strait (CP12)

- **Canon:** established (North withdraws); treaty name proposed.

- **Historical outcome:** `zin_leren.35` (AI) or `.36` (human) decide 30 or 14 days after the war; `zin_leren_withdraw` sets `zin_leren_withdrawal`; `zin_leren.30` to `.32` news.

- **Trigger:** Target CP11 + 30, latest CP11 + 180; rule `zin_rule_leren_route` (DEFAULT follows the path).

- **Flags:** `zin_leren_withdrawal`.

- **Who can diverge:** Lerendor (player or AI), Aenor (appeals), R'en (strait shore).

| Id | Kind | Who | Divergence | m | Consequence | Successor or fallback |
| --- | --- | --- | --- | --- | --- | --- |
| B19.D1 | opposite | Lerendor | Honour the treaty (`zin_leren_treaty_honoured`, `zin_leren.33`). | 1 | Lerendor fights for Aenor; the strait can be barred (O9); `zin_lastwar.14` does not fire. | CP12 diverged; Master of the Strait closes. |
| B19.D2 | different | Lerendor | Seek supremacy over the strait (`zin_leren_strait_supremacy`). | 1 | Wars on R'en; claims on the strait shore. | Master of the Strait reachable (needs R'en's coast, O9). |
| B19.D3 | early | start variety V14 | Withdraws before the war. | 0.25 | The North is out when the war starts. | None. |
| B19.D4 | actor_annexed | any conqueror | Lerendor or Aenor is gone. | 0.5 | CP12 skipped. | Role R07 (Leren crown). |

#### B20. The Western Crossing (CP13)

- **Canon:** established (the West sails and seizes the capital).

- **Historical outcome:** The Ford Council chooses the crossing (`zin_west_route_crossing`); `zin_west_launch_crossing` (leader Gunwaith on the historical path) sets `zin_western_crossing`; landings across the central sea.

- **Trigger:** Resolve `zin_west_resolve` (grudge 50%, unity 30%, fleet 20%) at `resolve_cross_at` 60; target CP11 + 45, latest CP11 + 365; early crossing at resolve 80 after `1754.3.1` with Aenor in civil war; rule `zin_rule_west_route`.

- **Flags:** `zin_western_crossing`, `zin_west_route_crossing`.

- **Who can diverge:** The West Lands crowns (player or AI), Asgard, Lerendor, Aenor's fleet.

| Id | Kind | Who | Divergence | m | Consequence | Successor or fallback |
| --- | --- | --- | --- | --- | --- | --- |
| B20.D1 | never | West, rule | The West stays divided (`zin_west_route_divided`). | 1 | No capture of Parim. | B27 skipped; A Western Crown in Parim closes. |
| B20.D2 | opposite | West | The West sails as Aenor's relief (`zin_west_route_relief`, `zin_western_relief_sailed`, -3 Gathering Dark). | 1 | Westerners defend Parim. | B27 skipped; the coalition of the living is larger. |
| B20.D3 | never | West | The West holds at home (`zin_west_route_hold`). | 1 | No crossing. | B27 skipped. |
| B20.D4 | early | West | Early crossing. | 0.25 | +10 Gathering Dark. | None. |
| B20.D5 | actor_annexed | any conqueror | Gunwaith is gone. | 0 | Another member leads. | Role R06. |

#### B21. The eastern invasion of the Magical Lands (CP14)

- **Canon:** established (eastern coalitions threaten the Magical Lands).

- **Historical outcome:** `zin_east.41` to `.43`: the coalition gathers and crosses the rift; `zin_eastern_invasion`; `zin_elves.70`, `.71`; `zin_east.44` The Host Turns West after 120 days or 1 Glernaen 4A 1756.

- **Trigger:** Within 90 days of the war (target CP11 + 60, latest CP11 + 365); rule `zin_rule_ai_east`.

- **Flags:** `zin_eastern_invasion`, `zin_east_coalition_formed`.

- **Who can diverge:** Eastern courts (player or AI), the elves, the Worshipdom's footholds.

| Id | Kind | Who | Divergence | m | Consequence | Successor or fallback |
| --- | --- | --- | --- | --- | --- | --- |
| B21.D1 | never | eastern courts, REFUSE_AFRIT | No coalition forms (caravan war `zin_east_caravan_war`, low footholds). | 1 | The Magical Lands are spared. | CP14 diverged; the King of the East is weaker. |
| B21.D2 | different | UNITE_WITHOUT_AFRIT | The East unites under its own crown (`zin_east_united`). | 1 | One King in the East becomes reachable. | B26 D4. |
| B21.D3 | different | elves, rule MARCH | The Kindred march (`zin_elves_march`). | 0.5 | The Refusal is laid down for this war only. | Allowed only in a far-diverged game: AI gate `zin_path_divergence` 50 or more, because the vault forbids the Refusal becoming a new alliance (OPEN_QUESTIONS elves 3). |
| B21.D4 | early | eastern host | The host breaks through the passes of the Great Wall range into the Middle Lands early. | 0.25 | The Wall is a natural range (K2): only its passes fall. | None. |

#### B22. Volgan retakes Mirolon (CP15)

- **Canon:** established.

- **Historical outcome:** Volgan declares war on Mirolon (`zin_dominion_war_started`, `zin_dominion.10` Out of the Storms); Mirolon falls (`zin_dominion_mirolon_falls`, `zin_dominion.11`, `.24` A Court in Exile) and `zin_mirolon_fallen` is set.

- **Trigger:** Strength `zin_dominion_strength` (start 45) to the great host (70, or 60 for a historical AI after `zin_dominion_after_1755_04`); target `1755.11.1`, latest `1756.9.1`; rules `zin_rule_dark_powers`, `zin_rule_volgan_spirit`.

- **Flags:** `zin_mirolon_fallen`.

- **Who can diverge:** Mirolon (player: passes, proof, Aenor's guarantee), Volgan (player), Herez, the rules.

| Id | Kind | Who | Divergence | m | Consequence | Successor or fallback |
| --- | --- | --- | --- | --- | --- | --- |
| B22.D1 | opposite | Mirolon | Mirolon holds the passes (`zin_mirolon_passes_held`). | 1 | The march north is delayed or broken. | CP15 diverged; Children of Volgan less likely. |
| B22.D2 | early | rule AGGRESSIVE | Volgan strikes a year early. | 0.25 | Stronger hosts. | None. |
| B22.D3 | different | Volgan | Volgan lets Mirolon go (`zin_dominion_let_mirolon_go`). | 1 | Peace in the south. | CP15 diverged. |
| B22.D4 | actor_annexed | any conqueror | Mirolon no longer exists. | 0.5 | Volgan's target is the holder of the passes. | Role R08: "Mirolon falls" means Volgan controls `zin_is_site_mirolon_passes`. |
| B22.D5 | never | rule RESTRAINED | Volgan never strikes first. | 1 | Only an attack on him starts the southern front. | CP15 diverged by date. |

#### B23. Volgan marches north (CP15)

- **Canon:** established.

- **Historical outcome:** `zin_volgan_begin_march` (Volgan focus) sets `zin_volgan_marches`; `zin_dominion.12` The March North; AI conquers the Parim holder and Herez (06 table).

- **Trigger:** After `zin_mirolon_fallen`; today only the focus starts it (SL-34).

- **Flags:** `zin_volgan_marches`.

- **Who can diverge:** Volgan (player or AI), Herez (`zin_lastwar.41` Herez Holds the Marches), Goldoroth.

| Id | Kind | Who | Divergence | m | Consequence | Successor or fallback |
| --- | --- | --- | --- | --- | --- | --- |
| B23.D1 | never | Volgan (player), FREE | The march never begins. | 1 | The Middle Lands face only the West, the East and the dead. | CP15 diverged; B33 and B34 need Volgan in the field (SL-33 deadline). |
| B23.D2 | different | Volgan | He turns on the Dark Lands first (Goldoroth sworn, `zin_rule_ai_goldoroth`). | 0.5 | Children of Volgan grows by subjects. | None. |
| B23.D3 | different | Herez | The march is broken at the marches. | 0.5 | Volgan's strength falls. | None. |

#### B24. Zol's dead rise (CP16)

- **Canon:** established.

- **Historical outcome:** `zin_zol_rise` sets `zin_zol_rising`; `zin_mistake.10` Whither the Dead (Aenor is historical), `.11` news, `zin_leren.51`.

- **Trigger:** Appointed hour `1755.5.1`, forced rising `1755.7.1` (hastened `1753.3.1`, early `1754.7.1` under AGGRESSIVE), power 55; skip `zin_zol_presence_lapsed`.

- **Flags:** `zin_zol_rising`.

- **Who can diverge:** Rule `zin_rule_dark_powers`; a Zol player; forewarned crowns.

| Id | Kind | Who | Divergence | m | Consequence | Successor or fallback |
| --- | --- | --- | --- | --- | --- | --- |
| B24.D1 | early | hastened hour, AGGRESSIVE | The dead rise early. | 0.25 | The north burns before the West sails. | None. |
| B24.D2 | different | Zol | The dead strike Lerendor or the North first (`zin_mistake.10` option). | 0.25 | The northern front shifts. | None. |
| B24.D3 | never | RESTRAINED, presence lapsed | The dead never rise. | 1 | No dead front. | CP16, CP20 and CP23 skipped; Lorien lives; the Zol battle is skipped and the heir is hailed on 1 Naisa 4A 1757. |

### VI. The god-king flees

#### B25. Afrit abandons Aenor; the name is known (CP17)

- **Canon:** established (abandons his subjects); the reveal at the flight is decision D3.

- **Historical outcome:** `zin_afrit.50` Aenor Cannot Hold (checkpoint: Hold for now / Go east (hist) / Flee), `zin_afrit_flee_east` calls `zin_afrit_reveal` (`zin_afrit.43` The Name Behind the Deliverer, `.45`) and sets `zin_afrit_abandoned_aenor`; `zin_aenor.300` to every Aenor realm; `zin_afrit.53` Merovan's choice.

- **Trigger:** Pressure or `1756.3.1` (`zin_afrit_date_flight`); fallback in `zin_afrit_historical_fallbacks` (SL-08).

- **Flags:** `zin_afrit_abandoned_aenor`, `zin_afrit_revealed`.

- **Who can diverge:** The Worshipdom (player or AI).

| Id | Kind | Who | Divergence | m | Consequence | Successor or fallback |
| --- | --- | --- | --- | --- | --- | --- |
| B25.D1 | opposite | Worshipdom | Afrit stands in Parim (`zin_afrit_stand_in_parim`). | 1 | No flight, no King of the East; the West must storm Parim; the palace happens with Afrit already there. | CP17 diverged; `zin_west.55` and `zin_afrit.62` do not fire. |
| B25.D2 | different | eastern courts | Afrit flees only to the hermitage (fewer than two courts kneel). | 0.5 | No Dominion of the East; a weak return. | B26 D1. |
| B25.D3 | early | exposure, veil below 15 | The name is known early (`zin_afrit_unmasked_early`). | 0.5 | +10 Gathering Dark; `zin_afrit_unmasked`. | Flight by pressure. |
| B25.D4 | different | B09 D1, B08 D1 to D3 | Afrit is not on Aenor's throne. | 0.5 | The Council withdraws east from the Worshipdom; the name is still spoken at the flight. | CP17 historical if the King of the East follows. |
| B25.D5 | never | rule DORMANT | The Worshipdom never leaves its hills. | 1 | The name stays secret; the Ashen Throne cannot be reached without the reveal (`zin_world_reach_ending` calls it). | CP17 skipped; the stage 12 gate uses the reduced-Afrit test (SL-09). |

#### B26. Afrit is proclaimed King of the East (CP17)

- **Canon:** established.

- **Historical outcome:** `zin_afrit.51` to each eastern candidate (`zin_afrit_kneel_chance`; under the historical branch the two AI candidates with the most footholds kneel), kneeling courts become subjects with `zin_autonomy_eastern_client`; `zin_afrit.52` news; `zin_afrit.9` sets `zin_afrit_king_of_east`; cosmetic "the Dominion of the East"; `zin_east.50`, `.51`, `.45`.

- **Trigger:** 30 days after the flight.

- **Flags:** `zin_afrit_king_of_east`.

- **Who can diverge:** Every eastern candidate (player or AI); rule `zin_rule_ai_east`.

| Id | Kind | Who | Divergence | m | Consequence | Successor or fallback |
| --- | --- | --- | --- | --- | --- | --- |
| B26.D1 | never | eastern courts | No court kneels. | 1 | No eastern throne. | CP17 diverged; B38 is a raid from the hermitage, not a host. |
| B26.D2 | different | deep footholds | Many courts kneel. | 0.25 | A strong Dominion of the East; Ashen paths open. | None. |
| B26.D3 | different | clients | Kneelers break free later (`zin_east.45`). | 0.25 | The return is weaker. | None. |
| B26.D4 | different | B21 D2 | A united eastern crown refuses him. | 0.5 | War in the east between the claimant and the god-king. | One King in the East needs Afrit dead or never King of the East. |

#### B27. Western armies take Parim (CP18)

- **Canon:** established.

- **Historical outcome:** `zin_west_parim_taken`; `zin_lastwar.60` Parim Under Western Banners; the Aenor realm moves to its fallback seat (`zin_aenor_fallback_seat`).

- **Trigger:** Control of `zin_is_site_parim` by a Crossing member.

- **Flags:** `zin_west_parim_taken`.

- **Who can diverge:** Battles; the defenders.

| Id | Kind | Who | Divergence | m | Consequence | Successor or fallback |
| --- | --- | --- | --- | --- | --- | --- |
| B27.D1 | never | battle | Parim is not taken. | 1 | Aenor holds its capital. | CP18 diverged. |
| B27.D2 | different | battle | Another power takes Parim (the eastern host, Volgan, the dead). | 0.75 | The Parim holder changes. | Role R15 (`zin_aenor_find_parim_realm`); endings follow the holder. |
| B27.D3 | different | western claimant | A western claimant takes Parim's throne (`zin_west_throne_claimed`, +3). | 0.5 | A Western Crown in Parim reachable (SL-19 fix). | None. |

#### B28. Crushed between two darks; the West evacuates (CP18)

- **Canon:** established.

- **Historical outcome:** The dead and the Dominion clash (`zin_dominion.13`); Westerners find the conquest untenable and evacuate (`zin_west_evacuation`, `zin_west_evacuated`); stranded companies remain (`zin_lastwar.62`, `zin_east.46`).

- **Trigger:** Volgan's clash condition (O4); western strain (`strain_*`).

- **Flags:** `zin_volgan_zol_clash`, `zin_west_evacuated`.

- **Who can diverge:** Volgan, Zol, the western leader.

| Id | Kind | Who | Divergence | m | Consequence | Successor or fallback |
| --- | --- | --- | --- | --- | --- | --- |
| B28.D1 | never | Zol never rose | No clash. | 0.5 | Volgan alone presses Parim. | None. |
| B28.D2 | different | West | The West holds Parim and does not evacuate. | 0.5 | A Western Crown in Parim at judgement. | None. |
| B28.D3 | different | stranded companies | Stranded armies join the Host. | 0.25 | Coalition of the living larger. | None. |

### VII. The return of the king without a kingdom

#### B29. Eindil returns on a dragon; the Host of Eindil (CP19)

- **Canon:** established.

- **Historical outcome:** `zin_eindil.90` On Dragon's Wings, `.92` Raise the Host of Eindil (Selen; S2), `.93`, `.94` The Coalition of the Living, `.95` Give the Lost Cause to the Heir; `zin_eindil_returned`.

- **Trigger:** Stage 9 floor `1757.3.1`; ready when the war runs and the dragon pact exists, or on `1758.3.1`.

- **Flags:** `zin_eindil_returned`.

- **Who can diverge:** Selen, sworn countries, the Lost Cause leader.

| Id | Kind | Who | Divergence | m | Consequence | Successor or fallback |
| --- | --- | --- | --- | --- | --- | --- |
| B29.D1 | different | no war | The quiet return (`zin_eindil_quiet_return`). | 0.5 | No battles; a crown in the wrong hands. | CP19 diverged; the palace and coronation still follow. |
| B29.D2 | late | Keeper | A late return. | 0.25 | Fewer friends. | None. |
| B29.D3 | actor_annexed | any conqueror | Selen no longer exists. | 0.5 | A dynamic Host of Eindil (`zin_eindil_create_dynamic_host`; tag budget S12). | Role R03. |
| B29.D4 | different | Lost Cause leader | The Lost Cause stays Aenor's shield (`zin_lost_cause_shield`) or passes to the heir. | 0.25 | Who leads the faction. | None. |

#### B30. The wave of Glo; the coalition of the living (CP19)

- **Canon:** established (his sword destroys Zol's dead; the people unite).

- **Historical outcome:** `zin_eindil.91` The Wave of Glo unmakes a front of the dead (`zin_glo_wave_battlefield`); `.94` coalition.

- **Trigger:** Glo state 1 and Zol's dead in the field.

- **Who can diverge:** Glo's state; Zol.

| Id | Kind | Who | Divergence | m | Consequence | Successor or fallback |
| --- | --- | --- | --- | --- | --- | --- |
| B30.D1 | never | Glo sealed or dimmed | No wave. | 0.5 | The dead are not unmade. | None. |
| B30.D2 | never | Zol never rose | No dead to unmake. | 0.5 | The wave is unused. | None. |

#### B31. The Black Compact (CP20)

- **Canon:** established (the darks briefly join against Eindil).

- **Historical outcome:** Volgan offers the Black Compact after `zin_eindil_returned`; `zin_black_compact` is set; `zin_lastwar.71` Two Darks, One Field.

- **Trigger:** Volgan's focus after the return; today `zin_dominion.14` is not written (SL-15).

- **Flags:** `zin_black_compact`.

- **Who can diverge:** Volgan, Zol.

| Id | Kind | Who | Divergence | m | Consequence | Successor or fallback |
| --- | --- | --- | --- | --- | --- | --- |
| B31.D1 | never | Zol | Zol refuses; the darks fight each other (`zin_volgan_strike_zol`). | 0.5 | Easier field for the Host. | None. |
| B31.D2 | never | Zol never rose | Nothing to offer. | 0.5 | None. | None. |

#### B32. Varner dies shielding the living (CP20)

- **Canon:** established.

- **Historical outcome:** `.96` Volgan at the Southern Front starts `.97` Varner's Last Wards when Zol's dead are in the field; `zin_varner_dead`; `zin_lastwar.72` Where Is Golbran? (his apparent sacrifice, proposed).

- **Trigger:** Battle 1 (`1757.6.1` historical; free: the Host near Volgan's ground).

- **Flags:** `zin_varner_dead`.

- **Who can diverge:** Zol's presence; the Host's fronts.

| Id | Kind | Who | Divergence | m | Consequence | Successor or fallback |
| --- | --- | --- | --- | --- | --- | --- |
| B32.D1 | never | Zol not at war with the Host | Varner lives. | 1 | CP20 skipped; Golbran's apparent sacrifice does not happen. | Golbran keeps his full reserve for the palace (stage 4 base +10). |

#### B33. Volgan casts Eindil down; the New Gods restore him (CP21)

- **Canon:** established.

- **Historical outcome:** Volgan beats Eindil (`zin_dominion.16` Then I Will Bury Them Together; `zin_volgan_struck_down_eindil`); `zin_eindil.98` The Gathering of the New Gods restores him through Glo; `zin_eindil_restored`.

- **Trigger:** Battle 2 after `battle_gap_days` 30, on `1757.7.1` (historical) or when the Host meets Volgan (free).

- **Flags:** `zin_eindil_restored`.

- **Who can diverge:** Volgan, Glo's state.

| Id | Kind | Who | Divergence | m | Consequence | Successor or fallback |
| --- | --- | --- | --- | --- | --- | --- |
| B33.D1 | actor_dead | Glo not carried | Without Glo the heir does not rise (`zin_eindil.99`, `zin_eindil_lost`). | 1 | Lost Cause closes. | `zin_ending_heir_lost` (today never called, SL-37) fires `zin_ending.80` The League Without the Heir. |
| B33.D2 | never | Volgan gone or body already destroyed | No fall, so no restoration. | 0.5 | The heir lacks `zin_eindil_blessed_of_the_new_gods`. | CP21 skipped; battles 1 to 3 skipped. |
| B33.D3 | never | FREE: the Host never meets Volgan | Battle 1 never fires. | 0.5 | Today stage 9 hangs (SL-33). | Deadline: CP21 latest date skips battles 1 to 3. |

#### B34. Volgan's manifested body is destroyed (CP22)

- **Canon:** established (spiritual fate unresolved).

- **Historical outcome:** `zin_eindil.100` The Blue Sword Through Volgan calls `zin_volgan_destroy_body`; `zin_volgan_body_destroyed`; `zin_dominion.17` The Body Breaks, `.18` Old Allegiances, `.23` The Compact Ends, `.19` The Steward's Choice.

- **Trigger:** Battle 3 on `1757.8.1` (historical) or near Volgan's ground (free).

- **Flags:** `zin_volgan_body_destroyed`.

- **Who can diverge:** Battles; Volgan.

| Id | Kind | Who | Divergence | m | Consequence | Successor or fallback |
| --- | --- | --- | --- | --- | --- | --- |
| B34.D1 | never | battle | The body survives. | 1 | Children of Volgan stays open. | CP22 diverged. |
| B34.D2 | actor_annexed | any conqueror | Volgan's realm is annexed with the body intact. | 0.75 | His spirit's fate stays open (canon). | New `zin_volgan_withdrawn_south` (proposed): Children of Volgan closes; the Steward's Choice (`zin_dominion.19`) runs for the remnant; CP22 skipped. |

### VIII. Kusven

#### B35. Kusven, Zol's most loyal servant, comes forth and breaks the blue sword (CP23)

- **Canon:** established (owner corrections K4 and K11 and the owner decision of 24 October 2026): Kusven (formerly Edvoid), a Great Spirit and Zol's most loyal servant; Zol himself does not appear.

- **Historical outcome:** Kusven takes the field (re-designed `zin_mistake.20`), overpowers the renewed champion and shatters Horos's blue sword (`zin_mistake.21` sets `zin_horos_sword_broken`; Glo power cap 50); Eindil wounds Kusven with a shard (`zin_kusven_wounded`); `zin_eindil.101` The Heir Struck Down (retitled).

- **Trigger:** CP22 + 7 days; servant power 60 and convergence 100 (`mech_zol.json` manifestPower, manifestConvergence); late hour `1758.1.1`; latest `1758.9.1`.

- **Flags:** `zin_kusven_forth` (replaces zin_zol_manifested), `zin_horos_sword_broken`, `zin_kusven_wounded`.

- **Who can diverge:** Zol (AI, rule), the Host's fronts, Glo.

| Id | Kind | Who | Divergence | m | Consequence | Successor or fallback |
| --- | --- | --- | --- | --- | --- | --- |
| B35.D1 | never | Zol never rose, RESTRAINED, power too low | Kusven never comes forth. | 1 | Lorien lives; no sword-break. | CP23 skipped; battle 5 on 1 Naisa 4A 1757. |
| B35.D2 | different | Host not at war with Zol | Kusven ravages elsewhere. | 0.5 | No sword-break; withdrawal only by cost (deathfield). | CP23 diverged. |
| B35.D3 | early | power reached early | He comes forth before Volgan's body breaks. | 0.25 | Battle order changes. | Battle 4 is noticed on his coming. |
| B35.D4 | different | Glo not with Eindil | Without Glo the sword-break has no bearer to wound him. | 0.5 | `zin_eindil.101` fires from the coming forth itself; Kusven is not wounded. | None. |

#### B36. Lorien and the ancient spirits die; Kusven withdraws (CP23)

- **Canon:** established.

- **Historical outcome:** `zin_mistake.22` The Old Lords Ride (Gala, checkpoint) calls `zin_sun_lorien_rides` (`zin_sun.40` news); 14 days later `zin_mistake.23` Lorien's Stand calls `zin_sun_lorien_falls` (`zin_lorien_dead`, `zin_sun.42` After the King) and Kusven withdraws wounded, not destroyed (re-designed `zin_mistake.24`).

- **Trigger:** Gala alive with Lorien after Kusven comes forth.

- **Flags:** `zin_lorien_dead`, `zin_kusven_withdrawn` (replaces zin_zol_withdrawn).

- **Who can diverge:** Gala (player or AI), whoever holds Lorien.

| Id | Kind | Who | Divergence | m | Consequence | Successor or fallback |
| --- | --- | --- | --- | --- | --- | --- |
| B36.D1 | different | Gala | Gala does not ride, or Lorien is already dead or held. | 0.5 | Kusven withdraws by cost (`zin_mistake.25` The Form Is Spent, re-designed): longer ravage, wider deathfield. | CP23 diverged "without the death of the King of Gala"; Lorien lives into the sandbox. |

#### B37. Hailed as king on the field (CP26)

- **Canon:** established (the surviving peoples unite); the hailing proposed.

- **Historical outcome:** After the servant withdraws, or on 1 Naisa 4A 1757 if he never came, `zin_eindil_hail_the_king` fires `.102` to the Host and the coalition; `zin_eindil_stage_9_done`.

- **Trigger:** Battle 3 or 4 done and `zin_zol_withdrawn` (renamed) or the date.

- **Flags:** `zin_eindil_stage_9_done`.

- **Who can diverge:** The coalition.

| Id | Kind | Who | Divergence | m | Consequence | Successor or fallback |
| --- | --- | --- | --- | --- | --- | --- |
| B37.D1 | different | few friends | Only the Host hails him. | 0 | Smaller coalition opinion gains. | None. |

### IX. The second betrayal

#### B38. Afrit returns from the East (CP24)

- **Canon:** established.

- **Historical outcome:** `zin_afrit.60` The Return from the East; `zin_afrit_return` declares war on the holder of Parim and on the country employing Eindil; `zin_afrit_returned`; `zin_lastwar.90` news.

- **Trigger:** Dates `zin_afrit_date_return_open` `1758.1.1` and `zin_afrit_date_return` `1758.2.1` (defined, unused: SL-09); today only a Worshipdom focus calls `zin_afrit_return`.

- **Flags:** `zin_afrit_returned`.

- **Who can diverge:** The Worshipdom (player or AI).

| Id | Kind | Who | Divergence | m | Consequence | Successor or fallback |
| --- | --- | --- | --- | --- | --- | --- |
| B38.D1 | never | Worshipdom | Afrit never returns. | 1 | He stays King of the East. | Stage 12 reduced-Afrit gate (SL-09): coronation possible with `zin_afrit_beyond_the_rift` (owner question Q1). |
| B38.D2 | early | Worshipdom | He returns early (the darks broken early). | 0.25 | None. | None. |
| B38.D3 | actor_annexed | any conqueror | His realm is destroyed before he returns. | 0.75 | Today nothing happens (SL-10). | New `zin_afrit_hidden` successor: The Hunt for the False God (`zin_afrit.77`, proposed) with a 365-day hunt. |

#### B39. The cliff: Eindil cast down; Afrit claims all Aoaz (CP24)

- **Canon:** established (arm severed, thrown from a cliff).

- **Historical outcome:** `zin_afrit.61` Brother Against Brother; `zin_eindil.110` The Cliff (`zin_eindil_cliff_effects`, `zin_eindil_cast_down`), `.112` Word of the King's Death; `zin_afrit.62` Lord of All Aoaz sets `zin_afrit_claims_aoaz` (forced under the historical rule by 1 Ailtal 4A 1758, `zin_afrit_date_parim` `1758.9.1`).

- **Trigger:** The hub at war with Eindil's employer and its side controlling a Middle Lands state.

- **Flags:** `zin_eindil_cast_down`, `zin_afrit_claims_aoaz`.

- **Who can diverge:** The Worshipdom; the Host's guard.

| Id | Kind | Who | Divergence | m | Consequence | Successor or fallback |
| --- | --- | --- | --- | --- | --- | --- |
| B39.D1 | never | no war between the brothers | No cliff. | 0.5 | Stage 10 skipped. | Stage 11 from stage 9 (already allowed). |
| B39.D2 | never | battle | Afrit cannot hold Parim. | 0.5 | No claim of all Aoaz. | Stage 11 needs `zin_afrit_holds_parim` or the stand-in; otherwise the reduced-Afrit gate (SL-09). |

#### B40. Below the cliff: Alleria's rescue (CP24)

- **Canon:** established (he survives); rescue by Alleria proposed.

- **Historical outcome:** `.111` Below the Cliff to Alleria's employer; `.113` The King Returns from the Dead; `zin_eindil_recovered`.

- **Trigger:** After the cliff; `recovery_fallback` 400 days.

- **Flags:** `zin_eindil_recovered`.

- **Who can diverge:** Alleria's employer.

| Id | Kind | Who | Divergence | m | Consequence | Successor or fallback |
| --- | --- | --- | --- | --- | --- | --- |
| B40.D1 | actor_absent | any | Alleria is not available. | 0.25 | The rangers of Selen find him (variant text). | Recovery fallback 400 days. |

### X. The palace

#### B41. The palace: the artifacts stripped; Afrit and Golbran die (CP25)

- **Canon:** established.

- **Historical outcome:** `zin_afrit.70` The Palace Wards, `.71` the Ring (Alleria's arrow, `zin_eindil.120`), `.72`, `.73` the Crown and the Bracelet (`.121`), `.74` the Necklace (Golbran, `.123`), `.75` The False God Falls (news; `zin_afrit_die` sets `zin_afrit_dead`; `.124`), `.125` Golbran's Gift (`zin_golbran_dead`), `.126` The Necklace (`zin_eindil_wears_necklace`).

- **Trigger:** `zin_eindil_ready_11`: stage 10 (or 9 done without a cliff), `zin_eindil_recovered`, Afrit holds Parim or stands in Parim, Afrit alive. Stage chances from `mech_afrit.json` palace rows (60, 55, 55, 50).

- **Flags:** `zin_afrit_dead`, `zin_golbran_dead`, `global.zin_afrit_artifacts = 0`.

- **Who can diverge:** The Host, the Worshipdom (defences), the dice.

| Id | Kind | Who | Divergence | m | Consequence | Successor or fallback |
| --- | --- | --- | --- | --- | --- | --- |
| B41.D1 | late | dice | The palace holds once (`zin_afrit.76`, `zin_eindil.127`). | 0.25 | Host stability -25% for 180 days; Afrit restarts after 180 days (R6). | A second attempt. |
| B41.D2 | opposite | dice | The palace holds twice. | 1 | `zin_eindil_lost`. | Ashen Throne path (a) if its conditions hold; otherwise judgement. |
| B41.D3 | actor_absent | any | Alleria or Golbran is not available. | 0.5 | Their stage loses its journey bonus. | Stage 1 without Alleria at base 60; stage 4 without Golbran: Eindil grips the necklace alone (base 30, proposed) and Golbran's death is not set. |

#### B42. Eindil is crowned King of Aenor (CP26)

- **Canon:** established.

- **Historical outcome:** `zin_eindil.130` The Crown Is Offered; `zin_aenor_crown_eindil` sets `zin_eindil_crowned` and calls `zin_world_check_endings`: the Lost Cause.

- **Trigger:** `zin_aenor_eindil_can_be_crowned`: Afrit dead, named, returned, not lost, crowning realm of Aenor, Parim controlled with no enemy divisions, `zin_aenor_date_coronation` under HISTORICAL (target `1760.3.1`).

- **Flags:** `zin_eindil_crowned`, `zin_ending_lost_cause`.

- **Who can diverge:** The Aenor realm (accept), the Parim holder, the coalition.

| Id | Kind | Who | Divergence | m | Consequence | Successor or fallback |
| --- | --- | --- | --- | --- | --- | --- |
| B42.D1 | late | Parim held by an enemy | The Crown Withheld (`.132`), retried every 30 days. | 0.25 | None. | Judgement on 1 Glernaen 4A 1762 (deferred to 1764 while the heir is at stage 12, see endings). |
| B42.D2 | actor_annexed | any conqueror | No Aenor realm exists. | 0.5 | `zin_eindil_found_parim_realm` creates one when a coalition member owns Parim. | Otherwise The Crown Withheld until Parim is retaken. |
| B42.D3 | early | FREE | No coronation date gate. | 0.25 | Crowned as soon as Afrit is dead. | None. |
| B42.D4 | different | B07 D3 | Crowned as the Golden King's chosen heir. | 0.5 | Lost Cause variant: the King abdicates or dies and names him. | None. |

### XI. Endings

#### B43. Children of Volgan (ENDING)

- **Canon:** established ending (one of three alternatives).

- **Historical outcome:** Not on the historical path.

- **Trigger:** From `1756.3.1` (`zin_world_date_children`): Volgan's body intact, Parim held by Volgan or a subject, at least four subjects, strength 60, Eindil not crowned.

- **Flags:** `zin_ending_children_of_volgan`.

- **Who can diverge:** Volgan, every defender of Parim.

| Id | Kind | Who | Divergence | m | Consequence | Successor or fallback |
| --- | --- | --- | --- | --- | --- | --- |
| B43.D1 | different | Volgan | Volgan reaches the ending. | 1 | `zin_world.101`; Lord of a Ruined World. | Sandbox to 4A 1800. |

#### B44. The Ashen Throne (ENDING)

- **Canon:** established ending.

- **Historical outcome:** Not on the historical path.

- **Trigger:** Afrit alive with the Necklace, holding Parim, 12 countries at footholds 4 or more (`global.zin_afrit_deep_count`), and the palace held (from `1759.1.1`), all Aoaz claimed (from `1760.1.1`), or the stand-in with the war (from `1760.1.1`).

- **Flags:** `zin_ending_ashen_throne`.

- **Who can diverge:** The Worshipdom, every realm with deep footholds.

| Id | Kind | Who | Divergence | m | Consequence | Successor or fallback |
| --- | --- | --- | --- | --- | --- | --- |
| B44.D1 | different | Afrit | Afrit reaches the ending; `zin_world_reach_ending` calls `zin_afrit_reveal` first if needed. | 1 | `zin_world.102`; The Worshipped King. | Sandbox to 4A 1800. |

#### B45. Judgement of the proposed outcomes; the Age Unfinished; the sandbox (ENDING)

- **Canon:** proposed outcomes (vault, outside canon) and ZIN fallback.

- **Historical outcome:** Not needed on the historical path (the Lost Cause comes first).

- **Trigger:** `zin_world_date_judgement` `1762.1.1` (paced): Golden Court Endures, A Western Crown in Parim, Master of the Strait, One King in the East in that order; `zin_world_date_unfinished` `1770.1.1`: The Age Unfinished. The sandbox runs to 4A 1800 (`calendar.mjs` END_DATE `1800.1.1.1`).

- **Flags:** `zin_ending_golden_court`, `zin_ending_western_crown`, `zin_ending_strait_master`, `zin_ending_eastern_king`, `zin_ending_unfinished`.

- **Who can diverge:** Every realm that holds the outcome's condition.

| Id | Kind | Who | Divergence | m | Consequence | Successor or fallback |
| --- | --- | --- | --- | --- | --- | --- |
| B45.D1 | different | any | A proposed outcome is reached. | 1 | Its news (`zin_world.103` to `.106`) and a small spirit. | Sandbox. |
| B45.D2 | never | any | No outcome holds by 1770. | 1 | `zin_world.107` The Age Unfinished. | Sandbox. |

## 5. Soft-lock audit

37 soft-locks: 9 critical, 10 high, 14 medium, 4 low. Critical means a chain hangs or an ending is closed under the default rules; high means a beat can never be historical or silently takes the wrong branch; medium means a successor, flag or check is missing and the story stays coherent only by luck; low means a wrong scope or text.

The single largest cause is ownership: three modules the specs require do not exist (`world_tension.mjs`, `historical_path.mjs`, and the events slice for the mechanic namespaces), so the War of the Last Crowns never begins, no checkpoint resolves, no ending can be reached, and 61 narrative events that the mechanics fire are undefined, several of them carrying the beat's own effect.

The second is that the Afrit chain has no way out except his death in the palace, and the palace and the death are both unreachable today (SL-05, SL-06), so every game currently ends in the sandbox without an ending.

### Critical

#### SL-01. The War of the Last Crowns never begins

- **Kind:** flag never set. **Beats:** B18, B19, B20, B21, B25, B29.

- **Where:** tools/content/modules/events_world.mjs (lastwar runner, line 253); tools/content/modules/mech_lerendor.mjs (lines 396, 408); tools/content/modules/mech_eindil_scripts.mjs (zin_eindil_ready_9, line 74); tools/content/lib/mech_afrit_script.mjs (flight fallback); tools/content/modules/mech_crossing.mjs (line 320); staged:events/*, common/* (82 readers)

- **Ids:** `zin_war_of_last_crowns`, `zin_world.20`

- **Problem:** Nothing sets `zin_war_of_last_crowns`: its owner, `tools/content/modules/world_tension.mjs` with `zin_world.20` (05_world_tension_and_endings.md), does not exist. Every front gated on it never opens: the lastwar runner, Lerendor's withdrawal prompt and AI fallback, the AI Western launch, the eastern coalition, the Afrit flight fallback and stage 9 (which then waits for 1 Lumae 4A 1758).

- **Fix:** Write `world_tension.mjs` with `zin_world.20` and the dated, paced trigger `zin_world_date_last_crowns` (three pace sets). Until it ships, the path module (`historical_path.mjs`) sets the flag at the CP11 latest date as its watchdog, and the piecemeal rule (B18 D3) lets the first historical front set it.

- **Owner:** world systems

#### SL-02. No checkpoint ever resolves

- **Kind:** variable never written. **Beats:** all.

- **Where:** tools/content/modules/events_crown.mjs (lines 380 to 396, Chronicle); tools/content/modules/forces.mjs (lines 525 to 527, zin_ai_era_peace, zin_ai_era_stirring); tools/content/lib/crown_script.mjs (lines 237 to 266); staged:common/scripted_triggers/zin_events_world.txt

- **Ids:** `zin_path_cp01 .. zin_path_cp26`, `zin_path_divergence`, `zin_path_tick`, `zin_path.1`

- **Problem:** The historical path module of 06_historical_path_and_ai.md was never written, so no checkpoint resolves, `zin_path_divergence` stays 0, the Chronicle shows no checkpoint line, the PLAUSIBLE weights never drop, there is no watchdog, and the AI eras of forces.mjs stay at peace (`zin_ai_era_peace` needs `zin_path_cp05 = 0`, so `zin_ai_era_stirring` is never true).

- **Fix:** Write `tools/content/modules/historical_path.mjs` with `data/path_checkpoints.json` generated from this file's JSON (beats, weights, latest dates), the tick, the watchdog, the role resolvers and the divergence measure below.

- **Owner:** historical path

#### SL-03. No ending can be reached

- **Kind:** effect and trigger undefined. **Beats:** B42, B43, B44, B45.

- **Where:** staged:common/scripted_effects/zin_aenor_court.txt (coronation calls zin_world_check_endings); staged:common/national_focus/zin_worshipdom.txt (focus calls zin_world_reach_ending); staged:common/scripted_effects/zin_ending_story.txt (reads zin_world_date_last_crowns, zin_world_date_children); tools/content/data/events_crown_world.json

- **Ids:** `zin_world_check_endings`, `zin_world_reach_ending`, `zin_world_date_judgement`, `zin_world_date_unfinished`, `zin_world_date_children`, `zin_ending_start_epilogue`, `zin_world.100 .. zin_world.107`

- **Problem:** No ending can ever be reached: `zin_world_reach_ending` and `zin_world_check_endings` are undefined, so `zin_ending_*` flags, `zin_ending_reached`, the news `zin_world.100` to `.107` and `zin_ending_start_epilogue` never run; the judgement and unfinished dates do not exist, so a diverged game never ends and never declares the sandbox.

- **Fix:** Part of `world_tension.mjs`: define the two effects, the ending checks, the dated triggers, and call `zin_ending_start_epilogue` with `zin_arg_ending`.

- **Owner:** world systems

#### SL-04. The Deliverer is never crowned

- **Status:** fixed on 25 October 2026 (Afrit, Aenor and Eindil pass). zin_afrit.20 (CP06: wait, take the crown, a pliant heir, rule from Parim in person), .21, .22 and .23 (its immediate block crowns Eronel once) are written in events_mech.mjs; the Council's month crowns an AI seat 30 days after zin_aenor_faithful_rule by its branch (historical and ambitious the crown, patient the heir, free 80 to 20). Test tools/content/events_mech.test.mjs; handoff docs/plans/story/afrit_aenor_eindil_handoff.md.

- **Kind:** event undefined; effect never called. **Beats:** B09, B10, B25, B26.

- **Where:** staged:common/scripted_effects/zin_aenor_court.txt (zin_aenor_give_seals fires zin_afrit.20); staged:common/scripted_effects/zin_afrit.txt (zin_afrit_crown_aurevan, zin_afrit_raise_pliant_heir: no caller)

- **Ids:** `zin_afrit.20`, `zin_afrit.21`, `zin_afrit.22`, `zin_afrit.23`, `zin_afrit_crown_aurevan`, `zin_afrit_raise_pliant_heir`

- **Problem:** When the Faithful win the Thirty Days, `zin_aenor_give_seals` fires `zin_afrit.20`, which no module defines. `zin_afrit_crown_aurevan` and `zin_afrit_raise_pliant_heir` are never called, so `zin_aurevan_crowned` and `zin_afrit_kingdom_behind_throne` never set; the god-king arc, the flight fallback (which needs `zin_aurevan_crowned`) and the King of the East all fail silently.

- **Fix:** Write the Afrit narrative events (06_events/01, Act IV) in the new mechanic events module (`events_mech.mjs`, data `events_mech_afrit.json`). Timeout successor: 30 days after `zin_aenor_faithful_rule` with neither flag set, an AI Worshipdom crowns Aurevan under the historical branch (pliant heir under FREE by its weights).

- **Owner:** Afrit; mechanic events

#### SL-05. Afrit can never die

- **Status:** fixed on 25 October 2026 (Afrit, Aenor and Eindil pass). zin_afrit.70 to .76 are written; .70 starts stage 1 (.71), each stage offers the hub's defences and rolls zin_afrit_palace_roll; the news .75 calls zin_afrit_die once (its only caller, O2) and fires zin_eindil.124; .76 fires zin_eindil.127. Test tools/content/events_mech.test.mjs.

- **Kind:** event undefined; effect never called. **Beats:** B41, B42.

- **Where:** tools/content/lib/mech_afrit_script.mjs (lines 608, 632); staged:common/scripted_effects/zin_afrit.txt (zin_afrit_die)

- **Ids:** `zin_afrit.70`, `zin_afrit.72`, `zin_afrit.73`, `zin_afrit.74`, `zin_afrit.75`, `zin_afrit.76`, `zin_afrit_die`

- **Problem:** The palace stages fire `zin_afrit.70` and `.72` to `.76`, none of which exist; `zin_afrit_die` is "called once by the immediate block of zin_afrit.75" and so never runs. `zin_afrit_dead` is never set, `zin_aenor_eindil_can_be_crowned` is never true, stage 12 never opens, and the Lost Cause cannot be reached.

- **Fix:** Write `zin_afrit.70` to `.76` (06_events/03 Act VIII). Build check: a fired event id must be defined (SL-28).

- **Owner:** Afrit; mechanic events

#### SL-06. The palace never opens on the historical path

- **Status:** fixed on 25 October 2026 (Afrit, Aenor and Eindil pass). zin_eindil_ready_11 reads zin_afrit_holds_parim = yes. Test tools/content/events_mech.test.mjs.

- **Kind:** trigger used as a flag. **Beats:** B41.

- **Where:** tools/content/modules/mech_eindil_scripts.mjs (zin_eindil_ready_11, line 72: gflag('zin_afrit_holds_parim')); staged:common/scripted_triggers/zin_eindil.txt (line 670); staged:common/scripted_triggers/zin_afrit.txt (line 71)

- **Ids:** `zin_eindil_ready_11`, `zin_afrit_holds_parim`

- **Problem:** `zin_afrit_holds_parim` is a scripted trigger in the Afrit slice, but stage 11 tests `has_global_flag = zin_afrit_holds_parim`, a flag nothing sets. The palace starts only when Afrit stands in Parim, never on the historical path where he returns and claims all Aoaz.

- **Fix:** Use `zin_afrit_holds_parim = yes` in `zin_eindil_ready_11`. Build check: a name defined as a scripted trigger may not appear in `has_global_flag` (SL-29).

- **Owner:** Eindil's journey

#### SL-09. A living Afrit who never returns holds the heir for ever

- **Status:** fixed on 25 October 2026 (Afrit, Aenor and Eindil pass). zin_afrit.60 to .62 are written; the Council's month returns an AI seat on zin_afrit_date_return (or 120 days after the south is won) under the historical branch and as soon as the road is open under the free one, fires .61 after the return and forces Parim and .62 on zin_afrit_date_parim; stage 12 opens on zin_afrit_reduced (no Afrit realm in the Middle Lands, the Host's side in Parim, CP24 resolved or its latest date passed, or a year in hiding) and the coronation then sets zin_afrit_beyond_the_rift (Q1). Test tools/content/events_mech.test.mjs.

- **Kind:** no dated fallback; gate can never open. **Beats:** B38, B39, B41, B42.

- **Where:** staged:common/scripted_effects/zin_afrit.txt (zin_afrit_return: one caller, a Worshipdom focus); staged:common/scripted_triggers/zin_afrit.txt (zin_afrit_date_return_open, zin_afrit_date_return, zin_afrit_date_parim: defined, unused); tools/content/modules/mech_eindil_scripts.mjs (zin_eindil_ready_12, line 73)

- **Ids:** `zin_afrit.60`, `zin_afrit.61`, `zin_afrit.62`, `zin_afrit_return`, `zin_eindil_ready_12`, `zin_eindil_afrit_foes_exist`

- **Problem:** Afrit returns only if the Worshipdom takes its focus; the paced return and Parim dates are written and never read. Stage 12 needs `zin_afrit_dead` or no Afrit realm at all, so a living Afrit who never returns (focus skipped, DORMANT, hermitage, a strong King of the East) holds Eindil at stage 9 for ever, and no canon ending can follow.

- **Fix:** Write `zin_afrit.60` to `.62` and read the dates: under the historical branch the AI returns on `zin_afrit_date_return`; `zin_afrit.62` is forced on `zin_afrit_date_parim`. Replace the stage 12 gate with "Afrit dead, or Afrit reduced": no Afrit realm controls a Middle Lands state, the Host and its coalition hold Parim, and CP24 has resolved (diverged or skipped). The coronation then sets `zin_afrit_beyond_the_rift` (owner question Q1).

- **Owner:** Afrit; Eindil's journey

#### SL-10. Afrit outlives the destruction of his realm

- **Status:** fixed on 25 October 2026 (Afrit, Aenor and Eindil pass). on_capitulation, on_annex and the Council's month call zin_afrit_lose_realm: a crowned Afrit takes the flight east, otherwise he goes to the Worshipdom or the eastern client with most footholds, or into hiding (zin_afrit_hidden); every country hears zin_afrit.77 The Hunt for the False God (proposed). Test tools/content/events_mech.test.mjs.

- **Kind:** actor removed without a successor. **Beats:** B38, B41, B42.

- **Where:** staged:common/on_actions/zin_afrit.txt (only on_state_control_changed); staged:common/scripted_triggers/zin_aenor_court.txt (zin_aenor_eindil_can_be_crowned needs zin_afrit_dead)

- **Ids:** `zin_aurevan`, `zin_afrit_dead`, `on_annex`, `on_capitulation`

- **Problem:** If the realm Afrit leads is annexed or capitulates, nothing happens to him: `zin_aurevan` stays, `zin_afrit_dead` is never set, and the coronation is closed for ever.

- **Fix:** New hook in the Afrit slice: on the annexation or capitulation of the realm employing `zin_aurevan`, Afrit flees (the eastern client with the most footholds receives him) or, with no refuge, goes into hiding (`zin_afrit_hidden`, `zin_afrit.77` The Hunt for the False God, proposed). After 365 days of hunting, or his death if found, the reduced-Afrit gate of SL-09 opens.

- **Owner:** Afrit

#### SL-33. The return battles wait without a deadline

- **Status:** fixed on 25 October 2026 (Afrit, Aenor and Eindil pass). battles 1 to 3 are skipped on CP21's latest date (1758.3.1) or a year after the return (zin_eindil_south_unfought), and battle 5 follows by B37's latest date (1758.9.1) at the latest. Test tools/content/events_mech.test.mjs.

- **Kind:** wait without deadline. **Beats:** B32, B33, B34, B37.

- **Where:** tools/content/modules/mech_eindil_scripts.mjs (zin_eindil_battles, battle 1 under the free rule needs the Host near a Volgan-held state)

- **Ids:** `zin_eindil_battles`, `zin_eindil_stage_9_done`

- **Problem:** Under PLAUSIBLE and FREE, battle 1 waits for the Host to stand near Volgan's ground and has no deadline. If Volgan stays in the Ember Lands, stage 9 never finishes and stages 10 to 12 never open.

- **Fix:** When CP21's latest date passes (or 365 days after the return), battles 1 to 3 are skipped (`global.zin_eindil_battle = 3`), CP21 and CP22 resolve diverged, and battle 4 and 5 follow.

- **Owner:** Eindil's journey

### High

#### SL-07. Afrit never sails north

- **Status:** fixed on 25 October 2026 (Afrit, Aenor and Eindil pass). the Council's month sends zin_afrit.31 (CP09) to the seat once after its N8 delay from zin_eindil_named; .32, .33 and .34 are written; under the historical branch an AI seat sails on stage 6 if it has not sailed or sent others. Test tools/content/events_mech.test.mjs.

- **Kind:** event undefined; effect never called. **Beats:** B13, B14, B15.

- **Where:** staged:common/scripted_effects/zin_afrit.txt (zin_afrit_northern_voyage, line 600: no caller); staged:events/zin_eindil.txt (zin_eindil.71 guard); staged:common/scripted_effects/zin_eindil.txt (lines 1073, 1086)

- **Ids:** `zin_afrit.30`, `zin_afrit.31`, `zin_afrit.32`, `zin_afrit.33`, `zin_afrit.34`, `zin_afrit_northern_voyage`, `zin_afrit_hall_at_once`, `zin_afrit_sent_others`, `zin_eindil_let_land`

- **Problem:** Afrit never sails north: the report (`zin_afrit.31`, N8) and the choice (`.32`) are unwritten and `zin_afrit_northern_voyage` has no caller. `zin_afrit_at_yeldenne` is never set, the ambush `.71` never fires, case A is impossible, Afrit is never wounded, and CP09 always diverges. `zin_afrit_hall_at_once`, `zin_afrit_sent_others` and `zin_eindil_let_land` are never set.

- **Fix:** Write `zin_afrit.30` to `.34`. Fallback: the Afrit month calls `zin_afrit_northern_voyage` when `global.zin_eindil_stage = 6` and the hub is AI under `zin_rules_ai_branch_afrit_historical`.

- **Owner:** Afrit; mechanic events

#### SL-08. The flight fallback ignores the default rule

- **Status:** fixed on 25 October 2026 (Afrit, Aenor and Eindil pass). every zin_rule_afrit test in the Afrit slice, the Council's decisions and the Worshipdom tree (130 tests) goes through zin_rules_ai_branch_afrit_*. Test tools/content/events_mech.test.mjs.

- **Kind:** game rule tested directly. **Beats:** B25, B26.

- **Where:** staged:common/scripted_effects/zin_afrit.txt (zin_afrit_historical_fallbacks second block, line 408; zin_afrit_flee_east kneel); tools/content/lib/mech_afrit_script.mjs (lines 713 to 728)

- **Ids:** `zin_afrit_historical_fallbacks`, `zin_afrit_historical_kneel`, `zin_rules_ai_branch_afrit_historical`

- **Problem:** The flight fallback and the historical kneel test `has_game_rule = { rule = zin_rule_afrit option = HISTORICAL }`. The rule's first option is DEFAULT (R1), so with default rules an AI Worshipdom that skips its flight focus never flees and the two kneeling courts are never chosen. The generated wrapper `zin_rules_ai_branch_afrit_historical` exists and is unused (as are the `_ashen`, `_dormant` and `_free` wrappers).

- **Fix:** Replace every direct `zin_rule_afrit` option test with the branch wrappers. Build check: per-power rule options are tested only through `zin_rules_ai_branch_*` (SL-30).

- **Owner:** Afrit

#### SL-11. The Worshipdom tag is hard-coded

- **Status:** fixed on 25 October 2026 (Afrit, Aenor and Eindil pass). zin_afrit_resolve_seat saves zin_afrit_seat (the Worshipdom, else Afrit's employer, else the strongest eastern client); every Afrit effect and zin_aenor_give_seals act on it, the flight releases the Worshipdom from the holder of its capital when it is gone, and the month runs in one carrier (zin_afrit_pulse_here). Test tools/content/events_mech.test.mjs.

- **Kind:** hard-coded tag. **Beats:** B02, B13, B25, B26, B38.

- **Where:** staged:common/scripted_effects/zin_afrit.txt (Y8G in zin_afrit_kneel, zin_afrit_flee_east, zin_afrit_return, zin_afrit_plot_exposed); staged:common/scripted_effects/zin_aenor_court.txt (zin_aenor_give_seals)

- **Ids:** `Y8G`, `zin_afrit_is_hub`

- **Problem:** Every Afrit beat acts on the Worshipdom's tag Y8G. When the Worshipdom no longer exists those blocks do nothing: the flight recruits Aurevan to no country, no court can kneel, the return declares no war.

- **Fix:** Role R02 (Afrit's seat): `zin_afrit_seat` global event target resolved from Y8G, else the country employing `zin_aurevan`, else the strongest eastern client; before the flight, the holder of the Worshipdom's capital releases Y8G (its cores) when Afrit needs a hub. Every `Y8G = { ... }` becomes `event_target:zin_afrit_seat = { ... }`.

- **Owner:** Afrit

#### SL-12. Lorien never rides

- **Kind:** event undefined; effect never called. **Beats:** B36.

- **Where:** staged:common/scripted_effects/zin_sun.txt (zin_sun_lorien_rides, zin_sun_lorien_falls: no caller); staged:common/scripted_effects/zin_mistake.txt (zin_zol_withdraw cause 0)

- **Ids:** `zin_mistake.22`, `zin_mistake.23`, `zin_sun_lorien_rides`, `zin_sun_lorien_falls`, `zin_sun.40`, `zin_sun.42`

- **Problem:** Lorien never rides and never dies: the two Zol events that call the Sun effects are unwritten. `zin_lorien_dead` is never set, CP23 can never be historical, and the withdrawal always takes its "form spent" cause.

- **Fix:** Write `zin_mistake.22` and `.23` as Kusven's events (SL-14).

- **Owner:** Zol's Mistake; mechanic events

#### SL-13. The blue sword never breaks

- **Kind:** flag never set. **Beats:** B35.

- **Where:** staged:common/scripted_effects/zin_eindil.txt, staged:common/scripted_effects/zin_glo.txt (readers); tools/content/lib/mech_zol_script.mjs (zin_zol_manifest)

- **Ids:** `zin_mistake.21`, `zin_horos_sword_broken`, `zin_eindil.101`

- **Problem:** The sword-break (O4: `zin_mistake.21` sets `zin_horos_sword_broken`) is unwritten. Glo's cap never drops to 50, the shard wound never happens, and with Glo the heir's wound (`zin_eindil.101`) is never fired.

- **Fix:** Write `zin_mistake.21` as Kusven breaking the blue sword; it sets `zin_horos_sword_broken` and `zin_kusven_wounded` and fires `zin_eindil.101`.

- **Owner:** Zol's Mistake; mechanic events

#### SL-14. Zol in person, against the owner corrections

- **Kind:** Zol-in-person content void (K4, K11). **Beats:** B35, B36.

- **Where:** tools/content/data/mech_zol.json (ideas zin_zol_form_taken, zin_zol_wounded; decision zin_zol_come_forth); tools/content/lib/mech_zol_script.mjs (zin_zol_manifest, zin_zol_withdraw, template "The Presence"); tools/content/data/events_world_eindil_3.json (zin_eindil.101 "The Old God Comes Forth"); tools/content/data/events_world_lastwar.json (zin_lastwar.73 "an Old God's victory"); tools/content/data/events_crown_chronicle.json (cp23 lines); docs/specs/04_mechanics/00_shared_contract.md (zin_zol_manifested "Zol has manifested bodily"); docs/specs/06_events/03_war_of_the_last_crowns.md (zin_mistake.20 to .25); docs/specs/03_gameplay/05_world_tension_and_endings.md (Zol manifests, Zol withdraws)

- **Ids:** `zin_zol_manifested`, `zin_zol_withdrawn`, `zin_zol_manifest`, `zin_zol_withdraw`, `zin_zol_can_manifest`, `zin_zol_form_taken`, `zin_zol_wounded`, `zin_zol_come_forth`, `zin_eindil.101`, `zin_lastwar.73`, `zin_chronicle_cp23_1`, `zin_chronicle_cp23_2`

- **Problem:** The owner corrected the canon on 24 October 2026: Zol does not appear in the war; Kusven (formerly Edvoid), his most loyal servant and a Great Spirit, breaks the blue sword, is wounded by Eindil with a shard and withdraws when Lorien and ancient spirits die. The data still has the Old God taking a shape, a "Wounded, Not Slain" Zol, a decision that sends Zol himself, a news title "The Old God Comes Forth", Chronicle lines "The Old God came forth", and a contract flag that says Zol manifested bodily.

- **Fix:** Re-design as Kusven (section 9): flags `zin_kusven_forth`, `zin_kusven_withdrawn`, `zin_kusven_wounded`; character `zin_kusven` (Zol's field marshal, unit leader only; no country leader role, S4 stands); effects `zin_zol_send_kusven`, `zin_kusven_withdraw`; trigger `zin_kusven_can_come_forth`; ideas `zin_zol_kusven_in_field`, `zin_zol_kusven_wounded`; template "Kusven's Host"; retire the old names in the N16 retired list so `checks/names.mjs` fails on them. Text: "Kusven, Zol's most loyal servant"; "Zol's victory" where the stake is named.

- **Owner:** Zol's Mistake; events; contract

#### SL-16. Volgan's narrative and its option effects are missing

- **Kind:** events undefined; effects never called. **Beats:** B22, B23, B33, B34.

- **Where:** staged:common/scripted_effects/zin_dominion.txt, zin_dominion_pulse.txt; docs/design/stage2/mech_powers.md (section "Hooks for the events slice")

- **Ids:** `zin_dominion.10`, `zin_dominion.11`, `zin_dominion.12`, `zin_dominion.13`, `zin_dominion.16`, `zin_dominion.17`, `zin_dominion.18`, `zin_dominion.19`, `zin_dominion.23`, `zin_dominion.24`, `zin_dominion_champion_falls`

- **Problem:** Volgan's narrative is unwritten. Flags are set by effects, so the chain advances, but the options that should call `zin_dominion_champion_falls`, `zin_dominion_member_breaks_free`, `zin_dominion_hold_mirolon` and the Steward's Choice never run: no successor is chosen after the body breaks and Mirolon's court in exile never forms.

- **Fix:** Write the Volgan events listed in mech_powers.md with the option effects named there.

- **Owner:** Volgan; mechanic events

#### SL-17. Lerendor waits on a flag that never comes

- **Kind:** gate on an unset flag; flag name mismatch. **Beats:** B19, B20.

- **Where:** tools/content/modules/mech_lerendor.mjs (lines 396, 408: has_global_flag = { flag = zin_war_of_last_crowns days > N }); staged:common/scripted_effects/zin_west.txt (reads zin_leren_treaty_in_force, zin_leren_honours_treaty); staged:common/scripted_effects/zin_leren.txt (sets zin_leren_treaty_honoured)

- **Ids:** `zin_leren.30`, `zin_leren.31`, `zin_leren.32`, `zin_leren.33`, `zin_leren.35`, `zin_leren.36`, `zin_leren_treaty_in_force`, `zin_leren_honours_treaty`, `zin_leren_treaty_honoured`

- **Problem:** Lerendor's decision prompts and AI fallback wait a number of days after a flag that is never set (SL-01) and the decision events are unwritten; the West reads two treaty flags that Lerendor never sets (it sets `zin_leren_treaty_honoured`), so the West never sees an honoured treaty.

- **Fix:** Write the Lerendor events; the West reads `zin_leren_treaty_honoured` and a new trigger `zin_leren_treaty_in_force` (treaty neither withdrawn nor ended).

- **Owner:** Lerendor; Western Crossing

#### SL-25. A conquered Golden King never dies and still endures

- **Status:** fixed on 25 October 2026 (Afrit, Aenor and Eindil pass). on_capitulation and on_annex of the original Aenor with the King alive call zin_aenor_exile_king (zin_golden_king_exiled, news zin_aenor.470, proposed); the clock sets zin_golden_king_natural when the King dies with no Council left; the Chronicle's line 05 and the Golden Court outcome read both. Open: zin_realm.50 (the realm-life module) and the endings' outcome 4 reader (story framework). Test tools/content/events_mech.test.mjs.

- **Kind:** actor removed without a successor. **Beats:** B02, B07, B45.

- **Where:** staged:common/scripted_triggers/zin_aenor_court.txt (zin_aenor_king_alive = not zin_golden_king_dead); docs/specs/03_gameplay/05_world_tension_and_endings.md (outcome 4)

- **Ids:** `zin_golden_king_dead`, `zin_ending_golden_court`

- **Problem:** The King dies only through Aenor's clock. If Aenor is annexed with him alive he never dies, and the Golden Court Endures (which holds when `zin_golden_king_dead` is not set) would crown a conquered court.

- **Fix:** On annexation or capitulation of Y0L before the death: `zin_golden_king_exiled`, `zin_realm.50` to his host; outcome 4 requires an Aenor realm controlling Parim with the King or the Regency of Gold ruling.

- **Owner:** Aenor; world systems

#### SL-28. Sixty-one fired events are undefined

- **Status:** fixed for zin_afrit and zin_aenor on 25 October 2026 (Afrit, Aenor and Eindil pass). events_mech.mjs writes zin_afrit.10, .11, .14 to .17, .20 to .23, .31 to .34, .43, .45, .51 to .53, .60 to .62, .70 to .77 and zin_aenor.470; no zin_afrit, zin_aenor or zin_eindil event is fired and undefined in the staged tree. The other namespaces are the war-side pass's. Test tools/content/events_mech.test.mjs.

- **Kind:** events fired but undefined. **Beats:** many.

- **Where:** staged:common/scripted_effects/* and staged:events/* (61 ids)

- **Ids:** `zin_afrit.11`, `.14`, `.15`, `.16`, `.17`, `.20`, `.21`, `.22`, `.23`, `.32`, `.33`, `.34`, `.43`, `.45`, `.51`, `.52`, `.53`, `.70`, `.72`, `.73`, `.74`, `.75`, `.76`, `zin_mistake.2`, `.10`, `.11`, `.20`, `.24`, `.25`, `zin_dominion.10`, `.11`, `.12`, `.13`, `.14`, `.16`, `.17`, `.18`, `.19`, `.23`, `.24`, `zin_leren.30`, `.31`, `.32`, `.33`, `.35`, `.36`, `.45`, `zin_east.42`, `.45`, `.51`, `.60`, `zin_elves.9`, `.51`, `.70`, `.71`, `zin_sun.40`, `.42`, `zin_dark.80`, `zin_diplo.23`, `.31`, `zin_world.45`

- **Problem:** The mechanic slices fire the narrative events of 06_events and expect "the events slice" to write them; no module owns them. Each firing logs an error and does nothing; where the option or immediate block carries the beat's effect (SL-04, SL-05, SL-07, SL-12, SL-13, SL-15, SL-16) the chain hangs or silently diverges. The build stopped on 50 dangling names on 24 October 2026 at 11:43 (`%TEMP%/zin-build0.err`).

- **Fix:** New module `tools/content/modules/events_mech.mjs` with one data file per namespace; build check `checks/story_wiring.mjs`: every fired id is defined.

- **Owner:** mechanic events (new)

### Medium

#### SL-15. The Black Compact is never offered

- **Kind:** event undefined; flag never set. **Beats:** B31.

- **Where:** staged:common/scripted_effects/zin_dominion.txt (fires zin_dominion.14); staged:common/national_focus/zin_volgan.txt, zin_zol.txt, staged:common/scripted_effects/zin_lastwar_story.txt (read zin_black_compact)

- **Ids:** `zin_dominion.14`, `zin_mistake.16`, `zin_dominion.15`, `zin_black_compact`

- **Problem:** The Black Compact is offered by an unwritten event, so `zin_black_compact` is never set; the focuses and lastwar entries that read it never run.

- **Fix:** Write `zin_dominion.14`, `zin_mistake.16` (Zol's answer, by the Will of Zol emblem), `zin_dominion.15`.

- **Owner:** Volgan; mechanic events

#### SL-18. The denunciation sets the wrong kind of flag

- **Status:** fixed on 25 October 2026 (Afrit, Aenor and Eindil pass). zin_eindil.82 Denounce and hunt and the Aenor focus Denounce the Impostor set the global flag as well as the country flag. Test tools/content/events_mech.test.mjs.

- **Kind:** flag scope mismatch. **Beats:** B16.

- **Where:** staged:events/zin_eindil.txt (line 2769); staged:common/national_focus/zin_aenor.txt (line 2663); docs/specs/03_gameplay/06_historical_path_and_ai.md (CP10)

- **Ids:** `zin_aenor_eindil_denounced`

- **Problem:** CP10 resolves on the global flag `zin_aenor_eindil_denounced`; the journey and the Aenor tree set a country flag of that name.

- **Fix:** Set the global flag as well (keep the country flag for the realm's own triggers); the path reads the global one.

- **Owner:** Eindil's journey; Aenor tree

#### SL-19. A Western Crown in Parim can never hold

- **Kind:** flag never set. **Beats:** B27, B45.

- **Where:** staged:common/scripted_localisation/zin_ending.txt; docs/specs/03_gameplay/05_world_tension_and_endings.md (outcome 5)

- **Ids:** `zin_west_holds_parim`

- **Problem:** A Western Crown in Parim holds on `zin_west_holds_parim`, which nothing sets (the West sets `zin_west_parim_taken` and `zin_west_throne_claimed`).

- **Fix:** Make it a scripted trigger in the Western Crossing slice: a West Lands country (or its subject) controls `zin_is_site_parim` and `zin_west_throne_claimed` is set or no Aenor realm exists.

- **Owner:** Western Crossing

#### SL-21. Afrit never learns he has a brother

- **Status:** fixed on 25 October 2026 (Afrit, Aenor and Eindil pass). zin_afrit_knows_brother is set by zin_afrit.31, the voyage, zin_afrit_wound (the hall cases in which Afrit meets him) and zin_afrit.61. Test tools/content/events_mech.test.mjs.

- **Kind:** flag never set. **Beats:** B15, B39.

- **Where:** staged:common/national_focus/zin_worshipdom.txt (lines 2399, 2430, 2462, 2720)

- **Ids:** `zin_afrit_knows_brother`

- **Problem:** Four Worshipdom focus blocks test `zin_afrit_knows_brother`, which nothing sets; Horos exposing Afrit's origin in the hall (established) never reaches the tree.

- **Fix:** Set it in `zin_glo_afrit_strikes` (cases A, B1, C) and in `zin_afrit.61`.

- **Owner:** Yeldenne and Glo; Afrit

#### SL-23. Story roles are fixed to tags

- **Kind:** role holder hard-coded. **Beats:** B05, B19, B20, B21, B22, B26, B28.

- **Where:** tools/content/data/mech_afrit.json, mech_journey_west.json, mech_powers_*.json (country names resolved to fixed tags)

- **Ids:** `Gunwaith`, `Girdon`, `Lerendor`, `Mirolon`, `Selen`, `Gala Elves`, `Yeldenne`

- **Problem:** Story roles are fixed to tags; most slices skip a beat when the tag is gone, some silently (no successor realm takes the role).

- **Fix:** The role registry of section 8 (R01 to R17) resolves every role at fire time and fires `zin_realm.80` when a role passes.

- **Owner:** historical path

#### SL-24. Hirolon starts as a dominion

- **Kind:** start state contradicts canon (K13). **Beats:** B01, B08.

- **Where:** tools/content/data/countries.json (row Y0Q "Hiloron", overlord "Aenor"); tools/content/data/mech_afrit.json (footholdRows: overlord Aenor, not men, start 1)

- **Ids:** `Y0Q`, `zin_aenor_is_concord_dominion`

- **Problem:** Hirolon is a sovereign giant kingdom (K13), but the country table makes it Aenor's subject, so every Concord loop (`zin_reign.24`, `.42`, secession) treats it as a chartered dominion.

- **Fix:** The politics step writes Hirolon without an overlord (spelling Hirolon, former label Hiloron) and the foothold row follows; the Concord tests exclude it.

- **Owner:** politics step; Aenor

#### SL-26. The crown can be withheld for ever

- **Kind:** wait without deadline. **Beats:** B42.

- **Where:** staged:common/scripted_effects/zin_eindil.txt (zin_eindil_go_to_parim, zin_eindil_found_parim_realm)

- **Ids:** `zin_eindil.132`, `zin_eindil_crowning_realm`

- **Problem:** With no Aenor realm and Parim held by an enemy, The Crown Withheld retries every 30 days without end; nothing judges the age.

- **Fix:** The judgement date (SL-03) ends the wait; while the heir is at stage 12 the judgement is deferred two years (endings).

- **Owner:** Eindil's journey; world systems

#### SL-27. Zol's identity uses tag, not original_tag

- **Kind:** semantic mismatch. **Beats:** B33, B34, B35, B42.

- **Where:** staged:common/scripted_triggers/zin_mistake.txt (zin_is_zol = tag Y0U); other identity triggers use original_tag

- **Ids:** `zin_is_zol`

- **Problem:** Zol's identity uses `tag`, every other power `original_tag`; a civil-war copy of Zol's realm is not Zol to the war and ending checks.

- **Fix:** `original_tag = Y0U`.

- **Owner:** Zol's Mistake

#### SL-29. No build check for story wiring

- **Kind:** no wiring check. **Beats:** all.

- **Where:** tools/content/checks/ (no story wiring check)

- **Ids:** `has_global_flag`, `scripted trigger names`

- **Problem:** Nothing fails the build on a global flag read and never set, a scripted trigger tested as a flag (SL-06), or a country flag read as global (SL-18, SL-20). 25 global flags are read and never set in the staged tree.

- **Fix:** `checks/story_wiring.mjs`: read-never-set flags fail unless listed in an allowance with the owner that will set them; trigger-as-flag and scope mismatches always fail.

- **Owner:** builder checks

#### SL-30. Per-power rules bypass their wrappers

- **Status:** fixed for the Aenor succession 25 October 2026 (Afrit, Aenor and Eindil pass): zin_aenor_pick_ai_camp reads zin_rules_ai_branch_aenor_golden_court, _free_dominions and zin_rules_ai_random_aenor. Test tools/content/events_mech.test.mjs.

- **Kind:** rule wrappers unused. **Beats:** B08, B21, B25.

- **Where:** staged:common/scripted_triggers/zin_rules.txt (zin_rules_ai_branch_aenor_golden_court, _free_dominions, zin_rules_ai_random_aenor, zin_rules_ai_branch_cold_conquest: unused)

- **Ids:** `zin_rule_ai_aenor_succession`, `zin_rule_cold_isengard`, `zin_rule_afrit`

- **Problem:** Owners test per-power options directly, so DEFAULT does not follow the path rule everywhere (R1).

- **Fix:** Same build check as SL-08.

- **Owner:** Aenor; Cold Lands; Afrit

#### SL-31. The King can both survive and die

- **Status:** fixed on 25 October 2026 (Afrit, Aenor and Eindil pass). zin_afrit_add_plot does nothing once zin_golden_king_survives is set. The generic mortality that may still end a surviving King belongs to the realm-life module. Test tools/content/events_mech.test.mjs.

- **Kind:** mutually exclusive outcomes both reachable. **Beats:** B07.

- **Where:** staged:common/scripted_effects/zin_afrit.txt (zin_afrit_plot_exposed resets the plot to 0; zin_afrit_add_plot can raise it again)

- **Ids:** `zin_golden_king_survives`, `zin_golden_king_dead`

- **Problem:** After the King survives the Council's War the plot can grow again, so `zin_golden_king_survives` and `zin_golden_king_dead` can both be set (contract flags are never cleared) and the Chronicle and outcome 4 disagree.

- **Fix:** After `zin_golden_king_survives`, `zin_afrit_add_plot` does nothing; the King dies only of the generic mortality of section 8 (with `zin_golden_king_natural`).

- **Owner:** Afrit; Aenor

#### SL-32. Afrit can both stand in Parim and flee

- **Status:** fixed on 25 October 2026 (Afrit, Aenor and Eindil pass). zin_afrit_flee_east does nothing after the stand in Parim, and the focus Parim Shall Not Fall needs zin_afrit_abandoned_aenor unset. Test tools/content/events_mech.test.mjs.

- **Kind:** mutually exclusive outcomes both reachable. **Beats:** B25.

- **Where:** staged:common/national_focus/zin_worshipdom.txt (sets zin_afrit_stand_in_parim); staged:common/scripted_effects/zin_afrit.txt (zin_afrit_flee_east)

- **Ids:** `zin_afrit_stand_in_parim`, `zin_afrit_abandoned_aenor`

- **Problem:** Nothing stops the stand-in focus after the flight or the flight after the stand-in, so the palace gate (stand-in) and the eastern return (flight) can both be live.

- **Fix:** The stand-in focus requires `NOT = { has_global_flag = zin_afrit_abandoned_aenor }`; the flight requires the stand-in unset (the fallback already does).

- **Owner:** Worshipdom tree; Afrit

#### SL-34. Volgan's march has no catch-up

- **Kind:** no dated fallback. **Beats:** B23.

- **Where:** staged:common/national_focus/zin_volgan.txt (only caller of zin_volgan_begin_march)

- **Ids:** `zin_volgan_begin_march`, `zin_volgan_marches`

- **Problem:** The march north starts only from Volgan's focus; an AI that misses it under HISTORICAL never marches.

- **Fix:** Under the historical branch the Dominion pulse calls `zin_volgan_begin_march` 30 days after `zin_mirolon_fallen` if it has not run.

- **Owner:** Volgan

#### SL-37. The league without the heir is never told

- **Status:** fixed on 25 October 2026 (Afrit, Aenor and Eindil pass). zin_eindil_lose_heir calls zin_ending_heir_lost, and zin_eindil.140 no longer fires the league event itself. Test tools/content/events_mech.test.mjs.

- **Kind:** effect never called. **Beats:** B33, B41.

- **Where:** staged:common/scripted_effects/zin_ending.txt (zin_ending_heir_lost: no caller); docs/design/stage2/events_crown.md section 4

- **Ids:** `zin_ending_heir_lost`, `zin_ending.80`, `zin_eindil.140`

- **Problem:** `zin_eindil_lose_heir` fires the news `.140` but never calls `zin_ending_heir_lost`, so The League Without the Heir (`zin_ending.80`) never reaches the right realm.

- **Fix:** `zin_eindil_lose_heir` calls `zin_ending_heir_lost`.

- **Owner:** Eindil's journey

### Low

#### SL-20. Focus flags read in the wrong scope

- **Status:** fixed on 25 October 2026 (Afrit, Aenor and Eindil pass). the journey reads zin_gala_great_ship, zin_worshipdom_ships_ready and zin_worshipdom_hunters as any_country = { has_country_flag = ... }. Test tools/content/events_mech.test.mjs.

- **Kind:** flag scope mismatch. **Beats:** B12, B14.

- **Where:** staged:common/national_focus/zin_gala.txt (line 569), staged:common/scripted_triggers/zin_eindil.txt (line 623); staged:common/national_focus/zin_worshipdom.txt (lines 2410, 2473), staged:common/scripted_effects/zin_eindil.txt (lines 1041, 1045)

- **Ids:** `zin_gala_great_ship`, `zin_worshipdom_ships_ready`, `zin_worshipdom_hunters`

- **Problem:** Set as country flags by focuses, read as global flags by the journey: the great ship never shortens the voyage and the two ambush terms never count (N9).

- **Fix:** Read them as `any_country = { has_country_flag = ... }` (or set global flags in the focuses).

- **Owner:** Eindil's journey

#### SL-22. The pass accord flags are never set

- **Kind:** flag never set. **Beats:** B21.

- **Where:** staged:common/national_focus/zin_regional_kingson.txt, zin_magical_forest.txt; staged:common/scripted_effects/zin_economy.txt, zin_elves.txt; staged:events/zin_elves.txt

- **Ids:** `zin_wall_accord`, `zin_wall_accord_broken`

- **Problem:** The Wall Accord flags are read and never set. Under K2 the Wall is a natural range, so the accord is the pass accord (the Accord of the Passes of 4A 96, proposed).

- **Fix:** The diplomacy slice sets `zin_wall_accord` at start (pass accord in force) and `zin_wall_accord_broken` when a pass is taken by force.

- **Owner:** diplomacy; elves

#### SL-35. The naming without Lorien is silent

- **Status:** fixed on 25 October 2026 (Afrit, Aenor and Eindil pass). the naming fallback sends the news zin_eindil.170 The Mirror Without Its King (a variant for Lorien's death). Test tools/content/events_mech.test.mjs.

- **Kind:** missing successor text. **Beats:** B12.

- **Where:** tools/content/modules/mech_eindil_scripts.mjs (naming fallback, line 577)

- **Ids:** `zin_eindil_name_him`, `zin_eindil.170`

- **Problem:** When Lorien is dead or Gala is gone the fallback names Eindil silently; no event tells the world who named him.

- **Fix:** New `zin_eindil.170` The Mirror Without Its King (reserved range 170 to 199).

- **Owner:** Eindil's journey

#### SL-36. Old names and an Old God's victory remain

- **Kind:** text contradicts canon. **Beats:** B35.

- **Where:** staged:localisation/english/zin_sun_l_english.yml (zin_sun_old_powers_stand_3_desc); tools/content/data/countries.json (Zol row scan "Kusmeel", regions "Kusven's Mistake")

- **Ids:** `zin_sun_old_powers_stand_3`, `Kusmeel`

- **Problem:** Remaining Edvoid labels and "an Old God's victory" phrasing; the sea north of Zol's Mistake is Kusmeel and the region name Edvoid's Mistake is superseded.

- **Fix:** Rename with the K7/K11 migration; text says "Zol's victory".

- **Owner:** names migration

## 6. The divergence measure

The measure says how far a game has moved from the historical direction. It is shown to the player in the Chronicle of the Age, read by the AI, and read by the endings.

| Variable | Scope | Range | Meaning |
| --- | --- | --- | --- |
| `zin_path_cpNN` | global | 0 to 3 | checkpoint state: 0 pending, 1 historical, 2 diverged, 3 skipped (06 spec) |
| `zin_path_cpNN_way` | global | code | which divergence resolved the checkpoint (the divergence index of the beat, for the Chronicle and the endings) |
| `zin_path_cpNN_m` | global | 0 to 1 | magnitude of the resolution (largest magnitude among the checkpoint's beats) |
| `zin_path_points` | global | 0 to 93 | sum of weight x magnitude over resolved checkpoints |
| `zin_path_resolved_weight` | global | 0 to 93 | sum of the weights of resolved checkpoints |
| `zin_path_divergence` | global | 0 to 100 | how far the resolved story has left history (contract name; read by the AI weights and events_world.mjs) |
| `zin_path_departure` | global | 0 to 100 | how much of the whole age has been rewritten (fixed denominator; only rises) |
| `zin_path_band` | global | 0 to 3 | band of zin_path_divergence for text and AI |

**Weights** are the checkpoint weights of the 06 spec (total 93); a beat counts through its checkpoint, and a checkpoint takes the largest magnitude among its beats' resolutions.

| CP | Weight | Beats |
| --- | --- | --- |
| CP01 | 0 | B01 |
| CP02 | 2 | B03 |
| CP03 | 1 | B05 |
| CP04 | 2 | B04, B06 |
| CP05 | 5 | B02, B07 |
| CP06 | 5 | B08, B09, B10 |
| CP07 | 1 | B11 |
| CP08 | 3 | B12 |
| CP09 | 5 | B13, B14, B15 |
| CP10 | 3 | B16 |
| CP11 | 5 | B18 |
| CP12 | 3 | B19 |
| CP13 | 4 | B20 |
| CP14 | 3 | B21 |
| CP15 | 5 | B22, B23 |
| CP16 | 4 | B24 |
| CP17 | 4 | B25, B26 |
| CP18 | 2 | B27, B28 |
| CP19 | 5 | B17, B29, B30 |
| CP20 | 3 | B31, B32 |
| CP21 | 4 | B33 |
| CP22 | 5 | B34 |
| CP23 | 5 | B35, B36 |
| CP24 | 4 | B38, B39, B40 |
| CP25 | 5 | B41 |
| CP26 | 5 | B37, B42 |

**Formula.**

- On each resolution: m = the resolving divergence's magnitude (0 when historical; 0.5 when skipped, because the cause was counted where it happened).

- zin_path_points += w x m; zin_path_resolved_weight += w (w from the checkpoint weight table).

- zin_path_divergence = 100 x zin_path_points / max(zin_path_resolved_weight, constant:zin_path.floor_weight) with floor_weight 30, clamped 0 to 100: early divergences do not swing the meter to 100.

- zin_path_departure = 100 x zin_path_points / constant:zin_path.total_weight (93).

- Bands: 0 to 9 As the Chronicle Tells (0), 10 to 29 Another Telling (1), 30 to 59 A Different Age (2), 60 to 100 An Age Unwritten (3).

**Script.** `zin_path_resolve` (path module) takes `zin_arg_cp`, `zin_arg_state` and `zin_arg_way` (E1); the magnitude comes from `constant:zin_path_magnitude.<kind>` and the weight from `constant:zin_path_weight.cpNN` in `common/script_constants/zin_path.txt`, so tuning happens in one place. The divisions use temporary variables (`set_temp_variable`, `divide_temp_variable`) and the result is clamped with `clamp_variable`.

**Uses.**

- Chronicle: `zin_world.110` gains the line `zin_loc_chronicle_divergence` ("Of the age the chroniclers foretold, [?global.zin_path_departure|0] parts in a hundred were written otherwise.") and the band name; the Aoaz bar tooltip shows the band once CP05 has resolved.

- AI under PLAUSIBLE: the historical favour (x3, or 75/25 in events) drops to x1.5 (60/40) when `zin_path_divergence` is 50 or more (06 spec; `zin_story_rules_plausible_diverged` already reads it).

- AI eras (forces.mjs): `zin_ai_era_stirring` reads CP05 resolved, not the value 0; a band of 2 or more lets tier B AI justify freely from Gathering Dark 35.

- Catch-ups: owners' historical fallbacks run only while `zin_path_band` is 0 or 1 under PLAUSIBLE (under HISTORICAL always, under FREE never).

- Elves: the Kindred March AI gate needs `zin_path_divergence` 50 or more (B21 D3).

- Endings: the proposed outcomes are judged on 1 Glernaen 4A 1762 only when `zin_path_departure` is 15 or more or no canon ending is in reach; otherwise judgement is deferred to 1764 (endings section).

## 7. Game-start variety

The rule `zin_rule_start_variety` ("The Shape of the Age", group `RULE_GROUP_ZIN`) varies the start within the lore and can be switched off for a historical game. Its first option, DEFAULT, follows the path rule as every per-power rule does (R1): off under As the Chronicle Tells, light under As It Might Have Been, full under As Each Court Wills.

| Option | Name | Description |
| --- | --- | --- |
| DEFAULT | Follow the Course of the Age | Off under As the Chronicle Tells, light under As It Might Have Been, full under As Each Court Wills. |
| OFF | As the Chronicle Tells | Every realm begins exactly as the chronicle remembers it. |
| LIGHT | Small Differences | Rulers' tempers, the readiness of old plots and the strength of hosts differ a little. |
| FULL | Another Spring | Disputed lands, small feuds and loose bonds between crowns may also differ. |

**Invariants that no option may break** (the owner's start of 18 October 2026):

- The Golden King reigns on 1 Lumae 4A 1748.

- Eindil has not appeared and `zin_eindil` is recruited by nobody.

- Afrit is unrevealed; no variety text names him.

- No war between realms that matter: no great power at war, no faction changes, the seven start factions stand.

- No canon figure changes: Lorien, Horos, Volgan, the Will of Zol, the Golden King's vices, Alleria, Varner and Golbran.

- Every drawn value stays inside the owner's documented range and the owning mechanic's start value (V1) is the midpoint.

All draws happen once in `on_startup` (which runs once, not per country) after the story pace is set, through `start_variety.mjs`; each draw is a `random_list` over values the owner's data documents, and `zin_start_variety_drawn` records that a draw happened. Under OFF nothing runs and every value is the owning mechanic's start value (V1).

| Id | Level | Option | What varies | Beats affected | Owner |
| --- | --- | --- | --- | --- | --- |
| V1 | LIGHT | The Golden King's health | Aenor death clock offset -180 to +180 days (never past the floor); one of three court tempers as a hidden country flag (`zin_gk_temper_gilded`, `_restless`, `_fearful`) that weights `zin_reign` options. | B07 | Aenor |
| V2 | LIGHT | The Council's readiness | Regicide plot start 10 to 35 (start 20), veil 70 to 90 (start 80). | B02, B07, B25 | Afrit |
| V3 | LIGHT | The succession field | Camp support at the King's death shifted -10 to +10 per camp; Prince Eronel's standing (`zin_aenor_eronel_favour` 0 to 2). | B08, B09 | Aenor |
| V4 | LIGHT | Rulers' tempers | Tier A and B rulers that are not canon figures draw 0 or 1 temper trait from `zin_trait_temper_*` (eight proposed traits: bold, cautious, pious, grasping, scholarly, vengeful, generous, weary). | B05, B19, B20, B21 | characters |
| V5 | LIGHT | The strength of the dark | Volgan's strength 40 to 50 (45), Zol's power 30 to 40 (35), the Gathering Dark start 8 to 12 (10). | B22, B23, B24, B35 | Volgan; Zol; world |
| V6 | FULL | Small feuds | At most two border feuds (`start_border_war`, ended by 90 days) between tier C realms with a documented grudge: orc holds of the Dark Lands, Triton island lordships, the Troll Forest and its neighbours. | B01 | start_variety.mjs |
| V7 | LIGHT | The Grey Ford truce | Truce start 30 to 50 (40); western unity 10 to 20 (15). | B05, B06, B20 | Western Crossing |
| V8 | FULL | Disputed lands | For each pair one contested state may start with the other claimant (both keep cores or claims): Gunwaith and Girdon (the ford lands), Coldor and Isengard (a March Fort), Noris and Stabilo (a caravan town), Goldoroth and Dondor (a border hold), Herrodon and Andos Enda (a grove), Lerendor and R'en (a strait cape). | B04, B05, B19, B21 | start_variety.mjs (state transfers on startup) |
| V9 | FULL | Loose bonds | At most one of: a Leren marriage courting Andos Enda (opinion +25; S5 still keeps it outside the Compact), a Stabilo guarantee of Alerhia, a Coldor pact with Titanos. | B19, B21 | realm life (marriages) |
| V10 | LIGHT | The Deliverer's network | Footholds +1 in two random eastern candidates and -1 in two others, within each country's cap (zero caps stay zero). | B21, B26, B44 | Afrit |
| V11 | LIGHT | Mirolon's watch | Mirolon passes readiness and proof -10 to +10. | B22 | Volgan |
| V12 | LIGHT | Lerendor's grievance | `zin_strait_standing` start -15 to +15. | B19 | Lerendor |
| V13 | LIGHT | The waking | Under `zin_rule_eindil_waking = HISTORICAL` only: wake jitter widened from 0 to 20 days to 0 to 60 days. | B03 | Eindil's journey |

Effects on the beats: V1 to V3 move B02, B07 and B08 inside their windows (the floors stay); V5 moves the southern and northern fronts inside CP15 and CP16; V7, V8 and V12 change which western and northern routes the AI prefers (B05, B19, B20); V10 changes which eastern courts kneel (B26). No variety option can make a checkpoint resolve before its target window opens, because every owner's floor date still applies.

## 8. Dynamic succession, crises and diplomacy for all countries

When the story leaves its road, the realms around it must keep living: rulers age and die, heirs come of age or rule through regents, crowns fall into crisis, captains reach for power, subjects rebel, wars end, houses marry, raiders ride. These are generic systems in a new namespace `zin_realm`, owned by `tools/content/modules/realm_life.mjs`; every realm uses them, and the story owners keep their own moments.

| Id | System | How it works | Exempt | AI, historical | AI, plausible and free |
| --- | --- | --- | --- | --- | --- |
| G1 | Rulers' years | Each country's ruler has a hidden `zin_ruler_vigour` (0 to 100) that falls each pulse by a people rate (men 1, orcs and goblins 1.3, dwarves 0.6, giants 0.5, elves 0.05) and by war losses; at 0, or by a small chance below 20, the ruler dies (`kill_country_leader`) and G2 runs. | Canon figures and story rulers (`zin_realm_is_story_ruler`): the Golden King while the clock runs, Aurevan, Lorien, Volgan, Horos, the Will of Zol, the Warden of Yeldenne, the King of Demons, every `zin_trait_ancient_king`. | Tier A rulers never die of age; tier B and C do. | All but the exempt. |
| G2 | Heirs and regencies | Tier A and B countries start with a designated heir (pre-built characters `<TAG>_zin_heir`, names from the country's language, flag `zin_char_heir`); tier C heirs are made with `generate_character` (token base `zin_heir`, verify in the Linux run). Adult heir: `zin_realm.10` The Crown Passes. Child heir: `zin_realm.11` A Child on the Throne, timed idea `zin_realm_regency` (two to five years), a regent advisor. No heir: `zin_realm.12` No Heir of the Body (G3). | As G1. | Heirs succeed quietly; no crisis in tier A. | Crises allowed everywhere. |
| G3 | Succession crises | `zin_realm.12` and `.13` The Claimants: candidates from the ruling party, a strong general or advisor, and a married foreign house (G7). Outcomes: a council election (elves, democratic realms), a contested crown (`start_civil_war` when the realm has at least `constant:zin_realm.crisis_min_states` states and the tag budget S12 allows), or a neighbour's candidate (puppet). `zin_realm.15` The Crisis Settled. | Story realms while their beat is pending (Aenor before CP06, the Worshipdom, Volgan, Zol, Gala before CP23, Selen while it hosts Eindil). | Off for tier A; tier B by election only. | All outcomes by situation. |
| G4 | Usurpation | Stability below 25 and a general or advisor with `zin_char_ambitious`: `zin_realm.20` A Captain's Ambition; the coup uses the institutions' Raise the Captains operation (`operation_coup_government`) for foreign plots; `zin_realm.21` The Usurper Crowned, `.22` The Usurper Fails. | Story realms while their beat is pending. | Off. | On. |
| G5 | Rebellions and secessions | A subject with overlord opinion below -25 while the overlord is at war: `zin_realm.30` The Subject Stirs (break free, demand autonomy, stay); occupied cores with resistance above 50: `zin_realm.31` A Rising in Occupied Lands, ended by `.32`. The Concord's own secession (`zin_aenor_secede_dominion`) and the Dominion's `zin_dominion_member_breaks_free` are the model. | Eastern clients of the Dominion of the East before `zin_afrit_dead` (their autonomy rule decides). | Risings only in occupied cores. | On. |
| G6 | Peace deals | After 12 months without a war goal moving: `zin_realm.40` Terms Offered (white peace, a claimed state, tribute); a war whose target or cause is gone: `zin_realm.42` War Without Purpose (white peace). After `zin_afrit_dead` every AI still at war only because of Afrit's realm accepts white peace (06 spec). | Wars started by a story owner keep their own peace (Terms on the Shore, the Steward's peace, Kusven's withdrawal). | AI accepts terms that match the chronicle. | AI accepts by war score. |
| G7 | Marriages and alliances | Decision `zin_realm_seek_match` between monarchies of compatible peoples (men with men, elves with elves; giants, orcs and dwarves among themselves): `zin_realm.60` A Royal Match Proposed, `.61` accepted (opinion +25, a G3 claim, a guarantee option), `.62` refused (opinion -15); `zin_realm.63` The Kinship Called asks the kin to join a defensive war. | Story realms whose alliances are owned by a mechanic (the Leren Compact, the Concord, the Dominion, the Kindred). | Only the start bonds and V9. | AI seeks matches by threat and opinion. |
| G8 | Raids | Native raids (`common/raids`, hoi4-native-raids) for raiding peoples: orc and goblin holds of the Dark Lands, Triton island lordships, Ember Lands freeholds, Cold Lands clans; `zin_realm.70` Raiders on the March, `.71` The Raid Answered (punish, pay, ignore). The diplomacy cause `zin_cb_orc_raids` is the model. | None. | Raids at their documented rate; never against a great power before CP11. | By situation. |
| G9 | Courts in exile | A capitulated or annexed realm whose ruler lives keeps a court in exile (`zin_realm.50`; Mirolon's `zin_dominion.24` is the model) with the realm that shelters it; restoration by `release` of its cores (`zin_realm.51` The Exiles Return). | None. | Exiled story courts only. | All. |
| G10 | Story roles | The role registry below re-targets every story role at fire time; `zin_realm.80` A Duty Passes tells the world when a role moves. | None. | Roles move only when their holder is gone. | Same. |

**Pulse and permission.** Project rule 8 forbids a new whole-world `on_monthly` iteration without the owner's permission. The systems are designed to run inside the existing guarded world tick (`zin_story_tick`, which already runs once a month) in four weekly batches (`zin_realm_slot` 0 to 3 assigned at start), and to act otherwise only on events (`on_annex`, `on_capitulation`, `on_civil_war_end`, `on_peaceconference_ended`, `on_ruling_party_change`). The batch still visits every country once a month, so it needs the owner's permission (owner question Q2); without it, G1 to G4 run only for tier A and B countries through their own pulses.

**Tag budget.** Civil wars and the dynamic Host create dynamic tags; G3 checks the S12 budget (fewer than 439 tags, 75 of them dynamic) and settles a crisis by election or a foreign candidate when no dynamic tag is free.

### The role registry

Every story role is resolved when it is needed, not fixed to a tag. The resolvers live in the path module; each writes a global event target `zin_role_<key>` and fires `zin_realm.80` A Duty Passes when the holder changes.

| Role | What | Default holder | Successor order | Beats |
| --- | --- | --- | --- | --- |
| R01 | Aenor realm and crowning realm | Y0L | `zin_aenor_find_parim_realm`; `zin_eindil_found_parim_realm` (a coalition member owning Parim creates a dynamic Aenor) | B07, B08, B42 |
| R02 | Afrit's seat | Y8G (Worshipdom) | the country employing `zin_aurevan`, else the eastern client with the most footholds, else `zin_afrit_hidden` | B02, B09, B13, B25, B26, B38, B41 |
| R03 | Host of Eindil | Selen (S2) | `zin_eindil_create_dynamic_host`, else the sworn country (regard 25, renown 40) | B29 to B42 |
| R04 | Gala host (the naming) | Gala Elves | `zin_eindil_pick_gala_host`: Lorien's employer, the owner of Gala's capital; else the Mirror alone (`zin_eindil.170`) | B12 |
| R05 | The Grey Ford pair | Gunwaith, Girdon | two bordering West Lands realms with the lowest mutual opinion | B04, B05, B06 |
| R06 | Leader of the Western Crossing | Gunwaith | the Ford Council member with the most states, then the largest fleet | B20, B27 |
| R07 | The Leren crown | Lerendor | the North Lands realm controlling Sonargur, else the strait shore | B19 |
| R08 | Volgan's first target | Mirolon | the holder of `zin_is_site_mirolon_passes` | B22 |
| R09 | Mp'E holder (the hall) | Yeldenne | the owner of state 1063 (already in the Glo slice) | B14, B15 |
| R10 | Stage 8 host | Selen | the Middle Lands realm with the highest regard that Afrit does not rule | B16 |
| R11 | Alleria's employer | Selen | the Host of Eindil | B16, B40, B41 |
| R12 | Keeper of Dragon Mountain | the dragon keeper (`zin_world_is_dragon_keeper`) | none: return by land | B17 |
| R13 | Eastern candidates | by footholds | `zin_afrit_eastern_candidate` at fire time | B26 |
| R14 | Volgan's steward | the Dominion's lieutenants (the Ember Herald, the Grave-Warden, Ghorvak) | `zin_dominion.19` The Steward's Choice | B34 |
| R15 | The Parim holder | Aenor | `zin_aenor_find_parim_realm` (`zin_aenor_parim_realm`) | B27, B38, B42 |
| R16 | The ice host | owner of `zin_is_site_eindil_ice` | the nearest Cold Lands realm that is not a dark power | B03 |
| R17 | The wreck host | Howan (proposed) | Nara, then Verde, then any Islands of the South realm | B11 |

## 9. Kusven: the re-design of the "Zol manifests" content

The owner corrected the canon on 24 October 2026: Zol does not appear in the War of the Last Crowns. Kusven, his most loyal servant and a Great Spirit made by Zol, comes forth, overpowers the renewed champion, shatters Horos's blue sword, is wounded by Eindil with a shard of it, and withdraws when Lorien and ancient spirits die opposing him; he is not destroyed. The mechanic of `zols_mistake.md` (power, convergence, the form's weekly cost, the deathfield, the withdrawal) is kept and re-pointed at him.

| Old name | New name | Kind | Note |
| --- | --- | --- | --- |
| `zin_zol_manifested` | `zin_kusven_forth` | global flag | Kusven has taken the field (contract; retired name in the N16 list) |
| `zin_zol_withdrawn` | `zin_kusven_withdrawn` | global flag | Kusven has withdrawn, wounded, not destroyed |
| (none) | `zin_kusven_wounded` | global flag | Eindil wounded him with a shard of the blue sword (`zin_mistake.21`) |
| `zin_zol_manifest` | `zin_zol_send_kusven` | scripted effect | Same body: power -25, convergence 0, the host, the mission, +10 Gathering Dark, news `zin_mistake.20` |
| `zin_zol_withdraw` | `zin_kusven_withdraw` | scripted effect | Same body; `zin_arg_cause` 0 Lorien's stand (news `.24`), 1 the cost (news `.25`) |
| `zin_zol_can_manifest` | `zin_kusven_can_come_forth` | scripted trigger | Power 60, convergence 100 |
| `zin_zol_form_taken` | `zin_zol_kusven_in_field` | idea (Zol) | "Kusven Takes the Field": Zol's most loyal servant leads the dead in person |
| `zin_zol_wounded` | `zin_zol_kusven_wounded` | timed idea (Zol) | "The Servant Wounded", 730 days |
| `zin_zol_come_forth` | `zin_zol_send_kusven_decision` | decision | Zol sends his servant; no text says Zol takes a shape |
| template "The Presence" | "Kusven's Host" | division template | The dynamic modifier `zin_zol_presence` keeps its name: it measures Zol's presence through his servants |
| (none) | `zin_kusven` | character | Zol's field marshal (unit leader only); Zol's country leader stays the emblem `zin_zol_will` (S4, O6) |

Events (written by `events_mech.mjs`): `zin_mistake.20` "Kusven Comes Forth" (news), `.21` "The Blue Sword Breaks" (Kusven and the Host: sets `zin_horos_sword_broken` and `zin_kusven_wounded`, fires `zin_eindil.101`), `.22` "The Old Lords Ride" (Gala, checkpoint), `.23` "Lorien's Stand" (news; calls `zin_sun_lorien_falls`, then `zin_kusven_withdraw` with cause 0), `.24` "Kusven Withdraws", `.25` "The Servant's Strength Is Spent". `zin_eindil.101` becomes "The Heir Struck Down"; `zin_lastwar.73` says "Zol's victory"; the Chronicle lines `zin_chronicle_cp23_1` and `_2` read "Kusven, Zol's servant, came forth, and Lorien died forcing him back" and "Kusven came forth and withdrew without the death of the King of Gala"; the world-tension table reads "Kusven comes forth" (+10) and "Kusven withdraws" (-12). Nothing says what his wound cost him, whether he governs the Mistake or Furviatlon, or how his feeding on souls relates to Zol's claim (open in the vault).

## 10. Ending conditions and the sandbox

Exactly one ending per game (`zin_ending_reached`, `zin_world_ending`). Canon endings are checked every month; proposed outcomes are judged once after the historical end so that they never cut a canon ending short.

| No. | Ending | Status | Condition | Reachable from | Needs |
| --- | --- | --- | --- | --- | --- |
| 1 | The Lost Cause | established | `zin_eindil_crowned` (B42). | Historical path; any game where the heir lives, Glo is carried (state 1), Parim is held by the Host's side and Afrit is dead (or reduced, after Q1). Variants: crowned as the Golden King's heir (B07 D3), crowned with Lorien alive (B36 D1), crowned without the cliff (B39 D1). | SL-05, SL-06, SL-09, SL-10, SL-33. |
| 2 | Children of Volgan | established | `zin_volgan_children_ready` from 1 Lumae 4A 1756: body intact, Parim held by Volgan or a subject, four subjects, strength 60, Eindil not crowned. | Mirolon falls early, the march is not broken, the body survives (B34 D1), the West and the East exhaust Aenor; also after the heir is lost. | SL-03 (the date trigger and the check). |
| 3 | The Ashen Throne | established | `zin_afrit_ashen_throne_ready`: Afrit alive with the Necklace, Parim held, 12 deep footholds, and the palace held (from 4A 1759), all Aoaz claimed (from 4A 1760) or the stand-in with the war (from 4A 1760). | The palace holds twice (B41 D2), the stand-in (B25 D1), a strong King of the East (B26 D2); `zin_world_reach_ending` reveals him first. | SL-03, SL-11. |
| 4 | The Golden Court Endures | proposed outcome (vault, outside canon) | Judged in 4A 1762: an Aenor realm controls Parim and the Golden King rules it (`zin_golden_king_survives`, or the Kingdom Behind the Throne with the King alive) or the Regency of Gold rules it (`zin_aenor_regency_endures`). | B02 D3 and D4, B07 D3, B08 D1. | SL-25, SL-31 (endings fix E-04 adds the Regency). |
| 5 | A Western Crown in Parim | proposed outcome | Judged in 4A 1762: `zin_west_holds_parim` as a trigger. | B27 D3, B28 D2. | SL-19. |
| 6 | Master of the Strait | proposed outcome | Judged in 4A 1762: `zin_leren_strait_supremacy` and `zin_leren_holds_strait` (with R'en's coast, O9). | B19 D2. | SL-17. |
| 7 | One King in the East | proposed outcome | Judged in 4A 1762: `zin_east_united`, and Afrit dead or never King of the East. | B21 D2, B26 D1 or D4. | none beyond SL-03. |
| 8 | The Age Unfinished | ZIN fallback | 1 Glernaen 4A 1770 with no ending. | Any game. | SL-03. |

**Ending fixes.**

- E-01 Judgement deferral: on 1 Glernaen 4A 1762 (paced) the proposed outcomes are judged only when `zin_path_departure` is 15 or more or no canon ending is in reach; a canon ending is in reach while the heir is at stage 9 to 12, not lost, and Afrit is alive or the palace is pending. Otherwise the judgement moves to 1 Glernaen 4A 1764, once.

- E-02 The reduced-Afrit gate (SL-09, Q1): if the owner accepts it, the Lost Cause can follow a coronation with Afrit beyond the rift or in hiding, and its epilogue says the false god's fate is not yet written (no canon closed).

- E-03 Heir lost: `zin_ending_heir_lost` sends The League Without the Heir; the Lost Cause closes; Children of Volgan, the Ashen Throne and the outcomes stay open.

- E-04 The Golden Court Endures also holds for the Regency of Gold (`zin_aenor_regency_endures`), and needs an Aenor realm in Parim (SL-25).

- E-05 No Zol or Kusven ending is designed: the vault leaves Zol's intentions open (05 spec open question 2).

**The sandbox to 4A 1800.** After an ending: the meter reads "The Age Has Turned" and `age_turns` lowers it toward 10; the path tick stops (every pending checkpoint resolves skipped without counting); story owners stop their catch-ups; the generic systems of section 8 continue, so successions, crises, marriages, raids and peace deals keep the world moving; the dark powers keep only what their mechanics allow (Zol's `zin_zol_second_stirring` in 4A 1770, the Ember Lands' remnant under the Steward); the Fifth Age seeds are flavour only and never settle what the vault leaves open. The game ends on `1800.1.1.1` (`tools/content/lib/calendar.mjs` END_DATE, V3).

## 11. Implementation plan

Nothing here edits a gameplay file; each row names the file that will own the change.

| Kind | Target | Content | Fixes |
| --- | --- | --- | --- |
| Module | `tools/content/modules/historical_path.mjs` (new) | Checkpoints, tick, watchdog, roles R01 to R17, divergence measure, start check `zin_path.1`; writes `common/scripted_triggers/zin_path.txt`, `common/scripted_effects/zin_path.txt`, `events/zin_path.txt`, `common/script_constants/zin_path.txt`, `localisation/english/zin_path_l_english.yml` | SL-02, SL-23 |
| Data | `tools/content/data/path_checkpoints.json` (new) | Generated from `docs/design/alternate_history.json` by the module's loader; the test compares them | SL-02 |
| Library | `tools/content/lib/story_dates.mjs` (new) | `paceDate(date, pace)`; replaces the per-slice pace helpers (`mp_kit.mjs`, crown dates, `mech_journey_lib.mjs`) over time (V4, R2) | SL-01 |
| Module | `tools/content/modules/world_tension.mjs` (new) | The Gathering Dark, `zin_world.1` to `.29` (including `.20`), `zin_world_add_gathering_dark`, `zin_world_check_endings`, `zin_world_reach_ending`, the date triggers, the ending spirits, the monthly world tick (step 8 `zin_path_tick`, step 9 `zin_story_tick`); `zin_rule_gathering_dark` in `game_rules.json` | SL-01, SL-03 |
| Module | `tools/content/modules/events_mech.mjs` (new) and `data/events_mech_{afrit,mistake,dominion,leren,misc}.json` | The 61 narrative events of the mechanic namespaces (SL-28), Kusven's events, `zin_afrit.77`, `zin_eindil.170` stays with events_world | SL-04, SL-05, SL-07, SL-12, SL-13, SL-15, SL-16, SL-17, SL-28 |
| Module | `tools/content/modules/realm_life.mjs` (new) and `data/realm_life.json` | Namespace `zin_realm` (events `.10` to `.15`, `.20` to `.22`, `.30` to `.32`, `.40` to `.42`, `.50`, `.51`, `.60` to `.63`, `.70`, `.71`, `.80`); decisions category `zin_realm_court` (Name an Heir, Seek a Match, Offer Terms, Shelter the Exiles, Punish the Raiders); effects `zin_realm_pulse`, `zin_realm_succeed`, `zin_realm_open_crisis`, `zin_realm_settle_crisis`, `zin_realm_offer_terms`, `zin_realm_found_exile_court`; triggers `zin_realm_is_story_ruler`, `zin_realm_crisis_allowed`; constants `common/script_constants/zin_realm.txt` | G1 to G10 |
| Module | `tools/content/modules/start_variety.mjs` (new) and `data/start_variety.json` | On-startup draws V1 to V13 (inside `zin_rules.txt` order: after the pace is set); flag `zin_start_variety_drawn`; temper traits | variety |
| Rule | `zin_rule_start_variety` in `tools/content/data/game_rules.json` | Options DEFAULT, OFF, LIGHT, FULL; branch HISTORICAL OFF, PLAUSIBLE LIGHT, FREE FULL (R1) | variety |
| Fix | `tools/content/modules/mech_eindil_scripts.mjs` | `zin_eindil_ready_11` uses the trigger; `zin_eindil_ready_12` reduced-Afrit gate; battle deadline; `zin_eindil_lose_heir` calls `zin_ending_heir_lost`; global reads of the focus country flags; `zin_eindil.170` | SL-06, SL-09, SL-20, SL-33, SL-35, SL-37 |
| Fix | `tools/content/lib/mech_afrit_script.mjs`, `modules/mech_afrit.mjs` | Branch wrappers; return and Parim dates read; voyage fallback; seat target `zin_afrit_seat`; annex and capitulation hooks (`zin_afrit_hidden`, `zin_afrit.77`); crowning timeout; plot closed after survival; `zin_afrit_knows_brother` | SL-04, SL-07, SL-08, SL-09, SL-10, SL-11, SL-21, SL-31 |
| Fix | `tools/content/lib/mech_zol_script.mjs`, `modules/mech_zol.mjs`, `data/mech_zol.json` | Kusven re-design: `zin_zol_send_kusven`, `zin_kusven_withdraw`, `zin_kusven_can_come_forth`, flags `zin_kusven_forth`, `zin_kusven_withdrawn`, `zin_kusven_wounded`, character `zin_kusven`, ideas, template; `zin_is_zol` by original tag | SL-13, SL-14, SL-27 |
| Fix | `tools/content/lib/mp_volgan_core.mjs`, `mp_volgan_pulse.mjs` | March catch-up under the historical branch; annexation with the body intact (`zin_volgan_withdrawn_south`) | SL-34, B34 D2 |
| Fix | `tools/content/modules/mech_lerendor.mjs`, `mech_crossing.mjs` | Gates read the war flag once it exists; the West reads `zin_leren_treaty_honoured` and `zin_leren_treaty_in_force`; `zin_west_holds_parim` trigger | SL-17, SL-19 |
| Fix | `tools/content/lib/mech_aenor_script.mjs` | Exile of the living King (`zin_golden_king_exiled`); `zin_golden_king_natural`; the branch wrappers for the succession rule | SL-25, SL-30 |
| Fix | `tools/content/data/events_world_eindil_3.json`, `events_world_lastwar.json`, `events_crown_chronicle.json`, `events_crown_reign1.json` | `zin_eindil.101` "The Heir Struck Down"; `zin_lastwar.73` "Zol's victory"; cp23 lines name Kusven; denounce sets the global flag; `zin_reign.19` title follows the calendar (the feast of Gaelor) | SL-14, SL-18 |
| Fix | politics step (country table) | Hirolon without overlord; Zol row labels Kusmeel; Ember Lands region labels | SL-24, SL-36 |
| Check | `tools/content/checks/story_wiring.mjs` (new) | Fired events defined; read flags set (allowance list with owners); trigger-as-flag; flag scope; per-power rule options only through wrappers; every beat in the JSON has a latest date and a successor for every divergence | SL-28, SL-29, SL-30 |
| Test | `tools/content/alternate_history.test.mjs` (new) | Schema of `docs/design/alternate_history.json`; CP01 to CP26 covered; weights sum 93; every soft-lock's file path exists; `path_checkpoints.json` equals the JSON's checkpoints | A-46 |
| Contract | `docs/specs/04_mechanics/00_shared_contract.md`, `00_contract_additions.md` | Add `zin_kusven_forth`, `zin_kusven_withdrawn`, `zin_kusven_wounded`, `zin_kusven`, `zin_path_cpNN_way`, `zin_path_departure`, `zin_golden_king_exiled`, `zin_golden_king_natural`, `zin_afrit_hidden`, `zin_afrit_beyond_the_rift`, `zin_volgan_withdrawn_south`, `zin_war_piecemeal`, `zin_start_variety_drawn`; retire `zin_zol_manifested`, `zin_zol_withdrawn` (N16 list) | SL-14 |

**Order.** 1 the wiring check (so the next build reports what dangles), 2 `world_tension.mjs`, 3 `historical_path.mjs` with the measure and the roles, 4 `events_mech.mjs` (Afrit first, then Kusven, Volgan, Lerendor, the rest), 5 the fixes to existing slices, 6 `realm_life.mjs`, 7 `start_variety.mjs` and the rule, 8 the test and the observer runs.

## 12. Acceptance (A-46)

A-46 requires the divergence table and the soft-lock audit to be complete, and observer runs on divergent seeds to reach coherent states and an ending or the sandbox without errors. The runs are isolated Linux runs under the shared WSL lock, with the clock unpaused, one in-game year at least per phase and the full span for these seeds; the Windows game is never launched.

| Seed | Setup | Must show |
| --- | --- | --- |
| A1 | HISTORICAL, standard pace | Every checkpoint historical; contract flags in canon order; the Lost Cause by 4A 1761; `zin_path_divergence` below 10 |
| A2 | PLAUSIBLE | Every checkpoint resolved by its latest date + 30 days; an ending by 4A 1770 |
| A3 | FREE, start variety FULL | As A2; no `zin_path_stalled`; the generic systems run (at least one succession, one marriage or crisis) |
| A4 | Console: expose the plot in 4A 1749 | CP05 diverged; `zin_golden_king_survives` or the Faithful's war; never both `_survives` and `_dead` |
| A5 | Console: annex the Worshipdom in 4A 1752 | Afrit's seat moves (R02) or `zin_afrit_hidden`; the coronation is still possible (after Q1) or the age reaches judgement |
| A6 | Console: annex Gala in 4A 1751 | `zin_eindil.170`; the voyage at 150 days; CP08 skipped |
| A7 | Console: annex Yeldenne in 4A 1750 | CP09 by the hall rules; checkpoints 10 to 26 resolve |
| A8 | Console: annex Aenor by a western crown in 4A 1756 | R01 and R15; `zin_eindil_found_parim_realm` or The Crown Withheld; a Western Crown at judgement |
| A9 | Console: annex Volgan in 4A 1754 | CP15, CP21, CP22 skipped; `zin_volgan_withdrawn_south`; battles skipped by deadline |
| A10 | Console: `zin_eindil_lost` in 4A 1756 | `zin_ending.80`; another ending or the Age Unfinished |
| A11 | `zin_rule_dark_powers` RESTRAINED | CP16, CP20, CP23 skipped; Lorien alive; the heir hailed on 1 Naisa 4A 1757 (paced) |
| A12 | Pace SLOW and FAST | Every target and latest date shifted; no checkpoint early |

Every run fails on `zin_path_stalled`, on a ZIN error line in `error.log`, on two ending flags, or on any text naming Afrit before `zin_afrit_revealed`.

## 13. Owner questions

- **Q1.** If Afrit is not killed in the palace (he never returns, flees beyond the rift, or his realm is destroyed and he hides), may Eindil still be crowned and the Lost Cause be reached, with the false god's fate left open? Proposal in use: yes, after the gate of SL-09 (his realm holds nothing in the Middle Lands and the Host holds Parim) or 365 days of hunting; on the historical path he always dies in the palace.

- **Q2.** May the generic realm systems visit every country once a month, in four weekly batches inside the existing world tick (project rule 8)? Without permission they run only for the tier A and B realms.

- **Q3.** May the start variety (FULL only) open with small border feuds between minor realms, or does "everything seems peaceful" forbid even those? Proposal in use: at most two tier C feuds, ended within 90 days.

- **Q4.** Is the order of your list of the twelve gods the order of the months (Glernaen first, Lumae third, Naisa twelfth)? This document assumes it.

## 14. Future extensions

- A Chronicle page per divergence, listing who changed the age and when (the `zin_path_cpNN_way` codes already carry it).

- Achievements for each ending and for a game that keeps the divergence below 10 under FREE.

- Regional history beats (the regional dossiers of R-19) folded into the same measure with weight 1, so a game that rewrites only the West or only the East still shows its departure.

- A second sandbox arc after 4A 1770 built on the Fifth Age seeds, once the owner settles any of them.

## Icons and assets

No new art is needed for this design itself. The new events reuse existing pictures until the art track supplies more: `zin_realm.*` use `generic_court`, `generic_war` and `concord_council`; `zin_mistake.20` to `.25` use `zol_rising`, `dead_ranks_far` and `ashen_waste`; `zin_afrit.77` uses `mask_veiled`; `zin_eindil.170` uses the Mirror crop. The rule `zin_rule_start_variety` has no icon, like the other ZIN rules (`docs/plans/zin-art/pending_from_integration.md`). New temper traits need trait icons registered in `interface/zin_characters.gfx` as `GFX_trait_zin_temper_<key>` before art is requested; new decision category `zin_realm_court` needs `GFX_decision_category_zin_realm_court` in `interface/zin_realm.gfx`.
