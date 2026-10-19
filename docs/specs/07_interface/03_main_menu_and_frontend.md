# Main menu and frontend

**Status:** Ready. Reviewed 19 October 2026 against CONVENTIONS "Status"; integrated 19 October 2026. **Priority:** 5. **Phase:** 2 for the bookmark, country selection and rule text (they carry the calendar and the start situation); 7 for the rest of the art and the music.

## Purpose

The frontend is the first thing a player sees. This spec defines every frontend screen of ZIN: the main menu (background art, layout, title, version, menu music hook), the bookmark screen, country selection (portraits, flags, descriptions, ideas and focuses, filters), the game rules and difficulty screens, the load and lobby screens, and the credits with ZIN's about text.

The chrome of these screens (buttons, frames, tiles) comes from the shared families of [02_full_ui_reskin.md](02_full_ui_reskin.md). This spec adds the frontend-only art, the text and the few layout overrides.

## Current state (19 October 2026, commit ca01fa3)

| Item | In game | Writer |
| --- | --- | --- |
| Three main-menu backgrounds `gfx/loadingscreens/zin_menu_parim.dds`, `zin_menu_strait.dds`, `zin_menu_wall.dds` (1920 × 1440) and their thumbnails in `gfx/interface/zin/loadingscreens/` (decision A5) | yes | `tools/content/modules/presentation.mjs` |
| `common/frontend/backgrounds/zin_backgrounds.txt` (the three keys) and `replace_path="common/frontend/backgrounds"` in `descriptor.mod` | yes | `presentation.mjs`; `modules/vanilla_removal.mjs` (descriptor) |
| `interface/frontendmainviewbg.gfx`, `interface/frontendmainviewbg_basic.gfx`, `interface/small_background.gfx` overrides | yes | `presentation.mjs` |
| ZIN emblem in `gfx/interface/logo_game.dds` (448 × 175, keyed from a magenta single) | yes | `presentation.mjs` |
| Bookmark picture `GFX_zin_bookmark_fourth_age` (`interface/zin_frontend.gfx`, `gfx/interface/bookmarks/zin_fourth_age.dds`, 180 × 104) and the same picture in `gfx/interface/select_date_1936.dds` and `select_date_1939.dds` | yes | `presentation.mjs` |
| `common/bookmarks/world.txt`: one bookmark, keys `WORLD_BOOKMARK_NAME` / `_DESC`, **date 1936.1.1.12**, picture `GFX_zin_bookmark_fourth_age`, default country Aenor, seven entries with `<TAG>_WORLD_DESC` keys | yes (interim) | the politics step (HOI4 Agent Tools, outside the repository); text in `localisation/replace/world_l_english.yml` |
| Main menu layout, ZIN title text, DLC and tutorial hiding, credits block, country-selection art, rule icons, difficulty names, ZIN country descriptions, menu music | no | this spec |

The interim bookmark text ("Aenor … leads its satellites against the Leren Compact") reads as a war and is replaced by section 3.

## Lore basis

