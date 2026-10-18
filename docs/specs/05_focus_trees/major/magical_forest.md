# Magical Forest Focus Tree

**Status:** Draft. **Priority:** 4. **Phase:** 4.

## Purpose

The major focus tree for the **Magical Forest**, the oldest and most peaceful elven realm of the Magical Lands (tree id `magical_forest`, focus ids `zin_magical_forest_<key>`, data file `docs/design/focus/magical_forest.json`). It plays the mechanic of [../../04_mechanics/elves_wall_and_dragons.md](../../04_mechanics/elves_wall_and_dragons.md): the council of houses, the old groves, the Wall Accord and its customs quarrel, the Kinship of the elven realms and the old rivalry of Herrodon and Andos Enda, Nolorim's passes, the dragons of Dragon Mountain, the pilgrim roads to the Zilin Hills, the wardens of the woods, the memory of Varner, and the defence of the rift coast. Its one great choice is **the Question of the Refusal**: keep the Refusal (historical), set it aside and march, or hide the woods from men.

The tree has 121 focuses in thirteen groups, 30 columns wide (x 0–29), 15 rows deep (y 0–14).

## Lore basis

**Established** (vault; sources in the mechanic spec): the elves of the Magical Lands were never conquered, even by Elzon; after Edran's folly the elven kingdoms sent no armies to help men, and the Refusal must not become a new alliance in the final invasion; individuals may still help; the Magical Forest is friendly, democratic and very old; the mycids live in the Mushroom Forest; dragons come from Dragon Mountain, are not a country, and obey elven powers (and Afrit through corruption); Varner is a Lesser Spirit of the Magical Lands who helped the elves against Elzon and dies in the last war; the eastern coalition threatens the Magical Lands in the last war; the Great Wall separates the Middle Lands from the Magical Lands.

**Proposed in the vault:** the Wall Accord of 4A 96 and the Pale March; the elected council of houses; the Worshipdom as a hermitage of about 4A 1520; the dragon entrusted to Eindil as a free ally by elves of the Magical Lands; the start on 1 Thaw 4A 1748.

**Working table (not fixed canon):** Herrodon and Andos Enda are rivals; Nolorim stays a separate country; the table also lists Andos Enda in the Leren Compact (left open here).

**Proposed here:** every focus, spirit, event, the proposed general Ithrandel, and every number. The Old Houses and the Open Houses are proposed leanings of the council, not lore parties. The tree never states how the eastern invasion ends for the elves, where Varner lives, what his death means for the Magical Lands, or whether Andos Enda belongs to the Leren Compact. Before `zin_afrit_revealed` no text names Afrit or calls the hermitage dark; before `zin_eindil_named` no text names Eindil.

## Design

### The peaceful start

On 1 Thaw 4A 1748 every available focus concerns the council, the groves, the Wall's customs, envoys to the kin, the roosts, the pilgrim roads or the training of wardens. No focus can create a war goal, a claim or a war before a story flag: the war focuses need `zin_eastern_invasion`, `zin_war_of_last_crowns`, `zin_afrit_revealed`, `zin_zol_rising` or the deliberate late choice *The Kindred Marches*, which itself needs `zin_elves_march_allowed` (never before 1 Thaw 4A 1751). *Drive Out the Temple* needs the reveal. *Carry the War Across the Rift* needs an invasion first.

### Branch map

| # | Branch | Columns | Rows | Focuses | Opens | Drives |
| --- | --- | --- | --- | ---: | --- | --- |
| 1 | The Council of Houses | 0–2 | 0–7 | 11 | start | Elections, Old or Open Houses, the road to the Question |
| 2 | The Old Groves | 3–7 | 0–6 | 11 | start | Economy, research, Essence |
| 3 | The Accord of the Wall | 8–11 | 0–6 | 11 | start | `zin_elves_wall_grievance`, Wall Moot, Accord renewal, wartime gates |
| 4 | The Elder Kinship | 12–15 | 0–7 | 13 | start | `zin_elves_kinship`, `zin_elves_rivalry`, pass watch, the Kindred |
| 5 | Keepers of the Roosts | 16–18 | 0–6 | 10 | start | `zin_elves_roost_bond`, defence against corruption, dragon pacts |
| 6 | Pilgrims on the Elven Roads | 19–21 | 0–5 | 9 | start; lower half on `zin_afrit_revealed` | Pilgrim-road policy, footholds, the temple after the reveal |
| 7 | Wardens of the Woods | 22–25 | 0–6 | 11 | start; last two on war flags | Army, elven technology |
| 8 | Varner's Trail | 26–27 | 0–4 | 6 | start | Seek the Wizard, wards, the wizard's death |
| 9 | The Rift Sea | 28–29 / 24–28 | 0–3 / 8–12 | 13 | start (watch); `zin_eastern_invasion` (war) | Defence of the rift coast and the passes |
| 10 | The Question of the Refusal | 12 | 8 | 1 | `zin_elves_refusal_question_open` | Route choice |
| 11 | The Refusal Stands (historical) | 8–10 | 9–14 | 9 | route | Wanderers, the bearer, the dragon for him, a new Accord |
| 12 | The Kindred Marches | 14–18 | 9–14 | 9 | route; `zin_elves_march_allowed` | Refusal set aside; war against the dark |
| 13 | The Hidden Woods | 2–4 | 9–13 | 7 | route | Isolation |

The three route roots (row 9) are mutually exclusive. The Rift Sea's war half (rows 8–12) hangs under its peaceful watch and is open on every route: the elves always defend their own lands.

### Notation used in the tables

