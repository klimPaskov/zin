# Afrit and the Hidden Council

**Status:** Ready. Reviewed 19 October 2026 against CONVENTIONS "Status"; integrated 19 October 2026. **Priority:** 3. **Phase:** 3.

## Purpose

Afrit is the hidden power of the Fourth Age. At the start he is not a visible enemy. He is the Deliverer, Aenor's beloved god, and his Hidden Council already governs Aenor behind the Golden King. This spec defines how ZIN plays that: the Council's four seats, Chancellor Merovan, the Houses of the First Light, the Deliverer's network in every country (`zin_footholds`), Afrit's artifacts (`zin_afrit_artifacts`), the secret and its reveal, the Golden King's murder from Afrit's side, the Yeldenne expedition, the flight east, the King of the East, the return, the palace battle and Afrit's death, and the Ashen Throne ending.

The Worshipdom in the Zilin Hills is the playable hub of the whole system. A player who picks it plays the Hidden Council: patient, deniable and rich in favours, with almost no army. The design goal is that the Worshipdom is fun precisely because it must not be seen.

The Worshipdom's focus tree is specified in [05_focus_trees/major/worshipdom.md](../05_focus_trees/major/worshipdom.md). Aenor's side of the murder, the crowning and the flight is [aenor_court_and_succession.md](aenor_court_and_succession.md); the heir's side of Yeldenne, the cliff and the palace is [eindil_journey.md](eindil_journey.md); the hall is [yeldenne_and_glo.md](yeldenne_and_glo.md); the eastern courts are [eastern_kings.md](eastern_kings.md). Shared names come from [00_shared_contract.md](00_shared_contract.md) and [00_contract_additions.md](00_contract_additions.md).

## Lore basis

| Fact | Status | Source |
| --- | --- | --- |
| Afrit governs Aenor indirectly through priests, schools, relief houses, councillors and royal puppets; ordinary people do not know the name Afrit | established | Fourth Age Canon Register, *Afrit* |
| He keeps a council of followers, spies, sorcerers, foreign agents and creatures who know his true nature | established | *The Fourth Age of Erdae*, *Afrit's Hidden Council* |
| The council uses religious institutions, relief networks, envoys, intelligence and trade, and builds ties in the East Lands and South Lands as a reserve seat | established | *Afrit's Hidden Council* |
| A council member is left in charge of Aenor while Afrit goes to Yeldenne | established | *Afrit's Hidden Council* |
| The name **Chancellor Merovan** for that member | proposed | *Chancellor Merovan (proposed)* |
| Four council duties: royal administration, worship, foreign agents, artifact recovery | proposed structure | *Afrit's Hidden Council*, *Fourth Age Chronology* (c. 4A 1100) |
| The **Houses of the First Light**: refuges, hospitals, grain stores, scribes; chartered 4A 11 | proposed | *Houses of the First Light (proposed)*, *Fourth Age Chronology* |
| The public name **Aurevan** | proposed | *Aurevan the Deliverer*; owner's short list 1 |
| The Worshipdom is a temple-state in the Zilin Hills and the visible hub of the networks | proposed (Afrit having no clear dominion and networks everywhere is established) | *The Campaign of 4A 1748* |
| Afrit holds Roka's Necklace of the Abyss; the thief received unending life | established | *Necklace of the Abyss* |
| The Necklace is strongest in the prepared magical centre of Aenor | established | *Necklace of the Abyss* |
| Lesser artifacts: a ring taken by Eindil is established; the names Ring of Doors, Crown of Witnesses, Bracelet of the First Seal and their effects are proposed; the theft dated 4A 1611 and the gathering 4A 1611–1700 are proposed | mixed | *Afrit's Collected Artifacts*, *Fourth Age Chronology* |
| The thief's name **Sevrin** | proposed | *Sevrin the Unending (proposed)* |
| The Council concludes in 4A 1746 that the Golden King is a liability | proposed date | *Fourth Age Chronology* |
| Afrit arranges the Golden King's death, hides his part, and is proclaimed King of Aenor, First of His Name | established | Canon Register |
| Afrit's agents operate in the Lands of the Sun; one reports Eindil's departure from Lorien | chronicle | *The Fourth Age of Erdae*, VI |
| Afrit reaches Yeldenne first, has Eindil's crew killed, fights Horos, is wounded by Eindil and escapes | established | Canon Register |
| Afrit abandons Aenor and takes power over an eastern host; not every eastern state submits | established | Canon Register, *War of the Last Crowns* |
| Afrit returns, casts Eindil from a cliff, retakes Aenor and claims universal kingship | established | Canon Register |
| Alleria shoots his eye; Eindil cuts off a finger and takes a ring; allies disable artifacts; Golbran removes the Necklace; Eindil kills Afrit; his death is literal | established (staging details proposed) | *The Last Battle in the Palace* |
| The **Ashen Throne** ending: Afrit rules through worship, bargains, corruption and captured institutions | established ending; mechanics open | *Possible Endings* |

Open in the vault and **not** closed here: whether Afrit is truly a New God; which eastern kings join him willingly; Merovan's fate; Sevrin's fate after Afrit; where Afrit's private refuge is and whether it touches the Nether, the Abyss or the Void; Afrit's relationship with the King of Demons; the original betrayal and the brothers' birth order. Gameplay may offer outcomes for some of these; text never states them as history.

All mechanics, numbers, names of seats, seat holders other than Merovan and Sevrin, and dates below are **proposed**.

## Decisions applied

