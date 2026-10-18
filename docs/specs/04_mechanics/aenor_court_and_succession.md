# Aenor: the Golden Court and the succession

**Status:** Draft. **Priority:** 3. **Phase:** 3.

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

The focus tree that drives these systems is [../05_focus_trees/major/aenor.md](../05_focus_trees/major/aenor.md). Shared names come from [00_shared_contract.md](00_shared_contract.md).

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
| Every number, variable, threshold, charter type, camp mechanic, collective leader and event below | **proposed** | this spec |

Open in the vault and kept open here: the Golden King's personal name, relatives and heirs; who Merovan really is and his fate; whether the Lost Cause formally survives the final war; the Huhun/Hunhun spelling; what becomes of the Golden King's faction and Afrit's followers after the coronation; what the Necklace of the Abyss does to Eindil. Text never answers these.

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
| Shown as | The national spirit **The Golden Court**, a dynamic modifier whose values scale with corruption; the number appears in the Realm panel |

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
| ≥ 80 | Gilded Rot | Scandal events (zin_aenor.12) every ~120 days; dominion loyalty drift doubles its corruption term |
| 31–79 | — | none |
| ≤ 30 | Honest Court | Court camp support −10 at the succession; Golden Charters cannot be issued |

Corruption feeds the Golden Court camp at the King's death (see 6).

### 2. Temple Favour: `zin_council_influence` seen from Aenor

The Hidden Council governs through the temples, the Houses of the First Light and the King's councillors. Aenor owns this variable (contract); the Afrit spec's actions add to it through `zin_aenor_add_council_influence`.

| Item | Value (proposed) |
| --- | --- |
| Start | 65 |
| Monthly drift | +0.25 while the Golden King lives |
| Shown as | **Temple Favour** in the Realm panel: "how many offices are held by friends of the temples". After the focus *The Hidden Hand* (country flag `zin_aenor_hidden_hand_seen`) the same meter is relabelled **The Hidden Hand**. No label ever names Afrit or the Council before `zin_afrit_revealed`. |

Dynamic modifier `zin_aenor_temple_favour` (influence *i*): `stability_factor` +0.001 × *i*, `drift_defence_factor` +0.004 × *i*, `monthly_population` +0.002 × *i*. The temples genuinely help; that is the trap.

| Range | Name | Effect |
| --- | --- | --- |
| ≥ 70 | Council dominant (`zin_aenor_council_dominant`) | Event *The Chancellor's Counsel* (zin_aenor.20) about every 90 days: the Council picks an outcome unless the player pays 50 political power. Death clock pace ×1.25. Anti-Council focuses and decisions are unavailable. |
| 36–69 | — | Anti-Council decisions cost +50% political power |
| ≤ 35 | Council faltering (`zin_aenor_council_faltering`) | Death clock pace ×0.6; the plot can be exposed; zin_aenor.22 |
| ≤ 15 | Council broken | The Faithful camp's support at the succession is halved |

### 3. The Concord: charters and `zin_concord_loyalty`

The Charters of Parim (4A 3, proposed) bind the dominions to the crown as self-governing members of a common defence. In game the 26 dominions are Aenor's subjects (puppets) and members of the faction **Middle Kingdom Concord**. Each has `zin_concord_loyalty` (0–100, dominion scope) and exactly one charter.

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
| Hunhun | 3 | men | Wild | 55 | Old | The riders (Huhun/Hunhun spelling open in the vault) |
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

Cursed Lands, Bloody Forest and Fotan are outside the Concord and have no loyalty.

#### Loyalty bands

| Band | Range | Effect |
| --- | --- | --- |
| Steadfast | ≥ 75 | Sends a Concord Levy when Aenor asks (decision); never secedes |
| Loyal | 50–74 | none |
| Restless | 25–49 | Refuses levies (zin_aenor.103); may join the Free Dominions at the succession if the Dominions camp rises |
| Defiant | < 25 | Petitions (zin_aenor.101) while the King lives; **secedes** when the succession opens. Never secedes before the King's death: the start stays peaceful. |

Monthly change (hidden pulse, see Implementation):

- −0.02 × (corruption − 50) when corruption is above 50 (doubled at Gilded Rot);
- charter term: Free +0.4, Shield +0.2, Wall +0.1, Old 0, Golden −0.5;
- +0.1 while `zin_lost_cause_shield` is set and the dominion is in the faction;
- −0.3 while Aenor is at war and the dominion has an occupied state;
- clamped to 0–100.

#### Charters

A charter is a dominion-scoped national spirit. Aenor changes one with the targeted decision **Reissue the Charter of [Dominion]** (cost below; 180-day cooldown per dominion).

| Charter | Idea on the dominion | Modifiers on the dominion | Loyalty term | Requires | Cost |
| --- | --- | --- | --- | --- | --- |
| Old Charter | `zin_concord_charter_old` | none | 0 | — | 25 PP |
| Golden Charter (privileges sold to its lords) | `zin_concord_charter_golden` | `cic_to_overlord_factor` +0.10, `extra_trade_to_overlord_factor` +0.25, `political_power_gain` +0.2, `stability_factor` −0.05 | −0.5 | Focus *The Golden Charters*; corruption ≥ 40; Golden King alive or Court rules | 0 PP; corruption +3, Aenor +50 PP |
| Shield Charter | `zin_concord_charter_shield` | `army_org_factor` +0.05, `training_time_factor` −0.10, `autonomy_manpower_share` +0.10 | +0.2 | Focus *The Shield of the Concord* | 50 PP |
| Free Charter | `zin_concord_charter_free` | `stability_factor` +0.10, `political_power_gain` +0.25, `cic_to_overlord_factor` −0.05 | +0.4 | Focus *The Charters of Parim Renewed*, or the Dominions or Host camp rules | 50 PP |
| Wall Charter | `zin_concord_charter_wall` | `army_defence_factor` +0.05, `max_dig_in` +2 | +0.1 | Dominion owns a Great Wall state (Kingson at start) | 25 PP |

