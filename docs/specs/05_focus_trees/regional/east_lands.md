# East Lands Regional Trees

**Status:** Ready. Reviewed 19 October 2026 against CONVENTIONS "Status"; integrated 19 October 2026. **Priority:** 6. **Phase:** 6 (tier B).

## Purpose

This spec defines the nine tier B focus trees of the East Lands: **Alerhia, Miaed, Erco, Plutondo, Drak, Ostoroth, Gondolin, Mora and Avalon**. They are the great kingdoms and the named crowns between the two eastern powers, Noris ([../major/noris.md](../major/noris.md)) and Stabilo ([../major/stabilo.md](../major/stabilo.md)). Each tree has a unique core and copies whole modules of the shared tree [../shared/shared_east_lands.md](../shared/shared_east_lands.md). All of them play the eastern kings mechanic ([../../04_mechanics/eastern_kings.md](../../04_mechanics/eastern_kings.md)): lean between Furvior and Postondoroth, roads and wells, the temples' generous friends, the eastern coalition and the King of the East.

## Lore basis

**Established** (vault): the East Lands lie across a long rift sea east of the Magical Lands and run off the eastern map; Noris, Stabilo, Avalon, Ostoroth, Gondolin, Drak and Mora are named there; the South Lands are the great desert of the East Lands; Noris leads the Noris Treaty with Gondolin and Stabilo the Stabilo Pact with Drak (working table); the Hidden Council builds ties in East Lands and South Lands courts as a reserve seat; an eastern coalition invades the Magical Lands and threatens the Middle Kingdom, its commanders seeking wealth, territory, revenge or deliverance from their rulers' crises, some secretly tied to the Deliverer's networks, and not all eastern states united; Afrit takes command of an eastern host and is proclaimed King of the East, though states of the East still resist him; some eastern formations fight Zol's dead and Volgan's troops, suffer terribly and retreat east; abandoned eastern troops join Eindil's coalition; eastern claims and grievances remain after the war.

**Map and roster facts:** Alerhia, Miaed, Erco and Plutondo are great kingdoms in their own right; Mora is a lake republic; Avalon is a revolutionary republic of the Red Lands; Gondolin is a northern maritime crown allied with Noris; Drak is a martial kingdom aligned with Stabilo; Ostoroth is a highland kingdom.

**Proposed in the vault:** the caravan roads (4A 600 to 780); the eastern branch's courtship from about 4A 1300.

**Proposed in other specs and used here:** the rulers' names (characters spec); the five roads, lean, footholds, the coalition and the Free Crowns (eastern kings spec); the start footholds (Afrit spec).

**Proposed here:** every focus, spirit, event and number; the situations below (histories, offices, customs); Avalon's revolution of 4A 1719; the flag `zin_east_rift_ambition`.

**Open and kept open:** which eastern kings join Afrit willingly; what becomes of the eastern invaders after Eindil's coronation; what lies beyond the eastern and southern map edges. Every tree offers both kneeling and refusing; no text says which a court did "in history".

## Design

### Rules for every tree in this spec

- **The peaceful start.** On 1 Thaw 4A 1748 every available focus is about the court, roads, wells, temples, envoys, mines, ships or drill. No focus available at start creates a war, a war goal or a claim. War content waits for story flags (`zin_war_of_last_crowns`, `zin_eastern_invasion`, `zin_east_turns_west`, `zin_afrit_king_of_east`, `zin_afrit_returned`, `zin_afrit_dead`, `zin_eindil_returned`, `zin_zol_rising`, `zin_volgan_marches`) or for the mechanic's junction `zin_east_question_open`.
- **The secret.** Before `zin_afrit_revealed`, no text names Afrit, the Hidden Council or the eastern branch. The Deliverer is `[zin_loc_deliverer]`; his people are "the temples" or "the Deliverer's generous friends".
- **Shorthands** are those of the shared tree: **Lean ±n**, **Footholds ±n**, **Debt ±n**, **Drift X +n**, **Inf +n road on Noris/Stabilo** (= `for_country Noris: call zin_east_add_road_influence(road = road, value = n)`), `@rift_east`, `@zol_coast` (site key `ocean_of_zol_coast`: a random owned state with `zin_is_site_ocean_of_zol_coast`, decision F5); days are 70 unless a focus is marked 35d.
- **Copied modules.** A tree that "copies E4" takes that module of `shared_east_lands` whole: the same keys (ids become `zin_regional_<name>_<key>`), the same effects, prerequisites inside the module unchanged, `allow_branch` dropped unless stated. The module's root sits where this spec says; every other focus keeps its offset from the root as in the shared tree. The root's outside prerequisite is replaced as stated. The module's spirits are re-declared in the tree's idea file under the tree's prefix (`zin_regional_<name>_<key>`) with the shared tree's modifiers. Events of a module are referenced by full id (`zin_east.35`, `zin_shared_east_lands.n`).
- **E9 in every tree.** Every tree except Alerhia's places E9 (The Question of the East, 11 focuses) with its root at (14,6). Alerhia also places it at (14,6). Rows 6 to 9 of columns 9 to 18 belong to E9 alone.
- **Spirit keys** never repeat a focus key of the same tree (focus and idea localisation keys would collide); where a spirit shares its focus's name the key ends in `_spirit`. A spirit takes the icon of the focus that adds it.
- **Rulers** keep the character id `<TAG>_zin_ruler`; names come from the characters spec ([../../02_lore/02_characters.md](../../02_lore/02_characters.md)); traits reuse existing ones. New proper names in text come from `zin_name_<key>` keys.
- **Events** use the namespace `zin_regional_<name>`; all are effect-triggered.

### Notation of the branch lists

Each focus is one line: `key` **Name** (x,y; ← prerequisites; ✕ exclusive with; days) `icon`: effects. AI: weight. `a / b` is "a or b"; `a + b` is "a and b". Prerequisites and exclusives name exact focus keys of the same tree, and every exclusive is written on both focuses. The icon is a catalog key ([../02_icon_catalog.md](../02_icon_catalog.md), sprite `GFX_focus_zin_<key>`); copied modules keep the shared tree's icons. A line that says "key focus" takes its effects and AI from the tree's key-focus table; days, icon and position stay on the line.

### Overview

| Country | Tree | States | Ruler (proposed) | Start lean / footholds | Focuses | Unique core | Copied |
| --- | --- | ---: | --- | --- | ---: | --- | --- |
| Alerhia | `regional_alerhia` | 26 | King Alerhan III | 0 / 3 | 49 | Rift Crown, Pilgrim Ports, Where Two Roads End, The Rift Question | E2, E4, E9 |
| Miaed | `regional_miaed` | 19 | Lord Furanow of the Passes | −10 / 3 | 41 | Lord of the Passes, Gate of the Sands, Watch on the Far Marches | E2, E4, E9 |
| Erco | `regional_erco` | 16 | Queen Obmia of Erco | −20 / 3 | 41 | Mountain Throne, Mines of Erco, Mountain Forts, The Sand Road's End | E4, E9 |
| Plutondo | `regional_plutondo` | 16 | Prince Blozan | −30 / 3 | 41 | The Prince's Court, The Many of Plutondo, Eastern Gate of the Gold Road, The Hill Coast | E4, E9 |
| Drak | `regional_drak` | 11 | King Morod of Drak | −70 / 2 | 40 | The Martial Crown, Sword of the Pact, The Old Seat, Debts and Due | E4, E9 |
| Ostoroth | `regional_ostoroth` | 9 | King Ocellio of Ostoroth | 15 / 2 | 40 | The Highland Crown, The Lake Road, Highland Companies, Herds and Lakes | E4, E9 |
| Gondolin | `regional_gondolin` | 6 | Queen Lorvena of Gondolin | 70 / 2 | 41 | The Sea Crown, Harbours of Gondolin, Watch on the Northern Sea, Northern Anchor of the Treaty | E4, E9 |
| Mora | `regional_mora` | 5 | Speaker Moira Eraver | 10 / 2 | 40 | The Lake Republic, Lake Towns, A Republic Among Kings, The Watchful Council | E5, E9 |
| Avalon | `regional_avalon` | 3 | Tribune Arcon Vel | −10 / 2 | 40 | The Tribunes' Republic, The Red Lands, Free Among Kings, Citizen Levies | E4, E9 |

Start debts to Stabilo (Stabilo tree): Drak 20, Plutondo 10, the others 0.

---

## Alerhia (`regional_alerhia`)

### Situation in 4A 1748

Alerhia is the largest crown of the East after Noris: twenty-six states of desert, mountain and rift coast at the western edge of the East Lands, facing the southern Magical Lands and the Zilin Hills across the rift sea, and bordering the Lands of Light to the south-west (map). Its kings call themselves the **Rift Crown** (proposed title). Both great roads of the south end in Alerhia: the Gold Road at its capital, the Rift Road at its harbours (mechanic). Its quays carry pilgrims across the rift to the Deliverer's hermitage in the Zilin Hills, and the temples on its waterfront are among the richest in the East (proposed). King Alerhan III is courted by Furvior's riders and Postondoroth's bankers at once and has promised neither. The court is at peace, rich, and proud; its southern desert half is governed by lords who rarely see the capital.

### Role

- **Historical path.** Alerhia lets the two roads bid for it and stays free of both blocs. Its footholds are deep (3 at start; the ferries and the temples can raise them). When the War of the Last Crowns begins, Alerhia is the heaviest court in the mechanic's coalition weight (about 65 at start) and most often leads the eastern coalition across the rift in 4A 1755, then turns west against Aenor by 1 Deepwinter 4A 1756. Whether it kneels to the King of the East or refuses him is decided in each game; the tree offers both.
- **Alternatives.** Alerhia can refuse the coalition and guard the elven shore instead (Warden of the Rift), join Noris or Stabilo, or become First of the Free Crowns.

### Ruler

King Alerhan III (`<Alerhia>_zin_ruler`, characters spec), Wild stance `zin_wild_freeholds`, trait `zin_trait_caravan_master`. Proposed portrait: a desert king in ochre and turquoise, a narrow crown of rift pearls.

### Tree

| Branch | Columns | Rows | Focuses | Opens |
| --- | --- | --- | ---: | --- |
| A. The Rift Crown | 0–3 | 0–3 | 6 | start |
| B. The Pilgrim Ports | 5–7 | 1–4 | 6 | start |
| C. Where Two Roads End | 9–13 | 1–4 | 6 | start |
| D. Wells of the South Lands (copy of E2) | 14–16 | 2–4 | 5 | start (Alerhia is a South Lands court) |
| E. The Generous Friends (copy of E4) | 17–19 | 1–4 | 6 | start |
| F. The Rift Question | 20–27 | 1–4 | 9 | `zin_east_rift_talk` or `zin_east_question_open` |
| G. The Question of the East (copy of E9) | 9–18 | 6–9 | 11 | `zin_east_question_open` |

**A. The Rift Crown.** The court, the desert lords and the mountain marches.

- `the_rift_crown` **The Rift Crown** (2,0) `crown_iron`: political_power 50; stability 0.03; event regional_alerhia.1. AI 100.
- `court_of_alerhan` **The Court of King Alerhan** (1,1; ← the_rift_crown) `throne_gold`: add_spirit court_of_alerhan_spirit. AI 40.
- `lords_of_the_desert_half` **Lords of the Desert Half** (3,1; ← the_rift_crown) `camel_rider`: manpower 2000; stability 0.02. AI 30.
- `the_kings_road_tax` **The King's Road Tax** (0,2; ← court_of_alerhan) `toll_house`: political_power 75; building industrial_complex 1 @capital. AI 25.
- `the_mountain_marches` **The Mountain Marches** (2,2; ← court_of_alerhan / lords_of_the_desert_half) `pass_fort`: building bunker 1 @capital; building bunker 1 @random_owned. AI 15.
- `the_greatest_court_of_the_east` **The Greatest Court of the East** (1,3; ← the_kings_road_tax / the_mountain_marches) `crown_gold`: swap_spirit court_of_alerhan_spirit → greatest_court; political_power 50. AI 25.

**B. The Pilgrim Ports.** The rift harbours, the pilgrim ferries to the Zilin Hills, the rift fleet and trade with the elven shore.

- `the_pilgrim_ports` **The Pilgrim Ports** (6,1; ← the_rift_crown) `harbour_lake`: building naval_base 1 @rift_east; political_power 25. AI 30.
- `ferries_to_zilin` **Ferries to Zilin** (5,2; ← the_pilgrim_ports) `courier_pilgrim`: key focus. AI see table.
- `the_rift_fleet` **The Rift Fleet** (7,2; ← the_pilgrim_ports) `galley_oars`: building dockyard 1 @rift_east; research [zin_cat_galleys] 50% ×1. AI 20.
- `traders_of_the_elder_groves` **Traders of the Elder Groves** (5,3; ← ferries_to_zilin / the_rift_fleet) `traders_road`: call zin_shared_east_lands_rift_goodwill; research [industry] 50% ×1. AI 15; ×0 while `zin_east_coalition_member`.
- `harbour_forts_of_the_rift` **Harbour Forts of the Rift** (7,3; ← the_rift_fleet) `fort_wall`: building coastal_bunker 1 @rift_east; building coastal_bunker 1 @rift_east. AI 10; ×3 after `zin_eastern_invasion`.
- `master_of_the_rift_sea` **Master of the Rift Sea** (6,4; ← traders_of_the_elder_groves / harbour_forts_of_the_rift) `warship_sail`: add_spirit rift_sea_masters. AI 15.

