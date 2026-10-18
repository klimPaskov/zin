# Yeldenne focus tree

**Status:** Draft. **Priority:** 6. **Phase:** 6 (tier B). The tree may be built early in Phase 4, because the Glo system reads its flags.

## Purpose

Yeldenne is Horos's realm: one frozen state, Mp'E, and the Castle of Yeldenne, where Horos keeps Glo in his breast. Its tree is small, but it touches the main story. A Yeldenne player:

- strengthens Glernaen's old protections (the wards) so the hall can hold against a claimant who comes too early;
- keeps the frozen north fed and at peace with its neighbours;
- judges claimants, watches the roads, and prepares for the worthy heir;
- after Horos's death, chooses what the wardens of Mp'E do: follow the bearer, keep the empty hall, or guard a sealed crystal.

The tree implements [04_mechanics/yeldenne_and_glo.md](../../04_mechanics/yeldenne_and_glo.md) and feeds [04_mechanics/eindil_journey.md](../../04_mechanics/eindil_journey.md).

| Item | Value |
| --- | --- |
| Tree id | `regional_yeldenne` (focus ids `zin_regional_yeldenne_<key>`) |
| Countries | Yeldenne |
| Tier | B |
| Focuses | 36 |
| Width | columns 1–17 (17 columns) |
| Events | namespace `zin_regional_yeldenne` |
| Spirits | prefix `zin_yeldenne_` |

## Lore basis

- **Established:** Horos is a Great Spirit and lord of Castle Yeldenne in the Cold Lands; Glo is his heart and holds part of Glernaen's power; he rejected every claimant who sought Glo for conquest; Afrit comes first and kills him; Eindil arrives, wounds Afrit and receives Glo and the blue sword; Horos turns to dust and the castle is left empty. Glernaen's protections weaken Afrit's artifacts inside the castle. The Lost Cause wants Glo protected; Afrit and Volgan want it.
- **Proposed (this tree and the Glo spec):** the wardens of Mp'E and their Warden; the tithe roads; envoys to Coldor and the Yeti Lands; the beacon and guides; the three branches after Horos; every number. Mp'E and the castle's exact place are open in the vault.
- **Kept open:** Horos's spirit after his body turns to dust; Glernaen's character and cult; what Glo is after the war.

## Design

### Branches

| Branch | Columns | Opens | Mechanic |
| --- | --- | --- | --- |
| Root | 8 | start | — |
| **A. The Watch** | 1–3 | after the root | raises `zin_yeldenne_wards` (+60 in total, +65 with the root); sets `zin_yeldenne_hall_unyielding` |
| **B. Mp'E and the Northern Folk** | 6–10 | after the root | economy, manpower, peace with Coldor and the Yeti Lands; the coast watch; the Lost Cause's northern watch |
| **C. The Claimants and the Heir** | 11–17 | after the root; later focuses need story flags (`zin_eindil_awake`, `zin_eindil_named`, `zin_horos_endures`) | judgment of claimants; `zin_yeldenne_forewarned`; renown and regard for Eindil; the beacon and guides that weaken the ambush |
| **D. After the Guardian** | 2–14 | `zin_horos_dead` | three mutually exclusive answers: D1 Follow the Bearer (needs `zin_glo_with_eindil`), D2 Keep the Empty Hall (always), D3 Guard the Sealed Crystal (needs `zin_glo_sealed`) |

The peaceful start holds: branches A to C are wards, herds, envoys and watching. No focus declares war. The only military focuses (D1) send help to the Host of Eindil after the war has begun.

### Layout

```
y0                              the_long_watch(8)
y1   wake_the_wards(2)          the_wardens_of_mpe(8)              the_judgment_seat(14)
y2  blue_sword(1) frozen_gate(3)   herds(7)  tithe_roads(9)      roll(13) eyes(15)  guardian_endures(17)
y3   glernaens_protections(2)  envoys(6) tribes(8) yeti(10)      signs(13) rumours(15)
y4   hall_of_pillars(2)            watchers(8)                     await_the_worthy(14)
y5   unyielding_hall(2)         petition(7)      beacon(11)
y6                                                       guides(13)
y7                              the_hall_falls_silent(8)
y8   ride_after_the_bearer(3)   keep_the_empty_hall(8)      seal_the_hall(13)
y9   ride_south(2) banners(4)   fortress(7) last_record(9)  deny_the_dark(13)
y10  the_swords_oath(3)                                     open_for_heir(12) second_bearer(14)
```

