# The Cold Lands: the Northern Accord, the tribes and the far north

**Status:** Draft. **Priority:** 3. **Phase:** 3.

## Purpose

The Cold Lands are the largest landmass of Erdae and the least known. Coldor rules the frozen interior and the western ports from Fandanar and leads the Northern Accord with Horidor; Isengard refuses it. Around them live two dozen clan realms, the yeti of the Yeti Lands, the ice giants of Titanos, the maritime republic of Windwaith and the free towns of the coast. In the far north-west, beyond any court's knowledge, Eindil sleeps in the ice. In Mp'E, the frozen north, Horos keeps the Castle of Yeldenne.

This spec defines the mechanic that makes the Cold Lands their own world:

- **The Northern Accord and Isengard**: Isengard's defiance (`zin_cold_isengard_defiance`), the Accord's reach (`zin_cold_accord_reach`), and the three ways to settle the rivalry.
- **The tribes and the winter moots**: each clan realm's lean between Fandanar and Isengard (`zin_cold_lean`).
- **The Long Winters**: a yearly winter that hurts everyone and lets a crown buy loyalty with grain.
- **The Yeti Lands and Titanos**: the old pacts with peoples who answer to no crown.
- **The far north-west**: the region where Eindil wakes, and the hooks the Cold Lands give his journey, without showing anything at the start.
- **Mp'E and the silent castle**: how the Cold Lands touch the Castle of Yeldenne without taking over its own system.
- **The western ports and the Neck Road**: the Cold Lands' trade with the West Lands and their part in the Western Crossing.
- **The Cold Lands in the War of the Last Crowns**: what Coldor may do when the south burns.

The focus tree [../05_focus_trees/major/coldor.md](../05_focus_trees/major/coldor.md) drives most of it. Isengard, Horidor, Windwaith, Fearno, Titanos, the Yeti Lands and Yeldenne act through events here and through their regional trees; the clans through the shared Cold Lands tree. Yeldenne, Horos and Glo belong to [Yeldenne and Glo](yeldenne_and_glo.md); Eindil to [Eindil's journey](eindil_journey.md).

## Lore basis

| Fact | Status | Source |
| --- | --- | --- |
| The Cold Lands lie in the north-west, reach off the west and north edges of the map, and are the largest landmass | established | *Erdae and Its Regions* |
| Coldor, Isengard, Horidor, the Yeti Lands and the Windwaith arm are in the Cold Lands | established | *Erdae and Its Regions* |
| Coldor is the northern great power of the frozen interior and the western ports; seat Fandanar; Northern Accord with Horidor; rival Isengard | established working table (constructed seat name) | *Great Powers and Relations* |
| Titanos ice giants and yeti are peoples of Erdae; their rank, mortality and origin are not settled | established (taxonomy open) | *Peoples of Erdae* |
| Eindil wakes in the Cold Lands without memory; local tribes find and nurse him; West Lands travellers take him south | established | *Eindil*, *Fourth Age Canon Register* |
| The far north-west, ancient ice, beyond most of Aenor's knowledge | established wording | *The Fourth Age of Erdae* §IV |
| Horos keeps the Castle of Yeldenne in the Cold Lands; Afrit's party and Eindil reach it in the late Fourth Age; Eindil goes on through snow after an ambush | established | *Castle of Yeldenne and Glo*, *The Journey of Eindil* |
| Aenoran voyages reached the Cold Lands in the First Age | established | history spec digest |
| Coldor's kings unite the frozen interior in 4A 850; Isengard refuses | proposed | *Fourth Age Chronology* |
| Eindil wakes early in 4A 1749 | proposed | *Fourth Age Chronology* |
| The tribes, the Yeti Lands, the giants of Titanos and the free towns live by trade, herding and hunting | proposed | *The Campaign of 4A 1748* |

**Proposed by this spec:** defiance, reach, lean, winters, pacts, the winter moots, the March Forts border war, the Neck Road, the white companies; all numbers, events and decisions. The vault says nothing about the Cold Lands in the War of the Last Crowns; every war route here is play, never history.

**Kept open:** the exact place of Eindil's ice and of the Castle of Yeldenne (vault open; the map step picks proposed states); who lives in the castle besides Horos; what yeti and giants are in the order of beings. Text never states them. Nothing visible at the start mentions a sleeper in the ice (the start-situation spec keeps such foreshadowing out until the owner allows it).

## Design

### The situation on 1 Thaw 4A 1748

Coldor and Horidor hold the Northern Accord. Isengard keeps its border forts manned and its warlord's pride. The clans herd, hunt and trade; the ports trade with the West Lands and Aenor. Opinion `zin_opinion_cold_rivalry` (−30) stands between Coldor and Isengard both ways (the start spec's "Cold Rivalry"). Nobody is at war. No war goal, claim or border war is possible in 4A 1748.

### 1. The Northern Accord and Isengard

**Isengard's defiance** `zin_cold_isengard_defiance` (Isengard, 0–100, start 70): how far Isengard refuses the Winter Crown.

| Source | Change |
| --- | --- |
| Monthly while Coldor's reach ≥ 40 | −0.3 |
| Monthly while Coldor is at war outside the Cold Lands | +0.3 |
| Monthly while Isengard is fed by Coldor in a winter (spirit `zin_cold_bread_from_fandanar`) | −0.5 |
| Coldor's marriage offer accepted / refused | −15 / +5 |
| A Winter Charter offered (accepted or not) | −5 |
| The March Forts border war: Coldor wins / Isengard wins | −25 / +15 |
| Focus effects | see the Coldor tree |

