# Defines and game rules

**Status:** Ready. Reviewed 19 October 2026 against CONVENTIONS "Status"; integrated 19 October 2026. **Priority:** 3. **Phase:** 3 (the calendar rows land in phase 2 with [01_start_and_calendar.md](01_start_and_calendar.md); the hands-off tag and the vanilla rule override are already in game).

## Purpose

List every engine define ZIN changes, with its vanilla and ZIN value and the reason, and every ZIN game rule with its options. Defines set the pace and shape of a fantasy world that starts at peace; game rules let the player choose how closely the story follows history. This spec owns the one defines file and the rules format, and keeps the register of every ZIN game rule, including the ones other specs define.

## Lore basis

**Established:** Erdae has known peace for more than a thousand years; the Fourth Age lasts more than a thousand years (vault, *Canon Policy*, *Fourth Age Canon Register*). The vault describes no firearms, aircraft or atomic weapons (the absence is design, not a canon statement); dragons come from Dragon Mountain and serve elven powers or Afrit through corruption.

**Owner-fixed start (18 October 2026):** the Golden King reigns, Eindil has not appeared, Afrit is unrevealed, Erdae seems at peace.

**Decided (INTEGRATION_DECISIONS):** N4 (`zin_rule_golden_king_death` replaces `zin_rule_golden_king`), N15 (its options `DYNAMIC`, `HISTORICAL`, `DELAYED`, `NO_AI_PLOT`), V3 (the sandbox runs to 4A 1800), V4 and R2 (every story date reads `zin_story_pace`), S6 (dragons use the air layer), R1 (one rule group `RULE_GROUP_ZIN`; every per-power rule opens with `DEFAULT`; `zin_rule_ai_lerendor`, `zin_rule_ai_west` and `zin_rule_zol_behaviour` retired; `zin_rule_skies` defaults to `dragons_only`).

**Proposed:** the start date 1 Thaw 4A 1748 and the 4A 1760 historical end (vault, *Fourth Age Chronology*, proposed), and every value and rule in this spec. The "where history can turn" list in *The Campaign of 4A 1748* (proposed) is the source of the per-power rules.

## Design

### 1. Defines

All values are design targets. Every define below exists in the installed 1.19.3 `common/defines/00_defines.lua` under the category shown. Rows marked "unchanged" document a decision not to change the value; they are not written.

**Calendar and game**

| Define | Vanilla | ZIN | Why | Owner | In game |
| --- | --- | --- | --- | --- | --- |
| `NGame.START_DATE` | `"1936.1.1.12"` | `"1748.3.1.12"` | 1 Thaw 4A 1748 | [01_start_and_calendar.md](01_start_and_calendar.md) | not yet |
| `NGame.END_DATE` | `"1949.1.1.1"` | `"1800.1.1.1"` | 40 years of sandbox after the historical end (V3) | calendar | not yet |
| `NGame.MAJOR_PARTICIPANTS_FOR_MAJOR_WAR` | 3 | unchanged | A great war keeps the game running past the end date | this spec | — |
| `NGame.HANDS_OFF_START_TAG` | `"HAI"` | the tag of **Verde** (*proposed*), resolved by name at build time | `HAI` no longer exists; Verde has no story role | this spec | yes (`"Y60"`, since 19 October 2026) |

**Tension.** Engine world tension stays the diplomatic gauge (guarantees, factions, justification). The story meter is `zin_gathering_dark` ([05_world_tension_and_endings.md](../03_gameplay/05_world_tension_and_endings.md)), which adds engine tension through its own effects. Tension is 0 at the start, and the D6 ideology limits ([02_ideologies_and_politics.md](02_ideologies_and_politics.md)) keep every realm from justifying a war goal until it reaches 25%.

| Define | Vanilla | ZIN | Why |
| --- | --- | --- | --- |
| `NDiplomacy.TENSION_TIME_SCALE_START_DATE` | `"1936.1.1.12"` | `"1748.3.1.12"` | Start date (lands with the calendar) |
| `NDiplomacy.TENSION_TIME_SCALE_MONTHLY_FACTOR` | -0.005 | -0.003 | Tension still matters when the great war comes in 4A 1755 (scale 0.75 then) |
| `NDiplomacy.TENSION_TIME_SCALE_MIN` | 0.25 | unchanged | |
| `NDiplomacy.TENSION_DECAY_DAILY` | 0.005 | 0.01 | A world at peace forgets small quarrels fast |
| `NDiplomacy.TENSION_NO_CB_WAR` | 14 | 20 | An unprovoked war shocks a world long at peace |
| `NDiplomacy.TENSION_CB_WAR` | 10 | unchanged | |
| `NDiplomacy.TENSION_FACTION_JOIN` | 4 | 2 | The old leagues are standing treaties, not threats |
| `NDiplomacy.TENSION_GUARANTEE` | -5 | unchanged | |
| `NDiplomacy.TENSION_ANNEX_NO_CLAIM` | 0.20 | 0.30 | Conquest without a claim alarms every crown |

