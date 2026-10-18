# Shared Tree: Realms Under the Sun

**Status:** Draft. **Priority:** 6. **Phase:** 6 (tier C).

## Purpose

The shared focus tree for the **39 tier C realms of the Lands of the Sun** (tree id `shared_lands_of_the_sun`, focus ids `zin_shared_lands_of_the_sun_<key>`, data file `docs/design/focus/shared_lands_of_the_sun.json`). Most of them are small Sunhot realms of one to four states: very strong, very few and very peaceful (established people). Two are elven realms (Gala and North Gala) and two are realms of men (Goodton and Guuden). The tree plays the Lands of the Sun mechanic ([../../04_mechanics/lands_of_the_sun.md](../../04_mechanics/lands_of_the_sun.md)) from below: the Noon Council and its concord, Lorien's counsel, the Sea of Gods, the priests from afar, and the Noon League when danger reaches the south-west.

The tree is also the **module library** for the seven tier B trees of the region ([../regional/lands_of_the_sun.md](../regional/lands_of_the_sun.md)). Its branches are labelled S1 to S10.

| Item | Value |
| --- | --- |
| Tree id | `shared_lands_of_the_sun` |
| Tier | C (shared) |
| Countries (39) | Dein Lands, Godson, Godton, Helen, Sun God Land, Dreamland, Flame, Hel, Hol, Lovis, Sono, Armic, Beforelands of Gulia, Biggen, Gala, Godrela, Goodton, Guuden, Heilmon, Him, Igara, Land of the Sun, Loyol, Menga, North Gala, Ofos, Pinion, Rana, Sali, Sensun, Soyano, Sunny, Sunweli, Sus, Tangsie, Tei, Via, Wenyene, Yungin |
| Peoples | `sun_elves` (35), `elves` (Gala, North Gala), `men` (Goodton, Guuden) |
| Focuses | 44 in eleven parts (root and modules S1 to S10) |
| Width | columns 0 to 27, rows 0 to 8 |
| Events | namespace `zin_shared_lands_of_the_sun` |
| Spirits | `zin_shared_lands_of_the_sun_<key>` |

## Lore basis

**Established** (vault): the Lands of the Sun lie in the far south-west and run beyond the southern map edge; Elvana, Igara, Hengyang, the Sea of Gods, Heaven, Flame and Godland are named there; the Sunhot elves live there, over three metres tall and among the strongest and most peaceful peoples of Erdae; the Gala elves keep their court there under King Lorien, who fought at Dardan; Lorien distrusts human rulers who turn common victories into dominion but still cares for all Erdae; Afrit's agents operate even in the Lands of the Sun; Lorien dies opposing Zol in 4A 1757 (proposed date).

**Proposed in the vault:** the Lands of Light as the leading Sunhot realm; the Sunhot realms honouring Lorien's memory; the Mirror of First Rain; the islanders' saying "carry it to Gala".

**Proposed in the mechanic spec and used here:** the Noon Council and its concord (`zin_sun_concord`), the Noon League (`zin_sun_form_noon_league`, joining rule `zin_faction_rule_join_sun_realms`), Lorien's counsel (`zin_gala_counsel`), mourning for Lorien; the Refusal binding Sunhot realms (diplomacy spec, proposed); footholds 1 at start (Afrit spec).

**Proposed here:** every focus, spirit, event and number.

**Open and kept open:** the relationship between the Gala elves and the Sunhot elves; any link between the countries **Gala** and **North Gala** and the Gala Elves; who succeeds Lorien; whether the Sunhot elves took part in the Elven Refusal. No focus text in this tree states any of them. The elven branch (S3) speaks of "the quiet woods" and never of Lorien, Gala's court or kinship; Gala and North Gala meet Lorien through S6 exactly as every other realm does.

## Design

### The peaceful start

On 1 Thaw 4A 1748 no realm of the tree is at war, in a faction or holds a claim. No focus in this tree declares war, creates a war goal or claims land, at any date. The Sunhot AI never starts a war (mechanic). S10 opens only when danger has already come: the mechanic's `zin_sun_league_needed`, a war, or `zin_gathering_dark` 50 or more.

### Who sees what

