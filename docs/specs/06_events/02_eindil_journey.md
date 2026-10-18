# Eindil's Journey: Events

**Status:** Draft. **Priority:** 5. **Phase:** 5.

## Purpose

[eindil_journey.md](../04_mechanics/eindil_journey.md) defines the journey as a system: stages, floors, hosts, renown, regard, delay, the Host of Eindil, and an id list for namespace `zin_eindil`. It leaves the event text to this folder. This spec:

- writes every journey event as an event chain, stage by stage, with the host that receives it, what fires it, its text, its options and their effects, the flags and variables it touches, and its historical timing;
- gives each stage's **host variants**: the default host, the fallback host, and text variants by host people or region;
- adds the events the system needs but did not list, in `zin_eindil` ids 150–199;
- reconciles the places where the journey, Afrit, Yeldenne and Glo specs each claim the same moment, by naming one owner and one order.

Stages 0 to 8 are fully specified here. For stages 9 to 12 this spec covers the Host country's own beats (raising the Host, the coalition, Eindil's wounds and recovery, the palace decisions). The battles of stage 9, the cliff, the palace battle and the coronation are specified as the war's chain in [03_war_of_the_last_crowns.md](03_war_of_the_last_crowns.md); the Lost Cause ending in [04_endings.md](04_endings.md).

The conventions C1 to C12 of [01_golden_king_and_succession.md](01_golden_king_and_succession.md) apply.

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
| Dates 4A 1749 to 1754 for stages 1 to 8 | proposed | *Fourth Age Chronology* |
| Every host assignment, event, title, text, option and number below | **proposed** | journey spec and this spec |

**Kept open:** the birth order of Ein's sons and why Ein refused Afrit; how, where and why Eindil was put to sleep and why he lost his memory; which western rulers made him war-king and where his western kingship lay; the exact places of his ice, the shrine and the landing; the location of the Castle of Yeldenne; Glernaen's symbols and cult; what Glo leaves him after the war. Text never answers these.

## Design

### The chain at a glance (historical path)

| Stage | When (proposed) | Default host | Events |
| ---: | --- | --- | --- |
| 1 | Ironfrost – Emberleaf 1749 | the owner of `zin_is_site_eindil_ice` | `zin_eindil.10`, `.150`, `.151`, `.11`, `.12`, `.152` |
| 2 | Emberleaf 1749 – Thaw 1750 | the three episode site owners; Gunwaith | `.20`, `.153`, `.21`, `.154`, `.22`, `.155`, `.23` |
| 3 | Rainwake – Fallowing 1750 | the Grey Ford Confederation's leader | `.30` or `.31`, `.32`, `.156`, `.33`, `.157`, `.34`, `.35` |
| 4 | Thaw 1751 – Deepwinter 1752 | departure host; Howan; Nara or Verde; Enhis Is Rond | `.40`, `.41`, `.158`, `.42`, `.43`, `.44`, `.159`, `.45`; divergence `.46` |
| 5 | Deepwinter – Goldfield 1752 | the Gala Elves | `.50`, `.51`, `.160`, `.52`, `.54`, `.161` |
| 6 | Deepwinter – Sowing 1753 | at sea; three ports of call | `.60`, `.61` ×3, `.162` |
| 7 | Sowing – Goldfield 1753 | the owner of `zin_is_site_yeldenne_landing`; Yeldenne | `.70`, `.71`, `.72`, hall (`zin_glo.20`–`.25`), `.73`, `.163` |
| 8 | Deepwinter 1754 – Thaw 1757 | Selen, then the Magical Forest | `.80`–`.88`, `.164`–`.169` |
| 9–12 | 1757 – 1760 | the Host of Eindil; Aenor | `.90`–`.140`; battle chains in [03](03_war_of_the_last_crowns.md) |

### One owner per moment (reconciliation)

Several specs describe the same moment. This spec names one owner and one order. Each line is a **dependency** on the specs named; until they agree, the order below is the one implemented.

| Moment | Specs involved | Owner and order (proposed) |
| --- | --- | --- |
| Afrit hears that a castaway speaks of Aen (stage 4 divergence) | journey `.41` option B, Glo `zin_glo.5` | `zin_glo.5` (Glo spec) is the only event; the journey's option fires it |
| Afrit hears that Lorien named the stranger | Afrit `zin_afrit.31` (delay 30 or 120 days by footholds), Glo `zin_glo.10` (30 days), journey `.52` | **`zin_afrit.31`** owns the report and its delay. Its options become the union of both specs: *Go north and lie in wait* (hist; sets `zin_aurevan_went_north` via the voyage), *Go north and take Glo at once*, *Send others*, *Stay in Parim*. `zin_glo.10` is retired; `zin_glo.11` *The Approach to Yeldenne* stays as the arrival event |
| The voyage north and Merovan holding the seals | Afrit `zin_afrit.32`, Aenor, Glo | `zin_afrit.32` sets `zin_aurevan_went_north` and fires `zin_reign.81` to Aenor ([01](01_golden_king_and_succession.md)) |
| The ambush | Afrit `zin_afrit.33` (strength formula A), journey `.71` (strength formula B) | `zin_afrit.33` is the hub's choice (*Spare none* / *Let them land*); **`zin_eindil.71`** resolves the ambush with the **journey's** formula (base 5), adding the Afrit spec's terms (`zin_worshipdom_ships_ready`, `zin_worshipdom_hunters`, Whispers ≥ 4) as +1 each. Historical result stays ≥ 4 |
| The hall | Glo `zin_glo.20`–`.25`, Afrit `zin_afrit_wound` | Glo spec owns; this spec only reads the result in `.73` |
| The Afrit system's effects named by the journey | journey names `zin_afrit_slay`, `zin_afrit_lose_artifacts`, `zin_afrit_returns_west` | Use the Afrit spec's names: `zin_afrit_die`, `zin_afrit_lose_artifact` (per artifact), and `zin_afrit_returned` (the journey reads it; `zin_afrit_returns_west` is dropped or set as an alias in `zin_afrit_return`) |

