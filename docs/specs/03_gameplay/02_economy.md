# Economy

**Status:** Draft. **Priority:** 3. **Phase:** 3.

## Purpose

Replace the 1936 industrial economy with an Erdae economy that a player reads at a glance: iron, timber, horses, stone, gold, essence and grain; workshops, armouries and shipwrights; roads, harbours and forts. Give every region a recognisable economic identity, and give Aenor's Golden Court a treasury that its foolish king can waste. The engine's production, trade and supply systems stay; only their names, inputs, distribution and a few scripted layers change.

**This spec owns:** resource and building names, the resource columns of the region profiles, state category names, trade, economy and trade law names, the regional economic spirits, the great powers' starting industry targets, and the Golden Court's gold (`zin_aenor_gold`).

**Others own:** equipment costs and fuel use ([01_warfare.md](01_warfare.md)); state categories, manpower, infrastructure and the region profile file ([00_foundation/04_countries_and_states.md](../00_foundation/04_countries_and_states.md)); the strait dues ([Lerendor](../04_mechanics/lerendor_narrow_strait.md)); corruption, loyalty and the Lost Cause ([Aenor](../04_mechanics/aenor_court_and_succession.md)).

## Lore basis

**Established** (vault):

- The Fourth Age had more than a thousand years of genuine peace, prosperity, education, science, medicine and strong institutions (*Fourth Age Canon Register*).
- Cities grew around the Great Lake, ports expanded, and Aenor traded with the North Lands, West Lands, the islands, the Magical Lands and the eastern states (*The Fourth Age of Erdae*, prologue).
- The Golden King hoards treasure, sells offices, rewards flatterers and spends on his own grandeur. Strong institutions keep the kingdom running (*Golden King*).
- Afrit's Hidden Council uses religious institutions, relief networks, foreign envoys and commercial connections (*Afrit's Hidden Council*).
- The Dead Lands are hot and storm-girt; Zol's Mistake is a barren, sparsely peopled wasteland; dragons come from Dragon Mountain (*Volgan's Dead Lands*, *Zol's Mistake*, *Peoples of Erdae*).

**Proposed in the vault** (*Fourth Age Chronology*, *The Campaign of 4A 1748*): the Great Lake ports rebuilt 4A 40–120; the East Lands caravan roads that made Noris and Stabilo rich (4A 600–780); the Triton islanders' charts of the Pupor Ocean (4A 702); Gunwaith and Girdon courting Aenoran gold (4A 1702); the Golden Court as a palace district where offices are bought (4A 1733); the Houses of the First Light keeping grain stores; the East Lands as Erdae's richest and most divided region.

**Proposed in this spec:** every resource, building, law and state-category name; the regional identities; all numbers; the treasury and its decisions. None of these are lore.

## Design

### Resources

The engine has seven resources. ZIN keeps their keys (trade, AI and equipment code keep working) and renames them. The names follow the owner's examples (iron, timber, horses, stone, gold, magic essence) plus grain; they replace the provisional labels in the countries and states spec (Silver, Hides, Naval Stores). All names are proposed.

| Engine key | ZIN name | What it is | Warfare use today ([01_warfare.md](01_warfare.md)) | Use this spec asks warfare to add |
| --- | --- | --- | --- | --- |
| `steel` | **Iron** | Ore and bloomery iron | Arms, armour, hulls, engines | — |
| `aluminium` | **Timber** | Seasoned oak, pine and yew | none | Hulls (main input), siege engines, bows |
| `rubber` | **Horses** | Horses, camels and other mounts | none (mounts cost manpower and production only) | Mounted equipment and pack trains |
| `tungsten` | **Stone** | Quarried and dressed stone, shot | Engines | — |
| `chromium` | **Gold** | Gold and silver | Elven arms ("rare stuff") | Knightly plate and flagship fittings |
| `oil` | **Essence** | Raw magic from wellsprings, elder groves, ley-stones and the Dead Lands' vents | none | Wardsingers', hallowed and other magical equipment |
| `coal` | **Grain** | Grain, fish and fodder | never | Never: it becomes Provisions (below) |

Until warfare adopts the requested uses, Timber, Horses and Essence matter only through trade and their AI value; the acceptance test below tracks this.

Rules:

- Grain never appears in an equipment cost.
- Essence and Gold are scarce on purpose: each world total is about a third of Iron's.
- Zol's Mistake produces nothing (map spec G8). Zol's armies do not depend on resources ([Zol's Mistake](../04_mechanics/zols_mistake.md)).

**Fuel.** Warfare sets every equipment's fuel consumption to 0, so fuel has no use. Its bar is renamed **Stored Essence** (proposed) so no modern word shows. The synthetic refinery and the fuel silo are never unlocked.

**Energy becomes Provisions.** The engine's energy system turns `coal` into energy that factories consume (`ENERGY_RESOURCE = "coal"`, 9 energy per unit). In ZIN this is **Provisions** (proposed): the bread and fodder that keep workshops and their workers going. A realm short of Grain works slower, exactly as a realm short of energy does. `energy_infrastructure` becomes **Granaries** (fewer Provisions needed per workshop); `industrial_infrastructure` becomes **Mine and Quarry Roads** (more resources extracted).

### Buildings

Keys stay; names change through localisation. Names match the warfare spec where it already named a building. Buildings ZIN never uses are unlocked only by technologies the ZIN tree never contains.

| Engine key | ZIN name (proposed) | Notes |
| --- | --- | --- |
| `industrial_complex` | Guild Workshops | Civilian factory |
| `arms_factory` | Armouries | Military factory |
| `dockyard` | Shipwrights | Naval factory |
| `infrastructure` | Roads | |
| `rail_way` | High Roads | Warfare's name |
| `supply_node` | Depots | Warfare's name |
| `naval_base` | Harbours | |
| `naval_supply_hub` | Victualling Yards | |
| `naval_headquarters` | Admiralty | |
| `air_base` | Eyries | None at start; usable only under warfare's sky rule |
| `anti_air_building` | Scorpion Towers | Warfare keeps scorpions against fliers |
| `radar_station` | Beacon Towers | None at start |
| `bunker` | Stone Fort | Warfare's name; the Great Wall is a line of level-5 forts |
| `coastal_bunker` | Sea Fort | Warfare's name |
| `stronghold_network` | Fortress Network | |
| `energy_infrastructure` | Granaries | |
| `industrial_infrastructure` | Mine and Quarry Roads | |
| `synthetic_refinery`, `fuel_silo`, `rocket_site`, `mega_gun_emplacement`, all `nuclear_*`, `*_facility`, `dam*`, `canal_*`, vanilla `landmark_*` | not used | Never unlocked; no ZIN state starts with them |

Erdae landmarks (the Golden Court, the gate at Kingson) are a phase 7 option; they need generated art and 3D models.

### State category names

Keys and slots are the engine's; which state has which category is the countries and states spec's. Names (proposed):

| Key | Slots | ZIN name |
| --- | ---: | --- |
| `wasteland` | 0 | Wasteland |
| `enclave` | 0 | Holdfast |
| `tiny_island` | 0 | Skerry |
| `small_island` | 1 | Isle |
| `pastoral` | 1 | Steading |
| `rural` | 2 | Shire |
| `large_island` | 3 | Great Isle |
| `town` | 4 | Market Town |
| `large_town` | 5 | Walled Town |
| `city` | 6 | City |
| `large_city` | 8 | Great City |
| `metropolis` | 10 | Royal City |
| `megalopolis` | 12 | Crown City (Parim only) |

### Regional economic identity

These are the resource columns of `docs/design/region_profiles.json` (the file belongs to the countries and states spec; the builder reads this table into it). Weights are relative abundance from 0 to 3. Development is the share of building slots filled with workshops and armouries at the start.

| Region | Iron | Timber | Horses | Stone | Gold | Essence | Grain | Development | Identity |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| Middle Lands (with Aenor Isle) | 2 | 2 | 2 | 2 | 1 | 1 | 3 | 0.60 | The richest heartland: workshops, lake harbours, high roads |
| North Lands | 2 | 3 | 1 | 1 | 0 | 0 | 1 | 0.45 | Shipwrights and the strait |
| Cold Lands | 3 | 2 | 1 | 2 | 0 | 0 | 0 | 0.25 | Iron and furs; hard winters; the largest and least developed land |
| West Lands | 2 | 2 | 3 | 1 | 0 | 0 | 2 | 0.40 | Horses, freeholds and mercenary companies |
| Triton's Islands | 0 | 2 | 0 | 0 | 0 | 0 | 1 | 0.30 | Fishing, piracy and charts |
| Dark Lands | 2 | 1 | 1 | 2 | 0 | 1 | 1 | 0.30 | Forge-pits of the orc holds |
| Magical Lands | 0 | 3 | 1 | 1 | 0 | 3 | 2 | 0.35 | Elder groves and essence wellsprings |
| Zol's Mistake | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | Nothing grows |
| Dead Lands | 2 | 0 | 0 | 2 | 1 | 3 | 0 | 0.30 | Essence vents and war-forges |
| East Lands (with the South Lands desert) | 1 | 1 | 2 | 2 | 3 | 1 | 2 | 0.50 | Gold and caravans |
| Islands of the South | 0 | 1 | 0 | 0 | 0 | 0 | 2 | 0.25 | Poor and hospitable |
| Lands of the Sun | 1 | 1 | 1 | 1 | 2 | 1 | 3 | 0.40 | Sun-blessed fields of the Sunhot elves |

World totals the builder aims for: Iron 2,400; Grain 2,200; Timber 1,800; Horses 1,300; Stone 1,100; Essence 800; Gold 650. Each state's value is a seeded draw (seed = state id) within ±25% of its weighted share, so rebuilds are stable.

Special sites: Dragon Mountain +12 Essence; the Abyss 0; Parim +6 Gold (the Golden Court's coffers); desert states of Noris and the South Lands hold only Gold or Stone.

### Regional economic spirits

Every country gets its region's spirit at start (assigned by the builder from the roster region; Zol gets none). They are small and permanent.

On startup every country also gets the country flag `zin_region_<key>` for its roster region (keys: `middle_lands`, `north_lands`, `cold_lands`, `west_lands`, `tritons_islands`, `dark_lands`, `magical_lands`, `zols_mistake`, `dead_lands`, `east_lands`, `islands_of_the_south`, `lands_of_the_sun`; Aenor Isle uses `middle_lands`, the Ocean of Zol `zols_mistake`). The flag records where a realm belongs by origin and never changes with conquest; for where a state lies, scripts use the generated state triggers `zin_is_region_<key>`.

| Spirit | Region | Modifiers |
| --- | --- | --- |
| `zin_econ_middle_lands`: The Great Lake Markets | Middle Lands, Aenor Isle | `production_factory_max_efficiency_factor = 0.05`, `consumer_goods_factor = -0.02` |
| `zin_econ_north_lands`: Northern Shipwrights | North Lands | `industrial_capacity_dockyard = 0.10`, `production_speed_dockyard_factor = 0.10` |
| `zin_econ_cold_lands`: The Long Winters | Cold Lands | `winter_attrition_factor = -0.25`, `production_speed_buildings_factor = -0.10` |
| `zin_econ_west_lands`: Western Freeholds | West Lands | `trade_opinion_factor = 0.10`, `recruitable_population_factor = 0.05` |
| `zin_econ_tritons_islands`: Charts of the Pupor Ocean | Triton's Islands | `naval_detection = 0.10`, `convoy_escort_efficiency = 0.10` |
| `zin_econ_dark_lands`: Forge-Pits | Dark Lands | `production_speed_arms_factory_factor = 0.10`, `consumer_goods_factor = 0.02` |
| `zin_econ_magical_lands`: Elder Groves | Magical Lands | `research_speed_factor = 0.05`, `production_factory_efficiency_gain_factor = 0.05` |
| `zin_econ_dead_lands`: Furnace Lands | Dead Lands | `heat_attrition_factor = -0.50`, `production_speed_arms_factory_factor = 0.05` |
| `zin_econ_east_lands`: The Caravan Roads | East Lands | `trade_opinion_factor = 0.15`, `consumer_goods_factor = -0.02` |
| `zin_econ_islands_of_the_south`: Hospitable Isles | Islands of the South | `stability_factor = 0.05` |
| `zin_econ_lands_of_the_sun`: Sun-Blessed Fields | Lands of the Sun | `monthly_population = 0.10`, `stability_factor = 0.03` |

### Starting industry of the great powers

Design targets for the state pass. The countries and states spec requires Aenor first in factories. Other countries fill by development with a civilian-to-military ratio of 3:1 (1:1 in the Dark Lands and Dead Lands).

| Country | Workshops | Armouries | Shipwrights | Main resources | Note |
| --- | ---: | ---: | ---: | --- | --- |
| Aenor | 32 | 14 | 6 | Grain, Iron, Gold | Richest realm; the Golden King keeps a strong army |
| Lerendor | 10 | 6 | 6 | Timber, Iron | Fleet power of the strait |
| Coldor | 14 | 7 | 3 | Iron, Stone | |
| Noris | 16 | 8 | 2 | Gold, Horses | |
| Stabilo | 14 | 7 | 3 | Gold, Stone | |
| Goldoroth | 5 | 7 | 0 | Iron, Stone | |
| Dondor | 3 | 2 | 1 | Iron | One state |
| Volgan | 6 | 14 | 1 | Essence, Iron, Stone | Quietly armed; hidden by the Veil of Storms ([Volgan](../04_mechanics/volgan_southern_dominion.md)) |
| Mirolon | 5 | 5 | 1 | Iron, Grain | |
| Gunwaith | 7 | 4 | 2 | Horses, Timber | |
| Magical Forest | 9 | 4 | 0 | Essence, Timber | |
| Gala Elves | 2 | 1 | 1 | Essence, Grain | One state |
| Worshipdom | 3 | 0 | 0 | none | Its wealth is its footholds |
| Zol | 0 | 0 | 0 | none | Zol mechanic supplies its hosts |

### Trade

The engine's trade stays: realms trade workshops for resources, and trade opinion decides who sells.

- **Convoys** are renamed **Merchant Fleets**. The central sea is wide, so West–Middle Lands trade needs many of them.
- **Embargo** is renamed **Close the Roads**.
- **Concord preference.** Chartered dominions trade with Aenor first (their autonomy state, [03_diplomacy_and_factions.md](03_diplomacy_and_factions.md)).
- **The caravan roads.** Noris and Stabilo start with the start situation's "Caravan Rivalry" opinion and get the caravan events below.
- **The strait dues** are Lerendor's (toll levels and `zin_leren_strait_dues`). This spec adds nothing to them.
- **Aenoran gold in the West** (proposed). Aenor can subsidise West Lands courts from its treasury, buying opinion and weakening the West's wish to cross the sea.

### Economy and trade laws

The vanilla laws stay with their effects and requirements; they are renamed (proposed):

| Engine key | ZIN name |
| --- | --- |
| `undisturbed_isolation` | Hidden Valleys |
| `isolation` | Closed Gates |
| `civilian_economy` | Peacetime Levies |
| `low_economic_mobilisation` | Muster of Stores |
| `partial_economic_mobilisation` | Partial Muster |
| `war_economy` | War Muster |
| `tot_economic_mobilisation` | Total Muster |
| `free_trade` | Open Markets |
| `export_focus` | Export Charters |
| `limited_exports` | Tariff Walls |
| `closed_economy` | Closed Roads |

Vanilla laws unlock with war support, and war support follows engine world tension (`WAR_SUPPORT_TENSION_IMPACT`), which the Gathering Dark raises ([05_world_tension_and_endings.md](05_world_tension_and_endings.md)). Realms therefore stay on Peacetime Levies in the peace and mobilise as the dark gathers, without an override of the vanilla law file. Country-specific vanilla laws are never given to ZIN countries.

Start laws: `export_focus` for everyone, `closed_economy` for Zol, `isolation` for the Worshipdom.

### The Golden Court's gold

Aenor alone keeps a scripted treasury, `zin_aenor_gold` (0–2,000, proposed). It stands for the royal coffers the Golden King fills by selling offices and empties on his own grandeur. It is not a currency for other countries. The Aenor mechanic may spend it; every change goes through `zin_economy_add_gold`.

**Start:** 400.

**Monthly income** (first day of each month):

| Source | Amount |
| --- | --- |
| Crown revenue | +20 |
| Gold mines | +5 if Aenor extracts at least 5 Gold, +10 at 10, +20 at 20 (`has_resources_in_country`, `extracted = yes`) |
| Concord tribute | +1 per chartered dominion with `zin_concord_loyalty` ≥ 40 |
| Great Lake markets | +5 while Aenor has at least 30 Guild Workshops and is not at war with another major |
| Wall customs | +3 while the Wall Accord holds (`zin_wall_accord`) |

**Monthly spending:**

| Drain | Amount |
| --- | --- |
| Golden Court upkeep | −0.3 × `zin_court_corruption` (−18 at corruption 60); −0.15 × corruption after `zin_golden_king_dead` |
| Debts | If the treasury would fall below 0 it is set to 0 and Aenor gets **Crown Debts** (`zin_econ_crown_debts`) for 180 days: `stability_factor = -0.05`, `consumer_goods_factor = 0.03`, `political_power_gain = -0.1` |

**Decisions** (category `zin_aenor_treasury`, Aenor only, proposed):

| Decision | Cost | Effect | Cooldown |
| --- | --- | --- | --- |
| Buy a Dominion's Loyalty | 50 | `zin_aenor_add_concord_loyalty` +15 on the chosen dominion (targeted) | 90 days per target |
| Hire the Buldor Companies | 120 | Two mercenary regiments (warfare template) for 365 days; Buldor gets +50 political power and +20 opinion of Aenor | 365 days |
| Subsidise a Western Court | 80 | Target West Lands country: opinion `zin_opinion_aenoran_gold` +25 (decays 1 a month); its weight to join the Western Crossing −25% | 180 days per target |
| Fund the Frontier Companies | 60 | `zin_aenor_add_lost_cause` +5 | 60 days |
| Hold a Triumph | 100 | +5% stability for 180 days; `zin_aenor_add_court_corruption` +5; `zin_aenor_add_lost_cause` −2 | 120 days |
| Fill the Granaries | 40 | `zin_econ_full_granaries` for 365 days: `production_speed_buildings_factor = 0.05`, `stability_factor = 0.02` | 365 days |

### Economic events

Namespace `zin_economy`. All are flavour weight and never start a war or create a war goal.

| Event | Who | Trigger (outline) | Choice and effect |
| --- | --- | --- | --- |
| Caravan Quarrel | Noris or Stabilo | 2% each month | Pay (−25 political power) or press (−10 opinion both ways; with `zin_gathering_dark` ≥ 25 grants the caravan cause of the diplomacy spec) |
| Western Tariffs | a West Lands country with ≥ 3 states | 1% each month | Protest (−10 opinion of Aenor) or pay (−1 workshop to trade for 180 days) |
| A Lean Harvest | a country producing less than 5 Grain | 1% each month | Import (−25 political power) or tighten belts (−3% stability for 90 days) |
| Gold from the Mines | Aenor | 2% each month | +30 `zin_aenor_gold` |
| The King's New Hall | Aenor while the Golden King lives | 3% each month | The AI King always builds: −80 gold, `zin_aenor_add_court_corruption` +3, +2% stability for 90 days |

## Implementation

### Files

| Path | Content |
| --- | --- |
| `docs/design/region_profiles.json` | Resource weights, development and spirit key per region (columns owned here) |
| `docs/design/economy/great_powers.json` | Starting industry targets |
| `history/states/*.txt` | Resources and buildings from the profiles (state pass) |
| `history/countries/*.txt` | `add_ideas = zin_econ_<region>`; start trade laws |
| `common/on_actions/zin_economy.txt` (startup block) | `set_country_flag = zin_region_<key>` for every country, generated from the roster |
| `common/ideas/zin_economy.txt` | The eleven regional spirits, `zin_econ_full_granaries`, `zin_econ_crown_debts` |
| `common/scripted_effects/zin_economy.txt` | `zin_economy_add_gold`, `zin_economy_monthly_gold` |
| `common/scripted_triggers/zin_economy.txt` | `zin_economy_aenor_in_debt` |
| `common/decisions/categories/zin_economy.txt`, `common/decisions/zin_economy.txt` | Treasury category and decisions |
| `common/opinion_modifiers/zin_economy.txt` | `zin_opinion_aenoran_gold` |
| `common/on_actions/zin_economy.txt` | Monthly treasury hook (Aenor's `on_monthly`) |
| `events/zin_economy.txt` | Economic events |
| `localisation/replace/zin_economy_l_english.yml` | `PRODUCTION_MATERIALS_OIL` and its six siblings, `FUEL`, building keys (`industrial_complex` and the rest), state categories, law names |
| `localisation/english/zin_economy_l_english.yml` | Spirit, decision and event text |
| Resource and building icons | Image-generated per [08_art_and_assets](../08_art_and_assets/); provenance recorded |

### Names

| Name | Kind | Scope | Meaning |
| --- | --- | --- | --- |
| `zin_aenor_gold` | variable, 0–2,000 | Aenor | The Golden Court's treasury (new shared name) |
| `zin_region_<key>` | country flag | every country | Roster region, set on startup (new shared name; read by the West and other specs) |
| `zin_economy_add_gold` | scripted effect | Aenor | Adds the `value` argument (negative to spend), clamps 0–2,000, applies Crown Debts on underflow |
| `zin_economy_monthly_gold` | scripted effect | Aenor | The income and spending tables |
| `zin_economy_aenor_in_debt` | scripted trigger | Aenor | Crown Debts active |

Treasury decisions check `check_variable = { zin_aenor_gold > <cost − 1> }` in `available` and show the cost through scripted localisation. Effects read from the Aenor mechanic: `zin_aenor_add_concord_loyalty`, `zin_aenor_add_lost_cause`, `zin_aenor_add_court_corruption`.

### Defines (economy block of `common/defines/zin_defines.lua`)

| Define | Value | Why |
| --- | --- | --- |
| `NDefines.NGame.ENERGY_RESOURCE` | `"coal"` (unchanged) | Grain stays the energy resource |
| `NDefines.NProduction.RESOURCE_TO_ENERGY_COEFFICIENT` | 9.0 (unchanged) | Provisions per Grain |
| `NDefines.NProduction.BASE_COUNTRY_ENERGY_PRODUCTION` | 12.0 (vanilla 10.0) | Small realms keep a few workshops fed without Grain |

## AI

- Building AI is the engine's. `common/ai_strategy/zin_economy.txt` raises `build_building` priority for `energy_infrastructure` when `energy_ratio < 0.8`.
- Aenor while the Golden King lives: weights favour Hold a Triumph and The King's New Hall (he wastes gold), then Buy a Dominion's Loyalty when any loyalty is below 30. Fund the Frontier Companies only when `zin_gathering_dark` ≥ 40.
- Aenor under Aurevan: Buy a Dominion's Loyalty and Subsidise a Western Court; never Hold a Triumph.
- Aenor under any other ruler: Fund the Frontier Companies first when `zin_gathering_dark` ≥ 50, then the Buldor Companies when at war with a major.
- Caravan Quarrel: the AI presses only when the rival has fewer factories.

## Acceptance

1. No player-visible text says Oil, Steel, Aluminium, Rubber, Tungsten, Chromium, Coal, Fuel, Civilian Factory, Military Factory or Synthetic Refinery (localisation scan of the staged tree).
2. No state starts with a rocket site, nuclear building, dam, canal, vanilla landmark, facility, refinery, fuel silo or air base; no ZIN technology unlocks the unused buildings.
3. World resource totals are within ±10% of the targets; Zol's Mistake has none (generator test).
4. Every country except Zol has exactly one `zin_econ_<region>` spirit, and every country exactly one `zin_region_<key>` flag, after startup (Linux run, five samples by console).
5. Aenor starts with `zin_aenor_gold` = 400; after 12 months of AI play with the Golden King alive the treasury is below 400 and has never been stuck at 0 for more than 6 months.
6. Every modifier named here exists in the modifier documentation; the script validator passes `common/ideas/zin_economy.txt`.
7. In 60 days of the Linux run no economic event declares war or creates a war goal.
8. A warfare-integration check lists every equipment's resource keys; it reports (does not fail) while Timber, Horses or Essence have no consumer.

## Open questions

1. Are the seven resource names right (Iron, Timber, Horses, Stone, Gold, Essence, Grain)? Gold replaces the foundation draft's "Silver".
2. Should Timber, Horses and Essence feed equipment as requested here? Warfare currently uses none of them.
3. Should the Golden Court's gold show in the top bar for an Aenor player, or only in Aenor's panel?
4. Should the East Lands' wealth become canon, or stay a campaign proposal?
5. Where are the dwarves' homelands? A dwarven region would change the Iron and Stone map.
