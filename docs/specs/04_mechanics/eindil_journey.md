# Eindil's journey

**Status:** Draft. **Priority:** 3. **Phase:** 3 (system and AI); event text in Phase 5 ([06_events](../06_events/)).

## Purpose

Eindil's journey is the world system that carries the heir of Aen from the ice of the Cold Lands to the throne of Aenor between 4A 1749 and 4A 1760. It is not one country's mechanic. Eindil moves through a chain of host countries, and each host decides whether to help or hinder him. The system:

- keeps the historical path runnable without a player (stage by stage, on the vault's proposed dates);
- gives every country that meets him a real choice, with consequences that reach the endings;
- makes Eindil a guest general first, then the leader of a playable country, the Host of Eindil;
- respects the start: on 1 Thaw 4A 1748 Eindil sleeps, nobody knows of him, and nothing in this system is visible.

The Castle of Yeldenne, Horos and Glo are a separate system with their own spec, [yeldenne_and_glo.md](yeldenne_and_glo.md). This spec hands over to it at stage 7 and reads its results.

## Lore basis

| Fact | Status | Source |
| --- | --- | --- |
| Eindil is son of Ein, grandson of Aen, brother of Afrit, of the First Men; strongest man of the Fourth Age | established | *Eindil* |
| He wakes in the Cold Lands without memory; tribes find and nurse him; West Lands travellers take him south | established | *Eindil*, *The Journey of Eindil* |
| He helps communities, makes peace, briefly serves as a western war-king and lays the title down | established | *Fourth Age Canon Register* |
| He sails for Aenor; storms carry him to the Islands of the South; he lives among the islanders | established | *Fourth Age Canon Register* |
| He travels to the Gala elves; Lorien names him son of Ein after weeks of talk and a vision; gives ship, armour, sword and crew; sends him to Horos | established | *Lorien*, *Fourth Age Canon Register* |
| Afrit learns of him, travels north, sets an ambush; every one of Eindil's crew dies; Eindil reaches the castle alone | established | *Fourth Age Canon Register* |
| Horos gives Glo and the blue sword; Eindil learns the god-king is his brother | established | *Castle of Yeldenne and Glo* |
| He warns Aenor; most of the court denounces him | established | *The Fourth Age of Erdae* VIII |
| He returns on a dragon with Varner and Golbran; the sword breaks Zol's dead; the peoples unite; Volgan defeats him; Varner dies; the New Gods restore him; he destroys Volgan's manifested body; Zol manifests, crushes the sword, is wounded by a shard; Lorien dies; Zol withdraws | established | *War of the Last Crowns* |
| Afrit returns, cuts off his arm, casts him from a cliff; Eindil survives; at the palace Alleria and Golbran help strip Afrit's artifacts; Golbran removes the Necklace; Eindil kills Afrit; Golbran dies saving him; Eindil wears the Necklace and is crowned King of Aenor | established | *The Last Battle in the Palace* |
| Dates: wakes 4A 1749, war-king 1750, storm 1751, Gala 1752, Yeldenne 1753, warnings 1754, return 1757, cliff 1758, palace 1759, coronation 1760 | proposed | *Fourth Age Chronology* |
| Bridge of the Three Oaths, Girdon's Winter Ford, the Gunwaith trial, the reef of drowned voices, the shrine beneath the tide | proposed | *The Fourth Age of Erdae* IV |
| Mirror of First Rain; Alleria investigates and shelters him; Alleria finds him below the cliff; the dragon entrusted by Magical Lands elves; Golbran's partial sacrifice; the Ring of Doors and other lesser artifacts | proposed | vault notes as named |
| Chancellor Merovan left in Parim; Aurevan as Afrit's public name | proposed | *Chancellor Merovan*, *Aurevan the Deliverer* |

**Proposed by this spec** (not lore; for the owner to adopt or replace): the stage scale below, every host assignment marked "proposed", renown, regard and delay, the Grey Ford Confederation as the western confederation, the Host of Eindil as a country, the ports of call, the stage 8 retreat to the Magical Forest, the palace preparation chain, the rule that Eindil cannot die before stage 9, and all numbers.

**Kept open** (the system must not answer these in text): the birth order of the brothers; how and why Eindil was put to sleep; which arm he loses; what the Necklace will do to him; whether Volgan's spirit survives; what Glo leaves him after the gods' gift; where the palace cliff and the western war-kingship lie exactly.

## Design

### Stages

`zin_eindil_stage` (global, 0–12, contract) is the single source of truth. A stage starts when its **floor date** (+ accumulated delay) has passed and its **conditions** hold. Floors are the vault's proposed dates. Help never makes Eindil faster than history; hindrance makes him slower.

| Stage | Name | Floor (+ `zin_eindil_delay` days) | Conditions to enter | Sets | Default host (proposed unless noted) |
| ---: | --- | --- | --- | --- | --- |
| 0 | Asleep | start | — | — | none (nothing visible) |
| 1 | The Man in the Ice | 1 Ironfrost 1749 + 0–20 days random | — | `zin_eindil_awake` | owner of the Eindil's ice site (`zin_is_site_eindil_ice`) |
| 2 | The Road South | 1 Emberleaf 1749 | stage 1 for 150 days | — | the traders' road; then the owners of the three western episode sites |
| 3 | The War-King | 1 Rainwake 1750 | three western episodes resolved, or 1 Fallowing 1750 | `zin_eindil_war_king` when he lays the title down | leader of the Grey Ford Confederation |
| 4 | The Storm | 1 Thaw 1751 | `zin_eindil_war_king` | — | Islands of the South: the wreck host and the shrine site owner |
| 5 | Gala | 15 Deepwinter 1752 | stage 4 for 270 days | `zin_eindil_named` | Gala Elves (established) |
| 6 | The Voyage North | 1 Deepwinter 1753 | named and outfitted | `zin_aurevan_went_north` (via Afrit's choice) | none at sea; ports of call |
| 7 | Yeldenne | 1 Sowing 1753 | voyage of 150 days done | `zin_horos_dead`, `zin_glo_with_eindil` (via [Yeldenne and Glo](yeldenne_and_glo.md)) | owner of the landing site, then the owner of Mp'E (Yeldenne) |
| 8 | The Warnings | 1 Deepwinter 1754 | hall resolved; 90 days' travel | `zin_eindil_dragon_pact` (late in the stage) | Selen, then the Magical Forest |
| 9 | The Return | 1 Thaw 1757 | `zin_war_of_last_crowns` and `zin_eindil_dragon_pact` | `zin_eindil_returned`, `zin_varner_dead`, `zin_eindil_restored`, `zin_horos_sword_broken` | the Host of Eindil |
| 10 | The Cliff | 1 Thaw 1758 | `zin_afrit_returns_west` | `zin_eindil_cast_down` | the Host of Eindil; Selen (Alleria) |
| 11 | The Palace | 1 Thaw 1759 | 180 days hidden; palace chain done | `zin_golbran_dead`, `zin_eindil_wears_necklace` (Afrit's death sets `zin_afrit_dead`) | the Host of Eindil |
| 12 | Crowned | 1 Thaw 1760 | `zin_afrit_dead`; Parim held by a friend | `zin_eindil_crowned` (via the Aenor succession) | Aenor |

**Skips.** A stage whose antagonist is already gone is skipped, never stalled:

- Stage 9's Volgan battle is skipped if `zin_volgan_body_destroyed` is already set or Volgan does not exist; the Zol battle is skipped if Zol has not risen (`zin_zol_rising` missing) by 1 Harvest 1757.
- Stage 9 itself starts without the war on 1 Thaw 1758 if `zin_war_of_last_crowns` never fires: a "quiet return" with no battles.
- Stages 10 and 11 are skipped if `zin_afrit_dead` is set by other means, or if Afrit's country does not exist. The journey goes to stage 12.
- If `zin_afrit_returns_west` has not fired by 1 Thaw 1759, stage 10 is skipped and stage 11 starts when Afrit's country holds Parim.

### Eindil in the game

Eindil is the character `zin_eindil` (contract). He is never present before stage 1.

| Phase | Stages | Form | Who controls him |
| --- | --- | --- | --- |
| Guest | 1–8 | Unit leader recruited by the current host (corps commander, field marshal as war-king) with journey traits | the host country |
| At sea | 4 (crossing), 6 | Not recruited; the system holds him | nobody |
| Leader | 9–11 | Country leader of the Host of Eindil, and its field marshal | the Host of Eindil (playable) |
| King | 12 | Country leader of Aenor | Aenor |

**Name.** He does not know his name until Lorien gives it. Until `zin_eindil_named`, his character name is **"The Man from the Ice"**; the naming event calls `set_character_name` to "Eindil". All earlier text uses "the stranger", "the Man from the Ice" or "the King Without a House" (vault names).

**Guest rules.**

- The host may use him to command any defensive war or the war-king's peace. If the host starts an offensive war (`has_offensive_war`) against anyone except Zol, Volgan or their subjects, Eindil leaves at once: the stage advances, 30 days of delay, regard −20.
- He leaves when the stage ends, whatever the host wants. A host can keep him longer only through the "Detain" options below, and he always leaves in the end.
- **Before stage 9 nothing can kill him.** Hindrance delays him and costs the hinderer; it never ends the journey. This keeps the established path reachable from every early divergence (proposed rule; see Open questions).

### The three journey measures

| Variable | Scope | Range | Meaning | Main sources |
| --- | --- | --- | --- | --- |
| `zin_eindil_renown` | global | 0–100 | How widely his deeds are told | deeds +5 to +15 each; historical path reaches about 70 by stage 8 |
| `zin_eindil_regard` | every country | −100–100 | How Eindil and later his host remember that country | hosting +20, help +10 to +25, hindrance −20 to −40 |
| `zin_eindil_delay` | global | 0–900 days | Accumulated delay added to every later floor | hindrance +60 to +180; help −30 to −60 (never below 0) |

`zin_eindil_host` (global) stores the current host country, or is cleared while he is at sea.

**What they do.**

- **Renown** sets how many courts heed his warnings in stage 8 (AI heeds with probability equal to renown, in percent), how many divisions join the Host when it is raised (renown ÷ 10, rounded down, minimum 3), and how fast the Afrit system can reveal the secret (the Afrit spec reads it).
- **Regard** ≥ 25 means a friend: the country gets the coalition invitation in stage 9, the opinion modifier `zin_eindil_remembered` (+25 opinion toward the Host of Eindil and later Aenor) and, at the coronation, the spirit `zin_eindil_first_friends`. Regard ≤ −25 means resentment: no invitation, opinion modifier `zin_eindil_wronged` (−25).
- **Delay** pushes every later floor. Large delay is how the world diverges: Eindil may reach Yeldenne after Afrit strikes, or come home after the West has crossed.

### Stage by stage: hosts and choices

Every choice below is a country event option or decision. "(hist)" marks the option the AI takes on the historical path. Text never names Afrit before `zin_afrit_revealed` (contract, "The secret").

#### Stage 1 — The Man in the Ice (4A 1749)

**Host:** the owner of `zin_is_site_eindil_ice`, a remote north-west Cold Lands state, not a capital ([key sites](../01_map/02_key_sites.md)). The map step records which tier C Cold Lands realm owns it (proposed: a north-western clan realm; never Coldor's capital state).

| Event | Choice | Effect |
| --- | --- | --- |
| The Man in the Ice | **Nurse the stranger** (hist) | Eindil recruited as corps commander (`zin_eindil_man_from_the_ice`); spirit `zin_eindil_stranger_among_us`; regard +20; renown +5 |
| | Leave him to the elders | Recruited; no spirit; regard +5 |
| | **Bind him to our service** | Recruited; he stays 365 days; spirit becomes `zin_eindil_restless_guest`; delay +120; regard −30 |
| Talk of a Man from the Ice (to Coldor and Isengard, 60 days later) | Summon him to court | 50 % he comes: host becomes the summoning crown for 90 days, delay +30, regard +10 with the summoner. 50 % he declines: nothing |
| | Ignore northern tales (hist) | nothing |
| The Traders' Road South (end of stage) | **Give him provisions** (hist) | delay −30; regard +10; renown +5 |
| | Let him go as he came | nothing |

#### Stage 2 — The Road South (4A 1749–1750)

Eindil travels with West Lands traders. Three episodes fire 45 days apart. Each host recruits him for the episode and releases him after it.

| Episode (site) | Host | Help | Hinder |
| --- | --- | --- | --- |
| **Bridge of the Three Oaths** (`zin_is_site_three_oaths`, proposed where Gunwaith and Girdon meet) | owner of the site | **Accept his mediation** (hist): both lordships keep their grain; stability +3 %; regard +20; renown +5 | **Burn the grain anyway**: −10 % stability for 180 days (timed spirit `zin_eindil_burned_granaries`); regard −20; renown +5 (he saves what he can) |
| **Girdon's Winter Ford** (`zin_is_site_winter_ford`) | Girdon (if Girdon does not own the site, the owner) | **Hold the ford open for the refugees** (hist): manpower +2,000 (refugees settle); regard +20; renown +5 | **Close the ford**: delay +60; regard −25 |
| **Judgment in Gunwaith** (Gunwaith's capital) | Gunwaith | **Try him fairly** (hist): he submits to Gunwaith's law; timed spirit `zin_eindil_judgment_honoured` (365 days); regard +20; renown +10 | **Make an example of him**: he is held 180 days, then released; delay +180; regard −40; renown +5 (stories of his patience). **Pardon him**: he refuses exemption from judgment; same result as "Try him fairly" with different text |

If a site's owner is the same country for two episodes, both fire for it. If Gunwaith does not exist, the trial fires for the owner of Gunwaith's former capital.

At the end of the stage, a news event, **The King Without a House**, fires to every West Lands country (renown ≥ 20) or only to the hosts (lower).

#### Stage 3 — The War-King (4A 1750)

**Lore:** when the Truce of the Grey Ford breaks, a western confederation makes Eindil temporary war-king; he makes peace and lays the title down (established outline, proposed dates).

**The Grey Ford Confederation (proposed).** The confederation is the West Lands countries that want the peace but cannot keep it alone:

- **Leader:** the West Lands country other than Gunwaith and Girdon with the highest regard; ties go to the most states.
- **Members:** West Lands countries with regard ≥ 0 that are not at war with each other. At least three; if fewer qualify, the leader stands with whoever does.

**How it starts.**

- If a war between West Lands countries is running (the Gunwaith and Girdon trees break the Truce of the Grey Ford through their own focuses, see [major/gunwaith.md](../05_focus_trees/major/gunwaith.md)), event **The Grey Ford Breaks** fires to the leader.
- If no western war has begun by 1 Fallowing 1750, **Feud on the Grey Ford** fires instead: a border feud threatens the truce and the confederation names him war-king to stop it. No war is started.

| Event | Choice | Effect |
| --- | --- | --- |
| A Crown Offered (leader) | **Name him war-king** (hist) | Eindil becomes the leader's field marshal (`zin_eindil_war_king` trait); members get `zin_eindil_war_kings_banner` for the stage; members get military access to each other |
| | Refuse the stranger | The offer passes to the next candidate; if nobody accepts, the stage ends after 90 days without the war-king; `zin_eindil_war_king` is set anyway on the historical rule, otherwise not |
| The War-King's Terms (to each belligerent, 60 days after the offer) | **Accept his peace** (hist) | `white_peace` between the western belligerents; both get `zin_eindil_war_kings_peace` (730 days); regard +15 |
| | Fight on | The belligerent stays at war; the confederation may join against it (decision `zin_eindil_enforce_peace`, 90 days); regard −20. The war-king lays down the title when that war ends or after 365 days |
| The Crown Laid Down (leader, when peace holds) | **Release him with honour** (hist) | Sets `zin_eindil_war_king`; members keep `zin_eindil_war_kings_peace`; regard +20; renown +15 |
| | Try to keep the war-king | He refuses and leaves by night: sets `zin_eindil_war_king`; regard −50 with the leader; the confederation dissolves; renown +10 |

The player cannot make Eindil a permanent king: his choice to lay the crown down is established. Players choose only how they part.

#### Stage 4 — The Storm (4A 1751)

Eindil sails for Aenor from the leader's coast (or the nearest West Lands port). He is at sea: `zin_eindil_host` is cleared and his character is retired from the host.

- **West Over the Sea** (to the departure host): **Give him a ship** (hist): regard +10. **Let him find passage**: delay +30.
- 30 days later the storm takes the ship south. **Wreck on the Southern Isles** fires to the wreck host: the owner of the first southern island landfall (proposed: Howan). **Shelter the castaways** (hist): Eindil recruited as corps commander; regard +20. **Sell news of him to the Deliverer's priests**: Afrit's country gets the secret event `zin_glo.5` (early warning, see below); delay +60; regard −40; host +50 political power.
- **The Reef of Drowned Voices** (proposed island legend, to the wreck host or a neighbouring island, Nara or Verde): Eindil brings back the stranded children. Spirit `zin_eindil_the_sea_went_silent` (365 days); renown +5.
- **The Shrine Beneath the Tide** (to the owner of `zin_is_site_south_shrine`, proposed Enhis Is Rond): an inscription naming Aen. Renown +5. The text does not identify him.
- **Stay and Rule Us** (to the host with the highest regard among the islands): he declines; the host chooses "Honour his choice" (regard +10) or "Hold him to the offer" (delay +60, regard −20).
- **Carry the Old Tales to Gala** ends the stage: the islanders send him to the Lands of the Sun.

**Early warning (divergence).** If an island sold news to the Deliverer's priests, Afrit's country chooses: **Dismiss the tale** (AI default) or **Send hunters south**. Hunters make one attempt on the islands 90 days later: it fails (Eindil cannot die before stage 9), the host loses 1,000 manpower, delay +60, renown +5, and `zin_eindil_hunted` is set, which adds +1 to the ambush strength in stage 7.

#### Stage 5 — Gala (4A 1752)

**Host:** the Gala Elves (established). If the Gala Elves do not exist, the host is the country that has recruited `zin_lorien`; if none, the owner of Gala's capital, with Lorien re-recruited as an advisor by the event.

| Event | Choice | Effect |
| --- | --- | --- |
| A Stranger at Gala | **Receive him** (hist) | Eindil recruited (advisor role "Guest of Lorien", no cost); regard +25 |
| | Turn him away for a season | Lorien relents after 180 days: delay +180; regard −10. The Gala Elves cannot refuse him for good (Lorien's established care for Erdae) |
| Weeks of Memory (60 days later) | flavour | renown +5 |
| **The Mirror of First Rain** (proposed device) | one option | Sets `zin_eindil_named`; `set_character_name` to Eindil; trait `zin_eindil_heir_of_aen`; Gala gets the event text of the vision (burning capital, armies from west and east, death from the north, a shard of blue metal). Afrit's country gets `zin_glo.10` 30 days later (the agents' report) |
| Lorien's Gift (30 days later) | **Equip him generously** (hist) | Gala pays 1,000 manpower and 500 infantry equipment; the crew includes Gala elves; `zin_eindil_elven_crew` (ambush strength −1); regard +15 |
| | A ship and a sword, no more | No cost; regard +5 |

The naming is not public news. Courts learn his name only in stage 8, from Eindil himself.

#### Stage 6 — The Voyage North (4A 1753)

Lorien's ship sails north for 150 days with island, western and elven crew (established). `zin_eindil_host` is cleared.

**Ports of call (proposed).** Three events, 40 days apart, each to one coastal country picked at random from, in order: the Islands of the South, Triton's Islands or the West Lands coast, and the Cold Lands west coast.

| Choice | Effect |
| --- | --- |
| **Resupply the ship** (hist for two of three) | −10 days delay; regard +10; renown +2 |
| Say nothing | nothing |
| **Report the ship to the Deliverer's priests** (hist for one of three; AI weight rises with `zin_footholds` ≥ 2) | +50 political power; `zin_eindil_ports_betrayed` +1 (ambush strength +1); regard −30 once `zin_eindil_named` is public (applied in stage 8) |

Meanwhile Afrit's country decides how to meet him (`zin_glo.10`, owned by [Yeldenne and Glo](yeldenne_and_glo.md)). Leaving Parim sets `zin_aurevan_went_north`, and Chancellor Merovan (`zin_merovan`) holds the seals (Aenor spec).

#### Stage 7 — The Ambush and Yeldenne (4A 1753)

**Landfall.** Event **Landfall in the Frozen North** to the owner of `zin_is_site_yeldenne_landing` (the coastal state nearest Mp'E; proposed site). Choices: **Stay out of strangers' quarrels** (hist): nothing. **Send guides inland**: ambush strength −1; regard +15. Yeldenne's own focuses can also lower it (see [regional/yeldenne.md](../05_focus_trees/regional/yeldenne.md)).

**The ambush.** It fires only if Afrit's party lies in wait (`zin_glo.10` option 1). Ambush strength (proposed formula):

`5 + zin_eindil_ports_betrayed + 1 if zin_eindil_hunted − 1 if zin_eindil_elven_crew − 1 per guide flag (landing owner, Yeldenne beacon, Yeldenne coast watch, Yeldenne guides)`

| Strength | Outcome |
| --- | --- |
| ≥ 4 | **None Survive** (historical): the whole crew dies; Eindil escapes alone across the snow. Trait `zin_eindil_alone_in_the_snow` (timed, 180 days). Afrit's party reaches the hall first |
| 2–3 | **A Few Survive** (divergence): two companions live and become unit leaders of the later Host; Afrit's party still reaches the hall first |
| ≤ 1 | **The Ambush Fails** (divergence): the crew lives; Afrit's party loses 20 days; the hall outcome is decided as "Eindil arrives first" if Eindil now reaches the castle before Afrit enters |

On the historical path (base 5, one betrayed port, elven crew, Yeldenne's coast watch) the strength is 4: none survive, as in canon.

**The hall.** The confrontation and its outcomes belong to [Yeldenne and Glo](yeldenne_and_glo.md). This system reads the result:

| Result | Journey effect |
| --- | --- |
| Glo given to Eindil (`zin_glo_with_eindil`) | trait `zin_eindil_bearer_of_glo`; renown +10; Eindil leaves with Glo and the blue sword |
| Glo sealed in the empty hall (Afrit or Volgan slew Horos before Eindil came) | Eindil may still claim it: `zin_glo.80` opens the seal for him (he learns the family truth from Glo's vision); same result, 30 days later |
| Horos endures and still holds Glo (Eindil never came) | not reachable while the journey runs; only after `zin_eindil_lost` |

**Leaving Yeldenne.** Event **The Bearer Leaves Yeldenne** (to Eindil's current host or, at sea, to the Gala Elves as the friendly witness): Eindil knows that the king in Parim, worshipped as the Deliverer, is his brother, son of Ein. The text does not use the name Afrit unless `zin_afrit_revealed` is set.

#### Stage 8 — The Warnings (4A 1754–1756)

**Landfall in the Middle Lands.** Eindil comes ashore in the Middle Lands (proposed: Selen's coast). **Host:** Selen, through Alleria of Selen (`zin_alleria`), who investigates and shelters him (proposed role). If Selen does not exist or is controlled by Afrit's camp, the host is the Middle Lands country with the highest regard that is not Aenor.

| Event | To | Choices |
| --- | --- | --- |
| **Alleria's Watch** | Selen (or substitute) | **Shelter him in secret** (hist): host; regard +25; Eindil recruited as corps commander; decision category `zin_eindil_guest` opens. **Hand him to the court**: Aenor's government gets him: event "The Impostor in Chains" (he escapes after 60 days to the Magical Forest; regard −50; delay +60) |
| **The Impostor** | Aenor's government (whoever rules Aenor: Afrit's crown, the Golden King if he survives, or a divergent ruler) | **Denounce and hunt the impostor** (hist under Aurevan): Aenor spends 50 political power; the host risks discovery (below). **Let him speak**: renown +15; every Concord dominion gets "Warnings of the Heir" at once; under Aurevan this choice is only available to a player. **Seize him**: 60 % he is caught (as "Hand him to the court"); 40 % the attempt fails and exposes the host (−50 opinion both ways between Aenor's crown and the host; the host keeps him) |
| **Warnings of the Heir** | every great power, every Middle Lands country, every country with regard ≥ 25 | **Heed the warning**: spirit `zin_eindil_warning_heeded` (until war or 730 days), country flag `zin_eindil_heeded`, regard +15, −25 opinion with Aenor's crown. **Dismiss it** (hist for most): nothing. **Denounce him**: +25 opinion with Aenor's crown, regard −20 |

**Who heeds on the historical path.** The AI heeds with chance equal to renown, but only frontier and scholarly realms: Selen, Mirolon, Kingson, Hiloron, the Magical Forest and the Gala Elves heed (hist); the other great powers dismiss; Aenor denounces. This matches "some men believed Eindil, especially frontier troops, scholars ... and branches of the Lost Cause" (established).

**Discovery.** While Aenor hunts, the host rolls every 90 days: 15 % (+10 % if the host has ≥ 3 `zin_footholds`) that the shelter is found. Found: the host chooses **Hide him in the hills** (−50 political power, stays host) or **Send him to the elves** (stage moves on to the Magical Forest at once).

**Swear to the heir.** Decision `zin_eindil_swear_to_heir` (host only, regard ≥ 25, renown ≥ 40, after 1 Thaw 1755): sets the country flag `zin_eindil_sworn`. A sworn country is offered to become the Host of Eindil in stage 9. Selen swears on the historical path.

**To the elven woods (proposed).** When `zin_war_of_last_crowns` is set (or the hunt finds him), Eindil goes to the Magical Forest. Events:

- **The Bearer in the Forest** (Magical Forest): **Shelter the bearer** (hist): host; regard +20. **Send him on**: host becomes Nolorim or the elven realm with the highest regard; delay +60.
- **Varner and Golbran** (Magical Forest, 90 days later): `zin_varner` and `zin_golbran` join him (the Magical Forest recruits them as advisors for the stage). Renown +5.
- **A Dragon's Pact** (to the owner of Dragon Mountain, see [03_gameplay/04_magic_and_world_systems.md](../03_gameplay/04_magic_and_world_systems.md)): **Entrust a dragon to the bearer** (hist): sets `zin_eindil_dragon_pact`; the dragon is a free ally, not a subject (proposed). **Refuse**: the pact is offered again every 180 days; on 1 Goldfield 1757 Varner persuades the elves and the pact is made anyway.

#### Stage 9 — The Return (4A 1757)

**On Dragon's Wings.** World news: a man on a dragon comes down on the main battlefield of the Middle Lands. Sets `zin_eindil_returned`. The battlefield state is the Aenor-cored state with the most Zol divisions, else the most Volgan divisions, else Parim's neighbour with the largest enemy army.

**The Wave of Glo.** If `zin_glo_with_eindil`, Glo's first wave strikes Zol's dead in that state (scripted effect `zin_glo_wave`, owned by [Yeldenne and Glo](yeldenne_and_glo.md)). Renown +10.

**The Host of Eindil** (scripted effect `zin_eindil_raise_host`):

1. If a country has `zin_eindil_sworn` and still exists, it gets **Raise the Host of Eindil**:
   - **Raise the Host** (hist): Eindil becomes its country leader (Light, trait `zin_eindil_king_without_a_house`) and field marshal; cosmetic name "The Host of Eindil"; spirit `zin_eindil_host_of_the_heir`; claims on every Aenor-cored state; if its overlord is Afrit's camp or at war with it, the subject relation ends (`end_puppet`). Its old leader stays as an advisor. Alleria stays its general.
   - **Stand beside him, remain ourselves**: go to step 2; the country joins the Host's faction at once.
2. Otherwise a dynamic country is created (`create_dynamic_country`, original Aenor) in the battlefield state, or in the first Aenor-cored state controlled by Aenor's loyal remnant or a friend. It is named "The Host of Eindil", led by Eindil, with renown ÷ 10 divisions (minimum 3) of Aenoran survivors. If no such state exists, it is formed as a government in exile in the sworn country or the Magical Forest (`become_exiled_in`).
3. Every human player whose country has regard ≥ 50, and the player of a declining sworn country, gets the option **Ride with the Heir**: switch to the Host of Eindil (`change_tag_from`). Declining keeps their country.

**The Coalition of the Living.** The Host forms or takes over the coalition. If the Lost Cause faction exists (Aenor spec), its leader gets **Give the Lost Cause to the Heir** (hist if the Golden King is dead): the faction passes to the Host and `zin_lost_cause_with_eindil` is set. Otherwise the Host founds the Lost Cause anew. Invitations then go to every country with regard ≥ 25 and to countries with armies stranded in the Middle Lands (western, northern and eastern countries with divisions in Aenor-cored states that are at war with Volgan or Zol). Joining does not make them subjects (established: he did not demand their independence).

**The battles.** Each is an event chain that needs the Host's field marshal Eindil to lead an army in or next to the named enemy's ground. On the historical rule they fire on their dates even without that.

| Order | Event | Condition (dynamic rule) | Historical date | Effect |
| ---: | --- | --- | --- | --- |
| 1 | **Volgan at the Southern Front** | Eindil's army borders or is in a state controlled by Volgan | 1 Highsun 1757 | Eindil cast down (trait removed for 60 days, the Host gets `zin_eindil_heir_has_fallen` timed 60 days); **Varner's Last Wards**: sets `zin_varner_dead`; Golbran is spent but lives (country flag on the Host `zin_golbran_spent`, proposed) |
| 2 | **The Gathering of the New Gods** | 30 days after 1, needs `zin_glo_with_eindil` | 1 Goldfield 1757 | sets `zin_eindil_restored`; trait `zin_eindil_blessed_of_the_new_gods`; Glo power to 100. Without Glo: **The Heir Does Not Rise**: sets `zin_eindil_lost` (divergence) |
| 3 | **The Blue Sword Through Volgan** | 30 days after 2, Eindil's army in combat with Volgan's or in a Volgan-controlled state | 1 Harvest 1757 | calls the Volgan system to destroy the manifested body (`zin_volgan_destroy_body`; sets `zin_volgan_body_destroyed`) |
| 4 | **The Old God Comes Forth** | `zin_volgan_body_destroyed` and `zin_zol_rising` | 15 Harvest 1757 | sets `zin_horos_sword_broken`; Eindil wounded (trait unusable 120 days); the Zol system manifests and withdraws Zol (`zin_zol_manifested`, `zin_zol_withdrawn`); the elves' system kills Lorien (`zin_lorien_dead`). This spec only fires the hand-over event; the owners resolve it |
| 5 | **Hailed as King** | after 4 or its skip | — | renown +10; every coalition member: regard +10 |

The text keeps Volgan's spiritual fate open: "his body broke apart" never "Volgan is dead".

#### Stage 10 — The Cliff (4A 1758)

Afrit returns from the east with a new host (Afrit spec sets `zin_afrit_returns_west`). Event **The Cliff** to the Host and to Afrit's country: Afrit wounds Eindil, severs an arm (the text does not say which) and casts him down. Sets `zin_eindil_cast_down`.

- Eindil's unit leader role is suspended (removed and re-added later); the Host gets `zin_eindil_king_is_dead` until stage 11; a regent leads (Alleria if she serves the Host, else the Host's previous leader).
- **Below the Cliff** (to Selen, or to whichever country employs `zin_alleria`): **Search the ravine** (hist): Alleria finds him; he recovers in hiding for 180 days. **Mourn him**: he is found by scouts after 365 days instead. If no country employs Alleria, recovery takes 365 days.
- **Word of the King's Death** (news to all): the world believes him dead; regard and renown do not change.
- After recovery: trait `zin_eindil_maimed_unbroken`; he leads again.

#### Stage 11 — The Palace (4A 1759)

Afrit holds Parim again (Afrit spec). Eindil cannot storm the palace with armies; he goes in.

**Decision chain** (category `zin_eindil_palace`, the Host only, needs Eindil recovered and Parim controlled by Afrit's country):

| Decision | Days | Cost | Needs | Effect |
| --- | ---: | --- | --- | --- |
| Find the Old Service Passages | 30 | 50 PP | — | flag `zin_palace_passages` |
| Rally the Palace Rebels | 45 | 75 PP | passages; Alleria employed by the Host or an ally | flag `zin_palace_rebels` |
| Enter the Palace | 7 | — | both flags; date ≥ floor | fires **The Battle in the Palace** |

**The Battle in the Palace** is one chain of events (proposed artifact names from the vault):

1. **An Arrow in the Eye** — Alleria's shot breaks Afrit's concentration; Eindil cuts a finger and takes the Ring of Doors.
2. **The Seals Broken** — the rebels break the Crown of Witnesses' seals; Eindil turns Afrit's spell against the Bracelet of the First Seal. Calls the Afrit system to lower `zin_afrit_artifacts` to 1.
3. **Into the Private Realm** — Afrit flees through the Necklace's passage; Eindil holds the chain and is carried with him.
4. **Golbran's Last Working** — needs `zin_golbran` alive (not `zin_golbran_dead`): Golbran tears the Necklace away. Without Golbran: **The False God Escapes** (below).
5. **The Death of a False God** — Eindil kills him. Calls the Afrit system to end Afrit (`zin_afrit_slay`; sets `zin_afrit_dead`).
6. **Golbran's Gift** — sets `zin_golbran_dead`; Eindil lives.
7. **The Necklace** — sets `zin_eindil_wears_necklace`; `zin_afrit_artifacts` to 0. The text says only that the Necklace is "an artifact of unresolved danger".

**Failure (divergence).** If Alleria is not employed by the Host or an ally when the chain fires, step 1 fails: **The Palace Holds**: Eindil escapes wounded, the Host loses 25 % stability for 180 days, the chain resets and can be retried after 120 days. A second failure, or step 4 without Golbran, sets `zin_eindil_lost`.

#### Stage 12 — Crowned (4A 1760)

On or after 1 Thaw 1760, with `zin_afrit_dead` set and Parim controlled by the Host, a coalition member or an Aenor not at war with the Host: event **The Coronation of Eindil** calls `zin_aenor_crown_eindil` (Aenor succession spec), which sets `zin_eindil_crowned`.

The end state this spec requires of that effect:

- Eindil is country leader of Aenor (trait `zin_eindil_rightful_king`).
- If the Host was a dynamic country, Aenor takes its states, units and the player (`change_tag_from`); the dynamic country ends.
- If the Host was a sworn country (Selen), it drops the cosmetic name, restores its leader and stays independent; its future tie to Aenor is the Aenor spec's matter (the vault says the kingdoms need treaties, not forced submission).
- Every country with regard ≥ 50 gets `zin_eindil_first_friends` (1,825 days).
- The world system checks `zin_ending_lost_cause` ([03_gameplay/05_world_tension_and_endings.md](../03_gameplay/05_world_tension_and_endings.md)).

If Parim is held by a hostile power, **The Crown Withheld** fires to the Host: it gets a war goal against Parim's controller; the coronation waits.

### Divergences at a glance

| Who | Helps by | Hinders by | Consequence of hindering |
| --- | --- | --- | --- |
| Cold Lands host | nursing, provisions | binding him to service | delay; resentment; restless guest spirit |
| Coldor, Isengard | — | summoning him to court | short delay |
| Western hosts | mediation, open ford, fair trial | burnt granaries, closed ford, an example made | delay; regard loss; no coalition invitation later |
| Grey Ford Confederation and belligerents | the war-king's peace | refusing peace, keeping the war-king | lasting western war; the confederation breaks |
| Islands of the South | shelter, honouring his choice | selling news to the priests | Afrit's early hunters; stronger ambush |
| Gala Elves | receiving and equipping him | turning him away for a season, a poor outfit | delay; stronger ambush |
| Ports of call | resupply | reporting the ship | stronger ambush |
| Landing owner, Yeldenne | guides, beacon, coast watch | — | weaker ambush; crew may survive |
| Afrit's country | — | ambush, strike at the hall early, early hunters | see [Yeldenne and Glo](yeldenne_and_glo.md) |
| Middle Lands, great powers | heeding, sheltering, swearing | denouncing, handing him over | fewer believers; Afrit's reveal slower; no coalition |
| Aenor's crown | letting him speak | hunting him | Afrit's camp stays strong in the Concord |
| Magical Forest, dragon realm | shelter, dragon pact | refusing the pact | a later return (no later than 1 Goldfield 1757) |

Late, non-historical outcomes (gameplay only, never history): **The Heir Is Lost** (`zin_eindil_lost`): the endings spec decides how the Lost Cause fares without him, and [Yeldenne and Glo](yeldenne_and_glo.md) lets a second bearer claim sealed Glo.

## Implementation

### Files

| Path | Contents |
| --- | --- |
| `common/characters/zin_story_characters.txt` | `zin_eindil` (no country at start; roles added by effects) |
| `common/unit_leader/zin_eindil_traits.txt` | Eindil's unit leader traits |
| `common/country_leader/zin_eindil_traits.txt` | Eindil's country leader traits |
| `common/ideas/zin_eindil.txt` | host spirits |
| `common/opinion_modifiers/zin_eindil.txt` | `zin_eindil_remembered`, `zin_eindil_wronged` |
| `common/scripted_effects/zin_eindil.txt`, `common/scripted_triggers/zin_eindil.txt` | below |
| `common/decisions/zin_eindil.txt`, `common/decisions/categories/zin_eindil_categories.txt` | `zin_eindil_guest`, `zin_eindil_host`, `zin_eindil_palace` |
| `events/zin_eindil.txt` | namespace `zin_eindil` |
| `common/on_actions/zin_eindil_on_actions.txt` | startup and host safeguards |
| `common/game_rules/zin_eindil_rules.txt` | `zin_rule_eindil_journey` |
| `localisation/english/zin_eindil_l_english.yml` | all text |
| `docs/design/eindil_route.json` | the stage table, floors, hosts and site keys; the content builder generates the scripted triggers and floors from it |

All are produced by the content builder; never hand-edit generated files.

### Variables and flags

From the contract: `zin_eindil_stage`, and the flags `zin_eindil_awake`, `zin_eindil_war_king`, `zin_eindil_named`, `zin_eindil_returned`, `zin_varner_dead`, `zin_golbran_dead`, `zin_eindil_crowned` (set here or by the owners named above).

New shared names (reported for the contract):

| Name | Kind | Scope | Meaning |
| --- | --- | --- | --- |
| `zin_eindil_renown` | variable | global, 0–100 | fame of his deeds |
| `zin_eindil_regard` | variable | country, −100–100 | how he remembers the country |
| `zin_eindil_delay` | variable | global, 0–900 | accumulated delay in days |
| `zin_eindil_host` | variable (country) | global | current host; unset at sea |
| `zin_eindil_heeded` | country flag | country | heeded his warnings |
| `zin_eindil_sworn` | country flag | country | swore to raise his host |
| `zin_eindil_dragon_pact` | global flag | — | the elves entrusted a dragon |
| `zin_eindil_restored` | global flag | — | the New Gods restored him through Glo |
| `zin_horos_sword_broken` | global flag | — | Zol crushed Horos's sword |
| `zin_eindil_cast_down` | global flag | — | Afrit cast him from the cliff |
| `zin_eindil_wears_necklace` | global flag | — | he took the Necklace of the Abyss |
| `zin_eindil_lost` | global flag | — | divergence: the heir is out of the story |
| `zin_aurevan_went_north` | global flag | — | the Deliverer left Parim to meet the heir (set by `zin_glo.10`) |
| `zin_afrit_returns_west` | global flag | — | Afrit's eastern host marches west (set by the Afrit system) |
| `zin_lost_cause_with_eindil` | global flag | — | the Lost Cause is now Eindil's coalition |

Internal (not shared): `zin_eindil_ports_betrayed` (global count), flags `zin_eindil_hunted`, `zin_eindil_elven_crew`, `zin_palace_passages`, `zin_palace_rebels`, country flag `zin_golbran_spent`, `zin_eindil_episode_<n>_done`.

### Scripted triggers

| Trigger | True when |
| --- | --- |
| `zin_eindil_is_host` | `ROOT` is `var:global.zin_eindil_host` |
| `zin_eindil_floor_reached` | the current stage's floor date + `zin_eindil_delay` days has passed (generated from `eindil_route.json`) |
| `zin_eindil_friend` | `zin_eindil_regard` ≥ 25 |
| `zin_eindil_resents` | `zin_eindil_regard` ≤ −25 |
| `zin_eindil_historical` | game rule `zin_rule_eindil_journey` is HISTORICAL or `zin_rule_historical_path` is on |
| `zin_eindil_can_lead` | Eindil is employed by `ROOT`, not cast down or wounded |
| `zin_is_site_eindil_ice`, `zin_is_site_three_oaths`, `zin_is_site_winter_ford`, `zin_is_site_south_shrine`, `zin_is_site_yeldenne_landing`, `zin_is_site_palace_cliff` | site triggers generated in `common/scripted_triggers/zin_sites.txt` from the [key sites](../01_map/02_key_sites.md) table. All but the Yeldenne landing already have a row there; the landing (the coastal state nearest Mp'E) needs a new row |

### Scripted effects

| Effect | Does |
| --- | --- |
| `zin_eindil_advance_stage` | adds 1 to `zin_eindil_stage`, sets the stage's flags, fires the stage's first event to its host |
| `zin_eindil_set_host` | `set_variable = { global.zin_eindil_host = ROOT }`; in the old host `retire_character = zin_eindil` (un-assigns him and all his jobs); in ROOT `recruit_character = zin_eindil`, then the stage's role (`add_corps_commander_role`, `add_field_marshal_role` or `add_advisor_role`) and the traits he has earned (re-applied from global flags, so nothing is lost on a move). The Linux run must confirm a retired character can be recruited by another country; if not, the builder defines one character per phase sharing the id prefix `zin_eindil` |
| `zin_eindil_clear_host` | removes his roles; clears `global.zin_eindil_host` (at sea) |
| `zin_eindil_add_renown` (`value`) | clamps to 0–100 |
| `zin_eindil_add_regard` (`value`) | on ROOT; clamps; updates opinion modifiers at ±25 |
| `zin_eindil_add_delay` (`value`) | clamps 0–900 |
| `zin_eindil_raise_host` | stage 9 host creation as designed above |
| `zin_eindil_join_coalition` | ROOT joins the Host's faction (or the Lost Cause it leads) |
| `zin_eindil_aid_host` (`equipment`, `manpower`) | sends equipment and manpower from ROOT to the Host (`send_equipment`, manpower via `add_manpower` pair) |

Effects owned by other systems that this spec calls (names proposed; their specs confirm them): `zin_aenor_crown_eindil` (Aenor succession), `zin_volgan_destroy_body` (Volgan), `zin_afrit_slay` and `zin_afrit_lose_artifacts` (Afrit), `zin_world_add_gathering_dark` (world systems, contract example), `zin_glo_wave` and `zin_glo_transfer` (Yeldenne and Glo).

### Characters and traits

`zin_eindil`: portraits generated (wanderer, war-king, bearer with green light, restored with lightning in the eyes, maimed, crowned); swapped with `set_portraits` at stages 3, 7, 9, 10 and 12. Starting skills as corps commander: skill 4 (attack 4, defence 4, planning 3, logistics 3), design targets.

| Trait | Type | Added | Effect (design targets) |
| --- | --- | --- | --- |
| `zin_eindil_man_from_the_ice` | unit leader | stage 1 | attack_skill +1, defense_skill +1; `winter_attrition_factor` −0.25, `army_morale_factor` +0.05 |
| `zin_eindil_war_king` | unit leader | stage 3 (kept) | planning_skill +1; `army_morale_factor` +0.10, `army_org_factor` +0.05 |
| `zin_eindil_heir_of_aen` | unit leader | stage 5 | attack_skill +1, defense_skill +1 |
| `zin_eindil_alone_in_the_snow` | unit leader, timed 180 days | stage 7 | `army_morale_factor` −0.10 |
| `zin_eindil_bearer_of_glo` | unit leader | with Glo | `army_attack_factor` +0.10, `army_defence_factor` +0.10, `army_org_factor` +0.10 |
| `zin_eindil_blessed_of_the_new_gods` | unit leader | `zin_eindil_restored` | attack_skill +2, defense_skill +1; `army_attack_factor` +0.15, `army_morale_factor` +0.10 |
| `zin_eindil_maimed_unbroken` | unit leader | after the cliff | attack_skill −1; `army_morale_factor` +0.10 |
| `zin_eindil_king_without_a_house` | country leader | Host raised | `war_support_factor` +0.10, `stability_factor` +0.05, `political_power_gain` +0.25 |
| `zin_eindil_rightful_king` | country leader | coronation | `stability_factor` +0.15, `political_power_gain` +0.5, `drift_defence_factor` +0.30 |

### Spirits

| Key | Name | Modifiers | Added / removed |
| --- | --- | --- | --- |
| `zin_eindil_stranger_among_us` | The Stranger Among Us | `stability_factor` +0.03, `army_morale_factor` +0.05 | host in stages 1–2; removed when he leaves |
| `zin_eindil_restless_guest` | A Restless Guest | `stability_factor` −0.05 | a host that binds or detains him; removed when he leaves |
| `zin_eindil_burned_granaries` | Burned Granaries | `stability_factor` −0.10 | timed 180 days |
| `zin_eindil_judgment_honoured` | The Stranger's Judgment | `stability_factor` +0.05, `political_power_gain` +0.10 | timed 365 days |
| `zin_eindil_war_kings_banner` | The War-King's Banner | `army_morale_factor` +0.10, `army_org_factor` +0.05, `war_support_factor` +0.05 | confederation members during stage 3 |
| `zin_eindil_war_kings_peace` | The War-King's Peace | `stability_factor` +0.05, `opinion_gain_monthly_factor` +0.15 | timed 730 days |
| `zin_eindil_the_sea_went_silent` | The Sea Went Silent | `stability_factor` +0.05, `war_support_factor` +0.03 | timed 365 days |
| `zin_eindil_warning_heeded` | The Warning Heeded | `army_core_defence_factor` +0.05, `dig_in_speed_factor` +0.10, `conscription_factor` +0.03 | stage 8 heed; removed at war's start + 365 days or after 730 days |
| `zin_eindil_host_of_the_heir` | The Host of the Heir | `war_support_factor` +0.15, `army_morale_factor` +0.10, `conscription_factor` +0.10, `army_core_defence_factor` +0.10 | the Host from stage 9 to the coronation |
| `zin_eindil_heir_has_fallen` | The Heir Has Fallen | `army_morale_factor` −0.10 | timed 60 days |
| `zin_eindil_king_is_dead` | They Say the King Is Dead | `war_support_factor` −0.10, `stability_factor` −0.10 | from the cliff to his recovery |
| `zin_eindil_first_friends` | First Friends of the King | `stability_factor` +0.05, `trade_opinion_factor` +0.20 | coronation, regard ≥ 50; timed 1,825 days |

### Decisions

| Category / decision | Who | Cost | Effect |
| --- | --- | --- | --- |
| `zin_eindil_guest` / Ask the Stranger's Counsel | host | 25 PP; 90-day cooldown | stability +2 %, war support +2 % |
| `zin_eindil_guest` / Speed Him On | host | 50 PP | delay −30; regard +10; ends the host's part of the stage |
| `zin_eindil_guest` / Detain Him | host (not Gala, not Yeldenne) | — | he stays 180 days more; delay +90; regard −30; `zin_eindil_restless_guest` |
| `zin_eindil_guest` / Swear to the Heir | stage 8 host, regard ≥ 25, renown ≥ 40 | 100 PP | `zin_eindil_sworn` |
| `zin_eindil_guest` / Enforce the War-King's Peace | confederation leader | 50 PP | war on a belligerent that refused the peace, 90 days to make it accept |
| `zin_glo_bearer` / Glo's Wave | the Host (decision owned by [Yeldenne and Glo](yeldenne_and_glo.md)) | 30 Glo power; 60-day cooldown | `zin_glo_wave` on a state where Eindil's army stands or next to it |
| `zin_eindil_host` / Call the Stranded Armies | the Host | 50 PP | invitations to stranded western, northern and eastern countries again |
| `zin_eindil_palace` / the three palace decisions | the Host | see stage 11 | see stage 11 |

### Events (namespace `zin_eindil`)

| Id | Title | To | Trigger |
| --- | --- | --- | --- |
| 1 | (hidden) Journey setup | every country, once | on_startup: stage 0, renown 0, delay 0 |
| 2 | (hidden) Journey pulse | the anchor country | every 7 days; checks floors and conditions, calls `zin_eindil_advance_stage` |
| 10 | The Man in the Ice | ice host | stage 1 |
| 11 | Talk of a Man from the Ice | Coldor, Isengard | stage 1 + 60 days |
| 12 | The Traders' Road South | ice host | end of stage 1 |
| 20 | The Bridge of the Three Oaths | site owner | stage 2 |
| 21 | Girdon's Winter Ford | Girdon or site owner | stage 2 + 45 days |
| 22 | Judgment in Gunwaith | Gunwaith | stage 2 + 90 days |
| 23 | The King Without a House | West Lands countries | end of stage 2 |
| 30 | The Grey Ford Breaks | confederation leader | stage 3 with a western war |
| 31 | Feud on the Grey Ford | confederation leader | stage 3 fallback |
| 32 | A Crown Offered | confederation leader | after 30 or 31 |
| 33 | The War-King's Terms | each western belligerent | 32 + 60 days |
| 34 | The Crown Laid Down | confederation leader | peace holds |
| 35 | The War-King Lays Down His Crown | news, West Lands and Concord | after 34 |
| 40 | West Over the Sea | departure host | stage 4 |
| 41 | Wreck on the Southern Isles | wreck host | 40 + 30 days |
| 42 | The Reef of Drowned Voices | island host | 41 + 60 days |
| 43 | The Shrine Beneath the Tide | shrine owner | 41 + 120 days |
| 44 | Stay and Rule Us | island with highest regard | 41 + 180 days |
| 45 | Carry the Old Tales to Gala | island host | end of stage 4 |
| 46 | Hunters in the Isles | island host | early warning, hunters sent |
| 50 | A Stranger at Gala | Gala Elves | stage 5 |
| 51 | Weeks of Memory | Gala Elves | 50 + 60 days |
| 52 | The Mirror of First Rain | Gala Elves | 51 + 30 days |
| 54 | Lorien's Gift | Gala Elves | 52 + 30 days |
| 60 | Lorien's Ship Sails North | Gala Elves | stage 6 |
| 61 | A Ship at Our Harbour | port of call (three times) | stage 6, every 40 days |
| 70 | Landfall in the Frozen North | landing owner | stage 7 |
| 71 | The Ambush | Afrit's country, landing owner, Yeldenne | 70 + 7 days, if Afrit lies in wait |
| 72 | Alone in the Snow | none (character only; news to Yeldenne) | ambush outcome |
| 73 | The Bearer Leaves Yeldenne | Yeldenne, witness | after the hall |
| 80 | A Stranger on Selen's Shore | stage 8 host | stage 8 |
| 81 | Alleria's Watch | Selen or substitute | 80 + 7 days |
| 82 | The Impostor | Aenor's government | 81 + 30 days |
| 83 | Warnings of the Heir | great powers, Middle Lands, friends | 81 + 60 days |
| 84 | The Hunt for the Impostor | host | every 90 days while hunted |
| 85 | The Impostor in Chains | Aenor's government | handed over or seized |
| 86 | The Bearer in the Forest | Magical Forest | `zin_war_of_last_crowns` or discovery |
| 87 | Varner and Golbran | Magical Forest | 86 + 90 days |
| 88 | A Dragon's Pact | Dragon Mountain owner | 87 + 60 days, repeats every 180 |
| 90 | On Dragon's Wings | news, all | stage 9 |
| 91 | The Wave of Glo | Host, Zol | 90 + 1 day |
| 92 | Raise the Host of Eindil | sworn country | 90 + 1 day |
| 93 | Ride with the Heir | qualifying players | after the Host exists |
| 94 | The Coalition of the Living | invitees | 92 + 7 days |
| 95 | Give the Lost Cause to the Heir | Lost Cause leader | 92 + 7 days |
| 96 | Volgan at the Southern Front | Host, Volgan | battle 1 |
| 97 | Varner's Last Wards | Host, Magical Forest | with 96 |
| 98 | The Gathering of the New Gods | Host | battle 2 |
| 99 | The Heir Does Not Rise | news, all | battle 2 without Glo |
| 100 | The Blue Sword Through Volgan | Host, Volgan | battle 3 |
| 101 | The Old God Comes Forth | Host, Zol, Gala Elves | battle 4 (hand-over) |
| 102 | Hailed as King | coalition | battle 5 |
| 110 | The Cliff | Host, Afrit's country | stage 10 |
| 111 | Below the Cliff | Alleria's employer | 110 + 3 days |
| 112 | Word of the King's Death | news, all | 110 + 7 days |
| 113 | The King Returns from the Dead | Host | recovery done |
| 120 | The Battle in the Palace (chain 120–126) | Host, Afrit's country | stage 11 |
| 127 | The Palace Holds | Host | failure |
| 130 | The Coronation of Eindil | Host, Aenor | stage 12 |
| 131 | A King in Parim | news, all | after 130 |
| 132 | The Crown Withheld | Host | Parim held by an enemy |
| 140 | The Heir Is Lost | news, all | `zin_eindil_lost` |

**The anchor country** for the pulse is the current host; at sea, the Gala Elves; if the Gala Elves do not exist, the first existing of the Magical Forest, Selen, Aenor. On_action `on_annex` and `on_capitulation` re-resolve the host: if the host is annexed, Eindil moves to the annexed country's friend with the highest regard (+30 days delay), never to the annexer.

**Secret-safe text.** Every event above shown to anyone but Afrit's country uses "the Deliverer", "Aurevan" or "the king in Parim" until `zin_afrit_revealed`. Event 110 and the palace chain have two text variants switched on that flag.

### Game rules

`zin_rule_eindil_journey` (group "ZIN story"):

| Option | Effect |
| --- | --- |
| DYNAMIC (default) | AI chooses with the weights below; players choose freely |
| HISTORICAL | AI always takes the "(hist)" options; delay from AI is 0; players still choose freely |

`zin_rule_historical_path` (world, [03_gameplay/06_historical_path_and_ai.md](../03_gameplay/06_historical_path_and_ai.md)) forces HISTORICAL.

### Interface

The Realm panel ([07_interface](../07_interface/)) shows, once `zin_eindil_awake` is set, a small "Rumours of the Man from the Ice" line with stage name and renown; regard toward the player's country appears in the tooltip. Nothing shows at stage 0.

## AI

- **Historical rule:** every "(hist)" option; the Grey Ford Confederation forms; one port of call reports the ship; the Gala Elves equip him generously; nobody sends guides; Afrit's country lies in wait; Selen shelters and swears; the Magical Forest shelters and grants the dragon; the Lost Cause passes to the Host.
- **Dynamic rule:** help options base 70; hinder base 10. Modifiers: ×3 hinder if the country has ≥ 3 `zin_footholds`; ×2 hinder if Dominion with stance `zin_dom_warlord` (binding a great warrior); ×0 hinder for Light countries with stance `zin_light_wardens` or `zin_light_sanctuary`; ×2 help if already a friend. AI never takes "Try to keep the war-king".
- **AI hosts with Eindil as a general** put him on their largest defensive front; never on an offensive front.
- **The Host of Eindil (AI):** `add_ai_strategy` to prioritise fronts against Zol, then Volgan, then Afrit's country; to protect Parim; and to befriend every friend. It uses Glo's Wave whenever Glo power ≥ 30 and Zol divisions stand in a state its armies border. It starts the palace chain as soon as it is available.
- **Coalition invitees** accept with chance 30 % + regard % (historical: friends accept).

## Acceptance

1. On 1 Thaw 1748 `zin_eindil_stage` is 0, no country employs `zin_eindil`, and no localisation reachable at start mentions Eindil, the Man from the Ice or Afrit (compiler text check plus a start-state check).
2. With `zin_rule_historical_path` on and no player, a 12-year observer run reaches stage 12 by 31 Longnight 1760, and each stage starts within 120 days after its floor.
3. On that run, the flags are set in this order: `zin_eindil_awake`, `zin_eindil_war_king`, `zin_eindil_named`, `zin_horos_dead` with `zin_glo_with_eindil`, `zin_eindil_returned`, `zin_varner_dead`, `zin_eindil_restored`, `zin_horos_sword_broken`, `zin_eindil_cast_down`, `zin_afrit_dead`, `zin_golbran_dead`, `zin_eindil_wears_necklace`, `zin_eindil_crowned`.
4. On that run, the ambush strength is ≥ 4 and the crew dies.
5. The character's name reads "The Man from the Ice" before `zin_eindil_named` and "Eindil" after.
6. A host that starts an offensive war loses Eindil within one pulse (negative test).
7. Every hindrance option adds delay and never sets `zin_eindil_lost` before stage 9 (scenario test of each option).
8. Removing the stage host (annex in a test scenario) moves Eindil to a friend and the journey continues (negative test).
9. With the war never starting (scenario), stage 9 begins on 1 Thaw 1758 and the journey still ends in stage 12 or `zin_eindil_lost`.
10. A player in the sworn country can raise the Host, and a player elsewhere with regard ≥ 50 is offered the switch; the switch moves the player to the Host.
11. At the coronation Eindil is Aenor's country leader and, if the Host was dynamic, it no longer exists.
12. No event text shown to a country other than Afrit's contains "Afrit" before `zin_afrit_revealed` (compiler).
13. Every modifier in this spec exists in the game's modifier documentation; every effect and trigger named exists in the effect and trigger documentation (generator test).

## Open questions

1. **Can Eindil die in play?** This spec makes him safe before stage 9 and lets him be lost only in the late divergences (no Glo at the New Gods, a failed palace). Is that the right balance?
2. **The western confederation.** Which realms made him war-king? The spec builds the "Grey Ford Confederation" from regard; the owner may name its members, and say whether it was one side of the Gunwaith–Girdon war or a third party (the spec assumes a third party).
3. **Eindil's ice and the episode sites.** Which states hold Eindil's ice, the Bridge of the Three Oaths, Girdon's Winter Ford, the southern shrine and the Yeldenne landing?
4. **Where is Eindil between 1754 and 1757?** The spec proposes Selen, then the Magical Forest with Varner and Golbran. Does the owner agree?
5. **Is the Host of Eindil a country?** The spec uses Selen as the historical host (Alleria's homeland) and a dynamic Aenoran country as the fallback. Would the owner prefer a single new country, or Eindil only as a general of the Lost Cause?
6. **Horos's words at Yeldenne.** The vault's line "Afrit, son of Ein" names Afrit before the world knows. The spec hides the name from all but Afrit's country until `zin_afrit_revealed`. Should the Yeldenne player and Eindil's host see the name at that moment?
7. **Arm and Necklace.** The text avoids which arm he loses and what the Necklace does. Confirm that both stay unstated.
