# Realm flags handoff (roster integration, R-92)

Status: 149 of 156 realms have an accepted heraldry flag, staged by the builder (modules/art.mjs stageRealmFlags). The seven dark realms of realm-flags-sheet-14 (the dead and demons) have no accepted sheet after six generations. Their rows are in pending_from_integration.md.

## Sheets

Each sheet is 1536x1024 on pure black, 4 columns by 3 rows (the last sheet of a stream may be shorter), generated with gpt-6-luna through tools/content/imagegen.mjs. The grid check (flags of aspect 1.4 to 1.75, found by the shared adaptive detector in lib/sheets.mjs) ran on every generation.

Round 1 (earlier): sheets 03, 04, 05, 07, 09, 11, 12 and 13 were accepted. Sheets 01, 02, 06, 08, 10 and 14 were rejected after three generations each, because the detector could not separate the flags from the black ground (black fields) or the grid was off. Sheet 07 needed one rejected try first, and sheet 13 too.

Round 2 (this change): flag-jobs.mjs now gives every sheet the first accepted sheet of data/realm-flags-cells.json as its layout reference (realm-flags-sheet-03), never a rejected file. A flag whose field is near-black (every channel below 64) gets a thin light-grey keyline (#a6a6a6, about two percent of its width) drawn just inside its own edge, so the detector sees it and the slicer's 4-pixel inset trims it. The keyline is the only addition; every tincture stays as named. Sheets 01, 02, 06, 08 and 10 were accepted on their first try of round 2. Sheet 14 was tried three times in round 2 (six generations in all), and each try came back with square flags instead of 41:26, so the detector found 0 or 6 of 7. It is rejected.

| Sheet | Realms | Result | Generations |
| --- | --- | --- | --- |
| realm-flags-sheet-01 | 12 | Accepted in round 2 | 1 (round 1: 3 rejected) |
| realm-flags-sheet-02 | 12 | Accepted in round 2 | 1 (round 1: 3 rejected) |
| realm-flags-sheet-03 | 12 | Accepted in round 1 | 1 |
| realm-flags-sheet-04 | 12 | Accepted in round 1 | 1 |
| realm-flags-sheet-05 | 12 | Accepted in round 1 | 1 |
| realm-flags-sheet-06 | 12 | Accepted in round 2 | 1 (round 1: 3 rejected) |
| realm-flags-sheet-07 | 12 | Accepted in round 1 | 2 |
| realm-flags-sheet-08 | 12 | Accepted in round 2 | 1 (round 1: 3 rejected) |
| realm-flags-sheet-09 | 12 | Accepted in round 1 | 1 |
| realm-flags-sheet-10 | 12 | Accepted in round 2 | 1 (round 1: 3 rejected) |
| realm-flags-sheet-11 | 12 | Accepted in round 1 | 1 |
| realm-flags-sheet-12 | 12 | Accepted in round 1 | 1 |
| realm-flags-sheet-13 | 5 | Accepted in round 1 | 2 |
| realm-flags-sheet-14 | 7 | Rejected | 6 (3 round 1, 3 round 2) |

The accepted sheets are in art/source/flags/ (13 files). The rejected attempts are in the art store's raw/rejected/ folder.

## Review

Every accepted flag was checked against its blazon: field, division, charges, tinctures, chief or label, border, and the keyline on near-black fields. No text, letters, crosses, real emblems or real national symbols were seen. The quartered designs SAO, KRA and CRG (sheet 06, generated in round 2) were generated after the lead fixed the blazon template, so their quarter tincture is named. PRN (sheet 07, accepted in round 1) was generated before the fix; its accepted flag already shows the bronze upper-hoist quarter of the corrected blazon, so the lead kept sheet 07 accepted.

## Rejected realms (old row flag if they have one, otherwise no flag)

Sheet 14, dead and demons: PUV Puvulan, NET Nether, DLN Dolon, KHO Khorvrath, NEZ Nezer, VES Veshazel, ZOL Zol's Mistake. NET and VES have no old row, so they have no flag (pending rows P0790 and P0788). The other five keep their old row flag.

## Files changed

- tools/content/art/flag-jobs.mjs: `acceptedLayoutRef` (the first accepted sheet is the layout reference of every sheet), `isNearBlackField`, and the keyline sentence in the sheet prompt.
- tools/content/build.test.mjs: test that the flag jobs take an accepted layout reference and key exactly the near-black sheets; the cell map test; the flag test takes a realm from its own sheet.
- tools/content/data/realm-flags-cells.json: 156 cells; accepted: true for 149 realms (13 sheets).
- art/source/flags/realm-flags-sheet-01, -02, -06, -08, -10 (.png, new in round 2).
- art/source/provenance.jsonl: 10 lines appended (5 generation lines and 5 review lines).
- docs/design/validation/asset_baseline.json: 15 more FLAG_MISSING entries removed (5 realms with no old row, 3 sizes each).
- docs/plans/zin-art/pending_from_integration.md: rows P0783, P0785, P0787, P0791 and P0793 marked DONE; P0788 and P0790 updated to the sheet-14 rejection; the realm-flag section and the old-flag table (now 5 realms) are updated.
- docs/plans/zin-art/realm_flags_handoff.md (this file).

## Verification

- `node tools/content/art/flag-jobs.mjs <ZIN_ART>/jobs` rewrote the 14 sheet jobs (156 flags). The six rejected sheets were run from a subset of those jobs.
- Build: `node tools/content/build.mjs` with a private TEMP and ZIN_ART set, no path argument: exit 0.
- `npm test` in tools: 1458 tests, 1456 pass, 2 fail. Neither failure comes from this change:
  - "The build is deterministic": the art store's jobs/provenance.jsonl is being appended to by the portrait generation (tranche2 lines appear between the two builds); the two builds differ only in art/source/provenance.jsonl.
  - "the tracked cell copy matches the art working copies" (presentation.test.mjs): the art store's events-catalog-jobs.json differs from the tracked copy; the events catalog work is in progress and not mine.

## Owner questions

1. Sheet 14 (seven dead and demon realms) has no accepted sheet after six generations. The dark sheet comes out square, not 41:26. Options: a different prompt for the dark stream, or a separate sheet size; the owner can decide whether more generations are allowed.
2. The keyline is a light-grey edge on the near-black flags (about five sheet pixels). It is not a tincture of any design; the owner should confirm this is acceptable in-game.
