# Eindil's Journey: Events

**Status:** Ready. Reviewed 19 October 2026 against CONVENTIONS "Status"; integrated 19 October 2026. **Priority:** 5. **Phase:** 5.

## Purpose

[eindil_journey.md](../04_mechanics/eindil_journey.md) defines the journey as a system: stages, floors, hosts, renown, regard, delay, the Host of Eindil, and an id list for namespace `zin_eindil`. It leaves the event text to this folder. This spec:

- writes every journey event as an event chain, stage by stage, with the host that receives it, what fires it, its text, its options and their effects, the flags and variables it touches, and its historical timing;
- gives each stage's **host variants**: the default host, the fallback host, and text variants by host people or region;
- adds the events the system needs but did not list, in `zin_eindil` ids 150–169 (contract addition `zin_eindil.150-.169`; 170–199 stay reserved);
- reconciles the places where the journey, Afrit, Aenor, Lerendor, Yeldenne and Glo specs each claim the same moment, by naming one owner and one order, following [INTEGRATION_DECISIONS.md](../INTEGRATION_DECISIONS.md).

Stages 0 to 8 are fully specified here. For stages 9 to 12 this spec covers the Host's own beats (raising the Host, the coalition, Eindil's wounds and recovery, the palace decisions). The battles of stage 9, the cliff, the palace battle and the coronation are specified as the war's chain in [03_war_of_the_last_crowns.md](03_war_of_the_last_crowns.md); the Lost Cause ending in [04_endings.md](04_endings.md).

The conventions C1 to C12 of [01_golden_king_and_succession.md](01_golden_king_and_succession.md) apply. Two of them are sharpened by decisions:

- **C2 and D4.** Before `zin_eindil_named` his name is always `[zin_loc_eindil]` ("the Man from the Ice"). "The stranger" is used only as a plain noun, and "the King Without a House" only as the West's epithet in `.23` and later western text. "Eindil" appears only in `.52` and later.
- **C1 and D3.** Until `zin_afrit_revealed` no text a non-Worshipdom country reads names Afrit. Eindil's warnings say "the king in Parim is not what the temples say"; they never give the name and never say "brother".

## Lore basis

| Fact | Status | Source |
| --- | --- | --- |
| Eindil wakes in the Cold Lands without memory; local tribes find and nurse him; West Lands travellers take him south | established | *Eindil*, *Fourth Age Canon Register* |
| He aids communities, brings peace between rivals, briefly serves as king in western territory and lays the title down | established | *Fourth Age Canon Register*, *The Fourth Age of Erdae* IV |
| A failed crossing toward Aenor leads him to the Islands of the South; he lives among islanders; their saying sends him to Gala | established (saying proposed) | *Fourth Age Canon Register* |
| Lorien speaks with him for weeks, names him son of Ein, grandson of Aen, shows a vision of coming events, gives a ship, armour, a sword and a crew of western friends, southern islanders and Gala elves, and sends him to Horos | established | *Lorien*, *The Journey of Eindil* |
| Afrit's agents report him; the crew is killed in an ambush; Eindil continues alone through snow | established | *Fourth Age Canon Register* |
| At Yeldenne he learns that the public god-king is his brother; Horos gives Glo and the blue sword | established | *Eindil*, *Horos* |
| He warns Aenor; most of the court denounces him as an impostor; frontier troops, scholars and branches of the Lost Cause believe him | established | *The Fourth Age of Erdae* VIII |
| He returns on a dragon with Varner and Golbran | established | *Fourth Age Canon Register* |
| The names "the Man from the Ice" and "the King Without a House"; the Bridge of the Three Oaths, Girdon's Winter Ford, the Gunwaith trial; the reef of drowned voices and the shrine beneath the tide; the Mirror of First Rain; Alleria investigating and sheltering him; the dragon entrusted by Magical Lands elves | proposed | *The Fourth Age of Erdae* IV–X, vault proposal notes |
| Old Siula (the elder who finds him), Lawspeaker Ilurda (`zin_gunwaith_ilurda`), Master Ilsabet Vothrim (`zin_ilsabet`) | proposed | [02_characters.md](../02_lore/02_characters.md) |
| Dates 4A 1749 to 1754 for stages 1 to 8 | proposed | *Fourth Age Chronology* |
| Every host assignment, event, title, text, option and number below | **proposed** | journey spec and this spec |

**Kept open:** the birth order of Ein's sons and why Ein refused Afrit; how, where and why Eindil was put to sleep and why he lost his memory; which western rulers made him war-king and where his western kingship lay; the exact places of his ice, the shrine and the landing; the location of the Castle of Yeldenne; Glernaen's symbols and cult; what Glo leaves him after the war. Text never answers these.

## Design

### The chain at a glance (historical path)

| Stage | When (proposed) | Default host | Events |
| ---: | --- | --- | --- |
| 1 | Ironfrost – Emberleaf 1749 | the owner of `zin_is_site_eindil_ice` | `zin_eindil.10`, `.150`, `.151`, `.11`, `.12`, `.152` |
| 2 | Emberleaf 1749 – Thaw 1750 | the three episode site owners; Gunwaith | `.20`, `.153`, `.21`, `.154`, `.22`, `.155`, `.23` |
| 3 | Rainwake – Harvest 1750 | the Grey Ford Confederation's leader | `.30` or `.31`, `.32`, `.156`, `.33`, `.157`, `.34`, `.35` |
| 4 | Thaw 1751 – Deepwinter 1752 | departure host; Howan; Nara or Verde; Enhis Is Rond | `.40`, `.41`, `.158`, `.42`, `.43`, `.44`, `.159`, `.45`; divergence `.46` |
| 5 | Deepwinter – Goldfield 1752 | the Gala Elves | `.50`, `.51`, `.160`, `.52`, `.54`, `.161` |
| 6 | Deepwinter – Sowing 1753 | at sea; three ports of call | `.60`, `.61` ×3, `.162` |
| 7 | Sowing – Emberleaf 1753 | the owner of `zin_is_site_yeldenne_landing`; Yeldenne | `.70`, `zin_afrit.33`, `.71`, `.72`, hall (`zin_glo.20`–`.25`), `.73`, `.163` |
| 8 | Deepwinter 1754 – Goldfield 1757 | Selen, then the Magical Forest | `.80`–`.88`, `.164`–`.169` |
| 9–12 | 1757 – 1760 | the Host of Eindil (Selen, S2); Aenor | `.90`–`.140`; battle chains in [03](03_war_of_the_last_crowns.md) |

Floors are the journey spec's, written pace-shifted from `zin_story_pace` (C7, V4).

### One owner per moment (reconciliation)

Several specs describe the same moment. This table names one owner and one order. Rows marked **decision** apply [INTEGRATION_DECISIONS.md](../INTEGRATION_DECISIONS.md); the others are dependencies on the specs named, and this order is the one implemented.

