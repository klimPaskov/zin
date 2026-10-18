# Diplomacy and factions

**Status:** Draft. **Priority:** 3. **Phase:** 3.

## Purpose

Erdae opens in a long peace. Diplomacy must keep that peace believable at the start, let it fray as the dark gathers, and give each bloc a reason to exist. This spec is the shared diplomatic frame: the seven working factions, how the Treaty of the Narrow Strait and the Lost Cause sit beside them, the subject types, the Elven Refusal and the Wall Accord, and the rules for justifying war while the peace holds.

**This spec owns:** faction templates, joining rules and manifests; the ZIN autonomy states; the Elven Refusal; the Wall Accord; casus belli and the peace-breaker rule; the Lost Cause's cross-faction musters.

**Others own:** the treaty's standing, tolls, calls and withdrawal ([Lerendor](../04_mechanics/lerendor_narrow_strait.md)); the Lost Cause's strength, paths and Concord charters ([Aenor](../04_mechanics/aenor_court_and_succession.md)); the Southern Dominion's oaths ([Volgan](../04_mechanics/volgan_southern_dominion.md)); Afrit's eastern dominion ([Afrit](../04_mechanics/afrit_hidden_council.md)); start opinions and truces ([02_lore/01_start_situation.md](../02_lore/01_start_situation.md)); ideology tension values and game rules ([00_foundation](../00_foundation/)).

## Lore basis

**Established:**

- About 280 regional polities. Leading powers and their working blocs: Aenor with the **Middle Kingdom Concord** (26 satellites), Lerendor with the **Leren Compact**, Coldor with the **Northern Accord**, Noris with the **Noris Treaty**, Stabilo with the **Stabilo Pact**, Dondor with the **Dark Sea Accord**, Volgan with the **Southern Dominion** (Demon, Dolon, Nezer). Goldoroth has no bloc; Zol has no named political satellites (*Great Powers and Relations*). The blocs are "working map arrangements"; their constitutions and origins are not detailed (*Kingdoms Factions and Conflicts*).
- Cursed Lands and Bloody Forest resist Aenor (*Middle Lands and Aenor*).
- The Golden King founds the **Lost Cause** against powers such as Volgan and Afrit, partly for prestige; its real strength is mixed; fragments may support Eindil (*The Lost Cause*).
- In the War of the Last Crowns the North Lands **withdraw from the old alliance**; the West crosses the sea; an eastern coalition threatens the Magical Lands; Volgan retakes Mirolon (*War of the Last Crowns*).
- **The Elven Refusal:** after Edran's failed Dead Lands campaign the elven kingdoms sent no armies to help men against Elzon. It must not be rewritten as a new alliance in the final invasion. Elves defend their own lands; individuals may help (*The Elven Refusal*). Lorien and the Gala elves fight Zol at the end because an Old God's victory threatens all the living (*The Fourth Age of Erdae*, XIII).
- The Great Wall of Aenor separates the Middle Lands from the Magical Lands (owner, 17 October).

**Proposed in the vault** (*Fourth Age Chronology*, *The Campaign of 4A 1748*): the Charters of Parim (4A 3); the First Concord Council (4A 212: a common army in war, free roads in peace); the name Treaty of the Narrow Strait (4A 512); the **Wall Accord** (4A 96); the Truce of the Grey Ford (4A 1745).

**Proposed in this spec:** faction constitutions, templates, rules and manifests; autonomy states; the Refusal's game rules; the Wall Accord's mechanics; casus belli; all numbers.

## Design

### The peace at the start

On 1 Thaw 4A 1748 no country is at war, seven factions exist, and the start situation's relations hold (opinions such as "The Toll of 1716", "Old Claims Remembered", "Caravan Rivalry", "Border Raids", "Edran's Folly"; the Gunwaith–Girdon truce until 1 Thaw 4A 1750). Goldoroth and Dondor are in an armed peace: raids are flavour, never a declared war at the start.

A **great war** is a war with a major on each side. The majors are the nine working-table great powers (Aenor, Lerendor, Coldor, Noris, Stabilo, Goldoroth, Dondor, Volgan, Zol), set with `set_major = yes` by the countries and states spec; scripts test `is_major = yes`. No great war may begin before the historical path or a casus belli allows it.

