# Integration note: regional focus trees, batch D

**Slice:** the tier B trees of the North Lands, Triton's Islands, the West Lands and Yeldenne. **Date:** 19 October 2026. **Specs:** `docs/specs/05_focus_trees/regional/north_lands.md`, `tritons_islands.md`, `west_lands.md`, `yeldenne.md`.

## What is delivered

| Tree id | File | Focuses | Spirits | Events | Opinion modifiers | Tree effects / triggers | raw |
| --- | --- | ---: | ---: | ---: | ---: | --- | ---: |
| `regional_tolvael` | `docs/design/focus/regional_tolvael.json` | 36 | 11 | 6 | 2 | 2 / 1 | 4 |
| `regional_mina` | `regional_mina.json` | 32 | 10 | 3 | 2 | 0 / 0 | 0 |
| `regional_r_en` | `regional_r_en.json` | 36 | 12 | 4 | 1 | 1 / 0 | 1 |
| `regional_molot` | `regional_molot.json` | 33 | 10 | 3 | 3 | 0 / 0 | 1 |
| `regional_eekedor` | `regional_eekedor.json` | 33 | 11 | 4 | 2 | 1 / 1 | 2 |
| `regional_adel` | `regional_adel.json` | 31 | 6 | 2 | 1 | 1 / 1 | 3 |
| `regional_pollos` | `regional_pollos.json` | 31 | 6 | 2 | 0 | 1 / 1 | 3 |
| `regional_raerby` | `regional_raerby.json` | 31 | 7 | 2 | 1 | 1 / 0 | 2 |
| `regional_nondondor` | `regional_nondondor.json` | 32 | 8 | 2 | 0 | 1 / 3 | 1 |
| `regional_halenor` | `regional_halenor.json` | 33 | 9 | 1 | 0 | 3 / 5 | 7 |
| `regional_seite_islands` | `regional_seite_islands.json` | 31 | 6 | 2 | 0 | 2 / 2 | 3 |
| `regional_girdon` | `regional_girdon.json` | 37 | 8 | 4 | 2 | 1 / 5 | 4 |
| `regional_lambin` | `regional_lambin.json` | 33 | 9 | 1 | 0 | 2 / 0 | 3 |
| `regional_buldor` | `regional_buldor.json` | 32 | 8 | 3 | 1 | 5 / 3 | 8 |
| `regional_kradlon` | `regional_kradlon.json` | 32 | 7 | 1 | 0 | 2 / 1 | 4 |
| `regional_corogon` | `regional_corogon.json` | 32 | 8 | 4 | 1 | 1 / 0 | 2 |
| `regional_varnondor` | `regional_varnondor.json` | 32 | 9 | 1 | 1 | 1 / 0 | 2 |
| `regional_yeldenne` | `regional_yeldenne.json` | 36 | 8 | 9 | 3 | 3 / 4 | 4 |
| **Total** | | **593** | **153** | **54** | | | **55** |

Every focus has a name and a one-to-three-sentence description, a catalog icon and the spec's AI (base weight, the historical route as `before` modifiers, `hist` factors). Every spirit, event, option and opinion modifier has text. All text was scanned with `banned_words.json`, `banned_extra.json` and the glossary forbid words (zero hits) and with the secret scan (no Afrit, no Hidden Council, no Eindil; the Deliverer only in the public label of Yeldenne's pilgrims).

Other files:

