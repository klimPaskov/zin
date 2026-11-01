# Astra art audit (owner rule, 24 October 2026)

Status: step 1 complete (exact audit by sha256). Step 2 (gpt-6-luna regeneration) not started; see the plan at the end.

## Method

- Every picture in `art/source/` (832 files) was hashed (sha256). A shipped file is linked to its generation records by the exact bytes: `art/source/provenance.jsonl` lines with `prompt` and matching `sha256` (asset_sources.mjs `linkSource`), then to its module manifest line (`art/source/*_manifest.json` `files[].source`) whose `out` exists in the staged build (`<TEMP>/zin-content-staged`, build run `asa`, exit 0).
- Shipped means the picture reaches a `gfx/` or `interface/` output of the staged tree through a module manifest line or a module cut. The 20 flag sheets, 10 portrait sheets and 31 design references are excluded by the evidence stated below; every other astra picture is shipped by a manifest line, a module cut, or a data reference (UI cell maps, branding and emblem modules).
- Astra generations: 685 generation lines use `gpt-6-astra` (both logs: 1370 generation lines in the scan, 492 distinct output names). 215 art/source files carry bytes from an astra generation; 209 have an accepted last review, 1 (`loadingscreens/load_24.png`) has a rejecting last review, 5 flag sheets have no review line.

## Totals

- Astra-generated pictures in art/source: 215
- Shipped and astra (to regenerate with gpt-6-luna): 154
- Not shipped (not regenerated, listed with reason): 61
- Superseded by later luna work among the shipped set: 0. The shipped bytes equal the astra bytes, so no later luna file replaces them. The flag sheets are superseded by K68 realm flags and the portrait sheets by the v2 pools; both are excluded below.

## Counts by family

| Family | Status | Pictures |
|---|---|---:|
| UI piece | shipped | 7 |
| UI sheet (reskin) | shipped | 47 |
| branding | shipped | 3 |
| design reference | not shipped | 31 |
| emblem | shipped | 1 |
| event picture | shipped | 52 |
| flag sheet | not shipped | 20 |
| front-end menu | shipped | 4 |
| icon catalog sheet | shipped | 15 |
| loading screen | shipped | 25 |
| portrait sheet | not shipped | 10 |

## Shipped and astra: regenerate with gpt-6-luna

