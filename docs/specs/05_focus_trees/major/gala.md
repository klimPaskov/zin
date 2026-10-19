# Gala Elves Focus Tree

**Status:** Ready. Reviewed 19 October 2026 against CONVENTIONS "Status"; integrated 19 October 2026. **Priority:** 4. **Phase:** 4.

## Purpose

The major focus tree for the **Gala Elves**, King Lorien's ancient court in the Lands of the Sun (tree id `gala`, focus ids `zin_gala_<key>`, data file `docs/design/focus/gala.json`). It plays the mechanic of [../../04_mechanics/lands_of_the_sun.md](../../04_mechanics/lands_of_the_sun.md): Lorien's memory and counsel, the Mirror of First Rain, the King's Ships, Gala's place among the Sunhot realms and the Noon Council, the quiet watch on foreign agents, the Sunward Guard, the long estrangement from Aenor, the stranger who comes to Gala, Lorien's last march with the old lords, and Gala after its king.

Gala holds one state and almost no levy. Its tree is about memory, ships and counsel, not conquest. It has 82 focuses in ten branches, 26 columns wide (x 0–25), 14 rows deep (y 0–13). In the game today the Gala Elves run the interim Long Peace tree; this tree replaces it when it is compiled.

## Lore basis

**Established** (vault; sources in the mechanic spec): Lorien, king of the Gala elves, led them in the Grand Alliance and fought at Dardan; he remembers the ages since; Edran's folly estranged the elves from Aenor and they refused to fight Elzon's war; Lorien still cares for all Erdae; late in the Fourth Age he receives a stranger from the Islands of the South, speaks with him for weeks, names him Eindil, son of Ein, warns him with a vision, sends him to Horos, and gives him a ship, armour, a sword and a crew of western friends, islanders and Gala elves; Afrit's agents work even in the Lands of the Sun; Lorien returns with ancient lords and spirits against Zol, challenges him and dies; the Sunhot elves are very tall, strong and peaceful.

**Proposed in the vault:** the Mirror of First Rain, a spring that shows true traces and uncertain futures; Lorien's warning that prophecy can frighten people into the deeds it predicts; the saying "carry it to Gala"; the Lands of Light as leading Sunhot realm.

**Open and kept open:** the relationship between the Gala elves and the Sunhot elves (no focus or text states it; the Sunhot focuses speak of neighbours and honour, never of kinship); any link to the countries Gala and North Gala; who follows Lorien; who the ancient lords are.

**Proposed here:** every focus, spirit, event and number.

## Design

### The peaceful start

On 1 Thaw 4A 1748 every available focus concerns the court, the Mirror, ships, envoys, festivals, the harbour watch or the training of the guard. No focus creates a war goal or a claim at any time: Gala's only war is Lorien's ride against Zol, which the Zol spec's event starts. Story branches open on `zin_eindil_stage` ≥ 5 (the stranger at Gala, historical 4A 1752), `zin_eindil_named`, `zin_glo_with_eindil`, `zin_zol_rising` and `zin_lorien_dead`. Before `zin_eindil_named` the stranger has no name in any focus; the branch calls him "a stranger from the islands".

### Branch map

| # | Branch | Columns | Rows | Focuses | Opens | Drives |
| --- | --- | --- | --- | ---: | --- | --- |
| 1 | What Lorien Remembers | 0–2 | 0–6 | 10 | start | Court, memory, Lorien's audiences |
| 2 | The Mirror of First Rain | 4–7 | 0–5 | 10 | start | `zin_mirror_clarity`, visions, warnings |
| 3 | The King's Ships | 8–10 | 0–5 | 9 | start | Navy; the ship Lorien gives |
| 4 | Among the Sun Realms | 12–15 | 0–6 | 11 | start | `zin_sun_concord`, `zin_gala_counsel`, the Noon League |
| 5 | Watch on the Harbours | 17–19 | 0–4 | 7 | start | Footholds in Gala; the hub's report |
| 6 | The Sunward Guard | 20–22 | 0–4 | 8 | start | Army, walls, wards |
| 7 | The Long Estrangement | 23–25 | 0–3 | 6 | start | Relations with Aenor; the Refusal; Wanderers |
| 8 | The Stranger at Gala | 5–7 | 8–13 | 8 | `zin_eindil_stage` ≥ 5 | The journey's stage 5 at Gala |
| 9 | The Old Lords Ride | 12–15 | 8–11 | 7 | `zin_gathering_dark` ≥ 50, `zin_eindil_named` or `zin_zol_rising` | `zin_gala_old_lords`; Lorien's ride |
| 10 | After the King | 19–21 | 9–12 | 6 | `zin_lorien_dead` | Gala after Lorien |

*After the King* is a free-standing branch: its root has no prerequisite, because Lorien may fall whatever Gala has done. Every other story branch hangs under the peaceful branches.

### Notation used in the tables

- **Prerequisites:** `a + b` means a and b; `a / b` means a or b.
- **x,y:** grid column and row.
- **Effects** use the compiler vocabulary of [../00_format_and_compiler.md](../00_format_and_compiler.md) (as in the Magical Forest spec). Spirit keys are short and compile to `zin_gala_<key>`; a full id starting `zin_` is used as written.
- **Mechanic shorthand:** `counsel +n` = `call zin_sun_add_gala_counsel(n)`; `concord +n` = `call zin_sun_add_concord(n)`; `clarity +n` = `call zin_sun_add_clarity(n)`; `old lords +n` = `call zin_sun_add_old_lords(n)`; `goodwill X` = `call zin_elves_goodwill(target = X)` (elves spec).
- **Avail:** the focus's `available` conditions. Bypass is never used.
- **Research categories** are the warfare spec's `zin_cat_*` (compiled to `add_tech_bonus`; until the warfare stage replaces the vanilla technologies they fall back to the nearest vanilla category: `naval_equipment` for ships, `infantry_weapons` for arms, bows and wards), the game's `industry` (kept until the economy spec renames it) and the doctrine category `land_doctrine` (compiled to `add_doctrine_cost_reduction` in 1.19.3).
- **Equipment** names the warfare spec's archetypes (`zin_elven_arms_equipment`; vanilla `infantry_equipment` until the warfare stage).
- **Events:** `event zin_gala.n` fires this tree's event `n`; ids with another namespace (`zin_diplo.31`) are owned by the named spec, and the compiler checks they exist (the event counterpart of decision S9's full mechanic idea ids).
- **AI**: "hist" applies under `zin_rule_historical_path = HISTORICAL`; under `PLAUSIBLE` each "hist" factor f applies as 1 + (f − 1) ÷ 2 (×0 becomes ×0.5); "free" under `FREE`. "N when available" means 0 before the condition and N after.
- **Secret-safe names.** Focus names are always visible, so none contains "Eindil", "son of Ein" or "Afrit". Before `zin_eindil_named` the branch calls him "a stranger from the islands"; descriptions that need his name use scripted localisation gated on the flag.

