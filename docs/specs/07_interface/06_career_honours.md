# Career, honours and the meta surfaces

**Status:** Draft. Written 19 October 2026 for the master plan's gap list ([00_master_overhaul_plan.md](../00_master_overhaul_plan.md) section 7, decision P11). **Priority:** 5. **Phase:** 3 for the data files (stage 3 of vanilla removal), 7 for the windows and art.

P11 says the career profile, ribbons, medals, achievements, the wiki button and the officer-corps view are "hidden or replaced" and the weekday names are renamed. This spec decides each surface. One decision departs from a proposal in the politics inventory: the **officer-corps view is kept**, not hidden, because it is the only door to the doctrine trees (section 8). One decision follows the inventory over the master plan's shorthand: the career profile is hidden at its two entry points and its windows stay defined, because the engine opens the playthrough overview itself at the end of a game (section 3).

## Purpose

The vanilla game carries a layer of honours and meta screens that name the Second World War or the base game: a Steam career profile with ribbons and medals, an achievements list, a wiki button that opens the base game's encyclopedia, a pause menu with marketing links, weekday names from the real calendar, commander ranks from modern armies, division citations that copy real decorations, and air aces named for real pilots. [PROGRAM.md](../PROGRAM.md) T2 and T3 require that none of it reaches a player.

This spec says, for each surface, whether it is hidden, replaced or reskinned; the engine-safe way to do it (what must stay defined); the Erdae replacement where one is kept (the Honours of the Field are the large one); the files, builder modules and identifiers; and how it is checked. The wording of the whole text sweep is [05_text_sweep.md](05_text_sweep.md); this spec writes the ranks, weekday names and honours text through `text_honours.mjs` and feeds the glossary.

## Lore basis

| Fact | Status | Source |
| --- | --- | --- |
| Erdae has known peace for more than seventeen centuries; its armies are hosts, companies and banners, not divisions and corps | proposed (campaign note); terms proposed | *The Campaign of 4A 1748*, [01_warfare.md](../03_gameplay/01_warfare.md) |
| The Holy Seven are said to have created the gods; few believe they existed; their mythic names are unselected | established; names open | vault, *Holy Seven*, [03_names_and_terms.md](../02_lore/03_names_and_terms.md) |
| The veiled sun is the Deliverer's public sign | established; sign proposed | [02_icon_catalog.md](../05_focus_trees/02_icon_catalog.md), [02_full_ui_reskin.md](02_full_ui_reskin.md) |
| Every honour name direction, rank title, weekday name and Annals label below | **proposed** | this spec |

The weekday names and honour motifs use no god's name and no sun disc. They close no open question: the Holy Seven stay unnamed, no honour is tied to Zol's keeper, Volgan's spirit or Dardan, and no honour text states who rules Zol's Mistake.

## Design

### 1. Decisions