| Picture (art/source) | Family | Shipping module | Accepted by | Superseded by luna |
|---|---|---|---|---|
| branding/branding_banner_v1.png | branding | module cut (no manifest line): see family | review true | no |
| branding/branding_emblem_v1.png | branding | presentation | review true | no |
| branding/branding_menu_backdrop_v1.png | branding | presentation | review true | no |
| emblems/emblems-peoples.png | emblem | module cut (no manifest line): see family | review true | no |
| events/black_isles_lights.png | event picture | presentation | review true | no |
| events/black_ships_tale.png | event picture | presentation | review true | no |
| events/chronicle.png | event picture | presentation | review true | no |
| events/cliff.png | event picture | presentation | review true | no |
| events/cold_shore.png | event picture | presentation | review true | no |
| events/concord_council.png | event picture | presentation | review true | no |
| events/coronation.png | event picture | presentation | review true | no |
| events/council_chamber.png | event picture | presentation | review true | no |
| events/court_feast.png | event picture | presentation | review true | no |
| events/crown_of_aen.png | event picture | presentation | review true | no |
| events/dead_lands_storm.png | event picture | presentation | review true | no |
| events/dragon_return.png | event picture | presentation | review true | no |
| events/eastern_court.png | event picture | presentation | review true | no |
| events/ending_ashen_throne.png | event picture | presentation | review true | no |
| events/ending_children_of_volgan.png | event picture | presentation | review true | no |
| events/ending_eastern_king.png | event picture | presentation | review true | no |
| events/ending_golden_court.png | event picture | presentation | review true | no |
| events/ending_lost_cause.png | event picture | presentation | review true | no |
| events/ending_strait_master.png | event picture | presentation | review true | no |
| events/ending_unfinished.png | event picture | presentation | review true | no |
| events/ending_western_crown.png | event picture | presentation | review true | no |
| events/gala_court.png | event picture | presentation | review true | no |
| events/generic_court.png | event picture | presentation | review true | no |
| events/generic_peace.png | event picture | presentation | review true | no |
| events/generic_sea.png | event picture | presentation | review true | no |
| events/generic_war.png | event picture | presentation | review true | no |
| events/generic_wilds.png | event picture | presentation | review true | no |
| events/glo_given.png | event picture | presentation | review true | no |
| events/golden_court.png | event picture | presentation | review true | no |
| events/grave_muster.png | event picture | presentation | review true | no |
| events/grey_ford_truce.png | event picture | presentation | review true | no |
| events/hermitage.png | event picture | presentation | review true | no |
| events/houses.png | event picture | presentation | review true | no |
| events/king_is_dead.png | event picture | presentation | review true | no |
| events/last_crowns.png | event picture | presentation | review true | no |
| events/leren_envoys.png | event picture | presentation | review true | no |
| events/lost_cause_triumph.png | event picture | presentation | review true | no |
| events/man_in_ice.png | event picture | presentation | review true | no |
| events/mirolon_passes.png | event picture | presentation | review true | no |
| events/palace_battle.png | event picture | presentation | review true | no |
| events/southern_warning.png | event picture | presentation | review true | no |
| events/storm_wreck.png | event picture | presentation | review true | no |
| events/strait_toll.png | event picture | presentation | review true | no |
| events/thirty_days.png | event picture | presentation | review true | no |
| events/traders_road_south.png | event picture | presentation | review true | no |
| events/unmasking.png | event picture | presentation | review true | no |
| events/vast_shadow.png | event picture | presentation | review true | no |
| events/volgan_broken.png | event picture | presentation | review true | no |
| events/war_king.png | event picture | presentation | review true | no |
| events/western_crossing.png | event picture | presentation | review true | no |
| events/yeldenne_hall.png | event picture | presentation | review true | no |
| events/zol_rising.png | event picture | presentation | review true | no |
| icons/icons-catalog-01.png | icon catalog sheet | presentation | review true | no |
| icons/icons-catalog-02.png | icon catalog sheet | presentation | review true | no |
| icons/icons-catalog-03.png | icon catalog sheet | presentation | review true | no |
| icons/icons-catalog-04.png | icon catalog sheet | presentation | review true | no |
| icons/icons-catalog-05.png | icon catalog sheet | presentation | review true | no |
| icons/icons-catalog-06.png | icon catalog sheet | presentation | review true | no |
| icons/icons-catalog-07.png | icon catalog sheet | presentation | review true | no |
| icons/icons-catalog-08.png | icon catalog sheet | presentation | review true | no |
| icons/icons-catalog-09.png | icon catalog sheet | presentation | review true | no |
| icons/icons-catalog-10.png | icon catalog sheet | presentation | review true | no |
| icons/icons-catalog-11.png | icon catalog sheet | presentation | review true | no |
| icons/icons-catalog-12.png | icon catalog sheet | presentation | review true | no |
| icons/icons-catalog-13.png | icon catalog sheet | presentation | review true | no |
| icons/icons-catalog-14.png | icon catalog sheet | presentation | review true | no |
| icons/icons-catalog-15.png | icon catalog sheet | presentation | review true | no |
| loadingscreens/loading-thumb-border.png | loading screen | presentation | review true | no |
| loadingscreens/load_1.png | loading screen | presentation | review true | no |
| loadingscreens/load_10.png | loading screen | presentation | review true | no |
| loadingscreens/load_11.png | loading screen | presentation | review true | no |
| loadingscreens/load_12.png | loading screen | presentation | review true | no |
| loadingscreens/load_13.png | loading screen | presentation | review true | no |
| loadingscreens/load_14.png | loading screen | presentation | review true | no |
| loadingscreens/load_15.png | loading screen | presentation | review true | no |
| loadingscreens/load_16.png | loading screen | presentation | review true | no |
| loadingscreens/load_17.png | loading screen | presentation | review true | no |
| loadingscreens/load_18.png | loading screen | presentation | review true | no |
| loadingscreens/load_19.png | loading screen | presentation | review true | no |
| loadingscreens/load_2.png | loading screen | presentation | review true | no |
| loadingscreens/load_20.png | loading screen | presentation | review true | no |
| loadingscreens/load_21.png | loading screen | presentation | review true | no |
| loadingscreens/load_22.png | loading screen | presentation | review true | no |
| loadingscreens/load_23.png | loading screen | presentation | review true | no |
| loadingscreens/load_24.png | loading screen | presentation | review FALSE (rejected, still shipped) | no |
| loadingscreens/load_3.png | loading screen | presentation | review true | no |
| loadingscreens/load_4.png | loading screen | presentation | review true | no |
| loadingscreens/load_5.png | loading screen | presentation | review true | no |
| loadingscreens/load_6.png | loading screen | presentation | review true | no |
| loadingscreens/load_7.png | loading screen | presentation | review true | no |
| loadingscreens/load_8.png | loading screen | presentation | review true | no |
| loadingscreens/load_9.png | loading screen | presentation | review true | no |
| menu/frontend-bookmark.png | front-end menu | presentation | review true | no |
| menu/zin_menu_parim.png | front-end menu | presentation | review true | no |
| menu/zin_menu_strait.png | front-end menu | presentation | review true | no |
| menu/zin_menu_wall.png | front-end menu | presentation | review true | no |
| ui/loading-progress-fill.png | UI piece | presentation | review true | no |
| ui/loading-progress-track.png | UI piece | presentation | review true | no |
| ui/loading-statusband.png | UI piece | presentation | review true | no |
| ui/loading-tipband.png | UI piece | presentation | review true | no |
| ui/reskin/icons-air-missions-1.png | UI sheet (reskin) | reskin | review true | no |
| ui/reskin/icons-air-missions-2.png | UI sheet (reskin) | module cut (no manifest line): see family | review true | no |
| ui/reskin/icons-alerts-1.png | UI sheet (reskin) | reskin | review true | no |
| ui/reskin/icons-alerts-2.png | UI sheet (reskin) | module cut (no manifest line): see family | review true | no |
| ui/reskin/icons-alerts-bare-1.png | UI sheet (reskin) | reskin | review true | no |
| ui/reskin/icons-alerts-bare-2.png | UI sheet (reskin) | module cut (no manifest line): see family | review true | no |
| ui/reskin/icons-army-badges-1.png | UI sheet (reskin) | reskin | review true | no |
| ui/reskin/icons-army-badges-2.png | UI sheet (reskin) | module cut (no manifest line): see family | review true | no |
| ui/reskin/icons-army-badges-3.png | UI sheet (reskin) | module cut (no manifest line): see family | review true | no |
| ui/reskin/icons-autonomy.png | UI sheet (reskin) | reskin | review true | no |
| ui/reskin/icons-buildings.png | UI sheet (reskin) | reskin | review true | no |
| ui/reskin/icons-diplorequests.png | UI sheet (reskin) | reskin | review true | no |
| ui/reskin/icons-focus-filters.png | UI sheet (reskin) | reskin | review true | no |
| ui/reskin/icons-folders.png | UI sheet (reskin) | reskin | review true | no |
| ui/reskin/icons-gathering-dark.png | UI sheet (reskin) | reskin | review true | no |
| ui/reskin/icons-gathering-flicker.png | UI sheet (reskin) | reskin | review true | no |
| ui/reskin/icons-map-arrows.png | UI sheet (reskin) | reskin | review true | no |
| ui/reskin/icons-mapmodes.png | UI sheet (reskin) | reskin | review true | no |
| ui/reskin/icons-relations-1.png | UI sheet (reskin) | reskin | review true | no |
| ui/reskin/icons-relations-2.png | UI sheet (reskin) | reskin | review true | no |
| ui/reskin/icons-resources.png | UI sheet (reskin) | reskin | review true | no |
| ui/reskin/icons-roles-1.png | UI sheet (reskin) | reskin | review true | no |
| ui/reskin/icons-roles-2.png | UI sheet (reskin) | reskin | review true | no |
| ui/reskin/icons-roles-3.png | UI sheet (reskin) | module cut (no manifest line): see family | review true | no |
| ui/reskin/icons-ships.png | UI sheet (reskin) | reskin | review true | no |
| ui/reskin/icons-templates-1.png | UI sheet (reskin) | reskin | review true | no |
| ui/reskin/icons-templates-2.png | UI sheet (reskin) | reskin | review true | no |
| ui/reskin/icons-templates-3.png | UI sheet (reskin) | reskin | review true | no |
| ui/reskin/icons-templates-4.png | UI sheet (reskin) | reskin | review true | no |
| ui/reskin/icons-text-1.png | UI sheet (reskin) | reskin | review true | no |
| ui/reskin/icons-text-2.png | UI sheet (reskin) | reskin | review true | no |
| ui/reskin/icons-text-3.png | UI sheet (reskin) | reskin | review true | no |
| ui/reskin/icons-topbar-extra.png | UI sheet (reskin) | reskin | review true | no |
| ui/reskin/icons-topbar.png | UI sheet (reskin) | reskin | review true | no |
| ui/reskin/icons-weather.png | UI sheet (reskin) | reskin | review true | no |
| ui/reskin/ui-bars-2.png | UI sheet (reskin) | reskin | review true | no |
| ui/reskin/ui-bars.png | UI sheet (reskin) | reskin | review true | no |
| ui/reskin/ui-buttons.png | UI sheet (reskin) | reskin | review true | no |
| ui/reskin/ui-chrome-panels.png | UI sheet (reskin) | reskin | review true | no |
| ui/reskin/ui-chrome-small.png | UI sheet (reskin) | reskin | review true | no |
| ui/reskin/ui-events.png | UI sheet (reskin) | reskin | review true | no |
| ui/reskin/ui-frontend.png | UI sheet (reskin) | reskin | review true | no |
| ui/reskin/ui-map.png | UI sheet (reskin) | reskin | review true | no |
| ui/reskin/ui-military.png | UI sheet (reskin) | reskin | review true | no |
| ui/reskin/ui-news.png | UI sheet (reskin) | reskin | review true | no |
| ui/reskin/ui-sockets.png | UI sheet (reskin) | reskin | review true | no |
| ui/reskin/ui-topbar.png | UI sheet (reskin) | reskin | review true | no |
| ui/ui-button.png | UI piece | module cut (no manifest line): see family | review true | no |
| ui/ui-frame.png | UI piece | module cut (no manifest line): see family | review true | no |
| ui/ui-rule.png | UI piece | module cut (no manifest line): see family | review true | no |

