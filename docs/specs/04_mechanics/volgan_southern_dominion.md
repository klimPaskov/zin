# Volgan and the Southern Dominion

**Status:** Ready. Reviewed 19 October 2026 against CONVENTIONS "Status"; integrated 19 October 2026. **Priority:** 3. **Phase:** 3. Depends on the calendar ([../00_foundation/01_start_and_calendar.md](../00_foundation/01_start_and_calendar.md)): every date below is an Erdae engine date (`1755.4.1` = 1 Rainwake 4A 1755) and is only meaningful once the game starts on `1748.3.1.12`; today it still starts in 1936.

## Purpose

Volgan is the great power that is preparing for war while the world thinks him a spent legend. This mechanic makes that preparation playable and visible to Volgan alone: a hidden rebuilding measured by `zin_dominion_strength`, a veil of storms that hides it, grave musters, the Southern Dominion of Demon, Dolon and Nezer, uneasy dealings with the Nether and the Abyss, and envoys to the independent monsters of the Dark Lands. It then carries Volgan through the established story: the reconquest of Mirolon, the march north, the clash and the temporary alliance with Zol, and the destruction of his manifested body, whose spiritual aftermath stays unresolved. It also gives Mirolon, the free human realm that guards the passes, the tools to see the danger coming and to slow or stop it.

The mechanic is shared by two major trees: [Volgan](../05_focus_trees/major/volgan.md) and [Mirolon](../05_focus_trees/major/mirolon.md). Both trees call the scripted effects defined here.

## Lore basis

### Established (lore vault)

| Fact | Source |
| --- | --- |
| Volgan is a Great Spirit, the principal dark lord, not an Old God. He once served a New God and overcame it; that god's name is unknown. | *Volgan*, *Names and Retcons* |
| His armies include demons, orcs, goblins, ogres, monster clans, grave hosts, necromantic orders and other spirits. | *Volgan*, *Volgans Dead Lands* |
| The independent Dark Lands are not automatically his subjects; Dark Lands monsters do not all serve him. | *Volgan*, *Kingdoms Factions and Conflicts* |
| In the First Age he invaded Mirolon, took Aenor's capital, lost at Dardan and was banished to the Void. Elzon brought him back in the Second Age; in the Third Age he was too weak to leave the Dead Lands. | *Volgan*, *The Return of Volgan*, *Volgans Dead Lands* |
| In the Fourth Age he has recovered enough to retake Mirolon and march north with an army greater than any since the First Age. | *The Fourth Age of Erdae*, *War of the Last Crowns* |
| His hosts fight Zol's dead before the two powers briefly align against Eindil and the surviving kingdoms. | *War of the Last Crowns*, *The Fourth Age of Erdae* |
| Volgan strikes Eindil down once. Restored by the New Gods, Eindil pierces him with Horos's sword; his manifested body breaks and his army loses much of its supernatural organisation. | *Volgan*, *Fourth Age Canon Register* |
| Whether Volgan's spirit survives is **open**. | *Volgan*, *Canon Policy*, *Open Questions* |
| Seat Nafeher; Southern Dominion of Demon, Dolon and Nezer; rival Mirolon (working table). | *Great Powers and Relations* |
| The Nether, in the south of the Dead Lands, is the seat of the King of Demons. His name, powers and relationship to Volgan are **open**. Not all demons serve Volgan. | *Nether*, *King of Demons* |
| The Abyss is in the Dead Lands. Roka, of a rhinoceros-headed people, is tied to it and to the Necklace of the Abyss, which Afrit's thief took. Roka's fate and his people's name are **open**. The Abyss, the Nether and the Void are distinct. | *Abyss*, *Roka* |
| Volgan wants Glo. | *Kingdoms Factions and Conflicts* |
| The dead of the Dead Lands and the dead of Zol's Mistake have no settled taxonomy or relationship. | *Volgans Dead Lands*, *Zols Mistake* |
| "Children of Volgan" is one of three alternative endings: Volgan dominates a ruined world through monsters, grave hosts and client states. | *Possible Endings* |
| At the start Volgan has rebuilt his armies for a century and means to take Mirolon and march north; only Mirolon's scouts take the signs seriously. Mirolon, the human kingdom Volgan conquered in the First Age, is free again and stands in his way. | *The Campaign of 4A 1748*, *Volgans Dead Lands* |
| Mirolon lies in the Dead Lands region; its political status differs between ages. | *Volgans Dead Lands* |
| The start: the Golden King reigns, Eindil has not appeared, Afrit is unrevealed, Erdae seems at peace. | owner, 18 October 2026 |

### Proposed (this spec or the vault's proposed notes)

- Dates: Volgan's strength returns about 4A 1650, when Demon, Dolon and Nezer swear to him; Mirolon fortifies its passes; a Mirolonese envoy is laughed out of Parim in 4A 1736 (vault *Fourth Age Chronology*, proposed). The 1755 reconquest and 1757 destruction dates are proposed.
- Every mechanism below: dominion strength numbers, the Veil of Storms, grave musters, member oaths, the Nether pact, Abyss envoys, Dark Lands pacts, Mirolon's proof and passes, the Black Compact, the Silent Throne and the Steward.
- Names: the Veil of Storms, the Black Compact, the Silent Throne, the Ember Herald, the Grave-Warden, Ghorvak of the Hundred Clubs, the Warden League, High Warden Maeric, Captain Selda Varrow, Scout-Master Hadric Thorne. All proposed.
- Mirolon's government: a free human realm whose High Warden is chosen for life by the pass-lords and lake towns. This reconciles the vault's "human kingdom" with the map's Light ideology and `zin_light_wardens` stance. Proposed; owner's short list question 7 ([OPEN_QUESTIONS.md](../OPEN_QUESTIONS.md)), the work proceeds on it.
- The passes lie on Mirolon's border with Volgan's realm (the vault's "northern passes" read as Mirolon's passes toward the Dead Lands). Proposed; owner's short list question 7.
- The Nether is part of Volgan's realm on the map; the King of Demons' court is a pact Volgan deals with, not a country. Proposed; owner's short list question 5.

### The game today (commit ca01fa3)

- Volgan (9 states, Shadow, stance `zin_shadow_dread`, people `the_dead`) owns the Abyss and the Nether regions. Its capital state 299 ("Deadlands of Vez / Nan / … / Nether", capital "Neleelon") holds the only megalopolis on the map: a phase 1 defect ([../01_map/03_known_issues.md](../01_map/03_known_issues.md)) that the politics step fixes by giving the largest city to Parim. Nothing in this spec reads the state category or population; the strength numbers are tuned for Volgan's manpower after that fix. The seat is called Nafeher in text; renaming the capital to Nafeher is key-sites work ([../01_map/02_key_sites.md](../01_map/02_key_sites.md)).
- The Abyss is state 298 ("Vez Nan / Abyss"); the Nether shares Volgan's capital state 299 until the map step gives it its own state.
- Volgan's leader is today the generated ruler `<Volgan>_zin_ruler` named "Volgan"; the characters module moves him to the contract id `zin_volgan`, and this mechanic depends on that.
- Demon, Dolon and Nezer are Volgan's subjects; Mirolon (6 states, Light `zin_light_wardens`) and Herez (Aenor's subject) are free. Only ZIN tags and the dynamic tags exist.
- No mechanic module exists yet. Vanilla equipment and units still load (stage 2 replaces them), so the fallbacks below name vanilla `infantry` and `infantry_equipment` until then.

### Rules this spec keeps

