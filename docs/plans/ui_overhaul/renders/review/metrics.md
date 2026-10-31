# UI review metrics

Offline renders, tool-generated (hoi4.gui_render 4.6.1); check 19 text.render_metrics of the design system (§2.2, §9). 196 renders, 0 errors. Thresholds: contrast 4.5:1 under 20 px and 3:1 from 20 px; ground deviation 0.06. Engine-filled keys appear as raw keys in the offline model (audit §1, fidelity limits).

Totals: 1995 text elements; contrast 20, ground 224, raw keys 246, overflow 36.

| Render | Window | Theme | Size | Texts | Contrast | Ground | Raw keys | Overflow | Diagnostics | PNG sha256 (first 12) |
| --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- |
| v_EventWindow_1280 | `EventWindow` | chancery | 1280x720 | 2 | 0 | 0 | 0 | 0 | MISSING_LOCALISATION 2, NEAR_CENTRE_OFFSET 1, VISIBLE_OVERLAP 1 | d12114dbba6b |
| v_EventWindow_1920 | `EventWindow` | chancery | 1920x1080 | 2 | 0 | 0 | 0 | 0 | MISSING_LOCALISATION 2, NEAR_CENTRE_OFFSET 1, VISIBLE_OVERLAP 1 | 203ee59d0486 |
| v_EventWindow_News_1280 | `EventWindow_News` | chancery | 1280x720 | 2 | 0 | 0 | 0 | 0 | MISSING_LOCALISATION 2, ACCIDENTAL_CLIPPING 1, CHILD_OUTSIDE_CLIPPED_PARENT 1 | f3d62bb4749e |
| v_EventWindow_News_1920 | `EventWindow_News` | chancery | 1920x1080 | 2 | 0 | 0 | 0 | 0 | MISSING_LOCALISATION 2, ACCIDENTAL_CLIPPING 1, CHILD_OUTSIDE_CLIPPED_PARENT 1 | d0b1bc21d8a1 |
| v_EventWindow_News_long | `EventWindow_News` | chancery | 1920x1080 | 2 | 0 | 0 | 0 | 0 | MISSING_LOCALISATION 2, ACCIDENTAL_CLIPPING 1, CHILD_OUTSIDE_CLIPPED_PARENT 1, VISIBLE_OVERLAP 1 | d0b1bc21d8a1 |
| v_EventWindow_long | `EventWindow` | chancery | 1920x1080 | 2 | 0 | 0 | 0 | 0 | MISSING_LOCALISATION 2, NEAR_CENTRE_OFFSET 1, VISIBLE_OVERLAP 1, CONTENT_CROSSES_BACKGROUND_EDGE 1 | 203ee59d0486 |
| v_MapmodesInterface_Ingame_1280 | `MapmodesInterface_Ingame` | banner_hall | 1280x720 | 1 | 0 | 0 | 0 | 0 | CONFLICTING_CLICK_REGIONS 18 | ffc5fc2047ec |
| v_MapmodesInterface_Ingame_1920 | `MapmodesInterface_Ingame` | banner_hall | 1920x1080 | 1 | 0 | 0 | 0 | 0 | CONFLICTING_CLICK_REGIONS 18 | 7de8bc1df870 |
| v_MapmodesInterface_Ingame_long | `MapmodesInterface_Ingame` | banner_hall | 1920x1080 | 1 | 0 | 0 | 0 | 0 | CONFLICTING_CLICK_REGIONS 18 | 7de8bc1df870 |
| v_clock_window_1280 | `clock_window` | banner_hall | 1280x720 | 1 | 0 | 1 | 0 | 0 | MISSING_LOCALISATION 1, ACCIDENTAL_CLIPPING 2, CHILD_OUTSIDE_CLIPPED_PARENT 1 | 087e48713988 |
| v_clock_window_1920 | `clock_window` | banner_hall | 1920x1080 | 1 | 0 | 1 | 0 | 0 | MISSING_LOCALISATION 1, ACCIDENTAL_CLIPPING 2, CHILD_OUTSIDE_CLIPPED_PARENT 1 | d8fe31d6a02a |
| v_clock_window_long | `clock_window` | banner_hall | 1920x1080 | 1 | 0 | 1 | 0 | 0 | MISSING_LOCALISATION 1, ACCIDENTAL_CLIPPING 3, CHILD_OUTSIDE_CLIPPED_PARENT 1 | d8fe31d6a02a |
| v_countryarmyview_1280 | `countryarmyview` | banner_hall | 1280x720 | 16 | 0 | 12 | 0 | 0 | CONFLICTING_CLICK_REGIONS 5, MISSING_LOCALISATION 1 | 41023b74627a |
| v_countryarmyview_1920 | `countryarmyview` | banner_hall | 1920x1080 | 16 | 0 | 12 | 0 | 0 | CONFLICTING_CLICK_REGIONS 5, MISSING_LOCALISATION 1 | a1312e113f60 |
| v_countryarmyview_long | `countryarmyview` | banner_hall | 1920x1080 | 16 | 0 | 12 | 0 | 0 | CONFLICTING_CLICK_REGIONS 5, MISSING_LOCALISATION 1 | a1312e113f60 |
| v_countryconstructionsview_1280 | `countryconstructionsview` | banner_hall | 1280x720 | 16 | 0 | 5 | 0 | 0 | CONFLICTING_CLICK_REGIONS 7, MISSING_LOCALISATION 1 | 60ad74df3cb6 |
| v_countryconstructionsview_1920 | `countryconstructionsview` | banner_hall | 1920x1080 | 16 | 0 | 5 | 0 | 0 | CONFLICTING_CLICK_REGIONS 7, MISSING_LOCALISATION 1 | 6554ca7a3944 |
| v_countryconstructionsview_long | `countryconstructionsview` | banner_hall | 1920x1080 | 16 | 0 | 5 | 0 | 0 | CONFLICTING_CLICK_REGIONS 7, MISSING_LOCALISATION 1 | 6554ca7a3944 |
| v_countrydecisionview_1280 | `countrydecisionview` | chancery | 1280x720 | 1 | 0 | 0 | 0 | 0 | ACCIDENTAL_CLIPPING 3, CHILD_OUTSIDE_CLIPPED_PARENT 1 | c29442158b6e |
| v_countrydecisionview_1920 | `countrydecisionview` | chancery | 1920x1080 | 1 | 0 | 0 | 0 | 0 | ACCIDENTAL_CLIPPING 3, CHILD_OUTSIDE_CLIPPED_PARENT 1 | cc2f3b0bfef9 |
| v_countrydecisionview_long | `countrydecisionview` | chancery | 1920x1080 | 1 | 0 | 0 | 0 | 0 | ACCIDENTAL_CLIPPING 3, CHILD_OUTSIDE_CLIPPED_PARENT 2 | cc2f3b0bfef9 |
| v_countrydeploymentview_1280 | `countrydeploymentview` | banner_hall | 1280x720 | 1 | 0 | 0 | 0 | 0 | VISIBLE_OVERLAP 1, ACCIDENTAL_CLIPPING 2, CHILD_OUTSIDE_CLIPPED_PARENT 1 | a208a86c4342 |
| v_countrydeploymentview_1920 | `countrydeploymentview` | banner_hall | 1920x1080 | 1 | 0 | 0 | 0 | 0 | VISIBLE_OVERLAP 1, ACCIDENTAL_CLIPPING 2, CHILD_OUTSIDE_CLIPPED_PARENT 1 | 434cecce1797 |
| v_countrydeploymentview_long | `countrydeploymentview` | banner_hall | 1920x1080 | 1 | 0 | 0 | 0 | 0 | VISIBLE_OVERLAP 1, ACCIDENTAL_CLIPPING 3, CHILD_OUTSIDE_CLIPPED_PARENT 1 | 434cecce1797 |
| v_countrydiplomacyview_1280 | `countrydiplomacyview` | chancery | 1280x720 | 26 | 0 | 1 | 0 | 0 | CONFLICTING_CLICK_REGIONS 7, MISSING_LOCALISATION 9, MISSING_SPRITE 1, SPRITE_MISSING 1 | cbe75de52c86 |
| v_countrydiplomacyview_1920 | `countrydiplomacyview` | chancery | 1920x1080 | 28 | 0 | 1 | 0 | 0 | CONFLICTING_CLICK_REGIONS 3, MISSING_LOCALISATION 13, MISSING_SPRITE 1, SPRITE_MISSING 1 | 74e0552ccb52 |
| v_countrydiplomacyview_long | `countrydiplomacyview` | chancery | 1920x1080 | 28 | 0 | 1 | 0 | 0 | CONFLICTING_CLICK_REGIONS 3, MISSING_LOCALISATION 13, MISSING_SPRITE 1, SPRITE_MISSING 1 | 74e0552ccb52 |
| v_countrydoctrineview_1280 | `countrydoctrineview` | chronicle | 1280x720 | 12 | 4 | 0 | 0 | 0 | CONFLICTING_CLICK_REGIONS 1, VISIBLE_OVERLAP 2, Z_ORDER_RISK 1 | edfd5ede0542 |
| v_countrydoctrineview_1920 | `countrydoctrineview` | chronicle | 1920x1080 | 14 | 5 | 0 | 0 | 0 | CONFLICTING_CLICK_REGIONS 1, VISIBLE_OVERLAP 2, Z_ORDER_RISK 1 | b63591b47405 |
| v_countrydoctrineview_long | `countrydoctrineview` | chronicle | 1920x1080 | 14 | 5 | 0 | 0 | 0 | CONFLICTING_CLICK_REGIONS 1, VISIBLE_OVERLAP 3, Z_ORDER_RISK 1 | b63591b47405 |
| v_countryintelledger_1280 | `countryintelledger` | chancery | 1280x720 | 0 | 0 | 0 | 0 | 0 | PARENT_WINDOW_INVALID 2, REFERENCE_UNRESOLVED 15, UNRESOLVED_REFERENCE 1, WINDOW_MISSING 1 | 8366fbcb5c0a |
| v_countryintelledger_1920 | `countryintelledger` | chancery | 1920x1080 | 0 | 0 | 0 | 0 | 0 | PARENT_WINDOW_INVALID 2, REFERENCE_UNRESOLVED 15, UNRESOLVED_REFERENCE 1, WINDOW_MISSING 1 | 397d44367a8a |
| v_countryintelledger_long | `countryintelledger` | chancery | 1920x1080 | 0 | 0 | 0 | 0 | 0 | PARENT_WINDOW_INVALID 2, REFERENCE_UNRESOLVED 15, UNRESOLVED_REFERENCE 1, WINDOW_MISSING 1 | 397d44367a8a |
| v_countryintelligenceagencyview_1280 | `countryintelligenceagencyview` | chancery | 1280x720 | 15 | 2 | 2 | 0 | 0 | SPRITE_SHEET_DIMENSION_INVALID 1, MISSING_LOCALISATION 7, CONFLICTING_CLICK_REGIONS 2 | 62fa2c2e5156 |
| v_countryintelligenceagencyview_1920 | `countryintelligenceagencyview` | chancery | 1920x1080 | 15 | 2 | 2 | 0 | 0 | SPRITE_SHEET_DIMENSION_INVALID 1, MISSING_LOCALISATION 7, CONFLICTING_CLICK_REGIONS 2 | b4d35e0c367a |
| v_countryintelligenceagencyview_long | `countryintelligenceagencyview` | chancery | 1920x1080 | 15 | 2 | 2 | 0 | 0 | SPRITE_SHEET_DIMENSION_INVALID 1, MISSING_LOCALISATION 7, CONFLICTING_CLICK_REGIONS 2 | b4d35e0c367a |
| v_countrylogisticsview_1280 | `countrylogisticsview` | banner_hall | 1280x720 | 12 | 0 | 0 | 0 | 3 | CONFLICTING_CLICK_REGIONS 1, VISIBLE_OVERLAP 3 | f61f20e49d9f |
| v_countrylogisticsview_1920 | `countrylogisticsview` | banner_hall | 1920x1080 | 12 | 0 | 0 | 0 | 3 | CONFLICTING_CLICK_REGIONS 1, VISIBLE_OVERLAP 3 | 0e5b3b1e4cf7 |
| v_countrylogisticsview_long | `countrylogisticsview` | banner_hall | 1920x1080 | 12 | 0 | 0 | 0 | 3 | CONFLICTING_CLICK_REGIONS 1, VISIBLE_OVERLAP 4 | 0e5b3b1e4cf7 |
| v_countrypoliticsview_1280 | `countrypoliticsview` | chancery | 1280x720 | 12 | 0 | 1 | 1 | 0 | MISSING_SPRITE 1, SPRITE_MISSING 1, MISSING_LOCALISATION 6, CONFLICTING_CLICK_REGIONS 4 | bb058d916c2b |
| v_countrypoliticsview_1920 | `countrypoliticsview` | chancery | 1920x1080 | 12 | 0 | 1 | 1 | 0 | MISSING_SPRITE 1, SPRITE_MISSING 1, MISSING_LOCALISATION 6, CONFLICTING_CLICK_REGIONS 4 | 3fe24802b773 |
| v_countrypoliticsview_long | `countrypoliticsview` | chancery | 1920x1080 | 12 | 0 | 1 | 1 | 0 | MISSING_SPRITE 1, SPRITE_MISSING 1, MISSING_LOCALISATION 6, CONFLICTING_CLICK_REGIONS 4 | 3fe24802b773 |
| v_countryproductionlineview_1280 | `countryproductionlineview` | banner_hall | 1280x720 | 24 | 0 | 4 | 0 | 0 | MISSING_LOCALISATION 3, CONFLICTING_CLICK_REGIONS 1 | dea668fabd39 |
| v_countryproductionlineview_1920 | `countryproductionlineview` | banner_hall | 1920x1080 | 24 | 0 | 4 | 0 | 0 | MISSING_LOCALISATION 3, CONFLICTING_CLICK_REGIONS 1 | 7a0b38acbc01 |
| v_countryproductionlineview_long | `countryproductionlineview` | banner_hall | 1920x1080 | 24 | 0 | 4 | 0 | 0 | MISSING_LOCALISATION 3, CONFLICTING_CLICK_REGIONS 1, VISIBLE_OVERLAP 1 | 7a0b38acbc01 |
| v_countrystateview_1280 | `countrystateview` | banner_hall | 1280x720 | 4 | 0 | 0 | 2 | 0 | MISSING_LOCALISATION 2, ACCIDENTAL_CLIPPING 2 | eff5c216ae5d |
| v_countrystateview_1920 | `countrystateview` | banner_hall | 1920x1080 | 4 | 0 | 0 | 2 | 0 | MISSING_LOCALISATION 2, ACCIDENTAL_CLIPPING 2 | 5b24d59c3b2a |
| v_countrystateview_long | `countrystateview` | banner_hall | 1920x1080 | 4 | 0 | 0 | 2 | 0 | MISSING_LOCALISATION 2, ACCIDENTAL_CLIPPING 3 | 5b24d59c3b2a |
| v_countrytechnologyview_1280 | `countrytechnologyview` | chronicle | 1280x720 | 7 | 0 | 3 | 0 | 0 | CONFLICTING_CLICK_REGIONS 1, ACCIDENTAL_CLIPPING 2, CHILD_OUTSIDE_CLIPPED_PARENT 1 | 9856eed13865 |
| v_countrytechnologyview_1920 | `countrytechnologyview` | chronicle | 1920x1080 | 7 | 0 | 3 | 0 | 0 | CONFLICTING_CLICK_REGIONS 1, ACCIDENTAL_CLIPPING 2, CHILD_OUTSIDE_CLIPPED_PARENT 1 | e561cb9a8139 |
| v_countrytechnologyview_long | `countrytechnologyview` | chronicle | 1920x1080 | 7 | 0 | 3 | 0 | 0 | CONFLICTING_CLICK_REGIONS 1, ACCIDENTAL_CLIPPING 3, CHILD_OUTSIDE_CLIPPED_PARENT 1 | e561cb9a8139 |
| v_countrytechtreeview_1280 | `countrytechtreeview` | chronicle | 1280x720 | 52 | 0 | 0 | 0 | 0 | CONFLICTING_CLICK_REGIONS 18 | 9db5a96ad57d |
| v_countrytechtreeview_1920 | `countrytechtreeview` | chronicle | 1920x1080 | 78 | 0 | 8 | 0 | 0 | CONFLICTING_CLICK_REGIONS 18 | 7f466a051125 |
| v_countrytechtreeview_long | `countrytechtreeview` | chronicle | 1920x1080 | 78 | 0 | 8 | 0 | 0 | CONFLICTING_CLICK_REGIONS 18 | 7f466a051125 |
| v_countrytradeview_1280 | `countrytradeview` | banner_hall | 1280x720 | 12 | 0 | 4 | 0 | 0 | VISIBLE_OVERLAP 1, ACCIDENTAL_CLIPPING 2, CHILD_OUTSIDE_CLIPPED_PARENT 1 | bb43c67eb254 |
| v_countrytradeview_1920 | `countrytradeview` | banner_hall | 1920x1080 | 12 | 0 | 4 | 0 | 0 | VISIBLE_OVERLAP 1, ACCIDENTAL_CLIPPING 2, CHILD_OUTSIDE_CLIPPED_PARENT 1 | efe7dfbb3933 |
| v_countrytradeview_long | `countrytradeview` | banner_hall | 1920x1080 | 12 | 0 | 4 | 0 | 0 | VISIBLE_OVERLAP 1, ACCIDENTAL_CLIPPING 3, CHILD_OUTSIDE_CLIPPED_PARENT 1 | efe7dfbb3933 |
| v_diplomacy_standard_popup_window_1280 | `diplomacy_standard_popup_window` | neutral | 1280x720 | 4 | 0 | 0 | 0 | 0 | MISSING_LOCALISATION 2, VISIBLE_OVERLAP 1, SPRITE_RENDER_PARTIAL 1 | bf59c21c6e01 |
| v_diplomacy_standard_popup_window_1920 | `diplomacy_standard_popup_window` | neutral | 1920x1080 | 4 | 0 | 0 | 0 | 0 | MISSING_LOCALISATION 2, VISIBLE_OVERLAP 1, SPRITE_RENDER_PARTIAL 1 | 7b1e2c3af73d |
| v_diplomacy_standard_popup_window_long | `diplomacy_standard_popup_window` | neutral | 1920x1080 | 4 | 0 | 0 | 0 | 0 | MISSING_LOCALISATION 2, VISIBLE_OVERLAP 2, SPRITE_RENDER_PARTIAL 1 | 7b1e2c3af73d |
| v_frontend_background_1280 | `frontend_background` | banner_hall | 1280x720 | 0 | 0 | 0 | 0 | 0 | ACCIDENTAL_CLIPPING 2, CHILD_OUTSIDE_CLIPPED_PARENT 1 | 56a8936a5c09 |
| v_frontend_background_1920 | `frontend_background` | banner_hall | 1920x1080 | 0 | 0 | 0 | 0 | 0 | ACCIDENTAL_CLIPPING 2, CHILD_OUTSIDE_CLIPPED_PARENT 1 | 0422ca973f80 |
| v_frontend_background_long | `frontend_background` | banner_hall | 1920x1080 | 0 | 0 | 0 | 0 | 0 | ACCIDENTAL_CLIPPING 2, CHILD_OUTSIDE_CLIPPED_PARENT 1 | 0422ca973f80 |
| v_frontendgamesetupview_1280 | `frontendgamesetupview` | banner_hall | 1280x720 | 2 | 0 | 0 | 0 | 0 | MISSING_LOCALISATION 2, CONFLICTING_CLICK_REGIONS 2 | 2f7c84aac984 |
| v_frontendgamesetupview_1920 | `frontendgamesetupview` | banner_hall | 1920x1080 | 2 | 0 | 0 | 0 | 0 | MISSING_LOCALISATION 2, CONFLICTING_CLICK_REGIONS 2 | 96e8aeca2693 |
| v_frontendgamesetupview_long | `frontendgamesetupview` | banner_hall | 1920x1080 | 2 | 0 | 0 | 0 | 0 | MISSING_LOCALISATION 2, CONFLICTING_CLICK_REGIONS 2, ACCIDENTAL_CLIPPING 1 | 96e8aeca2693 |
| v_game_rule_window_1280 | `game_rule_window` | banner_hall | 1280x720 | 0 | 0 | 0 | 0 | 0 | ACCIDENTAL_CLIPPING 4 | 9f027b7451b8 |
| v_game_rule_window_1920 | `game_rule_window` | banner_hall | 1920x1080 | 0 | 0 | 0 | 0 | 0 | ACCIDENTAL_CLIPPING 4 | 9d563d36fe88 |
| v_game_rule_window_long | `game_rule_window` | banner_hall | 1920x1080 | 0 | 0 | 0 | 0 | 0 | ACCIDENTAL_CLIPPING 5 | 9d563d36fe88 |
| v_gamesetup_country_details_1280 | `gamesetup_country_details` | banner_hall | 1280x720 | 5 | 0 | 0 | 0 | 0 | MISSING_SPRITE 1, SPRITE_MISSING 1, ACCIDENTAL_CLIPPING 2 | c375ecaf9c2d |
| v_gamesetup_country_details_1920 | `gamesetup_country_details` | banner_hall | 1920x1080 | 5 | 0 | 0 | 0 | 0 | MISSING_SPRITE 1, SPRITE_MISSING 1, ACCIDENTAL_CLIPPING 2 | 657e6236f358 |
| v_gamesetup_country_details_long | `gamesetup_country_details` | banner_hall | 1920x1080 | 5 | 0 | 0 | 0 | 0 | MISSING_SPRITE 1, SPRITE_MISSING 1, ACCIDENTAL_CLIPPING 2, CHILD_OUTSIDE_CLIPPED_PARENT 1 | 657e6236f358 |
| v_global_alerticon_window_1280 | `global_alerticon_window` | banner_hall | 1280x720 | 0 | 0 | 0 | 0 | 0 | ANIMATION_STATIC_FALLBACK_MISSING 2, SPRITE_RENDER_PARTIAL 2, VISIBLE_OVERLAP 1 | 57e1b9931429 |
| v_global_alerticon_window_1920 | `global_alerticon_window` | banner_hall | 1920x1080 | 0 | 0 | 0 | 0 | 0 | ANIMATION_STATIC_FALLBACK_MISSING 2, SPRITE_RENDER_PARTIAL 2, VISIBLE_OVERLAP 1 | 8915f6c7e581 |
| v_global_alerticon_window_long | `global_alerticon_window` | banner_hall | 1920x1080 | 0 | 0 | 0 | 0 | 0 | ANIMATION_STATIC_FALLBACK_MISSING 2, SPRITE_RENDER_PARTIAL 2, VISIBLE_OVERLAP 2 | 8915f6c7e581 |
| v_ingamemenu_1280 | `ingamemenu` | banner_hall | 1280x720 | 8 | 0 | 0 | 0 | 0 | CONFLICTING_CLICK_REGIONS 15 | 2fbbd2ea4f78 |
| v_ingamemenu_1920 | `ingamemenu` | banner_hall | 1920x1080 | 8 | 0 | 0 | 0 | 0 | CONFLICTING_CLICK_REGIONS 15 | 0d89e3e719f2 |
| v_ingamemenu_long | `ingamemenu` | banner_hall | 1920x1080 | 8 | 0 | 0 | 0 | 0 | CONFLICTING_CLICK_REGIONS 15 | 0d89e3e719f2 |
| v_landcombatview_1280 | `landcombatview` | banner_hall | 1280x720 | 10 | 0 | 3 | 0 | 0 | MISSING_LOCALISATION 8 | 72ccf4070a91 |
| v_landcombatview_1920 | `landcombatview` | banner_hall | 1920x1080 | 10 | 0 | 3 | 0 | 0 | MISSING_LOCALISATION 8 | b6f5733d876d |
| v_landcombatview_long | `landcombatview` | banner_hall | 1920x1080 | 10 | 0 | 3 | 0 | 0 | MISSING_LOCALISATION 8 | b6f5733d876d |
| v_load_screen_1280 | `load_screen` | banner_hall | 1280x720 | 0 | 0 | 0 | 0 | 0 | SPRITE_DECLARED_SIZE_MISMATCH 1, ACCIDENTAL_CLIPPING 2, CHILD_OUTSIDE_CLIPPED_PARENT 1 | 211ab952ec9b |
| v_load_screen_1920 | `load_screen` | banner_hall | 1920x1080 | 0 | 0 | 0 | 0 | 0 | SPRITE_DECLARED_SIZE_MISMATCH 1, VISIBLE_OVERLAP 1, ACCIDENTAL_CLIPPING 1, CHILD_OUTSIDE_CLIPPED_PARENT 1 | 00c9a9b386be |
| v_load_screen_long | `load_screen` | banner_hall | 1920x1080 | 0 | 0 | 0 | 0 | 0 | SPRITE_DECLARED_SIZE_MISMATCH 1, VISIBLE_OVERLAP 1, ACCIDENTAL_CLIPPING 2, CHILD_OUTSIDE_CLIPPED_PARENT 1 | 00c9a9b386be |
| v_mainmenu_panel_bottom_1280 | `mainmenu_panel_bottom` | banner_hall | 1280x720 | 11 | 0 | 0 | 1 | 0 | MISSING_LOCALISATION 2, CONFLICTING_CLICK_REGIONS 1, ANIMATION_STATIC_FALLBACK_MISSING 1 | c4cfa0ab0958 |
| v_mainmenu_panel_bottom_1920 | `mainmenu_panel_bottom` | banner_hall | 1920x1080 | 11 | 0 | 0 | 1 | 0 | MISSING_LOCALISATION 2, CONFLICTING_CLICK_REGIONS 1, ANIMATION_STATIC_FALLBACK_MISSING 1 | fb98389fdcf2 |
| v_mainmenu_panel_bottom_long | `mainmenu_panel_bottom` | banner_hall | 1920x1080 | 11 | 0 | 0 | 1 | 0 | MISSING_LOCALISATION 2, CONFLICTING_CLICK_REGIONS 1, ANIMATION_STATIC_FALLBACK_MISSING 1, ACCIDENTAL_CLIPPING 1 | fb98389fdcf2 |
| v_mainmenu_single_player_1280 | `mainmenu_single_player` | banner_hall | 1280x720 | 5 | 0 | 0 | 0 | 0 | SPRITE_RENDER_PARTIAL 1, VISIBLE_OVERLAP 4 | 8560ef76392d |
| v_mainmenu_single_player_1920 | `mainmenu_single_player` | banner_hall | 1920x1080 | 5 | 0 | 0 | 0 | 0 | SPRITE_RENDER_PARTIAL 1, VISIBLE_OVERLAP 4 | e14d993f25a2 |
| v_mainmenu_single_player_long | `mainmenu_single_player` | banner_hall | 1920x1080 | 5 | 0 | 0 | 0 | 0 | SPRITE_RENDER_PARTIAL 1, VISIBLE_OVERLAP 5 | e14d993f25a2 |
| v_menu_settings_1280 | `menu_settings` | neutral | 1280x720 | 31 | 0 | 3 | 0 | 0 | CONFLICTING_CLICK_REGIONS 18 | d2ba313cd2dc |
| v_menu_settings_1920 | `menu_settings` | neutral | 1920x1080 | 31 | 0 | 3 | 0 | 0 | CONFLICTING_CLICK_REGIONS 18 | 6354eec4dda0 |
| v_menu_settings_long | `menu_settings` | neutral | 1920x1080 | 31 | 0 | 3 | 0 | 0 | CONFLICTING_CLICK_REGIONS 18 | 6354eec4dda0 |
| v_mini_map_interface_1280 | `mini_map_interface` | banner_hall | 1280x720 | 0 | 0 | 0 | 0 | 0 | CONFLICTING_CLICK_REGIONS 1, ACCIDENTAL_CLIPPING 2, INVALID_SIZE 1 | 310421759d86 |
| v_mini_map_interface_1920 | `mini_map_interface` | banner_hall | 1920x1080 | 0 | 0 | 0 | 0 | 0 | CONFLICTING_CLICK_REGIONS 1, ACCIDENTAL_CLIPPING 2, INVALID_SIZE 1 | 20aaf9121a87 |
| v_mini_map_interface_long | `mini_map_interface` | banner_hall | 1920x1080 | 0 | 0 | 0 | 0 | 0 | CONFLICTING_CLICK_REGIONS 1, ACCIDENTAL_CLIPPING 2, INVALID_SIZE 2 | 20aaf9121a87 |
| v_musicplayer_window_1280 | `musicplayer_window` | banner_hall | 1280x720 | 1 | 0 | 1 | 0 | 0 | VISIBLE_OVERLAP 1, ACCIDENTAL_CLIPPING 2, CHILD_OUTSIDE_CLIPPED_PARENT 1 | bcd9b9fb5167 |
| v_musicplayer_window_1920 | `musicplayer_window` | banner_hall | 1920x1080 | 1 | 0 | 1 | 0 | 0 | VISIBLE_OVERLAP 1, ACCIDENTAL_CLIPPING 2, CHILD_OUTSIDE_CLIPPED_PARENT 1 | 1f0b90fbc07e |
| v_musicplayer_window_long | `musicplayer_window` | banner_hall | 1920x1080 | 1 | 0 | 1 | 0 | 0 | VISIBLE_OVERLAP 1, ACCIDENTAL_CLIPPING 2, CHILD_OUTSIDE_CLIPPED_PARENT 2 | 1f0b90fbc07e |
| v_nationalfocusview_1280 | `nationalfocusview` | chronicle | 1280x720 | 4 | 0 | 1 | 1 | 0 | MISSING_LOCALISATION 2, CONFLICTING_CLICK_REGIONS 2 | 878ffe6df7d9 |
| v_nationalfocusview_1920 | `nationalfocusview` | chronicle | 1920x1080 | 5 | 0 | 1 | 1 | 0 | MISSING_LOCALISATION 2, CONFLICTING_CLICK_REGIONS 2 | 4f8e7173c82e |
| v_nationalfocusview_long | `nationalfocusview` | chronicle | 1920x1080 | 5 | 0 | 1 | 1 | 0 | MISSING_LOCALISATION 2, CONFLICTING_CLICK_REGIONS 2, ACCIDENTAL_CLIPPING 1 | 4f8e7173c82e |
| v_navalcombatview_1280 | `navalcombatview` | banner_hall | 1280x720 | 23 | 0 | 4 | 0 | 0 | MISSING_LOCALISATION 7 | d6caa7296872 |
| v_navalcombatview_1920 | `navalcombatview` | banner_hall | 1920x1080 | 23 | 0 | 4 | 0 | 0 | MISSING_LOCALISATION 7 | 5158a5069ab6 |
| v_navalcombatview_long | `navalcombatview` | banner_hall | 1920x1080 | 23 | 0 | 4 | 0 | 0 | MISSING_LOCALISATION 7 | 5158a5069ab6 |
| v_naviesview_window_1280 | `naviesview_window` | banner_hall | 1280x720 | 0 | 0 | 0 | 0 | 0 | CONFLICTING_CLICK_REGIONS 13 | 47c1865510be |
| v_naviesview_window_1920 | `naviesview_window` | banner_hall | 1920x1080 | 0 | 0 | 0 | 0 | 0 | CONFLICTING_CLICK_REGIONS 13 | 1423d7aa129c |
| v_naviesview_window_long | `naviesview_window` | banner_hall | 1920x1080 | 0 | 0 | 0 | 0 | 0 | CONFLICTING_CLICK_REGIONS 13 | 1423d7aa129c |
| v_peaceconference_full_window_1280 | `peaceconference_full_window` | chancery | 1280x720 | 9 | 0 | 2 | 5 | 2 | MISSING_LOCALISATION 4 | f717ae1e72ec |
| v_peaceconference_full_window_1920 | `peaceconference_full_window` | chancery | 1920x1080 | 9 | 0 | 2 | 5 | 2 | MISSING_LOCALISATION 4 | 011cfc63e4fd |
| v_peaceconference_full_window_long | `peaceconference_full_window` | chancery | 1920x1080 | 9 | 0 | 2 | 5 | 2 | MISSING_LOCALISATION 4, ACCIDENTAL_CLIPPING 1 | 011cfc63e4fd |
| v_strategicairview_1280 | `strategicairview` | banner_hall | 1280x720 | 40 | 0 | 2 | 0 | 0 | MISSING_LOCALISATION 2, MISSING_SPRITE 1, SPRITE_MISSING 1, CONFLICTING_CLICK_REGIONS 14 | a326a0fc0b2b |
| v_strategicairview_1920 | `strategicairview` | banner_hall | 1920x1080 | 44 | 0 | 2 | 0 | 0 | MISSING_LOCALISATION 2, MISSING_SPRITE 1, SPRITE_MISSING 1, CONFLICTING_CLICK_REGIONS 14 | 9ac22db2f28d |
| v_strategicairview_long | `strategicairview` | banner_hall | 1920x1080 | 44 | 0 | 2 | 0 | 0 | MISSING_LOCALISATION 2, MISSING_SPRITE 1, SPRITE_MISSING 1, CONFLICTING_CLICK_REGIONS 14 | 9ac22db2f28d |
| v_theatre_selection_window_1280 | `theatre_selection_window` | banner_hall | 1280x720 | 0 | 0 | 0 | 0 | 0 | ACCIDENTAL_CLIPPING 1, CHILD_OUTSIDE_CLIPPED_PARENT 1 | 8366fbcb5c0a |
| v_theatre_selection_window_1920 | `theatre_selection_window` | banner_hall | 1920x1080 | 0 | 0 | 0 | 0 | 0 | ACCIDENTAL_CLIPPING 1, CHILD_OUTSIDE_CLIPPED_PARENT 1 | 397d44367a8a |
| v_theatre_selection_window_long | `theatre_selection_window` | banner_hall | 1920x1080 | 0 | 0 | 0 | 0 | 0 | ACCIDENTAL_CLIPPING 1, CHILD_OUTSIDE_CLIPPED_PARENT 1 | 397d44367a8a |
| v_topbar_1280 | `topbar` | banner_hall | 1280x720 | 23 | 0 | 12 | 0 | 7 | CONFLICTING_CLICK_REGIONS 12, MISSING_LOCALISATION 6 | 20ce0e7999ac |
| v_topbar_1920 | `topbar` | banner_hall | 1920x1080 | 23 | 0 | 12 | 0 | 7 | CONFLICTING_CLICK_REGIONS 12, MISSING_LOCALISATION 6 | a4be09102117 |
| v_topbar_long | `topbar` | banner_hall | 1920x1080 | 23 | 0 | 12 | 0 | 7 | CONFLICTING_CLICK_REGIONS 12, MISSING_LOCALISATION 6 | a4be09102117 |
| v_unitleaderwindow_1280 | `unitleaderwindow` | banner_hall | 1280x720 | 0 | 0 | 0 | 0 | 0 | PARENT_WINDOW_INVALID 2, REFERENCE_UNRESOLVED 15, UNRESOLVED_REFERENCE 1, WINDOW_MISSING 1 | 8366fbcb5c0a |
| v_unitleaderwindow_1920 | `unitleaderwindow` | banner_hall | 1920x1080 | 0 | 0 | 0 | 0 | 0 | PARENT_WINDOW_INVALID 2, REFERENCE_UNRESOLVED 15, UNRESOLVED_REFERENCE 1, WINDOW_MISSING 1 | 397d44367a8a |
| v_unitleaderwindow_long | `unitleaderwindow` | banner_hall | 1920x1080 | 0 | 0 | 0 | 0 | 0 | PARENT_WINDOW_INVALID 2, REFERENCE_UNRESOLVED 15, UNRESOLVED_REFERENCE 1, WINDOW_MISSING 1 | 397d44367a8a |
| v_world_tension_popup_1280 | `world_tension_popup` | chronicle | 1280x720 | 7 | 0 | 0 | 0 | 0 | NEAR_CENTRE_OFFSET 2, ACCIDENTAL_CLIPPING 1, CHILD_OUTSIDE_CLIPPED_PARENT 1 | 8a8d5fd7b790 |
| v_world_tension_popup_1920 | `world_tension_popup` | chronicle | 1920x1080 | 7 | 0 | 0 | 0 | 0 | NEAR_CENTRE_OFFSET 2, ACCIDENTAL_CLIPPING 1, CHILD_OUTSIDE_CLIPPED_PARENT 1 | 1681d539f527 |
| v_world_tension_popup_long | `world_tension_popup` | chronicle | 1920x1080 | 7 | 0 | 0 | 0 | 0 | NEAR_CENTRE_OFFSET 2, ACCIDENTAL_CLIPPING 2, CHILD_OUTSIDE_CLIPPED_PARENT 1 | 1681d539f527 |
| z_accord_1280 | `zin_accord_window` | chancery | 1280x720 | 5 | 0 | 0 | 3 | 0 | BUTTON_TRIGGER_MISSING 1, UNRESOLVED_DYNAMIC_VALUE 3, INCONSISTENT_SPACING 1 | 7e968e025e67 |
| z_accord_1920 | `zin_accord_window` | chancery | 1920x1080 | 5 | 0 | 0 | 3 | 0 | BUTTON_TRIGGER_MISSING 1, UNRESOLVED_DYNAMIC_VALUE 3, INCONSISTENT_SPACING 1 | db4cc5bc9273 |
| z_accord_long | `zin_accord_window` | chancery | 1920x1080 | 5 | 0 | 0 | 3 | 0 | BUTTON_TRIGGER_MISSING 1, UNRESOLVED_DYNAMIC_VALUE 3, INCONSISTENT_SPACING 1 | db4cc5bc9273 |
| z_council1_1280 | `zin_council_window` | chancery | 1280x720 | 8 | 0 | 0 | 2 | 0 | BUTTON_TRIGGER_MISSING 3, ACCIDENTAL_CLIPPING 1, INVALID_SIZE 1 | b6c06184e769 |
| z_council1_1920 | `zin_council_window` | chancery | 1920x1080 | 8 | 0 | 0 | 2 | 0 | BUTTON_TRIGGER_MISSING 3, ACCIDENTAL_CLIPPING 1, INVALID_SIZE 1 | 7d7505603389 |
| z_council1_2560 | `zin_council_window` | chancery | 2560x1440 | 8 | 0 | 0 | 2 | 0 | BUTTON_TRIGGER_MISSING 3, ACCIDENTAL_CLIPPING 1, INVALID_SIZE 1 | b58f1586cb68 |
| z_council1_long | `zin_council_window` | chancery | 1920x1080 | 8 | 0 | 0 | 2 | 0 | BUTTON_TRIGGER_MISSING 4, ACCIDENTAL_CLIPPING 1, INVALID_SIZE 1 | 7d7505603389 |
| z_council2_1920 | `zin_council_window` | chancery | 1920x1080 | 9 | 0 | 0 | 4 | 0 | BUTTON_TRIGGER_MISSING 3, ACCIDENTAL_CLIPPING 1, INVALID_SIZE 1 | f5b154fa1190 |
| z_council3_1920 | `zin_council_window` | chancery | 1920x1080 | 10 | 0 | 0 | 5 | 0 | BUTTON_TRIGGER_MISSING 3, ACCIDENTAL_CLIPPING 1, INVALID_SIZE 1 | 994a36ebed3e |
| z_court1_1280 | `zin_court_window` | chancery | 1280x720 | 11 | 0 | 0 | 5 | 0 | BUTTON_TRIGGER_MISSING 3, ACCIDENTAL_CLIPPING 1, INVALID_SIZE 1 | be4df1e64597 |
| z_court1_1920 | `zin_court_window` | chancery | 1920x1080 | 11 | 0 | 0 | 5 | 0 | BUTTON_TRIGGER_MISSING 3, ACCIDENTAL_CLIPPING 1, INVALID_SIZE 1 | 54a8b020f6eb |
| z_court1_2560 | `zin_court_window` | chancery | 2560x1440 | 11 | 0 | 0 | 5 | 0 | BUTTON_TRIGGER_MISSING 3, ACCIDENTAL_CLIPPING 1, INVALID_SIZE 1 | 3fc76b435988 |
| z_court1_long | `zin_court_window` | chancery | 1920x1080 | 11 | 0 | 0 | 5 | 0 | BUTTON_TRIGGER_MISSING 3, ACCIDENTAL_CLIPPING 2, INVALID_SIZE 1 | 54a8b020f6eb |
| z_court2_1280 | `zin_court_window` | chancery | 1280x720 | 7 | 0 | 0 | 1 | 0 | BUTTON_TRIGGER_MISSING 3, ACCIDENTAL_CLIPPING 1, INVALID_SIZE 1 | 79798f80aebf |
| z_court2_1920 | `zin_court_window` | chancery | 1920x1080 | 7 | 0 | 0 | 1 | 0 | BUTTON_TRIGGER_MISSING 3, ACCIDENTAL_CLIPPING 1, INVALID_SIZE 1 | 169562cc1300 |
| z_court2_2560 | `zin_court_window` | chancery | 2560x1440 | 7 | 0 | 0 | 1 | 0 | BUTTON_TRIGGER_MISSING 3, ACCIDENTAL_CLIPPING 1, INVALID_SIZE 1 | c350aed8eca1 |
| z_court2_long | `zin_court_window` | chancery | 1920x1080 | 7 | 0 | 0 | 1 | 0 | BUTTON_TRIGGER_MISSING 3, ACCIDENTAL_CLIPPING 2, INVALID_SIZE 1 | 169562cc1300 |
| z_court3_1280 | `zin_court_window` | chancery | 1280x720 | 11 | 0 | 0 | 5 | 0 | BUTTON_TRIGGER_MISSING 3, ACCIDENTAL_CLIPPING 1, INVALID_SIZE 1 | 2fe639617dcb |
| z_court3_1920 | `zin_court_window` | chancery | 1920x1080 | 11 | 0 | 0 | 5 | 0 | BUTTON_TRIGGER_MISSING 3, ACCIDENTAL_CLIPPING 1, INVALID_SIZE 1 | 897a77bbdc53 |
| z_court3_2560 | `zin_court_window` | chancery | 2560x1440 | 11 | 0 | 0 | 5 | 0 | BUTTON_TRIGGER_MISSING 3, ACCIDENTAL_CLIPPING 1, INVALID_SIZE 1 | ddb39960cc5d |
| z_court3_long | `zin_court_window` | chancery | 1920x1080 | 11 | 0 | 0 | 5 | 0 | BUTTON_TRIGGER_MISSING 3, ACCIDENTAL_CLIPPING 2, INVALID_SIZE 1 | 897a77bbdc53 |
| z_court4_1280 | `zin_court_window` | chancery | 1280x720 | 11 | 0 | 0 | 5 | 0 | BUTTON_TRIGGER_MISSING 3, ACCIDENTAL_CLIPPING 1, INVALID_SIZE 1 | 1186208fe93c |
| z_court4_1920 | `zin_court_window` | chancery | 1920x1080 | 11 | 0 | 0 | 5 | 0 | BUTTON_TRIGGER_MISSING 3, ACCIDENTAL_CLIPPING 1, INVALID_SIZE 1 | dfe00425a540 |
| z_court4_2560 | `zin_court_window` | chancery | 2560x1440 | 11 | 0 | 0 | 5 | 0 | BUTTON_TRIGGER_MISSING 3, ACCIDENTAL_CLIPPING 1, INVALID_SIZE 1 | e04df1ff91a5 |
| z_court4_long | `zin_court_window` | chancery | 1920x1080 | 11 | 0 | 0 | 5 | 0 | BUTTON_TRIGGER_MISSING 3, ACCIDENTAL_CLIPPING 2, INVALID_SIZE 1 | dfe00425a540 |
| z_court_btn_1280 | `zin_court_button_window` | chancery | 1280x720 | 1 | 0 | 0 | 0 | 0 | REFERENCE_UNRESOLVED 7 | 305d15e66f38 |
| z_court_btn_1920 | `zin_court_button_window` | chancery | 1920x1080 | 1 | 0 | 0 | 0 | 0 | REFERENCE_UNRESOLVED 7 | 9be237b94d79 |
| z_court_btn_2560 | `zin_court_button_window` | chancery | 2560x1440 | 1 | 0 | 0 | 0 | 0 | REFERENCE_UNRESOLVED 7 | 65881b939602 |
| z_court_btn_long | `zin_court_button_window` | chancery | 1920x1080 | 1 | 0 | 0 | 0 | 0 | REFERENCE_UNRESOLVED 7 | 9be237b94d79 |
| z_dominion1_1280 | `zin_dominion_window` | chancery | 1280x720 | 11 | 0 | 2 | 4 | 0 | BUTTON_TRIGGER_MISSING 3, ACCIDENTAL_CLIPPING 1, INVALID_SIZE 1 | 16089b7afb7c |
| z_dominion1_1920 | `zin_dominion_window` | chancery | 1920x1080 | 11 | 0 | 2 | 4 | 0 | BUTTON_TRIGGER_MISSING 3, ACCIDENTAL_CLIPPING 1, INVALID_SIZE 1 | 8952c8675791 |
| z_dominion1_long | `zin_dominion_window` | chancery | 1920x1080 | 11 | 0 | 2 | 4 | 0 | BUTTON_TRIGGER_MISSING 3, ACCIDENTAL_CLIPPING 1, INVALID_SIZE 1, UNRESOLVED_DYNAMIC_VALUE 1 | 8952c8675791 |
| z_dominion2_1920 | `zin_dominion_window` | chancery | 1920x1080 | 12 | 0 | 0 | 6 | 0 | BUTTON_TRIGGER_MISSING 3, ACCIDENTAL_CLIPPING 1, INVALID_SIZE 1 | 610666a77134 |
| z_horde_1280 | `zin_horde_window` | chancery | 1280x720 | 14 | 0 | 0 | 7 | 0 | BUTTON_TRIGGER_MISSING 1, UNRESOLVED_DYNAMIC_VALUE 4 | 838212fdfd3c |
| z_horde_1920 | `zin_horde_window` | chancery | 1920x1080 | 14 | 0 | 0 | 7 | 0 | BUTTON_TRIGGER_MISSING 1, UNRESOLVED_DYNAMIC_VALUE 4 | b1f1e6e34a46 |
| z_horde_long | `zin_horde_window` | chancery | 1920x1080 | 14 | 0 | 0 | 7 | 0 | BUTTON_TRIGGER_MISSING 1, UNRESOLVED_DYNAMIC_VALUE 5 | b1f1e6e34a46 |
| z_inlay_1280 | `zin_interim_inlay_window` | chronicle | 1280x720 | 0 | 0 | 0 | 0 | 0 | SCRIPTED_CONTEXT_UNKNOWN 1 | 8366fbcb5c0a |
| z_inlay_1920 | `zin_interim_inlay_window` | chronicle | 1920x1080 | 0 | 0 | 0 | 0 | 0 | SCRIPTED_CONTEXT_UNKNOWN 1 | 397d44367a8a |
| z_inlay_long | `zin_interim_inlay_window` | chronicle | 1920x1080 | 0 | 0 | 0 | 0 | 0 | SCRIPTED_CONTEXT_UNKNOWN 1 | 397d44367a8a |
| z_mistake1_1280 | `zin_mistake_window` | chancery | 1280x720 | 12 | 0 | 0 | 3 | 0 | BUTTON_TRIGGER_MISSING 2, UNRESOLVED_DYNAMIC_VALUE 1, UNRESOLVED_VISIBILITY_OVERLAP 2 | b9da0adb4884 |
| z_mistake1_1920 | `zin_mistake_window` | chancery | 1920x1080 | 12 | 0 | 0 | 3 | 0 | BUTTON_TRIGGER_MISSING 2, UNRESOLVED_DYNAMIC_VALUE 1, UNRESOLVED_VISIBILITY_OVERLAP 2 | f3ad5a13a6fe |
| z_mistake1_2560 | `zin_mistake_window` | chancery | 2560x1440 | 12 | 0 | 0 | 3 | 0 | BUTTON_TRIGGER_MISSING 2, UNRESOLVED_DYNAMIC_VALUE 1, UNRESOLVED_VISIBILITY_OVERLAP 2 | 28c645ac55ea |
| z_mistake1_long | `zin_mistake_window` | chancery | 1920x1080 | 12 | 0 | 0 | 3 | 0 | BUTTON_TRIGGER_MISSING 2, UNRESOLVED_DYNAMIC_VALUE 1, UNRESOLVED_VISIBILITY_OVERLAP 2, ACCIDENTAL_CLIPPING 1 | f3ad5a13a6fe |
| z_mistake2_1920 | `zin_mistake_window` | chancery | 1920x1080 | 2 | 0 | 0 | 0 | 0 | BUTTON_TRIGGER_MISSING 2, ACCIDENTAL_CLIPPING 2, INVALID_SIZE 1 | ea361377dc4a |
| z_realm_1280 | `zin_realm_window` | chancery | 1280x720 | 7 | 0 | 0 | 6 | 0 | AI_EQUIVALENT_MISSING 1, UNRESOLVED_DYNAMIC_VALUE 3, BUTTON_TRIGGER_MISSING 1 | 7baeb9f49795 |
| z_realm_1920 | `zin_realm_window` | chancery | 1920x1080 | 7 | 0 | 0 | 6 | 0 | AI_EQUIVALENT_MISSING 1, UNRESOLVED_DYNAMIC_VALUE 3, BUTTON_TRIGGER_MISSING 1 | 19eb94d7a650 |
| z_realm_2560 | `zin_realm_window` | chancery | 2560x1440 | 7 | 0 | 0 | 6 | 0 | AI_EQUIVALENT_MISSING 1, UNRESOLVED_DYNAMIC_VALUE 3, BUTTON_TRIGGER_MISSING 1 | 819a61337864 |
| z_realm_btn_1280 | `zin_realm_button_window` | chancery | 1280x720 | 1 | 0 | 0 | 0 | 0 | AI_EQUIVALENT_MISSING 1, BUTTON_TRIGGER_MISSING 1 | f414f7a8ed36 |
| z_realm_btn_1920 | `zin_realm_button_window` | chancery | 1920x1080 | 1 | 0 | 0 | 0 | 0 | AI_EQUIVALENT_MISSING 1, BUTTON_TRIGGER_MISSING 1 | 6416eefd21e7 |
| z_realm_btn_2560 | `zin_realm_button_window` | chancery | 2560x1440 | 1 | 0 | 0 | 0 | 0 | AI_EQUIVALENT_MISSING 1, BUTTON_TRIGGER_MISSING 1 | 6dc0fb15acba |
| z_realm_btn_long | `zin_realm_button_window` | chancery | 1920x1080 | 1 | 0 | 0 | 0 | 0 | AI_EQUIVALENT_MISSING 1, BUTTON_TRIGGER_MISSING 1 | 6416eefd21e7 |
| z_realm_long | `zin_realm_window` | chancery | 1920x1080 | 7 | 0 | 0 | 6 | 0 | AI_EQUIVALENT_MISSING 1, UNRESOLVED_DYNAMIC_VALUE 4, BUTTON_TRIGGER_MISSING 1 | 19eb94d7a650 |
| z_se1_1280 | `zin_super_event_window` | chancery | 1280x720 | 6 | 0 | 0 | 4 | 0 | MISSING_TEXTURE 1, TEXTURE_UNSUPPORTED 1, UNRESOLVED_DYNAMIC_VALUE 1, ACCIDENTAL_CLIPPING 1, INVALID_SIZE 1 | 878301470078 |
| z_se1_1920 | `zin_super_event_window` | chancery | 1920x1080 | 6 | 0 | 0 | 4 | 0 | MISSING_TEXTURE 1, TEXTURE_UNSUPPORTED 1, UNRESOLVED_DYNAMIC_VALUE 1, ACCIDENTAL_CLIPPING 1, INVALID_SIZE 1 | 4e67102d9f7a |
| z_se1_2560 | `zin_super_event_window` | chancery | 2560x1440 | 6 | 0 | 0 | 4 | 0 | MISSING_TEXTURE 1, TEXTURE_UNSUPPORTED 1, UNRESOLVED_DYNAMIC_VALUE 1, ACCIDENTAL_CLIPPING 1, INVALID_SIZE 1 | 160ecc2adcb1 |
| z_se1_long | `zin_super_event_window` | chancery | 1920x1080 | 6 | 0 | 0 | 4 | 0 | MISSING_TEXTURE 1, TEXTURE_UNSUPPORTED 2, UNRESOLVED_DYNAMIC_VALUE 1, ACCIDENTAL_CLIPPING 1, INVALID_SIZE 1 | 4e67102d9f7a |
| z_se5_1280 | `zin_super_event_window` | chancery | 1280x720 | 7 | 0 | 0 | 0 | 0 | ACCIDENTAL_CLIPPING 3, INVALID_SIZE 1, TEXTURE_UNSUPPORTED 1 | d3db17e28e04 |
| z_se5_1920 | `zin_super_event_window` | chancery | 1920x1080 | 7 | 0 | 0 | 0 | 0 | ACCIDENTAL_CLIPPING 3, INVALID_SIZE 1, TEXTURE_UNSUPPORTED 1 | 5de228a46977 |
| z_se5_long | `zin_super_event_window` | chancery | 1920x1080 | 7 | 0 | 0 | 0 | 0 | ACCIDENTAL_CLIPPING 3, INVALID_SIZE 2, TEXTURE_UNSUPPORTED 1 | 5de228a46977 |
| z_strait1_1280 | `zin_strait_window` | chancery | 1280x720 | 10 | 0 | 1 | 4 | 0 | BUTTON_TRIGGER_MISSING 3, ACCIDENTAL_CLIPPING 1, INVALID_SIZE 1 | 142181066d23 |
| z_strait1_1920 | `zin_strait_window` | chancery | 1920x1080 | 10 | 0 | 1 | 4 | 0 | BUTTON_TRIGGER_MISSING 3, ACCIDENTAL_CLIPPING 1, INVALID_SIZE 1 | 0e5300024c03 |
| z_strait1_long | `zin_strait_window` | chancery | 1920x1080 | 10 | 0 | 1 | 4 | 0 | BUTTON_TRIGGER_MISSING 4, ACCIDENTAL_CLIPPING 1, INVALID_SIZE 1 | 0e5300024c03 |
| z_strait2_1920 | `zin_strait_window` | chancery | 1920x1080 | 11 | 0 | 0 | 5 | 0 | BUTTON_TRIGGER_MISSING 3, ACCIDENTAL_CLIPPING 1, INVALID_SIZE 1 | 13c313b66dd6 |
| z_techtree_1280 | `countrytechtreeview` | chronicle | 1280x720 | 52 | 0 | 0 | 0 | 0 | CONFLICTING_CLICK_REGIONS 18 | 9db5a96ad57d |
| z_techtree_1920 | `countrytechtreeview` | chronicle | 1920x1080 | 78 | 0 | 8 | 0 | 0 | CONFLICTING_CLICK_REGIONS 18 | 7f466a051125 |
| z_techtree_long | `countrytechtreeview` | chronicle | 1920x1080 | 78 | 0 | 8 | 0 | 0 | CONFLICTING_CLICK_REGIONS 18 | 7f466a051125 |
| z_watch1_1280 | `zin_watch_window` | chancery | 1280x720 | 11 | 0 | 0 | 6 | 0 | BUTTON_TRIGGER_MISSING 2, UNRESOLVED_DYNAMIC_VALUE 1, ACCIDENTAL_CLIPPING 1, VISIBLE_OVERLAP 1 | ab7266726cb6 |
| z_watch1_1920 | `zin_watch_window` | chancery | 1920x1080 | 11 | 0 | 0 | 6 | 0 | BUTTON_TRIGGER_MISSING 2, UNRESOLVED_DYNAMIC_VALUE 1, ACCIDENTAL_CLIPPING 1, VISIBLE_OVERLAP 1 | 4c9e9c764380 |
| z_watch1_long | `zin_watch_window` | chancery | 1920x1080 | 11 | 0 | 0 | 6 | 0 | BUTTON_TRIGGER_MISSING 2, UNRESOLVED_DYNAMIC_VALUE 1, ACCIDENTAL_CLIPPING 1, VISIBLE_OVERLAP 2 | 4c9e9c764380 |
| z_watch2_1920 | `zin_watch_window` | chancery | 1920x1080 | 2 | 0 | 0 | 0 | 0 | BUTTON_TRIGGER_MISSING 2, ACCIDENTAL_CLIPPING 2, INVALID_SIZE 1 | 41dff02c26b5 |