**Diplomacy and peace**

| Define | Vanilla | ZIN | Why |
| --- | --- | --- | --- |
| `NDiplomacy.BASE_TRUCE_PERIOD` | 180 | 360 | Slower, older diplomacy |
| `NDiplomacy.IDEOLOGY_JOIN_FACTION_MIN_LEVEL` | 0.3 | 0.1 | Erdae's leagues mix Light, Dominion and Wild members (the Concord does today) |
| `NDiplomacy.BASE_PEACE_FORCE_GOVERNMENT_COST` | 100 | 150 | Overturning a realm's rule costs more than taking land |
| `NDiplomacy.PEACE_SCORE_SCALE_FACTOR` | 1.35 | unchanged | The diplomacy spec re-themes peace actions in text only |
| `NDiplomacy.PEACE_SCORE_DISTRIBUTION` | `{ 0.2, 0.2, 0.2, 0.2, 0.2 }` | unchanged | |

**Countries and population**

| Define | Vanilla | ZIN | Why |
| --- | --- | --- | --- |
| `NCountry.MIN_MAJOR_COUNTRIES` | 7 | 9 | The nine working-table great powers; they also get `set_major = yes` in history ([04_countries_and_states.md](04_countries_and_states.md)) |
| `NCountry.BASE_TENSION_MAJOR_COUNTRY_INDEX` | 1 | unchanged | Must stay below `MIN_MAJOR_COUNTRIES` |
| `NCountry.POPULATION_YEARLY_GROWTH_BASE` | 0.015 | 0.008 | Pre-modern growth; peoples adjust it with `monthly_population` |
| `NCountry.DEFAULT_STABILITY` | 0.5 | 0.6 | Fallback only; a long peace |
| `NCountry.DEFAULT_WAR_SUPPORT` | 0.5 | 0.15 | Fallback only; nobody expects war |
| `NCountry.BASE_RESEARCH_SLOTS` | 2 | unchanged | History sets slots per class |

**Research**

| Define | Vanilla | ZIN | Why |
| --- | --- | --- | --- |
| `NTechnology.BASE_YEAR_AHEAD_PENALTY_FACTOR` | 2 | **0** from the calendar change until the warfare stage replaces the technologies; then **2** with Fourth Age years ([01_warfare.md](../03_gameplay/01_warfare.md)) | Vanilla 1936+ years would punish every start technology ([01_start_and_calendar.md](01_start_and_calendar.md)) |
| `NTechnology.BASE_TECH_COST` | 110 | 165 | The game spans 52 years, not 13; the warfare spec may retune it and records the final value |

**Characters and politics**

| Define | Vanilla | ZIN | Why |
| --- | --- | --- | --- |
| `NCharacter.COUNTRY_LEADER_BASE_EXPIRE_YEAR_LENGTH` | 5 | 10 | Generated rulers of men reign longer |
| `NCharacter.COUNTRY_LEADER_BASE_RANDOM_MAX_YEAR_LENGTH` | 15 | 20 | Same |
| `NPolitics.BASE_POLITICAL_POWER_INCREASE` | 2 | unchanged | |
| `NPolitics.MAX_RANDOM_LEADERS` | 1 | unchanged | |

**No atomic weapons.** Defines cannot remove nuclear weapons; content does. Defines make the remainder inert:

| Define | Vanilla | ZIN | Why |
| --- | --- | --- | --- |
| `NRaids.NUCLEAR_BOMB_PRODUCTION_SCALE` | 2555.0 | 1000000.0 | No nuclear production can yield a weapon |
| `NRaids.THERMONUCLEAR_BOMB_PRODUCTION_SCALE` | 2555.0 | 1000000.0 | Same |
| `NProject.BREAKTHROUGH_DAILY_NUCLEAR_REACTOR_GAIN` | 1 | 0 | No reactor breakthroughs |

