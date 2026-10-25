# Owner answers of 25 October 2026 (K55, K59, K61): handoff

**Status:** implemented in the builder, not committed (as the brief asks). **Decisions:** K55 (Q-70, Q-85), K59 (Q-66, Q-80, Q-86, Q-87, Q-89, Q-91, Q-92, Q-95) and K61 in [INTEGRATION_DECISIONS.md](../../specs/INTEGRATION_DECISIONS.md). Every value, name and text below that the owner did not give is proposed.

## 1. Kusven is named from the start (K55, Q-70)

- The sealed rule is retired: `docs/lore/references/knowledge_layers.md` (rule 10, C24, C25, `kl_sealed_021` retired, the examples and open question 10), `docs/specs/02_lore/09_voice_and_style.md`, and the bestiary's public notes (`tools/content/data/world/bestiary.json`).
- The checks: `Kusven` left the sealed names of `modules/events_mech.mjs` (only Edvoid and the other superseded labels stay) and the secret terms of `checks/cultures_check.mjs`; `modules/events_mech_war.mjs` now lets a text name him before he comes forth only as the legend of the winter tales, and as he is in text gated on his coming forth (`requires` or a trigger on `zin_kusven_forth` / `zin_kusven_is_forth`). Tests follow (`events_mech.test.mjs`, `events_mech_war.test.mjs`, `events_world.test.mjs`, `cultures.test.mjs`).
- Player text that spoke of him unnamed now names him: the Chronicle's line for checkpoint 23 (`events_crown_chronicle.json`), `zin_mistake.22` (`events_mech_mistake.json`). The legend reaches the start: the Zol player's opening `zin_lore.5` (`events_world_lore_1.json`) and the Dark Lands' `zin_dark.80` at the rising (`events_mech_dark.json`) tell the sailors' and shore folk's winter tale of Kusven, the grave-wind who serves the Old God of Death. His flag, his coming forth and his mechanics are unchanged.
- Not edited (other agents' files): the super events (`data/super_events.json` 23, which already names him through the Leren sailors' tales); the loading tips (a start-visible tip about the winter tale would be the natural next surface; the tip set is fixed at 190 keys).

## 2. Reigns last decades (K55, Q-85)

- The vigour (`zin_ruler_vigour`) counts the years left in a man's life. `zin_realm_age_ruler` subtracts the people rate over `constant:zin_realm.months_per_year` each month, times 1.5 at war (`war_wear` 0.5) and 2 when losing (`losing_wear` 0.5); the frail death chance (`mtth:zin_realm_frail_death`, base 3) is multiplied by the rate, so long-lived peoples linger.
- Constants (`data/realm_life.json`, script constants `zin_realm.*`): `vigour_max` 60, `vigour_frail` 5, `new_ruler_min` 15, `new_ruler_max` 40, `start_vigour_default_min` 10, `start_vigour_default_max` 40, `start_years_left_min` 3, `months_per_year` 12, `heir_worry_vigour` 10, `heir_urgent_vigour` 5. Start vigour from a birth year: the years left to the people's span times the rate.
- Result: a man reigns about a quarter of a century on average (15 to 40 years of vigour, less the frail years); dwarves (0.6) and giants (0.5) about twice as long; elves, ents, the Baelim, the mycids and the demon lords (0.05) for centuries. A crowned heir of known birth takes his vigour from his own age (`zin_realm_heir_life`, `zin_realm_vigour_given`).

## 3. A hunter may kill Afrit outside the palace (K59, Q-66)

