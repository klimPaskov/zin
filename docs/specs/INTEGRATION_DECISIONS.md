# Integration decisions

**Status:** Ready. Decided 18 October 2026 while integrating the first full spec package.

The specs were written in parallel, so some of them use different names or values for the same thing. These decisions settle every such conflict that is a design choice rather than lore. Where a spec disagrees with this file, this file wins until the spec is corrected. Lore questions stay with the owner: see [OPEN_QUESTIONS.md](OPEN_QUESTIONS.md).

## The secret and the peaceful start

| # | Decision | Affects |
| --- | --- | --- |
| D1 | The Worshipdom starts as **Light, Sanctuary** with the party "The Faithful of the Deliverer". Its ruler is shown as **Aurevan the Deliverer**, and its description never names Afrit or the Hidden Council. It turns Shadow only when `zin_afrit_revealed` is set. | foundation, Afrit, Worshipdom tree |
| D2 | **The current mod breaks the secret today:** the Worshipdom's ruler is named Afrit and its description names the Hidden Council. Fixing this is a phase 1 defect ([01_map/03_known_issues.md](01_map/03_known_issues.md)). | politics step, content builder |
| D3 | The world learns the name Afrit at his **flight east** (historical 4A 1756), or earlier only when a player exposes the plot. Eindil's warnings before that say "the king in Parim is not what the temples say", never the name. | world systems, events, Eindil |
| D4 | Before Lorien names him, players read only "the Man from the Ice". | lore digest, Eindil, events |
| D5 | Aenor starts with 0% Shadow popularity. | foundation |
| D6 | Dominion and Shadow get `generate_wargoal_tension = 0.25` so that the no-great-war start does not rest on AI behaviour alone. | foundation, world systems |
| D7 | The two-face focus names (public, then true after the reveal) are adopted for every text other players can see. | Worshipdom tree, compiler |
| D8 | *Pacify the Bloody Forest* stays as a player-only choice: AI weight 0 before the Golden King's death. | Aenor tree |

## Names

| # | Use | Retire | Affects |
| --- | --- | --- | --- |
| N1 | `zin_horos_sword_broken` | `zin_blue_sword_broken` | Eindil, Zol, events |
| N2 | `zin_black_compact` (Volgan–Zol truce) | `zin_zol_volgan_accord` | Volgan, Zol, events |
| N3 | `zin_eindil_cast_down` | `zin_afrit_cast_down_eindil` | Eindil, Afrit |
| N4 | `zin_rule_golden_king_death` | `zin_rule_golden_king` | foundation, Aenor |
| N5 | `zin_opinion_caravan_rivalry` (−25) | `zin_opinion_caravan_rivals` | economy, start situation |
| N6 | `zin_opinion_old_estrangement` | `zin_opinion_edrans_folly` | peoples, start situation |
| N7 | Lorien: `zin_trait_memory_of_dardan`; other ancient rulers: `zin_trait_ancient_king` | — | characters, ideologies |
| N8 | Report of the stranger leaving Gala: `zin_afrit.31`, with the union of both specs' options | `zin_glo.10` | Afrit, Eindil |
| N9 | Ambush odds: the journey spec's base 5, plus 1 for each of the Afrit spec's terms | — | Eindil, Afrit |
| N10 | The Council's seat of worship is one person, **Ilvane, High Confessor** (proposed); "Hierarch Aubren" is retired | `zin_hierarch` | Afrit, characters |
| N11 | Names declared by more than one spec in [04_mechanics/00_contract_additions.md](04_mechanics/00_contract_additions.md) mean the same thing in each; the owning spec named there defines them. | — | all |

## Values

| # | Decision |
| --- | --- |
| V1 | When a start value differs between the start-situation spec and the mechanic that owns it, **the owning mechanic's value wins**, because its thresholds are tuned to it: Zol's power 35, Volgan's strength 45, Aenor's corruption 70. The Gathering Dark starts at 10. |
| V2 | Resources are Iron, Timber, Horses, Stone, Gold, Essence and Grain (economy spec). Warfare uses Timber for hulls, Horses for mounted equipment and Essence for magical equipment. |
| V3 | The sandbox runs to 4A 1800. |
| V4 | Owner floor dates in the historical path read `zin_story_pace`. |

## Systems

