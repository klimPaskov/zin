# Realm flags handoff (roster integration, R-92)

Status: 152 of 156 realms have an accepted heraldry flag, staged by the builder (modules/art.mjs stageRealmFlags). Four realms of the dead and demons stream (PUV, NET, DLN, KHO) have no accepted sheet after nine generations of realm-flags-sheet-14. NET has no old row and flies no flag (pending row P0790); PUV, DLN and KHO keep their old row flag.

## Sheets

Sheets are 1536x1024 on pure black, generated with gpt-6-luna through tools/content/imagegen.mjs. The grid check (flags of aspect 1.4 to 1.75, found by the shared adaptive detector in lib/sheets.mjs) ran on every generation. The living stream uses a 4 by 3 grid (sheets 01 to 13, the last of them 5 flags in 4 by 2). The dark stream is cut into a sheet of 4 and a sheet of 3 (sheets 14 and 15), with no empty cell: a sheet of 3 is one row of three, and the 4-flag sheet is a 2 by 2 grid.

Every sheet after the first is given the first accepted sheet of data/realm-flags-cells.json as its layout reference (realm-flags-sheet-03). A flag whose field is near-black (every channel below 64) gets a thin light-grey keyline just inside its edge, which the slicer trims with its inset; the keyline is not a blazon tincture, and the lead accepted it.

| Sheet | Realms | Result | Notes |
| --- | --- | --- | --- |
| realm-flags-sheet-01 | 12 | Accepted (round 2) | Round 1 rejected 3 times (black fields). |
| realm-flags-sheet-02 | 12 | Accepted (round 2) | Round 1 rejected 3 times. |
| realm-flags-sheet-03 | 12 | Accepted (round 1) | Layout reference for every later sheet. |
| realm-flags-sheet-04 | 12 | Accepted (round 1) | |
| realm-flags-sheet-05 | 12 | Accepted (round 1) | |
| realm-flags-sheet-06 | 12 | Accepted (round 2) | Round 1 rejected 3 times. Quartered designs name their quarter tincture. |
| realm-flags-sheet-07 | 12 | Accepted (round 1) | PRN's blazon was later corrected; its flag already shows the corrected bronze upper-hoist quarter. |
| realm-flags-sheet-08 | 12 | Accepted (round 2) | Round 1 rejected 3 times. |
| realm-flags-sheet-09 | 12 | Accepted (round 1) | |
| realm-flags-sheet-10 | 12 | Accepted (round 2) | Round 1 rejected 3 times. |
| realm-flags-sheet-11 | 12 | Accepted (round 1) | |
| realm-flags-sheet-12 | 12 | Accepted (round 1) | |
| realm-flags-sheet-13 | 5 | Accepted (round 1) | |
| realm-flags-sheet-14 | 4 | Rejected | Dark stream, PUV, NET, DLN, KHO. Nine generations in all (three round 1, three round 2, three this round): square flags (about 1.2 to 1), then 1.3 to 1 in one row, then 1.8 to 1 in a 2 by 2 grid. None is 41:26, so the grid check finds none. |
| realm-flags-sheet-15 | 3 | Accepted (this round) | Dark stream, NEZ, VES, ZOL, one row. Flags measure about 1.46 to 1, inside the grid check's 1.4 to 1.75 and not square; the slicer fits them to 492 by 312. |

Rejected attempts are in the art store's raw/rejected/ folder; their provenance lines are marked accepted: false.

## Review

Every accepted flag was checked against its blazon: field, division, charges, tinctures, chief or label, border, and the keyline on near-black fields. No text, letters, crosses, real emblems or real national symbols were seen. Sheet 15 was checked against NEZ (nether red over ash black, galley on fire), VES (ash-grey flame over an ember-gold seal on ash-hall black) and ZOL (cold-grey broken rings on void black).

## Files changed (this round)

- tools/content/art/flag-jobs.mjs: the dark stream is cut into sheets of 4 and 3 (`DARK_PER_SHEET`); a dark sheet has no empty cell; the dark prompt states the 41:26 shape and the pixel size; the layout reference is the first accepted sheet.
- tools/content/data/realm-flags-cells.json: sheet 15 added; PUV, NET, DLN and KHO moved to sheet 14; 152 accepted.
- art/source/flags/realm-flags-sheet-15.png (new).
- art/source/provenance.jsonl: sheet 15 generation and review lines; rejected sheet 14 review lines (accepted: false).
- docs/design/validation/asset_baseline.json: 3 FLAG_MISSING entries for VES removed; NET's 3 remain.
- docs/plans/zin-art/pending_from_integration.md: row P0788 (VES) done; P0790 (NET) updated; the realm-flag section and the old-flag table (now 3) updated.
- docs/plans/zin-art/realm_flags_handoff.md (this file).

## Verification

- `node tools/content/art/flag-jobs.mjs <ZIN_ART>/jobs`: 15 sheets, 156 flags.
- Build: `node tools/content/build.mjs` with a private TEMP and ZIN_ART set: see the result line below.
- `npm test`: see the result line below. The two known failures from the portrait generation and the art store's events catalog are not from this change.

## Owner questions

1. Sheet 14 (PUV, NET, DLN, KHO) has no accepted sheet after nine generations. Options: accept old-row flags for PUV, DLN and KHO and no flag for NET (the current state), or allow a different generation method for the dark stream.
