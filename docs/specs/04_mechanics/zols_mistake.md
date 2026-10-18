# Zol's Mistake

**Status:** Draft. **Priority:** 3. **Phase:** 3.

## Purpose

Zol's Mistake is the black north: a near-empty realm of the dead held by Zol, the Old God of Death, who has no body. This spec makes it play unlike any other realm. Zol does not tax, trade or make treaties. He endures the Fading, his unknown servants sustain his presence, and his power grows very slowly. On the historical path his dead rise beyond the Mistake in 4A 1755, he manifests once in 4A 1757 at great cost, and he withdraws. The mechanic gives a player as Zol a full game from the quiet start to the withdrawal and beyond, and gives the AI a reliable historical route.

Related specs: [00_shared_contract.md](00_shared_contract.md), [../05_focus_trees/major/zol.md](../05_focus_trees/major/zol.md), [../01_map/01_map_accuracy.md](../01_map/01_map_accuracy.md), [../01_map/02_key_sites.md](../01_map/02_key_sites.md), [../00_foundation/01_start_and_calendar.md](../00_foundation/01_start_and_calendar.md), the warfare, magic and world systems, world tension and historical path specs in [../03_gameplay/](../03_gameplay/), and the Volgan, Eindil's journey, elves and Aenor mechanics in this folder.

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
| His dead stir in the islands of the Ocean of Zol at the start; only fishermen see it, and nobody believes them. | *The Campaign of 4A 1748* |
| Late in the Fourth Age his forces emerge from the black north, through islands and straits toward the settled kingdoms. His dead are sustained by his own death-magic. Ordinary weapons break their shapes but cannot end them. Only potent magic, such as Glo's and Horos's sword, can. | *Zol*, *The Fourth Age of Erdae*, *War of the Last Crowns* |
| Zol's dead and Volgan's forces first clash, then briefly join against Eindil. Their relationship is otherwise not established. | *War of the Last Crowns*, *Kingdoms Factions and Conflicts* |
| Zol manifests bodily once, rarely, temporarily and at great cost. He crushes Horos's sword and drains New God power from Eindil. Eindil wounds the form with a shard. Lorien and ancient spirits die or exhaust themselves forcing him to withdraw. He is not killed. | *Zol*, *Fourth Age Canon Register*, *Lorien* |
| What remains of Zol after the battle, and the mechanism of the manifestation, are **open**. | *Open Questions*, *Fourth Age Canon Register* |
| Aenor is Zol's rival in the working political table. Zol has no named political satellites. | *Great Powers and Relations* |

### Proposed (this spec or the proposed chronicle)

| Item | Status |
| --- | --- |
| Historical dates: rising 4A 1755, manifestation and withdrawal 4A 1757 | proposed (*Fourth Age Chronology*) |
| Fishermen's tales of black ships in 4A 1744 | proposed (*Fourth Age Chronology*) |
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

## Design

### 1. The realm at the start

| Item | Value |
| --- | --- |
| Country | Zol (by name; tag resolved at build time). 104 states. Capital Furviatlon. |
| Ideology | Shadow (`communism`), stance `zin_shadow_grave`. No elections, no party changes. |
| People | `zin_people_the_dead`. |
| Leader | `zin_zol`: Zol, the God of Death. Portrait is a non-figurative emblem (a black sigil on a void), never a body. No traits that imply a person. |
| Advisors, generals | No named advisors. Generals are formations, not persons: field marshal and general characters named "The First Host", "The Second Host" and so on, emblem portraits. The recruitable general name list for Zol holds only these ordinals, so the game never generates a personal name. |
| Population | Near zero outside Furviatlon (map spec G8). Recruitable manpower comes only from this mechanic. |
| Industry, research | One civilian workshop at Furviatlon at most. Research at a crawl. Zol does not build equipment; his hosts receive grave arms through the mechanic. |
| Diplomacy | None. Rules: `can_create_factions = no`, `can_join_factions = no`, `can_guarantee_other_ideologies = no`, `can_send_volunteers = no`, `can_puppet = no`. |
| War | `can_not_declare_war = yes` until the rising. |
| Start spirits | `zin_zol_the_dormancy`, `zin_zol_without_a_body` (see Implementation). |
| Start variables | `zin_mistake_power` 35; bonds great 1, lesser 2, divine 1; `zin_zol_convergence` 0; no stirring islands. |

The realm is meant to feel silent. Zol's interface panel shows four things: his power, the strength of service of the three orders, the islands that stir, and (after the rising) the Convergence.

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

