# Reference study: a Middle-earth total conversion (Workshop 1314446921)

Read-only design research for ZIN (HOI4 1.19.3, Erdae). Nothing here is copied from the reference mod; ideas are described in my own words and its content is referred to generically. Counts were taken on 19 October 2026 from the installed Workshop folder.

## Summary: what makes it feel different

The reference mod does not build new systems so much as take over every vanilla slot and relabel it. It empties 93 vanilla folders through the descriptor (map, history, localisation, events, technologies, units, ideas, doctrines, names, music and more), so nothing modern survives by accident. Its armies are archers, cavalry, siege engines, trolls, spiders and winged mounts. Oil is food, aluminium is a rare metal, factories are workshops and guilds. The map, calendar number (a four-digit year in the 3000s, with a 1,000-year end date), flags, portraits and focus art are all new. The player knows it is not HOI4 within a minute because the main menu is a 3D scene of desk objects, the fonts are different, the top bar shows a creature-cap counter, and every country-select screen has a faction-specific background.

It sustains the difference with three layers: roughly 26 hand-built focus trees (about 2,900 focuses), a global quest that crosses the map and pulls every nation in, and a "peoples" layer that changes units, techs, advisors and portraits per race. It is weakest where it stopped at relabelling: leaked vanilla labels, vanilla in-game music and sound, vanilla month names, and the unfinished battle and focus-selection screens its own to-do list admits.

## Principles

**1. Own every slot; relabel what you keep.**
Lesson: reusing vanilla's artillery, armour, oil and fuel slots under new names is cheap and works if the new names are complete and the numbers are retuned.
Evidence: `localisation/english/replace/` 11 files, 3,689 lines; `common/units` 119 files with about 135 sub-unit types; `common/units/equipment` about 250 equipment definitions; about 470 technologies in 18 files; `common/defines` 2 files with about 100 overrides (fuel use scaled to 0.2, attrition lowered, division designer 6 by 4, aces switched off).
ZIN: **adapt**. Reuse the slots (supply-as-"fuel" for provisions, artillery for spell-casters or siege, air for dragons) but give each a ZIN-specific retune, and run a sweep for leaked labels (see Pitfalls).

**2. Wipe the vanilla folders deliberately.**
Lesson: replace-path everything you rewrite, so vanilla content never leaks in, and keep a short list of anti-crash stubs for what the engine insists on.
Evidence: descriptor lists 93 `replace_path` lines. The mod contains explicit crash guards: one dummy raid (the game crashes with no facility-targeting raid), dummy vanilla fighters kept so a capitulation cannot crash, and a deferred hidden event to avoid a same-frame ideology crash.
ZIN: **adopt**, plus a checklist of known engine minimums in the package check.

**3. A hand-built map at vanilla resolution, with an impassable dump.**
Lesson: a 5632 by 2048 map with 9,534 provinces (8,271 land, 1,253 sea or lake), 305 states, 151 strategic regions, 15 continents, 222 victory points, 353 adjacency rows (only 43 are sea crossings) and 11 custom terrains is enough for a continent-scale fantasy world. Unused or decorative land is dumped into one impassable wasteland state that swallows roughly a fifth of all land provinces by my rough count.
Evidence: `map/` 180 files, 122 MB (one 34 MB provinces bitmap, five 11 MB bitmaps, an editable terrain layered source kept in the repo); `definition.csv` terrain column; `history/states` 305 files; `common/terrain` adds dark ground, tunnels, deep-mine, hall and abyss types; 17 tunnel and 11 mine-type provinces model underground routes; 169 supply nodes and 262 railway rows.
ZIN: **adopt** the dump state and the underground-as-terrain idea; **adapt** by making underground, sky and sea-floor layers real adjacency graphs with their own supply rules, not just terrain tags. Aim for fewer, larger states (about 31 provinces per state is high for this mod; the player sees only 305 regions).

**4. Peoples are a stack of five thin layers.**
Lesson: no single race feature carries the difference; it is the stack. Layer one: a hidden idea per race with small numbers (organisation, speed, width, food use, leader-gender odds, population growth). Layer two: a race roster of sub-units. Layer three: a race tech file. Layer four: a generic advisor set per race. Layer five: a portrait pool per race.
Evidence: `common/ideas/lotr_races_modifiers.txt` 196 lines, six race ideas; six race tech files 461 to 923 lines each; 14 generic advisor files in `history/general`; `gfx/leaders` 1,683 portraits (493 men, 210 elves, 170 orcs, 168 dwarves, 50 small folk, 42 spiders plus per-country sets); a race map mode (`common/map_modes`).
Weakness: race is decided by lists of original tags plus a conversion flag, so any new or spawned country needs manual editing, and the tooltips for those modifiers are hard-coded text that drifts from the numbers.
ZIN: **adapt**. Store race as a variable on country and per state (mixed populations are a real Erdae feature), generate the tooltip from the variable, and use bigger asymmetries than plus or minus 10 percent (different supply, recruitment, labour and leader rules).

