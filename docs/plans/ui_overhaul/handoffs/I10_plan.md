# UI overhaul phase 3 lane I10: event and news pictures, plan

**Date:** 1 November 2026. **Branch:** `zin/integration-r3` (shared checkout, uncommitted). **Lane row:** [02_plan.md](../02_plan.md), row I10. **Brief:** [phase2_brief.md](../phase2_brief.md). **Status:** planning inventory only; no picture generated and no code changed yet (see blockers).

## Confirmed count from a staged build (1 November 2026)

The lead (coordinator message) dropped the presentation split: I10 builds its own event-art module and changes only the event-picture assignment in `presentation.mjs`, re-reading the file before each edit. The count comes from a staged build, not from the JSON.

Staged build: `node tools/content/build.mjs <scratchpad>/staged-i10` with a private TEMP, exit 0 on the second run (the first run stopped in lane I5's `idea_art.mjs`, "accepted idea sheet idea-aenor-01 has no raw picture", which is not I10's file).

- **Visible country events: 1,263** (`country_event` blocks in the staged `events/*.txt`).
- **News events: 84** (`news_event` blocks).
- **Total: 1,347.** The brief's 1,213 visible events is lower by 134; the staged count is the basis for the budget.
- **Picture assignments in the staged events: 1,290**, using **69 distinct sprite keys** across event and news pictures. The heaviest are `generic_court` (238), `generic_wilds` (148), `generic_war` (104), `generic_sea` (97) and `generic_peace` (94).
- **Form sizes:** event 210 x 176 and news 397 x 153 are the constants in `presentation.mjs` (lines 37 and 38). The per-sprite dimensions of the vanilla `eventpictures.gfx` were not decoded.

Largest staged event files (country events, news events, picture lines):

| Staged file | Country | News | Picture |
| --- | --- | --- | --- |
| `zin_eindil.txt` | 167 | 9 | 89 |
| `zin_lore.txt` | 128 | 0 | 124 |
| `zin_deep.txt` | 108 | 0 | 108 |
| `zin_reign.txt` | 63 | 1 | 54 |
| `zin_lerendor.txt` | 41 | 0 | 31 |
| `zin_aenor_story.txt` | 34 | 8 | 33 |
| `zin_afrit_story.txt` | 29 | 9 | 32 |
| `zin_lastwar.txt` | 27 | 1 | 28 |
| `zin_ending.txt` | 28 | 0 | 26 |

Most staged files carry one picture line per event, so almost every event has its own picture today. The beat plan replaces that with one picture per beat.

## Budget (provisional until the Eindil grouping is written)

The brief's estimate is 300 to 400 event pictures and about 60 news pictures. One picture per beat gives that range only if beats average three to four events across 1,263 country events. The Eindil grouping (167 country events, 9 news) is the first measurement and sets the real budget; the lane does not claim a final number before it is written.

## Inventory from the declared event data (385 events with a picture)

| Source file | Events | Events with a picture | Chain |
| --- | --- | --- | --- |
| `events_world_eindil_1.json` | 21 | 21 | Eindil setup and pulse (ids 1, 2, 10 to 35) |
| `events_world_eindil_2.json` | 23 | 23 | Eindil stage 2 |
| `events_world_eindil_3.json` | 45 | 45 | Eindil stage 3 (ids 150 to 157 included) |
| `events_world_lastwar.json` | 28 | 28 | War of the Last Crowns |
| `events_crown_ending.json` | 26 | 26 | Endings (ending pictures: ashen throne, golden court, western crown, eastern king, strait master, children of Volgan, lost cause, unfinished) |
| `events_crown_reign1.json` | 31 | 31 | Crown reign 1 |
| `events_crown_reign2.json` | 23 | 23 | Crown reign 2 |
| `events_crown_world.json` | 11 | 11 | Crown world |
| `events_world_lore_1.json` | 47 | 45 | Lore 1 (2 events without a picture) |
| `events_world_lore_2.json` | 33 | 33 | Lore 2 |
| `events_world_lore_3.json` | 46 | 46 | Lore 3 |
| `events_mech_dominion.json` | 13 | 12 | Dominion mechanic |
| `events_mech_east.json` | 10 | 9 | Eastern mechanic |
| `events_mech_mistake.json` | 11 | 10 | Mistake mechanic |
| `events_mech_leren.json` | 7 | 6 | Leren envoys |
| `events_mech_elves.json` | 4 | 4 | Elves |
| `events_mech_dark.json` | 2 | 2 | Dark mechanic |
| `events_mech_diplo.json` | 2 | 2 | Diplomacy mechanic |
| `events_mech_sun.json` | 2 | 2 | Sun mechanic |
| `news_reach.json` | 0 events | n/a | News (regional and owned lists; news count 84 comes from elsewhere) |
| `events_mech_afrit.json`, `events_mech_misc.json`, `events_world.json`, `events_crown_chronicle.json`, `events_crown_hooks.json` | 0 | n/a | Sets, groups, hooks and lists: their events come from generators |

