# AI defaults

**Status:** Draft. Written 19 October 2026 as the gap spec for inventory row PS-189 and its neighbours. **Priority:** 3. **Phase:** two drops. Drop 1 (phase 3): eras, tiers, diplomacy and peace-keeping defaults, areas, theaters, the shared weights. Drop 2 (stage 2 of the vanilla removal, with [01_warfare.md](../03_gameplay/01_warfare.md) §15): roles, ratios, production, templates, equipment, navies, research postures, plans, doctrines. Observer-run acceptance repeats at phases 3, 5 and 8.

## Purpose

The vanilla AI is more than the focus weights a mod writes. It is a layer of generic strategies, templates, designs, areas and research postures that every country relies on. ZIN replaced the folders that hold that layer (`common/ai_strategy`, `ai_strategy_plans`, `ai_areas`, `ai_focuses`, `ai_faction_theaters`, and at stage 2 `ai_templates`, `ai_equipment`, `ai_navy`, `scorers`). What ships today is an inert stub in each. A country with no generic layer still moves, but it builds the wrong things in the wrong ratios, researches by chance, ignores its neighbours and, in some folders, can crash the game.

This spec writes the generic layer for Erdae. It defines:

- what the AI needs for **every** country, as a list of behaviours with a home file;
- how the behaviours are **generated per people and per tier** from one profile table, not written per country;
- how the layer lives beside the story's strategies without double-counting;
- how its weights are **audited** with the probability tools before any run;
- what a **40-year observer run** must show;
- the **crash-safety** rules for templates, taskforces and areas;
- the builder module that writes it all.

It does not write story strategies (the [historical path](../03_gameplay/06_historical_path_and_ai.md) and the mechanic specs own those), the content of the 25 AI templates (warfare owns that data), or the focus-tree weights (the focus compiler writes those).

## Lore basis

| Fact | Status | Source |
| --- | --- | --- |
| Erdae seems at peace on 1 Thaw 4A 1748; no AI country declares war early | owner-fixed | *The Campaign of 4A 1748*, [01_start_situation.md](../02_lore/01_start_situation.md) |
| The ten peoples differ in war and politics: elves few, patient and long-lived; orcs quarrelsome mass infantry; trolls brutal and poorly led; giants, ents and yeti defensive; the dead raised by mechanics; demons shock troops | established (roles), proposed (temperaments below) | [03_peoples.md](../00_foundation/03_peoples.md) |
| The story ends with Eindil's coronation; the sandbox runs on to 4A 1800 | established, V3 | [06_historical_path_and_ai.md](../03_gameplay/06_historical_path_and_ai.md), [05_world_tension_and_endings.md](../03_gameplay/05_world_tension_and_endings.md) |
| Zol has no body and acts only through its mechanic; no AI rule here targets or names it | established | *Zol*, [zols_mistake.md](../04_mechanics/zols_mistake.md) |
| Every temperament, number, era, band, check and file below | **proposed** | this spec |

The generic AI never closes an open question: it chooses no ruler for Zol's Mistake, settles no fate for Volgan's spirit, and reveals nothing about Afrit.

## Decisions applied and requests to other specs

Applied: D6 (Dominion and Shadow justify at 0.25 tension), D8 (*Pacify the Bloody Forest* has weight 0 before the King's death), E2 (timeouts take the first option), R1 (per-power rules begin with `DEFAULT`), R6 (an actor's owning spec wins on timing and weights), S2, S12, and the vanilla-removal rules 3 (no empty replaced folder), 5 (replacements are ZIN content; identifier-only copies of engine keys) and 7 (reference scan).

This spec asks the integrator to change other specs (also in the report):

1. **Warfare §15.2** names `warfare.mjs` as the writer of `zin_ai_templates.txt`, `zin_ai_equipment.txt`, `zin_fleet.txt`, `zin_goals.txt` and `zin_taskforce.txt`. Proposal: warfare keeps the **data** (`templates.json`, `naval.json`); `modules/ai_defaults.mjs` writes the files, so the crash-safety coverage check sits with the writer. The role tokens of section 4.5 replace the free words in warfare's AI table (cavalry becomes `mobile`, artillery `siege_role`, special forces `rangers_role`).
2. **Countries spec** (`zin_peace_<tag>`, [04_countries_and_states.md](../00_foundation/04_countries_and_states.md)) aborts only when `zin_golden_king_dead` is set. If the King lives (`zin_golden_king_survives`, N15's `NO_AI_PLOT`), the peace gate would stand for ever and the sandbox would never move. Proposal: abort also when the global variable `zin_path_cp05` is above 0.
3. **Western Crossing spec** defines the AI area `zin_area_middle_lands` in `common/ai_areas/zin_west.txt`. Proposal: this spec defines all thirteen region areas (including that one, same membership rule) in `zin_regions.txt`; the Western Crossing spec drops its own area block and keeps its strategies.
4. **Vanilla removal** (`vanilla_removal.mjs`) writes the theaters and the `world.txt` area. Proposal: this module takes both over from one region table.
5. **Historical path** removes the interim AI stubs when it ships. Proposal: whichever of the two modules first ships a non-stub file in a folder retires that folder's stub (check C4's owner list names both).

## Design

### 1. What disappears

Counts are from the inventory (PS rows, WE rows) and the installed game (measured 19 October 2026).

