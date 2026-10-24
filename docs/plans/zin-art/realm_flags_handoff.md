# Realm flags handoff (roster integration, R-92)

Status: the flag art is generated and reviewed for 8 of 14 sheets (89 of 156 realms). The build is blocked by one asset-gate gap outside this task's file scope, so the realm flags are not committed and not yet wired into a passing build. Six sheets (67 realms) were rejected after three generations each.

## Blocker for the owner or the lead

The asset gate resolves the provenance of every flag through lib/asset_sources.mjs (`createSourceResolver`). It maps a flag tag to its country-table name and then to the old roster cell map (data/flags-cells.json, by name). The 8 accepted realms with no old row (BRR, OLO, ANR, GHH, GRO, HOO, GOF, TIR) have no entry there, so the build fails with 24 new PROV_SOURCE_UNKNOWN errors (3 sizes each). The other 81 accepted realms have an old row, so they resolve to the old roster sheet: the build does not fail on them, but their flag provenance names the wrong sheet.

The fix is outside this task's boundary (only art.mjs, the flag tests, the cell map, art/source/flags, the provenance, the baseline, pending rows and this handoff may change). Proposed change, for the owner to approve:

1. tools/content/lib/asset_sources.mjs, in `createSourceResolver`: accept `tables.realmFlagCells` (a Map from tag to the accepted cell of data/realm-flags-cells.json). In the `rule.flagTag` branch, use the realm cell first (`srcRel = art/source/flags/<sheet>.png`, `sheet`, `cell = { row, col, index }`) and fall back to the existing name lookup only when no realm cell exists.
2. tools/content/checks/assets.mjs, where the tables are loaded: add `t.realmFlagCells` from `realm-flags-cells.json` (accepted cells only, keyed by tag), and pass it through to the resolver.

After that patch the build should pass the asset gate with the 24 flags resolved, and the 24 FLAG_MISSING baseline entries removed in this change stay removed. I did not apply the patch, because the lead owns the asset gate and the shared working tree is in use. Until the patch is in, the working tree build fails on these 24 PROV_SOURCE_UNKNOWN errors, which come from this change.

## Sheets

Each sheet is 1536x1024, 4 columns by 3 rows, on pure black, generated with gpt-6-luna through tools/content/imagegen.mjs. The grid check (12 flags of aspect 1.4 to 1.75, sliced by the shared adaptive detector) ran on every generation.

| Sheet | Realms | Result | Generations | Notes |
| --- | --- | --- | --- | --- |
| realm-flags-sheet-01 | 12 | Rejected | 3, all failed the grid check | Detector found 2, 8, 3 of 12. Four designs have a black field (BLK, DND, NAN, MOO), so the flags merge with the black background. |
| realm-flags-sheet-02 | 12 | Rejected | 3, all failed the grid check | Detector found 8, 0, 1 of 12. No black field on this sheet, so the cause is the grid, not the background. Generated without the layout reference (sheet 01 was never accepted). |
| realm-flags-sheet-03 | 12 | Accepted | 1 | Reviewed against all 12 blazons. |
| realm-flags-sheet-04 | 12 | Accepted | 1 | Reviewed against all 12 blazons. |
| realm-flags-sheet-05 | 12 | Accepted | 1 | Reviewed against all 12 blazons. |
| realm-flags-sheet-06 | 12 | Rejected | 3, all failed the grid check | Detector found 8 of 12 each time. Contains three quartered designs with a blazon template defect (see below). |
| realm-flags-sheet-07 | 12 | Accepted | 2 (one rejected first) | Reviewed against all 12 blazons. Contains PRN, whose blazon has the template defect (see below). |
| realm-flags-sheet-08 | 12 | Rejected | 3, all failed the grid check | Detector found 0 of 12 each time. |
| realm-flags-sheet-09 | 12 | Accepted | 1 | Reviewed against all 12 blazons. |
| realm-flags-sheet-10 | 12 | Rejected | 3, all failed the grid check | Detector found 0, 10, 8 of 12. |
| realm-flags-sheet-11 | 12 | Accepted | 1 | Reviewed against all 12 blazons. |
| realm-flags-sheet-12 | 12 | Accepted | 1 | Reviewed against all 12 blazons. |
| realm-flags-sheet-13 | 5 | Accepted | 2 (one rejected first) | Reviewed against all 5 blazons. |
| realm-flags-sheet-14 | 7 | Rejected | 3, all failed the grid check | Dead and demons only (no living realm shares it). Six of seven designs have a black field. |

