# Lane I5 (national spirits, laws, officer-corps spirits): plan

Owner: lane I5. Inputs: `docs/plans/ui_overhaul/phase2_brief.md`, lane row I5 in `02_plan.md`, design system §4.1 to §4.3 (one concept one icon; national spirit family 64 × 64, Chancery square idea frame, painted emblem or object), K69 (almost every concept its own picture), K70 (Chancery theme for politics and the realm mechanics). Model for the builder: `tools/content/modules/focus_art.mjs` and `docs/plans/ui_overhaul/handoffs/I4_plan.md`.

## (a) Form

- Engine size 64 × 64 (vanilla `interface/ideas.gfx` pictures are about 60 × 68 painted emblems on transparent ground; ZIN uses the 64 × 64 idea standard of design system §4.2).
- Frame: an opaque square plate with a walnut-brown ground and a thin muted bronze rim (the Chancery square idea frame), with one painted object or emblem in the centre. Opaque square plates need no alpha, so the transparency rules do not apply.
- Sheets: `gpt-6-luna` only, 4 columns × up to 3 rows (10 to 12 plates per sheet, balanced per family), black `#000000` ground, 1536 × 1024. Detection by `findRegionsAdaptive`, cut with a 2 px inset, resized to 64 × 64 (Lanczos 3), DDS `a8r8g8b8`.
- Sprite: `GFX_idea_zin_<key>`, texture `gfx/interface/ideas/zin/picture/<key>.dds`, sprite file `interface/zin_idea_art.gfx` (written only when a plate ships).
- Picture key: the idea id without `zin_` (`zin_aenor_seventeen_centuries` gives `aenor_seventeen_centuries`). Idea writers keep their `picture = zin_<x>` line; `applyIdeaArt` (in `modules/idea_art.mjs`, called from `build.mjs` after the last idea writer) rewrites the picture line of each idea whose sheet is accepted. An idea whose sheet is not accepted keeps its catalogue picture, so the build stays whole. The picture-key collision with the icon catalogue is an error at build time.

## (b) Counts

| Measure | Count |
| --- | ---: |
| National spirits in the icon registry (`tools/content/data/ui/icon_registry.json`, concept family `spirit`) | 1,608 |
| Officer-corps spirits (`officer_spirit`) | 27 |
| Laws (`law`, 18 vanilla law concepts with vanilla pictures) | 18 (not in this plan yet, see (f)) |
| **Pictures in the plan** (spirits and officer-corps spirits) | **1,635 in 185 sheets** |
| Spirits with no name in localisation (deep-past relics and a few others, names come from `deep_past` data) | 32 |
| Spirit ids that equal a focus id (identity of concept, §4.3 `same_concept`) | 0 |
| Spirits sharing a localised name with another spirit (62 names, 239 ids) | not merged: different granting trees, no proof of one concept |

**Estimate correction for the lead.** The lane row estimated 1,100 to 1,300 pictures after the same-concept rule. The rule as written in §4.3 (a focus that grants a spirit of the same name) matches none of the spirits: no spirit id equals a focus id, so the reuse saves nothing. Without the owner's approval of a looser rule, the lane needs about **1,653 pictures** (1,608 spirits, 27 officer-corps spirits, 18 laws). The 62 duplicate-name groups (for example "The Empty Throne" in Aenor and in Yeldenne) are candidates for a `same_concept` share only where a focus grants both; the lead decides that list. Until then each spirit gets its own picture (K69).

Pictures per family group:

| Group | Sheets | Pictures |
| --- | ---: | ---: |
| Major realms (aenor, lerendor, magical_forest, worshipdom, mirolon, goldoroth, gala, gunwaith, noris, coldor, volgan, stabilo, zol) | 39 | 396 |
| Other families (culture, faith, deep, econ, dark, elves, eindil, officer-corps spirits, …) | 41 | 305 |
| Regional trees (`regional_*`) | 79 | 699 |
| Shared trees (`shared_*`) | 26 | 235 |
| **Total** | **185** | **1,635** |

Sheets are per family, so a family with 61 pictures becomes 6 sheets of 10 or 11 (61 = 11 + 5 × 10).

## (c) Order

1. Aenor (61 pictures, 6 sheets) first, as the pilot for the style and the wiring.
2. Major realms in the order of `MAJOR_ORDER` (lerendor, magical_forest, worshipdom, mirolon, goldoroth, gala, gunwaith, noris, coldor, volgan, stabilo, zol).
3. The other families, alphabetically.
4. Regional trees, then shared trees, alphabetically.
5. Laws (18), after the owner or lead says whether ZIN law pictures replace the vanilla law textures (see (f)).

The cell map `tools/content/data/idea_art_cells.json` carries the order and the status of each sheet. Resume from the first `planned` sheet in that order.

## (d) Subjects and prompts

Subjects come from each spirit's localised name and description (`localisation/english/*.yml`, keys `<id>` and `<id>_desc`), checked against the modifiers where the description is vague. They are written in `tools/content/data/idea_art_subjects.json`, one entry per picture key, with the idea id beside it. Subject rules: one object or emblem per picture; a human figure never fills a plate and no figure shows a face; no crosses, no crossed objects that read as a cross, no real-world religious or national symbols (K53); no modern objects (no firearms, gears, engines or machines); nothing from the Lord of the Rings. Subjects name the concept, not the mechanic: a spirit about tithes shows a tally, not a number.

The prompt is generated by `ideaSheetJobs` from a fixed style paragraph, the fixed layout paragraph and the numbered subjects. Jobs live in the art store `jobs/i5/`, and the runner appends its provenance to `jobs/i5/provenance.jsonl`. Every generation and review is also appended to the shared logs (`art/source/provenance.jsonl` and the art store `jobs/provenance.jsonl`), append-only.

## (e) Review and acceptance

Each generated sheet is checked by the runner (`check`: exact count, columns and rows, aspect, area). Then the sheet is reviewed at final size: the cut 64 × 64 plates on a labelled 1× and 3× contact sheet (`modules/idea_art.mjs preview <sheet>`). A sheet is accepted only when the subject of every plate matches its subject line, the plates read at 64 pixels, no text, face, cross or modern object appears, and the frame is the same walnut-and-bronze square on every plate. A rejected sheet is regenerated; the cell map keeps `planned` until a review line with `accepted: true` for the exact bytes exists in the provenance log, and then the status becomes `accepted`.

## (f) Open items for the lead

- Confirm the concept count (1,635 spirits and officer-corps spirits, 18 laws) and whether any same-name group is one concept (`same_concept`) under §4.3.
- The 32 spirits without localised names: the names come from the `deep_past` data; their subjects wait for that lookup.
- Laws: 18 concepts with vanilla picture textures (`GFX_idea_isolation` and similar). Decide whether ZIN law pictures are drawn (the law pictures are part of K69) or whether the vanilla law textures stay (then list them as vanilla with reason).
- Format: 64 × 64 DDS `a8r8g8b8` (16 KB each, about 26 MB for 1,635 pictures).
- Build hook: `build.mjs` calls `applyIdeaArt` after `buildDecisionsRegional`. It is a no-op while no sheet is accepted.
- The job is larger than one agent session. It is resumable through the cell map and the handoff `I5.md`.
