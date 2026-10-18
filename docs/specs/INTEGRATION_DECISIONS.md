# Integration decisions

**Status:** Ready. Decided 18 October 2026 while integrating the first full spec package.

The specs were written in parallel, so some of them use different names or values for the same thing. These decisions settle every such conflict that is a design choice rather than lore. Where a spec disagrees with this file, this file wins until the spec is corrected. Lore questions stay with the owner: see [OPEN_QUESTIONS.md](OPEN_QUESTIONS.md).

## The secret and the peaceful start

| # | Decision | Affects |
| --- | --- | --- |
| D1 | The Worshipdom starts as **Light, Sanctuary** with the party "The Faithful of the Deliverer". Its ruler is shown as **Aurevan the Deliverer**, and its description never names Afrit or the Hidden Council. It turns Shadow only when `zin_afrit_revealed` is set. | foundation, Afrit, Worshipdom tree |
| D2 | **The current mod breaks the secret today:** the Worshipdom's ruler is named Afrit and its description names the Hidden Council. Fixing this is a phase 1 defect ([01_map/03_known_issues.md](01_map/03_known_issues.md)). | politics step, content builder |
| D3 | The world learns the name Afrit at his **flight east** (historical 4A 1756), or earlier only when a player exposes the plot. Eindil's warnings before that say "the king in Parim is not what the temples say", never the name. | world systems, events, Eindil |
| D4 | Before Lorien names him, players read only "the Man from the Ice". | lore digest, Eindil, events |
| D5 | Aenor starts with 0% Shadow popularity. | foundation |
| D6 | Dominion and Shadow get `generate_wargoal_tension = 0.25` so that the no-great-war start does not rest on AI behaviour alone. | foundation, world systems |
| D7 | The two-face focus names (public, then true after the reveal) are adopted for every text other players can see. | Worshipdom tree, compiler |
| D8 | *Pacify the Bloody Forest* stays as a player-only choice: AI weight 0 before the Golden King's death. | Aenor tree |

## Names

| # | Use | Retire | Affects |
| --- | --- | --- | --- |
| N1 | `zin_horos_sword_broken` | `zin_blue_sword_broken` | Eindil, Zol, events |
| N2 | `zin_black_compact` (Volgan–Zol truce) | `zin_zol_volgan_accord` | Volgan, Zol, events |
| N3 | `zin_eindil_cast_down` | `zin_afrit_cast_down_eindil` | Eindil, Afrit |
| N4 | `zin_rule_golden_king_death` | `zin_rule_golden_king` | foundation, Aenor |
| N5 | `zin_opinion_caravan_rivalry` (−25) | `zin_opinion_caravan_rivals` | economy, start situation |
| N6 | `zin_opinion_old_estrangement` | `zin_opinion_edrans_folly` | peoples, start situation |
| N7 | Lorien: `zin_trait_memory_of_dardan`; other ancient rulers: `zin_trait_ancient_king` | — | characters, ideologies |
| N8 | Report of the stranger leaving Gala: `zin_afrit.31`, with the union of both specs' options | `zin_glo.10` | Afrit, Eindil |
| N9 | Ambush odds: the journey spec's base 5, plus 1 for each of the Afrit spec's terms | — | Eindil, Afrit |
| N10 | The Council's seat of worship is one person, **Ilvane, High Confessor** (proposed); "Hierarch Aubren" is retired | `zin_hierarch` | Afrit, characters |
| N11 | Names declared by more than one spec in [04_mechanics/00_contract_additions.md](04_mechanics/00_contract_additions.md) mean the same thing in each; the owning spec named there defines them. | — | all |

## Values

| # | Decision |
| --- | --- |
| V1 | When a start value differs between the start-situation spec and the mechanic that owns it, **the owning mechanic's value wins**, because its thresholds are tuned to it: Zol's power 35, Volgan's strength 45, Aenor's corruption 70. The Gathering Dark starts at 10. |
| V2 | Resources are Iron, Timber, Horses, Stone, Gold, Essence and Grain (economy spec). Warfare uses Timber for hulls, Horses for mounted equipment and Essence for magical equipment. |
| V3 | The sandbox runs to 4A 1800. |
| V4 | Owner floor dates in the historical path read `zin_story_pace`. |

## Systems

| # | Decision |
| --- | --- |
| S1 | **King of the East:** Afrit's realm is the Worshipdom under the cosmetic name "the Dominion of the East"; eastern courts that kneel become its subjects with the `zin_autonomy_eastern_client` autonomy state (diplomacy spec), not faction members. Which courts kneel stays decided in each game by footholds, crises and choices. |
| S2 | **The Host of Eindil:** on the historical path Eindil leads Selen's armies (Alleria's realm) as its general and ruler-in-waiting; a dynamic country is used only if Selen no longer exists. |
| S3 | **The Lost Cause** is an institution inside Aenor's mechanic at the start, not a game faction; it can become one in the succession. |
| S4 | **Zol** is led by an emblem, "The Will of Zol", which says nothing about who administers the Mistake. His armies have numbered hosts, not named commanders. |
| S5 | **Andos Enda** is not in the Leren Compact at the start (the Elven Refusal); Lerendor can court it. |
| S6 | **Dragons** use the air layer. |
| S7 | **Interface:** the meters sit in a new Erdae bar under the flag. Only Aenor sees the Golden Court's gold. |
| S8 | **Validation:** 60 days in the Linux run for phases 1 and 2; one full year at the end of every later phase. |
| S9 | **Compiler extensions** requested by the specs are accepted: any condition in `allow_branch`; `ROOT`, `FROM` and `OVERLORD` as targets of `for_country`, `event_for` and `invite`; timed country flags; full mechanic idea ids in spirit effects; an event id base so a tree and its mechanic can share a namespace. |
| S10 | **The content builder moves into the ZIN repository** (`tools/content/`), so the public mod can be rebuilt from itself. Done in phase 1. |
| S11 | Game text writes **Šodolôro** (the game font cannot draw ō); documents keep the vault's Šodolôrō. |