### Branch 1: What Lorien Remembers

**Purpose:** the oldest court in Erdae and the king who remembers Dardan. Audiences, songs, records of the First Men, and the court's temper: patience or warning. **Opens:** at start. **Mutual exclusions:** The King's Patience / The King's Warning. **Mechanic:** stability, political power, `zin_gala_counsel`, the Lorien's Audience decision.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `what_lorien_remembers` | What Lorien Remembers | – | – | 1,0 | 70 | political_power 50; event zin_gala.1 | 50 |
| `kings_audiences` | The King's Audiences | what_lorien_remembers | – | 0,1 | 35 | counsel +5; flag zin_gala_audiences (decision Lorien's Audience) | 25 |
| `songs_of_dardan` | The Songs of Dardan | what_lorien_remembers | – | 2,1 | 70 | add_spirit songs_of_dardan_spirit; army_experience 10 | 20 |
| `eldest_court` | The Eldest Court | kings_audiences / songs_of_dardan | – | 1,2 | 70 | add_spirit eldest_court_spirit; stability 0.05 | 20 |
| `tales_from_the_shores` | Tales From Every Shore | eldest_court | – | 0,3 | 35 | event zin_gala.2; counsel +5; political_power 25 | 15 |
| `first_men_records` | Records of the First Men | eldest_court | – | 2,3 | 70 | research [land_doctrine] 50% ×1; flag zin_gala_first_men_records | 15 |
| `memory_before_aen` | Memory Before Aen | tales_from_the_shores / first_men_records | – | 1,4 | 70 | add_spirit memory_before_aen_spirit | 15 |
| `kings_patience` | The King's Patience | memory_before_aen | kings_warning | 0,5 | 35 | add_spirit kings_patience_spirit | 10; hist ×2 |
| `kings_warning` | The King's Warning | memory_before_aen | kings_patience | 2,5 | 35 | flag zin_gala_kings_warning (Send Word of the Vision costs 25 less); counsel +10 | 10; free ×2 |
| `king_beyond_ages` | A King Beyond the Ages | kings_patience / kings_warning | – | 1,6 | 70 | political_power 100; stability 0.05 | 15 |

### Branch 2: The Mirror of First Rain

**Purpose:** the proposed spring of visions. The branch keeps the water clear, teaches its limits, looks north, south and across the seas, and learns to share what it sees. **Opens:** at start. **Mutual exclusions:** none. **Mechanic:** `zin_mirror_clarity`, `zin_sun_mirror_vision`, the Look Into the Mirror and Send Word of the Vision decisions, the fear of prophecy. No vision shows a person, the Deliverer's nature, or the stranger before his naming.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `mirror_of_first_rain` | The Mirror of First Rain | – | – | 5,0 | 70 | event zin_gala.3; flag zin_gala_mirror_open (decision Look Into the Mirror) | 40 |
| `keeper_of_mirror` | The Keeper of the Mirror | mirror_of_first_rain | – | 4,1 | 35 | call zin_gala_recruit(zin_gala_heveneya); clarity +10 | 20 |
| `courtyard_of_rain` | The Courtyard of Rain | mirror_of_first_rain | – | 6,1 | 70 | clarity +15; stability 0.02 | 15 |
| `true_traces` | Reading True Traces | keeper_of_mirror | – | 4,2 | 70 | flag zin_gala_true_traces (a vision costs 10 clarity less) | 15 |
| `uncertain_futures` | Uncertain Futures | courtyard_of_rain | – | 6,2 | 35 | event zin_gala.4; flag zin_gala_cautious_seers (fear chance of a warning 10 instead of 20) | 15 |
| `still_water` | Still Water | true_traces / uncertain_futures | – | 5,3 | 70 | add_spirit still_water_spirit | 15 |
| `visions_north` | Visions of the North | still_water | – | 4,4 | 35 | Avail: clarity ≥ 30; call zin_sun_mirror_vision(north) | 15; ×3 if zin_mistake_power ≥ 30 |
| `visions_south` | Visions of the South | still_water | – | 6,4 | 35 | Avail: clarity ≥ 30; call zin_sun_mirror_vision(south) | 15; ×3 if zin_dominion_strength ≥ 50 |
| `visions_across_seas` | Visions Across the Seas | visions_south | – | 7,5 | 35 | Avail: clarity ≥ 30; call zin_sun_mirror_vision(seas) | 10 |
| `share_the_sight` | Share the Sight | visions_north / visions_south | – | 5,5 | 35 | flag zin_gala_share_sight (warnings cost 25 less); counsel +5 | 10 |

### Branch 3: The King's Ships

