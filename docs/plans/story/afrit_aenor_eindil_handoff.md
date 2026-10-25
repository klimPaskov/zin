# Afrit, Aenor and Eindil: soft-lock fixes and the mechanic story events

**Date:** 25 October 2026. **Branch:** `zin/integration-r3`. **Design:** [alternate_history.md](../../design/alternate_history.md) and `.json` (soft-lock audit, section 7; plan rows of section 11). **Disposition:** implemented with evidence, except the items under "Open and handed on".

Every text below is proposed: canon is silent on the wording of these events, and the gists the specs give are kept. The voice follows [09_voice_and_style.md](../../specs/02_lore/09_voice_and_style.md).

## What was built

- New module `tools/content/modules/events_mech.mjs`, registered in `tools/content/build.mjs` after the story framework (it refuses an id another staged event file defines).
- New data `tools/content/data/events_mech_afrit.json` (namespace `zin_afrit`, file `events/zin_afrit_story.txt`) and `events_mech_misc.json` (namespace `zin_aenor`, file `events/zin_aenor_successors.txt`); localisation `localisation/english/zin_events_mech_l_english.yml` (English only, as every mechanic module writes; the text sweep handles the other languages of vanilla keys only).
- The module checks every event before it stages anything: ids unique and new, picture in the catalog with the right crop and its gate required, the hub-only picture only on private events, checkpoint events with the non-committal option first and a historical option, banned words, the game font, the Deliverer's secret in public text, the heir's name only after `zin_eindil_named`, no sealed or superseded name, and every command in the installed documentation.
- Tests: `tools/content/events_mech.test.mjs` (21 tests), registered in `tools/package.json`.

### Events written (31)

| Id | Title | To | Fired by |
| --- | --- | --- | --- |
| `zin_afrit.10` | The Council's Verdict | seat, private | focus Prayers for the King, `zin_lore.221` |
| `zin_afrit.11` | Choose the Instrument | seat, private | focus A Vigil for the King |
| `zin_afrit.14` | The Night Is Near | seat, private | `zin_afrit_add_plot` at 100 (the AI goes on to `.15`) |
| `zin_afrit.15` | Choose the Night (CP05) | seat, private | focus The Mistfall Vigil, `.14` for the AI |
| `zin_afrit.16` | Found Out | seat, private | `zin_afrit_plot_exposed` |
| `zin_afrit.17` | Treason in the Golden Court | news | `zin_afrit_plot_exposed` |
| `zin_afrit.20` | The Seals Pass to the Deliverer (CP06) | seat, private | `zin_aenor_give_seals` |
| `zin_afrit.21` | Aurevan, First of His Name | news | `zin_afrit_crown_aurevan` |
| `zin_afrit.22` | Dissenters at Court | seat, private | the crowning, 30 days later |
| `zin_afrit.23` | A New King in Parim | news | `zin_afrit_raise_pliant_heir` (crowns Eronel once) |
| `zin_afrit.31` | Word from the Lands of the Sun (CP09) | seat, private | the Council's month, N8 delay after the naming |
| `zin_afrit.32` | The Northern Voyage | seat, private | `zin_afrit_northern_voyage` |
| `zin_afrit.33` | The Ambush on the Shore (CP09) | seat, private | `zin_eindil.70` |
| `zin_afrit.34` | Return from Yeldenne | seat, private | `zin_afrit_wound` |
| `zin_afrit.43` | The Name Behind the Deliverer | news | `zin_afrit_reveal` |
| `zin_afrit.45` | The Houses Under Suspicion | Light courts | `zin_afrit_reveal` |
| `zin_afrit.51` | The Deliverer Comes East (CP17) | eastern candidates | `zin_afrit_flee_east` |
| `zin_afrit.52` | A King in the East | news | `zin_afrit.9` |
| `zin_afrit.53` | The Keeper's Choice | seat, private | `zin_afrit_flee_east` |
| `zin_afrit.60` | The Return from the East | seat, private | `zin_afrit_return` |
| `zin_afrit.61` | Brother Against Brother | seat, private | the Council's month after the return (fires `zin_eindil.110`) |
| `zin_afrit.62` | Lord of All Aoaz | news | the Council's month (calls `zin_afrit_retake_aenor` once) |
| `zin_afrit.70` | The Palace Wards | seat, private | `zin_afrit_begin_palace_battle` |
| `zin_afrit.71` to `.74` | The Eye and the Ring; The Seals of the Crown; The Bracelet; The Necklace | seat, private | `.70`, then `zin_afrit_palace_roll` |
| `zin_afrit.75` | The False God Falls | news | stage 4 won (calls `zin_afrit_die` once, fires `zin_eindil.124`) |
| `zin_afrit.76` | The Palace Holds | seat, private | a stage holds (fires `zin_eindil.127`) |
| `zin_afrit.77` | The Hunt for the False God (proposed) | news | `zin_afrit_lose_realm` |
| `zin_aenor.470` | The Golden King in Exile (proposed) | news | `zin_aenor_exile_king` |
| `zin_eindil.170` | The Mirror Without Its King (proposed, in `events_world_eindil_3.json`) | news | the journey's naming fallback |

