# Full asset inventory

**Status:** Ready. Reviewed 19 October 2026 against CONVENTIONS "Status"; integrated 19 October 2026. **Priority:** 5. **Phase:** 7 (waves 1 to 3 of the production plan may start in phase 2; each phase still generates the art its own content needs).

## Purpose

The owner wants ZIN fully custom: nothing a player sees may be vanilla unless it is engine-generic. This spec is the complete list of custom art that goal needs. It gives every asset family, how many assets it has, their shipped sizes, formats, paths and sprites, how each family is laid out for image generation (how many per sheet), which spec needs it, and its priority, phase and production wave. It ends with total generation counts, the Meshy credit budget for 3D, and an ordered production plan.

The art pipeline ([01_art_pipeline.md](01_art_pipeline.md)) says *how* art is made, sliced, recorded and checked. This file says *what* must be made. Where the two give different counts, this file's counts are the targets and the pipeline's section 8 becomes a summary of this file (proposed).

All counts, keys, layouts, waves and budgets in this spec are **proposed**. They are design targets; implementation records final numbers here.

## Current state (19 October 2026, commit ca01fa3)

What exists in the game today, by family. "Done" means shipped from accepted (agent-reviewed) sources; owner approval of the owner-approval groups is still pending ([01_art_pipeline.md](01_art_pipeline.md) §6).

| Family | Done | Remaining | Writer |
| --- | --- | --- | --- |
| Flags (not counted below) | 305 countries × 3 sizes | cosmetic flags (I1) | the politics step, with the flag slices of `modules/art.mjs` and `art/slice-flags.mjs` |
| People emblems, generic portraits, Realm frame, button and rule (not counted below) | 10, 40, 3 | — | `modules/art.mjs`, `modules/ui.mjs` |
| A1 catalog focus and idea icons | the 175 catalog keys (15 sheets): `GFX_focus_zin_<key>`, `_shine`, `GFX_idea_zin_<key>` | the 26 keys the major trees propose | `modules/presentation.mjs` |
| E1 event and news pictures | the 52 catalog keys: 43 event pictures `GFX_zin_evt_<key>`, 28 news pictures `GFX_zin_news_<key>` | the 18 requested keys of section 5.5 counted in E1, and its crops | same |
| F1 loading screens | 24 with thumbnails, the loading chrome (4) and the picker frame | — | same |
| F2 main-menu backgrounds | 3 (decision A5) | — | same |
| F3 frontend set | the ZIN emblem, the bookmark picture `GFX_zin_bookmark_fourth_age` | country selection background and frontend widgets | same |
| K 3D units | the 5 pilots in game, mapped to `zin_<people>_gfx` cultures | counters and sound for them; assets 1–34 | `modules/units3d.mjs` |
| Everything else in section 4 | — | all | the modules of the Implementation section |

## Lore basis

| Fact | Status | Source |
| --- | --- | --- |
| Start on 1 Thaw 4A 1748: the Golden King reigns, Eindil has not appeared, Afrit is unrevealed, Erdae seems at peace | owner-fixed | *The Campaign of 4A 1748*, [PROGRAM.md](../PROGRAM.md) |
| People know only the Deliverer; no text names Afrit before `zin_afrit_revealed` | established; contract rule | *Fourth Age Canon Register*, [00_shared_contract.md](../04_mechanics/00_shared_contract.md) |
| All art is image-generated; code only slices, resizes and converts; 3D through Meshy; nothing copied from other mods or the game | owner rules | CONVENTIONS, art pipeline rules 1–2 |
| The owner's drawings stay private; the Horos drawings are established reference art, not passed to the generator until the owner allows it (decision A6) | owner rule; established | *Horos Visual References* |
| Horos: yellow-green armour, blue eyes, thorn-like helm, large blue sword, green crystal (Glo) at his breast. Golbran: small, purple, humanoid. Sunhot elves: over three metres tall | established | *Horos*, *Golbran*, *Peoples of Erdae* |
| Zol has no body at the start and cannot take one; nothing may name, rank or show his servants | established | *Zol*, *Spirits and Their Ranks* |
| Dragons come from Dragon Mountain and form no country; only elven powers command them (Afrit through corruption) | established | *Peoples of Erdae* |
| Volgan's and Varner's appearance, the arm Eindil loses, Dardan's place, Zol's keeper, the Gala–Sunhot relation, orc mounts, the dwarven homeland | open | *Open Questions*, characters and peoples specs |
| Griffins, the Mirror of First Rain, the Lantern Chain, Aurevan as the public name | proposed | vault notes, specs |

Art never closes an open question. No asset shows Zol in any form, a servant of Zol, a New God's face, Afrit's or Aurevan's face before the reveal (outside the gated portraits), Eindil in any icon, Eindil's lost arm, Volgan's face or his spirit after his body breaks, Dardan's location, or the Gala elves as Sunhot elves. No asset shows a dwarf, mycid, arcanist or angel until the owner places them.

## Design

### 1. What "fully custom" covers