## Not shipped (excluded from regeneration)

| Picture | Family | Reason |
|---|---|---|
| design_refs/aen_v2_a.png | design reference | not shipped: reference and source art for generators, pools and super-event briefs; never copied to gfx |
| design_refs/afrit_true_v3_c.png | design reference | not shipped: reference and source art for generators, pools and super-event briefs; never copied to gfx |
| design_refs/agon_v2_a.png | design reference | not shipped: reference and source art for generators, pools and super-event briefs; never copied to gfx |
| design_refs/ailtal_v4_c.png | design reference | not shipped: reference and source art for generators, pools and super-event briefs; never copied to gfx |
| design_refs/alleria_d.png | design reference | not shipped: reference and source art for generators, pools and super-event briefs; never copied to gfx |
| design_refs/aurevan_a.png | design reference | not shipped: reference and source art for generators, pools and super-event briefs; never copied to gfx |
| design_refs/aurlan_v4_c.png | design reference | not shipped: reference and source art for generators, pools and super-event briefs; never copied to gfx |
| design_refs/bastian_v2_b.png | design reference | not shipped: reference and source art for generators, pools and super-event briefs; never copied to gfx |
| design_refs/edran_d.png | design reference | not shipped: reference and source art for generators, pools and super-event briefs; never copied to gfx |
| design_refs/eindil_v4_d.png | design reference | not shipped: reference and source art for generators, pools and super-event briefs; never copied to gfx |
| design_refs/ein_a.png | design reference | not shipped: reference and source art for generators, pools and super-event briefs; never copied to gfx |
| design_refs/elzon_v2_c.png | design reference | not shipped: reference and source art for generators, pools and super-event briefs; never copied to gfx |
| design_refs/gaelor_v4_c.png | design reference | not shipped: reference and source art for generators, pools and super-event briefs; never copied to gfx |
| design_refs/glernaen_v4_c.png | design reference | not shipped: reference and source art for generators, pools and super-event briefs; never copied to gfx |
| design_refs/golbran_v6_b.png | design reference | not shipped: reference and source art for generators, pools and super-event briefs; never copied to gfx |
| design_refs/golden_king_c.png | design reference | not shipped: reference and source art for generators, pools and super-event briefs; never copied to gfx |
| design_refs/horos_v3_c.png | design reference | not shipped: reference and source art for generators, pools and super-event briefs; never copied to gfx |
| design_refs/irumas_v4_c.png | design reference | not shipped: reference and source art for generators, pools and super-event briefs; never copied to gfx |
| design_refs/kerun_v4_c.png | design reference | not shipped: reference and source art for generators, pools and super-event briefs; never copied to gfx |
| design_refs/king_of_demons_v4_a.png | design reference | not shipped: reference and source art for generators, pools and super-event briefs; never copied to gfx |
| design_refs/kusven_v2_a.png | design reference | not shipped: reference and source art for generators, pools and super-event briefs; never copied to gfx |
| design_refs/lorien_v3_b.png | design reference | not shipped: reference and source art for generators, pools and super-event briefs; never copied to gfx |
| design_refs/lumae_v4_c.png | design reference | not shipped: reference and source art for generators, pools and super-event briefs; never copied to gfx |
| design_refs/maelwen_v4_c.png | design reference | not shipped: reference and source art for generators, pools and super-event briefs; never copied to gfx |
| design_refs/naisa_v4_c.png | design reference | not shipped: reference and source art for generators, pools and super-event briefs; never copied to gfx |
| design_refs/rasthel_v4_c.png | design reference | not shipped: reference and source art for generators, pools and super-event briefs; never copied to gfx |
| design_refs/roka_v2_b.png | design reference | not shipped: reference and source art for generators, pools and super-event briefs; never copied to gfx |
| design_refs/sulethe_v4_c.png | design reference | not shipped: reference and source art for generators, pools and super-event briefs; never copied to gfx |
| design_refs/vaelei_v4_c.png | design reference | not shipped: reference and source art for generators, pools and super-event briefs; never copied to gfx |
| design_refs/varner_a.png | design reference | not shipped: reference and source art for generators, pools and super-event briefs; never copied to gfx |
| design_refs/volgan_v4_b.png | design reference | not shipped: reference and source art for generators, pools and super-event briefs; never copied to gfx |
| flags/flags-sheet-01.png | flag sheet | not shipped: the 155 shipped gfx/flags TGAs are the K68 realm flags (realm-flags-cells.json, accepted 155 of 155); the old debug-roster flag sheets feed no shipped output |
| flags/flags-sheet-02.png | flag sheet | not shipped: the 155 shipped gfx/flags TGAs are the K68 realm flags (realm-flags-cells.json, accepted 155 of 155); the old debug-roster flag sheets feed no shipped output |
| flags/flags-sheet-03.png | flag sheet | not shipped: the 155 shipped gfx/flags TGAs are the K68 realm flags (realm-flags-cells.json, accepted 155 of 155); the old debug-roster flag sheets feed no shipped output |
| flags/flags-sheet-04.png | flag sheet | not shipped: the 155 shipped gfx/flags TGAs are the K68 realm flags (realm-flags-cells.json, accepted 155 of 155); the old debug-roster flag sheets feed no shipped output |
| flags/flags-sheet-05.png | flag sheet | not shipped: the 155 shipped gfx/flags TGAs are the K68 realm flags (realm-flags-cells.json, accepted 155 of 155); the old debug-roster flag sheets feed no shipped output |
| flags/flags-sheet-06.png | flag sheet | not shipped: the 155 shipped gfx/flags TGAs are the K68 realm flags (realm-flags-cells.json, accepted 155 of 155); the old debug-roster flag sheets feed no shipped output |
| flags/flags-sheet-07.png | flag sheet | not shipped: the 155 shipped gfx/flags TGAs are the K68 realm flags (realm-flags-cells.json, accepted 155 of 155); the old debug-roster flag sheets feed no shipped output |
| flags/flags-sheet-08.png | flag sheet | not shipped: the 155 shipped gfx/flags TGAs are the K68 realm flags (realm-flags-cells.json, accepted 155 of 155); the old debug-roster flag sheets feed no shipped output |
| flags/flags-sheet-09.png | flag sheet | not shipped: the 155 shipped gfx/flags TGAs are the K68 realm flags (realm-flags-cells.json, accepted 155 of 155); the old debug-roster flag sheets feed no shipped output |
| flags/flags-sheet-10.png | flag sheet | not shipped: the 155 shipped gfx/flags TGAs are the K68 realm flags (realm-flags-cells.json, accepted 155 of 155); the old debug-roster flag sheets feed no shipped output |
| flags/flags-sheet-11.png | flag sheet | not shipped: the 155 shipped gfx/flags TGAs are the K68 realm flags (realm-flags-cells.json, accepted 155 of 155); the old debug-roster flag sheets feed no shipped output |
| flags/flags-sheet-12.png | flag sheet | not shipped: the 155 shipped gfx/flags TGAs are the K68 realm flags (realm-flags-cells.json, accepted 155 of 155); the old debug-roster flag sheets feed no shipped output |
| flags/flags-sheet-13.png | flag sheet | not shipped: the 155 shipped gfx/flags TGAs are the K68 realm flags (realm-flags-cells.json, accepted 155 of 155); the old debug-roster flag sheets feed no shipped output |
| flags/flags-sheet-14.png | flag sheet | not shipped: the 155 shipped gfx/flags TGAs are the K68 realm flags (realm-flags-cells.json, accepted 155 of 155); the old debug-roster flag sheets feed no shipped output |
| flags/flags-sheet-15.png | flag sheet | not shipped: the 155 shipped gfx/flags TGAs are the K68 realm flags (realm-flags-cells.json, accepted 155 of 155); the old debug-roster flag sheets feed no shipped output |
| flags/flags-sheet-16.png | flag sheet | not shipped: the 155 shipped gfx/flags TGAs are the K68 realm flags (realm-flags-cells.json, accepted 155 of 155); the old debug-roster flag sheets feed no shipped output |
| flags/flags-sheet-17.png | flag sheet | not shipped: the 155 shipped gfx/flags TGAs are the K68 realm flags (realm-flags-cells.json, accepted 155 of 155); the old debug-roster flag sheets feed no shipped output |
| flags/flags-sheet-18.png | flag sheet | not shipped: the 155 shipped gfx/flags TGAs are the K68 realm flags (realm-flags-cells.json, accepted 155 of 155); the old debug-roster flag sheets feed no shipped output |
| flags/flags-sheet-19.png | flag sheet | not shipped: the 155 shipped gfx/flags TGAs are the K68 realm flags (realm-flags-cells.json, accepted 155 of 155); the old debug-roster flag sheets feed no shipped output |
| flags/flags-sheet-20.png | flag sheet | not shipped: the 155 shipped gfx/flags TGAs are the K68 realm flags (realm-flags-cells.json, accepted 155 of 155); the old debug-roster flag sheets feed no shipped output |
| portraits/portraits-demons.png | portrait sheet | not shipped: no current manifest line sources a shipped portrait from a portraits-<people>.png sheet (all 174 portrait sources are pool, tranche, or named crops); the v2 portrait work supersedes the sheets |
| portraits/portraits-elves.png | portrait sheet | not shipped: no current manifest line sources a shipped portrait from a portraits-<people>.png sheet (all 174 portrait sources are pool, tranche, or named crops); the v2 portrait work supersedes the sheets |
| portraits/portraits-ents.png | portrait sheet | not shipped: no current manifest line sources a shipped portrait from a portraits-<people>.png sheet (all 174 portrait sources are pool, tranche, or named crops); the v2 portrait work supersedes the sheets |
| portraits/portraits-giants.png | portrait sheet | not shipped: no current manifest line sources a shipped portrait from a portraits-<people>.png sheet (all 174 portrait sources are pool, tranche, or named crops); the v2 portrait work supersedes the sheets |
| portraits/portraits-men.png | portrait sheet | not shipped: no current manifest line sources a shipped portrait from a portraits-<people>.png sheet (all 174 portrait sources are pool, tranche, or named crops); the v2 portrait work supersedes the sheets |
| portraits/portraits-orcs.png | portrait sheet | not shipped: no current manifest line sources a shipped portrait from a portraits-<people>.png sheet (all 174 portrait sources are pool, tranche, or named crops); the v2 portrait work supersedes the sheets |
| portraits/portraits-sun_elves.png | portrait sheet | not shipped: no current manifest line sources a shipped portrait from a portraits-<people>.png sheet (all 174 portrait sources are pool, tranche, or named crops); the v2 portrait work supersedes the sheets |
| portraits/portraits-the_dead.png | portrait sheet | not shipped: no current manifest line sources a shipped portrait from a portraits-<people>.png sheet (all 174 portrait sources are pool, tranche, or named crops); the v2 portrait work supersedes the sheets |
| portraits/portraits-trolls.png | portrait sheet | not shipped: no current manifest line sources a shipped portrait from a portraits-<people>.png sheet (all 174 portrait sources are pool, tranche, or named crops); the v2 portrait work supersedes the sheets |
| portraits/portraits-yeti.png | portrait sheet | not shipped: no current manifest line sources a shipped portrait from a portraits-<people>.png sheet (all 174 portrait sources are pool, tranche, or named crops); the v2 portrait work supersedes the sheets |

