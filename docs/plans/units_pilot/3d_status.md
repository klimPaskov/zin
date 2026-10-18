# ZIN 3D unit pilots: status (2026-10-18)

Registry: `docs/plans/units_pilot/3d_jobs.json` (five humanoid_unit jobs; Meshy 7; per-unit rig).
Per-unit handoffs: `docs/assets/hoi4_3d_model_jobs/models_3d/<slug>/runtime/handoff.md` (+ `crosswalk.md`, `manifest.md`).

| Unit | Status | Roles exported | Credits |
| --- | --- | --- | --- |
| zin_men_infantry | complete (model package) | idle, move, attack, defend, retreat, death | 49 |
| zin_elves_warden | complete (model package) | idle, move, attack, defend, retreat, death | 49 |
| zin_orcs_warrior | complete (model package) | idle, move, attack, defend, retreat, death | 49 |
| zin_the_dead_revenant | complete (model package) | idle, move, attack, defend, retreat, death | 49 |
| zin_trolls_brute | complete (model package) | idle, move, attack, defend, retreat, death | 49 |

Live balance: 285 -> 40 (245 spent; every paid stage reconciled; no paid retries).

## Route per unit

1. `py -3.13 .tools/3d_pipeline/run_pilot.py --jobs-config docs/plans/units_pilot/3d_jobs.json --phase candidate <slug>` (Meshy 7 generation + Blender candidate gate; previews reviewed before any rig spend).
2. `py -3.13 docs/plans/units_pilot/run_humanoid_continuation.py <slug>` (kit `continue_humanoid` unchanged: remesh, one Meshy rig, one Meshy action each for idle 0 / attack 4 / death 8, kit Blender move, PDX textures, export, reimport; prepare target clamped to 21,000 triangles).
3. `py -3.13 docs/plans/units_pilot/repair_action_roots.py <slug>` (verified retarget + per-frame grounding of the provider actions; move un-slid and per-frame grounded; re-export and reimport proof).
4. `py -3.13 docs/plans/units_pilot/author_extra_roles.py <slug>` (defend/retreat; blocked until the NLA fix below).
5. `py -3.13 docs/plans/units_pilot/write_handoff.py <slug>`.

## Kit defects

Fixed by the parent: adapter mcp<2 pin; premature `main()` call; DDS converter path; converter stdin (DEVNULL).

Worked around inside the job roots (no kit edits):

1. Export stream budget: `continue_humanoid` exports the profile's 30,000-triangle working mesh as one stream of 89,997 index entries; `export_mesh` refuses anything above 65,535. The partition operation cannot run on these checkpoints (NLA, below). Workaround: 21,000-triangle working target. Kit fix: humanoid `working_triangle_target` <= 21,000, or partition before export once NLA is cleared.
2. Root slide: `sanitize_root_translation_channels` (prepare_candidate) and `author_locomotion_action` ground actions by moving Hips location index 2, which is horizontal on glTF-imported Meshy rigs; the bodies slid 7-69 units along Y in the exported .anim. The root lock also removed vertical root motion. Workaround: verified retarget (`import_animation_action`, meshy_animate receipts) + `correct_action_grounding`, and `offset_action_root` for move. Kit fix: choose the root channel with the strongest world-Z response (as `correct_action_grounding` already does).

Blocking (needs a kit fix):

3. NLA tracks: the glTF importer leaves an NLA track on the provider armature and `duplicate_hierarchy` (blender_worker.py, ~line 326) copies it onto the working rig. Every promotion-fingerprint operation then refuses the scene: `patch_existing_humanoid_action_phases` -> "Action phase patch requires existing animation data without drivers/NLA."; `partition_skeletal_mesh_export_batches` -> "Promotion does not support driver/NLA proof scenes." Minimal fix: after the glTF import in `import_candidate` (and/or in `duplicate_hierarchy`), remove each imported armature's NLA tracks while keeping its active action (`for t in list(obj.animation_data.nla_tracks): obj.animation_data.nla_tracks.remove(t)`). Then rerun steps 2-5 per unit (no provider spend).

## Update after the duplicate_hierarchy NLA fix

Infantry rerun (no spend): continuation and root repair pass again (idle, move, attack, death re-exported and re-imported). `author_extra_roles.py` now passes the working-rig check but fails one step later:
`Promotion does not support driver/NLA proof scenes.` (`_promotion_fingerprint` -> `_promotion_animation_state`, blender_worker.py line ~4754/5001). The fingerprint walks every object, and the protected provider armature `Armature` still carries the glTF importer's NLA track.
Minimal fix, either:
(a) `_promotion_animation_state`: when `block.get("hoi4_source_protected")`, record the NLA tracks (names, strips, actions) instead of raising; existing checkpoints then work with no re-preparation; or
(b) `import_candidate`: clear NLA tracks on glTF-imported objects (keeping the active action); every unit then needs steps 2-5 again (no spend).

## Final (after the parent's `_promotion_animation_state` fix)

All five units reran steps 2-5 with no provider spend. Every role (idle, move, attack, defend, retreat, death) is exported and re-imported against the exported mesh; ground contact 0 at every proof frame; rest-orientation solve drift under 4e-6 for every unit. support_attack -> attack and training -> idle per warfare spec 14.2 step 6. Live balance 40. Sound and counter packages remain outside this brief.
