# ZIN specifications

This folder is the build plan for ZIN. Each specification says what a part of the mod must do, how it fits the lore, how it is implemented and how it is accepted. Implementation sessions work from these files in roadmap order and update a spec's status when they change what it describes.

Start with [ROADMAP.md](ROADMAP.md) for the order of work and [CONVENTIONS.md](CONVENTIONS.md) for rules that apply everywhere. [INTEGRATION_DECISIONS.md](INTEGRATION_DECISIONS.md) settles conflicts between specs, and [OPEN_QUESTIONS.md](OPEN_QUESTIONS.md) gathers the questions for the owner, with the short list that blocks early phases at the top.

## What the package holds (18 October 2026; review to Ready under way 19 October)

- About 85 specs across ten folders, 3.5 MB.
- **Focus trees:** 13 major trees and Yeldenne's tree fully enumerated (1,467 focuses), 11 shared regional trees (659 focuses), and regional trees for all 71 tier B countries as key-focus outlines.
- **Mechanics** for every great power and region, the Gathering Dark and the three endings, and the historical path from 4A 1748 to 4A 1760 as timed checkpoints.
- **Event chains** for the Golden King, Eindil's journey, the War of the Last Crowns, the endings and peaceful-start flavour.
- **Shared names:** [04_mechanics/00_shared_contract.md](04_mechanics/00_shared_contract.md) plus 642 additions registered in [04_mechanics/00_contract_additions.md](04_mechanics/00_contract_additions.md).

## Priority

The owner set the order on 18 October 2026: what matters most comes first.

1. **Map accuracy.** The map must match the lore: regions, seats, key sites, the Great Wall, the wide central sea, Zol's Mistake.
2. **Base lore.** The start situation, chronology and characters that every system depends on.
3. **Base gameplay and mechanics.** Calendar, ideologies, peoples, warfare, economy, diplomacy and the world systems; the great powers' own mechanics.
4. **Focus trees for the main countries.** Deep trees for the great powers, built on the mechanics above.
5. **Everything else.** Events, regional trees for every other country, interface, art, more history. The specs define these now so later work stays consistent.

## The starting situation

The campaign starts on **1 Thaw, 4A 1748** (owner-fixed situation, proposed date). The Golden King reigns. Eindil has not appeared. Afrit is unrevealed: the world knows only the Deliverer it worships. Erdae seems at peace, and nobody who matters is at war. The dangers are hidden or dismissed. Every system must respect this: nothing at game start may reveal Afrit, show Eindil or begin a great war.

## Folders

| Folder | Covers | Priority |
| --- | --- | --- |
| [00_foundation](00_foundation/) | Start date and calendar, ideologies and politics, peoples, countries and states, defines and game rules | 3 |
| [01_map](01_map/) | Map accuracy against the lore, key sites, known map issues | 1 |
| [02_lore](02_lore/) | Implementation-facing lore: the start situation, characters, names; the lore vault stays canon | 2 |
| [03_gameplay](03_gameplay/) | Warfare, economy, diplomacy, magic and world systems, world tension and endings, the historical path and AI | 3 |
| [04_mechanics](04_mechanics/) | The great powers' own mechanics: Aenor, Afrit, Eindil, Volgan, Zol, Lerendor, the West, the East, the elves, Yeldenne | 3 |
| [05_focus_trees](05_focus_trees/) | Focus tree data format and compiler, coverage of all 305 countries, one spec per main country | 4 |
| [06_events](06_events/) | Event chains: the Golden King's death, Eindil's journey, the War of the Last Crowns, endings, flavour | 5 |
| [07_interface](07_interface/) | Top bar, mechanic panels, themed frames | 5 |
| [08_art_and_assets](08_art_and_assets/) | Image generation, icons and pictures, 3D units, asset inventories | 5 |
| [09_validation](09_validation/) | Offline checks, the Linux acceptance run, per-stage acceptance | all |

## Status of a spec

Each spec starts with a status line:

- **Draft:** written, not reviewed against the lore or the code.
- **Ready:** reviewed against the six criteria in [CONVENTIONS.md](CONVENTIONS.md) ("Status"); implementation can start.
- **In progress:** implementation has started; the spec lists what is done.
- **Done:** implemented and accepted; the spec now documents the system.
- **Superseded:** replaced by another spec, which it names.

## Lore authority

The owner's lore vault (`docs/lore/vault/`, staged from the owner's own vault) is canon. Its Canon Policy separates **established** facts from **proposed** ones. Specs may propose names, dates and mechanics, and must label them. A spec never turns a proposal into established lore. When a spec and the vault disagree, the vault wins and the spec is corrected.
