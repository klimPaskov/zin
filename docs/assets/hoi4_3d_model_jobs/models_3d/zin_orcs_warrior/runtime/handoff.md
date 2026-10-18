# zin_orcs_warrior runtime handoff

Status: **complete (model package)**. Runtime wiring, sound and counters are parent-owned and not done here.

## Provider lineage (Meshy 7 via the app-owned launcher)

| Stage | Task id | Status | Credits |
| --- | --- | --- | --- |
| animation_attack | `01a14fd9-811c-71a9-86c5-aa1a525de8c1` | SUCCEEDED | 3 |
| animation_death | `01a14fe0-fb36-703c-a132-bad8b3d39020` | SUCCEEDED | 3 |
| animation_idle | `01a14fd0-7e15-7603-8baf-67a045d0437f` | SUCCEEDED | 3 |
| generation | `01a14f90-2f9b-7267-81dc-89ab2e2c4c22` | SUCCEEDED | 30 |
| rig | `01a14fc4-9d68-76c6-a98d-15874f206f31` | SUCCEEDED | 5 |
| rig_remesh | `01a14fb3-5423-7008-b50b-1f2f5424d824` | SUCCEEDED | 5 |

Total credits for this unit: 49.

## Runtime files (copy from this job root; do not reference docs/assets at runtime)

| File | Bytes | SHA-256 | Proposed runtime path |
| --- | --- | --- | --- |
| `export/mesh/zin_orcs_warrior.mesh` | 2987586 | `E1CFFC15AB788D5ABF5F0A5DD8DD0F4A1B6E9A7AC1E0EBF1F9FEBF2907AF7699` | `gfx/models/units/zin/zin_orcs_warrior/zin_orcs_warrior.mesh` |
| `export/anim/zin_orcs_warrior_idle.anim` | 77395 | `DD3FBFF16F976F5F0238961EBD42BC2FCEAFB3BAEBC48870ED80342BF3D53D2B` | `gfx/models/units/zin/zin_orcs_warrior/zin_orcs_warrior_idle.anim` |
| `export/anim/zin_orcs_warrior_move.anim` | 21331 | `7C6B934B3A15A0B98AA302BEBD0B726254C7031005CDB0FC86F6FC6BD15301D7` | `gfx/models/units/zin/zin_orcs_warrior/zin_orcs_warrior_move.anim` |
| `export/anim/zin_orcs_warrior_attack.anim` | 55123 | `F9F7AB2DA6F1F3B4FFB2DC2F150298058B59C4735F2B66FA17818B2B775309BE` | `gfx/models/units/zin/zin_orcs_warrior/zin_orcs_warrior_attack.anim` |
| `export/anim/zin_orcs_warrior_defend.anim` | 77395 | `763B8214C749BE386A674CA408458AF070B585B580F5B1F98DF54C831D32CF51` | `gfx/models/units/zin/zin_orcs_warrior/zin_orcs_warrior_defend.anim` |
| `export/anim/zin_orcs_warrior_retreat.anim` | 21331 | `318F1FF3C0EDA32A1E950A83DD88966743B5441B29DDEB0AF89991D40ACA80F8` | `gfx/models/units/zin/zin_orcs_warrior/zin_orcs_warrior_retreat.anim` |
| `export/anim/zin_orcs_warrior_death.anim` | 58195 | `4D93EC4648C400AE39A1AE20D8AFB195F8D0EFC153FA080E6C71094C7AF47E1C` | `gfx/models/units/zin/zin_orcs_warrior/zin_orcs_warrior_death.anim` |
| `textures/dds/texture_0.dds` | 4194432 | `AAAE2ECEF367F38F914C21FD82A239CAAD48FFB0BB47D2E8282BEED5D991914C` | `gfx/models/units/zin/zin_orcs_warrior/zin_orcs_warrior_diffuse.dds` |
| `textures/dds/texture_specular.dds` | 4194432 | `994B3677C78F7DC3B2A178DCAA841D20BF80720011CFA94A0A78C51995349A0F` | `gfx/models/units/zin/zin_orcs_warrior/zin_orcs_warrior_specular.dds` |
| `textures/dds/texture_normal.dds` | 4194432 | `2449C6B8ECAC425A9E02A08E50CD12AD8A3B1AC2AB0209A93E97961EE598B5E8` | `gfx/models/units/zin/zin_orcs_warrior/zin_orcs_warrior_normal.dds` |

## Mesh facts (parsed from the exported bytes' .txt dump)

- Objects / meshsettings name: `output_unwrapped.002` (index 0).
- Shader `PdxMeshAdvanced`; material references inside the .mesh: diff `texture_0.dds`, spec `texture_specular.dds`, n `texture_normal.dds`.
- Triangle-index entries 63000, position components 102483 (one stream, under 65,535).
- Source mesh height 7.3518242835 (vanilla infantry source height x 1.0); entity scale 0.8; effective runtime height 5.8814594268.
- Axes: +Z up, faces -Y, origin on the ground between the feet (same as western_european_infantry.mesh).
- Candidate gate: passed (30000 triangles at candidate stage, exported at 21,000).
- Skeleton: Meshy humanoid rig, 24 bones (Hips root; Spine02, Spine01, Spine, neck, Head; shoulders/arms/forearms/hands; legs/feet/toes). No locator nodes: vanilla weapon attach points (Right_Hand_node etc.) do not exist on this skeleton; weapon attachments need bone-name attaches or new locators.

