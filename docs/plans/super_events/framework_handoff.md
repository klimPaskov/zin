# Super events: framework handoff

**Date:** 25 October 2026. **Decision:** K52 (owner, 25 October 2026). **Spec:** [06_super_events.md](../../specs/06_events/06_super_events.md). **Disposition:** framework implemented with evidence; the 25 pictures and 25 recordings are queued with their specialists (briefs below); the owner questions of spec section 10 are open.

## 1. What exists

| Surface | Path |
| --- | --- |
| Registry and texts | `tools/content/data/super_events.json` (26 super events, ids 1 to 26; id 26 added by owner answer Q-74, K59) |
| Builder | `tools/content/modules/super_events.mjs` (`buildSuperEvents`, `hookSuperEvents`), called from `tools/content/build.mjs` after the mechanic events and, for the hooks, after the late characters |
| Tests | `tools/content/super_events.test.mjs`, registered in `tools/package.json` |
| Staged game files | `interface/zin_super_events.gui`, `interface/zin_super_events.gfx`, `common/scripted_guis/zin_super_events.txt`, `common/scripted_effects/zin_super_events.txt`, `common/scripted_localisation/zin_super_events.txt`, `common/script_constants/zin_super_events.txt`, `events/zin_super_events.txt`, `music/zin_super_events.asset`, `localisation/english/zin_super_events_l_english.yml` |
| Asset rules | `super_event_picture` in `tools/content/data/assets/families.json`, `formats.json` (700 x 500) and `uniqueness.json` |
| Pending art and audio | `docs/plans/zin-art/pending_from_integration.md`, section "Super-event pictures and recordings" (rows SE01 to SE26 and SA01 to SA26); 26 picture findings accepted in `docs/design/validation/asset_baseline.json` with reasons naming their rows |
| Specialist briefs | [art_briefs.json](art_briefs.json) (26 pictures, 700 x 500), [audio_briefs.json](audio_briefs.json) (26 licensed recordings, 60 to 120 seconds) |

## 2. The list and the wiring

The 26 moments, their hook flags and their texts are in spec sections 3 and 8.
`hookSuperEvents` adds `zin_super_event_<key> = yes` on the line after every `set_global_flag = <hook>` of the finished tree; the build of 25 October 2026 found exactly one setter for each of the 26 flags (`hook sites 26 of 26`), in `zin_eindil.txt`, `zin_aenor_court.txt`, `zin_afrit.txt` (four), `zin_world_tension.txt` (nine), `zin_west.txt` (two), `zin_mistake.txt` (two), `zin_dominion.txt` (three, with `zin_volgan_withdrawn_south` in `zin_volgan_withdraws_south`, whose news `zin_dominion.29` and effects are unchanged), `zin_sun.txt` and `events/zin_eindil.txt`.
No owner module was edited. The story wiring check stays green (`Story wiring: ... failures 0`), and the text scan passes (no X5 or other failing finding from the new text).

Each `zin_super_event_<key>` sets `zin_se_done_<key>` once, then opens the window for every human player (`is_ai = no`); a player who already has a super event open gets the new one queued (`zin_se_queue`), shown when the current one is closed.
Playback: `scoped_play_song = "zin_se_<key>"` for that player only, unless the player silenced the music in the window (`zin_se_music_off`); the game's music volume applies.

## 3. GUI evidence (MCP)

**Route.** The released HOI4 Agent Tools 4.4.0 reads only applied mods, and the window is new (no renderable baseline existed; recorded here as required). The previews used a temporary preview workspace, `mod/zin_se_preview` (workspace `mod_zin_se_preview_f9aecc9905ad`, no launcher descriptor in `mod/`, removed after the run), holding the staged package, the ZIN interface sprites it uses (`interface/zin_ui.gfx`, `gfx/interface/zin/frame.dds`, `button.dds`, `rule.dds`, the reskinned `gfx/interface/button_359x34.dds`), the Afrit scripted label `zin_loc_deliverer` and its text, and **preview-only stand-in pictures**: ZIN loading screens cut and resized to 700 x 500 so the picture slot could be laid out. The stand-ins were never staged or committed; the shipped sprites point at the pending files. Calls went through `hoi4.gui_inspect` and `hoi4.gui_render` (fresh server per call), with explicit scenarios (`closedFlags`, `zin_se_open`, `zin_se_id`, `zin_se_music_off`, the queue count and the date supplied as values).

