# Ideologies and politics

**Status:** Ready. Reviewed 19 October 2026 against CONVENTIONS "Status"; integrated 19 October 2026. **Priority:** 3. **Phase:** 3.

## Purpose

Define how Erdae is governed in play: the four ideologies, their stances, the parties every country shows, elections, rulers and advisors, how popularity moves, and how the story changes governments. Every other system reads politics through the names in this file and in the [shared contract](../04_mechanics/00_shared_contract.md).

## Lore basis

**Established (vault):**

- Aenor is ruled by the Golden King, an exceptionally bad monarch who sells offices. He is effectively a puppet of the Hidden Council of the Deliverer, who is secretly Afrit. Ordinary people revere the Deliverer as a New God and do not know the name Afrit (*Fourth Age Canon Register*, *Golden King*).
- The Golden King founded the Lost Cause, a league against the powers of the dark that is partly royal vanity (*The Lost Cause*).
- After his murder four camps contend: the Golden Court, the Free Dominions, Afrit's supporters and Eindil's popular host. The victor is a possible ending, not history (*Kingdoms Factions and Conflicts*).
- Volgan is the principal dark lord; his Southern Dominion includes Demon, Dolon and Nezer. Zol has no body and no named administrator (*Great Powers and Relations*, *Zol*).
- The Magical Forest elves are "friendly, democratic and very old" (working table). The elves were never conquered.
- Not every orc, troll or demon serves Volgan. Dark Lands peoples have their own rulers.
- The three endings: the Lost Cause, Children of Volgan, the Ashen Throne.

**Owner-fixed start (18 October 2026):** the Golden King reigns, Eindil has not appeared, Afrit is unrevealed, Erdae seems at peace.

**Decided (INTEGRATION_DECISIONS):** D1 (the Worshipdom starts Light, Sanctuary, party "The Faithful of the Deliverer", ruler shown as Aurevan the Deliverer), D5 (Aenor 0% Shadow), D6 (Dominion and Shadow `generate_wargoal_tension = 0.25`), S4 (Zol's emblem leader "The Will of Zol"), N7 (trait ids), S11 (game text writes Šodolôro), N14 (the Deliverer's Faithful are Light, `zin_light_sanctuary`, until `zin_afrit_revealed` and Shadow after; the crowned Aenor of the Faithful is never `zin_dom_divine` before the reveal).

**Proposed (this spec):** the four ideologies as a game structure, their stances, party names, stance spirits, advisor traits, drift rules, election rules, the Light colour, and every number. The stance `zin_dom_divine` (Divine Crown) proposed in the first draft is withdrawn: under N14 no realm ever uses it. The public name Aurevan and the name Merovan are proposed in the vault and stay proposed here.

## Design

### 1. The four ideologies

The engine keys stay so the AI and defines keep working. They are renamed and re-themed (see [CONVENTIONS](../CONVENTIONS.md)).

| Key | Name | Means in Erdae | Countries at start (in game, 19 October 2026) | Map colour |
| --- | --- | --- | ---: | --- |
| `democratic` | Light | Rule by consent, kinship or guardianship: councils, elder houses, wardens, sanctuaries | 83 (with the Worshipdom) | today (214, 196, 120); target (196, 214, 236) pale sky, *proposed*, so it no longer looks like Dominion |
| `fascism` | Dominion | Rule by right of crown, court, captain or conquest | 10 | (178, 132, 46) bronze |
| `communism` | Shadow | Rule by the open dark powers: dread lords, the grave, demon courts, devouring hosts; after the reveal, Afrit's cult | 5 | (92, 40, 96) |
| `neutrality` | Wild | Unaligned folk: clan moots, freeholds, tribes, secluded peoples | 207 | (112, 128, 104) |

Ideologies are forms of rule, not moral labels, with one exception: Shadow is the side of the dark powers and nothing else. "Dominion" names both this ideology and Volgan's Southern Dominion; both stay (proposal of [OPEN_QUESTIONS](../OPEN_QUESTIONS.md), foundation 3).

**Engine rules.** Current values are in `tools/content/modules/ideologies.mjs` (`RULES`). Keep them, and add D6.

