# Yeldenne focus tree

**Status:** Ready. Reviewed 19 October 2026 against CONVENTIONS "Status"; integrated 19 October 2026. **Priority:** 6. **Phase:** 6 (tier B). The tree may be built early in Phase 4, because the Glo system reads its flags.

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
| Countries | Yeldenne (one state, Mp'E; capital victory point Castle of Yeldenne) |
| Tier | B |
| Focuses | 36 |
| Width | columns 1–17 (17 columns), rows 0–10 |
| Events | namespace `zin_regional_yeldenne` |
| Spirits | `zin_regional_yeldenne_<key>` (the compiler's tree prefix) |

## Lore basis

- **Established:** Horos is a Great Spirit and lord of Castle Yeldenne in the Cold Lands; Glo is his heart and holds part of Glernaen's power; he rejected every claimant who sought Glo for conquest; Afrit comes first and kills him; Eindil arrives, wounds Afrit and receives Glo and the blue sword; Horos turns to dust and the castle is left empty. Glernaen's protections weaken Afrit's artifacts inside the castle. The Lost Cause wants Glo protected; Afrit and Volgan want it.
- **Proposed (this tree and the Glo spec):** the wardens of Mp'E, a human household (Yeldenne's people is `men` today), and the Warden who rules after Horos (`zin_yeldenne_warden`, Glo spec); the tithe roads; envoys to Coldor and the Yeti Lands; the beacon and guides; the three branches after Horos; every number. Mp'E and the castle's exact place are open in the vault.
- **Kept open:** Horos's spirit after his body turns to dust; Glernaen's character and cult; what Glo is after the war. No text in this tree states any of them.

## Design

### Branches

| Branch | Columns | Opens | Mechanic |
| --- | --- | --- | --- |
| Root | 8 | start | — |
| **A. The Watch** | 1–3 | after the root | raises `zin_yeldenne_wards` by 55 (60 with the root); sets `zin_yeldenne_hall_unyielding` |
| **B. Mp'E and the Northern Folk** | 6–10 | after the root | economy, manpower, peace with Coldor and the Yeti Lands; the coast watch; the Lost Cause's northern watch |
| **C. The Claimants and the Heir** | 11–17 | after the root; later focuses need story flags (`zin_eindil_awake`, `zin_eindil_named`, `zin_horos_endures`) | judgment of claimants; `zin_yeldenne_forewarned`; renown and regard for Eindil; the beacon and guides that weaken the ambush |
| **D. After the Guardian** | 2–14 | `zin_horos_dead` | three mutually exclusive answers: D1 Follow the Bearer (needs `zin_glo_with_eindil`), D2 Keep the Empty Hall (always), D3 Guard the Sealed Crystal (needs `zin_glo_sealed`) |

The peaceful start holds: branches A to C are wards, herds, envoys and watching. No focus declares war, creates a war goal or claims a state. Yeldenne starts with no divisions (warfare spec); the only military focuses (D1) send men and arms to the Host of Eindil after the Host is raised.

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

### Notation

Effects use the compiler vocabulary of [../00_format_and_compiler.md](../00_format_and_compiler.md). "and" between prerequisites means both; "or" means either. "Avail:" is `available`; "Bypass:" is `bypass`. AI is `ai.base`; "historical ×0" is a modifier with factor 0 while `check zin_eindil_historical` holds (journey spec: the journey rule is HISTORICAL or `zin_rule_historical_path` is on). Icons are keys of the [icon catalog](../02_icon_catalog.md) (sprites `GFX_focus_zin_<key>`); each spirit uses the icon of the focus that adds it.

### Root

| Key | Name | Icon | Prerequisites | Exclusive with | x, y | Days | Effects | AI |
| --- | --- | --- | --- | --- | --- | ---: | --- | --- |
| `the_long_watch` | The Long Watch | `castle_ice` | — | — | 8, 0 | 35 | `political_power` 50; `call` `zin_yeldenne_add_wards` {value 5} | base 100 |

### A. The Watch

Purpose: Glernaen's old protections around the hall. Each focus adds to `zin_yeldenne_wards`, which sets the score when a claimant strikes before the heir comes ([Glo spec](../../04_mechanics/yeldenne_and_glo.md), "Score test"). Opens after the root. When Horos dies and Glo leaves the hall, the Glo system's `zin_yeldenne_install_warden` removes the wards spirits; if Glo is sealed they stay.

| Key | Name | Icon | Prerequisites | Exclusive with | x, y | Days | Effects | AI |
| --- | --- | --- | --- | --- | --- | ---: | --- | --- |
| `wake_the_wards` | Wake the Wards | `rune_stone` | the_long_watch | — | 2, 1 | 35 | `call` `zin_yeldenne_add_wards` {value 10}; `add_spirit` `glernaens_wards` | base 50 |
| `the_blue_sword` | The Blue Sword's Drill | `lone_sword` | wake_the_wards | — | 1, 2 | 35 | `army_experience` 10; `research` {categories [zin_cat_arms], bonus 0.5, uses 1} | base 20 |
| `the_frozen_gate` | The Frozen Gate | `frozen_gate` | wake_the_wards | — | 3, 2 | 35 | `building` {bunker, 2, capital}; `call` `zin_yeldenne_add_wards` {value 5} | base 30 |
| `glernaens_old_protections` | Glernaen's Old Protections | `ward_circle` | the_blue_sword **and** the_frozen_gate | — | 2, 3 | 70 | `swap_spirit` [`glernaens_wards`, `glernaens_wards_2`]; `call` `zin_yeldenne_add_wards` {value 15} | base 40 |
| `the_hall_of_pillars` | The Hall of Pillars | `castle_ice` | glernaens_old_protections | — | 2, 4 | 35 | `call` `zin_yeldenne_add_wards` {value 10}; `building` {bunker, 1, capital} | base 30 |
| `the_unyielding_hall` | The Unyielding Hall | `palace_wards` | the_hall_of_pillars | — | 2, 5 | 70 | `call` `zin_yeldenne_add_wards` {value 15}; `global_flag` `zin_yeldenne_hall_unyielding`; `tooltip` "Within these walls, borrowed power falters." | base 30 |

### B. Mp'E and the Northern Folk

Purpose: feed and staff the hall, and keep peace with the Cold Lands. Opens after the root. `envoys_to_fandanar` needs Coldor to exist; `the_yeti_compact` needs the Yeti Lands. Neither assumes a shared border. `watchers_on_the_coast` sets the first of Yeldenne's three ambush flags.

| Key | Name | Icon | Prerequisites | Exclusive with | x, y | Days | Effects | AI |
| --- | --- | --- | --- | --- | --- | ---: | --- | --- |
| `the_wardens_of_mpe` | The Wardens of Mp'E | `spear_levy` | the_long_watch | — | 8, 1 | 35 | `add_spirit` `wardens`; `manpower` 1000 | base 60 |
| `herds_of_the_frozen_north` | Herds of the Frozen North | `herds` | the_wardens_of_mpe | — | 7, 2 | 35 | `stability` 0.05; `building` {infrastructure, 1, capital} | base 40 |
| `the_tithe_roads` | The Tithe Roads | `caravan` | the_wardens_of_mpe | — | 9, 2 | 35 | `political_power` 50; `event` `tithe_caravans` | base 40 |
| `envoys_to_fandanar` | Envoys to Fandanar | `envoy` | herds_of_the_frozen_north | — | 6, 3 | 35 | Avail: `exists` Coldor. `event_for` {Coldor, `fandanar_reply`} | base 30 |
| `the_tribes_of_the_ice` | The Tribes of the Ice | `ice_field` | herds_of_the_frozen_north **or** the_tithe_roads | — | 8, 3 | 35 | `political_power` 25; `event` `tribes_of_the_ice`; `if` {`global_flag` `zin_eindil_awake`} then `call` `zin_eindil_add_renown` {value 3} | base 30 |
| `the_yeti_compact` | The Yeti Compact | `olive_branch` | the_tithe_roads | — | 10, 3 | 35 | Avail: `exists` Yeti Lands; not `at_war_with` Yeti Lands. `non_aggression` Yeti Lands; `stability` 0.03 | base 20 |
| `watchers_on_the_coast` | Watchers on the Coast | `lighthouse` | the_tribes_of_the_ice | — | 8, 4 | 35 | `global_flag` `zin_yeldenne_coast_watch` (ambush strength −1); `building` {infrastructure, 1, capital} | base 30 |
| `petition_the_lost_cause` | Petition the Lost Cause | `seal_wax` | envoys_to_fandanar **or** watchers_on_the_coast | — | 7, 5 | 35 | Avail: not `global_flag` `zin_horos_dead`; a country passes the Glo spec's trigger `zin_glo_lost_cause_leader` (before any Lost Cause faction exists that is the original Aenor realm, which holds the institution, S3). `call` `zin_glo_request_northern_watch` (fires `zin_glo.64` The Hall Asks for Guards to the Lost Cause leader, who may guard the hall as if it had taken the decision) | base 25; historical ×0 |

### C. The Claimants and the Heir

Purpose: Horos judges every claimant and waits for the worthy one. Opens after the root. Later focuses wait for story flags. The beacon and guides lower the ambush strength in [Eindil's journey](../../04_mechanics/eindil_journey.md) stage 7; the historical AI does not take them, so the crew dies as in the lore.

| Key | Name | Icon | Prerequisites | Exclusive with | x, y | Days | Effects | AI |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `the_judgment_seat` | The Judgment Seat | `seal_royal` | the_long_watch | — | 14, 1 | 35 | `political_power` 50; `event` `petitioner_at_the_gate` | base 50 |
| `the_roll_of_the_rejected` | The Roll of the Rejected | `book_lore` | the_judgment_seat | — | 13, 2 | 35 | `add_spirit` `roll_of_the_rejected` | base 40 |
| `eyes_in_the_south` | Eyes in the South | `scout_lantern` | the_judgment_seat | — | 15, 2 | 35 | `add_spirit` `eyes_in_the_south_spirit` | base 40 |
| `the_guardian_endures` | The Guardian Endures | `sceptre` | the_judgment_seat | — | 17, 2 | 35 | Avail: `global_flag` `zin_horos_endures`; not `global_flag` `zin_horos_dead`. `call` `zin_yeldenne_add_wards` {value 20}; `stability` 0.10 | base 100 |
| `signs_among_the_pilgrims` | Signs Among the Pilgrims | `courier_pilgrim` | the_roll_of_the_rejected | — | 13, 3 | 35 | Avail: `after` 1751.3.1 or `global_flag` `zin_golden_king_dead`. `global_flag` `zin_yeldenne_forewarned`; `call` `zin_yeldenne_add_wards` {value 5}; `event` `pilgrims_on_the_road` | base 40 |
| `rumours_of_the_ice` | Rumours of the Ice | `footprints_snow` | eyes_in_the_south | — | 15, 3 | 35 | Avail: `global_flag` `zin_eindil_awake`. `call` `zin_eindil_add_renown` {value 5}; `flag` `zin_regional_yeldenne_heard_rumours` | base 50 |
| `await_the_worthy` | Await the Worthy | `heir_rolls` | signs_among_the_pilgrims **and** rumours_of_the_ice | — | 14, 4 | 70 | Avail: `global_flag` `zin_eindil_named`. Bypass: `global_flag` `zin_horos_dead`. `global_flag` `zin_yeldenne_awaits_heir` (Horos's test in case B2 takes 30 days, not 60); `call` `zin_eindil_add_regard` {value 20} | base 60 |
| `light_the_shore_beacon` | Light the Shore Beacon | `beacon` | watchers_on_the_coast **and** rumours_of_the_ice | — | 11, 5 | 35 | Avail: `global_flag` `zin_eindil_named`. Bypass: `global_flag` `zin_horos_dead`. `global_flag` `zin_yeldenne_beacon` (ambush −1); `call` `zin_eindil_add_regard` {value 10} | base 30; historical ×0 |
| `send_guides_to_the_landing` | Send Guides to the Landing | `compass_rose` | await_the_worthy **and** light_the_shore_beacon | — | 13, 6 | 35 | Avail: `variable` `zin_eindil_stage` above 5 and below 8. Bypass: `global_flag` `zin_horos_dead`. `global_flag` `zin_yeldenne_guides` (ambush −1); `manpower` −500; `call` `zin_eindil_add_regard` {value 15} | base 40; historical ×0 |

### D. After the Guardian

Purpose: what the wardens do when Horos is gone. The root opens only when `zin_horos_dead` is set; it has no prerequisite so it can appear late. Its three children are mutually exclusive.

| Key | Name | Icon | Prerequisites | Exclusive with | x, y | Days | Effects | AI |
| --- | --- | --- | --- | --- | --- | ---: | --- | --- |
| `the_hall_falls_silent` | The Hall Falls Silent | `empty_throne` | — | — | 8, 7 | 35 | Avail: `global_flag` `zin_horos_dead`. `political_power` 50; `stability` 0.05; `event` `hall_falls_silent` | base 100 |

**D1. Follow the Bearer** (needs `zin_glo_with_eindil`). The wardens ride after the heir and join his coalition.

| Key | Name | Icon | Prerequisites | Exclusive with | x, y | Days | Effects | AI |
| --- | --- | --- | --- | --- | --- | ---: | --- | --- |
| `ride_after_the_bearer` | Ride After the Bearer | `horse_cavalry` | the_hall_falls_silent | keep_the_empty_hall, seal_the_hall | 3, 8 | 35 | Avail: `global_flag` `zin_glo_with_eindil`. `call` `zin_eindil_add_regard` {value 25}; `flag` `zin_regional_yeldenne_follows_bearer` | base 40; historical ×0 |
| `the_wardens_ride_south` | The Wardens Ride South | `levy_muster` | ride_after_the_bearer | — | 2, 9 | 70 | Avail: `variable` `zin_eindil_stage` above 8 (the Host of Eindil is raised in stage 9). `call` `zin_eindil_aid_host` {equipment 300, manpower 1500} | base 50 |
| `banners_of_mpe` | Banners of Mp'E | `banner_plain` | ride_after_the_bearer | — | 4, 9 | 35 | `army_experience` 15; `add_spirit` `wardens_host` | base 40 |
| `the_swords_oath` | The Sword's Oath | `handshake_oath` | the_wardens_ride_south **and** banners_of_mpe | — | 3, 10 | 35 | Avail: `global_flag` `zin_eindil_returned`. `call` `zin_eindil_join_coalition`; `war_support` 0.10 | base 80 |

**D2. Keep the Empty Hall** (always available). The castle is left empty, as in the lore; the wardens guard its gates and its records.

| Key | Name | Icon | Prerequisites | Exclusive with | x, y | Days | Effects | AI |
| --- | --- | --- | --- | --- | --- | ---: | --- | --- |
| `keep_the_empty_hall` | Keep the Empty Hall | `castle_ice` | the_hall_falls_silent | ride_after_the_bearer, seal_the_hall | 8, 8 | 35 | `call` `zin_yeldenne_add_wards` {value 10}; `stability` 0.05 | base 40; ×2.5 while `check` `zin_eindil_historical` |
| `the_frozen_fortress` | The Frozen Fortress | `fort_wall` | keep_the_empty_hall | — | 7, 9 | 70 | `building` {bunker, 2, capital}; `add_spirit` `frozen_fortress` | base 40 |
| `the_last_record` | The Last Record | `scroll_sealed` | keep_the_empty_hall | — | 9, 9 | 35 | Avail: `variable` `zin_eindil_stage` above 7. `call` `zin_regional_yeldenne_send_last_record` (fires `the_last_record` to Eindil's current host, `var:global.zin_eindil_host`; to the Gala Elves while he is at sea); `call` `zin_eindil_add_renown` {value 10}; `call` `zin_eindil_add_regard` {value 15} | base 60 |

**D3. Guard the Sealed Crystal** (needs `zin_glo_sealed`). Horos died before the heir came, and bound Glo to the hall. The wardens keep it from the dark.

| Key | Name | Icon | Prerequisites | Exclusive with | x, y | Days | Effects | AI |
| --- | --- | --- | --- | --- | --- | ---: | --- | --- |
| `seal_the_hall` | Seal the Hall | `crystal_green` | the_hall_falls_silent | ride_after_the_bearer, keep_the_empty_hall | 13, 8 | 35 | Avail: `global_flag` `zin_glo_sealed`. `call` `zin_yeldenne_add_wards` {value 20}; `add_spirit` `seal_keepers` | base 100 |
| `deny_the_dark` | Deny the Dark | `ward_circle` | seal_the_hall | — | 13, 9 | 70 | `global_flag` `zin_yeldenne_seal_warded` (defilement of the seal takes 545 days instead of 365) | base 60 |
| `open_for_the_heir` | Open for the Heir | `frozen_gate` | deny_the_dark | seek_a_second_bearer | 12, 10 | 35 | Avail: not `global_flag` `zin_eindil_lost`; `variable` `zin_glo_state` equals 2. `global_flag` `zin_yeldenne_calls_heir` (the seal opens the day he arrives, and renown +10); `call` `zin_eindil_add_regard` {value 20} | base 80 |
| `seek_a_second_bearer` | Seek a Second Bearer | `potent_blade` | deny_the_dark | open_for_the_heir | 14, 10 | 70 | Avail: `global_flag` `zin_eindil_lost`; `variable` `zin_glo_state` equals 2. `global_flag` `zin_yeldenne_calls_bearer` (worthy claimants take "Seek Glo as Its Bearer" without its political power cost); `call` `zin_regional_yeldenne_call_bearers` (fires `a_call_for_a_bearer`) | base 50 |

### Spirits

Spirits owned by the Glo system (`zin_yeldenne_guardian_of_glo`, `zin_yeldenne_the_empty_throne`) are listed in the [Glo spec](../../04_mechanics/yeldenne_and_glo.md). The tree's spirits compile to `zin_regional_yeldenne_<key>`; each uses the icon of the focus that adds it.

| Key | Name | Modifiers | Added / removed |
| --- | --- | --- | --- |
| `glernaens_wards` | Glernaen's Wards | `army_defence_factor` +0.10, `army_org_factor` +0.10 | `wake_the_wards`; replaced by the next; removed as `zin_regional_yeldenne_glernaens_wards` by the Glo spec's `zin_yeldenne_install_warden` unless Glo is sealed |
| `glernaens_wards_2` | Glernaen's Old Protections | `army_defence_factor` +0.20, `army_org_factor` +0.15, `max_dig_in` +2 | `glernaens_old_protections`; removed as above (`zin_regional_yeldenne_glernaens_wards_2`) |
| `wardens` | The Wardens of Mp'E | `acclimatization_cold_climate_gain_factor` +0.25, `winter_attrition_factor` −0.25, `army_core_defence_factor` +0.10 | `the_wardens_of_mpe`; permanent |
| `roll_of_the_rejected` | The Roll of the Rejected | `drift_defence_factor` +0.20, `political_power_gain` +0.10 | `the_roll_of_the_rejected`; permanent |
| `eyes_in_the_south_spirit` | Eyes in the South | `civilian_intel_factor` +0.10, `intel_network_gain_factor` +0.25 | `eyes_in_the_south`; permanent |
| `wardens_host` | Banners of Mp'E | `army_morale_factor` +0.10, `army_org_factor` +0.05, `experience_gain_army_factor` +0.10 | `banners_of_mpe`; permanent |
| `frozen_fortress` | The Frozen Fortress | `army_core_defence_factor` +0.20, `drift_defence_factor` +0.30 | `the_frozen_fortress`; permanent |
| `seal_keepers` | Keepers of the Seal | `army_core_defence_factor` +0.30, `stability_factor` +0.05 | `seal_the_hall`; removed as `zin_regional_yeldenne_seal_keepers` by the Glo spec's `zin_glo_clear_seal_keepers` when Glo leaves the hall (state 1 or 4) or dims (state 3) |

### Events (namespace `zin_regional_yeldenne`)

Every event is fired by an effect (no `trigger`, no mean time to happen).

| Key | Title | Picture | To | Fired by | Options |
| --- | --- | --- | --- | --- | --- |
| `tithe_caravans` | Caravans of the Tithe Road | `generic_wilds` | Yeldenne | `the_tithe_roads` | **Take a light tithe**: `stability` 0.03. **Take the full tithe**: `political_power` 50. AI 50/50 |
| `fandanar_reply` | Envoys from the Hall | `leren_envoys` | Coldor | `envoys_to_fandanar` | **Swear peace with the hall** (AI 80): `non_aggression` Yeldenne; Yeldenne `political_power` 25. **Ask for a share of its secrets** (AI 10): Horos refuses; opinion modifier `secrets_refused` (−10) both ways. **Ignore them** (AI 10): nothing |
| `tribes_of_the_ice` | Fires on the Ice | `black_ships_tale` | Yeldenne | `the_tribes_of_the_ice` | One option. Text before `zin_eindil_awake`: the tribes trade furs for salt and news. After it: they tell of the Man from the Ice who walked out of the old ice (D4: never a name) |
| `petitioner_at_the_gate` | A Petitioner at the Gate | `yeldenne_hall` | Yeldenne | `the_judgment_seat` | A crown's envoy asks for Glo. **Send them away courteously** (AI 60): `call` `zin_regional_yeldenne_courteous_word` (opinion modifier `courteous_refusal`, +10, from one random Light country other than Yeldenne). **Send them away with a warning** (AI 40): `political_power` 25 |
| `pilgrims_on_the_road` | Pilgrims on the Northern Road | `hermitage` | Yeldenne | `signs_among_the_pilgrims` | Pilgrims of the Deliverer ask the way north. **Let them pass and watch them** (AI 100): nothing more. **Turn them back at the gate** (AI 0): the Worshipdom gets opinion modifier `pilgrims_turned_back` (−10) toward Yeldenne. Text never names Afrit and never calls the Deliverer a demon |
| `hall_falls_silent` | The Hall Falls Silent | `generic_court` | Yeldenne | `the_hall_falls_silent` | **Mourn the guardian** (AI 60): `stability` 0.05. **Swear the wardens anew** (AI 40): `war_support` 0.05. Text keeps Horos's spirit's fate open: "his body is dust" |
| `the_last_record` | The Roll of Yeldenne | `generic_war` | Eindil's current host (see `the_last_record`) | `the_last_record` | **Read it aloud in the camps**: `war_support` 0.05. Fires only after `zin_eindil_named` (stage 8 or later), so the text may name him |
| `a_call_for_a_bearer` | A Call for a Bearer | `generic_court` | every country except Yeldenne that passes `zin_glo_worthy_claimant` | `seek_a_second_bearer` | **We will seek it** (AI 50, ×2 if at war with Zol): `political_power` 25; tooltip that "Seek Glo as Its Bearer" costs no political power. **Not us** (AI 50): nothing |

Other Yeldenne events (the hall, the petitions answered, Silence in the North) belong to the Glo system, namespace `zin_glo`.

### Opinion modifiers (tree-declared)

Compiled from the tree's `opinion_modifiers` block to `common/opinion_modifiers/zin_regional_yeldenne.txt` (the focus compiler's tree helper pattern in the contract additions register).

| Id | Value | Decay | Used by |
| --- | ---: | --- | --- |
| `zin_regional_yeldenne_secrets_refused` | −10 | 0.5 per month | `fandanar_reply`, option 2 (both ways) |
| `zin_regional_yeldenne_courteous_refusal` | +10 | 0.5 per month | `petitioner_at_the_gate`, option 1 |
| `zin_regional_yeldenne_pilgrims_turned_back` | −10 | 0.5 per month | `pilgrims_on_the_road`, option 2 |

## Implementation

| Item | Value |
| --- | --- |
| Builder module | `tools/content/modules/focus_compiler.mjs` ([compiler spec](../00_format_and_compiler.md)), run by `tools/content/build.mjs` and written in the same transaction as every other module through `tools/content/apply.mts` (the shared atomic rewrite engine) |
| Data | `docs/design/focus/regional_yeldenne.json` with `"id": "regional_yeldenne"`, `"tier": "regional"`, `"countries": ["Yeldenne"]`; the tree's `spirits`, `events`, `opinion_modifiers` and `scripted_effects` blocks hold the tables above |
| Compiled files | `common/national_focus/zin_regional_yeldenne.txt`, `common/ideas/zin_focus_regional_yeldenne.txt`, `events/zin_regional_yeldenne.txt`, `common/scripted_effects/zin_regional_yeldenne.txt`, `common/opinion_modifiers/zin_regional_yeldenne.txt`, `localisation/english/zin_focus_regional_yeldenne_l_english.yml` |
| Replaces | The interim Long Peace tree (`zin_long_peace_*`) for Yeldenne: the country history's `load_focus_tree` names `zin_regional_yeldenne` |
| Identifiers created | 36 focuses `zin_regional_yeldenne_<key>`; 8 spirits `zin_regional_yeldenne_<key>`; 8 events `zin_regional_yeldenne.1`–`.8` in the table order; 3 opinion modifiers; 3 scripted effects (below); country flags `zin_regional_yeldenne_heard_rumours`, `zin_regional_yeldenne_follows_bearer` |
| `raw` blocks | none |

**Tree-declared scripted effects** (`common/scripted_effects/zin_regional_yeldenne.txt`):

| Effect | Does |
| --- | --- |
| `zin_regional_yeldenne_send_last_record` | If `global.zin_eindil_host` is set, fires `zin_regional_yeldenne.7` to that country; else to the Gala Elves |
| `zin_regional_yeldenne_courteous_word` | `random_country` with `has_government = democratic`, not Yeldenne: `add_opinion_modifier` `zin_regional_yeldenne_courteous_refusal` toward Yeldenne |
| `zin_regional_yeldenne_call_bearers` | `every_country` except Yeldenne that passes `zin_glo_worthy_claimant`: `country_event` `zin_regional_yeldenne.8` |

**Names from other systems.**

| Name | Kind | Owner |
| --- | --- | --- |
| `zin_yeldenne_add_wards`, `zin_glo_request_northern_watch`, `zin_glo_worthy_claimant`, `zin_yeldenne_install_warden` | scripted effects and trigger | [Glo spec](../../04_mechanics/yeldenne_and_glo.md) |
| `zin_yeldenne_wards`, `zin_glo_state` | global variables | Glo spec |
| `zin_yeldenne_hall_unyielding`, `zin_yeldenne_forewarned`, `zin_yeldenne_awaits_heir`, `zin_yeldenne_coast_watch`, `zin_yeldenne_beacon`, `zin_yeldenne_guides`, `zin_yeldenne_seal_warded`, `zin_yeldenne_calls_heir`, `zin_yeldenne_calls_bearer`, `zin_horos_endures`, `zin_glo_sealed` | global flags this tree sets or reads | Glo spec |
| `zin_glo.64` | event | Glo spec |
| `zin_eindil_add_renown`, `zin_eindil_add_regard`, `zin_eindil_aid_host`, `zin_eindil_join_coalition`, `zin_eindil_historical`, `zin_eindil_stage`, `zin_eindil_host`, `zin_eindil_lost` | effects, trigger, variables, flag | [Eindil's journey](../../04_mechanics/eindil_journey.md) |
| `zin_glo_lost_cause_leader` | scripted trigger | [Glo spec](../../04_mechanics/yeldenne_and_glo.md) |
| `zin_eindil_awake`, `zin_eindil_named`, `zin_golden_king_dead`, `zin_horos_dead`, `zin_glo_with_eindil`, `zin_eindil_returned` | global flags | [shared contract](../../04_mechanics/00_shared_contract.md) |

**Text and art.** All text is short plain English in Windows-1252; the Castle of Yeldenne is always written so. No focus, spirit or event text names Afrit, calls the Deliverer a demon or names Eindil before `zin_eindil_named` (only `the_last_record` may name him). Every icon above is a catalog key and in the game today; event pictures are catalog keys with the standard crop. `hall_falls_silent` and `a_call_for_a_bearer` use the fallback `generic_court` until the requested picture key `yeldenne_silent_hall` (the empty throne hall of Yeldenne, the green light gone; gate `zin_horos_dead`, which both events follow) is added through the [icon catalog](../02_icon_catalog.md)'s "Adding a key".

## AI

### Historical route (4A 1748 to 1760)

| When | Focuses |
| --- | --- |
| 1748 | the_long_watch, the_wardens_of_mpe, wake_the_wards, the_judgment_seat, herds_of_the_frozen_north, the_tithe_roads |
| 1749 | the_blue_sword, the_frozen_gate, glernaens_old_protections, the_roll_of_the_rejected, eyes_in_the_south, envoys_to_fandanar |
| 1750 | the_tribes_of_the_ice, the_yeti_compact, the_hall_of_pillars, the_unyielding_hall, watchers_on_the_coast, rumours_of_the_ice |
| 1751–1752 | signs_among_the_pilgrims, await_the_worthy (after `zin_eindil_named`) |
| 1753 | Horos dies (Glo spec case A). the_hall_falls_silent, keep_the_empty_hall |
| 1754 | the_last_record (Eindil in stage 8), the_frozen_fortress |
| 1755–1760 | idle; the tree is exhausted. Yeldenne stays neutral |

On this route the ambush strength stays at 4 (the coast watch only), so the crew dies as in the lore; case A of the hall is fixed regardless of the wards. `petition_the_lost_cause`, `light_the_shore_beacon`, `send_guides_to_the_landing` and `ride_after_the_bearer` have weight 0 while `zin_eindil_historical` holds; `keep_the_empty_hall` gets ×2.5 (100 against 40), so the historical AI keeps the empty hall. Under the dynamic rule the AI uses the base values.

### Alternative routes

- **The hall holds.** A player rushes branch A and `signs_among_the_pilgrims`: wards 100 (50 + 60 + 5, clamped) with both flags. If Afrit strikes before Eindil comes, Horos repels him; `the_guardian_endures` follows, and Horos still gives Glo to the heir when he arrives.
- **Speed the heir.** Branches B and C to the beacon and the guides: the ambush strength falls to 2, so a few of Eindil's companions survive (or the ambush fails if the Gala Elves and the landing owner also help).
- **Follow the bearer.** After case A, D1: the wardens send men and arms to the Host of Eindil and join the coalition once he returns.
- **Keepers of the seal.** If Horos was slain before the heir came, D3: guard the sealed crystal, slow any defilement, and open it to the heir; or, if the heir is lost, call a second bearer.

## Acceptance

1. The compiled tree has 36 focuses with unique positions; every focus sits below its prerequisites; days are multiples of 7; the compiler, the HOI4 Agent Tools focus inspector and the script validator pass; the tree has no `raw` block.
2. The three D-branch heads (`ride_after_the_bearer`, `keep_the_empty_hall`, `seal_the_hall`) are mutually exclusive in both directions, and `open_for_the_heir` and `seek_a_second_bearer` exclude each other.
3. Scenario test: from wards 50, completing the root and branch A leaves `zin_yeldenne_wards` at 100 (50 + 60, clamped).
4. Historical observer run (one in-game year per phase from phase 3; the dates assume the 4A 1748 calendar): Yeldenne completes the 1748 row by 1 Thaw 4A 1749, never takes the four weight-0 focuses, and the journey's ambush strength is 4 at stage 7.
5. The compiler's secret scan finds no "Afrit", no demon wording for the Deliverer and no "Eindil" in any focus, spirit or event text of this tree except `zin_regional_yeldenne.7`.
6. Every modifier in the spirits table exists in the 1.19.3 modifier documentation (compiler check 5); every icon is a catalog key and every picture a catalog picture key with the standard crop.
7. On 1 Thaw 4A 1748 no available focus declares war, creates a war goal or claims a state (compiler scan).
8. The focus renderer produces a clean review image of the tree.
9. Yeldenne no longer loads the interim Long Peace tree.

## Open questions

1. **The wardens and the Warden.** OPEN_QUESTIONS, "eindil and glo" 7. Proceeds on the proposal: a human household of wardens in Mp'E, and an unnamed Warden of Mp'E (`zin_yeldenne_warden`, Glo spec) who rules after Horos.
2. **Historical choice after Horos.** OPEN_QUESTIONS, "eindil and glo" 7. Proceeds on the proposal: the historical AI keeps the empty hall (D2), following "the castle was left empty"; D1 stays a player and dynamic-AI choice.

Decided here (proposed): the envoy focuses need only that Coldor and the Yeti Lands exist, so they do not depend on a shared border on the final map.
