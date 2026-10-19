# Magic and world systems

**Status:** Ready. Reviewed 19 October 2026 against CONVENTIONS "Status"; integrated 19 October 2026. **Priority:** 3. **Phase:** 3.

## Purpose

Magic in Erdae is rare, named and specific. There is no general mana bar. A handful of real powers exist: Glo and Horos's blue sword, Afrit's artifacts, the dragons of Dragon Mountain, Zol's deathless dead held back by the Fading, the storms and heat of the Dead Lands, the Great Wall, and two one-time interventions near the end of the age (Varner's wards and the New Gods' restoration of Eindil).

Several mechanic specs already own parts of these. This spec is the world layer that binds them: it fixes the rules every system must obey, defines **potent magic**, and owns the pieces nobody else owns: the dragon pool, the Wall's upkeep and breaches, the Dead Lands' storms and heat, and the exact effects of the two interventions.

| Power | Owner of the mechanics | This spec |
| --- | --- | --- |
| Glo, Horos, the hall | [Yeldenne and Glo](../04_mechanics/yeldenne_and_glo.md) | Invariants; potent magic |
| The blade, the Glo bearer's equipment, the deathless armour rule | [01_warfare.md](01_warfare.md) | Invariants |
| Afrit's artifacts and the palace battle | [Afrit](../04_mechanics/afrit_hidden_council.md), [Eindil's journey](../04_mechanics/eindil_journey.md) | Invariants |
| Zol's dead, the rising, the manifestation | [Zol's Mistake](../04_mechanics/zols_mistake.md) | The Fading's invariants; potent magic |
| Varner's wards, the New Gods' restoration | Eindil's journey (the moments) | The effects and the once-only rule |
| Dragons | warfare (units), Eindil's journey (Eindil's dragon) | The pool, the pacts, corruption |
| The Great Wall | map (line), warfare (forts and modifier) | Upkeep, breaches; the Wall Accord is in [03_diplomacy_and_factions.md](03_diplomacy_and_factions.md) |
| Dead Lands storms and heat | map (weather) | The storm pulse, the coasts, the heat |

## Lore basis

**Established** (vault):

