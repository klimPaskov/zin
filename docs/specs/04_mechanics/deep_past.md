# The deep past: the six fallen realms in play

**Status:** accepted design and implementation, owner decision K64 of 25 October 2026 on the addendum [k62_fallen_realms.md](../../plans/deep_history/k62_fallen_realms.md).
K64 adopts all six fallen realms and takes the recommended option of every question of the addendum's section 8, except where the decision row says otherwise (the islet at the Mothers' Mound, the diadem that Erco may wear, the Sea-Door that may be opened).
The lore lives in [10_fallen_realms.md](../02_lore/10_fallen_realms.md) and in the owner's vault (`docs/lore/vault/07 - History/`); this spec is the play.
**Owner of the code:** `tools/content/modules/deep_past.mjs` (build, checks), `tools/content/lib/deep_past_script.mjs` (script text), `tools/content/data/deep_past.json` (realms, tuning, every text).
**Handoff:** [k64_implementation_handoff.md](../../plans/deep_history/k64_implementation_handoff.md).

## 1. What it does

Six realms that were once very great live on in the present as knowledge held in pieces, places that can be reached at a cost, relics and a few dangerous ambitions.
Each fallen realm has its own loop and its own decision category, its heirs' focus branches lead into it, and each can be restored as a cosmetic identity on an existing tag.