## Proposed runtime identifiers (ZIN warfare spec 14.3)

- Sprite / asset id `zin_orcs_warrior`; entity `zin_orcs_warrior_entity` with `scale = 0.8`; pdxmesh `zin_orcs_warrior_mesh`, `file = "gfx/models/units/zin/zin_orcs_warrior/zin_orcs_warrior.mesh"`.
- `meshsettings = { name = "output_unwrapped.002" index = 0 texture_diffuse = "gfx/models/units/zin/zin_orcs_warrior/zin_orcs_warrior_diffuse.dds" texture_normal = "gfx/models/units/zin/zin_orcs_warrior/zin_orcs_warrior_normal.dds" texture_specular = "gfx/models/units/zin/zin_orcs_warrior/zin_orcs_warrior_specular.dds" shader = "PdxMeshAdvanced" }` (the .mesh itself names generic texture_0/texture_normal/texture_specular files, so either keep those names in the unit folder or override them as shown).

| Entity state | Animation id | Animation type | Source |
| --- | --- | --- | --- |
| idle | `idle` | `zin_orcs_warrior_idle` | provider Meshy action 0, retargeted and grounded |
| move | `move` | `zin_orcs_warrior_move` | kit Blender walk, slide removed, per-frame grounded |
| attack | `attack` | `zin_orcs_warrior_attack` | provider Meshy action 4, retargeted and grounded |
| defend | `defend` | `zin_orcs_warrior_defend` | Blender phase patch of the grounded idle: guard raise (guard_start/hold/release), starts and ends on idle |
| retreat | `retreat` | `zin_orcs_warrior_retreat` | Blender phase patch of the grounded move: hunched torso turning to look back, loop |
| death | `death` | `zin_orcs_warrior_death` | provider Meshy action 8, retargeted and grounded |
| support_attack | `attack` | `zin_orcs_warrior_attack` | reuse per warfare spec 14.2 step 6 |
| training | `idle` | `zin_orcs_warrior_idle` | reuse per warfare spec 14.2 step 6 |

Animation facts: all 24 fps, in place, world X/Y root travel removed, ground contact 0 at every proof frame.

| Role | Frames | Loop | Reimport proof frames (centre x, centre y, ground z, top z) |
| --- | --- | --- | --- |
| attack | 1-69 | no | f1: -0.08, -0.72, -0.000, 6.33; f18: 0.04, -0.01, 0.000, 9.02; f35: 0.72, 0.33, -0.000, 5.28; f52: 0.35, -1.19, -0.000, 5.89; f69: -0.07, -0.72, -0.000, 6.33 |
| death | 1-73 | no | f1: -0.08, -0.72, -0.000, 6.33; f19: -0.37, 0.19, 0.000, 6.97; f37: -0.13, 0.22, 0.000, 6.00; f55: 0.99, 0.02, -0.000, 2.60; f73: 1.14, -0.05, 0.000, 2.46 |
| idle | 1-98 | yes | f1: -0.00, -0.26, -0.000, 7.14; f25: -0.05, -0.19, -0.000, 7.13; f50: -0.05, -0.17, -0.000, 7.09; f74: -0.13, -0.11, -0.000, 7.20; f98: -0.00, -0.26, -0.000, 7.14 |
| move | 1-25 | yes | f1: -0.53, -0.04, -0.000, 7.24; f7: -0.01, -0.32, 0.000, 7.19; f13: 0.12, -0.52, -0.000, 7.23; f19: -0.01, -0.32, 0.000, 7.19; f25: -0.53, -0.04, -0.000, 7.24 |
| defend | patched | no | f1: ground -0.000; f25: ground -0.000; f50: ground -0.000; f74: ground -0.000; f98: ground -0.000 |
| retreat | patched | yes | f1: ground -0.000; f7: ground 0.000; f13: ground -0.000; f19: ground 0.000; f25: ground -0.000 |

## QA notes

- Reimport previews show a chrome-like material: io_pdx_mesh displays the packed specular alpha (glossiness) as Blender roughness. Runtime bytes are the PDX-packed maps (spec G=32 level, B metallic, A glossiness; normal in G/A).
- Kit defects worked around (no kit edits): stream index budget (21,000-triangle export target), Hips root slide from index-2 grounding (provider actions re-imported through the verified retarget and per-frame grounded; move un-slid and per-frame lifted).
- Attack is Meshy action 4 (an unarmed strike); there is no weapon yet. Weapon attachments are a later job (warfare spec open question 9).
## Not in this package

- Sourced unit audio and bespoke counters (kit requirements for a complete custom unit) were outside this brief.

