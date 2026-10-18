# Start date and calendar

**Status:** Ready. **Priority:** 2. **Phase:** 2.

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
| Year shown | The Fourth Age year number. The top bar labels the age: "Fourth Age" (see [07_interface](../07_interface/)). |
| Months | Deepwinter, Ironfrost, Thaw, Rainwake, Sowing, Highsun, Goldfield, Harvest, Fallowing, Emberleaf, Mistfall, Longnight (proposed, vault) |
| Month lengths | Unchanged (the engine's calendar). |

Month 3 is Thaw, so the start falls on the first day of spring.

## Implementation

1. **Defines** (`common/defines/zin_defines.lua`, generated):
   - `NDefines.NGame.START_DATE = "1748.3.1.12"`, `END_DATE = "1800.1.1.1"`.
   - `NDefines.NGame.TENSION_TIME_SCALE_START_DATE = "1748.3.1.12"` (see [03_gameplay/05_world_tension_and_endings.md](../03_gameplay/05_world_tension_and_endings.md)).
   - Until the warfare phase replaces the technologies, `NDefines.NTechnology.BASE_YEAR_AHEAD_PENALTY_FACTOR` must neutralise vanilla 1936+ technology years (set to 0); the warfare spec gives Erdae technologies Fourth Age years and restores the penalty.
2. **Bookmark** `common/bookmarks/world.txt`: `date = 1748.3.1.12`, a generated picture, default country unchanged. Localised name "The Fourth Age" and a description of the peaceful start.
3. **History dates.** Every dated block the generators write moves to the new calendar: country and state history (`1748.3.1`), characters (birth dates in the 1600s–1720s), unit history. The politics and content generators take the start date from one constant.
4. **Month names.** `localisation/replace/zin_calendar_l_english.yml` replaces `January` … `December`.
5. **Game rules and events** that fire on dates use the new years. The historical path ([03_gameplay/06_historical_path_and_ai.md](../03_gameplay/06_historical_path_and_ai.md)) lists them.

## Acceptance

- The game opens on 1 Thaw 1748 with the Fourth Age bookmark.
- Every date string players see uses Erdae month names.
- No ZIN history file still uses 1936 dates (a generator test checks the staged tree).
- The research screen does not show ahead-of-time penalties for the starting technologies.
- 60 days run in the Linux test without new errors.

## Open questions

1. Can the date display show "4A" before the year? If the engine's date format cannot be localised, the top bar's age label carries it.
2. Does the owner want different month names?
