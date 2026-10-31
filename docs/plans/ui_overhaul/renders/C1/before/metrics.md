# UI review metrics

Offline renders, tool-generated (hoi4.gui_render 4.6.1); check 19 text.render_metrics of the design system (§2.2, §9). 42 renders, 42 errors. Thresholds: contrast 4.5:1 under 20 px and 3:1 from 20 px; ground deviation 0.06. Engine-filled keys appear as raw keys in the offline model (audit §1, fidelity limits).

Totals: 0 text elements; contrast 0, ground 0, raw keys 0, overflow 0.

| Render | Window | Theme | Size | Texts | Contrast | Ground | Raw keys | Overflow | Diagnostics | PNG sha256 (first 12) |
| --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- |
| v_EventWindow_1920 | `EventWindow` | chancery | 1920x1080 |  |  |  |  |  | error: Input file is missing: C:\Users\klimp\AppData\Local\Temp\cla | 203ee59d0486 |
| v_EventWindow_News_1920 | `EventWindow_News` | chancery | 1920x1080 |  |  |  |  |  | error: Input file is missing: C:\Users\klimp\AppData\Local\Temp\cla | d0b1bc21d8a1 |
| v_MapmodesInterface_Ingame_1920 | `MapmodesInterface_Ingame` | banner_hall | 1920x1080 |  |  |  |  |  | error: Input file is missing: C:\Users\klimp\AppData\Local\Temp\cla | 7de8bc1df870 |
| v_clock_window_1920 | `clock_window` | banner_hall | 1920x1080 |  |  |  |  |  | error: Input file is missing: C:\Users\klimp\AppData\Local\Temp\cla | d8fe31d6a02a |
| v_countryarmyview_1920 | `countryarmyview` | banner_hall | 1920x1080 |  |  |  |  |  | error: Input file is missing: C:\Users\klimp\AppData\Local\Temp\cla | a1312e113f60 |
| v_countryconstructionsview_1920 | `countryconstructionsview` | banner_hall | 1920x1080 |  |  |  |  |  | error: Input file is missing: C:\Users\klimp\AppData\Local\Temp\cla | 6554ca7a3944 |
| v_countrydecisionview_1920 | `countrydecisionview` | chancery | 1920x1080 |  |  |  |  |  | error: Input file is missing: C:\Users\klimp\AppData\Local\Temp\cla | cc2f3b0bfef9 |
| v_countrydeploymentview_1920 | `countrydeploymentview` | banner_hall | 1920x1080 |  |  |  |  |  | error: Input file is missing: C:\Users\klimp\AppData\Local\Temp\cla | 434cecce1797 |
| v_countrydiplomacyview_1920 | `countrydiplomacyview` | chancery | 1920x1080 |  |  |  |  |  | error: Input file is missing: C:\Users\klimp\AppData\Local\Temp\cla | 74e0552ccb52 |
| v_countrydoctrineview_1920 | `countrydoctrineview` | chronicle | 1920x1080 |  |  |  |  |  | error: Input file is missing: C:\Users\klimp\AppData\Local\Temp\cla | b63591b47405 |
| v_countryintelledger_1920 | `countryintelledger` | chancery | 1920x1080 |  |  |  |  |  | error: Input file is missing: C:\Users\klimp\AppData\Local\Temp\cla | 397d44367a8a |
| v_countryintelligenceagencyview_1920 | `countryintelligenceagencyview` | chancery | 1920x1080 |  |  |  |  |  | error: Input file is missing: C:\Users\klimp\AppData\Local\Temp\cla | b4d35e0c367a |
| v_countrylogisticsview_1920 | `countrylogisticsview` | banner_hall | 1920x1080 |  |  |  |  |  | error: Input file is missing: C:\Users\klimp\AppData\Local\Temp\cla | 0e5b3b1e4cf7 |
| v_countrypoliticsview_1920 | `countrypoliticsview` | chancery | 1920x1080 |  |  |  |  |  | error: Input file is missing: C:\Users\klimp\AppData\Local\Temp\cla | 3fe24802b773 |
| v_countryproductionlineview_1920 | `countryproductionlineview` | banner_hall | 1920x1080 |  |  |  |  |  | error: Input file is missing: C:\Users\klimp\AppData\Local\Temp\cla | 7a0b38acbc01 |
| v_countrystateview_1920 | `countrystateview` | banner_hall | 1920x1080 |  |  |  |  |  | error: Input file is missing: C:\Users\klimp\AppData\Local\Temp\cla | 5b24d59c3b2a |
| v_countrytechnologyview_1920 | `countrytechnologyview` | chronicle | 1920x1080 |  |  |  |  |  | error: Input file is missing: C:\Users\klimp\AppData\Local\Temp\cla | e561cb9a8139 |
| v_countrytechtreeview_1920 | `countrytechtreeview` | chronicle | 1920x1080 |  |  |  |  |  | error: Input file is missing: C:\Users\klimp\AppData\Local\Temp\cla | 7f466a051125 |
| v_countrytradeview_1920 | `countrytradeview` | banner_hall | 1920x1080 |  |  |  |  |  | error: Input file is missing: C:\Users\klimp\AppData\Local\Temp\cla | efe7dfbb3933 |
| v_diplomacy_standard_popup_window_1920 | `diplomacy_standard_popup_window` | neutral | 1920x1080 |  |  |  |  |  | error: Input file is missing: C:\Users\klimp\AppData\Local\Temp\cla | 7b1e2c3af73d |
| v_frontend_background_1920 | `frontend_background` | banner_hall | 1920x1080 |  |  |  |  |  | error: Input file is missing: C:\Users\klimp\AppData\Local\Temp\cla | 0422ca973f80 |
| v_frontendgamesetupview_1920 | `frontendgamesetupview` | banner_hall | 1920x1080 |  |  |  |  |  | error: Input file is missing: C:\Users\klimp\AppData\Local\Temp\cla | 96e8aeca2693 |
| v_game_rule_window_1920 | `game_rule_window` | banner_hall | 1920x1080 |  |  |  |  |  | error: Input file is missing: C:\Users\klimp\AppData\Local\Temp\cla | 9d563d36fe88 |
| v_gamesetup_country_details_1920 | `gamesetup_country_details` | banner_hall | 1920x1080 |  |  |  |  |  | error: Input file is missing: C:\Users\klimp\AppData\Local\Temp\cla | 657e6236f358 |
| v_global_alerticon_window_1920 | `global_alerticon_window` | banner_hall | 1920x1080 |  |  |  |  |  | error: Input file is missing: C:\Users\klimp\AppData\Local\Temp\cla | 8915f6c7e581 |
| v_ingamemenu_1920 | `ingamemenu` | banner_hall | 1920x1080 |  |  |  |  |  | error: Input file is missing: C:\Users\klimp\AppData\Local\Temp\cla | 0d89e3e719f2 |
| v_landcombatview_1920 | `landcombatview` | banner_hall | 1920x1080 |  |  |  |  |  | error: Input file is missing: C:\Users\klimp\AppData\Local\Temp\cla | b6f5733d876d |
| v_load_screen_1920 | `load_screen` | banner_hall | 1920x1080 |  |  |  |  |  | error: Input file is missing: C:\Users\klimp\AppData\Local\Temp\cla | 00c9a9b386be |
| v_mainmenu_panel_bottom_1920 | `mainmenu_panel_bottom` | banner_hall | 1920x1080 |  |  |  |  |  | error: Input file is missing: C:\Users\klimp\AppData\Local\Temp\cla | fb98389fdcf2 |
| v_mainmenu_single_player_1920 | `mainmenu_single_player` | banner_hall | 1920x1080 |  |  |  |  |  | error: Input file is missing: C:\Users\klimp\AppData\Local\Temp\cla | e14d993f25a2 |
| v_menu_settings_1920 | `menu_settings` | neutral | 1920x1080 |  |  |  |  |  | error: Input file is missing: C:\Users\klimp\AppData\Local\Temp\cla | 6354eec4dda0 |
| v_mini_map_interface_1920 | `mini_map_interface` | banner_hall | 1920x1080 |  |  |  |  |  | error: Input file is missing: C:\Users\klimp\AppData\Local\Temp\cla | 20aaf9121a87 |
| v_musicplayer_window_1920 | `musicplayer_window` | banner_hall | 1920x1080 |  |  |  |  |  | error: Input file is missing: C:\Users\klimp\AppData\Local\Temp\cla | 1f0b90fbc07e |
| v_nationalfocusview_1920 | `nationalfocusview` | chronicle | 1920x1080 |  |  |  |  |  | error: Input file is missing: C:\Users\klimp\AppData\Local\Temp\cla | 4f8e7173c82e |
| v_navalcombatview_1920 | `navalcombatview` | banner_hall | 1920x1080 |  |  |  |  |  | error: Input file is missing: C:\Users\klimp\AppData\Local\Temp\cla | 5158a5069ab6 |
| v_naviesview_window_1920 | `naviesview_window` | banner_hall | 1920x1080 |  |  |  |  |  | error: Input file is missing: C:\Users\klimp\AppData\Local\Temp\cla | 1423d7aa129c |
| v_peaceconference_full_window_1920 | `peaceconference_full_window` | chancery | 1920x1080 |  |  |  |  |  | error: Input file is missing: C:\Users\klimp\AppData\Local\Temp\cla | 011cfc63e4fd |
| v_strategicairview_1920 | `strategicairview` | banner_hall | 1920x1080 |  |  |  |  |  | error: Input file is missing: C:\Users\klimp\AppData\Local\Temp\cla | 9ac22db2f28d |
| v_theatre_selection_window_1920 | `theatre_selection_window` | banner_hall | 1920x1080 |  |  |  |  |  | error: Input file is missing: C:\Users\klimp\AppData\Local\Temp\cla | 397d44367a8a |
| v_topbar_1920 | `topbar` | banner_hall | 1920x1080 |  |  |  |  |  | error: Input file is missing: C:\Users\klimp\AppData\Local\Temp\cla | a4be09102117 |
| v_unitleaderwindow_1920 | `unitleaderwindow` | banner_hall | 1920x1080 |  |  |  |  |  | error: Input file is missing: C:\Users\klimp\AppData\Local\Temp\cla | 397d44367a8a |
| v_world_tension_popup_1920 | `world_tension_popup` | chronicle | 1920x1080 |  |  |  |  |  | error: Input file is missing: C:\Users\klimp\AppData\Local\Temp\cla | 1681d539f527 |
