# UI review metrics

Offline renders, tool-generated (hoi4.gui_render 4.6.1); check 19 text.render_metrics of the design system (§2.2, §9). 56 renders, 0 errors. Thresholds: contrast 4.5:1 under 20 px and 3:1 from 20 px; ground deviation 0.06. Engine-filled keys appear as raw keys in the offline model (audit §1, fidelity limits).

Totals: 716 text elements; contrast 32, ground 84, raw keys 429, overflow 25, under 16 px 0.

| Render | Window | Theme | Size | Texts | Contrast | Ground | Raw keys | Overflow | Under 16 px | Diagnostics | PNG sha256 (first 12) |
| --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| z_accord_1280 | `zin_accord_window` | chancery | 1280x720 | 9 | 0 | 0 | 8 | 0 | 0 | BUTTON_TRIGGER_MISSING 1, ACCIDENTAL_CLIPPING 1, CHILD_OUTSIDE_CLIPPED_PARENT 1, UNRESOLVED_DYNAMIC_VALUE 1, VISIBLE_OVERLAP 1 | 1d6d25451d63 |
| z_accord_1920 | `zin_accord_window` | chancery | 1920x1080 | 9 | 0 | 0 | 8 | 0 | 0 | BUTTON_TRIGGER_MISSING 1, ACCIDENTAL_CLIPPING 1, CHILD_OUTSIDE_CLIPPED_PARENT 1, UNRESOLVED_DYNAMIC_VALUE 1, VISIBLE_OVERLAP 1 | 58f39513865d |
| z_accord_long | `zin_accord_window` | chancery | 1920x1080 | 9 | 0 | 0 | 8 | 0 | 0 | BUTTON_TRIGGER_MISSING 1, ACCIDENTAL_CLIPPING 1, CHILD_OUTSIDE_CLIPPED_PARENT 1, UNRESOLVED_DYNAMIC_VALUE 1, VISIBLE_OVERLAP 2 | 58f39513865d |
| z_aoaz_bar_1280 | `zin_aoaz_bar_window` | banner_hall | 1280x720 | 18 | 0 | 16 | 12 | 7 | 0 | VISIBLE_OVERLAP 1, UNRESOLVED_DYNAMIC_VALUE 1, ACCIDENTAL_CLIPPING 2, INVALID_SIZE 1 | 774bdc6cc647 |
| z_aoaz_bar_1920 | `zin_aoaz_bar_window` | banner_hall | 1920x1080 | 18 | 0 | 16 | 12 | 7 | 0 | VISIBLE_OVERLAP 1, UNRESOLVED_DYNAMIC_VALUE 1, ACCIDENTAL_CLIPPING 2, INVALID_SIZE 1 | e1d9b110d6d6 |
| z_aoaz_bar_long | `zin_aoaz_bar_window` | banner_hall | 1920x1080 | 18 | 0 | 16 | 12 | 7 | 0 | VISIBLE_OVERLAP 1, UNRESOLVED_DYNAMIC_VALUE 1, ACCIDENTAL_CLIPPING 2, INVALID_SIZE 2 | e1d9b110d6d6 |
| z_council1_1280 | `zin_council_window` | chancery | 1280x720 | 8 | 1 | 1 | 1 | 1 | 0 | BUTTON_TRIGGER_MISSING 1, ACCIDENTAL_CLIPPING 2, CHILD_OUTSIDE_CLIPPED_PARENT 1, INVALID_SIZE 1 | eeb2635bc85a |
| z_council1_1920 | `zin_council_window` | chancery | 1920x1080 | 8 | 1 | 1 | 1 | 1 | 0 | BUTTON_TRIGGER_MISSING 1, ACCIDENTAL_CLIPPING 2, CHILD_OUTSIDE_CLIPPED_PARENT 1, INVALID_SIZE 1 | 169f4af43fb7 |
| z_council1_2560 | `zin_council_window` | chancery | 2560x1440 | 8 | 1 | 1 | 1 | 1 | 0 | BUTTON_TRIGGER_MISSING 1, ACCIDENTAL_CLIPPING 2, CHILD_OUTSIDE_CLIPPED_PARENT 1, INVALID_SIZE 1 | 8b940dc4ce94 |
| z_council1_long | `zin_council_window` | chancery | 1920x1080 | 8 | 1 | 1 | 1 | 1 | 0 | BUTTON_TRIGGER_MISSING 1, ACCIDENTAL_CLIPPING 2, CHILD_OUTSIDE_CLIPPED_PARENT 1, INVALID_SIZE 1, VISIBLE_OVERLAP 1 | 169f4af43fb7 |
| z_council2_1920 | `zin_council_window` | chancery | 1920x1080 | 10 | 1 | 1 | 5 | 0 | 0 | BUTTON_TRIGGER_MISSING 1, ACCIDENTAL_CLIPPING 2, CHILD_OUTSIDE_CLIPPED_PARENT 1, INVALID_SIZE 1 | 605a8cf90737 |
| z_council3_1920 | `zin_council_window` | chancery | 1920x1080 | 10 | 1 | 1 | 5 | 0 | 0 | BUTTON_TRIGGER_MISSING 1, ACCIDENTAL_CLIPPING 2, CHILD_OUTSIDE_CLIPPED_PARENT 1, INVALID_SIZE 1 | 9f96551d650d |
| z_council4_1920 | `zin_council_window` | chancery | 1920x1080 | 27 | 1 | 1 | 19 | 0 | 0 | BUTTON_TRIGGER_MISSING 1, ACCIDENTAL_CLIPPING 2, CHILD_OUTSIDE_CLIPPED_PARENT 1, INVALID_SIZE 1 | 302513d4c384 |
| z_court1_1280 | `zin_court_window` | chancery | 1280x720 | 10 | 1 | 1 | 4 | 0 | 0 | BUTTON_TRIGGER_MISSING 1, ACCIDENTAL_CLIPPING 2, CHILD_OUTSIDE_CLIPPED_PARENT 1, INVALID_SIZE 1 | a918e4140215 |
| z_court1_1920 | `zin_court_window` | chancery | 1920x1080 | 10 | 1 | 1 | 4 | 0 | 0 | BUTTON_TRIGGER_MISSING 1, ACCIDENTAL_CLIPPING 2, CHILD_OUTSIDE_CLIPPED_PARENT 1, INVALID_SIZE 1 | 617ea4edf4d9 |
| z_court1_2560 | `zin_court_window` | chancery | 2560x1440 | 10 | 1 | 1 | 4 | 0 | 0 | BUTTON_TRIGGER_MISSING 1, ACCIDENTAL_CLIPPING 2, CHILD_OUTSIDE_CLIPPED_PARENT 1, INVALID_SIZE 1 | 60b839d4f89f |
| z_court1_long | `zin_court_window` | chancery | 1920x1080 | 10 | 1 | 1 | 4 | 0 | 0 | BUTTON_TRIGGER_MISSING 1, ACCIDENTAL_CLIPPING 2, CHILD_OUTSIDE_CLIPPED_PARENT 1, INVALID_SIZE 1, VISIBLE_OVERLAP 1 | 617ea4edf4d9 |
| z_court2_1280 | `zin_court_window` | chancery | 1280x720 | 42 | 1 | 1 | 31 | 0 | 0 | BUTTON_TRIGGER_MISSING 1, ACCIDENTAL_CLIPPING 2, CHILD_OUTSIDE_CLIPPED_PARENT 1, INVALID_SIZE 1 | c5445f70db08 |
| z_court2_1920 | `zin_court_window` | chancery | 1920x1080 | 42 | 1 | 1 | 31 | 0 | 0 | BUTTON_TRIGGER_MISSING 1, ACCIDENTAL_CLIPPING 2, CHILD_OUTSIDE_CLIPPED_PARENT 1, INVALID_SIZE 1 | 331ba153cd28 |
| z_court2_2560 | `zin_court_window` | chancery | 2560x1440 | 42 | 1 | 1 | 31 | 0 | 0 | BUTTON_TRIGGER_MISSING 1, ACCIDENTAL_CLIPPING 2, CHILD_OUTSIDE_CLIPPED_PARENT 1, INVALID_SIZE 1 | b3d5457cc079 |
| z_court2_long | `zin_court_window` | chancery | 1920x1080 | 42 | 1 | 1 | 31 | 0 | 0 | BUTTON_TRIGGER_MISSING 1, ACCIDENTAL_CLIPPING 3, CHILD_OUTSIDE_CLIPPED_PARENT 1, INVALID_SIZE 1 | 331ba153cd28 |
| z_court3_1280 | `zin_court_window` | chancery | 1280x720 | 11 | 0 | 1 | 5 | 0 | 0 | BUTTON_TRIGGER_MISSING 1, ACCIDENTAL_CLIPPING 2, CHILD_OUTSIDE_CLIPPED_PARENT 1, INVALID_SIZE 1 | eaae15b7a910 |
| z_court3_1920 | `zin_court_window` | chancery | 1920x1080 | 11 | 0 | 1 | 5 | 0 | 0 | BUTTON_TRIGGER_MISSING 1, ACCIDENTAL_CLIPPING 2, CHILD_OUTSIDE_CLIPPED_PARENT 1, INVALID_SIZE 1 | bcc278ecdffe |
| z_court3_2560 | `zin_court_window` | chancery | 2560x1440 | 11 | 0 | 1 | 5 | 0 | 0 | BUTTON_TRIGGER_MISSING 1, ACCIDENTAL_CLIPPING 2, CHILD_OUTSIDE_CLIPPED_PARENT 1, INVALID_SIZE 1 | 8c1eb29d1d3a |
| z_court3_long | `zin_court_window` | chancery | 1920x1080 | 11 | 0 | 1 | 5 | 0 | 0 | BUTTON_TRIGGER_MISSING 1, ACCIDENTAL_CLIPPING 3, CHILD_OUTSIDE_CLIPPED_PARENT 1, INVALID_SIZE 1 | bcc278ecdffe |
| z_court4_1280 | `zin_court_window` | chancery | 1280x720 | 11 | 1 | 1 | 4 | 0 | 0 | BUTTON_TRIGGER_MISSING 1, ACCIDENTAL_CLIPPING 2, CHILD_OUTSIDE_CLIPPED_PARENT 1, INVALID_SIZE 1 | 7ba42c52fd93 |
| z_court4_1920 | `zin_court_window` | chancery | 1920x1080 | 11 | 1 | 1 | 4 | 0 | 0 | BUTTON_TRIGGER_MISSING 1, ACCIDENTAL_CLIPPING 2, CHILD_OUTSIDE_CLIPPED_PARENT 1, INVALID_SIZE 1 | c80f3d76bfc8 |
| z_court4_2560 | `zin_court_window` | chancery | 2560x1440 | 11 | 1 | 1 | 4 | 0 | 0 | BUTTON_TRIGGER_MISSING 1, ACCIDENTAL_CLIPPING 2, CHILD_OUTSIDE_CLIPPED_PARENT 1, INVALID_SIZE 1 | 864ef8095580 |
| z_court4_long | `zin_court_window` | chancery | 1920x1080 | 11 | 1 | 1 | 4 | 0 | 0 | BUTTON_TRIGGER_MISSING 1, ACCIDENTAL_CLIPPING 3, CHILD_OUTSIDE_CLIPPED_PARENT 1, INVALID_SIZE 1 | c80f3d76bfc8 |
| z_dominion1_1280 | `zin_dominion_window` | chancery | 1280x720 | 8 | 1 | 1 | 4 | 0 | 0 | BUTTON_TRIGGER_MISSING 1, ACCIDENTAL_CLIPPING 2, CHILD_OUTSIDE_CLIPPED_PARENT 1, INVALID_SIZE 1 | 273e77c1295f |
| z_dominion1_1920 | `zin_dominion_window` | chancery | 1920x1080 | 8 | 1 | 1 | 4 | 0 | 0 | BUTTON_TRIGGER_MISSING 1, ACCIDENTAL_CLIPPING 2, CHILD_OUTSIDE_CLIPPED_PARENT 1, INVALID_SIZE 1 | 2ffb230d9544 |
| z_dominion1_long | `zin_dominion_window` | chancery | 1920x1080 | 8 | 1 | 1 | 4 | 0 | 0 | BUTTON_TRIGGER_MISSING 1, ACCIDENTAL_CLIPPING 2, CHILD_OUTSIDE_CLIPPED_PARENT 1, INVALID_SIZE 1, VISIBLE_OVERLAP 1 | 2ffb230d9544 |
| z_dominion2_1920 | `zin_dominion_window` | chancery | 1920x1080 | 12 | 1 | 1 | 6 | 0 | 0 | BUTTON_TRIGGER_MISSING 1, ACCIDENTAL_CLIPPING 2, CHILD_OUTSIDE_CLIPPED_PARENT 1, INVALID_SIZE 1 | f032bfbd44e7 |
| z_horde2_1920 | `zin_horde_window` | chancery | 1920x1080 | 40 | 1 | 1 | 30 | 0 | 0 | BUTTON_TRIGGER_MISSING 1, ACCIDENTAL_CLIPPING 2, CHILD_OUTSIDE_CLIPPED_PARENT 1, INVALID_SIZE 1 | 0986fcab1add |
| z_horde_1280 | `zin_horde_window` | chancery | 1280x720 | 15 | 1 | 1 | 7 | 0 | 0 | BUTTON_TRIGGER_MISSING 1, ACCIDENTAL_CLIPPING 2, CHILD_OUTSIDE_CLIPPED_PARENT 1, INVALID_SIZE 1 | 56fbba7bdf3f |
| z_horde_1920 | `zin_horde_window` | chancery | 1920x1080 | 15 | 1 | 1 | 7 | 0 | 0 | BUTTON_TRIGGER_MISSING 1, ACCIDENTAL_CLIPPING 2, CHILD_OUTSIDE_CLIPPED_PARENT 1, INVALID_SIZE 1 | 5fbbe379e540 |
| z_horde_long | `zin_horde_window` | chancery | 1920x1080 | 15 | 1 | 1 | 7 | 0 | 0 | BUTTON_TRIGGER_MISSING 1, ACCIDENTAL_CLIPPING 2, CHILD_OUTSIDE_CLIPPED_PARENT 1, INVALID_SIZE 1, VISIBLE_OVERLAP 1 | 5fbbe379e540 |
| z_inlay_1280 | `zin_interim_inlay_window` | chronicle | 1280x720 | 0 | 0 | 0 | 0 | 0 | 0 | SCRIPTED_CONTEXT_UNKNOWN 1 | 8366fbcb5c0a |
| z_inlay_1920 | `zin_interim_inlay_window` | chronicle | 1920x1080 | 0 | 0 | 0 | 0 | 0 | 0 | SCRIPTED_CONTEXT_UNKNOWN 1 | 397d44367a8a |
| z_inlay_long | `zin_interim_inlay_window` | chronicle | 1920x1080 | 0 | 0 | 0 | 0 | 0 | 0 | SCRIPTED_CONTEXT_UNKNOWN 1 | 397d44367a8a |
| z_mistake1_1280 | `zin_mistake_window` | chancery | 1280x720 | 9 | 0 | 0 | 6 | 0 | 0 | BUTTON_TRIGGER_MISSING 1, ACCIDENTAL_CLIPPING 1, CHILD_OUTSIDE_CLIPPED_PARENT 1, UNRESOLVED_DYNAMIC_VALUE 1, UNRESOLVED_VISIBILITY_OVERLAP 1 | b38596f2b700 |
| z_mistake1_1920 | `zin_mistake_window` | chancery | 1920x1080 | 9 | 0 | 0 | 6 | 0 | 0 | BUTTON_TRIGGER_MISSING 1, ACCIDENTAL_CLIPPING 1, CHILD_OUTSIDE_CLIPPED_PARENT 1, UNRESOLVED_DYNAMIC_VALUE 1, UNRESOLVED_VISIBILITY_OVERLAP 1 | 99af756cddda |
| z_mistake1_2560 | `zin_mistake_window` | chancery | 2560x1440 | 9 | 0 | 0 | 6 | 0 | 0 | BUTTON_TRIGGER_MISSING 1, ACCIDENTAL_CLIPPING 1, CHILD_OUTSIDE_CLIPPED_PARENT 1, UNRESOLVED_DYNAMIC_VALUE 1, UNRESOLVED_VISIBILITY_OVERLAP 1 | 0c704c472ec5 |
| z_mistake1_long | `zin_mistake_window` | chancery | 1920x1080 | 9 | 0 | 0 | 6 | 0 | 0 | BUTTON_TRIGGER_MISSING 1, ACCIDENTAL_CLIPPING 1, CHILD_OUTSIDE_CLIPPED_PARENT 1, UNRESOLVED_DYNAMIC_VALUE 1, UNRESOLVED_VISIBILITY_OVERLAP 2 | 99af756cddda |
| z_realm_1280 | `zin_realm_window` | chancery | 1280x720 | 7 | 0 | 0 | 6 | 0 | 0 | UNRESOLVED_DYNAMIC_VALUE 4, BUTTON_TRIGGER_MISSING 1 | 08e2d6db3ccc |
| z_realm_1920 | `zin_realm_window` | chancery | 1920x1080 | 7 | 0 | 0 | 6 | 0 | 0 | UNRESOLVED_DYNAMIC_VALUE 4, BUTTON_TRIGGER_MISSING 1 | 341bf4a2b96b |
| z_realm_2560 | `zin_realm_window` | chancery | 2560x1440 | 7 | 0 | 0 | 6 | 0 | 0 | UNRESOLVED_DYNAMIC_VALUE 4, BUTTON_TRIGGER_MISSING 1 | d7300f9c1ca9 |
| z_realm_long | `zin_realm_window` | chancery | 1920x1080 | 7 | 0 | 0 | 6 | 0 | 0 | UNRESOLVED_DYNAMIC_VALUE 5, BUTTON_TRIGGER_MISSING 1 | 341bf4a2b96b |
| z_strait1_1280 | `zin_strait_window` | chancery | 1280x720 | 9 | 1 | 1 | 4 | 0 | 0 | BUTTON_TRIGGER_MISSING 1, ACCIDENTAL_CLIPPING 2, CHILD_OUTSIDE_CLIPPED_PARENT 1, INVALID_SIZE 1 | 5e7ebd9dc881 |
| z_strait1_1920 | `zin_strait_window` | chancery | 1920x1080 | 9 | 1 | 1 | 4 | 0 | 0 | BUTTON_TRIGGER_MISSING 1, ACCIDENTAL_CLIPPING 2, CHILD_OUTSIDE_CLIPPED_PARENT 1, INVALID_SIZE 1 | 7b3b6d9d90f5 |
| z_strait1_long | `zin_strait_window` | chancery | 1920x1080 | 9 | 1 | 1 | 4 | 0 | 0 | BUTTON_TRIGGER_MISSING 1, ACCIDENTAL_CLIPPING 2, CHILD_OUTSIDE_CLIPPED_PARENT 1, INVALID_SIZE 1, VISIBLE_OVERLAP 1 | 7b3b6d9d90f5 |
| z_strait2_1920 | `zin_strait_window` | chancery | 1920x1080 | 11 | 1 | 1 | 5 | 0 | 0 | BUTTON_TRIGGER_MISSING 1, ACCIDENTAL_CLIPPING 2, CHILD_OUTSIDE_CLIPPED_PARENT 1, INVALID_SIZE 1 | f5aa7185671f |
| z_strait3_1920 | `zin_strait_window` | chancery | 1920x1080 | 13 | 1 | 1 | 8 | 0 | 0 | BUTTON_TRIGGER_MISSING 1, ACCIDENTAL_CLIPPING 2, CHILD_OUTSIDE_CLIPPED_PARENT 1, INVALID_SIZE 1 | 57f25404cc0b |
| z_watch1_1280 | `zin_watch_window` | chancery | 1280x720 | 8 | 0 | 0 | 6 | 0 | 0 | BUTTON_TRIGGER_MISSING 1, ACCIDENTAL_CLIPPING 1, CHILD_OUTSIDE_CLIPPED_PARENT 1, UNRESOLVED_DYNAMIC_VALUE 1, VISIBLE_OVERLAP 1 | 1e25303952b5 |
| z_watch1_1920 | `zin_watch_window` | chancery | 1920x1080 | 8 | 0 | 0 | 6 | 0 | 0 | BUTTON_TRIGGER_MISSING 1, ACCIDENTAL_CLIPPING 1, CHILD_OUTSIDE_CLIPPED_PARENT 1, UNRESOLVED_DYNAMIC_VALUE 1, VISIBLE_OVERLAP 1 | 2767ebbfcd0c |
| z_watch1_long | `zin_watch_window` | chancery | 1920x1080 | 8 | 0 | 0 | 6 | 0 | 0 | BUTTON_TRIGGER_MISSING 1, ACCIDENTAL_CLIPPING 1, CHILD_OUTSIDE_CLIPPED_PARENT 1, UNRESOLVED_DYNAMIC_VALUE 1, VISIBLE_OVERLAP 2 | 2767ebbfcd0c |
