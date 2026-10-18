# Cold Lands regional focus trees

**Status:** Draft. **Priority:** 6. **Phase:** 6.

## Purpose

This spec gives the tier B countries of the Cold Lands their own focus trees: Isengard, Horidor, Windwaith, Fearno, Titanos and the Yeti Lands. Yeldenne is the seventh tier B country of the region; its tree is specified in [yeldenne.md](yeldenne.md) and is not repeated here. The other 23 Cold Lands countries use the shared tree [../shared/shared_cold_lands.md](../shared/shared_cold_lands.md). Coldor, the region's great power, has its own major tree ([../major/coldor.md](../major/coldor.md)).

Each tree makes its country play differently inside the [Cold Lands mechanic](../../04_mechanics/cold_lands.md): the lean between Fandanar and Isengard, Isengard's defiance, the Long Winters, the old pacts with the yeti and the giants, the Harbour Compact, the far north-west and the silent castle. Each tree also gives its country a course when the War of the Last Crowns breaks out far to the south.

| Country | Tree id | States | People | Stance at start | Focuses |
| --- | --- | ---: | --- | --- | ---: |
| Isengard | `regional_isengard` | 12 | men | `zin_dom_warlord` | 45 |
| Horidor | `regional_horidor` | 15 | men | `zin_wild_clans` | 32 |
| Windwaith | `regional_windwaith` | 12 | men | `zin_light_council` | 34 |
| Fearno | `regional_fearno` | 25 | men | `zin_wild_clans` | 37 |
| Titanos | `regional_titanos` | 8 | giants | `zin_wild_clans` | 30 |
| Yeti Lands | `regional_yeti_lands` | 22 | yeti | `zin_wild_clans` | 30 |
| Yeldenne | `regional_yeldenne` | 1 | men | `zin_light_wardens` | 36 (see [yeldenne.md](yeldenne.md)) |

## Lore basis

**Established** (vault: *Erdae and Its Regions*, *Peoples of Erdae*, *Great Powers and Relations*, *The Fourth Age of Erdae*, *Fourth Age Canon Register*):

- The Cold Lands lie in the north-west, reach off the west and north edges of the map and are the largest landmass. Coldor, Isengard, Horidor, the Yeti Lands and the Windwaith arm are there.
- Coldor leads the Northern Accord with Horidor; Isengard is Coldor's rival (working table).
- Titanos ice giants and the yeti are peoples of Erdae. Their rank, mortality and origin are open.
- Eindil wakes in the Cold Lands without memory; local tribes find and nurse him; West Lands travellers take him south.
- Horos keeps the Castle of Yeldenne in the Cold Lands.
- Aenoran voyages reached the Cold Lands in the First Age.

**Proposed** (vault proposals): Coldor's kings unite the frozen interior in 4A 850 and Isengard refuses; Eindil wakes early in 4A 1749; the tribes, yeti, giants and free towns live by trade, herding and hunting.

**Proposed by the specs this file builds on:** the rulers Warlord Ezhan Isenmar, Chieftain Ollon, Speaker Furla Hozen, Lord Esrom of Fearno, Frost-King Huk and Grumhal the Eldest ([characters](../../02_lore/02_characters.md)); lean, defiance, winters, pacts, the March Forts, the Harbour Compact and the Winter Moot ([cold lands mechanic](../../04_mechanics/cold_lands.md)).

**Proposed by this spec:** every focus, spirit, event and number below; the lieutenants and advisors named in each section; Isengard's oath-brothers; Horidor's Cairn Crown; Windwaith's Free Harbours and Council of Sails; Fearno's Free Steadings; the Giants' Toll roads and Frost-King's court; the Eldest's Fire of the yeti.

**Kept open (text never answers):** the exact place of Eindil's ice and of the Castle of Yeldenne; what yeti and giants are in the order of beings (text never calls them Great Folk, Common Folk or beasts); the Cold Lands' part in the final war (the vault is silent, so every war route here is play, never history). Before `zin_eindil_awake` no visible focus mentions a stranger or a sleeper in the ice. Before `zin_afrit_revealed` no text names Afrit.

## Design

### Conventions for every tree in this file

