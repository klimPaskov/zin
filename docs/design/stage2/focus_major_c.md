# Stage 2: tier A focus trees, wave C (Noris, Stabilo, Volgan, Worshipdom, Zol)

Author: content wave C, 19 October 2026. Specs: `docs/specs/05_focus_trees/major/{noris,stabilo,volgan,worshipdom,zol}.md`.

## What was written

| File | Content |
| --- | --- |
| `docs/design/focus/noris.json` | 112 focuses, 22 spirits, 24 events, 17 tree effects, 6 tree triggers, 4 opinion modifiers |
| `docs/design/focus/stabilo.json` | 111 focuses, 22 spirits, 24 events, 24 tree effects, 6 tree triggers, 3 opinion modifiers |
| `docs/design/focus/volgan.json` | 114 focuses, 36 spirits, 18 events, 1 tree effect, 1 tree trigger, 1 opinion modifier |
| `docs/design/focus/worshipdom.json` | 116 focuses (62 two-face), 24 spirits, 13 events, 15 tree effects, 1 tree trigger, 2 opinion modifiers |
| `docs/design/focus/zol.json` | 97 focuses, 24 spirits, 10 events, 1 tree effect |
| `tools/content/data/focus_registry_major_c.json` | The names of other owners these trees use (loaded by `loadRegistry` through the `focus_registry_<slice>.json` rule). Remove an entry when its module lands |
| `tools/content/data/focus_worshipdom_faces.json` | Public and true name and description of the 62 two-face Worshipdom focuses (see "Worshipdom") |
| `tools/content/modules/focus_major_c.mjs` | Writes `common/dynamic_modifiers/zin_noris.txt` (`zin_noris_clans`), `zin_stabilo.txt` (`zin_stabilo_ledger_income`) and `localisation/english/zin_focus_major_c_l_english.yml`; the compiler has no block for dynamic modifiers |
| `tools/content/focus_major_c.test.mjs` | 47 tests, compiled in `tools/package.json` `test` |

Totals: 550 focuses, 128 spirits, 89 events, 58 tree effects, 14 tree triggers, 10 opinion modifiers. Raw blocks (limit 10 per major tree): Noris 9, Stabilo 9, Volgan 6, Worshipdom 6, Zol 0. Every tree compiles with no problem and no warning except the `council_chamber` hub-only gate (nine Worshipdom private events, as the spec says).

## Integration

1. `build.mjs`: add `import { buildFocusMajorC } from './modules/focus_major_c.mjs';` and `await buildFocusMajorC(staged);` anywhere before `buildFocusTrees` (it reads nothing). It writes 3 files.
2. The focus compiler must run after the modules that write the names in the registry file, as now. The registry file is read automatically; no build change.
3. The eastern mechanic's no-op stubs `zin_noris_monthly`, `zin_stabilo_monthly`, `zin_stabilo_add_debt` (and `zin_stabilo_debt`) disappear once these trees compile (this tree declares the real effects; the C3 check must see them only once).
4. The Afrit mechanic module reads `focus_worshipdom_faces.json` to define `zin_wsd_<key>_name` and `zin_wsd_<key>_desc` (public text while `zin_afrit_revealed` is unset, true text after). If that slice already wrote its own texts, reconcile: the focus data only names the scripted localisations.
5. The interim Long Peace tree is replaced for the five countries as the specs say; nothing else to wire.

## Requests to mechanics slices (names not in the contract)