### Root

| Key | Name | Prerequisites | Exclusive with | x, y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `the_long_watch` | The Long Watch | — | — | 8, 0 | 35 | `political_power` 50; `call` `zin_yeldenne_add_wards` {value 5} | base 100 |

### A. The Watch

Purpose: Glernaen's old protections around the hall. Each focus adds to `zin_yeldenne_wards`, which sets the score when a claimant strikes before the heir comes ([Glo spec](../../04_mechanics/yeldenne_and_glo.md), "Score test"). Opens after the root. When Horos dies and Glo leaves the hall, the Glo system removes the wards spirits; if Glo is sealed they stay.

| Key | Name | Prerequisites | Exclusive with | x, y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `wake_the_wards` | Wake the Wards | the_long_watch | — | 2, 1 | 35 | `call` `zin_yeldenne_add_wards` {10}; `add_spirit` `zin_yeldenne_glernaens_wards` | base 50 |
| `the_blue_sword` | The Blue Sword's Drill | wake_the_wards | — | 1, 2 | 35 | `army_experience` 10; `research` {categories [land_doctrine], bonus 0.5, uses 1} | base 20 |
| `the_frozen_gate` | The Frozen Gate | wake_the_wards | — | 3, 2 | 35 | `building` {bunker, 2, capital}; `call` `zin_yeldenne_add_wards` {5} | base 30 |
| `glernaens_old_protections` | Glernaen's Old Protections | the_blue_sword **and** the_frozen_gate | — | 2, 3 | 70 | `swap_spirit` [`zin_yeldenne_glernaens_wards`, `zin_yeldenne_glernaens_wards_2`]; `call` `zin_yeldenne_add_wards` {15} | base 40 |
| `the_hall_of_pillars` | The Hall of Pillars | glernaens_old_protections | — | 2, 4 | 35 | `call` `zin_yeldenne_add_wards` {10}; `building` {bunker, 1, capital} | base 30 |
| `the_unyielding_hall` | The Unyielding Hall | the_hall_of_pillars | — | 2, 5 | 70 | `call` `zin_yeldenne_add_wards` {15}; `global_flag` `zin_yeldenne_hall_unyielding`; `tooltip` "Within these walls, borrowed power falters." | base 30 |

### B. Mp'E and the Northern Folk

Purpose: feed and staff the hall, and keep peace with the Cold Lands. Opens after the root. `envoys_to_fandanar` needs Coldor to exist; `the_yeti_compact` needs the Yeti Lands. `watchers_on_the_coast` sets the first of Yeldenne's three ambush flags.

| Key | Name | Prerequisites | Exclusive with | x, y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `the_wardens_of_mpe` | The Wardens of Mp'E | the_long_watch | — | 8, 1 | 35 | `add_spirit` `zin_yeldenne_wardens`; `manpower` 1000 | base 60 |
| `herds_of_the_frozen_north` | Herds of the Frozen North | the_wardens_of_mpe | — | 7, 2 | 35 | `stability` 0.05; `building` {infrastructure, 1, capital} | base 40 |
| `the_tithe_roads` | The Tithe Roads | the_wardens_of_mpe | — | 9, 2 | 35 | `political_power` 50; `event` `tithe_caravans` | base 40 |
| `envoys_to_fandanar` | Envoys to Fandanar | herds_of_the_frozen_north | — | 6, 3 | 35 | Avail: `exists` Coldor. `event_for` {Coldor, `fandanar_reply`} | base 30 |
| `the_tribes_of_the_ice` | The Tribes of the Ice | herds_of_the_frozen_north **or** the_tithe_roads | — | 8, 3 | 35 | `political_power` 25; `event` `tribes_of_the_ice`; `if` {`global_flag` `zin_eindil_awake`} then `call` `zin_eindil_add_renown` {3} | base 30 |
| `the_yeti_compact` | The Yeti Compact | the_tithe_roads | — | 10, 3 | 35 | Avail: `exists` Yeti Lands. `non_aggression` Yeti Lands; `stability` 0.03 | base 20 |
| `watchers_on_the_coast` | Watchers on the Coast | the_tribes_of_the_ice | — | 8, 4 | 35 | `global_flag` `zin_yeldenne_coast_watch` (ambush strength −1); `building` {infrastructure, 1, capital} | base 30 |
| `petition_the_lost_cause` | Petition the Lost Cause | envoys_to_fandanar **or** watchers_on_the_coast | — | 7, 5 | 35 | Avail: Horos alive; a Lost Cause leader exists (`check` `zin_lost_cause_exists`, Aenor spec). `call` `zin_glo_request_northern_watch` (fires `zin_glo.64` The Hall Asks for Guards to the Lost Cause leader, who may guard the hall as if it had taken the decision) | base 25; historical ×0 |

