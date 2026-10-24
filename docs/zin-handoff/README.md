# ZIN handoff package

**Written:** 24 October 2026, in a planning-only session. Nothing in this package was implemented in that session.
**Purpose:** give a fresh implementation session everything it needs to deliver the complete ZIN total overhaul for Hearts of Iron IV 1.19.3 without access to the earlier conversation.

ZIN is a total-overhaul mod set on the continent now called **Aoaz** (formerly called Erdae; see the name exchange in [01-CONTEXT-AND-CANON.md](01-CONTEXT-AND-CANON.md#21-exchange-erdae-and-aoaz)). Older files, folder names and the lore vault still say Erdae for the main setting until the migration in that section runs. Read every older "Erdae" as "Aoaz" unless the text is about the neighbouring small continent.

## How to start the fresh session

1. Open a new session with the ZIN repository as the working directory:
   `C:/Users/klimp/OneDrive/Documents/Paradox Interactive/Hearts of Iron IV/mod/zin`
   Add `C:/Users/klimp/Documents/Projects/hoi4-agent-tools` and `C:/Users/klimp/Downloads/ZIN_Lore_Vault` as additional directories if the client allows it.
2. Paste the whole of [prompts/GOAL_PROMPT.txt](prompts/GOAL_PROMPT.txt) as the first message. It is exactly 4,000 characters (UTF-8, ASCII only, LF line endings, no trailing newline), checked programmatically on 24 October 2026.
3. The lead then follows [prompts/ZIN_IMPLEMENTATION_HANDOFF.md](prompts/ZIN_IMPLEMENTATION_HANDOFF.md). One of its first steps is to start the dedicated Opus MCP worker with [prompts/MCP_WORKER_OPUS.md](prompts/MCP_WORKER_OPUS.md).

## Reading order

| Order | File | What it holds |
| --- | --- | --- |
| 1 | this README | entry point, sources, precedence |
| 2 | [01-CONTEXT-AND-CANON.md](01-CONTEXT-AND-CANON.md) | what exists, what happened, the canonical corrections of 24 October 2026, the source catalogue, failed approaches, open questions |
| 3 | [02-TOTAL-OVERHAUL-SPEC.md](02-TOTAL-OVERHAUL-SPEC.md) | the complete requirements (ids R-xx) |
| 4 | [03-MCP-WORKER-SPEC.md](03-MCP-WORKER-SPEC.md) | the dedicated Opus MCP worker: ownership, request record, performance work, integration |
| 5 | [04-EXECUTION-AND-ACCEPTANCE.md](04-EXECUTION-AND-ACCEPTANCE.md) | dependencies, first actions, verification, the coverage matrix (ids A-xx), blockers, definition of done |
| 6 | [prompts/ZIN_IMPLEMENTATION_HANDOFF.md](prompts/ZIN_IMPLEMENTATION_HANDOFF.md) | the lead's operating instructions |
| 7 | [prompts/MCP_WORKER_OPUS.md](prompts/MCP_WORKER_OPUS.md) | the worker's startup prompt |

## Precedence and sources of truth

This package does not replace the repository's existing documents; it tells the implementation session how to reconcile them.

1. **The owner's explicit decisions** win: the corrections of 24 October 2026 (recorded in 01, section 2), the review rules F1 to F8 and the lore decisions L1 to L3 of 19 October 2026 (`docs/specs/PROGRAM.md`, `docs/specs/INTEGRATION_DECISIONS.md`).
2. **The lore vault** (`docs/lore/vault/`, identical copy at `C:/Users/klimp/Downloads/ZIN_Lore_Vault`, verified byte-identical on 24 October 2026) is canon under its Canon Policy, except where a 24 October correction overrides it. The implementation session updates the vault pages that the corrections contradict, keeping the Canon Policy's labels (established, proposed, open).
3. **This package** defines the scope and acceptance of the overhaul as of 24 October 2026. Where an older spec under `docs/specs/` contradicts it, this package wins until the spec is updated; the first implementation tranche updates them (04, section 2).
4. **`docs/specs/PROGRAM.md`** stays the single progress record and criteria checklist. The lead re-points its criteria to the acceptance ids of 04 instead of keeping a second checklist.
5. **Project instructions:** `AGENTS.md` (identical to `CLAUDE.md`) in each repository. Their engineering rules apply in full; this package does not relax them.

## Source locations

All paths were checked on 24 October 2026 unless marked otherwise.

| What | Location | Notes |
| --- | --- | --- |
| The mod (git, public, branch `master`) | `C:/Users/klimp/OneDrive/Documents/Paradox Interactive/Hearts of Iron IV/mod/zin` | GitHub `klimPaskov/zin`, no licence, all rights reserved |
| The MCP server, HOI4 Agent Tools (git, public) | `C:/Users/klimp/Documents/Projects/hoi4-agent-tools` | GitHub `klimPaskov/hoi4-agent-tools`; package 4.3.0 |
| Installed MCP runtime the clients use | `C:/Users/klimp/AppData/Local/hoi4-agent-tools/runtime-v430/` (unverified on 24 October; recorded on 19 October) | config `C:/Users/klimp/AppData/Roaming/hoi4-agent-tools/config.json`; registered in `~/.claude.json` and `~/.codex/config.toml` |
| Lore vault (canon) | `docs/lore/vault/` in the mod; copy at `C:/Users/klimp/Downloads/ZIN_Lore_Vault` | byte-identical on 24 October |
| The full drawn map (private) | `C:/Users/klimp/Documents/ZIN/World/Erdae/Maps/Colored/Erdae Full Colored Map.png` (17,520 x 12,720, RGBA) | byte-identical to `docs/reference/originals/Erdae.png` (ignored by git) |
| Regional drawn maps (private) | `C:/Users/klimp/Documents/ZIN/World/Erdae/Maps/Colored/<region>/` | 13 regional sheets, the region names of the drawing (Cold Lands, Dark Lands, Dead Lands, East-Earth, Islands of The South, Magical Lands, Ocean of Edvoid, Rush Islands, Rush Land, South-Earth, Sunhot, Triton's Islands, West-Earth) |
| Working mosaic of the sheets (private) | `docs/reference/originals/Erdae-working.jpg` (3,200 x 2,323) | ignored by git |
| Cleaned game-layout references | `docs/reference/cleaned/Erdae-clean-v1.png` to `v3.png` | tracked; v3 is the approved layout of 18 October (central sea widened) |
| The world map of ZIN (all continents, private) | `C:/Users/klimp/Documents/ZIN/World/Erdae/Drawings/IMG_20261023_121133.jpg` | labels Dunda, Erdu, Haven, Cerio, Lao, Arda, Aoaz |
| Creature and figure drawings, bestiary cards (private) | `C:/Users/klimp/Documents/ZIN/World/Erdae/Drawings/` (67 photos of 23 October 2026 including the world map, plus three Horos drawings in `Horos/`) | catalogue in 01, section 4.3; the card text is handwritten Estonian |
| Branding (owner's files) | `C:/Users/klimp/Documents/ZIN/Themed/Logos/` and `.../Themed/Backgrounds/` | the five required files are listed in 02, R-90 |
| Installed game (read only) | `C:/Program Files (x86)/Steam/steamapps/common/Hearts of Iron IV` | 1.19.3 |
| Offline wiki | `paradox_wiki/` in the mod | |
| Reference mods for design study only | Steam Workshop ids 1314446921 (LOTR), 3103846888 (LOTR Expanded), 2265420196 (Old World Blues) | lessons in `docs/specs/00_reference_mod_lessons.md`; never copy |
| Linux acceptance harness | `tools/acceptance/` in the mod; WSL lock `/tmp/hoi4_wsl.lock` | the only allowed way to run the game |

Private material stays private: never commit, publish or embed `docs/reference/originals/`, `docs/lore/vault/Maps/` or anything under `C:/Users/klimp/Documents/ZIN/`. Derived data (coordinates, transcriptions, names) may be committed; the images may not.

## What this package is not

It is not the implementation, and finishing it does not complete the mod. The implementation session must deliver the whole overhaul described in 02 and prove it with the checks in 04.