**C. Where Two Roads End.** Alerhia chooses between the riders, the bankers, or an auction of its favour.

- `where_two_roads_end` **Where Two Roads End** (11,1; ← the_rift_crown; 35d) `traders_road`: political_power 25; tooltip "Both great roads of the south end at our gates." AI 40.
- `the_riders_offer` **The Riders' Offer** (9,2; ← where_two_roads_end; ✕ let_the_roads_bid, the_bankers_offer) `camel_rider`: Lean +20; Inf +5 rift on Noris. AI 10 + lean ÷ 2.
- `let_the_roads_bid` **Let the Roads Bid** (11,2; ← where_two_roads_end; ✕ the_riders_offer, the_bankers_offer) `coin_chest`: key focus.
- `the_bankers_offer` **The Bankers' Offer** (13,2; ← where_two_roads_end; ✕ the_riders_offer, let_the_roads_bid) `ledger_coins`: Lean −20; Inf +5 gold on Stabilo; if Stabilo has `zin_stabilo_ledger_open`: Debt +20 and political_power 100. AI 10 − lean ÷ 2.
- `the_gold_road_gate` **The Gold Road Gate** (11,3; ← the_riders_offer / let_the_roads_bid / the_bankers_offer) `caravan`: call zin_shared_east_lands_road_infra; political_power 50. AI 25.
- `customs_of_alerhia` **The Customs of Alerhia** (11,4; ← the_gold_road_gate) `toll_house`: add_spirit customs_of_alerhia_spirit. AI 25.

**D. Wells of the South Lands.** Copy of E2, root `the_dry_roads` at (15,2), prerequisite `lords_of_the_desert_half`.

**E. The Generous Friends.** Copy of E4, root `temples_of_the_deliverer` at (18,1), prerequisite `the_rift_crown`.

**F. The Rift Question.** What Alerhia does when the envoys speak of the rich, weak lands across the water: lead the crossing, guard the elven shore, or wait. **Mutual exclusions:** the three route focuses.

- `the_question_of_the_rift` **The Question of the Rift** (24,1; ← the_rift_crown; 35d) `map_unrolled`: Avail: flag zin_east_rift_talk, or check zin_east_question_open. political_power 50. AI 200 when available.
- `lord_of_the_crossing` **Lord of the Crossing** (21,2; ← the_question_of_the_rift; ✕ warden_of_the_rift, the_rift_crown_waits) `war_council_map`: key focus.
- `warden_of_the_rift` **Warden of the Rift** (24,2; ← the_question_of_the_rift; ✕ lord_of_the_crossing, the_rift_crown_waits) `tree_silver`: key focus.
- `the_rift_crown_waits` **The Rift Crown Waits** (27,2; ← the_question_of_the_rift; ✕ lord_of_the_crossing, warden_of_the_rift) `scroll_sealed`: stability 0.05; political_power 50. AI 30.
- `muster_for_the_crossing` **Muster for the Crossing** (20,3; ← lord_of_the_crossing) `levy_muster`: Avail: `zin_war_of_last_crowns`. army_experience 15; manpower 5000. AI 100 when available.
- `the_crossing_of_the_rift` **The Crossing of the Rift** (22,3; ← lord_of_the_crossing) `ship_voyage`: key focus.
- `lord_of_the_rift_shores` **Lord of the Rift Shores** (21,4; ← muster_for_the_crossing / the_crossing_of_the_rift) `banner_plain`: Avail: check zin_regional_alerhia_holds_far_shore. add_spirit lord_of_far_shore; political_power 100. AI 100 when available.
- `aid_the_elder_groves` **Aid the Elder Groves** (24,3; ← warden_of_the_rift) `forest_ancient`: key focus.
- `keep_the_ports_open` **Keep the Ports Open** (27,3; ← the_rift_crown_waits) `anchor_rope`: add_spirit open_ports. AI 40.

**G. The Question of the East.** Copy of E9, root `question_of_the_east` at (14,6), prerequisites `the_greatest_court_of_the_east` / `customs_of_alerhia` / `temples_of_the_deliverer`.

### Key focuses

| Key | Name | Prerequisites | Effects summary |
| --- | --- | --- | --- |
| `the_rift_crown` | The Rift Crown | – | political_power 50; stability 0.03; event .1 (the court weighs its suitors). AI 100 |
| `ferries_to_zilin` | Ferries to Zilin | the_pilgrim_ports | add_spirit pilgrim_tolls; Footholds +1; tooltip "Pilgrims cross from our quays to the Deliverer's hermitage." AI 25; hist ×1.5; ×0.3 under the refuse rule |
| `let_the_roads_bid` | Let the Roads Bid | where_two_roads_end | event regional_alerhia.2 (each power names a price; Alerhia keeps its freedom). AI 30; hist ×2 |
| `lord_of_the_crossing` | Lord of the Crossing | the_question_of_the_rift | flag zin_east_rift_ambition (coalition weight +15, proposed dependency); add_spirit rift_ambition. AI 30 + 5 × footholds; hist 60; unchanged by the refuse rule (the coalition forms under every rule) |
| `warden_of_the_rift` | Warden of the Rift | the_question_of_the_rift | flag zin_east_route_resist; Footholds −1; call zin_shared_east_lands_rift_goodwill. AI 10; ×3 if ruling ideology Light; hist ×0.5 |
| `the_crossing_of_the_rift` | The Crossing of the Rift | lord_of_the_crossing | Avail: flag zin_east_coalition_member. call zin_east_claim_rift; war_support 0.05. AI 200 when available |
| `aid_the_elder_groves` | Aid the Elder Groves | warden_of_the_rift | Avail: `zin_eastern_invasion`; not `zin_east_coalition_member`. call zin_regional_alerhia_guard_rift; political_power −25. AI 60 when available |
| `question_of_the_east` (E9) | The Question of the East | the_greatest_court_of_the_east / customs_of_alerhia / temples_of_the_deliverer | As E9; Alerhia's footholds make `faith_in_the_deliverers_friends` its likeliest pledge in free play |

### Spirits

| Key | Name | Modifiers | Source |
| --- | --- | --- | --- |
| `court_of_alerhan_spirit` | The Court of King Alerhan | political_power_gain 0.10, stability_factor 0.02 | court_of_alerhan; replaced by greatest_court |
| `greatest_court` | The Greatest Court of the East | political_power_gain 0.15, stability_factor 0.05, opinion_gain_monthly_factor 0.10 | the_greatest_court_of_the_east |
| `pilgrim_tolls` | The Pilgrim Tolls | political_power_gain 0.05, trade_opinion_factor 0.05 | ferries_to_zilin; removed by E4's close_the_houses |
| `rift_sea_masters` | Masters of the Rift Sea | naval_damage_factor 0.05, navy_org_factor 0.05, naval_detection 0.10 | master_of_the_rift_sea |
| `customs_of_alerhia_spirit` | The Customs of Alerhia | trade_opinion_factor 0.10, consumer_goods_factor −0.02, political_power_gain 0.05 | customs_of_alerhia |
| `rift_ambition` | The Rift Calls | war_support_factor 0.05, army_attack_factor 0.03 | lord_of_the_crossing; removed at peace with every Magical Lands realm after `zin_eastern_invasion` |
| `lord_of_far_shore` | Lord of the Far Shore | stability_factor 0.05, political_power_gain 0.10 | lord_of_the_rift_shores; removed if Alerhia controls fewer than 3 `zin_is_site_rift_west` states |
| `open_ports` | The Open Ports | trade_opinion_factor 0.10, stability_factor 0.02 | keep_the_ports_open |
| copies | E2, E4 and E9 spirits | as the shared tree | copied modules |

### Events (namespace `zin_regional_alerhia`)

| Id | Title | For | Fired by | Picture | Options (AI) |
| --- | --- | --- | --- | --- | --- |
| .1 | The Rift Crown | Alerhia | the_rift_crown | `generic_court` | Riders and bankers wait in the same antechamber. "Furvior's riders first" (Lean +5) / "Postondoroth's bankers first" (Lean −5) / "Let them both wait" (political_power 25). AI 30/30/40 |
| .2 | The Roads Bid for Alerhia | Alerhia | let_the_roads_bid | `generic_court` | "Take Furvior's gold" (political_power 100; Lean +10; Inf +5 rift on Noris) / "Take Postondoroth's gold" (political_power 100; Lean −10; Inf +5 gold on Stabilo) / "Take both and promise nothing" (political_power 150; Noris and Stabilo each lose 5 opinion of Alerhia). AI 25/25/50 |

### Tree-declared scripts

| Name | Kind | Does |
| --- | --- | --- |
| `zin_regional_alerhia_holds_far_shore` | trigger | Alerhia and its subjects control 3 or more `zin_is_site_rift_west` states |
| `zin_regional_alerhia_guard_rift` | effect | `give_guarantee` to the Magical Lands realm with the most `zin_is_site_rift_west` states that is at war with a coalition member |

---

## Miaed (`regional_miaed`)

### Situation in 4A 1748

Miaed holds the desert passes of the south-west: nineteen states where the Sand Road's branch climbs from the dunes to the high gates, bordering the Lands of Light and lying near the eastern edge of the Dead Lands (mechanic). Its rulers are the **Lords of the Passes** (proposed title); their wealth is tolls and their army is the pass-wardens who keep the gates. Lord Furanow lets every caravan through at a price and owes neither Furvior nor Postondoroth. Old songs of the passes speak of armies that once marched out of the south; nobody in Miaed has seen one (proposed flavour; the vault establishes only that Volgan's First Age army held allied men of the eastern and southern lands).

### Role

- **Historical path.** Miaed sells passage to both powers and stays free. Its footholds start at 3. In the war it is a South Lands gate, not a road-builder; its coalition weight is middling. Whether it kneels is open.
- **Alternatives.** It can bind its passes to Furvior or Postondoroth; it can watch the south-west and heed Gala's warning of the south; it can become a refuser that closes its gates to the eastern host.

### Ruler

Lord Furanow of the Passes (`<Miaed>_zin_ruler`), Wild stance `zin_wild_freeholds`, trait `zin_trait_warden_of_the_passes`.

### Tree

| Branch | Columns | Rows | Focuses | Opens |
| --- | --- | --- | ---: | --- |
| A. Lord of the Passes | 0–3 | 0–3 | 6 | start |
| B. The Gate of the Sands | 4–8 | 1–4 | 7 | start |
| C. Watch on the Far Marches | 19–23 | 1–4 | 6 | start; two focuses need story flags |
| D. Wells of the South Lands (copy of E2) | 9–11 | 1–3 | 5 | start |
| E. The Generous Friends (copy of E4) | 13–15 | 1–4 | 6 | start |
| F. The Question of the East (copy of E9) | 9–18 | 6–9 | 11 | `zin_east_question_open` |

**A. Lord of the Passes.**

- `lord_of_the_passes` **Lord of the Passes** (2,0) `mountain_pass`: political_power 50; event regional_miaed.1. AI 100.
- `the_pass_lords` **The Pass Lords** (1,1; ← lord_of_the_passes) `council_table`: add_spirit pass_lords. AI 40.
- `the_desert_court` **The Desert Court** (3,1; ← lord_of_the_passes) `ember_desert`: stability 0.03; political_power 25. AI 30.
- `wardens_of_the_high_road` **Wardens of the High Road** (0,2; ← the_pass_lords) `scout_lantern`: army_experience 10; building bunker 1 @capital. AI 25.
- `the_lords_justice` **The Lord's Justice** (2,2; ← the_pass_lords / the_desert_court) `seal_royal`: political_power 50; stability 0.03. AI 25.
- `gatekeeper_of_the_south` **Gatekeeper of the South** (1,3; ← wardens_of_the_high_road / the_lords_justice) `pass_fort`: swap_spirit pass_lords → gatekeepers. AI 25.

**B. The Gate of the Sands.** Who may use the passes. **Mutual exclusions:** `passage_for_furvior` / `tolls_for_all` / `passage_for_postondoroth`.

- `the_gate_of_the_sands` **The Gate of the Sands** (6,1; ← lord_of_the_passes; 35d) `toll_house`: political_power 25. AI 40.
- `passage_for_furvior` **Passage for Furvior** (4,2; ← the_gate_of_the_sands; ✕ tolls_for_all, passage_for_postondoroth) `camel_rider`: Lean +15; Inf +5 sand on Noris. AI 10 + lean ÷ 2.
- `tolls_for_all` **Tolls for All** (6,2; ← the_gate_of_the_sands; ✕ passage_for_furvior, passage_for_postondoroth) `coin_chest`: key focus.
- `passage_for_postondoroth` **Passage for Postondoroth** (8,2; ← the_gate_of_the_sands; ✕ passage_for_furvior, tolls_for_all) `ledger_coins`: Lean −15; Inf +5 sand on Stabilo. AI 10 − lean ÷ 2.
- `pass_forts` **Forts in the Passes** (5,3; ← passage_for_furvior / tolls_for_all / passage_for_postondoroth) `pass_fort`: building bunker 2 @capital; building bunker 1 @random_owned. AI 20; ×3 after `zin_war_of_last_crowns`.
- `caravan_guards_of_the_passes` **Caravan Guards of the Passes** (7,3; ← passage_for_furvior / tolls_for_all / passage_for_postondoroth) `caravan`: add_spirit caravan_guards. AI 20.
- `the_sand_road_branch` **The Sand Road Branch** (6,4; ← pass_forts / caravan_guards_of_the_passes) `traders_road`: call zin_shared_east_lands_road_infra; political_power 50. AI 20.

