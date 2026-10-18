# zin_the_dead_revenant requirement-to-runtime crosswalk

| Requirement | Evidence | Runtime target | Status |
| --- | --- | --- | --- |
| Geometry (Meshy 7) | provider/tasks/generation.json, validation/provider_candidate_gate.json | gfx/models/units/zin/zin_the_dead_revenant/zin_the_dead_revenant.mesh | exported, reimported |
| Scale calibration | blender/reports/zin_the_dead_revenant_candidate_prepare.json (vanilla_reference) | entity scale 0.8 | measured |
| PDX material | blender/reports/textures_dds.json | gfx/models/units/zin/zin_the_dead_revenant/zin_the_dead_revenant_*.dds | packed |
| Action idle | blender/reports/action_root_repair.json / extra_roles_evidence.json | gfx/models/units/zin/zin_the_dead_revenant/zin_the_dead_revenant_idle.anim | exported, reimported |
| Action move | blender/reports/action_root_repair.json / extra_roles_evidence.json | gfx/models/units/zin/zin_the_dead_revenant/zin_the_dead_revenant_move.anim | exported, reimported |
| Action attack | blender/reports/action_root_repair.json / extra_roles_evidence.json | gfx/models/units/zin/zin_the_dead_revenant/zin_the_dead_revenant_attack.anim | exported, reimported |
| Action defend | blender/reports/action_root_repair.json / extra_roles_evidence.json | gfx/models/units/zin/zin_the_dead_revenant/zin_the_dead_revenant_defend.anim | exported, reimported |
| Action retreat | blender/reports/action_root_repair.json / extra_roles_evidence.json | gfx/models/units/zin/zin_the_dead_revenant/zin_the_dead_revenant_retreat.anim | exported, reimported |
| Action death | blender/reports/action_root_repair.json / extra_roles_evidence.json | gfx/models/units/zin/zin_the_dead_revenant/zin_the_dead_revenant_death.anim | exported, reimported |
| Entity, gfx, sound, counters | - | parent-owned | not started |