**5. Depth for a dozen powers, archetypes for the rest.**
Lesson: ~26 full trees for 47 static tags (about 55 percent), 4 small diplomatic trees, shared trees for tribe-like and valley-like groups, one generic tree for the rest, plus 51 dynamic tags for civil-war spawns.
Evidence: `common/national_focus` 38 files, ~100k lines, ~2,926 focus ids; largest trees 215, 189, 185, 183 and 179 focuses; shared trees of 24 to 44 focuses; 49 country files, 47 history files; `ai_strategy_plans` 21 files (5,657 lines).
ZIN: **adopt** the tiering; **avoid** matching the 200-focus giants, which are shown on one screen and read as filler. Aim for 30 to 70 focuses per major and 12 to 25 per archetype.

**6. Magic through the research-project system, trades through guilds.**
Lesson: vanilla's special projects (scientist breakthroughs, prototype outcomes) are a ready-made spell-research loop, and military-industrial organisations are a ready-made guild or order system, both with a finished UI.
Evidence: `common/special_projects/projects` 18 files (haste, weather, wards, curses, blessing-style effects), 1 shared reward file, the scientist skill-gain define raised; `military_industrial_organization/organizations` 26 files including 17 generic guilds; the filter labels in the guild window are relabelled (cavalry and machines, eagles, melee and archer equipment).
ZIN: **adopt**. Add one new thing: spell failures with lasting scars (a cursed province, a mad scientist), so magic has a cost beyond time.

**7. Artifacts as hidden ideas plus an array plus one list window.**
Lesson: each artifact is a hidden idea that registers itself in a country array; one scripted GUI lists the array, and a shared cooldown stops spam.
Evidence: `ideas/00_lotr_artifacts*.txt` about 275 lines, `scripted_effects/00_lotr_artifacts_effects.txt`, `interface/artifacts` 1 file, a scripted GUI with a dynamic list.
Weakness: artifacts belong to countries only, never to a character, a state or a battlefield.
ZIN: **adapt**. Bind artifacts to characters and ruins (carried, lost, captured, cursed), so a hero's death changes the map.

**8. Winged and giant units as capped, hero-like unit classes.**
Lesson: the air slot is repurposed for two flying beast families with three roles each, a global cap variable shown in the top bar, and rider, armour and weapon modules from the equipment designer. Land gets giants, trolls, spiders, tree-folk, war beasts and siege machines as normal sub-units, not scripted units.
Evidence: `units/equipment/00_eag_*` and `00_fellb_*` 6 files; `scripted_effects/lotr_eagles.txt` (cap rises by 5 or 15); `units/epic_units.txt`, `troll_units.txt`, `mumakil_units.txt`; 28 module files (horse breed, barding, rider arms, ship hull, siege mechanisms).
ZIN: **adopt** the cap and the designer-as-creativity-engine; **adapt** dragons as a growth cycle (egg, wyrmling, adult) rather than an equipment tier.

**9. A global quest token with intercept mechanics is the spine.**
Lesson: one shared object moves through a fixed sequence of states; every nation gets decisions, raids or forms to try to seize it, and holders are corrupted. It makes unrelated countries care about one geography, and it gives the player reasons to look at the map.
Evidence: `events/ring_events.txt` plus a start event with a different intro text per major; `decisions/ring_decisions.txt`; 20 files in `common/raids` including several landmark-bombing and token-destruction raids; 5 interface files in `interface/ring_related`; separate scripted GUIs for corruption and interception.
ZIN: **adapt**. Erdae has three planted seeds in the brief (Golden King, Eindil, Afrit). Make each a different kind of global object (a person, a hidden place, a weapon) with different intercept rules, so no two feel alike.

**10. Event density and consequence.**
Lesson: about 1,240 country events, 136 news events and 5 other event types across 58 files and 51,407 lines, with the largest 10 files holding about 60 percent. Chains are long (one story is over 1,800 lines, one is over 2,200 lines) and use delays from hours to a year, random jitter, flags and variables for consequence. News events announce capitulation, war and other big beats to everyone.
ZIN: **adopt** news events and delayed chains; **avoid** unlocalised hard-coded dates inside events (see Pitfalls).

**11. Custom mechanics each get their own small window.**
Lesson: the mod builds a specific screen per mechanic instead of one universal panel: 22 scripted GUIs (influence meters, assembly votes, hunger, lord factions, crisis tracks, corruption, artifacts), 3 balance-of-power tracks, 26 interface subfolders.
Evidence: `common/scripted_guis` 22 files, `common/bop` 3 files, `interface` 186 files and about 159k lines (much of it generated icon definitions).
ZIN: **adopt**, but share a single widget kit (meter, list, vote strip) so each new mechanic costs a day, not a week.

**12. The skin is real but shallow in sound.**
Lesson: fonts (2 families in 4 sizes), a rewritten top bar, event window, tech tree, focus view, country select (15 backgrounds) and main menu (35 files) change the feel. But it ships one loading image with 79 quotation tips, one main-menu music file, and no `sound` folder, so in-game audio is vanilla.
ZIN: **adopt** the per-country select backgrounds and a custom tech tree; **avoid** the audio gap, since sound is half of the first minute.

