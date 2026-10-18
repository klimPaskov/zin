# Goldoroth focus tree

**Status:** Draft. **Priority:** 4. **Phase:** 4.

## Purpose

Goldoroth is the orc kingdom of the inner Dark Lands. It believes the Dark Lands should be one kingdom, its kingdom, and it wants to subdue Dondor and the free holds. In 4A 1748 it cannot: the world is at peace, Dondor has friends, and the clans that made Goldoroth quarrel more than they march. This tree turns that position into play. For the first years it is a tree of the moot, the forges, gifts, raids and tribute: the Warking keeps the clans fed without starting a war, bends the holds one by one, and must answer the strangers from the south. When the War of the Last Crowns opens, or a hold defies the Iron Yoke, the war branches take Goldoroth into the war for the Dark Lands, either as a free Black Iron Crown or as Volgan's ally.

Tree id `goldoroth`; country Goldoroth (tier A, [01_tiers_and_coverage.md](../01_tiers_and_coverage.md)). 110 focuses. Mechanic: [The Dark Lands](../../04_mechanics/dark_lands.md). It also touches [Volgan and the Southern Dominion](../../04_mechanics/volgan_southern_dominion.md) (the Dark Lands pact) and [the Treaty of the Narrow Strait](../../04_mechanics/lerendor_narrow_strait.md) (Leren lean on the Dark Shore). Data format: [00_format_and_compiler.md](../00_format_and_compiler.md).

## Lore basis

**Established:** Goldoroth is the expansionist power of the Dark Lands, seat Cocanoor (working), with no listed alliance and Dondor as its rival. Dondor leads the Dark Sea Accord with Belonton. Bordon, Dreson, Dulundur and the Troll Forest are separate polities. The Dark Lands lie between Lerendor and the Middle Lands across narrow straits and hold the Sea of Darkness. Not all Dark Lands monsters serve Volgan; independent orcs, goblins, trolls, ogres and men live under separate rulers, and orcs and goblins do not serve one master by nature. Volgan's agents court the Dark Lands. The great invasions of orcs and goblins had ceased in the Fourth Age. At the start the Golden King reigns, Eindil has not appeared, Afrit is unrevealed and Erdae seems at peace.

**Proposed:** Goldoroth's uniting about 4A 1450 (vault chronology); Warking Gorduth, Bredo the Fire-Speaker, Sungor of the Volcano Clans and Warchief Britag (characters spec); every focus, spirit, event, number and date below; the four clan blocs, the Fire-Mountain, the Iron Yoke, the Black Iron Crown, the Southern Bargain, Forge-Mistress Ulgra, Snikkit Many-Knives, Rask Black-Sail and Great Goldoroth.

**Kept open:** which holds are goblin or ogre holds; the place of Dardan; the nature of Zol's dead and their relation to Volgan's; the exact place of the straits. The tree's text never states them. No text names Afrit. No text tells the size of Volgan's hosts. No text says fire ends Zol's dead.

## Design

### Shape

| Columns | Branch | Opens | Drives |
| --- | --- | --- | --- |
| 0–4 | 1. The Warking's Moot (horde politics) | Start | Temper, the four clan blocs, succession |
| 5–7 | 2. The Forge-Pits of Cocanoor (economy) | Start | Industry, Iron, trade |
| 8–9 | 3. The Fire-Mountain (rites and omens) | Start | Volcano Clans, temper, stability |
| 10–13 | 4. The Holds of the Inner Dark (unification) | Start | Sway, the Iron Yoke, tributaries, unity |
| 14–16 | 5. The Armed Peace (Dondor) | Start | Border tension, raids, the Accord |
| 17–21 | 6. The Southern Question (Volgan) | Start; the choice from `zin_goldoroth_envoy_heard` or 1751 | `zin_volgan_pact`; independence or Volgan |
| 22–24 | 7. The Sea of Darkness and the Straits | Start | Navy, corsairs, shore tolls |
| 25–29 | 8. The Warbands (army) | Start | Doctrine, ogres, goblins, the Warking in the field |
| 10–16, rows 8–11 | 9. The War for the Dark Lands | `zin_goldoroth_war_open` | Wars on defiant holds and the Accord |
| 22–24, rows 8–10 | 10. The Dead on the Dark Shore | `zin_zol_rising` | Defence against Zol's dead; truce with Dondor |
| 12–14, rows 12–14 | 11. One Kingdom of the Dark | Unity 75 | The Dark Lands united |

The grid is 30 columns wide (x 0 to 29) and 15 rows deep (y 0 to 14).

### The peaceful start

Rows 0 to 6 hold no war. Before the great war the tree touches other countries only through gifts, envoys, raids (decisions that never declare war), the Iron Yoke offers, one claim on Dondor ("The Long Grudge", not before 4A 1750, which the AI holds until 1754) and border clashes (engine border wars, not wars; not before 4A 1749, AI not before 1754). Every war focus sits in rows 8 and below and needs `zin_goldoroth_war_open`: the War of the Last Crowns, Volgan's march, or a casus belli Goldoroth earned (a hold refusing the yoke after 4A 1750, or raids while the Gathering Dark is at least 25).

### Notation

Prerequisites: "a and b" means both; "a or b" means either. Effects use the compiler vocabulary. Shorthand, each a `call` of a mechanic effect:

| Shorthand | Effect |
| --- | --- |
| temper ±v | `zin_goldoroth_add_temper` (`value`) |
| favour *bloc* ±v | `zin_goldoroth_add_favour` (`bloc` = volcano, iron, war, warrens; `value`) |
| sway *target* ±v | `zin_goldoroth_add_sway` (`target` = a country, `bordering` or `holds`; `value`) |
| tension ±v | `zin_dark_add_border_tension` |
| resolve ±v | `zin_dark_add_accord_resolve` |
| pact ±v | `zin_dark_add_volgan_pact` |
| gd +v | `zin_world_add_gathering_dark` |
| yoke check | `zin_goldoroth_yoke_check` (fires `zin_dark.50` when sway allows) |
| *Country* opinion ±v / "gets opinion modifier" | `zin_goldoroth_opinion` (tree-declared; args `who`, `modifier`) |
| @site | `building … where` = the site key, for example `@goldoroth_march` = `zin_is_site_goldoroth_march` |

Spirit keys compile to `zin_goldoroth_<key>`; event keys to `zin_goldoroth.<n>`. AI is the base weight; "hist" is the factor under `zin_rule_historical_path` = `HISTORICAL`; "rule" factors are for `zin_rule_ai_goldoroth`.

### Branch 1: The Warking's Moot

