# The roster transition: what must happen before the next apply

**Status:** Blocker for the lead. **Date:** 24 October 2026. **Scope:** the move from the 305 debug-tag rows (Y01 ... Y8H) to the 156 realms of `tools/content/data/world/roster.json` (requirements R-20 to R-29, R-27).

The builder now builds every country for the new roster: the tag table `common/country_tags/01_zin_realms.txt`, one country file and one history file per realm (`common/countries/<TAG> - <Name>.txt`, `history/countries/<TAG> - <Name>.txt`), the realm names (`localisation/english/zin_realms_l_english.yml`), the flags (`gfx/flags/<TAG>.tga` and the medium and small sizes), the orders of battle (`history/units/<TAG>_world.txt`) and the bookmark (`common/bookmarks/world.txt`, a shared entry point). The mod still holds the map generator's files of the retired rows. Every check of the builder already reads the mod without them (`tools/content/lib/roster.mjs`, `SUPERSEDED_WORLD_FILES`), but the game would load them.

## Before applying a build of this branch

1. **Retire the map generator's files of the old rows**, in the same transaction as the apply or before it. They are owned by `.hoi4-agent-world.json`, so `apply.mts` refuses to touch them:
   - `common/country_tags/00_zin_countries.txt` (305 tags; with the 156 new tags and the 75 dynamic tags the game would load 536 tags and crash above 439);
   - `common/countries/Y?? - *.txt` (305 files; `common/countries/colors.txt` names only old tags and may go with them);
   - `history/countries/Y?? - *.txt` (305 files: they recruit `Y??_zin_ruler`, which no file defines any more);
   - `history/units/Y??_world.txt` (305 files);
   - `gfx/flags/Y??.tga`, `gfx/flags/medium/Y??.tga`, `gfx/flags/small/Y??.tga` (915 files);
   - the country keys of `localisation/replace/world_l_english.yml` (`Y??`, `Y??_DEF`, `Y??_ADJ`, `Y??_WORLD_DESC`, `ZIN_FACTION_Y??`) and its bookmark keys.
2. **Give the states their new owners.** `history/states/*.txt` still name the old tags. `tools/content/data/world/state_assignment.json` gives every one of the 1,332 states its realm, with the rule and the reason (kept, renamed, merged, split by nearest seat, removed, wild land, carved); the capitals are in its `capitals` table. The politics step (or a one-off rewrite through the shared engine) writes `owner` and `add_core_of` from it. Until then the builder reads the owners from that file, never from the state files.
3. **Re-run the map generator's own checks** after both steps; `.hoi4-agent-world.json` must drop the retired paths.

When the new map from the owner's drawing replaces the old one, the politics step redoes the state assignment on it: the carve rules and the reasons of `state_assignment.json` (`rules.carve`, `rules.splitAnchors`, `rules.wildHolders`) say what each realm should hold, and the roster's `extent` gives the target size.

## What the builder no longer needs from the politics step

The country histories (capital, start setup, politics, the court, subjects and leagues, the start technologies and doctrines of `docs/design/technology/start_packages.json`) are written by `tools/content/modules/countries.mjs` from the roster, the state assignment, the characters and the start packages. The politics step keeps the state ownership and anything map-bound.

## Open art work

- The realms' own flags: `node tools/content/art/flag-jobs.mjs` writes 14 sheets of 12 from `heraldry.json` (`realm-flags-jobs.json`, `realm-flags-cells.json`). Nothing is generated yet. After generation and review, `modules/art.mjs` `stageRealmFlags` must read the new cell map instead of the old row's flag, and the 45 `FLAG_MISSING` baseline entries (rows P0780 to P0794 of `docs/plans/zin-art/pending_from_integration.md`) are dropped.