**C. Watch on the Far Marches.** Miaed watches its south-west: the Lands of Light, and beyond the desert the Dead Lands.

- `watch_on_the_far_marches` **Watch on the Far Marches** (21,1; ← lord_of_the_passes; 35d) `eye_watchful`: political_power 25. AI 25.
- `scouts_of_the_waste` **Scouts of the Waste** (20,2; ← watch_on_the_far_marches) `footprints_snow`: event regional_miaed.2. AI 20.
- `envoys_to_the_lands_of_light` **Envoys to the Lands of Light** (22,2; ← watch_on_the_far_marches) `envoy`: Avail: exists The Lands of Light. call zin_elves_goodwill(target = The Lands of Light); stability 0.02. AI 20.
- `heed_the_south` **Heed the South** (20,3; ← scouts_of_the_waste) `beacon`: key focus.
- `the_long_watch_of_miaed` **The Long Watch of Miaed** (22,3; ← scouts_of_the_waste / envoys_to_the_lands_of_light) `fort_wall`: add_spirit long_watch. AI 15.
- `hold_the_southern_passes` **Hold the Southern Passes** (21,4; ← heed_the_south / the_long_watch_of_miaed) `mountain_pass`: Avail: `zin_volgan_marches` or `zin_war_of_last_crowns`. building bunker 2 @capital; war_support 0.05. AI 100 when available.

**D. Wells of the South Lands.** Copy of E2, root `the_dry_roads` at (10,1), prerequisite `lord_of_the_passes`.

**E. The Generous Friends.** Copy of E4, root `temples_of_the_deliverer` at (14,1), prerequisite `lord_of_the_passes`.

**F. The Question of the East.** Copy of E9, root `question_of_the_east` at (14,6), prerequisites `gatekeeper_of_the_south` / `the_sand_road_branch` / `temples_of_the_deliverer`.

### Key focuses

| Key | Name | Prerequisites | Effects summary |
| --- | --- | --- | --- |
| `lord_of_the_passes` | Lord of the Passes | – | political_power 50; event .1. AI 100 |
| `tolls_for_all` | Tolls for All | the_gate_of_the_sands | call zin_shared_east_lands_halve_lean; add_spirit pass_tolls; political_power 50. AI 30; hist ×2 |
| `pass_forts` | Forts in the Passes | any B route | bunkers as listed; the passes become a gate the eastern host must force if Miaed refuses |
| `heed_the_south` | Heed the South | scouts_of_the_waste | Avail: flag zin_sun_heeded_south, or `zin_volgan_marches`. add_spirit forewarned_passes. AI 100 when available |
| `hold_the_southern_passes` | Hold the Southern Passes | heed_the_south / the_long_watch_of_miaed | Avail: `zin_volgan_marches` or `zin_war_of_last_crowns`. bunkers; war_support 0.05 |
| `question_of_the_east` (E9) | The Question of the East | gatekeeper_of_the_south / the_sand_road_branch / temples_of_the_deliverer | As E9 |

### Spirits

| Key | Name | Modifiers | Source |
| --- | --- | --- | --- |
| `pass_lords` | The Pass Lords | political_power_gain 0.05, army_core_defence_factor 0.05 | the_pass_lords; replaced by gatekeepers |
| `gatekeepers` | Gatekeepers of the South | political_power_gain 0.10, army_core_defence_factor 0.10, dig_in_speed_factor 0.10 | gatekeeper_of_the_south |
| `pass_tolls` | Tolls of the Passes | trade_opinion_factor 0.10, political_power_gain 0.05 | tolls_for_all |
| `caravan_guards` | Caravan Guards | army_org_factor 0.03, heat_attrition_factor −0.15 | caravan_guards_of_the_passes |
| `long_watch` | The Long Watch | army_intel_factor 0.10, enemy_operative_detection_chance_factor 0.10 | the_long_watch_of_miaed |
| `forewarned_passes` | The Passes Forewarned | army_core_defence_factor 0.10, max_dig_in 2 | heed_the_south |
| copies | E2, E4, E9 spirits | as the shared tree | copied modules |

### Events (namespace `zin_regional_miaed`)

| Id | Title | For | Fired by | Picture | Options (AI) |
| --- | --- | --- | --- | --- | --- |
| .1 | Lord of the Passes | Miaed | lord_of_the_passes | `generic_peace` | Caravans queue at the high gate. "Raise the toll" (political_power 50; Lean moves 5 toward 0) / "Wave the riders through" (Lean +5) / "Wave the bankers through" (Lean −5). AI 50/25/25 |
| .2 | Scouts of the Waste | Miaed | scouts_of_the_waste | `generic_wilds` | Scouts come back from the far desert with tales of heat-haze, dust columns and empty forts. Before `zin_volgan_marches` the text says nobody knows what raised the dust. "Write to Furvior and Postondoroth" (Noris and Stabilo opinion of Miaed +5) / "Keep the report in the gatehouse" (political_power 25). AI 50/50 |

---

## Erco (`regional_erco`)

### Situation in 4A 1748

Erco is the mountain kingdom of the south: sixteen states of peaks, mines and mountain forts at the eastern end of the Sand Road (mechanic). Its iron and silver go down the Sand Road to Postondoroth's foundries and the Pact's armouries, and the court leans toward Stabilo out of habit, not love. Queen Obmia rules from the high halls with a council of mine-lords (proposed). Erco is far from the rift and has little interest in the elven lands; its quarrels are with the price of ore.

### Role

- **Historical path.** Erco sells ore to the Pact and stays outside it; it is one of the great kingdoms Noris and Stabilo write to. Its coalition weight is low (far from the rift). Whether it kneels is open.
- **Alternatives.** It can sell to any buyer and keep its mountains closed ("the mountains keep their own"), arm itself as a fortress realm, or tie the Sand Road's end to Postondoroth.

### Ruler

Queen Obmia of Erco (`<Erco>_zin_ruler`), Wild stance `zin_wild_freeholds`, trait `zin_trait_lawspeaker`.

### Tree

| Branch | Columns | Rows | Focuses | Opens |
| --- | --- | --- | ---: | --- |
| A. The Mountain Throne | 0–3 | 0–3 | 6 | start |
| B. The Mines of Erco | 4–8 | 1–4 | 7 | start |
| C. Mountain Forts | 19–23 | 1–4 | 6 | start |
| D. The Sand Road's End | 9–12 | 1–4 | 5 | start |
| E. The Generous Friends (copy of E4) | 13–15 | 1–4 | 6 | start |
| F. The Question of the East (copy of E9) | 9–18 | 6–9 | 11 | `zin_east_question_open` |

**A. The Mountain Throne.**

- `the_mountain_throne` **The Mountain Throne** (2,0) `crown_iron`: political_power 50; stability 0.02. AI 100.
- `queen_obmias_council` **Queen Obmia's Council** (1,1; ← the_mountain_throne) `council_table`: add_spirit mine_lords_council. AI 40.
- `the_mountain_clans` **The Mountain Clans** (3,1; ← the_mountain_throne) `banner_plain`: manpower 1500; stability 0.02. AI 30.
- `a_queens_consort` **A Queen's Consort** (0,2; ← queen_obmias_council; 35d) `seal_wax`: event regional_erco.1. AI 20.
- `the_high_halls` **The High Halls** (2,2; ← queen_obmias_council / the_mountain_clans) `throne_gold`: political_power 75. AI 25.
- `crown_of_the_peaks` **Crown of the Peaks** (1,3; ← a_queens_consort / the_high_halls) `snow_peak`: swap_spirit mine_lords_council → crown_of_the_peaks_spirit. AI 25.

**B. The Mines of Erco.** **Mutual exclusions:** `ore_for_the_pact` / `ore_for_any_buyer`.

- `the_mines_of_erco` **The Mines of Erco** (6,1; ← the_mountain_throne) `mine_cart`: building arms_factory 1 @capital; political_power 25. AI 40.
- `deep_shafts` **Deep Shafts** (5,2; ← the_mines_of_erco) `mine_cart`: research [industry] 50% ×1; political_power 25. AI 25.
- `foundries_of_erco` **Foundries of Erco** (7,2; ← the_mines_of_erco) `foundry_fire`: building arms_factory 1 @random_owned. AI 25.
- `ore_for_the_pact` **Ore for the Pact** (4,3; ← deep_shafts / foundries_of_erco; ✕ ore_for_any_buyer) `handshake_oath`: key focus.
- `ore_for_any_buyer` **Ore for Any Buyer** (6,3; ← deep_shafts / foundries_of_erco; ✕ ore_for_the_pact) `coin_chest`: key focus.
- `smiths_of_the_heights` **Smiths of the Heights** (8,3; ← foundries_of_erco) `forge_anvil`: research [zin_cat_armour] 50% ×1; research [zin_cat_arms] 50% ×1. AI 20.
- `masters_of_iron` **Masters of Iron** (6,4; ← ore_for_the_pact / ore_for_any_buyer / smiths_of_the_heights) `forge_anvil`: add_spirit masters_of_iron_spirit. AI 20.

**C. Mountain Forts.**

- `mountain_forts` **Mountain Forts** (21,1; ← the_mountain_throne) `pass_fort`: building bunker 1 @capital; building bunker 1 @random_owned. AI 25.
- `hill_companies` **Hill Companies** (20,2; ← mountain_forts) `spear_levy`: army_experience 10; research [zin_cat_arms] 50% ×1. AI 20.
- `the_high_passes_guarded` **The High Passes Guarded** (22,2; ← mountain_forts) `mountain_pass`: building bunker 2 @random_owned. AI 15; ×3 after `zin_war_of_last_crowns`.
- `siege_engineers_of_erco` **Siege Engineers of Erco** (20,3; ← hill_companies) `siege_trebuchet`: research [zin_cat_siege] 50% ×1. AI 15.
- `walls_of_erco` **Walls of Erco** (22,3; ← the_high_passes_guarded) `fort_wall`: research [zin_cat_walls] 50% ×1. AI 15.
- `the_mountains_keep_their_own` **The Mountains Keep Their Own** (21,4; ← siege_engineers_of_erco / walls_of_erco) `banner_plain`: key focus.

**D. The Sand Road's End.**

- `end_of_the_sand_road` **The End of the Sand Road** (10,1; ← the_mountain_throne) `traders_road`: call zin_shared_east_lands_road_infra; political_power 25. AI 30.
- `caravans_from_obmi` **Caravans From Obmi** (9,2; ← end_of_the_sand_road) `caravan`: Lean −5; add_spirit sand_road_markets. AI 20.
- `the_mountain_road` **The Mountain Road** (11,2; ← end_of_the_sand_road) `roads_paved`: building infrastructure 1 @capital; political_power 25. AI 20.
- `markets_of_the_heights` **Markets of the Heights** (10,3; ← caravans_from_obmi / the_mountain_road) `market_stalls`: building industrial_complex 1 @capital. AI 20.
- `the_last_well` **The Last Well** (10,4; ← markets_of_the_heights) `granary`: political_power 50; stability 0.03. AI 15.

**E. The Generous Friends.** Copy of E4, root `temples_of_the_deliverer` at (14,1), prerequisite `the_mountain_throne`.

**F. The Question of the East.** Copy of E9, root `question_of_the_east` at (14,6), prerequisites `crown_of_the_peaks` / `masters_of_iron` / `temples_of_the_deliverer`.

### Key focuses

| Key | Name | Prerequisites | Effects summary |
| --- | --- | --- | --- |
| `the_mountain_throne` | The Mountain Throne | – | political_power 50; stability 0.02. AI 100 |
| `ore_for_the_pact` | Ore for the Pact | deep_shafts / foundries_of_erco | Lean −10; for_country Stabilo: political_power 25; political_power 50. AI 20 − lean ÷ 2; hist ×1.5 |
| `ore_for_any_buyer` | Ore for Any Buyer | deep_shafts / foundries_of_erco | add_spirit open_ore_market; political_power 75. AI 20 |
| `the_mountains_keep_their_own` | The Mountains Keep Their Own | siege_engineers_of_erco / walls_of_erco | add_spirit mountain_realm. AI 20; ×2 refuser |
| `question_of_the_east` (E9) | The Question of the East | crown_of_the_peaks / masters_of_iron / temples_of_the_deliverer | As E9 |

### Spirits

| Key | Name | Modifiers | Source |
| --- | --- | --- | --- |
| `mine_lords_council` | The Council of Mine-Lords | political_power_gain 0.05, production_speed_buildings_factor 0.05 | queen_obmias_council; replaced by crown_of_the_peaks |
| `crown_of_the_peaks_spirit` | Crown of the Peaks | political_power_gain 0.10, production_speed_buildings_factor 0.05, stability_factor 0.03 | crown_of_the_peaks |
| `open_ore_market` | The Open Ore Market | trade_opinion_factor 0.15, consumer_goods_factor −0.02 | ore_for_any_buyer |
| `masters_of_iron_spirit` | Masters of Iron | production_factory_efficiency_gain_factor 0.05, production_factory_max_efficiency_factor 0.05 | masters_of_iron |
| `mountain_realm` | The Mountains Keep Their Own | army_core_defence_factor 0.10, drift_defence_factor 0.15 | the_mountains_keep_their_own |
| `sand_road_markets` | Markets of the Sand Road | trade_opinion_factor 0.05, consumer_goods_factor −0.02 | caravans_from_obmi |
| copies | E4, E9 spirits | as the shared tree | copied modules |