Content rules that go with them (owned by [01_warfare.md](../03_gameplay/01_warfare.md) and [02_economy.md](../03_gameplay/02_economy.md)):

- No technology, equipment, building or effect grants `nuclear_reactor`, `rocket_site`, `radar_station` or `add_nuclear_bombs`.
- The air layer holds only the warfare spec's beasts: griffin riders and dragon flights (S6), governed by its rule `zin_rule_skies` (default `dragons_only`, R1). No modern aircraft remains loadable.
- Every state starts with 0 air bases (26 levels exist today; [04_countries_and_states.md](04_countries_and_states.md)). Air bases are eyries, built in play only under the sky rule.

Other specs add their own define blocks to the same file: the economy block ([02_economy.md](../03_gameplay/02_economy.md)) and the warfare block ([01_warfare.md](../03_gameplay/01_warfare.md)). The same build checks hold for them.

### 2. Game rules

**Format.** Every ZIN rule is a `zin_rule_<name>` block in a `common/game_rules/zin_*.txt` file, in one group: `group = "RULE_GROUP_ZIN"`, shown as "Erdae". Text keys are `ZIN_RULE_<NAME>` and `ZIN_RULE_<NAME>_DESC` for the rule, and `ZIN_RULE_<NAME>_<OPTION>` and `_DESC` for each option, where `<NAME>` is the rule key without `zin_rule_`, upper-cased. The default option is the first option or the one written as `default = { }`. Every rule carries `icon = "GFX_zin_rule_<name>"` ([03_main_menu_and_frontend.md](../07_interface/03_main_menu_and_frontend.md)). ZIN has no achievements, so `allow_achievements` is not used.

```
zin_rule_historical_path = {
	name = "ZIN_RULE_HISTORICAL_PATH"
	desc = "ZIN_RULE_HISTORICAL_PATH_DESC"
	group = "RULE_GROUP_ZIN"
	icon = "GFX_zin_rule_historical_path"
	default = { name = HISTORICAL text = "ZIN_RULE_HISTORICAL_PATH_HISTORICAL" desc = "ZIN_RULE_HISTORICAL_PATH_HISTORICAL_DESC" }
	option = { name = PLAUSIBLE text = "ZIN_RULE_HISTORICAL_PATH_PLAUSIBLE" desc = "ZIN_RULE_HISTORICAL_PATH_PLAUSIBLE_DESC" }
	option = { name = FREE text = "ZIN_RULE_HISTORICAL_PATH_FREE" desc = "ZIN_RULE_HISTORICAL_PATH_FREE_DESC" }
}
```

Scripts check rules with `has_game_rule = { rule = <rule> option = <OPTION> }`, wrapped in scripted triggers so a rename touches one file.