## Picture key situation

- 49 distinct picture keys are used by the declared events. Most are generic: `generic_war` (42 events), `generic_court` (35), `generic_wilds` (30), `generic_peace` (28), `generic_sea` (22). These five serve 157 events and are the first to replace.
- The story pictures (`man_in_ice`, `glo_given`, `last_crowns`, `king_is_dead`, `ending_*`) each serve one or two events.
- The cell map `tools/content/data/presentation-cells.json` lists 52 event entries with crop `both`, `standard` or `news`. The fallback key is `generic_court`.
- The 52 event pictures shipped from gpt-6-astra (`docs/plans/zin-art/astra_audit.md`) are regenerated here with gpt-6-luna.

## Beat grouping (to decide per chain once the lead split is done)

Beats are groups of consecutive events in one chain that share a scene, a place and a secrecy level. One picture per beat, reused by the beat's events. Each beat's picture must not show more than its first event reveals.

Order of work (main story first, as the brief asks):

1. Eindil (89 events across three files): setup and pulse, the Man in the Ice, stages 1 to 3, and the ending links.
2. Afrit (set-based, to be enumerated from `events_mech_afrit`).
3. War of the Last Crowns (`events_world_lastwar`, 28 events).
4. Endings (`events_crown_ending`, 26 events, one picture per ending key).
5. Crown reigns and world (`events_crown_reign1`, `reign2`, `world`, 65 events).
6. Lore (`events_world_lore_1` to `3`, 126 events).
7. Mechanics (dominion, east, mistake, leren, elves, dark, diplo, sun, 40 events) and the generated sets.
8. Regional and news (news pictures: 84 news events on 26 keys today; target about 60).

## Rules to keep (from the brief and the owner)

- Model `gpt-6-luna` only (`GPTIMAGE_MODEL=gpt-6-luna`), `IMAGEGEN_CONCURRENCY=3`, through `tools/content/imagegen.mjs`. The MCP image tool is not used for lane output, so the lock and provenance rules apply.
- Provenance is append-only in `art/source/provenance.jsonl` and in `<art store>/jobs/provenance.jsonl`.
- No crosses, real-world religious or national symbols (K53). Leaders mostly men, non-human peoples per `docs/specs/08_art_and_assets/07_peoples_appearance.md`, elves never dark-skinned (K54). No modern objects.
- Pictures show no more than the event text reveals (secrecy rules, `docs/specs/04_mechanics/00_shared_contract.md`, "The secret", and K61 for news).
- Canon: `docs/lore/vault/` (Canon Policy; use Eindil, not Einendil).

## Next steps

1. The lead splits `presentation.mjs` into the three modules named in the plan.
2. Confirm the event count (385 declared against 1,213 visible) from the staged build.
3. Write `tools/content/modules/presentation_events.mjs` (or the event builder module named by the lead) that loads the beat plan, cuts and resizes accepted art, and writes the event and news GFX.
4. Write the beat table `tools/content/data/event_beats.json` covering Eindil first, then the other chains, one row per beat with its picture key, prompt, references and secrecy note.
5. Generate the Eindil batch, review every picture at final size (210 x 176 and 397 x 153), regenerate failures, and record provenance.
