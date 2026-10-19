# Endings: Events and End Screens

**Status:** Ready. Reviewed 19 October 2026 against CONVENTIONS "Status"; integrated 19 October 2026. **Priority:** 5. **Phase:** 5.

## Purpose

The vault defines three **alternative** endings: the Lost Cause, Children of Volgan and the Ashen Throne. The established story ends in the first. [05_world_tension_and_endings.md](../03_gameplay/05_world_tension_and_endings.md) owns the detection: one ending per game, global flag `zin_ending_reached`, variable `zin_world_ending`, the effect `zin_world_reach_ending`, the monthly check `zin_world_check_endings`, the proposed outcomes judged on 1 Deepwinter 4A 1762, the fallback on 1 Deepwinter 4A 1770, and the ending spirits. It reserves `zin_world.100`–`.119` for the endings.

This spec turns each ending into an event chain and an end screen:

- the **lead-up**: the events that tell players an ending is near, and the choices that still matter;
- the **moment**: the ending's world news (`zin_world.100`–`.107`) with its text;
- the **aftermath**: what each kind of country is told, and what it may still choose, in the new namespace **`zin_ending`**;
- the **end screen**: the Chronicle of the Age (`zin_world.110`), the player's own epilogue (`zin_world.111`), and the sandbox notice (`zin_world.112`).

The conventions C1 to C12 of [01_golden_king_and_succession.md](01_golden_king_and_succession.md) apply. **Exception to C11:** the eight ending news events and the Chronicle may run to seven sentences, because they close the age; every other description here keeps to three.

## Lore basis

| Fact | Status | Source |
| --- | --- | --- |
| Three alternative endings, not three events that all happen: the Lost Cause (the alliance under Eindil prevails and refuses imperial domination); Children of Volgan (Volgan dominates a ruined world through monsters, grave hosts and client states); the Ashen Throne (Afrit rules through worship, bargains, corruption and captured institutions) | established | *Possible Endings* |
| The precise mechanics leading to each ending are open | established (open) | *Possible Endings* |
| The Fourth Age ends with Eindil's coronation; his coronation does not erase grievances; western, northern and eastern kingdoms keep their claims; the Middle Lands are devastated; Lorien, Varner, Horos and Golbran are dead; Zol is not slain; Volgan's spirit is unresolved; Eindil wears the Necklace, whose effects are unknown | established | *Fifth Age Seeds*, *The Fourth Age of Erdae* XVI |
| The Fifth Age is undefined; its proposed directions (a settlement recognising western and northern sovereignty, disputes over Afrit's temples, the Necklace, Volgan's remnants, the Gala after Lorien, a theology of Eindil) are not settled outcomes | established (directions proposed) | *Fifth Age Seeds* |
| Four further outcomes are proposed for play, outside canon: the Golden Court endures under a surviving Golden King; a western crown holds Parim; Lerendor masters the strait; the East unites under one king who is not Afrit | proposed | *The Campaign of 4A 1748* |
| The Age Unfinished, the ending spirits, the Chronicle, every text and option below | **proposed** | world spec and this spec |

**Kept open, and never closed by an ending's text:** whether Volgan's spirit survives; what remains of Zol; the price of the Necklace; what becomes of Afrit's temples, his council's survivors and the thief; whether the Lost Cause formally survives; what the Fifth Age is. No ending is written as the end of the world's story; the canon ending says the age ended, the others say "in this telling of the age".

## Design

### How every ending runs

| Step | What | Owner |
| --- | --- | --- |
| 1 | The trigger holds (world spec table) | world |
| 2 | `zin_world_reach_ending` (argument `ending`): if the ending is the Ashen Throne and `zin_afrit_revealed` is not set, it calls `zin_afrit_reveal` first; sets `zin_ending_reached`, the ending flag and `zin_world_ending`; adds the ending spirit | world |
| 3 | Fires the ending's news `zin_world.100`–`.107` to every country (`news_event`, `days = 0`) | world (event and text here) |
| 4 | Calls `zin_ending_start_epilogue` (argument `ending`; this spec): fires the ending's `zin_ending` events to the countries in its table, with the days given, and `zin_world.110` with `days = 14` | this spec |
| 5 | `zin_world.110` *The Chronicle of the Age* to every human player (`is_ai = no`) | this spec (id in the world range) |
| 6 | `zin_world.111` *Your Part in the Age*, fired by `.110` with `days = 1`, to the same player | this spec (id in the world range) |
| 7 | `zin_world.112` *The Age Has Turned*, fired by `.111` with `days = 7`: play continues to 4A 1800 (V3); the meter's label changes; no other ending can fire | this spec (event); world (label, lock) |

Nothing in steps 4 to 7 changes which ending was reached. Epilogue options are play choices for the sandbox, not history.

### Lead-up events (before any ending)

Fired by the runner block `zin_story_tick_ending` (C6). The two dated events use the same date set as the world spec's judgement date, one and two years before it.