**Precedence (R1).** The path rule `zin_rule_historical_path` is the umbrella. Every per-power AI rule has a first option `DEFAULT` that follows the umbrella; any other option forces that branch for the AI whatever the umbrella says. The foundation trigger `zin_rules_ai_branch_<power>_<option>` is true when the per-power rule forces that option, or when it is `DEFAULT` and the umbrella leads there (HISTORICAL leads to the historical option; FREE to the AI's own weights; PLAUSIBLE to the historical option at the reduced weights of [06_historical_path_and_ai.md](../03_gameplay/06_historical_path_and_ai.md)). For Volgan and Zol, `zin_rule_dark_powers` sits between the two: its first option `HISTORICAL` plays the part of `DEFAULT` (it follows the path rule), Volgan's own rule's `DEFAULT` follows it, and Zol has no rule of its own (it reads `zin_rule_dark_powers` through `zin_zol_ai_route_*`). Rules never act on a player's country. Story events outside any AI choice (Eindil waking, the Council's plot clock) run under every option unless their own rule changes them.

**`RANDOM` options (*proposed*).** Four rules offer `RANDOM`: `zin_rule_ai_aenor_succession`, `zin_rule_ai_east`, `zin_rule_ai_elves` and `zin_rule_ai_goldoroth`. Under `RANDOM` every `zin_rules_ai_branch_<power>_<option>` trigger of that power is false, and the generated trigger `zin_rules_ai_random_<power>` is true. The rule's owner draws once on startup with `random_list` and stores the result where its own triggers read it (for example the eastern kings' global `zin_east_rule_roll`: 0 `DEFAULT`, 1 `REFUSE_AFRIT`, 2 `UNITE_WITHOUT_AFRIT`; the elves' per-realm flag `zin_elves_ai_marcher`). A drawn `DEFAULT` follows the umbrella as above. The draw is made once per game, so a save keeps it.

**Rules the foundation defines** (`common/game_rules/zin_game_rules.txt`, all *proposed*):

| Rule | Options (default first) | Effect | Read by |
| --- | --- | --- | --- |
| `zin_rule_historical_path` | `HISTORICAL`, `PLAUSIBLE`, `FREE` | HISTORICAL: the AI takes the established path inside the chronology's date windows. PLAUSIBLE: AI weights favour history but can choose other routes. FREE: the AI follows its own interests. | [06_historical_path_and_ai.md](../03_gameplay/06_historical_path_and_ai.md), every mechanic |
| `zin_rule_story_pace` | `STANDARD`, `SLOW`, `FAST` | Sets the global variable `zin_story_pace` to 1.0, 1.5 or 0.75; story date windows, floors and mean times stretch by it (V4, R2; every builder module computes its dates through `tools/content/lib/story_dates.mjs`) | historical path, every floor date |
| `zin_rule_eindil_waking` | `HISTORICAL`, `EARLY`, `LATE` | Eindil wakes early in 4A 1749; in Highsun 4A 1748; or in 4A 1751. Never at the start. | [eindil_journey.md](../04_mechanics/eindil_journey.md) |
| `zin_rule_gathering_dark` | `NORMAL`, `SLOW`, `FAST` | Sets the global variable `zin_gathering_dark_rate` to 1.0, 0.5 or 1.5, which multiplies Gathering Dark gains | [05_world_tension_and_endings.md](../03_gameplay/05_world_tension_and_endings.md) |
| `zin_rule_dark_powers` | `HISTORICAL`, `AGGRESSIVE`, `RESTRAINED` | AI Volgan and Zol keep history; move a year early with stronger hosts; or never attack unless attacked (the dark endings become unlikely). The default of each power's own rule follows it. | Volgan, Zol's Mistake |
| `zin_rule_ai_aenor_succession` | `DEFAULT`, `GOLDEN_COURT`, `FREE_DOMINIONS`, `RANDOM` | Which camp the AI drives toward after the King's death (`RANDOM` as above; the Aenor spec draws) | [aenor_court_and_succession.md](../04_mechanics/aenor_court_and_succession.md) |
| `zin_rule_ai_east` | `DEFAULT`, `REFUSE_AFRIT`, `UNITE_WITHOUT_AFRIT`, `RANDOM` | Whether eastern kings follow Afrit when he flees east. Option texts read "Refuse the Deliverer" and "Unite without the Deliverer". | [eastern_kings.md](../04_mechanics/eastern_kings.md) |
| `zin_rule_ai_elves` | `DEFAULT`, `MARCH`, `RANDOM` | The Elven Refusal: the elves stay apart and send individuals, or march in a far-diverged game | [elves_wall_and_dragons.md](../04_mechanics/elves_wall_and_dragons.md) |
| `zin_rule_elections` | `DEFAULT`, `NONE` | Council realms and the Magical Forest hold elections, or nobody does | [02_ideologies_and_politics.md](02_ideologies_and_politics.md) |

**Rows other specs supply to the same file** (they define the options and effects):

| Rule | Options (default first) | Owner |
| --- | --- | --- |
| `zin_rule_golden_king_death` | `DYNAMIC`, `HISTORICAL`, `DELAYED`, `NO_AI_PLOT` (N15). The King dies only when both the Council's `zin_afrit_regicide_ready` and Aenor's clock allow; `zin_reign.19` fires one day before the scheduled death | [aenor_court_and_succession.md](../04_mechanics/aenor_court_and_succession.md) (N4, N15) |
| `zin_rule_afrit` | `DEFAULT`, `HISTORICAL`, `FREE`, `ASHEN`, `DORMANT` | [afrit_hidden_council.md](../04_mechanics/afrit_hidden_council.md) |
| `zin_rule_ai_goldoroth` | `DEFAULT`, `INDEPENDENT`, `SWORN_TO_VOLGAN`, `RANDOM` | [dark_lands.md](../04_mechanics/dark_lands.md) |
| `zin_rule_cold_isengard` | `DEFAULT`, `HISTORICAL`, `OPEN_HAND`, `CONQUEST`, `FREE` | [cold_lands.md](../04_mechanics/cold_lands.md) |
| `zin_rule_debug_checks` | `OFF`, `ON`; the Linux acceptance runs set it on | [01_start_situation.md](../02_lore/01_start_situation.md) |

**Rules in their owners' files** (same format and group):

| Rule | Options (default first) | File | Owner |
| --- | --- | --- | --- |
| `zin_rule_eindil_journey` | `DEFAULT`, `HISTORICAL`, `FREE` | `zin_eindil.txt` | [eindil_journey.md](../04_mechanics/eindil_journey.md) |
| `zin_rule_leren_route` | `DEFAULT`, `historical`, `honour`, `supremacy`, `free` | `zin_leren.txt` | [lerendor_narrow_strait.md](../04_mechanics/lerendor_narrow_strait.md) |
| `zin_rule_west_route` | `DEFAULT`, `historical`, `crossing_hold`, `relief`, `divided`, `free` | `zin_west.txt` | [western_crossing.md](../04_mechanics/western_crossing.md) |
| `zin_rule_volgan_early_war` | `DEFAULT` (R1; follows `zin_rule_dark_powers`), `AI_HISTORICAL`, `AI_FREE` | `zin_dominion.txt` | [volgan_southern_dominion.md](../04_mechanics/volgan_southern_dominion.md) |
| `zin_rule_volgan_spirit` | `UNRESOLVED`, `STIRRING` | `zin_dominion.txt` | Volgan |
| `zin_rule_skies` | `dragons_only`, `beasts`, `none` (R1) | `zin_war_rules.txt` | [01_warfare.md](../03_gameplay/01_warfare.md) |
| `zin_rule_deathless` | `canon`, `softened` | `zin_war_rules.txt` | warfare |

Every per-power AI rule of the register opens with `DEFAULT` (R1): `zin_rule_afrit`, `zin_rule_ai_aenor_succession`, `zin_rule_ai_east`, `zin_rule_ai_elves`, `zin_rule_ai_goldoroth`, `zin_rule_cold_isengard`, `zin_rule_eindil_journey`, `zin_rule_leren_route`, `zin_rule_west_route` and `zin_rule_volgan_early_war`. `zin_rule_volgan_spirit`, `zin_rule_skies`, `zin_rule_deathless`, `zin_rule_golden_king_death`, `zin_rule_eindil_waking`, `zin_rule_debug_checks` and the umbrella rules are not per-power AI rules and keep their own first option. Build check 7 fails when a per-power rule's first option is not `DEFAULT`.

**Retired:** `zin_rule_golden_king` (replaced by `zin_rule_golden_king_death`, N4; its `NO_AI_PLOT` option lives on there, N15); `zin_rule_ai_lerendor` and `zin_rule_ai_west` (R1: replaced by the owners' `zin_rule_leren_route` and `zin_rule_west_route`); `zin_rule_zol_behaviour` (R1: Zol reads `zin_rule_dark_powers`). The build's name check fails on all four.

**Rule text.** Rule and option texts must not reveal Afrit or Eindil: the rule screen is visible before any game starts. The interface spec gives the titles ("The Man from the Ice" for `zin_rule_eindil_waking`, "The Stranger's Road" for `zin_rule_eindil_journey`).

### 3. Vanilla game rules

The vanilla `common/game_rules/00_game_rules.txt` is **overridden since stage 1 of the vanilla removal** (19 October 2026, `modules/vanilla_removal.mjs`). The override keeps the 16 generic rules (`allow_wargoals` … `allow_scorched_earth`) and the three peace score rules with their engine keys, options and icons (identifiers read from the installed file), gives every name and description a ZIN key with ZIN text, and drops the 70 vanilla country rules. Rule groups are `ZIN_RULE_GROUP_*` keys. The `zin_rule_*` rules stay in their own files.

## Implementation

| File | Content | Written by |
| --- | --- | --- |
| `common/defines/zin_defines.lua` | `NDefines.<Category>.<KEY> = value` for every changed row of this spec, the calendar spec, the economy block and the warfare block | `tools/content/modules/defines.mjs` (new), from one table `tools/content/data/defines.json` (new: category, key, value, owner spec, from-stage). Today `modules/vanilla_removal.mjs` writes the file with only `HANDS_OFF_START_TAG`; `defines.mjs` takes it over. |
| `common/game_rules/zin_game_rules.txt` | The nine foundation rules and the five supplied rows | `tools/content/modules/rules.mjs` (new), from `tools/content/data/game_rules.json` (new) |
| `localisation/english/zin_rules_l_english.yml` | `RULE_GROUP_ZIN` "Erdae"; every rule and option text of that file | `rules.mjs` |
| `common/scripted_triggers/zin_rules.txt` | `zin_rules_is_historical` (path rule HISTORICAL), `zin_rules_is_free` (path rule FREE), `zin_rules_ai_branch_<power>_<option>` for every per-power rule in the register, `zin_rules_ai_random_<power>` for the four rules with `RANDOM` | `rules.mjs` |
| `common/on_actions/zin_rules.txt` | `on_startup`: set the global variables `zin_story_pace` and `zin_gathering_dark_rate` from the rules | `rules.mjs` |
| `common/game_rules/00_game_rules.txt` | The vanilla override (section 3) | `modules/vanilla_removal.mjs` (exists) |

**Build checks** (in `tools/content/build.test.mjs`, G1 of [01_acceptance.md](../09_validation/01_acceptance.md)):

1. Every define key in `defines.json` exists in the installed `00_defines.lua` under the same category. An unknown define is silently ignored by the engine, so a typo would pass unnoticed.
2. `BASE_TENSION_MAJOR_COUNTRY_INDEX` is below `MIN_MAJOR_COUNTRIES`.
3. `HANDS_OFF_START_TAG` resolves to a defined ZIN tag.
4. Every `has_game_rule` in a ZIN file names a rule and option that exist; every rule of the register exists exactly once across `common/game_rules/zin_*.txt`, in group `RULE_GROUP_ZIN`, with every text key defined.
5. No loaded file (kept vanilla or ZIN) has a `has_game_rule` for a vanilla rule the override dropped.
6. No rule text contains "Afrit", "Eindil", "Einendil", "Edvoid" or "Rush".
7. Every per-power AI rule's first option is `DEFAULT`, and no file names a retired rule (`zin_rule_golden_king`, `zin_rule_ai_lerendor`, `zin_rule_ai_west`, `zin_rule_zol_behaviour`).

## AI

- The AI reads the rules only through the `zin_rules_*` triggers in AI weights and story events.
- With `zin_rule_historical_path = FREE`, mechanic AI weights fall back to each country's interest; the historical-path spec lists the weights.
- Defines affect the AI directly through tension (fewer early justifications) and the truce period.

## Acceptance

1. **Build:** the build checks above pass, each with a negative test (an unknown define, a misplaced category, a rule outside the group, a text naming Afrit, a `has_game_rule` on a dropped vanilla rule, a per-power rule whose first option is not `DEFAULT`, a planted `zin_rule_zol_behaviour`).
2. **Build:** `zin_defines.lua` holds exactly the changed rows of `defines.json` in effect for the current stage, and `HANDS_OFF_START_TAG` is Verde's tag.
3. **Linux run (from phase 2):** the game opens on 1 Thaw 1748 (calendar spec) and `error.log` has no line naming `zin_defines.lua`.
4. **Linux run:** the rules screen shows the Erdae group with every rule of the register and its default selected (capture `p<phase>_rules`).
5. **Linux observer run (phase 3, one in-game year on defaults):** engine world tension stays below 10% and no war starts before `zin_golden_king_dead`.
6. **Linux observer run to 4A 1761 (L5 of the acceptance spec):** no country gains a nuclear bomb, a rocket site, a radar station or a reactor.
7. **Offline scenario test:** with `zin_rule_eindil_waking = EARLY`, `zin_eindil_awake` is set in Highsun 4A 1748 and not before; with `HISTORICAL`, not before Ironfrost 4A 1749.
8. **Offline scenario test** (`hoi4.mechanic_test`, `tests/mechanics/rules.json`): with `zin_rule_ai_east = RANDOM`, every `zin_rules_ai_branch_east_*` trigger is false and `zin_rules_ai_random_east` is true; with `REFUSE_AFRIT`, `zin_rules_ai_branch_east_refuse_afrit` is true and `zin_rules_ai_branch_east_unite_without_afrit` false under every path option.

## Open questions

All proceed on their proposals; the owner's copies are in [OPEN_QUESTIONS.md](../OPEN_QUESTIONS.md).

1. Do dragons and flying beasts use the air layer? Decided by S6 (yes; `zin_rule_skies` lets a player turn the sky off).
2. Keep the per-power rules, or offer only the historical path rule? Proceeds on: keep them (foundation 17).
3. Should the sandbox run to 4A 1800? Decided by V3 (yes).
4. Is 9 the right number of great powers for the engine's major status? Proceeds on: 9 (foundation 12).