**Purpose:** Gala's small, fine fleet: elven hulls, the Sun Harbour, charts of the southern seas, ships that call at the Islands of the South, and the remarkable ship Lorien will give. **Opens:** at start. **Mutual exclusions:** none. **Mechanic:** navy; the flag `zin_gala_great_ship` (the journey's voyage north takes 120 days instead of 150, proposed dependency).

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `kings_ships` | The King's Ships | – | – | 9,0 | 70 | building dockyard 1 @capital; navy_experience 10 | 30 |
| `shipwrights` | Sulestien's Shipwrights | kings_ships | – | 8,1 | 35 | call zin_gala_recruit(zin_gala_sulestien); navy_experience 5 | 15 |
| `elven_hulls` | Elven Hulls | kings_ships | – | 10,1 | 70 | research [zin_cat_galleys] 50% ×2 | 20 |
| `sun_harbour` | The Sun Harbour | shipwrights | – | 8,2 | 70 | building naval_base 2 @capital | 15 |
| `southern_charts` | Charts of the Southern Seas | elven_hulls | – | 10,2 | 35 | add_spirit southern_charts_spirit | 15 |
| `ships_to_islands` | Ships Calling at the Islands | sun_harbour / southern_charts | – | 9,3 | 70 | call zin_gala_islands_goodwill; counsel +5 | 15 |
| `ship_beyond_compare` | A Ship Beyond Compare | ships_to_islands | – | 8,4 | 70 | flag zin_gala_great_ship (Lorien's ship: voyage north 120 days, not 150); research [zin_cat_warships] 50% ×1 | 10; ×5 when zin_eindil_stage ≥ 5 |
| `warships_of_gala` | Warships of Gala | ships_to_islands | – | 10,4 | 70 | research [zin_cat_warships] 50% ×1; call zin_gala_lay_down_ships(2) | 10 |
| `fleet_of_sun` | The Fleet of the Sun | ship_beyond_compare / warships_of_gala | – | 9,5 | 70 | add_spirit fleet_of_sun_spirit | 10 |

### Branch 4: Among the Sun Realms

**Purpose:** Gala among its neighbours: envoys to the Lands of Light, the sun festivals, a guest's seat at the Noon Council, mediation of Sunhot quarrels, and the Noon League when danger comes. The text speaks of neighbours and honour, never of kinship. **Opens:** at start; *A Guest at the Noon Council* needs `zin_sun_noon_council`. **Mutual exclusions:** none. **Mechanic:** `zin_sun_concord`, `zin_gala_counsel`, `zin_sun_form_noon_league`.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `sun_realms` | Among the Sun Realms | – | – | 14,0 | 70 | concord +5; political_power 25 | 40 |
| `envoys_lands_of_light` | Envoys to the Lands of Light | sun_realms | – | 13,1 | 35 | goodwill The Lands of Light; counsel +5 | 25 |
| `sun_festivals` | The Sun Festivals | sun_realms | – | 15,1 | 70 | add_spirit sun_festivals_spirit | 15 |
| `guest_at_noon` | A Guest at the Noon Council | envoys_lands_of_light | – | 13,2 | 70 | Avail: zin_sun_noon_council; event_for The Lands of Light zin_gala.5 | 20 |
| `sea_of_gods` | Pilgrims to the Sea of Gods | sun_festivals | – | 15,2 | 70 | building infrastructure 1 @capital; concord +3 | 10 |
| `sun_guard_friends` | Friends Among the Sun Guard | guest_at_noon | – | 12,3 | 35 | call zin_gala_neighbour_goodwill (goodwill with every Sunhot realm bordering Gala); counsel +5 | 10 |
| `honour_sunhot` | Honour the Sunhot Elves | guest_at_noon / sea_of_gods | – | 14,3 | 70 | concord +10; call zin_gala_sunhot_goodwill | 15 |
| `mediator_of_south` | Mediator of the South | honour_sunhot | – | 13,4 | 70 | flag zin_gala_mediator (opens the Lands of the Sun decision *Speak for a Sunhot Quarrel*); counsel +10 | 10 |
| `carry_it_to_gala` | Carry It to Gala | honour_sunhot | – | 15,4 | 35 | event zin_gala.6; counsel +5; research [industry] 50% ×1 | 15 |
| `voice_of_memory` | The Voice of Memory | mediator_of_south / carry_it_to_gala | – | 14,5 | 70 | add_spirit voice_of_memory_spirit | 10 |
| `noon_council_arms` | The Noon Council Arms | voice_of_memory | – | 14,6 | 70 | Avail: check zin_sun_league_needed; event_for The Lands of Light zin_gala.7 | 0; 100 when available |

### Branch 5: Watch on the Harbours

**Purpose:** foreign priests and traders at Gala's quays. Gala does not know what the Deliverer is; it chooses whether to welcome the healing houses or keep a courteous distance. Historically the agents were there and reported the stranger's departure. **Opens:** at start; *No Word Leaves Gala* needs `zin_eindil_stage` ≥ 5. **Mutual exclusions:** A Courteous Distance / Welcome the Healing Houses. **Mechanic:** `zin_afrit_add_footholds` on Gala; the hub's report delay (`zin_gala_word_kept`).

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `strangers_at_quays` | Strangers at the Quays | – | – | 18,0 | 35 | event zin_gala.8 | 20 |
| `harbour_wardens` | Harbour Wardens | strangers_at_quays | – | 17,1 | 70 | add_spirit harbour_wardens_spirit | 15 |
| `pilgrim_priests` | The Pilgrim Priests | strangers_at_quays | – | 19,1 | 35 | event zin_gala.9 | 15 |
| `courteous_distance` | A Courteous Distance | harbour_wardens / pilgrim_priests | welcome_priests | 17,2 | 35 | call zin_afrit_add_footholds(-1) on ROOT; political_power 25 | 10; hist ×0; free ×2 |
| `welcome_priests` | Welcome the Healing Houses | harbour_wardens / pilgrim_priests | courteous_distance | 19,2 | 35 | call zin_afrit_add_footholds(1) on ROOT; stability 0.03; goodwill Worshipdom | 10; hist ×3 |
| `quiet_questions` | Quiet Questions | courteous_distance / welcome_priests | – | 18,3 | 70 | add_spirit quiet_questions_spirit | 10 |
| `no_word_leaves` | No Word Leaves Gala | quiet_questions | – | 18,4 | 35 | Avail: zin_eindil_stage ≥ 5; call zin_afrit_add_footholds(-1) on ROOT; flag zin_gala_word_kept (the report to the hub is 60 days later) | 0; hist ×0; free 30 |

### Branch 6: The Sunward Guard

**Purpose:** a small guard of veterans, some of whom remember Dardan; the walls of Gala; the courtyard of the Mirror; the wardsong that will matter against the dead. **Opens:** at start. **Mutual exclusions:** none. **Mechanic:** army; `zin_gala_courtyard_guarded` (the Mirror is stilled 30 days after the capital is lost, not at once).

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `sunward_guard` | The Sunward Guard | – | – | 21,0 | 70 | army_experience 10; research [zin_cat_arms] 50% ×1 | 30 |
| `tangsiel_command` | Tangsiel's Command | sunward_guard | – | 20,1 | 35 | call zin_gala_recruit(zin_gala_tangsiel); army_experience 5 | 15 |
| `arms_of_gala` | Arms of Gala | sunward_guard | – | 22,1 | 70 | equipment zin_elven_arms_equipment 500; research [zin_cat_arms] 50% ×1 | 15 |
| `walls_of_gala` | The Walls of Gala | tangsiel_command | – | 20,2 | 70 | building bunker 2 @capital; building coastal_bunker 1 @capital | 10 |
| `court_archers` | Archers of the King's Court | arms_of_gala | – | 22,2 | 70 | research [zin_cat_bows] 50% ×1; army_experience 5 | 10 |
| `guard_courtyard` | Guard the Courtyard of Rain | walls_of_gala | – | 20,3 | 35 | building bunker 1 @capital; flag zin_gala_courtyard_guarded (the Mirror is stilled 30 days after the capital is lost, not at once) | 10 |
| `veterans_of_dardan` | Veterans of Dardan | walls_of_gala / court_archers | – | 21,3 | 70 | add_spirit veterans_of_dardan_spirit | 10 |
| `wardsong_of_gala` | The Wardsong of Gala | veterans_of_dardan | – | 21,4 | 70 | research [zin_cat_wards] 50% ×2 | 10; ×5 after zin_zol_rising |

### Branch 7: The Long Estrangement

**Purpose:** Gala and Aenor since Edran's folly. Gala may write to Parim or let the Refusal hold; either way it may send friends, not allies: healers and loremasters (the elves spec's Wanderers). **Opens:** at start. **Mutual exclusions:** Letters to Parim / The Refusal Holds. **Mechanic:** opinion of Aenor; Wanderer costs and strength.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `long_estrangement` | The Long Estrangement | – | – | 24,0 | 35 | event zin_gala.10 | 30 |
| `letters_to_parim` | Letters to Parim | long_estrangement | refusal_holds | 23,1 | 70 | goodwill Aenor; political_power -25 | 5; hist ×0.5 |
| `refusal_holds` | The Refusal Holds | long_estrangement | letters_to_parim | 25,1 | 35 | stability 0.03; political_power 25 | 15; hist ×3 |
| `friends_not_allies` | Friends, Not Allies | letters_to_parim / refusal_holds | – | 24,2 | 70 | flag zin_gala_friends_not_allies (Wanderer decisions cost 10 less); counsel +5 | 10 |
| `healers_of_gala` | Healers of Gala | friends_not_allies | – | 23,3 | 70 | flag zin_gala_healers (Wanderers from Gala give research 0.05 instead of 0.03) | 10 |
| `care_for_erdae` | Care for All Erdae | friends_not_allies | – | 25,3 | 35 | Avail: gathering dark ≥ 40 or zin_eindil_named; war_support 0.03; counsel +5 | 10 |