Other Concord decisions (category `zin_aenor_cat_concord`):

| Decision | Effect | Cost | Cooldown |
| --- | --- | --- | --- |
| Convene the Concord Council | Event zin_aenor.100: choose "the King's tribute" (Aenor +100 PP, all loyalty −5) or "the old liberties" (all loyalty +5, corruption −2) | 50 PP | 365 days |
| Call the Concord Levy | Each Steadfast dominion gives Aenor 2,000 manpower and loses 2 loyalty | 25 PP | 180 days |
| Restore the Charter of [Dominion] | Only for a seceded dominion; only after the focus *Restore the Charters by Force*; creates a `puppet` war goal | 75 PP | — |

### 4. The Lost Cause

The Lost Cause (founded 4A 1741, proposed date) is the Golden King's league against "the powers of the dark". At the start it is mostly ornament. Its frontier companies and scholars are real.

| Item | Value (proposed) |
| --- | --- |
| Variable | `zin_aenor_lost_cause` (Aenor, 0–100): the real strength of its frontier companies and scholars. Start 20. |
| Start spirit | `zin_aenor_lost_cause_court` *The Lost Cause*: `political_power_gain` +0.15, `war_support_factor` +0.03, `consumer_goods_factor` +0.02 |
| Members | Aenor and every Concord dominion (ceremonial). Foreign "honorary crowns" get country flag `zin_lost_cause_member`; at start only Mirolon (proposed: the Mirolonese warning of 4A 1736). Honorary membership carries no faction or war obligations. |

What the strength unlocks (category `zin_aenor_cat_lost_cause`):

| Strength | Unlocks |
| --- | --- |
| ≥ 30 | Decision **Raise a Frontier Company** (50 PP, 1,000 manpower): spawns one ranger brigade in a frontier state via `zin_aenor_raise_frontier_company` |
| ≥ 40 | The King's Health decisions (after the focus *The King's Tasters*) |
| ≥ 60 | Focus *The Shield of the Concord* may be taken |
| any | At the succession, Host support = 0.5 × strength (if the Host is available) |

Three paths, recorded as **global** flags because other specs read them:

| Path | Flag | How | Meaning |
| --- | --- | --- | --- |
| Ornament | none | default | The King's vanity. Its spirit gives prestige only. |
| Shield of the Concord | `zin_lost_cause_shield` | Focus *The Shield of the Concord* | The faction is renamed **The Lost Cause** (`set_faction_name`); honorary crowns may be invited into the faction (targeted decision, AI accepts by opinion and threat); Shield Charters open |
| Eindil's army | `zin_lost_cause_with_eindil` | Focus *The Lost Cause Reborn*, or Host branch *Son of Ein, Son of Aen* | The frontier companies and scholars follow Eindil; Host support +20; feeds the Lost Cause ending (world systems) |

