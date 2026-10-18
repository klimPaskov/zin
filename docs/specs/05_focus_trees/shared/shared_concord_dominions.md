# Shared tree: the Concord dominions

**Status:** Draft. **Priority:** 6. **Phase:** 6 (tier C).

## Purpose

One focus tree for the eighteen tier C countries of the Middle Lands: seventeen chartered dominions of Aenor and one free land. It makes a small dominion feel like a member of the Middle Kingdom Concord: it petitions for its charter, answers the crown's levies, builds its fields and harbours, chooses a side when the Golden King dies, and stands or falls when the dark comes. Branches open by overlord, ideology, coast, region and people, so the same tree reads differently for a lake republic, a coastal lordship, a frontier march and a free land outside the Concord.

The tree also defines the helper effects the Middle Lands tier B trees ([../regional/middle_lands.md](../regional/middle_lands.md)) call, so every dominion talks to the Aenor mechanic ([../../04_mechanics/aenor_court_and_succession.md](../../04_mechanics/aenor_court_and_succession.md)) the same way.

| Item | Value |
| --- | --- |
| Tree id | `shared_concord_dominions` (focus ids `zin_shared_concord_dominions_<key>`) |
| Tier | C |
| Countries | Freshon, Pazoma, Kunhrim, Belurithon, Klungori Guard, Mondon, Noloreh, Olvinc-un, Safeton, Svenlor, Tieri, Vothrim, Dariap, Fotan, Hilofrim, Novez, Stendorler, Ulgus |
| Focuses | 66; columns 0–29 |
| Events | namespace `zin_shared_concord_dominions` |
| Spirits | `zin_shared_concord_dominions_<key>` |

### The countries at the start

| Country | States | Ideology, stance | Overlord | Loyalty, charter (Aenor spec) | Footholds | Notes |
| --- | ---: | --- | --- | --- | ---: | --- |
| Freshon | 4 | Wild, Freeholds | Aenor | 50, Golden | 2 | |
| Pazoma | 4 | Wild, Freeholds | Aenor | 50, Golden | 2 | |
| Kunhrim | 3 | Wild, Freeholds | Aenor | 45, Old | 2 | |
| Belurithon | 2 | Wild, Freeholds | Aenor | 50, Old | 2 | |
| Klungori Guard | 2 | Wild, Freeholds | Aenor | 70, Old | 2 | |
| Mondon | 2 | Wild, Freeholds | Aenor | 60, Old | 2 | |
| Noloreh | 2 | Wild, Freeholds | Aenor | 55, Old | 2 | |
| Olvinc-un | 2 | Wild, Freeholds | Aenor | 50, Old | 2 | |
| Safeton | 2 | Light, Free Council (elections) | Aenor | 70, Old | 2 | Southern lake republic on the peaceful ocean route |
| Svenlor | 2 | Wild, Freeholds | Aenor | 55, Old | 2 | |
| Tieri | 2 | Wild, Freeholds | Aenor | 60, Old | 2 | |
| Vothrim | 2 | Wild, Freeholds | Aenor | 55, Old | 2 | |
| Dariap | 1 | Wild, Freeholds | Aenor | 60, Old | 2 | |
| Fotan | 1 | Wild, Freeholds | none | — | 1 | Outside the Concord (Aenor spec) |
| Hilofrim | 1 | Wild, Freeholds | Aenor | 65, Old | 2 | |
| Novez | 1 | Wild, Freeholds | Aenor | 55, Old | 2 | Neighbour of Hiloron |
| Stendorler | 1 | Wild, Freeholds | Aenor | 60, Old | 2 | |
| Ulgus | 1 | Wild, Freeholds | Aenor | 60, Old | 2 | |

All are men of the Middle Kingdom tradition (`zin_tradition_middle_kingdom`; Fotan too, proposed).

## Lore basis

- **Established:** Aenor leads 26 satellites in the Middle Kingdom Concord (working table); the Golden King founded the Lost Cause; after his death four camps contend (the Golden Court, the Free Dominions, Afrit's supporters, Eindil's popular host) and the victor is a possible ending, not history; the War of the Last Crowns besets Aenor from every side; Zol's dead cannot be ended by ordinary weapons; Eindil's coalition takes men of many realms without making them subjects.
- **Proposed in the vault:** the Charters of Parim (4A 3) as the dominions' constitution; the Concord Council (4A 212: a common army in war, free roads in peace); the Houses of the First Light.
- **Proposed here:** every focus, spirit, event and number; the petition, camp-backing and free-land helpers.
- **Kept open:** whether a dominion is "constitutionally a satellite or an internal division" (vault); which dominions back which camp in history; whether the Concord survives the war.