### C. The Claimants and the Heir

Purpose: Horos judges every claimant and waits for the worthy one. Opens after the root. Later focuses wait for story flags. The beacon and guides lower the ambush strength in [Eindil's journey](../../04_mechanics/eindil_journey.md) stage 7; the historical AI does not take them, so the crew dies as in the lore.

| Key | Name | Prerequisites | Exclusive with | x, y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `the_judgment_seat` | The Judgment Seat | the_long_watch | — | 14, 1 | 35 | `political_power` 50; `event` `petitioner_at_the_gate` | base 50 |
| `the_roll_of_the_rejected` | The Roll of the Rejected | the_judgment_seat | — | 13, 2 | 35 | `add_spirit` `zin_yeldenne_roll_of_the_rejected` | base 40 |
| `eyes_in_the_south` | Eyes in the South | the_judgment_seat | — | 15, 2 | 35 | `add_spirit` `zin_yeldenne_eyes_in_the_south` | base 40 |
| `the_guardian_endures` | The Guardian Endures | the_judgment_seat | — | 17, 2 | 35 | Avail: `global_flag` `zin_horos_endures`, not `zin_horos_dead`. `call` `zin_yeldenne_add_wards` {20}; `stability` 0.10 | base 100 when available |
| `signs_among_the_pilgrims` | Signs Among the Pilgrims | the_roll_of_the_rejected | — | 13, 3 | 35 | Avail: `after` 1751.1.1 or `global_flag` `zin_golden_king_dead`. `global_flag` `zin_yeldenne_forewarned`; `call` `zin_yeldenne_add_wards` {5}; `event` `pilgrims_on_the_road` | base 40 |
| `rumours_of_the_ice` | Rumours of the Ice | eyes_in_the_south | — | 15, 3 | 35 | Avail: `global_flag` `zin_eindil_awake`. `call` `zin_eindil_add_renown` {5}; `flag` `zin_yeldenne_heard_of_eindil` | base 50 |
| `await_the_worthy` | Await the Worthy | signs_among_the_pilgrims **and** rumours_of_the_ice | — | 14, 4 | 70 | Avail: `global_flag` `zin_eindil_named`. Bypass: `zin_horos_dead`. `global_flag` `zin_yeldenne_awaits_heir` (Horos's test in case B2 takes 30 days, not 60); `call` `zin_eindil_add_regard` {20} | base 60 |
| `light_the_shore_beacon` | Light the Shore Beacon | watchers_on_the_coast **and** rumours_of_the_ice | — | 11, 5 | 35 | Avail: `global_flag` `zin_eindil_named`. Bypass: `zin_horos_dead`. `global_flag` `zin_yeldenne_beacon` (ambush −1); `call` `zin_eindil_add_regard` {10} | dynamic base 30; historical ×0 |
| `send_guides_to_the_landing` | Send Guides to the Landing | await_the_worthy **and** light_the_shore_beacon | — | 13, 6 | 35 | Avail: `variable` `zin_eindil_stage` above 5 and below 8. Bypass: `zin_horos_dead`. `global_flag` `zin_yeldenne_guides` (ambush −1); `manpower` −500; `call` `zin_eindil_add_regard` {15} | dynamic base 40; historical ×0 |

### D. After the Guardian

Purpose: what the wardens do when Horos is gone. The root opens only when `zin_horos_dead` is set; it has no prerequisite so it can appear late. Its three children are mutually exclusive.

| Key | Name | Prerequisites | Exclusive with | x, y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `the_hall_falls_silent` | The Hall Falls Silent | — | — | 8, 7 | 35 | Avail: `global_flag` `zin_horos_dead`. `political_power` 50; `stability` 0.05; `event` `hall_falls_silent` | base 100 |

**D1. Follow the Bearer** (needs `zin_glo_with_eindil`). The wardens ride after the heir and join his coalition.

| Key | Name | Prerequisites | Exclusive with | x, y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `ride_after_the_bearer` | Ride After the Bearer | the_hall_falls_silent | keep_the_empty_hall, seal_the_hall | 3, 8 | 35 | Avail: `global_flag` `zin_glo_with_eindil`. `call` `zin_eindil_add_regard` {25}; `flag` `zin_yeldenne_follows_bearer` | dynamic base 40; historical ×0 |
| `the_wardens_ride_south` | The Wardens Ride South | ride_after_the_bearer | — | 2, 9 | 70 | Avail: Eindil has a host (`raw` check of `global.zin_eindil_host`). `call` `zin_eindil_aid_host` {manpower 1500, equipment infantry_equipment 300} | base 50 |
| `banners_of_mpe` | Banners of Mp'E | ride_after_the_bearer | — | 4, 9 | 35 | `army_experience` 15; `add_spirit` `zin_yeldenne_wardens_host` | base 40 |
| `the_swords_oath` | The Sword's Oath | the_wardens_ride_south **and** banners_of_mpe | — | 3, 10 | 35 | Avail: `global_flag` `zin_eindil_returned`. `call` `zin_eindil_join_coalition`; `war_support` 0.10 | base 80 |

**D2. Keep the Empty Hall** (always available). The castle is left empty, as in the lore; the wardens guard its gates and its records.

| Key | Name | Prerequisites | Exclusive with | x, y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `keep_the_empty_hall` | Keep the Empty Hall | the_hall_falls_silent | ride_after_the_bearer, seal_the_hall | 8, 8 | 35 | `call` `zin_yeldenne_add_wards` {10}; `stability` 0.05 | historical base 100; dynamic 40 |
| `the_frozen_fortress` | The Frozen Fortress | keep_the_empty_hall | — | 7, 9 | 70 | `building` {bunker, 2, capital}; `add_spirit` `zin_yeldenne_frozen_fortress` | base 40 |
| `the_last_record` | The Last Record | keep_the_empty_hall | — | 9, 9 | 35 | Avail: `variable` `zin_eindil_stage` above 7. `event` `the_last_record` (Horos's roll of the line of Aen goes to Eindil's host); `call` `zin_eindil_add_renown` {10}; `call` `zin_eindil_add_regard` {15} | base 60 |

**D3. Guard the Sealed Crystal** (needs `zin_glo_sealed`). Horos died before the heir came, and bound Glo to the hall. The wardens keep it from the dark.

| Key | Name | Prerequisites | Exclusive with | x, y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `seal_the_hall` | Seal the Hall | the_hall_falls_silent | ride_after_the_bearer, keep_the_empty_hall | 13, 8 | 35 | Avail: `global_flag` `zin_glo_sealed`. `call` `zin_yeldenne_add_wards` {20}; `add_spirit` `zin_yeldenne_seal_keepers` | base 100 when available |
| `deny_the_dark` | Deny the Dark | seal_the_hall | — | 13, 9 | 70 | `global_flag` `zin_yeldenne_seal_warded` (defilement of the seal takes 545 days instead of 365) | base 60 |
| `open_for_the_heir` | Open for the Heir | deny_the_dark | seek_a_second_bearer | 12, 10 | 35 | Avail: not `zin_eindil_lost`; `variable` `zin_glo_state` equals 2. `global_flag` `zin_yeldenne_calls_heir` (the seal opens the day he arrives, and renown +10); `call` `zin_eindil_add_regard` {20} | base 80 |
| `seek_a_second_bearer` | Seek a Second Bearer | deny_the_dark | open_for_the_heir | 14, 10 | 70 | Avail: `global_flag` `zin_eindil_lost`; `variable` `zin_glo_state` equals 2. `global_flag` `zin_yeldenne_calls_bearer` (worthy claimants take "Seek Glo as Its Bearer" without its political power cost); `event` `a_call_for_a_bearer` | base 50 |

### Spirits

Spirits owned by the Glo system (`zin_yeldenne_guardian_of_glo`, `zin_yeldenne_the_empty_throne`) are listed in the [Glo spec](../../04_mechanics/yeldenne_and_glo.md).

| Key | Name | Modifiers | Added / removed |
| --- | --- | --- | --- |
| `zin_yeldenne_glernaens_wards` | Glernaen's Wards | `army_defence_factor` +0.10, `army_org_factor` +0.10 | `wake_the_wards`; replaced by the next; removed when Glo leaves the hall unsealed |
| `zin_yeldenne_glernaens_wards_2` | Glernaen's Old Protections | `army_defence_factor` +0.20, `army_org_factor` +0.15, `max_dig_in` +2 | `glernaens_old_protections`; removed as above |
| `zin_yeldenne_wardens` | The Wardens of Mp'E | `acclimatization_cold_climate_gain_factor` +0.25, `winter_attrition_factor` −0.25, `army_core_defence_factor` +0.10 | `the_wardens_of_mpe`; permanent |
| `zin_yeldenne_roll_of_the_rejected` | The Roll of the Rejected | `drift_defence_factor` +0.20, `political_power_gain` +0.10 | `the_roll_of_the_rejected`; permanent |
| `zin_yeldenne_eyes_in_the_south` | Eyes in the South | `civilian_intel_factor` +0.10, `intel_network_gain_factor` +0.25 | `eyes_in_the_south`; permanent |
| `zin_yeldenne_wardens_host` | Banners of Mp'E | `army_morale_factor` +0.10, `army_org_factor` +0.05, `experience_gain_army_factor` +0.10 | `banners_of_mpe`; permanent |
| `zin_yeldenne_frozen_fortress` | The Frozen Fortress | `army_core_defence_factor` +0.20, `drift_defence_factor` +0.30 | `the_frozen_fortress`; permanent |
| `zin_yeldenne_seal_keepers` | Keepers of the Seal | `army_core_defence_factor` +0.30, `stability_factor` +0.05 | `seal_the_hall`; removed if Glo leaves the hall or dims |

### Events (namespace `zin_regional_yeldenne`)

| Key | Title | To | Trigger | Options |
| --- | --- | --- | --- | --- |
| `tithe_caravans` | Caravans of the Tithe Road | Yeldenne | `the_tithe_roads` | **Take a light tithe**: `stability` 0.03. **Take the full tithe**: `political_power` 50 |
| `fandanar_reply` | Envoys from the Hall | Coldor | `envoys_to_fandanar` | **Swear peace with the hall** (AI 80): `non_aggression` Yeldenne; Yeldenne `political_power` 25. **Ask for a share of its secrets**: Horos refuses; −10 opinion both ways. **Ignore them**: nothing |
| `tribes_of_the_ice` | Fires on the Ice | Yeldenne | `the_tribes_of_the_ice` | One option. Text before `zin_eindil_awake`: the tribes trade furs for salt and news. After it: they tell of the Man from the Ice who walked out of the old ice |
| `petitioner_at_the_gate` | A Petitioner at the Gate | Yeldenne | `the_judgment_seat` | A crown's envoy asks for Glo. **Send them away courteously**: +10 opinion with a random Light crown. **Send them away with a warning**: `political_power` 25 |
| `pilgrims_on_the_road` | Pilgrims on the Northern Road | Yeldenne | `signs_among_the_pilgrims` | Pilgrims of the Deliverer ask the way north. **Let them pass and watch them** (AI): nothing more. **Turn them back at the gate**: −10 opinion with the Worshipdom. Text never names Afrit and never calls the Deliverer a demon |
| `hall_falls_silent` | The Hall Falls Silent | Yeldenne | `the_hall_falls_silent` | **Mourn the guardian**: `stability` 0.05. **Swear the wardens anew**: `war_support` 0.05. Text keeps Horos's spirit's fate open: "his body is dust" |
| `the_last_record` | The Roll of Yeldenne | Eindil's host | `the_last_record` | **Read it aloud in the camps**: `war_support` 0.05 |
| `a_call_for_a_bearer` | A Call for a Bearer | every country passing `zin_glo_worthy_claimant` | `seek_a_second_bearer` | **We will seek it**: AI 50 % if at war with Zol. **Not us**: nothing |

Other Yeldenne events (the hall, the petitions answered, Silence in the North) belong to the Glo system, namespace `zin_glo`.

## Implementation

- Data: `docs/design/focus/regional_yeldenne.json` with `"tier": "regional"`, `"countries": ["Yeldenne"]`.
- Compiled to `common/national_focus/zin_regional_yeldenne.txt`, `common/ideas/zin_focus_regional_yeldenne.txt`, `events/zin_regional_yeldenne.txt`, `localisation/english/zin_focus_regional_yeldenne_l_english.yml`.
- Calls: `zin_yeldenne_add_wards`, `zin_glo_request_northern_watch` ([Glo spec](../../04_mechanics/yeldenne_and_glo.md)); `zin_eindil_add_renown`, `zin_eindil_add_regard`, `zin_eindil_aid_host`, `zin_eindil_join_coalition` ([journey](../../04_mechanics/eindil_journey.md)). Check: `zin_lost_cause_exists` (Aenor spec, proposed name).
- Flags read by other systems: `zin_yeldenne_hall_unyielding`, `zin_yeldenne_forewarned`, `zin_yeldenne_awaits_heir`, `zin_yeldenne_coast_watch`, `zin_yeldenne_beacon`, `zin_yeldenne_guides`, `zin_yeldenne_seal_warded`, `zin_yeldenne_calls_heir`, `zin_yeldenne_calls_bearer`.
- One `raw` block (`the_wardens_ride_south` availability: `check_variable` on `global.zin_eindil_host` existing). A scripted trigger `zin_eindil_has_host` in the journey's trigger file would remove it; prefer that.
- Icons from the shared catalog: ward and rune icons, castle, frozen gate, herds, caravans, envoy, eye, scroll, beacon, banner, crystal. Missing icons fall back to the generic icon until the art phase; all icons image-generated.

## AI

### Historical route (4A 1748 to 1760)

| When | Focuses |
| --- | --- |
| 1748 | the_long_watch, the_wardens_of_mpe, wake_the_wards, the_judgment_seat, herds_of_the_frozen_north, the_tithe_roads |
| 1749 | the_blue_sword, the_frozen_gate, glernaens_old_protections, the_roll_of_the_rejected, eyes_in_the_south, envoys_to_fandanar |
| 1750 | the_tribes_of_the_ice, the_yeti_compact, the_hall_of_pillars, the_unyielding_hall, watchers_on_the_coast, rumours_of_the_ice |
| 1751–1752 | signs_among_the_pilgrims, await_the_worthy (after `zin_eindil_named`) |
| 1753 | Horos dies (case A). the_hall_falls_silent, keep_the_empty_hall |
| 1754 | the_last_record (Eindil in stage 8), the_frozen_fortress |
| 1755–1760 | idle; the tree is exhausted. Yeldenne stays neutral |

On this route the ambush strength stays at 4 (the coast watch only), so the crew dies as in the lore; case A of the hall is fixed regardless of the wards.

AI weights: the "historical ×0" notes apply when `zin_rule_historical_path` or `zin_rule_eindil_journey` HISTORICAL is on. Under the dynamic rule the AI uses the base values.

### Alternative routes

- **The hall holds.** A player rushes branch A and `signs_among_the_pilgrims`: wards 100 with both flags. If Afrit strikes before Eindil comes, Horos repels him; `the_guardian_endures` follows, and Horos still gives Glo to the heir when he arrives.
- **Speed the heir.** Branches B and C to the beacon and the guides: the ambush strength falls to 2, so a few of Eindil's companions survive (or the ambush fails if the Gala Elves and the landing owner also help).
- **Follow the bearer.** After case A, D1: the wardens send men and arms to the Host of Eindil and join the coalition once he returns.
- **Keepers of the seal.** If Horos was slain before the heir came, D3: guard the sealed crystal, slow any defilement, and open it to the heir; or, if the heir is lost, call a second bearer.

## Acceptance

1. The compiled tree has 36 focuses with unique positions; every focus sits below its prerequisites; the compiler and the HOI4 Agent Tools focus inspector pass.
2. The three D-branch roots are mutually exclusive, and `open_for_the_heir` and `seek_a_second_bearer` exclude each other.
3. The root and branch A raise `zin_yeldenne_wards` from 50 to 100 (50 + 65, clamped).
4. On a historical observer run the AI takes the historical route above, and the journey's ambush strength is 4 at stage 7.
5. No focus or event text names Afrit or calls the Deliverer a demon (compiler).
6. Every modifier in the spirits table exists in the game's modifier documentation.
7. The focus renderer produces a clean review image of the tree.

## Open questions

1. **The wardens.** Does the owner accept a human household of wardens in Mp'E, and a Warden who rules after Horos?
2. **Historical choice after Horos.** The spec keeps the hall empty (D2), following "the castle was left empty". Should the wardens instead follow Eindil (D1) on the historical path?
3. **Coldor and the Yeti Lands.** Are they Yeldenne's real neighbours on the final map? The envoy focuses assume so.
