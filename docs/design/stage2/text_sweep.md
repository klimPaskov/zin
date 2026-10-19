# Text sweep: integration note

Written 19 October 2026 for the integrator. It covers the first slice of [05_text_sweep.md](../../specs/07_interface/05_text_sweep.md): the template engine, the family writer, the scan, and the families core, tooltips, alerts, mapmodes, rules, ranks (weekdays and rank names) and difficulty.
Nothing in `build.mjs`, `dispositions.json` or another engineer's module was edited.

## What exists

| Path | What it is |
| --- | --- |
| `tools/content/lib/loc_parse.mjs` | Reads localisation, splits a value into its engine structure (variables, scope calls, colour codes, icon codes) and its words, compares two values by structure only |
| `tools/content/lib/banned.mjs` | Compiles `banned_words.json`, `data/text/banned_extra.json` and the forbid words of every glossary entry; whole-word matching with possessive and hyphen rules |
| `tools/content/lib/text_engine.mjs` | The glossary index, the slot syntax (`{id:mod}`, `{name:key}`, `{loc:concept}`), frames, label composition from ids, and `renderFamily` |
| `tools/content/modules/text_sweep.mjs` | `buildTextSweep(staged, ctx)`: loads the family files, applies them to the vanilla key table, refuses what cannot be represented, writes the replace files and the people-variant scripted localisation |
| `tools/content/checks/text_scan.mjs` | `runTextScan(staged, ctx)`, `writeScanReport(staged, scan)`, `assertTextScan(scan)`, `summariseScan(scan)`; also a command line |
| `tools/content/data/text/` | `families.json` (the 23 families), `frames.json`, `banned_extra.json`, and the family files listed below |
| `tools/content/text_sweep.test.mjs` | 53 tests, 212 assertions, on a synthetic vanilla tree built by the test; two blocks use the installed game when `HOI4_GAME` is set |

The slot syntax, the six row kinds and the files follow the spec, with these differences that the integrator should know:

- The data folder is `data/text/` (the task's name), not `data/ui_text/`. `families.json` replaces the spec's `files.json`, and its `ownership`, `claims`, `exempt`, `otherFiles` and `reachOther` fields replace the spec's `ownership.json`, `exempt.json`, `reach_rules.json` and `engine_keys.json`.
- A family may be split into parts, `data/text/<family>.<part>.json`, which merge (a key written twice is an error). `alerts.energy.json` is the economy engineer's part.
- Row kinds in a family file: `lit` (a map key to text), `rows` with `stem` (a label composed from the key's own id), a frame call (`key` or `match`, `frame`, `slots`) or `same`, `neutral` and `engine` lists with a reason each. `tokenMap`, `phrases` and `drop` give a family's stem rows their stand-ins for ids that name things Erdae lacks.
- Gates are `off`, `report`, `banned`, `strict` (see the note of `families.json`). The spec's `warn` and `fail` map to `report` and `strict`; `banned` is new and fails only on a reachable key that still shows installed text holding an error-class banned word.

## Build calls

In `tools/content/build.mjs`, after `buildCalendar` and after `writeLocalisation(staged, vr.loc)` (so the sweep sees the keys that vanilla removal and the calendar already staged and leaves them alone):

```js
import { buildTextSweep } from './modules/text_sweep.mjs';
import { runTextScan, writeScanReport, assertTextScan } from './checks/text_scan.mjs';
// ...
const textSweep = await buildTextSweep(staged);
// ... after buildFocusTrees, before staged.write(out):
const textScan = await runTextScan(staged);
writeScanReport(staged, textScan);          // docs/design/validation/text_scan_report.json
assertTextScan(textScan);                   // throws on a failing finding
```

Add `textSweep` and `textScan.counts` to the summary the build prints. `assertTextScan` fails the build on: any X1, X11, X12 or X14 finding; any error finding in a family whose gate is not `off` (banned words in its ZIN text, lost placeholders or colour codes, copies, missing language copies, an installed banned word still shown at gate `banned` or `strict`). Text of other modules (family `other`) is reported, never failing, unless `runTextScan(staged, { strictAll: true })`.
Command line check of a staged directory: `node tools/content/checks/text_scan.mjs <stagedDir> [--report file] [--list]`. The scan needs `HOI4_GAME` for the installed localisation, interface and `common` files; without it only the ZIN-side checks run.

The sweep writes, per family with data, `localisation/replace/zin_<family>_l_<language>.yml` in all ten languages (the nine copy English), and `common/scripted_localisation/zin_terms.txt` with `localisation/replace/zin_terms_l_<language>.yml` for the people variants (manpower and division). The stage 4 whole-file conversion is not implemented: `buildTextSweep(staged, { stage: 4 })` throws.

## Dependencies on other slices

- **Calendar** (`modules/calendar.mjs`): owns the month keys. The sweep reads `monthKeys()` and never writes them.
- **Vanilla removal** (`modules/vanilla_removal.mjs`): its `zin_rethemed` keys and `ZIN_RULE_*` keys are already staged; the sweep skips any key another module staged, so a duplicate cannot arise. The kept game rules therefore need no work here: the vanilla `game_rules` keys are unreachable because stage 1 overrides `common/game_rules/00_game_rules.txt` with ZIN keys.
- **Economy**: `data/text/alerts.energy.json` holds the energy and Stored Essence alerts (`alert_lack_of_power_*`, `alert_out_of_fuel_*`) and `core.supply.json` holds the resource descriptions and the Stored Essence labels. `docs/design/stage2/economy.md` did not exist; the wording follows `03_gameplay/02_economy.md` (energy is Provisions fed by Grain, fuel is Stored Essence). The economy engineer may change the wording; the sweep refuses a row that drops a placeholder or an icon.
- **Frontend** (`frontend.mjs`): owns `FE_DIFFICULTY_*` and `ZIN_MENU_*` (families.json `ownership`). The sweep writes only the realm-side `diff_*_player` names and leaves `diff_hard_player` as shipped (Veteran is the glossary term).
- **Honours** (`text_honours.mjs`, spec 06): the weekday names, `rank1` to `rank4`, `naval_rank1` to `naval_rank4` and the six `DIVISION_EXPERIENCE_TITLE_*` keys are written here in `ranks.json` because the task asked for them. The citation, history and Honours text of `unit_medals_l_english.yml` (9 keys still show installed banned words) is left for that module; when it writes any key of `ranks.json` the sweep skips it.
- **Warfare, economy, diplomacy**: the families `tech`, `unit`, `equipment`, `ledger`, `diplomacy`, `politics`, `factions`, `intelligence`, `production`, `trade`, `supply`, `battle`, `naval`, `air` and `achievements` have gate `off` and no data file. The mechanism is ready: those authors add `data/text/<family>.json`, set the gate, and the scan measures them. Keys of these families that core or tooltips nest (for example `CONVOYS`, `DIVISIONS`, `nuclear_bomb`) still show installed text; the scan reports a hit that arrives only through such a nested key as a warning (and counts it as `vanillaNested`) so a family is judged on its own text.
- **Map step**: the installed strait and canal names (Suez, Panama, the Bosphorus and the rest) are exempt in `families.json` because ZIN's `map/adjacency_rules.txt` defines none. The step that adds a strait must write its name key and drop the matching exemption.
- **Proper names**: `{name:key}` reads `data/proper_names.json` when it exists (the names spec's renamed file). No family text uses it yet.

## Coverage on the installed game 1.19.3.0

Measured by `runTextScan` on the sweep plus the calendar, with the banned list, `banned_extra.json` and the glossary forbid words. "Installed banned" is a reachable key that still shows installed text holding an error-class banned word (a hit that arrives only through another family's nested key counts separately).

| Family | Keys | Reachable | Authored | Neutral, engine | Structural | Installed banned before | after | Gate |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| core | 2,484 | 2,437 | 517 (539 with calendar) | 5 | 139 | 426 | 0 (3 nested) | banned |
| tooltips | 4,108 | 3,274 | 1,459 | 2 | 38 | 793 | 0 | banned |
| alerts | 236 | 216 | 187 | 15 | 14 | 38 | 0 | strict |
| mapmodes | 147 | 105 | 38 | 0 | 0 | 20 | 0 | banned |
| rules | 865 | 22 | 15 | 0 | 1 | 6 | 0 | banned |
| ranks | 382 | 137 | 21 | 0 | 16 | 24 | 9 (text_honours) | report |
| difficulty | 7 | 4 | 3 | 1 | 0 | 0 | 0 | strict |
| **These seven** | **8,229** | **6,195** | **2,240** | | | **1,307** | **12** | |

The sweep writes 2,240 keys in 81 files (8 families, the people terms and ten languages). Over all 23 families the installed-banned count falls from 3,851 to 2,556 keys and the rest belong to the families with gate `off`.
What the installed text of the seven families still shows: 1,741 core and 1,615 tooltip keys with no banned word and no glossary concept that were not rewritten (plain labels such as Ready or Close, and modifier labels whose ids name nothing modern), plus 160 tooltip and 10 core keys with a review-class word or an Erdae concept the glossary renames. They are listed per family by `--list`; a stem row rewrites a modifier label only where its id names a banned concept, so the plain ones keep the game's text and the X4 copy check stays honest. They are the remaining authoring for the stage-4 gate, where gate `strict` requires them to be rewritten or put on a `neutral` list with a reason.
Banned words in ZIN text of the seven families: 0 errors. Review-class words in them: the strategic-region keys (allowance `al_strategic_regions`) and 12 nested modifier warnings that disappear when the equipment family lands.

## Decisions and deviations

1. **Hit-driven authoring.** The sweep module reads the installed key set and each key's placeholder signature, not its words. The author (this slice) read the installed text of the keys the scan listed and wrote new text. The tests and the build prove no installed value is copied: X4 fails an identical value or an 85% word overlap at five words, and the report never prints an installed value.
2. **Composed labels only where the id says so.** Modifier labels are composed from the id (glossary stems, multi-token glossary ids, `tokenMap`), and only for ids that contain a banned concept. This avoids rewriting hundreds of plain labels and then flagging them as copies.
3. **Extra banned rules** (`banned_extra.json`): infrastructure, intel, squadron and sortie vocabulary, KIA, EU4, real air forces (review: fighter, equipment, ideology). The spec says the list is a floor; the owner folds these into `banned_words.json`.
4. **Edits to `banned_words.json`** (data input of the spec): rule `bw_us_spelling_003` matched the British "colour" (pattern `colou?r`), now `color`; one allowance `al_strategic_regions` covers the review word "strategic" for the 13 keys that name the engine's strategic regions. Both are one-line changes.
5. **Tag-prefix exemption.** A key whose first three letters are the tag of a vanilla country is unreachable once only ZIN tags exist. CAN and MAN are also English words, so `CAN_*` and `MAN_*` generic keys count as reachable unless the rest looks per-country (`tagWords` in `families.json`).
6. **Reach.** Labels are reachable; object ids are reachable when a GUI or staged script names them, when the modifier documentation defines them, when an alert id prefixes them, or when the family declares `reachOther: all`. This is the spec's S1 to S5 reduced to what the staged tree and the installed game can answer without a render pass.
7. **A scripted localisation call** `[zin_term_*]` or `[zin_loc_*]` in ZIN text does not count as an engine call for placeholder parity.
8. **Sworn Loyalty** is used in `tooltips.effects.json` for the occupation meter the game calls collaboration (not in the glossary). The integrator may add the entry.
9. **Checks X16** (label length) is not run: it needs the interface render pass.

## Findings in other modules' text (reported by the scan, not fixed here)

- `localisation/english/zin_foundation_l_english.yml` (vanilla removal, `RULES` table of `modules/vanilla_removal.mjs`): "national focuses" in four `ZIN_RULE_ALLOW_WARGOALS_*_DESC` options, "Computer" in `ZIN_RULE_OPTION_AI_ONLY`, "factions" in `ZIN_RULE_ALLOW_PARTY_BOOSTING_FREE_DESC`. These are the rule texts of the family "game rules"; the keys are ZIN's own, so the sweep does not write them. Suggested wording: "Claims come only from focuses", "Realms Played by the Game Only", "sway the leagues of a foreign court".
- `localisation/replace/zin_loading_tips_l_english.yml` (frontend): 13 tips add colour codes the installed key does not have (X9, tips 150 to 162), and tips 51, 158, 168 and 189 hold Chancellor, war support, stability, special forces and focus tree. Family `platform`, gate `off`, so they are reported and do not fail the build.
- When this note was first drafted, `localisation/replace/world_l_english.yml` also held Narnia, Tornado Islands, North Earth, Dragon's Mountain, Aenorian and the words republic and satellite; the map slice has since replaced them and the scan reports none.
- The installed `modifiers_l_english.yml` line for `cannot_retreat_while_attacking_tt` holds a second entry on the same line; the sweep lists it under `engine` with that reason.

## Acceptance of this slice

| Check | State |
| --- | --- |
| Template engine with glossary slots, frames, stems, people variants, `§`, `£` and `$VAR$` kept from the vanilla key | done, tested |
| Scan X1 to X15 over the staged tree, report writer | done, tested; X16 not run |
| Families core, tooltips, alerts, game rules and difficulty, weekday and rank names, map modes and legends | written; coverage above |
| Energy alert text coordinated with the economy slice | `alerts.energy.json`, marked for the economy engineer |
| Tests with synthetic fixtures and the six negative cases | `text_sweep.test.mjs`, 212 assertions, in `npm test` |
