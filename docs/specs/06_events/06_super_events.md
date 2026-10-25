# Super Events

**Status:** Draft for owner review. Design and text proposed on 25 October 2026 under owner decision K52; the framework is implemented (`tools/content/modules/super_events.mjs`), the pictures and recordings are pending their specialists.
**Basis:** owner decision K52 of 25 October 2026, in [INTEGRATION_DECISIONS.md](../INTEGRATION_DECISIONS.md): "The mod should have its own designed super events for major events", a full-screen ZIN presentation with its own generated picture, an in-world quote and licensed sound (owner answer Q-08, decision K16: licensed recordings), shown to every player when one of the age's great moments happens.
**Companions:** [alternate_history.md](../../design/alternate_history.md) (beats and checkpoints), [04_endings.md](04_endings.md), [09_voice_and_style.md](../02_lore/09_voice_and_style.md), [knowledge_layers.md](../../lore/references/knowledge_layers.md), the repository skill `hoi4-super-events`.
**Data:** `tools/content/data/super_events.json` holds every text, brief and hook below; this file and the data must agree (a test checks the titles, buttons, quotes and hooks).

Every title, description, button, quote, attribution and brief in this file is ZIN-proposed text, written for the owner to accept or change; the lore under it keeps the status its own source gives it.

## 1. Purpose

A handful of moments change the age for everybody who plays it: the Golden King dies, a god takes his crown, the heir of Aen is named, the War of the Last Crowns begins, the dark powers march, the false god is unmasked and dies, and the age ends one way or another.
The ordinary event popup and the news event tell the player what happened; a super event makes the moment felt.
It takes over the whole screen, shows a large painting of the moment, tells it in a few paragraphs in the chronicler's voice, sets a short line from somebody of Aoaz beside it, and plays a recording chosen for that moment.

A super event never changes the game: it is presentation only, and the owning event or effect keeps every gameplay consequence.

## 2. What counts as a super event

A moment qualifies when all of these hold:

1. It is a beat of the main storyline (`alternate_history.md`, B01 to B45) or an ending, and it changes the age for every realm, not only for its owner.
2. It happens once per game, at a moment marked by one global story flag that the owning module sets.
3. Its public meaning can be told to every player without breaking the knowledge layers at the moment it fires.

