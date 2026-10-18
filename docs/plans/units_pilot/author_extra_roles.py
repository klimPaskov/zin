"""Post-runner Blender step: defend and retreat for ZIN humanoid units.

The kit runner (run_pilot.py) delivers idle, attack and death from the one
Meshy action attempt per verified role and a Blender-authored move. Meshy has
no verified action id for defend or retreat, so the kit's recovery route is
Blender. This script uses only the verified adapter operation
hoi4_blender_patch_existing_humanoid_action_phases (explicit, SHA-bound,
non-destructive phase keys on a clone of an accepted action), then the kit's
export_animation and reimport_export operations.

  defend  : clone of the accepted idle; spine, neck, arms, forearms and hands
            raised into a guard (guard_start / guard_hold / guard_release),
            beginning and ending on the idle's own pose.
  retreat : clone of the accepted move loop; Spine02-Spine01-Spine-neck-Head
            chain hunched and twisted to look back over the shoulder while the
            legs keep walking; loop endpoints equal.

Bone rest orientations are not exposed by any read-only adapter call, so one
probe patch (evidence only, never exported) samples pose/basis matrices of
every keyed bone; rest matrices are solved from them and cross-checked
across phases. All rotations below are authored in world space and mapped
into each bone's local frame (Q_local = R_rest^T * D * R_rest), then
pre-multiplied onto the source key.

Usage (repository root): py -3.13 docs/plans/units_pilot/author_extra_roles.py <slug>
Writes only inside the job root. No provider calls.
"""

from __future__ import annotations

import json
import math
import sys
from pathlib import Path
from typing import Any, Dict, List, Tuple

REPO_ROOT = Path(__file__).resolve().parents[3]
PIPELINE = REPO_ROOT / ".tools" / "3d_pipeline"
sys.path.insert(0, str(PIPELINE))

from blender_client import BlenderAdapterClient  # noqa: E402
from lib.paths import append_history, file_record, read_job_document, read_json, resolve_job_root, sha256_file, utc_now, write_json  # noqa: E402

MOVE_ACTION = "Armature|Move|baselayer_WORKING"

# ---------------------------------------------------------------- math helpers
Mat3 = List[List[float]]
Quat = Tuple[float, float, float, float]  # w, x, y, z


def mat3(m4: List[List[float]]) -> Mat3:
    return [[float(m4[r][c]) for c in range(3)] for r in range(3)]


def mmul(a: Mat3, b: Mat3) -> Mat3:
    return [[sum(a[r][k] * b[k][c] for k in range(3)) for c in range(3)] for r in range(3)]


def mT(a: Mat3) -> Mat3:
    return [[a[c][r] for c in range(3)] for r in range(3)]


def orthonormal(a: Mat3) -> Mat3:
    cols = [[a[r][c] for r in range(3)] for c in range(3)]
    out = []
    for v in cols:
        for u in out:
            d = sum(x * y for x, y in zip(v, u))
            v = [x - d * y for x, y in zip(v, u)]
        n = math.sqrt(sum(x * x for x in v))
        out.append([x / n for x in v])
    return [[out[c][r] for c in range(3)] for r in range(3)]


def m4inv_rot(m4: List[List[float]]) -> Mat3:
    return mT(orthonormal(mat3(m4)))


def axis_angle(axis: str, degrees: float) -> Mat3:
    t = math.radians(degrees)
    c, s = math.cos(t), math.sin(t)
    if axis == "x":
        return [[1, 0, 0], [0, c, -s], [0, s, c]]
    if axis == "y":
        return [[c, 0, s], [0, 1, 0], [-s, 0, c]]
    return [[c, -s, 0], [s, c, 0], [0, 0, 1]]


def mat_to_quat(m: Mat3) -> Quat:
    tr = m[0][0] + m[1][1] + m[2][2]
    if tr > 0:
        s = math.sqrt(tr + 1.0) * 2
        q = (0.25 * s, (m[2][1] - m[1][2]) / s, (m[0][2] - m[2][0]) / s, (m[1][0] - m[0][1]) / s)
    elif m[0][0] > m[1][1] and m[0][0] > m[2][2]:
        s = math.sqrt(1.0 + m[0][0] - m[1][1] - m[2][2]) * 2
        q = ((m[2][1] - m[1][2]) / s, 0.25 * s, (m[0][1] + m[1][0]) / s, (m[0][2] + m[2][0]) / s)
    elif m[1][1] > m[2][2]:
        s = math.sqrt(1.0 + m[1][1] - m[0][0] - m[2][2]) * 2
        q = ((m[0][2] - m[2][0]) / s, (m[0][1] + m[1][0]) / s, 0.25 * s, (m[1][2] + m[2][1]) / s)
    else:
        s = math.sqrt(1.0 + m[2][2] - m[0][0] - m[1][1]) * 2
        q = ((m[1][0] - m[0][1]) / s, (m[0][2] + m[2][0]) / s, (m[1][2] + m[2][1]) / s, 0.25 * s)
    return qnorm(q)