| Opens by | Condition | Module |
| --- | --- | --- |
| Region | every country of the tree | Root, S1, S6, S7, S10 |
| People | `people: sun_elves` | S2 The Noon Council |
| People | `people: elves` | S3 The Quiet Woods |
| People | `people: men` | S4 Men Under the Sun |
| Coast | owns a coastal state | S5 The Sea of Gods |
| Ideology | Light / Wild | the two heads of S8 |
| Overlord | `is_subject: true` | S9 Under a Protector |
| Story | `zin_lorien_dead`; `zin_sun_noon_league`; `zin_sun_league_needed` | single focuses in S2, S6 and S10 |

### Text

Names and descriptions use `[ROOT.GetName]` and `[ROOT.GetAdjective]`. Before `zin_afrit_revealed` the Deliverer's people are "priests from afar" or "healers of the Deliverer". Text about the Gala Elves speaks of neighbours and honour, never of kinship.

### Module map

| Module | Name | Columns | Rows | Focuses | Opens | Drives |
| --- | --- | --- | --- | ---: | --- | --- |
| Root | [ROOT.GetName] Under the Sun | 14 | 0 | 1 | start | — |
| S1 | Sun-Blessed Fields | 0–2 | 1–3 | 5 | start | economy |
| S2 | The Noon Council | 5–7 | 1–4 | 6 | Sunhot | `zin_sun_concord`; the Noon League |
| S3 | The Quiet Woods | 9–11 | 1–3 | 4 | elves | research, defence |
| S4 | Men Under the Sun | 12–14 | 1–3 | 4 | men | trade, levies, a guest at the Council |
| S5 | The Sea of Gods | 15–17 | 1–3 | 4 | coast | navy, pilgrims, the islands |
| S6 | The Counsel of Gala | 19–21 | 1–2 | 3 | Gala Elves exist | `zin_gala_counsel`; mourning |
| S7 | Priests From Afar | 22–24 | 1–3 | 4 | start | `zin_footholds`, purge |
| S8 | The Sanctuary's Way | 25–27 | 1–3 | 5 | ideology | drift, government spirits |
| S9 | Under a Protector | 0–2 | 6–7 | 3 | subject | autonomy |
| S10 | When Shadows Reach the Sun | 12–16 | 6–8 | 5 | danger | defence, the League |

### Notation

`a + b` and `a / b` for prerequisites. **Concord +n** = `call zin_sun_add_concord(value = n)`; **Counsel +n** = `call zin_sun_add_gala_counsel(value = n)`; **Goodwill X** = `call zin_elves_goodwill(target = X)` (elves spec; an opinion modifier both ways); **Footholds ±n** = `call zin_afrit_add_footholds(value = n)`; **Drift X +n** = `call zin_politics_add_drift(IDEOLOGY = X, VALUE = n)`. Days are 70 unless noted. **hist** = `check zin_rules_is_historical`.

### Root

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `under_the_sun` | [ROOT.GetName] Under the Sun | – | – | 14,0 | 70 | political_power 50; stability 0.02 | 100 | `sun_flowers` |

### S1. Sun-Blessed Fields

**Purpose:** the rich land of a small realm with few hands. **Opens:** at start.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `sun_terraces` | Sun Terraces | under_the_sun | – | 1,1 | 70 | building industrial_complex 1 @capital; political_power 25 | 40 | `farm_sowing` |
| `orchards_and_vines` | Orchards and Vines | sun_terraces | – | 0,2 | 70 | add_spirit orchards | 25 | `farm_sowing` |
| `granaries_of_the_sun` | Granaries of the Sun | sun_terraces | – | 2,2 | 35 | political_power 25; stability 0.03 | 25 | `granary` |
| `stone_of_the_high_places` | Stone of the High Places | orchards_and_vines | – | 0,3 | 70 | building industrial_complex 1 @random_owned | 20 | `quarry_stone` |
| `the_sun_markets` | The Sun Markets | orchards_and_vines / granaries_of_the_sun | – | 2,3 | 70 | add_spirit sun_markets | 20 | `market_stalls` |

### S2. The Noon Council

