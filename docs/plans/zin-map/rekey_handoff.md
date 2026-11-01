# Map re-key handoff (new map from create_world, commit d9a0e9fc)

## What changed in kind

State ids renumber whenever the map is written, so the builder no longer treats a state id as a fact. The state table is keyed by geography features: a realm's capital point (tools/politics/data/create_world_call.json, equal to its roster `capital.siteId` times the 5,120 x 2,560 frame), a geography site (tools/content/data/geography/import/aoaz.geography.json, `sites[].at`), or a region. `tools/content/lib/map_features.mjs` resolves those features on the map in the mod (history/states, map/provinces.bmp, map/definition.csv, localisation/replace/world_l_english.yml). A feature point on water takes the nearest land state within `LAND_SEARCH_PIXELS` (96 pixels).

## Re-keyed or regenerated

- `tools/migrations/roster_state_assignment.mjs` rewritten. Owners come from the map (history/states, realm tags written by create_world). Each realm's capital is the state under its create_world point, or the nearest state it owns when the point is on water (Hunhun and Mora points are on lakes). Output: `tools/content/data/world/state_assignment.json` schema 2, 2,627 owned states, 29 unowned (no entry, listed under `unowned`), 155 capitals, 155 realms with land, `removed` restored with the wild-land holders.
- `tools/content/data/world/former_states.json` (new, frozen record). The retired old map's per-realm counts by former row; `lib/roster.mjs` uses it only to pick a merged realm's main former row. The old state files are gone, so this is a record, not regenerated.
- `tools/content/lib/roster.mjs`: the tie-break reads `former_states.json`.
- `tools/content/write_forces_geography.mjs`: unowned states are skipped (no garrison, no port). Regenerated `data/forces_geography.json`.
- `tools/content/write_journey_geography.mjs` run again: `data/mech_journey_geography.json` (mainland 452, isle 11, ports 62, shore 5, strategic regions 43).
- `tools/content/write_storm_seas.mjs` run: `data/storm_seas.json` (see below).
- Glo's hall: `data/mech_journey_glo.json` `hallState: 1063` replaced by `hallSite: "site_yeldenne"`, resolved through `siteState` in `modules/mech_yeldenne.mjs` and `modules/historical_path.mjs`. Now state 1652, Castle of Yeldenne.
- Literal ids found in the source and not re-keyed: none left. Other state references in the applied `common/` and `events/` (for example `state = 238`, `owns_state = 1063`, `state = 1034`, Crossing Host `delete_unit` lists) come from `capitalState` or `geo.shore` already, so they follow the new assignment on the next apply. The repo copies are stale until the build is applied.

## State-count guards (sweep)

The builder's guards on the old map were changed to the new map's counts. Each value was derived from the assignment, not typed to match a test:

- Dark Lands (`data/mech_regions_dark.json` `expectedStates` 47 to 83). The 17 Dark Lands realms own 83 states on the new map. Their capitals lie within x 0.47 to 0.54 and y 0.41 to 0.50, around Goldoroth (0.48, 0.45) and Cocanoor, so the realms are where the Dark Lands are drawn. The old number came from the old map.
- South-Earth (`data/mech_regions_east.json` `expectedStates` 337 to 607). The 20 realms hold 607 states on the new map.
- Cold Lands and Sunhot guard only `expectedCountries` (19 and 10), unchanged. Ember Lands and the deep states have no state-count guard in the builder; the Ember realms (9) hold 106 states.
- Tests updated to match: `mech_dark.test.mjs` (84 to 83 message, start value 47 to 83), `mech_east.test.mjs` (337 to 607; negative 300 to 600), `mech_journey.test.mjs` (isle 1 to 11; hall from `hallSite`).

## Storm belt (review)

The belt is the sea regions that touch an Ember Lands realm's coast. It was 2 seas (248, 252) and is now 12. The Ember realms (Puvulan, Mirolon, Khorvrath, Dolon, Nezer, Nether, Halia, Nan, Olen) hold 106 states, so the coast they touch is much longer. Contacts per sea (Ember coastal province to sea province): Sea of Nazerch 686 (1,040), Eastern Veleeda 663 (1,033), Northern Veshir 674 (942), Western Sea of Lava 689 (769), Western Veleeda 662 (362), Western The Reeto Sea 655 (345), Vehmial 669 (224), Western Zavrekir 677 (79), Southern Veshir 682 (65), Northern Zavrekir 672 (26), Northwestern Zavrekir 676 (25), Eastern Zavrekir 678 (19). The lore (Volgans Ember Lands: "fierce storms at sea"; Nan's men fled "across the storm belt") fits a belt around this coast. The four Zavrekir seas are thin edge contacts. Owner or lead to confirm whether they stay.

## Conflicts for the owner or lead (not fixed here)

