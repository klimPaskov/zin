# ZIN implementation handoff: instructions for the lead

You are the lead of the ZIN implementation session. You deliver the complete ZIN total overhaul for Hearts of Iron IV 1.19.3, as one assignment, to the definition of done in `docs/zin-handoff/04-EXECUTION-AND-ACCEPTANCE.md`, section 7. You have no memory of the earlier conversations; everything you need is in the handoff package and the files it names. Where the package says "described" or "unverified", check before relying on it.

Working directory: `C:/Users/klimp/OneDrive/Documents/Paradox Interactive/Hearts of Iron IV/mod/zin` (the mod, git, public, branch `master`). The MCP server repository is `C:/Users/klimp/Documents/Projects/hoi4-agent-tools`. The lore vault is `docs/lore/vault/` (copy at `C:/Users/klimp/Downloads/ZIN_Lore_Vault`).

## 1. Read and reconcile the package

Read, in this order: `docs/zin-handoff/README.md`, `01-CONTEXT-AND-CANON.md`, `02-TOTAL-OVERHAUL-SPEC.md`, `03-MCP-WORKER-SPEC.md`, `04-EXECUTION-AND-ACCEPTANCE.md`; then the mod's `AGENTS.md`, `docs/specs/PROGRAM.md`, `docs/specs/INTEGRATION_DECISIONS.md`, `docs/specs/00_master_overhaul_plan.md`, `docs/specs/CONVENTIONS.md`, `tools/README.md`, the vault's `Canon Policy.md` and `00 - Start Here.md`. Note every place where an older document conflicts with the package; the package and the owner's corrections win (README, "Precedence"). Do not keep two checklists: re-point `PROGRAM.md` to the A-ids of 04.

## 2. Confirm the recorded state

Re-run the state checks of 01, section 1: `git status`, `git log -3` and branch in both repositories; `gh pr view 36` and its checks in the tool repository; `git worktree list` there and the state of the three interrupted worktrees; `cd tools && npm test` in the mod (1,058 tests, 2 failing on 24 October); the source paths in the README (the branding files, the drawings folder, the maps, the installed MCP runtime and its config).

## 3. Record material changes

Write `docs/zin-handoff/STATE-DELTA.md`: every difference from the package (new commits, changed files, moved paths, fixed or new failures, answered questions), with the date. If the owner has answered any question in 01, section 7, record the answer there and in `INTEGRATION_DECISIONS.md`.

## 4. Start the Opus MCP worker

Follow 03, section 1. Check which Opus model the environment offers; on 24 October it was `claude-opus-5-5`. Prefer a separate session in the tool repository with that model; otherwise a background agent with model `opus` in its own worktree. Give it the whole of `docs/zin-handoff/prompts/MCP_WORKER_OPUS.md` as its first message. Record the launch (method, model id, time) in the request record `docs/plans/zin-requests.md` of the tool repository once the worker creates it. If no Opus worker can run, say so to the owner with the setup needed; never claim it exists.

Ownership: you never edit the tool repository; the worker never edits the mod. You open requests in the record (format in 03, section 3) whenever a tool lacks a capability, misbehaves, needs repeated awkward steps, diagnoses poorly or could be faster, and you keep working on independent tasks meanwhile. You rely on a new capability only after the record says it is released and you have reconnected and seen the tool. You verify each fix through the real ZIN workflow and mark it "verified in ZIN".

## 5. Begin the work

Do the first actions of 04, section 2 in order: secure the interrupted work (review it; nothing is lost or blindly committed), send the owner the open questions of 01, section 7 in one message with the proposals, update the sources of truth, run the name migrations (Erdae and Aoaz; Vez'nan is Volgan; Edvoid renamed) with a dry run first, transcribe the bestiary cards (Estonian) into `docs/lore/sources/bestiary_cards.md`. Then work through the tranches of 04, section 3. Use subagents for bounded, parallel work with self-contained prompts (the mod's `AGENTS.md`, "Subagents"); keep at most about six running at once, have them persist work to files early, and review and integrate their output yourself: an agent's "tests pass" is not acceptance until the whole build and suite pass.

## 6. Keep the two loops running

**Server loop:** the request record is live for the whole project. Review it at the start of each tranche, close the loop on released items, and send concrete requests (the ZIN task, the tool, inputs and reproduction, current behaviour, the capability wanted, evidence, impact and priority, the acceptance test).

**Lore loop (R-47):** after each substantial task, list the facts and relationships you introduced, check them against geography, chronology, characters and rules, update the canonical references (timeline, atlas, pantheon, bestiary, characters, cultures, naming guides), propagate the consequences into related content, and record any decision that needs the owner. Expand undeveloped areas when canon gives direction (decision L1); ask about consequential contradictions and missing foundations; keep intentional mysteries (01, section 3). Improve `AGENTS.md` and the skills with confirmed, reusable findings.

## 7. Verify and finish

Every tranche ends with the builder suite, the validators, a Linux run with the clock running and screenshots, the error budget, a pushed commit and a `PROGRAM.md` update. Before claiming completion, run every A-check of 04, section 5 on the final build, the every-country sweep, observer runs to 4A 1760 and 4A 1800 (the main historical direction and divergent seeds), save and load, and the interface coverage at the listed resolutions and scales. Report blockers honestly with evidence. The work is done only at 04, section 7; planning, demonstrations and partial conversions are not completion.

## Rules that always apply

- Never launch, automate or capture the Windows game, and never change its launcher playset or settings; run the game only in the isolated Linux harness under `/tmp/hoi4_wsl.lock`.
- Keep private sources private (`docs/reference/originals/`, `docs/lore/vault/Maps/`, `C:/Users/klimp/Documents/ZIN/`): use derived data, never commit or publish the images.
- All art is image-generated through the owner's gptimage route with provenance, except the owner's branding files (R-90); never copy assets, text or scripts from other mods or the base game; 3D only through Meshy via the launcher within the credits.
- Keep the country tag total below 439.
- Write scripts with the Write and Edit tools, not shell heredocs.
- Ask the owner about consequential canon; never close a vault open question on your own.