**Purpose:** a Sunhot realm's place in the Noon Council, the body of custom where the Sunhot realms meet under the presidency of the Lands of Light (mechanic, proposed). **Opens:** `allow_branch` on `a_seat_at_noon`: `people: sun_elves`. **Mechanic:** `zin_sun_add_concord`, `zin_sun_noon_council`, `zin_sun_noon_league`, tree effect `zin_shared_lands_of_the_sun_join_league`.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `a_seat_at_noon` | A Seat at Noon | under_the_sun | – | 6,1 | 35 | allow_branch: people sun_elves. Avail: `global_flag` zin_sun_noon_council. Concord +3; political_power 25 | 40 | `council_table` |
| `honour_the_president` | Honour the President | a_seat_at_noon | – | 5,2 | 35 | Avail: exists The Lands of Light. Goodwill The Lands of Light; Concord +2 | 30 | `envoy` |
| `peace_among_the_realms` | Peace Among the Realms | a_seat_at_noon | – | 7,2 | 70 | add_spirit peace_of_noon; Concord +3 | 30 | `olive_branch` |
| `our_share_of_the_sun_guard` | Our Share of the Sun Guard | honour_the_president | – | 5,3 | 70 | army_experience 5; add_spirit sun_guard_share | 20 | `sunhot_spear` |
| `ready_for_the_noon_league` | Ready for the Noon League | peace_among_the_realms | – | 7,3 | 35 | Avail: `global_flag` zin_sun_noon_league; ROOT in no faction. call zin_shared_lands_of_the_sun_join_league | 0; 100 when available | `alliance_rings` |
| `the_council_endures` | The Council Endures | our_share_of_the_sun_guard / ready_for_the_noon_league / peace_among_the_realms | – | 6,4 | 70 | Concord +5; stability 0.03 | 20 | `concord_circle` |

### S3. The Quiet Woods

**Purpose:** the elven realms of the tree (Gala and North Gala). The branch speaks only of their own woods: old songs, rangers and keeping apart. **Opens:** `allow_branch` on `the_quiet_woods`: `people: elves`.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `the_quiet_woods` | The Quiet Woods | under_the_sun | – | 10,1 | 70 | allow_branch: people elves. stability 0.03; political_power 25 | 40 | `forest_ancient` |
| `old_songs_of_the_woods` | Old Songs of the Woods | the_quiet_woods | – | 9,2 | 70 | research [industry] 50% ×1 | 25 | `book_lore` |
| `rangers_of_the_groves` | Rangers of the Groves | the_quiet_woods | – | 11,2 | 70 | research [zin_cat_bows] 50% ×1; army_experience 5 | 25 | `elven_bow` |
| `the_woods_keep_apart` | The Woods Keep Apart | old_songs_of_the_woods / rangers_of_the_groves | – | 10,3 | 70 | add_spirit woods_apart | 20 | `tree_silver` |

### S4. Men Under the Sun

**Purpose:** the realms of men among the Sunhot realms. They are not Council members (mechanic); they trade, hire out spears and may ask for a guest's word at the Council. **Opens:** `allow_branch` on `men_under_the_sun`: `people: men`.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `men_under_the_sun` | Men Under the Sun | under_the_sun | – | 13,1 | 35 | allow_branch: people men. political_power 25; stability 0.02 | 40 | `banner_plain` |
| `traders_among_the_tall` | Traders Among the Tall | men_under_the_sun | – | 12,2 | 70 | add_spirit sunfolk_trade | 25 | `caravan` |
| `hired_spears` | Hired Spears | men_under_the_sun | – | 14,2 | 70 | manpower 500; army_experience 5 | 20 | `spear_levy` |
| `a_guest_at_noon` | A Guest at Noon | traders_among_the_tall / hired_spears | – | 13,3 | 35 | Avail: `global_flag` zin_sun_noon_council; exists The Lands of Light. Goodwill The Lands of Light; Concord +2; political_power 25 | 20 | `envoy` |

### S5. The Sea of Gods

**Purpose:** harbours, pilgrims and white sails on the Sea of Gods (established sea name), and ships to the Islands of the South. **Opens:** `allow_branch` on `harbours_on_the_sea_of_gods`: owns a coastal state.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `harbours_on_the_sea_of_gods` | Harbours on the Sea of Gods | under_the_sun | – | 16,1 | 70 | building naval_base 1 @random_coastal | 30 | `harbour_lake` |
| `pilgrims_of_the_sea_of_gods` | Pilgrims of the Sea of Gods | harbours_on_the_sea_of_gods | – | 15,2 | 35 | stability 0.03; event zin_shared_lands_of_the_sun.1; if people sun_elves: Concord +2 | 25 | `courier_pilgrim` |
| `white_sails` | White Sails | harbours_on_the_sea_of_gods | – | 17,2 | 70 | research [zin_cat_galleys] 50% ×1; building dockyard 1 @random_coastal | 20 | `warship_sail` |
| `ships_for_the_isles` | Ships for the Isles | pilgrims_of_the_sea_of_gods / white_sails | – | 16,3 | 70 | call zin_shared_lands_of_the_sun_islands_goodwill; navy_experience 5 | 15 | `ship_voyage` |

