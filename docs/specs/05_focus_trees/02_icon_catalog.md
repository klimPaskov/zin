# Icon catalog

**Status:** Ready. Reviewed 19 October 2026 against CONVENTIONS "Status"; integrated 19 October 2026. **Priority:** 4 (keys), 5 (art). **Phase:** 4 (keys used by the compiler), 7 (final art review). All 175 icon keys and all 52 picture keys have accepted art in the game since commit ca01fa3.

## Purpose

Every focus, national spirit and event in ZIN names its art by a short key from this catalog. The compiler ([00_format_and_compiler.md](00_format_and_compiler.md)) checks the keys; the art pipeline ([08_art_and_assets/01_art_pipeline.md](../08_art_and_assets/01_art_pipeline.md)) generates the images. A shared catalog keeps 305 countries' trees consistent and keeps the art budget finite: 175 focus and idea icon keys and 52 event picture keys cover the whole game. Trees reuse keys freely. A tree that needs a new key adds it here first, and the key reaches the game only with its art (see "Adding a key").

## Lore basis

| Fact | Status | Source |
| --- | --- | --- |
| Start: the Golden King reigns, Eindil has not appeared, Afrit is unrevealed, Erdae seems at peace | owner-fixed | *The Campaign of 4A 1748* |
| People know the Deliverer, not Afrit; his true form is not shown to the world before the reveal | established | *Fourth Age Canon Register* |
| Zol has no body; nothing may name, rank or show his servants; the three orders are Great Spirits, Lesser Spirits and New Gods | established | *Zol*, *Spirits and Their Ranks*, [zols_mistake.md](../04_mechanics/zols_mistake.md) |
| Horos: yellow-green armour, blue eyes, thorn-like helm, large blue sword, green crystal (Glo) in his breast. The owner's drawings are not used as generation references until the owner agrees (decision A6; owner question 14); pictures follow the established text | established | *Horos Visual References* |
| Golbran is small, purple and humanoid; no other feature is established | established | *Golbran* |
| Dragons come from Dragon Mountain and form no country | established | *Peoples of Erdae* |
| The Necklace of the Abyss is established; the Ring of Doors, Crown of Witnesses and Bracelet of the First Seal are proposed names | mixed | *Afrit's Collected Artifacts* |
| The Mirror of First Rain, the Houses of the First Light, the Lantern Chain, the Bridge of the Three Oaths, griffins | proposed | vault notes and specs |
| Every key, every description and every picture subject below | **proposed** | this spec |

Open questions stay open in art: no picture shows Dardan's location, which arm Eindil loses, Volgan's spirit after his body breaks, who keeps Furviatlon, the Gala elves as Sunhot elves (or not), Ein's sons as elder and younger, or Zol in any form.

## Design

### Rules for all art in the catalog

1. **No forbidden figure.** No icon or picture shows the face or figure of Afrit or Aurevan, Zol, a servant of Zol, or the New Gods. Eindil appears only in event pictures gated on his flags (table below), never in a focus or idea icon. Afrit's demonic form appears only in pictures gated on `zin_afrit_revealed`.
2. **Every icon is safe for every viewer.** Players can view any country's focus tree and spirits. So every focus and idea icon is safe to show to anyone at any date. An icon whose meaning could hint at the secret (`necklace_deep`, `throne_ashen`, `eastern_throne`, `mask_veiled`) shows only an object, and the tree uses it on a focus whose text is two-faced (the Worshipdom spec's scripted localisation).
3. **Two-face and story icons.** A focus may name two icons: `"icon": { "default": "censer", "after": [ { "global_flag": "zin_afrit_revealed", "icon": "throne_ashen" } ] }`. The compiler writes a dynamic focus icon (`icon = { GFX_… = { has_global_flag = … } GFX_… = yes }`, `dynamic = yes`). Global flags only, so every viewer sees the same face.
4. **Gated pictures.** An event picture with a gate flag may only be used by an event that cannot fire before that flag: the event's trigger requires the flag, every effect that fires it sits behind the flag, or the effect that fires it sets the flag first (decision E5). The compiler checks this; anything it cannot prove is a reviewed warning.
5. **One style** (decisions A2–A4). Focus and idea icons are one painting per key: a single object or emblem on a dark enamel field inside a round bronze-rimmed medallion, warm key light from the upper left, readable at 50%. Sheets are generated on flat black. The focus icon is the whole medallion with its outline as alpha; the idea icon is a square crop of the enamel field. Event pictures are painted scenes in a muted palette. Every prompt carries the frame "no signature or maker's mark; corners and bottom edge hold only plain ground", "no lettering" and "no real-world religious symbol".
6. **Peoples and regions by palette.** Middle Lands gold and red; North Lands sea-green and iron; Cold Lands white and pale blue; West Lands green and brown; East Lands ochre and turquoise; Dark Lands rust and black; Dead Lands ash and ember; Magical Lands silver and leaf-green; Lands of the Sun white gold; the Mistake black and cold grey.