| # | Decision |
| --- | --- |
| S1 | **King of the East:** Afrit's realm is the Worshipdom under the cosmetic name "the Dominion of the East"; eastern courts that kneel become its subjects with the `zin_autonomy_eastern_client` autonomy state (diplomacy spec), not faction members. Which courts kneel stays decided in each game by footholds, crises and choices. |
| S2 | **The Host of Eindil:** on the historical path Eindil leads Selen's armies (Alleria's realm) as its general and ruler-in-waiting; a dynamic country is used only if Selen no longer exists. |
| S3 | **The Lost Cause** is an institution inside Aenor's mechanic at the start, not a game faction; it can become one in the succession. |
| S4 | **Zol** is led by an emblem, "The Will of Zol", which says nothing about who administers the Mistake. His armies have numbered hosts, not named commanders. |
| S5 | **Andos Enda** is not in the Leren Compact at the start (the Elven Refusal); Lerendor can court it. |
| S6 | **Dragons** use the air layer. |
| S7 | **Interface:** the meters sit in a new Erdae bar under the flag. Only Aenor sees the Golden Court's gold. |
| S8 | **Validation:** 60 days in the Linux run for phases 1 and 2; one full year at the end of every later phase. |
| S9 | **Compiler extensions** requested by the specs are accepted: any condition in `allow_branch`; `ROOT`, `FROM` and `OVERLORD` as targets of `for_country`, `event_for` and `invite`; timed country flags; full mechanic idea ids in spirit effects; an event id base so a tree and its mechanic can share a namespace. |
| S10 | **The content builder moves into the ZIN repository** (`tools/content/`), so the public mod can be rebuilt from itself. Done in phase 1. |
| S11 | Game text writes **Šodolôro** (the game font cannot draw ō); documents keep the vault's Šodolôrō. |

## Art (decided 19 October 2026, after the first art runs)

| # | Decision |
| --- | --- |
| A1 | **Generation size.** The image model returns about 1.57 megapixels in the prompt's aspect and ignores requested sizes (4:3 comes back as 1448x1086). Loading screens and menu backgrounds are upscaled with Lanczos 3 to 1920x1440; thumbnails are a 10x box downscale. |
| A2 | **Sheet backgrounds are flat black,** not magenta: the model keeps black flat and does not keep a magenta key. Interface strips are generated one per job on a black canvas with ends darkening to black and cut by rows. |
| A3 | **Focus and idea icons are round bronze-rimmed medallions with a dark enamel field** (answers icon catalog open question 1). Idea icons take a square crop of the field; focus icons use the medallion outline as alpha. |
| A4 | **Prompt frame** always includes "no signature or maker's mark; corners and bottom edge hold only plain ground", "no lettering" and "no real-world religious symbol"; review brightens the corners. |
| A5 | **Menu art:** three main-menu backgrounds (Parim, the strait, the Wall); thumbnails live in `gfx/interface/zin/loadingscreens/`; the bookmark picture is 180x104 (measured from the game). `load_24` is cropped to x 0-1400, y 0-1050 before the resize to remove a painted mark. |
| A6 | **Horos** pictures (yeldenne_hall, glo_given) are drawn from the established text only, not from the owner's private drawings, until the owner says otherwise. |
| A7 | Loading tips live in `tools/content/data/loading_tips.json` (builder data). |

## Review to Ready (decided 19 October 2026, from the reviewers' reports)

### Engine conventions

| # | Decision |
| --- | --- |
| E1 | **Scripted effects take no parameters** in 1.19.3. A call with arguments compiles to temporary variables `zin_arg_<name>` set just before the call; keyword arguments become number codes listed by the effect's owner (for example charter: old 0, golden 1, shield 2, free 3, wall 4; camp 1–4 as `zin_aenor_ruling_camp`). |
| E2 | Every event sets `timeout_days = 30`. A timed-out event takes its **first** option, so a human-facing event that decides a checkpoint puts the non-committal option first and the historical option second. "Timeout counts as refusal" is not possible and is retired. |
| E3 | Factions are made with `create_faction_from_template` and a template plus joining rule; `create_faction` is deprecated. |
| E4 | `allow_branch` holds only conditions fixed at game start. Anything that changes in play goes into `available`. One shared `common/on_actions/zin_focus_layout.txt` refreshes focus layouts (`mark_focus_tree_layout_dirty`) on ruling-party change, puppet, release, subject freed, annex and peace conference end; story setters that change what trees show (`zin_eindil_awake`, `zin_eindil_war_king`, journey stage 6, `zin_west_set_route`, the region monthly runners) refresh their region's layouts too. |
| E5 | A gated picture may be used by an event whose firing effect sets the gate flag first. |
| E6 | Doctrines cost experience in 1.19.3: doctrine boosts compile to `add_doctrine_cost_reduction`, other research boosts to `add_tech_bonus`. |
| E7 | `build.mjs` gathers every module's site rows into one `common/scripted_triggers/zin_sites.txt` (owner: `modules/sites.mjs`, table in [01_map/02_key_sites.md](01_map/02_key_sites.md)). Identical rows merge; conflicting rows fail the build. The key-sites table owns every `zin_is_site_*` and `zin_is_region_*` trigger, including `zin_aenor_fallback_seat` and `zin_controls_sea_central` (strategic regions have no usable trigger scope, so `zin_is_sea_central` is retired). |