### S6. The Counsel of Gala

**Purpose:** how a realm treats the King of Gala's word, and its grief when he falls. **Opens:** `envoys_to_gala` needs the Gala Elves to exist; `mourning_for_lorien` hangs from the root so it can appear even if Gala is gone. **Mechanic:** `zin_sun_add_gala_counsel`, `zin_elves_goodwill`; warnings sent by Gala are heeded through the mechanic's event (`zin_sun.20`), whose AI reads opinion of the Gala Elves.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `envoys_to_gala` | Envoys to Gala | under_the_sun | – | 20,1 | 35 | Avail: exists Gala Elves. Counsel +3; Goodwill Gala Elves | 30 | `gala_sun` |
| `heed_the_old_king` | Heed the Old King | envoys_to_gala | – | 19,2 | 70 | add_spirit heeding_court | 20 | `book_lore` |
| `mourning_for_lorien` | Mourning for Lorien | under_the_sun | – | 21,2 | 35 | Avail: `global_flag` zin_lorien_dead. stability 0.03; Concord +2; tooltip "He challenged the Old God and died in the struggle." | 100 when available | `empty_throne` |

### S7. Priests From Afar

**Purpose:** the Deliverer's healers in the south-west (footholds 1 at start; elves capped at 2, others at 3). A realm may welcome the healing houses or keep a courteous distance; after the reveal, or when suspicious, it may close them. **Mutual exclusions:** `welcome_the_healing_houses` / `a_courteous_distance`.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `priests_from_afar` | Priests From Afar | under_the_sun | – | 23,1 | 35 | stability 0.02 | 30 | `courier_pilgrim` |
| `welcome_the_healing_houses` | Welcome the Healing Houses | priests_from_afar | a_courteous_distance | 22,2 | 70 | Footholds +1; add_spirit healing_houses | 20; hist ×1.5 | `house_first_light` |
| `a_courteous_distance` | A Courteous Distance | priests_from_afar | welcome_the_healing_houses | 24,2 | 35 | Footholds −1; stability 0.02 | 20; ×1.5 for people elves | `olive_branch` |
| `close_the_houses_under_the_sun` | Close the Houses Under the Sun | welcome_the_healing_houses / a_courteous_distance | – | 23,3 | 35 | Avail: `global_flag` zin_afrit_revealed, or flag zin_afrit_suspicious. call zin_afrit_purge_houses; remove_spirit healing_houses | 0 before the reveal; after it 60 (Light realms close at 60%, Afrit spec) | `chain_broken` |

### S8. The Sanctuary's Way

**Purpose:** how the realm keeps itself. Sunhot and elven realms are Light (Sanctuary or Elder Kinship); the realms of men are Wild freeholds. **Mutual exclusions:** `the_sanctuary_endures` / `free_steadings_of_the_sun`.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `the_sanctuarys_way` | The Way of [ROOT.GetName] | under_the_sun | – | 26,1 | 35 | political_power 25 | 30 | `charter_old` |
| `the_sanctuary_endures` | The Sanctuary Endures | the_sanctuarys_way | free_steadings_of_the_sun | 25,2 | 70 | allow_branch: ideology light. Drift light +3; stability 0.03 | 30 | `sun_flowers` |
| `free_steadings_of_the_sun` | Free Steadings | the_sanctuarys_way | the_sanctuary_endures | 27,2 | 70 | allow_branch: ideology wild. Drift wild +3; stability 0.03 | 30 | `charter_free` |
| `keepers_of_the_sanctuary` | Keepers of the Sanctuary | the_sanctuary_endures | – | 25,3 | 70 | add_spirit keepers_of_the_sanctuary | 20 | `ward_circle` |
| `the_free_steadings` | The Free Steadings | free_steadings_of_the_sun | – | 27,3 | 70 | add_spirit free_steadings | 20 | `banner_plain` |

### S9. Under a Protector

**Opens:** `allow_branch` on `oath_to_the_protector`: `is_subject: true`. **Mutual exclusions:** `a_loyal_realm` / `our_own_sun`.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `oath_to_the_protector` | The Oath to the Protector | under_the_sun | – | 1,6 | 35 | allow_branch: is_subject. political_power 50 | 40 | `handshake_oath` |
| `a_loyal_realm` | A Loyal Realm | oath_to_the_protector | our_own_sun | 0,7 | 70 | add_spirit protectors_favour; raw `add_autonomy_ratio = { value = -0.10 localization = zin_shared_lands_of_the_sun_loyal_realm }` | 30 | `tribute_chest` |
| `our_own_sun` | Our Own Sun | oath_to_the_protector | a_loyal_realm | 2,7 | 70 | raw `add_autonomy_ratio = { value = 0.15 localization = zin_shared_lands_of_the_sun_own_sun }`; stability 0.03 | 25 | `charter_free` |

