# Lane I4 (focus icons): plan

Owner: lane I4. Inputs: `docs/plans/ui_overhaul/phase2_brief.md`, plan row I4 in `02_plan.md`, design system §4.2 (focus family 100 × 88, Chronicle focus plaque, one subject readable at 50%), §4.3 (deliberate reuse kinds), §4.5 (K69 targets). Decision K69: almost every focus has its own icon; general focuses may share one icon per genuinely general group.

## (a) Grouping: genuinely general focuses

Rule (design system §4.5): two or more trees carry a focus with the same localised name and the same template slug (the focus key). Every copy is the same story branch.

The current share list `tools/content/data/ui/icon_shares.json` is stale. It has 226 `general_focus` groups holding 730 members, but only 409 of those members match a focus id in the current `docs/design/focus/*.json`. The 321 stale members are removed.

Rebuilt from the current JSON with the rule above: **153 general groups holding 336 focuses**, which saves 183 pictures. The group list is written into `icon_shares.json` as `general_focus` entries, status `proposed` (the owner confirms or cuts groups under §4.5).

Same name with a different slug (52 names) is not general under the rule and keeps its own picture.

Canonical art: a group's picture is drawn once, for the group's first member in production order. Every other member's `icon` points at the same sprite `GFX_focus_zin_general_<slug>`.

## (b) Number of distinct pictures

| Measure | Count |
| --- | ---: |
| ZIN focus entries (99 trees in `docs/design/focus/`, minus the README) | 4,476 |
| General groups (rule of §4.5, current JSON) | 153 groups, 336 members |
| **Distinct focus pictures needed** | **4,293** |
| Lead's target in §4.5 (based on the stale 226 groups and the registry) | 4,313 |

Differences from the registry, for the lead: `icon_registry.json` counts 4,817 focus concepts. 373 of them are vanilla focus ids (`CHL_…`, `SPA_…`, `USA_…`, `YUG_…` and similar) that are not in ZIN's focus JSON, and 32 ZIN JSON focuses (for example `zin_regional_pertolor_*`) are missing from the registry. The 20 Worshipdom focuses with no `icon` key in the JSON are covered by per-focus art.

Vanilla focuses in the registry are outside this lane. Lane I4 does not draw them. The lead needs to confirm whether they reach the screen (check 4) before they count toward the target.

## (c) Vanilla form and ZIN form

Vanilla (`interface/goals.gfx`, reference `icons/national_focus/contact_sheet.png`): die-cut medallion, 100 × 88 transparent, metal rim with laurel, full-colour painted subject on a dark field.

ZIN (design system §4.2 and §1.4, Chronicle): **ink-engraved line drawing on a cream vellum disc in a dull blue-grey slate ring with a thin bronze inlay line, one subject, one bold strong silhouette, at most one touch of madder red or dull gold**. This is the technology plate style (`tools/content/modules/technology_art.mjs`, `technology-01` sheet prompt), with the focus size 100 × 88.

Size and frame: the medallion is circular, its diameter equals the height 88 px, and it is centred in 100 px width with transparent side margins. Outside the circle is fully transparent (alpha 0). The ring is opaque. No glow, no white halo, no outline outside the ring.

Format: DDS `a8r8g8b8` (repository convention, `lib/raster.mjs` `dds()`). At 100 × 88 each DDS is about 35 KB; 4,293 pictures are about 151 MB uncompressed. This is a risk for the lead to decide (a block-compressed format would need a new writer in `lib/raster.mjs`).

Subject rules: the subject names the focus (its name and description, its rewards). No text, numerals, crosses or real-world religious or national symbols, no modern objects (K53), no faces that identify a person, nothing from the Lord of the Rings (no elven spires, white tree, flaming eye, ring inscriptions). Lore: Aenor, Parim, the Lake, the Deliverer's white temples, the Hailed King. Spoilers: no veiled sun and no Zol reveal before its reveal (spec 02 §3.6).

## (d) Sheet layout, naming and wiring