## Design

### How the tree reads

- **Every country** gets the root, *Fields and Markets*, *Arms of the Dominion*, *The Houses* and *The Dark Comes*.
- **Concord dominions** (`check zin_aenor_is_concord_dominion`) get *Under the Charter* and *The Thirty Days*.
- **Free lands** (not a subject: Fotan, or a dominion that seceded) get *The Free March*.
- **Coastal countries** (`check zin_shared_has_coast`) get *Harbours*.
- **By ideology:** Light realms get *The Free Council*; Wild realms *The Lords' Moot*; Dominion realms *A Governor's Hand*.
- **By region:** countries bordering a Dead Lands country (`check zin_shared_borders_dead_lands`) get *Watch on the South*; countries bordering a Magical Lands country (`check zin_shared_borders_magical_lands`) get *The Wall Road*.
- **By people:** countries with the Middle Kingdom tradition get *Children of the Restoration*; countries whose primary or minor people include giants or ents get *The Old Kin* (no tier C country at the start; it serves owner-assigned minor peoples and released countries).

`allow_branch` sits on each branch's first focus. Text uses `[ROOT.GetName]` and `[ROOT.GetAdjective]`, never a country name.

### Rules

- **Peace.** Dominions cannot declare war (chartered autonomy). Free lands get no war goal from this tree. *The Dark Comes* and *The Thirty Days* open only from story flags.
- **The secret.** No text names Afrit or the Hidden Council. The Houses branch speaks of "the Deliverer's almoners" and "the Houses of the First Light".
- **Eindil.** Focus text says "the Heir" or "the Stranger"; never "Eindil".

### Notation