### S10. When Shadows Reach the Sun

**Purpose:** defence, when danger has already come to the Lands of the Sun. The realms show their old strength, wall their capitals, close ranks in the Noon League and recover what was taken. **Opens:** `when_shadows_reach_the_sun` needs `check zin_sun_league_needed`, or ROOT at war, or `zin_gathering_dark` 50 or more. **Mechanic:** the Noon League (joining only through `zin_shared_lands_of_the_sun_join_league`, which respects `zin_faction_rule_join_sun_realms`).

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `when_shadows_reach_the_sun` | When Shadows Reach the Sun | under_the_sun | – | 14,6 | 35 | Avail: check zin_sun_league_needed, or at war, or `variable` global.zin_gathering_dark above 49. political_power 50; war_support 0.05 | 200 when available | `sunhot_spear` |
| `the_old_strength` | The Old Strength | when_shadows_reach_the_sun | – | 12,7 | 70 | add_spirit old_strength; research [zin_cat_arms] 50% ×1 | 60 | `sunhot_spear` |
| `walls_of_white_stone` | Walls of White Stone | when_shadows_reach_the_sun | – | 14,7 | 70 | building bunker 2 @capital | 40 | `fort_wall` |
| `the_realms_close_ranks` | The Realms Close Ranks | when_shadows_reach_the_sun | – | 16,7 | 35 | Avail: `global_flag` zin_sun_noon_league; people sun_elves or elves; ROOT in no faction. call zin_shared_lands_of_the_sun_join_league; stability 0.03 | 100 when available | `alliance_rings` |
| `reclaim_the_sunlit_fields` | Reclaim the Sunlit Fields | the_old_strength / walls_of_white_stone / the_realms_close_ranks | – | 14,8 | 35 | Avail: at war; an enemy controls a state ROOT owns or has a core on. add_spirit reclaim_the_fields | 100 when available | `banner_league` |

### Spirits

Ids `zin_shared_lands_of_the_sun_<key>`. Every modifier key exists in the modifier documentation.

| Key | Name | Modifiers | Added / removed |
| --- | --- | --- | --- |
| `orchards` | Orchards and Vines | monthly_population 0.05, stability_factor 0.02 | `orchards_and_vines` |
| `sun_markets` | The Sun Markets | trade_opinion_factor 0.10, consumer_goods_factor −0.02 | `the_sun_markets` |
| `peace_of_noon` | The Peace of Noon | stability_factor 0.05, drift_defence_factor 0.10 | `peace_among_the_realms` |
| `sun_guard_share` | Our Share of the Sun Guard | army_defence_factor 0.05, army_org_factor 0.03 | `our_share_of_the_sun_guard` |
| `woods_apart` | The Woods Keep Apart | drift_defence_factor 0.20, army_core_defence_factor 0.05 | `the_woods_keep_apart` |
| `sunfolk_trade` | Traders Among the Tall | trade_opinion_factor 0.10, political_power_gain 0.05 | `traders_among_the_tall` |
| `heeding_court` | A Court That Heeds | stability_factor 0.02, army_core_defence_factor 0.03 | `heed_the_old_king` |
| `healing_houses` | The Healing Houses | recruitable_population_factor 0.03, stability_factor 0.02 | `welcome_the_healing_houses`; removed by a purge |
| `keepers_of_the_sanctuary` | Keepers of the Sanctuary | stability_factor 0.05, political_power_gain 0.05 | `keepers_of_the_sanctuary` |
| `free_steadings` | The Free Steadings | production_speed_buildings_factor 0.05, stability_factor 0.02 | `the_free_steadings` |
| `protectors_favour` | The Protector's Favour | stability_factor 0.03, political_power_gain 0.05 | `a_loyal_realm`; removed when no longer a subject |
| `old_strength` | The Old Strength | army_attack_factor 0.05, army_defence_factor 0.05 | `the_old_strength` |
| `reclaim_the_fields` | Reclaim the Sunlit Fields | army_attack_factor 0.10, war_support_factor 0.05 | `reclaim_the_sunlit_fields`; removed at peace |