### Branch 8: The Stranger at Gala

**Purpose:** the journey's stage 5 seen from Gala. The journey spec owns the events (`zin_eindil.50` A Stranger at Gala, `.51` Weeks of Memory, `.52` The Mirror of First Rain, `.54` Lorien's Gift, `.60` Lorien's Ship Sails North); these focuses make Gala's part cheaper, surer and faster. **Opens:** `zin_eindil_stage` ≥ 5; *The Name in the Water* needs `zin_eindil_named`; *The Ship Sails North* needs stage 6; *Word From the North* needs `zin_glo_with_eindil`. **Mutual exclusions:** none. **Mechanic:** clarity for the naming; the means to pay the gift; counsel.

**Timing.** The journey's events run: arrival `.50` (day 0, historically 15 Deepwinter 1752), `.51` (day 60), the naming `.52` (day 90), the Gift `.54` (day 120). The branch's 14-day focuses are sized so that the AI finishes the clarity focus before day 90 and both gift focuses before day 120 (35 + 14 + 14 + 14 + 14 = 91 days). *The Name in the Water* follows the naming.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `stranger_from_islands` | A Stranger From the Islands | eldest_court / still_water / sun_harbour | – | 6,8 | 35 | Avail: zin_eindil_stage ≥ 5; counsel +5; political_power 25 | 0; 200 when available |
| `weeks_of_memory` | Weeks of Memory | stranger_from_islands | – | 5,9 | 14 | research [land_doctrine] 50% ×1; flag zin_gala_weeks_of_memory | 0; 200 when available |
| `mirror_shows_a_name` | The Mirror Shows a Name | stranger_from_islands | – | 7,9 | 14 | clarity +20 (so the naming's cost of 30 leaves the Mirror usable); flag zin_gala_mirror_ready | 0; 200 when available |
| `armour_and_sword` | Armour and Sword | weeks_of_memory / mirror_shows_a_name | – | 5,10 | 14 | Avail: zin_eindil_stage = 5; equipment zin_elven_arms_equipment 500 (the arms of the Gift); flag zin_gala_gift_armour (Lorien's Gift: regard +5 more, proposed dependency) | 0; 150 when available |
| `crew_of_many_peoples` | A Crew of Many Peoples | weeks_of_memory / mirror_shows_a_name | – | 7,10 | 14 | Avail: zin_eindil_stage = 5; manpower 1000 (western friends, island navigators and Gala elves sign on); flag zin_gala_crew_chosen | 0; 150 when available |
| `name_in_the_water` | The Name in the Water | armour_and_sword / crew_of_many_peoples | – | 6,11 | 14 | Avail: zin_eindil_named; event zin_gala.11; stability 0.05; war_support 0.05 | 0; 200 when available |
| `ship_sails_north` | The Ship Sails North | name_in_the_water | – | 6,12 | 35 | Avail: zin_eindil_stage ≥ 6; political_power 50; counsel +10 | 0; 100 when available |
| `bearer_of_glo` | Word From the North | ship_sails_north | – | 6,13 | 35 | Avail: zin_glo_with_eindil; event zin_gala.12; war_support 0.05; counsel +5 | 0; 100 when available |

### Branch 9: The Old Lords Ride

**Purpose:** Lorien gathers the ancient lords and spirits who have survived since Dardan, for a war he hopes not to fight. The ride itself is the Zol spec's event `zin_mistake.22`; these focuses decide how many old lords ride and how strong the Old Powers Stand is. **Opens:** under the peaceful branches, with `zin_gathering_dark` ≥ 50, `zin_eindil_named` or `zin_zol_rising`. **Mutual exclusions:** none. **Mechanic:** `zin_gala_old_lords`, `zin_gala_ready_to_ride`. Nothing here is potent magic.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `old_lords` | The Old Lords | voice_of_memory / wardsong_of_gala / king_beyond_ages | – | 13,8 | 70 | Avail: gathering dark ≥ 50 or zin_eindil_named or zin_zol_rising; old lords +1; event zin_gala.13 | 30; ×5 after zin_zol_rising |
| `summon_ancient_lords` | Summon the Ancient Lords | old_lords | – | 12,9 | 70 | old lords +1; political_power -50 | 20; ×5 after zin_zol_rising |
| `spirits_who_remember` | Spirits Who Remember Dardan | old_lords | – | 14,9 | 70 | old lords +1 | 20; ×5 after zin_zol_rising |
| `kings_last_armour` | The King's Last Armour | summon_ancient_lords / spirits_who_remember | – | 13,10 | 35 | add_spirit kings_last_armour_spirit | 20; ×5 after zin_zol_rising |
| `ships_north_for_king` | Ships North for the King | spirits_who_remember | – | 15,10 | 35 | flag zin_gala_fleet_ready; navy_experience 10 | 10; ×5 after zin_zol_rising |
| `what_death_cannot_end` | What Death Cannot End | kings_last_armour | – | 12,11 | 35 | Avail: zin_zol_rising; research [zin_cat_wards] 100% ×1 | 0; 200 when available |
| `for_all_the_living` | For All the Living | kings_last_armour / ships_north_for_king | – | 14,11 | 35 | Avail: zin_zol_rising; flag zin_gala_ready_to_ride (old lords +1 when the King rides) | 0; 200 when available; hist ×1 |

### Branch 10: After the King

**Purpose:** Gala after Lorien's death: memory, the Mirror without its reader, and the court enduring. The steward is chosen by the mechanic's event `zin_sun.42`, not by a focus. **Opens:** `zin_lorien_dead`. **Mutual exclusions:** none. **Mechanic:** swaps the mechanic's `zin_sun_king_fallen` for *Gala Endures*; restores clarity and counsel; returns Gala to the Refusal at peace.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `king_has_fallen` | The King Has Fallen | – | – | 20,9 | 35 | Avail: zin_lorien_dead; stability 0.10; political_power 100 | 0; 500 when available |
| `keep_his_memory` | Keep His Memory | king_has_fallen | – | 19,10 | 70 | add_spirit his_memory | 100 when available |
| `mirror_without_king` | The Mirror Without Its King | king_has_fallen | – | 21,10 | 35 | clarity +20; flag zin_gala_mirror_kept | 100 when available |
| `gala_endures` | Gala Endures | keep_his_memory / mirror_without_king | – | 20,11 | 70 | swap_spirit zin_sun_king_fallen→gala_endures_spirit; counsel +10 | 100 |
| `new_voice_at_noon` | A New Voice at Noon | gala_endures | – | 19,12 | 35 | concord +10; goodwill The Lands of Light | 50 |
| `home_from_last_war` | Home From the Last War | gala_endures | – | 21,12 | 35 | Avail: not at war; if has flag zin_refusal_lifted: clear_flag zin_refusal_lifted and event zin_diplo.31 (an early return; otherwise the diplomacy spec returns Gala 365 days after its last war with a dark power); stability 0.05 | 50 |

## Implementation

### Files

| Path | Content |
| --- | --- |
| `docs/design/focus/gala.json` | Tree data (source of truth), hand-authored |
| `common/national_focus/zin_gala.txt` | Compiled tree; `country = { factor = 0 modifier = { add = 10 original_tag = <Gala Elves> } }` (tag resolved by the builder) |
| `common/ideas/zin_focus_gala.txt` | Spirits below |
| `events/zin_gala.txt` | Namespace `zin_gala`; effect-triggered only |
| `common/scripted_effects/zin_gala.txt` | Tree effects below |
| `localisation/english/zin_focus_gala_l_english.yml` | All text |

Every compiled file is written by `tools/content/modules/focus_compiler.mjs` ([../00_format_and_compiler.md](../00_format_and_compiler.md)) in the builder's one transaction through the shared rewrite engine. Compiled, the tree replaces the interim Long Peace tree (`zin_long_peace_*`, written today by `tools/content/modules/vanilla_removal.mjs`) for the Gala Elves.

Mechanic effects, variables, decisions and events (`zin_sun_*`, namespace `zin_sun`) belong to [lands_of_the_sun.md](../../04_mechanics/lands_of_the_sun.md) and are only called here. Other owners: `zin_elves_goodwill` and the Wanderer decisions ([elves_wall_and_dragons.md](../../04_mechanics/elves_wall_and_dragons.md)); `zin_afrit_add_footholds` ([afrit_hidden_council.md](../../04_mechanics/afrit_hidden_council.md)); the stranger's events `zin_eindil.50`–`.60` and `zin_eindil_stage` ([eindil_journey.md](../../04_mechanics/eindil_journey.md)); `zin_mistake.22` ([zols_mistake.md](../../04_mechanics/zols_mistake.md)); `zin_refusal_lifted` and `zin_diplo.31` ([03_diplomacy_and_factions.md](../../03_gameplay/03_diplomacy_and_factions.md)). The tree id `gala` and its event namespace `zin_gala` refer to the Gala Elves, not to the tier C country named Gala.

### Flags the tree sets

All are country flags on the Gala Elves.

| Flag | Set by | Read by |
| --- | --- | --- |
| `zin_gala_audiences`, `zin_gala_mirror_open`, `zin_gala_true_traces`, `zin_gala_cautious_seers`, `zin_gala_share_sight`, `zin_gala_kings_warning`, `zin_gala_mediator`, `zin_gala_courtyard_guarded`, `zin_gala_word_kept`, `zin_gala_ready_to_ride` | the focuses in the tables | The Lands of the Sun mechanic (its decisions, costs and events) |
| `zin_gala_great_ship`, `zin_gala_gift_armour`, `zin_gala_crew_chosen` | *A Ship Beyond Compare*, *Armour and Sword*, *A Crew of Many Peoples* | Eindil's journey (voyage time, Lorien's Gift), as recorded in the contract additions |
| `zin_gala_friends_not_allies`, `zin_gala_healers` | *Friends, Not Allies*, *Healers of Gala* | The elves spec's Wanderer decisions (cost −10; research 0.05 instead of 0.03), requested from that spec |
| `zin_gala_watching_quays` | zin_gala.8 | This tree's AI (*A Courteous Distance* ×2) |
| `zin_gala_first_men_records`, `zin_gala_weeks_of_memory`, `zin_gala_mirror_ready`, `zin_gala_fleet_ready`, `zin_gala_mirror_kept` | the focuses in the tables | Record only |

### Tree-declared scripted effects

| Name | Does |
| --- | --- |
| `zin_gala_recruit` (`character`) | `recruit_character` for `zin_gala_heveneya`, `zin_gala_sulestien` or `zin_gala_tangsiel`; no-op if already recruited |
| `zin_gala_islands_goodwill` | `zin_elves_goodwill` with every Islands of the South country that has a coast |
| `zin_gala_neighbour_goodwill` | `zin_elves_goodwill` with every Sunhot realm that borders the Gala Elves |
| `zin_gala_sunhot_goodwill` | `zin_elves_goodwill` with The Lands of Light and the five tier B Sunhot realms |
| `zin_gala_lay_down_ships` (`count`) | Adds `count` ship productions of the warfare spec's elven-sail galley (`add_equipment_production`, 1 dockyard each, 50% progress) |

### Characters

All from the characters spec, none new: `zin_lorien` (country leader, `zin_trait_memory_of_dardan`), `zin_gala_heveneya` (Keeper of the Mirror, theorist), `zin_gala_sulestien` (Master of the King's Ships, navy leader), `zin_gala_tangsiel` (Sunward Guard, corps commander). Status of the three officers: proposed.

### Spirits

Ids are `zin_gala_<key>`. Every modifier key exists in the game's modifier documentation.

| Key | Name | Modifiers | Added / removed |
| --- | --- | --- | --- |
| `songs_of_dardan_spirit` | The Songs of Dardan | army_morale_factor 0.05, experience_gain_army_factor 0.05 | The Songs of Dardan |
| `eldest_court_spirit` | The Eldest Court | political_power_gain 0.10 | The Eldest Court |
| `memory_before_aen_spirit` | Memory Before Aen | research_speed_factor 0.05 | Memory Before Aen |
| `kings_patience_spirit` | The King's Patience | stability_factor 0.05, drift_defence_factor 0.10 | The King's Patience; removed on `zin_lorien_dead` |
| `still_water_spirit` | Still Water | research_speed_factor 0.03 | Still Water; while present, clarity regains 1 more a month (mechanic) |
| `southern_charts_spirit` | Charts of the Southern Seas | navy_max_range_factor 0.15, naval_speed_factor 0.05 | Charts of the Southern Seas |
| `fleet_of_sun_spirit` | The Fleet of the Sun | navy_org_factor 0.05, naval_hit_chance 0.03 | The Fleet of the Sun |
| `sun_festivals_spirit` | The Sun Festivals | stability_factor 0.03, opinion_gain_monthly_factor 0.10 | The Sun Festivals |
| `voice_of_memory_spirit` | The Voice of Memory | political_power_gain 0.10, improve_relations_maintain_cost_factor -0.25 | The Voice of Memory |
| `harbour_wardens_spirit` | Harbour Wardens | enemy_operative_detection_chance_factor 0.20, civilian_intel_factor 0.05 | Harbour Wardens |
| `quiet_questions_spirit` | Quiet Questions | enemy_operative_detection_chance_factor 0.10, civilian_intel_factor 0.05 | Quiet Questions |
| `veterans_of_dardan_spirit` | Veterans of Dardan | army_org_factor 0.05, army_leader_start_level 1 | Veterans of Dardan |
| `kings_last_armour_spirit` | The King's Last Armour | army_attack_factor 0.10, army_morale_factor 0.10 | The King's Last Armour; removed on `zin_lorien_dead` |
| `his_memory` | His Memory Kept | stability_factor 0.05, research_speed_factor 0.03 | Keep His Memory |
| `gala_endures_spirit` | Gala Endures | stability_factor 0.05, drift_defence_factor 0.10 | Gala Endures (replaces the mechanic's `zin_sun_king_fallen`) |

### Events (namespace `zin_gala`)

All are fired by focus or option effects. Text never names Afrit before `zin_afrit_revealed` or Eindil before `zin_eindil_named`, and never states what the Gala elves are to the Sunhot elves.

| Id | Title | For | Fired by | Options (effects; AI) |
| --- | --- | --- | --- | --- |
| .1 | What Lorien Remembers | Gala Elves | What Lorien Remembers | The King speaks of Dardan and of the kings after it. "Memory is a duty" (stability 0.02) / "Memory is a burden" (political_power 25); AI 60/40 |
| .2 | Tales From Every Shore | Gala Elves | Tales From Every Shore | Island scholars bring tales too old for any man to explain. "Keep them in the archive" (research [industry] 30% ×1) / "Send answers back with them" (counsel +5); AI 50/50 |
| .3 | The Mirror of First Rain | Gala Elves | The Mirror of First Rain | A spring in an old courtyard. Lorien: the water shows true traces and possible futures, never a certain one. "Let the water be still" |
| .4 | Uncertain Futures | Gala Elves | Uncertain Futures | Lorien teaches that a prophecy can frighten people into the deeds it foretells. "We will speak with care" |
| .5 | A Guest at the Noon Council | The Lands of Light | A Guest at the Noon Council | "Honour the King of Gala" (concord +5; counsel +10) / "Hear him politely" (nothing); AI 80/20 |
| .6 | Carry It to Gala | Gala Elves | Carry It to Gala | Scholars from many shores arrive with what they cannot explain. "Hear them all" (counsel +5) |
| .7 | The Noon Council Arms | The Lands of Light | The Noon Council Arms | "Raise the Noon League" (concord +10; then `zin_sun_form_noon_league` if concord ≥ 60) / "Not yet" (nothing); AI 70/30 if concord ≥ 50, else 30/70 |
| .8 | Strangers at the Quays | Gala Elves | Strangers at the Quays | Foreign priests and traders ask many questions. "Watch them" (flag `zin_gala_watching_quays`: Courteous Distance AI ×2) / "Gala is open to all" (stability 0.02); AI 40/60 hist |
| .9 | The Pilgrim Priests | Gala Elves | The Pilgrim Priests | Priests of the Deliverer ask to open a house of healing by the harbour. "We will consider it" (the next focus decides) |
| .10 | The Long Estrangement | Gala Elves | The Long Estrangement | Lorien recalls Edran's folly. "The estrangement stands" (stability 0.02) / "Erdae's fate still matters to us" (counsel +5); AI 60/40 |
| .11 | The Name in the Water | Gala Elves | The Name in the Water | The court hears the name the water gave: Eindil, son of Ein (text allowed: the focus needs `zin_eindil_named`). "Gala will help him" (war_support 0.03) |
| .12 | Word From the North | Gala Elves | Word From the North | Sailors say the stranger lives and carries a light out of the north. "Then the voyage was not in vain" (counsel +5) |
| .13 | The Old Lords | Gala Elves | The Old Lords | Lorien sends word to lords and spirits who have lived since Dardan. "Let them remember" |

### Icons

Every key is from the icon catalog ([../02_icon_catalog.md](../02_icon_catalog.md)); no new focus icon is needed. Spirits use the icon of the focus that adds them. No icon shows Lorien's death, Zol or the stranger.

| Branch | Focus → icon |
| --- | --- |
| 1 | what_lorien_remembers `gala_sun`; kings_audiences `council_table`; songs_of_dardan `hymn_choir`; eldest_court `gala_sun`; tales_from_the_shores `island_shrine`; first_men_records `scroll_sealed`; memory_before_aen `book_lore`; kings_patience `olive_branch`; kings_warning `eye_watchful`; king_beyond_ages `gala_sun` |
| 2 | mirror_of_first_rain `mirror_rain`; keeper_of_mirror `mirror_rain`; courtyard_of_rain `sun_flowers`; true_traces `book_lore`; uncertain_futures `scroll_sealed`; still_water `mirror_rain`; visions_north `compass_rose`; visions_south `ember_desert`; visions_across_seas `sea_charts`; share_the_sight `beacon` |
| 3 | kings_ships `warship_sail`; shipwrights `shipwright_yard`; elven_hulls `galley_oars`; sun_harbour `lighthouse`; southern_charts `sea_charts`; ships_to_islands `island_shrine`; ship_beyond_compare `great_warship`; warships_of_gala `warship_sail`; fleet_of_sun `anchor_rope` |
| 4 | sun_realms `sun_flowers`; envoys_lands_of_light `envoy`; sun_festivals `sun_flowers`; guest_at_noon `council_table`; sea_of_gods `compass_rose`; sun_guard_friends `sunhot_spear`; honour_sunhot `sunhot_spear`; mediator_of_south `olive_branch`; carry_it_to_gala `book_lore`; voice_of_memory `gala_sun`; noon_council_arms `alliance_rings` |
| 5 | strangers_at_quays `harbour_lake`; harbour_wardens `eye_watchful`; pilgrim_priests `courier_pilgrim`; courteous_distance `seal_wax`; welcome_priests `healer_herbs`; quiet_questions `scout_lantern`; no_word_leaves `scroll_sealed` |
| 6 | sunward_guard `sword_shield`; tangsiel_command `war_council_map`; arms_of_gala `forge_anvil`; walls_of_gala `fort_wall`; court_archers `elven_bow`; guard_courtyard `mirror_rain`; veterans_of_dardan `banner_league`; wardsong_of_gala `ward_circle` |
| 7 | long_estrangement `chain_broken`; letters_to_parim `scroll_treaty`; refusal_holds `banner_plain`; friends_not_allies `handshake_oath`; healers_of_gala `healer_herbs`; care_for_erdae `map_unrolled` |
| 8 | stranger_from_islands `shipwreck`; weeks_of_memory `book_lore`; mirror_shows_a_name `mirror_rain`; armour_and_sword `lone_sword`; crew_of_many_peoples `ship_voyage`; name_in_the_water `mirror_rain`; ship_sails_north `great_warship`; bearer_of_glo `compass_rose` |
| 9 | old_lords `banner_league`; summon_ancient_lords `war_drums`; spirits_who_remember `rune_stone`; kings_last_armour `sword_shield`; ships_north_for_king `ship_voyage`; what_death_cannot_end `ward_circle`; for_all_the_living `banner_league` |
| 10 | king_has_fallen `empty_throne`; keep_his_memory `book_lore`; mirror_without_king `mirror_rain`; gala_endures `gala_sun`; new_voice_at_noon `sun_flowers`; home_from_last_war `olive_branch` |

**Event pictures:** `.1`, `.3`, `.4`, `.6`, `.10`, `.13` `gala_court` (`.3` and `.4` would move to `mirror_courtyard`, a requested key in the catalog, if it is ever added); `.2`, `.8`, `.9`, `.12` `generic_sea`; `.5` `generic_court`; `.7` `generic_war`; `.11` `gala_court` (the event needs `zin_eindil_named`; the picture shows no stranger).

### Data checks for this tree

- 82 focuses; unique keys; unique (x,y); x from 0 to 25; every focus's y is greater than every prerequisite's y; every focus has a catalog icon (checked on 19 October 2026 with the review checker).
- Exclusive pairs listed on both sides. Days 35 or 70, except four 14-day focuses of the Stranger branch (timed to the journey's events). No `raw` blocks.
- Every `call` names an effect in the mechanic specs, this spec, the Afrit spec (`zin_afrit_add_footholds`) or the diplomacy spec (`zin_diplo_lift_refusal` is never called here; the Zol spec's event lifts the Refusal).
- Focus names contain no "Eindil", "son of Ein" or "Afrit" (compiler secret scan; names are always visible).

## AI

### Historical route (4A 1748 to 4A 1760)

With `zin_rule_historical_path = HISTORICAL`, factors marked "hist" apply. Dates are targets for the test run.

| Window | Focuses (in order) | Story beats |
| --- | --- | --- |
| Thaw – Harvest 1748 | What Lorien Remembers, The Mirror of First Rain, Among the Sun Realms, The King's Ships, The Long Estrangement | Peace |
| Fallowing 1748 – Highsun 1749 | The King's Audiences, Envoys to the Lands of Light, The Refusal Holds, Strangers at the Quays, The Sunward Guard, The Keeper of the Mirror | Audiences to the Lands of Light |
| Goldfield 1749 – Longnight 1750 | The Songs of Dardan, The Eldest Court, A Guest at the Noon Council, The Sun Festivals, The Pilgrim Priests, Welcome the Healing Houses, The Courtyard of Rain, Reading True Traces, Uncertain Futures | The healing houses open (footholds 1: the hub will hear of the stranger in 30 days) |
| 1751 | Still Water, Visions of the South, Visions of the North, Sulestien's Shipwrights, Elven Hulls, Records of the First Men, Tales From Every Shore | First warnings sent to Mirolon, Selen and the Magical Forest |
| Deepwinter – Goldfield 1752 (stage 5) | A Stranger From the Islands, Weeks of Memory, The Mirror Shows a Name, Armour and Sword, A Crew of Many Peoples, The Name in the Water, The Ship Sails North | `zin_eindil_named`; Lorien's gift; the ship sails |
| 1752 – 1753 | The Sun Harbour, Charts of the Southern Seas, Ships Calling at the Islands, A Ship Beyond Compare, Memory Before Aen, The King's Patience, A King Beyond the Ages, Word From the North | `zin_glo_with_eindil` (1753) |
| 1754 – 1756 | Honour the Sunhot Elves, Mediator of the South, Carry It to Gala, The Voice of Memory, Friends, Not Allies, Healers of Gala, Care for All Erdae, The Old Lords, Summon the Ancient Lords, Spirits Who Remember Dardan, The Walls of Gala, Veterans of Dardan | Old lords 3–4 by 1756 |
| 1755 – 1757 (after `zin_zol_rising`) | The Wardsong of Gala, The King's Last Armour, What Death Cannot End, For All the Living, Ships North for the King | Old lords 4–5 |
| 1757 | (the Zol spec's event) Lorien rides; Lorien falls | `zin_lorien_dead`; After the King: the AI picks a steward by weight |
| 1757 – 1760 | The King Has Fallen, Keep His Memory, The Mirror Without Its King, Gala Endures, A New Voice at Noon, Home From the Last War | Gala at peace, the Refusal restored |

### Alternative routes

| Route | How | Key choices |
| --- | --- | --- |
| **The guarded harbour** (`FREE`) | Strangers at the Quays "Watch them", A Courteous Distance, No Word Leaves Gala | The hub learns of the stranger 60 to 90 days later; Afrit's ambush may weaken (Afrit and journey specs) |
| **The warning king** (`FREE`) | The King's Warning, Share the Sight, Letters to Parim | More warnings, more fear of prophecy; Aenor may heed the centre sight |
| **The Noon League** | The Noon Council Arms when the region is attacked | A defensive league of the Sunhot realms with Gala as an ally |
| **Player** | Any order | Story branches still wait for their flags |

### General AI notes

- The AI never takes a focus that would lower Gala's footholds under `HISTORICAL` (the vault has the agents report the stranger).
- Before `zin_eindil_stage` 5 the AI weights court, Mirror, ships and Sun-realm focuses; from stage 5 the Stranger branch comes first.
- The AI rides with Lorien (Zol spec, option A) under every rule except when Gala is not at peace with Eindil's host.

## Acceptance

1. The compiler builds `gala.json` with no errors: 82 focuses, unique positions, prerequisites above their focuses, the exclusions (*The King's Patience* / *The King's Warning*, *A Courteous Distance* / *Welcome the Healing Houses*, *Letters to Parim* / *The Refusal Holds*) symmetric, days multiples of 7 between 14 and 70, no `raw` block, no unknown modifier, effect, trigger or event; compiler checks 1–7 pass.
2. Every focus icon is a catalog key and every event picture a picture key with the standard crop; `.11` uses no gated picture.
3. The HOI4 Agent Tools focus inspector reports no errors; `hoi4_focus_render` shows ten readable branches within 26 columns.
4. No focus of the tree ever creates a war goal, claim or war (offline scan of the compiled file).
5. No focus name contains "Eindil" or "son of Ein"; no focus description, tooltip or event text reachable before `zin_eindil_named` contains them; none names Afrit before `zin_afrit_revealed` (compiler secret check).
6. No text states a relationship between the Gala elves and the Sunhot elves (review checklist).
7. Isolated Linux run, one in-game year under `HISTORICAL`: AI Gala completes *What Lorien Remembers*, *The Mirror of First Rain*, *Among the Sun Realms*, *The King's Ships* and *The Long Estrangement* by Harvest 4A 1748 (±120 days) and is at war with nobody.
8. Long historical observer run: the Stranger branch is completed during stage 5 in 4A 1752; *Welcome the Healing Houses* is taken before 4A 1752; old lords ≥ 3 when `zin_zol_manifested` is set; *The King Has Fallen* is taken within 30 days of `zin_lorien_dead`.
9. All 15 spirits load; every modifier key is in the game's `modifiers_documentation.md`.

## Open questions

Settled here (proposed): *The Name in the Water* stays a focus; it only rewards the naming, which stays in the journey's events.

Owner questions still open ([OPEN_QUESTIONS.md](../../OPEN_QUESTIONS.md), elves 15, 16, 21); the work proceeds on each proposal:

1. Is one state with almost no levy the intended scale for Lorien's realm? Proposal: yes; the tree is ships, memory and counsel.
2. May Gala keep foreign priests at a distance outside the historical path? Proposal: yes, through *A Courteous Distance* and *No Word Leaves Gala*; the historical AI never takes them.
3. Should the old lords who ride with Lorien be named? Proposal: no; the text says only "lords and spirits who have lived since Dardan".