### Events (namespace `zin_regional_erco`)

| Id | Title | For | Fired by | Picture | Options (AI) |
| --- | --- | --- | --- | --- | --- |
| .1 | A Queen's Consort | Erco | a_queens_consort | `generic_court` | "A prince of Plutondo" (Lean −5; Plutondo opinion of Erco +15) / "A lord of Ostoroth" (Lean +5; Ostoroth opinion +15) / "A mine-lord of our own mountains" (stability 0.03). AI 35/25/40 |

---

## Plutondo (`regional_plutondo`)

### Situation in 4A 1748

Plutondo is the most populous of the southern crowns: sixteen states of desert, hills and a short coast between Drak and Erco, at the eastern end of the Gold Road (mechanic). Prince Blozan rules a court of hill lords and a great, poor population that fills Postondoroth's caravans with porters and guards. The prince already owes Postondoroth's houses (Stabilo tree: debt 10) and is courted by the Pact as its natural next member. Furvior's letters arrive too, and the prince answers both with equal warmth (proposed).

### Role

- **Historical path.** Plutondo is the Pact's likeliest new member in 4A 1751 to 1754 (Stabilo tree). It lends its many levies to whatever war its friends fight. Whether it kneels is open.
- **Alternatives.** It can stay no man's debtor, pay down the Ledger, or become the Pact's right hand.

### Ruler

Prince Blozan (`<Plutondo>_zin_ruler`), Wild stance `zin_wild_freeholds`, trait `zin_trait_caravan_broker`.

### Tree

| Branch | Columns | Rows | Focuses | Opens |
| --- | --- | --- | ---: | --- |
| A. The Prince's Court | 0–3 | 0–3 | 6 | start |
| B. The Many of Plutondo | 4–8 | 1–4 | 6 | start; one focus needs war |
| C. Eastern Gate of the Gold Road | 9–13 | 1–4 | 7 | start |
| D. The Hill Coast | 19–21 | 1–4 | 5 | coastal state (`allow_branch`) |
| E. The Generous Friends (copy of E4) | 14–16 | 1–4 | 6 | start |
| F. The Question of the East (copy of E9) | 9–18 | 6–9 | 11 | `zin_east_question_open` |

**A. The Prince's Court.**

- `the_princes_court` **The Prince's Court** (2,0) `throne_gold`: political_power 50; stability 0.02. AI 100.
- `blozans_household` **Blozan's Household** (1,1; ← the_princes_court) `seal_royal`: add_spirit blozans_household_spirit. AI 40.
- `lords_of_the_desert_hills` **Lords of the Desert Hills** (3,1; ← the_princes_court) `camel_rider`: manpower 2000; stability 0.02. AI 30.
- `the_princes_treasury` **The Prince's Treasury** (0,2; ← blozans_household) `ledger_coins`: political_power 75. AI 25.
- `between_drak_and_erco` **Between Drak and Erco** (2,2; ← blozans_household / lords_of_the_desert_hills; 35d) `two_crowns`: event regional_plutondo.1. AI 25.
- `the_prince_of_plutondo` **The Prince of Plutondo** (1,3; ← the_princes_treasury / between_drak_and_erco) `crown_iron`: swap_spirit blozans_household_spirit → prince_of_plutondo. AI 25.

**B. The Many of Plutondo.**

- `the_many_of_plutondo` **The Many of Plutondo** (6,1; ← the_princes_court) `spear_levy`: manpower 5000. AI 40.
- `granaries_of_the_hills` **Granaries of the Hills** (5,2; ← the_many_of_plutondo) `granary`: add_spirit hill_granaries. AI 25.
- `levy_rolls` **The Levy Rolls** (7,2; ← the_many_of_plutondo) `birth_rolls`: add_spirit levy_rolls_spirit. AI 25.
- `workshops_of_the_many` **Workshops of the Many** (5,3; ← granaries_of_the_hills) `workshop_tools`: building industrial_complex 1 @capital; building industrial_complex 1 @random_owned. AI 25.
- `fields_of_plutondo` **Fields of Plutondo** (7,3; ← granaries_of_the_hills / levy_rolls) `farm_sowing`: building infrastructure 1 @capital; stability 0.03. AI 20.
- `the_great_levy` **The Great Levy** (6,4; ← workshops_of_the_many / fields_of_plutondo) `levy_muster`: key focus.

**C. Eastern Gate of the Gold Road.** **Mutual exclusions:** `the_pacts_right_hand` / `no_mans_debtor`.

- `eastern_gate_of_the_gold_road` **Eastern Gate of the Gold Road** (11,1; ← the_princes_court) `traders_road`: call zin_shared_east_lands_road_infra; political_power 25. AI 35.
- `a_seat_in_the_pact` **A Seat in the Pact** (10,2; ← eastern_gate_of_the_gold_road; 35d) `scroll_treaty`: key focus.
- `pay_down_the_ledger` **Pay Down the Ledger** (12,2; ← eastern_gate_of_the_gold_road) `ledger_coins`: Debt −15; political_power −25. AI 15; ×2 if debt ≥ 30.
- `the_pacts_right_hand` **The Pact's Right Hand** (10,3; ← a_seat_in_the_pact; ✕ no_mans_debtor) `handshake_oath`: Avail: in a faction with Stabilo. army_experience 10; add_spirit pacts_right_hand. AI 40.
- `no_mans_debtor` **No Man's Debtor** (12,3; ← pay_down_the_ledger; ✕ the_pacts_right_hand) `chain_broken`: Avail: in no faction. Lean +15; stability 0.05. AI 15.
- `the_gold_roads_end` **The Gold Road's End** (11,4; ← the_pacts_right_hand / no_mans_debtor) `caravan`: building industrial_complex 1 @capital; political_power 50. AI 20.
- `caravan_porters` **Caravan Porters** (13,2; ← eastern_gate_of_the_gold_road) `caravan`: Inf +3 gold on Stabilo; political_power 25. AI 20.

**D. The Hill Coast.** `allow_branch` on `the_hill_coast`: Plutondo owns a coastal state.

- `the_hill_coast` **The Hill Coast** (20,1; ← the_princes_court) `harbour_lake`: building dockyard 1 @random_coastal. AI 20.
- `galleys_of_the_hill_coast` **Galleys of the Hill Coast** (19,2; ← the_hill_coast) `galley_oars`: research [zin_cat_galleys] 50% ×1. AI 15.
- `harbour_of_plutondo` **Harbour of Plutondo** (21,2; ← the_hill_coast) `anchor_rope`: building naval_base 1 @random_coastal. AI 15.
- `coastal_watch` **The Coastal Watch** (20,3; ← galleys_of_the_hill_coast / harbour_of_plutondo) `lighthouse`: building coastal_bunker 1 @random_coastal. AI 10.
- `sailors_of_plutondo` **Sailors of Plutondo** (20,4; ← coastal_watch) `warship_sail`: navy_experience 10. AI 10.

**E. The Generous Friends.** Copy of E4, root `temples_of_the_deliverer` at (15,1), prerequisite `the_princes_court`.

**F. The Question of the East.** Copy of E9, root `question_of_the_east` at (14,6), prerequisites `the_prince_of_plutondo` / `the_gold_roads_end` / `temples_of_the_deliverer`.

### Key focuses

