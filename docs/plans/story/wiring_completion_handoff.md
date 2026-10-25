# Story wiring completion: every owner clean, the check enforced

**Date:** 25 October 2026. **Agent:** the story wiring completion agent (subagent of the ZIN lead). **Branch:** `zin/integration-r3`.
**Inputs:** [framework_handoff.md](framework_handoff.md) section 4 (the findings per owner), [war_side_handoff.md](war_side_handoff.md) section 5 (the readers of the retired Zol flags), [afrit_aenor_eindil_handoff.md](afrit_aenor_eindil_handoff.md); design `docs/design/alternate_history.md` and `.json`; canon K1 to K50 of `docs/specs/INTEGRATION_DECISIONS.md`; voice `docs/specs/02_lore/09_voice_and_style.md`.
**Disposition:** implemented with evidence; the enforcement switch is on. Open items are listed under "Simplifications, omissions and blockers".

Every line of event text written here is **proposed** wording in the accepted voice: the specs give the gist and the options of each event, and the canon is silent on the words. The AI weights follow the specs' AI rows; where a spec gives a formula over a variable (the coalition weight, the opinion of the league's lord), the weights are bands of it in the event files' own `numbers` blocks.

## 1. The check, before and after

| | Before (framework handoff) | After |
| --- | --- | --- |
| Fired events with no real definition | 22 | 0 |
| Flags read and never set | 27 | 0 |
| Scripted triggers tested as flags | 3 | 0 |
| Per-power rules tested directly | 4 | 0 |
| Allowed (reported, never failing) | 1 flag in 2 readers | the same: `zin_aenor_regency_endures` (Afrit, Aenor, Eindil) |
| Enforcement | world systems, historical path | `enforceAll: true` in `tools/content/data/story_wiring.json` |

Build line of the final run: `Story wiring: flag_allowed 2; enforced: all; failures 0.`

## 2. Every finding and its resolution

### Events written (19), `modules/events_mech_war.mjs`

The module that already wrote the war-side story events takes five more data files (one per namespace, each to `events/<namespace>_war.txt`, English localisation in `zin_events_mech_war_l_english.yml` like every event module of the builder). It gains two resolvers: `{{elves:..}}`, `{{east:..}}`, `{{dark:..}}` read the mechanics' own numbers, and `{{n:..}}` the event file's `numbers` block. Its picture, text, banned-word, game-font and forbidden-name checks cover the new events.

