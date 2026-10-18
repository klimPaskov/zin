# zin_elves_warden runtime handoff

Status: **complete (model package)**. Runtime wiring, sound and counters are parent-owned and not done here.

## Provider lineage (Meshy 7 via the app-owned launcher)

| Stage | Task id | Status | Credits |
| --- | --- | --- | --- |
| animation_attack | `01a14fab-34a5-7504-9375-6da886867250` | SUCCEEDED | 3 |
| animation_death | `01a14fc0-34f3-7530-9f49-c6d3fb46e2b0` | SUCCEEDED | 3 |
| animation_idle | `01a14f9d-3ffd-752c-8aab-7da14da4e30f` | SUCCEEDED | 3 |
| generation | `01a14f80-a59d-7057-9b8a-90c6e16c096b` | SUCCEEDED | 30 |
| rig | `01a14f96-e28c-731f-9a71-2c8146821c16` | SUCCEEDED | 5 |
| rig_remesh | `01a14f8f-0e93-7394-bab2-58038a57fe87` | SUCCEEDED | 5 |

Total credits for this unit: 49.

## Runtime files (copy from this job root; do not reference docs/assets at runtime)

| File | Bytes | SHA-256 | Proposed runtime path |
| --- | --- | --- | --- |
| `export/mesh/zin_elves_warden.mesh` | 1971254 | `36600A3AB9D39E8143C5EA5BA62EDDBD5C62FECA5C57CD3FEC8C6475CC0BF983` | `gfx/models/units/zin/zin_elves_warden/zin_elves_warden.mesh` |
| `export/anim/zin_elves_warden_idle.anim` | 77395 | `251AC5E1F7C3C935A199240C77E161D69CB79C17E93535B796F88115B2343CAF` | `gfx/models/units/zin/zin_elves_warden/zin_elves_warden_idle.anim` |
| `export/anim/zin_elves_warden_move.anim` | 21331 | `B78B7EA043777707B16C6115848EADE8134743DC92D4C23F160B01BB3B64E752` | `gfx/models/units/zin/zin_elves_warden/zin_elves_warden_move.anim` |
| `export/anim/zin_elves_warden_attack.anim` | 55123 | `5DE2A330D27F0C2A4F41A9D0B31C0DDE131EE5D39B6CE26D34A911A27F964396` | `gfx/models/units/zin/zin_elves_warden/zin_elves_warden_attack.anim` |
| `export/anim/zin_elves_warden_defend.anim` | 77395 | `BB9CC6A96834B06C33FAFF983F7475E5BD4A335E134F66428632C202299007E5` | `gfx/models/units/zin/zin_elves_warden/zin_elves_warden_defend.anim` |
| `export/anim/zin_elves_warden_retreat.anim` | 21331 | `9EFA8CA61A618FCB5788B33EB248B16DFD497953A8180670B832AC3510F2AC4E` | `gfx/models/units/zin/zin_elves_warden/zin_elves_warden_retreat.anim` |
| `export/anim/zin_elves_warden_death.anim` | 58195 | `A15B9224E95C0D670DA4A623F2E7C6D99628C8D7BCA8C8ED3B734805BCF78AE9` | `gfx/models/units/zin/zin_elves_warden/zin_elves_warden_death.anim` |
| `textures/dds/texture_0.dds` | 4194432 | `3A0E5C26FA5D6C6A5163609E300F9EA2745237C14BC24A498EB40BBA124975B9` | `gfx/models/units/zin/zin_elves_warden/zin_elves_warden_diffuse.dds` |
| `textures/dds/texture_specular.dds` | 4194432 | `C72A35DD5A5222B2421CAE851E5367439A28C888503E42A857C028604B5712C8` | `gfx/models/units/zin/zin_elves_warden/zin_elves_warden_specular.dds` |
| `textures/dds/texture_normal.dds` | 4194432 | `33F833882FA97187DBFA25B87BCB189057614598DD481B8FA3B70CC5708763F0` | `gfx/models/units/zin/zin_elves_warden/zin_elves_warden_normal.dds` |

## Mesh facts (parsed from the exported bytes' .txt dump)

- Objects / meshsettings name: `output_unwrapped.002` (index 0).
- Shader `PdxMeshAdvanced`; material references inside the .mesh: diff `texture_0.dds`, spec `texture_specular.dds`, n `texture_normal.dds`.
- Triangle-index entries 62997, position components 64371 (one stream, under 65,535).
- Source mesh height 7.3518242835 (vanilla infantry source height x 1.0); entity scale 0.8; effective runtime height 5.8814594268.
- Axes: +Z up, faces -Y, origin on the ground between the feet (same as western_european_infantry.mesh).
- Candidate gate: passed (30000 triangles at candidate stage, exported at 21,000).
- Skeleton: Meshy humanoid rig, 24 bones (Hips root; Spine02, Spine01, Spine, neck, Head; shoulders/arms/forearms/hands; legs/feet/toes). No locator nodes: vanilla weapon attach points (Right_Hand_node etc.) do not exist on this skeleton; weapon attachments need bone-name attaches or new locators.

