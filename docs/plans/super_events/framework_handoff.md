# Super events: framework handoff

**Date:** 25 October 2026. **Decisions:** K52, K59 (Q-74), K60 and K61 (owner, 25 October 2026). **Spec:** [06_super_events.md](../../specs/06_events/06_super_events.md). **Disposition:** framework implemented with evidence; the 31 pictures and 31 recordings are queued with their specialists (briefs below); the two owner questions of spec section 10 are open.

## 1. What exists

| Surface | Path |
| --- | --- |
| Registry and texts | `tools/content/data/super_events.json` (31 super events, ids 2 to 32; id 1, the waking in the ice, retired by K60 and K61) |
| Builder | `tools/content/modules/super_events.mjs` (`buildSuperEvents`, `hookSuperEvents`, `replaceNews`), called from `tools/content/build.mjs` after the mechanic events and, for the hooks and the news, after the late characters |
| Tests | `tools/content/super_events.test.mjs`, registered in `tools/package.json` |
| Staged game files | `interface/zin_super_events.gui`, `interface/zin_super_events.gfx`, `common/scripted_guis/zin_super_events.txt`, `common/scripted_triggers/zin_super_events.txt`, `common/scripted_effects/zin_super_events.txt`, `common/scripted_localisation/zin_super_events.txt`, `common/script_constants/zin_super_events.txt`, `events/zin_super_events.txt`, `music/zin_super_events.asset`, `localisation/english/zin_super_events_l_english.yml`; one trigger line in each of the 23 replaced news events |
| Asset rules | `super_event_picture` in `tools/content/data/assets/families.json`, `formats.json` (700 x 500) and `uniqueness.json` |
| Pending art and audio | `docs/plans/zin-art/pending_from_integration.md`, section "Super-event pictures and recordings" (rows SE02 to SE32 and SA02 to SA32); 31 picture findings accepted in `docs/design/validation/asset_baseline.json` with reasons naming their rows |
| Specialist briefs | [art_briefs.json](art_briefs.json) (31 pictures, 700 x 500), [audio_briefs.json](audio_briefs.json) (31 licensed recordings, 60 to 120 seconds) |

## 2. The list, the audiences and the wiring

The 31 moments, their hook flags, audiences, reports, replaced news events and texts are in spec sections 3 and 8.

**Audiences (K61).** World news, shown to every human player: the Golden King's death, the Deliverer's crowning, the War of the Last Crowns, Volgan's march, the Deliverer's name, the King in the East, the fall of Parim, Volgan's body broken, Kusven, Lorien's fall, Afrit's death, the fall of Nafeher and the eight endings (20 moments). Regional, shown only to the human players whose realm is involved (11 moments):