| Id | Title | To, fired by | Options (AI) | Picture |
| --- | --- | --- | --- | --- |
| `zin_elves.9` | The New King's Customs | wall realms, 4 days after `zin_aurevan_crowned` (elves runner) | Let the Houses build their halls: grievance -15, footholds +1 (30) / The woods keep no temples: grievance +5, calm +2% (70, x1.5 historical) | golden_court |
| `zin_elves.51` | The Wizard Is Gone | Magical Lands elves, `zin_elves_on_varner_dead` | one option | generic_wilds |
| `zin_elves.70` | Sails on the Rift Sea | Magical Lands elves and Aenor, `zin_elves_on_eastern_invasion` | elves and Aenor each have their own text and option | generic_sea |
| `zin_elves.71` | Elven Envoys at the Gate | Aenor and Kingson, 3 days after the invasion | Keep the gates shut (70) / Offer them companies of ours (30): the Magical Forest gets `zin_elves.72` once (new global flag `zin_elves_companies_offered`) | generic_court |
| `zin_east.41` | (hidden) The Coalition Gathers | the East's runner | `zin_east_form_coalition` | none |
| `zin_east.42` | The Eastern Coalition Asks | the leader if human, courts of weight 50 or more | join / stay out; the AI joins at its weight (bands of 10 from 50 to 90; the pair always sums to 100) | generic_court |
| `zin_east.43` | The Crossing of the Rift | news, once | one option | generic_sea (news) |
| `zin_east.44` | The Host Turns West | news, once | one option | generic_war (news) |
| `zin_east.45` | The Coalition Breaks | members that refused the King, or all members (Break the Coalition) | make peace (70) / fight on (30); text by whether the King of the East reigns | generic_peace |
| `zin_east.46` | Abandoned Companies | eastern courts at war in the west when the stranger returns | serve the stranger (60 if it refused the King, else 10) / order them home | generic_war |
| `zin_east.50` | A King in the East | courts not asked to kneel | gifts (bias 30 or more) / refuse (beside a refusing faction leader) / say nothing (otherwise) | generic_court |
| `zin_east.51` | First of the Free Crowns | the First of the Free Crowns (resist focus or the 60-day pick) | one option; the rally decision opens with the flag | generic_court |
| `zin_east.52` | The King Calls His Host | the King's clients when he returns | levies (60) / gold (30) / delay (10) | generic_war |
| `zin_east.60` | The King of the East Is Fallen | every East Lands court, `zin_east_after_the_king` | one option, text and option by status (client, refuser, other) | generic_court |
| `zin_dark.80` | Dead on the Dark Shore | Dark Lands shores of the northern strait and the Kusmeel, on the rising | Watch the shore: Watch on the Shore 365 days (70) / The dead are the North's trouble: +25 authority (30) | zol_rising (gate required) |
| `zin_dark.82` | The South Falls Silent | Dark Lands countries that were sworn, when Volgan's body breaks | Make our own peace: white peace with Goldoroth and every Accord realm at war with it (70) / Fight on (30) | volgan_broken (gate required) |
| `zin_diplo.23` | A Seat in the Lost Cause | the honorary-crown invitation from the league's lord (FROM; today Parim's answer `zin_dark.30`) | accept: `zin_lost_cause_member`, the existing opinion `zin_aenor_opinion_honorary_crown` toward the lord / decline; AI by the spec's formula (-20, +20 at Gathering Dark 25, +30 beside a dark power, opinion of the lord / 4 in bands), the pair sums to 100 | lost_cause_triumph |
| `zin_diplo.31` | The Refusal Taken Up Again | a realm to itself after it clears `zin_refusal_lifted` (Gala's Home From the Last War, the Magical Forest's Home to the Woods) | one option: leaves a league that a realm of men leads (the Kindred is kept) | generic_wilds |
| `zin_world.45` | The Gods' Gift | the Host, from `zin_eindil.98` | one option; never names a god | war_king (gate `zin_eindil_awake` required) |

`zin_world.45` belongs to the magic module's range (30 to 69). That module is not written and nobody is building it, so the report lives in `events/zin_world_war.txt` until it is (the world tension test keeps `events/zin_world.txt` to ids 1 to 29). The gift's own effect `zin_world_grant_new_gods_gift` is still that module's pending stand-in; the report describes only what `zin_eindil.98` does itself (the trait, Glo at full power).

Pictures avoid the asset uniqueness gate: each is either under the cap of 8 after these uses (zol_rising 5, volgan_broken 6, war_king 8, news generic_sea 3) or already over it with a baselined key whose first file sorts before the new files. No two events one step apart share a picture.

`pending_names.json`: the owners `events_war` (16 ids) and `world` (zin_world.45) are removed, and `diplomacy_gameplay` keeps only `zin_diplo_grant_cb` and `zin_lost_cause_add_strength`.