- **Prerequisites:** `a + b` means a and b; `a / b` means a or b.
- **x,y:** grid column and row.
- **Effects** use the compiler vocabulary of [../00_format_and_compiler.md](../00_format_and_compiler.md): `political_power 50`, `stability 0.05`, `war_support 0.05`, `army_experience 10`, `navy_experience 10`, `manpower 5000`, `add_spirit k`, `swap_spirit old→new`, `remove_spirit k`, `event zin_x.n`, `event_for Name zin_x.n`, `flag f` (country flag), `global_flag f`, `building type level @where`, `research [categories] 50% ×uses`, `equipment type amount`, `wargoal Name type`, `for_country Name: …`, `call effect(args)`, `tooltip`. Spirit keys are short and compile to `zin_magical_forest_<key>`.
- **Mechanic shorthand:** `kinship +n` = `call zin_elves_add_kinship(n)`; `rivalry +n` = `call zin_elves_add_rivalry(n)`; `grievance +n` = `call zin_elves_add_wall_grievance(n)`; `bond +n` = `call zin_elves_add_roost_bond(n)`; `pass watch +n` = `call zin_elves_add_pass_watch(n)`; `goodwill X` = `call zin_elves_goodwill(target = X)`.
- **Avail:** the focus's `available` conditions. **Bypass:** used once (*Call the Kindred*).
- **Where keys:** `@capital`, `@random_owned`, `@random_coastal`, `@elven_wall` (an owned state adjacent to a `zin_is_site_great_wall` state; site trigger `zin_is_site_elven_wall`).
- **Research categories** are the warfare spec's `zin_cat_*` and vanilla `industry`, `land_doctrine`; equipment is `zin_elven_arms_equipment` (warfare spec).
- **Secret-safe names.** Focus names are visible in the tree from day one, so no focus name contains "Eindil", "son of Ein" or "Afrit". Descriptions of story focuses use scripted localisation that shows the name only after `zin_eindil_named` (the journey spec's naming rule: "the stranger" until then).
- **AI** is `ai.base` and its main factors. "hist" applies under `zin_rule_historical_path = HISTORICAL` (or `zin_rule_ai_elves = DEFAULT` following it); under `PLAUSIBLE` each "hist" factor f applies as 1 + (f − 1) ÷ 2 (×0 becomes ×0.5); "free" under `FREE`; "mar" when `zin_rule_ai_elves = MARCH`; "hid" when the AI drifts to the Hidden Woods (`FREE` with *The Old Houses Speak* taken). "N when available" means the base before the condition is met is 0 and becomes N once it is.

### Branch 1: The Council of Houses

**Purpose:** the elected council of houses (proposed constitution) and its leaning. The Magical Forest holds elections every 60 months (ideologies spec; next due Thaw 4A 1749). The branch ends at *Counsel of the Ancients*, one of the two ways to the Question of the Refusal. **Opens:** at start. **Mutual exclusions:** The Old Houses Speak / The Open Houses Speak; Remember Edran's Folly / Erdae Is Shared. **Mechanic:** stability, political power, Wall grievance, route weights.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `council_of_houses` | The Council of Houses | – | – | 1,0 | 70 | political_power 50; event zin_magical_forest.1 | 50 |
| `speakers_chair` | The First Speaker's Chair | council_of_houses | – | 0,1 | 35 | add_spirit speakers_chair | 20 |
| `roll_of_houses` | The Roll of the Houses | council_of_houses | – | 2,1 | 70 | stability 0.05; kinship +3 | 20 |
| `long_election` | The Long Election | speakers_chair / roll_of_houses | – | 1,2 | 70 | Avail: after 1748.9.1; event zin_magical_forest.2; popularity light 0.05 | 20; ×3 before 1749.3.1 (election month) |
| `old_houses` | The Old Houses Speak | long_election | open_houses | 0,3 | 35 | add_spirit old_houses; grievance +5 | 10; hid ×4; mar ×0.2 |
| `open_houses` | The Open Houses Speak | long_election | old_houses | 2,3 | 35 | add_spirit open_houses; grievance -5 | 10; hist ×2; mar ×2 |
| `speakers_of_peace` | Speakers of Peace | old_houses / open_houses | – | 1,4 | 70 | swap_spirit speakers_chair→speakers_of_peace; political_power 50 | 15 |
| `remember_edrans_folly` | Remember Edran's Folly | speakers_of_peace | erdae_is_shared | 0,5 | 35 | political_power 50; flag zin_magical_forest_folly_remembered (route weights) | 10; hist ×2; hid ×3 |
| `erdae_is_shared` | Erdae Is Shared | speakers_of_peace | remember_edrans_folly | 2,5 | 35 | goodwill Aenor; goodwill Kingson; flag zin_magical_forest_erdae_shared (route weights) | 10; mar ×5 |
| `houses_in_harmony` | Houses in Harmony | remember_edrans_folly / erdae_is_shared | – | 1,6 | 70 | stability 0.05; political_power 50 | 15 |
| `counsel_of_ancients` | Counsel of the Ancients | houses_in_harmony | – | 1,7 | 70 | add_spirit counsel_of_ancients | 15 |

### Branch 2: The Old Groves

**Purpose:** the wealth of an ancient forest: groves, wellsprings of Essence, timber, workshops, the archive and the loremasters, and trade with the Mushroom Forest (its mycids are established; whether they form their own polity is open, so the focus trades with the place and names no ruler). **Opens:** at start. **Mutual exclusions:** none. **Mechanic:** industry and research; Essence through the economy spec's re-themed `synthetic_refinery` (Essence Distillery).

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `old_groves` | The Old Groves | – | – | 5,0 | 70 | building infrastructure 1 @capital; political_power 25 | 40 |
| `elder_archive` | The Elder Archive | old_groves | – | 4,1 | 70 | add_spirit elder_archive | 20 |
| `wellsprings` | The Essence Wellsprings | old_groves | – | 6,1 | 70 | building synthetic_refinery 1 @capital (Essence Distillery) | 15 |
| `loremasters` | The Loremasters | elder_archive | – | 3,2 | 35 | research [land_doctrine] 50% ×1; political_power 25 | 15 |
| `deep_timber` | Timber of the Deep Woods | old_groves | – | 5,2 | 70 | building industrial_complex 1 @random_owned | 20 |
| `songs_of_making` | Songs of Making | loremasters | – | 3,3 | 70 | research [industry] 50% ×2 | 15 |
| `grove_workshops` | The Grove Workshops | deep_timber | – | 5,3 | 70 | building arms_factory 1 @capital; equipment zin_elven_arms_equipment 500 | 15 |
| `mushroom_trade` | Trade With the Mushroom Forest | grove_workshops / wellsprings | – | 7,4 | 70 | building infrastructure 1 @random_owned; political_power 25 | 10 |
| `harvest_moots` | The Harvest Moots | songs_of_making / grove_workshops | – | 4,4 | 70 | add_spirit harvest_moots | 15 |
| `living_halls` | The Living Halls | harvest_moots + mushroom_trade | – | 5,5 | 70 | building industrial_complex 2 @random_owned; add_spirit living_halls | 10 |
| `forest_provides` | The Forest Provides | living_halls | – | 5,6 | 70 | building arms_factory 1 @random_owned; research [zin_cat_arms] 50% ×1 | 8; ×3 after zin_eastern_invasion |

### Branch 3: The Accord of the Wall

**Purpose:** the Wall's daily quarrel: the customs men of the Golden Court, the gate at Kingson, the Wall Moot, the dragons that cross the Wall, the renewal of the Accord of 4A 96, and the gates in wartime. **Opens:** at start. **Mutual exclusions:** Close the Wall Roads / Renew the Accord of 4A 96. **Mechanic:** `zin_elves_wall_grievance`; the Wall Moot decision; `zin_elves_close_wall_roads`; the wall-gate decisions. The Accord's pacts and breaking stay with the diplomacy spec; nothing here declares war on Aenor.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `wall_accord` | The Accord of the Wall | – | – | 9,0 | 70 | event zin_magical_forest.4; goodwill Kingson; political_power 25 | 40 |
| `customs_at_the_gate` | Customs at the Gate | wall_accord | – | 8,1 | 35 | event_for Aenor zin_magical_forest.5 | 20; hist ×2 |
| `wall_traders` | Traders of the Wall Roads | wall_accord | – | 10,1 | 70 | add_spirit wall_traders | 20 |
| `friends_at_kingson` | Friends at Kingson | customs_at_the_gate / wall_traders | – | 9,2 | 70 | goodwill Kingson; political_power 25; grievance -5 | 15 |
| `watch_from_our_side` | Watch From Our Side | wall_traders | – | 11,2 | 70 | building bunker 1 @elven_wall; army_experience 5 | 10 |
| `wall_moot` | The Wall Moot | friends_at_kingson | – | 8,3 | 70 | flag zin_magical_forest_wall_moot (decision cost 25); grievance -10 | 20; hist ×2 |
| `guard_against_wyrms` | A Guard Against the Wyrms | friends_at_kingson / watch_from_our_side | – | 10,3 | 35 | flag zin_magical_forest_wyrm_guard; grievance -5 | 10 |
| `fair_tolls` | Ask for Fair Tolls | wall_moot | – | 8,4 | 35 | event_for Aenor zin_magical_forest.6 | 15 |
| `close_the_wall_roads` | Close the Wall Roads | guard_against_wyrms / watch_from_our_side | renew_accord | 11,4 | 35 | Avail: grievance ≥ 60; call zin_elves_close_wall_roads; political_power 50 | 5; hid ×5; hist ×0 |
| `renew_accord` | Renew the Accord of 4A 96 | fair_tolls / guard_against_wyrms | close_the_wall_roads | 9,5 | 70 | Avail: not zin_wall_accord_broken; event_for Aenor zin_magical_forest.7 | 15; hist ×2 |
| `gates_in_war` | Gates in Time of War | renew_accord / close_the_wall_roads | – | 10,6 | 35 | Avail: zin_war_of_last_crowns or zin_eastern_invasion; flag zin_magical_forest_wall_gates (decisions Open the Wall Gates / Bar the Wall Gates); political_power 25 | 20; ×5 when available |

### Branch 4: The Elder Kinship

**Purpose:** the Magical Forest as first among the elven realms: envoys to the kin, the old rivalry of Herrodon and Andos Enda, the wardens of Nolorim's passes, the Elder Moot and the Kindred of the Woods. **Opens:** at start. **Mutual exclusions:** none. **Mechanic:** `zin_elves_kinship`, `zin_elves_rivalry`, `zin_elves_pass_watch`, `zin_elves_raise_kindred`.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `elder_kinship` | The Elder Kinship | – | – | 13,0 | 70 | kinship +5; political_power 25 | 40 |
| `envoys_to_kin` | Envoys to the Kin Realms | elder_kinship | – | 12,1 | 35 | call zin_magical_forest_kin_goodwill; kinship +3 | 25 |
| `old_rivalry` | The Old Rivalry | elder_kinship | – | 14,1 | 35 | event zin_magical_forest.10 | 25 |
| `gifts_to_great_realms` | Gifts to Lccimio and The End | envoys_to_kin | – | 12,2 | 70 | goodwill Lccimio; goodwill The End; kinship +5 | 15 |
| `mediate_rivals` | Mediate Between the Rivals | old_rivalry | – | 14,2 | 70 | rivalry -15; kinship +5; flag zin_magical_forest_mediator (mediation decision cooldown 180 days) | 25; hist ×2 |
| `wardens_for_passes` | Wardens for Nolorim's Passes | envoys_to_kin / mediate_rivals | – | 13,3 | 70 | Avail: exists Nolorim; pass watch +15; kinship +3 | 15; ×3 with zin_magical_forest_forewarned_east |
| `boundary_groves` | The Boundary Groves | mediate_rivals | – | 15,3 | 35 | event_for Herrodon zin_magical_forest.11; event_for Andos Enda zin_magical_forest.11 | 20 |
| `elder_moot` | The Elder Moot | gifts_to_great_realms / wardens_for_passes | – | 13,4 | 70 | Avail: kinship ≥ 40; event zin_elves.30 (the Elder Moot); kinship +10 | 20 |
| `stone_in_passes` | Stone in the High Passes | wardens_for_passes | – | 14,4 | 70 | Avail: exists Nolorim; pass watch +15; for_country Nolorim: equipment zin_elven_arms_equipment 300 | 10; ×3 with zin_magical_forest_forewarned_east |
| `shared_songs` | Shared Songs of the Kin | elder_moot | – | 12,5 | 70 | add_spirit shared_songs; research [zin_cat_wards] 50% ×1 | 15 |
| `bind_the_rivals` | Bind the Old Rivals | elder_moot + boundary_groves | – | 14,5 | 70 | Avail: rivalry ≤ 40; rivalry -20; kinship +10 | 10 |
| `kindred_of_the_woods` | The Kindred of the Woods | shared_songs / bind_the_rivals | – | 13,6 | 70 | Avail: check zin_elves_kindred_ready; call zin_elves_raise_kindred | 10; ×20 when available after zin_eastern_invasion |
| `first_among_kin` | First Among the Kin | kindred_of_the_woods | – | 13,7 | 70 | add_spirit first_among_kin; kinship +10 | 15 |

### Branch 5: Keepers of the Roosts

**Purpose:** the elves' bond with Dragon Mountain. The branch raises the roost bond, guards the roosts against corruption, studies dragon lore, and lets the Keeper take a dragon when the woods are threatened. **Opens:** at start. If the Magical Forest is not the Keeper (map question), the bond effects still apply (the bond is global) and the pact focus works through opinion of the Keeper (magic spec). **Mutual exclusions:** none. **Mechanic:** `zin_elves_roost_bond`, `zin_elves_roosts_guarded`, `zin_world_give_dragon`, the Dragon Pact decision.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `keepers_of_roosts` | Keepers of the Roosts | – | – | 17,0 | 70 | bond +5; event zin_magical_forest.13 | 40 |
| `count_the_roosts` | Count the Roosts | keepers_of_roosts | – | 16,1 | 35 | bond +5; tooltip shows zin_dragons_free | 20 |
| `lore_of_dragons` | The Lore of Dragons | keepers_of_roosts | – | 18,1 | 70 | research [zin_cat_skies] 50% ×1 (Dragon Lore) | 15 |
| `songs_for_wyrms` | Songs for the Wyrms | count_the_roosts | – | 16,2 | 70 | add_spirit wyrm_songs; bond +10 | 15 |
| `eyries` | Eyries of the Magic Mountains | lore_of_dragons | – | 18,2 | 70 | Avail: zin_rule_skies not none; building air_base 2 @capital | 10 |
| `roost_wardens` | Perlan's Roost Wardens | songs_for_wyrms / eyries | – | 17,3 | 70 | call zin_magical_forest_recruit(zin_magical_forest_perlan); bond +5 | 15 |
| `guard_the_roosts` | Guard the Roosts | roost_wardens | – | 16,4 | 35 | call zin_afrit_add_footholds(-1) on ROOT; timed flag zin_elves_roosts_guarded 365 days; bond +5 | 10; ×5 with zin_elves_roost_sickness |
| `dragon_kinship` | Dragon Kinship | roost_wardens | – | 18,4 | 70 | research [zin_cat_skies] 50% ×1 (Dragon Kinship); bond +5 | 10 |
| `old_pact` | The Old Pact With the Mountain | guard_the_roosts / dragon_kinship | – | 17,5 | 70 | flag zin_magical_forest_old_pact (Dragon Pact costs 100); bond +10 | 10 |
| `wings_over_woods` | Wings Over the Woods | old_pact | – | 17,6 | 35 | Avail: check zin_elves_dragon_need, zin_dragons_free ≥ 1, `zin_world_dragon_pacts` < 3; call zin_elves_focus_dragon_pact (the Dragon Pact by focus: `zin_world_give_dragon(to = ROOT)`, Pact count +1, bond -10); on the historical path this is the one Pact of 4A 1755 | 0; 200 when available |

### Branch 6: Pilgrims on the Elven Roads

**Purpose:** the Worshipdom in the elves' midst. Before the reveal it is a hermitage whose pilgrims cross the woods; the branch chooses hostels or tolls and keeps quiet watch. After `zin_afrit_revealed` the lower half opens: close every road, or drive the temple out of the Zilin Hills. **Opens:** at start; *The Temple in Our Woods* needs `zin_afrit_revealed`. **Mutual exclusions:** Hostels for the Pilgrims / Tolls on the Pilgrim Roads; Close Every Road / Drive Out the Temple. **Mechanic:** `zin_elves_set_pilgrim_roads`, `zin_afrit_add_footholds`.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `pilgrim_roads` | Pilgrims on the Elven Roads | – | – | 20,0 | 35 | event zin_magical_forest.14 | 30 |
| `pilgrim_hostels` | Hostels for the Pilgrims | pilgrim_roads | road_tolls | 19,1 | 70 | call zin_elves_set_pilgrim_roads(2); stability 0.03 | 15; hist ×2 |
| `road_tolls` | Tolls on the Pilgrim Roads | pilgrim_roads | pilgrim_hostels | 21,1 | 70 | call zin_elves_set_pilgrim_roads(1); political_power 75 | 10 |
| `eyes_on_roads` | Eyes on the Roads | pilgrim_hostels / road_tolls | – | 20,2 | 70 | add_spirit eyes_on_roads | 10 |
| `courtesy_to_hermitage` | Courtesy to the Hermitage | eyes_on_roads | – | 19,3 | 35 | goodwill Worshipdom; political_power 25 | 10; hist ×2 |
| `quiet_valleys` | Questions About the Quiet Valleys | eyes_on_roads | – | 21,3 | 70 | event zin_magical_forest.15 | 10 |
| `temple_in_our_woods` | The Temple in Our Woods | courtesy_to_hermitage / quiet_valleys | – | 20,4 | 35 | Avail: zin_afrit_revealed; event zin_magical_forest.16; call zin_elves_set_pilgrim_roads(0) | 0; 100 when available |
| `close_every_road` | Close Every Road | temple_in_our_woods | drive_out_temple | 19,5 | 35 | call zin_magical_forest_purge_footholds (footholds -2 on every Kindred member and ROOT); stability 0.03 | 50; hist ×2 |
| `drive_out_temple` | Drive Out the Temple | temple_in_our_woods | close_every_road | 21,5 | 70 | wargoal Worshipdom take_state_focus (Zilin Hills states); war_support 0.05 | 5; free ×6; mar ×6 |

### Branch 7: Wardens of the Woods

**Purpose:** the small, skilled elven host: rangers, steeds, wardsong, leaf-steel, the long patrols, the old ways and the captains of the houses. Its last two focuses muster the houses and only open on war. **Opens:** at start. **Mutual exclusions:** none. **Mechanic:** army readiness; technology bonuses for the warfare spec's elven line.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `wardens_of_woods` | Wardens of the Woods | – | – | 23,0 | 70 | army_experience 10; research [zin_cat_arms] 50% ×1 | 40 |
| `forest_rangers` | Forest Rangers | wardens_of_woods | – | 22,1 | 70 | research [zin_cat_bows] 50% ×1 (Forest Rangers) | 20 |
| `elven_steeds` | Elven Steeds | wardens_of_woods | – | 24,1 | 70 | research [zin_cat_mounts] 50% ×1 | 15 |
| `wardsong` | The Wardsong | forest_rangers | – | 22,2 | 70 | research [zin_cat_wards] 50% ×2 | 15 |
| `archers_of_houses` | Archers of the Houses | forest_rangers / elven_steeds | – | 23,2 | 70 | equipment zin_elven_arms_equipment 1000; army_experience 10 | 15 |
| `long_patrols` | The Long Patrols | elven_steeds | – | 25,2 | 70 | add_spirit long_patrols | 15 |
| `leaf_steel` | Leaf-Steel | archers_of_houses | – | 23,3 | 70 | research [zin_cat_arms] 50% ×2 | 10 |
| `old_ways` | The Old Ways | wardsong / leaf_steel | – | 22,4 | 70 | add_spirit old_ways; army_experience 15 | 10 |
| `captains_of_houses` | Captains of the Houses | leaf_steel / long_patrols | – | 24,4 | 35 | call zin_magical_forest_recruit(zin_magical_forest_ithrandel); army_experience 5 | 10 |
| `house_musters` | Every House a Muster | old_ways + captains_of_houses | – | 23,5 | 70 | Avail: at_war or zin_war_of_last_crowns or zin_eastern_invasion; add_spirit house_musters; manpower 5000 | 0; 100 when available |
| `host_of_woods` | The Host of the Woods | house_musters | – | 23,6 | 70 | add_spirit host_of_woods; equipment zin_elven_arms_equipment 1500 | 0; 100 when available |

### Branch 8: Varner's Trail

**Purpose:** Varner, the Lesser Spirit of the Magical Lands, as the elves remember him: the tales of the Unbinding, the memory of his Third Age wardens, the search for his counsel, his coming with the bearer, and his death. **Opens:** at start. *Seek the Wizard* needs `zin_gathering_dark` ≥ 25, `zin_eindil_named` or `zin_zol_rising`. **Mutual exclusions:** none. **Mechanic:** `zin_elves_varner_sought`, `zin_elves.50`, the journey's `zin_eindil.87`. Text never says where Varner is.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `tales_of_wizard` | Tales of the Wizard | – | – | 26,0 | 35 | event zin_magical_forest.17; research [zin_cat_wards] 50% ×1 | 25 |
| `lantern_memory` | The Lantern Memory | tales_of_wizard | – | 26,1 | 70 | add_spirit lantern_memory | 15 |
| `wards_against_death` | Wards Against Death | lantern_memory | – | 26,2 | 70 | Avail: zin_zol_rising; research [zin_cat_wards] 100% ×2 | 0; 200 when available |
| `seek_the_wizard` | Seek the Wizard | lantern_memory | – | 27,2 | 35 | Avail: gathering dark ≥ 25 or zin_eindil_named or zin_zol_rising; flag zin_elves_varner_sought; event zin_elves.50 in 60 days | 30 |
| `wizard_and_servant` | The Wizard and His Servant | seek_the_wizard | – | 27,3 | 35 | Avail: check zin_magical_forest_hosts_bearer; flag zin_magical_forest_wizard_found (Eindil event .87 after 30 days, not 90) | 0; 200 when available |
| `wizard_falls` | When the Wizard Falls | wards_against_death / wizard_and_servant | – | 26,4 | 35 | Avail: zin_varner_dead; remove_spirit lantern_memory; add_spirit wizard_remembered | 0; 200 when available |

### Branch 9: The Rift Sea

**Purpose:** the rift coast that faces the East Lands. In peace: watchers and beacons on the shore of the rift realms (The End, Lccimio, Luv-zhise, Lengoli, Lusteli), elven sails, and merchants' rumours from across the water. In war: the elven defence against the eastern coalition. **Opens:** at start (rows 0–3); *Sails on the Rift Sea* needs `zin_eastern_invasion` or `zin_elves_eastern_threat`. **Mutual exclusions:** No Elf Pursues / Carry the War Across the Rift. **Mechanic:** `zin_magical_forest_rift_watch`, pass watch, the Kindred's defence, the coalition's white peace (`zin_elves.73`).

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `watch_rift_sea` | Watch the Rift Sea | – | – | 28,0 | 70 | call zin_magical_forest_rift_watch; navy_experience 5 | 30 |
| `beacons` | Beacons on the Eastern Shore | watch_rift_sea | – | 28,1 | 70 | add_spirit eastern_beacons | 15 |
| `elven_sails` | Elven Sails | watch_rift_sea | – | 29,1 | 70 | research [zin_cat_galleys] 50% ×1; building dockyard 1 @random_coastal | 15 |
| `merchants_of_rift` | Merchants Across the Rift | beacons / elven_sails | – | 29,2 | 35 | Avail: after 1752.3.1 or gathering dark ≥ 30; event zin_magical_forest.18 | 10 |
| `shore_levies` | Levies of the Shore | beacons | – | 28,3 | 70 | call zin_magical_forest_rift_watch; manpower 2000; army_experience 5 | 10; ×5 with zin_magical_forest_forewarned_east |
| `sails_on_rift` | Sails on the Rift Sea | shore_levies / merchants_of_rift | – | 26,8 | 35 | Avail: zin_eastern_invasion or check zin_elves_eastern_threat; war_support 0.10; army_experience 10; kinship +5 | 0; 500 when available |
| `call_the_kindred` | Call the Kindred | sails_on_rift | – | 24,9 | 35 | Bypass: check zin_elves_kindred_exists; call zin_elves_raise_kindred | 0; 300 when available |
| `hold_high_passes` | Hold the High Passes | sails_on_rift | – | 26,9 | 70 | Avail: exists Nolorim; pass watch +20; for_country Nolorim: equipment zin_elven_arms_equipment 500 | 0; 200 when available |
| `every_tree_a_wall` | Every Tree a Wall | sails_on_rift | – | 28,9 | 70 | add_spirit every_tree | 0; 300 when available |
| `into_the_sea` | Throw Them Into the Sea | hold_high_passes / every_tree_a_wall | – | 27,10 | 70 | add_spirit into_the_sea | 0; 150 when available |
| `no_elf_pursues` | No Elf Pursues | into_the_sea | war_across_rift | 26,11 | 35 | flag zin_magical_forest_no_pursuit (AI seeks white peace once the invader holds no Magical Lands state); stability 0.05 | 50; hist ×10; free ×1 |
| `war_across_rift` | Carry the War Across the Rift | into_the_sea | no_elf_pursues | 28,11 | 70 | call zin_magical_forest_wargoal_on_invader; war_support 0.05 | 10; hist ×0; free ×2; mar ×2 |
| `woods_stand` | The Woods Stand | no_elf_pursues / war_across_rift | – | 27,12 | 70 | Avail: zin_eastern_invasion, not at war with an East Lands country; remove_spirit every_tree; remove_spirit into_the_sea; add_spirit woods_stand; kinship +10 | 0; 100 when available |

### Branch 10: The Question of the Refusal

**Purpose:** the council's answer to a darkening world. It sits under the Council of Houses and the Elder Kinship (either branch's last focus leads to it). **Opens:** `zin_elves_refusal_question_open`: after `zin_golden_king_dead`, `zin_eindil_named`, `zin_eastern_invasion`, or from 1 Thaw 4A 1751. Event `zin_magical_forest.19` shows kinship, rivalry, grievance and `zin_gathering_dark`.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `question_of_refusal` | The Question of the Refusal | counsel_of_ancients / first_among_kin | – | 12,8 | 70 | Avail: check zin_elves_refusal_question_open; event zin_magical_forest.19 | 50 |

