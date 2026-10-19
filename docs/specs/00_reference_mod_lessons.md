# Reference mod lessons

**Status:** Draft. Studied 19 October 2026. Design research only: no asset, text, name or script of any reference mod is copied into ZIN, and the studies describe content generically. The three studies hold the evidence (folders and counts); this page keeps the lessons ZIN acts on.

| Study | Reference | What it is |
| --- | --- | --- |
| [lotr_mod.md](reference_lessons/lotr_mod.md) | A Middle-earth total overhaul | 93 vanilla folders replaced, a 9,534-province map, about 26 full trees for 47 static tags, special projects as spells, guilds, artifacts |
| [lotr_expanded.md](reference_lessons/lotr_expanded.md) | A Middle-earth expansion layer | An in-world calendar, a localisation-only rename layer, grant-only special units, a travelling-party story engine, per-path AI plans |
| [old_world_blues.md](reference_lessons/old_world_blues.md) | A post-apocalyptic total conversion | 95 replace paths, a 21,832-province map, 6 nation categories, 152 hidden technologies, 131 scripted GUIs, a 227-entry changelog |

## What all three agree on

1. **Replace the database, then stub it.** Every content folder the mod rewrites is replaced, and each carries a file so the engine never meets an empty folder. ZIN does this (vanilla removal stages) and adds a package check of the engine's minimums.
2. **Rename the vocabulary through one glossary.** The cheapest change of feel is a localisation layer that renames engine concepts. Every study did it and every study leaked vanilla labels afterwards. ZIN writes the glossary first and scans for leaks ([07_interface/05_text_sweep.md](07_interface/05_text_sweep.md)).
3. **Peoples are categories with a kit.** A hidden idea, a unit roster, a technology file, an advisor set and a portrait pool per people; shared content for minor countries. All three key this on tag lists, which breaks for spawned countries. ZIN keys it on a people variable on the country and the state.
4. **Monsters and heroes are non-buildable archetypes** unlocked by grant-only technologies, events or special projects, in small numbers (10 to 15 types), so each reads as an event.
5. **Reuse systems that already have an interface.** Special projects as spells, military-industrial organisations as guilds, the equipment designer for mounts and siege machines, balance of power for faction struggles.
6. **Depth where the story is, archetypes elsewhere.** About a dozen bespoke trees, shared trees by region or people for the rest, and a single generic tree behind them. The giants of 200 focuses read as filler: ZIN's tiers hold 30 to 70 focuses for a major tree.
7. **Control the AI by script.** Per-path plans, faction lockouts and an AI weight on every option; a validator checks that every focus a plan names exists and is reachable.
8. **Tooling pays for itself,** and validation on every commit prevents most of the bug classes the changelogs show (bad references, missing assets, empty folders, performance).

## Where ZIN goes further

- **Rules change, not only names.** Modern rules under new names read false (all studies). ZIN reshapes air into dragons, rockets into rituals, intelligence into court intrigue, and re-themes the energy system ([00_master_overhaul_plan.md](00_master_overhaul_plan.md), P5 to P9).
- **The front end is ZIN's own.** The expansion study leaves menu, loading, skin, fonts and music to its base; the other two ship third-party music or vanilla month names. ZIN supplies an original interface, calendar, music and sound.
- **A calendar that works.** Named months drive harvest, thaw, flood and long night through seasons and dynamic modifiers.
- **Artifacts live on the map and in people:** bound to characters and ruins, carried, lost, captured and cursed.
- **Mixed lands.** Population and faith vary by state; recruitment, labour and unrest come from the mix.
- **A visible hidden hand.** The story state is variables a panel can show, not ladders of numbered spirits; spirits are kept for art-heavy milestones.
- **A generated guide.** The Chronicle is built from the same data as the mechanics, so it never goes stale.
- **Layered geography.** Rivers, straits, passes and gates are data from a geography model, with the wrap, lakes and borders handled deliberately ([01_map/04_map_overhaul_plan.md](01_map/04_map_overhaul_plan.md)).

## Pitfalls to avoid (collected)

Version drift from older rules; zero-byte files that look like mistakes (keep a header comment); long ordered AI lists that stall on one renamed focus; spirit ladders that multiply art and text; grant-only content with no reachable grant; fragile file names with spaces; huge text files edited by hand; no readme or known-issues list; performance never measured. Each has a check or a convention in the master plan.
