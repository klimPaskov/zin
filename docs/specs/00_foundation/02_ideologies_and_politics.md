# Ideologies and politics

**Status:** Draft. **Priority:** 3. **Phase:** 3.

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

**Proposed (this spec):** the four ideologies as a game structure, their stances, party names, stance spirits, advisor traits, drift rules, election rules, the stance `zin_dom_divine`, the Worshipdom's public stance, and every number. The public name Aurevan and the name Merovan are proposed in the vault and stay proposed here.

## Design

### 1. The four ideologies

The engine keys stay so the AI and defines keep working. They are renamed and re-themed (see [CONVENTIONS](../CONVENTIONS.md)).

| Key | Name | Means in Erdae | Countries at start (today) | Map colour |
| --- | --- | --- | ---: | --- |
| `democratic` | Light | Rule by consent, kinship or guardianship: councils, elder houses, wardens, sanctuaries | 82 | today (214, 196, 120); proposed (196, 214, 236) pale sky, so it no longer looks like Dominion |
| `fascism` | Dominion | Rule by right of crown, court, captain or conquest | 10 | (178, 132, 46) bronze |
| `communism` | Shadow | Rule by the open dark powers: dread lords, the grave, demon courts, devouring hosts; after the reveal, Afrit's cult | 6 | (92, 40, 96) |
| `neutrality` | Wild | Unaligned folk: clan moots, freeholds, tribes, secluded peoples | 207 | (112, 128, 104) |

Ideologies are forms of rule, not moral labels, with one exception: Shadow is the side of the dark powers and nothing else.

**Engine rules** (current values in `modules/ideologies.mjs`; keep them):

| Ideology | Key rules | War tension | Faction tension | AI flag |
| --- | --- | ---: | ---: | --- |
| Light | cannot puppet; cannot declare war on Light; can force government; justifies war only on threatening countries; can guarantee other ideologies; hosts exiles; `generate_wargoal_tension 1`, `join_faction_tension 0.6`, `guarantee_tension 0.25` | 0.25 | 0.1 | `ai_democratic` |
| Dominion | can puppet; can force government; collaboration governments; `justify_war_goal_when_in_major_war_time -0.5` | 0.75 | 0.6 | `ai_fascist` |
| Shadow | can puppet; can declare war on Shadow; collaboration governments; `justify_war_goal_when_in_major_war_time -0.8` | 1.0 | 1.0 | `ai_communist` |
| Wild | can puppet; no volunteers; `generate_wargoal_tension 0.5`, `join_faction_tension 0.4`, `guarantee_tension 0.4`, `drift_defence_factor -0.3` | 0.25 | 0.1 | `ai_neutral` |

Change: the Shadow description `communism_desc` reads "Dominion of Shadow" today, which collides with the Dominion ideology and Volgan's Southern Dominion. Proposed: "Rule of the Shadow".

### 2. The secret and Shadow

Shadow at the start means only the dark powers everyone already fears. Afrit's power is never shown as Shadow until the reveal.

| Rule | Detail |
| --- | --- |
| Shadow rulers at start | Volgan, Zol, Demon, Dolon, Nezer. Nobody else. |
| Worshipdom at start | **Light**, stance `zin_light_sanctuary` (proposed public face: a hermitage of pilgrims, hospitals and couriers). Today it is Shadow `zin_shadow_worship`, which tells every player on the ideology map mode that the Deliverer's temple is dark. Fix in the country table. |
| Shadow popularity at start | 0 everywhere except: dark realms (60 to 90), and Dark Lands holds that Volgan's agents court (up to 10; established that his agents court them). Aenor's 10% Shadow today must become 0. |
| Afrit's influence before the reveal | Lives only in hidden mechanic variables (`zin_footholds`, `zin_council_influence`). It never adds Shadow popularity. |
| After `zin_afrit_revealed` | Footholds turn into Shadow popularity (section 7). The Worshipdom switches to `zin_shadow_worship`. |