### Branch 11: The Refusal Stands (historical)

**Purpose:** the established path. The elves keep the Refusal, defend their own woods, send healers rather than hosts, heed the son of Ein, shelter the bearer, entrust him a free dragon, and after the war renew the Accord at the Wall. **Opens:** the route choice. **Mutual exclusions:** with the other two route roots. **Mechanic:** Wanderer decisions (elves spec 4.2), the journey's stage 8 events, `zin_eindil.88`.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `refusal_stands` | The Refusal Stands | question_of_refusal | hidden_woods, kindred_marches | 9,9 | 35 | add_spirit refusal_stands; flag zin_magical_forest_route_refusal | 30; hist ×10; free ×2 |
| `healers_not_hosts` | Healers, Not Hosts | refusal_stands | – | 8,10 | 35 | flag zin_magical_forest_healers (Wanderer decisions -15 PP, 3 active instead of 2); political_power 25 | 20 |
| `defend_what_is_ours` | Defend What Is Ours | refusal_stands | – | 10,10 | 70 | add_spirit defend_ours; building bunker 1 @capital | 20 |
| `heed_the_warning` | Heed the Warning | healers_not_hosts / defend_what_is_ours | – | 9,11 | 35 | Avail: zin_eindil_named, zin_eindil_stage ≥ 8; war_support 0.05; kinship +5; research [zin_cat_wards] 50% ×1 | 0; 200 when available |
| `shelter_the_bearer` | Shelter the Bearer | heed_the_warning | – | 8,12 | 35 | Avail: check zin_magical_forest_hosts_bearer; flag zin_magical_forest_shelters_bearer (discovery rolls halved); stability 0.03 | 0; 200 when available |
| `free_ally` | A Free Ally From the Mountain | heed_the_warning | – | 10,12 | 35 | Avail: zin_eindil_named, zin_eindil_stage ≥ 8, check zin_world_is_dragon_keeper or opinion of the Keeper ≥ 50; flag zin_magical_forest_bearer_dragon_ready; bond -5 | 0; 200 when available |
| `elder_wanderers` | The Elder Wanderers | shelter_the_bearer / free_ally | – | 9,13 | 70 | Avail: zin_war_of_last_crowns; timed flag zin_magical_forest_free_wanderers 180 days (Wanderer decisions cost 0); political_power 50 | 50 |
| `refusal_remembered` | The Refusal Remembered | elder_wanderers | – | 8,14 | 70 | Avail: zin_eindil_crowned or after 1760.1.1; swap_spirit refusal_stands→refusal_remembered | 50 |
| `new_accord` | A New Accord at the Wall | elder_wanderers | – | 10,14 | 70 | Avail: zin_afrit_dead or zin_eindil_crowned; not zin_wall_accord_broken; event_for Aenor zin_magical_forest.20 | 50 |