| Moment | Specs involved | Owner and order |
| --- | --- | --- |
| Afrit hears that a castaway speaks of Aen (stage 4 divergence) | journey `.41` option B, Glo `zin_glo.5` | `zin_glo.5` (Glo spec) is the only event; the journey's option fires it |
| Rumour of a war-king from the ice (stage 3) | Afrit `zin_afrit.30` | Afrit spec; hub only, rumour only; fired by the Afrit spec on `zin_eindil_war_king` with `zin_worshipdom_western_ears` |
| Afrit hears that Lorien named the stranger | Afrit `zin_afrit.31`, Glo, journey `.52` | **Decision N8.** `zin_afrit.31` *Word from the Lands of the Sun* is the only report. The Afrit spec fires it after its own delay from `zin_eindil_named` (30 days with Gala footholds ≥ 1, else 120; −5 per Whispers level; −15 each for `zin_worshipdom_western_ears` and `zin_worshipdom_early_warning`; never under 10). Its options are the union of both specs, in the Afrit spec's order for checkpoint 09 (E2): *Stay in Parim*, *Go north and lie in wait* (hist), *Go north and take Glo at once*, *Send others*. The Glo spec has no report event of its own. `zin_glo.11` *The Approach to Yeldenne* stays as the arrival event |
| The voyage north and Merovan holding the seals | Afrit `zin_afrit.32`, Aenor, Glo | Decision `zin_afrit_northern_voyage` fires `zin_afrit.32`, which sets `zin_aurevan_went_north` and fires `zin_reign.81` to Aenor ([01](01_golden_king_and_succession.md)). Voyage time is the Afrit spec's (60 days, 30 with `zin_worshipdom_cold_maps`; R6) |
| The ambush | Afrit `zin_afrit.33`, journey `.71` | **Decision N9.** `zin_afrit.33` is the hub's choice (*Let them land* first, *Spare none* second; checkpoint 09, E2). **`zin_eindil.71`** resolves the ambush with the journey's base 5, plus 1 for each Afrit-spec term (`zin_worshipdom_ships_ready`, `zin_worshipdom_hunters`, `zin_afrit_seat_whispers` ≥ 4). Formula in stage 7. Historical result stays ≥ 4 |
| The hall | Glo `zin_glo.20`–`.25`, Afrit `zin_afrit_wound` | Glo spec owns; this spec only reads the result in `.73` |
| The crown's answer to the impostor | journey `.82`, Aenor | **Decision O4.** **`zin_eindil.82`** is the only event; the Aenor spec has no warning event of its own. Its options are the union of both specs (*Leave it to the chancery*, *Denounce and hunt*, *Let him speak* = *Hear him out*, *Seize him*, *Shelter him*) and carry the Aenor spec's camp effects |
| The warning at Lerendor | journey `.83`, Lerendor `zin_leren.45` | Lerendor is left out of `.83`'s recipients. When `.83` fires, its immediate block fires `zin_leren.45` *A Stranger's Warning* to Lerendor in its place, replacing the Lerendor spec's stand-in trigger (dependency) |
| The hunt for the impostor | journey `.84`, Afrit `zin_afrit.40` | Both call the journey's `zin_eindil_start_hunt` (`.82` *Denounce and hunt*, or the hub's *Hunt him* in `zin_afrit.40`), which sets `zin_eindil_hunt_active`; `.84` runs while it is set and no Aenor realm has `zin_eindil_crown_shelters`. One hunt; the rolls do not stack |
| The Afrit effects named by the journey | journey, Afrit | **Decision O2.** The journey uses the Afrit spec's names only: `zin_afrit_lose_artifact` (one call per artifact, from the Afrit stages), `zin_afrit_returned`; `zin_afrit_die` is called once, by the Afrit chain |
| Portraits | journey, this spec | The journey spec owns Eindil's states (its actor): seven portraits E1–E7, wanderer (stage 1), war-king (stage 3), named (stage 5), bearer (stage 7), restored (stage 9), maimed (stage 10), crowned (stage 12). This spec follows it; the naming in stage 5 changes both the name and the portrait (E3) |

### Host variants

Each stage's first event goes to the default host. If that country does not exist, is capitulated (`has_capitulated`), or is at war with the stranger's previous host, the fallback takes its place and the event text uses the fallback's name through `[ROOT.GetName]`. Text variants by people use the peoples spec's triggers (`zin_people_is_<key>`).

