# 03. The dedicated Opus MCP worker

## 1. One worker, one owner

The implementation session starts **one separate, dedicated worker using an Opus model** for the whole implementation. The worker owns development of the MCP server, HOI4 Agent Tools, and the tooling improvements ZIN needs. The lead owns ZIN: development, worldbuilding, game content, presentation, integration and overall delivery.

**Model.** On 24 October 2026 the environment lists Opus 5.5 with the model id `claude-opus-5-5` (the Agent tool accepts the alias `opus`). The lead checks what the environment actually offers when launching, uses an Opus model that is really available, and records the exact model id in the request record (section 3). The lead never invents a model id and never substitutes another model silently. If no Opus worker can be launched, the lead reports the limitation and what setup is needed, and does not claim a worker exists.

**How to launch (in order of preference).**
1. A separate, user-visible session in the HOI4 Agent Tools repository (`C:/Users/klimp/Documents/Projects/hoi4-agent-tools`) with the Opus model, started from the desktop app's session tool or with the CLI (`claude --model claude-opus-5-5` in that folder), given [prompts/MCP_WORKER_OPUS.md](prompts/MCP_WORKER_OPUS.md) as its first message. A session survives the lead's context resets and the owner can watch it.
2. If separate sessions are unavailable: a background agent with model `opus` in its own git worktree of the tool repository, given the same prompt, continued with messages (never restarted fresh while it has context).

## 2. Ownership boundaries

| Area | Owner | Rule |
| --- | --- | --- |
| `hoi4-agent-tools` source, tests, schemas, ADRs, docs, changelog, `server.json`, releases | worker | the lead never edits these files; the lead may read them |
| The worker's branches and worktrees in the tool repository | worker | branch per change, `npm run check` before merge, PR, merge only with CI green (the repository's `AGENTS.md`) |
| The installed runtime the clients use (`C:/Users/klimp/AppData/Local/hoi4-agent-tools/runtime-v<NNN>/`, `C:/Users/klimp/AppData/Roaming/hoi4-agent-tools/config.json`, registrations in `~/.claude.json` and `~/.codex/config.toml`) | worker, coordinated | install each release into a fresh prefix; back up both registrations before editing; announce before switching (section 6) |
| The ZIN repository (content, data, specs, the politics step, the Linux harness) | lead | the worker reads it and may run the server against a **copy** or a dedicated test workspace; it does not edit ZIN files |
| ZIN map files written by MCP rewrites (`map/`, `history/states/`, `.hoi4-agent-world.json`) | lead | the lead runs the rewrite calls; the worker fixes the tools that produce them |
| The main checkout of the tool repository (`C:/Users/klimp/Documents/Projects/hoi4-agent-tools` itself) | worker, coordinated | the mod's `apply.mts` imports the atomic rewrite engine from this checkout, so it runs whatever branch is checked out there (`claude/zin-map-pipeline-phase1` on 24 October). The worker develops only in worktrees, keeps the main checkout on a stable, tested branch (normally `main` after merges), and tells the lead before switching it |
| The shared request record | both | the lead adds requests and verification results; the worker updates status and implementation references |

## 3. The request record

