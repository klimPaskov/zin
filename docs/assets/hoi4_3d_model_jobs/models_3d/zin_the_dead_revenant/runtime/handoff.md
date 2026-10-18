# zin_the_dead_revenant runtime handoff

Status: **complete (model package)**. Runtime wiring, sound and counters are parent-owned and not done here.

## Provider lineage (Meshy 7 via the app-owned launcher)

| Stage | Task id | Status | Credits |
| --- | --- | --- | --- |
| animation_attack | `01a14fea-47c5-7164-8ae7-01f575d32cbe` | SUCCEEDED | 3 |
| animation_death | `01a14ff2-c758-759f-b305-7dd4f0a7f511` | SUCCEEDED | 3 |
| animation_idle | `01a14fe3-03b4-71cc-9f6f-cd1c8ebf9b16` | SUCCEEDED | 3 |
| generation | `01a14fb7-4f3b-743e-8cc5-96ce692491a2` | SUCCEEDED | 30 |
| rig | `01a14fda-b744-7401-bae5-ba27f4e84e71` | SUCCEEDED | 5 |
| rig_remesh | `01a14fd1-1de5-75dd-8009-0c4bc2dcd690` | SUCCEEDED | 5 |

Total credits for this unit: 49.

## Runtime files (copy from this job root; do not reference docs/assets at runtime)

| File | Bytes | SHA-256 | Proposed runtime path |
| --- | --- | --- | --- |
| `export/mesh/zin_the_dead_revenant.mesh` | 2074146 | `6745D5102C19A041C48FE935DF551DEB3DE849B15806DE6ACEA00E522F80865F` | `gfx/models/units/zin/zin_the_dead_revenant/zin_the_dead_revenant.mesh` |
| `export/anim/zin_the_dead_revenant_idle.anim` | 77395 | `A9D80AE80716F89E99657C5642B06EE4A2809319E3282FAA2462DC6158FB4213` | `gfx/models/units/zin/zin_the_dead_revenant/zin_the_dead_revenant_idle.anim` |
| `export/anim/zin_the_dead_revenant_move.anim` | 21331 | `6E2847A0C540A3C40F845A5B4B473BD9452734C01470FB7EC17AAFC757FD200E` | `gfx/models/units/zin/zin_the_dead_revenant/zin_the_dead_revenant_move.anim` |
| `export/anim/zin_the_dead_revenant_attack.anim` | 55123 | `50AA971C76037EB17AA7E680F42A1EA323BB42F12072DABA6799A5B6AF43B6AF` | `gfx/models/units/zin/zin_the_dead_revenant/zin_the_dead_revenant_attack.anim` |
| `export/anim/zin_the_dead_revenant_defend.anim` | 77395 | `A645188554C78642534271AD29F6324D8132DB93E15E8DD594041499F0BB2B5B` | `gfx/models/units/zin/zin_the_dead_revenant/zin_the_dead_revenant_defend.anim` |
| `export/anim/zin_the_dead_revenant_retreat.anim` | 21331 | `1738E9B6B56B69AB11C856333DD1F773C169753DC5CFB705503CBC6271381B6A` | `gfx/models/units/zin/zin_the_dead_revenant/zin_the_dead_revenant_retreat.anim` |
| `export/anim/zin_the_dead_revenant_death.anim` | 58195 | `EB04D781B6BDEC38A04AFD74170CFB43EE59D915B41397344188F621A77DA34F` | `gfx/models/units/zin/zin_the_dead_revenant/zin_the_dead_revenant_death.anim` |
| `textures/dds/texture_0.dds` | 4194432 | `DBD1C11E944FD35D0BC2630CA18A1CD4F1FAF68737ACDDF458274903B4E953CF` | `gfx/models/units/zin/zin_the_dead_revenant/zin_the_dead_revenant_diffuse.dds` |
| `textures/dds/texture_specular.dds` | 4194432 | `42D39362E652D5991A7B200C961DF9F0E51B9558C7D4864022C307A1B4C2809E` | `gfx/models/units/zin/zin_the_dead_revenant/zin_the_dead_revenant_specular.dds` |
| `textures/dds/texture_normal.dds` | 4194432 | `50938C9C05719650C08648B60BBDA3DD9D1E5EE9249C093ADF5084C905C7DAAE` | `gfx/models/units/zin/zin_the_dead_revenant/zin_the_dead_revenant_normal.dds` |

## Mesh facts (parsed from the exported bytes' .txt dump)

- Objects / meshsettings name: `output_unwrapped.002` (index 0).
- Shader `PdxMeshAdvanced`; material references inside the .mesh: diff `texture_0.dds`, spec `texture_specular.dds`, n `texture_normal.dds`.
- Triangle-index entries 63000, position components 68229 (one stream, under 65,535).
- Source mesh height 7.3518242835 (vanilla infantry source height x 1.0); entity scale 0.8; effective runtime height 5.8814594268.
- Axes: +Z up, faces -Y, origin on the ground between the feet (same as western_european_infantry.mesh).
- Candidate gate: passed (30000 triangles at candidate stage, exported at 21,000).
- Skeleton: Meshy humanoid rig, 24 bones (Hips root; Spine02, Spine01, Spine, neck, Head; shoulders/arms/forearms/hands; legs/feet/toes). No locator nodes: vanilla weapon attach points (Right_Hand_node etc.) do not exist on this skeleton; weapon attachments need bone-name attaches or new locators.

