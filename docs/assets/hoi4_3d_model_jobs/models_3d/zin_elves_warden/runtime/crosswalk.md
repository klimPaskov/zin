# zin_elves_warden requirement-to-runtime crosswalk

| Requirement | Evidence | Runtime target | Status |
| --- | --- | --- | --- |
| Geometry (Meshy 7) | provider/tasks/generation.json, validation/provider_candidate_gate.json | gfx/models/units/zin/zin_elves_warden/zin_elves_warden.mesh | exported, reimported |
| Scale calibration | blender/reports/zin_elves_warden_candidate_prepare.json (vanilla_reference) | entity scale 0.8 | measured |
| PDX material | blender/reports/textures_dds.json | gfx/models/units/zin/zin_elves_warden/zin_elves_warden_*.dds | packed |
| Action idle | blender/reports/action_root_repair.json / extra_roles_evidence.json | gfx/models/units/zin/zin_elves_warden/zin_elves_warden_idle.anim | exported, reimported |
| Action move | blender/reports/action_root_repair.json / extra_roles_evidence.json | gfx/models/units/zin/zin_elves_warden/zin_elves_warden_move.anim | exported, reimported |
| Action attack | blender/reports/action_root_repair.json / extra_roles_evidence.json | gfx/models/units/zin/zin_elves_warden/zin_elves_warden_attack.anim | exported, reimported |
| Action defend | blender/reports/action_root_repair.json / extra_roles_evidence.json | gfx/models/units/zin/zin_elves_warden/zin_elves_warden_defend.anim | exported, reimported |
| Action retreat | blender/reports/action_root_repair.json / extra_roles_evidence.json | gfx/models/units/zin/zin_elves_warden/zin_elves_warden_retreat.anim | exported, reimported |
| Action death | blender/reports/action_root_repair.json / extra_roles_evidence.json | gfx/models/units/zin/zin_elves_warden/zin_elves_warden_death.anim | exported, reimported |
| Entity, gfx, sound, counters | - | parent-owned | not started |

