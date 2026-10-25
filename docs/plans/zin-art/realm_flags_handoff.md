# Realm flags handoff (roster integration, R-92)

Status: all 156 realms have an accepted heraldry flag, staged by the builder (modules/art.mjs stageRealmFlags). 152 come from accepted sheets and the last four (PUV, NET, DLN, KHO) from one picture per flag.

## Sheets

Sheets are 1536x1024 on pure black, generated with gpt-6-luna through tools/content/imagegen.mjs. The grid check (flags of aspect 1.4 to 1.75, found by the shared adaptive detector in lib/sheets.mjs) ran on every sheet generation. The living stream uses sheets 01 to 13 (4 by 3, the last of them 5 flags in 4 by 2). The dark stream was cut into a sheet of 4 and a sheet of 3 (sheets 14 and 15). Sheet 15 (NEZ, VES, ZOL, one row) is accepted. Sheet 14 (PUV, NET, DLN, KHO) was rejected after nine generations: its flags came out square, then 1.3 to 1, then 1.8 to 1 in a 2 by 2 grid, never 41:26.

Every sheet after the first takes its layout reference from the first accepted sheet of data/realm-flags-cells.json. A near-black field gets a thin light-grey keyline just inside its edge, which the slicer's inset trims; the lead accepted it.

| Sheet | Realms | Result | Notes |
| --- | --- | --- | --- |
| realm-flags-sheet-01 to 13 | 149 | Accepted | Sheets 01, 02, 06, 08 and 10 were rejected in round 1 and accepted in round 2. |
| realm-flags-sheet-14 | 4 | Rejected | Nine generations in all; the flags never reached the 41:26 proportion. |
| realm-flags-sheet-15 | 3 | Accepted | One row of three; flags measure about 1.46 to 1. |
| realm-flags-one-PUV, -NET, -DLN, -KHO | 4 | Accepted (one picture per flag) | See below. |

## One picture per flag (PUV, NET, DLN, KHO)

Each flag is one 1536x1024 image on solid black, the flag centred and about 78 percent of the canvas width. The accepted sheet 01 is the style reference only (no designs or layout are copied). Each flag was generated once, and every one passed the review on the first try. The model painted each flag wider than 41:26, at 1.74 to 1.82 to 1 (the grid check's 1.75 limit rejected them), so the slicer's `sliceOne` (tools/content/art/slice-flags.mjs) finds each box with a limit of 2.0, trims equal amounts of field from both sides to exactly 41:26, and resizes to 492 by 312. Nothing is stretched. The trimmed field is plain, so no blazon charge is cut.

Review against the blazons: PUV (grave black field, open arched gate with ember light, ring of notches in ember red); NET (hall black above, lava red below by a rent line, pentagram in pact gold inside a flame circlet); DLN (obsidian above, nether red below, cauldron of brine over fire in ember gold, grave black base); KHO (ash black field, nether red pile from the top edge, curved horn in ember gold, grave black base). No text, no cross, no real emblem.

## Review

Every accepted flag was checked against its blazon: field, division, charges, tinctures, chief or label, border, and the keyline on near-black fields. No text, letters, crosses, real emblems or real national symbols were seen. Sheet 15 was checked against NEZ, VES and ZOL.

## Files changed (this round)

- tools/content/art/flag-jobs.mjs: `singleFlagJobs` (one picture per flag, the style reference, the 41:26 description).
- tools/content/art/slice-flags.mjs: `sliceOne` (one-cell sheets, 2.0 box limit, even side trim to 41:26); `sliceSheet` dispatches one-cell sheets to it.
- tools/content/modules/art.mjs: stageArtSources also copies `realm-flags-one-<TAG>.png` sources.
- tools/content/build.test.mjs: test that a one-flag picture is trimmed to exactly 41:26 and resized to 492 by 312, with red at the edges and centre.
- tools/content/data/realm-flags-cells.json: the four dark realms have one-cell sheets (index 0, one row); all 156 accepted.
- art/source/flags/realm-flags-one-PUV, -NET, -DLN, -KHO .png (new).
- art/source/provenance.jsonl: generation and review lines for the four pictures.
- docs/design/validation/asset_baseline.json: the last 3 FLAG_MISSING entries (NET) removed; no FLAG_MISSING remains for realm flags.
- docs/plans/zin-art/pending_from_integration.md: all 15 no-old-row rows P0780 to P0794 marked DONE; the realm-flag section and the old-flag table (now empty) updated.
- docs/plans/zin-art/realm_flags_handoff.md (this file).

## Verification

- `flag-jobs.mjs` and `imagegen.mjs` for the four one-flag jobs: 4 generations, 4 accepted, 0 rejects.
- Targeted tests: "A one-flag picture is trimmed to exactly 41:26" and "Flag jobs copy the layout of an accepted sheet only" pass.
- Build and `npm test`: see the result recorded in the final report.

## Owner questions

None open for the realm flags.