1. Yeldenne. K56 makes the castle part of Pertolor's land and its hall owned by the keeper. On the map the castle state 1652 (Castle of Yeldenne, VP 847) is owned by Omar (OMR), and Pertolor (PRT) holds 11 states, none at Yeldenne. The hall rule ("its owner is the keeper") therefore does not hold. Fixing it needs a realm-seed change in `tools/politics/data/create_world_call.json` and a map write (the owner's map decision), or a design change.
2. Key-site triggers. `zin_is_site_*` are still inert stand-ins (`common/scripted_triggers/zz_zin_pending_triggers.txt`, `always = no`), generated from `data/pending_names.json`. `lib/map_features.mjs` `siteState` is ready for the key-sites table (lead item 3). Activating the triggers changes gameplay, so I did not.
3. Aenor Isle. The isle realm (Orohaf, capital at 0.516, 0.569) now owns 11 states; the old map gave it 1. I did not verify each of the 11 lies on the isle; the `isle` guard now expects 11.
4. Hunhun and Mora capital points are on lakes. Their seats resolve to the nearest owned land (Hunhun 1432, Mora 1338). Check the seats.
5. 29 unowned states (MCP `MAP_STATE_OWNER_MISSING` warnings) are intended; no builder feature refers to them.

## Validation

- MCP `hoi4.map_inspect` (runtime-v464, 4.6.4) on the 156 capital and Yeldenne states and 100 capital pixels: 156 states, 701 regions, 586 ports, 100 coordinate matches, all map validation checks passed, 18 owner warnings (the unowned states above).
- Affected test files pass: `roster.test.mjs` (11), `forces.test.mjs` (58), `world_magic.test.mjs`, `mech_dark.test.mjs` (32), `mech_east.test.mjs` (51), `mech_journey.test.mjs` (51).
- Full suite (verify rk3): 1,773 tests, 1,744 pass, 27 fail, and the build aborts. The abort is the text sweep (13 rows: `INDUSTRIAL_ORG_QUEUE_WINDOW_INSTRUCTION` colours lost, `TRADE_CIV_FACTORIES_USED` key not installed), in localisation and presentation files modified by other lanes, not map data. Downstream staged tests (build determinism, vanilla, flags, localisation) fail because the stage is incomplete. The map-related failures are fixed; the rest belong to those lanes.
- Migration dry run: 2 changes, not 0. The first (a `Y01` comment in `tools/content/modules/countries.mjs`) is fixed. The second is `tools/content/data/idea_art_cells.json`, an art-lane file (untracked), which the migration would rename for `isengard_warlords` to `melkgard_warlords` and `gunwaith_clans` to `gunwyn_clans`. I did not edit it. The art lane should run the migration after its work.

## Not touched

`map/`, `history/states/`, `.hoi4-agent-world.json`, art lanes' files (`focus_art`, `idea_art`, `event_art`, `art/source`, provenance logs), `common/` and `events/` outputs (regenerate by build and apply).

## Seed inputs for the next map write (tools/politics/realm_seeds.mjs)

- Yeldenne (K56). Pertolor (PRT) gets a seed at the Castle of Yeldenne, (962, 238), in the high valley between the Yeldenne Heights and the Isengar Mountains. The valley is not a model feature that a claim can name (only its ranges and the Ormolak pass are), so a seed is the mechanism. Omar keeps its seat (1653, the drawn label Omar at (1000, 272)) and its Northern Cold Lands and foothill states; the castle seed is about 40 px from that seat, above the validator's 20 px separation. The map write must confirm the castle state goes to Pertolor and Omar keeps its seat state. This is the one result I could not check without the preview.
- Hunhun (HNH) and Mora (MOA). The seats move off the lake shores: Hunhun to (3193, 1585), 31 px from the water (was 9 px), and Mora to (4745, 1631), 31 px from the water (was 8 px). Both are CAPITAL_ANCHORS entries with `overridesSite: true` and a basis comment.
- Aenor Isle (Orohaf, ORH). The isle realm already holds the whole isle: every land pixel of the Aenor Isle polygon (3,682 px) belongs to ORH. Its eleven states are all on the isle except state 1291, whose province lies on no model land. The count of 11 is state granularity on the new map, not a leak. No seed change proposed; the roster's "2 states" is the old map's count.
- Validation: `realm_seeds.mjs` 155 realms, 12 seeds, 6 realms with claims, 10 unowned polygons; 0 errors, 0 warnings. `--check` and `--schema` valid. Written: `tools/politics/data/realm_seeds.json`, `realm_seeds_report.json`, `create_world_call.json`.
- Open question Q-50 (Yeldenne's roster seat Simoto, on water) is unchanged in the roster.
- `tools/content/data/idea_art_cells.json` is lane I5's file and is not touched.
