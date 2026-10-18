# zin_trolls_brute runtime handoff

Status: **complete (model package)**. Runtime wiring, sound and counters are parent-owned and not done here.

## Provider lineage (Meshy 7 via the app-owned launcher)

| Stage | Task id | Status | Credits |
| --- | --- | --- | --- |
| animation_attack | `01a15001-7231-7017-8384-85eb4dc294e7` | SUCCEEDED | 3 |
| animation_death | `01a15006-b009-7643-a0c3-f8624ce30e44` | SUCCEEDED | 3 |
| animation_idle | `01a14ffc-003a-72d3-9ce8-6130abb4b30c` | SUCCEEDED | 3 |
| generation | `01a14fd3-3484-7565-9d07-214511fa391b` | SUCCEEDED | 30 |
| rig | `01a14ff6-4a98-7584-a7b8-1fac8d2bd3a8` | SUCCEEDED | 5 |
| rig_remesh | `01a14fee-8e70-769e-9724-664c17319426` | SUCCEEDED | 5 |

Total credits for this unit: 49.

## Runtime files (copy from this job root; do not reference docs/assets at runtime)

| File | Bytes | SHA-256 | Proposed runtime path |
| --- | --- | --- | --- |
| `export/mesh/zin_trolls_brute.mesh` | 1892694 | `ADBB53E88D3A099B8505B13EE345B1C5B564A328716AC8910E80D460E883CA6D` | `gfx/models/units/zin/zin_trolls_brute/zin_trolls_brute.mesh` |
| `export/anim/zin_trolls_brute_idle.anim` | 77395 | `1E06205195D65CF1A8C6712D0AC90A86F810D091DD09B710301E396F49088158` | `gfx/models/units/zin/zin_trolls_brute/zin_trolls_brute_idle.anim` |
| `export/anim/zin_trolls_brute_move.anim` | 21331 | `9CD6B20F63114DB3C66A67F51D9B464B5F8549DCDBC1924542945069E554A793` | `gfx/models/units/zin/zin_trolls_brute/zin_trolls_brute_move.anim` |
| `export/anim/zin_trolls_brute_attack.anim` | 55123 | `B7A55320A77AE4A0AB28B2F9646DF2ACD29AC4BB41A9B38E3DBB3429777FD494` | `gfx/models/units/zin/zin_trolls_brute/zin_trolls_brute_attack.anim` |
| `export/anim/zin_trolls_brute_defend.anim` | 77395 | `50A276C00E2645BD2DC2ED15CFA1A162D94603DFC15A6B95DACBF849881AEDF0` | `gfx/models/units/zin/zin_trolls_brute/zin_trolls_brute_defend.anim` |
| `export/anim/zin_trolls_brute_retreat.anim` | 21331 | `FE50DA9127D7644435333B3D18C3213E43D87FB943EDD32AB23D3E2D7272EA7D` | `gfx/models/units/zin/zin_trolls_brute/zin_trolls_brute_retreat.anim` |
| `export/anim/zin_trolls_brute_death.anim` | 58195 | `043CB4D756916B9E5E7887BCF9D60C7F97D7516EECAC35E2620F33611256FBB1` | `gfx/models/units/zin/zin_trolls_brute/zin_trolls_brute_death.anim` |
| `textures/dds/texture_0.dds` | 4194432 | `BEFA3DF467BF1DB994B7A820C44BE1FA25FFE4EACA783CEA65071687140DB788` | `gfx/models/units/zin/zin_trolls_brute/zin_trolls_brute_diffuse.dds` |
| `textures/dds/texture_specular.dds` | 4194432 | `4E2E66DCBE3682E85C812759A45EFA183AC7C5B2C20E71CA9DD1EFE9192C1AF1` | `gfx/models/units/zin/zin_trolls_brute/zin_trolls_brute_specular.dds` |
| `textures/dds/texture_normal.dds` | 4194432 | `B270CABE1ADDCD6ABF7FF6EDCF60E5F6B7C6E465595018D4E3BD1B3C84905C36` | `gfx/models/units/zin/zin_trolls_brute/zin_trolls_brute_normal.dds` |

## Mesh facts (parsed from the exported bytes' .txt dump)

- Objects / meshsettings name: `output_unwrapped.002` (index 0).
- Shader `PdxMeshAdvanced`; material references inside the .mesh: diff `texture_0.dds`, spec `texture_specular.dds`, n `texture_normal.dds`.
- Triangle-index entries 62997, position components 61425 (one stream, under 65,535).
- Source mesh height 11.7629188536 (vanilla infantry source height x 1.6); entity scale 0.8; effective runtime height 9.4103350829.
- Axes: +Z up, faces -Y, origin on the ground between the feet (same as western_european_infantry.mesh).
- Candidate gate: passed (30000 triangles at candidate stage, exported at 21,000).
- Skeleton: Meshy humanoid rig, 24 bones (Hips root; Spine02, Spine01, Spine, neck, Head; shoulders/arms/forearms/hands; legs/feet/toes). No locator nodes: vanilla weapon attach points (Right_Hand_node etc.) do not exist on this skeleton; weapon attachments need bone-name attaches or new locators.

