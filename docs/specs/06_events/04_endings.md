# Endings: Events and End Screens

**Status:** Draft. **Priority:** 5. **Phase:** 5.

## Purpose

The vault defines three **alternative** endings: the Lost Cause, Children of Volgan and the Ashen Throne. The established story ends in the first. [05_world_tension_and_endings.md](../03_gameplay/05_world_tension_and_endings.md) owns the detection: one ending per game, global flag `zin_ending_reached`, variable `zin_world_ending`, the effect `zin_world_reach_ending`, the monthly check `zin_world_check_endings`, the proposed outcomes judged on 1 Deepwinter 4A 1762, the fallback on 1 Deepwinter 4A 1770, and the ending spirits. It reserves `zin_world.100`–`.119` for the endings.

This spec turns each ending into an event chain and an end screen:

- the **lead-up**: the events that tell players an ending is near, and the choices that still matter;
- the **moment**: the ending's world news (`zin_world.100`–`.107`) with its text;
- the **aftermath**: what each kind of country is told, and what it may still choose, in the new namespace **`zin_ending`**;
- the **end screen**: the Chronicle of the Age (`zin_world.110`), the player's own epilogue (`zin_world.111`), and the sandbox notice (`zin_world.112`).

The conventions C1 to C12 of [01_golden_king_and_succession.md](01_golden_king_and_succession.md) apply.

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
| 3 | Fires the ending's news `zin_world.10x` to every country | world (text here) |
| 4 | Calls `zin_ending_start_epilogue` (new): fires the ending's `zin_ending` events to the countries in its table, with the days given | this spec |
| 5 | 14 days after the news: `zin_world.110` *The Chronicle of the Age* to every human player | world (text here) |
| 6 | 1 day after the Chronicle: `zin_world.111` *Your Part in the Age* to every human player | this spec (id in the world range) |
| 7 | 7 days after that: `zin_world.112` *The Age Has Turned*: play continues to 4A 1800; the meter's label changes; no other ending can fire | world |

Nothing in steps 4 to 7 changes which ending was reached. Epilogue options are play choices for the sandbox, not history.

### Lead-up events (before any ending)

| Id | Title | To | Fired by | Hist. | Text gist | Options |
| --- | --- | --- | --- | --- | --- | --- |
| `zin_ending.1` | The Age Draws to Its Close | every human player | runner, 1 Deepwinter 1760, if no ending is reached | Deepwinter 1760 | "Chroniclers say the Fourth Age is ending. They do not agree how." Tooltip lists which endings are still possible (scripted localisation reading the three canon triggers and the proposed outcome flags) | **"Then let us write its last page."** |
| `zin_ending.2` | The Last Year of Judgement | every human player | runner, 1 Deepwinter 1761, if no ending is reached | Deepwinter 1761 | "If no crown has ended the age by the first day of 4A 1762, the chroniclers will judge it by what each crown holds." Tooltip lists the proposed outcomes and their conditions | **"A year remains."** |
| `zin_ending.3` | Shadows Over Parim | every human player whose country is at war with Volgan | `zin_volgan_children_ready` true for 30 days without the ending (for example, before 1 Thaw 1756) | divergence | "Volgan's hosts hold Parim. His client crowns are many. If nothing changes, the world will be his." | **"Not while we stand."** war support +0.05 |
| `zin_ending.4` | The Ash Gathers | every human player whose country is at war with Afrit's realm | `zin_afrit_holds_parim` and 12 countries at footholds 4+, without the ending | divergence | "Afrit holds Parim, and too many crowns owe him their councils. If the palace is not taken, the age will end in ash." Only after `zin_afrit_revealed` | **"Not while we stand."** war support +0.05 |

### Canon ending 1: The Lost Cause