### Focus compiler (extends S9)

| # | Decision |
| --- | --- |
| F1 | Tree data may declare `scripted_effects`, `scripted_triggers`, `opinion_modifiers` (written to `common/opinion_modifiers/zin_<tree>.txt`), `ai_strategies`, a `copy` block for modules of a shared tree, and an optional `cancel` list per spirit. |
| F2 | Trees fire mechanic events only through tree-declared scripted effects; `event` and `event_for` may name a mechanic event by its full namespaced id. |
| F3 | The build fails when a spirit key equals a focus key, or a mechanic decision, idea or sub-unit id equals a tree's focus or spirit id (they would share a localisation key). |
| F4 | Regional tree spirits are named `zin_regional_<tree>_<key>`. |
| F5 | A `building` effect's `where` site key means a random owned state for which `zin_is_site_<key>` is true. |
| F6 | A tier's focus range counts the whole tree, not one country's view of it. |
| F7 | One Aenor-owned effect, `zin_aenor_event_for_parim`, fires an event to whichever Aenor realm holds Parim; per-tree `_event_for_parim` helpers are retired. |

### Rules, story and start values

| # | Decision |
| --- | --- |
| R1 | All ZIN game rules sit in one group, `RULE_GROUP_ZIN`. Every per-power rule has a first option `DEFAULT` that follows the historical-path rule; an explicit option wins over the path rule. `zin_rule_ai_lerendor` and `zin_rule_ai_west` are retired for `zin_rule_leren_route` and `zin_rule_west_route`; Zol reads `zin_rule_dark_powers` (`zin_rule_zol_behaviour` retired). The sky rule `zin_rule_skies` defaults to `dragons_only`. |
| R2 | V4 extends to every floor date in every spec: all fixed story dates read `zin_story_pace` through `tools/content/lib/story_dates.mjs`. |
| R3 | V1 extends to forces: a start value **or start force** of a mechanic's own realm follows that mechanic. Zol starts with no divisions; Yeldenne starts with none (the politics step stops writing its division). |
| R4 | Start footholds follow the Afrit spec's table (V1): Middle Kingdom Concord dominions 2, Fotan 1, the six Dead Lands freeholds 1, the Cold Lands 1. |
| R5 | One namespace, one builder module (`events_<namespace>.mjs`), one story runner file (`common/scripted_effects/zin_<ns>_story.txt`); the world spec's monthly tick has a ninth step that calls `zin_story_tick`. |
| R6 | When two specs time the same actor differently, the actor's owning spec wins: Afrit's voyage north and his restart after a failed palace attempt (180 days) follow the Afrit spec; the Western route's AI weights follow the Western Crossing spec. |

### Story ownership and duplicates

