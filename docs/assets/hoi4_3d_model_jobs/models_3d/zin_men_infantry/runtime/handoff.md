# zin_men_infantry runtime handoff

Status: **complete (model package)**. Runtime wiring, sound and counters are parent-owned and not done here.

## Provider lineage (Meshy 7 via the app-owned launcher)

| Stage | Task id | Status | Credits |
| --- | --- | --- | --- |
| animation_attack | `01a14f63-558d-74f6-81bb-94c17b47e74f` | SUCCEEDED | 3 |
| animation_death | `01a14f68-9cfa-70c8-886a-007ba46eac52` | SUCCEEDED | 3 |
| animation_idle | `01a14f5d-7c24-70e4-ace8-aa0648c223be` | SUCCEEDED | 3 |
| generation | `01a14f3b-6f1b-75da-9829-6a3726b692d8` | SUCCEEDED | 30 |
| rig | `01a14f57-48eb-708d-9572-682ab006c690` | SUCCEEDED | 5 |
| rig_remesh | `01a14f50-6190-706f-a028-6145c2c9f1d8` | SUCCEEDED | 5 |

Total credits for this unit: 49.

## Runtime files (copy from this job root; do not reference docs/assets at runtime)

| File | Bytes | SHA-256 | Proposed runtime path |
| --- | --- | --- | --- |
| `export/mesh/zin_men_infantry.mesh` | 1690866 | `F6CA9E525CD96505393892F6FDBBEF64C4DE605F6BD50996944199392E4CC9D9` | `gfx/models/units/zin/zin_men_infantry/zin_men_infantry.mesh` |
| `export/anim/zin_men_infantry_idle.anim` | 77395 | `BB91667DB70DF525F90EA7616F604CD9D0C16E03354C2D05F79CB3258772C5DD` | `gfx/models/units/zin/zin_men_infantry/zin_men_infantry_idle.anim` |
| `export/anim/zin_men_infantry_move.anim` | 21331 | `2EB5AD25ED5E568AD5BE3E0F4A3F6152F2752834AB4455C345578CBF4977F48E` | `gfx/models/units/zin/zin_men_infantry/zin_men_infantry_move.anim` |
| `export/anim/zin_men_infantry_attack.anim` | 55123 | `5E3182CF0046DFFA74B52DFF21150FF81ED4EF5FCC0652E3E5F25DD703FCB1DF` | `gfx/models/units/zin/zin_men_infantry/zin_men_infantry_attack.anim` |
| `export/anim/zin_men_infantry_defend.anim` | 77395 | `813694ED0BA55592DDFCEC144A10BDD23E57BE2557A89E9F086FBA08DF9DBD13` | `gfx/models/units/zin/zin_men_infantry/zin_men_infantry_defend.anim` |
| `export/anim/zin_men_infantry_retreat.anim` | 21331 | `8939D63A59FEF31507A3CA55A4510550097892CCFAB9158563A9E4ED3FAEA064` | `gfx/models/units/zin/zin_men_infantry/zin_men_infantry_retreat.anim` |
| `export/anim/zin_men_infantry_death.anim` | 58195 | `BBDEA22A91CC1068F37235D9D49B2FF218B0E367D01CF65490DA7C1062825DAE` | `gfx/models/units/zin/zin_men_infantry/zin_men_infantry_death.anim` |
| `textures/dds/texture_0.dds` | 4194432 | `7B6CA650B2B702B130D953AD8544E9A86853F98F493307588EC8E917296C6EF4` | `gfx/models/units/zin/zin_men_infantry/zin_men_infantry_diffuse.dds` |
| `textures/dds/texture_specular.dds` | 4194432 | `A1B25479D2B8C127D3C980ABB1CEDC52DD2642FF4E66D2965374AB0CF0C9290F` | `gfx/models/units/zin/zin_men_infantry/zin_men_infantry_specular.dds` |
| `textures/dds/texture_normal.dds` | 4194432 | `865FE2D254E7332A8D434CF9E1752701334D20A72031D40EE903598CC994856C` | `gfx/models/units/zin/zin_men_infantry/zin_men_infantry_normal.dds` |

## Mesh facts (parsed from the exported bytes' .txt dump)

- Objects / meshsettings name: `output_unwrapped.002` (index 0).
- Shader `PdxMeshAdvanced`; material references inside the .mesh: diff `texture_0.dds`, spec `texture_specular.dds`, n `texture_normal.dds`.
- Triangle-index entries 63000, position components 53856 (one stream, under 65,535).
- Source mesh height 7.3518242835 (vanilla infantry source height x 1.0); entity scale 0.8; effective runtime height 5.8814594268.
- Axes: +Z up, faces -Y, origin on the ground between the feet (same as western_european_infantry.mesh).
- Candidate gate: passed (30000 triangles at candidate stage, exported at 21,000).
- Skeleton: Meshy humanoid rig, 24 bones (Hips root; Spine02, Spine01, Spine, neck, Head; shoulders/arms/forearms/hands; legs/feet/toes). No locator nodes: vanilla weapon attach points (Right_Hand_node etc.) do not exist on this skeleton; weapon attachments need bone-name attaches or new locators.