**Reference.** The layout follows the skill's super-event composition (title, large picture, description, quote, response button) adapted to the inspected ZIN window family (`zin_mistake_window` rendered as the style reference: ZIN frame, bronze rule, ZIN button). No separate generated reference image was made; that is a deviation from `hoi4-scripted-gui` "Reference image before implementation", recorded under section 6.

| Pass | Scenario | Resolution, UI scale | Finding | Fix |
| --- | --- | --- | --- | --- |
| 1 | id 2, no picture fixture | 1920 x 1080, 1 | Picture slot 0 x 0 (no texture); date unresolved (`[GetDateText]` needs a value); queue line drawn with `[X]`; the description column left a large gap above the quote | Stand-in pictures in the preview workspace; date and queue supplied as scenario values |
| 2 | id 15 (then the longest text, 818 characters) | 1920 x 1080, 1 | Longest description fit 300 px; queue line collided with the quote bottom; the middle rule reported a sub-pixel clip | Description 320 px, quote moved under the rule, queue line moved beside the music button, rule scale floored |
| 3 | id 2, queue 2, music off | 1280 x 720, 1 (first call ignored the size: `resolution` belongs in the scenario) | Panel fills the screen with margins; music-off button and queue line correct; click regions cyan on the continue and music buttons only | Scenario `resolution` and `uiScale` added to the preview script |
| 4 | ids 15, 3, 9, 25 | 1920 x 1080 @1, 1280 x 720 @1, 2560 x 1440 @1, 1920 x 1080 @1.25 | All fit; id 25 with no picture shows the empty frame (the pending-art state); id 3 showed the raw `[zin_loc_deliverer]` because the preview lacked the Afrit label; `zin_se_close` had no visibility trigger (tool warning) | Afrit label copied into the preview; `zin_se_close_visible` added |
| 5 | id 3; id 10 with queue 3 | 1920 x 1080 @1; 1280 x 720 @1 | After the text of id 15 shortened (K55 rewrite), the description box was resized to the longest descriptions (ids 3 and 10, 690 characters): 272 px; both fit with about 40 px to spare; `Aurevan the Deliverer` resolves; no clipping, no overlap, no button warning | Final |
| 6 | id 26 (K59) | 1920 x 1080, 1 | Three paragraphs and the quote fit; full PNG `a9f037a2b0880db7d01886234abae95b4a9d75fb984f64195454d7e82f2df220` | None needed |

Final render artifacts (SHA-256 of the full PNG, workspace `mod_zin_se_preview_f9aecc9905ad`): pass 5 id 3 at 1920 x 1080 `39010370188ca48e215b5c15987bdcf734b7192e44b007b50d11189891c38200`; pass 5 id 10 at 1280 x 720 `d4c8d159815e7e7c2b27064b836e2da8aef97557329ab9b494f7373695b53abc`; pass 4 at 2560 x 1440 `2254a8ceee1b29700a25d3776ff05691b43669df15b7d13764fc9ad03416464f`, at 1920 x 1080 @1.25 `98ec34f7813dbb6797aeb8c012357bf609a6271a82fe64e52573261c75c10cbd`, pending-art state `2bbbffb38e5ea7770189485e8e0c1b9332d66f2c63d63f7a05dfc767c44fb486`. Pass 4's 2560 and 1.25 renders predate the last box resize of pass 5 (description 320 to 272 px, quote moved up 48 px); the change only moves the rule and quote up inside the same column.

Remaining tool notes, reviewed and accepted: `GUI_VISIBLE_OVERLAP` of the picture and its frame (intended: the frame sits behind the picture); `0 x 0` size notes on the hidden queue line and the hidden music button of each state; `GUI_INCONSISTENT_ALIGNMENT` info, title box and picture 2 px apart horizontally (the title is centred across the panel, the picture is left-aligned to the frame).
Script validation (`hoi4.script_validate`): `events/zin_super_events.txt` checked valid; the scripted effects (275 commands) and the scripted GUI have no findings, with argument blocks and the scripted-effect root scopes left unchecked by the tool (`valid = null`).

