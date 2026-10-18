# Afrit and the Hidden Council

**Status:** Draft. **Priority:** 3. **Phase:** 3.

## Purpose

Afrit is the hidden power of the Fourth Age. At the start he is not a visible enemy. He is the Deliverer, Aenor's beloved god, and his Hidden Council already governs Aenor behind the Golden King. This spec defines how ZIN plays that: the Council's four seats, Chancellor Merovan, the Houses of the First Light, the Deliverer's network in every country (`zin_footholds`), Afrit's artifacts (`zin_afrit_artifacts`), the secret and its reveal, the Golden King's murder from Afrit's side, the Yeldenne expedition, the flight east, the King of the East, the return, the palace battle and Afrit's death, and the Ashen Throne ending.

The Worshipdom in the Zilin Hills is the playable hub of the whole system. A player who picks it plays the Hidden Council: patient, deniable and rich in favours, with almost no army. The design goal is that the Worshipdom is fun precisely because it must not be seen.

The Worshipdom's focus tree is specified in [05_focus_trees/major/worshipdom.md](../05_focus_trees/major/worshipdom.md). Shared names come from [00_shared_contract.md](00_shared_contract.md).

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
| The public name **Aurevan** | proposed | *Aurevan the Deliverer* |
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
| The plot is ready | `zin_afrit_regicide_ready` | Mistfall 1750 | Afrit | Event `zin_afrit.15` | Choose the night, delay, abort |
| The Golden King dies | `zin_golden_king_dead` | Mistfall 1750 | Aenor | Aenor's succession reacts to `zin_afrit_regicide_ready` | — |
| Aurevan is crowned | `zin_aurevan_crowned` | Mistfall 1750 | Afrit | Event `zin_afrit.20` | Raise a pliant heir instead |
| Afrit learns of his brother | `zin_afrit_knows_brother` | 1752 | Afrit | Event `zin_afrit.31`, timed by footholds | — |
| The voyage to Yeldenne | `zin_afrit_at_yeldenne` | 1753 | Afrit | Decision `zin_afrit_northern_voyage` | Go, or send others |
| Afrit wounded | `zin_afrit_wounded` | 1753 | Afrit (called by Yeldenne) | `zin_afrit_wound` | Hide the wound |
| The name is known | `zin_afrit_revealed` | 1754–1756 | Afrit | Veil reaches 0, voluntary unmasking, or the flight | Delay it |
| Afrit abandons Aenor | `zin_afrit_abandoned_aenor` | early 1756 | Afrit | Event `zin_afrit.50` | Stand in Parim instead |
| King of the East | `zin_afrit_king_of_east` | 1756 | Afrit | Event `zin_afrit.52` | — |
| The return | `zin_afrit_returned` | early 1758 | Afrit | `zin_afrit_return` | Time it |
| Eindil cast from the cliff | `zin_afrit_cast_down_eindil` | 1758 | Afrit (event in Eindil's chain) | Event `zin_afrit.61` | — |
| Lord of all Erdae | `zin_afrit_claims_erdae` | 1758 | Afrit | Event `zin_afrit.62` | — |
| The palace battle | `zin_afrit_lost_*` | 1759 | Afrit (called by Eindil) | Chain `zin_afrit.70`–`.76` | Resist each stage |
| Afrit dies | `zin_afrit_dead` | 1759 | Afrit | `zin_afrit_die` | — |
| The Ashen Throne | `zin_ending_ashen_throne` | never on the historical path | world systems | `zin_afrit_ashen_throne_ready` is true | Reach it |

### Afrit's person

`zin_aurevan` is one character. At the start he leads the Worshipdom. His player-facing name is **Aurevan the Deliverer** (loc key `zin_aurevan_public_name`, so the owner can swap the proposed name in one place). His portrait is a radiant, veiled figure (image-generated). His leader trait `zin_trait_deliverer` ("Beloved of the Faithful"): `political_power_gain` 0.25, `stability_factor` 0.05.

| Moment | Leads | Worshipdom led by |
| --- | --- | --- |
| Start | Worshipdom | — |
| Crowned (`zin_aurevan_crowned`) | Aenor | `zin_ilvane`, High Confessor, as Keeper of the Hermitage |
| Flight east (`zin_afrit_abandoned_aenor`) | Worshipdom (cosmetic name *The Eastern Throne*) | — |
| Lord of all Erdae (`zin_afrit_claims_erdae`) | Aenor again | `zin_ilvane` |
| Death | — | `zin_ilvane` |

The move uses `remove_country_leader_role` on the old realm, `recruit_character` and `add_country_leader_role` on the new one. The implementer must confirm in the Linux run that `recruit_character` moves an existing character between countries. If it does not, the fallback is a second character `zin_aurevan_king` with the same name and portrait, swapped in and out; the fallback must be reported as a contract change.

After the reveal his trait gains a second trait `zin_trait_unmasked` ("The Unmasked God"): `war_support_factor` 0.10, `stability_factor` -0.05.

**Switching (human hub only, optional).** When Aurevan is crowned, a human hub is offered "Rule from Parim in person": `change_tag_from` moves the player to Aenor. The default option keeps the player in the Worshipdom. This only appears if the Aenor spec's tree supports a ruler named Aurevan; otherwise it is hidden.

### The four seats

The Council has four seats (proposed structure, vault). Each seat is a global level 0–5. Focuses and decisions raise them. Higher levels make the matching actions cheaper, safer or stronger.

| Seat | Public name (before reveal) | Duty | Holder | Start | Per level |
| --- | --- | --- | --- | ---: | --- |
| **Seals** (`zin_afrit_seat_seals`) | The Chapter of Friends at Court | Royal administration of Aenor | Chancellor Merovan (`zin_merovan`, Aenor's head of government; his seat is secret) | 3 | Council influence drifts up 0.25 a month while it is below 50 + 10 × level; plot +0.5 a month once the verdict is given; Royal Edicts cost 5% less |
| **Censers** (`zin_afrit_seat_censers`) | The Censer Chapter | Worship, temples, the public face | `zin_ilvane`, the High Confessor (proposed) | 2 | Veil regenerates 0.4 a month; Open a House costs 4% less |
| **Whispers** (`zin_afrit_seat_whispers`) | The Couriers' Chapter | Foreign agents, couriers, confessors | `zin_corvel`, Master of Couriers (proposed) | 1 | Open a House succeeds 3% more often; news from the Lands of the Sun comes 5 days sooner; at 4+ the Yeldenne ambush gains 1 strength |
| **Relics** (`zin_afrit_seat_relics`) | The Reliquary Chapter | Recovering and keeping artifacts | `zin_sevrin`, the unending thief (proposed name; seat proposed) | 2 | Artifact graces +5%; each palace stage -2% for Eindil's side; Draw on the Necklace cooldown 20 days shorter |

Seat holders are political advisors of the Worshipdom. Ilvane and Corvel are hireable from the start (Worshipdom only). Sevrin is hidden until the focus `a_guest_who_does_not_age` (*A Guest of the Reliquary*). Advisor traits:

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
| Volgan, Demon, Dolon, Nezer (the Southern Dominion), Zol, Yeldenne, and any country whose people is `the_dead` | 0 |
| Countries whose people is `elves` (including the Gala Elves and the Magical Forest) | 2 |
| Everyone else | 3; 4 with `zin_worshipdom_cap4`; 5 with `zin_worshipdom_cap5` |
| East Lands countries | +1 with `zin_worshipdom_eastern_chapter`; 5 with `zin_worshipdom_eastern_reserve` |

The zero caps follow the vault: Afrit stays independent of Volgan and Zol, and Horos admits no one.

**Start values (proposed).** Set by `zin_afrit.1`. Generators resolve names to tags.

| Countries | Start |
| --- | ---: |
| Aenor | 5 |
| Concord dominions of men (Aenor's subjects whose people is `men`), except Selen | 2 |
| Concord dominions of other peoples (Kilinti, Hiloron and the like) | 1 |
| Selen | 1 |
| Cursed Lands, Bloody Forest | 0 |
| Alerhia, Erco, Plutondo, Miaed, Noris, Stabilo | 3 |
| Other East Lands countries | 2 |
| Lerendor, Dondor | 2 |
| Other countries of men in the North, West, Cold and Dark Lands, Triton's Islands, the Islands of the South, the Lands of the Sun, and Mirolon | 1 |
| Orc, goblin and troll realms of the Dark Lands | 0 |
| Elven realms (Magical Lands, Lands of the Sun, Gala Elves) | 1 |
| Capped-at-0 countries | 0 |

These numbers say how deep the network is. They do not say which eastern kings will follow Afrit; that stays open in the vault and is decided by play.

**Watchfulness.** Each target has a watchfulness score from 0 to 8, computed by `zin_afrit_compute_watch` into the temp variable `zin_afrit_watch`:

| Condition | Watch |
| --- | ---: |
| Base | 1 |
| Ruling ideology Light | +2 |
| Selen or Mirolon | +3 |
| People `elves` | +2 |
| Member of the Lost Cause (Aenor spec's membership trigger) | +1 |
| Has `zin_afrit_suspicious` | +2 |
| Ruling ideology Wild | -1 |
| Already at 3 or more footholds | -2 |

**Deepening.** The targeted decision *Open a House in [country]* (`zin_afrit_open_house`) costs 25 + 15 × current level PP (minus the Censers discount) and takes 60 days. On completion it rolls:

- Success chance: 85 - 8 × watch + 3 × Whispers, clamped 10–95%.
- Success: footholds +1; veil -(watch / 2, rounded down).
- Failure: event `zin_afrit.4` (Suspicion in [country]); veil -(2 + watch); the target gets `zin_afrit_suspicious` for 730 days.

**Purges.** Any country with footholds 1 or more may take *Close the Houses* (`zin_afrit_purge_houses`, in the world systems' realm category) when it has `zin_afrit_suspicious` or once `zin_afrit_revealed` is set. Cost 50 PP. Effect: footholds to 0 (or -1 and never below 2 if the hub has `zin_worshipdom_houses_fortified`), stability -0.05, flag `zin_afrit_houses_purged` for 365 days (no deepening), hub veil -5 while secret. Event `zin_afrit.5` tells the hub privately.

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
| Each warning Eindil gives at a Middle Lands court (the Eindil spec calls `zin_afrit_add_veil`) | -8, or -4 with `zin_afrit_impostor_denounced` |
| The Lost Cause finds evidence (the Aenor spec calls it) | -10 |
| A purge while secret | -5 |
| Hub has the spirit *The Radiant Face* | all losses halved |

Thresholds:

- **Below 30:** event `zin_afrit.41` (The Veil Thins). Every country of Light ideology counts as suspicious: *Close the Houses* becomes available to it.
- **At 0:** `zin_afrit_reveal`.

**The reveal** (`zin_afrit_reveal`, called once): sets `zin_afrit_revealed`; fires `zin_afrit.42` to the hub and the public news event `zin_afrit.43`; adds `zin_trait_unmasked`; every country of Light ideology gets `zin_afrit.45` (The Houses Under Suspicion); `zin_world_add_gathering_dark` +5. It is also called by the flight east if the name is still secret, and by the focus *Cast Off the Mask* (voluntary).

**Unmasked too soon.** If the reveal comes before `zin_aurevan_crowned`, `zin_afrit_reveal` also sets `zin_afrit_unmasked_early` and fires `zin_afrit.44`:

- the hub gets the idea `zin_afrit_unmasked` for 365 days;
- Aenor: council influence -40 (Aenor effect); `zin_afrit_regicide_exposed` is set and the plot resets to 0;
- every country: footholds -1; Light countries a further -1;
- `zin_world_add_gathering_dark` +10.

This is the catastrophe the hub player plays to avoid.

**Text secrecy rules.** These implement the contract's rule on the secret.

1. Every text a non-hub player can read before `zin_afrit_revealed` must not name Afrit, call the Deliverer a demon, or describe the plot, the Council or the artifacts. This covers focus names and descriptions, spirit names, decision names visible to others, news events, opinion modifiers, dynamic modifiers, party names, character names and the bookmark text.
2. Hub focuses carry two faces: a public name and a true name. Their localisation key calls scripted localisation (`zin_wsd_<key>_name`, `zin_wsd_<key>_desc`) that returns the true text only when the global flag `zin_afrit_revealed` is set. A global flag is the same for every viewer, so this is safe. The Linux run must confirm focus names evaluate scripted localisation; if not, focuses keep their public faces for the whole game.
3. Secret effects are never shown as tooltips to other players. All `zin_afrit_*` scripted effects wrap their work in `hidden_effect` and show one mask-safe `custom_effect_tooltip` (for example "The faithful give gladly."). Focus effects that fire private events are wrapped the same way, so the event title never shows in a focus tooltip. Locked focuses, their tooltips and spirit names are readable by anyone from the first day, so they follow these rules too.
4. The truth reaches the hub through private events (`zin_afrit.*` and `zin_worshipdom.*` events fired only to the hub) and the Council panel. Those may name Afrit.
5. The decision category `zin_afrit_council` is visible only to the hub (`zin_afrit_is_hub`). Its public name is "The Hermitage Chapter"; after the reveal "The Hidden Council".
6. Scripted localisation `zin_afrit_name` returns the public name before the reveal and "Afrit" after it. Shared texts use it.
7. The compiler's secrecy check treats `*_true` keys reached only through rule 2 as post-reveal text.

### Afrit's artifacts

`zin_afrit_artifacts` (global, 0–4) counts the artifacts Afrit holds. It starts at 4: the Necklace (stolen 4A 1611, proposed date) and three lesser artifacts gathered 4A 1611–1700 (proposed). It never rises above 4. It falls only in the palace battle.

Each artifact has a lost flag and an attuned flag. Attunement is a proposed mechanic for how much of an artifact's power the Seat of Relics has woken; it does not change what Afrit holds.

| Artifact | Status | Lost flag | Attuned flag | Graces at full strength |
| --- | --- | --- | --- | --- |
| Necklace of the Abyss | established | `zin_afrit_lost_necklace` | `zin_afrit_attuned_necklace` | `political_power_factor` 0.15, `army_morale_factor` 0.10; ×1.5 when the realm is Aenor (strongest in the prepared centre of the Middle Kingdom) |
| Ring of Doors | ring established, name and power proposed | `zin_afrit_lost_ring` | `zin_afrit_attuned_ring` | `own_operative_capture_chance_factor` -0.30, `army_retreat_speed_factor` 0.10; enables escape options |
| Crown of Witnesses | proposed | `zin_afrit_lost_crown` | `zin_afrit_attuned_crown` | `stability_factor` 0.08, `war_support_factor` 0.05; ×2 in Aenor with `zin_worshipdom_oaths_renewed` |
| Bracelet of the First Seal | proposed | `zin_afrit_lost_bracelet` | `zin_afrit_attuned_bracelet` | `army_core_defence_factor` 0.08, `defensive_war_stability_factor` 0.10 |

The graces are one dynamic modifier, `zin_afrit_graces`, on the realm `zin_aurevan` leads. Its public name is "Graces of the Deliverer". `zin_afrit_refresh_graces` recomputes its variables: each held artifact contributes 50% of its graces unattuned and 100% attuned, times (0.8 + 0.05 × Relics). It is refreshed monthly, on every move of Afrit, and on every change of an artifact flag.

**Draw on the Necklace** (`zin_afrit_draw_on_necklace`): 100 PP; the realm Afrit leads gets the idea `zin_afrit_necklace_drawn` for 30 days (`army_attack_factor` 0.10, `army_defence_factor` 0.10, `political_power_gain` 1); veil -10 while secret; Gathering Dark +2; cooldown 180 - 20 × Relics days.

**Glo.** Afrit wants Glo (established). The hall of Horos is owned by the Yeldenne and Glo spec. If, off the historical path, that spec gives Glo to Afrit, it sets `zin_glo_with_afrit` and fires `zin_afrit.35`: the hub's graces gain `political_power_factor` 0.10 and the Necklace stage of the palace battle gets -15% for Eindil's side. This flag never counts as an artifact and never appears under the historical rule.

### The Golden King's murder, from Afrit's side

`zin_afrit_regicide_plot` (global, 0–100) is the Council's preparation. It starts at 20 (preparations began in 4A 1746, proposed). It rises by 0.5 × Seals a month after the focus *Prayers for the King* (the verdict) and through the Seals branch.

**The instrument** is chosen in `zin_afrit.11`:

| Instrument | Plot bonus | Risk | Notes |
| --- | --- | --- | --- |
| The physician's draught (the Houses' physicians at court) | +10 with *Remedies of the Royal Physicians* | Low: veil -2 at the end | Historical AI choice |
| A hunting accident (the Seat of Whispers) | +15 at once | Medium: 20% chance of `zin_afrit.13` | Faster |
| The fever-blessing (the Seat of Censers) | +5; the plot also gains 0.5 a month | Very low | Slow and safe |

The instrument is stored as the country flag `zin_worshipdom_instrument_physician`, `_hunt` or `_fever`. The text never says how the King dies in public; the Aenor spec's death event says he died, not why.

**Complications.** While the plot is between 40 and 90, every 90 days there is a 15% chance (halved with `zin_afrit_lost_cause_watched`) of one of:

- `zin_afrit.12` A Taster Falls Ill: silence the taster (veil -5) or pause (plot -10).
- `zin_afrit.13` The Lost Cause Asks Questions: bribe the inquiry (75 PP), discredit the scholar (veil -5), or let it run (the Aenor spec's investigation advances).

**Ready.** At plot 100, `zin_afrit.14` tells the hub privately. The focus *The Mistfall Vigil* (or, for the AI, the event alone) fires `zin_afrit.15` (Choose the Night):

| Option | Effect |
| --- | --- |
| At Mistfall (historical) | `zin_afrit_ready_regicide` runs on 15 Emberleaf of the current year (the month before Mistfall), or of the next year if that day has passed, so the death falls in Mistfall |
| Tonight | `zin_afrit_ready_regicide` now; veil -10 |
| Not this year | nothing for 365 days; the plot stays at 100 |
| Stay the hand | plot to 0; sets `zin_worshipdom_stay_hand`; opens the Kingdom Behind the Throne route |

`zin_afrit_ready_regicide` sets `zin_afrit_regicide_ready`. The Aenor spec's succession fires the Golden King's death within 30 days of that flag and sets `zin_golden_king_dead`.

**Exposure.** If the veil falls below 15 while the plot is above 0 and the King lives, or the Aenor spec's Lost Cause investigation completes, `zin_afrit.16` fires: `zin_afrit_regicide_exposed` is set, the plot resets to 0, veil -30, and the public news event `zin_afrit.17` says that "servants of the temples" were accused of plotting against the King. It does not name Afrit. The Aenor spec then opens its route of a Golden King who turns on the Council. A Golden King who survives is a proposed outcome, not history.

**Historical fallback.** Under the historical rule, if `zin_afrit_regicide_ready` is not set by 15 Emberleaf 4A 1750 (`1750.10.15`) and the plot is not exposed, the on-action sets it anyway. This keeps the established death in Mistfall 4A 1750 even if the Worshipdom no longer exists.

### The crowning

When `zin_golden_king_dead` is set and the plot was not exposed, the hub gets `zin_afrit.20` (The Seals Pass to the Deliverer). It needs `zin_aenor_council_dominant`; if that is false, the hub may still try with 150 PP and a 50% chance, failing into the Aenor spec's open succession.

| Option | Condition | Effect |
| --- | --- | --- |
| Take the crown (historical) | default; forced with `zin_worshipdom_commit_crown` | `zin_afrit_crown_aurevan` |
| Raise a pliant heir | forced with `zin_worshipdom_commit_heir`; AI never under HISTORICAL | sets `zin_afrit_kingdom_behind_throne`; the Aenor spec crowns its puppet heir; public news `zin_afrit.23` |

`zin_afrit_crown_aurevan`:

- sets `zin_aurevan_crowned`;
- moves `zin_aurevan` to Aenor as country leader; `zin_ilvane` leads the Worshipdom;
- Aenor: council influence +10 (+10 more with `zin_worshipdom_proclamation_ready`), stability +0.10 with that flag;
- refreshes the graces (now in Aenor, so the Necklace counts ×1.5);
- fires the public news `zin_afrit.21`: "The King is dead. The council and the temples have laid the crown before Aurevan, the Deliverer, who has guarded Aenor since the fall of Elzon. He is King of Aenor, First of His Name." (mask-safe);
- fires `zin_afrit.22` (Dissenters at Court) 30 days later: silence them (veil -5, Gathering Dark +2, council influence +5) or spare them (the Aenor spec's dissent grows).

**Royal Edicts.** While Aurevan rules Aenor, the hub may steer Aenor through decisions (Aenor stays its own country):

| Decision | Requires | Cost | Effect on Aenor |
| --- | --- | ---: | --- |
| `zin_afrit_edict_of_arms` | `zin_worshipdom_edicts_of_arms` | 75 PP | Idea `zin_afrit_edict_of_arms` 180 days: `army_org_factor` 0.05, `training_time_army_factor` -0.10 |
| `zin_afrit_edict_of_the_faithful` | — | 50 PP | Stability +0.05; footholds +1 in two Concord dominions |
| `zin_afrit_edict_of_the_temple_treasury` | — | 0 PP | Aenor -100 PP, hub +100 PP; veil -3 while secret; cooldown 180 days |
| `zin_afrit_edict_of_summons` | — | 75 PP | Concord loyalty +5 in every dominion (Aenor effect) |

With `zin_worshipdom_edicts_unc` (the Kingdom Behind the Throne) the same edicts are usable without the crown at double cost. Edict costs fall 5% per Seals level.

### The Yeldenne expedition

1. **The news.** After `zin_eindil_named`, `zin_afrit.31` (Word from the Lands of the Sun) fires to the hub. Delay: 30 days if the Gala Elves have footholds 1 or more, else 120 days; minus 5 days per Whispers level; minus 15 days each for `zin_worshipdom_western_ears` and `zin_worshipdom_early_warning`; never under 10 days. It sets `zin_afrit_knows_brother`. The private text may say "your brother"; the hub alone reads it.
2. **The decision** `zin_afrit_northern_voyage` (100 PP) becomes available. Under the historical rule the AI takes it at once. If Aurevan rules Aenor, Merovan governs while Afrit is away; with `zin_worshipdom_merovan_charge` Aenor loses no stability, otherwise Aenor gets stability -0.05 until he returns.
3. **The voyage** takes 60 days, 30 with `zin_worshipdom_cold_maps`. On arrival, `zin_afrit_at_yeldenne` is set.
4. **The ambush** (`zin_afrit.33`): ambush strength = 1 + `zin_worshipdom_ships_ready` + `zin_worshipdom_hunters` + (Whispers ≥ 4). Options: "Spare none" (historical; the Eindil spec's ambush kills the crew; strength sets how much the Eindil spec delays Eindil) or "Let them land" (alternative; Eindil arrives with his crew). Timing against Eindil's arrival is resolved by the Eindil spec; this spec only guarantees `zin_afrit_at_yeldenne` is set before the Eindil spec's arrival step under the historical rule.
5. **The hall** is owned by the Yeldenne and Glo spec. It sets `zin_horos_dead` and `zin_glo_with_eindil` on the historical path and calls `zin_afrit_wound`.
6. **The return** (`zin_afrit.34`): `zin_afrit_wound` sets `zin_afrit_wounded`, adds the idea `zin_afrit_deliverer_rests` (public name "The Deliverer Rests": `political_power_factor` -0.15, `stability_factor` -0.05, 365 days) to the realm Afrit leads, and veil -15. `zin_afrit_at_yeldenne` stays set (it records that he went).

If the hub chooses "Send others" in `zin_afrit.31`, Afrit does not go. The Council's agents ambush the crew (strength -1) and the Yeldenne spec resolves the hall without Afrit. This is an alternative route; it never reveals Afrit through Horos, so the veil loss in step 6 does not happen.

### The flight east and the King of the East

**Pressure.** `zin_afrit.50` (Aenor Cannot Hold) fires to the hub when Aurevan rules Aenor, `zin_war_of_last_crowns` is set, and at least three of `zin_western_crossing`, `zin_leren_withdrawal`, `zin_volgan_marches`, `zin_zol_rising` and "Aenor at war with an East Lands country" hold. Under the historical rule it fires on 1 Thaw 4A 1756 (`1756.3.1`) at the latest.

| Option | Condition | Effect |
| --- | --- | --- |
| Go east (historical) | at least 2 eastern candidates | `zin_afrit_flee_east` |
| Flee to the hermitage | fewer than 2 candidates | `zin_afrit_flee_east` without a proclamation |
| Stand in Parim | not under HISTORICAL | sets `zin_afrit_stand_in_parim`; Afrit stays king of Aenor |

An **eastern candidate** (`zin_afrit_eastern_candidate`) is an East Lands country with footholds 4 or more, not at war with the hub, not Volgan's and not a subject of Aenor. The South Lands lie off the map, so only East Lands countries qualify.

`zin_afrit_flee_east`:

- calls `zin_afrit_reveal` if the name is still secret;
- sets `zin_afrit_abandoned_aenor`;
- moves `zin_aurevan` back to the Worshipdom as leader; Aenor's throne is empty and the Aenor spec's succession camps resume;
- fires `zin_afrit.53` (The Chancellor's Choice): Merovan follows Afrit east, or stays in Parim. Both are offered and weighted 50/50 for the AI because the vault leaves his fate open;
- fires `zin_afrit.51` to every eastern candidate;
- 30 days later fires `zin_afrit.52` if at least 2 candidates accepted.

**The Deliverer Comes East** (`zin_afrit.51`, to each candidate): "Kneel to the King of the East" (joins the hub's faction, gives the hub military access, sets `zin_afrit_eastern_client`) or "Refuse him" (sets `zin_afrit_refused_east`). AI acceptance (proposed):

| Factor | Chance |
| --- | ---: |
| Base | 20 × footholds - 40 (40% at 4, 60% at 5) |
| Hub has `zin_worshipdom_roads_east` | +20 |
| Ruling ideology Dominion | +15 |
| Ruling ideology Light | -20 |
| Its rival has accepted (Noris and Stabilo are rivals) | -30 |
| Second embassy (*A Court in the East*) | +25 |
| Clamp | 5–95 |

Under the historical rule the two candidates with the highest footholds accept automatically (ties by states, then by tag). No text names them as history; the vault leaves open which kings joined.

**King of the East** (`zin_afrit_proclaim_king_of_east`, from `zin_afrit.52`): sets `zin_afrit_king_of_east`; the Worshipdom takes the cosmetic tag *The Eastern Throne* (`set_cosmetic_tag`, proposed name) and leads a faction of the same name; Aurevan's title becomes King of the East. Public news: "In the East, kings have knelt to the Deliverer and named him King of the East. Not every eastern crown agrees." After the reveal the news may use `zin_afrit_name`.

**The Host of the East** (`zin_afrit_raise_eastern_host`, args `divisions`): creates that many divisions of the template *Host of the East* (vanilla infantry until the warfare phase replaces it) for the hub, in the capital of the client with the most states. Each client loses 2,000 manpower per division, shared equally. Gathering Dark +1 per call.

### The return and the cliff

`zin_afrit_return` (the focus *The Return from the East*, or for the AI the event `zin_afrit.60`):

- available when `zin_afrit_king_of_east` and (`zin_volgan_body_destroyed` or `zin_zol_withdrawn` or after 1 Deepwinter 4A 1758);
- under the historical rule it fires 120 days after both `zin_volgan_body_destroyed` and `zin_zol_withdrawn`, or on 1 Ironfrost 4A 1758 (`1758.2.1`), whichever is first;
- sets `zin_afrit_returned`; the hub declares war on the controller of Parim (if not in its faction) and on the country that has `zin_eindil`; faction members are called; Gathering Dark +5.

**Brother against brother** (`zin_afrit.61`): fires when `zin_afrit_returned`, the hub is at war with the country that has `zin_eindil`, and the hub's side controls at least one Middle Lands state; or via the focus. It sets `zin_afrit_cast_down_eindil` and hands over to the Eindil spec, which owns the cliff, Eindil's wounds and his survival.

**Lord of all Erdae** (`zin_afrit.62`): fires when `zin_afrit_cast_down_eindil` is set and `zin_afrit_holds_parim` is true. `zin_afrit_retake_aenor`: if Aenor exists it makes white peace with the hub, `zin_aurevan` becomes its leader again and it joins the hub's faction; if Aenor no longer exists the hub annexes the Middle Lands states its side controls. Sets `zin_afrit_claims_erdae`. Public news: the proclamation of kingship over all Erdae, "larger than the lands he holds". Under the historical rule, if the hub's side does not hold Parim by 1 Fallowing 4A 1758 (`1758.9.1`), `set_state_controller` gives Parim to the hub's side and the event fires.

### The palace and Afrit's death

The Eindil spec calls `zin_afrit_begin_palace_battle` when Eindil enters the palace (historical: 4A 1759). It needs `zin_afrit_claims_erdae` or `zin_afrit_stand_in_parim` and not `zin_afrit_dead`. The chain runs four stages in established order. Each stage rolls Eindil's side's success; the hub chooses a defence in each.

| Stage | Event | Artifact | Base | Modifiers for Eindil's side |
| --- | --- | --- | ---: | --- |
| 1 The Eye and the Ring | `zin_afrit.71` | Ring of Doors | 60 | +20 if `zin_alleria` lives; -10 with `zin_worshipdom_palace_wards`; -5 with `zin_worshipdom_palace_wards_2`; -10 if the ring is attuned and Relics is 5 |
| 2 The Seals of the Crown | `zin_afrit.72` | Crown of Witnesses | 55 | +15 if Aenor council influence is below 50; -10 with `zin_worshipdom_oaths_renewed`; wards as above |
| 3 The Bracelet | `zin_afrit.73` | Bracelet of the First Seal | 55 | +15 with `zin_glo_with_eindil`; wards as above |
| 4 The Necklace | `zin_afrit.74` | Necklace of the Abyss | 50 | +30 if `zin_golbran_dead` is not set; -15 with `zin_glo_with_afrit`; -10 if the Necklace is attuned and Relics is 5; wards as above |

All stages: -2 × Relics. Clamp 5–95. Under the historical rule every stage succeeds.

Hub defences (one per stage, each once): "Burn the reserves" (150 PP, -10), "Draw on the Necklace" (only before stage 4, Gathering Dark +3, -10), "Through the doors" (stage 1 only, if the ring is attuned: Afrit escapes; the chain stops, `zin_afrit_palace_held` is set and the Eindil spec may restart it after 180 days).

- **Success:** `zin_afrit_lose_artifact` (sets the lost flag, artifacts -1, refreshes graces). After stage 4 succeeds: `zin_afrit.75` (public news, The False God Falls) and `zin_afrit_die`.
- **Failure:** the chain stops; `zin_afrit.76` (The Palace Holds) sets `zin_afrit_palace_held`; the Eindil spec decides what becomes of Eindil and may restart the chain after 180 days.

`zin_afrit_die`: sets `zin_afrit_dead`; removes `zin_aurevan` (`kill_country_leader` in his realm; `zin_ilvane` leads the Worshipdom); removes `zin_afrit_graces`; dismantles the Eastern Throne faction and clears the cosmetic tag; removes Sevrin from the advisor roster with the tooltip "His fate is unknown"; the Worshipdom AI seeks peace with every enemy that does not occupy its core states. From then on footholds decay: each month 3 countries lose 1 (deterministic order by footholds then tag). The Eindil spec owns Golbran's death, the Necklace on Eindil's neck and the coronation.

### The Ashen Throne

`zin_afrit_ashen_throne_ready` is true when all of these hold:

- not `zin_afrit_dead`, not `zin_eindil_crowned`, not `zin_afrit_lost_necklace`;
- `zin_afrit_holds_parim`;
- at least 12 countries (Aenor counted) have footholds 4 or more;
- and one of: (a) `zin_afrit_palace_held` and after 1 Deepwinter 4A 1759; (b) `zin_afrit_claims_erdae` and after 1 Deepwinter 4A 1760; (c) `zin_afrit_stand_in_parim`, `zin_war_of_last_crowns` and after 1 Deepwinter 4A 1760.

`zin_afrit_holds_parim` is true when Parim's state (`zin_is_site_parim`) is controlled by the realm `zin_aurevan` leads, by the Worshipdom, by a member of the Worshipdom's faction, or by a subject of the Worshipdom.

World systems ([03_gameplay/05_world_tension_and_endings.md](../03_gameplay/05_world_tension_and_endings.md)) set `zin_ending_ashen_throne` when the trigger is true, either through the focus *The Ashen Throne* or its own monthly check. The ending's text names Afrit (it is after the reveal or reveals him).

### Alternative routes

None of these is canon. Each is a gameplay outcome.

| Route | How | Result |
| --- | --- | --- |
| The Kingdom Behind the Throne | *Pray for Patience* → *Long Live the Golden King*, or *A Pliant Heir* at the crowning | Afrit never takes the crown; the Council rules through the Golden King or a puppet heir; counts toward the proposed outcome of a surviving Golden Court |
| The plot exposed | Veil below 15 during the plot, or the Lost Cause's investigation | The Golden King turns on the Council (Aenor spec) |
| Unmasked too soon | Veil 0 before the crowning | Penalties above; the Unmasked branch opens |
| Stand in Parim | *Parim Shall Not Fall*, or option in `zin_afrit.50` | Afrit never flees; Ashen Throne path (c) |
| Cast off the mask | Voluntary reveal after the crowning with all four artifacts and Censers 4+ | Fear and open worship; Ashen Throne path |
| No eastern reserve | Fewer than 2 candidates at the flight | Afrit flees only to the hermitage; the return is weak |
| Glo taken | Yeldenne spec off-path outcome | `zin_glo_with_afrit`; the palace gets harder |
| Send others to Yeldenne | Option in `zin_afrit.31` | Afrit is not wounded and not named by Horos |
| The palace holds | A failed palace stage | Ashen Throne path (a) |

### Playing the Worshipdom without revealing too early

The hub player plays a long game with a budget: the veil.

**What the player sees.** The focus tree shows public faces. The Council panel (a scripted GUI, specified in [07_interface](../07_interface/)) shows the veil, the plot, the four seats, the artifacts and a map mode of footholds. Private events explain each step in plain words.

**Safe actions** (raise or keep the veil): charity focuses, hymns, miracles, the Ledger of Debts, Renewing the Thousand Oaths, the Radiant Face, Patrons of the Lost Cause, deepening footholds in Wild and already-captured courts.

**Risky actions** (cost veil): opening houses in watchful courts (Selen, Mirolon, elves, Light countries), drawing on the Necklace, sending the thief, a botched silencing, a fast instrument, striking "tonight", silencing the claimants.

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
| Aenor (Golden Court, succession, Lost Cause) | `zin_afrit_regicide_ready`, `zin_afrit_regicide_exposed`, `zin_aurevan_crowned`, `zin_afrit_kingdom_behind_throne`, `zin_afrit_lost_cause_watched`, `zin_afrit_abandoned_aenor` | `zin_golden_king_dead`; calls `zin_afrit_add_veil` when the Lost Cause finds evidence; owns `zin_council_influence`, `zin_court_corruption`, `zin_concord_loyalty` and their effects |
| Eindil's journey | `zin_afrit_knows_brother`, `zin_afrit_at_yeldenne`, ambush strength, `zin_afrit_scholars_bought`, `zin_afrit_impostor_denounced`, `zin_afrit_cast_down_eindil`, `zin_afrit_lost_*` | calls `zin_afrit_add_veil` on each warning; calls `zin_afrit_begin_palace_battle` |
| Yeldenne and Glo | `zin_afrit_at_yeldenne` | sets `zin_horos_dead`, `zin_glo_with_eindil` or `zin_glo_with_afrit`; calls `zin_afrit_wound` |
| World systems | `zin_afrit_ashen_throne_ready`, all story flags | `zin_war_of_last_crowns`, endings; `zin_world_add_gathering_dark` |
| The East (Noris, Stabilo, eastern kings) | `zin_afrit_eastern_client`, `zin_afrit_refused_east`, `zin_afrit_king_of_east` | eastern invasion of the Magical Lands (independent of Afrit) |
| Lerendor | report event `zin_worshipdom.4` | `zin_strait_standing` |
| Volgan, Zol | none (caps 0) | `zin_volgan_body_destroyed`, `zin_zol_withdrawn` time the return |
| Elves | Friends Among the Elves (non-aggression offer) | — |

Gathering Dark contributions from this spec: crowning dissenters silenced +2, *Silence the Claimants* +3, *The Necklace Wakes* +2, Draw on the Necklace +2, the reveal +5, unmasked early +10, eastern host +1 per call and +5 for *The Host of the East*, the return +5, *Servants Beyond the Veil* +3.

## Implementation

### Files

| Path | Content |
| --- | --- |
| `common/scripted_effects/zin_afrit.txt` | All `zin_afrit_*` scripted effects |
| `common/scripted_triggers/zin_afrit.txt` | All `zin_afrit_*` scripted triggers |
| `common/scripted_localisation/zin_afrit.txt` | `zin_afrit_name`, `zin_wsd_<key>_name/_desc` two-face entries, decision category name |
| `common/decisions/categories/zin_afrit.txt`, `common/decisions/zin_afrit.txt` | Category `zin_afrit_council` and its decisions; `zin_afrit_purge_houses` sits in the world systems' realm category |
| `common/dynamic_modifiers/zin_afrit.txt` | `zin_afrit_houses`, `zin_afrit_graces` |
| `common/ideas/zin_afrit.txt` | Mechanic ideas: `zin_afrit_deliverer_rests`, `zin_afrit_unmasked`, `zin_afrit_necklace_drawn`, `zin_afrit_edict_of_arms` |
| `common/country_leader/zin_afrit_traits.txt` | `zin_trait_deliverer`, `zin_trait_unmasked`, advisor traits |
| `common/characters/` (generated per country) | `zin_aurevan`, `zin_ilvane`, `zin_corvel`, `zin_sevrin` in the Worshipdom; `zin_merovan` in Aenor |
| `common/on_actions/zin_afrit.txt` | `on_startup` → `zin_afrit.1`; `on_monthly` → `zin_afrit.2` for the hub; `on_capitulation` and `on_state_control_changed` checks for Parim |
| `common/game_rules/zin_afrit.txt` | `zin_rule_afrit` |
| `events/zin_afrit.txt` | Namespace `zin_afrit` |
| `common/scripted_guis/zin_afrit_council.txt`, `interface/zin_afrit_council.gui` | The Council panel (layout in 07_interface) |
| `localisation/english/zin_afrit_l_english.yml` | All text, public and private keys separate |

All files are generated by the content builder and written through the shared rewrite engine.

### Variables

| Variable | Scope | Range | Start | Meaning |
| --- | --- | --- | ---: | --- |
| `zin_footholds` | every country | 0–5 | table above | contract |
| `zin_afrit_artifacts` | global | 0–4 | 4 | contract |
| `zin_afrit_veil` | global | 0–100 | 80 | strength of the secret |
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
| `zin_afrit_regicide_ready` | The plot is ready; Aenor fires the King's death within 30 days |
| `zin_afrit_regicide_exposed` | The plot was exposed |
| `zin_afrit_kingdom_behind_throne` | The Council rules through a living King or puppet heir instead of crowning Aurevan |
| `zin_afrit_lost_cause_watched` | The Council watches the Lost Cause's court branch |
| `zin_afrit_knows_brother` | Afrit has learned that Eindil lives and was named |
| `zin_afrit_at_yeldenne` | Afrit's expedition reached Yeldenne |
| `zin_afrit_wounded` | Afrit was wounded at Yeldenne |
| `zin_glo_with_afrit` | Off-path: Afrit holds Glo |
| `zin_afrit_scholars_bought` | Scholars of the First Men are bought |
| `zin_afrit_impostor_denounced` | The crown has denounced Eindil as an impostor |
| `zin_afrit_unmasked_early` | Revealed before the crowning |
| `zin_afrit_abandoned_aenor` | Afrit has left Aenor |
| `zin_afrit_stand_in_parim` | Afrit chose to hold Parim instead of fleeing |
| `zin_afrit_returned` | Afrit has returned from the East |
| `zin_afrit_cast_down_eindil` | Afrit has cast Eindil from the cliff |
| `zin_afrit_claims_erdae` | Afrit has retaken Parim and claims all Erdae |
| `zin_afrit_lost_ring`, `_crown`, `_bracelet`, `_necklace` | Artifact lost |
| `zin_afrit_attuned_ring`, `_crown`, `_bracelet`, `_necklace` | Artifact attuned |
| `zin_afrit_palace_held` | A palace stage failed; Afrit holds the palace |

Country flags: `zin_afrit_suspicious` (730 days), `zin_afrit_houses_purged` (365 days), `zin_afrit_eastern_client`, `zin_afrit_refused_east`. Tree-local flags `zin_worshipdom_*` are listed in the tree spec.

### Characters

| Id | Name | Status | Country | Role |
| --- | --- | --- | --- | --- |
| `zin_aurevan` | Aurevan the Deliverer (public), Afrit (private) | contract | Worshipdom | Country leader; field marshal from *The Eastern War Council* (`add_field_marshal_role`, skill 5, trait from the warfare spec) |
| `zin_merovan` | Chancellor Merovan | contract | Aenor | Head of government; secret Seat of Seals |
| `zin_sevrin` | Sevrin | contract (hidden) | Worshipdom | Advisor after the focus `a_guest_who_does_not_age` |
| `zin_ilvane` | Ilvane, High Confessor | proposed, new | Worshipdom | Advisor; leads the Worshipdom while Afrit is elsewhere |
| `zin_corvel` | Corvel, Master of Couriers | proposed, new | Worshipdom | Advisor |

### Scripted triggers

| Trigger | Scope | True when |
| --- | --- | --- |
| `zin_afrit_is_hub` | country | original tag is the Worshipdom's and it exists |
| `zin_afrit_rules_here` | country | `has_country_leader` with character `zin_aurevan` |
| `zin_afrit_is_secret` | any | not `zin_afrit_revealed` |
| `zin_afrit_can_deepen_foothold` | country (target) | below its cap; not at war with the hub; no `zin_afrit_houses_purged`; not the hub |
| `zin_afrit_eastern_candidate` | country | definition above |
| `zin_afrit_holds_parim` | any | definition above |
| `zin_afrit_ashen_throne_ready` | any | definition above |

### Scripted effects

| Effect | Scope | Args | Does |
| --- | --- | --- | --- |
| `zin_afrit_add_footholds` | target country | `value` | Adds, clamps to 0 and the cap, refreshes `zin_afrit_houses` |
| `zin_afrit_spread_footholds` | any | `region` (region name or `any`), `value`, `count`, `min` (default 0), `below` | Raises up to `count` countries of the region whose footholds are at least `min` and below `below`; order: highest footholds first, then tag |
| `zin_afrit_compute_watch` | target country | — | Sets temp `zin_afrit_watch` |
| `zin_afrit_add_veil` | any | `value` | Halves losses with *The Radiant Face*; clamps 0–100; ignored after the reveal; at 0 calls `zin_afrit_reveal` |
| `zin_afrit_add_plot` | any | `value` | Clamps 0–100; at 100 fires `zin_afrit.14` once |
| `zin_afrit_raise_seat` | any | `seat`, `value` | Clamps 0–5 |
| `zin_afrit_attune_artifact` | any | `artifact` | Sets the attuned flag; refreshes graces |
| `zin_afrit_refresh_graces` | any | — | Recomputes `zin_afrit_graces` on the realm Afrit leads |
| `zin_afrit_ready_regicide` | any | — | Sets `zin_afrit_regicide_ready` |
| `zin_afrit_crown_aurevan` | any | — | The crowning (above) |
| `zin_afrit_wound` | any | — | The Yeldenne wound (above) |
| `zin_afrit_reveal` | any | `voluntary` (optional) | The reveal (above) |
| `zin_afrit_flee_east` | any | — | The flight (above) |
| `zin_afrit_proclaim_king_of_east` | any | — | The proclamation (above) |
| `zin_afrit_raise_eastern_host` | hub | `divisions` | The host (above) |
| `zin_afrit_wargoal_refuser` | hub | — | Wargoal on the refuser with the most states |
| `zin_afrit_return` | hub | — | The return (above) |
| `zin_afrit_retake_aenor` | hub | — | Lord of all Erdae (above) |
| `zin_afrit_claim_middle_lands` | hub | — | Claims on every Middle Lands state its side does not control |
| `zin_afrit_begin_palace_battle` | any | — | Starts `zin_afrit.70` |
| `zin_afrit_lose_artifact` | any | `artifact` | Lost flag, artifacts -1, refresh |
| `zin_afrit_die` | any | — | Death (above) |
| `zin_afrit_purge_houses` | target country | — | Purge (above) |

Each effect shows one mask-safe custom tooltip and hides its work while `zin_afrit_is_secret`.

### Decisions

Category `zin_afrit_council` ("The Hermitage Chapter" / "The Hidden Council"), visible when `zin_afrit_is_hub` and not `zin_afrit_dead`.

| Decision | Available | Cost | Effect |
| --- | --- | ---: | --- |
| `zin_afrit_open_house` (targeted) | `zin_worshipdom_houses_open`; target passes `zin_afrit_can_deepen_foothold` | 25 + 15 × level, -4% × Censers | 60 days; roll as above |
| `zin_afrit_hear_confession` (targeted) | `zin_worshipdom_confessors`; target footholds 3+ | 30 (-25% with birth rolls) | `add_intel` on the target (+30% civilian, +20% army); private report `zin_afrit.7` listing the target's story flags |
| `zin_afrit_call_debt` (targeted) | `zin_worshipdom_debts`; footholds 4+ | 50 | `zin_afrit.6` to the target: send 500 infantry equipment, grant military access, or refuse (footholds -1) |
| `zin_afrit_silence_dissenter` | `zin_worshipdom_quiet_hands` | 40 | veil +8; 25% botched: veil -10 instead; Gathering Dark +1 |
| `zin_afrit_steer_the_court` | `zin_worshipdom_merovan`; Aenor not ruled by Aurevan | 50 | Aenor council influence +5; 90-day cooldown |
| Royal Edicts (four) | above | above | above |
| `zin_afrit_open_famine_stores` (targeted) | `zin_worshipdom_famine_stores`; target at war or stability below 40% | 50 | target stability +0.05, opinion of the hub +20, footholds +1 (within cap) |
| `zin_afrit_draw_on_necklace` | not `zin_afrit_lost_necklace` | 100 | above |
| `zin_afrit_send_the_thief` (targeted) | `zin_worshipdom_thief`; Sevrin hired | 75 | 45 days; `add_tech_bonus` 50% once in a category where the target leads; veil -3; 20% caught: veil -10, target opinion -30 |
| `zin_afrit_northern_voyage` | `zin_afrit_knows_brother`; not `zin_afrit_at_yeldenne` | 100 | above |
| `zin_afrit_raise_the_faithful` (targeted) | `zin_worshipdom_faithful_rise`; `zin_afrit_revealed`; target footholds 5 | 150 | 30 days; target Shadow popularity +0.20; if Shadow is 40% or more, `start_civil_war` with the Shadow side joining the hub's faction |

### Events (namespace `zin_afrit`)

"Private" events go only to the hub and may name Afrit. "Public" events must pass the secrecy check.

| Id | Title | To | Trigger | Options |
| --- | --- | --- | --- | --- |
| .1 | (hidden) The Council Sits | all | `on_startup` | Sets every start value |
| .2 | (hidden) The Council's Month | hub | `on_monthly` | Veil regeneration, tithes, plot, seat drifts, graces refresh, foothold decay after death, historical fallbacks |
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
| .15 | Choose the Night | hub, private | *The Mistfall Vigil* or plot 100 (AI) | At Mistfall / Tonight / Not this year / Stay the hand |
| .16 | The Plot Exposed | hub, private | Exposure | One option |
| .17 | Treason in the Golden Court | all, public | After .16 | One option; no name |
| .20 | The Seals Pass to the Deliverer | hub, private | `zin_golden_king_dead` | Take the crown / Raise a pliant heir (/ Rule from Parim in person, human only) |
| .21 | Aurevan, First of His Name | all, public | Crowning | One option |
| .22 | Dissenters at Court | hub, private | 30 days after .21 | Silence / Spare |
| .23 | A New King in Parim | all, public | Pliant heir | One option |
| .30 | A Stranger from the Ice | hub, private | `zin_eindil_war_king` and `zin_worshipdom_western_ears` | One option; rumour only |
| .31 | Word from the Lands of the Sun | hub, private | Delay after `zin_eindil_named` | Go north myself / Send others |
| .32 | The Northern Voyage | hub, private | Decision taken | One option; Merovan left in charge |
| .33 | The Ambush on the Shore | hub, private | Arrival | Spare none / Let them land |
| .34 | Return from Yeldenne | hub, private | `zin_afrit_wound` | One option |
| .35 | The Green Light Taken | hub, private | `zin_glo_with_afrit` | One option |
| .40 | The Impostor's Warnings | hub, private | First Eindil warning | Denounce him (opens the focus) / Hunt him (veil -5; hands a hunt to the Eindil spec) / Ignore him |
| .41 | The Veil Thins | hub, private | Veil below 30 | One option |
| .42 | The Name Is Spoken | hub, private | Reveal | One option |
| .43 | The Name Behind the Deliverer | all, public | Reveal | One option; may name Afrit |
| .44 | Unmasked Too Soon | hub, private | Early reveal | One option |
| .45 | The Houses Under Suspicion | Light countries | Reveal | Close the Houses (AI 60%) / Watch them (AI 40%) |
| .50 | Aenor Cannot Hold | hub, private | Pressure | Go east / Flee to the hermitage / Stand in Parim |
| .51 | The Deliverer Comes East | each candidate | Flight | Kneel / Refuse |
| .52 | A King in the East | all, public | 30 days after flight | One option |
| .53 | The Chancellor's Choice | hub, private | Flight | Merovan follows / Merovan stays |
| .54 | The War Council of the East | hub, private | *The Eastern War Council* | One option; field-marshal role |
| .60 | The Return from the East | hub, private | `zin_afrit_return` | One option |
| .61 | Brother Against Brother | hub, private | Conditions above | One option; hands over to the Eindil spec |
| .62 | Lord of All Erdae | all, public | Conditions above | One option |
| .70 | The Palace Wards | hub, private | `zin_afrit_begin_palace_battle` | One option; starts stage 1 |
| .71–.74 | The four stages | hub, private | Chain | Defences above |
| .75 | The False God Falls | all, public | Stage 4 succeeds | One option |
| .76 | The Palace Holds | hub, private | A stage fails | One option |
| .80 | The Ashen Throne | hub, private | `zin_ending_ashen_throne` | One option |
| .90 | A Healing in [country] | target, public | Random, footholds 2+, while secret (MTTH 720 days) | One option: stability +0.01 |
| .91 | The Pilgrims' Tale | hub, private | Random flavour | One option |
| .92 | The Thief Grows Restless | hub, private | Sevrin hired, every ~2 years | Send him out (veil -2, 50 PP) / Keep him close |

Pictures come from the event picture catalog (08_art_and_assets): `zin_evt_hermitage`, `zin_evt_council_chamber`, `zin_evt_golden_court`, `zin_evt_coronation`, `zin_evt_cold_shore`, `zin_evt_eastern_court`, `zin_evt_palace_battle`, `zin_evt_houses`. All image-generated.

### Game rule

`zin_rule_afrit` ("Afrit's Path"):

| Option | Meaning |
| --- | --- |
| `DEFAULT` | Follows `zin_rule_historical_path`: historical when that rule is on, else `FREE` |
| `HISTORICAL` | AI and fallbacks keep the established path |
| `FREE` | AI weighs every option; no date fallbacks |
| `ASHEN` | AI aims for the Ashen Throne: Stand in Parim, Cast Off the Mask, no flight |
| `DORMANT` | The Council never strikes: Pray for Patience, the Kingdom Behind the Throne |

### Defines

None.

## AI

- **Peace first.** The Worshipdom AI has `ai_focus_peaceful_factor` from its spirits and never declares war before `zin_war_of_last_crowns`. After the flight it gets `add_ai_strategy` `conquer` against refusers only under `FREE` and `ASHEN`.
- **Veil discipline.** The AI does not take risky decisions while the veil is below 40. It takes *The Radiant Face* when the veil is below 50 (weight ×3).
- **Footholds.** The AI opens houses at most once per 60 days, preferring targets in this order: East Lands countries at 3+, the Lands of the Sun until the Gala Elves reach 1, Concord dominions, others. It never targets watch 5+ while the veil is below 60.
- **The plot.** Under HISTORICAL the AI follows the route in the tree spec, picks the physician, and chooses "At Mistfall". Under FREE it chooses "At Mistfall" 60%, "Not this year" 30%, "Tonight" 10%.
- **Yeldenne.** Under HISTORICAL the AI takes the voyage at once and spares none. Under FREE it goes itself 80%.
- **Flight.** HISTORICAL: go east. FREE: go east if 2+ candidates (70%), else stand. ASHEN: stand.
- **Return.** Under HISTORICAL and FREE the AI takes the return as soon as available.
- **Palace.** The AI uses "Burn the reserves" if it has 150 PP, else "Draw on the Necklace". Under HISTORICAL defences still cost resources but every stage succeeds.
- **Other countries.** Eastern candidates use the acceptance table. Light countries close the houses after the reveal at 60%; the Lost Cause's members at 50%; others at 10%, ×3 if the target has `zin_afrit_suspicious`.
- **Edicts.** The AI uses the Edict of Summons when Aenor is at war and the Temple Treasury when the hub has under 50 PP.

## Acceptance

1. On 1 Thaw 4A 1748: `zin_afrit_artifacts` = 4, `zin_afrit_veil` = 80, `zin_afrit_regicide_plot` = 20, seats 3/2/1/2, footholds match the start table, and the Worshipdom is at war with no one.
2. The compiler's secrecy check passes: no text reachable by a non-hub player before `zin_afrit_revealed` contains "Afrit" or "demon"; the public faces of every masked focus and spirit are clean.
3. Opening every focus tooltip of the Worshipdom as another country shows only mask-safe tooltips (manual check in the Linux run, recorded with an MCP render, never a game screenshot).
4. With `zin_rule_afrit` = HISTORICAL and no player, a test run reaches: `zin_aurevan_crowned` in Mistfall 4A 1750 (±30 days); `zin_afrit_knows_brother` in 4A 1752; `zin_afrit_at_yeldenne` before the Eindil spec's arrival step; `zin_afrit_revealed` between 4A 1754 and 4A 1756; `zin_afrit_king_of_east` in 4A 1756 with at least 2 East Lands countries in the faction; `zin_afrit_returned` in 4A 1758; `zin_afrit_dead` in 4A 1759; `zin_afrit_artifacts` = 0 at death.
5. `zin_afrit_reveal` runs at most once; `zin_afrit_revealed` is set exactly once in every test run that sets it.
6. Under HISTORICAL, deleting the Worshipdom by console on day 1 still yields `zin_golden_king_dead` in Mistfall 4A 1750.
7. A scenario test sets `zin_afrit_claims_erdae`, holds Parim and 12 countries at footholds 4+, sets `zin_afrit_palace_held` and the date to 1759.1.2: `zin_afrit_ashen_throne_ready` is true and the world systems set `zin_ending_ashen_throne`.
8. A scenario test drives the veil to 0 before the crowning: `zin_afrit_unmasked_early` is set, the plot is exposed, and footholds drop as specified.
9. Footholds never exceed a country's cap through any effect except the start table; Volgan, Zol and Yeldenne stay at 0 for a whole test run.
10. Every modifier named here exists in `modifiers_documentation.md`; every effect and trigger named exists in the effect and trigger documentation; the HOI4 Agent Tools script validator reports no errors for the generated files.
11. 60 days and a full historical run produce no new errors from ZIN files in the Linux run.

## Open questions

1. Do you approve the four seats and their public chapter names, and the new holders **Ilvane** (High Confessor) and **Corvel** (Master of Couriers)? Should **Sevrin** hold the Seat of Relics?
2. The roster gives the Worshipdom the Shadow ideology. A Shadow temple-state may look sinister to other players. Should its party be localised as "The Faithful of the Deliverer" and shown as neutral until the reveal, or should the Worshipdom start as Light or Wild?
3. Is it right that Afrit already holds all four artifacts in 4A 1748, given the proposed dates for the theft (4A 1611) and the lesser artifacts (4A 1611–1700)?
4. Where does the King of the East sit? This spec keeps the Worshipdom as his court with a cosmetic name. Would you prefer that he takes the throne of an eastern client instead?
5. Should a human Worshipdom player be offered the switch to Aenor at the crowning?
6. Should the Worshipdom keep a playable story after Afrit's death (the faithful without their god), or go quiet?
7. Do the elven caps (footholds at most 2) and the zero caps for Volgan's realms, Zol and Yeldenne match your view of Afrit's reach?
8. What does Afrit's death do to the Houses of the First Light, which many people serve sincerely? This spec only lets the network decay.