| Path | What |
| --- | --- |
| `tools/content/data/focus_registry_regional_d.json` | Names the trees reference that other owners write (pending until their module stages them; `loadRegistry` reads it next to `focus_registry.json`) |
| `tools/content/data/focus_arg_codes_regional_d.json` | Keyword codes for `zin_tritons_set_side`: `side`: chart 1, haven 2, none 3 (the same codes as the shared Triton's tree declares; the codes test compares this table with this note) |
| `tools/content/modules/decisions_regional.mjs` + `tools/content/data/decisions_regional.json` | Buldor's *The Company Books* (category and two decisions); see below |
| `tools/content/focus_regional_d.test.mjs` | 43 tests, several hundred assertions; appended to `tools/package.json` `test` |

## Wiring for the integrator

1. Focus trees: nothing to do. `buildFocusTrees` reads the 18 files and both extra data files.
2. Decisions: in `tools/content/build.mjs` call `await buildDecisionsRegional(staged, { countries })` (import from `./modules/decisions_regional.mjs`) anywhere before the text scan. It writes `common/decisions/categories/zin_regional_buldor.txt`, `common/decisions/zin_regional_buldor.txt` and `localisation/english/zin_decisions_regional_l_english.yml`. Optional: pass `known` (a Set of the Buldor tree's effect and trigger ids) for the reference check.
3. The category and decision icons are existing idea sprites (`GFX_idea_zin_ledger_coins`, `_coin_chest`, `_levy_muster`) until decision art exists.

Checked: all 95 tree files in the folder analyse with zero problems together with these 18; a full `node tools/content/build.mjs` passes the focus compiler and the text scan with these trees and stops only at the asset step on `REPLACE_SHAPE` errors of the interface reskin (not these files).

## Spec conflicts and choices

1. **Banned words in spec names.** `The Great War at Sea` is `The War at Sea` (all 12 island and western trees); `Island Marines` is `Island Boarders`; `Merchant Marines` is `Merchant Sea-Guard`; `Corogon's Stranded Marines` is `Corogon's Stranded Sea-Soldiers`; the three `Squadron` names are `Flotilla` (`The Northern Flotilla`, `The Southern Flotilla`, `The Banks Flotilla`, `The Eastern Flotilla`); `Convoy Charters` is `Escort Charters` and `Convoy the Compact` is `Escort the Compact`; `A Republic of Ledgers` is `A Realm of Ledgers`; `Coal and Ore Carts` is `Charcoal and Ore Carts`; every `Pilots` (the glossary forbids pilot) is `Wayfinders` (R'en: `Wayfinders of the Gateway`, `Sonargur's Wayfinders`). Keys are the spec's.
2. **Spirit keys equal to focus keys (F3).** Renamed with `_spirit`: Tolvael `tar_and_rope_spirit`; Mina `deep_shafts_spirit`, `hill_wardens_spirit`; R'en `harbour_dues_spirit`, `neutral_waters_spirit`; Molot `iron_discipline_spirit`, `garrison_drill_spirit`; Eekedor `compact_tariffs_spirit`.
3. **"The Heir" and the stranger.** The focuses that name the returning figure ("the Heir", the war-king, the houseless king) take `allow_branch zin_eindil_returned` / `zin_eindil_war_king` / `zin_eindil_awake` (repeated in `available`), so no tree shows them before the story reaches that point (decision D4; the shared Triton's note makes the same choice).
4. **Event option order (E2).** Where the spec's first option commits the country (accept a puppet shield, yield the banks, take a guarantee), the non-committal option is listed first so a timed-out event does not commit a human player. Other events keep the spec order.
5. **Events added.** Yeldenne has a ninth event, `tribes_tell_of_the_ice` (n 9, picture `man_in_ice`), because a compiled event has one fixed text: `the_tribes_of_the_ice` fires it after `zin_eindil_awake` and `tribes_of_the_ice` (n 3, picture `generic_wilds` instead of `black_ships_tale`) before. Ids 1 to 8 are the spec's.
6. **Opinion modifiers.** The specs say "opinion +15 both ways" without an id for most events; each such tree declares one (`friendship`, `embassy`, `lanterns`, `service`, `courtship`, `march_faith` ...). Girdon's `brothers` (+25, permanent) and Corogon's `embassy` (+15, decay 0.5) are the spec's.
7. **Buldor decisions.** The tree schema has no `decisions` block, so the two decisions are data for the new module `decisions_regional.mjs`. A fifth tree effect `zin_regional_buldor_recall_contract` (the decision *Recall a Company*) was added: the timer event `contract_ends` skips a contract that was recalled early (`zin_regional_buldor_recalled`), which the spec's single `end_contract` cannot do. `zin_regional_buldor_contract_cap` starts at 2 (`open_the_books` sets it) and `contracts_in_every_court` adds 1.
8. **Raw.** The specs say "no raw block"; 55 raw blocks stand in tree scripts and rare conditions: `recruit_character`, `every_country`/`random_other_country` loops, `send_equipment`, `give_military_access`, halving the lean, `is_in_faction = no`. No focus reward is raw; two event options (Tolvael's `tolvael_keeps_faith`, Molot's `molot_offers_the_march`) use one raw line for military access. Variables of other owners are read through `global.` names (now allowed by the schema).
9. **Where the specs ask for things the vocabulary cannot do.** "Nearest first" and "the largest navy" (Halenor's `offer_protection`, Seite's `ask_guarantee`) become a random eligible island (up to three) and a random island with five or more ships; the Seite Islands' "not in a faction" test for `the_banks_by_force` is dropped (a trigger cannot name another country in raw); Eekedor's arbitration AI `20 + (60 - corruption) / 2` becomes tiers (25, 35, 45 below corruption 60, 40, 20; 5 above); Nondondor's and Seite's rival tests use trees' own `is_<name>` triggers built from `{ country }`.
10. **Characters.** The trees recruit characters by `zin_regional_<tree>_recruit {character}` (keyword codes per person; the codes live in each tree's `scripted_effects` args). The characters slice must define, with the ids of the specs: Adel `ysmay`, `edda`; Pollos `marra`, `teo`; Raerby `osk`, `ilka`; Nondondor `saric`; Halenor `gull`, `rhea`; Seite Islands `brann`; Girdon `aldo`, `corla`; Lambin `essa`, `orrin`; Buldor `mara`, `ulric`; Kradlon `hesta`, `bram`; Corogon `lio`, `ves`; Varnondor `sevra`, `tomas` (all `zin_regional_<tree>_<person>`). The North trees' courts are recruited at game start, not by focus.
11. **Start spirits.** The twelve island and western start spirits are defined by their trees (explicit icon) for the start-situation module to add: `zin_regional_<tree>_<spirit>` as listed in the specs.

## Names this slice defines

- Effects: `zin_regional_<tree>_recruit` (all but the North trees and Yeldenne), `zin_regional_<tree>_opinion` (generated, trees with opinion modifiers), `zin_regional_tolvael_centre_lean`, `_call_crowns`, `zin_regional_r_en_centre_lean`, `zin_regional_eekedor_impartial`, `zin_regional_halenor_offer_protection`, `_wargoal_isle`, `zin_regional_seite_islands_ask_guarantee`, `zin_regional_lambin_supply_convener`, `zin_regional_kradlon_arm_convener`, `zin_regional_buldor_offer_contract`, `_sign_contract`, `_end_contract`, `_recall_contract`, `zin_regional_yeldenne_send_last_record`, `_courteous_word`, `_call_bearers`.
- Triggers: `zin_regional_<tree>_unaligned` (Tolvael, Adel, Pollos), `..._dark_above_<n>` (Nondondor, Halenor, Seite Islands, Buldor), `zin_regional_halenor_piracy_high`, `_has_subject`, `_has_three_subjects`, `_in_charter`, `zin_regional_seite_islands_in_charter`, `zin_regional_nondondor_is_nondondor`, `zin_regional_girdon_truce_strong`, `_episodes_past`, `_claimed`, `_is_gunwaith`, `_war_thanes`, `zin_regional_kradlon_is_coastal`, `zin_regional_buldor_contract_allowed`, `_at_war_with_major`, `zin_regional_eekedor_lerendor_grieves`, `zin_regional_yeldenne_stage_6_or_7`, `_stage_above_7`, `_stage_above_8`, `_glo_dormant`.
- Flags set: `zin_tolvael_no_crown`, `zin_tolvael_free_crowns`, `zin_r_en_neutral`, `zin_eekedor_court_open`, `zin_tritons_banks_yielded`, `zin_regional_girdon_brothers`, `_parims_friend`, `_council_pact`, `zin_regional_lambin_great_granary`, `zin_regional_buldor_books_open`, `_route_any`, `_route_parim`, `zin_west_buldor_west`, `zin_regional_kradlon_arms_west`, `zin_regional_corogon_charter_signed`, `zin_regional_varnondor_parims_friend`, `zin_regional_yeldenne_heard_rumours`, `_follows_bearer`; globals `zin_yeldenne_hall_unyielding`, `_coast_watch`, `_forewarned`, `_awaits_heir`, `_beacon`, `_guides`, `_seal_warded`, `_calls_heir`, `_calls_bearer`.
- Variables: `zin_regional_buldor_contracts`, `_contract_cap`, `_recalled`, `_last_employer`.
- Decisions: category `zin_regional_buldor_contracts`; `zin_regional_buldor_sell_contract`, `zin_regional_buldor_recall_company`.

## Names this slice expects from others

Registry additions are in `focus_registry_regional_d.json`. By owner:

- Lerendor mechanic: `zin_leren_add_lean`, `zin_leren_add_strait_standing`, `zin_leren_offer_protection`, `zin_leren_treaty_in_force`, `zin_leren_grievance_1716`, `zin_leren_grievance_unanswered`, variable `zin_leren_lean`, `zin_is_lerendor`.
- Shared North tree: `zin_north_ask_compact_seat`, `zin_north_ask_parim_shield`, `zin_north_can_ask_compact`, `zin_north_with_lerendor`, `zin_north_lerendor_supremacy`, faction template `zin_faction_free_north`.
- Shared Triton's tree and companion: `zin_tritons_add_piracy`, `_set_side`, `_found_charter`, `_join_charter`, `_join_crossing`, `_offer_banks_mediation`, `_make_banks_accord`, `_charter_exists`, `_ship_has_sailed`, opinion `zin_tritons_banks_quarrel`, flags `zin_tritons_charter_invited`, `_charter_leader`, `_corsair_haven`, `_mediation_accepted`, `_banks_accord`, `_charter_founded`.
- Western Crossing: `zin_west_add_fleet`, `_add_grudge`, `_add_truce`, `_add_unity`, `zin_west_historical`, flags `zin_west_council`, `_route_crossing`, `_route_relief`, `_route_divided`, `_truce_broken`, `_grey_ford_war`, `_ford_commission`, `_evacuation`, `_evacuated`, `_pledged`, `_stranded`, `zin_western_crossing`, variables `zin_west_truce`, `zin_west_convener`, event `zin_west.10`, site `zin_is_site_grey_ford`; Gunwaith's idea `zin_gunwaith_war_thanes`.
- Eindil's journey: `zin_eindil_add_regard`, `_add_renown`, `_join_coalition`, `_aid_host`, `zin_eindil_friend`, `zin_eindil_historical`, flags `zin_eindil_awake`, `_war_king`, `_named`, `_heeded`, `_returned`, `_lost`, `zin_eindil_safe_harbour`, variables `zin_eindil_stage`, `zin_eindil_host`.
- Glo: `zin_yeldenne_add_wards`, `zin_glo_request_northern_watch`, `zin_glo_worthy_claimant`, `zin_glo_lost_cause_leader`, `zin_glo_state`, flags `zin_horos_dead`, `zin_horos_endures`, `zin_glo_sealed`, `zin_glo_with_eindil`, `zin_glo.64`.
- Others: `zin_afrit_add_footholds`, `zin_aenor_event_for_parim`, `zin_aenor_parim_lost`, `zin_lost_cause_add_strength`, `zin_diplo_is_dark_power`, `zin_aenor_is_realm`, region flags `zin_region_north_lands`, `_tritons_islands`, `_west_lands`, the story flags of the shared contract, `zin_gathering_dark`, `zin_tritons_piracy`, `zin_court_corruption`.
- Characters: see choice 10; art: no new focus icon or event picture. Decisions need decision sprites eventually (`GFX_decision_zin_regional_buldor_*`).

## Open items

- `hoi4_script_validate` was not usable in this session (no registered workspace), so the raw script fragments were checked against the documentation by hand, not by the validator.
- Event picture `yeldenne_silent_hall` is still requested by the Yeldenne spec; `hall_falls_silent` and `a_call_for_a_bearer` use `generic_court`.