### The seven working factions

Created in history with ZIN faction templates (replacing `faction_template_generic`). Names keep their current localisation keys (`ZIN_FACTION_<leader>`). Constitutions are proposed.

| Faction | Leader | Members at start | Purpose (proposed) | Template |
| --- | --- | --- | --- | --- |
| **Middle Kingdom Concord** | Aenor | The 26 chartered dominions | A common army in war, free roads in peace | `zin_faction_concord` |
| **Leren Compact** | Lerendor | Eekedor | The North's fleets and its command of the strait | `zin_faction_leren_compact` |
| **Northern Accord** | Coldor | Horidor | One crown over the frozen interior; a check on Isengard | `zin_faction_northern_accord` |
| **Noris Treaty** | Noris | Gondolin | The northern caravan roads and the desert | `zin_faction_noris_treaty` |
| **Stabilo Pact** | Stabilo | Drak | The southern caravan roads | `zin_faction_stabilo_pact` |
| **Dark Sea Accord** | Dondor | Belonton | Defence against Goldoroth around the Sea of Darkness | `zin_faction_dark_sea_accord` |
| **Southern Dominion** | Volgan | Demon, Dolon, Nezer (sworn realms) | Volgan's dominion of the Dead Lands | `zin_faction_southern_dominion` |

One more template exists for a faction formed in play: **the Western Crossing** (`zin_faction_western_crossing`), created by the [Western Crossing](../04_mechanics/western_crossing.md) mechanic when the West's coalition sails. Its joining rule is `zin_faction_rule_join_crossing`; its other rules are `war_declaration_rule_faction_leader_only`, `call_to_war_rule_faction_leader_only`, `change_leader_rule_never` and `faction_peace_rule_conquest_focus`; it has no manifest.

Rules per faction (ids beginning `zin_faction_rule_` are new; the rest are vanilla):

| Faction | Joining | War declaration | Call to war | Leader change | Peace |
| --- | --- | --- | --- | --- | --- |
| Concord | `zin_faction_rule_join_concord`, `zin_faction_rule_join_no_refusal`, `zin_faction_rule_join_not_shadow` | `war_declaration_rule_faction_leader_only` | `call_to_war_rule_faction_leader_only` | `change_leader_rule_never` | vanilla default |
| Leren Compact | `zin_faction_rule_join_leren`, `zin_faction_rule_join_no_refusal` | `war_declaration_rule_any_country` | `call_to_war_rule_faction_leader_only` | `change_leader_rule_never` | `faction_peace_rule_no_puppeting` |
| Northern Accord | `zin_faction_rule_join_cold_lands`, `zin_faction_rule_join_no_refusal` | `war_declaration_rule_any_country` | `call_to_war_rule_major_only` | `change_leader_rule_manpower` | vanilla default |
| Noris Treaty | `zin_faction_rule_join_east_lands`, `zin_faction_rule_join_no_refusal` | `war_declaration_rule_any_country` | `call_to_war_rule_major_only` | `change_leader_rule_industry` | vanilla default |
| Stabilo Pact | `zin_faction_rule_join_east_lands`, `zin_faction_rule_join_no_refusal` | `war_declaration_rule_any_country` | `call_to_war_rule_major_only` | `change_leader_rule_industry` | vanilla default |
| Dark Sea Accord | `zin_faction_rule_join_dark_lands`, `zin_faction_rule_join_no_refusal`, `zin_faction_rule_join_not_shadow` | `war_declaration_rule_any_country` | `call_to_war_rule_major_only` | `change_leader_rule_manpower` | vanilla default |
| Southern Dominion | `zin_faction_rule_join_sworn` | `war_declaration_rule_faction_leader_only` | `call_to_war_rule_faction_leader_only` | `change_leader_rule_never` | `faction_peace_rule_conquest_focus` |

New joining rules (type `joining_rule`; scope = joining country, FROM = leader). Region tests use the generated state triggers `zin_is_region_<key>` on the joiner's capital, as the warfare and Lerendor specs do.

