# Aenor: the Golden Court and the succession

**Status:** Ready. Reviewed 19 October 2026 against CONVENTIONS "Status"; integrated 19 October 2026. **Priority:** 3. **Phase:** 3.

## Purpose

Aenor is the centre of the story. At the start it is rich, strong and at peace, and rotten inside. This spec defines the systems that make that true in play and carry Aenor from the peaceful year of 4A 1748 to Eindil's coronation in 4A 1760, or to another ending:

1. **The Golden Court:** the King's extravagance, measured by `zin_court_corruption`.
2. **Temple Favour:** the Hidden Council's grip on the government, `zin_council_influence`, as Aenor sees it.
3. **The Concord charters:** the 26 dominions of the Middle Kingdom Concord, their charters and `zin_concord_loyalty`.
4. **The Lost Cause:** the King's league against the dark, which can stay an ornament, become the Concord's shield or become Eindil's army.
5. **The death clock:** the hidden countdown to the Golden King's murder.
6. **The Empty Throne:** the four-camp succession war after his death.
7. **Civil wars and dynamic countries:** how the camps become countries.
8. **The abandoned throne, the hailed king and the Crown of Aen:** Afrit's flight, Eindil's return and his crowning.

The focus tree that drives these systems is [../05_focus_trees/major/aenor.md](../05_focus_trees/major/aenor.md). The story events around them are [../06_events/01_golden_king_and_succession.md](../06_events/01_golden_king_and_succession.md). Shared names come from [00_shared_contract.md](00_shared_contract.md) and [00_contract_additions.md](00_contract_additions.md). The Hidden Council's side of every moment below is [afrit_hidden_council.md](afrit_hidden_council.md).

## Lore basis

| Fact | Status | Source |
| --- | --- | --- |
| The Golden King is a famously bad king: greedy, sells offices, rewards flatterers, keeps a strong army, rules badly; strong institutions keep Aenor running | established | *Golden King*, compendium |
| The Golden King founds and first leads the Lost Cause, against dark powers and for prestige | established | *The Lost Cause* |
| The Golden King is Afrit's puppet; Afrit secretly engineers his death; the killer stays hidden until uncovered | established | *Golden King*, compendium |
| After his death a succession war involves the Golden Court, the Free Dominions, Afrit's supporters and Eindil's popular host; the victor is a possible ending, not settled history | established | *Kingdoms Factions and Conflicts* |
| Afrit is proclaimed King of Aenor under his public name; most obey; dissenters are silenced | established (public name Aurevan proposed) | *The Fourth Age of Erdae* |
| Afrit leaves a council member in charge of Aenor while he goes north | established (name Merovan proposed) | *Afrits Hidden Council* |
| The Lost Cause survives in altered form; court branches suppress Eindil, frontier and scholarly branches help him | established direction; branch detail proposed | *The Lost Cause* |
| Westerners take the capital; Afrit abandons Aenor for an eastern host | established | *Fourth Age Canon Register* |
| Survivors hail Eindil; he is crowned King of Aenor after Afrit's death, ending the Fourth Age | established | *The Fourth Age of Erdae* |
| Aenor leads the Middle Kingdom Concord of 26 satellites; Cursed Lands and Bloody Forest resist | established working table | *Great Powers and Relations* |
| The Charters of Parim (4A 3), the Lost Cause founded 4A 1741, the Golden Court completed 4A 1733, the King's death in Mistfall 4A 1750 | proposed dates | *Fourth Age Chronology* |
| Start: the Golden King reigns, Eindil has not appeared, Afrit is unrevealed, Erdae seems at peace | owner-fixed | *The Campaign of 4A 1748* |
| Prince Eronel of Arcedor, a collateral cousin, is the Golden Court's candidate | proposed | [02_lore/02_characters.md](../02_lore/02_characters.md); owner's short list 2 |
| Every number, variable, threshold, charter type, camp mechanic, collective leader and event below | **proposed** | this spec |