Only the accepted sheets are in art/source/flags/ (realm-flags-sheet-03, -04, -05, -07, -09, -11, -12, -13). The rejected attempts are in the art store's raw/rejected/ folder; their generation lines in the art store's jobs/provenance.jsonl are marked accepted: false.

The sheets 2 to 14 were generated from the jobs file with the layout reference removed (`references: []`) and the "Image 1 is ONLY a layout reference" sentence removed from each prompt, because sheet 01 never passed and so the reference file never existed. The grid check still applied to every generation.

## Rejected realms (flying the old row flag if they have one, otherwise no flag)

Sheet 01: BLK Blackton, DND Dondor, HAL Halia, NAN Nan, OLE Olen, DOL Dolpar, HEO Heodwa Lands, MIA Mina, MOO Molot, TLV Tolvael, TOL Tolhon, ORH Orohaf.
Sheet 02: AEN Aenor, FRE Freshon, PAZ Pazoma, SFT Safeton, EEK Eekedor, KER Keredor-Hellekton, LER Lerendor, REN R'en, HER Herez, NOL Noleksun, MIR Mirolon, SEL Selen.
Sheet 06: YEL Yeldenne, MLK Melkgard, KVI Kvittumm, PLT Poloto, VND Vindael, CRG Corogon, KRA Kradlon, SAO Saopon, CLD Coldor, HRA Hrakbrund, KUN Kunhrim, BRU Brundahrim.
Sheet 08: NRS Noris, ORA Orato, LUV Luv-zhise, RHA Rhachia, ALR Alerhia, DLB Delbiz, ERC Erco, PLO Plutondo, WAH Wahatud, WOQ Woqood, GAA Gala, BUN Burnikit.
Sheet 10: MSH Mushroom Forest, MUS Mustnom, TRO Troll Forest, YEI Yeti Lands, BOR Bordon, BRT Britadon, DAK The Darks, DRE Dreson, DUL Dulundur, SKR Skragdurg, BLN Belonton, DRK Dark Gate.
Sheet 14: PUV Puvulan, NET Nether, DLN Dolon, KHO Khorvrath, NEZ Nezer, VES Veshazel, ZOL Zol's Mistake.

Of these, the 7 with no old row have no flag: HRA, BRU, BUN, VES, NET, WAH, MSH (pending rows P0783, P0785, P0787, P0788, P0790, P0791, P0793). The other 60 keep their old row flag.

## Accepted realms (89)

Sheet 03: HNH, KON, FOT, TES, KIN, KLU, WOR, BLD, ADE, FNG, HLN, LEN.
Sheet 04: PLL, RAE, SEI, BEN, NND, SNT, WND, GIR, WEN, GNW, LAB, THN.
Sheet 05: VRN, WER, AUT, FEA, HLD, HOR, OMR, ORW, POT, PRT, WRL, XIS.
Sheet 07: GRO, AZA, DRA, MOS, OBM, PRN, STA, KRS, MOA, OST, MIE, NAA.
Sheet 09: BRR, GLI, ANR, HOO, GOF, TIR, DOB, GHH, HIR, OLO, NIV, KIL.
Sheet 11: GOL, DUN, WIL, BLO, CUR, GOO, IHU, SOY, LIG, ELV, IGA, TOR.
Sheet 12: YEN, MAG, HRR, DNL, ANE, NLR, ELD, LCC, YAV, ENH, HWN, KAM.
Sheet 13: KEA, NAR, SDE, VER, YON.