- No text before `zin_afrit_revealed` names Afrit or calls the Deliverer a demon. Volgan's texts about the Abyss speak only of "a thief from the north".
- No text states whether Volgan's spirit survived, what the King of Demons owes Volgan, what became of Roka, or where Dardan lies.
- At the start nobody is at war. Nothing in this mechanic can start a war before 1 Deepwinter 4A 1750, and the AI waits for the War of the Last Crowns on the historical path.
- Decisions applied: R3 (Volgan's and Mirolon's start values and forces are this spec's, set by `zin_dominion.1`), O4 (the clash is this spec's `zin_dominion.13`; the Black Compact is offered once, by `zin_dominion.14`), O7 (the lieutenants and Mirolon's ruler are this spec's characters), E1 (arguments compile to `zin_arg_<name>`), E2 (`timeout_days = 30`; a timeout takes the first option), E4 (the pulse refreshes the two trees' layouts), R1 (rules in `RULE_GROUP_ZIN`, per-power rules start with `DEFAULT`).
- Every fixed date floor in this spec (1750.1.1, 1753.3.1, 1754.1.1, 1755.4.1, 1765.3.1) is read through the story pace (decision V4): the builder writes each floor as a scripted trigger `zin_dominion_after_<yyyy_mm>` with the three shifted dates of [../03_gameplay/06_historical_path_and_ai.md](../03_gameplay/06_historical_path_and_ai.md) (start + (d − start) × `global.zin_story_pace`).

## Design

### Phases

| Phase | Historical (proposed) | What happens | Ends when |
| --- | --- | --- | --- |
| 1. Hidden rebuilding | 4A 1748 to 1755 | Volgan raises strength in secret; Mirolon watches | Volgan declares war on Mirolon |
| 2. Reconquest of Mirolon | 1755 | War in the passes | Mirolon falls, holds, or makes peace |
| 3. The march north | late 1755 to 1757 | Volgan invades the Middle Lands; clashes with Zol's dead | Eindil returns |
| 4. The Black Compact | 1757 | Volgan and Zol stop fighting each other | Volgan's body is destroyed or Zol withdraws |
| 5. The broken body | 1757 to 1760 | The Silent Throne: the Dominion without its master | Peace, or the end of the game |
| Alternative | any | Children of Volgan: Volgan holds Parim with his body intact | World systems declare the ending |

### 1. Dominion strength

`zin_dominion_strength` (shared contract, Volgan, 0 to 100) is the readiness of the Southern Dominion's hosts. Volgan sees it in the Dominion panel; other countries never see the number.

**Start:** 45.

**Monthly change** (the Dominion pulse `zin_dominion_monthly_volgan`, run from `on_monthly` in Volgan's scope):

| Source | Change per month |
| --- | ---: |
| Base recovery | +0.15 |
| Each Dominion member with `zin_dominion_oath` ≥ 50 | +0.05 (max +0.15) |
| Spirit `zin_volgan_dominion_tribute` | +0.05 |
| `zin_nether_pact` ≥ 40 | +0.1 |
| Each Dark Lands country with `zin_volgan_pact` ≥ 2 | +0.05 (max +0.15) |
| At war (any) | −0.5 |
| At war and `surrender_progress` > 0.3 | −0.5 more |
| `zin_volgan_body_destroyed` | no recovery; capped at 40 |

**Diminishing returns:** while strength is above 75, every gain (monthly or one-off, except the Great Muster and Mirolon's fall) is halved. The hosts are near their peak.

**One-off changes:** grave musters (+2 to +10), focuses (listed in the tree), Mirolon falls (+10), Mirolon holds the passes for a year (−15), Volgan loses Nafeher (−20), body destroyed (set to the lower of the current value and 25).

**Effect:** a dynamic modifier `zin_dominion_hosts` (added at start, icon `GFX_idea_zin_grave_host`) whose values are Volgan variables set from strength *S* by `zin_volgan_refresh_strength`, followed by `force_update_dynamic_modifier = yes`:

| Modifier | Value | At S = 100 |
| --- | --- | ---: |
| `army_org_factor` | 0.0015 × S | +0.15 |
| `army_morale_factor` | 0.002 × S | +0.20 |
| `recruitable_population_factor` | 0.005 × S | +0.50 |
| `training_time_army_factor` | −0.002 × S | −0.20 |

**Thresholds** (scripted triggers):

| S | Trigger | Unlocks |
| ---: | --- | --- |
| 30 | `zin_volgan_hosts_stirring` | Second-tier grave musters |
| 50 | `zin_volgan_hosts_ready` | War with Mirolon (with an open war) |
| 70 | `zin_volgan_great_host` | Break the Veil early; the March North (the AI under `zin_rules_is_historical` needs only 60 after 1 Rainwake 1755) |
| 85 | — | Focus "A Host Greater Than the First Age" |
| 60 | `zin_volgan_children_ready` (part) | Children of Volgan ending, with other conditions |

### 2. The Veil of Storms

`zin_volgan_veil` (new, Volgan, 0 to 100) measures how well the storms, heat and silence of the Dead Lands hide the rebuilding. Everyone knows Volgan exists. The veil hides how strong he has become.

**Start:** 85.

**Monthly:** +1.5 while not at war, below 85, and no grave muster in the last 30 days; +0.5 more with spirit `zin_volgan_storm_rites`.

**Lowered by:** grave musters (−1 to −2, none for "Muster Beneath the Storms"), visible focuses (claims, wargoals), Mirolon's scouting (−3 to −5), Mirolon's proof reaching 75 (−10). **Set to 0** by Break the Veil, the Great Muster or the March North.

**Thresholds.** Each crossing downward fires once (country flags `zin_volgan_veil_70`, `_50`, `_30`). Every change through `zin_volgan_add_veil` also sets the global mirror `global.zin_volgan_veil_band` (0 Hidden, 1 Rumoured, 2 Suspected, 3 Seen), which Mirolon's Watch panel shows ([../07_interface/01_interface.md](../07_interface/01_interface.md)):

| Veil | State | Consequence |
| --- | --- | --- |
| ≥ 70 | Hidden | No Gathering Dark from Volgan's preparations. This mechanic adds no AI strategy against Volgan to any other country. |
| 50–69 | Rumoured | Event `zin_dominion.2` to Mirolon, Herez and the free Dead Lands realms. `zin_world_add_gathering_dark` +2. |
| 30–49 | Suspected | Mirolon's proof gains are doubled (from here down, also while Seen). The two heeding options of `zin_dominion.5` get their AI weight ×1.25. Gathering Dark +3. |
| < 30 | Seen | News event `zin_dominion.4` "The Dead Lands Are Arming" to every country. Gathering Dark +5. Volgan cannot get "Out of the Storms". |

**Surprise.** When Volgan declares war on Mirolon:

- Veil ≥ 50: Volgan gets `zin_dominion_out_of_the_storms` for 120 days (180 with spirit `zin_volgan_patience_of_ages`). If Mirolon's passes are below 60, Mirolon gets `zin_dominion_caught_unready` for 90 days.
- Veil < 30: Mirolon gets `zin_dominion_forewarned` for 180 days.

### 3. Grave musters

Decision category `zin_dominion_grave_musters` (Volgan only). Opened by focus "The Grave-Fields of the South" (flag `zin_volgan_musters_open`). Every muster adds 1 to `zin_volgan_musters` and sets the timed country flag `zin_volgan_mustered` for 30 days (stops veil recovery). Command power costs are a `custom_cost_trigger` (`command_power` ≥ the cost) plus `add_command_power` = −cost in the effect.

| Decision | Requires | Cost | Effect | Cooldown |
| --- | --- | --- | --- | --- |
| Wake the Old Barrows | musters open | 50 PP | Strength +2, manpower +5,000, veil −2 | 180 days |
| Muster Beneath the Storms | strength ≥ 30, veil ≥ 40 | 75 PP | Strength +3, no veil loss | 365 days |
| Raise a Grave Host | strength ≥ 30 | 40 PP, 10 command power | 2 "Grave Host" divisions at Nafeher, veil −1 | 90 days |
| Bind the Restless | at war, flag `zin_volgan_bind_open` (focus "Bind the Restless") | 50 PP | Strength +3 | 90 days |
| Wake the Old Battlefields | `zin_volgan_marches`, flag `zin_volgan_battlefields_open`, controls ≥ 4 Middle Lands states (`zin_dominion_is_middle_lands_state`) | 100 PP, 20 command power | 3 Grave Host divisions in the controlled Middle Lands state with the most Volgan divisions, strength +5 | 365 days |

"Grave Host" divisions use the template created by `zin_volgan_spawn_grave_host` (`division_template` when `has_template = "Grave Host"` is false; `create_unit` inside the target state's scope). The template is 8 battalions of vanilla `infantry` until warfare stage 2, then 8 battalions of the warfare spec's `zin_the_dead_revenant` (Grave Host, [../03_gameplay/01_warfare.md](../03_gameplay/01_warfare.md)); the module picks `zin_the_dead_revenant` when the staged tree defines it and `infantry` otherwise, and the build test asserts that the chosen sub-unit is defined. The text calls them grave hosts and never says whether they are the same kind of dead as Zol's.

### 4. The Southern Dominion

Demon, Dolon and Nezer are Volgan's subjects at the start (roster), with the diplomacy spec's autonomy state `zin_autonomy_sworn_realm`. The Southern Dominion is Volgan's faction (template `zin_faction_southern_dominion`, [../03_gameplay/03_diplomacy_and_factions.md](../03_gameplay/03_diplomacy_and_factions.md)).

`zin_dominion_oath` (new, each member, 0 to 100): how firmly the member holds to Nafeher. **Start:** Demon 60, Dolon 55, Nezer 50.

- Drift: −0.2 per month unless Volgan took "Summon the Dominion" in the last 180 days.
- Decisions (category `zin_dominion_court`; "Summon the Dominion" is open from the start, the other two need focus "Hold Court at Nafeher", flag `zin_volgan_court_open`):

| Decision | Cost | Effect | Cooldown |
| --- | --- | --- | --- |
| Summon the Dominion | 25 PP | Oath +10 for every member | 180 days |
| Demand Tribute of [member] | — | Strength +2, that member's oath −8 | 120 days per member |
| Grant Spoils to [member] | Volgan owns a non-core state | `transfer_state` of one owned non-core state to the member, oath +20 | 365 days (180 with the tree's flag `zin_volgan_spoils_promised`) |

- Oath ≥ 50: the member counts toward monthly strength, and Volgan calls it into each of his wars at once (`add_to_war`; the sworn-realm autonomy cannot decline). With the Volgan tree's flag `zin_volgan_war_council` (*The War-Council*) every member is called whatever its oath, and the members' AI never seeks its own road while the flag holds.
- Oath < 25: event `zin_dominion.22` "The Oath Falters" for the member: renew the oath (oath +15, member loses 50 PP) or seek its own road (country flag `zin_dominion_own_road`, read by the members' trees; timed idea `zin_dominion_seeking_own_road` for 365 days with `autonomy_gain = 0.5`; Volgan −5% stability). Members' own trees (tier B: `regional_demon`, `regional_dolon`, `regional_nezer`, [../05_focus_trees/regional/dead_lands.md](../05_focus_trees/regional/dead_lands.md)) read the oath.
- When Volgan's body is destroyed: every member's oath −30, then `zin_dominion.18` "Old Allegiances" for each member: oath ≥ 40 stays; otherwise the member breaks free (Volgan `end_puppet`, `remove_from_faction`).

### 5. The Nether and the King of Demons

The King of Demons is not a country on the map today (see [01_map_accuracy.md](../01_map/01_map_accuracy.md), K4): the Nether lies in Volgan's realm (owner's short list question 5, proposal adopted). He is modelled as a court Volgan deals with, not as Volgan's subject, and never appears as a character (proposed; owner question "volgan and mirolon" 8).

`zin_nether_pact` (new, Volgan, 0 to 100): how far the Nether's court will send Netherborn to Volgan's wars. **Start:** 20.

Volgan chooses an approach in his tree (mutually exclusive):

- **Bargain** (flag `zin_volgan_nether_bargain`): slow and safe; the pact can reach 100.
- **Bend** (flag `zin_volgan_nether_bent`): quick manpower now; spirit `zin_volgan_nether_unrest` for a year; the pact is capped at 75 (enough for the gate pact, never the full bargain).

| Pact | Effect |
| ---: | --- |
| 40 | Strength +0.1 per month; focus "Netherborn Companies" available |
| 70 | Flag `zin_volgan_gate_pact`: Nether Gate decisions at war |

**Nether Gate** (state-targeted decision, category `zin_dominion_court`, at war, gate pact): target an enemy-controlled state that borders a state controlled by Volgan or one of his subjects. Cost 50 PP (0 for the next two uses after the tree's flag `zin_volgan_free_gates`) and 2 pact; cooldown 60 days. Effect in the state's scope: `damage_building = { type = infrastructure damage = 2 }`, `add_resistance = 10` if the state is occupied by its owner's enemy, and the state dynamic modifier `zin_dominion_gate_scars` for 90 days (`add_dynamic_modifier` with `days = 90`: `local_manpower` −0.25, `state_production_speed_buildings_factor` −0.25). Event `zin_dominion.21` reports the raid. This echoes the Second Age portal raids without saying who opened the gates.

Texts call the arrangement "the bargain of this reign". They never say what the King of Demons owes Volgan by right.

### 6. The Abyss

The Abyss is a site (`zin_is_site_abyss`), not a country. Volgan can send envoys down into it (tree branch "The Abyss"). The tree's hidden event `zin_volgan.8` fires one of its outcome events `zin_volgan.9`–`.11` with fixed weights ([../05_focus_trees/major/volgan.md](../05_focus_trees/major/volgan.md)):

| Outcome | Weight | Effect |
| --- | ---: | --- |
| The depths answer | 50 | Flag `zin_volgan_abyss_answered`: focuses "Abyss-Born Companies" and "Lords of the Deep" open |
| The depths are silent | 35 | 25 PP refunded; may try again after 365 days (decision "Descend Again") |
| The depths answer in wrath | 15 | Strength −2, 40 PP lost; may try again after 365 days |

**Descend Again** (decision, category `zin_dominion_court`, defined here): visible once the focus "Descend into the Abyss" is complete and `zin_volgan_abyss_answered` is not set; available while the timed country flag `zin_volgan_abyss_wait` (365 days) is absent; 50 PP; fires `zin_volgan.8` again and sets the wait flag. The flag is set by scripted effect `zin_volgan_abyss_wait`, which the tree's outcome options `.10` and `.11` call (their "Descend Again after 365 days").

The people of the Abyss are called "the Abyss-folk" (descriptive, proposed; their name is open). Texts never say whether Roka lives, rules or guards anything now. Volgan learns only that "a thief from the north" once robbed the Abyss.

### 7. The independent Dark Lands

Volgan's agents court the Dark Lands; most answer only to themselves.

`zin_volgan_pact` (new, each Dark Lands country, 0 to 3): 0 none, 1 envoys received, 2 Pact of Spoils, 3 Sworn to Nafeher.

**Decision "Send Envoys to [country]"** (targeted, category `zin_dominion_court`, flag `zin_volgan_envoys_open` from focus "Voices to the Dark Lands"): any Dark Lands country (`zin_dominion_is_dark_lands_country`: roster region Dark Lands) that is not Volgan's subject and is not at war with Volgan. Cost 25 PP (15 with the tree's flag `zin_volgan_envoys_cheap`); takes 30 days (`days_remove = 30`); cooldown 180 days per target. On completion the target gets `zin_dominion.8` "Envoys from Nafeher" with the offer level in the event's target variable `zin_volgan_offer_level`:

- Accept: pact raised to the offer level if lower; Volgan opinion +20 (opinion modifier `zin_volgan_envoys_received`). Volgan gets `zin_dominion.9`.
- Refuse: pact unchanged; at pact 0, opinion −20 (`zin_volgan_envoys_refused`). Volgan gets `zin_dominion.9`.

Offer levels: the envoy decision and `zin_volgan_court_dark_lands` offer level 1; `zin_volgan_tree_offer_spoils` (defined here, called by the tree's focus "The Pact of Spoils", which also sets `zin_volgan_pact_of_spoils`) offers level 2 to every country at pact 1; `zin_volgan_tree_offer_oath` (defined here, called by the focus "Sworn to Nafeher") offers level 3 to the three countries at pact 2 with the highest opinion of Volgan. Nothing else raises a pact to 3 (the Dark Lands spec's `zin_dark_add_volgan_pact` never does).

**AI acceptance** (base 20):

| Condition | Factor |
| --- | ---: |
| People orcs or trolls (`zin_people_orcs`, which includes goblins today, or `zin_people_trolls`) | ×2 |
| Ideology Shadow or Dominion | ×2 |
| Ideology Light | ×0 |
| At war with a country Volgan is also at war with | ×2 |
| Goldoroth | ×0.5, replaced by the Dark Lands spec's triggers: ×0 with `zin_goldoroth_refuses_masters`, ×4 with `zin_goldoroth_seeks_the_south` |
| The Dark Lands spec's hold factors (`zin_dark_hold_under_cocanoor`, `zin_dark_hold_in_moot`, `zin_dark_hold_fears_cocanoor`, `zin_dark_took_southern_gifts`, `zin_dark_hold_at_war_with_goldoroth`) | as that spec tables ([dark_lands.md](dark_lands.md), section 7) |
| Dondor | ×0.1 |
| `zin_volgan_body_destroyed` | ×0 |

Under `zin_rules_is_historical` the factors stay as tabled: the vault says most holds refuse, and the table produces that.

- Pact 2: the country grants Volgan military access when `zin_volgan_marches` is set (`give_military_access`) and may send volunteers.
- Pact 3: the country joins the Southern Dominion faction when the march begins (`add_to_faction`; the diplomacy spec's `zin_faction_rule_join_sworn` admits Dark Lands capitals). At most three Dark Lands countries may be sworn.
- When Volgan's body is destroyed, every pact falls by 2 (floor 0).

### 8. Mirolon's watch and the passes

Mirolon is the only power that takes the danger seriously at the start. Two variables (new, Mirolon scope):

- `zin_mirolon_proof` (0 to 100): evidence of Volgan's arming that a court cannot laugh away. **Start:** 15.
- `zin_mirolon_passes` (0 to 100): readiness of the forts on the passes between Mirolon and Volgan's Dead Lands. **Start:** 30.

**Scouting** (decision category `zin_dominion_mirolon_watch`, Mirolon only, opened by focus "The Watch on the Passes", flag `zin_mirolon_watch_open`):

| Decision | Cost | Effect | Cooldown |
| --- | --- | --- | --- |
| Send Scouts South | 25 PP | `zin_mirolon_scout`: proof +5 through `zin_mirolon_add_proof` (which doubles it while the veil is below 50), veil −3. If veil ≥ 70: 30% chance of `zin_dominion.6` "Scouts Lost" instead (proof +1 only, Mirolon −10 PP, veil unchanged) | 90 days |
| Send Word to Parim | 50 PP, proof ≥ 25 | Event `zin_dominion.5` to the ruling Aenor realm (`zin_aenor_is_realm`) | 365 days |
| Raise the Pass Forts | 50 PP | Passes +10 | 120 days |

Volgan's counter: decision **Silence the Watchers** (Volgan, category `zin_dominion_court`, flag `zin_volgan_silence_open` from focus "Silence the Watchers", 50 PP, cooldown 180 days): Mirolon's proof −5, veil +3; Mirolon gets `zin_dominion.7` "Scouts Found Dead".

**Proof thresholds** (each fires once; Mirolon country flags `zin_mirolon_proof_25`, `_50`, `_75`):

| Proof | Effect |
| ---: | --- |
| 25 | Herez and the free Dead Lands realms get `zin_dominion.3` "Mirolon's Fears"; opinion of Mirolon +10 |
| 50 | Aenor's heeding options in `zin_dominion.5` gain weight (their weights read proof); Lost Cause frontier companies may answer (Aenor spec) |
| 75 | News event `zin_dominion.27` "Mirolon's Proof"; Gathering Dark +3; veil −10; Mirolon loses the tree's spirit `zin_mirolon_unheeded_warnings` |

**Mirolon's warning to Parim** (`zin_dominion.5`, to Aenor). Options and AI weights:

| Option | Effect | AI weight |
| --- | --- | --- |
| "Volgan is a nursery tale." (the Golden Court laughs) | Aenor +10 PP; Mirolon opinion of Aenor −15 (opinion modifier `zin_mirolon_parim_laughed_opinion`); Mirolon country flag `zin_mirolon_parim_laughed` | 100 × (1 + `zin_court_corruption` / 50); +50 if Volgan has the tree's flag `zin_volgan_whispers_parim` |
| "Let the Lost Cause send its frontier companies." | `send_equipment` of 1,000 `infantry_equipment` (the warfare spec's arms after stage 2) to Mirolon and timed spirit `zin_dominion_heeded_warning` (365 days); Aenor −25 PP | 20 + proof |
| "Aenor guarantees Mirolon." | `give_guarantee = <Mirolon>`; Gathering Dark +2 | proof − 40 (min 0); ×3 when sent by Mirolon's focus "The North Listens" |

On the historical path the Golden Court laughs, as it did in 4A 1736: under `zin_rules_is_historical` the first option has weight 100 and the others 0, as the historical-path spec rules for story choices.

**Passes.** The pass states are `zin_is_site_mirolon_passes`: Mirolon core states that border a Volgan core state. Mirolon stores the fort level it has built in `zin_mirolon_fort_level`. `zin_mirolon_raise_pass_forts` computes the target level floor(passes / 20) + 1, capped at 6, and for each missing level runs `add_building_construction = { type = bunker level = 1 instant_build = yes province = { all_provinces = yes limit_to_border = yes } }` in every pass state Mirolon controls. Forts are never removed when passes fall. At the start (passes 30) the startup effect raises the forts to level 2. At war with Volgan, passes ≥ 80 and proof ≥ 50 give Mirolon `zin_dominion_hold_the_passes`.

**Holding.** If Mirolon is at war with Volgan for 365 days and Volgan controls no pass state, flag `zin_mirolon_holds` is set. Volgan loses 15 strength and gets `zin_dominion_march_stalls` for 365 days. This is an alternative outcome, not history.

### 9. The reconquest of Mirolon

**A war may begin** when `zin_volgan_war_open` is true:

- global flag `zin_war_of_last_crowns` (world systems; 1 Rainwake 4A 1755 on the historical path), or
- country flag `zin_volgan_veil_broken` (Volgan's own choice, focus "Break the Veil": not before 1 Deepwinter 1750, strength ≥ 70, not at war).

and strength ≥ 50.

- **War goal:** `annex_everything` on Mirolon (focus "The Old Conquest"). Volgan already claims Mirolon after "The Old Claim on Mirolon". The declaration is the AI's or the player's (`declare_war_on`); this mechanic never declares it.
- **On war start:** `on_declare_war` (ROOT Volgan, FROM Mirolon) fires `zin_dominion.10` "Out of the Storms", which applies the surprise rules above. Volgan calls every member with oath ≥ 50 into the war.
- **Mirolon falls** when it capitulates or Volgan controls its capital and every pass state: `zin_dominion.11` sets global flag `zin_mirolon_fallen`, strength +10, all member oaths +10, Gathering Dark +5.
- **Exile.** If Mirolon has the tree's flag `zin_mirolon_exile_ready` (focus "The Exile Court"), `on_capitulation_immediate` (ROOT Mirolon) makes it a government in exile (`become_exiled_in = { target = <host> legitimacy = 60 }`) in Herez if Herez exists and is not at war with Volgan, else the ruling Aenor realm, else the Gala Elves, and fires `zin_dominion.24`.
- After the war Volgan may hold Mirolon with a dead garrison or make it a client crown (Volgan tree).
- **Client crowns.** Decision "Make a Client Crown" (targeted, category `zin_dominion_court`, flag `zin_volgan_client_crowns` from the focus "Client Crowns"): for any capitulated or annexed realm of the Middle Lands or Dead Lands whose capital Volgan controls. Cost 100 PP; cooldown 90 days. Calls `zin_volgan_make_client` (`release_puppet` for an annexed realm, `puppet` for a capitulated one, then `set_autonomy` to `zin_autonomy_sworn_realm`). Client crowns count toward `zin_volgan_children_ready`.
- **Tributary friends.** Volgan's AI declares no war before `zin_volgan_marches` on a realm with the country flag `zin_dominion_tributary_friend` (set by the Dead Lands trees' tribute events) and, when the march begins, sends it `zin_dominion.28` "Terms from Nafeher" instead of planning conquest: "Kneel as a client crown." (`zin_volgan_make_client`; AI 60) / "We paid for quiet, not chains." (the flag is cleared; AI 40).

### 10. The march north

`zin_volgan_begin_march` (focus "The March North"; requires `zin_volgan_mirolon_taken` (`zin_mirolon_fallen`, or Mirolon a Volgan subject, or Mirolon gone), and `zin_volgan_great_host`):

1. Global flag `zin_volgan_marches`; veil 0; Gathering Dark +10; news `zin_dominion.12` "The March North".
2. War goals (`create_wargoal`, type `annex_everything`) on Herez and on the country that controls Parim (`zin_volgan_wargoal_parim`: the ruling Aenor realm, or whoever holds the `zin_is_site_parim` state). Volgan declares war at once on the Parim holder (`declare_war_on`); Volgan calls every member with oath ≥ 50 into it.
3. Sworn Dark Lands countries (pact 3) join the faction; Pact of Spoils countries (pact 2) grant military access.
4. Remove the tree's spirits `zin_volgan_veil_of_storms` and `zin_volgan_storm_rites`.
5. If country flag `zin_volgan_abyss_march` is set (focus "Lords of the Deep"), spawn two "Abyss Host" divisions at Nafeher (template "Abyss Host": 6 battalions of vanilla `infantry` until warfare stage 2, then 6 of the warfare spec's Abyss-folk sub-unit `zin_abyss_folk` ([../03_gameplay/01_warfare.md](../03_gameplay/01_warfare.md) §4.3 and §4.9a; ogre-brute stats until drawn); the division name and text say "Abyss Host" and never "ogres"). If the march has already begun when the flag is set, the next monthly pulse spawns them.
6. Every realm with `zin_dominion_tributary_friend` gets `zin_dominion.28`.

**The northern front** (`zin_volgan_raise_northern_front`, focus "A Second Front in the North"): every sworn Dark Lands country (pact 3) gets a war goal (`create_wargoal`, type `take_state`, generator: one bordering state of Dondor or of a Concord dominion) and grants Volgan military access. Countries with no such neighbour get 20 army experience instead.

**Volgan takes the field** (`zin_volgan_take_field`, focus): `add_field_marshal_role` for `zin_volgan` (skill 6, attack 6, defence 4, planning 4, logistics 3; trait `zin_trait_great_spirit_in_arms`: `army_attack_factor` +0.1, `army_org_factor` +0.1 for his army). The engine never kills generals in battle; only `zin_volgan_destroy_body` removes his roles.

### 11. Zol: the clash and the Black Compact

Zol's side belongs to the Zol's Mistake spec ([zols_mistake.md](zols_mistake.md)). This spec defines Volgan's side and the shared flags. The truce's flag is `zin_black_compact` (decision N2).

- **The clash.** When `zin_volgan_marches` and `zin_zol_rising` are both set, Volgan and Zol are not at war with each other, `zin_volgan_zol_clash` is not set, and a state Volgan controls borders a state Zol controls, event `zin_dominion.13` "The Dead Against the Dead" fires for Volgan: "Then we break them too." Volgan declares war on Zol (`create_wargoal` type `take_state` on the bordering state, then `declare_war_on`; no annexation goal). AI 100 under `zin_rules_is_historical`, else 80; the other option "Not yet." does nothing and the event can fire again after 90 days. This is the only clash event (decision O4; Zol has none of its own). A player Zol may still strike first through the Zol spec's `zin_zol_strike_volgan`; whoever declares, the Volgan pulse sets the global flag `zin_volgan_zol_clash` the first month Volgan and Zol are at war with each other, so the flag means the same thing on every route. Each side's AI fights the other while both fight the living.
- **The Black Compact.** When `zin_eindil_returned` is set and both Volgan and Zol are at war with the country that has character `zin_eindil` (`has_character = zin_eindil`), Volgan's focus "The Black Compact" (helper `zin_volgan_tree_offer_compact`) sends the one offer, the hidden event `zin_dominion.14`, to Zol; its immediate effect fires Zol's answer, the Zol spec's `zin_mistake.16` "The Brief Accord" (decision O4; options, AI and effects are the Zol spec's). If Zol accepts: `white_peace` between them, `give_military_access` both ways, global flag `zin_black_compact`, and Volgan gets `zin_dominion.15`. They do **not** join one faction: the vault says they never settled on common command. The compact is active while `zin_black_compact` is set and `zin_black_compact_ended` is not, whichever event set it.
- **The Compact ends** when `zin_volgan_body_destroyed` or `zin_zol_withdrawn` is set while the compact is active: `zin_dominion.23` (to Volgan and Zol, once) sets global flag `zin_black_compact_ended`, revokes access both ways (`diplomatic_relation = { relation = military_access active = no }`) and removes the tree's spirit `zin_volgan_two_darks`. Neither side declares war on the other automatically.

### 12. Eindil and the broken body

The Eindil's journey spec owns the duels: when and where Eindil and Volgan meet ([eindil_journey.md](eindil_journey.md), stage 9). This spec provides Volgan's side.

- **First duel** (historical 1 Highsun 1757): the journey's event `zin_eindil.96` "Volgan at the Southern Front" fires `zin_dominion.16` "Then I Will Bury Them Together" for Volgan in its immediate effect. Volgan gets timed spirit `zin_dominion_champion_falls` (180 days) and global flag `zin_volgan_struck_down_eindil`. The journey spec then runs the New Gods' restoration.
- **Second duel** (historical 1 Harvest 1757, after the restoration): the journey's `zin_eindil.100` "The Blue Sword Through Volgan" calls `zin_volgan_destroy_body`.

`zin_volgan_destroy_body` (does nothing if `zin_volgan_body_destroyed` is already set):

1. Global flag `zin_volgan_body_destroyed`; news `zin_dominion.17` "The Body Breaks".
2. `remove_country_leader_role` (ideology `zin_shadow_dread`) and `remove_unit_leader_role` from `zin_volgan`. The character is not killed or retired: his fate is not stated.
3. The Ember Herald (`zin_volgan_ember_herald`) becomes country leader as Steward of Nafeher (`add_country_leader_role`, ideology `zin_shadow_dread`, `promote_leader = yes`); country flag `zin_volgan_silent_throne`.
4. Strength set to the lower of current and 25; recovery stops; cap 40.
5. In every state Volgan controls and every state bordering one: `damage_units = { state = THIS limit = { tag = <Volgan> } org_damage = 0.5 str_damage = 0.25 ratio = yes army = yes }`.
6. Timed spirit `zin_dominion_broken_host` (365 days), then `zin_dominion_silent_throne` (permanent until the tree's "What Remains of Volgan" removes it). Removes the tree's spirits `zin_volgan_host_of_first_age`, `zin_volgan_one_dominion`, `zin_volgan_gates_opened` and `zin_volgan_two_darks`.
7. Member oaths −30 and `zin_dominion.18` for each member; Dark Lands pacts −2.
8. Gathering Dark −10 (`zin_world_add_gathering_dark`).
9. `mark_focus_tree_layout_dirty` so the Silent Throne branch appears.
10. If the compact is active, `zin_dominion.23`.
11. If Volgan is AI: 30 days later `zin_dominion.26` "The Steward Asks for Peace" to every enemy that is not a roster Dead Lands country (not Zol, not Mirolon, whose case is `zin_dominion.19`): "Peace, then." (`white_peace` with Volgan; AI 80, 100 under `zin_rules_is_historical`) / "Finish what the sword began." (AI 20, 0 under `zin_rules_is_historical`).

**What remains.** Event texts say only that his body broke and that "what remains of Volgan, no one living can say". The Steward rules "in a name that does not answer". The game rule `zin_rule_volgan_spirit` controls sandbox play:

| Option | Effect |
| --- | --- |
| Unresolved (default) | Nothing returns. No event says the spirit died or lived. |
| A stirring (non-canon sandbox) | From 1 Thaw 1765, checked yearly with a 10% chance: `zin_dominion.25` "A Stirring in Nafeher" restores `zin_volgan` as country leader without a body, strength set to 30 and the cap lifted. The text opens "In this telling of the age" and never says that his spirit survived the sword. Its trigger contains `has_game_rule = { rule = zin_rule_volgan_spirit option = STIRRING }`, so it can never fire with the default rule. |

Whether this sandbox option should exist at all is the owner's question "volgan and mirolon" 7 ([OPEN_QUESTIONS.md](../OPEN_QUESTIONS.md)); the work proceeds on it, default off.

**The Steward and Mirolon.** If Volgan holds Mirolon's states when the body breaks, `zin_dominion.19` asks the Steward: "Let Mirolon go" (release Mirolon, or end its exile by `transfer_state` of its cores back to it; white peace with Mirolon; proposed historical choice, owner question "volgan and mirolon" 4) or "Hold what we took" (keep; `add_resistance` 15 in Mirolon's cores).

### 13. Children of Volgan

`zin_volgan_children_ready` (scripted trigger): Volgan exists; not `zin_volgan_body_destroyed`; Volgan or one of its subjects controls the Parim state (`zin_is_site_parim`); Volgan has at least four subjects; strength ≥ 60; not `zin_eindil_crowned`.

The Volgan focus "The Children of Volgan" requires it and sets country flag `zin_volgan_children_proclaimed`. World systems ([03_gameplay/05_world_tension_and_endings.md](../03_gameplay/05_world_tension_and_endings.md)) check the trigger monthly from 1 Thaw 1756 and set `zin_ending_children_of_volgan`. This spec never sets an ending flag itself.

### Historical path (proposed dates)

| Date | Event | Flag or state |
| --- | --- | --- |
| 1 Thaw 1748 | Start: strength 45, veil 85, pact 20, proof 15, passes 30 | none |
| 1748 to 1754 | Musters, Dominion oaths, Nether bargain, Dark Lands envoys; Mirolon scouts; the Golden Court laughs | veil stays ≥ 50 |
| Rainwake 1755 | War of the Last Crowns; Volgan declares war on Mirolon | `zin_war_of_last_crowns` |
| Emberleaf 1755 | Mirolon falls | `zin_mirolon_fallen` |
| Mistfall 1755 | The march north | `zin_volgan_marches` |
| 1756 | Volgan in the Middle Lands; his hosts meet Zol's dead | `zin_volgan_zol_clash` |
| Thaw to Sowing 1757 | Eindil returns (checkpoint 19, from 1 Thaw); the Black Compact | `zin_black_compact` |
| 1 Highsun 1757 | Volgan strikes Eindil down (journey `zin_eindil.96`) | `zin_volgan_struck_down_eindil` |
| 1 Harvest 1757 | The body breaks (journey `zin_eindil.100`; checkpoint 22); the compact ends; Zol manifests within 7 days (Zol spec) | `zin_volgan_body_destroyed`, `zin_black_compact_ended` |
| 1757 to 1758 | The Steward lets Mirolon go: the exiled Mirolon court returns to its cores; white peace | `zin_volgan_silent_throne` |

Checkpoint numbers are those of [../03_gameplay/06_historical_path_and_ai.md](../03_gameplay/06_historical_path_and_ai.md); checkpoint 15 (Mirolon falls, then the march) has its window 1755.11.1 to 1756.9.1.

## Implementation

### Builder

Everything below is written by one new content-builder module, **`tools/content/modules/mech_volgan_dominion.mjs`** (`buildVolganDominion(staged, countries)`, imported and called by `tools/content/build.mjs`), into the `Staged` set that `tools/content/apply.mts` applies in one transaction. It reads:

- `tools/content/data/countries.json` (politics step output): tags of Volgan, Mirolon, Demon, Dolon, Nezer, Herez, Goldoroth, Dondor, Zol and the ruling Aenor realm by name, capital states, and the roster regions (`scan`) "Dark Lands", "Dead Lands", "Rush Land" and "Rush Islands" (Middle Lands) for the region triggers;
- `tools/content/data/mechanics/volgan_dominion.json` (new): every number of this spec (start values, monthly rates, thresholds, costs, cooldowns, AI weights and schedule), the character definitions and the localisation text, so tuning never touches code.

Sites this spec reads (rows of the key-sites table, [../01_map/02_key_sites.md](../01_map/02_key_sites.md); resolved today as below):

| Site | Resolves to (today's map) |
| --- | --- |
| `zin_is_site_nafeher` | Volgan's `capitalState` (299) |
| `zin_is_site_nether` | state 299 (label "Nether"); moves when the map step gives the Nether its own state |
| `zin_is_site_abyss` | state 298 (label "Abyss") |
| `zin_is_site_mirolon_seat` | Mirolon's `capitalState` (76) |
| `zin_is_site_mirolon_passes` | list row: states owned by Mirolon that border a Volgan state |
| `zin_is_site_parim` | Aenor's `capitalState` |

This module defines no site trigger: the key-sites module `tools/content/modules/sites.mjs` resolves the rows of `tools/content/data/sites.json` into `common/scripted_triggers/zin_sites.txt` and runs before this module. Start-of-game setup is written in the module's own `common/on_actions/zin_dominion.txt` (on_actions merge in HOI4). Tests: `tools/content/mech_volgan_dominion.test.mjs`, added to the `npm test` script in `tools/package.json`.

### Files

| Path | Content |
| --- | --- |
| `common/scripted_effects/zin_dominion.txt` | Effects below |
| `common/scripted_triggers/zin_dominion.txt` | Triggers below, including `zin_is_volgan`, `zin_is_mirolon` (`original_tag`, read by the interface spec), the region triggers `zin_dominion_is_dark_lands_country`, `zin_dominion_is_dead_lands_country`, `zin_dominion_is_free_dead_realm` and `zin_dominion_is_middle_lands_state` (tag lists from `countries.json`), and the story-pace date floors `zin_dominion_after_<yyyy_mm>` |
| `common/decisions/zin_dominion.txt`, `common/decisions/categories/zin_dominion.txt` | Categories `zin_dominion_grave_musters`, `zin_dominion_court`, `zin_dominion_mirolon_watch` and their decisions |
| `common/dynamic_modifiers/zin_dominion.txt` | `zin_dominion_hosts` (country), `zin_dominion_gate_scars` (state, 90 days) |
| `common/ideas/zin_dominion.txt` | Mechanic spirits below |
| `common/opinion_modifiers/zin_dominion.txt` | `zin_volgan_envoys_received` (+20), `zin_volgan_envoys_refused` (−20), `zin_mirolon_parim_laughed_opinion` (−15); each decays 1 a month. `zin_dominion_mirolon_friendship` (+25, no decay; both ways between Mirolon and Herez, added by the Mirolon tree's `herez_friendship` event) |
| `common/unit_leader/zin_dominion_traits.txt` | `zin_trait_great_spirit_in_arms` |
| `common/characters/zin_dominion.txt` | The six proposed characters below (not `zin_volgan`, whom the characters module defines) |
| `common/game_rules/zin_dominion.txt` | The two rules below, in the ZIN rule group `RULE_GROUP_ZIN` |
| `common/on_actions/zin_dominion.txt` | `on_startup` → hidden event `zin_dominion.1`, which runs `zin_dominion_startup`: start values, `zin_dominion_hosts`, Mirolon's forts to level 2, veil band, the trees' start spirits (`zin_volgan_long_recovery` and `zin_volgan_storm_girt_realm` on Volgan; `zin_mirolon_long_watch` and `zin_mirolon_unheeded_warnings` on Mirolon; country histories come from the politics step) and High Warden Maeric as Mirolon's leader; `on_monthly` (`zin_dominion_monthly_volgan` in Volgan's scope, `zin_dominion_monthly_mirolon` in Mirolon's scope); `on_declare_war` (`zin_dominion.10`); `on_capitulation_immediate` (Mirolon's exile, Mirolon falls); `on_state_control_changed` (a pass state or Nafeher changes hands) |
| `events/zin_dominion.txt` | Namespace `zin_dominion` |
| `localisation/english/zin_dominion_l_english.yml` | All text (`staged.loc('zin_dominion', …)`), UTF-8 with BOM |

The tree files (`zin_volgan.txt`, `zin_mirolon.txt`) come from the focus compiler. Events of the trees use namespaces `zin_volgan` and `zin_mirolon`; the mechanic uses `zin_dominion` so the two never collide. The start values that the Volgan and Mirolon trees list under "History" are set here, at `on_startup`, and nowhere else.

This mechanic replaces no interim stub: the interim Long Peace tree, `zin_world` and the interim decision category stay until their own specs replace them.

### Variables

| Variable | Scope | Range | Start | Meaning |
| --- | --- | --- | --- | --- |
| `zin_dominion_strength` | Volgan | 0–100 | 45 | Shared contract |
| `zin_volgan_veil` | Volgan | 0–100 | 85 | How hidden the rebuilding is |
| `zin_nether_pact` | Volgan | 0–100 | 20 | The Nether's willingness to send Netherborn |
| `zin_volgan_musters` | Volgan | 0+ | 0 | Musters held (statistic, panel) |
| `zin_dominion_oath` | Demon, Dolon, Nezer | 0–100 | 60 / 55 / 50 | Member loyalty |
| `zin_volgan_pact` | each Dark Lands country | 0–3 | 0 | Pact level with Volgan |
| `zin_mirolon_proof` | Mirolon | 0–100 | 15 | Evidence of Volgan's arming |
| `zin_mirolon_passes` | Mirolon | 0–100 | 30 | Readiness of the pass forts |
| `zin_mirolon_war_days` | Mirolon | 0+ | 0 | Days at war with Volgan without losing a pass state |
| `zin_mirolon_fort_level` | Mirolon | 0–6 | 2 | Fort level already built in the pass states |
| `zin_volgan_veil_band` | global | 0–3 | 0 | Veil band mirror for Mirolon's panel |
| `zin_dominion_org`, `zin_dominion_morale`, `zin_dominion_recruit`, `zin_dominion_training` | Volgan | — | from strength 45 | Values of `zin_dominion_hosts` |
| `zin_volgan_free_gates` | Volgan | 0–2 | 0 | Nether Gates left at no PP cost (set to 2 by the tree's flag) |
| `zin_volgan_offer_level` | event target | 1–3 | — | Pact level offered by `zin_dominion.8` |

All are clamped by the effects that change them.

### Flags

Global (set once, never cleared): `zin_volgan_marches`, `zin_volgan_body_destroyed` (shared contract); `zin_mirolon_fallen`, `zin_volgan_zol_clash`, `zin_black_compact`, `zin_black_compact_ended`, `zin_volgan_struck_down_eindil` (new).

Country, Volgan: `zin_volgan_veil_broken`, `zin_volgan_musters_open`, `zin_volgan_court_open`, `zin_volgan_silence_open`, `zin_volgan_whispers_parim`, `zin_volgan_abyss_march`, `zin_volgan_client_crowns`, `zin_volgan_battlefields_open`, `zin_volgan_seeks_glo`, `zin_volgan_mustered` (30 days), `zin_volgan_veil_70`, `zin_volgan_veil_50`, `zin_volgan_veil_30`, `zin_volgan_nether_bargain`, `zin_volgan_nether_bent`, `zin_volgan_gate_pact`, `zin_volgan_abyss_answered`, `zin_volgan_abyss_wait` (365 days), `zin_volgan_envoys_open`, `zin_volgan_silent_throne`, `zin_volgan_children_proclaimed`. Set by the Volgan tree and read here: `zin_volgan_bind_open`, `zin_volgan_spoils_promised`, `zin_volgan_envoys_cheap`, `zin_volgan_free_gates`, `zin_volgan_pact_of_spoils`, `zin_volgan_war_council`. The tree's start spirits are defined by the focus compiler and only added here.

Country, Mirolon: `zin_mirolon_proof_25`, `zin_mirolon_proof_50`, `zin_mirolon_proof_75`, `zin_mirolon_holds`, `zin_mirolon_exile_ready`, `zin_mirolon_parim_laughed`, `zin_mirolon_watch_open`. The Mirolon tree adds its own flags (listed in its spec).

Country, members and others: `zin_dominion_own_road` (member chose its own road in `zin_dominion.22`); `zin_dominion_tributary_friend` (set by the Dead Lands trees, read here).

### Scripted triggers

| Trigger | True when |
| --- | --- |
| `zin_volgan_hosts_stirring` | Strength ≥ 30 |
| `zin_volgan_hosts_ready` | Strength ≥ 50 |
| `zin_volgan_great_host` | Strength ≥ 70 (≥ 60 for the AI under `zin_rules_is_historical` after `zin_dominion_after_1755_04`) |
| `zin_volgan_veil_intact` | Veil ≥ 50 |
| `zin_volgan_may_break_veil` | `zin_dominion_after_1750_01`, strength ≥ 70, not at war, not `zin_volgan_body_destroyed` |
| `zin_volgan_war_open` | Global flag `zin_war_of_last_crowns` or country flag `zin_volgan_veil_broken` |
| `zin_volgan_mirolon_taken` | Mirolon does not exist, or is Volgan's subject, or Volgan controls Mirolon's capital and every pass state |
| `zin_volgan_body_intact` | Not `zin_volgan_body_destroyed` |
| `zin_volgan_mirolon_clientable` | Mirolon does not exist, or exists and is not a government in exile |
| `zin_mirolon_occupied` | Volgan or one of its subjects controls a Mirolon core state |
| `zin_volgan_children_ready` | See section 13 |
| `zin_volgan_tree_compact_open` | Helper for the tree: Volgan's body intact, and Volgan and Zol both at war with the country that has `zin_eindil` |
| `zin_volgan_tree_at_war_for_parim` | Helper for the tree: Volgan is at war with the controller of the `zin_is_site_parim` state |
| `zin_volgan_tree_holds_parim` | Helper for the tree: Volgan or one of its subjects controls the `zin_is_site_parim` state |
| `zin_mirolon_passes_held` | Mirolon at war with Volgan and Volgan controls no `zin_is_site_mirolon_passes` state |
| `zin_is_volgan`, `zin_is_mirolon` | `original_tag` is Volgan's or Mirolon's tag |
| `zin_dominion_is_dark_lands_country` | `original_tag` is one of the roster's Dark Lands countries |
| `zin_dominion_is_free_dead_realm` | `original_tag` is one of the roster's Dead Lands countries, not Volgan, not Mirolon, not Volgan's subject |
| `zin_dominion_is_dead_lands_country` | `original_tag` is one of the roster's Dead Lands countries |
| `zin_dominion_is_middle_lands_state` | State scope: a core of any roster Middle Lands country (scan "Rush Land" and "Rush Islands" in `countries.json`, the politics step's superseded labels); the key sites table's `zin_is_region_middle_lands` (decision E7) may replace it once built, with the same states |
| `zin_dominion_after_<yyyy_mm>` | The date floor, shifted by `global.zin_story_pace` (one trigger per floor in this spec) |
| Site triggers | `zin_is_site_nafeher`, `zin_is_site_abyss`, `zin_is_site_nether`, `zin_is_site_mirolon_passes`, `zin_is_site_mirolon_seat`, `zin_is_site_parim`, in `zin_sites.txt` ([02_key_sites.md](../01_map/02_key_sites.md)); rows in "Builder" above |

### Scripted effects

| Effect | Arguments | Does |
| --- | --- | --- |
| `zin_volgan_add_dominion_strength` | `value` | Adds and clamps 0–100 (cap 40 after the body breaks); refreshes `zin_dominion_hosts` |
| `zin_volgan_refresh_strength` | — | Recomputes the dynamic modifier values from strength |
| `zin_volgan_add_veil` | `value` | Adds and clamps; sets `global.zin_volgan_veil_band`; fires threshold events once |
| `zin_volgan_abyss_wait` | — | Sets the timed flag `zin_volgan_abyss_wait` (365 days) |
| `zin_volgan_add_nether_pact` | `value` | Adds and clamps (cap 75 with `zin_volgan_nether_bent`); sets `zin_volgan_gate_pact` at 70 |
| `zin_volgan_add_oath` | `target` (member or `all`), `value` | Adds and clamps |
| `zin_volgan_court_dark_lands` | `target` (country or `orcs` for every orc, troll or goblin Dark Lands country) | Sends `zin_dominion.8` |
| `zin_volgan_spawn_grave_host` | `count`, `where` (`capital` or a state) | Creates the "Grave Host" template if missing; spawns divisions |
| `zin_volgan_begin_march` | — | Section 10 |
| `zin_volgan_take_field` | — | Section 10 |
| `zin_volgan_raise_northern_front` | — | Section 10 |
| `zin_volgan_wargoal_parim` | — | War goal on the current controller of the Parim state |
| `zin_volgan_make_client` | `target` | Releases an annexed realm as Volgan's puppet, or puppets an existing capitulated one |
| `zin_volgan_destroy_body` | — | Section 12 |
| `zin_volgan_tree_offer_spoils`, `zin_volgan_tree_offer_oath` | — | Section 7 (helpers the Volgan tree calls) |
| `zin_volgan_tree_offer_compact` | — | Sends `zin_dominion.14` to Zol (helper for the tree's "The Black Compact"); does nothing if `zin_black_compact` is set |
| `zin_volgan_steward_rule` | — | Sets the Steward's ideology (`zin_shadow_dread`) and applies the Silent Throne |
| `zin_mirolon_add_proof` | `value` | Adds (doubled if veil < 50), clamps, fires thresholds |
| `zin_mirolon_add_passes` | `value` | Adds, clamps, calls `zin_mirolon_raise_pass_forts` |
| `zin_mirolon_raise_pass_forts` | — | Raises the `bunker` level in pass states Mirolon controls to floor(passes / 20) + 1 (max 6), one `add_building_construction` per missing level (section 8) |
| `zin_mirolon_scout` | — | The Send Scouts South resolution |
| `zin_mirolon_scorch` | — | `damage_building` infrastructure 2 in each pass state Mirolon controls |
| `zin_mirolon_raise_resistance` | — | `add_resistance` 20 in every Mirolon core state controlled by Volgan |
| `zin_mirolon_restore` | — | Sends `zin_dominion.19` to Volgan if the Steward rules; otherwise a war goal on Volgan for Mirolon's cores |
| Shared | — | `zin_world_add_gathering_dark` (world systems) |

**Arguments** (decision E1). Scripted effects take no parameters in 1.19.3: each argument compiles to a temporary variable `zin_arg_<name>` set just before the call. Keyword arguments are codes: `target` = `all` −1 and `orcs` −2 (otherwise the country); `where` = `capital` 0 (otherwise a state id); `count` and `value` are numbers.

### Dynamic modifiers (`common/dynamic_modifiers/zin_dominion.txt`)

- `zin_dominion_hosts` (Volgan, icon `GFX_idea_zin_grave_host`): `army_org_factor = zin_dominion_org`, `army_morale_factor = zin_dominion_morale`, `recruitable_population_factor = zin_dominion_recruit`, `training_time_army_factor = zin_dominion_training`, set by `zin_volgan_refresh_strength`.
- `zin_dominion_gate_scars` (state, added with `days = 90`): `local_manpower` −0.25, `state_production_speed_buildings_factor` −0.25.

Every modifier key in this spec is a `## <key>` heading of the 1.19.3 `documentation/modifiers_documentation.md`, which the builder's `assertModifiers` checks.

### Mechanic spirits (`common/ideas/zin_dominion.txt`)

Pictures are idea icons of the catalog in game (`GFX_idea_zin_<key>`).

| Key | Name | Modifiers | Icon | Added / removed |
| --- | --- | --- | --- | --- |
| `zin_dominion_out_of_the_storms` | Out of the Storms | `army_attack_factor` 0.15, `breakthrough_factor` 0.1 | `storm_veil` | Volgan, war on Mirolon with veil ≥ 50; 120 or 180 days |
| `zin_dominion_caught_unready` | Caught Unready | `army_org_factor` −0.1, `army_defence_factor` −0.05 | `pass_fort` | Mirolon, same moment, passes < 60; 90 days |
| `zin_dominion_forewarned` | Forewarned | `army_defence_factor` 0.1, `max_dig_in` 3 | `scout_lantern` | Mirolon, war start with veil < 30; 180 days |
| `zin_dominion_hold_the_passes` | Hold the Passes | `army_defence_factor` 0.15, `army_core_defence_factor` 0.05 | `pass_fort` | Mirolon at war with Volgan, passes ≥ 80, proof ≥ 50; removed when a pass state falls |
| `zin_dominion_heeded_warning` | A Warning Heeded | `war_support_factor` 0.05, `army_defence_factor` 0.03 | `beacon` | Mirolon, from `zin_dominion.5`; 365 days |
| `zin_dominion_march_stalls` | The March Stalls | `army_attack_factor` −0.1, `war_support_factor` −0.1 | `mountain_pass` | Volgan, `zin_mirolon_holds`; 365 days |
| `zin_dominion_champion_falls` | The Champion Falls | `army_morale_factor` 0.1, `war_support_factor` 0.1 | `dead_crown` | Volgan, first duel; 180 days |
| `zin_dominion_broken_host` | The Broken Host | `army_org_factor` −0.3, `army_morale_factor` −0.3, `stability_factor` −0.2, `recruitable_population_factor` −0.3 | `chain_broken` | Volgan, body destroyed; 365 days |
| `zin_dominion_silent_throne` | The Silent Throne | `political_power_gain` −0.2, `army_org_factor` −0.1 | `silent_throne` | Volgan, after Broken Host; removed by the tree's "What Remains of Volgan" |
| `zin_dominion_seeking_own_road` | Its Own Road | `autonomy_gain` 0.5 | `chain_broken` | A member, from `zin_dominion.22`; 365 days |

### Characters (`common/characters/zin_dominion.txt`)

`zin_volgan` (established, contract) is defined by the characters module ([../02_lore/02_characters.md](../02_lore/02_characters.md)) as Volgan's country leader (`zin_shadow_dread`); this mechanic adds and removes his roles only. The file defines:

| Id | Name | Status | Role |
| --- | --- | --- | --- |
| `zin_volgan_ember_herald` | The Ember Herald | proposed | General (Great Spirit of Volgan's court); Steward of Nafeher after the body breaks |
| `zin_volgan_grave_warden` | The Grave-Warden | proposed | General; heads the necromantic orders |
| `zin_volgan_ghorvak` | Ghorvak of the Hundred Clubs | proposed | General; ogre clan chief of the Dead Lands |
| `zin_mirolon_maeric` | High Warden Maeric | proposed | Mirolon's country leader `zin_light_wardens`; replaces the generated ruler |
| `zin_mirolon_selda` | Captain Selda Varrow | proposed | Mirolon general (Pass Watch) |
| `zin_mirolon_hadric` | Hadric Thorne, Scout-Master | proposed | Mirolon advisor (intelligence) |

The three Volgan generals exist from the start but are recruited only by the tree's event "The Lieutenants Assemble" (`recruit_character`). Mirolon's leader replaces the generated ruler at `on_startup` (`add_country_leader_role` with `promote_leader = yes`); Selda and Hadric are defined, not recruited. Portraits are image-generated ([08_art_and_assets](../08_art_and_assets/)); until they exist, the characters use the people portraits already in game (`GFX_zin_portrait_<people>_<sex>_<n>`: `the_dead` for the Ember Herald and the Grave-Warden, `orcs` for Ghorvak, `men` for Mirolon's three).

### Events (namespace `zin_dominion`)

Pictures are event pictures in game (`GFX_zin_evt_<key>`; news `GFX_zin_news_<key>`, used only for keys in the news set). `volgan_broken` is gated on `zin_volgan_body_destroyed`, and every event that uses it fires only after that flag.

| Id | Title | For | Trigger | Options | Picture |
| --- | --- | --- | --- | --- | --- |
| 1 | (hidden) The Dominion Wakes | Volgan | `on_startup` | Runs `zin_dominion_startup` (start values, start spirits of both trees, Maeric); the monthly pulse stays an on_action | — |
| 2 | Rumours from the South | Mirolon, Herez, free Dead Lands realms | Veil drops below 70 | "We have heard such talk before." | `dead_lands_storm` |
| 3 | Mirolon's Fears | Herez, free Dead Lands realms | Mirolon proof 25 | "Watch with them." (opinion of Mirolon +10) / "Mirolon frets." | `southern_warning` |
| 4 | The Dead Lands Are Arming | all (news) | Veil below 30 | "So the legends wake." | news `dead_lands_storm` |
| 5 | Mirolon's Warning | the ruling Aenor realm | Decision "Send Word to Parim" or a Mirolon focus | See section 8 | `southern_warning` |
| 6 | Scouts Lost | Mirolon | Scouting with veil ≥ 70 (30%) | "Their names go on the wall." | `mirolon_passes` |
| 7 | Scouts Found Dead | Mirolon | Volgan's "Silence the Watchers" | "Double the watch." (passes +3) / "Keep it quiet." (stability +2%) | `mirolon_passes` |
| 8 | Envoys from Nafeher | Dark Lands target | Envoy decision or tree offer | "Hear them." (pact to the offer level) / "Send them back south." | `generic_court` |
| 9 | The Envoys Return | Volgan | Reply to 8 | "As expected." | `generic_court` |
| 10 | Out of the Storms | Volgan, Mirolon | Volgan declares war on Mirolon | Applies the surprise spirits | `dead_lands_storm` |
| 11 | Mirolon Falls | all (news) | `zin_volgan_mirolon_taken` while at war | Sets `zin_mirolon_fallen` | news `generic_war` |
| 12 | The March North | all (news) | `zin_volgan_begin_march` | "The south is moving." | news `generic_war` |
| 13 | The Dead Against the Dead | Volgan | Section 11 | "Then we break them too." / "Not yet." | `grave_muster` |
| 14 | (hidden) The Black Compact Is Offered | Zol | Volgan focus | Fires the Zol spec's `zin_mistake.16` (Zol's answer, O4) at once | — |
| 15 | The Compact Holds | Volgan | Zol accepts | "For now." | `grave_muster` |
| 16 | Then I Will Bury Them Together | Volgan | Fired by the journey's `zin_eindil.96` | "Bury them." | `generic_war` |
| 17 | The Body Breaks | all (news) | `zin_volgan_destroy_body` | "What remains, no one can say." | news `volgan_broken` |
| 18 | Old Allegiances | Demon, Dolon, Nezer | Body destroyed | Stay with Nafeher / go our own way (AI by oath) | `volgan_broken` |
| 19 | The Steward's Choice | Volgan | Body destroyed while Volgan holds Mirolon, or `zin_mirolon_restore` | "Let Mirolon go." (AI 90) / "Hold what we took." (AI 10) | `volgan_broken` |
| 20 | The Passes Held | Volgan, Mirolon | `zin_mirolon_holds` | "The march waits." | `mirolon_passes` |
| 21 | Fire from the Gate | Volgan | Nether Gate decision | "Again, when the gate allows." | `dead_lands_storm` |
| 22 | The Oath Falters | member | Oath below 25 | Renew / seek our own road | `generic_court` |
| 23 | The Compact Ends | Volgan, Zol | Body destroyed or `zin_zol_withdrawn`, compact active | "Each to his own dark." | `volgan_broken` |
| 24 | A Court in Exile | Mirolon | Capitulation with `zin_mirolon_exile_ready` | "Mirolon lives while we do." | `generic_court` |
| 25 | A Stirring in Nafeher | Volgan | Rule `STIRRING` only | "In this telling, the throne answers." | `dead_lands_storm` |
| 26 | The Steward Asks for Peace | each enemy outside the Dead Lands | 30 days after the body breaks, Volgan AI | "Peace, then." / "Finish what the sword began." | `volgan_broken` |
| 27 | Mirolon's Proof | all (news) | Mirolon proof 75 | "Mirolon was right." | news `dead_lands_storm` |
| 28 | Terms from Nafeher | a tributary friend | The march begins | Kneel / refuse | `generic_court` |

Events 4, 11, 12, 17 and 27 are news events. Every event is fired by an effect or an on_action; none uses a mean time to happen except 25 (yearly 10% roll from the pulse, rule `STIRRING` only). Every event sets `timeout_days = 30` and takes its first option on timeout (E2); none decides a historical checkpoint for a human, so the orders stay as tabled. The pulse (`zin_dominion_monthly_volgan`) ends with `mark_focus_tree_layout_dirty` for Volgan, Mirolon, Demon, Dolon and Nezer (E4); `zin_volgan_destroy_body` does the same at once. No event text before `zin_afrit_revealed` names Afrit; no text names Eindil before `zin_eindil_named` (event 16 calls him "the champion of men").

### Game rules

| Rule | Options | Default |
| --- | --- | --- |
| `zin_rule_volgan_spirit` | `UNRESOLVED`, `STIRRING` | `UNRESOLVED` |
| `zin_rule_volgan_early_war` | `DEFAULT` (first; follows `zin_rule_historical_path`: `AI_HISTORICAL` under HISTORICAL and PLAUSIBLE, `AI_FREE` under FREE; decision R1), `AI_HISTORICAL` (AI never takes Break the Veil), `AI_FREE` (AI may break the veil when strength ≥ 80) | `DEFAULT` |

The foundation's rules also act on Volgan's AI ([../00_foundation/05_defines_and_rules.md](../00_foundation/05_defines_and_rules.md)): `zin_rule_historical_path` through `zin_rules_is_historical` (the historical choices in this spec and the trees), and `zin_rule_dark_powers`: `HISTORICAL` keeps this spec's AI; `AGGRESSIVE` treats `zin_rule_volgan_early_war` as `AI_FREE` and raises the AI muster schedule by 5; `RESTRAINED` overrides both: the AI never takes Break the Veil and declares no war unless it is already at war with the target's side. Rules never act on a player's country.

### Interface

Layout belongs to the Ready interface spec ([../07_interface/01_interface.md](../07_interface/01_interface.md), section 7): the Southern Dominion panel and the Erdae bar row for Volgan (`zin_is_volgan`), and the Watch on the Passes panel for Mirolon (`zin_is_mirolon`), which reads only `global.zin_volgan_veil_band`, never Volgan's numbers. This spec provides those triggers and variables; the panels are built by the interface module.

### Defines

None.

## AI

Decision AI is each decision's `ai_will_do`; strategies are `add_ai_strategy` entries this module adds and removes in the pulse. "Historical" means `zin_rules_is_historical`.

**Volgan, before the war.** Never declares war while `zin_volgan_war_open` is false. Takes "Wake the Old Barrows" and "Muster Beneath the Storms" when off cooldown, PP ≥ 100 and strength is below the schedule 50 + 5 × (years since 1 Thaw 1748 ÷ `global.zin_story_pace`) (so 60 in 1750, 80 in 1754 at the standard pace); a player may muster faster; "Raise a Grave Host" when strength ≥ 40 and Volgan has fewer than 24 divisions. Summons the Dominion when any oath is below 45. Sends envoys to every orc and troll Dark Lands country once, then repeats on refusers every 365 days. Takes "Silence the Watchers" when Mirolon's proof ≥ 40. Strategies: `prepare_for_war` and `antagonize` (value 50) on Mirolon from `zin_dominion_after_1753_03`; none against a realm with `zin_dominion_tributary_friend` before the march.

**Volgan, at war.** Declares on Mirolon the month `zin_volgan_war_open` and `zin_volgan_hosts_ready` are true and the tree's "The Old Conquest" is complete. Uses Nether Gate on Mirolon's pass states first, then Herez. After the march: `conquer` (value 200) and `front_unit_request` (value 50) on the Parim holder and on Herez. Accepts the Black Compact path: while Zol has the Zol tree's country flag `zin_zol_accord_sought` (*The Brief Accord*; register owner the Zol's Mistake spec), the Volgan tree's "The Black Compact" AI weight is ×5. After the body breaks: removes those strategies, sends `zin_dominion.26`, and takes "Let Mirolon go".

**Mirolon.** Scouts whenever off cooldown and PP ≥ 50 (historically only while proof is below 65, so that no court is convinced before the war); sends word to Parim at proof 25, 50 and 75; raises pass forts until passes reach 80. Historically it takes "The Exile Court", so that a Mirolon court survives the fall; otherwise it takes "The Exile Court" if proof < 50 at the declaration of war, else "The Last Stand at the Passes". Strategies (defensive only): `antagonize` Volgan (value 50) from the start and `front_unit_request` toward Volgan (value 50) once the veil is below 70; never `prepare_for_war` or `conquer` before Volgan's body breaks.

**Members.** Volgan calls each into his wars while oath ≥ 50. After the body breaks, the AI follows the option weights by oath.

**Dark Lands.** Acceptance weights in section 7. Sworn countries attack Dondor or the bordering Concord dominions when the march begins (northern front).

## Acceptance

Each check names how it is decided: **build** (`npm test` in `tools/`, `tools/content/mech_volgan_dominion.test.mjs` on the staged tree), **Linux** (the isolated Linux run: one in-game year from phase 3 on, decision S8, with no new `error.log` line from a ZIN file), or **scenario** (HOI4 Agent Tools `hoi4_scenario_test` / `hoi4_mechanic_test` on the mod source).

1. **Build.** Every file in "Files" exists; every `zin_dominion` event id is defined once; every event, decision, idea, effect, trigger, flag-reading site, character and opinion modifier this spec names is defined (here or in the module that owns it); every localisation key used exists in `zin_dominion_l_english.yml`, which is UTF-8 with BOM and only Windows-1252 characters.
2. **Build.** Every modifier key passes `assertModifiers`; every effect, trigger and on_action named here appears in the 1.19.3 `documentation/` files or in vanilla `common/on_actions` (`on_startup`, `on_monthly`, `on_declare_war`, `on_capitulation_immediate`, `on_state_control_changed`).
3. **Build.** The sites this spec reads are defined in `zin_sites.txt` and resolve: Volgan's and Mirolon's capital states exist in `countries.json`; states 298 and 299 exist, are owned by Volgan, and their history file names contain "Abyss" and "Nether"; at least one Mirolon core state borders a Volgan core state. The Grave Host sub-unit the module chose is defined in the staged tree.
4. **Build.** No player-visible text in `zin_dominion` names Afrit, Roka's fate, the King of Demons' name or Dardan's location; no text contains "Eindil" (event 16 says "the champion of men"); no text tied to Volgan after the body breaks contains "is dead", "destroyed forever", "survives", "lives on" or "his spirit".
5. **Build.** Event 25's trigger contains the `STIRRING` rule test; the default of `zin_rule_volgan_spirit` is `UNRESOLVED`.
6. **Linux.** A new game on 1 Thaw 1748 (once the calendar is built; until then on the 1936 start): Volgan has strength 45, veil 85, pact 20; members' oaths 60, 55, 50; Mirolon proof 15, passes 30, pass-state forts at level 2; `zin_dominion_hosts` is on Volgan; nobody is at war; no new error lines.
7. **Scenario.** Over a scripted 7-year run under `HISTORICAL`, Volgan declares no war before `zin_war_of_last_crowns`; on 1 Rainwake 1755 strength is between 70 and 95 and the veil between 50 and 80; Mirolon's proof stays below 75.
8. **Scenario.** "Break the Veil" is unavailable before 1 Deepwinter 1750 (shifted by the story pace) and below strength 70.
9. **Scenario.** Forcing the veil down from 85 to 20 fires `zin_dominion.2`, the Suspected effects and `zin_dominion.4` once each, in that order; raising it to 80 and lowering it again fires none of them a second time.
10. **Scenario.** Forcing Mirolon's proof to 75 removes `zin_mirolon_unheeded_warnings`, fires `zin_dominion.27` and lowers the veil by 10.
11. **Scenario.** For passes 0, 20, 30, 60 and 100, the bunker level in each pass state Mirolon controls is 1, 2, 2, 4 and 6.
12. **Scenario.** Historical observer run: Mirolon falls in 4A 1755 and its court goes into exile; `zin_volgan_marches` is set within checkpoint 15's window; `zin_volgan_zol_clash` is set before `zin_black_compact`; `zin_black_compact_ended` is set the day `zin_volgan_body_destroyed` is.
13. **Scenario.** Running `zin_volgan_destroy_body` twice: the flag is set once; `zin_volgan` exists with no country-leader or field-marshal role and is not dead; the Ember Herald leads; strength is at most 40 and stays capped; the Silent Throne root becomes available.
14. **Scenario.** With `zin_eindil` removed, giving Volgan the Parim state, four subjects and strength 60 makes `zin_volgan_children_ready` true; setting `zin_volgan_body_destroyed` makes it false.
15. **Scenario.** A realm with `zin_dominion_tributary_friend` receives no war from Volgan's AI before `zin_volgan_marches` (FREE rule, war open early) and gets `zin_dominion.28` when the march begins.
16. **Linux.** The HOI4 Agent Tools script validator reports no unknown effect, trigger or modifier in the `zin_dominion` files, and the one-year run adds no error line from them.
17. **Build.** `zin_dominion.1` adds the four start spirits and makes `zin_mirolon_maeric` Mirolon's leader on day 1; `zin_dominion_mirolon_friendship` is defined once, here; `zin_dominion.14` is the only event that offers the Black Compact and `zin_dominion.13` the only clash event; `zin_rule_volgan_early_war` starts with `DEFAULT`.
18. **Scenario.** With `zin_volgan_war_council`, a member at oath 30 is still called into Volgan's war.

## Open questions

All of these are owner questions in [OPEN_QUESTIONS.md](../OPEN_QUESTIONS.md); the work proceeds on the proposal given.

| # | Question | Proposal the spec uses | Listed as |
| --- | --- | --- | --- |
| 1 | Who owns the Nether on the map? | Volgan's realm; the King of Demons' court is a pact | short list 5 |
| 2 | Mirolon's government and ruler | Elective warden-realm; High Warden Maeric | short list 7; "volgan and mirolon" 2 |
| 3 | Where are the passes? | On Mirolon's border with Volgan's realm | short list 7; "volgan and mirolon" 3 |
| 4 | After the body breaks, does the Steward let Mirolon go historically? | Yes ("Let Mirolon go", AI 90) | "volgan and mirolon" 4 |
| 5 | The proposed names (Ember Herald, Grave-Warden, Ghorvak, Maeric, Selda Varrow, Hadric Thorne, Veil of Storms, Black Compact, Silent Throne) | Used as written | "volgan and mirolon" 6 |
| 6 | Should the King of Demons appear as a titled character? | No; his court speaks only through Volgan's events | "volgan and mirolon" 8 |
| 7 | Should the "A stirring" sandbox rule exist? | Yes, default off; text never says the spirit survived | "volgan and mirolon" 7 |