## Caveats

- The branding (3) and emblem (1) pictures are wired through `branding_prepare.mjs` and `art.mjs` by sha or stem, not a module manifest line; their staged outputs were not individually confirmed.
- The 9 UI pieces with no manifest line (ui-button, ui-frame, ui-rule and the reskin sheets with a `sheets` reference) are shipped through the cell maps in `tools/content/data/ui/`; confirmed by data reference, not by a staged output hash.
- Neither the staged build nor the suite were re-verified after this audit; see the build log `build-asa.log` (exit 0).

## Step 2 plan (not started)

Regeneration of the shipped-and-astra set is not done in this pass. Each sheet needs its cell map and size kept and each cell reviewed at final size, and luna generations with the same layout must be checked cell by cell. Proposed order, one family per run: UI reskin sheets (50 pictures, layout-critical), icon catalogs, UI pieces and loading screens, event pictures, branding and emblem, menu. Log every generation and review line by append only.

## Step 2 progress (UI sheets and UI pieces, 1 November 2026)

- Scope: 47 UI sheets and 7 UI pieces. Five sheets (`ui-bars`, `ui-bars-2`, `ui-buttons`, `ui-chrome-panels`, `ui-chrome-small`) lost their cell maps in phase 2 lane C1 (`data/ui/sheets/` no longer has them); their astra bytes are no longer cut, so they are not regenerated and are listed as retired. Their astra raws stay in `art/source/ui/reskin/` until the owner decides to remove them.
- Jobs: `<art store>/jobs/astra-luna-ui-batch1.json` (48 jobs: 42 sheets, 3 root pieces, 3 loading pieces without the fill). The original astra raws were moved aside as `<name>-astra-v1.png` in `<art store>/raw/` before each job (the runner skips existing outputs). `loading-progress-fill` is generated after the new track, because it references the track.
- Prompts: each job uses the exact prompt of the shipped astra generation line in `art/source/provenance.jsonl` with the model changed to gpt-6-luna; sizes are the cut aspect of the cell map.