def qmul(a: Quat, b: Quat) -> Quat:
    w1, x1, y1, z1 = a
    w2, x2, y2, z2 = b
    return (w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2, w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2,
            w1 * y2 - x1 * z2 + y1 * w2 + z1 * x2, w1 * z2 + x1 * y2 - y1 * x2 + z1 * w2)


def qnorm(q) -> Quat:
    n = math.sqrt(sum(v * v for v in q))
    return tuple(v / n for v in q)  # type: ignore[return-value]


def qdot(a: Quat, b: Quat) -> float:
    return sum(x * y for x, y in zip(a, b))


# ---------------------------------------------------------------- adapter I/O
class Unit:
    def __init__(self, slug: str):
        self.slug = slug
        self.job = resolve_job_root(slug)
        self.jobdoc = read_job_document(self.job / "job.yaml")
        self.stem = self.jobdoc["blender_plan"]["runtime_stem"]
        self.blender = BlenderAdapterClient(REPO_ROOT)
        self.evidence: Dict[str, Any] = {"slug": slug, "started_at": utc_now(), "steps": []}

    def log(self, name: str, value: Any) -> Any:
        self.evidence["steps"].append({"step": name, "result": value})
        write_json(self.job / "blender" / "reports" / "extra_roles_evidence.json", self.evidence)
        return value

    def scene(self, blend: str) -> Dict[str, Any]:
        return self.blender.inspect_scene(self.slug, blend)

    def channels(self, blend: str, rig: str, action: str) -> Dict[str, Any]:
        return self.blender.inspect_scene(
            self.slug, blend, action_name=action, target_armature_name=rig,
            include_action_channels=True, expected_source_sha256=sha256_file(self.job / blend),
        )

    def patch(self, blend: str, out: str, rig: str, src_action: str, dst_action: str, role: str,
              fps: int, fps_base: float, start: int, end: int, phases: Dict[str, int],
              patches: Dict[str, Any], chain: List[str], action_sha: str) -> Dict[str, Any]:
        report = self.job / "blender" / "reports" / (Path(out).stem + "_patch.json")
        if (self.job / out).exists() and report.exists():
            return read_json(report)
        result = self.blender.patch_existing_humanoid_action_phases(
            self.slug, blend, out, sha256_file(self.job / blend), action_sha, rig, src_action, dst_action,
            role, fps, fps_base, start, end, phases, sorted(patches), chain, patches,
        )
        write_json(report, result)
        return result


def source_quats(channel_report: Dict[str, Any]) -> Dict[str, Dict[int, Quat]]:
    rows = channel_report["action_channels"]["rows"]
    comps: Dict[str, Dict[int, Dict[int, float]]] = {}
    for row in rows:
        path = row["data_path"]
        if not path.endswith(".rotation_quaternion"):
            continue
        bone = path.split('"')[1]
        for key in row["keyframes"]:
            comps.setdefault(bone, {}).setdefault(int(round(key["co"][0])), {})[row["array_index"]] = float(key["co"][1])
    out: Dict[str, Dict[int, Quat]] = {}
    for bone, frames in comps.items():
        out[bone] = {f: (v[0], v[1], v[2], v[3]) for f, v in frames.items() if len(v) == 4}
    return out


def sample(qs: Dict[int, Quat], frame: int) -> Quat:
    if frame in qs:
        return qnorm(qs[frame])
    keys = sorted(qs)
    lo = max(k for k in keys if k <= frame)
    hi = min(k for k in keys if k >= frame)
    t = (frame - lo) / (hi - lo)
    a, b = qs[lo], qs[hi]
    return qnorm(tuple(x + (y - x) * t for x, y in zip(a, b)))


def action_info(scene: Dict[str, Any], name: str) -> Dict[str, Any]:
    return next(a for a in scene["rig_and_actions"]["actions"] if a["name"] == name)