Also found and fixed: the East fired its three major news events (`zin_east.43`, `.44` and its own `.80`) in every country, which shows each player one window per country (the framework handoff's `SCRIPT_EVENT_POPUP_REPEATED`); they are now fired once (`modules/mech_east.mjs`, `everyNews`).

### Flags

| Flag | Owner | Resolution |
| --- | --- | --- |
| `zin_refusal_lifted` (6 owners) | diplomacy | The setter `zin_diplo_lift_refusal` was an inert stand-in. `modules/diplomacy.mjs` writes it (`common/scripted_effects/zin_diplomacy_refusal.txt`): sets the flag once. |
| `zin_elven_refusal` (Lerendor) | Leren | Wrong reader: it is a global flag in the contract and Lerendor read it as a country flag to mean "this realm is bound". The three readers test `zin_diplo_refusal_binds = yes`. |
| `zin_people_minor_<people>` (10 peoples) and `zin_people_minor_goblins` (Dark Lands) | peoples | `modules/peoples.mjs` sets the minor peoples at startup, as `03_peoples.md` section 4 proposes: Puvulan demons and orcs, Goldoroth trolls, Kilinti men, and goblins (a flag only) for every realm whose roster peoples count goblins while it plays another people (10 realms). A people that no realm holds as minor is read through its primary flag only, so `zin_people_includes_<key>` reads no flag that nothing sets. |
| `zin_tradition_middle_kingdom` | peoples | Set at startup (section 5): Aenor, Fotan and the Concord dominions whose roster people is men (13 realms; Kunhrim's dwarves and Kilinti's ents are not). The other tradition flags of the table have no reader and are not written. |
| `zin_gala_word_from_the_north` | Gala tree | The focus Word From the North sets it (`docs/design/focus/gala.json`), as `events_world.json` says. |
| `zin_magical_forest_carry_war` | Magical Forest tree | The focus Carry the War Across the Rift sets it. |
| `zin_afrit_sevrin_guest` | Worshipdom tree | The option "Give him a chair in the Council" of `zin_worshipdom.8` sets it before recruiting Sevrin, so his advisor card shows. |
| `zin_worshipdom_second_embassy` | Worshipdom tree | The tree's helper of the same name sets the flag that the Afrit acceptance table reads. |
| `zin_zol_cost_of_form` | Zol tree | The focus The Price of the Field sets it beside its call. |
| `zin_aenor_council_recent` | Aenor | Dead reader removed: the spec's AI convenes the council every 365 days, which the decision's cooldown already gives. |
| `zin_zol_wake_cd` | Zol | Dead reader removed: the spec gives Wake an Island no cooldown; the AI is paced by its cost and target. |
| `zin_dominion_barrows_wait` | Volgan | Wrong reader: the spec's requirement is "musters open"; `available` is `hidden_trigger = { has_country_flag = zin_volgan_musters_open }` (the category already shows only with it). |

### Triggers tested as flags

- `zin_west_holds_parim`: the Chronicle's Western Crown line (`data/events_crown_chronicle.json`) tests the trigger; the contract row says so.
- `zin_dark_took_southern_gifts` and `zin_glo_heir_in_hall`: both flags are set (the contract names the first a flag and a trigger; the Glo trigger adds "Horos lives" to its flag). The check now reports a trigger name read as a flag only when no flag of that name is set in that scope, which is the SL-06 failure it was written for. Test in `alternate_history.test.mjs`.

### Per-power rules

`zin_eindil_historical` reads `zin_rules_ai_branch_eindil_historical` (`modules/mech_eindil_scripts.mjs`) and `zin_west_historical` reads `zin_rules_ai_branch_west_historical` (`modules/mech_crossing.mjs`); both wrappers are the same test (the rule's HISTORICAL option, or DEFAULT under the historical path).

## 3. The retired Zol flags

`zin_zol_manifested` and `zin_zol_withdrawn` are no longer set or read anywhere in the builder or the focus designs (63 readers in 36 files, among them the focus designs and registries of the trees the war-side handoff lists, `events_world*.json`, `mech_afrit_script.mjs`, `mech_eindil_scripts.mjs`, `events_crown.mjs`, `mech_elves.mjs`, `mp_volgan_pulse.mjs`, `mech_zol.mjs` and the `vast_shadow` gate of `presentation-cells.json`). `zin_kusven_forth` is the moment Kusven comes forth; `zin_kusven_withdrawn` is the end of the war of the north on every route (`zin_kusven_withdraw` sets it whether Kusven came forth or the Presence receded before him), which is what the old `zin_zol_withdrawn` meant. The old flag's route without Kusven therefore keeps its readers (the Afrit return 120 days later, the idea cancels, the Volgan compact's end). A text names Kusven only behind `zin_kusven_forth` (unchanged). The contract rows say retired; the tests check that the retired names are neither set nor read.

The Chronicle cost line said "The Old God was driven back, not slain."; it reads "The dead of the black north were driven back, not destroyed." (C26: Zol never in person in the last war).

## 4. Roles (SL-23)

Switched: the Grey Ford truce (`modules/mech_crossing.mjs`): the break, the feud's two border-war sides' opinions and causes, the peace and its pact, and the raids act on `event_target:zin_role_grey_ford_a` and `_b` (Gunwyn and Girdon while they qualify, then their West Lands successors); before the registry's first resolution the two tags stand in. With both tags alive the behaviour is unchanged.

Not switched, with the reason:
- The journey's hosts (`global.zin_eindil_host`, `_gala_host`, `_stage8_host`, `_ice_host`, `_wreck_host`) and `zin_aenor_find_parim_realm`: the registry follows them (its first step reads the owner's pick), and they carry the journey spec's successor orders in full, which the registry's steps only abridge. Switching would invert the source of truth and drop spec detail in the most important story chain without a Linux run to prove it.
- `LER`, `MIR`, `YEL`, `GAA` in decisions and events: they are the subjects of their own mechanics (Lerendor's strait standing, Mirolon's proof, the watch on Yeldenne, Gala's court); a successor would carry none of those variables.

## 5. Tests and the build

- New and changed tests: `events_mech_war.test.mjs` (the 19 events are defined here and nowhere else, every fired id of the elves, eastern and Dark Lands slices is defined, the options call the slices' effects, the news is sent once, the AI pairs sum to 100, no secret or sealed name; event count 52; the retired Zol flags are gone), `alternate_history.test.mjs` (a paired flag is not reported; the shipped configuration enforces every owner), `mech_east.test.mjs` (news fired once), `mech_court.test.mjs`, `mech_powers.test.mjs`, `focus_major_c.test.mjs`, `focus_shared_a.test.mjs`, `events_crown.test.mjs` (the new flag names and the Chronicle line).
- Build (`node tools/content/build.mjs`, private TEMP, the briefed `ZIN_ART` snapshot): every step passes up to and including the story wiring check (`enforced: all; failures 0`), the text scan, the UI checks and the engine forms (0 problems); it stops at the asset manifest on 163 new errors, all portrait provenance (156 `PROV_UNREVIEWED`, 6 `PROV_REF_FOREIGN`, 1 `PROV_NO_GENERATION`, every one under `art/source/portraits/` or `gfx/leaders/`), dumped in full with `ZIN_ASSETS_FRESH_OUT`. None names a story file or an event picture. The snapshot's provenance has no review lines for the portrait sources of commit 98a52d44; the flag fix of the brief does not apply to them.
- `cd tools && npm test` (private TEMP): 1,599 tests, 1,581 pass, 17 fail, 1 skipped. Sixteen failures read the staged tree, which the build cannot write while the asset gate stops it (`build.test.mjs`, `calendar.test.mjs`, the defines test and `vanilla.test.mjs`, each with ENOENT on the staged path); the seventeenth is the roster migration's dry run (`data/world/portrait_pools.json`, known from the earlier handoffs). A scratch copy of the build that skipped the asset gate to write the tree ran out of disk (the drive had 0 bytes free twice during this pass; other agents build at the same time), so those suites were not run against this pass's tree.
- The private TEMP and scratch trees were deleted after each run.

## 6. MCP evidence

- `hoi4.script_validate` (installed documentation; checks syntax, command kind, declared scope) on the option effects of `zin_diplo.31`, `zin_dark.80`, `.82`, `zin_diplo.23`, the body of `zin_diplo_lift_refusal` and the Grey Ford pair block: every native command is supported in country scope (`leave_faction`, `is_faction_leader`, `is_in_faction_with`, `white_peace`, `has_event_target`, `every_country`, ...); unresolved are the mod's own helpers (`zin_elves_is_elven_country`, `zin_dark_is_accord_member`), the `event_target:` scopes (unresolved by design) and the argument blocks (`add_timed_idea`, `add_opinion_modifier`, `news_event`, `set_temp_variable`), which were read in `effects_documentation.md`. `valid` is null as the tool reports for unchecked argument blocks.
- `hoi4.event_inspect`: blocked. The server indexes only the workspace `mod_zin_86bac5c64231` (the applied mod files), not the staged tree outside the repository, so the new events are not in its index; a `state_flow` call on `zin_refusal_lifted` returned `INTERNAL_ERROR` while the drive was full, and three `trace` calls were refused for their selector form. The module's own checks and the tests above cover what the event lint would. A state-flow and trace run after the tree is applied remains to do.
- `hoi4.probability_inspect`: not run. The weighted surfaces are fixed-option AI chances taken from the specs' AI rows; no MTTH, random list or decision score was written.

## 7. What only a Linux run confirms

- That a negative `ai_chance` base (the honorary crown's accept weight) counts as never chosen, and the pair behaves as the spec's percentage.
- That `leave_faction` in `zin_diplo.31` leaves a human league and keeps the Kindred.
- That `event_target:zin_role_grey_ford_a/_b` hold before the truce can break (the registry resolves on the first world tick) and that the feud runs as before with Gunwyn and Girdon alive.
- That `zin_east.43`, `.44` and `.80`, fired once, reach every player once.
- That the minor-people flags and the Middle Kingdom tradition open the branches their readers expect (for example Kilinti's men and Puvulan's orcs and demons).

## 8. Simplifications, omissions and blockers

- The realm-life module (another agent) fires nothing the check reports yet (`zin_realm.50` is not fired today), so no allowance row was needed for it. The check's allowance list still covers flags only; an event allowance would need a small extension when realm-life ids are fired before that module lands.
- `zin_aenor_regency_endures` stays allowed (Afrit, Aenor, Eindil): the contract names it a country flag of the Aenor realm, set when the Regency survives to 4A 1760, while the world tension and path modules read a global flag. Nobody sets it; the owner must write the setter and settle the scope.
- Not written: `zin_diplo.30` (a realm breaks the Refusal, news) and the Refusal's expiry 365 days after the last war with a dark power (diplomacy spec); nothing fires `.30` today and the expiry is a monthly rule for the diplomacy gameplay owner. `zin_world_grant_new_gods_gift` stays the magic module's stand-in.
- The tradition flags other than the Middle Kingdom are not written (no reader; the spec's table still names Gunwaith and Asgard, which the voice guide replaces by Gunwyn and Orohaf).
- SL-23 is switched only for the Grey Ford pair (section 4).
- The staged-tree suites and the asset gate could not be run clean (section 5): the gate is the portrait provenance, and the disk was full.

## 9. Owner questions

1. Minor peoples: the spec's proposal is in force (Puvulan demons and orcs, Goldoroth trolls, Kilinti men, and goblins as a minor people of every realm whose folk include goblins). Accept, and should ogres become a people key for Puvulan and The Darks?
2. The war of the north's end flag: `zin_kusven_withdrawn` now means the war ended on every route, including the Presence receding before Kusven came forth (the world tension's -12 then applies too). Accept, or should that route have its own flag?
3. Roles: should the journey's host pickers and the Parim realm move under the role registry (porting their full successor orders into it), or stay the owners' pickers that the registry mirrors?
4. `zin_world.45` lives outside the magic module's file until that module is written. Who should write the magic module, and should the Gods' Gift's modifiers (the spec's 365 days of organisation, will to war and the bonus against Volgan) be written now?
5. The texts of the 19 events are proposed; in particular `zin_east.50` names the King of the East through `[zin_loc_deliverer]` and `zin_elves.9` names only King Aurevan, as their specs ask.