File: `docs/plans/zin-requests.md` in the HOI4 Agent Tools repository (create it at the start; it survives context changes and interruptions; commit it on the worker's integration branch regularly). One section per request:

```
## ZR-<number>: <short title>
- Opened: <date> by lead | worker (proactive)
- Priority: P0 blocks ZIN work now | P1 needed this tranche | P2 improves speed or quality | P3 later
- ZIN task: <what the lead was doing, with the ZIN requirement id (R-xx)>
- Tool or workflow: <tool name, operation, parameters>
- Inputs and reproduction: <workspace, files, exact call, seed>
- Current behaviour: <output, errors, timings, memory>
- Required capability or improvement: <what must change>
- Evidence: <logs, diagnostics, measurements, file paths>
- Impact: <what is blocked or slowed, how much>
- Acceptance: <how to tell it works: a test, a measurement, a ZIN call that must succeed>
- Status: open | in progress | in review | merged | released | verified in ZIN | rejected (reason)
- Implementation: <branch, commits, PR, release version>
- Verification: <worker tests; then the lead's ZIN run result>
- Remaining integration work: <what the lead still has to do>
```

The lead writes a request whenever ZIN work shows that a tool lacks a capability, gives wrong results, needs awkward repeated steps, gives poor diagnostics or could finish a task faster. The lead keeps working on independent ZIN tasks while a request is in progress.

## 4. Responsibilities

### 4.1 Backlog at handoff (verified 24 October unless marked)

| Item | State | What the worker does |
| --- | --- | --- |
| PR 36 (relief C6, hydrology C7, feature-aware partition C9) | open, CI green | review, merge, delete merged worktrees |
| C8 climate, biome, fertility, colour-map solver stage B | branch `claude/map-climate-biome-colour`, 29 uncommitted files in a worktree, interrupted | inspect, finish or restart from PR 36, ADR, tests |
| C11 territory service (`assign_territory`, `repartition_states`, `update_states`) | branch `claude/map-territory-service`, WIP commit `cd1b36d` plus 10 uncommitted files, interrupted | finish; country growth from seeds along natural borders, forced and blocked sets, border-quality report and enforce |
| C12 and C13 straits, passes, ports, development, names | branch `claude/map-straits-ports-names`, two commits, clean; the MCP integration test was being written | finish the test, review, merge |
| C14 composite renders, C15 generator selection and `regenerate_world_appearance` | planned in `docs/plans/zin-map-pipeline.md` | implement |
| **Import of the owner's drawn map** (R-10) | the pipeline consumes a geography model (C5) and a cleaned reference; no import path from the full drawing with per-sheet transforms exists (verify) | design and implement the import the owner's answer to Q-04 requires: coordinate handling, alignment of all layers, stable ids across re-imports, authored overrides that survive regeneration, diagnostics |
| Validators unusable from agent sessions | `WORKSPACE_CONTEXT_NOT_FOUND` on 19 October (described) | make workspace discovery and registration for the ZIN mod reliable, with a clear error that names the fix |
| Large results truncated | gap G-52: a full `create_world` result exceeds the 32 KiB response budget and hides blockers | keep blockers and first errors when truncating; link artifacts |
| Model-aware `map_inspect` checks | gap G-50 | add |
| Missing inspectors | gaps G-38 (localisation inspect and rewrite), G-39 (asset and gfx inspect), G-40 (country and unit inspectors) | design with the lead's needs (names, tags, flags, icons, the gfx standard of R-91) |
| The tool gap log | `docs/plans/tool-gaps.md`, 58 rows | keep it current; never delete rows |
| Release | 4.3.0 installed (described); next is 4.4.0 | synchronise version, server version, schemas, `server.json`, changelog; release through the repository workflow; install into a fresh prefix |

### 4.2 Proactive duties

The worker also inspects the server for recurring problems, missing capabilities, slow operations and workflows that could be simpler, and opens its own requests (marked "worker (proactive)"). Work stays tied to ZIN's needs and the server's intended capabilities; no unrelated infrastructure projects.

## 5. Performance work

1. Record the input and configuration (workspace, map size, province count, options, seed, machine).
2. Measure the existing operation (wall time, peak memory, calls, bytes) on a comparable fixture and, where possible, on the ZIN workspace.
3. Change one thing at a time; measure again under the same conditions; keep both numbers in the request.
4. Never speed things up by dropping required output, lowering fidelity, skipping validation or serving stale data.

Good targets: batching, fewer calls, data handling that avoids repeated scans, clearer tool interfaces, better diagnostics, automation of steps the lead repeats. Baselines known on 19 October (described): `create_world` at 5,120 x 2,560 took about 20 s and 0.8 GiB; the feature-aware partition about 9 s; relief synthesis about 6.5 s and 450 MB.

## 6. Quality, testing and integration

- Follow the tool repository's `AGENTS.md`: domain logic in core, transport handlers without it, strict TypeScript, schemas on every input, deterministic output, tests beside every behaviour change with negative tests for security, parsing, write recovery, rendering and transport, an ADR per architecture change, synchronised versions, `npm run check` before every merge, releases only from a clean tested commit.
- Explain each new or changed capability in the request (how to call it, with an example) and attach verification evidence.
- **Lifecycle coordination:** schema changes, compatibility changes, releases, runtime installs and server restarts are announced in the request record and to the lead before they happen; the worker never interrupts the lead's active MCP work unexpectedly. The lead relies on a capability only after the record says "released" and the lead has reconnected to the new runtime and confirmed the tool lists it.
- **Final acceptance** is not the worker's test suite: the lead exercises the real ZIN workflow through the server into the running game (the Linux harness), and records "verified in ZIN" in the request.
