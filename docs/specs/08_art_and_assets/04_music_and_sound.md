# Music and sound

**Status:** Ready. Reviewed 19 October 2026 against CONVENTIONS "Status"; integrated 19 October 2026. **Priority:** 5. **Phase:** 7. The production route below is decision A9 (proposed there as an owner question): music and sound are synthesised in code from ZIN-written scores and recipes; the owner answered on 19 October 2026 that no external audio is used and no main theme is commissioned.

The first tracks and the unit sounds may land earlier, with warfare in phase 3. The replacement of the vanilla playlists is stage 4 of [06_vanilla_removal_and_zero_errors.md](../00_foundation/06_vanilla_removal_and_zero_errors.md) (`music`, `music/hoi2`, `music/hoi3` rows of `tools/content/data/vanilla/dispositions.json`).

## Purpose

ZIN still plays the vanilla Second World War soundtrack, marching boots, rifles, tank engines and the vanilla interface clicks. This spec makes everything a player hears ZIN's own, lawfully, without a single copied file. It covers:

- how ZIN's music and sound are produced, since they cannot be image-generated;
- what stays engine-generic, and why;
- the music: a main theme, plus peace, war, ideology, region and story playlists;
- unit sounds for the Erdae hosts, fleets and beasts;
- interface and notification sounds;
- how the vanilla and DLC playlists are switched off.

## Current state (19 October 2026, commit ca01fa3)

No ZIN audio exists. The vanilla base-game music, DLC music stations, unit sounds and interface sounds play from the player's own installation; ZIN ships no audio file and overrides no audio definition. The five 3D pilot entities play the vanilla `infantry_move_animation` sound on `move`. The `music` folders are scheduled for `replace_path` in stage 4.

## Lore basis

| Fact | Status | Source |
| --- | --- | --- |
| Start: the Golden King reigns, Eindil has not appeared, Afrit is unrevealed, Erdae seems at peace after seventeen centuries | owner-fixed | *The Campaign of 4A 1748* |
| Until `zin_afrit_revealed`, no text a player can read names Afrit or calls the Deliverer a demon | contract rule | [00_shared_contract.md](../04_mechanics/00_shared_contract.md) |
| Before Lorien names him, Eindil is only "the Man from the Ice" | integration decision D4 | [INTEGRATION_DECISIONS.md](../INTEGRATION_DECISIONS.md) |
| The regions of Erdae: Middle Lands with Aenor Isle, West Lands, Triton's Islands, North Lands, Cold Lands, Dark Lands, Magical Lands, Zol's Mistake, East Lands, South Lands, Dead Lands, Islands of the South, Lands of the Sun | established | vault, *Erdae and Its Regions* |
| The Deliverer is publicly worshipped in temples; the Golden Court feasts in Parim; the elves keep apart; Zol's dead stir in the north; Volgan's Southern Dominion arms in the south | established | vault, *The Campaign of 4A 1748*, *Canon Policy* |
| The three endings: The Lost Cause, Children of Volgan, The Ashen Throne | established | *The Campaign of 4A 1748* |
| No firearms, engines or aircraft in Erdae | design | [05_defines_and_rules.md](../00_foundation/05_defines_and_rules.md) |
| All art is image-generated; nothing is copied from other mods or games. That authorisation covers pictures, not audio | owner decision, 17 October 2026 | CONVENTIONS |
| Every production route, track role, title, condition, sound name and synthesis choice below | **proposed** | this spec |

The vault describes no music. The musical identity below is proposed. It follows the regions and peoples the vault establishes, and it never states a fact the vault leaves open.

## Design

### 1. Rules