| Stage | Default host | Fallback | Text variants |
| ---: | --- | --- | --- |
| 1 | Owner of `zin_is_site_eindil_ice` (a north-western Cold Lands realm; map step) | the Cold Lands country nearest the site that is not Coldor or Isengard | `men`: "the clan's hunters"; `yeti`: "the yeti of the white valleys"; `giants`: "the ice giants' herders" |
| 2 | Owners of `zin_is_site_three_oaths`, `zin_is_site_winter_ford`; Gunwaith | site owner; for the trial, the owner of Gunwaith's former capital | Western realm names; Girdon's text speaks of "wardens", Gunwaith's of "clans and lawspeakers" |
| 3 | Leader of the Grey Ford Confederation (journey rule) | next candidate by regard | Leader name; the feud named "the Grey Ford" in both cases |
| 4 | Departure host; wreck host (proposed Howan); reef (Nara or Verde); shrine (owner of `zin_is_site_south_shrine`, proposed Enhis Is Rond) | the Islands of the South country with the most coast; for the shrine, any island realm | Island names only |
| 5 | Gala Elves | the country that employs `zin_lorien`; then Gala's capital owner (Lorien re-recruited as advisor) | Exile variant: "Lorien's court in exile at [ROOT.GetName]" |
| 6 | At sea; ports of call (Islands of the South, Triton's Islands or West Lands coast, Cold Lands west coast) | — | Port names |
| 7 | Owner of `zin_is_site_yeldenne_landing`; owner of Mp'E | — | "The Castle of Yeldenne" always; "the hall" if Mp'E has another owner (the Glo spec's *The Hall Remains*) |
| 8 | Selen (Alleria) | the Middle Lands country with the highest regard that is not Aenor and not ruled by Afrit's camp; then the Magical Forest | Selen: "the rangers of Selen"; others: "[ROOT.GetAdjective] scouts" |

### Effects used by every table

Regard, renown and delay change only through the journey's effects `zin_eindil_add_regard`, `zin_eindil_add_renown` and `zin_eindil_add_delay` (C12). A host is set with `zin_eindil_set_host` and cleared with `zin_eindil_clear_host`. "Stability +0.03" is `add_stability = 0.03`; "manpower" is `add_manpower`; "PP" is `add_political_power`; "army experience" is `army_experience`; spirits are `add_timed_idea` or `add_ideas` from the journey spec's ideas file. AI weights marked "help" and "hinder" follow the journey's dynamic rule (AI section).

### Stage 1: The Man in the Ice (4A 1749)

Floor: 1 Ironfrost 1749 + 0–20 days (journey spec). `zin_eindil_advance_stage` sets `zin_eindil_awake` and stage 1, then fires `.10`. Picture `man_in_ice` (gate `zin_eindil_awake`, set before the event fires).

| Id | Title | To | Fired by | Hist. | Text gist | Options (effects; AI) |
| --- | --- | --- | --- | --- | --- | --- |
| `.10` | The Man in the Ice | ice host | `zin_eindil_advance_stage` (stage 1) | Ironfrost 1749 | "Hunters cutting a path across the old ice found a man inside it. When they broke him out, he breathed. He does not know his name, or ours." Fires `.150` in 30 days and `.151` in 60 days | **"Nurse the stranger."** `zin_eindil_set_host` as corps commander with `zin_eindil_man_from_the_ice`; spirit `zin_eindil_stranger_among_us`; regard +20; renown +5 (hist; help). **"Leave him to the elders."** host; regard +5. **"Bind him to our service."** host; he stays 365 days; spirit `zin_eindil_restless_guest`; delay +120; regard −30 (hinder) |
| `.150` | Old Siula's Tale | ice host | 30 days after `.10` | Thaw 1749 | "Old Siula, who found him, tells it at every fire: the ice was older than her grandmother's grandmother, and the man in it was warm." (Siula is an event-only figure, proposed in the characters spec.) | **"Let the tale travel."** renown +5; fires `.11` to Coldor and Isengard in 15 days (AI 60). **"Keep it among the clans."** stability +0.02; fires `.11` in 30 days (AI 40) |
| `.151` | The Man from the Ice Learns Our Words | ice host | 60 days after `.10` | Rainwake 1749 | "In two months he speaks our tongue as if he had always known it. He hunts better than our best. He shares the meat." | **"He is one of us now."** regard +5; army experience +5 (AI 70). **"He is a guest, not a son."** nothing (AI 30) |
| `.11` | Talk of a Man from the Ice | Coldor, Isengard | `.150` (15 or 30 days) | Sowing 1749 | "Hunters from the north-west tell of a man cut alive from old ice, stronger than three. The court laughs, or listens." | **"Ignore northern tales."** nothing (hist 100). **"Summon him to court."** `random_list` 50: he comes; the summoner is host for 90 days; delay +30; regard +10 with the summoner. 50: he declines politely; nothing (FREE 20). Coldor only, with `zin_cold_far_ice_charted`: **"Send the wardens to watch over him."** the Cold Lands spec's `zin_cold_send_wardens` (regard +10, renown +2, no delay) (FREE 20; hist 0) |
| `.12` | The Traders' Road South | ice host | 150 days after stage 1 began (the stage-2 condition) | Emberleaf 1749 | "Western traders are going south before the snows. The stranger asks to go with them. He wants to know who he is, and the south is where the old stories come from." | **"Give him furs and provisions."** delay −30; regard +10; renown +5; with `zin_cold_neck_road` it also calls the Cold Lands spec's `zin_cold_reward_ice_host` (`value` 5: lean +5 toward Fandanar for the host) (hist; help). **"Let him go as he came."** nothing |
| `.152` | Traders Bring a Stranger | the West Lands owner of `zin_is_site_three_oaths`; Coldor too if `zin_cold_neck_road` | with `.12` | Emberleaf 1749 | "A trading caravan comes over the Neck Road with a tall man from the north who works for his bread and asks questions about Aen." | **"Let him pass."** nothing. Information only; tells players where he goes |

**Divergences.** Binding him delays every later stage by 120 days and makes the ice host resented (no coalition invitation). Coldor or Isengard summoning him adds 30 days and a friend. None can kill him (journey rule).

### Stage 2: The Road South (4A 1749–1750)

Three episodes 45 days apart. Each host recruits him for the episode and releases him after it.

| Id | Title | To | Fired by | Hist. | Text gist | Options (effects; AI) |
| --- | --- | --- | --- | --- | --- | --- |
| `.20` | The Bridge of the Three Oaths | owner of `zin_is_site_three_oaths` | stage 2 | Emberleaf 1749 | "Two lordships meet on the old bridge with torches, each to burn the other's granary after a bad harvest. The stranger from the north stands in the middle of the bridge and asks them to count the bread first." | **"Accept his mediation."** stability +0.03; regard +20; renown +5; country flag `zin_eindil_episode_20_done`; fires `.153` (hist; help). **"Burn the grain anyway."** timed spirit `zin_eindil_burned_granaries` (180 days); regard −20; renown +5 (he saves what he can) (hinder) |
| `.153` | The Bread Counted | the other lordship's owner, if different from the host | `.20` A | Emberleaf 1749 | "Our lord kept his granary. The tale of the bridge is told in both halls." | **"Remember the stranger."** regard +10 |
| `.21` | Girdon's Winter Ford | Girdon (or the owner of `zin_is_site_winter_ford`) | `.20` + 45 days | Longnight 1749 | "The ford is breaking up under ice and a column of refugees is still on it. The stranger stands in the freezing water and holds the last cart until the children are across." | **"Hold the ford open for them."** manpower +2,000; regard +20; renown +5; fires `.154` in 30 days (hist; help). **"Close the ford."** delay +60; regard −25 (hinder) |
| `.154` | The Refugees Settle | Girdon or site owner | 30 days after `.21` A | Deepwinter 1750 | "The refugees from the ford have built a village on our side. They have named its well after the stranger." | **"Let the name stand."** stability +0.02 |
| `.22` | Judgment in Gunwaith | Gunwaith (or the owner of its former capital) | `.20` + 90 days | Ironfrost 1750 | "The stranger beat three champions hired by a Gunwaith thane to settle a quarrel. Now the thane demands he be tried. The stranger agrees, and asks only that the law be the same for him as for anyone." | **"Try him fairly."** timed spirit `zin_eindil_judgment_honoured` (365 days); regard +20; renown +10; `.155` in 7 days (hist; help). **"Make an example of him."** held 180 days, then released; delay +180; regard −40; renown +5 (hinder). **"Pardon him."** he refuses exemption; same effects as A, different text |
| `.155` | The Lawspeaker's Ruling | Gunwaith | 7 days after `.22` A or C | Ironfrost 1750 | "Lawspeaker Ilurda rules: the stranger owes the thane a season's labour and nothing more. He pays it in a month, rebuilding the bridge the champions broke." Ilurda is `zin_gunwaith_ilurda` (characters spec, proposed); if Gunwaith no longer employs her, the text says "the lawspeaker" | **"The law holds."** stability +0.02 |
| `.23` | The King Without a House | every West Lands country if renown ≥ 20; else the hosts only | end of stage 2 | Thaw 1750 | "From the Bridge of the Three Oaths to the courts of Gunwaith, people speak of [zin_loc_eindil], who makes peace and asks for nothing. Some call him the King Without a House." | **"A good man, wherever he is from."** nothing. Gunwaith and Girdon: regard +5 |

### Stage 3: The War-King (4A 1750)

When the Truce of the Grey Ford breaks (the western spec's `zin_west_break_truce` sets `zin_west_truce_broken` and `zin_west_grey_ford_war`), the confederation asks the stranger to lead. If no western war has begun by 1 Fallowing 1750, the fallback feud fires instead. Picture `war_king`.

| Id | Title | To | Fired by | Hist. | Text gist | Options (effects; AI) |
| --- | --- | --- | --- | --- | --- | --- |
| `.30` | The Grey Ford Breaks | confederation leader | `zin_west_grey_ford_war` during stage 3 | Rainwake 1750 | "Gunwaith and Girdon fight at the Grey Ford again. The crowns between them cannot stop it alone. Someone says: ask the stranger." | **"Ask him."** fires `.32` |
| `.31` | Feud on the Grey Ford | confederation leader | stage 3 fallback, 1 Fallowing 1750 | — | "A border feud at the Grey Ford threatens the truce. The crowns between ask the stranger to stand between the two." No war starts | **"Ask him."** fires `.32` |
| `.32` | A Crown Offered | confederation leader | after `.30` or `.31` | Highsun 1750 | "The confederation offers the stranger a war-king's crown for as long as it takes to make the peace." | Checkpoint 04 (C9), written in this order: **"Refuse the stranger."** first (below), then **"Name him war-king."** `zin_eindil_set_host` as field marshal with trait `zin_eindil_war_king`; members get spirit `zin_eindil_war_kings_banner`; `give_military_access` among members; `zin_west_add_unity` +5; portrait war-king; fires `.156` to members and `.33` in 60 days (hist; help). **"Refuse the stranger."** the offer passes to the next candidate; if none accepts in 90 days the stage ends without a war-king (`zin_eindil_war_king` still set under the historical rule, otherwise not) |
| `.156` | The Confederation Gathers | each confederation member except the leader | `.32` A | Highsun 1750 | "Our banners will march under the stranger's for one season. Our captains want to know if he can lead." | **"Send our captains."** army experience +5; regard +5 (AI 70). **"Watch from our own shore."** leaves the confederation; regard −5 (AI 30) |
| `.33` | The War-King's Terms | each western belligerent | `.32` + 60 days | Goldfield 1750 | "The war-king's host stands between the armies at the Grey Ford. He offers terms: the old border, the dead buried, the prisoners home. He asks both sides to sign." | **"Accept his peace."** when both accept: `zin_west_end_ford_war` (`how` = peace; the western spec cancels the border war and adds its unity and grudge changes), never `white_peace`; both get spirit `zin_eindil_war_kings_peace` (730 days); regard +15; fires `.157` in 14 days (hist; help). **"Fight on."** stays at war; the leader may take decision `zin_eindil_enforce_peace`; regard −20; `zin_west_add_unity` −10 |
| `.157` | A Feast at the Ford | both belligerents (if both accepted) | 14 days after `.33` | Goldfield 1750 | "Gunwaith's thanes and Girdon's wardens eat at one table at the ford for the first time in fifty years. The war-king sits at the foot, not the head." | **"To the stranger."** `add_opinion_modifier` `zin_eindil_feast_at_the_ford` (+10) each way; stability +0.02 |
| `.34` | The Crown Laid Down | confederation leader | the peace holds | Harvest 1750 | "The war-king sets the crown on the table and asks for a horse and a road to the sea. He wants to cross to the old kingdom of Aen." | **"Release him with honour."** sets `zin_eindil_war_king`; regard +20; renown +15; the western spec adds unity +5 and sets `zin_west_remembers_war_king` (hist; help). **"Try to keep the war-king."** he leaves by night; sets `zin_eindil_war_king`; regard −50 with the leader; the confederation dissolves; `zin_west_add_unity` −15; renown +10 (AI never) |
| `.35` | The War-King Lays Down His Crown | news: West Lands, Concord dominions, Aenor | after `.34` | Harvest 1750 | "In the West a stranger made a peace no king could make, then gave the crown back. Nobody knows his name." | One option |

Note: the Golden King dies in Mistfall 1750, two months later. Neither event refers to the other.

### Stage 4: The Storm and the Islands of the South (4A 1751)

He sails for Aenor from the leader's coast. At sea he is not recruited (`zin_eindil_clear_host`). Pictures `generic_sea` (`.40`), `storm_wreck` (`.41`–`.46`, `.158`, `.159`; gate `zin_eindil_war_king`, which stage 4 requires).

| Id | Title | To | Fired by | Hist. | Text gist | Options (effects; AI) |
| --- | --- | --- | --- | --- | --- | --- |
| `.40` | West Over the Sea | departure host | stage 4 | Thaw 1751 | "The stranger asks for passage across the wide sea to Aenor. He has heard that the oldest rolls of Aen's line are kept in Parim." | **"Give him a ship."** regard +10 (hist; help). **"Let him find passage."** delay +30 (hinder) |
| `.41` | Wreck on the Southern Isles | wreck host (proposed Howan) | `.40` + 30 days | Rainwake 1751 | "Storms took a western ship far off its course. It broke on our reef. One passenger walked out of the surf carrying two sailors." | **"Shelter the castaways."** host as corps commander; regard +20; fires `.158` in 30 days (hist; help). **"Sell news of him to the Deliverer's priests."** only if the host has `zin_footholds` ≥ 1; fires `zin_glo.5` to Afrit's country; delay +60; regard −40; +50 PP; schedules `.42` in 60 days and `.43` in 120 days (hinder; ×3 with footholds ≥ 3) |
| `.158` | The Islanders' Feast | wreck host | 30 days after `.41` A | Sowing 1751 | "The island holds a feast for the drowned and the saved. The stranger sits with the fishermen and listens to their oldest stories." | **"Tell him the story of the reef."** `.42` in 1 day, `.43` in 90 days (AI 60). **"Tell him the story of the shrine."** `.42` in 30 days, `.43` in 60 days (AI 40) |
| `.42` | The Reef of Drowned Voices | wreck host, or Nara or Verde | `.158` or `.41` B | Highsun 1751 | "Children were stranded on the reef where drowned voices call at night. No boat would go. The stranger swam out and brought them back. The islanders say the sea went silent." | **"The sea went silent."** timed spirit `zin_eindil_the_sea_went_silent` (365 days); renown +5; permanent country flag `zin_eindil_reef_island` on the receiving island |
| `.43` | The Shrine Beneath the Tide | owner of `zin_is_site_south_shrine` | `.158` or `.41` B | Harvest 1751 | "At low tide the old shrine shows an inscription the priests have chanted for generations without knowing its meaning. The stranger reads one word aloud: Aen." The text does not identify him | **"What else does it say?"** renown +5; regard +5 |
| `.44` | Stay and Rule Us | the island with the highest regard | `.41` + 180 days | Mistfall 1751 | "The island elders ask the stranger to stay and be their lord. He thanks them and says no." | **"Honour his choice."** regard +10; fires `.159` in 30 days (hist; help). **"Hold him to the offer."** delay +60; regard −20 (hinder) |
| `.159` | A Pilot for the South-West | the island with the highest regard | 30 days after `.44` A | Longnight 1751 | "An old pilot offers to take him south-west, to where the tallest elves live, 'when the tales of men grow too old for any man to explain'." | **"Lend him the pilot."** delay −20; regard +5 (AI 80). **"Our pilots stay home."** nothing (AI 20) |
| `.45` | Carry the Old Tales to Gala | wreck host (or the island with the highest regard) | end of stage 4 | Deepwinter 1752 | "When the tales of men grow too old for any man to explain, carry them to Gala. The islanders give him a boat and the tale of Aen's name in the shrine." | **"Fair winds."** stage 4 ends |
| `.46` | Hunters in the Isles | wreck host | 90 days after `zin_glo.5` option *Send hunters* | divergence | "Armed men from a foreign ship came looking for the castaway. He drove them off. The island buried their dead." | **"Mourn the dead."** manpower −1,000; delay +60; renown +5; sets global flag `zin_eindil_hunted` (ambush +1) |

### Stage 5: Gala (4A 1752)

Host: the Gala Elves (established). Picture `gala_court`; `.52` wants the requested key `mirror_courtyard` and uses `gala_court` until it exists. The naming is not public news.

| Id | Title | To | Fired by | Hist. | Text gist | Options (effects; AI) |
| --- | --- | --- | --- | --- | --- | --- |
| `.50` | A Stranger at Gala | Gala Elves | stage 5 | Deepwinter 1752 | "A tall man from the Islands of the South asks to speak with the King. He carries a tale too old for men to explain, and a word from a drowned shrine." | Checkpoint 08 (C9): **"Turn him away for a season."** is written first, then **"Receive him."** host as advisor "Guest of Lorien" (`add_advisor_role`, slot `political_advisor`, idea token `zin_eindil_guest_of_lorien`, cost 0); regard +25 (hist; help). **"Turn him away for a season."** `.50` fires again in 180 days with only option A; delay +180; regard −10 (hinder). Gala cannot refuse him for good |
| `.51` | Weeks of Memory | Gala Elves | `.50` A + 60 days | Rainwake 1752 | "For weeks Lorien tells him of the War of Men, of Aen, of Dardan and of what came after. The stranger learns how small his memory is against the age of the world." | **"Memory is a duty."** renown +5; fires `.160` in 15 days |
| `.160` | What Lorien Will Not Say | Gala Elves | 15 days after `.51` | Rainwake 1752 | "Lorien sees signs of the First Men in him, but will not name a man on strength alone." | **"Then we will ask the water."** fires `.52` in 15 days; if `zin_mirror_stilled`, in 75 days with the records variant (Lands of the Sun spec) |
| `.52` | The Mirror of First Rain | Gala Elves | `.160` | Sowing 1752 | "In the old courtyard Lorien looks into the spring and sees the old royal line. 'Eindil, son of Ein, son of Aen.' The stranger sees a burning capital, armies from the west and the east, death moving from the north, a great darkness in the south, and his own hand holding a shard of broken blue metal." Records variant (stilled Mirror): "Lorien reads the oldest records of the First Men for sixty days, and then he says the name." | **"Eindil."** sets `zin_eindil_named`; `set_character_name` (`character = zin_eindil`, the name key "Eindil"); unit leader trait `zin_eindil_heir_of_aen`; portrait E3; `zin_sun_spend_clarity` 30 (not with the records variant); fires `.54` in 30 days. The Afrit spec then fires `zin_afrit.31` after its delay (N8). The Gala tree's `zin_gala.11` may follow through its focus |
| `.54` | Lorien's Gift | Gala Elves | `.52` + 30 days | Highsun 1752 | "Lorien gives Eindil a ship like no other, armour, a sword, and a crew: western friends, island navigators and Gala elves. He tells him to go north to Horos, who keeps Glo." | **"Equip him generously."** Gala pays what it has, up to 1,000 manpower and 500 `zin_elven_arms_equipment` (warfare spec; `infantry_equipment` until warfare stage 2), never below 0; sets `zin_eindil_elven_crew` (ambush −1); regard +15 (+5 with `zin_gala_gift_armour` or `zin_gala_crew_chosen`); fires `.161` in 7 days (hist; help). **"A ship and a sword, no more."** no cost; regard +5 |
| `.161` | Lorien's Warning | Gala Elves | 7 days after `.54` | Highsun 1752 | "Before the ship sails, Lorien warns him: a prophecy can frighten people into the very deeds it foretells. The water showed what may be, not what must be." | **"Fair winds, son of Ein."** stability +0.02 |

**Divergence.** If Gala turns him away, the naming waits 180 days; the Afrit report comes later; every later floor moves.

### Stage 6: The Voyage North (4A 1753)

He sails north for 150 days (120 with `zin_gala_great_ship`). `zin_eindil_host` is cleared; the anchor country is the Gala Elves. Picture `generic_sea`.

| Id | Title | To | Fired by | Hist. | Text gist | Options (effects; AI) |
| --- | --- | --- | --- | --- | --- | --- |
| `.60` | Lorien's Ship Sails North | Gala Elves | stage 6 | Deepwinter 1753 | "The King's ship leaves Gala with the son of Ein aboard. Lorien watches it from the harbour wall until it is gone." | One option; fires `.162` in 120 days |
| `.61` | A Ship at Our Harbour | one coastal country per call: the Islands of the South, then Triton's Islands or the West Lands coast, then the Cold Lands west coast | stage 6, every 40 days, three times | Ironfrost – Rainwake 1753 | "An elven ship with a mixed crew asks for water and timber. Its captain is a tall man who pays in Gala silver." | **"Resupply the ship."** delay −10; regard +10; renown +2 (hist: two of three; under the dynamic rule its weight doubles for a port with `zin_eindil_safe_harbour`). **"Say nothing."** nothing. **"Report the ship to the Deliverer's priests."** +50 PP; global variable `zin_eindil_ports_betrayed` +1 (ambush +1); regard −30, applied when `.83` fires (hist: one of three, the port with the highest `zin_footholds`; FREE weight rises with footholds ≥ 2) |
| `.162` | Ice in the Rigging | Gala Elves (witness) | 120 days after `.60` | Sowing 1753 | "Word comes back by a whaler: the elven ship was seen beyond the last port, iced to the masts, sailing north." | One option |

Meanwhile on Afrit's side: `zin_afrit.31` → decision `zin_afrit_northern_voyage` → `zin_afrit.32` (Merovan holds the seals; `zin_aurevan_went_north`; `zin_reign.81` to Aenor) → `zin_glo.11` (arrival at the approach; `zin_afrit_at_yeldenne`). Under the historical rule Afrit's party arrives before the landfall (the Afrit spec guarantees `zin_afrit_at_yeldenne` first).

### Stage 7: The Ambush and Yeldenne (4A 1753)

Pictures `cold_shore` (`.70`–`.72`, gate `zin_eindil_named`); `.73` uses `glo_given` (gate `zin_horos_dead`: every case in which Glo passes to Eindil has Horos dead). The hall uses the Glo spec's `yeldenne_hall` and `glo_given`.

**Ambush strength (N9).** `.71`'s immediate block computes the temporary variable `zin_eindil_ambush_strength`:

`5 + zin_eindil_ports_betrayed + 1 if zin_eindil_hunted + 1 if zin_worshipdom_ships_ready + 1 if zin_worshipdom_hunters + 1 if zin_afrit_seat_whispers ≥ 4 − 1 if zin_eindil_elven_crew − 1 each for zin_eindil_landing_guides, zin_yeldenne_beacon, zin_yeldenne_coast_watch, zin_yeldenne_guides − 1 if the hub chose Send others`

and writes it with `log = "ZIN journey: ambush strength [?zin_eindil_ambush_strength]"`. Historical: 5 + 1 port − 1 elven crew − 1 coast watch = 4, plus any Afrit terms; never below 4 on the historical path.

| Id | Title | To | Fired by | Hist. | Text gist | Options (effects; AI) |
| --- | --- | --- | --- | --- | --- | --- |
| `.70` | Landfall in the Frozen North | owner of `zin_is_site_yeldenne_landing` | stage 7 | Sowing 1753 | "An elven ship has anchored in our bay. Its crew are going inland, toward the silent castle." | **"Stay out of strangers' quarrels."** nothing (hist). **"Send guides inland."** sets global flag `zin_eindil_landing_guides` (ambush −1); regard +15. Fires `zin_afrit.33` to Afrit's country when the party waits |
| `zin_afrit.33` | The Ambush on the Shore | Afrit's country (private) | `.70` (landfall) while the party waits | Sowing 1753 | Afrit spec. "The ship is in the bay. Your men are in the snow above the path." | Checkpoint 09: **Let them land** / **Spare none** (hist) |
| `.71` | The Ambush | owner of the landing and of Mp'E; Afrit's country (private variant) | `.70` + 7 days, if the hub chose *Spare none*, or at once if it chose *Send others* | Sowing 1753 | Public: "Armed men waited in the snow above the path from the bay. The travellers from the elven ship fought them." The hub variant names the order he gave | Resolves by strength: ≥ 4 *None Survive* (hist; fires `.72`); 2–3 *A Few Survive* (two companions become unit leaders of the later Host); ≤ 1 *The Ambush Fails* (the crew lives; Afrit's party loses 20 days) (journey spec table) |
| `.72` | Alone in the Snow | owner of Mp'E (country event) | outcome ≥ 4 | Sowing 1753 | "Herders of Mp'E found a field of dead men in the snow below the castle road. One set of footprints went on toward the castle." | One option. Eindil gets the timed trait `zin_eindil_alone_in_the_snow` (180 days, `add_timed_unit_leader_trait`) |
| `zin_glo.20`–`.25` | Who Walks Here? and the hall outcomes | owner of Mp'E; variants | Glo spec | Goldfield 1753 | Glo spec. For every country but Afrit's, Horos says "Son of Ein. I know why your father denied you." | Glo spec |
| `.73` | The Bearer Leaves Yeldenne | Eindil's current host, or at sea the Gala Elves as witness | the hall resolves with `zin_glo_with_eindil` | Goldfield 1753 | "The castle is empty. The guardian is dust. The man who walked out carries a green light at his breast and a blue sword, and he knows now that the king in Parim, worshipped as the Deliverer, is his own brother, a son of Ein." Two-face (C3): after `zin_afrit_revealed` the name is written through `[zin_loc_deliverer]` | **"South, to warn them."** trait `zin_eindil_bearer_of_glo`; renown +10; portrait bearer; fires `.163` to the Gala Elves in 90 days |
| `.163` | Word From the North | Gala Elves | 90 days after `.73` | Emberleaf 1753 | "Whalers say the stranger lives, and carries a light out of the north. Of the crew they say nothing." | **"Then the voyage was not in vain."** the Lands of the Sun spec's counsel +5. Not fired if the Gala tree's focus *Word From the North* is done (it fires `zin_gala.12` instead) |

Hall case variants that change stage 7 (owned by the Glo spec): **B1** the heir already inside, Afrit driven off; **B2** the willing gift after 30 or 60 days; **C2/D2** Horos slain before the heir comes, Glo sealed: then `zin_glo.80` *The Seal Opens for the Heir* replaces `.73`'s text ("The hall is empty and sealed. The green light knows him.") and applies `.73`'s effects.

### Stage 8: The Warnings (4A 1754 to 1757)

Floor 1 Deepwinter 1754 + delay. Landfall in the Middle Lands, proposed on Selen's coast. Pictures: `generic_sea` (`.80`); `generic_court` (`.81`, `.82`, `.83`, `.85`, `.164`, `.165`, `.166`); `generic_wilds` (`.84`, `.86`, `.87`, `.168`); `lost_cause_triumph` (`.167`); `.88` and `.169` want the requested key `dragon_roosts` and use `generic_wilds` until it exists.

| Id | Title | To | Fired by | Hist. | Text gist | Options (effects; AI) |
| --- | --- | --- | --- | --- | --- | --- |
| `.80` | A Stranger on Selen's Shore | stage 8 host (Selen) | stage 8 | Deepwinter 1754 | "A man with a green light at his breast came ashore at night. He asked for the rangers, not the governor." | One option; fires `.81` in 7 days. The Aenor spec's `zin_aenor.160` *The Lost Cause Divided* fires to the Aenor realm when he lands (Aenor spec) |
| `.81` | Alleria's Watch | Selen or substitute | `.80` + 7 days | Ironfrost 1754 | "Alleria of Selen has heard him out for three nights. She believes enough to hide him, and not enough to stop asking questions." | **"Shelter him in secret."** host as corps commander; regard +25; decision category `zin_eindil_guest` opens; fires `.164` in 30 days, `.82` and `.83` (hist; help). **"Hand him to the court."** Aenor's government gets `.85`; regard −50; delay +60 (hinder) |
| `.164` | Alleria's Questions | Selen | 30 days after `.81` A | Thaw 1754 | "Alleria asks him for a proof only a son of Ein could give. He has none but the crystal, the sword and what the guardian told him." | **"The crystal is proof enough."** renown +5 (AI 60). **"Send to Parim's archives for the old rolls."** fires `.165` to the country employing `zin_ilsabet` (AI 40) |
| `.165` | Master Ilsabet's Rolls | the country employing `zin_ilsabet` (Aenor at start) | `.164` B, or 60 days after `.81` A while Aenor has `zin_reign_scholars_free` | Rainwake 1754 | "Master Ilsabet Vothrim of the University of Parim has found, in the oldest rolls, a line that ends with no burial: a son of Ein." The text proves nothing about the other son | **"Send the rolls to Selen."** `zin_ilsabet` is retired from the country and recruited by the host as theorist (`add_advisor_role`, slot `theorist`); renown +10; `zin_afrit_add_veil` −5 (FREE: Light or Wild government 60; ruled by Aurevan 0; hist 0). **"Lock the rolls away."** nothing (hist). **"Burn them."** only while `zin_afrit_rules_here`; `zin_afrit_add_veil` +3; renown −5; `zin_world_add_gathering_dark` +1 (FREE 30). Proposed: the rolls reach the heir only through a player or a non-Aurevan court; never on the historical path |
| `.82` | The Impostor | Aenor's government (whoever rules Aenor) | `.81` A + 30 days | Thaw 1754 | "A foreign stranger in the dominions claims the blood of Aen and speaks against the King. The chancery asks what to do." Variant per ruler (Aurevan, a surviving Golden King, a regency). The one warning event (O4) | Checkpoint 10 (C9), written in this order: **"Leave it to the chancery."** nothing; checkpoint 10 resolves at its latest date (AI 0). **"Denounce and hunt the impostor."** −50 PP; Aenor `zin_aenor_add_camp_support` (Host −20); stability +0.03; country flag `zin_aenor_eindil_denounced`; global flag `zin_afrit_impostor_denounced`; `zin_eindil_start_hunt` (the hunt `.84` starts); fires `zin_reign.83` once ([01](01_golden_king_and_succession.md)) (hist under Aurevan; Faithful and Court rulers). **"Let him speak."** renown +15; Host camp +10; `zin_aenor_add_lost_cause` +5; every Concord dominion gets `.83` at once (Dominions rulers; under Aurevan player only). **"Seize him."** `random_list` 60: `.85`; 40: fails, the host is exposed (`zin_eindil_seize_failed` −50 opinion both ways). **"Shelter him."** only for a Light or Wild government not ruled by Aurevan; Host camp +25; regard +25; country flag `zin_eindil_crown_shelters` (the journey's name; no hunt runs) (Captains' Regency and Host-camp rulers) |
| `.83` | Warnings of the Heir | every great power, every Middle Lands country, every country with regard ≥ 25; never Volgan, his subjects, Zol, the Worshipdom or Lerendor | `.81` A + 60 days | Rainwake 1754 | The naming has been private until now; this is the first text that gives other courts his name: "A man who calls himself Eindil, son of Ein, warns every court: armies will come from west and east, the North will abandon its oaths, Volgan is rebuilding his hosts, and the dead are stirring in the north. He says the king in Parim is not what the temples say." Regional variants below. Immediate block: fires `zin_leren.45` to Lerendor; applies the betrayed ports' regard −30 | **"Heed the warning."** spirit `zin_eindil_warning_heeded`; country flag `zin_eindil_heeded`; regard +15; `add_opinion_modifier` `zin_eindil_heeded_the_impostor` (−25) from Aenor's crown; `zin_afrit_add_veil` −8 (−4 with `zin_afrit_impostor_denounced`). **"Dismiss it."** nothing (hist for most). **"Denounce him."** `add_opinion_modifier` `zin_eindil_denounced_the_impostor` (+25) from Aenor's crown; regard −20 |
| `.84` | The Hunt for the Impostor | host | every 90 days while `zin_eindil_hunt_active` is set and no Aenor realm has `zin_eindil_crown_shelters` | 1754–1755 | "Parim's men are asking questions in our towns. Someone will talk." 15% (+10% with footholds ≥ 3) the shelter is found | Found: **"Hide him in the hills."** −50 PP (hist). **"Send him to the elves."** the stage moves on to the Magical Forest (`.86`) |
| `.85` | The Impostor in Chains | Aenor's government | handed over or seized | divergence | "The impostor is in the cells under the palace." | **"Guard him well."** nothing; `.166` in 60 days |
| `.166` | An Empty Cell | Aenor's government | `.85` + 60 days | divergence | "The cell is empty. The guards swear they never slept." He escapes to the Magical Forest (`.86`) | **"Hang the guards."** stability +0.01; regard −10. **"Say nothing."** nothing |
| `.167` | Frontier Companies Listen | Aenor's government | 120 days after `.83`, if Aenor's `zin_aenor_lost_cause` ≥ 30 | Highsun 1754 | "Captains of the Lost Cause's frontier companies have been seen at the stranger's fires." Follows the Aenor spec's `zin_aenor.160` | **"Recall them to Parim."** `zin_aenor_add_lost_cause` −5 (hist). **"Let them listen."** `zin_aenor_add_lost_cause` +5; regard +5 |
| `.86` | The Bearer in the Forest | Magical Forest | `zin_war_of_last_crowns`, `.84` B, or `.166` | Rainwake 1755 | "The rangers of Selen bring a man with a green light into our woods. The houses must decide whether the woods shelter him." | **"Shelter the bearer."** host; regard +20; fires `.87` in 90 days (30 with `zin_magical_forest_wizard_found`) (hist; help). **"Send him on."** host becomes Nolorim or the elven realm with the highest regard; delay +60 |
| `.87` | Varner and Golbran | Magical Forest | `.86` + 90 days | Goldfield 1755 | "The wizard of the Unbinding walks out of the trees with a small purple companion. He has heard of a green light in the woods." | **"The wizard is welcome."** `zin_varner` and `zin_golbran` recruited as advisors; renown +5; fires `.168` in 30 days and `.88` in 60 days |
| `.168` | The Wizard and the Bearer | Magical Forest | 30 days after `.87` | Harvest 1755 | "Varner looks at Glo for a long time and says only that it is lighter than it should be, and heavier." The text explains nothing of Glo's nature | **"Let them talk."** `add_tech_bonus` (bonus 0.3, uses 1, category `zin_cat_wards`) |
| `.88` | A Dragon's Pact | the Keeper of Dragon Mountain (`zin_world_is_dragon_keeper`) | `.87` + 60 days; repeats every 180 days | Mistfall 1755 – Goldfield 1757 | "The bearer asks the Keeper of the Roosts for a dragon, not as a servant, but as an ally who chooses to fly with him." | Checkpoint 19 (C9): **"The dragons are not ours to lend."** is written first (below), then **"Entrust a dragon to the bearer."** sets `zin_eindil_dragon_pact`; the magic spec reserves one dragon of the pool; `zin_elves_add_roost_bond` −5; fires `.169` in 7 days (hist when the floor allows). **"The dragons are not ours to lend."** repeats in 180 days; on 1 Goldfield 1757 Varner persuades the elves and option A runs |
| `.169` | The Dragon Chooses | the Keeper | 7 days after `.88` A | — | "A dragon from the high roosts lands in the clearing and bows its head to the man with the green light. Then it waits." | One option. The dragon is a free ally, not a subject. When `zin_eindil_returned` is set the magic spec grants the Host one flight (`zin_war_grant_dragons` amount 1, the air layer, S6) |

**Regional variants of `.83`.** One text key per group, chosen by triggers:

| Recipient | Variant line |
| --- | --- |
| Concord dominions | "He asks the dominions to keep their companies ready, not to rebel." |
| North Lands crowns (Lerendor gets `zin_leren.45` instead) | "He says the dead will come through the islands and the straits." |
| West Lands crowns with regard ≥ 25 | "The war-king of the Grey Ford has a name now." |
| East Lands courts | "He says eastern banners will cross the rift sea." |
| Elven realms | "He asks nothing of the elves but that they guard their own woods." |
| Mirolon | "He says what Mirolon has said for twenty years." (hist: heed) |
| Coldor, Isengard | "The man from the ice is a man of Aen's line, he says." |

**Who heeds (historical).** Selen, Mirolon, Kingson, Hiloron, the Magical Forest and the Gala Elves heed; the other great powers dismiss; Aenor's crown denounces. Under FREE the AI heeds with chance equal to renown (journey rule).

**Swearing to the heir.** The decision `zin_eindil_swear_to_heir` (host, regard ≥ 25, renown ≥ 40, after 1 Thaw 1755, 100 PP) sets the country flag `zin_eindil_sworn`; Selen swears on the historical path. Its text: "Selen swears to raise the heir's host when he returns."

### Stages 9 to 12: the Host's own beats

**The Host (S2).** Eindil leads Selen's armies as its field marshal and ruler-in-waiting; Selen keeps its own ruler. If Selen no longer exists, the Host is the country with `zin_eindil_sworn`; only if there is none is a dynamic country created (`create_dynamic_country`, journey step 2). The battles, the cliff, the palace battle and the coronation are specified in [03_war_of_the_last_crowns.md](03_war_of_the_last_crowns.md); this table lists the journey events that belong to the Host and their gist.

| Id | Title | To | Hist. | Text gist |
| --- | --- | --- | --- | --- |
| `.90` | On Dragon's Wings | news, all | 1 Thaw 1757 | "A man on a dragon came down on the field. Where he struck the earth, the dead fell and did not rise." `zin_eindil_advance_stage` sets `zin_eindil_returned` first |
| `.92` | Raise the Host of Eindil | Selen; if Selen no longer exists, the sworn country; else the dynamic Host | Thaw 1757 | "The heir has come back with a wizard and a dragon. Selen swore to raise his host." **Raise the Host** (cosmetic name) / **Stand beside him, remain ourselves** (own name); both keep Selen as the Host |
| `.93` | Ride with the Heir | human players with regard ≥ 50 whose country is not the Host | Thaw 1757 | "Will you ride with the heir?" Switch to the Host / Stay |
| `.94` | The Coalition of the Living | invitees | Thaw 1757 | "The heir asks every crown that fights the dead and the south to stand together. He asks no crown to kneel." |
| `.95` | Give the Lost Cause to the Heir | the Lost Cause's leader, if it has become a faction (S3) | Thaw 1757 | "The league the Golden King founded for his glory asks to serve the heir." |
| `.96`–`.102` | The battles of stage 9 | Host, Volgan, coalition | 1757 | See 03 |
| `.110`–`.113` | The Cliff; Below the Cliff; Word of the King's Death; The King Returns from the Dead | Host, Afrit's country, Alleria's employer | 1758 | See 03 |
| `.120`–`.127` | The Battle in the Palace chain; The Palace Holds | Host | 1759 | See 03 |
| `.130`–`.132` | The Crown Is Offered; The Host Comes Home; The Crown Withheld | Host, Aenor | 1760 | See 03 and 04 |
| `.140` | The Heir Is Lost | news, all | divergence | See 04; fires `zin_ending.80` with `days = 14` |

### Divergences at a glance

| Choice | Who | Delay | Other consequence |
| --- | --- | ---: | --- |
| Bind him (`.10` C) | ice host | +120 | resented; no invitation |
| Summon him (`.11` B) | Coldor or Isengard | +30 | the summoner becomes a friend |
| Burn the grain (`.20` B) | bridge host | — | resented; burned granaries |
| Close the ford (`.21` B) | Girdon | +60 | resented |
| Make an example (`.22` B) | Gunwaith | +180 | resented; Gunwaith less likely to pledge later |
| Refuse the crown / fight on (`.32` B, `.33` B) | confederation | — | lasting western war; unity falls |
| Keep the war-king (`.34` B) | leader | — | confederation dissolves |
| Let him find passage (`.40` B) | departure host | +30 | — |
| Sell news (`.41` B) | wreck host | +60 | `zin_glo.5`; possible hunters (+60, stronger ambush) |
| Hold him to the offer (`.44` B) | island | +60 | resented |
| Turn him away (`.50` B) | Gala | +180 | the naming and Afrit's report move later |
| Report the ship (`.61` C) | port | — | ambush +1 |
| Guides inland (`.70` B) | landing owner | — | ambush −1; crew may survive |
| Hand him over / seize him (`.81` B, `.82` C) | Selen, Aenor | +60 | resented; `.85`, `.166` |
| Refuse the dragon (`.88` B) | Keeper | up to 1 Goldfield 1757 | later return |

Before stage 9 nothing kills him. Hindrance only delays him and costs the hinderer (journey rule).

## Implementation

### Builder and files

The journey's events are written by a new content-builder module, applied in the same transaction as every other module (`tools/content/build.mjs`, `tools/content/apply.mts`).

| Path | Written by | Content |
| --- | --- | --- |
| `tools/content/data/events/eindil.json` | data (proposed location) | Every `zin_eindil` event: id, title and text keys with their variant triggers, recipients rule, firing (effect, parent with `days`, or pulse condition), window, picture key, options (effects as data, `ai_chance` by rule) |
| `docs/design/eindil_route.json` | data (journey spec) | Stage table, floors (three pace-shifted sets, V4), hosts and site keys; read by both modules below |
| `tools/content/modules/events_eindil.mjs` | new module (this spec) | Writes `events/zin_eindil.txt` (namespace `zin_eindil`, ids 1–169; mechanic-owned, so the pulse `.2` may use `mean_time_to_happen`) and `localisation/english/zin_eindil_l_english.yml` (UTF-8 with BOM; every text, people and region variants, two-face variants) |
| `tools/content/modules/mech_eindil_journey.mjs` | new module (journey spec) | The journey's scripted effects and triggers, ideas, traits, decisions, opinion modifiers, characters and on_actions, as listed in the journey spec. This spec adds the opinion modifiers `zin_eindil_feast_at_the_ford` (+10), `zin_eindil_seize_failed` (−50), `zin_eindil_heeded_the_impostor` (−25), `zin_eindil_denounced_the_impostor` (+25) and the advisor token `zin_eindil_guest_of_lorien` to its files. Every event writes `timeout_days = 30`; checkpoint events (`.32`, `.50`, `.82`, `.88`, and the hub's `zin_afrit.31`, `.33`) carry the data field `checkpoint` and their non-committal option first (E2, C9) |

Two-face text uses the lore digest's scripted localisation `[zin_loc_eindil]` and `[zin_loc_deliverer]` and the triggers `zin_afrit_secret_kept`, `zin_eindil_known_by_name`, `zin_afrit_is_hub` (C3).

Dates are 4A engine dates (month 1 Deepwinter … 12 Longnight). They need the calendar of [01_start_and_calendar.md](../00_foundation/01_start_and_calendar.md), which is Ready but not yet in the game (the game still starts on 1936.1.1); this module is built in phase 5, after the calendar.

### Ids added by this spec (`zin_eindil`)

| Id | Title | Stage |
| --- | --- | ---: |
| 150 | Old Siula's Tale | 1 |
| 151 | The Man from the Ice Learns Our Words | 1 |
| 152 | Traders Bring a Stranger | 1 |
| 153 | The Bread Counted | 2 |
| 154 | The Refugees Settle | 2 |
| 155 | The Lawspeaker's Ruling | 2 |
| 156 | The Confederation Gathers | 3 |
| 157 | A Feast at the Ford | 3 |
| 158 | The Islanders' Feast | 4 |
| 159 | A Pilot for the South-West | 4 |
| 160 | What Lorien Will Not Say | 5 |
| 161 | Lorien's Warning | 5 |
| 162 | Ice in the Rigging | 6 |
| 163 | Word From the North | 7 |
| 164 | Alleria's Questions | 8 |
| 165 | Master Ilsabet's Rolls | 8 |
| 166 | An Empty Cell | 8 |
| 167 | Frontier Companies Listen | 8 |
| 168 | The Wizard and the Bearer | 8 |
| 169 | The Dragon Chooses | 8 |
| 170–199 | Reserved for phase 8 journey flavour | — |

### Firing

Every journey event is fired by `zin_eindil_advance_stage`, by its parent event (`country_event` or `news_event` with `days`), or by the journey pulse `zin_eindil.2` when a stage condition becomes true. A parent schedules each child once; options that change a child's timing choose the `days` of that single call (`.150`, `.158`, `.160`), so no scheduled event is ever moved. Delays from options are added through `zin_eindil_add_delay` and move only later floors.

### Flags and variables touched

Shared (contract, contract additions or owner specs): `zin_eindil_awake`, `zin_eindil_war_king`, `zin_eindil_named`, `zin_eindil_stage`, `zin_eindil_renown`, `zin_eindil_regard`, `zin_eindil_delay`, `zin_eindil_host`, `zin_eindil_heeded`, `zin_eindil_sworn`, `zin_eindil_dragon_pact`, `zin_eindil_returned`, `zin_glo_with_eindil`, `zin_horos_dead`, `zin_aurevan_went_north`, `zin_afrit_at_yeldenne`, `zin_aenor_eindil_denounced`, `zin_afrit_impostor_denounced`, `zin_reign_scholars_free`, `zin_west_grey_ford_war`, `zin_west_remembers_war_king`, `zin_cold_neck_road`, `zin_mirror_stilled`, `zin_gala_great_ship`, `zin_gala_gift_armour`, `zin_gala_crew_chosen`, `zin_magical_forest_wizard_found`, `zin_worshipdom_ships_ready`, `zin_worshipdom_hunters`, `zin_afrit_seat_whispers`, `zin_yeldenne_beacon`, `zin_yeldenne_coast_watch`, `zin_yeldenne_guides`. Internal: `zin_eindil_ports_betrayed`, `zin_eindil_hunted`, `zin_eindil_elven_crew`, `zin_eindil_landing_guides`, `zin_eindil_ambush_strength` (temporary), `zin_eindil_episode_<n>_done`. Journey names used here: `zin_eindil_crown_shelters` (country flag on the sheltering Aenor realm), `zin_eindil_hunt_active`, `zin_eindil_reef_island`, `zin_eindil_safe_harbour`; Cold Lands: `zin_cold_far_ice_charted`, `zin_cold_send_wardens`, `zin_cold_reward_ice_host`.

### Character changes

| Event | Change |
| --- | --- |
| `.10` | `zin_eindil` enters play under the name "The Man from the Ice"; portrait E1 wanderer |
| `.32` | Portrait E2 war-king |
| `.52` | `set_character_name` to Eindil; portrait E3 named |
| `.73` (or `zin_glo.80`) | Portrait E4 bearer |
| `.165` A | `zin_ilsabet` moves to the host as theorist |
| `.87` | `zin_varner`, `zin_golbran` recruited by the Magical Forest as advisors |

### Pictures

| Events | Key |
| --- | --- |
| `.10`, `.11`, `.150`, `.151` | `man_in_ice` (gate `zin_eindil_awake`) |
| `.12`, `.152`, `.20` | `traders_road_south` (gate `zin_eindil_awake`) |
| `.21`, `.153`, `.154` | `grey_ford_truce` |
| `.22`, `.155` | `generic_court` |
| `.23`, `.30`–`.34`, `.156`, `.157` | `war_king` (gate `zin_eindil_awake`) |
| `.35` (news) | `GFX_zin_news_generic_peace` until `war_king` has a news crop (requested below) |
| `.40`, `.60`, `.61`, `.162`, `.80` | `generic_sea` |
| `.41`–`.46`, `.158`, `.159` | `storm_wreck` (gate `zin_eindil_war_king`) |
| `.50`, `.51`, `.54`, `.160`, `.161`, `.163` | `gala_court` |
| `.52` | `gala_court`; requested `mirror_courtyard` (a spring in an old elven courtyard at dusk, no figures; ungated) |
| `.70`–`.72` | `cold_shore` (gate `zin_eindil_named`) |
| `.73` | `glo_given` (gate `zin_horos_dead`) |
| `.81`–`.83`, `.85`, `.164`–`.166` | `generic_court` |
| `.84`, `.86`, `.87`, `.168` | `generic_wilds` |
| `.167` | `lost_cause_triumph` |
| `.88`, `.169` | `generic_wilds`; requested `dragon_roosts` (dragons on high mountain ledges, no riders; ungated) |
| `.90`–`.140` | listed in [03](03_war_of_the_last_crowns.md) |

A gated key is used only by events that cannot fire before its flag; a flag set by the firing effect before the event is called counts as set (E5).

**Requested pictures** (C10; generated through the icon catalog pipeline, image-generated only):

| Key | Shows | Gate | Used by (now using) |
| --- | --- | --- | --- |
| `mirror_courtyard` | A spring in an old elven courtyard at dusk, no figures | — | `.52` (`gala_court`) |
| `dragon_roosts` | Dragons on high mountain ledges, no riders | — | `.88`, `.169` (`generic_wilds`) |
| `war_king` news crop | The existing picture, news crop | `zin_eindil_awake` | `.35` (`GFX_zin_news_generic_peace`) |
| Eindil portraits E1–E7 | The journey spec's seven states | — | the character changes above (`GFX_zin_portrait_men_male_1`) |

### Engine names used

Effects: `country_event`, `news_event`, `set_global_flag`, `set_country_flag`, `set_variable`, `add_to_variable`, `random_list`, `log`, `set_character_name`, `recruit_character`, `retire_character`, `add_corps_commander_role`, `add_field_marshal_role`, `add_advisor_role`, `add_unit_leader_trait`, `add_timed_unit_leader_trait`, `set_portraits`, `add_ideas`, `add_timed_idea`, `add_stability`, `add_political_power`, `add_manpower`, `army_experience`, `add_tech_bonus`, `add_opinion_modifier`, `give_military_access`, `send_equipment`, `create_dynamic_country`. Triggers: `has_global_flag`, `has_country_flag`, `has_capitulated`, `has_character`, `has_country_leader`, `has_offensive_war`, `exists`. All exist in the 1.19.3 documentation.

## AI

- **Historical rule** (`zin_eindil_historical`): every "hist" option; one port of call reports the ship (the one with the highest footholds); nobody sends guides; Afrit's party waits; Selen shelters and swears; Aenor denounces; the Magical Forest shelters and grants the dragon. Under PLAUSIBLE the C8 weights apply.
- **Dynamic rule:** help 70, hinder 10, ×3 hinder with footholds ≥ 3, ×2 hinder for Dominion with stance `zin_dom_warlord`, ×0 hinder for Light with `zin_light_wardens` or `zin_light_sanctuary`, ×2 help for a friend (journey spec). New events use the weights in their tables.
- No AI option in this spec starts a war.

## Acceptance

Build tests run with `npm test` in `tools/`; run checks use the isolated Linux run.

1. **Ids and options (build).** Every `zin_eindil` event in the generated file has a unique id from the journey list or 150–169; no id 170–199 exists; every option has localisation and an `ai_chance`.
2. **Pictures (build).** Every event names a key in `presentation-cells.json`; news events use only news-crop keys; every gated key is used only by events whose data lists the gate flag among their requirements or whose firing effect sets it first.
3. **The name (build).** No localisation of an event that can fire before `zin_eindil_named` contains "Eindil" outside `[zin_loc_eindil]`; no event before `zin_eindil_awake` exists in the firing graph.
4. **The secret (build).** No localisation reachable by a non-Worshipdom country before `zin_afrit_revealed` contains "Afrit", "demon" or "Hidden Council"; the `.83` keys contain "not what the temples say" and never "brother".
5. **Retired names (build).** The generated files contain no name from the contract register's retired table (the name check, N16); every checkpoint event's first option is not its `hist` option.
6. **References (build).** Every event id fired from `zin_eindil` exists in its owner's generated events, every scripted effect and trigger called exists in a generated file, and every engine effect and trigger named above appears in the 1.19.3 documentation.
7. **Start year (Linux run, one year from 1 Thaw 1748, observer, HISTORICAL).** No `zin_eindil` event fires and no country employs `zin_eindil` before `zin_eindil_awake`; `zin_eindil_awake` is set between 1 and 21 Ironfrost 1749; `.10` reaches the owner of `zin_is_site_eindil_ice` and `.150` follows 30 days later; the character's name reads "The Man from the Ice".
8. **Naming (Linux scenario: stage 5 entered by console).** `zin_eindil_named` is set, the character is renamed Eindil, and exactly one `zin_afrit.31` reaches the Worshipdom within the Afrit spec's delay.
9. **Ambush (Linux scenario: stage 7, historical, Gala equipped, one port betrayed, Yeldenne coast watch).** The log line shows strength ≥ 4, `.72` fires, and `zin_glo_with_eindil` is set after the hall.
10. **Fallbacks (Linux scenario, negative).** With the default host of stage 1, 2, 4, 5 or 8 annexed by console before the stage, the stage's first event reaches the fallback and the stage advances.
11. **Hindrance (Linux scenario, each hinder option).** Delay rises by the table's amount and `zin_eindil_lost` is never set before stage 9.
12. **Path (the path spec's three-seed historical observer run, [06_historical_path_and_ai.md](../03_gameplay/06_historical_path_and_ai.md) acceptance 1).** Stages 1 to 8 start within 120 days of their floors; `zin_eindil_named` is set in 4A 1752 and `zin_glo_with_eindil` in 4A 1753.

## Open questions

These proceed on the labelled proposals; the owner's answers go to [OPEN_QUESTIONS.md](../OPEN_QUESTIONS.md), section "eindil and glo".

1. Can Eindil die in play (question 1)? Proposal: safe before stage 9; lost only in the late divergences.
2. Who formed the confederation that made him war-king (question 2)? Proposal: the Grey Ford Confederation, a third party built from regard.
3. Which states hold his ice, the bridge, the ford, the shrine and the landing, and are Howan and Enhis Is Rond the wreck and shrine islands (question 3)? Proposal: the key-site rows; the Yeldenne landing still needs its row ([02_key_sites.md](../01_map/02_key_sites.md)).
4. Where is he between 1754 and 1757 (question 4)? Proposal: Selen, then the Magical Forest.
5. Should the Yeldenne player see Horos say "Afrit, son of Ein" (question 6)? Proposal: no; only Afrit's country reads the name before the reveal.
6. Arm, Necklace, Horos's spirit, Glernaen (question 10). Proposal: never stated; Glernaen only "a New God of Power and Wisdom".
7. Should Lorien's gift take only what Gala has ("elves", question 18)? Proposal: yes, as `.54` says.

Settled by [INTEGRATION_DECISIONS.md](../INTEGRATION_DECISIONS.md) and applied above: one report of the naming (N8), the ambush formula (N9), the warning's wording (D3), the Host as Selen (S2).
