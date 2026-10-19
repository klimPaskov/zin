# Zol's Mistake

**Status:** Ready. Reviewed 19 October 2026 against CONVENTIONS "Status"; integrated 19 October 2026. **Priority:** 3. **Phase:** 3.

## Purpose

Zol's Mistake is the black north: a near-empty realm of the dead held by Zol, the Old God of Death, who has no body. This spec makes it play unlike any other realm. Zol does not tax, trade or make treaties. He endures the Fading, his unknown servants sustain his presence, and his power grows very slowly. On the historical path his dead rise beyond the Mistake in 4A 1755, he manifests once in 4A 1757 at great cost, and he withdraws. The mechanic gives a player as Zol a full game from the quiet start to the withdrawal and beyond, and gives the AI a reliable historical route.

Related specs: [00_shared_contract.md](00_shared_contract.md), [00_contract_additions.md](00_contract_additions.md), [../INTEGRATION_DECISIONS.md](../INTEGRATION_DECISIONS.md) (N1, N2, S4, S8, S11, V1, V4, and from the review to Ready E1, E2, F3, O4, O6, R1, R2, R3), [../05_focus_trees/major/zol.md](../05_focus_trees/major/zol.md), [../01_map/01_map_accuracy.md](../01_map/01_map_accuracy.md), [../01_map/02_key_sites.md](../01_map/02_key_sites.md), [../01_map/03_known_issues.md](../01_map/03_known_issues.md), [../00_foundation/01_start_and_calendar.md](../00_foundation/01_start_and_calendar.md), [../00_foundation/02_ideologies_and_politics.md](../00_foundation/02_ideologies_and_politics.md) (Zol's emblem leader), [../00_foundation/05_defines_and_rules.md](../00_foundation/05_defines_and_rules.md) (game rules), [../03_gameplay/01_warfare.md](../03_gameplay/01_warfare.md) (the deathless units), [../03_gameplay/04_magic_and_world_systems.md](../03_gameplay/04_magic_and_world_systems.md) (potent magic, the Fading's invariants), [../03_gameplay/05_world_tension_and_endings.md](../03_gameplay/05_world_tension_and_endings.md), [../03_gameplay/06_historical_path_and_ai.md](../03_gameplay/06_historical_path_and_ai.md) (checkpoints 16 and 23), and in this folder [volgan_southern_dominion.md](volgan_southern_dominion.md), [eindil_journey.md](eindil_journey.md), [yeldenne_and_glo.md](yeldenne_and_glo.md), [lands_of_the_sun.md](lands_of_the_sun.md) (Lorien's ride), [elves_wall_and_dragons.md](elves_wall_and_dragons.md), [lerendor_narrow_strait.md](lerendor_narrow_strait.md), [dark_lands.md](dark_lands.md) and [aenor_court_and_succession.md](aenor_court_and_succession.md).

**Depends on:** the calendar spec (today the game still starts on 1936.1.1.12; every date below is an Erdae engine date such as `1755.5.1`, valid once the game starts on `1748.3.1.12`); the phase 1 fix of Zol's population, industry and resources (today Zol holds 37 million manpower, 82 factories and almost half the world's steel: [../01_map/03_known_issues.md](../01_map/03_known_issues.md)); the magic spec's `zin_has_potent_magic`; the warfare spec's deathless units (until they ship, the fallbacks named below).

## Lore basis

### Established (vault, fixed)

| Fact | Source |
| --- | --- |
| Zol is the only Old God in Erdae, the God of Death. He arrived before Aen and Volgan. | *Zol*, *Old Gods* |
| Zol's Mistake is the whole black north and every black island of the Ocean of Zol: a barren wasteland, sparsely populated, roamed by the dead. Šodolôrō lies in it. | *Zols Mistake* |
| The working seat is Furviatlon. Who administers it for Zol (Great Spirit, Lesser Spirit, New God, undead order or other) is **unknown**. | *Zols Mistake*, *Idea Bank* |
| The dead wandering the land have no established classification or allegiance. Do not assume they all belong to Zol. | *Zols Mistake* |
| The Fading and Erdae's incompatible magic stop Zol from using his power freely or holding an ordinary body. His underlying power is immense and grows very slowly every day. Stored power and expressed power are separate matters. | *Zol*, *The Fading* |
| Servants (Great Spirits, Lesser Spirits and even New Gods) feed or sustain his presence. Without them he could fade out of Erdae (not be destroyed). What they collect or transfer, and why the New Gods serve, is **unknown**. | *Magic and Sustenance in Erdae*, *New Gods* |
| The identities of his servants are unknown. No canon names may be generated for them. | *New Gods*, *Great Powers and Relations* |
| His dead stir in the islands of the Ocean of Zol at the start, and ordinary weapons cannot end them. | *The Campaign of 4A 1748* (marks this established) |
| Late in the Fourth Age his forces emerge from the black north, through islands and straits toward the settled kingdoms. His dead are sustained by his own death-magic. Ordinary weapons break their shapes but cannot end them. Only potent magic, such as Glo's and Horos's sword, can. | *Zol*, *The Fourth Age of Erdae*, *War of the Last Crowns* |
| Zol's dead and Volgan's forces first clash, then briefly join against Eindil. Their relationship is otherwise not established. | *War of the Last Crowns*, *Kingdoms Factions and Conflicts* |
| Zol manifests bodily once, rarely, temporarily and at great cost. He stops Eindil, crushes Horos's sword and drains New God power from him. Eindil wounds the form with a shard. Lorien and ancient spirits die or exhaust themselves forcing him to withdraw. He is wounded and constrained, not killed; his remaining hosts lose coherence or withdraw from the field. | *Zol*, *Fourth Age Canon Register*, *Lorien*, *The Fourth Age of Erdae* |
| Varner dies shielding the living from Zol's death-magic. | *Varner*, *Fourth Age Canon Register* |
| What remains of Zol after the battle, and the mechanism of the manifestation, are **open**. | *Open Questions*, *Fourth Age Canon Register* |
| Aenor is Zol's rival in the working political table. Zol has no named political satellites. | *Great Powers and Relations* |

### Proposed (this spec or the proposed chronicle)

| Item | Status |
| --- | --- |
| Historical dates: rising 4A 1755, manifestation and withdrawal 4A 1757 | proposed (*Fourth Age Chronology*) |
| Fishermen's tales of black ships in 4A 1744; at the start only island fishermen see the stirring, and no court believes them | proposed (*Fourth Age Chronology*, *The Campaign of 4A 1748*) |
| Furviatlon as the seat | working table (*Great Powers and Relations*) |
| The leader shown as the emblem "The Will of Zol"; armies as numbered hosts | decided (S4); the emblem's name is proposed (foundation spec) |
| Manifestation explanation: immense death, ancient routes of power prepared by servants, and the breaking of Volgan's forces aligned enough magic | proposed (*The Fourth Age of Erdae*) |
| Every number, variable, decision, event and the gameplay names below (the Presence, servant bonds, the Convergence, Black Hulls, hosts, the Deathfield) | proposed, this spec |

### Rules this spec must never break

1. Nothing names, describes or ranks a servant of Zol. Servants appear only as the three established orders, never as persons.
2. Nothing says who administers Furviatlon. The seat is shown as a seat, with no keeper.
3. Nothing says what feeding is (worship, souls, death, sacrifice or anything else). Text uses only "feed" and "sustain".
4. Nothing says Zol's magic differs by place in Erdae.
5. The wandering dead of the Mistake are not Zol's soldiers and are never recruited.
6. Nothing says Zol is destroyed, or states what remains of him after he withdraws.
7. Nothing at the start reveals Afrit, shows Eindil or begins a great war. Zol is at peace until he rises.
8. No character stands for Zol's body or for a keeper of the Mistake. The leader is the emblem "The Will of Zol" (S4); armies are numbered hosts with no named commanders (S4).
9. Game text writes Šodolôro (S11); this document keeps the vault's Šodolôrō.

## Design

### 1. The realm at the start

