# UI review metrics

Offline renders, tool-generated (hoi4.gui_render 4.6.1); check 19 text.render_metrics of the design system (§2.2, §9). 196 renders, 2 errors. Thresholds: contrast 4.5:1 under 20 px and 3:1 from 20 px; ground deviation 0.06. Engine-filled keys appear as raw keys in the offline model (audit §1, fidelity limits).

Totals: 1993 text elements; contrast 29, ground 117, raw keys 246, overflow 36, under 16 px 66.

| Render | Window | Theme | Size | Texts | Contrast | Ground | Raw keys | Overflow | Under 16 px | Diagnostics | PNG sha256 (first 12) |
| --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| v_EventWindow_1280 | `EventWindow` | chancery | 1280x720 | 2 | 0 | 0 | 0 | 0 | 0 | MISSING_LOCALISATION 2, NEAR_CENTRE_OFFSET 1, VISIBLE_OVERLAP 1 | 699702d271a8 |
| v_EventWindow_1920 | `EventWindow` | chancery | 1920x1080 | 2 | 0 | 0 | 0 | 0 | 0 | MISSING_LOCALISATION 2, NEAR_CENTRE_OFFSET 1, VISIBLE_OVERLAP 1 | 349fb9f0acce |
| v_EventWindow_News_1280 | `EventWindow_News` | chancery | 1280x720 | 2 | 0 | 0 | 0 | 0 | 0 | MISSING_LOCALISATION 2, ACCIDENTAL_CLIPPING 1, CHILD_OUTSIDE_CLIPPED_PARENT 1 | 57915711055f |
| v_EventWindow_News_1920 | `EventWindow_News` | chancery | 1920x1080 | 2 | 0 | 0 | 0 | 0 | 0 | MISSING_LOCALISATION 2, ACCIDENTAL_CLIPPING 1, CHILD_OUTSIDE_CLIPPED_PARENT 1 | 8859c4adfd6b |
| v_EventWindow_News_long | `EventWindow_News` | chancery | 1920x1080 | 2 | 0 | 0 | 0 | 0 | 0 | MISSING_LOCALISATION 2, ACCIDENTAL_CLIPPING 1, CHILD_OUTSIDE_CLIPPED_PARENT 1, VISIBLE_OVERLAP 1 | 8859c4adfd6b |
| v_EventWindow_long | `EventWindow` | chancery | 1920x1080 | 2 | 0 | 0 | 0 | 0 | 0 | MISSING_LOCALISATION 2, NEAR_CENTRE_OFFSET 1, VISIBLE_OVERLAP 1, CONTENT_CROSSES_BACKGROUND_EDGE 1 | 349fb9f0acce |
| v_MapmodesInterface_Ingame_1280 | `MapmodesInterface_Ingame` | banner_hall | 1280x720 | 1 | 0 | 0 | 0 | 0 | 0 | CONFLICTING_CLICK_REGIONS 18 | 6b513e905cc1 |
| v_MapmodesInterface_Ingame_1920 | `MapmodesInterface_Ingame` | banner_hall | 1920x1080 | 1 | 0 | 0 | 0 | 0 | 0 | CONFLICTING_CLICK_REGIONS 18 | a724e23e29be |
| v_MapmodesInterface_Ingame_long | `MapmodesInterface_Ingame` | banner_hall | 1920x1080 | 1 | 0 | 0 | 0 | 0 | 0 | CONFLICTING_CLICK_REGIONS 18 | a724e23e29be |
| v_clock_window_1280 | `clock_window` | banner_hall | 1280x720 | 1 | 0 | 1 | 0 | 0 | 0 | MISSING_LOCALISATION 1, ACCIDENTAL_CLIPPING 2, CHILD_OUTSIDE_CLIPPED_PARENT 1 | 9982fa93691d |
| v_clock_window_1920 | `clock_window` | banner_hall | 1920x1080 | 1 | 0 | 1 | 0 | 0 | 0 | MISSING_LOCALISATION 1, ACCIDENTAL_CLIPPING 2, CHILD_OUTSIDE_CLIPPED_PARENT 1 | 2378ec93eff3 |
| v_clock_window_long | `clock_window` | banner_hall | 1920x1080 | 1 | 0 | 1 | 0 | 0 | 0 | MISSING_LOCALISATION 1, ACCIDENTAL_CLIPPING 3, CHILD_OUTSIDE_CLIPPED_PARENT 1 | 2378ec93eff3 |
| v_countryarmyview_1280 | `countryarmyview` | banner_hall | 1280x720 | 16 | 0 | 0 | 0 | 0 | 0 | CONFLICTING_CLICK_REGIONS 5, MISSING_LOCALISATION 1 | 9c181b26f676 |
| v_countryarmyview_1920 | `countryarmyview` | banner_hall | 1920x1080 | 16 | 0 | 0 | 0 | 0 | 0 | CONFLICTING_CLICK_REGIONS 5, MISSING_LOCALISATION 1 | 20902ab13461 |
| v_countryarmyview_long | `countryarmyview` | banner_hall | 1920x1080 | 16 | 0 | 0 | 0 | 0 | 0 | CONFLICTING_CLICK_REGIONS 5, MISSING_LOCALISATION 1 | 20902ab13461 |
| v_countryconstructionsview_1280 | `countryconstructionsview` | banner_hall | 1280x720 | 16 | 0 | 0 | 0 | 0 | 0 | CONFLICTING_CLICK_REGIONS 7, MISSING_LOCALISATION 1 | cc738c3baa3e |
| v_countryconstructionsview_1920 | `countryconstructionsview` | banner_hall | 1920x1080 | 16 | 0 | 0 | 0 | 0 | 0 | CONFLICTING_CLICK_REGIONS 7, MISSING_LOCALISATION 1 | f33adcfc9392 |
| v_countryconstructionsview_long | `countryconstructionsview` | banner_hall | 1920x1080 | 16 | 0 | 0 | 0 | 0 | 0 | CONFLICTING_CLICK_REGIONS 7, MISSING_LOCALISATION 1 | f33adcfc9392 |
| v_countrydecisionview_1280 | `countrydecisionview` | chancery | 1280x720 | 1 | 0 | 0 | 0 | 0 | 0 | ACCIDENTAL_CLIPPING 3, CHILD_OUTSIDE_CLIPPED_PARENT 1 | 96d8e3b9fcb6 |
| v_countrydecisionview_1920 | `countrydecisionview` | chancery | 1920x1080 | 1 | 0 | 0 | 0 | 0 | 0 | ACCIDENTAL_CLIPPING 3, CHILD_OUTSIDE_CLIPPED_PARENT 1 | 69f5da346de2 |
| v_countrydecisionview_long | `countrydecisionview` | chancery | 1920x1080 | 1 | 0 | 0 | 0 | 0 | 0 | ACCIDENTAL_CLIPPING 3, CHILD_OUTSIDE_CLIPPED_PARENT 2 | 69f5da346de2 |
| v_countrydeploymentview_1280 | `countrydeploymentview` | banner_hall | 1280x720 | 1 | 0 | 0 | 0 | 0 | 0 | VISIBLE_OVERLAP 1, ACCIDENTAL_CLIPPING 2, CHILD_OUTSIDE_CLIPPED_PARENT 1 | 7da1f8e8f485 |
| v_countrydeploymentview_1920 | `countrydeploymentview` | banner_hall | 1920x1080 |  |  |  |  |  |  |  |  |
| v_countrydeploymentview_long | `countrydeploymentview` | banner_hall | 1920x1080 | 1 | 0 | 0 | 0 | 0 | 0 | VISIBLE_OVERLAP 1, ACCIDENTAL_CLIPPING 3, CHILD_OUTSIDE_CLIPPED_PARENT 1 | 23f65ee987b1 |
| v_countrydiplomacyview_1280 | `countrydiplomacyview` | chancery | 1280x720 | 26 | 0 | 0 | 0 | 0 | 0 | CONFLICTING_CLICK_REGIONS 7, MISSING_LOCALISATION 9, MISSING_SPRITE 1, SPRITE_MISSING 1 | 0f22cf13a7ac |
| v_countrydiplomacyview_1920 | `countrydiplomacyview` | chancery | 1920x1080 | 28 | 0 | 0 | 0 | 0 | 0 | CONFLICTING_CLICK_REGIONS 3, MISSING_LOCALISATION 13, MISSING_SPRITE 1, SPRITE_MISSING 1 | 5e0552c757d4 |
| v_countrydiplomacyview_long | `countrydiplomacyview` | chancery | 1920x1080 | 28 | 0 | 0 | 0 | 0 | 0 | CONFLICTING_CLICK_REGIONS 3, MISSING_LOCALISATION 13, MISSING_SPRITE 1, SPRITE_MISSING 1 | 5e0552c757d4 |
| v_countrydoctrineview_1280 | `countrydoctrineview` | chronicle | 1280x720 | 12 | 4 | 0 | 0 | 0 | 0 | CONFLICTING_CLICK_REGIONS 1, VISIBLE_OVERLAP 2, Z_ORDER_RISK 1 | c5f1fdcb7754 |
| v_countrydoctrineview_1920 | `countrydoctrineview` | chronicle | 1920x1080 | 14 | 5 | 0 | 0 | 0 | 0 | CONFLICTING_CLICK_REGIONS 1, VISIBLE_OVERLAP 2, Z_ORDER_RISK 1 | 2307d32c897a |
| v_countrydoctrineview_long | `countrydoctrineview` | chronicle | 1920x1080 | 14 | 5 | 0 | 0 | 0 | 0 | CONFLICTING_CLICK_REGIONS 1, VISIBLE_OVERLAP 3, Z_ORDER_RISK 1 | 2307d32c897a |
| v_countryintelledger_1280 | `countryintelledger` | chancery | 1280x720 | 0 | 0 | 0 | 0 | 0 | 0 | PARENT_WINDOW_INVALID 2, REFERENCE_UNRESOLVED 15, UNRESOLVED_REFERENCE 1, WINDOW_MISSING 1 | 8366fbcb5c0a |
| v_countryintelledger_1920 | `countryintelledger` | chancery | 1920x1080 |  |  |  |  |  |  | PARENT_WINDOW_INVALID 2, REFERENCE_UNRESOLVED 15, UNRESOLVED_REFERENCE 1, WINDOW_MISSING 1 |  |
| v_countryintelledger_long | `countryintelledger` | chancery | 1920x1080 | 0 | 0 | 0 | 0 | 0 | 0 | PARENT_WINDOW_INVALID 2, REFERENCE_UNRESOLVED 15, UNRESOLVED_REFERENCE 1, WINDOW_MISSING 1 | 397d44367a8a |
| v_countryintelligenceagencyview_1280 | `countryintelligenceagencyview` | chancery | 1280x720 | 15 | 3 | 2 | 0 | 0 | 0 | SPRITE_SHEET_DIMENSION_INVALID 1, MISSING_LOCALISATION 7, CONFLICTING_CLICK_REGIONS 2 | cb16d911c99e |
| v_countryintelligenceagencyview_1920 | `countryintelligenceagencyview` | chancery | 1920x1080 | 15 | 3 | 2 | 0 | 0 | 0 | SPRITE_SHEET_DIMENSION_INVALID 1, MISSING_LOCALISATION 7, CONFLICTING_CLICK_REGIONS 2 | 8b083891e3b4 |
| v_countryintelligenceagencyview_long | `countryintelligenceagencyview` | chancery | 1920x1080 | 15 | 3 | 2 | 0 | 0 | 0 | SPRITE_SHEET_DIMENSION_INVALID 1, MISSING_LOCALISATION 7, CONFLICTING_CLICK_REGIONS 2 | 8b083891e3b4 |
| v_countrylogisticsview_1280 | `countrylogisticsview` | banner_hall | 1280x720 | 12 | 0 | 0 | 0 | 3 | 0 | CONFLICTING_CLICK_REGIONS 1, VISIBLE_OVERLAP 3 | 91629b3a20b3 |
| v_countrylogisticsview_1920 | `countrylogisticsview` | banner_hall | 1920x1080 | 12 | 0 | 0 | 0 | 3 | 0 | CONFLICTING_CLICK_REGIONS 1, VISIBLE_OVERLAP 3 | aecf333e0119 |
| v_countrylogisticsview_long | `countrylogisticsview` | banner_hall | 1920x1080 | 12 | 0 | 0 | 0 | 3 | 0 | CONFLICTING_CLICK_REGIONS 1, VISIBLE_OVERLAP 4 | aecf333e0119 |
| v_countrypoliticsview_1280 | `countrypoliticsview` | chancery | 1280x720 | 12 | 0 | 0 | 1 | 0 | 0 | MISSING_SPRITE 1, SPRITE_MISSING 1, MISSING_LOCALISATION 6, CONFLICTING_CLICK_REGIONS 4 | 388bb25591c9 |
| v_countrypoliticsview_1920 | `countrypoliticsview` | chancery | 1920x1080 | 12 | 0 | 0 | 1 | 0 | 0 | MISSING_SPRITE 1, SPRITE_MISSING 1, MISSING_LOCALISATION 6, CONFLICTING_CLICK_REGIONS 4 | 9408ba29f5ef |
| v_countrypoliticsview_long | `countrypoliticsview` | chancery | 1920x1080 | 12 | 0 | 0 | 1 | 0 | 0 | MISSING_SPRITE 1, SPRITE_MISSING 1, MISSING_LOCALISATION 6, CONFLICTING_CLICK_REGIONS 4 | 9408ba29f5ef |
| v_countryproductionlineview_1280 | `countryproductionlineview` | banner_hall | 1280x720 | 24 | 0 | 0 | 0 | 0 | 0 | MISSING_LOCALISATION 3, CONFLICTING_CLICK_REGIONS 1 | cae7751f46dd |
| v_countryproductionlineview_1920 | `countryproductionlineview` | banner_hall | 1920x1080 | 24 | 0 | 0 | 0 | 0 | 0 | MISSING_LOCALISATION 3, CONFLICTING_CLICK_REGIONS 1 | 53dd496dde4e |
| v_countryproductionlineview_long | `countryproductionlineview` | banner_hall | 1920x1080 | 24 | 0 | 0 | 0 | 0 | 0 | MISSING_LOCALISATION 3, CONFLICTING_CLICK_REGIONS 1, VISIBLE_OVERLAP 1 | 53dd496dde4e |
| v_countrystateview_1280 | `countrystateview` | banner_hall | 1280x720 | 4 | 0 | 0 | 2 | 0 | 0 | MISSING_LOCALISATION 2, ACCIDENTAL_CLIPPING 2 | df0bb15ba257 |
| v_countrystateview_1920 | `countrystateview` | banner_hall | 1920x1080 | 4 | 0 | 0 | 2 | 0 | 0 | MISSING_LOCALISATION 2, ACCIDENTAL_CLIPPING 2 | c9da4383dc3d |
| v_countrystateview_long | `countrystateview` | banner_hall | 1920x1080 | 4 | 0 | 0 | 2 | 0 | 0 | MISSING_LOCALISATION 2, ACCIDENTAL_CLIPPING 3 | c9da4383dc3d |
| v_countrytechnologyview_1280 | `countrytechnologyview` | chronicle | 1280x720 | 7 | 0 | 4 | 0 | 0 | 0 | CONFLICTING_CLICK_REGIONS 1, ACCIDENTAL_CLIPPING 2, CHILD_OUTSIDE_CLIPPED_PARENT 1 | e28fd4c623e9 |
| v_countrytechnologyview_1920 | `countrytechnologyview` | chronicle | 1920x1080 | 7 | 0 | 4 | 0 | 0 | 0 | CONFLICTING_CLICK_REGIONS 1, ACCIDENTAL_CLIPPING 2, CHILD_OUTSIDE_CLIPPED_PARENT 1 | 8ae4cada4235 |
| v_countrytechnologyview_long | `countrytechnologyview` | chronicle | 1920x1080 | 7 | 0 | 4 | 0 | 0 | 0 | CONFLICTING_CLICK_REGIONS 1, ACCIDENTAL_CLIPPING 3, CHILD_OUTSIDE_CLIPPED_PARENT 1 | 8ae4cada4235 |
| v_countrytechtreeview_1280 | `countrytechtreeview` | chronicle | 1280x720 | 52 | 0 | 6 | 0 | 0 | 0 | CONFLICTING_CLICK_REGIONS 18 | fd3ccd40bb9d |
| v_countrytechtreeview_1920 | `countrytechtreeview` | chronicle | 1920x1080 | 78 | 0 | 6 | 0 | 0 | 0 | CONFLICTING_CLICK_REGIONS 18 | c969aa1d849b |
| v_countrytechtreeview_long | `countrytechtreeview` | chronicle | 1920x1080 | 78 | 0 | 6 | 0 | 0 | 0 | CONFLICTING_CLICK_REGIONS 18 | c969aa1d849b |
| v_countrytradeview_1280 | `countrytradeview` | banner_hall | 1280x720 | 12 | 0 | 0 | 0 | 0 | 0 | VISIBLE_OVERLAP 1, ACCIDENTAL_CLIPPING 2, CHILD_OUTSIDE_CLIPPED_PARENT 1 | 618373c297ee |
| v_countrytradeview_1920 | `countrytradeview` | banner_hall | 1920x1080 | 12 | 0 | 0 | 0 | 0 | 0 | VISIBLE_OVERLAP 1, ACCIDENTAL_CLIPPING 2, CHILD_OUTSIDE_CLIPPED_PARENT 1 | 116b40dd13b0 |
| v_countrytradeview_long | `countrytradeview` | banner_hall | 1920x1080 | 12 | 0 | 0 | 0 | 0 | 0 | VISIBLE_OVERLAP 1, ACCIDENTAL_CLIPPING 3, CHILD_OUTSIDE_CLIPPED_PARENT 1 | 116b40dd13b0 |
| v_diplomacy_standard_popup_window_1280 | `diplomacy_standard_popup_window` | neutral | 1280x720 | 4 | 0 | 0 | 0 | 0 | 0 | MISSING_LOCALISATION 2, VISIBLE_OVERLAP 1, SPRITE_RENDER_PARTIAL 1 | b84954a751f7 |
| v_diplomacy_standard_popup_window_1920 | `diplomacy_standard_popup_window` | neutral | 1920x1080 | 4 | 0 | 0 | 0 | 0 | 0 | MISSING_LOCALISATION 2, VISIBLE_OVERLAP 1, SPRITE_RENDER_PARTIAL 1 | 378cbb00221c |
| v_diplomacy_standard_popup_window_long | `diplomacy_standard_popup_window` | neutral | 1920x1080 | 4 | 0 | 0 | 0 | 0 | 0 | MISSING_LOCALISATION 2, VISIBLE_OVERLAP 2, SPRITE_RENDER_PARTIAL 1 | 378cbb00221c |
| v_frontend_background_1280 | `frontend_background` | banner_hall | 1280x720 | 0 | 0 | 0 | 0 | 0 | 0 | ACCIDENTAL_CLIPPING 2, CHILD_OUTSIDE_CLIPPED_PARENT 1 | 56a8936a5c09 |
| v_frontend_background_1920 | `frontend_background` | banner_hall | 1920x1080 | 0 | 0 | 0 | 0 | 0 | 0 | ACCIDENTAL_CLIPPING 2, CHILD_OUTSIDE_CLIPPED_PARENT 1 | 0422ca973f80 |
| v_frontend_background_long | `frontend_background` | banner_hall | 1920x1080 | 0 | 0 | 0 | 0 | 0 | 0 | ACCIDENTAL_CLIPPING 2, CHILD_OUTSIDE_CLIPPED_PARENT 1 | 0422ca973f80 |
| v_frontendgamesetupview_1280 | `frontendgamesetupview` | banner_hall | 1280x720 | 2 | 0 | 0 | 0 | 0 | 0 | MISSING_LOCALISATION 2, CONFLICTING_CLICK_REGIONS 2 | 3bb1076ddd3c |
| v_frontendgamesetupview_1920 | `frontendgamesetupview` | banner_hall | 1920x1080 | 2 | 0 | 0 | 0 | 0 | 0 | MISSING_LOCALISATION 2, CONFLICTING_CLICK_REGIONS 2 | 97f747aaf850 |
| v_frontendgamesetupview_long | `frontendgamesetupview` | banner_hall | 1920x1080 | 2 | 0 | 0 | 0 | 0 | 0 | MISSING_LOCALISATION 2, CONFLICTING_CLICK_REGIONS 2, ACCIDENTAL_CLIPPING 1 | 97f747aaf850 |
| v_game_rule_window_1280 | `game_rule_window` | banner_hall | 1280x720 | 0 | 0 | 0 | 0 | 0 | 0 | ACCIDENTAL_CLIPPING 4 | 43dbf8ded14f |
| v_game_rule_window_1920 | `game_rule_window` | banner_hall | 1920x1080 | 0 | 0 | 0 | 0 | 0 | 0 | ACCIDENTAL_CLIPPING 4 | ff68b7b3c52b |
| v_game_rule_window_long | `game_rule_window` | banner_hall | 1920x1080 | 0 | 0 | 0 | 0 | 0 | 0 | ACCIDENTAL_CLIPPING 5 | ff68b7b3c52b |
| v_gamesetup_country_details_1280 | `gamesetup_country_details` | banner_hall | 1280x720 | 5 | 0 | 0 | 0 | 0 | 0 | MISSING_SPRITE 1, SPRITE_MISSING 1, ACCIDENTAL_CLIPPING 2 | 070e374a540f |
| v_gamesetup_country_details_1920 | `gamesetup_country_details` | banner_hall | 1920x1080 | 5 | 0 | 0 | 0 | 0 | 0 | MISSING_SPRITE 1, SPRITE_MISSING 1, ACCIDENTAL_CLIPPING 2 | 4377d271adbb |
| v_gamesetup_country_details_long | `gamesetup_country_details` | banner_hall | 1920x1080 | 5 | 0 | 0 | 0 | 0 | 0 | MISSING_SPRITE 1, SPRITE_MISSING 1, ACCIDENTAL_CLIPPING 2, CHILD_OUTSIDE_CLIPPED_PARENT 1 | 4377d271adbb |
| v_global_alerticon_window_1280 | `global_alerticon_window` | banner_hall | 1280x720 | 0 | 0 | 0 | 0 | 0 | 0 | ANIMATION_STATIC_FALLBACK_MISSING 2, SPRITE_RENDER_PARTIAL 2, VISIBLE_OVERLAP 1 | 57e1b9931429 |
| v_global_alerticon_window_1920 | `global_alerticon_window` | banner_hall | 1920x1080 | 0 | 0 | 0 | 0 | 0 | 0 | ANIMATION_STATIC_FALLBACK_MISSING 2, SPRITE_RENDER_PARTIAL 2, VISIBLE_OVERLAP 1 | 8915f6c7e581 |
| v_global_alerticon_window_long | `global_alerticon_window` | banner_hall | 1920x1080 | 0 | 0 | 0 | 0 | 0 | 0 | ANIMATION_STATIC_FALLBACK_MISSING 2, SPRITE_RENDER_PARTIAL 2, VISIBLE_OVERLAP 2 | 8915f6c7e581 |
| v_ingamemenu_1280 | `ingamemenu` | banner_hall | 1280x720 | 8 | 0 | 0 | 0 | 0 | 0 | CONFLICTING_CLICK_REGIONS 15 | bdc04e218a7d |
| v_ingamemenu_1920 | `ingamemenu` | banner_hall | 1920x1080 | 8 | 0 | 0 | 0 | 0 | 0 | CONFLICTING_CLICK_REGIONS 15 | d3b3cab5430c |
| v_ingamemenu_long | `ingamemenu` | banner_hall | 1920x1080 | 8 | 0 | 0 | 0 | 0 | 0 | CONFLICTING_CLICK_REGIONS 15 | d3b3cab5430c |
| v_landcombatview_1280 | `landcombatview` | banner_hall | 1280x720 | 10 | 0 | 2 | 0 | 0 | 0 | MISSING_LOCALISATION 8 | af331910578b |
| v_landcombatview_1920 | `landcombatview` | banner_hall | 1920x1080 | 10 | 0 | 2 | 0 | 0 | 0 | MISSING_LOCALISATION 8 | d9e5daaa1d8e |
| v_landcombatview_long | `landcombatview` | banner_hall | 1920x1080 | 10 | 0 | 2 | 0 | 0 | 0 | MISSING_LOCALISATION 8 | d9e5daaa1d8e |
| v_load_screen_1280 | `load_screen` | banner_hall | 1280x720 | 0 | 0 | 0 | 0 | 0 | 0 | SPRITE_DECLARED_SIZE_MISMATCH 1, ACCIDENTAL_CLIPPING 2, CHILD_OUTSIDE_CLIPPED_PARENT 1 | 211ab952ec9b |
| v_load_screen_1920 | `load_screen` | banner_hall | 1920x1080 | 0 | 0 | 0 | 0 | 0 | 0 | SPRITE_DECLARED_SIZE_MISMATCH 1, VISIBLE_OVERLAP 1, ACCIDENTAL_CLIPPING 1, CHILD_OUTSIDE_CLIPPED_PARENT 1 | 00c9a9b386be |
| v_load_screen_long | `load_screen` | banner_hall | 1920x1080 | 0 | 0 | 0 | 0 | 0 | 0 | SPRITE_DECLARED_SIZE_MISMATCH 1, VISIBLE_OVERLAP 1, ACCIDENTAL_CLIPPING 2, CHILD_OUTSIDE_CLIPPED_PARENT 1 | 00c9a9b386be |
| v_mainmenu_panel_bottom_1280 | `mainmenu_panel_bottom` | banner_hall | 1280x720 | 11 | 0 | 0 | 1 | 0 | 0 | MISSING_LOCALISATION 2, CONFLICTING_CLICK_REGIONS 1, ANIMATION_STATIC_FALLBACK_MISSING 1 | 75ae21065c59 |
| v_mainmenu_panel_bottom_1920 | `mainmenu_panel_bottom` | banner_hall | 1920x1080 | 11 | 0 | 0 | 1 | 0 | 0 | MISSING_LOCALISATION 2, CONFLICTING_CLICK_REGIONS 1, ANIMATION_STATIC_FALLBACK_MISSING 1 | c5bf8c78d477 |
| v_mainmenu_panel_bottom_long | `mainmenu_panel_bottom` | banner_hall | 1920x1080 | 11 | 0 | 0 | 1 | 0 | 0 | MISSING_LOCALISATION 2, CONFLICTING_CLICK_REGIONS 1, ANIMATION_STATIC_FALLBACK_MISSING 1, ACCIDENTAL_CLIPPING 1 | c5bf8c78d477 |
| v_mainmenu_single_player_1280 | `mainmenu_single_player` | banner_hall | 1280x720 | 5 | 0 | 0 | 0 | 0 | 0 | SPRITE_RENDER_PARTIAL 1, VISIBLE_OVERLAP 4 | 9f05d5a520ee |
| v_mainmenu_single_player_1920 | `mainmenu_single_player` | banner_hall | 1920x1080 | 5 | 0 | 0 | 0 | 0 | 0 | SPRITE_RENDER_PARTIAL 1, VISIBLE_OVERLAP 4 | 9aa1cc0d12b5 |
| v_mainmenu_single_player_long | `mainmenu_single_player` | banner_hall | 1920x1080 | 5 | 0 | 0 | 0 | 0 | 0 | SPRITE_RENDER_PARTIAL 1, VISIBLE_OVERLAP 5 | 9aa1cc0d12b5 |
| v_menu_settings_1280 | `menu_settings` | neutral | 1280x720 | 31 | 2 | 2 | 0 | 0 | 22 | CONFLICTING_CLICK_REGIONS 18 | a6ab1f24093e |
| v_menu_settings_1920 | `menu_settings` | neutral | 1920x1080 | 31 | 2 | 2 | 0 | 0 | 22 | CONFLICTING_CLICK_REGIONS 18 | 228b36408b06 |
| v_menu_settings_long | `menu_settings` | neutral | 1920x1080 | 31 | 2 | 2 | 0 | 0 | 22 | CONFLICTING_CLICK_REGIONS 18 | 228b36408b06 |
| v_mini_map_interface_1280 | `mini_map_interface` | banner_hall | 1280x720 | 0 | 0 | 0 | 0 | 0 | 0 | CONFLICTING_CLICK_REGIONS 1, ACCIDENTAL_CLIPPING 2, INVALID_SIZE 1 | 713531739ef4 |
| v_mini_map_interface_1920 | `mini_map_interface` | banner_hall | 1920x1080 | 0 | 0 | 0 | 0 | 0 | 0 | CONFLICTING_CLICK_REGIONS 1, ACCIDENTAL_CLIPPING 2, INVALID_SIZE 1 | ec189eba5904 |
| v_mini_map_interface_long | `mini_map_interface` | banner_hall | 1920x1080 | 0 | 0 | 0 | 0 | 0 | 0 | CONFLICTING_CLICK_REGIONS 1, ACCIDENTAL_CLIPPING 2, INVALID_SIZE 2 | ec189eba5904 |
| v_musicplayer_window_1280 | `musicplayer_window` | banner_hall | 1280x720 | 1 | 0 | 0 | 0 | 0 | 0 | VISIBLE_OVERLAP 1, ACCIDENTAL_CLIPPING 2, CHILD_OUTSIDE_CLIPPED_PARENT 1 | 787865ba29fe |
| v_musicplayer_window_1920 | `musicplayer_window` | banner_hall | 1920x1080 | 1 | 0 | 0 | 0 | 0 | 0 | VISIBLE_OVERLAP 1, ACCIDENTAL_CLIPPING 2, CHILD_OUTSIDE_CLIPPED_PARENT 1 | 8f50909b82f9 |
| v_musicplayer_window_long | `musicplayer_window` | banner_hall | 1920x1080 | 1 | 0 | 0 | 0 | 0 | 0 | VISIBLE_OVERLAP 1, ACCIDENTAL_CLIPPING 2, CHILD_OUTSIDE_CLIPPED_PARENT 2 | 8f50909b82f9 |
| v_nationalfocusview_1280 | `nationalfocusview` | chronicle | 1280x720 | 4 | 0 | 0 | 1 | 0 | 0 | MISSING_LOCALISATION 2, CONFLICTING_CLICK_REGIONS 2 | 3de14f12485f |
| v_nationalfocusview_1920 | `nationalfocusview` | chronicle | 1920x1080 | 5 | 0 | 0 | 1 | 0 | 0 | MISSING_LOCALISATION 2, CONFLICTING_CLICK_REGIONS 2 | 18dc1495ebaf |
| v_nationalfocusview_long | `nationalfocusview` | chronicle | 1920x1080 | 5 | 0 | 0 | 1 | 0 | 0 | MISSING_LOCALISATION 2, CONFLICTING_CLICK_REGIONS 2, ACCIDENTAL_CLIPPING 1 | 18dc1495ebaf |
| v_navalcombatview_1280 | `navalcombatview` | banner_hall | 1280x720 | 23 | 0 | 4 | 0 | 0 | 0 | MISSING_LOCALISATION 7 | 638e073a43fa |
| v_navalcombatview_1920 | `navalcombatview` | banner_hall | 1920x1080 | 23 | 0 | 4 | 0 | 0 | 0 | MISSING_LOCALISATION 7 | 1923a7b8602b |
| v_navalcombatview_long | `navalcombatview` | banner_hall | 1920x1080 | 23 | 0 | 4 | 0 | 0 | 0 | MISSING_LOCALISATION 7 | 1923a7b8602b |
| v_naviesview_window_1280 | `naviesview_window` | banner_hall | 1280x720 | 0 | 0 | 0 | 0 | 0 | 0 | CONFLICTING_CLICK_REGIONS 13 | 03d60232d1d9 |
| v_naviesview_window_1920 | `naviesview_window` | banner_hall | 1920x1080 | 0 | 0 | 0 | 0 | 0 | 0 | CONFLICTING_CLICK_REGIONS 13 | 853a786d99a2 |
| v_naviesview_window_long | `naviesview_window` | banner_hall | 1920x1080 | 0 | 0 | 0 | 0 | 0 | 0 | CONFLICTING_CLICK_REGIONS 13 | 853a786d99a2 |
| v_peaceconference_full_window_1280 | `peaceconference_full_window` | chancery | 1280x720 | 9 | 0 | 1 | 5 | 2 | 0 | MISSING_LOCALISATION 4 | fa5590ea01ef |
| v_peaceconference_full_window_1920 | `peaceconference_full_window` | chancery | 1920x1080 | 9 | 0 | 1 | 5 | 2 | 0 | MISSING_LOCALISATION 4 | 451f51320351 |
| v_peaceconference_full_window_long | `peaceconference_full_window` | chancery | 1920x1080 | 9 | 0 | 1 | 5 | 2 | 0 | MISSING_LOCALISATION 4, ACCIDENTAL_CLIPPING 1 | 451f51320351 |
| v_strategicairview_1280 | `strategicairview` | banner_hall | 1280x720 | 40 | 0 | 1 | 0 | 0 | 0 | MISSING_LOCALISATION 2, MISSING_SPRITE 1, SPRITE_MISSING 1, CONFLICTING_CLICK_REGIONS 14 | bfbe604387ab |
| v_strategicairview_1920 | `strategicairview` | banner_hall | 1920x1080 | 44 | 0 | 1 | 0 | 0 | 0 | MISSING_LOCALISATION 2, MISSING_SPRITE 1, SPRITE_MISSING 1, CONFLICTING_CLICK_REGIONS 14 | c852245a2249 |
| v_strategicairview_long | `strategicairview` | banner_hall | 1920x1080 | 44 | 0 | 1 | 0 | 0 | 0 | MISSING_LOCALISATION 2, MISSING_SPRITE 1, SPRITE_MISSING 1, CONFLICTING_CLICK_REGIONS 14 | c852245a2249 |
| v_theatre_selection_window_1280 | `theatre_selection_window` | banner_hall | 1280x720 | 0 | 0 | 0 | 0 | 0 | 0 | ACCIDENTAL_CLIPPING 1, CHILD_OUTSIDE_CLIPPED_PARENT 1 | 8366fbcb5c0a |
| v_theatre_selection_window_1920 | `theatre_selection_window` | banner_hall | 1920x1080 | 0 | 0 | 0 | 0 | 0 | 0 | ACCIDENTAL_CLIPPING 1, CHILD_OUTSIDE_CLIPPED_PARENT 1 | 397d44367a8a |
| v_theatre_selection_window_long | `theatre_selection_window` | banner_hall | 1920x1080 | 0 | 0 | 0 | 0 | 0 | 0 | ACCIDENTAL_CLIPPING 1, CHILD_OUTSIDE_CLIPPED_PARENT 1 | 397d44367a8a |
| v_topbar_1280 | `topbar` | banner_hall | 1280x720 | 23 | 0 | 10 | 0 | 7 | 0 | CONFLICTING_CLICK_REGIONS 12, MISSING_LOCALISATION 6 | 0cc25ea911a8 |
| v_topbar_1920 | `topbar` | banner_hall | 1920x1080 | 23 | 0 | 10 | 0 | 7 | 0 | CONFLICTING_CLICK_REGIONS 12, MISSING_LOCALISATION 6 | ee387312c641 |
| v_topbar_long | `topbar` | banner_hall | 1920x1080 | 23 | 0 | 10 | 0 | 7 | 0 | CONFLICTING_CLICK_REGIONS 12, MISSING_LOCALISATION 6 | ee387312c641 |
| v_unitleaderwindow_1280 | `unitleaderwindow` | banner_hall | 1280x720 | 0 | 0 | 0 | 0 | 0 | 0 | PARENT_WINDOW_INVALID 2, REFERENCE_UNRESOLVED 15, UNRESOLVED_REFERENCE 1, WINDOW_MISSING 1 | 8366fbcb5c0a |
| v_unitleaderwindow_1920 | `unitleaderwindow` | banner_hall | 1920x1080 | 0 | 0 | 0 | 0 | 0 | 0 | PARENT_WINDOW_INVALID 2, REFERENCE_UNRESOLVED 15, UNRESOLVED_REFERENCE 1, WINDOW_MISSING 1 | 397d44367a8a |
| v_unitleaderwindow_long | `unitleaderwindow` | banner_hall | 1920x1080 | 0 | 0 | 0 | 0 | 0 | 0 | PARENT_WINDOW_INVALID 2, REFERENCE_UNRESOLVED 15, UNRESOLVED_REFERENCE 1, WINDOW_MISSING 1 | 397d44367a8a |
| v_world_tension_popup_1280 | `world_tension_popup` | chronicle | 1280x720 | 7 | 0 | 0 | 0 | 0 | 0 | NEAR_CENTRE_OFFSET 2, ACCIDENTAL_CLIPPING 1, CHILD_OUTSIDE_CLIPPED_PARENT 1 | 63eda31bb3df |
| v_world_tension_popup_1920 | `world_tension_popup` | chronicle | 1920x1080 | 7 | 0 | 0 | 0 | 0 | 0 | NEAR_CENTRE_OFFSET 2, ACCIDENTAL_CLIPPING 1, CHILD_OUTSIDE_CLIPPED_PARENT 1 | 407f45be2155 |
| v_world_tension_popup_long | `world_tension_popup` | chronicle | 1920x1080 | 7 | 0 | 0 | 0 | 0 | 0 | NEAR_CENTRE_OFFSET 2, ACCIDENTAL_CLIPPING 2, CHILD_OUTSIDE_CLIPPED_PARENT 1 | 407f45be2155 |
| z_accord_1280 | `zin_accord_window` | chancery | 1280x720 | 5 | 0 | 0 | 3 | 0 | 0 | BUTTON_TRIGGER_MISSING 1, UNRESOLVED_DYNAMIC_VALUE 3, INCONSISTENT_SPACING 1 | b0b11d82d679 |
| z_accord_1920 | `zin_accord_window` | chancery | 1920x1080 | 5 | 0 | 0 | 3 | 0 | 0 | BUTTON_TRIGGER_MISSING 1, UNRESOLVED_DYNAMIC_VALUE 3, INCONSISTENT_SPACING 1 | 22e512dd4664 |
| z_accord_long | `zin_accord_window` | chancery | 1920x1080 | 5 | 0 | 0 | 3 | 0 | 0 | BUTTON_TRIGGER_MISSING 1, UNRESOLVED_DYNAMIC_VALUE 3, INCONSISTENT_SPACING 1 | 22e512dd4664 |
| z_council1_1280 | `zin_council_window` | chancery | 1280x720 | 8 | 0 | 0 | 2 | 0 | 0 | BUTTON_TRIGGER_MISSING 3, ACCIDENTAL_CLIPPING 1, INVALID_SIZE 1 | 2ad2ea14b05d |
| z_council1_1920 | `zin_council_window` | chancery | 1920x1080 | 8 | 0 | 0 | 2 | 0 | 0 | BUTTON_TRIGGER_MISSING 3, ACCIDENTAL_CLIPPING 1, INVALID_SIZE 1 | 392ede77ac86 |
| z_council1_2560 | `zin_council_window` | chancery | 2560x1440 | 8 | 0 | 0 | 2 | 0 | 0 | BUTTON_TRIGGER_MISSING 3, ACCIDENTAL_CLIPPING 1, INVALID_SIZE 1 | 79745de5de4e |
| z_council1_long | `zin_council_window` | chancery | 1920x1080 | 8 | 0 | 0 | 2 | 0 | 0 | BUTTON_TRIGGER_MISSING 4, ACCIDENTAL_CLIPPING 1, INVALID_SIZE 1 | 392ede77ac86 |
| z_council2_1920 | `zin_council_window` | chancery | 1920x1080 | 9 | 0 | 0 | 4 | 0 | 0 | BUTTON_TRIGGER_MISSING 3, ACCIDENTAL_CLIPPING 1, INVALID_SIZE 1 | 2fc4b5e7fe93 |
| z_council3_1920 | `zin_council_window` | chancery | 1920x1080 | 10 | 0 | 0 | 5 | 0 | 0 | BUTTON_TRIGGER_MISSING 3, ACCIDENTAL_CLIPPING 1, INVALID_SIZE 1 | 5bed694d044a |
| z_court1_1280 | `zin_court_window` | chancery | 1280x720 | 11 | 0 | 0 | 5 | 0 | 0 | BUTTON_TRIGGER_MISSING 3, ACCIDENTAL_CLIPPING 1, INVALID_SIZE 1 | 8152750a4408 |
| z_court1_1920 | `zin_court_window` | chancery | 1920x1080 | 11 | 0 | 0 | 5 | 0 | 0 | BUTTON_TRIGGER_MISSING 3, ACCIDENTAL_CLIPPING 1, INVALID_SIZE 1 | 7e3c97d8e7ac |
| z_court1_2560 | `zin_court_window` | chancery | 2560x1440 | 11 | 0 | 0 | 5 | 0 | 0 | BUTTON_TRIGGER_MISSING 3, ACCIDENTAL_CLIPPING 1, INVALID_SIZE 1 | e4d951047ae5 |
| z_court1_long | `zin_court_window` | chancery | 1920x1080 | 11 | 0 | 0 | 5 | 0 | 0 | BUTTON_TRIGGER_MISSING 3, ACCIDENTAL_CLIPPING 2, INVALID_SIZE 1 | 7e3c97d8e7ac |
| z_court2_1280 | `zin_court_window` | chancery | 1280x720 | 7 | 0 | 0 | 1 | 0 | 0 | BUTTON_TRIGGER_MISSING 3, ACCIDENTAL_CLIPPING 1, INVALID_SIZE 1 | d59da01a1f98 |
| z_court2_1920 | `zin_court_window` | chancery | 1920x1080 | 7 | 0 | 0 | 1 | 0 | 0 | BUTTON_TRIGGER_MISSING 3, ACCIDENTAL_CLIPPING 1, INVALID_SIZE 1 | f0bdd660131c |
| z_court2_2560 | `zin_court_window` | chancery | 2560x1440 | 7 | 0 | 0 | 1 | 0 | 0 | BUTTON_TRIGGER_MISSING 3, ACCIDENTAL_CLIPPING 1, INVALID_SIZE 1 | fa4ced34b543 |
| z_court2_long | `zin_court_window` | chancery | 1920x1080 | 7 | 0 | 0 | 1 | 0 | 0 | BUTTON_TRIGGER_MISSING 3, ACCIDENTAL_CLIPPING 2, INVALID_SIZE 1 | f0bdd660131c |
| z_court3_1280 | `zin_court_window` | chancery | 1280x720 | 11 | 0 | 0 | 5 | 0 | 0 | BUTTON_TRIGGER_MISSING 3, ACCIDENTAL_CLIPPING 1, INVALID_SIZE 1 | b66c7f7ea63b |
| z_court3_1920 | `zin_court_window` | chancery | 1920x1080 | 11 | 0 | 0 | 5 | 0 | 0 | BUTTON_TRIGGER_MISSING 3, ACCIDENTAL_CLIPPING 1, INVALID_SIZE 1 | ac60e5c978a0 |
| z_court3_2560 | `zin_court_window` | chancery | 2560x1440 | 11 | 0 | 0 | 5 | 0 | 0 | BUTTON_TRIGGER_MISSING 3, ACCIDENTAL_CLIPPING 1, INVALID_SIZE 1 | 53630294ceea |
| z_court3_long | `zin_court_window` | chancery | 1920x1080 | 11 | 0 | 0 | 5 | 0 | 0 | BUTTON_TRIGGER_MISSING 3, ACCIDENTAL_CLIPPING 2, INVALID_SIZE 1 | ac60e5c978a0 |
| z_court4_1280 | `zin_court_window` | chancery | 1280x720 | 11 | 0 | 0 | 5 | 0 | 0 | BUTTON_TRIGGER_MISSING 3, ACCIDENTAL_CLIPPING 1, INVALID_SIZE 1 | bcf23c3a38eb |
| z_court4_1920 | `zin_court_window` | chancery | 1920x1080 | 11 | 0 | 0 | 5 | 0 | 0 | BUTTON_TRIGGER_MISSING 3, ACCIDENTAL_CLIPPING 1, INVALID_SIZE 1 | 82ce65899bfa |
| z_court4_2560 | `zin_court_window` | chancery | 2560x1440 | 11 | 0 | 0 | 5 | 0 | 0 | BUTTON_TRIGGER_MISSING 3, ACCIDENTAL_CLIPPING 1, INVALID_SIZE 1 | c276ca4fe61e |
| z_court4_long | `zin_court_window` | chancery | 1920x1080 | 11 | 0 | 0 | 5 | 0 | 0 | BUTTON_TRIGGER_MISSING 3, ACCIDENTAL_CLIPPING 2, INVALID_SIZE 1 | 82ce65899bfa |
| z_court_btn_1280 | `zin_court_button_window` | chancery | 1280x720 | 1 | 0 | 0 | 0 | 0 | 0 | REFERENCE_UNRESOLVED 7 | 8a85786bf70a |
| z_court_btn_1920 | `zin_court_button_window` | chancery | 1920x1080 | 1 | 0 | 0 | 0 | 0 | 0 | REFERENCE_UNRESOLVED 7 | a05980e220b7 |
| z_court_btn_2560 | `zin_court_button_window` | chancery | 2560x1440 | 1 | 0 | 0 | 0 | 0 | 0 | REFERENCE_UNRESOLVED 7 | 4d3344d518be |
| z_court_btn_long | `zin_court_button_window` | chancery | 1920x1080 | 1 | 0 | 0 | 0 | 0 | 0 | REFERENCE_UNRESOLVED 7 | a05980e220b7 |
| z_dominion1_1280 | `zin_dominion_window` | chancery | 1280x720 | 11 | 0 | 0 | 4 | 0 | 0 | BUTTON_TRIGGER_MISSING 3, ACCIDENTAL_CLIPPING 1, INVALID_SIZE 1 | c5f7abedc39e |
| z_dominion1_1920 | `zin_dominion_window` | chancery | 1920x1080 | 11 | 0 | 0 | 4 | 0 | 0 | BUTTON_TRIGGER_MISSING 3, ACCIDENTAL_CLIPPING 1, INVALID_SIZE 1 | 992117ccfa1c |
| z_dominion1_long | `zin_dominion_window` | chancery | 1920x1080 | 11 | 0 | 0 | 4 | 0 | 0 | BUTTON_TRIGGER_MISSING 3, ACCIDENTAL_CLIPPING 1, INVALID_SIZE 1, UNRESOLVED_DYNAMIC_VALUE 1 | 992117ccfa1c |
| z_dominion2_1920 | `zin_dominion_window` | chancery | 1920x1080 | 12 | 0 | 0 | 6 | 0 | 0 | BUTTON_TRIGGER_MISSING 3, ACCIDENTAL_CLIPPING 1, INVALID_SIZE 1 | ebae772db585 |
| z_horde_1280 | `zin_horde_window` | chancery | 1280x720 | 14 | 0 | 0 | 7 | 0 | 0 | BUTTON_TRIGGER_MISSING 1, UNRESOLVED_DYNAMIC_VALUE 4 | ae7108aaed2c |
| z_horde_1920 | `zin_horde_window` | chancery | 1920x1080 | 14 | 0 | 0 | 7 | 0 | 0 | BUTTON_TRIGGER_MISSING 1, UNRESOLVED_DYNAMIC_VALUE 4 | 072ccc7e9290 |
| z_horde_long | `zin_horde_window` | chancery | 1920x1080 | 14 | 0 | 0 | 7 | 0 | 0 | BUTTON_TRIGGER_MISSING 1, UNRESOLVED_DYNAMIC_VALUE 5 | 072ccc7e9290 |
| z_inlay_1280 | `zin_interim_inlay_window` | chronicle | 1280x720 | 0 | 0 | 0 | 0 | 0 | 0 | SCRIPTED_CONTEXT_UNKNOWN 1 | 8366fbcb5c0a |
| z_inlay_1920 | `zin_interim_inlay_window` | chronicle | 1920x1080 | 0 | 0 | 0 | 0 | 0 | 0 | SCRIPTED_CONTEXT_UNKNOWN 1 | 397d44367a8a |
| z_inlay_long | `zin_interim_inlay_window` | chronicle | 1920x1080 | 0 | 0 | 0 | 0 | 0 | 0 | SCRIPTED_CONTEXT_UNKNOWN 1 | 397d44367a8a |
| z_mistake1_1280 | `zin_mistake_window` | chancery | 1280x720 | 12 | 0 | 0 | 3 | 0 | 0 | BUTTON_TRIGGER_MISSING 2, UNRESOLVED_DYNAMIC_VALUE 1, UNRESOLVED_VISIBILITY_OVERLAP 2 | fad39a0ada22 |
| z_mistake1_1920 | `zin_mistake_window` | chancery | 1920x1080 | 12 | 0 | 0 | 3 | 0 | 0 | BUTTON_TRIGGER_MISSING 2, UNRESOLVED_DYNAMIC_VALUE 1, UNRESOLVED_VISIBILITY_OVERLAP 2 | bc63abb9bc5b |
| z_mistake1_2560 | `zin_mistake_window` | chancery | 2560x1440 | 12 | 0 | 0 | 3 | 0 | 0 | BUTTON_TRIGGER_MISSING 2, UNRESOLVED_DYNAMIC_VALUE 1, UNRESOLVED_VISIBILITY_OVERLAP 2 | 59c6a9e33b57 |
| z_mistake1_long | `zin_mistake_window` | chancery | 1920x1080 | 12 | 0 | 0 | 3 | 0 | 0 | BUTTON_TRIGGER_MISSING 2, UNRESOLVED_DYNAMIC_VALUE 1, UNRESOLVED_VISIBILITY_OVERLAP 2, ACCIDENTAL_CLIPPING 1 | bc63abb9bc5b |
| z_mistake2_1920 | `zin_mistake_window` | chancery | 1920x1080 | 2 | 0 | 0 | 0 | 0 | 0 | BUTTON_TRIGGER_MISSING 2, ACCIDENTAL_CLIPPING 2, INVALID_SIZE 1 | 1eb3a639a5e5 |
| z_realm_1280 | `zin_realm_window` | chancery | 1280x720 | 7 | 0 | 0 | 6 | 0 | 0 | AI_EQUIVALENT_MISSING 1, UNRESOLVED_DYNAMIC_VALUE 3, BUTTON_TRIGGER_MISSING 1 | 94d3547f7400 |
| z_realm_1920 | `zin_realm_window` | chancery | 1920x1080 | 7 | 0 | 0 | 6 | 0 | 0 | AI_EQUIVALENT_MISSING 1, UNRESOLVED_DYNAMIC_VALUE 3, BUTTON_TRIGGER_MISSING 1 | af834a597359 |
| z_realm_2560 | `zin_realm_window` | chancery | 2560x1440 | 7 | 0 | 0 | 6 | 0 | 0 | AI_EQUIVALENT_MISSING 1, UNRESOLVED_DYNAMIC_VALUE 3, BUTTON_TRIGGER_MISSING 1 | a9e41dee67f0 |
| z_realm_btn_1280 | `zin_realm_button_window` | chancery | 1280x720 | 1 | 0 | 0 | 0 | 0 | 0 | AI_EQUIVALENT_MISSING 1, BUTTON_TRIGGER_MISSING 1 | b6c29139c777 |
| z_realm_btn_1920 | `zin_realm_button_window` | chancery | 1920x1080 | 1 | 0 | 0 | 0 | 0 | 0 | AI_EQUIVALENT_MISSING 1, BUTTON_TRIGGER_MISSING 1 | d49d464f4d2d |
| z_realm_btn_2560 | `zin_realm_button_window` | chancery | 2560x1440 | 1 | 0 | 0 | 0 | 0 | 0 | AI_EQUIVALENT_MISSING 1, BUTTON_TRIGGER_MISSING 1 | f8f8d900aba1 |
| z_realm_btn_long | `zin_realm_button_window` | chancery | 1920x1080 |  |  |  |  |  |  |  |  |
| z_realm_long | `zin_realm_window` | chancery | 1920x1080 | 7 | 0 | 0 | 6 | 0 | 0 | AI_EQUIVALENT_MISSING 1, UNRESOLVED_DYNAMIC_VALUE 4, BUTTON_TRIGGER_MISSING 1 | af834a597359 |
| z_se1_1280 | `zin_super_event_window` | chancery | 1280x720 | 6 | 0 | 0 | 4 | 0 | 0 | MISSING_TEXTURE 1, TEXTURE_UNSUPPORTED 1, UNRESOLVED_DYNAMIC_VALUE 1, ACCIDENTAL_CLIPPING 1, INVALID_SIZE 1 | 837abf3abefe |
| z_se1_1920 | `zin_super_event_window` | chancery | 1920x1080 | 6 | 0 | 0 | 4 | 0 | 0 | MISSING_TEXTURE 1, TEXTURE_UNSUPPORTED 1, UNRESOLVED_DYNAMIC_VALUE 1, ACCIDENTAL_CLIPPING 1, INVALID_SIZE 1 | b1028b7bcd99 |
| z_se1_2560 | `zin_super_event_window` | chancery | 2560x1440 | 6 | 0 | 0 | 4 | 0 | 0 | MISSING_TEXTURE 1, TEXTURE_UNSUPPORTED 1, UNRESOLVED_DYNAMIC_VALUE 1, ACCIDENTAL_CLIPPING 1, INVALID_SIZE 1 | 4bb4dca9f61e |
| z_se1_long | `zin_super_event_window` | chancery | 1920x1080 | 6 | 0 | 0 | 4 | 0 | 0 | MISSING_TEXTURE 1, TEXTURE_UNSUPPORTED 2, UNRESOLVED_DYNAMIC_VALUE 1, ACCIDENTAL_CLIPPING 1, INVALID_SIZE 1 | b1028b7bcd99 |
| z_se5_1280 | `zin_super_event_window` | chancery | 1280x720 | 7 | 0 | 0 | 0 | 0 | 0 | ACCIDENTAL_CLIPPING 3, INVALID_SIZE 1, TEXTURE_UNSUPPORTED 1 | f113151c2e77 |
| z_se5_1920 | `zin_super_event_window` | chancery | 1920x1080 | 7 | 0 | 0 | 0 | 0 | 0 | ACCIDENTAL_CLIPPING 3, INVALID_SIZE 1, TEXTURE_UNSUPPORTED 1 | 10e920cf4fcf |
| z_se5_long | `zin_super_event_window` | chancery | 1920x1080 | 7 | 0 | 0 | 0 | 0 | 0 | ACCIDENTAL_CLIPPING 3, INVALID_SIZE 2, TEXTURE_UNSUPPORTED 1 | 10e920cf4fcf |
| z_strait1_1280 | `zin_strait_window` | chancery | 1280x720 | 10 | 0 | 0 | 4 | 0 | 0 | BUTTON_TRIGGER_MISSING 3, ACCIDENTAL_CLIPPING 1, INVALID_SIZE 1 | aea635287160 |
| z_strait1_1920 | `zin_strait_window` | chancery | 1920x1080 | 10 | 0 | 0 | 4 | 0 | 0 | BUTTON_TRIGGER_MISSING 3, ACCIDENTAL_CLIPPING 1, INVALID_SIZE 1 | 506f9492876c |
| z_strait1_long | `zin_strait_window` | chancery | 1920x1080 | 10 | 0 | 0 | 4 | 0 | 0 | BUTTON_TRIGGER_MISSING 4, ACCIDENTAL_CLIPPING 1, INVALID_SIZE 1 | 506f9492876c |
| z_strait2_1920 | `zin_strait_window` | chancery | 1920x1080 | 11 | 0 | 0 | 5 | 0 | 0 | BUTTON_TRIGGER_MISSING 3, ACCIDENTAL_CLIPPING 1, INVALID_SIZE 1 | ce488ee7d252 |
| z_techtree_1280 | `countrytechtreeview` | chronicle | 1280x720 | 52 | 0 | 6 | 0 | 0 | 0 | CONFLICTING_CLICK_REGIONS 18 | fd3ccd40bb9d |
| z_techtree_1920 | `countrytechtreeview` | chronicle | 1920x1080 | 78 | 0 | 6 | 0 | 0 | 0 | CONFLICTING_CLICK_REGIONS 18 | c969aa1d849b |
| z_techtree_long | `countrytechtreeview` | chronicle | 1920x1080 | 78 | 0 | 6 | 0 | 0 | 0 | CONFLICTING_CLICK_REGIONS 18 | c969aa1d849b |
| z_watch1_1280 | `zin_watch_window` | chancery | 1280x720 | 11 | 0 | 0 | 6 | 0 | 0 | BUTTON_TRIGGER_MISSING 2, UNRESOLVED_DYNAMIC_VALUE 1, ACCIDENTAL_CLIPPING 1, VISIBLE_OVERLAP 1 | 8287a62d0936 |
| z_watch1_1920 | `zin_watch_window` | chancery | 1920x1080 | 11 | 0 | 0 | 6 | 0 | 0 | BUTTON_TRIGGER_MISSING 2, UNRESOLVED_DYNAMIC_VALUE 1, ACCIDENTAL_CLIPPING 1, VISIBLE_OVERLAP 1 | b20f464d5aa8 |
| z_watch1_long | `zin_watch_window` | chancery | 1920x1080 | 11 | 0 | 0 | 6 | 0 | 0 | BUTTON_TRIGGER_MISSING 2, UNRESOLVED_DYNAMIC_VALUE 1, ACCIDENTAL_CLIPPING 1, VISIBLE_OVERLAP 2 | b20f464d5aa8 |
| z_watch2_1920 | `zin_watch_window` | chancery | 1920x1080 | 2 | 0 | 0 | 0 | 0 | 0 | BUTTON_TRIGGER_MISSING 2, ACCIDENTAL_CLIPPING 2, INVALID_SIZE 1 | 7ac25151d291 |
