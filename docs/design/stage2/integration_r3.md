# Stage 2 integration, round 3 (24 October 2026)

Round 3 wires the mechanic slices and the world events into `tools/content/build.mjs`, finishes the interrupted slices, and makes `node content/build.mjs` and `npm test` pass from `tools/`.
Nothing was applied to the mod: `apply.mts` was not run, and the staged tree lives outside the repository.

## 1. Order in `build.mjs`

The slices run after `buildInstitutions` (the staged technology tags, flags and name pools exist) and before the crown events, vanilla removal, the text sweep and the focus compiler, whose reference scans must see every name they define.

| Step | Call | Why here |
| --- | --- | --- |
| 1 | `buildAenor(staged, { countries })` | Owns the Golden Court and succession names every other court and journey slice calls (`zin_aenor_*`), and every `zin_aenor` event (section 4). |
| 2 | `buildAfrit(staged, { countries, table })` | Owns the Council's names; reads the country table for the start footholds. |
| 3 | `buildZol(staged, { countries })` | Zol's Mistake; read by the Volgan, Lerendor and Cold Lands slices. |
| 4 | `buildYeldenneGlo(staged, { countries })` | Glo's hall rules, called by the Eindil scripts. |
| 5 | `buildEindilJourney(staged, { countries, eindil: { hostFlag: false } })` | The journey engine (`zin_eindil.1` to `.7`). The Host of Eindil's flag is not staged (section 6). |
| 6 | `buildWesternCrossing(staged, { countries })` | Reads the Eindil hosts and the journey geography. |
| 7 | `buildElves(staged, { countries, table })` | Reads the staged technology tags (`zin_cat_wards`). |
| 8 | `buildLerendor(staged, { countries, table })` | |
| 9 | `buildVolgan(staged, { countries })` | Reads `data/warfare_ids.json`. |
| 10 | `buildPowersUi(staged, { countries })` | The three power windows; last of the powers (`mech_powers.md`). |
| 11 | `buildMechCold(staged, { countries })` | Note `mech_cold.md`. |
| 12 | `buildMechDark(staged, { countries, assignment })` | Note `mech_dark.md`. |
| 13 | `buildMechEast(staged, { countries })` | Note `mech_east.md`. |
| 14 | `buildMechSun(staged, { countries, assignment })` | Note `mech_sun.md`. |
| 15 | `buildRules(staged)` | New foundation rules module (section 3); after the slices, because its branch triggers read the Lerendor, West and Eindil rule files. |
| 16 | `buildEventsWorld(staged, { countries })` | The Eindil narrative (10 to 169), the War of the Last Crowns and the lore events. |
| 17 | `buildEventsCrown(staged, { countries, storyBlocks: ['reign', 'lastwar', 'ending', 'lore'] })` | `zin_story_tick` calls the runner blocks of the world events too (convention C6). |

## 2. C3: two passes, one declared register

The first pass (`computeBridges(..., { deferZin: true })`, before the focus compiler) bridges the names kept vanilla files use; a name that only ZIN files use is deferred, because a mechanic file may name a tree focus or spirit that the compiler writes later.
The final pass over the finished tree (trees, their helpers and the regional decisions included) is strict:

- every name that dangles stops the build unless `tools/content/data/pending_names.json` declares it with the owner and spec that will define it;
- a declared name that some module now defines stops the build (remove the row);
- a declared name that no ZIN file uses stops the build (the row is stale);
- each declared name that still dangles gets an inert stand-in from `modules/pending_names.mjs` (triggers `always = no`, empty effects, hidden triggered-only events, ideas never allowed, characters named "Unnamed", opinion modifiers worth 0), in `zz_zin_pending_*` files marked `# pending: <owner>`;
- the duplicate-definition check runs on the finished tree, after the stand-ins.

The scan also learned to see undefined ZIN scripted calls: `zin_<name> = yes` (or `no`) below the top level of a ZIN file is a call (decision E1: scripted effects and triggers take no arguments), so it is held to a definition even when nothing anywhere defines the name (`checks/vanilla_refs.mjs`, `references`). Before this round such a call was invisible to C3; that is why the trees could name about a hundred site, region, rule and world triggers that nothing defined.

Removed: the automatic stand-ins of the interrupted round (`writePendingFiles`, the `pendingCategories` option of `computeBridges`, the second pass that stubbed any undefined idea, character or opinion modifier) and the I9 block that stubbed every undefined trigger of the diplomacy slice (`zz_zin_pending_triggers.txt`). Every name they covered that a wired slice now defines is gone from the stand-ins; the rest is in the register.

### Pending names (230, 14 owners)