| Item | Value |
| --- | --- |
| Country | Zol (by name; tag resolved at build time from `tools/content/data/countries.json`). 104 states. Capital Furviatlon (today the capital state and its victory point still read "Fobuler"; the map step renames them, map accuracy S9). |
| Ideology | Shadow (`communism`), stance `zin_shadow_grave` "Grave Dominion" (in game today). No elections (`elections_allowed = no`, in game today), no party changes. |
| People | `zin_people_the_dead` (in game today). |
| Leader | The emblem **"The Will of Zol"** (S4): the foundation spec's character `zin_zol_will` ([../00_foundation/02_ideologies_and_politics.md](../00_foundation/02_ideologies_and_politics.md)); today the characters module writes it as `<Zol tag>_zin_ruler` with that name. No traits. Its portrait must be non-figurative: today it still points at a people portrait (`GFX_zin_portrait_the_dead_male_1`). Until an emblem portrait is generated (art request, proposed key `zol_emblem`), the characters module derives the portrait from the catalog's `zol_sigil` medallion by resizing and padding it on black. This spec never refers to the leader's character id. |
| Advisors, generals | None (S4). `vanilla_removal.mjs` stops generating its three councillors for Zol (today `history/general/zin_general.txt` gives every court three). No general or field marshal characters. Divisions carry numbered host names from the division names group `zin_zol_hosts` ("The First Host", "The Second Host" … "The Twelfth Host", then "The %d Host"). Zol's unit-leader name list (names module) holds only the title "Deathless Captain" (warfare 6.1), so a leader a player hires has no personal name. |
| Population | Near zero outside Furviatlon (map spec G8; phase 1 fix of the 37 million manpower defect). Recruitable manpower comes only from this mechanic. |
| Industry, research | One civilian workshop at Furviatlon at most (phase 1 fix). Research at a crawl. Zol does not build land equipment: his hosts receive the warfare spec's deathless bonds through this mechanic. |
| Diplomacy | None. `set_rule = { can_create_factions = no can_join_factions = no can_guarantee_other_ideologies = no can_send_volunteers = no can_puppet = no }`. |
| War | `set_rule = { can_not_declare_war = yes }` until the rising. |
| Start spirits | `zin_zol_the_dormancy`, `zin_zol_without_a_body` (see Implementation). Zol does not get `zin_world_long_peace` or the Pilgrim Road opinion (start-situation spec). |
| Start variables | `zin_mistake_power` 35 (V1); bonds great 1, lesser 2, divine 1; `zin_zol_convergence` 0; no stirring islands; `zin_zol_hosts` 0. |
| Start forces | No land divisions: this spec owns Zol's land forces. Until the warfare spec's start forces replace the politics step's generic order of battle, `zin_mistake.1` deletes the six generic "Infantry Division" divisions of `history/units/<Zol tag>_world.txt` (`delete_unit = { division_template = "Infantry Division" }`) and removes its 9,000 `infantry_equipment_1`. The warfare spec's three black-ship corsairs stay. |

The realm is meant to feel silent. Zol's panel (the interface spec's Presence panel and Erdae bar, [../07_interface/01_interface.md](../07_interface/01_interface.md) section 8, which reads this spec's variables) shows four things: his power, the strength of service of the three orders, the islands that stir, and (after the rising) the Convergence.

### 2. Zol's power under the Fading (`zin_mistake_power`)

`zin_mistake_power` (0–100, Zol scope, shared contract) is how much of Zol's presence can act in Erdae. It is not his total power, which is immense and unmeasured. The tooltip says so.