1. **Nothing copied.** No audio file, sample, loop, soundfont, impulse response or recording from any other source enters ZIN: not from another mod (including music mods installed beside ZIN), not from a game, film or trailer, not from a stock or free library. This keeps audio under the same rule as art: everything is made for ZIN.
2. **Two lawful routes** (proposed, section 2): audio **synthesised by the builder** from ZIN-written scores and sound recipes (the default), or audio **made by or for the owner** under a written licence (only when the owner chooses it).
3. **Not used unless the owner approves it:** third-party library audio, even under CC0 or CC BY (it would be a copied file); AI music or sound generators (outside the owner's image-only authorisation; rights depend on each service's terms).
4. **Original music only.** Scores are composed for ZIN. They quote no melody of a known work, public domain included, so Erdae's music is its own; the review rejects anything that sounds borrowed.
5. **No modern sound.** Nothing a player hears contains gunfire, engines, aircraft, radio, telephones, typewriters, sirens or modern voices. Synthesised choir is wordless.
6. **No spoilers.** The music player lists every track of a station from the first day, so every track title is spoiler-free for the whole game. No title names Afrit, Eindil, the Hidden Council or a later event. Tracks tied to the story are gated by contract flags in their `chance` blocks.
7. **Engine-generic until replaced.** Until a ZIN cue or track is accepted, the vanilla one plays from the player's own installation; ZIN ships nothing in its place and copies nothing. The one exception is modern unit sound (rule 5): a ZIN entity never names a vanilla gunfire, engine or aircraft effect, and plays no sound for that state until its ZIN sound exists.

### 2. How ZIN audio is made

#### 2.1 Route S: synthesised by the builder (default, proposed)

The builder renders every track and cue from data in the repository, in code, with no recorded input. This is lawful because every sample value is computed from ZIN-written numbers, and reproducible because a fresh clone renders the same bytes.

| Part | What it is |
| --- | --- |
| Scores | `tools/content/data/audio/scores/<song id>.json`: tempo, metre, key, sections, and per instrument part a list of note events (start in beats, length, pitch, velocity, articulation). Written by an agent or the owner, never transcribed from another work |
| Instruments | `tools/content/data/audio/instruments.json`: synthesis recipes per voice, from the palette of §3.1: plucked strings (harp, lute, plucked fiddle) by Karplus–Strong string models; bowed low strings and horns by additive and filtered-sawtooth voices with bowing and breath envelopes; wooden flute by sine partials with breath noise; bells, gongs and chimes by modal synthesis; frame drums and hand drums by membrane modes over filtered noise; wordless choir by formant-filtered voices; drones by slow additive pads |
| Sound recipes | `tools/content/data/audio/sounds.json`: per cue a recipe of modal impacts, noise bursts, filters and envelopes (wood tap, brass latch, wax seal, page turn, bell, war horn, footsteps on earth, mail and leather, blade clash, bow release, hooves, wing beats, roar, timber creak, oars) |
| Synthesiser | `tools/content/lib/synth.mjs` (new): pure JavaScript, 44.1 kHz floating point, a seeded pseudo-random generator for every noise source and humanisation, an algorithmic room reverb, a mixer, EBU R128 loudness measurement and normalisation, true-peak limiting, loop cutting at zero crossings |
| Encoding | WAV PCM written by the builder itself; Ogg Vorbis by an encoder pinned in `tools/package.json` and installed inside the project (proposed: the `wasm-media-encoders` package; exact version in `tools/package-lock.json`), never a global install |

A synthesised track or cue ships only after review (section 6). One that does not reach the bar is reworked or left out; the vanilla one keeps playing (rule 7).

#### 2.2 Route C: made by or for the owner (owner's choice)

The owner may record or compose tracks, or commission a composer, under a written licence that is non-exclusive, perpetual and worldwide and covers the mod, the Steam Workshop and the public repository. Route C is unused for now: the owner chose a synthesised main theme on 19 October 2026 (open question 1), and it stays available only for a track the owner later supplies. Route C files follow the same formats, provenance and review; their licence statement is stored with them.

#### 2.3 What stays engine-generic