- **Ids.** Tree id `regional_<name>`; focus ids `zin_regional_<name>_<key>`; spirits `zin_regional_<name>_<key>`; events namespace `zin_regional_<name>`; characters `zin_regional_<name>_<person>`; tree-declared scripted effects and triggers `zin_regional_<name>_<verb>` (as the compiler spec requires). Spirit keys never repeat a focus key of the same tree.
- **Defaults.** Days 35 unless marked 70d. AI base 10 unless given. A focus has no `available` block unless one is given. Focus lines read: `key` **Name** (x,y) ← prerequisites: effects. "a, b" in prerequisites means a **or** b; "a + b" means a **and** b.
- **Shorthand.** **lean ±n self** is `call zin_cold_add_lean (n)` on ROOT; **lean ±n (Name)** is the same on that country; **lean ±n all** is `call zin_cold_add_lean_all (n)`; **lean ±n neighbours** is `call zin_shared_cold_lands_lean_neighbours (n)` (shared tree effect: every neighbouring country passing `zin_cold_is_clan_realm`); **defiance ±n** is `call zin_cold_add_defiance (n)`; **regard ±n** and **renown ±n** call `zin_eindil_add_regard` (on ROOT) and `zin_eindil_add_renown`; **LC +n** is `flag zin_lost_cause_member` plus `call zin_lost_cause_add_strength (n)`; **aid host {m, e}** is `call zin_eindil_aid_host {manpower m, equipment e}`; **join coalition** is `call zin_eindil_join_coalition`; **friend** is `check zin_eindil_friend`.
- **Historical factor.** "hist ×f" applies while `zin_cold_historical` is true (the region's rule is historical or `zin_rule_historical_path` is HISTORICAL).
- **Research.** Categories are the warfare spec's `zin_cat_*` (arms, bows, armour, mounts, kin, siege, walls, galleys, warships). `research {c} 0.5×1` is one 50 % bonus.
- **Equipment.** Warfare spec names: `zin_arms_equipment`, `zin_giant_gear_equipment`, `zin_yeti_gear_equipment`.
- **Building `where`.** `capital`, `random_owned`, `random_coastal`, or the site key `isengard_march` (`zin_is_site_isengard_march`, own side).

### Peace gates (all trees in this file)

| Kind of focus | Earliest |
| --- | --- |
| Any war goal or declaration | Isengard's *Iron Against the Crown*: the March Forts fought and (`zin_war_of_last_crowns` or `zin_gathering_dark` ≥ 40); never historical |
| The March Forts border war started by Isengard | the mechanic's `zin_cold_march_war_allowed` and defiance ≥ 80; never historical |
| Leaving a faction (Horidor) | not at war; never historical |
| Lost Cause membership | `zin_gathering_dark` ≥ 50, `zin_eindil_named` or `zin_zol_rising` |
| Joining Eindil's coalition | `zin_eindil_returned` and the country is his friend (regard ≥ 25) |

Everything available on 1 Thaw 4A 1748 is court, economy, forts, envoys, gifts and drill.

### Yeldenne

Yeldenne's tree (`regional_yeldenne`, 36 focuses) is specified in [yeldenne.md](yeldenne.md). The trees below touch it only through Yeldenne's existence (`the_castles_compact` of the Yeti Lands, `the_light_in_the_north` of Titanos) and through flavour. None of them seeks Glo, changes `zin_yeldenne_wards` or adds a guide flag to the journey's ambush formula.

---

## Isengard

**Tree** `regional_isengard` · 12 states · men · Dominion (`zin_dom_warlord`) · ruler **Warlord Ezhan Isenmar** (proposed, characters spec) · 45 focuses · grid x 0–22, y 0–8.

### Situation in 4A 1748

Isengard holds twelve states of iron hills and fortified valleys along Coldor's border. In 4A 850 the kings of Coldor brought the frozen interior under one crown; Isengard's hall refused, and it has kept its border forts manned ever since (proposed). Warlord Ezhan Isenmar rules through warband chiefs who boast of the refusal at every feast. His envoys bring salt, iron and winter grain to the clans along the march, and some of them now look to the Iron Hall rather than to Fandanar. Coldor and Isengard hold each other in open contempt (opinion "Cold Rivalry", −30 both ways), but nobody is at war, and no claim or war goal exists. Isengard's defiance (`zin_cold_isengard_defiance`) starts at 70.

### Role

- **Historical path (proposed):** Isengard keeps its forts, feeds and gifts the clans along the march, and refuses every approach from Fandanar. In 4A 1752 Coldor brings the rivalry to the March Forts, a border war (Coldor starts it under the historical rule). Its result sets Isengard's defiance. Isengard swears to the Accord only if its defiance falls to 30; otherwise the rivalry goes on to the end of the age.
- **War of the Last Crowns:** the vault is silent. Proposed historical course: Isengard holds the north and stands apart. Alternatives: send iron companies to the living (Lost Cause, then Eindil's coalition), or strike at a Coldor that looks south (gated, never historical).

### Court and characters

| Id | Name | Role | Source |
| --- | --- | --- | --- |
| `<Isengard tag>_zin_ruler` | Warlord Ezhan Isenmar | Country leader, `zin_dom_warlord` | characters spec (proposed) |
| `zin_regional_isengard_brana` | Brana of the Ninth Fort | Corps commander, skill 3, traits `unyielding_defender`, `winter_specialist`; recruited by *The Ninth Fort* | this spec (proposed) |
| `zin_regional_isengard_veska` | Veska the Gift-Giver | Political advisor, trait `zin_adv_envoy`; recruited by *The Gift-Giver* | this spec (proposed) |

Start spirit (country history): `refusal_of_850`.

### Tree

| Branch | Columns | Rows | Opens | Drives |
| --- | --- | --- | --- | --- |
| A. The Iron Hall | 0–4 | 0–3 | start | Political power, court spirits |
| B. The March Forts | 5–8 | 0–4 | start; war half gated | Forts on the march; the border war |
| C. Gifts to the Steadings | 9–12 | 0–4 | start | Lean toward Isengard; winter stores; guarantees |
| D. The Answer to Fandanar | 13–16 | 0–4 | start; exclusive | Defiance; the Accord or the free north |
| E. The Iron Hills | 17–19 | 0–3 | start | Industry |
| F. The Iron Host | 20–22 | 0–3 | start | Army |
| G. Beyond the March | 9–12 | 6–8 | `zin_war_of_last_crowns` | The final war |

**A. The Iron Hall.** The warlord's court and the memory of 850. Icons: `crown_iron`, `war_council_map`, `forge_anvil`, `fort_wall`.

- `the_iron_hall` **The Iron Hall** (2,0) 70d: political power 75; spirit `warlords_hall`. AI 100.
- `warband_chiefs` **The Warband Chiefs** (1,1) ← the_iron_hall: war support 0.03; political power 25.
- `the_old_refusal` **The Old Refusal** (3,1) ← the_iron_hall: defiance +5; stability 0.02; tooltip "In 850 the hall said no. It still says no." AI 15; hist ×2.
- `counsel_of_the_forges` **Counsel of the Forges** (0,2) ← warband_chiefs: political power 50.
- `law_of_the_hall` **Law of the Hall** (2,2) ← warband_chiefs, the_old_refusal: stability 0.05.
- `heirs_of_isenmar` **Heirs of Isenmar** (4,2) ← the_old_refusal: war support 0.02; army experience 5.
- `one_hall_many_forts` **One Hall, Many Forts** (2,3) 70d ← law_of_the_hall: swap spirit `warlords_hall` → `iron_crown`.

**B. The March Forts.** Forts on the border with Coldor and the border war. Icons: `fort_wall`, `pass_fort`, `eye_watchful`, `war_drums`.

- `man_the_march` **Man the March** (6,0): building bunker 1 `isengard_march`. AI 30.
- `count_the_stones` **Count the Stones** (5,1) ← man_the_march: army experience 5; research {zin_cat_walls} 0.5×1.
- `watchtowers_of_the_march` **Watchtowers of the March** (7,1) ← man_the_march: spirit `march_watch`.
- `the_ninth_fort` **The Ninth Fort** (6,2) 70d ← count_the_stones, watchtowers_of_the_march: building bunker 2 `isengard_march`; recruit `zin_regional_isengard_brana`.
- ★ `meet_them_at_the_forts` **Meet Them at the Forts** (5,3) ← the_ninth_fort. See key focuses.
- `stone_upon_stone` **Stone upon Stone** (6,3) ← the_ninth_fort: building bunker 1 capital; building bunker 1 random_owned.
- ★ `ride_to_the_forts` **Ride to the Forts** (7,3) ← the_ninth_fort. See key focuses.
- ★ `the_march_remembers` **The March Remembers** (6,4) ← meet_them_at_the_forts, ride_to_the_forts. See key focuses.

**C. Gifts to the Steadings.** Isengard's answer to the Accord: gifts, bread and promises to the clans along the march. Icons: `tribute_chest`, `granary`, `envoy`, `handshake_oath`.

- `winter_gifts` **Winter Gifts** (10,0): lean −5 neighbours; political power 25. AI 30.
- `the_gift_giver` **The Gift-Giver** (9,1) ← winter_gifts: recruit `zin_regional_isengard_veska`; political power 25.
- `salt_and_iron_for_the_clans` **Salt and Iron for the Clans** (11,1) ← winter_gifts: lean −5 neighbours.
- `granaries_of_the_hall` **Granaries of the Hall** (10,2) ← the_gift_giver, salt_and_iron_for_the_clans: flag `zin_cold_winter_stores`; stability 0.03.
- `hosts_at_the_winter_moot` **Hosts at the Winter Moot** (9,3) ← granaries_of_the_hall: lean −3 all; political power 25.
- ★ `oath_brothers` **Oath-Brothers of the March** (11,3) ← granaries_of_the_hall. See key focuses.
- `the_iron_halls_bread` **The Iron Hall's Bread** (10,4) ← hosts_at_the_winter_moot, oath_brothers: lean −5 neighbours; stability 0.03.

**D. The Answer to Fandanar.** Never kneel, or take a seat at Fandanar. Icons: `envoy`, `chain_broken`, `two_crowns`, `banner_league`.

- `envoys_from_fandanar` **The Envoys from Fandanar** (14,0): political power 25. AI 30.
- ★ `never_kneel` **Never Kneel** (13,1) ← envoys_from_fandanar; exclusive with a_seat_at_fandanar.
- ★ `a_seat_at_fandanar` **A Seat at Fandanar** (15,1) ← envoys_from_fandanar; exclusive with never_kneel.
- `the_free_north` **The Free North** (13,2) ← never_kneel: lean −5 neighbours; war support 0.03.
- `a_daughter_of_the_hall` **A Daughter of the Hall** (15,2) ← a_seat_at_fandanar: event `marriage_offer` to Coldor.
- ★ `iron_against_the_crown` **Iron Against the Crown** (13,3) ← the_free_north. See key focuses.
- ★ `under_the_accords_banner` **Under the Accord's Banner** (15,3) ← a_daughter_of_the_hall. See key focuses.
- `the_hall_unbowed` **The Hall Unbowed** (13,4) ← the_free_north: stability 0.05; political power 50.
- `kin_across_the_march` **Kin Across the March** (15,4) ← under_the_accords_banner: lean +5 all; stability 0.03.

**E. The Iron Hills.** Icons: `mine_cart`, `forge_anvil`, `roads_paved`.

- `iron_hills` **The Iron Hills** (18,0): building industrial_complex 1 capital. AI 25.
- `deep_shafts` **Deep Shafts** (17,1) ← iron_hills: building industrial_complex 1 random_owned.
- `forge_halls` **Forge-Halls** (19,1) ← iron_hills: building arms_factory 1 capital.
- `sledge_ways` **Sledge-Ways** (18,2) 70d ← deep_shafts, forge_halls: building infrastructure 1 random_owned, twice.
- `iron_for_the_forts` **Iron for the Forts** (18,3) ← sledge_ways: building arms_factory 1 random_owned; equipment zin_arms_equipment 500.

**F. The Iron Host.** Icons: `sword_shield`, `spear_levy`, `levy_muster`.

- `the_iron_host` **The Iron Host** (21,0): army experience 10. AI 20.
- `shield_wall_drill` **Shield-Wall Drill** (20,1) ← the_iron_host: research {zin_cat_armour} 0.5×1.
- `valley_spears` **Valley Spears** (22,1) ← the_iron_host: research {zin_cat_arms} 0.5×1.
- `heavy_hosts` **Heavy Hosts** (21,2) 70d ← shield_wall_drill, valley_spears: spirit `heavy_hosts_drilled`.
- `levy_of_the_valleys` **Levy of the Valleys** (21,3) ← heavy_hosts: manpower 8,000.

**G. Beyond the March.** Opens with the War of the Last Crowns. Icons: `banner_plain`, `fort_wall`, `lone_sword`.

- `beyond_the_march` **Beyond the March** (10,6): available `zin_war_of_last_crowns`; political power 50. AI 200.
- ★ `hold_the_north` **Hold the North** (9,7) ← beyond_the_march; exclusive with iron_for_the_living.
- ★ `iron_for_the_living` **Iron for the Living** (11,7) ← beyond_the_march; exclusive with hold_the_north.
- ★ `the_iron_companies_march` **The Iron Companies March South** (11,8) ← iron_for_the_living.

### Key focuses

| Key | Name | Prerequisites | Effects summary |
| --- | --- | --- | --- |
| `meet_them_at_the_forts` | Meet Them at the Forts | the_ninth_fort | Available: `check zin_regional_isengard_march_war_running` (the March Forts border war is running). Timed spirit `forts_hold` 120 days. AI 100 |
| `ride_to_the_forts` | Ride to the Forts | the_ninth_fort | Available: `variable zin_cold_isengard_defiance above 79`; `check zin_cold_march_war_allowed`; not at war; not `zin_cold_historical`. `call zin_cold_start_march_war`. AI 5; hist ×0 |
| `the_march_remembers` | The March Remembers | meet_them_at_the_forts, ride_to_the_forts | Available: `check zin_regional_isengard_march_fought`. War support 0.05; army experience 10; tooltip "Whatever the forts cost, the hall still stands." |
| `oath_brothers` | Oath-Brothers of the March | granaries_of_the_hall | Available: `check zin_regional_isengard_has_oath_brothers`. `call zin_regional_isengard_guarantee_oath_brothers` (guarantees every neighbouring clan realm with lean ≤ −40; event `iron_halls_promise` to each). AI 15; hist ×0 |
| `never_kneel` | Never Kneel | envoys_from_fandanar | Exclusive with a_seat_at_fandanar. Defiance +10; spirit `never_kneel_oath`. AI 50; hist ×10 |
| `a_seat_at_fandanar` | A Seat at Fandanar | envoys_from_fandanar | Exclusive with never_kneel. Defiance −15; stability 0.05. AI 30, ×2 at defiance ≤ 50; hist ×0 |
| `iron_against_the_crown` | Iron Against the Crown | the_free_north | Available: `check zin_regional_isengard_march_fought`; `global_flag zin_war_of_last_crowns` or `variable zin_gathering_dark above 39`; Coldor exists; not at war. `call zin_regional_isengard_wargoal_march` (a `take_state_focus` war goal on each Coldor state with `zin_is_site_isengard_march`); war support 0.05. AI 10, ×3 while Coldor is at war outside the Cold Lands; hist ×0 |
| `under_the_accords_banner` | Under the Accord's Banner | a_daughter_of_the_hall | Available: `global_flag zin_cold_isengard_sworn`. Political power 100; stability 0.05. AI 100 |
| `hold_the_north` | Hold the North | beyond_the_march | Exclusive with iron_for_the_living. Spirit `the_north_held`. AI 40; hist ×100 |
| `iron_for_the_living` | Iron for the Living | beyond_the_march | Exclusive with hold_the_north. Available: `variable zin_gathering_dark above 49` or `global_flag zin_eindil_named`. LC +3. AI 20, ×2 if regard ≥ 25; hist ×0 |
| `the_iron_companies_march` | The Iron Companies March South | iron_for_the_living | Available: `global_flag zin_eindil_returned`; friend. Aid host {3000, zin_arms_equipment 500}; join coalition. AI 100 |

### Spirits

| Key | Name | Modifiers | Added / removed |
| --- | --- | --- | --- |
| `refusal_of_850` | The Refusal of 850 | `war_support_factor` 0.05, `army_core_defence_factor` 0.05, `trade_opinion_factor` −0.10 | Start (history); permanent |
| `warlords_hall` | The Warlord's Hall | `political_power_gain` 0.10 | *The Iron Hall*; swapped by *One Hall, Many Forts* |
| `iron_crown` | The Iron Crown of Isengard | `political_power_gain` 0.15, `stability_factor` 0.05 | *One Hall, Many Forts* |
| `march_watch` | Watch on the March | `army_intel_factor` 0.10, `dig_in_speed_factor` 0.10 | *Watchtowers of the March* |
| `forts_hold` | The Forts Hold | `army_defence_factor` 0.15, `army_core_defence_factor` 0.10 | *Meet Them at the Forts*, 120 days |
| `never_kneel_oath` | Never Kneel | `war_support_factor` 0.05, `drift_defence_factor` 0.15, `stability_factor` −0.02 | *Never Kneel*; removed if Isengard swears to the Accord |
| `heavy_hosts_drilled` | The Heavy Hosts | `army_defence_factor` 0.05, `army_org_factor` 0.05 | *Heavy Hosts* |
| `the_north_held` | The North Held | `stability_factor` 0.05, `army_core_defence_factor` 0.10 | *Hold the North* |

### Events (namespace `zin_regional_isengard`)

| Id | Key | Title | To | Trigger | Options |
| --- | --- | --- | --- | --- | --- |
| 1 | `marriage_offer` | A Daughter of the Iron Hall | Coldor | *A Daughter of the Hall* | **Accept the match** (AI 70): Isengard defiance −10; opinion modifier `zin_regional_isengard_marriage` (+20) both ways. **Decline**: Isengard defiance +5 |
| 2 | `iron_halls_promise` | The Iron Hall Stands Behind Us | each guaranteed clan realm | *Oath-Brothers of the March* | One option: lean −5 self. Text: the warlord's envoy swears that no crown will take their steading |

Mechanic events that reach Isengard (`zin_cold.30` charter, `.31` Isengard rides to the forts, `.32` news, `.33` marriage, `.12` raiders) are owned by the mechanic.

### Historical AI route

| Period | Focuses |
| --- | --- |
| 1748 | the_iron_hall, man_the_march, envoys_from_fandanar, winter_gifts, iron_hills |
| 1749 | never_kneel, warband_chiefs, the_old_refusal, count_the_stones, watchtowers_of_the_march, the_gift_giver |
| 1750 | the_ninth_fort, salt_and_iron_for_the_clans, granaries_of_the_hall, the_free_north, law_of_the_hall |
| 1751 | hosts_at_the_winter_moot, the_iron_halls_bread, stone_upon_stone, deep_shafts, forge_halls, the_iron_host |
| 1752 | meet_them_at_the_forts (during the March Forts), the_march_remembers, one_hall_many_forts |
| 1753–1754 | the_hall_unbowed, sledge_ways, iron_for_the_forts, shield_wall_drill, valley_spears, heavy_hosts |
| 1755 | beyond_the_march, hold_the_north |
| 1756–1760 | leftovers; under_the_accords_banner and kin_across_the_march only if Isengard has sworn |

The AI never takes `a_seat_at_fandanar`, `ride_to_the_forts`, `oath_brothers`, `iron_against_the_crown` or `iron_for_the_living` on the historical path.

---

## Horidor

**Tree** `regional_horidor` · 15 states · men · Wild (`zin_wild_clans`) · ruler **Chieftain Ollon** (proposed, characters spec) · 32 focuses · grid x 0–18, y 0–8.

### Situation in 4A 1748

Horidor is a highland kingdom of fifteen states east of the frozen interior: high pastures, cairn roads and passes held by clan chiefs who meet at a moot under Chieftain Ollon. It is Coldor's partner in the Northern Accord (working table) and leans strongly to Fandanar (lean 60). Horidor sees the Accord as a league of equals, not a crown, and some chiefs grumble that Fandanar speaks for them abroad. The valleys around Horidor remain independent (roster), and Horidor's herdsmen trade with them freely. The highlands are at peace.

### Role

- **Historical path (proposed):** Horidor stays in the Accord, helps Coldor court the valleys, and keeps its own moot. It takes no side in the March Forts, a border war between Coldor and Isengard alone.
- **War of the Last Crowns:** it stands with Fandanar. If Coldor sends the White Companies, Horidor's highlanders may ride with them (play, not history).

### Court and characters

| Id | Name | Role | Source |
| --- | --- | --- | --- |
| `<Horidor tag>_zin_ruler` | Chieftain Ollon | Country leader, `zin_wild_clans` | characters spec (proposed) |
| `zin_regional_horidor_maela` | Maela Highcairn | Corps commander, skill 3, traits `trait_mountaineer`, `hill_fighter`; recruited by *High-Pass Scouts* | this spec (proposed) |
| `zin_regional_horidor_tarvo` | Old Tarvo, Keeper of the Cairns | Political advisor, trait `zin_adv_elder`; recruited by *Ollon's Hearth* | this spec (proposed) |

Start spirit (country history): `chiefs_of_the_cairns`.

### Tree

| Branch | Columns | Rows | Opens | Drives |
| --- | --- | --- | --- | --- |
| A. The Highland Moot | 0–3 | 0–3 | start | Court |
| B. The Accord Question | 4–8 | 0–4 | start; exclusive | Lean; the Accord's shield or the Cairn Crown |
| C. Herds and Passes | 9–12 | 0–3 | start | Economy; winter stores |
| D. The Highland Host | 13–15 | 0–3 | start | Army |
| E. Neighbours of the High Snows | 16–18 | 0–2 | start | Lean on the valleys |
| F. When the South Burns | 4–8 | 6–8 | `zin_war_of_last_crowns` or `zin_western_crossing` | The final war |

**A. The Highland Moot.** Icons: `council_table`, `rune_stone`, `feast_table`.

- `highland_moot` **The Highland Moot** (1,0): political power 50. AI 100.
- `voices_of_the_cairns` **Voices of the Cairns** (0,1) ← highland_moot: stability 0.03.
- `ollons_hearth` **Ollon's Hearth** (2,1) ← highland_moot: recruit `zin_regional_horidor_tarvo`; political power 25.
- `the_chiefs_grumble` **The Chiefs Grumble** (1,2) ← voices_of_the_cairns, ollons_hearth: event `chiefs_grumble`.
- `one_moot_one_voice` **One Moot, One Voice** (1,3) 70d ← the_chiefs_grumble: swap spirit `chiefs_of_the_cairns` → `highland_moot_united`.

**B. The Accord Question.** Icons: `banner_league`, `handshake_oath`, `crown_iron`, `envoy`.

- `the_accord_question` **The Accord Question** (6,0): political power 25. AI 30.
- ★ `shield_of_the_accord` **Shield of the Accord** (5,1) ← the_accord_question; exclusive with the_highland_crown.
- ★ `the_highland_crown` **The Highland Crown** (7,1) ← the_accord_question; exclusive with shield_of_the_accord.
- `highland_envoys` **Highland Envoys** (5,2) ← shield_of_the_accord: lean +5 neighbours.
- `accord_war_council` **The Accord's War Council** (5,3) ← highland_envoys: available `check zin_regional_horidor_in_accord`; army experience 10; Coldor army experience 5.
- `two_banners` **Two Banners, One March** (5,4) 70d ← accord_war_council: spirit `two_banners_raised`.
- `our_own_hearth` **Our Own Hearth** (7,2) ← the_highland_crown: spirit `own_hearth`; stability 0.05.
- `king_of_the_cairns` **King of the Cairns** (7,3) ← our_own_hearth: `call zin_politics_add_drift {ideology dominion, value 10}`; political power 50.
- ★ `the_cairn_crown` **The Cairn Crown** (7,4) 70d ← king_of_the_cairns.

**C. Herds and Passes.** Icons: `herds`, `roads_paved`, `quarry_stone`, `granary`.

- `highland_herds` **Herds of the High Pastures** (10,0): building industrial_complex 1 capital. AI 25.
- `the_cairn_roads` **The Cairn Roads** (9,1) ← highland_herds: building infrastructure 1 random_owned.
- `wool_and_hide` **Wool and Hide** (11,1) ← highland_herds: spirit `wool_and_hide_trade`.
- `granite_and_iron` **Granite and Iron** (10,2) ← the_cairn_roads, wool_and_hide: building industrial_complex 1 random_owned.
- `highland_stores` **Highland Stores** (10,3) ← granite_and_iron: flag `zin_cold_winter_stores`; stability 0.03.

**D. The Highland Host.** Icons: `spear_levy`, `scout_lantern`, `fort_wall`.

- `clan_levies` **The Clan Levies** (14,0): manpower 5,000. AI 20.
- `cairn_wardens` **Cairn Wardens** (13,1) ← clan_levies: research {zin_cat_arms} 0.5×1.
- `high_pass_scouts` **High-Pass Scouts** (15,1) ← clan_levies: recruit `zin_regional_horidor_maela`; spirit `pass_scouts`.
- `the_highland_host` **The Highland Host** (14,2) 70d ← cairn_wardens, high_pass_scouts: army experience 15; spirit `highland_host`.
- `hill_forts` **Hill Forts** (14,3) ← the_highland_host: building bunker 1 capital; building bunker 1 random_owned.

**E. Neighbours of the High Snows.** Icons: `envoy`, `market_stalls`, `eye_watchful`.

- `the_independent_valleys` **The Independent Valleys** (17,0): lean +3 neighbours; political power 25.
- `watch_on_isengard` **A Watch on Isengard** (16,1) ← the_independent_valleys: available Isengard exists; building bunker 1 random_owned.
- `markets_for_the_valleys` **Markets for the Valleys** (18,1) ← the_independent_valleys: spirit `valley_markets`.
- `a_seat_at_the_moot_fire` **A Seat at the Moot Fire** (17,2) ← watch_on_isengard, markets_for_the_valleys: lean +3 neighbours; stability 0.03.

**F. When the South Burns.** Icons: `banner_plain`, `banner_league`, `lone_sword`.

- `when_the_south_burns` **When the South Burns** (6,6): available `zin_war_of_last_crowns` or `zin_western_crossing`; political power 50. AI 200.
- `stand_with_fandanar` **Stand with Fandanar** (5,7) ← when_the_south_burns; exclusive with ride_with_the_white_companies: spirit `beside_fandanar`. AI 40; hist ×100.
- ★ `ride_with_the_white_companies` **Ride with the White Companies** (7,7) ← when_the_south_burns; exclusive with stand_with_fandanar.
- `highlanders_beside_the_heir` **Highlanders Beside the Heir** (7,8) ← ride_with_the_white_companies: available `zin_eindil_returned`, friend; aid host {2000, zin_arms_equipment 400}; join coalition. AI 100.

### Key focuses

| Key | Name | Prerequisites | Effects summary |
| --- | --- | --- | --- |
| `shield_of_the_accord` | Shield of the Accord | the_accord_question | Exclusive with the_highland_crown. Lean +10 self; spirit `accord_shield`; Coldor political power 25. AI 60; hist ×10 |
| `the_highland_crown` | The Highland Crown | the_accord_question | Exclusive with shield_of_the_accord. Available: not at war. `call zin_regional_horidor_leave_accord`; lean −40 self. AI 5; hist ×0 |
| `the_cairn_crown` | The Cairn Crown | king_of_the_cairns | Government `dominion`; `call zin_politics_set_stance {stance zin_dom_crown}`; stability 0.05. Chieftain Ollon becomes king (rename in localisation through `zin_name_horidor_cairn_king`). AI 10 |
| `ride_with_the_white_companies` | Ride with the White Companies | when_the_south_burns | Exclusive with stand_with_fandanar. Available: Coldor has flag `zin_cold_route_companies`, or `variable zin_gathering_dark above 49`. LC +3. AI 20, ×5 if Coldor took the White Companies; hist ×0 |

### Spirits

| Key | Name | Modifiers | Added / removed |
| --- | --- | --- | --- |
| `chiefs_of_the_cairns` | Chiefs of the Cairns | `political_power_gain` −0.05, `army_morale_factor` 0.05 | Start (history); swapped by *One Moot, One Voice* |
| `highland_moot_united` | One Moot, One Voice | `political_power_gain` 0.10, `stability_factor` 0.05 | *One Moot, One Voice* |
| `accord_shield` | Shield of the Accord | `army_core_defence_factor` 0.05, `stability_factor` 0.03 | *Shield of the Accord*; removed if Horidor leaves the Accord |
| `two_banners_raised` | Two Banners, One March | `army_org_factor` 0.05, `army_defence_factor` 0.05 | *Two Banners, One March* |
| `own_hearth` | Our Own Hearth | `drift_defence_factor` 0.20, `stability_factor` 0.03 | *Our Own Hearth* |
| `wool_and_hide_trade` | Wool and Hide | `winter_attrition_factor` −0.10 | *Wool and Hide* |
| `pass_scouts` | High-Pass Scouts | `army_speed_factor` 0.03, `army_intel_factor` 0.10 | *High-Pass Scouts* |
| `highland_host` | The Highland Host | `army_attack_factor` 0.05, `army_org_factor` 0.05 | *The Highland Host* |
| `valley_markets` | Markets for the Valleys | `trade_opinion_factor` 0.10, `consumer_goods_factor` −0.02 | *Markets for the Valleys* |
| `beside_fandanar` | Beside Fandanar | `stability_factor` 0.05, `war_support_factor` −0.05 | *Stand with Fandanar* |

### Events (namespace `zin_regional_horidor`)

| Id | Key | Title | To | Trigger | Options |
| --- | --- | --- | --- | --- | --- |
| 1 | `chiefs_grumble` | The Chiefs Grumble | Horidor | *The Chiefs Grumble* | **"Fandanar speaks for friends."** (AI 60, hist ×3): lean +5 self; stability 0.02. **"The moot speaks for itself."**: lean −5 self; political power 25 |

### Historical AI route

| Period | Focuses |
| --- | --- |
| 1748 | highland_moot, the_accord_question, highland_herds, clan_levies |
| 1749 | shield_of_the_accord, voices_of_the_cairns, ollons_hearth, the_cairn_roads |
| 1750 | highland_envoys, the_chiefs_grumble, wool_and_hide, granite_and_iron |
| 1751 | accord_war_council, one_moot_one_voice, highland_stores, cairn_wardens |
| 1752–1754 | two_banners, high_pass_scouts, the_highland_host, the_independent_valleys, markets_for_the_valleys, hill_forts |
| 1755 | when_the_south_burns, stand_with_fandanar |
| 1756–1760 | leftovers |

The AI never takes `the_highland_crown` or its children, or `ride_with_the_white_companies`, on the historical path.

---

## Windwaith

**Tree** `regional_windwaith` · 12 states · men · Light (`zin_light_council`, elections every 48 months) · ruler **Speaker Furla Hozen** (proposed, characters spec) · 34 focuses · grid x 0–19, y 0–9.

### Situation in 4A 1748

Windwaith holds the long western arm of the Cold Lands: twelve states of fjord harbours, fishing towns, sealing camps and timber slopes. A Council of Sails (proposed), chosen by the harbour guilds and the inland freeholders, sends Speaker Furla Hozen to speak for it. Windwaith lives by the carrying trade to the West Lands and Triton's Islands and competes with Coldor's western ports. It leans slightly away from Fandanar (lean −5). Its old fishermen tell of black ships far to the north; nobody else believes them. It is at peace.

### Role

- **Historical path (proposed):** Windwaith refuses Coldor's Harbour Compact and keeps its harbours free. From 4A 1753 it sells hulls to the West's Ford Council. Its harbours are one of the Cold Lands west-coast ports that Lorien's ship may call at in 4A 1753 (journey stage 6).
- **War of the Last Crowns:** Windwaith keeps its sails neutral. Alternatives: sail for the living (Lost Cause, convoys to Eindil's host) or harden the coast if Zol's dead rise.

### Court and characters

| Id | Name | Role | Source |
| --- | --- | --- | --- |
| `<Windwaith tag>_zin_ruler` | Speaker Furla Hozen | Country leader, `zin_light_council` | characters spec (proposed) |
| `zin_regional_windwaith_tamsin` | Captain Tamsin Gale | Navy leader, skill 3, traits `blue_water_expert`, `spotter`; recruited by *Sea-Wardens* | this spec (proposed) |
| `zin_regional_windwaith_odo` | Harbour-Warden Odo Fenn | Political advisor, trait `zin_adv_merchant_prince`; recruited by *The Carrying Trade* | this spec (proposed) |

Start spirit (country history): `sails_council`.

### Tree

| Branch | Columns | Rows | Opens | Drives |
| --- | --- | --- | --- | --- |
| A. The Council of Sails | 0–3 | 0–3 | start | Court, elections |
| B. The Windward Harbours | 4–8 | 0–5 | start; exclusive | Trade; Harbour Compact or Free Harbours; hulls for the West |
| C. The Shipwrights of the Arm | 9–12 | 0–3 | start | Navy |
| D. The Cold Sea Watch | 13–16 | 0–3 | start; one focus needs `zin_zol_rising` | Coast watch; fishermen's tales; a harbour for strangers |
| E. Sails in the Great War | 4–8 | 7–9 | `zin_war_of_last_crowns` or `zin_western_crossing` | The final war |
| F. The Harbour Levy | 17–19 | 0–2 | start | Army |

**A. The Council of Sails.** Icons: `council_table`, `guild_hall`, `farm_sowing`, `charter_free`.

- `council_of_sails` **The Council of Sails** (1,0): political power 50. AI 100.
- `harbour_guilds` **The Harbour Guilds** (0,1) ← council_of_sails: political power 25.
- `inland_freeholders` **The Inland Freeholders** (2,1) ← council_of_sails: stability 0.03.
- `the_speakers_seat` **The Speaker's Seat** (1,2) ← harbour_guilds, inland_freeholders: event `speakers_vote`.
- `open_council_rolls` **Open Council Rolls** (1,3) 70d ← the_speakers_seat: swap spirit `sails_council` → `windward_council`.

**B. The Windward Harbours.** Icons: `harbour_lake`, `fishing_boats`, `market_stalls`, `lighthouse`, `shipwright_yard`, `sea_charts`.

- `windward_harbours` **The Windward Harbours** (6,0): building naval_base 1 random_coastal. AI 30.
- `fish_and_seal` **Fish and Seal** (5,1) ← windward_harbours: spirit `fish_and_seal_trade`.
- `the_carrying_trade` **The Carrying Trade** (7,1) ← windward_harbours: recruit `zin_regional_windwaith_odo`; political power 25.
- `terms_from_fandanar` **Terms from Fandanar** (6,2) ← fish_and_seal, the_carrying_trade: political power 25; tooltip "Fandanar's harbour-masters want a share of our trade."
- ★ `a_harbour_compact` **A Harbour Compact** (5,3) ← terms_from_fandanar; exclusive with free_harbours.
- ★ `free_harbours` **Free Harbours** (7,3) ← terms_from_fandanar; exclusive with a_harbour_compact.
- `shared_lighthouses` **Shared Lighthouses** (5,4) ← a_harbour_compact: available Windwaith has idea `zin_cold_harbour_compact`; building naval_base 1 random_coastal; lean +5 self.
- ★ `hulls_for_the_west` **Hulls for the West** (7,4) ← free_harbours.
- `charts_and_soundings` **Charts and Soundings** (6,5) ← shared_lighthouses, hulls_for_the_west: navy experience 10; research {zin_cat_galleys} 0.5×1.

**C. The Shipwrights of the Arm.** Icons: `shipwright_yard`, `galley_oars`, `warship_sail`.

- `shipwrights_of_the_arm` **Shipwrights of the Arm** (10,0): building dockyard 1 random_coastal. AI 20.
- `war_galleys` **War Galleys** (9,1) ← shipwrights_of_the_arm: research {zin_cat_galleys} 0.5×1.
- `sea_wardens` **Sea-Wardens** (11,1) ← shipwrights_of_the_arm: recruit `zin_regional_windwaith_tamsin`; navy experience 10.
- `the_long_hulls` **The Long Hulls** (10,2) 70d ← war_galleys, sea_wardens: building dockyard 1 random_coastal; research {zin_cat_warships} 0.5×1.
- `the_windward_squadron` **The Windward Squadron** (10,3) ← the_long_hulls: spirit `windward_squadron`.

**D. The Cold Sea Watch.** Icons: `lighthouse`, `black_isles`, `beacon`, `compass_rose`.

- `the_cold_sea_watch` **The Cold Sea Watch** (14,0): building coastal_bunker 1 random_coastal.
- `hear_the_fishermen` **Hear the Fishermen** (13,1) ← the_cold_sea_watch: flag `zin_regional_windwaith_heard_fishermen`; navy experience 5; tooltip "Black ships in the north, the old men say. Nobody else believes them."
- `lighthouses_of_the_arm` **Lighthouses of the Arm** (15,1) ← the_cold_sea_watch: spirit `arm_lights`.
- ★ `harbour_for_strangers` **A Harbour for Strangers** (14,2) ← hear_the_fishermen, lighthouses_of_the_arm.
- `against_the_black_water` **Against the Black Water** (13,3) ← hear_the_fishermen: available `zin_zol_rising`; building coastal_bunker 1 random_coastal, twice; spirit `black_water_watch`. AI 100.
- `pilots_of_the_cold_coast` **Pilots of the Cold Coast** (15,3) ← lighthouses_of_the_arm: navy experience 10; research {zin_cat_galleys} 0.5×1.

**E. Sails in the Great War.** Icons: `warship_sail`, `ship_voyage`, `banner_league`.

- `when_the_south_burns` **When the South Burns** (6,7): available `zin_war_of_last_crowns` or `zin_western_crossing`; political power 50. AI 200.
- `neutral_sails` **Neutral Sails** (5,8) ← when_the_south_burns; exclusive with sails_for_the_living: spirit `sails_neutral`. AI 40; hist ×100.
- ★ `sails_for_the_living` **Sails for the Living** (7,8) ← when_the_south_burns; exclusive with neutral_sails.
- `the_free_harbours_endure` **The Free Harbours Endure** (5,9) ← neutral_sails: available `zin_afrit_dead` or `zin_eindil_crowned`; political power 50; stability 0.05.
- `convoys_to_the_heir` **Convoys to the Heir** (7,9) ← sails_for_the_living: available `zin_eindil_returned`, friend; aid host {1000, zin_arms_equipment 500}; join coalition. AI 100.

**F. The Harbour Levy.** Icons: `levy_muster`, `sword_shield`, `bow_archers`.

- `harbour_militia` **The Harbour Militia** (18,0): manpower 3,000.
- `sea_soldiers` **Sea Soldiers** (17,1) ← harbour_militia: spirit `sea_soldiers_drilled`.
- `coast_bows` **Bows of the Coast** (19,1) ← harbour_militia: research {zin_cat_bows} 0.5×1.
- `the_windward_host` **The Windward Host** (18,2) 70d ← sea_soldiers, coast_bows: army experience 10; manpower 3,000.

### Key focuses

| Key | Name | Prerequisites | Effects summary |
| --- | --- | --- | --- |
| `a_harbour_compact` | A Harbour Compact | terms_from_fandanar | Exclusive with free_harbours. Available: Coldor exists; Windwaith lacks idea `zin_cold_harbour_compact`. Event `compact_offer` to Coldor. AI 30, ×2 at lean ≥ 0; hist ×0 |
| `free_harbours` | Free Harbours | terms_from_fandanar | Exclusive with a_harbour_compact. Spirit `harbours_free`; lean −10 self; flag `zin_regional_windwaith_free_harbours` (the mechanic's `zin_cold.71` AI then refuses). AI 50; hist ×5 |
| `hulls_for_the_west` | Hulls for the West | free_harbours | Available `global_flag zin_west_council`. `call zin_west_add_fleet (3)`; political power 50. AI 30; hist ×3 |
| `harbour_for_strangers` | A Harbour for Strangers | hear_the_fishermen, lighthouses_of_the_arm | Flag `zin_eindil_safe_harbour` (proposed journey hook: in stage 6 ports of call, the AI weight of *Resupply the ship* ×2 under the dynamic rule; no effect under the historical rule); stability 0.02. Text speaks only of honest sailors. AI 15 |
| `sails_for_the_living` | Sails for the Living | when_the_south_burns | Exclusive with neutral_sails. Available: `variable zin_gathering_dark above 49` or `global_flag zin_eindil_named`. LC +3. AI 20, ×2 if regard ≥ 25; hist ×0 |

### Spirits

| Key | Name | Modifiers | Added / removed |
| --- | --- | --- | --- |
| `sails_council` | The Council of Sails | `trade_opinion_factor` 0.10, `consumer_goods_factor` −0.02 | Start (history); swapped by *Open Council Rolls* |
| `windward_council` | The Council of the Windward Coast | `political_power_gain` 0.10, `stability_factor` 0.05, `trade_opinion_factor` 0.10 | *Open Council Rolls* |
| `fish_and_seal_trade` | Fish and Seal | `consumer_goods_factor` −0.02, `stability_factor` 0.02 | *Fish and Seal* |
| `harbours_free` | Free Harbours | `trade_opinion_factor` 0.10, `naval_speed_factor` 0.05 | *Free Harbours* |
| `windward_squadron` | The Windward Squadron | `navy_org_factor` 0.05, `naval_detection` 0.10 | *The Windward Squadron* |
| `arm_lights` | Lighthouses of the Arm | `naval_detection` 0.10, `spotting_chance` 0.05 | *Lighthouses of the Arm* |
| `black_water_watch` | Against the Black Water | `coastal_bunker_effectiveness_factor` 0.15, `army_core_defence_factor` 0.05 | *Against the Black Water* |
| `sails_neutral` | Neutral Sails | `consumer_goods_factor` −0.02, `stability_factor` 0.03 | *Neutral Sails* |
| `sea_soldiers_drilled` | Sea Soldiers | `amphibious_invasion` 0.10, `army_morale_factor` 0.03 | *Sea Soldiers* |

### Events (namespace `zin_regional_windwaith`)

| Id | Key | Title | To | Trigger | Options |
| --- | --- | --- | --- | --- | --- |
| 1 | `speakers_vote` | The Council of Sails Votes | Windwaith | *The Speaker's Seat* | **The harbours carry the vote** (AI 60): political power 50. **The steadings carry the vote**: stability 0.03; lean +5 self |
| 2 | `compact_offer` | Windwaith Asks for Terms | Coldor | *A Harbour Compact* | **Agree the compact** (AI 80): both get the mechanic's `zin_cold_harbour_compact`; Windwaith lean +20. **Refuse**: Windwaith lean −10 |

The mechanic's `zin_cold.71` (*The Windwaith Question*, from Coldor's tree) may reach Windwaith first; it applies the same spirit. Once either compact path or `free_harbours` is taken, the other source does nothing (the focus is unavailable when the idea is present; `zin_cold.71` reads the flag).

### Historical AI route

| Period | Focuses |
| --- | --- |
| 1748 | council_of_sails, windward_harbours, shipwrights_of_the_arm, the_cold_sea_watch |
| 1749 | harbour_guilds, inland_freeholders, fish_and_seal, the_carrying_trade, war_galleys |
| 1750 | terms_from_fandanar, free_harbours, the_speakers_seat, hear_the_fishermen, lighthouses_of_the_arm |
| 1751–1752 | open_council_rolls, sea_wardens, the_long_hulls, harbour_militia, sea_soldiers |
| 1753–1754 | hulls_for_the_west (once the Ford Council sits), charts_and_soundings, the_windward_squadron, pilots_of_the_cold_coast |
| 1755 | when_the_south_burns, neutral_sails; against_the_black_water when `zin_zol_rising` is set |
| 1756–1760 | the_free_harbours_endure (after `zin_afrit_dead`), leftovers |

The AI never takes `a_harbour_compact`, `harbour_for_strangers` or `sails_for_the_living` on the historical path.

---

## Fearno

**Tree** `regional_fearno` · 25 states · men · Wild (`zin_wild_clans`) · ruler **Lord Esrom of Fearno** (proposed, characters spec) · 37 focuses · grid x 0–19, y 0–8.

### Situation in 4A 1748

Fearno is the largest free realm of the Cold Lands: twenty-five states of pine forest, fur country and hill iron, held by a hall of many lords under Lord Esrom. It bowed neither to the Winter Crown nor to the Iron Hall; distance, forest and pride kept it apart (proposed). Fearno trades furs and timber with both Fandanar and Isengard, and its lean sits at 0. Its hunters range far to the north and tell of a silent castle and a green light that no traveller reaches (the flavour event *The Silent Castle* reaches Fearno too). Fearno is at peace and means to stay its own.

### Role

- **Historical path (proposed):** Fearno stays a lord among lords: friendly to both crowns, bound to neither. It answers Coldor's *Fandanar Asks for Friendship* (`zin_coldor.2`) by its lean.
- **War of the Last Crowns:** Fearno keeps to its snows. Alternatives: its hunters ride south for the living (play).
- **Third pole (alternative):** *The Free Steadings* gathers clan realms that want neither crown into a league led by Fearno.

### Court and characters

| Id | Name | Role | Source |
| --- | --- | --- | --- |
| `<Fearno tag>_zin_ruler` | Lord Esrom of Fearno | Country leader, `zin_wild_clans` | characters spec (proposed) |
| `zin_regional_fearno_hroth` | Huntmaster Hroth Vael | Corps commander, skill 3, traits `winter_specialist`, `ambusher`; recruited by *The Huntmaster* | this spec (proposed) |
| `zin_regional_fearno_ilse` | Steward Ilse Morrow | Political advisor, trait `zin_adv_treasurer`; recruited by *The Lords of Fearno* | this spec (proposed) |

Start spirit (country history): `proud_fearno`.

### Tree

| Branch | Columns | Rows | Opens | Drives |
| --- | --- | --- | --- | --- |
| A. Lord Esrom's Hall | 0–3 | 0–3 | start | Court |
| B. Between Two Crowns | 4–9 | 0–4 | start; three-way exclusive | Lean; the Accord, independence or the Free Steadings |
| C. Furs, Timber and Iron | 10–13 | 0–3 | start | Economy; winter stores |
| D. Hunters and Wardens | 14–16 | 0–3 | start | Army |
| E. Tales of the North | 17–19 | 0–3 | start; lower half hidden until `zin_eindil_awake` | Legends; Eindil regard |
| F. The South Burns | 10–13 | 6–8 | `zin_war_of_last_crowns` or `zin_western_crossing` | The final war |

**A. Lord Esrom's Hall.** Icons: `council_table`, `wild_hunt`, `feast_table`.

- `lord_esroms_hall` **Lord Esrom's Hall** (1,0) 70d: political power 75. AI 100.
- `the_lords_of_fearno` **The Lords of Fearno** (0,1) ← lord_esroms_hall: recruit `zin_regional_fearno_ilse`; political power 25.
- `the_great_hunt` **The Great Hunt** (2,1) ← lord_esroms_hall: army experience 5; stability 0.02.
- `the_hall_of_many_lords` **The Hall of Many Lords** (1,2) ← the_lords_of_fearno, the_great_hunt: event `many_lords`.
- `pride_of_fearno` **The Pride of Fearno** (1,3) 70d ← the_hall_of_many_lords: swap spirit `proud_fearno` → `fearno_united`.

**B. Between Two Crowns.** Icons: `two_crowns`, `handshake_oath`, `banner_league`, `charter_free`, `roads_paved`.

- `between_two_crowns` **Between Two Crowns** (6,0): political power 25. AI 30.
- ★ `friends_of_the_winter_crown` **Friends of the Winter Crown** (4,1) ← between_two_crowns; exclusive with a_lord_among_lords, the_free_steadings.
- ★ `a_lord_among_lords` **A Lord Among Lords** (6,1) ← between_two_crowns; exclusive with the other two.
- ★ `the_free_steadings` **The Free Steadings** (8,1) ← between_two_crowns; exclusive with the other two.
- `envoys_to_fandanar` **Envoys to Fandanar** (4,2) ← friends_of_the_winter_crown: event `fearno_envoys` to Coldor.
- `the_accords_door` **The Accord's Door** (4,3) ← envoys_to_fandanar: available `variable zin_cold_lean above 49`; lean +10 self; political power 25; tooltip "Fandanar may now invite us into the Accord."
- `under_the_accord` **Under the Accord** (4,4) ← the_accords_door: available `check zin_regional_fearno_in_accord`; spirit `accord_hunters`.
- `markets_for_both_crowns` **Markets for Both Crowns** (6,2) ← a_lord_among_lords: political power 50.
- `the_open_road` **The Open Road** (6,3) ← markets_for_both_crowns: building infrastructure 1 random_owned, twice.
- `neither_crown_nor_iron` **Neither Crown nor Iron** (6,4) 70d ← the_open_road: swap spirit `lord_among_lords` → `neither_crown`; stability 0.05.
- ★ `call_the_free_steadings` **Call the Free Steadings** (8,2) 70d ← the_free_steadings.
- `the_steadings_moot` **The Steadings' Moot** (8,3) ← call_the_free_steadings: available `check zin_regional_fearno_steadings_gathered` (two or more other members); spirit `free_steadings`.
- `shield_of_the_steadings` **Shield of the Steadings** (8,4) ← the_steadings_moot: `call zin_regional_fearno_guarantee_members`.

**C. Furs, Timber and Iron.** Icons: `market_stalls`, `timber_mill`, `mine_cart`, `granary`.

- `the_fur_markets` **The Fur Markets** (11,0): building industrial_complex 1 capital. AI 25.
- `timber_of_fearno` **Timber of Fearno** (10,1) ← the_fur_markets: building industrial_complex 1 random_owned.
- `iron_of_the_north_hills` **Iron of the North Hills** (12,1) ← the_fur_markets: building arms_factory 1 capital.
- `the_long_roads` **The Long Roads** (11,2) 70d ← timber_of_fearno, iron_of_the_north_hills: building infrastructure 1 random_owned, twice.
- `stores_against_the_winter` **Stores Against the Winter** (11,3) ← the_long_roads: flag `zin_cold_winter_stores`; stability 0.03.

**D. Hunters and Wardens.** Icons: `wild_hunt`, `bow_archers`, `footprints_snow`, `ranger_cloak`.

- `the_hunting_host` **The Hunting Host** (15,0): army experience 10. AI 20.
- `snow_trackers` **Snow Trackers** (14,1) ← the_hunting_host: spirit `snow_trackers_trained`.
- `bowmen_of_the_pines` **Bowmen of the Pines** (16,1) ← the_hunting_host: research {zin_cat_bows} 0.5×1.
- `the_huntmaster` **The Huntmaster** (15,2) ← snow_trackers, bowmen_of_the_pines: recruit `zin_regional_fearno_hroth`; manpower 10,000.
- `wardens_of_fearno` **Wardens of Fearno** (15,3) 70d ← the_huntmaster: spirit `fearno_wardens`.

**E. Tales of the North.** Icons: `book_lore`, `castle_ice`, `ice_field`, `footprints_snow`.

- `tales_of_the_north` **Tales of the North** (18,0): political power 25.
- `the_silent_castle_tale` **The Silent Castle** (17,1) ← tales_of_the_north: stability 0.02; tooltip "A green light in the north, and a castle no hunter reaches."
- `hunters_of_the_far_ice` **Hunters of the Far Ice** (19,1) ← tales_of_the_north: building infrastructure 1 random_owned; political power 25.
- `the_stranger_of_the_ice` **The Stranger from the Ice** (18,2) ← the_silent_castle_tale, hunters_of_the_far_ice: `allow_branch` `global_flag zin_eindil_awake`; renown +2; regard +5; political power 25.
- `songs_of_the_houseless_king` **Songs of the King Without a House** (18,3) ← the_stranger_of_the_ice: available `zin_eindil_war_king`; regard +5; war support 0.02.

**F. The South Burns.** Icons: `banner_plain`, `wild_hunt`, `lone_sword`.

- `the_south_burns` **The South Burns** (11,6): available `zin_war_of_last_crowns` or `zin_western_crossing`; political power 50. AI 200.
- `fearno_keeps_its_snows` **Fearno Keeps Its Snows** (10,7) ← the_south_burns; exclusive with hunters_for_the_living: spirit `keeps_its_snows`. AI 40; hist ×100.
- `hunters_for_the_living` **Hunters for the Living** (12,7) ← the_south_burns; exclusive with fearno_keeps_its_snows: available `variable zin_gathering_dark above 49` or `zin_eindil_named`; LC +3. AI 20, ×2 if regard ≥ 25; hist ×0.
- `the_hunt_rides_south` **The Hunt Rides South** (12,8) ← hunters_for_the_living: available `zin_eindil_returned`, friend; aid host {4000, zin_arms_equipment 800}; join coalition. AI 100.

### Key focuses

| Key | Name | Prerequisites | Effects summary |
| --- | --- | --- | --- |
| `friends_of_the_winter_crown` | Friends of the Winter Crown | between_two_crowns | Exclusive with a_lord_among_lords, the_free_steadings. Lean +20 self. AI 30; hist ×0 |
| `a_lord_among_lords` | A Lord Among Lords | between_two_crowns | Exclusive with the other two. Spirit `lord_among_lords`. AI 40; hist ×10 |
| `the_free_steadings` | The Free Steadings | between_two_crowns | Exclusive with the other two. Flag `zin_regional_fearno_steadings_path`; political power 25. AI 15; hist ×0 |
| `call_the_free_steadings` | Call the Free Steadings | the_free_steadings | Available: not in a faction; not at war. Faction "The Free Steadings" (proposed name); `call zin_regional_fearno_invite_steadings` (event `steadings_invited` to every country passing `zin_cold_is_clan_realm` with lean between −30 and 30, not in a faction, not a subject). AI 50 |

### Spirits

| Key | Name | Modifiers | Added / removed |
| --- | --- | --- | --- |
| `proud_fearno` | Fearno Stands Alone | `drift_defence_factor` 0.10, `stability_factor` 0.03, `trade_opinion_factor` −0.05 | Start (history); swapped by *The Pride of Fearno* |
| `fearno_united` | The Hall United | `political_power_gain` 0.10, `stability_factor` 0.05 | *The Pride of Fearno* |
| `lord_among_lords` | A Lord Among Lords | `trade_opinion_factor` 0.10, `drift_defence_factor` 0.10 | *A Lord Among Lords*; swapped by *Neither Crown nor Iron* |
| `neither_crown` | Neither Crown nor Iron | `trade_opinion_factor` 0.15, `drift_defence_factor` 0.15, `stability_factor` 0.03 | *Neither Crown nor Iron* |
| `accord_hunters` | Hunters of the Accord | `army_core_defence_factor` 0.05, `winter_attrition_factor` −0.05 | *Under the Accord*; removed if Fearno leaves the Accord |
| `free_steadings` | The Free Steadings | `stability_factor` 0.05, `army_core_defence_factor` 0.05 | *The Steadings' Moot*; removed if the faction dissolves |
| `snow_trackers_trained` | Snow Trackers | `winter_attrition_factor` −0.10, `army_speed_factor` 0.03 | *Snow Trackers* |
| `fearno_wardens` | Wardens of Fearno | `army_core_defence_factor` 0.10, `army_org_factor` 0.05 | *Wardens of Fearno* |
| `keeps_its_snows` | Fearno Keeps Its Snows | `stability_factor` 0.05, `war_support_factor` −0.05 | *Fearno Keeps Its Snows* |

### Events (namespace `zin_regional_fearno`)

| Id | Key | Title | To | Trigger | Options |
| --- | --- | --- | --- | --- | --- |
| 1 | `many_lords` | The Hall of Many Lords | Fearno | *The Hall of Many Lords* | **Esrom speaks first** (AI 50): political power 50. **Every lord speaks**: stability 0.03 |
| 2 | `fearno_envoys` | Envoys from Fearno | Coldor | *Envoys to Fandanar* | **Welcome them** (AI 90): opinion modifier `zin_regional_fearno_friendship` (+20) both ways; Fearno lean +10. **Keep them waiting**: nothing |
| 3 | `steadings_invited` | The Free Steadings Call | invited clan realm | *Call the Free Steadings* | **Join the Free Steadings** (AI 40; ×0 at lean above 40 or below −40): the invitee joins Fearno's faction. **Keep our own counsel**: nothing |

### Historical AI route

| Period | Focuses |
| --- | --- |
| 1748 | lord_esroms_hall, between_two_crowns, the_fur_markets, the_hunting_host |
| 1749 | a_lord_among_lords, the_lords_of_fearno, the_great_hunt, timber_of_fearno, tales_of_the_north |
| 1750 | markets_for_both_crowns, the_hall_of_many_lords, iron_of_the_north_hills, the_silent_castle_tale |
| 1751–1752 | the_open_road, pride_of_fearno, the_long_roads, stores_against_the_winter, snow_trackers |
| 1753–1754 | neither_crown_nor_iron, bowmen_of_the_pines, the_huntmaster, wardens_of_fearno, hunters_of_the_far_ice |
| 1755 | the_south_burns, fearno_keeps_its_snows |
| 1756–1760 | the hidden tales focuses once their flags are set; leftovers |

The AI never takes `friends_of_the_winter_crown`, `the_free_steadings` or `hunters_for_the_living` on the historical path.

---

## Titanos

**Tree** `regional_titanos` · 8 states · giants · Wild (`zin_wild_clans`) · ruler **Frost-King Huk** (proposed, characters spec) · 30 focuses · grid x 0–18, y 0–8.

### Situation in 4A 1748

Titanos is the land of the ice giants: eight states of high snowfields, glacier halls and the passes between them. Frost-King Huk keeps the hall and the old mothers keep its memory (proposed). The giants answer to no crown. They trade little, mostly salt and iron through the passes, where traders pay a toll at the giants' halls (proposed). Their lean is 0. Their rank, nature and history are not set in the vault, and no text in this tree states them; text says only "the giants of Titanos".

### Role

- **Historical path (proposed):** the giants answer Coldor's envoys (`zin_cold.52`) and keep the old pacts: the Giants' Toll, then giants on the passes (pact level 2 by 4A 1754 on Coldor's historical route).
- **War of the Last Crowns:** the high snows hold. Alternatives: if the dark wakes, giants go south against it (play).
- **Apart (alternative):** *The High Snows Apart* closes the passes to every crown and refuses the pacts.

### Court and characters

| Id | Name | Role | Source |
| --- | --- | --- | --- |
| `<Titanos tag>_zin_ruler` | Frost-King Huk | Country leader, `zin_wild_clans` | characters spec (proposed) |
| `zin_regional_titanos_skarn` | Skarn Glacier-Hand | Corps commander, skill 3, traits `fortress_buster`, `winter_specialist`; recruited by *Skarn's Band* | this spec (proposed) |
| `zin_regional_titanos_hrimla` | Old Mother Hrimla | Political advisor, trait `zin_adv_elder`; recruited by *The Old Mothers* | this spec (proposed) |

Start spirit (country history): `the_frost_kings_court`.

### Tree

| Branch | Columns | Rows | Opens | Drives |
| --- | --- | --- | --- | --- |
| A. The Frost-King's Hall | 0–2 | 0–2 | start | Court |
| B. The Passes and the Toll | 4–6 | 0–3 | start | Economy |
| C. Answers to Crowns | 8–12 | 0–4 | start; exclusive | Coldor's pacts or the high snows apart |
| D. The Giants' Host | 13–15 | 0–3 | start | Army |
| E. The Snow's Edge | 16–18 | 0–2 | start | Neighbours |
| F. The Dark Wakes | 8–12 | 6–8 | `zin_war_of_last_crowns` or `zin_zol_rising` | The final war |

**A. The Frost-King's Hall.** Icons: `giant_hammer`, `council_table`, `book_lore`.

- `frost_kings_hall` **The Frost-King's Hall** (1,0) 70d: political power 50. AI 100.
- `moot_of_the_high_snows` **Moot of the High Snows** (0,1) ← frost_kings_hall: stability 0.03.
- `the_old_mothers` **The Old Mothers** (2,1) ← frost_kings_hall: recruit `zin_regional_titanos_hrimla`; political power 25.
- `memory_of_the_giants` **Memory of the Giants** (1,2) ← moot_of_the_high_snows, the_old_mothers: political power 25; tooltip "The giants keep their own count of years."

**B. The Passes and the Toll.** Icons: `mountain_pass`, `toll_house`, `quarry_stone`.

- `the_giants_toll_roads` **The Toll Roads** (5,0): political power 25. AI 20.
- `salt_and_iron_traders` **Salt and Iron Traders** (4,1) ← the_giants_toll_roads: political power 50; event `trader_at_the_toll`.
- `toll_halls_on_the_passes` **Toll-Halls on the Passes** (6,1) ← the_giants_toll_roads: building infrastructure 1 random_owned; spirit `toll_halls`.
- `quarries_of_the_ice` **Quarries of the Ice** (5,2) ← salt_and_iron_traders, toll_halls_on_the_passes: building industrial_complex 1 capital.
- `ice_halls` **Halls in the Ice** (5,3) 70d ← quarries_of_the_ice: building industrial_complex 1 random_owned.

**C. Answers to Crowns.** Icons: `envoy`, `handshake_oath`, `frozen_gate`, `snow_peak`.

- `envoys_in_the_snow` **Envoys in the Snow** (10,0): political power 25. AI 30.
- ★ `the_old_pacts_kept` **The Old Pacts Kept** (9,1) ← envoys_in_the_snow; exclusive with the_high_snows_apart.
- ★ `the_high_snows_apart` **The High Snows Apart** (11,1) ← envoys_in_the_snow; exclusive with the_old_pacts_kept.
- `gifts_for_the_frost_king` **Gifts for the Frost-King** (9,2) ← the_old_pacts_kept: political power 25; stability 0.03.
- `giants_on_the_passes_sworn` **Giants on the Passes** (9,3) ← gifts_for_the_frost_king: available `check zin_regional_titanos_pact_two`; army experience 10; spirit `pass_guardians`.
- `hearth_and_height_answered` **Hearth and Height** (9,4) ← giants_on_the_passes_sworn: available `check zin_regional_titanos_pact_three`; stability 0.05; political power 50.
- `doors_of_ice_closed` **The Doors of Ice Closed** (11,2) ← the_high_snows_apart: building bunker 1 capital; building bunker 1 random_owned.
- `no_crown_above_the_snow` **No Crown Above the Snow** (11,3) 70d ← doors_of_ice_closed: stability 0.05; political power 50.

**D. The Giants' Host.** Icons: `giant_hammer`, `siege_trebuchet`, `levy_muster`.

- `the_giants_host` **The Giants' Host** (14,0): army experience 10. AI 20.
- `great_hammers` **Great Hammers** (13,1) ← the_giants_host: research {zin_cat_kin} 0.5×1.
- `the_hurlers` **The Hurlers** (15,1) ← the_giants_host: research {zin_cat_siege} 0.5×1.
- `skarns_band` **Skarn's Band** (14,2) ← great_hammers, the_hurlers: recruit `zin_regional_titanos_skarn`; spirit `glacier_host`.
- `the_frost_levy` **The Frost Levy** (14,3) ← skarns_band: manpower 2,000; equipment zin_giant_gear_equipment 200.

**E. The Snow's Edge.** Icons: `snow_peak`, `yeti_claw`, `castle_ice`.

- `the_snows_edge` **The Snow's Edge** (17,0): political power 25.
- `the_yeti_neighbours` **The Yeti Neighbours** (16,1) ← the_snows_edge: available Yeti Lands exists; non-aggression Yeti Lands.
- `the_light_in_the_north` **The Light in the North** (18,1) ← the_snows_edge: stability 0.02; tooltip "A green light burns in the north. The giants do not go there."
- `old_peoples_of_the_ice` **Old Peoples of the Ice** (17,2) ← the_yeti_neighbours, the_light_in_the_north: stability 0.05.

**F. The Dark Wakes.** Icons: `banner_plain`, `giant_hammer`, `lone_sword`.

- `the_dark_wakes` **The Dark Wakes** (10,6): available `zin_war_of_last_crowns` or `zin_zol_rising`; political power 50. AI 200.
- `the_high_snows_hold` **The High Snows Hold** (9,7) ← the_dark_wakes; exclusive with giants_against_the_dark: spirit `high_snows_hold`. AI 40; hist ×100.
- `giants_against_the_dark` **Giants Against the Dark** (11,7) ← the_dark_wakes; exclusive with the_high_snows_hold: available `variable zin_gathering_dark above 49`, `zin_eindil_named` or `zin_zol_rising`; LC +3. AI 15; hist ×0.
- `giants_on_the_southern_road` **Giants on the Southern Road** (11,8) ← giants_against_the_dark: available `zin_eindil_returned`, friend; aid host {800, zin_giant_gear_equipment 200}; join coalition. AI 100.

### Key focuses

| Key | Name | Prerequisites | Effects summary |
| --- | --- | --- | --- |
| `the_old_pacts_kept` | The Old Pacts Kept | envoys_in_the_snow | Exclusive with the_high_snows_apart. Flag `zin_regional_titanos_open_to_pacts` (proposed hook: the AI chance of accepting `zin_cold.52` is doubled); lean +10 self. AI 50; hist ×10 |
| `the_high_snows_apart` | The High Snows Apart | envoys_in_the_snow | Exclusive with the_old_pacts_kept. Spirit `high_snows_apart`; flag `zin_regional_titanos_apart` (proposed hook: `zin_cold.52` AI chance ×0, and `zin_cold_renew_old_pact` unavailable against Titanos). AI 20; hist ×0 |

### Spirits

| Key | Name | Modifiers | Added / removed |
| --- | --- | --- | --- |
| `the_frost_kings_court` | The Frost-King's Court | `army_core_defence_factor` 0.10, `trade_opinion_factor` −0.10 | Start (history); permanent |
| `toll_halls` | Toll-Halls on the Passes | `political_power_gain` 0.05, `consumer_goods_factor` −0.02 | *Toll-Halls on the Passes* |
| `high_snows_apart` | The High Snows Apart | `drift_defence_factor` 0.30, `army_core_defence_factor` 0.10, `trade_opinion_factor` −0.15 | *The High Snows Apart* |
| `pass_guardians` | Giants on the Passes | `army_defence_factor` 0.10 | *Giants on the Passes* |
| `glacier_host` | The Glacier Host | `breakthrough_factor` 0.05, `army_attack_factor` 0.05 | *Skarn's Band* |
| `high_snows_hold` | The High Snows Hold | `stability_factor` 0.05, `army_core_defence_factor` 0.05 | *The High Snows Hold* |

### Events (namespace `zin_regional_titanos`)

| Id | Key | Title | To | Trigger | Options |
| --- | --- | --- | --- | --- | --- |
| 1 | `trader_at_the_toll` | Salt for Iron | Titanos | *Salt and Iron Traders* | **A fair toll** (AI 60): political power 25; opinion +10 from a random neighbour. **A giant's toll**: political power 50 |

### Historical AI route

| Period | Focuses |
| --- | --- |
| 1748 | frost_kings_hall, the_giants_toll_roads, envoys_in_the_snow, the_giants_host |
| 1749 | the_old_pacts_kept, moot_of_the_high_snows, the_old_mothers, salt_and_iron_traders |
| 1750–1751 | toll_halls_on_the_passes, memory_of_the_giants, gifts_for_the_frost_king, the_snows_edge, the_yeti_neighbours |
| 1752–1754 | quarries_of_the_ice, great_hammers, the_hurlers, giants_on_the_passes_sworn (when Coldor's pact reaches 2), skarns_band |
| 1755 | the_dark_wakes, the_high_snows_hold |
| 1756–1760 | leftovers |

---

## Yeti Lands

**Tree** `regional_yeti_lands` · 22 states · yeti · Wild (`zin_wild_clans`) · ruler **Grumhal the Eldest** (proposed, characters spec) · 30 focuses · grid x 0–18, y 0–8.

### Situation in 4A 1748

The Yeti Lands are twenty-two states of deep snow, ice fields and high hunting grounds. The yeti clans meet at the Eldest's Fire (proposed), where Grumhal the Eldest speaks for them. They herd and hunt, trade furs at a few snowline fairs, and answer to no crown. Their lean is 0. What the yeti are in the order of beings is open; text calls them "the yeti" and their realm "the Yeti Lands", nothing more. The towns along their edge remain sovereign (roster). Nobody is at war with them.

### Role

- **Historical path (proposed):** the yeti accept Coldor's Hunting Truce (`zin_cold.51`) and later send trackers (pact level 2 by 4A 1754 on Coldor's historical route). If the Castle of Yeldenne offers its compact, they accept.
- **War of the Last Crowns:** the snows stay silent. Alternatives: if Zol's dead rise, the yeti hunt them (play).
- **Apart (alternative):** *The Deep Snow Is Ours* refuses every truce.

### Court and characters

| Id | Name | Role | Source |
| --- | --- | --- | --- |
| `<Yeti Lands tag>_zin_ruler` | Grumhal the Eldest | Country leader, `zin_wild_clans` | characters spec (proposed) |
| `zin_regional_yeti_lands_oruk` | Oruk Long-Stride | Corps commander, skill 3, traits `winter_specialist`, `ambusher`; recruited by *Long Stride* | this spec (proposed) |
| `zin_regional_yeti_lands_sima` | Sima Who Remembers | Political advisor, trait `zin_adv_elder`; recruited by *Songs of the Long Snow* | this spec (proposed) |

Start spirit (country history): `eldests_fire`.

### Tree

| Branch | Columns | Rows | Opens | Drives |
| --- | --- | --- | --- | --- |
| A. The Eldest's Fire | 0–2 | 0–2 | start | Court |
| B. The Hunting Grounds | 4–6 | 0–3 | start | Economy; winter stores |
| C. The Old Truces | 8–12 | 0–4 | start; exclusive | Coldor's truce, Yeldenne's compact, or the deep snow apart |
| D. The Deep Snow Host | 13–15 | 0–3 | start | Army |
| E. The Far Snows | 16–18 | 0–2 | start; one focus hidden until `zin_eindil_awake` | Legends; Eindil regard |
| F. The Dead and the Snow | 8–12 | 6–8 | `zin_war_of_last_crowns` or `zin_zol_rising` | The final war |

**A. The Eldest's Fire.** Icons: `yeti_claw`, `council_table`, `book_lore`.

- `the_eldests_fire` **The Eldest's Fire** (1,0) 70d: political power 50. AI 100.
- `the_fire_moot` **The Fire Moot** (0,1) ← the_eldests_fire: stability 0.03.
- `songs_of_the_long_snow` **Songs of the Long Snow** (2,1) ← the_eldests_fire: recruit `zin_regional_yeti_lands_sima`; political power 25.
- `the_clans_of_the_deep_snow` **The Clans of the Deep Snow** (1,2) 70d ← the_fire_moot, songs_of_the_long_snow: swap spirit `eldests_fire` → `moot_of_fires`.

**B. The Hunting Grounds.** Icons: `herds`, `wild_hunt`, `market_stalls`, `granary`.

- `the_hunting_grounds` **The Hunting Grounds** (5,0): political power 25; event `traders_at_the_snowline`. AI 20.
- `herds_of_the_high_snow` **Herds of the High Snow** (4,1) ← the_hunting_grounds: stability 0.03.
- `bone_and_hide` **Bone and Hide** (6,1) ← the_hunting_grounds: equipment zin_yeti_gear_equipment 300.
- `snowline_fairs` **Snowline Fairs** (5,2) ← herds_of_the_high_snow, bone_and_hide: political power 50; building industrial_complex 1 capital.
- `stores_of_the_long_winter` **Stores of the Long Winter** (5,3) ← snowline_fairs: flag `zin_cold_winter_stores`.

**C. The Old Truces.** Icons: `handshake_oath`, `castle_ice`, `footprints_snow`, `ice_field`.

- `the_old_truces` **The Old Truces** (10,0): political power 25. AI 30.
- ★ `the_hunting_truce` **The Hunting Truce** (9,1) ← the_old_truces; exclusive with the_deep_snow_is_ours.
- ★ `the_deep_snow_is_ours` **The Deep Snow Is Ours** (11,1) ← the_old_truces; exclusive with the_hunting_truce.
- `the_castles_compact` **The Castle's Compact** (9,2) ← the_hunting_truce: available Yeldenne exists; non-aggression Yeldenne; stability 0.02.
- `trackers_for_the_crown` **Trackers for the Crown** (9,3) ← the_castles_compact: available `check zin_regional_yeti_lands_pact_two`; army experience 10; spirit `crown_trackers`.
- `hearth_and_height_kept` **Hearth and Height** (9,4) ← trackers_for_the_crown: available `check zin_regional_yeti_lands_pact_three`; stability 0.05; political power 50.
- `the_white_silence` **The White Silence** (11,2) ← the_deep_snow_is_ours: swap spirit `deep_snow` → `white_silence`.
- `no_road_through_the_snow` **No Road Through the Snow** (11,3) ← the_white_silence: army experience 10; stability 0.05.

**D. The Deep Snow Host.** Icons: `yeti_claw`, `footprints_snow`, `storm_veil`.

- `the_deep_snow_host` **The Deep Snow Host** (14,0): army experience 10. AI 20.
- `long_stride` **Long Stride** (13,1) ← the_deep_snow_host: recruit `zin_regional_yeti_lands_oruk`; spirit `long_stride_bands`.
- `claws_in_the_storm` **Claws in the Storm** (15,1) ← the_deep_snow_host: research {zin_cat_kin} 0.5×1.
- `the_storm_bands` **The Storm Bands** (14,2) 70d ← long_stride, claws_in_the_storm: manpower 3,000; spirit `storm_bands`.
- `the_great_hunt_mustered` **The Great Hunt Mustered** (14,3) ← the_storm_bands: equipment zin_yeti_gear_equipment 500.

**E. The Far Snows.** Icons: `ice_field`, `footprints_snow`, `castle_ice`.

- `the_far_snows` **The Far Snows** (17,0): political power 25.
- `tracks_without_end` **Tracks Without End** (16,1) ← the_far_snows: building infrastructure 1 random_owned.
- `the_light_in_the_north` **The Light in the North** (18,1) ← the_far_snows: stability 0.02; tooltip "The green light in the north does not move with the stars."
- `the_man_who_walked_from_the_ice` **The Man Who Walked from the Ice** (17,2) ← tracks_without_end, the_light_in_the_north: `allow_branch` `global_flag zin_eindil_awake`; renown +2; regard +5.

**F. The Dead and the Snow.** Icons: `banner_plain`, `yeti_claw`, `bones_risen`.

- `the_dead_and_the_snow` **The Dead and the Snow** (10,6): available `zin_war_of_last_crowns` or `zin_zol_rising`; political power 50. AI 200.
- `the_snows_stay_silent` **The Snows Stay Silent** (9,7) ← the_dead_and_the_snow; exclusive with hunters_against_the_dead: spirit `silent_snows`. AI 40; hist ×100.
- `hunters_against_the_dead` **Hunters Against the Dead** (11,7) ← the_dead_and_the_snow; exclusive with the_snows_stay_silent: available `variable zin_gathering_dark above 49` or `zin_zol_rising`; LC +3. AI 15; hist ×0.
- `the_storm_walks_south` **The Storm Walks South** (11,8) ← hunters_against_the_dead: available `zin_eindil_returned`, friend; aid host {1000, zin_yeti_gear_equipment 300}; join coalition. AI 100.

### Key focuses

| Key | Name | Prerequisites | Effects summary |
| --- | --- | --- | --- |
| `the_hunting_truce` | The Hunting Truce | the_old_truces | Exclusive with the_deep_snow_is_ours. Flag `zin_regional_yeti_lands_open_to_truce` (proposed hook: AI chance of accepting `zin_cold.51` doubled); lean +10 self. AI 50; hist ×10 |
| `the_deep_snow_is_ours` | The Deep Snow Is Ours | the_old_truces | Exclusive with the_hunting_truce. Spirit `deep_snow`; flag `zin_regional_yeti_lands_apart` (proposed hook: `zin_cold.51` AI chance ×0; `zin_cold_renew_old_pact` unavailable against the Yeti Lands). AI 20; hist ×0 |

### Spirits

| Key | Name | Modifiers | Added / removed |
| --- | --- | --- | --- |
| `eldests_fire` | The Eldest's Fire | `stability_factor` 0.05, `political_power_gain` −0.05 | Start (history); swapped by *The Clans of the Deep Snow* |
| `moot_of_fires` | The Moot of Fires | `political_power_gain` 0.05, `stability_factor` 0.05 | *The Clans of the Deep Snow* |
| `deep_snow` | The Deep Snow | `drift_defence_factor` 0.30, `army_core_defence_factor` 0.15 | *The Deep Snow Is Ours*; swapped by *The White Silence* |
| `white_silence` | The White Silence | `drift_defence_factor` 0.30, `army_core_defence_factor` 0.20, `army_org_factor` 0.05 | *The White Silence* |
| `crown_trackers` | Trackers for the Crown | `army_speed_factor` 0.03, `army_intel_factor` 0.10 | *Trackers for the Crown* |
| `long_stride_bands` | Long Stride | `army_speed_factor` 0.05 | *Long Stride* |
| `storm_bands` | The Storm Bands | `army_attack_factor` 0.05, `army_org_factor` 0.05 | *The Storm Bands* |
| `silent_snows` | The Snows Stay Silent | `stability_factor` 0.05, `war_support_factor` −0.05 | *The Snows Stay Silent* |

### Events (namespace `zin_regional_yeti_lands`)

| Id | Key | Title | To | Trigger | Options |
| --- | --- | --- | --- | --- | --- |
| 1 | `traders_at_the_snowline` | Traders at the Snowline | Yeti Lands | *The Hunting Grounds* | **Trade furs for salt** (AI 70): political power 25. **Send them back down**: stability 0.02 |

### Historical AI route

| Period | Focuses |
| --- | --- |
| 1748 | the_eldests_fire, the_hunting_grounds, the_old_truces, the_deep_snow_host |
| 1749 | the_hunting_truce, the_fire_moot, songs_of_the_long_snow, herds_of_the_high_snow, bone_and_hide |
| 1750–1751 | the_castles_compact (if Yeldenne exists), the_clans_of_the_deep_snow, snowline_fairs, the_far_snows |
| 1752–1754 | stores_of_the_long_winter, long_stride, claws_in_the_storm, trackers_for_the_crown (when Coldor's pact reaches 2), the_storm_bands |
| 1755 | the_dead_and_the_snow, the_snows_stay_silent |
| 1756–1760 | leftovers |

---

## Implementation

### Files

For each tree `<t>` in `regional_isengard`, `regional_horidor`, `regional_windwaith`, `regional_fearno`, `regional_titanos`, `regional_yeti_lands`:

| Path | What |
| --- | --- |
| `docs/design/focus/<t>.json` | Tree data, `"tier": "regional"`, `"countries": ["<Name>"]` |
| `common/national_focus/zin_<t>.txt` | Compiled tree |
| `common/ideas/zin_focus_<t>.txt` | Its spirits |
| `events/zin_<t>.txt` | Its events (namespace `zin_<t>`) |
| `common/scripted_effects/zin_<t>.txt`, `common/scripted_triggers/zin_<t>.txt` | Tree-declared effects and triggers below |
| `common/opinion_modifiers/zin_<t>.txt` | Tree opinion modifiers below |
| `localisation/english/zin_focus_<t>_l_english.yml` | All text |
| `history/countries/<tag>` (generated) | Start spirit and recruited characters |

### Tree-declared scripted effects

| Effect | Tree | Does |
| --- | --- | --- |
| `zin_regional_<name>_recruit` (`character`) | every tree here | Recruits the named proposed character with its role (the pattern the major trees use) |
| `zin_regional_isengard_guarantee_oath_brothers` | Isengard | `every_neighbor_country` with `zin_cold_is_clan_realm` and `zin_cold_lean` ≤ −40: `ROOT = { give_guarantee = PREV }`; fires `zin_regional_isengard.2` |
| `zin_regional_isengard_wargoal_march` | Isengard | For every Coldor-owned state with `zin_is_site_isengard_march`: `create_wargoal = { type = take_state_focus target = <Coldor> generator = { <state> } }` |
| `zin_regional_horidor_leave_accord` | Horidor | `leave_faction = yes`; removes `zin_cold_accord_kin` both ways with every Accord member; adds opinion modifier `zin_regional_horidor_left_accord` (−25) from Coldor; `mark_focus_tree_layout_dirty` not needed |
| `zin_regional_fearno_invite_steadings` | Fearno | Fires `zin_regional_fearno.3` to every country with `zin_cold_is_clan_realm`, lean between −30 and 30, not in a faction, not a subject |
| `zin_regional_fearno_guarantee_members` | Fearno | `give_guarantee` to every member of Fearno's faction |

The shared tree owns `zin_shared_cold_lands_lean_neighbours` (`value`), which these trees call (see [../shared/shared_cold_lands.md](../shared/shared_cold_lands.md)).

### Tree-declared scripted triggers

| Trigger | Tree | True when |
| --- | --- | --- |
| `zin_regional_isengard_march_war_running` | Isengard | `has_border_war_between` Isengard and Coldor (the March Forts) |
| `zin_regional_isengard_march_fought` | Isengard | Coldor exists and has country flag `zin_cold_march_war_fought`, or Coldor does not exist |
| `zin_regional_isengard_has_oath_brothers` | Isengard | `any_neighbor_country` with `zin_cold_is_clan_realm` and lean ≤ −40 |
| `zin_regional_horidor_in_accord` | Horidor | Coldor exists and `is_in_faction_with` Coldor |
| `zin_regional_fearno_in_accord` | Fearno | as above, for Fearno |
| `zin_regional_fearno_steadings_gathered` | Fearno | Fearno leads a faction with at least two other members |
| `zin_regional_titanos_pact_two`, `_pact_three` | Titanos | Coldor exists and its `zin_cold_giant_pact` ≥ 2 / ≥ 3 |
| `zin_regional_yeti_lands_pact_two`, `_pact_three` | Yeti Lands | Coldor exists and its `zin_cold_yeti_pact` ≥ 2 / ≥ 3 |

### Opinion modifiers

| Key | Value | Notes |
| --- | ---: | --- |
| `zin_regional_isengard_marriage` | +20 | Coldor ↔ Isengard after the marriage; decays 1 a month |
| `zin_regional_horidor_left_accord` | −25 | Coldor → Horidor; decays 1 a month |
| `zin_regional_fearno_friendship` | +20 | Coldor ↔ Fearno; decays 1 a month |

### Mechanic calls and reads

- Cold Lands mechanic: `zin_cold_add_lean`, `zin_cold_add_lean_all`, `zin_cold_add_defiance`, `zin_cold_start_march_war`; triggers `zin_cold_is_clan_realm`, `zin_cold_march_war_allowed`, `zin_cold_historical`; flags `zin_cold_winter_stores`, `zin_cold_isengard_sworn`, `zin_cold_march_war_fought`, `zin_cold_route_companies`; variables `zin_cold_lean`, `zin_cold_isengard_defiance`, `zin_cold_yeti_pact`, `zin_cold_giant_pact`; idea `zin_cold_harbour_compact`.
- Western Crossing: `zin_west_add_fleet`; flag `zin_west_council`.
- Eindil's journey: `zin_eindil_add_regard`, `zin_eindil_add_renown`, `zin_eindil_aid_host`, `zin_eindil_join_coalition`; trigger `zin_eindil_friend`; flags `zin_eindil_awake`, `zin_eindil_war_king`, `zin_eindil_named`, `zin_eindil_returned`.
- Diplomacy: `zin_lost_cause_add_strength`; flag `zin_lost_cause_member`.
- Politics: `zin_politics_add_drift`, `zin_politics_set_stance`.

### `allow_branch` roots

`the_stranger_of_the_ice` (Fearno) and `the_man_who_walked_from_the_ice` (Yeti Lands) carry `allow_branch = global_flag zin_eindil_awake`. The journey effect that sets `zin_eindil_awake` must call `mark_focus_tree_layout_dirty` for every country (or at least every Cold Lands country) so the branch appears.

### Game rules and defines

No new game rules: the trees use `zin_cold_historical` (from `zin_rule_cold_isengard` and `zin_rule_historical_path`). No defines.

### Icons

All keys above come from the shared catalog ([02_icon_catalog.md](../02_icon_catalog.md)). No new keys are needed. Event pictures: `generic_court` (court events), `generic_wilds` (yeti, giants), `cold_shore` (Windwaith), `generic_peace` (envoys). All art is image-generated.

## AI

- Base weights and "hist" factors are in each section. Peace-time branches come first; the war roots (`beyond_the_march`, `when_the_south_burns`, `the_south_burns`, `the_dark_wakes`, `the_dead_and_the_snow`) have weight 200 so the AI takes them as soon as they open, and the coalition focuses 100.
- Under `zin_rules_is_free` the exclusive choices follow interest: Isengard *Never Kneel* weight = defiance, *A Seat at Fandanar* = 100 − defiance; Horidor *Shield of the Accord* = lean, *The Highland Crown* = 100 − lean (×0 while Coldor is at war); Windwaith *A Harbour Compact* = 50 + lean, *Free Harbours* = 50 − lean; Fearno *Friends* = 50 + lean, *Lord Among Lords* = 50, *Free Steadings* = 50 − |lean| (×0 if fewer than three clan realms have lean between −30 and 30); Titanos and the Yeti Lands keep the pacts at 70 and stand apart at 30.
- War-course focuses: the "for the living" option weight = 20 + Eindil regard, ×2 in the Lost Cause; the stand-apart option weight 40.
- No tree here ever has the AI declare a war on the historical path.

## Acceptance

1. The compiler accepts the six trees: focus counts as tabled (45, 32, 34, 37, 30, 30); unique keys and positions; every prerequisite above its focus; exclusives symmetric; days multiples of 7; no `raw` blocks.
2. The HOI4 Agent Tools focus inspector reports no errors; the renderer produces a clean image of each tree.
3. On 1 Thaw 4A 1748: no focus that creates a war goal, starts a border war or joins a war is available in any of the six trees; no visible focus or tooltip mentions a stranger or a sleeper in the ice; no text names Afrit.
4. Text check: no focus, spirit or event text calls giants or yeti Great Folk, Common Folk or beasts, or states their origin.
5. Historical observer run, 4A 1748 to 4A 1760: Isengard takes `never_kneel` by the end of 1749 and `meet_them_at_the_forts` during the March Forts; Horidor takes `shield_of_the_accord` and stays in the Accord; Windwaith takes `free_harbours` and, once the Ford Council sits, `hulls_for_the_west`; Fearno takes `a_lord_among_lords`; Titanos and the Yeti Lands take the pact focuses; every tree takes its stand-apart focus within 120 days of `zin_war_of_last_crowns`. None of the six declares a war.
6. Scenario: Isengard with defiance 85 on 1 Thaw 1751 and `zin_gathering_dark` 20 under the free rule: `ride_to_the_forts` is available and starts the March Forts border war; under the historical rule it is not.
7. Scenario: Horidor completes `the_highland_crown`: it leaves the Northern Accord, Coldor's reach falls on its next monthly update, and Horidor gets no war.
8. Scenario: Fearno completes `call_the_free_steadings` with three clan realms at lean 0: the faction exists and invitations reach exactly the eligible realms.
9. Every modifier in the spirit tables exists in the game's modifier documentation; every engine effect and trigger named exists in the effect and trigger documentation.

## Open questions

1. **Isengard's seat.** The vault names no seat for Isengard. Should the Iron Hall stay a hall without a city name, or does the owner want a seat named?
2. **Horidor's crown.** Is a Horidor that leaves the Accord and crowns its chieftain a welcome alternative, or should Horidor always stay in the Accord?
3. **Fearno.** Fearno has 25 states and no lore beyond its name. Is a proud third pole (the Free Steadings) a good fit, or should Fearno lean to one crown?
4. **Windwaith's fishermen.** Does the Windwaith arm reach the Ocean of Zol, so that its fishermen's tales are about Zol's black ships? The tree keeps the tale vague either way.
5. **Giants and yeti.** Should Titanos and the Yeti Lands be able to send help south against the dark at all, given that their nature and their part in the age are open?
6. **The silent castle legend.** Fearno, Titanos and the Yeti Lands repeat the "green light in the north" tale (proposed, from the history-for-play spec). Is a visible light at Yeldenne acceptable as rumour?
