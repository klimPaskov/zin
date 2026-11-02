# Visual review of the assembled game (in game, Linux harness)

The UI lanes reviewed their pieces as offline renders and contact sheets. Nothing was reviewed assembled in the running game. The owner (2 November 2026): "this looks ugly actually. Its not final right? So you actually have to preview everything that is assembled, etc to make sure nothing looks like weird or misplaced". This file is the review: every screen captured in the Linux harness at 1600 x 900, each finding with its fix and its state.

## How screens are captured

`tools/acceptance/zin-live.sh start` (no Steam process may run; the game gets a private HOME and the xdg-open stand-ins), clicks with `xdotool`, captures with `zin-live.sh capture`. Keep the game in one long WSL session (a background `wsl.exe ... ; sleep` holds it); a game started by a WSL call that then ends is torn down. Frontend positions at 1600 x 900: Single Player (800, 343), New Game (800, 431), Select Country (884, 786), START (1458, 858).

## Findings, first pass (1.19.4.1, today's build)

| Screen | Finding | Fix | State |
| --- | --- | --- | --- |
| Main menu | The button plates are a dark, noisy rust texture with uneven title lettering; the version line crowds the frame's lower edge; Multiplayer's grey knob does not match the brass ones. Owner: "looks ugly". | Redesign the menu panel (lane W6) with a cleaner plate, even type and room for the version line; review in game. | open |
| Country selection | The region tabs truncate their labels ("Cold L", "West l", "Dark l", "Magica"); "Middle" sits outside the red tab strip. | Size the tabs to their labels or shorten the labels; one strip. | open |
| Country selection | "Other countries" shows an empty portrait and a torn orange placeholder flag. | Give it its own picture and frame. | open |
| Country selection | A wide empty band between the minor-flag row and the information panel. | Rebalance the layout. | open |
| Country selection | The centre panel mixes a bare crown, two identical round crown medallions and a square market picture. | One shape family, no duplicates. | open |
| Country selection | The leader portrait appears twice (top row and centre). | Keep one. | open |
| Country selection | Worshipdom's leader portrait resembles a classic depiction of Jesus. | Owner's review: the god-king should read as ZIN's own figure. | for the owner |
| Setup map | Empty frames: the leader portrait box and the round emblem in the country panel, a square beside the country name, a round frame beside START. | Find the missing sprites or data (portrait, ideology emblem) and fill or hide the frames. | open |
| Map | The natural place names do not show: the game keeps the first of two `localisation/replace` files, and the map tool's world_l_english.yml sorts first. | Names file renamed 00_zin_world_names_l_english.yml (world_names.mjs). Lasting fix: hand the names to create_world (HOI4 Agent Tools 4.8.0, ZR-22). | fixed in source, not yet applied or seen |
| Map | Aenor's inland lake renders as a flat dark brown. | Check the lake's terrain and water colour in the map output. | open |
| Map | Two empty square frames at the bottom centre. | Identify the widget (likely a ZIN scripted GUI) and fill or hide. | open |
| Error log | 8,868 lines at load. 8,275 were scripted localisation written with `localisation_key` (the engine reads `localization_key`): the Chronicle and the realm page lost every text. | chronicle.mjs and ui_chancery.mjs write localization_key; the Chronicle test refuses the wrong spelling. | fixed in source, not yet applied |
| Error log | The remaining ~590 lines: `supply_factor` misuse in technologies (116), tech_mod lines (~130), InitPostRead failures (51), special-project prototype rewards (26), invalid triggers and effects, advisor roles with effects, raids requirements. | Work through by file with the hoi4-investigate skill. | open |
| DLC | The WSL game has no Steam client library, so it confirms no DLC ("Active DLC Count: 0"): DLC systems cannot be seen in these runs. | Owner decision needed for DLC-dependent checks. | open |

## Still to capture

The in-game windows, one by one: politics, diplomacy, decisions (all categories), research and doctrines, focus tree, production, construction, logistics, trade, army and navy, intelligence, the Chronicle, the realm page, super-event window, event and news windows, tooltips over the top bar, the Aoaz bar, the options menu, the loading screens.