| # | Decision |
| --- | --- |
| O1 | Under S2, Eindil moves to Aenor only at his coronation: no "Hail him" leader change before it (`zin_aenor.320` and `zin_eindil.92` change). |
| O2 | The Afrit spec owns the palace rolls and `zin_afrit_die` (called once, by the Afrit chain); the journey and the war events narrate. |
| O3 | Glo never passes to Afrit; `zin_glo_with_afrit` and `zin_afrit.35` are retired. |
| O4 | Single owners for shared moments; the others are retired: the impostor warning is the journey's `zin_eindil.82` (`zin_aenor.310` retired); the Volgan–Zol clash is `zin_volgan_zol_clash` and its Volgan event (`zin_zol_volgan_clash`, `zin_mistake.15` retired); the sword-break is Zol's `zin_mistake.21` setting `zin_horos_sword_broken` (`zin_glo.90` retired); Lorien's death news is `zin_mistake.23` (`zin_sun.43` retired for it); the eastern courts' summons is `zin_east.30` (`zin_lore.191` retired); the Black Compact is offered once, by Volgan's `zin_dominion.14` (`zin_mistake.16` becomes Zol's answer, proposed). |
| O5 | The kneeling courts become subjects with `zin_autonomy_eastern_client` (S1) in every spec; `zin_autonomy_client_crown` and "The Eastern Throne" faction are retired. |
| O6 | Zol's emblem leader is `zin_zol_will` everywhere (the character id `zin_zol` is retired). |
| O7 | Where the characters spec and a Ready tree or mechanic name the same figure differently, the Ready tree or mechanic wins and the characters spec follows: Volgan's lieutenants are the Ember Herald, the Grave-Warden and Ghorvak; Mirolon's ruler is Maeric; the Council's seats are Ilvane (High Confessor), Corvel and Sevrin. |
| O8 | Mirolon is not a Lost Cause member at the start: Parim laughed at its envoy (Mirolon tree); the Aenor spec drops the honorary membership. |
| O9 | The Narrow Strait: when Aenor's defensive war has many attackers the treaty is called once; scripted western sailings ignore the strait's closure; closing the strait needs only Lerendor's own shore, while the "strait barred" hook and the "master of the strait" ending need R'en's coast too. |

### Art and sound

| # | Decision |
| --- | --- |
| A8 | Every art module writes its own `art/source/<module>_manifest.json` beside the shared provenance log. |
| A9 | Music and sound are synthesised in code by the builder from ZIN-written scores and sound recipes (no samples, no library or AI audio); vanilla audio stays until ZIN tracks are accepted (proposed; owner question). |

### Validation