**The Presence lapses.** If power reaches 0, Zol's presence fades out of Erdae for now. Country flag `zin_zol_presence_lapsed` is set; every host is disbanded; no war can be declared; only "Tend the Presence" and the servant calls stay open. The bonds keep sustaining him, so power can return. At 10 the flag clears with event `zin_mistake.6`. Text: "Whether he returns is not for us to know. The servants keep faith." This is a gameplay state, not history.

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

The black islands of the Ocean of Zol are a scripted list of states (`zin_is_site_ocean_of_zol_island`, from the key sites table). An island **stirs** when state flag `zin_zol_island_stirring` is set. `zin_zol_islands_stirring` counts them (shared, so Aenor's Lost Cause and Lerendor can read it).

| Action | Effect |
| --- | --- |
| Decision "Wake an Island" (targets one island that does not stir; 25 PP; 30 days) | Island stirs; +0.5 power; rumour roll |
| Focuses in the Black Islands branch | Wake 1, 2 or all remaining islands |
| A stirring island | Hosts may rise there (after the focus "The Island Hosts"); counts toward the rising |

**Rumours.** Each time an island wakes, a rumour roll sends event `zin_mistake.2` "Tales of Black Ships" to one coastal country near the Ocean of Zol (a generated list of countries with coast on the Ocean of Zol sea regions: North Lands, Magical Lands and the northern East Lands). Chance: 30% by default, 50% with "Let Them Talk", 10% with "Keep the Isles Dark", halved by "A Concealed Allegiance", 0% with "The Unwatched North".

"Tales of Black Ships" (to the coastal country):
- A "Fishermen's tales." Nothing happens. AI chance 95%.
- B "Send a ship to look." −25 PP; country flag `zin_zol_forewarned`. When Zol rises, that country gets timed idea `zin_zol_forewarned` for 365 days (`defense_bonus_against` Zol +0.1).

Every tale adds +0.5 to `zin_gathering_dark` through `zin_world_add_gathering_dark`, at most +5 in total before the rising. The tales name no god and no servant; they speak of "black hulls among the islands and lights that are not fires". Nobody at a royal court acts on them unless a player chooses to.

### 5. Hosts: Zol's dead

Zol's soldiers are **hosts**: divisions of the template `zin_zol_deathless_host` (10 battalions of the warfare spec's sub-unit `zin_deathless_dead`, about 10,000 dead). They are sustained by Zol's own death-magic (established). They are not the wandering dead.

| Rule | Value |
| --- | --- |
| How raised | Decision "Raise a Host": 2 power, 10 PP, 15 days; spawns at Furviatlon, at Šodolôrō (after the focus "Šodolôrō") or on a stirring island (after "The Island Hosts"). Focuses and the rising raise hosts for free. |
| Host cap | floor(power / 4) + `zin_zol_host_cap_bonus`. Before the rising the cap is 4 and hosts must spawn inside the Mistake. |
| Equipment | Grave arms (`zin_grave_arms`, warfare spec; until then `infantry_equipment_1`), granted by the mechanic, never produced. Each raise adds the arms it needs. |
| Manpower | Start 0. The rising grants 10,000 × hosts raised. After the rising the dynamic modifier `zin_zol_presence` gives `weekly_manpower` = 20 × power (1,200 a week at 60). |
| Supply | Spirits reduce supply use and attrition; the dead need no food. |

### 6. The deathless dead

Ordinary weapons break their shapes but cannot end them (established). The game models this in three parts.