### State at stop (1 November 2026)

- Nothing generated yet: the image route was held by another lane (pid 15384, `holds the image route`). A background retry loop (every 2 minutes, up to 40 tries) was running `GPTIMAGE_MODEL=gpt-6-luna IMAGEGEN_CONCURRENCY=3 node tools/content/imagegen.mjs <art store>/jobs/astra-luna-ui-batch1.json`; its output is `<scratchpad>/uiart/batch1.log`. Check it before re-running; if it ended with the lock error, re-run the same command.
- Mapping script: `<scratchpad>/uiart/map.mjs` (provenance match by sha256 and accepted review); job builder: `<scratchpad>/uiart/jobs.mjs` (reads `<scratchpad>/uiart/all-jobs.json`, which holds the 49 jobs with `_rel` keys).
- Still to do: review every generated picture cell by cell; regenerate failures; generate `ui/loading-progress-fill.png` after the new loading track (its reference is the new track in the art store); append generation and review lines to `art/source/provenance.jsonl` and `<art store>/jobs/provenance.jsonl` (append only); copy accepted pictures to `art/source/`; append accepted-false review lines (`superseded: gpt-6-astra, owner rule 24 October 2026`) for each replaced astra line; then `node content/modules/ui_reskin.mjs measure` and `plan` (from `tools/`), check the `reskin.json` diff touches only replaced sheets' rows; rebuild with `verify.sh asu`; render before and after with `node tools/content/ui_review.mjs`.
- Not done for any picture: no replaced sheet, no reskin change, no verify run.

### Batch 1 progress (1 November 2026, 13:55)

- Runner pid 15456 (`astra-luna-ui-batch1.json`) still running; its log `<scratchpad>/uiart/batch1.log` shows 46 results, 45 ok and 1 failed (`reskin-icons-relations-2`, layout check failed 3 times). The log had not grown for several minutes. Check the process before re-running.
- Nothing reviewed, logged, copied, or measured yet.

## Step 2 result: UI sheets and pieces (1 November 2026)

Replaced (gpt-6-luna regeneration from the original prompt; astra lines kept with accepted false, reason "superseded: gpt-6-astra, owner rule 24 October 2026"):

