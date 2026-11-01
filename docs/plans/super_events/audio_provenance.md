# Super-event audio: provenance and licence record

**Date:** 1 to 2 November 2026. **Owner decisions:** K52 (super events, licensed sound), K60 (the moments; music channel; the first fires at the naming), K72 (2 November 2026: CC BY-SA recordings with attribution, and copyrighted recordings where no openly licensed piece fits). **Brief:** [audio_briefs.json](audio_briefs.json). **Route:** `hoi4-super-events` (sections 12 to 18) and `hoi4-text-audio-research`. **Staging (outside the mod):** `C:/Users/klimp/Documents/Projects/hoi4-agent-tools/.tmp/zin-art/audio/super_events/` (originals, snapshots, processed outputs, `originals_sha256.txt`).

## Status

All 31 moments now have a placed, sourced, converted cue: 16 from the first pass and K72 pass (sections 2 and 5a) and 15 from the Kevin MacLeod catalogue (section 2b, CC BY 4.0). No moment remains blocked. The owner's audition is required for every cue, and the MacLeod cues are produced recordings made with sample instruments, which the owner must accept (section 5). Every placed cue still needs the owner's audition (section 5). No cue was generated, synthesised, or recorded, and none is reused between moments. No copyrighted recording was placed, because no legitimately downloadable copyrighted recording was found (section 3).

## 1. How the files were made

- **Sources.** Wikimedia Commons (file pages and API licence fields), the Internet Archive item page, and the Commons Musopen mirror. Each original was downloaded from its page's own URL and hashed (`originals_sha256.txt`). Commons API metadata is in `snapshots/commons_api_metadata.json`.
- **Conversion.** ffmpeg. Each cue is one trim of the original (no edit to the musical content beyond the trim), a 1.5 s fade-in, a 3 to 4 s fade-out, `loudnorm` to -16 LUFS with a -1.5 dBTP ceiling, stereo, 44.1 kHz, Ogg Vorbis `libvorbis -q:a 5`. This matches the installed vanilla music (vorbis, 44.1 kHz, 2 channels).
- **Length.** Every placed cue is 41 to 55 s, following the parent's instruction of 30 to 60 s. The audio briefs' 60-to-120-s guidance is not met; the owner should confirm 30 to 60 s.
- **Licence handling under K72.** A CC BY-SA cue keeps CC BY-SA 3.0 or 4.0 on its file and needs the attribution in section 6. The rest of the mod stays all rights reserved (K72).
- **Listening.** Nothing was auditioned by ear. Fit was judged from catalogue descriptions, performer credits and instrumentation, and levels and format were measured with ffmpeg.

## 2. Placed cues: first pass and K72 pass (16)

Path: `music/zin_se_<key>.ogg` in the mod root (the names the music entries of `music/zin_super_events.asset` expect, volume 0.8). The licence column gives the file's own licence.

