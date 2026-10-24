# The ZIN program: goal and completion criteria

**Status:** In progress. Goal set 18 October 2026, rewritten 19 October 2026, and re-based on 24 October 2026 on the handoff package `docs/zin-handoff/` (requirements R-xx in `02-TOTAL-OVERHAUL-SPEC.md`, acceptance checks A-xx in `04-EXECUTION-AND-ACCEPTANCE.md`).

This file is the single progress record. The criteria are the A-checks of the handoff package; this file does not keep a second checklist. Anyone resuming after a context reset reads this file first, then the resume packet at the end.

## The goal

ZIN is a complete, playable Hearts of Iron IV 1.19.3 total overhaul set on **Aoaz** (the main setting, formerly called Erdae), delivered as one finished assignment. From the main menu to the end screen, nothing the player sees, hears or reads is vanilla or real-world. The campaign opens in 4A 1748 of the Fourth Age: the Golden King reigns, Eindil has not appeared, Afrit is hidden, and Aoaz seems at peace. The established storyline runs to 4A 1760; the sandbox continues to 4A 1800. Planning, a demo, a first map import, a new main menu or a partly converted game do not count (R-00).

## Completion criteria

A criterion is **met** only when its check has run on the current build and passed, with the evidence recorded below. "Linux run" means the isolated Linux game under the shared WSL lock `/tmp/hoi4_wsl.lock`, with the clock unpaused (`tools/acceptance/`); the Windows game is never launched, automated or captured. The definition of done is 04, section 7.

| Check | Requirement | State | Evidence (date) |
| --- | --- | --- | --- |
| A-01 | R-01 Erdae and Aoaz exchanged | migration applied; check added; game files regenerate at the next apply | `81bc85a`, `tools/migrations/aoaz_name_exchange.applied.json`, `docs/lore/names_traceability.md`, text-scan rules `bw_setting_names_*` (24 Oct) |
| A-02 | R-02 Great Wall a natural range | sources corrected (K2, P4 and P13 void); vault and map pending | `INTEGRATION_DECISIONS.md` K2 (24 Oct) |
| A-03 | R-03 Zol's servant in the war | waits for owner question Q-03 | |
| A-04 | R-04 contradiction register | in progress | |
| A-10 | R-10 drawn map imported through MCP | MCP worker designing the import (ZR-2) | |
| A-11 | R-11, R-18 terrain, relief, rivers, edge | not started | |
| A-12 | R-12, R-15 borders and regions | not started | |
| A-13 | R-13 coherent sea names | not started | |
| A-14 | R-14 the Nether below the Ember Lands | dossier in progress | |
| A-16 | R-16, R-17 settlements, resources | not started | |
| A-19 | R-19 regional dossiers | in progress | |
| A-20 | R-20, R-21, R-26 peoples, cultures, forms | not started | |
| A-22 | R-22 Hirolon | dossier in progress; Q-05 open | |
| A-24 | R-24, R-25 fewer elves, varied Middle Lands | dossiers propose the roster | |
| A-27 | R-27 real tags below 439 | not started (tags are still Y01 style) | |
| A-28 | R-28 country and faction names | not started | |
| A-29 | R-29 population | not started | |
| A-30 | R-30 to R-32 twelve gods, calendar, faith | waits for Q-01, Q-02 | |
| A-33 | R-33 knowledge layers | not started | |
| A-34 | R-34, R-35 wizards and magic | Q-09 open | |
| A-40 | R-23, R-40, R-41 bestiary, devils, ecology | transcription in progress | |
| A-45 | R-45 regional histories | schema exists; no regional files | |
| A-46 | R-46 alternate history | not started | |
| A-47 | R-47, R-48 continuing lore, references | in progress | |
| A-50 | R-50, R-51 naming | generator built (19 Oct); revision pending | |
| A-52 | R-52 clean text | text scan built (19 Oct) | |
| A-60 | R-60, R-67, R-68 ruleset, rules, inherited systems | stage 2 built (19 Oct), unverified in game | |
| A-61 | R-61 focus trees | 95 trees written (19 Oct); integration round 3 running | |
| A-62 | R-62 mechanics | slices written; integration round 3 running | |
| A-63 | R-63, R-64 story, events, decisions | crown and world events written; integration round 3 running | |
| A-65 | R-65 characters and portraits | not started | |
| A-66 | R-66 AI | forces and templates built (19 Oct) | |
| A-80 | R-80, R-81 interface coverage | reskin infrastructure; 204 textures pending (19 Oct) | |
| A-82 | R-82, R-83 states, resolutions, tooltips | not started | |
| A-90 | R-90 owner's branding | not started | |
| A-91 | R-91 gfx standard | `lib/gfx_standard.mjs` written (19 Oct), not wired | |
| A-92 | R-92 flags | not started | |
| A-93 | R-93, R-94 unique art, units and 3D | manifest and checks built; Meshy not connected (24 Oct) | |
| A-96 | R-96 music and sound | waits for Q-08 | |
| A-98 | R-98, R-99 zero errors, sweep, observer runs, save and load, performance | not started | |