| Key | Name | Prerequisites | Effects summary |
| --- | --- | --- | --- |
| `the_princes_court` | The Prince's Court | – | political_power 50; stability 0.02. AI 100 |
| `a_seat_in_the_pact` | A Seat in the Pact | eastern_gate_of_the_gold_road | Avail: exists Stabilo; Stabilo leads a faction; Plutondo in no faction; lean ≤ −30. event_for Stabilo zin_shared_east_lands.2 (the shared tree's "A Court Asks for the Pact"). AI 30; hist ×1.5 |
| `the_great_levy` | The Great Levy | workshops_of_the_many / fields_of_plutondo | Avail: at war, or `zin_war_of_last_crowns`. manpower 10000; war_support 0.05. AI 100 when available |
| `no_mans_debtor` | No Man's Debtor | pay_down_the_ledger | Avail: in no faction. Lean +15; stability 0.05 |
| `question_of_the_east` (E9) | The Question of the East | the_prince_of_plutondo / the_gold_roads_end / temples_of_the_deliverer | As E9 |

### Spirits

| Key | Name | Modifiers | Source |
| --- | --- | --- | --- |
| `blozans_household_spirit` | Blozan's Household | political_power_gain 0.05, stability_factor 0.02 | blozans_household; replaced by prince_of_plutondo |
| `prince_of_plutondo` | The Prince of Plutondo | political_power_gain 0.10, stability_factor 0.03, opinion_gain_monthly_factor 0.10 | the_prince_of_plutondo |
| `hill_granaries` | Granaries of the Hills | monthly_population 0.10, stability_factor 0.02 | granaries_of_the_hills |
| `levy_rolls_spirit` | The Levy Rolls | conscription_factor 0.05, recruitable_population_factor 0.05 | levy_rolls |
| `pacts_right_hand` | The Pact's Right Hand | army_org_factor 0.05, experience_gain_army_factor 0.05 | the_pacts_right_hand; removed if Plutondo leaves Stabilo's faction |
| copies | E4, E9 spirits | as the shared tree | copied modules |

### Events (namespace `zin_regional_plutondo`)

| Id | Title | For | Fired by | Picture | Options (AI) |
| --- | --- | --- | --- | --- | --- |
| .1 | Between Drak and Erco | Plutondo | between_drak_and_erco | `generic_court` | Boundary stones between the three crowns have moved again. "Settle it with Drak" (Drak opinion +15; Lean −5) / "Settle it with Erco" (Erco opinion +15) / "Let the stones lie" (political_power 25). No claims either way. AI 40/30/30 |

---

## Drak (`regional_drak`)

### Situation in 4A 1748

Drak is the martial kingdom of the south and the Stabilo Pact's oldest partner: eleven states of forts, horse-farms and war-halls whose kings have held their crown by the sword since before the roads opened (proposed). Its levies guard the Pact's caravans; its king, Morod, owes Postondoroth's houses a heavy debt (Stabilo tree: 20) and resents it. On today's map the old seat of Postondoroth lies inside Drak's land, not Stabilo's (map spec, row S5). If the map is fixed, the branch about it stays hidden.

### Role

- **Historical path.** Drak stays in the Pact and is Stabilo's sword. If the Caravan War comes, Drak fights in it as a member. Whether it kneels is open; its debt to Stabilo lowers its kneel bias (Stabilo tree).
- **Alternatives.** Drak can pay its debt in iron or borrow more for its army; if it holds Postondoroth's site, it can yield the old seat to Stabilo or keep it.

### Ruler

King Morod of Drak (`<Drak>_zin_ruler`), Wild stance `zin_wild_freeholds`, trait `zin_trait_warking`.

### Tree

| Branch | Columns | Rows | Focuses | Opens |
| --- | --- | --- | ---: | --- |
| A. The Martial Crown | 0–4 | 0–3 | 7 | start |
| B. Sword of the Pact | 5–9 | 1–5 | 8 | start; two focuses need war |
| C. The Old Seat | 19–21 | 1–3 | 4 | Drak owns a `zin_is_site_postondoroth` state (`allow_branch`) |
| D. Debts and Due | 10–12 | 1–3 | 4 | start |
| E. The Generous Friends (copy of E4) | 13–15 | 1–4 | 6 | start |
| F. The Question of the East (copy of E9) | 9–18 | 6–9 | 11 | `zin_east_question_open` |

**A. The Martial Crown.**

- `the_martial_crown` **The Martial Crown** (2,0) `crown_iron`: political_power 50; army_experience 5. AI 100.
- `morods_marshals` **Morod's Marshals** (1,1; ← the_martial_crown) `war_council_map`: add_spirit morods_marshals_spirit. AI 40.
- `the_war_halls` **The War-Halls** (3,1; ← the_martial_crown) `war_drums`: building bunker 1 @capital; army_experience 5. AI 30.
- `the_kings_champions` **The King's Champions** (0,2; ← morods_marshals) `knight_lance`: army_experience 10. AI 25.
- `the_iron_tithe` **The Iron Tithe** (2,2; ← morods_marshals / the_war_halls) `tribute_chest`: political_power 75. AI 25.
- `the_kings_hunt` **The King's Hunt** (4,2; ← the_war_halls; 35d) `horse_cavalry`: stability 0.03; war_support 0.03. AI 15.
- `the_sword_kingdom` **The Sword Kingdom** (2,3; ← the_kings_champions / the_iron_tithe / the_kings_hunt) `sword_shield`: swap_spirit morods_marshals_spirit → sword_kingdom. AI 25.

**B. Sword of the Pact.**

- `sword_of_the_pact` **Sword of the Pact** (7,1; ← the_martial_crown) `handshake_oath`: Avail: in a faction with Stabilo, or lean ≤ −50. Lean −10; army_experience 10. AI 50.
- `drill_with_the_shield_companies` **Drill With the Shield-Companies** (6,2; ← sword_of_the_pact) `sword_shield`: add_spirit pact_drill. AI 30.
- `forts_toward_furvior` **Forts Toward Furvior** (8,2; ← sword_of_the_pact) `fort_wall`: call zin_regional_drak_fortify_march. AI 15; ×3 if rivalry ≥ 75.
- `the_pacts_cavalry` **The Pact's Cavalry** (5,3; ← drill_with_the_shield_companies) `horse_cavalry`: research [zin_cat_mounts] 50% ×1; army_experience 5. AI 20.
- `war_chest_of_the_pact` **War Chest of the Pact** (7,3; ← drill_with_the_shield_companies / forts_toward_furvior) `coin_chest`: Debt +10; political_power 100. AI 15.
- `pact_riders_on_the_gold_road` **Pact Riders on the Gold Road** (9,3; ← forts_toward_furvior) `camel_rider`: Inf +3 gold on Stabilo; army_experience 5. AI 15.
- `ready_for_the_caravan_war` **Ready for the Caravan War** (6,4; ← the_pacts_cavalry / war_chest_of_the_pact) `war_council_map`: key focus.
- `the_shield_of_postondoroth` **The Shield of Postondoroth** (8,4; ← war_chest_of_the_pact / pact_riders_on_the_gold_road) `fort_wall`: add_spirit shield_of_postondoroth. AI 20.

**C. The Old Seat.** Shown only while Drak owns the Postondoroth site (map spec S5 unresolved). **Mutual exclusions:** `yield_the_old_seat` / `keep_the_old_seat`.

- `the_old_seat` **The Old Seat** (20,1; ← the_martial_crown; 35d) `empty_throne`: allow_branch: owns a state with `zin_is_site_postondoroth`. political_power 25; tooltip "Postondoroth's old halls stand in our land." AI 40.
- `yield_the_old_seat` **Yield the Old Seat** (19,2; ← the_old_seat; ✕ keep_the_old_seat) `banner_laid_down`: key focus.
- `keep_the_old_seat` **Keep the Old Seat** (21,2; ← the_old_seat; ✕ yield_the_old_seat) `throne_gold`: key focus.
- `the_seat_of_drak` **The Seat of Drak** (21,3; ← keep_the_old_seat) `palace_wards`: building industrial_complex 1 @capital; stability 0.03. AI 30.

**D. Debts and Due.** **Mutual exclusions:** `pay_in_iron` / `borrow_for_the_army`.

- `the_debt_to_postondoroth` **The Debt to Postondoroth** (11,1; ← the_martial_crown; 35d) `ledger_coins`: political_power 25; tooltip shows the debt. AI 30.
- `pay_in_iron` **Pay in Iron** (10,2; ← the_debt_to_postondoroth; ✕ borrow_for_the_army) `forge_anvil`: Debt −15; political_power −25. AI 15; ×2 if debt ≥ 40.
- `borrow_for_the_army` **Borrow for the Army** (12,2; ← the_debt_to_postondoroth; ✕ pay_in_iron) `coin_chest`: Debt +15; army_experience 10; equipment infantry_equipment 500. AI 20.
- `free_of_the_ledger` **Free of the Ledger** (11,3; ← pay_in_iron / borrow_for_the_army) `chain_broken`: Avail: debt below 10. stability 0.05; political_power 50. AI 100 when available.

**E. The Generous Friends.** Copy of E4, root `temples_of_the_deliverer` at (14,1), prerequisite `the_martial_crown`.

**F. The Question of the East.** Copy of E9, root `question_of_the_east` at (14,6), prerequisites `the_sword_kingdom` / `the_shield_of_postondoroth` / `temples_of_the_deliverer`.

### Key focuses

| Key | Name | Prerequisites | Effects summary |
| --- | --- | --- | --- |
| `the_martial_crown` | The Martial Crown | – | political_power 50; army_experience 5. AI 100 |
| `ready_for_the_caravan_war` | Ready for the Caravan War | the_pacts_cavalry / war_chest_of_the_pact | Avail: `global_flag` zin_east_caravan_war, or Stabilo at war with Noris. war_support 0.10; add_spirit caravan_war_drak. AI 200 when available. Grants no cause of its own: Drak fights only as the Pact's member |
| `yield_the_old_seat` | Yield the Old Seat | the_old_seat | call zin_regional_drak_yield_seat (transfers every owned `zin_is_site_postondoroth` state to Stabilo; Debt −100; Lean −20). AI 30; ×2 if debt ≥ 30 |
| `keep_the_old_seat` | Keep the Old Seat | the_old_seat | flag zin_regional_drak_keeps_seat; political_power 100; Lean +15. AI 30 |
| `question_of_the_east` (E9) | The Question of the East | the_sword_kingdom / the_shield_of_postondoroth / temples_of_the_deliverer | As E9 |

### Spirits

| Key | Name | Modifiers | Source |
| --- | --- | --- | --- |
| `morods_marshals_spirit` | Morod's Marshals | army_org_factor 0.05, experience_gain_army_factor 0.05 | morods_marshals; replaced by sword_kingdom |
| `sword_kingdom` | The Sword Kingdom | army_org_factor 0.05, army_attack_factor 0.05, war_support_factor 0.05 | the_sword_kingdom |
| `pact_drill` | Drilled With the Shield-Companies | army_defence_factor 0.05, experience_gain_army_factor 0.05 | drill_with_the_shield_companies |
| `shield_of_postondoroth` | The Shield of Postondoroth | army_core_defence_factor 0.10, political_power_gain 0.05 | the_shield_of_postondoroth; removed if Drak leaves Stabilo's faction |
| `caravan_war_drak` | Drak Rides for the Pact | army_attack_factor 0.05, war_support_factor 0.05 | ready_for_the_caravan_war; removed when the Caravan War ends |
| copies | E4, E9 spirits | as the shared tree | copied modules |

### Tree-declared scripts

| Name | Kind | Does |
| --- | --- | --- |
| `zin_regional_drak_fortify_march` | effect | Bunker +1 in up to two Drak states that border Noris or a Noris subject |
| `zin_regional_drak_yield_seat` | effect | `transfer_state` of every Drak state with `zin_is_site_postondoroth` to Stabilo; `zin_stabilo_add_debt(-100)`; `zin_east_add_lean(-20)` |

Drak has no tree events.

---

## Ostoroth (`regional_ostoroth`)

### Situation in 4A 1748

Ostoroth is a highland kingdom of nine states at the end of the Lake Road, where the caravans from Furvior climb past Mora's lake into the high pastures (mechanic). Its clans keep herds and hill forts; its king, Ocellio, rules through a moot of clan chiefs that he would rather do without (proposed). Furvior's riders are old friends of the highland markets (lean +15), but the Lake Road's charter is free and the chiefs like it that way.

### Role

- **Historical path.** Ostoroth stays a friend of Furvior and free of the Treaty; its coalition weight is low. Whether it kneels is open.
- **Alternatives.** A strong king or a strong moot; a road given to Furvior or kept for the highlands; a fortress of hill companies that closes the Lake Road to the eastern host.

### Ruler

King Ocellio of Ostoroth (`<Ostoroth>_zin_ruler`), Wild stance `zin_wild_freeholds`, trait `zin_trait_lawspeaker`.

### Tree

| Branch | Columns | Rows | Focuses | Opens |
| --- | --- | --- | ---: | --- |
| A. The Highland Crown | 0–3 | 0–3 | 6 | start |
| B. The Lake Road | 4–8 | 1–4 | 6 | start |
| C. Highland Companies | 19–23 | 1–4 | 6 | start |
| D. Herds and Lakes | 9–12 | 1–3 | 5 | start |
| E. The Generous Friends (copy of E4) | 13–15 | 1–4 | 6 | start |
| F. The Question of the East (copy of E9) | 9–18 | 6–9 | 11 | `zin_east_question_open` |

**A. The Highland Crown.** **Mutual exclusions:** `the_clan_moot` / `the_kings_word`.

- `the_highland_crown` **The Highland Crown** (2,0) `crown_iron`: political_power 50; stability 0.02. AI 100.
- `ocellios_court` **Ocellio's Court** (1,1; ← the_highland_crown) `throne_gold`: political_power 50. AI 40.
- `the_highland_clans` **The Highland Clans** (3,1; ← the_highland_crown) `banner_plain`: manpower 1500; stability 0.02. AI 30.
- `the_clan_moot` **The Clan Moot** (0,2; ← ocellios_court / the_highland_clans; ✕ the_kings_word) `council_table`: Drift wild +5; add_spirit clan_moot. AI 25; hist ×2.
- `the_kings_word` **The King's Word** (2,2; ← ocellios_court / the_highland_clans; ✕ the_clan_moot) `seal_royal`: Drift dominion +5; add_spirit kings_word. AI 15.
- `crown_of_the_highlands` **Crown of the Highlands** (1,3; ← the_clan_moot / the_kings_word) `snow_peak`: political_power 75; stability 0.03. AI 25.

**B. The Lake Road.** **Mutual exclusions:** `friends_at_furvior` / `the_road_is_ours`.

- `the_lake_road` **The Lake Road** (6,1; ← the_highland_crown) `traders_road`: call zin_shared_east_lands_road_infra; political_power 25. AI 35.
- `friends_at_furvior` **Friends at Furvior** (5,2; ← the_lake_road; ✕ the_road_is_ours) `camel_rider`: Lean +15; Inf +5 lake on Noris. AI 15 + lean ÷ 2.
- `the_road_is_ours` **The Road Is Ours** (7,2; ← the_lake_road; ✕ friends_at_furvior) `toll_house`: call zin_shared_east_lands_halve_lean; add_spirit lake_tolls. AI 20.
- `markets_of_ostoroth` **Markets of Ostoroth** (4,3; ← friends_at_furvior / the_road_is_ours) `market_stalls`: building industrial_complex 1 @capital. AI 20.
- `mora_our_neighbour` **Mora, Our Neighbour** (6,3; ← friends_at_furvior / the_road_is_ours; 35d) `lake_town`: Avail: exists Mora. event_for Mora regional_ostoroth.1. AI 20.
- `the_high_road_rich` **The High Road Grows Rich** (5,4; ← markets_of_ostoroth / mora_our_neighbour) `coin_chest`: political_power 50; building infrastructure 1 @capital. AI 15.

**C. Highland Companies.**

- `highland_companies` **Highland Companies** (21,1; ← the_highland_crown) `spear_levy`: army_experience 10; manpower 1000. AI 25.
- `crag_forts` **Crag Forts** (20,2; ← highland_companies) `pass_fort`: building bunker 1 @capital; building bunker 1 @random_owned. AI 15; ×3 after `zin_war_of_last_crowns`.
- `highland_archers` **Highland Archers** (22,2; ← highland_companies) `bow_archers`: research [zin_cat_bows] 50% ×1. AI 20.
- `hill_ponies` **Hill Ponies** (20,3; ← crag_forts) `horse_cavalry`: research [zin_cat_mounts] 50% ×1. AI 15.
- `the_passes_held` **The Passes Held** (22,3; ← crag_forts / highland_archers) `mountain_pass`: add_spirit passes_held. AI 20.
- `masters_of_the_heights` **Masters of the Heights** (21,4; ← hill_ponies / the_passes_held) `war_council_map`: army_experience 10; research [zin_cat_arms] 50% ×1. AI 15.

**D. Herds and Lakes.**

- `herds_of_the_high_pastures` **Herds of the High Pastures** (10,1; ← the_highland_crown) `herds`: add_spirit high_pastures. AI 30.
- `wool_and_hides` **Wool and Hides** (9,2; ← herds_of_the_high_pastures) `market_stalls`: building industrial_complex 1 @random_owned. AI 20.
- `lake_fisheries` **Lake Fisheries** (11,2; ← herds_of_the_high_pastures) `fishing_boats`: stability 0.03; political_power 25. AI 20.
- `mines_of_the_crags` **Mines of the Crags** (9,3; ← wool_and_hides) `mine_cart`: building arms_factory 1 @capital. AI 20.
- `the_highland_granaries` **The Highland Granaries** (11,3; ← lake_fisheries) `granary`: stability 0.03; manpower 1000. AI 15.

**E. The Generous Friends.** Copy of E4, root `temples_of_the_deliverer` at (14,1), prerequisite `the_highland_crown`.

**F. The Question of the East.** Copy of E9, root `question_of_the_east` at (14,6), prerequisites `crown_of_the_highlands` / `the_high_road_rich` / `temples_of_the_deliverer`.

### Key focuses

| Key | Name | Prerequisites | Effects summary |
| --- | --- | --- | --- |
| `the_highland_crown` | The Highland Crown | – | political_power 50; stability 0.02. AI 100 |
| `the_clan_moot` | The Clan Moot | ocellios_court / the_highland_clans | Drift wild +5; add_spirit clan_moot |
| `the_kings_word` | The King's Word | ocellios_court / the_highland_clans | Drift dominion +5; add_spirit kings_word |
| `the_road_is_ours` | The Road Is Ours | the_lake_road | halves lean; add_spirit lake_tolls |
| `the_passes_held` | The Passes Held | crag_forts / highland_archers | add_spirit passes_held (the Lake Road can be shut to an eastern host) |
| `question_of_the_east` (E9) | The Question of the East | crown_of_the_highlands / the_high_road_rich / temples_of_the_deliverer | As E9 |

### Spirits

| Key | Name | Modifiers | Source |
| --- | --- | --- | --- |
| `clan_moot` | The Clan Moot | conscription_factor 0.05, stability_factor 0.03, political_power_gain −0.05 | the_clan_moot |
| `kings_word` | The King's Word | political_power_factor 0.10, stability_factor −0.02 | the_kings_word |
| `lake_tolls` | Tolls of the Lake Road | trade_opinion_factor 0.10, political_power_gain 0.05 | the_road_is_ours |
| `passes_held` | The Passes Held | army_core_defence_factor 0.10, max_dig_in 2 | the_passes_held |
| `high_pastures` | The High Pastures | monthly_population 0.05, stability_factor 0.02 | herds_of_the_high_pastures |
| copies | E4, E9 spirits | as the shared tree | copied modules |

### Events (namespace `zin_regional_ostoroth`)

| Id | Title | For | Fired by | Picture | Options (AI) |
| --- | --- | --- | --- | --- | --- |
| .1 | A Letter From the Highlands | Mora | mora_our_neighbour | `generic_court` | Ostoroth proposes that the lake and the highlands keep the Lake Road free together. "Sign a pact of neighbours" (`non_aggression` with Ostoroth; both opinion +15) / "Thank them politely" (nothing). AI 70/30 |

---

## Gondolin (`regional_gondolin`)

### Situation in 4A 1748

Gondolin is the northern maritime crown of the East: six states where the Salt Road ends at the sea that faces the Ocean of Zol (mechanic, roster). It has been Furvior's partner in the Noris Treaty for generations (working table), and its quays ship Noris's salt along the northern coast. Queen Lorvena is proud of the Treaty and prouder of her captains. Her fishermen have lately told stories of dark sails among far islands that answer no hail; her court smiles at them (start situation pressure 3, proposed for Gondolin).

### Role

- **Historical path.** Gondolin stays in the Noris Treaty and keeps Furvior's northern watch (Noris's "Gondolin's Watch on the North"). Its coalition weight is low; whether it kneels is open. After `zin_zol_rising` its coast faces the dead.
- **Alternatives.** It can ask more of Furvior, build a real fleet, or turn its watch into the East's first line against the dead.