Moments left out on purpose: the start (B01, no single moment), the Council's verdict and the plot (B02, secret), the road south and the Grey Ford (B04, B05, regional), the Thirty Days (B08, inside the Golden King's death and the crowning), the storm and the islands (B11), Afrit's voyage and the ambush (B13, B14, secret), the hall of Horos (B15, its meaning is gated by Yeldenne), the warnings and the denunciation (B16), the forest and the dragon pact (B17, told by the heir's return), Lerendor's withdrawal (B19) and the eastern invasion (B21, regional), the fall of Mirolon (B22, told by Volgan's march a few weeks later), the West's evacuation (B28), the wave of Glo (B30), the Black Compact (B31, a dark bargain few would know), the breaking of the blue sword (seven days after Kusven comes forth, and only while Glo is with the heir; told by Kusven's coming and Lorien's fall), the New Gods' restoration of the heir (B33, the heir's own story), the field hailing (B37), Afrit's return and the cliff (B38 to B40, told by his death), and the heir lost (`zin_eindil_lost`, a divergence; an owner question below).

## 3. The list

Twenty-six super events: seventeen moments of the historical storyline, the eight endings, and the fall of Nafeher with Volgan's body intact, which the owner made a super event in answer Q-74 (K59, 25 October 2026).
Ids are stable registration numbers: an id is never reused for another moment.

| Id | Key | Title | Beat | Hook flag (set by) | Role |
| --- | --- | --- | --- | --- | --- |
| 1 | `man_in_the_ice` | The Man in the Ice | B03 | `zin_eindil_awake` (`zin_eindil_enter_1`) | first reveal |
| 2 | `golden_king_dead` | The Golden King Is Dead | B07 | `zin_golden_king_dead` (Aenor court) | irreversible political shift |
| 3 | `deliverer_crowned` | The Deliverer Takes the Crown | B09 | `zin_aurevan_crowned` (`zin_afrit_crown_aurevan`) | ideological transformation |
| 4 | `heir_of_aen` | The Heir of Aen | B12 | `zin_eindil_named` (`zin_eindil_name_him`) | first reveal |
| 5 | `last_crowns` | The War of the Last Crowns | B18 | `zin_war_of_last_crowns` (world tension, with news `zin_world.20`) | escalation |
| 6 | `western_crossing` | The Western Crossing | B20 | `zin_western_crossing` (`zin_west_launch_crossing`) | escalation |
| 7 | `black_north_marches` | The Black North Marches | B24 | `zin_zol_rising` (`zin_zol_rise`) | global threat escalation |
| 8 | `volgan_marches` | Volgan Marches North | B23 | `zin_volgan_marches` (`zin_volgan_begin_march`) | global threat escalation |
| 9 | `name_of_the_deliverer` | The Name of the Deliverer | B25 | `zin_afrit_revealed` (`zin_afrit_reveal`) | first reveal |
| 10 | `king_of_the_east` | A King in the East | B26 | `zin_afrit_king_of_east` (Afrit chain) | faction formation |
| 11 | `parim_taken` | Western Banners over Parim | B27 | `zin_west_parim_taken` (Western Crossing) | irreversible political shift |
| 12 | `heir_returns` | The Heir Returns | B29 | `zin_eindil_returned` (journey stage 9) | global response |
| 13 | `varner_falls` | Varner Falls | B32 | `zin_varner_dead` (`zin_eindil.97`) | defeat aftermath |
| 14 | `volgan_broken` | The Body of Volgan Is Broken | B34 | `zin_volgan_body_destroyed` (`zin_volgan_destroy_body`) | defeat aftermath |
| 15 | `kusven_forth` | The Grave-Wind | B35 | `zin_kusven_forth` (`zin_zol_send_kusven`) | global threat escalation |
| 16 | `lorien_falls` | King Lorien Falls | B36 | `zin_lorien_dead` (`zin_sun_lorien_falls`) | defeat aftermath |
| 17 | `afrit_dead` | Afrit Is Dead | B41 | `zin_afrit_dead` (`zin_afrit_die`) | defeat aftermath |
| 18 | `ending_lost_cause` | A King of Aen's Line | B42 | `zin_ending_lost_cause` (`zin_world_reach_ending`) | campaign-ending signal |
| 19 | `ending_children_of_volgan` | Children of Volgan | B43 | `zin_ending_children_of_volgan` (`zin_world_reach_ending`) | world-end scenario |
| 20 | `ending_ashen_throne` | The Ashen Throne | B44 | `zin_ending_ashen_throne` (`zin_world_reach_ending`) | world-end scenario |
| 21 | `ending_golden_court` | The Golden Court Endures | B45 | `zin_ending_golden_court` (`zin_world_reach_ending`) | campaign-ending signal |
| 22 | `ending_western_crown` | A Western Crown in Parim | B45 | `zin_ending_western_crown` (`zin_world_reach_ending`) | campaign-ending signal |
| 23 | `ending_strait_master` | Master of the Strait | B45 | `zin_ending_strait_master` (`zin_world_reach_ending`) | campaign-ending signal |
| 24 | `ending_eastern_king` | One King in the East | B45 | `zin_ending_eastern_king` (`zin_world_reach_ending`) | campaign-ending signal |
| 25 | `ending_unfinished` | The Age Unfinished | B45 | `zin_ending_unfinished` (`zin_world_reach_ending`) | campaign-ending signal |
| 26 | `nafeher_falls` | The Fall of Nafeher | B34 divergence | `zin_volgan_withdrawn_south` (`zin_volgan_withdraws_south`, with news `zin_dominion.29`) | defeat aftermath |

The ids follow the historical order of the beats' target dates, except that the Black North (B24, target Kerun 4A 1755) comes before Volgan's march (B23, target Naisa 4A 1755) because the dead rise first on the historical path; id 26 was added after the first registration and keeps the next free number, because ids are never renumbered.
Off the historical path the moments come in whatever order the game produces, and some never come; a super event has no date of its own.

The Lost Cause ending replaces a separate super event for Eindil's coronation: the coronation calls `zin_world_check_endings`, which reaches the Lost Cause the same day, so one presentation tells both.

## 4. Who sees it and when

1. **Every human player sees every super event once per game.** The owning module sets its flag; the builder calls `zin_super_event_<key>` on the next line (section 6); the effect sets `zin_se_done_<key>` and opens the window for every country with `is_ai = no`. AI realms are not shown anything.
2. **One at a time.** If a player's window is already open, the new id is queued in that player's country array `zin_se_queue` and shown when the player closes the current one. The window says how many more are waiting.
3. **Text at the moment.** Every text is written for the knowledge layers that hold when its flag is set. Text that would change if the reveal came earlier (the crowning) reads the gate through `[zin_loc_deliverer]`.
4. **The owning event stays.** The news event or the owner's event still fires with its options; the super event is the presentation on top of it.

## 5. The window

**Design.** A full-screen presentation in the ZIN interface style: the whole screen is covered by the ZIN frame (`GFX_zin_frame`), which also keeps the map from being clicked while the moment is told, and a centred panel of 1180 x 680 on the same frame carries the moment.
The panel fills a 1280 x 720 screen at UI scale 1 with a margin on each side and sits centred on larger screens.

| Region | Element | Content and interaction | Assets and states |
| --- | --- | --- | --- |
| Backdrop | `zin_super_event_window` (100% x 100%) | Covers the screen; no interaction | `GFX_zin_frame`, tiled |
| Panel | `zin_se_panel` (1180 x 680, centred) | Holds the moment | `GFX_zin_frame` |
| Title | `zin_se_title` (40, 22; 1100 x 44) | `[zin_loc_super_event_title]`, `hoi_36header`, centred | |
| Date | `zin_se_date` (40, 66; 1100 x 20) | `[GetDateText]`, the day the window opened | |
| Top rule | `zin_se_rule_top` (330, 92) | Divider under the title | `GFX_zin_rule` |
| Picture | `zin_se_picture_frame` (30, 112; 716 x 516) and `zin_se_picture` (38, 120; 700 x 500) | The painting of the moment, chosen by the scripted GUI property `image = "[zin_loc_super_event_picture]"` | `GFX_zin_se_<key>`, pending art; the slot shows the empty frame until a picture ships, never a stand-in picture |
| Description | `zin_se_desc` (770, 112; 380 x 272) | `[zin_loc_super_event_desc]`, `hoi_16mbs`; sized for the longest descriptions (ids 3 and 10, 690 characters in three paragraphs) | |
| Middle rule | `zin_se_rule_mid` (770, 396; scale 0.73) | Divider | `GFX_zin_rule` |
| Quote | `zin_se_quote` (770, 414; 380 x 160) | `[zin_loc_super_event_quote]`: the line, then `- attribution` | |
| Continue | `zin_se_close` (780, 618) | The moment's button text; closes the window and shows the next queued moment; `ESCAPE` | `GFX_button_359x34` (the ZIN reskin) |
| Music | `zin_se_music_on` / `zin_se_music_off` (30, 640) | Silences or restores the music of the great moments for this player; exactly one is visible | `GFX_zin_button` |
| Queue | `zin_se_queue` (178, 646; 548 x 20) | "More news of the age waits to be told: N", only while the queue is not empty | |

Action budget: two controls (continue, music), one value (the queue count).
Engine adaptations: HOI4 text boxes cannot grow, so the description box is sized for the longest description and the quote always starts under the middle rule; the picture is a fixed sprite chosen by scripted localisation, as in vanilla's `AST_cabinet_trust_scripted_gui`.

**Sound.** `zin_super_event_play` plays the moment's song with `scoped_play_song`, so only that player hears it, through the game's music channel and its volume setting (the vanilla precedent is `play_song` in `events/AAT_Denmark.txt` and `scoped_play_song` in `common/national_focus/czechoslovakia_mu.txt`).
The window's music button is the player's own setting (country flag `zin_se_music_off`): while it is set no super event plays a song for that player; turning it back on plays the shown moment's song.
Each song is a `music` entry in `music/zin_super_events.asset` (`name = zin_se_<key>`, `file = zin_se_<key>.ogg`, `volume = 0.8`), the format of vanilla's event songs (`dlc/dlc038_arms_against_tyranny/music/music_aat.asset`), and each song's title key (`zin_se_<key>`) holds the moment's title until the audio specialist supplies the recording's own title.
The songs are deliberately in no radio station, so they never play in the normal rotation and the music player's track list cannot reveal a moment before it happens.
The installed vanilla songs played by `play_song` are also listed in a station (`music/_songs.txt`, `aat_songs.txt`), so whether `scoped_play_song` plays a song that is in no station is not proven by a precedent: it is acceptance item 3 of section 9, and the remedy if it fails is a `base_music` station file with `chance = { factor = 0 }` for each song.

## 6. Wiring

1. `buildSuperEvents` (run after the mechanic events in `tools/content/build.mjs`) writes the window, the sprites, the songs, the scripted effects, the scripted localisation, the hidden preview event and the text.
2. `hookSuperEvents` (run over the finished script tree, after the late characters) finds every line `set_global_flag = <hook>` in the staged `common/`, `events/` and `history/` scripts and adds `zin_super_event_<key> = yes` on the next line, in the same block. A hook flag that no file sets stops the build. Today every hook flag is set in exactly one place, so there are 26 hook sites.
3. No owner module is edited: the moment stays where its owner put it, and moving or renaming the flag is caught by the build.
4. `zin_super_event.1` (hidden, console) shows the next id in order to the country that runs it, without touching the once-per-game flags, so the live acceptance run can page through all 26.

## 7. Quotes

K52 asks for an in-world quote, so each quote is an original line given to a person, a book or a saying of Aoaz, never a real-world quote and never a line from other fiction.
This replaces the skill's default of a sourced real quote for this mod, by the owner's decision.
The rules of the voice guide hold: the speaker is someone the lore has (or a proposed character, or an anonymous person of a named trade and place), the words fit that speaker's register, Zol, Kusven, the Deliverer himself, Horos and Eindil are never quoted, Volgan only through the songs of Mirolon, and the long dead only as remembered.
The button text is the reader's own reaction, short and in the player's voice.

## 8. The catalogue

### 1. The Man in the Ice

| Field | Value |
| --- | --- |
| Key | `man_in_the_ice` (id 1) |
| Beat and role | B03; first reveal |
| Fires when | the global flag `zin_eindil_awake` is set; owner: Eindil's journey (modules/mech_eindil.mjs, zin_eindil.txt effects) |
| Who sees it | every human player, once per game; queued behind another super event that is still open |
| Picture | `GFX_zin_se_man_in_the_ice`, `gfx/event_pictures/zin/super_events/zin_se_man_in_the_ice.dds`, 700 x 500; pending art |
| Song | `zin_se_man_in_the_ice`, `music/zin_se_man_in_the_ice.ogg`; pending licensed recording |
| Knowledge layers | Before `zin_eindil_named` the man is only the man in the ice (D4, E1): no name, no ancestry, no hint of what he is (E2 is open). The tale is told as the drovers' rumour. |

**Title:** The Man in the Ice

**Description:**

> Word has come down the northern roads, carried by herders and by the drovers who buy their hides, that hunters of the Cold Lands cut a living man out of the ice this winter.
>
> The tribes who took him in say that he wakes and eats and walks like anyone else, but cannot tell them his name or how he came to be frozen, and the old women of the camps have already started arguing over what he is.
>
> In the southern courts the tale is told over supper as a northern curiosity, somewhere between the two-headed calf of last spring and the price of furs.

**Button:** A tale for the long nights.

**Quote:** We found him under a hand's depth of clear ice, lying as straight as a man laid out for burial, and when we had cut him free and warmed him by the fire he opened his eyes and asked us for water.

**Attribution:** A hunter of the Cold Lands, as the drovers tell it

**Picture brief:** Night in a hunters' camp of the Cold Lands: by a low fire under a hide shelter, fur-clad hunters and an old woman of the tribe lean over a black-haired man lying wrapped in furs, newly cut from a block of clear blue ice that still stands half-broken behind them with axes and ropes beside it; his face is pale and calm, his eyes just opening; snow, the green curtain of a northern sky, warm firelight against cold blue. Painted, quiet and wondering, not heroic; the man is the canon Eindil (black hair, blue eyes) without armour or helmet. References: `art/source/design_refs/eindil_v4_d.png`.

**Sound brief:** hushed wonder in the cold, a lullaby heard from far off; 60 to 90 seconds; solo voice or small unaccompanied women's choir with a drone; frame drum or a bowed string instrument (hurdy-gurdy, nyckelharpa or viol) allowed. A licensed recording with its licence and source documented (Q-08).

### 2. The Golden King Is Dead

| Field | Value |
| --- | --- |
| Key | `golden_king_dead` (id 2) |
| Beat and role | B07; irreversible political shift |
| Fires when | the global flag `zin_golden_king_dead` is set; owner: Aenor court (modules/mech_aenor.mjs, zin_aenor_court.txt effects) |
| Who sees it | every human player, once per game; queued behind another super event that is still open |
| Picture | `GFX_zin_se_golden_king_dead`, `gfx/event_pictures/zin/super_events/zin_se_golden_king_dead.dds`, 700 x 500; pending art |
| Song | `zin_se_golden_king_dead`, `music/zin_se_golden_king_dead.ogg`; pending licensed recording |
| Knowledge layers | The plot (A4) is gated by `zin_afrit_revealed`: the text says only that he is dead, never how or by whom, so it also holds for a death of old age (K59, Q-86). |

**Title:** The Golden King Is Dead

**Description:**

> The bells of Parim rang through the night, and by morning the whole city knew that the Golden King was dead, and the cooks who had been making ready for the next feast were sent home with the meat still on the spits.
>
> He leaves a treasury full of promissory notes, a court full of men who bought their offices from him, and no heir that every camp of the Concord will accept, so the dominions have called their riders home and locked their seals in their strong-rooms.
>
> The heralds will cry the mourning for thirty days, and the realm will spend every one of them deciding who wears the crown next.

**Button:** Ring the bells and count the seals.

**Quote:** For as long as he reigned he sold the offices of the realm to any man with the price of them, and now that he is dead every one of those men has come up to the palace to tell us how dearly he loved him.

**Attribution:** A clerk of the treasury of Parim

**Picture brief:** The great bell-towers of Parim at night, every bell swinging, torches in the streets below and a black mourning banner being let down the front of the gilded palace; in the foreground a crowd of courtiers in rich gold-trimmed clothes stands on the palace steps in small whispering knots, one of them already holding a sealed letter. The Golden King himself is not shown, or only as an empty gilded throne seen through an open door. Painted, sombre and a little ironic, gold against black. References: `art/source/design_refs/golden_king_c.png`.

**Sound brief:** court mourning, solemn and stately with a hint of hollowness; 90 to 120 seconds; tolling bells with a slow funeral pavane or lament for wind band (sackbuts, shawms, cornetts) or for organ and low choir. A licensed recording with its licence and source documented (Q-08).

### 3. The Deliverer Takes the Crown

| Field | Value |
| --- | --- |
| Key | `deliverer_crowned` (id 3) |
| Beat and role | B09; ideological transformation |
| Fires when | the global flag `zin_aurevan_crowned` is set; owner: Afrit and the Council (modules/mech_afrit.mjs, zin_afrit.txt effects) |
| Who sees it | every human player, once per game; queued behind another super event that is still open |
| Picture | `GFX_zin_se_deliverer_crowned`, `gfx/event_pictures/zin/super_events/zin_se_deliverer_crowned.dds`, 700 x 500; pending art |
| Song | `zin_se_deliverer_crowned`, `music/zin_se_deliverer_crowned.ogg`; pending licensed recording |
| Knowledge layers | Public face only (A1, A5, A8): the Deliverer is named through `[zin_loc_deliverer]`, which reads Aurevan the Deliverer until the reveal; his godhood and the healing are the faithful's belief, with a believer in the sentence (C15). The Worshipdom speaks through its public steward. |

**Title:** The Deliverer Takes the Crown

**Description:**

> In the great temple of Parim, before the seat-holders of the Concord and more pilgrims than the squares could hold, the crown of Aenor has been set on the head of [zin_loc_deliverer], and the crowd that came to the city to mourn a king stayed to cheer the god they believe him to be.
>
> The faithful say that the Deliverer healed the sick on the temple steps that same afternoon, and the Houses of the First Light opened their granaries to every poor family in the city, so that Parim went to bed with full bellies for the first time in a long while.
>
> The old dominions keep their counsel, and the envoys of foreign crowns have written home that they have never seen Parim so happy, nor so quiet.

**Button:** Parim has a king again, of a kind.

**Quote:** We have prayed for a deliverer since the Necromancer burned our grandfathers' fields, and if the gods have answered at last, I do not see why we should be ashamed to say thank you.

**Attribution:** Abbot-Steward Lozan Heron, at the crowning

**Picture brief:** The interior of the great temple of Parim filled with white and gold banners and a dense crowd of pilgrims; at the far end, high on the steps under a shaft of light, the Deliverer in his public form (the canon Aurevan design: serene, radiant, robed in white and gold) receives the crown of Aenor; priests in white, censers, flower petals in the air, faces in the crowd weeping with joy. Nothing in the picture hints that he is anything but what the faithful believe; no demonic sign. Painted, luminous and triumphant, with one or two plainly dressed envoys at the edge watching without cheering. References: `art/source/design_refs/aurevan_a.png`.

**Sound brief:** radiant public ceremony, joyful and a little too perfect; 90 to 120 seconds; festive choir with organ, or a processional for choir and brass (Renaissance or early Baroque polyphony). A licensed recording with its licence and source documented (Q-08).

### 4. The Heir of Aen

| Field | Value |
| --- | --- |
| Key | `heir_of_aen` (id 4) |
| Beat and role | B12; first reveal |
| Fires when | the global flag `zin_eindil_named` is set; owner: Eindil's journey (modules/mech_eindil.mjs, zin_eindil.txt effects) |
| Who sees it | every human player, once per game; queued behind another super event that is still open |
| Picture | `GFX_zin_se_heir_of_aen`, `gfx/event_pictures/zin/super_events/zin_se_heir_of_aen.dds`, 700 x 500; pending art |
| Song | `zin_se_heir_of_aen`, `music/zin_se_heir_of_aen.ogg`; pending licensed recording |
| Knowledge layers | Behind `zin_eindil_named` (E1): the name and line of Aen may be said. The brotherhood with Afrit (A9) is not hinted at; the Mirror's showing is the Keepers' word (V18). |

**Title:** The Heir of Aen

**Description:**

> The Gala have sent heralds to every court of Aoaz with news that most of them will not believe: the man the hunters cut out of the northern ice has been named in the halls of King Lorien as Eindil, son of Ein, son of Aen, an heir of the first king of men by his own blood.
>
> Lorien, who remembers Dardan, says that he knew the face before he heard the voice, and the Keepers of the Mirror say the water showed them the same thing.
>
> In Parim the temples call the tale a northern fancy, while in the free dominions old men are taking down the histories of Aen's line and counting the generations on their fingers.

**Button:** Let the old histories be read again.

**Quote:** Men count their kings by the names on the rolls, but we counted the line of Aen by their faces, and I had not seen that face in my halls for a very long time.

**Attribution:** Words the Gala give to King Lorien

**Picture brief:** A sunlit elven hall of the Gala with tall white pillars and gold light: the ancient King Lorien (canon v3 B: withered and ancient, extremely bright yellow glowing eyes, golden and white robe) stands before the black-haired man from the ice and lays a hand on his shoulder; between them a Keeper holds a shallow bowl of still water in which a faint crowned reflection shows; elven lords watch in silence. The man (Eindil v4 D face, black hair, blue eyes faintly glowing) is still in plain travelling clothes, not yet in armour. Painted, reverent and warm. References: `art/source/design_refs/lorien_v3_b.png`, `art/source/design_refs/eindil_v4_d.png`.

**Sound brief:** recognition and an old line remembered, reverent and warm; 60 to 120 seconds; harp and voice, or a slow chant for small choir with a plucked string accompaniment. A licensed recording with its licence and source documented (Q-08).

### 5. The War of the Last Crowns

| Field | Value |
| --- | --- |
| Key | `last_crowns` (id 5) |
| Beat and role | B18; escalation |
| Fires when | the global flag `zin_war_of_last_crowns` is set; owner: World tension (modules/world_tension.mjs, zin_world_tension.txt effects; news zin_world.20) |
| Who sees it | every human player, once per game; queued behind another super event that is still open |
| Picture | `GFX_zin_se_last_crowns`, `gfx/event_pictures/zin/super_events/zin_se_last_crowns.dds`, 700 x 500; pending art |
| Song | `zin_se_last_crowns`, `music/zin_se_last_crowns.ogg`; pending licensed recording |
| Knowledge layers | The war's name is proposed and given to the taverns of Parim; Zol is not named. |

**Title:** The War of the Last Crowns

**Description:**

> There has been no single declaration and no single enemy, but the chroniclers have stopped pretending that the wars breaking out across Aoaz are separate quarrels: the dark powers are on the march, the old grudges between the crowns of men have found their excuse, and every road from the Wall to the southern sea is full of levies going one way and townsfolk going the other.
>
> In the taverns of Parim they have already found a name for it, the War of the Last Crowns, because, as the wine-sellers put it, there will be fewer crowns at the end of it than at the start, and they mean to sell to whoever is left.

**Button:** Call the banners.

**Quote:** In this year the wars of the age ran together like rivers in a spring flood, so that a man who marched against one enemy at sowing found himself fighting three by harvest, and the annalist, who has tried to keep them apart, begs the reader's patience.

**Attribution:** The Chronicle of Aoaz, Fourth Age

**Picture brief:** A wide painted panorama of the Middle Lands at dusk seen from a hill: in the distance several separate fires and columns of smoke along the horizon, banners of different crowns moving along different roads, levies marching one way and carts of fleeing townsfolk the other; a beacon blazes on the hill in the foreground with its keeper looking out. No single enemy is shown. Painted, sweeping and sombre, the light of evening.

**Sound brief:** the gathering of many hosts, grave and driving; 90 to 120 seconds; martial early music: drums, trumpets or sackbuts and shawms, an estampie or battle piece (for example a Renaissance battaglia) in a grave tempo. A licensed recording with its licence and source documented (Q-08).

### 6. The Western Crossing

| Field | Value |
| --- | --- |
| Key | `western_crossing` (id 6) |
| Beat and role | B20; escalation |
| Fires when | the global flag `zin_western_crossing` is set; owner: The Western Crossing (modules/mech_crossing.mjs, zin_west.txt effects) |
| Who sees it | every human player, once per game; queued behind another super event that is still open |
| Picture | `GFX_zin_se_western_crossing`, `gfx/event_pictures/zin/super_events/zin_se_western_crossing.dds`, 700 x 500; pending art |
| Song | `zin_se_western_crossing`, `music/zin_se_western_crossing.ogg`; pending licensed recording |
| Knowledge layers | Public; the Grey Ford grievance is the clans' own account. |

**Title:** The Western Crossing

**Description:**

> The war-fleets of the West have put out across the central sea, every keel the Ford Council could buy, borrow or build, and the first of them have already run up on the beaches of the Middle Lands with their hosts behind them.
>
> The western clans have come for an old debt, the one they say the kings in Parim have owed them since the truce of the Grey Ford, and their captains say openly that they mean to collect it in the capital itself.
>
> On the shores of the Concord the beacons are burning, and the fishermen who saw the sails at dawn say there were too many of them to count before the light failed.

**Button:** So the West remembers.

**Quote:** My grandfather swore at the Grey Ford that we would have the debt back with interest, and he made us all swear it again over his grave, so you will understand that I have no choice in the matter but to get into this boat.

**Attribution:** A clansman of Gunwyn, at the embarkation

**Picture brief:** Dawn over the central sea: a great fleet of western longships and broad-sailed cogs with clan banners runs onto a pebbled beach, warriors in mail and fur jumping into the surf with shields and axes, more sails crowding the horizon behind them; on the headland above, a beacon has just been lit by a startled watchman of the Concord. Painted, energetic, cold sea light.

**Sound brief:** a sea-crossing war host, rhythmic and determined; 60 to 120 seconds; rowing rhythm on drums with low male voices singing a work song or march, or a drum-and-horn piece in a folk or early-music recording. A licensed recording with its licence and source documented (Q-08).

### 7. The Black North Marches

| Field | Value |
| --- | --- |
| Key | `black_north_marches` (id 7) |
| Beat and role | B24; global threat escalation |
| Fires when | the global flag `zin_zol_rising` is set; owner: Zol's Mistake (modules/mech_zol.mjs, zin_mistake.txt effects) |
| Who sees it | every human player, once per game; queued behind another super event that is still open |
| Picture | `GFX_zin_se_black_north_marches`, `gfx/event_pictures/zin/super_events/zin_se_black_north_marches.dds`, 700 x 500; pending art |
| Song | `zin_se_black_north_marches`, `music/zin_se_black_north_marches.ogg`; pending licensed recording |
| Knowledge layers | Zol is named only as the Old God of Death whose name the black north bears, by the priests (C26, voice guide 2.8): he does not appear. The black ships stay a fishermen's tale until now (V10, gate `zin_zol_rising`). |

**Title:** The Black North Marches

**Description:**

> From the black shore of Zol's Mistake the dead have come out in their thousands, marching in better order than most living hosts have ever managed, along the frozen coasts and over the northern passes towards the lands of men.
>
> The priests of every faith agree on very little, but they agree that this is the work of the Old God of Death whose name the black north bears, and in the villages nearest the Mistake the people have begun burning their own dead so that nothing they loved can be made to march.
>
> The courts that once laughed at the fishermen's tales of black ships are sending for their harbour-masters to hear those tales again.

**Button:** Burn the dead and bar the doors.

**Quote:** We buried my father in the field behind the house with his boots on, because he always said he would sooner walk to the next life than be carried there, and this morning I am afraid he has taken us at our word.

**Attribution:** A cottager of the Cold Lands

**Picture brief:** A grey northern coast under a black sky: long ordered columns of the walking dead (skeletal, armoured skeletons in rusted mail and helms, K57) march along the shore and up into a mountain pass, ragged black banners without device among them; in the foreground a village on a ridge where folk are building a pyre and a woman holds back a child to watch. Zol himself does not appear in any form. Painted, cold and dreadful but restrained, no gore.

**Sound brief:** relentless cold dread, a dirge that marches; 90 to 120 seconds; low male chant or a Dies irae-like plainchant with deep drum, or a slow funeral march for low strings or low brass. A licensed recording with its licence and source documented (Q-08).

### 8. Volgan Marches North

| Field | Value |
| --- | --- |
| Key | `volgan_marches` (id 8) |
| Beat and role | B23; global threat escalation |
| Fires when | the global flag `zin_volgan_marches` is set; owner: Volgan (modules/mech_volgan.mjs, zin_dominion.txt effects) |
| Who sees it | every human player, once per game; queued behind another super event that is still open |
| Picture | `GFX_zin_se_volgan_marches`, `gfx/event_pictures/zin/super_events/zin_se_volgan_marches.dds`, 700 x 500; pending art |
| Song | `zin_se_volgan_marches`, `music/zin_se_volgan_marches.ogg`; pending licensed recording |
| Knowledge layers | Behind `zin_volgan_marches` (V9): his arming is now fact. His banishment is said as the vault says it; which god he served (C11, C12) is not touched. Volgan is not quoted; the quote is a song of Mirolon. |

**Title:** Volgan Marches North

**Description:**

> Mirolon has fallen, and the hosts of the Ember Lands have come up out of the storms behind it: grave-hosts and ogre clans, the beasts of the southern deeps, and at their head Volgan himself, the Great Spirit whom the spirits of an older age stripped of his strength and threw into the Void, crowned and marching north.
>
> The wardens of Mirolon warned every court of Aoaz for years that he was arming, and every court thanked them, gave them supper and sent them home.
>
> The few envoys of Mirolon who still live have stopped asking for help and ask only for fresh horses, so that they can carry the warning further north.

**Button:** Mirolon was right.

**Quote:** He waited a whole age in the dark beyond the world, the old song of the wardens says, and he will not mind waiting a little longer at your gate while you finish arguing about who should hold it.

**Attribution:** Song of the wardens of Mirolon

**Picture brief:** The southern passes under a sky of dark storm cloud lit from below by ember-red light: an endless host of grave-warriors, ogres with great clubs and monstrous beasts pours north over a broken mountain gate of Mirolon; above them, larger than life and partly made of the storm, Volgan in his canon form (v4 B: a purple cloak filled with darkness in which only two glowing green eyes show, a crown floating above the darkness, green magic at the hem). Painted, epic and menacing, purple, green and ember against black. References: `art/source/design_refs/volgan_v4_b.png`.

**Sound brief:** an overwhelming dark march, heavy and inexorable; 90 to 120 seconds; heavy drums and low brass or a low choir; a dark orchestral march or a slow heavy processional in a licensed recording. A licensed recording with its licence and source documented (Q-08).

### 9. The Name of the Deliverer

| Field | Value |
| --- | --- |
| Key | `name_of_the_deliverer` (id 9) |
| Beat and role | B25; first reveal |
| Fires when | the global flag `zin_afrit_revealed` is set; owner: Afrit and the Council (modules/mech_afrit.mjs, zin_afrit.txt effects) |
| Who sees it | every human player, once per game; queued behind another super event that is still open |
| Picture | `GFX_zin_se_name_of_the_deliverer`, `gfx/event_pictures/zin/super_events/zin_se_name_of_the_deliverer.dds`, 700 x 500; pending art |
| Song | `zin_se_name_of_the_deliverer`, `music/zin_se_name_of_the_deliverer.ogg`; pending licensed recording |
| Knowledge layers | Behind `zin_afrit_revealed` (A1, A2, A3): the name, the line of Ein and the Council may be said. His divine order stays a dispute between priests (C15), and his long life has no cause (V19). |

**Title:** The Name of the Deliverer

**Description:**

> The man the temples worshipped as Aurevan the Deliverer has another name, and it is now being shouted in every market of the Middle Lands: he is Afrit, son of Ein, grandson of Aen, who has lived far longer than any man should, and the Royal Council that governed Aenor in the Golden King's name answered to him all along.
>
> What else he is, the priests of the twelve and the confessors of his own temples cannot agree, and both sides have begun to argue the point with stones as well as sermons.
>
> The Houses of the First Light still keep their granaries open, though fewer of the poor are willing to be seen at their doors.

**Button:** Write the name down.

**Quote:** I kept his birth rolls for twenty years and never once asked who was keeping mine, which I suppose is exactly what the rolls were for.

**Attribution:** Sefan Daldar, Warden of the Rolls

**Picture brief:** A crowded market square of Parim in grey morning light: a torn white and gold banner of the Deliverer lies trampled on the cobbles, a crier on a cart reads from a sealed proclamation, townsfolk argue and point, a confessor in white is shouted at, and on a wall someone has scrawled a mark over a painted image of the radiant Deliverer, half of the painted face scraped away to show darkness beneath. No lettering. Painted, tense and dramatic. References: `art/source/design_refs/aurevan_a.png`.

**Sound brief:** unmasking, unease turning to anger; 60 to 120 seconds; a dissonant or minor-key choral piece, or strings with an unsettled ostinato, in a licensed recording. A licensed recording with its licence and source documented (Q-08).

### 10. A King in the East

| Field | Value |
| --- | --- |
| Key | `king_of_the_east` (id 10) |
| Beat and role | B26; faction formation |
| Fires when | the global flag `zin_afrit_king_of_east` is set; owner: Afrit and the Council (modules/mech_afrit.mjs, zin_afrit.txt effects) |
| Who sees it | every human player, once per game; queued behind another super event that is still open |
| Picture | `GFX_zin_se_king_of_the_east`, `gfx/event_pictures/zin/super_events/zin_se_king_of_the_east.dds`, 700 x 500; pending art |
| Song | `zin_se_king_of_the_east`, `music/zin_se_king_of_the_east.ogg`; pending licensed recording |
| Knowledge layers | Behind `zin_afrit_king_of_east` (A10). "Calls himself a god" is a trader's opinion, not the narrator's verdict (C15). |

**Title:** A King in the East

**Description:**

> Afrit did not go into the wilderness, as his enemies hoped, but east, where the courts that owed his temples their councillors, their granaries and their debts have knelt to him one after another, and in the halls of the East he has been proclaimed king over them all.
>
> The envoys of the kneeling courts call his realm the Dominion of the East and speak of him with the old reverence, as though nothing had been said in Parim, while the courts that did not kneel are counting the temples in their own towns and closing the doors of the Houses one by one.
>
> The caravan roads still run, but the caravan masters have started paying two tolls on every road, one to the old lords and one to the new.

**Button:** Let the East keep him, if it can.

**Quote:** A caravan master in the East has always paid one king for the road and another for the well, so you will forgive us if a third, who calls himself a god, does not strike us as much of a change.

**Attribution:** A caravan master of Noris

**Picture brief:** A great hall of the East with carved stone pillars, hanging lamps and rich carpets: eastern kings and lords in many styles of dress kneel in rows before a raised throne where the Deliverer sits crowned, still in his radiant white and gold public form but with the light around him grown colder and a long shadow behind the throne that does not match his shape; caravan goods and tribute chests at the edges. Painted, opulent and uneasy. References: `art/source/design_refs/aurevan_a.png`, `art/source/design_refs/afrit_true_v3_c.png`.

**Sound brief:** an oriental court in grim splendour, ceremonial and uneasy; 60 to 120 seconds; ceremonial plucked and bowed strings, frame drum and reed (oud, kanun, ney, zurna or similar) in a licensed traditional or early-music recording. A licensed recording with its licence and source documented (Q-08).

### 11. Western Banners over Parim

| Field | Value |
| --- | --- |
| Key | `parim_taken` (id 11) |
| Beat and role | B27; irreversible political shift |
| Fires when | the global flag `zin_west_parim_taken` is set; owner: The Western Crossing (modules/mech_crossing.mjs, zin_west.txt effects) |
| Who sees it | every human player, once per game; queued behind another super event that is still open |
| Picture | `GFX_zin_se_parim_taken`, `gfx/event_pictures/zin/super_events/zin_se_parim_taken.dds`, 700 x 500; pending art |
| Song | `zin_se_parim_taken`, `music/zin_se_parim_taken.ogg`; pending licensed recording |
| Knowledge layers | Public. |

**Title:** Western Banners over Parim

**Description:**

> Parim has fallen to the hosts of the Western Crossing, which fought their way up the vale from the shores of the Concord to the oldest city of men and now hang their clan banners from the walls where the gold of Aenor flew for an age.
>
> The court of Aenor has gone to another seat with what it could carry, the temples are shut, and the western captains, who do not understand the language of the city's prayers, are learning to govern it from its own clerks.
>
> Every court of Aoaz is now waiting to see whether the West came to rule Parim or only to punish it.

**Button:** A debt collected, and a city to keep.

**Quote:** We took the gate at dawn and the market by noon, and by evening my lads had learned that a man who conquers Parim must also feed it, which nobody mentioned at the Ford Council.

**Attribution:** A western captain in Parim

**Picture brief:** The walls and gilded gate of Parim at evening with smoke rising from a few streets behind: western clan banners being hung over the gold banners of Aenor, western warriors in mail and fur standing guard, a line of city clerks in dark robes with ledgers being led up to a weary western captain at a trestle table in the gateway; townsfolk watching from windows. Painted, aftermath rather than battle, smoky gold light.

**Sound brief:** a conquered capital, grave triumph mixed with loss; 60 to 120 seconds; slow drums and a lament on bagpipe, horns or low winds, or a victory march played slowly in a licensed folk or early-music recording. A licensed recording with its licence and source documented (Q-08).

### 12. The Heir Returns

| Field | Value |
| --- | --- |
| Key | `heir_returns` (id 12) |
| Beat and role | B29; global response |
| Fires when | the global flag `zin_eindil_returned` is set; owner: Eindil's journey (modules/mech_eindil.mjs, zin_eindil.txt effects) |
| Who sees it | every human player, once per game; queued behind another super event that is still open |
| Picture | `GFX_zin_se_heir_returns`, `gfx/event_pictures/zin/super_events/zin_se_heir_returns.dds`, 700 x 500; pending art |
| Song | `zin_se_heir_returns`, `music/zin_se_heir_returns.ogg`; pending licensed recording |
| Knowledge layers | Behind `zin_eindil_returned` (E4). The dragon is of the elven roosts (the elves command dragons, established); Varner and Golbran are not mentioned (E5). |

**Title:** The Heir Returns

**Description:**

> Eindil has come back to the war, and he has not come back on foot: the heir of Aen flew south out of the Magical Forest on the back of a dragon of the elven roosts, and the hosts who saw him pass over the lines say that they heard the dragon before they saw it and the cheering before either.
>
> His friends have raised their banners to him, and crowns that have no love for one another are sending their captains to the Host of Eindil because it is the one army in the Middle Lands that everyone else's enemies fear.
>
> In Parim, the men who called him an impostor not so long ago have become very careful about what they call him now.

**Button:** Then the heir has friends after all.

**Quote:** I have counted the dragons over the roosts every morning for longer than your kingdoms have kept records, and I have never once seen one carry a man willingly, so you may take it from me that this one chose him.

**Attribution:** Perlan, Warden of the Dragon Roosts

**Picture brief:** A great dragon with wide wings flies low over a field of armed hosts in the Middle Lands, the hosts below raising spears and banners and cheering; on its back rides Eindil in his canon armour (light blue armour and helmet, black hair, blue eyes glowing slightly) holding a blue sword aloft; a forest edge and smoke of war in the distance, bright sky breaking through cloud. Painted, heroic and hopeful. References: `art/source/design_refs/eindil_v4_d.png`.

**Sound brief:** hope returning, soaring and heroic; 90 to 120 seconds; trumpets or horns with full choir, or a bright orchestral or early-Baroque fanfare and chorus in a licensed recording. A licensed recording with its licence and source documented (Q-08).

### 13. Varner Falls

| Field | Value |
| --- | --- |
| Key | `varner_falls` (id 13) |
| Beat and role | B32; defeat aftermath |
| Fires when | the global flag `zin_varner_dead` is set; owner: Eindil's journey (events zin_eindil.97) |
| Who sees it | every human player, once per game; queued behind another super event that is still open |
| Picture | `GFX_zin_se_varner_falls`, `gfx/event_pictures/zin/super_events/zin_se_varner_falls.dds`, 700 x 500; pending art |
| Song | `zin_se_varner_falls`, `music/zin_se_varner_falls.ogg`; pending licensed recording |
| Knowledge layers | Behind `zin_varner_dead`. Golbran's survival (E5) is not touched: he is not named. Varner is quoted only as the elves remember him (voice guide 7.1). |

**Title:** Varner Falls

**Description:**

> Varner the wizard is dead. When the dead of the black north broke the southern front and the hosts of the living began to give way, the old wizard of the Magical Lands raised wards over them such as nobody living had ever seen, and held them up until there was nothing left of him to hold them with, and the living came off the field only because he stayed on it.
>
> The elves of the Magical Forest have put out their lamps for him, and the wizards of men, Bastian among them, have said in public what they used to say only among themselves, that nobody else alive knew half of what he knew.

**Button:** Put out the lamps for him.

**Quote:** He told us once that a ward is only a promise made with your whole strength, and that the trick of it is to choose carefully what you promise, because you will be held to it.

**Attribution:** As the elves of the Magical Forest remember Varner

**Picture brief:** A battlefield at dusk: a great dome of pale blue light stands over a retreating host of the living while the walking dead break against its edge like a dark tide; at its centre the old wizard Varner (canon design A, an old man in a wizard's robe and hat with a staff) stands alone with both arms raised, his figure already fading into the light. Painted, tragic and luminous, cold blue against black. References: `art/source/design_refs/varner_a.png`.

**Sound brief:** elegy for a protector, sorrowful and luminous; 90 to 120 seconds; slow elegy for strings or viol consort, or a requiem movement for choir, in a licensed recording. A licensed recording with its licence and source documented (Q-08).

### 14. The Body of Volgan Is Broken

| Field | Value |
| --- | --- |
| Key | `volgan_broken` (id 14) |
| Beat and role | B34; defeat aftermath |
| Fires when | the global flag `zin_volgan_body_destroyed` is set; owner: Volgan (modules/mech_volgan.mjs, zin_dominion.txt effects) |
| Who sees it | every human player, once per game; queued behind another super event that is still open |
| Picture | `GFX_zin_se_volgan_broken`, `gfx/event_pictures/zin/super_events/zin_se_volgan_broken.dds`, 700 x 500; pending art |
| Song | `zin_se_volgan_broken`, `music/zin_se_volgan_broken.ogg`; pending licensed recording |
| Knowledge layers | Behind `zin_volgan_body_destroyed`. What remains of Volgan (C23) stays open: no priest or wizard will say, and the wardens do not sing yet. |

**Title:** The Body of Volgan Is Broken

**Description:**

> On the field where the hosts of the living at last stood against the Ember Lands, the body that Volgan wore when he came back out of the Void has been broken apart like a burnt log in the hand, and the Great Spirit has gone from the field.
>
> His grave-hosts fell where they stood or fled south without orders, the great ones of his court are quarrelling over what is left of his dominion, and the wardens of Mirolon have gone back to their passes to see what remains of their homes.
>
> What remains of Volgan himself, no priest or wizard will say for certain, and the old wardens, who have been right about him before, are not yet singing the songs of victory.

**Button:** Sing, but not too loudly.

**Quote:** When the spirits threw him out of the world the first time, the wardens' song says, the wardens of that age danced in the passes for a week, and it is because we remember the dancing that we will not dance this time.

**Attribution:** Song of the wardens of Mirolon

**Picture brief:** A scorched battlefield under breaking storm clouds: an empty crown lies in the ash beside a torn purple cloak from which green light is fading and wisps of darkness drift away, while grave-warriors around it collapse into bones; in the background the hosts of the living stand exhausted and silent, a few wardens of Mirolon in grey looking on without celebrating. Painted, solemn, purple and green fading to grey dawn. References: `art/source/design_refs/volgan_v4_b.png`.

**Sound brief:** a great darkness broken, solemn relief that does not trust itself; 60 to 120 seconds; a slow hymn or chorale for choir or brass, ending unresolved, in a licensed recording. A licensed recording with its licence and source documented (Q-08).

### 15. The Grave-Wind

| Field | Value |
| --- | --- |
| Key | `kusven_forth` (id 15) |
| Beat and role | B35; global threat escalation |
| Fires when | the global flag `zin_kusven_forth` is set; owner: Zol's Mistake (modules/mech_zol.mjs, zin_mistake.txt effects: zin_zol_send_kusven) |
| Who sees it | every human player, once per game; queued behind another super event that is still open |
| Picture | `GFX_zin_se_kusven_forth`, `gfx/event_pictures/zin/super_events/zin_se_kusven_forth.dds`, 700 x 500; pending art |
| Song | `zin_se_kusven_forth`, `music/zin_se_kusven_forth.ogg`; pending licensed recording |
| Knowledge layers | Behind `zin_kusven_forth`. Owner answer Q-70 (K55, 25 October 2026) retires the sealed name: Kusven is named from the start as a known legend, so the text names him through the Leren sailors' winter tales, as the war events do (`zin_mistake.20`). Zol does not appear (C26): the priests say so. The sword-break (seven days later, `zin_mistake.21`) is not told here, because it happens only while Glo is with the heir. |

**Title:** The Grave-Wind

**Description:**

> Out of the host of the black north something has come onto the field that is not one of the walking dead, a Great Spirit so tall that the soldiers who saw it measure it against the banners, and wherever it passes the dead stand straighter and the living cannot get their breath.
>
> The Leren sailors who watched it from their ships know it from the oldest of their winter tales, and they say its name only in a whisper: Kusven, the grave-wind, the most loyal servant of the Old God of Death.
>
> The priests say that the Old God himself does not walk the world and never has, and in the camps tonight the soldiers are finding that a very small comfort.

**Button:** Close up the line.

**Quote:** I have stood in the line against orcs, trolls and the walking dead, and I never minded any of them half so much as the moment that thing looked down our line and the dead on either side of it stopped moving, as if they were waiting to see what we would do.

**Attribution:** A serjeant of the living on the northern field

**Picture brief:** A battlefield in the north under a black sky: Kusven, a vast and plainly supernatural Great Spirit (the owner-chosen Kusven redesign A, K41), towers over the host of the black north, which stands straighter around him; the skeletal armoured dead (K57) in ranks at his feet; facing him across the field the banners and spears of the living, small against him, and a few Leren ships on a grey sea at the edge. No lettering, no figure of Zol. Painted, terrible and still, cold blue-grey and black. References: `art/source/design_refs/kusven_v2_a.png`, `art/source/design_refs/eindil_v4_d.png`.

**Sound brief:** the world holding its breath, terror and stillness; 60 to 120 seconds; low choir or bowed strings with sustained tension and a single great drum, or a dark sacred choral piece, in a licensed recording (music, not a drone). A licensed recording with its licence and source documented (Q-08).

### 16. King Lorien Falls

| Field | Value |
| --- | --- |
| Key | `lorien_falls` (id 16) |
| Beat and role | B36; defeat aftermath |
| Fires when | the global flag `zin_lorien_dead` is set; owner: The Lands of the Sun (modules/mech_sun.mjs, zin_sun.txt effects) |
| Who sees it | every human player, once per game; queued behind another super event that is still open |
| Picture | `GFX_zin_se_lorien_falls`, `gfx/event_pictures/zin/super_events/zin_se_lorien_falls.dds`, 700 x 500; pending art |
| Song | `zin_se_lorien_falls`, `music/zin_se_lorien_falls.ogg`; pending licensed recording |
| Knowledge layers | Behind `zin_lorien_dead` (after Kusven has come forth, so he may be named). Zol does not appear (C26); Kusven withdraws wounded, not destroyed, as `zin_mistake.24` tells it. No age is given (V23): he has reigned since the First Age, as the vault says. |

**Title:** King Lorien Falls

**Description:**

> King Lorien of the Gala, who remembered Dardan, rode out with the oldest lords of his people and the ancient spirits who still answered him to stand between the living and Kusven, and none of them came home.
>
> The soldiers who were there say that the old king's light was the last thing they saw on the field before the grave-wind drew back, wounded but not destroyed, into the black north, and the Gala have not yet told the other elves how they mean to mourn a king who has reigned since the First Age.
>
> In every forest of the elves the songs have stopped, because nobody alive among them can remember a world without him in it.

**Button:** Let the forests keep silence.

**Quote:** We asked him once why he stayed at home when the rest of the world went to war, and he said that he had been to war, and was only keeping the door open for the rest of us when we came back tired.

**Attribution:** A lord of the Gala, after the king's fall

**Picture brief:** A field at the edge of the northern dark: the ancient King Lorien (canon v3 B, withered, extremely bright yellow glowing eyes, golden and white robe) on a white horse rides into a wall of darkness with a small company of shining elven lords and pale luminous spirits, his own golden light blazing like a sunrise against the black; soldiers of the living watch from behind. Painted, heroic and tragic, gold and white against black. References: `art/source/design_refs/lorien_v3_b.png`.

**Sound brief:** the passing of the oldest king, noble grief; 90 to 120 seconds; a lament for solo voice and harp, or a slow polyphonic elegy for choir, in a licensed recording. A licensed recording with its licence and source documented (Q-08).

### 17. Afrit Is Dead

| Field | Value |
| --- | --- |
| Key | `afrit_dead` (id 17) |
| Beat and role | B41; defeat aftermath |
| Fires when | the global flag `zin_afrit_dead` is set; owner: Afrit and the Council (modules/mech_afrit.mjs, zin_afrit.txt effects: zin_afrit_die) |
| Who sees it | every human player, once per game; queued behind another super event that is still open |
| Picture | `GFX_zin_se_afrit_dead`, `gfx/event_pictures/zin/super_events/zin_se_afrit_dead.dds`, 700 x 500; pending art |
| Song | `zin_se_afrit_dead`, `music/zin_se_afrit_dead.ogg`; pending licensed recording |
| Knowledge layers | Behind `zin_afrit_dead` (implies the reveal). Whether a god can die is the markets' argument (C15). The text does not say where or how he died, because the moment can come from the palace (B41), from a hunter outside it (K59, Q-66) or from a sandbox path; the artifacts and the Necklace are not named (A6, A7, E7). |

**Title:** Afrit Is Dead

**Description:**

> Afrit, son of Ein, whom half of Aoaz worshipped as the Deliverer and the other half learned to fear, is dead, and the heralds who brought the news to the courts have been made to repeat it twice, because nobody quite believed it the first time.
>
> His temples in the East have shut their doors, his councillors are slipping out of the courts that kept them, and the Houses of the First Light, which fed half the poor of the Middle Lands, no longer know whom they serve.
>
> In the markets they are already arguing over whether a god can die, and the priests of the twelve, for once, are content to let them argue.

**Button:** Even he could die.

**Quote:** In this year died Afrit, son of Ein, who was called the Deliverer, and the annalist, who served his Council for most of his life without knowing it, has nothing to add except that he is sorry.

**Attribution:** The Annals of Parim

**Picture brief:** The throne room of the palace of Parim after battle, shafts of dusty light through broken windows: the true form of Afrit (owner drawing, v3 C: a winged demon with a great nose) lies fallen at the foot of the throne, wings spread and broken, the light of three small broken artifacts fading on the floor around him; at the edge of the light stand the silhouettes of the heir and a ranger with a bow, not triumphant. Painted, grim and quiet. References: `art/source/design_refs/afrit_true_v3_c.png`, `art/source/design_refs/alleria_d.png`, `art/source/design_refs/eindil_v4_d.png`.

**Sound brief:** the fall of a false light, grave and cathartic; 60 to 120 seconds; a solemn choral or orchestral piece that resolves, for example a Renaissance motet or a slow Baroque chorus, in a licensed recording. A licensed recording with its licence and source documented (Q-08).

### 18. A King of Aen's Line

| Field | Value |
| --- | --- |
| Key | `ending_lost_cause` (id 18) |
| Beat and role | B42; campaign-ending signal |
| Fires when | the global flag `zin_ending_lost_cause` is set; owner: World tension (zin_world_reach_ending; news zin_world.100) |
| Who sees it | every human player, once per game; queued behind another super event that is still open |
| Picture | `GFX_zin_se_ending_lost_cause`, `gfx/event_pictures/zin/super_events/zin_se_ending_lost_cause.dds`, 700 x 500; pending art |
| Song | `zin_se_ending_lost_cause`, `music/zin_se_ending_lost_cause.ogg`; pending licensed recording |
| Knowledge layers | Behind `zin_eindil_crowned`. The Necklace and its price (E7) are not mentioned. |

**Title:** A King of Aen's Line

**Description:**

> In the great hall of Parim, before the captains of every crown that fought beside him, Eindil, son of Ein, son of Aen, has been crowned King of Aenor, and the Lost Cause that a vain old king founded for his own glory has ended the age as the league of the living.
>
> The Middle Lands are in ruins, the dead of the war are not yet all buried, and the new king has asked the crowns that stood with him for nothing they did not offer freely.
>
> The chroniclers have begun the last pages of the Fourth Age, and for once they find they have very little to complain about.

**Button:** Long live the king of Aen's line.

**Quote:** And so the heir of Aen came home to Parim at the end of the Fourth Age, and the annalist, who began this book under a king he did not admire, closes it under one he does.

**Attribution:** The Chronicle of Aoaz, Fourth Age

**Picture brief:** The great hall of Parim, scarred by war but hung with the banners of many allied crowns (men, elves, dwarves, giants): Eindil in his canon light blue armour, helmet held at his side, kneels as an old crown is set on his black hair; Alleria of Selen, captains, elven lords and a giant stand witness; light falls through high windows. Painted, solemn and hopeful, not gaudy. References: `art/source/design_refs/eindil_v4_d.png`, `art/source/design_refs/alleria_d.png`.

**Sound brief:** a hard-won coronation, majestic and deeply moving; 90 to 120 seconds; coronation anthem for choir, organ and brass or trumpets, in a licensed recording. A licensed recording with its licence and source documented (Q-08).

### 19. Children of Volgan

| Field | Value |
| --- | --- |
| Key | `ending_children_of_volgan` (id 19) |
| Beat and role | B43; world-end scenario |
| Fires when | the global flag `zin_ending_children_of_volgan` is set; owner: World tension (zin_world_reach_ending; news zin_world.101) |
| Who sees it | every human player, once per game; queued behind another super event that is still open |
| Picture | `GFX_zin_se_ending_children_of_volgan`, `gfx/event_pictures/zin/super_events/zin_se_ending_children_of_volgan.dds`, 700 x 500; pending art |
| Song | `zin_se_ending_children_of_volgan`, `music/zin_se_ending_children_of_volgan.ogg`; pending licensed recording |
| Knowledge layers | A proposed telling ("in this telling of the age"). The heir is not mentioned (endings spec). |

**Title:** Children of Volgan

**Description:**

> In this telling of the age the Great Spirit of the Ember Lands rules a ruined world. His grave-hosts stand on the plains of the Middle Lands, his client crowns kneel in their own halls and rule in his name, and the beasts of the south walk the roads where the caravans used to run.
>
> The wardens of Mirolon warned every court of Aoaz, and every court thanked them, gave them supper and sent them home, and there are very few of those courts left to be sorry.

**Button:** The wardens warned us.

**Quote:** He never hated the kingdoms of men, the last song of the wardens says; he only waited for them to quarrel, and they never once kept him waiting long.

**Attribution:** The last song of the wardens of Mirolon

**Picture brief:** Parim under an ember-red storm sky, its gold banners replaced by tattered purple ones; grave-warriors stand guard at the gates, kneeling kings in their own crowns line a ruined avenue, and above the palace hangs Volgan's canon form (purple cloak full of darkness, glowing green eyes, a floating crown). Painted, bleak and final. References: `art/source/design_refs/volgan_v4_b.png`.

**Sound brief:** the end of an age in darkness, heavy and final; 90 to 120 seconds; a dark requiem or lament for choir and low orchestra, or a slow dirge with tolling bell, in a licensed recording. A licensed recording with its licence and source documented (Q-08).

### 20. The Ashen Throne

| Field | Value |
| --- | --- |
| Key | `ending_ashen_throne` (id 20) |
| Beat and role | B44; world-end scenario |
| Fires when | the global flag `zin_ending_ashen_throne` is set; owner: World tension (zin_world_reach_ending; news zin_world.102) |
| Who sees it | every human player, once per game; queued behind another super event that is still open |
| Picture | `GFX_zin_se_ending_ashen_throne`, `gfx/event_pictures/zin/super_events/zin_se_ending_ashen_throne.dds`, 700 x 500; pending art |
| Song | `zin_se_ending_ashen_throne`, `music/zin_se_ending_ashen_throne.ogg`; pending licensed recording |
| Knowledge layers | The reveal is called first (zin_world_reach_ending), so the name may be said. The heir is not mentioned. |

**Title:** The Ashen Throne

**Description:**

> In this telling of the age Afrit, son of Ein, who was worshipped as the Deliverer, rules all Aoaz from the throne of Parim. His temples are full again, his councillors sit in every court that owes the Houses of the First Light a favour, and the few who still say aloud what he is are not often heard saying it twice.
>
> The crowns that fought him have made their peace or gone into the hills, and the bells of Parim ring for him on every feast day, as they once rang for the king before him.

**Button:** The bells ring for him now.

**Quote:** We still keep the feast of the Deliverer in our village, because the steward counts who comes, and my mother says a candle costs less than a visit from the Houses.

**Attribution:** A cottager of the Middle Lands

**Picture brief:** The throne of Parim on a grey ashen dais, the hall dim and full of incense smoke: the Deliverer sits crowned in his radiant public form, but his shadow on the wall behind is the winged demon of his true form; rows of courtiers and priests bow, and the gold of the hall is dulled with ash. Painted, oppressive and quiet. References: `art/source/design_refs/aurevan_a.png`, `art/source/design_refs/afrit_true_v3_c.png`.

**Sound brief:** a false god's peace, solemn, beautiful and hollow; 90 to 120 seconds; slow sacred choral music with organ, beautiful but cold, in a licensed recording. A licensed recording with its licence and source documented (Q-08).

### 21. The Golden Court Endures

| Field | Value |
| --- | --- |
| Key | `ending_golden_court` (id 21) |
| Beat and role | B45; campaign-ending signal |
| Fires when | the global flag `zin_ending_golden_court` is set; owner: World tension (zin_world_reach_ending; news zin_world.103) |
| Who sees it | every human player, once per game; queued behind another super event that is still open |
| Picture | `GFX_zin_se_ending_golden_court`, `gfx/event_pictures/zin/super_events/zin_se_ending_golden_court.dds`, 700 x 500; pending art |
| Song | `zin_se_ending_golden_court`, `music/zin_se_ending_golden_court.ogg`; pending licensed recording |
| Knowledge layers | The secret may still hold: neither the Deliverer nor the Council is named. The text says the Golden Court rules, which covers both the living King and the Regency of Gold. |

**Title:** The Golden Court Endures

**Description:**

> In this telling of the age the Golden Court still rules in Parim. Whatever the long war took from the rest of Aoaz, the Golden Court kept its gold: the feasts go on, the offices are still for sale, and the men who bought them sit at the high table louder than ever.
>
> The chroniclers, who expected to write the end of a dynasty, have instead been asked to write a very long poem in its praise, and are being paid by the line.

**Button:** Pass the gold plate.

**Quote:** I have sold the same office in the customs house four times since the war began, and every buyer has thanked me for it, which tells you all you need to know about the state of the realm.

**Attribution:** Lord Treasurer Halmor Infous

**Picture brief:** A lavish feast in the gilded hall of Parim: long tables loaded with gold plate, courtiers in gold-trimmed finery laughing and toasting, musicians in a gallery, a clerk at a side table counting coins for a line of office-buyers; through the tall windows the distant smoke of a war-torn land. Painted, rich, satirical and warm. References: `art/source/design_refs/golden_king_c.png`.

**Sound brief:** an oblivious court feast, merry and gilded; 60 to 120 seconds; Renaissance court dance music (galliard, pavane, branle) for consort of recorders, viols, lute or loud band, in a licensed recording. A licensed recording with its licence and source documented (Q-08).

### 22. A Western Crown in Parim

| Field | Value |
| --- | --- |
| Key | `ending_western_crown` (id 22) |
| Beat and role | B45; campaign-ending signal |
| Fires when | the global flag `zin_ending_western_crown` is set; owner: World tension (zin_world_reach_ending; news zin_world.104) |
| Who sees it | every human player, once per game; queued behind another super event that is still open |
| Picture | `GFX_zin_se_ending_western_crown`, `gfx/event_pictures/zin/super_events/zin_se_ending_western_crown.dds`, 700 x 500; pending art |
| Song | `zin_se_ending_western_crown`, `music/zin_se_ending_western_crown.ogg`; pending licensed recording |
| Knowledge layers | Proposed telling; the claimant is not named (endings spec). |

**Title:** A Western Crown in Parim

**Description:**

> In this telling of the age western banners still fly over Parim, and the old quarrel of the West and Aenor has ended the other way round. The clans that crossed the central sea for an old debt have stayed to collect it for good, and their captains govern the oldest city of men with the help of its own clerks, whose prayers they still cannot follow.
>
> The Concord meets in exile, in whatever hall it can find, and talks of the day it will take the city back.

**Button:** The debt is paid in full.

**Quote:** My grandfather wanted the debt back with interest, and I have given him Parim, so I hope he is satisfied wherever he is, because I have run out of things to give him.

**Attribution:** A western captain-general in Parim

**Picture brief:** Parim at noon with western clan banners on every tower: a western chieftain-king sits on the old gilded throne in fur and mail with a plain iron crown, his clan captains around him, while the city's clerks in dark robes bring ledgers; outside the windows the domes and temples of the old city. Painted, proud and a little out of place.

**Sound brief:** a rough-handed victory, proud and rustic; 60 to 120 seconds; a folk victory march or song with drums, pipes or fiddles and voices, in a licensed recording. A licensed recording with its licence and source documented (Q-08).

### 23. Master of the Strait

| Field | Value |
| --- | --- |
| Key | `ending_strait_master` (id 23) |
| Beat and role | B45; campaign-ending signal |
| Fires when | the global flag `zin_ending_strait_master` is set; owner: World tension (zin_world_reach_ending; news zin_world.105) |
| Who sees it | every human player, once per game; queued behind another super event that is still open |
| Picture | `GFX_zin_se_ending_strait_master`, `gfx/event_pictures/zin/super_events/zin_se_ending_strait_master.dds`, 700 x 500; pending art |
| Song | `zin_se_ending_strait_master`, `music/zin_se_ending_strait_master.ogg`; pending licensed recording |
| Knowledge layers | Proposed telling. |

**Title:** Master of the Strait

**Description:**

> In this telling of the age Lerendor is master of the Narrow Strait, and every ship that crosses between the North Lands and the Middle Lands lowers its sail at Sonargur and pays the Sovereign's dues. The great harbour chain is raised for any keel that pays and lowered for any that does not, and the counting-house of Sonargur keeps longer hours than the king.
>
> The crowns of the south, who grumble at every toll in Aoaz, grumble at this one too, and pay it.

**Button:** Pay the toll at Sonargur.

**Quote:** We have kept the chain at Sonargur for longer than anyone has kept a record of it, and in all that time no captain has ever paid the dues without telling us they were robbery, nor sailed past without paying them.

**Attribution:** The harbour-master of Sonargur

**Picture brief:** The harbour of Sonargur in the cold north: a massive iron chain stretched across the narrow strait between two towers, a line of merchant ships waiting with lowered sails, Leren tollmen in sea-blue rowing out with ledgers, King Ferlin's banner on the towers and grey sea under a pale sky. Painted, crisp and prosperous.

**Sound brief:** a northern sea power at its height, proud and steady; 60 to 120 seconds; a northern folk or Renaissance march with drums, horns and fiddles, or a sea song with a steady beat, in a licensed recording. A licensed recording with its licence and source documented (Q-08).

### 24. One King in the East

| Field | Value |
| --- | --- |
| Key | `ending_eastern_king` (id 24) |
| Beat and role | B45; campaign-ending signal |
| Fires when | the global flag `zin_ending_eastern_king` is set; owner: World tension (zin_world_reach_ending; news zin_world.106) |
| Who sees it | every human player, once per game; queued behind another super event that is still open |
| Picture | `GFX_zin_se_ending_eastern_king`, `gfx/event_pictures/zin/super_events/zin_se_ending_eastern_king.dds`, 700 x 500; pending art |
| Song | `zin_se_ending_eastern_king`, `music/zin_se_ending_eastern_king.ogg`; pending licensed recording |
| Knowledge layers | Proposed telling. The High King is the East's own; the Deliverer is not mentioned, so the text holds whether or not the secret was ever kept. |

**Title:** One King in the East

**Description:**

> In this telling of the age the East has one king of its own. The courts that quarrelled over every well and caravan road from the rift to the deep sand now answer to one crown, and the caravan masters pay one treasury instead of seven, which is the first thing about the new order that anyone in the East has been glad of.
>
> The envoys of the High King are already on the roads west, asking the other crowns of Aoaz what they mean to do about it.

**Button:** One road, one toll.

**Quote:** In my father's day a caravan from the rift to the deep sand paid seven tolls and three bribes, and now it pays one toll and nobody can tell me where the bribes have gone, which worries me more than the king does.

**Attribution:** A caravan master of Stabilo

**Picture brief:** A desert caravan city at sunset: a long caravan of camels and wagons passes under a single great gate bearing a new royal standard (no lettering), tollmen at one booth, envoys in eastern dress riding out westwards; minarets of no real-world faith and wells and palms. Painted, golden and expansive.

**Sound brief:** a united East, stately and prosperous; 60 to 120 seconds; eastern court or caravan music with oud, kanun, ney and frame drums, in a licensed traditional recording. A licensed recording with its licence and source documented (Q-08).

### 25. The Age Unfinished

| Field | Value |
| --- | --- |
| Key | `ending_unfinished` (id 25) |
| Beat and role | B45; campaign-ending signal |
| Fires when | the global flag `zin_ending_unfinished` is set; owner: World tension (zin_world_reach_ending; news zin_world.107) |
| Who sees it | every human player, once per game; queued behind another super event that is still open |
| Picture | `GFX_zin_se_ending_unfinished`, `gfx/event_pictures/zin/super_events/zin_se_ending_unfinished.dds`, 700 x 500; pending art |
| Song | `zin_se_ending_unfinished`, `music/zin_se_ending_unfinished.ogg`; pending licensed recording |
| Knowledge layers | Fallback telling. |

**Title:** The Age Unfinished

**Description:**

> No crown has ended the Fourth Age. The wars have dragged on into feuds and truces and the great quarrels of the age into treaties nobody quite keeps, and the chroniclers, who had hoped to close their books, have left the last pages blank for someone else to write.
>
> The common folk do not seem to mind very much: the harvest is in, most of the roads are open, and an unfinished age is still one in which a person may grow old.

**Button:** Leave the last pages blank.

**Quote:** The annalist had hoped to close this book with a coronation or a ruin, and must close it instead with the price of barley, which has gone up again.

**Attribution:** The Chronicle of Aoaz, Fourth Age

**Picture brief:** A chronicler's study at evening: a great open chronicle on a lectern, its last pages blank, a quill laid down beside it, and through the window a quiet countryside with a harvest being brought in on carts and a distant column of smoke on the horizon. Painted, wistful and calm, warm lamplight.

**Sound brief:** an open ending, reflective and gentle; 60 to 120 seconds; a quiet piece for lute, harp or a small consort, or a gentle pastoral, in a licensed recording. A licensed recording with its licence and source documented (Q-08).

### 26. The Fall of Nafeher

| Field | Value |
| --- | --- |
| Key | `nafeher_falls` (id 26) |
| Beat and role | B34 (divergence: the realm annexed with the body intact); defeat aftermath |
| Fires when | the global flag `zin_volgan_withdrawn_south` is set; owner: Volgan (modules/mech_volgan.mjs, zin_dominion.txt effects: zin_volgan_withdraws_south, with news zin_dominion.29); owner answer Q-74 (K59) |
| Who sees it | every human player, once per game; queued behind another super event that is still open |
| Picture | `GFX_zin_se_nafeher_falls`, `gfx/event_pictures/zin/super_events/zin_se_nafeher_falls.dds`, 700 x 500; pending art |
| Song | `zin_se_nafeher_falls`, `music/zin_se_nafeher_falls.ogg`; pending licensed recording |
| Knowledge layers | Owner answer Q-74 (K59): the annexation of Volgan's realm with his body intact is a super event. What became of Volgan stays open (C23): nobody saw him fall and the wardens only fear. Volgan is not quoted. The owner's news event `zin_dominion.29` and every effect of `zin_volgan_withdraws_south` stay as they are; the super event is called right after `zin_volgan_withdrawn_south` is set, before the news. |

**Title:** The Fall of Nafeher

**Description:**

> Nafeher has fallen and the Dominion of the Ember Lands is broken: its grave-hosts are scattered, its sworn realms have torn up their oaths and gone their own way, and the hosts of the living stand in the hall where Volgan held his court.
>
> Nobody, though, saw Volgan fall. The last riders out of the south say that he went down into the storms with his crown on his head, and the captains who searched the ruins found his throne cold and empty, with no body before it and no sign of where he went.
>
> The wardens of Mirolon have gone back to their passes, and they have told every court that will listen that a Great Spirit who came back out of the Void once may well come back out of the storms.

**Button:** Keep a watch on the passes.

**Quote:** The old songs said he would come back out of the Void, and he did, so you will forgive us if we keep a fire burning at the passes for as long as there is anyone left in Mirolon to tend it.

**Attribution:** A warden of Mirolon

**Picture brief:** The throne hall of Nafeher in the Ember Lands, half ruined, its roof torn open to a swirling purple and ember-red storm in which a faint green glint can just be made out; the great throne stands empty and cold, with no body and no crown before it; soldiers of the living with torches search the rubble and look up uneasily at the storm, and a grey-cloaked warden of Mirolon stands apart watching the sky. Painted, an uneasy victory, ember, purple and grey. References: `art/source/design_refs/volgan_v4_b.png`.

**Sound brief:** an uneasy victory that does not trust itself, the enemy gone but not ended; 60 to 120 seconds; a slow piece for low strings or a small choir that ends unresolved, or a dark folk lament with a drone instrument, in a licensed recording. A licensed recording with its licence and source documented (Q-08).

## 9. Implementation

### Files

| Path | Content |
| --- | --- |
| `tools/content/data/super_events.json` | The registry: ids, keys, hooks, every text, the picture and sound briefs, the window sizes |
| `tools/content/modules/super_events.mjs` | `buildSuperEvents` (the package) and `hookSuperEvents` (the calls) |
| `tools/content/super_events.test.mjs` | Registry, package, wiring, knowledge-layer, documentation and built-tree tests |
| `interface/zin_super_events.gui` | The window of section 5 |
| `interface/zin_super_events.gfx` | `GFX_zin_se_<key>` to `gfx/event_pictures/zin/super_events/zin_se_<key>.dds` |
| `common/scripted_guis/zin_super_events.txt` | Scripted GUI `zin_super_event` (player context, dirty `zin_se_dirty`) |
| `common/scripted_effects/zin_super_events.txt` | `zin_super_event_<key>`, `zin_super_event_fire`, `_open`, `_close`, `_play` |
| `common/scripted_localisation/zin_super_events.txt` | `zin_loc_super_event_title`, `_desc`, `_quote`, `_button`, `_picture` |
| `common/script_constants/zin_super_events.txt` | `zin_super_events.count` (read by the preview event) |
| `events/zin_super_events.txt` | Namespace `zin_super_event`; `zin_super_event.1`, the hidden console preview |
| `music/zin_super_events.asset` | `zin_se_<key>` to `zin_se_<key>.ogg` |
| `localisation/english/zin_super_events_l_english.yml` | Window text, song titles, and `zin_se_<key>_t`, `_d`, `_q`, `_a` for each moment |

### Names and state

| Name | Kind | Scope | Meaning |
| --- | --- | --- | --- |
| `zin_se_done_<key>` | flag | global | The moment has been shown; it never shows again in this game |
| `zin_se_open` | flag | country (human) | The window is open for this player |
| `zin_se_id` | variable | country | The id on screen |
| `zin_se_queue` | array | country | Ids waiting behind the one on screen, in order |
| `zin_se_dirty` | variable | country | Refreshes the scripted GUI |
| `zin_se_music_off` | flag | country | This player silenced the music of the great moments |
| `zin_se_test_id` | variable | country | The preview event's position |
| `zin_arg_super_event` | temporary variable | | The id passed to `_fire` and `_open` (E1) |

### Assets

Every picture and recording is pending its specialist. The sprites and songs are registered under their final names now, so nothing is renamed when they ship; the frame fallback is not used, so until a picture ships the slot shows the empty frame, and until a recording ships nothing plays.
Each missing file is an asset-check finding accepted in `docs/design/validation/asset_baseline.json` with a reason naming its row in `docs/plans/zin-art/pending_from_integration.md` (section "Super-event pictures and recordings").

| Asset | Size and format | Folder | Handoff |
| --- | --- | --- | --- |
| 26 pictures `zin_se_<key>.dds` | 700 x 500, A8R8G8B8, one mip, generated with gpt-6-luna (K50) at 7:5 and resized; provenance in `art/source/provenance.jsonl` | `gfx/event_pictures/zin/super_events/` | `docs/plans/super_events/art_briefs.json` |
| 26 recordings `zin_se_<key>.ogg` | Ogg Vorbis, 60 to 120 seconds, licensed recordings with licence and source documented (Q-08, K16) | `music/` | `docs/plans/super_events/audio_briefs.json` |

The asset family rules add `super_event_picture` (family E1, 700 x 500) to `tools/content/data/assets/families.json`, `formats.json` and `uniqueness.json` (one picture per super event).

### Acceptance

1. The build stages the package, finds one hook site for each of the 26 flags and passes the asset baseline; `tools/content/super_events.test.mjs` passes.
2. MCP previews of `zin_super_event_window` (preview workspace with stand-in pictures) at 1280 x 720, 1920 x 1080 and 2560 x 1440 at UI scale 1 and 1920 x 1080 at UI scale 1.25: no clipping, the longest description and quote fit, the click regions match the two buttons; evidence in `docs/plans/super_events/framework_handoff.md`.
3. Linux live run (the owner's isolated acceptance route): `event zin_super_event.1` opens the window; closing it shows the next queued one; the music button hides and shows; with a recording in place, `scoped_play_song` plays the song for that player only (if a song in no station does not play, add the station file of section 5).
4. Linux live run: on a historical-path campaign the first super event (the man in the ice) opens by itself when `zin_eindil_awake` is set, once, and never again after a save and load.

## 10. Owner questions

1. **Which moments.** Are these 26 the right set? Candidates left out (section 2) that the owner may want: the hall of Horos (B15), the fall of Mirolon (B22, now told inside Volgan's march), the eastern invasion (B21), the Black Compact (B31), the cliff (B39) and the heir lost (`zin_eindil_lost`, a divergence with its own news event `zin_eindil.140`).
2. **News and super event together.** The endings and the War of the Last Crowns also fire their news events to every country. Should the super event replace the news event for human players, or should both show (today both show)?
3. **The backdrop.** The full-screen backdrop is the ZIN frame tiled across the screen. Should the art specialist paint a dedicated dark backdrop (one 1920 x 1080 picture, for example the night sky over Parim) for the super events?
4. **The quotes' speakers.** Some lines are given to proposed characters (Lozan Heron, Sefan Daldar, Perlan, Halmor Infous); the owner may prefer anonymous voices or different people. Following K54, no quote is given to a proposed woman.
5. **Music channel.** The recordings play as songs on the music channel (they interrupt the playing track, as vanilla's event songs do). Should they play as sound effects over the music instead?
6. **The heir's waking to every player.** The man in the ice is told to every court as a drovers' tale, before anybody knows who he is. Is that the right weight for the waking, or should the first super event wait for his naming?

## 11. Future work

- When the owner answers question 1, add or retire moments by id (never renumber); each new moment needs its hook flag, text, brief and baseline rows.
- When the audio specialist delivers, replace the song title keys with the recordings' titles and credit lines, and record the licences in the canonical audio catalogue of the music spec.
- A "Chronicle of great moments" panel could list the super events already shown in this game and replay them; it would reuse the window and the `zin_se_done_<key>` flags.