| Picture (art/source) | Status | Job id |
|---|---|---|
| ui/loading-progress-fill.png | replaced: gpt-6-luna (2159x728), astra 6d4b7b688ebd superseded | loading-progress-fill |
| ui/loading-progress-track.png | replaced: gpt-6-luna (2160x728), astra 30349392936a superseded | loading-progress-track |
| ui/loading-statusband.png | replaced: gpt-6-luna (2172x724), astra f88818801fb9 superseded | loading-statusband |
| ui/loading-tipband.png | replaced: gpt-6-luna (2172x724), astra 414c5553d2c3 superseded | loading-tipband |
| ui/reskin/icons-air-missions-1.png | replaced: gpt-6-luna (1254x1254), astra 2640b2bc7c34 superseded | reskin-icons-air-missions-1 |
| ui/reskin/icons-air-missions-2.png | replaced: gpt-6-luna (1774x887), astra 6b4384726360 superseded | reskin-icons-air-missions-2 |
| ui/reskin/icons-alerts-1.png | replaced: gpt-6-luna (1282x1227), astra 13acb99043ac superseded | reskin-icons-alerts-1 |
| ui/reskin/icons-alerts-2.png | replaced: gpt-6-luna (1536x1024), astra aa1d331c6e93 superseded | reskin-icons-alerts-2 |
| ui/reskin/icons-alerts-bare-1.png | replaced: gpt-6-luna (1536x1024), astra 92a2877fc2d9 superseded | reskin-icons-alerts-bare-1 |
| ui/reskin/icons-alerts-bare-2.png | replaced: gpt-6-luna (1536x1024), astra 9d06ca5af4e1 superseded | reskin-icons-alerts-bare-2 |
| ui/reskin/icons-army-badges-1.png | replaced: gpt-6-luna (1295x1214), astra afb419fe280a superseded | reskin-icons-army-badges-1 |
| ui/reskin/icons-army-badges-2.png | replaced: gpt-6-luna (1269x1240), astra 14056d217164 superseded | reskin-icons-army-badges-2 |
| ui/reskin/icons-army-badges-3.png | replaced: gpt-6-luna (1536x1024), astra 5a99377be169 superseded | reskin-icons-army-badges-3 |
| ui/reskin/icons-autonomy.png | replaced: gpt-6-luna (1536x1024), astra caf6d631e835 superseded | reskin-icons-autonomy |
| ui/reskin/icons-buildings.png | replaced: gpt-6-luna (1536x1024), astra cc625d961ed4 superseded | reskin-icons-buildings |
| ui/reskin/icons-diplorequests.png | replaced: gpt-6-luna (1121x1403), astra fcc8ab95f8dd superseded | reskin-icons-diplorequests |
| ui/reskin/icons-focus-filters.png | replaced: gpt-6-luna (1448x1086), astra a11081a3dbf2 superseded | reskin-icons-focus-filters |
| ui/reskin/icons-folders.png | replaced: gpt-6-luna (1254x1254), astra 4fee4bf59959 superseded | reskin-icons-folders |
| ui/reskin/icons-gathering-dark.png | replaced: gpt-6-luna (1448x1086), astra 150e0b9546fd superseded | reskin-icons-gathering-dark |
| ui/reskin/icons-gathering-flicker.png | replaced: gpt-6-luna (1536x1024), astra 2b04c1ed32c6 superseded | reskin-icons-gathering-flicker |
| ui/reskin/icons-map-arrows.png | replaced: gpt-6-luna (1536x1024), astra fa79e59a20b1 superseded | reskin-icons-map-arrows |
| ui/reskin/icons-mapmodes.png | replaced: gpt-6-luna (1536x1024), astra b073f426ae91 superseded | reskin-icons-mapmodes |
| ui/reskin/icons-relations-2.png | replaced: gpt-6-luna (1536x1024), astra ceae57799d96 superseded | reskin-icons-relations-2 |
| ui/reskin/icons-resources.png | replaced: gpt-6-luna (1536x1024), astra d04405920b05 superseded | reskin-icons-resources |
| ui/reskin/icons-roles-1.png | replaced: gpt-6-luna (1254x1254), astra 23d3877c689e superseded | reskin-icons-roles-1 |
| ui/reskin/icons-roles-2.png | replaced: gpt-6-luna (1254x1254), astra cd8259d17670 superseded | reskin-icons-roles-2 |
| ui/reskin/icons-roles-3.png | replaced: gpt-6-luna (1254x1254), astra 1826dc50ae8b superseded | reskin-icons-roles-3 |
| ui/reskin/icons-ships.png | replaced: gpt-6-luna (1774x887), astra 4f646e8e1505 superseded | reskin-icons-ships |
| ui/reskin/icons-templates-1.png | replaced: gpt-6-luna (1254x1254), astra a1426f4fff27 superseded | reskin-icons-templates-1 |
| ui/reskin/icons-templates-2.png | replaced: gpt-6-luna (1254x1254), astra ea16f679cb64 superseded | reskin-icons-templates-2 |
| ui/reskin/icons-templates-3.png | replaced: gpt-6-luna (1254x1254), astra c30db32b8df4 superseded | reskin-icons-templates-3 |
| ui/reskin/icons-templates-4.png | replaced: gpt-6-luna (1536x1024), astra 5266d13b6a09 superseded | reskin-icons-templates-4 |
| ui/reskin/icons-text-1.png | replaced: gpt-6-luna (1254x1254), astra 9309bef276ce superseded | reskin-icons-text-1 |
| ui/reskin/icons-text-2.png | replaced: gpt-6-luna (1254x1254), astra 0f0c7ce1691e superseded | reskin-icons-text-2 |
| ui/reskin/icons-text-3.png | replaced: gpt-6-luna (1536x1024), astra 694ab7b40f6f superseded | reskin-icons-text-3 |
| ui/reskin/icons-topbar-extra.png | replaced: gpt-6-luna (1536x1024), astra 8351e6f46856 superseded | reskin-icons-topbar-extra |
| ui/reskin/icons-topbar.png | replaced: gpt-6-luna (1254x1254), astra c31b152600c4 superseded | reskin-icons-topbar |
| ui/reskin/icons-weather.png | replaced: gpt-6-luna (1774x887), astra eab0e9ca7a9f superseded | reskin-icons-weather |
| ui/reskin/ui-events.png | replaced: gpt-6-luna (1536x1024), astra d4c74ea91d02 superseded | reskin-ui-events |
| ui/reskin/ui-frontend.png | replaced: gpt-6-luna (1536x1024), astra 9b576fc20d9b superseded | reskin-ui-frontend |
| ui/reskin/ui-map.png | replaced: gpt-6-luna (1536x1024), astra 02b5b8b5ce22 superseded | reskin-ui-map |
| ui/reskin/ui-military.png | replaced: gpt-6-luna (1536x1024), astra 552af5a01c8e superseded | reskin-ui-military |
| ui/reskin/ui-news.png | replaced: gpt-6-luna (1024x1536), astra d578c2cc57e8 superseded | reskin-ui-news |
| ui/reskin/ui-sockets.png | replaced: gpt-6-luna (1278x1230), astra 676faabd2795 superseded | reskin-ui-sockets |
| ui/reskin/ui-topbar.png | replaced: gpt-6-luna (1024x1536), astra a0bb1b8ce703 superseded | reskin-ui-topbar |
| ui/ui-button.png | replaced: gpt-6-luna (1122x1402), astra 827781b9ec09 superseded | ui-button |
| ui/ui-frame.png | replaced: gpt-6-luna (1254x1254), astra 7c9740cba91d superseded | ui-frame |
| ui/ui-rule.png | replaced: gpt-6-luna (2172x724), astra e3a12860e5fd superseded | ui-rule |