**Monthly change** (on Zol's monthly tick):

```
change = 0.10                               (his own slow growth)
       + 0.04 x bond_great
       + 0.02 x bond_lesser
       + 0.06 x bond_divine
       + zin_zol_growth_bonus                (focuses)
       - zin_zol_fading_pressure             (start 0.15, never below 0.05)
```

If the three bonds total 1 or less, the Fading pressure counts double that month. At the start the change is +0.09 a month: he grows, slowly.

**Lump changes:** focuses, decisions and events add or spend power through `zin_zol_add_mistake_power`. The value is clamped to 0–100.

**Bands** (shown in the panel; they gate decisions):

| Band | Power | Meaning in play |
| --- | --- | --- |
| Faint | 0–24 | Few hosts; the Presence thins. Warning event at 15. |
| Stirring | 25–49 | The start band. Islands can wake; hosts can gather inside the Mistake. |
| Waking | 50–74 | The rising is possible (55+). Manifestation is possible at 60+. |
| Gathered | 75–100 | Full host cap; every expression of the Presence is open. |

**The Presence lapses.** If power reaches 0, Zol's presence fades out of Erdae for now. Event `zin_mistake.6` (lapse): country flag `zin_zol_presence_lapsed` is set; every host is removed (`delete_unit = { division_template = "The Deathless Host" }`); Zol makes `white_peace` with every enemy and gets `set_rule = { can_not_declare_war = yes }`; only "Tend the Presence" and the servant calls stay open. The bonds keep sustaining him, so power can return. At 10 the flag clears with `zin_mistake.6` (return), and the war rule returns to what it was before the lapse. Text: "Whether he returns is not for us to know. The servants keep faith." This is a gameplay state, not history.

### 3. The servants (`zin_zol_bond_great`, `_lesser`, `_divine`)

The three established orders serve Zol: Great Spirits, Lesser Spirits and New Gods. Each order has a **bond** from 0 to 5. A bond is the strength of that order's service, not a head count, and not a list of individuals.

| Order | Start | Monthly growth per point | How it rises | Risk |
| --- | --- | --- | --- | --- |
| Great Spirits | 1 | +0.04 | Focuses; decision "Call Upon the Great" (75 PP, once a year) | Falter events |
| Lesser Spirits | 2 | +0.02 | Focuses; "Call Upon the Lesser" (50 PP, every 180 days) | Falter events |
| New Gods | 1 | +0.06 | Focuses; "Call Upon the Divine" (100 PP, once a year): 75% +1, 25% event `zin_mistake.3` "Silence Among the Divine" (no gain, PP refunded by half) | Falter events |

**Falter events.** Event `zin_mistake.4` "A Service Falters" has a mean time of 18 months while any bond is 2 or more: one random bond with 2+ loses 1. The focus "When Servants Falter" halves the chance and restores the lost point after 180 days. The text never gives a reason: "For reasons no one in Erdae can name, one order of his servants gives less."

**Tend the Presence.** Decision, 50 PP (25 PP after the focus "The Tending"), cooldown 120 days (90 after the focus): +1.5 power. It is the basic way a player feeds the Presence. Its text says only that the servants sustain him.

### 4. The black islands

The black islands of the Ocean of Zol are a scripted list of states (`zin_is_site_ocean_of_zol_island`, a row of the key sites table "Ocean of Zol islands", generated into `common/scripted_triggers/zin_sites.txt`). An island **stirs** when state flag `zin_zol_island_stirring` is set. `zin_zol_islands_stirring` counts them (shared, so Aenor's Lost Cause and Lerendor can read it). The rising needs 4 stirring islands; if the map holds fewer than 4 island states, the threshold is their number (the builder writes the constant).

| Action | Effect |
| --- | --- |
| Decision "Wake an Island" (targets one island that does not stir; 25 PP; 30 days) | Island stirs; +0.5 power; rumour roll |
| Focuses in the Black Islands branch | Wake 1, 2 or all remaining islands |
| A stirring island | Hosts may rise there (after the focus "The Island Hosts"); counts toward the rising |

**Rumours.** Each time an island wakes, a rumour roll sends event `zin_mistake.2` "Tales of Black Ships" to one random country for which `zin_is_zol_coast_country` is true (the events spec's trigger: it owns a state with `zin_is_site_ocean_of_zol_coast`; never Zol). Chance: 30% by default, 50% with "Let Them Talk" (`zin_zol_isles_loud`), 10% with "Keep the Isles Dark" (`zin_zol_isles_dark`), halved by "A Concealed Allegiance" (`zin_zol_veiled`), doubled while Zol has the tree spirit `zin_zol_open_service` ("Service Without Shame"; cap 90%), 0% with "The Unwatched North" (`zin_zol_unwatched`).

Only `zin_mistake.2` can forewarn a court. The other tales of black ships (Aenor's `zin_aenor.152`, Lerendor's `zin_leren.50`, the flavour event `zin_lore.180`) are flavour and set no `zin_zol_forewarned` (proposed; it is the working answer to the events question on forewarning).

"Tales of Black Ships" (to the coastal country):
- A "Fishermen's tales." Nothing happens. AI chance 95%.
- B "Send a ship to look." −25 PP; country flag `zin_zol_forewarned`. When Zol rises, that country gets timed idea `zin_zol_forewarned` for 365 days (`defense_bonus_against` Zol +0.1).

Every tale adds +0.5 to `zin_gathering_dark` through `zin_world_add_gathering_dark`, at most +5 in total before the rising. The tales name no god and no servant; they speak of "black hulls among the islands and lights that are not fires". Nobody at a royal court acts on them unless a player chooses to.

### 5. Hosts: Zol's dead

Zol's soldiers are **hosts**: divisions of the template "The Deathless Host" (`zin_zol_deathless_host` in this spec's data): 10 battalions of the warfare spec's sub-unit `zin_zol_deathless`. Until the warfare spec ships its units, the template uses 10 vanilla `infantry` battalions. They are sustained by Zol's own death-magic (established). They are not the wandering dead.

Each `zin_zol_deathless` battalion needs 20 manpower and 100 deathless bonds (`zin_deathless_equipment`, warfare 3 and 6.1; until warfare ships, `infantry_equipment_1`). One host therefore needs **200 manpower and 1,000 bonds**.

| Rule | Value |
| --- | --- |
| How raised | Decision "Raise a Host": 2 power, 10 PP, 15 days. `create_unit` with `prioritize_location` at Furviatlon's victory-point province, at Šodolôrō's (after the focus "Šodolôrō", `zin_zol_muster_sodoloro`) or at a stirring island's main province (after "The Island Hosts", `zin_zol_muster_islands`). Never in a state with Yeldenne and Glo's `zin_glo_cleansed`. Each raise adds the 200 manpower and 1,000 bonds the host needs. Focuses and the rising raise hosts for free (`free` skips the power and PP cost, not the manpower and bonds). |
| Host cap | floor(power / 4) + `zin_zol_host_cap_bonus`. Before the rising the cap is 4 and hosts spawn only inside the Mistake. |
| Host count | `zin_zol_hosts` = `num_divisions` minus the Presence division; recounted on every raise and monthly. |
| Bonds | Never produced (`zin_deathless_equipment` cannot be built). Monthly, this spec's tick calls the warfare spec's `zin_war_feed_deathless` (power × 25 bonds; capped before the rising). The returning fallen (section 6) add more. |
| Manpower | Start 0. The rising grants 200 per host it raises. After the rising the dynamic modifier `zin_zol_presence` gives `weekly_manpower` = 0.5 × power (30 a week at power 60, about one host's reinforcement every seven weeks). |
| Supply | The warfare spec's army idea `zin_war_deathless_nature` (attrition and supply); the tree's spirit `no_hunger`. This spec adds nothing. |

### 6. The deathless dead

Ordinary weapons break their shapes but cannot end them (established). The game models this in three parts.

1. **The fallen return.** On Zol's monthly tick, scripted effect `zin_zol_return_the_fallen` runs `every_enemy_country`. For each enemy it measures the casualties that enemy has inflicted on Zol since the last tick, in steps of 50 (0.05 thousand): a `while_loop_effect` raises the enemy's stored variable `zin_zol_fallen_seen_k` by 0.05 while `casualties_inflicted_by = { opponent = <enemy> thousands > <seen + 0.05> }` holds (scope Zol), at most 200 steps a month, and counts the steps. If the enemy does **not** have potent magic (`zin_has_potent_magic`), Zol regains, per step, `zin_zol_return_rate` × 50 manpower (`add_manpower`) and `zin_zol_return_rate` × 250 deathless bonds (`add_equipment_to_stockpile`; 5 bonds per manpower, the battalion ratio). Base rate 0.60; focuses raise it; cap 0.90. If the enemy has potent magic, nothing returns: those dead are ended. If the Linux run shows that `casualties_inflicted_by` does not read a variable threshold, the builder writes the comparison as a fixed ladder of 0.05 steps instead (same result).
2. **Deathless endurance.** The tree's spirit line (`deathless_1`, `deathless_2`, `deathless_3`) gives organisation regain, reinforcement and resistance to experience loss (tree spec); the warfare spec's armour (80) and `zin_war_deathless_nature` do the rest.
3. **The bane of potent magic.** Each month every country at war with Zol that has `zin_has_potent_magic` receives idea `zin_zol_bane` (`targeted_modifier = { tag = <Zol> attack_bonus_against = 0.3 defense_bonus_against = 0.2 }`). After Zol's focus "What Can End Them" (`zin_zol_knows_bane`) teaches his hosts to avoid it, the idea `zin_zol_bane_known` replaces it with `attack_bonus_against = 0.2`. The idea is removed when the war or the magic ends.

**Potent magic** is the magic spec's scripted trigger `zin_has_potent_magic` (Glo carried, Varner's wards, or the country flag `zin_potent_magic`). This module does not define it and is built with or after the magic spec's files; until they exist the build fails on the missing trigger (no stand-in). The only `zin_potent_magic` this spec sets is the 30-day country flag on the Gala Elves when Lorien rides (section 9), as the magic spec's "Set by" column says.

**The sword in the earth** (established: Glo's wave breaks a whole front of Zol's dead) is Yeldenne and Glo's `zin_glo_wave` (its decision `zin_glo_wave_decision`); neither this spec nor the warfare spec defines an effect of its own for it. It honours their state flag `zin_glo_cleansed`: no host is raised and no Presence division is created in a cleansed state. Losses from `damage_units` are not casualties inflicted by a country, so they never return through `zin_zol_return_the_fallen`.

### 7. The rising (`zin_zol_rising`, historical 4A 1755)

Scripted trigger `zin_zol_can_rise`:

- not `zin_zol_rising`, not `zin_zol_presence_lapsed`;
- `zin_mistake_power` ≥ 55 and `zin_zol_islands_stirring` ≥ 4;
- and one of:
  - route "The Appointed Hour" (`zin_zol_route_appointed`) and `zin_zol_after_appointed_hour` (1 Sowing 4A 1755, `1755.5.1`);
  - route "The Hastened Hour" (`zin_zol_route_hastened`) and `zin_zol_after_hastened_hour` (1 Thaw 4A 1753, `1753.3.1`);
  - route "The Long Patience" with "A Greater Hour" (`zin_zol_greater_hour`) and `zin_zol_after_greater_hour` (1 Deepwinter 4A 1760, `1760.1.1`);
  - Zol is at war (someone attacked him first): power, island and date limits are ignored, and so is `zin_zol_unending`.

**Dates and story pace (V4).** Every story floor date in this spec is read through a generated scripted trigger `zin_zol_after_<name>`, never a raw `date`. The builder writes each trigger as three branches, one per `zin_rule_story_pace` option, with the date moved to start + (date − start) × 1.0, 1.5 or 0.75 (start 1748.3.1), the same rule as the historical-path spec. The triggers are: `appointed_hour` (1755.5.1), `hastened_hour` (1753.3.1), `forced_rising` (1755.7.1), `forced_rising_early` (1754.7.1), `late_manifest` (1758.1.1), `greater_hour` (1760.1.1), `second_stirring` (1770.1.1).

The rising is taken by the focus "The Dead Rise" or the decision "The Dead Rise" (`zin_zol_call_the_rising`). Scripted effect `zin_zol_rise`:

1. `set_global_flag = zin_zol_rising`.
2. `set_rule = { can_not_declare_war = no }`; swap `zin_zol_the_dormancy` for `zin_zol_the_rising`.
3. Raise floor(power / 10) hosts for free on stirring islands and at Šodolôrō (×1.5, rounded down, with `zin_zol_greater_hour`); add 200 manpower and 1,000 bonds per host. With `zin_zol_greater_hour`, also `zin_zol_add_convergence` +20 (tree).
4. Event `zin_mistake.10` "Whither the Dead" for Zol picks the first target (below).
5. `zin_world_add_gathering_dark` +10 (tension budget "Zol's dead rise").
6. News event `zin_mistake.11` "The Dead Come Out of the North" for every country.
7. Countries with `zin_zol_forewarned` get their idea.

"Whither the Dead" (`zin_mistake.10`):
- A "South, to the Middle Kingdom." `declare_war_on = { target = <Aenor> type = annex_everything }`. AI: 100 when `zin_rules_is_historical`; 70 otherwise.
- B "The northern shores." The same on Lerendor. AI: 0 when historical, 20 otherwise.
- C "The edge of the elven woods." `zin_zol_wargoal_elven_edge`: war on the Magical Lands realm with the most states next to a Zol-owned state. The elves' Kindred of the Woods defends it ([elves_wall_and_dragons.md](elves_wall_and_dragons.md)). AI: 0 when historical, 10 otherwise.

Aenor's subjects and faction join by the normal rules. The rising does not itself set `zin_war_of_last_crowns`; the world systems spec decides when the great war has begun.

**Forced rising.** For an AI Zol only (`is_ai = yes`): when `zin_rules_is_historical` and `zin_rule_dark_powers = HISTORICAL`, on `zin_zol_after_forced_rising` (1 Goldfield 4A 1755); when `zin_rule_dark_powers = AGGRESSIVE`, on `zin_zol_after_forced_rising_early` (1 Goldfield 4A 1754), whatever the path rule. If Zol has not risen by then, power is raised to 55 if lower, islands to 4 if fewer, and `zin_zol_rise` runs with option A. This meets the historical-path checkpoint 16 (`zin_zol_rising` by 1755.7.1, latest 1756.3.1).

**The northern straits.** Lerendor and the Dark Lands each provide a trigger for a barred crossing: `zin_leren_strait_barred` and `zin_dark_shore_barred`. This spec's answer (proposed): while either is true, Zol's AI drops its `invade` strategy against the country holding that shore and moves the weight to the other route (Aenor's coast first). A player Zol is not restricted; the barred shore's defenders already get their own modifiers from their specs.

### 8. Zol and Volgan

The two powers clash first and later join briefly against Eindil (established). Nothing else about their relationship is stated in text. The Volgan spec ([volgan_southern_dominion.md](volgan_southern_dominion.md), section 11) owns the shared flags and both shared events (decision O4): the clash is Volgan's `zin_dominion.13` with the flag `zin_volgan_zol_clash`, and the Black Compact is offered once, by Volgan's `zin_dominion.14`. This spec is Zol's side of the same steps.

| Step | Trigger | Effect |
| --- | --- | --- |
| Clash | Volgan's `zin_dominion.13` "The Dead Against the Dead" (Volgan spec: Volgan declares war on Zol). Zol has no clash event of its own (O4). A player Zol may strike first through the tree's "Two Darknesses Meet", whose helper calls this spec's `zin_zol_strike_volgan` (proposed): `create_wargoal` type `take_state` on a bordering Volgan-controlled state, then `declare_war_on`; no annexation goal; does nothing once `zin_volgan_zol_clash` is set or the two are at war | Either way the Volgan pulse sets `zin_volgan_zol_clash` the first month Volgan and Zol are at war with each other. Zol's AI fights Volgan while both fight the living |
| The Black Compact (N2, O4) | `zin_eindil_returned`; Zol and Volgan both at war with the country that has character `zin_eindil` (`has_character = zin_eindil`); Volgan's body not destroyed; not `zin_black_compact` | The one offer is Volgan's `zin_dominion.14`, sent by his focus "The Black Compact". Zol's answer is this spec's `zin_mistake.16` "The Brief Accord" (proposed, O4): `zin_dominion.14` fires it for Zol. Accept: `white_peace` between them, military access both ways (`give_military_access` each way), global flag `zin_black_compact`; Volgan gets his `zin_dominion.15`. Refuse: nothing. No shared faction. AI: accept 100 when historical, 70 otherwise. Zol's focus "The Brief Accord" sends no offer: its helper sets the Zol country flag `zin_zol_accord_sought`, which makes Zol's AI accept at 100 and asks the Volgan AI to take its focus (weight ×3). |
| The compact ends | `zin_volgan_body_destroyed` or `zin_zol_withdrawn` | Volgan's `zin_dominion.23` "The Compact Ends" (to both) sets `zin_black_compact_ended` and revokes the access. No war is declared again. Zol's former `zin_mistake.17` is retired. |

Text never explains why they clash or why they join. It reports only what is seen on the field.

### 9. The Convergence and the manifestation

**The Convergence** (`zin_zol_convergence`, 0–100, Zol scope) measures how far conditions have aligned for Zol to take a temporary form. It follows the proposed chronicle explanation and is labelled proposed in its tooltip.

| Source | Amount |
| --- | --- |
| Routes of power prepared by the servants (three focuses) | +10 each |
| Other focuses ("Šodolôrō Stirs", "Every Black Isle", "Servants at War", "What the War Leaves") | +5 or +10 each |
| Each month while Zol is at war and `zin_war_of_last_crowns` is set | +2 plus `zin_zol_convergence_rate` |
| `zin_volgan_body_destroyed` (Volgan's forces are broken) | +35 (+45 with "When Hosts Are Broken") |
| A major at war with Zol capitulates (with "When Hosts Are Broken") | +10 |

**Come Forth.** Decision `zin_zol_come_forth`, unlocked by the focus "A Fraction of a God" (or for the AI by the catch-up below). Scripted trigger `zin_zol_can_manifest`: `zin_zol_rising`, Zol at war, convergence ≥ 100, power ≥ 60, not `zin_zol_manifested`. Scripted effect `zin_zol_manifest`:

1. `set_global_flag = zin_zol_manifested`.
2. Power −25. Convergence set to 0.
3. Add spirit `zin_zol_form_taken` "The Form Taken".
4. Create one division of the template "The Presence" (`zin_zol_the_presence` in this spec's data): 4 `zin_zol_deathless` battalions and the warfare spec's great-being company `zin_zol_manifestation` "Zol Made Flesh" (warfare 4.9: a great being needs a line battalion beside it). The warfare spec's `zin_war_grant_zol_manifestation` adds its one `zin_zol_manifestation_equipment`; nothing can reinforce it. It spawns (`create_unit`, `allow_spawning_on_enemy_provs = no`) in the Zol-controlled state of the Middle Lands (`zin_is_region_middle_lands`) with the most Zol divisions and no `zin_glo_cleansed`, or at Furviatlon if none. The division's name is "The Presence"; it is not a character and has no commander.
5. Start mission `zin_zol_the_form_endures` (63 days). Each week the form costs `zin_zol_manifest_cost` power (start 3; 2 after "The Cost of Form").
6. `zin_world_add_gathering_dark` +10 (tension budget "Zol manifests"). News event `zin_mistake.20` "Zol Comes Forth" for every country.
7. If the Host of Eindil (`global.zin_eindil_host`) is at war with Zol and `zin_glo_with_eindil` is not set, fire the journey's `zin_eindil.101` to the Host 7 days later (with Glo, `zin_mistake.21` fires it instead).

Only one manifestation can happen before 4A 1800 (magic spec rule 4): `zin_zol_can_manifest` requires `zin_zol_manifested` unset.

**The form cannot last.** Withdrawal (`zin_zol_withdraw`) happens at the first of:

| End | How | Text |
| --- | --- | --- |
| The old powers force him back (historical) | Event `zin_mistake.23` after Lorien's stand | Lorien and ancient spirits spend themselves; Zol withdraws. |
| The cost is too great | Power falls below 20 | Event `zin_mistake.25` "The Form Is Spent". |
| Time | Mission `zin_zol_the_form_endures` times out | Event `zin_mistake.25`. |
| The form is destroyed | Weekly check: `num_equipment_in_armies@zin_zol_manifestation_equipment` < 1 (the Presence division is gone) | Event `zin_mistake.25`. |

**Eindil and the blue sword** (established sequence). Event `zin_mistake.21` "One Finger" is the one sword-break event (O4) and Zol's side of the journey's battle 4, `zin_eindil.101` "The Old God Comes Forth" ([eindil_journey.md](eindil_journey.md)). It fires once (guard flag `zin_zol_one_finger_done`) for Zol and for Eindil's host (`global.zin_eindil_host`) 7 days after the manifestation, when Zol is manifested, at war with that host, and `zin_glo_with_eindil` is set.
- Sets global flag `zin_horos_sword_broken` (N1); it is the only setter. Yeldenne and Glo's pulse then drops Glo's power to 25 and caps it at 50; the warfare spec's `zin_war.6` swaps the bearer to the shard.
- Fires `zin_eindil.101` for the host. The wound to Eindil is the journey's (it applies it in `zin_eindil.101`: his trait unusable for 120 days), so the wound has one owner.
- If Eindil carries no Glo, `.21` does not fire: `zin_zol_manifest` fires `zin_eindil.101` to the Host itself 7 days after the manifestation, if the Host is at war with Zol; nothing is broken.
- Zol: +5 power (he drains New God power from Eindil).
- Then the shard: Zol −15 power; the mission loses 21 days. Text: "A shard of the broken blade still carried Glernaen's power. The form shook."

**Lorien's stand.** When `zin_zol_manifested` is set and Lorien lives (`zin_lorien_dead` not set), the Gala Elves get event `zin_mistake.22` "The Old Lords Ride". It decides checkpoint 23 for a human Gala player, so B is written first and A second (E2; the AI weights do not change):
- A "We ride, for all the living." (historical; AI 100 when `zin_rules_is_historical`, 80 otherwise.) Calls the diplomacy spec's `zin_diplo_lift_refusal` on the Gala Elves, the Lands of the Sun spec's `zin_sun_lorien_rides` (the Gala Elves join the war on Zol, The King's Ride, The Old Powers Stand) and sets `set_country_flag = { flag = zin_potent_magic days = 30 }` on the Gala Elves. After 14 days, event `zin_mistake.23` "Lorien Challenges Zol" fires for every country (news); it is the world's one news of Lorien's death (O4). It calls `zin_sun_lorien_falls` (sets `zin_lorien_dead`; the Lands of the Sun spec sends no death news of its own from this call), then `zin_zol_withdraw`.
- B "This is not our war." Nothing; the form burns out by itself (table above). Lorien lives; no text comments.

**Withdrawal** (`zin_zol_withdraw`):

1. `set_global_flag = zin_zol_withdrawn`. Remove `zin_zol_form_taken`; `zin_war_remove_zol_manifestation` (warfare); delete the Presence division (`delete_unit = { division_template = "The Presence" }`). The mission ends.
2. Power: max(power − 20, 10). He is wounded and constrained, not destroyed; the floor stops the realm from lapsing on the spot.
3. Add timed idea `zin_zol_wounded` (730 days).
4. Every Zol division outside Zol-owned states is deleted (the hosts lose coherence or leave the field): `every_state = { limit = { NOT = { is_owned_by = <Zol> } } <Zol> = { delete_unit = { state = PREV } } }`. Hosts inside the Mistake remain.
5. Before the peace, every foreign state Zol controls gets state dynamic modifier `zin_zol_deathfield` for 1,095 days (`zin_zol_spread_deathfield`). Then Zol makes `white_peace` with every enemy; control returns to the owners.
6. `set_rule = { can_not_declare_war = yes }` until `zin_zol_after_second_stirring` (1 Deepwinter 4A 1770, `1770.1.1`).
7. News event `zin_mistake.24` "Zol Withdraws" for every country (after a manifestation; otherwise `zin_mistake.25` "The Presence Recedes"). Text: "He withdrew into the dark of his domain. He was not slain."
8. The Black Compact ends through Volgan's `zin_dominion.23`, which fires on `zin_zol_withdrawn`. The tension spec applies its −12 for the withdrawal; this spec adds no meter change here.

**If Zol capitulates** (`on_capitulation_immediate`, ROOT = Zol): run `zin_zol_withdraw` at once (event `zin_mistake.25` with the text "The Presence Recedes"), so `white_peace` ends every war before a peace conference can open. If Zol has not manifested, `zin_zol_withdraw` sets `zin_zol_withdrawn` but no manifestation flag, skips steps 1 and 3, and the tree's aftermath focuses stay closed. Zol cannot be annexed or puppeted. This keeps every outcome consistent with "not slain" (magic spec rule 4).

### 10. After the withdrawal and the sandbox

- Power regrows by the monthly formula. `zin_zol_wounded` constrains his hosts for two years.
- From `zin_zol_after_second_stirring` (4A 1770), with the focus "Matters for Another Age" (`zin_zol_second_stirring_open`), decision "A Second Stirring" (power ≥ 60, islands ≥ 4) may raise the dead again. Scripted effect `zin_zol_second_rise` runs steps 2 to 4 of `zin_zol_rise` (`zin_zol_rising` is already set and stays), adds `zin_world_add_gathering_dark` +5, and sends news `zin_mistake.30` "A Second Stirring", which names no age. **No second manifestation is possible before the game ends in 4A 1800** (magic spec rule 4).
- Route "The Unending Patience" (`zin_zol_unending`): Zol never rises in this game unless attacked. He ends the game with the most power a Zol can hold. This is a player route (and the AI route under `zin_rule_dark_powers = RESTRAINED`), not a claim about history.

Zol has no ending of his own. The three endings belong to the world systems spec. At the end screen Zol's player sees his power, the islands that stir, and the field he held, with no claim that he won or lost the age.

### 11. Expressions of the Presence

Unlocked by the focus "What Is Held, What Is Spent". Decisions that spend power, not PP:

| Decision | Cost | Requires | Effect |
| --- | --- | --- | --- |
| "A Shadow on the Land" (targets an enemy neighbour) | 4 power | at war | Target: `add_war_support = -0.05`, `add_stability = -0.03` |
| "Stillness Before the Form" | 8 power | rising, convergence < 100 | +5 convergence |
| "The Dead Endure" | 6 power | at war | Timed idea `zin_zol_the_dead_endure` for 30 days: `army_org_regain = 0.5`, `land_reinforce_rate = 0.05`. (The engine's `set_unit_organization` can only lower organisation, so the effect is an idea.) |

Power costs use `custom_cost_trigger` (power ≥ cost) and `custom_cost_text`; the effect calls `zin_zol_add_mistake_power` with the negative cost.

## Implementation

### Builder module and data

Everything below is written by a new content-builder module, `tools/content/modules/mech_zols_mistake.mjs` (`buildZolsMistake(staged, countries, …)`), called from `tools/content/build.mjs` after `characters` and before `vanilla_removal` (so the C3 reference scan sees its definitions), and applied in the same atomic transaction as the rest of the build. Nothing is hand-edited.

| Input | What the module reads |
| --- | --- |
| `tools/content/data/mechanics/zols_mistake.json` (new) | Every number of this spec (start values, rates, costs, caps, cooldowns, AI weights, the host names list), the template definitions, the event and decision table, and the picture key per event |
| `tools/content/data/countries.json` | Resolves Zol, Aenor, Lerendor, Volgan, the Gala Elves and the Magical Lands realms to tags |
| The mod's `history/states/*.txt` (politics step output) | The victory-point provinces of Furviatlon (today state 502, "Fobuler") and Šodolôrō (today VP 1995, "Sodoloro"), and each island state's first province, for `create_unit` muster locations |
| `presentation-cells.json` (presentation module) | Checks that every picture key named in the data exists with the right crop |

Changes to existing modules, made in the same build as this module: `vanilla_removal.mjs` stops generating its three councillors for Zol; `names.mjs` gives Zol's tag only the leader title "Deathless Captain"; `characters.mjs` points Zol's leader portrait at the emblem (section 1). No interim stub is replaced: this module adds its own files beside them.

### Files (all generated by `mech_zols_mistake.mjs`)

| Path | Content |
| --- | --- |
| `common/scripted_effects/zin_mistake.txt` | All `zin_zol_*` effects below |
| `common/scripted_triggers/zin_mistake.txt` | All triggers below, including the pace-shifted date triggers `zin_zol_after_<name>` |
| `common/ideas/zin_mistake.txt` | Mechanic ideas (the tree's spirits live in `common/ideas/zin_focus_zol.txt`, written by the focus compiler) |
| `common/dynamic_modifiers/zin_mistake.txt` | `zin_zol_presence`, `zin_zol_black_waste`, `zin_zol_deathfield` |
| `common/decisions/zin_mistake.txt`, `common/decisions/categories/zin_mistake.txt` | Category `zin_mistake_presence` "The Presence" (Zol only) |
| `common/on_actions/zin_mistake.txt` | `on_startup` → `zin_mistake.1`; `on_monthly_<Zol tag>` → `zin_zol_monthly`; `on_weekly_<Zol tag>` → `zin_zol_weekly_manifest`; `on_capitulation_immediate` (ROOT = Zol) → `zin_zol_withdraw` |
| `common/ai_strategy/zin_mistake.txt` | Zol's AI strategies (AI section) |
| `common/units/names_divisions/zin_zol_hosts.txt` | Division names group `zin_zol_hosts` for Zol's tag (`ordered` list "The First Host" to "The Twelfth Host", `fallback_name = "The %d Host"`) |
| `events/zin_mistake.txt` | Namespace `zin_mistake` |
| `localisation/english/zin_mistake_l_english.yml` | All text (UTF-8 with BOM; Šodolôro, never ō) |

Division templates are created at startup by `zin_mistake.1` with the `division_template` effect, both with `division_names_group = zin_zol_hosts` ("The Deathless Host": 10 `zin_zol_deathless`; "The Presence": 4 `zin_zol_deathless` and support `zin_zol_manifestation`; until the warfare units ship: 10 and 4 `infantry`, no support company), so no order-of-battle file changes. There is no character file and no game rule file.

The test file is `tools/content/mech_zols_mistake.test.mjs` (new), added to the `npm test` script in `tools/package.json` when the module lands.

### Variables

| Variable | Scope | Range | Start | Meaning |
| --- | --- | --- | --- | --- |
| `zin_mistake_power` | Zol | 0–100 | 35 | Shared contract (V1) |
| `zin_zol_bond_great`, `zin_zol_bond_lesser`, `zin_zol_bond_divine` | Zol | 0–5 | 1, 2, 1 | Strength of each order's service |
| `zin_zol_growth_bonus` | Zol | 0–0.5 | 0 | Added monthly growth |
| `zin_zol_fading_pressure` | Zol | 0.05–0.3 | 0.15 | Monthly loss to the Fading |
| `zin_zol_islands_stirring` | Zol | 0–all | 0 | Stirring islands (shared read) |
| `zin_zol_host_cap_bonus` | Zol | 0–20 | 0 | Extra hosts allowed (+2 under `zin_rule_dark_powers = AGGRESSIVE`) |
| `zin_zol_hosts` | Zol | count | 0 | Hosts alive (recounted monthly) |
| `zin_zol_return_rate` | Zol | 0.6–0.9 | 0.6 | Share of fallen that return |
| `zin_zol_fallen_seen_k` | each enemy | ≥0 | 0 | Casualties (thousands, 0.05 steps) already counted |
| `zin_zol_convergence` | Zol | 0–100 | 0 | Readiness to manifest (shared read) |
| `zin_zol_convergence_rate` | Zol | 0–3 | 0 | Extra monthly convergence |
| `zin_zol_manifest_cost` | Zol | 2–3 | 3 | Weekly power cost of the form |
| `zin_zol_presence_pp`, `zin_zol_presence_manpower` | Zol | derived | 0 | Values for the dynamic modifier |

### Flags

| Flag | Scope | Set by |
| --- | --- | --- |
| `zin_zol_rising`, `zin_zol_manifested`, `zin_zol_withdrawn` | global | contract; this spec |
| `zin_horos_sword_broken` | global | N1, O4; only this spec's `zin_mistake.21` (read by Yeldenne and Glo, the journey, warfare and the palace battle) |
| `zin_volgan_zol_clash` | global | Volgan spec's flag; set by the Volgan pulse once Volgan and Zol are at war (O4) |
| `zin_black_compact`, `zin_black_compact_ended` | global | N2; Volgan spec's flags. `zin_black_compact` is set by `zin_mistake.16` accept, Zol's answer to Volgan's `zin_dominion.14` |
| `zin_zol_accord_sought` | Zol | the tree's "The Brief Accord" (section 8) |
| `zin_zol_presence_lapsed` | Zol | power 0 |
| `zin_zol_one_finger_done` | global | `zin_mistake.21` (once) |
| `zin_zol_route_appointed`, `zin_zol_route_hastened`, `zin_zol_route_patience`, `zin_zol_greater_hour`, `zin_zol_unending` | Zol | tree route focuses |
| `zin_zol_calls_open`, `zin_zol_hosts_open`, `zin_zol_expressions_open`, `zin_zol_manifest_open`, `zin_zol_tending`, `zin_zol_bonds_steadfast`, `zin_zol_veiled`, `zin_zol_isles_loud`, `zin_zol_isles_dark`, `zin_zol_unwatched`, `zin_zol_muster_sodoloro`, `zin_zol_muster_islands`, `zin_zol_knows_bane`, `zin_zol_breaking_attuned`, `zin_zol_second_stirring_open` | Zol | tree focuses |
| `zin_zol_island_stirring` | state | waking |
| `zin_zol_forewarned` | other countries | "Tales of Black Ships" option B (only there) |
| `zin_potent_magic` | Gala Elves, 30 days | `zin_mistake.22` A (the magic spec's fallback flag) |

Retired names are not written anywhere: the names check fails a build that uses any name in the contract register's retired table (N16). This spec's names follow N1 (`zin_horos_sword_broken`), N2 (`zin_black_compact`), O4 (`zin_volgan_zol_clash`; Zol's former clash event id 15 is not used), O6 (the emblem character `zin_zol_will`) and R1 (`zin_rule_dark_powers`). `zin_zol_manifestation` is the warfare sub-unit's id only, never an idea.

### Scripted effects

| Effect | Scope | Does |
| --- | --- | --- |
| `zin_zol_add_mistake_power` | any (acts on Zol) | Add `value`, clamp 0–100, refresh `zin_zol_presence` |
| `zin_zol_add_bond_great`, `zin_zol_add_bond_lesser`, `zin_zol_add_bond_divine` | Zol | Add `value`, clamp 0–5 |
| `zin_zol_add_growth_bonus`, `zin_zol_add_fading_pressure`, `zin_zol_add_return_rate`, `zin_zol_add_host_cap`, `zin_zol_add_convergence`, `zin_zol_add_convergence_rate`, `zin_zol_set_manifest_cost` | Zol | Change the named variable within its range |
| `zin_zol_wake_island` | Zol | Wake `count` random non-stirring islands (`all` = every one); rumour roll each |
| `zin_zol_raise_host` | Zol | Create `count` hosts at the allowed muster sites, never in a `zin_glo_cleansed` state; `free` skips the power and PP cost; adds 200 manpower and 1,000 bonds per host |
| `zin_zol_harden_wastes` | Zol | Add `zin_zol_black_waste` to every Zol-owned state |
| `zin_zol_spread_deathfield` | Zol | Add `zin_zol_deathfield` to every foreign state Zol controls |
| `zin_zol_wargoal_elven_edge` | Zol | War on the Magical Lands realm with most states next to a Zol-owned state |
| `zin_zol_strike_volgan` | Zol | Section 8: a player Zol's own declaration on Volgan (proposed; called by the tree's "Two Darknesses Meet") |
| `zin_zol_rise`, `zin_zol_second_rise`, `zin_zol_manifest`, `zin_zol_withdraw` | Zol | Sections 7, 9 and 10 |
| `zin_zol_monthly` | Zol | Power formula, falter roll, lapse check, host recount, `zin_war_feed_deathless`, convergence, `zin_zol_return_the_fallen`, bane upkeep, dynamic modifier values, catch-ups |
| `zin_zol_weekly_manifest` | Zol | Weekly cost of the form; ends it below 20 power or when the form is destroyed |
| `zin_zol_return_the_fallen` | Zol | Section 6 |
| `zin_zol_shorten_wound` | Zol | Reduce `zin_zol_wounded` by `days` (`modify_timed_idea` with a negative value) |

Scripted effects take no parameters (E1): `call` arguments from the focus compiler and from other modules are the temporary variables `zin_arg_value`, `zin_arg_count` (−1 for "all"), `zin_arg_days` and `zin_arg_free` (0 or 1), set just before the call; the effects read and clear them.

Effects of other specs this spec calls: `zin_world_add_gathering_dark` (tension), `zin_war_feed_deathless`, `zin_war_grant_zol_manifestation`, `zin_war_remove_zol_manifestation` (warfare), `zin_diplo_lift_refusal` (diplomacy), `zin_sun_lorien_rides`, `zin_sun_lorien_falls` (Lands of the Sun). Events of other specs it fires: `zin_eindil.101` (journey), `zin_dominion.15` (Volgan, from `.16` accept). The build fails if any is missing.

### Scripted triggers

| Trigger | Scope | True when |
| --- | --- | --- |
| `zin_is_zol` | country | This country is Zol (`tag = <Zol>`) |
| `zin_zol_can_rise` | Zol | Section 7 |
| `zin_zol_can_manifest` | Zol | Section 9 |
| `zin_zol_is_manifest` | any | `zin_zol_manifested` and not `zin_zol_withdrawn` |
| `zin_zol_after_appointed_hour`, `_hastened_hour`, `_forced_rising`, `_forced_rising_early`, `_late_manifest`, `_greater_hour`, `_second_stirring` | any | The pace-shifted date has passed (section 7) |
| `zin_zol_ai_route_appointed`, `zin_zol_ai_route_hastened`, `zin_zol_ai_route_patience` | Zol | The AI route under the rules (Game rules below) |

Read from other specs: `zin_has_potent_magic` (magic), `zin_is_site_furviatlon`, `zin_is_site_sodoloro`, `zin_is_site_ocean_of_zol_island`, `zin_is_site_ocean_of_zol_coast`, `zin_is_region_middle_lands` (key sites table, `common/scripted_triggers/zin_sites.txt`), `zin_is_zol_coast_country` (events), `zin_rules_is_historical`, `zin_rules_is_free` (defines), `zin_leren_strait_barred` (Lerendor), `zin_dark_shore_barred` (Dark Lands).

### Ideas and dynamic modifiers (mechanic-owned)

Pictures are icon-catalog keys (`picture = zin_<key>` → `GFX_idea_zin_<key>`).

| Id | On | Modifiers | Picture | Added / removed |
| --- | --- | --- | --- | --- |
| `zin_zol_without_a_body` | Zol | `surrender_limit` 0.5, `required_garrison_factor` −0.75, `research_speed_factor` −0.5, `drift_defence_factor` 1.0 | `zol_sigil` | Start; permanent |
| `zin_zol_the_dormancy` | Zol | `political_power_factor` −0.2, `max_command_power` −50 | `glyph_fading` | Start; swapped at the rising |
| `zin_zol_the_rising` | Zol | `war_support_factor` 1.0, `stability_factor` 0.5, `army_org_factor` 0.1 | `bones_risen` | Rising |
| `zin_zol_form_taken` | Zol | `army_attack_factor` 0.3, `army_defence_factor` 0.2, `army_morale_factor` 0.3, `breakthrough_factor` 0.2 | `zol_sigil` | Manifestation; removed at withdrawal |
| `zin_zol_wounded` | Zol | `army_attack_factor` −0.2, `army_org_factor` −0.2, `political_power_factor` −0.3 | `ashen_waste` | Withdrawal, 730 days |
| `zin_zol_the_dead_endure` | Zol | `army_org_regain` 0.5, `land_reinforce_rate` 0.05 | `dead_ranks_far` | "The Dead Endure", 30 days |
| `zin_zol_bane` | enemies with potent magic | `targeted_modifier = { tag = <Zol> attack_bonus_against = 0.3 defense_bonus_against = 0.2 }` | `potent_blade` | Monthly upkeep, before `zin_zol_knows_bane` |
| `zin_zol_bane_known` | the same | `targeted_modifier = { tag = <Zol> attack_bonus_against = 0.2 defense_bonus_against = 0.2 }` | `potent_blade` | Replaces the bane after `zin_zol_knows_bane` |
| `zin_zol_forewarned` | forewarned countries | `targeted_modifier = { tag = <Zol> defense_bonus_against = 0.1 }` | `beacon` | Rising, 365 days |
| `zin_zol_presence` (dynamic) | Zol | `political_power_gain` = `zin_zol_presence_pp` (power × 0.005), `weekly_manpower` = `zin_zol_presence_manpower` (power × 0.5 after the rising, 0 before) | `zol_sigil` | Start; values refreshed monthly |
| `zin_zol_black_waste` (dynamic, state) | Zol-owned states | `enemy_attrition` 0.15, `enemy_army_speed_factor` −0.15 | — | "The Black Wastes" |
| `zin_zol_deathfield` (dynamic, state) | foreign states | `local_manpower` −0.5, `state_resources_factor` −0.25, `local_supplies` −1 | — | "The Land Made Waste"; withdrawal (1,095 days) |

### Decisions (category `zin_mistake_presence`, Zol only)

Decision ids never repeat a tree id: the tree's focus `zin_zol_the_dead_rise` and this spec's decision `zin_zol_call_the_rising` are separate keys with the same title, "The Dead Rise".

| Decision | Visible | Cost | Effect |
| --- | --- | --- | --- |
| `zin_zol_tend_the_presence` | always | 50 PP (25 with flag `zin_zol_tending`) | +1.5 power; cooldown 120 (90) days |
| `zin_zol_call_upon_great` / `_lesser` / `_divine` | `zin_zol_calls_open` | 75 / 50 / 100 PP | Bond +1 (divine: 25% "Silence Among the Divine"); cooldowns 365 / 180 / 365 days |
| `zin_zol_wake_island` (state-targeted, `state_target = yes` on `zin_is_site_ocean_of_zol_island` without `zin_zol_island_stirring`) | always | 25 PP (12 with `zin_zol_isles_loud`), 30 days (15 loud, 45 dark) | Wake that island |
| `zin_zol_raise_host` | `zin_zol_hosts_open` | 2 power, 10 PP, 15 days | One host |
| `zin_zol_call_the_rising` "The Dead Rise" | a route flag | none | `zin_zol_rise` when `zin_zol_can_rise` |
| `zin_zol_come_forth` | `zin_zol_manifest_open` | none (cost inside the effect) | `zin_zol_manifest` when `zin_zol_can_manifest` |
| `zin_zol_shadow_on_the_land` (targeted), `zin_zol_stillness_before_the_form`, `zin_zol_the_dead_endure` | `zin_zol_expressions_open` | power | Section 11 |
| `zin_zol_second_stirring` | `zin_zol_second_stirring_open` and `zin_zol_after_second_stirring` | none | `zin_zol_second_rise` (section 10) |
| Mission `zin_zol_the_form_endures` | manifestation | — | `days_mission_timeout = 63`; timeout → `zin_mistake.25` and `zin_zol_withdraw` |

### Events (namespace `zin_mistake`)

Pictures are catalog keys (`GFX_zin_evt_<key>` for country events, `GFX_zin_news_<key>` for news); every key exists in game today with the crop the event needs, and each gated key is used only after its gate flag is set.

| Id | Title | For | Trigger | Options | Picture |
| --- | --- | --- | --- | --- | --- |
| `.1` | (hidden) Setup | Zol | `on_startup` | Start variables, rules, ideas, templates; removes the generic OOB | — |
| `.2` | Tales of Black Ships | coastal country | rumour roll | A dismiss (AI 95) / B send a ship | `black_ships_tale` |
| `.3` | Silence Among the Divine | Zol | divine call fails | A accept | `black_isles_lights` |
| `.4` | A Service Falters | Zol | `mean_time_to_happen` 18 months while a bond is 2+ | A accept (bond −1) | `black_isles_lights` |
| `.5` | The Presence Thins | Zol | power falls below 15 | A accept | `black_isles_lights` |
| `.6` | The Presence Lapses / Returns | Zol | power 0 / back to 10 | A accept | `black_isles_lights` |
| `.10` | Whither the Dead | Zol | rising | A Aenor / B Lerendor / C elven edge | `zol_rising` |
| `.11` | The Dead Come Out of the North | all (news) | rising | A "So the fishermen were right." | `zol_rising` |
| `.12` | — | — | retired: the warfare spec's `zin_war.4` "Shapes That Will Not Stay Broken" tells each country that ordinary arms fail | — | — |
| `.15` | — | — | not used: the clash is Volgan's `zin_dominion.13` (O4) | — | — |
| `.16` | The Brief Accord | Zol | fired by Volgan's `zin_dominion.14` (the one offer, O4) | A accept / B refuse | `generic_war` |
| `.17` | — | — | retired: Volgan's `zin_dominion.23` ends the compact | — | — |
| `.20` | Zol Comes Forth | all (news) | manifestation | A accept | `vast_shadow` |
| `.21` | One Finger | Zol, Eindil's host | section 9 | A accept | `vast_shadow` |
| `.22` | The Old Lords Ride | Gala Elves | manifestation, Lorien lives | CP 23: B stay / A ride | `vast_shadow` |
| `.23` | Lorien Challenges Zol | all (news) | 14 days after `.22` A | A accept | `vast_shadow` |
| `.24` | Zol Withdraws | all (news) | withdrawal | A accept | `vast_shadow` |
| `.25` | The Form Is Spent / The Presence Recedes | Zol; news to all | other withdrawal causes; capitulation | A accept | `vast_shadow` after a manifestation, `zol_rising` after the rising, else `generic_war` |
| `.30` | A Second Stirring | all (news) | second stirring | A accept | `zol_rising` |

Every event writes `timeout_days = 30` (E2); `.22` carries `checkpoint` 23. No `zin_mistake` text names Afrit or calls the Deliverer anything. Events before `zin_eindil_awake` never mention Eindil, and before `zin_eindil_named` he is "the Man from the Ice" (D4). No text names a servant, a keeper of Furviatlon or what feeding is.

### Game rules

This spec adds no game rule. The AI reads the defines spec's rules ([../00_foundation/05_defines_and_rules.md](../00_foundation/05_defines_and_rules.md)) through the triggers `zin_zol_ai_route_*`:

| `zin_rule_dark_powers` | `zin_rule_historical_path` | AI Zol |
| --- | --- | --- |
| `HISTORICAL` (default) | `HISTORICAL` | Route "The Appointed Hour"; forced rising on `zin_zol_after_forced_rising`; catch-ups below |
| `HISTORICAL` | `PLAUSIBLE` | The Appointed Hour by weight (100, others 5); no catch-ups |
| `HISTORICAL` | `FREE` | Tree weights only (appointed 10, hastened 5, patience 5); no catch-ups |
| `AGGRESSIVE` | any | Route "The Hastened Hour"; `zin_zol_host_cap_bonus` +2 at start; forced rising on `zin_zol_after_forced_rising_early`; manifestation catch-ups as below |
| `RESTRAINED` | any | Route "The Long Patience", then "The Unending Patience": no rising unless attacked |

The `AGGRESSIVE` and `RESTRAINED` tests use `has_game_rule = { rule = zin_rule_dark_powers option = … }` inside `zin_zol_ai_route_*`, the one place that names the rule. Rules never act on a player's Zol.

### Historical catch-ups (AI Zol, `zin_rules_is_historical` with `HISTORICAL` dark powers, or `AGGRESSIVE`)

| Date or flag | If not yet | Then |
| --- | --- | --- |
| `zin_zol_after_forced_rising` (`_early` under `AGGRESSIVE`) | risen | Forced rising (section 7) |
| `zin_volgan_body_destroyed` | manifested, and at war | Convergence to 100 and power to 60 if lower; `zin_zol_manifest` within 7 days |
| `zin_zol_after_late_manifest` (1758.1.1) | manifested, and risen and at war | Same as above |
| Manifested 63 days | withdrawn | Withdrawal (mission timeout) |

This meets the historical-path checkpoint 23: manifestation within 7 days of Volgan's body falling, withdrawal and Lorien's death the same season.

### Defines

None.

## AI

Strategies are in `common/ai_strategy/zin_mistake.txt` (engine types `conquer`, `antagonize`, `invade`, `front_unit_request`, `area_priority`); "historical" means `zin_rules_is_historical`.

- **Before the rising:** no war and no hostile strategy against anyone. Focus order per the tree spec. Takes "Tend the Presence" whenever available, calls upon the orders when PP ≥ 100, wakes an island every 60–90 days until all stir, raises hosts to the pre-rising cap of 4 by 4A 1754.
- **At the rising:** `conquer` Aenor (value 200), `antagonize` Aenor, `invade` Aenor (from the islands); `area_priority` on the Middle Lands through the AI area `zin_area_middle_lands`, which the Western Crossing module writes (`common/ai_areas/zin_west.txt`, [western_crossing.md](western_crossing.md)); if that module is not yet built, the line is left out. Keeps 2 hosts at Furviatlon. While `zin_leren_strait_barred` or `zin_dark_shore_barred` holds, the `invade` weight on that shore's holder is 0 (section 7).
- **War:** raises hosts up to the cap whenever power ≥ 50; takes "The Dead Endure" (weight 50) while an enemy division stands in a Zol-controlled state; avoids battle against countries with `zin_has_potent_magic` when it can (`front_unit_request` −50 on those fronts).
- **Manifestation:** only through the historical catch-ups, or under `FREE` when `zin_zol_can_manifest` holds and a country with potent magic is at war with Zol.
- **After withdrawal:** no war until `zin_zol_after_second_stirring`; then a second stirring only under `FREE`, weight 10.
- **Other AIs:** treat Zol's Mistake as a hostile wasteland; the AI of Aenor, Lerendor and the Magical Lands does not prepare against Zol before the rising unless forewarned. Answer Volgan's `zin_dominion.14` through `zin_mistake.16` as in section 8.

## Acceptance

Each line says how it is decided: **(a)** a build test in `tools/content/mech_zols_mistake.test.mjs` (`npm test` in `tools/`), **(b)** the isolated Linux run (one in-game year from phase 3 on, S8; `error.log` has no new lines from ZIN files), **(c)** a scripted scenario run with HOI4 Agent Tools (`hoi4_scenario_test` / `hoi4_mechanic_test`) on the mod source.

1. **(c)** On 1 Thaw 4A 1748 Zol is at peace with everyone, cannot declare war, has power 35, bonds 1/2/1, no stirring islands, no land division, no advisor and no general or field marshal character; its leader is "The Will of Zol".
2. **(a)** No `zin_mistake` localisation line names a servant, a keeper of Furviatlon, what feeding is, Afrit, or the Deliverer; the compiler's secret scan passes; no text reachable before `zin_eindil_awake` names Eindil; no line contains "ō" (S11).
3. **(a)** Every id this spec defines (effects, triggers, ideas, dynamic modifiers, decisions, events, the names group) is defined once; every effect, trigger and event it calls from another spec is defined somewhere in the build; no decision or idea id equals a focus or spirit id of the Zol tree or a warfare sub-unit id; none of the retired names appears in any generated file.
4. **(a)** Every modifier key in this spec's ideas and dynamic modifiers is in the 1.19.3 modifier documentation; every picture key exists in `presentation-cells.json` with the crop the event needs (standard for country events, news for news events).
5. **(a)** Zol's leader portrait sprite is not a people portrait (`GFX_zin_portrait_<people>_*`); `history/general/zin_general.txt` generates no councillor for Zol.
6. **(c)** With no focuses and no decisions, power rises by 0.09 a month (±0.01) over 24 months.
7. **(c)** With all bonds at 0, power falls each month; at 0 the lapse event fires, every host is removed, and power can return to 10 with the return event.
8. **(c)** Waking an island sets the state flag, increments `zin_zol_islands_stirring` and rolls a rumour; only `zin_mistake.2` option B sets `zin_zol_forewarned`.
9. **(c)** Before the rising, "Raise a Host" cannot exceed 4 hosts, spawns only inside the Mistake and never in a `zin_glo_cleansed` state; each host has 10 battalions and arrives with 200 manpower and 1,000 bonds.
10. **(b)** On the historical path with no player, Zol rises between 1755.5.1 and 1755.7.1 and is at war with Aenor; `zin_zol_rising` is set once.
11. **(c)** After a battle with an enemy without potent magic, Zol regains 60–90% of the manpower lost to that enemy and five bonds per manpower; after a battle with an enemy that has `zin_has_potent_magic`, nothing returns; Glo's Wave losses never return.
12. **(c)** `zin_volgan_zol_clash` is set once, the first month Volgan and Zol are at war; `zin_black_compact` is set after `zin_eindil_returned` only through `zin_mistake.16` accept, after Volgan's one offer `zin_dominion.14`, and `zin_black_compact_ended` follows the first of `zin_volgan_body_destroyed` and `zin_zol_withdrawn`. `events/zin_mistake.txt` has no event `.15`.
13. **(c)** On the historical path, Zol manifests within 7 days of `zin_volgan_body_destroyed`; "One Finger" sets `zin_horos_sword_broken` once and fires `zin_eindil.101` once, so Eindil's wound is applied once; the Gala Elves ride (`zin_refusal_lifted` and a 30-day `zin_potent_magic` on them); `zin_lorien_dead` is set before `zin_zol_withdrawn`; all in 4A 1757.
14. **(c)** After withdrawal Zol has power ≥ 10, no division outside Zol-owned states, no Presence division, is at peace, cannot declare war before `zin_zol_after_second_stirring`, and still exists; a second manifestation is impossible.
15. **(c)** Zol capitulating triggers `zin_zol_withdraw` and white peace before any peace conference; Zol is never annexed or puppeted.
16. **(c)** Under `zin_rule_dark_powers = RESTRAINED` the AI never rises unless attacked; under `AGGRESSIVE` it rises by 1754.7.1; under `zin_rule_story_pace = SLOW` the forced rising moves to the shifted date.
17. **(b)** The one-year Linux run from the start adds no `error.log` line from `zin_mistake` files.
18. **(c)** A scenario in which Zol manifests while Eindil carries no Glo fires `zin_eindil.101` once, from `zin_zol_manifest`, and never sets `zin_horos_sword_broken`.
19. **(a)** `zin_mistake.22` carries `checkpoint` and its first option is B.

### Requested pictures and art

Image-generated only, through the icon catalog pipeline.

| Key | Shows | Gate | Used by (now using) |
| --- | --- | --- | --- |
| `zol_emblem` | Leader portrait: a non-figurative emblem derived from the catalog's `zol_sigil` medallion on black (no face, no figure) | — | the leader "The Will of Zol" (`zin_zol_will`; the sigil resized and padded until generated) |

## Open questions

Decided, no longer open here: the emblem leader "The Will of Zol" and numbered hosts with no named commanders (S4); one manifestation at most before 4A 1800 (magic spec rule 4); the in-game spelling Šodolôro (S11); the blade's flag `zin_horos_sword_broken` (N1); the compact's flag `zin_black_compact` (N2); power 35 at the start (V1).

Owner questions, listed in [../OPEN_QUESTIONS.md](../OPEN_QUESTIONS.md) (section "zol" and the owner's short list); the work proceeds on each proposal:

1. Should the wandering dead of the Mistake ever be playable? **Proposal:** never; a hazard only (rule 5).
2. May the dead target the North Lands or an elven realm in non-historical games? **Proposal:** yes, as "Whither the Dead" options B and C, AI weight 0 on the historical path.
3. Should Zol have an end-of-game outcome of his own? **Proposal:** none; the end screen shows his power, islands and field only.
4. Should the player-only "Unending Patience" route exist? **Proposal:** yes, as a player route and the `RESTRAINED` AI route; never the historical default.
5. Adopt the "routes of power" source of the Convergence? **Proposal:** yes, labelled proposed in its tooltip (from the proposed chronicle explanation).
6. Do the black areas of the Magical Lands sheet (Dlomntod, Medek, Lost Lands) belong to the Mistake? **Proposal:** yes, as the map has them today (owner's short list 4); "the elven edge" is computed from the map at run time, so a later answer changes no script.
