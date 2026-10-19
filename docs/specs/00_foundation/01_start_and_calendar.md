# Start date and calendar

**Status:** Ready. Reviewed 19 October 2026 against CONVENTIONS "Status"; integrated 19 October 2026. **Priority:** 2. **Phase:** 2.

## Purpose

Move the game from 1936 to the Fourth Age of Erdae, so every date the player reads is an Erdae date.

## Lore basis

- Owner, 18 October 2026: the campaign starts with the Golden King on the throne, Eindil not yet appeared, Afrit unrevealed, and the world seemingly at peace.
- Vault, *Fourth Age Chronology* (proposed): the Fourth Age is counted from the first restored king; the start is **1 Thaw, 4A 1748**; Eindil wakes about 4A 1749; the historical coronation falls in 4A 1760. Month names are proposed in the same note.

## Design

| Item | Value |
| --- | --- |
| Start | `1748.3.1.12`, shown as 1 Thaw 1748 |
| End of the game | `1800.1.1.1` (40 years of sandbox after the historical end) |
| Year shown | The Fourth Age year number. The engine's date format stays; the Erdae bar's age button shows "4A [year]" ([07_interface/01_interface.md](../07_interface/01_interface.md) section 2). |
| Months | Deepwinter, Ironfrost, Thaw, Rainwake, Sowing, Highsun, Goldfield, Harvest, Fallowing, Emberleaf, Mistfall, Longnight (proposed, vault) |
| Short months | Dpw, Irf, Tha, Rnw, Sow, Hsn, Gld, Hrv, Fal, Emb, Mis, Lng (*proposed*) |
| Month lengths | Unchanged (the engine's calendar). |

Month 3 is Thaw, so the start falls on the first day of spring.

## Implementation

1. **Defines** (`common/defines/zin_defines.lua`, written by `tools/content/modules/defines.mjs` from rows of `tools/content/data/defines.json`; [05_defines_and_rules.md](05_defines_and_rules.md) owns the file):
   - `NDefines.NGame.START_DATE = "1748.3.1.12"`, `NDefines.NGame.END_DATE = "1800.1.1.1"`.
   - `NDefines.NDiplomacy.TENSION_TIME_SCALE_START_DATE = "1748.3.1.12"` (the define sits in `NDiplomacy`, not `NGame`, in the installed 1.19.3 `00_defines.lua`; see [03_gameplay/05_world_tension_and_endings.md](../03_gameplay/05_world_tension_and_endings.md)).
   - Until the warfare phase replaces the technologies, `NDefines.NTechnology.BASE_YEAR_AHEAD_PENALTY_FACTOR` must neutralise vanilla 1936+ technology years (set to 0); the warfare spec gives Erdae technologies Fourth Age years and restores the penalty.
2. **Bookmark** `common/bookmarks/world.txt`: `date = 1748.3.1.12`, picture `GFX_zin_bookmark_fourth_age` (in game), default country Aenor. The politics step writes the file from the bookmark block that `tools/content/modules/frontend.mjs` exports; the name "The Fourth Age" and the description of the peaceful start are the `ZIN_BOOKMARK_*` keys of [03_main_menu_and_frontend.md](../07_interface/03_main_menu_and_frontend.md).
3. **History dates.** Every dated block the generators write moves to the new calendar: country and state history (`1748.3.1`), characters (birth dates in the 1600s–1720s), unit history. The politics step and the content builder take the start date from one constant, `START_DATE` in `tools/content/lib/calendar.mjs` (new), which also feeds `story_dates.mjs` (R2).
4. **Month names.** `localisation/replace/zin_calendar_l_english.yml`, written by `tools/content/modules/calendar.mjs` (new), replaces the full month keys `January` … `December` (vanilla `core_l_english.yml`; `May` sits in `combat_l_english.yml`) and the short keys `Jan`, `Feb`, `Mar`, `Apr`, `Jun`, `Jul`, `Aug`, `Sep`, `Oct`, `Nov`, `Dec` (vanilla has no short `May`: the key `May` serves both, so the fifth month reads "Sowing" in both forms). Until translations exist, every language folder gets the same English text in its own `zin_calendar_l_<language>.yml`.
5. **Game rules and events** that fire on dates use the new years. The historical path ([03_gameplay/06_historical_path_and_ai.md](../03_gameplay/06_historical_path_and_ai.md)) lists them; every story date reads `zin_story_pace` (V4, R2).

## Acceptance

- The game opens on 1 Thaw 1748 with the Fourth Age bookmark.
- Every date string players see uses Erdae month names, in the full and the short form (build: `zin_calendar_l_english.yml` defines all 23 keys; Linux run: the top bar date and a tooltip date both read Erdae months).
- No ZIN history file still uses 1936 dates (a generator test checks the staged tree).
- The research screen does not show ahead-of-time penalties for the starting technologies.
- The Linux run unpauses the clock at top speed for at least 10 minutes and never fewer than 60 game days (S8a) without new errors.

## Open questions

All proceed on their proposals.

1. Can the date display show "4A" before the year? Proceeds on: the engine's date format stays; the Erdae bar's age button carries "4A".
2. Does the owner want different month names? Proceeds on: the vault's proposed names and the short forms above.