| Kept from the player's installation | Why |
| --- | --- |
| Map ambience: sea, wind, weather, the camera's world sounds (`Atmosphere` category) | Not tied to the Second World War; replaced later only if a synthesised set passes review |
| DLC music stations in the in-game player | They live in DLC archives that `replace_path` does not reach reliably; ZIN does not try to remove them |
| Any interface or notification cue not yet re-pointed (builder report, check 7) | Rule 7; the report measures what is left |
| All music, until the first-release set of §3.2 is accepted | Rule 7; stage 4 lands only with that set |

### 3. Music

#### 3.1 The sound of Erdae

One palette ties the score together: low strings, horns, harp, frame drums, wooden flutes and wordless choir. No modern percussion or synthesiser lead sound. Regions add one colour each.

| Theme | Character (proposed) |
| --- | --- |
| Middle Lands and Aenor Isle | Court strings and brass; a gilded processional for the Golden Court; temple-bell colour for the Deliverer's worship (public face only) |
| West Lands | Rough fiddles and drums of rival kingdoms; a march that never quite settles |
| North Lands | Sea-shanty-like lines without words, low brass for the strait fleets |
| Cold Lands | Open fifths, low reed drones, sparse percussion |
| Dark Lands | Heavy drums and low brass for Goldoroth; a sterner human line for Dondor |
| Magical Lands | Harp, flute and soft choir; slow and old |
| East Lands and South Lands | Plucked strings and hand drums of the caravan roads |
| Dead Lands | Dark low strings and distant drums; Mirolon's watch heard as a lone horn |
| Zol's Mistake | Near-silence: sustained low tones, no melody |
| Lands of the Sun | Bright, slow, tall harmonies |
| Triton's Islands and Islands of the South | Light percussion, sea and wind colour |

#### 3.2 Station and track list

ZIN keeps the engine station name `base_music`, so the vanilla music player (`interface/musicplayer.gui`, window `musicplayer_window`) and its faceplate work unchanged. Its title `base_music_TITLE` (vanilla "Default Soundtrack", `musicplayer_l_english.yml`) reads **"Songs of Erdae"**.

Song ids are `zin_song_<key>`. The song named `maintheme` is ZIN's main theme (3.3). Factors follow the vanilla pattern of `music/_songs.txt`: `music = { song = "<id>" chance = { modifier = { factor = F <conditions> } } }`, checked in the player's country scope.

| Group | Song ids | Count | Plays when (chance) | Release |
| --- | --- | ---: | --- | --- |
| Main theme | `maintheme` | 1 | Main menu; factor 0.5 in play (as vanilla) | first |
| Peace | `zin_song_peace_1` … `_4` | 4 | `has_war = no` and `zin_gathering_dark` below 40: factor 1 | first (3), later (1) |
| Unease | `zin_song_unease_1`, `_2` | 2 | `has_war = no` and `zin_gathering_dark` at 40 or above: factor 2 | later |
| War | `zin_song_war_1` … `_4` | 4 | `has_war = yes`: factor 1 | first (2), later (2) |
| Light | `zin_song_light_peace`, `zin_song_light_war` | 2 | `has_government = democratic` with peace or war: factor 2 | first (1), later (1) |
| Dominion | `zin_song_dominion_peace`, `zin_song_dominion_war` | 2 | `has_government = fascism`: factor 2 | first (1), later (1) |
| Shadow | `zin_song_shadow_1`, `_2` | 2 | `has_government = communism`: factor 2. The Worshipdom starts Light (D1), so this never reveals it at the start | first (1), later (1) |
| Wild | `zin_song_wild_peace`, `zin_song_wild_war` | 2 | `has_government = neutrality`: factor 2 | first (1), later (1) |
| Regions | `zin_song_region_<key>`, keys `middle_lands`, `west_lands`, `north_lands`, `cold_lands`, `dark_lands`, `magical_lands`, `east_lands`, `dead_lands`, `zols_mistake`, `lands_of_the_sun`, `islands` | 11 | The player's region of origin: factor 3, through `has_country_flag = zin_region_<key>` (contract additions register; `islands` matches `zin_region_tritons_islands` or `zin_region_islands_of_the_south`) | later |
| Story | `zin_song_story_last_crowns_1`, `_2` | 2 | `has_global_flag = zin_war_of_last_crowns` and `has_war = yes`: factor 3 | later |
| Story | `zin_song_story_stranger` | 1 | `has_global_flag = zin_eindil_named`: factor 1.5; factor 0 before | later |
| Story | `zin_song_story_eastern_wind` | 1 | `has_global_flag = zin_afrit_revealed`: factor 1.5; factor 0 before | later |
| Story | `zin_song_story_gathering_dark` | 1 | `zin_gathering_dark` at 70 or above: factor 3 | later |
| Endings | `zin_song_end_lost_cause`, `zin_song_end_children_of_volgan`, `zin_song_end_ashen_throne` | 3 | Never in rotation (factor 0). Played by `play_song` in the ending news events ([04_endings.md](../06_events/04_endings.md)) | later |
| **Total** | | **38** | | **first release: 12** |