| Id | Key | Duration | Source (original) | Composition | Recording (performer, release) | Licence | Confidence |
|---:|---|---:|---|---|---|---|---|
| 2 | golden_king_dead | 50.0 s | Bach, *Komm, süsser Tod* BWV 478; `File:Komm, süsser Tod, BWV 478.ogg` (https://commons.wikimedia.org/wiki/File:Komm,_s%C3%BCsser_Tod,_BWV_478.ogg) | Bach, d. 1750, public domain | Musopen upload (2025, uploader CCclassicwiki); performer not named; trimmed and noise-reduced by Musopen | PDM-owner | Medium |
| 3 | deliverer_crowned | 50.0 s | Palestrina, *Missa Papae Marcelli*, Sanctus; `File:Missa Papae Marcelli - IV. Sanctus.flac` | Palestrina, d. 1594, public domain | European Archive / Musopen | CC0 | Medium-high |
| 10 | king_of_the_east | 55.0 s | Oud, *maqam Sabā*; `File:عزف مقام الصبا.webm` (https://commons.wikimedia.org/wiki/File:%D8%B9%D8%B2%D9%81_%D9%85%D9%82%D8%A7%D9%85_%D8%A7%D9%84%D8%B5%D8%A8%D8%A7.webm) | Traditional maqam | Faisal al-Otaibi (فيصل العتيبي), uploader Abo Yemen, 2025 | CC BY 3.0 | Medium-high on the licence; not heard |
| 11 | parim_taken | 41.4 s | Carolan, *Lament for Owen Roe O'Neill*, bagpipe arrangement by Emmett Jordan; Internet Archive `FranciscanFuneralLamentOneill1649`, file `No.13-Track001_20140226-050936.ogg` (https://archive.org/details/FranciscanFuneralLamentOneill1649) | Carolan, d. 1738, public domain | Emmett Jordan (uploader and performer), 2014 | CC0 (item licenseurl, stated by the uploader) | Medium-high |
| 13 | varner_falls | 50.0 s | Byrd, *Mass for four voices*, Agnus Dei; `File:Byrd 4-Part Mass - Agnus Dei.ogg` | Byrd, d. 1623, public domain | Ensemble Morales | CC BY 3.0 | High |
| 14 | volgan_broken | 50.0 s | Byrd, *Mass for four voices*, Kyrie; `File:Byrd 4-Part Mass - Kyrie.ogg` | Byrd, d. 1623, public domain | Ensemble Morales | CC BY 3.0 | Medium-high; the Kyrie resolves, so the fit to "unresolved" is weak |
| 15 | kusven_forth | 50.0 s | Palestrina, *Missa Papae Marcelli*, Kyrie; `File:Missa Papae Marcelli - I. Kyrie.flac` | Palestrina | European Archive / Musopen | CC0 | Medium-high; polyphonic Kyrie, a weak fit to "dark sacred choral" |
| 17 | afrit_dead | 50.0 s | Bach, *Cantata BWV 147*, chorale "Jesus bleibet meine Freude"; `File:Bach, BWV 147, 10. Jesus bleibet meine Freude.ogg` | Bach, d. 1750 | Orchestra Gli Armonici, Musopen upload | CC0 | Medium-high |
| 19 | ending_children_of_volgan | 50.0 s | Palestrina, *Missa Papae Marcelli*, Agnus Dei II; `File:Missa Papae Marcelli - VI. Agnus Dei II.flac` | Palestrina | European Archive / Musopen | CC0 | Medium-high |
| 21 | ending_golden_court | 50.0 s | Handel, Suite HWV 427 No. 2, Allegro; `File:Handel - Suite Vol.1 No. 2 in F major HWV 427 - 4. Allegro.oga` | Handel, d. 1759, public domain | Musopen (harpsichord) | Public domain (Musopen) | Medium-high; Baroque court music, not the Renaissance dance the brief names |
| 25 | ending_unfinished | 49.9 s | Minuet in G, Anh. 114; `File:Minuet in G major, Anh. 114 - Notebook for Anna Magdalena Bach.ogg` | Attributed to Bach (disputed), public domain | Aaron Dunn (uploader; performance not described) | PDM-owner | Medium |
| 27 | hall_of_horos | 50.0 s | Palestrina, *Missa Papae Marcelli*, Agnus Dei I; `File:Missa Papae Marcelli - V. Agnus Dei I.flac` | Palestrina | European Archive / Musopen | CC0 | Medium-high |
| 31 | the_cliff | 50.1 s | Schumann, *Nänie* (Op. 113), sung by the dwsChorale; `File:Schumann Naenie sung by the dwsChorale.ogg` (https://commons.wikimedia.org/wiki/File:Schumann_Naenie_sung_by_the_dwsChorale.ogg) | Schumann, d. 1856, public domain (text by Schiller) | dwsChorale, uploader (no further credit on the file) | CC BY-SA 3.0 | Medium; the elegy's closing harmony was not checked against "open, unresolved" |
| 32 | without_the_heir | 50.0 s | Beethoven, *Symphony No. 3* (Eroica), II. Marcia funebre; `File:Beethoven - Symphony No. 3 ... Marcia funebre ... (Musopen Symphony).flac` | Beethoven, d. 1827, public domain | Musopen Symphony | Public domain (Musopen) | Medium-high; a famous concert movement |
| 24 | ending_eastern_king | 55.0 s | Oud music by Andy R. Jordan, `File:Oud music by Andy R. Jordan 1V2 long.mp3` (https://commons.wikimedia.org/wiki/File:Oud_music_by_Andy_R._Jordan_1V2_long.mp3) | Traditional oud line | Andy R. Jordan (commissioned by the Wikimedia Foundation, per the file's credit line) | CC BY-SA 3.0 | Medium-high on the licence; not heard |
| 28 | ending_ashen_throne | 50.0 s | Luther chorale *O Lord God*, sung by Musicatluther; `File:16 O Lord God.flac` (https://commons.wikimedia.org/wiki/File:16_O_Lord_God.flac) | Lutheran chorale, public domain | Musicatluther (uploader and performer) | CC BY-SA 4.0 | Medium; the chorale is Lutheran and sacred, which fits "slow sacred choral, cold"; not heard |

Note: the ids of the last three rows (31, 24, 28) are the moments' ids. The table is sorted by id within the placed set. The moments placed by the first pass that were later withdrawn are in section 7.

## 2b. Kevin MacLeod cues (incompetech, CC BY 4.0, 15 moments)

Source: the incompetech catalogue (https://incompetech.com/music/royalty-free/music.html), its `pieces.json` (1,443 entries, with title, ISRC and feel) and the direct MP3 path `https://incompetech.com/music/royalty-free/mp3-royaltyfree/<Title>.mp3`. Each original was downloaded from that path and is `originals/incompetech/<key>.mp3` in staging; SHA-256 is in section 2c. Licence: Creative Commons Attribution 4.0 (CC BY 4.0). Attribution line for each cue: `"<Title>" Kevin MacLeod (incompetech.com), Licensed under Creative Commons: By Attribution 4.0 License http://creativecommons.org/licenses/by/4.0/`.

Production note for the owner (K72 and the coordinator's direction): these are composer-produced tracks rendered with sample-based instruments, not live recordings. The coordinator treats them as licensed recordings. The no-synthesis rule in the brief concerns audio generated by this project; the owner must confirm that these produced tracks are acceptable.

| Id | Key | Title | Duration (cue) | ISRC | Fit (from the catalogue, not heard) | Flag |
|---:|---|---|---:|---|---|---|
| 4 | heir_of_aen | Teller of the Tales | 50.0 s | USUAN1400020 | Lute and guitar duet, "ancient-inspired", calming and somber; the brief asks for harp and voice or slow chant | Plucked duet, not voice; medium |
| 5 | last_crowns | Crusade | 50.0 s | USUAN1100884 | Horns, trombones, trumpets, percussion; epic, dark, somber; "travelling music" | Composer says it was written for a video game (title unidentified); medium |
| 6 | western_crossing | Crossing the Chasm | 50.0 s | USUAN1700026 | Drums, low strings, a singer; action, dark, driving; a sea-crossing war host | The composer's note ties it to his "Adventure, Ho!" show (not a broadcast theme); owner to check; medium |
| 7 | black_north_marches | Oppressive Gloom | 50.0 s | USUAN1100885 | Strings, bass clarinet, percussion; "almost a death march" | Composer's note: loops, needs trimming; medium-high |
| 8 | volgan_marches | Wretched Destroyer | 50.0 s | USUAN1700041 | Basses, cellos, bassoons, pipe organ; dark, driving, eerie | Listed on filmmusic.io (licensed for film use; not a famous film); medium |
| 9 | name_of_the_deliverer | Intrepid | 50.0 s | USUAN1500062 | Strings, tuba, trombones, prepared piano, voice, drums; eerie, somber; "early music flair" | Contains a vocal; medium |
| 12 | heir_returns | Heroic Age | 50.0 s | USUAN1100848 | Flutes, clarinets, oboes, brass, strings; epic, bright, heroic (the source is 1:37) | Listed on filmmusic.io; medium |
| 18 | ending_lost_cause | Noble Race | 50.0 s | USUAN1100888 | Full orchestra; epic, semi-heroic | No choir or organ, so a weak fit to a coronation anthem; owner to judge; medium-low |
| 22 | ending_western_crown | Village Consort | 50.0 s | USUAN1700007 | Guitar, recorders, gemshorn, drums; a rustic medieval village, bouncy | The composer says it is not historically accurate; medium |
| 23 | ending_strait_master | Royal Coupling | 50.0 s | USUAN1900054 | Flutes, horns, strings, brass; bright, with "a bit of a march" | Listed on filmmusic.io; a weak march; medium-low |
| 26 | nafeher_falls | Plaint | 50.0 s | USUAN1300009 | Bassoon and harp; slow, dark, somber; "a sense of grief" | Composer notes it works behind dialogue; medium-high |
| 28 | mirolon_falls | Death of Kings | 50.0 s | USUAN1100876 | Horns, trombones, cimbasso, trumpets, drum, chimes; "remembrance for brass" | Similar in colour to id 32; medium-high |
| 29 | east_crosses_the_rift | Tabuk | 50.0 s | USUAN1100818 | Strings, percussion, flute; "epic plodding middle-eastern sounding" | Composer's note: "grab your camels"; medium |
| 30 | black_compact | The Descent | 50.0 s | USUAN1200094 | French horns, trombones, tuba, strings, percussion; dark, driving, epic | Composer's note: "should fit nicely into a lot of scenes"; medium |
| 16 | lorien_falls | Past the Edge | 50.0 s | USUAN1400026 | Solo voice, bass, cellos, violins; slow, dark, somber | Source is 78 s, cue is 50 s; medium-high |

Section 2c. SHA-256 of the MacLeod originals (staging `originals/incompetech/`):

- black_compact.mp3: f097d51700b970efffc62499473ea3a31e09aad4172e787978bc9c2a644d53a2
- black_north_marches.mp3: d630686bde6c92f832fb0cb16f6ce9009bf502c7db701139329af2a7683b1020
- east_crosses_the_rift.mp3: 4e54edb6b0f7ee6ff9469f289c8902e8b96ed04dbb809b97c79a7fbca8a7d47c
- ending_lost_cause.mp3: d4037ceba8a60a0745bb1b22e5d938c6e40ce54720b6d93d86c3c21236796468
- ending_strait_master.mp3: 893735fa4e3b0f275a642f5660d3c42402c9ba7bc4d3b2ff9df5c35a2616bbbb
- ending_western_crown.mp3: 53861c78cb4c788f83b563d47fb4fa73bf4c66a8786d61215750738d856a8fd2
- heir_of_aen.mp3: 320b37a09fc37ec5962c975563541bee9bcbf1208b0181789248780286f4c1d4
- heir_returns.mp3: d0bbd367ab8c6d744e18f317df12de67e1b40f8b5d1c3812d7025eec9e9a0e7b
- last_crowns.mp3: 863758365f6a03cd0cf85237d7d49448d5cb3c1af2e0858dc7c786bc9c0b981e
- lorien_falls.mp3: 919cd90d4217b8273f025586271f3877f71cf0c35b85beea9058b02cfbfd6610
- mirolon_falls.mp3: 758885b7f934885ce9b89f5ab08596032ea46ad6c49d01967e874426e2d4de02
- nafeher_falls.mp3: 9a6eb66618aca51f2775aa2c7371a8a8f1d3dde65dda6ed4d2ae156781215f86
- name_of_the_deliverer.mp3: 3135ebcc2046ad41a14036f590b4ab55d675093aa0658b41bff4984f19d0814e
- volgan_marches.mp3: f7002ab851fffe2e26f2fdca06677e2f09bb883787f0371365390c784f90ed12
- western_crossing.mp3: f11f2a010704e404531f1cfb7549152dc58f62cae556eaec1f066eac3588f8c2

## 3. Candidates rejected or unplaced

- **Medieval Dream by Frank Schröter** (CC BY 4.0, Commons): the file describes itself as "Quiet Medieval Music for Medieval Market, Film, TV, Games etc.", a stock-production track. Its instruments could not be verified as live rather than synthesised, so it was rejected (synthesis unverified). Its heir-of-Aen fit was otherwise plausible.
- **Balletto detto Il conte Orlando**, Respighi (Commons, "public domain"): the file is a 2010 performance by the US Marine Band (credit: marineband.usmc.mil download). The composition (from Respighi's 1917 suite) is public domain in most territories, but the file's recording credit is an official military-band download with no separate performer or label rights stated, and the Balletto is a dance rather than the grave battle piece the moment asks for. Rejected on the recording's rights statement and on fit.
- **Stichira, Russian male choir (CC BY-SA 3.0):** a Russian Orthodox liturgical recording; the identity is too tied to one real national church to be used in an invented world. Rejected on fit.
- **Den blomstertid nu kommer, 4-stämmig sång (CC BY-SA 4.0), Two Guitars Piantel (CC BY-SA 3.0):** national folk song and modern guitar; rejected on fit.
- **Gregorian chant items marked CC BY-SA** (Schola Gregoriana, Petits Chanteurs de Passy, Paterm, Adabo60ge, Hfst, and others): not used. Share-alike is now allowed by K72, but these were not needed for any unplaced moment.
- **Oud, Fuad al-Kibsi (CC BY 3.0, 557 MB webm):** not downloaded (size). Not needed, since id 24 now has a CC BY-SA oud.
- **Byrd Sanctus (CC BY 3.0):** downloaded in the first pass, not placed (no open moment fitted it better).
- **Mozart Mass in C minor K. 427, Kyrie (CC0 on Commons, 13 MB mp3):** not converted; no unplaced moment needed it.
- **KevinMacLeod, Gregorian chant (CC BY 3.0):** not used, because it is a composed and synthesised track.
- **Dies irae (Membeth) and Lamentation III (Membeth), public domain and CC0 by the uploader's own declaration:** not placed, under the lead's decision that a claim resting only on the uploader is not defensible. Originals kept in staging.
- **Charpentier, Te Deum prelude (CC0):** not placed, under the lead's decision (recognisable broadcast theme).
- **Copyrighted recordings (K72):** none placed. A legal download of a copyrighted recording was not available in this session. Any copyrighted cue, if later sought, must come from a licensed source with its rights holder named (composer, performer, label, release year), never a rip. Copyrighted cues can be taken down from a published mod.

## 4. Blocked moments (first record, now all filled)

The table below is the record of the search before the Kevin MacLeod pass. Every row is now placed as section 2b (or section 2 for the earlier fills); no moment is blocked.

| Id | Key | Why blocked |
|---:|---|---|
| 4 | heir_of_aen | The only open-licence candidate, Gregorian *Ad te levavi* (CC0), is 17 s. The other candidate (Schröter) is rejected as unverified synthesis. A harp-and-voice or slow chant of 30 s or more is needed. |
| 5 | last_crowns | No martial early-music recording (drums, sackbuts, shawms, estampie) found with an open or CC BY-SA licence. |
| 6 | western_crossing | No rowing-rhythm or work-song recording found. |
| 7 | black_north_marches | Only the Dies irae (Membeth, PD by the uploader's own declaration), withdrawn. |
| 8 | volgan_marches | No heavy dark march found. |
| 9 | name_of_the_deliverer | No dissonant minor-key choral or unsettled strings recording found. |
| 12 | heir_returns | Only the Charpentier prelude, withdrawn (recognisable broadcast theme). |
| 18 | ending_lost_cause | No coronation anthem for choir, organ and brass found. |
| 22 | ending_western_crown | No folk victory march with drums, pipes or fiddles found. |
| 23 | ending_strait_master | No northern march or sea song found. |
| 26 | nafeher_falls | No slow low-string or small-choir piece ending unresolved found. |
| 28 | mirolon_falls | The only pipe lament was used for id 11. Not replaced. |
| 29 | east_crosses_the_rift | No eastern martial piece with frame drums and reeds found. |
| 30 | black_compact | No dark march for low brass or heavy minor-key choir found. |
| 16 | lorien_falls | Only the Lamentation III (Membeth, CC0 by the uploader's own declaration), withdrawn. |

The searches behind these blocks: Commons categories (Musopen, Gregorian chant, oud, choirs, harp, folk, and others), Commons text search, Internet Archive subject searches, the Internet Archive 78rpm collection (regimental marches, rejected on identity), Freesound search pages (CC0 hits are mostly single notes or sound effects; full downloads need a logged-in account), and Free Music Archive (its results are JavaScript-rendered and could not be searched). Musopen and the Library of Congress National Jukebox returned HTTP 403 to scripted requests. The blocks are not proof that no recording exists.

## 5. Owner audition list and actions

Audition every file below in the mod before accepting it. Nothing was heard by the agent.

1. `music/zin_se_golden_king_dead.ogg`
2. `music/zin_se_deliverer_crowned.ogg`
3. `music/zin_se_king_of_the_east.ogg`
4. `music/zin_se_parim_taken.ogg`
5. `music/zin_se_varner_falls.ogg`
6. `music/zin_se_volgan_broken.ogg`
7. `music/zin_se_kusven_forth.ogg`
8. `music/zin_se_afrit_dead.ogg`
9. `music/zin_se_ending_children_of_volgan.ogg`
10. `music/zin_se_ending_golden_court.ogg`
11. `music/zin_se_ending_unfinished.ogg`
12. `music/zin_se_hall_of_horos.ogg`
13. `music/zin_se_without_the_heir.ogg`
14. `music/zin_se_the_cliff.ogg`
15. `music/zin_se_ending_eastern_king.ogg`
16. `music/zin_se_ending_ashen_throne.ogg`
17. `music/zin_se_heir_of_aen.ogg` (MacLeod, Teller of the Tales)
18. `music/zin_se_last_crowns.ogg` (MacLeod, Crusade)
19. `music/zin_se_western_crossing.ogg` (MacLeod, Crossing the Chasm; check the composer's show link)
20. `music/zin_se_black_north_marches.ogg` (MacLeod, Oppressive Gloom)
21. `music/zin_se_volgan_marches.ogg` (MacLeod, Wretched Destroyer)
22. `music/zin_se_name_of_the_deliverer.ogg` (MacLeod, Intrepid)
23. `music/zin_se_heir_returns.ogg` (MacLeod, Heroic Age)
24. `music/zin_se_ending_lost_cause.ogg` (MacLeod, Noble Race; a weak coronation fit)
25. `music/zin_se_ending_western_crown.ogg` (MacLeod, Village Consort)
26. `music/zin_se_ending_strait_master.ogg` (MacLeod, Royal Coupling; a weak march)
27. `music/zin_se_nafeher_falls.ogg` (MacLeod, Plaint)
28. `music/zin_se_mirolon_falls.ogg` (MacLeod, Death of Kings)
29. `music/zin_se_east_crosses_the_rift.ogg` (MacLeod, Tabuk)
30. `music/zin_se_black_compact.ogg` (MacLeod, The Descent)
31. `music/zin_se_lorien_falls.ogg` (MacLeod, Past the Edge)

Owner decision needed on the MacLeod cues (section 2b): whether composer-produced tracks with sample instruments are accepted as the "licensed recording" for the brief.

Other actions:
- Confirm the length target: 30 to 60 s (this record, the parent's instruction).
- Wire the sound: the music entries of `music/zin_super_events.asset` already name these files. The player titles (`zin_se_<key>`) are not yet set to the recording titles.
- The 15 blocked moments keep the pending rows SA02 to SA32 in `docs/plans/zin-art/pending_from_integration.md` for their moments only.
- Under K72, the CC BY-SA cues (`the_cliff`, `ending_eastern_king`, `ending_ashen_throne`) carry their licence on the file; the attribution is in section 6.

## 6. Credits and attribution text

Attribution lines for the credits. CC0 and public-domain items need no attribution line but are listed for completeness. The canonical machine-readable form of every line is in `tools/content/data/super_event_music.json` (field `attribution`) and the grouped paste-ready list is in `docs/plans/super_events/CREDITS_music.md`; those two files are generated from one table, and this section matches them apart from markdown italics and the "Used in" tails.

- Byrd, Mass for four voices: Agnus Dei, performed by Ensemble Morales. CC BY 3.0. Via Wikimedia Commons. Used in `varner_falls`.
- Byrd, Mass for four voices: Kyrie, performed by Ensemble Morales. CC BY 3.0. Via Wikimedia Commons. Used in `volgan_broken`.
- Oud performance, *Maqam al-Sabā* (عزف مقام الصبا), by Faisal al-Otaibi. CC BY 3.0. Via Wikimedia Commons. Used in `king_of_the_east`.
- Oud music, by Andy R. Jordan (commissioned by the Wikimedia Foundation, per the file's credit line). CC BY-SA 3.0. Via Wikimedia Commons. Used in `ending_eastern_king`. Share-alike applies to this file.
- Schumann, *Nänie* Op. 113, sung by the dwsChorale. CC BY-SA 3.0. Via Wikimedia Commons. Used in `the_cliff`. Share-alike applies to this file.
- *O Lord God* (Luther chorale), sung by Musicatluther. CC BY-SA 4.0. Via Wikimedia Commons. Used in `ending_ashen_throne`. Share-alike applies to this file.
- Carolan (Turlough O'Carolan), *Lament for Owen Roe O'Neill*, bagpipe arrangement by Emmett Jordan. CC0 (stated by the uploader). Via the Internet Archive. Used in `parim_taken`.
- Palestrina, *Missa Papae Marcelli* (Sanctus, Kyrie, Agnus Dei I and II): European Archive recording, released by Musopen. CC0. Used in `deliverer_crowned`, `kusven_forth`, `ending_children_of_volgan`, and `hall_of_horos`.
- Bach, *Komm, süsser Tod* BWV 478: Musopen upload, PDM-owner. Used in `golden_king_dead`.
- Bach, *Cantata BWV 147*, chorale "Jesus bleibet meine Freude": Orchestra Gli Armonici, Musopen upload. CC0. Used in `afrit_dead`.
- Handel, Suite HWV 427 No. 2: Musopen, public domain. Used in `ending_golden_court`.
- Bach, Minuet in G, Anh. 114: uploader Aaron Dunn, PDM-owner. Used in `ending_unfinished`.
- Beethoven, *Symphony No. 3* (Eroica), II. Marcia funebre: Musopen Symphony, public domain. Used in `without_the_heir`.

- Kevin MacLeod, incompetech (CC BY 4.0): each cue carries the attribution line `"<Title>" Kevin MacLeod (incompetech.com), Licensed under Creative Commons: By Attribution 4.0 License http://creativecommons.org/licenses/by/4.0/`. Titles and cue files: Teller of the Tales (`zin_se_heir_of_aen`), Crusade (`zin_se_last_crowns`), Crossing the Chasm (`zin_se_western_crossing`), Oppressive Gloom (`zin_se_black_north_marches`), Wretched Destroyer (`zin_se_volgan_marches`), Intrepid (`zin_se_name_of_the_deliverer`), Heroic Age (`zin_se_heir_returns`), Noble Race (`zin_se_ending_lost_cause`), Village Consort (`zin_se_ending_western_crown`), Royal Coupling (`zin_se_ending_strait_master`), Plaint (`zin_se_nafeher_falls`), Death of Kings (`zin_se_mirolon_falls`), Tabuk (`zin_se_east_crosses_the_rift`), The Descent (`zin_se_black_compact`), Past the Edge (`zin_se_lorien_falls`).

## 7. Withdrawals and the second pass

- **Withdrawn in the second pass (lead decision):** `black_north_marches` (Dies irae: uploader's declaration only), `lorien_falls` (Lamentation III: uploader's declaration only), `heir_returns` (Charpentier prelude: recognisable broadcast theme). The originals are still in staging.
- **Placed in the K72 pass:** `the_cliff` (Schumann, CC BY-SA), `ending_eastern_king` (oud, CC BY-SA), `ending_ashen_throne` (Luther chorale, CC BY-SA).
- **Kevin MacLeod pass (lead direction):** the 15 blocked moments were filled from the incompetech catalogue (section 2b). Their candidates were chosen from the catalogue's feel, instrumentation and description, not by ear. Malicious was excluded (the composer's note links it to the broadcast show Legends of the Hidden Temple). Intrepid was chosen instead for name_of_the_deliverer.
- **Now placed (31):** every moment has a cue (section 8).

## 8. Files placed (mod root `music/`, all 31 moments)

The 31 files are `music/zin_se_<key>.ogg`, one per moment key in `docs/plans/super_events/audio_briefs.json`. Section 2 (16 cues from the first and K72 passes) and section 2b (15 MacLeod cues) give their sources, and section 5 lists all 31 for the owner's audition.

## 8a. Earlier placement record (16 cues)

`zin_se_afrit_dead.ogg`, `zin_se_deliverer_crowned.ogg`, `zin_se_ending_ashen_throne.ogg`, `zin_se_ending_children_of_volgan.ogg`, `zin_se_ending_eastern_king.ogg`, `zin_se_ending_golden_court.ogg`, `zin_se_ending_unfinished.ogg`, `zin_se_golden_king_dead.ogg`, `zin_se_hall_of_horos.ogg`, `zin_se_king_of_the_east.ogg`, `zin_se_kusven_forth.ogg`, `zin_se_parim_taken.ogg`, `zin_se_the_cliff.ogg`, `zin_se_varner_falls.ogg`, `zin_se_volgan_broken.ogg`, `zin_se_without_the_heir.ogg`. The `music/` folder is new and untracked; nothing was committed.
