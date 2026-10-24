# Calendar localisation: the god-months and the local reckonings

**Requirement:** R-31. **Decisions:** K28 (the twelve months and the start on 1 Lumae 4A 1748), K30 (local reckonings in the realms' own text). **Lore:** [docs/lore/references/calendar.md](../lore/references/calendar.md). **Builder:** `tools/content/lib/calendar.mjs`, `tools/content/modules/calendar.mjs`. **Data:** `tools/content/data/world/pantheon.json` (`gods[].monthName`, `monthShort`, `monthAbbr`, `monthIndex`, `calendar`), `tools/content/data/world/reckonings.json`. **Tests:** `tools/content/calendar.test.mjs`.

## 1. What it does

1. The engine's 23 month keys (`January` to `December` and the short keys `Jan` to `Dec`; vanilla has no short `May`, so `May` serves both) are replaced in all ten language folders (`localisation/replace/zin_calendar_l_<language>.yml`). The full key takes the language's `full` formula and the short key its `short` formula from `pantheon.json` `calendar.languageFormula`: `{name}` and `{abbr}` in the seven Latin-script languages, `{name}月` in Japanese and Simplified Chinese and `{name}월` in Korean, as the installed game writes its months there. Every date the engine draws (top bar, bookmark, tooltips, history) therefore reads in the god-months; the bookmark date `1748.3.1.12` reads 1 Lumae 1748.
2. Realms whose roster field `calendar` is not `twelve` get the flag `zin_calendar_<calendar>` at start-up (`common/on_actions/zin_calendar.txt`). Their own events can then write the date as they count it with `[ROOT.zin_reckoning_date]`.
3. `lib/calendar.mjs` exports the same conversions for the builder: `MONTHS`, `monthKeys(language)`, `monthIndex(name)` (a god-month or a former name, so older data keeps its dates), `START_SHOWN` ("1 Lumae 4A 1748"), `sharedYear(age, year)`, `eraYear(calendar, year)`, `firstRisingYear`, `risingOf`, `ordinalWord`, `ordinalSuffix` and `reckonDate(calendar, date, { leader, firstRising })`, which writes the same text the scripted localisation does.

## 2. Writing a date in a realm's own reckoning

Run the refresh on the country whose reckoning the text uses, then call the scripted localisation on that country.

```
country_event = {
	id = zin_east.40
	title = zin_east.40.t
	desc = zin_east.40.d
	immediate = { hidden_effect = { zin_reckoning_refresh = yes } }
	option = { name = zin_east.40.a }
}
```

```
 zin_east.40.d:0 "In [ROOT.zin_reckoning_date] the caravans came back to [ROOT.Capital.GetName]."
```

For Noris on the start date this reads "In the 3952nd year of the Wells the caravans came back"; for Stabilo "In the 1108th year of the Ledger"; for Alerhia "In the twelfth Rising of" its ruler; for a realm of the twelve "In Lumae, 4A 1748". The text opens with a lower-case article, so begin the sentence with a preposition ("In", "Since", "By").
`[ROOT.zin_reckoning_name]` names the reckoning itself ("The Count of the Wells"). To show another country's date, refresh that country (`FROM = { zin_reckoning_refresh = yes }`) and call `[FROM.zin_reckoning_date]`.
Gate content to these realms with the scripted triggers `zin_keeps_own_reckoning` (any count but the twelve) and `zin_keeps_reckoning_<calendar>`.

## 3. The scripted pieces

| Name | Kind | Scope | What it does |
| --- | --- | --- | --- |
| `zin_reckoning_refresh` | scripted effect | country | Sets `zin_reckoning_month` (1 to 12, from the current date by `meta_trigger` date checks), `zin_reckoning_year` (the 4A year; the Wells or Ledger year through the constants `zin_calendar.well_count_offset` and `ledger_count_offset`; for the Count of the Floods the Rising of the reign, counted from `zin_reckoning_first_rising` and turning on the first day of month `zin_calendar.rising_month`, 0 before the first Rising or when no reign start is known), and the digits `zin_reckoning_mod100`, `zin_reckoning_units` and `zin_reckoning_tens`. It changes no game state; it runs once at start-up for every flagged realm. |
| `zin_reckoning_new_reign` | scripted effect | country | For a `flood_count` realm: sets `zin_reckoning_first_rising` for a ruler who has just taken power (this year's Rising until the Rising month has passed, otherwise next year's) and refreshes. Call it wherever such a realm gets a new leader; until then the Risings of the old reign keep counting. |
| `zin_reckoning_date` | scripted localisation | country | The date in the scope country's reckoning. |
| `zin_reckoning_name` | scripted localisation | country | The name of the reckoning. |
| `zin_reckoning_month_name`, `zin_reckoning_season`, `zin_reckoning_muster`, `zin_reckoning_ordinal_suffix`, `zin_reckoning_ordinal_word`, `zin_reckoning_tens_word`, `zin_reckoning_units_ordinal` | scripted localisation | country | The parts the date is built from; they read the variables of the refresh. |
| `zin_keeps_own_reckoning`, `zin_keeps_reckoning_<calendar>` | scripted triggers | country | The realm's reckoning flag. |
| `zin_calendar` | script constants | | `well_count_offset` 2204, `ledger_count_offset` -640, `rising_month` 4, generated from `reckonings.json` and `pantheon.json`. |

The forms of every reckoning are in `reckonings.json` (`calendars.<id>.form`, `formBefore` for a year before an era began, `formNoReign` for a river-crown whose Rising is not known). The texts are written identically in the ten language folders (`localisation/<language>/zin_reckoning_l_<language>.yml`), as ZIN writes every proper name until a translation pass. The month inside a twelve date uses the engine's month key, so it follows each language's formula.

## 4. Limits and open points

- The variables are as current as the last refresh. Text outside an event (a decision description, a tooltip) shows the date of the last refresh of that country, which may be the start-up; call the refresh from the effect that leads to the text.
- Realms the country table does not hold yet are not flagged; the build summary lists them (`calendar.unresolved`). The module resolves a realm by its roster tag, then its name, then its first former label, so it follows the roster migration without changes.
- Delbiz and Rhachia have no written Rising of their present rulers: their dates read "the reign of" the ruler until a lore entry gives the number (`reckonings.json` `calendars.flood_count.reigns`) or a new reign starts through `zin_reckoning_new_reign`.
- No succession effect calls `zin_reckoning_new_reign` yet.
- The year counts of the Delving Count, the Cords, the Storm Years and the Count of the Halls are not written in the lore, so those reckonings write the season (or the reign) without a number.
- Nothing here has run in the game: the conversions are covered by the tests, the scripted bodies by the installed documentation (`meta_trigger`, `modulo_variable`, `clamp_variable`, `has_variable`) and the Kaiserreich precedent of building dates from `global.year`.

## 5. Texts that named a former month

The god-months replace the former names in these player texts: the Eindil waking rule descriptions (`data/game_rules.json`: Sulethe, Rasthel), the Golden King's feast and vigil (`data/events_crown_reign1.json`, `data/events_crown_chronicle.json`, `data/focus_worshipdom_faces.json`, `data/mech_afrit_focus_text.json`, `lib/mech_aenor_story.mjs`: Gaelor), the Lamp Furrow's Star Vigil (`data/cultures_game.json`), the technology tree's start date (`modules/technologies.mjs`, from `START_SHOWN`), and the focus texts of Coldor, Kilinti, Selen and the shared Cold Lands, Lands of the Sun, North Lands, Tritons' Islands and West Lands trees (`docs/design/focus/*.json`: a god-month for the realms of the twelve, a season word for the others). Timing data written with former names (event windows, festival months) keeps its dates through `monthIndex`; the Cold Lands seasons are month numbers and are unchanged.

## 6. Icons

None: the calendar and the reckonings are text only.

## 7. Future work

- A translation pass for the reckoning texts, and a decision whether Russian and the Asian languages transliterate the god-months (calendar.md question 4).
- Lore for the missing counts (the holds' delving years, the eldest cords, the named storms, the pacts of the Halls) would let those reckonings carry a year number.
- A festival calendar in the realms' own reckonings ("the First Water, in the rains of the 3952nd year of the Wells").