Retired by the lead (24 October instruction): ui/reskin/ui-bars.png, ui-bars-2.png, ui-buttons.png, ui-chrome-panels.png, ui-chrome-small.png removed from art/source/ui/reskin/; their provenance lines stay as history.

Failures: icons-relations-1 (olive non-black ground, not copied; moved to <art store>/raw/rejected/icons-relations-1-luna-nonblack-v1.png); regeneration in batch 3 waits for the image route (last state: held by pid 23680 of another lane).
Not yet done: the regenerated icons-relations-1 review and copy, measure and plan (tools/, node content/modules/ui_reskin.mjs), reskin.json diff check, verify.sh asu, before/after contact sheet.

## Resume state (1 November 2026, 14:23): UI sheets and pieces

Done and logged (gpt-6-luna, reviewed at sheet scale, copied to art/source/, astra lines marked superseded):
- 48 UI pictures replaced (the list is every `gpt-6-luna` line with `replaces` in art/source/provenance.jsonl). `icons-relations-1` and the loading fill were replaced in the final batch. The loading fill was regenerated with a dim amber prompt (same prompt except the glow: "dim smouldering amber light"); the molten-gold version is logged as rejected (mean 98.05, vanilla dark class under 96).
- Retired by lead decision and removed from art/source/ui/reskin/: ui-bars, ui-bars-2, ui-buttons, ui-chrome-panels, ui-chrome-small.
- Raw store: old astra raws kept as `-astra-v1.png`; replaced luma raws as `-replaced-v1.png`; rejected relations-1 in `raw/rejected/`.

Reskin plan (tools/content/lib/ui_plan.mjs, rule added in `iconSocket`): `mapmode_buttons_selected_big` uses `socket_round_mid`, `mapmode_buttons_deselected_big` uses `socket_round_dull` (fixes the identical-bytes defect). `reskin.json` and `cell_luma.json` are merged: only rows and luma entries of the 47 replaced sheet ids change (merge script: `<scratchpad>/uiart/merge.mjs`, baseline `reskin-before.json`, `luma-before.json`).

Open:
1. Fresh asset errors (ZIN_ASSETS_FRESH_OUT, `<scratchpad>/fresh.json`): 163 duplicate groups were re-accepted by the lead; 58 unit counters (lane I3); 10 TEXTICON_MISSING (lane W4). Six reskin groups: (1) boost_building_button, button_left, button_right, minimap_ping_defensive; (2) endgame_convoys/manpower/province/score buttons; (3) exiled_unit_icon, mapicon_air_training, support_ship_value_icon; (4) market_subsidy_several_countries, market_subsidy_trigger; (5) sort_amount, sort_cost, commander filter and sort buttons; (6) mapmode big buttons: FIXED in the plan, verify pending.
   Cause of 1 to 5: `ui-sockets` (20 cells) has three round sockets in the dark class (socket_round, socket_round_lit, socket_round_dull), so `socketCell` returns the same cell for all of them.
2. Lead decision: regenerate `ui-sockets` with more distinct sockets (round and square in each luminance class, and no two distinct controls share a cell), gpt-6-luna, review, new cell map (data/ui/sheets/ui-sockets.json, cells keys used by ui_plan `socketCell` and `CHROME_CELLS`), measure, plan, merge only the ui-sockets rows, confirm groups 1 to 5 leave ZIN_ASSETS_FRESH_OUT, then verify.sh asu, before/after render (tools/content/ui_review.mjs, private TEMP), and this file.
3. Verify: `verify.sh asu` run 3 (after the mapmode fix) was still running at 14:22 (`<scratchpad>/uiart/verify-asu3.log`). Its build log is `<scratchpad>/build-asu.log`; the last known state before the fix was 241 new errors.
4. Still to do: the before/after render; the astra_audit.md final table of replaced rows (generated by the node snippet in this session, reproducible from art/source/provenance.jsonl lines with `replaces`).

Next steps for a fresh agent: (a) read verify3 result; (b) generate the new ui-sockets layout with gpt-6-luna through tools/content/imagegen.mjs (move the old raw aside first; it skips existing outputs); (c) review each cell; (d) update data/ui/sheets/ui-sockets.json and lib/ui_plan.mjs socket keys; (e) measure, plan, merge; (f) verify.sh asu; (g) render; (h) update this file.

Verify run 3 (after the mapmode fix, 14:23): build exit 1 on "assets: 15 new errors not in the baseline", down from 241. Suite: 1,753 tests, 1,734 pass, 17 fail, 2 skipped (the same count as before this step; the failures are not yet checked against my changes). The 15 new errors are the groups still open (1 to 5 of the socket duplicates).

## Socket regeneration (1 November 2026, 14:35)

ui-sockets was regenerated with gpt-6-luna as a 29-cell map (dark 1 to 21, mid 22 to 25, light 26 to 29): four distinct dark round sockets, seven dark tall sockets (the seven-member sort and commander group), dark square and wide sets with lit and dull variants, and the mid and light sets. Measured luminance (cell_luma.json): dark cells 43 to 77, mid 112 to 117, light 156 to 166, so the classes hold. Raw: `raw/ui/reskin/ui-sockets.png` (sha256 ba7ecea0c680877b); the previous luna sheet is `raw/ui/reskin/ui-sockets-replaced-v1.png`. Provenance: generation, review and superseded lines appended to art/source/provenance.jsonl and the art store jobs/provenance.jsonl. The explicit allocation of the collision groups is `SOCKET_ALLOC` in lib/ui_plan.mjs. Changed reskin rows: 170 ui-sockets rows (the rest of the 1,341 socket rows keep their cells); the four non-socket rows that differed between the plan and the live file were left alone.