| Decision | How this spec applies it |
| --- | --- |
| D1 | The Worshipdom starts Light, stance `zin_light_sanctuary`, party "The Faithful of the Deliverer"; its ruler is shown as Aurevan the Deliverer; its description never names Afrit or the Council. It turns Shadow (`zin_shadow_worship`) only on `zin_afrit_revealed`. |
| D2 | Already in the game: the builder names the ruler "Aurevan the Deliverer" and the owner table gives the Worshipdom Light Sanctuary. The politics output (`countries.json`) still records `communism`; the phase 1 fix makes it match ([01_map/03_known_issues.md](../01_map/03_known_issues.md)). |
| D3 | On every path the world learns the name at the flight east, or earlier only through a human player's action (section "The veil"). |
| D4 | Hub-private text may say "your brother"; no text other countries read names Eindil before `zin_eindil_named`; before that he is "the Man from the Ice". |
| D7 | Hub focuses have public and true faces (text secrecy rule 2). |
| N3 | The cliff flag is the journey's `zin_eindil_cast_down`, set by the journey's `zin_eindil.110`; this spec's `zin_afrit.61` only starts that event. |
| N8 | `zin_afrit.31` is the one report of the heir leaving Gala, with the options of both specs; the Glo spec has no report event of its own. |
| N9 | Ambush strength is the journey's formula plus 1 for each term of this spec. |
| N10 | The seat of worship is one person, Ilvane, High Confessor. |
| N12 | One exposure flag, Aenor's `zin_golden_king_plot_exposed`, set only by `zin_aenor_expose_plot`. |
| N13, O7 | This spec owns the Council's people: Ilvane, Corvel and Sevrin hold seats; Kessarion (Corvel's eastern branch) and Ossar (the Reliquary's scholar under Sevrin) are lesser characters; Sevrin is an advisor. The characters spec follows. |
| N14 | The Worshipdom and a crowned Aenor of the Faithful are Light (`zin_light_sanctuary`) until `zin_afrit_revealed`, Shadow after. |
| N15 | The King dies only when `zin_afrit_regicide_ready` (this spec) and Aenor's clock both allow. |
| O2 | This spec owns the palace rolls and `zin_afrit_die`, called once, by this chain; the journey and the war events narrate. |
| O3 | Glo never passes to Afrit. No flag, event or modifier of this spec stands for Afrit holding Glo. |
| O5, S1 | The King of the East rules from the Worshipdom under the cosmetic name "the Dominion of the East"; kneeling courts become its subjects with `zin_autonomy_eastern_client`, not faction members. |
| R4 | Start footholds follow this spec's table (V1), including Fotan, the six Dead Lands freeholds and the Cold Lands. |
| R6 | Afrit's voyage north (60 days) and the restart after a failed palace attempt (180 days) are this spec's timings. |
| E1 | Scripted effects take no parameters: every argument below compiles to the temporary variable `zin_arg_<name>` set just before the call (codes in "Scripted effects"). |
| E2 | Every event sets `timeout_days = 30` and a timed-out event takes its first option. Events that decide a path checkpoint for a human list their non-committal option first and the historical option second (marked "CP" in the event table). |
| V4 | Every fallback date here is written at the standard pace and scaled by `zin_story_pace`. |

## Design

### Three layers

| Layer | In game | Lives in |
| --- | --- | --- |
| **The hub** | The Worshipdom: a three-state temple-state with the Council's decisions, the focus tree and the Council panel | country Worshipdom (original tag) |
| **Afrit's person** | Character `zin_aurevan`. He leads whichever realm the story puts him in: the Worshipdom, then Aenor, then the Worshipdom again as King of the East, then Aenor again | character |
| **The network** | `zin_footholds` (0–5) in every country, the four seats, the veil, the plot, the artifacts | global and country variables |

The hub stays the Worshipdom from start to finish. Afrit's person moves; the Council does not. This keeps one playable country and one focus tree for the whole story.

### The story beats

The established path, with proposed dates from the *Fourth Age Chronology*. "Owner" says which system sets the flag.

| Beat | Flag | Historical | Owner | How it happens | Player can |
| --- | --- | --- | --- | --- | --- |
| The Council's verdict on the King | (plot variable) | 4A 1746, before play | Afrit | Plot starts at 20 | Stay the hand |
| The plot is ready | `zin_afrit_regicide_ready` | Emberleaf 1750 | Afrit | Event `zin_afrit.15` | Choose the night, delay, abort |
| The Golden King dies | `zin_golden_king_dead` | Mistfall 1750 | Aenor | Aenor's clock and `zin_afrit_regicide_ready` | — |
| Aurevan is crowned | `zin_aurevan_crowned` | Longnight 1750 | Afrit | Event `zin_afrit.20` after Aenor's `zin_aenor.210` | Raise a pliant heir instead |
| Afrit learns of his brother | `zin_afrit_knows_brother` | 1752 | Afrit | Event `zin_afrit.31`, timed by footholds | Go north, strike at once, send others, stay |
| The voyage to Yeldenne | `zin_afrit_at_yeldenne` | 1752 | Afrit | `zin_afrit_northern_voyage`, `zin_afrit.32` | — |
| Afrit wounded | `zin_afrit_wounded` | 1753 | Afrit (called by Yeldenne and Glo) | `zin_afrit_wound` | Hide the wound |
| Afrit abandons Aenor; the name is known | `zin_afrit_abandoned_aenor`, `zin_afrit_revealed` | early 1756 | Afrit | Event `zin_afrit.50`; the flight calls `zin_afrit_reveal` | Stand in Parim instead |
| King of the East | `zin_afrit_king_of_east` | 1756 | Afrit | Event `zin_afrit.52` | — |
| The return | `zin_afrit_returned` | early 1758 | Afrit | `zin_afrit_return` | Time it |
| Eindil cast from the cliff | `zin_eindil_cast_down` | 1758 | Eindil's journey (stage 10) | `zin_afrit.61` fires the journey's `zin_eindil.110` | — |
| Lord of all Erdae | `zin_afrit_claims_erdae` | 1758 | Afrit | Event `zin_afrit.62` | — |
| The palace battle | `zin_afrit_lost_*` | 1759 | Afrit (started by the journey's *Enter the Palace*) | Chain `zin_afrit.70`–`.76` | Resist each stage |
| Afrit dies | `zin_afrit_dead` | 1759 | Afrit | `zin_afrit_die` | — |
| The Ashen Throne | `zin_ending_ashen_throne` | never on the historical path | world systems | `zin_afrit_ashen_throne_ready` is true | Reach it |

### Afrit's person

`zin_aurevan` is one character. At the start he leads the Worshipdom. His player-facing name is **Aurevan the Deliverer**, held in the localisation key `zin_name_aurevan` (the lore digest's `zin_name_<key>` pattern), so the owner can swap the proposed name in one place. His portrait is a radiant, veiled figure (image-generated). His leader trait `zin_trait_deliverer` ("Beloved of the Faithful"): `political_power_gain` 0.25, `stability_factor` 0.05.

| Moment | Leads | Worshipdom led by |
| --- | --- | --- |
| Start | Worshipdom | — |
| Crowned (`zin_aurevan_crowned`) | Aenor | `zin_ilvane`, High Confessor, as Keeper of the Hermitage |
| Flight east (`zin_afrit_abandoned_aenor`) | Worshipdom (cosmetic name *The Dominion of the East*) | — |
| Lord of all Erdae (`zin_afrit_claims_erdae`) | Aenor again | `zin_ilvane` |
| Death | — | `zin_ilvane` |

The move uses `remove_country_leader_role` on the old realm, then `recruit_character` and `add_country_leader_role` on the new one. The Linux run checks that `recruit_character` moves an existing character between countries. If it does not, the builder writes a second character `zin_aurevan_king` with the same name, portrait and traits, and the effects swap the two (the id is reserved in the register for that case).

After the reveal he gains a second trait `zin_trait_unmasked` ("The Unmasked God"): `war_support_factor` 0.10, `stability_factor` -0.05. On the reveal `set_character_name` shows him as "Afrit" to everyone (foundation).

**Switching (human hub only).** When Aurevan is crowned, a human hub is offered "Rule from Parim in person": `change_tag_from` moves the player to Aenor. The default option keeps the player in the Worshipdom ([OPEN_QUESTIONS.md](../OPEN_QUESTIONS.md), afrit 5; work proceeds on offering it).

### The four seats

The Council has four seats (proposed structure, vault). Each seat is a global level 0–5. Focuses and decisions raise them. Higher levels make the matching actions cheaper, safer or stronger.

| Seat | Public name (before reveal) | Duty | Holder | Start | Per level |
| --- | --- | --- | --- | ---: | --- |
| **Seals** (`zin_afrit_seat_seals`) | The Chapter of Friends at Court | Royal administration of Aenor | Chancellor Merovan (`zin_merovan`, Aenor's head of government; his seat is secret) | 3 | Council influence drifts up 0.25 a month while it is below 50 + 10 × level; plot +0.5 a month once the verdict is given; Royal Edicts cost 5% less |
| **Censers** (`zin_afrit_seat_censers`) | The Censer Chapter | Worship, temples, the public face | `zin_ilvane`, the High Confessor (N10) | 2 | Veil regenerates 0.4 a month; Open a House costs 4% less |
| **Whispers** (`zin_afrit_seat_whispers`) | The Couriers' Chapter | Foreign agents, couriers, confessors | `zin_corvel`, Master of Couriers; his eastern branch is led by `zin_kessarion`, Kessarion the Envoy | 1 | Open a House succeeds 3% more often; news from the Lands of the Sun comes 5 days sooner; at 4+ the ambush gains 1 strength |
| **Relics** (`zin_afrit_seat_relics`) | The Reliquary Chapter | Recovering and keeping artifacts | `zin_sevrin`, the unending thief; while he stays hidden the Reliquary's scholar `zin_ossar`, Magister Velan Ossar, keeps its work | 2 | Artifact graces +5%; each palace stage -2% for Eindil's side; Draw on the Necklace cooldown 20 days shorter |

Seat holders and their staff are advisors of the Worshipdom, recruited only by it. Ilvane, Corvel, Kessarion and Ossar are hireable from the start. Sevrin is hidden until the focus *A Guest of the Reliquary* (`a_guest_who_does_not_age`). This spec owns all five (N13): Kessarion and Ossar are lesser characters under the Whispers and Relics seats; the characters spec ([02_lore/02_characters.md](../02_lore/02_characters.md)) lists them with the traits it gives them and follows this table. Advisor traits defined here:

| Character | Advisor trait | Modifiers |
| --- | --- | --- |
| `zin_ilvane` | `zin_trait_high_confessor` | `stability_factor` 0.05, `party_popularity_stability_factor` 0.10 |
| `zin_corvel` | `zin_trait_master_of_couriers` | `civilian_intel_factor` 0.10, `intel_network_gain_factor` 0.15 |
| `zin_sevrin` | `zin_trait_unending_thief` | `research_speed_factor` 0.03, `operation_cost` -0.10 |

### The Houses of the First Light and `zin_footholds`

`zin_footholds` (0–5, every country) is the depth of the Deliverer's network inside a country. The Houses of the First Light are its public face: hospitals, grain stores and scribes that most of their people serve sincerely.

| Level | Name | What it means | Effect in the country (dynamic modifier `zin_afrit_houses`, public name "Houses of the First Light") | Gives the hub |
| ---: | --- | --- | --- | --- |
| 0 | None | No house | — | — |
| 1 | Pilgrims | A shrine and pilgrims | `stability_factor` +0.01 | — |
| 2 | A House | A hospital and grain store | `stability_factor` +0.02 | Tithe 0.25 PP a month |
| 3 | Confessors | Priests teach the court | `stability_factor` +0.03, `political_power_gain` -0.03 | Hear Confession |
| 4 | Councillors | Ministers owe the Council favours | `stability_factor` +0.04, `political_power_gain` -0.06 | Call In a Debt; eastern candidate |
| 5 | Throne-bound | The court acts at the Council's wish | `stability_factor` +0.05, `political_power_gain` -0.09 | Raise the Faithful (after the reveal) |

Tithe income is capped at 10 PP a month. Aenor is not counted in tithes; it pays through the Seat of Seals instead (2 PP a month while council influence is 60 or more).

**Caps.** Deepening can never pass a country's cap. Start values may sit above a cap.

| Country | Cap |
| --- | ---: |
| Aenor | 5 |
| Volgan, Demon, Dolon, Nezer (the Southern Dominion), Zol, Yeldenne, and any country with `zin_people_the_dead` | 0 |
| Countries with `zin_people_elves` or `zin_people_sun_elves` (including the Gala Elves and the Magical Forest) | 2 |
| Everyone else | 3; 4 with `zin_worshipdom_cap4`; 5 with `zin_worshipdom_cap5` |
| East Lands countries | +1 with `zin_worshipdom_eastern_chapter`; 5 with `zin_worshipdom_eastern_reserve` |

The zero caps follow the vault: Afrit stays independent of Volgan and Zol, and Horos admits no one ([OPEN_QUESTIONS.md](../OPEN_QUESTIONS.md), afrit 7).

**Start values (proposed).** Set by `zin_afrit.1` from the data file. The builder resolves names to tags. Rows are matched from the top; the first row that matches a country gives its start (R4).

| Countries | Start |
| --- | ---: |
| Aenor | 5 |
| Concord dominions whose people is `men`, except Selen | 2 |
| Concord dominions of other peoples (Kilinti, Hiloron and the like) | 1 |
| Selen | 1 |
| Fotan (Middle Lands, outside the Concord) | 1 |
| Cursed Lands, Bloody Forest | 0 |
| The six Dead Lands freeholds (the Dead Lands countries outside Volgan's Southern Dominion; their cap stays as below, the start sits above it) | 1 |
| Every Cold Lands country except Yeldenne | 1 |
| Alerhia, Erco, Plutondo, Miaed, Noris, Stabilo | 3 |
| Other East Lands countries (including the South Lands desert band) | 2 |
| Lerendor, Dondor | 2 |
| Other countries of men in the North, West, Cold and Dark Lands, Triton's Islands, the Islands of the South, the Lands of the Sun, and Mirolon | 1 |
| Orc, goblin and troll realms of the Dark Lands | 0 |
| Elven and Sunhot elven realms (Magical Lands, Lands of the Sun, Gala Elves) | 1 |
| Capped-at-0 countries | 0 |

These numbers say how deep the network is. They do not say which eastern kings will follow Afrit; that stays open in the vault and is decided by play.

**Watchfulness.** Each target has a watchfulness score from 0 to 8, computed by `zin_afrit_compute_watch` into the temp variable `zin_afrit_watch`:

| Condition | Watch |
| --- | ---: |
| Base | 1 |
| Ruling ideology Light (not the hub, not a realm Afrit rules) | +2 |
| Selen or Mirolon | +3 |
| `zin_people_elves` or `zin_people_sun_elves` | +2 |
| Has `zin_lost_cause_member` | +1 |
| Has `zin_afrit_suspicious` | +2 |
| Ruling ideology Wild | -1 |
| Already at 3 or more footholds | -2 |

**Deepening.** The targeted decision *Open a House in [country]* (`zin_afrit_open_house`) costs 25 + 15 × current level PP (minus the Censers discount) and takes 60 days. On completion it rolls:

- Success chance: 85 - 8 × watch + 3 × Whispers, clamped 10–95%.
- Success: footholds +1; veil -(watch / 2, rounded down).
- Failure: event `zin_afrit.4` (Suspicion in [country]); veil -(2 + watch); the target gets `zin_afrit_suspicious` for 730 days.

**Purges.** Any country with footholds 1 or more, other than the hub and a realm Afrit rules, may take *Close the Houses* (`zin_afrit_close_houses`, in this spec's category `zin_afrit_cat_houses`, public name "The Houses of the First Light") when it has `zin_afrit_suspicious` or once `zin_afrit_revealed` is set. Cost 50 PP. It calls `zin_afrit_purge_houses`: footholds to 0 (or -1 and never below 2 if the hub has `zin_worshipdom_houses_fortified`), stability -0.05, flag `zin_afrit_houses_purged` for 365 days (no deepening), hub veil -5 while secret. Event `zin_afrit.5` tells the hub privately.

### The veil: the secret

`zin_afrit_veil` (global, 0–100, start 80) measures how well the secret holds. While `zin_afrit_revealed` is not set the world knows only the Deliverer.

| Source | Veil |
| --- | ---: |
| Monthly while secret | +0.4 × Censers |
| Hub focuses of worship, charity and discretion | +2 to +15 (see the tree) |
| Open a House succeeds / fails | -(watch / 2) / -(2 + watch) |
| Silence a Dissenter | +8, or -10 if botched (25%) |
| Draw on the Necklace | -10 |
| The thief caught | -10 |
| *Silence the Tasters* | -3 |
| *Silence the Claimants* | -5 |
| Afrit wounded at Yeldenne (Horos named him; Eindil knows) | -15 |
| Each warning Eindil gives at a Middle Lands court (the journey calls `zin_afrit_add_veil`) | -8, or -4 with `zin_afrit_impostor_denounced` |
| The Lost Cause follows the poisoner's coin (Aenor calls it) | -10 |
| A purge while secret | -5 |
| Hub has the spirit *The Radiant Face* | all losses halved |

**When the world learns the name (D3).** `zin_afrit_add_veil` never lowers the veil below 1 before `zin_afrit_abandoned_aenor`, unless the loss comes from a human player's action (the effect's `ROOT` country has `is_ai = no`, or the hub is human and chooses a risky action). So on every path the AI alone never reveals Afrit before his flight; a player who exposes him can.

Thresholds:

- **Below 30:** event `zin_afrit.41` (The Veil Thins). Every Light country except the hub and a realm Afrit rules counts as suspicious: *Close the Houses* becomes available to it.
- **At 0:** `zin_afrit_reveal`.

**The reveal** (`zin_afrit_reveal`, called once): sets `zin_afrit_revealed`; fires `zin_afrit.42` to the hub and the public news event `zin_afrit.43`; adds `zin_trait_unmasked`; switches the Worshipdom to Shadow with `zin_politics_set_stance` (`zin_shadow_worship`) and, if Afrit rules Aenor, Aenor too (foundation, "How politics follows the story"); every Light country gets `zin_afrit.45` (The Houses Under Suspicion); every Aenor realm gets the events spec's `zin_reign.85` 3 days later; `zin_world_add_gathering_dark` +5. It is called by the flight east, by the focus *Cast Off the Mask* (voluntary, human hub or rule `ASHEN`), by world systems when the Ashen Throne is reached first, and by the veil at 0.

**Unmasked too soon.** If the reveal comes before `zin_aurevan_crowned`, `zin_afrit_reveal` also sets `zin_afrit_unmasked_early` and fires `zin_afrit.44`:

- the hub gets the idea `zin_afrit_unmasked` for 365 days;
- Aenor: council influence -40; `zin_aenor_expose_plot` runs if the King lives and the plot is not exposed;
- every country: footholds -1; Light countries a further -1;
- `zin_world_add_gathering_dark` +10.

This is the catastrophe the hub player plays to avoid.

**Text secrecy rules.** These implement the contract's rule on the secret.

1. Every text a non-hub player can read before `zin_afrit_revealed` must not name Afrit, call the Deliverer a demon, or describe the plot, the Council or the artifacts. This covers focus names and descriptions, spirit names, decision names visible to others, news events, opinion modifiers, dynamic modifiers, party names, character names, game-rule texts and the bookmark text.
2. Hub focuses carry two faces: a public name and a true name. Their localisation key calls scripted localisation (`zin_wsd_<key>_name`, `zin_wsd_<key>_desc`) that returns the true text only when the global flag `zin_afrit_revealed` is set. A global flag is the same for every viewer, so this is safe. The Linux run checks that focus names evaluate scripted localisation; if they do not, the compiler writes the public faces only, for the whole game.
3. Secret effects are never shown as tooltips to other players. All `zin_afrit_*` scripted effects wrap their work in `hidden_effect` and show one mask-safe `custom_effect_tooltip` (for example "The faithful give gladly."). Focus effects that fire private events are wrapped the same way, so the event title never shows in a focus tooltip. Locked focuses, their tooltips and spirit names are readable by anyone from the first day, so they follow these rules too.
4. The truth reaches the hub through private events (`zin_afrit.*` and `zin_worshipdom.*` events fired only to the hub) and the Council panel. Those may name Afrit.
5. The decision category `zin_afrit_council` is visible only to the hub (`zin_afrit_is_hub`). Its public name is "The Hermitage Chapter"; after the reveal "The Hidden Council".
6. Scripted localisation `zin_loc_deliverer` returns the public name before the reveal and "Afrit" after it. Shared texts use it (the lore digest's `zin_loc_<concept>` pattern; it is the only scripted localisation for the name, N16). Hub-private texts use plain keys.
7. The compiler's secrecy check treats `*_true` keys reached only through rule 2 as post-reveal text.
8. Scripted trigger `zin_afrit_secret_kept` (true while `zin_afrit_revealed` is unset) is the one test every two-face text and effect uses (N16).

### Afrit's artifacts

`zin_afrit_artifacts` (global, 0–4) counts the artifacts Afrit holds. It starts at 4: the Necklace (stolen 4A 1611, proposed date) and three lesser artifacts gathered 4A 1611–1700 (proposed; [OPEN_QUESTIONS.md](../OPEN_QUESTIONS.md), afrit 3). It never rises above 4. It falls only in the palace battle.

Each artifact has a lost flag and an attuned flag. Attunement is a proposed mechanic for how much of an artifact's power the Seat of Relics has woken; it does not change what Afrit holds.

| Artifact | Status | Lost flag | Attuned flag | Graces at full strength |
| --- | --- | --- | --- | --- |
| Necklace of the Abyss | established | `zin_afrit_lost_necklace` | `zin_afrit_attuned_necklace` | `political_power_factor` 0.15, `army_morale_factor` 0.10; ×1.5 when the realm is Aenor (strongest in the prepared centre of the Middle Kingdom) |
| Ring of Doors | ring established, name and power proposed | `zin_afrit_lost_ring` | `zin_afrit_attuned_ring` | `own_operative_capture_chance_factor` -0.30, `army_retreat_speed_factor` 0.10; enables escape options |
| Crown of Witnesses | proposed | `zin_afrit_lost_crown` | `zin_afrit_attuned_crown` | `stability_factor` 0.08, `war_support_factor` 0.05; ×2 in Aenor with `zin_worshipdom_oaths_renewed` |
| Bracelet of the First Seal | proposed | `zin_afrit_lost_bracelet` | `zin_afrit_attuned_bracelet` | `army_core_defence_factor` 0.08, `defensive_war_stability_factor` 0.10 |

The graces are one dynamic modifier, `zin_afrit_graces`, on the realm `zin_aurevan` leads. Its public name is "Graces of the Deliverer". `zin_afrit_refresh_graces` recomputes its variables: each held artifact contributes 50% of its graces unattuned and 100% attuned, times (0.8 + 0.05 × Relics). It is refreshed monthly, on every move of Afrit, and on every change of an artifact flag.

**Draw on the Necklace** (`zin_afrit_draw_on_necklace`): 100 PP; the realm Afrit leads gets the idea `zin_afrit_necklace_drawn` for 30 days (`army_attack_factor` 0.10, `army_defence_factor` 0.10, `political_power_gain` 1); veil -10 while secret; Gathering Dark +2; cooldown 180 - 20 × Relics days.

**Glo.** Afrit wants Glo (established). The hall of Horos is owned by the Yeldenne and Glo spec. Glo never passes to Afrit on any path (O3): he can kill Horos, seal Glo or, through a defiled seal, dim it, but he never holds or uses it. Glo is never counted as an artifact and gives the hub no grace.

### The Golden King's murder, from Afrit's side

The King dies when the Council strikes (`zin_afrit_regicide_ready`, this spec) and Aenor's death clock gives the chance (Aenor spec, section 5). This spec decides when the Council is ready; Aenor's clock decides the day.

`zin_afrit_regicide_plot` (global, 0–100) is the Council's preparation. It starts at 20 (preparations began in 4A 1746, proposed). It rises by 0.5 × Seals a month after the focus *Prayers for the King* (the verdict) and through the Seals branch.

**The instrument** is chosen in `zin_afrit.11`:

| Instrument | Plot bonus | Risk | Notes |
| --- | --- | --- | --- |
| The physician's draught (the Houses' physicians at court) | +10 with *Remedies of the Royal Physicians* | Low: veil -2 at the end | Historical AI choice |
| A hunting accident (the Seat of Whispers) | +15 at once | Medium: 20% chance of `zin_afrit.13` | Faster |
| The fever-blessing (the Seat of Censers) | +5; the plot also gains 0.5 a month | Very low | Slow and safe |

The instrument is stored as the country flag `zin_worshipdom_instrument_physician`, `_hunt` or `_fever`. The text never says how the King dies in public; Aenor's death event says he died, not why.

**Complications.** While the plot is between 40 and 90, every 90 days there is a 15% chance (halved with `zin_afrit_lost_cause_watched`) of one of:

- `zin_afrit.12` A Taster Falls Ill: silence the taster (veil -5) or pause (plot -10).
- `zin_afrit.13` The Lost Cause Asks Questions: bribe the inquiry (75 PP), discredit the scholar (veil -5), or let it run (Aenor's `zin_aenor_inquiry_bonus` +15).

**Ready.** At plot 100, `zin_afrit.14` tells the hub privately. The focus *The Mistfall Vigil* (or, for the AI, the event alone) fires `zin_afrit.15` (Choose the Night; checkpoint 05, so the non-committal option is first, E2):

| Option | Effect |
| --- | --- |
| Not this year | nothing for 365 days; the plot stays at 100 |
| At Mistfall (historical) | `zin_afrit_ready_regicide` runs on 15 Emberleaf of the current year (the month before Mistfall), or of the next year if that day has passed |
| At the First Chance | `zin_afrit_ready_regicide` now and `zin_aenor_hasten_death_clock` 180 (the clock's whole allowance); veil -10 |
| Stay the hand | plot to 0; sets `zin_worshipdom_stay_hand`; opens the Kingdom Behind the Throne route |

`zin_afrit_ready_regicide` sets `zin_afrit_regicide_ready`. Aenor's pulse then fires the death on the day its clock allows, never before Aenor's floor date.

**Exposure.** If the veil falls below 15 while the plot is above 0 and the King lives, `zin_afrit.16` fires and calls Aenor's `zin_aenor_expose_plot`, the one way the plot becomes known (Aenor's King's Health decisions call it too). Its reaction here is `zin_afrit_plot_exposed`: the plot resets to 0, veil -30 (while secret), the hub gets `zin_afrit.16` privately, and every country gets the public news `zin_afrit.17`, which says that "servants of the temples" were accused of plotting against the King. It does not name Afrit. The flag is Aenor's `zin_golden_king_plot_exposed`, the only exposure flag (N12). A Golden King who survives is a proposed outcome, not history.

**Historical fallback.** If `zin_rule_afrit` resolves to `HISTORICAL`, `zin_rule_golden_king_death` is `DYNAMIC` or `HISTORICAL`, and `zin_afrit_regicide_ready` is not set on 15 Emberleaf 4A 1750 (`zin_afrit_date_regicide_fallback`) while the plot is not exposed, the monthly event sets it. Aenor's clock also sets it if the Worshipdom no longer exists. This keeps the established death in Mistfall 4A 1750.

### The crowning

When Aenor's `zin_aenor.210` gives the seals to the Faithful (or a Faithful breakaway wins its civil war), the hub gets `zin_afrit.20` (The Seals Pass to the Deliverer; checkpoint 06, E2). If the hub does not exist, Aenor's spec lets Merovan rule as Lord Protector.

| Option | Condition | Effect |
| --- | --- | --- |
| Let the seals wait | not shown with a commit flag; AI weight 0 | Merovan holds the seals; `zin_afrit.20` fires again 30 days later while checkpoint 06's latest date has not passed |
| Take the crown (historical) | AI default; forced with `zin_worshipdom_commit_crown` | `zin_afrit_crown_aurevan` |
| Raise a pliant heir | forced with `zin_worshipdom_commit_heir`; AI never under `HISTORICAL` | `zin_afrit_raise_pliant_heir`: sets `zin_afrit_kingdom_behind_throne` and fires the public news `zin_afrit.23`, whose immediate block crowns Prince Eronel (`recruit_character` and `promote_character` on `zin_eronel` in Aenor, country flag `zin_reign_eronel_crowned`) and fires the events spec's `zin_reign.65` 2 days later |
| Rule from Parim in person | human hub only | as Take the crown, then `change_tag_from` to Aenor |

`zin_afrit_crown_aurevan`:

- sets `zin_aurevan_crowned`;
- moves `zin_aurevan` to Aenor as country leader; `zin_ilvane` leads the Worshipdom;
- Aenor: government Light, stance `zin_light_sanctuary` while secret (Aenor spec, section 6); council influence +10 (+10 more with `zin_worshipdom_proclamation_ready`), stability +0.10 with that flag;
- refreshes the graces (now in Aenor, so the Necklace counts ×1.5);
- fires the public news `zin_afrit.21`: "The King is dead. The council and the temples have laid the crown before [zin_loc_deliverer], who has guarded Aenor since the fall of Elzon. He is King of Aenor, First of His Name, and New God of Men." (mask-safe; the title is established, its wording partly proposed);
- fires `zin_afrit.22` (Dissenters at Court) 30 days later: silence them (veil -5, Gathering Dark +2, council influence +5) or spare them (Aenor's camps other than the Faithful +5 each);
- ends by calling the events spec's hook `zin_reign_on_crowning`.

**Royal Edicts.** While Aurevan rules Aenor, the hub may steer Aenor through decisions (Aenor stays its own country):

| Decision | Requires | Cost | Effect on Aenor |
| --- | --- | ---: | --- |
| `zin_afrit_edict_of_arms` | `zin_worshipdom_edicts_of_arms` | 75 PP | Idea `zin_afrit_edict_of_arms` 180 days: `army_org_factor` 0.05, `training_time_army_factor` -0.10 |
| `zin_afrit_edict_of_the_faithful` | — | 50 PP | Stability +0.05; footholds +1 in two Concord dominions |
| `zin_afrit_edict_of_the_temple_treasury` | — | 0 PP | Aenor -100 PP, hub +100 PP; veil -3 while secret; cooldown 180 days |
| `zin_afrit_edict_of_summons` | — | 75 PP | Concord loyalty +5 in every dominion (`zin_aenor_add_concord_loyalty_all`) |

With `zin_worshipdom_edicts_unc` (the Kingdom Behind the Throne) the same edicts are usable without the crown at double cost. Edict costs fall 5% per Seals level.

### The Yeldenne expedition

1. **The news (N8).** After `zin_eindil_named`, `zin_afrit.31` (Word from the Lands of the Sun) fires to the hub. Delay: 30 days if the Gala Elves have footholds 1 or more, else 120 days; minus 5 days per Whispers level; minus 15 days each for `zin_worshipdom_western_ears` and `zin_worshipdom_early_warning`; plus 60 days with the Gala Elves' `zin_gala_word_kept`; never under 10 days. It sets `zin_afrit_knows_brother`. The private text may say "your brother"; the hub alone reads it. It is the only report of the heir leaving Gala (N8). It decides checkpoint 09 for a human hub, so the non-committal option is first (E2). Options:

| Option | Effect | AI |
| --- | --- | --- |
| Stay in Parim | nothing; no ambush; Eindil meets Horos alone | 10% |
| Go north and lie in wait (historical) | `zin_afrit_northern_voyage` | historical: always; otherwise 60% |
| Go north and take Glo at once | `zin_afrit_northern_voyage`, and the global flag `zin_afrit_hall_at_once`: on arrival the party enters the hall at once (the Glo spec's case C) | 20% |
| Send others | the global flag `zin_afrit_sent_others`: the Council's agents wait for the crew (ambush term -1); Afrit stays; the hall is resolved without him | 10% |

2. **The voyage** (`zin_afrit_northern_voyage`, 100 PP) fires `zin_afrit.32` (The Northern Voyage), which sets `zin_aurevan_went_north` (its one setter) and, if Aurevan rules Aenor, fires the events spec's `zin_reign.81` to Aenor. If Aurevan rules Aenor, Merovan governs while Afrit is away; with `zin_worshipdom_merovan_charge` Aenor loses no stability, otherwise Aenor gets stability -0.05 until he returns. The voyage takes 60 days, 30 with `zin_worshipdom_cold_maps`. On arrival `zin_afrit_at_yeldenne` is set and the Glo spec takes over: its `zin_glo.11` (The Approach to Yeldenne) and the wait at the approach, or the strike with `zin_afrit_hall_at_once`.
3. **The ambush (N9).** When the heir lands while Afrit's party (or, with "Send others", the Council's agents) waits, the journey's landfall (`zin_eindil.70`) fires the hub's private `zin_afrit.33` (The Ambush on the Shore; checkpoint 09, E2): "Let them land" (first: no ambush; Eindil arrives with his crew) or "Spare none" (historical; the journey's `zin_eindil.71` resolves the ambush). The strength is the journey's formula (base 5 and its terms) plus 1 for each of this spec's terms: `zin_worshipdom_ships_ready`, `zin_worshipdom_hunters`, Whispers ≥ 4; minus 1 with `zin_afrit_sent_others`.
4. **The hall** is owned by the Yeldenne and Glo spec. On the historical path it sets `zin_horos_dead` and `zin_glo_with_eindil` and calls `zin_afrit_wound`.
5. **The return** (`zin_afrit.34`): `zin_afrit_wound` (optional `days`, 365 by default) sets `zin_afrit_wounded`, adds the idea `zin_afrit_deliverer_rests` (public name "The Deliverer Rests": `political_power_factor` -0.15, `stability_factor` -0.05) for that many days to the realm Afrit leads, and veil -15. `zin_afrit_at_yeldenne` stays set (it records that he went). The wound flag is `zin_afrit_wounded`, the only one for this moment. `zin_afrit.34` fires the events spec's `zin_reign.82` to Aenor if Aurevan rules it and `zin_afrit_secret_kept` holds.

"Send others" and "Stay in Parim" never reveal Afrit through Horos, so the veil loss in step 5 does not happen.

### The flight east and the King of the East

**Pressure.** `zin_afrit.50` (Aenor Cannot Hold) fires to the hub when Aurevan rules Aenor, `zin_war_of_last_crowns` is set, and at least three of `zin_western_crossing`, `zin_leren_withdrawal`, `zin_volgan_marches`, `zin_zol_rising` and "Aenor at war with an East Lands country" (`zin_east_turns_west`) hold. Under the historical rule it fires on 1 Thaw 4A 1756 (`zin_afrit_date_flight`) at the latest. It decides checkpoint 17 for a human hub, so the non-committal option is first (E2).

| Option | Condition | Effect |
| --- | --- | --- |
| Hold for now | AI weight 0 | nothing; `zin_afrit.50` fires again 30 days later while the pressure holds and checkpoint 17's latest date has not passed |
| Go east (historical) | at least 2 eastern candidates | `zin_afrit_flee_east` |
| Flee to the hermitage | fewer than 2 candidates | `zin_afrit_flee_east` without a proclamation |
| Stand in Parim | not under `HISTORICAL` | sets `zin_afrit_stand_in_parim`; Afrit stays king of Aenor |

An **eastern candidate** (`zin_afrit_eastern_candidate`) is an East Lands country (`zin_region_east_lands`, which includes the South Lands desert band; owner's short list 6, proposal) with footholds 4 or more, or 3 or more with `zin_east_pledged`; not at war with the hub, not Volgan's and not a subject of Aenor.

`zin_afrit_flee_east`:

- calls `zin_afrit_reveal` if the name is still secret (D3: this is when the world learns it);
- sets `zin_afrit_abandoned_aenor`;
- moves `zin_aurevan` back to the Worshipdom as leader; Aenor's throne is empty and Aenor's `zin_aenor.300`, which fires on `zin_afrit_abandoned_aenor` (so also on the flight to the hermitage), hands it to the Captains' Regency;
- fires `zin_afrit.53` (The Chancellor's Choice): Merovan follows Afrit east, or stays in Parim. Both are offered and weighted 50/50 for the AI because the vault leaves his fate open;
- fires `zin_afrit.51` to every eastern candidate;
- 30 days later fires `zin_afrit.52` if at least 2 candidates knelt.

**The Deliverer Comes East** (`zin_afrit.51`, to each candidate; checkpoint 17, so a human court sees "Refuse him" first, E2): "Kneel to the King of the East" sets the country flag `zin_afrit_eastern_client` and calls the eastern spec's `zin_east_prepare_kneel` first; then, if the court is no one's subject, the hub makes it a subject with `set_autonomy` (`autonomy_state = zin_autonomy_eastern_client`, diplomacy spec; S1). A court that is already another crown's subject stays so and only gives the hub military access (eastern spec). "Refuse him" sets `zin_afrit_refused_east`. AI acceptance (proposed):

| Factor | Chance |
| --- | ---: |
| Base | 20 × footholds - 40 (20% at 3, 40% at 4, 60% at 5) |
| `zin_east_kneel_bias` (eastern spec) | + bias ÷ 2 |
| Hub has `zin_worshipdom_roads_east` | +20 |
| Ruling ideology Dominion | +15 |
| Ruling ideology Light | -20 |
| Its rival has knelt (Noris and Stabilo are rivals) | -30 |
| Second embassy (*A Court in the East*) | +25 |
| Clamp | 5–95 |

Under the historical rule the two AI candidates with the highest footholds kneel automatically (a human court always chooses) (ties by `zin_east_kneel_bias`, then states, then tag). No text names them as history; the vault leaves open which kings joined ([OPEN_QUESTIONS.md](../OPEN_QUESTIONS.md), owner's short list 11).

**King of the East** (`zin_afrit_proclaim_king_of_east`, from `zin_afrit.52`): sets `zin_afrit_king_of_east`; the Worshipdom takes the cosmetic name *The Dominion of the East* (`set_cosmetic_tag` `zin_cosmetic_worshipdom_east`; S1) and Aurevan's title becomes King of the East. The clients are its subjects; there is no faction. Public news: "In the East, kings have knelt to [zin_loc_deliverer] and named him King of the East. Not every eastern crown agrees."

**The Host of the East** (`zin_afrit_raise_eastern_host`, arg `divisions`): creates that many divisions of the template *Host of the East* (the warfare spec's template; vanilla infantry until that phase) for the hub, in the capital of the client with the most states, plus one division for every two clients with the eastern spec's country flag `zin_east_sent_levies` (set by its `zin_east.52`). Each client without that flag loses 2,000 manpower per division, shared equally. Gathering Dark +1 per call.

### The return and Parim

`zin_afrit_return` (the focus *The Return from the East*, or for the AI the event `zin_afrit.60`):

- available when `zin_afrit_king_of_east` and (`zin_volgan_body_destroyed` or `zin_zol_withdrawn` or on or after 1 Deepwinter 4A 1758, `zin_afrit_date_return_open`);
- under the historical rule it fires 120 days after both `zin_volgan_body_destroyed` and `zin_zol_withdrawn`, or on 1 Ironfrost 4A 1758 (`zin_afrit_date_return`), whichever is first;
- sets `zin_afrit_returned` (the one flag for the return; the journey and the war events read it); the hub declares war on the controller of Parim (if not its subject) and on the country that has `zin_eindil`; its subjects join; Gathering Dark +5.

**Brother against brother** (`zin_afrit.61`, hub, private): fires when `zin_afrit_returned` is set, the hub is at war with the country that has `zin_eindil`, and the hub's side controls at least one Middle Lands state; or through the focus. It fires the journey's `zin_eindil.110` *The Cliff* (stage 10), which sets `zin_eindil_cast_down` (N3) and owns the cliff, Eindil's wounds and his survival. This spec sets no flag of its own for the cliff.

**Lord of all Erdae** (`zin_afrit.62`): fires when `zin_eindil_cast_down` is set and `zin_afrit_holds_parim` is true. `zin_afrit_retake_aenor`: if Aenor exists, it makes white peace with the hub, `zin_aurevan` becomes its leader again, and it gives and receives military access with the hub; if Aenor no longer exists, the hub annexes the Middle Lands states its side controls. Sets `zin_afrit_claims_erdae`. Public news: the proclamation of kingship over all Erdae, "larger than the lands he holds". Under the historical rule, if the hub's side does not hold Parim by 1 Fallowing 4A 1758 (`zin_afrit_date_parim`), `set_state_controller` gives Parim to the hub's side and the event fires.

### The palace and Afrit's death

The journey owns the heir's side of the palace (stage 11: the decisions `zin_eindil_palace` and the story events `zin_eindil.120`–`.127`). This spec owns Afrit's side: the chain `zin_afrit.70`–`.76`, the artifacts, the hub's defences and the rolls.

The journey's decision *Enter the Palace* calls `zin_afrit_begin_palace_battle`. It needs `zin_afrit_claims_erdae` or `zin_afrit_stand_in_parim`, and not `zin_afrit_dead`; it fires the hub's private `zin_afrit.70` (The Palace Wards), which starts stage 1. The four stages run in established order. In each, the hub picks a defence and the event rolls Eindil's side's success. Each success calls `zin_afrit_lose_artifact` and fires the journey's matching event to the Host; the next stage follows.

| Stage | Event | Artifact | Base | Modifiers for Eindil's side | On success, the journey's |
| --- | --- | --- | ---: | --- | --- |
| 1 The Eye and the Ring | `zin_afrit.71` | Ring of Doors | 60 | +20 if `zin_alleria` lives; -10 with `zin_worshipdom_palace_wards`; -5 with `zin_worshipdom_palace_wards_2`; -10 if the ring is attuned and Relics is 5 | `zin_eindil.120` An Arrow in the Eye |
| 2 The Seals of the Crown | `zin_afrit.72` | Crown of Witnesses | 55 | +15 if Aenor council influence is below 50; -10 with `zin_worshipdom_oaths_renewed`; wards as above | — (stage 3 follows) |
| 3 The Bracelet | `zin_afrit.73` | Bracelet of the First Seal | 55 | +15 with `zin_glo_with_eindil`; wards as above | `zin_eindil.121` The Seals Broken |
| 4 The Necklace | `zin_afrit.74` | Necklace of the Abyss | 50 | +30 with Golbran; -10 if the Necklace is attuned and Relics is 5; wards as above | `zin_eindil.123` Golbran's Last Working |

Stage 4 cannot succeed unless Golbran is alive and with Eindil (the journey's `zin_eindil_golbran_joined`, not `zin_golbran_dead`). All stages: -2 × Relics. Clamp 5–95. Under the historical rule every stage succeeds.

Hub defences (one per stage, each once): "Burn the reserves" (150 PP, -10), "Draw on the Necklace" (only before stage 4, Gathering Dark +3, -10), "Through the doors" (stage 1 only, if the ring is attuned: Afrit escapes; the stage fails).

- **Success of stage 4:** `zin_afrit.75` (public news, The False God Falls), whose immediate block calls `zin_afrit_die` and then fires the journey's `zin_eindil.124` The Death of a False God. This is the only call of `zin_afrit_die` (O2); the journey and the war events only narrate it.
- **Failure of any stage:** the chain stops; `zin_afrit.76` (The Palace Holds) sets `zin_afrit_palace_held` and fires the journey's `zin_eindil.127`; *Enter the Palace* can start the chain again 180 days after the failure (R6; the decision checks `zin_afrit_palace_held` with `days = 180`).

`zin_afrit_die`: sets `zin_afrit_dead`; removes `zin_aurevan` (`kill_country_leader` in his realm; `zin_ilvane` leads the Worshipdom); removes `zin_afrit_graces`; clears the cosmetic name; removes Sevrin from the advisor roster with the tooltip "His fate is unknown"; the Worshipdom AI seeks peace with every enemy that does not occupy its core states. `zin_afrit_die` releases no eastern client: once `zin_afrit_dead` is set, the eastern spec's `zin_east_after_the_king` (`zin_east.60`) releases every client still subject to the Worshipdom (`end_puppet`) and decides what follows in the East. From then on footholds decay: each month 3 countries lose 1 (deterministic order by footholds then tag). The journey owns Golbran's death, the Necklace on Eindil's neck and the coronation (which calls Aenor's `zin_aenor_crown_eindil`). After Afrit's death the Worshipdom goes quiet: it keeps its tree's remaining focuses and no new story ([OPEN_QUESTIONS.md](../OPEN_QUESTIONS.md), afrit 6).

### The Ashen Throne

`zin_afrit_ashen_throne_ready` is true when all of these hold:

- not `zin_afrit_dead`, not `zin_eindil_crowned`, not `zin_afrit_lost_necklace`;
- `zin_afrit_holds_parim`;
- at least 12 countries (Aenor counted) have footholds 4 or more;
- and one of: (a) `zin_afrit_palace_held` and on or after 1 Deepwinter 4A 1759; (b) `zin_afrit_claims_erdae` and on or after 1 Deepwinter 4A 1760; (c) `zin_afrit_stand_in_parim`, `zin_war_of_last_crowns` and on or after 1 Deepwinter 4A 1760 (`zin_afrit_date_ashen_a`, `zin_afrit_date_ashen_b`).

`zin_afrit_holds_parim` is true when Parim's state (`zin_is_site_parim`) is controlled by the realm `zin_aurevan` leads, by the Worshipdom, or by a subject of the Worshipdom.

World systems ([03_gameplay/05_world_tension_and_endings.md](../03_gameplay/05_world_tension_and_endings.md)) set `zin_ending_ashen_throne` through `zin_world_reach_ending` when the trigger is true, either through the focus *The Ashen Throne* or its own monthly check; it calls `zin_afrit_reveal` first if the name is still secret. The ending's private event is `zin_afrit.80`.

### Alternative routes

None of these is canon. Each is a gameplay outcome.

| Route | How | Result |
| --- | --- | --- |
| The Kingdom Behind the Throne | *Pray for Patience* → *Long Live the Golden King*, or *A Pliant Heir* at the crowning | Afrit never takes the crown; the Council rules through the Golden King or Prince Eronel; counts toward the proposed outcome of a surviving Golden Court |
| The plot exposed | Veil below 15 during the plot, or Aenor's investigation | The Golden King turns on the Council (Aenor spec) |
| Unmasked too soon | A human action drives the veil to 0 before the crowning | Penalties above; the Unmasked branch opens |
| Stand in Parim | *Parim Shall Not Fall*, or option in `zin_afrit.50` | Afrit never flees; Ashen Throne path (c) |
| Cast off the mask | Voluntary reveal after the crowning with all four artifacts and Censers 4+ | Fear and open worship; Ashen Throne path |
| No eastern reserve | Fewer than 2 candidates at the flight | Afrit flees only to the hermitage; the return is weak |
| Send others to Yeldenne | Option in `zin_afrit.31` | Afrit is not wounded and not named by Horos |
| The palace holds | A failed palace stage | Ashen Throne path (a) |

### Playing the Worshipdom without revealing too early

The hub player plays a long game with a budget: the veil.

**What the player sees.** The focus tree shows public faces. The Council panel ([07_interface/01_interface.md](../07_interface/01_interface.md)) shows the veil, the plot, the four seats, the artifacts and the footholds map mode. Private events explain each step in plain words.

**Safe actions** (raise or keep the veil): charity focuses, hymns, miracles, the Ledger of Debts, Renewing the Thousand Oaths, the Radiant Face, Patrons of the Lost Cause, deepening footholds in Wild and already-captured courts.

**Risky actions** (cost veil): opening houses in watchful courts (Selen, Mirolon, elves, Light countries), drawing on the Necklace, sending the thief, a botched silencing, a fast instrument, striking at the first chance, silencing the claimants.

**Milestones the player should aim for** (historical pace):

| By | Aim |
| --- | --- |
| End of 4A 1748 | Verdict given; instrument chosen; veil 75+ |
| Mistfall 4A 1750 | Plot 100; temples ready; crown committed; veil 60+ |
| 4A 1752 | Footholds 4+ in at least two East Lands kingdoms; footholds in the Lands of the Sun; the Necklace attuned |
| 4A 1753 | The voyage to Yeldenne before Eindil arrives |
| 4A 1754–1755 | Veil kept above 0 until the war; *Denounce the Impostor*; *Roads to the Dawn* |
| 4A 1756 onward | Choose: go east (historical) or stand in Parim (Ashen gamble) |

**What goes wrong if revealed early:** see "Unmasked too soon". The tooltip of every risky decision shows the veil cost and the current veil, in the hub's private decision view.

**No war at the start.** The hub cannot declare war, justify war goals or start civil wars before `zin_war_of_last_crowns` or `zin_afrit_revealed`. Its war branches unlock from story flags. Its focuses give no war goals before those flags.

### Interaction with other systems

| System | Reads from this spec | Calls or sets for this spec |
| --- | --- | --- |
| Aenor | `zin_afrit_regicide_ready`, `zin_aurevan_crowned`, `zin_afrit_kingdom_behind_throne`, `zin_afrit_lost_cause_watched`, `zin_afrit_abandoned_aenor`, `zin_afrit_king_of_east` | `zin_golden_king_dead`, `zin_golden_king_plot_exposed`; calls `zin_afrit_ready_regicide`, `zin_afrit_crown_aurevan` (through `zin_afrit.20`), `zin_afrit_plot_exposed`, `zin_afrit_add_veil`; owns `zin_council_influence`, `zin_court_corruption`, `zin_concord_loyalty` |
| Eindil's journey | `zin_afrit_knows_brother`, `zin_aurevan_went_north`, `zin_afrit_at_yeldenne`, `zin_afrit_sent_others`, the ambush terms, `zin_afrit_scholars_bought`, `zin_afrit_impostor_denounced`, `zin_afrit_returned`, `zin_afrit_claims_erdae`, `zin_afrit_stand_in_parim`, `zin_afrit_palace_held`, `zin_afrit_lost_*` | `zin_eindil_cast_down` (its `zin_eindil.110`, fired by `zin_afrit.61`); calls `zin_afrit_add_veil` on each warning and `zin_afrit_begin_palace_battle`; its *The Impostor* sets `zin_afrit_impostor_denounced`; its landfall fires `zin_afrit.33`; its `zin_eindil_start_hunt` is called by `zin_afrit.40` |
| Events ([06_events/01](../06_events/01_golden_king_and_succession.md)) | `zin_aurevan_crowned`, `zin_afrit_rules_here`, `zin_afrit_secret_kept` | `zin_reign_on_crowning` (called at the end of the crowning); this spec fires `zin_reign.65` (from `.23`), `.81` (from `.32`), `.82` (from `.34`), `.83` (from `.40` *Denounce him*) and `.85` (from the reveal); `zin_reign.44` sets `zin_afrit_scholars_bought` |
| Yeldenne and Glo | `zin_afrit_at_yeldenne`, `zin_afrit_hall_at_once`, `zin_afrit_sent_others`, `zin_afrit_artifacts`, `zin_afrit_is_hub`, `zin_afrit_rules_here` | sets `zin_horos_dead`, `zin_glo_with_eindil` or `zin_glo_sealed` (never a Glo flag for Afrit, O3); calls `zin_afrit_wound` |
| World systems | `zin_afrit_ashen_throne_ready`, all story flags | `zin_war_of_last_crowns`, endings; `zin_world_add_gathering_dark`; `zin_world_reach_ending` calls `zin_afrit_reveal` |
| The East | `zin_afrit_eastern_client`, `zin_afrit_refused_east`, `zin_afrit_king_of_east`, `zin_afrit_returned`, `zin_afrit_dead` | `zin_east_kneel_bias`, `zin_east_pledged`, `zin_east_prepare_kneel`, `zin_east_turns_west`, `zin_east_sent_levies`, `zin_east_after_the_king` (releases the clients after Afrit's death); its hub decisions sit in `zin_afrit_council` |
| Lerendor | report event `zin_worshipdom.4` | `zin_strait_standing` |
| Volgan, Zol | none (caps 0) | `zin_volgan_body_destroyed`, `zin_zol_withdrawn` time the return |
| Elves and the Lands of the Sun | Friends Among the Elves (non-aggression offer) | `zin_gala_word_kept` delays `zin_afrit.31` |
| Diplomacy | `zin_diplo_is_dark_power` counts the realm Afrit rules after the reveal | `zin_autonomy_eastern_client` |

Gathering Dark contributions from this spec: crowning dissenters silenced +2, *Silence the Claimants* +3, *The Necklace Wakes* +2, Draw on the Necklace +2, the reveal +5, unmasked early +10, eastern host +1 per call and +5 for *The Host of the East*, the return +5, *Servants Beyond the Veil* +3.

## Implementation

### Builder

A new content builder module, `tools/content/modules/mech_afrit_council.mjs`, writes every file below from the data file `tools/content/data/mechanics/afrit_council.json` (seats, caps, the foothold start table by country name, artifacts, graces, instruments, acceptance factors, palace stages, dates and text keys) and is called from `tools/content/build.mjs`. It resolves names to tags with `tools/content/data/countries.json` and fails the build if a named country is missing. Everything goes through the one transaction of `tools/content/apply.mts`.

| Path | Content |
| --- | --- |
| `common/scripted_effects/zin_afrit.txt` | All `zin_afrit_*` scripted effects |
| `common/scripted_triggers/zin_afrit.txt` | All `zin_afrit_*` scripted triggers, and the date triggers below |
| `common/scripted_localisation/zin_afrit.txt` | `zin_loc_deliverer`, `zin_wsd_<key>_name` and `_desc` two-face entries, the category names |
| `common/decisions/categories/zin_afrit.txt`, `common/decisions/zin_afrit.txt` | Categories `zin_afrit_council` (hub) and `zin_afrit_cat_houses` (other countries) and their decisions |
| `common/dynamic_modifiers/zin_afrit.txt` | `zin_afrit_houses`, `zin_afrit_graces` |
| `common/ideas/zin_afrit.txt` | `zin_afrit_deliverer_rests`, `zin_afrit_unmasked`, `zin_afrit_necklace_drawn`, `zin_afrit_edict_of_arms` |
| `common/country_leader/zin_afrit_traits.txt` | `zin_trait_deliverer`, `zin_trait_unmasked`, the three advisor traits |
| `common/characters/zin_afrit_council.txt` | `zin_ilvane`, `zin_corvel`, `zin_sevrin` (hidden), `zin_kessarion` and `zin_ossar` in the Worshipdom (N13: this spec owns them; their traits are the characters spec's), and the reserved fallback `zin_aurevan_king` when needed. `zin_aurevan` (the Worshipdom's ruler) and `zin_merovan` come from the characters module |
| `common/on_actions/zin_afrit.txt` | `on_startup` → `zin_afrit.1`; `on_monthly` → `zin_afrit.2` for the hub (or, if it is gone, the first existing of Aenor and the East Lands countries, for the fallbacks); `on_state_control_changed` and `on_capitulation` for Parim |
| `events/zin_afrit.txt` | Namespace `zin_afrit` (mechanic-owned; may use `trigger` and `mean_time_to_happen`) |
| `localisation/english/zin_afrit_l_english.yml` | All text, public and private keys separate; `zin_name_aurevan` |

Rows this spec supplies to shared files: the rule `zin_rule_afrit` in the foundation's `common/game_rules/zin_game_rules.txt`; the cosmetic tag `zin_cosmetic_worshipdom_east` in the foundation's cosmetic naming. The Council panel and the footholds map mode are built by the interface module from [07_interface/01_interface.md](../07_interface/01_interface.md); this spec supplies their variables, including `zin_afrit_veil_last_change` (the veil's change over the last month, set by `zin_afrit.2`).

### Dates

Standard-pace engine dates; the module writes each as a scripted trigger with the three pace-shifted date sets of `zin_rule_story_pace`, as the historical path spec does.

| Trigger | Standard date |
| --- | --- |
| `zin_afrit_date_regicide_fallback` | 1750.10.15 |
| `zin_afrit_date_flight` | 1756.3.1 |
| `zin_afrit_date_return_open` | 1758.1.1 |
| `zin_afrit_date_return` | 1758.2.1 |
| `zin_afrit_date_parim` | 1758.9.1 |
| `zin_afrit_date_ashen_a` | 1759.1.1 |
| `zin_afrit_date_ashen_b` | 1760.1.1 |

### Variables

| Variable | Scope | Range | Start | Meaning |
| --- | --- | --- | ---: | --- |
| `zin_footholds` | every country | 0–5 | table above | contract |
| `zin_afrit_artifacts` | global | 0–4 | 4 | contract |
| `zin_afrit_veil` | global | 0–100 | 80 | strength of the secret |
| `zin_afrit_veil_last_change` | global | — | 0 | the veil's change over the last month (for the panel) |
| `zin_afrit_regicide_plot` | global | 0–100 | 20 | preparation of the Golden King's murder |
| `zin_afrit_seat_seals` | global | 0–5 | 3 | Seat of Seals |
| `zin_afrit_seat_censers` | global | 0–5 | 2 | Seat of Censers |
| `zin_afrit_seat_whispers` | global | 0–5 | 1 | Seat of Whispers |
| `zin_afrit_seat_relics` | global | 0–5 | 2 | Seat of Relics |
| `zin_afrit_watch` | temp | 0–8 | — | watchfulness of a target |
| `zin_afrit_dm_*` | country | — | — | dynamic modifier inputs for `zin_afrit_houses` and `zin_afrit_graces` |

Every write goes through a scripted effect that clamps the range.

### Flags

Global flags (set once unless noted):

| Flag | Meaning |
| --- | --- |
| `zin_afrit_regicide_ready` | The Council strikes; Aenor's clock gives the day |
| `zin_afrit_kingdom_behind_throne` | The Council rules through a living King or a pliant heir instead of crowning Aurevan |
| `zin_afrit_lost_cause_watched` | The Council watches the Lost Cause's court branch |
| `zin_afrit_knows_brother` | Afrit has learned that Eindil lives and was named |
| `zin_afrit_at_yeldenne` | Afrit's expedition reached Yeldenne |
| `zin_afrit_wounded` | Afrit was wounded at Yeldenne |
| `zin_afrit_scholars_bought` | Scholars of the First Men are bought (set by the events spec's `zin_reign.44`, historical option) |
| `zin_afrit_impostor_denounced` | Eindil has been denounced as an impostor, by the hub's focus *Denounce the Impostor* or by the Aenor realm's "Denounce and hunt" in the journey's *The Impostor*; halves veil loss from his warnings |
| `zin_afrit_hall_at_once` | `zin_afrit.31`: the party strikes the hall on arrival |
| `zin_afrit_sent_others` | `zin_afrit.31`: the Council's agents went instead of Afrit |
| `zin_afrit_unmasked_early` | Revealed before the crowning |
| `zin_afrit_abandoned_aenor` | Afrit has left Aenor |
| `zin_afrit_stand_in_parim` | Afrit chose to hold Parim instead of fleeing |
| `zin_afrit_returned` | Afrit has returned from the East |
| `zin_afrit_claims_erdae` | Afrit has retaken Parim and claims all Erdae |
| `zin_afrit_lost_ring`, `zin_afrit_lost_crown`, `zin_afrit_lost_bracelet`, `zin_afrit_lost_necklace` | Artifact lost |
| `zin_afrit_attuned_ring`, `zin_afrit_attuned_crown`, `zin_afrit_attuned_bracelet`, `zin_afrit_attuned_necklace` | Artifact attuned |
| `zin_afrit_palace_held` | A palace stage failed; Afrit holds the palace |

Country flags: `zin_afrit_suspicious` (730 days), `zin_afrit_houses_purged` (365 days), `zin_afrit_eastern_client`, `zin_afrit_refused_east`. Tree-local flags `zin_worshipdom_*` are listed in the tree spec.

### Characters

| Id | Name | Status | Country | Role |
| --- | --- | --- | --- | --- |
| `zin_aurevan` | Aurevan the Deliverer (public), Afrit (private) | contract | Worshipdom | Country leader; field marshal from *The Eastern War Council* (`add_field_marshal_role`, skill 5, trait from the warfare spec) |
| `zin_merovan` | Chancellor Merovan | contract | Aenor | Head of government; secret Seat of Seals |
| `zin_sevrin` | Sevrin | contract (hidden) | Worshipdom | Advisor after *A Guest of the Reliquary*; holds the Seat of Relics |
| `zin_ilvane` | Ilvane, High Confessor | proposed (N10) | Worshipdom | Advisor; Seat of Censers; leads the Worshipdom while Afrit is elsewhere |
| `zin_corvel` | Corvel, Master of Couriers | proposed | Worshipdom | Advisor; Seat of Whispers |
| `zin_kessarion` | Kessarion the Envoy | proposed (this spec, N13) | Worshipdom | Advisor (lesser character); head of Corvel's eastern branch |
| `zin_ossar` | Magister Velan Ossar | proposed (this spec, N13) | Worshipdom | Theorist (lesser character); the Reliquary's scholar under Sevrin |
| `zin_eronel` | Prince Eronel of Arcedor | proposed (characters spec) | Aenor | The pliant heir |

### Scripted triggers

| Trigger | Scope | True when |
| --- | --- | --- |
| `zin_afrit_is_hub` | country | original tag is the Worshipdom's and it exists |
| `zin_afrit_rules_here` | country | `has_country_leader` with character `zin_aurevan` |
| `zin_afrit_secret_kept` | any | not `zin_afrit_revealed` |
| `zin_afrit_can_deepen_foothold` | country (target) | below its cap; not at war with the hub; no `zin_afrit_houses_purged`; not the hub |
| `zin_afrit_eastern_candidate` | country | definition above |
| `zin_afrit_holds_parim` | any | definition above |
| `zin_afrit_ashen_throne_ready` | any | definition above |
| `zin_afrit_date_*` | any | Dates |

### Scripted effects

| Effect | Scope | Args | Does |
| --- | --- | --- | --- |
| `zin_afrit_add_footholds` | target country | `value` | Adds, clamps to 0 and the cap, refreshes `zin_afrit_houses` |
| `zin_afrit_spread_footholds` | any | `region` (region key or `any`), `value`, `count`, `min` (default 0), `below` | Raises up to `count` countries of the region whose footholds are at least `min` and below `below`; order: highest footholds first, then tag |
| `zin_afrit_compute_watch` | target country | — | Sets temp `zin_afrit_watch` |
| `zin_afrit_add_veil` | any | `value` | Halves losses with *The Radiant Face*; clamps 0–100; floor 1 before the flight unless `ROOT` is human (D3); ignored after the reveal; at 0 calls `zin_afrit_reveal` |
| `zin_afrit_add_plot` | any | `value` | Clamps 0–100; at 100 fires `zin_afrit.14` once |
| `zin_afrit_raise_seat` | any | `seat`, `value` | Clamps 0–5 |
| `zin_afrit_attune_artifact` | any | `artifact` | Sets the attuned flag; refreshes graces |
| `zin_afrit_refresh_graces` | any | — | Recomputes `zin_afrit_graces` on the realm Afrit leads |
| `zin_afrit_ready_regicide` | any | — | Sets `zin_afrit_regicide_ready` |
| `zin_afrit_plot_exposed` | any | — | The Council's reaction to an exposure (called only by Aenor's `zin_aenor_expose_plot`) |
| `zin_afrit_crown_aurevan` | any | — | The crowning (above) |
| `zin_afrit_raise_pliant_heir` | any | — | Prince Eronel as king (above) |
| `zin_afrit_northern_voyage` | hub | — | The voyage (above); fires `zin_afrit.32` |
| `zin_afrit_wound` | any | `days` (default 365) | The Yeldenne wound (above) |
| `zin_afrit_reveal` | any | `voluntary` (optional) | The reveal (above) |
| `zin_afrit_flee_east` | any | — | The flight (above) |
| `zin_afrit_proclaim_king_of_east` | any | — | The proclamation (above) |
| `zin_afrit_raise_eastern_host` | hub | `divisions` | The host (above) |
| `zin_afrit_wargoal_refuser` | hub | — | War goal on the refuser with the most states |
| `zin_afrit_return` | hub | — | The return (above) |
| `zin_afrit_retake_aenor` | hub | — | Lord of all Erdae (above) |
| `zin_afrit_claim_middle_lands` | hub | — | Claims on every Middle Lands state its side does not control |
| `zin_afrit_begin_palace_battle` | any | — | Starts the chain `zin_afrit.70` (above) |
| `zin_afrit_lose_artifact` | any | `artifact` | Lost flag, artifacts -1, refresh |
| `zin_afrit_die` | any | — | Death (above); called only by `zin_afrit.75` (O2) |
| `zin_afrit_purge_houses` | target country | — | Purge (above); also called by shared trees and story events |

**Arguments (E1).** Each argument is the temporary variable `zin_arg_<name>` (for example `zin_arg_value`, `zin_arg_days`, `zin_arg_divisions`), set by the caller just before the call; the effect reads it and clears it. Keyword arguments use number codes: `seat` seals 1, censers 2, whispers 3, relics 4; `artifact` ring 1, crown 2, bracelet 3, necklace 4; `region` 0 for any, else the economy spec's region keys in this order: middle_lands 1, north_lands 2, cold_lands 3, west_lands 4, tritons_islands 5, dark_lands 6, magical_lands 7, zols_mistake 8, dead_lands 9, east_lands 10, islands_of_the_south 11, lands_of_the_sun 12; `voluntary` 0 or 1. The focus compiler writes `call` blocks in this form.

Each effect shows one mask-safe custom tooltip and hides its work while `zin_afrit_secret_kept`. Effects owned elsewhere and called here: `zin_aenor_expose_plot`, `zin_aenor_hasten_death_clock`, `zin_aenor_add_council_influence`, `zin_aenor_add_concord_loyalty_all` (Aenor); `zin_east_prepare_kneel` (East); `zin_eindil_start_hunt` (journey); the journey's events `zin_eindil.110`, `.120`, `.121`, `.123`, `.124`, `.127` and the events spec's `zin_reign.65`, `.81`, `.82`, `.83`, `.85` (fired, not called); `zin_politics_set_stance` (foundation); `zin_world_add_gathering_dark` (world systems); `zin_reign_on_crowning` (events).

Engine effects used: `remove_country_leader_role`, `recruit_character`, `add_country_leader_role`, `kill_country_leader`, `promote_character`, `set_character_name`, `set_cosmetic_tag`, `drop_cosmetic_tag`, `change_tag_from`, `puppet`, `set_autonomy`, `give_military_access`, `declare_war_on`, `white_peace`, `set_state_controller`, `annex_country`, `add_intel`, `add_tech_bonus`, `start_civil_war`, `add_dynamic_modifier`, `add_timed_idea`, `add_ai_strategy`, `hidden_effect`, `custom_effect_tooltip`.

### Decisions

Category `zin_afrit_council` ("The Hermitage Chapter" / "The Hidden Council"), visible when `zin_afrit_is_hub` and not `zin_afrit_dead`. Category `zin_afrit_cat_houses` ("The Houses of the First Light"), visible to any other country with footholds 1 or more.

| Decision | Category | Available | Cost | Effect |
| --- | --- | --- | ---: | --- |
| `zin_afrit_open_house` (targeted) | council | `zin_worshipdom_houses_open`; target passes `zin_afrit_can_deepen_foothold` | 25 + 15 × level, -4% × Censers | 60 days; roll as above |
| `zin_afrit_hear_confession` (targeted) | council | `zin_worshipdom_confessors`; target footholds 3+ | 30 | `add_intel` on the target (+30% civilian, +20% army); private report `zin_afrit.7` listing the target's story flags |
| `zin_afrit_call_debt` (targeted) | council | `zin_worshipdom_debts`; footholds 4+ | 50 | `zin_afrit.6` to the target: send 500 infantry equipment, grant military access, or refuse (footholds -1) |
| `zin_afrit_silence_dissenter` | council | `zin_worshipdom_quiet_hands` | 40 | veil +8; 25% botched: veil -10 instead; Gathering Dark +1 |
| `zin_afrit_steer_the_court` | council | `zin_worshipdom_merovan`; Aenor not ruled by Aurevan | 50 | Aenor council influence +5; 90-day cooldown |
| Royal Edicts (four) | council | above | above | above |
| `zin_afrit_open_famine_stores` (targeted) | council | `zin_worshipdom_famine_stores`; target at war or stability below 40% | 50 | target stability +0.05, opinion of the hub +20, footholds +1 (within cap) |
| `zin_afrit_draw_on_necklace` | council | not `zin_afrit_lost_necklace` | 100 | above |
| `zin_afrit_send_the_thief` (targeted) | council | `zin_worshipdom_thief`; Sevrin hired | 75 | 45 days; `add_tech_bonus` 50% once in a category where the target leads; veil -3; 20% caught: veil -10, target opinion -30 |
| `zin_afrit_raise_the_faithful` (targeted) | council | `zin_worshipdom_faithful_rise`; `zin_afrit_revealed`; target footholds 5 | 150 | 30 days; target Shadow popularity +20 points through `zin_politics_add_drift`; if Shadow is 40% or more, `start_civil_war` (`ideology = communism`); the breakaway becomes the hub's subject |
| `zin_afrit_close_houses` | houses | `zin_afrit_suspicious` or `zin_afrit_revealed` | 50 | `zin_afrit_purge_houses` |

The eastern spec adds three hub decisions to `zin_afrit_council` from its own file.

### Events (namespace `zin_afrit`)

"Private" events go only to the hub and may name Afrit. "Public" events must pass the secrecy check. Every event writes `timeout_days = 30` (E2). "CP nn" marks an event that decides path checkpoint nn for a human; its options are written in the order shown, the non-committal option first and the historical option second, with the data field `checkpoint` (the events conventions, C9).

| Id | Title | To | Trigger | Options |
| --- | --- | --- | --- | --- |
| .1 | (hidden) The Council Sits | all | `on_startup` | Sets every start value |
| .2 | (hidden) The Council's Month | hub | `on_monthly` | Veil regeneration and last change, tithes, plot, seat drifts, graces refresh, foothold decay after death, historical fallbacks |
| .3 | A House Opens in [target] | hub, private | Open a House succeeds | One option; text by level |
| .4 | Suspicion in [target] | hub, private | Open a House fails | Withdraw (footholds -1, veil +3) / Brazen it out (nothing) / Pay for silence (50 PP, veil +2) |
| .5 | The Houses Are Closed in [target] | hub, private | A purge | One option |
| .6 | The Faithful Ask a Favour | target, public | Call In a Debt | Send equipment / Grant passage / Refuse |
| .7 | What the Confessors Heard | hub, private | Hear Confession | One option |
| .10 | The Council's Verdict | hub, private | *Prayers for the King* | One option; recalls the verdict of 4A 1746 |
| .11 | Choose the Instrument | hub, private | *A Vigil for the King* | Physician (AI historical) / Hunt / Fever |
| .12 | A Taster Falls Ill | hub, private | Complication | Silence / Pause |
| .13 | The Lost Cause Asks Questions | hub, private | Complication | Bribe / Discredit / Let it run |
| .14 | The Plot Is Ready | hub, private | Plot 100 | One option |
| .15 | Choose the Night | hub, private | *The Mistfall Vigil* or plot 100 (AI) | CP 05: Not this year / At Mistfall / At the First Chance / Stay the hand |
| .16 | The Plot Exposed | hub, private | Exposure | One option |
| .17 | Treason in the Golden Court | all, public | After an exposure | One option; no name |
| .20 | The Seals Pass to the Deliverer | hub, private | The Faithful take the seals | CP 06: Let the seals wait / Take the crown / Raise a pliant heir / Rule from Parim in person (human only) |
| .21 | Aurevan, First of His Name | all, public | Crowning | One option |
| .22 | Dissenters at Court | hub, private | 30 days after .21 | Silence / Spare |
| .23 | A New King in Parim | all, public | Pliant heir | One option; immediate: crowns Eronel in Aenor, fires `zin_reign.65` in 2 days |
| .30 | A Man from the Ice | hub, private | `zin_eindil_war_king` and `zin_worshipdom_western_ears` | One option; rumour only |
| .31 | Word from the Lands of the Sun | hub, private | Delay after `zin_eindil_named` | CP 09: Stay in Parim / Lie in wait / Take Glo at once / Send others |
| .32 | The Northern Voyage | hub, private | The voyage starts | One option; sets `zin_aurevan_went_north`; Merovan left in charge; fires `zin_reign.81` if Aurevan rules Aenor |
| .33 | The Ambush on the Shore | hub, private | The journey's landfall while the party waits | CP 09: Let them land / Spare none |
| .34 | Return from Yeldenne | hub, private | `zin_afrit_wound` | One option; fires `zin_reign.82` if Aurevan rules Aenor and the secret holds |
| .40 | The Impostor's Warnings | hub, private | The journey's first warning | Ignore him / Denounce him (opens the focus; fires `zin_reign.83` once) / Hunt him (calls the journey's `zin_eindil_start_hunt`; veil -5; the discovery roll +10%) |
| .41 | The Veil Thins | hub, private | Veil below 30 | One option |
| .42 | The Name Is Spoken | hub, private | Reveal | One option |
| .43 | The Name Behind the Deliverer | all, public | Reveal | One option; names Afrit |
| .44 | Unmasked Too Soon | hub, private | Early reveal | One option |
| .45 | The Houses Under Suspicion | Light countries | Reveal | Close the Houses (AI 60%) / Watch them (AI 40%) |
| .50 | Aenor Cannot Hold | hub, private | Pressure | CP 17: Hold for now / Go east / Flee to the hermitage / Stand in Parim |
| .51 | The Deliverer Comes East | each candidate | Flight | CP 17: Refuse / Kneel |
| .52 | A King in the East | all, public | 30 days after flight | One option |
| .53 | The Chancellor's Choice | hub, private | Flight | Merovan follows / Merovan stays |
| .54 | The War Council of the East | hub, private | *The Eastern War Council* | One option; field-marshal role |
| .60 | The Return from the East | hub, private | `zin_afrit_return` | One option |
| .61 | Brother Against Brother | hub, private | Conditions above | One option; fires `zin_eindil.110` |
| .62 | Lord of All Erdae | all, public | Conditions above | One option |
| .70 | The Palace Wards | hub, private | `zin_afrit_begin_palace_battle` | One option; starts stage 1 |
| .71–.74 | The four stages | hub, private | Chain | Defences above |
| .75 | The False God Falls | all, public | Stage 4 succeeds | One option; immediate: `zin_afrit_die`, then fires `zin_eindil.124` |
| .76 | The Palace Holds | hub, private | A stage fails | One option; fires `zin_eindil.127` |
| .80 | The Ashen Throne | hub, private | `zin_ending_ashen_throne` | One option |
| .90 | A Healing in [country] | target, public | Random, footholds 2+, while secret (mean time 720 days) | One option: stability +0.01 |
| .91 | The Pilgrims' Tale | hub, private | Random flavour | One option |
| .92 | The Thief Grows Restless | hub, private | Sevrin hired, mean time 730 days | Send him out (veil -2, 50 PP) / Keep him close |

Pictures come from the event picture catalog ([05_focus_trees/02_icon_catalog.md](../05_focus_trees/02_icon_catalog.md)) as `GFX_zin_evt_<key>`: `hermitage`, `council_chamber`, `golden_court`, `coronation`, `cold_shore`, `eastern_court`, `palace_battle`, `houses`. Keys the catalog lacks fall back to `hermitage`. All image-generated.

### Game rule

`zin_rule_afrit` ("The Deliverer's Path"; the rule text never names Afrit):

| Option | Meaning |
| --- | --- |
| `DEFAULT` | Follows `zin_rule_historical_path`: `HISTORICAL` under its HISTORICAL, else `FREE` |
| `HISTORICAL` | AI and fallbacks keep the established path |
| `FREE` | AI weighs every option; no date fallbacks |
| `ASHEN` | AI aims for the Ashen Throne: Stand in Parim, Cast Off the Mask after the crowning, no flight |
| `DORMANT` | The Council never strikes: Pray for Patience, the Kingdom Behind the Throne |

### Defines

None.

## AI

- **Peace first.** The Worshipdom AI has `ai_focus_peaceful_factor` from its stance spirit and never declares war before `zin_war_of_last_crowns`. After the flight it gets `add_ai_strategy` `conquer` against refusers only under `FREE` and `ASHEN`.
- **Veil discipline.** The AI does not take risky decisions while the veil is below 40. It takes *The Radiant Face* when the veil is below 50 (weight ×3). It never takes *Cast Off the Mask* except under `ASHEN`.
- **Footholds.** The AI opens houses at most once per 60 days, preferring targets in this order: East Lands countries at 3+, the Lands of the Sun until the Gala Elves reach 1, Concord dominions, others. It never targets watch 5+ while the veil is below 60.
- **The plot.** Under `HISTORICAL` the AI follows the route in the tree spec, picks the physician, and chooses "At Mistfall". Under `FREE` it chooses "At Mistfall" 60%, "Not this year" 30%, "At the First Chance" 10%. Under `NO_AI_PLOT` (Aenor's rule) or `DORMANT` it stays the hand.
- **Yeldenne.** Under `HISTORICAL` the AI lies in wait, spares none, and waits for the ambush (the Glo spec's AI for `zin_glo_enter_the_hall`). Otherwise it uses the option weights above (Afrit goes himself 80%).
- **Flight.** `HISTORICAL`: go east. `FREE`: go east if 2+ candidates (70%), else stand. `ASHEN`: stand.
- **Return.** Under `HISTORICAL` and `FREE` the AI takes the return as soon as available.
- **Palace.** The AI uses "Burn the reserves" if it has 150 PP, else "Draw on the Necklace". Under `HISTORICAL` defences still cost resources but every stage succeeds.
- **Other countries.** Eastern candidates use the acceptance table. Light countries close the houses after the reveal at 60%; Lost Cause members at 50%; others at 10%, ×3 if the target has `zin_afrit_suspicious`.
- **Edicts.** The AI uses the Edict of Summons when Aenor is at war and the Temple Treasury when the hub has under 50 PP.

## Acceptance

1. On 1 Thaw 4A 1748: `zin_afrit_artifacts` = 4, `zin_afrit_veil` = 80, `zin_afrit_regicide_plot` = 20, seats 3/2/1/2, footholds match the start table, the Worshipdom is Light with stance `zin_light_sanctuary`, its ruler shows as Aurevan the Deliverer, and it is at war with no one.
2. The compiler's secrecy check passes: no text reachable by a non-hub player before `zin_afrit_revealed` contains "Afrit" or "demon"; the public faces of every masked focus and spirit are clean; the rule texts are clean.
3. Every focus tooltip of the Worshipdom rendered for another country with the HOI4 Agent Tools focus renderer shows only mask-safe tooltips (an MCP render, never a game screenshot).
4. With `zin_rule_afrit` = `HISTORICAL` and no player, a test run reaches: `zin_afrit_regicide_ready` on 15 Emberleaf 4A 1750; `zin_aurevan_crowned` by Longnight 4A 1750; `zin_afrit_knows_brother` in 4A 1752; `zin_afrit_at_yeldenne` before the journey's landfall; `zin_afrit_revealed` on the same day as `zin_afrit_abandoned_aenor` in 4A 1756 (never earlier); `zin_afrit_king_of_east` in 4A 1756 with at least 2 East Lands subjects under `zin_autonomy_eastern_client`; `zin_afrit_returned` in 4A 1758; `zin_afrit_dead` in 4A 1759; `zin_afrit_artifacts` = 0 at death.
5. `zin_afrit_reveal` runs at most once; `zin_afrit_revealed` is set exactly once in every test run that sets it.
6. Under `HISTORICAL`, deleting the Worshipdom by console on day 1 still yields `zin_golden_king_dead` in Mistfall 4A 1750.
7. A scenario test sets `zin_afrit_claims_erdae`, holds Parim and 12 countries at footholds 4+, sets `zin_afrit_palace_held` and the date to 1759.1.2: `zin_afrit_ashen_throne_ready` is true and world systems set `zin_ending_ashen_throne`.
8. A scenario test with a human Worshipdom drives the veil to 0 before the crowning: `zin_afrit_unmasked_early` and `zin_golden_king_plot_exposed` are set, and footholds drop as specified. The same losses from AI actions stop the veil at 1.
9. Footholds never exceed a country's cap through any effect except the start table; Volgan, Zol and Yeldenne stay at 0 for a whole test run.
10. With `zin_rule_story_pace` = `SLOW`, the fallback dates move to start + 1.5 × their standard distance.
11. A build test fails if a country named in the data file is missing from `countries.json`.
12. Every modifier named here exists in the 1.19.3 `modifiers_documentation.md`; every effect and trigger in the effect and trigger documentation; the HOI4 Agent Tools script validator reports no errors for the generated files.
13. One in-game year in the Linux run produces no new errors from ZIN files.
14. Build test: every event marked CP carries `checkpoint` and its first option is not the historical one; no generated file contains a name from the contract register's retired table (the name check), and no script sets a Glo flag for Afrit (O3).
15. Scenario test: a failed palace stage blocks *Enter the Palace* for 180 days and no longer; `zin_afrit_die` runs exactly once in a run that reaches `zin_afrit_dead`.

## Open questions

All proceed on the labelled proposal; the owner's questions are listed in [OPEN_QUESTIONS.md](../OPEN_QUESTIONS.md) under "afrit".

1. The four seats, their public names and holders: Ilvane, Corvel and Sevrin hold seats; Kessarion and Ossar serve under them (afrit 1).
2. Does Afrit already hold all four artifacts in 4A 1748? Proposal: yes (afrit 3).
3. Should a human Worshipdom be offered the switch to Aenor at the crowning? Proposal: yes (afrit 5).
4. Should the Worshipdom keep a story after Afrit's death, and what happens to the Houses? Proposal: it goes quiet; the network decays (afrit 6).
5. Are the elven cap (2) and the zero caps right? Proposal: yes (afrit 7).
6. Should Afrit's host strike the Magical Forest by focus? Proposal: keep the focus; the eastern invasion stays the eastern kings' (afrit 8).