- **Glo** is a green crystal holding part of the power of **Glernaen**, a true New God of Power and Wisdom; it is Horos's own heart. Horos gives it and his blue sword to Eindil and turns to dust. The guardian's willing transfer matters; holding the castle does not give Glo (*Castle of Yeldenne and Glo*, *Horos*).
- **Horos's sword** destroys Zol's directly sustained dead; Zol crushes it; a shard still wounds Zol's manifestation (*Horos's Blue Sword*).
- **The Necklace of the Abyss** amplifies Afrit, most of all in Aenor. Afrit holds other artifacts, including a ring Eindil tears away. Stripped of them, Afrit is mortal. Golbran removes the necklace; Eindil later wears it (*Necklace of the Abyss*, *Afrit's Collected Artifacts*).
- **Dragons** come chiefly from Dragon Mountain and do not form a country. Elven powers can command them; Afrit can through corruption. Eindil returns riding a dragon (*Peoples of Erdae*, *War of the Last Crowns*).
- **Zol's dead** are sustained by an Old God's own death-magic. Ordinary weapons cannot end them; only potent magic, such as Glo's and the sword's, can (*Zol*).
- **The Fading** limits the Old Gods. Zol cannot take an ordinary body; servants sustain his presence; his power grows very slowly. He manifests once, briefly and at great cost, and is forced back, not killed (*The Fading*, *Magic and Sustenance in Erdae*, *Zol*). The causes of the Fading and the meaning of "feeding" are **unknown** and must not be resolved.
- **The Dead Lands** are hard to reach by sea because of fierce storms, and oppressively hot farther south (*Volgan's Dead Lands*).
- **Varner**, a Lesser Spirit, shields the living armies from Zol's death-magic, lifts curses, opens escape routes and dies doing it; Golbran spends nearly all his magic on Varner's wards (*Varner*, *Golbran*).
- **The New Gods** restore Eindil through Glo after Volgan casts him down (*Fourth Age Canon Register*).

**Proposed in the vault:** the names and functions of the Ring of Doors, Crown of Witnesses and Bracelet of the First Seal; the dragon as a free ally entrusted by elves; that the New Gods could make their offering only once; the Wall Accord and that the Wall also guards against dragons; the explanation of Zol's manifestation.

**Proposed in this spec:** potent magic as a game rule, the dragon pool, the storm pulse, the heat, the Wall's upkeep and breach, the effects of the interventions, all numbers.

**Decisions applied** ([INTEGRATION_DECISIONS.md](../INTEGRATION_DECISIONS.md)): N1 (the blade's breaking is `zin_horos_sword_broken`), O4 (the sword-break is Zol's `zin_mistake.21` alone), S4 (Zol is led by the emblem "The Will of Zol"), S6 (dragons use the air layer), D3 (the world learns the name Afrit at his flight east), E1 (arguments compile to `zin_arg_<name>`).

## Design

### The six rules of magic

Every spec, focus tree and event must obey these. The compiler and the acceptance runs check them.

1. **Potent magic is named.** Only the sources listed under "Potent magic" end Zol's dead. No technology, unit, focus, spirit or decision outside that list may make a country count as having potent magic. Ordinary battle magic (wardsingers, hallowed arms, battle-mages) is not potent magic.
2. **Nobody unworthy holds Glo.** Afrit and Volgan can kill Horos, seal Glo or dim it; they never use it (Yeldenne and Glo spec).
3. **Afrit is mortal only when stripped.** Afrit's death cannot happen while `zin_afrit_artifacts` > 0; the count falls only in the palace battle (Afrit spec).
4. **Zol is never slain.** No effect destroys Zol, annexes his realm or gives him a lasting body. He manifests at most once before 4A 1800 (Zol spec).
5. **The interventions happen once.** Varner's wards rise once; the New Gods restore Eindil once, and never a second bearer.
6. **The unknown stays unknown.** No text explains the Fading, what "feeding" Zol is, what Glo keeps after the sword breaks, what the Necklace does to Eindil, or whether Volgan's spirit survives.

### Potent magic

`zin_has_potent_magic` (country; the name the Zol spec already uses) is true while any of these holds:

| Source | Condition | Set by |
| --- | --- | --- |
| Glo carried | The country employs the bearer (`zin_glo_is_bearer_host`) and `zin_glo_state` is 1 or 4; this covers Eindil's host while he bears Glo | Yeldenne and Glo |
| Lorien's ride | Country flag `zin_potent_magic` on the Gala Elves for 30 days | Zol's Mistake (`zin_mistake.22`) |
| Varner's wards | The timed spirit `zin_world_varners_wards` with its potent clause (the host only, below) | this spec |

What potent magic does is owned elsewhere and is not stacked here: Zol's fallen do not return to him (Zol spec, `zin_zol_return_the_fallen`); the country gets Zol's bane (`zin_zol_bane`, Zol spec); the Glo bearer's blade pierces the deathless armour (warfare); Glo's Wave unmakes a front (`zin_glo_wave`, Yeldenne and Glo). This spec defines the trigger, and `world_magic.mjs` runs before the Zol module, so the Zol module's files never stage without it; the trigger includes the flag `zin_potent_magic`.

Only Zol's `zin_mistake.22` sets the flag `zin_potent_magic` (compiler check). Eindil's journey sets no potency flag: his host's potency comes from carrying Glo and from Varner's wards, through the rows above.

### Varner's wards (once)

Varner arrives with Eindil (journey stage 9). The journey's event `zin_eindil.97` "Varner's Last Wards" calls `zin_world_raise_varners_wards` once; the flag `zin_varner_wards_raised` blocks any second call.

| Who | Effect | Duration |
| --- | --- | --- |
| Eindil's host (`global.zin_eindil_host`) | Spirit `zin_world_varners_wards`: `army_org_factor = 0.10`, `army_defence_factor = 0.10`; counts as potent magic | 90 days |
| Every other country at war with Zol and on the host's side of any war | Spirit `zin_world_varners_shelter`: `army_defence_factor = 0.10`, `org_loss_when_moving = -0.10` (the escape routes); not potent | 90 days |
| Varner and Golbran | The journey's event sets `zin_varner_dead` (established: the defence costs his life) and the host's `zin_golbran_spent`; the meter change is the tension spec's | — |

If Eindil never returns, Varner never intervenes.

### The New Gods' restoration (once)

The journey's event `zin_eindil.98` "The Gathering of the New Gods" (after Volgan casts Eindil down) sets `zin_eindil_restored` and calls `zin_world_grant_new_gods_gift`:

- Requires `zin_glo_state` = 1 (Eindil, not a second bearer) and `zin_eindil_restored` not set before. Otherwise the gift does nothing and the journey's "The Heir Does Not Rise" applies.
- Eindil's host gets **The Gods' Gift** (`zin_world_new_gods_gift`) for 365 days: `army_org_factor = 0.05`, `war_support_factor = 0.10` (the peoples unite), and a targeted modifier toward Volgan: `attack_bonus_against = 0.25`.
- The journey adds the trait `zin_eindil_blessed_of_the_new_gods` and sets Glo power to 100 (Yeldenne and Glo).
- Never twice: a later fall (the cliff) is survived or not by the journey's own rules, never by the gods.

### Glo and the sword (invariants)

Owned by the Yeldenne and Glo spec (`zin_glo_state`, `zin_glo_power`, `zin_glo_sealed`, `zin_glo_dimmed`, Glo's Wave). Rules this spec holds every system to:

- Glo moves only through `zin_glo_transfer`.
- Occupying or annexing Mp'E never moves Glo.
- The blade is crushed when Zol manifests and meets Eindil; the Zol spec's `zin_mistake.21` sets `zin_horos_sword_broken` (N1, O4); no other event breaks the blade.
- After the coronation nothing adds a new Glo effect.

### Afrit's artifacts (invariants)

Owned by the Afrit spec (`zin_afrit_artifacts`, `zin_afrit_lost_ring`, `_crown`, `_bracelet`, `_necklace`, the graces `zin_afrit_graces`). Rules:

- The count starts at 4, never rises, and falls only in the palace chain.
- `zin_afrit_die` is blocked while the count is above 0.
- Before `zin_afrit_revealed`, artifact names are visible only to the realm Afrit rules (`zin_afrit_rules_here`) and the Worshipdom; everyone else sees "Graces of the Deliverer".
- When Eindil takes the necklace (`zin_eindil_wears_necklace`), it carries **no modifier**. Its price is open in the vault; the flag waits for later content.

### Dragons

Dragons are a scarce world pool, not a country. They use the air layer (S6): warfare turns a grant into dragon flights, air wings of `zin_dragon_equipment` (`zin_war_grant_dragons`, argument `amount`; country variable `zin_dragon_flights`; country flag `zin_war_dragon_pact`). This spec decides who may receive them.

- **The pool.** `zin_dragons_free` (global, proposed start 6): grants Dragon Mountain can still give. It never refills during the Fourth Age.
- **The Keeper** is the realm that owns the Dragon Mountain state: the map gives it to the nearest elven realm (map accuracy K2). The Magical Forest's Warden of the Dragon Roosts ([02_characters.md](../02_lore/02_characters.md)) speaks for the elves' pact whoever owns the state.

| Way | Who | Conditions | Cost | Effect |
| --- | --- | --- | --- | --- |
| **The Dragon Pact** (decision `zin_world_dragon_pact`) | An elven realm of the Magical Lands | It is the Keeper, or has opinion ≥ 50 of the Keeper and `zin_elves_roost_bond` is 40 or more ("the dragons will not come for strangers"); the elves spec's `zin_elves_dragon_need` (at war with a dark power, or the eastern threat) or `zin_gathering_dark` ≥ 50; it has used the Pact fewer than 3 times (focus Pacts count); pool ≥ 1 | 150 political power; 100 for the Keeper when the bond is 70 or more or it has `zin_magical_forest_old_pact` | Pool −1; `zin_war_dragon_pact`; `zin_war_grant_dragons` amount 1; warfare's event `zin_war.2`. The bond's change is the elves spec's |
| **Eindil's dragon** | The Keeper, through the journey's event "A Dragon's Pact" (stage 8, [Eindil's journey](../04_mechanics/eindil_journey.md)) | As the journey says (historically the Magical Forest entrusts it) | none | When `zin_eindil_dragon_pact` is set: pool −1 (reserved). When `zin_eindil_returned` is set: `zin_war_grant_dragons` amount 1 to Eindil's host. A free ally; it does not break the Elven Refusal |
| **Bound by corruption** (decision `zin_world_corrupt_dragon`) | The realm Afrit rules (`zin_afrit_rules_here`) or the Worshipdom | `zin_afrit_revealed` (warfare: corruption comes after the reveal); `zin_footholds` ≥ 3 in the Keeper, or ≥ 2 while `zin_elves_roost_bond` is below 30 ("The Roosts Are Restless"); the Keeper does not have `zin_elves_roosts_guarded`; used fewer than 2 times; pool ≥ 1 | 100 political power; −1 foothold in the Keeper | Pool −1; `zin_war_grant_dragons` amount 1; `zin_world_add_gathering_dark` +1; report `zin_world.50` |

The roost bond `zin_elves_roost_bond` and its changes belong to the [elves spec](../04_mechanics/elves_wall_and_dragons.md); this spec only reads it. Elven Pacts taken by focus (*Wings Over the Woods*, *Dragons of the March*) call `zin_world_give_dragon` with `to = ROOT` through the elves spec's `zin_elves_focus_dragon_pact`, so the pool and the limit of three hold.

If a non-elven realm takes the Dragon Mountain state, the pool freezes (no Pact, no corruption) and that realm's divisions there take `damage_units = { state = <Dragon Mountain> str_damage = 0.05 ratio = yes army = yes limit = { NOT = { has_country_flag = zin_people_elves } } }` each month ("The Mountain Wakes", `zin_world.56`). Volgan has no dragon route in this spec (proposal; warfare question 3).

### The Great Wall: upkeep and breaches

The line and its forts are map and warfare work: level-5 forts on the Aenor side, the trigger `zin_is_site_great_wall`, and the state modifier `zin_war_great_wall`. This spec adds the Wall's life in play:

- **The Wall Watch** (decision `zin_world_wall_watch`; the owner of the most wall states): 25 political power; timed idea `zin_world_wall_repairs` for 180 days: `production_speed_bunker_factor = 0.50` (repairs; an instance of the documented `production_speed_<Building>_factor`); cooldown 365 days.
- **The Wall Unmanned** (`zin_world.59`, warning to the wall owner): fires when the owner is at war with a country that borders a wall state and has fewer divisions in wall states than half the number of wall states. Text only; it repeats at most every 90 days.
- **The Wall Is Breached** (`zin_world.60`): when an enemy of the wall owner controls two or more wall states. Effects: `zin_world_add_gathering_dark` +3; Aenor −5% stability for 180 days. Once per war.

### The Dead Lands: storms and heat

- **The storm belt.** The sea strategic regions that touch a Dead Lands coastal province form the storm belt. The builder computes the list from `map/strategicregions` at build time and compares it with the tracked snapshot `tools/content/data/storm_seas.json`, so a map change that moves the belt fails a test until the snapshot is reviewed. The map gives these regions permanent storm weather (map spec G7). Every 7 days the world tick runs, for each region in the list, `damage_units = { region = <id> navy = yes str_damage = 0.04 org_damage = 0.10 ratio = yes limit = { NOT = { capital_scope = { zin_is_region_dead_lands = yes } } NOT = { has_tech = zin_tech_storm_rigging } } }`, and a second pulse at half strength for fleets of countries with warfare's `zin_tech_storm_rigging`. Dead Lands realms know the waters and are spared. Volgan's Veil of Storms is a separate, hidden mechanic of the Volgan spec.
- **The coasts.** Every country whose capital is in the Dead Lands has **Storm-Girt Coasts** (`zin_world_storm_coasts`): `amphibious_invasion_defence = 0.50`.
- **The heat.** Dead Lands states carry the state modifier `zin_world_dead_lands_heat` (`enemy_attrition = 0.20`); the Nether and the Abyss carry 0.40. Dead Lands realms resist heat through their economic spirit (`heat_attrition_factor = -0.50`).

### The Fading (invariants for the Zol spec)

The Zol spec owns Zol's power, convergence, rising, manifestation (`zin_zol_manifest`, at most 63 days) and withdrawal. It already keeps these world rules, and future specs must too:

- Zol has no body and no portrait that represents Zol himself; his realm's leader is the emblem "The Will of Zol" (S4), which says nothing about who administers the Mistake (open).
- One manifestation at most before 4A 1800; it costs Zol power every week; it ends in withdrawal, never in Zol's death.
- No text says why Zol fades, what his servants give him, or what remains of him after the withdrawal.
- Zol's realm cannot be annexed or puppeted; a capitulation becomes a withdrawal (Zol spec).

### What stays hidden at start

- On 1 Thaw 4A 1748 no potent magic exists anywhere, no dragon is granted, the pool is full, no intervention flag is set and nothing names an artifact to anyone but Afrit's realm.
- Zol's nature is visible to Zol's player only; others learn of the deathless dead through warfare's `zin_war.4` after `zin_zol_rising`.
- Yeldenne's guardian is shown by the Yeldenne spec's own rules.

## Implementation

### What is in the game today (commit `ca01fa3`)

Nothing of this spec is in the game. `events/zin_world.txt` holds one hidden interim event (`zin_world.1`, vanilla removal stub); this spec's ids 30–69 and the tension spec's ids replace it in the same file.

### Builder module and data

A new content-builder module, `tools/content/modules/world_magic.mjs`, writes every file below. It runs after the warfare module (it names warfare's equipment and technologies) and shares `events/zin_world.txt` with the tension module (`world_tension.mjs`), which writes the namespace header; each module writes only its own id range.

| Path | Kind | Content |
| --- | --- | --- |
| `tools/content/data/world_magic.json` (new) | builder data | Dragon pool, decisions, spirits, Wall rules, heat strengths, AI weights |
| `tools/content/data/storm_seas.json` (new) | tracked snapshot | Storm-belt sea regions as computed from the map (test input) |
| `common/scripted_triggers/zin_world_magic.txt` | generated | `zin_has_potent_magic`, `zin_world_is_dragon_keeper` |
| `common/scripted_effects/zin_world_magic.txt` | generated | `zin_world_raise_varners_wards`, `zin_world_grant_new_gods_gift`, `zin_world_give_dragon` (arg `to`), `zin_world_storm_pulse`, `zin_world_mountain_pulse` |
| `common/ideas/zin_world_magic.txt` | generated | `zin_world_varners_wards`, `zin_world_varners_shelter`, `zin_world_new_gods_gift`, `zin_world_storm_coasts`, `zin_world_wall_repairs` |
| `common/dynamic_modifiers/zin_world_magic.txt` | generated | `zin_world_dead_lands_heat` and `zin_world_deep_heat` (Nether and Abyss) |
| `common/decisions/zin_world_magic.txt`, `common/decisions/categories/zin_world_magic.txt` | generated | The Dragon Pact, Bound by Corruption, The Wall Watch |
| `common/on_actions/zin_world_magic.txt` | generated | `on_startup`: Storm-Girt Coasts and the heat modifiers; the weekly pulses are called from the world tick ([05_world_tension_and_endings.md](05_world_tension_and_endings.md)) |
| `common/ai_strategy/zin_world_magic.txt` | generated | Storm-sea avoidance |
| `events/zin_world.txt` (ids 30–69) | generated | Below |
| `localisation/english/zin_world_magic_l_english.yml` | generated | Text |

### Names

| Name | Kind | Meaning |
| --- | --- | --- |
| `zin_has_potent_magic` | scripted trigger (country) | Potent magic as defined above |
| `zin_potent_magic` | country flag | Fallback marker set only by the listed scripts |
| `zin_dragons_free` | global variable, 0–6 | Grants Dragon Mountain can still give |
| `zin_world_dragon_pacts`, `zin_world_corrupted_dragons` | country variables | Times the realm used each way |
| `zin_varner_wards_raised` | global flag | Varner's wards have risen (once) |
| `zin_world_is_dragon_keeper` | scripted trigger | The country owns the Dragon Mountain state |

### Events (`zin_world`, 30–69)

| Id | Purpose |
| --- | --- |
| `zin_world.40` | Varner's wards hold (report to the host and its allies) |
| `zin_world.45` | The Gods' Gift (report to the host; text never names the gods individually) |
| `zin_world.50` | A dragon is bound (to elves and Afrit's realm; news after the reveal). Its immediate effect calls the elves spec's `zin_elves_on_dragon_corrupted` once for the bound dragon (the hook that spec asks for; the elves runner's count then sees it as done) |
| `zin_world.56` | The Mountain wakes |
| `zin_world.59` | The Wall unmanned |
| `zin_world.60` | The Wall is breached |
| `zin_world.65` | Storms in the south (first loss of a non-Dead Lands fleet; flavour) |

## AI

- **Dragon Pact:** elven AI takes it when at war with a dark power that holds one of its states, or when `zin_gathering_dark` ≥ 75. Under the historical rule the Magical Forest's one Pact of 4A 1755 is its tree's *Wings Over the Woods* when the eastern invasion strikes (elves spec); its AI does not also take the decision while that focus is available or within 365 days after it.
- **Bound by corruption:** Afrit's realm takes it once after the reveal and once after `zin_afrit_king_of_east`.
- **Wall Watch:** the wall owner takes it whenever at war with a country that borders a wall state.
- **Storms:** `common/ai_strategy/zin_world_magic.txt` gives every non-Dead Lands country `naval_avoid_region` for the storm seas.

## Acceptance

1. `zin_has_potent_magic` is false for every country on 1 Thaw 4A 1748, and only the listed sources ever make it true (builder check that no file outside the "Set by" column sets `zin_potent_magic`, plus a 12-year HISTORICAL observer run in the Linux run that logs the trigger for every country each month).
2. `zin_varner_wards_raised` and `zin_eindil_restored` are each set at most once; calling either effect twice by console in the Linux run changes nothing the second time.
3. `zin_dragons_free` never rises and never goes below 0; no dragon decision is available at 0; a second bearer never gets the Gods' Gift (scenario test with `zin_glo_state` set to 4).
4. A non-Dead Lands fleet parked 30 days in a storm sea loses strength; a Dead Lands fleet does not; a fleet with storm rigging loses half as much (Linux scenario run).
5. An enemy controlling two wall states fires `zin_world.60` once per war (scenario test).
6. `zin_eindil_wears_necklace` adds no modifier; no text before the coronation explains the necklace.
7. No artifact name is visible to a player outside Afrit's realm before `zin_afrit_revealed` (names spec check T2).
8. Every modifier named here exists in the 1.19.3 modifier documentation; every effect and trigger in the effect and trigger documentation (builder check).
9. The storm-belt list computed from the map equals `tools/content/data/storm_seas.json` (builder test).
10. `zin_has_potent_magic` is staged before any Zol file reads it; no file except Zol's `zin_mistake.22` sets `zin_potent_magic` (builder test).
11. With `zin_elves_roost_bond` at 35, a non-Keeper elven realm cannot take the Dragon Pact; at bond 25 and footholds 2 in the Keeper, Bound by Corruption is available after the reveal, and taking it fires `zin_world.50`, which runs `zin_elves_on_dragon_corrupted` exactly once (scenario test).

## Open questions

All proceed on the labelled proposal; the owner's answers go to [OPEN_QUESTIONS.md](../OPEN_QUESTIONS.md).

1. How many dragons does Dragon Mountain hold? **Proposal, in use:** 6 grants (world systems question 8). Who owns the mountain follows the map (nearest elven realm, K2).
2. Should any elven magic beyond Lorien's ride count as potent magic against Zol's dead? **Proposal, in use:** no.
3. May Volgan ever bind dragons? Dragons served him in the First Age. **Proposal, in use:** no (warfare question 3).
4. Should the Necklace of the Abyss do anything to Eindil's Aenor after the coronation? **Proposal, in use:** nothing (the vault leaves its price open).

Settled: the blade's breaking is `zin_horos_sword_broken` (N1); dragons use the air layer (S6).
