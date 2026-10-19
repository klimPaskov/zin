# Shared tree: the Concord dominions

**Status:** Ready. Reviewed 19 October 2026 against CONVENTIONS "Status"; integrated 19 October 2026. **Priority:** 6. **Phase:** 6 (tier C).

## Purpose

One focus tree for the eighteen tier C countries of the Middle Lands: seventeen chartered dominions of Aenor and one free land. It makes a small dominion feel like a member of the Middle Kingdom Concord: it petitions for its charter, answers the crown's levies, builds its fields and harbours, chooses a side when the Golden King dies, and stands or falls when the dark comes. Branches open by overlord, ideology, coast, region and people, so the same tree reads differently for a lake republic, a coastal lordship, a frontier march and a free land outside the Concord.

The tree also defines the helper effects the Middle Lands tier B trees ([../regional/middle_lands.md](../regional/middle_lands.md)) call, so every dominion talks to the Aenor mechanic ([../../04_mechanics/aenor_court_and_succession.md](../../04_mechanics/aenor_court_and_succession.md)) the same way.

| Item | Value |
| --- | --- |
| Tree id | `shared_concord_dominions` (focus ids `zin_shared_concord_dominions_<key>`) |
| Tier | C (01_tiers: 40 to 70 focuses) |
| Countries | Freshon, Pazoma, Kunhrim, Belurithon, Klungori Guard, Mondon, Noloreh, Olvinc-un, Safeton, Svenlor, Tieri, Vothrim, Dariap, Fotan, Hilofrim, Novez, Stendorler, Ulgus (exactly the tier C list of [../01_tiers_and_coverage.md](../01_tiers_and_coverage.md)) |
| Focuses | 66; columns 0–29, rows 0–9 |
| Events | namespace `zin_shared_concord_dominions`, ids 1–8 |
| Spirits | `zin_shared_concord_dominions_<key>` (22) |
| Built by | `tools/content/modules/focus_compiler.mjs` ([../00_format_and_compiler.md](../00_format_and_compiler.md)) from `docs/design/focus/shared_concord_dominions.json` |

### The countries at the start

Values come from their owners: loyalty and charter from the Aenor spec (section 3), footholds from the Afrit spec's start table, ideology from the politics step.

| Country | States | Ideology, stance | Overlord | Loyalty, charter | Footholds | Notes |
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
| Fotan | 1 | Wild, Freeholds | none | — | 1 | Outside the Concord (Aenor spec). Afrit start table: 1 (decision R4) |
| Hilofrim | 1 | Wild, Freeholds | Aenor | 65, Old | 2 | |
| Novez | 1 | Wild, Freeholds | Aenor | 55, Old | 2 | Neighbour of Hiloron |
| Stendorler | 1 | Wild, Freeholds | Aenor | 60, Old | 2 | |
| Ulgus | 1 | Wild, Freeholds | Aenor | 60, Old | 2 | |

All are men of the Middle Kingdom tradition (country flag `zin_tradition_middle_kingdom`, set by `modules/peoples.mjs` from the `tradition` column of `countries.csv`; Fotan too, proposed). The seventeen dominions are Aenor's subjects with the autonomy state `zin_autonomy_chartered_dominion` and members of the faction Middle Kingdom Concord (diplomacy spec). They are ceremonial members of the Lost Cause, which is an institution inside Aenor's mechanic, not a faction (decision S3).

Today every one of these countries runs the interim "Long Peace" tree (`zin_long_peace_*`, written by `modules/vanilla_removal.mjs`). The compiled tree replaces it for these eighteen.

## Lore basis

- **Established:** Aenor leads 26 satellites in the Middle Kingdom Concord (working table); the Golden King founded the Lost Cause; after his death four camps contend (the Golden Court, the Free Dominions, Afrit's supporters, Eindil's popular host) and the victor is a possible ending, not history; the War of the Last Crowns besets Aenor from every side; Zol's dead cannot be ended by ordinary weapons; Eindil's coalition takes men of many realms without making them subjects.
- **Proposed in the vault:** the Charters of Parim (4A 3) as the dominions' constitution; the Concord Council (4A 212: a common army in war, free roads in peace); the Houses of the First Light.
- **Proposed in the specs:** loyalty, charters, camps and the Lost Cause's strength (Aenor spec); footholds (Afrit spec); the chartered-dominion autonomy (diplomacy spec).
- **Proposed here:** every focus, spirit, event and number; the petition, camp-backing and free-land helpers.
- **Kept open:** whether a dominion is "constitutionally a satellite or an internal division" (vault); which dominions back which camp in history; whether the Concord survives the war. Text states none of these.

## Design

### How the tree reads

- **Every country** gets the root, *Fields and Markets*, *Arms of the Dominion*, *The Houses* and *The Dark Comes*.
- **Concord dominions** (`check zin_aenor_is_concord_dominion`) get *Under the Charter* and *The Thirty Days*.
- **Free lands** (not a subject: Fotan, or a dominion that seceded) get *The Free March*.
- **Coastal countries** (`check zin_shared_has_coast`) get *Harbours*.
- **By ideology:** Light realms get *The Free Council*; Wild realms *The Lords' Moot*; Dominion realms *A Governor's Hand*.
- **By region:** countries bordering a Dead Lands country (`check zin_shared_borders_dead_lands`) get *Watch on the South*; countries bordering a Magical Lands country (`check zin_shared_borders_magical_lands`) get *The Wall Road*.
- **By people:** countries with the Middle Kingdom tradition get *Children of the Restoration*; countries whose primary or minor people include giants or ents get *The Old Kin* (no tier C country at the start; it serves owner-assigned minor peoples and released countries).

