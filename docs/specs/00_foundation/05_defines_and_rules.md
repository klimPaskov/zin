# Defines and game rules

**Status:** Draft. **Priority:** 3. **Phase:** 3.

## Purpose

List every engine define ZIN changes, with its vanilla and ZIN value and the reason, and every ZIN game rule with its options. Defines set the pace and shape of a fantasy world that starts at peace; game rules let the player choose how closely the story follows history.

## Lore basis

**Established:** Erdae has known peace for more than a thousand years; the Fourth Age lasts more than a thousand years (vault, *Canon Policy*, *Fourth Age Canon Register*). The vault describes no firearms, aircraft or atomic weapons (the absence is design, not a canon statement); dragons come from Dragon Mountain and serve elven powers or Afrit through corruption.

**Owner-fixed start (18 October 2026):** the Golden King reigns, Eindil has not appeared, Afrit is unrevealed, Erdae seems at peace.

**Proposed:** the start date 1 Thaw 4A 1748 and the 4A 1760 historical end (vault, *Fourth Age Chronology*, proposed), and every value and rule in this spec. The "where history can turn" list in *The Campaign of 4A 1748* (proposed) is the source of the per-power rules.

## Design

### 1. Defines

All values are design targets. Only defines verified to exist in the game's `common/defines/00_defines.lua` appear here.

**Calendar and game**

| Define | Vanilla | ZIN | Why |
| --- | --- | --- | --- |
| `NGame.START_DATE` | `"1936.1.1.12"` | `"1748.3.1.12"` | 1 Thaw 4A 1748 ([01_start_and_calendar.md](01_start_and_calendar.md)) |
| `NGame.END_DATE` | `"1949.1.1.1"` | `"1800.1.1.1"` | 40 years of sandbox after the historical end |
| `NGame.MAJOR_PARTICIPANTS_FOR_MAJOR_WAR` | 3 | 3 | Unchanged: a great war keeps the game running past the end date |
| `NGame.HANDS_OFF_START_TAG` | `"HAI"` | `"HAI"` | Unchanged: an inactive vanilla tag, safe for hands-off test runs |

**Tension.** Engine world tension stays the diplomatic gauge (guarantees, factions, justification). The story meter is `zin_gathering_dark` ([05_world_tension_and_endings.md](../03_gameplay/05_world_tension_and_endings.md)), which adds engine threat through its own effects. Tension is 0 at the start.

| Define | Vanilla | ZIN | Why |
| --- | --- | --- | --- |
| `NDiplomacy.TENSION_TIME_SCALE_START_DATE` | `"1936.1.1.12"` | `"1748.3.1.12"` | Start date |
| `NDiplomacy.TENSION_TIME_SCALE_MONTHLY_FACTOR` | -0.005 | -0.003 | Tension still matters when the great war comes in 4A 1755 (scale 0.75 then) |
| `NDiplomacy.TENSION_TIME_SCALE_MIN` | 0.25 | 0.25 | Unchanged |
| `NDiplomacy.TENSION_DECAY_DAILY` | 0.005 | 0.01 | A world at peace forgets small quarrels fast |
| `NDiplomacy.TENSION_NO_CB_WAR` | 14 | 20 | An unprovoked war shocks a world at peace for seventeen centuries |
| `NDiplomacy.TENSION_CB_WAR` | 10 | 10 | Unchanged |
| `NDiplomacy.TENSION_FACTION_JOIN` | 4 | 2 | The old leagues are standing treaties, not threats |
| `NDiplomacy.TENSION_GUARANTEE` | -5 | -5 | Unchanged |
| `NDiplomacy.TENSION_ANNEX_NO_CLAIM` | 0.20 | 0.30 | Conquest without a claim alarms every crown |

**Diplomacy and peace**

