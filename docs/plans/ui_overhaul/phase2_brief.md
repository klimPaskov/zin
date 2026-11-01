# UI overhaul phase 2 and 3: common brief for every lane

Every phase 2 (W) and phase 3 (I) lane agent reads this file first, then its lane row in `02_plan.md`.

## Read first

- `CLAUDE.md` (project rules), `docs/plans/ui_overhaul/02_plan.md` (lanes, checks, review steps), `docs/plans/ui_overhaul/01_audit.md` (the defects per window), `docs/specs/07_interface/07_design_system.md` (accepted under K69 and K70: tokens, themes, components, check thresholds), and the phase 1 handoffs in `docs/plans/ui_overhaul/handoffs/` (C1, C2, C3).
- Owner decisions: K69 (layouts may be rebuilt; themes per area; almost every focus its own icon; "all surfaces must be changed", next to nothing of vanilla stays visible, and every vanilla element kept is listed with its reason) and K70 (Banner Hall: top bar, Aoaz bar, frontend, military; Chancery: politics, diplomacy, decisions, events, court and realm panels; Chronicle: research, technology, doctrines, the focus tree, the Chronicle, lore; neutral: tooltips, dialogs, buttons) in `docs/specs/INTEGRATION_DECISIONS.md`.
- Skills: `hoi4-scripted-gui` for any window; `hoi4-feature-assets` and `hoi4-character-art-direction` for art; `hoi4-decisions-missions` if a window changes gameplay controls.

## Tools and commands

- Build and test: from the mod root, `bash "C:/Users/klimp/AppData/Local/Temp/claude/C--Users-klimp-OneDrive-Documents-Paradox-Interactive-Hearts-of-Iron-IV-mod-zin/6d26876d-fb43-42f0-9f17-1cf27cba23b2/scratchpad/verify.sh" <label>` with a short label (two to four letters, your lane id). It builds into a private staged tree and runs the suite. Two flag tests in `build.test.mjs` may fail while the flag work is in flight; every other failure is yours to fix.
- Render harness: `node tools/content/ui_review.mjs` (196 renders, contact sheets, text metrics; see the phase 0 handoff). Set its TEMP inside your own folder under the scratchpad, never the shared default; check 19 failed when TEMP pointed at an emptied folder.
- MCP (mandatory for GUI work): call the released server with `HOI4_RT=runtime-v461 node "<scratchpad>/mcp_call.mjs" <call.json> <out.json>`, where `<scratchpad>` is the path above without `verify.sh` and `call.json` is `{ "tool": "hoi4.gui_inspect" | "hoi4.gui_render" | ..., "arguments": { ... } }`. Inspect a schema with `node "<scratchpad>/mcp_schema.mjs"`. Inspect and render before editing, render after every meaningful change, look at the images yourself, fix and rerender.
- Images: `GPTIMAGE_MODEL=gpt-6-luna IMAGEGEN_CONCURRENCY=3 node tools/content/imagegen.mjs <jobs.json>`. Never gpt-6-astra. The runner holds a lock file: if it exits with "another imagegen process holds the image route", another lane is generating; wait a few minutes in the background and retry. Never delete the lock of a live process, never kill node processes by pattern (only your own pid). If you see a 401 or token error, stop all image work and report at once. Record every generation and review in both `art/source/provenance.jsonl` and the art store's `jobs/provenance.jsonl` (art store: `C:/Users/klimp/Documents/Projects/hoi4-agent-tools/.tmp/zin-art`); both logs are shared by every lane, so only ever append lines to them, never rewrite or filter the file (a rewrite on 31 October dropped another lane's lines); generation references never point inside the mod folder (copy references to `<art store>/raw/...` byte-identically).

## Rules

- Own only the files of your lane row. If you must touch another file, keep the change minimal and list it in your handoff.
- Shared checkout: never `git add -A`, stash, reset, checkout or commit; the lead commits. Never `sed -i`; use the Edit and Write tools.
- Content is generated: change the builder modules and data under `tools/content/`, not the mod's output files by hand.
- Localisation UTF-8 with BOM; player text describes the world, never implementation history.
- No placeholders presented as done. Anything left vanilla is listed with its reason.
- Do not launch or capture the Windows game. Linux captures are the lead's.

## Done for a lane

1. Before and after renders at the four resolutions and the states the plan lists, contact sheet in `docs/plans/ui_overhaul/renders/<lane>/`, the text metrics, and the check deltas (checks 10 to 19) for your windows.
2. A handoff in `docs/plans/ui_overhaul/handoffs/<lane>.md`: files changed, identifiers, art generated, check deltas, what is left vanilla and why, risks, what only the Linux run can confirm.
3. Your rows in `docs/plans/zin-lead/TRACKER.md` updated.
4. The verify run green apart from the allowed flag tests.
5. Report to the lead briefly: done, deltas, open items.