## Proposed runtime identifiers (ZIN warfare spec 14.3)

- Sprite / asset id `zin_men_infantry`; entity `zin_men_infantry_entity` with `scale = 0.8`; pdxmesh `zin_men_infantry_mesh`, `file = "gfx/models/units/zin/zin_men_infantry/zin_men_infantry.mesh"`.
- `meshsettings = { name = "output_unwrapped.002" index = 0 texture_diffuse = "gfx/models/units/zin/zin_men_infantry/zin_men_infantry_diffuse.dds" texture_normal = "gfx/models/units/zin/zin_men_infantry/zin_men_infantry_normal.dds" texture_specular = "gfx/models/units/zin/zin_men_infantry/zin_men_infantry_specular.dds" shader = "PdxMeshAdvanced" }` (the .mesh itself names generic texture_0/texture_normal/texture_specular files, so either keep those names in the unit folder or override them as shown).

| Entity state | Animation id | Animation type | Source |
| --- | --- | --- | --- |
| idle | `idle` | `zin_men_infantry_idle` | provider Meshy action 0, retargeted and grounded |
| move | `move` | `zin_men_infantry_move` | kit Blender walk, slide removed, per-frame grounded |
| attack | `attack` | `zin_men_infantry_attack` | provider Meshy action 4, retargeted and grounded |
| defend | `defend` | `zin_men_infantry_defend` | Blender phase patch of the grounded idle: guard raise (guard_start/hold/release), starts and ends on idle |
| retreat | `retreat` | `zin_men_infantry_retreat` | Blender phase patch of the grounded move: hunched torso turning to look back, loop |
| death | `death` | `zin_men_infantry_death` | provider Meshy action 8, retargeted and grounded |
| support_attack | `attack` | `zin_men_infantry_attack` | reuse per warfare spec 14.2 step 6 |
| training | `idle` | `zin_men_infantry_idle` | reuse per warfare spec 14.2 step 6 |

Animation facts: all 24 fps, in place, world X/Y root travel removed, ground contact 0 at every proof frame.

| Role | Frames | Loop | Reimport proof frames (centre x, centre y, ground z, top z) |
| --- | --- | --- | --- |
| attack | 1-69 | no | f1: -0.13, -0.63, 0.000, 6.29; f18: -0.11, 0.13, -0.000, 8.00; f35: 0.72, 0.41, 0.000, 5.24; f52: 0.26, -1.09, 0.000, 5.87; f69: -0.12, -0.63, 0.000, 6.29 |
| death | 1-73 | no | f1: -0.13, -0.63, 0.000, 6.29; f19: -0.35, 0.13, 0.000, 6.95; f37: -0.12, 0.23, 0.000, 5.84; f55: 0.86, 0.21, 0.000, 2.17; f73: 0.93, 0.19, 0.000, 1.62 |
| idle | 1-98 | yes | f1: -0.01, -0.31, 0.000, 7.17; f25: 0.03, -0.18, 0.000, 7.11; f50: -0.11, -0.18, 0.000, 7.09; f74: -0.15, -0.18, 0.000, 7.22; f98: -0.01, -0.31, 0.000, 7.17 |
| move | 1-25 | yes | f1: -0.62, -0.01, -0.000, 7.18; f7: -0.04, -0.35, 0.000, 7.22; f13: 0.07, -0.50, 0.000, 7.15; f19: -0.04, -0.35, 0.000, 7.22; f25: -0.62, -0.01, -0.000, 7.18 |
| defend | patched | no | f1: ground 0.000; f25: ground 0.000; f50: ground 0.000; f74: ground 0.000; f98: ground 0.000 |
| retreat | patched | yes | f1: ground -0.000; f7: ground 0.000; f13: ground 0.000; f19: ground 0.000; f25: ground -0.000 |

## QA notes

- Reimport previews show a chrome-like material: io_pdx_mesh displays the packed specular alpha (glossiness) as Blender roughness. Runtime bytes are the PDX-packed maps (spec G=32 level, B metallic, A glossiness; normal in G/A).
- Kit defects worked around (no kit edits): stream index budget (21,000-triangle export target), Hips root slide from index-2 grounding (provider actions re-imported through the verified retarget and per-frame grounded; move un-slid and per-frame lifted).
- Attack is Meshy action 4 (an unarmed strike); there is no weapon yet. Weapon attachments are a later job (warfare spec open question 9).
## Not in this package

- Sourced unit audio and bespoke counters (kit requirements for a complete custom unit) were outside this brief.

