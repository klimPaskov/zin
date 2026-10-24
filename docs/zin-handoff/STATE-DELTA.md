# State delta

Differences between the handoff package (written 24 October 2026) and the workspace as inspected by the implementation session on 24 October 2026, before any change.

## Checked and unchanged

| Item | Package | Inspected 24 October 2026 (implementation session) |
| --- | --- | --- |
| Mod head | `394574a` on `master` | `9b9205f` "Add the ZIN implementation handoff package" on top of `394574a`; the only new commit is the package itself |
| Mod working tree | 84 modified, 221 untracked | 84 modified, 221 untracked (305 paths); the same slices as 01, section 1.4 |
| Mod test suite | 1,058 tests, 1,056 pass, 2 fail | 1,058 tests, 1,056 pass, 2 fail: "The build is deterministic" and "C3: no loaded file ... names a definition that no loaded file defines" |
| Tool repository | branch `claude/zin-map-pipeline-phase1`, package 4.3.0 | same; head `9ed6351`; working tree clean |
| PR 36 | open, CI green | open, mergeable, 5 checks SUCCESS |
| Worktree C8 `claude/map-climate-biome-colour` | 29 uncommitted files | 29 uncommitted files, head `9ed6351` |
| Worktree C11 `claude/map-territory-service` | WIP `cd1b36d` plus 10 uncommitted | same |
| Worktree C12/C13 `claude/map-straits-ports-names` | `0b02651`, `0d6ab84`, clean | same, clean |
| Older merged worktrees | five | five present (`map-relief-hydrology`, `map-feature-partition`, `map-geography-input`, `map-border-naturalness`, `map-phase0-water-colour-edge`) |
| Installed MCP runtime | `runtime-v430` (unverified) | present; `~/.claude.json` registers `runtime-v430/node_modules/hoi4-agent-tools/dist/bin/stdio.js`; config `modRoots` is the HOI4 `mod` folder |
| Branding files of R-90 | five files | all five present |
| Drawings folder | 67 photos plus `Horos/` | 68 entries (67 photos plus `Horos/`) |
| Regional map sheets | 13 plus the full map | 13 folders plus `Erdae Full Colored Map.png` |
| Lore vault copy | byte-identical | `diff -rq` reports no difference |
| Private originals | ignored by git | `docs/reference/originals/` and `docs/lore/vault/Maps/` are ignored (`.gitignore` lines 8 and 32) |

## Material differences

1. **MCP validators work from the lead session.** `hoi4_script_validate` and `hoi4_map_inspect` resolve the workspace `mod_zin_86bac5c64231` without `WORKSPACE_CONTEXT_NOT_FOUND`. The 19 October failure was in agent sessions; it may still affect subagents and stays in the worker backlog as a request to verify, not as a confirmed defect.
2. **The current in-mod map** (old generated map) has 7,109 province definitions, 1,332 states, 275 strategic regions and 186 ports at 5,120 x 2,560 (`hoi4_map_inspect`, revision `be0f51a8...`).
3. **Meshy MCP is not connected in this session**: the `meshy` server failed with `CONNECT_TIMEOUT` after 30 s. 3D generation (R-94) is blocked until it connects; the owner can retry the connection.
4. **Several finished slices have tests that `npm test` does not run**: `events_world.test.mjs`, `mech_court.test.mjs`, `mech_journey.test.mjs`, `mech_powers.test.mjs` are untracked and not listed in `tools/package.json` `scripts.test`. Their pass counts in 01, section 1.4 are agent reports, still to be re-run by the lead.
5. No owner answers to 01, section 7 had arrived when this file was written.