| Define | Vanilla | ZIN | Why |
| --- | --- | --- | --- |
| `NDiplomacy.BASE_TRUCE_PERIOD` | 180 | 360 | Slower, older diplomacy |
| `NDiplomacy.IDEOLOGY_JOIN_FACTION_MIN_LEVEL` | 0.3 | 0.1 | Erdae's leagues mix Light, Dominion and Wild members (the Concord does today) |
| `NDiplomacy.BASE_PEACE_FORCE_GOVERNMENT_COST` | 100 | 150 | Overturning a realm's rule costs more than taking land |
| `NDiplomacy.PEACE_SCORE_SCALE_FACTOR` | 1.35 | 1.35 | Unchanged; the diplomacy spec re-themes peace actions in text only |
| `NDiplomacy.PEACE_SCORE_DISTRIBUTION` | `{ 0.2, 0.2, 0.2, 0.2, 0.2 }` | unchanged | |

**Countries and population**

| Define | Vanilla | ZIN | Why |
| --- | --- | --- | --- |
| `NCountry.MIN_MAJOR_COUNTRIES` | 7 | 9 | The nine working-table great powers; they also get `set_major = yes` in history ([04_countries_and_states.md](04_countries_and_states.md)) |
| `NCountry.BASE_TENSION_MAJOR_COUNTRY_INDEX` | 1 | 1 | Unchanged; must stay below `MIN_MAJOR_COUNTRIES` |
| `NCountry.POPULATION_YEARLY_GROWTH_BASE` | 0.015 | 0.008 | Pre-modern growth; peoples adjust it with `monthly_population` |
| `NCountry.DEFAULT_STABILITY` | 0.5 | 0.6 | Fallback only; a long peace |
| `NCountry.DEFAULT_WAR_SUPPORT` | 0.5 | 0.15 | Fallback only; nobody expects war |
| `NCountry.BASE_RESEARCH_SLOTS` | 2 | 2 | Unchanged; history sets slots per class |

**Research**

| Define | Vanilla | ZIN | Why |
| --- | --- | --- | --- |
| `NTechnology.BASE_YEAR_AHEAD_PENALTY_FACTOR` | 2 | **0** until the warfare phase replaces the technologies; then **2** with Fourth Age years | Vanilla 1936+ years would punish every start technology ([01_start_and_calendar.md](01_start_and_calendar.md)) |
| `NTechnology.BASE_TECH_COST` | 110 | 165 | The game spans 52 years, not 13; final value set by the warfare spec |

**Characters and politics**

| Define | Vanilla | ZIN | Why |
| --- | --- | --- | --- |
| `NCharacter.COUNTRY_LEADER_BASE_EXPIRE_YEAR_LENGTH` | 5 | 10 | Generated rulers of men reign longer |
| `NCharacter.COUNTRY_LEADER_BASE_RANDOM_MAX_YEAR_LENGTH` | 15 | 20 | Same |
| `NPolitics.BASE_POLITICAL_POWER_INCREASE` | 2 | 2 | Unchanged |
| `NPolitics.MAX_RANDOM_LEADERS` | 1 | 1 | Unchanged |

**No atomic weapons, no aircraft.** Defines cannot remove the air layer or nuclear weapons; content does. Defines make the remainder inert:

| Define | Vanilla | ZIN | Why |
| --- | --- | --- | --- |
| `NRaids.NUCLEAR_BOMB_PRODUCTION_SCALE` | 2555.0 | 1000000.0 | No nuclear production can yield a weapon |
| `NRaids.THERMONUCLEAR_BOMB_PRODUCTION_SCALE` | 2555.0 | 1000000.0 | Same |
| `NProject.BREAKTHROUGH_DAILY_NUCLEAR_REACTOR_GAIN` | 1 | 0 | No reactor breakthroughs |

Content rules that go with them (owned by the warfare spec in [03_gameplay](../03_gameplay/)):

- No technology, equipment, building or effect grants `nuclear_reactor`, `rocket_site`, `radar_station`, `air_base`, `add_nuclear_bombs` or air equipment.
- Every state has 0 air bases (26 levels exist today; [04_countries_and_states.md](04_countries_and_states.md)).
- Whether dragons or other beasts use the air layer is the warfare spec's decision (open question 1). Until then the air layer is empty.

### 2. Game rules

ZIN rules live in their own group, "Erdae", shown above vanilla rules. Each first option is the default. ZIN has no achievements, so `allow_achievements` is irrelevant.