| Owner id | Owner | Spec | Names |
| --- | --- | --- | --- |
| `sites` | the key-sites table (`modules/sites.mjs`, decision E7) | `docs/specs/01_map/02_key_sites.md` | trigger 67 |
| `characters` | the characters module (`characters.mjs` writes only the rulers today) | `docs/specs/02_lore/02_characters.md`; the tree specs for their advisors | character 57 |
| `events_afrit` | the Afrit story events (owner `mech_afrit`; not written) | `afrit_hidden_council.md`; `06_events/01`, `03` | event 24 |
| `events_mistake` | the Zol story events (owner `mech_zol`; not written; K4 and K11 change the manifestation beats) | `zols_mistake.md`; `06_events/03`, `05` | event 6 |
| `events_dominion` | the Volgan story events (namespace `zin_dominion`) | `volgan_southern_dominion.md`; `06_events/03` | event 11 |
| `events_war` | the war and story events the slices fire and leave to the events engineers (`zin_east`, `zin_elves`, `zin_leren`, `zin_dark`, `zin_sun`) | `06_events/03` and the mechanic specs | event 25 |
| `world` | the world tension and endings module | `03_gameplay/05_world_tension_and_endings.md` | effect 3, event 1, idea 7, trigger 2 |
| `magic_world` | the magic and world systems module | `03_gameplay/04_magic_and_world_systems.md` | effect 3, trigger 2 |
| `warfare` | the warfare mechanics module | `03_gameplay/01_warfare.md` | effect 4 |
| `politics` | the foundation politics module (stance spirits, drift) | `00_foundation/02_ideologies_and_politics.md` | effect 2, idea 3 |
| `diplomacy_gameplay` | the diplomacy gameplay effects and events (`stage2/diplomacy.md` item 8) | `03_gameplay/03_diplomacy_and_factions.md` | effect 3, event 2 |
| `start` | the start situation module (start spirits and opinions) | `02_lore/01_start_situation.md` | idea 2, opinion modifier 3 |
| `names` | the names and terms module (`zin_eindil_known_by_name`) | `02_lore/01_start_situation.md` | trigger 1 |
| `peoples` | goblins and ogres are not peoples of the table | `00_foundation/03_peoples.md` | trigger 2 |

The stand-ins keep the game free of undefined-name errors, but every story beat they stand for is silent until its owner lands. The largest gaps are the story events of the Afrit, Zol and Volgan namespaces and the war events (90 events) and the key-sites table.

## 3. Names this round defines instead of stubbing

| What | Where | Spec |
| --- | --- | --- |
| The foundation game rules (`zin_rule_historical_path`, `_story_pace`, `_eindil_waking`, `_dark_powers`, `_ai_aenor_succession`, `_ai_east`, `_ai_elves`, `_ai_goldoroth`, `_golden_king_death`, `_afrit`, `_cold_isengard`, `_debug_checks`), the wrappers `zin_rules_is_historical`, `zin_rules_is_free`, the 26 branch triggers `zin_rules_ai_branch_<power>_<option>` (including Lerendor, the West and Eindil, whose rules their owners write) and the four `zin_rules_ai_random_<power>`, and the start-up block that sets `global.zin_story_pace` | new `modules/rules.mjs`, data `data/game_rules.json`, test `rules.test.mjs` | `00_foundation/05_defines_and_rules.md` section 2 |
| The seven general causes of war (`zin_cb_broken_truce`, `_old_grudge`, `_caravan_roads`, `_orc_raids`, `_crown_defied`, `_against_the_dark`, `_eastern_ambition`) as targeted dynamic modifiers | `modules/diplomacy.mjs`, `common/dynamic_modifiers/zin_causes.txt` | `03_gameplay/03_diplomacy_and_factions.md`, "Casus belli" |
| The people triggers `zin_people_is_<key>`, `zin_people_includes_<key>` for the ten peoples, `zin_people_is_great_folk`, `zin_people_is_common_folk` | `modules/peoples.mjs`, `common/scripted_triggers/zin_peoples.txt` | `00_foundation/03_peoples.md`, Implementation |
| The Council's opinion modifiers `zin_afrit_opinion_famine_stores` (+20) and `zin_afrit_opinion_thief_caught` (-30) | `modules/mech_afrit.mjs` | `afrit_hidden_council.md`, the Council's decisions |