# ---------------------------------------------------------------- rest solve
def solve_rest(phase_bones: Dict[str, Any], parents: Dict[str, Any]) -> Dict[str, Mat3]:
    """World-space rest rotation per bone from pose/world/basis samples."""
    rest: Dict[str, Mat3] = {}
    pending = set(phase_bones)
    while pending:
        progressed = False
        for name in sorted(pending):
            rec = phase_bones[name]
            world = orthonormal(mat3(rec["world"]))
            basis = orthonormal(mat3(rec["basis"]))
            parent = parents.get(name)
            if parent is None:
                rest[name] = mmul(world, mT(basis))
            elif parent in rest:
                pw = orthonormal(mat3(phase_bones[parent]["world"]))
                # world_b = world_p * rest_p^-1 * rest_b * basis_b  (rotation parts)
                rest[name] = mmul(mmul(rest[parent], mT(pw)), mmul(world, mT(basis)))
            elif parent not in phase_bones:
                raise RuntimeError(f"Parent {parent} of {name} was not sampled; cannot solve rest.")
            else:
                continue
            pending.discard(name)
            progressed = True
        if not progressed:
            raise RuntimeError(f"Unresolvable rest hierarchy: {sorted(pending)}")
    return rest


def local_delta(rest: Mat3, world_delta: Mat3) -> Quat:
    return mat_to_quat(mmul(mmul(mT(rest), world_delta), rest))


def compose(*mats: Mat3) -> Mat3:
    out = [[1.0, 0, 0], [0, 1.0, 0], [0, 0, 1.0]]
    for m in mats:
        out = mmul(out, m)
    return out


# ---------------------------------------------------------------- role design
def defend_pose(scale: float) -> Dict[str, Mat3]:
    """World-space guard deltas; character faces -Y, +Z up, left side +X."""
    s = scale
    return {
        "Spine02": axis_angle("x", 5 * s),
        "Spine01": axis_angle("x", 5 * s),
        "Spine": axis_angle("x", 3 * s),
        "neck": axis_angle("x", -7 * s),
        "LeftArm": compose(axis_angle("y", 18 * s), axis_angle("x", -58 * s)),
        "RightArm": compose(axis_angle("y", -18 * s), axis_angle("x", -58 * s)),
        "LeftForeArm": axis_angle("x", -78 * s),
        "RightForeArm": axis_angle("x", -78 * s),
        "LeftHand": axis_angle("x", -12 * s),
        "RightHand": axis_angle("x", -12 * s),
    }


def retreat_pose(scale: float) -> Dict[str, Mat3]:
    """Hunched torso twisting to look back over the left shoulder (+Z yaw)."""
    s = scale
    return {
        "Spine02": compose(axis_angle("z", 9 * s), axis_angle("x", 7)),
        "Spine01": compose(axis_angle("z", 11 * s), axis_angle("x", 6)),
        "Spine": compose(axis_angle("z", 11 * s), axis_angle("x", 3)),
        "neck": axis_angle("z", 14 * s),
        "Head": compose(axis_angle("z", 18 * s), axis_angle("x", -6)),
    }


def build_patches(qs: Dict[str, Dict[int, Quat]], rest: Dict[str, Mat3], frames: List[int],
                  pose_at: Dict[int, Dict[str, Mat3]]) -> Dict[str, Any]:
    patches: Dict[str, Any] = {}
    bones = sorted({b for p in pose_at.values() for b in p})
    for bone in bones:
        if bone not in qs:
            raise RuntimeError(f"Source action has no rotation keys for {bone}.")
        rows = []
        prev = None
        for f in frames:
            src = sample(qs[bone], f)
            delta = pose_at[f].get(bone)
            q = src if delta is None else qnorm(qmul(local_delta(rest[bone], delta), src))
            if prev is not None and qdot(q, prev) < 0:
                q = tuple(-v for v in q)
            prev = q
            rows.append({"frame": f, "value": [round(v, 12) for v in qnorm(q)]})
        patches[bone] = {"rotation_quaternion": rows}
    return patches