| Ideology | Key rules | War tension | Faction tension | Ideology modifiers | AI flag |
| --- | --- | ---: | ---: | --- | --- |
| Light | cannot puppet; cannot declare war on Light; can force government; justifies war only on threatening countries; can guarantee other ideologies; hosts exiles | 0.25 | 0.1 | `generate_wargoal_tension 1`, `join_faction_tension 0.6`, `guarantee_tension 0.25` | `ai_democratic` |
| Dominion | can puppet; can force government; collaboration governments | 0.75 | 0.6 | `justify_war_goal_when_in_major_war_time -0.5`, **`generate_wargoal_tension 0.25` (D6, new)** | `ai_fascist` |
| Shadow | can puppet; can declare war on Shadow; collaboration governments | 1.0 | 1.0 | `justify_war_goal_when_in_major_war_time -0.8`, **`generate_wargoal_tension 0.25` (D6, new)** | `ai_communist` |
| Wild | can puppet; no volunteers | 0.25 | 0.1 | `generate_wargoal_tension 0.5`, `join_faction_tension 0.4`, `guarantee_tension 0.4`, `drift_defence_factor -0.3` | `ai_neutral` |

`generate_wargoal_tension` is the world-tension limit for justifying a war goal ("Generate war goal tension limit" in the engine's text). Engine tension is 0 at the start ([05_defines_and_rules.md](05_defines_and_rules.md)), so with D6 no realm can justify a war goal until tension reaches 25%.

**Text changes** (in `ideologies.mjs`): the Shadow description `communism_desc` reads "Dominion of Shadow" today, which collides with the Dominion ideology and Volgan's Southern Dominion. It becomes "Rule of the Shadow" (*proposed*).

### 2. The secret and Shadow

Shadow at the start means only the dark powers everyone already fears. Afrit's power is never shown as Shadow until the reveal.

| Rule | Detail | In game (19 October 2026) |
| --- | --- | --- |
| Shadow rulers at start | Volgan, Zol, Demon, Dolon, Nezer. Nobody else. | holds |
| Worshipdom at start | **Light**, stance `zin_light_sanctuary` (D1; public face: a hermitage of pilgrims, hospitals and couriers) | holds (fixed 19 October) |
| Shadow popularity at start | 0 everywhere except the dark realms (60 to 100) and Dark Lands holds that Volgan's agents court (up to 10; established that his agents court them) | Aenor fixed to 0 (D5); the Dark Lands values are not yet written |
| Afrit's influence before the reveal | Lives only in hidden mechanic variables (`zin_footholds`, `zin_council_influence`). It never adds Shadow popularity. | — |
| After `zin_afrit_revealed` | Footholds turn into Shadow popularity (section 8). The Worshipdom switches to `zin_shadow_worship`. | — |

### 3. Stances

Stances are the engine's sub-ideologies (leader ideologies). Vanilla stances stay defined with `can_be_randomly_selected = no` so old references resolve; no ZIN country uses them. Counts are from `docs/design/countries.csv` (19 October 2026).

| Stance | Name | Ideology | At start | Who it suits |
| --- | --- | --- | ---: | --- |
| `zin_light_council` | Free Council | Light | 12 | Trading towns and island leagues with elected councils |
| `zin_light_kinship` | Elder Kinship | Light | 24 | Elven realms (Magical Forest, Gala Elves) |
| `zin_light_wardens` | Warden Host | Light | 5 | Selen, Kilinti, Hiloron, Mirolon, Yeldenne |
| `zin_light_sanctuary` | Sanctuary | Light | 42 (with the Worshipdom) | Sunhot realms; the Worshipdom's public face; Aenor under the crowned Aurevan until the reveal (N14) |
| `zin_dom_crown` | High Crown | Dominion | 4 | Coldor, Lerendor, Noris, Stabilo |
| `zin_dom_court` | Golden Court | Dominion | 1 | Aenor |
| `zin_dom_warlord` | Warlordship | Dominion | 4 | Dondor, Isengard, Molot, Nan |
| `zin_dom_conquest` | Conquering Host | Dominion | 1 | Goldoroth |
| `zin_shadow_dread` | Dread Lordship | Shadow | 4 | Volgan, Demon, Dolon, Nezer |
| `zin_shadow_worship` | Worship-Cult | Shadow | 0 | Afrit's realms after the reveal; the King of the East |
| `zin_shadow_grave` | Grave Dominion | Shadow | 1 | Zol |
| `zin_shadow_horde` | Devouring Horde | Shadow | 0 | Monster hosts Volgan raises in war |
| `zin_wild_clans` | Clan Moot | Wild | 57 | Cold Lands and island clans, giants, yeti |
| `zin_wild_seclusion` | Seclusion | Wild | 1 | Cursed Lands |
| `zin_wild_freeholds` | Freeholds | Wild | 127 | Independent lords and towns; most Concord dominions |
| `zin_wild_tribes` | Tribal Chieftaincy | Wild | 22 | Orc holds, trolls, Bloody Forest |

**Stance spirits (proposed).** Each country carries one permanent spirit `zin_stance_<stance>` matching its ruler's stance, so stances matter in play. The id keeps the stance key whole (for example `zin_stance_zin_light_council`). A major mechanic spec may replace a spirit and must say so. All modifiers exist in the 1.19.3 modifier documentation.

| Spirit | Modifiers |
| --- | --- |
| `zin_stance_zin_light_council` | `stability_factor 0.05`, `political_power_factor -0.05`, `opinion_gain_monthly_factor 0.1` |
| `zin_stance_zin_light_kinship` | `research_speed_factor 0.05`, `drift_defence_factor 0.3`, `political_power_factor -0.05` |
| `zin_stance_zin_light_wardens` | `army_core_defence_factor 0.1`, `war_support_factor 0.05` |
| `zin_stance_zin_light_sanctuary` | `stability_factor 0.1`, `justify_war_goal_time 0.5`, `ai_focus_peaceful_factor 0.5` |
| `zin_stance_zin_dom_crown` | `political_power_factor 0.1`, `conscription_factor 0.05` |
| `zin_stance_zin_dom_court` | `political_power_factor 0.15`, `stability_factor -0.05`, `consumer_goods_factor 0.05` |
| `zin_stance_zin_dom_warlord` | `war_support_factor 0.1`, `army_attack_factor 0.05`, `stability_factor -0.05` |
| `zin_stance_zin_dom_conquest` | `justify_war_goal_time -0.25`, `war_support_factor 0.1`, `stability_factor -0.05` |
| `zin_stance_zin_shadow_dread` | `war_support_factor 0.15`, `stability_factor 0.1`, `resistance_target -0.1` |
| `zin_stance_zin_shadow_worship` | `political_power_factor 0.1`, `drift_defence_factor 0.3`, `operative_slot 1` |
| `zin_stance_zin_shadow_grave` | `war_support_factor 0.2`, `research_speed_factor -0.1` |
| `zin_stance_zin_shadow_horde` | `army_attack_factor 0.1`, `stability_factor -0.1`, `consumer_goods_factor -0.05` |
| `zin_stance_zin_wild_clans` | `army_morale_factor 0.05`, `political_power_factor -0.1` |
| `zin_stance_zin_wild_seclusion` | `drift_defence_factor 0.5`, `army_core_defence_factor 0.15`, `trade_opinion_factor -0.25` |
| `zin_stance_zin_wild_freeholds` | `stability_factor 0.05`, `production_speed_buildings_factor 0.05`, `political_power_factor -0.05` |
| `zin_stance_zin_wild_tribes` | `army_attack_factor 0.05`, `research_speed_factor -0.1`, `stability_factor -0.05` |

When a ruler's stance changes (a new ruler, a civil war, a story event), the scripted effect `zin_politics_set_stance = { STANCE = <stance> }` removes every `zin_stance_*` spirit, adds `zin_stance_<STANCE>`, calls `set_country_leader_ideology = <STANCE>` and resets `zin_drift_resistance` (section 7).

### 4. Parties per country type

Every country has four parties (one per engine ideology). Today no party names exist, so the game shows the bare ideology name. The builder writes `<TAG>_<ideology>_party` and `<TAG>_<ideology>_party_long` for every country from the templates below (all *proposed*). `[Adj]` is the country's adjective, resolved at build time. The type comes from the country's stance, people and role: the rows are checked from the top and the first match wins.

| Country type (first match) | Light | Dominion | Shadow | Wild |
| --- | --- | --- | --- | --- |
| Aenor | The Lost Cause | The Golden Court | Night Cults | The Free Dominions |
| Temple-state (Worshipdom) | **The Faithful of the Deliverer** (D1) | Temple Wardens | Night Cults | Pilgrims' Road |
| Zol | none shown (0 popularity) | none | The Silent Dominion | none |
| Dark realms (Volgan, Demon, Dolon, Nezer) | Captives' Hope | Iron Captains | The Dread Court | Monster Clans |
| Concord dominions (Aenor's subjects) | Charter Loyalists | The Governor's Men | Night Cults | Free Dominion Party |
| Elven realms (people `elves`) | Council of Houses | Lords of the High Seat | The Fallen | The Secluded |
| Sunhot realms (people `sun_elves`) | Keepers of Peace | Sun Lords | The Fallen | The Wandering Kin |
| Clans and tribes (orcs, trolls, giants, yeti, ents; stances `zin_wild_clans`, `zin_wild_tribes`) | Hearth Speakers | The Warchief's Host | Volgan's Heralds | The Clan Moot |
| Council realms (`zin_light_council`) | The [Adj] Council | Crown Party | Night Cults | Free Towns |
| Crowns of men (every other country) | Wardens of the Realm | The [Adj] Crown | Night Cults | The Old Lords |

"None shown" means the key is written with the ideology's own name and popularity stays 0. "Night Cults" are worshippers of Volgan and old dark spirits (safe before the reveal). No party name may name Afrit or call the Deliverer a demon before `zin_afrit_revealed`. The Aenor spec may rename Aenor's parties during the succession with `set_party_name` (for example a Light party renamed "Eindil's Host" after `zin_eindil_named`).

### 5. Elections

| Rule | Value |
| --- | --- |
| Countries with elections | Stance `zin_light_council` (12 today), and the Magical Forest (elected council of houses, proposed constitution; [OPEN_QUESTIONS](../OPEN_QUESTIONS.md) foundation 4 proceeds on "yes") |
| Frequency | 48 months (council realms); 60 months (Magical Forest) |
| `last_election` | Start date minus 36 months for 48-month realms, minus 48 months for the Magical Forest, so the first elections fall a year after the start. With the calendar ([01_start_and_calendar.md](01_start_and_calendar.md)) this is `1745.3.1` and `1744.3.1`. Today the politics step writes `"1932.1.1"` for every country. |
| Everyone else | `elections_allowed = no` |
| Election event | `on_new_term_election` fires `zin_politics.1` "The Council Sits": flavour, a small stability or political power choice; the AI keeps the ruling party |
| Safety | Shadow popularity is 0 in election realms at start, so no peaceful election can raise a dark government. After `zin_afrit_revealed`, an election won by Shadow fires `zin_politics.2` (the council splits; ruling party changes with a stability penalty) |

The game rule `zin_rule_elections` ([05_defines_and_rules.md](05_defines_and_rules.md)) can disable elections: under `NONE` the startup effect calls `set_politics = { elections_allowed = no }` for every country.

### 6. Rulers and advisors

**Rulers.** Every country recruits one ruler at start. Ids follow the contract and its additions: rulers keep `<TAG>_zin_ruler`, except Volgan, Lorien, Horos and the Deliverer, who use the contract ids, and Zol, whose leader is the emblem `zin_zol_will` (contract additions).

| Country | Character id | Shown name | In game (19 October 2026) |
| --- | --- | --- | --- |
| Aenor | `<Aenor tag>_zin_ruler` | The Golden King | matches. His personal name is not established; never invent it. |
| Worshipdom | `zin_aurevan` | Aurevan the Deliverer (D1) | Name fixed 19 October; the id is still the generated `<TAG>_zin_ruler`. Switch to `zin_aurevan`. `set_character_name` renames it after the reveal. |
| Volgan | `zin_volgan` | Volgan | still `<TAG>_zin_ruler`; switch to the contract id |
| Yeldenne | `zin_horos` | Horos | still `<TAG>_zin_ruler`, people portrait; switch to the contract id with a unique portrait |
| Gala Elves | `zin_lorien` | King Lorien | still `<TAG>_zin_ruler`, people portrait; switch to the contract id with a unique portrait |
| Zol | `zin_zol_will` (*proposed*) | The Will of Zol (S4) | Name fixed 19 October, but the id is `<TAG>_zin_ruler` and the portrait is a `the_dead` people portrait. Target: an emblem portrait (the Zol tree's `zol_sigil` emblem) and no traits. The text never says who administers the Mistake. |
| Every other country | `<TAG>_zin_ruler` | Generated regional name, or the name the characters spec gives | matches |

Ruler `country_leader` blocks use the country's stance as `ideology` and keep today's `expire = "2000.1.1.1"`, past the game's end date, so no ruler expires during play. Tier A countries also get one named leader for each ideology the story can give them (for example Aenor: the Golden King, Aurevan, a Golden Court regent, a Free Dominions leader); [02_characters.md](../02_lore/02_characters.md) names them. Other countries rely on generated leaders, whose portraits already come from their people's pool (`portraits/zin_portraits.txt`).

**Leader traits.** All ZIN country leader and advisor traits live in one file, `common/country_leader/00_zin_leader_traits.txt`. It exists today (written by `modules/vanilla_removal.mjs`, table `TRAITS`, every modifier checked against the documentation) and already holds every trait below plus the named-character traits of the characters spec. It ships beside the vanilla trait files until stage 2 replaces `common/country_leader` ([06_vanilla_removal_and_zero_errors.md](06_vanilla_removal_and_zero_errors.md)). Which named character carries which trait is the characters spec's call; this spec defines the generic traits and their default holders.

| Trait | Default holder | Modifiers |
| --- | --- | --- |
| `zin_trait_gilded_fool` | The Golden King (with the characters spec's traits) | `political_power_factor -0.15`, `consumer_goods_factor 0.05`, `stability_factor -0.05` |
| `zin_trait_beloved_god` | Aurevan (Aenor, Worshipdom) | `stability_factor 0.15`, `drift_defence_factor 0.3` |
| `zin_trait_dread_lord` | dread lords (Demon, Dolon, Nezer) | `war_support_factor 0.2`, `army_attack_factor 0.1` |
| `zin_trait_memory_of_dardan` | Lorien (N7) | `stability_factor 0.1`, `army_defence_factor 0.1`, `research_speed_factor 0.05` |
| `zin_trait_ancient_king` | other ancient rulers (N7) | `research_speed_factor 0.1`, `stability_factor 0.1` |
| `zin_trait_guardian_spirit` | Horos | `army_core_defence_factor 0.3` |
| `zin_trait_elected_speaker` | generated council leaders | `stability_factor 0.03` |
| `zin_trait_warband_chief` | generated tribal leaders | `army_attack_factor 0.03` |

**Political advisors.** Three political advisor slots, as in the engine.

| Tier | Advisors | Source |
| --- | --- | --- |
| A | Six or more named advisors (Aenor: Chancellor Merovan `zin_merovan`, proposed; court favourites; a Lost Cause captain) | [02_characters.md](../02_lore/02_characters.md) (`characters.json`), recruited by the country's history with `recruit_character` |
| B | Three named advisors | the regional specs through the characters spec |
| C | Three generated councillors per country, named from the country's own name pool | `history/general/zin_general.txt` (`generate_character`, slot `political_advisor`) |

**Today** every country has the same three generated councillors (`zin_adv_treasurer`, `zin_adv_road_warden`, `zin_adv_envoy`). **Target:** tier C councillors are the treasurer plus the two other types below that fit the country's stance, first match in table order; tier A and B countries leave the generated list when their named advisors land.

Advisor traits (*proposed*, all in `00_zin_leader_traits.txt` today):

| Trait | Name | Modifiers | Fits |
| --- | --- | --- | --- |
| `zin_adv_treasurer` | Keeper of the Treasury | `consumer_goods_factor -0.05` | any |
| `zin_adv_court_favourite` | Court Favourite | `political_power_factor 0.1`, `stability_factor -0.03` | Dominion |
| `zin_adv_sage` | Sage of the Archive | `research_speed_factor 0.05` | Light, elves |
| `zin_adv_road_warden` | Warden of Roads | `production_speed_buildings_factor 0.1` | any |
| `zin_adv_whisper_master` | Whisper-Master | `operative_slot 1`, `civilian_intel_factor 0.1` | Dominion, Shadow |
| `zin_adv_high_priest` | High Priest | `stability_factor 0.05`, `drift_defence_factor 0.15` | any; in Aenor a priest of the Deliverer (public worship only) |
| `zin_adv_envoy` | Envoy of Crowns | `improve_relations_maintain_cost_factor -0.2`, `opinion_gain_monthly_factor 0.1` | any |
| `zin_adv_merchant_prince` | Merchant Prince | `trade_opinion_factor 0.2`, `production_factory_efficiency_gain_factor 0.05` | council, freeholds |
| `zin_adv_muster_master` | Muster-Master | `recruitable_population_factor 0.05`, `training_time_army_factor -0.05` | Dominion, Wild |
| `zin_adv_elder` | Elder of the Kin | `drift_defence_factor 0.2`, `political_power_gain 0.05` | kinship, clans |
| `zin_adv_war_speaker` | War-Speaker | `war_support_factor 0.1`, `stability_factor -0.02` | tribes, warlords |
| `zin_adv_grave_binder` | Grave-Binder | `training_time_army_factor -0.1`, `stability_factor -0.03` | Shadow only |

Cost 150 political power (engine default). Military advisors (army and navy chiefs, theorists) belong to [01_warfare.md](../03_gameplay/01_warfare.md).

### 7. Popularity drift

The engine's per-ideology drift modifiers are generated per ideology and are not in the modifier documentation, so ZIN does not use them. ZIN moves popularity with `add_popularity` through one monthly drift engine:

1. Any system calls `zin_politics_add_drift = { IDEOLOGY = <light|dominion|shadow|wild> VALUE = <points> }` (percentage points this month). It adds `VALUE` to the country variable `zin_drift_<IDEOLOGY>` (`zin_drift_light`, `zin_drift_dominion`, `zin_drift_shadow`, `zin_drift_wild`).
2. Once a month, on the engine's `on_monthly` for that country, `zin_politics_apply_drift` multiplies each queued value by `(1 - zin_drift_resistance)`, applies it as `add_popularity = { ideology = <engine key> popularity = <value / 100> }` (one fixed block per ideology: light = `democratic`, dominion = `fascism`, shadow = `communism`, wild = `neutrality`), then clears the queue.
3. `zin_drift_resistance` is set from the stance at startup and by `zin_politics_set_stance`: 0 for council, freeholds, clans, tribes, crowns and warlords; 0.3 for kinship, wardens, sanctuary, court and divine; 0.5 for seclusion and every Shadow stance.
4. Drift never pushes an ideology above 80% or a ruling party below 20%: before applying, the effect cuts the value to the room left (`check_variable` on the dynamic variable `party_popularity@<engine key>`). The engine handles the rest.

**Drift sources** (design targets, per month):

| Source | Condition | Drift |
| --- | --- | --- |
| Peace | Before `zin_golden_king_dead`, no country at war | none: politics is stable at start |
| Volgan's agents | Dark Lands countries (`zin_region_dark_lands` flag, economy spec); `zin_gathering_dark` ≥ 50 or `zin_volgan_marches` | Shadow +0.2 |
| Afrit's footholds | After `zin_afrit_revealed`; per level of `zin_footholds` | Shadow +0.3 per level |
| Rally against the dark | At war with a Shadow country | Light +0.3, Shadow -0.3 |
| Occupation by Shadow | Controller is Shadow and owns 50%+ of the core states | Shadow +0.5 |
| Lost Cause membership | A member of the Lost Cause (Aenor spec; an institution at the start, S3) after `zin_eindil_named` | Light +0.2 |
| Mechanic-specific | Named in each mechanic spec | via `zin_politics_add_drift` only |

Party boosting through operatives and diplomacy stays the engine's; `drift_defence_factor` affects only that.

### 8. How politics follows the story

| Moment | Political change | Owner spec |
| --- | --- | --- |
| Start, 4A 1748 | As above. No Shadow outside the dark realms. Everyone at peace. | this spec |
| `zin_golden_king_dead` | Aenor's ruling party loses 20 popularity; the four camps contend through the Aenor mechanic. Engine civil wars need distinct ideologies, so at most three camps can be civil-war sides; the Aenor spec maps the camps and runs the fourth through its court mechanic. | Aenor |
| `zin_aurevan_crowned` | Aenor: ruler `zin_aurevan` shown as "Aurevan"; government Light, stance `zin_light_sanctuary` (N14), so the crowned Aenor of the Faithful shows the same public face as the Worshipdom; the Light party carries the Faithful's name ("The Deliverer's Faithful", the Aenor spec's two-face party names, `set_party_name`). No Shadow popularity is added. | Aenor, Afrit |
| `zin_afrit_revealed` | If Afrit still rules Aenor: Shadow, stance `zin_shadow_worship`; the Faithful's popularity moves from Light to Shadow and the party names switch as the Aenor spec sets them (Shadow takes the Faithful's name, Light the Host's). `set_character_name` renames `zin_aurevan` to "Afrit" for everyone. The Worshipdom turns Shadow, `zin_shadow_worship` (D1, N14). Every country with `zin_footholds` ≥ 3 gains Shadow popularity 5 × footholds at once. | Afrit, Aenor |
| `zin_afrit_king_of_east` | Afrit's eastern seat (the Worshipdom under "the Dominion of the East", S1) is Shadow `zin_shadow_worship` | Afrit, eastern kings |
| `zin_eindil_named` | A Light camp gains a leader; the Lost Cause may become Eindil's army | Aenor, Eindil |
| `zin_volgan_marches` | Conquered states drift Shadow (occupation row) | Volgan |
| `zin_eindil_crowned` | Aenor: Light, stance `zin_light_wardens`, ruler `zin_eindil` | Aenor |
| Endings | Lost Cause: Light leads; Children of Volgan: Shadow `zin_shadow_dread` leads; Ashen Throne: Shadow `zin_shadow_worship` leads | [05_world_tension_and_endings.md](../03_gameplay/05_world_tension_and_endings.md) |

## Implementation

**Files.** Game files come from the ZIN content builder (`tools/content/build.mjs`) and the politics step (HOI4 Agent Tools, `.tmp/zin-politics-v4.mts`, outside this repository), written through the shared atomic rewrite engine (`tools/content/apply.mts`).

| File | Content | Written by |
| --- | --- | --- |
| `common/ideologies/00_ideologies.txt` | Four ideologies, ZIN and vanilla stances, rules | `tools/content/modules/ideologies.mjs` (exists). Add the D6 modifiers and the target Light colour. |
| `localisation/replace/zin_ideologies_l_english.yml` | Ideology and stance names; `communism_desc` "Rule of the Shadow" | `ideologies.mjs` |
| `common/ideas/zin_stances.txt` | The 16 stance spirits `zin_stance_<stance>` (`allowed = { always = no }`, `removal_cost = -1`) | `tools/content/modules/politics.mjs` (new) |
| `common/country_leader/00_zin_leader_traits.txt` | Leader and advisor traits | today `vanilla_removal.mjs` (`TRAITS`); moves to `politics.mjs`, same file name |
| `history/general/zin_general.txt` | Tier C generated councillors by stance fit | today `vanilla_removal.mjs` (`COUNCILLORS`); moves to `politics.mjs` |
| `common/characters/zin_rulers.txt`, `localisation/english/zin_rulers_l_english.yml` | Rulers with the ids of section 6 | `tools/content/modules/characters.mjs`: its `NAMED` map becomes `{ name, id, portrait }`; `zin_aurevan`, `zin_volgan`, `zin_horos`, `zin_lorien` and `zin_zol_will` replace the generated ids; the politics step's `recruit_character` lines follow the same ids |
| `localisation/english/zin_parties_l_english.yml` | `<TAG>_<ideology>_party`, `_party_long` for 305 countries | `politics.mjs` from the type table |
| `common/scripted_effects/zin_politics.txt` | `zin_politics_add_drift`, `zin_politics_apply_drift`, `zin_politics_set_stance` | `politics.mjs` |
| `common/scripted_triggers/zin_politics.txt` | `zin_politics_is_light_realm` (ruling party `democratic`), `zin_politics_is_dark_realm` (ruler stance is a Shadow stance), `zin_politics_has_elections` (`has_elections = yes`) | `politics.mjs` |
| `common/on_actions/zin_politics.txt` | `on_startup` (stance spirit per country, `zin_drift_resistance`, `zin_rule_elections`), `on_monthly` (`zin_politics_apply_drift`), `on_new_term_election` (`zin_politics.1`, and `zin_politics.2` when Shadow wins after the reveal) | `politics.mjs` |
| `events/zin_politics.txt` | Namespace `zin_politics` | `politics.mjs` |
| `history/countries/*` | `set_politics` (ruling party, `last_election`, frequency, `elections_allowed`), `set_popularities`, `recruit_character` | politics step, reading `docs/design/countries.csv` |

**Data.** `politics.mjs` reads `docs/design/countries.csv` (stance per country), the roster `tools/content/data/countries.json` (names, regions, adjectives) and the subject list of the politics output (for the Concord dominion row). The stance and ideology come from `countries.csv` only. The roster's own `ideology` field is stale for 76 countries (19 October 2026), among them Demon, Dolon and Nezer (Wild in the roster; Shadow, `zin_shadow_dread`, in `countries.csv` and in game), Coldor (Wild; Dominion, `zin_dom_crown`), Hiloron (Shadow; Light, `zin_light_wardens`), Volgan (Dominion; Shadow) and the Worshipdom (Shadow; Light). Phase 1 data fix ([04_countries_and_states.md](04_countries_and_states.md) section 8): `modules/countries.mjs` writes the roster field from `countries.csv`, and a data check fails when the two disagree.

**Events** (namespace `zin_politics`):

| Id | Purpose |
| --- | --- |
| `zin_politics.1` | The council sits (election flavour) |
| `zin_politics.2` | Shadow wins an election after the reveal: the council splits |
| `zin_politics.3` | A stance changes: hidden; calls `zin_politics_set_stance` |

**Popularities at start** (replace the uniform mixes of the politics step):

| Ruling | Light | Dominion | Shadow | Wild | Today |
| --- | ---: | ---: | ---: | ---: | --- |
| Light realms | 65 | 10 | 0 | 25 | 60 / 15 / 0 / 25 |
| Dominion realms | 15 | 60 | 0 | 25 | 15 / 60 / 0 / 25 |
| Wild realms | 15 | 15 | 0 (Dark Lands: up to 10) | 70 | uniform mix |
| Volgan, demon realms | 0 | 10 | 85 | 5 | uniform mix |
| Zol | 0 | 0 | 100 | 0 | uniform mix |
| Aenor | 20 (Lost Cause) | 60 (Golden Court) | 0 (D5) | 20 (Free Dominions) | 15 / 60 / 0 / 25 |
| Worshipdom | 75 | 15 | 0 | 10 | 60 / 15 / 0 / 25 |

**Build checks** (in `tools/content/build.test.mjs`, G1 of [01_acceptance.md](../09_validation/01_acceptance.md)):

- Every stance in `countries.csv` exists; ideology matches stance.
- No Shadow ruling party except the five dark realms at start; Shadow popularity is 0 in every other country outside the Dark Lands.
- No localisation key shown before the reveal contains "Afrit" (party names, ruler names, bookmark descriptions `ZIN_FOURTH_AGE_DESC_<key>` and, until the new bookmark replaces them, `*_WORLD_DESC`). The Worshipdom's description is already public (fixed 19 October); the check keeps it so.
- Every country has four party names; every party key resolves its `[Adj]`.
- Every modifier in the stance spirits and traits exists in the installed `modifiers_documentation.md` (the builder's `assertModifiers`).

## AI

- Ideology AI flags as in section 1.
- The peaceful start rests on D6 and the engine's tension (section 1), and on the start AI strategy of [04_countries_and_states.md](04_countries_and_states.md).
- Stance spirits steer the AI: `ai_focus_peaceful_factor` for sanctuaries.
- AI election options always keep the ruling party.
- AI picks advisors by trait fit: `ai_will_do` 2 for the advisor matching its stance, 1 otherwise.

## Acceptance

1. **Build:** the checks above pass, each with a negative test (an unknown stance, a Shadow ruler outside the five, a party text naming Afrit, a missing party key, an unknown modifier).
2. **Build:** `zin_rulers.txt` defines `zin_aurevan`, `zin_volgan`, `zin_horos`, `zin_lorien` and `zin_zol_will` and no generated ruler for those five countries; `zin_zol_will` has no traits and an emblem portrait.
3. **Offline:** a `hoi4.mechanic_test` suite (`tests/mechanics/politics.json`) shows that `zin_politics_add_drift` then `zin_politics_apply_drift` moves popularity by value × (1 − resistance), respects the 80% and 20% caps, and clears the queue; and that `zin_politics_set_stance` leaves exactly one stance spirit.
4. **Linux run (start case of the Worshipdom):** the politics view shows Light, Sanctuary, the party "The Faithful of the Deliverer" and the leader "Aurevan the Deliverer"; no screen opened names Afrit.
5. **Linux run:** the ideology map mode at the start shows Shadow only on Volgan, Zol, Demon, Dolon and Nezer; every country's politics view shows four named parties (sample: the eight start cases).
6. **Linux observer run (phase 3, L5 of the acceptance spec):** elections happen only in council realms and the Magical Forest, no election changes a ruling ideology, and no country changes ideology before `zin_golden_king_dead`.
7. **Offline scenario test** (`hoi4.scenario_test`): with `zin_aurevan_crowned` set and `zin_afrit_revealed` not set, Aenor is Light with stance `zin_light_sanctuary` and 0 Shadow popularity (N14); with `zin_afrit_revealed` set by the Afrit spec's reveal, the Worshipdom turns Shadow, `zin_aurevan` is renamed, and countries with footholds ≥ 3 gain Shadow popularity.

## Open questions

All proceed on their proposals; the owner's copies are in [OPEN_QUESTIONS.md](../OPEN_QUESTIONS.md), foundation 1–5.

1. The Worshipdom's public stance: decided by D1 (Light, Sanctuary).
2. Party names and the pale-sky Light colour: proceed as proposed (foundation 2). The stance `zin_dom_divine` that the same owner question names is withdrawn by N14.
3. "Dominion" names an ideology and Volgan's Southern Dominion: both stay (foundation 3).
4. Magical Forest elections: yes, every 60 months (foundation 4).
5. Zol's emblem leader: decided by S4 ("The Will of Zol").
