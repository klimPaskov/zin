# ZIN master overhaul plan

**Status:** Draft (19 October 2026). Becomes Ready after the improvement loop of the planning phase. Goal and criteria: [PROGRAM.md](PROGRAM.md). Phase order: [ROADMAP.md](ROADMAP.md). The 88 specs under this folder are the baseline; this plan adds identity, tracks, decisions and the gaps the inventory found.

## 1. Identity: what ZIN is

ZIN is **a chronicle of the last peaceful years of Erdae**. Nobody at the start knows a great war is coming. The Golden King reigns in Parim, the old leagues hold, caravans cross the Great Wall's gates, and the player feels, in small signs, that something is wrong. The campaign is a long dusk. A player should be able to say, one minute in: *this is not Hearts of Iron IV*.

**The first minute.** A menu with a painted Erdae scene and an original frame. A loading screen with a quote and a tip written for Erdae. A country-selection screen of crowns, banners and peoples, not of modern leaders. A map that reads as a continent of valleys, ranges and lakes, with names in a dozen languages. A date that reads "1 Thaw, 4A 1748" (done). A top bar of provisions, levies, forges, favour and the Gathering Dark. No modern word, icon or sound anywhere.

### Design pillars

Every system answers to these. A feature that serves none is cut.

1. **A world that is somewhere.** Geography decides where people live, where borders run and why wars start. Culture, language, faith and history come from the world bible, and names, populations, portraits and flags follow from it ([02_lore/05_world_bible.md](02_lore/05_world_bible.md), W1 to W5).
2. **Peoples change the rules, not only the skin.** Ten peoples play differently: elves keep leaders that never age out; orcs run a horde meter; trolls and giants field few, huge units; the dead have no population but upkeep; ents move with the seasons; demons are bound by oaths. The rules live in laws, dynamic modifiers and unit rosters, keyed by a people variable on the state and the country (mixed lands are real), never by lists of tags.
3. **The slow dread.** The story state is visible and hidden at once. The Gathering Dark is a meter the player can read; Afrit and Eindil are threads that reveal themselves through events, rumours and consequences. Peace is the opening state and a mechanic: tension rises through choices, not through a timer.
4. **The calendar is a mechanic.** Deepwinter to Longnight drive thaw, harvest, floods, long nights, supply and movement through seasons, dynamic modifiers and scripted localisation.
5. **Provisions and craft, not industry.** One economy of grain, timber, iron, stone, horses, gold and essence. Workshops, forges and yards replace factories. The vanilla energy system is re-themed as fuel for the forges (charcoal and coal), with its own alert and text.
6. **Magic, monsters and artifacts are combat roles and map objects.** Dragons fly the air layer; heroes carry artifacts that can be lost, captured or cursed; spells are research with a cost; monsters are non-buildable archetypes granted by story, never by the research queue.
7. **One hand-made look.** One original interface language (aged vellum, tarnished bronze, ink) with an ornament family per people; every window, icon, portrait, flag and picture follows it. All art is image-generated; 3D is Meshy.
8. **Everything is data and everything is checked.** Generators write the game; validators read it back; no hand-edited game file; the error log is a budget that ends at zero.

## 2. Decisions made by this plan

| # | Decision | Reason |
| --- | --- | --- |
| P1 | The map is rebuilt from a geography model with the improved HOI4 Agent Tools pipeline ([01_map/04_map_overhaul_plan.md](01_map/04_map_overhaul_plan.md), the tool plan in the tool repository). The 5,120 x 2,560 size stays; provinces rise to 9,000 to 11,000. | The owner's review; the tool audit shows the causes. |
| P2 | The world edge uses an open-sea band plus correct frame borders (rim wall as fallback). The probe maps are verified in the isolated Linux run, never on Windows. | The engine wraps the map and no setting removes it. |
| P3 | The Great Lake is an inland sea with a fresh-water look (sea provinces, a strategic region, ports on its shore); every other lake is a true lake province. | Lore puts ports on the Great Lake; a lake province cannot host fleets. |
| P4 | The Great Wall of Aenor is an impassable range with four to six named gates carrying level-5 forts. | "A hard border" in the vault; gameplay through the gates. |
| P5 | The vanilla energy system is re-themed, not deleted: fuel for the forges, its alert and texts rewritten, defines retuned for a pre-modern economy. | It has a finished interface; removing it risks crashes. |
| P6 | Modern systems are reshaped, not just renamed: air is dragons and the winged; rockets and nukes are rare rituals; lend-lease and licences become tribute and loans; the intelligence layer becomes court intrigue; the army headquarters and officer corps are kept as Erdae institutions. | The reference mods keep modern rules under new names and read false (lessons: LOTR Expanded, LOTR Mod). |
| P7 | Hidden grant-only technologies and sub-units carry monsters, heroes and people-restricted units. | Lesson: grant-only gates (LOTR Expanded, Old World Blues). |
| P8 | Magic uses special projects (research with failure and scars); guilds and orders use military-industrial organisations. | Both have finished interfaces (LOTR Mod). |
| P9 | Race is a variable on country and state; every tooltip reads the variable. | Lesson: tag lists break for spawned countries (LOTR Mod). |
| P10 | Vanilla interface text is replaced from one master glossary (text sweep, section 6); English is written, the other nine languages copy it. | About 12,000 core and 4,100 tooltip keys have no author. |
| P11 | The career profile, ribbons, medals, achievements, the wiki button and the officer-corps view are hidden or replaced; the weekday names are renamed. | Inventory owner questions, proposals adopted. |
| P12 | Music and sound are synthesised in code from ZIN-written scores and recipes; vanilla audio stays until each ZIN track is accepted. | INTEGRATION_DECISIONS A9. |
| P13 | The 40 available Meshy credits buy one 30-credit model, the Great Wall segment. Units of the other peoples reuse the five existing models with new image-generated textures; building houses reuse the vanilla mesh geometry with new image-generated textures (the mesh is referenced, not copied) until credits exist. These are the recorded fallbacks. | Credits are limited. |
| P14 | Languages are generated: every culture has a language, and names come from it. | W2. |