When Eindil reaches the Middle Lands, event zin_aenor.160 *The Lost Cause Divided* fires for the Aenor realm: the court branch sides with the government, the frontier and scholarly branches drift to Eindil unless the government is the Host (proposed, after the vault's proposal).

### 5. The death clock

A hidden countdown to the Golden King's murder. The player never sees the number.

| Item | Value (proposed) |
| --- | --- |
| Variable | `zin_aenor_king_clock` (Aenor): days left |
| Start | 975 + random 0–20 (lands in Mistfall 4A 1750) |
| Tick | Every 30 days, subtract 30 × `zin_aenor_clock_pace` |
| Pace | 1.0 base; ×1.25 at Council dominant; ×0.6 at Council faltering; ×0.5 while the spirit *The King's Tasters* (`zin_aenor_kings_tasters`) is active |
| Floor date | The King never dies before 1 Sowing 4A 1749 (at least 14 months of peace) |
| Fires | When the clock reaches 0: zin_aenor.200 *The King Is Dead* |
| Hasten | The Afrit spec may call `zin_aenor_hasten_death_clock` (`days` argument; at most 180 days in total) |
| Delay | Aenor's Lost Cause focuses call `zin_aenor_delay_death_clock` (`days`) |

Game rule `zin_rule_golden_king_death`:

| Option | Effect |
| --- | --- |
| `historical` | Clock fixed at 975 + 0–20 days; pace ignored; the plot cannot be exposed |
| `dynamic` (default) | As above, with pace, hastening, delay and exposure |
| `late` | Start value +365 days |

Under `zin_rule_historical_path`, AI Aenor never takes delaying or exposing actions, so the death falls in Mistfall 4A 1750.

**Omens.** With the flag `zin_aenor_royal_physicians` (from the decision *Question the Royal Physicians*), zin_aenor.240 reports the King's health in words ("sound", "tired", "failing") when the clock is above 365, between 180 and 365, or below 180. This is the only hint.

**Exposing the plot (the King's Health decisions, category `zin_aenor_cat_kings_health`).** Visible after the focus *The King's Tasters*; requires `zin_rule_golden_king_death` not `historical`.

| Step | Decision | Cost, time | Condition | Result |
| --- | --- | --- | --- | --- |
| 1 | Question the Royal Physicians | 50 PP, 30 days | Lost Cause ≥ 40 | Flag `zin_aenor_royal_physicians`; event zin_aenor.240 |
| 2 | Follow the Poisoner's Coin | 75 PP, 45 days | Step 1; council ≤ 50 | Event zin_aenor.241: success chance 30% + (50 − council)%; success sets `zin_aenor_poisoner_found` |
| 3 | Lay the Proof Before the King | 100 PP | Step 2 succeeded | Event zin_aenor.242: the King believes if corruption < 60, otherwise 50%. If he believes: global flag `zin_golden_king_plot_exposed`, clock stops, zin_aenor.250 |

The exposure names "the Chancellor's circle" and "men in temple robes". It never names Afrit and never sets `zin_afrit_revealed` (that belongs to the Afrit spec).

**The Council's War.** On exposure, zin_aenor.260: if council ≥ 30 the Faithful rise in civil war (section 7) led by Merovan as Lord Protector "in the Deliverer's name"; otherwise the Council scatters (council −20, Merovan leaves the government). When the rising is crushed, or the Council scatters, the global flag `zin_golden_king_survives` is set and the succession war never happens. The Afrit spec decides whether Aurevan takes a crown in that rising.

### 6. The Empty Throne: the four-camp succession

The four camps (established) and their engine ideologies (proposed):

| Camp | Who | Ideology | Party name before / after the reveal |
| --- | --- | --- | --- |
| Golden Court | Office-buyers, courtiers, merchant houses | Dominion (`fascism`) | The Golden Court |
| Free Dominions | Dominion lords and provincial marches who want their charters back | Wild (`neutrality`) | The Free Dominions |
| Afrit's supporters | The temples, the Council, the faithful | Shadow (`communism`) | **The Deliverer's Faithful** / Afrit's Supporters |
| Eindil's popular host | Frontier companies, scholars, commoners, Selen | Light (`democratic`) | The Popular Host |

The party name switches through `set_party_name` when `zin_afrit_revealed` is set.

**Support.** Four Aenor variables, 0–100, computed on zin_aenor.200 and changed during the Thirty Days:

| Variable | Initial value |
| --- | --- |
| `zin_aenor_camp_court` | 0.5 × corruption (+10 with the spirit *Gilded Parim*; −10 at Honest Court) |
| `zin_aenor_camp_faithful` | 0.8 × council influence (halved if council ≤ 15) |
| `zin_aenor_camp_dominions` | 0.6 × (100 − average dominion loyalty) + 5 per Defiant dominion |
| `zin_aenor_camp_host` | 0 unless `zin_aenor_host_available`; then 0.5 × Lost Cause strength, +20 with `zin_lost_cause_with_eindil` |

Party popularities are set in proportion to the four values (`set_popularities`), so the political screen shows the contest.

`zin_aenor_host_available`: `zin_eindil_named` is set and Eindil has reached the Middle Lands (the Eindil spec's stage for his warnings; proposed `zin_eindil_stage` ≥ 9). On the historical path this is false in 4A 1750: the Host cannot rise at the King's death.

**Sequence.**

1. **zin_aenor.200 *The King Is Dead*** (news to every country). The King "died in his sleep after the Mistfall feast". Sets global `zin_golden_king_dead`; retires `<Aenor tag>_zin_ruler`; adds spirit `zin_aenor_interregnum`; computes support; opens category `zin_aenor_cat_empty_throne` for 30 days. Every Defiant dominion secedes at once (zin_aenor.220).
2. **zin_aenor.201 *Whom Will You Follow?*** (Aenor only). One option per camp; the Host option shows only if available. The choice sets `zin_aenor_ruling_camp` and the government ideology. AI: under `zin_rule_historical_path` the Faithful; otherwise the camp with the highest support (ties: Faithful, Court, Dominions, Host).
3. **The Thirty Days.** Decisions for the chosen camp:

| Decision | Camp | Effect | Cost |
| --- | --- | --- | --- |
| Open the Treasury | Court | Court +10; corruption +5 | 50 PP |
| The Temples Speak | Faithful | Faithful +10; council +5 | 25 PP |
| Charters for the Loyal | Dominions | Dominions +10; all loyalty +5 | 50 PP |
| The Stranger's Word | Host | Host +10 | 50 PP |
| Silence the Dissenters | any ruling camp, once | Every other camp −15; stability −0.03 | 75 PP (25 PP for the Faithful at council ≥ 70) |

4. **zin_aenor.210 *The Seals of Parim*** after 30 days. The chosen camp takes the crown:

| Ruling camp | New leader | Other effects |
| --- | --- | --- |
| Faithful | Aurevan, through the Afrit spec's `zin_afrit_crown_aurevan` (sets `zin_aurevan_crowned`) | Spirit `zin_aenor_interregnum` removed; council +10 |
| Court | `zin_aenor_golden_regency` (collective leader: *The Regency of the Golden Court*) | No king is named; the Regency rules "for the crown" |
| Dominions | `zin_aenor_concord_speaker` (collective leader: *The Speaker of the Concord*) | Every dominion gets a Free Charter and +15 loyalty |
| Host | `zin_eindil` as the **Hailed King** (not crowned) | Country flag `zin_aenor_hailed_king` |

5. **Risings.** Every other camp whose support is **≥ 30** rises at the same moment (section 7). Support below 30 is silenced: event *The Dissenters Silenced* (zin_aenor.215), no war.

Historical outcome (proposed numbers): corruption ~78 and council ~85 at the death give Court 39, Faithful 68, Dominions ~30, Host 0. The AI Faithful use *Silence the Dissenters*: Court 24, Dominions 15. Nobody rises. 0–2 Defiant dominions have already seceded. Aurevan is crowned within 30 days: "much of the kingdom obeyed".

**After the crowning.** Camp variables persist and drift by events and focuses. A camp that later reaches 50 support while not ruling triggers zin_aenor.216 *A Rival for the Crown* (risings as in step 5) at most once per camp per year.

### 7. Civil wars and dynamic countries

How a camp becomes a country:

| Camp rising against the ruler | Mechanism | Size | States |
| --- | --- | --- | --- |
| Court | `start_civil_war` with `ideology = fascism` | support / 100, at most 0.45 | States with the state flag `zin_aenor_lean_court`, then nearest to them, until the size is met |
| Faithful | `start_civil_war` with `ideology = communism` | support / 100, at most 0.5 | `zin_aenor_lean_temple` states |
| Host | `start_civil_war` with `ideology = democratic`; Eindil is moved to the new country as its leader | support / 100, at most 0.45 | `zin_aenor_lean_march` states, then Selen's border |
| Dominions | **Not a civil war.** Every Restless and Defiant dominion leaves (`end_puppet`, `remove_from_faction`), gets spirit `zin_aenor_free_dominion` and joins the faction **The Free Dominions** (created by the largest seceder) | — | Their own states |

Rules:

- **State leanings.** The politics step tags each of Aenor's 18 states with one leaning, stored as a state flag from the data file `docs/design/aenor_states.json` (proposed): `zin_aenor_lean_court` (Parim's hinterland estates), `zin_aenor_lean_temple` (Great Lake cities), `zin_aenor_lean_march` (frontier and wall states) or none. **Parim never leaves the ruling camp.**
- **The player stays on the original country.** Because the player picks the ruling camp in zin_aenor.201 before the war starts, the original country is always the player's camp, as in the vanilla pattern for civil wars with a chosen side.
- **Who goes where.** `keep_unit_leaders_trigger` keeps every general without a camp flag; generals with the character flag `zin_aenor_camp_court`, `_faithful` or `_host` go to that camp. Merovan goes with the Faithful. Starting generals' camp flags are listed in the 02_lore character spec.
- **Rival breakaways** declare war on each other (`declare_war_on`, type `annex_everything`): each wants the crown. The Free Dominions are at war with nobody unless Aenor takes *Restore the Charters by Force*.
- **Realm identity.** Breakaways are dynamic countries whose `original_tag` is Aenor's. Every Aenor script tests `zin_aenor_is_realm` (original tag), never a tag. The focus tree is loaded by original tag, so a breakaway uses the Aenor tree; the `start_civil_war` effect block sets `zin_aenor_ruling_camp` and the camp's country flag on the new country, and copies the four camp variables, corruption, council influence and the Lost Cause strength.
- **Names.** Cosmetic names (proposed): *The Golden Court*, *Aenor of the Faithful* (after the reveal: *Aenor of Afrit*), *The Popular Host*. Flags are generated variants of Aenor's.
- **Ending a civil war.** The vanilla rule: the side that capitulates is annexed. The hidden handler zin_aenor.230 (from `on_civil_war_end`) re-subjects every former dominion with loyalty ≥ 50 to the winner and sets the winner's `zin_aenor_ruling_camp`. If a breakaway wins, it is now the Aenor realm.
- **Limits.** At most three Aenor breakaways at once. No rising may start while Aenor is capitulating.

### 8. The abandoned throne, the hailed king and the Crown of Aen

**The abandoned throne.** When the Afrit spec sets `zin_afrit_king_of_east` and the Faithful rule an Aenor realm, zin_aenor.300 *The Throne Abandoned* fires there: Aurevan's leader role is removed (the Afrit spec moves the character east); Merovan leaves the government without explanation (his fate is open); the timed spirit `zin_aenor_throne_abandoned` is added; leadership passes to `zin_aenor_captains_regency` (collective leader: *The Captains' Regency*, the Lost Cause's frontier commanders); government becomes Light; `zin_aenor_ruling_camp` = 5. If the player's Aenor is not ruled by the Faithful, the event is news only.

**The stranger's warning.** When Eindil warns Aenor (the Eindil spec; historical 4A 1754), zin_aenor.310 fires for the Aenor realm:

| Option | Effect | AI |
| --- | --- | --- |
| Denounce the impostor | Host −20; country flag `zin_aenor_eindil_denounced`; stability +0.03 | Faithful and Court rulers; historical |
| Hear him out | Host +10; Lost Cause +5 | Dominions rulers |
| Shelter him | Host +25; requires Light or Wild government; Eindil spec flag that he is protected | Host |

**The hailed king.** On `zin_eindil_returned` (historical 4A 1757):

- If the Captains' Regency or the Dominions rule: zin_aenor.320 *The Hailed King*. "Hail him" (historical): Eindil becomes country leader as the Hailed King, spirit `zin_aenor_hailed_king`, `zin_aenor_ruling_camp` = 4, flag `zin_aenor_hailed_king`. "Refuse": the Host rises (section 7) with support = max(current, 40).
- If the Faithful or the Court rule: zin_aenor.321 *The Host Rises*: the Host rises with support = max(current, 35).

While Eindil is lost after the cliff (the Eindil spec's event), the Eindil spec calls `zin_aenor_regency_while_king_lost`: the Captains' Regency leads; Eindil's return calls `zin_aenor_restore_hailed_king`.

**The Crown of Aen.** Scripted trigger `zin_aenor_eindil_can_be_crowned`:

- `zin_afrit_dead`, `zin_eindil_named` and `zin_eindil_returned` are set; `zin_eindil_crowned` is not;
- an Aenor realm has the character `zin_eindil` and controls Parim (`zin_is_site_parim`);
- that country is not capitulated and no enemy division stands in Parim's state;
- under `zin_rule_historical_path`: the date is on or after 1 Deepwinter 4A 1760.

When it has held for 30 days, zin_aenor.400 *The Crown of Aen* fires (no options except acceptance) and zin_aenor.401 is news to every country. Effects (`zin_aenor_crown_eindil`):

- global `zin_eindil_crowned`;
- Eindil becomes ruler: title King of Aenor; government Light; every camp spirit, `zin_aenor_interregnum`, `zin_aenor_hailed_king` and regency spirits removed;
- spirit `zin_aenor_rightful_king`;
- zin_aenor.402 *A Charter of Equals* to every Concord dominion and every Free Dominion: rejoin with a Free Charter, or stay free; neither is forced (the Lost Cause refuses imperial rule);
- calls the world systems' ending check (`zin_world_check_endings`); the world spec sets `zin_ending_lost_cause`.

The event text says Eindil wears the Necklace of the Abyss and that "its price is not yet known". No modifier represents the Necklace.

### 9. Other outcomes (proposed, outside canon)

| Outcome | Reached by | Recorded as |
| --- | --- | --- |
| The Golden King survives | The plot exposed and the Council's War won | global `zin_golden_king_survives`; zin_aenor.460 *The King and the Stranger* later lets the King name Eindil his heir or refuse him |
| The Regency of Gold endures | The Court rules and survives to 4A 1760 | country flag `zin_aenor_regency_endures` |
| The Concord of Equals | The Dominions rule, or the Concord is rebuilt by consent | country flag `zin_aenor_concord_of_equals` |
| The Ashen Throne | The Faithful still rule Aenor at the end | owned by the Afrit spec and world systems |

None of these is written as history; event text describes them as what happened "in this telling".

## Implementation

### Files

| File | Content |
| --- | --- |
| `common/scripted_triggers/zin_aenor_court.txt` | Triggers below |
| `common/scripted_effects/zin_aenor_court.txt` | Effects below |
| `common/dynamic_modifiers/zin_aenor_court.txt` | `zin_aenor_golden_court`, `zin_aenor_temple_favour` |
| `common/ideas/zin_aenor_court.txt` | Mechanic spirits and the five charter ideas |
| `common/decisions/categories/zin_aenor_court.txt`, `common/decisions/zin_aenor_court.txt` | Categories `zin_aenor_cat_court`, `zin_aenor_cat_concord`, `zin_aenor_cat_lost_cause`, `zin_aenor_cat_kings_health`, `zin_aenor_cat_empty_throne` |
| `events/zin_aenor_court.txt` | Mechanic events, namespace `zin_aenor`, ids 1–499 (the tree's `events/zin_aenor.txt` uses 500–699) |
| `common/on_actions/zin_aenor_court.txt` | `on_startup` (setup), `on_civil_war_end` (zin_aenor.230) |
| `common/game_rules/zin_rules.txt` | `zin_rule_golden_king_death` (shared rules file) |
| `docs/design/aenor_states.json` | State leanings (input to the politics step) |
| `localisation/english/zin_aenor_l_english.yml` | All text, including the pre- and post-reveal party names and the Temple Favour / Hidden Hand labels |

All generated by the content builder; written through the shared rewrite engine.

### Variables

| Variable | Scope | Range | Meaning |
| --- | --- | --- | --- |
| `zin_court_corruption` | Aenor realm | 0–100 | Shared (contract) |
| `zin_council_influence` | Aenor realm | 0–100 | Shared (contract) |
| `zin_concord_loyalty` | dominion | 0–100 | Shared (contract) |
| `zin_aenor_lost_cause` | Aenor realm | 0–100 | Lost Cause strength |
| `zin_aenor_king_clock` | Aenor | days | Death clock |
| `zin_aenor_clock_pace` | Aenor | 0.25–2 | Clock pace |
| `zin_aenor_clock_hastened` | Aenor | 0–180 | Days already hastened |
| `zin_aenor_camp_court`, `_faithful`, `_dominions`, `_host` | Aenor realm | 0–100 | Camp support |
| `zin_aenor_ruling_camp` | Aenor realm | 0–5 | 0 the Golden King, 1 Court, 2 Faithful, 3 Dominions, 4 Host, 5 Captains' Regency |
| `zin_aenor_dm_*` | Aenor realm | — | Derived values for the dynamic modifiers, recomputed by `zin_aenor_refresh_modifiers` |

### Flags

| Flag | Type | Meaning |
| --- | --- | --- |
| `zin_golden_king_dead` | global | Contract |
| `zin_golden_king_plot_exposed` | global | The plot against the King is exposed |
| `zin_golden_king_survives` | global | The King survived the Council's War |
| `zin_lost_cause_shield` | global | The Lost Cause became the Concord's shield |
| `zin_lost_cause_with_eindil` | global | The Lost Cause follows Eindil |
| `zin_lost_cause_member` | country | Honorary or full Lost Cause member |
| `zin_aenor_hidden_hand_seen` | country | Temple Favour relabelled |
| `zin_aenor_royal_physicians`, `zin_aenor_poisoner_found` | country | Investigation steps |
| `zin_aenor_hailed_king` | country | Eindil leads as the Hailed King |
| `zin_aenor_eindil_denounced` | country | Aenor denounced Eindil |
| `zin_aenor_free_dominion` | country | A dominion that seceded |
| `zin_aenor_lean_court`, `zin_aenor_lean_temple`, `zin_aenor_lean_march` | state | State leanings |
| `zin_aenor_camp_court`, `zin_aenor_camp_faithful`, `zin_aenor_camp_host` | character | Generals' camps |

### Scripted triggers

| Trigger | Scope | True when |
| --- | --- | --- |
| `zin_aenor_is_realm` | country | `original_tag` is Aenor's |
| `zin_aenor_is_concord_dominion` | country | subject of an Aenor realm and not `zin_aenor_free_dominion` |
| `zin_aenor_king_alive` | any | `zin_golden_king_dead` not set |
| `zin_aenor_council_dominant` | Aenor | council ≥ 70 |
| `zin_aenor_council_faltering` | Aenor | council ≤ 35 |
| `zin_aenor_court_gilded` | Aenor | corruption ≥ 80 |
| `zin_aenor_dominion_steadfast` / `_loyal` / `_restless` / `_defiant` | dominion | loyalty band |
| `zin_aenor_host_available` | any | see section 6 |
| `zin_aenor_ruled_by_court` / `_faithful` / `_dominions` / `_host` / `_captains` | Aenor realm | `zin_aenor_ruling_camp` value |
| `zin_aenor_eindil_can_be_crowned` | any | see section 8 |

### Scripted effects

| Effect | Scope | Arguments | Does |
| --- | --- | --- | --- |
| `zin_aenor_add_court_corruption` | Aenor realm | `value` | Adds, clamps (floor 25 while the King lives), refreshes modifiers |
| `zin_aenor_add_council_influence` | any (targets the ruling Aenor realm) | `value` | Adds, clamps, refreshes modifiers |
| `zin_aenor_add_concord_loyalty` | dominion | `value` | Adds and clamps |
| `zin_aenor_add_concord_loyalty_all` | Aenor realm | `value` | Every Concord dominion |
| `zin_aenor_add_lost_cause` | Aenor realm | `value` | Adds and clamps |
| `zin_aenor_set_charter` | dominion | `charter` | Swaps the charter idea |
| `zin_aenor_refresh_modifiers` | Aenor realm | — | Recomputes `zin_aenor_dm_*` |
| `zin_aenor_tick_death_clock` | Aenor | — | Monthly tick |
| `zin_aenor_hasten_death_clock` | any | `days` | For the Afrit spec; capped at 180 in total |
| `zin_aenor_delay_death_clock` | Aenor | `days` | For Lost Cause focuses |
| `zin_aenor_open_succession` | Aenor | — | zin_aenor.200's body |
| `zin_aenor_add_camp_support` | Aenor realm | `camp`, `value` | Adds and resets popularities |
| `zin_aenor_raise_camp` | Aenor realm | `camp` | One rising (section 7) |
| `zin_aenor_secede_dominion` | dominion | — | Secession (section 7) |
| `zin_aenor_raise_frontier_company` | Aenor realm | — | One ranger brigade |
| `zin_aenor_regency_while_king_lost`, `zin_aenor_restore_hailed_king` | Aenor realm | — | For the Eindil spec |
| `zin_aenor_crown_eindil` | Aenor realm | — | Coronation effects |
| `zin_aenor_convene_concord_council` | Aenor realm | — | Fires zin_aenor.100 (used by the tree) |
| `zin_aenor_set_charter_all` | Aenor realm | `charter` | Every Concord dominion |
| `zin_aenor_raise_lost_cause_shield` | Aenor realm | — | Sets `zin_lost_cause_shield`, renames the faction, opens Shield Charters and the faction invitations |
| `zin_aenor_invite_free_dominions` | Aenor realm | — | Fires zin_aenor.110 *Letters to the Free Dominions* for every Free Dominion: rejoin with a Free Charter (AI: loyalty term ≥ 40 or threatened) or stay free |
| `zin_aenor_raise_golden_guard` | Aenor realm | — | Two guard divisions in Parim |
| `zin_aenor_wargoal_on_parim_holder` | Aenor realm | — | `annex_everything` war goal against the controller of Parim if it is not an ally |
| `zin_aenor_people_choose` | Aenor realm | — | Country flag `zin_aenor_people_chose`; shortens the coronation wait from 30 to 7 days |

Triggers used by the tree: `zin_aenor_parim_lost` (an Aenor realm does not control Parim), `zin_aenor_eindil_rules` (the country leader is `zin_eindil`), `zin_aenor_free_dominions_exist` (any country has `zin_aenor_free_dominion`).

### Monthly pulse

Hidden event zin_aenor.2 fires for Aenor 30 days after start and re-fires itself every 30 days: corruption drift, council drift, the clock tick, loyalty drift for every Concord dominion, Council-dominant events, refresh of the dynamic modifiers. (If the builder adopts a monthly on_action, the pulse moves there.)

### Events (namespace `zin_aenor`)

| Id | Title | Trigger | Options |
| --- | --- | --- | --- |
| 1 | (hidden) setup | `on_startup` | Sets start values, charters, dynamic modifiers, Mirolon's honorary flag, starts the pulse |
| 2 | (hidden) monthly pulse | itself | — |
| 10 | A Feast in the Golden Court | random, corruption ≥ 50, ~every 180 days | Spend (+25 PP, corruption +3) / Cut the guest list (−10 PP, corruption −2) |
| 11 | Offices for Sale | corruption ≥ 60, ~every 150 days | Sell (+50 PP, corruption +4) / Refuse (stability +0.02; refused while the King lives unless corruption ≤ 50) |
| 12 | A Scandal in the Gilded Halls | Gilded Rot, ~every 120 days | Hush it (−25 PP) / Let it run (stability −0.03, corruption −5) |
| 20 | The Chancellor's Counsel | Council dominant, ~every 90 days | Accept (council +3, the Council's pick) / Overrule (−50 PP, council −2) |
| 21 | Gifts from the Houses | council ≥ 50, ~every 180 days | Accept (stability +0.02, council +2) / Decline (−0.02 stability) |
| 22 | The Temples Lose Favour | council crosses ≤ 35 | OK |
| 100 | The Concord Council Meets | decision | The King's tribute / The old liberties |
| 101 | A Charter Grievance | Defiant dominion, ~every 120 days while the King lives | Grant (loyalty +10, −50 PP) / Refuse (loyalty −5) |
| 102 | A New Charter (to the dominion) | charter decision | OK |
| 103 | The Levy Refused | Restless dominion asked for a levy | OK |
| 110 | Letters to the Free Dominions (to a Free Dominion) | `zin_aenor_invite_free_dominions` | Rejoin under a Free Charter / Stay free |
| 150 | The League's Triumph | Lost Cause focus | flavour |
| 151 | Warnings from Mirolon | ~every 300 days in 1748–1750 | Laugh (+25 PP, corruption +2) / Listen (Lost Cause +5) |
| 152 | Tales of Black Ships | ~every 300 days | Dismiss / Send a ship (Lost Cause +3, −25 PP) |
| 160 | The Lost Cause Divided | Eindil reaches the Middle Lands | Hold the court branch (Lost Cause −10) / Let the frontier decide (Host +10) |
| 200 | The King Is Dead | death clock | OK (news to all) |
| 201 | Whom Will You Follow? | after 200 | one per camp |
| 210 | The Seals of Parim | 30 days after 201 | OK |
| 211–214 | The Golden Court / the Faithful / the Host Rises; The Dominions Declare Themselves Free | risings | OK (news) |
| 215 | The Dissenters Silenced | camps under 30 | OK |
| 216 | A Rival for the Crown | a camp reaches 50 | OK |
| 220 | A Dominion Breaks Its Charter | secession (dominion and Aenor) | OK |
| 230 | (hidden) civil war end | `on_civil_war_end` | — |
| 240 | The King's Physicians | decision | OK (health in words) |
| 241 | The Poisoner's Coin | decision | OK |
| 242 | Proof Before the King | decision | Show the King / Keep it secret |
| 250 | The King Learns | exposure | OK |
| 260 | The Council's War | after 250 | OK |
| 261 | The King Endures | rising crushed or Council scattered | OK |
| 300 | The Throne Abandoned | `zin_afrit_king_of_east` | OK |
| 310 | The Stranger's Warning | Eindil spec | Denounce / Hear him out / Shelter him |
| 320 | The Hailed King | `zin_eindil_returned`, regency or Dominions rule | Hail him / Refuse |
| 321 | The Host Rises | `zin_eindil_returned`, Faithful or Court rule | OK |
| 330 | The King Is Lost / 331 The King Returns | Eindil spec | OK |
| 400 | The Crown of Aen | `zin_aenor_eindil_can_be_crowned` for 30 days | OK |
| 401 | Eindil Is Crowned (news) | 400 | OK |
| 402 | A Charter of Equals | 400, to each dominion | Rejoin with a Free Charter / Stay free |
| 460 | The King and the Stranger | `zin_golden_king_survives` and Eindil in the Middle Lands | Name him heir / Refuse him |

Mean-time events (10–22, 101, 151, 152) declare `trigger` and `mean_time_to_happen` because this is a mechanics-owned file.

### Spirits

| Id | Name | Modifiers | Added / removed |
| --- | --- | --- | --- |
| `zin_aenor_golden_court` (dynamic) | The Golden Court | section 1 | Start; removed at the coronation or Honest Court ≤ 25 after the King's death |
| `zin_aenor_temple_favour` (dynamic) | Temple Favour / The Hidden Hand | section 2 | Start; removed on `zin_afrit_king_of_east` if Aenor is abandoned |
| `zin_aenor_lost_cause_court` | The Lost Cause | `political_power_gain` +0.15, `war_support_factor` +0.03, `consumer_goods_factor` +0.02 | Start; swapped by focuses |
| `zin_aenor_kings_tasters` | The King's Tasters | `stability_factor` +0.02 | Focus; 365 days |
| `zin_aenor_interregnum` | The Empty Throne | `political_power_factor` −0.25, `stability_weekly` −0.002, `drift_defence_factor` −0.3 | zin_aenor.200 / 210 |
| `zin_aenor_free_dominion` | A Free Dominion (on a seceded dominion) | `stability_factor` +0.05, `war_support_factor` +0.05 | Secession / rejoining |
| `zin_aenor_throne_abandoned` | The Throne Abandoned | `stability_factor` −0.10, `war_support_factor` −0.05 | zin_aenor.300; 180 days |
| `zin_aenor_hailed_king` | The Hailed King | `war_support_factor` +0.10, `army_morale_factor` +0.05 | zin_aenor.320 / 400 |
| `zin_aenor_rightful_king` | The Rightful King | `stability_factor` +0.15, `war_support_factor` +0.10, `political_power_gain` +0.5 | zin_aenor.400 |
| `zin_concord_charter_*` | the five charters | section 3 | Decisions |

### Characters

| Id | Who | Status |
| --- | --- | --- |
| `<Aenor tag>_zin_ruler` | The Golden King | contract |
| `zin_merovan` | Chancellor Merovan, head of government at start | contract |
| `zin_aurevan` | Aurevan | contract; crowned by the Afrit spec |
| `zin_eindil` | Eindil | contract |
| `zin_aenor_golden_regency` | The Regency of the Golden Court (collective leader, council portrait) | proposed |
| `zin_aenor_concord_speaker` | The Speaker of the Concord (collective leader) | proposed |
| `zin_aenor_captains_regency` | The Captains' Regency (collective leader) | proposed |

Collective leaders avoid inventing relatives or heirs of the Golden King.

### Defines

None.

## AI

| Situation | AI behaviour |
| --- | --- |
| Charters | Golden Charters while the Golden King lives and corruption ≥ 40 (historical); Free Charters for Restless dominions otherwise. Never more than one charter decision per 60 days. |
| Concord Council | Every 365 days; picks "the old liberties" when average loyalty < 50 |
| Lost Cause | Raises frontier companies only after `zin_war_of_last_crowns` or when Volgan or Zol borders an Aenor ally |
| King's Health | Never under `zin_rule_historical_path`; otherwise weight 10 when council ≤ 50 |
| Camp choice | Historical: the Faithful. Otherwise the strongest camp. |
| Thirty Days | Uses its camp's support decision, then *Silence the Dissenters* |
| Dominions | Accept re-entry (zin_aenor.402, 110) at loyalty ≥ 40 or when threatened by a dark power |
| Hailed King | Historical: hail him |
| Breakaways | Use the camp's branch of the Aenor tree; attack Parim first |

## Acceptance

1. A new game on 1 Thaw 4A 1748: corruption 70, council influence 65, Lost Cause 20; 26 dominions with loyalty and charters as tabled; no camp variable is set; nobody is at war; no text visible to Aenor names Afrit.
2. Offline scenario test, historical rule: the King dies between 1 and 30 Mistfall 4A 1750; `zin_golden_king_dead` is set; zin_aenor.201 picks the Faithful for AI Aenor; `zin_aurevan_crowned` is set within 31 days; no Aenor civil war starts; at most two dominions secede.
3. Dynamic rule, scripted player: taking *The King's Tasters* and the three King's Health decisions with council ≤ 35 sets `zin_golden_king_plot_exposed`; the clock stops; at council ≥ 30 the Faithful rise as a dynamic country with `original_tag` Aenor; crushing it sets `zin_golden_king_survives` and `zin_golden_king_dead` is never set.
4. With forced values (Court 45, Faithful 60, Dominions 40, Host 0) and the Faithful chosen: one Court civil war (size 0.45) starts; Dominions with loyalty < 50 leave and form The Free Dominions; Parim stays with the original country; the two breakaways are at war with each other.
5. The Host option and Host rising are impossible while `zin_aenor_host_available` is false.
6. On `zin_afrit_king_of_east` with the Faithful ruling, the Captains' Regency leads within one day; on `zin_eindil_returned` the AI hails Eindil.
7. The historical scenario run reaches `zin_eindil_crowned` in 4A 1760 with Eindil as ruler of an Aenor realm holding Parim.
8. The secret check: every localisation key reachable before `zin_afrit_revealed` passes the compiler's Afrit-name check; the Faithful party name changes after the reveal.
9. Loyalty stays within 0–100 for every dominion over a 12-year AI run; no dominion secedes before `zin_golden_king_dead` or `zin_golden_king_plot_exposed`.
10. The HOI4 Agent Tools script validator reports no errors in the generated files.

## Open questions

1. Is Shadow the right ideology for the Deliverer's Faithful, or should Aurevan's party look like Light to the public (with Shadow only after the reveal)?
2. Should Mirolon be the Lost Cause's only honorary member at start, or none, or several crowns?
3. The four dominions on special charters at start (Freshon and Pazoma Golden, Kingson Wall) are guesses: which dominions bought privileges from the Golden King?
4. Is "Mistfall 4A 1750" fixed for the King's death, or may the dynamic clock wander by months?
5. Should a surviving Golden King be able to name Eindil his heir, or is that too far from canon to offer?
6. Should collective leaders (Regency, Speaker, Captains) become named characters later? The vault leaves the King's relatives open, so this spec avoids names.
7. Who leads the Council's War rising: Merovan in the Deliverer's name, or Aurevan openly? (Afrit spec to decide.)
8. Mechanic events and tree events share the namespace `zin_aenor` (ids 1–499 and 500–699). Does the focus compiler accept an id offset, or should the tree use its own namespace?