`zin_rule_eindil_waking` moved from the interim writer in `vanilla_removal.mjs` to `rules.mjs`; its text is now "The Man from the Ice" (the interface spec's title; the interim text named Eindil before any campaign, against D4) and its options say the right months (HISTORICAL Ironfrost 4A 1749, EARLY Highsun 4A 1748, LATE Ironfrost 4A 1751, as the journey reads them; the interim text had HISTORICAL and EARLY swapped).
`zin_rule_gathering_dark` and `zin_rule_elections` are not written: nothing reads `zin_gathering_dark_rate` or an election switch yet, and a rule that does nothing would mislead the rules screen.
No rule carries an icon until the rule icons exist (pending art).

## 4. The interrupted court slice: who owns `zin_aenor.10`

The Aenor mechanic owns every `zin_aenor` event, including the ids that `06_events` carries (`zin_aenor.10`, the feast, and the 32 others): R5 (one namespace, one builder module) and `06_events/01` ("the texts of the owners' events (`zin_aenor.*`, `zin_afrit.*`) go into the owners' modules"). Its story part `lib/mech_aenor_story.mjs` writes them as `events/zin_aenor_story.txt`.
`data/mech_aenor.json` names the list `storyEvents` (it was `externalEvents`), and `mech_court.test.mjs` checks that the story part writes each of them, that every `zin_aenor` id of `06_events` is in the list, and (negative) that without the story part none is defined.
By the same rule the `zin_afrit` and `zin_mistake` story ids belong to the Afrit and Zol modules; they are not written yet (register owners `events_afrit`, `events_mistake`), and the test holds that none is defined by accident.

Fixes in the court slice: `zin_aenor_golden_court` (a dynamic modifier) was removed with `remove_ideas`; the tree spirit is `zin_shared_concord_dominions_charter_loyalists_spirit`; Kessarion's and Ossar's traits were defined twice (Afrit module and `vanilla_removal.mjs`) and are now the Afrit module's only, with the values of `02_characters.md`; the Afrit decision sprites carry the prefix `zin_afrit_` (the Aenor court picks the same catalog icons).

## 5. The region slices

The four region slices were finished by one worker each, under explicit briefs (complete what the spec gives, no stubs, a test to the standard of `mech_powers.test.mjs`, a note). Their notes: `mech_cold.md` (40 tests), `mech_dark.md` (32), `mech_east.md` (49), `mech_sun.md` (48). Highlights: the Cold, Dark and East slices no longer run from an every-country `on_monthly` (country-specific hooks or self-rescheduling events instead); missing spec features were completed (the east's story beats, the Dark Lands' challenge roll and windows, the Sun's asks and heeding weights, the Cold Lands' season clock); every number moved to the data files.

## 6. Asset findings

The interrupted round had made every uniqueness finding a warning before phase 7 (`checks/assets.mjs`, the `pendingArt` and `exactPendingArt` switches) and grown the baseline by about 6,900 lines of such warnings. Both are undone: the uniqueness rules are errors again, as section 5 of `05_asset_manifest.md` says, and the baseline lists only errors, each with a reason (`baselineOf`, `newFindings`: an entry without a reason accepts nothing).

Fixed by code or data:

| Finding | Fix |
| --- | --- |
| 95 `UNIQ_EVENT_CHAIN` pairs | each pair now uses two different existing catalog pictures (world, crown, court, journey, powers, region and tree data) |
| 10 `UNIQ_EVENT_CHAIN` self-links | a pulse event that fires itself is one event, not a chain (`checks/assets.mjs`; test added) |
| 7 `SPRITE_DUPLICATE` | the Glo, West and Afrit decision sprites carry their module's prefix |
| 9 `PORTRAIT_SIZE` | the Dark Lands, Volgan and Eindil characters no longer name a 156 x 210 portrait as their 65 x 67 small portrait |
| 4 `UNIQ_PORTRAIT_COUNTRY` | the check read `zin` as a country tag; mechanic figures without a tag are in no start roster, and a character with two roles counts once (`lib/loaded_assets.mjs`, `checks/assets.mjs`; test added) |
| 10 `PROV_NO_MANIFEST_LINE` | the people focus emblems `gfx/interface/goals/zin/people_*.dds` got their source rule (`data/assets/families.json`) |
| 3 `PROV_NO_MANIFEST_LINE`, 3 `ORPHAN_ASSET` | the Host of Eindil flag, recoloured from Selen's flag in code, is not staged (pending art) |
| `X12` (text scan) | the Glo decision category `zin_glo_bearer` shared its text key with the warfare sub-unit; it is `zin_glo_cat_bearer` |

Kept in the baseline (816 entries): 37 errors of the first baseline of 19 October 2026 (33 `PROV_UNREVIEWED`, 3 `UNIQ_PORTRAIT_POOL` of the rulers, 1 `REPLACE_SHAPE` of `logo_game.dds`), each with the reason "accepted in the first baseline"; and 779 errors that need new art, each with a reason naming its row in `docs/plans/zin-art/pending_from_integration.md`: 302 exact duplicates of the interface reskin's placeholder chrome at vanilla paths, 297 focus icons over a tree's cap, 116 focus icons shared with a prerequisite, 38 focus icons over the game cap, 25 event pictures over the game cap and the Aenor court's 105 figures on one generic portrait.

## 7. Zol correction footprint

Owner decision K4/K11: Zol does not appear in the War of the Last Crowns; his most loyal servant, the Great Spirit Kusven (formerly Edvoid), does. No new content about Zol in person was added in this round. Where the manifestation lives today (to be redesigned by the lead):

- Flags and names: `zin_zol_manifested` (global flag), `zin_zol_withdrawn`, `zin_zol_manifest` (effect), `zin_zol_can_manifest`, `zin_zol_is_manifest` (triggers), `zin_zol_manifest_open` (country flag), `zin_zol_manifest_cost`, `zin_zol_set_manifest_cost`, `zin_zol_weekly_manifest`, `zin_zol_after_late_manifest` (date trigger), the sub-unit `zin_zol_manifestation` and the equipment `zin_zol_manifestation_equipment`, the warfare effects `zin_war_grant_zol_manifestation` and `zin_war_remove_zol_manifestation` (pending, owner `warfare`).
- Builder sources: `modules/mech_zol.mjs`, `lib/mech_zol_script.mjs`, `data/mech_zol.json` (the Presence's decisions and the mission of the manifestation); `data/warfare_ids.json`, `warfare_units.json`, `warfare_equipment.json`, `warfare_models.json` (the sub-unit, its equipment and model); `data/technologies_ids.json`, `forces_ai.json`, `institutions.json`; `data/events_world.json`, `events_world_eindil_3.json`, `events_world_lastwar.json`, `events_world_lore_1.json`, `events_world_lore_3.json` (story flags read by the war, journey and lore events, and `zin_lore.20`'s start check); `modules/events_crown.mjs` (the Chronicle reads the flags); `modules/mech_eindil_scripts.mjs`, `modules/mech_elves.mjs`, `data/mech_powers_elves.json`, `lib/mp_volgan_pulse.mjs` (reactions to the flag); `data/presentation-cells.json` (the `zol_rising` picture's gate).
- Focus trees (`docs/design/focus/`): `zol.json`, `worshipdom.json`, `goldoroth.json`, `shared_dark_lands.json`, `shared_magical_lands.json`, `shared_north_lands.json`, `regional_blackton.json`, `regional_dondor.json`, `regional_eekedor.json`, `regional_mina.json`, `regional_molot.json`, `regional_r_en.json`, `regional_sensai.json`, `regional_the_end.json`; and the focus registries `data/focus_registry_major_a/_major_c/_regional_a/_regional_c/_regional_d/_shared_a/_shared_b.json`.
- Pending Zol story events (register owner `events_mistake`): `zin_mistake.2`, `.10`, `.11`, `.20`, `.24`, `.25`; their beats must be written for Kusven, not Zol.
- Tests that name the flags: `mech_court.test.mjs`, `mech_powers.test.mjs`, `warfare.test.mjs`, `forces.test.mjs`, `focus_major_c.test.mjs`, `focus_shared_a.test.mjs`, and the region tests (which assert that the region slices use none of it).

## 8. Findings for the lead

- **Every-country periodic hooks still staged** (CLAUDE.md rule 8; none was added in this round): `on_monthly` in `common/on_actions/zin_aenor_court.txt`, `zin_afrit.txt`, `zin_crown_story.txt` (the crown events' scheduler), `zin_diplomacy_leagues.txt`, `zin_economy.txt`, `zin_elves.txt`, `zin_sun.txt` (the Sun spec asks for it), `zin_technologies.txt`. The Cold, Dark and East slices' were replaced in this round.
- **The focus registries** (`data/focus_registry*.json`) still declare as pending most names the wired slices now define (for example 56 of 58 effects of the major-a registry). The compiler tests compile the trees without the mechanic modules and need those rows; prune them when the focus tests stage the mechanics.
- **Spec conflicts recorded**: the tributary autonomy state keeps `min_freedom_level = 0.35` (both specs say 0.4, but the diplomacy builder refuses two autonomy states with one level); the Glo category `zin_glo_bearer` of the Glo spec is `zin_glo_cat_bearer` (the warfare spec's sub-unit has the id); the rule texts are this round's proposals.
- **The document renames of 24 October** (Dead Lands to Ember Lands) left two tests reading old spec names; `focus.test.mjs` and `focus_shared_a.test.mjs` carry a one-entry map from the data's old key to the documents' new one, which the renaming migration removes.
- `mp_check.mjs` reads the parameter blocks of `has_country_leader`, `strength_ratio`, `has_dynamic_modifier` and `set_politics` as commands; the Sun and East tests work around it (their notes).
- Volgan's rule texts use `ZIN_ZIN_RULE_*` keys instead of the spec's `ZIN_RULE_*` format (`mp_kit.mjs`); harmless, not changed.

## 9. Not verified

No Linux acceptance run and no `hoi4.*` MCP route was used in this round; the evidence is the full build (C3, the text scan, the interface checks and the asset gate) and the test suite.
