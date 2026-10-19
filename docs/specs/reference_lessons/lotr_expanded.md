# Reference lessons: a Middle-earth expansion layer for HOI4

Studied read-only on 19 October 2026. Design research only; nothing here is copied from the reference, and its content is described generically.

Framing that matters: the reference is an **expansion**, not a total conversion. Its descriptor depends on a larger base mod and targets game version 1.17. The menu, loading screens, UI skin, fonts, music, equipment and technology trees, spirit-art pipeline, artifact-bearer system and much of the map live in that base, which I could not measure. What I could measure is the layer on top: 17 countries added or reworked, ten focus trees, about 280 events, a province-level map revision and many presentation overwrites. That layer is still a good model for carrying a large fantasy setting on HOI4 rules with a small team.

## Summary: what makes it feel different

1. **The calendar is moved into the setting.** The only bookmark starts in an in-world year in the three-thousands using the ordinary date field, and technologies are keyed to that year. The player never sees 1936. ZIN's 4A 1748 start uses the same trick and is safe.
2. **Everything the player reads is renamed while the rules stay HOI4's.** A localisation-only "replace" folder turns trucks into carriages, destroyers into longships, artillery into archers, anti-tank into ballistae, and rewrites unit-group titles, tech names and equipment descriptions. No modern word survives on screen, but the combat engine underneath is unchanged.
3. **Each people is a class of country, not a skin.** Elves, dwarves, orcs, several human cultures, spiders and others are identified by scripted triggers built from tags plus switch flags. Portraits, name lists, traits, ideas and units hang off those identities, and a country can change people in play by flipping a flag.
4. **HOI4's four ideologies are reinterpreted as story paths** for each major country, each with a historical and an unhistorical script.
5. **Dense hand-written focus trees for a few countries, thin content for the rest.** 883 focuses across ten trees, against 0 to 10 focuses for the minor ones.

## Principles

| # | Lesson | Evidence | ZIN stance |
|---|---|---|---|
| 1 | Reskin the vocabulary first. A dedicated replace folder overwrites names and descriptions and is immune to load order. | `localisation/english/replace`: 8 files, about 25 KB (equipment, units, techs, country names, generic keys) | **Adopt** for every vanilla key still visible. Then go further and change mechanics so the words never lie. |
| 2 | Hide special units behind a never-researchable gate. The unit is defined inactive, a one-point tech with `allow = always no` enables it, and a focus or event grants the tech. | `common/units`: 2 files, 13 sub-units (giants, a fire demon, a dark-lord unit, forest, spider and tree-herd infantry, chariots); `common/technologies`: 1 grant-only file | **Adopt** for heroes, dragons, ents, trolls, giants, yeti. Unlock by event, artifact or alliance, never from the research queue. |
| 3 | Reuse a few meshes and differentiate through icons. No new 3D model ships. | `gfx/entities`: 1 real file, 50 entity blocks, only 4 distinct meshes (soldier, regional soldier, horse rider, catapult); 0 mesh or animation files; 4 unit counter icons | **Adapt**. Reuse is fine for men and orcs, but monsters need distinct silhouettes. Budget sprites and counters, not 3D rigs. |
| 4 | Blank the vanilla visuals you do not want. | 8 vanilla-style entity files ship at 0 bytes (likely to suppress modern vehicles; I could not confirm) | **Adopt** carefully and test that no unit or ship still points at a blanked entity. |
| 5 | Hide mechanics inside national spirits. A meter is a ladder of numbered ideas swapped by events and decisions, plus a decision category that appears only after a focus. | `common/ideas`: 8 files, 242 ideas with art, one trade meter with about a dozen tiers; `common/decisions`: 5 files, 173 decisions, 4 category files; 215 timed or swapped idea calls | **Adapt**. It needs no GUI work but ladders bloat files. Drive tiers from a variable and one dynamic modifier where possible; keep ladders only where each level needs its own icon. |
| 6 | Story as simulated global state. A travelling party runs from global flags, a day counter and an event-log array; countries it passes get choice events with weighted AI answers. | `events/ring_events`: 12 events; the largest elf-realm file has 111 events and 111 options; 188 `set_country_flag` calls; 28 variable operations | **Adopt** the idea of one wandering actor that spawns events in many countries. Use it for the Afrit and Eindil threads. |
| 7 | Every event option carries AI weights. | 927 `ai_will_do` or `ai_chance` blocks across 54,000 script lines; about 390 event options | **Adopt** as a hard rule: no option or decision without a weight. |
| 8 | Script the AI per country and per path. A plan file lists an ordered focus sequence for the historical case and others for deviations; a central gameplan effect rolls a path using neighbours and government. | `common/ai_strategy_plans`: 5 files, plans up to about 30 focuses; `common/ai_strategy`: 3; `scripted_effects/00_gameplan.txt`: 24 KB | **Adopt**, with a validator that checks every named focus exists and is reachable. |
| 9 | Control diplomacy hard. War-declaration rules, call-to-war rules, 32 faction goals and idea-based lockouts stop the AI forming nonsense blocs. | `common/factions`: 3 files; hidden ideas that forbid joining or creating factions and set ally desire to a huge negative; 2 peace-conference AI files | **Adopt**. In a ten-peoples world, key faction rules on people and creed, not ideology. |
| 10 | Group portraits, AI areas and names by region or realm keys. | `portraits/00_portraits.txt`: 6,775 lines, dozens of pools; `common/ai_areas`: 2 files; `common/names`: 54 name blocks, 24 KB | **Adapt**. Race-based pools are right; key ZIN by people and culture instead of repurposing continents. |
| 11 | A special autonomy level can carry a fantasy relationship. | `common/autonomous_states`: 1 file, available only if the overlord's leader has a given trait | **Adopt** for oath-bound, thrall, dragon-tribute and Afrit-bound states. |
| 12 | Put content where the story is. | Trees of 197, 195, 115, 114, 77, 75, 59 and 41 focuses; minors 0 to 10 | **Adapt**. Decide the tier list up front (see Ideas). |
| 13 | Tooling pays for itself. Python scripts turn folders of images into sprite definition files for focus icons, spirits, decisions, flags, leaders and traits, plus a generated static search page of every picture. | `tools`: 25 Python files, 13 batch files, 865 preview images | **Adopt**. ZIN's generated-art pipeline needs drop-image, run-script, get-entry. |
| 14 | Treat the map as disciplined geography. Rivers, crossings, straits and named adjacencies are explicit data. | `map`: 9,172 provinces (7,833 land, 1,335 sea, 6 lakes; about 3,800 plains and 1,300 ocean), 905 adjacency rows, 1 adjacency-rule file, 59 strategic regions, 220 rail lines, 167 supply nodes, 115 state files | **Adopt** the crossing and river rigour. **Adapt** terrain: a few fantasy classes (a dark ground class has 142 provinces) beat many. |