### 3. Stances

Stances are the engine's sub-ideologies (leader ideologies). Vanilla stances stay defined with `can_be_randomly_selected = no` so old references resolve; no ZIN country uses them.

| Stance | Name | Ideology | At start | Who it suits |
| --- | --- | --- | ---: | --- |
| `zin_light_council` | Free Council | Light | 12 | Trading towns and island leagues with elected councils |
| `zin_light_kinship` | Elder Kinship | Light | 24 | Elven realms (Magical Forest, Gala Elves) |
| `zin_light_wardens` | Warden Host | Light | 5 | Selen, Kilinti, Hiloron, Mirolon, Yeldenne |
| `zin_light_sanctuary` | Sanctuary | Light | 41 (+1 Worshipdom) | Sunhot realms; the Worshipdom's public face |
| `zin_dom_crown` | High Crown | Dominion | 4 | Coldor, Lerendor, Noris, Stabilo |
| `zin_dom_court` | Golden Court | Dominion | 1 | Aenor |
| `zin_dom_warlord` | Warlordship | Dominion | 4 | Dondor, Isengard, Molot, Nan |
| `zin_dom_conquest` | Conquering Host | Dominion | 1 | Goldoroth |
| `zin_dom_divine` | **Divine Crown** (new, proposed) | Dominion | 0 | Aenor after `zin_aurevan_crowned`: the god the realm worships wears its crown. Never names Afrit. |
| `zin_shadow_dread` | Dread Lordship | Shadow | 4 | Volgan, Demon, Dolon, Nezer |
| `zin_shadow_worship` | Worship-Cult | Shadow | 0 (today 1) | Afrit's realms after the reveal; the King of the East |
| `zin_shadow_grave` | Grave Dominion | Shadow | 1 | Zol |
| `zin_shadow_horde` | Devouring Horde | Shadow | 0 | Monster hosts Volgan raises in war |
| `zin_wild_clans` | Clan Moot | Wild | 57 | Cold Lands and island clans, giants, yeti |
| `zin_wild_seclusion` | Seclusion | Wild | 1 | Cursed Lands |
| `zin_wild_freeholds` | Freeholds | Wild | 127 | Independent lords and towns; most Concord dominions |
| `zin_wild_tribes` | Tribal Chieftaincy | Wild | 22 | Orc holds, trolls, Bloody Forest |

**Stance spirits (proposed).** Each country carries one permanent spirit `zin_stance_<stance>` matching its ruler's stance, so stances matter in play. A major mechanic spec may replace it and must say so.

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
| `zin_stance_zin_dom_divine` | `political_power_factor 0.1`, `stability_factor 0.1`, `drift_defence_factor 0.2` |
| `zin_stance_zin_shadow_dread` | `war_support_factor 0.15`, `stability_factor 0.1`, `resistance_target -0.1` |
| `zin_stance_zin_shadow_worship` | `political_power_factor 0.1`, `drift_defence_factor 0.3`, `operative_slot 1` |
| `zin_stance_zin_shadow_grave` | `war_support_factor 0.2`, `research_speed_factor -0.1` |
| `zin_stance_zin_shadow_horde` | `army_attack_factor 0.1`, `stability_factor -0.1`, `consumer_goods_factor -0.05` |
| `zin_stance_zin_wild_clans` | `army_morale_factor 0.05`, `political_power_factor -0.1` |
| `zin_stance_zin_wild_seclusion` | `drift_defence_factor 0.5`, `army_core_defence_factor 0.15`, `trade_opinion_factor -0.25` |
| `zin_stance_zin_wild_freeholds` | `stability_factor 0.05`, `production_speed_buildings_factor 0.05`, `political_power_factor -0.05` |
| `zin_stance_zin_wild_tribes` | `army_attack_factor 0.05`, `research_speed_factor -0.1`, `stability_factor -0.05` |

