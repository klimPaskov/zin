# K51 technology tree redesign: handoff

**Decision:** K51 (owner, 25 October 2026): "The technology should span much more than just few years, there can be third age techs as well. And also, I don't like that the techs all look just like boxes and linear everything. Some techs that unlock equipment should use large layout. And some techs could require multiple techs or some techs could be mutually exclusive etc." Recorded in `docs/specs/INTEGRATION_DECISIONS.md`.

**Status:** Implemented in the builder, data, specs and tests.
The technology and warfare tests pass (121 of 121), and the full build passes. The suite's 4 remaining failures belong to other agents' work in progress (section "Verification").
Every name, year, effect, era assignment and lost-knowledge row below is **proposed** (designer's choice within canon while the owner was away), not lore.

## What changed

| Surface | Change |
| --- | --- |
| `tools/content/lib/tech_layout.mjs` | Era bands; per-folder row compaction; every gridbox at the folder origin (210, 70); the large item geometry (183 × 84 at −56, −7) and the small one (72 × 72); `folderGeometry()`, which models the engine connector (down one unit, across in the gutter row, down) and reports overlapping tiles, a connector through a tile, crossing or merging connectors of unrelated paths, and an exclusive pair that is not side by side; cost rule with `late` and `lost` |
| `tools/content/lib/tech_tree_gui.mjs` | Each ZIN folder's regular item is cloned from the installed large item `techtree_infantry_folder_item` (it was a clone of the small item); gridboxes at the folder origin with the folder's size; captions keyed by band; the template text "Happy-Go-Lucky-Tank" is emptied |
| `tools/content/modules/technologies.mjs` (technology hunks only; the doctrine wiring is the icon agent's) | Years 1 to 1800 (`YEAR_MIN`, `YEAR_MAX`, `FOURTH_AGE_FROM = 100`); several path parents per technology (in the same folder), with `ignore_for_layout = yes` on every parent after the first; `all` (an AND: the path parents are also written to `dependencies`); `lost` (Third Age knowledge, needs later learning, never in a package, never exclusive); reachability check (`mandatory()`: nothing may need both sides of an exclusive pair); OR-aware closure of start packages and start lists (`prerequisitesToAdd()`); `force_use_small_tech_layout` only on technologies that unlock no equipment; the layout export carries the item kind, the drawn edges and the exclusive pairs |
| `tools/content/data/technologies.json`, `technologies_warfare.json` | 54 new rows, re-dated and re-placed rows, new bands, captions and cost rule, the group `dwarves` |
| `tools/content/data/technologies_packages.json` | Field Healers for the men's packages, The Long Watch for the elves, Hall-Delving and Deep Forges for the four dwarf holds; note on lost and exclusive rows |
| `tools/content/data/warfare_equipment.json`, `warfare_ids.json` | 15 late equipment variants (warfare spec §3); the ids file regenerated with `node tools/content/write_warfare_ids.mjs` |
| `tools/content/warfare.test.mjs` | The black-powder count is 12 (nine of K19 and three late powder technologies) |
| `tools/content/technologies.test.mjs` | Updated counts and tables, plus the K51 tests: geometry, large equipment items, branching and reachability, span and era captions, Third Age start knowledge and lost knowledge, and negative tests for the new rules |
| `docs/specs/03_gameplay/07_industry_and_electronics_techs.md` | §3.1 span, eras, lost knowledge and costs; §3.2 paths (OR, AND and rejoin), XOR rules and reachability; §3.3 start knowledge; §4.2 and §4.3 tables regenerated from the data (new column Kind); §5 layout rules rewritten; schema and validation lists |
| `docs/specs/03_gameplay/01_warfare.md` | §3 late variants; §11 intro; §11.1 to §11.8 tables (years, Requires as keys with "(all)" for AND joins, new rows); §13.3 note |
| `docs/design/technology/layout.json`, `start_packages.json` | Regenerated from the builder (the same bytes the build stages) |
| `docs/plans/zin-art/tech_icon_list.json` | The icon agent's list: 231 technologies, 86 large equipment pictures and 145 small icons, each with sprite, texture path, folder, era, who sees it and a one-line brief |

## Counts, before and after

| Folder | Before | After | Large | Third Age | Early 4A | ≥ 1768 | Several parents | Exclusive | Lost | Rows | Edges (turning) |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| Craft and Works (`industry_folder`) | 39 | 48 | 0 | 9 | 0 | 5 | 2 | 4 | 1 | 13 | 39 (8) |
| Letters and Beacons (`electronics_folder`) | 15 | 19 | 0 | 2 | 1 | 3 | 1 | 0 | 1 | 12 | 15 (2) |
| Arms and Armour | 34 | 49 | 30 | 8 | 0 | 10 | 4 | 6 | 0 | 15 | 42 (18) |
| Mounts and Kin | 17 | 21 | 15 | 7 | 0 | 3 | 1 | 2 | 1 | 11 | 12 (6) |
| Engines and Walls | 20 | 24 | 12 | 2 | 1 | 3 | 2 | 2 | 1 | 13 | 22 (11) |
| Lore and Wards | 16 | 22 | 11 | 8 | 0 | 2 | 0 | 2 | 3 | 9 | 13 (4) |
| Camp and Road | 14 | 18 | 6 | 2 | 1 | 3 | 1 | 2 | 0 | 12 | 15 (9) |
| Galleys and Warships | 17 | 23 | 8 | 3 | 2 | 3 | 1 | 2 | 1 | 14 | 17 (7) |
| Eyries | 5 | 7 | 4 | 1 | 0 | 1 | 1 | 2 | 0 | 6 | 6 (4) |
| **Total** | **177** | **231** | **86** | **42** | **5** | **33** | **13** | **22 (11 pairs)** | **8** | | |

Before K51 every tile was small (forced), every connector was straight, no technology had two path parents, and there were 2 exclusive pairs.
The latest year was 1775; it is now 1788 (17 technologies from 4A 1776 on, the cost rule's late band).
The gates (7) are unchanged.

**Era rows.** 16 bands: *The Third Age* (year values 1 to 49), *The Late Third Age* (50 to 99), *The Early Fourth Age* (4A 100 to 1499), then 13 Fourth Age year rows from "4A 1500 to 1649" to "4A 1785 to 1800".
Each folder shows only the bands it uses.
The year values of the two old rows are ordering numbers; no text states them, and the test "K51 span" refuses any caption or technology text that numbers an old age.

**Several-parent technologies (13).**
- AND (5): Irrigation Canals, Chanceries, Curtain Walls, Great Depots, Pike and Shot.
- OR rejoins after a choice (8): Guild Charters, Tempered Plate, Veteran File-Leaders, Remount Depots, Master Engines, Chieftains' Iron, Galley Squadrons, Barded Griffins.

**Exclusive pairs (11).**
- Kept: Great Halls and Village Forges; Pattern Books and Masters' Benches.
- New: Harness of Proof and Half-Harness; Pike Squares and Sword-and-Buckler Men; Blackened Iron and Goblin Swarms; the Couched Lance and Light Horse; Engine Crews and Field Engine Trains; the Old Songs and the Songs of the Hunt; Winter Quarters and Water Caravans; Fireships and Bronze Rams; Sky Lances and Far-Flying Eyries.
- Each new side has its own effects and an AI weight that reads the realm: its people, its region, war or peace, being a major, or a technology it holds.

**Lost knowledge (8).** The Refuge Granaries, Couriers' Ciphers, the Old Horse-Lines, the Old Wall-Craft, Rites of Unbinding, the Healers' Case-Rolls, the Anchor-Stones and the Old Sea-Roads. Each is visible to its people from the start and recovered through Fourth Age needs (Libraries, Universities, Arch and Vault, Deeper Rites, Lantern Wards, Field Healers); none is in a package.

**New equipment variants (15):** arms `_6`, bows `_5`, hand-guns `_4` and `_5`, armour `_5`, mounts `_4`, elven arms `_4`, bombards `_5`, troll, giant, ent, yeti and ogre gear `_3`, griffins `_3`, pack trains `_3`. A wagon train `_2` was dropped because `train_equipment_2` is a vanilla key (the warfare test refuses it); Post Roads gives supply instead.

## Engine facts used (sources)

- Large and small items: wiki *Technology modding*, items section (a technology that unlocks equipment uses `techtree_<folder>_item`, otherwise the small item; `force_use_small_tech_layout`); installed `interface/countrytechtreeview.gui`, `techtree_infantry_folder_item` (183 × 84 at −56, −7, `Name` text, `Icon` centred at 91, 50) and `techtree_infantry_folder_small_item` (72 × 72); `gfx/interface/techtree/technology_unavailable_item_bg.dds` is 183 × 84.
- Several path parents, `ignore_for_layout`: wiki *Technology modding*, path section ("Found multiple potential grid boxes for tech"); vanilla `common/technologies/naval.txt` (`early_light_cruiser`) and `MTG_naval.txt`.
- Gridboxes sharing one position: vanilla `infantry_folder` (`support_weapons_tree` and `night_vision_tree` both at 140, 210).
- `dependencies` is an AND and `path` an OR; `XOR` must be on both sides: wiki *Technology modding*. Exclusive pairs two slots apart in one row: vanilla `industry.txt` (`concentrated_industry` and `dispersed_industry` at x 4 and 6).
- Connector shape for `"UP"`: `.agents/skills/hoi4-technology-doctrines/references/technology-tree-gui.md` (one unit down, across, then down; the 70-pixel `techtree_line_item`).

## MCP evidence

The released server 4.4.0 (`runtime-v440`) was driven over MCP stdio by `scratchpad/k51_mcp.mjs`, which saves every linked resource.
Full-size PNGs over 1 MiB come back truncated through `readResource`, so the images were read from the artifact store and scaled down by `scratchpad/k51_view.cjs`.

**Before** (workspace `zin`, the applied mod): a `hoi4_tech_inspect` scan, nine `hoi4_tech_render` folder views, the exclusive view and a lint.
Every folder showed rows of identical small tiles joined by straight vertical lines.
Output is in `scratchpad/k51/before/`.

**After:** a private configuration (`scratchpad/k51/config_after.json`; the global configuration is untouched) registers workspace `k51after`.
Its root is the staged output of the technology module alone (`scratchpad/k51_stage.mjs`, plus the warfare equipment files from `scratchpad/k51_eqstage.mjs`), with the applied mod as a dependency.
1. **Scan and folder renders.** A scan, nine folder renders (`TECH_RENDERED` for all nine), the exclusive view and a lint. Arms, Naval, Eyries and Letters were re-rendered after the final changes. Output is in `scratchpad/k51/after/` and `after2/`.
2. **What the renders confirm.** Every tile is placed at its source pixel (`geometryStatus` `source_pixel`, `sourceAccurate` true). The large items are 183 × 84 at −56, −7 (`layoutSize` "large"). The diamonds of the exclusive pairs show their split and rejoin. The Pike and Shot AND join and the Elven Arms split are drawn.
3. **Fixes made from the renders.** The Elven block in Arms and Armour was widened: the Sun Guard large tile stood 12 px from Forest Rangers, and the warband and valley columns moved right. A sandbox technology (Corsair Havens) was added under Corsair Craft, whose column was empty.
4. **Limits of the renders.** The renderer routes connectors with its own side-entry, obstacle-avoiding paths, so its lines are not the engine's down–across–down lines. Connector correctness rests on the build's `folderGeometry` check of the engine rule, which passes for all nine folders. Every icon is still the interim ZIN frame (128 × 128), drawn at its native size, so the large tiles look like tall squares in the render.
5. **Compare.** `hoi4_tech_inspect` mode `compare` on the applied mod, with the 24 staged technology, equipment, interface and localisation files of the final data as proposed overlays (`TECH_COMPARED_PARTIAL`, output in `scratchpad/k51/compare3/`):
   - 0 regressions and 0 newly orphaned technologies.
   - 54 technologies added and newly reachable; 175 moved; 15 unlocks added.
   - 80 edges added (13 with `ignoreForLayout`) and 2 removed: Full Plate to Tempered Plate and Great Studs to Remount Depots, now rejoins through the exclusive pairs.
   - Introduced: 2 `design_warning TECH_SUSPICIOUS_IDENTICAL_SIGNATURE`, on Harness of Proof and Half-Harness and on Pike Squares and Sword-and-Buckler Men. Their sub-unit stat blocks differ (defence and strength against speed and breakthrough; defence and breakthrough against attack and terrain), so this is read as the analyzer's signature not hashing sub-unit stat values; not changed.
   - An earlier compare run without the equipment overlay reported `TECH_UNLOCK_TARGET_MISSING` for exactly the new variants; with the warfare equipment files in the overlay they are gone.

## Verification

- `node --test content/technologies.test.mjs` passes 53 of 53 tests, including the K51 tests: no overlapping tiles, no connector through a tile, no crossing connectors, every exclusive pair written both ways and side by side, every several-parent technology drawn and reachable, every equipment technology large, every Third Age caption an era name without digits, and no text numbering an old age.
- **Full build and suite.**
  - The first run (`verify.sh k51a`) stopped in the asset gate on 86 `PROV_NO_MANIFEST_LINE` errors from the doctrine art commit `cb5e3b25`, which `9232328e` fixed.
  - The second run (`k51b`) built and showed three failures from this work: `train_equipment_2` is a vanilla key, `warfare_ids.json` was stale, and the black-powder count was 9. The variant was dropped, the ids file regenerated and the count set to 12. The technology and warfare tests then passed (121 of 121).
  - The final run (`k51c`, on HEAD `b9d4a906` plus the working tree): the build exits 0, and the suite passes 1676 of 1681 (1 skipped).
  - The 4 failures are outside the technology tree: three flag tests (flag cell map, flag jobs, staged flag sources) from the K53 flag work in progress, and "The build is deterministic". That test's second build failed in `lib/mp_volgan_content.mjs` (a missing character) after a banned-word report on the faith name "The Old Knots", both edits made by other agents in the shared working tree while the suite ran (a direct rebuild reproduced the same error).
- The text check and the asset gate report no new technology finding.
- **Not observed in game:**
  - how the engine draws a connector from a second parent in another gridbox at the same origin;
  - the large item with real equipment pictures;
  - whether any tooltip shows a technology's start year (a Third Age row would then show its ordering value);
  - AI research choices under the new weights;
  - the pacing targets of spec §6 with 54 more technologies (most are Third Age start knowledge, late sandbox rows or exclusive halves, so campaign-window demand grew only by the exclusive choices and a few rows).

## For the icon agent

`docs/plans/zin-art/tech_icon_list.json` lists all 231 sprites.
Large equipment technologies (86) take a picture of about 160 × 64 on a transparent ground, centred in the 183 × 84 large item; vanilla equipment technology pictures are 103 to 160 wide and 30 to 64 high.
Each should be the same picture as the equipment's own icon.
Small technologies (144) take 64 × 64 icons.
The wiring needs nothing more: `interface/zin_technologies.gfx` points `GFX_<technology>_medium` at `gfx/interface/technologies/zin/<technology>.dds` as soon as that file exists.
The 15 new equipment variants also need equipment pictures in the warfare module's equipment art.

## Owner questions

1. **Third Age year values.** The old rows use ordering values 1 to 99, and the Fourth Age starts at 100 in the tree. Is that acceptable, or should the Third Age rows live elsewhere (for example below 0, which the engine may not accept)?
2. **Captions.** "The Third Age", "The Late Third Age", "The Early Fourth Age", then "4A 1500 to 1649" onward. Keep these, or do you want named periods instead?
3. **Lost knowledge.** Eight rows recovered by later learning; their names avoid the vault's proposed story names (Lantern Chain, Black Roots, War of Unbinding). Should any of them use those names, or should any be cut?
4. **The dwarf holds.** Hall-Delving and Deep Forges give the four holds their own Third Age craft. The vault still treats the dwarves as open, so these are proposals.
5. **Exclusive choices.** Nine new pairs. Are any of them choices you do not want forced (for example pike against sword-and-buckler, or winter against water)?
6. **Late variants.** Sixteen new equipment variants to 4A 1788 (Crown-Iron Arms, Firelock Hand-Guns and the others). Keep their names and years?
7. **Rows per folder.** Each folder shows only its own eras, so the same era sits at a different height in different folders. Keep this, or align every folder to one global row table (with empty rows)?

## Commit scope

The technology, layout, GUI, data, test, spec, design-export, icon-list and handoff paths above only.
`tools/content/modules/technologies.mjs` carries no other agent's hunks at the time of writing (the doctrine wiring was committed in `cb5e3b25`).

The K51 tree was committed as `65e062ec`. The owner answered questions 3, 4, 5 and 7 under K57 (keep the eight lost arts, all eleven exclusive pairs, each folder's own eras, and Hall-Delving and Deep Forges); questions 1, 2 and 6 keep their defaults.

# K58 extension: ways of life and development tiers

**Decision:** K58 (owner, 25 October 2026): "every region should have their own special technologies, like predominantly rider culture country, would have horse technology and riding, etc. Or desert people would have camels, and elephants, etc. You get the gist. But they can also develop advanced techs like any other country if they really really put effort into technology, and that should be hard for less civilized countries."

**Status:** Implemented in the builder, data, specs and tests. The technology, warfare and forces tests pass 181 of 181. The full build and suite were run on HEAD plus only these files in a scratch worktree, because the shared tree held other agents' unfinished work. The build exits 0 and the suite passes 1686 of 1692 (4 skipped); the 2 failures are listed under Verification and are not from this work. Every name, grouping, effect, year and tier assignment below is **proposed** within K58.

## Ways of life (craft spec section 3.5)

A way groups the cultures of `data/cultures_game.json` by how their realms live (`technologies.json` `ways`). Way technologies are seen and researched only by realms whose dominant culture is in the way (`allow_branch` with `zin_way_<key>`, an OR of `zin_is_culture_<culture>`). Each way's line stands in the folder of its craft, and the line weighs 60 for the AI. A realm starts with its way's start-era rows (before 1746).

| Way | Cultures | Realms | Folder | Technologies | Large tiles, units |
| --- | --- | ---: | --- | ---: | --- |
| Riders of the Steppe | steppe_rider | 2 | Mounts and Kin | 5 | Steppe Breeds (war mounts `_1`, horse archers) |
| Peoples of the Sand | noris_riders, naamis_sea_crown, miaed_pass_lords, wahatud_oasis_folk | 4 | Mounts and Kin | 5 | War Elephants and Towered Elephants (new equipment `zin_elephant_equipment_0`/`_1`, new sub-unit `zin_men_war_elephants`); camel riders |
| River and Road Cities | caravan_princes, river_kings, lake_road_cities, red_lands_tribunes, quay_folk | 15 | Craft and Works | 4 | - |
| Sea-Kings of the North | leren_sea_kings, free_crowns_north | 10 | Galleys and Warships | 3 | Longships (raider hull `_0`) |
| Island Folk | chart_islanders, corsair_lords, southern_islanders, orato_fishers | 20 | Galleys and Warships | 4 | Outrigger Galleys (galley hull `_1`) |
| Folk of the Long Winter | winter_crown, ice_clans, vindael_seafarers, reindeer_clans, woqood_sealers | 16 | Camp and Road | 4 | Reindeer Sledges (pack trains `_1`) |
| Folk of the Deep Woods | veiled_folk, redbark_tribes, selen_ranger | 3 | Camp and Road | 3 | rangers |
| Clans and Guilds of the West | gunwyn_clans, girdon_wardens, western_guilds, buldor_companies | 11 | Arms and Armour | 3 | - |
| Iron Warlords | dondor_brutes, melkgard_warlords | 3 | Arms and Armour | 3 | - |
| Wardens of the Passes | mirolon_wardens, ember_freeholds | 4 | Engines and Walls | 3 | - |
| The Lake Crowns | lake_aenoran and seven more Aenoran cultures | 12 | Letters and Beacons | 4 | - |
| Hearth and Holt | hearth_folk, holt_gnomes | 3 | Craft and Works | 3 | - |
| The Warrens | goblin_warrens, road_warrens, king_warrens, spring_warrens | 4 | Craft and Works | 3 | - |

13 ways, 47 technologies (6 large), plus Hold Engineers (1752) as the dwarf holds' third craft. The elves, Sunhot, orc holds, kin, dead and demons keep their existing people lines as their ways. A test refuses two way technologies of different ways with the same effects, so no line copies another.

**War elephants (new).** The equipment archetype `zin_elephant_equipment` has `_0` War Elephants (1730) and `_1` Towered Elephants (1758). It is produced only by the desert cultures (`can_be_produced` on their culture flags) and costs 2 Horses. The sub-unit `zin_men_war_elephants` (armor group, width 3, hardness 0.4) is strong on desert and plains and weak in forest, marsh, mountains and towns. Its counter is on the ZIN frame; it borrows the infantry model like the camel riders (decision P13). The start template "Elephant Host" is used by the desert realms (`forces_templates.json`, cultural weight `elephant`). The warfare spec sections 3 and 4.1 are updated.

## Development tiers (craft spec section 3.6)

| Tier | Start packages | Realms at start | Advanced-learning research cost | AI weight on advanced techs |
| --- | --- | ---: | ---: | ---: |
| Learned | Concord, Great crowns, Elves, Sunhot | 84 | +0 | ×1 |
| Settled | Island and sea, Common men, Dominion | 32 | +30 per cent | ×0.5 |
| Of custom | Tribal, Orcs, the four kin packages, Nether | 39 | +75 per cent | ×0.25 |
| None | Mistake (Zol) | 1 | - | - |

- **Advanced learning:** 102 common technologies of 1746 and later carry the category `cat_zin_advanced`. A people's own craft and every way line are excluded. The dynamic modifier `zin_development` sets `cat_zin_advanced_cost_factor = zin_dev_advanced_cost`, with the value taken from the script constants `zin_development.<tier>_cost`.
- **Effort, never a free event:** each of the following adds one point of learning, and every 3 points lift the realm one tier (`zin_development_learn`, documented in `docs/zin_dynamic_effects.md`):
  - researching Libraries, Universities, Scholars' Conclaves or Royal Academies;
  - the decision "Send Students to Learned Lands" (50 political power, once a year, needs a learned neighbour or league partner);
  - the decision "Endow a House of Learning" (100 political power, every two years, needs Libraries and three workshops).
- **AI:** the AI weight of advanced techs is multiplied by 0.5 for settled realms and 0.25 for realms of custom; way lines weigh 60; the decisions weigh 3 and 2, and 0 at war.

## MCP evidence (K58)

- **Renders.** Workspace `k51after` (the staged technology and warfare output over the applied mod, private config) gave a scan, seven folder renders (`TECH_RENDERED` for Mounts, Naval, Camp, Arms, Engines, Craft and Letters) and a lint. Output is in `scratchpad/k51/k58/`. The steppe line (with its AND join into Steppe Remounts) and the desert line (both elephant tiles large, the Salt Roads split) were checked in the Mounts render. The four new Craft and Works lines were checked in the Craft render.
- **Compare.** `hoi4_tech_inspect` mode `compare` on the applied mod, with 37 staged technology, unit, equipment, interface and localisation files as overlays (`scratchpad/k51/k58c/`):
  - 0 regressions and 0 newly orphaned technologies;
  - 102 technologies added and newly reachable since the applied tree (54 of K51 and 48 of K58); 26 unlocks added; 117 edges added and 2 removed;
  - introduced: only the 2 known `TECH_SUSPICIOUS_IDENTICAL_SIGNATURE` design warnings of K51.
- **Layout check.** The build's geometry check passes for every folder with the way lines in place.

## Verification (K58)

- `node --test content/technologies.test.mjs content/warfare.test.mjs content/forces.test.mjs` passes 181 of 181. The new tests: "K58 ways of life" (13 ways, triggers, hidden roots, at least three technologies each, AI weight, realms, start knowledge, no copied effects, the six large tiles, the elephants) and "K58 development" (tiers, constants, the modifier, effects, start call, tiers per realm, the learning sources, the decisions, the advanced category on exactly the right technologies, the AI factors, text).
- **Shared tree run (`rgt`).** The build stopped on 5 `UNIQ_PORTRAIT_POOL` asset errors in `common/characters` from the portrait and character work in progress.
- **Worktree run (HEAD plus only the K58 and K51 files).** The build exits 0, and the suite passes 1686 of 1692 (4 skipped). The 2 failures are outside this work:
  - "Every country has a generated flag; every staged art source traces to a recorded generation": an untracked realm-flag source from the flag redesign.
  - "The build is deterministic": two builds of the worktree differ only in `art/source/provenance.jsonl`, the art store's generation log that the flag and portrait work is writing.
- **Not observed in game:**
  - that the engine creates `cat_zin_advanced_cost_factor` for a mod category; the documentation's modifier list names every `cat_` category of the loaded game, and vanilla uses `cat_battlefield_support_cost_factor`;
  - the decisions' AI use;
  - the elephants in battle;
  - that a culture changed in play redraws the tree; `zin_culture_set` does not call `mark_technology_tree_layout_dirty`.
- **Limits:**
  - realms created in play get no tier;
  - the way of a realm follows its dominant culture only, not its second culture.

## Icons (K58)

`docs/plans/zin-art/tech_icon_list.json` now lists 279 technologies (92 large, 187 small), and its `otherSprites` section lists:
- the five development sprites: modifier icon, decision category icon and picture, two decision icons (`interface/zin_development.gfx`, all on the ZIN frame until drawn);
- the two elephant equipment pictures and the archetype picture;
- the war elephants' counters, which follow the bespoke-counter rule for custom units.

The war elephants' own 3D model, sounds and counters are pending; they follow the 3D pipeline rules of `CLAUDE.md`.

## Owner questions (K58)

1. **Groupings.** Are the thirteen ways right? For example, should Selen's rangers be with the forest tribes, the Konori with the steppe, and the Lake Crowns cover all eight Aenoran cultures?
2. **Elephants.** War elephants are new to the canon of Aoaz (proposed from the owner's example). Which desert realms keep them, and should they be rare beasts from the far south?
3. **Tier assignment.** Is the start package a fair measure of development? Any realm should move.
4. **Penalties.** Is +75 per cent research for realms of custom (and +30 for settled) the right weight, and is three steps of learning per tier the right pace?