## Scale table

| Item | Count | Notes |
|---|---|---|
| Files (excluding tooling and version history) | 718 | about 99 MB; 86 MB is map data |
| Script lines, `common` plus `events` | 54,000 | `common` 44,000; `events` 10,600 |
| Focuses | 883 in 10 trees | 27,600 lines; typical cost 5 or 10 |
| Events | about 283 | about 225 plain country events, rest news or hidden |
| Event options | about 390 | nearly all with AI weights |
| Decisions | 173 in 5 files | 4 categories |
| National spirits | 242 in 8 files | |
| Characters | about 216 in 15 files | 6 leader-trait files |
| Sub-units | 13 | none with new 3D models |
| History: states / countries / OOB files | 115 / 17 / about 26 | |
| Localisation | 5,600 lines, 31 files | one stray duplicate |
| Images | 361 files in `gfx` | 219 flag files, 103 focus icons and leaders, 255 sprite types in `.gfx` |
| Map | 9,172 provinces | 59 strategic regions |
| Sound, scripted GUI, fonts, music | 0 | all left to the base |
| Version history | 148 commits over 15 months | small team, rolling fixes |

## Pitfalls

1. **Version drift.** The descriptor targets 1.17 while ZIN is on 1.19.3. Do not inherit patterns from older rules without running the validator.
2. **Zero-byte files in release.** Eight blank entity files, an empty AI-focus file and a 17-byte character file look like mistakes. Keep a comment header in anything intentionally empty.
3. **Stray artifacts.** A duplicate localisation file with a foreign-language "copy" suffix, a file name with a space before the extension, and many names with spaces or diacritics. They work on Windows and are fragile elsewhere.
4. **Long ordered AI lists are brittle.** One renamed or unreachable focus quietly stalls the AI.
5. **Idea ladders multiply** picture and localisation entries and make balance edits error-prone.
6. **Dependency chains.** An expansion inherits every base bug, load order issue and tag clash. ZIN is standalone and should own every tag, replacing vanilla history rather than reusing it.
7. **No changelog, readme or known-issue list in the package.** Feedback has nowhere to land, and the history shows generic messages such as bug fixes and blind fixes.
8. **Map text is fragile.** The unit-stack file is 6.8 MB and the buildings file 1.1 MB. One bad line breaks loading, so validate after every edit.
9. **Grant-only units need a reachable grant.** If the unlocking flag or focus is unreachable for the AI, the unit is dead content.
10. **Two race triggers.** The reference separates "is this people now" (flag-aware) from "was it this people at start" (tag-only). That is good design, but only if every file uses the right one. Define both once and ban ad hoc checks.
11. **Performance is not addressed anywhere** in the layer: no scripted-effect throttling, no on-action budgets. Large event files with hundreds of hidden checks per day should be profiled.

## Ideas for ZIN: how to go beyond it

- **Replace more than words.** The reference keeps vehicle and aircraft rules under new names. ZIN should model monsters, mages and artifact bearers as real combat roles (support companies, leader traits, terrain and magic-tide bonuses) and remove the modern branches from sight, not just from text.
- **Own the front end.** The reference leaves menu, loading, UI skin, fonts and music to its base. ZIN must supply an Erdae menu scene, loading tips, a hand-drawn top bar, event frames per people, fonts and a score. This alone changes the first minute.
- **Race as a first-class system:** one trigger set used by every file, per-people laws, recruitment and research, and conversion events (to the dead, to troll rule) that carry units, portraits and names along.
- **Variable-driven meters with a real panel** (scripted GUI) for the Golden King's favour, the Afrit's hidden influence and Eindil sightings, instead of spirit ladders. Keep spirits for art-heavy milestones.
- **Several moving actors** rather than one: a waking dragon, an elven embassy, the hidden power's agents, all writing into an in-world chronicle the player can open.
- **A tiered coverage plan:** about 8 hero nations at 100 to 200 focuses, about 20 mid nations at 30 to 60, and every other country on a shared per-people tree of 15 to 25 focuses plus a regional event chain. No country ships with an empty tree.
- **AI and reference validation as a build step.** Check every focus named in an AI plan, every idea against its picture, every hidden tech against a grant path, and every option against an AI weight; fail on any miss.
- **Art tooling ahead of art.** Build folder-to-sprite scripts and a searchable preview page before the first image batch, then let the image generator feed it.
- **Terrain with consequences.** Ruins, ash fields, enchanted forest and glacier each get supply, movement and magic effects, and read clearly on the map.
- **Ship docs from day one:** changelog, known issues and a modder guide.
