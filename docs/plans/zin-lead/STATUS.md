# Lead status (resumable)

Working notes of the implementation lead. `docs/specs/PROGRAM.md` is the progress record; this file says what is running and what comes next, so work resumes after an interruption without loss.

## Owner answers

All owner questions of 24 October 2026 are answered and recorded as decisions K9 to K50 in `docs/specs/INTEGRATION_DECISIONS.md` (table of answers: `docs/zin-handoff/OWNER-QUESTIONS.md`). The owner is away since the evening of 24 October and asked for autonomous work: new questions queue in `docs/zin-handoff/OWNER-QUESTIONS.md` (Q-31 to Q-62 open, each with the default in use).

## State (25 October 2026, about 03:30)

- Branch `zin/integration-r3`, not pushed. Build green; suite green except the two build-determinism tests while the portrait generation appends to the art store's provenance.
- Roster: 156 realms, 231 tags of 439, 1,033 characters, 99 focus trees (4,747 focuses) including Burrikkrit, the Nether, `shared_delving_holds`, `shared_middle_free`, `shared_small_folk`.
- Flags: all 156 realms fly their own heraldry flag (`tools/content/data/realm-flags-cells.json`).
- Portraits: tranche one (11 named, 84 pool) committed `edcff969`, not yet wired; tranche two (pools per culture for the new roster, 126 sheets) generating.
- Map import: converter, sheets, annotations and feature surface ready; preview on the released 4.4.0 is READY with land IoU 0.9574 and no warnings (`tools/content/data/geography/import/preview_call.json`, run with `scratchpad/mcp_call.mjs` on `runtime-v440` because this session's own MCP connection is the old project registration until the owner reconnects). Realm seeds for ZR-8 in `tools/politics/data/realm_seeds.json`. Any change to annotations, sheets or geography needs `node tools/politics/realm_seeds.mjs --write` afterwards.
- MCP worker: 4.4.0 released and installed (`runtime-v440`); ZR-8 (workspace-owned countries) in PR 44, seed growth waits for the territory service (C11); ZR-6 (strait crossings) and ADR 0067 steps 3 to 5 (override file, stable ids, alignment checks) queued; ZR-7 resolved on the mod side (project `.mcp.json` entry removed).

## Running

| Work | Who | Writes |
| --- | --- | --- |
| Portraits tranche two | subagent `hoi4-portrait-creator` | `$ZIN_ART/raw/portraits/tranche2/`, `art/source/portraits/`, `docs/plans/zin-art/portraits_handoff.md` |
| Error-log causes (r3b profile) | subagent | builder modules except art and geography; `docs/plans/zin-errors/r3b_fixes.md` |
| MCP worker | session "ZIN MCP worker (HOI4 Agent Tools)" | tool repository |
| Story framework (SL-01, 02, 03, 23, 26, 29, 30) | subagent | `lib/story_dates.mjs`, `modules/world_tension.mjs`, `modules/historical_path.mjs`, `checks/story_wiring.mjs`, `alternate_history.test.mjs`; `docs/plans/story/framework_handoff.md` |
| Afrit, Aenor, Eindil (SL-04 to 11, 18, 20, 21, 25, 31 to 33, 35, 37) | subagent | `modules/events_mech.mjs`, `data/events_mech_{afrit,misc}.json`, the Afrit, Aenor and Eindil scripts; `docs/plans/story/afrit_aenor_eindil_handoff.md` |
| Kusven, Volgan, Leren, the West (SL-12 to 17, 19, 22, 27, 34, 36) | subagent | Zol and Volgan scripts, `modules/events_mech_war.mjs`, Lerendor and crossing modules; `docs/plans/story/war_side_handoff.md` |

## Next, in order

1. When ZR-8 is released: content apply (writes the 156 realm tags), then the `create_world` write of the new map with `countries` from `realm_seeds.json` (retires the 305 old Y-tag files), then content apply again, then the first Linux run on the new map (sync, start, run, capture; error profile).
2. Wire the portraits (both tranches) through the builder per `portraits_handoff.md`; Q-32 (approval of five named portraits) stays open, so those five stay out until approved.
3. Black-powder equipment for the roster's `gunpowder` realms (K19) in `modules/warfare.mjs`; swap the stand-ins in *The Bombard Foundries*.
4. Story soft-locks of `docs/design/alternate_history.md` (world-tension module, ending runner, Afrit's death, the missing spec events, Kusven replacing the Zol-in-person content), the generic realm systems (K34: monthly batches allowed) and start variety.
5. Art debt: the pending rows of `docs/plans/zin-art/pending_from_integration.md` (focus icons over caps, event pictures, interface reskin duplicates), with gpt-6-luna on the Plus allowance.
6. Calendar follow-ups: `zin_reckoning_new_reign` from the river-kings' succession; the politics step's bookmark text still says "Erdae".
7. AI-weight audits once this session runs the 4.4.0 server (ZR-7); the Linux sweep, observer runs to 4A 1760 and 1800, save and load, zero ZIN error lines; final report.
8. Model sites of Yeldenne, Hunhun and Mora sit on water or the coast in the geography model; move them in the repair inputs.

## Decisions taken by the lead (not owner canon)

- The 19 October work is preserved on `zin/integration-r3` and reaches `master` only when the build and suite are green.
- The name exchange leaves game output files alone; they are regenerated by the next build and apply.
- The owner's copy of the vault in `Downloads` is not edited; the mod's vault is the maintained copy from 24 October 2026.
- No ZIN tag equals a vanilla tag, so Noris takes NRS, not NOR (Norway); Tolvael takes TLV.
- The Great River keeps its drawn course through a gorge in Kingson's ring of mountains (the range is opened), rather than making the Kingson Vale an inland basin.
- The open-sea seam (R-18) costs the Vindael arm 55% of its drawn land; accepted, shown to the owner in the map preview.
- The text-scan exception for the CJK month counters (月/월) in calendar files only.
- Realm flags: a thin light-grey keyline on near-black fields (trimmed by the slicer's inset); the four last dark flags generated one per image and trimmed to 41:26.
- The import's land follows the model outside a 6-px coast band (annotations); straits stay water, necks land.
- Never write file contents through a shell string with backticks or `$`, and never `sed -i` (it strips Windows line endings in this shell): use the Write and Edit tools.
- Owner branding originals (sha256): `ZinLogoCut.png` ffd77044...4194, `ColorfulZinLogo.PNG` 6ea5e004...7360, `ZinLogo.png` a290f7da...6ecc, `ZIN.LOGO.BACKGROUND.png` bebd9c97...4042, `ZIN.png` 281ea09f...22d0.