### Host variants

Each stage's first event goes to the default host. If that country does not exist, is capitulated, or is at war with the stranger's previous host, the fallback takes its place and the event text uses the fallback's name through `[ROOT.GetName]`. Text variants by people use the peoples spec's triggers (`zin_people_is_<key>`).

| Stage | Default host | Fallback | Text variants |
| ---: | --- | --- | --- |
| 1 | Owner of `zin_is_site_eindil_ice` (a north-western Cold Lands realm; map step) | the Cold Lands country nearest the site that is not Coldor or Isengard | `men`: "the clan's hunters"; `yeti`: "the yeti of the white valleys"; `giants`: "the ice giants' herders" |
| 2 | Owners of `zin_is_site_three_oaths`, `zin_is_site_winter_ford`; Gunwaith | site owner; for the trial, the owner of Gunwaith's former capital | Western realm names; Girdon's text speaks of "wardens", Gunwaith's of "clans and lawspeakers" |
| 3 | Leader of the Grey Ford Confederation (journey rule) | next candidate by regard | Leader name; the feud named "the Grey Ford" in both cases |
| 4 | Departure host; wreck host (proposed Howan); reef (Nara or Verde); shrine (owner of `zin_is_site_south_shrine`, proposed Enhis Is Rond) | the Islands of the South country with the most coast; for the shrine, any island realm | Island names only |
| 5 | Gala Elves | the country that recruited `zin_lorien`; then Gala's capital owner (Lorien re-recruited as advisor) | Exile variant: "Lorien's court in exile at [host]" |
| 6 | At sea; ports of call (Islands of the South, Triton's Islands or West Lands coast, Cold Lands west coast) | — | Port names |
| 7 | Owner of `zin_is_site_yeldenne_landing`; owner of Mp'E | — | "The Castle of Yeldenne" always; "the hall" if Mp'E has another owner (the Glo spec's *The Hall Remains*) |
| 8 | Selen (Alleria) | the Middle Lands country with the highest regard that is not Aenor; then the Magical Forest | Selen: "the rangers of Selen"; others: "[ROOT.GetAdjective] scouts" |

### Stage 1: The Man in the Ice (4A 1749)

Floor: 1 Ironfrost 1749 + 0–20 days (`zin_rule_eindil_waking`: EARLY Highsun 1748, LATE 4A 1751). Sets `zin_eindil_awake`, stage 1. Picture `man_in_ice` (gate `zin_eindil_awake`).

| Id | Title | To | Fired by | Hist. | Text gist | Options (effects; AI) |
| --- | --- | --- | --- | --- | --- | --- |
| `.10` | The Man in the Ice | ice host | `zin_eindil_advance_stage` (stage 1) | Ironfrost 1749 | "Hunters cutting a path across the old ice found a man inside it. When they broke him out, he breathed. He does not know his name, or ours." | **"Nurse the stranger."** recruit `zin_eindil` as corps commander (`zin_eindil_set_host`); spirit `zin_eindil_stranger_among_us`; regard +20; renown +5 (AI help). **"Leave him to the elders."** recruited; regard +5. **"Bind him to our service."** recruited; he stays 365 days; `zin_eindil_restless_guest`; delay +120; regard −30 (AI hinder) |
| `.150` | Old Siula's Tale | ice host | 30 days after `.10` | Thaw 1749 | "Old Siula, who found him, tells it at every fire: the ice was older than her grandmother's grandmother, and the man in it was warm." (Siula is an event-only figure, proposed.) | **"Let the tale travel."** renown +5; Coldor and Isengard's `.11` fires 15 days sooner (AI 60). **"Keep it among the clans."** stability +0.02 (AI 40) |
| `.151` | The Stranger Learns Our Words | ice host | 60 days after `.10` | Rainwake 1749 | "In two months he speaks our tongue as if he had always known it. He hunts better than our best. He shares the meat." | **"He is one of us now."** regard +5; army experience +5 (AI 70). **"He is a guest, not a son."** nothing (AI 30) |
| `.11` | Talk of a Man from the Ice | Coldor, Isengard | 60 days after `.10` (45 with `.150` A) | Sowing 1749 | "Hunters from the north-west tell of a man cut alive from old ice, stronger than three. The court laughs, or listens." | **"Ignore northern tales."** nothing (AI hist 100). **"Summon him to court."** 50%: he comes; host becomes the summoner for 90 days; delay +30; regard +10 with the summoner. 50%: he declines politely; nothing (AI dynamic 20) |
| `.12` | The Traders' Road South | ice host | stage 1 + 150 days | Emberleaf 1749 | "Western traders are going south before the snows. The stranger asks to go with them. He wants to know who he is, and the south is where the old stories come from." | **"Give him furs and provisions."** delay −30; regard +10; renown +5 (AI help). **"Let him go as he came."** nothing |
| `.152` | Traders Bring a Stranger | the West Lands country owning the first episode site; Coldor too if `zin_cold_neck_road` | with `.12` | Emberleaf 1749 | "A trading caravan comes over the Neck Road with a tall man from the north who works for his bread and asks questions about Aen." | **"Let him pass."** nothing. Information only; tells players where he goes |

**Divergences.** Binding him delays every later stage by 120 days and makes the ice host resented (no coalition invitation). Coldor or Isengard summoning him adds 30 days and a friend. None can kill him (journey rule).

### Stage 2: The Road South (4A 1749–1750)

Three episodes 45 days apart. Each host recruits him for the episode and releases him after it. Pictures `traders_road_south` (`.20`), `grey_ford_truce` (`.21`), `generic_court` (`.22`), `war_king` (`.23`).

| Id | Title | To | Fired by | Hist. | Text gist | Options (effects; AI) |
| --- | --- | --- | --- | --- | --- | --- |
| `.20` | The Bridge of the Three Oaths | owner of `zin_is_site_three_oaths` | stage 2 | Emberleaf 1749 | "Two lordships meet on the old bridge with torches, each to burn the other's granary after a bad harvest. The stranger from the north stands in the middle of the bridge and asks them to count the bread first." | **"Accept his mediation."** stability +0.03; regard +20; renown +5; country flag `zin_eindil_episode_20_done` (AI help). **"Burn the grain anyway."** timed `zin_eindil_burned_granaries` (180 days); regard −20; renown +5 (he saves what he can) |
| `.153` | The Bread Counted | the other lordship's owner, if different from the host | with `.20` A | Emberleaf 1749 | "Our lord kept his granary. The tale of the bridge is told in both halls." | **"Remember the stranger."** regard +10 |
| `.21` | Girdon's Winter Ford | Girdon (or the site owner) | `.20` + 45 days | Longnight 1749 | "The ford is breaking up under ice and a column of refugees is still on it. The stranger stands in the freezing water and holds the last cart until the children are across." | **"Hold the ford open for them."** manpower +2,000; regard +20; renown +5 (AI help). **"Close the ford."** delay +60; regard −25 |
| `.154` | The Refugees Settle | Girdon or site owner | 30 days after `.21` A | Deepwinter 1750 | "The refugees from the ford have built a village on our side. They have named its well after the stranger." | **"Let the name stand."** stability +0.02 |
| `.22` | Judgment in Gunwaith | Gunwaith (or the owner of its former capital) | `.20` + 90 days | Ironfrost 1750 | "The stranger beat three champions hired by a Gunwaith thane to settle a quarrel. Now the thane demands he be tried. The stranger agrees, and asks only that the law be the same for him as for anyone." | **"Try him fairly."** timed `zin_eindil_judgment_honoured` (365 days); regard +20; renown +10 (AI help). **"Make an example of him."** held 180 days, then released; delay +180; regard −40; renown +5. **"Pardon him."** he refuses exemption; same result as A with different text |
| `.155` | The Lawspeaker's Ruling | Gunwaith | 7 days after `.22` A or C | Ironfrost 1750 | "Lawspeaker Ilurda rules: the stranger owes the thane a season's labour and nothing more. He pays it in a month, rebuilding the bridge the champions broke." | **"The law holds."** stability +0.02; `zin_gunwaith_ilurda` flavour |
| `.23` | The King Without a House | every West Lands country if renown ≥ 20; else the hosts only | end of stage 2 | Thaw 1750 | "From the Bridge of the Three Oaths to the courts of Gunwaith, people speak of a man from the ice who makes peace and asks for nothing. Some call him the King Without a House." | **"A good man, wherever he is from."** nothing. Gunwaith and Girdon: regard +5 |

### Stage 3: The War-King (4A 1750)

When the Truce of the Grey Ford breaks (`zin_west_truce_broken`, the Grey Ford Feud `zin_west_grey_ford_war`), the confederation asks the stranger to lead. If no western war has begun by 1 Fallowing 1750, the fallback feud fires instead. Picture `war_king`.

| Id | Title | To | Fired by | Hist. | Text gist | Options (effects; AI) |
| --- | --- | --- | --- | --- | --- | --- |
| `.30` | The Grey Ford Breaks | confederation leader | `zin_west_grey_ford_war` during stage 3 | Rainwake 1750 | "Gunwaith and Girdon fight at the Grey Ford again. The crowns between them cannot stop it alone. Someone says: ask the stranger." | **"Ask him."** fires `.32` |
| `.31` | Feud on the Grey Ford | confederation leader | stage 3 fallback, 1 Fallowing 1750 | — | "A border feud at the Grey Ford threatens the truce. The crowns between ask the stranger to stand between the two." No war starts | **"Ask him."** fires `.32` |
| `.32` | A Crown Offered | confederation leader | after `.30` or `.31` | Highsun 1750 | "The confederation offers the stranger a war-king's crown for as long as it takes to make the peace." | **"Name him war-king."** field marshal role and `zin_eindil_war_king` trait; members get `zin_eindil_war_kings_banner`; military access among members; West: unity +5 (AI help). **"Refuse the stranger."** offer passes to the next candidate; if none accepts in 90 days the stage ends without a war-king (`zin_eindil_war_king` still set under the historical rule) |
| `.156` | The Confederation Gathers | each confederation member except the leader | with `.32` A | Highsun 1750 | "Our banners will march under the stranger's for one season. Our captains want to know if he can lead." | **"Send our captains."** army experience +5; regard +5 (AI 70). **"Watch from our own shore."** leaves the confederation; regard −5 (AI 30) |
| `.33` | The War-King's Terms | each western belligerent | `.32` + 60 days | Goldfield 1750 | "The war-king's host stands between the armies at the Grey Ford. He offers terms: the old border, the dead buried, the prisoners home. He asks both sides to sign." | **"Accept his peace."** `zin_west_end_ford_war` (not `white_peace`); `zin_eindil_war_kings_peace` (730 days); regard +15 (AI help). **"Fight on."** stays at war; confederation may use *Enforce the War-King's Peace*; regard −20; West unity −10 |
| `.157` | A Feast at the Ford | both belligerents (if both accepted) | 14 days after `.33` | Goldfield 1750 | "Gunwaith's thanes and Girdon's wardens eat at one table at the ford for the first time in fifty years. The war-king sits at the foot, not the head." | **"To the stranger."** opinion +10 between the two; stability +0.02 |
| `.34` | The Crown Laid Down | confederation leader | peace holds | Harvest 1750 | "The war-king sets the crown on the table and asks for a horse and a road to the sea. He wants to cross to the old kingdom of Aen." | **"Release him with honour."** sets `zin_eindil_war_king`; regard +20; renown +15; `zin_west_remembers_war_king` (AI help). **"Try to keep the war-king."** he leaves by night; sets `zin_eindil_war_king`; regard −50 with the leader; the confederation dissolves; West unity −15; renown +10 (AI never) |
| `.35` | The War-King Lays Down His Crown | news: West Lands, Concord dominions, Aenor | after `.34` | Harvest 1750 | "In the West a stranger made a peace no king could make, then gave the crown back. Nobody knows his name." | One option |

Note: the Golden King dies in Mistfall 1750, two months later. Neither event refers to the other.

### Stage 4: The Storm and the Islands of the South (4A 1751)

He sails for Aenor from the leader's coast. At sea he is not recruited (`zin_eindil_clear_host`). Pictures `generic_sea` (`.40`), `storm_wreck` (`.41`–`.45`, gate `zin_eindil_war_king`).

| Id | Title | To | Fired by | Hist. | Text gist | Options (effects; AI) |
| --- | --- | --- | --- | --- | --- | --- |
| `.40` | West Over the Sea | departure host | stage 4 | Thaw 1751 | "The stranger asks for passage across the wide sea to Aenor. He has heard that the oldest rolls of Aen's line are kept in Parim." | **"Give him a ship."** regard +10 (AI help). **"Let him find passage."** delay +30 |
| `.41` | Wreck on the Southern Isles | wreck host (proposed Howan) | `.40` + 30 days | Rainwake 1751 | "Storms took a western ship far off its course. It broke on our reef. One passenger walked out of the surf carrying two sailors." | **"Shelter the castaways."** recruit as corps commander; regard +20 (AI help). **"Sell news of him to the Deliverer's priests."** fires `zin_glo.5` to Afrit's country; delay +60; regard −40; +50 PP (AI hinder; ×3 with footholds ≥ 3) |
| `.158` | The Islanders' Feast | wreck host | 30 days after `.41` A | Sowing 1751 | "The island holds a feast for the drowned and the saved. The stranger sits with the fishermen and listens to their oldest stories." | **"Tell him the story of the reef."** fires `.42` 30 days sooner (AI 60). **"Tell him the story of the shrine."** fires `.43` 30 days sooner (AI 40) |
| `.42` | The Reef of Drowned Voices | wreck host, or Nara or Verde | `.41` + 60 days | Highsun 1751 | "Children were stranded on the reef where drowned voices call at night. No boat would go. The stranger swam out and brought them back. The islanders say the sea went silent." | **"The sea went silent."** spirit `zin_eindil_the_sea_went_silent` (365 days); renown +5 |
| `.43` | The Shrine Beneath the Tide | owner of `zin_is_site_south_shrine` | `.41` + 120 days | Harvest 1751 | "At low tide the old shrine shows an inscription the priests have chanted for generations without knowing its meaning. The stranger reads one word aloud: Aen." The text does not identify him. | **"What else does it say?"** renown +5; regard +5 |
| `.44` | Stay and Rule Us | the island with the highest regard | `.41` + 180 days | Mistfall 1751 | "The island elders ask the stranger to stay and be their lord. He thanks them and says no." | **"Honour his choice."** regard +10 (AI help). **"Hold him to the offer."** delay +60; regard −20 |
| `.159` | A Pilot for the South-West | the island with the highest regard | 30 days after `.44` A | Longnight 1751 | "An old pilot offers to take him south-west, to where the tallest elves live, 'when the tales of men grow too old for any man to explain'." | **"Lend him the pilot."** delay −20; regard +5 (AI 80). **"Our pilots stay home."** nothing |
| `.45` | Carry the Old Tales to Gala | wreck host (or the island with the highest regard) | end of stage 4 | Deepwinter 1752 | "When the tales of men grow too old for any man to explain, carry them to Gala. The islanders give him a boat and the tale of Aen's name in the shrine." | **"Fair winds."** stage 4 ends |
| `.46` | Hunters in the Isles | wreck host | 90 days after `zin_glo.5` option *Send hunters* | divergence | "Armed men from a foreign ship came looking for the castaway. He drove them off. The island buried their dead." | **"Mourn the dead."** −1,000 manpower; delay +60; renown +5; sets `zin_eindil_hunted` (ambush +1) |

### Stage 5: Gala (4A 1752)

Host: the Gala Elves (established). Pictures `gala_court`; `.52` the proposed `mirror_courtyard` (fallback `gala_court`). The naming is not public news.

| Id | Title | To | Fired by | Hist. | Text gist | Options (effects; AI) |
| --- | --- | --- | --- | --- | --- | --- |
| `.50` | A Stranger at Gala | Gala Elves | stage 5 | Deepwinter 1752 | "A tall man from the Islands of the South asks to speak with the King. He carries a tale too old for men to explain, and a word from a drowned shrine." | **"Receive him."** recruit as advisor "Guest of Lorien"; regard +25 (AI help). **"Turn him away for a season."** Lorien relents after 180 days; delay +180; regard −10. Gala cannot refuse him for good |
| `.51` | Weeks of Memory | Gala Elves | `.50` + 60 days | Rainwake 1752 | "For weeks Lorien tells him of the War of Men, of Aen, of Dardan and of what came after. The stranger learns how small his memory is against the age of the world." | **"Memory is a duty."** renown +5 |
| `.160` | What Lorien Will Not Say | Gala Elves | 30 days after `.51` | Sowing 1752 | "Lorien sees signs of the First Men in him, but will not name a man on strength alone." | **"Then we will ask the water."** clarity check: if `zin_mirror_stilled`, `.52` waits 60 days and uses the records variant (Lands of the Sun spec) |
| `.52` | The Mirror of First Rain | Gala Elves | `.51` + 30 days | Highsun 1752 | "In the old courtyard Lorien looks into the spring and sees the old royal line. 'Eindil, son of Ein, son of Aen.' The stranger sees a burning capital, armies from the west and the east, death moving from the north, a great darkness in the south, and his own hand holding a shard of broken blue metal." | **"Eindil."** sets `zin_eindil_named`; `set_character_name` Eindil; trait `zin_eindil_heir_of_aen`; `zin_sun_spend_clarity` 30; portrait E3; fires `zin_afrit.31` after the Afrit spec's delay; Gala tree event `zin_gala.11` may follow |
| `.54` | Lorien's Gift | Gala Elves | `.52` + 30 days | Goldfield 1752 | "Lorien gives Eindil a ship like no other, armour, a sword, and a crew: western friends, island navigators and Gala elves. He tells him to go north to Horos, who keeps Glo." | **"Equip him generously."** Gala pays what it has, up to 1,000 manpower and 500 infantry equipment, never below 0 (Lands of the Sun dependency); `zin_eindil_elven_crew` (ambush −1); regard +15 (AI help). **"A ship and a sword, no more."** no cost; regard +5 |
| `.161` | Lorien's Warning | Gala Elves | 7 days after `.54` | Goldfield 1752 | "Before the ship sails, Lorien warns him: a prophecy can frighten people into the very deeds it foretells. The water showed what may be, not what must be." | **"Fair winds, son of Ein."** stability +0.02 |

**Divergence.** If Gala turns him away, the naming waits 180 days; the Afrit report comes later; every later floor moves.

### Stage 6: The Voyage North (4A 1753)

He sails north for 150 days (120 with `zin_gala_great_ship`). `zin_eindil_host` is cleared; the anchor country is the Gala Elves. Picture `generic_sea`.

| Id | Title | To | Fired by | Hist. | Text gist | Options (effects; AI) |
| --- | --- | --- | --- | --- | --- | --- |
| `.60` | Lorien's Ship Sails North | Gala Elves | stage 6 | Deepwinter 1753 | "The King's ship leaves Gala with the son of Ein aboard. Lorien watches it from the harbour wall until it is gone." | One option |
| `.61` | A Ship at Our Harbour | one coastal country per call: the Islands of the South, then Triton's Islands or the West Lands coast, then the Cold Lands west coast | stage 6, every 40 days, three times | Ironfrost – Rainwake 1753 | "An elven ship with a mixed crew asks for water and timber. Its captain is a tall man who pays in Gala silver." | **"Resupply the ship."** delay −10; regard +10; renown +2 (AI hist: two of three). **"Say nothing."** nothing. **"Report the ship to the Deliverer's priests."** +50 PP; `zin_eindil_ports_betrayed` +1 (ambush +1); regard −30 applied in stage 8 (AI hist: one of three, chosen as the port with the highest `zin_footholds`) |
| `.162` | Ice in the Rigging | Gala Elves (witness) | 120 days after `.60` | Sowing 1753 | "Word comes back by a whaler: the elven ship was seen beyond the last port, iced to the masts, sailing north." | One option |

Meanwhile on Afrit's side: `zin_afrit.31` → decision `zin_afrit_northern_voyage` → `zin_afrit.32` (Merovan holds the seals; `zin_aurevan_went_north`; `zin_reign.81` to Aenor) → `zin_glo.11` (arrival at the approach). Under the historical rule Afrit's party arrives before the landfall.

### Stage 7: The Ambush and Yeldenne (4A 1753)

Pictures `cold_shore` (`.70`–`.72`, gate `zin_eindil_named`); the hall uses the Glo spec's `yeldenne_hall` and `glo_given`.

| Id | Title | To | Fired by | Hist. | Text gist | Options (effects; AI) |
| --- | --- | --- | --- | --- | --- | --- |
| `.70` | Landfall in the Frozen North | owner of `zin_is_site_yeldenne_landing` | stage 7 | Sowing 1753 | "An elven ship has anchored in our bay. Its crew are going inland, toward the silent castle." | **"Stay out of strangers' quarrels."** nothing (AI hist). **"Send guides inland."** ambush −1; regard +15 |
| `zin_afrit.33` | The Ambush on the Shore | Afrit's country (private) | landfall while the party waits | Sowing 1753 | "The ship is in the bay. Your men are in the snow above the path." | **Spare none** (hist) / **Let them land** |
| `.71` | The Ambush | landing owner and Yeldenne (news-lite); Afrit's country (private variant) | `.70` + 7 days, if the hub chose *Spare none* | Sowing 1753 | Public: "Armed men waited in the snow above the path from the bay. The travellers from the elven ship fought them." Afrit's variant names the order he gave. Strength = 5 + ports betrayed + hunted + Afrit terms − elven crew − guide flags | Resolves by strength: ≥ 4 *None Survive* (hist); 2–3 *A Few Survive*; ≤ 1 *The Ambush Fails* (journey spec table) |
| `.72` | Alone in the Snow | Yeldenne (news) | ambush outcome ≥ 4 | Sowing 1753 | "Herders of Mp'E found a field of dead men in the snow below the castle road. One set of footprints went on toward the castle." | One option. Eindil gets `zin_eindil_alone_in_the_snow` (180 days) |
| `zin_glo.20`–`.25` | Who Walks Here? and the hall outcomes | owner of Mp'E; variants | Glo spec | Goldfield 1753 | Glo spec. For every country but Afrit's, Horos says "Son of Ein. I know why your father denied you." | Glo spec |
| `.73` | The Bearer Leaves Yeldenne | Eindil's current host, or at sea the Gala Elves as witness | after the hall resolves with `zin_glo_with_eindil` | Goldfield 1753 | "The castle is empty. The guardian is dust. The man who walked out carries a green light at his breast and a blue sword, and he knows now that the king in Parim, worshipped as the Deliverer, is his own brother, a son of Ein." Two-face: after `zin_afrit_revealed` the name Afrit is used | **"South, to warn them."** trait `zin_eindil_bearer_of_glo`; renown +10; portrait E4 |
| `.163` | Word From the North | Gala Elves | 90 days after `.73` | Emberleaf 1753 | "Whalers say the stranger lives, and carries a light out of the north. Of the crew they say nothing." | **"Then the voyage was not in vain."** counsel +5 (fires the Gala tree's `zin_gala.12` instead if that focus is done) |

Hall case variants that change stage 7 (owned by the Glo spec): **B1** the heir already inside, Afrit driven off; **B2** the willing gift after 30 or 60 days; **C/D** Horos slain before the heir comes, Glo sealed: then `zin_glo.80` *The Seal Opens for the Heir* replaces `.73`'s text ("The hall is empty and sealed. The green light knows him.").

### Stage 8: The Warnings (4A 1754 to 1757)

Floor 1 Deepwinter 1754 + delay. Landfall in the Middle Lands, proposed on Selen's coast. Picture `generic_court` for courts; `lost_cause_triumph` for the Lost Cause; `dragon_mountain`-themed `generic_wilds` for the dragon events until a proposed `dragon_roosts` key exists.

| Id | Title | To | Fired by | Hist. | Text gist | Options (effects; AI) |
| --- | --- | --- | --- | --- | --- | --- |
| `.80` | A Stranger on Selen's Shore | stage 8 host (Selen) | stage 8 | Deepwinter 1754 | "A man with a green light at his breast came ashore at night. He asked for the rangers, not the governor." | One option; fires `.81` |
| `.81` | Alleria's Watch | Selen or substitute | `.80` + 7 days | Ironfrost 1754 | "Alleria of Selen has heard him out for three nights. She believes enough to hide him, and not enough to stop asking questions." | **"Shelter him in secret."** host; regard +25; corps commander; category `zin_eindil_guest` (AI help). **"Hand him to the court."** Aenor's government gets `.85`; regard −50; delay +60 (AI hinder) |
| `.164` | Alleria's Questions | Selen | 30 days after `.81` A | Thaw 1754 | "Alleria asks him for a proof only a son of Ein could give. He has none but the crystal, the sword and what the guardian told him." | **"The crystal is proof enough."** renown +5 (AI 60). **"Send to Parim's archives for the old rolls."** fires `.165` to the country employing `zin_ilsabet` (AI 40) |
| `.165` | Master Ilsabet's Rolls | the country employing `zin_ilsabet` (Aenor at start) | `.164` B, or 60 days after `.81` A with `zin_reign_scholars_free` | Rainwake 1754 | "Master Ilsabet Vothrim of the University of Parim has found, in the oldest rolls, a line that ends with no burial: a son of Ein." The text proves nothing about the other son. | **"Send the rolls to Selen."** `zin_ilsabet` leaves the country's advisors and is recruited by the host as theorist; renown +10; `zin_afrit_add_veil` −5 (AI: Light or Wild government 60; ruled by Aurevan 0, hist 0). **"Lock the rolls away."** nothing (AI hist). **"Burn them."** only while `zin_afrit_rules_here`; `zin_afrit_add_veil` +3; renown −5; `zin_world_add_gathering_dark` +1 (AI 30) |
| `.82` | The Impostor | Aenor's government | `.81` + 30 days | Thaw 1754 | "A foreign stranger in the dominions claims the blood of Aen and speaks against the King. The chancery asks what to do." Variant per ruler (Aurevan, a surviving Golden King, a regency) | **"Denounce and hunt the impostor."** −50 PP; hunt (`.84`); `zin_aenor_eindil_denounced`; `zin_afrit_impostor_denounced` via the Afrit spec (AI hist under Aurevan). **"Let him speak."** renown +15; every Concord dominion gets `.83` at once (player only under Aurevan). **"Seize him."** 60%: `.85`; 40%: fails, host exposed (opinion −50 both ways) |
| `.83` | Warnings of the Heir | every great power, every Middle Lands country, every country with regard ≥ 25; never Volgan, his subjects, Zol, the Worshipdom | `.81` + 60 days | Rainwake 1754 | The naming has been private until now; this is the first text that gives other courts his name: "A man who calls himself Eindil, son of Ein, warns every court: armies will come from west and east, the North will abandon its oaths, Volgan is rebuilding his hosts, and the dead are stirring in the north. He says the king in Parim is not what the temples say." Regional variants below | **"Heed the warning."** spirit `zin_eindil_warning_heeded`; `zin_eindil_heeded`; regard +15; opinion −25 with Aenor's crown; Afrit veil −8 via the journey's call (−4 with `zin_afrit_impostor_denounced`). **"Dismiss it."** nothing (AI hist for most). **"Denounce him."** opinion +25 with Aenor's crown; regard −20 |
| `.84` | The Hunt for the Impostor | host | every 90 days while hunted | 1754–1755 | "Parim's men are asking questions in our towns. Someone will talk." 15% (+10% with footholds ≥ 3) the shelter is found | Found: **"Hide him in the hills."** −50 PP. **"Send him to the elves."** stage moves on to the Magical Forest |
| `.85` | The Impostor in Chains | Aenor's government | handed over or seized | divergence | "The impostor is in the cells under the palace." He escapes after 60 days to the Magical Forest | **"Guard him well."** nothing; after 60 days `.166` |
| `.166` | An Empty Cell | Aenor's government | `.85` + 60 days | divergence | "The cell is empty. The guards swear they never slept." | **"Hang the guards."** stability +0.01; regard −10. **"Say nothing."** nothing |
| `.167` | Frontier Companies Listen | Aenor's government | 120 days after `.83`, if `zin_aenor_lost_cause` ≥ 30 | Highsun 1754 | "Captains of the Lost Cause's frontier companies have been seen at the stranger's fires." | **"Recall them to Parim."** Lost Cause −5; Aenor spec's `zin_aenor.160` fires early if Eindil is in the Middle Lands (AI hist). **"Let them listen."** Lost Cause +5; regard +5 |
| `.86` | The Bearer in the Forest | Magical Forest | `zin_war_of_last_crowns` or the hunt sends him | Rainwake 1755 | "The rangers of Selen bring a man with a green light into our woods. The houses must decide whether the woods shelter him." | **"Shelter the bearer."** host; regard +20 (AI help). **"Send him on."** host becomes Nolorim or the elven realm with the highest regard; delay +60 |
| `.87` | Varner and Golbran | Magical Forest | `.86` + 90 days (30 with `zin_magical_forest_wizard_found`) | Goldfield 1755 | "The wizard of the Unbinding walks out of the trees with a small purple companion. He has heard of a green light in the woods." | **"The wizard is welcome."** `zin_varner` and `zin_golbran` recruited as advisors; renown +5 |
| `.168` | The Wizard and the Bearer | Magical Forest | 30 days after `.87` | Harvest 1755 | "Varner looks at Glo for a long time and says only that it is lighter than it should be, and heavier." The text explains nothing of Glo's nature. | **"Let them talk."** research bonus 30% once in `zin_cat_wards` |
| `.88` | A Dragon's Pact | the Keeper of Dragon Mountain | `.87` + 60 days, repeats every 180 days | Mistfall 1755 – Goldfield 1757 | "The bearer asks the Keeper of the Roosts for a dragon, not as a servant, but as an ally who chooses to fly with him." | **"Entrust a dragon to the bearer."** `zin_eindil_dragon_pact`; pool reserved (magic spec); roost bond −5 (AI hist when the floor allows). **"The dragons are not ours to lend."** repeats in 180 days; on 1 Goldfield 1757 Varner persuades the elves and the pact is made |
| `.169` | The Dragon Chooses | the Keeper | 7 days after `.88` A | — | "A dragon from the high roosts lands in the clearing and bows its head to the man with the green light. Then it waits." | One option; the dragon is a free ally, not a subject |

**Regional variants of `.83`.** One text key per group, chosen by triggers:

| Recipient | Variant line |
| --- | --- |
| Concord dominions | "He asks the dominions to keep their companies ready, not to rebel." |
| Lerendor and North Lands crowns | "He says the dead will come through the islands and the straits." (Lerendor's own `zin_leren.45` is suppressed when `.83` fires) |
| West Lands crowns with regard ≥ 25 | "The war-king of the Grey Ford has a name now." |
| East Lands courts | "He says eastern banners will cross the rift sea." |
| Elven realms | "He asks nothing of the elves but that they guard their own woods." |
| Mirolon | "He says what Mirolon has said for twenty years." (AI hist: heed) |
| Coldor, Isengard | "The man from the ice is a man of Aen's line, he says." |

**Who heeds (historical).** Selen, Mirolon, Kingson, Hiloron, the Magical Forest and the Gala Elves heed; the other great powers dismiss; Aenor's crown denounces.

**Swearing to the heir.** The decision `zin_eindil_swear_to_heir` (host, regard ≥ 25, renown ≥ 40, after 1 Thaw 1755) sets `zin_eindil_sworn`; Selen swears on the historical path. Its text: "Selen swears to raise the heir's host when he returns."

### Stages 9 to 12: the Host's own beats

The battles, the cliff, the palace battle and the coronation are specified in [03_war_of_the_last_crowns.md](03_war_of_the_last_crowns.md). This table lists the journey events that belong to the Host country and their text gist; their full option tables are in 03.

| Id | Title | To | Hist. | Text gist |
| --- | --- | --- | --- | --- |
| `.90` | On Dragon's Wings | news, all | Thaw 1757 | "A man on a dragon came down on the field. Where he struck the earth, the dead fell and did not rise." Sets `zin_eindil_returned` |
| `.92` | Raise the Host of Eindil | the sworn country (Selen) | Thaw 1757 | "The heir has come back with a wizard and a dragon. Selen swore to raise his host." Raise the Host / Stand beside him, remain ourselves |
| `.93` | Ride with the Heir | qualifying human players | Thaw 1757 | "Will you ride with the heir?" Switch to the Host / Stay |
| `.94` | The Coalition of the Living | invitees | Thaw 1757 | "The heir asks every crown that fights the dead and the south to stand together. He asks no crown to kneel." |
| `.95` | Give the Lost Cause to the Heir | Lost Cause leader | Thaw 1757 | "The league the Golden King founded for his glory asks to serve the heir." |
| `.110`–`.113` | The Cliff; Below the Cliff; Word of the King's Death; The King Returns from the Dead | Host, Afrit's country, Alleria's employer | 1758 | See 03 |
| `.120`–`.127` | The Battle in the Palace chain; The Palace Holds | Host | 1759 | See 03 |
| `.130`–`.132` | The Coronation of Eindil; A King in Parim; The Crown Withheld | Host, Aenor, all | 1760 | See 03 and 04 |
| `.140` | The Heir Is Lost | news, all | divergence | See 04 |

### Divergences at a glance

| Choice | Who | Delay | Other consequence |
| --- | --- | ---: | --- |
| Bind him (`.10` C) | ice host | +120 | resented; no invitation |
| Summon him (`.11`) | Coldor or Isengard | +30 | the summoner becomes a friend |
| Burn the grain (`.20` B) | bridge host | — | resented; burned granaries |
| Close the ford (`.21` B) | Girdon | +60 | resented |
| Make an example (`.22` B) | Gunwaith | +180 | resented; Gunwaith less likely to pledge later |
| Refuse the crown / fight on (`.32`, `.33`) | confederation | — | lasting western war; unity falls |
| Keep the war-king (`.34` B) | leader | — | confederation dissolves |
| Let him find passage (`.40` B) | departure host | +30 | — |
| Sell news (`.41` B) | wreck host | +60 | `zin_glo.5`; possible hunters (+60, stronger ambush) |
| Hold him to the offer (`.44` B) | island | +60 | resented |
| Turn him away (`.50` B) | Gala | +180 | the naming and Afrit's report move later |
| Report the ship (`.61` C) | port | — | ambush +1 |
| Guides inland (`.70` B) | landing owner | — | ambush −1; crew may survive |
| Hand him over / seize him (`.81` B, `.82` C) | Selen, Aenor | +60 | resented; `.85`, `.166` |
| Refuse the dragon (`.88` B) | Keeper | up to Goldfield 1757 | later return |

Before stage 9 nothing kills him. Hindrance only delays him and costs the hinderer (journey rule).

## Implementation

### Files

| Path | Content |
| --- | --- |
| `docs/design/eindil_route.json` | Journey data (journey spec); this spec adds the text keys and the new event ids |
| `events/zin_eindil.txt` | Namespace `zin_eindil`, generated; owned by the journey mechanic (MTTH allowed); new ids 150–199 here |
| `localisation/english/zin_eindil_l_english.yml` | Every text, including the people and region variants and the two-face variants |

### Ids added by this spec (`zin_eindil`)

| Id | Title | Stage |
| --- | --- | ---: |
| 150 | Old Siula's Tale | 1 |
| 151 | The Stranger Learns Our Words | 1 |
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

Every journey event is fired by `zin_eindil_advance_stage`, by its parent event (`country_event` with `days`), or by the journey pulse `zin_eindil.2` when a stage condition becomes true. Delays from options are added through `zin_eindil_add_delay`, never by moving an already-scheduled event.

### Flags and variables touched

Shared (contract or journey spec): `zin_eindil_awake`, `zin_eindil_war_king`, `zin_eindil_named`, `zin_eindil_stage`, `zin_eindil_renown`, `zin_eindil_regard`, `zin_eindil_delay`, `zin_eindil_host`, `zin_eindil_heeded`, `zin_eindil_sworn`, `zin_eindil_dragon_pact`, `zin_aurevan_went_north`, `zin_aenor_eindil_denounced`, `zin_afrit_impostor_denounced`, `zin_west_remembers_war_king`, `zin_glo_with_eindil`. Internal: `zin_eindil_ports_betrayed`, `zin_eindil_hunted`, `zin_eindil_elven_crew`, `zin_eindil_episode_<n>_done`.

### Character changes

| Event | Change |
| --- | --- |
| `.10` | `zin_eindil` enters play: name "The Man from the Ice", portrait E1 |
| `.32` | Portrait E2 (war-king of the West) |
| `.52` | `set_character_name` Eindil; portrait E3 |
| `.73` (or `zin_glo.80`) | Portrait E4 (bearer of Glo) |
| `.165` A | `zin_ilsabet` moves to the host as theorist |
| `.87` | `zin_varner`, `zin_golbran` recruited by the Magical Forest as advisors |

## AI

- **Historical rule** (`zin_eindil_historical`): every "AI help" option; one port of call reports the ship (the one with the highest footholds); nobody sends guides; Afrit's party waits; Selen shelters and swears; Aenor denounces; the Magical Forest shelters and grants the dragon.
- **Dynamic rule:** help 70, hinder 10, ×3 hinder with footholds ≥ 3, ×2 hinder for Dominion with stance `zin_dom_warlord`, ×0 hinder for Light with `zin_light_wardens` or `zin_light_sanctuary`, ×2 help for a friend (journey spec). New events use the weights in their tables.
- No AI option in this spec starts a war.

## Acceptance

1. No `zin_eindil` event fires and no text names the stranger before `zin_eindil_awake` (start check; secret scan of the new keys).
2. Before `zin_eindil_named`, every text uses `[zin_loc_eindil]` or "the stranger"; "Eindil" appears only in `.52` and later (compiler scan by firing condition).
3. Historical observer run: stages 1 to 8 start within 120 days of their floors; the events fire in the order of the chain table; the ambush strength is ≥ 4; the crew dies; `zin_eindil_named` is set in 4A 1752 and `zin_glo_with_eindil` in 4A 1753.
4. No text before `zin_afrit_revealed`, shown to a country other than Afrit's, names Afrit; `.73` and `.83` say "brother" and "son of Ein" without the name.
5. Each host fallback works: removing the default host of stages 1, 2, 4, 5 and 8 by console sends the stage's first event to the fallback, and the chain continues (negative tests).
6. Every hinder option adds delay and never sets `zin_eindil_lost` before stage 9 (scenario test of each).
7. Exactly one report of the naming reaches Afrit's country (`zin_afrit.31`), and `zin_glo.10` no longer exists or never fires.
8. Every option has text and an `ai_chance`; ids 150–169 are unique; `hoi4.event_inspect` shows every event reachable.

## Open questions

1. Is "Old Siula" acceptable as the elder who finds him (proposed in the characters spec), and may she be named in text?
2. Should Master Ilsabet's rolls (`.165`) be allowed to reach Selen on the historical path? The vault proposes that scholarly branches gather proof of his ancestry; the spec makes it a player or non-Aurevan choice only.
3. The journey and Afrit specs use different ambush formulas. This spec merges them (journey base 5, Afrit terms +1 each). Confirm.
4. Should `zin_glo.10` be retired in favour of `zin_afrit.31`, as proposed here, or should the two specs keep two reports?
5. In `.83` the stranger says the king in Parim "is not what the temples say". Is that enough, or should his warning say plainly that the king is his brother, before the world knows the name?
6. Which state is Eindil's ice, which are the bridge, the ford, the shrine and the landing? The event texts assume the key-site rows exist.
