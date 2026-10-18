"""Write runtime/handoff.md, runtime/crosswalk.md and manifest.md for one unit from recorded evidence.

Usage (repository root): py -3.13 docs/plans/units_pilot/write_handoff.py <slug>
Reads only job evidence; writes only the three files inside the job root.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(REPO_ROOT / ".tools" / "3d_pipeline"))
from lib.paths import file_record, read_job_document, read_json, resolve_job_root  # noqa: E402

ROLE_ORDER = ("idle", "move", "attack", "defend", "retreat", "death")


def main(slug: str) -> int:
    job = resolve_job_root(slug)
    jd = read_job_document(job / "job.yaml")
    stem = jd["blender_plan"]["runtime_stem"]
    registry = read_json(REPO_ROOT / "docs/plans/units_pilot/3d_jobs.json")["jobs"][slug]
    tasks = {p.stem: read_json(p) for p in sorted((job / "provider/tasks").glob("*.json"))}
    credits = {p.name.replace("_reconciliation.json", ""): read_json(p) for p in sorted((job / "provider/credits").glob("*_reconciliation.json"))}
    repair = read_json(job / "blender/reports/action_root_repair.json") if (job / "blender/reports/action_root_repair.json").exists() else {"roles": {}}
    extra = read_json(job / "blender/reports/extra_roles_evidence.json") if (job / "blender/reports/extra_roles_evidence.json").exists() else None
    mesh_rel = jd["exports"]["mesh"]
    mesh_txt = (job / mesh_rel).with_suffix(".txt").read_text(encoding="utf-8")
    objects = re.findall(r"^    ([^\s:][^:]*):\s*$", mesh_txt.split("locator:")[0], flags=re.M)
    textures = {k: re.search(rf"{k} \(str, 1\):\s*\['([^']+)'\]", mesh_txt).group(1) for k in ("diff", "spec", "n")}
    shader = re.search(r"shader \(str, 1\):\s*\['([^']+)'\]", mesh_txt).group(1)
    tris = re.search(r"tri \(int, (\d+)\)", mesh_txt)
    verts = re.search(r"\bp \(float, (\d+)\)", mesh_txt)
    anims = {}
    for role in ROLE_ORDER:
        rel = f"export/anim/{stem}_{role}.anim"
        if (job / rel).exists():
            anims[role] = file_record(job / rel, relative_to=job)
    gate = read_json(job / "validation/provider_candidate_gate.json")
    plan = jd["blender_plan"]
    size_factor = registry.get("size_factor_vs_vanilla_infantry", 1.0)
    spent = sum(int(c.get("provider_consumed_credits") or 0) for c in credits.values())
    model_dir = f"gfx/models/units/zin/{stem}/"

    lines = [f"# {stem} runtime handoff", ""]
    have = [r for r in ROLE_ORDER if r in anims]
    missing = [r for r in ROLE_ORDER if r not in anims]
    status = "complete (model package)" if not missing else "partial: " + ", ".join(missing) + " blocked"
    lines += [f"Status: **{status}**. Runtime wiring, sound and counters are parent-owned and not done here.", ""]
    lines += ["## Provider lineage (Meshy 7 via the app-owned launcher)", "", "| Stage | Task id | Status | Credits |", "| --- | --- | --- | --- |"]
    for stage, t in tasks.items():
        c = credits.get(stage, {})
        lines.append(f"| {stage} | `{t.get('task_id')}` | {t.get('status')} | {c.get('provider_consumed_credits', '-')} |")
    lines += ["", f"Total credits for this unit: {spent}.", ""]
    lines += ["## Runtime files (copy from this job root; do not reference docs/assets at runtime)", "",
              "| File | Bytes | SHA-256 | Proposed runtime path |", "| --- | --- | --- | --- |"]
    mrec = file_record(job / mesh_rel, relative_to=job)
    lines.append(f"| `{mesh_rel}` | {mrec['bytes']} | `{mrec['sha256']}` | `{model_dir}{stem}.mesh` |")
    for role, rec in anims.items():
        lines.append(f"| `{rec['relative_path']}` | {rec['bytes']} | `{rec['sha256']}` | `{model_dir}{stem}_{role}.anim` |")
    for key, name, final in (("diff", textures["diff"], f"{stem}_diffuse.dds"), ("spec", textures["spec"], f"{stem}_specular.dds"), ("n", textures["n"], f"{stem}_normal.dds")):
        rec = file_record(job / "textures/dds" / name, relative_to=job)
        lines.append(f"| `{rec['relative_path']}` | {rec['bytes']} | `{rec['sha256']}` | `{model_dir}{final}` |")
    lines += ["", "## Mesh facts (parsed from the exported bytes' .txt dump)", "",
              f"- Objects / meshsettings name: {', '.join('`' + o + '`' for o in objects)} (index 0).",
              f"- Shader `{shader}`; material references inside the .mesh: diff `{textures['diff']}`, spec `{textures['spec']}`, n `{textures['n']}`.",
              f"- Triangle-index entries {tris.group(1) if tris else '?'}, position components {verts.group(1) if verts else '?'} (one stream, under 65,535).",
              f"- Source mesh height {plan['target_height_m']} (vanilla infantry source height x {size_factor}); entity scale {plan['runtime_entity_scale']}; effective runtime height {plan['effective_runtime_height_m']}.",
              "- Axes: +Z up, faces -Y, origin on the ground between the feet (same as western_european_infantry.mesh).",
              f"- Candidate gate: {gate['status']} ({gate['geometry']['triangles']} triangles at candidate stage, exported at 21,000).",
              "- Skeleton: Meshy humanoid rig, 24 bones (Hips root; Spine02, Spine01, Spine, neck, Head; shoulders/arms/forearms/hands; legs/feet/toes). No locator nodes: vanilla weapon attach points (Right_Hand_node etc.) do not exist on this skeleton; weapon attachments need bone-name attaches or new locators.",
              "", "## Proposed runtime identifiers (ZIN warfare spec 14.3)", "",
              f"- Sprite / asset id `{stem}`; entity `{stem}_entity` with `scale = {plan['runtime_entity_scale']}`; pdxmesh `{stem}_mesh`, `file = \"{model_dir}{stem}.mesh\"`.",
              f"- `meshsettings = {{ name = \"{objects[0] if objects else '?'}\" index = 0 texture_diffuse = \"{model_dir}{stem}_diffuse.dds\" texture_normal = \"{model_dir}{stem}_normal.dds\" texture_specular = \"{model_dir}{stem}_specular.dds\" shader = \"{shader}\" }}` (the .mesh itself names generic texture_0/texture_normal/texture_specular files, so either keep those names in the unit folder or override them as shown).",
              "", "| Entity state | Animation id | Animation type | Source |", "| --- | --- | --- | --- |"]
    for role in ROLE_ORDER:
        src = {"idle": "provider Meshy action 0, retargeted and grounded", "attack": "provider Meshy action 4, retargeted and grounded",
               "death": "provider Meshy action 8, retargeted and grounded", "move": "kit Blender walk, slide removed, per-frame grounded",
               "defend": "Blender phase patch of the grounded idle: guard raise (guard_start/hold/release), starts and ends on idle",
               "retreat": "Blender phase patch of the grounded move: hunched torso turning to look back, loop"}[role]
        if role in anims:
            lines.append(f"| {role} | `{role}` | `{stem}_{role}` | {src} |")
        else:
            lines.append(f"| {role} | - | - | blocked (see below) |")
    lines += [f"| support_attack | `attack` | `{stem}_attack` | reuse per warfare spec 14.2 step 6 |",
              f"| training | `idle` | `{stem}_idle` | reuse per warfare spec 14.2 step 6 |", ""]
    lines += ["Animation facts: all 24 fps, in place, world X/Y root travel removed, ground contact 0 at every proof frame.", ""]
    lines += ["| Role | Frames | Loop | Reimport proof frames (centre x, centre y, ground z, top z) |", "| --- | --- | --- | --- |"]
    for role, info in repair.get("roles", {}).items():
        fr = info.get("reimport_frames", [])
        loop = "yes" if role in ("idle", "move") else "no"
        span = f"{fr[0]['frame']}-{fr[-1]['frame']}" if fr else "?"
        sample = "; ".join(f"f{f['frame']}: {f['center_x']:.2f}, {f['center_y']:.2f}, {f['ground_z']:.3f}, {f['top_z']:.2f}" for f in fr)
        lines.append(f"| {role} | {span} | {loop} | {sample} |")
    if extra:
        for role in ("defend", "retreat"):
            step = next((s for s in extra["steps"] if s["step"] == f"{role}_export"), None)
            if step:
                fr = step["result"]["reimport"].get("animation_bounds", [])
                lines.append(f"| {role} | patched | {'yes' if role == 'retreat' else 'no'} | " + "; ".join(f"f{b['frame']}: ground {b['bounds_min'][2]:.3f}" for b in fr) + " |")
    lines += ["", "## QA notes", "",
              "- Reimport previews show a chrome-like material: io_pdx_mesh displays the packed specular alpha (glossiness) as Blender roughness. Runtime bytes are the PDX-packed maps (spec G=32 level, B metallic, A glossiness; normal in G/A).",
              "- Kit defects worked around (no kit edits): stream index budget (21,000-triangle export target), Hips root slide from index-2 grounding (provider actions re-imported through the verified retarget and per-frame grounded; move un-slid and per-frame lifted).",
              "- Attack is Meshy action 4 (an unarmed strike); there is no weapon yet. Weapon attachments are a later job (warfare spec open question 9).",
              ]
    if missing:
        lines += ["", "## Blocked", "",
                  "defend and retreat: `hoi4_blender_patch_existing_humanoid_action_phases` refuses every checkpoint of this route with "
                  "`Action phase patch requires existing animation data without drivers/NLA.` The glTF importer leaves an NLA track on the provider armature "
                  "and `duplicate_hierarchy` copies it to the working rig (`Armature.001`, track `Armature|<Action>|baselayer`). Until the kit clears those NLA "
                  "tracks, wire defend to `attack` and retreat to `move` as temporary aliases only if the parent accepts that; the worker does not count them as delivered.", ""]
    lines += ["## Not in this package", "", "- Sourced unit audio and bespoke counters (kit requirements for a complete custom unit) were outside this brief.", ""]
    (job / "runtime/handoff.md").write_text("\n".join(lines) + "\n", encoding="utf-8")

    cross = ["# " + stem + " requirement-to-runtime crosswalk", "", "| Requirement | Evidence | Runtime target | Status |", "| --- | --- | --- | --- |",
             f"| Geometry (Meshy 7) | provider/tasks/generation.json, validation/provider_candidate_gate.json | {model_dir}{stem}.mesh | exported, reimported |",
             f"| Scale calibration | blender/reports/{stem}_candidate_prepare.json (vanilla_reference) | entity scale {plan['runtime_entity_scale']} | measured |",
             f"| PDX material | blender/reports/textures_dds.json | {model_dir}{stem}_*.dds | packed |"]
    for role in ROLE_ORDER:
        cross.append(f"| Action {role} | blender/reports/action_root_repair.json / extra_roles_evidence.json | {model_dir}{stem}_{role}.anim | {'exported, reimported' if role in anims else 'blocked'} |")
    cross += ["| Entity, gfx, sound, counters | - | parent-owned | not started |", ""]
    (job / "runtime/crosswalk.md").write_text("\n".join(cross) + "\n", encoding="utf-8")

    man = [f"# {stem} model manifest", "", f"Status: {status}", "", "| Item | Value |", "| --- | --- |",
           f"| Profile | humanoid_unit; size factor {size_factor} |",
           "| Source mode | source_free_owner_rule; owner approval 2026-10-18 (refs/source/provenance.json) |",
           f"| Provider credits | {spent} |",
           f"| Mesh | {mesh_rel} ({mrec['bytes']} B, {mrec['sha256']}) |",
           f"| Animations | {', '.join(have)} |",
           f"| Blocked | {', '.join(missing) or 'none'} |",
           "| Sound / counters | outside this brief |", "", "See runtime/handoff.md."]
    (job / "manifest.md").write_text("\n".join(man) + "\n", encoding="utf-8")
    print(status)
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1]))