### Naming

These are the names the game uses today (`SPRITE` in `tools/content/modules/presentation.mjs`).

| Asset | Key form | Sprite | File | Size |
| --- | --- | --- | --- | --- |
| Focus icon | `<key>` | `GFX_focus_zin_<key>` and `GFX_focus_zin_<key>_shine` | `gfx/interface/goals/zin/<key>.dds` | 100 × 88, alpha outside the medallion |
| Idea icon | same `<key>` | `GFX_idea_zin_<key>` (the idea writes `picture = zin_<key>`) | `gfx/interface/ideas/zin/<key>.dds` | 64 × 64, opaque |
| Event picture | `<key>` | `GFX_zin_evt_<key>` | `gfx/event_pictures/zin/zin_evt_<key>.dds` | 210 × 176 |
| News picture | same `<key>` | `GFX_zin_news_<key>` | `gfx/event_pictures/zin/zin_news_<key>.dds` | 397 × 153 |

All files are uncompressed A8R8G8B8 DDS without mipmaps. Keys are lowercase letters, digits and underscores, unique across focus/idea keys and unique across picture keys. Specs that wrote `zin_evt_<key>` (the Afrit spec) mean the key without the prefix. Every spec names the focus sprite `GFX_focus_zin_<key>` (the reversed prefix of older drafts is retired). The fallback icon key is `generic`; the fallback picture key is `generic_court`.

