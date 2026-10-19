# Isolated Linux acceptance harness

ZIN is verified in an isolated Linux copy of Hearts of Iron IV under WSL, behind the shared game lock (`/tmp/hoi4_wsl.lock`). **Never launch, automate or capture the Windows game.** The scripts are private tooling explicitly permitted by `AGENTS.md`; paths in them are this machine's.

| Script | Does |
| --- | --- |
| `zin-live.sh sync` | Copy the live mod into the Linux profile (refuses while a game runs or if a profile file was edited). Other modes: `prepare`, `start`, `capture <name>`, `status`, `stop`. |
| `run.sh <label> <x> <y> [seconds]` | Start the game, open a campaign (portrait `0 0` keeps the bookmark default), unpause at top speed, check it is alive every 30 seconds for `seconds`, capture, stop. Prints `ALIVE-RUNNING` or `DIED-*`. |
| `overlay-build.mjs`, `overlay-sync.sh`, `overlay-run.sh` | Test a staged build and politics plan in the Linux profile without touching the live mod; restore afterwards with `zin-live.sh sync`. Working folders go under `work/` (ignored). |

Rules: the clock must run in every acceptance run (start-only runs missed the flag-sheet crash); phases 1 and 2 run at least 10 minutes, later phases one in-game year; every run copies `error.log`, `text.log` and `game.log` out and checks them against the error budget (`node tools/content/checks/error_budget.mjs <error.log> <text.log> <stage>`).