| Id | Moment | Audience | Report to neighbours |
| --- | --- | --- | --- |
| 4 | The Heir of Aen | the realm holding the heir and the Gala | Talk from the Gala Court |
| 6 | The Western Crossing | West, Middle and North Lands | |
| 7 | The Black North Marches | Cold, North and Middle Lands, the black north, Zol's enemies | |
| 12 | The Heir Returns | the war of the living (the heir's realm, Middle and Magical Lands, the enemies of Volgan, Zol or Afrit) | |
| 13 | Varner Falls | the war of the living | |
| 27 | The Hall of Horos | the realm holding the heir and the holder of Yeldenne | Lights at Yeldenne |
| 28 | The Passes of Mirolon Fall | Mirolon, Middle and Ember Lands, Volgan's enemies | Smoke over the Passes |
| 29 | The East Crosses the Rift | East and Magical Lands | Trouble across the Rift |
| 30 | The Black Compact | Volgan, Zol, the heir's realm, their enemies | |
| 31 | The Cliff | Afrit's realm, the heir's realm, Middle Lands, Afrit's enemies | |
| 32 | Without the Heir | the war of the living | |

**Hooks.** `hookSuperEvents` adds `zin_super_event_<key> = yes` on the line after every `set_global_flag = <hook>` of the finished tree; each of the 31 flags has exactly one setter (`super events: 31 registered, 31 hook sites`). No owner module was edited.
**News replaced (K60).** `replaceNews` gives 23 news events an event trigger `NOT = { has_country_flag = zin_se_saw_<key> }` and writes `zin_se_news_<event>`, the copy of each one's `immediate` block and first visible option, which a human in the audience receives with the super event. The AI and every human outside the audience still get the news event unchanged. The build stops if a replaced news event uses `ROOT` or `FROM` or already has an event trigger.

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
| 7 | id 28 (the longest description now, 712 characters); id 27 with queue 2 (K60) | 1920 x 1080 @1; 1280 x 720 @1 | Both fit, id 28 with about 48 px to spare above the middle rule; full PNGs `0a918bc9c4e1e22be05481ece84926d97f42e953ae88e36244174cc999235f3a` and `d71b236a1687de1f5e9206e66d7925bc3e2e0ab8a0c070af699a43b34942ceb8` | None needed |

The window layout did not change for K60 and K61; pass 7 checks the longest of the new texts.

Final render artifacts (SHA-256 of the full PNG, workspace `mod_zin_se_preview_f9aecc9905ad`): pass 5 id 3 at 1920 x 1080 `39010370188ca48e215b5c15987bdcf734b7192e44b007b50d11189891c38200`; pass 5 id 10 at 1280 x 720 `d4c8d159815e7e7c2b27064b836e2da8aef97557329ab9b494f7373695b53abc`; pass 4 at 2560 x 1440 `2254a8ceee1b29700a25d3776ff05691b43669df15b7d13764fc9ad03416464f`, at 1920 x 1080 @1.25 `98ec34f7813dbb6797aeb8c012357bf609a6271a82fe64e52573261c75c10cbd`, pending-art state `2bbbffb38e5ea7770189485e8e0c1b9332d66f2c63d63f7a05dfc767c44fb486`. Pass 4's 2560 and 1.25 renders predate the last box resize of pass 5 (description 320 to 272 px, quote moved up 48 px); the change only moves the rule and quote up inside the same column.

Remaining tool notes, reviewed and accepted: `GUI_VISIBLE_OVERLAP` of the picture and its frame (intended: the frame sits behind the picture); `0 x 0` size notes on the hidden queue line and the hidden music button of each state; `GUI_INCONSISTENT_ALIGNMENT` info, title box and picture 2 px apart horizontally (the title is centred across the panel, the picture is left-aligned to the frame).
Script validation (`hoi4.script_validate`, first version): `events/zin_super_events.txt` checked valid; the scripted effects (275 commands) and the scripted GUI had no findings, with argument blocks and the scripted-effect root scopes left unchecked by the tool (`valid = null`).

Content and action budget: one value (the queue count), two actions (continue, music); every button-like element is interactive.

## 4. Verification

The shared working tree is a moving target (other agents' work in progress stopped earlier runs in the warfare step, the realm-life step and at the asset gate on portrait-pool errors), so the change was verified in an isolated worktree of the branch head (`2e7f845a`) plus this change only (`scratchpad/sewt`, label `sev3`), with the repository's own `tools/content/build.mjs` and `npm test`:

- **Build: exit 0**, strict, asset gate included: `super events: 31 registered, 31 hook sites`; story wiring failures 0; text scan ok with 132 errors and 65 warnings (the baseline's numbers, 0 failing, none on a super-event key); no asset-gate error (the 31 super-event picture findings are accepted in the baseline).
- **Suite: 1691 tests, 1686 pass, 1 fail, 4 skipped.** All 10 super-event tests pass, the built-tree test included. The one failure is not this change: an untracked flag art source (`art/source/flags/realm-flags-one-DND.png`) of the concurrent flag work. The skips are environment skips (the private drawing is absent, the full geography model is opt-in).
- The shared-tree run with the label `sev` is recorded in the commit report.

## 5. For the specialists

**Art (`hoi4_generated_feature_art`).** Read `art_briefs.json`: one 700 x 500 picture per super event at `gfx/event_pictures/zin/super_events/zin_se_<key>.dds`, generated with gpt-6-luna, provenance in `art/source/provenance.jsonl`. When a picture ships, delete its SE row from the pending list and its baseline entry; the sprite needs no change.
**Audio (`hoi4_super_event_audio_researcher`).** Read `audio_briefs.json`: one licensed recording per super event at `music/zin_se_<key>.ogg`, 60 to 120 seconds, licence and source documented (Q-08). When a recording ships, delete its SA row, give the parent the recording's title for the song title key `zin_se_<key>`, and record it in the canonical audio catalogue.

## 6. Simplifications, omissions and blockers

- **No pictures and no recordings yet.** All 31 are pending their specialists; the window shows an empty frame and plays nothing until they ship. No stand-in is staged.
- **No generated reference image** for the window (scripted GUI skill, reference before implementation): the composition was taken from the skill's super-event layout and the existing ZIN window family and checked in six MCP passes instead.
- **The asset check does not see the songs.** `tools/content/lib/loaded_assets.mjs` skips the mod's own `music/*.asset` when it reads definitions, so a missing `zin_se_<key>.ogg` is not reported; the SA rows are the only record. The check's owner may want to read mod music assets.
- **Not proven by a precedent:** whether `scoped_play_song` plays a song that is in no music station (every installed vanilla event song is also in a station), and whether a major news event reads its event trigger for each receiving country (the news replacement relies on it). Acceptance items 3 and 4 of spec section 9.
- **News events keep their own audiences.** The super event replaces a news event only for its own audience; several news events of now-regional moments still go to every country (spec section 10, question 1).
- **The minor report events** were not rendered with the MCP event route; they are plain country events with catalog pictures under the cap.
- **Live behaviour unverified:** the window, the queue, the audiences, the reports and the sound have only offline evidence; the Linux acceptance run (spec section 9, items 3 to 5) is the owner's.
- **Owner decisions arrived during the work** and were applied: K55 (Kusven named), K54 (no proposed women quoted), K57 (armoured skeletons in the briefs), K59 (the fall of Nafeher; deaths told without their cause), K60 (six moments added, news replaced, music channel, first moment at the naming) and K61 (audiences; the naming rewritten so the Gala keep it to their hall).

## 7. Owner questions

The two open questions of spec section 10: whether the owners' news events of now-regional moments should also be narrowed, and whether more regional moments should send minor reports.