## Review notes

- Every accepted flag was checked against its blazon: field, division, charges, tinctures, chief or label, border. No text, letters, crosses, real emblems or real national symbols were seen.
- PRN (Pornivior, sheet 07) has a blazon defect: "the upper hoist quarter {0}". The quarter tincture was left unspecified, so the generated flag chose bronze for the upper hoist quarter. Owner decision needed: correct the blazon, then regenerate that sheet.
- SAO, KRA and CRG (sheet 06, rejected) have the same defect. Their designs need correcting before any new sheet is generated for them. Heraldry data and the generator (tools/content/heraldry/build_heraldry.mjs) are outside this task's scope, so I did not edit them.
- The build's staging step (stageRealmFlags) sliced the 8 accepted sheets and staged the 89 realm flags without an exception before the asset gate stopped the build. The slices were not visually checked at 82x52, 41x26 and 10x7, because the build stops at the asset gate before the staged files are written.

## Files changed

- tools/content/modules/art.mjs: flag staging reads the accepted realm cells (`realmFlagsDir`, `acceptedRealmCells`, `tgasOf`); a realm without an accepted cell keeps the old-row fallback; the provenance copy takes realm-flags sheets.
- tools/content/build.test.mjs: a new test checks the cell map covers every realm once, names match, and design hashes match the heraldry; the flag test accepts a realm from its own sheet.
- tools/content/data/realm-flags-cells.json (new, no images): 156 cells with sheet, index, row, column, tag, name and design hash, plus `accepted`.
- art/source/flags/realm-flags-sheet-03, -04, -05, -07, -09, -11, -12, -13 (.png, new).
- art/source/provenance.jsonl: 16 lines appended (8 generation lines and 8 review lines).
- art store jobs/provenance.jsonl (outside the repository): 8 review lines appended, so the builder's provenance file carries them.
- docs/design/validation/asset_baseline.json: 24 FLAG_MISSING entries removed (8 realms, 3 sizes each).
- docs/plans/zin-art/pending_from_integration.md: rows P0780 to P0794 relabelled (8 accepted, 7 pending with the rejection reason); the realm-flag section says what is accepted; the old-flag table drops the 81 accepted realms and now lists 60.
- docs/plans/zin-art/realm_flags_handoff.md (this file).

## Verification

- `node tools/content/art/flag-jobs.mjs <ZIN_ART>/jobs`: 14 sheets, 156 flags, written.
- `node tools/content/imagegen.mjs` on the sheet jobs: 8 accepted, 6 rejected after three generations each (20 rejected generations in total, all moved to raw/rejected/).
- `node --test --test-name-pattern "realm flag cell map" content/build.test.mjs` in tools: 1 test, 1 pass, 0 fail.
- `node tools/content/build.mjs <staged>` with a private TEMP and ZIN_ART set: fails in the asset gate with 24 new PROV_SOURCE_UNKNOWN errors (the blocker above). No other error is new. The full `npm test` was not run, because the staged tree is not written when the build stops.

## Owner questions

1. Approve the asset-gate patch (lib/asset_sources.mjs and checks/assets.mjs) so realm flags resolve from data/realm-flags-cells.json. Without it the build is red.
2. Choose how to recover the 67 realms on rejected sheets. Options: (a) accept the old-row flags and no flag for the rest, (b) allow more generations with a prompt change for black-field designs (a thin bone-white outline on the dark field, so the detector can separate them), or (c) change the slicer's background assumption (larger change; the slicer is shared).
3. Correct the blazon template in the heraldry generator for quartered designs ("{0}" for PRN, SAO, KRA and CRG), then regenerate those flags.
4. Confirm the design of the dark sheet (14): the seven dead and demon realms have no flag until option 2 is chosen.
