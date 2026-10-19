# Gunwaith focus tree

**Status:** Ready. Reviewed 19 October 2026 against CONVENTIONS "Status"; integrated 19 October 2026. **Priority:** 4. **Phase:** 4.

## Purpose

Gunwaith is the northern crown of the West Lands: a kingdom of clans and horse-breeders, tired after fifty years of war with Girdon and proud of a grudge older than Aenor's kings. Its tree turns the West's Fourth Age story into play. For the first years it is a tree of clan halls, horse fairs, a fragile truce and envoys to the western courts. Then the truce breaks, a stranger makes the peace, and Gunwaith leads the West in the great question: cross the wide sea for the old claims, keep to its own shore, or sail to Aenor's defence.

Tree id `gunwaith`; country Gunwaith (tier A, [01_tiers_and_coverage.md](../01_tiers_and_coverage.md)). 116 focuses. Mechanic: [The West Lands and the Western Crossing](../../04_mechanics/western_crossing.md); the Grey Ford war-kingship belongs to [Eindil's journey](../../04_mechanics/eindil_journey.md). Data format: [00_format_and_compiler.md](../00_format_and_compiler.md).

## Lore basis

**Established:** Gunwaith and Girdon are rivals of the West Lands; Gunwaith clans are a people of men. Aenor once conquered and settled the West, and every western court remembers it. Western banners fought at Dardan under their own commanders. Eindil is taken south by western travellers, makes peace between rivals and is made temporary war-king by a western confederation; he lays the title down. Western kingdoms plan a great crossing; their fleets cross the widened central sea, seize ports, occupy the capital and claim the human throne; the occupation becomes impossible under Zol's dead and Volgan; the fleet evacuates; some soldiers are stranded and join Eindil's coalition without their kingdoms becoming his subjects.

**Proposed:** the Truce of the Grey Ford (4A 1745), the Gunwaith trial, the Bridge of the Three Oaths and Girdon's Winter Ford (vault proposals); King Herlic, Lawspeaker Ilurda, Thane Datid Werlen and Captain Sarudo Bolpor ([characters](../../02_lore/02_characters.md)); Taryn of Gunwaith at Dardan (history spec); and, in this spec, every focus, spirit, event and number, the Ford Council, the Neck Road, the Western Purse, the River League, and Admiral Ostra Velk.

**Kept open:** who led the Crossing and who claimed the throne of men (the tree makes Gunwaith the leader on its own path, and the text says "the western claimant"); where the fleets landed; where Dardan lies; what became of the stranded westerners after the war. Before `zin_afrit_revealed` no text names Afrit; Aenor's god-king is "King Aurevan". Before `zin_eindil_awake` no visible focus mentions the stranger: his branch is hidden by `allow_branch`.

## Design

### Shape

| Columns | Rows | Branch | Opens | Drives |
| --- | --- | --- | --- | --- |
| 0–3 | 0–6 | A. The Clan Halls (court) | start | Political power; the war-thanes or the king's peace; truce drift |
| 5–7 | 0–5 | B. Horses and Timber (economy) | start | Industry; the Neck Road; the tariff protest |
| 9–11 | 0–7 | C. The Grey Ford (Girdon) | start; war half after `zin_west_truce_broken` | `zin_west_truce`; the feud; peace or hegemony over Girdon |
| 13–15 | 0–5 | D. The Lawspeaker's Rock (law) | start; lower half hidden until `zin_eindil_awake` | The trial; regard; renown |
| 16–18 | 0–5 | E. The Clans in Arms (army) | start | Army, manpower, spirits |
| 20–24 | 0–6 | F. The Ford Council (western diplomacy) | start | Grudge, unity, the council, the West's course |
| 25–29 | 0–6 | G. Ships for a Long Voyage (navy) | start | `zin_west_fleet` |
| 15–18 | 7–15 | H. The Western Crossing (historical route) | *Cross for the Old Claims* | Pledges, launch, landings, Parim |
| 15–18 | 16–19 | I. The Shore | Parim or the surrenders | Strain, evacuation, the stranded, or holding Parim |
| 20–22 | 7–10 | L. Our Own Shore | *The West Keeps Its Own Shore* | Western hegemony and trade |
| 23–25 | 7–11 | K. The Western Relief | *The Western Relief* | Landing as allies against the dark |
| 26–28 | 12–16 | J. Beside Former Foes | hidden until `zin_eindil_returned` | Eindil's coalition; the way home |

The grid is 30 columns wide (x 0 to 29) and 20 rows deep (y 0 to 19).

### The peaceful start

Rows 0 to 5 hold no war. Before 4A 1750 the only focuses that touch another country are envoys, tolls, a commission with Girdon, an offer of road and trade to Coldor, and a protest about tariffs. No focus adds a claim or war goal before the truce is broken and the Gathering Dark has risen (*Girdon Must Bend*, *The River Mouths*, *First Crown of the West*), or before the War of the Last Crowns (*Launch the Crossing*). The Crossing branch needs the route choice, and the launch needs the mechanic's `zin_west_crossing_ready`.

### Notation

Prerequisites: "a and b" means both; "a or b" means either. Effects use the compiler vocabulary; `call X (v)` is `{ "call": "X", "args": { "value": v } }`. Shorthand: **grudge +n (Name)** is `for_country Name: call zin_west_add_grudge (n)`; **grudge +n all** is `call zin_west_add_grudge_all (n)`; **truce**, **unity**, **fleet**, **strain** call `zin_west_add_truce`, `zin_west_add_unity`, `zin_west_add_fleet`, `zin_west_add_strain`; **regard** and **renown** call `zin_eindil_add_regard` (on Gunwaith) and `zin_eindil_add_renown`. Spirit keys compile to `zin_gunwaith_<key>`; event keys to `zin_gunwaith.<n>`. Building `where` uses `capital`, `random_owned`, `random_coastal` or a site key (`grey_ford` is `zin_is_site_grey_ford`). AI is the base weight; "hist" is the factor under `zin_rule_historical_path = HISTORICAL` or `zin_rule_west_route = historical`.

More notation:

- `event k (zin_gunwaith.n)` fires this tree's event `n`. `event_for Name zin_west.n` (or `zin_cold.n`) fires that mechanic's event for the country: a namespaced id names a mechanic-owned event, which the compiler checks exists (the event counterpart of decision S9's full mechanic idea ids).
- `research c b ×n`: `land_doctrine` and `naval_doctrine` are doctrine categories (the compiler writes `add_doctrine_cost_reduction` in 1.19.3); `zin_cat_arms` and `zin_cat_galleys` are the warfare spec's technology categories (`add_tech_bonus`), which fall back to `infantry_weapons` and `naval_equipment` until the warfare stage replaces the vanilla technologies.
- Equipment names the warfare spec's archetypes (`zin_arms_equipment`, `zin_mounts_equipment`; vanilla `infantry_equipment` until the warfare stage); `convoy_1` keeps its engine key and is shown as merchant cogs.
- Flags named `zin_gunwaith_*` are this tree's; `zin_west_*` names are the mechanic's ([western_crossing.md](../../04_mechanics/western_crossing.md)).

### Branch A: The Clan Halls

**Purpose:** King Herlic's court, the clan moot and the quarrel between the truce party and the war-thanes. **Opens:** at the start. **Mutual exclusions:** *The King's Peace* / *Heed the War-Thanes*. The King's Peace makes the truce firmer every month; the war-thanes wear it down and, on the historical path, carry Gunwaith to the feud and then across the sea. **Mechanic:** truce drift (`zin_west_truce`), grudge.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `clan_halls` | The Clan Halls of Gunwaith | — | — | 2,0 | 70 | political_power 75; add_spirit clan_halls_spirit | 100 |
| `truce_makers_court` | The Truce-Maker's Court | clan_halls | — | 1,1 | 35 | stability 0.03; truce +5 | 15; hist ×0.5 |
| `thanes_speak` | The Thanes Speak | clan_halls | — | 3,1 | 35 | war_support 0.05; political_power 25 | 20; hist ×2 |
| `call_the_clan_moot` | Call the Clan Moot | truce_makers_court | — | 1,2 | 35 | event clan_moot (zin_gunwaith.1) | 12 |
| `datids_grievance` | Thane Datid's Grievance | thanes_speak | — | 3,2 | 35 | event datids_grievance (zin_gunwaith.2); truce −5 | 15; hist ×3 |
| `the_kings_peace` | The King's Peace | call_the_clan_moot | heed_the_war_thanes | 1,3 | 70 | swap_spirit weary_clans → kings_peace; truce +10; unity +5 | 50; hist ×0 |
| `heed_the_war_thanes` | Heed the War-Thanes | datids_grievance | the_kings_peace | 3,3 | 70 | swap_spirit weary_clans → war_thanes; truce −10; grudge +5 (Gunwaith) | 50; hist ×10 |
| `one_law_one_crown` | One Law, One Crown | the_kings_peace or heed_the_war_thanes | — | 2,4 | 70 | political_power 100; stability 0.05 | 20 |
| `clan_levies_charter` | The Clan Levies Charter | one_law_one_crown | — | 1,5 | 35 | manpower 8000; add_spirit clan_levies | 12 |
| `taryns_banner` | Taryn's Banner | one_law_one_crown | — | 3,5 | 35 | war_support 0.05; army_experience 10; tooltip "Gunwaith's banner flew in the First Age under its own commanders." | 12 |
| `clans_as_one` | The Clans as One | clan_levies_charter and taryns_banner | — | 2,6 | 70 | swap_spirit clan_halls_spirit → clans_as_one_spirit; stability 0.05 | 15 |

### Branch B: Horses and Timber

**Purpose:** Gunwaith's economy of horses, timber and market towns (the economy spec gives it Horses and Timber), the Neck Road to the Cold Lands, and the protest against Aenor's tariffs. **Opens:** at the start. **Mechanic:** buildings; `zin_cold.70` (the Neck Road, [cold lands](../../04_mechanics/cold_lands.md)); `zin_west.10` (the tariff protest); a little fleet.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `horse_fairs` | The Horse Fairs | — | — | 6,0 | 70 | building industrial_complex 1 capital; political_power 25 | 25 |
| `highland_studs` | The Highland Studs | horse_fairs | — | 5,1 | 35 | add_spirit highland_studs_spirit | 10 |
| `timber_rights` | Timber Rights of the Clans | horse_fairs | — | 7,1 | 35 | building dockyard 1 random_coastal; fleet +2 | 12 |
| `market_towns` | The Market Towns | highland_studs | — | 5,2 | 70 | building industrial_complex 1 random_owned; building infrastructure 1 random_owned | 10 |
| `sawmills_of_the_west` | Sawmills of the West | timber_rights | — | 7,2 | 70 | building industrial_complex 1 random_owned; fleet +2 | 10 |
| `the_neck_road` | The Neck Road | market_towns or sawmills_of_the_west | — | 6,3 | 35 | event_for Coldor zin_cold.70; building infrastructure 1 random_owned | 15; hist ×2 |
| `western_forges` | Western Forges | the_neck_road | — | 5,4 | 70 | building arms_factory 2 capital | 10; ×2 with `zin_west_route_crossing` |
| `tariff_protest` | No Tariff Without Answer | the_neck_road | — | 7,4 | 35 | event_for Aenor zin_west.10; grudge +3 (Gunwaith) | 15; hist ×2 |
| `war_chest_of_the_west` | The War Chest of the West | western_forges and tariff_protest | — | 6,5 | 70 | political_power 75; equipment zin_arms_equipment 1500; add_spirit war_chest | 10; ×3 after `zin_war_of_last_crowns` |

### Branch C: The Grey Ford

**Purpose:** the truce with Girdon, the raids that wear it down, the feud when it breaks, and what Gunwaith makes of Girdon afterwards. **Opens:** at the start. **Mutual exclusions:** *The Ford Holds* / *Blood at the Grey Ford* (the truce becomes a lasting peace, or it breaks); *Brothers of the Ford* / *Girdon Must Bend* (alliance or hegemony after the feud). *Blood at the Grey Ford* follows the mechanic's `zin_west_break_truce`; it never causes it. **Mechanic:** `zin_west_truce`, `zin_west.20` (the Ford Commission), the Grey Ford Feud (border war), and the journey's war-king.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `the_grey_ford` | The Grey Ford | — | — | 10,0 | 35 | political_power 25; truce +3 | 20 |
| `ford_commission` | The Ford Commission | the_grey_ford | — | 9,1 | 35 | event_for Girdon zin_west.20 | 15; hist ×0.2 |
| `garrisons_on_the_ford` | Garrisons on the Ford | the_grey_ford | — | 11,1 | 35 | building bunker 1 grey_ford; truce −5 | 15; hist ×3 |
| `shared_tolls` | Shared Tolls at the Ford | ford_commission | — | 9,2 | 35 | political_power 50; truce +5; for_country Girdon: political_power 25 | 10 |
| `answer_the_ford_raids` | Answer the Ford Raids | garrisons_on_the_ford | — | 11,2 | 35 | army_experience 5; war_support 0.03; truce −10 | 12; hist ×3 |
| `the_ford_holds` | The Ford Holds | shared_tolls | blood_at_the_ford | 9,3 | 70 | available: variable zin_west_truce above 69, not global_flag zin_west_truce_broken; global_flag zin_west_truce_permanent; unity +15; for_country Girdon: stability 0.05 | 40; hist ×0 |
| `blood_at_the_ford` | Blood at the Grey Ford | shared_tolls or answer_the_ford_raids | the_ford_holds | 11,3 | 35 | available: global_flag zin_west_truce_broken; war_support 0.05; timed_spirit ford_feud 180 | 100 |
| `bridge_of_stone` | A Bridge of Stone at the Ford | the_ford_holds | — | 9,4 | 70 | building infrastructure 2 grey_ford; unity +5; for_country Girdon: building infrastructure 1 capital | 10 |
| `ride_to_the_ford` | Ride to the Ford | blood_at_the_ford | — | 11,4 | 35 | available: global_flag zin_west_truce_broken; army_experience 10; if global_flag zin_west_grey_ford_war: timed_spirit ford_riders 90 | 80 |
| `peace_at_the_ford` | Peace at the Ford | bridge_of_stone or ride_to_the_ford | — | 10,5 | 35 | available: not global_flag zin_west_grey_ford_war; stability 0.05; unity +5; remove_spirit ford_feud | 60 |
| `brothers_of_the_ford` | Brothers of the Ford | peace_at_the_ford | girdon_must_bend | 9,6 | 35 | non_aggression Girdon; call zin_gunwaith_heal_the_ford; unity +10 | 40; hist ×2 |
| `girdon_must_bend` | Girdon Must Bend | peace_at_the_ford | brothers_of_the_ford | 11,6 | 35 | claims_on Girdon; war_support 0.05; unity −10 | 5; hist ×0 |
| `the_river_league` | The River League | brothers_of_the_ford | — | 9,7 | 70 | guarantee Girdon; for_country Girdon: building dockyard 1 capital; fleet +5 | 15 |
| `the_river_mouths` | The River Mouths | girdon_must_bend | — | 11,7 | 35 | available: (global_flag zin_war_of_last_crowns or variable zin_gathering_dark above 24), not at_war; wargoal Girdon puppet_wargoal_focus | 30; hist ×0 |

### Branch D: The Lawspeaker's Rock

**Purpose:** Gunwaith's law, kept by Lawspeaker Ilurda, under which no man stands above judgment; then the stranger who submitted to it, the war-king the West remembers, and his warning. **Opens:** the top four at the start. *A Judgment Remembered* and everything below it carry `allow_branch = global_flag zin_eindil_awake`, so the lower half is invisible at the start. **Mechanic:** flag `zin_gunwaith_law_above_all` raises the AI weight of "Try him fairly" in the journey's *Judgment in Gunwaith* (event 22: ×2) and sets "Make an example of him" to ×0; Eindil regard and renown.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `lawspeakers_rock` | The Lawspeaker's Rock | — | — | 14,0 | 35 | stability 0.03; political_power 25 | 15 |
| `old_law_rolls` | The Old Law Rolls | lawspeakers_rock | — | 13,1 | 35 | political_power 50 | 10 |
| `judges_on_circuit` | Judges on Circuit | lawspeakers_rock | — | 15,1 | 35 | stability 0.05 | 10 |
| `no_man_above_the_law` | No Man Above the Law | old_law_rolls and judges_on_circuit | — | 14,2 | 70 | add_spirit law_above_all; flag zin_gunwaith_law_above_all | 12; hist ×3 |
| `judgment_remembered` | A Judgment Remembered | no_man_above_the_law | — | 14,3 | 35 | allow_branch: global_flag zin_eindil_awake; available: variable zin_eindil_stage above 2 (global; the Road South and its trial are past); regard +10; renown +3; stability 0.03 | 30 |
| `war_king_remembered` | The War-King Remembered | judgment_remembered | — | 13,4 | 35 | available: global_flag zin_eindil_war_king; unity +5; regard +5 | 20 |
| `songs_of_the_houseless_king` | Songs of the King Without a House | judgment_remembered | — | 15,4 | 35 | available: global_flag zin_eindil_war_king; renown +5; war_support 0.02 | 10 |
| `weigh_the_warning` | Weigh the Warning from the East | war_king_remembered or songs_of_the_houseless_king | — | 14,5 | 35 | available: global_flag zin_eindil_named; if flag zin_eindil_heeded: grudge −10 (Gunwaith), flag zin_gunwaith_weighs_the_warning; else: political_power 25 | 10; hist ×0 |

### Branch E: The Clans in Arms

**Purpose:** the clan host: hill fighters, horse clans, war-bands and the drill that turns them into an army able to fight across the sea. **Opens:** at the start. *Muster of the Thanes* needs a route that sails or a war. **Mechanic:** none beyond spirits and manpower.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `clans_in_arms` | The Clans in Arms | — | — | 17,0 | 35 | army_experience 10; research land_doctrine 0.5 ×1 | 20 |
| `hill_fighters` | Hill Fighters of the North | clans_in_arms | — | 16,1 | 35 | research zin_cat_arms 0.5 ×1 | 10 |
| `horse_clans` | The Horse Clans | clans_in_arms | — | 18,1 | 35 | add_spirit horse_clans_spirit | 10 |
| `drill_on_the_moors` | Drill on the Moors | hill_fighters | — | 16,2 | 70 | research land_doctrine 0.5 ×2 | 8 |
| `lancers_of_gunwaith` | Lancers of Gunwaith | horse_clans | — | 18,2 | 35 | equipment zin_mounts_equipment 1000; army_experience 10 | 8 |
| `clan_war_bands` | The Clan War-Bands | drill_on_the_moors and lancers_of_gunwaith | — | 17,3 | 70 | add_spirit clan_war_bands_spirit; manpower 5000 | 10 |
| `hill_forts` | The Hill Forts | clan_war_bands | — | 16,4 | 35 | building bunker 1 capital; building bunker 1 random_owned | 6 |
| `muster_of_the_thanes` | Muster of the Thanes | clan_war_bands | — | 18,4 | 35 | available: global_flag zin_west_route_crossing or global_flag zin_west_route_relief or at_war; manpower 15000; war_support 0.05 | 30 |
| `the_western_host` | The Western Host | hill_forts or muster_of_the_thanes | — | 17,5 | 70 | add_spirit western_host; army_experience 25 | 15; ×3 with `zin_west_route_crossing` |

### Branch F: The Ford Council

**Purpose:** Gunwaith's lead among the western courts: envoys, the merchant republics and old crowns, Aenoran gold and the Buldor contracts, the Ford Council, and the West's great question. **Opens:** at the start; *Convene the Ford Council* needs `zin_west_council_can_meet` (the feud is over and the war-king's peace made, or a lasting truce, or the date after 1 Thaw 1751; its tooltip reads "The West is at peace with itself."). **Mutual exclusions:** the three routes *Cross for the Old Claims* (historical) / *The West Keeps Its Own Shore* / *The Western Relief*. **Mechanic:** grudge, unity, `zin_west_convene_council`, `zin_west_set_route`; *The Western Relief* needs the tree trigger `zin_gunwaith_relief_possible`.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `voices_of_the_west` | Voices of the West | — | — | 22,0 | 35 | political_power 25; grudge +3 (Gunwaith) | 25 |
| `envoys_to_the_courts` | Envoys to the Western Courts | voices_of_the_west | — | 21,1 | 35 | unity +3; political_power 25 | 15 |
| `price_of_aenoran_gold` | The Price of Aenoran Gold | voices_of_the_west | — | 23,1 | 35 | event aenoran_gold (zin_gunwaith.3) | 12; hist ×2 |
| `merchant_republics` | The Merchant Republics | envoys_to_the_courts | — | 20,2 | 35 | grudge +5 (Kradlon); grudge +5 (Corogon); unity +3 | 12 |
| `old_crowns_of_the_west` | The Old Crowns of the West | envoys_to_the_courts | — | 22,2 | 35 | grudge +5 (Varnondor); grudge +5 (Lambin); unity +3 | 12 |
| `buldor_contracts` | The Buldor Contracts | price_of_aenoran_gold | — | 24,2 | 35 | event_for Buldor buldor_contracts (zin_gunwaith.4) | 10 |
| `convene_the_ford_council` | Convene the Ford Council | merchant_republics or old_crowns_of_the_west | — | 21,3 | 35 | available: check zin_west_council_can_meet; call zin_west_convene_council | 200 |
| `western_purse` | The Western Purse | buldor_contracts | — | 24,3 | 35 | political_power 50; fleet +3 | 10 |
| `grievances_of_the_west` | The Grievances of the West | convene_the_ford_council | — | 20,4 | 35 | grudge +5 all; unity +5 | 20; hist ×2 |
| `a_god_on_aenors_throne` | A God on Aenor's Throne | convene_the_ford_council | — | 22,4 | 35 | available: global_flag zin_aurevan_crowned; grudge +3 all; war_support 0.03 | 20 |
| `question_of_the_sea` | The Question of the Sea | grievances_of_the_west or a_god_on_aenors_throne | — | 22,5 | 70 | available: check zin_west_question_open; political_power 50 | 100 |
| `cross_for_the_old_claims` | Cross for the Old Claims | question_of_the_sea | west_keeps_its_own_shore, the_western_relief | 18,6 | 35 | call zin_west_set_route (crossing); war_support 0.10; grudge +5 all | resolve; hist ×100 |
| `west_keeps_its_own_shore` | The West Keeps Its Own Shore | question_of_the_sea | cross_for_the_old_claims, the_western_relief | 21,6 | 35 | call zin_west_set_route (divided); stability 0.05 | 100 − resolve; hist ×0 |
| `the_western_relief` | The Western Relief | question_of_the_sea | cross_for_the_old_claims, west_keeps_its_own_shore | 24,6 | 35 | available: check zin_gunwaith_relief_possible; call zin_west_set_route (relief); regard +5 | 2 × average council regard; hist ×0 |

### Branch G: Ships for a Long Voyage

**Purpose:** shipwrights, harbours, island charts and the yards that build a fleet able to cross a sea far wider than the old maps showed. In peace it reads as trade; once a route sails, it becomes the crossing fleet. **Opens:** at the start; *Ships for a Long Voyage* needs the Ford Council; the last three need the crossing or relief route. **Mechanic:** `zin_west_fleet`; `zin_gunwaith.5` (the island charter).

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `western_shipwrights` | Western Shipwrights | — | — | 27,0 | 35 | building dockyard 1 random_coastal; fleet +3 | 15 |
| `merchant_fleets` | Merchant Fleets of the West | western_shipwrights | — | 26,1 | 35 | equipment convoy_1 20; political_power 25 | 10 |
| `harbours_of_gunwaith` | Harbours of Gunwaith | western_shipwrights | — | 28,1 | 35 | building naval_base 2 random_coastal | 10 |
| `charts_of_the_pupor_ocean` | Charts of the Pupor Ocean | merchant_fleets | — | 25,2 | 35 | event_for Adel island_charter (zin_gunwaith.5); navy_experience 10 | 10; hist ×2 |
| `timber_from_the_north` | Timber from the North | merchant_fleets or harbours_of_gunwaith | — | 27,2 | 35 | building dockyard 1 random_coastal; fleet +3 | 10 |
| `war_galleys` | War Galleys | harbours_of_gunwaith | — | 29,2 | 70 | research zin_cat_galleys 0.5 ×2 | 8 |
| `sea_captains_guild` | The Sea-Captains' Guild | charts_of_the_pupor_ocean or timber_from_the_north | — | 26,3 | 35 | add_spirit sea_captains; navy_experience 10 | 10 |
| `the_great_yards` | The Great Yards | timber_from_the_north or war_galleys | — | 28,3 | 70 | building dockyard 2 random_coastal; fleet +3 | 10 |
| `ships_for_a_long_voyage` | Ships for a Long Voyage | sea_captains_guild and the_great_yards | — | 27,4 | 70 | available: global_flag zin_west_council; fleet +10 | 20; ×5 with `zin_west_route_crossing` |
| `transports_of_the_west` | Transports of the West | ships_for_a_long_voyage | — | 26,5 | 35 | available: global_flag zin_west_route_crossing or global_flag zin_west_route_relief; fleet +10; add_spirit transports | 30 |
| `escorts_for_the_host` | Escorts for the Host | ships_for_a_long_voyage | — | 28,5 | 35 | available: global_flag zin_west_route_crossing or global_flag zin_west_route_relief; research naval_doctrine 0.5 ×1; navy_experience 20 | 25 |
| `the_crossing_fleet` | The Crossing Fleet | transports_of_the_west and escorts_for_the_host | — | 27,6 | 70 | fleet +10; add_spirit crossing_fleet | 30 |

### Branch H: The Western Crossing

**Purpose:** the historical route: the call to cross, the oaths, the launch on the War of the Last Crowns, the landings on Aenor Isle and the mainland shore, the march on Parim and the claim to the throne of men. **Opens:** *Cross for the Old Claims*. *Launch the Crossing* needs `zin_west_crossing_ready` (fleet ≥ 50, resolve ≥ 60, three pledges, and the War of the Last Crowns or an early-crossing condition). **Mutual exclusions:** *Claim the Throne of Men* (historical) / *Hold Parim as a Pledge*. **Mechanic:** `zin_west_call_pledges`, `zin_west_launch_crossing`, the sailings, `zin_west_grant_surrenders`, `zin_west_choose_parim`. Admiral Ostra Velk (proposed) is recruited by *The Sea-Lords' Plan*.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `call_to_cross` | The Call to Cross | cross_for_the_old_claims | — | 17,7 | 35 | call zin_west_call_pledges | 200 |
| `oaths_on_the_shore` | Oaths on the Shore | call_to_cross | — | 16,8 | 35 | manpower 10000; war_support 0.05; unity +5 | 50 |
| `sea_lords_plan` | The Sea-Lords' Plan | call_to_cross | — | 18,8 | 35 | research naval_doctrine 0.5 ×1; fleet +5; call zin_gunwaith_recruit (zin_gunwaith_ostra) | 50 |
| `launch_the_crossing` | Launch the Crossing | oaths_on_the_shore and sea_lords_plan | — | 17,9 | 35 | available: check zin_west_crossing_ready; call zin_west_launch_crossing | 500 |
| `the_isle_first` | The Isle First | launch_the_crossing | — | 16,10 | 35 | available: global_flag zin_western_crossing; timed_spirit isle_landings 180; army_experience 10 | 60 |
| `the_wide_sea_crossed` | The Wide Sea Crossed | launch_the_crossing | — | 18,10 | 35 | available: global_flag zin_western_crossing; navy_experience 15; fleet +5 | 50 |
| `seize_the_western_ports` | Seize the Western Ports | the_isle_first or the_wide_sea_crossed | — | 17,11 | 35 | available: check zin_west_holds_aenor_states; timed_spirit beachheads 180 | 80 |
| `march_on_parim` | The March on Parim | seize_the_western_ports | — | 16,12 | 35 | available: check zin_west_holds_aenor_states; timed_spirit march_on_parim_spirit 180; war_support 0.05 | 80 |
| `accept_the_surrenders` | Accept the Surrenders | seize_the_western_ports | — | 18,12 | 35 | available: check zin_west_holds_aenor_states; call zin_west_grant_surrenders | 50 |
| `keys_of_parim` | The Keys of Parim | march_on_parim | — | 17,13 | 35 | available: check zin_west_controls_parim; political_power 100; war_support 0.05 | 500 |
| `claim_the_throne_of_men` | Claim the Throne of Men | keys_of_parim | parim_as_pledge | 16,14 | 35 | call zin_west_choose_parim (claim) | 20; hist ×100 |
| `parim_as_pledge` | Hold Parim as a Pledge | keys_of_parim | claim_the_throne_of_men | 18,14 | 35 | call zin_west_choose_parim (pledge) | 20; hist ×0 |
| `governors_of_parim` | Governors of Parim | claim_the_throne_of_men or parim_as_pledge | — | 17,15 | 35 | add_spirit western_garrison; strain −5 | 60 |

### Branch I: The Shore

**Purpose:** what the conquest costs: the dead from the north and the fire from the south, the choice to sail home or hold what was taken, the evacuation and those left behind, or a western crown that keeps Parim. **Opens:** *Governors of Parim* or *Accept the Surrenders* (an army can be in the Middle Lands without Parim). **Mutual exclusions:** *Sail Home* (historical) / *Hold What We Took*. They follow the mechanic's *The Shore Calls*: *Sail Home* needs `zin_west_evacuation`, *Hold What We Took* needs `zin_west_route_hold`. *Sail Home* takes 7 days and *The Fleet at the Shore* 14, so both finish inside the 60-day evacuation. **Mechanic:** strain, the evacuation lift (fleet), `zin_gunwaith.6`.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `dead_and_the_south` | Death from the North, Fire from the South | governors_of_parim or accept_the_surrenders | — | 17,16 | 35 | available: global_flag zin_zol_rising or global_flag zin_volgan_marches; event dead_and_south (zin_gunwaith.6); army_experience 10 | 60 |
| `sail_home` | Sail Home | dead_and_the_south | hold_what_we_took | 16,17 | 7 | available: global_flag zin_west_evacuation; fleet +5; remove_spirit western_garrison | 200 |
| `hold_what_we_took` | Hold What We Took | dead_and_the_south | sail_home | 18,17 | 35 | available: global_flag zin_west_route_hold; war_support 0.05; strain −10 | 100 |
| `fleet_at_the_shore` | The Fleet at the Shore | sail_home | — | 16,18 | 14 | available: global_flag zin_west_evacuation, not global_flag zin_west_evacuated; fleet +10; navy_experience 10 | 200 |
| `a_crown_across_the_sea` | A Crown Across the Sea | hold_what_we_took | — | 18,18 | 70 | available: check zin_west_controls_parim; political_power 100; stability 0.05; add_spirit crown_across_the_sea | 50 |
| `those_left_behind` | Those Left Behind | fleet_at_the_shore | — | 15,19 | 35 | available: global_flag zin_west_evacuated; stability 0.05; political_power 50 | 50 |
| `the_western_regency` | The Western Regency of Parim | a_crown_across_the_sea | — | 18,19 | 35 | available: check zin_west_controls_parim; strain −10; political_power 50 | 30 |

### Branch L: Our Own Shore

**Purpose:** the divided route: the West does not cross; Gunwaith turns to the home lands, makes itself first crown of the West by pressure or trade, and keeps a western peace. **Opens:** *The West Keeps Its Own Shore*. *First Crown of the West* needs `zin_gathering_dark` ≥ 25; *The Lesser Crowns Bend* gives a war goal only while Gunwaith is at peace. **Mechanic:** tree effects `zin_gunwaith_claim_lesser_crowns`, `zin_gunwaith_wargoal_lesser_crown`; unity.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `our_own_shore` | Our Own Shore | west_keeps_its_own_shore | — | 21,7 | 35 | stability 0.05; political_power 50 | 50 |
| `first_crown_of_the_west` | First Crown of the West | our_own_shore | — | 20,8 | 70 | available: variable zin_gathering_dark above 24; call zin_gunwaith_claim_lesser_crowns | 20 |
| `accord_on_the_neck` | An Accord on the Neck | our_own_shore | — | 22,8 | 35 | non_aggression Coldor; political_power 25 | 15 |
| `lesser_crowns_bend` | The Lesser Crowns Bend | first_crown_of_the_west | — | 20,9 | 35 | available: not at_war; call zin_gunwaith_wargoal_lesser_crown | 15 |
| `western_trade_league` | The Western Trade League | accord_on_the_neck | — | 22,9 | 70 | add_spirit western_trade_league_spirit; unity +10 | 15 |
| `the_western_peace` | The Western Peace | lesser_crowns_bend or western_trade_league | — | 21,10 | 70 | add_spirit western_peace; stability 0.05 | 15 |

### Branch K: The Western Relief

**Purpose:** the West sails to defend the Middle Lands against the dark, as allies and not as conquerors. **Opens:** *The Western Relief*. *Land as Friends* needs the War of the Last Crowns; Aenor must have granted passage in `zin_west.50` (*Letters from the West*) for the landing to use friendly ports. **Mechanic:** `zin_west_launch_relief`; the Lost Cause; Eindil regard.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `letters_to_parim` | Letters to Parim | the_western_relief | — | 24,7 | 35 | event_for Aenor zin_west.50 | 100 |
| `answer_the_lost_cause` | Answer the Lost Cause | letters_to_parim | — | 23,8 | 35 | flag zin_lost_cause_member; call zin_lost_cause_add_strength (5); regard +5 | 50 |
| `relief_fleet` | The Relief Fleet | letters_to_parim | — | 25,8 | 35 | fleet +10; navy_experience 10 | 50 |
| `land_as_friends` | Land as Friends | answer_the_lost_cause and relief_fleet | — | 24,9 | 35 | available: global_flag zin_war_of_last_crowns; call zin_west_launch_relief | 500 |
| `shields_on_the_shore` | Shields on the Shore | land_as_friends | — | 23,10 | 35 | add_spirit shields_on_the_shore_spirit | 50 |
| `west_remembers_dardan` | The West Remembers Dardan | land_as_friends | — | 25,10 | 35 | war_support 0.10; army_experience 15; tooltip "Western banners stood with the Grand Alliance in the First Age." | 40 |
| `wardens_beyond_the_sea` | Wardens Beyond the Sea | shields_on_the_shore or west_remembers_dardan | — | 24,11 | 70 | add_spirit wardens_beyond_the_sea_spirit; regard +10 | 40 |

### Branch J: Beside Former Foes

**Purpose:** the stranded host, or the relief army, under the banner of the king the West once made war-king; the fight against Zol's dead and Volgan; the long way home. **Opens:** the root carries `allow_branch = global_flag zin_eindil_returned` and needs `zin_west_stranded` or the relief route. **Mechanic:** `zin_eindil_join_coalition`; the mechanic's *The Long Way Home* (`zin_west.70`); `zin_gunwaith.7`.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `beside_former_foes` | Beside Former Foes | — | — | 27,12 | 35 | allow_branch: global_flag zin_eindil_returned; available: flag zin_west_stranded or global_flag zin_west_route_relief; call zin_eindil_join_coalition; army_experience 10 | 300 |
| `under_the_old_banner` | Under the War-King's Banner | beside_former_foes | — | 26,13 | 35 | available: global_flag zin_west_remembers_war_king; add_spirit old_banner; regard +5 | 60 |
| `against_the_deathless` | Against the Deathless | beside_former_foes | — | 28,13 | 35 | timed_spirit against_the_deathless_spirit 365; research land_doctrine 0.5 ×1 | 60 |
| `hailed_by_the_living` | Hailed by the Living | under_the_old_banner or against_the_deathless | — | 27,14 | 35 | available: global_flag zin_eindil_restored or global_flag zin_volgan_body_destroyed; war_support 0.05; regard +10 | 60 |
| `the_long_way_home` | The Long Way Home | hailed_by_the_living | — | 27,15 | 35 | available: global_flag zin_afrit_dead or global_flag zin_eindil_crowned; stability 0.05; political_power 50 | 60 |
| `equals_across_the_sea` | Equals Across the Sea | the_long_way_home | — | 27,16 | 35 | available: global_flag zin_eindil_crowned; event_for Aenor equals_across_the_sea (zin_gunwaith.7) | 60 |

### Count

| Branch | Focuses |
| --- | ---: |
| A. The Clan Halls | 11 |
| B. Horses and Timber | 9 |
| C. The Grey Ford | 14 |
| D. The Lawspeaker's Rock | 8 |
| E. The Clans in Arms | 9 |
| F. The Ford Council | 14 |
| G. Ships for a Long Voyage | 12 |
| H. The Western Crossing | 13 |
| I. The Shore | 7 |
| L. Our Own Shore | 6 |
| K. The Western Relief | 7 |
| J. Beside Former Foes | 6 |
| **Total** | **116** |

## Spirits

Keys compile to `zin_gunwaith_<key>`. Mechanic spirits (`zin_west_*`) are listed in the mechanic spec. The Western Crossing mechanic reads `zin_gunwaith_kings_peace` and `zin_gunwaith_war_thanes`; the focus that adds the first is `the_kings_peace` (`zin_gunwaith_the_kings_peace`), so the spirit and focus ids differ (F3).

| Key | Name | Modifiers | Added / removed |
| --- | --- | --- | --- |
| `weary_clans` | Fifty Years of War | `war_support_factor` −0.10, `recruitable_population_factor` −0.05 | Start (the mechanic's setup `zin_west.1`); swapped by *The King's Peace* or *Heed the War-Thanes*. Icon `banner_laid_down` |
| `clan_halls_spirit` | The Clan Halls | `political_power_gain` 0.10 | *The Clan Halls of Gunwaith*; swapped by *The Clans as One* |
| `clans_as_one_spirit` | The Clans as One | `political_power_gain` 0.15, `stability_factor` 0.05 | *The Clans as One* |
| `kings_peace` | The King's Peace | `stability_factor` 0.05, `war_support_factor` −0.05 (truce +0.5 a month in the mechanic) | *The King's Peace* |
| `war_thanes` | The War-Thanes | `war_support_factor` 0.10, `stability_factor` −0.03 (truce −0.5 a month in the mechanic) | *Heed the War-Thanes* |
| `clan_levies` | The Clan Levies | `conscription_factor` 0.05 | *The Clan Levies Charter* |
| `highland_studs_spirit` | The Highland Studs | `supply_consumption_factor` −0.05 | *The Highland Studs* |
| `war_chest` | The War Chest of the West | `consumer_goods_factor` −0.03 | *The War Chest of the West* |
| `ford_feud` | The Grey Ford Feud | `army_morale_factor` 0.10, `war_support_factor` 0.05 | *Blood at the Grey Ford*, 180 days; removed by *Peace at the Ford* |
| `ford_riders` | Riders at the Ford | `army_attack_factor` 0.10 | *Ride to the Ford*, 90 days |
| `law_above_all` | No Man Above the Law | `stability_factor` 0.05, `drift_defence_factor` 0.10 | *No Man Above the Law* |
| `horse_clans_spirit` | The Horse Clans | `army_speed_factor` 0.05 | *The Horse Clans* |
| `clan_war_bands_spirit` | The Clan War-Bands | `army_morale_factor` 0.05, `recruitable_population_factor` 0.02 | *The Clan War-Bands* |
| `western_host` | The Western Host | `army_org_factor` 0.05, `experience_gain_army_factor` 0.10 | *The Western Host* |
| `sea_captains` | The Sea-Captains' Guild | `navy_org_factor` 0.05, `naval_speed_factor` 0.05 | *The Sea-Captains' Guild* |
| `transports` | Transports of the West | `naval_invasion_capacity` 10 | *Transports of the West* |
| `crossing_fleet` | The Crossing Fleet | `naval_invasion_prep_speed` 0.25, `naval_invasion_capacity` 10, `convoy_escort_efficiency` 0.10 | *The Crossing Fleet* |
| `isle_landings` | Landings on the Isle | `amphibious_invasion` 0.25, `army_defence_factor` 0.05 | *The Isle First*, 180 days |
| `beachheads` | The Beachheads | `army_attack_factor` 0.05, `supply_consumption_factor` −0.05 | *Seize the Western Ports*, 180 days |
| `march_on_parim_spirit` | The March on Parim | `army_speed_factor` 0.10, `army_attack_factor` 0.05 | *The March on Parim*, 180 days |
| `western_garrison` | Governors of Parim | `required_garrison_factor` −0.20 (strain −1 a month in the mechanic) | *Governors of Parim*; removed by *Sail Home* |
| `crown_across_the_sea` | A Crown Across the Sea | `political_power_gain` 0.15, `resistance_target_on_our_occupied_states` −0.10 | *A Crown Across the Sea* |
| `western_trade_league_spirit` | The Western Trade League | `consumer_goods_factor` −0.02, `trade_opinion_factor` 0.10 | *The Western Trade League* |
| `western_peace` | The Western Peace | `stability_factor` 0.05, `political_power_gain` 0.10 | *The Western Peace* |
| `shields_on_the_shore_spirit` | Shields on the Shore | `army_defence_factor` 0.10 | *Shields on the Shore* |
| `wardens_beyond_the_sea_spirit` | Wardens Beyond the Sea | `army_defence_factor` 0.05, `army_morale_factor` 0.05, `war_support_factor` 0.05 | *Wardens Beyond the Sea* |
| `old_banner` | Under the War-King's Banner | `army_morale_factor` 0.10 | *Under the War-King's Banner* |
| `against_the_deathless_spirit` | Against the Deathless | `army_defence_factor` 0.10, `army_org_factor` 0.05 | *Against the Deathless*, 365 days |

## Events (namespace `zin_gunwaith`)

| Id | Key | Title | Trigger | Picture | Options (effects; AI weight) |
| --- | --- | --- | --- | --- | --- |
| 1 | `clan_moot` | The Clan Moot | Focus | `generic_court` | "The clans ask for peace." (stability +3 %, truce +5; AI 40) / "The clans ask for their due." (political power +50, truce −5; AI 60, hist ×2) |
| 2 | `datids_grievance` | Thane Datid's Grievance | Focus | `generic_court` | "Hear him." (war support +5 %, truce −5; AI 60, hist ×3) / "Silence him." (stability +3 %, political power −25; AI 40) |
| 3 | `aenoran_gold` | The Price of Aenoran Gold | Focus | `golden_court` | "Take the gold." (political power +75; grudge −5 on Gunwaith; spirit `zin_west_aenoran_gold` 180 days; AI 40) / "Gunwaith is not for sale." (grudge +5 on Gunwaith; unity +3; AI 60, hist ×3) |
| 4 | `buldor_contracts` | Contracts from Gunwaith (to Buldor) | Focus | `generic_war` | "Our swords go west." (timed Buldor flag `zin_west_buldor_west`, 730 days: the economy spec's Aenor decision "Hire the Buldor Companies" is unavailable while it is set; Buldor +50 political power, grudge +5; AI 60) / "Our swords go to whoever pays most." (nothing; AI 40) |
| 5 | `island_charter` | A Charter for the Western Fleet (to Adel) | Focus | `generic_sea` | "Sell the charts and the ships." (Adel +50 political power; fleet +5; AI 70) / "The islands keep out of it." (AI 30) |
| 6 | `dead_and_south` | Death from the North, Fire from the South | Focus | `dead_lands_storm` | "Hold the line while we can." (strain −5; AI 60) / "Ready the ships." (fleet +5; AI 40) |
| 7 | `equals_across_the_sea` | Equals Across the Sea (to Aenor) | Focus | `generic_peace` | "Sign as equals." (non-aggression pact with Gunwaith; `zin_gunwaith_opinion_equals` both ways; AI 70 if Gunwaith has `zin_west_fought_beside`, else 30) / "Not yet." (nothing). The text speaks of "this telling" and states no post-war order. |

The tree also fires mechanic events (`zin_west.10`, `.20`, `.50`; `zin_cold.70`) whose texts and pictures live in the mechanic files. Pictures are catalog keys ([../02_icon_catalog.md](../02_icon_catalog.md)); none is gated.

## Historical AI route

With `zin_rule_historical_path` (or `zin_rule_west_route = historical`), weights above make the AI follow this order. Dates are targets for the test run.

| Period | Focuses |
| --- | --- |
| Thaw to Longnight 1748 | clan_halls, thanes_speak, datids_grievance, voices_of_the_west, the_grey_ford, garrisons_on_the_ford |
| 1749 | heed_the_war_thanes, answer_the_ford_raids, horse_fairs, lawspeakers_rock, old_law_rolls, judges_on_circuit, no_man_above_the_law (before Deepwinter 1750, when the trial fires) |
| 1750 | blood_at_the_ford (after the truce breaks on 1 Rainwake), ride_to_the_ford, judgment_remembered, one_law_one_crown, price_of_aenoran_gold, peace_at_the_ford (after the war-king's peace), brothers_of_the_ford |
| 1751 | envoys_to_the_courts, war_king_remembered, merchant_republics, convene_the_ford_council, old_crowns_of_the_west, western_shipwrights, merchant_fleets |
| 1752 | grievances_of_the_west, a_god_on_aenors_throne, highland_studs, timber_rights, market_towns, the_neck_road, harbours_of_gunwaith |
| 1753 | question_of_the_sea, cross_for_the_old_claims, charts_of_the_pupor_ocean, timber_from_the_north, sea_captains_guild, the_great_yards |
| 1754 | ships_for_a_long_voyage, transports_of_the_west, escorts_for_the_host, call_to_cross (pledges), oaths_on_the_shore, sea_lords_plan |
| 1755 | the_crossing_fleet; launch_the_crossing (within 60 days of `zin_war_of_last_crowns`, about Rainwake); the_isle_first, seize_the_western_ports, clans_in_arms |
| 1756 | march_on_parim, accept_the_surrenders, keys_of_parim (from Sowing, when the Captains yield), claim_the_throne_of_men, governors_of_parim, dead_and_the_south |
| Mistfall 1756 to Ironfrost 1757 | sail_home, fleet_at_the_shore (inside the 60-day evacuation), those_left_behind |
| 1757 | beside_former_foes (on `zin_eindil_returned`), under_the_old_banner, against_the_deathless, hailed_by_the_living |
| 1758 to 1760 | the_long_way_home (after `zin_afrit_dead`), equals_across_the_sea (after `zin_eindil_crowned`); leftover economy and army focuses |

The AI never takes `the_kings_peace`, `the_ford_holds`, `girdon_must_bend`, `the_river_mouths`, `weigh_the_warning`, `west_keeps_its_own_shore`, `the_western_relief`, `parim_as_pledge` or `hold_what_we_took` on the historical path.

## Alternative routes

| Route | How | Result |
| --- | --- | --- |
| The King's Peace | *The King's Peace*, then *The Ford Holds* at truce ≥ 70 | No feud; the journey's war-king story uses its feud-without-war fallback; the Ford Council meets from 1751 with higher unity |
| Mastery of Girdon | *Girdon Must Bend*, *The River Mouths* | Girdon a Gunwaith puppet; unity falls; the West is less likely to follow Gunwaith across the sea |
| Our Own Shore | *The West Keeps Its Own Shore* | No crossing; western hegemony at home; Aenor is spared a western front |
| The Western Relief | *The Western Relief* (needs `zin_gunwaith_relief_possible`) | The West lands as Aenor's allies; Lost Cause membership; high regard; no stranded armies |
| Hold What We Took | *Hold What We Took* at the Shore Calls | Strain climbs; the host may break; if Parim is held to 4A 1760, the outcome "a western crown holds Parim" |
| Early crossing | Launch after 1 Thaw 1754 with resolve ≥ 80 while Aenor is in civil war or at war with a great power | The Crossing sails before the War of the Last Crowns; Gathering Dark +10 |

## Implementation

### Files

| File | Written by | Content |
| --- | --- | --- |
| `docs/design/focus/gunwaith.json` | hand-authored data | The tree (id `gunwaith`, tier `major`, countries `["Gunwaith"]`) |
| `common/national_focus/zin_gunwaith.txt` | `tools/content/modules/focus_compiler.mjs` | The 116 focuses |
| `common/ideas/zin_focus_gunwaith.txt` | same | The 28 spirits (`zin_gunwaith_<key>`) |
| `events/zin_gunwaith.txt` | same | Events `zin_gunwaith.1`–`.7` |
| `common/scripted_effects/zin_gunwaith.txt`, `common/scripted_triggers/zin_gunwaith.txt` | same | The tree-declared effects and trigger below |
| `common/opinion_modifiers/zin_gunwaith.txt` | same | `zin_gunwaith_ford_brothers` (+25, no decay) and `zin_gunwaith_opinion_equals` (+25, no decay), by the tree-declared opinion pattern of [00_contract_additions.md](../../04_mechanics/00_contract_additions.md) |
| `localisation/english/zin_focus_gunwaith_l_english.yml` | same | All the tree's text |

The compiler writes them in the builder's one transaction through the shared rewrite engine. Compiled, the tree replaces the interim Long Peace tree (`zin_long_peace_*`, written today by `tools/content/modules/vanilla_removal.mjs`) for Gunwaith. Every `zin_west_*` call and check is defined by the Western Crossing mechanic in `common/scripted_effects/zin_west.txt` and `common/scripted_triggers/zin_west.txt`; `zin_eindil_add_regard`, `zin_eindil_add_renown` and `zin_eindil_join_coalition` by [Eindil's journey](../../04_mechanics/eindil_journey.md); `zin_lost_cause_add_strength` by the contract additions.

- **Start values.** The start spirit `zin_gunwaith_weary_clans` is added by the mechanic's setup event `zin_west.1` (`on_startup`; requested from the Western Crossing spec, because country histories come from the politics step), which also sets grudge 55.
- **`raw` blocks:** none.
- **`allow_branch`:** `judgment_remembered` (`zin_eindil_awake`) and `beside_former_foes` (`zin_eindil_returned`). The journey's flag-setting effects call `mark_focus_tree_layout_dirty` for Gunwaith when they set those flags.
- **Flags the tree sets:** `zin_gunwaith_law_above_all` (read by the journey's *Judgment in Gunwaith*, `zin_eindil.22`), `zin_gunwaith_weighs_the_warning` (record only); the mechanic's and contract's `zin_west_truce_permanent` (global), `zin_west_buldor_west` (timed, on Buldor) and `zin_lost_cause_member`.

### Icons

Every key is from the icon catalog ([../02_icon_catalog.md](../02_icon_catalog.md)); no new key is needed. Spirits use the icon of the focus that adds them; the start spirit `weary_clans` uses `banner_laid_down`. No icon shows the stranger.

| Branch | Focus → icon |
| --- | --- |
| A | clan_halls `banner_league`; truce_makers_court `olive_branch`; thanes_speak `war_drums`; call_the_clan_moot `council_table`; datids_grievance `scroll_sealed`; the_kings_peace `seal_royal`; heed_the_war_thanes `sword_shield`; one_law_one_crown `crown_iron`; clan_levies_charter `levy_muster`; taryns_banner `banner_plain`; clans_as_one `alliance_rings` |
| B | horse_fairs `herds`; highland_studs `horse_cavalry`; timber_rights `timber_mill`; market_towns `market_stalls`; sawmills_of_the_west `timber_mill`; the_neck_road `roads_paved`; western_forges `forge_anvil`; tariff_protest `toll_house`; war_chest_of_the_west `coin_chest` |
| C | the_grey_ford `grey_ford`; ford_commission `council_table`; garrisons_on_the_ford `fort_wall`; shared_tolls `toll_house`; answer_the_ford_raids `spear_levy`; the_ford_holds `river_ford`; blood_at_the_ford `banner_black`; bridge_of_stone `bridge_oaths`; ride_to_the_ford `horse_cavalry`; peace_at_the_ford `olive_branch`; brothers_of_the_ford `handshake_oath`; girdon_must_bend `crown_broken`; the_river_league `alliance_rings`; the_river_mouths `anchor_rope` |
| D | lawspeakers_rock `rune_stone`; old_law_rolls `book_lore`; judges_on_circuit `scroll_sealed`; no_man_above_the_law `charter_old`; judgment_remembered `lone_sword`; war_king_remembered `crown_hailed`; songs_of_the_houseless_king `hymn_choir`; weigh_the_warning `beacon` |
| E | clans_in_arms `sword_shield`; hill_fighters `mountain_pass`; horse_clans `horse_cavalry`; drill_on_the_moors `spear_levy`; lancers_of_gunwaith `knight_lance`; clan_war_bands `war_drums`; hill_forts `pass_fort`; muster_of_the_thanes `levy_muster`; the_western_host `banner_league` |
| F | voices_of_the_west `envoy`; envoys_to_the_courts `envoy`; price_of_aenoran_gold `coin_chest`; merchant_republics `guild_hall`; old_crowns_of_the_west `crown_iron`; buldor_contracts `scroll_treaty`; convene_the_ford_council `council_table`; western_purse `ledger_coins`; grievances_of_the_west `charter_old`; a_god_on_aenors_throne `crown_radiant`; question_of_the_sea `map_unrolled`; cross_for_the_old_claims `ship_voyage`; west_keeps_its_own_shore `fort_wall`; the_western_relief `beacon` |
| G | western_shipwrights `shipwright_yard`; merchant_fleets `anchor_rope`; harbours_of_gunwaith `harbour_lake`; charts_of_the_pupor_ocean `sea_charts`; timber_from_the_north `timber_mill`; war_galleys `galley_oars`; sea_captains_guild `guild_hall`; the_great_yards `shipwright_yard`; ships_for_a_long_voyage `great_warship`; transports_of_the_west `ship_voyage`; escorts_for_the_host `warship_sail`; the_crossing_fleet `great_warship` |
| H | call_to_cross `war_drums`; oaths_on_the_shore `handshake_oath`; sea_lords_plan `war_council_map`; launch_the_crossing `ship_voyage`; the_isle_first `lighthouse`; the_wide_sea_crossed `storm_sea`; seize_the_western_ports `harbour_lake`; march_on_parim `banner_plain`; accept_the_surrenders `banner_laid_down`; keys_of_parim `palace_parim`; claim_the_throne_of_men `throne_gold`; parim_as_pledge `seal_wax`; governors_of_parim `sceptre` |
| I | dead_and_the_south `dead_ranks_far`; sail_home `ship_voyage`; hold_what_we_took `fort_wall`; fleet_at_the_shore `anchor_rope`; a_crown_across_the_sea `crown_gold`; those_left_behind `exile_court`; the_western_regency `regency_seals` |
| L | our_own_shore `banner_plain`; first_crown_of_the_west `crown_iron`; accord_on_the_neck `mountain_pass`; lesser_crowns_bend `crown_broken`; western_trade_league `caravan`; the_western_peace `olive_branch` |
| K | letters_to_parim `scroll_treaty`; answer_the_lost_cause `banner_league`; relief_fleet `warship_sail`; land_as_friends `handshake_oath`; shields_on_the_shore `sword_shield`; west_remembers_dardan `book_lore`; wardens_beyond_the_sea `eye_watchful` |
| J | beside_former_foes `alliance_rings`; under_the_old_banner `banner_league`; against_the_deathless `dead_ranks_far`; hailed_by_the_living `crown_hailed`; the_long_way_home `compass_rose`; equals_across_the_sea `scroll_treaty` |

### Tree-declared scripted effects and triggers

`common/scripted_effects/zin_gunwaith.txt` and `common/scripted_triggers/zin_gunwaith.txt`:

| Name | Kind | Does / true when |
| --- | --- | --- |
| `zin_gunwaith_heal_the_ford` | effect | Removes `zin_opinion_grey_ford_truce` and `zin_west_ford_blood` both ways; adds opinion `zin_gunwaith_ford_brothers` (+25) both ways |
| `zin_gunwaith_claim_lesser_crowns` | effect | `add_state_claim` on every state of each West Lands country that borders Gunwaith and owns 4 states or fewer |
| `zin_gunwaith_wargoal_lesser_crown` | effect | `create_wargoal` `puppet_wargoal_focus` on the claimed neighbour with the most claimed states |
| `zin_gunwaith_recruit` (`character`) | effect | `recruit_character` for the named proposed character; no-op if already recruited |
| `zin_gunwaith_relief_possible` | trigger | `zin_eindil_named`, or `zin_afrit_revealed`, or `zin_gathering_dark` ≥ 40 |

### Characters (proposed)

| Id | Name | Role | Recruited by |
| --- | --- | --- | --- |
| `zin_gunwaith_ostra` | Admiral Ostra Velk | Navy leader, skill 3, trait `blue_water_expert` (the game's own trait, as in the characters spec) | *The Sea-Lords' Plan* |

The starting court (King Herlic, Lawspeaker Ilurda, Thane Datid Werlen, Captain Sarudo Bolpor) comes from the characters spec. Datid's advisor role is removed by the "Silence him." option of `zin_gunwaith.2`.

## AI

- Base weights are in the tables; "hist" factors apply under the historical rule.
- Peace-time branches first; war focuses (`launch_the_crossing`, `keys_of_parim`, `beside_former_foes`) have weights of 300 to 500 so the AI takes them as soon as available.
- After the launch: `add_ai_strategy` `invade` (Aenor, 200), `conquer` (Aenor, 150) and `area_priority` toward the Middle Lands (from the mechanic); after *Terms on the Shore*, `befriend` the Aenor realm and the Host of Eindil.
- On the dynamic rule (`free`), the three route weights follow resolve and regard as tabled in branch F.

## Acceptance

1. The compiler builds `gunwaith.json` with no errors: 116 focuses, unique keys and positions, every prerequisite above its focus, the exclusives (*The King's Peace* / *Heed the War-Thanes*, *The Ford Holds* / *Blood at the Grey Ford*, *Brothers of the Ford* / *Girdon Must Bend*, the three routes of branch F, *Claim the Throne of Men* / *Hold Parim as a Pledge*, *Sail Home* / *Hold What We Took*) symmetric, days multiples of 7 between 7 and 70, no `raw` block; compiler checks 1–7 pass.
2. Every focus icon is a catalog key and every event picture a picture key with the standard crop; every modifier in the spirits table exists in the game's `modifiers_documentation.md`; every `zin_west_*` call, check and event exists in the mechanic's files.
3. The HOI4 Agent Tools focus inspector reports no errors; `hoi4_focus_render` draws the tree within 30 columns (x 0 to 29) and 20 rows (y 0 to 19).
4. On 1 Thaw 4A 1748: no war focus is available; no visible focus name or description mentions the stranger, the Man from the Ice or the war-king (branch D's lower half and branch J are hidden); no text names Afrit.
5. Isolated Linux run, one in-game year under the historical rule: AI Gunwaith takes *The Clan Halls of Gunwaith*, *The Thanes Speak*, *Thane Datid's Grievance*, *Voices of the West*, *The Grey Ford* and *Garrisons on the Ford* by Longnight 4A 1748 (±120 days) and declares no war.
6. Long historical observer run: `heed_the_war_thanes` by the end of 4A 1749; `blood_at_the_ford` within 60 days of `zin_west_truce_broken`; `convene_the_ford_council` by 4A 1752; `cross_for_the_old_claims` by 4A 1754; `launch_the_crossing` within 60 days of `zin_war_of_last_crowns`; `keys_of_parim` in 4A 1756; `sail_home` and `fleet_at_the_shore` inside the evacuation window; `beside_former_foes` within 60 days of `zin_eindil_returned` when Gunwaith is stranded.
7. With `zin_rule_west_route = divided`, Gunwaith takes the Our Own Shore branch and never declares war on Aenor.

## Open questions

All are owner questions already listed in [OPEN_QUESTIONS.md](../../OPEN_QUESTIONS.md) (short list 9; western crossing 1, 2, 5, 8; characters 17); the work proceeds on each proposal:

1. Who led the Crossing? Proposal: the Ford Council's convener, which is Gunwaith on the historical path; the fleets land on Aenor Isle first, then on the Middle Lands' west shore.
2. Who broke the truce? Proposal: Gunwaith's war-thanes (*Heed the War-Thanes* is the historical court choice).
3. Who claimed the throne of men? Proposal: the text says only "the western claimant".
4. Are Admiral Ostra Velk and "Taryn's Banner" (Taryn of Gunwaith at Dardan, a First Age proposal) welcome? Proposal: yes, both labelled proposed.