| Fact | Status | Source |
| --- | --- | --- |
| Start on 1 Thaw 4A 1748: the Golden King reigns, Eindil has not appeared, Afrit is unrevealed, Erdae seems at peace | owner-fixed | *The Campaign of 4A 1748* |
| Before Lorien names him, players read only "the Man from the Ice" | decided | [INTEGRATION_DECISIONS.md](../INTEGRATION_DECISIONS.md) D4 |
| The Worshipdom is shown as a Light temple-state of the Deliverer; its description never names Afrit or the Hidden Council | decided | D1 |
| Zol has no body; his realm is led by the emblem "The Will of Zol"; who keeps the Mistake is not known | established; emblem decided | *Zol*, S4 |
| The Golden King's personal name is not established | established | [02_ideologies_and_politics.md](../00_foundation/02_ideologies_and_politics.md) §6 |
| Realm facts used in the descriptions (seats, peoples, rivalries, the Concord, the Leren Compact, Mirolon's history, Horos and Glo, the elves never conquered) | established working table | *The Campaign of 4A 1748*, *Great Powers and Relations* |
| Three main-menu backgrounds; the bookmark picture is 180 × 104 | decided | A5 |
| The bookmark name "The Fourth Age", every description text, background subject, layout, icon and credit line below | **proposed** | this spec, [01_start_and_calendar.md](../00_foundation/01_start_and_calendar.md) |

Every frontend screen is reachable before any game starts, so every word and picture on it must be safe for the whole campaign: no Afrit, no Eindil by name or picture, no Zol in any form, no war, no later-state picture.

## Design

### 1. Screen flow

| Step | Screen | Vanilla file and window | ZIN change |
| --- | --- | --- | --- |
| 1 | Main menu | `interface/frontendmainview.gui`: `frontend_background`, `mainmenu_panel_upperleft`, `mainmenu_single_player`, `mainmenu_panel_bottom` | ZIN backgrounds (done), emblem (done) and title; DLC, store, achievement and tutorial elements hidden |
| 2 | Bookmark | `interface/frontendgamesetupview.gui`: `gamesetup_scenario_window` (entries `bookmark_entry`) | One bookmark, "The Fourth Age" |
| 3 | Country selection | same file: `gamesetup_interesting_countries_window` (`country_entry`, `country_entry_medium`, `country_entry_mini`, `country_filter`), `gamesetup_country_details` (`spirit_idea_entry`, `focus_entry`) | Eight great realms, region filters, scrollable list, ZIN descriptions, ideas and focuses |
| 4 | Game rules, difficulty | same file: `gamesetup_gameplay_settings_window`, `gamesetup_custom_gameplay_settings_window`, `game_rule_window`, `game_rule_group_window`, `difficulty_setting_item` | The Erdae rule group with icons; vanilla rule icons reskinned; difficulty names |
| 5 | Loading | `interface/load_screen.gui`: `load_screen` | Frame, pictures, quotes and tips from [02_loading_screens_and_quotes.md](../08_art_and_assets/02_loading_screens_and_quotes.md) (in game) |
| — | Load game, multiplayer, lobby, credits | `gamesetup_load` (`frontendgamesetupview.gui`), `frontendmultiplayerview.gui`, `playerlobby.gui`, `frontendcreditsview` (`frontendcreditview.gui`) | Chrome reskin; credits get the ZIN block |

### 2. Main menu

#### 2.1 Backgrounds (in game)

ZIN ships three menu backgrounds (decision A5). The player switches between them with the vanilla "change background" control; the default is the first.

| Key | Subject (prompt core) | Mood |
| --- | --- | --- |
| `zin_menu_parim` (default) | Parim at dusk seen from the water: white walls, gilded towers and temple domes above the Great Lake, lamps lit along the quays, a few sailing barges, calm water reflecting the gold | Wealth and peace at its height |
| `zin_menu_strait` | Sonargur's harbour on the Narrow Strait on a clear northern morning: grey stone quays, Leren warships at anchor with furled sails, gulls, the far shore faint across the water | Pride of the North |
| `zin_menu_wall` | The Great Wall of Aenor running over green hills into the mist, a gate tower in the foreground, beyond it the edge of an ancient elven forest under low autumn light | The old border, quiet |

Rules for all three:

- No figure larger than a distant silhouette, no face, no lettering, no banners with readable charges, no battle, no ships of the dead, no black islands, no veiled sun emblem in focus.
- None reuses a loading screen generation; they may show the same places from other viewpoints.
- **Composition for every screen shape.** The shipped picture is 1920 × 1440 (4:3); `frontend_background` keeps the aspect and fills the width, so 16:9 shows the central 1920 × 1080 band and 21:9 the central 1920 × 823 band. The subject sits inside the safe box x 160 to 1760, y 309 to 1131. The centre (x 760 to 1160, y 520 to 920), where the menu buttons sit, is calm and darker so the button stack reads. The upper left (x 0 to 520, y 0 to 420) holds the emblem and title and stays calm. The upper right (x 1600 to 1920, y 0 to 260) holds the developer logos.
- Generation (decision A1): one single per background in 4:3, `quality: high`; the model returns 1448 × 1086, which `presentation.mjs` upscales with Lanczos 3 to 1920 × 1440. Agent review is recorded; owner approval is pending and is required before the phase 7 release ([01_art_pipeline.md](../08_art_and_assets/01_art_pipeline.md) §6).

| Output | Size | Format | Path | Sprite |
| --- | --- | --- | --- | --- |
| Background | 1920 × 1440 | DDS A8R8G8B8 | `gfx/loadingscreens/zin_menu_<key>.dds` | engine (by background key) |
| Selector thumbnail | 192 × 144 (exact 10× box downscale) | DDS A8R8G8B8 | `gfx/interface/zin/loadingscreens/zin_menu_<key>_small.dds` | `GFX_zin_menu_<key>_small` in `interface/small_background.gfx` (required name pattern `GFX_<key>_small`) |

`common/frontend/backgrounds/zin_backgrounds.txt` lists the three keys with empty bodies; `descriptor.mod` has `replace_path="common/frontend/backgrounds"`, so vanilla and DLC backgrounds never rotate in. `interface/frontendmainviewbg.gfx` and `frontendmainviewbg_basic.gfx` point `GFX_frontend_bg`, `GFX_frontend_bg_basic` and `GFX_frontend_bg_basic_small` at `zin_menu_parim`.

#### 2.2 Layout

`interface/frontendmainview.gui` is re-authored from a ZIN template that keeps every element name of the installed vanilla file (game 1.19.3.0). Changes:

| Element (vanilla name) | Vanilla | ZIN |
| --- | --- | --- |
| `frontend_background` | `GFX_frontend_bg` | unchanged (points at ZIN art) |
| `frontend_game_logo` in `mainmenu_panel_upperleft` | `logo_game.dds` 448 × 175 | Same sprite, texture replaced (R, in game) by the **ZIN emblem**: a lettering-free gilded eight-pointed star over an open book with blank pages on a bronze roundel, transparent background |
| new `zin_menu_title` (in `mainmenu_panel_upperleft`) | — | `instantTextBoxType`, position x 20 y 200, `hoi_36header`, maxWidth 448, centre, text `ZIN_MENU_TITLE` ("ZIN") |
| new `zin_menu_subtitle` | — | x 20 y 248, `hoi_20bs`, maxWidth 448, centre, `ZIN_MENU_SUBTITLE` ("The Fourth Age of Erdae") |
| new `zin_menu_version` | — | x 20 y 280, `hoi_16mbs`, maxWidth 448, centre, `ZIN_MENU_VERSION` ("Version 0.1.0", written by the builder from `descriptor.mod`) |
| `mainmenu_single_player` buttons (`sp_continue_button`, `sp_new_button`, `sp_load_button`, `sp_back_button`) | `GFX_main_lobby_button` 864 × 36, 3 frames | Same; texture R (gilded iron, reskin family `frontend`) |
| `sp_tutorial_button` | Vanilla tutorial (Germany 1936) | **H**: moved off-screen, empty sprite, no text; `sp_back_button` takes its place in the stack |
| `mainmenu_dlc_ownership`, `owned_dlc_item`, `unowned_dlc_item`, `dlc_button`, `potential_dlc_list` | Store and DLC list | **H** |
| `subscription_widget`, `subscription_widget_simp_chinese`, `subscription_widget_subscribed`, `show_subscription` | Subscription offer | **H** |
| `achievements_button`, `mainmenu_achievement_button` | Achievements | **H** (ZIN has no achievements) |
| `mainmenu_panel_upperright` logos (`frontend_dev_logo`, `pdx_int_logo`) and `version_label` | Developer logos, game version | Engine-generic, unchanged |
| `mainmenu_social_buttons`, `social_view_interface_window` and their link buttons | Paradox account and links | Engine-generic, unchanged |
| `change_background`, `change_background_button`, `background_selection`, `background_selection_list` | Background switcher | Unchanged; lists the three ZIN backgrounds |
| `main_lobby_divider.dds` 312 × 15 | Divider | R: a bronze rule with a small star |

Hidden elements keep their names, as [02_full_ui_reskin.md](02_full_ui_reskin.md) §2.1 requires. Menu button labels keep the vanilla keys; they contain no modern words.

#### 2.3 Menu music hook

The main menu plays the song named `maintheme` (vanilla `music/music.asset`, file `hoi4mainthemeallies.ogg`). ZIN's menu theme is defined by [04_music_and_sound.md](../08_art_and_assets/04_music_and_sound.md): when its stage 4 lands, `replace_path="music"` removes the vanilla lists and `music/zin_music.asset` defines `maintheme` with ZIN's own file, written by `tools/content/modules/music.mjs`. Until then the vanilla menu theme plays (engine-generic interim, nothing copied). This spec adds no music file of its own.

### 3. The bookmark screen

ZIN has one bookmark. The scenario window shows one entry, centred.

| Field | Value |
| --- | --- |
| File | `common/bookmarks/world.txt` (folder under `replace_path`), written by the politics step from the bookmark block `tools/content/modules/frontend.mjs` exports |
| `name`, `desc` | `ZIN_BOOKMARK_FOURTH_AGE_NAME` "The Fourth Age"; `ZIN_BOOKMARK_FOURTH_AGE_DESC` (below) |
| `date` | `1748.3.1.12` (calendar spec constant); the entry's date line reads "1 Thaw, 1748" through the month name keys |
| `picture` | `GFX_zin_bookmark_fourth_age` (in game) |
| `default_country` | Aenor (resolved from the name at build time) |
| `default` | `yes` |
| Entries | The eight great realms (section 4.2), then the listed minors (section 4.3), then `"---"` |
| `effect` | Unchanged from today (`randomize_weather` with a fixed seed) |

**Description** (`ZIN_BOOKMARK_FOURTH_AGE_DESC`, proposed): "Erdae has known peace for more than seventeen centuries. In Parim the Golden King feasts while his offices are sold, the temples of the Deliverer are full, and trade crosses the wide central sea. In the north fishermen tell of things on the black islands; in the south Mirolon's scouts watch the storms. Nobody who matters is at war. Not yet.\n\nThe histories of Erdae are kept in the Chronicle: open it from the age of the world at the top of the screen." (The last sentence is the Chronicle's main-menu substitute, [04_chronicle_codex.md](04_chronicle_codex.md) §9.)

**Picture** (in game): "The Fourth Age": the Golden Court's hall at a feast, gilded pillars and long tables, the King small and distant on his throne, temple banners with a plain gold sun disc along the walls, no readable faces.

| Output | Size | Format | Path |
| --- | --- | --- | --- |
| Bookmark picture | 180 × 104 (measured from the installed `select_date_1936.dds`; decision A5) | DDS A8R8G8B8 | `gfx/interface/bookmarks/zin_fourth_age.dds`, sprite `GFX_zin_bookmark_fourth_age` in `interface/zin_frontend.gfx` |
| Defaults | same 180 × 104 | DDS | `gfx/interface/select_date_1936.dds` and `select_date_1939.dds` replaced with the same picture (R), so the `.gui` default sprite can never show 1936 art |
| Source | one single in 3:2 (returned 1774 × 887), Lanczos 3 `cover` crop to 180:104 | | |

The scenario window's frame (`select_date_bg.dds` 579 × 512, `bookmark_entry_bg.dds` 464 × 211 in 2 frames of 232 × 211) is R in the frontend family: a bronze-framed parchment (light class, because the bookmark description is dark typewriter text in vanilla).

### 4. Country selection

#### 4.1 Layout facts (vanilla, measured)

| Area | Vanilla | Capacity |
| --- | --- | --- |
| Great realms row (`country_entry`) | Entries 150 × 274 (`country_selection_entry.tga` 300 × 274, 2 frames: normal, selected); leader portrait at 0.75 scale (117 × 158) at x 17 y 22; flag 82 × 52 at x 34 y 188; name at y 247, max 131 px | 8 entries in the 1225-px window |
| Filter buttons (`country_filter`) | `country_filter_entry.dds` 298 × 34, 2 frames | about 8 buttons at 149 px |
| Medium row (`country_entry_medium`) | `country_selection_minor_entry.dds` 276 × 97, 2 frames (138 × 97) | 8 |
| Mini list (`country_entry_mini`) | `diplo_countrylist_flag_frame_mini.dds` 118 × 44, 2 frames (59 × 44); slots 52 × 38 | 23 × 2 visible, scrollable with `scrollable_country_list` |
| Details (`gamesetup_country_details`) | Nation title `hoi_24header` max 340; leader, ideology, government, elections, ruling party lines; history text at x 810 y 502, max width 380; three spirits and three focuses | — |
| Background | `country_selection_bg.tga` 1225 × 728 | — |

#### 4.2 The great realms (row of eight)

Eight realms with the deepest content and the clearest starting stories (proposed):

| Order | Realm | Ideology shown | Leader shown | Portrait |
| ---: | --- | --- | --- | --- |
| 1 | Aenor | Dominion (Golden Court) | The Golden King | `<Aenor tag>_zin_ruler` large portrait |
| 2 | Lerendor | Dominion (High Crown) | its ruler | ruler portrait |
| 3 | The Magical Forest | Light (Elder Kinship) | its council's speaker | ruler portrait |
| 4 | The Worshipdom | Light (Sanctuary, D1) | Aurevan the Deliverer | `zin_aurevan` in its **public** state only (characters spec: a robed, veiled figure whose face is not shown) |
| 5 | Mirolon | Light (Warden Host) | its ruler | ruler portrait |
| 6 | Yeldenne | Light (Warden Host) | Horos | `zin_horos`, drawn from the established text only (A6) |
| 7 | Volgan | Shadow (Dread Lordship) | Volgan | `zin_volgan` |
| 8 | Zol's Mistake | Shadow (Grave Dominion) | The Will of Zol | `zin_zol_will` emblem portrait ([02_ideologies_and_politics.md](../00_foundation/02_ideologies_and_politics.md)): no figure, no body, no servant |

Each entry lists three national spirits and three focuses. The builder takes the spirits from the country's starting ideas in their spec order and the focuses from the three focuses its tree data marks `"bookmark": true`. Until a realm's tree is compiled (phase 4), its entry lists its starting spirits and the interim Long Peace focuses (`zin_long_peace_*`). The build fails if fewer than three exist or if a focus's default name is not its public face (two-face focuses of the Worshipdom show only the public name; the frontend never evaluates scripted localisation).

**Descriptions** (`ZIN_FOURTH_AGE_DESC_<key>`, keyed by realm name so a tag change never orphans a text; proposed; each under 420 characters):

| Realm (key) | Text |
| --- | --- |
| Aenor (`aenor`) | "The Middle Kingdom. From Parim the Golden King rules the oldest crown of men and leads the Concord of twenty-six chartered dominions. The offices are for sale, the treasury pays for feasts, and the temples of the Deliverer are full. Seventeen centuries of peace have made Aenor rich, proud and careless." |
| Lerendor (`lerendor`) | "The united crown of Lerendor and Lerenwaith holds the Narrow Strait from Sonargur and leads the Leren Compact. An old treaty binds the North to defend Aenor in war. Leren kings still remember the toll quarrel of 4A 1716, and wonder what the treaty is worth." |
| The Magical Forest (`magical_forest`) | "The oldest and most peaceful realm of the elves, never conquered, not even by Elzon. A council of ancient houses governs beneath trees older than Aenor. Behind the Great Wall the forest keeps its own counsel, as it always has." |
| The Worshipdom (`worshipdom`) | "In the Zilin Hills stands the temple-state of the Deliverer, the god who saved the Fourth Age. It holds three valleys and almost no army. Its pilgrims, couriers and Houses of the First Light serve in every court of Erdae, and every court is glad of them." |
| Mirolon (`mirolon`) | "Volgan conquered Mirolon in the First Age, and Mirolon is free again. Its watchtowers face the storms of the Dead Lands. Its scouts send warnings north that no court believes." |
| Yeldenne (`yeldenne`) | "In Mp'E, the frozen north of the Cold Lands, Horos keeps the Castle of Yeldenne and guards Glo, a crystal of old and holy power. Few travellers reach his hall, and fewer bring back its tales." (That Glo is Horos's heart stays unsaid until `zin_horos_dead`, start-situation spec.) |
| Volgan (`volgan`) | "The northern courts call the Lord of the Dead Lands a spent legend. From Nafeher, behind the storms and heat of the south, Volgan rules the Southern Dominion with Demon, Dolon and Nezer, and he has had a century to rebuild." |
| Zol's Mistake (`zols_mistake`) | "The black north and every black island of the Ocean of Zol belong to Zol, the Old God of Death. He has no body and cannot take one. His presence grows slowly, and the dead he sustains are not ended by ordinary weapons. Who keeps Furviatlon in his name, no chronicle says." |

Spelling and secrecy checks of the compiler run on these texts. "Not yet" in the bookmark text is the only hint of war, and it names nobody.

#### 4.3 Other realms, filters and the "other" entry

| Item | Rule |
| --- | --- |
| Listed minors | Every other country with a tier A or tier B tree ([01_tiers_and_coverage.md](../05_focus_trees/01_tiers_and_coverage.md)), `minor = yes`, ordered by region then name. Each has `history`, `ideology`, three ideas and three focuses as for the great realms; its `history` text `ZIN_FOURTH_AGE_DESC_<key>` is its role text from `docs/design/country_roles.csv`. Before phase 4 the list holds only the countries the interim bookmark lists today |
| Region labels | `label = { <region> }` from each country's `zin_region_<key>` region of origin (contract additions register): `middle_lands`, `north_lands`, `cold_lands`, `west_lands`, `east_lands`, `dark_lands`, `dead_lands`, `magical_lands`, `lands_of_the_sun`, `islands` (both `tritons_islands` and `islands_of_the_south`) and `zols_mistake`; `label_order` in this order; localised in `zin_frontend_l_english.yml` ("The Middle Lands" …). If more filter buttons than fit, `islands` and `zols_mistake` merge into "The Far Isles and the North" (the Linux run decides; the result is recorded here) |
| `include_majors_in_minor_list` | `no` |
| `"---"` entry | `history = "ZIN_OTHER_FOURTH_AGE_DESC"`: "Choose any of the three hundred crowns, dominions, clans and island lordships of Erdae on the map." Every country is playable from the map |
| Descriptions of unlisted countries | None on this screen; their role texts stay design data in `docs/design/country_roles.csv` ([04_countries_and_states.md](../00_foundation/04_countries_and_states.md)) |
| Flags | The country flags (82 × 52, in game) in the bronze bezel of 02 |
| Portraits of minors | `minor_portrait_overlay.dds` 126 × 166 is R (bronze oval bezel); the leader is the country's ruler portrait |

#### 4.4 Frontend art of this screen

| Texture | Size, frames | Treatment |
| --- | --- | --- |
| `country_selection_bg.tga` | 1225 × 728, TGA 32-bit | A walnut hall panel with a bronze frame and two bronze rails painted at about 44% and 66% of the height (where the filters and the details begin); one 3:2 single (returned 1536 × 1024), `cover` crop; the reviewer checks the rails sit within 8 px of y 318 and y 480 |
| `country_selection_entry.tga` | 300 × 274, 2 frames | Bronze portrait frame with a nameplate; the portrait window keeps vanilla's alpha shape (`same_shape`); frame 2 has a gilt edge |
| `country_selection_minor_entry.dds` | 276 × 97, 2 frames | Small bronze plate with a flag window |
| `diplo_countrylist_flag_frame_mini.dds` | 118 × 44, 2 frames | Bronze mini bezel |
| `country_filter_entry.dds` | 298 × 34, 2 frames | Gilded-iron filter button |
| `extended_country_button.dds` | 82 × 57, 2 frames | Bronze tab |
| `play_button.dds`, `play_button_ready.dds` | 723 × 60 (3 frames), 241 × 60 | A broad gilded-iron "seal" button; text from the engine |
| `tiles/tiled_frontend_upper_bar.dds`, `tiled_frontend_lower_bar.dds` | 484 × 128, border 70 | Walnut bars, nine-slice |
| `lobby_*_sidepanel_bg.dds`, `menu_top_bg.dds`, `game_settings_bg.dds`, `load_save_*.dds`, `save_load_file_disconnected_3frames.dds` | as vanilla | Frontend family cells |
| `lobby_country_mapmode_*`, `lobby_player_mapmode_*` | 63 × 63, 100 × 50 ×2 | Map-mode emblems (crown for countries, banner for players) |
| `unplayed_content_notification.dds` | 16 × 16 | R with a small gilt star |
| `enabled_achievement_icons.dds` | 336 × 86, 4 frames | R with neutral seals so nothing vanilla shows (achievements are never enabled) |

Sheets follow decision A2: strips and plates one per job on black, frames with transparent windows as magenta singles.

### 5. Game rules and difficulty

| Item | Rule |
| --- | --- |
| ZIN rules | Every ZIN game rule that ships: every rule of the register in [05_defines_and_rules.md](../00_foundation/05_defines_and_rules.md) (with `zin_rule_golden_king_death`, decisions N4 and N15, and the rules the mechanic specs add), in the one group `RULE_GROUP_ZIN` "Erdae" (R1). `zin_rule_debug_checks` ships with the others (default `OFF`; the Linux runs set it on the rules screen) and has an icon like every rule |
| Rule icons | `icon = "GFX_zin_rule_<name>"` on every ZIN rule; 29 × 30 DDS (vanilla rule icon size) in `gfx/game_rules/zin/`, sprites in `interface/zin_rules.gfx` |
| Vanilla rule icons | The 17 files `gfx/game_rules/*.dds` (29 × 30, `allow_paratroopers` 32 × 32) are R with Erdae emblems: war goals = war banner, access = open gate, release = broken fetter, licences = sealed charter, lend-lease = laden cart, volunteers = marching boots, guarantees = shield, revoke guarantees = cracked shield, leave faction = cut cord, kick from faction = closed door, take faction lead = baton, fort level = tower, paradrops and paratroopers = great feather (the air layer is beasts, S6), coups = dagger under a cloak, party boosting = raised hands, scorched earth = burning field |
| Rule text | No rule or option text names Afrit (defines spec) **or Eindil**: `zin_rule_eindil_waking` is titled "The Man from the Ice" with options "Wakes as the chronicle says", "Wakes early", "Wakes late"; `zin_rule_eindil_journey` is titled "The Stranger's Road"; `zin_rule_afrit` is titled "The Deliverer's Path" (proposed; D4 and the secret apply before any game starts) |
| Country-specific vanilla rules | Already replaced: `common/game_rules/00_game_rules.txt` is overridden in stage 1 (`modules/vanilla_removal.mjs`); their icons are among the 17 R files, so no vanilla art shows |
| Difficulty presets | Sprites `GFX_difficulty_button_civilian`, `_recruit`, `_regular`, `_veteran`, `_elite` (232 × 35, 2 frames), `custom_set_button*.dds`, `custom_difficulty_slider_bg.dds`, `changed_slider_indicator.dds` are R. Labels (proposed) replace the vanilla keys of `frontend_l_english.yml`: `FE_DIFFICULTY_VERY_EASY` "Burgher", `FE_DIFFICULTY_EASY` "Pilgrim", `FE_DIFFICULTY_NORMAL` "Man-at-arms", `FE_DIFFICULTY_HARD` "Veteran", `FE_DIFFICULTY_VERY_HARD` "Champion"; their five `_TOOLTIP` keys (vanilla Second World War quotes) get ZIN lines: "The walls are high and the granaries full.", "Every road has a shrine, and every shrine a welcome.", "Keep your blade oiled and your banner dry.", "The old soldiers say peace is only a long muster.", "Kings fall, and so may you." |
| Ironman | Vanilla behaviour; no ZIN change |

ZIN rule icons (proposed; one sheet of 6 × 6 cells on black for the ZIN rules and one for the 17 vanilla emblems, `contain` to 29 × 30):

| Rule | Icon |
| --- | --- |
| `zin_rule_historical_path` | An hourglass on an open chronicle |
| `zin_rule_story_pace` | A marked candle clock |
| `zin_rule_golden_king_death` | A gilded crown on a cushion |
| `zin_rule_eindil_waking` | A block of blue ice with a faint inner light, no figure |
| `zin_rule_eindil_journey` | A trail of footprints in snow |
| `zin_rule_gathering_dark` | The storm lantern of the top bar |
| `zin_rule_dark_powers` | A black iron gate, half open |
| `zin_rule_afrit` | A closed temple door with a plain sun disc |
| `zin_rule_ai_aenor_succession` | An empty throne |
| `zin_rule_leren_route` | A chain across a strait between two towers |
| `zin_rule_west_route` | A ship's prow cutting a wave |
| `zin_rule_ai_east` | A caravan saddle with tassels |
| `zin_rule_ai_elves` | A silver leaf |
| `zin_rule_ai_goldoroth` | A black iron crown |
| `zin_rule_cold_isengard` | A frozen gate |
| `zin_rule_deathless` | A cracked grey shield |
| `zin_rule_skies` | A great feather against clouds |
| `zin_rule_volgan_early_war`, `zin_rule_volgan_spirit` | A storm over red desert; a guttering ember |
| `zin_rule_debug_checks` | A wax tablet and stylus |
| `zin_rule_elections` | Pebbles falling into an urn |

The register of [05_defines_and_rules.md](../00_foundation/05_defines_and_rules.md) is the list: one icon per rule, none for a retired rule (`zin_rule_ai_lerendor`, `zin_rule_ai_west` and `zin_rule_zol_behaviour` are retired by R1; Zol reads `zin_rule_dark_powers`, whose icon is the black iron gate). A rule a later spec adds takes the next free cell.

### 6. Credits and about text

`interface/credits.txt` (Paradox's team credits) is engine-generic and not changed. `interface/frontendcreditview.gui` (window `frontendcreditsview`) is re-authored to add a ZIN block above the scrolling engine credits:

| Element | Value |
| --- | --- |
| `zin_credits_title` | `hoi_24header`, `ZIN_CREDITS_TITLE`: "ZIN: The Fourth Age of Erdae" |
| `zin_credits_body` | `hoi_16mbs`, max width 460, `ZIN_CREDITS_BODY` (proposed): "World, lore and direction: Klim Pashkov, creator of Erdae. Content built with the ZIN content builder and HOI4 Agent Tools. Every picture was image-generated for ZIN; 3D models were made with Meshy. Nothing was taken from other mods. Hearts of Iron IV is developed by Paradox Development Studio and published by Paradox Interactive. ZIN is a free fan modification, not affiliated with or endorsed by Paradox. Source: github.com/klimPaskov/zin" |
| `zin_credits_version` | `hoi_16mbs`, `ZIN_MENU_VERSION` |
| Credits background | `tiled_bg.dds` and `tiled_generic_overlay_bg1_small.dds` via the shared chrome (R); `pdx_logo_credits.dds` engine-generic |

When ZIN ships its own audio, the body gains one line that points to `docs/credits/AUDIO.md` ([04_music_and_sound.md](../08_art_and_assets/04_music_and_sound.md)). The same about text, with the version, is the long description in the repository README and the Workshop page.

### 7. Load, save and multiplayer screens

These screens get no ZIN layout change. Their textures are frontend and chrome cells (02). Save file names come from the engine ("Aenor 1748_03_01"); the date in save entries uses the calendar's month names where the engine localises them.

## Implementation

### Files

| Path | Content | Writer |
| --- | --- | --- |
| `tools/content/data/frontend.json` (new) | Source of truth: the great realms row (by name), minor list rule, region labels, description texts, difficulty labels and tooltips, rule icons, credit lines | builder data |
| `common/bookmarks/world.txt` | The bookmark (sections 3, 4) | the politics step, from `bookmarkBlock()` exported by `tools/content/modules/frontend.mjs` (names resolved to tags at build time) |
| `common/frontend/backgrounds/zin_backgrounds.txt` | `zin_menu_parim = {}`, `zin_menu_strait = {}`, `zin_menu_wall = {}` (in game) | `modules/presentation.mjs` |
| `descriptor.mod` | `replace_path="common/frontend/backgrounds"` (in game) | `modules/vanilla_removal.mjs`; copied to the launcher file by `tools/content/sync/zin_mod_descriptor.mjs` |
| `interface/frontendmainviewbg.gfx`, `interface/frontendmainviewbg_basic.gfx`, `interface/small_background.gfx` | ZIN background sprites (in game) | `presentation.mjs` |
| `interface/frontendmainview.gui` | Re-authored (section 2.2) | `modules/ui_overrides.mjs`, template `tools/content/templates/ui/frontendmainview.gui.tmpl` |
| `interface/frontendcreditview.gui` | Re-authored with the ZIN block | same, template `frontendcreditview.gui.tmpl` |
| `interface/zin_frontend.gfx` | `GFX_zin_bookmark_fourth_age` (in game) | `presentation.mjs` |
| `interface/zin_rules.gfx` | `GFX_zin_rule_<name>` | `frontend.mjs` |
| `gfx/loadingscreens/zin_menu_<key>.dds`, `gfx/interface/zin/loadingscreens/zin_menu_<key>_small.dds` | Backgrounds and thumbnails (in game) | `presentation.mjs` |
| `gfx/interface/bookmarks/zin_fourth_age.dds`; `gfx/interface/select_date_1936.dds`, `select_date_1939.dds` | Bookmark picture and its R copies (in game) | `presentation.mjs` |
| `gfx/interface/logo_game.dds` | ZIN emblem, 448 × 175 (R, in game) | `presentation.mjs` |
| `gfx/game_rules/zin/*.dds` | ZIN rule icons | `frontend.mjs` |
| `gfx/game_rules/*.dds` and the frontend chrome textures (section 4.4) | R | `modules/ui_reskin.mjs` |
| `localisation/english/zin_frontend_l_english.yml` | `ZIN_MENU_*`, `ZIN_BOOKMARK_*`, `ZIN_FOURTH_AGE_DESC_<key>`, `ZIN_OTHER_FOURTH_AGE_DESC`, region label names, `ZIN_CREDITS_*`, ZIN rule names and option texts that the defines spec does not write | `frontend.mjs` |
| `localisation/replace/zin_frontend_replace_l_english.yml` | `FE_DIFFICULTY_*` labels and tooltips, and any vanilla frontend key with a modern word | `frontend.mjs` |
| `tools/content/frontend.test.mjs` (new) | Builder checks below | — |

The bookmark uses new keys (`ZIN_BOOKMARK_*`, `ZIN_FOURTH_AGE_DESC_<key>`); in the same change the politics step stops writing `WORLD_BOOKMARK_*` and `<TAG>_WORLD_DESC` into `localisation/replace/world_l_english.yml`.

### Generation jobs

All through `tools/content/imagegen.mjs` (model `gpt-6-astra`, through `GPTIMAGE_LIB`); jobs written by `tools/content/art/frontend-jobs.mjs` (new) to `$ZIN_ART/jobs/frontend-jobs.json`.

| Job id | Kind | Aspect | Count | Approval | State |
| --- | --- | --- | ---: | --- | --- |
| `frontend-menu-<key>` | single | 4:3 | 3 | owner | generated, agent-accepted |
| `frontend-emblem` | single on magenta | 3:2 (returned 1254 × 1254) | 1 | owner | generated, agent-accepted |
| `frontend-bookmark` | single | 3:2 (returned 1774 × 887) | 1 | owner | generated, agent-accepted |
| `frontend-selection-bg` | single | 3:2 | 1 | agent | to do |
| `frontend-chrome-<part>` | one job per strip or plate on black; magenta singles for the entry frames | by part | about 10 | agent | to do |
| `frontend-rule-icons-zin`, `frontend-rule-icons-vanilla` | sheet 6 × 6 on black | 1:1 | 2 | agent | to do |

### Builder checks

1. The bookmark's countries resolve from names to exactly one tag each; the row has at most eight non-minor entries.
2. Every listed country has `history`, `ideology`, three existing ideas and three existing focuses; every focus's default localisation is its public face.
3. Every frontend localisation key exists, is Windows-1252, and passes the secrecy scan (no Afrit, no Hidden Council), the Eindil scan (no "Eindil" anywhere on the frontend, rule names included) and the forbidden-claims scan (no keeper of Furviatlon named).
4. The re-authored `.gui` files keep every element name of the installed vanilla files (version-pinned list); hidden elements are present.
5. Every background key has its DDS and `_small` sprite; no vanilla background key is listed (`presentation.test.mjs` checks this today).
6. The bookmark date equals the calendar spec's start constant.
7. Every ZIN game rule has an icon sprite whose file exists, and no icon names a retired rule.

### Variables, flags, events, game rules, defines

None of their own. The rules are owned by the defines and mechanic specs; this spec adds icons and text only.

## AI

None.

## Acceptance

1. `hoi4.gui_inspect` with the ZIN workspace reports no missing sprite, font or localisation for `frontend_background`, `mainmenu_panel_upperleft`, `mainmenu_single_player`, `mainmenu_panel_bottom` (`frontendmainview.gui`), `gamesetup_scenario_window`, `gamesetup_interesting_countries_window`, `gamesetup_country_details`, `gamesetup_gameplay_settings_window`, `game_rule_window`, `frontendgamesetupview` (`frontendgamesetupview.gui`) and `frontendcreditsview` (`frontendcreditview.gui`).
2. `hoi4.gui_render` of those windows at 1280×720, 1600×900, 1920×1080, 2560×1080 and 2560×1440 (UI scale 1) and 1920×1080 at 1.25, states `normal`, `hover`, `selected`, `long-text`: the ZIN title, subtitle and version are inside the window and do not overlap the emblem; no hidden element is visible; descriptions stay inside their box. Renders are labelled "offline render, tool-generated".
3. The main menu background's safe box is visible at every render resolution (review of the renders at 2560×1080 and 1280×720).
4. The builder checks 1 to 7 pass, each with a negative test (a planted "Afrit" in a description, an "Eindil" in a rule name, a missing bookmark focus, a vanilla background key, a dropped element name).
5. Linux run (G4, cases L3 and L7 of [01_acceptance.md](../09_validation/01_acceptance.md)), three cold launches: the main menu shows a ZIN background, the ZIN emblem and title, no DLC banner, no subscription widget, no achievements or tutorial button; the background switcher offers exactly the three ZIN backgrounds; the bookmark shows "The Fourth Age" with the ZIN picture and the 1748 date; the country row shows the eight great realms with portraits, flags and descriptions; region filters work; the rules screen shows the Erdae group with icons and no vanilla rule icon art; the difficulty buttons read Burgher to Champion; the credits screen shows the ZIN block; a campaign starts as Aenor. No frontend `error.log` line from ZIN files.
6. No text on any frontend screen names Afrit or Eindil, and no picture shows Eindil, Zol, a demon or a battle (review of the Linux captures and renders).

## Open questions

Each proceeds on the proposal; the owner may overrule.

1. The eight great realms are as in section 4.2 (proposed); Coldor, Noris, Stabilo, Gunwaith, Goldoroth and the Gala elves sit in the scrollable list.
2. The Worshipdom stays among the great realms in its public face (proposed).
3. Credit name and wording as in section 6 (proposed).
4. Music source: see [04_music_and_sound.md](../08_art_and_assets/04_music_and_sound.md); until its stage 4 lands the vanilla menu theme plays.
5. Three menu backgrounds: settled by decision A5.
6. The Eindil rules are renamed on the rules screen (proposed), because the rules screen is read before the game starts.
7. The difficulty names Pilgrim, Burgher, Man-at-arms, Veteran, Champion are used (proposed).
