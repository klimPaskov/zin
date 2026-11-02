# hoi4-imagegen audit of ZIN's art (2 November 2026)

First run of `hoi4-imagegen audit` (v0.2.1, HOI4 1.19.4.1) after owner decision K74 moved ZIN's art to the hoi4-imagegen MCP. The audit is read only: it traces every sprite and texture the mod uses to its asset family and reports reuse, missing and mis-sized art. Command: `.tools/image_generation/hoi4-imagegen/0.2.1/hoi4-imagegen.exe --project-root . --json audit --limit 5000`.

Totals: 10,055 sprite uses, 32,793 sprites indexed, 24,752 textures resolved, 0 textures missing, 0 header errors.

| Code | Count | Disposition |
| --- | --- | --- |
| GFX-CANVAS-SIZE | 780 | Split below: most are sizes ZIN's design system settled; the rest are cross-family reuse. |
| GFX-FAMILY-REUSE | 332 | Split below. |
| GFX-CARD-CORNERS | 120 | Accepted deviation, allowlist. |
| GFX-SPRITE-UNDEFINED | 6 | False positive, allowlist. |

## GFX-CANVAS-SIZE (780)

- **Sizes the design system settled** (docs/specs/07_interface/07_design_system.md §4.2, accepted under K69, recorded in tools/content/data/ui/design_system.json `iconFamilies`): technology 64 x 64 (287 uses; vanilla 146 x 54 or 131 x 52), decision seals 32 x 32 (119; vanilla 33 x 32). **Plan:** record these as ZIN rows in `.tools/gfx/profiles.json`, as Chaos Redux does for its own sizes, so hoi4-imagegen reports the difference from vanilla instead of an error and new art uses ZIN's canvas.
- **Decisions on national-spirit pictures** (56 uses, 64 x 64): decisions whose `icon =` names an idea sprite directly, in zin_aenor_court.txt (18), zin_dark.txt (14), zin_mistake.txt (10), zin_cold.txt (7), zin_sun.txt (4), zin_east.txt (2), zin_inst.txt (1). The I11 seal lane rewrote only GFX_decision_zin_* sprites. **Plan:** one 32 x 32 seal each through the hoi4-imagegen decision family, extending modules/decision_art.mjs to these decisions.
- **Other families on national-spirit pictures** (64 x 64 idea art used as): operation icons (54) and pictures (46), decision category icons (39) and pictures (15), state modifiers (34), officer-corps spirits (26), agency upgrades (20) and logos (15), MIO traits (14) and policies (12), special project icons (13), and smaller groups. These are the design system's "cross-family texture without a share" (check 12). **Plan:** per family, own art through the matching hoi4-imagegen family, in lanes ordered by visibility: decision categories, state modifiers, officer-corps spirits, intelligence (agency and operations), MIO, special projects.

## GFX-FAMILY-REUSE (332)

- 159 commander_portrait + leader_portrait: a character who is both country leader and commander shows one portrait in both roles, which is how the engine draws a character. **Plan:** allowlist with that reason.
- The rest (173) are the cross-family uses above (decision, state modifier, operation, officer corps, agency and decision category on national-spirit art). They close with the lanes above.

## GFX-CARD-CORNERS (120)

Report-event pictures (210 x 176) lack vanilla's tilted card with transparent corners. ZIN's event pictures are painted scenes in the Chancery event frame (design system §4.2, K69). **Plan:** allowlist with that reason.

## GFX-SPRITE-UNDEFINED (6)

common/occupation_laws/occupation_laws.txt writes `icon = <n>`, a frame index into the occupation-policy strip as in vanilla, not a sprite name. **Plan:** allowlist with that reason.

## Achievements

The nine deep-past achievements have no icons (kit check GFX-IMPLICIT). One was generated through hoi4-imagegen as the route check (deep_past zin_ach_two_counts: transparent, processed into its colour, grey and not-eligible triplet with the pinned templates). **Plan:** the other eight through the achievement family; the lane I11 gptimage attempts (art/source/achievement/, kept with their provenance) are superseded, not shipped.

## Processing

hoi4-imagegen's per-family processing covers steps ZIN did in its own modules: canvas fit and margins, transparency validation from pixels, DDS export, and for achievements the template triplet. ZIN-specific steps it does not cover stay in ZIN's builder: cutting sheets of many cells (idea_art, decision_art, event_art), the shaped-emblem cut of the icon catalog, theme sprites cut from chrome sheets (Chancery, Chronicle, Banner Hall), and staging through the content build and the atomic apply. Shipped art is not reprocessed or regenerated (K74).