Gathering Dark conditions read the global variable with `check_variable = { global.zin_gathering_dark > 39 }` (and `< 40`, `> 69`).

**Titles** (proposed, spoiler-free): "The Long Peace", "Roads of the Concord", "Market Bells of Parim", "Quiet Harbours" (peace); "Smoke on the Horizon", "Watchfires" (unease); "The Muster", "Shield Wall", "Iron and Oath", "The Last Field" (war); "Hymn of the Morning", "Vigil" (Light); "The Crowned Road", "Banners of Command" (Dominion); "Low Ground", "Without Stars" (Shadow); "The Free Hills", "Old Blood" (Wild); region tracks are named for their region ("The Middle Lands", …, "Zol's Mistake"); "Crowns Falling", "The Long War" (War of the Last Crowns); "The Stranger's Road"; "The Eastern Wind"; "The Gathering Dark"; "The Lost Cause", "Children of Volgan", "The Ashen Throne" (endings). "The Stranger's Road" fits D4. "The Eastern Wind" names no one.

#### 3.3 Main menu theme

The vanilla station gives the song `maintheme` its own entry (`music/music.asset`: `hoi4mainthemeallies.ogg`). ZIN's `music/zin_music.asset` defines `music = { name = "maintheme" file = "zin_main_theme.ogg" volume = 0.65 }`, so wherever the engine plays `maintheme`, ZIN's theme plays. The Linux run has sound off, so the check reads which song the music player shows as playing. If the menu does not use `maintheme`, the result is recorded here and the music module adapts.

#### 3.4 Story cues

