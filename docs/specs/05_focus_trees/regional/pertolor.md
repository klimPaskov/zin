# Regional tree: Pertolor (regional_pertolor)

Pertolor (PRT) is a regional tier B tree (30 to 50 focuses). It replaces the retired Yeldenne tree (K56): the town of Simoto, the castle and its landing, and Glo's hall now belong to Pertolor. The tree is `docs/design/focus/regional_pertolor.json`, assigned to the country `Pertolor` in the tiers spec ([01_tiers_and_coverage.md](../01_tiers_and_coverage.md)). Horos is story only and gates nothing in this tree.

Sources: [realm roots, Pertolor section](../../02_lore/realm_roots/cold_lands.md) (the Ram's Due, the Black-Faced Ram, the town below the castle, the two weddings), and the retired `regional_yeldenne` tree for the valley, the headmen, the landing and the hall chain (`git show HEAD:docs/design/focus/regional_yeldenne.json`).

## Branches

1. **The headmen and the town**: the Headmen's Hall, the Headmen's Council (event), the Loaf Custom, the Town Below the Castle, the Charter of Simoto, the Valley Road, the Valley Levy, the Wall of Simoto, and the Unyielding Hall (setter of the Glo hall flag `zin_glo_hall_unyielding`).
2. **The Ram's Due**: the Ram's Due, the Due Paid (spirit `faith_high_ground`), the Due Untouched (event), the Ram Fair, the Long Light, the Black-Faced Flock (spirit `black_faced_line`), the Wool Market, and Mutton for the Crowns.
3. **Cousins to Both Crowns**: the marriage offers from Melkgard and Coldor (mutually exclusive, each a non-aggression pact), the Hozening Match and the Marriage Gifts.
4. **The watch on the coast and the landing** (landing flags `zin_pertolor_coast_watch`, `zin_pertolor_beacon`, `zin_pertolor_guides`): the Tribes of the Ice, Watchers on the Coast, Light the Shore Beacon, Await the Worthy (`zin_glo_awaits_heir`), and Send Guides to the Landing.
5. **The hall of Glo** (flags `zin_glo_seal_warded`, `zin_glo_calls_heir`, `zin_glo_calls_bearer`): Seal the Hall, Deny the Dark, and the mutually exclusive pair Open for the Heir and Seek a Second Bearer.

## Focus table

Rows are the tree's focuses in file order. A focus prerequisite list with several groups means each group needs one of its entries (AND across groups).

| Key | Name | x | y | Days | Prerequisites | Exclusive | Icon |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `headmens_hall` | The Headmen's Hall | 0 | 0 | 35 | - | - | `council_table` |
| `the_headmen_council` | The Headmen's Council | 2 | 1 | 35 | headmens_hall | - | `feast_table` |
| `the_loaf_custom` | The Loaf Custom | 1 | 1 | 35 | headmens_hall | - | `alms_bread` |
| `the_town_below` | The Town Below the Castle | 0 | 2 | 35 | headmens_hall | - | `guild_hall` |
| `the_valley_treaty` | A Treaty with the Valley | 1 | 4 | 35 | the_town_below | - | `envoy` |
| `simoto_charter` | The Charter of Simoto | 0 | 3 | 35 | the_town_below | - | `charter_old` |
| `the_valley_road` | The Valley Road | 1 | 3 | 35 | the_loaf_custom | - | `traders_road` |
| `the_valley_levy` | The Valley Levy | 3 | 4 | 35 | the_valley_road | - | `levy_muster` |
| `the_town_wall` | The Wall of Simoto | 0 | 4 | 35 | simoto_charter | - | `fort_wall` |
| `the_unyielding_hall` | The Unyielding Hall | 0 | 5 | 70 | the_town_wall | - | `palace_wards` |
| `the_ram_s_due` | The Ram's Due | 4 | 0 | 35 | - | - | `herds` |
| `the_due_paid` | The Due Paid | 4 | 1 | 35 | the_ram_s_due | - | `seal_wax` |
| `the_due_untouched` | The Due Untouched | 3 | 2 | 35 | the_due_paid | - | `footprints_snow` |
| `the_ram_fair` | The Ram Fair | 5 | 2 | 35 | the_due_paid | - | `banner_plain` |
| `the_long_light` | The Long Light | 4 | 2 | 70 | the_due_paid | - | `castle_ice` |
| `the_black_faced_flock` | The Black-Faced Flock | 5 | 3 | 35 | the_long_light | - | `herds` |
| `the_wool_market` | The Wool Market | 5 | 4 | 35 | the_black_faced_flock | - | `market_stalls` |
| `mutton_for_the_crowns` | Mutton for the Crowns | 6 | 4 | 35 | the_black_faced_flock | - | `caravan` |
| `cousins_to_both_crowns` | Cousins to Both Crowns | 8 | 0 | 35 | - | - | `two_crowns` |
| `the_hozening_match` | The Hozening Match | 8 | 1 | 35 | cousins_to_both_crowns | - | `banner_league` |
| `a_melkgard_match` | A Match with Melkgard | 7 | 2 | 35 | the_hozening_match | a_coldor_match | `handshake_oath` |
| `a_coldor_match` | A Match with Coldor | 9 | 2 | 35 | the_hozening_match | a_melkgard_match | `crown_iron` |
| `marriage_gifts` | The Marriage Gifts | 9 | 3 | 35 | a_coldor_match | - | `feast_table` |
| `the_tribes_of_the_ice` | The Tribes of the Ice | 2 | 4 | 35 | the_valley_road | - | `ice_field` |
| `watchers_on_the_coast` | Watchers on the Coast | 2 | 5 | 35 | the_tribes_of_the_ice | - | `lighthouse` |
| `light_the_shore_beacon` | Light the Shore Beacon | 2 | 6 | 35 | watchers_on_the_coast | - | `beacon` |
| `await_the_worthy` | Await the Worthy | 3 | 5 | 70 | the_tribes_of_the_ice | - | `heir_rolls` |
| `send_guides_to_the_landing` | Send Guides to the Landing | 3 | 7 | 35 | light_the_shore_beacon + await_the_worthy | - | `compass_rose` |
| `seal_the_hall` | Seal the Hall | 4 | 7 | 35 | await_the_worthy | - | `crystal_green` |
| `deny_the_dark` | Deny the Dark | 4 | 8 | 70 | seal_the_hall | - | `ward_circle` |
| `open_for_the_heir` | Open for the Heir | 3 | 9 | 35 | deny_the_dark | seek_a_second_bearer | `frozen_gate` |
| `seek_a_second_bearer` | Seek a Second Bearer | 5 | 9 | 70 | deny_the_dark | open_for_the_heir | `potent_blade` |

## Events and spirits

- Event `pertolor_headmen_council` (focus the_headmen_council): keep the loaf law (stability) or open the market to the crowns' buyers (political power, stability loss).
- Event `pertolor_due_untouched` (focus the_due_untouched): send the best ram up the road (stability) or leave the step empty (stability loss, manpower loss).
- Spirit `faith_high_ground` (stability factor) and spirit `black_faced_line` (consumer goods factor), added by the Due Paid and the Black-Faced Flock.

## Adaptations from the retired Yeldenne tree

- Kept: the landing focuses and their flags, the hall chain and its flags, the Long Watch's headmen as the Headmen's Hall, the valley's tithe and levy content as the Valley Levy and the Valley Road, the Judgment Seat and Eyes in the South dropped.
- Retired: anything gated on or about Horos (`zin_horos_dead` bypasses, the Horos ruler, the Judgment Seat and the Guardian Endures), the ward effects (`zin_yeldenne_add_wards`, retired with the Yeldenne wards idea), the Wardens of Mp'E spirit and its Warden, the Roll of the Rejected and the Pilgrims line, the claimant event of Seek a Second Bearer (`zin_regional_yeldenne.8`, retired with the tree), and the Yeldenne stage check.
- Open: the Restorable Identity "Wardens of the Silent Road" from the realm roots is not built, because its gate is `zin_horos_dead`; the owner must choose a Pertolor-side gate before it is added.

## Open items

- Icons are reused from the existing focus icon catalog. Each focus is queued for its own icon under lane I4.
- Localisation keys are generated from the tree's name and description fields by the focus compiler.
- Focus AI weights were changed only by the tree's own values (the originals from the retired tree); the probability audit of this tree is not yet run.