`allow_branch` sits on each branch's first focus, under the compiler's E4 rule: people and tradition are fixed at the start; subject status, ideology, coast and borders change only at the layout refresh points of `common/on_actions/zin_focus_layout.txt` (ruling-party change, puppet, release, subject freed, annex, peace conference), and each branch head repeats its condition in `available`. Text uses `[ROOT.GetName]` and `[ROOT.GetAdjective]`, never a country name.

### Rules

- **Peace.** Dominions cannot declare war (`zin_autonomy_chartered_dominion` sets `can_not_declare_war`). No focus makes a war goal, a claim or a core. *The Dark Comes* and *The Thirty Days* open only from story flags.
- **The secret.** No text names Afrit, the Hidden Council or Ilvane. The Houses branch speaks of "the Deliverer's almoners" and "the Houses of the First Light". After the King's death text says "the new king in Parim", never who he is (D3).
- **Eindil.** Focus, spirit and tooltip text is visible to everyone from the first day, so it never refers to Eindil: not by name, not as the Heir, the Stranger or the Man from the Ice (D4; nothing before `zin_eindil_awake`). It speaks only of "the Popular Host" (the Aenor camp's public name) and "the coalition". Event text that can fire only after `zin_eindil_awake` may say "the Man from the Ice", never his name.
- **The Lost Cause** (S3). `lost_cause(v)` adds to the strength of Aenor's institution. No focus creates, joins or leaves a Lost Cause faction. The faction exists only if Aenor's Shield path renames the Concord (`zin_lost_cause_shield`).
- **Text.** Names are title-cased; each description is one to three plain sentences, Windows-1252 only.

### Notation

The compiler vocabulary of [../00_format_and_compiler.md](../00_format_and_compiler.md), abbreviated as in the Middle Lands regional file:

| Shorthand | Means |
| --- | --- |
| `pp 50`, `stab 0.03`, `ws 0.05`, `army_xp 10`, `navy_xp 10`, `mp 2000` | `political_power`, `stability`, `war_support`, `army_experience`, `navy_experience`, `manpower` |
| `spirit k`, `swap k1→k2`, `remove k` | `add_spirit`, `swap_spirit`, `remove_spirit` with this tree's spirits |
| `bld type n @where` | `building`; `where` is `capital`, `random_owned`, `random_coastal` or the site key `great_wall`; "×2" repeats the effect. `bunker`, `coastal_bunker` and `naval_base` are province buildings in 1.19.3 (`common/buildings/00_buildings.txt`); the compiler places them in a province of the chosen state, a coastal one for `coastal_bunker` and `naval_base` |
| `res [cat] 0.5 ×n` | `research` bonus 0.5 with `uses` n on the warfare spec's categories (`zin_cat_arms`, `zin_cat_bows`, `zin_cat_mounts`, `zin_cat_galleys`, `zin_cat_kin`; [../../03_gameplay/01_warfare.md](../../03_gameplay/01_warfare.md), built in phase 3) |
| `loyalty(v)` | `call zin_concord_add_own_loyalty {value: v}` (this tree) |
| `petition(c)` | `call zin_concord_petition_charter {charter: c}` (this tree) |
| `camp(c, v)` | `call zin_concord_back_camp {camp: c, value: v}` (this tree) |
| `lost_cause(v)` | `call zin_lost_cause_add_strength {value: v}` (world systems entry to Aenor's `zin_aenor_add_lost_cause`) |
| `footholds(v)` | `call zin_afrit_add_footholds {value: v}` on ROOT (Afrit spec) |
| `regard(v)` | `call zin_eindil_add_regard {value: v}` on ROOT (Eindil's journey) |
| `coalition` | `call zin_eindil_join_coalition` (Eindil's journey) |
| `aid` | `call zin_eindil_aid_host {equipment: 200, manpower: 1000}` (Eindil's journey) |
| `grievance(v)` | `call zin_elves_add_wall_grievance {value: v}` (elves spec) |
| `event k` | this tree's event `k` |
| `Story` | `available`: any of the global flags `zin_war_of_last_crowns`, `zin_volgan_marches`, `zin_zol_rising`, `zin_western_crossing`, `zin_eastern_invasion`, or `at_war` |
| `End` | `available`: any of the global flags `zin_eindil_crowned`, `zin_afrit_dead`, or (not `at_war` and `after 1758.3.1`) |
| `allow:` | the branch's `allow_branch`; `Avail:` is `available` |
| `hist n` | under `check zin_rules_is_historical` the weight is n (a factor n ÷ base); `hist 0` is factor 0 |

**Arguments.** Scripted effects in 1.19.3 take no parameters. The compiler passes each `args` value as a temporary variable `zin_arg_<name>` set just before `<effect> = yes` (decision E1; the calling convention of [../00_format_and_compiler.md](../00_format_and_compiler.md)). Keyword arguments use number codes: charter `old` 0, `golden` 1, `shield` 2, `free` 3, `wall` 4; camp `court` 1, `faithful` 2, `dominions` 3, `host` 4 (the values of Aenor's `zin_aenor_ruling_camp`).

Prerequisites: `a / b` means a or b. **Bold** names mark key focuses. Days are 35 or 70 (5 or 10 weeks).

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

| Br. | Key | Name | Prerequisites | Excl. | x,y | Days | Icon | Effects | AI |
| --- | --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| — | `charter_of_the_dominion` | **The Charter of [ROOT.GetName]** | — | — | 14,0 | 35 | `charter_old` | pp 50; stab 0.02 | 100 |
| A | `seat_at_the_concord_council` | **A Seat at the Concord Council** | charter_of_the_dominion | — | 2,1 | 35 | `concord_circle` | allow: `check zin_aenor_is_concord_dominion`. loyalty(3); pp 25 | 40 |
| A | `the_charter_read_aloud` | The Charter Read Aloud | seat_at_the_concord_council | — | 0,2 | 35 | `scroll_treaty` | stab 0.03; loyalty(2) | 30 |
| A | `petition_for_a_free_charter` | Petition for a Free Charter | seat_at_the_concord_council | privileges_bought_in_parim | 2,2 | 35 | `charter_free` | Avail: not flag `zin_concord_charter_recent`. petition(free) | 10; ×3 if `zin_concord_loyalty` below 40; hist 0 |
| A | `privileges_bought_in_parim` | Privileges Bought in Parim | seat_at_the_concord_council | petition_for_a_free_charter | 4,2 | 35 | `charter_golden` | Avail: `check zin_aenor_king_alive`; not `check zin_concord_has_golden_charter`; not flag `zin_concord_charter_recent`. petition(golden) | 10; hist: ×2 if `check zin_concord_overlord_corrupt`, else 0 |
| A | `concord_levy_answered` | The Concord Levy Answered | the_charter_read_aloud | — | 1,3 | 70 | `levy_muster` | army_xp 10; mp −1000; loyalty(5); lost_cause(2) | 30 |
| A | `the_kings_highway` | The King's Highway | petition_for_a_free_charter / privileges_bought_in_parim | — | 3,3 | 70 | `roads_paved` | bld infrastructure 1 @random_owned ×2; loyalty(2) | 30 |
| A | `banners_of_the_lost_cause` | Banners of the Lost Cause | concord_levy_answered | — | 0,4 | 70 | `banner_league` | lost_cause(5); spirit `league_banners` | 20 |
| A | `charter_loyalists` | **Charter Loyalists** | concord_levy_answered / the_kings_highway | — | 2,4 | 70 | `seal_royal` | loyalty(5); spirit `charter_loyalists` | 30; hist 50 |
| A | `a_shield_for_the_concord` | A Shield for the Concord | the_kings_highway | — | 4,4 | 70 | `charter_shield` | Avail: global flag `zin_lost_cause_shield`; not flag `zin_concord_charter_recent`. petition(shield); spirit `concord_shield_drill` | 60 |
| B | `home_fields` | **The Fields of [ROOT.GetName]** | charter_of_the_dominion | — | 7,1 | 70 | `farm_sowing` | bld infrastructure 1 @capital; stab 0.02 | 40 |
| B | `market_charter` | Market Charter | home_fields | — | 6,2 | 70 | `market_stalls` | bld industrial_complex 1 @capital | 30 |
| B | `granaries` | The Granaries | home_fields | — | 8,2 | 35 | `granary` | spirit `full_granaries` | 30 |
| B | `roads_to_the_lake` | Roads to the Great Lake | market_charter | — | 6,3 | 70 | `lake_town` | bld infrastructure 1 @random_owned ×2 | 20 |
| B | `guild_workshops` | Guild Workshops | granaries | — | 8,3 | 70 | `guild_hall` | bld industrial_complex 1 @random_owned | 20 |
| B | `smithies` | The Smithies | roads_to_the_lake / guild_workshops | — | 7,4 | 70 | `forge_anvil` | bld arms_factory 1 @capital; res [zin_cat_arms] 0.5 ×1 | 20 |
| B | `a_prosperous_land` | A Prosperous [ROOT.GetAdjective] Land | smithies | — | 7,5 | 70 | `coin_chest` | spirit `prosperous_land` | 20 |
| C | `the_dominion_guard` | **The [ROOT.GetAdjective] Guard** | charter_of_the_dominion | — | 11,1 | 70 | `sword_shield` | army_xp 10; res [zin_cat_arms] 0.5 ×1 | 20 |
| C | `wardens_of_the_roads` | Wardens of the Roads | the_dominion_guard | — | 10,2 | 35 | `scout_lantern` | spirit `road_wardens` | 15 |
| C | `bowmen_of_the_villages` | Bowmen of the Villages | the_dominion_guard | — | 12,2 | 70 | `bow_archers` | mp 1000; res [zin_cat_bows] 0.5 ×1 | 15 |
| C | `stone_forts` | Stone Forts | wardens_of_the_roads | — | 10,3 | 70 | `fort_wall` | bld bunker 1 @capital; bld bunker 1 @random_owned | 15 |
| C | `levies_trained` | Levies Trained | bowmen_of_the_villages | — | 12,3 | 70 | `spear_levy` | spirit `trained_levies` | 15 |
| C | `horse_and_lance` | Horse and Lance | stone_forts / levies_trained | — | 11,4 | 70 | `knight_lance` | army_xp 10; res [zin_cat_mounts] 0.5 ×1 | 15 |
| C | `the_dominion_host` | The Dominion Host | horse_and_lance | — | 11,5 | 70 | `war_drums` | mp 2000; spirit `dominion_host` | 15; ×3 if `check zin_concord_dark_rising` |
| D | `harbour_works` | **Harbour Works** | charter_of_the_dominion | — | 15,1 | 70 | `harbour_lake` | allow: `check zin_shared_has_coast`. bld naval_base 1 @random_coastal; bld dockyard 1 @random_coastal | 30 |
| D | `fishing_fleets` | Fishing Fleets | harbour_works | — | 14,2 | 35 | `fishing_boats` | spirit `fishing_fleets` | 20 |
| D | `coastal_watch` | Coastal Watch | harbour_works | — | 16,2 | 70 | `lighthouse` | bld coastal_bunker 1 @random_coastal | 15 |
| D | `ships_for_the_concord` | Ships for the Concord | fishing_fleets / coastal_watch | — | 15,3 | 70 | `galley_oars` | navy_xp 10; res [zin_cat_galleys] 0.5 ×1 | 15 |
| D | `the_ocean_route` | The Ocean Route | ships_for_the_concord | — | 15,4 | 70 | `sea_charts` | spirit `ocean_route` | 20 |
| E | `the_free_council` | **The Free Council** | charter_of_the_dominion | — | 17,1 | 35 | `council_table` | allow: ideology `light`. spirit `free_council` | 40 |
| E | `elected_magistrates` | Elected Magistrates | the_free_council | — | 17,2 | 70 | `seal_wax` | pp 50; stab 0.03 | 30 |
| E | `council_of_the_lake_towns` | Council of the Lake Towns | elected_magistrates | — | 17,3 | 70 | `lake_town` | swap free_council→free_council_2 | 30 |
| E | `the_lords_moot` | **The Lords' Moot** | charter_of_the_dominion | — | 19,1 | 35 | `banner_plain` | allow: ideology `wild`. spirit `lords_moot` | 40 |
| E | `old_customs` | Old Customs | the_lords_moot | — | 19,2 | 70 | `charter_old` | stab 0.03; ws 0.02 | 30 |
| E | `the_moot_agrees` | The Moot Agrees | old_customs | — | 19,3 | 70 | `handshake_oath` | swap lords_moot→lords_moot_2 | 30 |
| E | `a_governors_hand` | A Governor's Hand | charter_of_the_dominion | — | 21,1 | 35 | `sceptre` | allow: ideology `dominion`. pp 75; stab −0.02 | 40 |
| E | `the_governors_men` | The Governor's Men | a_governors_hand | — | 21,2 | 70 | `seal_chancellor` | spirit `governors_men` | 30 |
| F | `a_free_land` | **A Free Land** | charter_of_the_dominion | — | 24,1 | 35 | `chain_broken` | allow: not `is_subject`. pp 50; spirit `free_land` | 60 |
| F | `ask_for_a_charter` | Ask Parim for a Charter | a_free_land | free_and_apart | 23,2 | 35 | `envoy` | Avail: not flag `zin_aenor_free_dominion`; `check zin_concord_parim_takes_charters`. `call zin_concord_ask_for_charter` | 10; hist 0 |
| F | `free_and_apart` | Free and Apart | a_free_land | ask_for_a_charter | 25,2 | 35 | `banner_plain` | swap free_land→free_land_2 | 40; hist 100 |
| F | `join_the_free_dominions` | Join the Free Dominions | ask_for_a_charter / free_and_apart | — | 23,3 | 35 | `alliance_rings` | Avail: `check zin_aenor_free_dominions_exist`; `check zin_concord_can_join_free_dominions`. `call zin_concord_join_free_dominions` | 10; ×6 if flag `zin_aenor_free_dominion` |
| F | `march_walls` | March Walls | free_and_apart | — | 25,3 | 70 | `fort_wall` | bld bunker 2 @capital | 20 |
| F | `free_banners` | Free Banners | join_the_free_dominions / march_walls | — | 24,4 | 70 | `war_drums` | Avail: Story. army_xp 15; ws 0.05 | 100 |
| G | `watch_on_the_south` | **Watch on the South** | charter_of_the_dominion | — | 27,1 | 35 | `eye_watchful` | allow: `check zin_shared_borders_dead_lands`. spirit `southern_watch` | 30 |
| G | `southern_forts` | Southern Forts | watch_on_the_south | — | 27,2 | 70 | `pass_fort` | bld bunker 1 @random_owned ×2 | 20; ×3 if global flag `zin_mirolon_fallen` |
| G | `heed_mirolon` | Heed Mirolon | southern_forts | — | 27,3 | 35 | `mountain_pass` | Avail: exists Mirolon. lost_cause(3); `for_country Mirolon: call zin_mirolon_add_proof {value: 2}` | 20; hist ×0.5 |
| G | `the_wall_road` | **The Wall Road** | charter_of_the_dominion | — | 29,1 | 35 | `caravan` | allow: `check zin_shared_borders_magical_lands`. spirit `wall_road_trade`; grievance(−3) | 30 |
| G | `elven_markets` | Elven Markets | the_wall_road | — | 29,2 | 70 | `market_stalls` | bld industrial_complex 1 @capital | 20 |
| G | `garrison_the_wall` | Garrison the Wall | elven_markets | — | 29,3 | 70 | `fort_wall` | `if check zin_concord_owns_wall_state`: bld bunker 1 @great_wall; else bld bunker 1 @capital | 15 |
| H | `children_of_the_restoration` | **Children of the Restoration** | charter_of_the_dominion | — | 1,6 | 35 | `book_lore` | allow: flag `zin_tradition_middle_kingdom`. pp 25; stab 0.03 | 30 |
| H | `middle_kingdom_levies` | Middle Kingdom Levies | children_of_the_restoration | — | 1,7 | 70 | `levy_muster` | mp 2000; res [zin_cat_arms] 0.5 ×1 | 20 |
| H | `the_old_kin_of_the_land` | The Old Kin of the Land | charter_of_the_dominion | — | 3,6 | 70 | `giant_hammer` | allow: `check zin_people_includes_giants` or `check zin_people_includes_ents`. army_xp 10; res [zin_cat_kin] 0.5 ×2 | 40 |
| H | `the_kin_stand_with_us` | The Kin Stand with Us | the_old_kin_of_the_land | — | 3,7 | 70 | `ent_branch` | spirit `old_kin` | 30 |
| I | `the_golden_king_is_dead` | **The Golden King Is Dead** | — | — | 8,7 | 35 | `empty_throne` | Avail: global flag `zin_golden_king_dead`; `check zin_aenor_is_concord_dominion` or flag `zin_aenor_free_dominion`. stab 0.02; pp 25 | 100 |
| I | `for_order_and_the_crown` | For Order and the Crown | the_golden_king_is_dead | for_the_free_dominions, for_the_popular_host | 6,8 | 35 | `crown_gold` | Avail: `check zin_aenor_is_concord_dominion`. loyalty(8) | 60; ×1.5 if `check zin_aenor_dominion_steadfast`; ×0.6 if `_restless`; ×0.2 if `_defiant`; hist 100 |
| I | `for_the_free_dominions` | For the Free Dominions | the_golden_king_is_dead | for_order_and_the_crown, for_the_popular_host | 8,8 | 35 | `chain_broken` | camp(dominions, 5); loyalty(−5) | 40; ×0.25 if `check zin_aenor_dominion_steadfast`; ×1.5 if `_restless`; ×2.5 if `_defiant`; hist 0 |
| I | `for_the_popular_host` | For the Popular Host | the_golden_king_is_dead | for_order_and_the_crown, for_the_free_dominions | 10,8 | 35 | `banner_plain` | Avail: `check zin_aenor_host_available`. camp(host, 5); regard(10) | 50; ×1.5 if `check zin_eindil_friend`; ×0.3 if `check zin_eindil_resents` |
| J | `temples_and_almshouses` | Temples and Almshouses | charter_of_the_dominion | — | 12,7 | 35 | `house_first_light` | stab 0.03; footholds(1); event `houses_ask_for_land` (7 days) | 20; hist 40 |
| J | `a_watchful_court` | A Watchful Court | temples_and_almshouses | — | 12,8 | 35 | `eye_watchful` | Avail: global flag `zin_afrit_revealed`, or flag `zin_afrit_suspicious`. spirit `houses_watched` | 100 |
| K | `the_dark_comes` | **The Dark Comes** | — | — | 18,6 | 35 | `beacon` | Avail: Story. ws 0.10; spirit `the_dark_comes` | 100 |
| K | `answer_the_muster` | Answer the Muster | the_dark_comes | — | 16,7 | 35 | `banner_league` | Avail: `check zin_aenor_is_concord_dominion` or flag `zin_lost_cause_member`. army_xp 10; lost_cause(3) | 80 |
| K | `fortify_the_homeland` | Fortify the Homeland | the_dark_comes | — | 18,7 | 70 | `fort_wall` | bld bunker 2 @capital; mp 2000 | 80 |
| K | `refugees_on_the_roads` | Refugees on the Roads | the_dark_comes | — | 20,7 | 35 | `alms_bread` | event `refugees` | 60 |
| K | `against_the_deathless` | Against the Deathless | answer_the_muster / fortify_the_homeland | — | 16,8 | 70 | `lone_sword` | Avail: global flag `zin_zol_rising`. army_xp 10; tooltip "Ordinary arms break Zol's dead; they do not end them." | 80 |
| K | `swords_for_the_coalition` | Swords for the Coalition | fortify_the_homeland / refugees_on_the_roads | — | 18,8 | 70 | `alliance_rings` | Avail: global flag `zin_eindil_returned`. `if check zin_shared_bound_away_from_host`: aid; else coalition. regard(10) | 20; ×5 if `zin_eindil_regard` above −1 or `check zin_concord_overlord_with_host`; hist ×5 after 1757.1.1 |
| K | `after_the_last_crowns` | After the Last Crowns | against_the_deathless / swords_for_the_coalition | — | 18,9 | 70 | `olive_branch` | Avail: End. pp 75; stab 0.10; remove `the_dark_comes` | 100 |

**Total: 66 focuses.** Only branches whose `allow_branch` holds are shown, so a coastal Wild dominion on the southern marches sees about 50; landlocked Fotan about 40.

### Spirits

Every modifier below is in the 1.19.3 `modifiers_documentation.md`.

| Key | Name | Icon | Modifiers | Added / removed |
| --- | --- | --- | --- | --- |
| `league_banners` | Banners of the Lost Cause | `banner_league` | `war_support_factor` 0.03, `political_power_gain` 0.05 | permanent |
| `charter_loyalists` | Charter Loyalists | `seal_royal` | `stability_factor` 0.05, `drift_defence_factor` 0.10 | removed by `zin_aenor_secede_dominion` (request to the Aenor spec) |
| `concord_shield_drill` | A Shield for the Concord | `charter_shield` | `training_time_factor` −0.05, `army_org_factor` 0.03 | permanent |
| `full_granaries` | The Granaries | `granary` | `stability_factor` 0.03, `monthly_population` 0.05 | permanent |
| `prosperous_land` | A Prosperous Land | `coin_chest` | `production_factory_max_efficiency_factor` 0.05, `production_speed_buildings_factor` 0.05 | permanent |
| `road_wardens` | Wardens of the Roads | `scout_lantern` | `army_core_defence_factor` 0.05 | permanent |
| `trained_levies` | Levies Trained | `spear_levy` | `training_time_factor` −0.10 | permanent |
| `dominion_host` | The Dominion Host | `war_drums` | `army_org_factor` 0.05, `conscription_factor` 0.05 | permanent |
| `fishing_fleets` | Fishing Fleets | `fishing_boats` | `monthly_population` 0.05, `consumer_goods_factor` −0.01 | permanent |
| `ocean_route` | The Ocean Route | `sea_charts` | `trade_opinion_factor` 0.10, `naval_speed_factor` 0.05 | permanent |
| `free_council` | The Free Council | `council_table` | `stability_factor` 0.05, `political_power_factor` 0.05 | swapped |
| `free_council_2` | Council of the Lake Towns | `lake_town` | `stability_factor` 0.08, `political_power_factor` 0.10, `opinion_gain_monthly_factor` 0.10 | permanent |
| `lords_moot` | The Lords' Moot | `banner_plain` | `stability_factor` 0.03, `political_power_gain` 0.10 | swapped |
| `lords_moot_2` | The Moot Agrees | `handshake_oath` | `stability_factor` 0.05, `political_power_gain` 0.15, `drift_defence_factor` 0.10 | permanent |
| `governors_men` | The Governor's Men | `seal_chancellor` | `political_power_factor` 0.10, `stability_factor` −0.03 | permanent |
| `free_land` | A Free Land | `chain_broken` | `stability_factor` 0.05, `war_support_factor` 0.03 | swapped |
| `free_land_2` | Free and Apart | `banner_plain` | `stability_factor` 0.08, `drift_defence_factor` 0.20, `war_support_factor` 0.05 | permanent |
| `southern_watch` | Watch on the South | `eye_watchful` | `army_intel_factor` 0.10, `dig_in_speed_factor` 0.10 | permanent |
| `wall_road_trade` | The Wall Road | `caravan` | `trade_opinion_factor` 0.10 | permanent |
| `old_kin` | The Kin Stand with Us | `giant_hammer` | `army_armor_attack_factor` 0.10, `army_defence_factor` 0.05 | permanent |
| `houses_watched` | A Watchful Court | `eye_watchful` | `drift_defence_factor` 0.20 | permanent |
| `the_dark_comes` | The Dark Comes | `beacon` | `army_core_defence_factor` 0.10, `war_support_factor` 0.05 | until *After the Last Crowns* |

### Events (namespace `zin_shared_concord_dominions`)

All are fired by effects; none has a trigger or mean time. `FROM` is the dominion; the overlord is the Aenor realm it serves. The compiler's event format has no option conditions, so the petition helper chooses between event 1 (the asked charter can be granted) and event 6 (it cannot). Every picture below exists in the game and is ungated.

| Key (id) | Title | To | Picture | Fired by | Options (effects; AI) |
| --- | --- | --- | --- | --- | --- |
| `charter_petition` (1) | A Petition from [FROM.GetName] | the overlord | `concord_council` | `zin_concord_petition_charter`, when `zin_concord_charter_grantable` holds | **Grant the charter**: `call zin_concord_grant_petition`; event_for FROM `charter_granted` (AI base 10; ×4 if `check zin_aenor_king_alive` and `check zin_concord_petition_is_golden`; ×8 if `check zin_aenor_ruled_by_dominions` or `check zin_aenor_ruled_by_host`). **Confirm the old charter**: for_country FROM loyalty(3); pp −10; event_for FROM `charter_confirmed` (AI 20; ×3 if `check zin_aenor_ruled_by_faithful`). **Refuse**: for_country FROM loyalty(−8); pp 10; event_for FROM `charter_refused` (AI 50; ×0.2 if ruled by the Dominions or the Host) |
| `charter_granted` (2) | Parim Grants the Charter | FROM | `concord_council` | option 1 of event 1 | One option, no effect (the grant is already done) |
| `a_land_asks_for_a_charter` (3) | [FROM.GetName] Asks for a Charter | the Aenor realm holding Parim | `concord_council` | `zin_concord_ask_for_charter` | **Grant the Charters of Parim**: `call zin_concord_admit_dominion` (AI 70) / **Parim has dominions enough**: nothing (AI 30) |
| `houses_ask_for_land` (4) | The Almoners Ask for Land | ROOT | `houses` | *Temples and Almshouses*, 7 days later | **Grant it**: stab 0.01 (AI 80) / **Politely refuse**: footholds(−1) (AI 20) |
| `refugees` (5) | Refugees on the Roads | ROOT | `generic_war` | *Refugees on the Roads* | **Open the gates**: mp 2000; stab −0.02; `if global flag zin_eindil_awake`: regard(5) (AI 60) / **Close the roads**: stab 0.02 (AI 40) |
| `charter_petition_held` (6) | A Petition from [FROM.GetName] | the overlord | `generic_court` | `zin_concord_petition_charter`, when `zin_concord_charter_grantable` fails (charter not open, or changed in the last 180 days) | **Confirm the old charter** and **Refuse**, as in event 1 (AI 60 / 40; Confirm ×3 under the Faithful) |
| `charter_confirmed` (7) | Parim Confirms the Old Charter | FROM | `generic_court` | Confirm in event 1 or 6 | One option, no effect |
| `charter_refused` (8) | Parim Refuses | FROM | `generic_court` | Refuse in event 1 or 6 | One option, no effect |

### Helper scripts

Tree-declared scripts go to `common/scripted_effects/zin_shared_concord_dominions.txt` and `common/scripted_triggers/zin_shared_concord_dominions.txt`; the `zin_shared_*` triggers go to `common/scripted_triggers/zin_shared_trees.txt` (one definition for all shared trees; the build fails if two trees declare the same name with different bodies). Script bodies name countries only through generated triggers (`zin_is_mirolon`, `zin_aenor_is_realm`) and flags, never tags.

**Used by the Middle Lands tier B trees** (names stable; listed in [00_contract_additions.md](../../04_mechanics/00_contract_additions.md)):

| Name | Kind | Arguments | Does |
| --- | --- | --- | --- |
| `zin_concord_add_own_loyalty` | scripted effect | `value` | If ROOT satisfies `zin_aenor_is_concord_dominion`: `zin_aenor_add_concord_loyalty` on ROOT with the same value; otherwise nothing |
| `zin_concord_petition_charter` | scripted effect | `charter` (`old`, `golden`, `shield`, `free`) | If ROOT is a Concord dominion: sets ROOT variable `zin_concord_petition_code` to the charter code; then `OVERLORD` gets event 1 if ROOT satisfies `zin_concord_charter_grantable`, else event 6. Otherwise nothing |
| `zin_concord_back_camp` | scripted effect | `camp` (`court`, `faithful`, `dominions`, `host`), `value` | If `zin_golden_king_dead` and not `zin_eindil_crowned`: in ROOT's overlord if it satisfies `zin_aenor_is_realm`, else in the Aenor realm holding Parim, `zin_aenor_add_camp_support` with the same camp and value. Before the King's death it does nothing (the mechanic computes support afresh at his death) |
| `zin_concord_ask_for_charter` | scripted effect | — | Fires event 3 to the Aenor realm that holds Parim, or to the original Aenor if none does, through the Aenor mechanic's `zin_aenor_event_for_parim` (decision F7) |
| `zin_concord_join_free_dominions` | scripted effect | — | The faction leader with flag `zin_aenor_free_dominion` (the Aenor spec's Free Dominions) runs `add_to_faction = ROOT` |
| `zin_shared_has_coast` | scripted trigger | — | `any_owned_state = { is_coastal = yes }` |
| `zin_shared_is_island_realm` | scripted trigger | — | `capital_scope = { is_island_state = yes }` |
| `zin_shared_borders_<region>` | scripted trigger family | — | `any_neighbor_country = { has_country_flag = zin_region_<region> }`; generated for `dead_lands`, `magical_lands`, `dark_lands` and any other region a shared tree asks for |

**Local to this tree** (proposed):

| Name | Kind | Scope | Does |
| --- | --- | --- | --- |
| `zin_concord_charter_grantable` | scripted trigger | dominion | No flag `zin_concord_charter_recent`, and by `zin_concord_petition_code`: old always; golden if the overlord has flag `zin_aenor_golden_charters_open` (Aenor tree), its `zin_court_corruption` ≥ 40 and (`zin_aenor_king_alive` or the overlord `zin_aenor_ruled_by_court`); shield if global flag `zin_lost_cause_shield`; free if the overlord has flag `zin_aenor_free_charters_open` (Aenor tree) or is ruled by the Dominions or the Host. This is the Aenor spec's charter table |
| `zin_concord_petition_is_golden` | scripted trigger | overlord (event) | `FROM` has `zin_concord_petition_code` = 1 |
| `zin_concord_has_golden_charter` | scripted trigger | country | `has_idea = zin_concord_charter_golden` |
| `zin_concord_grant_petition` | scripted effect | overlord (event) | FROM: `zin_aenor_set_charter` with FROM's petition code; FROM loyalty +10 (+3 for golden); FROM timed flag `zin_concord_charter_recent` for 180 days. For golden the overlord also gains pp 50 and `zin_aenor_add_court_corruption` +2 |
| `zin_concord_admit_dominion` | scripted effect | Aenor realm (event) | `puppet = FROM`, then `set_autonomy = { target = FROM autonomy_state = zin_autonomy_chartered_dominion }`; `add_to_faction = FROM` if ROOT leads a faction; FROM: `zin_aenor_set_charter` old, `zin_concord_loyalty` set to 60 |
| `zin_concord_parim_takes_charters` | scripted trigger | any | An Aenor realm controls a `zin_is_site_parim` state and is not `zin_aenor_ruled_by_faithful` |
| `zin_concord_can_join_free_dominions` | scripted trigger | country | `is_in_faction = no`, and a country with flag `zin_aenor_free_dominion` is a faction leader |
| `zin_concord_owns_wall_state` | scripted trigger | country | `any_owned_state = { zin_is_site_great_wall = yes }` |
| `zin_concord_dark_rising` | scripted trigger | any | `check_variable = { global.zin_gathering_dark > 39 }` |
| `zin_concord_overlord_corrupt` | scripted trigger | dominion | `OVERLORD` has `zin_court_corruption` ≥ 60 |
| `zin_concord_overlord_with_host` | scripted trigger | dominion | `OVERLORD` is `zin_aenor_ruled_by_host` or `zin_aenor_ruled_by_captains` |
| `zin_shared_bound_away_from_host` | scripted trigger (generic, `zin_shared_trees.txt`) | country | ROOT is a subject whose overlord is not `is_in_faction_with = var:global.zin_eindil_host`, or ROOT is in a faction that does not include `var:global.zin_eindil_host`. Such a country sends aid instead of joining the coalition |

Variables and flags this tree owns: country variable `zin_concord_petition_code` (0–4); timed country flag `zin_concord_charter_recent` (180 days; S9 timed flags). The Aenor spec's reissue (`zin_aenor_set_charter`) sets the same flag when it swaps a charter, so petitions and decisions share one cooldown.

## Implementation

| Path | Written by | What |
| --- | --- | --- |
| `docs/design/focus/shared_concord_dominions.json` | authored data, staged by the builder | Tree data: `"tier": "shared"`, the eighteen country names, focuses, spirits, events and the tree's scripted effects and triggers above |
| `common/national_focus/zin_shared_concord_dominions.txt` | `modules/focus_compiler.mjs` | One `focus_tree` with the eighteen generator-resolved tags in `country` (factor 100 each) |
| `common/ideas/zin_focus_shared_concord_dominions.txt` | same | The 22 spirits |
| `events/zin_shared_concord_dominions.txt` | same | Events 1–8 |
| `common/scripted_effects/zin_shared_concord_dominions.txt`, `common/scripted_triggers/zin_shared_concord_dominions.txt`, `common/scripted_triggers/zin_shared_trees.txt` | same | Helper scripts above |
| `localisation/english/zin_focus_shared_concord_dominions_l_english.yml` | same (UTF-8 with BOM) | Names, descriptions, tooltips and event text with `[ROOT.GetName]`, `[ROOT.GetAdjective]`, `[FROM.GetName]` |

Everything is applied in the builder's one transaction through `tools/content/apply.mts`. The compiler drops these eighteen countries from the interim Long Peace tree that `modules/vanilla_removal.mjs` writes. Raw blocks: none.

**Names this tree reads from other specs.** Aenor mechanic: `zin_aenor_is_concord_dominion`, `zin_aenor_is_realm`, `zin_aenor_king_alive`, `zin_aenor_host_available`, `zin_aenor_free_dominions_exist`, `zin_aenor_ruled_by_court/_faithful/_dominions/_host/_captains`, `zin_aenor_dominion_steadfast/_restless/_defiant`, `zin_aenor_add_concord_loyalty`, `zin_aenor_add_court_corruption`, `zin_aenor_set_charter`, `zin_aenor_add_camp_support`, `zin_aenor_free_dominion` (flag), `zin_concord_charter_*`, `zin_concord_loyalty`, `zin_court_corruption`, `zin_lost_cause_shield`, `zin_lost_cause_member`, `zin_golden_king_dead`. Aenor tree: flags `zin_aenor_golden_charters_open`, `zin_aenor_free_charters_open`. Diplomacy: `zin_autonomy_chartered_dominion`. World systems: `zin_lost_cause_add_strength`, `zin_gathering_dark`, `zin_rules_is_historical`. Afrit: `zin_afrit_add_footholds`, `zin_afrit_suspicious`, `zin_afrit_revealed`. Eindil: `zin_eindil_add_regard`, `zin_eindil_join_coalition`, `zin_eindil_aid_host`, `zin_eindil_regard`, `zin_eindil_friend`, `zin_eindil_resents`, `global.zin_eindil_host`. Volgan and Mirolon: `zin_mirolon_add_proof`, `zin_mirolon_fallen`. Elves: `zin_elves_add_wall_grievance`. Peoples: `zin_tradition_middle_kingdom`, `zin_people_includes_giants`, `zin_people_includes_ents`. Map: `zin_is_site_parim`, `zin_is_site_great_wall`, `zin_region_<key>`.

**Advisors.** None added. Each country keeps the three generated councillors `modules/characters.mjs` gives it today, from the Middle Lands name pool, one of each trait that fits its stance: Wild realms `zin_adv_road_warden`, `zin_adv_muster_master`, `zin_adv_merchant_prince`; Safeton `zin_adv_merchant_prince`, `zin_adv_envoy`, `zin_adv_sage`.

**Art.** Every icon is a catalog key in the game today ([../02_icon_catalog.md](../02_icon_catalog.md)); every event picture is an ungated key in the game today. No new art is needed.

## AI

- **Historical:** root; B and A in the first two years (seat, read aloud, levy, highway, loyalists); E by ideology; D for coastal realms; C from 4A 1750; J *Temples and Almshouses* (40). At the King's death *For Order and the Crown*. K whenever available; *Swords for the Coalition* after 1 Deepwinter 4A 1757 for every country not already fighting beside the Host.
- **Petitions:** never under the historical rule; otherwise mostly when loyalty is below 40.
- **Free lands:** Fotan takes *Free and Apart* (historical) and never asks for a charter under the historical rule. A seceded dominion takes *Join the Free Dominions* at once.
- Before `zin_golden_king_dead` no AI strategy toward war is added (start AI plan of [../../02_lore/01_start_situation.md](../../02_lore/01_start_situation.md)).

## Acceptance

Build test (`npm test` in `tools/`):

1. The compiler builds the tree with 66 focuses, unique positions, every focus below its prerequisites, symmetric exclusions, days that are multiples of 7 within 1–20 weeks, catalog icons and no `raw` blocks; the coverage check maps exactly the eighteen countries to it.
2. Every `call` and `check` resolves to a scripted effect or trigger in the built files; every spirit modifier is in the 1.19.3 modifier documentation.
3. The secret scan finds no "Afrit", "Hidden Council", "Ilvane", "Eindil", "the Heir", "the Stranger" or "Man from the Ice" anywhere in this tree's localisation (compiler check 6 plus the Eindil scan of [../../09_validation/](../../09_validation/)).
4. `zin_concord_back_camp` does nothing before `zin_golden_king_dead` and adds to the named camp of the right Aenor realm afterwards (scenario test).

Isolated Linux run (one in-game year from 1 Thaw 4A 1748, decision S8):

5. Safeton sees *The Free Council*, not *The Lords' Moot*; Fotan sees *The Free March* and not *Under the Charter*; a landlocked dominion does not see *Harbours* (focus inspector on the staged files).
6. On 1 Thaw 4A 1748 no available focus declares war or makes a claim or a war goal; *The Thirty Days* and *The Dark Comes* are unavailable.
7. A scripted test: a dominion takes *Petition for a Free Charter* while the Golden King lives with AI Aenor and no `zin_aenor_free_charters_open`; Aenor receives event 6 (no Grant). With the flag set it receives event 1; after a Grant the dominion holds `zin_concord_charter_free` and `zin_concord_charter_recent`, and a second petition within 180 days reaches event 6.
8. Historical observer run: no dominion of this tree secedes before `zin_golden_king_dead`; at the King's death only Defiant dominions (loyalty below 25) leave, as the Aenor mechanic decides.

## Open questions

1. **Compiler support.** Settled by decisions S9, E1 and E4: `FROM` and `OVERLORD` targets; timed country flags; arguments as `zin_arg_<name>`; `allow_branch` under the E4 rule with the layout refresh.
2. **Fotan** (owner question, [OPEN_QUESTIONS.md](../../OPEN_QUESTIONS.md), "regions: middle and north" 12). Work proceeds on the proposal: a free land by choice, with *The Free March* as its story.
3. **Safeton's ocean route.** Proceeds on the proposal: game text says "the peaceful ocean route" (the roster's words) and never names the sea, so no map reading is needed.
4. **Rulers of Belurithon and Vothrim.** Proceeds on the proposal: rulers keep their generated names, and no text ties these countries to the proposed characters Tarec Belurith and Ilsabet Vothrim. Reported to the integrator as a new owner question.