- Generation: `gpt-6-luna` only, `IMAGEGEN_CONCURRENCY=3`, through `tools/content/imagegen.mjs`. Jobs and provenance live in the art store, `C:/Users/klimp/Documents/Projects/hoi4-agent-tools/.tmp/zin-art/jobs/i4/` (its `provenance.jsonl` is appended by the runner). No reference images, so no generation reads from the mod folder.
- Sheet: 4 columns × 3 rows (12 pictures), black `#000000` background with black gutters, 1536 × 1024. A tree's last sheet uses 4 columns × the rows it needs (for example 4 × 2 for 8 pictures).
- Sheet name: `focus-<tree>-<nn>` (for example `focus-aenor-01`), raw file `raw/focus/<sheet>.png`, cut by detection (`findRegionsAdaptive`) and kept in its listed order.
- Icon key (sprite suffix): `<tree>_<focus key>` for an ordinary focus (`aenor_the_golden_court`); `general_<slug>` for a general group (`general_houses_of_healing`, proposed).
- Sprite name: `GFX_focus_zin_<icon key>`. Texture: `gfx/interface/goals/zin/focus/<icon key>.dds`. Shine sprite `GFX_focus_zin_<icon key>_shine` in `interface/zin_focus_art_shine.gfx`. Main sprites in `interface/zin_focus_art.gfx`.
- Cell map: `tools/content/data/focus_art_cells.json`, written by the new builder module `tools/content/modules/focus_art.mjs` (plan from `docs/design/focus/*.json` and `icon_shares.json`). Each sheet carries `status` (`planned`, `accepted`), its keys in order, and its layout. Only `accepted` sheets are cut and shipped; an accepted sheet missing its raw file fails the build (release rule, §4.1 rule 3).
- Compiler: `focus_compiler.mjs` writes `icon = GFX_focus_zin_<icon key>` for a focus whose sheet is accepted, and keeps the old `f.icon` catalogue key for every other focus. So the build stays green while the trees are replaced one by one. The old catalogue sheets (`icons-catalog-01..15`, `presentation.mjs`) still serve the ideas and are left to lane I5.
- Provenance: every generation is appended to `art/source/provenance.jsonl` (append only) with its prompt and sha256. Acceptance review lines follow the runner's `accepted` format.

## (e) Production order

1. Major trees, in this order: aenor (140 pictures), lerendor (127), magical_forest (121), worshipdom (114), mirolon (83), goldoroth (110), gala (82), gunwaith (115), noris (112), coldor (107). The lead's list does not name volgan (114), stabilo (108) and zol (97); they are major trees too and are placed after coldor.
2. Regional trees in alphabetical order (regional_adel to regional_yeti_lands, 3,132 pictures in total, all in the counts below).
3. Shared trees in alphabetical order (shared_cold_lands to shared_west_lands).

Canonical counts per tree in this order (general groups counted once, at their first member): aenor 140; lerendor 127; magical_forest 121; worshipdom 114; mirolon 83; goldoroth 110; gala 82; gunwaith 115; noris 112; coldor 107; volgan 114; stabilo 108; zol 97; the regional trees 14 to 50 each; the shared trees 41 to 66 each. Total **4,293 pictures in 401 sheets** (12 per sheet, per-tree chunks).

## Progress and resume

Progress is recorded per batch in `docs/plans/ui_overhaul/handoffs/I4.md` (sheets accepted, pictures reviewed, sheets regenerated, check deltas). Resume by reading `focus_art_cells.json` (status per sheet), then continuing from the first `planned` sheet in the production order above.

## Open items for the lead

- Confirm the 153 general groups (replacing the stale 226) and cut any the owner rejects.
- Decide the DDS format (uncompressed 151 MB vs a block-compressed writer).
- Decide whether the 373 vanilla focus concepts in the registry are shipped or removed; they are outside ZIN's focus JSON.
- The 401-sheet job is larger than one agent session. The work is resumable through the cell map.