# ---------------------------------------------------------------- main flow
def main(slug: str) -> int:
    u = Unit(slug)
    stem = u.stem
    sources = u.jobdoc.get("action_sources") or {}
    if not {"idle", "move"} <= set(sources):
        raise RuntimeError("Run repair_action_roots.py first: job.yaml has no grounded action_sources for idle and move.")
    idle_blend, idle_action = sources["idle"]["checkpoint"], sources["idle"]["action"]
    move_blend, move_action = sources["move"]["checkpoint"], sources["move"]["action"]
    mesh_rel = f"export/mesh/{stem}.mesh"
    for rel in (idle_blend, move_blend, mesh_rel):
        if not (u.job / rel).is_file():
            raise FileNotFoundError(f"Grounded source missing: {rel}")

    idle_scene = u.log("inspect_idle_checkpoint", {k: v for k, v in u.scene(idle_blend).items() if k in ("rig_and_actions", "blend")})
    move_scene = u.log("inspect_move_checkpoint", {k: v for k, v in u.scene(move_blend).items() if k in ("rig_and_actions", "blend")})
    rigs = idle_scene["rig_and_actions"]["armatures"]
    if len(rigs) != 1:
        raise RuntimeError(f"Expected one armature in idle checkpoint: {rigs}")
    rig = rigs[0]["name"]
    if [r["name"] for r in move_scene["rig_and_actions"]["armatures"]] != [rig]:
        raise RuntimeError("Move checkpoint armature differs from idle checkpoint armature.")

    rig_report = u.job / "blender" / "reports" / "rig_source_inspection.json"
    if not rig_report.exists():
        src = "provider/downloads/rigged_provider_model.fbx"
        write_json(rig_report, u.blender.call("hoi4_blender_inspect_animation_source", {
            "job_id": slug, "source_rel": src, "source_sha256": sha256_file(u.job / src)}))
    parents = {b["name"]: b["parent"] for b in read_json(rig_report)["armatures"][0]["bones"]}

    # ---- idle source channels
    idle_ch = u.channels(idle_blend, rig, idle_action)
    idle_qs = source_quats(idle_ch)
    idle_info = action_info(idle_scene, idle_action)
    s, e = idle_info["frame_start"], idle_info["frame_end"]
    fps = int(idle_info["fps"])
    span = e - s
    d_phases = {"guard_start": s + round(span * 0.25), "guard_hold": s + round(span * 0.5), "guard_release": s + round(span * 0.8)}
    u.log("idle_source", {"action": idle_action, "range": [s, e], "fps": fps, "action_sha256": idle_ch["inspected_action_sha256"]})

    # ---- probe: sample every keyed bone to solve rest orientations (evidence only)
    probe_frames = sorted({s, *d_phases.values(), e})
    probe_patch: Dict[str, Any] = {}
    for bone in sorted(idle_qs):
        rows = []
        for i, f in enumerate(probe_frames):
            q = sample(idle_qs[bone], f)
            if bone == "LeftHand":
                q = qnorm(qmul(q, mat_to_quat(axis_angle("x", 2.0 + i))))
            rows.append({"frame": f, "value": [round(v, 12) for v in q]})
        probe_patch[bone] = {"rotation_quaternion": rows}
    probe = u.patch(idle_blend, str(Path(idle_blend).with_name("probe_rest_sampling.blend")).replace("\\", "/"), rig, idle_action,
                    f"{stem}_probe_rest_sampling", "defend", fps, 1.0, s, e, d_phases, probe_patch, [],
                    idle_ch["inspected_action_sha256"])
    rests = [solve_rest(probe["source_phases"][p]["bones"], parents) for p in d_phases]
    rest = rests[0]
    drift = max(abs(a[r][c] - b[r][c]) for other in rests[1:] for name in rest for a, b in [(rest[name], other[name])] for r in range(3) for c in range(3))
    u.log("rest_solve", {"bones": sorted(rest), "max_cross_phase_rest_drift": drift})
    if drift > 1e-3:
        raise RuntimeError(f"Rest solve inconsistent across phases (max drift {drift}).")

    results: Dict[str, Any] = {}

    # ---- defend
    d_frames = [s, d_phases["guard_start"], d_phases["guard_hold"], d_phases["guard_release"], e]
    pose_at = {s: {}, e: {}, d_phases["guard_start"]: defend_pose(0.8), d_phases["guard_hold"]: defend_pose(1.0), d_phases["guard_release"]: defend_pose(0.65)}
    for f in (s, e):
        pose_at[f] = {b: axis_angle("x", 0.0) for b in defend_pose(1.0)}
    defend_patch = build_patches(idle_qs, rest, d_frames, pose_at)
    defend_action = f"{stem}_defend"
    defend_out = str(Path(idle_blend).with_name("defend_pre_export.blend")).replace("\\", "/")
    results["defend"] = u.patch(idle_blend, defend_out, rig, idle_action, defend_action, "defend", fps, 1.0,
                                s, e, d_phases, defend_patch, [], idle_ch["inspected_action_sha256"])

    # ---- retreat
    move_ch = u.channels(move_blend, rig, move_action)
    move_qs = source_quats(move_ch)
    move_info = action_info(move_scene, move_action)
    ms, me = move_info["frame_start"], move_info["frame_end"]
    mfps = int(move_info["fps"])
    r_phases = {"disengage": ms + round((me - ms) * 0.25), "withdrawal": ms + round((me - ms) * 0.5), "recovery": ms + round((me - ms) * 0.75)}
    r_frames = [ms, r_phases["disengage"], r_phases["withdrawal"], r_phases["recovery"], me]
    twist = {ms: 0.7, r_phases["disengage"]: 1.0, r_phases["withdrawal"]: 0.7, r_phases["recovery"]: 1.0, me: 0.7}
    r_pose = {f: retreat_pose(twist[f]) for f in r_frames}
    retreat_patch = build_patches(move_qs, rest, r_frames, r_pose)
    if retreat_patch and any(rows["rotation_quaternion"][0]["value"] != rows["rotation_quaternion"][-1]["value"] for rows in retreat_patch.values()):
        for rows in retreat_patch.values():  # loop endpoints must be identical
            rows["rotation_quaternion"][-1]["value"] = list(rows["rotation_quaternion"][0]["value"])
    chain = ["Spine02", "Spine01", "Spine", "neck", "Head"]
    retreat_action = f"{stem}_retreat"
    retreat_out = str(Path(move_blend).with_name("retreat_pre_export.blend")).replace("\\", "/")
    u.log("move_source", {"action": move_action, "range": [ms, me], "fps": mfps, "action_sha256": move_ch["inspected_action_sha256"]})
    results["retreat"] = u.patch(move_blend, retreat_out, rig, move_action, retreat_action, "retreat", mfps, 1.0,
                                 ms, me, r_phases, retreat_patch, chain, move_ch["inspected_action_sha256"])

    # ---- previews, export, reimport
    exports: Dict[str, Any] = {}
    for role, out, action, frames in (
        ("defend", defend_out, defend_action, [s, d_phases["guard_hold"], e]),
        ("retreat", retreat_out, retreat_action, [ms, r_phases["disengage"], r_phases["withdrawal"]]),
    ):
        previews = []
        for f in frames:
            shot = u.blender.inspect_scene(u.slug, out, render_previews=True, runtime_stem=f"{role}_f{f:03d}",
                                           action_name=action, target_armature_name=rig, preview_frame=f,
                                           preview_view_names=["front", "left"])
            previews.append({"frame": f, "previews": shot.get("previews")})
        anim_rel = f"export/anim/{stem}_{role}.anim"
        exported = u.blender.export_animation(u.slug, out, action, anim_rel)
        reimport = u.blender.reimport_export(u.slug, mesh_rel, anim_rel, proof_name=f"{stem}_{role}")
        exports[role] = {
            "source_checkpoint": out, "action": action, "anim": file_record(u.job / anim_rel, relative_to=u.job),
            "export": exported, "reimport": reimport, "previews": previews,
            "patch": {k: results[role].get(k) for k in ("checkpoint", "output_sha256", "target_action_sha256", "phase_frames",
                                                          "frame_range", "source_fps", "changed_bones", "motion_bone_chain", "semantic_role")},
        }
        u.log(f"{role}_export", exports[role])

    job_doc = read_job_document(u.job / "job.yaml")
    anims = dict(job_doc.get("exports", {}).get("animations", {}))
    anims.update({role: f"export/anim/{stem}_{role}.anim" for role in exports})
    job_doc.setdefault("exports", {})["animations"] = anims
    job_doc["exports"]["role_mapping"] = {"support_attack": "attack", "training": "idle"}
    job_doc["extra_roles_route"] = "blender patch_existing_humanoid_action_phases (no verified Meshy action id for defend/retreat)"
    job_doc["updated_at"] = utc_now()
    (u.job / "job.yaml").write_text(json.dumps(job_doc, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    append_history(u.job, state="pdx_exported", event="extra_roles_exported", actor="hoi4_3d_model_pipeline",
                   details={role: {"anim": v["anim"], "action": v["action"]} for role, v in exports.items()})
    print(json.dumps({role: v["anim"] for role, v in exports.items()}, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1]))