| Covered (custom art required) | Kept (engine-generic or not ZIN's to replace) | Hidden (feature disabled, so no art) |
| --- | --- | --- |
| Main menu, loading screens, bookmark, country selection, top bar, every core window frame, button, tooltip, scrollbar and checkbox; focus, idea, decision, technology, doctrine, equipment, unit and trait icons; unit counters; portraits; event and news pictures; flags; map icons (victory points, buildings, map modes, state modifiers); resource and stat icons; ideology, faction and autonomy symbols; 3D units; the Chronicle's plates | Map water and terrain shaders, fonts (colours change through text markup only), Paradox and Clausewitz logos on the loading screen (publisher marks), multiplayer lobby, options, achievements screen, credits | Tank, plane and ship designers' modern parts, special projects, military-industrial organisations, raids, nuclear and rocket screens, railway guns, balance of power, inner circle and every country-specific vanilla mechanic window. They are removed by `replace_path` in their owning specs; acceptance proves they never open |

The ship designer and the intelligence agency stay only if their owning specs keep them (open question 6). Their art is listed as conditional.

### 2. Shared rules for every family

1. **One generation, many outputs.** A focus key yields its focus icon and its idea icon. An event key marked "both" yields its standard and news pictures. A portrait yields its large and small sprite. Small and derived sizes are never generated separately.
2. **Sheets for small things, singles for scenes.** Icons, symbols, counters and generic portraits go on sheets with an exact grid. Event pictures, loading screens, headers, the main menu, tier A rulers, story figures and Meshy inputs are singles.
3. **Canvas sizes** follow the pipeline: multiples of 16, longest edge at most 3,840, aspect at most 3:1.
4. **Gates.** A gated asset (a story flag in its row) may only be used by content that cannot show before that flag (icon catalog rule 4). The compiler checks it.
5. **Vanilla overrides keep the vanilla path.** Where ZIN reskins a vanilla texture, the mod ships a file at the same path with the same pixel size, frame count and alpha layout. Vanilla files are measured, never used as references.
6. **Retry allowance.** Call counts below are base counts. Plan one extra call in four (pipeline rule).

### 3. Sheet layouts used in this inventory

Layouts L1–L8 come from the pipeline. L9–L17 are new (proposed). Canvas sizes are what the model returns for the requested aspect (decision A1); keyed objects with transparent parts are magenta singles (pipeline §4).

| Id | Canvas | Grid | Cells per call | Cell | Background | Used for |
| --- | --- | --- | ---: | --- | --- | --- |
| L1 | 1536×1024 | 4×4 | 16 | 384×256 | black | flags (existing), cosmetic flags |
| L2 | 1024×1536 | 2×2 | 4 | 512×768 | black | named portraits |
| L3 | 1536×1024 | 4×3 | 12 | 384×341 | black (A2; icons are bronze medallions, A3) | focus and idea icons, decision category pictures |
| L4 | 1536×1024 | 4×4 | 16 | 384×256 | black | sub-unit icons and counters |
| L5 | 1536×1024 | 3×4 | 12 | 512×256 | black | equipment, technology icons, faction emblems |
| L6 | 1254×1254 (1:1) | 6×6 | 36 | 209×209 | black | decision icons, small symbols, sigils, traits, cursors, map icons |
| L7 | 1536×1024 | free | — | — | black | UI theme sheets |
| L8 | single | 1 | 1 | — | — | scenes |
| L9 | 1536×1024 | 4×2 | 8 | 384×512 | black | generic portrait pools (aspect 0.75 matches 156×210) |
| L10 | 1536×1024 | 2×4 | 8 | 768×256 | black | grand doctrine pictures (cropped to 212×83) |
| L11 | 1536×1024 | 1×2 | 2 | 1536×512 | black | panel headers (a central 1536×246 band → 600×96) |
| L12 | single, 8:3 (about 2048×768) | 1 | 1 | — | — | Chronicle plates (→ 432×162, [04_chronicle_codex.md](../07_interface/04_chronicle_codex.md) §8) |
| L13 | single, wide (about 2.6:1) | 1 | 1 | — | — | "both" event pictures and news-only pictures (news crop full width; standard crop a centred 210:176 band) |
| L14 | single, about 6:5 | 1 | 1 | — | — | standard-only event pictures (210×176) |
| L15 | single, 4:3 (returned 1448×1086, A1) | 1 | 1 | — | — | loading screens, main menu backgrounds (upscaled to 1920×1440) |
| L16 | 1536×1024 | 4×6 | 24 | 384×170 | black | top bar toolbar buttons (110×41, two states each) |
| L17 | single, by target | 1 | 1 | — | black, ends darkening (A2) | interface strips and bands, one per job |

Grid outputs that the engine expects as one strip (victory points, building icons, gauges, map mode buttons) are **packed**: sliced cells are placed side by side without changing their pixels. This is the same kind of operation as gauge compositing; both proceed as "slicing" until the owner answers (OPEN_QUESTIONS, interface 7). The 10 people emblems already ship packed this way (`GFX_zin_people_strip`).

### 4. The inventory

Columns: **Subjects** = distinct generated pictures shipped (a strip of 20 frames counts 20). **Calls** = base generation calls. **Pri / Ph** = priority (README scale) and roadmap phase. **Wave** = production wave (section 6).

#### A. Focus, idea and trait icons

| Id | Family | Subjects | Output | Layout | Calls | Needed by | Pri / Ph | Wave |
| --- | --- | ---: | --- | --- | ---: | --- | --- | --- |
| A1 | Catalog focus and idea keys: the 175 keys of the [icon catalog](../05_focus_trees/02_icon_catalog.md), plus 26 keys the major trees propose (Coldor 10: `winter_crown`, `iron_and_furs`, `cold_harbour`, `northern_accord`, `march_forts`, `yeti_pact`, `giant_pact`, `silent_castle`, `far_ice`, `white_host`; Goldoroth 9: `orc_moot`, `black_iron_crown`, `fire_mountain`, `iron_yoke`, `black_sail`, `dark_strait`, `orc_warband`, `troll_kin`, `ogre_pact`; Gunwaith 7: `clan_moot`, `horse_fair`, `lawspeaker`, `ford_council`, `crossing_fleet`, `western_banner_parim`, `stranded_host`) | 201 | Focus 100×88 DDS A8R8G8B8 alpha, `gfx/interface/goals/zin/<key>.dds`, `GFX_focus_zin_<key>` and `_shine`; idea 64×64, `gfx/interface/ideas/zin/<key>.dds`, `GFX_idea_zin_<key>` | L3 | 17 (15 done) | every focus tree, every mechanic spirit | 4 / 4 | 2 |
| A2 | Signature icons (depth): unique icons for the most important focuses. Tier A: up to 20 per tree (13 trees, 260); tier B: 3 per tree (71 trees, 213); shared trees: 4 per tree (11 trees, 44). Selection rule in section 5.1 | 517 | as A1; key `<tree>_<focus key>` | L3 | 44 | [05_focus_trees](../05_focus_trees/) | 4 / 8 | 6 |
| A3 | Idea-only icons: 11 regional economic spirits (`econ_<region>`, [02_economy.md](../03_gameplay/02_economy.md)), 18 laws (economy, trade and conscription laws re-themed: Peacetime Levies … Total Muster, Open Markets … Closed Roads, the conscription ladder), 2 people emblems (`goblins`, `ogres`, [03_peoples.md](../00_foundation/03_peoples.md)) | 31 | idea 64×64; laws override the vanilla law idea pictures by path; emblems `gfx/interface/ideas/zin_people_<key>.dds` | L3 | 3 | economy, peoples, politics | 3 / 3 | 2 |
| A4 | Unit-leader trait icons: the 21 vanilla traits ZIN keeps (warfare spec: `ranger`, `ambusher`, `winter_specialist`, `desert_fox`, `cavalry_leader`, `hill_fighter`, `trait_mountaineer`, `organizer`, `inspirational_leader`, `old_guard`, `career_officer`, `trickster`, `defensive_doctrine`, `offensive_doctrine`, `harsh_leader`, `trait_reckless`, `unyielding_defender`, `naval_invader`, `blue_water_expert`, `green_water_expert`, `bold`) and 4 ZIN traits (`zin_eindil_bearer_of_glo` and the Erdae traits the warfare spec adds) | 25 | 23×33 DDS; vanilla paths under `gfx/interface/traits/` for kept traits, `gfx/interface/traits/zin/` for new | L6 | 1 | [01_warfare.md](../03_gameplay/01_warfare.md), characters | 3 / 3 | 3 |

Country-leader and advisor traits have no icons in HOI4; nothing to make.

#### B. Decisions and small symbols

| Id | Family | Subjects | Output | Layout | Calls | Needed by | Pri / Ph | Wave |
| --- | --- | ---: | --- | --- | ---: | --- | --- | --- |
| B1 | Decision category pictures: the 43 categories the specs name (list in section 5.2) and one fallback `zin_generic` | 44 | 114×101 DDS, `gfx/interface/decisions/zin/cat_<key>.dds`, `GFX_decision_cat_picture_zin_<key>` | L3 (black) | 4 | every mechanic spec | 3 / 3 | 2 |
| B2 | Decision icons: a shared set (court, coin, envoy, ship, sword, scroll, eye, seal, fire, grain, road, wall, rune, grave, storm, crown, banner, chain and so on, two tones each) | 72 | 33×32 DDS, `gfx/interface/decisions/zin/<key>.dds`, `GFX_decision_zin_<key>` | L6 | 2 | mechanics | 3 / 3 | 2 |
| B3 | Small symbols: 4 ideology emblems (Light, Dominion, Shadow, Wild; 66×68, override `gfx/interface/ideologies/<ideology>_group.dds`), 12 focus filter icons (27×27, one per mechanic plus the seven generic filters, override `gfx/interface/focusview/filter/*.dds` by path), 21 ZIN game rule icons (29×30, `gfx/game_rules/zin/<rule>.dds`, the rule list of [03_main_menu_and_frontend.md](../07_interface/03_main_menu_and_frontend.md) §5; the 17 vanilla rule icons are G1 cells), 6 autonomy symbols (35×35, `gfx/interface/autonomy/zin_*.dds`: chartered dominion, honorary crown, eastern client, sworn realm, free dominion, tributary hold; the retired client crown is not drawn, O5) | 43 | as listed | L6 | 2 | ideologies, interface, diplomacy | 3 / 3 | 2 |
| B4 | Faction emblems: Middle Kingdom Concord, Leren Compact, Northern Accord, Noris Treaty, Stabilo Pact, Dark Sea Accord, Southern Dominion, the Western Crossing, the Lost Cause (if it becomes a faction, S3) | 9 | 200×100 and 32×32 DDS, `gfx/interface/factions/zin/<key>.dds`, `GFX_zin_faction_<key>`, `_small` | L5 | 1 | [03_diplomacy_and_factions.md](../03_gameplay/03_diplomacy_and_factions.md) | 3 / 3 | 2 |

#### C. Warfare art

| Id | Family | Subjects | Output | Layout | Calls | Needed by | Pri / Ph | Wave |
| --- | --- | ---: | --- | --- | ---: | --- | --- | --- |
| C1 | Technology icons: all 115 warfare technologies (arms 30, mounts 17, engines 15, lore 16, camp 15, naval 17, eyries 5) and about 40 industry and learning technologies (gap: no spec lists them yet, open question 7) | 155 | 64×64 DDS, `gfx/interface/technologies/zin/<tech>.dds`, `GFX_zin_tech_<key>` and the tree's `GFX_<tech>_medium` | L5 | 13 | warfare §11, economy | 3 / 3 | 3 |
| C2 | Technology folders: 12 folder backgrounds (7 warfare folders, the re-themed `industry_folder` and `electronics_folder`, land, naval and air doctrine folders) and 12 folder tabs (2 frames each) | 24 | backgrounds about 1000×700 as each vanilla `gfx/interface/techtree/*_techtree_bg.dds` (for example 959×715 infantry, 1230×593 naval); tabs as `techtree_<folder>_tab.dds`, 2 frames | L8 (2048×1024 or 1536×1024 by aspect) for backgrounds; L5 for tabs | 13 | warfare, interface | 3 / 3 | 3 |
| C3 | Doctrines: 15 grand doctrine pictures (10 land, 3 naval, 2 air); 36 subdoctrine icons (20 land in warfare §12.3, 16 naval and air proposed: 3 per naval track, 2 per air track) and 108 reward icons (3 per subdoctrine); 10 track milestone icons | 169 | grand 212×83, subdoctrine and reward 64×64, milestone as vanilla `doctrine_milestone_*` sizes; `gfx/interface/doctrines/zin/`, sprites named by the warfare spec | L10, L5, L5 | 15 | warfare §12 | 3 / 3 | 3 |
| C4 | Equipment pictures: 18 producible archetypes × 3 looks (variants `_0`–`_1`, `_2`–`_3`, `_4`–`_5`) = 54; 6 granted archetypes × 1 (deathless bonds, Shachihata, bearer of Glo, Volgan's presence, a great spirit, Zol made flesh; the last two gated on their flags); pack trains, wagon trains, merchant cogs × 2 = 6; 4 hulls × 3 = 12; griffins 3; dragons 1. Conditional on the ship designer: 4 hull blueprints (508×248) and 16 ship module icons | 82 (+20) | 146×54 DDS `GFX_<equipment>_medium`; archetype picture `GFX_archetype_<archetype>_medium` derived from the `_1` look; production line 131×52 derived | L5 | 9 | warfare §3, §7, §8 | 3 / 3 | 3 |
| C5 | Sub-unit icons and counters: 53 land, 4 ship and 2 air sub-units (warfare §4, §7.1, §8). Each is two cells: normal and highlighted (open question 4). Plus 5 new unit category icons (`category_zin_monsters`, `_dead`, `_great_beings`, `_siege`, `_archers`) and the 30-frame on-map unit type strip | 94 | `_medium` 152×42 (2 frames of 76×42) `gfx/interface/counters/divisions_large/zin_<sprite>_icon.dds`; `_medium_white` and `_small` 60×12 (2 frames) in `divisions_small/` and `gfx/texticons/`; template 30×12 in `division_templates_small/`; sprites `GFX_unit_<sprite>_icon_medium`, `_medium_white`, `_small`; type strip overrides `gfx/interface/mapicons/mapicon_unit_type_strip.dds` (360×12) | L4, L6 | 9 | warfare §14.3 | 3 / 3 | 3 |

Great beings (Glo bearer, Volgan himself, a great spirit, Zol made flesh) get sub-unit icons like any company. Their icons show objects: a blue sword with green light, a black crown over heat haze, a ring of light, a cold grey sigil. Volgan's and Zol's are never figures. The icons of `zin_demons_bound`, `zin_zol_manifestation` and `zin_tech_bound_demons` are gated on their flags.

#### D. Portraits

Large portraits are 156×210 DDS (`gfx/leaders/zin/lore/<id>[_<state>].dds`, `GFX_zin_portrait_<id>[_<state>]`). Advisors also get a 65×67 small portrait cropped from the large one (`gfx/leaders/zin/lore/small/<id>.dds`, `_small`). Owner approval as the pipeline requires.

| Id | Family | Subjects | Layout | Calls | Needed by | Pri / Ph | Wave |
| --- | --- | ---: | --- | ---: | --- | --- | --- |
| D1 | Tier A rulers: the Golden King; Aurevan A1 the Deliverer, A2 King Aurevan, A3 Afrit (gate `zin_afrit_revealed`), A4 King of the East (gate `zin_afrit_revealed`); Ferlin III; Volgan (vast armoured silhouette, face hidden); Zol's sigil for the emblem leader `zin_zol_will` (black sun over a grey shore, no figure; O6); First Speaker Lusiel Velakorin; Lorien; Queen Vaestia; Esiurth II; Prince Cereos; Herlic; Warking Gorduth; High Warden Maeric (`zin_mirolon_maeric`, O7) | 16 | L8 (1024×1536) | 16 | [02_characters.md](../02_lore/02_characters.md) | 2 / 2 | 2 |
| D2 | Tier A courts (57): **Aenor** `zin_merovan`, `zin_aenor_halmor`, `zin_eronel`, `zin_aenor_corwen`, `zin_aenor_isra`, `zin_tarec`, `zin_ilsabet`, `zin_aenor_sefan`, and three emblem portraits for the collective leaders `zin_aenor_golden_regency`, `zin_aenor_concord_speaker`, `zin_aenor_captains_regency`; **Worshipdom** `zin_ilvane` (the High Confessor, N10), `zin_corvel`, `zin_kessarion`, `zin_ossar`, `zin_sevrin`, `zin_worshipdom_lozan`, `zin_worshipdom_nolivar`; **Lerendor** `zin_lerendor_maelis`, `zin_lerendor_brannoc`, `zin_lerendor_ostvar`, `zin_lerendor_hesk` (the Lerendor tree's council, O7); **Volgan** the rulers of Demon, Dolon and Nezer, and the tree's three lieutenants `zin_volgan_ember_herald`, `zin_volgan_grave_warden`, `zin_volgan_ghorvak` (the Ember Herald, the Grave-Warden, Ghorvak of the Hundred Clubs; O7); **Zol** `zin_zol_drowned_captain`, `zin_zol_hollow_tide` and the nameless "Deathless Captain" (all three faceless shapes or emblems, no administrator implied); **Magical Forest** Perlan, Aenwe, Herrian; **Gala** Heveneya, Sulestien, Tangsiel; **Coldor** Essen, Alorio, Grindok; **Noris** Alodar, Tumo; **Stabilo** Mylun, Hardfic; **Gunwaith** Ilurda, Datid, Sarudo; **Goldoroth** Bredo, Sungor, Britag, `zin_goldoroth_ulgra`, `zin_goldoroth_snikkit`, `zin_goldoroth_rask`; **Mirolon** Bennar, Hessa, `zin_mirolon_hadric`, `zin_mirolon_selda` | 57 | L2 | 15 | characters, mechanics, major trees | 2 / 2 | 2 |
| D3 | Concord rulers: Selen, Kingson, Kilinti (ent), Hiloron (giant), Hunhun, Konori, Herez, Asgard, Noleksun, Cursed Lands (veiled, face unseen), Bloody Forest; Alleria in two states (ranger; resistance leader, gate `zin_afrit_revealed`) | 13 | L2 | 4 | characters | 2 / 2 | 2 |
| D4 | Other tier B rulers: the 49 rulers of the characters spec's tier B table (Horos excluded) and `zin_yeldenne_warden` | 50 | L2 | 13 | characters, regional trees | 2 / 2 | 2 |
| D5 | Story figures, singles: Horos (established look, drawn from the text only, decision A6); Eindil E1–E7 (every state gated on its flag; E6 and E7 with a cloak over both shoulders); Varner; Golbran (small, purple, humanoid, nothing more) | 10 | L8 | 10 | characters, Eindil's journey, Yeldenne and Glo | 2 / 2 (Eindil 5 / 5) | 2 (Eindil 4) |
| D6 | Tier B courts (depth): one advisor and one general for each of the 71 tier B countries | 142 | L2 | 36 | regional trees | 5 / 8 | 6 |
| D7 | Generic portrait pools (depth), table below. The 40 existing generic portraits stay and count toward the pools | 230 new | L9 | 29 | peoples, warfare | 5 / 8 | 6 |

**Generic pools** (`portraits/zin_portraits.txt`, `gfx/leaders/zin/<pool>_<role>_<sex>_<n>.dds`):

| Pool | Civil leaders (per sex) | Army leaders | Navy leaders | Total |
| --- | ---: | ---: | ---: | ---: |
| Men × 5 cultures (`zin_middle_gfx`, `zin_north_gfx`, `zin_west_gfx`, `zin_east_gfx`, `zin_south_gfx`) | 6 | 4 | 2 | 5 × 18 = 90 |
| Elves, Sunhot elves, orcs, goblins, ogres, demons, giants, grave hosts (Volgan only), ents, yeti, trolls | 6 | 4 | 2 for elves and orcs only | 11 × 16 + 4 = 180 |
| **All pools** | | | | 270 (230 new) |

Peoples without sexes in the vault (ents, trolls, yeti, the dead, demons) fill both engine slots from one pool of 12. Zol has no generic pool: its unit leaders all use the Deathless Captain emblem. No pool may contain a dwarf, mycid, arcanist or angel.

#### E. Event and news pictures

Standard 210×176 and news 397×153, DDS A8R8G8B8, `gfx/event_pictures/zin/zin_evt_<key>.dds` and `zin_news_<key>.dds`, sprites `GFX_zin_evt_<key>` and `GFX_zin_news_<key>`. "Both" keys use L13; standard-only keys use L14.

| Id | Family | Subjects | Calls | Needed by | Pri / Ph | Wave |
| --- | --- | ---: | ---: | --- | --- | --- |
| E1 | Catalog picture keys: the 52 keys of the icon catalog (done) and the 18 requested keys of section 5.5 (among them `temple_parim_interior`, `mirror_courtyard`, `dragon_roosts`, `gods_gathering` (gate `zin_volgan_struck_down_eindil`), `rift_sails` (gate `zin_eastern_invasion`), `passes_burning` (gate `zin_war_of_last_crowns`)), plus the requested crops of existing generations (the `war_king` and `cliff` news crops, the eight `GFX_zin_evt_ending_<key>` standard crops) | 70 (+crops; 28 news crops done) | 70 (52 done) | [06_events](../06_events/), mechanics | 5 / 5 | 4 |
| E2 | Regional sets (depth): for each of 11 regions (Middle Lands, North Lands, Cold Lands, West Lands, Triton's Islands, Dark Lands, Magical Lands, Dead Lands, East Lands, Islands of the South, Lands of the Sun) four keys `reg_<region>_court`, `_town`, `_muster`, `_land`. They replace `generic_*` in the about 700 events that now share five generic pictures. A muster shows banners and tents, never a battle | 44 | 44 | flavour and regional events | 5 / 8 | 6 |
| E3 | Mechanic sets (depth): 64 keys, section 5.3 | 64 | 64 | mechanics specs | 5 / 8 | 6 |

The event specs name at least 547 distinct event ids; with ranges about 700 events exist. E1 alone gives every event a custom picture; E2 and E3 raise variety from 70 to 178 pictures.

#### F. Frontend: loading screens, main menu, bookmark

| Id | Family | Subjects | Output | Layout | Calls | Needed by | Pri / Ph | Wave |
| --- | --- | ---: | --- | --- | ---: | --- | --- | --- |
| F1 | Loading screens: 24 spoiler-free scenes, **done** ([02_loading_screens_and_quotes.md](02_loading_screens_and_quotes.md) §5) | 24 | 1920×1440 `gfx/loadingscreens/load_1.dds` … `load_24.dds`; thumbnails 192×144 in `gfx/interface/zin/loadingscreens/` (A5) with sprites `GFX_load_<n>_small` in ZIN's `interface/small_background.gfx` | L15 | 24 (done) | loading screens spec | 5 / 7 | 1 |
| F2 | Main menu backgrounds `zin_menu_parim`, `zin_menu_strait`, `zin_menu_wall` (A5), **done**, listed in `common/frontend/backgrounds/zin_backgrounds.txt` with `GFX_zin_menu_<key>_small` | 3 | 1920×1440 `gfx/loadingscreens/zin_menu_<key>.dds` and 192×144 thumbnails | L15 | 3 (done) | [03_main_menu_and_frontend.md](../07_interface/03_main_menu_and_frontend.md) | 5 / 7 | 1 |
| F3 | Frontend set: the ZIN emblem in `gfx/interface/logo_game.dds` (448×175, no letters; **done**); the bookmark picture "The Fourth Age" (180×104, sprite `GFX_zin_bookmark_fourth_age` in `interface/zin_frontend.gfx`; **done**); the country selection background (1225×728, `gfx/interface/country_selection_bg.tga`); and two widget sheets: `main_lobby_button` (864×36, 3 frames), `_transparent`, `_white`, `_highlight`, `main_lobby_divider` (312×15), `tiles/tiled_frontend_upper_bar` and `_lower_bar` (484×128), `select_date_bg` (579×512), `bookmark_entry_bg` (464×211), and the loading chrome `Loadingscreen_loadingstatus` (1400×92), `Loadingscreen_loadingtip` (1400×148), the progress pair and the picker frame (**done**) | 17 | as listed, same paths and frames | L8 singles, L17 strips | 13 (7 done) | interface, [01_start_and_calendar.md](../00_foundation/01_start_and_calendar.md) | 5 / 7 | 1 |

The bookmark picture is 180×104, measured from the installed `select_date_1936.dds` (decision A5). Loading-screen quotes and tips are text and belong to the loading screens spec.

#### G. Interface

| Id | Family | Subjects | Output | Layout | Calls | Needed by | Pri / Ph | Wave |
| --- | --- | ---: | --- | --- | ---: | --- | --- | --- |
| G1 | Core reskin of vanilla textures, by path (section 5.4): distinct generated cells | about 230 | same path, size and frames as each vanilla texture | L7, L8, L16, L17 | 54 | [02_full_ui_reskin.md](../07_interface/02_full_ui_reskin.md) | 5 / 7 | 1 |
| G2 | ZIN mechanic interface ([01_interface.md](../07_interface/01_interface.md) §12 and sprites table): 8 theme sheets (`neutral`, `gold`, `hermitage`, `storm`, `stone`, `black`, `sea`, `ice`), each sliced into `GFX_zin_frame_<theme>` (128×128 nine-slice, border 32) and `GFX_zin_gauge_<theme>` (240×16, 21 frames); `GFX_zin_tab` (140×30, 3), `GFX_zin_row` (560×30, 2), `GFX_zin_gauge_signed`, `GFX_zin_gauge_mark` (4×20), `GFX_zin_pips` (72×12, 6), `GFX_zin_bar_frame` (64×32); 10 headers `GFX_zin_header_<panel>` (600×96: court, council, dominion, dominion_broken (gate `zin_volgan_body_destroyed`), watch, horde, accord, mistake, strait, journey); 9 bar sigils (24×24, 3 frames), `GFX_zin_gathering_dark` (28×28, 4), `GFX_zin_stage_plate` (40×40, 3), footholds map mode buttons (20×18, deselected and selected) | about 79 | `gfx/interface/zin/`, `interface/zin_ui.gfx`, `interface/zin_mapmodes.gfx` | L7, L11, L6 | 16 | interface | 5 / 7 | 4 |

The hermitage theme and the council header show only ivory, ash and a veiled sun: they are hub-only, but the rule "no demon imagery" holds anyway. The `black` theme and the mistake header carry no figure.

#### H. Map, resources and stats

| Id | Family | Subjects | Output | Layout | Calls | Needed by | Pri / Ph | Wave |
| --- | --- | ---: | --- | --- | ---: | --- | --- | --- |
| H1 | Map icons: victory point strip (20 frames, override `gfx/interface/onmap_victorypoints_strip.dds`, 580×27); building strip (31 frames of 46×46, override `gfx/interface/buildings/building_icon_strip.dds`; the 17 used buildings of the economy spec get Erdae icons, the unused frames a plain "not built" plate); harbour and eyrie map strips (`mapicons/mapicon_building_navalbase.dds` 301×29, `_large` 374×36, `mapicon_building_airbase.dds` 189×30, `_large` 309×47); 20 state modifier icons (32×32, `gfx/interface/state_modifiers/zin_*.dds`, for example `zin_war_great_wall`, `zin_dark_troll_woods`); vanilla map mode button strips (`mapmode_buttons_deselected_small.dds` and `_selected_small` 360×18, `_big` 136×31); on-map counter frames (`onmap_unit_counter*.dds`, kept in the vanilla green palette per warfare §14.2) | about 98 | as listed | L6, L7 | 4 | economy, warfare, map, world systems | 3 / 3 | 3 |
| H2 | Resources and top bar stats: Iron, Timber, Horses, Stone, Gold, Essence, Grain, Provisions (energy), Stored Essence (fuel); political power, stability, war support, manpower, command power, merchant fleets (convoys), ships, industrial capacity, the Gathering Dark icon | 19 | `resources_strip.dds` (7 × 27×27) and `missing_resources_strip.dds`, resource texticons, `topbar/topbar_convoys.dds`, `pol_power_icon.dds`, `stability_icon.dds`, `war_support_icon.dds`, `manpower_icon.dds`, `command_power_icon.dds`, `topbar/fuel_icon.dds`, `industrial_capacity_icon.dds` (2 frames), `ships_icon.dds`, `world_tension_icon.dds` (29×25), all by vanilla path | L6 | 1 | [02_economy.md](../03_gameplay/02_economy.md), world tension | 3 / 3 | 1 |

#### I. Flags, Chronicle, cursors

| Id | Family | Subjects | Output | Layout | Calls | Needed by | Pri / Ph | Wave |
| --- | --- | ---: | --- | --- | ---: | --- | --- | --- |
| I1 | Cosmetic flags (Aenor breakaways, Free Dominions, the Host of Eindil, the Dominion of the East (gate `zin_afrit_king_of_east`), others named by mechanics) and the mod thumbnail (`thumbnail.png`, 1 single) | 13 | flags 82×52, 41×26, 10×7 TGA 32-bit in `gfx/flags/`, `medium/`, `small/` | L1, L8 | 2 | Aenor, Eindil, Afrit, East | 3 / 3 | 3 |
| I2 | Chronicle of Erdae plates (depth): 125 entry plates, 2 after-flag plates and 11 category plates, as the codex spec lists them; 30 are crops of catalog event generations, 108 are new singles; the theme sheet and the sigil sheet. No plate shows Zol, Dardan's place or Afrit's form | 138 | 432×162 DDS, `gfx/interface/zin/chronicle/plates/<plate>.dds`, `GFX_zin_chr_plate_<plate>` | L12 | 110 | [04_chronicle_codex.md](../07_interface/04_chronicle_codex.md) | 5 / 8 | 6 |
| I3 | Cursors: the 60 cursor names of `gfx/cursors/` as 32×32 cells converted to `.cur`, `.png` and, for the four animated ones, `.ani` ([02_full_ui_reskin.md](../07_interface/02_full_ui_reskin.md) §4.10) | 60 | `gfx/cursors/<name>.<ext>`, same names | L6 | 2 | interface | 5 / 8 | 6 |

#### J. Meshy input images

| Id | Family | Subjects | Layout | Calls | Needed by | Pri / Ph | Wave |
| --- | --- | ---: | --- | ---: | --- | --- | --- |
| J1 | One clean, weapon-free reference per new 3D asset (34, section 4.K), a second one for each of the 6 mounts, and one weapon-only reference per attachment (6). Not shipped; stored at `docs/assets/hoi4_3d_model_jobs/models_3d/<asset id>/refs/`. The minimum set needs 10 of them. Optional buildings add 24 | 46 (+24) | L8, as the pilots' `meshy_input.png` | 46 (+24) | warfare §14 | 3 / 7 (minimum set), 5 / 8 (rest) | 5 (10), 6 (36) |

#### K. 3D models (Meshy)

**State on 19 October 2026.** The five pilots (`zin_men_infantry`, `zin_elves_warden`, `zin_orcs_warrior`, `zin_the_dead_revenant`, `zin_trolls_brute`) are complete model packages: Meshy 7 geometry, rig, all six roles exported and re-imported (`docs/plans/units_pilot/3d_status.md`), and they are wired into the game by `modules/units3d.mjs` (one infantry entity per people culture `zin_<people>_gfx`; peoples without a model borrow the nearest one). Counters and sound are not done. The Meshy balance recorded on 18 October 2026 is **40 credits**. New Meshy work runs through the HOI4 Mod Setup launcher route (pipeline §7).

**Credit model** (from the pilots' receipts): generation 30, rig remesh 5, rig 5, three provider actions × 3 = **49 per rigged humanoid**. A static or Blender-rigged model costs the generation only: **30**. A mounted unit is a rigged rider plus a static mount: **79**. Blender work costs no credits.

| # | Asset id | Serves | Kind | Credits | Pri / Ph | Notes |
| ---: | --- | --- | --- | ---: | --- | --- |
| — | 5 pilots | men foot, elven foot, orcs and goblins (0.75), grave hosts, trolls and ogres | done, in game | 0 | 3 / 7 | counters in wave 3 |
| 1 | `zin_sun_elves_guard` | Sun Guard, Sun Bowmen | humanoid, 1.5× | 49 | 3 / 7 | minimum set |
| 2 | `zin_giants_host` | giant host, hurlers | humanoid, 2.2× | 49 | 3 / 7 | minimum set |
| 3 | `zin_ents_grove` | ent groves | humanoid or Blender, 2.5× | 49 | 3 / 7 | minimum set; Blender if the rig fails |
| 4 | `zin_yeti_band` | yeti bands | humanoid | 49 | 3 / 7 | minimum set |
| 5 | `zin_demons_netherborn` | Netherborn | humanoid | 49 | 3 / 7 | minimum set |
| 6 | `zin_zol_deathless` | deathless, black ship crews | humanoid | 49 | 3 / 7 | minimum set; never reuses the revenant; no face, no rank |
| 7 | `zin_men_cavalry` | cavalry, horse archers (bow attachment) | rider + horse | 79 | 3 / 7 | minimum set; the horse is reused by knights if barding is a texture |
| 8 | `zin_ship_galley` | war galley | static | 30 | 3 / 7 | minimum set |
| 9 | `zin_ship_warship` | warship | static | 30 | 3 / 7 | minimum set |
| 10 | `zin_men_heavy_infantry` | heavy infantry | humanoid | 49 | 5 / 8 | |
| 11 | `zin_men_rangers` | rangers, hill companies | humanoid | 49 | 5 / 8 | Selen's rangers |
| 12 | `zin_men_temple_wardens` | valley wardens | humanoid | 49 | 5 / 8 | white tabard; nothing of the Deliverer's nature |
| 13–16 | `zin_north_gfx_`, `zin_west_gfx_`, `zin_east_gfx_`, `zin_south_gfx_zin_men_infantry` | men's cultures (the pilot is `zin_middle_gfx`) | humanoid | 4 × 49 = 196 | 5 / 8 | |
| 17 | `zin_orcs_goblins` | goblin skirmishers | humanoid | 49 | 5 / 8 | replaces the scaled orc |
| 18 | `zin_ogres_brutes` | ogre brutes | humanoid | 49 | 5 / 8 | replaces the troll stand-in |
| 19 | `zin_demons_bound` | bound demons | humanoid | 49 | 5 / 8 | gate `zin_afrit_revealed`; distinct from the Netherborn |
| 20 | `zin_demons_shachihata` | Shachihata | humanoid, large | 49 | 5 / 8 | |
| 21 | `zin_men_knights` | knights | rider + barded horse | 79 | 5 / 8 | |
| 22 | `zin_men_camel_riders` | camel riders | rider + camel | 79 | 5 / 8 | |
| 23 | `zin_elves_riders` | elven riders | rider + steed | 79 | 5 / 8 | |
| 24 | `zin_dead_grave_riders` | grave riders | rider + dead horse | 79 | 5 / 8 | |
| 25 | `zin_orcs_raiders` | orc raiders | rider + mount | 79 | 5 / 8 | blocked until the owner names orc mounts |
| 26 | `zin_siege_catapult` | catapults | static, Blender action | 30 | 5 / 8 | |
| 27 | `zin_siege_trebuchet` | trebuchets | static, Blender action | 30 | 5 / 8 | |
| 28 | `zin_ship_great_warship` | great warship | static | 30 | 5 / 8 | |
| 29 | `zin_ship_raider` | corsair | static | 30 | 5 / 8 | |
| 30 | `zin_ship_black_ship` | Zol's black ships | static | 30 | 5 / 8 | lights that are not fires; no crew figures |
| 31 | `zin_ship_elven` | ships with elven sails (Gala) | static | 30 | 5 / 8 | |
| 32 | `zin_ship_cog` | merchant cogs (convoys) | static | 30 | 5 / 8 | |
| 33 | `zin_air_griffin_riders` | griffin riders | static, Blender rig | 30 | 5 / 8 | only if the owner adopts griffins |
| 34 | `zin_air_dragon_flight` | dragon flights | static, Blender rig | 30 | 5 / 8 | no rider shown as Eindil |
| A1–A6 | `zin_weapon_spear`, `_sword`, `_shield`, `_axe`, `_bow`, `_club` | attachments | static | 6 × 30 = 180 | 5 / 8 | pending owner approval of weapon references |

Support companies and great beings have no models of their own: a division shows its highest-priority battalion (warfare §14.3).

**Optional building models** (static, 30 each): stone fort, sea fort, fortress network, harbour (3 levels from one model), shipwrights, guild workshops, armouries, eyrie, scorpion tower, beacon tower, depot, victualling yard, admiralty (13); four Erdae city clusters and four houses replacing `westerngfx_house_*` and the city entities (8); the Golden Court and the Kingson gate as landmarks (2); a wagon train (1). Total 24 × 30 = **720**. Vanilla 1930s factories and houses stay on the map until these exist.

**Credit totals:**

| Set | Credits | Status |
| --- | ---: | --- |
| Minimum set (assets 1–9): every people has its own foot model; cavalry; the two main ships | 433 | needs 393 more than the balance |
| Every unit asset (1–34) | 1,637 | |
| Units and weapon attachments | 1,817 | |
| Units, attachments and buildings | 2,537 | |
| Balance on 18 October 2026 | 40 | enough for one static model (30) or nothing rigged |

Proposed use of the 40 remaining credits: hold them until a top-up, then spend them inside the minimum set. Buying credits is the owner's decision (open question 1).

### 5. Lists the families need

#### 5.1 Signature focus selection (A2)

The compiler writes `docs/design/art/signature_focuses.json` from the compiled trees. A focus qualifies, in this order, until the tree's cap is reached (tier A 20, tier B 3, shared 4):

1. The tree's first focus in each branch (branch head).
2. Every focus that sets a contract story flag or opens a mechanic decision category or panel.
3. Every focus whose name the tree spec bolds as a capstone or final focus.
4. The longest-duration remaining focus of each branch.

Its key is `<tree>_<focus key>`. The tree's existing catalog key becomes the fallback. Signature icons follow catalog rules 1–3: safe for every viewer at every date; a focus with a two-faced name gets a two-faced icon, both faces generated.

#### 5.2 Decision categories (B1)

| Owner | Categories |
| --- | --- |
| Aenor and economy | `zin_aenor_cat_court`, `zin_aenor_cat_concord`, `zin_aenor_cat_lost_cause`, `zin_aenor_cat_kings_health`, `zin_aenor_cat_empty_throne`, `zin_aenor_treasury` |
| Afrit, world, diplomacy | `zin_afrit_council` (hub only; public name "The Hermitage Chapter"), the world realm category (holds `zin_afrit_purge_houses`), `zin_world_magic`, `zin_diplomacy` |
| Cold Lands | `zin_cold_accord`, `zin_cold_isengard`, `zin_cold_trade` |
| Dark Lands | `zin_dark_raids`, `zin_dark_horde`, `zin_dark_sway`, `zin_dark_accord`, `zin_dark_free_holds`, `zin_dark_straits` |
| East Lands | `zin_east_roads`, `zin_east_courts`, `zin_east_ledger` |
| Eindil | `zin_eindil_guest`, `zin_eindil_host`, `zin_eindil_palace` (pictures gated on `zin_eindil_awake`) |
| Elves, Lands of the Sun | `zin_elves_kin`, `zin_elves_wanderers`, `zin_elves_roosts`, `zin_sun_counsel`, `zin_sun_mirror`, `zin_sun_council` |
| Lerendor, the West | `zin_leren_strait`, `zin_leren_compact`, `zin_west_council`, `zin_west_crossing` |
| Volgan, Mirolon | `zin_dominion_grave_musters`, `zin_dominion_court`, `zin_dominion_mirolon_watch` |
| Glo, Zol, war, regional | `zin_glo_seekers`, `zin_glo_bearer`, `zin_mistake_presence`, `zin_war`, `zin_regional_buldor_contracts` |

That is 43 named categories plus the fallback. A category a later spec adds takes the next cell; a full sheet adds 12. The council picture is hub-only; the Presence picture is a sigil on black stone.

#### 5.3 Mechanic event picture keys (E3)

| Namespace | Keys and subjects | Gates |
| --- | --- | --- |
| `zin_afrit` (8) | `hermitage_chapter` (a candlelit chapter room, hooded backs only; hub-only), `courier_road` (couriers on a mountain road), `birth_rolls_hall` (clerks among shelves of rolls), `relic_vault` (a sealed vault door with a sun seal), `house_bread_queue` (a queue at a House of the First Light), `temple_procession` (a veiled palanquin in procession, no face), `flight_east` (litters leaving Parim by night), `ashen_temple` (a temple dusted with grey ash) | `hermitage_chapter` hub-only; `flight_east` `zin_afrit_abandoned_aenor`; `ashen_temple` `zin_afrit_revealed` |
| `zin_east` (8) | `caravan_road` (the eastern kings' requested key), `desert_wells` (same), `road_toll_fort`, `bazaar_east`, `counting_house` (Stabilo's ledgers), `camel_host` (Noris's riders on parade), `courts_of_the_east` (an embassy hall), `eastern_throne_kneel` (kings kneeling before an empty eastern throne) | last: `zin_afrit_king_of_east` |
| `zin_dark` (8) | `orc_moot_fire`, `forge_pits`, `burning_steading` (a raid's aftermath, no bodies), `dark_straits_ships`, `troll_forest_edge`, `goblin_warrens`, `accord_hall` (Dondor's council), `dark_gate_pass` | none |
| `zin_dominion` (6) | `nafeher_hall` (an empty throne in heat haze), `grave_fields`, `nether_rift`, `ember_vents`, `oath_banners` (sworn banners seen from afar), `march_north` (a host on a dusty road, no Volgan figure) | `march_north` `zin_volgan_marches` |
| `zin_mistake` (6) | `black_isles_fog`, `furviatlon_far` (the seat on its shore, from far off), `grey_shore` (bones and grey surf, no figure), `mistake_storm`, `deathless_ranks_far`, `black_hull_harbour` | `deathless_ranks_far` `zin_zol_rising` |
| `zin_leren` (6) | `sonargur_chain`, `leren_fleet`, `toll_quay`, `compact_hall`, `ice_harbour`, `strait_storm` | none |
| `zin_west` (6) | `ford_council_tent`, `western_muster`, `western_shipyards`, `horse_fair_west`, `crossing_embark`, `clan_moot_west` | `crossing_embark` `zin_war_of_last_crowns` |
| `zin_cold` (4) | `ice_road_caravan`, `steading_winter`, `isengard_walls`, `yeti_hunt` | none |
| `zin_elves` (4) | `elven_council_glade`, `wanderer_road`, `silver_forest_gate`, `kinship_feast` | none |
| `zin_sun` (2) | `sun_terraces`, `lands_of_light_court` (Sunhot elves, never Gala's court) | none |
| `zin_glo` (2) | `yeldenne_gate` (the castle in snow, no Horos), `seekers_in_snow` | none |
| `zin_world`, `zin_lore` (4) | `great_wall_dusk`, `omen_sky` (strange clouds, no figure), `pilgrims_road`, `chronicle_scribes` | none |

#### 5.4 Core reskin (G1)

The per-texture list is the reskin spec's `tools/content/data/ui/reskin.json` (every `R` row: vanilla path, measured size and frame count, family, sheet, cell, fit), checked against `vanilla_inventory.json`, which the builder measures from the installed game's headers at build time (read only). This section counts the generated cells; the reskin spec counts the output files (about 1,170, because one cell yields many frames and paths).

| Group | Vanilla files (measured 18 October 2026) | Count | Calls |
| --- | --- | ---: | ---: |
| Tiles | every file in `gfx/interface/tiles/` (`tiled_window.dds` 192×192, `tiled_window_1b_border`, `_2b_border`, `_thin_border`, `_transparent` 95×95, `_small`, `_w_close`, `tiled_paper_*`, `tiled_plain_*`, `tiled_progress_bar` 190×27, `tiled_selection`, `tiles_dialog` (tooltips) 96×96, `tiled_mini_dialog*`, `tiled_generic_overlay_bg1` 549×600, `tiled_focus_bg` 998×1031 as a single, and the rest) | 60 | 5 + 1 |
| Buttons | `core.gfx` buttons: `button_type_1` … `_9`, `button_148x34` (+`_light`, `_gray`), `button_123x34` (+`_alt`), `button_211x20`, `button_221x34`, `button_238x38`, `button_261x34`, `button_359x34`, `button_94x31`, `sort_button_202x29_3_frames`, `tiling_sort_button*` | about 22 | 2 |
| Widgets | `checkbox` (4 frames), `checkbox_small` (+`_green`, `_red`, `_red_green`), the close button, scrollbars, sliders, drop-downs, edit boxes, `subview_header_bg_300x101`, `_375x101` | about 20 | 2 |
| Top bar | `topbar/background.dds` and `background_extended.dds` (2346×87, one 3072×1024 single cropped to a 3072×114 band); 11 toolbar buttons (110×41, 2 frames: diplomacy, research, production, construction, trade, decisions, intelligence, deployment, ledger, staff office, international market); army, navy and air overview buttons (76×38, 2 frames); `topbar_date_overlay` (366×93), `date_pause_button` (412×28, 2), `_bg`, `speed_step` (84×10, 3), `topbar_alert_bg` (68×17, 4) | about 22 | 3 |
| Event window | `event_news_bg` (528×595, single), `event_report_top_win` (581×121), `_bottom_win` (581×206), `_bottom_win_2` (581×59), `_tileable_midsection` (580×66), `event_option_entry` (352×48), `event_news_pic_overlay` (399×155), `event_pic_clip`, `event_leader_frame` (172×232), `event_button_minimize` | 10 | 2 |
| The Gathering Dark | `world_tension_icon_big_strip` (10 frames of 49×49), `WT_anim_strip` (33 frames of 78×78; static frames repeated, proposed), `world_tension_bg` (527×534), `world_tension_entry` (449×41) | 4 | 1 |
| Focus view | `focusview/titlebar/focus_unavailable_bg`, `focus_can_start_bg`, `focus_completed_bg` (164×50), `ongoing_focus_goal` and `search_current_focus` (423×115, 3 frames), the 16 link sprites (64×16 or 96×16, 3–6 frames), filter backgrounds | about 24 | 1 |
| Decision view | `decisionview/` plates and frames, `decisions_glow` variants (110×41 and 122×47, 2 frames), `tiles/tiled_decisions_bg_small` | about 20 | 1 |
| Large window backgrounds | about 10 singles: politics, diplomacy, production, construction, trade, logistics, army, navy, peace conference, capitulation views | 10 | 10 |
| Medium backgrounds | about 54: the `diplo_action_*_bg` set (527×315 to 527×612), entry and header backgrounds of the main views | 54 | 14 |
| Tech tree plates | `techtree/technology_available_item_bg`, `_researched_`, `_unavailable_`, `_branch_` (183×84), `_currently_researching_` (182×61), `tech_doctrine_*` (72×72), `technology_info_bg` (508×517), `tech_info_bg` (800×224) | about 14 | 1 |
| Other reskin families | The families of [02_full_ui_reskin.md](../07_interface/02_full_ui_reskin.md) §5 not listed above: alerts and diplomatic requests, map interface, politics and diplomacy emblems, research and production plates, military plates, army badges, air mission emblems, ship silhouettes, frontend chrome (H1's vanilla strips, H2 and I3 are counted in their own rows) | about 170 | 12 |
| **G1 total** | | **about 400** | **54** |

Windows of hidden features (section 1) are not reskinned. A window that becomes visible later moves into this list.

#### 5.5 Requested pictures, portraits, flags and emblems (integration, 19 October 2026)

Every asset another Ready spec asks for, in one table. Each requesting event or tree names a fallback key that exists today until its asset ships (catalog rule 5; [02_icon_catalog.md](../05_focus_trees/02_icon_catalog.md), "Requested keys"); a key becomes a catalog key only through the catalog's "Adding a key". A gated picture is used only by events that cannot fire before the gate, or whose firing effect sets the gate flag first (E5). Subjects are the requesters' (*proposed*).

| Asset | Kind | Gate | Requested by | Counted in |
| --- | --- | --- | --- | --- |
| `temple_parim_interior` | event picture (a white temple nave with sun windows, no figure) | — | Golden King events (`zin_reign.31`, `.80`–`.82`, `.87`), flavour (`zin_lore.303`) | E1 |
| `mirror_courtyard` | event picture (a spring in an old elven courtyard, rain on still water) | — | journey events (`zin_eindil.52`), Lands of the Sun, Gala tree, mechanics final pass | E1 |
| `dragon_roosts` | event picture (dragons circling a smoking peak, seen from elven woods) | — | elves, journey events, Magical Forest tree | E1 |
| `gods_gathering` | event picture (shafts of light over a fallen armoured man; no figures, no faces) | `zin_volgan_struck_down_eindil` (the war events' request; the catalog row still reads `zin_eindil_restored` and follows) | `zin_eindil.98`, `zin_world.45` | E1 |
| `passes_burning` | event picture (watchtowers burning on a pass at dusk) | `zin_war_of_last_crowns` | `zin_lastwar.40` | E1 |
| `rift_sails` | event and news picture (sails on a narrow sea from a wooded shore) | `zin_eastern_invasion` | war events, elves, eastern kings (`zin_east.43`) | E1 |
| `elven_moot` | event picture (seats in a ring under silver trees) | — | elves, Magical Forest tree | E1 |
| `king_fallen_gala` | event picture (a white banner lowered over an empty elven seat) | `zin_lorien_dead` | Lands of the Sun, Gala tree | E1 |
| `desert_envoys` | event picture (envoys with camels and banners before a desert court's gate) | — | shared East Lands, Islands of the South and Lands of the Sun trees | E1 |
| `orc_hall` | event picture (orc chiefs round a fire-pit in a long timber hall; no faces in close view) | — | shared Dark Lands tree (event 1), shared Dead Lands and Magical Lands trees | E1 |
| `cold_steading_moot` | event picture (a clan moot in a timber hall in the snow) | — | shared Cold Lands tree (events 1–4) | E1 |
| `west_freehold_hall` | event picture (a freehold's timber hall with horses in the yard) | — | shared West Lands tree (events 1, 2) | E1 |
| `tritons_pirate_trial` | event picture (a corsair crew in chains on an island quay) | — | shared Triton's Islands tree (events 1, 2) | E1 |
| `mistake_wastes` | event picture (grey waste under a white sky) | — | Zol tree | E1 |
| `abyss_depths` | event picture (a stair into red-lit darkness) | — | Volgan tree (events 7, 9–11) | E1 |
| `desert_court` | event picture (Furvior's tented court) | — | Noris tree | E1 |
| `deep_sand` | event picture (a lone caravan walking into dunes under a white sky) | — | eastern kings (`zin_east.35`) | E1 |
| `yeldenne_silent_hall` | event picture (the castle's empty hall) | `zin_horos_dead` | Yeldenne tree (`hall_falls_silent`, `a_call_for_a_bearer`) | E1 |
| `caravan_road` | event picture (a camel caravan on a desert road between two walled towns) | — | eastern kings (`.10`, `.20`, `.21`, `.32`), Noris and Stabilo trees | E3 (replaces `caravan_dunes`) |
| `desert_wells` | event picture (diggers and camels round a stone well in deep sand) | — | eastern kings (`.15`, `.16`, `.36`) | E3 (replaces `oasis_wells`) |
| `nafeher_hall` | event picture | — | Volgan tree (events 1, 3, 6, 12) | E3 |
| `counting_house` | event picture | — | Stabilo tree, eastern kings | E3 |
| `war_king` news crop | news crop of the existing picture | `zin_eindil_awake` | journey events (`zin_eindil.35`) | E1 crops (no new call) |
| `cliff` news crop | news crop of the existing picture | `zin_eindil_cast_down` | `zin_eindil.112` | E1 crops |
| `GFX_zin_evt_ending_<key>` | standard 210×176 crops of the eight `ending_*` news pictures (`ashen_throne`, `children_of_volgan`, `eastern_king`, `golden_court`, `lost_cause`, `strait_master`, `unfinished`, `western_crown`) | each its ending's flag | endings (`zin_world.111`, `zin_ending.10`–`.70`) | E1 crops |
| `palace_battle` | existing picture; gate widened to `zin_afrit_returned` or `zin_afrit_stand_in_parim` | as stated | war events | catalog cells file (no new art) |
| `zin_east_roads` category picture | decision category (the five roads drawn as threads on a sand-coloured map, no lettering) | — | eastern kings | B1 |
| Eindil E1–E7 | portraits: E1 wanderer, E2 war-king, E3 named at Gala, E4 bearer of Glo, E5 restored, E6 maimed, E7 crowned | each its own flag | journey, journey and war events (which use six of them) | D5 |
| The Warden of Mp'E (`zin_yeldenne_warden`) | portrait | — | Yeldenne and Glo | D4 |
| The Will of Zol (`zin_zol_will`) | emblem portrait from the catalog's `zol_sigil` motif (O6) | — | Zol mechanic and tree | D1 |
| Volgan's lieutenants and Mirolon's ruler (O7) | portraits: `zin_volgan_ember_herald`, `zin_volgan_grave_warden`, `zin_volgan_ghorvak`; `zin_mirolon_maeric` | — | Volgan and Mirolon trees, Volgan mechanic | D2, D1 |
| The Host of Eindil (`zin_host_of_eindil`) | cosmetic flag (until generated, converted from Selen's flag) | — | journey | I1 |
| The Dark Lands panels | headers `GFX_zin_header_horde`, `GFX_zin_header_accord` and two bar sigils | — | interface (Dark Lands mechanic) | G2 |

Open requests of a spec that is not Ready are not listed; they are added here when that spec is integrated.

### 6. Totals

| Group | Subjects | Base calls | Of which depth |
| --- | ---: | ---: | ---: |
| A Icons | 774 | 65 | 517 subjects, 44 calls |
| B Decisions and symbols | 168 | 9 | — |
| C Warfare | 524 (+20 conditional) | 59 | — |
| D Portraits | 518 | 123 | 372 subjects, 65 calls |
| E Events | 178 | 178 | 108 subjects, 108 calls |
| F Frontend | 44 | 40 | — |
| G Interface | about 479 | 70 | — |
| H Map and stats | about 117 | 5 | — |
| I Flags, Chronicle, cursors | 211 | 114 | 198 subjects, 112 calls |
| J Meshy inputs (not shipped) | 46 (+24) | 46 (+24) | 36 inputs, 36 calls |
| **All** | **about 3,000 shipped + 46 inputs** | **709** | **1,195 shipped subjects, 365 calls** |

- **Done:** F1, F2, the F3 emblem, bookmark and loading chrome, 175 of A1's 201 keys and 52 of E1's 70 keys: about 260 subjects in about 100 calls (Current state).
- **Release core** (everything but depth): about 1,800 shipped subjects and the 10 minimum-set Meshy inputs, in 344 calls, about 425 with retries.
- **Full inventory:** about 3,000 shipped subjects in 709 calls, about 885 with retries (plus 24 building inputs).
- **Shipped files:** about 5,000 DDS, TGA and cursor files, because one subject yields several sizes, frames and paths.
- **Already done and not counted:** 305 flags, 10 people emblems, 40 generic portraits, 3 Realm panel pieces (358).
- **3D:** 34 new assets and 6 attachments; 433 credits for the minimum set, 1,817 for all units and attachments, 2,537 with buildings.

### 7. Production plan

Waves run in order. A wave starts only when the builder can slice, record and check its layouts. Each wave ends with the review contact sheets, owner approvals where the pipeline requires them, a build and the art checks.

| Wave | Goal | Families | Calls (base) | Starts when |
| --- | --- | --- | ---: | --- |
| 0 | Tooling | Done: black-ground region finding, outline and strip mattes, magenta key matte with despill, box downscale, the presentation manifest, contact sheets (`preview.mjs`). To do: `lib/fit.mjs` (nine-slice, packing, gauge compositing), `inventory.json`, the reskin spec's `vanilla_inventory.json` and `reskin.json`, the inventory report | 0 | now |
| 1 | First impression: what a player sees in the first ten minutes | F1 loading screens (done), F2 main menu (done), F3 frontend set (part done), G1 core reskin, H2 resources and stats | 95 (34 done) | wave 0 done; the Aenor crash fixed (done 19 October) |
| 2 | The start screen's content | D1–D5 named portraits (Eindil's seven states wait for wave 4), A1 catalog icons, A3 idea-only icons, B1–B4 decisions and symbols | 80 (15 done) | wave 1 accepted; `characters.json` merged |
| 3 | Warfare | C1–C5, A4 traits, H1 map icons, I1 cosmetic flags; wire the five pilot models, their counters and entities | 66 | the warfare data files exist |
| 4 | Story and mechanic panels | E1 event pictures, Eindil's portraits E1–E7 (D5), G2 mechanic interface | 93 | events and panels specified in data |
| 5 | 3D minimum set | J1 inputs for assets 1–9 (10 images), then Meshy assets 1–9 | 10; 433 credits | credits topped up |
| 6 | Depth | A2 signature icons, E2 and E3 event sets, D6 tier B courts, D7 generic pools, I2 Chronicle plates, I3 cursors, the other 36 J1 inputs and Meshy assets 10–34 and attachments; optional buildings | 365 (+24 building inputs); 1,204 credits for units, 1,384 with attachments, 2,104 with buildings | release core accepted |

The waves add up to the 709 base calls of section 6. Wave 2 already holds 15 of A1's sheets and wave 4 52 of E1's pictures (done).

Within a wave, families go in the order listed. Inside a family, sheets go by the tier of their users: tier A first, then tier B, then shared. A key that no built content uses yet is skipped until it is used.

## Implementation

### Data files

| Path | Content | State |
| --- | --- | --- |
| `tools/content/data/art/inventory.json` (new; published to `docs/design/art/inventory.json`) | One entry per asset: `id`, `family` (A1 … K), `subject`, `gate`, `outputs` (path, sprite, size, format, frames), `job`, `cell`, `priority`, `phase`, `wave`, `needed_by` (spec path), `state` (`planned`, `generated`, `accepted`, `shipped`) | new |
| `tools/content/data/ui/reskin.json`, `vanilla_inventory.json` | The per-texture reskin list (section 5.4; reskin spec) | new |
| `docs/design/art/signature_focuses.json` | Section 5.1; written by the focus compiler ([00_format_and_compiler.md](../05_focus_trees/00_format_and_compiler.md)) | new |
| `tools/content/data/art/meshy_budget.json` (new) | Per 3D asset: kind, estimated credits, approved credits, spent credits with task ids | new |
| `$ZIN_ART/jobs/<family>-jobs.json` | Working jobs (pipeline): id, aspect, grid, ground, keys in cell order, prompt subjects | existing for the done families |
| `tools/content/data/presentation-cells.json` | Cell maps of the catalog icon sheets and the catalog event jobs (A1, E1); A2 and E2–E3 keys are added with `"tier": "depth"` | existing |
| `tools/content/data/flags-cells.json` | Cell map of the flag sheets (I1 extends it) | existing |
| `tools/content/data/characters.json` | Characters and portrait states (D1–D6), from the characters spec | new |

### Builder modules (ZIN content builder, `tools/content/`)

| Module | State | Families |
| --- | --- | --- |
| `imagegen.mjs`, `lib/sheets.mjs`, `lib/raster.mjs` | existing | all |
| `lib/fit.mjs` | new: nine-slice, packing, gauge compositing and the shared mattes (pipeline) | all |
| `art/asset-jobs.mjs`, `art/flag-jobs.mjs`, `art/slice-flags.mjs` | existing | D7 pools, I1 |
| `art/unit-ref-jobs.mjs`, `art/stage-unit-jobs.mjs`, `modules/units3d.mjs` | existing | J1, K |
| `modules/art.mjs`, `modules/portraits.mjs` | existing; extended | D |
| `modules/presentation.mjs` | existing; extended | A1, E1–E3, F1–F3 |
| `art/inventory.mjs` (new) | builds and validates `inventory.json`; prints the inventory report | all |
| `modules/icons.mjs` (new) | signature, idea-only and trait icons | A2–A4 |
| `modules/decision_art.mjs` (new) | category pictures, decision icons, symbols, factions | B |
| `modules/war_art.mjs` (new) | techs, folders, doctrines, equipment, sub-unit icons and counters | C |
| `modules/frontend.mjs` (new; frontend spec) | rule icons and frontend text | B3 rule icons |
| `modules/ui_reskin.mjs`, `ui_inventory.mjs`, `ui_overrides.mjs`, `ui_cursors.mjs`, `ui_minimap.mjs` (new; reskin spec) | vanilla-path textures, overrides, cursors, minimap | G1, H1 vanilla strips, H2, I3 |
| `modules/ui_panels.mjs` (new; interface spec) | ZIN panel themes, headers, sigils, map mode buttons | G2 |
| `modules/map_icons.mjs` (new) | state modifier icons and the ZIN-only map strips | H1 |
| `modules/chronicle.mjs` (new; codex spec) | Chronicle plates and theme | I2 |
| `art/*-jobs.mjs` (one per new family, pipeline) | job writers | all new families |

### Game files

| Path | Families | State |
| --- | --- | --- |
| `interface/zin_catalog_focus_icons.gfx`, `zin_catalog_focus_icons_shine.gfx`, `zin_catalog_ideas.gfx` | A1 | done |
| `interface/zin_signature_icons.gfx`, `zin_traits.gfx` | A2–A4 | new |
| `interface/zin_decisions.gfx`, `zin_factions.gfx` | B | new |
| `interface/zin_technologies.gfx`, `zin_equipment.gfx`, `zin_doctrines.gfx`, `zin_units.gfx` | C | new |
| `interface/zin_portraits.gfx` (generic, done), `zin_portraits_lore.gfx`, `portraits/zin_portraits.txt` | D | part done |
| `interface/zin_event_pictures.gfx` | E | done for E1's 52 keys |
| `interface/zin_frontend.gfx`, `interface/small_background.gfx`, `interface/frontendmainviewbg.gfx`, `frontendmainviewbg_basic.gfx`, `common/frontend/backgrounds/zin_backgrounds.txt` (folder replaced in `descriptor.mod`) | F | done |
| `interface/zin_ui.gfx`, `zin_mapmodes.gfx` | G2, H | part done (Realm sprites) |
| `interface/zin_chronicle.gfx` | I2 | new |
| Same-path texture overrides under `gfx/interface/`, `gfx/loadingscreens/`, `gfx/texticons/`, `gfx/cursors/`, `gfx/game_rules/` | F, G1, H, I3 | F done |
| `gfx/entities/zin_units.asset`, `zin_units.gfx`, `gfx/models/units/zin/<asset id>/` | K | done for the 5 pilots |

The reskin keeps vanilla layouts: textures keep their paths and sizes. The `.gui` changes are only the closed list of the reskin spec (§2.3), among them the frontend title text next to the lettering-free logo.

### Builder checks added by this spec

1. `inventory.json` validates; every sprite that generated content references has an entry; every entry's `needed_by` spec exists.
2. Every vanilla-path override has the measured size and frame count of its vanilla file (DDS header compare; the reskin spec's check 3).
3. No ZIN sprite points to a vanilla texture except the "kept" list of section 1.
4. Gated entries are used only behind their gates (compiler rule 4); start-reachable files reference no Eindil portrait and no Afrit A3 or A4 portrait.
5. The inventory report lists per family: planned, generated, accepted, shipped, placeholders, owner approval pending. A release in phase 7 or later fails on any placeholder in a release-core family.
6. Meshy spend per asset is recorded with task ids; the total never exceeds the approved budget in `meshy_budget.json`.

### Variables, events, game rules, defines

None.

## AI

None.

## Acceptance

1. `inventory.json` exists, validates, and its family totals match section 6, or this spec is updated to the new totals in the same commit.
2. Builder checks 1–6 pass on a full build, each with a negative test (an unlisted sprite, a wrong vanilla size, a vanilla texture pointer, a gated portrait at the start, a placeholder in a release build, an overspent budget).
3. Every `R` texture in `reskin.json` is shipped at its vanilla path with identical dimensions and frame count.
4. In the Linux run (G4) at 1600×900: the main menu, three loading screens, the bookmark, the country selection, the top bar, the event window, the focus view, the decision view, the technology view and the doctrine view show no vanilla texture (checklist against `reskin.json`, captures labelled Linux run). Case L7 (no vanilla loading screen in three launches) passes.
5. Release core: zero placeholders in families A1, A3, A4, B, C, D1–D5, E1, F, G, H, I1.
6. The art review finds no forbidden figure (section "Lore basis") in any accepted asset, and no lettering.
7. Every 3D asset in use has its evidence list from the warfare spec; no unit sprite shows the generic entity once its asset is shipped.

## Open questions

Each proceeds on the proposal; the owner may overrule.

1. **Meshy credits.** The minimum 3D set needs 433 credits and the recorded balance is 40. Proceeds on: hold the 40 credits until a top-up, then spend inside the minimum set (owner answer, 19 October 2026: hold). Buying credits is the owner's decision.
2. **Packing and compositing.** Packing sliced cells into frame strips and gauge compositing count as "slices, resizes and converts" (proposed; OPEN_QUESTIONS, interface 7).
3. **Logo.** A lettering-free ZIN emblem with the title drawn as game text is used (proposed; the emblem is in game).
4. **Sub-unit icon second frame.** A second highlighted cell is generated per sub-unit; no brightness shift by code (proposed).
5. **Depth scope.** 517 signature icons and 108 extra event pictures are the depth target (proposed).
6. **Hidden or kept features.** The ship designer and the intelligence agency follow their owning specs; their art stays conditional until those specs keep them (proposed).
7. **Industry and learning technologies.** About 40 icons stay reserved until the economy spec lists those technologies (proposed; cross-spec item).
8. **Idea icon size.** 64 × 64 stays unless the Linux run shows clipping (proposed; in game for 175 icons).
9. **Court conflicts.** Settled by O7: where the characters spec and a Ready tree or mechanic name the same figures differently, the tree or mechanic wins. D2 counts the Lerendor tree's council and the Volgan tree's three lieutenants only.
10. **Griffins and orc mounts.** Griffin assets (C4, C5, K33) wait for the owner to adopt griffins (OPEN_QUESTIONS, warfare 1); the orc raiders' model (K25) waits for orc mounts (warfare 2). Everything else proceeds.
11. **Horos references.** Not used (decision A6) until the owner allows them (OPEN_QUESTIONS, short list 14).
