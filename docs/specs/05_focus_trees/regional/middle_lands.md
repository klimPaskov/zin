# Middle Lands regional focus trees

**Status:** Ready. Reviewed 19 October 2026 against CONVENTIONS "Status"; integrated 19 October 2026. **Priority:** 6. **Phase:** 6 (tier B). Selen's branch E may be built early in Phase 5, because Eindil's journey reads its flags.

## Purpose

This spec gives each of the eleven tier B countries of the Middle Lands and Aenor Isle its own focus tree: Selen, Noleksun, Herez, Konori, Kilinti, Kingson, Hunhun, Hiloron, Bloody Forest, Cursed Lands and Asgard. Eight of them are chartered dominions of Aenor; two (Bloody Forest, Cursed Lands) reject the crown. Their trees make the Concord feel like many peoples under one charter, and connect each of them to the mechanics that carry the story:

- the Concord charters and `zin_concord_loyalty` ([Aenor's court and succession](../../04_mechanics/aenor_court_and_succession.md));
- the Lost Cause's frontier companies and the four-camp succession (same spec);
- the Deliverer's Houses and `zin_footholds` ([Afrit's Hidden Council](../../04_mechanics/afrit_hidden_council.md));
- Eindil's stage 8 in Selen and his coalition ([Eindil's journey](../../04_mechanics/eindil_journey.md));
- Volgan's march and Mirolon's warnings ([Volgan](../../04_mechanics/volgan_southern_dominion.md), [Mirolon tree](../major/mirolon.md));
- the Great Wall, its customs and the elves ([elves, the Wall and dragons](../../04_mechanics/elves_wall_and_dragons.md));
- the Western Crossing's landing on Aenor Isle ([Western Crossing](../../04_mechanics/western_crossing.md));
- Zol's dead, the Gathering Dark and the War of the Last Crowns ([world tension](../../03_gameplay/05_world_tension_and_endings.md)).

The eighteen tier C countries of the region use [../shared/shared_concord_dominions.md](../shared/shared_concord_dominions.md), which also defines the helper effects these trees call.

## Lore basis

**Established** (vault): Aenor leads 26 satellites in the Middle Kingdom Concord, among them Selen, Kilinti, Kingson, Hiloron, Konori, Hunhun, Asgard and Herez; the Cursed Lands and Bloody Forest resist the crown (working table). Selen is the land of rangers; Alleria of Selen is a ranger and archer who helps Eindil at the palace. Kilinti's people are ents (and forest peoples); Hiloron's are giants; the riders of Hunhun are a regional tradition of men; the Aenor Isle houses are a people of men; Asgard lies on Aenor Isle. The Great Wall of Aenor runs from the Organ Mountains past Lunhrim and around Kingson. Some men believe Eindil's warnings, "especially frontier troops, scholars of the First Men and branches of the Lost Cause"; Alleria investigates and protects him. "Men of Selen" join his temporary coalition. Volgan retakes Mirolon and moves north; Zol's dead come through islands and straits; western rulers seize the capital. The start: the Golden King reigns, Eindil has not appeared, Afrit is unrevealed, Erdae seems at peace.

**Proposed in the vault, used here:** the Charters of Parim (4A 3); Harion of Selen, the first restored king; the Wall Accord (4A 96); the universities of Parim and Selen (4A 340); Hiloron's memory of Dardan's crossings; Asgard as the first port Aenoran ships reached; Mirolon's warning of 4A 1736; Alleria's earlier role (she investigates, shelters and recovers him).

**Proposed here:** every focus, spirit, event, character, number and route below; the Eight Towns of Noleksun; the Hundreds of Konori; the Great Moot of Kilinti; the four houses of Aenor Isle; the barrows of the Cursed Lands; the Redbark tribes; every leader and advisor named in the court tables (rulers come from [02_characters.md](../../02_lore/02_characters.md)).

**Kept open** (no text answers these): who the Cursed Lands' people are and what their curse is; whether Huhun and Hunhun are one place (text uses only "Hunhun"); the rank and mortality of ents and giants; Dardan's location; whether Selen's tie to Aenor survives the war; whether the Lost Cause formally survives; which dominions follow which camp in history.

## Design

### Rules for every tree in this file

1. **Peace at the start.** On 1 Thaw 4A 1748 every available focus is about courts, charters, fields, roads, forts, herds, envoys or watching. Concord dominions cannot declare war (autonomy `zin_autonomy_chartered_dominion`). The two free enclaves get no war goal before a story flag. War branches open only from story flags (`zin_golden_king_dead`, `zin_war_of_last_crowns`, `zin_volgan_marches`, `zin_zol_rising`, `zin_western_crossing`, `zin_eastern_invasion`, `zin_eindil_returned`) or from being at war.
2. **The secret.** No focus, spirit or event text names Afrit, calls the Deliverer a demon or names the Hidden Council. Text that differs after the reveal uses `zin_afrit_secret_kept`. The Houses of the First Light, the temples and "the Deliverer's almoners" are safe words.
3. **Eindil.** Focus names and descriptions are visible to everyone from the first day, so they never contain "Eindil". They say "the Stranger" or "the Heir"; descriptions that must name him use `[zin_loc_eindil]`. Event text may name him only in events that cannot fire before `zin_eindil_named`.
4. **Open questions stay open.** No text gives the Golden King's name or kin, Merovan's fate, Volgan's spiritual fate, who administers Zol's Mistake, or what the Cursed Lands hide.
5. **Dominion and free.** Branches that use the charter mechanic carry `check zin_aenor_is_concord_dominion` in `available`, so a dominion that secedes keeps its tree but loses those focuses; the trees offer a free road for that case.

### Effect notation

The compiler vocabulary of [../00_format_and_compiler.md](../00_format_and_compiler.md), abbreviated:

| Shorthand | Means |
| --- | --- |
| `pp 50`, `stab 0.03`, `ws 0.05`, `army_xp 10`, `navy_xp 10`, `mp 2000` | political power, stability, war support, experience, manpower |
| `spirit k`, `swap k1→k2`, `remove k`, `timed k 365` | tree spirits (compile to `zin_regional_<name>_<k>`); full `zin_…` ids are mechanic ideas |
| `bld type n @where` | `building`; `where` is `capital`, `random_owned`, `random_coastal` or a site key (`great_wall`); "×2" repeats it |
| `res [cat] 0.5 ×n` | `research` bonus on the warfare spec's categories (`zin_cat_*`) or vanilla `industry`, `construction_tech` |
| `eq n` | `equipment` `zin_arms_equipment` n (the warfare spec's arms) |
| `loyalty(v)` | `call zin_concord_add_own_loyalty {value: v}`: adds to ROOT's `zin_concord_loyalty` only while ROOT is a Concord dominion |
| `petition(c)` | `call zin_concord_petition_charter {charter: c}`: fires the charter petition to the overlord (shared spec) |
| `camp(c, v)` | `call zin_concord_back_camp {camp: c, value: v}`: adds to a succession camp in the ruling Aenor realm; does nothing before `zin_golden_king_dead` |
| `lost_cause(v)` | `call zin_lost_cause_add_strength {value: v}` |
| `footholds(v)` | `call zin_afrit_add_footholds {value: v}` on ROOT |
| `regard(v)`, `renown(v)` | `call zin_eindil_add_regard {value: v}` (on ROOT), `call zin_eindil_add_renown {value: v}` |
| `coalition` | `call zin_eindil_join_coalition` |
| `gd(v)` | `call zin_world_add_gathering_dark {value: v}` |
| `grievance(v)` | `call zin_elves_add_wall_grievance {value: v}` |
| `event k`, `event_for X k` | this tree's event `k` |
| `Story` | `available`: any of `zin_war_of_last_crowns`, `zin_volgan_marches`, `zin_zol_rising`, `zin_western_crossing`, `zin_eastern_invasion`, or `at_war` |
| `End` | `available`: any of `zin_eindil_crowned`, `zin_afrit_dead`, or (not `at_war` and after `1758.3.1`) |

Prerequisites: `a + b` means a and b; `a / b` means a or b; brackets group; every name is a focus key of the same tree. "Excl." lists mutually exclusive focuses, on both sides. **Bold** names mark the key focuses of each tree. Days are 35 or 70. Positions are `x,y`; branches occupy the columns given. The Icon column names a key of the [icon catalog](../02_icon_catalog.md) (sprite `GFX_focus_zin_<key>`); a spirit uses the icon of the first focus that adds it; the Picture column names an event picture key (`GFX_zin_evt_<key>`, standard crop). "Concord dominion" in `available` is `check zin_aenor_is_concord_dominion`; "hist 0" and "hist ×f" are AI modifiers while `check zin_rules_is_historical` holds; `FREE` and `PLAUSIBLE` are values of the game rule `zin_rule_historical_path`.

### AI defaults for every tree

Unless a row says otherwise: base 10; economy and court focuses 20 in the first two years; story-gated focuses 100 once available; focuses marked "hist 0" get weight 0 under `zin_rules_is_historical`; mutually exclusive choices name the historical pick in the AI section. Before `zin_golden_king_dead` every AI strategy toward war stays at 0 (start AI plan of the [start situation](../../02_lore/01_start_situation.md)).

---

## 1. Selen

| Item | Value |
| --- | --- |
| Tree id | `regional_selen` (focus ids `zin_regional_selen_<key>`) |
| Country | Selen (Middle Lands; 7 states; men; Light, Warden Host; dominion of Aenor) |
| Focuses | 47; columns 0–21 |
| Events | namespace `zin_regional_selen` |
| Start values (owners' specs) | `zin_concord_loyalty` 45 (Old Charter); `zin_footholds` 1 |

### Situation in 4A 1748

Selen is the land of rangers on the Middle Lands' coast, seven states of farms, river mills and greenwood. Its wardens remember Harion the Restorer as Selen's son first and Aenor's king second, and every Thaw they keep the Restorer's Day (proposed). The University of Selen, founded beside Parim's in 4A 340 (proposed), keeps old genealogies nobody reads. Selen pays the Golden King's taxes, grumbles louder than any other dominion, and sends its best rangers to the Lost Cause's frontier companies, the one part of the league that is real. Its loyalty is restless, not rebellious. The temples are thin here: Selen's wardens trust what they can track.

### Role in the story

- **Historical path (proposed timing):** quiet petitions and taxes in 1748–1750; at the Golden King's death Selen keeps order and stays a dominion; in 1754 the Stranger comes ashore on Selen's coast and Alleria shelters him; Selen heeds the warning and swears to the Heir in 1755; in 1757 Selen raises the Host of Eindil (the journey's stage 9); in 1758 its rangers search the ravine; in 1759 Alleria is at the palace; after the coronation Selen drops the Host's name and stays a free realm bound by treaty, not crown.
- **War of the Last Crowns:** the frontier and scholarly heart of the resistance; the core of the Host; the first realm to refuse the court's denunciation.
- **Alternatives:** Selen leads the Free Dominions out of the Concord; or it hands the Stranger to the court; or it keeps the charter and fights for Parim's order.

### Ruler and court

| Id | Name | Role | Traits / skill |
| --- | --- | --- | --- |
| `<Selen>_zin_ruler` | First Warden Daeric Svenlor | Country leader (character spec) | `zin_trait_free_dominion` |
| `zin_alleria` | Alleria of Selen | Corps commander (contract) | skill 3; `ranger`, `ambusher` |
| `zin_regional_selen_morrade` | Provost Ellan Morrade | Political advisor | `zin_adv_sage` |
| `zin_regional_selen_fenwar` | Granary-Mistress Odile Fenwar | Political advisor | `zin_adv_treasurer` |
| `zin_regional_selen_talvery` | Ranger-Captain Joss Talvery | Political advisor | `zin_adv_muster_master` |
| `zin_regional_selen_vell` | Lord-Warden Hadrin Vell | Corps commander | skill 2; `career_officer`, `organizer` |

### Branches

| Br. | Branch | Columns | Opens | Focuses | Drives |
| --- | --- | --- | --- | ---: | --- |
| A | The Rangers of Selen | 0–4 | start | 8 | rangers, Alleria's company |
| B | Harion's Country | 5–9 | start | 8 | the Wardens' Moot, the university, petitions |
| C | Fields and Forges | 10–13 | start | 7 | economy |
| D | The Frontier Watch | 14–17 | start | 6 | Lost Cause strength, the Houses, the coast |
| E | The Stranger on the Shore | 18–21 | `zin_eindil_named` | 7 | regard, renown, the oath |
| F | The Thirty Days | 5–9 | `zin_golden_king_dead` | 5 | camp backing, secession |
| G | The Host of the Heir | 15–19 | Story or `zin_eindil_returned` | 6 | the Host, the ravine, the palace |

### Focuses

| Br. | Key | Name | Icon | Prerequisites | Excl. | x,y | Days | Effects |
| --- | --- | --- | --- | --- | --- | --- | ---: | --- |
| A | `rangers_of_selen` | **The Rangers of Selen** | `ranger_cloak` | — | — | 2,0 | 35 | army_xp 10; spirit `ranger_lodges` |
| A | `the_long_patrol` | The Long Patrol | `scout_lantern` | rangers_of_selen | — | 1,1 | 35 | army_xp 10; res [zin_cat_bows] 0.5 ×1 |
| A | `alleria_s_company` | **Alleria's Company** | `ranger_cloak` | rangers_of_selen | — | 3,1 | 70 | army_xp 15; `call zin_regional_selen_raise_rangers` (one ranger division, "The Greenwood Company", led by `zin_alleria` while Selen employs her) |
| A | `woodcraft_and_bow` | Woodcraft and Bow | `bow_archers` | the_long_patrol | — | 0,2 | 70 | res [zin_cat_bows] 0.5 ×2 |
| A | `lodges_on_every_road` | Lodges on Every Road | `roads_paved` | the_long_patrol / alleria_s_company | — | 2,2 | 70 | swap ranger_lodges→ranger_lodges_2 |
| A | `hunters_of_the_coast` | Hunters of the Coast | `lighthouse` | alleria_s_company | — | 4,2 | 35 | bld coastal_bunker 1 @random_coastal; event `ranger_reports` |
| A | `the_greenwood_ways` | The Greenwood Ways | `forest_ancient` | woodcraft_and_bow / lodges_on_every_road | — | 1,3 | 70 | spirit `greenwood_ways` |
| A | `warden_host` | The Warden Host | `levy_muster` | lodges_on_every_road + hunters_of_the_coast | — | 3,3 | 70 | mp 3000; spirit `warden_host` |
| B | `harions_country` | **Harion's Country** | `seal_royal` | — | — | 7,0 | 35 | pp 50; stab 0.03; spirit `the_restorers_land` |
| B | `the_wardens_moot` | The Wardens' Moot | `council_table` | harions_country | — | 6,1 | 70 | spirit `wardens_moot` |
| B | `university_of_selen` | The University of Selen | `university_hall` | harions_country | — | 8,1 | 70 | pp 25; spirit `university_of_selen` |
| B | `petition_for_the_old_liberties` | Petition for the Old Liberties | `charter_free` | the_wardens_moot | — | 5,2 | 35 | Avail: Concord dominion. petition(free) |
| B | `the_kings_taxes` | The King's Taxes | `ledger_coins` | the_wardens_moot | — | 7,2 | 70 | Avail: Concord dominion. event `the_kings_taxes` |
| B | `scholars_of_the_first_men` | **Scholars of the First Men** | `heir_rolls` | university_of_selen | — | 9,2 | 70 | pp 25; flag `zin_selen_genealogies`; lost_cause(3) |
| B | `voice_of_the_dominions` | A Voice for the Dominions | `banner_league` | the_wardens_moot + petition_for_the_old_liberties | — | 6,3 | 70 | spirit `first_among_dominions`; flag `zin_selen_voice_of_dominions` (proposed hook: +5 to the Dominions camp when the Aenor mechanic computes support) |
| B | `harions_heirs` | Harion's Heirs | `sceptre` | the_kings_taxes / scholars_of_the_first_men | — | 8,3 | 70 | stab 0.05; swap the_restorers_land→restorers_land_2 |
| C | `fields_and_forges` | Fields and Forges | `farm_sowing` | — | — | 11,0 | 70 | pp 25; bld industrial_complex 1 @capital |
| C | `granaries_of_selen` | The Granaries of Selen | `granary` | fields_and_forges | — | 10,1 | 70 | spirit `selen_granaries` |
| C | `river_mills` | River Mills | `timber_mill` | fields_and_forges | — | 12,1 | 70 | bld industrial_complex 1 @random_owned; bld infrastructure 1 @random_owned |
| C | `the_ploughmens_roads` | The Ploughmen's Roads | `roads_paved` | granaries_of_selen | — | 10,2 | 70 | bld infrastructure 1 @random_owned ×2 |
| C | `smithies_of_selen` | The Smithies of Selen | `forge_anvil` | river_mills | — | 12,2 | 70 | bld arms_factory 1 @capital; res [zin_cat_arms] 0.5 ×1 |
| C | `trade_with_the_lake` | Trade with the Great Lake | `harbour_lake` | the_ploughmens_roads / smithies_of_selen | — | 11,3 | 70 | spirit `lake_trade` |
| C | `armouries_of_selen` | The Armouries of Selen | `foundry_fire` | smithies_of_selen | — | 12,4 | 70 | bld arms_factory 2 @random_owned |
| D | `the_frontier_watch` | The Frontier Watch | `eye_watchful` | — | — | 15,0 | 35 | army_xp 5; lost_cause(3) |
| D | `companies_for_the_league` | Companies for the League | `banner_league` | the_frontier_watch | — | 14,1 | 70 | Avail: Concord dominion or flag `zin_lost_cause_member`. lost_cause(5); mp −1000; ws 0.02 |
| D | `eyes_on_the_south` | Eyes on the South | `scout_lantern` | the_frontier_watch | — | 16,1 | 35 | event `southern_rumours` |
| D | `count_the_almoners` | Count the Almoners | `house_first_light` | companies_for_the_league | — | 14,2 | 35 | Avail: flag `zin_selen_genealogies`, after 1749.3.1, `zin_footholds` ≥ 1. `call zin_regional_selen_suspect_houses` (country flag `zin_afrit_suspicious` for 730 days, which opens the world systems' *Close the Houses*; `zin_afrit_add_veil` −2). hist 0 |
| D | `the_coast_watch` | The Coast Watch | `beacon` | eyes_on_the_south | — | 16,2 | 70 | bld coastal_bunker 1 @random_coastal; bld naval_base 1 @random_coastal |
| D | `the_frontier_hub` | **The Frontier Hub** | `war_council_map` | companies_for_the_league + eyes_on_the_south | — | 15,3 | 70 | lost_cause(10); spirit `frontier_hub` |
| E | `rumours_of_an_heir` | Rumours of an Heir | `scroll_sealed` | — | — | 20,0 | 35 | Avail: `zin_eindil_named`. pp 25; regard(5); flag `zin_selen_heard_of_heir` |
| E | `alleria_investigates` | **Alleria Investigates** | `footprints_snow` | rumours_of_an_heir | — | 19,1 | 35 | Avail: global `zin_eindil_stage` above 7. regard(10); renown(3); event `alleria_reports` |
| E | `the_rangers_shelter` | The Rangers' Shelter | `ranger_cloak` | rumours_of_an_heir | — | 21,1 | 70 | Avail: `check zin_eindil_is_host`. regard(10); spirit `shelter_of_the_stranger` |
| E | `heed_the_warning` | Heed the Warning | `beacon` | alleria_investigates / the_rangers_shelter | — | 20,2 | 35 | Avail: `zin_eindil_stage` above 7. If not flag `zin_eindil_heeded`: flag `zin_eindil_heeded`, timed `zin_eindil_warning_heeded` 730; else ws 0.03. regard(10) |
| E | `proof_in_the_rolls` | **Proof in the Old Rolls** | `heir_rolls` | alleria_investigates + scholars_of_the_first_men | — | 18,3 | 70 | renown(5); camp(host, 10); flag `zin_selen_proof_of_blood`; `call zin_afrit_add_veil {value: -4}` |
| E | `keep_him_hidden` | Keep Him Hidden | `scout_lantern` | the_rangers_shelter | — | 21,3 | 35 | Avail: `check zin_eindil_is_host`. flag `zin_selen_hidden_paths` (proposed hook: the journey's discovery roll −10 %) |
| E | `oath_to_the_heir` | **An Oath to the Heir** | `lone_sword` | proof_in_the_rolls / heed_the_warning | — | 19,4 | 70 | Avail: after 1755.3.1; `check zin_eindil_friend`; global `zin_eindil_renown` ≥ 40. flag `zin_eindil_sworn`; regard(15) |
| F | `mourning_in_selen` | Mourning in Selen | `empty_throne` | — | — | 7,5 | 35 | Avail: `zin_golden_king_dead`. pp 50; stab 0.03 |
| F | `for_the_free_dominions` | For the Free Dominions | `chain_broken` | mourning_in_selen | for_order_in_parim, for_the_strangers_host | 5,6 | 35 | Avail: Concord dominion. camp(dominions, 10); loyalty(−5). hist 0 |
| F | `for_order_in_parim` | For Order in Parim | `palace_parim` | mourning_in_selen | for_the_free_dominions, for_the_strangers_host | 7,6 | 35 | loyalty(8); stab 0.03 |
| F | `for_the_strangers_host` | For the Stranger's Host | `lone_sword` | mourning_in_selen | for_the_free_dominions, for_order_in_parim | 9,6 | 35 | Avail: `check zin_aenor_host_available`. camp(host, 10); regard(10) |
| F | `break_the_charter` | Break the Charter | `chain_broken` | for_the_free_dominions | — | 5,7 | 35 | Avail: Concord dominion; `check zin_aenor_dominion_restless` or `check zin_aenor_dominion_defiant`; not at war. `call zin_aenor_secede_dominion` (Selen joins the Free Dominions). hist 0 |
| G | `selen_under_arms` | Selen Under Arms | `war_drums` | — | — | 17,6 | 35 | Avail: Story or `zin_eindil_returned`. ws 0.10; spirit `selen_under_arms` |
| G | `men_of_selen` | **The Men of Selen** | `banner_league` | selen_under_arms | — | 15,7 | 70 | Avail: `zin_eindil_returned`. If not `check zin_eindil_is_host`: coalition; `call zin_eindil_aid_host {manpower: 3000, equipment: 300}`. regard(10); remove `shelter_of_the_stranger` |
| G | `the_ravine_road` | The Ravine Road | `cliff_edge` | selen_under_arms | — | 17,7 | 35 | Avail: `zin_eindil_cast_down`, not `zin_afrit_dead`. army_xp 10; regard(10) |
| G | `the_old_service_passages` | The Old Service Passages | `scout_lantern` | selen_under_arms | — | 19,7 | 70 | Avail: `zin_eindil_cast_down`; Selen employs `zin_alleria`. flag `zin_selen_knows_the_passages` (proposed hook: the Host's *Find the Old Service Passages* takes 15 days, not 30) |
| G | `free_banners_of_selen` | Free Banners of Selen | `banner_plain` | men_of_selen / the_ravine_road | — | 16,8 | 70 | spirit `free_banners` |
| G | `a_treaty_not_a_crown` | **A Treaty, Not a Crown** | `scroll_treaty` | free_banners_of_selen / the_old_service_passages | — | 18,9 | 70 | Avail: End. pp 100; stab 0.10; remove `selen_under_arms`; spirit `peace_of_the_wardens` |

### Spirits

| Key | Name | Modifiers | Added / removed |
| --- | --- | --- | --- |
| `ranger_lodges` | Ranger Lodges | `special_forces_attack_factor` 0.05, `army_intel_factor` 0.10 | root; swapped |
| `ranger_lodges_2` | Lodges on Every Road | `special_forces_attack_factor` 0.10, `army_intel_factor` 0.15, `special_forces_cap` 0.05 | permanent |
| `greenwood_ways` | The Greenwood Ways | `army_defence_factor` 0.05, `attrition` −0.05 | permanent |
| `warden_host` | The Warden Host | `army_org_factor` 0.05, `conscription_factor` 0.05 | permanent |
| `the_restorers_land` | The Restorer's Land | `stability_factor` 0.05, `drift_defence_factor` 0.10 | swapped |
| `restorers_land_2` | Harion's Heirs | `stability_factor` 0.08, `drift_defence_factor` 0.20, `war_support_factor` 0.03 | permanent |
| `wardens_moot` | The Wardens' Moot | `political_power_factor` 0.10, `stability_factor` 0.03 | permanent |
| `university_of_selen` | The University of Selen | `research_speed_factor` 0.05 | permanent |
| `first_among_dominions` | First Among the Dominions | `opinion_gain_monthly_factor` 0.15, `political_power_gain` 0.10 | permanent |
| `selen_granaries` | The Granaries of Selen | `stability_factor` 0.03, `monthly_population` 0.05 | permanent |
| `lake_trade` | Trade with the Great Lake | `trade_opinion_factor` 0.15, `consumer_goods_factor` −0.02 | permanent |
| `frontier_hub` | The Frontier Hub | `experience_gain_army_factor` 0.10, `army_org_factor` 0.03 | permanent |
| `shelter_of_the_stranger` | The Stranger Sheltered | `civilian_intel_factor` 0.10, `enemy_operative_detection_chance_factor` 0.15 | removed by *The Men of Selen* (after `zin_eindil_returned`) |
| `selen_under_arms` | Selen Under Arms | `army_core_defence_factor` 0.10, `conscription_factor` 0.05 | until *A Treaty, Not a Crown* |
| `free_banners` | Free Banners of Selen | `army_morale_factor` 0.10, `war_support_factor` 0.05 | permanent |
| `peace_of_the_wardens` | The Wardens' Peace | `stability_factor` 0.10, `production_speed_buildings_factor` 0.10 | permanent |

### Events (namespace `zin_regional_selen`)

| Key (id) | Title | Picture | To | Fired by | Options |
| --- | --- | --- | --- | --- | --- |
| `ranger_reports` (1) | The Rangers' Reports | `generic_wilds` | Selen | *Hunters of the Coast* | A band of landless men camps on the coast road. **Hang the leaders** (stab 0.02, ws 0.02) / **Enlist them** (mp 500, army_xp 5; AI) / **Send them to the Houses** (stab 0.02) |
| `the_kings_taxes` (2) | The King's Taxes | `generic_court` | Selen | *The King's Taxes* | Parim's tax-farmers ask a new levy. **Pay it** (pp −50, loyalty(5); AI hist) / **Protest to the Moot** (loyalty(−5), stab 0.03) |
| `southern_rumours` (3) | Rumours from the South | `generic_wilds` | Selen | *Eyes on the South* | Rangers hear of dust on roads beyond Herez. **Send word to Parim** (lost_cause(2); `for_country Mirolon: call zin_mirolon_add_proof {value: 2}` if Mirolon exists; AI) / **Keep the rangers watching** (timed `ranger_watch` 365: `army_intel_factor` 0.10) |
| `alleria_reports` (4) | Alleria's Report | `generic_wilds` | Selen | *Alleria Investigates* | Only after `zin_eindil_named`. Alleria has walked with the Stranger and believes he is [zin_loc_eindil], son of Ein. **Bring him before the Moot** (regard(5), renown(3); AI) / **Keep it among the rangers** (regard(5); flag `zin_selen_rangers_silent`). Never says who the king in Parim is |

### Tree scripts

| Name | Kind | Does |
| --- | --- | --- |
| `zin_regional_selen_raise_rangers` | scripted effect | Creates template "The Greenwood Company" (6 × `zin_men_rangers`, 2 × `zin_men_archers`, scouts) and one division at the capital; assigns `zin_alleria` if Selen employs her |
| `zin_regional_selen_suspect_houses` | scripted effect | `set_country_flag = { flag = zin_afrit_suspicious days = 730 }`; `zin_afrit_add_veil = { value = -2 }` |

### AI

| Period | Historical route |
| --- | --- |
| 1748 | harions_country, rangers_of_selen, fields_and_forges, the_wardens_moot, the_long_patrol, university_of_selen |
| 1749 | the_kings_taxes (pay), granaries_of_selen, river_mills, the_frontier_watch, companies_for_the_league, lodges_on_every_road |
| 1750 | scholars_of_the_first_men, eyes_on_the_south, woodcraft_and_bow, the_ploughmens_roads; at the King's death mourning_in_selen, for_order_in_parim |
| 1751–1753 | harions_heirs, the_frontier_hub, smithies_of_selen, trade_with_the_lake, the_greenwood_ways, alleria_s_company, hunters_of_the_coast, warden_host, the_coast_watch, rumours_of_an_heir |
| 1754 | alleria_investigates, the_rangers_shelter, heed_the_warning, proof_in_the_rolls, keep_him_hidden |
| 1755–1756 | oath_to_the_heir, selen_under_arms, armouries_of_selen |
| 1757–1759 | men_of_selen, free_banners_of_selen, the_ravine_road, the_old_service_passages |
| 1760 | a_treaty_not_a_crown |

Never on the historical route: petition_for_the_old_liberties, voice_of_the_dominions, count_the_almoners, for_the_free_dominions, break_the_charter. Under `PLAUSIBLE` or `FREE`: voice_of_the_dominions ×2 when loyalty < 40; for_the_free_dominions when the Dominions camp ≥ 30; for_the_strangers_host whenever available.

---

## 2. Noleksun

| Item | Value |
| --- | --- |
| Tree id | `regional_noleksun` |
| Country | Noleksun (Middle Lands; 8 states; men; Wild, Freeholds; dominion of Aenor) |
| Focuses | 32; columns 0–16 |
| Events | `zin_regional_noleksun` |
| Start values | loyalty 40 (Old Charter); footholds 2 |

### Situation in 4A 1748

Noleksun is the Concord's south-eastern frontier: eight valley towns that share one name and one moot, the Eight Towns of Noleksun (proposed reading of the map's repeated labels). Each town keeps its own walls and its own grudges, and together they elect a Chief Speaker. They are the largest dominion and the least loyal. The Golden King's tax-farmers ride in every autumn; the moot pays, slowly, and writes every coin into its Book of Grievances. The frontier is quiet. The valley forts are old, the riders few, and nobody south of the Great Lake expects a war.

### Role in the story

- **Historical path:** grumbling loyalty that drifts toward Defiant under the Golden Court; at the King's death Noleksun is the dominion most likely to break its charter (the Aenor mechanic decides; the tree's AI does not force it). As a Free Dominion it would found and lead the Free Dominions, who are at war with nobody. In the war it holds its valleys against whatever crosses the frontier and, in 1757, rides with the Heir's coalition.
- **War of the Last Crowns:** the south-eastern flank of the Middle Lands; a refuge and a road for fleeing armies.
- **Alternatives:** a loyal Noleksun bought with a Free Charter; or the head of a Concord of Equals.

### Ruler and court

| Id | Name | Role | Traits / skill |
| --- | --- | --- | --- |
| `<Noleksun>_zin_ruler` | Chief Speaker Noleka | Country leader | `zin_trait_elected_speaker` |
| `zin_regional_noleksun_annard` | Marcher-Captain Voss Annard | Political advisor | `zin_adv_muster_master` |
| `zin_regional_noleksun_brenn` | Moot-Keeper Ilka Brenn | Political advisor | `zin_adv_elder` |
| `zin_regional_noleksun_aske` | Salt-Factor Doren Aske | Political advisor | `zin_adv_merchant_prince` |
| `zin_regional_noleksun_velik` | Captain Rhun Velik | Corps commander | skill 2; `hill_fighter` |

### Branches

| Br. | Branch | Columns | Opens | Focuses |
| --- | --- | --- | --- | ---: |
| A | The Moot of the Eight Towns | 0–3 | start | 7 |
| B | The South-East March | 5–8 | start | 7 |
| C | Valley Livelihoods | 10–12 | start | 6 |
| D | The Charter Quarrel | 14–17 | start; last two after the King's death | 7 |
| E | The Frontier Burns | 7–11 | Story | 5 |

### Focuses

| Br. | Key | Name | Icon | Prerequisites | Excl. | x,y | Days | Effects |
| --- | --- | --- | --- | --- | --- | --- | ---: | --- |
| A | `the_eight_towns` | **The Eight Towns** | `banner_league` | — | — | 1,0 | 35 | pp 50; spirit `moot_of_eight` |
| A | `speakers_circuit` | The Speaker's Circuit | `envoy` | the_eight_towns | — | 0,1 | 35 | pp 25; stab 0.03 |
| A | `town_charters` | Town Charters | `charter_old` | the_eight_towns | — | 2,1 | 70 | bld infrastructure 1 @random_owned; stab 0.02 |
| A | `one_moot_one_voice` | One Moot, One Voice | `council_table` | speakers_circuit | — | 0,2 | 70 | swap moot_of_eight→moot_of_eight_2 |
| A | `the_temple_question` | The Temple Question | `house_first_light` | town_charters | — | 2,2 | 35 | event `houses_in_the_valleys` |
| A | `frontier_law` | Frontier Law | `seal_royal` | one_moot_one_voice / the_temple_question | — | 1,3 | 70 | spirit `frontier_law` |
| A | `the_confederacy_stands` | The Confederacy Stands | `alliance_rings` | frontier_law | — | 1,4 | 70 | pp 75; stab 0.05 |
| B | `the_south_east_march` | The South-East March | `war_council_map` | — | — | 6,0 | 35 | army_xp 10 |
| B | `valley_forts` | Valley Forts | `fort_wall` | the_south_east_march | — | 5,1 | 70 | bld bunker 1 @random_owned ×2 |
| B | `march_riders` | March Riders | `horse_cavalry` | the_south_east_march | — | 7,1 | 70 | army_xp 5; res [zin_cat_mounts] 0.5 ×1 |
| B | `watchtowers_on_the_passes` | Watchtowers on the Passes | `pass_fort` | valley_forts | — | 5,2 | 35 | spirit `frontier_watch` |
| B | `frontier_levies` | Frontier Levies | `spear_levy` | march_riders | — | 7,2 | 70 | mp 2000; spirit `frontier_levies` |
| B | `the_long_border` | The Long Border | `fort_wall` | watchtowers_on_the_passes + frontier_levies | — | 6,3 | 70 | bld bunker 1 @capital; res [zin_cat_walls] 0.5 ×1 |
| B | `hosts_of_the_march` | Hosts of the March | `levy_muster` | the_long_border | — | 6,4 | 70 | army_xp 15; eq 1000 |
| C | `valley_markets` | Valley Markets | `market_stalls` | — | — | 11,0 | 70 | bld industrial_complex 1 @capital |
| C | `herds_and_hides` | Herds and Hides | `herds` | valley_markets | — | 10,1 | 35 | spirit `valley_herds` |
| C | `salt_and_iron` | Salt and Iron | `mine_cart` | valley_markets | — | 12,1 | 70 | bld industrial_complex 1 @random_owned |
| C | `the_frontier_road` | The Frontier Road | `roads_paved` | herds_and_hides | — | 10,2 | 70 | bld infrastructure 1 @random_owned ×2 |
| C | `smiths_of_the_eight` | Smiths of the Eight | `forge_anvil` | salt_and_iron | — | 12,2 | 70 | bld arms_factory 1 @random_owned |
| C | `prosperous_valleys` | Prosperous Valleys | `coin_chest` | the_frontier_road / smiths_of_the_eight | — | 11,3 | 70 | spirit `prosperous_valleys` |
| D | `the_charter_quarrel` | **The Charter Quarrel** | `charter_old` | — | — | 15,0 | 35 | Avail: Concord dominion. event `tax_farmers_at_the_moot` |
| D | `petition_parim` | Petition Parim | `charter_free` | the_charter_quarrel | — | 14,1 | 35 | petition(free) |
| D | `book_of_grievances` | The Book of Grievances | `ledger_coins` | the_charter_quarrel | — | 16,1 | 70 | pp 50; loyalty(−3); flag `zin_noleksun_grievances` |
| D | `speak_with_selen` | Speak with Selen | `envoy` | petition_parim | — | 14,2 | 35 | Avail: exists Selen. event_for Selen `noleksun_envoys` |
| D | `the_old_liberties` | The Old Liberties | `charter_free` | book_of_grievances | — | 16,2 | 70 | spirit `old_liberties` |
| D | `the_free_dominion` | **The Free Dominion** | `chain_broken` | speak_with_selen / the_old_liberties | — | 15,3 | 35 | Avail: `zin_golden_king_dead`; Concord dominion; `check zin_aenor_dominion_restless` or `check zin_aenor_dominion_defiant`; not at war. Bypass: flag `zin_aenor_free_dominion`. `call zin_aenor_secede_dominion`. hist 0 |
| D | `league_of_free_dominions` | **The League of Free Dominions** | `banner_league` | the_free_dominion | — | 15,4 | 70 | Avail: flag `zin_aenor_free_dominion`. If no country leads the Free Dominions: `faction` `free_dominions` (the Aenor mechanic's template `zin_faction_free_dominions`, `create_faction_from_template`, decision E3); `call zin_regional_noleksun_call_the_free`; pp 50 |
| E | `the_frontier_burns` | The Frontier Burns | `war_drums` | — | — | 9,6 | 35 | Avail: Story. ws 0.10; spirit `frontier_burns` |
| E | `hold_the_valleys` | Hold the Valleys | `fort_wall` | the_frontier_burns | — | 8,7 | 70 | bld bunker 2 @capital; mp 3000 |
| E | `the_free_muster` | The Free Muster | `levy_muster` | the_frontier_burns | — | 10,7 | 70 | Avail: at war. mp 5000; army_xp 10 |
| E | `ride_with_the_heir` | Ride with the Heir | `lone_sword` | hold_the_valleys / the_free_muster | — | 8,8 | 70 | Avail: `zin_eindil_returned`. coalition; regard(15) |
| E | `the_eight_rebuild` | The Eight Rebuild | `workshop_tools` | hold_the_valleys / the_free_muster | — | 10,8 | 70 | Avail: End. pp 100; stab 0.05; remove `frontier_burns` |

### Spirits

| Key | Name | Modifiers |
| --- | --- | --- |
| `moot_of_eight` | The Moot of the Eight Towns | `political_power_gain` 0.10, `drift_defence_factor` 0.10 |
| `moot_of_eight_2` | One Moot, One Voice | `political_power_gain` 0.15, `stability_factor` 0.05, `drift_defence_factor` 0.15 |
| `frontier_law` | Frontier Law | `stability_factor` 0.03, `war_support_factor` 0.05 |
| `frontier_watch` | Watchtowers on the Passes | `army_intel_factor` 0.10, `dig_in_speed_factor` 0.10 |
| `frontier_levies` | Frontier Levies | `conscription_factor` 0.05 |
| `valley_herds` | Herds and Hides | `monthly_population` 0.05, `stability_factor` 0.02 |
| `prosperous_valleys` | Prosperous Valleys | `production_factory_max_efficiency_factor` 0.05, `consumer_goods_factor` −0.02 |
| `old_liberties` | The Old Liberties | `political_power_factor` 0.10, `autonomy_gain_global_factor` 0.10 |
| `frontier_burns` | The Frontier Burns | `army_core_defence_factor` 0.10, `army_defence_factor` 0.05 (removed by *The Eight Rebuild*) |

### Events (`zin_regional_noleksun`)

| Key (id) | Title | Picture | To | Options |
| --- | --- | --- | --- | --- |
| `houses_in_the_valleys` (1) | Houses in the Valleys | `houses` | Noleksun | The Deliverer's almoners ask for land for a hospital. **Grant it** (footholds(1); stab 0.03; AI hist) / **The moot will think on it** (nothing) |
| `tax_farmers_at_the_moot` (2) | Tax-Farmers at the Moot | `concord_council` | Noleksun | **Pay the crown** (pp −50; loyalty(5)) / **Turn them away** (loyalty(−5); stab 0.03; ws 0.02; AI hist 60) |
| `noleksun_envoys` (3) | Envoys from the Eight Towns | `concord_council` | Selen | The Speaker asks Selen to speak with one voice for the dominions. **Agree** (opinion +20 both ways; AI 50) / **Selen speaks for itself** |
| `free_dominion_invite` (4) | The League of Free Dominions | `concord_council` | every country with `zin_aenor_free_dominion` not in a faction | **Join the league** (join Noleksun's faction; AI 70) / **Stand alone** |

`zin_regional_noleksun_call_the_free` (scripted effect): fires `free_dominion_invite` to every country with `zin_aenor_free_dominion` that is in no faction.

### AI

Historical: A and C first, then B; the_charter_quarrel (turn them away 60 %), book_of_grievances in 1750; mourning is not in this tree, so at the King's death the mechanic decides secession. If seceded: league_of_free_dominions at once. E when available; ride_with_the_heir in 1757. Never hist: petition_parim, the_free_dominion (the mechanic decides), speak_with_selen before 1752.

---

## 3. Herez

| Item | Value |
| --- | --- |
| Tree id | `regional_herez` |
| Country | Herez (Middle Lands; 5 states; men; Wild, Freeholds; dominion of Aenor) |
| Focuses | 32; columns 0–16 |
| Events | `zin_regional_herez` |
| Start values | loyalty 50 (Old Charter); footholds 2 |

### Situation in 4A 1748

Herez holds the southern marches of the Concord, where the Middle Lands fall away toward the heat of the Dead Lands. Its marcher lords keep old towers that have watched an empty road for centuries. Mirolon's envoys pass through Herez on their way to Parim and back, laughed at; the marcher lords alone listen politely. Herez is loyal enough, poor in gold, rich in horses and stone, and proud of being the Concord's shield toward a danger everyone else calls a legend.

### Role in the story

- **Historical path:** Herez hears Mirolon's warnings and may answer them (the Mirolon tree's events); when Volgan retakes Mirolon and marches (4A 1755), his war goal names Herez; the marches burn first. Herez may shelter Mirolon's exiled court. It is occupied or broken by 1756, resists, and is restored after Volgan's body is broken in 1757.
- **War of the Last Crowns:** the southern front of the Middle Lands.
- **Alternatives:** a fortified Herez that holds the marches with Mirolon; or a seceded Herez in Mirolon's Warden League.

### Ruler and court

| Id | Name | Role | Traits / skill |
| --- | --- | --- | --- |
| `<Herez>_zin_ruler` | Marcher-Lord Heziel | Country leader | `zin_trait_warden_of_the_passes` |
| `zin_regional_herez_vale` | Castellan Orrin Vale | Political advisor | `zin_adv_road_warden` |
| `zin_regional_herez_harrow` | Envoy Lisane Harrow | Political advisor | `zin_adv_envoy` |
| `zin_regional_herez_strell` | Muster-Lord Kadan Strell | Political advisor | `zin_adv_muster_master` |
| `zin_regional_herez_karn` | Captain of the Marches Ysolde Karn | Corps commander | skill 3; `trait_mountaineer`, `defensive_doctrine` |

### Branches

| Br. | Branch | Columns | Opens | Focuses |
| --- | --- | --- | --- | ---: |
| A | The Southern Marches | 0–4 | start | 8 |
| B | Friends Across the Border | 5–8 | start (needs Mirolon) | 6 |
| C | The Marcher Lords | 10–12 | start | 7 |
| D | Parim and the Charter | 14–16 | start | 4 |
| E | The Storm from the South | 6–11 | `zin_volgan_marches` or at war with Volgan | 7 |

### Focuses

| Br. | Key | Name | Icon | Prerequisites | Excl. | x,y | Days | Effects |
| --- | --- | --- | --- | --- | --- | --- | ---: | --- |
| A | `the_southern_marches` | **The Southern Marches** | `pass_fort` | — | — | 2,0 | 35 | army_xp 10; spirit `marcher_watch` |
| A | `march_wardens` | March Wardens | `fort_wall` | the_southern_marches | — | 1,1 | 70 | bld bunker 1 @random_owned; res [zin_cat_walls] 0.5 ×1 |
| A | `scouts_beyond_the_border` | **Scouts Beyond the Border** | `scout_lantern` | the_southern_marches | — | 3,1 | 35 | event `what_the_scouts_found` |
| A | `the_storm_wall_watch` | Watch on the Storm Wall | `storm_veil` | march_wardens | — | 0,2 | 70 | swap marcher_watch→marcher_watch_2 |
| A | `forts_of_the_marches` | Forts of the Marches | `fort_wall` | march_wardens | — | 2,2 | 70 | bld bunker 2 @random_owned |
| A | `hill_companies` | Hill Companies | `spear_levy` | scouts_beyond_the_border | — | 4,2 | 70 | army_xp 10; res [zin_cat_arms] 0.5 ×1 |
| A | `the_marcher_levy` | The Marcher Levy | `levy_muster` | the_storm_wall_watch / forts_of_the_marches | — | 1,3 | 70 | mp 3000; spirit `marcher_levy` |
| A | `shield_of_the_south` | Shield of the South | `sword_shield` | forts_of_the_marches + hill_companies | — | 3,3 | 70 | bld bunker 1 @capital; ws 0.03 |
| B | `friends_across_the_border` | Friends Across the Border | `envoy` | — | — | 7,0 | 35 | Avail: exists Mirolon. event_for Mirolon `herez_greetings` |
| B | `hear_the_mirolonese` | Hear the Mirolonese | `warden_crown` | friends_across_the_border | — | 6,1 | 35 | lost_cause(3); flag `zin_herez_heard_mirolon`; Concord dominion: event_for overlord `herez_warns_parim` |
| B | `the_marches_pact` | The Southern Marches Pact | `handshake_oath` | friends_across_the_border | — | 8,1 | 35 | Avail: `check zin_regional_herez_mirolon_friend`. flag `zin_herez_marches_pact` (Mirolon spec: Herez AI sends volunteers to Mirolon at war); pp 25 |
| B | `stand_with_the_lost_cause` | Stand with the Lost Cause | `banner_league` | hear_the_mirolonese / the_marches_pact | a_league_of_the_south | 6,2 | 70 | Avail: Concord dominion. loyalty(5); lost_cause(5) |
| B | `a_league_of_the_south` | A League of the South | `alliance_rings` | hear_the_mirolonese / the_marches_pact | stand_with_the_lost_cause | 8,2 | 70 | Avail: not Concord dominion; `check zin_regional_herez_league_exists`. join_faction_of Mirolon; flag `zin_mirolon_league_friend` |
| B | `shelter_for_mirolon` | **Shelter for Mirolon** | `exile_court` | stand_with_the_lost_cause / a_league_of_the_south | — | 7,3 | 70 | Avail: exists Mirolon. flag `zin_herez_shelters_mirolon`; `for_country Mirolon: call zin_mirolon_add_passes {value: 3}`; stab 0.02 |
| C | `the_marcher_lords` | The Marcher Lords | `crown_iron` | — | — | 11,0 | 35 | pp 50; spirit `marcher_lords` |
| C | `southern_pastures` | Southern Pastures | `herds` | the_marcher_lords | — | 10,1 | 70 | bld infrastructure 1 @random_owned; stab 0.02 |
| C | `the_iron_road_south` | The Iron Road South | `roads_paved` | the_marcher_lords | — | 12,1 | 70 | bld industrial_complex 1 @capital |
| C | `houses_on_the_march` | Houses on the March | `house_first_light` | southern_pastures | — | 10,2 | 35 | event `the_almoners_come_south` |
| C | `marcher_smiths` | Marcher Smiths | `forge_anvil` | the_iron_road_south | — | 12,2 | 70 | bld arms_factory 1 @random_owned |
| C | `the_lords_council` | The Lords' Council | `council_table` | houses_on_the_march / marcher_smiths | — | 11,3 | 70 | stab 0.05; swap marcher_lords→marcher_lords_2 |
| C | `a_march_of_plenty` | A March of Plenty | `granary` | the_lords_council | — | 11,4 | 70 | bld industrial_complex 1 @random_owned; bld infrastructure 1 @capital |
| D | `the_march_charter` | The March Charter | `charter_old` | — | — | 15,0 | 35 | loyalty(3); pp 25 |
| D | `petition_for_shields` | Petition for Shields | `charter_shield` | the_march_charter | — | 14,1 | 35 | Avail: Concord dominion. petition(shield) |
| D | `the_kings_garrison` | Ask for the King's Garrison | `levy_muster` | the_march_charter | — | 16,1 | 70 | Avail: Concord dominion. event_for overlord `herez_asks_for_garrison` |
| D | `southern_shield_of_the_concord` | The Southern Shield of the Concord | `concord_circle` | petition_for_shields / the_kings_garrison | — | 15,2 | 70 | loyalty(5); spirit `concord_shield_south` |
| E | `the_storm_breaks` | **The Storm Breaks** | `war_drums` | — | — | 9,6 | 35 | Avail: `zin_volgan_marches`, or at war with Volgan. ws 0.10; spirit `storm_from_the_south` |
| E | `hold_every_ford` | Hold Every Ford | `river_ford` | the_storm_breaks | — | 7,7 | 70 | bld bunker 1 @random_owned ×2 |
| E | `call_the_concord` | Call the Concord | `concord_circle` | the_storm_breaks | — | 9,7 | 35 | ws 0.05; army_xp 10; lost_cause(3) |
| E | `marches_in_the_dark` | The Marches in the Dark | `scout_lantern` | the_storm_breaks | — | 11,7 | 70 | Avail: `check zin_regional_herez_cores_occupied`. spirit `marcher_resistance` |
| E | `the_southern_front` | The Southern Front | `war_council_map` | hold_every_ford / call_the_concord | — | 8,8 | 70 | mp 5000; eq 1000 |
| E | `march_with_the_heir` | March with the Heir | `lone_sword` | call_the_concord / marches_in_the_dark | — | 10,8 | 70 | Avail: `zin_eindil_returned`. coalition; regard(15) |
| E | `the_marches_restored` | **The Marches Restored** | `olive_branch` | the_southern_front / march_with_the_heir | — | 9,9 | 70 | Avail: `zin_volgan_body_destroyed`, or (not at war with Volgan and Herez controls its capital). pp 100; stab 0.10; remove `storm_from_the_south`, `marcher_resistance` |

### Spirits

| Key | Name | Modifiers |
| --- | --- | --- |
| `marcher_watch` | The Marcher Watch | `army_intel_factor` 0.10, `dig_in_speed_factor` 0.10 |
| `marcher_watch_2` | Watch on the Storm Wall | `army_intel_factor` 0.15, `dig_in_speed_factor` 0.15, `army_core_defence_factor` 0.05 |
| `marcher_levy` | The Marcher Levy | `conscription_factor` 0.05, `training_time_factor` −0.05 |
| `marcher_lords` | The Marcher Lords | `political_power_gain` 0.10, `war_support_factor` 0.03 |
| `marcher_lords_2` | The Lords' Council | `political_power_gain` 0.15, `war_support_factor` 0.05 |
| `concord_shield_south` | The Southern Shield | `army_defence_factor` 0.05 |
| `storm_from_the_south` | The Storm from the South | `army_core_defence_factor` 0.15, `war_support_factor` 0.05 |
| `marcher_resistance` | The Marches in the Dark | `resistance_growth_on_our_occupied_states` 0.20, `resistance_damage_to_garrison_on_our_occupied_states` 0.20 |

### Events (`zin_regional_herez`)

| Key (id) | Title | Picture | To | Options |
| --- | --- | --- | --- | --- |
| `what_the_scouts_found` (1) | What the Scouts Found | `dead_lands_storm` | Herez | Dust columns on the southern road. **Tell Parim** (pp 25; Parim laughs) / **Tell Mirolon** (`for_country Mirolon: call zin_mirolon_add_proof {value: 3}`; `for_country Volgan: call zin_volgan_add_veil {value: -2}`; AI hist) / **Build another tower** (bld bunker 1 @random_owned) |
| `herez_greetings` (2) | Greetings from Herez | `mirolon_passes` | Mirolon | **Welcome the marcher lords** (opinion +15 both ways; AI 80) / **Herez answers to Parim** |
| `herez_warns_parim` (3) | Herez Warns Parim | `southern_warning` | overlord (Aenor realm) | **Laugh, as in 4A 1736** (pp 25; Herez loyalty(−5); AI = 30 + corruption ÷ 2) / **Listen** (lost_cause(5)) |
| `the_almoners_come_south` (4) | The Almoners Come South | `houses` | Herez | **Give them a hall** (footholds(1); stab 0.03; AI hist) / **The marches feed their own** (nothing) |
| `herez_asks_for_garrison` (5) | Herez Asks for a Garrison | `generic_court` | overlord | **Send arms** (overlord sends `zin_arms_equipment` 1000 to Herez; Herez loyalty(5)) / **The south is quiet** (pp 25; Herez loyalty(−5); AI hist while the Golden King lives) |

Tree triggers: `zin_regional_herez_mirolon_friend` (Mirolon exists and has `zin_mirolon_herez_friend`); `zin_regional_herez_league_exists` (Mirolon is a faction leader); `zin_regional_herez_cores_occupied` (an enemy controls a Herez core state).

### AI

Historical: A, C, D in order; friends_across_the_border 1749; hear_the_mirolonese 1750; the_marches_pact when available; stand_with_the_lost_cause 1752; shelter_for_mirolon 1753. E when Volgan marches; marches_in_the_dark at once when occupied; march_with_the_heir in 1757; the_marches_restored after the body breaks. a_league_of_the_south only if Herez has seceded (weight 80 then).

---

## 4. Konori

| Item | Value |
| --- | --- |
| Tree id | `regional_konori` |
| Country | Konori (Middle Lands; 5 states; men; Wild, Freeholds; dominion of Aenor) |
| Focuses | 31; columns 0–15 |
| Events | `zin_regional_konori` |
| Start values | loyalty 55 (Old Charter); footholds 2 |

### Situation in 4A 1748

Konori is the steppe kingdom of the eastern Middle Lands: five states of grass, river fords and horse fairs. Its kings rule through the Hundreds, riding clans that muster to the royal banner (proposed). Konori's horses mount Aenor's knights, and its fairs are the richest east of Parim. The kingdom is loyal because loyalty pays: Parim buys remounts and leaves the steppe alone. King Sventor wants only better prices and an end to the new tax on horses.

### Role in the story

- **Historical path:** a loyal dominion that follows whoever holds Parim's seals; it obeys the new king in 1750, serves the Captains' Regency in 1756 and the Hailed King in 1757 as part of Aenor's realm.
- **War of the Last Crowns:** the eastern cavalry reserve of the Concord; its grass lies on the road of any eastern army that turns west.
- **Alternatives:** a steppe crown that sides with the Free Dominions, or rides to the Heir early.

### Ruler and court

| Id | Name | Role | Traits / skill |
| --- | --- | --- | --- |
| `<Konori>_zin_ruler` | King Sventor of Konori | Country leader | `zin_trait_horse_lord` (new) |
| `zin_regional_konori_vahl` | Horse-Marshal Teodric Vahl | Political advisor | `zin_adv_muster_master` |
| `zin_regional_konori_dorn` | Fair-Warden Ysa Dorn | Political advisor | `zin_adv_merchant_prince` |
| `zin_regional_konori_kaal` | Steppe-Elder Ubren Kaal | Political advisor | `zin_adv_elder` |
| `zin_regional_konori_stenning` | Captain Arvo Stenning | Corps commander | skill 2; `cavalry_leader` |

### Branches

| Br. | Branch | Columns | Opens | Focuses |
| --- | --- | --- | --- | ---: |
| A | The Steppe Crown | 0–3 | start | 7 |
| B | The Horse Fairs | 5–7 | start | 7 |
| C | Riders of the Steppe | 9–11 | start | 7 |
| D | The Eastern Road | 13–15 | start | 5 |
| E | War on the Steppe | 5–9 | Story | 5 |

### Focuses

| Br. | Key | Name | Icon | Prerequisites | Excl. | x,y | Days | Effects |
| --- | --- | --- | --- | --- | --- | --- | ---: | --- |
| A | `the_steppe_crown` | **The Steppe Crown** | `crown_iron` | — | — | 1,0 | 35 | pp 50; spirit `steppe_crown` |
| A | `the_hundreds` | The Hundreds | `levy_muster` | the_steppe_crown | — | 0,1 | 70 | mp 2000; stab 0.02 |
| A | `the_kings_progress` | The King's Progress | `banner_plain` | the_steppe_crown | — | 2,1 | 35 | stab 0.03; event `progress_through_the_hundreds` |
| A | `oaths_of_the_hundreds` | Oaths of the Hundreds | `handshake_oath` | the_hundreds | — | 0,2 | 70 | swap steppe_crown→steppe_crown_2 |
| A | `law_of_the_fords` | The Law of the Fords | `river_ford` | the_kings_progress | — | 2,2 | 70 | stab 0.05; pp 25 |
| A | `temples_at_the_fairs` | Temples at the Fairs | `house_first_light` | law_of_the_fords | — | 3,3 | 35 | event `the_deliverers_tent` |
| A | `a_crown_of_grass_and_iron` | A Crown of Grass and Iron | `crown_hailed` | oaths_of_the_hundreds + law_of_the_fords | — | 1,3 | 70 | pp 75; stab 0.05 |
| B | `the_great_horse_fair` | **The Great Horse Fair** | `market_stalls` | — | — | 6,0 | 70 | bld infrastructure 1 @capital; spirit `horse_fairs` |
| B | `remounts_for_parim` | Remounts for Parim | `herds` | the_great_horse_fair | — | 5,1 | 35 | Avail: Concord dominion. loyalty(5); pp 25 |
| B | `river_markets` | River Markets | `caravan` | the_great_horse_fair | — | 7,1 | 70 | bld industrial_complex 1 @capital |
| B | `stud_farms_of_konori` | The Stud Farms of Konori | `horse_cavalry` | remounts_for_parim | — | 5,2 | 70 | res [zin_cat_mounts] 0.5 ×2 |
| B | `the_steppe_roads` | The Steppe Roads | `roads_paved` | river_markets | — | 7,2 | 70 | bld infrastructure 1 @random_owned ×2 |
| B | `saddlers_and_smiths` | Saddlers and Smiths | `forge_anvil` | the_steppe_roads | — | 7,3 | 70 | bld arms_factory 1 @random_owned; bld industrial_complex 1 @random_owned |
| B | `wealth_of_the_herds` | Wealth of the Herds | `coin_chest` | (stud_farms_of_konori / the_steppe_roads) + saddlers_and_smiths | — | 6,4 | 70 | swap horse_fairs→horse_fairs_2 |
| C | `riders_of_konori` | **Riders of Konori** | `horse_cavalry` | — | — | 10,0 | 70 | army_xp 10; res [zin_cat_mounts] 0.5 ×1 |
| C | `horse_archers` | Horse Archers | `bow_archers` | riders_of_konori | — | 9,1 | 70 | res [zin_cat_bows] 0.5 ×1; spirit `steppe_archers` |
| C | `the_royal_lances` | The Royal Lances | `knight_lance` | riders_of_konori | — | 11,1 | 70 | army_xp 5; res [zin_cat_armour] 0.5 ×1 |
| C | `outriders` | Outriders | `scout_lantern` | horse_archers | — | 9,2 | 35 | spirit `outriders` |
| C | `cavalry_drill` | Cavalry Drill | `war_drums` | the_royal_lances | — | 11,2 | 70 | swap steppe_archers→steppe_archers_2 |
| C | `the_steppe_host` | The Steppe Host | `levy_muster` | outriders / cavalry_drill | — | 10,3 | 70 | mp 3000; army_xp 10 |
| C | `riders_for_the_concord` | Riders for the Concord | `concord_circle` | the_steppe_host | — | 10,4 | 70 | Avail: Concord dominion. loyalty(5); lost_cause(3); army_xp 5 |
| D | `the_eastern_road` | The Eastern Road | `roads_paved` | — | — | 14,0 | 35 | pp 25; bld infrastructure 1 @random_owned |
| D | `friends_at_the_gate` | Friends at the Gate | `envoy` | the_eastern_road | — | 13,1 | 35 | Avail: exists Kingson. event_for Kingson `konori_greetings` |
| D | `customs_of_the_road` | Customs of the Road | `toll_house` | the_eastern_road | — | 15,1 | 70 | spirit `eastern_road_trade` |
| D | `watch_on_the_east` | Watch on the East | `eye_watchful` | friends_at_the_gate / customs_of_the_road | — | 14,2 | 70 | bld bunker 1 @random_owned; spirit `eastern_watch` |
| D | `envoys_beyond_the_wall` | Envoys Beyond the Wall | `tree_silver` | watch_on_the_east | — | 14,3 | 35 | Avail: exists Magical Forest. event_for Magical Forest `konori_envoys` |
| E | `the_steppe_rides_to_war` | **The Steppe Rides to War** | `horse_cavalry` | — | — | 7,6 | 35 | Avail: Story. ws 0.10; spirit `war_on_the_steppe` |
| E | `burn_the_grass` | Burn the Grass | `war_drums` | the_steppe_rides_to_war | — | 5,7 | 70 | Avail: at war. bld bunker 1 @random_owned ×2; army_xp 10 |
| E | `the_hundreds_muster` | The Hundreds Muster | `levy_muster` | the_steppe_rides_to_war | — | 7,7 | 70 | mp 5000; eq 500 |
| E | `ride_with_the_heir` | Ride with the Heir | `lone_sword` | the_steppe_rides_to_war | — | 9,7 | 70 | Avail: `zin_eindil_returned`. coalition (if not already in its war as Aenor's dominion); regard(10) |
| E | `the_steppe_endures` | The Steppe Endures | `olive_branch` | burn_the_grass / the_hundreds_muster / ride_with_the_heir | — | 7,8 | 70 | Avail: End. pp 75; stab 0.10; remove `war_on_the_steppe` |

### Spirits

| Key | Name | Modifiers |
| --- | --- | --- |
| `steppe_crown` | The Steppe Crown | `political_power_gain` 0.10, `stability_factor` 0.03 |
| `steppe_crown_2` | Oaths of the Hundreds | `political_power_gain` 0.15, `stability_factor` 0.05, `drift_defence_factor` 0.10 |
| `horse_fairs` | The Horse Fairs | `trade_opinion_factor` 0.10, `political_power_gain` 0.05 |
| `horse_fairs_2` | Wealth of the Herds | `trade_opinion_factor` 0.15, `political_power_gain` 0.10, `monthly_population` 0.05 |
| `steppe_archers` | Horse Archers | `cavalry_attack_factor` 0.05 |
| `steppe_archers_2` | Cavalry Drill | `cavalry_attack_factor` 0.10, `cavalry_defence_factor` 0.05 |
| `outriders` | Outriders | `army_intel_factor` 0.10 |
| `eastern_road_trade` | Customs of the Road | `trade_opinion_factor` 0.10, `consumer_goods_factor` −0.02 |
| `eastern_watch` | Watch on the East | `army_intel_factor` 0.05, `dig_in_speed_factor` 0.10 |
| `war_on_the_steppe` | War on the Steppe | `cavalry_attack_factor` 0.10, `war_support_factor` 0.05 |

### Events (`zin_regional_konori`)

| Key (id) | Title | Picture | To | Options |
| --- | --- | --- | --- | --- |
| `progress_through_the_hundreds` (1) | The King Among the Hundreds | `generic_peace` | Konori | **Feast with the clans** (pp −25; stab 0.03) / **Judge their quarrels** (pp 25) |
| `the_deliverers_tent` (2) | The Deliverer's Tent | `houses` | Konori | Almoners raise a tent of healing at the fair. **Bless it** (footholds(1); stab 0.02; AI hist) / **Let it be** (nothing) |
| `konori_greetings` (3) | Riders at the Gate | `generic_peace` | Kingson | **Open the road to them** (opinion +15 both ways; AI 70) / **Tolls are tolls** (pp 15) |
| `konori_envoys` (4) | Envoys from the Steppe | `generic_wilds` | Magical Forest | **Welcome their traders** (opinion +10 both ways; `call zin_elves_add_wall_grievance {value: -2}`; AI 50) / **The Wall is the Wall** |

### AI

Historical: B and A first (loyal and rich), C from 1750, D from 1751; E when available. ride_with_the_heir only if not already fighting the same war as Aenor's dominion.

---

## 5. Kilinti

| Item | Value |
| --- | --- |
| Tree id | `regional_kilinti` |
| Country | Kilinti (Middle Lands; 4 states; ents, minor people men; Light, Warden Host; dominion of Aenor) |
| Focuses | 32; columns 0–15 |
| Events | `zin_regional_kilinti` |
| Start values | loyalty 60 (Old Charter); footholds 1 |

### Situation in 4A 1748

Kilinti and the Kilinti Forests are one realm under the Charters of Parim: the ents of the old woods, and the forest peoples who live in the clearings beneath them (established: "ents and forest peoples"). The Great Moot of the ents speaks slowly; a question raised at Thaw is answered at Harvest, if at all. The ents remember the forests of the Third Age burning and growing back (proposed). The crown asks little of Kilinti but timber, and the Golden Court's timber-buyers want the oldest trees. That is the whole quarrel. The almoners of the Deliverer visit the villages; the ents ignore them.

### Role in the story

- **Historical path:** steady and slow; Kilinti answers the crown's calls through its forest peoples and keeps its groves home. In the war its woods are a refuge, and its groves defend them; with Aenor's realm it fights in the coalition.
- **War of the Last Crowns:** the forest bastion of the Middle Lands; ent groves are unbreakable in forest and slow everywhere else.
- **Alternatives:** an awakened Kilinti that sends its groves to the front; or a Kilinti that refuses the crown's axes and leaves the Concord after the King's death.

### Ruler and court

| Id | Name | Role | Traits / skill |
| --- | --- | --- | --- |
| `<Kilinti>_zin_ruler` | Eldest Gronnar of Kilinti | Country leader (an ent) | `zin_trait_eldest_of_the_moot` (new) |
| `zin_regional_kilinti_brannoch` | Rootspeaker Brannoch | Political advisor (an ent) | `zin_adv_elder` |
| `zin_regional_kilinti_lind` | Woodward Hesta Lind | Political advisor (forest peoples) | `zin_adv_road_warden` |
| `zin_regional_kilinti_wenmoor` | Steward Calla Wenmoor | Political advisor (forest peoples) | `zin_adv_treasurer` |
| `zin_regional_kilinti_thornel` | Grove-Warden Thornel | Corps commander (an ent) | skill 3; `defensive_doctrine`, `unyielding_defender` |

No text states the ents' rank, age or mortality.

### Branches

| Br. | Branch | Columns | Opens | Focuses |
| --- | --- | --- | --- | ---: |
| A | The Great Moot | 0–3 | start | 7 |
| B | The Forest Peoples | 5–7 | start | 7 |
| C | The Groves | 9–11 | start | 7 |
| D | Under the Charter | 13–15 | start | 5 |
| E | When the Woods March | 6–10 | Story | 6 |

### Focuses

| Br. | Key | Name | Icon | Prerequisites | Excl. | x,y | Days | Effects |
| --- | --- | --- | --- | --- | --- | --- | ---: | --- |
| A | `the_great_moot` | **The Great Moot** | `kilinti_grove` | — | — | 1,0 | 35 | spirit `slow_counsel` |
| A | `voices_of_the_old_trees` | Voices of the Old Trees | `ent_branch` | the_great_moot | — | 0,1 | 70 | pp 50 |
| A | `the_burning_remembered` | The Burning Remembered | `book_lore` | the_great_moot | — | 2,1 | 35 | ws 0.03; event `the_burning_remembered` |
| A | `a_moot_of_seasons` | A Moot of Seasons | `elven_council` | voices_of_the_old_trees | — | 0,2 | 70 | swap slow_counsel→slow_counsel_2 |
| A | `oaths_older_than_crowns` | Oaths Older Than Crowns | `handshake_oath` | the_burning_remembered | — | 2,2 | 70 | stab 0.05; loyalty(3) |
| A | `the_hush_of_the_forest` | The Hush of the Forest | `forest_ancient` | oaths_older_than_crowns | — | 3,3 | 35 | event `pilgrims_at_the_forest_edge` |
| A | `the_moot_decides` | The Moot Decides | `kilinti_grove` | a_moot_of_seasons + oaths_older_than_crowns | — | 1,3 | 70 | pp 75; stab 0.05 |
| B | `the_forest_peoples` | **The Forest Peoples** | `forest_ancient` | — | — | 6,0 | 35 | mp 1500 |
| B | `woodsmen_and_charcoal` | Woodsmen and Charcoal | `timber_mill` | the_forest_peoples | — | 5,1 | 70 | bld industrial_complex 1 @capital |
| B | `clearings_and_villages` | Clearings and Villages | `farm_sowing` | the_forest_peoples | — | 7,1 | 70 | bld infrastructure 1 @random_owned; spirit `forest_villages` |
| B | `bows_of_the_clearings` | Bows of the Clearings | `bow_archers` | woodsmen_and_charcoal | — | 5,2 | 70 | army_xp 5; res [zin_cat_bows] 0.5 ×1 |
| B | `rangers_of_the_deep_woods` | Rangers of the Deep Woods | `ranger_cloak` | clearings_and_villages | — | 7,2 | 70 | res [zin_cat_bows] 0.5 ×1; spirit `forest_rangers` |
| B | `the_timber_buyers` | The Timber-Buyers | `ledger_coins` | bows_of_the_clearings / rangers_of_the_deep_woods | — | 6,3 | 70 | Avail: Concord dominion. event `the_timber_buyers` |
| B | `people_of_the_eaves` | The People of the Eaves | `granary` | the_timber_buyers | — | 6,4 | 70 | swap forest_villages→forest_villages_2 |
| C | `wake_the_groves` | **Wake the Groves** | `ent_branch` | — | — | 10,0 | 70 | army_xp 10; res [zin_cat_kin] 0.5 ×1 |
| C | `grove_wardings` | Grove Wardings | `ward_circle` | wake_the_groves | — | 9,1 | 70 | res [zin_cat_kin] 0.5 ×1 |
| C | `paths_only_we_know` | Paths Only We Know | `scout_lantern` | wake_the_groves | — | 11,1 | 35 | spirit `secret_paths` |
| C | `the_slow_march` | The Slow March | `ent_branch` | grove_wardings | — | 9,2 | 70 | spirit `slow_march` |
| C | `rooted_defence` | Rooted Defence | `fort_wall` | paths_only_we_know | — | 11,2 | 70 | bld bunker 1 @capital ×2 |
| C | `grove_hosts` | Grove Hosts | `kilinti_grove` | the_slow_march / rooted_defence | — | 10,3 | 70 | mp 1000; army_xp 10 |
| C | `the_forest_stands` | The Forest Stands | `forest_ancient` | grove_hosts | — | 10,4 | 70 | swap slow_march→slow_march_2 |
| D | `the_old_charter` | The Old Charter | `charter_old` | — | — | 14,0 | 35 | loyalty(3); pp 25 |
| D | `timber_for_the_crown` | Timber for the Crown | `timber_mill` | the_old_charter | no_axe_in_the_old_wood | 13,1 | 70 | Avail: Concord dominion. loyalty(5); bld industrial_complex 1 @random_owned |
| D | `no_axe_in_the_old_wood` | No Axe in the Old Wood | `charter_free` | the_old_charter | timber_for_the_crown | 15,1 | 35 | petition(free); stab 0.03 |
| D | `scholars_among_the_trees` | Scholars Among the Trees | `university_hall` | timber_for_the_crown / no_axe_in_the_old_wood | — | 14,2 | 35 | timed `scholars_in_the_woods` 365 |
| D | `wardens_of_the_concord` | Wardens of the Concord | `concord_circle` | scholars_among_the_trees | — | 14,3 | 70 | lost_cause(3); army_xp 5; loyalty(3) |
| E | `the_woods_awake` | **The Woods Awake** | `ent_branch` | — | — | 8,6 | 35 | Avail: Story. ws 0.10; spirit `woods_awake` |
| E | `refuge_in_the_trees` | Refuge in the Trees | `forest_ancient` | the_woods_awake | — | 6,7 | 35 | event `refugees_under_the_eaves` |
| E | `the_groves_march` | The Groves March | `kilinti_grove` | the_woods_awake | — | 8,7 | 70 | Avail: at war. mp 1000; spirit `groves_march` |
| E | `against_the_deathless` | Against the Deathless | `grave_host` | the_woods_awake | — | 10,7 | 70 | Avail: `zin_zol_rising`. army_xp 10; tooltip "Root and branch break the dead; they do not end them." |
| E | `the_heirs_woodsmen` | The Heir's Woodsmen | `lone_sword` | refuge_in_the_trees / the_groves_march | — | 7,8 | 70 | Avail: `zin_eindil_returned`. coalition (if not already in his war); regard(10) |
| E | `the_forest_heals` | The Forest Heals | `tree_silver` | the_groves_march / against_the_deathless | — | 9,8 | 70 | Avail: End. stab 0.10; remove `woods_awake`, `groves_march`; spirit `forest_heals` |

### Spirits

| Key | Name | Modifiers |
| --- | --- | --- |
| `slow_counsel` | Slow Counsel | `drift_defence_factor` 0.20, `political_power_factor` −0.05, `stability_factor` 0.05 |
| `slow_counsel_2` | A Moot of Seasons | `drift_defence_factor` 0.25, `stability_factor` 0.08 |
| `forest_villages` | Clearings and Villages | `monthly_population` 0.05, `stability_factor` 0.02 |
| `forest_villages_2` | The People of the Eaves | `monthly_population` 0.08, `stability_factor` 0.04, `recruitable_population_factor` 0.05 |
| `forest_rangers` | Rangers of the Deep Woods | `special_forces_attack_factor` 0.05, `army_intel_factor` 0.05 |
| `secret_paths` | Paths Only We Know | `army_defence_factor` 0.05, `attrition` −0.05 |
| `slow_march` | The Slow March | `army_armor_defence_factor` 0.10 |
| `slow_march_2` | The Forest Stands | `army_armor_defence_factor` 0.15, `army_armor_attack_factor` 0.05, `max_dig_in` 2 |
| `scholars_in_the_woods` | Scholars Among the Trees | `research_speed_factor` 0.03 |
| `woods_awake` | The Woods Awake | `army_core_defence_factor` 0.15, `war_support_factor` 0.05 |
| `groves_march` | The Groves March | `army_armor_attack_factor` 0.10 |
| `forest_heals` | The Forest Heals | `production_speed_buildings_factor` 0.10 |

### Events (`zin_regional_kilinti`)

| Key (id) | Title | Picture | To | Options |
| --- | --- | --- | --- | --- |
| `the_burning_remembered` (1) | The Burning Remembered | `generic_wilds` | Kilinti | The eldest speak of forests burned in an age of the dead, and of how they grew back. Flavour; **We remember** (stab 0.02) |
| `pilgrims_at_the_forest_edge` (2) | Pilgrims at the Forest Edge | `houses` | Kilinti | **Let the almoners tend the villages** (footholds(1); stab 0.02) / **The trees need no temple** (nothing; AI hist 60) |
| `the_timber_buyers` (3) | The Timber-Buyers | `generic_court` | Kilinti | **Sell young wood** (pp 50; loyalty(3); AI hist) / **Refuse the old trees** (loyalty(−3); stab 0.03) |
| `refugees_under_the_eaves` (4) | Refugees Under the Eaves | `generic_war` | Kilinti | **Take them in** (mp 3000; stab −0.03; AI) / **Guide them onward** (stab 0.02) |

### AI

Historical: A, B and D first (timber_for_the_crown, hist), C from 1751; E when available. The groves stay home before the war: the_groves_march only when at war.

---

## 6. Kingson

| Item | Value |
| --- | --- |
| Tree id | `regional_kingson` |
| Country | Kingson (Middle Lands; 4 states; men; Wild, Freeholds; dominion of Aenor) |
| Focuses | 33; columns 0–16 |
| Events | `zin_regional_kingson` |
| Start values | loyalty 65 (Wall Charter); footholds 2; `zin_elves_wall_grievance` 25 (global, elves spec) |

### Situation in 4A 1748

Kingson keeps the gate in the Great Wall of Aenor, east of the Giant Mountains, where the Wall turns around its lands. Its lords have held the gate since the Wall Accord of 4A 96 (proposed) and collect the crown's customs from elven traders and eastern caravans. Pilgrims of the Deliverer pass through the gate on the road to the Zilin Hills (proposed). Kingson is loyal under its Wall Charter, its forts are the strongest in the Concord, and its quarrel is small and daily: the Golden Court wants higher tolls, and the elves want lower ones.

### Role in the story

- **Historical path:** keeps the gate shut and the tolls as Parim orders; heeds the Stranger's warning in 1754 (the journey's historical heeders); when the eastern coalition invades the Magical Lands (4A 1755) the elves' envoys come to Kingson's gate and Kingson keeps the gates shut; the Wall holds through the war.
- **War of the Last Crowns:** the eastern bastion of the Middle Lands and the door between men and elves.
- **Alternatives:** honest tolls that cool the Wall's grievance; or open gates that send Aenoran companies to the elves' aid.

### Ruler and court

| Id | Name | Role | Traits / skill |
| --- | --- | --- | --- |
| `<Kingson>_zin_ruler` | Lord Arcen of the Gate | Country leader | `zin_trait_keeper_of_the_gate` (new) |
| `zin_regional_kingson_quill` | Toll-Reeve Marta Quill | Political advisor | `zin_adv_treasurer` |
| `zin_regional_kingson_harl` | Gate-Captain Oswin Harl | Political advisor | `zin_adv_muster_master` |
| `zin_regional_kingson_varo` | Ilen Varo, Envoy to the Groves | Political advisor | `zin_adv_envoy` |
| `zin_regional_kingson_stone` | Brannic Stone, Warden of the Wall | Corps commander | skill 3; `defensive_doctrine`, `unyielding_defender` |

### Branches

| Br. | Branch | Columns | Opens | Focuses |
| --- | --- | --- | --- | ---: |
| A | The Gate | 0–4 | start | 8 |
| B | Customs and Caravans | 5–9 | start | 7 |
| C | The Giant Mountains | 10–12 | start | 6 |
| D | Under the Charter | 14–16 | start | 5 |
| E | When the Gates Are Tested | 6–10 | Story, or `zin_wall_accord_broken` | 7 |

### Focuses

| Br. | Key | Name | Icon | Prerequisites | Excl. | x,y | Days | Effects |
| --- | --- | --- | --- | --- | --- | --- | ---: | --- |
| A | `the_gate_of_kingson` | **The Gate of Kingson** | `fort_wall` | — | — | 2,0 | 35 | army_xp 5; spirit `gate_wardens` |
| A | `wardens_of_the_gate` | Wardens of the Gate | `eye_watchful` | the_gate_of_kingson | — | 1,1 | 70 | res [zin_cat_walls] 0.5 ×1 |
| A | `the_wall_charter_kept` | The Wall Charter Kept | `charter_wall` | the_gate_of_kingson | — | 3,1 | 35 | loyalty(3); bld bunker 1 @great_wall |
| A | `towers_on_the_wall` | Towers on the Wall | `fort_wall` | wardens_of_the_gate | — | 0,2 | 70 | bld bunker 1 @great_wall ×2 |
| A | `the_gatehouse_keep` | The Gatehouse Keep | `fort_wall` | wardens_of_the_gate / the_wall_charter_kept | — | 2,2 | 70 | bld bunker 1 @capital; swap gate_wardens→gate_wardens_2 |
| A | `beacons_along_the_wall` | Beacons Along the Wall | `beacon` | the_wall_charter_kept | — | 4,2 | 35 | spirit `wall_beacons` |
| A | `the_wall_garrison` | The Wall Garrison | `levy_muster` | towers_on_the_wall | — | 1,3 | 70 | mp 2000; army_xp 10 |
| A | `the_gate_holds` | The Gate Holds | `fort_wall` | the_gatehouse_keep + beacons_along_the_wall | — | 3,3 | 70 | bld bunker 1 @great_wall; res [zin_cat_walls] 0.5 ×1 |
| B | `the_customs_house` | **The Customs House** | `toll_house` | — | — | 7,0 | 35 | pp 50; spirit `customs_house` |
| B | `elven_traders` | Elven Traders | `tree_silver` | the_customs_house | — | 6,1 | 70 | event `an_elven_caravan` |
| B | `pilgrim_road_to_the_hills` | The Pilgrim Road | `courier_pilgrim` | the_customs_house | — | 8,1 | 35 | event `pilgrims_at_the_gate` |
| B | `honest_tolls` | **Honest Tolls** | `olive_branch` | elven_traders | the_full_toll | 5,2 | 70 | grievance(−10); swap customs_house→honest_tolls_house |
| B | `the_full_toll` | The Full Toll | `coin_chest` | elven_traders | honest_tolls | 7,2 | 70 | grievance(5); pp 75; swap customs_house→full_toll_house; overlord: `call zin_economy_add_gold {value: 30}` if it is an Aenor realm |
| B | `caravan_inns` | Caravan Inns | `caravan` | pilgrim_road_to_the_hills | — | 9,2 | 70 | bld infrastructure 1 @capital; bld industrial_complex 1 @random_owned |
| B | `the_gate_market` | The Gate Market | `market_stalls` | (honest_tolls / the_full_toll) + caravan_inns | — | 7,3 | 70 | bld industrial_complex 1 @capital; spirit `gate_market` |
| C | `the_giant_mountains` | The Giant Mountains | `snow_peak` | — | — | 11,0 | 35 | bld infrastructure 1 @random_owned |
| C | `mountain_quarries` | Mountain Quarries | `quarry_stone` | the_giant_mountains | — | 10,1 | 70 | bld industrial_complex 1 @random_owned |
| C | `hill_folk` | The Hill Folk | `spear_levy` | the_giant_mountains | — | 12,1 | 70 | mp 1500; res [zin_cat_arms] 0.5 ×1 |
| C | `stone_for_the_wall` | Stone for the Wall | `quarry_stone` | mountain_quarries | — | 10,2 | 70 | res [zin_cat_walls] 0.5 ×1; bld bunker 1 @random_owned |
| C | `mountain_passes` | Mountain Passes | `mountain_pass` | hill_folk | — | 12,2 | 35 | spirit `mountain_paths` |
| C | `iron_of_the_mountains` | Iron of the Mountains | `mine_cart` | stone_for_the_wall / mountain_passes | — | 11,3 | 70 | bld arms_factory 1 @random_owned |
| D | `the_kings_gate` | The King's Gate | `crown_iron` | — | — | 15,0 | 35 | loyalty(5); pp 25 |
| D | `customs_for_parim` | Customs for Parim | `ledger_coins` | the_kings_gate | a_gate_not_a_toll | 14,1 | 35 | Avail: Concord dominion. pp −25; loyalty(3); overlord: `call zin_economy_add_gold {value: 20}` |
| D | `a_gate_not_a_toll` | A Gate, Not a Toll | `charter_free` | the_kings_gate | customs_for_parim | 16,1 | 35 | petition(free); grievance(−5) |
| D | `the_wall_moot` | Call the Wall Moot | `envoy` | customs_for_parim / a_gate_not_a_toll | — | 15,2 | 35 | Avail: exists Magical Forest. grievance(−5); stab 0.03; event_for Magical Forest `kingson_envoys` |
| D | `keepers_of_the_accord` | Keepers of the Accord | `scroll_treaty` | the_wall_moot | — | 15,3 | 70 | Avail: global `zin_wall_accord`. spirit `keepers_of_the_accord` |
| E | `the_gates_are_tested` | **The Gates Are Tested** | `war_drums` | — | — | 8,5 | 35 | Avail: Story or `zin_wall_accord_broken`. ws 0.10; spirit `gates_tested` |
| E | `shut_the_gates` | Shut the Gates | `fort_wall` | the_gates_are_tested | open_the_gates | 6,6 | 35 | flag `zin_kingson_gates_shut`; bld bunker 1 @great_wall; stab 0.03 |
| E | `open_the_gates` | Open the Gates | `handshake_oath` | the_gates_are_tested | shut_the_gates | 10,6 | 35 | Avail: `zin_eastern_invasion`; `zin_wall_accord` set. flag `zin_kingson_gates_open` (proposed hook: the elves' *Offer Aenoran companies* outcome is available even if Aenor declines); event_for Magical Forest `gates_opened` |
| E | `the_wall_holds` | The Wall Holds | `fort_wall` | shut_the_gates | — | 6,7 | 70 | bld bunker 2 @great_wall; mp 3000 |
| E | `refugees_through_the_gate` | Refugees Through the Gate | `alms_bread` | shut_the_gates / open_the_gates | — | 8,7 | 35 | event `refugees_at_the_gate` |
| E | `companies_beyond_the_wall` | Companies Beyond the Wall | `banner_league` | open_the_gates | — | 10,7 | 70 | army_xp 15; grievance(−10) |
| E | `the_heirs_gate` | The Heir's Gate | `lone_sword` | the_wall_holds / refugees_through_the_gate / companies_beyond_the_wall | — | 8,8 | 70 | Avail: `zin_eindil_returned`. coalition (if not already in his war); regard(10) |

### Spirits

| Key | Name | Modifiers |
| --- | --- | --- |
| `gate_wardens` | The Gate Wardens | `army_core_defence_factor` 0.05, `dig_in_speed_factor` 0.10 |
| `gate_wardens_2` | The Gatehouse Keep | `army_core_defence_factor` 0.10, `dig_in_speed_factor` 0.15, `max_dig_in` 2 |
| `wall_beacons` | Beacons Along the Wall | `army_intel_factor` 0.10 |
| `customs_house` | The Customs House | `political_power_gain` 0.10, `trade_opinion_factor` 0.05 |
| `honest_tolls_house` | Honest Tolls | `trade_opinion_factor` 0.15, `political_power_gain` 0.05 |
| `full_toll_house` | The Full Toll | `political_power_gain` 0.20, `trade_opinion_factor` −0.05 |
| `gate_market` | The Gate Market | `production_factory_max_efficiency_factor` 0.03, `consumer_goods_factor` −0.02 |
| `mountain_paths` | Mountain Passes | `army_defence_factor` 0.05, `attrition` −0.05 |
| `keepers_of_the_accord` | Keepers of the Accord | `opinion_gain_monthly_factor` 0.15, `stability_factor` 0.03 |
| `gates_tested` | The Gates Are Tested | `army_core_defence_factor` 0.15, `max_dig_in` 2, `war_support_factor` 0.05 |

### Events (`zin_regional_kingson`)

| Key (id) | Title | Picture | To | Options |
| --- | --- | --- | --- | --- |
| `an_elven_caravan` (1) | An Elven Caravan | `generic_peace` | Kingson | **Fair dealing** (grievance(−5); timed `fair_dealing` 180: `trade_opinion_factor` 0.10) / **The crown's full toll** (pp 25; grievance(5); AI hist while corruption ≥ 60) |
| `pilgrims_at_the_gate` (2) | Pilgrims at the Gate | `hermitage` | Kingson | Pilgrims bound for the Zilin Hills. **Let them pass freely** (footholds(1); stab 0.02; AI hist) / **Pilgrims pay the toll** (pp 25) |
| `kingson_envoys` (3) | Envoys from the Gate | `generic_wilds` | Magical Forest | **Hear them** (opinion +15 both ways; grievance(−3); AI 60) / **Words are cheap** |
| `gates_opened` (4) | The Gates of Kingson Open | `generic_war` | Magical Forest | **Accept the companies** (opinion +25 both ways; AI 30, ×0.5 historical) / **We defend our own** |
| `refugees_at_the_gate` (5) | Refugees at the Gate | `generic_war` | Kingson | **Shelter them** (mp 2000; stab −0.02; grievance(−5)) / **The gate stays shut** (stab 0.02; AI hist) |

`zin_lore.107` (Customs at the Wall) is the start-year flavour event for Kingson; the elves spec's `zin_elves.71` and `zin_elves.10` reach Kingson too.

### AI

Historical: A and B first; the_full_toll (hist; the Golden Court sets the tolls), customs_for_parim; C from 1750; keepers_of_the_accord in 1752. E: shut_the_gates (hist), the_wall_holds, refugees_through_the_gate (turn away), the_heirs_gate in 1757. honest_tolls and open_the_gates hist 0; under `FREE`: honest_tolls when grievance ≥ 40, open_the_gates when the elven envoys came and Aenor declined.

---

## 7. Hunhun

| Item | Value |
| --- | --- |
| Tree id | `regional_hunhun` |
| Country | Hunhun (Middle Lands; 3 states; men, tradition riders; Wild, Freeholds; dominion of Aenor) |
| Focuses | 31; columns 0–15 |
| Events | `zin_regional_hunhun` |
| Start values | loyalty 55 (Old Charter); footholds 2 |

### Situation in 4A 1748

The riders of Hunhun are the Concord's horsemen: three states of open grass where brotherhoods of riders elect a Horse-Lord from among their ride-captains (proposed). They sell remounts to the Royal Army, escort merchants on the lake roads and scout for the crown's marches. The Golden Court buys their horses and pays late. The riders laugh at that over beer and remember every debt. Text uses only "Hunhun"; whether the old name Huhun means the same place stays open.

### Role in the story

- **Historical path:** obeys the crown; rides for Aenor's realm in the war; joins the Heir's coalition through Aenor in 1757.
- **War of the Last Crowns:** the fastest riders of the Middle Lands; scouts and raiders on every front.
- **Alternatives:** riders of the Free Dominions, or riders for hire to whoever pays.

### Ruler and court

| Id | Name | Role | Traits / skill |
| --- | --- | --- | --- |
| `<Hunhun>_zin_ruler` | Horse-Lord Hunald | Country leader | `zin_trait_horse_lord` (new) |
| `zin_regional_hunhun_rhee` | Saddle-Master Ottar Rhee | Political advisor | `zin_adv_muster_master` |
| `zin_regional_hunhun_vane` | Herd-Mother Gisla Vane | Political advisor | `zin_adv_elder` |
| `zin_regional_hunhun_asher` | Remount-Factor Pell Asher | Political advisor | `zin_adv_merchant_prince` |
| `zin_regional_hunhun_morrow` | Ride-Captain Saska Morrow | Corps commander | skill 3; `cavalry_leader`, `organizer` |

### Branches

| Br. | Branch | Columns | Opens | Focuses |
| --- | --- | --- | --- | ---: |
| A | The Riders' Moot | 0–2 | start | 6 |
| B | Herds and Remounts | 4–6 | start | 6 |
| C | The Riders of Hunhun | 8–12 | start | 8 |
| D | Charter and Saddle | 13–15 | start | 6 |
| E | The Long Ride | 6–10 | Story | 5 |

### Focuses

| Br. | Key | Name | Icon | Prerequisites | Excl. | x,y | Days | Effects |
| --- | --- | --- | --- | --- | --- | --- | ---: | --- |
| A | `the_riders_moot` | **The Riders' Moot** | `council_table` | — | — | 1,0 | 35 | pp 50; spirit `riders_moot` |
| A | `elect_the_ride_captains` | Elect the Ride-Captains | `banner_plain` | the_riders_moot | — | 0,1 | 70 | pp 25; stab 0.03 |
| A | `the_open_grass` | The Open Grass | `herds` | the_riders_moot | — | 2,1 | 35 | event `a_quarrel_over_grazing` |
| A | `horse_lords_law` | The Horse-Lord's Law | `seal_royal` | elect_the_ride_captains | — | 0,2 | 70 | swap riders_moot→riders_moot_2 |
| A | `the_temple_tents` | The Temple Tents | `house_first_light` | the_open_grass | — | 2,2 | 35 | event `deliverers_tents` |
| A | `one_ride_one_lord` | One Ride, One Lord | `crown_iron` | horse_lords_law / the_temple_tents | — | 1,3 | 70 | pp 75; stab 0.05 |
| B | `herds_of_hunhun` | Herds of Hunhun | `herds` | — | — | 5,0 | 70 | spirit `great_herds` |
| B | `remount_contracts` | **Remount Contracts** | `scroll_treaty` | herds_of_hunhun | — | 4,1 | 35 | Avail: Concord dominion. event_for overlord `remount_contracts` |
| B | `saddleries` | Saddleries | `workshop_tools` | herds_of_hunhun | — | 6,1 | 70 | bld industrial_complex 1 @capital |
| B | `horse_roads` | Horse Roads | `roads_paved` | remount_contracts | — | 4,2 | 70 | bld infrastructure 1 @random_owned ×2 |
| B | `escort_companies` | Escort Companies | `caravan` | saddleries | — | 6,2 | 70 | mp −500; spirit `escort_companies` |
| B | `wealth_on_hooves` | Wealth on Hooves | `coin_chest` | horse_roads / escort_companies | — | 5,3 | 70 | bld arms_factory 1 @random_owned; swap great_herds→great_herds_2 |
| C | `riders_of_hunhun` | **The Riders of Hunhun** | `horse_cavalry` | — | — | 10,0 | 70 | army_xp 15; res [zin_cat_mounts] 0.5 ×1 |
| C | `horse_archery` | Horse Archery | `bow_archers` | riders_of_hunhun | — | 8,1 | 70 | res [zin_cat_bows] 0.5 ×1; res [zin_cat_mounts] 0.5 ×1 |
| C | `the_scouting_ride` | The Scouting Ride | `scout_lantern` | riders_of_hunhun | — | 10,1 | 35 | spirit `scouting_ride` |
| C | `heavy_riders` | Heavy Riders | `knight_lance` | riders_of_hunhun | — | 12,1 | 70 | res [zin_cat_armour] 0.5 ×1 |
| C | `riding_drills` | Riding Drills | `war_drums` | horse_archery / the_scouting_ride | — | 9,2 | 70 | spirit `riding_drills` |
| C | `swift_as_wind` | Swift as Wind | `horse_cavalry` | the_scouting_ride / heavy_riders | — | 11,2 | 70 | swap riding_drills→riding_drills_2 (adds the spirit if missing) |
| C | `ride_captains` | The Ride-Captains | `banner_league` | riding_drills | — | 8,3 | 70 | spirit `ride_captains` |
| C | `the_great_ride` | The Great Ride | `horse_cavalry` | riding_drills + swift_as_wind | — | 10,3 | 70 | mp 2000; army_xp 10 |
| D | `the_saddle_charter` | The Saddle Charter | `charter_old` | — | — | 14,0 | 35 | loyalty(3); pp 25 |
| D | `riders_for_the_royal_army` | Riders for the Royal Army | `sword_shield` | the_saddle_charter | — | 13,1 | 70 | Avail: Concord dominion. loyalty(5); army_xp 10; mp −1000 |
| D | `old_freedoms_of_the_ride` | The Old Freedoms of the Ride | `charter_free` | the_saddle_charter | — | 15,1 | 35 | pp 50; petition(free). hist 0 |
| D | `scouts_for_the_lost_cause` | Scouts for the Lost Cause | `eye_watchful` | riders_for_the_royal_army | — | 13,2 | 70 | lost_cause(5); army_xp 5 |
| D | `riders_of_the_free_dominions` | Riders of the Free Dominions | `chain_broken` | old_freedoms_of_the_ride | — | 15,2 | 35 | Avail: `zin_golden_king_dead`. camp(dominions, 5); flag `zin_hunhun_free_riders`. hist 0 |
| D | `lords_of_horses` | Lords of Horses, Not of Men | `banner_plain` | scouts_for_the_lost_cause / riders_of_the_free_dominions | — | 14,3 | 70 | stab 0.05; spirit `free_riders` |
| E | `the_long_ride` | **The Long Ride** | `horse_cavalry` | — | — | 8,5 | 35 | Avail: Story. ws 0.10; spirit `the_long_ride` |
| E | `harry_the_invaders` | Harry the Invaders | `war_drums` | the_long_ride | — | 6,6 | 70 | Avail: at war. army_xp 15 |
| E | `riders_at_the_crossings` | Riders at the Crossings | `river_ford` | the_long_ride | — | 8,6 | 70 | mp 3000 |
| E | `ride_with_the_heir` | Ride with the Heir | `lone_sword` | the_long_ride | — | 10,6 | 70 | Avail: `zin_eindil_returned`. coalition (if not already in his war); regard(10) |
| E | `home_to_the_grass` | Home to the Grass | `olive_branch` | harry_the_invaders / riders_at_the_crossings / ride_with_the_heir | — | 8,7 | 70 | Avail: End. pp 50; stab 0.10; remove `the_long_ride` |

### Spirits

| Key | Name | Modifiers |
| --- | --- | --- |
| `riders_moot` | The Riders' Moot | `stability_factor` 0.03, `political_power_gain` 0.05 |
| `riders_moot_2` | The Horse-Lord's Law | `stability_factor` 0.05, `political_power_gain` 0.10 |
| `great_herds` | Herds of Hunhun | `monthly_population` 0.03, `trade_opinion_factor` 0.10 |
| `great_herds_2` | Wealth on Hooves | `monthly_population` 0.05, `trade_opinion_factor` 0.15, `political_power_gain` 0.05 |
| `escort_companies` | Escort Companies | `trade_opinion_factor` 0.10, `political_power_gain` 0.05 |
| `scouting_ride` | The Scouting Ride | `army_intel_factor` 0.10 |
| `riding_drills` | Riding Drills | `cavalry_attack_factor` 0.05, `cavalry_defence_factor` 0.05 |
| `riding_drills_2` | Swift as Wind | `cavalry_attack_factor` 0.10, `cavalry_defence_factor` 0.05, `army_speed_factor` 0.05 |
| `ride_captains` | The Ride-Captains | `army_leader_start_level` 1 |
| `free_riders` | Lords of Horses | `drift_defence_factor` 0.15, `autonomy_gain_global_factor` 0.10 |
| `the_long_ride` | The Long Ride | `cavalry_attack_factor` 0.10, `army_morale_factor` 0.05 |

### Events (`zin_regional_hunhun`)

| Key (id) | Title | Picture | To | Options |
| --- | --- | --- | --- | --- |
| `a_quarrel_over_grazing` (1) | A Quarrel over Grazing | `generic_wilds` | Hunhun | **The Horse-Lord judges** (pp −25; stab 0.03) / **Let the ride-captains race for it** (ws 0.02; army_xp 5) |
| `deliverers_tents` (2) | The Deliverer's Tents | `houses` | Hunhun | **Welcome the healers** (footholds(1); stab 0.02; AI hist) / **Riders heal their own** |
| `remount_contracts` (3) | Remount Contracts | `generic_court` | overlord | **Pay a fair price** (pp −25; Hunhun loyalty(8)) / **Pay late, as always** (pp 25; Hunhun loyalty(−5); AI 70 while the Golden King lives) |

### AI

Historical: B and C first, A, then D (riders_for_the_royal_army, scouts_for_the_lost_cause); E when available. Under `FREE`: the Free Dominions path when loyalty < 40.

---

## 8. Hiloron

| Item | Value |
| --- | --- |
| Tree id | `regional_hiloron` |
| Country | Hiloron (Middle Lands; 2 states; giants; Light, Warden Host; dominion of Aenor) |
| Focuses | 32; columns 0–16 |
| Events | `zin_regional_hiloron` |
| Start values | loyalty 60 (Old Charter); footholds 1 |

### Situation in 4A 1748

Hiloron's giants keep a lake republic in the south-west of the Middle Lands, two states of quarries and deep water beside Novez. A council of chiefs governs under the Charters, slowly and honestly. The giants remember the crossings of the First Age war, when their forebears carried the allied hosts over rivers (proposed); the Keepers of the Crossings sing it every year. Hiloron is loyal, small and respected. Its quarrel with Parim is the price of stone.

### Role in the story

- **Historical path:** steady loyalty; in 1754 Hiloron heeds the Stranger's warning (journey); in the war its giants fight in Aenor's realm and in the coalition.
- **War of the Last Crowns:** a small host of great kin; shock and siege against the dead.
- **Alternatives:** a giant host that marches early under the Lost Cause.

### Ruler and court

| Id | Name | Role | Traits / skill |
| --- | --- | --- | --- |
| `<Hiloron>_zin_ruler` | High Chief Oronas | Country leader (a giant) | `zin_trait_lawspeaker` |
| `zin_regional_hiloron_hulmar` | Stone-Speaker Hulmar | Political advisor | `zin_adv_elder` |
| `zin_regional_hiloron_brannagh` | Brannagh, Keeper of the Crossings | Political advisor | `zin_adv_sage` |
| `zin_regional_hiloron_orsk` | Lake-Warden Orsk | Political advisor | `zin_adv_road_warden` |
| `zin_regional_hiloron_gorrum` | War-Chief Gorrum the Tall | Corps commander | skill 3; `old_guard`, `inspirational_leader` |

### Branches

| Br. | Branch | Columns | Opens | Focuses |
| --- | --- | --- | --- | ---: |
| A | The Lake Council | 0–2 | start | 6 |
| B | Memory of the Crossings | 4–6 | start | 6 |
| C | The Giant Host | 8–10 | start | 7 |
| D | Lake, Quarry and Charter | 12–16 | start | 8 |
| E | The Giants Wake | 5–9 | Story | 5 |

### Focuses

| Br. | Key | Name | Icon | Prerequisites | Excl. | x,y | Days | Effects |
| --- | --- | --- | --- | --- | --- | --- | ---: | --- |
| A | `the_lake_council` | **The Lake Council** | `council_table` | — | — | 1,0 | 35 | pp 50; spirit `lake_council` |
| A | `chiefs_of_the_shore` | Chiefs of the Shore | `lake_town` | the_lake_council | — | 0,1 | 70 | pp 25; stab 0.03 |
| A | `the_long_memory` | The Long Memory | `book_lore` | the_lake_council | — | 2,1 | 35 | event `the_crossings_remembered` |
| A | `council_of_stone` | Council of Stone | `rune_stone` | chiefs_of_the_shore | — | 0,2 | 70 | swap lake_council→lake_council_2 |
| A | `law_of_the_lake` | Law of the Lake | `seal_royal` | the_long_memory | — | 2,2 | 70 | stab 0.05 |
| A | `the_council_endures` | The Council Endures | `council_table` | council_of_stone / law_of_the_lake | — | 1,3 | 70 | pp 75 |
| B | `memory_of_the_crossings` | **Memory of the Crossings** | `river_ford` | — | — | 5,0 | 35 | spirit `memory_of_the_crossings` |
| B | `songs_of_the_alliance` | Songs of the Alliance | `alliance_rings` | memory_of_the_crossings | — | 4,1 | 35 | ws 0.03; stab 0.02 |
| B | `keepers_of_the_old_ways` | Keepers of the Old Ways | `scroll_sealed` | memory_of_the_crossings | — | 6,1 | 70 | res [zin_cat_wards] 0.5 ×1 |
| B | `the_first_men_remembered` | The First Men Remembered | `heir_rolls` | songs_of_the_alliance | — | 4,2 | 70 | pp 25; if `zin_eindil_named`: regard(10) |
| B | `hear_the_stranger` | **Hear the Stranger** | `lone_sword` | keepers_of_the_old_ways | — | 6,2 | 35 | Avail: `zin_eindil_stage` above 7. If not flag `zin_eindil_heeded`: flag it and timed `zin_eindil_warning_heeded` 730. regard(15) |
| B | `an_old_debt_repaid` | An Old Debt Repaid | `handshake_oath` | the_first_men_remembered / hear_the_stranger | — | 5,3 | 70 | Avail: `zin_eindil_returned`. coalition (if not already in his war); regard(10) |
| C | `the_giant_host` | **The Giant Host** | `giant_hammer` | — | — | 9,0 | 70 | army_xp 10; res [zin_cat_kin] 0.5 ×1 |
| C | `hurlers_of_stone` | Hurlers of Stone | `siege_trebuchet` | the_giant_host | — | 8,1 | 70 | res [zin_cat_siege] 0.5 ×1 |
| C | `great_mauls` | Great Mauls | `giant_hammer` | the_giant_host | — | 10,1 | 70 | res [zin_cat_kin] 0.5 ×1 |
| C | `the_stride` | The Stride | `mountain_pass` | hurlers_of_stone | — | 8,2 | 70 | spirit `giants_stride` |
| C | `shield_of_giants` | Shield of Giants | `sword_shield` | great_mauls | — | 10,2 | 70 | spirit `shield_of_giants` |
| C | `war_chiefs` | War-Chiefs | `war_council_map` | the_stride / shield_of_giants | — | 9,3 | 70 | army_xp 15; spirit `war_chiefs` |
| C | `the_host_of_hiloron` | The Host of Hiloron | `levy_muster` | war_chiefs | — | 9,4 | 70 | mp 500; swap giants_stride→giants_stride_2 (adds if missing) |
| D | `lake_and_quarry` | Lake and Quarry | `quarry_stone` | — | — | 13,0 | 70 | bld industrial_complex 1 @capital |
| D | `the_quarries` | The Quarries | `quarry_stone` | lake_and_quarry | — | 12,1 | 70 | bld industrial_complex 1 @random_owned |
| D | `lake_boats` | Lake Boats | `fishing_boats` | lake_and_quarry | — | 14,1 | 70 | bld infrastructure 1 @capital; spirit `lake_boats` |
| D | `stone_roads` | Stone Roads | `roads_paved` | the_quarries | — | 12,2 | 70 | bld infrastructure 1 @random_owned |
| D | `trade_with_novez` | Trade with Novez | `caravan` | lake_boats | — | 14,2 | 35 | Avail: exists Novez. event_for Novez `hiloron_trade` |
| D | `a_rich_shore` | A Rich Shore | `coin_chest` | stone_roads / trade_with_novez | — | 13,3 | 70 | bld arms_factory 1 @random_owned; stab 0.03 |
| D | `the_old_charter_of_hiloron` | The Old Charter | `charter_old` | — | — | 16,0 | 35 | loyalty(3); pp 25 |
| D | `levies_of_giants` | Levies of Giants | `spear_levy` | the_old_charter_of_hiloron | — | 16,1 | 70 | Avail: Concord dominion. loyalty(5); army_xp 5; mp −300 |
| E | `the_giants_wake` | **The Giants Wake** | `giant_hammer` | — | — | 7,6 | 35 | Avail: Story. ws 0.10; spirit `giants_wake` |
| E | `stones_against_the_dead` | Stones Against the Dead | `bones_risen` | the_giants_wake | — | 5,7 | 70 | Avail: `zin_zol_rising` or `zin_volgan_marches`. army_xp 10; res [zin_cat_siege] 0.5 ×1 |
| E | `the_lake_holds` | The Lake Holds | `fort_wall` | the_giants_wake | — | 7,7 | 70 | bld bunker 2 @capital |
| E | `charter_and_shield` | Charter and Shield | `charter_shield` | the_giants_wake | — | 9,7 | 70 | Avail: Concord dominion. loyalty(5); lost_cause(3) |
| E | `hiloron_endures` | Hiloron Endures | `olive_branch` | stones_against_the_dead / the_lake_holds / charter_and_shield | — | 7,8 | 70 | Avail: End. stab 0.10; remove `giants_wake` |

### Spirits

| Key | Name | Modifiers |
| --- | --- | --- |
| `lake_council` | The Lake Council | `stability_factor` 0.05, `political_power_factor` 0.05 |
| `lake_council_2` | Council of Stone | `stability_factor` 0.08, `political_power_factor` 0.10 |
| `memory_of_the_crossings` | Memory of the Crossings | `research_speed_factor` 0.03, `war_support_factor` 0.03 |
| `giants_stride` | The Stride | `army_armor_attack_factor` 0.05, `army_armor_speed_factor` 0.05 |
| `giants_stride_2` | The Host of Hiloron | `army_armor_attack_factor` 0.10, `army_armor_speed_factor` 0.05, `breakthrough_factor` 0.05 |
| `shield_of_giants` | Shield of Giants | `army_armor_defence_factor` 0.10 |
| `war_chiefs` | War-Chiefs | `army_leader_start_level` 1 |
| `lake_boats` | Lake Boats | `trade_opinion_factor` 0.10 |
| `giants_wake` | The Giants Wake | `army_armor_attack_factor` 0.10, `war_support_factor` 0.05 |

### Events (`zin_regional_hiloron`)

| Key (id) | Title | Picture | To | Options |
| --- | --- | --- | --- | --- |
| `the_crossings_remembered` (1) | The Crossings Remembered | `generic_wilds` | Hiloron | The Keepers sing of the ancient crossings. Flavour; **Sing it again** (stab 0.02). Never names where Dardan lay |
| `hiloron_trade` (2) | Stone from Hiloron | `generic_peace` | Novez | **Trade with the giants** (opinion +15 both ways; Novez pp 25; AI 70) / **Novez has its own quarries** |

### AI

Historical: A, C, D, B in turn; hear_the_stranger in 1754 (historical heeder); E when available.

---

## 9. Bloody Forest

| Item | Value |
| --- | --- |
| Tree id | `regional_bloody_forest` |
| Country | Bloody Forest (Middle Lands; 3 states; men; Wild, Tribal Chieftaincy; independent) |
| Focuses | 32; columns 0–14 |
| Events | `zin_regional_bloody_forest` |
| Start values | no loyalty (outside the Concord); footholds 0 |

### Situation in 4A 1748

The Bloody Forest is a hostile woodland enclave in the north of the Middle Lands that never accepted the Charters (established: it resists Aenor). Its tribes take their name from the red-barked trees of the deep woods and from old feuds (proposed); Chieftain Rasvan Redbark leads their moot. Tax-carts that stray onto the forest roads come back empty, if they come back. The crown calls them bandits; they call themselves free. Nobody is at war: borders are closed and raids are rumours, not campaigns.

### Role in the story

- **Historical path:** stays apart and hostile; Aenor does not move against it before the King's death (Aenor's *Pacify the Bloody Forest* has AI weight 0 then). In the war the forest closes; whether its tribes fight the dead, take gifts from the south or stay hidden is a play choice, never history.
- **War of the Last Crowns:** a closed wood on the edge of the fronts; a refuge or a danger.
- **Alternatives:** a truce with Parim; the forest with the living; or the forest with the south.

### Ruler and court

| Id | Name | Role | Traits / skill |
| --- | --- | --- | --- |
| `<Bloody Forest>_zin_ruler` | Chieftain Rasvan Redbark | Country leader | `zin_trait_warband_chief` |
| `zin_regional_bloody_forest_morga` | Blood-Speaker Morga | Political advisor | `zin_adv_war_speaker` |
| `zin_regional_bloody_forest_gaff` | Old Tanner Gaff | Political advisor | `zin_adv_elder` |
| `zin_regional_bloody_forest_crow` | Fence-Wife Ilsa Crow | Political advisor | `zin_adv_treasurer` |
| `zin_regional_bloody_forest_redhand` | Dagan Redhand | Corps commander | skill 2; `ambusher`, `trickster` |

### Branches

| Br. | Branch | Columns | Opens | Focuses |
| --- | --- | --- | --- | ---: |
| A | The Red Woods | 0–2 | start | 7 |
| B | Blood-Price | 4–6 | start | 6 |
| C | The Thorn Defence | 8–10 | start | 7 |
| D | Between the Crowns | 12–14 | start | 6 |
| E | The Red Woods at War | 5–9 | Story | 6 |

### Focuses

| Br. | Key | Name | Icon | Prerequisites | Excl. | x,y | Days | Effects |
| --- | --- | --- | --- | --- | --- | --- | ---: | --- |
| A | `the_red_woods` | **The Red Woods** | `forest_ancient` | — | — | 1,0 | 35 | pp 25; spirit `red_woods` |
| A | `the_tribal_moot` | The Tribal Moot | `council_table` | the_red_woods | — | 0,1 | 70 | stab 0.05 |
| A | `blood_feuds_settled` | Blood-Feuds Settled | `handshake_oath` | the_red_woods | — | 2,1 | 70 | stab 0.05; mp 1000 |
| A | `the_redbark_oath` | The Redbark Oath | `banner_plain` | the_tribal_moot | — | 0,2 | 70 | swap red_woods→red_woods_2 |
| A | `the_closed_border` | The Closed Border | `fort_wall` | blood_feuds_settled | — | 2,2 | 35 | spirit `closed_border` |
| A | `chieftains_of_the_hollows` | Chieftains of the Hollows | `crown_iron` | the_redbark_oath / the_closed_border | — | 1,3 | 70 | pp 50; army_xp 10 |
| A | `one_forest` | One Forest | `banner_league` | chieftains_of_the_hollows | — | 1,4 | 70 | pp 50; stab 0.05 |
| B | `the_blood_price` | The Blood-Price | `coin_chest` | — | — | 5,0 | 35 | event `tax_cart_on_the_forest_road` |
| B | `smugglers_paths` | Smugglers' Paths | `scout_lantern` | the_blood_price | — | 4,1 | 70 | spirit `smugglers` |
| B | `furs_and_amber` | Furs and Amber | `market_stalls` | the_blood_price | — | 6,1 | 70 | bld industrial_complex 1 @capital |
| B | `hired_axes` | Hired Axes | `levy_muster` | smugglers_paths | — | 4,2 | 70 | spirit `hired_axes` |
| B | `the_forest_market` | The Forest Market | `market_stalls` | furs_and_amber | — | 6,2 | 70 | bld infrastructure 1 @capital; bld industrial_complex 1 @random_owned |
| B | `wealth_of_the_woods` | Wealth of the Woods | `tribute_chest` | hired_axes / the_forest_market | — | 5,3 | 70 | bld arms_factory 1 @capital |
| C | `the_thorn_defence` | **The Thorn Defence** | `fort_wall` | — | — | 9,0 | 70 | army_xp 10; bld bunker 1 @capital |
| C | `forest_ambush` | Forest Ambush | `wild_hunt` | the_thorn_defence | — | 8,1 | 70 | spirit `forest_ambush` |
| C | `bowmen_of_the_hollows` | Bowmen of the Hollows | `bow_archers` | the_thorn_defence | — | 10,1 | 70 | res [zin_cat_bows] 0.5 ×1 |
| C | `deadfalls_and_snares` | Deadfalls and Snares | `workshop_tools` | forest_ambush | — | 8,2 | 35 | bld bunker 1 @random_owned ×2 |
| C | `war_bands` | War-Bands | `war_drums` | bowmen_of_the_hollows | — | 10,2 | 70 | mp 2000; res [zin_cat_arms] 0.5 ×1 |
| C | `the_red_ambush` | The Red Ambush | `goblin_raiders` | deadfalls_and_snares / war_bands | — | 9,3 | 70 | swap forest_ambush→forest_ambush_2 (adds if missing) |
| C | `no_road_through` | No Road Through | `fort_wall` | the_red_ambush | — | 9,4 | 70 | bld bunker 2 @capital |
| D | `between_the_crowns` | Between the Crowns | `banner_plain` | — | — | 13,0 | 35 | pp 25 |
| D | `a_truce_with_parim` | **A Truce with Parim** | `olive_branch` | between_the_crowns | the_old_defiance | 12,1 | 35 | Avail: an Aenor realm exists; not at war with it. event_for the ruling Aenor realm `forest_truce_offer` |
| D | `the_old_defiance` | The Old Defiance | `chain_broken` | between_the_crowns | a_truce_with_parim | 14,1 | 35 | ws 0.05; spirit `old_defiance` |
| D | `words_with_the_veiled` | Words with the Veiled | `envoy` | a_truce_with_parim / the_old_defiance | — | 12,2 | 35 | Avail: exists Cursed Lands. event_for Cursed Lands `redbark_envoys` |
| D | `outlaws_welcome` | Outlaws Welcome | `exile_court` | the_old_defiance | — | 14,2 | 70 | mp 1500; stab −0.03 |
| D | `masters_of_our_woods` | Masters of Our Woods | `forest_ancient` | words_with_the_veiled / outlaws_welcome | — | 13,3 | 70 | pp 75; stab 0.05 |
| E | `the_woods_close` | **The Woods Close** | `fort_wall` | — | — | 7,6 | 35 | Avail: Story. ws 0.10; spirit `woods_closed` |
| E | `blood_for_the_living` | Blood for the Living | `handshake_oath` | the_woods_close | gifts_from_the_south | 5,7 | 70 | Avail: `zin_volgan_marches` or `zin_zol_rising`. flag `zin_bloody_forest_with_the_living`; ws 0.05; event_for the ruling Aenor realm `the_forest_offers_blades` |
| E | `the_hunters_war` | The Hunters' War | `wild_hunt` | the_woods_close | — | 7,7 | 70 | Avail: at war. army_xp 15; mp 2000 |
| E | `gifts_from_the_south` | Gifts from the South | `tribute_chest` | the_woods_close | blood_for_the_living | 9,7 | 70 | Avail: `zin_volgan_marches`, not `zin_volgan_body_destroyed`. eq 1000; flag `zin_bloody_forest_took_gifts`; `call zin_politics_add_drift {IDEOLOGY: shadow, VALUE: 5}`. hist 0 |
| E | `the_forest_follows_the_heir` | The Forest Follows the Heir | `lone_sword` | blood_for_the_living / the_hunters_war | — | 6,8 | 70 | Avail: `zin_eindil_returned`; not flag `zin_bloody_forest_took_gifts`. coalition; regard(10) |
| E | `the_forest_endures` | The Forest Endures | `olive_branch` | the_hunters_war / gifts_from_the_south | — | 8,8 | 70 | Avail: End. stab 0.10; remove `woods_closed` |

### Spirits

| Key | Name | Modifiers |
| --- | --- | --- |
| `red_woods` | The Red Woods | `war_support_factor` 0.05, `army_core_defence_factor` 0.05 |
| `red_woods_2` | The Redbark Oath | `war_support_factor` 0.05, `army_core_defence_factor` 0.10, `stability_factor` 0.03 |
| `closed_border` | The Closed Border | `drift_defence_factor` 0.20, `trade_opinion_factor` −0.10 |
| `smugglers` | Smugglers' Paths | `consumer_goods_factor` −0.03 |
| `hired_axes` | Hired Axes | `war_support_factor` 0.05, `army_attack_factor` 0.03 |
| `forest_ambush` | Forest Ambush | `army_defence_factor` 0.05, `army_attack_factor` 0.03 |
| `forest_ambush_2` | The Red Ambush | `army_defence_factor` 0.10, `army_attack_factor` 0.05 |
| `old_defiance` | The Old Defiance | `war_support_factor` 0.05, `army_core_defence_factor` 0.05 |
| `forest_truce` | The Forest Truce | `stability_factor` 0.05 |
| `woods_closed` | The Woods Close | `army_core_defence_factor` 0.15, `war_support_factor` 0.05 |

### Events (`zin_regional_bloody_forest`)

| Key (id) | Title | Picture | To | Options |
| --- | --- | --- | --- | --- |
| `tax_cart_on_the_forest_road` (1) | A Tax-Cart on the Forest Road | `generic_wilds` | Bloody Forest | **Take the cart** (pp 25; opinion −10 with the ruling Aenor realm) / **Let it pass** (stab 0.02) / **Ask a toll** (pp 15; AI) |
| `forest_truce_offer` (2) | The Forest Asks for a Truce | `generic_court` | ruling Aenor realm | **Grant it** (non-aggression with Bloody Forest; pp −25; Bloody Forest gets spirit `forest_truce`; AI 40, 70 after `zin_golden_king_dead`) / **Bandits get no treaties** |
| `redbark_envoys` (3) | Envoys from the Red Woods | `generic_wilds` | Cursed Lands | **Agree to leave each other be** (non-aggression; opinion +20 both ways; AI 60) / **The veil stays closed** |
| `the_forest_offers_blades` (4) | The Forest Offers Its Blades | `generic_war` | ruling Aenor realm | **Accept** (military access both ways; opinion +25 both ways; AI 60) / **We need no bandits** |

The text of *Gifts from the South* speaks of "a stranger from the south who brings iron and promises" and never says whom he serves.

### AI

Historical: A, C, B; the_old_defiance (hist), outlaws_welcome; E: the_woods_close, the_hunters_war. blood_for_the_living and gifts_from_the_south hist 0. Under `FREE`: the truce when the Gathering Dark is below 25; blood_for_the_living when Aenor's opinion ≥ 0; gifts_from_the_south only with `zin_rule_dark_powers = AGGRESSIVE`.

---

## 10. Cursed Lands

| Item | Value |
| --- | --- |
| Tree id | `regional_cursed_lands` |
| Country | Cursed Lands (Middle Lands; 1 state; men; Wild, Seclusion; independent) |
| Focuses | 30; columns 0–13 |
| Events | `zin_regional_cursed_lands` |
| Start values | no loyalty; footholds 0 |

### Situation in 4A 1748

The Cursed Lands reject the crown (established), and very little else is known of them. Parim calls the land cursed; its people do not say why. They live in one hidden valley country behind closed roads, govern themselves under the Veiled Elder, and keep barrows older than the Concord (proposed landscape). They trade little and ask for nothing. The character spec fixes the rule for this tree: they want to be left alone, and nothing more is invented about who they are.

**Proposed reading, for the owner to accept or replace:** the barrows are old grave-fields from the long darkness of the Third Age that the people of the valley keep quiet. Game text never states this: it speaks of "the barrows" and "what the mounds keep", and the open question below asks the owner.

### Role in the story

- **Historical path:** stays apart; the veil holds; Aenor's claims (from *Pacify the Bloody Forest*) are never pressed before the King's death.
- **War of the Last Crowns:** when the dead walk, the valley either bars its barrows or opens its veil to the living. Neither is history.

### Ruler and court

| Id | Name | Role | Traits |
| --- | --- | --- | --- |
| `<Cursed Lands>_zin_ruler` | The Veiled Elder | Country leader (title only) | `zin_trait_veiled_elder` (new) |
| `zin_regional_cursed_lands_keeper` | The Keeper of the Barrows | Political advisor (title only) | `zin_adv_elder` |
| `zin_regional_cursed_lands_warden` | The Warden of the Edge | Political advisor (title only) | `zin_adv_muster_master` |
| `zin_regional_cursed_lands_tally` | The Tally-Keeper | Political advisor (title only) | `zin_adv_treasurer` |

Portraits show veiled or hooded figures; no faces.

### Branches

| Br. | Branch | Columns | Opens | Focuses |
| --- | --- | --- | --- | ---: |
| A | The Veil | 0–2 | start | 7 |
| B | The Barrow-Keepers | 4–6 | start | 6 |
| C | The Hidden Valley | 8–10 | start | 5 |
| D | Strangers at the Edge | 11–13 | start | 6 |
| E | When the Dead Walk | 4–8 | `zin_zol_rising`, `zin_volgan_marches` or `zin_war_of_last_crowns` | 6 |

### Focuses

| Br. | Key | Name | Icon | Prerequisites | Excl. | x,y | Days | Effects |
| --- | --- | --- | --- | --- | --- | --- | ---: | --- |
| A | `the_veil` | **The Veil** | `ward_circle` | — | — | 1,0 | 35 | spirit `the_veil` |
| A | `no_road_in` | No Road In | `fort_wall` | the_veil | — | 0,1 | 70 | bld bunker 1 @capital |
| A | `the_elders_silence` | The Elder's Silence | `scroll_sealed` | the_veil | — | 2,1 | 35 | pp 25; stab 0.05 |
| A | `watchers_at_the_edge` | Watchers at the Edge | `eye_watchful` | no_road_in | — | 0,2 | 70 | spirit `edge_watchers` |
| A | `the_unspoken_law` | The Unspoken Law | `seal_royal` | the_elders_silence | — | 2,2 | 70 | stab 0.05 |
| A | `a_people_apart` | A People Apart | `banner_plain` | watchers_at_the_edge / the_unspoken_law | — | 1,3 | 70 | swap the_veil→the_veil_2 |
| A | `the_veil_holds` | The Veil Holds | `ward_circle` | a_people_apart | — | 1,4 | 70 | pp 50; stab 0.05 |
| B | `the_barrow_keepers` | **The Barrow-Keepers** | `grave_field` | — | — | 5,0 | 35 | res [zin_cat_wards] 0.5 ×1 |
| B | `lanterns_on_the_mounds` | Lanterns on the Mounds | `beacon` | the_barrow_keepers | — | 4,1 | 70 | spirit `barrow_lanterns` |
| B | `the_old_tallies` | The Old Tallies | `ledger_coins` | the_barrow_keepers | — | 6,1 | 35 | event `the_old_tallies` |
| B | `quiet_earth` | Quiet Earth | `grave_field` | lanterns_on_the_mounds | — | 4,2 | 70 | res [zin_cat_wards] 0.5 ×1 |
| B | `the_keepers_oath` | The Keepers' Oath | `handshake_oath` | the_old_tallies | — | 6,2 | 70 | stab 0.05; ws 0.03 |
| B | `the_mounds_are_quiet` | The Mounds Are Quiet | `rune_stone` | quiet_earth / the_keepers_oath | — | 5,3 | 70 | swap barrow_lanterns→barrow_lanterns_2 (adds if missing) |
| C | `the_hidden_valley` | The Hidden Valley | `mountain_pass` | — | — | 9,0 | 70 | bld infrastructure 1 @capital |
| C | `terraced_fields` | Terraced Fields | `farm_sowing` | the_hidden_valley | — | 8,1 | 70 | spirit `terraces` |
| C | `charcoal_and_iron` | Charcoal and Iron | `foundry_fire` | the_hidden_valley | — | 10,1 | 70 | bld industrial_complex 1 @capital |
| C | `the_inner_smithy` | The Inner Smithy | `forge_anvil` | charcoal_and_iron | — | 10,2 | 70 | bld arms_factory 1 @capital |
| C | `enough_for_ourselves` | Enough for Ourselves | `granary` | terraced_fields + the_inner_smithy | — | 9,3 | 70 | stab 0.05; spirit `self_sufficient` |
| D | `strangers_at_the_edge` | Strangers at the Edge | `envoy` | — | — | 12,0 | 35 | pp 25 |
| D | `words_with_the_redbarks` | Words with the Redbarks | `forest_ancient` | strangers_at_the_edge | — | 11,1 | 35 | Avail: exists Bloody Forest. event_for Bloody Forest `veiled_envoys` |
| D | `tax_men_turned_back` | The Tax-Men Turned Back | `toll_house` | strangers_at_the_edge | — | 13,1 | 35 | event `tax_men_at_the_edge` |
| D | `a_scholar_at_the_edge` | A Scholar at the Edge | `book_lore` | words_with_the_redbarks | — | 11,2 | 35 | Avail: after 1750.3.1 or `zin_lost_cause_shield`. event `a_scholar_asks` |
| D | `healers_from_outside` | Healers from Outside | `healer_herbs` | tax_men_turned_back | — | 13,2 | 35 | event `almoners_at_the_edge` |
| D | `a_crack_in_the_veil` | A Crack in the Veil | `scroll_treaty` | a_scholar_at_the_edge / healers_from_outside | — | 12,3 | 70 | pp 50; stab −0.02; spirit `crack_in_the_veil` |
| E | `when_the_dead_walk` | **When the Dead Walk** | `bones_risen` | — | — | 6,6 | 35 | Avail: `zin_zol_rising`, `zin_volgan_marches` or `zin_war_of_last_crowns`. ws 0.10; spirit `the_dead_walk` |
| E | `bar_the_barrows` | Bar the Barrows | `ward_circle` | when_the_dead_walk | open_the_veil | 4,7 | 70 | res [zin_cat_wards] 0.5 ×1; bld bunker 2 @capital; flag `zin_cursed_lands_barred` |
| E | `open_the_veil` | Open the Veil | `handshake_oath` | when_the_dead_walk | bar_the_barrows | 8,7 | 70 | remove `the_veil` and `the_veil_2`; stab −0.05; ws 0.05; flag `zin_cursed_lands_open` |
| E | `the_long_night_watch` | The Long Night Watch | `scout_lantern` | bar_the_barrows | — | 4,8 | 70 | army_xp 10; mp 1000 |
| E | `with_the_living` | With the Living | `banner_league` | open_the_veil | — | 8,8 | 70 | Avail: `zin_eindil_returned`. coalition; regard(10) |
| E | `the_veil_mended` | The Veil Mended | `ward_circle` | the_long_night_watch / with_the_living | — | 6,9 | 70 | Avail: End. stab 0.10; remove `the_dead_walk`; if flag `zin_cursed_lands_open`: spirit `the_veil` |

### Spirits

| Key | Name | Modifiers |
| --- | --- | --- |
| `the_veil` | The Veil | `drift_defence_factor` 0.25, `enemy_operative_detection_chance_factor` 0.15 |
| `the_veil_2` | A People Apart | `drift_defence_factor` 0.40, `enemy_operative_detection_chance_factor` 0.25, `army_core_defence_factor` 0.10 |
| `edge_watchers` | Watchers at the Edge | `army_intel_factor` 0.10 |
| `barrow_lanterns` | Lanterns on the Mounds | `army_core_defence_factor` 0.05, `stability_factor` 0.03 |
| `barrow_lanterns_2` | The Mounds Are Quiet | `army_core_defence_factor` 0.15, `stability_factor` 0.05 |
| `terraces` | Terraced Fields | `monthly_population` 0.05 |
| `self_sufficient` | Enough for Ourselves | `consumer_goods_factor` −0.03 |
| `crack_in_the_veil` | A Crack in the Veil | `trade_opinion_factor` 0.10, `research_speed_factor` 0.03 |
| `the_dead_walk` | When the Dead Walk | `army_core_defence_factor` 0.15, `war_support_factor` 0.05 |

### Events (`zin_regional_cursed_lands`)

| Key (id) | Title | Picture | To | Options |
| --- | --- | --- | --- | --- |
| `the_old_tallies` (1) | The Old Tallies | `generic_wilds` | Cursed Lands | The Tally-Keeper counts what the mounds keep, as every year. Flavour; **The count is the same** (stab 0.02). Never says what is counted |
| `veiled_envoys` (2) | Veiled Envoys | `generic_wilds` | Bloody Forest | **Leave each other be** (non-aggression; opinion +20 both ways; AI 60) / **The forest trusts no veil** |
| `tax_men_at_the_edge` (3) | Tax-Men at the Edge | `generic_wilds` | Cursed Lands | **Turn them back** (ws 0.03; opinion −10 with the ruling Aenor realm; AI) / **Pay a token** (pp −25; opinion +10) |
| `a_scholar_asks` (4) | A Scholar Asks | `generic_court` | Cursed Lands | A scholar of the Lost Cause asks to read the tallies. **Let him read** (lost_cause(3); opinion +5 with the ruling Aenor realm) / **Send him away** (AI hist) |
| `almoners_at_the_edge` (5) | Almoners at the Edge | `houses` | Cursed Lands | **Let them heal** (footholds(1); stab 0.03) / **The veil stays closed** (AI hist) |

### AI

Historical: A, C, B; tax_men_turned_back; never a_crack_in_the_veil; E: bar_the_barrows (hist 100), the_long_night_watch. Under `FREE`: open_the_veil when Eindil's regard ≥ 25.

---

## 11. Asgard (Aenor Isle)

| Item | Value |
| --- | --- |
| Tree id | `regional_asgard` |
| Country | Asgard (Aenor Isle, part of the Middle Lands; 1 state; men, tradition isle houses; Wild, Freeholds; dominion of Aenor) |
| Focuses | 33; columns 0–15 |
| Events | `zin_regional_asgard` |
| Start values | loyalty 75 (Old Charter); footholds 2 |

### Situation in 4A 1748

Asgard is the kingdom of Aenor Isle, off the Middle Lands' west coast, and the Concord's most loyal dominion. Its houses remember being the first port Aenoran ships reached (proposed) and still pilot the crown's ships across the wide central sea toward the West Lands. Queen Faberra sits in the house-moot with the lords of four old houses whose names the isle's drawn map keeps: Rish, Tinta, Holod and Faber (proposed reading). Fishing, shipwrights and western trade make the isle rich. The western courts trade here and resent Aenor's tariffs; that grudge is spoken over wine.

### Role in the story

- **Historical path:** loyal under every ruler; when the West crosses the sea in 4A 1755 the fleets land on Aenor Isle first (proposed by the Western Crossing spec) and the isle becomes a beachhead; after the western evacuation the isle rebuilds; it joins the coalition through Aenor's realm.
- **War of the Last Crowns:** the first target of the Western Crossing; the gate of the central sea.
- **Alternatives:** a barred isle that turns the first sailing to the mainland shore; or an isle that yields its harbours to spare its towns.

### Ruler and court

| Id | Name | Role | Traits / skill |
| --- | --- | --- | --- |
| `<Asgard>_zin_ruler` | Queen Faberra of Asgard | Country leader | `zin_trait_port_master` |
| `zin_regional_asgard_rish` | Lord Aldo of House Rish | Political advisor | `zin_adv_envoy` |
| `zin_regional_asgard_tinta` | Lady Tinne of House Tinta | Political advisor | `zin_adv_merchant_prince` |
| `zin_regional_asgard_holod` | Master Corvo of House Holod | Political advisor | `zin_adv_treasurer` |
| `zin_regional_asgard_dunholm` | Sea-Captain Merrit Dunholm | Navy leader | skill 3; `green_water_expert` |

### Branches

| Br. | Branch | Columns | Opens | Focuses |
| --- | --- | --- | --- | ---: |
| A | The Isle Houses | 0–2 | start | 7 |
| B | Harbours of the Isle | 4–8 | start | 8 |
| C | The Sea Watch | 9–11 | start | 7 |
| D | Crown and Isle | 13–15 | start | 5 |
| E | The Western Sails | 4–8 | `zin_western_crossing` or `zin_war_of_last_crowns` | 6 |

### Focuses

| Br. | Key | Name | Icon | Prerequisites | Excl. | x,y | Days | Effects |
| --- | --- | --- | --- | --- | --- | --- | ---: | --- |
| A | `the_isle_houses` | **The Isle Houses** | `council_table` | — | — | 1,0 | 35 | pp 50; spirit `house_moot` |
| A | `the_four_houses` | The Four Houses | `seal_royal` | the_isle_houses | — | 0,1 | 70 | pp 25; stab 0.03; event `the_house_moot` |
| A | `the_first_port` | The First Port | `harbour_lake` | the_isle_houses | — | 2,1 | 35 | stab 0.02; ws 0.02; loyalty(3) |
| A | `the_queens_peace` | The Queen's Peace | `olive_branch` | the_four_houses | — | 0,2 | 70 | swap house_moot→house_moot_2 |
| A | `chapels_by_the_harbour` | Chapels by the Harbour | `house_first_light` | the_first_port | — | 2,2 | 35 | event `chapel_by_the_harbour` |
| A | `the_house_ledgers` | The House Ledgers | `ledger_coins` | the_queens_peace / chapels_by_the_harbour | — | 1,3 | 70 | pp 50; spirit `house_ledgers` |
| A | `one_isle_one_queen` | One Isle, One Queen | `crown_iron` | the_house_ledgers | — | 1,4 | 70 | pp 50; stab 0.05 |
| B | `harbours_of_the_isle` | **Harbours of the Isle** | `harbour_lake` | — | — | 6,0 | 70 | bld naval_base 1 @capital; bld dockyard 1 @capital |
| B | `the_fishing_fleets` | The Fishing Fleets | `fishing_boats` | harbours_of_the_isle | — | 4,1 | 35 | spirit `isle_fisheries` |
| B | `isle_shipwrights` | Isle Shipwrights | `shipwright_yard` | harbours_of_the_isle | — | 6,1 | 70 | bld dockyard 1 @capital; res [zin_cat_galleys] 0.5 ×1 |
| B | `the_western_lanes` | The Western Lanes | `ship_voyage` | harbours_of_the_isle | — | 8,1 | 70 | spirit `western_lanes` |
| B | `charts_of_the_central_sea` | Charts of the Central Sea | `sea_charts` | the_fishing_fleets | — | 5,2 | 70 | navy_xp 10; res [zin_cat_warships] 0.5 ×1 |
| B | `the_isle_galleys` | The Isle Galleys | `galley_oars` | isle_shipwrights | — | 7,2 | 70 | navy_xp 10; res [zin_cat_galleys] 0.5 ×1 |
| B | `warehouses_of_asgard` | Warehouses of Asgard | `market_stalls` | the_western_lanes | — | 8,2 | 70 | bld industrial_complex 1 @capital |
| B | `the_isle_fleet` | The Isle Fleet | `warship_sail` | charts_of_the_central_sea + the_isle_galleys | — | 6,3 | 70 | spirit `isle_fleet` |
| C | `the_sea_watch` | **The Sea Watch** | `eye_watchful` | — | — | 10,0 | 35 | spirit `sea_watch` |
| C | `lighthouses` | Lighthouses | `lighthouse` | the_sea_watch | — | 9,1 | 70 | bld coastal_bunker 1 @capital |
| C | `the_western_beacons` | The Western Beacons | `beacon` | the_sea_watch | — | 11,1 | 35 | navy_xp 5; bld coastal_bunker 1 @capital |
| C | `sea_soldiers` | Sea Soldiers | `sword_shield` | lighthouses | — | 9,2 | 70 | army_xp 10; res [zin_cat_arms] 0.5 ×1 |
| C | `harbour_chains` | Harbour Chains | `strait_chain` | the_western_beacons | — | 11,2 | 70 | bld coastal_bunker 1 @capital; tooltip "Chains across the harbour slow a landing." |
| C | `the_isle_garrison` | The Isle Garrison | `levy_muster` | sea_soldiers / harbour_chains | — | 10,3 | 70 | mp 1000; army_xp 10 |
| C | `the_isle_stands` | The Isle Stands | `fort_wall` | the_isle_garrison | — | 10,4 | 70 | bld bunker 1 @capital; swap sea_watch→sea_watch_2 |
| D | `crown_and_isle` | Crown and Isle | `crown_gold` | — | — | 14,0 | 35 | loyalty(3); pp 25 |
| D | `ships_for_the_kings_fleet` | Ships for the King's Fleet | `great_warship` | crown_and_isle | — | 13,1 | 70 | Avail: Concord dominion. loyalty(5); navy_xp 10 |
| D | `the_isle_charter_confirmed` | The Isle Charter Confirmed | `charter_old` | crown_and_isle | — | 15,1 | 35 | loyalty(5); stab 0.03 |
| D | `isle_lords_at_parim` | Isle Lords at Parim | `palace_parim` | ships_for_the_kings_fleet / the_isle_charter_confirmed | — | 14,2 | 35 | Avail: Concord dominion. pp −25; loyalty(5) |
| D | `the_loyal_isle` | The Loyal Isle | `concord_circle` | isle_lords_at_parim | — | 14,3 | 70 | spirit `loyal_isle` |
| E | `the_western_sails` | **The Western Sails** | `storm_sea` | — | — | 6,6 | 35 | Avail: `zin_western_crossing` or `zin_war_of_last_crowns`. ws 0.10; spirit `western_sails` |
| E | `bar_the_harbours` | Bar the Harbours | `strait_chain` | the_western_sails | spare_the_isle | 4,7 | 70 | Avail: not `zin_western_crossing`. bld coastal_bunker 2 @capital; flag `zin_asgard_harbours_barred` (proposed hook: the West's leader sails straight to the mainland shore when set) |
| E | `spare_the_isle` | Spare the Isle | `olive_branch` | the_western_sails | bar_the_harbours | 8,7 | 35 | Avail: `zin_western_crossing`, or an enemy controls Asgard's capital. flag `zin_asgard_spared`; stab 0.05; spirit `isle_spared` |
| E | `the_isle_rises` | The Isle Rises | `spear_levy` | bar_the_harbours | — | 4,8 | 70 | Avail: at war. mp 2000; army_xp 10 |
| E | `harbours_for_the_heir` | Harbours for the Heir | `lone_sword` | spare_the_isle | — | 8,8 | 70 | Avail: `zin_eindil_returned`. coalition (if not already in his war); regard(10) |
| E | `the_isle_rebuilt` | The Isle Rebuilt | `workshop_tools` | the_isle_rises / harbours_for_the_heir | — | 6,9 | 70 | Avail: End or `zin_west_evacuated`. bld naval_base 1 @capital; stab 0.10; remove `western_sails`, `isle_spared` |

### Spirits

| Key | Name | Modifiers |
| --- | --- | --- |
| `house_moot` | The House-Moot | `stability_factor` 0.05, `political_power_gain` 0.05 |
| `house_moot_2` | The Queen's Peace | `stability_factor` 0.08, `political_power_gain` 0.10 |
| `house_ledgers` | The House Ledgers | `consumer_goods_factor` −0.02 |
| `isle_fisheries` | The Fishing Fleets | `monthly_population` 0.05, `consumer_goods_factor` −0.01 |
| `western_lanes` | The Western Lanes | `trade_opinion_factor` 0.15 |
| `isle_fleet` | The Isle Fleet | `navy_org_factor` 0.05, `naval_speed_factor` 0.05 |
| `sea_watch` | The Sea Watch | `naval_detection` 0.10 |
| `sea_watch_2` | The Isle Stands | `naval_detection` 0.15, `coastal_bunker_effectiveness_factor` 0.15 |
| `loyal_isle` | The Loyal Isle | `stability_factor` 0.05, `war_support_factor` 0.03 |
| `western_sails` | The Western Sails | `coastal_bunker_effectiveness_factor` 0.20, `army_core_defence_factor` 0.10 |
| `isle_spared` | The Isle Spared | `stability_factor` 0.05, `resistance_growth_on_our_occupied_states` 0.10 |

### Events (`zin_regional_asgard`)

| Key (id) | Title | Picture | To | Options |
| --- | --- | --- | --- | --- |
| `the_house_moot` (1) | The House-Moot | `generic_court` | Asgard | **House Rish speaks for the crown** (loyalty(3)) / **House Tinta speaks for trade** (pp 25) / **House Holod speaks for the purse** (stab 0.02) |
| `chapel_by_the_harbour` (2) | A Chapel by the Harbour | `houses` | Asgard | **Bless the fleet in the Deliverer's name** (footholds(1); stab 0.02; AI hist) / **The sea keeps its own gods** (nothing) |

### AI

Historical: B, A, C, D; E: spare_the_isle once the fleets land (hist), harbours_for_the_heir in 1757, the_isle_rebuilt after the evacuation. bar_the_harbours hist 0 (it would change the historical landing); under `FREE` weight 50 when `zin_west_fleet` ≥ 40.

---

## Implementation

### Build

Every tree is compiled by `tools/content/modules/focus_compiler.mjs` ([compiler spec](../00_format_and_compiler.md)) from its data file, run by `tools/content/build.mjs` and written in the same transaction as every other module through `tools/content/apply.mts` (the shared atomic rewrite engine). Each compiled tree replaces the interim Long Peace tree (`zin_long_peace_*`) for its country: the country history's `load_focus_tree` names the new tree. No tree has a `raw` block.

### Files per tree

For each tree id `regional_<name>` above (`selen`, `noleksun`, `herez`, `konori`, `kilinti`, `kingson`, `hunhun`, `hiloron`, `bloody_forest`, `cursed_lands`, `asgard`):

| Path | What | Written by |
| --- | --- | --- |
| `docs/design/focus/regional_<name>.json` | Tree data; `"id": "regional_<name>"`, `"tier": "regional"`, `"countries": ["<Name>"]` | source |
| `common/national_focus/zin_regional_<name>.txt` | Compiled tree | focus compiler |
| `common/ideas/zin_focus_regional_<name>.txt` | Spirits (`zin_regional_<name>_<key>`), including the timed event spirits | focus compiler |
| `events/zin_regional_<name>.txt` | Events (namespace `zin_regional_<name>`; ids as tabled; effect-triggered only) | focus compiler |
| `common/scripted_effects/zin_regional_<name>.txt`, `common/scripted_triggers/zin_regional_<name>.txt` | Tree scripts tabled under each country (Selen, Noleksun, Herez) | focus compiler |
| `localisation/english/zin_focus_regional_<name>_l_english.yml` | All text | focus compiler |

### Characters

Rulers keep their generated ids `<TAG>_zin_ruler` (tags resolved by name at build time); their names come from the [characters spec](../../02_lore/02_characters.md). The advisors and generals of every court table, with their traits and skills, are entries in `tools/content/data/characters.json` (characters spec, "Files"), which `tools/content/modules/characters.mjs` writes to `common/characters/zin_rulers.txt` and `common/characters/zin_lore_characters.txt`; every listed character is recruited by its country in the 4A 1748 history. Character ids are `zin_regional_<name>_<who>`; `zin_alleria` is the contract's. Advisor traits are the ideologies spec's `zin_adv_*`; unit leader traits (`ranger`, `ambusher`, `hill_fighter`, `trait_mountaineer`, `cavalry_leader`, `organizer`, `career_officer`, `defensive_doctrine`, `unyielding_defender`, `old_guard`, `inspirational_leader`, `trickster`, `green_water_expert`) are the engine's, re-localised by the warfare spec. Proposed names sit in `zin_name_<key>` localisation keys. Portraits are image-generated and wired by `tools/content/modules/portraits.mjs`; the Cursed Lands' portraits show veiled figures, no faces.

### Identifiers created

| Tree | Focuses | Spirits | Events |
| --- | ---: | ---: | --- |
| Selen | 47 | 16 + timed `ranger_watch` | `zin_regional_selen.1`–`.4` |
| Noleksun | 32 | 9 | `zin_regional_noleksun.1`–`.4` |
| Herez | 32 | 8 | `zin_regional_herez.1`–`.5` |
| Konori | 31 | 10 | `zin_regional_konori.1`–`.4` |
| Kilinti | 32 | 12 | `zin_regional_kilinti.1`–`.4` |
| Kingson | 33 | 10 + timed `fair_dealing` | `zin_regional_kingson.1`–`.5` |
| Hunhun | 31 | 11 | `zin_regional_hunhun.1`–`.3` |
| Hiloron | 32 | 9 | `zin_regional_hiloron.1`–`.2` |
| Bloody Forest | 32 | 10 | `zin_regional_bloody_forest.1`–`.4` |
| Cursed Lands | 30 | 9 | `zin_regional_cursed_lands.1`–`.5` |
| Asgard | 33 | 11 | `zin_regional_asgard.1`–`.2` |

### Names this file needs from other specs

| Name | Owner |
| --- | --- |
| `zin_concord_add_own_loyalty`, `zin_concord_petition_charter`, `zin_concord_back_camp` | [shared_concord_dominions.md](../shared/shared_concord_dominions.md) (contract additions register) |
| `zin_aenor_is_concord_dominion`, `zin_aenor_dominion_restless`, `zin_aenor_dominion_defiant`, `zin_aenor_host_available`, `zin_aenor_secede_dominion`, `zin_aenor_free_dominion` (spirit and flag), `zin_lost_cause_add_strength`, `zin_lost_cause_member`, `zin_lost_cause_shield` | [Aenor court and succession](../../04_mechanics/aenor_court_and_succession.md); [diplomacy](../../03_gameplay/03_diplomacy_and_factions.md) |
| `zin_autonomy_chartered_dominion` | diplomacy |
| `zin_afrit_add_footholds`, `zin_afrit_add_veil`, `zin_afrit_suspicious` (flag), `zin_afrit_secret_kept` | [Afrit](../../04_mechanics/afrit_hidden_council.md); start situation |
| `zin_eindil_add_regard`, `zin_eindil_add_renown`, `zin_eindil_join_coalition`, `zin_eindil_aid_host`, `zin_eindil_is_host`, `zin_eindil_friend`, `zin_eindil_heeded`, `zin_eindil_sworn`, `zin_eindil_warning_heeded`, `zin_eindil_renown`, `zin_eindil_stage`, `zin_eindil_cast_down` | [Eindil's journey](../../04_mechanics/eindil_journey.md) |
| `zin_mirolon_add_proof`, `zin_mirolon_add_passes`, `zin_mirolon_herez_friend`, `zin_herez_marches_pact`, `zin_mirolon_league_friend`, `zin_volgan_add_veil` | [Volgan and Mirolon](../../04_mechanics/volgan_southern_dominion.md); [Mirolon tree](../major/mirolon.md) |
| `zin_elves_add_wall_grievance`, `zin_elves_wall_grievance`, `zin_wall_accord`, `zin_wall_accord_broken`, `zin_eastern_invasion`, `zin_elves.10`, `zin_elves.71` | [elves](../../04_mechanics/elves_wall_and_dragons.md); diplomacy |
| `zin_economy_add_gold` | [economy](../../03_gameplay/02_economy.md) |
| `zin_politics_add_drift`, `zin_trait_elected_speaker`, `zin_trait_warband_chief`, `zin_adv_*` | [ideologies and politics](../../00_foundation/02_ideologies_and_politics.md) |
| `zin_trait_free_dominion`, `zin_trait_warden_of_the_passes`, `zin_trait_lawspeaker`, `zin_trait_port_master`, `zin_loc_eindil` | [characters](../../02_lore/02_characters.md) |
| `zin_west_evacuated`, `zin_west_fleet`, `zin_western_crossing` | [Western Crossing](../../04_mechanics/western_crossing.md) |
| `zin_world_add_gathering_dark` | [world tension](../../03_gameplay/05_world_tension_and_endings.md) |
| `zin_men_rangers`, `zin_men_archers` | [warfare](../../03_gameplay/01_warfare.md) (Selen's ranger template) |
| `zin_is_site_great_wall` (building site key `great_wall`) | key sites |
| `zin_rules_is_historical`, `zin_rule_historical_path`, `zin_rule_dark_powers` | [defines and rules](../../00_foundation/05_defines_and_rules.md) |
| `zin_lore.107` | [Fourth Age history for play](../../02_lore/04_fourth_age_history_for_play.md) |

### New names this file adds

All proposed. They are already in the [contract additions register](../../04_mechanics/00_contract_additions.md) under "regions: middle and north" unless marked new.

| Name | Kind | Meaning |
| --- | --- | --- |
| `zin_trait_horse_lord` | country leader trait | Konori, Hunhun: `cavalry_attack_factor` 0.10, `stability_factor` 0.03 |
| `zin_trait_eldest_of_the_moot` | country leader trait | Kilinti: `army_core_defence_factor` 0.10, `drift_defence_factor` 0.10, `political_power_factor` −0.05 |
| `zin_trait_keeper_of_the_gate` | country leader trait | Kingson: `trade_opinion_factor` 0.10, `army_core_defence_factor` 0.05 |
| `zin_trait_veiled_elder` | country leader trait | Cursed Lands: `drift_defence_factor` 0.25, `army_core_defence_factor` 0.10, `opinion_gain_monthly_factor` −0.10 |
| `zin_selen_voice_of_dominions` | country flag | Proposed input to the Aenor mechanic: +5 Dominions camp support at the succession |
| `zin_selen_proof_of_blood` | country flag | Selen has gathered the proof of blood (readable by the journey) |
| `zin_selen_genealogies`, `zin_selen_heard_of_heir`, `zin_selen_rangers_silent` | country flags (new) | Selen's tree state, read only inside this tree |
| `zin_selen_hidden_paths` | country flag | Proposed input to the journey: −10 % to the discovery roll while Selen hosts him |
| `zin_selen_knows_the_passages` | country flag | Proposed input to the journey: the Host's *Find the Old Service Passages* takes 15 days |
| `zin_herez_shelters_mirolon`, `zin_herez_heard_mirolon` | country flags | Herez's answers; the Volgan spec's exile rule may prefer a sheltering Herez |
| `zin_kingson_gates_shut`, `zin_kingson_gates_open` | country flags | Kingson's choice at the eastern invasion; the elves spec may read `zin_kingson_gates_open` |
| `zin_asgard_harbours_barred`, `zin_asgard_spared` | country flags | Proposed input to the Western Crossing's landing choice |
| `zin_noleksun_grievances`, `zin_hunhun_free_riders`, `zin_bloody_forest_with_the_living`, `zin_bloody_forest_took_gifts`, `zin_cursed_lands_barred`, `zin_cursed_lands_open` | country flags (new) | Tree state, read only inside these trees |
| `zin_regional_<tree>` | event namespaces | One per tree (eleven) |

The four new traits are written by the characters module to `common/country_leader/zin_traits.txt` with the characters spec's traits.

### Text and art

- Every focus names its icon in its table's Icon column; all are catalog keys in the game today, so no new focus icon is needed. Story focuses that concern the Heir use object icons only (`lone_sword`, `cliff_edge`, `footprints_snow`, `heir_rolls`), never a figure.
- Spirits use the icon of the first focus that adds them. Spirits added only by events name theirs: Selen's `ranger_watch` `eye_watchful`, Kingson's `fair_dealing` `market_stalls`, the Bloody Forest's `forest_truce` `olive_branch`.
- Every event names its picture in its table's Picture column (standard crop); Alleria's report uses `generic_wilds` (no picture of Eindil).
- All art is image-generated through the art pipeline; nothing is copied from another mod.

## Acceptance

1. The compiler builds the eleven trees with these counts: Selen 47, Noleksun 32, Herez 32, Konori 31, Kilinti 32, Kingson 33, Hunhun 31, Hiloron 32, Bloody Forest 32, Cursed Lands 30, Asgard 33. Positions are unique, every focus sits below its prerequisites, exclusions are symmetric, days are multiples of 7, no tree has a `raw` block, and the HOI4 Agent Tools focus inspector and script validator pass.
2. On 1 Thaw 4A 1748 no available focus in any of the eleven trees declares war, creates a war goal, adds a claim or sends volunteers; every war-branch root is unavailable (scenario check of `available` against the start state).
3. The compiler's secret scan passes: no text in these trees names Afrit or the Hidden Council; no focus name or description contains "Eindil"; event text naming Eindil sits only in events that cannot fire before `zin_eindil_named`.
4. Every modifier in the spirit tables and the new traits exists in the 1.19.3 modifier documentation; every icon and picture is a catalog key; every `call` and `check` resolves to a scripted effect or trigger in its owner's files.
5. Historical observer run, 4A 1748 to 1760 (one in-game year per phase from phase 3; the dates assume the 4A 1748 calendar): Selen's loyalty stays between 30 and 50 until the King's death and Selen does not secede; Selen takes *Alleria Investigates*, *Heed the Warning* and *An Oath to the Heir* (sets `zin_eindil_sworn`) before `zin_eindil_returned`; Kingson takes *Shut the Gates* in 4A 1755; Hiloron takes *Hear the Stranger* in 4A 1754; at most two of the eight dominions in this file secede by 4A 1756; Aenor never takes *Pacify the Bloody Forest* before `zin_golden_king_dead` (D8).
6. Scenario test: forced `zin_volgan_marches` makes Herez's *The Storm Breaks* available within 1 day; forced occupation of a Herez core state makes *The Marches in the Dark* available.
7. Scenario test: forced `zin_western_crossing` with Asgard's capital controlled by the West makes *Spare the Isle* available and *Bar the Harbours* unavailable.
8. The focus renderer produces a readable image of Selen's tree.
9. None of the eleven countries loads the interim Long Peace tree.

## Open questions

1. **The Cursed Lands.** OPEN_QUESTIONS, "regions: middle and north" 1. Proceeds on the proposal: barrows the valley keeps quiet; game text says only "the barrows" and "what the mounds keep".
2. **Selen after the war.** OPEN_QUESTIONS, "regions: middle and north" 2. Proceeds on the proposal: Selen stays a free realm bound by treaty (*A Treaty, Not a Crown*).
3. **Who founds the Free Dominions.** OPEN_QUESTIONS, "regions: middle and north" 3. Proceeds on the Aenor mechanic's rule: the largest seceder creates the faction; Noleksun's *The League of Free Dominions* creates it only if no country leads one, so Selen's voice and Noleksun's league never collide.
4. **Aenor Isle's houses.** OPEN_QUESTIONS, "regions: middle and north" 4. Proceeds on the proposal: Rish, Tinta, Holod and Faber are houses of Asgard.
5. **Hiloron's memory.** OPEN_QUESTIONS, "regions: middle and north" 5. Proceeds on the proposal: the giants' forebears carried the allied hosts over the crossings; the text never says where Dardan lay.
6. **Kingson's gate.** OPEN_QUESTIONS, "regions: middle and north" 6. Proceeds on the proposal: the pilgrim road to the Zilin Hills runs through Kingson's gate.
7. **Konori and Hunhun.** OPEN_QUESTIONS, "regions: middle and north" 7. Proceeds on the proposal: Konori a steppe kingdom of fairs and Hundreds, Hunhun a brotherhood of riders.

Decided here (proposed): the Bloody Forest takes its name from red-barked trees and old feuds.