1. **The fallen return.** On Zol's monthly tick, scripted effect `zin_zol_return_the_fallen` runs over every enemy. For each enemy it measures the thousands of casualties that enemy has inflicted on Zol since the last tick (trigger `casualties_inflicted_by`, counted upward in a `while_loop_effect` from the stored variable `zin_zol_fallen_seen_k` on the enemy). If the enemy does **not** have potent magic (`zin_has_potent_magic`), Zol regains `zin_zol_return_rate` × that many thousand manpower (`add_manpower`). Base rate 0.60; focuses raise it; cap 0.90. If the enemy has potent magic, nothing returns: those dead are ended.
2. **Deathless endurance.** The spirit line `zin_zol_deathless` (1 to 3) gives organisation regain, reinforcement and resistance to experience loss (see the tree spec).
3. **The bane of potent magic.** Each month every country at war with Zol that has `zin_has_potent_magic` receives idea `zin_zol_bane` (`targeted_modifier` against Zol: `attack_bonus_against` +0.3, `defense_bonus_against` +0.2; +0.2 attack after Zol's focus "What Can End Them" teaches his hosts to avoid it). The idea is removed when the war or the magic ends.

`zin_has_potent_magic` is owned by the magic and world systems spec. Until it exists, it is true for a country with country flag `zin_potent_magic`. The Eindil's journey spec sets that flag on the country Eindil serves while he carries Glo, and while Varner fights with it; this spec sets it on Gala Elves while Lorien rides (section 9).

**Breaking a front.** Scripted effect `zin_zol_break_front` (state scope) destroys every Zol division in the state and in adjacent states that Zol controls, marks their manpower as ended (no return), and costs Zol 3 power. The Eindil's journey spec calls it for "the sword in the earth" (established: Glo's wave breaks a whole front of Zol's dead).

### 7. The rising (`zin_zol_rising`, historical 4A 1755)

Scripted trigger `zin_zol_can_rise`:

- not `zin_zol_rising`, not `zin_zol_presence_lapsed`;
- `zin_mistake_power` ≥ 55 and `zin_zol_islands_stirring` ≥ 4;
- and one of:
  - route "The Appointed Hour" and date ≥ 1 Sowing 4A 1755 (`1755.5.1`);
  - route "The Hastened Hour" and date ≥ 1 Thaw 4A 1753 (`1753.3.1`);
  - route "The Long Patience" with "A Greater Hour" and date ≥ 1 Deepwinter 4A 1760 (`1760.1.1`);
  - Zol is at war (someone attacked him first): power and island limits are ignored.

The rising is taken by the focus "The Dead Rise" or the decision of the same name. Scripted effect `zin_zol_rise`:

1. `set_global_flag = zin_zol_rising`.
2. `set_rule = { can_not_declare_war = no }`; swap `zin_zol_the_dormancy` for `zin_zol_the_rising`.
3. Raise floor(power / 10) hosts for free on stirring islands and at Šodolôrō; add 10,000 manpower per host and their grave arms.
4. Event `zin_mistake.10` "Whither the Dead" for Zol picks the first target (below).
5. `zin_world_add_gathering_dark` +10.
6. News event `zin_mistake.11` "The Dead Come Out of the North" for every country.
7. Countries with `zin_zol_forewarned` get their idea.

"Whither the Dead" (`zin_mistake.10`):
- A "South, to the Middle Kingdom." War on Aenor (`annex_everything`). AI: 100 on the historical path.
- B "The northern shores." War on Lerendor. AI: 0 historical, 20 otherwise.
- C "The edge of the elven woods." War on the Magical Lands realm with the most states bordering the Mistake. AI: 0 historical, 10 otherwise.

Aenor's subjects and allies join by the normal rules. The rising does not itself set `zin_war_of_last_crowns`; the world systems spec decides when the great war has begun.

**Forced rising on the historical path.** With `zin_rule_historical_path` on and Zol played by the AI: on 1 Goldfield 4A 1755 (`1755.7.1`), if Zol has not risen, power is raised to 55 if lower, islands to 4 if fewer, and `zin_zol_rise` runs with option A.

### 8. Zol and Volgan

The two powers clash first and later join briefly against Eindil (established). Nothing else about their relationship is stated in text.

| Step | Trigger | Effect |
| --- | --- | --- |
| Clash | `zin_zol_rising` and `zin_volgan_marches`, both at war with Aenor or a Concord member, 60 days after the later flag (or the focus "Two Darknesses Meet") | Event `zin_mistake.15` "Two Darknesses Meet" for Zol and Volgan. A "Let the dead of both contend" (historical): Zol declares war on Volgan; sets `zin_zol_volgan_clash`. B "Leave the south to the south": no war. AI on the historical path: A 100. |
| Brief accord | `zin_eindil_returned`, both at war with the country that has character `zin_eindil`, Volgan's body not destroyed | Event `zin_mistake.16` "The Brief Accord" offered to Volgan by Zol (or the reverse; Volgan spec mirrors). Accept: `white_peace` between them, mutual military access, sets `zin_zol_volgan_accord`. AI accepts on the historical path. |
| Accord ends | `zin_volgan_body_destroyed` or `zin_zol_withdrawn` | Event `zin_mistake.17` "The Accord Is Spent": access revoked. No war is declared again. |

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
3. Add spirit `zin_zol_manifestation`.
4. Create one division of template `zin_zol_the_presence` (warfare spec sub-unit `zin_zol_presence`, very high attack and organisation, cannot be reinforced) in the Zol-controlled state of the Middle Lands with the most Zol divisions, or at Furviatlon if none.
5. Start mission `zin_zol_the_form_endures` (63 days). Each week the form costs `zin_zol_manifest_cost` power (start 3; 2 after "The Cost of Form").
6. `zin_world_add_gathering_dark` +10. News event `zin_mistake.20` "Zol Comes Forth" for every country.

**The form cannot last.** Withdrawal (`zin_zol_withdraw`) happens at the first of:

| End | How | Text |
| --- | --- | --- |
| The old powers force him back (historical) | Event `zin_mistake.23` after Lorien's stand | Lorien and ancient spirits spend themselves; Zol withdraws. |
| The cost is too great | Power falls below 20 | Event `zin_mistake.25` "The Form Is Spent". |
| Time | Mission `zin_zol_the_form_endures` times out | Event `zin_mistake.25`. |
| The form is destroyed | The `zin_zol_the_presence` division is destroyed | Event `zin_mistake.25`. |

**Eindil and the blue sword** (established sequence). While Zol is manifested and at war with the country that has `zin_eindil`, and `zin_glo_with_eindil` is set, event `zin_mistake.21` "One Finger" fires for both after 7 days:
- Sets global flag `zin_blue_sword_broken` (Horos's sword is crushed).
- Calls the Eindil's journey spec's wound effect for Eindil.
- Zol: +5 power (he drains New God power from Eindil).
- Then the shard: Zol −15 power; the mission loses 21 days. Text: "A shard of the broken blade still carried Glernaen's power. The form shook."

**Lorien's stand.** When `zin_zol_manifested` is set and Lorien lives (`zin_lorien_dead` not set), Gala Elves get event `zin_mistake.22` "The Old Lords Ride":
- A "We ride, for all the living." (historical; AI 100 on the historical path, 80 otherwise.) Gala Elves gets `zin_potent_magic` for 30 days and, after 14 days, event `zin_mistake.23` "Lorien Challenges Zol" fires for every country: the elves spec's Lorien-death effect runs (sets `zin_lorien_dead`), then `zin_zol_withdraw`.
- B "This is not our war." Nothing; the form burns out by itself (section above).

**Withdrawal** (`zin_zol_withdraw`):

1. `set_global_flag = zin_zol_withdrawn`. Remove `zin_zol_manifestation`; delete the Presence division.
2. Power: max(power − 20, 10). He is wounded and constrained, not destroyed; the floor stops the realm from lapsing on the spot.
3. Add timed idea `zin_zol_wounded` (730 days).
4. Every Zol division outside Zol-owned states is deleted (the hosts lose coherence or leave the field). Hosts inside the Mistake remain.
5. Zol makes `white_peace` with every enemy. Every foreign state Zol controlled returns to its controller's owner and gets state dynamic modifier `zin_zol_deathfield` for 1,095 days.
6. `set_rule = { can_not_declare_war = yes }` until 1 Deepwinter 4A 1770 (`1770.1.1`).
7. News event `zin_mistake.24` "Zol Withdraws" for every country. Text: "He withdrew into the dark of his domain. He was not slain."
8. Accord with Volgan ends (`zin_mistake.17`).

**If Zol capitulates** (`on_capitulation_immediate` for Zol): run `zin_zol_withdraw` instead of a peace conference (event text "The Presence Recedes"), and if not yet manifested, set no manifestation flags. Zol cannot be annexed or puppeted: the peace conference never opens for him. This keeps every outcome consistent with "not slain".

### 10. After the withdrawal and the sandbox

- Power regrows by the monthly formula. `zin_zol_wounded` constrains his hosts for two years.
- From 4A 1770, with the focus "Matters for Another Age", decision "A Second Stirring" (power ≥ 60, islands ≥ 4) may raise the dead again: the same as `zin_zol_rise` but without `zin_zol_rising` side effects already set and without a news event naming an age. **No second manifestation is possible before the game ends in 4A 1800** (proposed; see open questions).
- Route "The Unending Patience": Zol never rises in this game unless attacked. He ends the game with the most power a Zol can hold. This is a player route, not a claim about history.

Zol has no ending of his own. The three endings belong to the world systems spec. At the end screen Zol's player sees his power, the islands that stir, and the field he held, with no claim that he won or lost the age.

### 11. Expressions of the Presence

Unlocked by the focus "What Is Held, What Is Spent". Decisions that spend power, not PP:

| Decision | Cost | Requires | Effect |
| --- | --- | --- | --- |
| "A Shadow on the Land" (targets an enemy neighbour) | 4 power | at war | Target: −5% war support, −3% stability |
| "Stillness Before the Form" | 8 power | rising, convergence < 100 | +5 convergence |
| "The Dead Endure" | 6 power | at war | All Zol divisions regain 30% organisation (`set_unit_organization` per division) |

## Implementation

### Files

| Path | Content |
| --- | --- |
| `common/scripted_effects/zin_mistake.txt` | All `zin_zol_*` effects below |
| `common/scripted_triggers/zin_mistake.txt` | All triggers below |
| `common/ideas/zin_mistake.txt` | Mechanic ideas (the tree's spirits live in `common/ideas/zin_focus_zol.txt`) |
| `common/dynamic_modifiers/zin_mistake.txt` | `zin_zol_presence`, `zin_zol_black_waste`, `zin_zol_deathfield` |
| `common/decisions/zin_mistake.txt`, `common/decisions/categories/zin_mistake.txt` | Category `zin_mistake_presence` "The Presence" |
| `common/on_actions/zin_mistake.txt` | `on_startup`, `on_monthly_<Zol>`, `on_weekly_<Zol>`, `on_capitulation_immediate` |
| `events/zin_mistake.txt` | Namespace `zin_mistake` |
| `common/game_rules/zin_mistake.txt` | `zin_rule_zol_behaviour` |
| `common/characters/zin_zol.txt` | `zin_zol` and the ordinal host commanders |
| `history/units/zin_zol.txt` | Templates `zin_zol_deathless_host`, `zin_zol_the_presence`; no starting divisions |
| `localisation/english/zin_mistake_l_english.yml` | All text |

### Variables

| Variable | Scope | Range | Start | Meaning |
| --- | --- | --- | --- | --- |
| `zin_mistake_power` | Zol | 0–100 | 35 | Shared contract |
| `zin_zol_bond_great`, `zin_zol_bond_lesser`, `zin_zol_bond_divine` | Zol | 0–5 | 1, 2, 1 | Strength of each order's service |
| `zin_zol_growth_bonus` | Zol | 0–0.5 | 0 | Added monthly growth |
| `zin_zol_fading_pressure` | Zol | 0.05–0.3 | 0.15 | Monthly loss to the Fading |
| `zin_zol_islands_stirring` | Zol | 0–all | 0 | Stirring islands (shared read) |
| `zin_zol_host_cap_bonus` | Zol | 0–20 | 0 | Extra hosts allowed |
| `zin_zol_hosts` | Zol | count | 0 | Hosts alive (recounted monthly) |
| `zin_zol_return_rate` | Zol | 0.6–0.9 | 0.6 | Share of fallen that return |
| `zin_zol_fallen_seen_k` | each enemy | ≥0 | 0 | Casualties already counted |
| `zin_zol_convergence` | Zol | 0–100 | 0 | Readiness to manifest (shared read) |
| `zin_zol_convergence_rate` | Zol | 0–3 | 0 | Extra monthly convergence |
| `zin_zol_manifest_cost` | Zol | 2–3 | 3 | Weekly power cost of the form |
| `zin_zol_presence_pp`, `zin_zol_presence_manpower` | Zol | derived | 0 | Values for the dynamic modifier |

### Flags

| Flag | Scope | Set by |
| --- | --- | --- |
| `zin_zol_rising`, `zin_zol_manifested`, `zin_zol_withdrawn` | global | contract; this spec |
| `zin_blue_sword_broken` | global | event `zin_mistake.21` (new; read by Eindil's journey and the palace battle) |
| `zin_zol_volgan_clash`, `zin_zol_volgan_accord` | global | events 15 and 16 (new; read by Volgan) |
| `zin_zol_presence_lapsed` | Zol | power 0 |
| `zin_zol_route_appointed`, `zin_zol_route_hastened`, `zin_zol_route_patience`, `zin_zol_greater_hour`, `zin_zol_unending` | Zol | tree route focuses |
| `zin_zol_calls_open`, `zin_zol_hosts_open`, `zin_zol_expressions_open`, `zin_zol_manifest_open`, `zin_zol_tending`, `zin_zol_bonds_steadfast`, `zin_zol_veiled`, `zin_zol_isles_loud`, `zin_zol_isles_dark`, `zin_zol_unwatched`, `zin_zol_muster_sodoloro`, `zin_zol_muster_islands`, `zin_zol_knows_bane`, `zin_zol_breaking_attuned`, `zin_zol_second_stirring_open` | Zol | tree focuses |
| `zin_zol_island_stirring` | state | waking |
| `zin_zol_forewarned` | other countries | "Tales of Black Ships" option B |
| `zin_potent_magic` | any country | fallback for `zin_has_potent_magic` |

### Scripted effects

| Effect | Scope | Does |
| --- | --- | --- |
| `zin_zol_add_mistake_power` | any (acts on Zol) | Add `value`, clamp 0–100, refresh `zin_zol_presence` |
| `zin_zol_add_bond_great`, `zin_zol_add_bond_lesser`, `zin_zol_add_bond_divine` | Zol | Add `value`, clamp 0–5 |
| `zin_zol_add_growth_bonus`, `zin_zol_add_fading_pressure`, `zin_zol_add_return_rate`, `zin_zol_add_host_cap`, `zin_zol_add_convergence`, `zin_zol_add_convergence_rate`, `zin_zol_set_manifest_cost` | Zol | Change the named variable within its range |
| `zin_zol_wake_island` | Zol | Wake `count` random non-stirring islands (`all` = every one); rumour roll each |
| `zin_zol_raise_host` | Zol | Create `count` hosts at the allowed muster sites; `free` skips the power cost |
| `zin_zol_harden_wastes` | Zol | Add `zin_zol_black_waste` to every Zol-owned state |
| `zin_zol_spread_deathfield` | Zol | Add `zin_zol_deathfield` to every foreign state Zol controls |
| `zin_zol_wargoal_elven_edge` | Zol | Wargoal on the Magical Lands realm with most states next to the Mistake |
| `zin_zol_rise`, `zin_zol_manifest`, `zin_zol_withdraw` | Zol | Sections 7 and 9 |
| `zin_zol_monthly` | Zol | Power formula, falter roll, lapse check, host recount, convergence, `zin_zol_return_the_fallen`, bane upkeep, dynamic modifier values |
| `zin_zol_weekly_manifest` | Zol | Weekly cost of the form; ends it below 20 power |
| `zin_zol_return_the_fallen` | Zol | Section 6 |
| `zin_zol_break_front` | state | Section 6 (called by Eindil's journey) |
| `zin_zol_shorten_wound` | Zol | Reduce `zin_zol_wounded` by `days` (`modify_timed_idea`) |

`call` arguments from the focus compiler are passed as temporary variables (`value`, `count`, `days`); the effects read them.

### Scripted triggers

| Trigger | Scope | True when |
| --- | --- | --- |
| `zin_is_zol` | country | This country is Zol |
| `zin_zol_can_rise` | Zol | Section 7 |
| `zin_zol_can_manifest` | Zol | Section 9 |
| `zin_zol_is_manifest` | any | `zin_zol_manifested` and not `zin_zol_withdrawn` |
| `zin_has_potent_magic` | country | Owned by the magic spec; fallback `has_country_flag = zin_potent_magic` |
| `zin_is_site_furviatlon`, `zin_is_site_sodoloro`, `zin_is_site_ocean_of_zol_island` | state | Key sites table |

### Ideas and dynamic modifiers (mechanic-owned)

| Id | On | Modifiers | Added / removed |
| --- | --- | --- | --- |
| `zin_zol_without_a_body` | Zol | `surrender_limit` 0.5, `required_garrison_factor` −0.75, `research_speed_factor` −0.5, `drift_defence_factor` 1.0 | Start; permanent |
| `zin_zol_the_dormancy` | Zol | `political_power_factor` −0.2, `max_command_power` −50 | Start; swapped at the rising |
| `zin_zol_the_rising` | Zol | `war_support_factor` 1.0, `stability_factor` 0.5, `army_org_factor` 0.1 | Rising |
| `zin_zol_manifestation` | Zol | `army_attack_factor` 0.3, `army_defence_factor` 0.2, `army_morale_factor` 0.3, `breakthrough_factor` 0.2 | Manifestation; removed at withdrawal |
| `zin_zol_wounded` | Zol | `army_attack_factor` −0.2, `army_org_factor` −0.2, `political_power_factor` −0.3 | Withdrawal, 730 days |
| `zin_zol_bane` | enemies with potent magic | `targeted_modifier` vs Zol: `attack_bonus_against` 0.3 (0.2 after "What Can End Them"), `defense_bonus_against` 0.2 | Monthly upkeep |
| `zin_zol_forewarned` | forewarned countries | `targeted_modifier` vs Zol: `defense_bonus_against` 0.1 | Rising, 365 days |
| `zin_zol_presence` (dynamic) | Zol | `political_power_gain` = `zin_zol_presence_pp` (power × 0.005), `weekly_manpower` = `zin_zol_presence_manpower` (power × 20 after the rising, 0 before) | Start; values refreshed monthly |
| `zin_zol_black_waste` (dynamic) | Zol-owned states | `enemy_attrition` 0.15, `enemy_army_speed_factor` −0.15 | "The Black Wastes" |
| `zin_zol_deathfield` (dynamic) | foreign states | `local_manpower` −0.5, `state_resources_factor` −0.25, `local_supplies` −1 | "The Land Made Waste"; withdrawal (1,095 days) |

### Decisions (category `zin_mistake_presence`, Zol only)

| Decision | Visible | Cost | Effect |
| --- | --- | --- | --- |
| `zin_zol_tend_the_presence` | always | 50 PP (25 with flag `zin_zol_tending`) | +1.5 power; cooldown 120 (90) days |
| `zin_zol_call_upon_great` / `_lesser` / `_divine` | `zin_zol_calls_open` | 75 / 50 / 100 PP | Bond +1 (divine: 25% "Silence Among the Divine") |
| `zin_zol_wake_island` (targeted) | always | 25 PP (12 with `zin_zol_isles_loud`), 30 days (15 loud, 45 dark) | Wake that island |
| `zin_zol_raise_host` | `zin_zol_hosts_open` | 2 power, 10 PP, 15 days | One host |
| `zin_zol_the_dead_rise` | a route flag | none | `zin_zol_rise` when `zin_zol_can_rise` |
| `zin_zol_come_forth` | `zin_zol_manifest_open` | none (cost inside the effect) | `zin_zol_manifest` |
| `zin_zol_shadow_on_the_land`, `zin_zol_stillness_before_the_form`, `zin_zol_the_dead_endure` | `zin_zol_expressions_open` | power | Section 11 |
| `zin_zol_second_stirring` | `zin_zol_second_stirring_open`, date ≥ 1770.1.1 | none | Raise again (section 10) |
| Mission `zin_zol_the_form_endures` | manifestation | — | 63 days; timeout → `zin_zol_withdraw` |

### Events (namespace `zin_mistake`)

| Id | Title | For | Trigger | Options |
| --- | --- | --- | --- | --- |
| `.1` | (hidden) Setup | Zol | `on_startup` | Set start variables, rules, ideas |
| `.2` | Tales of Black Ships | coastal country | rumour roll | A dismiss (AI 95) / B send a ship |
| `.3` | Silence Among the Divine | Zol | divine call fails | A accept |
| `.4` | A Service Falters | Zol | MTTH 18 months | A accept (bond −1) |
| `.5` | The Presence Thins | Zol | power falls below 15 | A accept |
| `.6` | The Presence Lapses / Returns | Zol | power 0 / back to 10 | A accept |
| `.10` | Whither the Dead | Zol | rising | A Aenor / B Lerendor / C elven edge |
| `.11` | The Dead Come Out of the North | all (news) | rising | A "So the fishermen were right." |
| `.12` | Ordinary Arms Fail | each country, once | first 10,000 casualties it inflicts on Zol without potent magic | A "Then we need more than steel." |
| `.15` | Two Darknesses Meet | Zol, Volgan | section 8 | A war / B no war |
| `.16` | The Brief Accord | Volgan (from Zol) | section 8 | A accept / B refuse |
| `.17` | The Accord Is Spent | Zol, Volgan | section 8 | A accept |
| `.20` | Zol Comes Forth | all (news) | manifestation | A accept |
| `.21` | One Finger | Zol, Eindil's country | section 9 | A accept |
| `.22` | The Old Lords Ride | Gala Elves | section 9 | A ride / B stay |
| `.23` | Lorien Challenges Zol | all (news) | 14 days after `.22` A | A accept |
| `.24` | Zol Withdraws | all (news) | withdrawal | A accept |
| `.25` | The Form Is Spent / The Presence Recedes | Zol, all | other withdrawal causes | A accept |
| `.30` | A Second Stirring | all (news) | second stirring | A accept |

No `zin_mistake` text names Afrit or calls the Deliverer anything. Events before `zin_eindil_awake` never mention Eindil.

### Game rule

`zin_rule_zol_behaviour` (AI Zol only):

| Option | Effect |
| --- | --- |
| `HISTORICAL` (default) | Route "The Appointed Hour"; forced rising 1755.7.1; manifestation after Volgan's body falls; catch-ups below |
| `DORMANT` | Route "The Long Patience" then "The Unending Patience" |
| `EARLY` | Route "The Hastened Hour" |
| `FREE` | Focus weights only; no catch-ups |

When `zin_rule_historical_path` is off, `HISTORICAL` behaves like `FREE`.

### Historical catch-ups (AI Zol, `HISTORICAL`)

| Date or flag | If not yet | Then |
| --- | --- | --- |
| 1755.7.1 | risen | Forced rising (section 7) |
| `zin_volgan_body_destroyed` | manifested | Convergence to 100 and power to 60 if lower; `zin_zol_manifest` within 7 days |
| 1758.1.1 | manifested, and risen | Same as above |
| Manifested 63 days | withdrawn | Withdrawal (mission timeout) |

### Defines

None.

## AI

- **Before the rising:** no war; AI strategy none against anyone. Focus order per the tree spec. Takes "Tend the Presence" whenever available, calls upon the orders when PP ≥ 100, wakes an island every 60–90 days until all stir, raises hosts to the pre-rising cap of 4 by 4A 1754.
- **At the rising:** `add_ai_strategy` `conquer` Aenor (value 200), `antagonize` Aenor, `invade` Aenor (naval, from the islands); `area_priority` for the Middle Lands. Keeps 2 hosts at Furviatlon.
- **War:** raises hosts up to the cap whenever power ≥ 50; spends "The Dead Endure" when more than half its divisions are below 50% organisation; avoids battle against countries with `zin_has_potent_magic` when it can (`front_unit_request` lowered on those fronts).
- **Manifestation:** only on the historical catch-up, or when `zin_zol_can_manifest` and a country with potent magic is at war with Zol on the `FREE` rule.
- **After withdrawal:** no war until 1770; then a second stirring only on `FREE` with weight 10.
- **Other AIs:** treat Zol's Mistake as a hostile wasteland; the AI of Aenor, Lerendor and the Magical Lands does not prepare against Zol before the rising unless forewarned.

## Acceptance

1. On 1 Thaw 4A 1748 Zol is at peace with everyone, cannot declare war, has power 35, bonds 1/2/1, no stirring islands, and no named advisor or general. No start text names a servant or a keeper of Furviatlon.
2. With no focuses and no decisions, power rises by 0.09 a month (±0.01) in a 24-month run.
3. Setting all bonds to 0 makes power fall each month; at 0 the lapse event fires, hosts disband, and power can return.
4. Waking an island sets the state flag, increments `zin_zol_islands_stirring` and rolls a rumour; "Tales of Black Ships" never names a god, a servant or Afrit.
5. Before the rising, "Raise a Host" cannot exceed 4 hosts and spawns only inside the Mistake.
6. On the historical path with no player, Zol rises between 1755.5.1 and 1755.7.1 and is at war with Aenor; `zin_zol_rising` is set once.
7. Zol's manpower returns after battles with an enemy without potent magic (60–90%), and does not return after battles with an enemy that has `zin_potent_magic`.
8. `zin_zol_break_front` removes every Zol division in the target and adjacent controlled states with no manpower returned.
9. Zol and Volgan go to war after both have marched, and make the accord after `zin_eindil_returned`; the accord ends when Volgan's body falls.
10. On the historical path, Zol manifests within 7 days of `zin_volgan_body_destroyed`, "One Finger" sets `zin_blue_sword_broken` when Eindil's country is at war with Zol, Lorien rides, `zin_lorien_dead` and `zin_zol_withdrawn` are set, and all three happen in 4A 1757 in a test run.
11. After withdrawal, Zol has power ≥ 10, no divisions outside the Mistake, is at peace, cannot declare war before 1770, and still exists.
12. Zol capitulating triggers withdrawal, never annexation.
13. The compiler's secret check passes for every `zin_mistake` text; no text before `zin_eindil_awake` names Eindil.
14. Every modifier named here exists in the game's modifier documentation; the script validator reports no unknown effects or triggers.

## Open questions

1. Is a non-figurative emblem acceptable as Zol's leader portrait, given that he has no body? Or should the leader slot show no portrait at all?
2. Are ordinal host commanders ("The First Host") acceptable, or should Zol's armies have no commanders?
3. Should the wandering dead of the Mistake ever be playable, or always a hazard for intruders (this spec: hazard only)?
4. May the dead attack the North Lands or the elves instead of Aenor in a non-historical game, or must the target always be Aenor?
5. Can Zol manifest a second time in the sandbox before 4A 1800? This spec says no.
6. Should Zol have his own end-of-game outcome? The vault lists none; this spec gives him none.
7. The canonical spelling Šodolôrō contains ō, which the game font (Windows-1252) cannot draw. Which in-game form should localisation use: "Šodolôro" (the roster's current form) or another?
8. Do the black areas on the Magical Lands sheet belong to the Mistake (map spec question 1)? This changes which elven realms border it.