- `zin_stabilo_great_loan`: country flag. The decision *Great Loan* sets it on the target (2 days) before it fires `zin_stabilo.30`; the event tells a great loan from a plain one by it and clears it. `zin_stabilo.30` to `.33` use `FROM`: `.30` from Stabilo, `.31` fired by `.32` or the decision (FROM = Stabilo), `.32` fired by `zin_stabilo_monthly` (FROM = the debtor court), `.33` fired by `.31` Default (FROM = the defaulter).
- Worshipdom country flags the Afrit module reads: `zin_worshipdom_thief_halved` (event .8: Send the Thief cooldown halved), `zin_worshipdom_watch_castle` (event .9: Word from the Lands of the Sun 10 days sooner). Noris sets `zin_noris_watching_north` (informational).
- Argument codes passed as plain numbers because no code table exists (and a table must agree with its spec): `zin_diplo_grant_cb` `cb` 3 = `zin_cb_caravan_roads` (the order of the cause table in the diplomacy spec; the diplomacy module should read `zin_arg_cb` with the same order: broken_truce 1, old_grudge 2, caravan_roads 3, orc_raids 4, crown_defied 5, against_the_dark 6, eastern_ambition 7); `zin_afrit_spread_footholds` `region` 0 = `any`; `zin_afrit_reveal` `voluntary` 1; `zin_world_reach_ending` `ending` 3 = ashen_throne (world systems table).
- Names these trees call or test that the specs name: all effects, triggers, events, ideas and flags in `focus_registry_major_c.json`. Characters used by raw script: `zin_noris_tumo`, `zin_stabilo_hardfic`, `zin_sevrin`, `zin_eindil`, `zin_volgan_ember_herald`, `zin_volgan_grave_warden`, `zin_volgan_ghorvak`. Sub-unit `zin_demons_bound`, idea `zin_afrit_deliverer_rests`, equipment `zin_mounts_equipment`, `zin_catapult_equipment`, `zin_grave_arms_equipment`, `convoy_1`. Region flags `zin_region_magical_lands`, `zin_region_middle_lands` (pattern `zin_region_<key>`), triggers `zin_is_noris`, `zin_is_stabilo`, `zin_east_is_court`, `zin_east_is_south_court`, `zin_east_free_crown`, `zin_is_site_rift_west`, `zin_is_site_road_*`, `zin_is_site_postondoroth`, `zin_is_site_parim`, `zin_is_site_ocean_of_zol_island`, `zin_is_region_south_lands`.
- Variables read: `zin_east_lean`, `zin_east_charters`, `zin_east_dominance`, `zin_east_kneel_bias`, `zin_footholds`, global `zin_east_rivalry` and `zin_east_road_<road>` (read in raw script only), `zin_stabilo_debt`, `zin_dominion_strength`, `zin_dominion_oath`, `zin_nether_pact`, `zin_volgan_pact`, `zin_mirolon_proof`, `zin_mistake_power`, `zin_zol_convergence`, `zin_afrit_regicide_plot`, `zin_afrit_veil`, `zin_afrit_artifacts`, `zin_afrit_seat_censers`, `zin_strait_standing`.
- Tree-owned variables and flags (set by the trees' effects; mechanics may read them): Noris `zin_noris_clan_accord`, `_accord_stab`, `_accord_cons`, `_rivalry` and `_rift_holder` (copies of the global values, refreshed monthly), `_sweep_value`, `_rift_best/_count`, `_free_best/_count`, state flag `zin_noris_marched`, event targets `zin_noris_rift_target`, `zin_noris_free_target`; Stabilo the same with `zin_stabilo_` plus `zin_stabilo_ledger_total/_pp/_trade`, `zin_stabilo_road_<road>` (copies), `zin_stabilo_pressed` (30 days), `zin_stabilo_cannot_pay` (730 days), `zin_stabilo_bought_off`, `zin_stabilo_debts_set`.

## Choices where a spec could not be followed literally

- **Banned words.** The text scan rejects words the specs use. Renamed (keys unchanged): The Camel Corps -> The Camel Banners; Sun and Steel -> Sun and Iron; Siege Trains -> Siege Columns; The Protectorate of the Sands -> The Wardenship of the Sands; General Hardfic Shindor -> Captain-General Hardfic Shindor; Heat-Hardened Steel -> Heat-Hardened Iron; The Lieutenants Assemble -> The Captains Assemble (event 1 too); Counsel for the Chancellor -> Counsel for the Seal-Keeper (public face), The Chancellor's Charge -> The Seal-Keeper's Charge, Ministers from the Houses -> Counsellors from the Houses. Also "divisions" in the Abyss tooltip became "companies". **Conflict for the spec owners:** `chancellor`, `minister`, `general`, `division`, `steel`, `corps`, `puppet` are in `banned_words.json`.
- **Raw blocks.** The compiler has no loop over countries. Each of Noris and Stabilo has one dispatcher (`zin_noris_sweep`, `zin_stabilo_sweep`, keyword `mode`) holding every loop, and the spec's named effects (`zin_noris_south_lean`, `zin_stabilo_debt_vassals`, ...) are thin wrappers that call it. Global variables cannot be named in a condition, so the monthly effects copy them into country variables (`zin_noris_rivalry`, `zin_stabilo_road_sand`, ...) for AI weights and conditions. "At war with a country with X" tests are tree triggers with one raw line each. The raw scripts could not be run through the HOI4 Agent Tools validator (no registered workspace in this session); they use only effects and triggers that exist in the installed documentation.
- **Stabilo.** "At war with a Magical Lands realm" and "Magical or Middle Lands" share one trigger (`zin_stabilo_at_war_with_rift_lands`). The AI choice in `zin_stabilo.31` uses stability bands instead of the political power and stockpile tests (no condition for them in the vocabulary).
- **AI formulas.** "50 + lean", "10 x footholds + bias / 2" and "dominance x 3" are banded `add` modifiers (steps at lean +-30, footholds 3 and 5, dominance 20 and 40). The historical order tables of Worshipdom are weights: the n-th listed focus gets `add` 70 - n (at least 10) under `zin_rule_afrit` HISTORICAL; "never under HISTORICAL" focuses get factor 0; ASHEN multiplies G, I, U by 3 and zeroes four flight focuses; DORMANT adds 20 to branch K.
- **Extra events.** Result pairs: Noris `.26` (Mylunur refused), `.27` (Miaed refused), `.28` (Gondolin's Watch when the dead have risen; the focus picks `.14` or `.28`); Stabilo `.26` to `.28`; Volgan `.18` (Green Crystal when Glo is with the stranger; the focus picks `.14` or `.18`); Worshipdom `.13` (the Quiet Court with a child on the throne; the dispatcher picks `.12` or `.13` by `zin_golden_king_dead`). They avoid a text that would have to change with a state.
- **Worshipdom.** Opinion modifiers used: `elves_declined`, `warned_quietly` (event options). Public names of branch D that read "Chancellor" use the Seal-Keeper wording. The `brother_against_brother` condition "at war with the country that has `zin_eindil`" is the tree trigger `zin_worshipdom_at_war_with_eindil`.
- **Noris `zin_noris_monthly`.** The drift is a list of `zin_noris_add_accord` calls (0.2, -0.1, -0.3, +0.1 per charter above two), not one sum. `zin_noris.20` is a 17 percent monthly roll at accord 20 or less (mean time about 180 days).
- **Noris/Stabilo.** `@postondoroth` falls back to the capital through the trigger `zin_stabilo_owns_postondoroth`.

## Art needs (requested picture keys, stand-ins used)

`desert_court` and `caravan_road` (Noris; `generic_court`, `generic_wilds` used), `counting_house` (Stabilo; `generic_court`), `nafeher_hall`, `abyss_depths` (Volgan; `generic_court`, `ember_lands_storm`), `mistake_wastes` (Zol; `black_isles_lights`). No icon key is missing.

## Open items

- Verification in the game (the Linux run of each spec's acceptance) is not done; only the offline checks and `focus_major_c.test.mjs` are.
- The AI approximations above should be tuned in the observer run.
- `docs/specs/05_focus_trees/major/*.md` counts agree with the data (112, 111, 114, 116, 97).