### Branch 12: The Kindred Marches

**Purpose:** a far-diverged game in which the elves set the Refusal aside and march against the dark. It never opens on the historical path: it needs `zin_elves_march_allowed` (the diplomacy spec's lifting conditions, the `MARCH` rule with `zin_gathering_dark` ≥ 75, or `zin_zol_manifested`). The Refusal is "set aside for this war"; `zin_elven_refusal` is never cleared, and *Home to the Woods* returns the realm to it. **Opens:** the route choice. **Mutual exclusions:** with the other route roots. **Mechanic:** `zin_refusal_lifted`, `zin_elves_sync_refusal`, `zin_elves_march`, the Kindred, dragon grants.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `kindred_marches` | The Kindred Marches | question_of_refusal | refusal_stands, hidden_woods | 16,9 | 35 | Avail: check zin_elves_march_allowed; event zin_magical_forest.21; call zin_diplo_lift_refusal (sets `zin_refusal_lifted`; news `zin_diplo.30`); call zin_elves_sync_refusal; global_flag zin_elves_march | 0; hist ×0; mar 100; free 5 |
| `elven_host` | The Elven Host | kindred_marches | – | 15,10 | 70 | add_spirit elven_host; manpower 5000 | 100 |
| `kin_beside_us` | Kin Beside Us | kindred_marches | – | 17,10 | 35 | if not check zin_elves_kindred_exists: call zin_elves_raise_kindred; event_for each Kindred member zin_magical_forest.22 | 100 |
| `over_wall_as_friends` | Over the Wall as Friends | elven_host | – | 14,11 | 70 | Avail: not zin_wall_accord_broken; Aenor at war with a dark power; event_for Aenor zin_magical_forest.23 | 30 |
| `against_the_dark` | Against the Dark | elven_host / kin_beside_us | – | 16,11 | 70 | Avail: check zin_magical_forest_dark_war_open; call zin_magical_forest_join_war_against_dark; war_support 0.10 | 100 when available |
| `dragons_of_march` | Dragons of the March | kin_beside_us | – | 18,11 | 35 | Avail: zin_dragons_free ≥ 1, bond ≥ 40, `zin_world_dragon_pacts` < 3; call zin_elves_focus_dragon_pact | 100 when available |
| `grand_alliance_remembered` | The Grand Alliance Remembered | against_the_dark / over_wall_as_friends | – | 15,12 | 70 | event zin_magical_forest.24; add_spirit grand_alliance_remembered | 50 |
| `no_crown_from_victory` | No Crown From Victory | grand_alliance_remembered / dragons_of_march | – | 17,13 | 35 | stability 0.05; flag zin_magical_forest_asks_nothing (no claims or cores in peace deals); goodwill Aenor | 50 |
| `home_to_woods` | Home to the Woods | no_crown_from_victory | – | 16,14 | 70 | Avail: not at war; clear_flag zin_refusal_lifted (an early return; otherwise the diplomacy spec returns the realm 365 days after its last war with a dark power); event zin_diplo.31; call zin_elves_sync_refusal; remove_spirit elven_host; remove_spirit grand_alliance_remembered; stability 0.05 | 100 when available |

### Branch 13: The Hidden Woods

**Purpose:** the elves forget men: the roads close, the paths wander, the roosts are sealed. A strong defensive isolation for a player who wants the woods to stand alone. **Opens:** the route choice. **Mutual exclusions:** with the other route roots. **Mechanic:** `zin_elves_set_pilgrim_roads(0)`, `zin_elves_close_wall_roads`, `zin_elves_roosts_sealed`, the state modifier `zin_elves_wandering_paths`.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `hidden_woods` | The Hidden Woods | question_of_refusal | refusal_stands, kindred_marches | 3,9 | 35 | add_spirit hidden_woods | 5; hid 100; free ×2 with old_houses |
| `wandering_paths` | Paths That Wander | hidden_woods | – | 2,10 | 70 | call zin_magical_forest_wandering_paths | 50 |
| `no_men_in_woods` | No Men in the Woods | hidden_woods | – | 4,10 | 35 | call zin_elves_set_pilgrim_roads(0); call zin_elves_close_wall_roads (bypass-safe); political_power 25 | 50 |
| `forest_forgets` | The Forest Forgets Men | wandering_paths / no_men_in_woods | – | 3,11 | 70 | call zin_afrit_add_footholds(-2) on ROOT; political_power 100 | 50 |
| `groves_of_refuge` | Groves of Refuge | forest_forgets | – | 2,12 | 70 | building bunker 2 @capital; building bunker 1 @random_owned | 50 |
| `secret_roosts` | The Secret Roosts | forest_forgets | – | 4,12 | 35 | flag zin_elves_roosts_sealed (Gifts for the Mountain unavailable while the Keeper holds it); bond +10 | 50 |
| `woods_endure` | The Woods Endure | groves_of_refuge / secret_roosts | – | 3,13 | 70 | add_spirit woods_endure | 50 |

## Implementation

### Files

| Path | Content |
| --- | --- |
| `docs/design/focus/magical_forest.json` | Tree data (source of truth) |
| `common/national_focus/zin_magical_forest.txt` | Compiled tree; `country = { factor = 0 modifier = { add = 10 original_tag = <Magical Forest> } }` (tag resolved by the builder) |
| `common/ideas/zin_focus_magical_forest.txt` | Spirits below |
| `events/zin_magical_forest.txt` | Namespace `zin_magical_forest`; effect-triggered only |
| `common/scripted_effects/zin_magical_forest.txt` | Tree effects below |
| `common/scripted_triggers/zin_magical_forest.txt` | Tree triggers below |
| `common/characters/zin_magical_forest.txt` | The proposed general |
| `localisation/english/zin_focus_magical_forest_l_english.yml` | All text |

Mechanic effects, triggers, variables, decisions and events (`zin_elves_*`, namespace `zin_elves`) belong to the mechanic spec and are only called here.

### Tree-declared scripted effects and triggers

| Name | Kind | Does |
| --- | --- | --- |
| `zin_magical_forest_recruit` (`character`) | effect | `recruit_character`; no-op if already recruited |
| `zin_magical_forest_kin_goodwill` | effect | `zin_elves_goodwill` with every Magical Lands elven realm |
| `zin_magical_forest_rift_watch` | effect | For every rift realm that is a Kindred member or has opinion of the Magical Forest ≥ 0 (the Magical Forest itself if it owns a rift state): `add_building_construction` coastal fort level 1 in one `zin_is_site_rift_west` state it owns (`instant_build = yes`) |
| `zin_magical_forest_purge_footholds` | effect | `zin_afrit_add_footholds(-2)` on ROOT and on every Kindred member |
| `zin_magical_forest_wargoal_on_invader` | effect | `create_wargoal` type `take_state_focus` against the eastern coalition leader (the East spec's `zin_east_coalition_leader`) on its `zin_is_site_rift_east` states |
| `zin_magical_forest_join_war_against_dark` | effect | `add_to_war` against the strongest dark power at war (Volgan, then Zol, then Afrit's realm after the reveal) on the side of Aenor if it fights it, else Eindil's host, else the Light country with most Middle Lands states at war with it |
| `zin_magical_forest_wandering_paths` | effect | `add_dynamic_modifier` `zin_elves_wandering_paths` (`enemy_attrition = 0.15`, `enemy_army_speed_factor = -0.10`) on every owned state |
| `zin_magical_forest_hosts_bearer` | trigger | ROOT employs `zin_eindil` (`has_character = zin_eindil`) or is `global.zin_eindil_host` |
| `zin_magical_forest_dark_war_open` | trigger | A country with `zin_diplo_is_dark_power` is at war with Aenor or controls a Middle Lands or Magical Lands state |

### Characters

| Id | Name | Status | Role | Traits | Recruited by |
| --- | --- | --- | --- | --- | --- |
| `<Magical Forest>_zin_ruler` | First Speaker Lusiel Velakorin | P (characters spec) | Country leader | `zin_trait_speaker_of_houses` | start |
| `zin_magical_forest_perlan` | Perlan, Warden of the Dragon Roosts | P (characters spec) | Political advisor | `zin_trait_dragon_warden` | start (hire); *Perlan's Roost Wardens* hires him if not hired |
| `zin_magical_forest_aenwe` | Loremaster Aenwe Lozari | P (characters spec) | Theorist | `zin_trait_elder_memory` | start |
| `zin_magical_forest_ithrandel` | Ithrandel, Captain of the Long Patrols | P (this spec) | Corps commander, skill 3 | `ranger`, `trickster` (vanilla placeholders) | *Captains of the Houses* |

The characters spec's start marshal, `zin_magical_forest_herrian` (Marshal Herrian Lustel, field marshal), stays the realm's senior commander; Ithrandel is a second, younger captain for the patrols. Portraits are image-generated (art spec).

### Spirits

Ids are `zin_magical_forest_<key>`. Every modifier key exists in the game's modifier documentation.

| Key | Name | Modifiers | Added / removed |
| --- | --- | --- | --- |
| `speakers_chair` | The First Speaker's Chair | political_power_gain 0.10 | The First Speaker's Chair; swapped by Speakers of Peace |
| `speakers_of_peace` | Speakers of Peace | political_power_gain 0.15, stability_factor 0.05 | Speakers of Peace |
| `old_houses` | The Old Houses | drift_defence_factor 0.15, stability_factor 0.05, opinion_gain_monthly_factor -0.10 | The Old Houses Speak |
| `open_houses` | The Open Houses | opinion_gain_monthly_factor 0.15, production_speed_buildings_factor 0.05, trade_opinion_factor 0.10 | The Open Houses Speak |
| `counsel_of_ancients` | Counsel of the Ancients | research_speed_factor 0.05, political_power_gain 0.05 | Counsel of the Ancients |
| `elder_archive` | The Elder Archive | research_speed_factor 0.05 | The Elder Archive |
| `harvest_moots` | The Harvest Moots | consumer_goods_factor -0.03, stability_factor 0.03 | The Harvest Moots |
| `living_halls` | The Living Halls | production_factory_max_efficiency_factor 0.05, production_factory_efficiency_gain_factor 0.05 | The Living Halls |
| `wall_traders` | Traders of the Wall Roads | trade_opinion_factor 0.10, consumer_goods_factor -0.02 | Traders of the Wall Roads; suspended (removed) while `zin_elves_wall_roads_closed`, restored on reopening |
| `shared_songs` | Shared Songs of the Kin | research_speed_factor 0.03, opinion_gain_monthly_factor 0.10 | Shared Songs of the Kin |
| `first_among_kin` | First Among the Kin | political_power_gain 0.05, improve_relations_maintain_cost_factor -0.20 | First Among the Kin |
| `wyrm_songs` | Songs for the Wyrms | stability_factor 0.02, air_attack_factor 0.05 | Songs for the Wyrms; while present the bond gains 0.5 a month (mechanic) |
| `eyes_on_roads` | Eyes on the Roads | enemy_operative_detection_chance_factor 0.15, civilian_intel_factor 0.05 | Eyes on the Roads |
| `long_patrols` | The Long Patrols | army_intel_factor 0.15, experience_gain_army_factor 0.05 | The Long Patrols |
| `old_ways` | The Old Ways | terrain_penalty_reduction 0.10, army_org_factor 0.03 | The Old Ways |
| `house_musters` | Every House a Muster | conscription_factor 0.15, recruitable_population_factor 0.10 | Every House a Muster; removed 365 days after the last war ends |
| `host_of_woods` | The Host of the Woods | army_defence_factor 0.10, army_org_factor 0.05 | The Host of the Woods |
| `lantern_memory` | The Lantern Memory | research_speed_factor 0.03, stability_factor 0.02 | The Lantern Memory; removed by When the Wizard Falls |
| `wizard_remembered` | The Wizard Remembered | war_support_factor 0.05, army_morale_factor 0.05 | When the Wizard Falls |
| `eastern_beacons` | Beacons on the Eastern Shore | coastal_bunker_effectiveness_factor 0.10, naval_detection 0.10 | Beacons on the Eastern Shore |
| `every_tree` | Roots Like Walls | dig_in_speed_factor 0.20, max_dig_in 2, army_core_defence_factor 0.05 | Every Tree a Wall; removed by The Woods Stand |
| `into_the_sea` | Throw Them Into the Sea | army_attack_factor 0.10, army_core_attack_factor 0.10 | Throw Them Into the Sea; removed by The Woods Stand |
| `woods_stand` | The Woods Stand | stability_factor 0.05, war_support_factor 0.05 | The Woods Stand |
| `refusal_stands` | The Refusal Stands | stability_factor 0.05, drift_defence_factor 0.10 | The Refusal Stands; swapped by The Refusal Remembered |
| `defend_ours` | Defend What Is Ours | army_core_defence_factor 0.10, war_support_factor 0.03 | Defend What Is Ours |
| `refusal_remembered` | The Refusal Remembered | stability_factor 0.05, research_speed_factor 0.03 | The Refusal Remembered |
| `elven_host` | The Elven Host | army_attack_factor 0.10, army_org_factor 0.05 | The Elven Host; removed by Home to the Woods |
| `grand_alliance_remembered` | The Grand Alliance Remembered | army_morale_factor 0.10, experience_gain_army_factor 0.05 | The Grand Alliance Remembered; removed by Home to the Woods |
| `hidden_woods` | The Hidden Woods | drift_defence_factor 0.25, stability_factor 0.05, opinion_gain_monthly_factor -0.20 | The Hidden Woods |
| `woods_endure` | The Woods Endure | army_core_defence_factor 0.15, recruitable_population_factor 0.10 | The Woods Endure |

The mechanic's ideas (`zin_elves_the_old_refusal`, `zin_elves_refusal_set_aside`, `zin_elves_woods_defended`, and others) are separate and managed by the mechanic.

### Events (namespace `zin_magical_forest`)

All are fired by focus or option effects. Text before `zin_afrit_revealed` never names Afrit; before `zin_eindil_named` never names Eindil.

| Id | Title | For | Fired by | Options (effects; AI) |
| --- | --- | --- | --- | --- |
| .1 | The Council of Houses Sits | Magical Forest | The Council of Houses | "The houses are many; the wood is one" (stability 0.02) / "Let the eldest speak first" (political_power 25); AI 50/50 |
| .2 | The Long Election | Magical Forest | The Long Election | Shows the houses' leanings. "The Old Houses stand for the seat" (flag `zin_magical_forest_lean_old`: The Old Houses Speak AI ×3) / "The Open Houses stand" (flag `zin_magical_forest_lean_open`: The Open Houses Speak AI ×3); AI 30/70 hist |
| .4 | The Accord of the Wall | Magical Forest | The Accord of the Wall | The Accord of 4A 96 is read aloud. "A line of stone, not of war" (grievance -5) / "The kings' toll grows heavier each year" (grievance +5; political_power 25); AI 70/30 |
| .5 | Elven Envoys on the Tolls | Aenor | Customs at the Gate | "Ease the tolls" (grievance -10; Aenor `zin_economy_add_gold` -10) / "The tolls stand" (grievance +5); AI ease = 60 − `zin_court_corruption` ÷ 2 |
| .6 | Fair Tolls at the Wall | Aenor | Ask for Fair Tolls | "Grant fair tolls" (grievance -15; Aenor political_power -25; goodwill Magical Forest) / "The crown sets its tolls" (grievance +10; Aenor political_power 25); AI as .5 |
| .7 | Renewal of the Wall Accord | Aenor | Renew the Accord of 4A 96 | "Renew it" (grievance -20; goodwill; both stability 0.02) / "Not this year" (grievance +10); AI renew 60 − corruption ÷ 2, 60 after `zin_aurevan_crowned` |
| .10 | The Old Rivalry | Magical Forest | The Old Rivalry | Shows rivalry. "Speak to both" (rivalry -5) / "Let them quarrel" (political_power 25); AI 80/20 |
| .11 | The Boundary Groves | Herrodon; Andos Enda | The Boundary Groves | "Accept the Forest's arbitration" (rivalry -10) / "The groves are ours" (rivalry +5); AI 60/40, ×0.5 for the side with lower opinion of the Magical Forest |
| .13 | The Roosts Counted | Magical Forest | Keepers of the Roosts | Perlan reports the dragons left to the mountain (`zin_dragons_free`). "Tend them" (bond +5) / "Leave them wild" (political_power 25); AI 70/30 |
| .14 | Pilgrims on the Elven Roads | Magical Forest | Pilgrims on the Elven Roads | Pilgrims from every court walk to the hermitage of the Zilin Hills. "Let them pass" / "Let them pass, and watch" (flag `zin_magical_forest_watchers`); AI 60/40 |
| .15 | Questions About the Quiet Valleys | Magical Forest | Questions About the Quiet Valleys | The loremasters note that the hermitage keeps no grove, no well and no song older than its founding. "Keep watching" (flag `zin_magical_forest_watching_zilin`: after the reveal, kinship +5 and Close Every Road costs nothing) / "Pilgrims are pilgrims" (stability 0.02); AI 50/50 |
| .16 | The Temple in Our Woods | Magical Forest | The Temple in Our Woods | After the reveal. "Close every road" (Close Every Road AI ×3) / "They shall leave the hills" (Drive Out the Temple AI ×3); AI 80/20 hist, 50/50 free |
| .17 | Tales of the Wizard | Magical Forest | Tales of the Wizard | The elders tell of the wizard of the Unbinding and his small purple servant. "Remember them"; no other effect |
| .18 | Merchants Across the Rift | Magical Forest | Merchants Across the Rift | Eastern merchants talk of rich lands and weak kings. "Light the beacons" (flag `zin_magical_forest_forewarned_east`) / "Merchants' talk" (political_power 25); AI 60/40, ×2 the first if any court has `zin_east_rift_talk` |
| .19 | The Question of the Refusal | Magical Forest | The Question of the Refusal | Council debate; shows kinship, rivalry, grievance, Gathering Dark. "Let the houses decide" |
| .20 | A New Accord at the Wall | Aenor | A New Accord at the Wall | "Sign the new Accord" (grievance -30; goodwill both; Aenor stability 0.03) / "Later" (grievance +5); AI 80/20 |
| .21 | The Houses Set the Refusal Aside | Magical Forest | The Kindred Marches | "For this war only" |
| .22 | The Kin Are Asked to March | Kindred members | Kin Beside Us | "March with the Forest" (`zin_diplo_lift_refusal`; `zin_elves_sync_refusal`) / "We defend our own woods" (nothing); AI 70/30 under `MARCH`, 20/80 otherwise |
| .23 | An Elven Host at the Wall | Aenor | Over the Wall as Friends | "Open the gates" (military access to the Magical Forest; goodwill) / "No elven host crosses the Wall" (grievance +10); AI 70 if Aenor is at war with a dark power, else 10 |
| .24 | The Grand Alliance Remembered | Magical Forest | The Grand Alliance Remembered | The houses remember Dardan and Edran's folly together. "This time we ask nothing"; flavour |

### Icons

Every key is from the icon catalog ([../02_icon_catalog.md](../02_icon_catalog.md)); no new focus icon is needed. Spirits use the icon of the focus that adds them.

| Branch | Focus → icon |
| --- | --- |
| 1 | council_of_houses `elven_council`; speakers_chair `council_table`; roll_of_houses `scroll_sealed`; long_election `elven_council`; old_houses `forest_ancient`; open_houses `tree_silver`; speakers_of_peace `olive_branch`; remember_edrans_folly `banner_laid_down`; erdae_is_shared `handshake_oath`; houses_in_harmony `concord_circle`; counsel_of_ancients `book_lore` |
| 2 | old_groves `forest_ancient`; elder_archive `book_lore`; wellsprings `staff_arcane`; loremasters `university_hall`; deep_timber `timber_mill`; songs_of_making `workshop_tools`; grove_workshops `forge_anvil`; mushroom_trade `mushroom_grove`; harvest_moots `granary`; living_halls `tree_silver`; forest_provides `foundry_fire` |
| 3 | wall_accord `charter_wall`; customs_at_the_gate `toll_house`; wall_traders `traders_road`; friends_at_kingson `envoy`; watch_from_our_side `fort_wall`; wall_moot `council_table`; guard_against_wyrms `dragon_wing`; fair_tolls `ledger_coins`; close_the_wall_roads `fort_wall`; renew_accord `scroll_treaty`; gates_in_war `levy_muster` |
| 4 | elder_kinship `elven_council`; envoys_to_kin `envoy`; old_rivalry `two_crowns`; gifts_to_great_realms `tribute_chest`; mediate_rivals `olive_branch`; wardens_for_passes `mountain_pass`; boundary_groves `map_unrolled`; elder_moot `concord_circle`; stone_in_passes `pass_fort`; shared_songs `hymn_choir`; bind_the_rivals `handshake_oath`; kindred_of_the_woods `alliance_rings`; first_among_kin `tree_silver` |
| 5 | keepers_of_roosts `dragon_mountain`; count_the_roosts `eye_watchful`; lore_of_dragons `book_lore`; songs_for_wyrms `dragon_wing`; eyries `snow_peak`; roost_wardens `ranger_cloak`; guard_the_roosts `ward_circle`; dragon_kinship `dragon_wing`; old_pact `seal_wax`; wings_over_woods `dragon_mountain` |
| 6 | pilgrim_roads `courier_pilgrim`; pilgrim_hostels `healer_herbs`; road_tolls `toll_house`; eyes_on_roads `eye_watchful`; courtesy_to_hermitage `hermitage_hills`; quiet_valleys `scout_lantern`; temple_in_our_woods `hermitage_hills`; close_every_road `ward_circle`; drive_out_temple `sword_shield` |
| 7 | wardens_of_woods `ranger_cloak`; forest_rangers `elven_bow`; elven_steeds `horse_cavalry`; wardsong `ward_circle`; archers_of_houses `bow_archers`; long_patrols `scout_lantern`; leaf_steel `forge_anvil`; old_ways `forest_ancient`; captains_of_houses `war_council_map`; house_musters `levy_muster`; host_of_woods `sword_shield` |
| 8 | tales_of_wizard `wizard_tower`; lantern_memory `lantern_chain`; wards_against_death `ward_circle`; seek_the_wizard `scroll_sealed`; wizard_and_servant `wizard_tower`; wizard_falls `staff_arcane` |
| 9 | watch_rift_sea `lighthouse`; beacons `beacon`; elven_sails `warship_sail`; merchants_of_rift `caravan`; shore_levies `spear_levy`; sails_on_rift `storm_sea`; call_the_kindred `alliance_rings`; hold_high_passes `pass_fort`; every_tree_a_wall `forest_ancient`; into_the_sea `sword_shield`; no_elf_pursues `olive_branch`; war_across_rift `ship_voyage`; woods_stand `tree_silver` |
| 10–13 | question_of_refusal `elven_council`; refusal_stands `banner_plain`; healers_not_hosts `healer_herbs`; defend_what_is_ours `fort_wall`; heed_the_warning `scout_lantern`; shelter_the_bearer `ranger_cloak`; free_ally `dragon_wing`; elder_wanderers `compass_rose`; refusal_remembered `book_lore`; new_accord `charter_wall`; kindred_marches `banner_league`; elven_host `elven_bow`; kin_beside_us `alliance_rings`; over_wall_as_friends `handshake_oath`; against_the_dark `sword_shield`; dragons_of_march `dragon_wing`; grand_alliance_remembered `banner_league`; no_crown_from_victory `olive_branch`; home_to_woods `tree_silver`; hidden_woods `forest_ancient`; wandering_paths `map_unrolled`; no_men_in_woods `fort_wall`; forest_forgets `white_deer`; groves_of_refuge `forest_ancient`; secret_roosts `dragon_mountain`; woods_endure `tree_silver` |

**Event pictures:** `.1`, `.2`, `.19`, `.21` `generic_court` (later the proposed `elven_moot`, see the mechanic spec); `.4`–`.7`, `.20`, `.23` `concord_council`; `.10`, `.11`, `.17` `generic_wilds`; `.13` `generic_wilds` (later the proposed `dragon_roosts`); `.14`, `.15` `hermitage`; `.16` `unmasking` (gate `zin_afrit_revealed`; the event's focus needs the flag); `.18` `generic_sea`; `.22`, `.24` `generic_war`.

### Data checks for this tree

- 121 focuses; unique keys; unique (x,y); x from 0 to 29; every focus's y is greater than every prerequisite's y (checked with the generator script used to draft this spec).
- Every exclusive pair is listed on both sides; the compiler makes it symmetric.
- Days are 35 or 70.
- `raw` blocks: none planned (limit 10).
- Every `call` and `check` names an effect or trigger in the mechanic spec, this spec, the shared contract or another named spec (`zin_afrit_add_footholds` from the Afrit spec, `zin_diplo_lift_refusal` from the diplomacy spec, `zin_economy_add_gold` from the economy spec; the dragon grants go through the mechanic's `zin_elves_focus_dragon_pact`, which calls the magic spec's `zin_world_give_dragon`).
- Focus names contain no "Eindil", "son of Ein" or "Afrit" (compiler secret scan; names are always visible).

## AI

### Historical route (4A 1748 to 4A 1760)

With `zin_rule_historical_path = HISTORICAL` (and `zin_rule_ai_elves = DEFAULT`), factors marked "hist" apply; Kindred Marches and Hidden Woods route focuses get factor 0. Dates are targets for the test run.

| Window | Focuses (in order) | Story beats |
| --- | --- | --- |
| Thaw – Harvest 1748 | The Council of Houses, The Old Groves, The Accord of the Wall, The Elder Kinship, Keepers of the Roosts | Peace; Elder Moot later in the year if kinship ≥ 40 |
| Fallowing 1748 – Thaw 1749 | The First Speaker's Chair, The Long Election, The Open Houses Speak, Customs at the Gate | Election in Thaw 1749 |
| Rainwake 1749 – Longnight 1749 | The Old Rivalry, Mediate Between the Rivals, Envoys to the Kin Realms, Pilgrims on the Elven Roads, Hostels for the Pilgrims, Wardens of the Woods | Rivalry kept under 60 |
| 1750 | Speakers of Peace, Traders of the Wall Roads, Friends at Kingson, The Wall Moot, Gifts to Lccimio and The End, Tales of the Wizard, Count the Roosts | Mistfall: the Golden King dies; `zin_elves.9` The New King's Customs refused |
| 1751 | Remember Edran's Folly, Houses in Harmony, Counsel of the Ancients, The Question of the Refusal, The Refusal Stands, Healers, Not Hosts | Route fixed: the Refusal |
| 1752 – 1753 | Watch the Rift Sea, Beacons on the Eastern Shore, Elven Sails, Merchants Across the Rift, Levies of the Shore, Wardens for Nolorim's Passes, The Boundary Groves, The Elder Moot, Forest Rangers, The Wardsong, Defend What Is Ours, Ask for Fair Tolls | The East talks of the rift; the passes are strengthened |
| 1754 | The Lantern Memory, Seek the Wizard, Heed the Warning, Eyes on the Roads, Courtesy to the Hermitage, Renew the Accord of 4A 96 | Eindil's warnings: the Magical Forest heeds (journey spec) |
| 1755, from `zin_war_of_last_crowns` | Gates in Time of War, Wards Against Death (after `zin_zol_rising`) | War begins elsewhere |
| 1755, within 60 days of `zin_eastern_invasion` | Sails on the Rift Sea, Call the Kindred, Every Tree a Wall, Hold the High Passes, Wings Over the Woods, Every House a Muster, The Host of the Woods | The Kindred defends the rift; one Dragon Pact (magic spec) |
| 1755 – 1756 | Shelter the Bearer, The Wizard and His Servant, A Free Ally From the Mountain, Throw Them Into the Sea, No Elf Pursues, The Elder Wanderers | The bearer in the forest; Varner and Golbran join him; the dragon is entrusted (`zin_eindil_dragon_pact`) |
| 1754 – 1756 (on the reveal) | The Temple in Our Woods, Close Every Road | Roads to the Zilin Hills closed; no war on the temple |
| 1757 | When the Wizard Falls (on `zin_varner_dead`), The Woods Stand (after the invaders leave) | Varner dies; Lorien dies (lands of the sun spec news) |
| 1758 – 1760 | A New Accord at the Wall (after `zin_afrit_dead`), The Refusal Remembered (1760), remaining economy focuses | The Magical Forest ends the age at peace with the Refusal unbroken |

### Alternative routes

| Route | How the AI gets there | Key choices |
| --- | --- | --- |
| **The Kindred Marches** (`zin_rule_ai_elves = MARCH`, or `FREE` with Erdae Is Shared and `zin_elves_march_allowed`) | The Open Houses Speak, Erdae Is Shared, the Question once `zin_elves_march_allowed` holds (else the AI waits up to 365 days, then takes The Refusal Stands) | Kin Beside Us, Against the Dark, Over the Wall as Friends, Dragons of the March, No Crown From Victory, Home to the Woods at peace |
| **The Hidden Woods** (`FREE` with The Old Houses Speak and Remember Edran's Folly) | Close the Wall Roads when grievance ≥ 60; Tolls on the Pilgrim Roads | Paths That Wander, No Men in the Woods, The Secret Roosts; still defends the rift through the Rift Sea branch |
| **Player** | Any order | The Question opens after the King's death, the naming, the invasion, or 4A 1751; war focuses still wait for their flags |

### General AI notes

- Before 4A 1751 the AI weights council, groves, Wall, kinship, roost and pilgrim focuses only; war-gated focuses have no weight before their flag.
- After `zin_eastern_invasion` the Rift Sea war focuses and the Wardens' musters take priority (weights 100–500).
- The AI never takes *Close the Wall Roads* or *Drive Out the Temple* under `HISTORICAL`.
- The AI never takes *Carry the War Across the Rift* under `HISTORICAL`.
- If the Worshipdom strikes the Magical Lands after the reveal (its tree's *Strike the Magical Lands*, non-historical) or Zol turns on the elven edge (Zol spec, non-historical), the Wardens' musters and *The Kindred of the Woods* take weight 300 when available; the Kindred's defence (mechanic spec) brings in the kin. No route lifts the Refusal for that alone: the elves defend their own woods.
- The Magical Forest AI does not take the Dragon Pact decision while *Wings Over the Woods* is available or within 365 days after it (one historical Pact).

## Acceptance

1. The compiler accepts `magical_forest.json`: 121 focuses, unique positions, prerequisites above their focuses, symmetric exclusions, days multiples of 7, no unknown modifier, effect or trigger.
2. The HOI4 Agent Tools focus inspector reports no errors; the focus renderer's review image shows thirteen readable groups within 30 columns.
3. On 1 Thaw 4A 1748 no available focus can create a war goal, a claim or a war (offline scan of every focus reachable before 4A 1751 without story flags).
4. The Question of the Refusal is unavailable on day one and becomes available after `zin_golden_king_dead`, `zin_eindil_named`, `zin_eastern_invasion` or on 1 Thaw 4A 1751.
5. *The Kindred Marches* is never available under `HISTORICAL` with `zin_rule_ai_elves = DEFAULT` before `zin_zol_manifested`.
6. Historical AI run: The Refusal Stands is taken in 4A 1751–1752; Sails on the Rift Sea within 60 days of `zin_eastern_invasion`; Shelter the Bearer and A Free Ally From the Mountain while Eindil is in the forest; `zin_refusal_lifted` is never set on the Magical Forest; `zin_wall_accord_broken` is never set; the realm ends 4A 1760 at peace.
7. `MARCH`-rule run: The Kindred Marches and Against the Dark are taken after `zin_elves_march_allowed`; Home to the Woods clears `zin_refusal_lifted` at peace.
8. No text reachable before `zin_afrit_revealed` names Afrit; none before `zin_eindil_named` names Eindil (compiler secret check).
9. All 30 spirits load; every modifier key is in the game's modifier documentation.

## Open questions

1. Are the Old Houses and the Open Houses acceptable as the council's two leanings, or does the owner have elven houses in mind?
2. Should the tree name the First Speaker and the general (Lusiel, Ithrandel are proposals), or stay with offices?
3. May the Kindred Marches route exist at all, as a far-diverged game, given the Refusal "should not be rewritten as a new alliance in the final invasion"? It never opens on the historical path.
4. Should *Drive Out the Temple* stay (the elves take the Zilin Hills after the reveal), or should the elves only close their roads?
5. The Magical Forest may not own a rift-coast state on the map. Should the tree's rift branch stay (defending the kin), or move to the rift realms' own trees?