### Ruler

Queen Lorvena of Gondolin (`<Gondolin>_zin_ruler`), Wild stance `zin_wild_freeholds`, trait `zin_trait_port_master`.

### Tree

| Branch | Columns | Rows | Focuses | Opens |
| --- | --- | --- | ---: | --- |
| A. The Sea Crown | 0–3 | 0–3 | 6 | start |
| B. Harbours of Gondolin | 4–8 | 1–4 | 7 | coastal state (`allow_branch`) |
| C. Watch on the Northern Sea | 19–23 | 1–4 | 6 | start; two focuses need `zin_zol_rising` |
| D. Northern Anchor of the Treaty | 9–12 | 1–4 | 5 | start |
| E. The Generous Friends (copy of E4) | 13–15 | 1–4 | 6 | start |
| F. The Question of the East (copy of E9) | 9–18 | 6–9 | 11 | `zin_east_question_open` |

The Noris spec notes that the map may give Gondolin no coastal state. Then branch B stays hidden and the tree has 34 focuses; C's coastal buildings fall back to the capital (open question 3).

**A. The Sea Crown.**

- `the_sea_crown` **The Sea Crown** (2,0) `crown_iron`: political_power 50; navy_experience 5. AI 100.
- `lorvenas_court` **Lorvena's Court** (1,1; ← the_sea_crown) `throne_gold`: add_spirit lorvenas_court_spirit. AI 40.
- `the_northern_houses` **The Northern Houses** (3,1; ← the_sea_crown) `council_table`: manpower 1000; stability 0.02. AI 30.
- `the_royal_house_of_gondolin` **The Royal House of Gondolin** (0,2; ← lorvenas_court; 35d) `seal_royal`: event regional_gondolin.2. AI 20.
- `the_queens_council` **The Queen's Council** (2,2; ← lorvenas_court / the_northern_houses) `council_table`: political_power 75. AI 25.
- `crown_of_the_northern_shore` **Crown of the Northern Shore** (1,3; ← the_royal_house_of_gondolin / the_queens_council) `sceptre`: swap_spirit lorvenas_court_spirit → northern_shore_crown. AI 25.

**B. Harbours of Gondolin.** `allow_branch` on `harbours_of_gondolin`: Gondolin owns a coastal state.

- `harbours_of_gondolin` **Harbours of Gondolin** (6,1; ← the_sea_crown) `harbour_lake`: building dockyard 1 @random_coastal; navy_experience 5. AI 35.
- `the_salt_quays` **The Salt Quays** (5,2; ← harbours_of_gondolin) `toll_house`: building naval_base 1 @random_coastal; Inf +5 salt on Noris. AI 25.
- `galleys_of_gondolin` **Galleys of Gondolin** (7,2; ← harbours_of_gondolin) `galley_oars`: research [zin_cat_galleys] 50% ×1. AI 25.
- `the_fishing_fleets` **The Fishing Fleets** (4,3; ← the_salt_quays) `fishing_boats`: stability 0.03; political_power 25. AI 20.
- `sea_charts_of_the_north` **Sea Charts of the North** (6,3; ← the_salt_quays / galleys_of_gondolin) `sea_charts`: navy_experience 10; research [zin_cat_galleys] 50% ×1. AI 15.
- `warships_of_the_north` **Warships of the North** (8,3; ← galleys_of_gondolin) `warship_sail`: research [zin_cat_warships] 50% ×1. AI 15.
- `masters_of_the_northern_sea` **Masters of the Northern Sea** (6,4; ← sea_charts_of_the_north / warships_of_the_north) `great_warship`: add_spirit northern_sea_masters. AI 20.

**C. Watch on the Northern Sea.**

- `watch_on_the_northern_sea` **Watch on the Northern Sea** (21,1; ← the_sea_crown; 35d) `lighthouse`: event regional_gondolin.1. AI 30.
- `the_watchers_of_gondolin` **The Watchers of Gondolin** (20,2; ← watch_on_the_northern_sea) `eye_watchful`: add_spirit watchers_of_gondolin. AI 25.
- `beacons_of_the_shore` **Beacons of the Shore** (22,2; ← watch_on_the_northern_sea) `beacon`: building coastal_bunker 1 @zol_coast (capital if none); flag zin_regional_gondolin_beacons. AI 20.
- `word_to_furvior` **Word to Furvior** (21,3; ← the_watchers_of_gondolin / beacons_of_the_shore; 35d) `envoy`: for_country Noris: political_power 25; Lean +5. AI 20.
- `the_dead_on_the_shore` **The Dead on the Shore** (20,4; ← word_to_furvior) `black_hulls`: key focus.
- `ships_against_the_black_sails` **Ships Against the Black Sails** (22,4; ← word_to_furvior) `warship_sail`: Avail: `zin_zol_rising`. research [zin_cat_warships] 50% ×1; navy_experience 15. AI 100 when available.

**D. Northern Anchor of the Treaty.** **Mutual exclusions:** `a_voice_in_the_treaty_council` / `ask_more_of_furvior`.

- `northern_anchor_of_the_treaty` **Northern Anchor of the Treaty** (10,1; ← the_sea_crown) `anchor_rope`: Lean +10; political_power 25. AI 40.
- `the_salt_roads_end` **The Salt Road's End** (9,2; ← northern_anchor_of_the_treaty) `traders_road`: call zin_shared_east_lands_road_infra; Inf +5 salt on Noris. AI 25.
- `treaty_levies_of_gondolin` **Treaty Levies of Gondolin** (11,2; ← northern_anchor_of_the_treaty) `levy_muster`: Avail: in a faction with Noris. army_experience 10; manpower 1000. AI 25.
- `a_voice_in_the_treaty_council` **A Voice in the Treaty Council** (9,3; ← the_salt_roads_end / treaty_levies_of_gondolin; ✕ ask_more_of_furvior) `scroll_treaty`: Avail: in a faction with Noris. political_power 50; for_country Noris: Gondolin opinion +10. AI 30.
- `ask_more_of_furvior` **Ask More of Furvior** (11,3; ← the_salt_roads_end / treaty_levies_of_gondolin; ✕ a_voice_in_the_treaty_council) `coin_chest`: political_power 75; Lean −5. AI 15.

**E. The Generous Friends.** Copy of E4, root `temples_of_the_deliverer` at (14,1), prerequisite `the_sea_crown`.

**F. The Question of the East.** Copy of E9, root `question_of_the_east` at (14,6), prerequisites `crown_of_the_northern_shore` / `a_voice_in_the_treaty_council` / `ask_more_of_furvior` / `temples_of_the_deliverer`.

### Key focuses

| Key | Name | Prerequisites | Effects summary |
| --- | --- | --- | --- |
| `the_sea_crown` | The Sea Crown | – | political_power 50; navy_experience 5. AI 100 |
| `watch_on_the_northern_sea` | Watch on the Northern Sea | the_sea_crown | event .1 (lights beyond the islands; text never says what they are before `zin_zol_rising`) |
| `the_dead_on_the_shore` | The Dead on the Shore | word_to_furvior | Avail: `zin_zol_rising`. add_spirit stand_against_the_tide; war_support 0.10. AI 200 when available |
| `northern_anchor_of_the_treaty` | Northern Anchor of the Treaty | the_sea_crown | Lean +10; political_power 25 |
| `masters_of_the_northern_sea` | Masters of the Northern Sea | sea_charts_of_the_north / warships_of_the_north | add_spirit northern_sea_masters |
| `question_of_the_east` (E9) | The Question of the East | see above | As E9; Gondolin's high lean and Treaty membership give it kneel bias −20 if Noris refuses (mechanic row "member of a faction whose leader refused") |

### Spirits

| Key | Name | Modifiers | Source |
| --- | --- | --- | --- |
| `lorvenas_court_spirit` | Lorvena's Court | political_power_gain 0.05, naval_speed_factor 0.05 | lorvenas_court; replaced by northern_shore_crown |
| `northern_shore_crown` | Crown of the Northern Shore | political_power_gain 0.10, navy_org_factor 0.05, stability_factor 0.03 | crown_of_the_northern_shore |
| `northern_sea_masters` | Masters of the Northern Sea | naval_damage_factor 0.05, naval_detection 0.10, convoy_escort_efficiency 0.10 | masters_of_the_northern_sea |
| `watchers_of_gondolin` | The Watchers of Gondolin | naval_detection 0.10, coastal_bunker_effectiveness_factor 0.10 | the_watchers_of_gondolin |
| `stand_against_the_tide` | Stand Against the Tide | army_core_defence_factor 0.10, coastal_bunker_effectiveness_factor 0.15, war_support_factor 0.05 | the_dead_on_the_shore |
| copies | E4, E9 spirits | as the shared tree | copied modules |

### Events (namespace `zin_regional_gondolin`)

| Id | Title | For | Fired by | Picture | Options (AI) |
| --- | --- | --- | --- | --- | --- |
| .1 | Lights Beyond the Islands | Gondolin | watch_on_the_northern_sea | `black_isles_lights` | Lookouts see lights where no harbour stands. Before `zin_zol_rising`: "Fishermen's lamps" (political_power 15) / "Double the watch" (navy_experience 5). After it the text speaks of the dead on far shores and has one option "Double the watch". AI 50/50 |
| .2 | The Royal House of Gondolin | Gondolin | the_royal_house_of_gondolin | `generic_court` | "A match in Furvior" (Lean +10; Noris opinion +15) / "A match among our captains" (navy_experience 10) / "No match this year" (political_power 25). AI 40/30/30 |

---

## Mora (`regional_mora`)

### Situation in 4A 1748

Mora is a lake republic of five states between Ostoroth and Noris, on the Lake Road (roster, mechanic). Its towns elect a Speaker and a council of boat-guilds and wharf-masters; Speaker Moira Eraver presides (proposed). Mora is the only Light court among the tier B crowns of the East: its people are proud of their elections, suspicious of kings, and, being a council realm, harder for the temples' friends to court (Afrit spec: Light ideology +2 watchfulness). Its wharves serve Furvior's caravans; its council likes Furvior's coin more than Furvior's riders.

### Role

- **Historical path.** Mora stays free and friendly to Noris (lean +10); its council asks questions about the temples' loans but does not close the Houses before the reveal. Its coalition weight is very low (Light −30). On the historical path it most often refuses the King of the East.
- **Alternatives.** Mora can open an honest inquiry into the temples, make the council suspicious early and close the Houses once suspicion allows; it can seek a guarantee from Furvior when war comes, or stay neutral water.

### Ruler

Speaker Moira Eraver (`<Mora>_zin_ruler`), Light stance `zin_light_council`, trait `zin_trait_elected_speaker`. Mora holds elections (`zin_politics_has_elections`).

### Tree