### Owner review rules (19 October 2026) and their checks

| Rule | Checked by |
| --- | --- |
| F1 no bureaucratic names | A-28, A-52 |
| F2 real three-letter tags, total below 439 | A-27 |
| F3 no country named after its leader | A-28 |
| F4 flags with culture and purpose | A-92 |
| F5 coherent geography, the Nether below the Ember Lands | A-11, A-13, A-14 |
| F6 no debug or placeholder text, no separators in names | A-52 |
| F7 lore quotes carry worldbuilding | A-52 |
| F8 gfx standard (transparent emblems) | A-91 |

### Where the 19 October criteria went

M1 to M9 are A-10 to A-16 and A-27; W1 to W5 are A-19, A-20, A-29, A-45, A-50; T1 is A-30 (the calendar is rebuilt on the twelve gods); T2 to T5 are A-52, A-60, A-80; S1 to S5 are A-60 and A-62; U1 to U3 are A-80 and A-82; C1 to C5 are A-61, A-63, A-65; A1 to A4 are A-91, A-93, A-96; AI1 and AI2 are A-66 and A-46; V1 to V6 and P1 to P4 are A-98 and the tranche discipline of 04, section 3.

## Scope decisions

- **All of it is in** (R-00). Nothing is deferred to a later pass; a blocker is reported with evidence (04, section 6) and never counted as done.
- **Order is by dependency** (04, section 1): name migrations before new text; the geography and the drawn-map import before states, the roster and the politics step; systems and content revised on the new roster; presentation; proof.
- **Owner questions** Q-01 to Q-10 (`docs/zin-handoff/01-CONTEXT-AND-CANON.md` section 7, sent 24 October 2026 as `docs/zin-handoff/OWNER-QUESTIONS.md`) block only the work they name.
- **Out of scope:** written languages beyond English (the other nine copy English), multiplayer balance, Steam Workshop publishing.

## Progress log

| Date | Tranche | What happened | Evidence |
| --- | --- | --- | --- |
| 24 Oct 2026 | T0 | State reconciled (`docs/zin-handoff/STATE-DELTA.md`); the 19 October work preserved in nine commits on `zin/integration-r3`; the dedicated MCP worker started (separate session, `claude-opus-5-5`); owner questions sent; Erdae and Aoaz exchanged; corrections K1 to K8 recorded | `f8e3ba4` to `81bc85a` |

## Resume packet

1. Read this file, then `docs/zin-handoff/README.md` and the package it lists, then `INTEGRATION_DECISIONS.md` and `CONVENTIONS.md`.
2. Repositories: the mod `C:/Users/klimp/OneDrive/Documents/Paradox Interactive/Hearts of Iron IV/mod/zin` (public; work branch `zin/integration-r3` until the build is green, then `master`); the tool `C:/Users/klimp/Documents/Projects/hoi4-agent-tools` (owned by the MCP worker; request record `docs/plans/zin-requests.md` there).
3. Build: `cd tools && node content/build.mjs`; tests: `npm test`; apply: `node --import tsx content/apply.mts plan|apply`.
4. Verification: the Linux harness `tools/acceptance/` under `/tmp/hoi4_wsl.lock`. Never launch the Windows game.
5. The lead's working notes and the state of running agents are in `docs/plans/zin-lead/STATUS.md`.