| Id | Title | To | Fired by | Hist. | Text gist | Options |
| --- | --- | --- | --- | --- | --- | --- |
| `zin_ending.1` | The Age Draws to Its Close | every human player | runner, 1 Deepwinter 1760, if `zin_ending_reached` is not set | Deepwinter 1760 | "Chroniclers say the Fourth Age is ending. They do not agree how." Tooltip `[zin_loc_endings_possible]` lists which endings are still possible (reads the three canon triggers and the proposed outcome flags) | **"Then let us write its last page."** |
| `zin_ending.2` | The Last Year of Judgement | every human player | runner, 1 Deepwinter 1761, if `zin_ending_reached` is not set | Deepwinter 1761 | "If no crown has ended the age by the first day of 4A 1762, the chroniclers will judge it by what each crown holds." Tooltip lists the proposed outcomes and their conditions | **"A year remains."** |
| `zin_ending.3` | Shadows Over Parim | every human player whose country `has_war_with` Volgan | runner: `zin_volgan_children_ready` true at two monthly checks in a row (the first sets the internal global flag `zin_ending_volgan_near`), no ending reached, before 1 Thaw 1756 (from that date the world spec reaches the ending at once) | divergence | "Volgan's hosts hold Parim. His client crowns are many. If nothing changes, the world will be his." | **"Not while we stand."** war support +0.05 |
| `zin_ending.4` | The Ash Gathers | every human player whose country is at war with the realm Afrit leads (`zin_afrit_rules_here`) | runner: `zin_afrit_revealed`, `zin_afrit_holds_parim` and at least 12 countries with `zin_footholds` ≥ 4, while `zin_afrit_ashen_throne_ready` is false and no ending is reached | divergence | "Afrit holds Parim, and too many crowns owe him their councils. If the palace is not taken, the age will end in ash." | **"Not while we stand."** war support +0.05 |

### Canon ending 1: The Lost Cause

