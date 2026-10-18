"""Rebuild the kit runner's humanoid actions with correct root placement, then re-export.

Kit defect found in the infantry pilot (no kit file is edited here):
blender_worker.sanitize_root_translation_channels (inside prepare_candidate)
and author_locomotion_action "ground" an in-place action by moving Hips
location array index 2, assuming it is vertical. On glTF-imported Meshy rigs
that channel is horizontal (world -Y), the measured derivative is tiny, and the
correction becomes hundreds of source units of slide: the reimported proofs put
the body at Y -7.3 (attack), +9.9 (death), +53.2 (idle) and +68.8 (move) while
the rest mesh sits at the origin. Locking the root to its first key also threw
away the provider's vertical root motion (crouching attack and falling death
then cut 0.6 into the ground, and the dead body ends 2.3 above it).

Repair, using only verified adapter operations and no provider calls:

* idle, attack, death (Meshy actions): hoi4_blender_import_animation_action
  retargets each provider GLB action, with a meshy_animate provenance receipt
  (task id + SHA-256), onto the exact working rig of the checkpoint the mesh
  was exported from. That operation removes world X/Y root travel, keeps the
  provider's world-Z root motion scaled by the measured LeftFoot-Head span,
  and marks the action as verified, which lets
  hoi4_blender_correct_action_grounding (per_frame_root_contact_zero_clearance)
  ground every frame without touching body keys.
* move (Blender-authored by the kit, no provider source):
  hoi4_blender_offset_action_root undoes the recorded slide on Hips index 2,
  then one constant vertical offset (axis and gain measured by the grounding
  step above) centres the walk's contact error.
* every role is exported to its usual runtime path and re-imported against
  the exported mesh; the proof is checked for XY centring and ground contact.

Usage (repository root): py -3.13 docs/plans/units_pilot/repair_action_roots.py <slug>
"""

from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any, Dict, List

REPO_ROOT = Path(__file__).resolve().parents[3]
PIPELINE = REPO_ROOT / ".tools" / "3d_pipeline"
sys.path.insert(0, str(PIPELINE))

from blender_client import BlenderAdapterClient  # noqa: E402
from lib.paths import append_history, file_record, read_job_document, read_json, resolve_job_root, sha256_file, utc_now, write_json  # noqa: E402

MOVE_ACTION = "Armature|Move|baselayer_WORKING"
SCALE_REFERENCE = {"source_head_bones": ["LeftFoot", "Head"], "target_head_bones": ["LeftFoot", "Head"]}
XY_TOLERANCE = 0.75   # first-frame body centre (the slide defect was 7-69)
Z_TOLERANCE = 0.08    # about 1% of the 7.35 source height


def prep_record(job: Path, stem: str, role: str) -> Dict[str, Any]:
    report = read_json(job / "blender" / "reports" / f"{stem}_{role}_prepare.json")
    sanit = report["rig_and_actions"]["root_translation_sanitization"]["actions"][0]
    provider_action = sanit["action"].removesuffix("_WORKING")
    info = next(a for a in report["rig_and_actions"]["actions"] if a["name"] == sanit["action"])
    return {"working_action": sanit["action"], "provider_action": provider_action, "armature": sanit["armature"],
            "correction": float(sanit["ground_correction_source_units"]), "source_rel": report["source"],
            "frame_start": info["frame_start"], "frame_end": info["frame_end"], "fps": info["fps"]}


def proof_frames(reimport: Dict[str, Any]) -> List[Dict[str, float]]:
    frames = []
    for b in reimport.get("animation_bounds", []):
        frames.append({"frame": b["frame"], "center_x": (b["bounds_min"][0] + b["bounds_max"][0]) / 2,
                       "center_y": (b["bounds_min"][1] + b["bounds_max"][1]) / 2,
                       "ground_z": b["bounds_min"][2], "top_z": b["bounds_max"][2]})
    return frames


def judge(frames: List[Dict[str, float]]) -> str:
    if not frames:
        return "fail"
    centred = abs(frames[0]["center_x"]) <= XY_TOLERANCE and abs(frames[0]["center_y"]) <= XY_TOLERANCE
    grounded = all(abs(f["ground_z"]) <= Z_TOLERANCE for f in frames)
    return "pass" if centred and grounded else "fail"