Not written, because nothing fires them and no soft-lock waits on them: `zin_afrit.12`, `.13` (the complications), `.30` (the war-king rumour), `.40` (the impostor's warnings), `.50` (Aenor Cannot Hold: the flight runs from the focus or the historical fallback) and `.80` (the Ashen Throne, the endings' owner).

## Per soft-lock: the fix and its test

All tests are in `tools/content/events_mech.test.mjs` unless named otherwise.

| Soft-lock | Fix | Test |
| --- | --- | --- |
| SL-04 | `.20` to `.23` written; the Council's month crowns an AI seat 30 days after `zin_aenor_faithful_rule` (historical and ambitious branches the crown, patient the heir, free 80 to 20); `.20`'s wait is offered only until CP06's latest date (`zin_afrit_date_crown_latest`, 1751.2.8) | "SL-04" |
| SL-05 | `.70` to `.76` written; each stage offers Trust the wards first, then Burn the reserves, Draw on the Necklace (not at stage 4) and Through the doors (stage 1, ring attuned), each once per attempt | "SL-05, O2" |
| SL-06 | `zin_eindil_ready_11` reads `zin_afrit_holds_parim = yes` | "SL-06" |
| SL-07 | `zin_afrit_word_of_the_heir` sends `.31` once after the N8 delay; the voyage costs 100 authority and runs once (`zin_afrit_voyage_begun`); historical fallback at journey stage 6 | "SL-07, SL-21" |
| SL-08, SL-30 | `zin_rules_ai_branch_afrit_*` in the Afrit slice, the decisions and the Worshipdom tree (130 rule tests); the Aenor succession reads its three wrappers | "SL-08, SL-30" |
| SL-09 | the return, `.61`, the Parim date and `.62` in the Council's month; trigger `zin_afrit_reduced`; stage 12 opens on it; the coronation sets `zin_afrit_beyond_the_rift` | "SL-09" |
| SL-10 | `zin_afrit_lose_realm` from `on_capitulation`, `on_annex` and the month (Afrit employed by nobody) | "SL-10" |
| SL-11 | `zin_afrit_resolve_seat` and the seat target; the Worshipdom is released by its capital's holder before the flight when it is gone; one month carrier `zin_afrit_pulse_here` | "SL-11" |
| SL-18 | `.82` and the Aenor focus set the global flag | "SL-18" |
| SL-20 | the three focus flags read on any country | "SL-20" |
| SL-21 | `zin_afrit_knows_brother` from `.31`, the voyage, the wound and `.61` | "SL-07, SL-21" |
| SL-25 | `zin_aenor_exile_king` from `on_capitulation` and `on_annex`; `zin_golden_king_natural` in the clock; the Chronicle's line 05 variants and the Golden Court outcome | "SL-25" |
| SL-28 | the 31 events above; the `events_afrit` owner is gone from `data/pending_names.json` | "SL-28" (two tests) |
| SL-31 | `zin_afrit_add_plot` closed after `zin_golden_king_survives` | "SL-31, SL-32" |
| SL-32 | the flight refuses after the stand-in; the stand-in focus needs the flight unset | "SL-31, SL-32" |
| SL-33 | battles 1 to 3 skipped on 1758.3.1 or a year after the return (`zin_eindil_south_unfought`); battle 5 by 1758.9.1 | "SL-33, SL-35, SL-37" |
| SL-35 | `zin_eindil.170` from the naming fallback | "SL-33, SL-35, SL-37"; `events_world.test.mjs` ids |
| SL-37 | `zin_eindil_lose_heir` calls `zin_ending_heir_lost`; `.140` no longer fires `zin_ending.80` itself | "SL-33, SL-35, SL-37" |

Data fixes in the same pass: `zin_eindil.101` is "The Heir Struck Down" (picture `generic_war`, no Zol gate); `zin_reign.19` is "The Feast of Gaelor" and its texts say the feast of Gaelor; the Chronicle's cp23 lines name "a Great Spirit of the black north" (Kusven is never named in public text, C24 to C26). The contract register gains nine names (`zin_afrit_beyond_the_rift`, `zin_afrit_hidden`, `zin_afrit_knows_brother`, `zin_afrit_reduced`, `zin_afrit_resolve_seat`, `zin_afrit_seat`, `zin_eindil_south_unfought`, `zin_golden_king_exiled`, `zin_golden_king_natural`).

## Verification

