# Lead status (resumable)

Working notes of the implementation lead. `docs/specs/PROGRAM.md` is the progress record; this file says what is running and what comes next, so work resumes after an interruption without loss.

## Owner answers

All owner questions of 24 October 2026 are answered and recorded as decisions K9 to K50 in `docs/specs/INTEGRATION_DECISIONS.md` (table of answers: `docs/zin-handoff/OWNER-QUESTIONS.md`). The owner is away since the evening of 24 October and asked for autonomous work: new questions queue in `docs/zin-handoff/OWNER-QUESTIONS.md` (Q-31 to Q-62 open, each with the default in use).

## State (25 October 2026, about 08:00)

- Branch `zin/integration-r3`, not pushed; working tree clean. Build green; full suite 1,635 pass, 1 skipped (needs the private drawing). The 156-realm build is applied to the mod (`0841f343`): realm tags, files, histories, orders of battle, flags, portraits, focus trees, story framework and events, realm life, start variety, error-log fixes. The game is not run on this state: the map generator's 305 old Y-tag files are still present until the new map's `create_world` retires them (536 tags would crash).
- Roster: 156 realms, 231 tags of 439 (Pornivior retagged PON: PRN is a Windows device name), 1,033 characters, 99 focus trees.
- Flags: all 156 realms fly their own heraldry flag. Portraits: 179 pools (595 members), named portraits for Volgan, Lorien, Bastian, Alleria, the Golden King, the King of Demons and Kusven; the five awaiting owner approval (Q-32) keep pool portraits; the Zol emblem for Zol's dead.
- Story: the 37 soft-locks addressed (framework, Afrit/Aenor/Eindil, Kusven and the war side, wiring completion with the story check enforced for every owner), realm life G1 to G9 and start variety V1 to V13.
- Map import: preview on the released 4.4.0 is READY with land IoU 0.9574 and no warnings; realm seeds and `tools/politics/data/create_world_call.json` ready for 4.5.0 (ZR-8 merged as PR 44, release being cut). Run calls with `scratchpad/mcp_call.mjs` on the installed runtime (this session's own MCP connection is the old project registration until the owner reconnects); point it at `runtime-v450` once installed.
- MCP worker: 4.4.0 installed; 4.5.0 (ZR-8 workspace countries) next; C11 territory growth, ZR-6 strait crossings and ADR 0067 steps 3 to 5 after it; ZR-7 resolved on the mod side.
- Tooling notes: `scratchpad/verify.sh <label>` builds into the default staged tree with a private TEMP and runs the suite (refreshes the art snapshot's provenance first; `KEEP_STAGED=1` keeps the tree for an apply); `tools/content/apply.mts` and `validate_import.mjs` fall back to the installed tool release when the tool checkout has no packages.

## Running

| Work | Who | Writes |
| --- | --- | --- |
| MCP worker: release 4.5.0 | session "ZIN MCP worker (HOI4 Agent Tools)" | tool repository |
| Skill `hoi4-character-art-direction` (K54) | subagent (skill maintainer) | `.claude/skills/`, mirrors, CLAUDE.md skill list |
| Character sex rebalance (K54, about one woman in ten) | subagent | `data/world/characters/*.json`, references, pool membership; `docs/plans/zin-characters/sex_rebalance_handoff.md` |
| Portrait redesign (K54): King of Demons crop from v4 A, named audit, non-human peoples from the owner's drawings, then human pools after the rebalance | subagent (portrait creator) | portrait pools and art, `docs/specs/08_art_and_assets/07_peoples_appearance.md`; `docs/plans/zin-art/portraits_v2_handoff.md`. Tell it when the rebalance lands. |
| Technology tree redesign (K51) | subagent | `data/technologies*.json`, `warfare_equipment.json`, `lib/tech_layout.mjs`, `lib/tech_tree_gui.mjs`, `modules/technologies.mjs`, gameplay specs 01 and 07 |
| Super-event framework (K52) | subagent | super-event modules, interface and docs |
| Flag redesign (K53): culture-rooted medieval banners, all 156 regenerated with luna | subagent | heraldry generator, `heraldry.json`, `06_heraldry.md`, `art/flag-jobs.mjs`, `realm-flags-cells.json`, new `realm-flags-v2-*` sheets; `docs/plans/zin-art/flags_v2_handoff.md` |

## Next, in order

1. When 4.5.0 is installed: preview then write `create_world` with `create_world_call.json` (preview false for the write; retires the 305 Y-tag files), rebuild and apply the content again (the bookmark and orders of battle come back), then the first Linux run on the new map (sync, start, run, capture; error profile).
2. AI for the story: strategy plans, paced MTTH, the Gathering Dark tier AI, the magic module (and its weekly tick, `zin_world.45`), the world-tension widget, tick step 10's missing effects; AI-weight audits once the session runs a current server.
3. Key-sites module (`zin_is_site_parim`, `zin_is_site_great_wall` and the others are stand-ins) on the new map's states.
4. Black-powder equipment for the roster's `gunpowder` realms (K19) in `modules/warfare.mjs`; swap the stand-ins in *The Bombard Foundries*.
5. Placeholder icons found 25 October: 601 sprites draw from the shared frame `gfx/interface/zin/frame.dds` (units 189, technologies 185, equipment 128, doctrines 86, equipment designer 12, one in zin_ui); technologies and doctrines are in production (icon artist, `docs/plans/zin-art/tech_doctrine_icons_handoff.md`), then equipment pictures, then unit icons and counters (vanilla-green counters per the 3D pipeline rules). Not counted in `pending_from_integration.md`.
5a. Art debt: the pending rows of `docs/plans/zin-art/pending_from_integration.md` (focus icons over caps, event pictures, interface reskin duplicates, ruler-temper icons), with gpt-6-luna on the Plus allowance.
6. Calendar follow-ups: `zin_reckoning_new_reign` from the river-kings' succession; the politics step's bookmark text still says "Erdae".
7. AI-weight audits once this session runs the 4.4.0 server (ZR-7); the Linux sweep, observer runs to 4A 1760 and 1800, save and load, zero ZIN error lines; final report.
7b. Second error pass after the story agents (`docs/plans/zin-errors/r3b_fixes.md`, "needs your decision" and "not touched"): the 92 `recruit_character` calls during play (recruit in history, give the role later), the three `has_opinion_modifier` checks with a target block (Gunwaith tree, two in `zin_ending.txt`: a flag set beside the modifier), malformed equipment tokens in the institutions AI strategy, `state_trigger` in two decision files, `slot` in the Afrit traits, `any_country` used as an effect, airframe names in the equipment script enum, missing technology grid boxes; the Deep-Water Hulls text (one convoy type, the Merchant Cog; lead decision). Orders-group lines: read the AI's army groups from a save if they remain.
7c. After the story agents: switch the ~30 readers of `zin_zol_manifested` / `zin_zol_withdrawn` to the Kusven flags and retire the old flags (list in `docs/plans/story/war_side_handoff.md`); retire or rename the warfare company "Zol Made Flesh"; Kusven's portrait from design ref `kusven_v2_a` (a Great Spirit, magical); the Beasts of the black north wait for Q-71.
8. Model sites of Yeldenne, Hunhun and Mora sit on water or the coast in the geography model; move them in the repair inputs.

## Decisions taken by the lead (not owner canon)

- The 19 October work is preserved on `zin/integration-r3` and reaches `master` only when the build and suite are green.
- The name exchange leaves game output files alone; they are regenerated by the next build and apply.
- The owner's copy of the vault in `Downloads` is not edited; the mod's vault is the maintained copy from 24 October 2026.
- No ZIN tag equals a vanilla tag, so Noris takes NRS, not NOR (Norway); Tolvael takes TLV.
- The Great River keeps its drawn course through a gorge in Kingson's ring of mountains (the range is opened), rather than making the Kingson Vale an inland basin.
- The open-sea seam (R-18) costs the Vindael arm 55% of its drawn land; accepted, shown to the owner in the map preview.
- The text-scan exception for the CJK month counters (月/월) in calendar files only.
- Realm flags: a thin light-grey keyline on near-black fields (trimmed by the slicer's inset); the four last dark flags generated one per image and trimmed to 41:26.
- The import's land follows the model outside a 6-px coast band (annotations); straits stay water, necks land.
- No technical never-existing tag for late characters: every character is recruited in an existing realm's history (the wiki: recruitment only in history) and enters play by a role and `set_nationality`, with flags for "in play" (25 October 2026).
- The new map is written as soon as 4.5.0 (ZR-8, workspace-owned countries) is installed, before feature-aware growth (C11): ownership follows the capitals, claims, exclusions and unowned land exactly and fills the rest by weight-balanced growth that ignores rivers and ranges; the map is rewritten when growth lands (state ids renumber then; the state table is keyed by geography features). Reason: the new map, roster, flags and portraits reach a Linux run hours or days earlier.
- Never write file contents through a shell string with backticks or `$`, and never `sed -i` (it strips Windows line endings in this shell): use the Write and Edit tools.
- Owner branding originals (sha256): `ZinLogoCut.png` ffd77044...4194, `ColorfulZinLogo.PNG` 6ea5e004...7360, `ZinLogo.png` a290f7da...6ecc, `ZIN.LOGO.BACKGROUND.png` bebd9c97...4042, `ZIN.png` 281ea09f...22d0.