**Reached:** `zin_eindil_crowned` (the Aenor spec's coronation). If `zin_lost_cause_with_eindil` is not set, the ending sets it. Historical: Thaw 4A 1760. Picture `ending_lost_cause`.

| Id | Title | To | Fired by | Text gist | Options (effects; AI) |
| --- | --- | --- | --- | --- | --- |
| `zin_world.100` | The Lost Cause | news, every country | `zin_world_reach_ending` | "The Fourth Age ends with a king of Aen's line on the throne of Aenor. The Lost Cause that a vain king founded for his own glory has become something else: the league of the living, who stood together against the dark and asked no crown to kneel. Parim is in ruins. Lorien, Varner, Horos and Golbran are dead. The Old God was driven back, not slain. Volgan's body was broken; what remains of him, no one can say. The king wears the Necklace of the Abyss, and its price is not yet known." | **"So ends the Fourth Age."** Aenor: spirit `zin_world_no_crown_over_crowns` (world spec) |
| `zin_ending.10` | No Crown Over Crowns | Eindil's Aenor | 7 days after `.100` | "The king's council asks what Aenor shall ask of the crowns that fought beside it. He answers: nothing they did not offer." | **"Treaties, not conquest."** every coalition member and every Free Dominion gets `zin_ending.11` (AI 100). **"Let them come to us."** nothing (AI 0; player choice) |
| `zin_ending.11` | A Treaty Among Equals | every coalition member; every country at peace with Aenor that fought Volgan or Zol | `zin_ending.10` A | "Parim offers a treaty of mutual defence between equals. It claims no land and no oath of service. In this telling of the age, the crowns may sign or not." | **"Sign as equals."** non-aggression pact with Aenor; opinion +25 both ways (AI: regard ≥ 25 or `zin_west_fought_beside`: 70; others 30). **"We keep our own counsel."** nothing |
| `zin_ending.12` | Grievances Remain | every West Lands, North Lands and East Lands country that was at war with Aenor during the war | 30 days after `.100` | "The war is over. The old claims are not. Our court remembers what Aenor was before the heir, and what it may be after him." | **"Remember."** war support +0.03; opinion of Aenor −10 (AI 50). **"Let the next age judge."** stability +0.03 (AI 50) |
| `zin_ending.13` | First Friends of the King | every country with regard ≥ 50 | 7 days after `.100` | "The king remembers who nursed a stranger from the ice, who made peace beside him, who sheltered him when he was hunted." | **"We remember too."** spirit `zin_eindil_first_friends` (journey spec) |
| `zin_ending.14` | The Necklace at His Throat | Eindil's Aenor | 60 days after `.100` | "The king still wears the necklace he took from his brother. He does not speak of it, and nobody asks him to." No effect; nothing is said of its power or its cost | **"Nobody asks."** |
| `zin_ending.15` | The Houses Without a God | every country with `zin_footholds` ≥ 2 | 90 days after `.100` | "The Houses of the First Light still keep grain and hospitals. Their god is dead. In this telling, each crown must decide what they are now." | **"Keep them as the crown's hospitals."** stability +0.02; footholds 0 (AI 60). **"Close them."** stability −0.03 (AI 30). **"Let them go on as they are."** nothing (AI 10) |

### Canon ending 2: Children of Volgan

**Reached:** `zin_volgan_children_ready` (Volgan spec: body intact; Parim held by Volgan or a subject; four or more subjects; strength ≥ 60; Eindil not crowned), checked from 1 Thaw 1756. Never on the historical path. Picture `ending_children_of_volgan`. Text says "in this telling of the age".

| Id | Title | To | Fired by | Text gist | Options (effects; AI) |
| --- | --- | --- | --- | --- | --- |
| `zin_world.101` | Children of Volgan | news, every country | `zin_world_reach_ending` | "In this telling of the age, the Great Spirit of the Dead Lands rules a ruined world. His grave hosts stand on the plains of the Middle Lands, his client crowns kneel in their halls, and the monsters of the south walk where the kingdoms of men were." | **"So ends the Fourth Age."** Volgan: spirit `zin_world_lord_of_a_ruined_world` |
| `zin_ending.20` | The Court of Nafeher | Volgan | 7 days after `.101` | "The Dominion's lieutenants kneel. The world is his, as he always said it would be once men divided." | **"Let the clients rule in my name."** every Volgan subject +10 `zin_dominion_oath` where it applies; stability +0.05 (AI 60). **"Let them fear."** war support +0.10 (AI 40) |
| `zin_ending.21` | A Client Crown | every Volgan subject | 14 days after `.101` | "Our crown is a gift of Nafeher now. Our people have stopped asking whose." | **"Serve."** stability −0.05; war support +0.05 |
| `zin_ending.22` | The Dark Over Parim | every Aenor realm, the Host of Eindil if it exists | 7 days after `.101` | "Parim belongs to the south. Those of Aen's kingdom who still fight do so from the hills and the lakes." | **"Fight on from the hills."** war support +0.10; stability −0.05 (AI 70). **"Seek terms with Nafeher."** white peace with Volgan if at war; Volgan may make a client crown later (AI 30) |
| `zin_ending.23` | A Ruined World | every other country | 30 days after `.101` | "Trade roads are empty. Refugees fill every harbour." | **"Endure."** stability −0.03; war support +0.05 (AI 70). **"Send envoys south."** opinion of Volgan +20; `zin_volgan_pact` +1 where it applies (AI 30; ×0 for Light) |

If Eindil lives when this ending is reached, no text says what becomes of him: "the heir" is not mentioned in these texts.

### Canon ending 3: The Ashen Throne

**Reached:** `zin_afrit_ashen_throne_ready` (Afrit spec: Afrit alive with the Necklace; Parim held by his side; 12 countries at footholds 4+; and one of the three late conditions). The reveal is called first if needed. Picture `ending_ashen_throne`.

| Id | Title | To | Fired by | Text gist | Options (effects; AI) |
| --- | --- | --- | --- | --- | --- |
| `zin_world.102` | The Ashen Throne | news, every country | `zin_world_reach_ending` | "In this telling of the age, Afrit, son of Ein, who was worshipped as the Deliverer, rules from Parim. His temples are full. His council sits in every court that owes it favours. Those who know what he is keep silent, or are silenced." | **"So ends the Fourth Age."** Afrit's realm: spirit `zin_world_the_worshipped_king` |
| `zin_afrit.80` | The Ashen Throne | Worshipdom (private) | the ending | Afrit's own record: the throne his father denied him | One option (Afrit spec) |
| `zin_ending.30` | The Worshipped King | the realm Afrit leads | 7 days after `.102` | "The council asks how the King of All Erdae will rule a world that knows his name." | **"As a god."** stability +0.05; every country with footholds ≥ 4 gets `zin_ending.31` (AI 70). **"As a king; let them forget the rest."** political power +100 (AI 30) |
| `zin_ending.31` | The Temple Asks Its Due | every country with footholds ≥ 4 | `zin_ending.30` A | "Our councillors owe the temples of Afrit favours older than our grandfathers. Now the temples ask openly." | **"Pay it."** opinion of Afrit's realm +25; footholds 5 within cap (AI 70). **"Refuse it."** opinion −25; stability −0.03; `zin_afrit_purge_houses` (AI 30; Light ×2) |
| `zin_ending.32` | The Ash Settles | every country with footholds ≤ 3 | 30 days after `.102` | "A false god rules the old kingdom of Aen. Our court must decide whether to bow, or to wait." | **"Close our borders to his priests."** `zin_afrit_purge_houses`; war support +0.03 (AI 60). **"Send gifts and keep our counsel."** opinion +15 (AI 40) |

If Eindil lives (`zin_afrit_palace_held`), no text says where he is or what he does.

### Proposed outcome 4: The Golden Court Endures

**Reached** on 1 Deepwinter 1762 when `zin_golden_king_dead` is not set (the Golden King survived the Council's War, or the Council chose the Kingdom Behind the Throne with the King alive). Picture `ending_golden_court`. The secret may still hold: every text uses `[zin_loc_deliverer]` and the two-face camp names (C1, C3).

| Id | Title | To | Fired by | Text gist | Options |
| --- | --- | --- | --- | --- | --- |
| `zin_world.103` | The Golden Court Endures | news, every country | judgement | "In this telling of the age, the Golden King still reigns in Parim. The feasts go on. Whatever the war took from the world, the Golden Court kept its gold." | **"So ends the Fourth Age."** Aenor: spirit `zin_world_outcome_golden_court` |
| `zin_ending.40` | The King's Long Feast | Aenor | 7 days after `.103` | "The old King holds a feast for the end of the war. He laughs louder than anyone." If `zin_golden_king_plot_exposed`: "He eats nothing his tasters have not touched." | **"Another feast, another year."** corruption +5; +50 PP |
| `zin_ending.41` | The Temples and the King | Worshipdom (private) | 7 days after `.103`, if `zin_afrit_kingdom_behind_throne` | "The King reigns. The Council governs. Nobody outside this room knows the difference." | One option |

### Proposed outcome 5: A Western Crown in Parim

**Reached** on 1 Deepwinter 1762 with `zin_west_holds_parim`. The claimant is not named. Picture `ending_western_crown`.

| Id | Title | To | Fired by | Text gist | Options |
| --- | --- | --- | --- | --- | --- |
| `zin_world.104` | A Western Crown in Parim | news | judgement | "In this telling of the age, western banners still fly over Parim. The old quarrel of the West and Aenor has ended the other way round." | **"So ends the Fourth Age."** holder: spirit `zin_world_outcome_western_crown` |
| `zin_ending.50` | Governors of the Old Kingdom | the holder | 7 days after `.104` | "Our captains govern the oldest city of men. They do not know the language of its prayers." | **"Rule it as conquerors."** war support +0.05; resistance higher (AI 40). **"Rule it as guests."** compliance +10 in the Parim state (AI 60) |
| `zin_ending.51` | Aenor Beyond Parim | every Aenor realm | 7 days after `.104` | "The kingdom has lost its capital to the West. The Concord meets in exile." | **"We will take it back."** war support +0.10 |

### Proposed outcome 6: Master of the Strait

**Reached** on 1 Deepwinter 1762 with `zin_leren_strait_supremacy` and `zin_leren_holds_strait`. Picture `ending_strait_master`.

| Id | Title | To | Fired by | Text gist | Options |
| --- | --- | --- | --- | --- | --- |
| `zin_world.105` | Master of the Strait | news | judgement | "In this telling of the age, Lerendor is Sovereign of the Narrow Sea. Every ship that crosses between the North and the Middle Lands pays Sonargur's dues." | **"So ends the Fourth Age."** Lerendor: spirit `zin_world_outcome_strait_master` |
| `zin_ending.60` | The Chain at Sonargur | Lerendor | 7 days after `.105` | "The harbour chain of Sonargur is raised for every ship. The toll of 4A 1716 is paid a thousand times over." | **"Long live the Sovereign."** +100 PP |
| `zin_ending.61` | Northern Dues | every North Lands country and Aenor realm | 14 days after `.105` | "Our ships pay Lerendor's dues now." | **"Pay."** opinion of Lerendor +10 (AI 70). **"Resent it."** opinion −20 (AI 30) |

### Proposed outcome 7: One King in the East

**Reached** on 1 Deepwinter 1762 with `zin_east_united` and either `zin_afrit_dead` or `zin_afrit_king_of_east` never set. Picture `ending_eastern_king`.

| Id | Title | To | Fired by | Text gist | Options |
| --- | --- | --- | --- | --- | --- |
| `zin_world.106` | One King in the East | news | judgement | "In this telling of the age, the East has one king, and he is not the false god. The caravan roads answer to one crown." | **"So ends the Fourth Age."** the king: spirit `zin_world_outcome_eastern_king` |
| `zin_ending.70` | Master of All Roads | the united crown | 7 days after `.106` | "Every caravan from the rift to the deep sand pays one treasury." | **"Lower the tolls."** trade opinion; stability +0.05 (AI 60). **"Raise them."** +150 PP (AI 40) |
| `zin_ending.71` | Homage to the High King | every East Lands court | 14 days after `.106` | "The High King's envoys ask for homage." | **"Pay homage."** opinion +20 (AI by lean). **"Refuse."** opinion −20 |

### Fallback 8: The Age Unfinished

**Reached** on 1 Deepwinter 1770 with no ending. Picture `ending_unfinished`.

| Id | Title | To | Fired by | Text gist | Options |
| --- | --- | --- | --- | --- | --- |
| `zin_world.107` | The Age Unfinished | news | 1 Deepwinter 1770 | "No crown ended the Fourth Age. The chroniclers leave the last pages blank, for someone else to write." | **"So it continues."** |

### The heir lost

If `zin_eindil_lost` is set, the Lost Cause ending cannot be reached (it needs `zin_eindil_crowned`). The journey's `zin_eindil.140` *The Heir Is Lost* is the news ("In this telling of the age, the heir of Aen does not come back"). This spec adds:

| Id | Title | To | Fired by | Text gist | Options |
| --- | --- | --- | --- | --- | --- |
| `zin_ending.80` | The League Without the Heir | the Lost Cause leader, or the Host of Eindil | 14 days after `zin_eindil.140` | "The heir is gone. The league he gathered is still in the field, and the dark has not gone home." | **"Fight on."** war support +0.05 (AI 100). Tooltip: a worthy crown may seek Glo as its bearer (Glo spec, if Glo is not dimmed) |

The world then reaches another canon ending, a proposed outcome on 1 Deepwinter 1762, or the fallback.

### The end screen

ZIN shows the end of the age with three events and the ending spirit. No game screenshot is used (CONVENTIONS); pictures are image-generated.

#### `zin_world.110` The Chronicle of the Age

To every human player, 14 days after the ending news. Picture `chronicle`. The description is built by scripted localisation (`zin_loc_chronicle_<n>`) from the path spec's checkpoint states. It has four parts:

1. **Heading:** the ending's name and date: "The Fourth Age ended on [date]: [ending]."
2. **The age as it went:** one line per checkpoint (26 lines, grouped in five paragraphs), each picked by the checkpoint's state.
3. **The meter:** "The Gathering Dark stood at [value]."
4. **What the chronicle does not know:** a fixed closing line: "What remains of Volgan, what the Old God keeps in the dark, and what the Fifth Age will be, no chronicle of this age can say." (Only the parts that apply: the Volgan clause only if `zin_volgan_body_destroyed`; the Old God clause only if `zin_zol_withdrawn`.)

Every line obeys C1 and C2: if `zin_afrit_revealed` is not set, every mention of the god-king uses `[zin_loc_deliverer]` and no line says how the Golden King died; if `zin_eindil_named` is not set, the heir is "the Man from the Ice".

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

Lines for checkpoints that never resolved before the ending are left out. Lines 06 and 17 use `[zin_loc_deliverer]`; line 24 is shown only when `zin_afrit_revealed` is set (otherwise its diverged or skipped line, which do not name him).

#### `zin_world.111` Your Part in the Age

To every human player, 1 day after the Chronicle. Picture: the ending's key. Text by the player's country, chosen in this order:

| Case | Text gist |
| --- | --- |
| The ending's holder (Eindil's Aenor, Volgan, Afrit's realm, the outcome's holder) | "The age ended in your hands." Then one line per ending |
| A coalition member (`zin_eindil_join_coalition`), Lost Cause ending | "Your banners stood with the heir when it mattered." |
| A country with regard ≥ 50 | "The king will remember what you did for a stranger." |
| A Volgan subject or an eastern client of Afrit | "You knelt. History will remember to whom." |
| A country that capitulated during the war | "Your realm did not see the end of the war as a free crown." |
| Zol | "The north keeps its counsel. The dead are patient." (No claim that Zol won or lost; the Zol spec's end view shows his power, the islands and the field) |
| The Worshipdom after Afrit's death | "The hermitage outlived its god." |
| Any other | "Your realm lived through the end of an age." |

One option: **"So ends my part."** No effect.

#### `zin_world.112` The Age Has Turned

To every human player, 7 days after `.111`. "The Fourth Age is over. Play continues until 4A 1800. No other ending will be judged." One option. The meter's label becomes "The Age Has Turned" (world spec).

#### Interface (dependency)

[07_interface/01_interface.md](../07_interface/01_interface.md) may add a "Chronicle" button to the Realm panel after `zin_ending_reached`, reopening `zin_world.110`'s text as a scripted GUI page. It shows; it decides nothing. This spec requires only the three events.

## Implementation

### Files

| Path | Content |
| --- | --- |
| `events/zin_world.txt` | `zin_world.100`–`.112` texts and options (world spec's file; ids reserved there) |
| `docs/design/events/zin_ending.json`, `events/zin_ending.txt` | Namespace `zin_ending` (new), generated |
| `common/scripted_effects/zin_story.txt` | `zin_ending_start_epilogue` (argument `ending`); `zin_story_tick_ending` (lead-up events `zin_ending.1`–`.4`) |
| `common/scripted_localisation/zin_world_tension.txt` | `zin_loc_chronicle_heading`, `zin_loc_chronicle_cp01` … `_cp26`, `zin_loc_chronicle_meter`, `zin_loc_chronicle_unknown`, `zin_loc_your_part` |
| `localisation/english/zin_ending_l_english.yml`, `zin_path_l_english.yml` | Texts; the chronicle lines live with the path spec's file |
| `gfx/event_pictures/zin/` | `ending_*` and `chronicle` keys (catalog) |

### Ids

| Namespace | Range | Use |
| --- | --- | --- |
| `zin_world` | 100–107 | Ending news (world spec order: 100 Lost Cause, 101 Children of Volgan, 102 Ashen Throne, 103 Golden Court, 104 Western Crown, 105 Strait Master, 106 Eastern King, 107 Unfinished) |
| `zin_world` | 110–112 | Chronicle, Your Part, The Age Has Turned |
| `zin_world` | 108, 109, 113–119 | Reserved |
| `zin_ending` | 1–9 | Lead-up |
| `zin_ending` | 10–19 | Lost Cause aftermath |
| `zin_ending` | 20–29 | Children of Volgan aftermath |
| `zin_ending` | 30–39 | Ashen Throne aftermath |
| `zin_ending` | 40–49 | Golden Court Endures |
| `zin_ending` | 50–59 | Western Crown |
| `zin_ending` | 60–69 | Master of the Strait |
| `zin_ending` | 70–79 | One King in the East |
| `zin_ending` | 80–89 | The heir lost |
| `zin_ending` | 90–199 | Reserved (Fifth Age seeds, phase 8) |

### Effects

`zin_ending_start_epilogue` (`ending` = one of the world spec's keys): fires the aftermath events in the tables with their delays, then `zin_world.110` after 14 days. It never sets or clears an ending flag. Recipients are evaluated at firing time.

### Ending spirits

Owned by the world spec: `zin_world_no_crown_over_crowns`, `zin_world_lord_of_a_ruined_world`, `zin_world_the_worshipped_king`, and one small spirit per proposed outcome (`zin_world_outcome_<key>`: `political_power_factor` +0.05, `stability_factor` +0.05). This spec adds none.

## AI

- Under every rule, AI recipients choose by the weights in the tables; no epilogue option starts a war.
- The Lost Cause aftermath under `zin_rules_is_historical`: Eindil's Aenor offers treaties (`zin_ending.10` A); friends sign.
- AI never chooses an option that needs a flag it lacks (each option carries its trigger).

## Acceptance

1. Exactly one of `zin_world.100`–`.107` fires per game, and only after `zin_ending_reached` is set (scenario runs of each ending, world spec acceptance 5–9).
2. Historical observer run: `zin_world.100` fires within 30 days of `zin_eindil_crowned`; `zin_world.110` 14 days later; `.111` and `.112` follow.
3. The Ashen Throne news never fires while `zin_afrit_revealed` is unset (the reveal is called first).
4. With the Golden Court Endures reached while `zin_afrit_revealed` is unset, no text of `zin_world.103`, `zin_ending.40`, `.110` or `.111` names Afrit (secret scan on a scenario run).
5. The Chronicle shows one line per resolved checkpoint, the right line for each state, and no line for unresolved ones (scenario with forced checkpoint states).
6. No ending text states Volgan's spirit's fate, what remains of Zol, the Necklace's effect, what becomes of the temples or the Fifth Age (phrase scan and review).
7. Every `zin_ending` event has option text and an `ai_chance`; ids are unique; every event is reachable from its ending.

## Open questions

1. Should the Lost Cause ending require that Eindil's Aenor holds no subjects outside the Middle Lands ("refuses imperial domination"), or is the coronation enough? This spec makes the refusal a choice in `zin_ending.10`.
2. Without Eindil, can the Lost Cause ending ever be reached (for example by a second bearer of Glo crowned or not)? This spec says no, as the vault ties the ending to Eindil.
3. Should Zol have an outcome of his own? None is designed; the Zol player's end screen claims no victory or defeat.
4. Are the chronicle lines' wordings right? In particular line 05, "died in his sleep", keeps the cause open even after the reveal; should the post-reveal chronicle say he was murdered?
5. `zin_ending.15` lets crowns decide what the Houses of the First Light become. The vault lists this as an open Fifth Age question. Should the choice be removed until the owner decides?
6. Should the end screen also be a scripted GUI page (interface dependency), or are the three events enough?