| Rule | Options (default first) | Effect | Owner |
| --- | --- | --- | --- |
| `zin_rule_historical_path` | `HISTORICAL`, `PLAUSIBLE`, `FREE` | HISTORICAL: AI takes the established path inside the chronology's date windows. PLAUSIBLE: AI weights favour history but can choose other routes. FREE: AI follows its own interests. Story events outside AI choice (Eindil waking, the Council's plot) still run unless another rule changes them. | [06_historical_path_and_ai.md](../03_gameplay/06_historical_path_and_ai.md) |
| `zin_rule_story_pace` | `STANDARD`, `SLOW`, `FAST` | Multiplies story date windows and mean times by 1.0, 1.5 or 0.75 through the global variable `zin_story_pace` | same |
| `zin_rule_golden_king` | `HISTORICAL`, `DELAYED`, `NO_AI_PLOT` | HISTORICAL: the Council's plot can kill him in Mistfall 4A 1750 unless stopped. DELAYED: not before 4A 1753. NO_AI_PLOT: the AI Council never strikes; a player Afrit still can. | Aenor, Afrit |
| `zin_rule_eindil_waking` | `HISTORICAL`, `EARLY`, `LATE` | Eindil wakes early in 4A 1749; in Highsun 4A 1748; or in 4A 1751. Never at the start. | Eindil's journey |
| `zin_rule_gathering_dark` | `NORMAL`, `SLOW`, `FAST` | Multiplies Gathering Dark gains by 1.0, 0.5 or 1.5 through the global variable `zin_gathering_dark_rate` | world tension and endings |
| `zin_rule_dark_powers` | `HISTORICAL`, `AGGRESSIVE`, `RESTRAINED` | AI Volgan and Zol keep history; move a year early with stronger hosts; or never attack unless attacked (the dark endings become unlikely) | Volgan, Zol's Mistake |
| `zin_rule_ai_aenor_succession` | `DEFAULT`, `GOLDEN_COURT`, `FREE_DOMINIONS`, `RANDOM` | Which camp the AI drives toward after the King's death. DEFAULT follows `zin_rule_historical_path`. | Aenor |
| `zin_rule_ai_lerendor` | `DEFAULT`, `HONOUR_TREATY`, `STRAIT_SUPREMACY`, `RANDOM` | AI Lerendor's choice on the Treaty of the Narrow Strait | Lerendor |
| `zin_rule_ai_west` | `DEFAULT`, `STAY_DIVIDED`, `DEFEND_AENOR`, `RANDOM` | The Western Crossing | the West |
| `zin_rule_ai_east` | `DEFAULT`, `REFUSE_AFRIT`, `UNITE_WITHOUT_AFRIT`, `RANDOM` | Whether eastern kings follow Afrit when he flees east | the East |
| `zin_rule_ai_elves` | `DEFAULT`, `MARCH`, `RANDOM` | The Elven Refusal: the elves stay apart and send individuals, or march in a far-diverged game | the elves |
| `zin_rule_elections` | `DEFAULT`, `NONE` | Council realms and the Magical Forest hold elections, or nobody does | [02_ideologies_and_politics.md](02_ideologies_and_politics.md) |

**Precedence.** A per-power rule set to `DEFAULT` follows `zin_rule_historical_path`. Any other option forces that branch for the AI whatever the path rule says. Rules never act on a player's country.

**Option names in text.** Rule and option descriptions must not reveal Afrit: the East rule's options read "Refuse the Deliverer" and "Unite without the Deliverer". The rule screen is visible before any game starts.

### 3. Vanilla game rules

ZIN keeps the vanilla `common/game_rules/00_game_rules.txt` for now. Vanilla files ZIN does not yet replace (national focuses, ideas) still read vanilla rules, and removing a rule they read would break them. Country-specific vanilla rules (for example the fragmentation and AI behaviour rules of vanilla nations) do nothing in ZIN but still show.

When ZIN replaces the vanilla national focus and idea folders (focus phase), ship an override of `00_game_rules.txt` that keeps only the generic rules (war goals, access, release, licensing, lend-lease, volunteers, guarantees, factions, coups, party boosting, fort level, scorched earth, peace score rules) and drops every rule tied to a vanilla country or event. Ship it only when a scan of the staged tree finds no `has_game_rule` for a dropped rule.