Content and action budget: one value (the queue count), two actions (continue, music); every button-like element is interactive.

## 4. Verification

The shared working tree could not give a clean full build at commit time because of other agents' work in progress: the first run with the super events stopped at the asset gate on five `UNIQ_PORTRAIT_POOL` errors of the portrait rebalance, and the second stopped in `buildWarfare` (`zin_men_war_elephants: target hard 0.4 but its equipment gives 0`, the regional-technology work of K58) before the super-event module ran; its suite then failed 22 tests that read the missing staged tree. The baseline run before this work had 1681 tests, 1677 passing and 3 failing (technology and black-powder tests of the technology agent).
The isolated gate check therefore ran the real build's checks on the last fully passing staged tree (the baseline run) with the super-event package and hooks added (`scratchpad/se_gate.mjs`, same functions and same baseline file as `build.mjs`): 26 of 26 hook sites; story wiring failures 0; text scan ok with 132 errors and 65 warnings (the baseline's numbers, 0 failing, no finding on a super-event key); asset gate: the 26 super-event picture findings are all accepted in the baseline and **0 fresh errors** remain.
The super-event tests pass 8 of 8 (the ninth, on a staged tree, is skipped when no tree is staged). In the first full run the super-event module itself ran clean (`super events: 25 registered, 25 hook sites`, story wiring and text scan green); its only gate findings were the picture sprites, accepted since.

## 5. For the specialists

**Art (`hoi4_generated_feature_art`).** Read `art_briefs.json`: one 700 x 500 picture per super event at `gfx/event_pictures/zin/super_events/zin_se_<key>.dds`, generated with gpt-6-luna, provenance in `art/source/provenance.jsonl`. When a picture ships, delete its SE row from the pending list and its baseline entry; the sprite needs no change.
**Audio (`hoi4_super_event_audio_researcher`).** Read `audio_briefs.json`: one licensed recording per super event at `music/zin_se_<key>.ogg`, 60 to 120 seconds, licence and source documented (Q-08). When a recording ships, delete its SA row, give the parent the recording's title for the song title key `zin_se_<key>`, and record it in the canonical audio catalogue.

## 6. Simplifications, omissions and blockers

- **No pictures and no recordings yet.** All 26 are pending their specialists; the window shows an empty frame and plays nothing until they ship. No stand-in is staged.
- **No generated reference image** for the window (scripted GUI skill, reference before implementation): the composition was taken from the skill's super-event layout and the existing ZIN window family and checked in five MCP passes instead.
- **The asset check does not see the songs.** `tools/content/lib/loaded_assets.mjs` skips the mod's own `music/*.asset` when it reads definitions, so a missing `zin_se_<key>.ogg` is not reported; the SA rows are the only record. The check's owner may want to read mod music assets.
- **Not proven by a precedent:** whether `scoped_play_song` plays a song that is in no music station (every installed vanilla event song is also in a station). Acceptance item 3 of spec section 9; the remedy is a `base_music` station file with `chance = { factor = 0 }`.
- **Live behaviour unverified:** the window, the queue and the sound have only offline MCP evidence; the Linux acceptance run (spec section 9, items 3 and 4) is the owner's.
- **Owner decisions arrived during the work** and were applied: K59 (Q-74) added super event 26, the fall of Nafeher with Volgan's body intact (text, picture brief, quote and sound plan as for the others; `zin_dominion.29` and its effects unchanged), and K59 (Q-66, Q-86) made the Golden King's death and Afrit's death texts silent on how they died; K55 (Kusven named from the start) changed super event 15 into "The Grave-Wind", which names him as the Leren's legend, and the sword-break moved out of it; K54 (leaders mostly men, only canon women) moved two quotes from proposed women to anonymous speakers; K57 (Zol's dead are armoured skeletons) went into the briefs.

## 7. Owner questions

The six questions of spec section 10: the set of moments, news and super event together, a dedicated backdrop painting, the quotes' speakers, the music channel, and whether the first super event should wait for the heir's naming.