As in [../regional/middle_lands.md](../regional/middle_lands.md#effect-notation): `pp`, `stab`, `ws`, `army_xp`, `navy_xp`, `mp`; `spirit`, `swap`, `remove`, `timed`; `bld type n @where`; `res [cat] 0.5 ×n`; `eq n`; `loyalty(v)`, `petition(c)`, `camp(c, v)`, `lost_cause(v)`, `footholds(v)`, `regard(v)`, `coalition`; Story and End availability. `allow:` marks a branch's `allow_branch` conditions.

### Layout

| Br. | Branch | Columns | Rows | Opens | Focuses |
| --- | --- | --- | --- | --- | ---: |
| — | Root | 14 | 0 | start | 1 |
| A | Under the Charter | 0–4 | 1–4 | allow: Concord dominion | 9 |
| B | Fields and Markets | 6–8 | 1–5 | all | 7 |
| C | Arms of the Dominion | 10–12 | 1–5 | all | 7 |
| D | Harbours | 14–16 | 1–4 | allow: coast | 5 |
| E | Councils and Moots | 17–21 | 1–3 | allow: by ideology | 8 |
| F | The Free March | 23–25 | 1–4 | allow: not a subject | 6 |
| G | Marches and Roads | 27–29 | 1–3 | allow: by region | 6 |
| H | Peoples of the Charter | 1–3 | 6–7 | allow: by people | 4 |
| I | The Thirty Days | 6–10 | 7–8 | `zin_golden_king_dead` | 4 |
| J | The Houses | 12 | 7–8 | start | 2 |
| K | The Dark Comes | 16–20 | 6–9 | Story | 7 |

### Focuses

| Br. | Key | Name | Prerequisites | Excl. | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | --- | ---: | --- | --- |
| — | `charter_of_the_dominion` | **The Charter of [ROOT.GetName]** | — | — | 14,0 | 35 | pp 50; stab 0.02 | 100 |
| A | `seat_at_the_concord_council` | **A Seat at the Concord Council** | charter_of_the_dominion | — | 2,1 | 35 | allow: `check zin_aenor_is_concord_dominion`. loyalty(3); pp 25 | 40 |
| A | `the_charter_read_aloud` | The Charter Read Aloud | seat_at_the_concord_council | — | 0,2 | 35 | stab 0.03; loyalty(2) | 30 |
| A | `petition_for_a_free_charter` | Petition for a Free Charter | seat_at_the_concord_council | privileges_bought_in_parim | 2,2 | 35 | Avail: no charter petition in the last 180 days. petition(free) | 10; hist 0; ×3 if loyalty < 40 |
| A | `privileges_bought_in_parim` | Privileges Bought in Parim | seat_at_the_concord_council | petition_for_a_free_charter | 4,2 | 35 | Avail: `check zin_aenor_king_alive`; not `has_idea zin_concord_charter_golden`. petition(golden) | 10; hist 20 if Aenor's `zin_court_corruption` ≥ 60 |
| A | `concord_levy_answered` | The Concord Levy Answered | the_charter_read_aloud | — | 1,3 | 70 | army_xp 10; mp −1000; loyalty(5); lost_cause(2) | 30 |
| A | `the_kings_highway` | The King's Highway | petition_for_a_free_charter / privileges_bought_in_parim | — | 3,3 | 70 | bld infrastructure 1 @random_owned ×2; loyalty(2) | 30 |
| A | `banners_of_the_lost_cause` | Banners of the Lost Cause | concord_levy_answered | — | 0,4 | 70 | lost_cause(5); spirit `league_banners` | 20 |
| A | `charter_loyalists` | **Charter Loyalists** | concord_levy_answered / the_kings_highway | — | 2,4 | 70 | loyalty(5); spirit `charter_loyalists` | 30; hist 50 |
| A | `a_shield_for_the_concord` | A Shield for the Concord | the_kings_highway | — | 4,4 | 70 | Avail: `zin_lost_cause_shield`. petition(shield); spirit `concord_shield_drill` | 60 once available |
| B | `home_fields` | **The Fields of [ROOT.GetName]** | charter_of_the_dominion | — | 7,1 | 70 | bld infrastructure 1 @capital; stab 0.02 | 40 |
| B | `market_charter` | Market Charter | home_fields | — | 6,2 | 70 | bld industrial_complex 1 @capital | 30 |
| B | `granaries` | The Granaries | home_fields | — | 8,2 | 35 | spirit `full_granaries` | 30 |
| B | `roads_to_the_lake` | Roads to the Great Lake | market_charter | — | 6,3 | 70 | bld infrastructure 1 @random_owned ×2 | 20 |
| B | `guild_workshops` | Guild Workshops | granaries | — | 8,3 | 70 | bld industrial_complex 1 @random_owned | 20 |
| B | `smithies` | The Smithies | roads_to_the_lake / guild_workshops | — | 7,4 | 70 | bld arms_factory 1 @capital; res [zin_cat_arms] 0.5 ×1 | 20 |
| B | `a_prosperous_land` | A Prosperous [ROOT.GetAdjective] Land | smithies | — | 7,5 | 70 | spirit `prosperous_land` | 20 |
| C | `the_dominion_guard` | **The [ROOT.GetAdjective] Guard** | charter_of_the_dominion | — | 11,1 | 70 | army_xp 10; res [zin_cat_arms] 0.5 ×1 | 20 |
| C | `wardens_of_the_roads` | Wardens of the Roads | the_dominion_guard | — | 10,2 | 35 | spirit `road_wardens` | 15 |
| C | `bowmen_of_the_villages` | Bowmen of the Villages | the_dominion_guard | — | 12,2 | 70 | mp 1000; res [zin_cat_bows] 0.5 ×1 | 15 |
| C | `stone_forts` | Stone Forts | wardens_of_the_roads | — | 10,3 | 70 | bld bunker 1 @capital; bld bunker 1 @random_owned | 15 |
| C | `levies_trained` | Levies Trained | bowmen_of_the_villages | — | 12,3 | 70 | spirit `trained_levies` | 15 |
| C | `horse_and_lance` | Horse and Lance | stone_forts / levies_trained | — | 11,4 | 70 | army_xp 10; res [zin_cat_mounts] 0.5 ×1 | 15 |
| C | `the_dominion_host` | The Dominion Host | horse_and_lance | — | 11,5 | 70 | mp 2000; spirit `dominion_host` | 15; ×3 once `zin_gathering_dark` ≥ 40 |
| D | `harbour_works` | **Harbour Works** | charter_of_the_dominion | — | 15,1 | 70 | allow: `check zin_shared_has_coast`. bld naval_base 1 @random_coastal; bld dockyard 1 @random_coastal | 30 |
| D | `fishing_fleets` | Fishing Fleets | harbour_works | — | 14,2 | 35 | spirit `fishing_fleets` | 20 |
| D | `coastal_watch` | Coastal Watch | harbour_works | — | 16,2 | 70 | bld coastal_bunker 1 @random_coastal | 15 |
| D | `ships_for_the_concord` | Ships for the Concord | fishing_fleets / coastal_watch | — | 15,3 | 70 | navy_xp 10; res [zin_cat_galleys] 0.5 ×1 | 15 |
| D | `the_ocean_route` | The Ocean Route | ships_for_the_concord | — | 15,4 | 70 | spirit `ocean_route` | 20 |
| E | `the_free_council` | **The Free Council** | charter_of_the_dominion | — | 17,1 | 35 | allow: ideology `light`. spirit `free_council` | 40 |
| E | `elected_magistrates` | Elected Magistrates | the_free_council | — | 17,2 | 70 | pp 50; stab 0.03 | 30 |
| E | `council_of_the_lake_towns` | Council of the Lake Towns | elected_magistrates | — | 17,3 | 70 | swap free_council→free_council_2 | 30 |
| E | `the_lords_moot` | **The Lords' Moot** | charter_of_the_dominion | — | 19,1 | 35 | allow: ideology `wild`. spirit `lords_moot` | 40 |
| E | `old_customs` | Old Customs | the_lords_moot | — | 19,2 | 70 | stab 0.03; ws 0.02 | 30 |
| E | `the_moot_agrees` | The Moot Agrees | old_customs | — | 19,3 | 70 | swap lords_moot→lords_moot_2 | 30 |
| E | `a_governors_hand` | A Governor's Hand | charter_of_the_dominion | — | 21,1 | 35 | allow: ideology `dominion`. pp 75; stab −0.02 | 40 |
| E | `the_governors_men` | The Governor's Men | a_governors_hand | — | 21,2 | 70 | spirit `governors_men` | 30 |
| F | `a_free_land` | **A Free Land** | charter_of_the_dominion | — | 24,1 | 35 | allow: not `is_subject`. pp 50; spirit `free_land` | 60 |
| F | `ask_for_a_charter` | Ask Parim for a Charter | a_free_land | free_and_apart | 23,2 | 35 | Avail: not flag `zin_aenor_free_dominion`; an Aenor realm exists that is not ruled by the Faithful (`check zin_aenor_ruled_by_faithful` false). `call zin_concord_ask_for_charter` | 10; hist 0 |
| F | `free_and_apart` | Free and Apart | a_free_land | ask_for_a_charter | 25,2 | 35 | swap free_land→free_land_2 | 40; hist 100 |
| F | `join_the_free_dominions` | Join the Free Dominions | ask_for_a_charter / free_and_apart | — | 23,3 | 35 | Avail: `check zin_aenor_free_dominions_exist`; ROOT in no faction. `call zin_concord_join_free_dominions` | 60 if flag `zin_aenor_free_dominion`; else 10 |
| F | `march_walls` | March Walls | free_and_apart | — | 25,3 | 70 | bld bunker 2 @capital | 20 |
| F | `free_banners` | Free Banners | join_the_free_dominions / march_walls | — | 24,4 | 70 | Avail: Story. army_xp 15; ws 0.05 | 100 once available |
| G | `watch_on_the_south` | **Watch on the South** | charter_of_the_dominion | — | 27,1 | 35 | allow: `check zin_shared_borders_dead_lands`. spirit `southern_watch` | 30 |
| G | `southern_forts` | Southern Forts | watch_on_the_south | — | 27,2 | 70 | bld bunker 1 @random_owned ×2 | 20; ×3 after `zin_mirolon_fallen` |
| G | `heed_mirolon` | Heed Mirolon | southern_forts | — | 27,3 | 35 | Avail: exists Mirolon. lost_cause(3); `for_country Mirolon: call zin_mirolon_add_proof {value: 2}` | 20; hist 10 |
| G | `the_wall_road` | **The Wall Road** | charter_of_the_dominion | — | 29,1 | 35 | allow: `check zin_shared_borders_magical_lands`. spirit `wall_road_trade`; `call zin_elves_add_wall_grievance {value: -3}` | 30 |
| G | `elven_markets` | Elven Markets | the_wall_road | — | 29,2 | 70 | bld industrial_complex 1 @capital | 20 |
| G | `garrison_the_wall` | Garrison the Wall | elven_markets | — | 29,3 | 70 | bld bunker 1 @great_wall (falls back to @capital when ROOT owns no wall state) | 15 |
| H | `children_of_the_restoration` | **Children of the Restoration** | charter_of_the_dominion | — | 1,6 | 35 | allow: flag `zin_tradition_middle_kingdom`. pp 25; stab 0.03 | 30 |
| H | `middle_kingdom_levies` | Middle Kingdom Levies | children_of_the_restoration | — | 1,7 | 70 | mp 2000; res [zin_cat_arms] 0.5 ×1 | 20 |
| H | `the_old_kin_of_the_land` | The Old Kin of the Land | charter_of_the_dominion | — | 3,6 | 70 | allow: `check zin_people_includes_giants` or `check zin_people_includes_ents`. army_xp 10; res [zin_cat_kin] 0.5 ×2 | 40 |
| H | `the_kin_stand_with_us` | The Kin Stand with Us | the_old_kin_of_the_land | — | 3,7 | 70 | spirit `old_kin` | 30 |
| I | `the_golden_king_is_dead` | **The Golden King Is Dead** | — | — | 8,7 | 35 | Avail: `zin_golden_king_dead`; Concord dominion or flag `zin_aenor_free_dominion`. stab 0.02; pp 25 | 100 |
| I | `for_order_and_the_crown` | For Order and the Crown | the_golden_king_is_dead | for_the_free_dominions, for_the_strangers_host | 6,8 | 35 | Avail: Concord dominion. loyalty(8) | hist 100; else 40 + loyalty ÷ 2 |
| I | `for_the_free_dominions` | For the Free Dominions | the_golden_king_is_dead | for_order_and_the_crown, for_the_strangers_host | 8,8 | 35 | camp(dominions, 5); loyalty(−5) | hist 0; else 100 − loyalty |
| I | `for_the_strangers_host` | For the Stranger's Host | the_golden_king_is_dead | for_order_and_the_crown, for_the_free_dominions | 10,8 | 35 | Avail: `check zin_aenor_host_available`. camp(host, 5); regard(10) | 50 + regard ÷ 2 |
| J | `temples_and_almshouses` | Temples and Almshouses | charter_of_the_dominion | — | 12,7 | 35 | stab 0.03; footholds(1) | 20; hist 40 |
| J | `a_watchful_court` | A Watchful Court | temples_and_almshouses | — | 12,8 | 35 | Avail: `zin_afrit_revealed`, or ROOT has `zin_afrit_suspicious`. spirit `houses_watched` | 100 once available |
| K | `the_dark_comes` | **The Dark Comes** | — | — | 18,6 | 35 | Avail: Story. ws 0.10; spirit `the_dark_comes` | 100 |
| K | `answer_the_muster` | Answer the Muster | the_dark_comes | — | 16,7 | 35 | Avail: Concord dominion or flag `zin_lost_cause_member`. army_xp 10; lost_cause(3) | 80 |
| K | `fortify_the_homeland` | Fortify the Homeland | the_dark_comes | — | 18,7 | 70 | bld bunker 2 @capital; mp 2000 | 80 |
| K | `refugees_on_the_roads` | Refugees on the Roads | the_dark_comes | — | 20,7 | 35 | event `refugees` | 60 |
| K | `against_the_deathless` | Against the Deathless | answer_the_muster / fortify_the_homeland | — | 16,8 | 70 | Avail: `zin_zol_rising`. army_xp 10; tooltip "Ordinary arms break Zol's dead; they do not end them." | 80 |
| K | `stand_with_the_heir` | Stand with the Heir | fortify_the_homeland / refugees_on_the_roads | — | 18,8 | 70 | Avail: `zin_eindil_returned`. coalition (if ROOT is not already in his war); regard(10) | 100 if regard ≥ 0 or ROOT's overlord is ruled by the Host |
| K | `after_the_last_crowns` | After the Last Crowns | against_the_deathless / stand_with_the_heir | — | 18,9 | 70 | Avail: End. pp 75; stab 0.10; remove `the_dark_comes` | 100 |

**Total: 66 focuses.** Only branches whose `allow_branch` holds are shown, so a coastal Wild dominion on the southern marches sees about 50; landlocked Fotan about 40.

### Spirits

| Key | Name | Modifiers | Added / removed |
| --- | --- | --- | --- |
| `league_banners` | Banners of the Lost Cause | `war_support_factor` 0.03, `political_power_gain` 0.05 | permanent |
| `charter_loyalists` | Charter Loyalists | `stability_factor` 0.05, `drift_defence_factor` 0.10 | removed if ROOT secedes |
| `concord_shield_drill` | A Shield for the Concord | `training_time_factor` −0.05, `army_org_factor` 0.03 | permanent |
| `full_granaries` | The Granaries | `stability_factor` 0.03, `monthly_population` 0.05 | permanent |
| `prosperous_land` | A Prosperous Land | `production_factory_max_efficiency_factor` 0.05, `production_speed_buildings_factor` 0.05 | permanent |
| `road_wardens` | Wardens of the Roads | `army_core_defence_factor` 0.05 | permanent |
| `trained_levies` | Levies Trained | `training_time_factor` −0.10 | permanent |
| `dominion_host` | The Dominion Host | `army_org_factor` 0.05, `conscription_factor` 0.05 | permanent |
| `fishing_fleets` | Fishing Fleets | `monthly_population` 0.05, `consumer_goods_factor` −0.01 | permanent |
| `ocean_route` | The Ocean Route | `trade_opinion_factor` 0.10, `naval_speed_factor` 0.05 | permanent |
| `free_council` | The Free Council | `stability_factor` 0.05, `political_power_factor` 0.05 | swapped |
| `free_council_2` | Council of the Lake Towns | `stability_factor` 0.08, `political_power_factor` 0.10, `opinion_gain_monthly_factor` 0.10 | permanent |
| `lords_moot` | The Lords' Moot | `stability_factor` 0.03, `political_power_gain` 0.10 | swapped |
| `lords_moot_2` | The Moot Agrees | `stability_factor` 0.05, `political_power_gain` 0.15, `drift_defence_factor` 0.10 | permanent |
| `governors_men` | The Governor's Men | `political_power_factor` 0.10, `stability_factor` −0.03 | permanent |
| `free_land` | A Free Land | `stability_factor` 0.05, `war_support_factor` 0.03 | swapped |
| `free_land_2` | Free and Apart | `stability_factor` 0.08, `drift_defence_factor` 0.20, `war_support_factor` 0.05 | permanent |
| `southern_watch` | Watch on the South | `army_intel_factor` 0.10, `dig_in_speed_factor` 0.10 | permanent |
| `wall_road_trade` | The Wall Road | `trade_opinion_factor` 0.10 | permanent |
| `old_kin` | The Kin Stand with Us | `army_armor_attack_factor` 0.10, `army_defence_factor` 0.05 | permanent |
| `houses_watched` | A Watchful Court | `drift_defence_factor` 0.20 | permanent |
| `the_dark_comes` | The Dark Comes | `army_core_defence_factor` 0.10, `war_support_factor` 0.05 | until *After the Last Crowns* |

### Events (namespace `zin_shared_concord_dominions`)

All are fired by effects. `FROM` is the dominion; the overlord is the Aenor realm it serves.

| Key (id) | Title | To | Fired by | Options |
| --- | --- | --- | --- | --- |
| `charter_petition` (1) | A Petition from [FROM.GetName] | the overlord | `zin_concord_petition_charter` | **Grant the charter** (shown when the asked charter is allowed: Free needs the overlord's flag `zin_aenor_free_charters_open` or Dominions or Host rule; Shield needs `zin_lost_cause_shield`; Golden needs `zin_aenor_golden_charters_open`): `zin_aenor_set_charter` on FROM with the asked charter; FROM loyalty +10 (+3 for Golden); for Golden the overlord gains pp 50 and `zin_aenor_add_court_corruption` +2. **Confirm the old charter** (always): FROM loyalty +3; overlord pp −10. **Refuse** (always): FROM loyalty −8; overlord pp 10. AI: while the Golden King lives, Grant 40 for Golden and 10 otherwise, Refuse 50; under the Dominions or Host, Grant 80; under the Faithful, Confirm 60 |
| `charter_answer` (2) | Parim Answers | FROM | after 1 | Result text; one option |
| `a_land_asks_for_a_charter` (3) | [FROM.GetName] Asks for a Charter | the Aenor realm holding Parim | `zin_concord_ask_for_charter` | **Grant the Charters of Parim** (FROM becomes a subject with autonomy `zin_autonomy_chartered_dominion`, joins the Concord faction, gets `zin_concord_charter_old` and loyalty 60; AI 70) / **Parim has dominions enough** (AI 30) |
| `houses_ask_for_land` (4) | The Almoners Ask for Land | ROOT | *Temples and Almshouses* (only if footholds did not rise this year) | Flavour of the focus; **Grant it** / **Politely refuse** (footholds(−1)) |
| `refugees` (5) | Refugees on the Roads | ROOT | *Refugees on the Roads* | **Open the gates** (mp 2000; stab −0.02; if `zin_eindil_awake`: regard(5); AI 60) / **Close the roads** (stab 0.02) |

`charter_petition` respects the Aenor mechanic's 180-day reissue cooldown: if the dominion's charter changed in the last 180 days, only *Confirm* and *Refuse* show.

### Helper scripts (defined by this tree, used by the Middle Lands tier B trees)

File `common/scripted_effects/zin_shared_concord_dominions.txt` and `common/scripted_triggers/zin_shared_concord_dominions.txt`.

| Name | Kind | Arguments | Does |
| --- | --- | --- | --- |
| `zin_concord_add_own_loyalty` | scripted effect | `value` | If ROOT satisfies `zin_aenor_is_concord_dominion`: `zin_aenor_add_concord_loyalty = { value = $value$ }` on ROOT; otherwise nothing |
| `zin_concord_petition_charter` | scripted effect | `charter` (`free`, `shield`, `golden`, `old`) | If ROOT is a Concord dominion: sets temp `zin_concord_petition` on ROOT and fires `zin_shared_concord_dominions.1` to the overlord |
| `zin_concord_back_camp` | scripted effect | `camp` (`court`, `faithful`, `dominions`, `host`), `value` | If `zin_golden_king_dead` and not `zin_eindil_crowned`: in ROOT's overlord if it satisfies `zin_aenor_is_realm`, else in the Aenor realm holding Parim, call `zin_aenor_add_camp_support = { camp = $camp$ value = $value$ }`. Before the King's death it does nothing (the mechanic computes support afresh at his death) |
| `zin_concord_ask_for_charter` | scripted effect | — | Fires `zin_shared_concord_dominions.3` to the Aenor realm holding Parim (`zin_is_site_parim`), or to the original Aenor if it holds no Parim |
| `zin_concord_join_free_dominions` | scripted effect | — | ROOT joins the faction led by the country with `zin_aenor_free_dominion` that leads a faction (the Aenor spec's Free Dominions) |
| `zin_shared_has_coast` | scripted trigger | — | `any_owned_state = { is_coastal = yes }` |
| `zin_shared_is_island_realm` | scripted trigger | — | `capital_scope = { is_island_state = yes }` |
| `zin_shared_borders_<region>` | scripted trigger family | — | `any_neighbor_country = { has_country_flag = zin_region_<region> }`; generated for `dead_lands`, `magical_lands`, `dark_lands` (and any other region a shared tree asks for) |

The `zin_shared_*` triggers are generic: if another shared-tree spec defines the same names, the builder keeps one definition in `common/scripted_triggers/zin_shared_trees.txt`.

## Implementation

| Path | What |
| --- | --- |
| `docs/design/focus/shared_concord_dominions.json` | Tree data; `"tier": "shared"`, the eighteen countries |
| `common/national_focus/zin_shared_concord_dominions.txt` | Compiled tree; one `focus_tree` with the eighteen countries in `country` |
| `common/ideas/zin_focus_shared_concord_dominions.txt` | Spirits |
| `events/zin_shared_concord_dominions.txt` | Events 1–5 |
| `common/scripted_effects/…`, `common/scripted_triggers/…` | Helper scripts above |
| `localisation/english/zin_focus_shared_concord_dominions_l_english.yml` | Text with `[ROOT.GetName]`, `[ROOT.GetAdjective]`, `[FROM.GetName]` |

Compiler needs (see open questions): `allow_branch` with `ideology`, `flag`, `check` and `not is_subject`; `for_country` with the scope keywords `FROM` and `OVERLORD`; `event_for` with `OVERLORD`.

**Advisors.** Each country keeps three generated political advisors from the Middle Lands name pool (politics spec), one of each trait that fits its stance: Wild realms `zin_adv_road_warden`, `zin_adv_muster_master`, `zin_adv_merchant_prince`; Safeton `zin_adv_merchant_prince`, `zin_adv_envoy`, `zin_adv_sage`.

**Icons** (catalog keys): `charter_old`, `charter_free`, `charter_golden`, `charter_shield`, `concord_circle`, `banner_league`, `farm_sowing`, `market_stalls`, `granary`, `roads_paved`, `guild_hall`, `forge_anvil`, `sword_shield`, `bow_archers`, `fort_wall`, `spear_levy`, `horse_cavalry`, `harbour_lake`, `fishing_boats`, `lighthouse`, `galley_oars`, `sea_charts`, `council_table`, `seal_royal`, `scroll_treaty`, `banner_plain`, `chain_broken`, `pass_fort`, `eye_watchful`, `caravan`, `giant_hammer`, `ent_branch`, `heir_rolls`, `empty_throne`, `house_first_light`, `generic_war`. Event pictures: `generic_court`, `concord_council`, `houses`, `generic_war`.

## AI

- **Historical:** root; B and A in the first two years (seat, read aloud, levy, highway, loyalists); E by ideology; D for coastal realms; C from 1750; J *Temples and Almshouses* (40). At the King's death *For Order and the Crown*. K whenever available; *Stand with the Heir* in 4A 1757 for every dominion not already fighting beside him.
- **Petitions:** never under the historical rule; otherwise only when loyalty < 40.
- **Free lands:** Fotan takes *Free and Apart* (historical) and never asks for a charter under the historical rule. A seceded dominion takes *Join the Free Dominions* at once.

## Acceptance

1. The compiler builds the tree with 66 focuses, unique positions, every focus below its prerequisites, symmetric exclusions and no `raw` blocks; every one of the eighteen countries maps to it (coverage check).
2. Safeton sees *The Free Council*, not *The Lords' Moot*; Fotan sees *The Free March* and not *Under the Charter*; a landlocked dominion does not see *Harbours*.
3. On 1 Thaw 4A 1748 no available focus declares war, makes a claim or a war goal; *The Thirty Days* and *The Dark Comes* are unavailable.
4. A scripted test: a dominion takes *Petition for a Free Charter* while the Golden King lives with AI Aenor; Aenor receives `charter_petition` and the dominion's loyalty and charter change as the chosen option says; within 180 days a second petition shows only *Confirm* and *Refuse*.
5. `zin_concord_back_camp` does nothing before `zin_golden_king_dead` and adds to the right camp afterwards.
6. Every modifier in the spirit table exists in the game's modifier documentation; the secret scan finds no "Afrit" and no "Eindil" in this tree's text.
7. Historical observer run: no dominion of this tree secedes before `zin_golden_king_dead`, and at most one does at the King's death (the Aenor mechanic decides).

## Open questions

1. **Compiler support.** May `allow_branch` take `ideology`, `flag`, `check` and `not is_subject`, and may `for_country` and `event_for` take `FROM` and `OVERLORD`? Shared trees need both.
2. **Fotan.** It is outside the Concord in the Aenor spec and has no overlord. Is it a free land by choice (as here), or should it have a story of its own?
3. **Safeton's ocean route.** The roster calls Safeton the guardian of "the peaceful ocean route". Is that the drawn Ocean of Peace south-west of the Middle Lands?
4. **Names of tier C rulers.** Rulers keep their generated names until the owner replaces them. Should Belurithon and Vothrim, which share names with the proposed characters Tarec Belurith and Ilsabet Vothrim, be their houses' seats?