## 3. Tracks

The work runs in six tracks with disjoint files, so agents can work in parallel. Each track ends every wave with tests, validators, a Linux run, the error budget, a pushed commit and a progress update.

| Track | Owns | Specs and inventories | Depends on |
| --- | --- | --- | --- |
| **W. World** | World bible, languages, demography, culture assignment, names | `02_lore/05..08`, inventory politics_story | none to start; feeds M, C, A |
| **M. Map and tools** | The tool improvements, the geography model, the map generation, the politics step on the new map, key sites, state and region names | `01_map/`, tool plan, inventory map_assets_sound | W (names, population) for the final pass |
| **S. Systems** | Stage 2 vanilla removal: technologies, doctrines, units, equipment, resources, buildings, energy, laws, factions, diplomacy, peace, intelligence, rules, ideologies, defines; the vanilla text sweep | `00_foundation/`, `03_gameplay/`, inventory warfare_economy | M for state data |
| **I. Interface** | The full reskin, main menu, top bar, panels, alerts, tooltips, fonts, cursors, the Chronicle codex | `07_interface/`, inventory ui | S for the strings, A for sprites |
| **C. Content** | Focus compiler and trees for 305 countries, events, mechanics, decisions, characters, AI strategies, story | `04_mechanics/`, `05_focus_trees/`, `06_events/`, inventory politics_story | S for the names, W for flavour, M for states |
| **A. Assets** | Icons, portraits, flags, pictures, loading art, 3D, music and sound, the asset manifest and its checks | `08_art_and_assets/`, inventory map_assets_sound | W (cultures), S and C (what needs art) |

## 4. Phases

The ROADMAP orders waves; each wave is complete when its criteria are checked.

| Wave | Work | Criteria met |
| --- | --- | --- |
| **0. Plan** | Goal, inventory, lessons, master plan, map and tool plans, specs for gaps, world bible. Calendar, defines and acceptance harness built. | P3, T1 |
| **1. Foundations** | Tool phase 0 (lakes, colour map, validators, edge) and C5 (geography input); geography model; focus compiler; stage 2 vanilla removal begins (technologies, units, equipment); world bible and languages; UI frame and glossary; art pipeline and asset manifest checks. | M2, M3 (probe), partial S1, W1, W2 |
| **2. The new world** | Relief, hydrology, climate and look (C6 to C8); partition and borders (C9 to C11); the map is generated; the politics step reruns on it with the demography model and language names; key sites; straits and passes (C12, C13). | M1 to M9, W3, W5 |
| **3. The ruleset** | Warfare, economy, energy, diplomacy, rules and ideologies complete; the vanilla text sweep; the error budget reaches stage 3. | S1, S2, S4, T2 to T4 |
| **4. The interface** | The full UI reskin, main menu, panels, alerts, fonts, cursors, loading, the Erdae bar; sprites; the Chronicle. | U1 to U3, T5, C4 |
| **5. The story** | Trees for all 305 countries, events and endings, mechanics, characters, portraits, AI. | C1 to C3, C5, S3, S5, AI1, AI2, W4 |
| **6. Polish and proof** | Audio, assets complete and unique, the every-country sweep, observer runs to 4A 1800, save and load, zero error budget, the final report. | A1 to A4, V1 to V6, P4 |

Waves overlap: tracks start when their inputs exist, not when the wave number comes up. The map track is the critical path; the story track is the largest in volume.

## 5. What the inventory found (734 rows)

| Surface | Rows | Replace / reskin / override / remove | Done | GAP | Reference |
| --- | --- | --- | --- | --- | --- |
| Interface and presentation | 172 | 46 / 94 / 7 / 4 | 18 | 17 | [inventory/ui.md](inventory/ui.md) |
| Warfare, technology, economy | 203 | 102 / 48 / 20 / 26 | 4 | 27 | [inventory/warfare_economy.md](inventory/warfare_economy.md) |
| Politics, diplomacy, story, AI | 191 | 113 / 31 / 23 / 2 | 37 | 21 | [inventory/politics_story.md](inventory/politics_story.md) |
| Map, assets, sound, text | 168 | 72 / 12 / 31 / 9 | 39 | 49 | [inventory/map_assets_sound.md](inventory/map_assets_sound.md) |

