# Music and sound

**Status:** Draft. **Priority:** 5. **Phase:** 7.

The first tracks and the unit sounds may land earlier, with warfare in phase 3. The replacement of vanilla playlists is stage 4 of [06_vanilla_removal_and_zero_errors.md](../00_foundation/06_vanilla_removal_and_zero_errors.md).

## Purpose

ZIN still plays the vanilla Second World War soundtrack, marching boots, rifles, tank engines and the vanilla interface clicks. This spec makes everything a player hears ZIN's own. It covers:

- the music: a main theme, plus peace, war, ideology, region and story playlists;
- the sourcing route for audio, which cannot be generated the way ZIN's pictures are;
- unit sounds for the Erdae hosts, fleets and beasts;
- interface and notification sounds;
- how the vanilla and DLC playlists are switched off.

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
| All art is image-generated. That authorization covers pictures, not audio. | owner decision, 17 October 2026 | CONVENTIONS |
| Every track role, title, condition, sound name and source choice below | **proposed** | this spec |

The vault describes no music. The musical identity below is proposed. It follows the regions and peoples the vault establishes, and it never states a fact the vault leaves open.

## Design

### 1. Rules

1. **Audio is sourced, never generated.** The owner's image-generation route makes no sound. Every audio file in ZIN is licensed external audio with a recorded provenance, or audio commissioned under a written licence. This is the kit's rule (`hoi4-text-audio-research` §11). Code may only trim, fade, cut loops, normalise loudness, resample and encode. It never synthesises tones, noise beds or music.
2. **Two rights, both checked.** A recording carries its own rights apart from the composition. A public-domain composition is usable only with a recording that is itself public domain, CC0 or openly licensed.
3. **Accepted licences:** public domain (composition and recording), CC0 1.0, CC BY 3.0 or 4.0, and a commissioned licence that allows distribution in the mod, the Steam Workshop and the public repository. CC BY-SA 4.0 is accepted only if the owner agrees (open question 2): an edited file stays under BY-SA.
4. **Rejected:** NC licences; ND licences, because trimming, looping and loudness changes are adaptations; any "royalty-free" or stock licence that forbids distributing the file in a form end users can extract (a mod ships raw `.ogg` files); YouTube uploads without a licence; unclear rights; music from any game, film or trailer; AI-generated music, until the owner decides otherwise (open question 3); and **anything taken from another mod**, including music mods installed beside ZIN.
5. **No modern sound.** Nothing a player hears contains gunfire, engines, aircraft, radio, telephones, typewriters, sirens or modern voices. Vocals are wordless, or sung in an invented or unrecognisable tongue, never in English.
6. **No spoilers.** The music player lists every track of a station from the first day, so every track title must be spoiler-free for the whole game. No title names Afrit, Eindil, the Hidden Council or a later event. Tracks tied to the story are gated by contract flags in their `chance` blocks.
7. **Attribution is complete.** Every CC BY track is credited exactly as its licence requires: title, creator, source, licence name and link, and any changes made. Credits appear in `docs/credits/AUDIO.md`, in the *Chronicle of Erdae* codex under "Songs of Erdae" ([04_chronicle_codex.md](../07_interface/04_chronicle_codex.md)), and in the Workshop description.
8. **Downloads follow the session's rules.** This spec authorises no download. The implementing session obtains each file through its own approved route and records the file's source, size and hash.

### 2. Sourcing options

