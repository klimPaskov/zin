# zin_men_infantry requirement-to-runtime crosswalk

| Requirement | Evidence | Runtime target | Status |
| --- | --- | --- | --- |
| Geometry (Meshy 7) | provider/tasks/generation.json, validation/provider_candidate_gate.json | gfx/models/units/zin/zin_men_infantry/zin_men_infantry.mesh | exported, reimported |
| Scale calibration | blender/reports/zin_men_infantry_candidate_prepare.json (vanilla_reference) | entity scale 0.8 | measured |
| PDX material | blender/reports/textures_dds.json | gfx/models/units/zin/zin_men_infantry/zin_men_infantry_*.dds | packed |
| Action idle | blender/reports/action_root_repair.json / extra_roles_evidence.json | gfx/models/units/zin/zin_men_infantry/zin_men_infantry_idle.anim | exported, reimported |
| Action move | blender/reports/action_root_repair.json / extra_roles_evidence.json | gfx/models/units/zin/zin_men_infantry/zin_men_infantry_move.anim | exported, reimported |
| Action attack | blender/reports/action_root_repair.json / extra_roles_evidence.json | gfx/models/units/zin/zin_men_infantry/zin_men_infantry_attack.anim | exported, reimported |
| Action defend | blender/reports/action_root_repair.json / extra_roles_evidence.json | gfx/models/units/zin/zin_men_infantry/zin_men_infantry_defend.anim | exported, reimported |
| Action retreat | blender/reports/action_root_repair.json / extra_roles_evidence.json | gfx/models/units/zin/zin_men_infantry/zin_men_infantry_retreat.anim | exported, reimported |
| Action death | blender/reports/action_root_repair.json / extra_roles_evidence.json | gfx/models/units/zin/zin_men_infantry/zin_men_infantry_death.anim | exported, reimported |
| Entity, gfx, sound, counters | - | parent-owned | not started |