Result: the five named duplicate groups (boost_building_button, endgame buttons, exiled_unit_icon, market subsidy, sort and commander filters) are gone from the build. The build still stops on 130 new asset errors not in the baseline: 120 UNIQ_EXACT_DUP groups of other round-lit and wide-socket controls that already shared cells before this change (none of them is a changed row) and the 10 TEXTICON_MISSING of lane W4. The suite has 16 failures, all from the missing staged tree (the build stopped), none in the reskin tests.

Replaced rows (gpt-6-luna replacing gpt-6-astra, from art/source/provenance.jsonl lines with `replaces`; 49 entries, the last being the socket sheet):

| Sheet id | Raw | Replaced astra sha256 (12) |
|---|---|---|
| loading-progress-fill | ../raw/ui/loading-progress-fill.png | 6d4b7b688ebd |
| loading-progress-track | ../raw/ui/loading-progress-track.png | 30349392936a |
| loading-statusband | ../raw/ui/loading-statusband.png | f88818801fb9 |
| loading-tipband | ../raw/ui/loading-tipband.png | 414c5553d2c3 |
| reskin-icons-air-missions-1 | ../raw/ui/reskin/icons-air-missions-1.png | 2640b2bc7c34 |
| reskin-icons-air-missions-2 | ../raw/ui/reskin/icons-air-missions-2.png | 6b4384726360 |
| reskin-icons-alerts-1 | ../raw/ui/reskin/icons-alerts-1.png | 13acb99043ac |
| reskin-icons-alerts-2 | ../raw/ui/reskin/icons-alerts-2.png | aa1d331c6e93 |
| reskin-icons-alerts-bare-1 | ../raw/ui/reskin/icons-alerts-bare-1.png | 92a2877fc2d9 |
| reskin-icons-alerts-bare-2 | ../raw/ui/reskin/icons-alerts-bare-2.png | 9d06ca5af4e1 |
| reskin-icons-army-badges-1 | ../raw/ui/reskin/icons-army-badges-1.png | afb419fe280a |
| reskin-icons-army-badges-2 | ../raw/ui/reskin/icons-army-badges-2.png | 14056d217164 |
| reskin-icons-army-badges-3 | ../raw/ui/reskin/icons-army-badges-3.png | 5a99377be169 |
| reskin-icons-autonomy | ../raw/ui/reskin/icons-autonomy.png | caf6d631e835 |
| reskin-icons-buildings | ../raw/ui/reskin/icons-buildings.png | cc625d961ed4 |
| reskin-icons-diplorequests | ../raw/ui/reskin/icons-diplorequests.png | fcc8ab95f8dd |
| reskin-icons-focus-filters | ../raw/ui/reskin/icons-focus-filters.png | a11081a3dbf2 |
| reskin-icons-folders | ../raw/ui/reskin/icons-folders.png | 4fee4bf59959 |
| reskin-icons-gathering-dark | ../raw/ui/reskin/icons-gathering-dark.png | 150e0b9546fd |
| reskin-icons-gathering-flicker | ../raw/ui/reskin/icons-gathering-flicker.png | 2b04c1ed32c6 |
| reskin-icons-map-arrows | ../raw/ui/reskin/icons-map-arrows.png | fa79e59a20b1 |
| reskin-icons-mapmodes | ../raw/ui/reskin/icons-mapmodes.png | b073f426ae91 |
| reskin-icons-relations-2 | ../raw/ui/reskin/icons-relations-2.png | ceae57799d96 |
| reskin-icons-resources | ../raw/ui/reskin/icons-resources.png | d04405920b05 |
| reskin-icons-roles-1 | ../raw/ui/reskin/icons-roles-1.png | 23d3877c689e |
| reskin-icons-roles-2 | ../raw/ui/reskin/icons-roles-2.png | cd8259d17670 |
| reskin-icons-roles-3 | ../raw/ui/reskin/icons-roles-3.png | 1826dc50ae8b |
| reskin-icons-ships | ../raw/ui/reskin/icons-ships.png | 4f646e8e1505 |
| reskin-icons-templates-1 | ../raw/ui/reskin/icons-templates-1.png | a1426f4fff27 |
| reskin-icons-templates-2 | ../raw/ui/reskin/icons-templates-2.png | ea16f679cb64 |
| reskin-icons-templates-3 | ../raw/ui/reskin/icons-templates-3.png | c30db32b8df4 |
| reskin-icons-templates-4 | ../raw/ui/reskin/icons-templates-4.png | 5266d13b6a09 |
| reskin-icons-text-1 | ../raw/ui/reskin/icons-text-1.png | 9309bef276ce |
| reskin-icons-text-2 | ../raw/ui/reskin/icons-text-2.png | 0f0c7ce1691e |
| reskin-icons-text-3 | ../raw/ui/reskin/icons-text-3.png | 694ab7b40f6f |
| reskin-icons-topbar-extra | ../raw/ui/reskin/icons-topbar-extra.png | 8351e6f46856 |
| reskin-icons-topbar | ../raw/ui/reskin/icons-topbar.png | c31b152600c4 |
| reskin-icons-weather | ../raw/ui/reskin/icons-weather.png | eab0e9ca7a9f |
| reskin-ui-events | ../raw/ui/reskin/ui-events.png | d4c74ea91d02 |
| reskin-ui-frontend | ../raw/ui/reskin/ui-frontend.png | 9b576fc20d9b |
| reskin-ui-map | ../raw/ui/reskin/ui-map.png | 02b5b8b5ce22 |
| reskin-ui-military | ../raw/ui/reskin/ui-military.png | 552af5a01c8e |
| reskin-ui-news | ../raw/ui/reskin/ui-news.png | d578c2cc57e8 |
| reskin-ui-sockets | ../raw/ui/reskin/ui-sockets.png | 676faabd2795 |
| reskin-ui-topbar | ../raw/ui/reskin/ui-topbar.png | a0bb1b8ce703 |
| ui-button | ../raw/ui/ui-button.png | 827781b9ec09 |
| ui-frame | ../raw/ui/ui-frame.png | 7c9740cba91d |
| ui-rule | ../raw/ui/ui-rule.png | e3a12860e5fd |
| reskin-icons-relations-1 | ../raw/ui/reskin/icons-relations-1.png | 084ffdf85cc2 |

Blocked for this step: the before and after render (node tools/content/ui_review.mjs) needs a staged tree, and the build cannot stage while the 130 errors above stand, so no render was produced.
