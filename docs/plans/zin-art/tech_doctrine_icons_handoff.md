# Technology and doctrine icons: handoff

Status as of the doctrine commit cb5e3b25 on zin/integration-r3. The lead instructed that technology icons and folder tabs wait until the new technology tree (decision K51) is in place, so only the doctrine icons are produced here.

## Done: doctrine art (86 of 86 sprites)

Every sprite of interface/zin_doctrines.gfx now points at its own DDS: 52 medallion icons (15 grand, 36 sub, 1 held-in-reserve), 11 track icons, 11 track backgrounds, 4 folder ledgers, 4 folder tabs, 4 folder decor strips. Sizes follow the installed vanilla files: medallions 64x64 (vanilla doctrine icons), track backgrounds 360x660 (vanilla grand_battleplan_bg), tabs 182x61 (vanilla techtree_landdoctrine_tab), decor 764x82 (vanilla doctrine_decor_land). The track icons and folder ledgers use the 64x64 medallion size.

Sheets were generated with gpt-6-luna through tools/content/imagegen.mjs (13 sheets, 13 generations, 0 rejects, 0 retries). Each sheet was viewed and accepted with a review line in the art store jobs/provenance.jsonl (ZIN_ART = C:/Users/klimp/Documents/Projects/hoi4-agent-tools/.tmp/zin-art), and the accepted sheets and their generation and review lines are copied to art/source/doctrines/ and art/source/provenance.jsonl in the mod.

| Sheet | Layout | Keys | Cut |
| --- | --- | --- | --- |
| doctrine-medium-01 to -04 | 4x3 medallions | 12 each | detection |
| doctrine-medium-05 | 4x1 medallions | 4 | detection |
| doctrine-track-01 | 4x3 medallions | 11 track icons and land ledger | detection |
| doctrine-track-02 | 3x1 medallions | naval, air, special forces ledgers | detection |
| doctrine-bg-01 to -04 | 3x1, 3x1, 3x1, 2x1 panels | 11 track backgrounds | equal cells, centre cover |
| doctrine-tab-01 | 1x4 plaques | 4 folder tabs | equal cells, left cover |
| doctrine-decor-01 | 1x4 strips | 4 folder decor strips | equal cells, centre cover |

The cell map is tools/content/data/doctrine_art_cells.json (numbers and ids only, marked "complete": true).

## Wiring

- tools/content/modules/doctrine_art.mjs: reads the accepted sheets (acceptance() from modules/presentation.mjs, a review line for the exact bytes), cuts them (cutSheet), ships each sprite as gfx/interface/doctrines/zin/<key>.dds, stages the sources and a manifest (art/source/doctrines/doctrine_art_manifest.json), and checks completeness (assertDoctrineArtComplete: with complete true, any doctrine sprite still on the frame throws).
- tools/content/modules/technologies.mjs (doctrine block only): buildDoctrineArt runs first; each doctrine sprite gets its own texture when shipped and the ZIN frame otherwise; assertDoctrineArtComplete runs before the sprite file is written. The import line and the sprite lines are the only edits in this file from this work; the lead's uncommitted tree changes in the same file are not part of this commit.
- tools/content/doctrine_art.test.mjs (registered in tools/package.json): the cell map covers the 86 doctrine sprites exactly once, the completeness check refuses a frame sprite once complete, and synthetic sheets cut to the vanilla medallion and tab sizes with round alpha.

Verified: the doctrine builder alone, run into a scratch staged set, ships 86 of 86 sprites as DDS (magic DDS, 13 source sheets staged, manifest written), and the three doctrine unit tests pass.

## Not verified: full build and suite

The full build (tools/content/build.mjs through verify.sh) does not pass in this checkout. It fails in prepareModel on the technology layout check: tiles overlap or touch in zin_arms_folder, zin_lore_folder, zin_mounts_folder and zin_naval_folder (14 problems). Those tiles belong to the lead's uncommitted technology tree redesign (tools/content/lib/tech_layout.mjs and the technologies module, K51), not to the doctrine change. The suite result was 1534 pass and 18 fail, and every failure follows from the failed build. Rerun verify.sh after the tree is in place.

## Commit

- cb5e3b25: doctrine art (19 files: 13 sheets, provenance, cell map, module, test, technologies.mjs doctrine hunks, package.json test entry). The commit used a temporary index with only the owned hunks; the lead's hunks in technologies.mjs, tech_layout.mjs and tech_tree_gui.mjs remain unstaged.
- Attribution line: Co-Authored-By Claude Haiku 5.5, as the session attribution instruction requires.

## Quality notes from the review

- doctrine-medium-01: the painted ground is a brown gradient rather than the requested black; detection still cuts each medallion cleanly, and the cut keeps only the round medallion.
- doctrine-medium-02: a padlock sits on the Shield and Spear shield (an extra detail).
- doctrine-medium-04: Corsair Packs shows three blades over a gear, a weak match to a cog-and-blades raider emblem; to revisit if the owner wants a closer subject.
- doctrine-track-01: the Warships icon is a longship, not a line-of-battle sail.
- doctrine-tab-01: the plaques are wider than the 182x61 tab, so the cut anchors left to keep the emblems.
- doctrine-decor-01: the emblem is centred, so the centre cover keeps it.

## Not done (waiting for the new technology tree)

- 177 technology medium icons (GFX_zin_tech_*_medium, gfx/interface/technologies/zin/<key>.dds), including the nine black-powder technologies (cast_bombards, corned_powder, culverins, great_bombards, hand_guns, matchlocks, long_matchlocks, arquebuses, black_powder).
- 7 ZIN folder tabs (GFX_<folder>_tab, gfx/interface/techtree/zin/<folder>_tab.dds, open and closed frames) and the nine folder boards (1230 x 766 at most).
- Equipment-unlocking technologies need the large picture format from K51; the size and placement are for the lead to confirm against the new tree.
- No technology sheet was generated, so nothing is parked in the art store.
