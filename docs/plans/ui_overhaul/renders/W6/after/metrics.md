# UI review metrics

Offline renders, tool-generated (hoi4.gui_render 4.6.1); check 19 text.render_metrics of the design system (§2.2, §9). 51 renders, 2 errors. Thresholds: contrast 4.5:1 under 20 px and 3:1 from 20 px; ground deviation 0.06. Engine-filled keys appear as raw keys in the offline model (audit §1, fidelity limits).

Totals: 304 text elements; contrast 6, ground 9, raw keys 7, overflow 0, under 16 px 66.

| Render | Window | Theme | Size | Texts | Contrast | Ground | Raw keys | Overflow | Under 16 px | Diagnostics | PNG sha256 (first 12) |
| --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| v_frontend_background_1280 | `frontend_background` | banner_hall | 1280x720 | 0 | 0 | 0 | 0 | 0 | 0 | REFERENCE_UNRESOLVED 19 | 56a8936a5c09 |
| v_frontend_background_1920 | `frontend_background` | banner_hall | 1920x1080 | 0 | 0 | 0 | 0 | 0 | 0 | REFERENCE_UNRESOLVED 19 | 0422ca973f80 |
| v_frontend_background_long | `frontend_background` | banner_hall | 1920x1080 | 0 | 0 | 0 | 0 | 0 | 0 | REFERENCE_UNRESOLVED 19 | 0422ca973f80 |
| v_frontendgamesetupview_1280 | `frontendgamesetupview` | banner_hall | 1280x720 | 2 | 0 | 0 | 0 | 0 | 0 | REFERENCE_UNRESOLVED 9, MISSING_LOCALISATION 2, CONFLICTING_CLICK_REGIONS 2 | 3bb1076ddd3c |
| v_frontendgamesetupview_1920 | `frontendgamesetupview` | banner_hall | 1920x1080 | 2 | 0 | 0 | 0 | 0 | 0 | REFERENCE_UNRESOLVED 9, MISSING_LOCALISATION 2, CONFLICTING_CLICK_REGIONS 2 | 97f747aaf850 |
| v_frontendgamesetupview_long | `frontendgamesetupview` | banner_hall | 1920x1080 | 2 | 0 | 0 | 0 | 0 | 0 | REFERENCE_UNRESOLVED 9, MISSING_LOCALISATION 2, CONFLICTING_CLICK_REGIONS 2 | 97f747aaf850 |
| v_game_rule_window_1280 | `game_rule_window` | banner_hall | 1280x720 | 0 | 0 | 0 | 0 | 0 | 0 | REFERENCE_UNRESOLVED 12 | dc52ff803813 |
| v_game_rule_window_1920 | `game_rule_window` | banner_hall | 1920x1080 | 0 | 0 | 0 | 0 | 0 | 0 | REFERENCE_UNRESOLVED 12 | ece077970870 |
| v_game_rule_window_long | `game_rule_window` | banner_hall | 1920x1080 | 0 | 0 | 0 | 0 | 0 | 0 | REFERENCE_UNRESOLVED 12 | ece077970870 |
| v_gamesetup_country_details_1280 | `gamesetup_country_details` | banner_hall | 1280x720 | 5 | 0 | 0 | 0 | 0 | 0 | REFERENCE_UNRESOLVED 17, MISSING_SPRITE 1, SPRITE_MISSING 1 | 3d21e75b84f4 |
| v_gamesetup_country_details_1920 | `gamesetup_country_details` | banner_hall | 1920x1080 | 5 | 0 | 0 | 0 | 0 | 0 | REFERENCE_UNRESOLVED 17, MISSING_SPRITE 1, SPRITE_MISSING 1 | 33eb19d1735a |
| v_gamesetup_country_details_long | `gamesetup_country_details` | banner_hall | 1920x1080 | 5 | 0 | 0 | 0 | 0 | 0 | REFERENCE_UNRESOLVED 17, MISSING_SPRITE 1, SPRITE_MISSING 1 | 33eb19d1735a |
| v_ingamemenu_1280 | `ingamemenu` | banner_hall | 1280x720 | 6 | 0 | 0 | 0 | 0 | 0 | REFERENCE_UNRESOLVED 8 | aaa2e78cfac1 |
| v_ingamemenu_1920 | `ingamemenu` | banner_hall | 1920x1080 | 6 | 0 | 0 | 0 | 0 | 0 | REFERENCE_UNRESOLVED 8 | 3d9f4e7464c2 |
| v_ingamemenu_long | `ingamemenu` | banner_hall | 1920x1080 | 6 | 0 | 0 | 0 | 0 | 0 | REFERENCE_UNRESOLVED 8 | 3d9f4e7464c2 |
| v_load_screen_1280 | `load_screen` | banner_hall | 1280x720 | 0 | 0 | 0 | 0 | 0 | 0 | SPRITE_DECLARED_SIZE_MISMATCH 1, ACCIDENTAL_CLIPPING 2, CHILD_OUTSIDE_CLIPPED_PARENT 1 | 211ab952ec9b |
| v_load_screen_1920 | `load_screen` | banner_hall | 1920x1080 | 0 | 0 | 0 | 0 | 0 | 0 | SPRITE_DECLARED_SIZE_MISMATCH 1, VISIBLE_OVERLAP 1, ACCIDENTAL_CLIPPING 1, CHILD_OUTSIDE_CLIPPED_PARENT 1 | 00c9a9b386be |
| v_load_screen_long | `load_screen` | banner_hall | 1920x1080 | 0 | 0 | 0 | 0 | 0 | 0 | SPRITE_DECLARED_SIZE_MISMATCH 1, VISIBLE_OVERLAP 1, ACCIDENTAL_CLIPPING 2, CHILD_OUTSIDE_CLIPPED_PARENT 1 | 00c9a9b386be |
| v_mainmenu_panel_bottom_1280 | `mainmenu_panel_bottom` | banner_hall | 1280x720 | 7 | 0 | 0 | 1 | 0 | 0 | REFERENCE_UNRESOLVED 3, MISSING_LOCALISATION 2 | 5bb46fda97ab |
| v_mainmenu_panel_bottom_1920 | `mainmenu_panel_bottom` | banner_hall | 1920x1080 | 7 | 0 | 0 | 1 | 0 | 0 | REFERENCE_UNRESOLVED 3, MISSING_LOCALISATION 2 | 1a8a8532a0ec |
| v_mainmenu_panel_bottom_long | `mainmenu_panel_bottom` | banner_hall | 1920x1080 | 7 | 0 | 0 | 1 | 0 | 0 | REFERENCE_UNRESOLVED 3, MISSING_LOCALISATION 2, ACCIDENTAL_CLIPPING 1 | 1a8a8532a0ec |
| v_mainmenu_single_player_1280 | `mainmenu_single_player` | banner_hall | 1280x720 | 4 | 0 | 0 | 0 | 0 | 0 | REFERENCE_UNRESOLVED 3, SPRITE_RENDER_PARTIAL 1, VISIBLE_OVERLAP 1 | 340db9ae20b6 |
| v_mainmenu_single_player_1920 | `mainmenu_single_player` | banner_hall | 1920x1080 | 4 | 0 | 0 | 0 | 0 | 0 | REFERENCE_UNRESOLVED 3, SPRITE_RENDER_PARTIAL 1, VISIBLE_OVERLAP 1 | 40349095b8bc |
| v_mainmenu_single_player_long | `mainmenu_single_player` | banner_hall | 1920x1080 | 4 | 0 | 0 | 0 | 0 | 0 | REFERENCE_UNRESOLVED 3, SPRITE_RENDER_PARTIAL 1, VISIBLE_OVERLAP 2 | 40349095b8bc |
| v_menu_settings_1280 | `menu_settings` | neutral | 1280x720 | 31 | 2 | 3 | 0 | 0 | 22 | CONFLICTING_CLICK_REGIONS 19 | e88d716a89c9 |
| v_menu_settings_1920 | `menu_settings` | neutral | 1920x1080 | 31 | 2 | 3 | 0 | 0 | 22 | CONFLICTING_CLICK_REGIONS 19 | 4ffba924c82d |
| v_menu_settings_long | `menu_settings` | neutral | 1920x1080 | 31 | 2 | 3 | 0 | 0 | 22 | CONFLICTING_CLICK_REGIONS 19 | 4ffba924c82d |
| z_w6_menu_bottom_1280 | `mainmenu_panel_bottom` | banner_hall | 1280x720 | 7 | 0 | 0 | 1 | 0 | 0 | REFERENCE_UNRESOLVED 3, MISSING_LOCALISATION 2 | 5bb46fda97ab |
| z_w6_menu_bottom_1920 | `mainmenu_panel_bottom` | banner_hall | 1920x1080 | 7 | 0 | 0 | 1 | 0 | 0 | REFERENCE_UNRESOLVED 3, MISSING_LOCALISATION 2 | 1a8a8532a0ec |
| z_w6_menu_bottom_2560 | `mainmenu_panel_bottom` | banner_hall | 2560x1440 | 7 | 0 | 0 | 1 | 0 | 0 | REFERENCE_UNRESOLVED 3, MISSING_LOCALISATION 2 | 8d871d892072 |
| z_w6_menu_bottom_long | `mainmenu_panel_bottom` | banner_hall | 1920x1080 | 7 | 0 | 0 | 1 | 0 | 0 | REFERENCE_UNRESOLVED 3, MISSING_LOCALISATION 2, ACCIDENTAL_CLIPPING 1 | 1a8a8532a0ec |
| z_w6_menu_single_1280 | `mainmenu_single_player` | banner_hall | 1280x720 | 4 | 0 | 0 | 0 | 0 | 0 | REFERENCE_UNRESOLVED 3, SPRITE_RENDER_PARTIAL 1, VISIBLE_OVERLAP 1 | 340db9ae20b6 |
| z_w6_menu_single_1920 | `mainmenu_single_player` | banner_hall | 1920x1080 | 4 | 0 | 0 | 0 | 0 | 0 | REFERENCE_UNRESOLVED 3, SPRITE_RENDER_PARTIAL 1, VISIBLE_OVERLAP 1 | 40349095b8bc |
| z_w6_menu_single_2560 | `mainmenu_single_player` | banner_hall | 2560x1440 | 4 | 0 | 0 | 0 | 0 | 0 | REFERENCE_UNRESOLVED 3, SPRITE_RENDER_PARTIAL 1, VISIBLE_OVERLAP 1 | 4055d73901b0 |
| z_w6_menu_single_long | `mainmenu_single_player` | banner_hall | 1920x1080 | 4 | 0 | 0 | 0 | 0 | 0 | REFERENCE_UNRESOLVED 3, SPRITE_RENDER_PARTIAL 1, VISIBLE_OVERLAP 2 | 40349095b8bc |
| z_w6_menu_upperleft_1280 | `mainmenu_panel_upperleft` |  | 1280x720 | 3 | 0 | 0 | 0 | 0 | 0 | REFERENCE_UNRESOLVED 17 | 05e72020bc7e |
| z_w6_menu_upperleft_1920 | `mainmenu_panel_upperleft` |  | 1920x1080 | 3 | 0 | 0 | 0 | 0 | 0 | REFERENCE_UNRESOLVED 17 | 3b581de62dde |
| z_w6_menu_upperleft_2560 | `mainmenu_panel_upperleft` |  | 2560x1440 | 3 | 0 | 0 | 0 | 0 | 0 | REFERENCE_UNRESOLVED 17 | ab0789fe6125 |
| z_w6_menu_upperleft_long | `mainmenu_panel_upperleft` |  | 1920x1080 | 3 | 0 | 0 | 0 | 0 | 0 | REFERENCE_UNRESOLVED 17 | 3b581de62dde |
| z_w6_rules_1280 | `gamesetup_gameplay_settings_window` |  | 1280x720 | 9 | 0 | 0 | 0 | 0 | 0 | REFERENCE_UNRESOLVED 14 | 5a171a9c8893 |
| z_w6_rules_1920 | `gamesetup_gameplay_settings_window` |  | 1920x1080 | 9 | 0 | 0 | 0 | 0 | 0 | REFERENCE_UNRESOLVED 14 | e9f9c4d65aa8 |
| z_w6_rules_2560 | `gamesetup_gameplay_settings_window` |  | 2560x1440 |  |  |  |  |  |  |  |  |
| z_w6_rules_long | `gamesetup_gameplay_settings_window` |  | 1920x1080 | 9 | 0 | 0 | 0 | 0 | 0 | REFERENCE_UNRESOLVED 14 | e9f9c4d65aa8 |
| z_w6_scenario_1280 | `gamesetup_scenario_window` |  | 1280x720 | 4 | 0 | 0 | 0 | 0 | 0 | REFERENCE_UNRESOLVED 12 | a0004b387e01 |
| z_w6_scenario_1920 | `gamesetup_scenario_window` |  | 1920x1080 | 4 | 0 | 0 | 0 | 0 | 0 | REFERENCE_UNRESOLVED 12 | 8bceaa74439c |
| z_w6_scenario_2560 | `gamesetup_scenario_window` |  | 2560x1440 |  |  |  |  |  |  |  |  |
| z_w6_scenario_long | `gamesetup_scenario_window` |  | 1920x1080 | 4 | 0 | 0 | 0 | 0 | 0 | REFERENCE_UNRESOLVED 12 | 8bceaa74439c |
| z_w6_selection_1280 | `gamesetup_interesting_countries_window` |  | 1280x720 | 11 | 0 | 0 | 0 | 0 | 0 | REFERENCE_UNRESOLVED 12 | 5437b67a2e5a |
| z_w6_selection_1920 | `gamesetup_interesting_countries_window` |  | 1920x1080 | 11 | 0 | 0 | 0 | 0 | 0 | REFERENCE_UNRESOLVED 12 | d2af78e78857 |
| z_w6_selection_2560 | `gamesetup_interesting_countries_window` |  | 2560x1440 | 11 | 0 | 0 | 0 | 0 | 0 | REFERENCE_UNRESOLVED 12 | 165de5f773cc |
| z_w6_selection_long | `gamesetup_interesting_countries_window` |  | 1920x1080 | 11 | 0 | 0 | 0 | 0 | 0 | REFERENCE_UNRESOLVED 12 | d2af78e78857 |
