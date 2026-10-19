# The ZIN program: goal and definition of done

**Status:** In progress. Set 18 October 2026 from the owner's direction: "a fully playable ZIN mod, that doesn't have any errors and is fully stable and playable, and has full lore. Everything must become custom. Work autonomously."

This file is the goal every implementation session works toward. [ROADMAP.md](ROADMAP.md) orders the work; this file says when ZIN is finished. Progress is recorded in the table at the end.

## The goal

ZIN is finished when all of these hold.

### 1. Stable

- Every one of the 305 countries can be selected and played from 1 Thaw 4A 1748 for at least ten in-game years without a crash, on Windows and in the isolated Linux run.
- Observer runs (no player) reach 4A 1760 and 4A 1800 without a crash.
- Saving and loading works at any point, including mid-war and after every story beat.

### 2. Error-free

- `error.log` has **zero lines caused by ZIN files**, and zero lines from vanilla content the mod leaves active. Vanilla content that ZIN does not use is replaced (`replace_path`) or overridden so it never loads. The only allowed lines are engine messages that no mod file can affect, each listed with its reason in [09_validation/01_acceptance.md](09_validation/01_acceptance.md).
- Every HOI4 Agent Tools validator (script, focus, GUI, events, map, package) passes on the whole mod.

### 3. Playable

- Every country has an Erdae focus tree, working politics, a people, units it can recruit and technologies it can research.
- The great powers' mechanics work for players and the AI; the AI follows the historical path when the rule is on and diverges sensibly when it is off.
- All three canon endings and the proposed alternative outcomes are reachable.

### 4. Fully custom

Nothing a player sees is vanilla unless it is engine-generic (for example, the map's water shader):

- **Interface:** main menu, country selection, top bar, every major window, tooltips, buttons, frames, fonts' colours, cursors where possible, the Erdae bar and mechanic panels ([07_interface](07_interface/)).
- **Art:** loading screens, main menu backgrounds, event and news pictures, focus, idea, decision, technology, equipment and unit icons, unit counters, leader and general portraits, flags, the bookmark picture ([08_art_and_assets](08_art_and_assets/)). All image-generated; 3D units through Meshy.
- **Text:** loading-screen quotes and tips, every tooltip and name in Erdae terms; no modern words (factory, rifle, democracy, 1936) anywhere a player reads.
- **Calendar:** the Fourth Age calendar from 4A 1748.

### 5. Full lore

- Every established fact of the lore vault that belongs to the Fourth Age is in the game as a focus, event, decision, character, site or codex entry, and nothing contradicts the vault.
- The whole history of Erdae (cosmology, the ages, the figures) is readable in game in the **Chronicle of Erdae**, an in-game codex built from the vault ([07_interface/04_chronicle_codex.md](07_interface/04_chronicle_codex.md)).
- Proposed lore stays labelled proposed in the docs; in game it reads as the world's own history.

## How the work is run

- Specs first, then implementation, then verification, for every phase in [ROADMAP.md](ROADMAP.md).
- Large phases fan out to parallel agents with disjoint files; the integrator reviews, runs every check and commits.
- Every change is built by the content generators and written through the shared atomic rewrite engine; nothing is hand-edited in the mod.
- Every phase ends with the Linux run, the error-log budget check and a commit pushed to the public repository.
- The owner is not asked to decide anything the specs already decide. Lore questions in [OPEN_QUESTIONS.md](OPEN_QUESTIONS.md) proceed on their labelled proposals.

## Progress

| Area | State | Notes |
| --- | --- | --- |
| Planning package | done | 19 October: all 88 specs Ready (CONVENTIONS "Status"), 33 new integration decisions, 828 registered names, 28 owner questions with working proposals |
| Stable start for every country | in progress | The crash of every start since 17 October was the flag sheet overflowing (744 tags; integer divide by zero). Fixed 19 October by defining only ZIN tags and the dynamic tags (380); verified in Linux with the clock running. Every-country start test not yet run |
| Error-free log | in progress | 1,900 → 641 lines on 19 October (vanilla tags removed, 349 single-country vanilla files silenced, stage 1 replacements). The rest comes from generic vanilla files that stage 2 replaces |
| Map accuracy | specified | [01_map](01_map/) |
| Calendar 4A 1748 | specified | [00_foundation/01_start_and_calendar.md](00_foundation/01_start_and_calendar.md) |
| Peoples, ideologies | partial | ten peoples, four ideologies in game |
| Warfare | partial | five 3D infantry units; vanilla equipment and technology |
| Mechanics | specified | [04_mechanics](04_mechanics/) |
| Focus trees | specified | 13 major, 71 regional, 11 shared |
| Events and endings | specified | [06_events](06_events/) |
| Custom interface | partial | Realm panel only |
| Loading screens and quotes | partial | 24 loading screens, 3 menu backgrounds and 190 tips in game; spec: [08_art_and_assets/02_loading_screens_and_quotes.md](08_art_and_assets/02_loading_screens_and_quotes.md) |
| Chronicle codex | specified | [07_interface/04_chronicle_codex.md](07_interface/04_chronicle_codex.md) |