## Proposed runtime identifiers (ZIN warfare spec 14.3)

- Sprite / asset id `zin_elves_warden`; entity `zin_elves_warden_entity` with `scale = 0.8`; pdxmesh `zin_elves_warden_mesh`, `file = "gfx/models/units/zin/zin_elves_warden/zin_elves_warden.mesh"`.
- `meshsettings = { name = "output_unwrapped.002" index = 0 texture_diffuse = "gfx/models/units/zin/zin_elves_warden/zin_elves_warden_diffuse.dds" texture_normal = "gfx/models/units/zin/zin_elves_warden/zin_elves_warden_normal.dds" texture_specular = "gfx/models/units/zin/zin_elves_warden/zin_elves_warden_specular.dds" shader = "PdxMeshAdvanced" }` (the .mesh itself names generic texture_0/texture_normal/texture_specular files, so either keep those names in the unit folder or override them as shown).

| Entity state | Animation id | Animation type | Source |
| --- | --- | --- | --- |
| idle | `idle` | `zin_elves_warden_idle` | provider Meshy action 0, retargeted and grounded |
| move | `move` | `zin_elves_warden_move` | kit Blender walk, slide removed, per-frame grounded |
| attack | `attack` | `zin_elves_warden_attack` | provider Meshy action 4, retargeted and grounded |
| defend | `defend` | `zin_elves_warden_defend` | Blender phase patch of the grounded idle: guard raise (guard_start/hold/release), starts and ends on idle |
| retreat | `retreat` | `zin_elves_warden_retreat` | Blender phase patch of the grounded move: hunched torso turning to look back, loop |
| death | `death` | `zin_elves_warden_death` | provider Meshy action 8, retargeted and grounded |
| support_attack | `attack` | `zin_elves_warden_attack` | reuse per warfare spec 14.2 step 6 |
| training | `idle` | `zin_elves_warden_idle` | reuse per warfare spec 14.2 step 6 |

Animation facts: all 24 fps, in place, world X/Y root travel removed, ground contact 0 at every proof frame.

| Role | Frames | Loop | Reimport proof frames (centre x, centre y, ground z, top z) |
| --- | --- | --- | --- |
| attack | 1-69 | no | f1: -0.18, -0.57, 0.000, 6.43; f18: -0.13, 0.16, -0.000, 7.94; f35: 0.74, 0.45, 0.000, 5.38; f52: 0.19, -1.04, 0.000, 6.05; f69: -0.17, -0.57, 0.000, 6.43 |
| death | 1-73 | no | f1: -0.18, -0.57, 0.000, 6.43; f19: -0.21, 0.11, -0.000, 6.85; f37: -0.05, 0.29, -0.000, 5.38; f55: 1.01, -0.01, 0.000, 2.13; f73: 1.08, -0.05, 0.000, 1.54 |
| idle | 1-98 | yes | f1: -0.05, -0.33, -0.000, 7.22; f25: 0.08, -0.15, -0.000, 7.13; f50: -0.05, -0.26, -0.000, 7.11; f74: -0.06, -0.27, -0.000, 7.22; f98: -0.05, -0.33, -0.000, 7.22 |
| move | 1-25 | yes | f1: -0.53, -0.05, -0.000, 7.27; f7: -0.04, -0.39, -0.000, 7.26; f13: 0.05, -0.55, -0.000, 7.00; f19: -0.04, -0.39, -0.000, 7.26; f25: -0.53, -0.05, -0.000, 7.27 |
| defend | patched | no | f1: ground -0.000; f25: ground -0.000; f50: ground -0.000; f74: ground -0.000; f98: ground -0.000 |
| retreat | patched | yes | f1: ground -0.000; f7: ground -0.000; f13: ground -0.000; f19: ground -0.000; f25: ground -0.000 |

## QA notes

- Reimport previews show a chrome-like material: io_pdx_mesh displays the packed specular alpha (glossiness) as Blender roughness. Runtime bytes are the PDX-packed maps (spec G=32 level, B metallic, A glossiness; normal in G/A).
- Kit defects worked around (no kit edits): stream index budget (21,000-triangle export target), Hips root slide from index-2 grounding (provider actions re-imported through the verified retarget and per-frame grounded; move un-slid and per-frame lifted).
- Attack is Meshy action 4 (an unarmed strike); there is no weapon yet. Weapon attachments are a later job (warfare spec open question 9).
## Not in this package

- Sourced unit audio and bespoke counters (kit requirements for a complete custom unit) were outside this brief.