## Implementation

| File | Content | Generator |
| --- | --- | --- |
| `common/defines/zin_defines.lua` | `NDefines.<Category>.<KEY> = value` for each row above | new `.tmp/zin-content/modules/defines.mjs` from one table |
| `common/game_rules/zin_game_rules.txt` | The twelve rules, group `RULE_GROUP_ZIN` | new `modules/rules.mjs` |
| `localisation/english/zin_rules_l_english.yml` | `RULE_GROUP_ZIN` "Erdae"; `ZIN_RULE_<NAME>`, `_DESC`; `ZIN_RULE_<NAME>_<OPTION>`, `_DESC` | same |
| `common/scripted_triggers/zin_rules.txt` | `zin_rules_is_historical` (path rule HISTORICAL), `zin_rules_is_free` (path rule FREE), `zin_rules_ai_branch_<power>_<option>` (true when the per-power rule forces that option, or it is `DEFAULT` and the path rule leads there) | same |
| `common/on_actions/zin_rules.txt` | `on_startup`: set global variables `zin_story_pace` and `zin_gathering_dark_rate` from the rules | same |

Rule script form:

```
zin_rule_historical_path = {
	name = "ZIN_RULE_HISTORICAL_PATH"
	desc = "ZIN_RULE_HISTORICAL_PATH_DESC"
	group = "RULE_GROUP_ZIN"
	default = { name = HISTORICAL text = "ZIN_RULE_HISTORICAL_PATH_HISTORICAL" desc = "ZIN_RULE_HISTORICAL_PATH_HISTORICAL_DESC" }
	option = { name = PLAUSIBLE text = "ZIN_RULE_HISTORICAL_PATH_PLAUSIBLE" desc = "ZIN_RULE_HISTORICAL_PATH_PLAUSIBLE_DESC" }
	option = { name = FREE text = "ZIN_RULE_HISTORICAL_PATH_FREE" desc = "ZIN_RULE_HISTORICAL_PATH_FREE_DESC" }
}
```

Scripts check rules with `has_game_rule = { rule = zin_rule_historical_path option = HISTORICAL }`, wrapped in the scripted triggers above so a rename touches one file.

**Build checks**

1. Every define key exists in the installed `00_defines.lua` under the same category (an unknown define is silently ignored, so a typo would pass unnoticed).
2. `BASE_TENSION_MAJOR_COUNTRY_INDEX` is below `MIN_MAJOR_COUNTRIES`.
3. Every `has_game_rule` in ZIN names a rule and option that exist.
4. No rule text contains "Afrit", "Einendil", "Edvoid" or "Rush".

## AI

- The AI reads the rules only through `zin_rules_*` triggers in AI weights and story events.
- With `zin_rule_historical_path = FREE`, mechanic AI weights fall back to each country's interest; the historical-path spec lists the weights.
- Defines affect the AI directly through tension (fewer early justifications) and the truce period.

## Acceptance

1. The game starts on 1 Thaw 4A 1748, and the hands-off Linux run reaches 1 Thaw 4A 1750 without errors from `zin_defines.lua`.
2. The rules screen shows the Erdae group with twelve rules and their defaults.
3. A 2-year hands-off run on defaults keeps engine world tension below 10% and starts no war before `zin_golden_king_dead`.
4. No country gains a nuclear weapon, an air base or an aircraft in a 10-year hands-off run.
5. With `zin_rule_golden_king = NO_AI_PLOT`, the Golden King is alive on 1 Thaw 4A 1760 in a hands-off run.
6. With `zin_rule_eindil_waking = EARLY`, `zin_eindil_awake` is set in Highsun 4A 1748 and not before.
7. The build checks above pass.

## Open questions

1. Do dragons and flying beasts use the air layer, or are they land units? (Warfare spec decides; owner preference wanted.)
2. Approve the per-power rules, or should the rule screen offer only the historical path rule?
3. Should the sandbox run to 4A 1800 or end sooner after the coronation?
4. Is 9 the right number of great powers for the engine's "major" status?