**Purpose:** horde politics. The Warking rules a kingdom of clans: the Volcano Clans, the Iron Clans, the War-Clans and the Goblin Warrens. He must hear them, feed them and settle how Goldoroth is ruled. **Opens:** at the start. **Mutual exclusions:** One Warking, One Law / The Clans Rule Together. **Mechanic:** temper, clan favour, the moot decisions, the heir and the challenges at the moot (mechanic section 4).

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `warking_of_cocanoor` | The Warking of Cocanoor | — | — | 2,0 | 70 | political_power 50; flag zin_goldoroth_moot_open (decisions Hold the Great Moot, Feast the Clans, Blood Contest); event clans_assemble (zin_goldoroth.1) | 20; hist ×2 |
| `war_clans_speak` | The War-Clans Speak | warking_of_cocanoor | — | 0,1 | 35 | favour war +10; temper +3; army_experience 10 | 10 |
| `iron_clans_speak` | The Iron Clans Speak | warking_of_cocanoor | — | 2,1 | 35 | favour iron +10; political_power 25 | 10 |
| `warrens_have_a_voice` | The Warrens Have a Voice | warking_of_cocanoor | — | 4,1 | 35 | favour warrens +15; add_spirit warrens_heard (stops the Warrens' monthly favour loss); manpower 3000 | 10; hist ×1.5 |
| `blood_contests` | The Blood Contests | war_clans_speak | — | 0,2 | 35 | flag zin_goldoroth_contests (Blood Contest costs 15 PP and gives temper −15); temper −10; army_experience 10 | 10 |
| `iron_tithe` | The Iron Tithe | iron_clans_speak | — | 2,2 | 70 | add_spirit iron_tithe; favour iron +5; favour warrens −5 | 10 |
| `goblin_tallymen` | The Goblin Tallymen | warrens_have_a_voice | — | 4,2 | 35 | flag zin_goldoroth_tallymen (Send Gifts of Black Iron costs 15 PP); favour warrens +5; political_power 25 | 8 |
| `law_of_the_moot` | The Law of the Moot | iron_tithe and (blood_contests or goblin_tallymen) | — | 2,3 | 70 | swap_spirit quarrelsome_clans → law_of_the_moot; temper −5 | 15; hist ×2 |
| `one_warking_one_law` | One Warking, One Law | law_of_the_moot | clans_rule_together | 1,4 | 70 | swap_spirit law_of_the_moot → warking_law; favour war +5; favour volcano, iron and warrens −5 each; flag zin_goldoroth_centralised (Hold the Great Moot cooldown 180 days) | 10; hist ×3; rule SWORN ×2 |
| `clans_rule_together` | The Clans Rule Together | law_of_the_moot | one_warking_one_law | 3,4 | 70 | swap_spirit law_of_the_moot → clan_council; every favour +10; temper −10 | 10 |
| `heirs_of_the_uniting` | Heirs of the Uniting | one_warking_one_law or clans_rule_together | — | 2,5 | 35 | event heirs_of_the_uniting (zin_goldoroth.2: name the heir's bloc; sets flag zin_goldoroth_heir_<bloc>); political_power 50 | 8 |
| `horde_without_end` | A Horde Without End | heirs_of_the_uniting | — | 1,6 | 70 | add_spirit horde_without_end; temper +5 | 10 |
| `master_of_the_clans` | Master of the Clans | heirs_of_the_uniting | — | 3,6 | 70 | available: every clan favour ≥ 40; flag zin_goldoroth_master_of_clans (no challenges at the moot, zin_dark.44); every favour +5; stability 0.05 | 10 |

### Branch 2: The Forge-Pits of Cocanoor

**Purpose:** the economy of a kingdom that lives by iron: forge-pits, black iron seams, roads of slag and the markets of the holds. **Opens:** at the start. **Mechanic:** industry and equipment; "Markets of the Holds" adds sway; "The Forges Never Cool" needs a war.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `forge_pits` | The Forge-Pits of Cocanoor | — | — | 6,0 | 70 | building arms_factory 1 capital; political_power 25 | 15 |
| `black_iron_seams` | Black Iron Seams | forge_pits | — | 5,1 | 35 | raw: `random_owned_state = { limit = { is_core_of = ROOT } add_resource = { type = steel amount = 6 } }` (Iron) | 10 |
| `roads_of_slag` | Roads of Slag and Ash | forge_pits | — | 7,1 | 35 | building infrastructure 1 random_owned (twice) | 8 |
| `warband_armouries` | The Warband Armouries | black_iron_seams | — | 5,2 | 70 | building arms_factory 1 random_owned; equipment zin_arms_equipment 500 | 10 |
| `markets_of_the_holds` | Markets of the Holds | roads_of_slag | — | 7,2 | 70 | building industrial_complex 1 capital; sway bordering +5 | 10 |
| `fire_tempered_iron` | Fire-Tempered Iron | warband_armouries and markets_of_the_holds | — | 6,3 | 35 | research infantry_weapons bonus 0.5 uses 2 | 8 |
| `black_iron_for_sale` | Black Iron for Sale | fire_tempered_iron | — | 5,4 | 35 | add_spirit black_iron_trade; favour iron +5 | 8 |
| `war_pits` | The War-Pits | fire_tempered_iron | — | 7,4 | 70 | building arms_factory 1 capital; building arms_factory 1 random_owned | 10 |
| `a_forge_for_every_clan` | A Forge for Every Clan | black_iron_for_sale or war_pits | — | 6,5 | 70 | add_spirit clan_forges; favour iron +10 | 10 |
| `forges_never_cool` | The Forges Never Cool | a_forge_for_every_clan | — | 6,6 | 35 | available: at_war; add_spirit forges_never_cool | 5; 50 at war |

### Branch 3: The Fire-Mountain

**Purpose:** the Volcano Clans and their fire-speakers, who read the smoke above Cocanoor. The branch calms the clans, steadies the realm and lets Bredo see that something stirs in the south, without saying what. **Opens:** at the start. **Mechanic:** Volcano Clans favour, temper, stability; the omen flag `zin_goldoroth_omens_south` raises the AI weight of The Black Iron Crown.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `fire_mountain_speaks` | The Fire-Mountain Speaks | — | — | 8,0 | 35 | event fire_mountain (zin_goldoroth.3); favour volcano +10 | 10 |
| `ash_rites` | The Ash Rites | fire_mountain_speaks | — | 8,1 | 35 | flag zin_goldoroth_ash_rites (temper gains −0.2 a month); temper −8; stability 0.03 | 10 |
| `fire_speakers` | The Fire-Speakers | fire_mountain_speaks | — | 9,1 | 35 | add_spirit fire_speakers; favour volcano +5 | 10 |
| `smoke_over_the_south` | Smoke over the South | fire_speakers | — | 9,2 | 35 | event smoke_over_the_south (zin_goldoroth.4); flag zin_goldoroth_omens_south | 8 |
| `fire_in_the_blood` | Fire in the Blood | ash_rites and smoke_over_the_south | — | 8,3 | 35 | add_spirit fire_in_the_blood; favour volcano +5 | 8 |
| `when_the_mountain_wakes` | When the Mountain Wakes | fire_in_the_blood | — | 9,4 | 70 | event mountain_wakes (zin_goldoroth.5) | 8 |

### Branch 4: The Holds of the Inner Dark

**Purpose:** unify the Dark Lands without war, hold by hold: gifts, feasts of chiefs, questions put to Bordon, Dreson and Dulundur, the Troll-Kin, and the Iron Yoke. **Opens:** at the start. **Mutual exclusions:** Chiefs Keep Their Halls / One Fire Under Cocanoor (a light yoke that keeps tributaries content, or a hard yoke that swallows them sooner). **Mechanic:** sway, the yoke checks, tributaries and unity (mechanic section 5).

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `holds_of_the_inner_dark` | The Holds of the Inner Dark | — | — | 11,0 | 70 | flag zin_goldoroth_sway_open (decisions Send Gifts of Black Iron, Bind by Marriage of Chiefs, Show the Host, Offer the Iron Yoke); political_power 25 | 20; hist ×2 |
| `gifts_of_black_iron` | Gifts of Black Iron | holds_of_the_inner_dark | — | 10,1 | 35 | sway bordering +10 | 15 |
| `chiefs_at_cocanoor` | Chiefs at Cocanoor | holds_of_the_inner_dark | — | 12,1 | 35 | event chiefs_at_cocanoor (zin_goldoroth.6) | 12 |
| `bordon_question` | The Bordon Question | gifts_of_black_iron | — | 10,2 | 35 | sway Bordon +15; yoke check Bordon | 10 |
| `dreson_question` | The Dreson Question | gifts_of_black_iron or chiefs_at_cocanoor | — | 11,2 | 35 | sway Dreson +15; yoke check Dreson | 10 |
| `dulundur_question` | The Dulundur Question | chiefs_at_cocanoor | — | 12,2 | 35 | sway Dulundur +10; Dulundur opinion +15 (`zin_dark_gifts`); yoke check Dulundur | 10 |
| `troll_kin` | The Troll-Kin of the Forest | chiefs_at_cocanoor | — | 13,2 | 35 | event_for Troll Forest troll_kin (zin_goldoroth.7) | 8 |
| `iron_yoke` | The Iron Yoke | bordon_question or dreson_question or dulundur_question | — | 11,3 | 70 | flag zin_goldoroth_yoke_cheap (Offer the Iron Yoke from sway 40, not 50); political_power 50 | 12 |
| `tribute_of_the_holds` | The Tribute of the Holds | iron_yoke | — | 10,4 | 35 | add_spirit hold_tribute | 10 |
| `chiefs_keep_their_halls` | Chiefs Keep Their Halls | iron_yoke | one_fire_under_cocanoor | 12,4 | 70 | flag zin_goldoroth_light_yoke; add_spirit light_yoke; every tributary: opinion of Goldoroth +20 | 10; hist ×2 |
| `one_fire_under_cocanoor` | One Fire Under Cocanoor | iron_yoke | chiefs_keep_their_halls | 13,4 | 70 | flag zin_goldoroth_hard_yoke (One Fire Under Cocanoor after 180 days as tributary at sway 70); add_spirit hard_yoke; sway holds −5 | 6 |
| `lord_of_the_inner_dark` | Lord of the Inner Dark | tribute_of_the_holds and (chiefs_keep_their_halls or one_fire_under_cocanoor) | — | 11,5 | 70 | available: zin_goldoroth_unity ≥ 25; add_spirit lord_of_the_inner_dark; gd +1 | 20 |
| `men_of_blackton` | The Men of Blackton | chiefs_keep_their_halls or one_fire_under_cocanoor | — | 13,5 | 35 | sway Blackton +15 (capped at 40); Blackton opinion +15; political_power 25 | 8 |
| `overlord_of_the_holds` | Overlord of the Holds | lord_of_the_inner_dark | — | 11,6 | 70 | available: zin_goldoroth_unity ≥ 50; swap_spirit lord_of_the_inner_dark → overlord_of_the_holds; gd +2 | 30 |

### Branch 5: The Armed Peace

**Purpose:** Goldoroth against Dondor and the Dark Sea Accord, short of war: raids, the custom of the blood-price, eyes in Notbuton, gold for Belonton, forts on the march. Then a choice: keep the armed peace, or nurse the Long Grudge toward war. **Opens:** at the start. **Mutual exclusions:** Keep the Armed Peace / The Long Grudge. **Mechanic:** raids, border tension, Accord resolve, border clashes (mechanic sections 2 and 3).

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `the_armed_peace` | The Armed Peace | — | — | 15,0 | 70 | flag zin_goldoroth_raids_open (decisions Raid the Dondor Marches, Raid a Free Hold); political_power 25; temper −5 | 15 |
| `raiders_of_the_marches` | Raiders of the Marches | the_armed_peace | — | 14,1 | 35 | flag zin_goldoroth_swift_raids (raid cooldown 60 days, not 90); favour war +5 | 10 |
| `custom_of_the_blood_price` | The Custom of the Blood-Price | the_armed_peace | — | 16,1 | 35 | tension −10; flag zin_goldoroth_blood_price (a blood-price paid to Goldoroth gives 50 PP, not 25, and temper −5) | 10; hist ×2 |
| `eyes_in_notbuton` | Eyes in Notbuton | raiders_of_the_marches | — | 14,2 | 35 | add_spirit eyes_in_notbuton; tension +3 | 8 |
| `sow_doubt_in_the_accord` | Sow Doubt in the Accord | custom_of_the_blood_price | — | 16,2 | 35 | resolve −8; event_for Belonton gold_from_cocanoor (zin_goldoroth.8) | 8 |
| `forts_on_the_march` | Forts on the Dondor March | eyes_in_notbuton or sow_doubt_in_the_accord | — | 15,3 | 70 | building bunker 2 @goldoroth_march | 8 |
| `keep_the_armed_peace` | Keep the Armed Peace | forts_on_the_march | the_long_grudge | 14,4 | 35 | tension −20; add_spirit quiet_march; temper +5 | 10; hist ×0.2 |
| `the_long_grudge` | The Long Grudge | forts_on_the_march | keep_the_armed_peace | 16,4 | 35 | available: date ≥ 1750.1.1; claims_on Dondor; tension +15; war_support 0.05; gd +1 | 10; hist ×0 before 1754.1.1, ×3 after |
| `clashes_on_the_march` | Clashes on the March | the_long_grudge | — | 16,5 | 35 | available: tension ≥ 60; not at_war_with Dondor; flag zin_goldoroth_clash_open (decision Clash on the March) | 8; hist ×0 before 1754.1.1 |

### Branch 6: The Southern Question

**Purpose:** Volgan's agents court the Dark Lands, and Goldoroth must decide what it is: a crown that bows to no spirit, or the South's strongest friend in the north. **Opens:** "Strangers from the South" at the start; "Weigh the South" needs flag `zin_goldoroth_envoy_heard` (set by the mechanic pulse once Volgan has sent his envoy or Goldoroth's pact is 1) or 1 Deepwinter 1751. **Mutual exclusions:** The Black Iron Crown / The Southern Bargain; Ally of the South / Kneel to Nafeher. **Mechanic:** `zin_volgan_pact`, the acceptance triggers `zin_goldoroth_refuses_masters` and `zin_goldoroth_seeks_the_south`, Hunt the Southern Envoys, kneeling (`zin_goldoroth_kneel`), the northern front (mechanic sections 7 and 10; Volgan spec sections 7 and 10).

The Black Iron Crown half (columns 17–18) is the historical route. The Southern Bargain half (columns 20–21) waits for Volgan's march before any war: Ally of the South needs pact 2, which only Volgan can accept; Kneel to Nafeher needs the march or a torn veil.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `strangers_from_the_south` | Strangers from the South | — | — | 19,0 | 35 | event strangers_from_the_south (zin_goldoroth.9); flag zin_goldoroth_southern_question; political_power 25 | 10 |
| `weigh_the_south` | Weigh the South | strangers_from_the_south | — | 19,1 | 35 | available: flag zin_goldoroth_envoy_heard or date ≥ 1751.1.1; event warkings_council (zin_goldoroth.10) | 10 |
| `black_iron_crown` | The Black Iron Crown | weigh_the_south | southern_bargain | 17,2 | 70 | flag zin_goldoroth_no_masters; Volgan gets opinion modifier zin_dark_refused_nafeher toward Goldoroth (−25); stability 0.05; political_power 50; favour volcano +5; favour war +5 | 10; ×1.5 with zin_goldoroth_omens_south; hist ×5; rule INDEPENDENT ×10, SWORN ×0 |
| `hunt_the_envoys` | Hunt the Southern Envoys | black_iron_crown | — | 17,3 | 35 | flag zin_goldoroth_hunt_open (decision Hunt the Southern Envoys); pact −1 on every Goldoroth subject | 10 |
| `no_spirit_rules_the_dark` | No Spirit Rules the Dark | black_iron_crown | — | 18,3 | 35 | add_spirit no_masters; flag zin_goldoroth_no_shadow_drift (the "Volgan's agents" drift source skips Goldoroth and its tributaries) | 10 |
| `shield_of_the_free_dark` | The Shield of the Free Dark | hunt_the_envoys | — | 17,4 | 70 | event_for every independent orc, goblin and troll Dark Lands country with pact ≤ 1: against_the_south (zin_goldoroth.11) | 8 |
| `eyes_on_the_south` | Eyes on the South | no_spirit_rules_the_dark | — | 18,4 | 35 | add_spirit eyes_on_the_south; flag zin_goldoroth_watching_south | 8 |
| `dark_lands_stand_alone` | The Dark Lands Stand Alone | shield_of_the_free_dark | — | 17,5 | 35 | available: global_flag zin_volgan_marches; call zin_goldoroth_rally_free_dark (every Dark Lands country with sway ≥ 40 and pact ≤ 1 grants Goldoroth military access; opinion +10); war_support 0.1 | 100 |
| `against_the_southern_host` | Against the Southern Host | eyes_on_the_south or dark_lands_stand_alone | — | 18,6 | 35 | available: global_flag zin_volgan_marches and a sworn Dark Lands country (pact 3) is at war; call zin_goldoroth_wargoal_sworn | 100 |
| `black_iron_endures` | The Black Iron Endures | dark_lands_stand_alone or against_the_southern_host | — | 17,7 | 35 | available: global_flag zin_volgan_body_destroyed or date ≥ 1758.1.1; add_spirit black_iron_endures; stability 0.05 | 50 |
| `southern_bargain` | The Southern Bargain | weigh_the_south | black_iron_crown | 21,2 | 70 | flag zin_goldoroth_southern_bargain; Volgan gets opinion modifier zin_dark_bargain_struck toward Goldoroth (+20); political_power 50; favour warrens +5; favour volcano −10 | 4; hist ×0; rule SWORN ×10, INDEPENDENT ×0 |
| `ogres_from_the_south` | Ogres from the South | southern_bargain | — | 20,3 | 35 | add_spirit southern_ogres; equipment zin_ogre_gear_equipment 100 | 10 |
| `envoys_to_nafeher` | Envoys to Nafeher | southern_bargain | — | 21,3 | 35 | event_for Volgan cocanoor_envoys (zin_goldoroth.13) | 10 |
| `spoils_of_dondor` | The Spoils of Dondor | ogres_from_the_south or envoys_to_nafeher | — | 20,4 | 35 | claims_on Dondor; tension +10; flag zin_goldoroth_spoils_promised | 8 |
| `a_price_in_iron` | A Price in Iron | envoys_to_nafeher | — | 21,4 | 35 | equipment zin_arms_equipment −1000; for_country Volgan: equipment zin_arms_equipment 1000, call zin_volgan_add_dominion_strength (1); Volgan opinion +10 | 8 |
| `ally_of_the_south` | Ally of the South | spoils_of_dondor or a_price_in_iron | kneel_to_nafeher | 20,5 | 70 | available: Goldoroth's zin_volgan_pact ≥ 2; flag zin_goldoroth_ally_south (accepts Sworn to Nafeher at once); add_spirit southern_gold | 10 |
| `kneel_to_nafeher` | Kneel to Nafeher | spoils_of_dondor or a_price_in_iron | ally_of_the_south | 21,5 | 70 | available: pact ≥ 2 and (global_flag zin_volgan_marches or Volgan has flag zin_volgan_veil_30); event_for Volgan cocanoor_kneels (zin_goldoroth.14) | 2; hist ×0 |
| `the_northern_front` | The Northern Front | ally_of_the_south or kneel_to_nafeher | — | 20,6 | 21 | available: global_flag zin_volgan_marches and (pact 3 or subject_of Volgan); wargoal Dondor annex_everything; call zin_goldoroth_wargoal_strait_south; gd +2 | 300 |
| `across_the_southern_strait` | Across the Southern Strait | the_northern_front | — | 21,7 | 35 | available: at war with a Middle Lands country; add_spirit strait_crossing; army_experience 20 | 100 |
| `when_the_south_falls_silent` | When the South Falls Silent | the_northern_front | — | 20,8 | 14 | available: global_flag zin_volgan_body_destroyed; event south_falls_silent (zin_goldoroth.15) | 500 |

### Branch 7: The Sea of Darkness and the Straits

**Purpose:** a small orc navy for an inland-facing kingdom: shipwrights, charts, black-sail corsairs, tolls on the Dark Lands shores of the straits, a word to Sonargur, and wardens and landing galleys for war. **Opens:** at the start. **Mechanic:** sea mastery, corsair raids, shore tolls, closing a strait (mechanic sections 8 and 9); Lerendor's lean.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `the_sea_of_darkness` | The Sea of Darkness | — | — | 23,0 | 70 | building naval_base 1 random_coastal; navy_experience 10 | 10 |
| `black_sail_shipwrights` | Black-Sail Shipwrights | the_sea_of_darkness | — | 22,1 | 70 | building dockyard 1 random_coastal; research naval_equipment bonus 0.5 uses 1 | 8 |
| `charts_of_the_dark_sea` | Charts of the Dark Sea | the_sea_of_darkness | — | 24,1 | 35 | add_spirit dark_sea_charts | 8 |
| `black_sail_corsairs` | The Black-Sail Corsairs | black_sail_shipwrights | — | 22,2 | 35 | flag zin_goldoroth_corsairs (decision Corsair Raid); recruit navy leader zin_goldoroth_rask; favour war +5; navy_experience 10 | 8 |
| `tolls_on_the_dark_straits` | Tolls on the Dark Straits | charts_of_the_dark_sea | — | 24,2 | 35 | flag zin_goldoroth_tolls_open (decision Levy Shore Tolls); political_power 25 | 8 |
| `masters_of_the_dark_sea` | Masters of the Dark Sea | black_sail_corsairs | — | 22,3 | 35 | available: check zin_dark_is_sea_master; add_spirit masters_of_the_dark_sea; navy_experience 20 | 10 |
| `word_to_sonargur` | Word to Sonargur | tolls_on_the_dark_straits | — | 24,3 | 35 | event_for Lerendor cocanoor_offers_trade (zin_goldoroth.16) | 6 |
| `wardens_of_the_dark_shore` | Wardens of the Dark Shore | masters_of_the_dark_sea or word_to_sonargur | — | 23,4 | 70 | building coastal_bunker 1 @dark_strait_shore (twice); flag zin_goldoroth_strait_wardens (decision Close a Dark Strait) | 8 |
| `landing_galleys` | Landing Galleys | wardens_of_the_dark_shore | — | 23,5 | 35 | add_spirit landing_galleys | 8 |

### Branch 8: The Warbands

**Purpose:** the host: Britag's drill, goblin skirmishers, raider mounts, ogre pacts, the Blood and Warband doctrine ([03_gameplay/01_warfare.md](../../03_gameplay/01_warfare.md), `zin_gd_warband`) and the Warking in the field. **Opens:** at the start. **Mutual exclusions:** The Horde Unbound / Iron Discipline. **Mechanic:** army; "The Warking Takes the Field" needs a war.

Research categories are vanilla category keys (`land_doctrine`, `armor`, `infantry_weapons`, `artillery`, `naval_equipment`) until the warfare spec maps ZIN technologies to categories; the compiler then renames them.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `the_warbands` | The Warbands of Goldoroth | — | — | 27,0 | 70 | army_experience 15; research land_doctrine bonus 0.5 uses 1 | 15 |
| `britags_drill` | Warchief Britag's Drill | the_warbands | — | 25,1 | 35 | add_spirit britags_drill | 10 |
| `goblin_skirmishers` | Goblin Skirmishers | the_warbands | — | 27,1 | 35 | add_spirit goblin_skirmishers; favour warrens +5 | 10 |
| `raider_mounts` | Raider Mounts | the_warbands | — | 29,1 | 35 | research land_doctrine bonus 0.3 uses 1; equipment zin_mounts_equipment 200 | 8 |
| `night_marches` | Night Marches | britags_drill | — | 25,2 | 35 | add_spirit night_marches | 8 |
| `levies_of_the_warrens` | Levies of the Warrens | goblin_skirmishers | — | 27,2 | 35 | manpower 10000; favour warrens +5; temper +3 | 10 |
| `ogre_pacts` | Ogre Pacts of the Dark Lands | raider_mounts | — | 29,2 | 35 | research armor bonus 0.5 uses 1; equipment zin_ogre_gear_equipment 100 | 8 |
| `blood_and_warband` | Blood and Warband | night_marches and levies_of_the_warrens | — | 26,3 | 70 | research land_doctrine bonus 1.0 uses 1; army_experience 20 | 10 |
| `the_great_warband` | The Great Warband | blood_and_warband or ogre_pacts | — | 27,4 | 70 | add_spirit great_warband | 12 |
| `horde_unbound` | The Horde Unbound | the_great_warband | iron_discipline | 26,5 | 35 | add_spirit horde_unbound; temper −10 | 10; hist ×2 |
| `iron_discipline` | Iron Discipline | the_great_warband | horde_unbound | 28,5 | 35 | add_spirit iron_discipline; favour iron +5; favour war −5 | 10 |
| `warking_takes_the_field` | The Warking Takes the Field | horde_unbound or iron_discipline | — | 27,6 | 35 | available: at_war; call zin_goldoroth_warking_takes_field (field marshal role, skill 4, trait zin_trait_black_iron_warlord); war_support 0.05 | 100 |

### Branch 9: The War for the Dark Lands

**Purpose:** the war Goldoroth has waited for: the defiant holds brought to heel, the Accord broken, the Sea of Darkness won. **Opens:** "The Hour of the Black Iron" after Lord of the Inner Dark, The Long Grudge or Clashes on the March, and only while `zin_goldoroth_war_open`. "The Accord Must Break" also needs `zin_goldoroth_may_war_dondor`. **Mechanic:** `zin_cb_hold_defiance`, `zin_cb_orc_raids`, tributaries on capitulation, Accord resolve, the Free Moot's call.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `hour_of_the_black_iron` | The Hour of the Black Iron | lord_of_the_inner_dark or the_long_grudge or clashes_on_the_march | — | 13,8 | 14 | available: check zin_goldoroth_war_open; war_support 0.1; army_experience 15 | 300 |
| `bring_the_defiant_to_heel` | Bring the Defiant to Heel | hour_of_the_black_iron | — | 11,9 | 14 | call zin_goldoroth_wargoal_defiant | 150 |
| `the_accord_must_break` | The Accord Must Break | hour_of_the_black_iron | — | 15,9 | 14 | available: check zin_goldoroth_may_war_dondor; wargoal Dondor annex_everything; gd +2 | 100 (conditions in AI) |
| `fire_through_the_holds` | Fire Through the Holds | bring_the_defiant_to_heel | — | 10,10 | 21 | available: at war with a Dark Lands hold; timed_spirit hold_assault 180 | 80 |
| `mercy_for_the_kneeling` | Mercy for Those Who Kneel | bring_the_defiant_to_heel | — | 12,10 | 21 | flag zin_goldoroth_mercy (a hold that capitulates to Goldoroth becomes a tributary: zin_goldoroth_tribute_on_capitulation); stability 0.05 | 60; hist ×2 |
| `storm_notbuton` | Storm Notbuton | the_accord_must_break | — | 14,10 | 21 | available: at_war_with Dondor; timed_spirit notbuton_assault 180 | 100 |
| `break_the_belonton_oath` | Break the Belonton Oath | the_accord_must_break | — | 16,10 | 21 | event_for Belonton leave_the_accord (zin_goldoroth.19) | 60 |
| `the_holds_are_one` | The Holds Are One | fire_through_the_holds or mercy_for_the_kneeling | — | 11,11 | 35 | available: no independent orc, goblin or troll country borders Goldoroth; political_power 75; stability 0.05 | 100 |
| `the_dark_sea_is_ours` | The Dark Sea Is Ours | storm_notbuton or break_the_belonton_oath | — | 15,11 | 35 | available: Dondor has capitulated or Goldoroth controls Notbuton (zin_is_site_notbuton); add_spirit dark_sea_won; political_power 100; gd +2 | 100 |

### Branch 10: The Dead on the Dark Shore

**Purpose:** when Zol's dead come "through islands and straits", the orcs of the shore learn that the dead do not stay down. Fire breaks their shapes; it does not end them. The branch buys time and can make old enemies stand together. **Opens:** only with `zin_zol_rising`. **Mechanic:** `zin_dark_shore_barred` hook, the truce against the dead (mechanic section 9).

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `dead_on_the_dark_shore` | The Dead on the Dark Shore | — | — | 23,8 | 35 | available: global_flag zin_zol_rising; add_spirit hold_the_shore; war_support 0.1; event they_do_not_stay_down (zin_goldoroth.17) | 20; 200 if Zol is at war with a Dark Lands country |
| `fire_breaks_their_shapes` | Fire Breaks Their Shapes | dead_on_the_dark_shore | — | 22,9 | 35 | add_spirit fire_against_the_dead; research artillery bonus 0.5 uses 1 | 100 |
| `burn_the_landings` | Burn the Landings | dead_on_the_dark_shore | — | 24,9 | 35 | building coastal_bunker 1 @dark_strait_shore (twice); flag zin_goldoroth_shore_barred | 100 |
| `the_living_together` | The Living Together | fire_breaks_their_shapes or burn_the_landings | — | 23,10 | 35 | available: at_war_with Zol; event_for Dondor truce_against_the_dead (zin_goldoroth.18); call zin_goldoroth_offer_access_against_dead | 100 |

### Branch 11: One Kingdom of the Dark

**Purpose:** Goldoroth's oldest ambition: one kingdom of the whole Dark Lands, and then the shores beyond the straits. **Opens:** Overlord of the Holds and a war branch end, with unity 75 and Dondor gone or subject. **Mechanic:** `zin_goldoroth_proclaim_one_kingdom` (cosmetic name Great Goldoroth, proposed), cores, strait claims.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `the_dark_lands_are_one` | The Dark Lands Are One | overlord_of_the_holds and (the_holds_are_one or the_dark_sea_is_ours) | — | 13,12 | 70 | available: zin_goldoroth_unity ≥ 75 and Dondor does not exist or is Goldoroth's subject; call zin_goldoroth_proclaim_one_kingdom | 500 |
| `every_hold_a_hearth` | Every Hold a Hearth | the_dark_lands_are_one | — | 12,13 | 70 | call zin_goldoroth_core_dark_lands | 100 |
| `the_black_iron_throne` | The Black Iron Throne | the_dark_lands_are_one | — | 14,13 | 35 | swap_spirit overlord_of_the_holds → black_iron_throne; political_power 100; stability 0.1 | 100 |
| `beyond_the_straits` | Beyond the Straits | every_hold_a_hearth or the_black_iron_throne | — | 13,14 | 70 | available: global_flag zin_war_of_last_crowns; call zin_goldoroth_claim_strait_shores; gd +2 | 5; hist ×0 |

### Count

| Branch | Focuses |
| --- | ---: |
| 1. The Warking's Moot | 13 |
| 2. The Forge-Pits of Cocanoor | 10 |
| 3. The Fire-Mountain | 6 |
| 4. The Holds of the Inner Dark | 14 |
| 5. The Armed Peace | 9 |
| 6. The Southern Question | 20 |
| 7. The Sea of Darkness and the Straits | 9 |
| 8. The Warbands | 12 |
| 9. The War for the Dark Lands | 9 |
| 10. The Dead on the Dark Shore | 4 |
| 11. One Kingdom of the Dark | 4 |
| **Total** | **110** |

Layout was checked with a script: 110 unique keys, 110 unique positions, every prerequisite on a higher row, exclusives symmetric, x from 0 to 29, y from 0 to 14, days multiples of 7.

## Spirits

Keys compile to `zin_goldoroth_<key>`. Mechanic spirits (`zin_dark_*`) are in the mechanic spec. Every modifier key is in the game's modifier documentation (`production_speed_arms_factory_factor` is the documented `production_speed_<Building>_factor` form).

| Key | Name | Modifiers | Added / removed |
| --- | --- | --- | --- |
| `quarrelsome_clans` | Quarrelsome Clans | `political_power_gain` −0.15, `stability_factor` −0.05 | Start (history); swapped by "The Law of the Moot" |
| `warrens_heard` | The Warrens Heard | `recruitable_population_factor` 0.05 (and stops the Warrens' favour decay) | "The Warrens Have a Voice" |
| `iron_tithe` | The Iron Tithe | `political_power_gain` 0.1, `consumer_goods_factor` 0.02 | "The Iron Tithe" |
| `law_of_the_moot` | The Law of the Moot | `stability_factor` 0.05, `political_power_gain` 0.05 | "The Law of the Moot"; swapped by the next pair |
| `warking_law` | One Warking, One Law | `political_power_gain` 0.15, `stability_factor` 0.05, `war_support_factor` 0.05 | "One Warking, One Law" |
| `clan_council` | The Clan Council | `stability_factor` 0.1, `political_power_gain` −0.05, `conscription_factor` 0.03 | "The Clans Rule Together" |
| `horde_without_end` | A Horde Without End | `recruitable_population_factor` 0.1, `conscription_factor` 0.05 | "A Horde Without End" |
| `black_iron_trade` | Black Iron for Sale | `trade_opinion_factor` 0.15, `political_power_gain` 0.05 | "Black Iron for Sale" |
| `clan_forges` | A Forge for Every Clan | `production_speed_arms_factory_factor` 0.1, `industrial_capacity_factory` 0.05 | "A Forge for Every Clan" |
| `forges_never_cool` | The Forges Never Cool | `consumer_goods_factor` −0.05, `production_factory_max_efficiency_factor` 0.05 | "The Forges Never Cool" |
| `fire_speakers` | The Fire-Speakers | `stability_factor` 0.05, `war_support_factor` 0.03 | "The Fire-Speakers" |
| `fire_in_the_blood` | Fire in the Blood | `army_morale_factor` 0.05, `army_attack_factor` 0.03 | "Fire in the Blood" |
| `hold_tribute` | The Tribute of the Holds | `political_power_gain` 0.1, `recruitable_population_factor` 0.03 | "The Tribute of the Holds" |
| `light_yoke` | A Light Yoke | `subjects_autonomy_gain` −0.2, `opinion_gain_monthly_factor` 0.1 | "Chiefs Keep Their Halls" |
| `hard_yoke` | A Hard Yoke | `annex_cost_factor` −0.25, `required_garrison_factor` −0.1 | "One Fire Under Cocanoor" |
| `lord_of_the_inner_dark` | Lord of the Inner Dark | `stability_factor` 0.05, `political_power_gain` 0.1 | "Lord of the Inner Dark"; swapped by "Overlord of the Holds" |
| `overlord_of_the_holds` | Overlord of the Holds | `stability_factor` 0.05, `political_power_gain` 0.15, `recruitable_population_factor` 0.05 | "Overlord of the Holds"; swapped by "The Black Iron Throne" |
| `eyes_in_notbuton` | Eyes in Notbuton | `intel_network_gain_factor` 0.2, `army_intel_factor` 0.1 | "Eyes in Notbuton" |
| `quiet_march` | The Quiet March | `production_speed_buildings_factor` 0.05, `stability_factor` 0.03 | "Keep the Armed Peace"; removed when Goldoroth goes to war with Dondor |
| `no_masters` | No Spirit Rules the Dark | `drift_defence_factor` 0.3, `war_support_factor` 0.05 | "No Spirit Rules the Dark" |
| `eyes_on_the_south` | Eyes on the South | `enemy_operative_detection_chance_factor` 0.15, `army_intel_factor` 0.1 | "Eyes on the South" |
| `black_iron_endures` | The Black Iron Endures | `political_power_gain` 0.1, `stability_factor` 0.05 | "The Black Iron Endures" |
| `southern_ogres` | Ogres from the South | `army_armor_attack_factor` 0.1, `recruitable_population_factor` 0.03 | "Ogres from the South" |
| `southern_gold` | Gold from the South | `political_power_gain` 0.1, `production_speed_arms_factory_factor` 0.05 | "Ally of the South"; removed by "We were never his" (`zin_goldoroth.15`) |
| `sworn_to_nafeher` | Sworn to Nafeher | `army_attack_factor` 0.1, `army_morale_factor` 0.1, `political_power_gain` −0.1, `stability_factor` −0.05 | `zin_goldoroth_kneel`; removed when Goldoroth leaves Volgan |
| `strait_crossing` | Across the Strait | `naval_invasion_planning_bonus_speed` 0.5, `naval_invasion_prep_speed` 0.25 | "Across the Southern Strait" |
| `dark_sea_charts` | Charts of the Dark Sea | `naval_detection` 0.1, `naval_speed_factor` 0.05 | "Charts of the Dark Sea" |
| `masters_of_the_dark_sea` | Masters of the Dark Sea | `navy_org_factor` 0.05, `naval_damage_factor` 0.05, `convoy_raiding_efficiency_factor` 0.1 | "Masters of the Dark Sea" |
| `landing_galleys` | Landing Galleys | `naval_invasion_capacity` 4, `naval_invasion_prep_speed` 0.2 | "Landing Galleys" |
| `hold_the_shore` | Hold the Shore | `army_core_defence_factor` 0.1, `coastal_bunker_effectiveness_factor` 0.15 | "The Dead on the Dark Shore"; removed on `zin_zol_withdrawn` |
| `fire_against_the_dead` | Fire Breaks Their Shapes | `army_defence_factor` 0.05, `army_artillery_attack_factor` 0.1 | "Fire Breaks Their Shapes"; removed on `zin_zol_withdrawn` |
| `britags_drill` | Britag's Drill | `training_time_army_factor` −0.1, `experience_gain_army_factor` 0.1 | "Warchief Britag's Drill" |
| `goblin_skirmishers` | Goblin Skirmishers | `recruitable_population_factor` 0.05, `army_speed_factor` 0.03 | "Goblin Skirmishers" |
| `night_marches` | Night Marches | `land_night_attack` 0.1, `army_speed_factor` 0.03 | "Night Marches" |
| `great_warband` | The Great Warband | `army_org_factor` 0.05, `army_attack_factor` 0.05 | "The Great Warband" |
| `horde_unbound` | The Horde Unbound | `conscription_factor` 0.05, `army_attack_factor` 0.05, `army_org_factor` −0.03 | "The Horde Unbound" |
| `iron_discipline` | Iron Discipline | `army_org_factor` 0.08, `army_defence_factor` 0.05, `recruitable_population_factor` −0.05 | "Iron Discipline" |
| `hold_assault` | Fire Through the Holds | `army_attack_against_minor_factor` 0.15 | "Fire Through the Holds"; 180 days |
| `notbuton_assault` | The Storm of Notbuton | `army_attack_factor` 0.1, `breakthrough_factor` 0.1 | "Storm Notbuton"; 180 days |
| `dark_sea_won` | The Dark Sea Is Ours | `political_power_gain` 0.1, `trade_opinion_factor` 0.1 | "The Dark Sea Is Ours" |
| `black_iron_throne` | The Black Iron Throne | `political_power_gain` 0.2, `stability_factor` 0.1, `war_support_factor` 0.05 | "The Black Iron Throne" |

The stance spirit `zin_stance_zin_dom_conquest` ([02_ideologies_and_politics.md](../../00_foundation/02_ideologies_and_politics.md)) stays; this tree does not replace it. Kneeling swaps it for `zin_stance_zin_shadow_horde` through `zin_politics_set_stance`; "We were never his" swaps it back.

## Events (namespace `zin_goldoroth`)

| Id | Key | Title | Trigger | Options (effects; AI weight) |
| --- | --- | --- | --- | --- |
| 1 | `clans_assemble` | The Clans Assemble | Focus | "The moot is open." (tooltip lists the four blocs and their favour) |
| 2 | `heirs_of_the_uniting` | Heirs of the Uniting | Focus | Four options, one per bloc: "Sungor's line." / "Ulgra's line." / "Britag's line." / "Snikkit's line." (flag `zin_goldoroth_heir_<bloc>`; that bloc +10, the others −3; AI: war 50, iron 20, volcano 20, warrens 10). The text recalls the uniting of about 4A 1450 (proposed) and names no other date. |
| 3 | `fire_mountain` | The Fire-Mountain Speaks | Focus | "The mountain wants iron." (favour iron +5; AI 30) / "The mountain wants blood." (temper +5; favour war +5; AI 20) / "The mountain wants patience." (temper −5; stability 0.02; AI 50) |
| 4 | `smoke_over_the_south` | Smoke over the South | Focus | "Watch the south." Bredo sees storms in the far south and many feet beneath them, and will say no more. No number, no name but Volgan's land. |
| 5 | `mountain_wakes` | When the Mountain Wakes | Focus | The Fire-Mountain erupts (proposed). "A sign for war." (war_support 0.1; temper +10; AI 30, hist ×0 before 1755) / "A sign for patience." (stability 0.05; temper −10; AI 70) |
| 6 | `chiefs_at_cocanoor` | Chiefs at Cocanoor | Focus | "Feast them well." (sway holds +5; every hold's opinion +10; −25 PP; AI 60) / "Show them the forges." (sway holds +3; favour iron +5; AI 40) |
| 7 | `troll_kin` | The Troll-Kin of the Forest (to Troll Forest) | Focus | "Trolls fight for pay." (Troll Forest flag `zin_dark_trolls_for_pay`; its opinion of Goldoroth +15; AI 60) / "The forest answers no one." (sway Troll Forest −5; AI 40) |
| 8 | `gold_from_cocanoor` | Gold from Cocanoor (to Belonton) | Focus | "Take the gold, keep the oath." (Belonton +50 PP; resolve −3; AI 60) / "Send it back to Cocanoor." (resolve +5; Belonton's opinion of Dondor +10; AI 40) |
| 9 | `strangers_from_the_south` | Strangers from the South | Focus | "Let them talk. Then we decide." The chiefs report strangers from the far south with gifts. |
| 10 | `warkings_council` | The Warking's Council | Focus | "Hear the Fire-Speakers." (favour volcano +5) / "Hear the War-Clans." (favour war +5). Tooltip shows both routes of the branch. |
| 11 | `against_the_south` | Against the South? (to a free hold) | Focus | "Stand with Cocanoor." (sway +15; opinion +20; that hold's pact −1; AI 30 + sway ÷ 2, ×0 at pact ≥ 2) / "We stand alone." (AI 70 − sway ÷ 2) |
| 12 | `south_is_moving` | The South Is Moving | Fired by the mechanic pulse when `zin_volgan_marches` is set and Goldoroth has `zin_goldoroth_watching_south` | "Muster the warbands." (war_support 0.05; army_experience 10) |
| 13 | `cocanoor_envoys` | Cocanoor Sends Envoys (to Volgan) | Focus | "Welcome Cocanoor." (Goldoroth pact +1, at most 2; reply 20; AI 90) / "Orcs bargain; Nafeher commands." (reply 20; AI 10) |
| 14 | `cocanoor_kneels` | Cocanoor Kneels (to Volgan) | Focus | "Rise, servant." (`zin_goldoroth_kneel`; reply 24; AI 100 if `zin_dominion_strength` ≥ 50, else 30) / "Not yet." (reply 24) |
| 15 | `south_falls_silent` | When the South Falls Silent | Focus | "We were never his." (if subject of Volgan: `zin_goldoroth_break_from_nafeher` ends the subjecthood; remove `southern_gold` and `sworn_to_nafeher`; stance back to `zin_dom_conquest`; flag `zin_goldoroth_no_masters`; AI 80) / "Fight on in his name." (war_support 0.05; stability −0.1; AI 20) |
| 16 | `cocanoor_offers_trade` | Cocanoor Offers Trade (to Lerendor) | Focus | "Trade, and no raids on our friends." (non_aggression with Goldoroth; Goldoroth's lean +10; reply 21; AI 40 + Goldoroth's lean ÷ 2, ×0 if Lerendor completed The Shield of Dondor) / "Sonargur does not trade with Cocanoor." (lean −10; reply 21) |
| 17 | `they_do_not_stay_down` | They Do Not Stay Down | Focus | "Then we burn them again, and again." The text says fire breaks their shapes; it never says fire ends them. |
| 18 | `truce_against_the_dead` | A Truce Against the Dead (to Dondor) | Focus | "Stand with the orcs, for now." (mechanic section 9 truce; reply 22; AI 80) / "Notbuton stands alone." (reply 22) |
| 19 | `leave_the_accord` | Leave the Accord or Burn (to Belonton) | Focus | "Leave the Accord." (Belonton leaves the faction; white peace with Goldoroth if at war; sway Belonton +30; resolve −10; reply 23; AI 20, +30 if Goldoroth controls a Belonton state) / "Belonton keeps its oath." (resolve +5; reply 23) |
| 20 | `nafeher_answers` | Nafeher Answers | Reply to 13 | Result text |
| 21 | `sonargur_answers` | Sonargur Answers | Reply to 16 | Result text; if accepted, Goldoroth +25 PP |
| 22 | `notbuton_answers` | Notbuton Answers | Reply to 18 | Result text |
| 23 | `belonton_answers` | Belonton Answers | Reply to 19 | Result text |
| 24 | `nafeher_receives` | Nafeher Receives Cocanoor | Reply to 14 | Result text |

The tree also answers two foreign events: Volgan's `zin_volgan.13` "An Envoy from the South" and Lerendor's `zin_lerendor.9` "A Leren Envoy". Their AI weights for Goldoroth follow the mechanic spec (section 7) and this rule: with `zin_goldoroth_no_masters`, "Trade and no raids" ×1.5 in `zin_lerendor.9`; with `zin_goldoroth_southern_bargain`, ×0.3.

No event before `zin_afrit_revealed` names Afrit. No event names a hold as goblin until the owner assigns goblin holds.

## Historical AI route

With `zin_rule_historical_path` = `HISTORICAL` and `zin_rule_ai_goldoroth` = `DEFAULT`, the weights above make the AI follow this order. Dates are targets for the test run (proposed).

| Period | Focuses |
| --- | --- |
| Thaw to Longnight 1748 | warking_of_cocanoor, holds_of_the_inner_dark, the_armed_peace, forge_pits, gifts_of_black_iron |
| 1749 | chiefs_at_cocanoor, custom_of_the_blood_price, iron_clans_speak, iron_tithe, warrens_have_a_voice, goblin_tallymen, law_of_the_moot, fire_mountain_speaks |
| 1750 | strangers_from_the_south, bordon_question, dreson_question, black_iron_seams, roads_of_slag, warband_armouries, markets_of_the_holds, one_warking_one_law |
| 1751 | weigh_the_south, black_iron_crown, hunt_the_envoys, no_spirit_rules_the_dark, iron_yoke, dulundur_question, the_warbands |
| 1752 | tribute_of_the_holds, chiefs_keep_their_halls, fire_tempered_iron, heirs_of_the_uniting (Britag's line), fire_speakers, the_sea_of_darkness, britags_drill, goblin_skirmishers |
| 1753 | shield_of_the_free_dark, eyes_on_the_south, raiders_of_the_marches, eyes_in_notbuton, forts_on_the_march, war_pits, black_iron_for_sale, levies_of_the_warrens; lord_of_the_inner_dark when unity reaches 25 |
| 1754 | the_long_grudge (from Deepwinter), night_marches, blood_and_warband, a_forge_for_every_clan, raider_mounts, ogre_pacts, the_great_warband |
| Rainwake 1755 | hour_of_the_black_iron (on `zin_war_of_last_crowns`), bring_the_defiant_to_heel, mercy_for_the_kneeling, fire_through_the_holds, horde_unbound, warking_takes_the_field, forges_never_cool |
| Mistfall 1755 | dark_lands_stand_alone (on `zin_volgan_marches`), against_the_southern_host (if a sworn hold is at war) |
| 1756 | the_holds_are_one (if available), master_of_the_clans, horde_without_end, smoke_over_the_south, ash_rites, fire_in_the_blood, charts_of_the_dark_sea, black_sail_shipwrights |
| 1757 | black_iron_endures (on `zin_volgan_body_destroyed`); dead_on_the_dark_shore and its branch only if Zol is at war with a Dark Lands country; overlord_of_the_holds if unity reaches 50 |
| 1758 to 1760 | Leftover peace focuses: men_of_blackton, black_sail_corsairs, tolls_on_the_dark_straits, when_the_mountain_wakes, sow_doubt_in_the_accord |

On this route the AI never takes the_southern_bargain, kneel_to_nafeher, keep_the_armed_peace, clashes_on_the_march before 1754 or beyond_the_straits. It takes the_accord_must_break only under the conditions in the AI section; with Lerendor's guarantee of Dondor in place (Lerendor's historical The Shield of Dondor), it does not, and Dondor exists in 4A 1760.

## Alternative routes

| Route | How | Result |
| --- | --- | --- |
| The clan council | The Clans Rule Together | Stable, slower Goldoroth; every bloc content; less political power |
| The light yoke or the hard yoke | Chiefs Keep Their Halls / One Fire Under Cocanoor | Content tributaries that stay subjects, or fast annexation that frightens the free holds into the Moot |
| Keep the armed peace | Keep the Armed Peace | Tension falls; the clans grow restless; no claim on Dondor (the great war can still open the Hour of the Black Iron through Lord of the Inner Dark) |
| The early grudge | The Long Grudge from 1750, Clashes on the March from tension 60 | Border wars on the march; with raids at Gathering Dark ≥ 25, a casus belli on Dondor before the great war |
| The Southern Bargain | The Southern Bargain, Envoys to Nafeher, Ally of the South | Pact 2, then Sworn when Volgan takes "Sworn to Nafeher"; the northern front against Dondor and across the southern strait in 1755 |
| Kneel to Nafeher | Kneel to Nafeher after the march | Goldoroth becomes Volgan's sworn realm and a client toward Children of Volgan; the Lost Cause treats it as a dark power |
| The war of the Accord | The Accord Must Break when Dondor stands without an outside guarantor | Notbuton stormed; the Dark Sea won; with unity 75, The Dark Lands Are One |
| The living together | Zol's dead on the shore; The Living Together | Truce with Dondor while both fight Zol |
| Beyond the straits | One Kingdom, then Beyond the Straits during the great war | Claims on the Middle Lands and North Lands shores |

## Implementation

- Data: `docs/design/focus/goldoroth.json` (id `goldoroth`, tier `major`, countries `["Goldoroth"]`).
- Compiled: `common/national_focus/zin_goldoroth.txt`, `common/ideas/zin_focus_goldoroth.txt`, `events/zin_goldoroth.txt`, `localisation/english/zin_focus_goldoroth_l_english.yml`.
- Tree-declared scripted effects (`common/scripted_effects/zin_goldoroth.txt`): `zin_goldoroth_opinion` (args `who`, `modifier`: adds the named opinion modifier from the mechanic's list), `zin_goldoroth_break_from_nafeher` (Volgan `end_puppet` Goldoroth; resets autonomy; stance back). Every other effect and trigger comes from the mechanic (`zin_dark.txt`) or the Volgan, Lerendor, diplomacy and world systems specs.
- History: `history/countries/<Goldoroth tag>` adds spirit `quarrelsome_clans`; the mechanic's start values (temper, favours, sway, unity) come from `docs/design/start_situation.json`. Goldoroth's minor people `trolls` (peoples spec).
- Characters: Gorduth, Bredo, Sungor and Britag from the characters spec; Ulgra, Snikkit and Rask from the mechanic spec. Rask is recruited by "The Black-Sail Corsairs".
- `raw` blocks: one (`black_iron_seams`). Limit is ten.
- Icons from the shared catalog ([02_icon_catalog.md](../02_icon_catalog.md)); proposed new icons: `orc_moot`, `black_iron_crown`, `fire_mountain`, `iron_yoke`, `black_sail`, `dark_strait`, `orc_warband`, `troll_kin`, `ogre_pact`. All image-generated.
- Game rule `zin_rule_ai_goldoroth` (mechanic spec) sets the "rule" factors through `zin_rules_ai_branch_goldoroth_independent` and `zin_rules_ai_branch_goldoroth_sworn_to_volgan`.
- Focus filters: political (branches 1, 3, 6), industry (2), annexation (4, 9, 11), army (8, 9, 10), navy (7).
- Continuous focuses: none; the decisions carry repeated actions.

## AI

- Base weights are in the tables. Under `zin_rule_historical_path` = `HISTORICAL` the "hist" factors apply; `southern_bargain`, `kneel_to_nafeher` and `beyond_the_straits` get factor 0.
- `zin_rule_ai_goldoroth`: `INDEPENDENT` gives black_iron_crown ×10 and southern_bargain ×0; `SWORN_TO_VOLGAN` the reverse, plus kneel_to_nafeher ×5 after `zin_volgan_marches`; `RANDOM` picks one on the first day (global flag) and applies it.
- Peace branches carry the AI until `zin_goldoroth_war_open`; war focuses have weights 100 to 500 so they are taken as soon as available.
- **The Accord Must Break.** Weight 100 only when `zin_goldoroth_may_war_dondor` is true and either no great power outside the Accord guarantees Dondor, or that guarantor is at war with another great power and Goldoroth's divisions are at least 1.5 times the Accord's; weight 0 while `zin_dark_accord_holds` is set and the ratio is below 2.
- **The Dead on the Dark Shore.** Weight 200 only when Zol is at war with a Dark Lands country or controls a state on a Dark Strait; 20 otherwise.
- Decisions and strategies follow the mechanic's AI section.

## Acceptance

1. The compiler accepts `goldoroth.json`: 110 focuses, unique keys and positions, every prerequisite above its focus, exclusives symmetric, days multiples of 7, one raw block.
2. The HOI4 Agent Tools focus inspector reports no errors; the renderer shows the tree within 30 columns and 15 rows.
3. On 1 Thaw 1748 no war focus is available; "The Long Grudge" shows its 1750 date, "Clashes on the March" its tension condition, and "The Hour of the Black Iron" the war gate.
4. In the historical AI test run Goldoroth takes `black_iron_crown` before 1 Deepwinter 1753, `the_long_grudge` not before 1 Deepwinter 1754, `hour_of_the_black_iron` within 60 days of `zin_war_of_last_crowns`, and declares no war before `zin_goldoroth_war_open` is true.
5. With `zin_rule_ai_goldoroth` = `SWORN_TO_VOLGAN`, the AI completes `southern_bargain` and, once Volgan marches and pact 3 or subjecthood holds, `the_northern_front`.
6. "Kneel to Nafeher", accepted by Volgan, makes Goldoroth Volgan's subject with `zin_autonomy_sworn_realm`, Shadow government and stance `zin_shadow_horde`; "We were never his" ends it after `zin_volgan_body_destroyed`.
7. No Goldoroth tree text names Afrit, states the size of Volgan's hosts, says fire ends Zol's dead, places Dardan or names a goblin hold (compiler text check).
8. Every modifier in the spirits table exists in the game's modifier documentation.

## Open questions

1. Goldoroth's default here is independence ("Goldoroth bows to no spirit"). Do you want that, or a Goldoroth that leans toward Volgan?
2. Do you approve the four clan blocs (the Volcano Clans, the Iron Clans, the War-Clans, the Goblin Warrens) and their chiefs Sungor, Ulgra, Britag and Snikkit?
3. Is the Fire-Mountain above Cocanoor right for Goldoroth? The volcano clans are proposed in earlier specs, not in the vault.
4. Should Goldoroth go to war with Dondor in 4A 1755 on the historical path, or only with the defiant holds (as here)?
5. Should a united Dark Lands be called Great Goldoroth, or keep its name?
6. Should Goldoroth have a navy at all? The Sea of Darkness branch assumes it does; its start navy is two galleys.
