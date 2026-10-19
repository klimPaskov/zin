# Eindil's journey

**Status:** Ready. Reviewed 19 October 2026 against CONVENTIONS "Status"; integrated 19 October 2026. **Priority:** 3. **Phase:** 3 (system and AI); event text in Phase 5 ([06_events/02_eindil_journey.md](../06_events/02_eindil_journey.md), [06_events/03_war_of_the_last_crowns.md](../06_events/03_war_of_the_last_crowns.md)). **Depends on** the calendar ([00_foundation/01_start_and_calendar.md](../00_foundation/01_start_and_calendar.md)): the game still starts on 1936.1.1 until that spec is built. Every date below is an Erdae engine date (`1749.2.1` is 1 Ironfrost 4A 1749).

## Purpose

Eindil's journey is the world system that carries the heir of Aen from the ice of the Cold Lands to the throne of Aenor between 4A 1749 and 4A 1760. It is not one country's mechanic. Eindil moves through a chain of host countries, and each host decides whether to help or hinder him. The system:

- keeps the historical path runnable without a player (stage by stage, on the vault's proposed dates);
- gives every country that meets him a real choice, with consequences that reach the endings;
- makes Eindil a guest general first, then the general and ruler-in-waiting of the Host of Eindil (decision S2);
- respects the start: on 1 Thaw 4A 1748 Eindil sleeps, nobody knows of him, and nothing in this system is visible.

The Castle of Yeldenne, Horos and Glo are a separate system with their own spec, [yeldenne_and_glo.md](yeldenne_and_glo.md). This spec hands over to it at stage 7 and reads its results. The two specs use the same names for every shared flag, event and effect.

## Lore basis

| Fact | Status | Source |
| --- | --- | --- |
| Eindil is son of Ein, grandson of Aen, brother of Afrit, of the First Men; strongest man of the Fourth Age | established | *Eindil* |
| He wakes in the Cold Lands without memory; tribes find and nurse him; West Lands travellers take him south | established | *Eindil*, *The Journey of Eindil* |
| He helps communities, makes peace, briefly serves as a western war-king and lays the title down | established | *Fourth Age Canon Register* |
| He sails for Aenor; a failed crossing carries him to the Islands of the South; he lives among the islanders | established | *Fourth Age Canon Register* |
| He travels to the Gala elves; Lorien names him son of Ein after weeks of talk and a vision; gives ship, armour, sword and a crew of western friends, southern islanders and Gala elves; sends him to Horos | established | *Lorien*, *The Journey of Eindil* |
| Afrit travels after him and sets an ambush; every one of Eindil's crew dies; Eindil reaches the castle alone through snow | established | *Fourth Age Canon Register*, *The Journey of Eindil* |
| Horos gives Glo and the blue sword; Eindil learns the god-king is his brother | established | *Castle of Yeldenne and Glo*, *Eindil* |
| He warns Aenor; most of the court denounces him; frontier troops, scholars and branches of the Lost Cause believe him | established | *The Fourth Age of Erdae* VIII |
| He returns on a dragon with Varner and Golbran; the sword driven into the earth breaks a front of Zol's dead; the peoples unite; Volgan casts him down; Varner dies defending the living against Zol's dead; the New Gods restore him; he destroys Volgan's manifested body; Zol manifests, crushes the sword, is wounded by a shard; Lorien dies; Zol withdraws | established | *Fourth Age Canon Register*, *Horos's Blue Sword*, *War of the Last Crowns* |
| Glo is the channel of the New Gods' restoration | proposed | *Glernaen*, *The Fourth Age of Erdae* XI |
| Afrit returns, cuts off his arm, casts him from a cliff and retakes the capital; Eindil survives; at the palace Alleria helps strip Afrit's artifacts; Golbran removes the Necklace; Eindil kills Afrit; Golbran gives his last magic to save him and dies; Eindil puts on the Necklace and is crowned King of Aenor | established | *Fourth Age Canon Register*, *The Last Battle in the Palace* |
| Golbran spends nearly all his strength at Varner's last stand and survives it until the palace | proposed | *Fourth Age Canon Register* (proposed list), *The Fourth Age of Erdae* X |
| Dates: wakes 4A 1749, war-king 1750, storm 1751, Gala 1752, Yeldenne 1753, warnings 1754, return 1757, cliff 1758, palace 1759, coronation 1760 | proposed | *Fourth Age Chronology* |
| The Truce of the Grey Ford; the Bridge of the Three Oaths, Girdon's Winter Ford, the Gunwaith trial, the reef of drowned voices, the shrine beneath the tide; the epithets "the Man from the Ice" and "the King Without a House" | proposed | *Fourth Age Chronology*, *The Fourth Age of Erdae* IV |
| Mirror of First Rain; Alleria investigates and shelters him; Alleria finds him below the cliff; the dragon entrusted by Magical Lands elves; the Ring of Doors and the other lesser artifacts' names | proposed | vault notes as named |
| Chancellor Merovan left in Parim; Aurevan as Afrit's public name | proposed | *Chancellor Merovan (proposed)*, *Aurevan the Deliverer* |

**Proposed by this spec** (not lore; for the owner to adopt or replace): the stage scale below, every host assignment marked "proposed", renown, regard and delay, the Grey Ford Confederation as the western confederation, Selen as the Host of Eindil (decision S2), the ports of call, the stage 8 retreat to the Magical Forest, the palace preparation chain, the rule that Eindil cannot die before stage 9, and all numbers.

**Kept open** (the system must not answer these in text): the birth order of the brothers; how and why Eindil was put to sleep; which arm he loses; what the Necklace will do to him; whether Volgan's spirit survives; what Glo leaves him after the gods' gift; where the palace cliff and the western war-kingship lie exactly; which western rulers made him war-king; Golbran's origin; how exactly Eindil survived below the cliff.

## Design

### Stages

`zin_eindil_stage` (global, 0–12, contract) is the single source of truth. A stage starts when its **floor date** (+ accumulated delay) has passed and its **conditions** hold. Floors are the vault's proposed dates. Help never makes Eindil faster than history; hindrance makes him slower.

**Story pace (V4).** Every floor reads `zin_story_pace` (foundation rule `zin_rule_story_pace`): a floor *d* becomes start + (*d* − start) × pace. The builder writes the three date sets (pace 1.0, 1.5, 0.75) as day numbers, and the floor trigger compares `global.num_days` with the set for the current pace plus `global.zin_eindil_delay`.

| Stage | Name | Floor (+ `zin_eindil_delay` days) | Conditions to enter | Sets | Default host (proposed unless noted) |
| ---: | --- | --- | --- | --- | --- |
| 0 | Asleep | start | — | — | none (nothing visible) |
| 1 | The Man in the Ice | `1749.2.1` + 0–20 days random; `zin_rule_eindil_waking` EARLY `1748.6.1`, LATE `1751.2.1` | — | `zin_eindil_awake` | owner of Eindil's ice (`zin_is_site_eindil_ice`) |
| 2 | The Road South | `1749.10.1` | stage 1 for 150 days | — | the traders' road; then the owners of the western episode sites |
| 3 | The War-King | `1750.4.1` | three western episodes resolved, or `1750.9.1` | `zin_eindil_war_king` when he lays the title down | leader of the Grey Ford Confederation |
| 4 | The Storm | `1751.3.1` | stage 3 resolved (internal flag `zin_eindil_stage_3_done`) | — | Islands of the South: the wreck host and the shrine owner |
| 5 | Gala | `1752.1.15` | stage 4 for 270 days | `zin_eindil_named` | Gala Elves (established) |
| 6 | The Voyage North | `1753.1.1` | named; Lorien's Gift resolved | — | none at sea; ports of call |
| 7 | Yeldenne | `1753.5.1` | voyage done (150 days; 120 with Gala's `zin_gala_great_ship`) | `zin_horos_dead`, `zin_glo_with_eindil` (both by [Yeldenne and Glo](yeldenne_and_glo.md)) | owner of the landing site (`zin_is_site_yeldenne_landing`), then the owner of Mp'E |
| 8 | The Warnings | `1754.1.1` | hall resolved; 90 days' travel | `zin_eindil_dragon_pact` (late in the stage) | Selen, then the Magical Forest |
| 9 | The Return | `1757.3.1` | `zin_war_of_last_crowns` and `zin_eindil_dragon_pact` | `zin_eindil_returned`, `zin_varner_dead`, `zin_eindil_restored` (here); `zin_horos_sword_broken` (by Zol's `zin_mistake.21`, N1) | the Host of Eindil (Selen, S2) |
| 10 | The Cliff | none: Afrit's `zin_afrit.61` starts it | stage 9 resolved (`.102` fired or skipped) | `zin_eindil_cast_down` (N3) | the Host of Eindil; Alleria's employer |
| 11 | The Palace | `1759.3.1` | Eindil recovered (`zin_eindil_recovered`); `zin_afrit_holds_parim`; the Afrit spec's palace preconditions | `zin_golbran_dead`, `zin_eindil_wears_necklace` (here); `zin_afrit_dead` (by the Afrit spec's `zin_afrit_die`) | the Host of Eindil |
| 12 | Crowned | `1760.3.1` | `zin_afrit_dead`; a crowning realm exists (stage 12 below) | `zin_eindil_crowned` (by Aenor's `zin_aenor.400`) | the Aenor realm that crowns him |

**Skips.** A stage whose antagonist is already gone is skipped, never stalled:

- Stage 9's Volgan battles are skipped if `zin_volgan_body_destroyed` is already set or Volgan does not exist. The New Gods' restoration happens only after Volgan casts him down, so it is skipped with them.
- Varner's last wards need Zol's dead in the field (`zin_zol_rising`, Zol at war with the Host or a coalition member). If that never holds by `1758.1.1`, Varner lives and nothing is said of it.
- Stage 9 starts without the war on `1758.3.1` if `zin_war_of_last_crowns` never fires: a "quiet return" with no battles.
- Stages 10 and 11 are skipped if `zin_afrit_dead` is set by other means, or if neither the Worshipdom nor a realm Afrit rules exists. The journey goes to stage 12.
- If Afrit has not returned (`zin_afrit_returned`) by `1759.3.1`, stage 10 is skipped, and stage 11 opens when the Afrit spec's palace preconditions hold.
- If Afrit lives and the palace never opens, the journey waits at stage 11. It does not stall the world: the path checkpoints 25 and 26 resolve by their latest dates ([03_gameplay/06_historical_path_and_ai.md](../03_gameplay/06_historical_path_and_ai.md)), and the endings spec reads the result.

### Eindil in the game

Eindil is the character `zin_eindil` (contract), defined by the characters module and recruited by nobody at the start ([02_lore/02_characters.md](../02_lore/02_characters.md)). He is never present before stage 1.

| Phase | Stages | Form | Who controls him |
| --- | --- | --- | --- |
| Guest | 1–8 | Unit leader recruited by the current host (corps commander; field marshal as war-king; advisor "Guest of Lorien" at Gala) with journey traits | the host country |
| At sea | 4 (crossing), 6 | Not recruited; the system holds him | nobody |
| Host | 9–11 | Field marshal and ruler-in-waiting of the Host of Eindil (Selen, S2). Country leader only when the Host is the dynamic fallback | the Host (playable) |
| King | 12 | Country leader of the Aenor realm that crowns him | that realm |

**Name (D4).** He does not know his name until Lorien gives it. Until `zin_eindil_named`, his character name is **"The Man from the Ice"**, and that is the only name any text gives him. Descriptions may call him "the stranger"; the epithet "the King Without a House" may appear after `zin_eindil_war_king` (characters spec). The naming event calls `set_character_name` to the loc key `zin_eindil_name_named` ("Eindil"). Event text refers to him through the characters spec's scripted localisation `zin_loc_eindil`, and the interface through `zin_ui_stranger_name`. Both show "Eindil" only where the Chronicle's trigger `zin_chr_heir_known` holds for the viewer (`zin_eindil_named` and stage 8 or later, or the viewer is his host), so courts learn the name in stage 8 from Eindil himself, as below.

**Guest rules.**

- The host may use him to command any defensive war or the war-king's peace. If the host starts an offensive war (`has_offensive_war`) against anyone except Zol, Volgan, their subjects, or (after `zin_afrit_revealed`) the Worshipdom and the realm Afrit rules, Eindil leaves at the next pulse: the stage advances, 30 days of delay, regard −20. A border war (`start_border_war`) is not an offensive war.
- He leaves when the stage ends, whatever the host wants. A host can keep him longer only through the "Detain" options below, and he always leaves in the end.
- **Before stage 9 nothing can kill him.** Hindrance delays him and costs the hinderer; it never ends the journey. This keeps the established path reachable from every early divergence (proposed rule; owner question in [OPEN_QUESTIONS.md](../OPEN_QUESTIONS.md), "eindil and glo" 1).

### The three journey measures

| Variable | Scope | Range | Meaning | Main sources |
| --- | --- | --- | --- | --- |
| `zin_eindil_renown` | global | 0–100 | How widely his deeds are told | deeds +5 to +15 each; historical path reaches about 70 by stage 8 |
| `zin_eindil_regard` | every country | −100–100 | How Eindil and later his Host remember that country | hosting +20, help +10 to +25, hindrance −20 to −40 |
| `zin_eindil_delay` | global | 0–900 days | Accumulated delay added to every later floor | hindrance +60 to +180; help −30 to −60 (never below 0) |

`zin_eindil_host` (global, country reference) stores the current host country, or is cleared while he is at sea.

**What they do.**

- **Renown** sets how many courts heed his warnings in stage 8 (AI heeds with probability equal to renown, in percent, within the rules below) and how many divisions the dynamic Host gets when it is raised (renown ÷ 10, rounded down, minimum 3).
- **Regard** ≥ 25 means a friend: the country gets the coalition invitation in stage 9, the opinion modifier `zin_eindil_remembered` (+25 toward the Host once it exists, and toward the crowned Aenor realm at stage 12) and, at the coronation, if regard ≥ 50, the spirit `zin_eindil_first_friends`. Regard ≤ −25 means resentment: no invitation, opinion modifier `zin_eindil_wronged` (−25) at the same moments.
- **Delay** pushes every later floor. Large delay is how the world diverges: Eindil may reach Yeldenne after Afrit strikes, or come home after the West has crossed.

### Stage by stage: hosts and choices

Every choice below is a country event option or decision. "(hist)" marks the option the AI takes on the historical path. Every event writes `timeout_days = 30` and a timed-out event takes its first option (E2), so the generated order is: the historical option first, except in the events that decide a path checkpoint for a human (marked CP in the event table: `.32`, `.50`, `.82`, `.88`), which list their non-committal option first and the historical option second (events conventions C9). Text never names Afrit before `zin_afrit_revealed` (contract, "The secret"). Full event text is in [06_events/02_eindil_journey.md](../06_events/02_eindil_journey.md) (stages 1–8) and [06_events/03_war_of_the_last_crowns.md](../06_events/03_war_of_the_last_crowns.md) (stages 9–12).

#### Stage 1 — The Man in the Ice (4A 1749)

**Host:** the owner of `zin_is_site_eindil_ice`, a remote north-west Cold Lands state, not a capital ([key sites](../01_map/02_key_sites.md)). The map step records which tier C Cold Lands realm owns it (proposed: a north-western clan realm; never Coldor's capital state). Fallback: the Cold Lands country nearest the site that is not Coldor or Isengard.

| Event | Choice | Effect |
| --- | --- | --- |
| The Man in the Ice | **Nurse the stranger** (hist) | Eindil recruited as corps commander (trait `zin_eindil_man_from_the_ice`); spirit `zin_eindil_stranger_among_us`; regard +20; renown +5 |
| | Leave him to the elders | Recruited; no spirit; regard +5 |
| | **Bind him to our service** | Recruited; he stays 365 days; spirit `zin_eindil_restless_guest`; delay +120; regard −30 |
| Talk of a Man from the Ice (to Coldor and Isengard, 60 days later) | Ignore northern tales (hist) | nothing |
| | Summon him to court | 50 %: he comes; the summoner hosts him for 90 days; delay +30; regard +10 with the summoner. 50 %: he declines; nothing |
| | Send the wardens to watch over him (Coldor only, with the Cold Lands spec's `zin_cold_far_ice_charted`) | the Cold Lands spec's `zin_cold_send_wardens` (regard +10 on Coldor, renown +2, no delay) |
| The Traders' Road South (end of stage) | **Give him provisions** (hist) | delay −30; regard +10; renown +5; with `zin_cold_neck_road` also the Cold Lands spec's `zin_cold_reward_ice_host` (`value` 5: lean +5 toward Fandanar) |
| | Let him go as he came | nothing |

#### Stage 2 — The Road South (4A 1749–1750)

Eindil travels with West Lands traders. Three episodes fire 45 days apart. Each host recruits him for the episode and releases him after it.

| Episode (site) | Host | Help | Hinder |
| --- | --- | --- | --- |
| **Bridge of the Three Oaths** (`zin_is_site_three_oaths`, proposed where Gunwaith and Girdon meet) | owner of the site | **Accept his mediation** (hist): both lordships keep their grain; stability +3 %; regard +20; renown +5 | **Burn the grain anyway**: timed spirit `zin_eindil_burned_granaries` (180 days); regard −20; renown +5 (he saves what he can) |
| **Girdon's Winter Ford** (`zin_is_site_winter_ford`) | Girdon (if Girdon does not own the site, the owner) | **Hold the ford open for the refugees** (hist): manpower +2,000 (refugees settle); regard +20; renown +5 | **Close the ford**: delay +60; regard −25 |
| **Judgment in Gunwaith** (Gunwaith's capital) | Gunwaith | **Try him fairly** (hist): timed spirit `zin_eindil_judgment_honoured` (365 days); regard +20; renown +10. **Pardon him**: he refuses exemption; same result with different text | **Make an example of him**: he is held 180 days, then released; delay +180; regard −40; renown +5 (stories of his patience) |

If one country owns two episode sites, both episodes fire for it. If Gunwaith does not exist, the trial fires for the owner of Gunwaith's former capital.

At the end of the stage, a news event, **The King Without a House**, fires to every West Lands country (renown ≥ 20) or only to the hosts (lower).

#### Stage 3 — The War-King (4A 1750)

**Lore:** when the Truce of the Grey Ford breaks, a western confederation makes Eindil temporary war-king; he makes peace and lays the title down (established outline, proposed dates).

**The Grey Ford Confederation (proposed).** The confederation is the West Lands countries that want the peace but cannot keep it alone:

- **Leader:** the West Lands country other than Gunwaith and Girdon with the highest regard; ties go to the most states.
- **Members:** West Lands countries with regard ≥ 0 that are not at war with each other. At least three; if fewer qualify, the leader stands with whoever does.

**How it starts.** The war at the ford is the Western Crossing spec's **Grey Ford Feud**, a border war between Gunwaith and Girdon ([western_crossing.md](western_crossing.md), section 2).

- When `zin_west_grey_ford_war` is set during stage 3, **The Grey Ford Breaks** fires to the leader.
- If no feud has begun by `1750.9.1`, or the truce is permanent (`zin_west_truce_permanent`), **Feud on the Grey Ford** fires instead: a quarrel at the ford threatens the truce and the confederation names him war-king to calm it. No war is started.

| Event | Choice | Effect |
| --- | --- | --- |
| A Crown Offered (leader; CP 04, so "Refuse the stranger" is written first) | **Name him war-king** (hist) | Eindil becomes the leader's field marshal (trait `zin_eindil_war_king`); members get `zin_eindil_war_kings_banner` for the stage; members give each other military access (`give_military_access`); calls the Western Crossing's `zin_west_on_war_king` with `event = named` |
| | Refuse the stranger | The offer passes to the next candidate; if nobody accepts in 90 days, stage 3 ends without a war-king. `zin_eindil_war_king` is then set only under the historical rule; stage 4 follows either way |
| The War-King's Terms (to each belligerent, 60 days after the offer) | **Accept his peace** (hist) | When both accept: `zin_west_end_ford_war` (the Western Crossing spec's single exit for the feud, outcome "the war-king's peace"); both get `zin_eindil_war_kings_peace` (730 days); regard +15 |
| | Fight on | The feud goes on; calls `zin_west_on_war_king` with `event = refused`; the leader may take the decision *Enforce the War-King's Peace*; regard −20. The war-king lays down the title when the feud ends or after 365 days |
| The Crown Laid Down (leader, when peace holds) | **Release him with honour** (hist) | Sets `zin_eindil_war_king`; members keep `zin_eindil_war_kings_peace`; calls `zin_west_on_war_king` with `event = released`; regard +20; renown +15 |
| | Try to keep the war-king | He refuses and leaves by night: sets `zin_eindil_war_king`; calls `zin_west_on_war_king` with `event = fled` before the confederation dissolves; regard −50 with the leader; renown +10 |

The player cannot make Eindil a permanent king: his choice to lay the crown down is established. Players choose only how they part.

#### Stage 4 — The Storm (4A 1751)

Eindil sails for Aenor from the leader's coast (or the nearest West Lands port). He is at sea: `zin_eindil_clear_host`.

- **West Over the Sea** (to the departure host): **Give him a ship** (hist): regard +10. **Let him find passage**: delay +30.
- 30 days later the storm takes the ship south. **Wreck on the Southern Isles** fires to the wreck host: the owner of the first southern island landfall (proposed: Howan). **Shelter the castaways** (hist): Eindil recruited as corps commander; regard +20. **Sell news of him to the Deliverer's priests** (only if the wreck host has `zin_footholds` ≥ 1): the Worshipdom gets the private event `zin_glo.5` (early warning, owned by [Yeldenne and Glo](yeldenne_and_glo.md)); delay +60; regard −40; host +50 political power.
- **The Reef of Drowned Voices** (proposed island legend, to the wreck host or a neighbouring island, Nara or Verde): Eindil brings back the stranded children. Spirit `zin_eindil_the_sea_went_silent` (365 days); renown +5; the island that receives it gets the permanent country flag `zin_eindil_reef_island` (read by its regional tree).
- **The Shrine Beneath the Tide** (to the owner of `zin_is_site_south_shrine`, proposed Enhis Is Rond): an inscription naming Aen. Renown +5. The text does not identify him.
- **Stay and Rule Us** (to the island with the highest regard): he declines; the host chooses "Honour his choice" (regard +10) or "Hold him to the offer" (delay +60, regard −20).
- **Carry the Old Tales to Gala** ends the stage: the islanders send him to the Lands of the Sun.

**Early warning (divergence).** If an island sold news, the Worshipdom chooses in `zin_glo.5`: **Dismiss the tale** (AI default) or **Send hunters south**. Hunters make one attempt on the islands 90 days later (`zin_eindil.46`): it fails (Eindil cannot die before stage 9), the host loses 1,000 manpower, delay +60, renown +5, and `zin_eindil_hunted` is set, which adds +1 to the ambush strength in stage 7.

#### Stage 5 — Gala (4A 1752)

**Host:** the Gala Elves (established). If the Gala Elves do not exist, the host is the country that has recruited `zin_lorien`; if none, the owner of Gala's capital, with Lorien re-recruited as an advisor by the event.

| Event | Choice | Effect |
| --- | --- | --- |
| A Stranger at Gala (CP 08, so "Turn him away for a season" is written first) | **Receive him** (hist) | Eindil recruited (advisor role "Guest of Lorien", no cost); regard +25 |
| | Turn him away for a season | Lorien relents after 180 days: delay +180; regard −10. The Gala Elves cannot refuse him for good (Lorien's established care for Erdae) |
| Weeks of Memory (60 days later) | flavour | renown +5 |
| **The Mirror of First Rain** (proposed device) | one option | Sets `zin_eindil_named`; `set_character_name`; trait `zin_eindil_heir_of_aen`; portrait E3; calls `zin_sun_spend_clarity` 30 ([lands_of_the_sun.md](lands_of_the_sun.md)). Gala reads the vision (burning capital, armies from west and east, death from the north, a shard of blue metal). If the Mirror is stilled (`zin_mirror_stilled`), Lorien names him 60 days later from memory and the records of the First Men, without the vision. The Worshipdom's report is the Afrit spec's `zin_afrit.31`, after that spec's delay (N8) |
| Lorien's Gift (30 days later) | **Equip him generously** (hist) | Gala pays what it has, up to 1,000 manpower and 500 infantry equipment, never below 0; the crew includes Gala elves: `zin_eindil_elven_crew` (ambush strength −1); regard +15 |
| | A ship and a sword, no more | No cost; regard +5 |

The naming is not public news. Courts learn his name only in stage 8, from Eindil himself.

#### Stage 6 — The Voyage North (4A 1753)

Lorien's ship sails north for 150 days (120 with Gala's `zin_gala_great_ship`) with island, western and elven crew (established). `zin_eindil_host` is cleared. Entering the stage refreshes the focus layouts of the Islands of the South, Triton's Islands, West Lands and Cold Lands countries (`mark_focus_tree_layout_dirty`, E4).

**Ports of call (proposed).** Three events, 40 days apart, each to one coastal country picked at random from, in order: the Islands of the South, Triton's Islands or the West Lands coast, and the Cold Lands west coast.

| Choice | Effect |
| --- | --- |
| **Resupply the ship** (hist for two of three) | −10 days delay; regard +10; renown +2. Under the dynamic rule its AI weight doubles for a port with the country flag `zin_eindil_safe_harbour` (regional and shared tree hook); no effect under the historical rule |
| Say nothing | nothing |
| **Report the ship to the Deliverer's priests** (hist for one of three: the port with the highest `zin_footholds`; AI weight rises with `zin_footholds` ≥ 2) | +50 political power; `zin_eindil_ports_betrayed` +1 (ambush strength +1); regard −30, applied at stage 8 |

**Afrit's side** (owned by [afrit_hidden_council.md](afrit_hidden_council.md)): `zin_afrit.31` *Word from the Lands of the Sun* is the only report of the naming (N8). Its options are the union of both specs: **Go north and lie in wait** (hist), **Go north and take Glo at once**, **Send others**, **Stay in Parim**. Going north runs the Afrit spec's voyage (`zin_afrit_northern_voyage`, `zin_afrit.32`: Chancellor Merovan holds the seals; sets `zin_aurevan_went_north`); arrival sets `zin_afrit_at_yeldenne`. The Glo spec reads which option was taken (its "The race to Yeldenne").

#### Stage 7 — The Ambush and Yeldenne (4A 1753)

**Landfall.** Event **Landfall in the Frozen North** to the owner of `zin_is_site_yeldenne_landing` (the coastal state nearest Mp'E; its key-sites row exists). Choices: **Stay out of strangers' quarrels** (hist): nothing. **Send guides inland**: ambush strength −1; regard +15. Yeldenne's own focuses can also lower it ([regional/yeldenne.md](../05_focus_trees/regional/yeldenne.md)).

**The ambush.** If Afrit's party waits at the approach (`zin_afrit_at_yeldenne`, Afrit not already in the hall), landfall fires the Afrit spec's private `zin_afrit.33` *The Ambush on the Shore* to the Worshipdom: **Spare none** (hist) or **Let them land**. With "Send others" the Council's agents wait instead (Afrit spec), with strength −1. Seven days after landfall, if the answer was "Spare none", `zin_eindil.71` *The Ambush* resolves with this strength (N9: the journey's base 5, plus 1 for each of the Afrit spec's terms):

`5 + zin_eindil_ports_betrayed + 1 if zin_eindil_hunted + 1 if the Worshipdom has zin_worshipdom_ships_ready + 1 if it has zin_worshipdom_hunters + 1 if its Whispers seat (zin_afrit_seat_whispers) ≥ 4 − 1 if zin_eindil_elven_crew − 1 per guide flag (landing owner's guides, zin_yeldenne_coast_watch, zin_yeldenne_beacon, zin_yeldenne_guides) − 1 if Afrit sent others`

| Strength | Outcome |
| --- | --- |
| ≥ 4 | **None Survive** (historical): the whole crew dies; Eindil goes on alone across the snow. Trait `zin_eindil_alone_in_the_snow` (timed, 180 days). Afrit reaches the hall first |
| 2–3 | **A Few Survive** (divergence): two companions live and become unit leaders of the later Host (characters `zin_eindil_companion_1`, `_2`, proposed, unnamed "Companions of the Voyage"); Afrit still reaches the hall first |
| ≤ 1 | **The Ambush Fails** (divergence): the crew lives; Afrit's party loses 20 days; Eindil reaches the castle first |

With "Let them land", or with no party waiting, there is no ambush: the crew lives and Eindil reaches the castle first.

On the historical path the strength is at least 4 (base 5, one betrayed port, elven crew, Yeldenne's coast watch, plus any Afrit terms): none survive, as in canon.

**The hall.** The confrontation and its outcomes belong to [Yeldenne and Glo](yeldenne_and_glo.md). Eindil's host at the hall is the owner of Mp'E. This system reads the result:

| Result | Journey effect |
| --- | --- |
| Glo given to Eindil (cases A, B1, B2; `zin_glo_with_eindil`) | trait `zin_eindil_bearer_of_glo`; renown +10; portrait E4; Eindil leaves with Glo and the blue sword |
| Glo sealed in the empty hall (Horos slain before Eindil came: cases C2, D2) | the seal opens for him: `zin_glo.80` 30 days after he arrives (the same day with `zin_yeldenne_calls_heir`); he learns the family truth from Glo's vision; same journey effects |
| Horos endures (cases C1, D1) | when Eindil arrives, Horos tests and gives Glo (case B2) |
| Glo dimmed (`zin_glo_dimmed`) | Eindil leaves without Glo; the journey continues; the New Gods' restoration later fails (*The Heir Does Not Rise*) |

**Leaving Yeldenne.** Event **The Bearer Leaves Yeldenne** (to Eindil's host or, if Mp'E's owner does not exist, to the Gala Elves as the friendly witness): Eindil knows that the king in Parim, worshipped as the Deliverer, is his brother, son of Ein. The text does not use the name Afrit unless `zin_afrit_revealed` is set.

#### Stage 8 — The Warnings (4A 1754–1757)

**Landfall in the Middle Lands.** Eindil comes ashore in the Middle Lands (proposed: Selen's coast). **Host:** Selen, through Alleria of Selen (`zin_alleria`), who investigates and shelters him (proposed role). If Selen does not exist, is capitulated or is ruled by `zin_aurevan`, the host is the Middle Lands country with the highest regard that is not an Aenor realm; then the Magical Forest. The landfall also fires Aenor's `zin_aenor.160` *The Lost Cause Divided* to the Aenor realm ([aenor_court_and_succession.md](aenor_court_and_succession.md)).

| Event | To | Choices |
| --- | --- | --- |
| **Alleria's Watch** | Selen (or substitute) | **Shelter him in secret** (hist): host; regard +25; Eindil recruited as corps commander; decision category `zin_eindil_guest` opens. **Hand him to the court**: the Aenor realm's government gets "The Impostor in Chains" (he escapes after 60 days to the Magical Forest); regard −50; delay +60 |
| **The Impostor** (CP 10) | the Aenor realm's government (Aurevan's crown, the Golden King if he survives, or another ruler) | **Leave it to the chancery** (first, non-committal; AI weight 0): nothing; checkpoint 10 resolves at its latest date. **Denounce and hunt the impostor** (hist under Aurevan): −50 political power; sets Aenor's `zin_aenor_eindil_denounced` (Aenor's Host camp −20, stability +3 %) and the Afrit spec's `zin_afrit_impostor_denounced`; starts the hunt (`zin_eindil_start_hunt`); fires the events spec's `zin_reign.83` once. **Let him speak**: renown +15; Aenor's Host camp +10, Lost Cause +5; every Concord dominion gets "Warnings of the Heir" at once; under Aurevan only a player may choose it. **Shelter him** (Light or Wild government only): Aenor's Host camp +25; country flag `zin_eindil_crown_shelters` (no hunt while it holds). **Seize him**: 60 %: as "Hand him to the court"; 40 %: the attempt fails and exposes the host (−50 opinion both ways between the crown and the host; the host keeps him) |
| **Warnings of the Heir** | every great power, every Middle Lands country, every country with regard ≥ 25; never Volgan, his subjects, Zol or the Worshipdom | **Heed the warning**: spirit `zin_eindil_warning_heeded` (730 days); country flag `zin_eindil_heeded`; regard +15; −25 opinion with the Aenor realm's crown; for a Middle Lands country, `zin_afrit_add_veil` −8 (−4 with `zin_afrit_impostor_denounced`). **Dismiss it** (hist for most): nothing. **Denounce him**: +25 opinion with the crown; regard −20 |

The Impostor is the one event for this moment (O4). It carries Aenor's side of the warning through the Aenor spec's effects ([aenor_court_and_succession.md](aenor_court_and_succession.md), "The stranger's warning"), which has no warning event of its own.

**What he says (D3).** The warning names him ("a man who calls himself Eindil, son of Ein") and says the king in Parim "is not what the temples say". It never names Afrit before `zin_afrit_revealed`.

**Who heeds on the historical path.** The AI heeds with chance equal to renown, but only frontier and scholarly realms: Selen, Mirolon, Kingson, Hiloron, the Magical Forest and the Gala Elves heed (hist); the other great powers dismiss; Aenor denounces. This matches "some men believed Eindil, especially among frontier troops, scholars of the First Men, and branches of the Lost Cause" (established).

**The hunt.** `zin_eindil_start_hunt` sets `zin_eindil_hunt_active`. It is called by "Denounce and hunt" and by the Afrit spec's private `zin_afrit.40` option "Hunt him". While the hunt runs, and no Aenor realm has `zin_eindil_crown_shelters`, the host rolls every 90 days: 15 % (+10 % if the host has `zin_footholds` ≥ 3) that the shelter is found. Found: the host chooses **Hide him in the hills** (−50 political power, stays host) or **Send him to the elves** (the stage moves on to the Magical Forest at once).

**Swear to the heir.** Decision `zin_eindil_swear_to_heir` (host only, regard ≥ 25, renown ≥ 40, after `1755.3.1`): sets the country flag `zin_eindil_sworn`. A sworn country is offered to become the Host of Eindil in stage 9. Selen swears on the historical path.

**To the elven woods (proposed).** When `zin_war_of_last_crowns` is set (or the hunt sends him), Eindil goes to the Magical Forest. Events:

- **The Bearer in the Forest** (Magical Forest): **Shelter the bearer** (hist): host; regard +20. **Send him on**: host becomes Nolorim or the elven realm with the highest regard; delay +60.
- **Varner and Golbran** (Magical Forest, 90 days later; 30 with the tree's `zin_magical_forest_wizard_found`): `zin_varner` and `zin_golbran` join him (the Magical Forest recruits them as advisors for the stage); internal flag `zin_eindil_golbran_joined`; renown +5.
- **A Dragon's Pact** (CP 19, so "Refuse" is written first; to the Keeper of Dragon Mountain, `zin_world_is_dragon_keeper`, [03_gameplay/04_magic_and_world_systems.md](../03_gameplay/04_magic_and_world_systems.md)): **Entrust a dragon to the bearer** (hist): sets `zin_eindil_dragon_pact`; the magic spec reserves one dragon from `zin_dragons_free`; the elves spec lowers `zin_elves_roost_bond` by 5; the dragon is a free ally, not a subject. AI chance: the historical weight, and the Keeper's AI takes this option at once when it has the Magical Forest tree's country flag `zin_magical_forest_bearer_dragon_ready` ([elves_wall_and_dragons.md](elves_wall_and_dragons.md)). **Refuse**: the pact is offered again every 180 days; on `1757.7.1` Varner persuades the elves and the pact is made anyway. If the pool is empty, the pact still holds (the return is established) but no dragon unit is granted.

#### Stage 9 — The Return (4A 1757)

**On Dragon's Wings.** World news: a man on a dragon comes down on the main battlefield of the Middle Lands. Sets `zin_eindil_returned`. The magic spec grants the reserved dragon to the Host (`zin_war_grant_dragons`, amount 1). The battlefield state is the Aenor-cored state with the most Zol divisions, else the most Volgan divisions, else the state next to Parim with the largest enemy army.

**The Wave of Glo.** If `zin_glo_with_eindil`, the first wave strikes Zol's dead in that state: `zin_glo_wave` with `first = yes` (owned by [Yeldenne and Glo](yeldenne_and_glo.md)), which destroys Zol's divisions there and in the adjacent Zol-controlled states with `damage_units` ("the sword in the earth"; no Zol or warfare effect takes part). Renown +10.

**The Host of Eindil** (scripted effect `zin_eindil_raise_host`, decision S2):

1. If a country has `zin_eindil_sworn` and still exists (historically Selen), it gets **Raise the Host of Eindil**:
   - **Raise the Host** (hist): Eindil becomes its field marshal and ruler-in-waiting; its own ruler stays. It takes the cosmetic name "The Host of Eindil" (`set_cosmetic_tag = zin_host_of_eindil`) and the spirit `zin_eindil_host_of_the_heir`; it gains claims (`add_state_claim`) on every Aenor-cored state owned by Volgan, Zol, the Worshipdom or a realm Afrit rules. If it is a subject, its overlord releases it for the war (`end_puppet`); at the coronation the Aenor spec's *A Charter of Equals* (`zin_aenor.402`) offers it its old place. Alleria stays its general.
   - **Stand beside him, remain ourselves**: go to step 2; the country joins the Host's coalition at once.
2. Otherwise (Selen gone, or no sworn country) a dynamic country is created (`create_dynamic_country`, original tag Aenor, so the Aenor spec's scripts treat it as an Aenor realm). It is named "The Host of Eindil" and led by Eindil as country leader (Light, trait `zin_eindil_king_without_a_house`) and field marshal. It takes one Aenor-cored state owned by an Aenor realm that is at war with Volgan or Zol and not ruled by `zin_aurevan` (`transfer_state`), and gets renown ÷ 10 divisions (minimum 3) of Aenoran survivors (`create_unit`, template "Host of the Heir", vanilla infantry until the warfare phase). If no such state exists, it is formed as a government in exile in the Magical Forest (`become_exiled_in`).
3. Every human player whose country has regard ≥ 50, and the player of a declining sworn country, gets **Ride with the Heir**: switch to the Host (`change_tag_from`). Declining keeps their country.

**The Coalition of the Living.** The Host forms or takes over the coalition.

- The Lost Cause is an institution inside Aenor's mechanic, not a faction, unless the Aenor realm took *The Shield of the Concord* (`zin_lost_cause_shield`, S3). **Give the Lost Cause to the Heir** goes to the leader of the faction named The Lost Cause if it exists, else to the original Aenor realm: **Give it to him** (hist if the Golden King is dead) sets `zin_lost_cause_with_eindil`; the faction's leadership passes to the Host (`set_faction_leader`) if there is one. **The league is the crown's**: nothing passes.
- If the Host leads no faction after this, it founds one named "The Lost Cause" with `create_faction_from_template` (template `zin_faction_lost_cause`, proposed, in the diplomacy spec's faction files: joining rule `zin_faction_rule_join_lost_cause`, the joiner has `zin_eindil_regard` ≥ 25 or stranded armies; leader-only war; leader never changes; E3).
- Invitations (`add_to_faction` on acceptance) go to every country with regard ≥ 25 and to every country with stranded armies: `zin_west_stranded` (Western Crossing), `zin_east_companies_with_eindil` (eastern kings), and any country with divisions in Aenor-cored states that is at war with Volgan or Zol. Joining does not make them subjects (established: he did not demand their independence). Joining calls `zin_eindil_join_coalition`.

**The battles.** Each needs Eindil's army in or next to the named enemy's ground (trigger `zin_eindil_army_near`: his HQ, `is_in_state`, is in the state or a neighbour). On the historical rule each fires on its date even without that.

| Order | Event | Condition (free rule) | Historical date | Effect |
| ---: | --- | --- | --- | --- |
| 1 | **Volgan at the Southern Front** (`.96`) | Eindil's army near a Volgan-controlled state | `1757.6.1` | Eindil struck down: timed unit leader trait `zin_eindil_struck_down` (60 days); the Host gets `zin_eindil_heir_has_fallen` (60 days); fires the Volgan spec's `zin_dominion.16` to Volgan |
| 1b | **Varner's Last Wards** (`.97`) | with 1, when Zol's dead are in the field (see Skips) | `1757.6.1` | Varner dies defending the living against Zol's dead: sets `zin_varner_dead`; calls the magic spec's `zin_world_raise_varners_wards` (once); the Host gets country flag `zin_golbran_spent`; `zin_varner` and `zin_golbran` are retired (Golbran lives, unseen) |
| 2 | **The Gathering of the New Gods** (`.98`) | 30 days after 1; needs `zin_glo_state` = 1 | `1757.7.1` | sets `zin_eindil_restored`; calls `zin_world_grant_new_gods_gift`; removes `zin_eindil_struck_down`; trait `zin_eindil_blessed_of_the_new_gods`; `zin_glo_add_power` 100; portrait E5. Without Glo: **The Heir Does Not Rise** (`.99`): sets `zin_eindil_lost` (divergence) |
| 3 | **The Blue Sword Through Volgan** (`.100`) | 30 days after 2; Eindil's army near a Volgan-controlled state | `1757.8.1` | calls the Volgan spec's `zin_volgan_destroy_body` (sets `zin_volgan_body_destroyed`) |
| 4 | **The Old God Comes Forth** (`.101`) | fired by the Zol spec's `zin_mistake.21` *One Finger*; if Eindil carries no Glo (no sword to break), by the Zol spec's `zin_zol_manifest` 7 days after the manifestation | Harvest 1757 | Zol manifests by his own rules (historically within 7 days of Volgan's body falling). `zin_mistake.21` alone sets `zin_horos_sword_broken` (N1, O4) and fires `.101` to the Host: `zin_eindil_wound` 120 days; Host war support −5 %. `.101` sets no flag; the Glo spec's pulse applies the broken sword. Lorien's stand and Zol's withdrawal belong to the Zol and Lands of the Sun specs |
| 5 | **Hailed as King** (`.102`) | after the Zol spec's `zin_mistake.24` (Zol withdraws), or on `1757.12.1` if Zol never manifested | Fallowing 1757 | renown +10; every coalition member: regard +10 |

The text keeps Volgan's spiritual fate open: "his body broke apart", never "Volgan is dead".

#### Stage 10 — The Cliff (4A 1758)

Afrit returns from the east with a new host (the Afrit spec sets `zin_afrit_returned`). The Afrit spec's private `zin_afrit.61` *Brother Against Brother* fires `zin_eindil.110` **The Cliff** to the Host, with a public variant to the Worshipdom. If stage 9 is not yet resolved, `.110` waits for it. Afrit wounds Eindil, severs an arm (the text does not say which) and casts him down. `.110` sets `zin_eindil_cast_down` (N3; the Afrit spec sets no flag of its own for this moment).

- Eindil's field marshal role is removed (`remove_unit_leader_role`). If he leads the Host as country leader (the dynamic Host, an Aenor realm), the journey calls Aenor's `zin_aenor_regency_while_king_lost`. The Host gets `zin_eindil_king_is_dead` until he recovers.
- **Below the Cliff** (to whichever country employs `zin_alleria`): **Search the ravine** (hist): Alleria finds him; he recovers in hiding for 180 days. **Mourn him**: he is found by scouts after 365 days instead. If no country employs Alleria, recovery takes 365 days.
- **Word of the King's Death** (news to all): the world believes him dead; regard and renown do not change.
- **The King Returns from the Dead** after recovery: sets `zin_eindil_recovered`; field marshal role re-added; trait `zin_eindil_maimed_unbroken`; portrait E6; `zin_eindil_king_is_dead` removed; for the dynamic Host, Aenor's `zin_aenor_restore_hailed_king`.

#### Stage 11 — The Palace (4A 1759)

Afrit holds Parim again (Afrit spec, `zin_afrit.62`). Eindil cannot storm the palace with armies; he goes in.

**Decision chain** (category `zin_eindil_palace`, the Host only; needs `zin_eindil_recovered`, `zin_afrit_holds_parim`, and the Afrit spec's preconditions for `zin_afrit_begin_palace_battle`: `zin_afrit_claims_erdae` or `zin_afrit_stand_in_parim`, not `zin_afrit_dead`):

| Decision | Days | Cost | Needs | Effect |
| --- | ---: | --- | --- | --- |
| Find the Old Service Passages | 30 | 50 PP | — | flag `zin_palace_passages` |
| Rally the Palace Rebels | 45 | 75 PP (150 PP if Alleria is not employed by the Host or a coalition member) | passages | flag `zin_palace_rebels` |
| Enter the Palace | 7 | — | both flags; date ≥ floor | calls `zin_afrit_begin_palace_battle` |

**The Battle in the Palace.** The Afrit spec's chain `zin_afrit.70`–`.76` rolls each stage and holds Afrit's defences (Alleria alive +20 at stage 1; every stage succeeds under the historical rule). Each success fires the matching journey event to the Host (proposed artifact names from the vault):

| Afrit stage succeeds | Journey event | What happens |
| --- | --- | --- |
| `zin_afrit.71` The Eye and the Ring | `.120` **An Arrow in the Eye** | Alleria's shot breaks Afrit's concentration; Eindil cuts off a finger and takes the Ring of Doors |
| `zin_afrit.73` The Bracelet (after `.72` The Seals of the Crown) | `.121` **The Seals Broken** | The rebels break the Crown of Witnesses' seals; Eindil turns Afrit's spell against the Bracelet of the First Seal |
| — (fired by `.121`) | `.122` **Into the Private Realm** | Afrit flees through the Necklace's passage; Eindil holds the chain and is carried with him |
| `zin_afrit.74` The Necklace | `.123` **Golbran's Last Working** | Golbran tears the Necklace away. Needs Golbran alive and with Eindil (`zin_eindil_golbran_joined`, not `zin_golbran_dead`); without him stage 4 cannot succeed (Afrit spec dependency) |
| `zin_afrit.75` The False God Falls | `.124` **The Death of a False God** | Eindil kills him. The Afrit spec's `zin_afrit_die` (called by that spec after stage 4) sets `zin_afrit_dead` |
| — (fired by `.124`) | `.125` **Golbran's Gift** | sets `zin_golbran_dead`; `zin_golbran` retired; Eindil lives |
| — (fired by `.125`) | `.126` **The Necklace** | sets `zin_eindil_wears_necklace`; no modifier (magic spec). The text says only that the Necklace is "an artifact of unresolved danger" |

**Failure (divergence).** If a stage fails, the Afrit spec's `zin_afrit.76` sets `zin_afrit_palace_held` and fires `.127` **The Palace Holds** to the Host: Eindil escapes wounded (`zin_eindil_wound` 120 days); the Host gets `zin_eindil_palace_failed` (stability −25 %, 180 days); the flags `zin_palace_passages` and `zin_palace_rebels` are cleared; the chain can be retried after 180 days (Afrit spec). A second failure sets `zin_eindil_lost`.

#### Stage 12 — Crowned (4A 1760)

On or after the floor, with `zin_afrit_dead`, the journey finds the **crowning realm** (`zin_eindil_go_to_parim`) and stores it in the global country variable `zin_eindil_crowning_realm`. It does not move Eindil: under S2 he stays the Host's general until his coronation, and moves to the crowning realm only inside the Aenor spec's `zin_aenor_crown_eindil` (O1).

1. If the Host is itself an Aenor realm (the dynamic Host), it is the crowning realm.
2. Else, an Aenor realm that exists, is not at war with the Host and is not ruled by `zin_aurevan` is the crowning realm.
3. Else, if no Aenor realm exists and the Host or a coalition member owns Parim's state, a new Aenor realm is created there (`create_dynamic_country`, original tag Aenor, with Parim's state and every Aenor-cored state the Host owns) and is the crowning realm.
4. Else (Parim held by an enemy), **The Crown Withheld** fires to the Host: it gets a war goal on Parim's owner (`create_wargoal`, type `take_state_focus`, Parim's state); the journey retries every 30 days.

Then the coronation is the Aenor spec's: `.130` **The Crown Is Offered** (to the Host and the crowning realm) calls `zin_aenor_people_choose` in the crowning realm, and 7 days later `zin_aenor.400` *The Crown of Aen* runs `zin_aenor_crown_eindil`. That effect calls `zin_aenor_receive_eindil` (Eindil leaves the Host through `zin_eindil_set_host` and becomes the realm's leader), sets `zin_eindil_crowned` and gives portrait E7 (Aenor spec, section 8). If the Host is Selen, `zin_eindil_after_coronation` drops its cosmetic name (`drop_cosmetic_tag`).

The end state this spec requires, applied by the journey's `zin_eindil_after_coronation` when `zin_eindil_crowned` is set:

- Eindil is country leader of the crowned Aenor realm, with trait `zin_eindil_rightful_king`.
- If the Host was a dynamic country and is not the crowned realm, `.131` **The Host Comes Home**: the crowned realm annexes it (`annex_country`); its player moves with `change_tag_from`.
- If the Host was a sworn country (Selen), it has already dropped the cosmetic name; Alleria stays its general; it stays independent. Its tie to Aenor is the Aenor spec's matter (the vault says the kingdoms need treaties, not forced submission).
- Every country with regard ≥ 50 gets `zin_eindil_first_friends` (1,825 days); friends and the resentful get their opinion modifiers toward the crowned realm.
- The world systems check `zin_ending_lost_cause` (called by `zin_aenor_crown_eindil`; [03_gameplay/05_world_tension_and_endings.md](../03_gameplay/05_world_tension_and_endings.md)).

### Divergences at a glance

| Who | Helps by | Hinders by | Consequence of hindering |
| --- | --- | --- | --- |
| Cold Lands host | nursing, provisions | binding him to service | delay; resentment; restless guest spirit |
| Coldor, Isengard | — | summoning him to court | short delay |
| Western hosts | mediation, open ford, fair trial | burnt granaries, closed ford, an example made | delay; regard loss; no coalition invitation later |
| Grey Ford Confederation and belligerents | the war-king's peace | refusing peace, keeping the war-king | lasting feud; the confederation breaks |
| Islands of the South | shelter, honouring his choice | selling news to the priests | Afrit's early hunters; stronger ambush |
| Gala Elves | receiving and equipping him | turning him away for a season, a poor outfit | delay; stronger ambush |
| Ports of call | resupply | reporting the ship | stronger ambush |
| Landing owner, Yeldenne | guides, beacon, coast watch | — | weaker ambush; crew may survive |
| The Worshipdom | — | ambush, strike at the hall early, early hunters, the hunt in stage 8 | see [Yeldenne and Glo](yeldenne_and_glo.md) |
| Middle Lands, great powers | heeding, sheltering, swearing | denouncing, handing him over | fewer believers; the veil holds longer; no coalition |
| The Aenor realm's crown | letting him speak, sheltering him | hunting him | the Deliverer's camp stays strong in the Concord |
| Magical Forest, the Keeper | shelter, dragon pact | refusing the pact | a later return (no later than `1757.7.1`) |

Late, non-historical outcomes (gameplay only, never history): **The Heir Is Lost** (`zin_eindil_lost`): the endings spec decides how the Lost Cause fares without him, and [Yeldenne and Glo](yeldenne_and_glo.md) lets a second bearer claim Glo.

## Implementation

### Builder module

| Item | Value |
| --- | --- |
| Module | `tools/content/modules/mech_eindil_journey.mjs`, exporting `buildEindilJourney(staged, data)`, called from `tools/content/build.mjs` like the existing modules; it returns its startup snippet for `common/on_actions/zin_startup.txt` |
| Data | `tools/content/data/mechanics/eindil_journey.json`: the stage table (floors as dates, conditions, hosts, site keys), the three pace date sets computed by the module, hosts and fallbacks, the event list with ids and pictures, spirits, traits, decisions and AI weights. Event text comes from the events specs as localisation data in the same file |
| Test | `tools/content/mech_eindil_journey.test.mjs`, added to the `test` script in `tools/package.json` (the integrator edits it) |
| Countries | named in the data (Selen, Gala Elves, Magical Forest, Coldor, Isengard, Gunwaith, Girdon, Howan, Nara, Verde, Enhis Is Rond, Nolorim, Mirolon, Kingson, Hiloron, Aenor, Worshipdom, Volgan, Zol); the module resolves them to tags from `tools/content/data/countries.json` |
| Replaces | no interim stub. `events/zin_world.txt` and `zin_interim_category` stay with vanilla_removal |

### Files written by the module

| Path | Contents |
| --- | --- |
| `common/unit_leader/zin_eindil.txt` | Eindil's unit leader traits |
| `common/country_leader/zin_eindil.txt` | Eindil's country leader traits |
| `common/ideas/zin_eindil.txt` | the spirits below (category `country`; icons `picture = zin_<catalog key>`) |
| `common/opinion_modifiers/zin_eindil.txt` | `zin_eindil_remembered` (+25), `zin_eindil_wronged` (−25) |
| `common/scripted_effects/zin_eindil.txt`, `common/scripted_triggers/zin_eindil.txt` | below |
| `common/decisions/zin_eindil.txt`, `common/decisions/categories/zin_eindil.txt` | categories `zin_eindil_guest`, `zin_eindil_host`, `zin_eindil_palace` |
| `events/zin_eindil.txt` | namespace `zin_eindil`, every id below and the events spec's 150–169 |
| `common/on_actions/zin_eindil.txt` | `on_annex`, `on_capitulation` (host safeguards) |
| `common/game_rules/zin_eindil.txt` | `zin_rule_eindil_journey` in the foundation's group `RULE_GROUP_ZIN` |
| `common/characters/zin_eindil.txt` | the two proposed companions (`zin_eindil_companion_1`, `_2`), recruited by nobody |
| `interface/zin_eindil.gfx` | `GFX_decision_zin_<key>` and category sprites pointing at existing catalog idea textures (`gfx/interface/ideas/zin/<key>.dds`) |
| `localisation/english/zin_eindil_l_english.yml` | all text, cosmetic tag `zin_host_of_eindil` (with `_DEF`, `_ADJ`), rule names (UTF-8 BOM through `yml()`) |
| `gfx/flags/zin_host_of_eindil.tga` (+ `medium/`, `small/`) | until the art pipeline generates its own, converted from Selen's generated flag |

`zin_eindil`, `zin_varner`, `zin_golbran`, `zin_alleria` and `zin_lorien` are defined by the characters module (02_lore). The key-site triggers come from the key-sites table generated into `common/scripted_triggers/zin_sites.txt`.

### Variables and flags

From the contract: `zin_eindil_stage`, and the flags `zin_eindil_awake`, `zin_eindil_war_king`, `zin_eindil_named`, `zin_eindil_returned`, `zin_varner_dead`, `zin_golbran_dead` (set here); `zin_horos_dead`, `zin_glo_with_eindil` (Glo); `zin_eindil_crowned` (Aenor); `zin_afrit_dead`, `zin_afrit_revealed` (Afrit); `zin_volgan_body_destroyed` (Volgan); `zin_zol_rising`, `zin_zol_manifested`, `zin_zol_withdrawn` (Zol); `zin_war_of_last_crowns` (world); `zin_footholds` (read).

Shared names this spec owns (in the contract additions register):

| Name | Kind | Scope | Meaning |
| --- | --- | --- | --- |
| `zin_eindil_renown` | variable | global, 0–100 | fame of his deeds |
| `zin_eindil_regard` | variable | country, −100–100 | how he remembers the country |
| `zin_eindil_delay` | variable | global, 0–900 | accumulated delay in days |
| `zin_eindil_host` | variable (country) | global | current host; unset at sea |
| `zin_eindil_heeded` | country flag | country | heeded his warnings |
| `zin_eindil_sworn` | country flag | country | swore to raise his Host |
| `zin_eindil_dragon_pact` | global flag | — | the elves entrusted a dragon |
| `zin_eindil_restored` | global flag | — | the New Gods restored him through Glo |
| `zin_horos_sword_broken` | global flag | — | Zol crushed Horos's sword (N1; set by the Zol spec's `zin_mistake.21`) |
| `zin_eindil_cast_down` | global flag | — | Afrit cast him from the cliff (N3; set by `zin_eindil.110`) |
| `zin_eindil_wears_necklace` | global flag | — | he took the Necklace of the Abyss |
| `zin_eindil_lost` | global flag | — | divergence: the heir is out of the story |
| `zin_lost_cause_with_eindil` | global flag | — | the Lost Cause follows Eindil (same meaning in the Aenor spec, N11) |

Read from the Afrit spec: `zin_aurevan_went_north` (set by `zin_afrit.32`), `zin_afrit_at_yeldenne`, `zin_afrit_returned`, `zin_afrit_impostor_denounced`, `zin_afrit_claims_erdae`, `zin_afrit_stand_in_parim`, `zin_afrit_palace_held`, the Worshipdom's flags `zin_worshipdom_ships_ready`, `zin_worshipdom_hunters` and the variable `zin_afrit_seat_whispers`. The cliff flag is this spec's `zin_eindil_cast_down` (N3); the return is the Afrit spec's `zin_afrit_returned`.

Read from other specs: `zin_cold_far_ice_charted`, `zin_cold_neck_road` (Cold Lands); `zin_eindil_safe_harbour` (regional and shared tree hook); `zin_magical_forest_wizard_found`, `zin_magical_forest_bearer_dragon_ready` (Magical Forest tree).

Shared names this spec owns in the register (contract additions): `zin_eindil_crowning_realm` (global country variable, the realm the crown is offered in; read by the Aenor spec), `zin_eindil_reef_island` (country flag, set by `.42`), and `zin_eindil_start_hunt` (effect, called by the Afrit spec), `zin_eindil_hunt_active` (global flag), `zin_eindil_wound` (effect, arg `days`), `zin_eindil_crown_shelters` (country flag, Aenor realm), `zin_host_of_eindil` (cosmetic tag), `zin_eindil_has_host` and `zin_eindil_army_near` (triggers).

Internal (not shared): `zin_eindil_ports_betrayed` (global count), flags `zin_eindil_hunted`, `zin_eindil_elven_crew`, `zin_eindil_stage_3_done`, `zin_eindil_golbran_joined`, `zin_eindil_recovered`, `zin_palace_passages`, `zin_palace_rebels`, country flag `zin_golbran_spent`, `zin_eindil_episode_<n>_done`.

### Scripted triggers

| Trigger | True when |
| --- | --- |
| `zin_eindil_is_host` | `ROOT` is `var:global.zin_eindil_host` |
| `zin_eindil_has_host` | `global.zin_eindil_host` is set (used by the Yeldenne tree) |
| `zin_eindil_floor_reached` | `global.num_days` ≥ the current stage's floor for the current `zin_story_pace` + `global.zin_eindil_delay` (generated from the data) |
| `zin_eindil_friend` | `zin_eindil_regard` ≥ 25 |
| `zin_eindil_resents` | `zin_eindil_regard` ≤ −25 |
| `zin_eindil_historical` | `zin_rule_eindil_journey` is HISTORICAL, or DEFAULT and the foundation's `zin_rules_is_historical` |
| `zin_eindil_can_lead` | Eindil is employed by `ROOT` and has neither `zin_eindil_struck_down` nor `zin_eindil_grievously_wounded`, and is not cast down without `zin_eindil_recovered` |
| `zin_eindil_army_near` (state scope) | `zin_eindil` is a deployed general whose HQ is in this state or a neighbour (`is_in_state`) |
| `zin_is_site_eindil_ice`, `zin_is_site_three_oaths`, `zin_is_site_winter_ford`, `zin_is_site_south_shrine`, `zin_is_site_yeldenne_landing`, `zin_is_site_palace_cliff` | site triggers from the [key sites](../01_map/02_key_sites.md) table, which owns them (E7); every one has its row there, the Yeldenne landing (the coastal state nearest Mp'E) included |

### Scripted effects

| Effect | Does |
| --- | --- |
| `zin_eindil_advance_stage` | adds 1 to `zin_eindil_stage`, sets the stage's flags, fires the stage's first event to its host. When it sets `zin_eindil_awake` or `zin_eindil_war_king`, or enters stage 6, it refreshes the focus layouts of the countries whose trees read them (`mark_focus_tree_layout_dirty` on every Cold Lands and West Lands country, and at stage 6 the four regions named in the stage 6 section; E4) |
| `zin_eindil_set_host` | `set_variable = { global.zin_eindil_host = ROOT }`; in the old host `retire_character = zin_eindil` and clears `zin_potent_magic`; in ROOT `recruit_character = zin_eindil`, then the stage's role (`add_corps_commander_role`, `add_field_marshal_role` or `add_advisor_role`) and the traits he has earned (re-applied from global flags); sets the country flag `zin_potent_magic` while `zin_glo_state` = 1 (the only script of this spec that sets it, magic spec); calls `zin_glo_follow_bearer` (Glo spec). The Linux run confirms that a retired character can be recruited by another country; if not, the module defines one character per phase sharing the id prefix `zin_eindil` |
| `zin_eindil_clear_host` | removes his roles; clears `global.zin_eindil_host` (at sea) |
| `zin_eindil_add_renown` (`value`) | clamps to 0–100 |
| `zin_eindil_add_regard` (`value`) | on ROOT; clamps; applies or removes the opinion modifiers at ±25 when the Host exists |
| `zin_eindil_add_delay` (`value`) | clamps 0–900 |
| `zin_eindil_start_hunt` | sets `zin_eindil_hunt_active`; starts the 90-day discovery roll on the host |
| `zin_eindil_wound` (`days`, default 120) | `add_timed_unit_leader_trait` `zin_eindil_grievously_wounded` for that many days |
| `zin_eindil_raise_host` | stage 9 Host creation as designed above |
| `zin_eindil_join_coalition` | ROOT joins the Host's faction |
| `zin_eindil_aid_host` (`manpower`, `equipment`, `type`) | ROOT sends `equipment` units of the equipment chosen by `type` (`send_equipment`) and `manpower` (`add_manpower` −n on ROOT, +n on the Host) to the Host. `type` codes: 0 `zin_arms_equipment` (default; `infantry_equipment` until warfare stage 2), 1 `zin_giant_gear_equipment`, 2 `zin_yeti_gear_equipment`, 3 `zin_troll_gear_equipment`, 4 `zin_elven_arms_equipment` (warfare spec ids) |
| `zin_eindil_go_to_parim` | stage 12 steps 1–4: sets `zin_eindil_crowning_realm`, fires `.130`; never moves Eindil |
| `zin_eindil_after_coronation` | stage 12 end state |

**Arguments (E1).** Scripted effects take no parameters: each argument above is the temporary variable `zin_arg_<name>` (`zin_arg_value`, `zin_arg_days`, `zin_arg_manpower`, `zin_arg_equipment`, `zin_arg_type`) set by the caller just before the call; the effect reads and clears it. The Western Crossing's `zin_west_on_war_king` takes its `event` code (named, refused, released, fled) from that spec's code list.

Effects owned by other systems that this spec calls: `zin_afrit_add_veil`, `zin_afrit_begin_palace_battle` (Afrit); `zin_aenor_people_choose`, `zin_aenor_crown_eindil` (through `zin_aenor.400`), `zin_aenor_regency_while_king_lost`, `zin_aenor_restore_hailed_king`, `zin_aenor_receive_eindil` (Aenor); `zin_volgan_destroy_body` (Volgan); `zin_west_end_ford_war`, `zin_west_on_war_king` (Western Crossing); `zin_world_raise_varners_wards`, `zin_world_grant_new_gods_gift` (magic); `zin_sun_spend_clarity` (Lands of the Sun); `zin_glo_wave`, `zin_glo_add_power`, `zin_glo_follow_bearer` (Yeldenne and Glo); `zin_cold_send_wardens`, `zin_cold_reward_ice_host` (Cold Lands). Events of other systems it fires: `zin_glo.5`, `zin_afrit.33`, `zin_dominion.16`, `zin_aenor.160`, `zin_leren.45`, `zin_reign.83`, `zin_ending.80`. This spec adds nothing to `zin_gathering_dark`; the tension spec counts its flags.

### Characters and traits

`zin_eindil` portraits follow the characters spec's states, swapped with `set_portraits`: **E1** at stage 1, **E2** as war-king, **E3** at the naming, **E4** with Glo, **E5** at the restoration, **E6** after the cliff, **E7** at the coronation (Aenor's `zin_aenor.400`). Until the art pipeline generates them (request), every state uses the portraits module's `GFX_zin_portrait_men_male_1`. Starting skills as corps commander: skill 4 (attack 4, defence 4, planning 3, logistics 3), design targets.

| Trait | Type | Added | Effect (design targets) |
| --- | --- | --- | --- |
| `zin_eindil_man_from_the_ice` | unit leader | stage 1 | attack_skill +1, defense_skill +1; `winter_attrition_factor` −0.25, `army_morale_factor` +0.05 |
| `zin_eindil_war_king` | unit leader | stage 3 (kept) | planning_skill +1; `army_morale_factor` +0.10, `army_org_factor` +0.05 |
| `zin_eindil_heir_of_aen` | unit leader | stage 5 | attack_skill +1, defense_skill +1 |
| `zin_eindil_alone_in_the_snow` | unit leader, timed 180 days | stage 7 | `army_morale_factor` −0.10 |
| `zin_eindil_bearer_of_glo` | unit leader | with Glo | `army_attack_factor` +0.10, `army_defence_factor` +0.10, `army_org_factor` +0.10 |
| `zin_eindil_struck_down` | unit leader, timed 60 days | battle 1 | `army_attack_factor` −0.50, `army_morale_factor` −0.30 |
| `zin_eindil_blessed_of_the_new_gods` | unit leader | `zin_eindil_restored` | attack_skill +2, defense_skill +1; `army_attack_factor` +0.15, `army_morale_factor` +0.10 |
| `zin_eindil_grievously_wounded` | unit leader, timed (`zin_eindil_wound`) | battle 4; failed palace | `army_attack_factor` −0.30, `army_org_factor` −0.20 |
| `zin_eindil_maimed_unbroken` | unit leader | after the cliff | attack_skill −1; `army_morale_factor` +0.10 |
| `zin_eindil_king_without_a_house` | country leader | dynamic Host | `war_support_factor` +0.10, `stability_factor` +0.05, `political_power_gain` +0.25 |
| `zin_eindil_rightful_king` | country leader | coronation | `stability_factor` +0.15, `political_power_gain` +0.5, `drift_defence_factor` +0.30 |

### Spirits

| Key | Name | Icon | Modifiers | Added / removed |
| --- | --- | --- | --- | --- |
| `zin_eindil_stranger_among_us` | The Stranger Among Us | `footprints_snow` | `stability_factor` +0.03, `army_morale_factor` +0.05 | host in stages 1–2; removed when he leaves |
| `zin_eindil_restless_guest` | A Restless Guest | `chain_broken` | `stability_factor` −0.05 | a host that binds or detains him; removed when he leaves |
| `zin_eindil_burned_granaries` | Burned Granaries | `granary` | `stability_factor` −0.10 | timed 180 days |
| `zin_eindil_judgment_honoured` | The Stranger's Judgment | `scroll_sealed` | `stability_factor` +0.05, `political_power_gain` +0.10 | timed 365 days |
| `zin_eindil_war_kings_banner` | The War-King's Banner | `banner_plain` | `army_morale_factor` +0.10, `army_org_factor` +0.05, `war_support_factor` +0.05 | confederation members during stage 3 |
| `zin_eindil_war_kings_peace` | The War-King's Peace | `banner_laid_down` | `stability_factor` +0.05, `opinion_gain_monthly_factor` +0.15 | timed 730 days |
| `zin_eindil_ford_shunned` | Shunned at the Ford | `grey_ford` | `stability_factor` −0.10 | a belligerent under *Enforce the War-King's Peace*; 90 days |
| `zin_eindil_the_sea_went_silent` | The Sea Went Silent | `island_shrine` | `stability_factor` +0.05, `war_support_factor` +0.03 | timed 365 days |
| `zin_eindil_warning_heeded` | The Warning Heeded | `eye_watchful` | `army_core_defence_factor` +0.05, `dig_in_speed_factor` +0.10, `conscription_factor` +0.03 | stage 8 heed; timed 730 days |
| `zin_eindil_host_of_the_heir` | The Host of the Heir | `crown_hailed` | `war_support_factor` +0.15, `army_morale_factor` +0.10, `conscription_factor` +0.10, `army_core_defence_factor` +0.10 | the Host from stage 9 to the coronation |
| `zin_eindil_heir_has_fallen` | The Heir Has Fallen | `lone_sword` | `army_morale_factor` −0.10 | timed 60 days |
| `zin_eindil_king_is_dead` | They Say the King Is Dead | `cliff_edge` | `war_support_factor` −0.10, `stability_factor` −0.10 | from the cliff to his recovery |
| `zin_eindil_palace_failed` | The Palace Holds | `palace_wards` | `stability_factor` −0.25 | timed 180 days |
| `zin_eindil_first_friends` | First Friends of the King | `handshake_oath` | `stability_factor` +0.05, `trade_opinion_factor` +0.20 | coronation, regard ≥ 50; timed 1,825 days |

### Decisions

| Category / decision | Who | Cost | Effect |
| --- | --- | --- | --- |
| `zin_eindil_guest` / Ask the Stranger's Counsel | host | 25 PP; 90-day cooldown | stability +2 %, war support +2 % |
| `zin_eindil_guest` / Speed Him On | host | 50 PP | delay −30; regard +10; ends the host's part of the stage |
| `zin_eindil_guest` / Detain Him | host (not Gala, not the owner of Mp'E) | — | he stays 180 days more; delay +90; regard −30; `zin_eindil_restless_guest` |
| `zin_eindil_guest` / Swear to the Heir | stage 8 host, regard ≥ 25, renown ≥ 40, after `1755.3.1` | 100 PP | `zin_eindil_sworn` |
| `zin_eindil_guest` / Enforce the War-King's Peace | confederation leader, a belligerent fights on | 50 PP | that belligerent gets `zin_eindil_ford_shunned` for 90 days; *The War-King's Terms* fires to it again; no war is declared |
| `zin_glo_bearer` / Glo's Wave | the Host (decision owned by [Yeldenne and Glo](yeldenne_and_glo.md)) | 30 Glo power; 60-day cooldown | `zin_glo_wave` on a state near Eindil's army |
| `zin_eindil_host` / Call the Stranded Armies | the Host | 50 PP | invitations to stranded countries again (`zin_west_stranded`, `zin_east_companies_with_eindil`) |
| `zin_eindil_palace` / the three palace decisions | the Host | see stage 11 | see stage 11 |

### Events (namespace `zin_eindil`)

| Id | Title | To | Trigger | Picture |
| --- | --- | --- | --- | --- |
| 1 | (hidden) Journey setup | the anchor country | on_startup: stage 0, renown 0, delay 0; starts the pulse | — |
| 2 | (hidden) Journey pulse | the anchor country | every 7 days; checks floors and conditions, calls `zin_eindil_advance_stage`, guest rules | — |
| 10 | The Man in the Ice | ice host | stage 1 | `man_in_ice` |
| 11 | Talk of a Man from the Ice | Coldor, Isengard | stage 1 + 60 days; Coldor's wardens option with `zin_cold_far_ice_charted` | `generic_court` |
| 12 | The Traders' Road South | ice host | end of stage 1; the Neck Road addition with `zin_cold_neck_road` | `traders_road_south` |
| 20 | The Bridge of the Three Oaths | site owner | stage 2 | `traders_road_south` |
| 21 | Girdon's Winter Ford | Girdon or site owner | stage 2 + 45 days | `grey_ford_truce` |
| 22 | Judgment in Gunwaith | Gunwaith | stage 2 + 90 days | `generic_court` |
| 23 | The King Without a House | West Lands countries | end of stage 2 | `war_king` |
| 30 | The Grey Ford Breaks | confederation leader | `zin_west_grey_ford_war` in stage 3 | `war_king` |
| 31 | Feud on the Grey Ford | confederation leader | stage 3 fallback | `grey_ford_truce` |
| 32 | A Crown Offered | confederation leader | after 30 or 31; CP 04 | `war_king` |
| 33 | The War-King's Terms | each western belligerent | 32 + 60 days | `grey_ford_truce` |
| 34 | The Crown Laid Down | confederation leader | peace holds | `war_king` |
| 35 | The War-King Lays Down His Crown | news, West Lands, Concord, Aenor | after 34 | `war_king` |
| 40 | West Over the Sea | departure host | stage 4 | `generic_sea` |
| 41 | Wreck on the Southern Isles | wreck host | 40 + 30 days; "Sell news" needs footholds ≥ 1 | `storm_wreck` |
| 42 | The Reef of Drowned Voices | island host | 41 + 60 days; sets `zin_eindil_reef_island` on the receiver | `storm_wreck` |
| 43 | The Shrine Beneath the Tide | shrine owner | 41 + 120 days | `storm_wreck` |
| 44 | Stay and Rule Us | island with highest regard | 41 + 180 days | `storm_wreck` |
| 45 | Carry the Old Tales to Gala | island host | end of stage 4 | `storm_wreck` |
| 46 | Hunters in the Isles | island host | 90 days after `zin_glo.5` "Send hunters" | `storm_wreck` |
| 50 | A Stranger at Gala | Gala Elves | stage 5; CP 08 | `gala_court` |
| 51 | Weeks of Memory | Gala Elves | 50 + 60 days | `gala_court` |
| 52 | The Mirror of First Rain | Gala Elves | 51 + 30 days | `gala_court` (until the catalog adds `mirror_courtyard`) |
| 54 | Lorien's Gift | Gala Elves | 52 + 30 days | `gala_court` |
| 60 | Lorien's Ship Sails North | Gala Elves | stage 6 | `generic_sea` |
| 61 | A Ship at Our Harbour | port of call (three times) | stage 6, every 40 days; `zin_eindil_safe_harbour` doubles the resupply weight (dynamic rule) | `generic_sea` |
| 70 | Landfall in the Frozen North | landing owner | stage 7 | `cold_shore` |
| 71 | The Ambush | landing owner and Yeldenne; private variant to the Worshipdom | 70 + 7 days, after `zin_afrit.33` "Spare none" | `cold_shore` |
| 72 | Alone in the Snow | Yeldenne (news) | ambush ≥ 4 | `cold_shore` |
| 73 | The Bearer Leaves Yeldenne | Eindil's host or witness | after the hall with `zin_glo_with_eindil` | `glo_given` |
| 80 | A Stranger on Selen's Shore | stage 8 host | stage 8 | `generic_court` |
| 81 | Alleria's Watch | Selen or substitute | 80 + 7 days | `generic_court` |
| 82 | The Impostor | the Aenor realm's government | 81 + 30 days; CP 10 | `generic_court` |
| 83 | Warnings of the Heir | great powers, Middle Lands, friends | 81 + 60 days | `southern_warning` |
| 84 | The Hunt for the Impostor | host | every 90 days while the hunt runs | `generic_court` |
| 85 | The Impostor in Chains | the Aenor realm's government | handed over or seized | `generic_court` |
| 86 | The Bearer in the Forest | Magical Forest | `zin_war_of_last_crowns` or the hunt | `generic_wilds` |
| 87 | Varner and Golbran | Magical Forest | 86 + 90 days | `generic_wilds` |
| 88 | A Dragon's Pact | the Keeper | 87 + 60 days, repeats every 180; CP 19 | `generic_wilds` (until the catalog adds `dragon_roosts`) |
| 90 | On Dragon's Wings | news, all | stage 9 | `dragon_return` |
| 91 | The Wave of Glo | Host, Zol | 90 + 1 day | `dragon_return` |
| 92 | Raise the Host of Eindil | sworn country | 90 + 1 day | `lost_cause_triumph` |
| 93 | Ride with the Heir | qualifying human players | after the Host exists | `lost_cause_triumph` |
| 94 | The Coalition of the Living | invitees | 92 + 7 days | `lost_cause_triumph` |
| 95 | Give the Lost Cause to the Heir | the Lost Cause's leader | 92 + 7 days | `lost_cause_triumph` |
| 96 | Volgan at the Southern Front | Host, Volgan | battle 1 | `generic_war` |
| 97 | Varner's Last Wards | Host, Magical Forest | with 96 | `generic_war` |
| 98 | The Gathering of the New Gods | Host | battle 2 | `glo_given` |
| 99 | The Heir Does Not Rise | news, all | battle 2 without Glo | `king_is_dead` |
| 100 | The Blue Sword Through Volgan | Host, Volgan | battle 3 | `volgan_broken` |
| 101 | The Old God Comes Forth | Host | fired by `zin_mistake.21`, or by `zin_zol_manifest` when Eindil carries no Glo | `vast_shadow` |
| 102 | Hailed as King | coalition | battle 5 | `lost_cause_triumph` |
| 110 | The Cliff | Host; public variant to the Worshipdom | fired by `zin_afrit.61` | `cliff` |
| 111 | Below the Cliff | Alleria's employer | 110 + 3 days | `cliff` |
| 112 | Word of the King's Death | news, all | 110 + 7 days | `king_is_dead` |
| 113 | The King Returns from the Dead | Host | recovery done | `cliff` |
| 120–126 | The Battle in the Palace | Host | fired by the Afrit chain (stage 11 table) | `palace_battle` |
| 127 | The Palace Holds | Host | fired by `zin_afrit.76` | `palace_battle` |
| 130 | The Crown Is Offered | Host and crowning realm | stage 12 (`zin_eindil_go_to_parim`) | `coronation` |
| 131 | The Host Comes Home | the dynamic Host | after `zin_aenor.400` | `coronation` |
| 132 | The Crown Withheld | Host | Parim held by an enemy | `generic_war` |
| 140 | The Heir Is Lost | news, all | `zin_eindil_lost`; fires the endings spec's `zin_ending.80` with `days = 14` | `king_is_dead` |
| 150–169 | events spec additions | as there | as there | as there |

News events use `GFX_zin_news_<key>`: 90 `dragon_return`, 99/112/140 `king_is_dead`, 120–126 `palace_battle`. Every picture key above exists in game. Every event writes `timeout_days = 30`; CP events carry the data field `checkpoint` (E2).

**Requested pictures and art** (generated through the [icon catalog](../05_focus_trees/02_icon_catalog.md) pipeline; image-generated only):

| Key | Shows | Gate | Used by (now using) |
| --- | --- | --- | --- |
| `mirror_courtyard` | A spring in an old elven courtyard at dusk, no figures | — | `.52` (`gala_court`) |
| `dragon_roosts` | Dragons on high mountain ledges, no riders | — | `.88` (`generic_wilds`) |
| Eindil portraits E1–E7 | E1 wanderer (stage 1), E2 war-king, E3 named at Gala, E4 bearer of Glo, E5 restored, E6 maimed (after the cliff), E7 crowned | — | `set_portraits` at each state (`GFX_zin_portrait_men_male_1` until generated) |
| `zin_host_of_eindil` flag | The Host of Eindil's cosmetic flag (normal, medium, small) | — | the cosmetic tag (Selen's generated flag until then) |

**The anchor country** for the pulse is the current host; at sea, the Gala Elves; if the Gala Elves do not exist, the first existing of the Magical Forest, Selen, Aenor. `on_annex` and `on_capitulation` re-resolve the host: if the host is annexed, Eindil moves to the annexed country's friend with the highest regard (+30 days delay), never to the annexer.

**Secret-safe text.** Every event above shown to anyone but the Worshipdom uses "the Deliverer", "Aurevan" or "the king in Parim" until `zin_afrit_revealed`. Localisation keys that may name Afrit end in `_hub` (shown only to the Worshipdom) or `_revealed` (shown only after `zin_afrit_revealed`); events 110 and 120–126 have both variants. No key of an event that can fire before `zin_eindil_named` contains "Eindil".

### Game rules

`zin_rule_eindil_journey` (group `RULE_GROUP_ZIN`, "Erdae"):

| Option | Effect |
| --- | --- |
| DEFAULT (default) | follows `zin_rule_historical_path`: HISTORICAL takes the "(hist)" options; PLAUSIBLE weighs them ×3; FREE uses the weights below |
| HISTORICAL | AI always takes the "(hist)" options; delay from AI is 0 |
| FREE | AI chooses with the weights below |

Players always choose freely. `zin_rule_eindil_waking` (foundation, owned here) sets the stage 1 floor.

### Interface

The interface spec owns the windows ([07_interface/01_interface.md](../07_interface/01_interface.md)): the rumour line in the Realm panel from `zin_eindil_awake`, the host's Erdae bar meters, and the tracker *The Road of the Stranger* (section 10). This spec supplies the variables and the stage names. Nothing shows at stage 0.

## AI

- **Historical rule:** every "(hist)" option; the Grey Ford Confederation forms; one port of call reports the ship; the Gala Elves equip him generously; nobody sends guides; the Worshipdom lies in wait; Selen shelters, swears and raises the Host; the Aenor realm denounces him under Aurevan; the Magical Forest shelters and the Keeper grants the dragon; the Lost Cause passes to the Host.
- **Free rule:** help options base 70; hinder base 10. Modifiers: ×3 hinder if the country has `zin_footholds` ≥ 3; ×2 hinder if Dominion with stance `zin_dom_warlord` (binding a great warrior); ×0 hinder for Light countries with stance `zin_light_wardens` or `zin_light_sanctuary`; ×2 help if already a friend. AI never takes "Try to keep the war-king" or *Enforce the War-King's Peace*.
- **AI hosts with Eindil as a general** put him on their largest defensive front; never on an offensive front.
- **The Host (AI):** `add_ai_strategy` (`front_unit_request` and `area_priority`) against Zol, then Volgan, then the realm Afrit rules; `protect` toward Parim's owner if friendly; `befriend` toward every friend. It uses Glo's Wave whenever Glo power ≥ 30 and Zol divisions stand near Eindil's army. It starts the palace chain as soon as it is available.
- **Coalition invitees** accept with chance 30 % + regard % (+40 % stranded, +15 % with `zin_west_remembers_war_king`); under the historical rule, friends and stranded countries accept.

## Acceptance

(a) build test (`npm test`), (b) the isolated Linux run (one in-game year from phase 3 on, S8; error.log has no new lines from ZIN files), (c) a scenario run with HOI4 Agent Tools (`hoi4_scenario_test`, `hoi4_mechanic_test`) on the mod source.

1. (a) Every `zin_eindil` event id is defined once; every event, decision, idea, trait and effect the files reference is defined; every option has localisation and an `ai_chance`; every picture key exists in `interface/zin_event_pictures.gfx`.
2. (a) No localisation key outside the `_hub` and `_revealed` sets contains "Afrit"; no key of an event that can fire before `zin_eindil_named` contains "Eindil".
3. (a) Every modifier in the trait and spirit tables is in the 1.19.3 modifier documentation; every effect and trigger named is in the effect and trigger documentation (generator test against the local documentation).
4. (a) The floor trigger holds three date sets, and the STANDARD set equals the stage table's floors.
5. (b) On 1 Thaw 1748 `zin_eindil_stage` is 0 and no country employs `zin_eindil`; the run's year passes with no ZIN error line.
6. (c) With `zin_rule_historical_path` HISTORICAL and no player, the scenario run reaches stage 12 by `1760.12.31`, and each stage starts within 120 days after its floor.
7. (c) On that run the flags are set in this order: `zin_eindil_awake`, `zin_eindil_war_king`, `zin_eindil_named`, `zin_horos_dead` with `zin_glo_with_eindil`, `zin_eindil_returned`, `zin_varner_dead`, `zin_eindil_restored`, `zin_volgan_body_destroyed`, `zin_horos_sword_broken`, `zin_eindil_cast_down`, `zin_afrit_dead`, `zin_golbran_dead`, `zin_eindil_wears_necklace`, `zin_eindil_crowned`.
8. (c) On that run the ambush strength is ≥ 4 and the crew dies; Selen is the Host; Eindil is Selen's field marshal, not its country leader, until the coronation.
9. (c) The character's name reads "The Man from the Ice" before `zin_eindil_named` and "Eindil" after.
10. (c) A host that starts an offensive war loses Eindil within one pulse; a border war does not (negative test).
11. (c) Every hindrance option adds delay and never sets `zin_eindil_lost` before stage 9 (one scenario per option).
12. (c) Annexing the stage host moves Eindil to a friend, never the annexer, and the journey continues (negative test).
13. (c) With the war never starting, stage 9 begins on `1758.3.1` and the journey still ends in stage 12 or `zin_eindil_lost`.
14. (c) Without Selen, the dynamic Host is created as an Aenor realm; a player there can play it; a player elsewhere with regard ≥ 50 is offered the switch and the switch moves the player.
15. (c) At the coronation Eindil is the crowned realm's country leader and, if the Host was dynamic and not crowned itself, it no longer exists.
16. (c) Under SLOW story pace, stage 1 starts on the shifted floor, not on `1749.2.1`.
17. (a) Every event marked CP carries `checkpoint` and its first option is not the historical one; no generated file contains a name from the contract register's retired table (the name check); the generated files contain no `create_faction`.
18. (c) On the historical run no Aenor realm's leader is `zin_eindil` before `zin_aenor_crown_eindil` runs, and he is the crowning realm's leader the same day; `zin_eindil_crowning_realm` is set before `.130` fires.
19. (c) A scenario with `zin_eindil_lost` set fires `.140` and, 14 days later, `zin_ending.80`; a scenario in which Zol manifests while Eindil carries no Glo fires `.101` once and never sets `zin_horos_sword_broken`.

## Open questions

The owner's questions are in [OPEN_QUESTIONS.md](../OPEN_QUESTIONS.md), "eindil and glo" 1–6 and 10. The work proceeds on these proposals:

1. **Can Eindil die in play?** Safe before stage 9; lost only in the late divergences (no Glo at the New Gods, two failed palace attempts).
2. **The western confederation.** The "Grey Ford Confederation", a third party built from regard.
3. **The sites.** Eindil's ice, the bridge, the ford, the shrine (Enhis Is Rond) and the landing are placed by the map step; Howan is the wreck island.
4. **1754 to 1757.** Selen (Alleria), then the Magical Forest with Varner and Golbran and the dragon pact.
5. **The Host of Eindil.** Selen with Eindil as its general and ruler-in-waiting (decision S2); a dynamic Aenor realm only if Selen is gone.
6. **Horos's words.** The name Afrit stays hidden from everyone but the Worshipdom until `zin_afrit_revealed`.
7. **Arm, Necklace, Horos's spirit, Glernaen.** Never stated.