The mechanic adds its own ideas when they apply (`zin_sun_heeded_<sight>`, `zin_sun_mourning`).

### Events (namespace `zin_shared_lands_of_the_sun`)

| Id | Title | For | Fired by | Options (AI) |
| --- | --- | --- | --- | --- |
| .1 | Pilgrims on the Sea of Gods | ROOT | `pilgrims_of_the_sea_of_gods` | White sails carry pilgrims along the coast for the summer feasts. "Open our harbours to them" (stability 0.02; political_power −10) / "Let them pass by" (political_power 15). AI 70/30 |

Picture: `generic_sea`.

## Implementation

### Files

| Path | Content |
| --- | --- |
| `docs/design/focus/shared_lands_of_the_sun.json` | Tree data, `"tier": "shared"`, the 39 countries |
| `common/national_focus/zin_shared_lands_of_the_sun.txt` | Compiled tree |
| `common/ideas/zin_focus_shared_lands_of_the_sun.txt` | Spirits |
| `events/zin_shared_lands_of_the_sun.txt` | Namespace `zin_shared_lands_of_the_sun` |
| `common/scripted_effects/zin_shared_lands_of_the_sun.txt` | Tree effects below |
| `localisation/english/zin_focus_shared_lands_of_the_sun_l_english.yml` | All text |

### Tree-declared scripted effects

| Name | Does |
| --- | --- |
| `zin_shared_lands_of_the_sun_join_league` | If `zin_sun_noon_league` is set, ROOT is in no faction and ROOT meets `zin_faction_rule_join_sun_realms` (Lands of the Sun country; people `sun_elves` or `elves`): the League's leader (the country with `zin_sun_council_president`, else The Lands of Light) runs `add_to_faction = ROOT`. Otherwise nothing, with a tooltip |
| `zin_shared_lands_of_the_sun_islands_goodwill` | `zin_elves_goodwill` with every Islands of the South country that owns a coastal state |

Calls into other systems: `zin_sun_add_concord`, `zin_sun_add_gala_counsel`, `zin_sun_league_needed`, `zin_sun_noon_council`, `zin_sun_noon_league` (Lands of the Sun); `zin_elves_goodwill` (elves); `zin_afrit_add_footholds`, `zin_afrit_purge_houses` (Afrit); `zin_politics_add_drift` (politics).

### Data checks

- 44 focuses; unique positions; every focus below its prerequisites; two `raw` blocks.
- No war, war goal or claim anywhere in the tree.
- No text states a relationship between the Gala elves and the Sunhot elves, or a link between Gala, North Gala and the Gala Elves (review checklist).

## AI

- Realms take the root, S1, S2 (Sunhot) or S3 (elves) or S4 (men), then S6 and S8. On the historical path the healing houses are welcomed somewhat more often, so the Deliverer's agents can operate in the Lands of the Sun as the chronicle says; elven realms keep a courteous distance more often.
- Mourning for Lorien is taken as soon as it is available.
- S10 is taken at once when danger comes; Sunhot realms join the League whenever it exists and they may.
- The Sunhot AI never declares war (mechanic). No focus in this tree gives it a reason to.

## Acceptance

1. Every one of the 39 realms maps to this tree and to no other.
2. The tree compiles with 44 focuses; the compiler and the HOI4 Agent Tools focus inspector pass.
3. `allow_branch` shows S2 only to Sunhot realms, S3 only to Gala and North Gala, S4 only to Goodton and Guuden, S5 only to coastal realms (scenario test over all 39).
4. No focus can declare war or create a war goal or claim (scan).
5. `ready_for_the_noon_league` and `the_realms_close_ranks` add a realm to the Noon League only when the League exists and the joining rule allows it; a men's realm is never added.
6. No text names Afrit before `zin_afrit_revealed`; no text states the Gala–Sunhot relationship (compiler secret scan; review).
7. Every modifier in the spirits table exists in the modifier documentation.

## Open questions

1. Gala and North Gala are elven realms with no stated link to the Gala Elves. Their branch (S3) keeps them apart from Lorien's court. Do you want them to have any tie, or none?
2. Should the realms of men (Goodton, Guuden and Goodin) be able to sit at the Noon Council as guests, as S4 proposes?
3. Do the Sunhot elves share the Elven Refusal? The tree follows the diplomacy spec's proposal (they do), so only the Noon League is open to them.