| Branch | Columns | Rows | Focuses | Opens |
| --- | --- | --- | ---: | --- |
| A. The Lake Republic | 0–3 | 0–3 | 6 | start |
| B. Lake Towns | 4–8 | 1–4 | 6 | start |
| C. A Republic Among Kings | 19–23 | 1–4 | 6 | start; one focus needs war |
| D. The Watchful Council | 9–12 | 1–4 | 5 | start |
| E. Levies of the East (copy of E5) | 13–15 | 1–4 | 6 | start |
| F. The Question of the East (copy of E9) | 9–18 | 6–9 | 11 | `zin_east_question_open` |

Mora does not copy E4: branch D is its own answer to the temples.

**A. The Lake Republic.** **Mutual exclusions:** `free_elections_of_mora` / `the_first_citizens`.

- `the_lake_republic` **The Lake Republic** (2,0) `lake_town`: political_power 50; stability 0.03. AI 100.
- `the_speakers_hall` **The Speaker's Hall** (1,1; ← the_lake_republic) `council_table`: add_spirit speakers_hall. AI 40.
- `the_guilds_of_the_lake` **The Guilds of the Lake** (3,1; ← the_lake_republic) `guild_hall`: political_power 50. AI 30.
- `free_elections_of_mora` **Free Elections of Mora** (0,2; ← the_speakers_hall; ✕ the_first_citizens) `charter_free`: Drift light +5; stability 0.03. AI 30; ×2 if ruling ideology Light.
- `the_first_citizens` **The First Citizens** (2,2; ← the_speakers_hall / the_guilds_of_the_lake; ✕ free_elections_of_mora) `seal_wax`: Drift wild +5; political_power 50. AI 10.
- `the_charter_of_mora` **The Charter of Mora** (1,3; ← free_elections_of_mora / the_first_citizens) `charter_old`: add_spirit charter_of_mora. AI 25.

**B. Lake Towns.**

- `lake_towns` **The Lake Towns** (6,1; ← the_lake_republic) `lake_town`: building industrial_complex 1 @capital. AI 35.
- `fisheries_of_the_lake` **Fisheries of the Lake** (5,2; ← lake_towns) `fishing_boats`: add_spirit lake_fisheries. AI 25.
- `the_lake_road_wharves` **The Lake Road Wharves** (7,2; ← lake_towns) `harbour_lake`: call zin_shared_east_lands_road_infra; Lean +5; political_power 25. AI 25.
- `boatwrights_of_mora` **Boatwrights of Mora** (5,3; ← fisheries_of_the_lake) `shipwright_yard`: building industrial_complex 1 @random_owned. AI 20.
- `the_lake_schools` **The Lake Schools** (7,3; ← the_lake_road_wharves) `university_hall`: research [industry] 50% ×1; political_power 25. AI 20.
- `the_richest_lake_in_the_east` **The Richest Lake in the East** (6,4; ← boatwrights_of_mora / the_lake_schools) `coin_chest`: political_power 50; stability 0.03. AI 20.

**C. A Republic Among Kings.** **Mutual exclusions:** `the_noris_embassy` / `neutral_waters`.

- `a_republic_among_kings` **A Republic Among Kings** (21,1; ← the_lake_republic; 35d) `banner_league`: political_power 25. AI 30.
- `friendship_with_ostoroth` **Friendship With Ostoroth** (20,2; ← a_republic_among_kings) `handshake_oath`: Avail: exists Ostoroth; not at war with Ostoroth. non_aggression Ostoroth; stability 0.02. AI 25.
- `the_noris_embassy` **The Noris Embassy** (22,2; ← a_republic_among_kings; ✕ neutral_waters) `envoy`: Lean +10; Noris opinion of Mora +10. AI 20 + lean ÷ 2.
- `neutral_waters` **Neutral Waters** (22,3; ← a_republic_among_kings; ✕ the_noris_embassy) `olive_branch`: call zin_shared_east_lands_halve_lean; stability 0.05. AI 20.
- `a_shield_for_the_lake` **A Shield for the Lake** (20,3; ← friendship_with_ostoroth / the_noris_embassy) `fort_wall`: Avail: `zin_war_of_last_crowns` or at war. event_for Noris regional_mora.1. AI 100 when available.
- `the_free_lake` **The Free Lake** (21,4; ← a_shield_for_the_lake / neutral_waters) `charter_free`: add_spirit free_lake. AI 20.

**D. The Watchful Council.** **Mutual exclusions:** `ledgers_of_the_temples` / `the_temples_charity`.

- `the_councils_question` **The Council's Question** (10,1; ← the_lake_republic; 35d) `scroll_sealed`: political_power 25; tooltip "The council asks why the temples lend so freely." AI 35.
- `ledgers_of_the_temples` **Ledgers of the Temples** (9,2; ← the_councils_question; ✕ the_temples_charity) `ledger_coins`: flag zin_east_court_audit; Footholds −1; add_spirit open_ledgers. AI 30; ×2 Light.
- `the_temples_charity` **The Temples' Charity** (11,2; ← the_councils_question; ✕ ledgers_of_the_temples) `alms_bread`: Footholds +1; stability 0.03. AI 15.
- `an_honest_inquiry` **An Honest Inquiry** (9,3; ← ledgers_of_the_temples) `eye_watchful`: key focus.
- `close_the_houses_of_mora` **Close the Houses of Mora** (10,4; ← an_honest_inquiry / the_temples_charity) `chain_broken`: Avail: `zin_afrit_revealed` or flag zin_afrit_suspicious. call zin_afrit_purge_houses. AI 60 when available; ×0 client.

**E. Levies of the East.** Copy of E5, root `the_court_guard` at (14,1), prerequisite `the_lake_republic`.

**F. The Question of the East.** Copy of E9, root `question_of_the_east` at (14,6), prerequisites `the_charter_of_mora` / `the_free_lake` / `the_councils_question`.

### Key focuses

| Key | Name | Prerequisites | Effects summary |
| --- | --- | --- | --- |
| `the_lake_republic` | The Lake Republic | – | political_power 50; stability 0.03. AI 100 |
| `free_elections_of_mora` | Free Elections of Mora | the_speakers_hall | Drift light +5; stability 0.03 |
| `an_honest_inquiry` | An Honest Inquiry | ledgers_of_the_temples | event regional_mora.2. AI 25; hist ×0.5 |
| `a_shield_for_the_lake` | A Shield for the Lake | friendship_with_ostoroth / the_noris_embassy | Avail: war. event_for Noris regional_mora.1 (Noris may guarantee Mora) |
| `close_the_houses_of_mora` | Close the Houses of Mora | an_honest_inquiry / the_temples_charity | Avail: reveal or suspicion. call zin_afrit_purge_houses |
| `question_of_the_east` (E9) | The Question of the East | the_charter_of_mora / the_free_lake / the_councils_question | As E9; Mora's Light government doubles the resist route |

### Spirits

| Key | Name | Modifiers | Source |
| --- | --- | --- | --- |
| `speakers_hall` | The Speaker's Hall | stability_factor 0.03, political_power_gain 0.05 | the_speakers_hall |
| `charter_of_mora` | The Charter of Mora | stability_factor 0.05, drift_defence_factor 0.15 | the_charter_of_mora |
| `lake_fisheries` | Fisheries of the Lake | monthly_population 0.05, consumer_goods_factor −0.02 | fisheries_of_the_lake |
| `free_lake` | The Free Lake | stability_factor 0.03, trade_opinion_factor 0.10 | the_free_lake |
| `open_ledgers` | Open Ledgers | enemy_operative_detection_chance_factor 0.15, stability_factor 0.02 | ledgers_of_the_temples |
| copies | E5, E9 spirits | as the shared tree | copied modules |

### Events (namespace `zin_regional_mora`)

| Id | Title | For | Fired by | Picture | Options (AI) |
| --- | --- | --- | --- | --- | --- |
| .1 | The Lake Republic Asks for a Shield | Noris | a_shield_for_the_lake | `generic_court` | "Furvior guards the lake" (`give_guarantee` Mora) / "We cannot spare the riders" (Mora: Lean −10). AI 60 if Mora's lean ≥ 20, else 30 |
| .2 | An Honest Inquiry | Mora | an_honest_inquiry | `houses` | The council's clerks find that the temples' loans are too generous and their lenders too well informed; nobody can say why. Before `zin_afrit_revealed` the text names no one and makes no charge. "Publish the findings" (flag zin_afrit_suspicious for 730 days; call zin_afrit_add_veil(value = −2); stability −0.02) / "Keep the findings in the council's chest" (political_power 25). AI 40/60; hist 20/80 |

The "Publish" option is a proposed dependency on the Afrit spec: a court's own inquiry may make it suspicious (opening *Close the Houses* early) and costs the veil 2.

---

## Avalon (`regional_avalon`)

### Situation in 4A 1748

Avalon is a small republic of three states in the Red Lands of the south, among Oreton, Olor and other independent neighbours (roster). In 4A 1719 (proposed) its towns rose against a king who had sold their wells to his creditors and set up the **Tribunes' Republic**, governed by elected tribunes and a charter of freeholders; Tribune Arcon Vel is its first magistrate (proposed). Kings around it call it the Red Republic and wait for it to fail. Its fields are red earth, its stone is red, and its people are proud and poor.

### Role

- **Historical path.** Avalon stays free, leans slightly toward Postondoroth's money (lean −10), and avoids every war it can. Its coalition weight is low. Whether it kneels is open.
- **Alternatives.** Its tribunes may turn it into a Light council republic, keep it a Wild freehold, or crown a First Tribune (Dominion); it can owe no prince or take the bankers' loans.

### Ruler

Tribune Arcon Vel (`<Avalon>_zin_ruler`), Wild stance `zin_wild_freeholds` (roster), trait `zin_trait_elected_speaker`.

### Tree

| Branch | Columns | Rows | Focuses | Opens |
| --- | --- | --- | ---: | --- |
| A. The Tribunes' Republic | 0–4 | 0–3 | 6 | start |
| B. The Red Lands | 5–8 | 1–4 | 6 | start |
| C. Free Among Kings | 19–23 | 1–4 | 6 | start |
| D. Citizen Levies | 9–12 | 1–4 | 5 | start |
| E. The Generous Friends (copy of E4) | 13–15 | 1–4 | 6 | start |
| F. The Question of the East (copy of E9) | 9–18 | 6–9 | 11 | `zin_east_question_open` |

**A. The Tribunes' Republic.** **Mutual exclusions:** `the_citizens_assembly` / `the_free_charter` / `the_first_tribune`.

- `the_tribunes_republic` **The Tribunes' Republic** (2,0) `banner_plain`: political_power 50; event regional_avalon.1. AI 100.
- `the_tribunes_charter` **The Tribunes' Charter** (2,1; ← the_tribunes_republic) `charter_free`: add_spirit tribunes_charter. AI 40.
- `the_citizens_assembly` **The Citizens' Assembly** (0,2; ← the_tribunes_charter; ✕ the_free_charter, the_first_tribune) `council_table`: Drift light +5; stability 0.03. AI 20.
- `the_free_charter` **The Free Charter** (2,2; ← the_tribunes_charter; ✕ the_citizens_assembly, the_first_tribune) `charter_old`: Drift wild +3; stability 0.05. AI 25; hist ×2.
- `the_first_tribune` **The First Tribune** (4,2; ← the_tribunes_charter; ✕ the_citizens_assembly, the_free_charter) `sceptre`: Drift dominion +5; political_power 75. AI 5.
- `the_red_banners_endure` **The Red Banners Endure** (2,3; ← the_citizens_assembly / the_free_charter / the_first_tribune) `banner_league`: swap_spirit tribunes_charter → red_banners. AI 25.

**B. The Red Lands.**

- `the_red_lands` **The Red Lands** (6,1; ← the_tribunes_republic) `ember_desert`: stability 0.02; political_power 25. AI 35.
- `red_earth_farms` **Red Earth Farms** (5,2; ← the_red_lands) `farm_sowing`: add_spirit red_earth. AI 25.
- `quarries_of_red_stone` **Quarries of Red Stone** (7,2; ← the_red_lands) `quarry_stone`: building industrial_complex 1 @capital. AI 25.
- `the_dye_works` **The Dye Works** (5,3; ← red_earth_farms) `workshop_tools`: political_power 50; building infrastructure 1 @capital. AI 20.
- `salt_of_the_red_lands` **Salt of the Red Lands** (7,3; ← quarries_of_red_stone) `granary`: political_power 50. AI 20.
- `the_red_road` **The Red Road** (6,4; ← the_dye_works / salt_of_the_red_lands) `roads_paved`: building infrastructure 1 @random_owned; stability 0.03. AI 20.

**C. Free Among Kings.** **Mutual exclusions:** `the_bankers_at_the_door` / `owe_no_prince`.

- `free_among_kings` **Free Among Kings** (21,1; ← the_tribunes_republic; 35d) `chain_broken`: political_power 25. AI 30.
- `neighbours_in_oreton` **Neighbours in Oreton** (20,2; ← free_among_kings) `envoy`: Avail: exists Oreton; not at war with Oreton. non_aggression Oreton. AI 25.
- `the_bankers_at_the_door` **The Bankers at the Door** (22,2; ← free_among_kings; ✕ owe_no_prince) `ledger_coins`: Lean −10; if Stabilo has `zin_stabilo_ledger_open`: Debt +10 and political_power 75. AI 20.
- `owe_no_prince` **Owe No Prince** (22,3; ← free_among_kings; ✕ the_bankers_at_the_door) `coin_chest`: call zin_shared_east_lands_halve_lean; stability 0.05. AI 20; hist ×1.5.
- `an_example_to_the_east` **An Example to the East** (20,3; ← neighbours_in_oreton; 35d) `beacon`: event regional_avalon.2. AI 15.
- `the_republic_stands` **The Republic Stands** (21,4; ← an_example_to_the_east / owe_no_prince / the_bankers_at_the_door) `fort_wall`: add_spirit republic_stands. AI 20.

