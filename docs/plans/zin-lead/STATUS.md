# Lead status (resumable)

Working notes of the implementation lead. `docs/specs/PROGRAM.md` is the progress record; this file says what is running and what comes next, so work resumes after an interruption without loss.

## Owner answers

All owner questions of 24 October 2026 are answered and recorded as decisions K9 to K36 in `docs/specs/INTEGRATION_DECISIONS.md` (table of answers: `docs/zin-handoff/OWNER-QUESTIONS.md`).

## Running (24 October 2026, after the session restart)

| Work | Who | Writes | Done when |
| --- | --- | --- | --- |
| MCP worker | session "ZIN MCP worker (HOI4 Agent Tools)", `claude-opus-5-5` | tool repository; record `docs/plans/zin-requests.md` on `claude/zin-integration` | ongoing; ADR 0067 approved; ZR-4 campaign on 144 Wikimedia maps |
| Roster migration | subagent, worktree `%TEMP%\zrw`, branch `roster-int` | `tools/content/` builder, data and tests | 156 realms in the build, suite green; lead reviews and merges |
| Map-import conversion (ADR 0067 section 7) | subagent | `tools/content/geography/`, `tools/content/data/geography/`, `docs/plans/map-import/` | schema-valid model and sheets; preview call ready for 4.4.0 |
| Portraits (named figures from the design picks, generic pools) | subagent `hoi4-portrait-creator` | `$ZIN_ART/raw/portraits/`, `art/source/portraits/`, `docs/plans/zin-art/portraits_handoff.md` | handoff ready; lead wires through the builder |
| MCP worker | see above | tool repository | PRs 36 to 40 merged; PR 41 then release 4.4.0; ZR-6 (strait crossings) filed |
| New focus trees: Burrikkrit, the Nether | subagent | `docs/design/focus/regional_{burrikkrit,nether}.json`, specs, `docs/plans/focus_new_trees/` | compiled and MCP-rendered; lead registers after the roster merge |
| New shared trees: delving holds, middle free, small folk | subagent | `docs/design/focus/shared_*.json` (new files), `docs/specs/05_focus_trees/shared/`, `docs/plans/focus_new_trees/` | compiled and MCP-rendered; lead registers after the roster merge |

The owner is away (24 October 2026, evening) and asked for autonomous work; questions queue in `docs/zin-handoff/OWNER-QUESTIONS.md` (Q-30 onward) for the owner's return. Image generation uses gpt-6-luna only (K50) on the owner's Plus plan, which has usage limits.

## Done today (see PROGRAM.md and the git log)

Handoff reconciled; 19 October work preserved; Erdae and Aoaz exchanged; owner answers K9 to K36; vault corrected; bestiary transcribed; regional dossiers; magic and knowledge layers; heraldry; pantheon and calendar (accepted); Kusven, Kusmeel and the Ember Lands (documents only so far); alternate-history design and soft-lock audit; geography model repair script; roster of 156 realms with tags (231 with the dynamic tags).

## Next, in order

1. When integration is green: review it (build and suite myself); register `content/tags.test.mjs`, the migration tests and `geography/repair_model.test.mjs` in `tools/package.json`; run `node tools/migrations/canon_renames.mjs --scope content --apply`; apply the repaired geography model (opening the Great River's gorge through Kingson's ring); merge to `master` and push; first Linux run.
2. Merge the new roster into the builder: `languages_new.json`, `cultures_new.json` and `roster.json` into `countries.json` and the world data; migrate every Y-tag reference with the roster's migration table; retarget the focus trees (kept, renamed, folded; to write: Burrikkrit, the Nether, `shared_delving_holds`, `shared_middle_free`, the small folk module for Dobbum and Tirlan); heraldry grammars for the 30 new cultures, the Baelim and the mycids.
3. Calendar: done in `1c5b4d8` (god-months, 65 realms with local reckonings, `docs/design/calendar_localisation.md`; the text-scan exception for 月/월 in calendar files only is accepted by the lead). Open: call `zin_reckoning_new_reign` from the river-kings' succession; Rising numbers for Delbiz and Rhachia (lore); 13 realms missing from `countries.json` get no reckoning flag until the roster migration lands; stale former month names in other modules' script comments, `geography/aoaz.json`, two `heraldry.json` meanings and event-window data; the politics step's bookmark text still says "Erdae".
3b. After the roster merge, for the new focus trees (`docs/plans/focus_new_trees/shared_trees_handoff.md` steps 1 to 8): remove Dobbum from `shared_west_lands`, set Dobbum's and Tirlan's `focusTree` to `shared_small_folk`, regenerate the tiers spec, build. Black-powder equipment for the roster's `gunpowder` realms (K19) is owed in `modules/warfare.mjs` (spec `03_gameplay/01_warfare.md` open decision 4); then swap the catapult and trebuchet stand-ins in *The Bombard Foundries*. AI-weight audits wait for ZR-7 (probability routes refuse 1.19.3).
3a. After the roster merge: `node tools/migrations/canon_renames.mjs --scope content --apply` for K48 and K49 (Tolvael needs a new tag from `lib/tags.mjs` in place of SNS; `regional_sensai.json` is renamed by the path rules); register the geography tests `content/geography/{repair_model,geography_steps,convert_for_import,coast_features}.test.mjs` in `tools/package.json`; file nothing more for straits (ZR-6 filed); fix the 7 resolver warnings (2 self-crossing range spines, 5 river via points in water); portraits once gptimage is signed in (jobs ready in `$ZIN_ART/jobs/portraits-*.json`).
4. Story soft-locks of `docs/design/alternate_history.md` (world-tension module, ending runner, Afrit's death, 61 missing spec events, Kusven replacing the Zol-in-person content), then the generic realm systems (K34: monthly batches allowed) and start variety.
5. Geography: sheet registrations for Aenor Isle, the Ember Lands and the West Lands (land IoU 0.24, 0.36, 0.50); renaming the 195 model names from the roster and dossiers (no "Ocean" names); the converter to the tool's schemas (ADR 0067 section 7); the import when the worker releases.
6. Branding (R-90) wiring; art persistence (move `ZIN_ART` out of the tool repository, accepted sources into `art/source/`); quotes v2 swap; the voice applied to events and focus text.
7. The politics step rebuilt as `tools/politics/` on the new roster and map.

## Decisions taken by the lead (not owner canon)

- The 19 October work is preserved on `zin/integration-r3` and reaches `master` only when the build and suite are green.
- The name exchange leaves game output files alone; they are regenerated by the next build and apply.
- The owner's copy of the vault in `Downloads` is not edited; the mod's vault is the maintained copy from 24 October 2026.
- No ZIN tag equals a vanilla tag, so Noris takes NRS, not NOR (Norway).
- The Great River keeps its drawn course through a gorge in Kingson's ring of mountains (the range is opened), rather than making the Kingson Vale an inland basin.
- The open-sea seam (R-18) costs the Windwaith arm (to be renamed Vindael) 55% of its drawn land; accepted, shown to the owner in the map preview.
- Never write file contents through a shell string with backticks or `$`: use the Write and Edit tools (a shell rewrite of this file lost every path on 24 October 2026).
- Owner branding originals (sha256): `ZinLogoCut.png` ffd77044...4194, `ColorfulZinLogo.PNG` 6ea5e004...7360, `ZinLogo.png` a290f7da...6ecc, `ZIN.LOGO.BACKGROUND.png` bebd9c97...4042, `ZIN.png` 281ea09f...22d0.