| Defiance | Effect |
| --- | --- |
| ≤ 30 | Isengard may accept the Winter Charter (`zin_cold.30`) and join the Accord |
| 31–79 | the usual rivalry |
| ≥ 80 | Isengard courts its neighbours: every clan realm bordering Isengard loses 0.5 lean a month; after 1 Thaw 1751 Isengard's AI may start the March Forts border war itself (`zin_cold.31`, mean time 365 days) |

**The Accord's reach** `zin_cold_accord_reach` (Coldor, 0–100), recomputed monthly by `zin_cold_update_reach`:

- For each Cold Lands state (`zin_is_region_cold_lands`) not owned by Coldor and not Mp'E: weight 1 if controlled by a Northern Accord member, 1.5 if controlled by Coldor or a Coldor subject.
- Reach = min(100, 100 × total weight ÷ 150). At start Horidor's 15 states give about 10.

Dynamic modifier `zin_cold_reach_mod` on Coldor: `political_power_gain` = reach ÷ 400 (up to +0.25), `winter_attrition_factor` = −reach ÷ 500 (to −0.20).

| Reach | Unlocks |
| ---: | --- |
| 25 | Coldor's focus *The Frozen Crown* |
| 40 | Decision *Offer the Crown's Protection* (subjecthood) |
| 60 | Coldor's focus *One Banner of the Ice* |

