# Full interface reskin

**Status:** Ready. Reviewed 19 October 2026 against CONVENTIONS "Status"; integrated 19 October 2026. **Priority:** 5. **Phase:** 7 (the inventory, tooling, frontend and shared chrome may start in phase 2 so the first screen a player sees is Erdae's).

## Purpose

[PROGRAM.md](../PROGRAM.md) requires that nothing a player sees is vanilla unless it is engine-generic. [01_interface.md](01_interface.md) defines ZIN's own windows (the Erdae bar, the Realm panel, the mechanic panels). This spec covers everything else: every player-facing vanilla interface surface, from the main menu to the tooltips, and how ZIN reskins it.

For each surface it says which textures are replaced with image-generated Erdae art (path, size, frame count, format), which `.gui` or `.gfx` files are overridden and why, and what stays engine-generic. It fixes the visual language (materials, palette, text colours, ideology colours), the generator design (one theme sheet per family, sliced by code), the production order, and the offline and Linux acceptance checks.

The main menu, bookmark, country selection, credits and game rules screens are specified in detail in [03_main_menu_and_frontend.md](03_main_menu_and_frontend.md). The loading screen pictures, quotes and tips are in [02_loading_screens_and_quotes.md](../08_art_and_assets/02_loading_screens_and_quotes.md); this spec covers only the loading screen's frame.

## Current state (19 October 2026, commit ca01fa3)

| Item | In game | Writer |
| --- | --- | --- |
| Loading screen chrome `gfx/interface/Loadingscreen_loadingtip.dds`, `Loadingscreen_loadingstatus.dds`, `LoadingScreen_Progress_1.dds`, `LoadingScreen_Progress_2.dds` (`R`, exact vanilla case) | yes | `tools/content/modules/presentation.mjs` |
| ZIN emblem in `gfx/interface/logo_game.dds` (`R`, 448 × 175) | yes | same |
| Bookmark picture and its `R` copies `gfx/interface/select_date_1936.dds`, `select_date_1939.dds` (180 × 104) | yes | same |
| `interface/frontendmainviewbg.gfx`, `interface/frontendmainviewbg_basic.gfx` (`O`: `GFX_frontend_bg`, `GFX_frontend_bg_basic`, `GFX_frontend_bg_basic_small` point at `zin_menu_parim`) | yes | same |
| `interface/small_background.gfx` (`O`: background picker thumbnails and their frame) | yes | same |
| Every other surface of section 4 | no (vanilla chrome) | this spec |

## Lore basis

| Fact | Status | Source |
| --- | --- | --- |
| Start on 1 Thaw 4A 1748: the Golden King reigns, Eindil has not appeared, Afrit is unrevealed, Erdae seems at peace | owner-fixed | *The Campaign of 4A 1748* |
| Erdae has known peace for more than seventeen centuries; the realms are crowns, dominions, clans and island lordships, not modern states | proposed (campaign note) | *The Campaign of 4A 1748* |
| People revere the Deliverer and do not know the name Afrit; the veiled sun is the Deliverer's public sign | established; sign proposed | *Fourth Age Canon Register*, [02_icon_catalog.md](../05_focus_trees/02_icon_catalog.md) |
| Zol has no body; nothing may show Zol or his servants | established | *Zol*, [zols_mistake.md](../04_mechanics/zols_mistake.md) |
| All art is image-generated; code only slices, resizes and converts; nothing from other mods | owner rule | [CONVENTIONS.md](../CONVENTIONS.md), [01_art_pipeline.md](../08_art_and_assets/01_art_pipeline.md) |
| The ideology colours and names (Light, Dominion, Shadow, Wild) | proposed | [02_ideologies_and_politics.md](../00_foundation/02_ideologies_and_politics.md) |
| Resource, building and law names | proposed | [02_economy.md](../03_gameplay/02_economy.md) |
| Every material, colour, layout rule, family, sheet, size choice and check below | **proposed** | this spec |

The chrome is shared by every country, so it must be neutral: no faith, no realm and no dark power owns it. It shows no figure, no face and no lettering. The secret rule of the [shared contract](../04_mechanics/00_shared_contract.md) applies to every interface text: no text a non-Worshipdom player can read names Afrit before `zin_afrit_revealed`.

## Design

### 1. Principles

1. **Replace textures, not layouts.** The default method is a texture of the same path, extension, size and frame count as the vanilla file. The engine then draws Erdae art in the vanilla layout, and no vanilla `.gui` or `.gfx` text ships in ZIN. A layout is overridden only where the vanilla layout itself shows something un-Erdae (a DLC banner, a 1936 date picture, a tutorial for Germany), and the list of overrides is short and closed (section 2.3).
2. **Keep the luminance class.** Vanilla text colours are bound to their backgrounds. A replacement keeps the vanilla texture's luminance class (dark, mid or light, measured from the vanilla file's mean luminance), so engine text stays readable without editing a single `.gui`. Parchment is used only where vanilla already sets dark text on a light ground.
3. **Keep the shape.** Alpha outlines, frame order and the meaning of each frame (normal, hover, pressed, selected, disabled) follow the vanilla sprite. Click areas come from `.gui` sizes and do not change.
4. **Neutral chrome.** Window chrome uses one shared Erdae material set (section 3). Faction and mechanic colour appears only in ZIN's own panels ([01_interface.md](01_interface.md) §12) and in content (flags, icons, portraits).
5. **Spoiler-free at every date.** Chrome is visible from the first frame of the main menu, so it never shows the veiled sun, a demon, a sigil of Zol, Eindil, a battle or a later-state picture. Ornament comes from the neutral vocabulary in section 3.6.
6. **No lettering in art.** Every word on screen is localisation drawn by a game font.
7. **Measured from the installed game.** Sizes, frames, border sizes and luminance come from the installed game files (game version 1.19.3.0, the `rawVersion` of the installed `launcher-settings.json`), read by the builder as data. Vanilla pixels are measured, never copied, never passed to the image generator and never shipped.
8. **Everything reachable is themed.** A surface a player can open in ZIN is themed or listed as engine-generic with a reason. Vanilla sprites that no ZIN content can reach (vanilla focus icons, idea pictures, tank designer modules) are classified unreachable and need no art (section 7).

### 2. Methods

#### 2.1 Methods per sprite

Every sprite in the vanilla `interface/*.gfx` files gets exactly one disposition in `tools/content/data/ui/reskin.json`.

| Code | Method | When | What ships |
| --- | --- | --- | --- |
| `R` | **Replace** the texture at the same path | Default for chrome | A generated texture at the vanilla path, same extension (`.dds`, `.tga` or `.png`), same width and height, same frame count |
| `Z` | **ZIN sprite** in a ZIN-owned `.gfx` | ZIN content (icons, pictures, portraits) and ZIN windows | New sprite names `GFX_zin_*` in `interface/zin_*.gfx`; owned by the content specs |
| `O` | **Re-authored override** of a vanilla `.gui` or `.gfx` file | Only the files in section 2.3 | A ZIN-written file of the same name, built from a ZIN template that keeps every element name the engine binds |
| `D` | **Derived override** | Reserved. Not used unless the owner approves it, because it would ship a patched Paradox file (section 3.4) | Nothing today |
| `E` | **Engine-generic** | Developer and engine logos, the multiplayer and account screens' links, debug and console art, map shaders, font glyphs | Nothing |
| `H` | **Hidden** by an `O` override | DLC banners, store and subscription widgets, achievements, the tutorial button | Nothing; the element stays in the file, moved to a zero-size position with an empty sprite |
| `U` | **Unreachable** | Vanilla content sprites no ZIN script or window references | Nothing; the reachability check proves it (section 7) |

Elements the engine binds by name are never deleted from an overridden `.gui`: a missing bound element can crash or log errors. Hidden elements keep their names, with `position = { x = -10000 y = -10000 }`, `alwaystransparent = yes` and the 1×1 transparent sprite `GFX_zin_empty`.

#### 2.2 Allowed image operations

All shipped pixels come from accepted generations ([01_art_pipeline.md](../08_art_and_assets/01_art_pipeline.md) rule 1). The reskin needs these operations, all proposed as "slice, resize, convert":

| Operation | Used for |
| --- | --- |
| Crop, inset crop | Cutting cells from a sheet |
| Resize (Lanczos 3), aspect-preserving or exact | Every target |
| Nine-slice resize: cut a generated panel into corners, edges and centre at a declared border, resize each region separately to the target's `borderSize` | Tiled windows and frames (`corneredTileSpriteType`) |
| Frame assembly: place generated cells side by side | Multi-frame strips |
| Repeat a generated seamless tile horizontally or vertically | Very wide bands (the top bar, 2346 × 87) that exceed the generator's 3:1 aspect limit |
| Flip or rotate by 90° | Arrow and scroll button pairs (left from right, down from up) |
| Alpha from the magenta key with despill (`keyMatte` in `modules/presentation.mjs`), or from the item's outline on a black ground (the A3 medallion method) | Single objects with transparent parts (the emblem and the thumbnail frame are made this way today); shaped cells on black sheets |
| Constant alpha scale | Translucent tiles whose vanilla alpha is uniform (for example `tiled_window_transparent.dds`) |
| Format conversion: DDS A8R8G8B8, TGA 32-bit, PNG 32-bit, CUR and ANI | Output |

No tinting, hue shift, gradient, drawn line or text is ever applied by code. Each colour variant is its own generated cell.

#### 2.3 The closed list of overrides