**Reached:** `zin_eindil_crowned` (the Aenor spec's coronation). If `zin_lost_cause_with_eindil` is not set, the ending sets it. Historical: Thaw 4A 1760. News picture `ending_lost_cause`. "Eindil's Aenor" is the Aenor realm whose leader is `zin_eindil` (`zin_aenor_eindil_rules`). "A coalition member" is a country `is_in_faction_with` Eindil's Aenor.

| Id | Title | To | Fired by | Text gist | Options (effects; AI) |
| --- | --- | --- | --- | --- | --- |
| `zin_world.100` | The Lost Cause | news, every country | `zin_world_reach_ending` | "The Fourth Age ends with a king of Aen's line on the throne of Aenor. The Lost Cause that a vain king founded for his own glory has become something else: the league of the living, who stood together against the dark and asked no crown to kneel. The Middle Lands lie in ruins." Then one clause per fact that holds in this game, through `[zin_loc_ending_lost_cause_cost]`: "[Lorien, Varner, Horos and Golbran] are dead" (only the names whose death flags are set), "The Old God was driven back, not slain" (`zin_zol_withdrawn`), "Volgan's body was broken; what remains of him, no one can say" (`zin_volgan_body_destroyed`), "The king wears the Necklace of the Abyss, and its price is not yet known" (`zin_eindil_wears_necklace`). | **"So ends the Fourth Age."** Eindil's Aenor: spirit `zin_world_no_crown_over_crowns` (world spec) |
| `zin_ending.10` | No Crown Over Crowns | Eindil's Aenor | `.100` + 7 days | "The king's council asks what Aenor shall ask of the crowns that fought beside it. He answers: nothing they did not offer." | **"Treaties, not conquest."** every coalition member and every Free Dominion (`zin_aenor_free_dominion`) gets `zin_ending.11` (hist; FREE 100). **"Let them come to us."** nothing (AI 0; player choice) |
| `zin_ending.11` | A Treaty Among Equals | every country fired by `.10` A | `.10` A, 1 day | "Parim offers a treaty of mutual defence between equals. It claims no land and no oath of service. In this telling of the age, the crowns may sign or not." | **"Sign as equals."** `diplomatic_relation` `non_aggression_pact` with Eindil's Aenor; opinion modifier `zin_ending_treaty_of_equals` (+25) both ways (AI 70 if `zin_eindil_friend` or `has_opinion_modifier` `zin_west_fought_beside`, else 30). **"We keep our own counsel."** nothing |
| `zin_ending.12` | Grievances Remain | every country with the roster-region flag `zin_region_west_lands`, `zin_region_north_lands` or `zin_region_east_lands` (economy spec, set on startup) that is not a coalition member and has `zin_eindil_regard` < 25 | `.100` + 30 days | "The war is over. The old claims are not. Our court remembers what Aenor was before the heir, and what it may be after him." | **"Remember."** war support +0.03; opinion modifier `zin_ending_old_claims` (−10) toward Eindil's Aenor (FREE 50). **"Let the next age judge."** stability +0.03 (FREE 50) |
| `zin_ending.13` | First Friends of the King | every country with `zin_eindil_regard` ≥ 50 | `.100` + 7 days | "The king remembers who nursed a stranger from the ice, who made peace beside him, who sheltered him when he was hunted." | **"We remember too."** No effect; the journey spec already gave these countries `zin_eindil_first_friends` at the coronation (tooltip names it) |
| `zin_ending.14` | The Necklace at His Throat | Eindil's Aenor, if `zin_eindil_wears_necklace` | `.100` + 60 days | "The king still wears the necklace he took from his brother. He does not speak of it, and nobody asks him to." No effect; nothing is said of its power or its cost | **"Nobody asks."** |
| `zin_ending.15` | The Houses Without a God | every country with `zin_footholds` ≥ 2 | `.100` + 90 days | "The Houses of the First Light still keep grain and hospitals. Their god is dead. In this telling, each crown must decide what they are now." | **"Keep them as the crown's hospitals."** stability +0.02; `zin_afrit_add_footholds` −5 (FREE 60). **"Close them."** stability −0.03; `zin_afrit_purge_houses` (FREE 30). **"Let them go on as they are."** nothing (FREE 10) |

### Canon ending 2: Children of Volgan

**Reached:** `zin_volgan_children_ready` (Volgan spec: body intact; Parim held by Volgan or a subject; four or more subjects; strength ≥ 60; Eindil not crowned), checked from 1 Thaw 1756. Never on the historical path. News picture `ending_children_of_volgan`. Text says "in this telling of the age".

| Id | Title | To | Fired by | Text gist | Options (effects; AI) |
| --- | --- | --- | --- | --- | --- |
| `zin_world.101` | Children of Volgan | news, every country | `zin_world_reach_ending` | "In this telling of the age, the Great Spirit of the Dead Lands rules a ruined world. His grave hosts stand on the plains of the Middle Lands, his client crowns kneel in their halls, and the monsters of the south walk where the kingdoms of men were." | **"So ends the Fourth Age."** Volgan: spirit `zin_world_lord_of_a_ruined_world` |
| `zin_ending.20` | The Court of Nafeher | Volgan | `.101` + 7 days | "The Dominion's lieutenants kneel. The world is his, as he always said it would be once men divided." | **"Let the clients rule in my name."** `zin_volgan_add_oath` (`target = all`, `value = 10`); stability +0.05 (FREE 60). **"Let them fear."** war support +0.10 (FREE 40) |
| `zin_ending.21` | A Client Crown | every country `is_subject_of` Volgan | `.101` + 14 days | "Our crown is a gift of Nafeher now. Our people have stopped asking whose." | **"Serve."** stability −0.05; war support +0.05 |
| `zin_ending.22` | The Dark Over Parim | every Aenor realm (`zin_aenor_is_realm`) and the country in `zin_eindil_host` if it exists | `.101` + 7 days | "Parim belongs to the south. Those of Aen's kingdom who still fight do so from the hills and the lakes." | **"Fight on from the hills."** war support +0.10; stability −0.05 (FREE 70). **"Seek terms with Nafeher."** `white_peace` with Volgan if at war with it (FREE 30) |
| `zin_ending.23` | A Ruined World | every other country except Volgan's subjects and Zol | `.101` + 30 days | "Trade roads are empty. Refugees fill every harbour." | **"Endure."** stability −0.03; war support +0.05 (FREE 70). **"Send envoys south."** opinion modifier `zin_ending_envoys_south` (+20) toward Volgan; Dark Lands countries also `zin_dark_add_volgan_pact` (`target = ROOT`, `value = 1`) (FREE 30; ×0 for Light) |

If Eindil lives when this ending is reached, no text says what becomes of him: "the heir" is not mentioned in these texts.

### Canon ending 3: The Ashen Throne

**Reached:** `zin_afrit_ashen_throne_ready` (Afrit spec: Afrit alive with the Necklace; Parim held by his side; 12 countries at footholds 4+; and one of the three late conditions). The reveal is called first if needed, so every text here may name him. News picture `ending_ashen_throne`.

| Id | Title | To | Fired by | Text gist | Options (effects; AI) |
| --- | --- | --- | --- | --- | --- |
| `zin_world.102` | The Ashen Throne | news, every country | `zin_world_reach_ending` | "In this telling of the age, Afrit, son of Ein, who was worshipped as the Deliverer, rules from Parim. His temples are full. His council sits in every court that owes it favours. Those who know what he is keep silent, or are silenced." | **"So ends the Fourth Age."** Afrit's realm: spirit `zin_world_the_worshipped_king` |
| `zin_afrit.80` | The Ashen Throne | Worshipdom (private) | the ending | Afrit's own record: the throne his father denied him | One option (Afrit spec) |
| `zin_ending.30` | The Worshipped King | the realm Afrit leads (`zin_afrit_rules_here`) | `.102` + 7 days | "The council asks how the King of All Erdae will rule a world that knows his name." | **"As a god."** stability +0.05; every country with footholds ≥ 4 gets `zin_ending.31` (FREE 70). **"As a king; let them forget the rest."** +100 PP (FREE 30) |
| `zin_ending.31` | The Temple Asks Its Due | every country with footholds ≥ 4, except Afrit's realm | `.30` A, 1 day | "Our councillors owe the temples of Afrit favours older than our grandfathers. Now the temples ask openly." | **"Pay it."** opinion modifier `zin_ending_temple_paid` (+25) toward Afrit's realm; `zin_afrit_add_footholds` +1 (within cap) (FREE 70). **"Refuse it."** opinion modifier `zin_ending_temple_refused` (−25); stability −0.03; `zin_afrit_purge_houses` (FREE 30; Light ×2) |
| `zin_ending.32` | The Ash Settles | every country with footholds ≤ 3, except Afrit's realm and its subjects | `.102` + 30 days | "A false god rules the old kingdom of Aen. Our court must decide whether to bow, or to wait." | **"Close our borders to his priests."** `zin_afrit_purge_houses`; war support +0.03 (FREE 60). **"Send gifts and keep our counsel."** opinion modifier `zin_ending_gifts_to_parim` (+15) toward Afrit's realm (FREE 40) |

If Eindil lives (`zin_afrit_palace_held`), no text says where he is or what he does.

### Proposed outcome 4: The Golden Court Endures

**Reached** on 1 Deepwinter 1762 when `zin_golden_king_dead` is not set (the Golden King survived the Council's War, or the Council chose the Kingdom Behind the Throne with the King alive). News picture `ending_golden_court`. The secret may still hold: every text uses `[zin_loc_deliverer]` and the two-face camp names (C1, C3).

| Id | Title | To | Fired by | Text gist | Options |
| --- | --- | --- | --- | --- | --- |
| `zin_world.103` | The Golden Court Endures | news, every country | judgement | "In this telling of the age, the Golden King still reigns in Parim. The feasts go on. Whatever the war took from the world, the Golden Court kept its gold." | **"So ends the Fourth Age."** Aenor: spirit `zin_world_outcome_golden_court` |
| `zin_ending.40` | The King's Long Feast | Aenor | `.103` + 7 days | "The old King holds a feast for the end of the war. He laughs louder than anyone." If `zin_golden_king_plot_exposed`: "He eats nothing his tasters have not touched." | **"Another feast, another year."** `zin_aenor_add_court_corruption` +5; +50 PP |
| `zin_ending.41` | The Temples and the King | Worshipdom (private) | `.103` + 7 days, if `zin_afrit_kingdom_behind_throne` | "The King reigns. The Council governs. Nobody outside this room knows the difference." | One option |

### Proposed outcome 5: A Western Crown in Parim

**Reached** on 1 Deepwinter 1762 with `zin_west_holds_parim`. The claimant is not named. News picture `ending_western_crown`. "The holder" is the controller of Parim's state (`zin_is_site_parim`).

| Id | Title | To | Fired by | Text gist | Options |
| --- | --- | --- | --- | --- | --- |
| `zin_world.104` | A Western Crown in Parim | news, every country | judgement | "In this telling of the age, western banners still fly over Parim. The old quarrel of the West and Aenor has ended the other way round." | **"So ends the Fourth Age."** holder: spirit `zin_world_outcome_western_crown` |
| `zin_ending.50` | Governors of the Old Kingdom | the holder | `.104` + 7 days | "Our captains govern the oldest city of men. They do not know the language of its prayers." | **"Rule it as conquerors."** war support +0.05; Parim's state `add_resistance` +10 (FREE 40). **"Rule it as guests."** Parim's state `add_compliance` +10 (FREE 60) |
| `zin_ending.51` | Aenor Beyond Parim | every Aenor realm | `.104` + 7 days | "The kingdom has lost its capital to the West. The Concord meets in exile." | **"We will take it back."** war support +0.10 |

### Proposed outcome 6: Master of the Strait

**Reached** on 1 Deepwinter 1762 with `zin_leren_strait_supremacy` and `zin_leren_holds_strait`. News picture `ending_strait_master`.

| Id | Title | To | Fired by | Text gist | Options |
| --- | --- | --- | --- | --- | --- |
| `zin_world.105` | Master of the Strait | news, every country | judgement | "In this telling of the age, Lerendor is Sovereign of the Narrow Sea. Every ship that crosses between the North and the Middle Lands pays Sonargur's dues." | **"So ends the Fourth Age."** Lerendor: spirit `zin_world_outcome_strait_master` |
| `zin_ending.60` | The Chain at Sonargur | Lerendor | `.105` + 7 days | "The harbour chain of Sonargur is raised for every ship. The toll of 4A 1716 is paid a thousand times over." | **"Long live the Sovereign."** +100 PP |
| `zin_ending.61` | Northern Dues | every country with `zin_region_north_lands` (except Lerendor and its subjects) and every Aenor realm | `.105` + 14 days | "Our ships pay Lerendor's dues now." | **"Pay."** opinion modifier `zin_ending_dues_paid` (+10) toward Lerendor (FREE 70). **"Resent it."** opinion modifier `zin_ending_dues_resented` (−20) (FREE 30) |

### Proposed outcome 7: One King in the East

**Reached** on 1 Deepwinter 1762 with `zin_east_united` and either `zin_afrit_dead` or `zin_afrit_king_of_east` never set. News picture `ending_eastern_king`. "The united crown" is the country with the idea `zin_east_united_crown` (eastern kings spec).

| Id | Title | To | Fired by | Text gist | Options |
| --- | --- | --- | --- | --- | --- |
| `zin_world.106` | One King in the East | news, every country | judgement | "In this telling of the age, the East has one king, and he is not the false god. The caravan roads answer to one crown." | **"So ends the Fourth Age."** the united crown: spirit `zin_world_outcome_eastern_king` |
| `zin_ending.70` | Master of All Roads | the united crown | `.106` + 7 days | "Every caravan from the rift to the deep sand pays one treasury." | **"Lower the tolls."** stability +0.05; every East Lands court gets opinion modifier `zin_ending_open_roads` (+10) toward us (FREE 60). **"Raise them."** +150 PP (FREE 40) |
| `zin_ending.71` | Homage to the High King | every East Lands court (`zin_east_is_court`) other than the united crown | `.106` + 14 days | "The High King's envoys ask for homage." | **"Pay homage."** opinion modifier `zin_ending_homage_paid` (+20) toward the united crown (AI by `zin_east_lean` toward its side: 70, else 30). **"Refuse."** opinion modifier `zin_ending_homage_refused` (−20) |

### Fallback 8: The Age Unfinished

**Reached** on 1 Deepwinter 1770 with no ending. News picture `ending_unfinished`.

| Id | Title | To | Fired by | Text gist | Options |
| --- | --- | --- | --- | --- | --- |
| `zin_world.107` | The Age Unfinished | news, every country | 1 Deepwinter 1770 | "No crown ended the Fourth Age. The chroniclers leave the last pages blank, for someone else to write." | **"So it continues."** |

### The heir lost

If `zin_eindil_lost` is set, the Lost Cause ending cannot be reached (it needs `zin_eindil_crowned`). The journey's `zin_eindil.140` *The Heir Is Lost* is the news ("In this telling of the age, the heir of Aen does not come back"). This spec adds:

| Id | Title | To | Fired by | Text gist | Options |
| --- | --- | --- | --- | --- | --- |
| `zin_ending.80` | The League Without the Heir | the country in `zin_eindil_host` if it exists, else the Aenor realm holding Parim, else the original Aenor country | `zin_eindil.140` + 14 days (dependency: the journey spec fires it) | "The heir is gone. The league he gathered is still in the field, and the dark has not gone home." | **"Fight on."** war support +0.05 (FREE 100). Tooltip: a worthy crown may seek Glo as its bearer (Yeldenne and Glo spec), shown only if `zin_glo_dimmed` is not set |

The world then reaches another canon ending, a proposed outcome on 1 Deepwinter 1762, or the fallback.

### The end screen

ZIN shows the end of the age with three events and the ending spirit. No game screenshot is used (CONVENTIONS); pictures are image-generated.

#### `zin_world.110` The Chronicle of the Age

To every human player, 14 days after the ending news. Picture `chronicle`. The description is built by scripted localisation from the path spec's checkpoint states (`zin_path_cp01` … `zin_path_cp26`). It has four parts:

1. **Heading** (`zin_loc_chronicle_heading`): "The Fourth Age ended on [GetDateText]: [ending]."
2. **The age as it went** (`zin_loc_chronicle_cp01` … `_cp26`): one line per checkpoint (26 lines, grouped in five paragraphs), each picked by the checkpoint's state.
3. **The meter** (`zin_loc_chronicle_meter`): "The Gathering Dark stood at [?global.zin_gathering_dark|0]."
4. **What the chronicle does not know** (`zin_loc_chronicle_unknown`): a fixed closing line: "What remains of Volgan, what the Old God keeps in the dark, and what the Fifth Age will be, no chronicle of this age can say." Only the parts that apply: the Volgan clause only if `zin_volgan_body_destroyed`; the Old God clause only if `zin_zol_withdrawn`.

Every line obeys C1 and C2: if `zin_afrit_revealed` is not set, every mention of the god-king uses `[zin_loc_deliverer]` and no line says how the Golden King died; if `zin_eindil_named` is not set, the heir is "the Man from the Ice" (`[zin_loc_eindil]`).

**Chronicle lines (proposed text, one per state).** Checkpoint numbers are the path spec's.

| CP | Historical (1) | Diverged (2) | Skipped (3) |
| ---: | --- | --- | --- |
| 01 | The age began in peace. | — | — |
| 02 | A man woke in the ice of the Cold Lands. | The man in the ice woke [early / late]. | — |
| 03 | The Truce of the Grey Ford broke. | The Grey Ford truce held. | — |
| 04 | In the West he made a peace and laid a crown down. | Another hand made the western peace. | The West never knew him. |
| 05 | In Mistfall the Golden King died in his sleep. | The Golden King did not die as the Council planned. | — |
| 06 | The temples laid the crown before [zin_loc_deliverer]. | Another camp took the seals of Parim. | No god took Aenor's crown. |
| 07 | Storms carried the stranger to the Islands of the South. | — | — |
| 08 | At Gala, Lorien named him Eindil, son of Ein. | He learned his name by another road. | Nobody named him. |
| 09 | At Yeldenne the guardian fell and gave Glo to the heir. | The hall of Yeldenne ended another way. | Glo never left the north. |
| 10 | He warned Aenor, and Aenor called him an impostor. | Aenor listened to him. | — |
| 11 | The War of the Last Crowns began. | The great war began [early / late]. | — |
| 12 | The North abandoned the old alliance. | The North kept, or broke, its oath its own way. | — |
| 13 | The West crossed the wide sea. | The West did not cross as conquerors. | — |
| 14 | Eastern banners crossed the rift. | No eastern coalition crossed the rift. | — |
| 15 | Volgan retook Mirolon and marched north. | Mirolon held the passes. | — |
| 16 | The dead rose out of the north. | The dead rose at another hour, or not at all. | The north stayed silent. |
| 17 | The god-king fled east and was named King of the East; the world learned his name. | He stood in Parim instead. | — |
| 18 | Western armies took Parim. | Parim did not fall to the West. | — |
| 19 | The heir came back on a dragon with Varner and Golbran. | He came back to no battle. | He did not come back. |
| 20 | Varner died shielding the living. | — | — |
| 21 | Volgan cast the heir down, and the New Gods raised him. | — | — |
| 22 | The heir broke Volgan's body. | Volgan's body was not broken. | — |
| 23 | The Old God came forth, and Lorien died forcing him back. | The Old God came forth and withdrew without the King of Gala's death. | — |
| 24 | Afrit came back from the East and cast his brother from a cliff. | The second betrayal went another way. | — |
| 25 | In the palace the false god was stripped and killed; Golbran died saving the heir. | The palace held against the heir. | — |
| 26 | Eindil, son of Ein, was crowned King of Aenor. | — | No king of Aen's line was crowned. |

Lines for checkpoints that never resolved before the ending (state 0) are left out. Lines 06 and 17 use `[zin_loc_deliverer]`. The historical lines 17, 24 and 25 are shown only when `zin_afrit_revealed` is set; otherwise the checkpoint shows its diverged line, which does not name him. Line 05 keeps "died in his sleep" after the reveal too ([OPEN_QUESTIONS.md](../OPEN_QUESTIONS.md) events 14). "[early / late]" in lines 02 and 11 is chosen by the checkpoint's resolution date against its target date.

#### `zin_world.111` Your Part in the Age

To every human player, 1 day after the Chronicle. Picture `chronicle` (until the standard crops of the `ending_*` keys exist; see Requested pictures). Text by the player's country, chosen in this order (`zin_loc_your_part`):

| Case | Test | Text gist |
| --- | --- | --- |
| The ending's holder (Eindil's Aenor, Volgan, Afrit's realm, the outcome's holder) | the country that received the ending spirit | "The age ended in your hands." Then one line per ending |
| A coalition member, Lost Cause ending | `is_in_faction_with` Eindil's Aenor | "Your banners stood with the heir when it mattered." |
| A country with regard ≥ 50 | `zin_eindil_regard` ≥ 50 | "The king will remember what you did for a stranger." |
| A Volgan subject or an eastern client of Afrit | `is_subject_of` Volgan, or `zin_afrit_eastern_client` | "You knelt. History will remember to whom." |
| A capitulated country | `has_capitulated = yes` | "Your realm did not see the end of the war as a free crown." |
| Zol | the Zol country (`zin_is_zol`) | "The north keeps its counsel. The dead are patient." (No claim that Zol won or lost; the Zol spec's end view shows his power, the islands and the field) |
| The Worshipdom after Afrit's death | `zin_afrit_is_hub` and `zin_afrit_dead` | "The hermitage outlived its god." |
| Any other | — | "Your realm lived through the end of an age." |

One option: **"So ends my part."** No effect.

#### `zin_world.112` The Age Has Turned

To every human player, 7 days after `.111`. Picture `chronicle`. "The Fourth Age is over. Play continues until 4A 1800. No other ending will be judged." One option. The meter's label becomes "The Age Has Turned" (world spec).

#### Interface

The three events are the whole end screen. [07_interface/01_interface.md](../07_interface/01_interface.md) may later add a "Chronicle" button to the Realm panel after `zin_ending_reached` that reopens `zin_world.110`'s text; it shows and decides nothing, and this spec does not depend on it.

### Decisions recorded here (proposed)

- **The Lost Cause's conditions** ([OPEN_QUESTIONS.md](../OPEN_QUESTIONS.md) events 13): the coronation is enough; the refusal of imperial domination is the choice in `zin_ending.10`. Without Eindil the Lost Cause ending cannot be reached, because the vault ties it to him.
- **No Zol ending** (world systems 9): the Zol player's epilogue claims no victory or defeat.
- **The Houses after the war** (events 15): `zin_ending.15` stays as a per-crown play choice in "this telling"; no text states what the Houses become in the Fifth Age.
- **The chronicle's line 05** (events 14): it keeps "died in his sleep" after the reveal.

## Implementation

### Builder module and files

No event module exists today; `events/zin_world.txt` holds only the interim hidden stub `zin_world.1` (written by `vanilla_removal.mjs`). New module **`tools/content/modules/events_zin_ending.mjs`**, called by `tools/content/build.mjs` after `buildPresentation`. It reads `tools/content/data/events/zin_ending.json` (new, proposed: the `zin_ending` events and the `zin_world.100`–`.112` texts as data, with recipients, delays, `requires` flags, picture keys, options, `hist` markers and FREE weights; the 26 × 3 chronicle lines; the epilogue cases) and `tools/content/data/presentation-cells.json`. It writes, through the shared atomic rewrite engine:

| Path | Content |
| --- | --- |
| `events/zin_world_endings.txt` | `add_namespace = zin_world`; events `zin_world.100`–`.107`, `.110`–`.112` (ids reserved by the world spec; a separate file, so the world spec's module keeps `events/zin_world.txt`) |
| `events/zin_ending.txt` | Namespace `zin_ending`; every event `is_triggered_only = yes`, `timeout_days = 30` |
| `common/scripted_effects/zin_ending.txt` | `zin_ending_start_epilogue` (argument `ending`) |
| `common/scripted_effects/zin_ending_story.txt` | `zin_story_tick_ending` (lead-up `zin_ending.1`–`.4`; called by `zin_story_tick`, C6) |
| `common/scripted_localisation/zin_ending.txt` | `zin_loc_chronicle_heading`, `zin_loc_chronicle_cp01` … `_cp26`, `zin_loc_chronicle_meter`, `zin_loc_chronicle_unknown`, `zin_loc_your_part`, `zin_loc_endings_possible`, `zin_loc_ending_lost_cause_cost` |
| `common/opinion_modifiers/zin_ending.txt` | `zin_ending_treaty_of_equals` (+25), `zin_ending_old_claims` (−10), `zin_ending_envoys_south` (+20), `zin_ending_temple_paid` (+25), `zin_ending_temple_refused` (−25), `zin_ending_gifts_to_parim` (+15), `zin_ending_dues_paid` (+10), `zin_ending_dues_resented` (−20), `zin_ending_open_roads` (+10), `zin_ending_homage_paid` (+20), `zin_ending_homage_refused` (−20); each `years = 10`, `decay = 1` |
| `localisation/english/zin_ending_l_english.yml` | Every text of this spec, the chronicle lines included (UTF-8 with BOM) |

Art: the `ending_*` news pictures and the `chronicle` event picture are already in the game (`presentation.mjs`). The ending spirits are the world spec's (`common/ideas/zin_world_endings.txt`).

### Ids

| Namespace | Range | Use |
| --- | --- | --- |
| `zin_world` | 100–107 | Ending news (world spec order: 100 Lost Cause, 101 Children of Volgan, 102 Ashen Throne, 103 Golden Court, 104 Western Crown, 105 Strait Master, 106 Eastern King, 107 Unfinished) |
| `zin_world` | 110–112 | Chronicle, Your Part, The Age Has Turned |
| `zin_world` | 108, 109, 113–119 | Reserved |
| `zin_ending` | 1–9 | Lead-up (1–4 used) |
| `zin_ending` | 10–19 | Lost Cause aftermath |
| `zin_ending` | 20–29 | Children of Volgan aftermath |
| `zin_ending` | 30–39 | Ashen Throne aftermath |
| `zin_ending` | 40–49 | Golden Court Endures |
| `zin_ending` | 50–59 | Western Crown |
| `zin_ending` | 60–69 | Master of the Strait |
| `zin_ending` | 70–79 | One King in the East |
| `zin_ending` | 80–89 | The heir lost |
| `zin_ending` | 90–199 | Reserved (Fifth Age seeds, phase 8) |

### Effects and flags

`zin_ending_start_epilogue` (`ending` = one of the world spec's keys `lost_cause`, `children_of_volgan`, `ashen_throne`, `golden_court`, `western_crown`, `strait_master`, `eastern_king`, `unfinished`): fires the aftermath events in the tables with their delays, then `zin_world.110` after 14 days to every human player. It never sets or clears an ending flag. Recipients are evaluated at firing time. Internal flags: `zin_story_done_ending_<id>` (C6) and `zin_ending_volgan_near` (global; `.3`'s first check).

### Dependencies on owner specs

| Owner | Must do |
| --- | --- |
| World | `zin_world_reach_ending` fires the ending's `zin_world.10x` news and calls `zin_ending_start_epilogue`; `zin_story_tick` is step 9 of the monthly tick; `events/zin_world.txt` no longer holds 100–119 |
| Eindil's journey | `zin_eindil.140` fires `zin_ending.80` with `days = 14` |
| Path | Keeps `zin_path_cp01`–`_cp26` as written; the chronicle text lives here, not in `zin_path_l_english.yml` |

### Pictures

| Events | Key |
| --- | --- |
| `zin_world.100`–`.107` | news crop of the ending's key: `GFX_zin_news_ending_lost_cause`, `_children_of_volgan`, `_ashen_throne`, `_golden_court`, `_western_crown`, `_strait_master`, `_eastern_king`, `_unfinished` |
| `zin_world.110`–`.112` | `chronicle` (gate: ending flag) |
| `zin_ending.1`, `.2`, `.71` | `generic_court` |
| `zin_ending.3`, `.21` | `grave_muster` |
| `zin_ending.4`, `.30`–`.32` | `unmasking` (gate `zin_afrit_revealed`; the Ashen Throne calls the reveal first) |
| `zin_ending.10`, `.13`, `.14` | `crown_of_aen` (gate `zin_eindil_crowned`) |
| `zin_ending.11` | `concord_council` |
| `zin_ending.12`, `.22`, `.50`, `.51` | `generic_war` |
| `zin_ending.15` | `houses` |
| `zin_ending.20`, `.23` | `dead_lands_storm` |
| `zin_ending.40` | `court_feast` |
| `zin_ending.41` | `council_chamber` (hub-only) |
| `zin_ending.60`, `.61` | `strait_toll` |
| `zin_ending.70` | `generic_peace` |
| `zin_ending.80` | `lost_cause_triumph` |

**Requested pictures.**

| Key | Shows | Gate | Used by (now using) |
| --- | --- | --- | --- |
| standard 210 × 176 crops `GFX_zin_evt_ending_<key>` of the eight `ending_*` keys (the catalog lists them as news only) | as the catalog | ending flag | `zin_world.111` (`chronicle`); `zin_ending.10` (`crown_of_aen`), `.20` (`dead_lands_storm`), `.30` (`unmasking`), `.40` (`court_feast`), `.50` (`generic_war`), `.60` (`strait_toll`), `.70` (`generic_peace`) |

### Ending spirits

Owned by the world spec: `zin_world_no_crown_over_crowns`, `zin_world_lord_of_a_ruined_world`, `zin_world_the_worshipped_king`, and one small spirit per proposed outcome (`zin_world_outcome_<key>`: `political_power_factor` +0.05, `stability_factor` +0.05). This spec adds none.

### Engine names used

Effects: `country_event` (`days`), `news_event`, `every_country`, `add_political_power`, `add_stability`, `add_war_support`, `add_opinion_modifier`, `reverse_add_opinion_modifier`, `diplomatic_relation` (`relation = non_aggression_pact`), `white_peace`, `add_resistance`, `add_compliance`, `set_global_flag`. Triggers: `has_global_flag`, `is_ai`, `is_in_faction_with`, `is_subject_of`, `has_war_with`, `has_capitulated`, `has_opinion_modifier`, `has_idea`, `has_government`, `has_country_flag`, `check_variable`, `controls_state`, `exists`. Localisation: `[GetDateText]`, `[?global.<variable>]`. Event keys: `is_triggered_only`, `timeout_days`. All exist in 1.19.3 (effects, triggers and loc-objects documentation; `timeout_days` in vanilla `events/`).

## AI

- Under every rule, AI recipients choose by the weights in the tables; no epilogue option starts a war.
- The Lost Cause aftermath under `zin_rules_is_historical`: Eindil's Aenor offers treaties (`zin_ending.10` A); friends sign.
- AI never chooses an option that needs a flag it lacks (each option carries its trigger).
- No `zin_ending` event is a checkpoint choice (C9).

## Acceptance

Build tests (`npm test` in `tools/`, `tools/content/events.test.mjs`):

1. `events/zin_ending.txt` and `events/zin_world_endings.txt` define every id in the tables exactly once; every event is `is_triggered_only = yes` with `timeout_days = 30`; every option has text and an `ai_chance`; no `zin_world` id outside 100–107 and 110–112 is written by this module.
2. Every picture key is in `presentation-cells.json` (news list for `zin_world.100`–`.107`, event list otherwise) and every gated key's gate is in the event's `requires` flags.
3. Phrase scan: no ending text states Volgan's spirit's fate, what remains of Zol, the Necklace's effect, what becomes of the temples or the Fifth Age (no "Volgan is dead", "Zol is destroyed", "the Necklace grants", "the Fifth Age will"); the texts of `zin_world.103`, `zin_ending.40`, `.110` and `.111` reachable while the secret holds contain no "Afrit" outside `_revealed` and `_hub` keys.
4. The chronicle data has exactly one line per checkpoint and state marked in the table, and `hoi4.script_validate` reports no errors in the generated files.

Offline tools (G3) and the isolated Linux run (G4):

5. Historical observer run (L5): `zin_world.100` fires within 30 days of `zin_eindil_crowned`; `zin_world.110` 14 days later; `.111` one day and `.112` seven days after that; exactly one of `zin_world.100`–`.107` fires, and only after `zin_ending_reached` is set.
6. One forced test per ending (phase 5 gate): setting each ending's conditions by console (world spec acceptance 5, 6, 9) fires its news event, its aftermath events to the recipients in its table, and the Chronicle.
7. The Ashen Throne forced test with `zin_afrit_revealed` unset: `zin_afrit.43` fires before `zin_world.102`.
8. The Golden Court Endures forced test with `zin_afrit_revealed` unset: no text shown of `zin_world.103`, `zin_ending.40`, `.110` or `.111` names Afrit (capture review).
9. A scenario with forced checkpoint states: the Chronicle shows one line per resolved checkpoint, the right line for each state, and no line for unresolved ones.
10. `hoi4.event_inspect` shows every `zin_ending` event reachable from its ending and none firing at the start.

## Open questions

Each proceeds on its proposal (see "Decisions recorded here"); all are listed in [OPEN_QUESTIONS.md](../OPEN_QUESTIONS.md).

1. Must the Lost Cause ending also require that Eindil's Aenor holds no subjects outside the Middle Lands, and can it be reached without Eindil (events 13)? Proposal: the coronation is enough; no Lost Cause ending without Eindil.
2. Should the post-reveal chronicle say the Golden King was murdered (events 14)? Proposal: keep "died in his sleep".
3. Keep or remove `zin_ending.15`'s choice about the Houses (events 15)? Proposal: keep it as a play choice.
4. Should Zol have an ending of his own (world systems 9)? Proposal: none.
