# Mechanics: the eastern kings (the East Lands and the South Lands desert)

Slice: `docs/specs/04_mechanics/eastern_kings.md`, with the shared contract (`00_shared_contract.md`, `00_contract_additions.md`), the decisions of record (`docs/specs/INTEGRATION_DECISIONS.md`, which win where they conflict: S1 and O5 on the kneeling courts, O4 on the temple loan, E1 to E7) and the war events spec (`docs/specs/06_events/03_war_of_the_last_crowns.md`).
Modules: `tools/content/modules/mech_east.mjs` (scripted triggers, effects, the site rows, the build entry) and `mech_east_content.mjs` (ideas, dynamic modifiers, opinion modifiers, categories, decisions, events, scripted localisation, on_actions, AI strategies).
Library: `lib/mech_kit.mjs` (shared with the Cold, Dark and Sun slices).
Data: `tools/content/data/mech_regions_east.json` (roster names, the site rows, every number and AI weight, every player-visible text, the hub report's line template).
Test: `tools/content/mech_east.test.mjs` (49 tests, all passing; `cd tools && node --test content/mech_east.test.mjs`).
The test is not yet in the `test` script of `tools/package.json`; the integrator adds it.

## Wiring in build.mjs

```js
const mechEast = await buildMechEast(staged, { countries });
```

The call is step 13 of the round 3 order (`integration_r3.md`): after the court, journey and power slices, before the world events, the crown events, vanilla removal and the focus compiler, whose reference scans must see these names.
It returns `{ files, counts, definitions, dependencies, externalEvents, siteRows, text, tags, content, statesTotal }` and throws on a roster that does not match the data (35 countries, 337 states), a start charter, influence or lean outside its range, a lean on Noris or Stabilo, a site waypoint that names no country or row, text that nothing uses, a banned or modern word, a character the font cannot draw, a picture or icon outside the catalog, and a tree-declared effect (`zin_noris_monthly`, `zin_stabilo_monthly`, `zin_stabilo_add_debt`) that `docs/design/focus/noris.json` or `stabilo.json` does not declare.
`ctx.treeDir` overrides the focus design folder (the test uses it); `ctx.data` overrides the data file.

`SITE_ROWS` (also `siteRows` of the result) are this spec's rows for the key-sites module (E7): `furvior`, `postondoroth`, the five roads as `path` rules through the spec's waypoints (the Rift Road ends on a `nearest` rule: Alerhia's rift-coast naval base nearest Delbiz Grasslands's capital; the Sand Road has its Obmi branch), `rift_east`, `rift_west` (pending the named rift sea) and the regions `east_lands` and `south_lands` (desert, row 1,550 of 2,560).
The row format is provisional until `modules/sites.mjs` fixes the one of `sites.json`; `build.mjs` should hand these rows to it.

## Files written (12)

| File | Content |
| --- | --- |
| `common/scripted_triggers/zin_east.txt` | 18 triggers, among them the four story-pace date triggers |
| `common/scripted_effects/zin_east.txt` | 54 effects |
| `common/ideas/zin_east.txt` | 9 ideas (the 8 of the spec and `zin_east_rationed_water` of `zin_east.36`) |
| `common/dynamic_modifiers/zin_east.txt` | `zin_east_caravan_wealth`, `zin_east_dry_land`, `zin_east_wells`, the causes `zin_cb_free_east` and `zin_cb_high_king` |
| `common/opinion_modifiers/zin_east.txt` | 10 opinion modifiers |
| `common/decisions/categories/zin_east.txt` | 4 categories: `zin_east_roads`, `zin_east_desert`, `zin_east_courts`, `zin_east_ledger` |
| `common/decisions/zin_east.txt` | 22 decisions: 9 roads, 1 desert, 5 courts, 4 Ledger, 3 in the Afrit spec's `zin_afrit_council` |
| `events/zin_east.txt` | namespace `zin_east`: 21 visible events and the hidden `.1`, `.2`, `.3`, `.5`, `.6` |
| `common/on_actions/zin_east.txt` | `on_startup` (`zin_east.1` one day later), `on_declare_war`, `on_peace`, `on_capitulation` |
| `common/scripted_localisation/zin_east.txt` | the five road lines of the roads category and the name of the last road to change hands |
| `common/ai_strategy/zin_east.txt` | 44 blocks: the Free Crowns against the Dominion, the coalition against Aenor, and per Magical Lands realm a conquest and the leader's front request |
| `localisation/english/zin_east_l_english.yml` | 191 keys, UTF-8 with BOM |

## Names defined

Triggers: `zin_is_noris`, `zin_is_stabilo`, `zin_east_has_capital` (the country exists and controls a state; it stands before every `capital_scope` of the mechanic), `zin_east_in_region` (capital in the East Lands), `zin_east_is_power`, `zin_east_is_court`, `zin_east_is_south_court`, `zin_east_faces_rift`, `zin_east_after_caravan_war`, `_rift_talk`, `_early_coalition`, `_turn_west`, `zin_east_caravan_war_open`, `zin_east_claims_open`, `zin_east_question_open`, `zin_east_rule_refuse`, `zin_east_rule_unite`, `zin_east_free_crown`, `zin_east_at_war_in_the_west`.

Effects the trees and other slices call: `zin_east_add_road_influence` (`road`, `value`), `zin_east_add_all_roads` (`value`), `zin_east_add_rivalry` (`value`), `zin_east_add_lean` (`value`), `zin_east_prepare_kneel`, `zin_east_claim_road` (`road`), `zin_east_claim_rift`, `zin_east_offer_coalition_peace`, `zin_east_grant_free_cb`, `zin_east_grant_high_king_cb`, `zin_east_declare_united`, `zin_east_after_the_king`, `zin_east_wells_random`, `zin_east_dig_wells_in`.
Effects the war events' options call: `zin_east_form_coalition`, `zin_east_join_coalition`, `zin_east_stay_out`, `zin_east_make_coalition_peace`, `zin_east_serve_stranger`, `zin_east_order_home`, `zin_east_refuse_king`, `zin_east_gifts_to_king`, `zin_east_send_levies`, `zin_east_send_gold`, `zin_east_delay_host`.
Internal effects: the monthly parts (`zin_east_monthly`, `_roads_month`, `_rivalry_month`, `_country_month`, `_free_crowns_month`, `_story_month`, `_schedule_month`, `_pick_runner`), the coalition (`_compute_weight`, `_pick_leader`, `_enforce_coalition`, `_cross_rift`, `_turn_west`), the King (`_restore_ideology`, `_enforce_refusers`, `_name_first_crown`, `_king_notice`), and `_startup`, `_refresh_wealth`, `_update_dominance`, `_update_bias`, `_count_roads`, `_charter_changed`, `_sign_concord`, `_undercut`, `_make_report`, the three on_action handlers.

Variables: the spec's table, plus `zin_east_rank` (the fixed tag order of the tie-breaks, set on startup for the 35 East Lands countries and the 21 Magical Lands realms), `zin_east_ctrl_<road>`, `global.zin_east_roadn_<road>`, `global.zin_east_states_total`, `global.zin_east_last_road`, `global.zin_east_last_winner`, `zin_east_rift_count`, `zin_east_cores`, `zin_east_cores_held`, the report counts.
Flags beyond the spec's table: `zin_east_declined_lead`, `zin_east_rift_target`, `zin_east_invasion_young` (120 days), `zin_east_peace_asked`, `zin_east_coalition_peace`, `zin_east_client_set`, `zin_east_free_crown_set`, `zin_east_had_elections`, `zin_east_delayed_host` (365 days), `zin_east_south_court`, `zin_east_loan_recent`, and the once-flags of the beats (`zin_east_gather_sent`, `zin_east_king_seen`, `zin_east_stranded_asked`, `zin_east_host_called`, `zin_east_after_king_done`, `zin_east_gk_seen`, `zin_east_gk_wait`, `zin_east_noris_gone`, `zin_east_stabilo_gone`).

## Names used that other owners must define

| Owner | Spec | Names |
| --- | --- | --- |
| Key sites, `modules/sites.mjs` (not built) | `docs/specs/01_map/02_key_sites.md` | `zin_is_region_east_lands`, `zin_is_region_south_lands`, `zin_is_site_road_salt`, `_gold`, `_rift`, `_lake`, `_sand`, `zin_is_site_rift_east`, `zin_is_site_rift_west` (from this slice's `SITE_ROWS`); `zin_is_region_magical_lands`, `zin_is_region_middle_lands` |
| Afrit, `modules/mech_afrit.mjs` | `docs/specs/04_mechanics/afrit_hidden_council.md` | `zin_afrit_add_footholds`, `zin_afrit_add_veil`, `zin_afrit_is_hub`, `zin_afrit_eastern_candidate`, the category `zin_afrit_council`, `zin_loc_deliverer`, `zin_footholds`, `zin_afrit_king_of_east`, `zin_afrit_dead`, `zin_afrit_returned`, `zin_afrit_eastern_client` |
| Elves, `modules/mech_elves.mjs` | `docs/specs/04_mechanics/elves_wall_and_dragons.md` | `zin_elves_on_eastern_invasion`, `zin_elves_is_magical_realm` |
| Rules, `modules/rules.mjs` | `docs/specs/00_foundation/05_defines_and_rules.md` | `zin_rules_is_historical`, `zin_rules_is_free`, `zin_rules_ai_branch_east_refuse_afrit`, `zin_rules_ai_branch_east_unite_without_afrit`, `zin_rules_ai_random_east`, `global.zin_story_pace` |
| Diplomacy, `modules/diplomacy.mjs` | `docs/specs/03_gameplay/03_diplomacy_and_factions.md` | the template `zin_faction_free_crowns`, the cause `zin_cb_eastern_ambition`, the story-war flag `zin_story_war`, and the names and descriptions of `zin_cb_free_east` and `zin_cb_high_king` |
| World systems (not built) | `docs/specs/03_gameplay/05_world_tension_and_endings.md` | `zin_war_of_last_crowns` (nothing sets it yet), `global.zin_gathering_dark` (nothing sets it yet) |
| Aenor succession | `docs/specs/04_mechanics/aenor_court_and_succession.md` | `zin_golden_king_dead` |
| Eindil's journey | `docs/specs/04_mechanics/eindil_journey.md` | `zin_eindil_returned` |
| War events (not built) | `docs/specs/06_events/03_war_of_the_last_crowns.md` | the events below |
| Noris tree | `docs/specs/05_focus_trees/major/noris.md` | `zin_noris_monthly`; flags `zin_noris_route_shield`, `_route_high_king`, `_envoys`, `_open_treaty`, `_banner`, `_audit`, `_riders_for_host` |
| Stabilo tree | `docs/specs/05_focus_trees/major/stabilo.md` | `zin_stabilo_monthly`, `zin_stabilo_add_debt`, `zin_stabilo_debt`, events `zin_stabilo.30` and `.31`; flags `zin_stabilo_route_free`, `_route_empire`, `_envoys`, `_open_pact`, `_pact_under_prince`, `_audit`, `_rival_banks`, `_ledger_open`, `_loans_to_kings`, `_collect` |
| The eastern trees (Noris, Stabilo, tier B, `shared_east_lands`) | `docs/specs/05_focus_trees/` | flags `zin_east_pledged`, `zin_east_route_resist`, `zin_east_court_audit`, `zin_east_wells_unlocked`, `zin_east_courts_noris`, `zin_east_courts_stabilo`; they fire `zin_east.26`, `.30`, `.35`, `.51`, `.73` through their declared effects |

The Noris and Stabilo designs declare all three tree effects, so the stub writer of the first draft is gone: the module stages no stub and refuses to build when a design stops declaring one.

## Events fired here and defined by the war events spec

Each is fired at its beat by this slice; its options should call the effects named here, first option first (E2).

| Event | Fired | Options |
| --- | --- | --- |
| `zin_east.41` (hidden) | on the runner, 30 days after the first month that sees `zin_war_of_last_crowns`; outside the historical path at once when `zin_gathering_dark` is 70 or more after the shifted 1 Thaw 4A 1754 | its immediate block calls `zin_east_form_coalition` (weights, leader, asks, and the hidden `zin_east.3` 30 days later) |
| `zin_east.42` | by `zin_east_form_coalition` to a human leader and to every other East Lands country of weight 50 or more | Stay out: `zin_east_stay_out` (a declining leader passes the lead) / Join: `zin_east_join_coalition`; AI = `zin_east_coalition_weight` |
| `zin_east.43` (news) | by `zin_east_cross_rift` to every country, after the declarations | one option |
| `zin_east.44` (news) | by `zin_east_turn_west` to every country | one option |
| `zin_east.45` | each month while the King reigns, to every coalition member that refused him; at once by `zin_east_offer_coalition_peace` | Fight on / Make peace: `zin_east_make_coalition_peace`; AI peace 70 for refusers, 30 for others, +20 with `zin_stabilo_bought_off` |
| `zin_east.46` | once on `zin_eindil_returned`, to every East Lands country at war with a Magical or Middle Lands realm | Order them home: `zin_east_order_home` / Let them serve: `zin_east_serve_stranger`; AI serve 60 for refusers, 10 otherwise |
| `zin_east.50` | by the hidden `zin_east.5`, 30 days after the first month that sees `zin_afrit_king_of_east`, to every court that is neither client, refuser nor `zin_afrit_eastern_candidate` | Keep silent / Send gifts: `zin_east_gifts_to_king` / Refuse: `zin_east_refuse_king` |
| `zin_east.51` | by `zin_east_name_first_crown` (the hidden `zin_east.6`, 60 days after) or by a tree's resist focus | one option |
| `zin_east.52` | once on `zin_afrit_returned`, to every client | Delay: `zin_east_delay_host` / Send levies: `zin_east_send_levies` / Send gold: `zin_east_send_gold`; AI 10 / 60 / 30 |
| `zin_east.60` | by `zin_east_after_the_king`, to every East Lands country | text by status |

The refuse option of the Afrit spec's `zin_afrit.51` should call `zin_east_refuse_king` (or set `zin_afrit_refused_east`); nothing defines that event yet.

## Spec conflicts and choices

- Module, entry and data names follow the slice (`mech_east.mjs`, `buildMechEast(staged, { countries })`, `data/mech_regions_east.json`), not the spec's `mech_eastern_kings.mjs`, `buildEasternKings` and `data/mechanics/eastern_kings.json`.
- The site lists are resolved by the key-sites module from `SITE_ROWS` (E7); this module computes no state list from the map.
- The monthly update is the spec's self-scheduling hidden `zin_east.2` on the runner (Noris; Stabilo if Noris is gone; else the East Lands country with most states). The first draft ran it from an every-country `on_monthly` block, which CLAUDE.md rule 8 forbids; that block is removed.
- Three hidden helpers not in the spec's table give the beats their exact delays: `zin_east.3` (the crossing, 30 days after the gathering), `zin_east.5` (the notice to the courts not asked, 30 days after) and `zin_east.6` (the refusers' floor and the First of the Free Crowns, 60 days after). Their start is the first monthly run that sees the story flag, so a beat can come up to 30 days later than the spec's count.
- The crossing claims the realm's rift-coast states for the leader and declares `take_claimed_state` (the spec's `take_state_focus` needs a state-id generator the script cannot name; the precedent is `mech_powers.md`). The turn west declares `annex_everything` on Aenor (the spec names no war goal).
- Targets of the crossing are the Magical Lands realms of `zin_elves_is_magical_realm`: the Worshipdom, a Magical Lands country of the roster, is never one. `zin_cb_eastern_ambition` goes to members with three footholds or more against every realm and Aenor.
- `zin_diplo_grant_cb` is defined by no module, so the causes are added directly with `add_dynamic_modifier = { modifier scope days }`, the form the diplomacy module documents for its causes.
- The historical floor of two coalition members besides the leader is applied at the crossing, when the AI answers to `zin_east.42` are known, not in the same effect as the asks.
- The dig-wells decision sits in its own category `zin_east_desert`: the spec puts it in `zin_east_roads`, which only Noris and Stabilo see, while the spec also gives it to the tier B and C courts. The first draft named the category `zin_east_wells`, the key of the wells modifier, and the data file held that key twice, so the modifier showed the category's text.
- The spec names both the court-gifts decision and its opinion modifier `zin_east_court_gifts`; one key would give both one text. The opinion keeps the name (the shared tree adds it too); the decision is `zin_east_send_court_gifts`. The spec's decision table should follow.
- An East Lands country is one whose capital lies in the East Lands (the spec's `zin_east_is_court`); the Afrit candidate trigger reads the economy flag `zin_region_east_lands`, which agrees at start.
- One charter changes hands in a month, so that `zin_east.10` names the right road; a second waits for the next month. Under the Concord the influence drift goes on while charters and conquest freeze.
- "Rich lands, weak kings" of `zin_east.40` sets `zin_east_rift_ambition` (the spec says only "flag").
- The delay of `zin_east.52` (bias −20) is a 365-day flag read by the monthly bias, because a one-off change would be lost at the next recompute. The restored government keeps the elections it had, stored as `zin_east_had_elections` at the kneel.
- AI weights: the spec's "AI = |lean| − offset" is written as 10-point bands, with the refusal at 100 minus the same bands; the yield of `zin_east.26` weighs 70 when the loser holds fewer than half its core states and 0 otherwise; envoys go first to courts already leaning 30 or more (not literally the three highest); the Free Crowns' war strategy ends at once with `zin_afrit_dead`, not 180 days later; the UNITE_WITHOUT_AFRIT route weights (1000 for the stronger power) are the trees' to write.
- The hub's report `zin_east.31` lists every East Lands country of the roster by tag: footholds, kneel bias and coalition weight.
- The dry-land modifier is applied once at startup to every South Lands state without wells; the list is fixed and wells never vanish, so the spec's "newly dry states" needs no monthly pass.

## Findings for other owners

- `lib/mech_afrit_script.mjs`, `zin_afrit_kneel`: for a court that is already a subject, `${HUB} = { give_military_access = <court> }` gives the Dominion's access to the court, the reverse of the spec; `zin_east_prepare_kneel` already gives the court's access to the Dominion, so that branch should be removed.
- `lib/mp_check.mjs`: `PARAMS` lacks `strength_ratio`, `has_dynamic_modifier` and `set_politics`, so their parameters read as unknown commands; this slice's test collapses those blocks before the check.
- Nothing sets `zin_war_of_last_crowns` or `zin_gathering_dark` yet; until the world systems land, the coalition, the Caravan War gate and the claims gate stay closed.
- Every-country loops: the first draft's every-country `on_monthly` block (removed, above). The MTTH events `zin_east.15`, `.30` and `.36` are polled by the engine for every country, as the spec allows for a mechanic namespace; their triggers hold the cheap tests first.

## Art

Pictures the spec requests that are not catalog keys yet (each event uses the catalog fallback):

| Wanted key | For | Used instead |
| --- | --- | --- |
| `caravan_road` | `.10`, `.20`, `.21`, `.32` | `generic_peace` |
| `desert_wells` | `.15`, `.16`, `.36` | `generic_court` (`.15`, `.16`, per the spec's pictures list), `generic_wilds` (`.36`) |
| `deep_sand` | `.35` | `generic_wilds` |
| `rift_sails` | `.43` (the war events spec's event) | `generic_war` (news) |
| `caravan_roads_category` | category `zin_east_roads` | no picture |

Ideas and decisions use catalog icons by full sprite name: road decisions `GFX_idea_zin_caravan`, the desert `_granary`, courts `_envoy`, the Free Crowns `_banner_league`, the Ledger `_ledger_coins`, the hub `_eye_watchful`. No category has a picture.

## Zol correction footprint

None. No file, id, flag or text of this slice names Zol's manifestation or reads `zin_zol_manifested`.

## Open items

- `modules/sites.mjs` must resolve `SITE_ROWS` (the rift sea regions are still unnamed, so `rift_east` and `rift_west` are pending) and `build.mjs` must hand the rows to it.
- The war events module must define `zin_east.41` to `.46`, `.50` to `.52` and `.60` with the options above.
- `tools/package.json` should run `content/mech_east.test.mjs`.
- The spec's acceptance items (b) and (c) (the Linux year, the scenario runs) are not run here; the MCP script validator was not used, the evidence is the offline vocabulary check against the installed documentation and the 49 tests.
