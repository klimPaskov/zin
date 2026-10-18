# Shared contract

**Status:** Ready. **Priority:** 3. **Phase:** 3.

## Purpose

ZIN's systems talk to each other through a fixed set of global flags, variables, characters, scripted triggers and scripted effects. This file is the single list. A spec that needs a new shared name adds it here; a spec never invents a second name for something listed here.

## Story state (global flags)

Set once, never cleared. "Historical" is the year on the established path (proposed dates).

| Flag | Meaning | Set by | Historical |
| --- | --- | --- | --- |
| `zin_eindil_awake` | Eindil has woken in the Cold Lands | Eindil's journey | 4A 1749 |
| `zin_eindil_war_king` | Eindil served as a western war-king | Eindil's journey | 4A 1750 |
| `zin_golden_king_dead` | The Golden King has died | Aenor succession | 4A 1750 |
| `zin_aurevan_crowned` | The Deliverer took Aenor's crown under his public name | Afrit | 4A 1750 |
| `zin_eindil_named` | Lorien has named Eindil son of Ein | Eindil's journey | 4A 1752 |
| `zin_horos_dead` | Horos has died | Yeldenne and Glo | 4A 1753 |
| `zin_glo_with_eindil` | Eindil carries Glo | Yeldenne and Glo | 4A 1753 |
| `zin_afrit_revealed` | The name Afrit and his true nature are known in Aenor | Afrit | 4A 1754 to 1756 |
| `zin_war_of_last_crowns` | The War of the Last Crowns has begun | world systems | 4A 1755 |
| `zin_western_crossing` | The West has crossed the central sea | Western Crossing | 4A 1755 |
| `zin_leren_withdrawal` | Lerendor has left the Treaty of the Narrow Strait | Lerendor | 4A 1755 |
| `zin_volgan_marches` | Volgan has marched north | Volgan | 4A 1755 |
| `zin_zol_rising` | Zol's dead have risen beyond the Mistake | Zol's Mistake | 4A 1755 |
| `zin_afrit_king_of_east` | Afrit is proclaimed King of the East | Afrit, eastern kings | 4A 1756 |
| `zin_eindil_returned` | Eindil has returned with Varner, Golbran and a dragon | Eindil's journey | 4A 1757 |
| `zin_varner_dead` | Varner has died | Eindil's journey | 4A 1757 |
| `zin_volgan_body_destroyed` | Volgan's manifested body is destroyed | Volgan | 4A 1757 |
| `zin_zol_manifested` | Zol has manifested bodily | Zol's Mistake | 4A 1757 |
| `zin_zol_withdrawn` | Zol has withdrawn | Zol's Mistake | 4A 1757 |
| `zin_lorien_dead` | Lorien has died | elves | 4A 1757 |
| `zin_afrit_dead` | Afrit is dead | Afrit | 4A 1759 |
| `zin_golbran_dead` | Golbran has died | Eindil's journey | 4A 1759 |
| `zin_eindil_crowned` | Eindil is crowned King of Aenor | Aenor succession | 4A 1760 |
| `zin_ending_lost_cause`, `zin_ending_children_of_volgan`, `zin_ending_ashen_throne` | One of the three endings has been reached | world systems | 4A 1760 (Lost Cause) |

## Shared variables

| Variable | Scope | Range | Meaning | Owner |
| --- | --- | --- | --- | --- |
| `zin_gathering_dark` | global | 0–100 | How near Erdae is to catastrophe; replaces world tension as the story meter | world systems |
| `zin_council_influence` | Aenor | 0–100 | How much of Aenor's government the Hidden Council controls | Aenor |
| `zin_court_corruption` | Aenor | 0–100 | Rot of the Golden Court | Aenor |
| `zin_concord_loyalty` | each Concord dominion | 0–100 | Loyalty to the crown | Aenor |
| `zin_footholds` | every country | 0–5 | Depth of the Deliverer's network inside that country | Afrit |
| `zin_afrit_artifacts` | global | 0–4 | Artifacts Afrit holds: the Necklace and three lesser ones | Afrit |
| `zin_eindil_stage` | global | 0–12 | Step of Eindil's journey | Eindil's journey |
| `zin_dominion_strength` | Volgan | 0–100 | Readiness of the Southern Dominion's hosts | Volgan |
| `zin_mistake_power` | Zol | 0–100 | Zol's slowly growing hold on Erdae under the Fading | Zol's Mistake |
| `zin_strait_standing` | Lerendor | -100–100 | Lerendor's standing under the Treaty of the Narrow Strait | Lerendor |

## Characters

| Id | Who | Status | Starts as |
| --- | --- | --- | --- |
| `<Aenor tag>_zin_ruler` | The Golden King | established | Aenor's ruler |
| `zin_aurevan` | The Deliverer: Aurevan in public, Afrit in private | public name proposed | Hidden; Worshipdom leader shown as the Deliverer |
| `zin_merovan` | Chancellor Merovan | proposed | Aenor's advisor (head of government) |
| `zin_eindil` | Eindil | established | Not present until `zin_eindil_awake` |
| `zin_alleria` | Alleria of Selen | established | Selen ranger general |
| `zin_lorien` | King Lorien | established | Gala Elves' ruler |
| `zin_horos` | Horos | established | Yeldenne's ruler |
| `zin_volgan` | Volgan | established | Volgan's ruler |
| `zin_varner` | Varner | established | Magical Lands; appears with Eindil |
| `zin_golbran` | Golbran | established | appears with Varner |
| `zin_sevrin` | The immortal thief | proposed name | hidden |

Zol has no character portrait or body at the start: he cannot manifest (established).

## Naming of shared scripts

- Scripted triggers: `zin_<system>_<question>`, for example `zin_aenor_council_dominant`, `zin_is_site_parim`.
- Scripted effects: `zin_<system>_<verb>`, for example `zin_aenor_add_council_influence`, `zin_world_add_gathering_dark`.
- Game rules: `zin_rule_<name>`, for example `zin_rule_historical_path`.
- Events: one namespace per system, for example `zin_aenor`, `zin_afrit`, `zin_eindil`, `zin_world`.

## The secret

Until `zin_afrit_revealed`, no text a player can read may name Afrit or call the Deliverer a demon, except text shown only to Afrit's own country. The compiler checks this.