The shine sprite mirrors the structure of the vanilla `goals_shine.gfx` definition (two scrolling animations of the game's own `gfx/interface/goals/shine_overlay.dds`, masked by the icon). The builder writes it for every focus key, because the engine looks up `<icon>_shine` for every focus.

**Reserved names.** The peoples module and the interim tree already use names in the same sprite families: ten people emblems `GFX_focus_zin_<people>` (with `_shine`) in `interface/zin_focus_icons.gfx` (written by `tools/content/modules/vanilla_removal.mjs`; used by the interim Long Peace tree and the vanilla focus bridges) and the people idea pictures `GFX_idea_zin_people_<people>` in `interface/zin_peoples.gfx`. So no catalog key may equal a people key (men, elves, sun_elves, orcs, trolls, giants, yeti, ents, the_dead, demons) or start with `people_`.

### In the game today

| Family | Keys | Art | Written by |
| --- | ---: | --- | --- |
| Focus and idea icons | 175 | all accepted: 15 sheets `icons-catalog-01` … `icons-catalog-15` (12 medallions each, the last 7), keys in table order below | `presentation.mjs` from `tools/content/data/presentation-cells.json` |
| Event pictures (standard crop) | 43 | all accepted | same |
| News pictures | 28 | all accepted | same |
| Picture keys in all | 52 | 19 "both", 24 standard only, 9 news only | same |

Every key's sprites point at its own texture; nothing falls back to `generic` or `generic_court` today. The cell map in `presentation-cells.json` lists the 175 icon keys in exactly the order of the tables below, and the 52 picture keys with their crop and gate.

### How a tree names its art

1. **Focuses.** Every focus names exactly one icon key. A tree spec records them in a `### Icons` section of its Implementation, as a table `| Branch | Focus → icon |` with one row per branch; each entry is the focus key followed by its icon key in backticks (for example: what_lorien_remembers `gala_sun`), and entries are separated by `; ` (model: [major/gala.md](major/gala.md)). A shared or regional tree may instead give an `Icon` column in its focus tables. The tree's JSON `icon` field carries the key; the compiler writes `icon = GFX_focus_zin_<key>`.
2. **Spirits.** A spirit uses the icon of the first focus, in table order, that adds, swaps in or times it, unless the tree's spirits table names an icon. A spirit that no focus adds (added only by events, decisions or a mechanic) must name its icon. The compiler writes `picture = zin_<key>`. Ideas owned by a mechanics spec name their icon in that spec.
3. **Events.** Every event names one picture key, in a `Picture` column of the tree's events table or an "Event pictures" paragraph. The compiler writes `picture = GFX_zin_evt_<key>` for a country event and `GFX_zin_news_<key>` for a news event; a news event may only use a news key, and a country event only a key with the standard crop.
4. **Two faces.** A two-face icon (rule 3) is written in the JSON as `"icon": { "default": "censer", "after": [ { "global_flag": "zin_afrit_revealed", "icon": "throne_ashen" } ] }` and in the spec's Icons section as the focus key, the default key, then "after `zin_afrit_revealed`:" and the second key (for example: hold_the_rites `censer` after `zin_afrit_revealed`: `throne_ashen`).
5. **No new key by accident.** A tree never names a key that is not in this catalog. A spec that wants a subject the catalog lacks uses the closest key and records the wanted key as a request; it becomes a key only through "Adding a key".

### Adding a key

1. Add a row to the right table below, with what it shows, and keep the key rules.
2. Add the key to a sheet in `tools/content/data/presentation-cells.json` (a new sheet `icons-catalog-16` onwards, 12 per sheet, or a new picture entry with its crop and gate) and to the art working copy's job file, which a test keeps identical.
3. Generate the sheet through the art pipeline, review it, and record the accepted review line in `art/source/provenance.jsonl`.
4. Until the review is accepted, the builder points the key's sprites at the fallback and warns once per key, so a tree can be built before its art exists. From phase 7 a release fails if any key a tree uses still falls back.

### Focus and idea icon keys

#### 1. Crowns and court (20)

| Key | Shows |
| --- | --- |
| `crown_gold` | A heavy gilded crown on red velvet: the Golden King's court |
| `crown_iron` | A plain iron circlet: a hard northern or frontier crown |
| `crown_broken` | A crown split in two: a lost throne or a broken line |
| `crown_aen` | An ancient, simple crown of pale gold with one white stone: the Crown of Aen |
| `crown_hailed` | A plain crown raised on many spear points, no faces |
| `throne_gold` | A gilded throne in an empty hall |
| `empty_throne` | A cold stone throne with nobody on it |
| `palace_parim` | Towers of Parim above the Great Lake |
| `feast_table` | A long table of gold plate and wine: the Golden Court's feasts |
| `ledger_coins` | An open ledger with coins and a quill: the treasury |
| `seal_royal` | A wax seal and ribbon: royal edicts |
| `sceptre` | A sceptre across a cushion: royal authority |
| `council_table` | A round table with seven empty chairs: a council or regency |
| `regency_seals` | Three hands holding one seal: a regency |
| `heir_rolls` | Old genealogy rolls and a lamp: the search for an heir |
| `charter_old` | An old charter with many seals: the Old Charter |
| `charter_golden` | A charter with a gold seal and a coin purse: the Golden Charter |
| `charter_shield` | A charter nailed to a shield: the Shield Charter |
| `charter_free` | A charter with its ribbon untied: the Free Charter |
| `charter_wall` | A charter on a battlement: the Wall Charter |

#### 2. Faith and the Deliverer (18)

All show only objects, places and anonymous crowds. None shows the Deliverer's face or any demon.

| Key | Shows |
| --- | --- |
| `sun_veiled` | A sun disc behind a thin veil: the Deliverer's public sign |
| `temple_parim` | A white temple dome with a sun finial |
| `hermitage_hills` | A small hermitage in terraced hills: the Zilin Hills |
| `house_first_light` | A hospital door with a lamp and a bread basket: the Houses of the First Light |
| `courier_pilgrim` | A pilgrim's staff, satchel and sealed letter |
| `censer` | A swinging censer with pale smoke |
| `hymn_choir` | Open hymn books before candles |
| `alms_bread` | Loaves handed out from a doorway: charity |
| `miracle_light` | A shaft of light on a kneeling crowd seen from behind |
| `birth_rolls` | Shelves of scrolls and a register: the birth rolls |
| `confessional` | A carved screen and a single candle |
| `seal_chancellor` | A chancellor's chain and seal on dark cloth |
| `reliquary` | A closed gold reliquary box |
| `crown_radiant` | A crown with sun rays: a crowned faith |
| `mask_veiled` | A smooth gold mask behind a veil |
| `eastern_throne` | A throne under an eastern canopy, empty |
| `throne_ashen` | A grey throne dusted with ash, empty |
| `palace_wards` | Sigils glowing faintly on palace doors |

#### 3. War by people (22)

| Key | Shows |
| --- | --- |
| `sword_shield` | Sword and round shield: line infantry of men |
| `spear_levy` | Bundled spears and a drum: a levy |
| `bow_archers` | A longbow and quiver |
| `knight_lance` | A lance with a pennon and a barded horse's head |
| `horse_cavalry` | A galloping horse in profile |
| `camel_rider` | A camel saddle and curved sword: Noris's camel warriors |
| `ranger_cloak` | A green cloak, bow and leaf brooch: Selen's rangers |
| `elven_bow` | A tall silver bow with leaf-shaped limbs |
| `sunhot_spear` | A very long white-gold spear: the Sunhot elves |
| `orc_axe` | A notched iron axe and a bone charm |
| `goblin_raiders` | Torches and short blades in the dark |
| `troll_club` | A huge stone-studded club |
| `giant_hammer` | A great stone maul |
| `ent_branch` | A gnarled living branch with fresh leaves |
| `yeti_claw` | A white pelt and claw marks in ice |
| `demon_horn` | A curved black horn on ember stone: the Netherborn realms |
| `siege_trebuchet` | A trebuchet against a sky |
| `war_drums` | Two war drums and crossed sticks |
| `levy_muster` | Rows of tents and a muster banner |
| `war_council_map` | A campaign map with markers |
| `fort_wall` | A battlement of the Great Wall |
| `pass_fort` | A small fort in a mountain pass: Mirolon's passes |

#### 4. The sea (14)

| Key | Shows |
| --- | --- |
| `galley_oars` | A war galley under oars |
| `warship_sail` | A two-masted warship under sail |
| `great_warship` | A tall three-decked warship |
| `corsair_raider` | A low dark raider with furled sail |
| `harbour_lake` | A lake harbour with cranes: the Great Lake ports |
| `shipwright_yard` | A hull on the slip |
| `strait_chain` | A chain stretched across narrow water: the strait |
| `toll_house` | A toll house with scales on a quay |
| `lighthouse` | A lighthouse on a rock |
| `sea_charts` | Rolled sea charts and dividers: Triton's charts |
| `anchor_rope` | An anchor and coiled rope |
| `fishing_boats` | Small fishing boats at dawn |
| `storm_sea` | Waves breaking under a storm |
| `lake_town` | Houses on stilts by a lake: Mirolon's lake towns |

#### 5. Industry and wealth (16)

| Key | Shows |
| --- | --- |
| `forge_anvil` | Hammer and anvil with sparks |
| `foundry_fire` | A furnace pouring metal |
| `mine_cart` | A loaded mine cart in a tunnel |
| `quarry_stone` | Cut stone blocks and a crane |
| `roads_paved` | A paved road with a milestone |
| `canal_lock` | A canal lock gate |
| `market_stalls` | Awnings and goods in a market |
| `guild_hall` | A guild hall facade with banners |
| `coin_chest` | An open chest of coins |
| `granary` | A granary with sacks |
| `farm_sowing` | A ploughed field and seed bag |
| `caravan` | A caravan of pack animals on a road |
| `herds` | Grazing herds on a plain |
| `timber_mill` | A water-driven saw and stacked logs |
| `workshop_tools` | A carpenter's bench and tools |
| `university_hall` | A lecture hall with books and an astrolabe |

#### 6. Magic and artifacts (18)

| Key | Shows |
| --- | --- |
| `ward_circle` | A circle of runes glowing on stone |
| `rune_stone` | A standing stone carved with runes |
| `crystal_green` | A green crystal shining in darkness: Glo (no figure of Horos) |
| `staff_arcane` | A carved staff with a pale light: the arcanists |
| `scroll_sealed` | A scroll with a heavy seal |
| `book_lore` | A thick old book with metal clasps |
| `mirror_rain` | A still pool reflecting rain: the Mirror of First Rain (proposed) |
| `necklace_deep` | A dark necklace with a stone like a deep well |
| `ring_doors` | A ring with a tiny carved doorway (proposed artifact) |
| `crown_witnesses` | A thin crown set with many small eyes of glass (proposed artifact) |
| `bracelet_seal` | A broad bracelet with a seal plate (proposed artifact) |
| `new_gods_light` | Beams of light from clouds, no figures |
| `lantern_chain` | A row of lanterns along a road: the Lantern Chain (proposed) |
| `healer_herbs` | Herbs, mortar and bandages |
| `potent_blade` | A sword edged with pale light: potent magic |
| `storm_veil` | A wall of storm cloud over a desert: the Veil of Storms |
| `glyph_fading` | A rune dissolving into mist: the Fading |
| `wizard_tower` | A slender tower with one lit window |

#### 7. Nature and the elves (16)

| Key | Shows |
| --- | --- |
| `forest_ancient` | Huge old trees in mist |
| `tree_silver` | A silver-barked tree with pale leaves: the Magical Forest |
| `elven_council` | Seats in a ring under trees: an elven council of houses |
| `gala_sun` | A sun over white towers: Gala |
| `sun_flowers` | Tall white-gold flowers: the Lands of the Sun |
| `dragon_mountain` | A smoking peak with circling wings |
| `dragon_wing` | One great wing against the sky |
| `griffin_rider` | A griffin in flight with a rider seen from below (proposed creature) |
| `white_deer` | A white deer in a glade |
| `river_ford` | Stepping stones across a river |
| `mountain_pass` | A road climbing between peaks |
| `snow_peak` | A snowy summit under stars |
| `ice_field` | A cracked plain of ice |
| `mushroom_grove` | Giant mushrooms in twilight: the mycids |
| `wild_hunt` | Hounds and horns in a forest |
| `kilinti_grove` | A grove where trees seem to lean together: Kilinti's ents |

#### 8. The dead and the dark (18)

Non-figurative where they touch Zol: sigils, islands, hulls, ranks of the dead seen from afar.

| Key | Shows |
| --- | --- |
| `grave_host` | Rows of graves with mist rising |
| `grave_field` | An old battlefield of barrows |
| `dead_crown` | A blackened crown on a skull-shaped rock |
| `silent_throne` | A dark throne in a hall of storms, empty |
| `black_compact` | Two black seals pressed together |
| `nether_gate` | A gate of red light in black rock |
| `abyss_stair` | Stairs descending into darkness |
| `banner_black` | A tattered black banner on a pike |
| `bones_risen` | A host rising from the earth, tiny on a far plain |
| `zol_sigil` | A cold grey sigil on black stone (Zol's mark; also his leader picture's motif) |
| `black_isles` | Black islands in a dark sea |
| `black_hulls` | Black hulls between islands, lights that are not fires |
| `dead_ranks_far` | Endless ranks of the dead seen from a far ridge |
| `order_great` | A tall sigil of three rings: the order of Great Spirits |
| `order_lesser` | A sigil of many small rings: the order of Lesser Spirits |
| `order_divine` | A sigil of a ring with rays: the order of New Gods |
| `ashen_waste` | Grey waste under a white sky: the Mistake |
| `ember_desert` | Red dunes under a storm: the Dead Lands |

#### 9. Diplomacy and intrigue (18)

| Key | Shows |
| --- | --- |
| `handshake_oath` | Two gauntlets clasped over a sword |
| `envoy` | A herald's tabard and staff |
| `scroll_treaty` | A treaty with two seals |
| `seal_wax` | A seal pressing hot wax |
| `banner_league` | Many small banners on one pole: a league |
| `banner_plain` | A single plain banner in wind |
| `alliance_rings` | Three interlocked rings |
| `olive_branch` | A branch laid on a sheathed sword: peace |
| `eye_watchful` | An eye painted on a watchtower door: intelligence |
| `beacon` | A beacon fire on a hill |
| `two_crowns` | Two crowns joined by one band: the Leren union |
| `tribute_chest` | A sealed tribute chest |
| `concord_circle` | Twenty-six small shields in a ring: the Concord |
| `chain_broken` | A broken chain: free dominions |
| `grey_ford` | Truce stones by a grey ford |
| `bridge_oaths` | A stone bridge with three carved hands (proposed site) |
| `scout_lantern` | A shuttered lantern and a scout's cloak |
| `warden_crown` | A crown hung on a watchtower peg: Mirolon's warden kings |

#### 10. Exploration and the journey (15)

No icon shows Eindil.

| Key | Shows |
| --- | --- |
| `compass_rose` | A compass rose on parchment |
| `map_unrolled` | An unrolled map of Erdae's coasts (no readable names) |
| `ship_voyage` | A ship far out at sea |
| `footprints_snow` | One line of footprints across snow |
| `ice_cavern` | An empty blue ice cave |
| `castle_ice` | A castle of dark stone in frozen hills: Yeldenne |
| `frozen_gate` | A gate sealed with ice |
| `traders_road` | A trading post at a fork in a road |
| `banner_laid_down` | A war banner laid on a table: a title given up |
| `shipwreck` | A wreck on a southern beach |
| `island_shrine` | A small shrine on an island rock |
| `lone_sword` | A sword standing in snow |
| `cliff_edge` | A cliff edge above mist |
| `exile_court` | A court gathered in tents |
| `generic` | A blank shield with an Erdae knot: fallback |

**Total: 175 keys** (including the fallback).

### Event picture keys

Standard pictures are 210 × 176; news pictures 397 × 153. "Both" means one generation cropped two ways (news from the whole picture, standard from a centred crop); "standard" has only `GFX_zin_evt_<key>` and "news" only `GFX_zin_news_<key>`. A gate means rule 4 applies; "hub-only events" means events of the Hidden Council's hub (Worshipdom) only, and "ending flag" means events that fire only after an ending is set (world tension spec). All 52 keys have accepted art.

| Key | Shows | Size | Gate |
| --- | --- | --- | --- |
| `generic_court` | A throne room with courtiers (fallback) | both | — |
| `generic_war` | Banners over a field at dusk | both | — |
| `generic_peace` | A market town in sunshine | both | — |
| `generic_sea` | Ships in a harbour | both | — |
| `generic_wilds` | A forest road | standard | — |
| `court_feast` | The Golden Court at a feast; the King small and distant | standard | — |
| `golden_court` | Gilded halls where offices are sold | both | — |
| `concord_council` | Lords of the dominions around a great table | standard | — |
| `lost_cause_triumph` | A parade of banners through Parim | both | — |
| `southern_warning` | A dusty envoy before laughing courtiers | standard | — |
| `black_ships_tale` | Fishermen telling tales by a fire | standard | — |
| `strait_toll` | Ships queuing at Sonargur's toll chain | both | — |
| `leren_envoys` | Northern envoys in a cold hall | standard | — |
| `grey_ford_truce` | Two western hosts at a ford under truce banners | standard | — |
| `dead_lands_storm` | A storm wall over red desert seen from a pass | both | — |
| `grave_muster` | Mist over barrows, figures rising far away | standard | — |
| `mirolon_passes` | A watchtower on a pass at night | standard | — |
| `black_isles_lights` | Lights among black islands at night | standard | — |
| `hermitage` | Pilgrims climbing to a hillside hermitage | standard | — |
| `houses` | A House of the First Light giving bread | standard | — |
| `council_chamber` | A dark chamber, hooded figures at a table, faces unseen | standard | hub-only events |
| `king_is_dead` | A black-draped royal bed and an empty crown cushion | both | `zin_golden_king_dead` |
| `coronation` | A coronation in Parim's temple; the crowned figure seen from far behind | both | `zin_golden_king_dead` |
| `thirty_days` | An empty throne with four seals on it | standard | `zin_golden_king_dead` |
| `man_in_ice` | Tribesfolk breaking open blue ice; the shape inside unclear | standard | `zin_eindil_awake` |
| `traders_road_south` | A trading caravan leaving the snows | standard | `zin_eindil_awake` |
| `war_king` | A western army acclaiming a cloaked leader seen from behind | standard | `zin_eindil_awake` |
| `storm_wreck` | A ship wrecked on a southern shore | standard | `zin_eindil_war_king` |
| `gala_court` | Gala's white court; an ancient elf king on his seat, nobody before him | standard | — |
| `cold_shore` | A landing on a frozen shore; bodies of the crew in snow | standard | `zin_eindil_named` |
| `yeldenne_hall` | The dark throne hall of Yeldenne, stone pillars, the green light of Glo, Horos seated, drawn from the established description only (decision A6) | standard | — (Horos is known at the start) |
| `glo_given` | Green light passing from an armoured giant to a kneeling man; the giant becoming dust | standard | `zin_horos_dead` |
| `last_crowns` | Five war banners converging on a city | news | `zin_war_of_last_crowns` |
| `western_crossing` | A great fleet crossing the central sea | both | `zin_western_crossing` |
| `zol_rising` | The dead coming ashore from black hulls, seen from a cliff | both | `zin_zol_rising` |
| `eastern_court` | A crowned figure in eastern robes before kneeling kings, face hidden by a veil | both | `zin_afrit_abandoned_aenor` |
| `unmasking` | A veil torn from a golden mask, darkness behind it | both | `zin_afrit_revealed` |
| `dragon_return` | A dragon flying over an army, its rider tiny | both | `zin_eindil_returned` |
| `volgan_broken` | A vast dark armour shattering on a plain | both | `zin_volgan_body_destroyed` |
| `vast_shadow` | A shadow eclipsing the sky over a battlefield; no form, no face | both | `zin_zol_manifested` |
| `cliff` | A cliff in storm, a broken banner below | standard | `zin_eindil_cast_down` |
| `palace_battle` | Fire and light in a palace hall | both | `zin_afrit_returned` |
| `crown_of_aen` | A crown lowered onto a cloaked head, seen from behind | both | `zin_eindil_crowned` |
| `ending_lost_cause` | Free banners around Parim at sunrise | news | ending flag |
| `ending_children_of_volgan` | A ruined world under storm, grave hosts on the plains | news | ending flag |
| `ending_ashen_throne` | A grey throne in a temple of ash, the faithful kneeling | news | ending flag |
| `ending_golden_court` | Parim gilded and loud, an old king at a feast | news | ending flag |
| `ending_western_crown` | Western banners on Parim's walls | news | ending flag |
| `ending_strait_master` | Leren fleets holding the strait | news | ending flag |
| `ending_eastern_king` | One eastern crown over the caravan roads | news | ending flag |
| `ending_unfinished` | An open chronicle with blank pages | news | ending flag |
| `chronicle` | An illuminated chronicle on a lectern | standard | ending flag |

**Total: 52 picture keys.** The world tension spec's `gfx/event_pictures/zin_ending_*` files are these `ending_*` keys at the catalog's path.

### Requested keys (not yet in the catalog)

Other specs ask for these picture keys. They are **not** keys yet: until each goes through "Adding a key", the events that want it name the fallback in the last column, and the compiler accepts only the fallback. Subjects are *proposed*.

| Wanted key | Shows | Gate | Use until added | Asked by |
| --- | --- | --- | --- | --- |
| `temple_parim_interior` | A white temple nave with sun windows, no figure | — | `hermitage` | [06_events/01_golden_king_and_succession.md](../06_events/01_golden_king_and_succession.md), [06_events/05_flavour_and_world.md](../06_events/05_flavour_and_world.md) |
| `gods_gathering` | Shafts of light from clouds over a fallen armoured man; no figures, no faces | `zin_volgan_struck_down_eindil` | `dragon_return` | [06_events/03_war_of_the_last_crowns.md](../06_events/03_war_of_the_last_crowns.md) (`zin_eindil.98`, `zin_world.45`) |
| `passes_burning` | Watchtowers burning on a mountain pass at dusk | `zin_war_of_last_crowns` | `mirolon_passes` | same |
| `rift_sails` | Sails on a narrow sea seen from a wooded shore | `zin_eastern_invasion` | `generic_sea` | same; [04_mechanics/elves_wall_and_dragons.md](../04_mechanics/elves_wall_and_dragons.md) |
| `dragon_roosts` | Dragons circling a smoking peak, seen from elven woods | — | `generic_wilds` | [04_mechanics/elves_wall_and_dragons.md](../04_mechanics/elves_wall_and_dragons.md) |
| `elven_moot` | Seats in a ring under silver trees | — | `generic_wilds` | same |
| `mirror_courtyard` | A spring in an old elven courtyard, rain on still water | — | `gala_court` | [04_mechanics/lands_of_the_sun.md](../04_mechanics/lands_of_the_sun.md) |
| `king_fallen_gala` | A white banner lowered over an empty elven seat | `zin_lorien_dead` | `vast_shadow` | same |
| `desert_envoys` | Envoys with camels and banners before a desert court's gate; no figure of a ruler | — | `generic_court` | [shared/shared_east_lands.md](shared/shared_east_lands.md) |
| `orc_hall` | Orc chiefs around a fire-pit in a long timber hall; no faces in close view | — | `generic_court` | [shared/shared_dark_lands.md](shared/shared_dark_lands.md) |
| `cold_steading_moot` | A clan moot in a timber hall in the snow | — | the events' current keys | [shared/shared_cold_lands.md](shared/shared_cold_lands.md) |
| `west_freehold_hall` | A freehold's timber hall with horses in the yard | — | the events' current keys | [shared/shared_west_lands.md](shared/shared_west_lands.md) |
| `tritons_pirate_trial` | A corsair crew in chains on an island quay before chart-house galleys | — | the events' current keys | [shared/shared_tritons_islands.md](shared/shared_tritons_islands.md) |
| `mistake_wastes` | Grey waste under a white sky; no figure | — | `black_isles_lights` | [major/zol.md](major/zol.md) |
| `nafeher_hall` | A dark hall at Nafeher in storm light, an empty seat; no figure of Volgan | — | the events' current keys | [major/volgan.md](major/volgan.md) |
| `abyss_depths` | A stair into red-lit darkness | — | the events' current keys | same |
| `desert_court` | Furvior's tented court in the desert | — | `generic_court` | [major/noris.md](major/noris.md) |
| `caravan_road` | A camel caravan on a desert road | — | `generic_wilds` | same |
| `counting_house` | Merchants at a counting-table with ledgers and coin | — | `generic_court` | [major/stabilo.md](major/stabilo.md) |
| `yeldenne_silent_hall` | The dark throne hall of Yeldenne, empty, the green light gone | `zin_horos_dead` | `generic_court` | [regional/yeldenne.md](regional/yeldenne.md) |

Other specs also ask for new crops or a wider gate of existing keys. These change the cell map's entry for the key (and need a new crop or a regeneration through the art pipeline); until then the events use the fallback named.

| Key | Change | Gate | Use until changed | Asked by |
| --- | --- | --- | --- | --- |
| `war_king` | Add a news crop (becomes "both") | `zin_eindil_awake` | `GFX_zin_news_generic_peace` | [06_events/02_eindil_journey.md](../06_events/02_eindil_journey.md) (`zin_eindil.35`) |
| `cliff` | Add a news crop (becomes "both") | `zin_eindil_cast_down` | `GFX_zin_news_generic_war` | [06_events/03_war_of_the_last_crowns.md](../06_events/03_war_of_the_last_crowns.md) (`zin_eindil.112`) |
| the eight `ending_*` keys | Add standard 210 × 176 crops `GFX_zin_evt_ending_<key>` (each becomes "both") | ending flag | the keys named in the asking spec (`chronicle`, `crown_of_aen`, `dead_lands_storm`, `unmasking`, `court_feast`, `generic_war`, `strait_toll`, `generic_peace`) | [06_events/04_endings.md](../06_events/04_endings.md) |
| `palace_battle` | Widen the gate to `zin_afrit_returned` **or** `zin_afrit_stand_in_parim` (the cell map's gate becomes a list; rule 4 accepts either flag) | either flag | `generic_war` on the stand-in-Parim route | [06_events/03_war_of_the_last_crowns.md](../06_events/03_war_of_the_last_crowns.md) |

No icon key is requested: every tier A tree maps its focuses to the 175 keys above.

## Implementation

### Files

All written by the content builder module `tools/content/modules/presentation.mjs` in the builder's one transaction through the shared atomic rewrite engine (`tools/content/apply.mts`). The module only finds, crops, masks, resizes and converts generated pixels.

| Path | Content |
| --- | --- |
| `tools/content/data/presentation-cells.json` | The catalog as builder data: each icon sheet with its grid and its keys in cell order; each picture key with its crop (`both`, `standard`, `news`) and its gate. A tracked copy of the art working copy's job files (`$ZIN_ART/jobs/icons-catalog-cells.json`, `events-catalog-jobs.json`); a test fails if they differ |
| this spec | What each key shows; the prompt actually used for each sheet is in `art/source/provenance.jsonl` |
| `interface/zin_catalog_focus_icons.gfx` | `GFX_focus_zin_<key>` for the 175 icon keys |
| `interface/zin_catalog_focus_icons_shine.gfx` | `GFX_focus_zin_<key>_shine` |
| `interface/zin_catalog_ideas.gfx` | `GFX_idea_zin_<key>` |
| `interface/zin_event_pictures.gfx` | `GFX_zin_evt_<key>` for the 43 standard-crop keys, `GFX_zin_news_<key>` for the 28 news-crop keys |
| `gfx/interface/goals/zin/<key>.dds`, `gfx/interface/ideas/zin/<key>.dds`, `gfx/event_pictures/zin/zin_evt_<key>.dds`, `gfx/event_pictures/zin/zin_news_<key>.dds` | The DDS files (sizes in "Naming") |
| `art/source/icons/icons-catalog-NN.png`, `art/source/events/<key>.png`, `art/source/provenance.jsonl`, `art/source/presentation_manifest.json` | The accepted generated sources, their provenance and the manifest of every shipped file with its operations |

Only sources with an accepted review line in `provenance.jsonl` are used. The old plan of a separate `docs/design/art/icon_catalog.json` is dropped: the cell map is the data, and this spec holds the descriptions.

### How the compiler reads the catalog

The focus compiler (`tools/content/modules/focus_compiler.mjs`, [00_format_and_compiler.md](00_format_and_compiler.md)) imports `loadCells()`, `SPRITE`, `FALLBACK_ICON` and `FALLBACK_PICTURE` from `presentation.mjs`. It takes the icon keys from the sheets, the picture keys, crops and gates from the events list, and writes sprite names with `SPRITE` so the two modules cannot drift.

### Fallbacks

A key whose sheet or picture has no accepted review points its sprites at `generic` or `generic_court`, and the builder warns once per sheet or picture. The fallback keys themselves must have art, or the build fails. Today nothing falls back.

### Compiler checks added by this catalog

1. Every focus `icon` and every spirit `icon` is one of the 175 icon keys; every event `picture` is one of the 52 picture keys.
2. A news event uses a key with a news crop; a country event uses a key with a standard crop.
3. A two-face icon uses only global flags.
4. A gated picture is only used by events that cannot fire before the gate (rule 4); anything the compiler cannot prove is a reviewed warning.
5. No focus or idea uses a picture key, and no event uses an icon key.
6. No icon key equals a people key or starts with `people_` (reserved names).
7. From phase 7, no key a tree uses falls back.

### Events, variables, game rules, defines

None.

## AI

None.

## Acceptance

1. `npm test` in `tools/` passes the presentation tests: 175 unique icon keys including `generic`, each with focus, shine and idea sprites and DDS files (focus 100 × 88 with transparent corners, idea 64 × 64 opaque); 52 unique picture keys with event and news sprites exactly as their crop says (43 and 28); every sprite texture is staged; no sprite name collides with another `.gfx` file in the mod (the people emblems included); the tracked cell copy matches the art working copy.
2. The key lists in this spec equal the cell map: the same 175 icon keys in the same order and the same 52 picture keys with the same crops and gates. A new test in `tools/content/presentation.test.mjs` parses this spec's key tables and compares them.
3. Every icon key named in a tree spec's Icons section, and every picture key named by an event spec, is a catalog key or a requested key with its fallback; the compiler enforces it on the JSON data.
4. The compiler builds every tree; with any key's art removed, it still builds and lists the missing art by key.
5. The art review of the accepted images finds no figure of Afrit, Aurevan, Zol, a servant of Zol or a New God, no Eindil in any icon, and no lettering (recorded in `provenance.jsonl`).
6. In the Linux run, a focus tree and an idea using catalog keys show their icons, not the fallback; from phase 7, `hoi4_focus_render` of each major tree shows its icons, not the fallback.

## Open questions

Decision A3 settled the style (medallions, not vignettes); decision A6 settled that the Horos pictures follow the established text until the owner says otherwise. Two owner questions remain ([OPEN_QUESTIONS.md](../OPEN_QUESTIONS.md), interface art validation 12 and short list 13):

1. **Griffins.** `griffin_rider` has art, but griffins are a proposed creature. Proposal the work proceeds on: no tree or event uses `griffin_rider` until the owner adopts griffins; the compiler warns if one does.
2. **The Crown of Aen.** `crown_aen` shows a proposed look (a simple pale-gold crown with one white stone). Proposal: trees may use it; if the owner describes the Crown, the key is regenerated under the same name.