| Option | Examples of sources (each track checked on its own licence page) | Fit for ZIN | Risk | Cost |
| --- | --- | --- | --- | --- |
| A. Public domain and CC0 | OpenGameArt.org (CC0 filter), Free Music Archive (CC0), Musopen (public-domain recordings of public-domain works), Wikimedia Commons (PD or CC0 recordings of early music), Kenney.nl (CC0 sound effects), Freesound.org (CC0 filter) | Good for sound effects, and for early-music colour (harp, lute, chant-like lines). Uneven for an orchestral score. | Lowest: no attribution duty. Recording rights must still be checked on Commons and Musopen. | none |
| B. CC BY composers and libraries | Incompetech (Kevin MacLeod, CC BY 4.0), Scott Buckley (CC BY 4.0), Alexander Nakarada (CC BY 4.0 releases), CC BY fantasy packs on OpenGameArt | Good fantasy and orchestral range | Low, if attribution is exact. Some composers also sell other licences, so the CC BY release itself must be the source. | none |
| C. Commissioned score | A composer engaged by the owner, with a written non-exclusive, perpetual, worldwide licence for ZIN including the Workshop and the public repository, delivering stems | Best identity: one main theme, leitmotifs for Aenor, the elves and the dark powers | Contract and schedule | paid |
| D. Paid stock libraries | Subscription libraries, asset-store packs | Mixed | High: most licences forbid end-user-extractable distribution. Rejected unless a licence explicitly allows game-mod distribution. | paid |
| E. AI music generators | Text-to-music services | Fast | Rights depend on plan terms. Training provenance is disputed. Outside the owner's image-only authorisation. | varies |
| F. Owner-provided audio | Recordings or compositions the owner makes or licenses | Personal | Needs written provenance. Must not come from another mod. | owner |

**Proposal.**

- **Sound effects:** option A. Prefer Kenney CC0 packs, then Freesound and OpenGameArt items that are CC0.
- **Music for the first release:** options A and B. Use CC0 where a fitting track exists, CC BY 4.0 otherwise. Choose for one coherent palette (section 3.1) rather than mixing every style a source offers.
- **Main theme:** option C if the owner agrees (open question 1). Until then the main theme is the best-fitting option B track.

All tracks are logged with full provenance (Implementation). A track whose licence, creator, source or duration cannot be confirmed is marked blocked and never ships.

### 3. Music

#### 3.1 The sound of Erdae

One palette ties the score together: low strings, horns, harp, frame drums, wooden flutes and wordless choir. No modern percussion or synthesizers lead. Regions add one colour each.

| Theme | Character (proposed) |
| --- | --- |
| Middle Lands and Aenor Isle | Court strings and brass; a gilded processional for the Golden Court; temple-bell colour for the Deliverer's worship (public face only) |
| West Lands | Rough fiddles and drums of rival kingdoms; a march that never quite settles |
| North Lands | Sea shanty-like lines without words, low brass for the strait fleets |
| Cold Lands | Open fifths, throat-like drones from instruments (not voices), sparse percussion |
| Dark Lands | Heavy drums and low brass for Goldoroth; a sterner human line for Dondor |
| Magical Lands | Harp, flute and soft choir; slow and old |
| East Lands and South Lands | Plucked strings and hand drums of the caravan roads |
| Dead Lands | Dark low strings and distant drums; Mirolon's watch heard as a lone horn |
| Zol's Mistake | Near-silence: sustained low tones, no melody |
| Lands of the Sun | Bright, slow, tall harmonies |
| Triton's Islands and Islands of the South | Light percussion, sea and wind colour |

#### 3.2 Station and track list

ZIN keeps the engine station name `base_music`, so the vanilla music player and its faceplate work unchanged. Its title `base_music_TITLE` reads **"Songs of Erdae"**.

Song ids are `zin_song_<key>`. The song named `maintheme` is ZIN's main theme (3.3). Factors follow the vanilla pattern: `chance = { modifier = { factor = F <conditions> } }`, checked in the player's country scope.