- `lib/mech_afrit_script.mjs`: `zin_afrit_lose_realm` keeps where he was last seen (`global.zin_afrit_hide_state`, the capital of the realm he led) and starts the hunt (`global.zin_afrit_hunt`); the Council's month runs `zin_afrit_hunt_month` while he hides. Trigger `zin_afrit_may_hunt`; effects `zin_afrit_hunt_month`, `zin_afrit_hunt_kill`, `zin_afrit_hunt_bribe`. Data `data/mech_afrit.json` `hunt`: monthly 3, hunterBonus 4 (a hunter holds the land), hostBonus 5 (the heir's host hunts), corner 100, bribe 150, boughtDays 365.
- Events (`data/events_mech_afrit.json`): `zin_afrit.78` The False God Cornered (to the hunter: kill him, or take the gold, which the heir's host never can) and `zin_afrit.79` The False God Is Found (world news: a great figure's death). The kill sets `zin_afrit_slain_by_hunter`, `zin_afrit_death_told` and the event target `zin_afrit_slayer`, and calls `zin_afrit_die`.
- Fit with the chain and the endings: checkpoint 25 resolves as diverged (B41.D3, `zin_afrit_dead` without the palace); stage 12 and the coronation open on `zin_afrit_dead`; the palace chain needs him alive and is closed; the generic deaths texts (`zin_lastwar.110` to `.112`, the Chronicle) hold. AI: kill 90 (+100 for the heir's host), bribe 10 (0 on the historical path). Spec: `afrit_hidden_council.md`, "The hunt outside the palace". Tests: `events_mech.test.mjs`, `mech_court.test.mjs` (O2 extended).

## 4. Under HISTORICAL a player's own front opens the war early (K59, Q-80)

- `modules/world_tension.mjs`: in `zin_world_check_last_crowns`, under HISTORICAL the date still starts the war; else `zin_world_player_front_open` (a front's flag is set and the realm that opens that front is a human realm) starts it piecemeal (`zin_war_piecemeal`, `zin_war_opened_by_player`). The openers are data (`data/world_tension.json` `war.playerFronts`, proposed): Lerendor its withdrawal, the West's convener the crossing, the eastern coalition's leader the invasion, Volgan the march and the fall of Mirolon, Zol the rising. The AI's fronts keep the date. Spec: `05_world_tension_and_endings.md`. Test: `alternate_history.test.mjs`.

## 5. A surviving Golden King may die of old age (K59, Q-86)

- `lib/mech_aenor_script.mjs`: `zin_aenor_check_old_age`, in the Aenor pulse for a King with `zin_golden_king_survives`: a monthly chance of 0.25 in 100, 0.1 more for every year since he survived, at most 3 (`data/mech_aenor.json` `oldAge`; about one in two that he dies before a judgement ten years on). His death is the ordinary `zin_aenor.200` The King Is Dead with its own text (`lib/mech_aenor_story.mjs`), which opens the succession, and sets `zin_golden_king_old_age`. Follow-up answer (owner, 25 October 2026): the death does not close the Golden Court Endures for good; like any death of the King it leaves the outcome to the Regency of Gold (`zin_world_golden_court_holds`: the King alive or `zin_aenor_regency_endures`, unchanged). Specs: `aenor_court_and_succession.md`, `05_world_tension_and_endings.md`. Test: `alternate_history.test.mjs`.

## 6. Pre-built heirs and dynamic succession (K59, Q-87)

- Data: `tools/content/data/world/heirs.json` (109 heirs, `zin_heir_<realm key>`, and `customs` for the courts that already named an heir). `modules/characters.mjs` `loadCharacterData` merges them (`prebuilt`); the characters module defines each with a country leader role in the realm's stance; realm life recruits them in the realm histories after the rulers (`heirsToRecruit`, the late-characters rule: recruited in history, entering play by `promote_character`, retired by `retire_character`; no `recruit_character` during play). Every heir is a man, or of no sex for the ents and the Baelim.
- No heir: Yeldenne (retired, K56), Puvulan, the Worshipdom, Zol's Mistake, Gala, the Nether, the God Forest, the Mushroom Forest, Goldoroth (reasons in `heirs.json`).
- The system (`modules/realm_life.mjs`, `data/realm_life.json`): customs `blood`, `elective`, `contested`, `open` (`CUSTOMS`; triggers `zin_realm_inherits`, `zin_realm_elective_custom`, `zin_realm_contested_custom`, `zin_realm_open_custom`); effects `zin_realm_succeed` (rewritten), `zin_realm_seat_heir`, `zin_realm_announce_heir`, `zin_realm_remove_heir`, `zin_realm_pass_over_heir`, `zin_realm_hold_disputed_crown`, `zin_realm_fight_for_heir`, `zin_realm_captain_takes_crown`, `zin_realm_check_heir`; mtth `zin_realm_succession_dispute`, `zin_realm_election_dispute`, `zin_realm_heir_death`; idea `zin_realm_disputed_crown`; constant `disputed_days` 365; events `zin_realm.16` A Disputed Succession (crown the heir, pass him over, the sword, the captain) and `zin_realm.17` The Heir Is Dead; new text variants in `zin_realm.10` (way 6, passed over) and `zin_realm.12` (an election that cannot agree). Crises, regencies, civil wars and usurpations reuse G2 to G4. The decision Name an Heir's AI reads the years left and a lost heir.
- AI: see the spec's section 2.13 (`docs/specs/04_mechanics/realm_life.md`). Under HISTORICAL the dispute chance is a quarter and the sword and the captain are never taken; tier A never falls into crisis there (`zin_realm_crisis_allowed`, unchanged).
- Tests: `realm_life.test.mjs` (Q-87), `roster.test.mjs` (1,142 characters), `assets.test.mjs` (the pending heirs may be unplanned in the portrait plan).

## 7. More raiders (K59, Q-89)

- `data/realm_life.json` `raiders`: 25 realms, adding Nondondor and the Windy Lands (corsair_lords), Konori and Hunhun (steppe_rider), and Noris and Delbiz (follow-up answer, owner, 25 October 2026: they raid like the steppe riders); `styles.corsair` (Belonton, Halenor, Santon, Benan, Nondondor, the Windy Lands) and `styles.steppe` (Konori, Hunhun, Noris, Delbiz). Triggers `zin_realm_is_corsair`, `zin_realm_is_steppe_rider`.
- Behaviour (`zin_realm_check_raid`, `zin_realm_raid`): corsairs raid a coastal neighbour or a coastal realm of their own land, and gain `navy_experience` (`raid_sea_xp` 5); steppe riders raid a land neighbour only, 1.5 times as often (`mtth:zin_realm_raid_chance`), and gain `army_experience` (`raid_steppe_xp` 5); a chartered dominion (the riders are Aenor's) never raids the crown or a fellow dominion. `zin_realm.70` and `.71` have corsair and steppe texts. Noris is a great power, so like any raider it never raids a great power before the War of the Last Crowns.

## 8. More ruler tempers (K59, Q-91)

- `data/start_variety.json` `tempers`: twenty, drawn by weight (`V4.weightDefault` 10): the common bold, cautious, pious, grasping, scholarly, vengeful, generous, weary, just (Even-Handed), suspicious, ambitious, idle; the uncommon (4) cruel, silver_tongued, builder, stern; the rare (2) melancholy, fortunate (Fortune's Favourite); the rarest (1) touched, beloved (Beloved of the People). Each has its own modifiers and text (no pronouns, since eight rulers are women) and the realm-life mtth reads them (frail death, ambition, raids, matches, the succession and election disputes, the heir's death).
- Icons: ZIN's country leader traits carry none; twenty frames of a ZIN leader-trait strip are registered in `docs/plans/zin-art/pending_from_integration.md` (never the vanilla strip).

## 9. Start variety reaches players (K59, Q-92)

- `modules/start_variety.mjs`: under FULL the V4 tempers and the tempers of new rulers reach player realms (`OR = { is_ai = yes has_global_flag = zin_start_variety_full }`), and the feuds (FULL only), the disputed lands (V8) and the bonds (V9) no longer ask `is_ai`. LIGHT stays AI only.

## 10. The Worshipdom and Coldor lean to history under PLAUSIBLE (K59, Q-95)

- `data/story_ai.json`: `plausibleIsFree` removed, so both get `zin_worshipdom_plausible` and `zin_coldor_plausible` plans (historical focuses x3, then x1.5 after the drift), enabled by `zin_rules_ai_default_afrit` / `_cold` off the historical and free paths.
- `modules/rules.mjs`: a wrapper `zin_rules_ai_plausible_<power>` for every per-power rule (DEFAULT and the path rule PLAUSIBLE). Their events keep reading the free branch for the situational weights, but lean: the six historical options of the Afrit chain weigh x3 under `zin_rules_ai_plausible_afrit` (`data/events_mech_afrit.json`), and Coldor's march war on Isengard comes three times more slowly under `zin_rules_ai_plausible_cold` (`modules/mech_cold.mjs`, `zin_cold.31`). Spec: `06_historical_path_and_ai.md`. Test: `story_ai.test.mjs`.

## 11. Most things remain unheard (K61)

- `modules/news_reach.mjs` (new, run by `build.mjs` before the late characters) and `data/news_reach.json`: every major news event the build stages must be classified as world, owned (its mechanic writes its own `show_major`) or regional; an unclassified one stops the build. Regional news gets `show_major` with the lands where it happens and the realms it involves. Reusable triggers (`common/scripted_triggers/zin_news_reach.txt`, documented in `docs/zin_dynamic_effects.md`): `zin_hears_in_<land>` for the thirteen lands (a realm of the land or one bordering it) and `zin_realm_hears_of` (ROOT, its neighbours, its land, its enemies, its league, its overlord and sworn realms; ROOT is the original recipient in `show_major`). Test: `news_reach.test.mjs`.
- The man in the ice: his waking events already go to the ice host only (`zin_eindil.10` and the journey events); no waking event is world news.
- World news kept (37): the deaths and crownings of the great kings and gods (`zin_aenor.200`, `.401`, `.470`; `zin_afrit.21`, `.23`, `.43` the reveal, `.52`, `.62`, `.75`, `.77`, `.79`; `zin_dominion.17`; `zin_mistake.23`), the great war and its fronts and the falls of great capitals (`zin_dominion.11`, `.12`, `.29`; `zin_east.43`, `.44`; `zin_lastwar.90`; `zin_leren.32`; `zin_mistake.11`, `.20`, `.24`, `.25`; `zin_sun.40`; `zin_world.20`), the meter (`zin_world.10` to `.12`) and the endings (`zin_world.100` to `.107`). Owned by their mechanics (10): `zin_cold.32`, `zin_dark.15`, `.45`, `.52`, `.60`, `zin_east.24`, `.25`, `.27`, `.80`, `zin_sun.30`. The only every-country firings without a limit are the start-up lore dispatcher (`zin_lore.100`) and the Fourth Age proclamation at the crowning (`zin_aenor.517`), both world moments.

Changed audiences (old: every country, as major news):

| Event | New audience |
| --- | --- |
| `zin_aenor.210` to `.213` (the seals of Parim, the camps rise) | the Middle Lands and their borderers, and every Concord dominion |
| `zin_aenor.214` (the free dominions) | the same, and the free dominions |
| `zin_afrit.17` (treason in the Golden Court) | the Middle Lands and their borderers, the Concord dominions, the Worshipdom |
| `zin_dark.61` (the Dark Lands are one) | the Dark Lands and their borderers |
| `zin_dark.62` (Cocanoor kneels) | the Dark Lands and the Ember Lands and their borderers |
| `zin_eindil.35` (the war-king lays down his crown) | the West Lands and their borderers |
| `zin_eindil.90` (on dragon's wings) | the Middle and North Lands and their borderers, and the heir's league (regard 25 or more) |
| `zin_eindil.99`, `.112`, `.140` (the heir does not rise, the word of the cliff, the heir is lost) | the Middle Lands and their borderers, and the heir's league |
| `zin_eindil.170` (the Mirror without its king) | the Lands of the Sun and their borderers, and the heir's league |
| `zin_leren.33` (the old alliance holds) | the North and Middle Lands and their borderers |
| `zin_mistake.30` (a second stirring) | the North Lands, the Cold Lands, Zol's Mistake and their borderers |
| `zin_reign.72` (the Golden King rides out) | the Middle Lands and their borderers, and the Concord dominions |
| `zin_world.50` (a dragon bound) | the Magical and East Lands and their borderers |

The super events (K60, K61) are the super-event agent's; their 23 replaced news events keep the audiences above.

## 12. New characters needing portraits

Every heir is listed with his realm, its culture, his people and sex; the portrait work gives each a member of the pool `<culture>.<people>.<sex>` (the pools are full at the serving cap). Until then `modules/characters.mjs` gives an heir a free member of his culture pool when one is under the cap (`pendingPortraits`), or no portrait of his own, so his realm's portrait database serves him. In the current tree 7 heirs wear a pool portrait and 102 wear none. When the plan lists an heir, nothing else needs changing: the plan's assignment takes precedence.

| Id | Name | Realm | Culture | People | Sex | Born | Custom |
| --- | --- | --- | --- | --- | --- | --- | --- |
| zin_heir_melkgard | Ulvran of the Third Fort | Melkgard (MLK) | melkgard_warlords | men | male | 6789 | elective |
| zin_heir_horidor | Kerdan Azling | Horidor (HOR) | ice_clans | men | male | 6790 | elective |
| zin_heir_fearno | Aldvar Azening | Fearno (FEA) | ice_clans | men | male | 6784 | elective |
| zin_heir_poloto | Kolbran Margak | Poloto (PLT) | vindael_seafarers | men | male | 6783 | elective |
| zin_heir_glimkit | Snarkit the Wide | Glimkit (GLI) | spring_warrens | hobgoblins | male | 6791 | contested |
| zin_heir_xison | Ezhvar Esroming | Xison (XIS) | ice_clans | men | male | 6787 | elective |
| zin_heir_omar | Kerdak, Nephew of Grinor | Omar (OMR) | ice_clans | men | male | 6793 | elective |
| zin_heir_portogalor | Kerdir Azlak | Portogalor (POT) | ice_clans | men | male | 6794 | elective |
| zin_heir_kvittumm | Haldsten Grinson | Kvittumm (KVI) | reindeer_clans | men | male | 6788 | elective |
| zin_heir_orewele | Kolvan Siulak | Orewele (ORW) | ice_clans | men | male | 6791 | elective |
| zin_heir_nivaros | Hukar the Younger | Nivaros (NIV) | ice_giants | giants | male |  | elective |
| zin_heir_yeti_lands | Ruughal the Singer | Yeti Lands (YEI) | yeti_clans | yeti | male |  | elective |
| zin_heir_ghaahu | Halgarum the High Singer | Ghaahu (GHH) | height_yeti | yeti | male |  | elective |
| zin_heir_vindael | Ulvbran Hozen | Vindael (VND) | vindael_seafarers | men | male | 6789 | elective |
| zin_heir_dondor | Dunbar of the Gulung | Dondor (DND) | dondor_brutes | men | male | 6790 | contested |
| zin_heir_dark_gate | Ghorzak of Doldes | Dark Gate (DRK) | volcano_clans | orcs | male | 6795 | contested |
| zin_heir_burnikit | Snaxit Loud-Lamp | Burnikit (BUN) | goblin_warrens | goblins | male | 6798 | contested |
| zin_heir_veshazel | Vorzael the Pact-Bound | Veshazel (VES) | veshazel_court | demons | male |  | open |
| zin_heir_blackton | Gorvan Korvik | Blackton (BLK) | dondor_brutes | men | male | 6785 | elective |
| zin_heir_belonton | Ugrash the Far-Sailor | Belonton (BLN) | sea_orcs | orcs | male | 6790 | elective |
| zin_heir_bordon | Zhagdur of Zubudor | Bordon (BOR) | iron_clans | orcs | male | 6794 | contested |
| zin_heir_dreson | Mudrak Eel-Son | Dreson (DRE) | iron_clans | orcs | male | 6793 | elective |
| zin_heir_dulundur | Ghorvak of the Second Valley | Dulundur (DUL) | iron_clans | orcs | male | 6788 | elective |
| zin_heir_troll_forest | Krunch the Unbeaten | Troll Forest (TRO) | troll_tribes | trolls | male |  | contested |
| zin_heir_hoorunoron | Bruuntar the Old | Hoorunoron (HOO) | cairn_giants | giants | male |  | blood |
| zin_heir_the_darks | Zugrak of the Second Hold | The Darks (DAK) | iron_clans | orcs | male | 6791 | elective |
| zin_heir_skragdurg | Grumbag Oak-Feller | Skragdurg (SKR) | iron_clans | orcs | male | 6795 | contested |
| zin_heir_dun | Ruzbag of the Zhaggul | Dun (DUN) | wild_holds | orcs | male | 6801 | contested |
| zin_heir_britadon | Bazrak of the Brakgul | Britadon (BRT) | iron_clans | orcs | male | 6792 | contested |
| zin_heir_wild_lands | Ghashrok of the Doltu | Wild Lands (WIL) | wild_holds | orcs | male | 6794 | contested |
| zin_heir_rhachia | Alerhis of Gaenna | Rhachia (RHA) | red_lands_tribunes | men | male | 6782 | elective |
| zin_heir_mora | Ernoeus of Gonnois | Mora (MOA) | lake_road_cities | men | male | 6781 | elective |
| zin_heir_kersian | Velmeus Kersides | Kersian (KRS) | lake_road_cities | men | male | 6786 | elective |
| zin_heir_mostok | Tablio Crovo | Mostok (MOS) | caravan_princes | men | male | 6787 | elective |
| zin_heir_obmi | Arcino Shindo | Obmi (OBM) | caravan_princes | men | male | 6780 | elective |
| zin_heir_pornivior | Belino Shindo | Pornivior (PON) | caravan_princes | men | male | 6784 | elective |
| zin_heir_woqood | Nurek ben Alodim | Woqood (WOQ) | woqood_sealers | men | male | 6804 | elective |
| zin_heir_khorvrath | Vorzuum the Ash-Crowned | Khorvrath (KHO) | netherborn | demons | male |  | contested |
| zin_heir_dolon | Khorzael of the Salt Pact | Dolon (DLN) | netherborn | demons | male |  | open |
| zin_heir_halia | Maelen of Gelon | Halia (HAL) | ember_freeholds | men | male | 6783 | elective |
| zin_heir_olen | Almon of the High Lamp | Olen (OLE) | ember_freeholds | men | male | 6781 | elective |
| zin_heir_enhis_is_rond | Kenyo nau Suyowan | Enhis Is Rond (ENH) | southern_islanders | men | male | 6774 | elective |
| zin_heir_howan | Tichyo nau Lamowan | Howan (HWN) | southern_islanders | men | male | 6782 | elective |
| zin_heir_verde | Lanyo nau Lua | Verde (VER) | southern_islanders | men | male | 6790 | elective |
| zin_heir_nara | Wangai nau Ancha | Nara (NAR) | southern_islanders | men | male | 6751 | blood |
| zin_heir_yongyong | Tonyo nau Yongwa | Yongyong (YON) | southern_islanders | men | male | 6779 | elective |
| zin_heir_kamu_lamo | Rumang nau Bukonyo | Kamu Lamo (KAM) | southern_islanders | men | male | 6766 | elective |
| zin_heir_kea | Keawan nau Tuwang | Kea (KEA) | southern_islanders | men | male | 6784 | elective |
| zin_heir_sidea | Lanuan nau Pon | Sidea (SDE) | southern_islanders | men | male | 6778 | elective |
| zin_heir_lands_of_light | Helan of Eldoga | The Lands of Light (LIG) | sunhot_light | sun_elves | male |  | elective |
| zin_heir_elvana | Telang of Googavis | Elvana (ELV) | sunhot_western | sun_elves | male |  | elective |
| zin_heir_igara | Rangel of Repgin | Igara (IGA) | sunhot_western | sun_elves | male |  | elective |
| zin_heir_yeni_alang | Wenel of Sudoni | Yeni Alang (YEN) | sunhot_western | sun_elves | male |  | blood |
| zin_heir_tor_luni | Lovan of Wefolen | Tor Luni (TOR) | sunhot_western | sun_elves | male |  | elective |
| zin_heir_ihuy | Pangel of Holang | Ihuy (IHU) | sunhot_isles | sun_elves | male |  | elective |
| zin_heir_soyano | Selan of Ileslia | Soyano (SOY) | sunhot_isles | sun_elves | male |  | elective |
| zin_heir_goodin | Hengel of Goodton | Goodin (GOO) | goodin_sunfolk | men | male | 6779 | elective |
| zin_heir_magical_forest | Taurel Lozari | Magical Forest (MAG) | forest_council_elves | elves | male |  | elective |
| zin_heir_andos_enda | Ferwen of the Weirs | Andos Enda (ANE) | lake_elves | elves | male |  | elective |
| zin_heir_nolorim | Sirion of the Western Posts | Nolorim (NLR) | pass_wardens | elves | male |  | elective |
| zin_heir_lccimio | Thalwen of the Orchards | Lccimio (LCC) | rift_coast_elves | elves | male |  | elective |
| zin_heir_eldafaen | Aelwen of Lenkei | Eldafaen (ELD) | rift_coast_elves | elves | male |  | elective |
| zin_heir_yavieth | Kaereth the Elder Keeper | Yavieth (YAV) | roost_keepers | elves | male |  | blood |
| zin_heir_teste | Aldwin Selbar | Teste (TES) | teste_valley_folk | men | male | 6790 | elective |
| zin_heir_luv_zhise | Thalides Moiros | Luv-zhise (LUV) | quay_folk | men | male | 6778 | elective |
| zin_heir_selen | Calden Svenlor | Selen (SEL) | selen_ranger | men | male | 6791 | elective |
| zin_heir_hirolon | Oronar of the Elder Cairn | Hirolon (HIR) | hill_giants | giants | male |  | elective |
| zin_heir_tirlan | Hobbard Brumel | Tirlan (TIR) | hearth_folk | small_folk | male |  | elective |
| zin_heir_klungori_guard | Aldric Toler | Klungori Guard (KLU) | vale_folk | men | male | 6786 | elective |
| zin_heir_noleksun | Tannor Ulren | Noleksun (NOL) | march_folk | men | male | 6783 | elective |
| zin_heir_kilinti | Oonothar | Kilinti (KIL) | kilinti_ents | ents | none |  | elective |
| zin_heir_safeton | Ronvar Safarel | Safeton (SFT) | lake_aenoran | men | male | 6790 | elective |
| zin_heir_freshon | Ervan Sulren | Freshon (FRE) | lake_aenoran | men | male | 6785 | elective |
| zin_heir_pazoma | Hallec Bellaren | Pazoma (PAZ) | lake_aenoran | men | male | 6788 | elective |
| zin_heir_orohaf | Belvar Rishan | Orohaf (ORH) | isle_houses | men | male | 6795 | elective |
| zin_heir_kunhrim | Hrunmar of the Hrunord | Kunhrim (KUN) | wall_delvers | dwarves | male |  | elective |
| zin_heir_burrikkrit | Krunkit the Big | Burrikkrit (BRR) | king_warrens | hobgoblins | male | 6790 | contested |
| zin_heir_olodor | Pebbit of Tovodor | Olodor (OLO) | holt_gnomes | gnomes | male |  | elective |
| zin_heir_dunelaeth | Thaurel of Thamiel | Dunelaeth (DNL) | kingdom_forest_elves | elves | male |  | elective |
| zin_heir_aenor_forest | Hulmor of Graulvoa | Aenor Forest (ANR) | baelim | tree_people | none |  | blood |
| zin_heir_cursed_lands | Belzan of the Eldest Cord | Cursed Lands (CUR) | veiled_folk | men | male | 6788 | elective |
| zin_heir_bloody_forest | Gorzek, son of Belz | Bloody Forest (BLO) | redbark_tribes | men | male | 6790 | elective |
| zin_heir_eekedor | Agnar Perdal | Eekedor (EEK) | leren_sea_kings | men | male | 6784 | elective |
| zin_heir_heodwa_lands | King Torvald of Heodwa | Heodwa Lands (HEO) | free_crowns_north | men | male | 6779 | elective |
| zin_heir_hrakbrund | Hradek Ilmord | Hrakbrund (HRA) | north_delvers | dwarves | male |  | open |
| zin_heir_dolpar | Hegmund of Stork | Dolpar (DOL) | free_crowns_north | men | male | 6782 | elective |
| zin_heir_mustnom | Vurmok the Cave-Taker | Mustnom (MUS) | road_warrens | dwarf_goblins | male | 6792 | contested |
| zin_heir_wahatud | Barqan ben Shinud | Wahatud (WAH) | wahatud_oasis_folk | men | male | 6788 | elective |
| zin_heir_adel | Hesaros Andaios | Adel (ADE) | chart_islanders | men | male | 6787 | elective |
| zin_heir_raerby | Kilaros Raeros | Raerby (RAE) | chart_islanders | men | male | 6789 | elective |
| zin_heir_pollos | Pamaros Polai | Pollos (PLL) | chart_islanders | men | male | 6790 | elective |
| zin_heir_fineger | Lemaron Finon | Fineger (FNG) | chart_islanders | men | male | 6789 | elective |
| zin_heir_windy_lands | Benarai of Sondor | Windy Lands (WND) | corsair_lords | men | male | 6786 | elective |
| zin_heir_seite_islands | Raesion of Vesko | Seite Islands (SEI) | chart_islanders | men | male | 6785 | elective |
| zin_heir_santon | Hanaios the Black | Santon (SNT) | corsair_lords | men | male | 6792 | contested |
| zin_heir_benan | Kildaros of the Coves | Benan (BEN) | corsair_lords | men | male | 6790 | elective |
| zin_heir_the_lens | Arnaros of the North Tower | The Lens (LEN) | chart_islanders | men | male | 6784 | elective |
| zin_heir_gunwyn | Herlow ap Herlic | Gunwyn (GNW) | gunwyn_clans | men | male | 6792 | elective |
| zin_heir_girdon | Rawlic Lothor | Girdon (GIR) | girdon_wardens | men | male | 6790 | elective |
| zin_heir_werlendor | Dyfow ap Dyfric | Werlendor (WER) | gunwyn_clans | men | male | 6804 | elective |
| zin_heir_thenon | Cadow ap Cadlic | Thenon (THN) | gunwyn_clans | men | male | 6806 | elective |
| zin_heir_dobbum | Wobbel Stubbel | Dobbum (DOB) | hearth_folk | small_folk | male |  | elective |
| zin_heir_brundahrim | Hrokast Durnast | Brundahrim (BRU) | west_delvers | dwarves | male |  | open |
| zin_heir_gromkerm | Stulkorn Kunerm | Gromkerm (GRO) | west_delvers | dwarves | male |  | open |
| zin_heir_saopon | Gwedlow Pellkow | Saopon (SAO) | western_guilds | men | male | 6785 | elective |
| zin_heir_buldor | Holtric of the Grey Banner | Buldor (BLD) | buldor_companies | men | male | 6786 | elective |
| zin_heir_kradlon | Kelnic Tanuow | Kradlon (KRA) | western_guilds | men | male | 6787 | elective |
| zin_heir_corogon | Doranic Gwennow | Corogon (CRG) | western_guilds | men | male | 6789 | elective |
| zin_heir_wennarith | Ruarow of the Datidon | Wennarith (WEN) | girdon_wardens | men | male | 6787 | elective |

## 13. Verify

`verify.sh sty` on the shared tree (25 October 2026, after the owner's follow-up answers on Q-86 and Q-89): the build stops only at the asset gate on the five `UNIQ_PORTRAIT_POOL` errors of the legacy generics (orcs and elves, the portrait work's; the same five as the baseline run before these changes); every module before it, the story wiring, the engine forms and the news reach pass (`news reach: 37 world, 10 owned, 18 regional`); the text scan is at its baseline count (132 errors, none failing). Suite: 1,681 tests, 1,658 pass, 21 fail, 2 skipped. Twenty failures are the baseline's (the tests that read a staged tree, which the asset gate keeps from being written). The twenty-first, "Portrait plan: every roster character is named, pooled or held exactly once", is the portrait work in progress: it has listed the 109 heirs in `portrait_pools.base.json` and replaced this work's allowance in `assets.test.mjs`, but has not yet regenerated `portrait_pools.json`; the test passes once it does. New tests: `news_reach.test.mjs` (4), `realm_life.test.mjs` (4 more), `story_ai.test.mjs` (1), `alternate_history.test.mjs` (2), and updated `events_mech`, `events_mech_war`, `events_world`, `mech_court`, `cultures`, `roster` tests.

## 14. Simplifications, omissions and open points

- **Portraits (blocking for the art, not for the build):** 102 of the 109 heirs wear no portrait of their own (the culture pools are full at the serving cap), so their realm's portrait database (the legacy generics of their people) serves them until the portrait work plans them; 7 wear a free pool member. The portrait work is planning them (`portrait_pools.base.json` lists all 109).
- **Temper icons:** registered as pending art; no icon is wired (ZIN's leader traits carry none).
- **Heir texts:** every name, office, birth and role is proposed. Some court notes still name a favourite that is now a commander or advisor of the same court (Melkgard's Brana, Portogalor's Brandur, Safeton's head of Lotaren); the heirs are written as their rivals or brothers rather than as those men, which suits the dispute but is a choice the owner may revisit. Orohaf's note says the eldest women choose a queen; with only eight women left, its heir is a man the eldest women favour. `zin_realm.12` keeps its title "No Heir of the Body" when it tells an election that cannot agree.
- **Q-80:** "a player's front" is read as a front flag set while the realm that opens that front is a human realm; the openers are proposed.
- **Q-95:** the Worshipdom's and Coldor's events still read their free branch for situational weights under PLAUSIBLE; the lean is the plan's focus factors and a x3 weight on the historical options (Afrit) or a three times slower march war (Coldor), not a remap of the per-power rule.
- **Q-70:** no start-visible loading tip names Kusven (the tip set is fixed); the start legend is in the Zol opening and the Dark Lands' rising text. The super events are the super-event agent's.
- **K61:** the regional audience is the lands plus their borderers (no radius constant); four mechanic news events keep their owners' own audiences. The super-event agent's replaced news are not otherwise touched.
- **Linux runs:** the tuning of the ages, the dispute chances, the hunt pace and the raid rates is unobserved in play.

## 15. Files

Builder: `tools/content/build.mjs` (one call), `modules/news_reach.mjs` (new), `modules/realm_life.mjs`, `modules/start_variety.mjs`, `modules/characters.mjs`, `modules/world_tension.mjs`, `modules/rules.mjs`, `modules/mech_cold.mjs`, `modules/events_mech.mjs`, `modules/events_mech_war.mjs`, `lib/mech_afrit_script.mjs`, `lib/mech_aenor_script.mjs`, `lib/mech_aenor_story.mjs`, `checks/cultures_check.mjs`. Data: `data/news_reach.json` (new), `data/world/heirs.json` (new), `data/realm_life.json`, `data/start_variety.json`, `data/story_ai.json`, `data/world_tension.json`, `data/mech_aenor.json`, `data/mech_afrit.json`, `data/events_mech_afrit.json`, `data/events_mech_mistake.json`, `data/events_mech_dark.json`, `data/events_world_lore_1.json`, `data/events_crown_chronicle.json`, `data/world/bestiary.json`. Docs: `docs/specs/04_mechanics/realm_life.md`, `afrit_hidden_council.md`, `aenor_court_and_succession.md`, `docs/specs/03_gameplay/05_world_tension_and_endings.md`, `06_historical_path_and_ai.md`, `docs/lore/references/knowledge_layers.md`, `docs/specs/02_lore/09_voice_and_style.md`, `docs/zin_dynamic_effects.md`, `docs/plans/zin-art/pending_from_integration.md`, `docs/design/alternate_history.json` (realm events `.10` to `.17`).