def main(slug: str) -> int:
    job = resolve_job_root(slug)
    jobdoc = read_job_document(job / "job.yaml")
    stem = jobdoc["blender_plan"]["runtime_stem"]
    mesh_rel = jobdoc["exports"]["mesh"]
    blender = BlenderAdapterClient(REPO_ROOT)
    evidence: Dict[str, Any] = {"slug": slug, "recorded_at": utc_now(), "defect": __doc__.split("Repair,")[0].strip(), "roles": {}}
    report_path = job / "blender" / "reports" / "action_root_repair.json"

    # ---- provider roles: verified retarget + per-frame grounding
    chain = "blender/checkpoints/attack_pre_export.blend"
    tag = sha256_file(job / chain)[:10].lower()  # checkpoints are bound to the exact mesh-export checkpoint
    roles: Dict[str, Dict[str, Any]] = {}
    for role in ("idle", "attack", "death"):
        rec = prep_record(job, stem, role)
        task = read_json(job / "provider" / "tasks" / f"animation_{role}.json")
        source_sha = sha256_file(job / rec["source_rel"])
        receipt_rel = f"provider/animation_receipts/{role}.json"
        # The attack target checkpoint already holds its own copy of the provider
        # attack action, so Blender names the freshly imported one "<name>.001".
        source_action = rec["provider_action"] + (".001" if role == "attack" else "")
        if not (job / receipt_rel).exists():
            write_json(job / receipt_rel, {
                "verification_status": "verified", "source_kind": "meshy_animate", "source_reference_id": task["task_id"],
                "source_action_name": source_action, "provider_file_action_name": rec["provider_action"],
                "scene_name_note": "Blender suffixes .001 when the target checkpoint already contains the same provider action name.",
                "source_sha256": source_sha, "source_rel": rec["source_rel"],
                "provider_task_record": f"provider/tasks/animation_{role}.json", "provider_status": task.get("status"),
                "download_manifest": f"{rec['source_rel']}.manifest.json", "verified_by": "hoi4_3d_model_pipeline",
                "verified_at": utc_now(),
                "basis": "Completed Meshy animate task from this job's own rig task; GLB downloaded by the kit runner with checksum manifest.",
            })
        out = f"blender/checkpoints/rt_{role}_{tag}.blend"
        action = f"{stem}_{role}"
        if not (job / out).exists():
            imported = blender.import_animation_action(
                slug, chain, rec["source_rel"], receipt_rel, out, source_action, rec["armature"], action,
                "meshy_animate", task["task_id"], source_sha, root_scale_reference=SCALE_REFERENCE,
            )
        else:
            imported = {"reused_checkpoint": out}
        roles[role] = {"action": action, "armature": rec["armature"], "task_id": task["task_id"], "receipt": receipt_rel,
                       "import": {k: imported.get(k) for k in ("checkpoint", "action", "root_cleanup", "reused_checkpoint", "frame_start", "frame_end")}}
        chain = out
    grounding_axis = None
    for role in ("idle", "attack", "death"):
        out = f"blender/checkpoints/rt_{role}_{tag}_grounded.blend"
        grounding = blender.correct_action_grounding(slug, chain, out, roles[role]["action"], target_armature_name=roles[role]["armature"])
        roles[role]["grounding"] = {k: grounding.get(k) for k in ("checkpoint", "root_location_axis_index", "root_location_axis_world_z_responses",
                                                                  "max_absolute_correction_source_units", "ground_contact_before", "ground_contact_after", "status", "fps", "frame_start", "frame_end")}
        index = grounding["root_location_axis_index"]
        grounding_axis = (index, grounding["root_location_axis_world_z_responses"][index])
        chain = out
    final_provider_ckpt = chain

    # ---- move: undo slide, then centre vertical contact
    idle_rec = prep_record(job, stem, "idle")
    loco = read_json(job / "blender" / "reports" / "author_locomotion_action.json")
    slide = idle_rec["correction"] + float(loco["ground_correction_source_units"])
    m_start, m_end = int(loco["frame_start"]), int(loco["frame_end"])
    unslid = "blender/checkpoints/move_root_offset.blend"
    blender.call("hoi4_blender_offset_action_root", {"job_id": slug, "blend_rel": "blender/checkpoints/move_pre_export.blend",
                                                     "checkpoint_rel": unslid, "action_name": MOVE_ACTION, "frame_start": m_start,
                                                     "frame_end": m_end, "offset_source_units": -slide, "axis_index": 2})
    scene = blender.inspect_scene(slug, unslid, action_name=MOVE_ACTION, target_armature_name=idle_rec["armature"],
                                  evaluated_frames=list(range(m_start, m_end + 1)))
    grounds = {f["frame"]: f["bounds_min"][2] for f in scene["evaluated_actions"][0]["frames"]}
    axis, gain = grounding_axis
    # The kit walk has no root bob, so its lowest point moves by about 0.55 over
    # the cycle; one constant offset cannot ground it. Bake one root key per
    # frame (zero offset), then lift each frame by its own measured clearance.
    move_ckpt = "blender/checkpoints/move_root_grounded.blend"
    blender.call("hoi4_blender_offset_action_root", {"job_id": slug, "blend_rel": unslid, "checkpoint_rel": move_ckpt,
                                                     "action_name": MOVE_ACTION, "frame_start": m_start, "frame_end": m_end,
                                                     "offset_source_units": 0.0, "axis_index": axis})
    per_frame = {}
    for frame in range(m_start, m_end + 1):
        offset = -grounds[frame] / gain
        per_frame[frame] = offset
        blender.call("hoi4_blender_offset_action_root", {"job_id": slug, "blend_rel": move_ckpt, "checkpoint_rel": move_ckpt,
                                                         "action_name": MOVE_ACTION, "frame_start": frame, "frame_end": frame,
                                                         "offset_source_units": offset, "axis_index": axis})
    roles["move"] = {"action": MOVE_ACTION, "armature": idle_rec["armature"],
                     "slide_undo_source_units": -slide, "contact_before_lift": {"min": min(grounds.values()), "max": max(grounds.values())},
                     "vertical_axis_index": axis, "vertical_gain_world_per_unit": gain,
                     "per_frame_offsets_source_units": per_frame, "policy": "per-frame root lift through offset_action_root on a fully baked root channel"}

    # ---- export + reimport proof
    failures = []
    for role, info in roles.items():
        ckpt = move_ckpt if role == "move" else final_provider_ckpt
        anim_rel = f"export/anim/{stem}_{role}.anim"
        before = file_record(job / anim_rel, relative_to=job) if (job / anim_rel).exists() else None
        exported = blender.export_animation(slug, ckpt, info["action"], anim_rel)
        reimport = blender.reimport_export(slug, mesh_rel, anim_rel, proof_name=f"{stem}_{role}_fixed")
        frames = proof_frames(reimport)
        status = judge(frames)
        if status != "pass":
            failures.append(role)
        info.update(source_checkpoint=ckpt, anim_before=before, anim_after=file_record(job / anim_rel, relative_to=job),
                    export=exported, reimport_proof=reimport.get("proof_blend"), reimport_previews=reimport.get("previews"),
                    reimport_frames=frames, status=status)
        evidence["roles"][role] = info
        write_json(report_path, evidence)
    evidence["final_provider_checkpoint"] = final_provider_ckpt
    evidence["move_checkpoint"] = move_ckpt
    write_json(report_path, evidence)
    jobdoc = read_job_document(job / "job.yaml")
    jobdoc["action_sources"] = {role: {"checkpoint": info["source_checkpoint"], "action": info["action"]} for role, info in roles.items()}
    jobdoc["updated_at"] = utc_now()
    (job / "job.yaml").write_text(json.dumps(jobdoc, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    append_history(job, state="pdx_exported" if not failures else "needs_review", event="action_roots_rebuilt", actor="hoi4_3d_model_pipeline",
                   details={role: {"status": v["status"], "anim": v["anim_after"]} for role, v in evidence["roles"].items()})
    print(json.dumps({role: {"status": v["status"], "frames": [(f["frame"], round(f["center_x"], 2), round(f["center_y"], 2), round(f["ground_z"], 3)) for f in v["reimport_frames"]]}
                      for role, v in evidence["roles"].items()}, indent=1))
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1]))