| # | Decision |
| --- | --- |
| S8a | S8 is amended: every Linux acceptance run unpauses the clock. Phases 1 and 2 run at least 10 minutes at top speed and never under 60 game days; from phase 3 on, one in-game year. Start-only runs missed the flag-sheet crash of October 2026 ([09_validation/01_acceptance.md](09_validation/01_acceptance.md)). |
| S12 | The country tag total stays below 439 (vanilla's own count): ZIN tags first, then the 75 dynamic tags. A politics test fails above it ([01_map/03_known_issues.md](01_map/03_known_issues.md)). |

### Names and figures (continued)

| # | Decision |
| --- | --- |
| N12 | One exposure flag: `zin_golden_king_plot_exposed` (`zin_afrit_regicide_exposed` retired); one exposure path, `zin_aenor_expose_plot`. |
| N13 | The Afrit spec owns the Council's people (O7): Ilvane (High Confessor), Corvel and Sevrin hold the seats; Kessarion heads Corvel's eastern branch and Ossar is the Reliquary's scholar under Sevrin, both as lesser characters; Sevrin is an advisor. The characters spec follows (it had retired `zin_kessarion` and `zin_ossar`; they stay). |
| N14 | The Deliverer's Faithful are Light (`zin_light_sanctuary`) until `zin_afrit_revealed`, Shadow after. The crowned Aenor of the Faithful is Light until the reveal, never `zin_dom_divine` before it (foundation 02 follows). |
| N15 | The Golden King dies only when both the Council's `zin_afrit_regicide_ready` and Aenor's clock allow; the rule `zin_rule_golden_king_death` has the options `DYNAMIC`, `HISTORICAL`, `DELAYED`, `NO_AI_PLOT`. `zin_reign.19` fires one day before the scheduled death. |
| N16 | Retired names are replaced everywhere: `zin_afrit_name` by `zin_loc_deliverer`, `zin_afrit_is_secret` by `zin_afrit_secret_kept`, "the Hierarch" by "the High Confessor", and every other name in the retired list of [04_mechanics/00_contract_additions.md](04_mechanics/00_contract_additions.md). `tools/content/checks/names.mjs` fails a build that uses a retired name. |

### Stage 2 integration (19 October 2026)

The stage-2 slices (technologies, economy, diplomacy, institutions, warfare, cultures, text sweep, interface reskin) were wired into `tools/content/build.mjs` in one pass. `currentStage` stays 1: the stage-2 rows whose folders those slices now replace were pulled forward (their `stage` is 1, as for `common/achievements.txt`), and the rest keep `stage` 2 until their slices land. Notes: `docs/design/stage2/*.md`.

| # | Decision |
| --- | --- |
| I1 | `common/technology_sharing` is the diplomacy slice's (17 groups, one per league template). The technologies slice keeps only the sync effect `zin_tech_sharing_sync`, which adds a member to the group of its template (`buildTechnologies(..., { externalSharing })`); its own 8 groups and their text are not written. |
| I2 | `common/script_enums.txt` and `common/synchronized_dynamic_tokens/zin_tokens.txt` are the economy slice's, built from the equipment staged under `common/units/equipment` (warfare runs first). The build fails when a workshop of the institutions slice names an equipment type that file does not list. |
| I3 | Three rows carry `emptyAllowed` (spec 06 rule 3): `common/factions/upgrades` and `common/factions/upgrades/groups` (the installed files are 0 bytes; the engine builds the levels in) and `common/synchronized_dynamic_tokens` (a bare word list that check C2 cannot count as a keyed definition). |
| I4 | The `silenced.json` entries the slices supersede are removed: `common/buildings`, `military_industrial_organization/organizations`, `operations`, `peace_conference/ai_peace` and `cost_modifiers`, `raids`, `technology_sharing`, and the five `common/units/names*` and `codenames_operatives` folders. The stage-1 `ZIN_HOSTS` stub (`vanilla_silence.mjs`) is gone: `zin_names_divisions.txt` defines the group. `ai_equipment`, `ai_navy/goals`, `ai_navy/taskforce` and `ai_templates` stay silenced until their writer ships. |
| I5 | The stage-1 `AI_FOCUSES` writer of `vanilla_removal.mjs` is removed (the technologies slice writes `common/ai_focuses/zin_ai_focuses.txt` with its own categories). The interim stubs `zin_decisions_interim.txt`, `zin_interim_categories.txt`, `zin_interim_ai_strategy.txt` and `events/zin_world.txt` are removed, because the institutions and economy slices ship real decisions, categories, strategies and events (check C4). |
| I6 | The special-project constant groups are written once, by the institutions slice; the bridge copy in `zin_constants.txt` is gone. |
| I7 | `occupied_countries.2` (called by the diplomacy slice's `resistance_90`) is a permanent hidden event in `events/zin_engine_events.txt`, like `occupied_countries.1`, inert until the occupation slice gives it content. |
| I8 | `zin_rule_skies` (warfare spec section 8, read by the technologies slice) is written by `vanilla_removal.mjs` in its final form (`common/game_rules/zin_war_rules.txt`, `localisation/english/zin_rules_l_english.yml`) until the warfare mechanics module takes both files over; it has no icon (no `GFX_zin_rule_*` sprite exists). The builder stops on the duplicate staged path when that module arrives. |
| I9 | Triggers the diplomacy slice uses and later mechanic slices own (the 12 `zin_is_region_*` state triggers of `sites.mjs`, and the Afrit, Cold Lands, Lerendor, elves and Sun tests) are inert `always = no` triggers in `common/scripted_triggers/zz_zin_pending_triggers.txt`, written only for names no module defines. The build fails when a scripted definition exists in two ZIN files. |
| I10 | The diplomacy slice's text files are `zin_leagues_l_english.yml` (not `zin_diplomacy`): `localisation/replace/zin_<family>_l_<language>.yml` is the text sweep's name for the family `diplomacy`, and the scan (X14) reads that name as the family's file. Its inert balance of power and power-balance modifiers are `zin_court_balance` and `zin_court_power_balance_1..3` (not `zin_interim_*`: a balance has no `allowed` block for check C4 to test). |
| I11 | Defines pulled forward to stage 1 with their slices: the three economy energy rows, `BASE_TECH_COST` and `BASE_YEAR_AHEAD_PENALTY_FACTOR = 2` (the interim 0 row is removed), and `NProduction.LICENSE_IC_COST_YEAR_INCREASE` (institutions). |
| I12 | Check 4 of the interface reskin (reachability) is published (`docs/design/ui/check_report.json`) and not enforced yet: with the slices staged, ZIN script and text name 355 sprites that `reskin.json` files as unreachable (`U`/`H`), some by identifiers that merely equal a sprite name (`weather`, `research`). `lib/ui_plan.mjs` must promote the true ones to `R`; the other eight checks are enforced. Check 3 now ignores `gfx/loadingscreens/` (a folder `presentation.mjs` fills). |
| I13 | The warfare sprites for `convoy`, `train_equipment` and `motorized_equipment` are not redefined: the vanilla `interface/Technologies.gfx` (kept) defines five of them, and a second definition logs a duplicate. |