| Group | Song ids | Count | Plays when (chance) | Release |
| --- | --- | ---: | --- | --- |
| Main theme | `maintheme` | 1 | Main menu; factor 0.5 in play (as vanilla) | first |
| Peace | `zin_song_peace_1` … `_4` | 4 | `has_war = no` and `zin_gathering_dark` below 40: factor 1 | first (3), later (1) |
| Unease | `zin_song_unease_1`, `_2` | 2 | `has_war = no` and `zin_gathering_dark` at 40 or above: factor 2 | later |
| War | `zin_song_war_1` … `_4` | 4 | `has_war = yes`: factor 1 | first (2), later (2) |
| Light | `zin_song_light_peace`, `zin_song_light_war` | 2 | `has_government = democratic` with peace or war: factor 2 | first (1), later (1) |
| Dominion | `zin_song_dominion_peace`, `zin_song_dominion_war` | 2 | `has_government = fascism`: factor 2 | first (1), later (1) |
| Shadow | `zin_song_shadow_1`, `_2` | 2 | `has_government = communism`: factor 2. The Worshipdom starts Light (D1), so this never reveals it at the start. | first (1), later (1) |
| Wild | `zin_song_wild_peace`, `zin_song_wild_war` | 2 | `has_government = neutrality`: factor 2 | first (1), later (1) |
| Regions | `zin_song_region_<key>`, keys `middle_lands`, `west_lands`, `north_lands`, `cold_lands`, `dark_lands`, `magical_lands`, `east_lands` (with the South Lands), `dead_lands`, `zol`, `lands_of_the_sun`, `islands` (Triton's Islands and the Islands of the South) | 11 | Capital in that region: factor 3, through `capital_scope = { zin_in_region_<key> = yes }` | later |
| Story | `zin_song_story_last_crowns_1`, `_2` | 2 | `has_global_flag = zin_war_of_last_crowns` and `has_war = yes`: factor 3 | later |
| Story | `zin_song_story_stranger` | 1 | `has_global_flag = zin_eindil_named`: factor 1.5; factor 0 before | later |
| Story | `zin_song_story_eastern_wind` | 1 | `has_global_flag = zin_afrit_revealed`: factor 1.5; factor 0 before | later |
| Story | `zin_song_story_gathering_dark` | 1 | `zin_gathering_dark` at 70 or above: factor 3 | later |
| Endings | `zin_song_end_lost_cause`, `zin_song_end_children_of_volgan`, `zin_song_end_ashen_throne` | 3 | Never in rotation (factor 0). Played by `play_song` in the ending news events ([04_endings.md](../06_events/04_endings.md)). | later |
| **Total** | | **38** | | **first release: 12** |

**Titles** (proposed, spoiler-free): "The Long Peace", "Roads of the Concord", "Market Bells of Parim", "Quiet Harbours" (peace); "Smoke on the Horizon", "Watchfires" (unease); "The Muster", "Shield Wall", "Iron and Oath", "The Last Field" (war); "Hymn of the Morning", "Vigil" (Light); "The Crowned Road", "Banners of Command" (Dominion); "Low Ground", "Without Stars" (Shadow); "The Free Hills", "Old Blood" (Wild); region tracks are named for their region ("The Middle Lands", …, "Zol's Mistake"); "Crowns Falling", "The Long War" (War of the Last Crowns); "The Stranger's Road"; "The Eastern Wind"; "The Gathering Dark"; "The Lost Cause", "Children of Volgan", "The Ashen Throne" (endings). The titles must not give away a story beat. "The Stranger's Road" fits D4. "The Eastern Wind" names no one.

`zin_in_region_<key>` (state scope) is a new scripted trigger, built from the `zin_region_<key>` collections of [03_diplomacy_and_factions.md](../03_gameplay/03_diplomacy_and_factions.md). It must be registered in [00_contract_additions.md](../04_mechanics/00_contract_additions.md).

#### 3.3 Main menu theme

The vanilla station gives the song `maintheme` its own entry. ZIN defines `music = { name = "maintheme" file = "zin_main_theme.ogg" volume = 0.65 }`, so wherever the engine plays `maintheme`, ZIN's theme plays. The Linux run checks that the main menu opens with the ZIN theme. That run has sound off, so the check reads which song the music player shows as playing. If the menu does not use `maintheme`, the open question goes to the implementing session with the evidence.

#### 3.4 Story cues

Story events call `play_song = <song id>` (everyone hears it) or `scoped_play_song = <song id>` (only the scope's player), as the effects documentation describes. Owner: [06_events](../06_events/) and the super-event specs, which name the moments. This spec supplies only the songs and their rules. No story cue plays before the flag that gates its event.

#### 3.5 Switching off the vanilla playlists

Vanilla and DLC music all load into `music/`. The base game holds `_songs.txt` and `music.asset`. DLC folders mount their files at the same virtual path: `lar_songs.txt`, `nsb_songs.txt`, `bba_songs.txt`, `aat_songs.txt`, `got_songs.txt`, `ncns_songs.txt`, `commonwealth_songs.txt`, `dod_songs.txt`, `wtt_songs.txt` and `mtg_songs.txt`, all on station `base_music`, with their `.asset` files. The "classic" station loads from the subfolders `music/hoi2/` and `music/hoi3/` (`hoi2_soundtrack.txt`, `hoi2_music.asset`, `hoi3_soundtrack.txt`, `hoi3_music.asset`). In total 120 songs are listed in the songs files of this install.

**Route 1 (proposed):**

- Add `replace_path="music"`, `replace_path="music/hoi2"` and `replace_path="music/hoi3"` to both descriptors.
- Ship `music/zin_songs.txt` (`music_station = "base_music"`, the playlist of 3.2) and `music/zin_music.asset` (one `music = { name file volume }` per song).
- The DLC song files in subfolders (`music/Ethiopia/`, `music/China/` and others) are plain `.ogg` files. Once their `.asset` entries are unloaded, nothing names them.

**Route 2 (fallback, if the Linux run still lists vanilla songs):** override by name every file listed above. Each songs file then holds only `music_station = "base_music"` and no songs. Each `.asset` file holds no entries, with one comment line and one ZIN definition kept so that the file is not empty. The two soundtrack files of the classic station are overridden the same way.

**Localisation:** `music_l_english.yml` and the DLC music title files (`aat_music_l_english.yml`, `bba_music_l_english.yml`, `bftb_music_l_english.yml`, `expansion_pass_1_music_l_english.yml`, `goe_music_l_english.yml`, `got_music_l_english.yml`, `la_resistance_music_l_english.yml`, `TAOG_music_l_english.yml` and the rest found by scanning `*music*_l_english.yml`) are overridden by name. They hold only ZIN song titles. Their vanilla keys name songs that no longer exist, so dropping them is safe. `musicplayer_l_english.yml` is overridden whole, with ZIN text for every key, under the rule of [06_vanilla_removal_and_zero_errors.md](../00_foundation/06_vanilla_removal_and_zero_errors.md) §3.5.

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

ZIN entities ([01_warfare.md](../03_gameplay/01_warfare.md) §14) have the states `idle`, `move`, `attack`, `defend`, `support_attack`, `retreat`, `death` and `training`. Today all ten pilot entities play the vanilla `infantry_move_animation` on `move`. That changes to ZIN sound effects named `zin_sfx_<group>_<state>`, each with 3 to 6 variants.

| Group | Entities | `move` | `attack` | `defend` | `death` |
| --- | --- | --- | --- | --- | --- |
| `foot` | men, elves, sun elves, men's cultures | footsteps on earth, leather and mail | sword and spear clash, shouts without words | shield impacts | armour falling |
| `orcs` | orcs | heavier, quicker steps | axe blows, war cries | wood shields | grunt and fall |
| `dead` | the dead revenant, Zol's deathless | dragging steps, bone rattle | dull blows, no voices | bone on iron | collapse to dust |
| `great_kin` | trolls, giants, ents, yeti | ground thuds | huge blows, wood-crack for ents | stone-like impact | heavy fall |
| `demons` | Netherborn | hissing embers, hooves on stone | fire bursts and claws | | |
| `archers` | bow sub-units | as `foot` | bow release and arrow volleys | | |
| `mounted` | cavalry, knights, elves riders | hooves on earth, tack | charge and clash | | horse fall |
| `camel` | camel riders | camel gait, bells | as `mounted` | | |
| `siege` | siege engine | wooden wheels, ropes | catapult release, stone impact | | timber collapse |
| `ships` | galley, warship, great warship, raider | oars and drum (galley), sail and timber creak (others) | ballista release, boarding clash | timber impacts | hull breaking |
| `beasts` | dragon flight, griffin riders (air layer, S6) | wing beats | roar and fire (dragon), screech (griffin) | | |

Vanilla sound effects remain only for map elements ZIN keeps, such as weather and the sea (`Atmosphere`). No ZIN entity, sprite or effect names a vanilla unit sound effect such as `infantry_mg_attack`, `tank_engine_medium_move` or `airplane_bomb`.

#### 4.3 Interface and notification sounds

The proposed character of each replaced cue:

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

**Mechanism.** ZIN adds `sound/zin/zin_ui.asset`, which defines ZIN sound files such as `sound = { name = "zin_ui_click_01" file = "zin/ui/click_01.wav" }`. ZIN's own windows name ZIN sound effects (`zin_ui_click`, `zin_ui_close`, `zin_ui_tab`, `zin_ui_seal`). Vanilla windows keep their `clicksound` names, and those names are re-pointed:

- **Preferred** (if test S1 passes): `sound/zin/zin_ui_effects.asset` redefines only the replaced sound effect names.
- **Otherwise:** `sound/gui/gui_sound_effects.asset` is overridden whole. The builder generates it from the installed file's names, which is the identifier-only rule 5 of the removal spec. Replaced effects list ZIN sounds, and every other effect keeps its vanilla `sound` names.

Cues that are not replaced stay vanilla until their turn. Builder check 7 lists them, so "fully custom" can be measured.

#### 4.4 Categories

Every ZIN sound effect is listed in the matching category (UI cues in `UI`, unit sounds in `Battle`, notifications in `Effects`), so the player's volume sliders work.

- **Preferred** (if test S2 passes): a ZIN file `sound/zin/zin_categories.asset` adds the names under the same category names.
- **Otherwise:** `sound/category.asset` is overridden, generated from the installed names plus ZIN's.

#### 4.5 Event and story sounds

Story events may call `sound_effect = zin_sfx_story_<key>` in `immediate`, for example a bell for the Golden King's death or a horn for the War of the Last Crowns. The event specs name the moments. A super-event cue follows `hoi4-super-events`: unique id, verified rights, and its own entry in the provenance log.

### 5. Formats and loudness

| Kind | Format | Target |
| --- | --- | --- |
| Music | Ogg Vorbis, 44.1 kHz, stereo, quality 5 (about 160 kbit/s) | Integrated loudness −18 LUFS, true peak −1 dBTP; loops cut at zero crossings with 2 s fades where a track does not end naturally; `volume = 0.65` as vanilla |
| Unit and positional sounds | WAV PCM 16-bit, 44.1 kHz, mono | Peak −3 dBFS; length 0.3–3 s |
| Interface and notification sounds | WAV PCM 16-bit, 44.1 kHz, stereo or mono | Peak −6 dBFS; clicks under 0.25 s, notifications under 3 s |
| Size budget | | Music at most 250 MB in total (vanilla averages 8 MB a track); sound effects at most 40 MB |

## Implementation

| Path | Content | Generator |
| --- | --- | --- |
| `docs/design/audio/tracks.json` (new) | Song id, title key, group, chance conditions, source id, loudness target | data |
| `docs/design/audio/sounds.json` (new) | Sound effect names, groups, variants, category, vanilla name re-pointed, source ids | data |
| `audio/source/provenance.jsonl` (new, append-only) | One line per sourced file. Fields: `id`, `kind` (`music`, `sfx`), `title`, `creator`, `performer`, `source_url`, `licence`, `licence_url`, `licence_checked_at`, `attribution`, `original_sha256`, `original_bytes`, `duration_s`, `edits` (trim, fade, loop, normalise), `accepted`, `reviewer`, `note`. No credentials or account data. | session |
| `audio/source/licences/<id>.txt` (new) | The licence statement as shown on the source page, the URL and the retrieval date | session |
| `audio/source/manifest.json` (new) | Shipped file, source id, operations, output sha256 | builder |
| Raw originals | Outside the repository in the builder's raw folder (`zin-audio/raw/`), because of size. The URL and hash allow re-download. | — |
| `tools/content/modules/music.mjs` (new) | `music/zin_songs.txt`, `music/zin_music.asset`, the route 2 overrides if needed, the music title localisation | builder |
| `tools/content/modules/sound.mjs` (new) | `sound/zin/zin_ui.asset`, `zin_units.asset`, `zin_ui_effects.asset` or the `gui_sound_effects.asset` override, the category file, and the entity `event = { sound = … }` lines (passed to the warfare entity module) | builder |
| `tools/content/lib/audio.mjs` (new) | Trim, fade, loop cut, loudness normalisation, resample, encode. Uses an `ffmpeg` binary installed inside the project (`.tools/ffmpeg/`, or the `ffmpeg-static` package), never a global install. | builder |
| `music/zin_main_theme.ogg`, `music/zin/<song id>.ogg` | Music | builder output |
| `sound/zin/ui/*.wav`, `sound/zin/units/<group>/*.wav`, `sound/zin/story/*.wav` | Sounds | builder output |
| `localisation/english/music_l_english.yml` and the DLC music title files (override), `musicplayer_l_english.yml` (override) | Titles and player text | builder |
| `docs/credits/AUDIO.md` (new) | Human-readable credits generated from the provenance log | builder |

**Determinism.** Encoding the same input with the same `ffmpeg` version and settings must give the same bytes. The builder test re-encodes one track and one sound and compares hashes. If the encoder turns out not to be deterministic, the encoded file becomes the source of truth: its hash goes into the manifest, and the test only checks the hash.

**Builder checks.**

1. Every shipped audio file has a manifest line and an accepted provenance line with an accepted licence (rule 3). A rejected licence string (`NC`, `ND`, unknown) fails the build.
2. Every CC BY source has an attribution line, and `docs/credits/AUDIO.md` contains it.
3. Every `soundeffect` and `play_song` name used in ZIN files is defined. Every ZIN sound effect is in a category.
4. File format, sample rate, channels and loudness match section 5 (read from the file headers and a loudness pass).
5. No song title or sound name contains "Afrit", "Eindil", "Hidden Council" or a contract story term. Story songs have a factor of 0 before their flag.
6. No ZIN entity or GUI names a vanilla unit sound effect from the forbidden list (gunfire, engine, aircraft, radio).
7. Report: the vanilla interface sound effects not yet re-pointed, with counts.

**Linux acceptance** (sound is off in the run, so audio is checked indirectly): `error.log` has no sound or music line, such as a missing file or an unknown sound effect. The music player lists only "Songs of Erdae" with ZIN titles. The main menu's playing track is `maintheme`. A capture of the music player goes into the phase report.

**Tests to run first** (Linux run, then record the result in this spec):

- **S1:** a ZIN file that redefines `click_default` overrides the vanilla definition without a duplicate warning.
- **S2:** a ZIN `category = { name = "UI" … }` block adds to the vanilla category rather than replacing or duplicating it.
- **S3:** `replace_path="music"` removes the vanilla and DLC songs from the music player (route 1).

## AI

None. Music and sound do not affect the AI.

## Acceptance

1. With the first release set (12 tracks) installed, the music player shows only ZIN titles under "Songs of Erdae". No vanilla or DLC song is listed, in base music or in the classic station.
2. `error.log` in the Linux run has no line about music or sound.
3. Every shipped audio file traces to an accepted provenance line with an accepted licence. `docs/credits/AUDIO.md` lists every CC BY track with complete attribution.
4. No ZIN unit entity plays a vanilla unit sound. The ten pilot entities play `zin_sfx_<group>_move`.
5. The ten most used vanilla interface cues of 4.3 and all the notification cues play ZIN sounds.
6. Before `zin_eindil_named` and `zin_afrit_revealed`, the gated story songs have a chance of 0, and no title in the music player spoils the story.
7. The builder checks above pass, each with a negative test: a planted NC licence, a missing attribution, an undefined sound effect, a spoiler title, and a 48 kHz file.

## Open questions

1. **Main theme.** Commission an original main theme (option C), or use a CC BY track? A commission gives ZIN its own identity but needs the owner's budget and a contract.
2. **CC BY-SA.** May ZIN ship CC BY-SA tracks? Edited files then stay under BY-SA, inside an otherwise all-rights-reserved repository.
3. **AI music.** The owner authorised image generation only. Should AI-generated music stay excluded, or does the owner want to allow a specific service whose terms grant the needed rights?
4. **Vocals.** Allow wordless choir only, or also sung text in an invented Erdae tongue? An invented tongue would need its words to be proposed lore.
5. **Track count.** Is 38 tracks the right target, or should the region playlists be cut to keep the download small?