**13. The AI gets per-country plans, custom templates and cap tweaks.**
Lesson: a start-up on_action sets a gameplan flag per tag; `ai_strategy_plans` has 21 files; `ai_templates` 7 files (line-filler, infantry, push, suppression and race-specific); `ai_focuses` 9 files; 27 AI defines (cap on wanted divisions at 300, unit-upgrade reluctance, threat scaling); a historical-focus toggle; AI-only "cheat" decisions for the quest so it does not pay the political-power cost.
ZIN: **adopt** all; **adapt** by adding AI templates for beasts and mages and an AI test that records the share of countries that die in the first year.

## Scale table

| Item | Count |
|---|---|
| Files / size | 9,895 / 576 MB |
| Script lines (common, events, history, loc, interface) | about 317,900 / 51,400 / 31,900 / 27,300 / 158,900 |
| Localisation keys | about 22,700 in 148 files |
| Provinces / states / strategic regions | 9,534 / 305 / 151 |
| Countries (static / dynamic tags) | 47 / 51 |
| Focuses | about 2,926 in 38 files |
| Events (country / news) | about 1,240 / 136 in 58 files |
| Technologies / equipment / sub-units | about 470 / 250 / 135 |
| Ideas (incl. hidden) / decisions / characters | about 1,270 / 290 / 170 |
| Scripted effects / triggers / GUIs | about 660 / 470 / 22 |
| Raids / special projects / guilds | 20 / 18 / 26 |
| Gfx files | 7,966 (goal icons 1,866; portraits 1,683; flags 624; event art 932; idea icons 407; tech 331; counters 286; designer 348; decisions 271) |
| 3D | 54 meshes, 61 animations, 131 textures; about 9 soldier kits sharing one base mesh, 3 spider meshes, 5 ship meshes, 6 landmark models |
| Audio | 1 music track, 0 sound files |
| Largest single asset | 34 MB province bitmap |

Cost reading: the focus trees and events (about 150k lines) and the 8,000 gfx files dominate. 3D is deliberately thin.

## Pitfalls

- **Leaked vanilla labels.** Mixed names remain (self-propelled variants still tagged as vanilla, a "fake horses" label, tank-destroyer suffixes). ZIN should grep every vanilla key it has replaced and test every UI screen.
- **Vanilla leftovers kept for stability.** Nuclear raids, nuke events, plane frames and national infantry meshes from vanilla countries remain. Keep only what a crash guard needs and mark it clearly.
- **Calendar.** Months and weekday strings stay vanilla; a Third-Age-style number sits in the year. ZIN's Erdae calendar needs month localisation and any hard-coded date text reviewed.
- **Replace-path hygiene.** 7 listed paths have no top-level files or do not exist (harmless but sloppy). Check each against the package.
- **Hard-coded modifier tooltips** drift from real values; generate them.
- **Tag-list logic** (race, AI plans) breaks as soon as a tag is added.
- **Visual glitch.** The mod's FAQ lists strange white squares and recommends switching the renderer; treat any rendering workaround as a known defect to retest on ZIN's own shader assets.
- **Resolution and compatibility.** The authors say the UI is designed for 1080p and up and that the mod will not coexist with others. ZIN should test at 1366 by 768 and keep a clear incompatibility note.
- **Balance.** Authors admit balance suffers from a small team. Build a headless balance test early.
- **Unfinished UI.** The to-do list names the battle view and focus selector; the changelog file is empty.
- **Temp files accumulate** (temporary ideas, triggers, traits, effects). Delete or fold them in before release.
- **Dev tools as product.** The project ships docs, a graphics search tool and a wiki; they reduced onboarding cost for contributors and are worth copying (sub-mods and translations follow).

## Ideas for ZIN (beyond the reference)

1. **Layered worlds.** Underground, sky and deep-sea as separate graphs with their own supply and weather, linked by a small set of gates, so the map has height as well as width.
2. **Population as the engine of identity.** Each state holds a mix of peoples and a faith; recruitment, labour and unrest come from the mix, so a conquest of mixed land changes the army.
3. **Three kinds of global object** (person, hidden place, weapon) with different rules, each producing its own news and raid set.
4. **Artifacts and heroes as a shared system.** Heroes carry artifacts, die, are resurrected as the dead, and corrupt ground where they fall.
5. **Provisioning as the central constraint.** One resource (provisions, with magic-fed variants) replaces fuel, oil and rubber and decides what each people can field and where.
6. **Audio and loading as identity.** Commission a full soundscape per people and a loading screen set tied to the calendar, since the reference left both empty.
7. **Calendar-driven pacing.** Use the Erdae months and seasons for real mechanics (thaw, harvest, long night) via scripted localisation, dynamic modifiers and weather.
8. **Test harness.** Run ZIN's own package check, mechanic tests and scenario tests on every build, which the reference lacks except for a near-empty scenario-test folder.
