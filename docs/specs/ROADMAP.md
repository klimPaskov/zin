# ZIN roadmap

Phases run in order. A phase is done when its acceptance criteria pass; later phases may start early only on parts that don't depend on unfinished work. Each phase names the specs it implements.

## Where ZIN stands (18 October 2026)

| Area | State |
| --- | --- |
| Map | 5120 × 2560 Erdae with the widened central sea, 7,108 provinces, 1,332 states, 275 strategic regions. Great Wall border, Aenor Isle in the Middle Lands, Zol owning the whole black north. Several lore seats and sites are missing (see [01_map/01_map_accuracy.md](01_map/01_map_accuracy.md)). |
| Countries | 305 countries with image-generated flags, rulers, peoples, ideologies and stances from `docs/design/countries.csv`; the Middle Kingdom Concord and six other factions. |
| Politics | Light, Dominion, Shadow and Wild replace the vanilla ideologies, with Erdae stances. |
| Peoples | Ten peoples as national spirits and country flags. |
| Interface | A Realm panel with generated frames and buttons. |
| Calendar | **Not done.** The bookmark still starts in 1936. |
| Warfare, technology, economy | **Vanilla.** |
| Mechanics, focus trees, events | **None yet.** |
| 3D units | Five approved pilot references; Meshy is blocked by a HOI4 Mod Setup launcher bug (fix in progress). |
| Known defect | Starting a campaign as Aenor crashes the game (see [01_map/03_known_issues.md](01_map/03_known_issues.md)). |

## Phase 1: map accuracy and stability

Specs: [01_map](01_map/).

- Fix the Aenor start crash.
- Fix the data defects in [01_map/03_known_issues.md](01_map/03_known_issues.md), first the leak of Afrit's secret.
- Move the content builder into this repository (`tools/content/`), so the public mod rebuilds from itself.
- Bring the map in line with the lore: seats, key sites, region and state names, the Great Wall, Dragon Mountain, the Abyss and the Nether, Dardan.
- Every lore site that a mechanic or event needs exists as a named state or victory point.

**Done when:** every row of the map accuracy table is "matches" or "accepted difference"; a campaign starts as Aenor, Volgan, Zol, Lerendor and the Magical Forest in the Linux run; no new errors from ZIN files.

## Phase 2: base lore in the game

Specs: [02_lore](02_lore/), [00_foundation/01_start_and_calendar.md](00_foundation/01_start_and_calendar.md).

- The start date 1 Thaw 4A 1748, the Erdae calendar and month names.
- The starting characters of the great powers: rulers, councillors, generals and the hidden figures who appear later.
- Country, state and character names checked against the vault.

**Done when:** the game opens on 1 Thaw 4A 1748, every great power has its lore ruler and court, and nothing at the start reveals Afrit, shows Eindil or starts a great war.

## Phase 3: base gameplay and mechanics

Specs: [00_foundation](00_foundation/), [03_gameplay](03_gameplay/), [04_mechanics](04_mechanics/).

- Foundation: defines, game rules, peoples, ideologies and politics finished.
- Warfare: fantasy units, equipment, technologies and doctrines replace the modern ones; navies of galleys and warships; beasts and dragons.
- Economy and diplomacy re-themed for Erdae.
- World systems: the Gathering Dark (world tension), Glo, artifacts, Zol's deathless dead, dragons, the Great Wall.
- Great-power mechanics: Aenor's Golden Court and succession, Afrit's Hidden Council and footholds, Eindil's journey, Volgan's Southern Dominion, Zol's Mistake, Lerendor's Treaty of the Narrow Strait, the Western Crossing, the eastern kings, the elves.

**Done when:** each great power plays differently, the AI uses each mechanic, and the historical path can run from 4A 1748 to 4A 1760 without a player.

## Phase 4: focus trees for the main countries

Specs: [05_focus_trees](05_focus_trees/).

- The focus compiler and its validation.
- Major trees, each with branches for every route its mechanic offers: Aenor, Lerendor, Volgan, Zol, the Worshipdom, the Magical Forest, the Gala elves, Coldor, Noris, Stabilo, Gunwaith, Goldoroth, Mirolon.

**Done when:** each major tree passes the compiler's checks and the HOI4 Agent Tools focus inspector, renders cleanly, and its historical route is taken by the AI in a test run.

## Phase 5: events and endings

Specs: [06_events](06_events/), [03_gameplay/05_world_tension_and_endings.md](03_gameplay/05_world_tension_and_endings.md).

- The Golden King's death, Eindil's journey, the War of the Last Crowns, the three endings and the proposed alternative outcomes.

**Done when:** every ending is reachable in test runs and the historical path reaches Eindil's coronation.

## Phase 6: every other country

Specs: [05_focus_trees/01_tiers_and_coverage.md](05_focus_trees/01_tiers_and_coverage.md).

- Regional trees for tier B countries, shared regional trees with people and alignment branches for tier C. No country falls back to a vanilla tree.

**Done when:** all 305 countries have an Erdae focus tree.

## Phase 7: interface, art and polish

Specs: [07_interface](07_interface/), [08_art_and_assets](08_art_and_assets/).

- Themed top bar and mechanic panels, loading screens, focus and event art, 3D units for every people.

## Phase 8: depth and history

More events, characters and regional history everywhere, following the lore vault as the owner extends it.