| Fallen realm | Loop | Category | Restoration |
| --- | --- | --- | --- |
| Muzerar, the Low Country | the Three Keepings, the Two Counts, the dive at the Mothers' Mound | `zin_deep_low_country` | the Moot of Mothers: the Cursed Lands or the Bloody Forest as `zin_cosmetic_muzerar` |
| Tarkia, the Bridge Kingdom | the First Stair, the Two Gates, the treaty of passage, the Bridge Road | `zin_deep_two_shores` | Alerhia as `zin_cosmetic_tarkia` |
| Rhabtarkia, the Kalioth Crown | the old shafts, the diadem in the wall, the Old Tribute | `zin_deep_kalioth` | Erco as `zin_cosmetic_rhabtarkia` |
| Gromatrak, the Stone Road | the names on the doors, the old blame, the Road Moot, the Deep King, the seal or the open door | `zin_deep_sea_doors` | the Deep King's hold as `zin_cosmetic_gromatrak` |
| Margorodai, the Sea-Roads | the league's charts, whose Square, the lamp, the Square relit, the Grey Breath | `zin_deep_sea_roads` | Adel (the Charter's route) or Nondondor (the crown's route) as `zin_cosmetic_margorodai` |
| Heulufaenn, the Sunfields | ice-walks in the Long Light, finds, guides, kin over the neck and the sea, the king's hall | `zin_deep_ice` | Coldor (or Melkgard holding the hearth-stone) as `zin_cosmetic_heulfaenn` |

## 2. Rules every part keeps

- **No new tag.** Restorations are `set_cosmetic_tag` on the heir; the tag total does not change (S12).
- **No whole-world iteration.** The only schedule is `zin_story_tick_deep`, a block of `zin_story_tick` (convention C6, storyBlocks `deep` in `build.mjs`) that runs once a month on the world runner and names its realms; arrays (`global.zin_deep_oath_holders`, `global.zin_deep_awake_states`, `global.zin_deep_breath_states`) hold the few scopes it visits. The on_actions file holds only `on_startup`.
- **Most things remain unheard (K61).** Every event goes to the realm that acts, the realm a keeping, a moot or a treaty links to it, and its neighbours by a minor report (`every_neighbor_country`). No event is a news event, no event goes to every country, and no super event belongs to the deep past (K64 G4).
- **Sites by rule, not by number.** The map import renumbers the states, so every site is resolved at the start by a rule (a capital, the states a realm owns, their coast, their neighbours) into a state flag `zin_deep_site_<key>`; the rows are in [02_key_sites.md](../01_map/02_key_sites.md) section 3 and exported as `SITE_ROWS` for `modules/sites.mjs` (E7).
- **Knowledge layers.** The six own names (Muzerar, Tarkia, Rhabtarkia, Gromatrak, Margorodai, Heulufaenn and their forms, with Ozelkak, Qadurum, Barzoth, Tromahrim, Halgohavnai and Tawrhalwe) appear only behind their gates: the category names switch from the heir's own word to the realm's name through scripted localisation (`GetDeep<Loop>Title`), and the build refuses any other text that names them (`gatedNameProblems`). Loading tips never name them (`presentation.mjs` FORBIDDEN).
- **Dates before Aen.** Game text shows a date before Aen only as "long before Aen" (K64 G5); the build refuses a count of years before Aen in any text (`preAenProblems`), and the histories carry the authorial year in `beforeAen` with `year` 0. The one number learned in play is the Eldest Cairn's count, `global.zin_deep_cairn_stones` (7,436 on 1 Lumae 4A 1748, from the constants `night_ba` 620 and `start_count` 6,816, one more each new year).
- **Tuning in one place.** Every number is a key of `constants` in `data/deep_past.json`, staged as `common/script_constants/zin_deep_past.txt` (category `deep_past`) and written into the scripts by the builder.

## 3. The loops step by step

### 3.1 Muzerar: the Three Keepings

1. At the start the Cursed Lands keep the Cord (`zin_deep_keeps_cord`), Hirolon the Stone (`zin_deep_keeps_stone`) and Orohaf the Tide (`zin_deep_keeps_tide`).
2. The category opens for a seeker: the Cursed Lands (focus What the Cords Count), Hirolon (The Eldest Cairn), Orohaf (The Tide-Chambers Opened), the Bloody Forest (The Red Cords) and Aenor when the Lost Cause's scholar comes home from the edge of the downs (`zin_deep.18`, once the Cursed Lands have completed A Scholar at the Edge).
3. A seeker asks a keeper: **Ask the Cord-Mothers** (arms scaled by the asker's size, no claim on the downs, not at war), **Ask the Cairn-Keepers** (a levy and merchant fleets; no army inside the ring: no passage through Hirolon and none of its states held; the asker swears the Cairn-Oath), **Ask the Isle Houses** (Fleet Valour and a guarantee of Orohaf; Aenor confirms the Tide-Seats for Authority instead). The keeper answers by event (`zin_deep.21`, `.24`, `.27`) and the asker hears (`.22`/`.23`, `.25`/`.26`, `.28`/`.29`). A yes shares the keeping (`zin_deep_shared_*`) with `zin_opinion_keeping_given` both ways; a no sets a cooldown and an opinion loss.
4. Hirolon's answer depends on its focus: Speak the Count (`zin_deep_count_spoken`) or Keep the Silence (`zin_deep_silence_kept`: the Two Counts become impossible). An oath kept for `oath_years` proves the seeker (`zin_deep_oath_proven`, read by Hirolon's AI) and lets the giants give the **dike-stones** (`zin_deep.32`, `.33`). War on Hirolon, passage through it or a held Hirolon state breaks the oath (`zin_deep.34`).
5. A realm holding the Cord and the Stone receives **the Two Counts** (`zin_deep.30`): the low fields are charted (`zin_deep_low_country_charted`), the Nimlan coasts gain `zin_deep_low_fields_charted`, Cord-Reckoning is recovered, and the keepers hear (`zin_deep.31`).
6. **The dive at the Mothers' Mound** is open to a realm holding all three keepings, or to Orohaf in its own name after The Mound at Low Water: only in the months of the great tides (Lumae and Ailtal, `dive_month_a` 3 and `dive_month_b` 9, `zin_deep_tide_window`), with a harbour of level `dive_naval_base` at the shore and the shore owned or Orohaf's consent (the shared Tide). It costs Fleet Valour, levies and merchant fleets (twice as much while Orohaf answers to a master, when the queens' divers refuse) and takes a month. The storm roll (`zin_deep_dive_outcome`) raises the **Mothers' Stone** (relic, Dike-Craft recovered), finds the hall-door (the next dive goes better) or loses the divers (a year's cooldown, mourning at Borrak). The Veiled hold the stone's taking as theft unless the Cord was shared first.
7. **Taking instead of asking:** an enemy army in the eldest barrow burns the Last Cord (`zin_deep_cord_burned`) unless the mothers hid it; one in the Eldest Cairn scatters the count (`zin_deep_count_scattered`); every Orran realm, Hirolon and Orohaf take `zin_opinion_keeping_taken`, and Aenor taking a keeping adds the drowned inheritance. Two keepings destroyed close the Low Country for the game (`zin_deep_low_country_lost`).
8. **The Moot of Mothers** (the Cursed Lands or the Bloody Forest after its The Moot of Mothers focus): the Last Cord shown, the Two Counts made, the other Orran realm a subject or gone; the other realm's mothers consent by event (`zin_deep.42`) and are annexed, or refuse at a Calm cost. The realm takes the name Muzerar, the Peace of the Cords and claims (never cores) on the Konorar valley.
9. Hooks: the Bloody Forest's River Names Spoken claims the Vale states that border the Red Woods and sets the drowned inheritance; the almoners of the Deliverer may copy the cords (`zin_deep.19`), and only after Afrit's reveal does the realm learn where the copy went (`zin_deep.20`); Orohaf's Queens' Rite gives the Tide to Aenor or to the Orran heirs (`zin_deep.40`, `.41`); the nets of Orohaf bring up field-stones (`zin_deep.1`, `.2`).
10. **The Western Crossing:** when the first sailing makes for Aenor Isle and the defenders have charted the low fields, a share (`banks_share`) of the lift runs aground and the fleet loses `banks_fleet`, unless island pilots or Orohaf sail with the host (`zin_deep_crossing_banks`, called from `zin_west_sail`; `zin_deep.45`).

### 3.2 Tarkia: the Two Gates

1. Alerhia reads the First Stair (focus; `zin_deep.50`): the category opens, the scribes work in the vaults (a 90-day study penalty), and the focus prepares the dig and the Archive.
2. **Stones Under the Caps** (Alerhia, Luv-zhise or Lccimio): the ferrymen's leave (`zin_deep_ask_ferry_leave`, `zin_deep.51`/`.52`; Luv-zhise's focus Ferries over the Drowned Road makes its answer a yes), the mycids' passage (not at war with the Mushroom Forest and its opinion not below `mycid_opinion_min`), arms and levies for 120 days; a Spore Summer (`spore_chance`) can sicken the diggers and restart the work (`zin_deep.54`), else the western gate is cleared (`zin_deep.53`).
3. **The Pillars of the Fair** (Alerhia with Delbiz's consent, or Delbiz after its focus): the fair closes for 180 days; the eastern gate is cleared (`zin_deep.57`). With both gates cleared Alerhia receives the Gate-Stones (`zin_deep.58`: The Bridge Remembered, The Stair-Builders' Measure recovered).
4. **Ask the Archive** (both gates cleared; not in the eastern coalition, not ruling as Dominion, Eldafaen's opinion at least `archive_opinion_min`): Eldafaen answers (`zin_deep.60`/`.61`; its focus The Treaty Opened inclines it, The Treaty Kept Shut closes the ask for good). The treaty's holder swears the elves' peace of passage; war on Eldafaen or Lccimio breaks it (`zin_deep.62`), and the coalition crossing with Alerhia in it closes it for the game (`zin_deep.63`).
5. **Raise the Bridge Road** (the treaty's holder, both gate states held by it, its subjects or its league): a road and a harbour at both gates, `zin_deep_gates_cleared` on both, and the two shores bound by opinion.
6. **The Bridge Kingdom** (Alerhia): the road raised, the treaty held, both gates its own or its subjects', not in the coalition and never having taken The Crossing of the Rift; Calm above `bridge_kingdom_stability`.
7. **The coalition:** `zin_deep_coalition_weight`, called by `zin_east_compute_weight`, adds `coalition_treaty` (−40) for the treaty's holder, `coalition_stair` (+10) for a court that read the stair, holds no treaty and rules as Dominion or carries the rift whisper, and `coalition_diadem` (+20) for the diadem's wearer.

### 3.3 The Kalioth Crown: the diadem in the wall

1. Erco's Under the Seven Forts opens the category; **Open the Old Shafts** (levies and arms, 90 days) adds `zin_deep_kalioth_halls_opened` to the Kalioth state. Any other owner of that state can open the shafts too.
2. Erco decides the diadem's fate through its focuses (Wall It Up, Melt the Diadem, Wear the Diadem; `zin_deep.100` tells the court); any other owner decides by `zin_deep.101`. Each outcome calls `zin_deep_diadem_fate` (way 1, 2, 3): walled (Calm), melted (the Mine-Lords' Oath, The Kalioth Forge, Alerhia's goodwill), worn (the relic, The Kalioth Forge, claims, never cores, on the lands of Plutondo, Miaed and Pornivior, `zin_opinion_old_tribute` from Alerhia, Noris, Herez and Noleksun, the coalition's +20, and unrest in the halls under a crown the miners did not choose).
3. **The Old Tribute:** when Volgan marches or the Gathering Dark passes `tribute_dark`, Nafeher's envoy comes to the wearer (`zin_deep.105`); paying gives the wearer war goals on Herez and Noleksun while Volgan is at war with Aenor's crown. When Volgan's body is destroyed a wearer who paid falls (`zin_deep.108`): claims lost, the name dropped, resistance in the halls.
4. **The Kalioth Crown** (Erco, the diadem worn, the valley and the passes held, Calm above `kalioth_crown_stability`, Army Valour): the name Rhabtarkia, The Iron Height, a year of obedience work; **Demand the Old Tribute** gives a cause for war on a holder of the old lands that refuses (`zin_deep.107`). The Glacier Road focus sends scouts over the Melty Pass who find only empty forts (`zin_deep.110`).

### 3.4 Gromatrak: the Sea-Doors

1. Each hold's Read the Names on the Door focus (`zin_deep_read_door`, `zin_deep.150`, the others hear by `.151`); all four doors read recover Deep-Road Shoring for the holds.
2. **Settle the Old Blame** (Kunhrim pays arms; each western hold answers, `zin_deep.152`/`.153`) or **Yield the Old Blame** (a western hold pays Calm; `zin_deep.154`); the blame is settled when every standing western hold has answered, which removes `zin_opinion_old_blame`.
3. **Call the Road Moot** (all four holds stand and are at peace with each other, the blame settled): the others come or stay away (`zin_deep.155`); with all three the moot sits (`zin_deep.156`).
4. **A Deep King Again:** each hold votes for the caller or the greatest hold (`zin_deep.157`); the fourth vote crowns the Deep King (`zin_deep.158`): the name Gromatrak, the lamp, and the Road Moot as one league (a new league only when the holds stand in none).
5. **The Sea Is the Seal** (the Deep King, all four standing): the doors closed for the game, a lasting spirit in every hold (`zin_deep.159`).
6. **Open the Sea-Door** (the Deep King, not sealed, the Rites of Unbinding researched; Stored Essence, Army Valour and levies, a year): one road reopens to a hold the opener names (`zin_deep.160`), every other hold takes `zin_opinion_door_opened`. While the door stands open, each month a chance (`wake_chance`, lowered by an essence stock and the Lantern wards) wakes the deep (`zin_deep.170`): `zin_deep_the_deep_awake` lands on the opener's seat and spreads one state step a month (at most `wake_max_states`), reaching realms hear (`zin_deep.171`). The mission **Seal the Sea-Door** (`seal_days`) shuts it (`zin_deep.172`); when it times out the crisis spreads to the holds and every realm reached (`zin_deep.173`) until a hold or a reached realm pays **Seal the Deep at Any Cost**.

### 3.5 Margorodai: the Square relit

1. Adel's The League's Oldest Charts (or Nondondor's The High Speaker's Seat) open the category and the Square's secret (`zin_deep.200`, the Lens hears by `.201`).
2. **Whose Square?** Buy the reefs from Benan (`zin_deep.202`/`.203`; Benan's focuses make it sell or never sell), bring Benan into the Charter (`zin_deep.204`), or take the shore in war.
3. **Ask for the Lamp of the Lens** (a Charter member at war with no Charter member; `zin_deep.206`/`.207`), then **Relight the Square** (a harbour at the shore; Fleet Valour, merchant fleets, levies, 180 days): the Square relit (`zin_deep.208`), the Square's lamp, a study bonus toward The Old Sea-Roads, the isles' goodwill and the corsairs' grudge (`zin_deep.209`). Without The Healers' Case-Rolls the Grey Breath may return (`breath_chance`): the shore and the relighter's ports sicken, a monthly chance carries it to a neighbour's port (`zin_deep.210`, `.211`), and it passes after `breath_days` (`zin_deep.212`).
4. **The Sea-Roads:** Adel with the Charter's isles in its league, or Nondondor after Raerby and Seite agree to the crown's route (`zin_deep.213`, `.214`; Seite's focus makes it refuse); no sickness loose. The name Margorodai, the league's spirit, and a cause for war on the corsair isles (`zin_deep.215`).

### 3.6 Heulufaenn: the ice gives back

1. The first Long Light after a mild winter (the Cold Lands' winter roll `zin_cold.10` left `global.zin_cold_winter` at 0 and no winter season is open) tells the walkers who own Frozen Lands or far-ice states (`zin_deep.250`); Coldor's Songs of the Long Dark opens the category too.
2. **Send an Ice-Walk** (Coldor, Kvittumm, Horidor, Fearno or Melkgard; once a Long Light; never at war in the War of the Last Crowns; Army Valour, camp gear, levies, 60 days): a find (`zin_deep.251`), nothing (`.252`) or losses (`.253`), with odds raised by Kvittumm's guides (**Ask the Reindeer Clans for Guides**, `zin_deep.254`/`.255`; Kvittumm's own **Guides to the Old Halls**), Coldor's trained walkers and the ice giants' counsel (Nivaros's focus).
3. **Carry a Find to the West** (Gunwyn, `zin_deep.256`/`.257`) and **to the Isles** (Adel, `zin_deep.258`/`.259`); both received, the finder learns that three names are one land (`zin_deep.260`): `zin_opinion_boreal_kin` among the three, Sunfields Hull-Craft recovered for them (`zin_deep.261`).
4. A Cold Lands crown's third find in the Frozen Lands is the king's hall (`zin_deep.262`): the hearth-stone, which changes hands with the state where it is kept (`zin_deep.265`).
5. **The Sun Crown** (Coldor after its focus, or Melkgard, holding the hearth-stone, three finds, the three names, Horidor in its league or its subject): the name Heulfaenn, winter relief, claims on the free steadings, whose clans refuse (`zin_deep.263`).

## 4. Relics, restorations, opinions and state modifiers

| Kind | Identifiers |
| --- | --- |
| Relic spirits | `zin_deep_relic_last_cord`, `zin_deep_relic_mothers_stone`, `zin_deep_relic_mothers_stone_orohaf`, `zin_deep_relic_dike_stones`, `zin_deep_relic_gate_stones` (The Bridge Remembered), `zin_deep_relic_treaty`, `zin_deep_relic_diadem`, `zin_deep_relic_deep_lamp`, `zin_deep_relic_square_lamp`, `zin_deep_relic_hearth_stone` |
| Other spirits | `zin_deep_cord_moved`, `zin_deep_bridge_remembered_2`, `zin_deep_mine_lords_oath`, `zin_deep_kalioth_crown_spirit`, `zin_deep_compliance_work`, `zin_deep_mine_lords_rise`, `zin_deep_sea_is_the_seal`, `zin_deep_road_reopened`, `zin_deep_door_names`, `zin_deep_moot_gold`, `zin_deep_sea_roads_league`, `zin_deep_sun_crown_spirit`, `zin_deep_peace_of_cords`, `zin_deep_silence`, `zin_deep_stair_scribes`, `zin_deep_fair_closed`, `zin_deep_grain_for_clans` |
| Opinion modifiers | `zin_opinion_keeping_given`, `_keeping_refused`, `_keeping_taken`, `_drowned_inheritance`, `_river_names_claimed`, `_bridge_treaty`, `_treaty_broken`, `_shores_bound`, `_old_tribute`, `_tribute_refused`, `_diadem_melted`, `_old_blame`, `_door_opened`, `_oath_broken`, `_stone_taken`, `_square_relit_isles`, `_square_relit_corsairs`, `_grey_breath`, `_boreal_kin`, `_sun_crown_usurped` |
| State modifiers | `zin_deep_tide_chambers_opened`, `zin_deep_low_fields_charted`, `zin_deep_gates_cleared`, `zin_deep_old_ditches`, `zin_deep_kalioth_halls_opened`, `zin_deep_kalioth_unrest`, `zin_deep_the_deep_awake`, `zin_deep_square_relit`, `zin_deep_grey_breath`, `zin_deep_ice_find` |
| Cosmetic identities | `zin_cosmetic_muzerar`, `zin_cosmetic_tarkia`, `zin_cosmetic_rhabtarkia`, `zin_cosmetic_gromatrak`, `zin_cosmetic_margorodai`, `zin_cosmetic_heulfaenn` (name, `_DEF`, `_ADJ`) |

## 5. The elder technologies

Six recovered rows of the K51/K58 tree (`recovered: { flag, tip }` in `data/technologies*.json`; `modules/technologies.mjs` writes `allow = { custom_trigger_tooltip = { tooltip = <key>_recovered_tt has_country_flag = <flag> } }`, refuses a recovered row that is lost, locked, exclusive or outside the campaign years, and never puts one in a start package):

| Technology | Line | Year | Recovered by (flag) |
| --- | --- | --- | --- |
| `zin_tech_cord_reckoning` | Granaries and Fields | 1758 | the Two Counts (`zin_deep_recovered_cord_reckoning`) |
| `zin_tech_dike_craft` | Walls | 1753 | the Mothers' Stone or the dike-stones (`zin_deep_recovered_dike_craft`) |
| `zin_tech_stair_builders_measure` | Wagons and Roads | 1754 | the Gate-Stones or the treaty (`zin_deep_recovered_stair_builders_measure`) |
| `zin_tech_kalioth_forge` | Mail and Plate | 1762 | the diadem melted or worn (`zin_deep_recovered_kalioth_forge`) |
| `zin_tech_deep_road_shoring` | Walls, dwarves only | 1759 | all four doors read (`zin_deep_recovered_deep_road_shoring`) |
| `zin_tech_sunfields_hull_craft` | Sea-Craft | 1761 | Three Names, One Land (`zin_deep_recovered_sunfields_hull_craft`) |

Relighting the Square gives a study bonus toward the existing lost art `zin_tech_old_sea_roads` instead of a new row.

## 6. AI

Every weight is a constant of `data/deep_past.json` (`ai_*`) or a focus weight of the tree files; the guards (at war, short of Authority) come last in every `ai_will_do`, so they always win.
The asks are taken by the seekers at peace; the dive by a realm owning the shore; the ambitions at a moderate weight once possible; Open the Sea-Door only by a Deep King at war and losing (`surrender_progress` above 0.3); the seal at weight 50; the crisis seal at 80; relighting the Square without the Healers' Case-Rolls at a tenth of its weight; an ice-walk never in the War of the Last Crowns.
Event answers weigh opinion and the named conditions of the addendum's 6.11 (Orohaf gives the Tide to Aenor while the Golden King lives, to the Orran heirs after his death if Aenor is disliked; Eldafaen never opens the treaty to a coalition member or a Dominion; Benan never sells after The Square Belongs to Nobody; Seite always refuses the crown's route after its focus).
The focus weights of the six named scenarios and their MCP evaluation are in the handoff.

## 7. Achievements

Nine definitions in `common/achievements/zin_deep_past.txt` (`unique_id = zin_aoaz`, wiki *Achievement modding*), with names and descriptions `<id>_NAME` and `<id>_DESC`: `zin_ach_two_counts`, `zin_ach_mothers_moot`, `zin_ach_bridge_without_war`, `zin_ach_diadem_melted`, `zin_ach_kalioth_restored`, `zin_ach_sea_is_the_seal`, `zin_ach_what_knocks`, `zin_ach_square_relit`, `zin_ach_sun_crown`.
Their tracking flags are set by the loops (`zin_deep_keeping_taken`, `zin_deep_moot_took_parim`, `zin_deep_joined_coalition`, `zin_deep_melted_by_me`, `zin_deep_resealed_by_me`, `zin_deep_breath_ever`, `zin_deep_hearth_melkgard`).
The career profile that lists mod achievements is hidden by [06_career_honours.md](../07_interface/06_career_honours.md) (its open question 1); the definitions are inert until the interface shows the awards again.

## 8. Icons and pictures

Every sprite is registered now and points at a catalog icon until its art ships; the pending rows are in `docs/plans/zin-art/pending_from_integration.md` (section "The deep past").

| Asset | Sprite names | File and gfx |
| --- | --- | --- |
| Decision icons | `GFX_decision_zin_deep_<catalog key>` (one per icon the decisions use) | `interface/zz_zin_deep_past.gfx`, catalog textures `gfx/interface/ideas/zin/<key>.dds` |
| Category icons | `GFX_decision_category_zin_deep_<loop>` | same gfx |
| State modifier icons | `GFX_modifiers_zin_deep_<modifier>` | same gfx |
| Idea pictures | `GFX_idea_zin_<catalog key>` | the catalog's idea sprites |
| Event pictures | `GFX_zin_evt_<catalog key>` today; the twelve planned pictures `zin_deep_<subject>` of the addendum 6.13 | `interface/zin_events.gfx` (presentation module) |
| Technology icons | `GFX_zin_tech_<key>_medium` (the ZIN frame until the art ships) | `interface/zin_technologies.gfx`, `gfx/interface/technologies/zin/<key>.dds` |
| Achievement icons | none (the engine reads `gfx/achievements/<id>.dds`, `<id>_grey.dds`, `<id>_not_eligible.dds`) | `gfx/achievements/` |
| Flags of the six identities | `gfx/flags/<cosmetic tag>.tga` and its medium and small sizes | flags pass (K53, K63) |

## 9. Interactions

- **Cold Lands:** the winter roll (`zin_cold.10`, `global.zin_cold_winter`, `zin_cold_winter_season`) decides the Long Light; Horidor in Coldor's league is the Neck Road.
- **The East:** the coalition weight (`mech_east.mjs`); the eastern invasion (`zin_eastern_invasion`) and coalition membership close the treaty.
- **The Western Crossing:** the banks of the low fields (`mech_crossing.mjs`).
- **Volgan:** `zin_volgan_marches`, `zin_volgan_body_destroyed`, the Gathering Dark (`global.zin_gathering_dark`).
- **Afrit:** the almoners' copy is told only after `zin_afrit_revealed`.
- **Realm life:** the raiders' cause `zin_realm_cb_raiders` is reused for the Sea-Roads' cause against the corsair isles.
- **Lost arts:** the Rites of Unbinding gate the Sea-Door, The Healers' Case-Rolls prevent the Grey Breath, the Lantern wards lower the wake chance.

## 10. Future plans and suggestions

- Move the site rows to `modules/sites.mjs` when it exists and use its `nearest` rule for the Cursed Square shore and the Tromahrim shore (the shore over the drowned hall, which the deep's events could name).
- A regional super event for the deep waking was not adopted (K64 G4); if the owner wants one later, it goes through `hoi4-super-events`.
- Resource exports for the asks (salt and iron to the downs, gold for the moot, grain for the clans) would be closer to the addendum than the arms and timed spirits used now; HOI4 1.19 has `create_import`, which the economy slice could wrap.
- The Bridge Remembered focus and the moot focuses were cut from the trees at their focus caps (Alerhia 50, the holds' shared tree 70, the shared Cold Lands tree 70); the decisions carry those steps. A later cap review could move them back into the trees.
- The eastern raiders' word and the occupiers' forts of Herez and Noleksun could feed the Herez tree's war events.