The GAP rows (114 in all) become specs in wave 0: see section 7. The CSV files are the checklist for T2: every row with `replace`, `override`, `reskin` or `remove` must reach `done`.

## 6. The vanilla text sweep

The largest unowned job. About 12,000 interface keys, 4,100 tooltip keys, the unit and equipment names, the tech descriptions, the rank and weekday names and the alert texts all say modern things. The sweep works like this:

1. A **master glossary** (`tools/content/data/glossary.json`): every engine concept mapped to its Erdae term (factory to workshop, division to host, general to captain-general, and so on), by people where a people differs. It is the single source; all builders read it.
2. **Key families.** The inventory lists each family (core, tooltips, alerts, tech, unit, equipment, ledger, diplomacy). For each, a builder module writes `localisation/replace/zin_<family>_l_english.yml` from templates and the glossary, never a copy of vanilla text.
3. **Scan.** A build check collects every vanilla key the game can still display (from loaded GUI and scripts), checks it is replaced, and scans all shown text for the banned list (modern words, "1936", real-world names). Unreplaced keys fail the build.
4. Nine other languages copy the English text.

Agents write the families in parallel (one family each, disjoint files), then the scan decides what is left.

## 7. Gap specs to write (wave 0)

Each gap is a spec under `docs/specs/` in the house style; the inventory row ids are the checklist.

| Spec | Covers (inventory rows) |
| --- | --- |
| `03_gameplay/07_industry_and_electronics_techs.md` | the ~40 industry and electronics technologies, names, years (WE-013 to 018) |
| `03_gameplay/08_institutions.md` | army headquarters, officer corps, ranks, command power, the market, licences, lend-lease, cryptography, intelligence upgrades |
| `03_gameplay/09_naval_air_doctrines.md` | the ~16 naval and air subdoctrines (WE-034, 035) |
| `07_interface/05_text_sweep.md` | section 6 in full: key families, glossary, scan |
| `07_interface/06_career_honours.md` | profile, ribbons, medals, achievements, wiki button, weekdays |
| `01_map/04_map_overhaul_plan.md` | the map rebuild on the tool plan |
| `08_art_and_assets/05_asset_manifest.md` | the asset manifest, uniqueness rules, the completeness check, unit voices decision, battle-plan names, template icons, tactic pictures, medals, particles, trains, the railway texture |
| `09_validation/02_ai_defaults.md` | AI strategies and templates for every country (defaults vanish with `common/ai_strategy`) |

Crash-safety lists from the inventories become the package check: keys that must stay defined (`convoy`, `train_equipment`, `motorized_equipment`, `rocket_site`, default focus tree, default sprites, the `-1` adjacency terminator, `definition.csv` row 0, terrain categories `unknown`, `ocean`, `lakes`, `maintheme`, `tutorial`), folders that must never be `replace_path`'d (`common/unit_leader`), and the tag total below 439.

## 8. The tool plan

Map: `docs/plans/zin-map-pipeline.md` in HOI4 Agent Tools (15 tool changes C1 to C15, about 83 engineer-days, run in parallel by worktree agents and merged through pull requests). Broader gaps are logged in `docs/plans/tool-gaps.md` and become tool changes when ZIN hits them: bulk map edits above the 100-operation limit, localisation validation, asset and flag validation, a country-history inspector, scenario tests for map facts, error-log to map lookup. ZIN-only checks live in `tools/content/checks/`: asset completeness, text scan, uniqueness, name leak, demography, culture coverage.

## 9. Budgets and limits

- **Meshy:** 40 credits: see P13. A top-up would unlock unique models per people (about 433 credits).
- **Image generation:** the gptimage route, about 1.57 megapixels per image; generation runs in batches by asset family with provenance. The asset manifest holds the counts; the budget is time, and speed counts.
- **Language:** English only is written.

## 10. Risks

| Risk | Mitigation |
| --- | --- |
| The in-game look of lakes and colour is derived, not observed | Probe maps in the Linux run; screenshots at each tool phase |
| Replacing `common/units` or `common/ai_*` crashes the game | The package check's must-keep list; a Linux run after each replaced folder |
| Map rebuild invalidates states, histories and the specs that name states | State-independent naming (sites by geography id, not state number); the politics step reruns; key sites table regenerated |
| Volume (305 trees, thousands of events) | The compiler, templates per people, tiers, agent fan-out with validators |
| Agent output drift | One glossary, one registry, build-time name checks, the improvement loop |
| Engine facts unverified (lakes at 93 vs 89, wrap, ports on lakes) | Probes before commitment; fallbacks written in the tool plan |

## 11. Owner questions

All proceed on the proposals in [OPEN_QUESTIONS.md](OPEN_QUESTIONS.md). New ones from this plan: none blocks work; the choices above (P1 to P14) are made.