## Proposed runtime identifiers (ZIN warfare spec 14.3)

- Sprite / asset id `zin_the_dead_revenant`; entity `zin_the_dead_revenant_entity` with `scale = 0.8`; pdxmesh `zin_the_dead_revenant_mesh`, `file = "gfx/models/units/zin/zin_the_dead_revenant/zin_the_dead_revenant.mesh"`.
- `meshsettings = { name = "output_unwrapped.002" index = 0 texture_diffuse = "gfx/models/units/zin/zin_the_dead_revenant/zin_the_dead_revenant_diffuse.dds" texture_normal = "gfx/models/units/zin/zin_the_dead_revenant/zin_the_dead_revenant_normal.dds" texture_specular = "gfx/models/units/zin/zin_the_dead_revenant/zin_the_dead_revenant_specular.dds" shader = "PdxMeshAdvanced" }` (the .mesh itself names generic texture_0/texture_normal/texture_specular files, so either keep those names in the unit folder or override them as shown).

| Entity state | Animation id | Animation type | Source |
| --- | --- | --- | --- |
| idle | `idle` | `zin_the_dead_revenant_idle` | provider Meshy action 0, retargeted and grounded |
| move | `move` | `zin_the_dead_revenant_move` | kit Blender walk, slide removed, per-frame grounded |
| attack | `attack` | `zin_the_dead_revenant_attack` | provider Meshy action 4, retargeted and grounded |
| defend | `defend` | `zin_the_dead_revenant_defend` | Blender phase patch of the grounded idle: guard raise (guard_start/hold/release), starts and ends on idle |
| retreat | `retreat` | `zin_the_dead_revenant_retreat` | Blender phase patch of the grounded move: hunched torso turning to look back, loop |
| death | `death` | `zin_the_dead_revenant_death` | provider Meshy action 8, retargeted and grounded |
| support_attack | `attack` | `zin_the_dead_revenant_attack` | reuse per warfare spec 14.2 step 6 |
| training | `idle` | `zin_the_dead_revenant_idle` | reuse per warfare spec 14.2 step 6 |

Animation facts: all 24 fps, in place, world X/Y root travel removed, ground contact 0 at every proof frame.

| Role | Frames | Loop | Reimport proof frames (centre x, centre y, ground z, top z) |
| --- | --- | --- | --- |
| attack | 1-69 | no | f1: 0.00, -0.56, -0.000, 6.30; f18: 0.01, -0.08, -0.000, 7.74; f35: 0.74, 0.23, 0.000, 5.42; f52: 0.34, -0.96, -0.000, 5.95; f69: 0.01, -0.57, -0.000, 6.30 |
| death | 1-73 | no | f1: 0.00, -0.56, -0.000, 6.30; f19: -0.33, 0.25, 0.000, 6.98; f37: -0.07, 0.32, -0.000, 5.83; f55: 1.06, 0.08, -0.000, 2.09; f73: 1.06, 0.03, 0.000, 1.87 |
| idle | 1-98 | yes | f1: 0.05, -0.37, -0.000, 7.11; f25: 0.01, -0.16, -0.000, 7.10; f50: -0.02, -0.23, -0.000, 7.06; f74: 0.05, -0.20, -0.000, 7.16; f98: 0.05, -0.37, -0.000, 7.11 |
| move | 1-25 | yes | f1: -0.29, -0.16, 0.000, 7.44; f7: 0.05, -0.42, -0.000, 7.12; f13: -0.03, -0.58, -0.000, 6.87; f19: 0.05, -0.42, -0.000, 7.12; f25: -0.29, -0.16, 0.000, 7.44 |
| defend | patched | no | f1: ground -0.000; f25: ground -0.000; f50: ground -0.000; f74: ground -0.000; f98: ground -0.000 |
| retreat | patched | yes | f1: ground 0.000; f7: ground -0.000; f13: ground -0.000; f19: ground -0.000; f25: ground 0.000 |

## QA notes

- Reimport previews show a chrome-like material: io_pdx_mesh displays the packed specular alpha (glossiness) as Blender roughness. Runtime bytes are the PDX-packed maps (spec G=32 level, B metallic, A glossiness; normal in G/A).
- Kit defects worked around (no kit edits): stream index budget (21,000-triangle export target), Hips root slide from index-2 grounding (provider actions re-imported through the verified retarget and per-frame grounded; move un-slid and per-frame lifted).
- Attack is Meshy action 4 (an unarmed strike); there is no weapon yet. Weapon attachments are a later job (warfare spec open question 9).
## Not in this package

- Sourced unit audio and bespoke counters (kit requirements for a complete custom unit) were outside this brief.