When a ruler's stance changes (a new ruler, a civil war, a story event), the scripted effect `zin_politics_set_stance` swaps the spirit.

### 4. Parties per country type

Every country has four parties (one per engine ideology). Today no party names exist, so the game shows the bare ideology name. The generator writes `<TAG>_<ideology>_party` and `<TAG>_<ideology>_party_long` for every country from the templates below (all proposed). `[Adj]` is the country's adjective.

| Country type | Light | Dominion | Shadow | Wild |
| --- | --- | --- | --- | --- |
| Crowns of men (Dominion crowns and warlords) | Wardens of the Realm | The [Adj] Crown | Night Cults | The Old Lords |
| Council realms (`zin_light_council`) | The [Adj] Council | Crown Party | Night Cults | Free Towns |
| Concord dominions (Aenor's subjects) | Charter Loyalists | The Governor's Men | Night Cults | Free Dominion Party |
| Elven realms | Council of Houses | Lords of the High Seat | The Fallen | The Secluded |
| Sunhot realms | Keepers of Peace | Sun Lords | The Fallen | The Wandering Kin |
| Clans and tribes (orcs, trolls, giants, yeti, Wild clans) | Hearth Speakers | The Warchief's Host | Volgan's Heralds | The Clan Moot |
| Dark realms (Volgan, demon realms) | Captives' Hope | Iron Captains | The Dread Court | Monster Clans |
| Zol | none shown (0 popularity) | none | The Silent Dominion | none |
| Temple-state (Worshipdom) | Servants of the Deliverer | Temple Wardens | Night Cults | Pilgrims' Road |
| Aenor | The Lost Cause | The Golden Court | Night Cults | The Free Dominions |

"Night Cults" are worshippers of Volgan and old dark spirits (safe before the reveal). No party name may name Afrit or call the Deliverer a demon before `zin_afrit_revealed`. The Aenor spec may rename Aenor's parties during the succession (for example a Light party renamed "Eindil's Host" after `zin_eindil_named`).

### 5. Elections

| Rule | Value |
| --- | --- |
| Countries with elections | Stance `zin_light_council` (12 today), and the Magical Forest (elected council of houses, proposed constitution) |
| Frequency | 48 months (council realms); 60 months (Magical Forest) |
| `last_election` | Fourth Age dates: `1745.3.1` for 48-month realms, `1744.3.1` for the Magical Forest |
| Everyone else | `elections_allowed = no` |
| Election event | `on_new_term_election` fires `zin_politics.1` "The Council Sits": flavour, small stability or political power choice; AI picks the ruling party option |
| Safety | Shadow popularity is 0 in election realms at start, so no peaceful election can raise a dark government. After `zin_afrit_revealed`, an election won by Shadow fires `zin_politics.2` (the council splits; ruling party changes with a stability penalty) |

The game rule `zin_rule_elections` (see [05_defines_and_rules.md](05_defines_and_rules.md)) can disable elections.

### 6. Rulers and advisors

**Rulers.** Every country recruits one ruler at start.

| Country | Character id | Shown name | Notes |
| --- | --- | --- | --- |
| Aenor | `<Aenor tag>_zin_ruler` | The Golden King | His personal name is not established; never invent it |
| Worshipdom | `zin_aurevan` | The Deliverer | **Fix:** today the Worshipdom's generated ruler `<TAG>_zin_ruler` is localised "Afrit" in `zin_rulers_l_english.yml`, a breach of the secret. Use `zin_aurevan` with the public name only. `set_character_name` changes it after the reveal. |
| Volgan | `zin_volgan` | Volgan | Today `<TAG>_zin_ruler`; switch to the contract id |
| Yeldenne | `zin_horos` | Horos | Unique portrait, not a men portrait |
| Gala Elves | `zin_lorien` | King Lorien | Unique portrait |
| Zol | `zin_zol_will` (new, proposed) | The Will of Zol | Not a person: an emblem portrait, no traits. The vault leaves open who administers the Mistake; the text says nobody knows. Today Zol's ruler is called "Zol" and has a person portrait, which breaks the contract (Zol has no body). |
| Every other country | `<TAG>_zin_ruler` | Generated regional name | Owner can override in `countries.csv` (see [04_countries_and_states.md](04_countries_and_states.md)) |

Ruler `country_leader` blocks use the country's stance as `ideology` and `expire = "1800.1.1.1"`. Tier A countries also get one named leader for each ideology the story can give them (for example Aenor: the Golden King, Aurevan, a Golden Court regent, a Free Dominions leader); their specs name them. Other countries rely on generated leaders, whose portraits already come from their people's pool (`portraits/zin_portraits.txt`).

**Leader traits (proposed).** Country leader traits in `common/country_leader/zin_traits.txt`:

| Trait | For | Modifiers |
| --- | --- | --- |
| `zin_trait_gilded_fool` | The Golden King | `political_power_factor -0.15`, `consumer_goods_factor 0.05`, `stability_factor -0.05` |
| `zin_trait_beloved_god` | Aurevan (Aenor, Worshipdom) | `stability_factor 0.15`, `drift_defence_factor 0.3` |
| `zin_trait_dread_lord` | Volgan | `war_support_factor 0.2`, `army_attack_factor 0.1` |
| `zin_trait_ancient_king` | Lorien | `research_speed_factor 0.1`, `stability_factor 0.1` |
| `zin_trait_guardian_spirit` | Horos | `army_core_defence_factor 0.3` |
| `zin_trait_elected_speaker` | generated council leaders | `stability_factor 0.03` |
| `zin_trait_warband_chief` | generated tribal leaders | `army_attack_factor 0.03` |

**Political advisors.** Three political advisor slots, as in the engine. Advisors are characters with an `advisor` role, `slot = political_advisor`, `allowed = { original_tag = <tag> }` (tag resolved from the country name at build time).

| Tier | Advisors |
| --- | --- |
| A | Six or more named advisors from the country's spec (Aenor: Chancellor Merovan `zin_merovan`, proposed; court favourites; a Lost Cause captain) |
| B | Three named advisors from the regional spec |
| C | Three generated advisors per country, named from the regional name pool, one of each type below that fits its stance |

Advisor traits (proposed), `common/country_leader/zin_traits.txt`:

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

Cost 150 political power (engine default). Military advisors (army, navy chiefs, theorists) belong to the warfare spec in [03_gameplay](../03_gameplay/).

### 7. Popularity drift

The engine's per-ideology drift modifiers are generated per ideology and are not in the modifier documentation, so ZIN does not use them. ZIN moves popularity with `add_popularity` through one monthly drift engine:

1. Any system calls `zin_politics_add_drift = { IDEOLOGY = shadow VALUE = 0.5 }` (percentage points this month). It adds to the country variable `zin_drift_<ideology>` (`zin_drift_light`, `zin_drift_dominion`, `zin_drift_shadow`, `zin_drift_wild`).
2. On the first day of each month (`on_monthly`), `zin_politics_apply_drift` multiplies each queued value by `(1 - zin_drift_resistance)`, applies `add_popularity`, then clears the queue.
3. `zin_drift_resistance` is set from the stance at startup and on stance change: 0 for council, freeholds, clans, tribes, crowns and warlords; 0.3 for kinship, wardens, sanctuary, court and divine; 0.5 for seclusion and every Shadow stance.
4. Drift alone never pushes an ideology above 80% or a ruling party below 20%; the engine handles the rest.

**Drift sources** (design targets, per month):

| Source | Condition | Drift |
| --- | --- | --- |
| Peace | Before `zin_golden_king_dead`, no country at war | none: politics is stable at start |
| Volgan's agents | Dark Lands countries; `zin_gathering_dark` ≥ 50 or `zin_volgan_marches` | Shadow +0.2 |
| Afrit's footholds | After `zin_afrit_revealed`; per level of `zin_footholds` | Shadow +0.3 per level |
| Rally against the dark | At war with a Shadow country | Light +0.3, Shadow -0.3 |
| Occupation by Shadow | Controller is Shadow and owns 50%+ of the core states | Shadow +0.5 |
| Lost Cause membership | In the Lost Cause faction (Aenor spec) after `zin_eindil_named` | Light +0.2 |
| Mechanic-specific | Named in each mechanic spec | via `zin_politics_add_drift` only |

Party boosting through operatives and diplomacy stays the engine's; `drift_defence_factor` affects only that.

### 8. How politics follows the story

| Moment | Political change | Owner spec |
| --- | --- | --- |
| Start, 4A 1748 | As above. No Shadow outside the dark realms. Everyone at peace. | this spec |
| `zin_golden_king_dead` | Aenor's ruling party loses 20 popularity; the four camps contend through the Aenor mechanic. Engine civil wars need distinct ideologies, so at most three camps can be civil-war sides; the Aenor spec maps the camps and runs the fourth through its court mechanic. | Aenor |
| `zin_aurevan_crowned` | Aenor: ruler `zin_aurevan` shown as "Aurevan", stance `zin_dom_divine`, Dominion party renamed "The Deliverer's Crown" | Aenor, Afrit |
| `zin_afrit_revealed` | If Afrit still rules Aenor: Shadow, stance `zin_shadow_worship`, party "The Ashen Court" (proposed). `set_character_name` renames `zin_aurevan` to "Afrit" for everyone. Worshipdom to Shadow. Every country with `zin_footholds` ≥ 3 gains Shadow popularity 5 × footholds at once. | Afrit |
| `zin_afrit_king_of_east` | Afrit's eastern seat is Shadow `zin_shadow_worship` | Afrit, eastern kings |
| `zin_eindil_named` | A Light camp gains a leader; the Lost Cause may become Eindil's army | Aenor, Eindil |
| `zin_volgan_marches` | Conquered states drift Shadow (occupation row) | Volgan |
| `zin_eindil_crowned` | Aenor: Light, stance `zin_light_wardens`, ruler `zin_eindil` | Aenor |
| Endings | Lost Cause: Light leads; Children of Volgan: Shadow `zin_shadow_dread` leads; Ashen Throne: Shadow `zin_shadow_worship` leads | [05_world_tension_and_endings](../03_gameplay/05_world_tension_and_endings.md) |

## Implementation

**Files**

| File | Content | Generator |
| --- | --- | --- |
| `common/ideologies/00_ideologies.txt` | Four ideologies, ZIN and vanilla stances, rules | `modules/ideologies.mjs` (exists); add `zin_dom_divine` |
| `localisation/replace/zin_ideologies_l_english.yml` | Ideology and stance names; fix `communism_desc` | same |
| `common/ideas/zin_stances.txt` | 17 stance spirits `zin_stance_<stance>` | new `modules/politics.mjs` |
| `common/country_leader/zin_traits.txt` | Leader and advisor traits | `modules/politics.mjs` |
| `common/characters/zin_rulers.txt` | Rulers; canon ids from the contract | `modules/characters.mjs`: replace the `NAMED` map with `{ name, id, portrait }`; drop "Afrit" and "Zol" as shown names |
| `common/characters/zin_advisors.txt` | Advisors | `modules/politics.mjs` |
| `localisation/english/zin_parties_l_english.yml` | `<TAG>_<ideology>_party`, `_party_long` for 305 countries | `modules/politics.mjs` from the type table |
| `common/scripted_effects/zin_politics.txt` | `zin_politics_add_drift`, `zin_politics_apply_drift`, `zin_politics_set_stance` | `modules/politics.mjs` |
| `common/scripted_triggers/zin_politics.txt` | `zin_politics_is_light_realm`, `zin_politics_is_dark_realm` (ruler stance in Shadow), `zin_politics_has_elections` | same |
| `common/on_actions/zin_politics.txt` | `on_startup` (stance spirit, `zin_drift_resistance`), `on_monthly` (apply drift), `on_new_term_election` | same |
| `events/zin_politics.txt` | Namespace `zin_politics` | same |
| `history/countries/*` | `set_politics`, `set_popularities`, `recruit_character`, stance spirit via startup | politics step reads `countries.csv` |

**Events** (namespace `zin_politics`):

| Id | Purpose |
| --- | --- |
| `zin_politics.1` | The council sits (election flavour) |
| `zin_politics.2` | Shadow wins an election after the reveal: the council splits |
| `zin_politics.3` | A stance changes: hidden; swaps stance spirit and drift resistance |

**Popularities at start** (replace the uniform mixes of `zin-politics-v4.mts`):

| Ruling | Light | Dominion | Shadow | Wild |
| --- | ---: | ---: | ---: | ---: |
| Light realms | 65 | 10 | 0 | 25 |
| Dominion realms | 15 | 60 | 0 | 25 |
| Wild realms | 15 | 15 | 0 (Dark Lands: up to 10) | 70 |
| Volgan, demon realms | 0 | 10 | 85 | 5 |
| Zol | 0 | 0 | 100 | 0 |
| Aenor | 20 (Lost Cause) | 60 (Golden Court) | 0 | 20 (Free Dominions) |
| Worshipdom | 75 | 15 | 0 | 10 |

**Compiler and build checks**

- Every stance in `countries.csv` exists; ideology matches stance.
- No Shadow ruler except the five dark realms at start; Shadow popularity 0 in every other non-Dark-Lands country.
- No localisation key shown before the reveal contains "Afrit" (party names, ruler names, `*_WORLD_DESC`). Today the Worshipdom's `<TAG>_WORLD_DESC` in `world_l_english.yml` names Afrit and the Hidden Council: rewrite it as a public description ("A temple-state of the Deliverer in the Zilin Hills, home to pilgrims, hospitals and couriers.").
- Every country has four party names.

## AI

- Ideology AI flags as in section 1.
- Stance spirits steer the AI: `ai_focus_peaceful_factor` for sanctuaries. Before `zin_golden_king_dead`, AI strategies (`common/ai_strategy/zin_peace.txt`) set `conquer` and `antagonize` to 0 for every country so the peaceful start holds.
- AI election options always keep the ruling party.
- AI picks advisors by trait fit: `ai_will_do` 2 for the advisor matching its stance, 1 otherwise.

## Acceptance

1. A new game shows no Shadow ruler except Volgan, Zol, Demon, Dolon and Nezer, and the Worshipdom shows Light, Sanctuary.
2. A text search of all staged localisation finds no "Afrit" outside events and scripted text gated by `zin_afrit_revealed` or shown only to the Worshipdom.
3. Every country shows four named parties in the politics screen.
4. Zol's leader is "The Will of Zol" with an emblem portrait; Worshipdom's leader is "The Deliverer".
5. Elections run only in council realms and the Magical Forest; in a 5-year hands-off run no election changes a ruling ideology.
6. In a 2-year hands-off run from the start, no country changes ideology and no war starts.
7. After forcing `zin_afrit_revealed` in a test, the Worshipdom turns Shadow, `zin_aurevan` is renamed, and countries with footholds ≥ 3 gain Shadow popularity.
8. Every modifier named here exists in the game's modifier documentation (build check).

## Open questions

1. Is the Worshipdom's public stance right as Sanctuary (Light), or should the temple-state show as Dominion?
2. Approve the proposed party names, the stance `zin_dom_divine` ("Divine Crown") and the new Light colour.
3. "Dominion" names both an ideology and Volgan's Southern Dominion. Keep both, or rename the ideology (for example "Crown")?
4. Should the Magical Forest hold elections (it is "democratic" in the working table)?
5. Should Zol's leader carry a name at all ("The Will of Zol", proposed), or only an emblem with no name?
