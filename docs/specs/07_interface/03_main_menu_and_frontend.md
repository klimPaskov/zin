# Main menu and frontend

**Status:** Draft. **Priority:** 5. **Phase:** 2 for the bookmark, country selection and rule text (they carry the calendar and the start situation); 7 for the art and music.

## Purpose

The frontend is the first thing a player sees and, today, it still says 1936: the Second World War backgrounds rotate, the bookmark shows a 1936 picture, and the country list is seven tags with no ideas or focuses. This spec defines every frontend screen of ZIN: the main menu (background art, layout, title, version, menu music hook), the bookmark screen, country selection (portraits, flags, descriptions, ideas and focuses, filters), the game rules and difficulty screens, the load and lobby screens, and the credits with ZIN's about text.

The chrome of these screens (buttons, frames, tiles) comes from the shared families of [02_full_ui_reskin.md](02_full_ui_reskin.md). This spec adds the frontend-only art and the few layout overrides.

## Lore basis

| Fact | Status | Source |
| --- | --- | --- |
| Start on 1 Thaw 4A 1748: the Golden King reigns, Eindil has not appeared, Afrit is unrevealed, Erdae seems at peace | owner-fixed | *The Campaign of 4A 1748* |
| Before Lorien names him, players read only "the Man from the Ice" | decided | [INTEGRATION_DECISIONS.md](../INTEGRATION_DECISIONS.md) D4 |
| The Worshipdom is shown as a Light temple-state of the Deliverer; its description never names Afrit or the Hidden Council | decided | D1 |
| Zol has no body; his realm is led by the emblem "The Will of Zol"; who keeps the Mistake is not known | established; emblem decided | *Zol*, S4 |
| The Golden King's personal name is not established | established | [02_ideologies_and_politics.md](../00_foundation/02_ideologies_and_politics.md) §6 |
| Realm facts used in the descriptions (seats, peoples, rivalries, the Concord, the Leren Compact, Mirolon's history, Horos and Glo, the elves never conquered) | established working table | *The Campaign of 4A 1748*, *Great Powers and Relations* |
| The bookmark name "The Fourth Age", every description text, background subject, layout, icon and credit line below | **proposed** | this spec, [01_start_and_calendar.md](../00_foundation/01_start_and_calendar.md) |

Every frontend screen is reachable before any game starts, so every word and picture on it must be safe for the whole campaign: no Afrit, no Eindil by name or picture, no Zol in any form, no war, no later-state picture.

## Design

### 1. Screen flow

| Step | Screen | Vanilla window | ZIN change |
| --- | --- | --- | --- |
| 1 | Main menu | `frontendmainview.gui`: `frontend_background`, `mainmenu_panel_upperleft`, `mainmenu_single_player`, `mainmenu_panel_bottom` | ZIN backgrounds, emblem and title; DLC, store, achievement and tutorial elements hidden |
| 2 | Bookmark | `frontendgamesetupview.gui`: `gamesetup_scenario_window` | One bookmark, "The Fourth Age" |
| 3 | Country selection | `gamesetup_interesting_countries_window`, `gamesetup_country_details` | Eight great realms, region filters, scrollable list, ZIN descriptions, ideas and focuses |
| 4 | Game rules, difficulty | `gamesetup_gameplay_settings_window`, `gamesetup_custom_gameplay_settings_window`, `game_rule_window` | The Erdae rule group with icons; vanilla rule icons reskinned |
| 5 | Loading | `load_screen.gui` | Frame from 02; pictures, quotes and tips from [02_loading_screens_and_quotes.md](../08_art_and_assets/02_loading_screens_and_quotes.md) |
| — | Load game, multiplayer, lobby, credits | `gamesetup_load`, `frontendmultiplayerview.gui`, `playerlobby.gui`, `frontendcreditview.gui` | Chrome reskin; credits get the ZIN block |

### 2. Main menu

#### 2.1 Backgrounds

ZIN ships three menu backgrounds (proposed; [01_interface.md](01_interface.md) §13 named one). The player can switch between them with the vanilla "change background" control; the default is the first.

| Key | Subject (prompt core) | Mood |
| --- | --- | --- |
| `zin_menu_parim` (default) | Parim at dusk seen from the water: white walls, gilded towers and temple domes above the Great Lake, lamps lit along the quays, a few sailing barges, calm water reflecting the gold | Wealth and peace at its height |
| `zin_menu_strait` | Sonargur's harbour on the Narrow Strait on a clear northern morning: grey stone quays, Leren warships at anchor with furled sails, gulls, the far shore faint across the water | Pride of the North |
| `zin_menu_wall` | The Great Wall of Aenor running over green hills into the mist, a gate tower in the foreground, beyond it the edge of an ancient elven forest under low autumn light | The old border, quiet |

Rules for all three:

- No figure larger than a distant silhouette, no face, no lettering, no banners with readable charges, no battle, no ships of the dead, no black islands, no veiled sun emblem in focus.
- None reuses a loading screen generation; they may show the same places from other viewpoints.
- **Composition for every screen shape.** The source is 1920 × 1440 (4:3); `frontend_background` keeps the aspect and fills the width, so 16:9 shows the central 1920 × 1080 band and 21:9 the central 1920 × 823 band. The subject sits inside the safe box x 160 to 1760, y 309 to 1131. The centre (x 760 to 1160, y 520 to 920), where the menu buttons sit, is calm and darker so the button stack reads. The upper left (x 0 to 520, y 0 to 420) holds the emblem and title and stays calm. The upper right (x 1600 to 1920, y 0 to 260) holds the developer logos.
- Generation 2048 × 1536 single, `quality: high`; owner approval required ([01_art_pipeline.md](../08_art_and_assets/01_art_pipeline.md) §6).

| Output | Size | Format | Path | Sprite |
| --- | --- | --- | --- | --- |
| Background | 1920 × 1440 | DDS A8R8G8B8 (BC3 fallback) | `gfx/loadingscreens/zin_menu_<key>.dds` | engine (by background key) |
| Selector thumbnail | 192 × 144 | DDS A8R8G8B8 | `gfx/loadingscreens/zin_menu_<key>_small.dds` | `GFX_zin_menu_<key>_small` (required name pattern `GFX_<key>_small`) |

`common/frontend/backgrounds/zin_backgrounds.txt` lists the three keys with empty bodies. `descriptor.mod` gets `replace_path="common/frontend/backgrounds"` so vanilla and DLC backgrounds never rotate in. `interface/frontendmainviewbg.gfx` and `frontendmainviewbg_basic.gfx` are re-authored so `GFX_frontend_bg`, `GFX_frontend_bg_basic` and `GFX_frontend_bg_basic_small` point at `zin_menu_parim`. Even if the engine falls back to `load_5.dds`, that file is a ZIN loading screen.

#### 2.2 Layout

`interface/frontendmainview.gui` is re-authored from a ZIN template that keeps every element name of the vanilla file (game 1.19.3.0). Changes:

| Element (vanilla name) | Vanilla | ZIN |
| --- | --- | --- |
| `frontend_background` | `GFX_frontend_bg` | unchanged (points at ZIN art) |
| `frontend_game_logo` in `mainmenu_panel_upperleft` | `logo_game.dds` 448 × 175 | Same sprite, texture replaced (R) by the **ZIN emblem**: a lettering-free device of a gilded eight-pointed star over an open book on a bronze roundel, transparent background. Generated on key, owner-approved |
| new `zin_menu_title` (in `mainmenu_panel_upperleft`) | — | `instantTextBoxType`, position x 20 y 200, `hoi_36header`, maxWidth 448, centre, text `ZIN_MENU_TITLE` ("ZIN") |
| new `zin_menu_subtitle` | — | x 20 y 248, `hoi_20bs`, maxWidth 448, centre, `ZIN_MENU_SUBTITLE` ("The Fourth Age of Erdae") |
| new `zin_menu_version` | — | x 20 y 280, `hoi_16mbs`, maxWidth 448, centre, `ZIN_MENU_VERSION` ("Version 0.1.0", written by the builder from `descriptor.mod`) |
| `mainmenu_single_player` buttons (`sp_continue_button`, `sp_new_button`, `sp_load_button`, `sp_back_button`) | `GFX_main_lobby_button` 864 × 36, 3 frames | Same; texture R (gilded iron) |
| `sp_tutorial_button` | Vanilla tutorial (Germany 1936) | **H**: moved off-screen, empty sprite, no text; `sp_back_button` moves from y 218 to y 138 |
| `mainmenu_dlc_ownership`, `owned_dlc_item`, `unowned_dlc_item`, DLC banners and medals (`GFX_frontend_banner_dlc*`, `GFX_frontend_medal_dlc*`) | Store and DLC list | **H** |
| `subscription_widget`, `subscription_widget_simp_chinese`, `subscription_widget_subscribed` | Subscription offer | **H** |
| `achievements_button`, `mainmenu_achievement_button` | Achievements | **H** (ZIN has no achievements) |
| `mainmenu_panel_upperright` logos (`frontend_dev_logo`, `pdx_int_logo`) | Developer logos | Engine-generic, unchanged |
| `mainmenu_social_buttons`, `social_view_interface_window` | Paradox account | Engine-generic, unchanged |
| `change_background`, `background_selection`, `background_selection_list` | Background switcher | Unchanged; lists the three ZIN backgrounds |
| `main_lobby_divider.dds` 312 × 15 | Divider | R: a bronze rule with a small star |

Hidden elements keep their names, as [02_full_ui_reskin.md](02_full_ui_reskin.md) §2.1 requires. Menu button labels keep the vanilla keys (`FE_CONTINUE`, `FE_NEW`, `MENU_BAR_LOAD`, `BACK` …); they contain no modern words.

#### 2.3 Menu music hook

The main menu plays the song named `maintheme` (vanilla `music/music.asset`, file `hoi4mainthemeallies.ogg`), and the in-game player draws from the base station in `music/_songs.txt`.

| Item | Value |
| --- | --- |
| Hook files | `music/music.asset` and `music/_songs.txt` re-authored by the builder (ZIN content only, no vanilla entries) |
| Station | `music_station = "base_music"` kept as the key, so the engine still finds the menu theme |
| Menu theme | `music = { name = "maintheme" file = "zin_maintheme.ogg" volume = 0.65 }` |
| Peace and war pools | `zin_peace_<n>` (chance `has_war = no`), `zin_war_<n>` (`has_war = yes`), `zin_dark_<n>` (chance rises with `zin_gathering_dark`, read through a global-variable check in the chance block) |
| Format | OGG Vorbis, 44.1 kHz, stereo, about −16 LUFS integrated, under 8 MB per track |
| Gate | The hook ships only when the builder config sets `music.enabled = true`, which requires an approved source for every track |
| Until then | Vanilla music plays (audio is not covered by the image-generation route); listed as engine-generic in the reskin inventory with this reason |

DLC music stations remain selectable in the in-game player because they live in DLC archives; ZIN does not try to remove them.

### 3. The bookmark screen

ZIN has one bookmark. The scenario window shows one entry, centred.

| Field | Value |
| --- | --- |
| File | `common/bookmarks/world.txt` (already under `replace_path`) |
| `name`, `desc` | `ZIN_BOOKMARK_FOURTH_AGE_NAME` "The Fourth Age"; `ZIN_BOOKMARK_FOURTH_AGE_DESC` (below) |
| `date` | `1748.3.1.12` (calendar spec); the entry's date line `FE_BOOKMARK_DATE` reads "1 Thaw, 1748" through the month name keys, with "4A" added by the calendar spec if the format allows |
| `picture` | `GFX_zin_bookmark_fourth_age` |
| `default_country` | Aenor (resolved from the name at build time) |
| `default` | `yes` |
| `filters` | `{ label }` (region labels, section 4.3) |
| `scrollable_country_list` | `yes` |
| `sort_unplayed_first` | `no` (ZIN has no "unplayed content" marks) |
| `effect` | Unchanged from today's builder (`randomize_weather` with a fixed seed) |

**Description** (`ZIN_BOOKMARK_FOURTH_AGE_DESC`, proposed): "Erdae has known peace for more than seventeen centuries. In Parim the Golden King feasts while his offices are sold, the temples of the Deliverer are full, and trade crosses the wide central sea. In the north fishermen tell of things on the black islands; in the south Mirolon's scouts watch the storms. Nobody who matters is at war. Not yet."

**Picture.** "The Fourth Age": the Golden Court's hall at a feast, gilded pillars and long tables, the King small and distant on his throne, temple banners with the sun motif along the walls, no readable faces ([01_interface.md](01_interface.md) §13).

| Output | Size | Format | Path |
| --- | --- | --- | --- |
| Bookmark picture | 180 × 104 (measured from `select_date_1936.dds`; this corrects the 1920 × 1440 figure in the art pipeline table) | DDS A8R8G8B8 | `gfx/interface/bookmarks/zin_fourth_age.dds`, sprite `GFX_zin_bookmark_fourth_age` in `interface/zin_frontend.gfx` |
| Defaults | same 180 × 104 | DDS | `gfx/interface/select_date_1936.dds` and `select_date_1939.dds` replaced with the same picture (R), so the `.gui` default sprite can never show 1936 art |
| Source | 1536 × 1024 single, cropped (`cover`) to 180:104 | | |

The scenario window's frame (`select_date_bg.dds` 579 × 512, `bookmark_entry_bg.dds` 464 × 211 in 2 frames of 232 × 211) is R in the frontend family: a bronze-framed parchment (light class, because the bookmark description is dark typewriter text in vanilla).

### 4. Country selection

#### 4.1 Layout facts (vanilla, measured)

| Area | Vanilla | Capacity |
| --- | --- | --- |
| Great realms row (`countries`) | Entries 150 × 274 (`country_selection_entry.tga` 300 × 274, 2 frames: normal, selected); leader portrait at 0.75 scale (117 × 158) at x 17 y 22; flag 82 × 52 at x 34 y 188; name at y 247, max 131 px | 8 entries in the 1225-px window |
| Filter buttons (`filters`) | `country_filter_entry.dds` 298 × 34, 2 frames | about 8 buttons at 149 px |
| Medium row (`countries_medium`) | `country_selection_minor_entry.dds` 276 × 97, 2 frames (138 × 97) | 8 |
| Mini list (`countries_mini`) | `diplo_countrylist_flag_frame_mini.dds` 118 × 44, 2 frames (59 × 44); slots 52 × 38 | 23 × 2 visible, scrollable with `scrollable_country_list` |
| Details (`gamesetup_country_details`) | Nation title `hoi_24header` max 340; leader, ideology, government, elections, ruling party lines; history text at x 810 y 502, max width 380; three spirits and three focuses | — |
| Background | `country_selection_bg.tga` 1225 × 728 | — |

#### 4.2 The great realms (row of eight)

Eight realms with the deepest content and the clearest starting stories (proposed):

| Order | Realm | Ideology shown | Leader shown | Portrait |
| ---: | --- | --- | --- | --- |
| 1 | Aenor | Dominion (Golden Court) | The Golden King | `<Aenor tag>_zin_ruler` large portrait |
| 2 | Lerendor | Dominion (High Crown) | its ruler | ruler portrait |
| 3 | The Magical Forest | Light (Elder Kinship) | its council's speaker | ruler portrait |
| 4 | The Worshipdom | Light (Sanctuary) | Aurevan the Deliverer | `zin_aurevan` in its **public** state only; the characters spec decides the picture (proposed: a robed, veiled figure whose face is not shown) |
| 5 | Mirolon | Light (Warden Host) | its ruler | ruler portrait |
| 6 | Yeldenne | Light (Warden Host) | Horos | `zin_horos` (established look, owner-approved) |
| 7 | Volgan | Shadow (Dread Lordship) | Volgan | `zin_volgan` |
| 8 | Zol's Mistake | Shadow (Grave Dominion) | The Will of Zol | `zin_zol_will` emblem portrait: no figure, no body, no servant |

Each entry lists three national spirits and three focuses. The builder takes the spirits from the country's starting ideas in their spec order and the focuses from the three focuses its tree data marks `"bookmark": true`; the build fails if fewer than three exist or if a focus's default name is not its public face (two-face focuses of the Worshipdom show only the public name; the frontend never evaluates scripted localisation).

**Descriptions** (`<TAG>_ZIN_FOURTH_AGE_DESC`, proposed; each under 420 characters):

| Realm | Text |
| --- | --- |
| Aenor | "The Middle Kingdom. From Parim the Golden King rules the oldest crown of men and leads the Concord of twenty-six chartered dominions. The offices are for sale, the treasury pays for feasts, and the temples of the Deliverer are full. Seventeen centuries of peace have made Aenor rich, proud and careless." |
| Lerendor | "The united crown of Lerendor and Lerenwaith holds the Narrow Strait from Sonargur and leads the Leren Compact. An old treaty binds the North to defend Aenor in war. Leren kings still remember the toll quarrel of 4A 1716, and wonder what the treaty is worth." |
| The Magical Forest | "The oldest and most peaceful realm of the elves, never conquered, not even by Elzon. A council of ancient houses governs beneath trees older than Aenor. Behind the Great Wall the forest keeps its own counsel, as it always has." |
| The Worshipdom | "In the Zilin Hills stands the temple-state of the Deliverer, the god who saved the Fourth Age. It holds three valleys and almost no army. Its pilgrims, couriers and Houses of the First Light serve in every court of Erdae, and every court is glad of them." |
| Mirolon | "Volgan conquered Mirolon in the First Age, and Mirolon is free again. Its watchtowers face the storms of the Dead Lands. Its scouts send warnings north that no court believes." |
| Yeldenne | "In Mp'E, the frozen north of the Cold Lands, Horos sits in the Castle of Yeldenne with Glo in his breast. Few travellers reach his hall, and fewer bring back its tales." |
| Volgan | "The northern courts call the Lord of the Dead Lands a spent legend. From Nafeher, behind the storms and heat of the south, Volgan rules the Southern Dominion with Demon, Dolon and Nezer, and he has had a century to rebuild." |
| Zol's Mistake | "The black north and every black island of the Ocean of Zol belong to Zol, the Old God of Death. He has no body and cannot take one. His presence grows slowly, and the dead he sustains are not ended by ordinary weapons. Who keeps Furviatlon in his name, no chronicle says." |

Spelling and secrecy checks of the compiler run on these texts. "Not yet" in the bookmark text is the only hint of war, and it names nobody.

#### 4.3 Other realms, filters and the "other" entry

| Item | Rule |
| --- | --- |
| Listed minors | Every other country with a tier A or tier B tree ([01_tiers_and_coverage.md](../05_focus_trees/01_tiers_and_coverage.md)), `minor = yes`, ordered by region then name. Each has `history`, `ideology`, three ideas and three focuses as for the great realms |
| Region labels | `label = { <region> }` with the region keys `middle_lands`, `north_lands`, `cold_lands`, `west_lands`, `east_lands`, `dark_lands`, `dead_lands`, `magical_lands`, `lands_of_the_sun`, `islands` (Triton's Islands and the Islands of the South) and `zols_mistake`; `label_order` in this order; localised in `zin_frontend_l_english.yml` ("The Middle Lands" …). If more filter buttons than fit, `islands` and `zols_mistake` merge into "The Far Isles and the North" (the Linux run decides) |
| `include_majors_in_minor_list` | `no` |
| `"---"` entry | `history = "ZIN_OTHER_FOURTH_AGE_DESC"`: "Choose any of the three hundred crowns, dominions, clans and island lordships of Erdae on the map." Every country is playable from the map |
| Descriptions of unlisted countries | Their role text from `docs/design/country_roles.csv` ([04_countries_and_states.md](../00_foundation/04_countries_and_states.md)) appears in the in-game country view, not here |
| Flags | The country flags (82 × 52, existing art) in the bronze bezel of 02 |
| Portraits of minors | `minor_portrait_overlay.dds` 126 × 166 is R (bronze oval bezel); the leader is the country's ruler portrait |

#### 4.4 Frontend art of this screen

| Texture | Size, frames | Treatment |
| --- | --- | --- |
| `country_selection_bg.tga` | 1225 × 728, TGA 32-bit | A walnut hall panel with a bronze frame and two bronze rails painted at about 44% and 66% of the height (where the filters and the details begin); generated 1536 × 912 equivalent from a 1536 × 1024 single, `cover` crop; the reviewer checks the rails sit within 8 px of y 318 and y 480 |
| `country_selection_entry.tga` | 300 × 274, 2 frames | Bronze portrait frame with a nameplate; the portrait window keeps vanilla's alpha shape (`same_shape`); frame 2 has a gilt edge |
| `country_selection_minor_entry.dds` | 276 × 97, 2 frames | Small bronze plate with a flag window |
| `diplo_countrylist_flag_frame_mini.dds` | 118 × 44, 2 frames | Bronze mini bezel |
| `country_filter_entry.dds` | 298 × 34, 2 frames | Gilded-iron filter button |
| `extended_country_button.dds` | 82 × 57, 2 frames | Bronze tab |
| `play_button.dds`, `play_button_ready.dds` | 723 × 60 (3 frames), 241 × 60 | A broad gilded-iron "seal" button; text from the engine |
| `tiles/tiled_frontend_upper_bar.dds`, `tiled_frontend_lower_bar.dds` | 484 × 128, border 70 | Walnut bars, nine-slice |
| `lobby_*_sidepanel_bg.dds`, `menu_top_bg.dds`, `game_settings_bg.dds`, `load_save_*.dds`, `save_load_file_disconnected_3frames.dds` | as vanilla | Frontend family cells |
| `lobby_country_mapmode_*`, `lobby_player_mapmode_*` | 63 × 63, 100 × 50 ×2 | Map-mode emblems (crown for countries, banner for players) |
| `unplayed_content_notification.dds` | 16 × 16 | R with a small gilt star (it never shows when `sort_unplayed_first = no` and no content is marked new, but stays themed) |
| `enabled_achievement_icons.dds` | 336 × 86, 4 frames | H in effect (achievements never enabled); R with neutral seals so nothing vanilla shows |

### 5. Game rules and difficulty

| Item | Rule |
| --- | --- |
| ZIN rules | The twelve rules of [05_defines_and_rules.md](../00_foundation/05_defines_and_rules.md), group `RULE_GROUP_ZIN` "Erdae" |
| Rule icons | `icon = "GFX_zin_rule_<name>"` on every ZIN rule; 29 × 30 DDS (vanilla rule icon size) in `gfx/game_rules/zin/`, sprites in `interface/zin_frontend.gfx` |
| Vanilla rule icons | The 17 files `gfx/game_rules/*.dds` (29 × 30, `allow_paratroopers` 32 × 32) are R with Erdae emblems: war goals = war banner, access = open gate, release = broken fetter, licences = sealed charter, lend-lease = laden cart, volunteers = marching boots, guarantees = shield, revoke guarantees = cracked shield, leave faction = cut cord, kick from faction = closed door, take faction lead = baton, fort level = tower, paradrops and paratroopers = feather (the air layer is griffins and dragons), coups = dagger under a cloak, party boosting = raised hands, scorched earth = burning field |
| Rule text | No rule or option text names Afrit (defines spec) **or Eindil**: the Eindil rule is titled "The Man from the Ice" and its options "Wakes as the chronicle says", "Wakes early", "Wakes late" (proposed; D4 applies before any game starts) |
| Country-specific vanilla rules | Shown until the generic-only override of `00_game_rules.txt` ships (defines spec §3); their icons are among the 17 R files, so no vanilla art shows meanwhile |
| Difficulty presets | `difficulty_button_recruit`, `_civilian`, `_regular`, `_veteran`, `_elite` (232 × 35, 2 frames), `custom_set_button*.dds`, `custom_difficulty_slider_bg.dds`, `changed_slider_indicator.dds` are R. Their labels are vanilla keys relabelled (proposed): Recruit → "Pilgrim", Civilian → "Burgher", Regular → "Man-at-arms", Veteran → "Veteran", Elite → "Champion" |
| Ironman | Vanilla behaviour; no ZIN change |

ZIN rule icons (proposed; generated with the 17 vanilla rule emblems on one 6 × 6 sheet on key, 29 cells used, `contain` to 29 × 30):

| Rule | Icon |
| --- | --- |
| `zin_rule_historical_path` | An hourglass on an open chronicle |
| `zin_rule_story_pace` | A marked candle clock |
| `zin_rule_golden_king_death` | A gilded crown on a cushion |
| `zin_rule_eindil_waking` | A block of blue ice with a faint inner light, no figure |
| `zin_rule_gathering_dark` | The storm lantern of the top bar |
| `zin_rule_dark_powers` | A black iron gate, half open |
| `zin_rule_ai_aenor_succession` | An empty throne |
| `zin_rule_ai_lerendor` | A chain across a strait between two towers |
| `zin_rule_ai_west` | A ship's prow cutting a wave |
| `zin_rule_ai_east` | A caravan saddle with tassels |
| `zin_rule_ai_elves` | A silver leaf |
| `zin_rule_elections` | Pebbles falling into an urn |

### 6. Credits and about text

`interface/credits.txt` (Paradox's team credits) is engine-generic and not changed. `interface/frontendcreditview.gui` is re-authored to add a ZIN block above the scrolling engine credits:

| Element | Value |
| --- | --- |
| `zin_credits_title` | `hoi_24header`, `ZIN_CREDITS_TITLE`: "ZIN: The Fourth Age of Erdae" |
| `zin_credits_body` | `hoi_16mbs`, max width 460, `ZIN_CREDITS_BODY` (proposed): "World, lore and direction: Klim Pashkov, creator of Erdae. Content built with the ZIN content builder and HOI4 Agent Tools. Every picture was image-generated for ZIN; 3D models were made with Meshy. Nothing was taken from other mods. Hearts of Iron IV is developed by Paradox Development Studio and published by Paradox Interactive. ZIN is a free fan modification, not affiliated with or endorsed by Paradox. Source: github.com/klimPaskov/zin" |
| `zin_credits_version` | `hoi_16mbs`, `ZIN_MENU_VERSION` |
| Credits background | `tiled_bg.dds` and `tiled_generic_overlay_bg1_small.dds` via the shared chrome (R); `pdx_logo_credits.dds` engine-generic |

The same about text, with the version, is the long description in `descriptor.mod`'s publishing metadata and the repository README.

### 7. Load, save and multiplayer screens

These screens get no ZIN layout change. Their textures are frontend and chrome cells (02). Save file names come from the engine ("Aenor 1748_03_01"); the date in save entries uses the calendar's month names where the engine localises them.

## Implementation

### Files

| Path | Content | Writer |
| --- | --- | --- |
| `docs/design/frontend.json` | Source of truth: background keys and subjects, the great realms row, minor list rule, region labels, description texts, rule icons, credit lines, music config | owner-editable data |
| `common/bookmarks/world.txt` | The bookmark (section 3, 4) | `tools/content/modules/frontend.mjs` |
| `common/frontend/backgrounds/zin_backgrounds.txt` | `zin_menu_parim = {}`, `zin_menu_strait = {}`, `zin_menu_wall = {}` | same |
| `descriptor.mod` | Adds `replace_path="common/frontend/backgrounds"` | builder descriptor step |
| `interface/frontendmainview.gui` | Re-authored (section 2.2) | `ui_overrides.mjs`, template `templates/ui/frontendmainview.gui.tmpl` |
| `interface/frontendmainviewbg.gfx`, `interface/frontendmainviewbg_basic.gfx` | ZIN background sprites | same |
| `interface/frontendcreditview.gui` | Re-authored with the ZIN block | same |
| `interface/zin_frontend.gfx` | `GFX_zin_bookmark_fourth_age`, `GFX_zin_menu_<key>_small`, `GFX_zin_rule_<name>` | `frontend.mjs` |
| `gfx/loadingscreens/zin_menu_<key>.dds`, `_small.dds` | Backgrounds | `frontend.mjs` |
| `gfx/interface/bookmarks/zin_fourth_age.dds`; `gfx/interface/select_date_1936.dds`, `select_date_1939.dds` | Bookmark picture and its R copies | `frontend.mjs` |
| `gfx/interface/logo_game.dds` | ZIN emblem, 448 × 175 (R) | `ui_reskin.mjs` |
| `gfx/game_rules/*.dds`, `gfx/game_rules/zin/*.dds` | Rule icons | `ui_reskin.mjs`, `frontend.mjs` |
| Frontend chrome textures (section 4.4) | R | `ui_reskin.mjs` |
| `localisation/english/zin_frontend_l_english.yml` | `ZIN_MENU_*`, `ZIN_BOOKMARK_*`, `<TAG>_ZIN_FOURTH_AGE_DESC`, `ZIN_OTHER_FOURTH_AGE_DESC`, region label names, `ZIN_CREDITS_*` | `frontend.mjs` |
| `localisation/replace/zin_frontend_replace_l_english.yml` | Difficulty labels, any vanilla frontend key with a modern word | `frontend.mjs` |
| `music/music.asset`, `music/_songs.txt`, `music/zin_*.ogg` | Only when `music.enabled` | `frontend.mjs` |

The country descriptions use new keys (`<TAG>_ZIN_FOURTH_AGE_DESC`) rather than today's `<TAG>_WORLD_DESC`; the builder removes the old keys in the same build.

### Generation jobs

| Job id | Kind | Size | Count | Approval |
| --- | --- | --- | ---: | --- |
| `frontend-menu-<key>` | single | 2048 × 1536 | 3 | owner |
| `frontend-emblem` | single on key | 1536 × 1024 | 1 | owner |
| `frontend-bookmark` | single | 1536 × 1024 | 1 | owner |
| `frontend-selection-bg` | single | 1536 × 1024 | 1 | agent |
| `frontend-chrome` | sheet 3 × 4 on key (entries, plates, play button states, bars) | 1536 × 1024 | 1 to 2 | agent |
| `frontend-rule-icons` | sheet 6 × 6 on key (29 rule icons: 12 ZIN, 17 vanilla) | 1024 × 1024 | 1 | agent |

### Builder checks

1. The bookmark's countries resolve from names to exactly one tag each; the row has at most eight non-minor entries.
2. Every listed country has `history`, `ideology`, three existing ideas and three existing focuses; every focus's default localisation is its public face.
3. Every frontend localisation key exists, is Windows-1252, and passes the secrecy scan (no Afrit, no Hidden Council), the Eindil scan (no "Eindil" anywhere on the frontend) and the forbidden-claims scan (no keeper of Furviatlon named).
4. The re-authored `.gui` files keep every element name of the installed vanilla files (version-pinned list); hidden elements are present.
5. Every background key has its DDS and `_small` sprite; no vanilla background key is listed.
6. The bookmark date equals the calendar spec's start constant.
7. `music.enabled` is false unless every track has an approved provenance line.

### Variables, flags, events, game rules, defines

None of their own. The rules are owned by the defines spec; this spec adds icons and text only.

## AI

None.

## Acceptance

1. `hoi4.gui_inspect` with the ZIN workspace reports no missing sprite, font or localisation for `frontend_background`, `mainmenu_panel_upperleft`, `mainmenu_single_player`, `mainmenu_panel_bottom`, `gamesetup_scenario_window`, `gamesetup_interesting_countries_window`, `gamesetup_country_details`, `gamesetup_gameplay_settings_window`, `game_rule_window`, `frontendcreditsview`, `frontendgamesetupview`.
2. `hoi4.gui_render` of those windows at 1280×720, 1600×900, 1920×1080, 2560×1080 and 2560×1440 (UI scale 1) and 1920×1080 at 1.25, states `normal`, `hover`, `selected`, `long-text`: the ZIN title, subtitle and version are inside the window and do not overlap the emblem; no hidden element is visible; descriptions stay inside their box. Renders are labelled "offline render, tool-generated".
3. The main menu background's safe box is visible at every render resolution (review of the renders at 2560×1080 and 1280×720).
4. The builder checks 1 to 7 pass, each with a negative test (a planted "Afrit" in a description, a missing bookmark focus, a vanilla background key, a dropped element name).
5. Linux run (L3 of [01_acceptance.md](../09_validation/01_acceptance.md)), three cold launches: the main menu shows a ZIN background, the ZIN emblem and title, no DLC banner, no subscription widget, no achievements or tutorial button; the background switcher offers exactly the three ZIN backgrounds; the bookmark shows "The Fourth Age" with the ZIN picture and the 1748 date; the country row shows the eight great realms with portraits, flags and descriptions; region filters work; the rules screen shows the Erdae group with icons and no vanilla rule icon art; the credits screen shows the ZIN block; a campaign starts as Aenor. No frontend error-log line from ZIN files.
6. No text on any frontend screen names Afrit or Eindil, and no picture shows Eindil, Zol, a demon or a battle (review of the Linux captures and renders).

## Open questions

1. Are the eight great realms right? Coldor, Noris, Stabilo, Gunwaith, Goldoroth and the Gala elves have major trees too but sit in the scrollable list.
2. Should the Worshipdom appear among the great realms at all, since its prominence may make players suspicious of it?
3. What credit name and wording does the owner want (section 6 proposes "Klim Pashkov, creator of Erdae")?
4. What is the source of ZIN's music (owner-made, commissioned, licensed, or an audio generation route the owner approves)? Until decided, vanilla music plays.
5. Three menu backgrounds or one?
6. Should the Eindil rule be renamed "The Man from the Ice" on the rules screen (proposed) or keep Eindil's name, given that the rules screen is read before the game starts?
7. Are the difficulty names (Pilgrim, Burgher, Man-at-arms, Veteran, Champion) wanted, or should vanilla names stay?