| Folder | Vanilla | What it did for every country | ZIN home |
| --- | --- | --- | --- |
| `common/ai_strategy` | 49 files, 925 blocks. `default.txt`: 74 blocks (the inventory says 73) with 42 `role_ratio`, 34 `unit_ratio`, 15 `template_prio`, 12 `area_priority`, 10 `equipment_production_factor`, 15 market sale thresholds, intelligence and faction blocks. `doctrines.txt`: 32 blocks (17 `force_concentration_factor`, 15 `role_ratio`, 9 `unit_ratio`), dated from 1938. `generic_operation_strats.txt`, `operatives_default.txt` | Role and unit ratios, template priority, equipment production and surplus, the equipment market, area priority, stockpile, pp spending, agency upgrades, faction initiative, scientist recruitment | `zin_default_*.txt` (this spec); story files belong to other specs (2.1) |
| `common/ai_strategy_plans` | 128 files, 376 plans (per vanilla country) | Focus order, research bias, advisor bias | `zin_default_plans.txt` (this spec) for the generic; `zin_<tree>_historical.txt` by the path spec |
| `common/ai_templates` | 16 files, 64 templates | Which divisions the AI designs per role | `zin_ai_templates.txt` (written here from warfare's data) |
| `common/ai_equipment` | 23 files, 1,871 blocks | Which tank, plane and ship variants it designs | `zin_ai_equipment.txt` (hulls only) |
| `common/ai_navy/fleet`, `goals`, `taskforce` | 26 files | Fleet and task force shapes; naval goals | `zin_fleet.txt`, `zin_goals.txt`, `zin_taskforce.txt` |
| `common/ai_areas` | `default.txt`, 56 areas | Front planning | `zin_regions.txt` |
| `common/ai_faction_theaters` | 30 theaters | Theater planning for faction leaders | `zin_theaters.txt`, `zz_zin_bridge_theaters.txt` |
| `common/ai_focuses` | 8 files, 72 blocks | The nine research postures (keys the engine and continuous focuses read) | `zin_ai_focuses.txt` |
| `common/scorers/country` | 4 files, 31 blocks | AI targeting of agents and operations | the diplomacy spec overrides the four files; this spec's check verifies them |
| `common/peace_conference/ai_peace` | 15 files, 158 blocks | What the AI demands in a peace | diplomacy spec (`zin_peace.txt`) |
| `common/mtth` | one vanilla file | Shared weights | `zin_mtth.txt` (path spec), `zin_ai_mtth.txt` (this spec) |
| kept, engine-referenced | `ai_attitudes.txt` (`attitude_neutral`), `ai_personalities.txt` (`ai_balanced`), the `NAI` and `NAITheatre` defines (956) | — | unchanged |

Today's files in the mod: `zin_interim_ai_strategy.txt` (inert), `world.txt` and `zin_interim_plan.txt`, `zin_ai_focuses.txt` (vanilla research categories, rewritten at stage 2), `zin_theaters.txt` and `zz_zin_bridge_theaters.txt`, `zin_mtth.txt`, and silenced single-country files in the stage-2 folders.

### 2. Layers and ownership

#### 2.1 Who writes which strategy file

All files sit in `common/ai_strategy/`.

| Layer | Files | Owner | Contribution |
| --- | --- | --- | --- |
| L0 | engine `NAI` defines | engine | The base behaviour |
| **L1 defaults** | `zin_default_land.txt`, `zin_default_production.txt`, `zin_default_navy.txt`, `zin_default_diplomacy.txt`, `zin_default_doctrines.txt`, `zin_default_court.txt` | **this spec** | What every country does when no story rule applies |
| L2 peace gates | `zin_start_peace.txt` ([01_start_situation.md](../02_lore/01_start_situation.md)), `zin_peace.txt` (`zin_peace_<tag>`, countries spec), `zin_war.txt` (warfare: army size before 4A 1749) | those specs | Keep the peaceful start |
| L3 world | `zin_world_magic.txt` (storm seas), the tension rules of [05_world_tension_and_endings.md](../03_gameplay/05_world_tension_and_endings.md) | world spec | Dark-tier effects |
| L4 systems | `zin_economy.txt`, `zin_diplomacy.txt` | economy, diplomacy | Building priorities for granaries; faction friendships |
| L5 story | `zin_path.txt`, `zin_west.txt`, tree-declared `zin_<tree>.txt`, `zin_<tree>_historical.txt` plans | path spec, mechanics, focus compiler | War direction, historical focuses |

**Yielding.** L1 may never fight a higher layer. Three rules, enforced by the stacking check (AIC10):

1. **Magnitude.** Every L1 diplomacy value (`conquer`, `befriend`, `antagonize`, `alliance`, `protect`, `support`, `consider_weak`, `prepare_for_war`, `avoid_starting_wars`) has magnitude at most 100. L2 gates are −1000 or +400; L5 story values are 150 to 800.
2. **Gating.** Every L1 block that can raise the chance of war has `enable` containing an era trigger (2.3), and its `abort_when_not_enabled = yes`. An L1 block cannot be on in the peace era.
3. **Ledger.** The builder keeps one table (`stack` in `profiles.json`) of every (type, id) the L1 layer touches, with the largest sum any single country can reach from L1 alone. The check adds the L2 to L5 blocks it can read from the staged files, conservatively assuming every block with the same (type, id) is on at once, and fails when a sum exceeds the per-type cap (diplomacy 1,000; ratios and production 300; areas 150).

#### 2.2 Tiers

The country tier is the focus coverage tier ([01_tiers_and_coverage.md](../05_focus_trees/01_tiers_and_coverage.md)): **A** 13 countries, **B** 71, **C** 221. The 75 dynamic tags are tier C. The generated scripted triggers `zin_ai_is_tier_a`, `zin_ai_is_tier_b`, `zin_ai_is_tier_c` (in `common/scripted_triggers/zin_ai_tiers.txt`) are `OR` lists of `original_tag` built from the roster by country name; tier C is the negation of A and B, so dynamic tags are covered. A tier is read only by L1 blocks. Tier A countries also get their mechanic's and tree's AI; L1 fills what those leave open.

Not to be confused with the **dark tier** (1 to 4) of the Gathering Dark meter. This spec says "tier" for A/B/C and "dark tier" for the meter.

#### 2.3 Eras

The generic layer follows four eras, each a scripted trigger in `common/scripted_triggers/zin_ai_eras.txt` (global state only, so every country sees the same era):

| Era | Trigger | What the generic layer does |
| --- | --- | --- |
| `zin_ai_era_peace` | `check_variable = { global.zin_path_cp05 = 0 }` (the Golden King's checkpoint is still pending) | Nothing that raises war. Builds to the start army plus 10%. Develops, researches, trades |
| `zin_ai_era_stirring` | `check_variable = { global.zin_path_cp05 > 0 }` and no `zin_war_of_last_crowns` | Border feuds only: rivals (4.6) at low values; tier C avoids starting wars |
| `zin_ai_era_war` | `zin_war_of_last_crowns` set and no `zin_ending_reached` | The story owns every great war. Generic: defence, factions, no land grabs by tier A |
| `zin_ai_era_after` | `zin_ending_reached` set | The sandbox: ambition returns with brakes (4.6) |

`zin_path_cp05` is the path spec's global variable. On the historical path the Golden King's death resolves it (target 10 Mistfall 4A 1750); under any rule its latest date (1 Deepwinter 4A 1753, moved by the story pace) resolves it as diverged, so the peace era always ends and the sandbox cannot be stuck in peace.

### 3. The profile model

One data file, `tools/content/data/ai/profiles.json`, holds the whole layer. The builder expands it into game files.

**Axes.** A profile row is picked by (people, tier). Country-level facts (coast, size, region, rivals) refine it at build time. Eras and dark tiers switch blocks on through `enable`, not through different rows.

**Temperament** (design targets, 0 to 100): ambition (how readily it picks a war), caution (how hard it avoids losing one), sea drive, scholar drive.

| People | Ambition | Caution | Sea | Scholar | Character |
| --- | ---: | ---: | ---: | ---: | --- |
| men | 50 | 50 | by coast | 50 | Adaptable; regional tradition shifts it (Noris and Gunwaith 60, Stabilo 40) |
| elves | 20 | 80 | 30 | 80 | Patient; defend; slow to act |
| sun_elves | 10 | 90 | 10 | 60 | Reluctant; join defensive wars only |
| orcs | 80 | 25 | 15 | 25 | Quarrelsome; raid; build forges first |
| trolls | 75 | 15 | 5 | 10 | Brutal; poor planners |
| giants | 25 | 70 | 5 | 20 | Hold their mountains |
| ents | 10 | 90 | 0 | 30 | Hold their forests |
| yeti | 30 | 70 | 5 | 15 | Winter defenders |
| demons | 75 | 40 | 10 | 40 | Shock realms |
| the_dead (Volgan, Zol) | 0 | 40 | 0 | 0 | Their mechanics own all intent; defaults only keep their economy and fronts sane |

Temperament enters game files three ways: as `common/mtth/zin_ai_mtth.txt` entries (`zin_ai_ambition`, `zin_ai_caution`, `zin_ai_sea_drive`, `zin_ai_scholar_drive`: a `base` per people and tier plus modifiers for stability, war weariness and the dark tier) that decisions and focuses inject through `mtth:`; as strategy values in L1 blocks (section 4); and as `ai_focus_*_factor` modifiers on the people ideas (4.5). Weights are never copied into long ladders: shared ladders live in MTTH ([hoi4-mtth skill](../../../.claude/skills/hoi4-mtth/SKILL.md)).

**Tier deltas.**

| Tier | Ambition | Garrison share | Research breadth | Navy | Templates |
| --- | ---: | ---: | --- | --- | --- |
| A | × 1.0 (the mechanic and tree decide) | +0 | every folder the people sees | per region, by sea drive | every template of the people |
| B | × 1.0 | +5 | its people's two main folders, then the rest | galleys; warships only with a deep-water hull technology and 3 or more harbours | all but the story templates |
| C | × 0.6 | +10 | arms first, one specialty, then the rest | galleys and cogs only | the line host, levy garrison, riders, sea soldiers and the people's special unit |

### 4. The behaviours

#### 4.1 Land: roles, ratios, templates

The roles are the tokens `ai_templates` define and `role_ratio` targets. ZIN uses seven: `infantry`, `garrison`, `mobile` (cavalry and riders), `armor` (knights and the great kin), `siege_role` (catapults, trebuchets, hurlers), `marines` (sea soldiers) and `rangers_role` (rangers, hill companies, valley wardens). `infantry`, `garrison`, `armor`, `marines` and `rangers_role` are tokens the vanilla files already use; `mobile` is a vanilla token; `siege_role` is new (*proposed*).

**Base ratios by people** (weights; the first Linux run calibrates the scale, probe AI-P1):

| People | infantry | garrison | mobile | armor | siege_role | marines | rangers_role |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| men | 55 | 10 | 15 | 10 | 10 | coast 5 | by technology 5 |
| elves | 60 | 0 | 25 | 0 | 15 | 0 | 5 |
| sun_elves | 100 | 0 | 0 | 0 | 0 | 0 | 0 |
| orcs | 70 | 0 | 15 | 10 | 5 | 0 | 0 |
| trolls | 30 | 0 | 0 | 70 | 0 | 0 | 0 |
| giants | 40 | 0 | 0 | 45 | 15 | 0 | 0 |
| ents | 40 | 0 | 0 | 60 | 0 | 0 | 0 |
| yeti | 100 | 0 | 0 | 0 | 0 | 0 | 0 |
| demons | 100 | 0 | 0 | 0 | 0 | 0 | 0 |
| the_dead: Volgan | 50 | 0 | 10 | 25 | 15 | 0 | 0 |
| the_dead: Zol | 100 | 0 | 0 | 0 | 0 | 0 | 0 |

The men, elves, orcs, Volgan and Zol rows are warfare's ([01_warfare.md](../03_gameplay/01_warfare.md) AI, "Role ratios"); the other rows are this spec's. Tier deltas add to `garrison` and subtract proportionally from `infantry`. A row is written as `role_ratio` strategies per (people, tier) with `enable = { zin_people_is_<key> = yes }` and `allowed = { zin_ai_is_tier_<t> = yes }`-equivalent tag lists.

**Template priority.** `template_prio` follows the technology eras of warfare §11: until the first heavy-infantry technology, `infantry` and `garrison` only; with heavy infantry and knights, `armor` rises; sea soldiers gate on harbours. No block names a date before 1748.

**Templates per people and tier.** The 25 templates of warfare's AI table are the content. This module writes the role-level entries:

- one role-level entry per (people, role); `available_for` is the list of tags of that people (exactly one of `available_for` and `blocked_for`, never neither, never both); a country belongs to the entry of its **primary** people only, so no country has two entries for a role;
- a minor people's special unit (goblins, ogres) is a target template of the primary people's `infantry` or `armor` role with an `enable` on `zin_people_includes_<key>`, so mixed lands (Volgan's orcs and ogres) do not need a second role entry;
- the tier changes `upgrade_prio` (a tier C country spends experience on the line host first), `reinforce_prio` (garrisons 0, elite 2) and the `enable` of the heavier targets, not the composition;
- a replace-with chain per role: the line host (6 line infantry, 2 archers) is the first target; heavy hosts and warded hosts follow on technology (`target_min_match` holds the AI at a step until its technology arrives);
- the story templates of warfare §4.9a (Grave Host, Presence, the Host of Eindil, the Abyss Host) are never targets of the generic layer.

**Division count.** The engine's wanted-division count stays; L1 sets only `garrison_reinforcement_priority`, `garrison` share and `ai_wanted_divisions_factor` (a token the vanilla files use; not in the documentation list, so AIC7 verifies it by parsing the installed vanilla usage). Warfare §13.2 sets the start count (`clamp(1 + round(states × 0.6), 1, 18)`, tier B × 1.25).

#### 4.2 Production and equipment

The Erdae economy keeps the engine's building and equipment keys (economy §Buildings): workshops are `industrial_complex`, armouries `arms_factory`, shipwrights `dockyard`.

| Behaviour | Strategy tokens | Rule |
| --- | --- | --- |
| Factory mix | `added_military_to_civilian_factory_ratio`, `dockyard_to_military_factory_ratio` | By people: men 0.5, elves 0.3, sun_elves 0.2, orcs 1.5, trolls/giants/ents/yeti 0.2, demons 0.8, the dead 1.0; times 1.5 in the war and after eras when at war; dockyards by sea drive |
| Which arms | `equipment_variant_production_factor` per archetype | Men: arms 100, bows 40, armour 25, mounts 30, catapults 15, trebuchets 5; elves: elven arms 100, mounts 30, wards 10; orcs: arms 100, bows 30, mounts 20, catapults 10; trolls, giants, ents, yeti, ogres, demons: their own gear 100 (grave and nether arms only for Volgan and demons); every people: camp gear to the support need. Granted equipment (Zol, Glo, dragons) is never produced |
| How many | `equipment_production_factor` by equipment type (`infantry`, `support`, `artillery`, `anti_tank`, `anti_air`, `motorized`, `convoy`, ship types) | 50 to 100 by era; 0 for `anti_air` when `zin_rule_skies` is `none` |
| Minimum lines | `equipment_production_min_factories_archetype` | `motorized_equipment` (pack trains) 1 workshop line from 12 armouries; `train_equipment` 1 line; `convoy` 1 line for coastal realms |
| Surplus | `equipment_production_surplus_management` | Arms, bows, camp gear high; siege low; wards only with the ward technology |
| Stockpile | `equipment_stockpile_surplus_ratio` | A modest buffer (the vanilla block applies from 150 divisions, which no ZIN country reaches; ZIN applies it from 30) |
| Fairs (the market) | `equipment_market_for_sale_threshold`, `_min_for_sale`, `_for_sale_factor`, `_buying_threshold` | Sell arms, bows and camp gear surplus; never sell wards, grave arms, nether arms or granted gear; buy pack trains and cogs when short. Only if the economy spec keeps the market |
| Political power | `pp_spend_amount`, `pp_spend_priority` | Keep PP for ideas and decisions in peace; save for admirals only for sea drive 50 or more |

Resource scarcity is the engine's: the AI sees Iron, Timber, Horses, Stone, Gold and Essence as its resources and trades for them; nothing here asks it to hoard Grain.

#### 4.3 Doctrines

The 32 vanilla blocks tie ratio changes to doctrines. ZIN writes 15 blocks, one per grand doctrine of warfare §12 (10 land, 3 naval, 2 air), keyed by `has_doctrine`, plus 4 blocks for completed tracks (`zin_track_foot`, `siege`, `mounted`, `command`) through `has_completed_track`, and `force_concentration_factor` by command doctrine. Example intent: *The Great Muster* raises `infantry` and `garrison` and lowers `armor`; *Horse and Lance* raises `mobile` and `armor`; *The Old Ways* raises archers' share by raising `infantry` and `siege_role` (ballistae); *Blood and Warband* raises `armor` for orcs and trolls. `ai_will_do` per doctrine is warfare's (10 for a people's starting doctrine, 1 for others, 0 unavailable).

#### 4.4 Navy and dragons

The files `zin_fleet.txt`, `zin_goals.txt` and `zin_taskforce.txt` follow warfare §7. This module fixes the AI roles and rules.

- **Roles** (from `zin_ai_equipment.txt`, generated): `naval_screen` (galley), `naval_capital` (warship, great warship), `naval_raider` (corsair, black ship). Convoys use `unit_ratio id = convoy`.
- **Unit ratios** by sea drive: sea power (Lerendor, the Triton's Islands realms, Gala): screen 40, capital 30, raider 10, convoy 20; coastal land power: screen 70, capital 0, raider 0, convoy 30; Zol builds none (its three corsairs are scripted); landlocked: none.
- **Designs** (`ai_equipment`): one default design per hull and people that may build it: galley (oars and rowers' benches, ram), warship (sails, ballista battery, planking), great warship (flagship fittings), raider. Elves take elven sails; Zol's black sails are granted, never designed. `allowed_modules` list only the modules of warfare §7.2.
- **Task forces** (`zin_taskforce.txt`): patrol compositions for screens (min 2, optimum 6 galleys), a battle line (optimum 4 warships), a raider pack (3 corsairs), a convoy escort. `ai_will_do` of 0 disables a template. Fleets (`zin_fleet.txt`) require the task forces above.
- **Goals** (`zin_goals.txt`): one goal per objective type that Erdae uses: `convoy_protection`, `convoy_raiding` (raiders), `coast_defense`, `naval_invasion_support`, `naval_invasion_defense`. A West Lands naval invasion of Aenor stays invalid without the deep-water hull technology (warfare acceptance 10).
- **Strategies**: `naval_avoid_region` for the storm seas is the world spec's; this module adds `strike_force_home_base` to each sea power's chief harbour region and `coast_defense` for coastal tier C.
- **Dragons.** They cannot be produced, so L1 sets `unit_ratio cas` to 0 and the research posture `ai_focus_aviation` and `ai_focus_naval_air` to their disabled values. Their use is the engine's air AI over granted wings (close support in owned and bordering states), and the magic spec's pact decisions. Eyries: a realm with a dragon wing builds one `air_base` in its capital or a border state (`building_target` 1); no other `air_base` is wanted. Under `zin_rule_skies = beasts`, men with eyries keep griffins at 10% of military production in war, 0 in peace (warfare AI).

#### 4.5 Research

Research is steered by the **nine postures** the engine reads. All nine are defined in `zin_ai_focuses.txt` with the ZIN categories of warfare §11 (`zin_cat_arms`, `_bows`, `_armour`, `_mounts`, `_kin`, `_siege`, `_walls`, `_wards`, `_dark_rites`, `_camp`, `_galleys`, `_warships`, `_skies`, plus `industry` and `construction_tech`). Weights are targets:

| Posture | Weights |
| --- | --- |
| `ai_focus_defense` | walls 8, armour 4, siege 3, camp 3, construction_tech 3 |
| `ai_focus_aggressive` | arms 6, mounts 6, kin 5, siege 4, armour 3 |
| `ai_focus_war_production` | industry 10, construction_tech 3, arms 3 |
| `ai_focus_military_equipment` | arms 50, bows 25, armour 15, mounts 12, camp 7 |
| `ai_focus_military_advancements` | land doctrines 100, wards 10, siege 6 |
| `ai_focus_peaceful` | industry 15, construction_tech 6, camp 4, lore 3 |
| `ai_focus_naval` | galleys 8, warships 6, naval doctrine 100 |
| `ai_focus_naval_air` | skies 0 (carriers do not exist) |
| `ai_focus_aviation` | skies 5 (only under dragons) |

**People shifts** use the country modifiers `ai_focus_<posture>_factor`, put on the people ideas by the peoples module (each key exists in the installed `modifiers_documentation.md`; the builder verifies): elves peaceful +0.3 and military advancements +0.2 (scholars); orcs aggressive +0.5 and war production +0.3; trolls aggressive +0.4; giants, ents and yeti defense +0.4; sun_elves peaceful +0.5; demons aggressive +0.3; men none. A scholar drive of 60 or more adds `research` weights in the people's plan (below).

**Plans.** `zin_default_plans.txt` writes one plan per (people, tier) present in the roster (about 25): `research` category multipliers, `ideas` preferences for advisors by trait, `weight = 1.0`, `enable` on the people trigger. They carry no `ai_national_focuses`; focus order is the tree's `ai_will_do` and the path spec's plans.

**Technology weights.** `ai_will_do` and `ai_research_weights` on each technology are warfare's. This module audits them (section 6).

#### 4.6 Expansion and peace-keeping

Expansion is the one place a generic layer can wreck the story, so it is built in bands.

**Rivals.** `tools/content/ai/rivals.mjs` builds `data/ai/rivals.json` from the country table and the map: for each country up to three **rivals**, scored by shared border length, a different people (+30), a different ideology stance (+10), a negative start opinion (+20), a claim or core (+30), and minus 100 for the same faction, a subject relation or a charter bond. Never rivals: Zol, Volgan (as target of generic expansion), the Worshipdom and Yeldenne, and any tier A country as the target of a tier C country. The list is deterministic and reviewed with the demography report.

| Era | Rule (strategies enabled by `enable` on the era trigger and the dark tier; values at most 100) |
| --- | --- |
| peace | None. Peace gates of L2 apply; L1 adds `send_volunteers_desire` −100 and nothing else |
| stirring | Rival 1: `conquer` = ambition × 0.5 (so men 25, orcs 40, elves 10) from dark tier 2; `antagonize` 20; tier C: `avoid_starting_wars` 150 |
| war | Tier A: nothing (the path and mechanics own the wars). Tiers B and C: `alliance` and `befriend` 50 toward faction partners; `dont_join_wars_with` 100 between members and their faction's enemies; `conquer` 0 |
| after | Rival 1: `conquer` = ambition (capped 100); rival 2: half; `consider_weak` 20 on rival 1; `prepare_for_war` 50 on rival 1 when ambition is 60 or more; caution reduces all by `caution × 0.3` |

**Brakes in the after era.** `avoid_starting_wars` 200 while `has_war = yes` and stability is below 40; the engine's war support and manpower do the rest. A war against a rival stops (value 0) when the rival becomes a faction mate or subject. **Peace.** The AI's peace demands are the diplomacy spec's (`zin_peace.txt` in `ai_peace`); this spec requires only that every AI at war accepts a white peace after 1,095 days without a front change (`pp_spend` is not used for this; the rule lives in the peace desires as a diplomacy request, listed in section 9).

**Factions and diplomacy defaults** (`zin_default_diplomacy.txt`): `diplo_action_desire` and `diplo_action_acceptance` for `improve_relation`, `guarantee`, `military_access`, `join_allies`, `call_allies`, `market_access_rights` (only if the market stays): same people +50, same region +25, shared rival +40, a dark power −100; `spent_faction_initiative_priority` for `program`, `unlock_doctrine_sharing` and `unlock_faction_commander` as the diplomacy spec names them; `pp_spend_priority` `become_faction_leader` for tier A only. Faction creation, joining and rules are the diplomacy spec's templates and `ai_will_do`.

#### 4.7 Build orders

| Behaviour | Tokens | Rule |
| --- | --- | --- |
| Economy first | `build_building` weights | Workshops, then armouries (ratio of 4.2), roads (`infrastructure`) where supply is short, harbours for coastal realms |
| Forts | `building_target` `bunker` (Stone Fort), `coastal_bunker`, `stronghold_network` | Tier A: wall and border states of dark neighbours; from dark tier 3, +50% for realms bordering a dark power (the world spec's rule); tier C: capital state one level |
| Granaries | owned by the economy spec (`energy_infrastructure`) | — |
| Eyries | 4.4 | — |
| Never | nuclear, rocket, radar, mega-gun, refinery, facility buildings | Not defined, so not wanted |

#### 4.8 Areas and theaters

`zin_regions.txt` defines thirteen areas, one per roster region: `zin_area_middle_lands`, `aenor_isle`, `north_lands`, `cold_lands`, `west_lands`, `tritons_islands`, `dark_lands`, `magical_lands`, `ocean_of_zol`, `dead_lands`, `east_lands`, `islands_of_the_south`, `lands_of_the_sun` (prefix `zin_area_`). Membership is the land (or sea, for the Ocean of Zol) strategic regions that hold states of the region, read from `sites_resolved.json` of the key-sites table, so the file regenerates when the map does. Every strategic region belongs to at least one area; `world.txt` (one area of everything) stays as the catch-all. Default `area_priority`: own region 100, a bordering region 50, any other 20; tier C countries cap at their own region plus bordering ones. Theaters: one per region plus the bridge theaters, from the same table, `ai_will_do` base 1, `cancel` when the faction has no war.

#### 4.9 Court intrigue and scholars

The diplomacy spec keeps agencies and operations as court intrigue. `zin_default_court.txt` ports the vanilla intelligence blocks to the ids that spec defines: `intelligence_agency_usable_factories` from a minimum of workshops, branch desires in the order the spec sets, `become_spymaster` for tier A, `operative_mission` and `operative_operation` weights from `data/ai/operations.json` (a map from vanilla operation intent to the diplomacy spec's operations). If the spec removes agencies, the file keeps one inert valid block (rule 3). Scholars: `recruit_scientist` ports only if the economy spec keeps special projects ("great works").

#### 4.10 The sandbox must move

After the ending, the story scripts stop. The generic layer alone keeps the world alive for 40 years (4A 1760 to 4A 1800): rivals make a few wars per decade; the brakes keep them limited; factions form and break by the diplomacy spec; elections and successions are the politics spec's. If the first observer runs show too few or too many wars, the ambition table is the knob; changes are recorded in this spec.

### 5. Crash safety

The inventory records that a missing AI template or taskforce entry crashes the game (rows PS-152, WE-061, WE-165; the wiki). Until a Linux run proves a narrower rule, the builder treats every item below as a crash condition.

| Id | Rule |
| --- | --- |
| AIC1 | **Templates.** For every country (305 roster and 75 dynamic tags) and every role its people can use, exactly one role-level entry applies; `infantry` and `garrison` apply to every country; every entry has exactly one of `available_for` and `blocked_for`; every `target_template` names sub-units that exist, are recruitable by that people, and fit the combat width rules; every division template in any `history/units` file, every story template of warfare §4.9a, and every template a country script creates matches some entry's role |
| AIC2 | **Role and ratio ids.** Every `role_ratio`, `template_prio`, `build_army` id is a defined role; every `unit_ratio` id is a defined sub-unit or equipment type; every `equipment_*` id is a defined type or archetype |
| AIC3 | **Navy.** For every ship type a country can build there is a taskforce template whose `allowed` accepts it and a design in `ai_equipment` (one per hull and people); every fleet template names existing task forces; every goal has a valid `objective_type`; at least one goal per objective type is available to every country. `map/buildings.txt` defines every naval base (map pipeline; this check asserts it is non-empty) |
| AIC4 | **Areas.** Every strategic region is in at least one area; every `area_priority`, `put_unit_buffers` and `naval_dominance` area exists; every theater lists at least one region and its regions are connected |
| AIC5 | **Postures.** All nine `ai_focus_*` keys are defined; every category they name exists in `zin_technology_tags.txt` |
| AIC6 | **Plans.** Every plan's `allowed` tags exist and its `ai_national_focuses` and `focus_factors` name existing focuses of the tree |
| AIC7 | **Tokens.** Every `ai_strategy` `type` is in the token list parsed from the installed `common/ai_strategy/_documentation.md` or in the vanilla-only list parsed from the installed vanilla files; every `id` resolves for its type (tag, building, archetype, area, region, doctrine, tech); no `has_dlc`, no vanilla tag, no date before 1748 |
| AIC8 | **Lifecycle.** Every block has `allowed`, `enable` and either `abort` or `abort_when_not_enabled = yes`; none uses `add_ai_strategy` for a thing that must end |
| AIC9 | **Folders.** Every replaced AI folder ships at least one ZIN file with a valid definition (vanilla-removal rule 3); no interim stub remains once a real file is there (check C4) |
| AIC10 | **Stacking** (2.1) |
| AIC11 | **Names.** Every `mtth:` entry used exists; every scripted trigger used exists; the retired names of the contract register are absent |
| AIC12 | **Scorers and peace.** The four scorer files and `ai_peace` are the diplomacy spec's ZIN files, with no vanilla tag |
| AIC13 | **Determinism.** Two builds give identical bytes |

Live: the Aenor start (R1) and the eight start cases (L1) run ten minutes unpaused at speed 5 with no crash and no AI line in `error.log`. If a crash appears, the stack signature and the last AI state go into the known-issues file and a negative test is added for the input.

### 6. Auditing weights and timing

Every AI weight this spec writes, and every weight a tree or mechanic writes that the generic layer interacts with, is audited **before** a Linux run with the probability tools of the MCP server (offline source models; the AI's runtime inputs are not simulated, so these results are never presented as observed behaviour). The [hoi4-ai-strategies](../../../.claude/skills/hoi4-ai-strategies/SKILL.md) and [hoi4-mtth](../../../.claude/skills/hoi4-mtth/SKILL.md) skills set the reading rules: a weight is not a probability; same-type same-target strategies add; focus draws favour large values.

| Tool call | Adapter | Used for |
| --- | --- | --- |
| `hoi4_probability_inspect` | `ai_strategy_factor` | The value each L1 strategy gives in a named scenario; the sum with higher layers |
| | `national_focus_ai_will_do` | The historical branch beats alternatives under `HISTORICAL`; no focus has zero weight for every route (a stall) |
| | `event_option_ai_chance` | Checkpoint events: the historical option dominates under `HISTORICAL`; a timed-out event takes the first option (E2) |
| | `decision_ai_will_do` | Mechanic decisions are taken at the stated thresholds; no decision is never taken by every AI |
| | `technology_ai_will_do`, `doctrine_ai_will_do` | Each people researches its own folders first; no technology is unreachable for every route |
| | `event_mean_time_to_happen` | The path's `zin_story_mean_time` (base 365) at each pace; flavour events fire at their stated rates |
| | `random_list`, `custom_weighted_pool` | Mechanics that draw among options |
| `hoi4_probability_analyze` | `compare` | Before and after every edit to a weight, on the same named scenarios |
| | `sweep` | Over `global.zin_gathering_dark`, `zin_story_pace`, the game rules and a country's stability, to find where a choice flips |
| | `simulate` | Over declared uncertain inputs (borders, threat) with a seed |
| | `sequence`, `render` | Timing of the monthly runners; images for the phase report |

**Scenario packs.** `tests/ai/<pack>.json` holds the named scenarios: one per (people, tier, era) the roster has (about 30), plus the story cases (the HISTORICAL, PLAUSIBLE and FREE rules at four dates). Each pack has `acceptanceBands`: for example `HISTORICAL` historical option at least 0.95 of the pool; `FREE` no option below 0.05 unless its owner says so; a role ratio target within ±10 points; no L1 diplomacy value above 100. A pack that cannot resolve an input lists it under `unresolved`; unresolved states are not counted as coverage.

**Process.** The author edits the profile table; the builder regenerates; the pack runs `compare` against the last accepted baseline (`tests/ai/baselines/`); a change outside its band fails the build. The phase report lists the changed bands and the reason.

### 7. Observer-run checks

The observer run starts at day 1 with `observe` (the hands-off tag is Verde, `NGame.HANDS_OFF_START_TAG`), the clock unpaused at speed 5, text saves every 365 days, under the rule set named in the case. These are the acceptance cases L5, L6 and L10 of [01_acceptance.md](01_acceptance.md) with AI-specific readings. The 40-year window is 4A 1760 to 4A 1800 of the L10 run (the AI alone, after the story). Saves are read with the [hoi4-save-inspection](../../../.claude/skills/hoi4-save-inspection/SKILL.md) inspector; every figure is extracted per save and tabulated in the phase report.

| Id | Metric | Bound (design targets) |
| --- | --- | --- |
| M1 | Wars | New wars per decade between 4 and 40 in the after era; at most 2 wars per country at once on average; no AI at war for more than 6 years unless a story war (checkpoints 11 to 26); every war ends by peace, capitulation or annexation |
| M2 | Conquests | 1% to 8% of states change owner per decade in the after era; no country holds more than 35% of the land states; at least 80% of the roster countries still exist at 4A 1800; at most 25% annexed |
| M3 | Stability | Roster mean stability at least 45%; no more than 5% of countries below 20% for more than two consecutive saves; at most 6 civil wars per decade |
| M4 | No stall: focuses | At least 90% of AI countries with an eligible focus complete one within every 730-day window |
| M5 | No stall: research | At least 90% of AI countries finish one technology per year |
| M6 | No stall: economy | At most 5% of AI countries hold more than 300 political power at two consecutive saves; at least 95% of countries with a workshop have a production line; at least 90% of countries with manpower hold at least 80% of their wanted divisions |
| M7 | Roles | Each AI country's division roles are within 15 points of its profile (from the save's unit data) |
| M8 | Mechanics | Each tier A power uses its mechanic at least once a year where its spec says the AI acts (acceptance spec, AI) |
| M9 | Peace years | No war begins in the peace era; the first war begins within 400 days after `zin_path_cp05` resolves in the FREE case |
| M10 | Log | `error.log` has no AI, template, taskforce, area or strategy line; no crash; save and load at 4A 1800 |

**Runs.** HISTORICAL, 3 seeds, 4A 1748 to 4A 1761 (M1 to M9 for the story years: wars begin only at the checkpoints). FREE and PLAUSIBLE, 3 seeds each, to 4A 1770. Defaults to 4A 1800 once per release candidate (M1 to M10 over the 40-year window). A failed bound sends the author to the audit packs (section 6) first, then to the profile table, then to a re-run; the table's changes are recorded here.

### 8. Probes (Linux run, results recorded here)

| Id | Question | If it fails |
| --- | --- | --- |
| AI-P1 | What scale do `role_ratio` values have against divisions (the vanilla values are small integers)? | Rescale the table; the metric M7 stays |
| AI-P2 | Does a country with no `ai_templates` entry for its role crash on `hourly_tick`, or only log? | Keep AIC1 as a hard rule either way |
| AI-P3 | Does `original_tag` reach a dynamic tag in `allowed` and `enable`? | Use a scripted trigger over `is_dynamic_country` or the tag list |
| AI-P4 | Do two `add_ai_strategy` of one (type, id) replace or add? | L1 uses `ai_strategy` blocks only; stories keep their own rule |
| AI-P5 | Does a block with `enable` on a global variable re-evaluate daily for every country at acceptable cost? | Use a global flag set once at the checkpoint |

## Implementation

### Builder module

`tools/content/modules/ai_defaults.mjs` (new), called from `build.mjs` after the focus compiler and `historical_path.mjs` (it reads the trees and the checkpoint flags) and before the vanilla-removal bridge scan. It runs in two drops by stage. Supporting files: `tools/content/ai/rivals.mjs` (new), `tools/content/checks/ai_defaults.mjs` (new, AIC1 to AIC13), `tools/content/ai_defaults.test.mjs` (new), `tests/ai/` packs (new).

### Data

| Path | Content | Writer |
| --- | --- | --- |
| `tools/content/data/ai/profiles.json` | Temperament, role ratios, archetype weights, factory ratios, naval ratios, research shifts, tier deltas, the `stack` ledger | authored |
| `tools/content/data/ai/rivals.json` | Up to three rivals per country | `ai/rivals.mjs` (deterministic) |
| `tools/content/data/ai/operations.json` | Intent → ZIN operation map | authored with the diplomacy spec |
| `tools/content/data/warfare/templates.json`, `naval.json` | AI template and hull content | warfare spec (input) |
| `docs/design/countries.csv`, `tools/content/data/countries.json` | People, tier, region, coast, size | existing |
| `sites_resolved.json` of the key-sites table | Region membership of strategic regions | map pipeline (input) |

### Files written

| Path | Drop | Content |
| --- | --- | --- |
| `common/scripted_triggers/zin_ai_tiers.txt`, `zin_ai_eras.txt` | 1 | Tier and era triggers |
| `common/ai_strategy/zin_default_diplomacy.txt` | 1 | Eras, rivals, factions, diplomacy actions |
| `common/ai_areas/zin_regions.txt`; `common/ai_areas/world.txt` stays | 1 | 4.8 |
| `common/ai_faction_theaters/zin_theaters.txt`, `zz_zin_bridge_theaters.txt` | 1 | Taken over from `vanilla_removal.mjs` |
| `common/mtth/zin_ai_mtth.txt` | 1 | Shared temperament weights |
| `common/ai_strategy/zin_default_land.txt`, `zin_default_production.txt`, `zin_default_navy.txt`, `zin_default_doctrines.txt`, `zin_default_court.txt` | 2 | 4.1 to 4.4, 4.9 |
| `common/ai_strategy_plans/zin_default_plans.txt` | 2 | About 25 plans |
| `common/ai_focuses/zin_ai_focuses.txt` | 2 | Nine postures |
| `common/ai_templates/zin_ai_templates.txt`, `common/ai_equipment/zin_ai_equipment.txt`, `common/ai_navy/fleet/zin_fleet.txt`, `goals/zin_goals.txt`, `taskforce/zin_taskforce.txt` | 2 | Written from warfare's data |
| `localisation/english/zin_ai_l_english.yml` | 1 | Theater names (shown in theater planning); written here, not by `vanilla_removal.mjs` |
| `docs/design/ai/ai_report.json` | 1 | Counts per file, per family, the stacking table, the coverage matrix |

The descriptor gets the `replace_path` lines of stage 2 from the vanilla removal data; this module adds none by itself. The interim stubs `zin_interim_ai_strategy.txt` and `zin_interim_plan.txt` leave in the build that ships the first real file of their folder.

### Block counts

Strategy blocks are generated per (people, tier) pair present in the roster, not per country: about 14 families × at most 30 pairs, so at most about 420 blocks, plus 13 areas, 14 theaters, 15 doctrine blocks, 25 plans and 25 templates. The per-country peace blocks (`zin_peace_<tag>`) belong to the countries spec.

### Variables, flags, events, game rules, defines

None of its own beyond the triggers above. It reads `zin_path_cp05`, `zin_war_of_last_crowns`, `zin_ending_reached`, `zin_gathering_dark`, `zin_rule_skies`, `zin_rule_historical_path`. No `NAI` define changes (WE-158 stays engine-generic).

## AI

The whole spec is AI. In short: every country, from the first day, has sensible production, templates, research, navies and areas for its people and tier; it keeps the peaceful start without help from the story files; it expands only against its rivals and only in the right eras; and after the story ends it keeps the world turning for forty years without a stall or a runaway empire.

## Acceptance

1. **Build.** AIC1 to AIC13 pass, each with a negative test: a country with no template for its role, an entry with both `available_for` and `blocked_for`, a taskforce missing for a buildable hull, an area missing a strategic region, a plan naming an unknown focus, an unknown token, a `has_dlc`, a vanilla tag, a block without `abort`, an L1 value above 100, a stacking sum over its cap, a `conquer` toward Zol or the Worshipdom, a missing posture, a retired stub left in place.
2. **Coverage matrix.** A builder test over all 305 roster countries and 75 dynamic tags prints (people × role → entry) and the (hull × people) design table; no cell is empty that the people can use.
3. **Determinism and folders.** Two builds are byte-identical; every replaced AI folder holds a valid ZIN definition (AIC9, AIC13).
4. **Audits.** Every scenario pack in `tests/ai/` passes its bands; the phase report lists the baselines and any changed band.
5. **Start.** The Aenor start and the eight L1 cases run ten minutes at speed 5 (phases 1 and 2) or one in-game year (phase 3 on) without a crash or an AI line in `error.log`.
6. **Observer runs.** M1 to M10 hold in: HISTORICAL × 3 seeds to 4A 1761; FREE and PLAUSIBLE × 3 seeds to 4A 1770; defaults to 4A 1800 on each release candidate. The phase report lists the figures per save.
7. **Peace.** In the peace era no war starts (M9); in a FREE run with the King alive past 1753, the first war begins within 400 days of CP 05 resolving.
8. **Roles.** The roles of fielded divisions in the save are within 15 points of the profile (M7).
9. **Inventory rows closed:** PS-189, PS-148 (generic part), PS-149 (generic plans), PS-150, PS-151, PS-152, WE-061, PS-068, PS-187, WE-100, WE-165, PS-190 (AI stubs), PS-084 (AI entries) — 13 rows. Verified without change: PS-153, PS-103 (diplomacy-owned files), PS-154, PS-155 (peace gate, countries spec), WE-158.

## Open questions

Each proceeds on the proposal. Questions only the owner can answer are listed in [OPEN_QUESTIONS.md](../OPEN_QUESTIONS.md) (marked *owner*).

1. **How warlike should the sandbox be after the ending?** The after-era band (4 to 40 wars per decade; 1% to 8% of states changing hands per decade) is a taste. Proceeds on the bands above (*owner*).
2. **Zol and Volgan in the sandbox.** Generic ambition is 0 for the dead; their mechanics own all intent. If a run shows them idle after the ending, a mechanic spec adds sandbox behaviour; this spec adds none. Proceeds on: yes.
3. **Dynamic tags are tier C** and use the people of their parent. Proceeds on: yes; probe AI-P3 decides the trigger.
4. **The market ("Great Fairs")** strategies apply only if the economy spec keeps it. Proceeds on: kept (economy question 1).
5. **Agencies and scholars** port only if the diplomacy and economy specs keep them. Proceeds on: agencies yes (court intrigue), scholars as the economy spec says.
6. **Template writer.** Warfare keeps data and this module writes files (request 1). Proceeds on: yes.
7. **A white peace after 1,095 days** without a front change is a diplomacy-spec rule (request to that spec). Proceeds on: yes; until then the engine's peace logic runs.

## Names this spec registers

| Name | Kind | Meaning |
| --- | --- | --- |
| `tools/content/modules/ai_defaults.mjs`, `checks/ai_defaults.mjs`, `ai/rivals.mjs`, `ai_defaults.test.mjs` | builder | Module, check, rival builder, tests |
| `tools/content/data/ai/{profiles,rivals,operations}.json` | builder data | Section Implementation |
| `tests/ai/<pack>.json`, `tests/ai/baselines/` | audit data | Scenario packs and baselines |
| `docs/design/ai/ai_report.json` | published data | Counts, stacking table, coverage matrix |
| `zin_ai_is_tier_a`, `zin_ai_is_tier_b`, `zin_ai_is_tier_c` | scripted triggers (country) | Generated `original_tag` lists; tier C is the rest |
| `zin_ai_era_peace`, `zin_ai_era_stirring`, `zin_ai_era_war`, `zin_ai_era_after` | scripted triggers (global state) | The four eras (2.3) |
| `zin_ai_ambition`, `zin_ai_caution`, `zin_ai_sea_drive`, `zin_ai_scholar_drive` | MTTH entries | Temperament weights (`common/mtth/zin_ai_mtth.txt`) |
| `zin_default_<family>_<people>_<tier>` | strategy block | Generated L1 strategies (`land`, `production`, `navy`, `diplomacy`, `doctrines`, `court`) |
| `zin_default_plan_<people>_<tier>` | AI strategy plan | Generic plans |
| `zin_area_middle_lands`, `zin_area_aenor_isle`, `zin_area_north_lands`, `zin_area_cold_lands`, `zin_area_west_lands`, `zin_area_tritons_islands`, `zin_area_dark_lands`, `zin_area_magical_lands`, `zin_area_ocean_of_zol`, `zin_area_dead_lands`, `zin_area_east_lands`, `zin_area_islands_of_the_south`, `zin_area_lands_of_the_sun` | AI areas | One per roster region (`zin_area_middle_lands` is owned here from now; the Western Crossing spec used it) |
| `siege_role` | AI role | Catapults, trebuchets, hurlers (`mobile`, `rangers_role` and the others are existing tokens) |
| `naval_screen`, `naval_capital`, `naval_raider` | AI equipment roles | Galley, warship and great warship, corsair and black ship |
| `AIC1` to `AIC13` | check codes | Section 5 |
| `M1` to `M10` | observer metrics | Section 7 |
| `AI-P1` to `AI-P5` | Linux probes | Section 8 |