| Rule | Trigger |
| --- | --- |
| `zin_faction_rule_join_concord` | capital in the Middle Lands or Aenor Isle; or `is_subject_of = FROM`; or (`zin_lost_cause_shield` and `has_country_flag = zin_lost_cause_member`), so the Aenor spec's Shield path can bring honorary crowns in |
| `zin_faction_rule_join_leren` | `zin_leren_is_north_crown` or `zin_leren_is_dark_shore` (Lerendor spec), or `is_subject_of = FROM` |
| `zin_faction_rule_join_<region>` (cold_lands, east_lands, dark_lands) | capital in that region, or `is_subject_of = FROM` |
| `zin_faction_rule_join_no_refusal` | `NOT = { zin_diplo_refusal_binds = yes }` |
| `zin_faction_rule_join_not_shadow` | `NOT = { has_government = communism }` (Shadow) |
| `zin_faction_rule_join_sworn` | `is_subject_of = FROM`, or capital in the Dead Lands or the Dark Lands (Volgan's sworn Dark Lands realms; the Volgan spec controls who is invited) |
| `zin_faction_rule_join_crossing` | `has_country_flag = zin_region_west_lands` or `zin_region_tritons_islands`, or a Cold Lands country with `zin_cold_joins_crossing` (Western Crossing spec) |

**Manifests** (proposed). They need the faction DLC; without it the factions still work, and no ZIN logic reads manifest progress.

| Faction | Manifest | Progress | Fulfilled bonus |
| --- | --- | --- | --- |
| Concord | `zin_faction_manifest_common_defence` | Members with `zin_concord_loyalty` ≥ 50 ÷ members (global variables `zin_diplo_concord_loyal`, `zin_diplo_concord_members`, set monthly) | `production_factory_max_efficiency_factor = 0.05` |
| Leren Compact | `zin_faction_manifest_lords_of_the_strait` | North Lands states controlled ÷ all North Lands states | `naval_damage_factor = 0.05` |
| Northern Accord | `zin_faction_manifest_frozen_crown` | Cold Lands states controlled ÷ all | `winter_attrition_factor = -0.10` |
| Noris Treaty | `zin_faction_manifest_northern_roads` | East Lands states controlled ÷ all | `trade_opinion_factor = 0.10` |
| Stabilo Pact | `zin_faction_manifest_southern_roads` | as above | `trade_opinion_factor = 0.10` |
| Dark Sea Accord | `zin_faction_manifest_hold_the_dark_sea` | Dark Lands states not controlled by Goldoroth ÷ all | `army_defence_factor = 0.05` |
| Southern Dominion | `zin_faction_manifest_dominion_of_the_south` | Dead Lands states controlled ÷ all | `army_attack_factor = 0.05` |

Denominators come from generated state collections named `zin_region_<key>` (`common/collections/zin_regions.txt`; the eastern kings spec reads `zin_region_east_lands`), frozen at build time so conquest does not change them. They share their names with the economy spec's country flags on purpose: one is the list of a region's states, the other marks a realm's region of origin. Each faction also takes two vanilla goals (`faction_goal_growing_the_faction` and one military goal) until the events phase writes ZIN goals.

### The Treaty of the Narrow Strait

The treaty is not a faction or an engine guarantee. The Lerendor spec owns it: `zin_strait_standing`, the toll quarrel, Lerendor's call to honour (`zin_leren.20`), the withdrawal (`zin_leren_withdraw`, setting `zin_leren_withdrawal`), and the trigger `zin_leren_treaty_in_force`. That spec leaves Aenor's own obligation open; this spec fills it:

- While `zin_leren_treaty_in_force`, when Lerendor has a defensive war against a country that is not Aenor's ally, Aenor gets `zin_diplo.11` "The North Calls on the Treaty" once per war:

| Option | Effect | AI |
| --- | --- | --- |
| Send the host north | Aenor joins Lerendor's defensive wars (`add_to_war`); `zin_leren_add_strait_standing` +15 | Any ruler but the Golden King: honour if not at war with a major |
| Send words, not ships | No war; `zin_leren_add_strait_standing` −10 | The Golden King always (he will not spend his army) |

### The Lost Cause as a league

The Aenor spec owns the league: its strength `zin_aenor_lost_cause` (Aenor, 0–100), its three paths (ornament; Shield of the Concord, `zin_lost_cause_shield`; Eindil's army, `zin_lost_cause_with_eindil`), its honorary crowns (country flag `zin_lost_cause_member`; Mirolon at start) and the division of the league when Eindil comes (`zin_aenor.160`). Honorary membership carries no faction or war obligation. This spec adds only what crosses faction lines:

**The league's lord** is the Aenor realm, until `zin_lost_cause_with_eindil` is set; then it is Eindil's host (`global.zin_eindil_host`, Eindil's journey spec).

**One entry point for other specs.** Specs other than Aenor's change the league's strength through `zin_lost_cause_add_strength` (argument `value`). It runs the Aenor spec's `zin_aenor_add_lost_cause` in the scope of the original Aenor realm, so the number lives in one place whoever leads the league.

**Name an Honorary Crown** (decision of the lord, targeted, 50 political power, 180-day cooldown per target). Target: any country that is not Shadow, not bound by the Elven Refusal, not a dark power. The target gets `zin_diplo.23`: accept (country flag `zin_lost_cause_member`, +15 opinion of the lord) or decline. AI acceptance: base −20; +20 if `zin_gathering_dark` ≥ 25; +30 if it borders a dark power; + the target's opinion of the lord ÷ 4.

**The muster.** When a dark power (`zin_diplo_is_dark_power`: Volgan, a Southern Dominion member, Zol, or Afrit's country once `zin_afrit_revealed`) declares war on Aenor, a Concord dominion or an honorary crown, and `zin_aenor_lost_cause` ≥ 30, every other honorary crown and every Concord dominion not already in the war gets `zin_diplo.20` "The Lost Cause Musters": join the defender (`add_to_war`, `zin_aenor_add_lost_cause` +2) or stand aside (`zin_aenor_add_lost_cause` −1). An honorary crown that stands aside twice loses `zin_lost_cause_member`. Dominions are already bound by their charters; for them the event only offers the league's thanks or reproach.

### Subjects

Three ZIN autonomy states (proposed). Vanilla `autonomy_puppet` stays for conquest puppets and is renamed **Vassal**.

| Autonomy state | Used for | Key settings |
| --- | --- | --- |
| `zin_autonomy_chartered_dominion`: Chartered Dominion | The Concord's 26 dominions | `min_freedom_level = 0.5`; rule `can_not_declare_war = yes`, `can_decline_call_to_war = no` (a common army in war); modifier `extra_trade_to_overlord_factor = 0.25`, `overlord_trade_cost_factor = -0.25`, `autonomy_manpower_share = 0.10` |
| `zin_autonomy_sworn_realm`: Sworn Realm | Demon, Dolon and Nezer under Volgan | `min_freedom_level = 0`; `can_not_declare_war = yes`, `can_decline_call_to_war = no`; `autonomy_manpower_share = 0.30` |
| `zin_autonomy_client_crown`: Client Crown | Available to the Afrit spec for eastern crowns that follow the King of the East | `min_freedom_level = 0.4`; `can_not_declare_war = no`; `extra_trade_to_overlord_factor = 0.15` |

Loyalty, charters and secession are the Aenor spec's; oaths and breaking free are the Volgan spec's. Neither the autonomy score drift nor the release of a subject is scripted here.

### The Elven Refusal

The Refusal is established history and starts in force: global flag `zin_elven_refusal`, never cleared during the Fourth Age.

**Who it binds** (`zin_diplo_refusal_binds`): every country with `zin_people_elves` or `zin_people_sun_elves` without the country flag `zin_refusal_lifted`. Binding the Sunhot elves too is a proposed game choice; the vault does not say whether they took part.

**What it does:**

- Bound realms cannot join the six human factions (joining rule).
- Bound realms have `set_rule = { can_send_volunteers = no }`; their AI never sends lend-lease to a human realm (`send_lend_lease_desire` −100).
- Bound realms may always defend themselves, ally with other elves and form their own factions.
- Individuals still help and never break the Refusal: elven healers and wanderers (elven specs), Varner and Golbran, and the dragon entrusted to Eindil ([04_magic_and_world_systems.md](04_magic_and_world_systems.md)).

**How it lifts** (per realm; `zin_diplo_lift_refusal` sets `zin_refusal_lifted`):

| Way | Who | Condition |
| --- | --- | --- |
| The Old Lords Ride | Gala Elves (historical) | The Zol spec's event `zin_mistake.22` (Lorien rides against the manifested Zol) calls `zin_diplo_lift_refusal` for every realm that rides |
| Break the Refusal (decision) | Any bound realm | 100 political power; at war with a dark power that controls one of its states, and `zin_gathering_dark` ≥ 75 |
| The elves march | AI only | Game rule `zin_rule_ai_elves = MARCH`: AI realms lift at `zin_gathering_dark` ≥ 75 if any elven realm is at war with a dark power. `RANDOM`: half of them, decided at start. `DEFAULT`: only the two ways above |

A lifted realm returns to the Refusal 365 days after its last war with a dark power ends (`zin_refusal_lifted` cleared; it leaves any human faction).

### The Wall Accord

Proposed (vault, 4A 96): Aenor and the elven realms keep the Great Wall as a customs line and a shared guard.

**At start:** global flag `zin_wall_accord`; a non-aggression pact between Aenor and each elven realm that owns a state bordering a Great Wall state (`zin_is_site_great_wall`; the builder computes the list); opinion `zin_opinion_wall_accord` +15 both ways. While the Accord holds, Aenor earns the Wall customs in its treasury ([02_economy.md](02_economy.md)).

**Breaking it.** If Aenor or a chartered dominion declares war on an Accord realm, or an Accord realm declares war on them, `on_declare_war` sets `zin_wall_accord_broken` and clears `zin_wall_accord`. Effects: the pacts end; every elven realm gets `zin_opinion_wall_broken` (−50) toward the breaker; `zin_world_add_gathering_dark` +3; for 1,825 days no elven realm may use Break the Refusal on the breaker's side. An attack on the elves by a third party (the eastern invasion) does not break the Accord.

### War justification during the peace

**How it is gated.** Engine world tension follows `zin_gathering_dark` ([05_world_tension_and_endings.md](05_world_tension_and_endings.md)). Each ideology's `generate_wargoal_tension` (set in the foundation's ideology table) then decides who may justify a war goal without a cause. Today Light has 1.0 (only against threatening countries) and Wild 0.5. Dominion and Shadow have none, so they could justify at once; this spec asks the foundation to give both **0.25** (open question 1). Engine tension is kept at (meter − 10) ÷ 100, so it is 0 at the start value of 10. With the requested value nobody may justify freely at the start: Dominion and Shadow gain the right when the meter reaches 35, Wild at 60, Light only against countries that threaten.

**Casus belli.** A cause lets one country justify against one target whatever the meter. Each is a dynamic modifier on the holder with a targeted `generate_wargoal_tension_against` toward the target. The sign follows vanilla's `imperial_sanction` leader trait, which uses a positive targeted value to let Japan justify on China; confirm it in a test. All are proposed.

| Cause | Holder → target | Granted when | Lasts |
| --- | --- | --- | --- |
| `zin_cb_broken_truce` | Gunwaith ↔ Girdon | The Truce of the Grey Ford breaks (the Western Crossing spec's `zin_west_break_truce`; historically 1 Rainwake 4A 1750) | 730 days |
| `zin_cb_old_grudge` | Any West Lands country → Aenor | `zin_gathering_dark` ≥ 40, or the Western Crossing event | 1,825 days |
| `zin_cb_caravan_roads` | Noris ↔ Stabilo | A Caravan Quarrel is pressed while `zin_gathering_dark` ≥ 25 ([02_economy.md](02_economy.md)) | 365 days |
| `zin_cb_orc_raids` | Goldoroth ↔ Dondor and Dark Sea Accord members | A raid event while `zin_gathering_dark` ≥ 25 | 365 days |
| `zin_cb_crown_defied` | Aenor → Cursed Lands, Bloody Forest | `zin_gathering_dark` ≥ 25 | 365 days |
| `zin_cb_against_the_dark` | Any country → each dark power | `zin_gathering_dark` ≥ 50 | while the condition holds |
| `zin_cb_eastern_ambition` | East Lands countries with `zin_footholds` ≥ 3 → Magical Lands realms and Aenor | `zin_eastern_invasion` (unless the eastern kings mechanic grants its own war goals) | 730 days |

Volgan's war on Mirolon, Lerendor's claims and the Concord's restoration wars are created by their own mechanics, not by causes here. Mechanic specs may define further causes in their own files in the same form and grant them through `zin_diplo_grant_cb` (the eastern kings spec adds `zin_cb_free_east` and `zin_cb_high_king`).

**Breaking the long peace.** A country that declares war while `zin_world_peace_holds` (meter below 25 and no great war) gets `zin_diplo_peace_breaker` for 180 days (`stability_factor = -0.10`, `war_support_factor = -0.05`) and adds +2 to the meter. Wars declared by story events are exempt (their events set the temporary country flag `zin_story_war` before declaring).

**Historical wars** are created by their owners' events (`create_wargoal`, `declare_war_on`), so the AI cannot fail to start them ([06_historical_path_and_ai.md](06_historical_path_and_ai.md)).

## Implementation

### Files

| Path | Content |
| --- | --- |
| `common/factions/templates/zin_factions.txt` | The seven templates and `zin_faction_western_crossing` |
| `common/factions/rules/zin_joining_rules.txt` | `zin_faction_rule_join_*` |
| `common/factions/goals/zin_faction_manifests.txt` | The seven manifests |
| `common/collections/zin_regions.txt` | Region state collections `zin_region_<key>` |
| `common/autonomous_states/zin_chartered_dominion.txt`, `zin_sworn_realm.txt`, `zin_client_crown.txt` | Autonomy states |
| `common/dynamic_modifiers/zin_diplomacy.txt` | The seven causes |
| `common/ideas/zin_diplomacy.txt` | `zin_diplo_peace_breaker` |
| `common/opinion_modifiers/zin_diplomacy.txt` | `zin_opinion_wall_accord`, `zin_opinion_wall_broken` |
| `common/decisions/zin_diplomacy.txt` | Name an Honorary Crown, Break the Refusal |
| `common/scripted_triggers/zin_diplomacy.txt`, `common/scripted_effects/zin_diplomacy.txt` | Below |
| `common/on_actions/zin_diplomacy.txt` | `on_declare_war` (musters, Wall Accord, peace breaker); `on_monthly` (manifest counters, Refusal expiry); `on_startup` (flags, pacts, rules) |
| `events/zin_diplo.txt` | Namespace `zin_diplo` |
| `history/countries/*.txt` | Templates and autonomy states (politics step) |
| `localisation/english/zin_diplomacy_l_english.yml` | Text |

### Names

| Name | Kind | Meaning |
| --- | --- | --- |
| `zin_elven_refusal` | global flag | The Elven Refusal stands |
| `zin_refusal_lifted` | country flag | This elven realm has set the Refusal aside for now |
| `zin_wall_accord`, `zin_wall_accord_broken` | global flags | The Wall Accord holds / was broken |
| `zin_eastern_invasion` | global flag | The eastern coalition has invaded the Magical Lands (set by the eastern kings mechanic; 4A 1755 historically) |
| `zin_story_war` | country flag, 1 day | The war being declared is a story war (exempt from the peace-breaker rule) |
| `zin_diplo_concord_members`, `zin_diplo_concord_loyal` | global variables | Manifest counters |
| `zin_diplo_is_dark_power` | scripted trigger | Volgan, a Southern Dominion member, Zol, or (once `zin_afrit_revealed`) the realm Afrit rules (`zin_afrit_rules_here`) or the Worshipdom (`zin_afrit_is_hub`) |
| `zin_lost_cause_add_strength` | scripted effect | Argument `value`: runs `zin_aenor_add_lost_cause` in the original Aenor realm |
| `zin_diplo_refusal_binds` | scripted trigger | Elven realm without `zin_refusal_lifted` |
| `zin_diplo_grant_cb` | scripted effect | Args `cb`, `target`, `days`: adds the cause |
| `zin_diplo_lift_refusal` | scripted effect | Sets `zin_refusal_lifted` on the scoped realm and removes its volunteer ban |

`zin_world_peace_holds` is defined in the tension spec.

### Events (`zin_diplo`)

| Id | Purpose |
| --- | --- |
| `zin_diplo.1` | Hidden startup: flags, Wall Accord pacts, elven rules |
| `zin_diplo.11` | The North calls on the treaty (Aenor) |
| `zin_diplo.20` | The Lost Cause musters |
| `zin_diplo.23` | Invitation to be an honorary crown |
| `zin_diplo.30` | An elven realm breaks the Refusal (news to elves and Aenor) |
| `zin_diplo.31` | A realm returns to the Refusal |
| `zin_diplo.40` | The Wall Accord is broken (news) |
| `zin_diplo.60`–`.69` | Cause flavour: raids, caravan clashes, the Grey Ford breaking, a crown defied |

Every text obeys the secret: until `zin_afrit_revealed` nothing names Afrit, and tooltips list the dark powers as "Volgan, Zol and their servants".

## AI

- **Factions.** Leaders invite only countries their joining rule allows, and only when `zin_gathering_dark` ≥ 25 (the Concord: ≥ 50 for non-dominions, and only on the Shield path). The Southern Dominion invites only after `zin_volgan_marches`. The Leren Compact invites through the Lerendor spec's decision.
- **Aenor and the treaty.** As in the event table.
- **Musters.** Honorary crowns join when they border the aggressor or `zin_aenor_lost_cause` ≥ 60; otherwise they stand aside.
- **Honorary crowns.** The lord names one when `zin_gathering_dark` ≥ 25, preferring neighbours of dark powers; the Golden King names one a year regardless (prestige).
- **Elves.** Bound realms never ask to join human factions. Under `zin_rule_ai_elves = DEFAULT`, the AI breaks the Refusal only when a dark power holds its own states.
- **Causes.** The AI uses a cause only when it out-produces the target or its faction does.
- **Strategies** (`common/ai_strategy/zin_diplomacy.txt`): `befriend` within each faction; `antagonize` 20 for each start-rival pair; `dont_join_wars_with` from bound elven realms toward human realms; `alliance` −100 from bound elves toward the human factions.

## Acceptance

1. On 1 Thaw 4A 1748 the seven factions exist with the members above, no country is at war, and the Wall Accord pacts are in force (Linux run, console).
2. For 365 days of AI play with the meter below 25, no great war begins (Linux run, 3 seeds).
3. With the requested ideology value, a Dominion country cannot justify against a non-threatening neighbour at start; it can after receiving a cause against that neighbour (console test).
4. Aenor declaring war on the Magical Forest sets `zin_wall_accord_broken`, ends the pacts and adds 3 to the meter.
5. A bound elven realm cannot join the Concord or send volunteers; after `zin_mistake.22` the Gala Elves can.
6. With Lerendor in a defensive war and the treaty in force, Aenor receives `zin_diplo.11` once per war; under the Golden King the AI sends words.
7. A dark power declaring war on Mirolon with `zin_aenor_lost_cause` ≥ 30 fires `zin_diplo.20` to the other honorary crowns and the dominions.
8. No text reachable before `zin_afrit_revealed` contains "Afrit" (compiler check).

## Open questions

1. May Dominion and Shadow get `generate_wargoal_tension = 0.25` in the foundation's ideology table? Without it, the "no great war at start" rule rests on the AI alone.
2. The vault lists **Andos Enda** as a Leren Compact member, but the map makes it an elven realm bound by the Refusal. Keep it out (as here), or make an exception?
3. Do the Sunhot elves share the Elven Refusal, or only the Magical Lands elves and Gala?
4. Should the Concord's constitution (a common army in war, free roads in peace) become canon?
5. Which crowns, besides Mirolon, were honorary members of the Lost Cause at its founding?
