"""Finish a humanoid job with the kit's continue_humanoid and an export-safe triangle target.

Kit defect worked around here (no kit file is edited): run_pilot.py
continue_humanoid prepares every humanoid checkpoint at the profile's
30,000-triangle working target and exports the attack checkpoint as one PDX
stream of 89,997 triangle-index entries, which the adapter's export_mesh
correctly refuses (65,535 ceiling). The guide's partition operation
(hoi4_blender_partition_skeletal_mesh_export_batches) cannot run on these
checkpoints: the working armature carries the glTF importer's NLA track and
the promotion fingerprint refuses NLA scenes ("Promotion does not support
driver/NLA proof scenes.").

So this driver runs the kit's own continue_humanoid unchanged, except that
each prepare_candidate call uses a 21,000-triangle working target
(63,000 index entries, one stream). That is a controlled reduction inside the
humanoid profile's preferred 12,000-50,000 range, which the profile allows.

Paid stages are never repeated: continue_humanoid reuses every recorded
provider task. Run only after the kit runner's candidate stage succeeded.

Usage (repository root):
    py -3.13 docs/plans/units_pilot/run_humanoid_continuation.py <slug>
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]
PIPELINE = REPO_ROOT / ".tools" / "3d_pipeline"
sys.path.insert(0, str(PIPELINE))

import run_pilot  # noqa: E402
from blender_client import BlenderAdapterClient  # noqa: E402
from lib.paths import append_history, resolve_job_root  # noqa: E402

EXPORT_SAFE_TRIANGLES = 21000  # 63,000 triangle-index entries < 65,535 per PDX stream
_original_prepare = BlenderAdapterClient.prepare_candidate


def _export_safe_prepare(self, job_id, **kwargs):
    requested = int(kwargs.get("target_triangles") or 0)
    if requested == 0 or requested > EXPORT_SAFE_TRIANGLES:
        kwargs["target_triangles"] = EXPORT_SAFE_TRIANGLES
    return _original_prepare(self, job_id, **kwargs)


BlenderAdapterClient.prepare_candidate = _export_safe_prepare


def main(slug: str) -> int:
    configs = run_pilot.load_job_configs(REPO_ROOT / "docs" / "plans" / "units_pilot" / "3d_jobs.json")
    spec = configs[slug]
    run_pilot.require_route_ready(spec)
    run_pilot.require_reference_approval(spec)
    job = resolve_job_root(slug)
    if not (job / "blender" / "reports" / f"{spec['runtime_stem']}_candidate_prepare.json").is_file():
        raise RuntimeError("Run the kit runner's candidate stage first.")
    run_pilot.initialize_one(spec)
    append_history(job, state="continuation", event="export_safe_triangle_target", actor="hoi4_3d_model_pipeline",
                   details={"target_triangles": EXPORT_SAFE_TRIANGLES, "reason": "single PDX stream must stay within 65,535 triangle-index entries"})
    run_pilot.continue_humanoid(spec)
    print(json.dumps({"slug": slug, "exports": run_pilot.read_job(job).get("exports")}, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1]))
