# zin_orcs_warrior requirement-to-runtime crosswalk

| Requirement | Evidence | Runtime target | Status |
| --- | --- | --- | --- |
| Geometry (Meshy 7) | provider/tasks/generation.json, validation/provider_candidate_gate.json | gfx/models/units/zin/zin_orcs_warrior/zin_orcs_warrior.mesh | exported, reimported |
| Scale calibration | blender/reports/zin_orcs_warrior_candidate_prepare.json (vanilla_reference) | entity scale 0.8 | measured |
| PDX material | blender/reports/textures_dds.json | gfx/models/units/zin/zin_orcs_warrior/zin_orcs_warrior_*.dds | packed |
| Action idle | blender/reports/action_root_repair.json / extra_roles_evidence.json | gfx/models/units/zin/zin_orcs_warrior/zin_orcs_warrior_idle.anim | exported, reimported |
| Action move | blender/reports/action_root_repair.json / extra_roles_evidence.json | gfx/models/units/zin/zin_orcs_warrior/zin_orcs_warrior_move.anim | exported, reimported |
| Action attack | blender/reports/action_root_repair.json / extra_roles_evidence.json | gfx/models/units/zin/zin_orcs_warrior/zin_orcs_warrior_attack.anim | exported, reimported |
| Action defend | blender/reports/action_root_repair.json / extra_roles_evidence.json | gfx/models/units/zin/zin_orcs_warrior/zin_orcs_warrior_defend.anim | exported, reimported |
| Action retreat | blender/reports/action_root_repair.json / extra_roles_evidence.json | gfx/models/units/zin/zin_orcs_warrior/zin_orcs_warrior_retreat.anim | exported, reimported |
| Action death | blender/reports/action_root_repair.json / extra_roles_evidence.json | gfx/models/units/zin/zin_orcs_warrior/zin_orcs_warrior_death.anim | exported, reimported |
| Entity, gfx, sound, counters | - | parent-owned | not started |