Story events call `play_song = <song id>` (everyone hears it) or `scoped_play_song = <song id>` (only the scope's player), both in the installed `documentation/effects_documentation.md`. Owner: [06_events](../06_events/) and the super-event specs, which name the moments. This spec supplies only the songs and their rules. No story cue plays before the flag that gates its event.

#### 3.5 Switching off the vanilla playlists

Vanilla and DLC music all load into `music/`. The base game holds `_songs.txt` and `music.asset`. DLC folders mount their files at the same virtual path: `lar_songs.txt`, `nsb_songs.txt`, `bba_songs.txt`, `aat_songs.txt`, `got_songs.txt`, `ncns_songs.txt`, `commonwealth_songs.txt`, `dod_songs.txt`, `wtt_songs.txt` and `mtg_songs.txt`, all on station `base_music`, with their `.asset` files. The "classic" station loads from `music/hoi2/` and `music/hoi3/` (`hoi2_soundtrack.txt`, `hoi2_music.asset`, `hoi3_soundtrack.txt`, `hoi3_music.asset`). An `.asset` file names its `.ogg` files relative to its own folder.

**Route 1 (proposed):**

- Stage 4 adds `replace_path="music"`, `replace_path="music/hoi2"` and `replace_path="music/hoi3"` to both descriptors (the dispositions rows exist; `modules/vanilla_removal.mjs` writes them when the stage is raised).
- ZIN ships `music/zin_songs.txt` (`music_station = "base_music"`, the playlist of 3.2), `music/zin_music.asset` (one `music = { name file volume }` per song) and the `.ogg` files beside them (`music/zin_<song id>.ogg`, `music/zin_main_theme.ogg`). Each replaced folder keeps ZIN content, so `music/hoi2/` and `music/hoi3/` each get a ZIN soundtrack file with the station header and no songs.
- Stage 4 is raised only when the first-release set (12 tracks) is accepted; before that the vanilla music plays (rule 7).

**Route 2 (fallback, if the Linux run still lists vanilla songs):** override by name every songs and asset file listed above, each holding only its station header and no songs (identifier-only, rule 5 of the removal spec).

**Localisation:** the music title files (`music_l_english.yml` and the DLC music title files found by scanning the installed `*music*_l_english.yml`) are overridden by name with only ZIN song titles; their vanilla keys name songs that no longer exist, so dropping them is safe. `musicplayer_l_english.yml` is overridden whole, with ZIN text for every key, under the removal spec's rule for UI text (§3.5 of that spec).

**Radio-pack DLC** that is not installed on the reference machine also mounts into `music/` and is unloaded by route 1. With route 2, unknown file names cannot be overridden. That is a recorded limitation, and route 1 is preferred for this reason.

### 4. Sound

#### 4.1 How HOI4 sound is wired (measured on version 1.19.3)

| Layer | Vanilla file | Form |
| --- | --- | --- |
| Sound file | `sound/sound.asset`, `sound/soundeffects.asset` and others | `sound = { name = "x" file = "menu/x.wav" always_load = yes volume = 0.5 }`; path relative to `sound/` |
| Sound effect | `sound/gui/gui_sound_effects.asset` (202 effects: every interface click and notification), `sound/soundeffects.asset` (273: units, combat, map) | `soundeffect = { name = x volume = 0.45 falloff = "falloff_80" sounds = { sound = x_01 sound = x_02 } max_audible = 1 }`; one of the `sounds` is picked at random |
| Category | `sound/category.asset`: `Effects`, `Battle`, `UI`, `nonControllableEntities`, `Atmosphere` | Lists sound effect names; drives the volume sliders and the compressor |
| Use | `.gui` `clicksound = click_default` and `oversound`; entity states `event = { sound = { soundeffect = "x" } }`; effects `sound_effect = x` and `scoped_sound_effect = x` | |

The vanilla interface uses `click_default` 758 times, `click_checkbox` 347, `click_close` 227, `click_scroll` 81, `click_ok` 51, `click_send` 22 and `click_battleplan` 22. Vanilla sound files are WAV PCM at 44.1 kHz: 667 stereo 16-bit, 292 mono 16-bit, and 23 at 24-bit.

#### 4.2 Unit sounds

ZIN entities ([01_warfare.md](../03_gameplay/01_warfare.md) §14) have the states `idle`, `move`, `attack`, `defend`, `support_attack`, `retreat`, `death` and `training`. Each changes to ZIN sound effects named `zin_sfx_<group>_<state>`, each with 3 to 6 synthesised variants (different seeds of one recipe).

| Group | Entities | `move` | `attack` | `defend` | `death` |
| --- | --- | --- | --- | --- | --- |
| `foot` | men, elves, sun elves, men's cultures | footsteps on earth, leather and mail | blade and spear clash, short wordless shouts (formant bursts) | shield impacts | armour falling |
| `orcs` | orcs | heavier, quicker steps | axe blows, war cries | wood shields | grunt and fall |
| `dead` | the dead revenant, Zol's deathless | dragging steps, bone rattle | dull blows, no voices | bone on iron | collapse to dust |
| `great_kin` | trolls, giants, ents, yeti | ground thuds | huge blows, wood-crack for ents | stone-like impact | heavy fall |
| `demons` | Netherborn | hissing embers, hooves on stone | fire bursts and claws | | |
| `archers` | bow sub-units | as `foot` | bow release and arrow volleys | | |
| `mounted` | cavalry, knights, elven riders | hooves on earth, tack | charge and clash | | horse fall |
| `camel` | camel riders | camel gait, bells | as `mounted` | | |
| `siege` | siege engine | wooden wheels, ropes | engine release, stone impact | | timber collapse |
| `ships` | galley, warship, great warship, raider | oars and drum (galley), sail and timber creak (others) | ballista release, boarding clash | timber impacts | hull breaking |
| `beasts` | dragon flight, griffin riders (air layer, S6; griffins only if adopted) | wing beats | roar and fire (dragon), screech (griffin) | | |

Vanilla sound effects remain only for map elements ZIN keeps (`Atmosphere`). No ZIN entity, sprite or effect names a vanilla unit sound effect such as `infantry_mg_attack`, `tank_engine_medium_move` or `airplane_bomb`; the pilots' vanilla `infantry_move_animation` is replaced by `zin_sfx_foot_move` (or the group of their people) in the same build that ships it.

#### 4.3 Interface and notification sounds

The proposed character of each replaced cue (each a synthesis recipe in `sounds.json`):

| Vanilla sound effect | Uses (`.gui`) | ZIN cue |
| --- | ---: | --- |
| `click_default` | 758 | soft tap of wood on wood |
| `click_checkbox` | 347 | small brass latch |
| `click_close` | 227 | a book closing softly |
| `click_scroll` | 81 | parchment sliding |
| `click_ok` | 51 | wax seal pressed |
| `click_send` | 22 | courier's hand bell, short |
| `click_battleplan` | 22 | map pin on board |
| `decisions_ui_button`, `decisions_ui_tab` | 12 | quill stroke, page turn |
| `event_popup` | engine | struck bell, distant |
| `complete_focus` | engine | low gong |
| `research_complete` | engine | chime of a scholar's bell |
| `diplomatic_notification` | engine | seal and ribbon |
| `join_faction` | engine | two cups touching |
| `justify_wargoals` | engine | sword drawn halfway |
| `player_declare_war`, `enemy_declare_war` | engine | war horn; a lower, distant horn for the enemy |
| `peace_conference` | engine | assembly bell |
| `world_news_effect` | engine | herald's short fanfare |

**Mechanism.** ZIN adds `sound/zin/zin_sounds.asset`, which defines ZIN sound files such as `sound = { name = "zin_ui_click_01" file = "zin/ui/click_01.wav" }` (path relative to `sound/`, as vanilla). ZIN's own windows name ZIN sound effects (`zin_ui_click`, `zin_ui_close`, `zin_ui_tab`, `zin_ui_seal`). Vanilla windows keep their `clicksound` names, and those names are re-pointed:

- **Preferred** (if test S1 passes): `sound/zin/zin_ui_effects.asset` redefines only the replaced sound effect names.
- **Otherwise:** `sound/gui/gui_sound_effects.asset` is overridden whole. The builder generates it from the installed file's names (identifier-only, rule 5 of the removal spec). Replaced effects list ZIN sounds, and every other effect keeps its vanilla `sound` names.

Cues that are not replaced stay vanilla until their turn. Builder check 7 lists them, so "fully custom" can be measured.

#### 4.4 Categories

Every ZIN sound effect is listed in the matching category (UI cues in `UI`, unit sounds in `Battle`, notifications in `Effects`), so the player's volume sliders work.

- **Preferred** (if test S2 passes): a ZIN file `sound/zin/zin_categories.asset` adds the names under the same category names.
- **Otherwise:** `sound/category.asset` is overridden, generated from the installed names plus ZIN's.

#### 4.5 Event and story sounds

Story events may call `sound_effect = zin_sfx_story_<key>` in `immediate`, for example a bell for the Golden King's death or a horn for the War of the Last Crowns. The event specs name the moments. A super-event cue follows the same route (synthesised, or route C), with its own provenance line.

### 5. Formats and loudness

| Kind | Format | Target |
| --- | --- | --- |
| Music | Ogg Vorbis, 44.1 kHz, stereo, quality 5 (about 160 kbit/s) | Integrated loudness −18 LUFS, true peak −1 dBTP; loops cut at zero crossings with 2 s fades where a track does not end naturally; `volume = 0.65` as vanilla; 2 to 5 minutes |
| Unit and positional sounds | WAV PCM 16-bit, 44.1 kHz, mono | Peak −3 dBFS; length 0.3–3 s |
| Interface and notification sounds | WAV PCM 16-bit, 44.1 kHz, stereo or mono | Peak −6 dBFS; clicks under 0.25 s, notifications under 3 s |
| Size budget | | Music at most 250 MB in total; sound effects at most 40 MB |

### 6. Review

Each rendered track or cue gets a listening review before acceptance, recorded as a review line (`accepted`, `reviewer`, `note`), as art review lines are. Checklist: fits its role and the palette; no modern timbre; no recognisable borrowed melody; no clipping, clicks or harsh noise; loops seamlessly where it loops; loudness within §5. The main theme and the first-release set need the owner's approval before the phase 7 release (proposed approval group). Agent-accepted audio may ship during development.

## Implementation

| Path | Content | Writer |
| --- | --- | --- |
| `tools/content/data/audio/tracks.json` (new) | Song id, title key, group, chance conditions, route (`S` or `C`), score path or source id, loudness target | builder data |
| `tools/content/data/audio/scores/<song id>.json` (new) | Route S scores | builder data (authored) |
| `tools/content/data/audio/instruments.json`, `sounds.json` (new) | Instrument recipes; sound effect names, groups, variants, category, the vanilla name re-pointed, recipe | builder data |
| `tools/content/lib/synth.mjs` (new) | The synthesiser, mixer, reverb, loudness and loop tools (§2.1) | — |
| `tools/content/lib/audio_io.mjs` (new) | WAV writer, Ogg Vorbis encoding through the pinned encoder, header reading for checks | — |
| `tools/content/modules/music.mjs` (new) | Renders accepted tracks; writes `music/zin_songs.txt`, `music/zin_music.asset`, the `.ogg` files, the classic-station files of route 1 (or the route 2 overrides), the music title localisation and `musicplayer_l_english.yml`; called from `build.mjs` | builder |
| `tools/content/modules/sound.mjs` (new) | Renders accepted cues; writes `sound/zin/zin_sounds.asset`, `zin_units.asset`, `zin_ui_effects.asset` or the `gui_sound_effects.asset` override, the category file, and the entity `event = { sound = … }` lines (passed to `modules/units3d.mjs`) | builder |
| `tools/content/audio.test.mjs` (new) | Builder checks below with negative tests | — |
| `audio/source/provenance.jsonl` (new, append-only) | One render line per shipped file: `id`, `kind` (`music`, `sfx`), `route`, `score` or `recipe` path and its sha256, `synth` (sha256 of `lib/synth.mjs` and `instruments.json`), `seed`, `encoder` and version, `sha256`, `duration_s`, `at`; route C lines add `creator`, `licence`, `licence_file`, `original_sha256`, `edits`. Review lines as in §6. No credentials or account data | builder, reviewer |
| `audio/source/licences/<id>.txt` (new) | Route C only: the signed licence statement | owner |
| `audio/source/audio_manifest.json` (new) | Shipped file, source id, operations, output sha256 | builder |
| `music/zin_songs.txt`, `music/zin_music.asset`, `music/zin_*.ogg`, `music/hoi2/zin_hoi2_soundtrack.txt`, `music/hoi3/zin_hoi3_soundtrack.txt` | Music (stage 4) | `music.mjs` |
| `sound/zin/ui/*.wav`, `sound/zin/units/<group>/*.wav`, `sound/zin/story/*.wav` | Sounds | `sound.mjs` |
| `localisation/english/music_l_english.yml` and the DLC music title files (override), `musicplayer_l_english.yml` (override) | Titles and player text | `music.mjs` |
| `docs/credits/AUDIO.md` (new) | Human-readable credits generated from the provenance log ("synthesised for ZIN" or the route C credit) | `music.mjs` |

**Determinism.** Synthesis is a pure function of the data and the seeds; WAV output is byte-identical across builds on the pinned Node version. The build test renders one track and one cue twice and compares hashes. If the Vorbis encoder turns out not to be byte-deterministic, the encoded file becomes the shipped source: its hash goes into the manifest, it is re-encoded only when its score changes, and the test checks the hash.

**Builder checks.**

1. Every shipped audio file has a manifest line and an accepted review line; a route C file also has a licence file. A file with neither a render line nor a licence fails the build.
2. No audio input is read from outside `tools/content/data/audio/` (route S) or `audio/source/` (route C): no sample, soundfont or recording enters the synthesiser.
3. Every `soundeffect` and `play_song` name used in ZIN files is defined. Every ZIN sound effect is in a category.
4. File format, sample rate, channels and loudness match section 5 (read from the file headers and a loudness pass).
5. No song title or sound name contains "Afrit", "Eindil", "Hidden Council" or a contract story term. Story songs have a factor of 0 before their flag.
6. No ZIN entity or GUI names a vanilla unit sound effect from the forbidden list (gunfire, engine, aircraft, radio).
7. Report: the vanilla interface sound effects not yet re-pointed, with counts.
8. Stage 4's `replace_path` lines for `music` are written only when every first-release track is accepted.

**Linux acceptance** (sound is off in the run, so audio is checked indirectly): `error.log` has no sound or music line, such as a missing file or an unknown sound effect. The music player lists only "Songs of Erdae" with ZIN titles. The main menu's playing track is `maintheme`. A capture of the music player goes into the phase report.

**Tests to run first** (Linux run, then record the result in this spec):

- **S1:** a ZIN file that redefines `click_default` overrides the vanilla definition without a duplicate warning.
- **S2:** a ZIN `category = { name = "UI" … }` block adds to the vanilla category rather than replacing or duplicating it.
- **S3:** `replace_path="music"` removes the vanilla and DLC songs from the music player (route 1).
- **S4:** a sound file path `zin/ui/click_01.wav` in `sound/zin/zin_sounds.asset` resolves (no missing-file line).

## AI

None. Music and sound do not affect the AI.

## Acceptance

1. With the first-release set (12 tracks) accepted and stage 4 applied, the music player shows only ZIN titles under "Songs of Erdae". No vanilla or DLC song is listed, in base music or in the classic station.
2. `error.log` in the Linux run has no line about music or sound.
3. Every shipped audio file traces to an accepted review line and a render line (route S) or a licence file (route C). `docs/credits/AUDIO.md` lists every file's credit.
4. No ZIN unit entity plays a vanilla unit sound. The pilot entities play their group's `zin_sfx_<group>_move`.
5. The ten most used vanilla interface cues of 4.3 and all the notification cues play ZIN sounds.
6. Before `zin_eindil_named` and `zin_afrit_revealed`, the gated story songs have a chance of 0, and no title in the music player spoils the story.
7. The builder checks above pass, each with a negative test: a file with no render or licence line, a sample file fed to the synthesiser, an undefined sound effect, a spoiler title, a 48 kHz file, and a stage 4 descriptor with an unaccepted track.
8. Two builds render byte-identical WAV files.

## Open questions

Each proceeds on the proposal; the owner may overrule.

1. **Main theme.** Synthesised by route S; no theme is commissioned (owner answer, 19 October 2026; A9).
2. **The audio route itself.** Decided by A9 and the owner's answer of 19 October 2026: audio is synthesised from ZIN-written scores and recipes, and no third-party library or AI audio is used, although the kit's default is licensed external audio with provenance (this also answers OPEN_QUESTIONS, warfare 10).
3. **AI audio.** Excluded unless the owner names a service whose terms grant the needed rights (proposed).
4. **Vocals.** Wordless synthesised choir only; an invented Erdae tongue would be proposed lore and waits for the owner (proposed).
5. **Track count.** 38 tracks, 12 in the first release (proposed).