Open in the vault and kept open here: the Golden King's personal name, relatives and heirs of his body; who Merovan really is and his fate; whether the Lost Cause formally survives the final war; what becomes of the Golden King's faction and Afrit's followers after the coronation; what the Necklace of the Abyss does to Eindil. Text never answers these. The riders' land is written **Hunhun** (owner's short list 15, proposal).

## Decisions applied

| Decision | How this spec applies it |
| --- | --- |
| D1, D5 | Aenor starts with 0% Shadow. The Deliverer's camp is never shown as Shadow before `zin_afrit_revealed` (section 6). |
| D3 | The exposure of the plot (section 5) never names Afrit and never sets `zin_afrit_revealed`. |
| D8 | *Pacify the Bloody Forest* is a tree focus with AI weight 0 before `zin_golden_king_dead` ([aenor.md](../05_focus_trees/major/aenor.md)). |
| V1 | Corruption starts at 70. Council influence starts at 65 (this spec owns the variable, so its value wins over the start-situation table's 70). |
| V4 | Every floor date here is written at the standard pace and scaled by `zin_story_pace` (Implementation, "Dates"). |
| N4 | The rule is `zin_rule_golden_king_death`. |
| S3 | The Lost Cause is an institution at the start. It becomes a game faction only in the succession (section 4). |
| S9 | The tree's events share the namespace `zin_aenor` through the compiler's event id base (500). |
| N12 | `zin_golden_king_plot_exposed` is the one exposure flag and `zin_aenor_expose_plot` the one exposure path (section 5). |
| N14 | The Faithful camp and a crowned Aenor of the Faithful are Light (`zin_light_sanctuary`) until `zin_afrit_revealed`, Shadow after; never `zin_dom_divine` before the reveal (section 6). |
| N15 | The King dies only when the Council's `zin_afrit_regicide_ready` and this spec's clock both allow; `zin_reign.19` fires one day before the scheduled death (section 5). |
| O1, S2 | Eindil moves to an Aenor realm only at his coronation: hailing him changes no leader (section 8). |
| O4 | The stranger's warning is the journey's `zin_eindil.82`; this spec has no warning event of its own. |
| O8 | Mirolon is not a Lost Cause member at the start: Parim laughed at its envoy (Mirolon tree). |
| E1 | Scripted effects take no parameters: arguments compile to `zin_arg_<name>` (codes in "Scripted effects"). |
| E2 | Every event sets `timeout_days = 30`; a human-facing checkpoint event lists its non-committal option first and the historical option second. |
| E3 | Factions are made with `create_faction_from_template` (section 7). |
| E7 | The key-sites table owns every site trigger this spec reads, including `zin_aenor_fallback_seat`. |
| F7 | This spec owns `zin_aenor_event_for_parim`, the one effect that fires an event to the Aenor realm holding Parim. |

## Design

### The shape of the campaign for Aenor

| Period (proposed) | Aenor's government | What the player does |
| --- | --- | --- |
| 1 Thaw 1748 – Mistfall 1750 | The Golden King; Chancellor Merovan holds the seals | Court, treasury, Concord charters, the Lost Cause, temples, army. Peaceful. The death clock runs unseen. |
| Mistfall 1750, 30 days | Interregnum ("the Thirty Days") | Choose and back one of the four camps; the others may rise |
| 1750 – 1756 (historical) | The Deliverer's Faithful under Aurevan | The Deliverer's Crown branch; the Free Dominions drift; Eindil's warnings (1754) |
| 1755 – | Any | The War of the Last Crowns: Aenor Beset |
| 1756 (historical) | The Captains' Regency after Afrit's flight | Hold on; send for the stranger |
| 1757 – 1760 (historical) | Eindil, the Hailed King | The King Without a House branch; retake Parim |
| 1760 (historical) | Eindil crowned | The Crown of Aen |

Nothing in the first period reveals Afrit, shows Eindil or starts a great war. Every war branch unlocks from a story flag or a deliberate choice.

### 1. The Golden Court: `zin_court_corruption`

The Golden Court is the palace district of Parim where offices, titles and charters are bought (proposed). Corruption is Aenor-scoped, 0–100.

| Item | Value (proposed) |
| --- | --- |
| Start | 70 |
| Monthly drift | +0.5 while the Golden King lives and corruption is below 90; 0 after his death |
| Floor | 25 while the Golden King lives (he keeps selling offices) |
| Shown as | The national spirit **The Golden Court**, a dynamic modifier whose values scale with corruption; the number appears in the Golden Court panel ([07_interface/01_interface.md](../07_interface/01_interface.md), section 5) |

Dynamic modifier `zin_aenor_golden_court` (values at corruption *c*):

| Modifier | Formula | At 70 |
| --- | --- | --- |
| `political_power_gain` | +0.01 × *c* | +0.70 |
| `consumer_goods_factor` | +0.002 × *c* | +0.14 |
| `stability_factor` | −0.001 × *c* | −0.07 |
| `production_factory_max_efficiency_factor` | −0.001 × *c* | −0.07 |

Thresholds:

| Range | Name | Effect |
| --- | --- | --- |
| ≥ 80 | Gilded Rot (`zin_aenor_court_gilded`) | Scandal events (zin_aenor.12) about every 120 days; dominion loyalty drift doubles its corruption term |
| 31–79 | — | none |
| ≤ 30 | Honest Court | Court camp support −10 at the succession; Golden Charters cannot be issued |

Corruption feeds the Golden Court camp at the King's death (section 6). The treasury `zin_aenor_gold` and its decisions belong to the economy spec ([03_gameplay/02_economy.md](../03_gameplay/02_economy.md)); this spec only reads it.

**Start spirit.** Aenor also starts with `zin_aenor_seventeen_centuries` *Seventeen Centuries of the Crown* (`stability_factor` +0.10, `production_speed_buildings_factor` +0.10), the institutions that keep a bad king's kingdom running ([02_lore/01_start_situation.md](../02_lore/01_start_situation.md)). This spec owns it: it is removed when the first Aenor civil war starts (section 7) and is never restored.

### 2. Temple Favour: `zin_council_influence` seen from Aenor

The Hidden Council governs through the temples, the Houses of the First Light and the King's councillors. Aenor owns this variable (contract); the Afrit spec's actions add to it through `zin_aenor_add_council_influence`.

| Item | Value (proposed) |
| --- | --- |
| Start | 65 |
| Monthly drift | +0.25 while the Golden King lives |
| Shown as | **Temple Favour** in the Golden Court panel: "how many offices are held by friends of the temples". After the focus *The Hidden Hand* (country flag `zin_aenor_hidden_hand_seen`) the same meter is relabelled **The Hidden Hand**. No label ever names Afrit or the Council before `zin_afrit_revealed`. |

Dynamic modifier `zin_aenor_temple_favour` (influence *i*): `stability_factor` +0.001 × *i*, `drift_defence_factor` +0.004 × *i*, `monthly_population` +0.002 × *i*. The temples genuinely help; that is the trap.

| Range | Name | Effect |
| --- | --- | --- |
| ≥ 70 | Council dominant (`zin_aenor_council_dominant`) | Event *The Chancellor's Counsel* (zin_aenor.20) about every 90 days: the Council picks an outcome unless the player pays 50 political power. Death clock pace ×1.25. Anti-Council focuses and decisions are unavailable. |
| 36–69 | — | Anti-Council decisions cost +50% political power |
| ≤ 35 | Council faltering (`zin_aenor_council_faltering`) | Death clock pace ×0.6; the plot can be exposed; zin_aenor.22 |
| ≤ 15 | Council broken | The Faithful camp's support at the succession is halved |

### 3. The Concord: charters and `zin_concord_loyalty`

The Charters of Parim (4A 3, proposed) bind the dominions to the crown as self-governing members of a common defence. In game the 26 dominions are Aenor's subjects under the diplomacy spec's autonomy state `zin_autonomy_chartered_dominion` ([03_gameplay/03_diplomacy_and_factions.md](../03_gameplay/03_diplomacy_and_factions.md)) and members of the faction **Middle Kingdom Concord**. Each has `zin_concord_loyalty` (0–100, dominion scope) and exactly one charter.

#### The 26 dominions (starting values proposed)

| Dominion | States | People | Ideology | Loyalty | Charter | Note |
| --- | ---: | --- | --- | ---: | --- | --- |
| Selen | 7 | men | Light | 45 | Old | Rangers; Alleria; the Lost Cause's frontier hub; the Concord's counterweight |
| Noleksun | 8 | men | Wild | 40 | Old | South-eastern frontier confederacy |
| Konori | 5 | men | Wild | 55 | Old | Eastern steppe |
| Herez | 5 | men | Wild | 50 | Old | Southern marches |
| Kilinti | 4 | ents | Light | 60 | Old | Ents of Kilinti and the Kilinti Forests |
| Kingson | 4 | men | Wild | 65 | Wall | The gate in the Great Wall |
| Freshon | 4 | men | Wild | 50 | Golden | |
| Pazoma | 4 | men | Wild | 50 | Golden | |
| Hunhun | 3 | men | Wild | 55 | Old | The riders |
| Kunhrim | 3 | men | Wild | 45 | Old | |
| Hiloron | 2 | giants | Light | 60 | Old | Giants of the lake |
| Safeton | 2 | men | Light | 70 | Old | Lake republic on the ocean route |
| Klungori Guard | 2 | men | Wild | 70 | Old | |
| Vothrim | 2 | men | Wild | 55 | Old | |
| Olvinc-un | 2 | men | Wild | 50 | Old | |
| Svenlor | 2 | men | Wild | 55 | Old | |
| Tieri | 2 | men | Wild | 60 | Old | |
| Noloreh | 2 | men | Wild | 55 | Old | |
| Mondon | 2 | men | Wild | 60 | Old | |
| Belurithon | 2 | men | Wild | 50 | Old | |
| Asgard | 1 | men | Wild | 75 | Old | Aenor Isle |
| Ulgus | 1 | men | Wild | 60 | Old | |
| Stendorler | 1 | men | Wild | 60 | Old | |
| Hilofrim | 1 | men | Wild | 65 | Old | |
| Dariap | 1 | men | Wild | 60 | Old | |
| Novez | 1 | men | Wild | 55 | Old | |

All 26 exist today as subjects of Aenor in `tools/content/data/countries.json`, with the state counts above. Hiloron's ideology there is still Shadow (`communism`); the foundation rule that only dark realms are Shadow at the start makes it Light, and the politics data must change it (known issue, [01_map/03_known_issues.md](../01_map/03_known_issues.md)). Cursed Lands, Bloody Forest and Fotan are outside the Concord and have no loyalty.

The special charters at the start (Freshon and Pazoma Golden, Kingson Wall) are a proposal; the owner may name other dominions ([OPEN_QUESTIONS.md](../OPEN_QUESTIONS.md), aenor 2). The data file lists them, so a change touches one row.

#### Loyalty bands

| Band | Range | Trigger | Effect |
| --- | --- | --- | --- |
| Steadfast | ≥ 75 | `zin_aenor_dominion_steadfast` | Sends a Concord Levy when Aenor asks (decision); never secedes |
| Loyal | 50–74 | `zin_aenor_dominion_loyal` | none |
| Restless | 25–49 | `zin_aenor_dominion_restless` | Refuses levies (zin_aenor.103); may join the Free Dominions at the succession if the Dominions camp rises |
| Defiant | < 25 | `zin_aenor_dominion_defiant` | Petitions (zin_aenor.101) while the King lives; **secedes** when the succession opens. Never secedes before the King's death: the start stays peaceful. |

Monthly change (the pulse, see Implementation):

- −0.02 × (corruption − 50) when corruption is above 50 (doubled at Gilded Rot);
- charter term: Free +0.4, Shield +0.2, Wall +0.1, Old 0, Golden −0.5;
- +0.1 while `zin_lost_cause_shield` is set and the dominion is in the faction;
- −0.3 while Aenor is at war and the dominion has an occupied state;
- clamped to 0–100.

The pulse also stores the average loyalty of the current dominions in `zin_aenor_concord_avg` (Aenor realm), which the Dominions camp formula and the Golden Court panel read.

#### Charters

A charter is a dominion-scoped national spirit. Aenor changes one with the targeted decision **Reissue the Charter of [Dominion]** (`zin_aenor_reissue_charter`; visible after the tree sets `zin_aenor_charters_open`; cost below; 180-day cooldown per dominion).

| Charter | Idea on the dominion | Modifiers on the dominion | Loyalty term | Requires | Cost |
| --- | --- | --- | --- | --- | --- |
| Old Charter | `zin_concord_charter_old` | none | 0 | — | 25 PP |
| Golden Charter (privileges sold to its lords) | `zin_concord_charter_golden` | `cic_to_overlord_factor` +0.10, `extra_trade_to_overlord_factor` +0.25, `political_power_gain` +0.2, `stability_factor` −0.05 | −0.5 | Focus *The Golden Charters*; corruption ≥ 40; Golden King alive or Court rules | 0 PP; corruption +3, Aenor +50 PP |
| Shield Charter | `zin_concord_charter_shield` | `army_org_factor` +0.05, `training_time_factor` −0.10, `autonomy_manpower_share` +0.10 | +0.2 | `zin_lost_cause_shield` | 50 PP |
| Free Charter | `zin_concord_charter_free` | `stability_factor` +0.10, `political_power_gain` +0.25, `cic_to_overlord_factor` −0.05 | +0.4 | Focus *The Charters of Parim Renewed*, or the Dominions or Host camp rules | 50 PP |
| Wall Charter | `zin_concord_charter_wall` | `army_defence_factor` +0.05, `max_dig_in` +2 | +0.1 | Dominion owns a Great Wall state (`zin_is_site_great_wall`; Kingson at start) | 25 PP |

Other Concord decisions (category `zin_aenor_cat_concord`):

| Decision | Id | Effect | Cost | Cooldown |
| --- | --- | --- | --- | --- |
| Convene the Concord Council | `zin_aenor_concord_council` | Event zin_aenor.100: choose "the King's tribute" (Aenor +100 PP, all loyalty −5) or "the old liberties" (all loyalty +5, corruption −2) | 50 PP | 365 days |
| Call the Concord Levy | `zin_aenor_concord_levy` | Each Steadfast dominion gives Aenor 2,000 manpower and loses 2 loyalty | 25 PP | 180 days |
| Restore the Charter of [Dominion] | `zin_aenor_restore_charter` | Only for a seceded dominion; only with the tree flag `zin_aenor_restore_by_force`; creates a `puppet` war goal | 75 PP | — |

### 4. The Lost Cause

The Lost Cause (founded 4A 1741, proposed date) is the Golden King's league against "the powers of the dark". At the start it is an institution inside this mechanic, not a game faction (S3). It is mostly ornament. Its frontier companies and scholars are real.

| Item | Value (proposed) |
| --- | --- |
| Variable | `zin_aenor_lost_cause` (Aenor realm, 0–100): the real strength of its frontier companies and scholars. Start 20. Other specs change it only through the diplomacy spec's `zin_lost_cause_add_strength`, which calls `zin_aenor_add_lost_cause` here. |
| Start spirit | `zin_aenor_lost_cause_court` *The Lost Cause*: `political_power_gain` +0.15, `war_support_factor` +0.03, `consumer_goods_factor` +0.02 |
| Members | Aenor and every Concord dominion (ceremonial). Foreign "honorary crowns" carry the country flag `zin_lost_cause_member`; at the start there are none: Parim laughed at Mirolon's envoy (decision O8; the Mirolon tree). The diplomacy spec owns the decision that names new honorary crowns and the cross-faction musters. Honorary membership carries no faction or war obligations. |

What the strength unlocks (category `zin_aenor_cat_lost_cause`):

| Strength | Unlocks |
| --- | --- |
| ≥ 30 | Decision **Raise a Frontier Company** (`zin_aenor_frontier_company`; 50 PP, 1,000 manpower): one ranger brigade in a frontier state through `zin_aenor_raise_frontier_company` |
| ≥ 40 | The King's Health decisions (after the focus *The King's Tasters*) |
| ≥ 60 | Focus *The Shield of the Concord* may be taken |
| any | At the succession, Host support = 0.5 × strength (if the Host is available) |

Three paths, recorded as **global** flags because other specs read them:

| Path | Flag | How | Meaning |
| --- | --- | --- | --- |
| Ornament | none | default | The King's vanity. Its spirit gives prestige only. |
| Shield of the Concord | `zin_lost_cause_shield` | Focus *The Shield of the Concord* (`zin_aenor_raise_lost_cause_shield`) | Shield Charters open at once. The faction part waits for the succession (S3): while the Golden King lives the effect sets the country flag `zin_aenor_shield_pending`; zin_aenor.200 then renames the Concord faction **The Lost Cause** (`set_faction_name`) and opens the targeted decision **Call [Crown] to the Shield** (`zin_aenor_invite_to_shield`: an honorary crown joins the faction; AI accepts by opinion and threat). If the King is already dead, both happen at once. |
| Eindil's army | `zin_lost_cause_with_eindil` | Focus *The Lost Cause Reborn*, the Host branch *Son of Ein, Son of Aen*, or the journey's *Give the Lost Cause to the Heir* | The frontier companies and scholars follow Eindil; Host support +20; the league's lord becomes Eindil's host (diplomacy spec); feeds the Lost Cause ending (world systems) |

Scripted trigger `zin_lost_cause_exists`: the faction named The Lost Cause exists, that is `zin_lost_cause_shield` is set and an Aenor realm leads a faction, or `zin_lost_cause_with_eindil` is set and the country in `global.zin_eindil_host` leads a faction.

When Eindil reaches the Middle Lands (journey stage 8), event zin_aenor.160 *The Lost Cause Divided* fires for the Aenor realm: the court branch sides with the government, the frontier and scholarly branches drift to Eindil unless the government is the Host (proposed, after the vault's proposal).

### 5. The death clock and the plot

The Golden King dies when two things meet: the Council chooses to strike (the Afrit spec's global flag `zin_afrit_regicide_ready`), and Aenor's defences give it the chance (this spec's hidden clock). The player of Aenor never sees the number.

| Item | Value (proposed) |
| --- | --- |
| Variable | `zin_aenor_king_clock` (Aenor): days until the Council's chance |
| Start | (975 + random 0–20) × `zin_story_pace` (lands in Mistfall 4A 1750 at the standard pace) |
| Tick | Each monthly pulse subtracts 30 × `zin_aenor_clock_pace` |
| Pace | 1.0 base; ×1.25 at Council dominant; ×0.6 at Council faltering; ×0.5 while the spirit *The King's Tasters* (`zin_aenor_kings_tasters`) is active |
| Floor date | The King never dies before 1 Sowing 4A 1749 (`zin_aenor_date_death_floor`; at least 14 months of peace) |
| Hasten | `zin_aenor_hasten_death_clock` (`days`; at most 180 days in total, counted in `zin_aenor_clock_hastened`). The Afrit spec calls it from *Choose the Night*; the Worshipdom tree may call it from its plot focuses |
| Delay | `zin_aenor_delay_death_clock` (`days`), called by Aenor's Lost Cause focuses |

**When the King dies.** On a pulse when the clock is below 30, the floor date has passed and `zin_afrit_regicide_ready` is set (N15: both must allow), the pulse schedules the death on the right day inside the month: it fires the events spec's *The Mistfall Feast* (`zin_reign.19`) with `days = zin_aenor_king_clock − 1` (at once if that is 0 or less) and zin_aenor.200 *The King Is Dead* with `days = zin_aenor_king_clock` (at least 1), so the feast always falls one day before the death. Neither fires once `zin_golden_king_plot_exposed` is set. If the clock reaches 0 and the flag is not set, the clock holds at 0 and the King lives on until the Council strikes.

**Who sets the flag.** Normally the Worshipdom, through the Afrit spec's plot. The clock sets it itself (calling `zin_afrit_ready_regicide`) when it reaches 0 and either the Worshipdom does not exist, or `zin_rule_golden_king_death` is `HISTORICAL`. It never does so if `zin_golden_king_plot_exposed` or `zin_afrit_kingdom_behind_throne` is set. This keeps the established death in Mistfall 4A 1750 even without a Worshipdom.

Game rule `zin_rule_golden_king_death` (in the foundation's rules file; N4):

| Option | Effect |
| --- | --- |
| `DYNAMIC` (default) | As above, with pace, hastening, delay and exposure |
| `HISTORICAL` | Clock fixed at (975 + 0–20) × pace days; pace, hastening and delay ignored; the plot cannot be exposed; the clock sets `zin_afrit_regicide_ready` itself |
| `DELAYED` | Clock start +730 days; floor date 1 Deepwinter 4A 1753 |
| `NO_AI_PLOT` | An AI Worshipdom never sets `zin_afrit_regicide_ready` and the clock never sets it; a human Worshipdom still can |

Under `zin_rule_historical_path` = `HISTORICAL`, AI Aenor never takes delaying or exposing actions, so the death falls in Mistfall 4A 1750.

**Omens.** With the flag `zin_aenor_royal_physicians` (from *Question the Royal Physicians*), zin_aenor.240 reports the King's health in words ("sound", "tired", "failing") when the clock is above 365, between 180 and 365, or below 180, and stores it in `zin_aenor_king_health` (0, 1, 2) for the panel. This is the only hint.

**Exposing the plot (the King's Health decisions, category `zin_aenor_cat_kings_health`).** Visible after the focus *The King's Tasters*; requires `zin_rule_golden_king_death` not `HISTORICAL`.

| Step | Decision | Cost, time | Condition | Result |
| --- | --- | --- | --- | --- |
| 1 | Question the Royal Physicians (`zin_aenor_question_physicians`) | 50 PP, 30 days | Lost Cause ≥ 40 | Flag `zin_aenor_royal_physicians`; event zin_aenor.240 |
| 2 | Follow the Poisoner's Coin (`zin_aenor_follow_the_coin`) | 75 PP, 45 days | Step 1; council ≤ 50 | Event zin_aenor.241: success chance 30% + (50 − council)% + `zin_aenor_inquiry_bonus`, −15% while `zin_afrit_lost_cause_watched`; success sets `zin_aenor_poisoner_found` and calls `zin_afrit_add_veil` −10 |
| 3 | Lay the Proof Before the King (`zin_aenor_lay_proof`) | 100 PP | Step 2 succeeded | Event zin_aenor.242: the King believes if corruption < 60, otherwise 50%. If he believes: `zin_aenor_expose_plot` |

`zin_aenor_inquiry_bonus` (Aenor, 0–30) rises by 15 when the Worshipdom lets the Lost Cause's questions run (Afrit spec, `zin_afrit.13`).

`zin_aenor_expose_plot` is the only way the plot becomes known, whoever finds it (this decision chain, or the Afrit spec when the veil falls below 15 during the plot or Afrit is unmasked too soon). It sets the global flag `zin_golden_king_plot_exposed`, stops the clock, fires zin_aenor.250 *The King Learns* to Aenor (whose immediate block fires the events spec's `zin_reign.70` 3 days later) and calls the Afrit spec's `zin_afrit_plot_exposed` (the Council's own reaction and the public news `zin_afrit.17`). The exposure names "the Chancellor's circle" and "men in temple robes". It never names Afrit and never sets `zin_afrit_revealed`.

**The Council's War.** After the exposure, zin_aenor.260: if council ≥ 30 the Faithful rise in civil war (section 7), led by Merovan as Lord Protector "in the Deliverer's name"; otherwise the Council scatters (council −20, Merovan leaves the government; his fate is not told). Aurevan does not lead the rising and takes no crown in it while the secret holds; if `zin_afrit_revealed` is already set, Aurevan leads the Faithful breakaway openly (proposed; [OPEN_QUESTIONS.md](../OPEN_QUESTIONS.md), aenor 6). When the Faithful rise, zin_aenor.260 sets the global flag `zin_reign_councils_war` and fires the events spec's `zin_reign.71`. When the rising is crushed, or the Council scatters, zin_aenor.261 *The King Endures* sets the global flag `zin_golden_king_survives` and fires `zin_reign.73`; the clock never runs again and the succession war never happens.

### 6. The Empty Throne: the four-camp succession

The four camps (established) and their engine ideologies (proposed):

| Camp | Who | Ideology before `zin_afrit_revealed` | Ideology after | Party name (two-face) |
| --- | --- | --- | --- | --- |
| Golden Court | Office-buyers, courtiers, merchant houses | Dominion (`fascism`) | Dominion | The Golden Court |
| Free Dominions | Dominion lords and provincial marches who want their charters back | Wild (`neutrality`) | Wild | The Free Dominions |
| Afrit's supporters | The temples, the Council, the faithful | Light (`democratic`), as the Worshipdom (D1) | Shadow (`communism`) | `zin_loc_camp_faithful`: **The Deliverer's Faithful** / Afrit's Supporters |
| Eindil's popular host | Frontier companies, scholars, commoners, Selen | Light (`democratic`) | Light | `zin_loc_camp_host`: The Stranger's Host / Eindil's Host |

Before the reveal the Faithful and the Host share the Light party: its name is "The Deliverer's Faithful" while the Faithful have support, and the Host's support is counted in it. When `zin_afrit_revealed` is set, `set_party_name` gives Shadow the Faithful's name, Light the Host's name, and the Faithful's popularity moves from Light to Shadow. The party names at the start are the foundation's (Light "The Lost Cause", Dominion "The Golden Court", Shadow "Night Cults", Wild "The Free Dominions"); zin_aenor.200 renames them for the succession.

**Support.** Four Aenor variables, 0–100, computed on zin_aenor.200 and changed during the Thirty Days:

| Variable | Initial value |
| --- | --- |
| `zin_aenor_camp_court` | 0.5 × corruption (+10 with the tree spirit *Gilded Parim*; −10 at Honest Court) |
| `zin_aenor_camp_faithful` | 0.8 × council influence (halved if council ≤ 15) |
| `zin_aenor_camp_dominions` | 0.6 × (100 − `zin_aenor_concord_avg`) + 5 per Defiant dominion |
| `zin_aenor_camp_host` | 0 unless `zin_aenor_host_available`; then 0.5 × Lost Cause strength, +20 with `zin_lost_cause_with_eindil` |

Party popularities are set in proportion to the camps (`set_popularities`, Faithful and Host summed while they share Light), so the political screen shows the contest.

`zin_aenor_host_available`: `zin_eindil_named` is set and Eindil has reached the Middle Lands (journey stage 8 or later, `zin_eindil_stage` ≥ 8). On the historical path this is false in 4A 1750: the Host cannot rise at the King's death.

**Sequence.**

1. **zin_aenor.200 *The King Is Dead*** (news to every country). The King "died in his sleep after the Mistfall feast". `zin_aenor_open_succession` sets global `zin_golden_king_dead`; retires `<Aenor tag>_zin_ruler`; adds spirit `zin_aenor_interregnum`; computes support; applies a pending Shield (section 4); opens category `zin_aenor_cat_empty_throne` for 30 days. Every Defiant dominion secedes at once (zin_aenor.220). The effect ends by calling the events spec's hook `zin_reign_on_king_dead`.
2. **zin_aenor.201 *Whom Will You Follow?*** (Aenor only; checkpoint 06, so the non-committal option is first, E2). The first option, **Let the council decide**, picks the camp with the highest support (ties: Faithful, Court, Dominions, Host); the Faithful (historical) come second, then one option per other camp; the Host option shows only if available. The choice sets `zin_aenor_ruling_camp` and the government ideology. Its immediate block calls `zin_reign_on_thirty_days`. AI follows `zin_rule_ai_aenor_succession`: under `DEFAULT` with the historical path, the Faithful; otherwise the camp with the highest support (ties: Faithful, Court, Dominions, Host); `GOLDEN_COURT` and `FREE_DOMINIONS` force that camp; `RANDOM` picks by support weights.
3. **The Thirty Days.** Decisions for the chosen camp:

| Decision | Id | Camp | Effect | Cost |
| --- | --- | --- | --- | --- |
| Open the Treasury | `zin_aenor_open_treasury` | Court | Court +10; corruption +5 | 50 PP |
| The Temples Speak | `zin_aenor_temples_speak` | Faithful | Faithful +10; council +5 | 25 PP |
| Charters for the Loyal | `zin_aenor_charters_for_loyal` | Dominions | Dominions +10; all loyalty +5 | 50 PP |
| The Stranger's Word | `zin_aenor_strangers_word` | Host | Host +10 | 50 PP |
| Silence the Dissenters | `zin_aenor_silence_dissenters` | any ruling camp, once | Every other camp −15; stability −0.03 | 75 PP (25 PP for the Faithful at council ≥ 70) |

4. **zin_aenor.210 *The Seals of Parim*** after 30 days. The chosen camp takes the crown, and the immediate block fires the events spec's first event of that road: `zin_reign.50` when the Court rules, `.55` when the Dominions rule, `.60` when the Host rules:

| Ruling camp | New leader | Other effects |
| --- | --- | --- |
| Faithful | The Worshipdom decides in the Afrit spec's `zin_afrit.20`: Aurevan through `zin_afrit_crown_aurevan` (sets `zin_aurevan_crowned`), or Prince Eronel (`zin_eronel`) as a pliant heir through `zin_afrit_raise_pliant_heir` (sets `zin_afrit_kingdom_behind_throne`). If the Worshipdom does not exist, Merovan rules as Lord Protector. | Spirit `zin_aenor_interregnum` removed; council +10 |
| Court | `zin_aenor_golden_regency` (collective leader: *The Regency of the Golden Court*, ruling "for the crown" with Prince Eronel as its candidate) | No king is named; the events spec may crown Eronel later (`zin_reign_eronel_crowned`) |
| Dominions | `zin_aenor_concord_speaker` (collective leader: *The Speaker of the Concord*) | Every dominion gets a Free Charter and +15 loyalty |
| Host | `zin_eindil` as the **Hailed King** (not crowned), through `zin_aenor_receive_eindil` | Country flag `zin_aenor_hailed_king` |

5. **Risings.** Every other camp whose support is **≥ 30** rises at the same moment (section 7). Support below 30 is silenced: event *The Dissenters Silenced* (zin_aenor.215), no war.

Historical outcome (proposed numbers): corruption ~78 and council ~85 at the death give Court 39, Faithful 68, Dominions ~30, Host 0. The AI Faithful use *Silence the Dissenters*: Court 24, Dominions 15. Nobody rises. 0–2 Defiant dominions have already seceded. Aurevan is crowned within 30 days: "much of the kingdom obeyed".

**After the crowning.** Camp variables persist and drift by events and focuses. A camp that later reaches 50 support while not ruling triggers zin_aenor.216 *A Rival for the Crown* (risings as in step 5) at most once per camp per year. Whenever the Faithful come to rule an Aenor realm later (a Faithful breakaway wins its civil war, zin_aenor.230) and Aurevan is not crowned, the Worshipdom gets `zin_afrit.20` again.

### 7. Civil wars and dynamic countries

How a camp becomes a country:

| Camp rising against the ruler | Mechanism | Size | States |
| --- | --- | --- | --- |
| Court | `start_civil_war` with `ideology = fascism` | support / 100, at most 0.45 | States with the state flag `zin_aenor_lean_court`, then nearest to them, until the size is met |
| Faithful | `start_civil_war` with `ideology = democratic` before the reveal, `communism` after | support / 100, at most 0.5 | `zin_aenor_lean_temple` states |
| Host | `start_civil_war` with `ideology = democratic`; Eindil is moved to the new country as its leader | support / 100, at most 0.45 | `zin_aenor_lean_march` states, then Selen's border |
| Dominions | **Not a civil war.** Every Restless and Defiant dominion secedes through `zin_aenor_secede_dominion` and joins the faction **The Free Dominions**, which the largest seceder creates with `create_faction_from_template` (template `zin_faction_free_dominions`, proposed; E3) | — | Their own states |

Every `start_civil_war` passes `ruling_party` = the ruler's ideology, so the original country keeps its government, including when both sides share an ideology (the Faithful and the Host before the reveal), as vanilla scripts do.

Rules:

- **State leanings.** Each of Aenor's 18 states has one leaning or none. They come from three rows of the key sites table ([01_map/02_key_sites.md](../01_map/02_key_sites.md), module `tools/content/modules/sites.mjs`): `zin_is_site_aenor_court_lands` (Parim's hinterland estates), `zin_is_site_aenor_temple_cities` (Great Lake cities) and `zin_is_site_aenor_marches` (frontier and wall states). The startup event sets the matching state flag `zin_aenor_lean_court`, `zin_aenor_lean_temple` or `zin_aenor_lean_march` on each. **Parim never leaves the ruling camp.**
- **The player stays on the original country.** Because the player picks the ruling camp in zin_aenor.201 before the war starts, the original country is always the player's camp, as in the vanilla pattern for civil wars with a chosen side.
- **Who goes where.** `keep_unit_leaders_trigger` keeps every general without a camp flag; generals with the character flag `zin_aenor_camp_court`, `zin_aenor_camp_faithful` or `zin_aenor_camp_host` go to that camp. Merovan goes with the Faithful. Starting generals' camp flags are listed in [02_lore/02_characters.md](../02_lore/02_characters.md).
- **Rival breakaways** declare war on each other (`declare_war_on`, type `annex_everything`): each wants the crown. The Free Dominions are at war with nobody unless Aenor takes *Restore the Charters by Force*.
- **Realm identity.** Breakaways are dynamic countries whose `original_tag` is Aenor's. Every Aenor script tests `zin_aenor_is_realm` (original tag), never a tag. The focus tree is loaded by original tag, so a breakaway uses the Aenor tree; the `start_civil_war` effect block sets `zin_aenor_ruling_camp` and the camp's country flag on the new country, and copies the four camp variables, corruption, council influence and the Lost Cause strength.
- **Names.** Cosmetic names (proposed): *The Golden Court*, *Aenor of the Faithful* (after the reveal: *Aenor of Afrit*), *The Stranger's Host* (after `zin_eindil_named`: *Eindil's Host*). Flags are generated variants of Aenor's.
- **Ending a civil war.** The vanilla rule: the side that capitulates is annexed. The hidden handler zin_aenor.230 (from `on_civil_war_end`) re-subjects every former dominion with loyalty ≥ 50 to the winner (`puppet`, `set_autonomy` to `zin_autonomy_chartered_dominion`) and sets the winner's `zin_aenor_ruling_camp`. If a breakaway wins, it is now the Aenor realm.
- **Limits.** At most three Aenor breakaways at once. No rising may start while Aenor is capitulating.
- **The first civil war** removes `zin_aenor_seventeen_centuries`.

### 8. The abandoned throne, the hailed king and the Crown of Aen

**The abandoned throne.** When the Afrit spec sets `zin_afrit_abandoned_aenor` (the flight east or the flight to the hermitage, so the event never waits for a proclamation that may not come) and the Faithful rule an Aenor realm, zin_aenor.300 *The Throne Abandoned* fires there: Aurevan's leader role is removed (the Afrit spec moves the character east); Merovan leaves the government without explanation (his fate is open); the timed spirit `zin_aenor_throne_abandoned` is added; leadership passes to `zin_aenor_captains_regency` (collective leader: *The Captains' Regency*, the Lost Cause's frontier commanders); government becomes Light; `zin_aenor_ruling_camp` = 5; the events spec's `zin_reign.86` follows 1 day later. If the player's Aenor is not ruled by the Faithful, the event is news only.

**The stranger's warning.** Eindil's journey owns the one warning event to Aenor's government, `zin_eindil.82` *The Impostor* (historical 4A 1754; O4). This spec has no warning event of its own. Its options apply Aenor's side through this spec's effects (the journey lists a non-committal first option for checkpoint 10, E2):

| Journey option | Aenor's side | AI |
| --- | --- | --- |
| Denounce and hunt the impostor (historical under Aurevan) | `zin_aenor_add_camp_support` (`host`, −20); country flag `zin_aenor_eindil_denounced`; stability +0.03 (the journey also sets the Afrit spec's `zin_afrit_impostor_denounced`) | Faithful and Court rulers |
| Let him speak | Host +10; `zin_aenor_add_lost_cause` +5 | Dominions rulers |
| Shelter him (Light or Wild government only) | Host +25 (the journey sets its `zin_eindil_crown_shelters`) | Captains' Regency |
| Seize him | none here (the journey resolves it) | Court rulers outside the historical path, 30% |

**The hailed king.** On `zin_eindil_returned` (historical 4A 1757). On the historical path Eindil leads Selen's armies as its general and ruler-in-waiting (S2), and he moves to an Aenor realm only at his coronation (O1), so being hailed never makes him Aenor's ruler or changes Aenor's leader:

- If the Captains' Regency or the Dominions rule: zin_aenor.320 *The Hailed King*. "Hail him" (historical): the realm hails him as its king-to-be: spirit `zin_aenor_hailed_king`, flag `zin_aenor_hailed_king`, and it joins his coalition (`zin_eindil_join_coalition`); the ruling camp and the leader do not change. "Refuse": the Host rises (section 7) with support = max(current, 40).
- If the Faithful or the Court rule: zin_aenor.321 *The Host Rises*: the Host rises with support = max(current, 35).

`zin_aenor_receive_eindil` makes Eindil this realm's country leader: Eindil leaves his host (`zin_eindil_set_host`); spirit and flag `zin_aenor_hailed_king`; `zin_aenor_ruling_camp` = 4. It is called by `zin_aenor_crown_eindil` at the coronation (the historical path), and off the historical path only where the realm is itself his Host: the Host camp taking the seals (section 6) and the Host camp's own rising, whose breakaway he already leads.

While Eindil is lost after the cliff (journey stage 10), the journey calls `zin_aenor_regency_while_king_lost` on an Aenor realm he leads: the Captains' Regency leads and zin_aenor.330 *The King Is Lost* fires there. His recovery calls `zin_aenor_restore_hailed_king` and zin_aenor.331 *The King Returns*.

**The Crown of Aen.** Eindil's journey finds the crowning realm (stage 12, `zin_eindil_go_to_parim`: the dynamic Host if it is an Aenor realm, else an Aenor realm not at war with the Host and not ruled by `zin_aurevan`, else a new Aenor realm it creates at Parim), stores it in the global variable `zin_eindil_crowning_realm` (journey) and fires `zin_eindil.130` *The Crown Is Offered*, which calls `zin_aenor_people_choose` in that realm. Eindil is still the Host's general at this point (S2, O1). That effect sets `zin_aenor_people_chose` and fires zin_aenor.400 *The Crown of Aen* 7 days later. zin_aenor.400 has one option and runs `zin_aenor_crown_eindil` if `zin_aenor_eindil_can_be_crowned` holds; if not, it fires again 30 days later. Scripted trigger `zin_aenor_eindil_can_be_crowned` (crowning realm scope):

- `zin_afrit_dead`, `zin_eindil_named` and `zin_eindil_returned` are set; `zin_eindil_crowned` and `zin_eindil_lost` are not;
- the realm is the Aenor realm in `zin_eindil_crowning_realm`, and `zin_eindil` serves the Host, a coalition member or this realm (as Selen's general on the historical path; he need not lead the realm yet) and has `zin_eindil_recovered` if he was cast down;
- the realm controls Parim's state (`zin_is_site_parim`), is not capitulated, and no enemy division stands in Parim's state;
- under `zin_rule_historical_path` = `HISTORICAL`: on or after 1 Thaw 4A 1760 (`zin_aenor_date_coronation`), the journey's stage 12 floor (both read `zin_story_pace`).

zin_aenor.400 uses the picture `coronation` (gate `zin_golden_king_dead`); it cannot use `crown_of_aen`, whose gate `zin_eindil_crowned` is set only inside its option. zin_aenor.401 uses `crown_of_aen`: `zin_aenor_crown_eindil` sets the flag before it fires the event (E5).

`zin_aenor_crown_eindil`:

- calls `zin_aenor_receive_eindil` first, so Eindil moves to this realm at the coronation and not before (O1);
- global `zin_eindil_crowned`; then zin_aenor.401 *Eindil Is Crowned* is news to every country;
- Eindil's title becomes King of Aenor and his portrait the coronation portrait (E7, journey); government Light, stance `zin_light_wardens` (foundation, through `zin_politics_set_stance`); every camp spirit, `zin_aenor_interregnum`, `zin_aenor_hailed_king` and regency spirits removed; spirit `zin_aenor_rightful_king`;
- zin_aenor.402 *A Charter of Equals* to every Concord dominion, every Free Dominion and Selen: rejoin with a Free Charter, or stay free; neither is forced (the Lost Cause refuses imperial rule);
- calls the world systems' `zin_world_check_endings`, which sets `zin_ending_lost_cause` ([03_gameplay/05_world_tension_and_endings.md](../03_gameplay/05_world_tension_and_endings.md)).

The journey's `zin_eindil_after_coronation` then brings a dynamic Host home and gives the friends' rewards. The coronation text says Eindil wears the Necklace of the Abyss and that "its price is not yet known". No modifier represents the Necklace.

### 9. Other outcomes (proposed, outside canon)

| Outcome | Reached by | Recorded as |
| --- | --- | --- |
| The Golden King survives | The plot exposed and the Council's War won | global `zin_golden_king_survives`; zin_aenor.460 *The King and the Stranger* later lets the King name Eindil his heir or refuse him ([OPEN_QUESTIONS.md](../OPEN_QUESTIONS.md), aenor 5; work proceeds on offering it) |
| The Regency of Gold endures | The Court rules and survives to 4A 1760 | country flag `zin_aenor_regency_endures` |
| The Concord of Equals | The Dominions rule, or the Concord is rebuilt by consent | country flag `zin_aenor_concord_of_equals` |
| The Ashen Throne | The Faithful still rule Aenor at the end | owned by the Afrit spec and world systems |

None of these is written as history; event text describes them as what happened "in this telling".

## Implementation

### Builder

A new content builder module, `tools/content/modules/mech_aenor_court.mjs`, writes every file below from the data file `tools/content/data/mechanics/aenor_court.json` and is called from `tools/content/build.mjs`. The data file holds the dominion table (country names, loyalty, charter), the charter table, the camp parameters, the thresholds, the floor dates and the event and decision text keys. The module resolves country names to tags with `tools/content/data/countries.json` and fails the build if a dominion is missing or is not Aenor's subject there. Everything is staged and applied in the one transaction of `tools/content/apply.mts`; no game file is hand-edited.

| File | Content |
| --- | --- |
| `common/scripted_triggers/zin_aenor_court.txt` | Triggers below |
| `common/scripted_effects/zin_aenor_court.txt` | Effects below |
| `common/dynamic_modifiers/zin_aenor_court.txt` | `zin_aenor_golden_court`, `zin_aenor_temple_favour` |
| `common/ideas/zin_aenor_court.txt` | Mechanic spirits and the five charter ideas |
| `common/decisions/categories/zin_aenor_court.txt`, `common/decisions/zin_aenor_court.txt` | Categories `zin_aenor_cat_court`, `zin_aenor_cat_concord`, `zin_aenor_cat_lost_cause`, `zin_aenor_cat_kings_health`, `zin_aenor_cat_empty_throne` |
| `events/zin_aenor_court.txt` | Mechanic events, namespace `zin_aenor`, ids 1–499 (the tree's `events/zin_aenor.txt` uses 500–699 through the compiler's event id base, S9) |
| `common/on_actions/zin_aenor_court.txt` | `on_startup` → zin_aenor.1; `on_monthly` → zin_aenor.2 for every country with `zin_aenor_is_realm`; `on_civil_war_end` → zin_aenor.230 |
| `localisation/english/zin_aenor_court_l_english.yml` | All text, including the two-face party names (`zin_loc_camp_faithful`, `zin_loc_camp_host`) and the Temple Favour / Hidden Hand labels |

Shared files written by other modules from rows this spec supplies: the rule `zin_rule_golden_king_death` (options `DYNAMIC`, `HISTORICAL`, `DELAYED`, `NO_AI_PLOT`; N15) in the foundation's `common/game_rules/zin_game_rules.txt` ([00_foundation/05_defines_and_rules.md](../00_foundation/05_defines_and_rules.md)); the faction template `zin_faction_free_dominions` (proposed: joining rule `zin_faction_rule_join_free_dominions`, the joiner has `zin_aenor_free_dominion`; leader-only war and call to war; leader never changes) in the diplomacy spec's faction files ([03_gameplay/03_diplomacy_and_factions.md](../03_gameplay/03_diplomacy_and_factions.md)). The key sites module writes the Aenor sites this spec reads (`zin_is_site_parim`, the three leanings, `zin_aenor_fallback_seat`, `zin_is_site_great_wall`) into `common/scripted_triggers/zin_sites.txt`.

### Dates

Floor dates are standard-pace engine dates. The module writes each as a scripted trigger with three date sets, start + (*d* − start) × pace for paces 1.0, 1.5 and 0.75, chosen by `zin_rule_story_pace`, as the historical path spec does for its checkpoints:

| Trigger | Standard date |
| --- | --- |
| `zin_aenor_date_death_floor` | 1749.5.1 (1 Sowing 4A 1749); 1753.1.1 under `DELAYED` |
| `zin_aenor_date_coronation` | 1760.3.1 (1 Thaw 4A 1760) |

### Variables

| Variable | Scope | Range | Meaning |
| --- | --- | --- | --- |
| `zin_court_corruption` | Aenor realm | 0–100 | Shared (contract) |
| `zin_council_influence` | Aenor realm | 0–100 | Shared (contract) |
| `zin_concord_loyalty` | dominion | 0–100 | Shared (contract) |
| `zin_aenor_concord_avg` | Aenor realm | 0–100 | Average loyalty of current dominions |
| `zin_aenor_lost_cause` | Aenor realm | 0–100 | Lost Cause strength |
| `zin_aenor_king_clock` | Aenor | days | Death clock |
| `zin_aenor_clock_pace` | Aenor | 0.25–2 | Clock pace |
| `zin_aenor_clock_hastened` | Aenor | 0–180 | Days already hastened |
| `zin_aenor_inquiry_bonus` | Aenor | 0–30 | Bonus to the Poisoner's Coin roll |
| `zin_aenor_king_health` | Aenor | 0–2 | Last omen: sound, tired, failing |
| `zin_aenor_camp_court`, `zin_aenor_camp_faithful`, `zin_aenor_camp_dominions`, `zin_aenor_camp_host` | Aenor realm | 0–100 | Camp support |
| `zin_aenor_ruling_camp` | Aenor realm | 0–5 | 0 the Golden King, 1 Court, 2 Faithful, 3 Dominions, 4 Host, 5 Captains' Regency |
| `zin_aenor_dm_*` | Aenor realm | — | Derived values for the dynamic modifiers, recomputed by `zin_aenor_refresh_modifiers` |

Every write goes through an effect below that clamps the range.

### Flags

| Flag | Type | Meaning |
| --- | --- | --- |
| `zin_golden_king_dead` | global | Contract |
| `zin_golden_king_plot_exposed` | global | The plot against the King is exposed (the only exposure flag) |
| `zin_golden_king_survives` | global | The King survived the Council's War |
| `zin_lost_cause_shield` | global | The Lost Cause became the Concord's shield |
| `zin_lost_cause_with_eindil` | global | The Lost Cause follows Eindil |
| `zin_lost_cause_member` | country | Honorary or full Lost Cause member |
| `zin_aenor_shield_pending` | country | The Shield waits for the succession |
| `zin_aenor_hidden_hand_seen` | country | Temple Favour relabelled |
| `zin_aenor_royal_physicians`, `zin_aenor_poisoner_found` | country | Investigation steps |
| `zin_aenor_hailed_king` | country | Eindil leads as the Hailed King |
| `zin_aenor_eindil_denounced` | country | The Aenor realm's government denounced Eindil (journey event 82). The temples' own campaign is the Afrit spec's separate global flag `zin_afrit_impostor_denounced`. |
| `zin_aenor_free_dominion` | country | A dominion that seceded |
| `zin_aenor_people_chose` | country | The crown has been offered (journey `zin_eindil.130`) |
| `zin_aenor_regency_endures`, `zin_aenor_concord_of_equals` | country | Outcomes (section 9) |
| `zin_aenor_lean_court`, `zin_aenor_lean_temple`, `zin_aenor_lean_march` | state | State leanings |
| `zin_aenor_camp_court`, `zin_aenor_camp_faithful`, `zin_aenor_camp_host` | character | Generals' camps (character flags share the camp variables' names; the engine keeps the two kinds apart) |

Tree-local flags (`zin_aenor_charters_open`, `zin_aenor_restore_by_force`, `zin_aenor_envoys` and the rest) are listed in the tree spec.

### Scripted triggers

| Trigger | Scope | True when |
| --- | --- | --- |
| `zin_aenor_is_realm` | country | `original_tag` is Aenor's |
| `zin_aenor_is_concord_dominion` | country | subject of an Aenor realm and not `zin_aenor_free_dominion` |
| `zin_aenor_king_alive` | any | `zin_golden_king_dead` not set |
| `zin_aenor_council_dominant` | Aenor | council ≥ 70 |
| `zin_aenor_council_faltering` | Aenor | council ≤ 35 |
| `zin_aenor_court_gilded` | Aenor | corruption ≥ 80 |
| `zin_aenor_dominion_steadfast`, `zin_aenor_dominion_loyal`, `zin_aenor_dominion_restless`, `zin_aenor_dominion_defiant` | dominion | loyalty band |
| `zin_aenor_host_available` | any | section 6 |
| `zin_aenor_ruled_by_court`, `zin_aenor_ruled_by_faithful`, `zin_aenor_ruled_by_dominions`, `zin_aenor_ruled_by_host`, `zin_aenor_ruled_by_captains` | Aenor realm | `zin_aenor_ruling_camp` = 1, 2, 3, 4, 5 |
| `zin_aenor_eindil_can_be_crowned` | any | section 8 |
| `zin_aenor_parim_lost` | any | no Aenor realm controls Parim |
| `zin_aenor_eindil_rules` | country | the country leader is `zin_eindil` |
| `zin_aenor_free_dominions_exist` | any | any country has `zin_aenor_free_dominion` |
| `zin_lost_cause_exists` | any | section 4 |
| `zin_aenor_date_death_floor`, `zin_aenor_date_coronation` | any | Dates |

### Scripted effects

| Effect | Scope | Arguments | Does |
| --- | --- | --- | --- |
| `zin_aenor_add_court_corruption` | Aenor realm | `value` | Adds, clamps (floor 25 while the King lives), refreshes modifiers |
| `zin_aenor_add_council_influence` | any (targets the ruling Aenor realm) | `value` | Adds, clamps, refreshes modifiers |
| `zin_aenor_add_concord_loyalty` | dominion | `value` | Adds and clamps |
| `zin_aenor_add_concord_loyalty_all` | Aenor realm | `value` | Every Concord dominion |
| `zin_aenor_add_lost_cause` | Aenor realm | `value` | Adds and clamps |
| `zin_aenor_set_charter` | dominion | `charter` | Swaps the charter idea; sets the dominion's timed flag `zin_concord_charter_recent` (180 days), the cooldown the Concord tree's petitions share |
| `zin_aenor_set_charter_all` | Aenor realm | `charter` | Every Concord dominion |
| `zin_aenor_refresh_modifiers` | Aenor realm | — | Recomputes `zin_aenor_dm_*` and `zin_aenor_concord_avg` |
| `zin_aenor_tick_death_clock` | Aenor | — | Monthly tick and death scheduling (section 5) |
| `zin_aenor_hasten_death_clock` | any | `days` | Capped at 180 in total |
| `zin_aenor_delay_death_clock` | Aenor | `days` | For Lost Cause focuses |
| `zin_aenor_expose_plot` | any | — | Section 5 |
| `zin_aenor_open_succession` | Aenor | — | zin_aenor.200's body; ends with `zin_reign_on_king_dead` |
| `zin_aenor_add_camp_support` | Aenor realm | `camp`, `value` | Adds and resets popularities |
| `zin_aenor_raise_camp` | Aenor realm | `camp` | One rising (section 7) |
| `zin_aenor_secede_dominion` | dominion | — | Secession (section 7): `end_puppet`, `remove_from_faction`, spirit `zin_aenor_free_dominion`, removes the Concord tree's spirit `zin_shared_concord_dominions_charter_loyalists`, fires zin_aenor.220 and the events spec's `zin_reign.37` to the dominion; joins The Free Dominions or founds it |
| `zin_aenor_raise_frontier_company` | Aenor realm | — | One ranger brigade |
| `zin_aenor_raise_lost_cause_shield` | Aenor realm | — | Section 4 |
| `zin_aenor_invite_free_dominions` | Aenor realm | — | Fires zin_aenor.110 *Letters to the Free Dominions* for every Free Dominion: rejoin with a Free Charter (AI: loyalty term ≥ 40 or threatened) or stay free |
| `zin_aenor_convene_concord_council` | Aenor realm | — | Fires zin_aenor.100 (used by the tree) |
| `zin_aenor_raise_golden_guard` | Aenor realm | — | Two guard divisions in Parim |
| `zin_aenor_wargoal_on_parim_holder` | Aenor realm | — | `annex_everything` war goal against the controller of Parim if it is not an ally |
| `zin_aenor_people_choose` | Aenor realm | — | Sets `zin_aenor_people_chose`; fires zin_aenor.400 after 7 days |
| `zin_aenor_event_for_parim` | any | `event` (an event id written by the compiler) | F7: saves the global event target `zin_aenor_parim_realm` (the Aenor realm controlling Parim's state, else the original Aenor country if it exists). Because effects take no parameters (E1), the builder writes each call as this effect followed by `event_target:zin_aenor_parim_realm = { country_event = { id = <event> days = <days> } }`. Trees and story events use it instead of helpers of their own |
| `zin_aenor_receive_eindil` | Aenor realm | — | Section 8 |
| `zin_aenor_regency_while_king_lost`, `zin_aenor_restore_hailed_king` | Aenor realm | — | For the journey (section 8) |
| `zin_aenor_crown_eindil` | crowning realm | — | Coronation (section 8); calls `zin_aenor_receive_eindil` first |

**Arguments (E1).** Each argument is the temporary variable `zin_arg_<name>` set by the caller just before the call (`zin_arg_value`, `zin_arg_days`); the effect reads and clears it. Keyword arguments use number codes: `charter` old 0, golden 1, shield 2, free 3, wall 4; `camp` court 1, faithful 2, dominions 3, host 4 (the values of `zin_aenor_ruling_camp`). The focus compiler and the events modules write calls in this form.

Effects owned elsewhere and called here: `zin_afrit_ready_regicide`, `zin_afrit_crown_aurevan`, `zin_afrit_raise_pliant_heir`, `zin_afrit_plot_exposed`, `zin_afrit_add_veil` ([Afrit](afrit_hidden_council.md)); `zin_reign_on_king_dead`, `zin_reign_on_thirty_days` ([06_events/01](../06_events/01_golden_king_and_succession.md)); `zin_world_check_endings` (world systems); `zin_politics_set_stance` (foundation).

Engine effects used: `start_civil_war` (`ideology`, `ruling_party`, `size`, `states_filter`, `keep_unit_leaders_trigger`), `set_party_name`, `set_popularities`, `set_faction_name`, `end_puppet`, `puppet`, `set_autonomy`, `remove_from_faction`, `add_to_faction`, `create_faction_from_template` (E3; `create_faction` is not used), `save_global_event_target_as`, `declare_war_on`, `create_wargoal`, `add_dynamic_modifier`, `retire_character`, `recruit_character`, `add_country_leader_role`, `set_cosmetic_tag`, `change_tag_from`, `release`, `create_unit`. Triggers: `original_tag`, `is_subject_of`, `controls_state`, `has_country_flag` (with `days`), `has_global_flag`.

### The monthly pulse

Hidden event zin_aenor.2, fired by `on_monthly` for every Aenor realm: corruption drift, council drift, the clock tick (original Aenor only, while the King lives), loyalty drift for every Concord dominion, `zin_aenor_concord_avg`, Council-dominant events, refresh of the dynamic modifiers, and `zin_ui_refresh` for a human player.

### Events (namespace `zin_aenor`)

| Id | Title | Trigger | Options |
| --- | --- | --- | --- |
| 1 | (hidden) setup | `on_startup` | Start values, charters, autonomy states, state leanings, dynamic modifiers (no honorary Lost Cause flag at the start, O8) |
| 2 | (hidden) monthly pulse | `on_monthly` | — |
| 10 | A Feast in the Golden Court | random, corruption ≥ 50, mean time 180 days | Spend (+25 PP, corruption +3) / Cut the guest list (−10 PP, corruption −2) |
| 11 | Offices for Sale | corruption ≥ 60, mean time 150 days | Sell (+50 PP, corruption +4) / Refuse (stability +0.02; available while the King lives only at corruption ≤ 50) |
| 12 | A Scandal in the Gilded Halls | Gilded Rot, mean time 120 days | Hush it (−25 PP) / Let it run (stability −0.03, corruption −5) |
| 20 | The Chancellor's Counsel | Council dominant, mean time 90 days | Accept (council +3, the Council's pick) / Overrule (−50 PP, council −2) |
| 21 | Gifts from the Houses | council ≥ 50, mean time 180 days | Accept (stability +0.02, council +2) / Decline (−0.02 stability) |
| 22 | The Temples Lose Favour | council crosses ≤ 35 | OK |
| 100 | The Concord Council Meets | decision | The King's tribute / The old liberties |
| 101 | A Charter Grievance | Defiant dominion, mean time 120 days while the King lives | Grant (loyalty +10, −50 PP) / Refuse (loyalty −5) |
| 102 | A New Charter (to the dominion) | charter decision | OK |
| 103 | The Levy Refused | Restless dominion asked for a levy | OK |
| 110 | Letters to the Free Dominions (to a Free Dominion) | `zin_aenor_invite_free_dominions` | Rejoin under a Free Charter / Stay free |
| 150 | The League's Triumph | Lost Cause focus | flavour |
| 151 | Warnings from Mirolon | mean time 300 days in 1748–1750 | Laugh (+25 PP, corruption +2) / Listen (Lost Cause +5) |
| 152 | Tales of Black Ships | mean time 300 days | Dismiss / Send a ship (Lost Cause +3, −25 PP) |
| 160 | The Lost Cause Divided | journey stage 8 begins | Hold the court branch (Lost Cause −10) / Let the frontier decide (Host +10) |
| 200 | The King Is Dead | death clock and `zin_afrit_regicide_ready`, 1 day after `zin_reign.19` | OK (news to all) |
| 201 | Whom Will You Follow? | 1 day after `zin_reign.20` | CP 06: Let the council decide / the Faithful / one per other camp |
| 210 | The Seals of Parim | 30 days after 201 | OK; fires `zin_reign.50`, `.55` or `.60` by ruling camp |
| 211–214 | The Golden Court Rises; The Faithful Rise; The Host Rises; The Dominions Declare Themselves Free | risings | OK (news) |
| 215 | The Dissenters Silenced | camps under 30 | OK |
| 216 | A Rival for the Crown | a camp reaches 50 | OK |
| 220 | A Dominion Breaks Its Charter | secession (dominion and Aenor) | OK (`zin_reign.37` goes to the dominion with it) |
| 230 | (hidden) civil war end | `on_civil_war_end` | — |
| 240 | The King's Physicians | decision | OK (health in words) |
| 241 | The Poisoner's Coin | decision | OK |
| 242 | Proof Before the King | decision | Show the King / Keep it secret |
| 250 | The King Learns | `zin_aenor_expose_plot` | OK; fires `zin_reign.70` in 3 days |
| 260 | The Council's War | after 250 | OK; with the Faithful rising, sets `zin_reign_councils_war` and fires `zin_reign.71` |
| 261 | The King Endures | rising crushed or Council scattered | OK; fires `zin_reign.73` |
| 300 | The Throne Abandoned | `zin_afrit_abandoned_aenor` | OK; fires `zin_reign.86` 1 day later when the Captains' Regency takes power |
| 320 | The Hailed King | `zin_eindil_returned`, regency or Dominions rule | Hail him / Refuse (no leader change, O1) |
| 321 | The Host Rises | `zin_eindil_returned`, Faithful or Court rule | OK |
| 330 | The King Is Lost | `zin_aenor_regency_while_king_lost` | OK |
| 331 | The King Returns | `zin_aenor_restore_hailed_king` | OK |
| 400 | The Crown of Aen | 7 days after `zin_aenor_people_choose`; again every 30 days until the trigger holds | OK; picture `coronation` |
| 401 | Eindil Is Crowned | `zin_aenor_crown_eindil`, after it sets `zin_eindil_crowned` | OK (news to all); picture `crown_of_aen` (E5) |
| 402 | A Charter of Equals | `zin_aenor_crown_eindil`, to each dominion and Selen | Rejoin with a Free Charter / Stay free |
| 460 | The King and the Stranger | `zin_golden_king_survives` and journey stage 8 | Name him heir / Refuse him |

Mean-time events (10–22, 101, 151, 152) declare `trigger` and `mean_time_to_happen`, because this is a mechanics-owned file. The events spec fixes their text ([06_events/01](../06_events/01_golden_king_and_succession.md)). Id 310 is not used: the warning is the journey's `zin_eindil.82` (O4). Every event writes `timeout_days = 30`; events marked CP carry the data field `checkpoint` and list the non-committal option first (E2).

### Spirits

| Id | Name | Modifiers | Added / removed |
| --- | --- | --- | --- |
| `zin_aenor_golden_court` (dynamic) | The Golden Court | section 1 | Start; removed at the coronation, or when corruption falls to 25 after the King's death |
| `zin_aenor_temple_favour` (dynamic) | Temple Favour / The Hidden Hand | section 2 | Start; removed by zin_aenor.300 |
| `zin_aenor_seventeen_centuries` | Seventeen Centuries of the Crown | `stability_factor` +0.10, `production_speed_buildings_factor` +0.10 | Start; removed by the first civil war |
| `zin_aenor_lost_cause_court` | The Lost Cause | `political_power_gain` +0.15, `war_support_factor` +0.03, `consumer_goods_factor` +0.02 | Start; swapped by focuses |
| `zin_aenor_kings_tasters` | The King's Tasters | `stability_factor` +0.02 | Focus; 365 days |
| `zin_aenor_interregnum` | The Empty Throne | `political_power_factor` −0.25, `stability_weekly` −0.002, `drift_defence_factor` −0.3 | zin_aenor.200 / 210 |
| `zin_aenor_free_dominion` | A Free Dominion (on a seceded dominion) | `stability_factor` +0.05, `war_support_factor` +0.05 | Secession / rejoining |
| `zin_aenor_throne_abandoned` | The Throne Abandoned | `stability_factor` −0.10, `war_support_factor` −0.05 | zin_aenor.300; 180 days |
| `zin_aenor_hailed_king` | The Hailed King | `war_support_factor` +0.10, `army_morale_factor` +0.05 | zin_aenor.320 or `zin_aenor_receive_eindil`; removed at the coronation |
| `zin_aenor_rightful_king` | The Rightful King | `stability_factor` +0.15, `war_support_factor` +0.10, `political_power_gain` +0.5 | `zin_aenor_crown_eindil` |
| `zin_concord_charter_old`, `_golden`, `_shield`, `_free`, `_wall` | the five charters | section 3 | Decisions |

### Characters

| Id | Who | Status |
| --- | --- | --- |
| `<Aenor tag>_zin_ruler` | The Golden King | contract |
| `zin_merovan` | Chancellor Merovan, head of government at start | contract |
| `zin_aurevan` | Aurevan | contract; crowned by the Afrit spec |
| `zin_eindil` | Eindil | contract |
| `zin_eronel` | Prince Eronel of Arcedor, the Court's candidate and the pliant heir | proposed ([02_characters.md](../02_lore/02_characters.md)) |
| `zin_aenor_golden_regency` | The Regency of the Golden Court (collective leader, council portrait) | proposed |
| `zin_aenor_concord_speaker` | The Speaker of the Concord (collective leader) | proposed |
| `zin_aenor_captains_regency` | The Captains' Regency (collective leader) | proposed |

Collective leaders avoid inventing relatives or heirs of the Golden King; they stay collective unless the owner names them ([OPEN_QUESTIONS.md](../OPEN_QUESTIONS.md), aenor 11). Their portraits are image-generated council scenes.

### Defines

None.

## AI

| Situation | AI behaviour |
| --- | --- |
| Charters | Golden Charters while the Golden King lives and corruption ≥ 40 (historical); Free Charters for Restless dominions otherwise. Never more than one charter decision per 60 days. |
| Concord Council | Every 365 days; picks "the old liberties" when average loyalty < 50 |
| Lost Cause | Raises frontier companies only after `zin_war_of_last_crowns` or when Volgan or Zol borders an Aenor ally |
| King's Health | Never under `zin_rule_historical_path` = `HISTORICAL`; otherwise weight 10 when council ≤ 50 |
| Camp choice | `zin_rule_ai_aenor_succession` (section 6) |
| Thirty Days | Uses its camp's support decision, then *Silence the Dissenters* |
| The stranger | Denounce under the Faithful and the Court; Let him speak under the Dominions; Shelter him under the Captains' Regency |
| Dominions | Accept re-entry (zin_aenor.402, 110) at loyalty ≥ 40 or when threatened by a dark power (`zin_diplo_is_dark_power`) |
| Hailed King | Historical: hail him (no leader change before the coronation) |
| Breakaways | Use the camp's branch of the Aenor tree; attack Parim first |

## Acceptance

1. A new game on 1 Thaw 4A 1748: corruption 70, council influence 65, Lost Cause 20; 26 dominions with loyalty, charters and `zin_autonomy_chartered_dominion` as tabled; no camp variable is set; Aenor's Shadow popularity is 0; nobody is at war; no text visible to Aenor names Afrit.
2. Offline scenario test, historical rule: the King dies between 1 and 30 Mistfall 4A 1750; `zin_golden_king_dead` is set after `zin_afrit_regicide_ready`; zin_aenor.201 picks the Faithful for AI Aenor; `zin_aurevan_crowned` is set within 31 days; no Aenor civil war starts; at most two dominions secede.
3. The same test with the Worshipdom removed on day 1 still kills the King in Mistfall 4A 1750 (the clock sets the flag).
4. Dynamic rule, scripted player: taking *The King's Tasters* and the three King's Health decisions with council ≤ 35 sets `zin_golden_king_plot_exposed`; the clock stops; at council ≥ 30 the Faithful rise as a dynamic country with `original_tag` Aenor; crushing it sets `zin_golden_king_survives` and `zin_golden_king_dead` is never set.
5. With forced values (Court 45, Faithful 60, Dominions 40, Host 0) and the Faithful chosen: one Court civil war (size 0.45) starts; dominions with loyalty < 50 leave and form The Free Dominions; Parim stays with the original country; the two breakaways are at war with each other.
6. The Host option and Host rising are impossible while `zin_aenor_host_available` is false.
7. Before `zin_afrit_revealed` the Faithful camp's party is Light and Aenor's Shadow popularity stays 0; on the reveal the Faithful's popularity moves to Shadow and the party names switch.
8. On `zin_afrit_abandoned_aenor` with the Faithful ruling (by the flight east or to the hermitage), the Captains' Regency leads within one day; on `zin_eindil_returned` the AI hails Eindil and the realm's leader does not change.
9. The historical scenario run reaches `zin_eindil_crowned` on or after 1 Thaw 4A 1760 with Eindil as ruler of an Aenor realm holding Parim; before the coronation Eindil is Selen's general and no Aenor realm's leader, and he becomes its leader the day `zin_aenor_crown_eindil` runs; `zin_ending_lost_cause` follows.
10. With `zin_rule_story_pace` = `SLOW`, the King's death falls 1.5 times as far from the start: 1,463 to 1,493 days after 1 Thaw 4A 1748 (Thaw 4A 1752).
11. The secret check: every localisation key reachable before `zin_afrit_revealed` passes the compiler's Afrit-name check; the Faithful party name changes after the reveal.
12. Loyalty stays within 0–100 for every dominion over a 12-year AI run; no dominion secedes before `zin_golden_king_dead` or `zin_golden_king_plot_exposed`.
13. A build test fails if a dominion named in the data is missing from `countries.json` or is not Aenor's subject there.
14. The HOI4 Agent Tools script validator reports no errors in the generated files, and every modifier, effect and trigger named here exists in the 1.19.3 documentation.
15. At the start no country has `zin_lost_cause_member` (O8); the generated files contain no `create_faction` and no event with id 310 in the `zin_aenor` namespace.
16. In the historical observer run `zin_reign.19` fires exactly one day before `zin_aenor.200`. In a scripted test a seceding dominion loses `zin_shared_concord_dominions_charter_loyalists`, and a reissued charter sets `zin_concord_charter_recent` for 180 days.
17. Build test: `zin_aenor.201` carries `checkpoint` and its first option is not the Faithful.

## Open questions

All proceed on the labelled proposal; the owner's questions are listed in [OPEN_QUESTIONS.md](../OPEN_QUESTIONS.md) under "aenor".

1. Which dominions bought privileges at the start? Proposal: Freshon and Pazoma Golden, Kingson Wall (aenor 2).
2. Mirolon's honorary membership at the start (aenor 3) is settled by decision O8: there is no honorary member at the start.
3. Is Mistfall 4A 1750 fixed for the King's death, or may the dynamic clock move it? Proposal: fixed under `HISTORICAL`, free under `DYNAMIC` (aenor 4).
4. May a surviving Golden King name Eindil his heir? Proposal: offered as zin_aenor.460, outside canon (aenor 5).
5. Who leads the Council's War? Proposal: Merovan in the Deliverer's name; Aurevan only after the reveal (aenor 6).
6. Should the collective leaders become named characters? Proposal: no, until the owner names relatives of the Golden King (aenor 11).
7. Should the Deliverer's Faithful look like Light until the reveal? Proposal: yes, as the Worshipdom does under D1 (aenor 1).