**D. Citizen Levies.**

- `citizen_levies` **Citizen Levies** (10,1; ← the_tribunes_republic) `spear_levy`: manpower 1500; army_experience 5. AI 30.
- `the_militia_of_the_red_lands` **The Militia of the Red Lands** (9,2; ← citizen_levies) `levy_muster`: add_spirit red_militia. AI 25.
- `forts_of_the_republic` **Forts of the Republic** (11,2; ← citizen_levies) `fort_wall`: building bunker 2 @capital. AI 15; ×3 after `zin_war_of_last_crowns`.
- `pikes_and_bows` **Pikes and Bows** (9,3; ← the_militia_of_the_red_lands) `bow_archers`: research [zin_cat_bows] 50% ×1; research [zin_cat_arms] 50% ×1. AI 20.
- `the_republics_captains` **The Republic's Captains** (10,4; ← pikes_and_bows / forts_of_the_republic) `war_council_map`: army_experience 10. AI 15.

**E. The Generous Friends.** Copy of E4, root `temples_of_the_deliverer` at (14,1), prerequisite `the_tribunes_republic`.

**F. The Question of the East.** Copy of E9, root `question_of_the_east` at (14,6), prerequisites `the_red_banners_endure` / `the_republic_stands` / `temples_of_the_deliverer`.

### Key focuses

| Key | Name | Prerequisites | Effects summary |
| --- | --- | --- | --- |
| `the_tribunes_republic` | The Tribunes' Republic | – | political_power 50; event .1. AI 100 |
| `the_citizens_assembly` | The Citizens' Assembly | the_tribunes_charter | Drift light +5; stability 0.03 |
| `the_first_tribune` | The First Tribune | the_tribunes_charter | Drift dominion +5; political_power 75 |
| `owe_no_prince` | Owe No Prince | free_among_kings | halves lean; stability 0.05 |
| `the_republic_stands` | The Republic Stands | see list | add_spirit republic_stands |
| `question_of_the_east` (E9) | The Question of the East | see above | As E9 |

### Spirits

| Key | Name | Modifiers | Source |
| --- | --- | --- | --- |
| `tribunes_charter` | The Tribunes' Charter | stability_factor 0.03, political_power_gain 0.05 | the_tribunes_charter; replaced by red_banners |
| `red_banners` | The Red Banners | stability_factor 0.05, political_power_gain 0.05, drift_defence_factor 0.10 | the_red_banners_endure |
| `red_earth` | Red Earth Farms | monthly_population 0.05, stability_factor 0.02 | red_earth_farms |
| `republic_stands` | The Republic Stands | stability_factor 0.03, war_support_factor 0.03 | the_republic_stands |
| `red_militia` | The Militia of the Red Lands | army_core_defence_factor 0.10, conscription_factor 0.03 | the_militia_of_the_red_lands |
| copies | E4, E9 spirits | as the shared tree | copied modules |

### Events (namespace `zin_regional_avalon`)

| Id | Title | For | Fired by | Picture | Options (AI) |
| --- | --- | --- | --- | --- | --- |
| .1 | The Day of the Red Banners | Avalon | the_tribunes_republic | `generic_peace` | The towns keep the day they set up the republic (proposed 4A 1719). "A feast for every street" (stability 0.03) / "A march of the militia" (war_support 0.03). AI 60/40 |
| .2 | An Example to the East | Avalon | an_example_to_the_east | `generic_court` | Envoys from a neighbouring court ask how a republic keeps its wells. "Teach them" (political_power 25; Oreton opinion +10) / "Teach them nothing" (political_power 50). AI 60/40 |

---

## Implementation

### Builder and files (per tree)

The content builder's focus compiler, `tools/content/modules/focus_compiler.mjs` ([00_format_and_compiler.md](../00_format_and_compiler.md)), reads each tree's data file and writes these files in the builder's one transaction through the shared rewrite engine (`tools/content/apply.mts`). The builder resolves country names to tags at build time. Nothing is hand-edited.

| Path | Content |
| --- | --- |
| `docs/design/focus/regional_<name>.json` | Tree data, `"tier": "regional"`, `"countries": ["<Name>"]` |
| `common/national_focus/zin_regional_<name>.txt` | Compiled tree; its `country` block selects the owner, so the interim Long Peace tree no longer applies to it |
| `common/ideas/zin_focus_regional_<name>.txt` | The tree's spirits and the re-declared spirits of copied modules |
| `events/zin_regional_<name>.txt` | Namespace `zin_regional_<name>` (Drak has none) |
| `common/scripted_effects/zin_regional_<name>.txt`, `common/scripted_triggers/zin_regional_<name>.txt` | Alerhia and Drak only (tables above) |
| `common/ai_strategy/zin_regional_<name>.txt` | The startup strategies under AI, from the tree data's `ai_strategies` block |
| `localisation/english/zin_focus_regional_<name>_l_english.yml` | All text |

Names: `alerhia`, `miaed`, `erco`, `plutondo`, `drak`, `ostoroth`, `gondolin`, `mora`, `avalon`. Rulers are the characters spec's `<TAG>_zin_ruler` with the traits named in each Ruler section; these trees add no other characters.

### Copying modules

The tree data names each copied module: `"copy": [ { "from": "shared_east_lands", "module": "E4", "root_at": [14,1], "root_prerequisite": [["the_mountain_throne"]] } ]`. At build time the focus compiler reads `docs/design/focus/shared_east_lands.json`, takes every focus tagged with that module, gives it the tier B id, moves it by the root's offset, replaces the root's prerequisite and re-declares the module's spirits under the tree's prefix. The compiler then checks the whole tree as one (positions, prerequisites, icons). This is the regional `copy` extension of the compiler, shared with the Islands of the South trees; it needs the shared tree's focuses to carry their module tag (`"module": "E4"`).

### Current game state

All nine courts run the interim Long Peace tree today; their rulers carry generated names until the characters spec ships, and the game still starts in 1936 until the calendar spec ships. The trees call the eastern kings, Afrit, Stabilo and politics systems and copy the shared East Lands tree, so they are built in phase 6 after those mechanics (phase 3) and with the shared tree.

### Mechanic names used

`zin_east_add_lean`, `zin_east_add_road_influence`, `zin_east_wells_random`, `zin_east_claim_rift`, `zin_east_grant_free_cb`, `zin_east_question_open`, `zin_east_free_crown`, `zin_east_is_south_court`, `zin_east_faces_rift`, `zin_east_rift_talk`, `zin_east_coalition_member`, `zin_east_caravan_war`, `zin_east_turns_west`, `zin_east_pledged`, `zin_east_wells_unlocked`, `zin_east.35` (eastern kings); `zin_stabilo_add_debt`, `zin_stabilo_ledger_open` (Stabilo tree); `zin_afrit_add_footholds`, `zin_afrit_purge_houses`, `zin_afrit_add_veil`, `zin_afrit_suspicious` (Afrit); `zin_elves_goodwill` (elves); `zin_politics_add_drift` (politics); `zin_sun_heeded_south` (Lands of the Sun); the shared tree's effects and events.

### New shared names

| Name | Kind | Meaning | Reader |
| --- | --- | --- | --- |
| `zin_east_rift_ambition` | country flag | The court chose to lead the crossing of the rift (Alerhia's Lord of the Crossing; other trees may reuse it) | Eastern kings mechanic: coalition weight +15 (proposed row) |
| `zin_east_route_resist` | country flag | Resist route of a tier B or C court | Eastern kings mechanic (see the shared tree) |
| `zin_east_court_audit` | country flag | The court audited the temples | `zin_east.30` AI |

## AI

### Historical path (`zin_rules_is_historical`)

| Country | 4A 1748–1750 | 4A 1751–1754 | War of the Last Crowns |
| --- | --- | --- | --- |
| Alerhia | Rift Crown, Pilgrim Ports, Let the Roads Bid, wells, Welcome the Generous Friends | Customs, Rift Fleet, Ferries to Zilin; The Question of the Rift when the envoys speak of the rift | Lord of the Crossing (hist 60); most often the coalition's leader; crossing and turning west. E9 by weights |
| Miaed | Lord of the Passes, Tolls for All, wells, temples | Watch on the Far Marches; Scouts | Holds the passes; E9 by weights |
| Erco | Mountain Throne, Mines, Ore for the Pact | Mountain Forts, Masters of Iron | E9 by weights; rarely in the coalition |
| Plutondo | Prince's Court, The Many | A Seat in the Pact (joins Stabilo's faction if Stabilo accepts) | The Great Levy; E9 by weights |
| Drak | Martial Crown, Sword of the Pact | Debts and Due; The Old Seat if shown (Keep or Yield at equal weight) | Fights with the Pact if the Caravan War comes |
| Ostoroth | Highland Crown, Clan Moot, Friends at Furvior | Highland Companies | E9 by weights |
| Gondolin | Sea Crown, Northern Anchor, Harbours | Watch on the Northern Sea, Word to Furvior | The Dead on the Shore after `zin_zol_rising`; E9 by weights (refuses more often if Noris refuses) |
| Mora | Lake Republic, Free Elections, Ledgers of the Temples | The Council's Question; the inquiry rarely published | A Shield for the Lake; E9: refuses most often |
| Avalon | Tribunes' Republic, Free Charter, Owe No Prince | Citizen Levies | E9 by weights |

The tier B trees never decide alone who kneels. The Afrit spec's candidate rule (footholds 4 or more; its historical auto-accept of the two deepest candidates) and the mechanic's bias decide; the trees move footholds and bias within their caps.

### General notes

- No AI tier B court of this spec declares a war on its own before `zin_war_of_last_crowns`. Their war focuses need story flags.
- Under `zin_rule_ai_east` REFUSE_AFRIT or UNITE_WITHOUT_AFRIT, E9's pledge is weighted 0 and its resist route ×5; Alerhia's Lord of the Crossing is unchanged, because the coalition still forms.
- AI strategies at startup (tree data `ai_strategies`, proposed): Alerhia `befriend` Noris and Stabilo 5; Plutondo and Drak `befriend` Stabilo 15; Gondolin and Ostoroth `befriend` Noris 15; Mora `befriend` Ostoroth 10.

## Acceptance

1. The compiler builds the nine trees with 49, 41, 41, 41, 40, 40, 41, 40 and 40 focuses (copies expanded), unique positions, every focus below its prerequisites, every exclusive written on both focuses, days multiples of 7 and every icon and event picture in the catalog; Gondolin's coastal branches hide with `allow_branch` while it has no coast, and the tree still compiles. The HOI4 Agent Tools focus inspector and script validator pass on the staged files.
2. Each tree contains its copied modules with the tree's own ids and re-declared spirits; no focus id is shared with `shared_east_lands` or another tree; no localisation key is shared by a focus and an idea of the same tree.
3. Scan: on 1 Thaw 4A 1748 no focus available to any of the nine countries contains or calls a war, war goal, claim or cause.
4. Scan: lean, footholds and debt change only through `zin_east_add_lean`, `zin_afrit_add_footholds` and `zin_stabilo_add_debt`.
5. Scripted test: Drak's Old Seat branch is visible only while Drak owns a `zin_is_site_postondoroth` state; `yield_the_old_seat` transfers it to Stabilo.
6. No text names Afrit before `zin_afrit_revealed`; Mora's inquiry event and Miaed's scouts event make no charge and name no one (compiler secret scan; review).
7. Every modifier in the spirits tables exists in the 1.19.3 modifier documentation; every effect and trigger exists in the documentation or in a spec's scripted file.
8. One in-game year in the isolated Linux run from 1 Thaw 4A 1748 (historical rule): the nine trees load without errors in the log, no East Lands war starts, and Alerhia takes *The Rift Crown* and Plutondo *The Prince's Court* in 4A 1748.

## Open questions

All are owner questions already listed in [OPEN_QUESTIONS.md](../../OPEN_QUESTIONS.md) (regions: east, south isles, sun, 1 to 8); the work proceeds on the proposal given.

1. **Who kneels.** Works on: kneeling is decided per game by the Afrit spec's candidate rule; no court is fixed.
2. **Alerhia as coalition leader.** Works on: Alerhia, the Rift Crown, is the likeliest leader, with pilgrim ferries to the Zilin Hills.
3. **Gondolin's coast.** Works on: the coastal branches hide until the map gives Gondolin a coast.
4. **Postondoroth.** Works on: Drak's Old Seat branch stays as a fallback while Postondoroth lies in Drak.
5. **Avalon's revolution.** Works on: a revolt of 4A 1719 against a king who sold the wells (proposed); Avalon starts as a Wild freehold, as the roster has it.
6. **Mora's inquiry.** Works on: a small Light republic's own inquiry may make it suspicious of the temples and cost the veil 2 before the reveal.
7. **Ostoroth's place.** Works on: the eastern kings spec's north-east Lake Road.