**Three ways to settle Isengard** (Coldor's tree; route flags on Coldor):

| Way | Flag | Means | Ends with |
| --- | --- | --- | --- |
| **The Open Hand** | `zin_cold_open_hand` | Marriage, charter, bread in hard winters | Isengard swears to the Accord (`zin_cold_isengard_sworn`) |
| **The Iron Hand** (historical) | `zin_cold_iron_hand` | The March Forts border war, then pressure | Isengard swears, or stays defiant and humbled |
| **Isengard Must Kneel** | `zin_cold_conquest` | Full war for a puppet (only from the Iron Hand, late) | Isengard a Coldor subject |

**The March Forts** (`zin_cold_start_march_war`): a border war (`start_border_war`) between the Coldor and Isengard states with `zin_is_site_isengard_march`; `change_state_after_war = no`; minimum 45 days; combat width 80; 4 provinces a side. Needs `zin_cold_march_war_allowed`: after 1 Thaw 1751 and (`zin_gathering_dark` ≥ 15 or Isengard's defiance ≥ 80), or, under the historical rule, after 1 Thaw 1752. Win and loss go through `zin_cold_end_march_war`: defiance −25 or +15; winner war support +5 %; the loser stability −5 %; news `zin_cold.32`.

**Isengard swears** (`zin_cold_isengard_swears`): Isengard joins the Northern Accord faction (`add_to_faction`); flag `zin_cold_isengard_sworn`; `zin_opinion_cold_rivalry` removed both ways and `zin_cold_accord_kin` (+15) added; Isengard gets `zin_cold_sworn_to_the_accord` (proposed: Isengard keeps its warlord and its forts; the Accord is a league, not a crown). If Isengard is a player, it is asked (`zin_cold.30`); the AI accepts at defiance ≤ 30. On the Open Hand, `zin_cold.30` comes from Coldor's focus *A Charter for Isengard*. On the Iron Hand, `zin_cold_monthly` fires it once when the March Forts have been fought and defiance first falls to 30 or below (the charter offered at the sword's point).

**Isengard Must Kneel**: Coldor's war focus creates a `puppet_wargoal_focus` war goal on Isengard and declares war. Needs `zin_cold_iron_hand`, the March Forts fought, defiance > 30, and (`zin_gathering_dark` ≥ 30 or `zin_war_of_last_crowns`). Never on the historical path. A Coldor that annexes Isengard by war gets the Glo spec's `zin_glo_conqueror` through its own `on_annex` rule.

### 2. The tribes and the winter moots

`zin_cold_lean` (every Cold Lands country except Coldor, Isengard and Yeldenne; −100 Isengard … +100 Fandanar).

| Country | Start lean | Note |
| --- | ---: | --- |
| Horidor | 60 | Accord member |
| Holdon | 10 | Coast kingdom; trades with Coldor's ports |
| Wonderland | 5 | |
| Fearno | 0 | The largest free realm (25 states); proud |
| Windwaith | −5 | Maritime republic; rival of Coldor's ports |
| Yeti Lands, Titanos | 0 | The old peoples; see section 4 |
| Clan realms bordering Isengard (generated from adjacency) | −20 | |
| every other clan realm | 5 | |

**Sources:** Accord decisions (below), the winter (section 3), focuses, Isengard's counter-decisions, and the yearly moot.

**The Winter Moot** (proposed). On 1 Deepwinter each year the hidden event `zin_cold.20` settles the winter's debts: every clan realm fed by Coldor this winter (country flag `zin_cold_fed_by_fandanar`) gains +5 lean; every one fed by Isengard (`zin_cold_fed_by_isengard`) loses 5; the flags are cleared. Coldor and Isengard get the summary `zin_cold.21` *The Winter Moot*.

**Accord decisions** (category `zin_cold_accord`, Coldor; opened by the tree's *Envoys to the Steadings*; targets: Cold Lands countries with `zin_cold_lean`, not at war with Coldor):

| Key | Requires | Cost | Effect | Cooldown |
| --- | --- | --- | --- | --- |
| `zin_cold_send_envoys` | — | 25 PP | lean +10 | 120 days per target |
| `zin_cold_feed_the_steadings` | winter is hard or bitter; 1 Mistfall to 1 Thaw | 50 PP (25 with `zin_cold_winter_stores`) | lean +15; target stability +3 %; flag `zin_cold_fed_by_fandanar` | once per target per winter |
| `zin_cold_invite_to_accord` | lean ≥ 50; target not in a faction; focus *Open the Accord* | 25 PP | `zin_cold.40` | 180 days per target |
| `zin_cold_offer_protection` | lean ≥ 80; reach ≥ 40 | 100 PP | `zin_cold.41` | 365 days per target |
| `zin_cold_bread_for_isengard` | winter hard or bitter; Coldor on the Open Hand | 75 PP | Isengard gets `zin_cold_bread_from_fandanar` (90 days) | once per winter |

**Isengard's counter** (category `zin_cold_isengard`, Isengard only): `zin_cold_winter_gifts` (25 PP, target lean −10, 120 days per target) and `zin_cold_isengard_feeds` (in a hard or bitter winter, 50 PP, lean −15, flag `zin_cold_fed_by_isengard`). The AI uses them on its neighbours.

`zin_cold.40` *An Invitation from Fandanar*: join the Accord (AI chance = lean) or decline (lean −10). `zin_cold.41` *The Crown's Protection*: accept (Coldor `puppet`s the target; AI chance = lean − 40, ×2 if the target is at war) or refuse (lean −20).

### 3. The Long Winters

`zin_cold_winter` (global, 0 mild, 1 hard, 2 bitter) is set each year on 1 Mistfall by the hidden `zin_cold.10` (weights 40 / 40 / 20) and announced by `zin_cold.11` to every Cold Lands country. Under `zin_rule_historical_path` the winters follow a fixed list so test runs repeat: 1748 hard, 1749 mild, 1750 hard, 1751 bitter, 1752 hard, 1753 mild, 1754 hard, 1755 bitter, 1756 hard, 1757 mild, 1758 hard, 1759 mild (proposed).

From 1 Mistfall to 1 Thaw every Cold Lands country carries dynamic modifier `zin_cold_winter_mod`:

| Winter | `winter_attrition_factor` | `stability_factor` | `monthly_population` |
| --- | ---: | ---: | ---: |
| Mild | 0 | 0 | 0 |
| Hard | +0.10 | −0.02 | −0.05 |
| Bitter | +0.25 | −0.05 | −0.10 |

A country with `zin_cold_winter_stores` (Coldor's focus, or a regional tree's equivalent) takes half. These stack with the economy spec's permanent `zin_econ_cold_lands` ("The Long Winters").

**Raiders from the Snow.** In a bitter winter, `zin_cold.12` fires to Coldor and to Isengard (mean time 60 days): a hungry clan raids the steadings. Options: pay them off (−25 PP); punish them (army experience +5; that clan's lean −10 toward the punisher); feed them (−25 PP; lean +10 toward the feeder; sets the fed flag).

### 4. The Yeti Lands and Titanos

The yeti and the ice giants are old peoples who answer to no crown. Their nature and rank are open in the vault, and the text never calls them Great Folk or Common Folk.

Coldor holds two pact levels, `zin_cold_yeti_pact` and `zin_cold_giant_pact` (0–3). Level 1 needs the people's own answer to Coldor's envoys (`zin_cold.51` for the Yeti Lands, `zin_cold.52` for Titanos); levels 2 and 3 come from Coldor's focuses once level 1 stands:

| Level | Name (proposed) | Effect |
| ---: | --- | --- |
| 1 | The Hunting Truce / The Giants' Toll | Non-aggression pact between Coldor and that people's realm; lean +10 |
| 2 | Trackers in the Snow / Giants on the Passes | Coldor's tree spirits unlock (*Yeti Trackers*, *Giant Levies*) |
| 3 | Hearth and Height | That realm joins any defensive war in which an outsider invades a Cold Lands state of Coldor (`zin_cold.50`, AI accepts); it does not join a faction and stays independent |

The answering event lets the people accept (level 1; AI chance 60 + lean ÷ 2) or refuse (level stays 0; lean −5). A refused offer can be repeated after 180 days through decision `zin_cold_renew_old_pact`.

### 5. The far north-west

The far north-west is a list of Cold Lands states, `zin_is_region_far_northwest` (generated by the map step: the states west and north of a line drawn by the owner or, if none, the 12 Cold Lands states farthest from Fandanar on the north-west edge; proposed). It contains `zin_is_site_eindil_ice` (key sites; a remote state, not a capital).

At the start it is only a cold edge of the map. Its states carry state modifier `zin_cold_far_ice` (`local_supplies` −0.30, `attrition` 0.10; proposed). Nothing in its names, modifiers or events hints at a sleeper.

**Charting the far ice.** Coldor's focus *Beyond the Last Steading* sets `zin_cold_far_ice_charted`: −50 % on `zin_cold_far_ice` for Coldor's armies (through a country modifier on Coldor, not the state), lean +5 on every clan realm with a far north-west state.

**When Eindil wakes** (`zin_eindil_awake`, journey stage 1), the Cold Lands give the journey three hooks. The journey stays the owner of every stage event.

| Hook | Who | What |
| --- | --- | --- |
| The ice host's lean | the owner of `zin_is_site_eindil_ice` | When it nurses him (journey event 10, "Nurse the stranger"), Coldor's tree may later send provisions (*Provisions for the Stranger*): Coldor regard +10, the host lean +10 toward Fandanar |
| The wardens' option | Coldor | With `zin_cold_far_ice_charted`, journey event 11 *Talk of a Man from the Ice* gains a fourth option for Coldor: **Send the wardens to watch over him**: regard +10, renown +2, no delay. Historical AI: "Ignore northern tales" (journey) |
| The Neck Road | Coldor and Gunwaith | If `zin_cold_neck_road` is set when the journey's *The Traders' Road South* fires, its "Give him provisions" option also adds lean +5 toward Fandanar for the host (the traders carry Coldor's goods) |

Coldor's tree branch about these hooks is hidden (`allow_branch` on `zin_eindil_awake`).

### 6. Mp'E and the silent castle

Yeldenne is one state, Mp'E, ruled by Horos ([Yeldenne and Glo](yeldenne_and_glo.md)). This spec only sets how the Cold Lands around it behave.

- **The approach.** `zin_is_region_mpe_approach` (states adjacent to Mp'E) and `zin_is_site_yeldenne_landing` (the coastal state nearest Mp'E; the journey spec asks for this row) are generated sites.
- **Respecting the hall.** Coldor's focus *Leave the Hall in Peace* sets `zin_cold_hall_respected`: non-aggression pact with Yeldenne; opinion +20 both ways. **Proposed hook for the Glo spec:** a Dominion petitioner with `zin_cold_hall_respected` is refused as a friend, not rebuked.
- **Guides.** Coldor's focus *Guides of the Snow* sets `zin_cold_guides_north`. **Proposed hook for the journey spec:** it counts as one more guide flag in the ambush formula when Coldor owns `zin_is_site_yeldenne_landing` or leads the faction or is the overlord of its owner. The historical ambush strength (5) stays ≥ 4 with one more guide, so the canonical "none survive" still holds.
- **Watch fires.** Coldor's focus *Watch-Fires of the North* sets `zin_cold_watch_fires`. While the Glo spec's internal flag `zin_glo_afrit_waiting` is set, Coldor gets `zin_cold.60` *Strangers in the Snow* once: a party of temple pilgrims with too many swords, camped on the northern coast. **Warn the castle** (sets the Glo spec's `zin_yeldenne_forewarned`; Coldor opinion of Aenor's crown −10) or **Keep out of it** (historical; AI always under the historical rule). The text never names the party's master.
- **A guard outside the hall.** Coldor's focus *Stand Guard Outside the Hall* fires `zin_cold.61` to Yeldenne: accept (Coldor guarantees Yeldenne; `zin_yeldenne_add_wards` +5; Coldor gets `zin_cold_hall_guard`) or refuse. Horos's AI accepts if Coldor has `zin_cold_hall_respected` and has never petitioned for Glo; the guard never enters the hall.
- **After the hall.** When `zin_horos_dead` is set, Coldor's hidden branch *The Empty Hall* opens. If Glo is sealed (`zin_glo_sealed`), Coldor may keep a watch on the hall (guarantee the Warden of Mp'E; wards cannot change after Horos's death in the Glo spec, so this is only a guarantee and opinion). Coldor can never take Glo: it is not a worthy-claimant system here, and the Glo spec's rules apply unchanged.

### 7. The western ports and the Neck Road

**The Neck Road** (proposed name) is the land road over the broad neck between the Cold Lands and the West Lands (`zin_is_site_neck_road` states). Gunwaith's focus *The Neck Road* fires `zin_cold.70` to Coldor: **Open the road** (global flag `zin_cold_neck_road`; Coldor and Gunwaith get `zin_cold_neck_road_trade` for 730 days; AI yes) or **Keep it closed** (Gunwaith opinion −10).

**Timber for the West.** Coldor's focus *Timber for the West* sets `zin_cold_timber_market` and opens decision `zin_cold_sell_timber_west` (Coldor; needs the West's Ford Council sitting or a western route chosen, [western crossing](western_crossing.md); 180-day cooldown): Coldor +40 PP; `zin_west_add_fleet` 5. On the historical path Coldor sells twice, in 4A 1753 and 4A 1754 (proposed).

**Windwaith.** The maritime republic competes with Coldor's ports. Coldor's focus *The Windwaith Question* fires `zin_cold.71` to Windwaith: **A Harbour Compact** (both get `zin_cold_harbour_compact`; Windwaith lean +20) or **Refuse Fandanar's terms** (lean −10). The AI accepts at lean ≥ 0.

### 8. The Cold Lands in the War of the Last Crowns

The vault says nothing about the Cold Lands in the final war. This spec offers three courses for Coldor through its tree (*The World Beyond the Ice*, opened by `zin_war_of_last_crowns` or `zin_western_crossing`). None is history.

| Course | Flag on Coldor | Means |
| --- | --- | --- |
| **The Cold Lands Stand Apart** (historical proposal) | `zin_cold_route_apart` | No foreign war; the Accord holds the Cold Lands; trade continues |
| **Timber and Ships for the West** | `zin_cold_route_crossing` | More timber sales; optionally *A Share of the Plunder*: global flag `zin_cold_joins_crossing`, Coldor joins the Western Crossing faction (joining rule in the western spec) and its war |
| **The White Companies** | `zin_cold_route_companies` | Coldor joins the Lost Cause and, after `zin_eindil_returned`, Eindil's coalition; `zin_cold_sail_white_companies` lands three divisions in a friendly Middle Lands port |

`zin_cold_sail_white_companies`: Coldor pays 30,000 manpower and 3,000 infantry equipment (placeholder type); three divisions of template `zin_cold_white_company` (warfare spec) are created in the coastal state controlled by the Host of Eindil (or the Aenor realm in the coalition) nearest the West; Coldor joins the coalition through `zin_eindil_join_coalition`; regard +15. Joining does not make Coldor a subject (established for the coalition).

If the map gives any Cold Lands country a coast on the Ocean of Zol, it is on the Zol spec's rumour list; this spec adds nothing for Zol.

### 9. The historical path

| Date (proposed) | Event |
| --- | --- |
| 1 Thaw 4A 1748 | Peace. Defiance 70; reach about 10; Horidor in the Accord. The winter of 1748 is hard. |
| Ironfrost 4A 1749 | Eindil wakes in the far north-west (journey). The ice host nurses him. Coldor and Isengard hear talk of a man from the ice and ignore it. |
| Emberleaf 4A 1749 | Western traders take him south over the neck (journey stage 2). Gunwaith and Coldor open the Neck Road about this time. |
| 4A 1749–1751 | The Accord courts the clans; Coldor feeds the steadings in the hard winter of 1750 and the bitter winter of 1751. |
| 4A 1752 | The March Forts: a border war with Isengard. Its result sets Isengard's defiance. |
| 4A 1753 | Eindil lands near Mp'E; the ambush; the hall (journey, Glo spec). Coldor stays out. Coldor sells timber to the West. |
| 4A 1754 | A second timber sale; the old pacts with the yeti and the giants reach level 2. |
| 4A 1755 | The War of the Last Crowns: the Cold Lands stand apart. |
| 4A 1756–1760 | Isengard swears if its defiance has fallen to 30; otherwise the rivalry goes on. At the coronation, Coldor's *The North Remembers*. |

### Peace gates

| Action | Earliest |
| --- | --- |
| The March Forts border war | after 1 Thaw 1751 and (`zin_gathering_dark` ≥ 15 or defiance ≥ 80) |
| Isengard Must Kneel (full war) | Iron Hand, March Forts fought, (`zin_gathering_dark` ≥ 30 or `zin_war_of_last_crowns`) |
| Protection offers (subjects) | reach ≥ 40 |
| A Share of the Plunder | `zin_western_crossing` |
| The White Companies sail | `zin_war_of_last_crowns` (Lost Cause), `zin_eindil_returned` (coalition) |

## Implementation

### Files

| Path | Content |
| --- | --- |
| `common/scripted_effects/zin_cold.txt` | Effects below |
| `common/scripted_triggers/zin_cold.txt` | Triggers below |
| `common/ideas/zin_cold.txt` | Mechanic spirits |
| `common/dynamic_modifiers/zin_cold.txt` | `zin_cold_reach_mod`, `zin_cold_winter_mod`, `zin_cold_far_ice` (state) |
| `common/opinion_modifiers/zin_cold.txt` | Opinion modifiers below |
| `common/decisions/categories/zin_cold.txt`, `common/decisions/zin_cold.txt` | Categories `zin_cold_accord`, `zin_cold_isengard`, `zin_cold_trade` |
| `events/zin_cold.txt` | Namespace `zin_cold` (mechanic-owned; may use `trigger` and `mean_time_to_happen`) |
| `common/on_actions/zin_cold.txt` | `on_startup` → `zin_cold.1`; monthly pulse on Coldor (or the largest Cold Lands country if Coldor is gone) → `zin_cold_monthly` |
| `common/game_rules/zin_cold.txt` | `zin_rule_cold_isengard` |
| `history/units/zin_cold.txt` | Template `zin_cold_white_company` for Coldor (warfare spec fills it) |
| `localisation/english/zin_cold_l_english.yml` | All text |

### Variables

| Variable | Scope | Range | Start | Meaning |
| --- | --- | --- | --- | --- |
| `zin_cold_isengard_defiance` | Isengard | 0–100 | 70 | Isengard's refusal of the Winter Crown |
| `zin_cold_accord_reach` | Coldor | 0–100 | computed | The Accord's hold on the Cold Lands |
| `zin_cold_lean` | Cold Lands countries (not Coldor, Isengard, Yeldenne) | −100–100 | table | Lean to Fandanar (+) or Isengard (−) |
| `zin_cold_winter` | global | 0–2 | rolled | This winter's severity |
| `zin_cold_yeti_pact`, `zin_cold_giant_pact` | Coldor | 0–3 | 0 | The old pacts |
| `zin_cold_reach_pp`, `zin_cold_reach_winter`, `zin_cold_winter_attr`, `zin_cold_winter_stab`, `zin_cold_winter_pop` | country | derived | — | Values for the dynamic modifiers |

### Flags

| Flag | Kind | Meaning |
| --- | --- | --- |
| `zin_cold_open_hand`, `zin_cold_iron_hand`, `zin_cold_conquest` | Coldor | Way chosen with Isengard |
| `zin_cold_march_war_fought` | Coldor | The March Forts border war has been fought |
| `zin_cold_isengard_sworn` | global | Isengard joined the Accord |
| `zin_cold_fed_by_fandanar`, `zin_cold_fed_by_isengard` | country, cleared each moot | Fed this winter |
| `zin_cold_winter_stores` | country | Halves the winter |
| `zin_cold_far_ice_charted` | Coldor | The far north-west charted |
| `zin_cold_hall_respected`, `zin_cold_guides_north`, `zin_cold_watch_fires` | Coldor | Mp'E hooks |
| `zin_cold_neck_road` | global | The Neck Road is open |
| `zin_cold_timber_market` | Coldor | Timber sales open |
| `zin_cold_route_apart`, `zin_cold_route_crossing`, `zin_cold_route_companies` | Coldor | Course in the final war |
| `zin_cold_joins_crossing` | global | Coldor joined the Western Crossing |

### Scripted triggers

| Trigger | Scope | True when |
| --- | --- | --- |
| `zin_cold_is_cold` | country | `has_country_flag = zin_region_cold_lands` |
| `zin_cold_is_clan_realm` | country | Cold Lands, has `zin_cold_lean`, not Coldor, Isengard or Yeldenne |
| `zin_cold_march_war_allowed` | any | section 1 |
| `zin_cold_isengard_may_swear` | any | Isengard exists, defiance ≤ 30, not at war with Coldor |
| `zin_cold_isengard_settled` | any | `zin_cold_isengard_sworn` is set, or Isengard is a subject of Coldor (`is_subject_of`), or Isengard no longer exists and Coldor owns its former capital; read by Coldor's *The Cold Lands at Peace* |
| `zin_cold_winter_is_hard` | any | `zin_cold_winter` ≥ 1 and the date is between 1 Mistfall and 1 Thaw |
| `zin_cold_historical` | any | `zin_rule_cold_isengard` = historical or `zin_rule_historical_path` |
| `zin_is_region_cold_lands`, `zin_is_region_far_northwest`, `zin_is_region_mpe_approach`, `zin_is_site_isengard_march`, `zin_is_site_neck_road`, `zin_is_site_fandanar`, `zin_is_site_eindil_ice`, `zin_is_site_yeldenne_landing` | state | generated site tests |

### Scripted effects

| Effect | Scope | Does |
| --- | --- | --- |
| `zin_cold_add_lean` (`value`) | target country | Adds, clamps |
| `zin_cold_add_lean_all` (`value`) | any | Every clan realm |
| `zin_cold_add_defiance` (`value`) | any | Isengard's defiance, clamps; checks the swear threshold |
| `zin_cold_update_reach` | Coldor | Section 1 |
| `zin_cold_start_march_war` | Coldor or Isengard | The border war |
| `zin_cold_end_march_war` (`winner`) | any | Section 1 |
| `zin_cold_isengard_swears` | any | Section 1 |
| `zin_cold_add_yeti_pact`, `zin_cold_add_giant_pact` (`value`) | Coldor | Raise a pact level and apply its effect |
| `zin_cold_roll_winter` | any | Sets `zin_cold_winter` (fixed list under the historical rule) and refreshes `zin_cold_winter_mod` |
| `zin_cold_feed` (`target`) | Coldor or Isengard | Lean, stability, fed flag |
| `zin_cold_open_neck_road` | any | Sets `zin_cold_neck_road`, trade spirits |
| `zin_cold_sell_timber` | Coldor | +40 PP; `zin_west_add_fleet` 5 |
| `zin_cold_sail_white_companies` | Coldor | Section 8 |
| `zin_cold_chart_far_ice` | Coldor | Sets `zin_cold_far_ice_charted`; lean +5 on every clan realm with a far north-west state |
| `zin_cold_reward_ice_host` (`value`) | Coldor | Lean +value toward Fandanar for the owner of `zin_is_site_eindil_ice` |
| `zin_cold_join_crossing` | Coldor | Sets `zin_cold_joins_crossing`; adds Coldor to the Western Crossing faction and to its war on the Aenor realm |
| `zin_cold_monthly` | Coldor | Drifts, reach, dynamic values, Isengard's counter checks |

Effects owned elsewhere and called here: `zin_west_add_fleet` ([western crossing](western_crossing.md)); `zin_eindil_add_regard`, `zin_eindil_add_renown`, `zin_eindil_join_coalition` ([journey](eindil_journey.md)); `zin_yeldenne_add_wards` ([Yeldenne and Glo](yeldenne_and_glo.md)); `zin_lost_cause_add_strength` ([diplomacy](../03_gameplay/03_diplomacy_and_factions.md)).

Engine effects used: `start_border_war`, `cancel_border_war`, `add_to_faction`, `create_wargoal`, `declare_war_on`, `add_to_war`, `create_unit`, `give_guarantee`, `diplomatic_relation`, `add_opinion_modifier`, `remove_opinion_modifier`, `add_dynamic_modifier`, `add_timed_idea`, `puppet`. Triggers: `is_neighbor_of`, `has_border_war_between`, `is_in_faction_with`, `controls_state`.

### Spirits (mechanic)

| Key | Name | Modifiers | Added / removed |
| --- | --- | --- | --- |
| `zin_cold_bread_from_fandanar` | Bread from Fandanar | `stability_factor` 0.03 | Isengard, fed by Coldor; 90 days |
| `zin_cold_sworn_to_the_accord` | Sworn to the Accord | `stability_factor` 0.05, `army_core_defence_factor` 0.05 | Isengard swears |
| `zin_cold_neck_road_trade` | The Neck Road | `consumer_goods_factor` −0.02, `political_power_gain` 0.05 | Coldor and Gunwaith; 730 days |
| `zin_cold_harbour_compact` | The Harbour Compact | `consumer_goods_factor` −0.01, `naval_speed_factor` 0.05 | Coldor and Windwaith |
| `zin_cold_hall_guard` | A Guard Outside the Hall | `political_power_gain` −0.05, `army_core_defence_factor` 0.03 | Coldor; while the guarantee stands |

### Dynamic modifiers

| Key | Modifiers |
| --- | --- |
| `zin_cold_reach_mod` | `political_power_gain` = `zin_cold_reach_pp`; `winter_attrition_factor` = `zin_cold_reach_winter` |
| `zin_cold_winter_mod` | `winter_attrition_factor` = `zin_cold_winter_attr`; `stability_factor` = `zin_cold_winter_stab`; `monthly_population` = `zin_cold_winter_pop` |
| `zin_cold_far_ice` (state) | `local_supplies` −0.30; `attrition` 0.10 |

### Opinion modifiers

| Key | Value | Notes |
| --- | ---: | --- |
| `zin_opinion_cold_rivalry` | −30 | Coldor ↔ Isengard at start (the start spec's "Cold Rivalry"); removed when Isengard swears |
| `zin_cold_accord_kin` | +15 | Between Accord members; added on joining |
| `zin_cold_fed_us` | +15 | Fed country → feeder; decays 1 a month |
| `zin_cold_hall_friend` | +20 | Coldor ↔ Yeldenne with `zin_cold_hall_respected` |

### Decisions

Categories `zin_cold_accord` and `zin_cold_isengard` as in section 2. Category `zin_cold_trade` (Coldor): `zin_cold_sell_timber_west` (section 7), `zin_cold_renew_old_pact` (section 4, 50 PP, targets the Yeti Lands or Titanos after a refusal).

### Events (namespace `zin_cold`)

| Id | Title | For | Trigger | Options (AI) |
| --- | --- | --- | --- | --- |
| .1 | (hidden) Startup | Cold Lands countries | on_startup | Variables, leans, opinions, winter roll |
| .10 | (hidden) The Year Turns Cold | anchor | 1 Mistfall each year | `zin_cold_roll_winter` |
| .11 | The Winter Comes (mild / hard / bitter text) | Cold Lands countries | after .10 | OK |
| .12 | Raiders from the Snow | Coldor, Isengard | bitter winter, MTTH 60 days | Pay them off / Punish them / Feed them |
| .20 | (hidden) The Winter Moot | anchor | 1 Deepwinter | Lean settlement |
| .21 | The Winter Moot | Coldor, Isengard | after .20 | OK (summary tooltip) |
| .30 | The Winter Charter | Isengard | Coldor's focus *A Charter for Isengard* | Swear to the Accord (AI if defiance ≤ 30) / Refuse (defiance +5) |
| .31 | Isengard Rides to the Forts | Coldor | Isengard AI at defiance ≥ 80, after 1 Thaw 1751, MTTH 365 | Meet them at the forts (border war) |
| .32 | The March Forts | Cold Lands (news) | border war ends | OK |
| .33 | A Marriage Across the March | Isengard | Coldor's focus | Accept (defiance −15; opinion +20) / Refuse (defiance +5) — AI accepts at defiance ≤ 60 |
| .40 | An Invitation from Fandanar | target | decision | Join / Decline |
| .41 | The Crown's Protection | target | decision | Accept / Refuse |
| .50 | Hearth and Height | Yeti Lands or Titanos | pact level 3 and an invasion of Coldor | Answer the call (AI) / Stay in the snow |
| .51 | Envoys at the Hunting Grounds | Yeti Lands | Coldor's focus | Accept the pact / Refuse |
| .52 | Envoys at the Frost-King's Hall | Titanos | Coldor's focus | Accept the pact / Refuse |
| .60 | Strangers in the Snow | Coldor | `zin_cold_watch_fires` and `zin_glo_afrit_waiting` | Warn the castle / Keep out of it (hist) |
| .61 | A Crown Offers a Guard | Yeldenne | Coldor's focus | Accept / Refuse |
| .70 | The Neck Road | Coldor | Gunwaith's focus | Open the road (hist) / Keep it closed |
| .71 | The Windwaith Question | Windwaith | Coldor's focus | A Harbour Compact / Refuse |

### Game rules

`zin_rule_cold_isengard` (group "ZIN regions"): `historical` (default: Iron Hand, the March Forts in 1752, no full war), `open_hand`, `conquest`, `free`. `zin_rule_historical_path` forces `historical`.

### Defines

None.

### Map and site dependencies

New rows for the key sites table ([../01_map/02_key_sites.md](../01_map/02_key_sites.md)):

| Trigger | Needs (proposed) |
| --- | --- |
| `zin_is_site_isengard_march` | The Coldor and Isengard border states with Isengard's forts (start spec hook "Isengard's border forts"); level-3 forts on Isengard's side |
| `zin_is_site_neck_road` | The states across the broad neck between the Cold Lands and the West Lands |
| `zin_is_region_far_northwest` | The far north-west list (section 5); must include `zin_is_site_eindil_ice` |
| `zin_is_region_mpe_approach` | States adjacent to Mp'E |
| `zin_is_site_yeldenne_landing` | The coastal state nearest Mp'E (journey spec's request) |
| `zin_is_region_cold_lands` | State-scope region test |

## AI

- **Coldor** follows `zin_rule_cold_isengard`. On `free`: Open Hand weight = 100 − defiance; Iron Hand weight = defiance; conquest only after `zin_war_of_last_crowns` with a 2:1 division lead.
- **Accord decisions:** Coldor sends envoys to the three highest-lean clans first; feeds every clan with lean between −20 and 50 in hard and bitter winters while PP ≥ 100; invites at lean ≥ 60; never targets a country Isengard guarantees.
- **Isengard** uses its counter-decisions on its neighbours; starts the March Forts itself only at defiance ≥ 80 and never under the historical rule (the historical rule has Coldor start it in 1752).
- **Startup strategies:** Coldor `befriend` Horidor (50) and `antagonize` Isengard (20); Isengard `antagonize` Coldor (30); clans `befriend` the crown they lean to above 50.
- **The final war:** Coldor stands apart under the historical rule; on `free`, the White Companies weight = Coldor's Eindil regard + 25 if Coldor is in the Lost Cause.

## Acceptance

1. A new game on 1 Thaw 4A 1748: defiance 70; reach about 10; leans as tabled; Horidor in the Northern Accord; `zin_opinion_cold_rivalry` both ways; nobody in the Cold Lands at war; no claim or war goal exists.
2. No effect here starts a war or border war before its peace gate (scan of `start_border_war`, `create_wargoal`, `declare_war_on`).
3. No text, modifier or state name visible before `zin_eindil_awake` hints at a sleeper in the ice (compiler text check over `zin_cold` and the far north-west state names).
4. Under the historical rule the winter list is as given, and Coldor feeds at least three clans in the 1751 winter.
5. Historical run: the March Forts border war starts in 4A 1752; Coldor never declares a full war; Coldor sells timber twice by the end of 1754 and the western fleet rises by 10; Coldor takes *The Cold Lands Stand Apart* within 120 days of `zin_war_of_last_crowns`.
6. With `zin_rule_cold_isengard = open_hand`, Isengard swears to the Accord in at least one of three seeds by 1760.
7. Scenario: Coldor with `zin_cold_far_ice_charted` receives journey event 11 with the wardens' option; choosing it adds regard and no delay.
8. Scenario: Coldor with `zin_cold_watch_fires` while `zin_glo_afrit_waiting` is set receives `zin_cold.60`; "Keep out of it" changes nothing in the Glo system; "Warn the castle" sets `zin_yeldenne_forewarned`.
9. Every modifier key here exists in the game's modifier documentation; every engine effect and trigger named exists in the effect and trigger documentation.

## Dependencies on other specs

- [Eindil's journey](eindil_journey.md): event 11 gains Coldor's wardens' option (section 5); the ambush formula may count `zin_cold_guides_north` (section 6); *The Traders' Road South* reads `zin_cold_neck_road`.
- [Yeldenne and Glo](yeldenne_and_glo.md): `zin_cold.60` may set `zin_yeldenne_forewarned`; `zin_cold_hall_respected` turns a Dominion petition into a friendly refusal (proposed); `zin_glo_afrit_waiting` is read.
- [Western crossing](western_crossing.md): `zin_west_add_fleet`; the joining rule for `zin_cold_joins_crossing`; the Ford Council state.
- [Diplomacy](../03_gameplay/03_diplomacy_and_factions.md): Northern Accord faction (`zin_faction_northern_accord`); add `zin_opinion_cold_rivalry` to its start opinions.
- [Economy](../03_gameplay/02_economy.md): `zin_econ_cold_lands`; region flags `zin_region_<key>`.
- Warfare spec (not yet written): template `zin_cold_white_company`.
- Regional specs for Isengard, Horidor, Windwaith, Fearno, Titanos, the Yeti Lands and Yeldenne, and the shared Cold Lands tree: their answers to `zin_cold.30`, `.33`, `.40`, `.41`, `.51`, `.52`, `.71` and their own uses of lean and the winter.

## Open questions

1. **Coldor in the final war.** The vault is silent. This spec proposes that the Cold Lands stand apart and sell timber to the West. Should Coldor take part instead, and on which side?
2. **Isengard.** Is the rivalry meant to end in the Fourth Age, or stay open forever? The historical path leaves it to the dice of a border war.
3. **The far north-west.** Which states are the far north-west, and which clan realm owns Eindil's ice?
4. **Yeti and giants.** Should the Yeti Lands and Titanos be courted at all by a human crown, or keep wholly apart?
5. **A queen or a king in Fandanar?** The characters spec proposes Queen Vaestia; the tree uses "the Queen" in text.
6. **The Winter Moot.** Is a yearly moot of the clans a good fit for the Cold Lands' tribes, or should the tribes have no common gathering?