| Surface | Rows | Decision | Engine-safe method |
| --- | --- | --- | --- |
| Career profile window (main menu button) | UI-022, PS-057, MA-077 | **Hide** the entry | Hide `career_profile_button` and `career_profile_button_star` in the main-menu override of [03](03_main_menu_and_frontend.md); the windows stay defined |
| Playthrough overview (pause menu button and end of game) | PS-178, PS-056, UI-060 | **Hide the pause button; reskin and re-text the window** the engine opens at the end of a game as the **Annals of the Reign** | Hide `menu_playthrough_stats_button` and its star in the pause-menu override; keep `playthrough_overview_window`; hide its awards tab in an override of its 148-line file; four backgrounds replaced |
| Awards tab, ribbons, medals, profile pictures and backgrounds | PS-113, PS-115, WE-145, WE-146, MA-077 | **Hide**; the data files stay valid with one inert entry each | Same-name overrides: one ribbon, one medal, one picture, one background, never earnable |
| Achievements (list, buttons, definitions, text) | UI-021, UI-133, PS-111, PS-112, MA-121 | **Hide** | Definitions already inert (`zin_unwritten_page`); hide the pause-menu button (the main-menu button is [03](03_main_menu_and_frontend.md)) |
| Wiki buttons (pause menu, two trait windows, options) and wiki mirror | UI-144 | **Hide the three buttons; re-text the option**; the Chronicle of Erdae is the encyclopedia | Overrides of `ingamemenu.gui`, `armytraittreewindow.gui`, `navytraittreewindow.gui`; options text only |
| Pause menu layout and links | UI-060 | **Reskin and re-flow**; keep the homepage and privacy buttons, hide the seven community and marketing links | Override of `ingamemenu.gui` |
| Weekday names | PS-166 | **Rename** the seven | Seven keys in `core`, owned by `text_honours.mjs` |
| Commander ranks, division titles and rank badges | UI-134, WE-141, PS-045, WE-202 | **Replace**; the titles are [08_institutions.md](../03_gameplay/08_institutions.md)'s, the keys and badges are written here | Keys `rank1` to `rank4`, `naval_rank1` to `naval_rank4`, the division titles; two badge strips replaced by texture |
| Division and ship citations (unit medals) | UI-023, PS-114, WE-147, WE-202 | **Replace with the Honours of the Field**: 42 honours by people, alignment and story | Same-name override of `common/unit_medals/00_default.txt` |
| Officer-corps view (the Staff Office) | WE-143, PS-022, PS-023, PS-025, WE-144 | **Keep and reskin as the Council of Captains** (the institutions spec's name) | Reskin by shared chrome; re-text; no override |
| Air aces | MA-066 | **Keep as Riders of Note**; five generic portraits | Texture replacement; text through the glossary |
| End-of-game dialog and score | UI-059 | **Reskin**; the score and result labels re-texted | Shared chrome; no override (`endgame_dialog` in `menubar.gui`) |
| Rich presence (friends-list status) | UI-019, MA-122 | **Replace the wording** | Decided in [05_text_sweep.md](05_text_sweep.md) section 7 |

### 2. What must stay defined (crash and error list)

A hidden surface is never deleted. These stay, checked against the installed 1.19.3.0 files on 19 October 2026:

- The career windows in `interface/career_profile/*.gui` (`career_profile_general_view`, `career_profile_awards`, `career_profile_statistics_view`, `career_profile_profile_picture`, `playthrough_overview_window`, `career_profile_award_display`, `medal_popup_window`, `ribbon_popup_window`) and the sprites in `common_components.gfx`, `medal_and_ribbon.gfx`, `profile_pictures.gfx`, `profile_backgrounds.gfx`. `career_profile_vertical_slider` (defined in `core.gui`) is used by the friends view and the message log; it is never touched.
- The sprites `GFX_icon_best_in_career`, `GFX_playthrough_stats_bg`, `GFX_playthrough_stats_bg_default`, `GFX_career_profile_bg_default`, `GFX_trait_wiki`, `GFX_wiki_button`, `GFX_main_lobby_button`.
- `common/achievements.txt` (at least one entry), `common/ribbons`, `common/medals`, `common/unit_medals`, `common/profile_pictures` and `common/profile_backgrounds` (each at least one valid entry, with picture and background 1 as the defaults), `country_metadata/00_country_metadata.txt` (a `default` entry whose two sprites exist).
- Every element name of an overridden `.gui` file. Hidden elements keep their names, move to `position = { x = -10000 y = -10000 }`, take `alwaystransparent = yes` and the empty sprite `GFX_zin_empty`, as [02_full_ui_reskin.md](02_full_ui_reskin.md) section 2.1 requires.
- `GFX_ace_none` ("don't remove this", `interface/aces.gfx`), the four default ace portraits, and `common/aces/00_aces.txt` (its tags are not displayed).
- Every medal icon sprite a ZIN honour names, in both sizes (`GFX_zin_medal_<line>` and `GFX_zin_medal_<line>_large`).

### 3. Career profile, ribbons, medals, pictures (hidden, inert)

**Entry points.** The main menu button `career_profile_button` (position 16, 138 in `frontendmainview.gui`, text `MENU_BAR_CAREER_PROFILE`) and its star icon are hidden by adding two rows to the main-menu override's hidden table in [03_main_menu_and_frontend.md](03_main_menu_and_frontend.md) section 2.2. The pause menu's `menu_playthrough_stats_button` and `menu_playthrough_stats_button_star` are hidden by the pause-menu override (section 5). The options window keeps its checkbox `career_cloud_active`; its label is re-texted (section 5).

**Why hide.** The profile is a Steam record that aggregates a player's campaigns across every game and platform, compares friends, and unlocks pictures with career points. A modded game feeds none of it. Its awards read as real-world feats.

**The end of a game.** The engine opens `playthrough_overview_window` itself in "game end view" mode (a comment on the window's `event_trap` icon says so); probe H2 confirms it in the Linux run (acceptance 9). The window is therefore reskinned and re-texted as a safeguard. It becomes the **Annals of the Reign**:

- Its background is `GFX_playthrough_stats_bg` (1170 × 782) and its header strip `GFX_playthrough_stats_bg_default` (1160 × 256). The two career backgrounds `career_profile_bg.dds` (1170 × 790) and `career_profile_bg_default.dds` (1160 × 80) are replaced as well, so a stray view shows no vanilla picture. All four are `R` replacements cut from the ledger parchment cell of the `chrome_panels` family by the `cover` fit; no new generation.
- `country_metadata/00_country_metadata.txt` keeps only `default`, naming `GFX_playthrough_stats_bg_default` and `GFX_career_profile_bg_default`. The five vanilla tags are gone with the vanilla tags. Eight great-power backgrounds are possible later and not planned (open question 2).
- The awards tab button and its star (`awards_tab_button`, `awards_tab_button_star`) are hidden by an override of `interface/career_profile/playthrough_overview_window.gui` (148 lines). With the tab hidden, the awards view, the medal and ribbon pickers and the profile picture view cannot be reached.
- The statistics page text is re-voiced. The 39 labels of the form `CAREER_PROFILE_*_LABEL` and six page keys (title, general, warfare, detailed, all countries, subscribe) count modern things (tanks built, railway guns, bombed trains, planes sent as volunteers, vehicles received by lease). Each gets an Erdae label through the glossary; a counter whose object does not exist in ZIN keeps a true label and shows zero. The groups and their direction:

| Group | Labels (count) | Direction |
| --- | ---: | --- |
| Time and play | 3 | Reigns, hours, longest battle |
| Battles and losses | 5 | Largest battle (by levies), most heavy foot and great kin in one battle, casualties of the worst war and of the enemy, riders of note shot down |
| Hosts and fleets | 7 | Largest host, largest fleet, largest flight of wings, pride of the fleet sunk, merchant fleets sunk, ships designed and built |
| Craft and gear | 9 | Workshops built, heavy foot and great engines raised or designed, gear captured, gear converted, wagon trains broken, loans of arms given and received |
| Rule and diplomacy | 10 | Usurpations, realms freed, courts hosted in exile, vassals made, craft charters borrowed, civil wars fought and their casualties, wings sent as volunteers, share of the world held |
| Intrigue | 3 | Schemes done, agents recruited and taken |
| Commanders | 2 | Traits earned by captains-general and by admirals |

The windows' own frames come from the shared chrome of [02_full_ui_reskin.md](02_full_ui_reskin.md); only the four backgrounds are specific.

**Inert data.** The files below are overridden by same-name ZIN files so that no vanilla ribbon, medal or picture is defined:

| File | ZIN content |
| --- | --- |
| `common/ribbons/00_ribbons.txt` | One ribbon `zin_unwritten_ribbon`: the vanilla structure (name, description and quote keys, `frames`, `colors`, a `debug` stat from the vanilla list), `happened = { always = no }`. Uses the existing ribbon layer sprites |
| `common/medals/00_medals.txt` | One medal `zin_unwritten_medal` with `bronze`, `silver` and `gold` blocks of `always = no` |
| `common/profile_pictures/00_profile_picture.txt` | One entry `1`, icon `GFX_zin_profile_picture_default` (the ZIN emblem texture), no tag |
| `common/profile_backgrounds/00_profile_background.txt` | One entry `1`, icon `GFX_zin_profile_background_default` (the first menu background, cut down) |
| `country_metadata/00_country_metadata.txt` | `default` only |

The two sprites live in `interface/zin_honours.gfx` and point at textures ZIN already ships, so the files cost no art. The vanilla career textures (231) are classed `U` (unreachable) except the four above. Text keys of the hidden windows (`career_profile_achievements`, `career_profile_more_customization`, the awards and picker labels: 490 keys) are not written; the scan lists the career windows in `ui_text/hidden_windows.json` so their keys leave the reach set.

### 4. Achievements

Steam achievements are tied to the base game's story, and ZIN defines none that can fire: `common/achievements.txt` is already a ZIN file with one entry that never fires. The pause menu's `achievements_button` (position 299, 389, tooltip `MENU_ACHIEVEMENTS`) is hidden by the pause-menu override; the main menu's button is [03](03_main_menu_and_frontend.md). The 882 achievement textures and 160 keys are `U`. If the owner wants mod achievements, they go in `common/achievements/` (wiki, *Achievement modding*) and are shown in the awards tab; that needs the tab shown again and is not planned (open question 1).

### 5. The pause menu and the wiki

`interface/ingamemenu.gui` (602 lines, 65 named elements) is re-authored from a ZIN template that keeps every name and defines the four windows `ingamemenu`, `ingamemenu_load`, `ingamemenu_save` and `savegame_item`.

| Element | Vanilla | ZIN |
| --- | --- | --- |
| `menu_load_button`, `menu_save_button`, `menu_gamesettings_button` | y 18, 58, 98 | Same, gilded-iron buttons (shared chrome) |
| `menu_playthrough_stats_button`, `menu_playthrough_stats_button_star` | y 138 | **Hidden** |
| `menu_wiki_button` (`web_link = ""`, text `MENU_BAR_GAME_WIKI`) | y 178 | **Hidden** |
| `menu_resign_button`, `menu_quit_button` | y 218, 258 | y 138, 178 |
| `menu_close_button` (Escape) | y 340 | y 258 |
| `achievements_button` | 299, 389 | **Hidden** |
| `first_row`: `homepage_button`, `forum_button`, `discord_button`, `privacy_policy_button` | 4 icons at x 0, 36, 72, 108 | `homepage_button` and `privacy_policy_button` visible at x 0 and 36 (row at about x 124, y 300); `forum_button` and `discord_button` hidden |
| `second_row`: `bluesky_button`, `twitter_button`, `facebook_button`, `instagram_button`, `youtube_button` | five icons | all **hidden** |
| Window | 320 × 475 | 320 × 360 (target; the render pass sets the final height) |

The seven hidden links are the base game's community and marketing channels. The two kept are the homepage and the privacy policy (a legal link). The homepage button becomes a link to ZIN's public repository: `homepage_button` gains a `web_link` to `github.com/klimPaskov/zin`, the address the credits already print ([03](03_main_menu_and_frontend.md) section 6); if the Linux run shows the button misbehave, it is hidden too. The tooltip keys `MENU_HOMEPAGE` and the rest are re-voiced by the sweep so none names the base game ([05_text_sweep.md](05_text_sweep.md), allowance `al_pause_links`).

**The wiki.** Three buttons open the base game's wiki through the engine: `menu_wiki_button`; and the buttons named `wiki_button` (sprite `GFX_trait_wiki`, tooltip `TRAIT_OPEN_WIKI`) in `armytraittreewindow.gui` (line 470) and `navytraittreewindow.gui` (line 473). Two further surfaces mention it: the options checkbox `home_wiki_active` (text `HOME_WIKI`) in `settings.gui`, and the `wiki_link_*` buttons of `tutorialscreen.gui`, which cannot be reached because the tutorial is hidden. The decisions:

- The three buttons are hidden by overrides (`ingamemenu.gui`, `armytraittreewindow.gui`, `navytraittreewindow.gui`), each re-authored with every element name kept.
- `settings.gui` (2,927 lines, 269 elements) is not overridden. The two options whose features are hidden are re-texted instead: `HOME_WIKI` and `SAVE_CAREER_TO_CLOUD` read as true statements of what the checkbox still does (prefer offline pages for links; keep the annals in the cloud). They are engine-generic exceptions with this reason in `reskin.json`.
- The wiki mirror folder (`wiki/`, 2,295 files) is the game's, not ZIN's; nothing in ZIN links to it.
- The Chronicle of Erdae ([04_chronicle_codex.md](04_chronicle_codex.md)) is the encyclopedia and opens from the Erdae bar's age button and the Realm panel. A third entry in the pause menu is an optional probe (H1): `interface/zin_pause.gui` would define a container `zin_pause_chronicle_window` with one button, attached by the scripted GUI `zin_pause_chronicle` with `parent_window_window = "ingamemenu"`, a form the installed scripted-GUI documentation marks "may not work". Its click effect is the Chronicle's `zin_chr_open`. If the probe fails the pause menu has no Chronicle button and nothing else changes.

### 6. Weekday names

The engine reads the seven keys `Monday` to `Sunday` in `core_l_english.yml` for date text and follows the real calendar from the start date. Whether any window prints a weekday is confirmed in the Linux run (probe H3: the clock tooltip and a saved game entry); the rename is safe either way. The names (proposed; no god, no sun):

| Key | Name | Note |
| --- | --- | --- |
| Monday | Lampday | The lamps are trimmed and the week begins |
| Tuesday | Ploughday | The field day |
| Wednesday | Marketday | Market in every town |
| Thursday | Forgeday | Smiths and wrights |
| Friday | Tideday | Harbour day |
| Saturday | Feastday | Feasts and moots |
| Sunday | Restday | Rest |

The week keeps seven days and the real order (the engine's), so these are labels, not a new calendar. They sit in the glossary as `weekday_mon` to `weekday_sun`.

### 7. Ranks and commander titles

The titles belong to [08_institutions.md](../03_gameplay/08_institutions.md) section 2.1 (a Draft written the same day); this spec owns the keys, the badges and the text. Rank shows in two ways in 1.19.3: as text (the engine reads `rank1` to `rank4` and `naval_rank1` to `naval_rank4`, with eight empty `_desc` keys, and nests the rank in `LEADER_RANK_WITH_PROGRESS` and `LEADER_PROMOTE`) and as two badge strips: `GFX_leader_rank_strip` (`gfx/interface/unitcontrol/leader_rank_strip.dds`, 380 × 51, 4 frames) and `GFX_naval_leader_rank_strip` (`gfx/interface/naval_leader_rank_strip.dds`, 480 × 50, 5 frames). The engine binds the sprites by name; no `.gui` file in `interface/` mentions them. Both strips are `R` replacements (bronze studs and chevrons, no stars, as the institutions spec says), nine frames in all.

| Key | Land (08) | Key | Sea (08) |
| --- | --- | --- | --- |
| `rank1` | Banneret | `naval_rank1` | Sea-Captain |
| `rank2` | Warden of Hosts | `naval_rank2` | Sea-Warden |
| `rank3` | Captain-General | `naval_rank3` | Admiral |
| `rank4` | Marshal of the Crown | `naval_rank4` | Lord Admiral |

The role names are Host-Captain (corps commander), Marshal (field marshal) and Sea-Lord (admiral). **Division titles.** The engine titles a host's commander by the host's experience: `DIVISION_EXPERIENCE_TITLE_DEFAULT` and `DIVISION_EXPERIENCE_TITLE_ARMY_EXPERIENCE_0` to `_4`, thresholds 0, 100, 200, 400, 800, with variants prefixed by a country tag. After stage 1 only ZIN and dynamic tags exist, so the 122 tag-prefixed vanilla keys are unreachable. ZIN writes the six default keys, reading Captain, Captain of a Hundred (twice), Banneret (twice) and Warden of Hosts. A probe (H4) checks whether the engine also reads a ZIN tag prefix; if it does, a great power may carry its own ladder later (08, open question 6). Command power is **Orders**; the pools are **Army Valour**, **Fleet Valour** and **Sky Valour** (08 section 3). Glossary entries hold all of it, so a change in 08 is one line.

### 8. The officer-corps view becomes the Council of Captains

`interface/countryofficercorpview.gui` (2,617 lines, window `countryofficercorpview`) opens from the top bar button `officer_corp_button` (sprite `GFX_staff_office_button`, shortcut Shift+E). The idea categories it shows are fixed by the define `NDefines.OFFICER_CORP_ADVISOR_ENTRIES_IN_MENU` (`high_command`, `theorist`, `army_chief`, `air_chief`, `navy_chief`) with three high-command slots. It holds more than honours:

- the **doctrine buttons**: containers named `land_doctrine_button`, `naval_doctrine_button`, `air_doctrine_button` and `special_forces_doctrine_button`. The file's own comment says a container `X_doctrine_button` is linked to doctrine folder X automatically. This is the way into the doctrine trees (`countrydoctrinetreeview.gui` is opened from here);
- the army chief, navy chief, air chief, high command and theorist slots, the preferred tactics, the army HQ templates toggle and the captured-generals list;
- the spirit grids (`army_spirits_view`, `navy_spirits_view`, `air_spirits_view`) with 97 vanilla spirits.

**Decision.** No other `.gui` file in 1.19.3 names a doctrine button (checked), so hiding the view would remove the doctrine trees from play. The view is kept, **reskinned** by the shared chrome and the `military` family, and **re-texted**: its window title (`OFFICER_CORPS_LABEL`) and tab (`OFFICER_CORP_TAB`) read **Council of Captains**, and the three command headers (`OFFICER_CORP_ARMY_DOCTRINE`, `_NAVY_`, `_AIR_`) read The Host, The Fleet and The Winged, all from [08_institutions.md](../03_gameplay/08_institutions.md) section 2 (the special-forces header is hidden with its folder). [02_full_ui_reskin.md](02_full_ui_reskin.md) section 8 still names the staff office War Council; the integrator picks one name. The chief and theorist slots read Master of the Host, Lord of the Fleet, Master of the Eyries, Marshal of the Council and Master of Lore. What fills the slots (chiefs, theorists, the nine customs) is the institutions spec's job; until it ships, the slots are empty and the view still works. The 97 vanilla spirits and 155 spirit sprites are `U`; the institutions spec writes the replacement customs. The window belongs to the expansion Gotterdammerung in the installed game's own naming; its file sits in the base `interface/` folder and ZIN files carry no DLC test (08, open question 4). Probe H5 records whether the top-bar button shows without the expansion. The top-bar button keeps its name and shortcut; its emblem (map-table pins) is in [02_full_ui_reskin.md](02_full_ui_reskin.md) section 4.3.

**The Army HQ.** `ARMY_HQ_TEMPLATE_NAME` and the HQ text read **War Camp**; the `hq_ribbon` band that the file hides when the Thunder at Our Gates expansion is inactive stays hidden. Nothing here changes the HQ units; they are 08's.

### 9. The Honours of the Field (unit medals)

**What it is.** The divisional command system lets a player grant a **citation** to the commander of a host or a ship after a notable action. A citation costs Authority (the engine's political power), adds officer experience, and gives the unit or ship a modifier; several citations of one kind have diminishing returns. The window texts are `UNIT_MEDALS`, `MEDAL_COMBINED_NAME` and about 75 more keys, plus 31 history lines that record what the unit did. The system is reachable in the unit view, the commander roster and the Council of Captains, so it must be Erdae's. ZIN calls a citation an **Honour of the Field**.

**Engine facts** (checked on 19 October 2026): `common/unit_medals/00_default.txt` holds 103 medals; each has `available` (a country-scope trigger), `frame`, `icon` (a sprite name; every vanilla icon has a twin named with `_large`, so ZIN writes both), `cost`, `unit_modifiers`, `officer_xp` and, in 97 of 103, `ship_modifiers`. With only one of the two modifier blocks the medal is awardable to that kind alone. `leader_modifiers` and `one_time_effect` exist. The vanilla `available` triggers call scripted triggers in `unit_medals_scripted_triggers.txt`, which stage 1 removed, so the vanilla file logs errors until this override lands. The defines `COST_INCREASE_PER_ACTIVE_MEDAL` (0.25), `MEDAL_AWARD_CONFIRM_PP_THRESHOLD` (200), `GENERATE_AI_DIV_COMMAND_MEDALS` (0.10, the AI's chance to award), `MAX_NUM_AUTOMEDALS` (6) and the four `NAVAL_COMBAT_MEDAL_*` values stay as shipped (the defines spec owns them). The effect `add_unit_medal_to_latest_entry = { unit_medals = key }` grants a medal from script.

**Structure.** `tools/content/data/honours.json` (new) lists 42 honours in three lines. An honour is available to a country by a people flag (`has_country_flag = zin_people_<key>`), by alignment (`has_government = democratic`, `fascism`, `communism`, `neutrality`), or by a story flag. Cost is 30 for every honour (vanilla's value; design target) and `officer_xp` 100.

| Line | Honours | Available when | Icon sprite (frames) |
| --- | ---: | --- | --- |
| Peoples | 30 (3 for each of the ten peoples) | the country's people flag | `GFX_zin_medal_<people>` (3), one strip per people |
| Alignments | 8 (2 each for Light, Dominion, Shadow, Wild) | the ruling alignment | `GFX_zin_medal_<alignment>` (2) |
| Story | 4 | a story flag | `GFX_zin_medal_story` (4) |

A realm always has at least five honours open (its people's three and its alignment's two), so the AI always has a choice.

**Effect archetypes.** Every pair below is a modifier pair the vanilla file already uses; values stay inside the vanilla ranges. Land first, sea second.

| Archetype | Land modifier (range) | Sea modifier (range) |
| --- | --- | --- |
| Morale | `army_morale_factor` (0.05 to 0.15) | `naval_morale_factor` (0.05 to 0.2) |
| Drill | `army_org_factor` (0.05 to 0.1) | `navy_org_factor` (0.05 to 0.15) |
| Shield | `army_defence_factor` (0.05 to 0.1) | `naval_defense_factor` (0.05 to 0.15) |
| Spear | `army_attack_factor` (0.05 to 0.1) | `naval_damage_factor` (0.05 to 0.1) |
| Breakthrough | `breakthrough_factor` (0.05 to 0.15) | `naval_critical_score_chance_factor` (0.05 to 0.15) |
| Stores | `supply_consumption_factor` (-0.05 to -0.15) | `naval_supply_consumption_factor` (-0.05 to -0.15) |
| Lore | `experience_loss_factor` (-0.1 to -0.25) | `experience_gain_navy_unit_factor` (0.1 to 0.25) |
| Scout | `recon_factor` (0.05 to 0.15) | `naval_detection` (0.05 to 0.15) |
| Spoils | `equipment_capture_factor` (0.1 to 0.15) | `naval_ship_recovery_chance` (0.1 to 0.15) |
| Dig | `max_dig_in_factor` (0.05 to 0.15) | none (land only) |
| Strength | `army_strength_factor` (0.05 to 0.1) | none (land only) |

No fuel modifier is used (fuel does nothing in ZIN, [02_economy.md](../03_gameplay/02_economy.md)). All 20 keys are in `documentation/modifiers_documentation.md` (checked 19 October 2026); the builder validates them again with `assertModifiers`.

**The roster** (ids `zin_honour_<line>_<key>`; names are directions, the sweep writes the text):

| Line | Honours (archetype; motif) |
| --- | --- |
| men | `laurel` (Morale; laurel wreath), `shield` (Shield; round shield), `banner` (Drill; furled banner) |
| elves | `leaf` (Scout; a silver leaf), `cord` (Drill; a braided cord), `bough` (Stores; a bough in flower) |
| sun_elves | `gold_thread` (Morale; a golden thread), `star` (Shield; an eight-pointed star, the neutral selection mark), `memory` (Lore; an open book) |
| orcs | `tusk` (Spear; a tusk), `spoils` (Spoils; a hung helm), `ram` (Breakthrough; a ram's head) |
| trolls | `club` (Strength; land only), `hide` (Shield; a stitched hide), `hammer` (Spear; a maul) |
| giants | `boulder` (Breakthrough; land only), `mountain` (Strength; land only), `root` (Dig; land only) |
| ents | `bark` (Dig; land only), `canopy` (Shield; a crown of leaves), `season` (Stores; the four seasons as a ring) |
| yeti | `snow` (Stores; a snowflake), `howl` (Morale; an open mouth), `track` (Scout; a paw track) |
| demons | `oath` (Spear; a bound hand), `chain` (Breakthrough; a broken chain), `seal` (Morale; a wax seal) |
| the_dead | `bone` (Shield; a bone shield), `march` (Drill; a column), `ash` (Lore; an urn) |
| light | `lamp` (Morale), `ward` (Shield) |
| dominion | `crown` (Spear), `sword` (Breakthrough) |
| shadow | `chain_dark` (Drill), `rend` (Spoils) |
| wild | `moot` (Stores), `trail` (Scout) |
| story | `wall` (Dig and Shield; land only; flag `zin_honour_unlock_wall`), `strait` (Shield and Scout; sea only; `zin_honour_unlock_strait`), `crossing` (Morale and Spear; sea only; `zin_honour_unlock_crossing`), `last_crowns` (Morale, Drill and Lore; both; `zin_honour_unlock_last_crowns`) |

The motifs for the dead and the demons are plain objects; they show no skull, face or sigil of Zol (the chrome rule of [02_full_ui_reskin.md](02_full_ui_reskin.md) section 3.6 applies to every picture). The Light honour `ward` and the neutral star never use the veiled sun.

**Story honours.** The four story flags are set, as a country flag, by the specs that own the moment: the Wall by [elves_wall_and_dragons.md](../04_mechanics/elves_wall_and_dragons.md) when a gate is held in a siege; the strait by [lerendor_narrow_strait.md](../04_mechanics/lerendor_narrow_strait.md); the crossing by [western_crossing.md](../04_mechanics/western_crossing.md); the last crowns by the war's ending events. Each of those specs adds one `set_country_flag` line to the outcome it already writes. Until it does, the honour stays closed and nothing else changes.

**History lines and commander text.** The 31 history lines (conquered province, unit kill, commander promoted, new commander, invasion success, province liberated, core liberated, high-worth seat, capital, eyrie taken, scheme joined, naval combat, ship launched, renamed, refitted, received many casualties and the rest) and the roughly 75 interface strings of the commander and citation windows are written as frames in `ui_text/ranks.json`. The paradrop and raid history lines name systems ZIN does not use; they get text so a stray one reads as Erdae, and the scan marks them unreachable.

**Art.** 42 icons in 15 strips, each frame 28 × 42 (the vanilla strip's frame size; the `_large` file is 56 × 84): ten strips of 3 frames, four of 2, one of 4. Generated as two sheets (a 6 × 6 and a 3 × 3 on flat black) and cut by `tools/content/lib/fit.mjs` `strip`. Output `gfx/interface/medals/zin/<line>_strip.dds` and `<line>_strip_large.dds` (30 files), sprites in `interface/zin_honours.gfx` with `noOfFrames`. The vanilla medal strips (the 14 national and generic sets) become `U`. This covers the "medals" row of the asset manifest.

### 10. Air aces: Riders of Note

The air view's ace system (`acesview`, `common/aces/00_aces.txt`) names an individual pilot of a wing and shows a portrait. Its modifier tags are never shown. Names come from the ace pools in `common/names` (which the names module already writes, with callsigns). The decision: **keep** the system; the glossary calls an ace a **Rider of Note** and a pilot a **Rider** (dragons and griffins fly the air layer, S6; a rider appears only when a realm has wings). The five generic portraits `GFX_ace_none`, `ace_m_0`, `ace_m_1`, `ace_f_0`, `ace_f_1` (42 × 46) are `R` replacements: bust cells of the `military` family. The 85 portraits of named real pilots are `U`: no ZIN name matches a file name, so none is ever chosen.

### 11. Text

| Family (of [05](05_text_sweep.md)) | Keys this spec writes | Module |
| --- | --- | --- |
| ranks | Weekday keys (7), `rank1`–`rank4` and `naval_rank1`–`naval_rank4` with their `_desc` keys (16, titles from 08), division titles (6 reachable of 128), citation and commander labels (about 75), history lines (31), honour names (42) | `text_honours.mjs` |
| achievements | The Annals labels (about 60), the pause menu keys (`MENU_BAR_*`, `MENU_ACHIEVEMENTS`, `TRAIT_OPEN_WIKI`, `HOME_WIKI`, `SAVE_CAREER_TO_CLOUD`) | `text_honours.mjs` |
| platform | Rich presence (10) | `text_sweep.mjs` |

Honour descriptions are generated: the engine prints the modifiers; the honour has a name and, where the vanilla keys have one, a short description of one sentence.

## Implementation

### Files

| Path | Kind | Content | Writer |
| --- | --- | --- | --- |
| `tools/content/data/honours.json` | builder data | The 42 honours: id, line, frame, archetypes with values, land and sea flags, availability, motif | `modules/honours.mjs` (reads) |
| `common/unit_medals/00_default.txt` | override | The 42 honours | `modules/honours.mjs` |
| `common/ribbons/00_ribbons.txt`, `common/medals/00_medals.txt` | override | One inert entry each (section 3) | `modules/honours.mjs` |
| `common/profile_pictures/00_profile_picture.txt`, `common/profile_backgrounds/00_profile_background.txt`, `country_metadata/00_country_metadata.txt` | override | Section 3 | `modules/honours.mjs` |
| `interface/zin_honours.gfx` | new | `GFX_zin_medal_<line>` and `_large` (15 × 2), `GFX_zin_profile_picture_default`, `GFX_zin_profile_background_default` | `modules/honours.mjs` |
| `gfx/interface/medals/zin/*.dds` | art | 30 strips | `modules/honours.mjs` from accepted sheets |
| `interface/ingamemenu.gui`, `interface/armytraittreewindow.gui`, `interface/navytraittreewindow.gui`, `interface/career_profile/playthrough_overview_window.gui` | override (`O`) | Sections 3 and 5; templates `tools/content/templates/ui/<file>.tmpl` | `modules/ui_overrides.mjs` |
| `interface/frontendmainview.gui` | override | The two career rows added to the hidden table of [03](03_main_menu_and_frontend.md) | `modules/ui_overrides.mjs` |
| `interface/zin_pause.gui`, `common/scripted_guis/zin_pause_chronicle.txt` | optional (probe H1) | The pause-menu Chronicle button | `modules/ui_overrides.mjs`, `modules/honours.mjs` |
| `gfx/interface/career_profile/playthrough_stats_bg.dds`, `playthrough_stats_bg_default.dds`, `career_profile_bg.dds`, `career_profile_bg_default.dds` | `R` | Four backgrounds from the ledger parchment cell | `modules/ui_reskin.mjs` |
| `gfx/aces/ace_none.dds`, `ace_m_0.dds`, `ace_m_1.dds`, `ace_f_0.dds`, `ace_f_1.dds` | `R` | Five rider busts | `modules/ui_reskin.mjs` |
| `gfx/interface/unitcontrol/leader_rank_strip.dds` (380 × 51, 4 frames), `gfx/interface/naval_leader_rank_strip.dds` (480 × 50, 5 frames) | `R` | Rank badges | `modules/ui_reskin.mjs` |
| `localisation/replace/zin_honours_l_<language>.yml`, then same-name overrides of `unit_medals`, `ranks`, `subscription` and `core` keys at stage 4 | generated | Section 11 | `modules/text_honours.mjs` |
| `tools/content/data/ui_text/hidden_windows.json` | builder data | The career windows listed as unreachable, with the reason | by hand |
| `tools/content/honours.test.mjs` | test | The checks below | — |

The existing main-menu override, the reskin and the pause-menu art stay with [02_full_ui_reskin.md](02_full_ui_reskin.md); four rows are added to its closed list of overrides in section 2.3 (the four files above), each with the reason of this spec.

### Builder

`modules/honours.mjs` (new) reads `honours.json`, validates modifiers (`assertModifiers`), writes the unit-medal file, the inert files, the metadata and the sprites, and stages the strips. `modules/text_honours.mjs` (new) writes the text through the glossary. `modules/ui_overrides.mjs` (from the reskin spec) builds the four `.gui` files from templates, comparing the installed file's element names with the template's list (a game patch fails the build). Both new modules run after `buildCalendar` and `buildDefines` and before the text scan.

### Identifiers

`zin_honour_<line>_<key>` (42 unit-medal ids), `zin_honour_unlock_wall`, `_strait`, `_crossing`, `_last_crowns` (country flags set by the owning specs), `zin_unwritten_ribbon`, `zin_unwritten_medal`, `GFX_zin_medal_<line>` and `GFX_zin_medal_<line>_large`, `GFX_zin_profile_picture_default`, `GFX_zin_profile_background_default`, `zin_pause_chronicle` (optional). The existing `zin_unwritten_page` stays.

### Engine facts checked (installed game 1.19.3.0, 19 October 2026)

- `interface/ingamemenu.gui`: element names and positions of section 5 (`menu_wiki_button` at y 178 with `web_link = ""`; `achievements_button` at 299, 389).
- `interface/frontendmainview.gui` lines 447 to 465: `career_profile_button` (position 16, 138) and `career_profile_button_star` (sprite `GFX_icon_best_in_career`).
- `interface/armytraittreewindow.gui` line 470 and `navytraittreewindow.gui` line 473: `wiki_button`, `GFX_trait_wiki`, `TRAIT_OPEN_WIKI`. `interface/settings.gui` lines 2690 and 2885: `career_cloud_*` and `home_wiki_*`.
- `interface/career_profile/*`: ten `.gui` files; `playthrough_overview_window.gui` has `event_trap`; sprites in `common_components.gfx` (lines 18, 324, 379, 473); texture sizes 1170 × 782, 1160 × 256, 1170 × 790, 1160 × 80.
- `interface/countryofficercorpview.gui` and `topbar.gui` line 1006: `officer_corp_button`, `GFX_staff_office_button`, shortcut `shift+e`; the `X_doctrine_button` comment at lines 520 and 620; the define `OFFICER_CORP_ADVISOR_ENTRIES_IN_MENU` at line 4245 of `common/defines/00_defines.lua`. No `.gui` file in `interface/` names a doctrine button except this one (checked by search).
- The rank strips: `GFX_leader_rank_strip` in `interface/unitview.gfx` (4 frames, 380 × 51) and `GFX_naval_leader_rank_strip` in `interface/naviesview.gfx` (5 frames, 480 × 50).
- `common/unit_medals/00_default.txt`: 103 entries, 2,468 lines; the modifier pairs and ranges of section 9 were counted from it. `interface/medals.gfx`: strips of 28 × 42 frames (`generic_neutrality_medal_strip.dds` is 112 × 42, four frames; the large file 224 × 84).
- The defines of section 9 in `common/defines/00_defines.lua` lines 815 to 826 and 2143 to 2146; the effect `add_unit_medal_to_latest_entry` in `documentation/effects_documentation.md`.
- Triggers `career_profile_check_value`, `career_profile_check_medal`, `career_profile_check_ribbon` and the rest in `documentation/triggers_documentation.md`; console commands `window open <name>` and `resign` in `console_commands_documentation.md`.
- Key presence: `MENU_BAR_*`, `MENU_HOMEPAGE` and the link keys, `MENU_ACHIEVEMENTS`, `OFFICER_CORPS_LABEL`, `OFFICER_CORP_TAB`, `ARMY_HQ_TEMPLATE_NAME`, `UNIT_MEDALS`, `DIVISION_EXPERIENCE_TITLE_*`, the seven weekday keys, `rank1`–`rank4`, `naval_rank1`–`naval_rank4`.

**Crash and error risks.** An empty `ribbons`, `medals` or `profile_*` file errors; each override keeps one entry. A unit medal naming a missing sprite or a missing scripted trigger logs errors (the vanilla file does the second today). A medal icon needs both sizes. A missing bound element in an overridden `.gui` can break the window. Replacing `common/unit_leader` is never done (it crashes at `map/rocketsites.txt`). `country_metadata` needs `default`.

## AI

The AI awards honours at the engine's chance (`GENERATE_AI_DIV_COMMAND_MEDALS`) from the honours its country can use; every realm has at least five. AI does not read story honours until the flag exists. Nothing else changes.

## Acceptance

1. **Data (build).** `honours.mjs` stages 42 honours; every land modifier and sea modifier is valid (modifier documentation); no honour has a sea block with no land block without the intended reason; every `available` uses a people flag, an alignment or a story flag only; every icon sprite exists in both sizes; the ribbon, medal, picture, background and metadata files each hold exactly their inert entries.
2. **Overrides (build).** The four `.gui` files and the main-menu rows keep every element name of the installed file (check 8 of [02_full_ui_reskin.md](02_full_ui_reskin.md)); each hidden element has the off-screen position, `alwaystransparent` and the empty sprite; a planted dropped element fails.
3. **Words (build).** The text scan ([05](05_text_sweep.md)) finds no banned word in the weekday, rank, title, honour, history, pause-menu or Annals keys; the glossary entries for the ranks and weekdays equal the tables above.
4. **Render (offline).** `hoi4.gui_render` of `ingamemenu` at 1280 × 720 and 1920 × 1080 shows six buttons and two link icons, no wiki, no statistics, no achievements; `countryofficercorpview` and `playthrough_overview_window` (opened with `window open`) render with the shared chrome and no awards tab; long-text states do not overflow.
5. **Linux: pause menu.** Escape opens a menu with Load, Save, Options, Resign, Quit and Close; all work; no wiki or achievement control is visible; the options window shows the re-texted cloud and offline-pages checkboxes.
6. **Linux: trait windows.** The army and navy trait windows show no wiki button.
7. **Linux: honours.** In a test as a men realm, an orc realm and a Light realm, the unit view offers the right three plus two honours (console `list_vars` on the realm flags); granting one costs Authority and applies the modifier; a story honour is absent until its flag is set by console, then present; a ship can receive a two-sided honour and not a land-only one.
8. **Linux: Council of Captains.** Shift+E opens a window titled Council of Captains; each of the four doctrine buttons opens its doctrine tree; the army HQ toggle works.
9. **Linux probes.** H5: the top-bar officer-corps button is present with and without the expansion. H1: the optional pause-menu Chronicle button attaches or is dropped. H2: `window open playthrough_overview_window` shows the Annals frame; a game that reaches its end date or a `resign` shows it with no awards tab. H3: the clock tooltip and a save entry show a weekday, or none does. H4: a ZIN tag prefix on a division title key is read or ignored. `error.log` has no line from these files.
10. **Aces.** An air battle in a test shows a Rider of Note with a ZIN portrait; no named real pilot portrait ever appears.

**Inventory rows closed** (when the above pass): UI-021, UI-022, UI-023, UI-133, UI-144; PS-056, PS-057, PS-111, PS-112, PS-113, PS-114, PS-115, PS-166, PS-178; WE-145, WE-146, WE-147; MA-066, MA-077, MA-114, MA-121, MA-122. Closed jointly with [08_institutions.md](../03_gameplay/08_institutions.md) (it names the ranks and the chairs; this spec writes the keys, badges and view): UI-134, PS-045, WE-141, WE-143, WE-202. Partly: UI-059 (the end-of-game dialog; chrome and score text), UI-060 (the pause menu's layout; the chrome is the reskin's), UI-090 (the officer-corps view; trait icons are the warfare spec's), PS-022, PS-023, PS-025 and WE-144 (the slots, which the institutions spec fills). That is 22 rows closed here, 5 jointly and 7 partly.

## Open questions

All proceed on the proposal.

1. Does the owner want mod achievements (for example one per ending), shown in an awards tab? **Proposal, in use:** no; the tab stays hidden and the one unearnable entry stays.
2. Do the great powers get their own end-of-game background? **Proposal, in use:** no; one Annals background for all (`default`).
3. Are the weekday names (Lampday … Restday) right? **Proposal, in use:** yes; they use no god and no sun.
4. Is a link to ZIN's repository on the pause menu welcome? **Proposal, in use:** yes, on `homepage_button`; hidden if it misbehaves.
5. Should the officer-corps view stay despite the politics inventory's proposal to hide it? **Proposal, in use:** yes, because the doctrine trees open from it.

## Names this spec registers

| Name | Kind | Meaning |
| --- | --- | --- |
| `zin_honour_<line>_<key>` | unit medal ids (pattern; 42) | Honours of the Field. Lines `men`, `elves`, `sun_elves`, `orcs`, `trolls`, `giants`, `ents`, `yeti`, `demons`, `the_dead`, `light`, `dominion`, `shadow`, `wild`, `story` |
| `zin_honour_unlock_wall`, `zin_honour_unlock_strait`, `zin_honour_unlock_crossing`, `zin_honour_unlock_last_crowns` | country flags | Open a story honour; set by the Wall, strait, crossing and war-ending owners |
| `zin_unwritten_ribbon`, `zin_unwritten_medal` | ribbon and medal ids | The inert entries; `zin_unwritten_page` (existing) is the achievement |
| `GFX_zin_medal_<line>`, `GFX_zin_medal_<line>_large` | sprites (pattern) | Honour strips |
| `GFX_zin_profile_picture_default`, `GFX_zin_profile_background_default` | sprites | Inert profile entries |
| `zin_pause_chronicle`, `zin_pause_chronicle_window` | scripted GUI and window (optional) | The pause-menu Chronicle button |
| `tools/content/data/honours.json`, `tools/content/data/ui_text/hidden_windows.json` | builder data | Honour roster; hidden career windows |
| `tools/content/modules/honours.mjs`, `text_honours.mjs`, `tools/content/honours.test.mjs` | module and test | Honour data and text |
| `H1` to `H5` | probe ids | Pause-menu Chronicle, game-end view, weekday display, tag-prefixed titles, the officer-corps button without the expansion |

## Changes this spec asks of other specs

- [03_main_menu_and_frontend.md](03_main_menu_and_frontend.md) section 2.2: add `career_profile_button` and `career_profile_button_star` to the hidden elements.
- [02_full_ui_reskin.md](02_full_ui_reskin.md): add four rows to the closed list of section 2.3 (`ingamemenu.gui`, `armytraittreewindow.gui`, `navytraittreewindow.gui`, `career_profile/playthrough_overview_window.gui`); section 4.11's "six link icons stay as published" becomes "two stay (homepage, privacy policy); seven are hidden"; the officer-corps view is reskinned, not `U`; the career textures are `U` except four.
- [01_warfare.md](../03_gameplay/01_warfare.md) section 15.4 and [06_vanilla_removal_and_zero_errors.md](../00_foundation/06_vanilla_removal_and_zero_errors.md): ribbons, unit medals, profile files and `country_metadata` are written by `modules/honours.mjs` (not the warfare module); `common/medals` is overridden (inert), not "kept and re-themed".
- [08_institutions.md](../03_gameplay/08_institutions.md): its ranks, Orders, Valour pools, War Camp and Council of Captains are glossary entries with that spec as source; it fills the Council's chairs, and the integrator reconciles its Council of Captains with the War Council of [02_full_ui_reskin.md](02_full_ui_reskin.md) section 8.
- The story specs named in section 9 (Wall, strait, crossing, war endings): one `set_country_flag` line each.
- The asset manifest ([05_asset_manifest.md](../08_art_and_assets/05_asset_manifest.md)): the medals row is the 30 strips here; the aces row is five portraits; career-profile art is four backgrounds; the rank badges are two strips of nine frames (WE-141 counted eight).
