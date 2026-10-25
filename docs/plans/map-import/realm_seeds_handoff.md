# Handoff: realm seeds for the drawn-map import (politics input, ZR-8)

Status: implemented, validated offline on the land of commit `95324a05` (the import reads the model's land outside a 6-px coast band), and in the shape of the tool's published schema (`schemas/map-operation.schema.json` on the tool's `origin/main`, PR 44, release 4.5.0). The ready call is `tools/politics/data/create_world_call.json` (a preview); the lead runs the preview and then the write once 4.5.0 is installed. Every placement of a realm without a capital site is a proposal; the owner questions are Q-50 to Q-62 below.

## Released schema (4.5.0) and natural borders (25 October 2026)

- **Shape.** Points are `{ "x": <px>, "y": <px> }` objects of integer world pixels, top-left origin: capitals, seeds and every polygon vertex. The `countries` object holds only `source`, `realms`, `unowned` and `islands`; `connectedMainland` is gone (the schema is strict); a realm holds only `tag`, `capital`, `seeds`, `claim`, `exclude` and `weight`. The schema has **no `overlord`** either (ADR 0069 leaves subjects grown inside an overlord out), so the 19 subject relations are dropped from the output and kept in the report (`subjects`, checked for unknown overlords and cycles); the mod's build owns them. The intended connected-mainland rule is kept in the report (`options.connectedMainlandNotSent`): check the preview for realms split across their landmass.
- **Limits** (checked by the build and the validator): at most 256 seeds, 64 claim polygons and 64 exclusion polygons per realm, 256 unowned polygons, 10,000 points per polygon, 512 realms. The output's largest: 9 seeds in all, 6 claim polygons per realm at most, 4 exclusion polygons per realm at most, 10 unowned polygons.
- **Schema check.** `node tools/politics/realm_seeds.mjs --schema` validates the call file's operation against the schema read from the tool's `origin/main` (`git show`, read-only) with the tool's own Ajv (the installed release's `runtime-v440`, as `validate_import.mjs` does): valid. The test file checks it too, and that the schema refuses the old shape.
- **The call file.** `create_world_call.json` is `preview_call.json` (same tool, workspace `zin` and operation) with `countries` added and `preview: true`; `--write` regenerates it with the seeds. For the write, the lead sets `preview` to false.
- **Natural borders.** Until the tool grows ownership along rivers and ranges, the land claims leave free grows in weight-balanced blobs. The generator therefore turns the natural borders the canon names between two realms (the repaired model's `naturalBorders` per region, after the geography spec section 6, and the dossiers) into exclusions: along each named line, a band 96 px wide on each realm's side, which the other realm may not enter, kept 8 px clear of the realm's own claims. A border applies only where its line lies between the two seats on this map (the straight line from capital to capital crosses it), and only the crossed lines are used. Applied (7): Coldor and Melkgard (the Ormolak Mountains), Gunwyn and Girdon (the Grey River), Girdon and Buldor (the Fog and Eye ridge), Aenor and Kingson (the Gigantic Mountains), Aenor and Herez (the Grey Hills), the Magical Forest and the Mushroom Forest (the Elwen River), Noris and Naamis (the Fosoco River). Not applied because the model's line does not lie between the seats: Coldor and Horidor (Naepu), Girdon and Saopon (Kulolo), Aenor and Selen (Selenar: the model's river runs north of Selen's seat), Aenor and Hirolon (Grano and Hilorn; Hirolon's ring claim holds that line anyway), Aenor and the Bloody Forest (northern Crown Mountains), Aenor and the Cursed Lands (Grey Hills), Herrodon and Andos Enda (Andos Water), Goldoroth and Bordon (Goldoroth Mountains), Noris and Stabilo (Noris Rise), Stabilo and Drak (Drak Mountains). Not lines of the model: the Lake of Mirolon, the Loron highland (one realm), the Darkness ridge (two lands), the Sun and Sukro Mountains (realms unnamed). The report lists each with its basis (`naturalBorders`, `naturalBordersNotApplied`).

## Re-fit on the land of 95324a05 (25 October 2026)

After the annotations began to force the model's land and sea, the first build failed validation (`REALM_CLAIM_UNOWNED`: Zol's claim inside the unowned area) and two tests failed (Yeldenne's capital no longer on land; the rebuild no longer matched the committed file). What changed:

- **Zol's claim and the Herrodon crest.** The repaired model's `zols_mistake` zone, which Zol's Mistake claims whole, now covers a strip of land at the Magical Lands' northern tip (about x 3555 to 3645, y 868 to 892), where the Herrodon crest wild land also reached. Canon first: the roster gives Zol's Mistake "the Magical Lands sheet's former Edvoid's Mistake coast" by name, while the crest's wildness is a dossier proposal (magical_lands.md 11). The claim wins: every wild land is now cut back where it meets any realm's claim and keeps `WILD.claimClearancePx` (8 px) from it. The crest lost 368 px²; the Kherith Isles lost 192 px² along the Nether's claim. Whether that tip is Zol's is folded into Q-58.
- **Capitals.** Every capital and seed was re-placed on the new land. Yeldenne's site now stands 63 px from the nearest land (was 28 px), at (1304, 171) (Q-50). Halia moves off the lowland east of Mirolon, which the model makes part of the eastern mainland, onto the arm of the Mirolon peninsula east of Miherta's tongue, at (3540, 1925) (Q-55). Halenor moves to the isle by the Kilos Sound (`land_island_059`), since the old-map projection now lands on Raerby's island (Q-62). Sites the geography itself moved in that commit (Dondor 25 px north, Kradlon, Adel, Elvana and Herez by a few pixels) follow it exactly; the area poles of the Dark Forests, the Troll Forest, the Yeti Lands, Ghaahu and Dunelaeth shift with the new coasts; every other seat stays where it was.
- **Landmasses.** Seeds are now grouped by the 4-connected land the import reads, with no seam joining (the earlier 2-px joining is gone: it had closed straits of 4 px). The West and Cold Lands are one land, the rift coast belongs to the Central Mainland, and the Ember Lands island, the Nether and the East and South Lands are separate.
- **Seeds (9, was 7).** The Bloody Forest, Goldoroth, Orato, Lerendor's North, Exhoros, Unlo and the Great Swamp stay; Zol's Mistake gains `land_island_015` and Veshazel `land_island_047` (old-map isles now read as land). Old states projected farther than 320 px from the seat (was 450) add no seed, which drops a stray Kea seed in the Sun isles; and no seed goes on a wild island, which drops the Nether's old Death Islands state on the Kherith Isles (canon: the Kherith Isles are not a country).
- **Barriers.** `cold_neck` now matters (the neck is land); its lines stay. `zilin_marches` keeps only the Ember Lands' realms out of the Middle and Magical Lands (the East and South Lands are no longer on that landmass) and keeps the Middle and Magical realms out of Mirolon's tongue and arm. `ember_isles` is removed (the Ember Lands island and the Nether are separate lands); its remaining use becomes `olen_lowland`, which keeps Olen, the one Ember realm on the eastern mainland, out of the Sun Desert and the East Lands beyond its lowland. `great_wall` and `hardtmuth` are unchanged.

## What exists

| Path | What |
| --- | --- |
| `tools/politics/realm_seeds.mjs` | The deterministic generator: canon tables (capital anchors, seeds, claims, barriers, wild lands, owner questions, import observations), the build, the report and the command line. |
| `tools/politics/countries_validator.mjs` | Validator of the workspace form of `create_world.countries` in the schema's shape, with the ADR 0069 rules the schema cannot express, and of the subject relations. |
| `tools/politics/world_inputs.mjs` | Read-only inputs: roster, import geography, repaired model zones, old state assignment and centres, the drawing as the import reads it. |
| `tools/politics/geometry.mjs` | Point, polygon and raster helpers (world pixels, top-left origin). |
| `tools/politics/realm_seeds.test.mjs` | `node:test` file (registered in `tools/package.json`): validator rules on synthetic cases and the real output. |
| `tools/politics/data/realm_seeds.json` | The output: `{ schema, note, countries }`, one realm per line, numbers and ids only. |
| `tools/politics/data/realm_seeds_report.json` | Per realm: inputs used, method, anchor and snap distance, canon basis, seeds, claims, exclusions (barriers and natural borders), weight basis, overlord, conflicts and proposals; plus the barriers, natural borders, wild lands (with what claims cut from them), subject relations, summary, owner questions, import observations and the validation result. |
| `tools/politics/data/create_world_call.json` | The ready call: `preview_call.json` with `countries` (a preview). |

Commands (from the mod root): `node tools/politics/realm_seeds.mjs` builds, validates and prints a summary; `--write` writes the three data files (refuses when validation fails); `--check` validates the committed `realm_seeds.json` against the land and the rules; `--schema` validates the call file against the tool's published schema; `node --test tools/politics/*.test.mjs` runs the tests (17 pass, about 20 s).

The build reads the private drawing (`docs/reference/originals/Erdae.png`) in memory only, through `tools/content/geography/import_measures.mjs`, with the current annotations; nothing derived from its pixels is written except point coordinates. Without the drawing, `--no-drawing` builds on the model's land, and the two tests that need the drawing (land check and byte-for-byte rebuild) skip with a reason. **Any change to the annotations, sheets or geography changes the land, so rerun `--write` after the geography pipeline** (the rebuild test fails until then, as it did here).

## The schema and the validator

The output is checked twice. The tool's published schema (origin/main, read-only, the tool's Ajv; `--schema`) checks the shape and limits. `countries_validator.mjs` mirrors that shape (strict objects, `{ x, y }` integer points, tags `^[A-Z][A-Z0-9]{2}$`, the limits above, weights 0.05 to 100, `islands` values) and adds the ADR's rules the schema cannot express: every capital and seed on land (`MAP_WORLD_REALM_POINT_WATER`); no point inside another realm's claim, its own exclusion or the unowned area; no two realms' claims overlapping; tags known (`MAP_WORLD_REALM_TAG_UNKNOWN`); points in the frame. It also refuses a claim overlapping its own exclusion or the unowned area, and warns when two realms' points are closer than 12 px. `validateSubjects` checks the roster's subject relations (known overlord, not self, no cycle) for the report. The other codes are its own (`REALM_*`, `COUNTRIES_FORM_INVALID`).

## The `countries` block to pass

The whole call is ready: `tools/politics/data/create_world_call.json` (`{ "tool": "hoi4_map_rewrite", "arguments": { "workspaceId": "zin", "preview": true, "operations": [ ... ] } }`), the operation of the verified preview (`tools/content/data/geography/import/preview_call.json`: `create_world`, 5,120 x 2,560, `edge.mode` sea-band, the illustrated reference with its sheets and annotations, `geographyPath`) with `countries` added. Run it as a preview first; for the write, set `preview` to false. After any geography or seed change, rerun `node tools/politics/realm_seeds.mjs --write` so the call carries the current annotations and seeds.

The `countries` object (abridged; `realm_seeds.json` holds all 156 realms):

```json
{
  "source": "workspace",
  "realms": [
    { "tag": "AEN", "capital": { "x": 3061, "y": 1464 }, "exclude": [[{ "x": 3459, "y": 1057 }, "..."], [{ "x": 3150, "y": 1960 }, "..."], [{ "x": 3318, "y": 1280 }, "..."], [{ "x": 3130, "y": 1748 }, "..."]], "weight": 5.5 },
    { "tag": "LER", "capital": { "x": 2975, "y": 1023 }, "seeds": [{ "x": 2758, "y": 782 }], "weight": 2 },
    { "tag": "KIN", "capital": { "x": 3348, "y": 1497 }, "claim": [[{ "x": 3278, "y": 1312 }, "..."]], "exclude": ["..."], "weight": 0.75 },
    "..."
  ],
  "unowned": [[{ "x": 4674, "y": 2348 }, "..."], "..."],
  "islands": "one-owner"
}
```

For the override file of ADR 0067 step 3 (once its schema exists), each realm becomes one `countries` entry of the same schema with an `id`; use the roster key (`aenor`, `lerendor`, ...) as the id, and do not also pass the inline `realms`.

Before the write, the roster's tags must be declared by `common/country_tags/01_zin_realms.txt`, which the mod's build writes (`tools/content/modules/countries.mjs`); until then the tool refuses every realm. The old world's `00_zin_countries.txt` (305 Y tags) is a managed output the write retires.

## How each field was made

**Capitals.** 63 realms have a capital site in the import geography and keep its exact point, except three the import's land puts on water or within 3 px of a coast, moved to the nearest land: Yeldenne (63 px), Hunhun (4 px) and Mora (3 px). The other 93 realms have no site. Their seats come from `CAPITAL_ANCHORS`: 44 at a drawn label read off the owner's drawing in the world frame, 16 at a model feature (pass, river end, range point, lake shore, strait end), 12 at the pole of a model area the roster names as the realm's land, 11 on a named model island, 5 at a point chosen from the dossier's description, and 5 at the old map's capital moved into the new frame (old state centres, y flipped, displaced by a field fitted on the sited capitals per roster region). Every point snaps to the nearest pixel at least 3 px inside the import's coast, 253 px from the east and west frame edges and 88 px from the north and south ones, outside every other realm's claim, the unowned area and its own exclusions, and at least 20 px from any other realm's point. One seat moved more than 60 px (Xison, 64 px: the drawn Akahew label lies on water). Two canon sites stand 18 px apart (Bordon and Dreson) and are kept.

**Seeds (9).** Lerendor's North (decision K49) in the drawn snow country; Exhoros and Unlo for Puvulan; the Great Swamp for Mirolon; and old-map islands on separate model lands of at least 400 px within 320 px of the realm's seat, never on a wild island: Goldoroth (an isle of the Sea of Darkness), the Bloody Forest (the isle off the Organ cape), Orato (the Fladev isle), Zol's Mistake (`land_island_015`) and Veshazel (`land_island_047`). Old states that project onto another realm's landmass, the realm's own model land, a tiny islet, a wild island or a place far from the seat add no seed; each case is in the report's conflicts.

**Claims (6).** Zol's Mistake: the black north and the black isles of the Kusmeel (the repaired model's zone, on land). The Nether: `land_nether_island`. Vindael: `land_island_001`. Orohaf: `land_aenor_isle`. Kingson: the model's Kingson Vale plain (Q-57). Hirolon: bands along the Hiloff Rim from Hirolon Head to the Hilorn mouth and along the Grano (Q-56). No claims overlap; no other realm's point lies in one.

**Exclusions (5 barriers and 7 natural borders).** The natural borders are the one-sided bands along the Ormolak Mountains, the Grey River, the Fog and Eye ridge, the Gigantic Mountains, the Grey Hills, the Elwen River and the Fosoco River (see "Released schema and natural borders" above). Each barrier keeps the realms of one region out of the canon land of a neighbouring region on the same landmass and leaves a strip between the two sides to natural growth:

- `great_wall`: Middle Lands realms stay west of the eastern foothill edge of the repaired model's `zone_great_wall`, Magical Lands realms east of its western edge (K2; middle_lands.md 2.9);
- `zilin_marches`: Middle and Magical realms stay out of Mirolon's tongue and the arm east of it; Ember realms stay out of the Middle and Magical Lands north of the Zilin marches (ember_lands.md 2);
- `cold_neck`: Cold and West Lands realms each stay on their side of the neck, which is land (west_lands.md 2);
- `olen_lowland`: Ember realms (Olen) stay out of the Sun Desert and the East Lands beyond Olen's lowland;
- `hardtmuth`: East realms stay out of the Sun Desert west of the Hardtmuth chain; South realms stay out of the East Lands north of the desert and east of the Ergo country (south_lands.md 2).

**Unowned (10 polygons, all proposed in their dossiers).** Mount Ergo, Mount Argul and the Reeto caves (circles of 34 px round the model's volcanoes), the high Melty glaciers (the crest south of Ostoroth's seat), the Kherith Isles (`land_island_054`, grown 8 px to cover its coast), the Abyss (the model's chasm shrunk 8 px so Nezer's seat stays outside), the Lustras Hills, the Herrodon crest, the heart of the Fallen Forest and the high snows of the Magic Mountains; each is cut back 8 px from any claim. Not placed, with reasons in the report: the Lost Lands, Dragon Mountain's summit, the dune sea and the deep southern sand, the Plutondo Dunes, the Cursed Square, the Dark Lands' Death Islands, and the Middle Lands' high snows and Darkhere.

**Weights.** `weight = clamp(targetStates / 4, 0.05, 100)`, two decimals. `targetStates` is the roster's stated extent where it gives a state count (47 realms), else the realm's state count on the old map (109 realms); population is only the fallback when neither exists (no realm).

**Subjects (19, report only).** 12 chartered dominions of Aenor, Dark Gate under Goldoroth, Khorvrath, Dolon and Nezer sworn to Puvulan, Teste under Herrodon, Tirlan under Hirolon. No cycles. Not sent: the schema has no `overlord`, so subjects grow as realms of their own with their own weights (Tirlan inside Hirolon's ring is still held by Hirolon's crest claim).

**`islands: "one-owner"`** (every drawn island belongs to one realm or is a named wild place; the approved layout gives each small island one owner). **No `connectedMainland`** (not in the schema); the intended rule, every mainland realm one connected piece, is in the report; whether the tool joins Lerendor's two parts by a corridor (Q-51) is to be seen in the preview.

## Canon and proposal

Derived from canon: the 63 capital sites, the 19 subject relations (report only), the natural borders the model and the dossiers name, the Nether, Vindael, Orohaf and Zol claims (Zol's including the roster's Edvoid's Mistake coast), the Great Wall as the Middle and Magical Lands' border (K2), Lerendor's North (K49), Hirolon and Tirlan (K35), the stated extents behind the weights, and the list of wild lands (named in the dossiers, themselves marked proposed). Proposed here: all 93 siteless seats, every seed, the Kingson and Hirolon claims' shapes, every barrier's line, every wild land's shape and size, the rule that a claim wins over a wild land, the natural borders' band width (96 px) and the rule that a border applies only where its line lies between the seats, and the weight formula.

## Owner questions (queued by the lead as Q-50 to Q-62; changes from the re-fit marked)

- **Q-50 (Yeldenne), changed figure.** Simoto (the landing on the Gulf of Minnolomak) lies about 400 px from the Castle of Yeldenne and the valley of Mp'E; the site now stands 63 px from the nearest land (was 28 px), and the seat is that land. Move the landing below the castle, or the seat to the valley?
- **Q-51 (Lerendor).** Lerendor's North joins Sonargur by a corridor through Tolvael, the Heodwa Lands, Hrakbrund or Mustnom; or a separate realm under the same crown? Unchanged, but note: the schema has no `connectedMainland`, so whether the tool makes that corridor at all is to be seen in the preview.
- **Q-52 (Lerendor).** Where are the Low-ness Islands and Ferlinon's pine hills? Unchanged.
- **Q-53 (Pornivior).** Beside Mount Argul (the drawing) or below Mount Ergo (the roster)? Unchanged.
- **Q-54 (Ihuy, Soyano).** Hol's island goes to Ihuy, Soyano's seat to the northernmost Sun isle. Unchanged.
- **Q-55 (Olen, Halia), changed.** The model makes the lowland east of Mirolon (where the drawing writes Olen's Gelbus and Luminor) part of the eastern mainland, so Olen stands alone on the East and South Lands' landmass, kept out of the desert and the East Lands by `olen_lowland`. Halia no longer stands there: it is on the arm of the Mirolon peninsula east of Miherta's tongue, on the central mainland with Mirolon. The question is now Olen only: keep it on that lowland, or move it to an isle off Mirolon's south coast?
- **Q-56 (Hirolon).** Accept the ring's crests as Hirolon's fixed land? Unchanged.
- **Q-57 (Kingson).** Whole vale or valley floor? Unchanged.
- **Q-58 (wild lands), extended.** Ten wild lands are unowned (if the game accepts ownerless states). New: where a wild land meets a claim, the claim wins; Zol's Mistake's claim, through the model's zone, reaches the Magical Lands' northern tip (about x 3555 to 3645, y 868 to 892), which cuts the eastern end of the Herrodon crest. Is that tip the roster's Edvoid's Mistake coast, i.e. Zol's?
- **Q-59 (sizes).** Unchanged.
- **Q-60 (wild lands not placed).** Unchanged.
- **Q-61 (Eldafaen).** Unchanged.
- **Q-62 (Triton realms), changed placement.** Halenor now stands on the isle by the Kilos Sound (`land_island_059`) instead of the old map's island; the rest unchanged. Note that the model's island of Pollos and Benan reads as two pieces (Pollos and Benan on the northern, Nondondor on the southern); each piece holds a seat.

## Import observations (for the map lead, measured on the land of 95324a05)

- Every landmass the realms stand on matches the model's lands, as section 11 of `convert_handoff.md` reports.
- `land_island_009` reads as two pieces (the drawn passage between Pollos and Benan); no realm is cut off.
- Mirolon's eastern lowland, where the drawing writes Olen, is part of the eastern mainland in the model and the import, not of the Mirolon peninsula (Q-55).
- Three capital sites stand on water or within 3 px of the coast: Yeldenne's landing (63 px from land), Hunhun (4 px), Mora (3 px). The model's site positions may want the same correction.
- The roster's tags are not yet declared in the workspace (see above).

## Limits

- The import's own working copy of the drawing and its ragged edge clearing are not reproduced exactly; points keep 3 px from the coast and generated points keep clear of the ragged band, but the tool's land test is the authority. Sites near the east edge (Drak, Stabilo, Ostoroth) are in the band where the clearing is ragged; the 25 October preview found every site on its surface.
- The barriers are drawn in world pixels against the current registration; a change that moves a coast by more than a few dozen pixels needs a rebuild and a look at the barrier lines.
- Growth itself (`growTerritory` inside `create_world`) is not run here; the realm sizes, borders and corridors it produces are the tool's to report and need review after the first preview with this block.
- No MCP map route was used: this is offline input generation; the `create_world` preview with this block is the MCP step.

## Per realm

Capital in world pixels; "From" is the site, or the anchor method and its source (with the snap distance where it exceeds 10 px); weight with its target states and basis. Full detail, conflicts and the canon basis of every proposed seat are in `realm_seeds_report.json`.

| Tag | Realm | Region | Capital (x, y) | From | Seeds | Claim | Weight (target, basis) | Overlord |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| AEN | Aenor | Middle | (3061, 1464) | site_parim |  |  | 5.5 (22, extent) |  |
| LER | Lerendor | North | (2975, 1023) | site_sonargur | (2758, 782) |  | 2 (8, old map) |  |
| CLD | Coldor | Cold | (793, 355) | site_fandanar |  |  | 11 (44, old map) |  |
| NRS | Noris | East | (4285, 1960) | site_noris |  |  | 9.75 (39, old map) |  |
| STA | Stabilo | East | (4849, 2040) | site_postondoroth |  |  | 9.5 (38, old map) |  |
| GOL | Goldoroth | Dark | (2467, 1182) | site_cocanoor | (2570, 1194) |  | 1.5 (6, old map) |  |
| DND | Dondor | Dark | (2544, 1054) | site_notbuton |  |  | 0.25 (1, old map) |  |
| PUV | Puvulan | Ember | (3041, 2189) | site_nafeher | (3150, 2118) (2954, 2302) |  | 1.75 (7, old map) |  |
| ZOL | Zol's Mistake | Zol | (3921, 430) | site_furviatlon | (3702, 636) | zone zols_mistake | 26 (104, old map) |  |
| MIR | Mirolon | Ember | (3397, 1961) | site_mirolon | (3382, 1870) |  | 1.5 (6, old map) |  |
| WOR | Worshipdom | Magical | (3530, 1807) | site_worshipdom_valleys |  |  | 0.75 (3, old map) |  |
| MAG | Magical Forest | Magical | (3660, 1484) | site_magical_forest |  |  | 2 (8, extent) |  |
| GAA | Gala | Sun | (754, 2319) | site_gala |  |  | 0.5 (2, extent) |  |
| GNW | Gunwyn | West | (926, 1044) | site_gunwaith |  |  | 3 (12, old map) |  |
| SEL | Selen | Middle | (3010, 1233) | site_selen |  |  | 2.25 (9, extent) | AEN |
| KIN | Kingson | Middle | (3348, 1497) | site_kingson |  | area plain_kingson_vale | 0.75 (3, extent) | AEN |
| HIR | Hirolon | Middle | (2867, 1556) | site_hiloron |  | band along range_hiloff_rim; band along range_grano | 0.75 (3, extent) |  |
| MLK | Melkgard | Cold | (1111, 184) | site_isengard |  |  | 3 (12, old map) |  |
| HOR | Horidor | Cold | (1397, 552) | site_horidor |  |  | 5.5 (22, old map) |  |
| YEL | Yeldenne | Cold | (1304, 171) | site_yeldenne_landing (moved 63 px) |  |  | 0.25 (1, extent) |  |
| GIR | Girdon | West | (977, 1164) | site_girdon |  |  | 1.5 (6, old map) |  |
| KON | Konori | Middle | (3189, 1241) | site_konori |  |  | 1.25 (5, extent) | AEN |
| HNH | Hunhun | Middle | (3141, 1588) | site_hunhun (moved 3.6 px) |  |  | 1.25 (5, extent) | AEN |
| KLU | Klungori Guard | Middle | (3307, 1762) | feature pass_south_gate |  |  | 0.5 (2, extent) | AEN |
| HER | Herez | Middle | (3280, 1807) | site_herez |  |  | 1.5 (6, extent) | AEN |
| NOL | Noleksun | Middle | (3247, 1757) | old capital |  |  | 2 (8, extent) | AEN |
| KIL | Kilinti | Middle | (3112, 1402) | site_kilinti |  |  | 1 (4, extent) | AEN |
| SFT | Safeton | Middle | (3126, 1752) | site_safeton |  |  | 0.75 (3, extent) | AEN |
| FRE | Freshon | Middle | (3155, 1730) | old capital |  |  | 1 (4, extent) | AEN |
| PAZ | Pazoma | Middle | (3172, 1652) | dossier text |  |  | 1 (4, extent) | AEN |
| ORH | Orohaf | Middle | (2631, 1456) | site_asgard |  | land land_aenor_isle | 0.5 (2, extent) | AEN |
| FOT | Fotan | Middle | (3065, 1122) | feature strait_narrow |  |  | 0.5 (2, extent) |  |
| KUN | Kunhrim | Middle | (3389, 1323) | site_great_wall_lunhrim_fort |  |  | 0.5 (2, extent) | AEN |
| BRR | Burrikkrit | Middle | (3379, 1651) | feature range_cursed_mountains |  |  | 0.5 (2, extent) |  |
| OLO | Olodor | Middle | (2988, 1399) | feature range_deodolor |  |  | 0.25 (1, extent) |  |
| DNL | Dunelaeth | Middle | (3306, 1294) | area forest_kingdom |  |  | 0.25 (1, extent) |  |
| ANR | Aenor Forest | Middle | (3058, 1158) | area forest_crown |  |  | 0.75 (3, extent) |  |
| CUR | Cursed Lands | Middle | (3292, 1776) | area waste_cursed_lands |  |  | 0.25 (1, extent) |  |
| BLO | Bloody Forest | Middle | (3234, 1134) | area forest_bloody | (3275, 1004) |  | 0.75 (3, extent) |  |
| EEK | Eekedor | North | (3107, 924) | site_eekedor |  |  | 1.5 (6, old map) |  |
| REN | R'en | North | (3133, 1052) | site_ren |  |  | 0.75 (3, old map) |  |
| MOO | Molot | North | (3040, 752) | drawn label |  |  | 1 (4, old map) |  |
| KER | Keredor-Hellekton | North | (3068, 818) | drawn label |  |  | 1 (4, old map) |  |
| TLV | Tolvael | North | (2845, 860) | drawn label |  |  | 2.75 (11, old map) |  |
| TOL | Tolhon | North | (2770, 945) | drawn label |  |  | 0.75 (3, old map) |  |
| HEO | Heodwa Lands | North | (2935, 866) | drawn label |  |  | 1.25 (5, old map) |  |
| HRA | Hrakbrund | North | (2895, 908) | drawn label |  |  | 0.5 (2, old map) |  |
| MIA | Mina | North | (3150, 880) | drawn label |  |  | 1.75 (7, old map) |  |
| DOL | Dolpar | North | (2973, 908) | feature lake_evian (moved 14.2 px) |  |  | 1.5 (6, old map) |  |
| MUS | Mustnom | North | (2893, 990) | drawn label |  |  | 0.25 (1, old map) |  |
| FEA | Fearno | Cold | (1610, 458) | drawn label |  |  | 8.25 (33, old map) |  |
| AUT | Austklev | Cold | (1642, 681) | drawn label (moved 43.1 px) |  |  | 2 (8, old map) |  |
| WRL | Worlond | Cold | (1106, 778) | area forest_worlond |  |  | 5.25 (21, old map) |  |
| PLT | Poloto | Cold | (1392, 740) | feature river_fandan (moved 12 px) |  |  | 2 (8, old map) |  |
| HLD | Holdon | Cold | (700, 684) | drawn label |  |  | 1.25 (5, old map) |  |
| GLI | Glimkit | Cold | (564, 677) | feature range_coldor_mountains |  |  | 1 (4, old map) |  |
| XIS | Xison | Cold | (345, 594) | drawn label (moved 64.4 px) |  |  | 4.25 (17, old map) |  |
| PRT | Pertolor | Cold | (1150, 440) | drawn label |  |  | 4.25 (17, old map) |  |
| OMR | Omar | Cold | (1000, 272) | drawn label |  |  | 3.25 (13, old map) |  |
| POT | Portogalor | Cold | (740, 195) | drawn label |  |  | 2.25 (9, old map) |  |
| KVI | Kvittumm | Cold | (272, 300) | drawn label |  |  | 4.75 (19, old map) |  |
| ORW | Orewele | Cold | (330, 278) | drawn label |  |  | 2.5 (10, old map) |  |
| NIV | Nivaros | Cold | (400, 178) | drawn label |  |  | 2 (8, old map) |  |
| YEI | Yeti Lands | Cold | (818, 822) | area hills_yeti_lands |  |  | 3.5 (14, old map) |  |
| GHH | Ghaahu | Cold | (1458, 354) | area ice_north_yeti_lands |  |  | 2 (8, old map) |  |
| VND | Vindael | Cold | (254, 1029) | land land_island_001 |  | land land_island_001 | 3 (12, old map) |  |
| WER | Werlendor | West | (666, 1129) | feature range_erg |  |  | 1.75 (7, old map) |  |
| LAB | Lambin | West | (1070, 1175) | drawn label |  |  | 2.25 (9, old map) |  |
| THN | Thenon | West | (860, 1220) | drawn label |  |  | 1.25 (5, old map) |  |
| DOB | Dobbum | West | (810, 1358) | drawn label (moved 12.8 px) |  |  | 1.25 (5, old map) |  |
| BRU | Brundahrim | West | (860, 1420) | drawn label |  |  | 0.5 (2, old map) |  |
| GRO | Gromkerm | West | (1162, 1216) | feature range_bolpor_boldor |  |  | 0.25 (1, old map) |  |
| SAO | Saopon | West | (1008, 1353) | feature lake_ilurdor |  |  | 1.25 (5, old map) |  |
| BLD | Buldor | West | (920, 1390) | drawn label |  |  | 2 (8, old map) |  |
| KRA | Kradlon | West | (760, 1504) | site_kradlon |  |  | 1 (4, old map) |  |
| CRG | Corogon | West | (1315, 1435) | drawn label |  |  | 2.25 (9, old map) |  |
| VRN | Varnondor | West | (1364, 1536) | site_varnondor_staging |  |  | 1.75 (7, old map) |  |
| WEN | Wennarith | West | (1480, 1421) | drawn label |  |  | 1.5 (6, old map) |  |
| DRK | Dark Gate | Dark | (2534, 1279) | feature pass_dark_gate |  |  | 1 (4, old map) | GOL |
| BUN | Burnikit | Dark | (2473, 1150) | drawn label |  |  | 0.25 (1, old map) |  |
| VES | Veshazel | Dark | (2529, 1242) | drawn label | (2587, 1347) |  | 0.5 (2, old map) |  |
| BLK | Blackton | Dark | (2723, 1098) | drawn label |  |  | 1 (4, old map) |  |
| BLN | Belonton | Dark | (2457, 1281) | drawn label |  |  | 0.75 (3, old map) |  |
| BOR | Bordon | Dark | (2416, 1060) | site_bordon |  |  | 0.25 (1, old map) |  |
| DRE | Dreson | Dark | (2406, 1075) | site_dreson |  |  | 0.25 (1, old map) |  |
| DUL | Dulundur | Dark | (2498, 1085) | site_dulundur |  |  | 1 (4, old map) |  |
| TRO | Troll Forest | Dark | (2590, 1094) | area forest_troll |  |  | 0.25 (1, old map) |  |
| HOO | Hoorunoron | Dark | (2653, 1107) | drawn label |  |  | 0.5 (2, old map) |  |
| DAK | The Darks | Dark | (2694, 1050) | area forest_dark |  |  | 0.75 (3, old map) |  |
| SKR | Skragdurg | Dark | (2540, 1112) | drawn label |  |  | 1.5 (6, old map) |  |
| DUN | Dun | Dark | (2784, 1181) | drawn label |  |  | 1 (4, old map) |  |
| BRT | Britadon | Dark | (2607, 1278) | drawn label |  |  | 0.5 (2, old map) |  |
| WIL | Wild Lands | Dark | (2401, 1181) | drawn label |  |  | 0.5 (2, old map) |  |
| KHO | Khorvrath | Ember | (3040, 2285) | dossier text (moved 15 px) |  |  | 0.25 (1, extent) | PUV |
| DLN | Dolon | Ember | (3027, 2176) | site_demon_dolon |  |  | 0.25 (1, extent) | PUV |
| NEZ | Nezer | Ember | (3153, 2278) | site_nezer |  |  | 0.5 (2, extent) | PUV |
| NET | Nether | Ember | (3072, 2393) | site_nether |  | land land_nether_island | 0.5 (2, extent) |  |
| HAL | Halia | Ember | (3540, 1925) | dossier text |  |  | 0.75 (3, extent) |  |
| NAN | Nan | Ember | (3419, 2042) | site_nan |  |  | 0.5 (2, extent) |  |
| OLE | Olen | Ember | (3670, 2050) | drawn label |  |  | 0.75 (3, extent) |  |
| ALR | Alerhia | East | (3993, 2048) | site_alerhia |  |  | 6.5 (26, old map) |  |
| NAA | Naamis | East | (4413, 1264) | site_gondolin |  |  | 5 (20, old map) |  |
| DRA | Drak | East | (4862, 1922) | site_drak |  |  | 2.75 (11, old map) |  |
| RHA | Rhachia | East | (4654, 2316) | site_avalon |  |  | 0.75 (3, old map) |  |
| ERC | Erco | East | (4736, 2419) | old capital |  |  | 4 (16, old map) |  |
| PLO | Plutondo | East | (4840, 2230) | drawn label |  |  | 4 (16, old map) |  |
| OST | Ostoroth | East | (4835, 1438) | site_ostoroth |  |  | 8 (32, old map) |  |
| MOA | Mora | East | (4717, 1658) | site_mora (moved 3 px) |  |  | 3.5 (14, old map) |  |
| DLB | Delbiz | East | (4130, 1480) | drawn label |  |  | 6.75 (27, old map) |  |
| KRS | Kersian | East | (4171, 1995) | drawn label |  |  | 2.5 (10, old map) |  |
| MOS | Mostok | East | (4343, 1950) | drawn label |  |  | 3 (12, old map) |  |
| AZA | Azano | East | (4380, 2000) | drawn label |  |  | 2.75 (11, old map) |  |
| OBM | Obmi | East | (4271, 2050) | drawn label |  |  | 1.75 (7, old map) |  |
| PRN | Pornivior | East | (4157, 2150) | drawn label |  |  | 2.25 (9, old map) |  |
| WOQ | Woqood | East | (4283, 1100) | drawn label |  |  | 5.25 (21, old map) |  |
| ORA | Orato | East | (4214, 1070) | land land_island_004 | (4373, 888) |  | 1.5 (6, old map) |  |
| MIE | Miaed | South | (3993, 2465) | site_miaed |  |  | 2 (8, extent) |  |
| WAH | Wahatud | South | (3584, 2278) | feature site_sun_desert |  |  | 1 (4, extent) |  |
| ENH | Enhis Is Rond | Isl. South | (1305, 2053) | site_enhis_is_rond |  |  | 0.75 (3, old map) |  |
| HWN | Howan | Isl. South | (1658, 1868) | site_howan |  |  | 0.5 (2, old map) |  |
| VER | Verde | Isl. South | (757, 2060) | site_verde |  |  | 0.25 (1, old map) |  |
| NAR | Nara | Isl. South | (1800, 1824) | site_nara |  |  | 0.25 (1, old map) |  |
| YON | Yongyong | Isl. South | (1206, 2038) | land land_island_026 |  |  | 1.25 (5, old map) |  |
| KAM | Kamu Lamo | Isl. South | (1090, 2062) | land land_island_041 |  |  | 0.5 (2, old map) |  |
| KEA | Kea | Isl. South | (962, 2238) | land land_island_034 |  |  | 1.5 (6, old map) |  |
| SDE | Sidea | Isl. South | (874, 2282) | land land_island_027 |  |  | 1 (4, old map) |  |
| ADE | Adel | Triton | (302, 1407) | site_adel |  |  | 2 (8, old map) |  |
| RAE | Raerby | Triton | (491, 1564) | site_raerby |  |  | 0.75 (3, old map) |  |
| PLL | Pollos | Triton | (568, 1487) | site_pollos |  |  | 0.75 (3, old map) |  |
| NND | Nondondor | Triton | (600, 1649) | site_nondondor |  |  | 0.5 (2, old map) |  |
| FNG | Fineger | Triton | (354, 1210) | land land_island_022 |  |  | 1.25 (5, old map) |  |
| HLN | Halenor | Triton | (366, 1730) | land land_island_059 |  |  | 1.75 (7, old map) |  |
| WND | Windy Lands | Triton | (450, 1660) | drawn label |  |  | 1.25 (5, old map) |  |
| SEI | Seite Islands | Triton | (434, 1506) | land land_island_029 |  |  | 1.25 (5, old map) |  |
| SNT | Santon | Triton | (318, 1622) | land land_island_014 |  |  | 0.75 (3, old map) |  |
| BEN | Benan | Triton | (550, 1520) | feature range_benan |  |  | 0.75 (3, old map) |  |
| LEN | The Lens | Triton | (411, 1412) | old capital (moved 17.8 px) |  |  | 0.25 (1, old map) |  |
| LIG | The Lands of Light | Sun | (550, 2362) | area plain_sun_grasslands |  |  | 1.5 (6, extent) |  |
| ELV | Elvana | Sun | (648, 2243) | site_elvana |  |  | 0.5 (2, extent) |  |
| IGA | Igara | Sun | (713, 2379) | site_igara |  |  | 0.25 (1, extent) |  |
| YEN | Yeni Alang | Sun | (410, 2419) | site_heaven |  |  | 0.5 (2, extent) |  |
| TOR | Tor Luni | Sun | (682, 2419) | site_godland |  |  | 0.5 (2, extent) |  |
| IHU | Ihuy | Sun | (621, 1833) | feature volcano_great |  |  | 0.75 (3, extent) |  |
| SOY | Soyano | Sun | (794, 1762) | land land_island_023 |  |  | 0.75 (3, extent) |  |
| GOO | Goodin | Sun | (430, 2300) | dossier text |  |  | 0.5 (2, extent) |  |
| GOF | God Forest | Sun | (630, 2366) | area forest_god |  |  | 0.25 (1, extent) |  |
| HRR | Herrodon | Magical | (3412, 962) | site_herrodon |  |  | 0.75 (3, extent) |  |
| ANE | Andos Enda | Magical | (3742, 965) | site_andos_enda |  |  | 0.75 (3, extent) |  |
| NLR | Nolorim | Magical | (3353, 1812) | site_nolorim |  |  | 0.5 (2, extent) |  |
| LCC | Lccimio | Magical | (3750, 1351) | old capital |  |  | 0.75 (3, extent) |  |
| ELD | Eldafaen | Magical | (3870, 1630) | dossier text (moved 14.1 px) |  |  | 0.25 (1, extent) |  |
| YAV | Yavieth | Magical | (3358, 1676) | site_dragon_mountain |  |  | 0.25 (1, extent) |  |
| TES | Teste | Magical | (3679, 1055) | area plain_herrodon_vale (moved 24 px) |  |  | 0.25 (1, extent) | HRR |
| LUV | Luv-zhise | Magical | (3987, 1492) | feature strait_rift_narrows |  |  | 0.25 (1, extent) |  |
| MSH | Mushroom Forest | Magical | (3932, 1331) | site_mushroom_forest |  |  | 0.75 (3, extent) |  |
| TIR | Tirlan | Middle | (2885, 1529) | feature river_hilorn |  |  | 0.25 (1, extent) | HIR |