| File (installed 1.19.3) | Windows or sprites | Code | Why | Owner spec | Writer | State |
| --- | --- | --- | --- | --- | --- | --- |
| `interface/frontendmainview.gui` | `frontend_background`, `mainmenu_panel_upperleft`, `mainmenu_single_player`, `mainmenu_panel_bottom`, `mainmenu_dlc_ownership`, `mainmenu_achievement_button` and the rest of the file | `O` | Hide DLC banners, subscription widget, achievements and tutorial buttons; add the ZIN title, subtitle and version text | [03_main_menu_and_frontend.md](03_main_menu_and_frontend.md) | `modules/ui_overrides.mjs` | to do |
| `interface/frontendmainviewbg.gfx`, `interface/frontendmainviewbg_basic.gfx` | `GFX_frontend_bg`, `GFX_frontend_bg_basic`, `GFX_frontend_bg_basic_small` | `O` | Point the menu background sprites at ZIN's backgrounds (vanilla points at `load_5.dds`) | 03 | `modules/presentation.mjs` | in game |
| `interface/frontendcreditview.gui` | `frontendcreditsview` | `O` | Add the ZIN credits block above the engine credits | 03 | `modules/ui_overrides.mjs` | to do |
| `interface/small_background.gfx` | `GFX_<background>_small`, `GFX_frontend_loading_screen_border_small` | `O` | Background picker thumbnails point at ZIN files outside the loading folder | [02_loading_screens_and_quotes.md](../08_art_and_assets/02_loading_screens_and_quotes.md) | `modules/presentation.mjs` | in game |
| `common/frontend/backgrounds/` (folder) | background keys | `replace_path` | Only ZIN menu backgrounds rotate | 03 | `modules/presentation.mjs`; the descriptor line from `modules/vanilla_removal.mjs` | in game |
| `interface/countrytechtreeview.gui` | `countrytechtreeview` and the `techtree_*_folder_item` windows | `O` | ZIN technology folders replace the vanilla folder windows; the folder layout belongs to the warfare spec, the skin to this spec | [01_warfare.md](../03_gameplay/01_warfare.md) | `modules/ui_overrides.mjs`, from the folder list the warfare module supplies | to do (stage 2) |

Any further override needs a new row here with its reason. ZIN never overrides `interface/topbar.gui` ([01_interface.md](01_interface.md) principle 7). Music is not an override: its folders are replaced with `replace_path` in stage 4 ([04_music_and_sound.md](../08_art_and_assets/04_music_and_sound.md)).

### 3. Visual language: the Erdae chancery

The interface reads as the furniture of a Fourth Age chancery: dark walnut cabinets bound in bronze, gilded iron fittings, and parchment ledgers where reports are read. It is old, well kept and calm, matching a world that has been at peace for seventeen centuries. Danger appears only in content and in the Gathering Dark.

#### 3.1 Materials

| Material | Look (prompt core) | Luminance class | Used for |
| --- | --- | --- | --- |
| **Walnut** | Dark oiled walnut panel, fine straight grain, soft satin sheen, faint wear at the edges | dark | Window bodies, list backgrounds, tooltips, the top bar band |
| **Bronze** | Cast bronze edging, warm brown-gold, darker in the recesses, small rivets | mid | Window borders, frame corners, headers, separators |
| **Gilded iron** | Blackened iron with gold-leaf highlights on raised edges, slightly worn to dark metal | dark to mid | Buttons, tabs, top bar buttons, toggles, scroll parts |
| **Parchment** | Warm cream vellum with faint fibres, slight foxing at edges, no writing | light | Event and news bodies, focus description paper, ledger sheets: only where vanilla is light |
| **Slate** | Smooth dark grey-blue stone, very fine speckle | dark | Map interface (minimap frame, map mode bar), combat windows |
| **Wax and enamel** | Deep red wax, verdigris and lapis enamel insets | mid | State lamps: selected, warning, danger, good |

All prompts add: "flat even lighting from the upper left, no cast shadows outside the object, no text, no letters, no numbers, no runes, no figures, no faces".

#### 3.2 Palette tokens

Design targets for prompts and review; code never paints them.

| Token | Hex | Role |
| --- | --- | --- |
| `walnut_900` | `#1E1610` | Deepest panel body |
| `walnut_700` | `#2E2219` | Panel body |
| `walnut_500` | `#4A3626` | Raised wood, hover |
| `bronze_600` | `#7A5A30` | Border shadow |
| `bronze_400` | `#A8814A` | Border |
| `gold_300` | `#D9B562` | Gilded highlight, selected edge |
| `gold_100` | `#F1DFA6` | Brightest gilt |
| `iron_700` | `#2C2C2E` | Blackened iron |
| `iron_500` | `#55565A` | Iron highlight, disabled |
| `parchment_100` | `#F2E7CF` | Parchment light |
| `parchment_300` | `#DCC9A0` | Parchment mid |
| `ink_900` | `#2A1F17` | Text on parchment |
| `verdigris` | `#5F8F63` | Good, progress |
| `amber` | `#D49A33` | Warning |
| `cinnabar` | `#A8372C` | Danger, war |
| `lapis` | `#3F6496` | Information, selection on maps |
| `slate_800` | `#22272D` | Map interface body |

#### 3.3 State language

| State | Rendering |
| --- | --- |
| Normal | Base material |
| Hover | One step brighter wood or metal; gilt edge catches more light |
| Pressed or selected | Gilt edge `gold_300` around the control; face one step darker |
| Disabled or locked | Dull iron `iron_500`, no gilt, matte |
| Good, warning, danger | Small enamel inset in verdigris, amber or cinnabar; never a full-surface colour |

#### 3.4 Text colours

Vanilla text colour codes (`§G`, `§R` …) are defined in the `textcolors` block of `interface/core.gfx`. ZIN keeps every code and its meaning and moves the colours toward the palette, keeping contrast on dark grounds.

| Code | Vanilla | ZIN (target) | Meaning kept |
| --- | --- | --- | --- |
| `W` | 255 255 255 | 244 236 220 | Plain text on dark |
| `T` | 255 255 255 | 244 236 220 | Titles |
| `Y`, `H` | 255 189 0 | 233 194 96 | Highlight, headers |
| `G` | 0 159 3 | 118 178 98 | Good |
| `R` | 255 50 50 | 222 82 64 | Bad |
| `O` | 255 112 25 | 226 140 52 | Orange |
| `C` | 35 206 255 | 132 186 226 | Cyan, links |
| `B` | 0 0 255 | 96 136 214 | Blue (vanilla blue is unreadable on walnut) |
| `L` | 195 176 145 | 195 176 145 | Unchanged |
| `g` | 176 176 176 | 168 160 148 | Grey |
| `b` | 0 0 0 | 42 31 23 | Black on parchment |
| `0`–`9`, `t` | gradient | unchanged | Engine heat gradients stay engine-generic |

**Route (proposed).** An additive file `interface/zz_zin_textcolors.gfx` with only a `bitmapfonts = { textcolors = { … } }` block (the vanilla block sits in `interface/core.gfx`). If the Linux run shows the vanilla colours unchanged, the vanilla text colours stay as an accepted engine-generic item and `reskin.json` records the reason. No derived override of `core.gfx` is made: the owner declined a patched Paradox file (19 October 2026). Either way, every colour pair (text colour against its background class) must reach a contrast ratio of at least 4.5:1, checked on renders (Acceptance 6).

#### 3.5 Ideologies

| Key | Name | Map and chart colour (politics spec) | Emblem (`GFX_ideology_<key>_group`, 66 × 68, and `GFX_ideology_unknown`) |
| --- | --- | --- | --- |
| `democratic` | Light | 196 214 236, pale sky | A white stone lamp with a clear, steady flame; not a sun, not a veil |
| `fascism` | Dominion | 178 132 46, bronze | A bronze crown resting on a sword's crossguard |
| `communism` | Shadow | 92 40 96, dusk violet | A black iron circlet set with one dark stone; no face, no skull, no sigil of Zol |
| `neutrality` | Wild | 112 128 104, moss | An antler and an oak sprig bound with cord |
| unknown | — | — | A plain bronze disc with an empty socket |

The emblems are engine sprites with vanilla paths (`gfx/interface/ideologies/<key>_group.dds`), so they are `R` replacements. `anarchism.dds` (66 × 66) is unreachable in ZIN and needs no art. Party colour swatches (`pol_party_colour.dds` 13 × 13, `pol_party_colour_bg.dds` 21 × 21) are neutral bronze sockets; the engine fills the colour.

#### 3.6 Ornament vocabulary