- Build: `node tools/content/build.mjs` into the default staged tree with a private TEMP and the given `ZIN_ART` snapshot. It passes every slice, the crown events, the story framework, the focus compiler and the reference and text passes, and stops in the asset manifest on 17 errors that are not this pass's: 15 provenance errors of realm-flag sheets in the art snapshot (`PROV_NO_GENERATION`, `PROV_UNREVIEWED`) and two of the war-side files (`zin_mistake.16`/`zin_dominion.15` share a picture; `grave_muster` over its cap in `zin_dominion_war.txt`). Because the build stops before `Staged.write`, the staged tree for inspection was written by a scratch copy of the build that stops before the focus compiler.
- Fired but undefined events over that tree: 70 before this pass, 23 after, none in `zin_afrit`, `zin_aenor`, `zin_eindil` or `zin_reign` (the rest are `zin_east`, `zin_elves`, `zin_dark`, `zin_diplo`, `zin_world.45`, `zin_lerendor.14`, `zin_stabilo.30`/`.31`, `zin_volgan.8` and a vanilla `occupied_countries.2`).
- Tests: see the count in the final report of this pass (`cd tools && npm test`).
- MCP, `hoi4_script_validate` (installed documentation): the bodies of `zin_afrit_lose_realm`, the seat, the flight's release, `set_state_controller_to`, `white_peace`, `change_tag_from`, delayed `country_event`, and the triggers of `zin_afrit_reduced` and the fallbacks: every command supported in its scope; the unresolved findings are argument blocks the prose documentation does not specify and the `event_target:` scope bindings.
- MCP, `hoi4_event_inspect` and `hoi4_event_render`: blocked for the new events. The server indexes only the workspace `mod_zin_86bac5c64231` (the repository's applied mod files), so the staged tree outside it is `SOURCE_FILE_NOT_INDEXED`; a scan of the workspace runs (1150 events, revision `63c9dce2…`) but does not contain these events until the staged tree is applied. The module's own checks and the test cover what the event inspector would lint.

## What only a Linux run can confirm

- That a `major = yes` news event runs its immediate block once per receiving country (the immediate blocks of `.23`, `.62` and `.75` are guarded by global flags either way).
- That `recruit_character` moves `zin_aurevan` out of a capitulated or annexed realm into the refuge, and that `has_character` is false for every country after an annexation that leaves him employed by nobody (the month's catch).
- That `release` gives back the Worshipdom from its capital's holder and that `set_state_controller_to = PREV` gives Parim to the seat on the Parim date.
- That `change_tag_from = ROOT` in the crowning realm moves a human hub to Aenor.
- That a delayed `country_event` with `days = zin_wd` reads the temporary variable (it is used the same way by the voyage already).

## Open and handed on

- Story framework: `zin_world_add_gathering_dark` is still a pending stand-in when the world module is absent; outcome 4 (the Golden Court Endures) should also require `zin_golden_king_exiled` unset; the path module may read `zin_eindil_south_unfought` for CP21 and CP22.
- Realm life (not written): `zin_realm.50` to the exiled King's host (SL-25), and the generic mortality that may end a surviving King with `zin_golden_king_natural` (SL-31).
- Zol and Volgan side: when `zin_zol_withdrawn` and `zin_zol_manifested` retire, the readers in `mech_afrit_script.mjs` (the return) and `mech_eindil_scripts.mjs` (battles 4 and 5) must move to `zin_kusven_withdrawn` and `zin_kusven_forth`.
- The journey still fires `zin_afrit.33` to `zin_afrit_is_hub`, not to the seat; when the Worshipdom is gone the ambush choice is skipped (the ambush still happens by its formula).
- The hunt has no "found" outcome: Afrit's death stays the palace's alone (O2), so after a year of hiding he is only treated as reduced.

## Owner questions

1. Q1 (alternate_history): when Afrit is reduced but alive, may Eindil be crowned, with the world told that the false god is beyond the Rift (`zin_afrit_beyond_the_rift`)? Proposed: yes.
2. Should the fall of Afrit's realm before his flight reveal his name at once (as this pass does, treating the fall as his flight under D3)? Proposed: yes.
3. The Golden King in exile: does he keep a court in exile that can return (a successor event for the realm-life module), or does exile end his story? Proposed: he keeps a court, and the realm-life module decides who feeds it.
4. The Hunt for the False God: should a hunter be able to find and kill Afrit outside the palace, which O2 forbids today? Proposed: no.
5. `zin_eindil.170`: is it right that the Keepers of the Mirror name the heir when Lorien cannot, or should another court of the Lands of the Sun do it? Proposed: the Keepers.
6. `zin_reign.19`: the title is "The Feast of Gaelor" whatever month the clock ends in (the death clock can end in another month under the dynamic rule). Should the feast follow the month of death instead? Proposed: keep Gaelor, the month of mourning, and let a dynamic death keep the title.

## Skills

Used: `hoi4-events` (structure, pictures, timeouts, localisation), `hoi4-mtth` was not needed (no MTTH or weighted pool beyond the option weights, which follow the specs' AI rows). No skill was created or updated: the one reusable lesson (an id inside a nested `country_event` block is a firing, not a definition) is in `definedEventIds` of the module.