## Proposed runtime identifiers (ZIN warfare spec 14.3)

- Sprite / asset id `zin_trolls_brute`; entity `zin_trolls_brute_entity` with `scale = 0.8`; pdxmesh `zin_trolls_brute_mesh`, `file = "gfx/models/units/zin/zin_trolls_brute/zin_trolls_brute.mesh"`.
- `meshsettings = { name = "output_unwrapped.002" index = 0 texture_diffuse = "gfx/models/units/zin/zin_trolls_brute/zin_trolls_brute_diffuse.dds" texture_normal = "gfx/models/units/zin/zin_trolls_brute/zin_trolls_brute_normal.dds" texture_specular = "gfx/models/units/zin/zin_trolls_brute/zin_trolls_brute_specular.dds" shader = "PdxMeshAdvanced" }` (the .mesh itself names generic texture_0/texture_normal/texture_specular files, so either keep those names in the unit folder or override them as shown).

| Entity state | Animation id | Animation type | Source |
| --- | --- | --- | --- |
| idle | `idle` | `zin_trolls_brute_idle` | provider Meshy action 0, retargeted and grounded |
| move | `move` | `zin_trolls_brute_move` | kit Blender walk, slide removed, per-frame grounded |
| attack | `attack` | `zin_trolls_brute_attack` | provider Meshy action 4, retargeted and grounded |
| defend | `defend` | `zin_trolls_brute_defend` | Blender phase patch of the grounded idle: guard raise (guard_start/hold/release), starts and ends on idle |
| retreat | `retreat` | `zin_trolls_brute_retreat` | Blender phase patch of the grounded move: hunched torso turning to look back, loop |
| death | `death` | `zin_trolls_brute_death` | provider Meshy action 8, retargeted and grounded |
| support_attack | `attack` | `zin_trolls_brute_attack` | reuse per warfare spec 14.2 step 6 |
| training | `idle` | `zin_trolls_brute_idle` | reuse per warfare spec 14.2 step 6 |

Animation facts: all 24 fps, in place, world X/Y root travel removed, ground contact 0 at every proof frame.

| Role | Frames | Loop | Reimport proof frames (centre x, centre y, ground z, top z) |
| --- | --- | --- | --- |
| attack | 1-69 | no | f1: -0.15, -0.66, 0.000, 10.21; f18: -0.01, -0.24, -0.000, 14.92; f35: 1.15, 0.65, -0.000, 9.11; f52: 0.40, -1.26, 0.000, 9.82; f69: -0.14, -0.66, 0.000, 10.21 |
| death | 1-73 | no | f1: -0.15, -0.66, 0.000, 10.21; f19: -0.67, 1.07, -0.000, 11.33; f37: -0.10, 0.98, -0.000, 9.80; f55: 2.37, -0.31, 0.000, 4.63; f73: 2.40, -0.53, 0.000, 3.55 |
| idle | 1-98 | yes | f1: 0.22, -0.31, -0.000, 11.55; f25: 0.06, 0.18, -0.000, 11.61; f50: -0.10, -0.19, -0.000, 11.51; f74: 0.19, -0.11, -0.000, 11.62; f98: 0.22, -0.31, -0.000, 11.55 |
| move | 1-25 | yes | f1: -0.25, -0.11, 0.000, 12.03; f7: 0.22, -0.40, -0.000, 11.61; f13: 0.29, -0.52, -0.000, 11.16; f19: 0.22, -0.40, -0.000, 11.61; f25: -0.25, -0.11, 0.000, 12.03 |
| defend | patched | no | f1: ground -0.000; f25: ground -0.000; f50: ground -0.000; f74: ground -0.000; f98: ground -0.000 |
| retreat | patched | yes | f1: ground 0.000; f7: ground -0.000; f13: ground -0.000; f19: ground -0.000; f25: ground 0.000 |

## QA notes

- Reimport previews show a chrome-like material: io_pdx_mesh displays the packed specular alpha (glossiness) as Blender roughness. Runtime bytes are the PDX-packed maps (spec G=32 level, B metallic, A glossiness; normal in G/A).
- Kit defects worked around (no kit edits): stream index budget (21,000-triangle export target), Hips root slide from index-2 grounding (provider actions re-imported through the verified retarget and per-frame grounded; move un-slid and per-frame lifted).
- Attack is Meshy action 4 (an unarmed strike); there is no weapon yet. Weapon attachments are a later job (warfare spec open question 9).
## Not in this package

- Sourced unit audio and bespoke counters (kit requirements for a complete custom unit) were outside this brief.