| Allowed | Forbidden in chrome |
| --- | --- |
| Rivets, straps, hinges, bevels, plain mouldings | The veiled sun or any sun disc (the Deliverer's sign) |
| Oak and laurel leaves, knotwork bands, rope | Demons, horns, skulls, bones, black islands (Zol, Volgan, the Mistake) |
| Compass rose and chart lines (map interface only) | Crowns as ornament (they belong to Dominion and to realms) |
| Wax seals without imprint, plain enamel lamps | Any figure, face, animal head, letter, number or rune |
| A small eight-pointed star as the "selected" mark (proposed, no realm owns it) | Modern objects: gears, rivets of steel plating, telephones, rifles, tanks, typewriters |

#### 3.7 Fonts

Glyph textures are engine-generic: ZIN uses the vanilla fonts ([01_interface.md](01_interface.md) principle 6). One exception is proposed: the typewriter faces (`hoi4_typewriter16`, `hoi4_typewriter22` and their `_inverted` forms) read as twentieth-century documents and appear in 25 vanilla `.gui` files (their `bitmapfont` definitions are in `interface/core.gfx`). The additive file `interface/zz_zin_textcolors.gfx` redefines those four `bitmapfont` names with `fontfiles` pointing at the installed Garamond glyph files of the nearest size (`gfx/fonts/garamond_16`, `garamond_24`). No `.gui` changes. The long-text renders (Acceptance 5) catch any overflow from the different metrics. If the Linux run shows the alias ignored or a duplicate-definition error in `error.log`, the redefinitions are dropped and the typewriter faces stay as an accepted engine-generic item.

### 4. Surface inventory

Sizes are vanilla measurements (width × height of the whole texture; frames are horizontal). "R" means replace at the same path. Every texture of a family not named here follows its family's default treatment; the complete per-sprite list is the generated `tools/content/data/ui/vanilla_inventory.json` (Implementation).

#### 4.1 Frontend and loading screen

| Surface | Vanilla `.gui` (windows) | Key textures | ZIN treatment | Overrides | Engine-generic |
| --- | --- | --- | --- | --- | --- |
| Main menu | `frontendmainview.gui` (`frontend_background`, `mainmenu_panel_upperleft`, `mainmenu_single_player`, `mainmenu_panel_bottom`, `mainmenu_social_buttons`) | `loadingscreens/load_5.dds` 1920 × 1440 (via `GFX_frontend_bg`), `main_lobby_button.dds` 864 × 36, 3 frames, `logo_game.dds` 448 × 175, `main_lobby_divider.dds` 312 × 15 | ZIN backgrounds; gilded-iron menu buttons (R); a lettering-free ZIN emblem in `logo_game.dds` (R) with the title as text | `frontendmainview.gui`, `frontendmainviewbg*.gfx` | `pdx_dev_logo.dds`, `pdx_int_logo.dds`, `clausewitz_logo.dds`; account and social views |
| Game setup, bookmark, country selection, lobby, load and save | `frontendgamesetupview.gui` (`gamesetup_scenario_window`, `gamesetup_interesting_countries_window`, `gamesetup_country_details`, `gamesetup_gameplay_settings_window`, `gamesetup_load`) | `country_selection_bg.tga` 1225 × 728, `country_selection_entry.tga` 300 × 274 ×2, `country_selection_minor_entry.dds` 276 × 97 ×2, `minor_portrait_overlay.dds` 126 × 166, `bookmark_entry_bg.dds` 464 × 211 ×2, `select_date_bg.dds` 579 × 512, `play_button.dds` 723 × 60 ×3, `tiles/tiled_frontend_upper_bar.dds` and `_lower_bar.dds` 484 × 128 (border 70), `load_save_entry*.dds`, `difficulty_button_*.dds` 232 × 35 ×2 | R for all; the bookmark names its own ZIN picture sprite, and `select_date_1936.dds` and `select_date_1939.dds` (180 × 104, the `.gui` default) are R with the same ZIN picture so no 1936 art can ever show | — | `enabled_achievement_icons.dds` is H (shown only for achievements) |
| Game rules | `frontendgamesetupview.gui` (`game_rule_window`, `game_rule_group_window`) | `gfx/game_rules/*.dds` 29 × 30 (17), `game_settings_bg.dds` 484 × 97 | R for the 17 vanilla rule icons; ZIN rule icons `GFX_zin_rule_<name>` (Z) | — | — |
| Credits | `frontendcreditview.gui` | `tiles/tiled_bg.dds`, `diplo_popup_bottom.dds` 494 × 72 | R through shared chrome | `frontendcreditview.gui` | `pdx_logo_credits.dds` 244 × 240, `interface/credits.txt` |
| Loading screen frame | `load_screen.gui` (`load_screen`) | `Loadingscreen_loadingstatus.dds` 1400 × 92, `Loadingscreen_loadingtip.dds` 1400 × 148, `LoadingScreen_Progress_1.dds`, `LoadingScreen_Progress_2.dds` 934 × 40, `loadingscreens/loading_screen_border_small.dds` 192 × 144 | R, **in game**: a dark leather band with a gilt filigree edge (status and tip; dark centre, because tip text is light), an iron progress groove and a molten-gold fill ([02_loading_screens_and_quotes.md](../08_art_and_assets/02_loading_screens_and_quotes.md) §6) | — | `pdx_dev_logo_s.dds`, `clausewitz_logo.dds`, `thisisdog.dds` (engine fallback) |

The pictures themselves (`load_<n>.dds`, `_small`), the quotes and the tips belong to [02_loading_screens_and_quotes.md](../08_art_and_assets/02_loading_screens_and_quotes.md).

#### 4.2 Shared chrome (every window)

These textures carry most of the interface. Reskinning them themes every window at once, including the multiplayer lobby, chat, the options menu and DLC windows ZIN does not use.

| Group | Textures (size, frames, border) | Treatment |
| --- | --- | --- |
| Tiled windows | `tiles/tiled_window.dds` 192² (border 64), `tiled_window_1b_border.dds`, `tiled_window2_1b_border.dds`, `tiled_window_2b_border.dds`, `tiled_window2_2b_border.dds`, `tiled_window_1b_thin_border.dds`, `tiled_window_thin_border.dds`, `tiled_window_thin_border2.dds` 190² (64), `tiled_window_1_scrollbar.dds`, `_glow.dds` 192² (64), `tiled_window_2_scrollbars.dds`, `tiled_window_w_close.dds`, `tiled_window_pol_goal.dds`, `tiled_window_small.dds` 95² (32), `tiled_window_small_selectable.dds` 190 × 95 ×2, `tiled_window_small_small.dds` 48² (16), `tiled_window_transparent.dds` 95² (alpha) | Nine-slice from the walnut-and-bronze panel cells; "1b", "2b" and "thin" variants map to the thick, double and thin bronze border cells; translucent ones keep vanilla's uniform alpha |
| Plain backgrounds | `tiled_plain_bg.dds` 190², `tiled_plain_bg2.dds`, `tiled_plain_bg_small.dds` 48², `tiled_bg.dds` 192², `tiled_bg_noframe.dds`, `tiled_bg_1_scrollbar.dds`, `black_bg_tile.dds`, `no_frame_special_bg.dds` 192², `tiled_generic_bg_1.dds` 29² (14), `tiled_generic_overlay_bg1.dds` 549 × 600 (268), `_small.dds` 290 × 310 (144), `tiled_special_cut_bg.dds`, `dark_area_cut_8.dds` | Walnut body cells, seamless |
| Paper | `tiled_paper_bg.dds`, `tiled_paper_bg2.dds` 192², `tiled_paper_flat_bg.dds`, `tiled_paper_w_frame_bg.dds`, `tiled_paper_w_frame_one_border*.dds` | Parchment, only these (light class in vanilla) |
| Marble and special | `marble_tiled_bg.dds`, `marble_tiled_bg_edges.dds`, `green_frame_tile.dds`, `raids_filter_tiled_bg.dds`, `tiled_insignia_window.dds` 48², `tiled_decisions_bg_small.dds` | Slate (marble) and bronze cells |
| Headers | `header_bg.dds` 543 × 41, `subview_header_bg_300x101.dds`, `subview_header_bg_375x101.dds`, `tiles/tiled_header_1.dds` 77 × 38 (8), `diplo_details_header.dds` 241 × 51, `construction_header_bg.dds` 689 × 43, `category_header.dds` | Bronze header plates |
| Tooltips and small dialogs | `tiles/tiles_dialog.tga` 96² (sprite `ToolTip`, `GFX_focus_tooltip`, border 32), `tooltip_tile.dds` 132² (45), `small_tiles_dialog.dds` 26² (8), `tiles/tiled_mini_dialog.dds` 26² (12), `tiled_mini_dialog_grey.dds`, `tiled_mini_dialog_with_header.dds` 76 × 56 | Walnut with a thin gilt line; dark class (tooltip text is light) |
| Buttons | `button_123x34.dds` 123 × 36, `button_123x34_alt.dds`, `_gray.dds`, `button_148x34.dds` 148 × 36, `_light.dds`, `button_221x34.dds` 221 × 36, `button_238x38.dds`, `button_261x34.dds`, `button_359x34.dds`, `button_211x20.dds`, `button_94x31.tga`, `button_type_1/2/4/5/6/7/9`, `government_button.dds` 172 × 35, `big_button_232.dds`, `button_268_68.dds`, `leader_selection_button.dds` 180 × 31 ×2, `buttons/icon_button_*.dds` | Gilded-iron plates; one cell per aspect class (section 5); text drawn by the engine; hover from `buttonstate.lua` |
| Sort and filter buttons | `sort_button_*.tga/.dds/.png` (83 … 428 × 29, 2–3 frames), `tiles/tiling_sort_button*.dds`, `diplo_filter_entry.dds` 246 × 34 ×2, `country_filter_entry.dds` 298 × 34 ×2 | Iron bars with a bronze rim |
| Tabs | `tab_large.dds` 516 × 42 ×2, `tab_medium.dds` 420 × 34 ×2, `tab_small_116.dds` 232 × 36 ×2, `tab_small_110.dds`, `tab_settings.tga` 64 × 20 ×2, `unit_stats_view_tabs.dds`, `intel_ledger/tab*.dds` | Walnut tab, gilt edge when selected |
| Close and window buttons | `closebutton.dds` 32 × 33, `closebutton_small.tga` 26², `closebutton_small_2.dds`, `closebutton_16.dds`, `nf_close_button.dds` 27², `naviesview/btn_close.dds` 31², `event_button_minimize.dds` 32 × 33, `log_min.tga` 27² | Iron stud with a bronze cross-bar (no letter X) |
| Checkboxes and radios | `checkbox.tga` 128 × 32 ×4, `checkbox_small*.tga/.dds`, `generic_checkbox.dds` 68 × 30 ×2, `generic_checkbox2.dds`, `generic_checkbox3.dds` 56 × 23 ×2, `generic_3_state_checkbox.dds` 84 × 23 ×3, `checkbox_gold_32.dds`, `decisionview/checkbox_small*.dds` | Bronze socket; checked = gilt tick-mark shape (a stroke, not a letter) |
| Scrollbars and sliders | `scroll_up/down/left/right.dds` 16², `scroll_drager.dds` 16², `scroll_track.dds`, `scroll_track_horisontal.dds` 12², `scrollbar_vertical_bg.dds` 18 × 156, `scrollbar_horisontal_bg.dds` 156 × 18, `scrollbar_slider_2.tga` 64 × 16 ×4, `scrollbar_sliderbackground.tga`, `scrollbar_leftbutton.tga`, `scrollbar_rightbutton.tga` 92 × 21 ×4, `custom_difficulty_slider_bg.dds` | Iron rail, bronze knob; arrows from one generated cell flipped and rotated |
| Plus, minus and small action buttons | `add_one.dds`, `add_5.dds`, `add_10.dds`, `subtract_*.dds` 25–26², `button_small_add.dds`, `button_small_remove.dds`, `expand_button.dds` 19², `expand_collapse_sideways.dds`, `arrow_*_small.dds`, `button_left.tga`, `button_right.dds` 23 × 21 | Iron studs; the five/ten variants carry pip marks (one, two, three dots), not numerals |
| Text plates | `generic_box.dds` 102 × 26, `generic_box_smallest.dds` 70 × 26, `generic_box_96.dds`, `generic_bg_417.dds`, `generic_text_bg_48/88/108.dds`, `generic_mini_bg.dds`, `generic_entry_bg_small.dds` 444 × 24 ×2, `cost_textbox_inv.dds` | Recessed walnut plates |
| Flag frames | `flag_overlay.dds` 82 × 52, `flag_overlay_small.dds` 41 × 26, `flag_small_overlay.dds` 26 × 21, `flag_smallest_overlay.dds` 25², `small_shield_overlay.dds` 32², `large_flag_frame.dds` 92 × 58, `small_flag_frame_thin*.dds`, `diplo_countrylist_flag_frame*.dds` | Bronze bezels; the alpha window stays exactly vanilla's shape so flags mask correctly (the shape is measured, the pixels are generated) |
| Selection frames | `tiles/tiled_selection.dds`, `tiled_selection_bold.dds` 46² | Gilt line |
| Progress bars | `tiles/tiled_progress_bar.dds`, `_color.dds`, `prod_progress_bar2.dds`, `research_progressbar.dds` 377 × 12, `research_progressbar_frame.dds` 383 × 10, `unit_xp_bar.dds`, `navieslist_bar_str.dds` | Bronze groove; gilt fill; `_color` stays a neutral light fill because the engine tints it |
| Generic placeholders | `leader_unknown.dds` 156 × 210, `ideas/idea_unknown.dds` 63², `goals/goal_unknown.dds` 94 × 76, `decisions/decision_generic_decision.dds`, `3d_view_placeholder.dds`, `locked_icon.dds` 76 × 42 | R: a veiled empty portrait niche, an empty bronze idea socket, a blank focus badge, a sealed padlock plate |

#### 4.3 Top bar and map interface

| Surface | Vanilla `.gui` (windows) | Key textures | ZIN treatment | Engine-generic |
| --- | --- | --- | --- | --- |
| Top bar | `topbar.gui` (`topbar`) | `topbar/background.dds`, `background_extended.dds` 2346 × 87; toolbar buttons 110 × 41 ×2: `topbar/toolbar/diplomacy_button`, `production_button`, `science_button`, `construction_button`, `trade_button`, `deployment_button`, `ledger_button`, `intelligence_button`, `staff_office_button`, `topbar_decisionview_button`, `international_market_button`; `topbar/army-`, `navy-`, `airoverview_button.dds` 76 × 38 ×2; `topbar_date_overlay.dds` 366 × 93; `date_pause_button.dds` 412 × 28 ×2, `date_pause_button_bg.dds`; `speed_step.dds` 84 × 10 ×3; `button_speedup.tga`, `button_speeddown.tga` 31 × 26; `topbar/toolbar/topbar_alert_bg.dds` 68 × 17 ×4; `armyoverview_buttons_bg.dds` 403 × 101; `decisionview/decisions_glow*.dds`; `observer_flag_overlay.dds` | R. The band is a seamless walnut-and-gilt tile repeated to 2346. Each toolbar button carries a lettering-free emblem: diplomacy = sealed letter and ribbon; production = anvil; research = open book and astrolabe; construction = mason's square and trowel; trade = balance scales; recruitment = banner on a spear; ledger = bound ledger; intelligence = hooded dark-lantern; staff office = map table pins; decisions = wax seal; market = coin purse. Army, navy and air overview: sword, galley prow, a great wing feather (no griffin until the owner adopts griffins) | — |
| Top bar values | same | `pol_power_icon.dds`, `stability_icon.dds`, `war_support_icon.dds`, `manpower_icon.dds`, `unity_icon.dds` 27², `command_power_icon.dds`, `industrial_capacity_icon.dds` 70 × 29 ×2, `topbar/topbar_convoys.dds` 28 × 18, `ships_icon.dds`, `equipment_icon.dds` 22 × 18, `topbar/fuel_icon.dds`, `fuel_bar.dds` 45 × 24, `fuel_state_icon.dds`, `topbar/nuke_icon.dds` | R: political power = quill and seal; stability = keystone; war support = war horn; manpower = three spear heads; workshops (factories) = hammer on anvil and a crossed armoury hammer (two frames); merchant fleets = cog under sail; equipment = shield and sword; stored Essence (fuel, economy spec) = a vial of pale light. The nuke icon is unreachable (`U`) | — |
| Gathering Dark (world tension) | `topbar.gui`, `worldtensionwindowpopup.gui` | `world_tension_icon.dds` 29 × 25, `world_tension_icon_big_strip.dds` 490 × 49 ×10, `WT_anim_strip.dds` 2574 × 78 ×33 | R: a storm lantern whose flame dims and whose glass clouds over across 10 frames; the 33-frame flicker is cut from one 6 × 6 sheet of the same lantern (fallback: all frames one cell, a static icon). Text "The Gathering Dark" comes from [01_interface.md](01_interface.md) | — |
| Music player | `musicplayer.gui`, `topbar.gui` | `topbar/musicplayer/*.dds` (playlist bg 228 × 42, buttons 33², pause 66 × 33 ×2) | R in gilded iron; the player button is a small lute | DLC music station art |
| Map modes | `mapmodes_interface.gui` | `mapmode/mapmode_buttons_selected_small.dds`, `_deselected_small.dds` 360 × 18 ×18; `_big.dds` 136 × 31 ×4; `mapmode_main_bg.dds` 87 × 206; `mapmode_bottom_bg.dds` 86 × 59; `mapmode_button_bg.dds` 42 × 51; `mapmode_configure_bg.dds` 519 × 23 ×3; toggles 44 × 22 ×2 (`fog_of_war_toggle`, `radar_toggle`, `allied_plans_button`, `counters_color_mode_button`, `player_counters_toggle`, `day_night_toggle`) | R on slate. The 18 small map mode emblems are one 6 × 6 sheet (selected and deselected states are separate cells). ZIN's own map mode buttons follow [01_interface.md](01_interface.md) §11 | Map mode colours (engine) |
| Minimap | `minimap.gui` (`mini_map_interface`) | `gfx/minimap/minimap.dds` 268 × 97 (an Earth picture), `border.dds` 276 × 105, `handle_default.dds`, `handle_pinged.dds` 24 × 64, `offensive_ping_btn.dds`, `defensive_ping_btn.dds` 64 × 31 ×2, `minimap_ping_*.dds`, `ping_circle.dds` 128², `worldmap_ping_*.dds` | **`minimap.dds` is the ZIN map**: the builder resizes the ZIN map's own colormap (already generated art) to 268 × 97 over the full map extent. Frame, handles and ping buttons R on slate and bronze | `minimap_quad_pixel.dds` |
| Clock | `ingameclock.gui` (`clock_window`) | `ingameclock_bg.dds` 228 × 42 | R | — |
| Find and zoom | `findview.gui`, `topbar.gui` | `open_find_view_button.dds`, `mapmode/find_screen_button.dds` 39², `topbar/zoom_in.tga`, `zoom_out.tga` 27² | R: a spyglass; plus and minus shown as raised and sunken studs | — |

#### 4.4 Alerts and messages

| Surface | Vanilla `.gui` | Key textures | ZIN treatment |
| --- | --- | --- | --- |
| Alerts | `alerts.gui` (`global_alerticon_window`, `global_diplorequesticon_window`) | `alerts/global_alert_icons.dds` 3290 × 42 ×70 (47 × 42 each), `global_alert_icons_no_backgrounds.dds` same, `global_diplorequest_icons.dds` 893 × 42 ×19, `red_alert_glow.dds`, `yellow_alert_glow.dds`, `green_alert_glow.dds` 94 × 42 ×2 | R. The meaning of each frame is recorded once in `tools/content/data/ui/alert_frames.json` by an agent reading the alert tooltip keys (vanilla pixels are viewed only to label the order, never used as references). Two 6 × 6 sheets of plate-and-emblem alerts (72 cells, 70 used) and one 4 × 5 sheet for diplomatic requests. The "no backgrounds" strip is cut from the same cells' emblem layer generated on key without the plate |
| Message log and settings | `menubar.gui` (`messagelog_window`, `menu_message_settings`), `messagesettings.gui`, `msg_filters.gui` | `save_load_entry_bg.dds` 280 × 40, the message filter checkboxes, `messageicon` art in `menubar.gfx` | R through shared chrome and a small icon sheet |
| Popups | `popupwindow.gui` | `popup_window/*.dds` | R |

#### 4.5 Events and news

| Surface | Vanilla `.gui` (windows) | Key textures | ZIN treatment |
| --- | --- | --- | --- |
| Country events | `eventwindow.gui` (`EventWindow`, `EventWindow_leader`) | `event_report_top_win.dds` 581 × 121, `event_report_tileable_midsection.dds` 580 × 66, `event_report_bottom_win.dds` 581 × 206, `event_report_bottom_win_2.dds` 581 × 59, `event_option_entry.dds` 352 × 48, `event_pic_clip.dds` 55 × 30, `events/clip.dds` 53 × 29 | R: a walnut writing board with a bronze rim; the midsection is a seamless vertical tile; option plates are gilded iron; the "clip" holding the picture becomes a bronze picture clamp. The picture slot keeps 210 × 176 |
| News events | `eventwindow.gui` (`EventWindow_News`) | `event_news_bg.dds` 528 × 595, `event_news_pic_overlay.dds` 399 × 155 | R: a parchment broadsheet on walnut (no masthead lettering; the headline is the event title in the engine font). The overlay is a thin bronze inner frame for the 397 × 153 picture |
| Operative events | `eventwindow.gui` (`EventWindow_Operative`) | `events/event_operative_bg.dds` 12672 × 596 ×24 (DXT3) | `U` while ZIN gives no operative events (the intelligence agency is unused, section 4.8); if the warfare spec enables operatives, R from one 6 × 4 sheet |
| War escalation strips | `eventwindow.gfx` | `events/war_escalation_level_*.dds` | `U` (Gotterdammerung content) |

Event and news pictures themselves are content sprites ([02_icon_catalog.md](../05_focus_trees/02_icon_catalog.md)).

#### 4.6 Politics, diplomacy, decisions and focus

| Surface | Vanilla `.gui` (windows) | Key textures | ZIN treatment | Notes |
| --- | --- | --- | --- | --- |
| Politics | `countrypoliticsview.gui` (`countrypoliticsview`, `political_ideas_window`, `manage_subjects_window`) | `ongoing_focus_goal_polview.dds` 423 × 115 ×3, `leading_pol_party_bg.dds` 196 × 15, ideology emblems (section 3.5), `autonomy/*.dds` (autonomy states, 35² unknown icon), `add_pol_idea_button.dds` 63², `occupation_policy_button_selected.dds` 46², `government_in_exile/*.dds` | R; autonomy level icons are bronze seals of increasing size (five frames); ZIN's autonomy states (Concord charters, eastern client) carry Z icons from the catalog | Ideology pie colours are engine-filled |
| Diplomacy | `countrydiplomacyview.gui` (`countrydiplomacyview` and its entries) | `diplo_response_bg.dds` 449 × 40, `diplo_unity_bg.dds` 42 × 62, `accept_decline_icon.dds` 72 × 21 ×3, `relations/*.dds` (relation icons ~46 × 27), `diplo_action_*_bg.dds` (for example 527 × 360), `factions/*.dds` | R; relation icons are a 6 × 6 emblem sheet (guarantee = shield, access = open gate, trade = scales, non-aggression = sheathed sword, puppet = leash of gold chain, war = crossed blades, alliance = clasped gauntlets) | Faction icons come from the diplomacy spec as Z |
| Decisions | `countrydecisionview.gui` (`countrydecisionview`, `decision_item`, `timed_decision_item`, `event_item`) | `decisionview/decision_item_bg.dds` 1536 × 40 ×3, `decision_item_bg_single.dds`, `decision_AI_item_bg.dds` 511 × 40, `decision_progress_bg.dds`, `_good.dds`, `_bad.dds` 503 × 40, `category_header_bg.dds` 516 × 53, `event_header_bg.dds` 515 × 83, `event_item_bg.dds` 512 × 33, `decision_select_icon_strip.dds` 160 × 28 ×4, `decision_timer_icon_strip.dds` 106 × 28 ×4, `locator_item_icon.dds` 40 × 34 | R; good and bad progress use verdigris and cinnabar enamel inlays | Category pictures and decision icons are Z content |
| Focus tree | `nationalfocusview.gui` (`nationalfocusview`, `national_focus_item`, `national_focus_link`) | `tiles/tiled_focus_bg.dds` 998 × 1031, `focusview/focuslink.dds` 96 × 16 ×6, the 15 `focus_link_*.dds` 64 × 16 ×4, `focus_link_exclusive.dds` 96 × 32 ×3, `focus_exlusive_link_line1/2.dds`, `focusview/titlebar/focus_unavailable_bg.dds`, `focus_can_start_bg.dds`, `focus_completed_bg.dds` 164 × 50, `ongoing_focus_goal.dds`, `search_current_focus.dds` 423 × 115 ×3, `cont_focus_check_icon.dds`, `focusview/filter/*.dds` (filter emblems 27², `icon_bg.dds` 84 × 42 ×2, `find_editbox.dds` 200 × 39, zoom 42 × 35) | R. The background is a seamless walnut board with faint chart lines. Links are bronze wire (available), gilt (completed), red wax cord (exclusive). Title bars: dull iron (unavailable), bronze (can start), gilt with a verdigris inlay (completed). Generic filter emblems (political power, research, industry, stability, war support, manpower, annexation) R; country-specific vanilla filters (`*_FRA_*`, `*_CHI_*`, `*_USA_*`, `*_GER_*`, `*_TFV_*`) are `U` | ZIN focus filters, if any, are Z |

#### 4.7 Research, production, construction, trade, logistics, recruitment

| Surface | Vanilla `.gui` (windows) | Key textures | ZIN treatment | Notes |
| --- | --- | --- | --- | --- |
| Research slots | `countrytechnologyview.gui` (`countrytechnologyview`, `research_slot_entry`) | `research_line_bg.dds` 508 × 99, `research_folder_strip.dds` 624 × 52 ×12 (DXT1; also `GFX_d_category_empty_picture`), `empty_research_slot_glow.dds` 950 × 78 ×2, `research_speed_icon.dds`, `focus_bonuses_icon.dds`, `tech_bonus.dds` 432 × 29 ×6 | R; the 12 folder tabs are emblems for ZIN's folders in the warfare spec's order (for example arms, armour, siege, mounts, ships, beasts, magic, industry, doctrine) | The folder list belongs to the warfare spec; this spec gives art |
| Technology tree | `countrytechtreeview.gui` (`countrytechtreeview`, folder windows) | `techtree/technology_available_item_bg.dds`, `_researched_`, `_unavailable_` 183 × 84, `subtechnology_unavailable_item_bg.dds` 40 × 27, `techtree/techtree_stripes.dds` 120 × 280, folder backgrounds `techtree/*_techtree_bg.dds` (948 … 1230 × 589 … 766), doctrine backgrounds 360 × 660 and 464 × 290, `fullborder_tiled.dds`, `border_tiled.dds` | R for item plates and stripes. Folder backgrounds are drawn per ZIN folder (Z, one parchment-and-walnut board per folder, 1230 × 766 max), referenced from the overridden `countrytechtreeview.gui` | `O` file owned by the warfare spec |
| Production | `countryproductionlineview.gui` (`countryproductionlineview`, `production_military_line_entry`, `production_equipment_window`) | `resources_strip.dds` 189 × 27 ×7, `add_prod_*_line.dds`, `close_production_line.dds`, `prod_progress_bar2.dds` 118 × 63, `equipment_item.dds` 147 × 69, line backgrounds, `technologies/tank_icon.dds` 76 × 42 (`GFX_technology_medium` default) | R. The seven resource frames follow `icon_frame` 1–7 in `common/resources/00_resources.txt` (`oil`, `aluminium`, `rubber`, `tungsten`, `steel`, `chromium`, `coal`), shown as Essence, Timber, Horses, Stone, Iron, Gold, Grain (economy spec); the builder reads `icon_frame` from the loaded resources file before assembling the strip | Equipment pictures are Z (warfare) |
| Construction | `countryconstructionsview.gui` (`countryconstructionsview`, `production_building_line_entry`) | `construction_entry_bg.dds`, `construction_special_entry_bg.dds` 402 × 54, `construction_line_glow.dds` 804 × 54 ×2, `construction_progressbar*.dds`, `construction_title_bg.dds` 65 × 21, `construction_flag_overlay.dds` 82 × 52, `buildings/building_icon_strip.dds` 1426 × 46 ×31, `buildings/*.dds`, `constructions_bg1..4.dds`, `non_available_factory_icon.dds`, `construction/*.dds`, `backhoe_icon_small.dds` | R. The 31 building frames follow the engine building order; frames for buildings the economy spec names (Guild Workshops, Armouries, Shipwrights, Roads, Granaries, Mine and Quarry Roads, forts, Scorpion Towers and the rest) get emblems; unused buildings (refinery, rocket site, nuclear, dams, canals) get a plain capped-socket emblem because the strip is one file | Building names belong to the economy spec |
| Trade | `countrytradeview.gui` (`countrytradeview`, `tradeoffer_window`), `international_market/*` | `tiles/tiling_sort_button.dds`, `construction_header_bg.dds`, resource strip, market art | R | International market art is R if the market is reachable (economy decides), else `U` |
| Recruitment and deployment | `countrydeploymentview.gui` (`countrydeploymentview`, `templatedeploymentwindow`, `deploy_entry`) | `priority_strip.dds` 80 × 21 ×4, `deployment_entry_progressbar.dds` 65 × 12, `div_deploy_priority_icon_strip.dds` 48 × 52 ×3, `special_forces_icon.dds` 78 × 23 ×3, `obsolete_template_warning.dds` | R; priority pips are one to three bronze studs | Division icons are Z (warfare) |
| Logistics | `countrylogisticsview.gui` (`countrylogisticsview`, `logistics_fuel_window`) | `logistics_status_fuel_bar.dds` 100 × 14, `logistic_fuel_types.dds` 136 × 31 ×4, `chart_history_level_button.dds` 152 × 31 ×2, supply icons (`unitcontrol/supply_strip.dds` 72 × 24 ×3), `supply.gfx` art | R; fuel visuals become Stored Essence (vial), supply becomes a grain sack and waggon wheel | The fuel window is reachable but empty (economy sets fuel use 0) |

#### 4.8 Intelligence, ledger, state view

| Surface | Vanilla `.gui` (windows) | Key textures | ZIN treatment |
| --- | --- | --- | --- |
| Intelligence agency and operatives | `countryintelligenceagencyview.gui`, `operative.gui`, `operativeleader.gui` | `operatives/agency_header.dds` 530 × 42, `opacity_layer.dds` 540 × 150, `spymaster_button.dds` 214 × 28, `operatives/agencies/agency_logo_*.dds` 233 × 119 ×2 (one per vanilla country), `operations/*.dds` | R for chrome. The agency logo list is vanilla country content: ZIN offers 12 neutral agency seals (Z, proposed: a key, a hooded lantern, a quill, a closed book, a ring, a spool of thread, a cloak pin, a sealed scroll, an hourglass, a moth, an owl feather, a coin; no masks or veils, which belong to the Deliverer's icons) and the vanilla country logos are `U`. Whether operatives exist at all is the warfare and diplomacy specs' choice; this skin applies either way |
| Ledger | `countryintelledger.gui` (`ledger_*_entry`, the ledger window) | `intel_ledger/no_intel.dds` 490 × 100, `intel_ledger/tab*.dds`, `capital_icon.dds` 39², `diplo_unity_bg.dds` | R; the ledger is the one large surface in parchment where vanilla is light, otherwise walnut |
| State view | `countrystateview.gui` (`countrystateview`) | `stateview/ww_stateview_bg.dds` 463 × 653, `building_entry_stateview.dds`, `victorypoint_stateview_bg.dds` 44 × 26, `building_damage_bar*.dds`, `building_level_bar.dds`, `state_modifiers/*.dds` (vanilla content `U`) | R |

#### 4.9 Military views

| Surface | Vanilla `.gui` (windows) | Key textures | ZIN treatment |
| --- | --- | --- | --- |
| Army overview and outliner (theatres, armies, army groups) | `theatreselector.gui` (`theatre_selection_window`, `theater_group_item`), `unitview.gui` (`armies_view`, `army_division_view`), `countryarmyview.gui`, `leadergroups.gui` | `unitcontrol/army_group_group_bg.dds` 436 × 110, `unitcontrol/unit_list_header.dds` 392 × 35, `unitcontrol/unitcontrol_sort_buttons_strip.dds` 228 × 21 ×12, `unit_level.dds` 135 × 27 ×5, `army_badge_*.dds`, `armyoverview_*.dds`, `unitcontrol/*.dds` (traits 27 × 25, give-role strip, hq badge), `gfx/army_icons/army_icons.dds` 2673 × 32 ×81 (army shield badges) | R. The 81 army badges are one 9 × 9 sheet of heraldic charges (lion, boar, tower, oak, wave, star, key and so on) on bronze shields, no letters |
| Unit leader and officers | `unitleaderwindow.gui`, `command_character_view.gui`, `countryofficercorpview.gui`, `armytraittreewindow.gui`, `traittreewindow_common.gui` | `unitleaderwindow.gfx` art, `land_battle_leader_skill_bg.dds` 35 × 50, `leader_en_route.dds`, trait tree backgrounds, `officer_corp/*.dds`, `trait_window/*.dds` | R for chrome; trait icons are Z (warfare); the officer corps spirits (`officer_corp_spirits.gfx`) are vanilla content and `U` unless the warfare spec maps them |
| Division designer | `divisiondesignerview.gui` | `divisiondesigner/*.dds`, `division_icon_bg_transp.png` 96 × 45 | R for chrome; sub-unit icons are Z (warfare §14) |
| Equipment designers (tank, ship, plane), equipment upgrade | `tank_designer_view.gui`, `equipmentdesignerview.gui`, `plane_designer_view.gui`, `equipmentupgradedesignerwindow.gui` | `equipmentdesigner/*` (2,661 files), `tank_profiles.gfx`, module icons | `U` when the warfare spec gives no designer equipment (expected); if a designer stays reachable, its chrome is R and its modules Z |
| Navy | `naviesview.gui` (`naviesview_window`, `taskforce_view_entry`), `naval_strategic_region_view.gui`, `navyleaderview.gui`, `navytraittreewindow.gui` | `naviesview/*.dds` (`btn_*` 31², `naval_target_ships_button.dds` 228 × 32 ×2, `pride_of_the_fleet_icon.dds`), `strategicnavy/*.dds`, `navalrepairview/*.dds`, `navalcombat/ships/*.dds` 108 × 22 ×2 (ship silhouettes) | R; ship silhouettes are galleys, warships, great warships and raiders (warfare spec) as one sheet |
| Air | `strategicairview.gui` (`strategicairview`), `airgroupview.gui`, `airwingdetails.gui`, `airwingreorganization.gui`, `carrierairwingcompositionwindow.gui`, `airselectionview.gui` | `strategicair/mission_types.dds` 798 × 29 ×19, `wing_types_own.dds`, `wing_types_enemy.dds` 136 × 24 ×4, `wing_types_map.dds` 1440 × 12 ×48, `mission_btn_bg.dds` 188 × 34 ×4, `airview/*.dds`, `air_*.dds` | R. Air is the dragons and griffins layer ([INTEGRATION_DECISIONS.md](../INTEGRATION_DECISIONS.md) S6): mission emblems are wings, talons and flames, never aircraft |
| Land combat | `landcombat.gui` (`landcombatview`) | `landcombat/*.dds` (terrain banners, tactic plates), `combat_header.dds` 411 × 27 (DXT1), `combat_width.dds`, attacker and defender icons | R on slate and bronze; tactic pictures are Z (warfare names tactics) |
| Naval combat | `navalcombat.gui` (`navalcombatview`), `navalcombatresultswindow.gui`, `naval_losses.gui`, `destroyedshipswindow.gui` | `navalcombat/bg_weather_*.dds` 486 × 63 (6 weather and night states), ship rows | R: sea strips with oared hulls on the horizon in six weathers |
| Peace conference | `peaceconferencewindow.gui` (`peaceconference_full_window`) | `peace_conference/*.dds` (`pop_up_entry.dds` 904 × 44 ×2, `pc_victory_entry.dds` 624 × 84 ×2, `conference_top_left/right.dds`), `tiles/tiled_peace_upper_bar.dds` | R: a council table of walnut and parchment |
| War overview, world tension popup, capitulation, endgame | `waroverview.gui`, `worldtensionwindowpopup.gui` (`world_tension_popup`), `menubar.gui` (`endgame_dialog`) | `waroverview_bg.dds` 1167 × 590, `waroverview_tabs*.dds` 94 × 51 ×2, `capitulation_bg.dds`, `balance_icon.dds` | R |
| Railway guns, raids, special projects, mio, imperial influence, paranoia, other DLC systems | `railway_gun.gui`, `military_raids/*`, `special_project/*`, `military_industrial_organization/*`, country scripted GUIs (`GER_*`, `SOV_*`, `JAP_*` …) | their art | `U` unless a ZIN spec turns the system on; vanilla country scripted GUIs never load because ZIN has no vanilla country tags (checked by the reachability test) |

#### 4.10 Map icons, text icons and cursors

| Surface | Files | ZIN treatment |
| --- | --- | --- |
| On-map icons | `mapicons.gui` (`unit_counter`, `victory_point_mapicon`, `capital_mapicon`, `resource_mapicon`), `interface/mapicons.gfx` (145 sprites): `onmap_unit_counter.dds` 198 × 27 ×3, `onmap_unit_counter_empty.dds`, `_ideology.dds` 112 × 27 ×4, `_selected.dds`, `_half*.dds`, `_overlay*.dds`, `mapicons/mapicon_*.dds` (orders, bars 3 × 17), `mapicons/supply/supply_hub_interaction_icons.dds` 770 × 70 ×11, `mapitems/capital.tga`, `mapitems/flag_frame.tga`, `gfx/mapitems/movearrow_*.dds` | R: counter plates are generated in the vanilla green counter palette with a thin bronze rim, because the warfare spec matches its counter icons to that palette ([01_warfare.md](../03_gameplay/01_warfare.md) §14.2); the ideology frame strip carries four neutral enamel colours (it is tinted by ideology elsewhere); the capital marker is a gilt tower; move arrows keep vanilla's shape and alpha with generated textures (bronze for move, cinnabar for attack, verdigris for support). Unit icons on counters are Z (warfare) |
| Text icons | `interface/texticons.gfx` (473 sprites), `gfx/texticons/*.dds` (331 files, for example `victory_point_texticon.dds` 18²) | R for the generic set used by tooltips (political power, stability, war support, manpower, resources, workshops, days, victory points, tick and cross); the builder lists the keys used by any loaded ZIN or engine localisation; the rest are `U` |
| Cursors | `gfx/cursors/` (126 files: `.cur`, `.ani`, `.png`, `.ico` for 60 cursor names such as `normal`, `selected`, `attack_move`, `busy`, `cant_move`, `build_*`, `operatives_*`, `brush*`) | R: one 6 × 6 sheet per 36 cursors of gilded-iron pointer and tool glyphs (pointer, gauntlet, sword for attack, boot print for move, hourglass for busy, trowel for build, quill for diplomacy). The builder converts each cell to `.cur` (32 × 32, hotspot taken from the vanilla file's header) and `.png`, and to `.ani` for the four animated cursors by assembling 4 cells of the same glyph. If the Linux run shows cursor artefacts, cursors become engine-generic and the spec records it |

#### 4.11 Pause menu, options, lobby, social

| Surface | Vanilla `.gui` (windows) | ZIN treatment | Engine-generic |
| --- | --- | --- | --- |
| Pause menu, save, load | `ingamemenu.gui` (`ingamemenu`, `ingamemenu_save`, `ingamemenu_load`) | R through shared chrome and `main_lobby_button.dds`, `save_load_file_disconnected_3frames.dds` 369 × 34 ×3, `load_save_*.dds` | The six link icons (`icon_homepage`, `icon_forum`, `icon_discord`, `icon_privacy`, `icon_bluesky`, `icon_x`, 41 × 45): links to Paradox services and the privacy page stay as published |
| Options | `settings.gui` | R through shared chrome (`tab_settings.tga`, sliders, `generic_bg_417.dds`) | — |
| Multiplayer, lobby, matchmaking, chat, hot join | `frontendmultiplayerview.gui`, `playerlobby.gui`, `matchmaking*.gui`, `chat.gui`, `hotjoin.gui`, `ingamelobby.gui` | R through shared chrome | Account, friends and social views (`social_view.gui`, `frontend_friends_view.gui`, `pops_login.gui`) |
| Achievements | `achievements.gui` | H on the main menu; ZIN has no achievements | — |
| Tutorial | `tutorialscreen.gui`, `tutorial/*.dds` glows | H (the button is hidden); glows R only where shared (they are reused in other windows) | — |
| Console, debug, error log | `core.gfx` `console_win_bg.dds`, `debug.gfx`, `ai_trace.gui` | — | Yes |

### 5. Families and theme sheets

A family is a set of surfaces that must look like one object. Each family has one **primary theme sheet** that defines its materials in uniform cells, plus icon sheets where it has emblems. All sheets of a family share one prompt preamble (materials, palette tokens, lighting), so they match.

Sheets follow the art pipeline layouts ([01_art_pipeline.md](../08_art_and_assets/01_art_pipeline.md) §4) and decisions A1 and A2. The job states the aspect (3:2 or 1:1) and the model returns about 1.57 megapixels in that aspect. The ground is **flat black**. Cells are of one size per sheet, so the region detector (`findRegionsAdaptive` in `tools/content/lib/sheets.mjs`) can refuse a bad sheet. Long bands and strips are generated **one per job** on a black canvas with ends darkening to black and are cut by rows, as the loading chrome is today. A cell that needs a transparent interior (a picture frame, a bezel, a flag window) is a single job on flat magenta, keyed like the emblem. The cell map of each sheet is data (`tools/content/data/ui/sheets/<id>.json`).

| Family | Primary sheet (cells) | Extra sheets | Targets (approx.) |
| --- | --- | --- | ---: |
| `chrome_panels` | `ui-chrome-panels` 3 × 2 square: thick-border walnut panel, double-border panel, thin-border panel, borderless walnut, parchment panel, slate panel | `ui-chrome-small` 4 × 3 square: mini dialog, tooltip, selection line, small window, header plate end caps, separators | 70 |
| `chrome_controls` | `ui-buttons` 3 × 4 wide (4:1): rows = standard, alternate, grey, light; columns = normal, hover, pressed | `ui-buttons-tall` 3 × 3 (2:1) for square-ish buttons; `ui-controls-small` 6 × 6: checkboxes, radios, close studs, scroll arrows, drag knobs, plus and minus studs, expand arrows, tick and cross marks | 140 |
| `chrome_bars` | `ui-bars` 1 × 8 long bars (generated 3:1, used as seamless tiles): header band, list entry, entry selected, progress groove, progress fill, tab body, tab selected, text plate | — | 120 |
| `topbar` | `ui-topbar` 1 × 6 bars: band, band extended, date plate, speed steps, alert plate, overview tray | `icons-topbar` 6 × 6: toolbar emblems normal and hover, value icons, music buttons; `icons-gathering-dark` 4 × 3 (10 tiers) and 6 × 6 (flicker) | 70 |
| `map_interface` | `ui-map` 3 × 2: map mode tray, minimap frame, clock plate, handle, ping button, toggle | `icons-mapmodes` 6 × 6 (18 selected + 18 deselected) | 70 |
| `alerts` | `icons-alerts-1`, `icons-alerts-2` 6 × 6 | `icons-diplorequests` 4 × 5; glows 3 cells in `ui-chrome-small` | 95 |
| `events` | `ui-events` 2 × 3: board top, board mid tile, board bottom, bottom end, option plate, picture clamp | `ui-news` 1 × 2 tall (news broadsheet, inner frame) | 10 |
| `politics_diplomacy` | `icons-ideologies` 3 × 2 (four ideologies, unknown, spare) | `icons-relations` 6 × 6; `icons-autonomy` 3 × 2; `icons-agencies` 4 × 3 | 70 |
| `focus` | `ui-focus` 3 × 3: board tile, three title bars, ongoing plate, three link wires | `icons-focus-filters` 4 × 3 | 40 |
| `research_production` | `ui-research` 3 × 3: item plates (three states), folder tab, line plate, stripes, bonus plate | `icons-folders` 4 × 3; `icons-resources` 4 × 2; `icons-buildings` 6 × 6 | 90 |
| `military` | `ui-military` 3 × 3: counter bar, group plate, list header, sort strip cell, level pips, badge plate | `icons-army-badges` 9 × 9 (two sheets of 6 × 6 if the generator cannot hold 81), `icons-air-missions` 6 × 4, `icons-ships` 4 × 2, `icons-weather` 3 × 2 | 220 |
| `frontend` | see [03_main_menu_and_frontend.md](03_main_menu_and_frontend.md) | — | 40 |
| `loading_frame` | `ui-loading` 1 × 4 bars: status band, tip plate, progress groove, progress fill | — | 5 |
| `cursors` | `icons-cursors-1`, `icons-cursors-2` 6 × 6 | — | 60 |
| `texticons` | `icons-text-1`, `icons-text-2` 6 × 6 | — | 70 |
| **Total** | **about 40 sheets, about 60 generation calls with retries** | | **about 1,170 textures** |

**Fit from cell to target** (per row of `reskin.json`):

| Fit | Rule |
| --- | --- |
| `nine_slice` | The cell's painted border width is declared in the sheet map (`cellBorder`). Cut at that border, resize corners to the target's `borderSize`, edges along their length, and the centre to fill. Used for every `corneredTileSpriteType` |
| `exact` | Resize to the exact target; refuse if the aspect differs by more than 15% (then `cover`) |
| `cover` | Crop the centre to the target aspect, then resize |
| `contain` | Fit inside with the family's padding; transparent margin |
| `repeat_x`, `repeat_y` | Resize the seamless cell to the target's short side, repeat along the long side, crop |
| `strip` | Build N frames from the listed cells in the vanilla frame order (`frames: ["normal","hover","pressed"]`) |
| `same_shape` | Use the vanilla alpha outline as a mask boundary only (a binary shape measured from the vanilla file, never its colours); the generated pixels fill it. Used for flag frames and arrows where the engine depends on the shape |

### 6. Production order

Each step runs the full loop: generate, review, slice, stage, `hoi4.gui_inspect`, `hoi4.gui_render`, and in phase builds a Linux capture of the step's screens.

| Step | Scope | Why this order | Depends on |
| ---: | --- | --- | --- |
| 1 | Inventory, `reskin.json` with every sprite classified, builder fit and check code, `GFX_zin_empty` | Nothing can be accepted without it | — |
| 2 | Frontend (03 spec) and loading frame | The first screens every player sees. The loading frame, the emblem, the menu backgrounds and the bookmark picture are done (Current state); the menu layout, country selection and rules screens remain | calendar spec bookmark |
| 3 | `chrome_panels`, `chrome_controls`, `chrome_bars`, tooltips | Themes every window at once | 1 |
| 4 | Text colours and font aliases | Must be judged on the new chrome | 3 |
| 5 | `topbar`, `map_interface`, minimap, clock, Gathering Dark icon | Always on screen; the Erdae bar sits under the top bar | 3, [01_interface.md](01_interface.md) bar |
| 6 | `events` and news | Every story beat uses them | 3 |
| 7 | `politics_diplomacy`, decisions, `focus` | Read every session; ideology emblems needed by politics | 3 |
| 8 | `research_production`, construction, trade, logistics, recruitment | Needs the warfare folder list and economy building order | 3, warfare, economy |
| 9 | `military`, combat, peace conference, war overview, map icons | Needs warfare sub-units and ships | 3, warfare |
| 10 | `alerts`, message log, `texticons` | Many small emblems; labelling of alert frames first | 3 |
| 11 | `cursors` | Least risk to playability; easy to roll back | 3 |
| 12 | Reachability sweep: every `R` row has art, every `U` row is proven unreachable, every `E` and `H` row has a reason | Closes the phase | all |

### 7. Unreachable vanilla content

Most vanilla interface textures are content: about 2,950 focus icons, 3,390 idea pictures, 1,320 technology pictures, 2,660 equipment designer files, 615 decision pictures, 885 event picture sprites and 1,830 leader portraits. ZIN content uses its own `Z` sprites, so these are `U`. The reachability check (Implementation, check 4) proves it by resolving every sprite name referenced from:

- every loaded `.gui` element in a window ZIN can show (all vanilla windows except the hidden and unreachable ones listed above, plus ZIN windows),
- every loaded script (`common/`, `events/`, `history/`), and every localisation `£icon` text icon,
- engine-default sprite names the game requests without script (the `GFX_technology_medium` default, `GFX_leader_unknown`, `GFX_idea_unknown`, `GFX_goal_unknown`, the ideology group emblems).

A `U` sprite that turns out reachable fails the build. Vanilla `.gfx` files that only define `U` sprites still load (they are vanilla), which costs memory but not errors; replacing them with empty definitions is not proposed because it would mean shipping many vanilla file names.

### 8. Interface wording

Window titles, button labels and tooltips of vanilla surfaces use Erdae terms through `localisation/replace/`. Terms belong to the spec that owns the system: resources, buildings, laws and merchant fleets to [02_economy.md](../03_gameplay/02_economy.md); units, equipment and air as beasts to [01_warfare.md](../03_gameplay/01_warfare.md); ideologies and parties to [02_ideologies_and_politics.md](../00_foundation/02_ideologies_and_politics.md); the Gathering Dark and month names to [01_interface.md](01_interface.md) and the calendar spec. This spec owns only the names of the windows themselves (proposed):

| Vanilla | ZIN title | Vanilla | ZIN title |
| --- | --- | --- | --- |
| Diplomacy | Diplomacy | Production | The Armouries |
| Politics / Government | The Throne | Construction | Works |
| Research | Scholars | Trade | Trade |
| Recruit and Deploy | Muster | Logistics | Supply |
| Intelligence | Spymasters | Decisions | Decisions |
| Focus tree | Path of the Realm | Ledger | The Ledger |
| Army / Navy / Air overview | Hosts / Fleets / Wings | Staff office | War Council |

The builder's word scan (economy acceptance 1 extended) also forbids, in any player-visible interface text: factory, rifle, tank, aircraft, plane, radar, nuclear, fuel, oil, democracy, fascism, communism, 1936, 1939.

## Implementation

### Files

All files are generated by the ZIN content builder (`tools/content/build.mjs`, [INTEGRATION_DECISIONS.md](../INTEGRATION_DECISIONS.md) S10) and written to the mod through `tools/content/apply.mts`, the shared atomic rewrite engine. Builder data lives in `tools/content/data/ui/`; the builder publishes a copy under `docs/design/ui/` for review, as it does for `data/vanilla/`.

| Path | Content |
| --- | --- |
| `tools/content/data/ui/vanilla_inventory.json` | Generated from the installed game: per sprite name, kind, texture path, extension, width, height, frames, `borderSize`, DDS format, mean luminance class, alpha kind (`opaque`, `keyed`, `uniform:<a>`, `shaped`), the `.gui` files and windows that reference it; header: game version, file hashes of the inventoried vanilla files. Metadata only, no vanilla text or pixels |
| `tools/content/data/ui/reskin.json` | One row per inventory sprite: `disposition` (`R`, `Z`, `O`, `D`, `E`, `H`, `U`), `family`, `sheet`, `cells`, `fit`, `frames`, `reason` (required for `E`, `H`, `U`) |
| `tools/content/data/ui/sheets/<id>.json` | Sheet jobs: aspect, grid, ground (black, or magenta for keyed singles), `cellBorder`, keys in cell order, prompt subjects |
| `tools/content/data/ui/alert_frames.json` | Meaning of each alert and diplomatic request frame |
| `tools/content/data/ui/textcolors.json` | Section 3.4 table |
| `tools/content/data/ui/titles.json` | Section 8 window titles |
| `tools/content/data/ui/overrides/<file>.json` | For each `O` file: the template id, the element names it keeps, the hidden elements, the added elements |
| `tools/content/templates/ui/<file>.tmpl` | ZIN-written templates of the `O` files |
| `gfx/interface/**`, `gfx/cursors/**`, `gfx/minimap/**`, `gfx/mapitems/**`, `gfx/texticons/**`, `gfx/game_rules/**` | `R` replacements at vanilla paths |
| `interface/zin_reskin.gfx` | `GFX_zin_empty` (1 × 1 transparent, `gfx/interface/zin/empty.dds`) and any ZIN sprite the overrides need |
| `interface/zz_zin_textcolors.gfx` | The additive text colour block and the typewriter aliases (sections 3.4, 3.7) |
| The `O` files of section 2.3 | Re-authored overrides |
| `localisation/replace/zin_interface_l_english.yml` | Window titles and labels of section 8 not owned by other specs |
| `art/source/provenance.jsonl`, `art/source/reskin_manifest.json` | Provenance as the art pipeline defines; the manifest has one line per `R` file (output, source, cell, operations, hashes), in the format of today's `art/source/presentation_manifest.json` |

### Builder modules

| Module | State | Does |
| --- | --- | --- |
| `tools/content/modules/presentation.mjs` | existing | Writes the surfaces already in game (Current state); keeps owning them |
| `tools/content/lib/sheets.mjs`, `tools/content/lib/raster.mjs` | existing | `findRegionsAdaptive`, `cropRegion`, `dds()`, `tga()` |
| `tools/content/modules/ui_inventory.mjs` | new | Reads the installed game's `interface/*.gfx` and `*.gui` (read-only, `HOI4_GAME` in `lib/paths.mjs`), parses sprite blocks and element references, reads image headers (DDS, TGA, PNG, CUR), computes luminance class and alpha kind, writes `vanilla_inventory.json`. Pure function of the input files |
| `tools/content/modules/ui_reskin.mjs` | new | Validates `reskin.json` against the inventory (every sprite has one row; every `R` row has cells and a fit; sizes and frames come only from the inventory), runs the fits on accepted sources, writes the `R` files and their manifest lines |
| `tools/content/modules/ui_overrides.mjs` | new | Builds each `O` file of section 2.3 that `presentation.mjs` does not already write, from its template; checks the installed vanilla file's element names against the template's list and fails on any name the template lacks (catches game patches) |
| `tools/content/modules/ui_cursors.mjs` | new | Cursor cells to `.cur`, `.ani`, `.png`, `.ico` with vanilla hotspots |
| `tools/content/modules/ui_minimap.mjs` | new | Resizes the ZIN colormap to `gfx/minimap/minimap.dds` |
| `tools/content/lib/fit.mjs` | new | `nine_slice`, `exact`, `cover`, `contain`, `repeat_x`, `repeat_y`, `strip`, `same_shape`; takes over `strip()` from `modules/ui.mjs` and `keyMatte`, `boxDownscale` and the strip matte from `modules/presentation.mjs` |
| `tools/content/lib/raster.mjs` | extended | Writers for TGA (top-left and bottom-left origin as the vanilla file), PNG, CUR, ANI; DDS A8R8G8B8 as today |
| `tools/content/art/ui-reskin-jobs.mjs` | new | Writes the image jobs of section 5 (`$ZIN_ART/jobs/ui-reskin-jobs.json`) for `tools/content/imagegen.mjs` |
| `tools/content/ui_reskin.test.mjs` | new | Builder checks below, each with a negative test |

### Builder checks

1. **Inventory freshness.** The game version and vanilla file hashes in `vanilla_inventory.json` match the installed game, or the build stops with the list of changed sprites.
2. **Coverage.** Every inventory sprite has exactly one `reskin.json` row; every `E`, `H` and `U` row has a reason.
3. **Shape.** Every `R` output has the vanilla path and extension, the exact width and height, and a width divisible by the frame count; DDS headers are valid; TGA origin matches the vanilla file.
4. **Reachability.** No `U` sprite is referenced from a reachable window, a loaded script, a localisation text icon or the engine default list (section 7).
5. **No vanilla pixels.** No shipped file's bytes equal the vanilla file at the same path (the check `presentation.test.mjs` already runs); a perceptual hash of every `R` output differs from its vanilla counterpart by more than a set distance (the threshold is tuned on the first accepted sheet and recorded here). A failure means a copy slipped in.
6. **Provenance.** Every `R` file has a manifest line whose source has an accepted review line in `provenance.jsonl` (the rule `acceptance()` in `modules/presentation.mjs` applies today).
7. **Luminance.** Every `R` output's luminance class equals the inventory's class for that sprite.
8. **Overrides.** Only the files of section 2.3 override vanilla `.gui` or `.gfx` names; each keeps every bound element name.
9. **Determinism.** A rebuild produces byte-identical outputs.

### Variables, flags, events, game rules, defines

None. The reskin is art and layout only.

## AI

None.

## Acceptance

1. **Coverage.** `reskin.json` classifies 100% of the sprites in `vanilla_inventory.json`; every `R` row has an accepted output; builder checks 1 to 9 pass, each with a negative test (a planted vanilla file, a wrong size, a missing row, an unreachable sprite marked reachable, a dropped element name).
2. **Inspect.** `hoi4.gui_inspect` with the ZIN workspace reports no missing sprite, texture, font or localisation key for these windows (file in brackets): `topbar` (`topbar.gui`), `countrypoliticsview`, `countrydiplomacyview`, `countrytechnologyview`, `countrytechtreeview`, `countrydoctrineview` (`countrydoctrinetreeview.gui`), `countryproductionlineview`, `countryconstructionsview`, `countrytradeview`, `countrydeploymentview`, `countrylogisticsview`, `countryintelligenceagencyview`, `countrydecisionview` (each in the `.gui` of the same name), `nationalfocusview` (`nationalfocusview.gui`), `naviesview_window` (`naviesview.gui`), `strategicairview`, `theatre_selection_window` (`theatreselector.gui`), `countrystateview`, `landcombatview` (`landcombat.gui`), `navalcombatview` (`navalcombat.gui`), `peaceconference_full_window` (`peaceconferencewindow.gui`), `world_tension_popup` (`worldtensionwindowpopup.gui`), `EventWindow`, `EventWindow_News` (`eventwindow.gui`), `mini_map_interface` (`minimap.gui`), `clock_window` (`ingameclock.gui`), `ingamemenu` (`ingamemenu.gui`), `menu_settings` (`settings.gui`), `musicplayer_window` (`musicplayer.gui`), `load_screen` (`load_screen.gui`), plus the frontend windows of [03_main_menu_and_frontend.md](03_main_menu_and_frontend.md).
3. **Render.** `hoi4.gui_render` of each window above at 1280×720, 1600×900, 1920×1080 and 2560×1440 at UI scale 1, and 1920×1080 at UI scale 1.25, states `normal`, `hover`, `selected`, `disabled`, `long-text`, with a start scenario (`date: "1748.3.1"`, `closedFlags: true`, the viewer Aenor). No layout problem is reported that the same render of vanilla does not also report (the vanilla baseline is rendered once from a workspace without ZIN's `R` files and stored as the comparison).
4. **Review sheet.** For every family, a contact sheet of the renders (labelled "offline render, tool-generated") passes the art review checklist ([01_art_pipeline.md](../08_art_and_assets/01_art_pipeline.md) §6) and section 3.6: no forbidden motif, no lettering, no figure.
5. **No overflow.** In `long-text` renders no text element leaves its plate or window (`containedBy` expectations), including the typewriter-to-Garamond aliases.
6. **Contrast.** For every text element in the renders, the contrast ratio between its text colour and the mean of its background box is at least 4.5:1 (3:1 for text 20 px and larger). Computed by the builder from the render images and the layout reports.
7. **Secrecy.** No interface localisation reachable by a non-Worshipdom viewer before `zin_afrit_revealed` names Afrit or the Hidden Council (compiler secrecy scan covers `zin_interface_l_english.yml` and every replaced vanilla key).
8. **Words.** The word scan of section 8 finds no forbidden word in any player-visible interface text.
9. **Linux run.** In the isolated run (G4) at 1600×900, as Aenor, then the Magical Forest: every top bar button opens its window; captures of the main menu, the top bar, an event, the focus tree, research, production, construction, diplomacy, decisions, the pause menu, the options and a tooltip show no vanilla chrome; the minimap shows Erdae; `error.log` has no texture, sprite or font line caused by ZIN files; no crash. Captures are Linux acceptance evidence, never Windows game screenshots.
10. **Rollback.** Removing all `R` files from a staged copy (a builder flag) gives a working vanilla-skinned ZIN, proving the reskin carries no logic.

## Open questions

Each proceeds on the proposal below; the owner may overrule.

1. Nine-slice resize, seamless repeat, flips, constant alpha scale and the `same_shape` mask count as "slice, resize and convert" (proposed; the same question as gauge compositing, OPEN_QUESTIONS interface 7).
2. No derived override of `interface/core.gfx`: if the additive text colour file is ignored, vanilla text colours stay (owner answer, 19 October 2026: no patched `core.gfx`).
3. The typewriter faces are aliased to Garamond through the additive file; if that fails they stay (proposed).
4. Custom cursors ship; if the Linux run shows `.ani` artefacts, cursors become engine-generic (proposed).
5. The window titles of section 8 are used (proposed).
6. Region or faction accents stay out of shared chrome and appear only in ZIN's own panels (proposed).
