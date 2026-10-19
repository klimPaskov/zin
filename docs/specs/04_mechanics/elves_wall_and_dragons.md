# The Elves of the Magical Lands, the Wall and the Dragons

**Status:** Ready. Reviewed 19 October 2026 against CONVENTIONS "Status"; integrated 19 October 2026. **Priority:** 3. **Phase:** 3.

## Purpose

The Magical Lands are the one region Elzon never conquered. In 4A 1748 they hold twenty-one elven realms, the Deliverer's small temple-state in the Zilin Hills, the Great Wall along their border with Aenor, and Dragon Mountain. This spec gives them one mechanic, played mainly by the **Magical Forest** and felt by every realm around it:

- **The Kinship:** how far the elven realms act as one, and **the Kindred of the Woods**, the defensive league they can raise.
- **The Elven Refusal in play:** what the elves may and may not do for men, and the **Wanderers** who help as individuals.
- **The Wall Accord in daily life:** customs, grievances, the Wall Moot, dragons over the Wall, the gates in wartime.
- **Herrodon and Andos Enda:** an old rivalry that the Magical Forest must keep from turning into a feud.
- **Nolorim's passes:** the high-pass watch of the southern frontier.
- **The dragons, from the elven side:** the Keeper's bond with Dragon Mountain, and the elves' defence against corruption.
- **Varner:** a Lesser Spirit of the Magical Lands, legend at the start, sought later.
- **The Worshipdom in their midst:** the pilgrim roads through the woods.
- **The eastern invasion:** how the elves defend the rift coast.

The Gala elves, the Sunhot elves, the Mirror of First Rain and Lorien's death are in [lands_of_the_sun.md](lands_of_the_sun.md). The focus tree is [../05_focus_trees/major/magical_forest.md](../05_focus_trees/major/magical_forest.md).

### What other specs own

This spec calls these and never redefines them.

| System | Owner | Names used here |
| --- | --- | --- |
| Refusal flags, Wall Accord pacts and breaking, casus belli, faction templates and joining rules | [../03_gameplay/03_diplomacy_and_factions.md](../03_gameplay/03_diplomacy_and_factions.md) | `zin_elven_refusal`, `zin_refusal_lifted`, `zin_diplo_refusal_binds`, `zin_diplo_lift_refusal`, `zin_diplo_is_dark_power`, `zin_wall_accord`, `zin_wall_accord_broken`, `zin_opinion_wall_accord`, `zin_diplo.31` |
| Dragon pool, Dragon Pact, corruption, potent magic, Varner's wards, the Wall Watch | [../03_gameplay/04_magic_and_world_systems.md](../03_gameplay/04_magic_and_world_systems.md) | `zin_dragons_free`, `zin_world_is_dragon_keeper`, `zin_world_dragon_pact`, `zin_world_corrupt_dragon`, `zin_world_give_dragon`, `zin_world_dragon_pacts`, `zin_world_corrupted_dragons`, `zin_world.50`, `zin_has_potent_magic` |
| Wall forts, dragon units (air layer, S6), elven units and technologies | [../03_gameplay/01_warfare.md](../03_gameplay/01_warfare.md) | `zin_is_site_great_wall`, `zin_war_great_wall`, `zin_war_grant_dragons`, `zin_war_dragon_pact`, `zin_elven_arms_equipment`, `zin_cat_wards` |
| Wall customs income | [../03_gameplay/02_economy.md](../03_gameplay/02_economy.md) | Aenor's `zin_aenor_gold`, `zin_economy_add_gold`, "Wall customs" line |
| The eastern coalition and its crossing | [eastern_kings.md](eastern_kings.md) | `zin_eastern_invasion` (diplomacy spec's name, set by `zin_east.43`), `zin_east_turns_west`, `zin_east_coalition_leader`, `zin_east_coalition_member`, `zin_is_site_rift_west`, `zin_is_region_east_lands` |
| Footholds and the reveal | [afrit_hidden_council.md](afrit_hidden_council.md) | `zin_footholds`, `zin_afrit_add_footholds` (elven cap 2), `zin_afrit_revealed` |
| Eindil in the Magical Forest, Varner and Golbran joining him, the dragon entrusted to him, Varner's death | [eindil_journey.md](eindil_journey.md) | `zin_eindil.86`, `.87`, `.88`, `.97`, `zin_eindil_dragon_pact`, `zin_eindil_stage`, `zin_varner_dead` |
| Lorien, the Gala Elves, the Sunhot realms | [lands_of_the_sun.md](lands_of_the_sun.md) | `zin_lorien_dead`, `zin_sun_lorien_rides`, `zin_sun_lorien_falls` |
| Zol's rising and manifestation | [zols_mistake.md](zols_mistake.md) | `zin_zol_rising`, `zin_zol_manifested`, `zin_mistake.10` option C, `zin_mistake.22` |
| Gathering Dark | [../03_gameplay/05_world_tension_and_endings.md](../03_gameplay/05_world_tension_and_endings.md) | `zin_world_add_gathering_dark`, `zin_gathering_dark` |
| Game rules | [../00_foundation/05_defines_and_rules.md](../00_foundation/05_defines_and_rules.md) | `zin_rule_ai_elves`, `zin_rules_is_historical`, `zin_rules_is_free`, `zin_rules_ai_branch_elves_march` |
| Key sites | [../01_map/02_key_sites.md](../01_map/02_key_sites.md) | `zin_is_site_nolorim_passes`, `zin_is_site_boundary_groves`, `zin_is_site_elven_wall`, Dragon Mountain (`zin_world_is_dragon_keeper`) |
| Start opinions and spirits | [../02_lore/01_start_situation.md](../02_lore/01_start_situation.md) (module `start_situation.mjs`) | `zin_elves_the_old_refusal`, `zin_world_long_peace`, `zin_opinion_old_estrangement` (N6), `zin_opinion_old_rivalry`, `zin_opinion_pilgrim_road` |
| The interface | [../07_interface/01_interface.md](../07_interface/01_interface.md) | Shows this spec's meters; this spec writes no window |

## Lore basis

**Established** (vault):

- The elves of the Magical Lands were never conquered, not even by Elzon. Through the Third Age they resisted him to defend their own lands (*The Elven Refusal*, *Third Age Canon Register*).
- **The Elven Refusal.** After Edran's failed attack on the Dead Lands, the elven kingdoms sent no armies to help men against Elzon. It must not be rewritten as a new alliance in the final invasion. Individual travellers, healers or independent figures may cooperate across peoples, but there is no official elven campaign to free the human crown (*The Elven Refusal*).
- The Magical Forest is the realm of the peaceful, democratic and very old elves (working table, roster role "friendly, democratic and very old").
- The Magical Lands lie east of the Middle Lands on the same landmass. Named features: the Magical Forest, the Mushroom Forest, the Magic Mountains, Herrodon, Andos Enda, Nolorim. A long rift sea separates them from the East Lands (*Erdae and Its Regions*). The mycids live in the Mushroom Forest (*Peoples of Erdae*); their rank and polity are not settled.
- Nolorim must stay a separate country (*Great Powers and Relations*, working). Herrodon and Andos Enda are old rivals (*The Campaign of 4A 1748*: "established working rivalry"; roster roles "rival of Andos Enda" / "rival of Herrodon"). The working table also lists Andos Enda in Lerendor's Leren Compact (*Great Powers and Relations*); decision S5 settles play: Andos Enda is bound by the Refusal and is not in the Compact at the start, and Lerendor can court it.
- The Great Wall of Aenor separates the Middle Lands from the Magical Lands and runs from the Organ Mountains past Lunhrim and around Kingson (owner, 17 October 2026).
- Dragons come chiefly from Dragon Mountain and do not form a country. Elven powers can command them; Afrit can through corruption (*Peoples of Erdae*).
- Volgan's First Age army contained corrupted elves; this does not mean all elves served him (*Peoples of Erdae*).
- Varner is a wise wizard and a **Lesser Spirit of the Magical Lands**. He helped the elves and the human resistance withstand Elzon through the Third Age, can undo the curse binding Elzon's dead, and has a small purple servant of unknown origin, Golbran. Late in the Fourth Age he comes to Aenor with Eindil by dragon, shields the living from Zol's death-magic and dies (*Varner*, *Golbran*).
- Afrit has no clear dominion and networks everywhere (*The Campaign of 4A 1748*). The Worshipdom's seat is the Zilin Hills (working table, map).
- In the final war an eastern coalition crosses seas and mountain approaches to threaten the Magical Lands and the Middle Kingdom. Some of its commanders are secretly tied to Aurevan's networks; not all eastern states are united (*The Fourth Age of Erdae* VIII–IX, *War of the Last Crowns*).

**Proposed in the vault** (stay proposed here): Varner's network of couriers and warding specialists, provisionally the Lantern Chain, which worked beside human rebels but "does not make the Magical Lands' elven armies into Aenor's official rescuers" (*Lantern Chain*, status proposed); the Wall Accord of 4A 96 that kept Elzon's Pale March as the Great Wall, with the elves wanting their old separation and the kings a customs line and a guard against the dragons (*Fourth Age Chronology*); the Magical Forest's elected council of houses; "Nolorim guards the high passes" (the name is established, the role proposed); the Worshipdom as a hermitage of about 4A 1520 and the visible hub of the networks; the dragon Eindil rides as a free ally entrusted by elven allies of the Magical Lands; the start date and peaceful start situation.

**Proposed in this spec:** the Kinship, the Kindred of the Woods, the Wanderers, the Wall grievance, the Wall Moot, Dragons over the Wall, the rivalry meter and the Feud of the Groves, the pass watch, the roost bond, Seek the Wizard, the pilgrim-road policies, the elven defence of the rift, every name of a decision, spirit and event, and every number.

**Kept open** (no text may close these): whether Andos Enda belonged to the Leren Compact in history (play follows S5; no text says it never did); whether the black areas of the Magical Lands sheet belong to Zol's Mistake; where Varner lives, how his ritual works, whether his writings survive and what his death means for the Magical Lands (vault follow-up 6); Golbran's origin; whether the Mushroom Forest's mycids form their own polity (peoples spec); who owns Dragon Mountain at the start (map question). Text never says the elves will march, never says where Varner is, and never links the Deliverer to Afrit before `zin_afrit_revealed`.

## Design

### 1. The peaceful start

On 1 Thaw 4A 1748 no elven realm is at war, holds a claim or can justify a war goal (`zin_elves_the_old_refusal`: `justify_war_goal_time = 1.0`; `zin_world_long_peace`). The Kindred does not exist. The Wall roads are open, the pilgrim roads are open, no dragon is bound, Varner is legend. Every lever below is diplomacy, money, watch-fires or wardens until a story flag or a deliberate late choice opens war.

### 2. The realms

| Realm | States | Role in this mechanic |
| --- | ---: | --- |
| **Magical Forest** | 17 | Leads the Kinship; proposed Keeper of the Roosts; runs the monthly tick; tier A tree |
| Lccimio, The End | 14, 13 | Large rift-coast realms; first targets of the eastern crossing; tier B trees |
| Luv-zhise, Lengoli, Lusteli | 10, 9, 1 | Rift-coast realms (`zin_is_site_rift_west`); shared tree `shared_magical_lands` |
| **Herrodon**, **Andos Enda** | 6, 5 | The old rivals (section 6); tier B trees |
| **Nolorim** | 2 | Holds the high passes (section 7); tier B tree |
| Filion, Kingdom, Ossa, Nolivorak, Heron, Perloia, Teste, Endelond, Greenland, Velakton, Sacomananos, Dulo-Dulo | 8 to 2 | Kin realms; shared tree `shared_magical_lands` |
| **Worshipdom** | 3 | Not elven. The Deliverer's temple-state in the Zilin Hills (section 10) |

State counts are the politics step's today (`tools/content/data/countries.json`); every realm in the table has the people `elves` today, the Worshipdom `men`.

**Lists.** The **Magical Lands elven realms** are written by the builder: every country whose roster sheet is the Magical Lands and whose people is `elves` (`tools/content/data/countries.json` with `docs/design/countries.csv`), as the generated trigger `zin_elves_is_magical_realm`. The other lists need state adjacency, so the hidden startup event `zin_elves.1` computes them once on 1 Thaw 4A 1748 and stores them as country flags (they do not change with conquest):

| List | Flag | Rule at startup |
| --- | --- | --- |
| Wall realms | `zin_elves_wall_realm` | A Magical Lands elven realm owning a state next to a `zin_is_site_great_wall` state (`any_owned_state = { any_neighbor_state = { zin_is_site_great_wall = yes } }`) |
| Rift realms | `zin_elves_rift_realm` | Owns a `zin_is_site_rift_west` state |
| Pilgrim-road realms | `zin_elves_pilgrim_realm` | Owns a state next to a state owned by the Worshipdom, or is a wall realm (the pilgrims cross the Wall) |

**Sites** (key sites table, generated into `common/scripted_triggers/zin_sites.txt`): **pass states** `zin_is_site_nolorim_passes` (Nolorim's states on the eastern mountain approach, proposed; both Nolorim states if the map shows no approach) and the **boundary groves** `zin_is_site_boundary_groves` (the Herrodon state that borders Andos Enda and lies nearest Andos Enda's capital).

### 3. The Kinship

`zin_elves_kinship` (global, 0–100, start **35**): how far the elven realms of the Magical Lands act as one.

| Change | Amount |
| --- | ---: |
| Monthly, if `zin_elves_rivalry` ≥ 60 | −0.5 |
| Monthly, while the Kindred exists | +0.3 |
| Monthly, while any Magical Lands elven realm is at war with a non-elven country that controls one of its states | +0.5 |
| The Elder Moot (decision, section 3.1) | +10 |
| `zin_eastern_invasion` set | +15 |
| The Feud of the Groves begins | −20 |
| The passes are lost (section 6) | +10 |
| Focuses, Wanderers for the passes | as tabled |

Changes go only through `zin_elves_add_kinship` (argument `value`), which clamps to 0–100.

| Kinship | Effect |
| --- | --- |
| below 25 | **Scattered Houses**: no Elder Moot; the Kindred cannot be raised except by the eastern invasion |
| 40+ | The Magical Forest may call the Elder Moot |
| 60+ | The Kindred may be raised in peace (`zin_elves_kindred_ready`) |

#### 3.1 The Elder Moot

Decision **Call the Elder Moot** (Magical Forest; kinship ≥ 40; 50 political power; cooldown 365 days). Event `zin_elves.30` to the Magical Forest:

- **Speak of the old peace** (kinship +10; every Magical Lands elven realm: `zin_opinion_elven_goodwill` toward the Magical Forest).
- **Speak of the Wall** (kinship +5; `zin_elves_add_wall_grievance` −10: the realms agree to bring one voice to the Wall Moot).
- **Speak of the rivals** (only if rivalry ≥ 30; kinship +5; rivalry −10).

#### 3.2 The Kindred of the Woods (proposed)

A defensive league of the Magical Lands elves. Elves may always ally with elves and form their own factions (diplomacy spec); the Kindred is not a human faction and does not lift the Refusal.

- **Ready** (`zin_elves_kindred_ready`): the Kindred does not exist, and kinship ≥ 60, or `zin_eastern_invasion` is set, or a Magical Lands elven realm is at war with a non-elven country that controls one of its states.
- **Raise the Kindred** (decision, Magical Forest, or if it does not exist the elven realm with most states; 75 political power, 0 after `zin_eastern_invasion`), or the focus *The Kindred of the Woods*. Effect `zin_elves_raise_kindred`: `create_faction_from_template = zin_faction_kindred` (the template, proposed: name "The Kindred of the Woods", `visible = { always = no }`, `default_rules = { zin_faction_rule_join_elven_kin war_declaration_rule_faction_leader_only call_to_war_rule_faction_leader_only change_leader_rule_never }`, manifest `zin_faction_manifest_kindred`, icon from the diplomacy spec's ZIN icon pool); sets `zin_elves_kindred_formed`; event `zin_elves.31` to every Magical Lands elven realm and news `zin_elves.32`. The joining rule `zin_faction_rule_join_elven_kin` (type `joining_rules`) is `zin_elves_is_magical_realm = yes`.
- **Manifest** `zin_faction_manifest_kindred` "Every Tree Stands" (proposed; needs the faction DLC like the diplomacy spec's manifests, and no script reads its progress): progress = Magical Lands states controlled by members ÷ Magical Lands states owned by elven realms at the start; fulfilled bonus `army_core_defence_factor = 0.05`.
- **Joining** (`zin_elves.31`): *Stand with the kin* (`add_to_faction` through the leader; `zin_opinion_kindred` +20 with every member) / *We keep our own counsel* (nothing; can be asked again after 365 days). AI chance: 30 + kinship ÷ 2 + 40 if at war with an eastern invader or a dark power; Herrodon and Andos Enda −30 while the other is a member and rivalry ≥ 60.
- **Defence.** When a member is at war with a non-elven country that controls one of its states, `zin_elves_join_kin_defence` runs (monthly tick and on joining): every other member not at war with that enemy gets `add_to_war = { targeted_alliance = <member> enemy = <enemy> hostility_reason = asked_to_join single_target_only = yes }`. Elves helping elves is not help to men. This covers every attacker: the eastern coalition, Zol's dead turned on the elven edge (Zol spec, `zin_mistake.10` option C, non-historical), the Worshipdom's *Strike the Magical Lands* after the reveal (Worshipdom tree, non-historical), or a human crown.
- **Limits.** AI members never declare offensive wars except to recover their own states; the Kindred never invites a non-elven country; it dissolves (`dismantle_faction`) 730 days after its last war ends, clearing `zin_elves_kindred_formed`.

### 4. The Elven Refusal in play

The rules are the diplomacy spec's: bound realms (`zin_diplo_refusal_binds`) cannot join human factions or send volunteers, may defend themselves and ally with elves, and set the Refusal aside (`zin_diplo_lift_refusal`, which sets the country flag `zin_refusal_lifted`) only in its four ways: **The Old Lords Ride** (the Gala Elves, through the Zol spec's `zin_mistake.22`), the decision **Break the Refusal** (100 political power; at war with a dark power that controls one of the realm's states; `zin_gathering_dark` ≥ 75), **The elves march** (AI only, game rule `zin_rule_ai_elves = MARCH` or `RANDOM`), and **Zol walks** (`zin_zol_manifested`, through the Magical Forest tree's *The Kindred Marches*; section 4.3). A lifted realm returns to the Refusal 365 days after its last war with a dark power ends (`zin_diplo.31`). The flag `zin_elven_refusal` is never cleared in the Fourth Age. This spec adds three things.

#### 4.1 The Refusal spirit

`zin_elves_the_old_refusal` is defined and applied on startup by the start-situation module (`common/ideas/zin_start.txt`, every elven realm); this mechanic defines only the second spirit and does the swap:

| State | Spirit | Modifiers |
| --- | --- | --- |
| Bound | **The Old Refusal** `zin_elves_the_old_refusal` | `justify_war_goal_time = 1.0`, `drift_defence_factor = 0.20` |
| `zin_refusal_lifted` set | **The Refusal Set Aside** `zin_elves_refusal_set_aside` | `war_support_factor = 0.05`, `drift_defence_factor = 0.10` |

The swap runs in `zin_elves_sync_refusal` (`swap_ideas`; called by the monthly tick and by this spec's own scripts right after they touch `zin_refusal_lifted`; a lift by another spec is picked up within a month). Text calls a lifted Refusal "set aside for this war", never ended.

#### 4.2 The Wanderers

Individuals still help (established). Two targeted decisions in category `zin_elves_wanderers`, open to **every elven realm** (Magical Lands and Lands of the Sun: country flag `zin_people_elves` or `zin_people_sun_elves`):

| Decision | Target | Cost | Effect on the target | Limits |
| --- | --- | --- | --- | --- |
| **Send Healers and Loremasters** | Any country that is not Shadow, not at war with the sender, with opinion of the sender ≥ 0 | 35 political power | Timed idea **Elven Wanderers** `zin_elves_wanderers_lore`, 365 days: `research_speed_factor = 0.03`, `stability_factor = 0.02` | At most 2 active per sender (3 with *Healers, Not Hosts*); one per target |
| **Send Wardens to a Friend in Need** | A country at war with a dark power (`zin_diplo_is_dark_power`) or with Zol after `zin_zol_rising` | 50 political power, 1,000 manpower | Timed idea **Elven Wardens Among Us** `zin_elves_wanderers_wardens`, 180 days: `army_org_factor = 0.03`, `recon_factor = 0.10`, `army_morale_factor = 0.03` | Same limits |

Wanderers are not volunteers and not an army: no division moves, no faction is joined, `zin_refusal_lifted` is not set. The manpower is spent (`add_manpower = -1000`, checked by `custom_cost_trigger`), not sent. Event `zin_elves.55` / `.56` tells the target (flavour; one option). The counter is the sender's variable `zin_elves_wanderers_out`, lowered when the idea expires (`zin_elves_monthly` checks the targets). Focuses of the elven trees reduce costs or raise the effect through flags the decision reads: `zin_magical_forest_healers` (Magical Forest focus *Healers, Not Hosts*: 3 active missions, 15 political power cheaper), `zin_elves_wanderers_extra` (this spec's flag, set by the regional Magical Lands and shared Magical Lands trees' healer focuses: 3 active missions, 10 political power cheaper), the timed `zin_magical_forest_free_wanderers` (*The Elder Wanderers*: cost 0 for 180 days), and the Gala tree's `zin_gala_friends_not_allies` (*Friends, Not Allies*: 10 political power cheaper) and `zin_gala_healers` (*Healers of Gala*: Healers and Loremasters sent by the Gala Elves give `research_speed_factor = 0.05` instead of 0.03, through a second idea `zin_elves_wanderers_lore_gala`). Cost reductions add up and never go below 0. The "Limits" column's "3 with *Healers, Not Hosts*" means `zin_magical_forest_healers` or `zin_elves_wanderers_extra`.

#### 4.3 The march rule

`zin_rule_ai_elves` (defines spec): `DEFAULT` follows `zin_rule_historical_path`; `MARCH` lets AI elven realms lift at `zin_gathering_dark` ≥ 75 when any elven realm is at war with a dark power, and makes the Magical Forest AI take *The Kindred Marches*; `RANDOM` decides at start for each AI elven realm (half march): this spec's startup event `zin_elves.1` draws once for every AI country with `zin_people_elves` or `zin_people_sun_elves` and stores the result as the country flag `zin_elves_ai_marcher` (the defines spec's rule: the owner draws and stores; the diplomacy spec's march way reads the same flag). Scripts read the rule through the defines spec's wrappers `zin_rules_is_historical`, `zin_rules_is_free`, `zin_rules_ai_branch_elves_march` (true under `MARCH`; false under `RANDOM`, as for every branch trigger) and `zin_rules_ai_random_elves`, combined in this spec's trigger `zin_elves_marches_by_rule`: `zin_rules_ai_branch_elves_march`, or `zin_rules_ai_random_elves` and the realm has `zin_elves_ai_marcher`.

Scripted trigger `zin_elves_march_allowed` (used by the Magical Forest tree): the country could use Break the Refusal now (diplomacy conditions), or `zin_elves_marches_by_rule` is true, `zin_gathering_dark` ≥ 75 and an elven realm is at war with a dark power (the diplomacy spec's march way), or `zin_zol_manifested` is set. It is never true before 1 Thaw 4A 1751 (`1751.3.1`). A player may take the march focus whenever the trigger holds; the rule only steers the AI.

The `zin_zol_manifested` clause is the **fourth way** the Refusal lifts (proposed; the diplomacy spec lists it as "Zol walks"): an Old God walking threatens all the living, the same reason Lorien rides (established for Lorien only). It opens the march to the Magical Forest; no AI uses it under `HISTORICAL`, and no text says the Magical Lands elves marched (owner question 2 below). The tree's *The Kindred Marches* calls `zin_diplo_lift_refusal` itself.

### 5. The Wall Accord and the Great Wall

The Wall is Aenor's: its forts stand on the Aenor side, its customs fill Aenor's treasury, Kingson keeps the gate. The elves own the other side of the road. The diplomacy spec owns the Accord's pacts and breaking (`zin_wall_accord`, `zin_wall_accord_broken`); the magic spec the Wall Watch and breaches; the economy spec the customs line. This spec owns the **Wall's daily quarrel**.

#### 5.1 The Wall grievance

`zin_elves_wall_grievance` (global, 0–100, start **25**): the elves' anger at the customs men of the Golden Court. Changed only through `zin_elves_add_wall_grievance` (argument `value`).

| Change | Amount |
| --- | ---: |
| Monthly, while Aenor's `zin_court_corruption` ≥ 60 and the Accord holds | +1 |
| Monthly, while Aenor's `zin_court_corruption` < 30 | −0.5 |
| Kingson keeps the new toll (`zin_lore.107` "Customs at the Wall", option B) / waives it (option A); the lore events module calls `zin_elves_add_wall_grievance` in those options | +10 / −10 |
| Wall Moot answered: hear the elves / tolls stand | −20 / +10 |
| Dragon over the Wall: compensation paid / refused | −5 / +5 |
| The New King's Customs: accepted / refused | −15 / +5 |
| After `zin_eindil_crowned`, monthly | −1 |
| Focuses | as tabled |

| Grievance | Effect |
| --- | --- |
| 50+ | **Cold Roads**: global flag `zin_elves_cold_roads` (cleared below 40); every wall realm gets `zin_opinion_cold_roads` (−10) toward Aenor (removed below 40). The economy spec's Wall customs line reads the flag: +1 a month instead of +3 |
| 75+ (60+ after the focus *Close the Wall Roads*) | Decision **Close the Wall Roads** (Magical Forest; 50 political power) |
| Roads closed | `zin_elves_close_wall_roads`: sets `zin_elves_wall_roads_closed` (the economy spec's Wall customs read it: 0); every wall realm and Aenor, Kingson: `zin_opinion_wall_roads_closed` (−15) both ways; every wall realm gets **Roads Shut at the Wall** `zin_elves_wall_roads_shut` (`consumer_goods_factor = 0.02`, `drift_defence_factor = 0.05`); `zin_world_add_gathering_dark` +1; news `zin_elves.10` |
| Reopening | Decision **Reopen the Wall Roads** (Magical Forest; grievance < 40) or an accepted Wall Moot: clears the flag, removes the idea and the opinions |

Closing the roads never breaks the Accord. Only a declaration of war does (diplomacy spec).

#### 5.2 The Wall Moot (proposed)

Decision **Call a Wall Moot at the Gate** (Magical Forest or any wall realm; grievance ≥ 30; 50 political power, 25 with the focus *The Wall Moot*; cooldown 730 days). Event `zin_elves.5` to Aenor:

- **Hear the elves** (grievance −20; Aenor −25 political power and `zin_economy_add_gold` −10; both sides `zin_opinion_elven_goodwill`; reopens closed roads).
- **The crown's tolls stand** (grievance +10; Aenor +25 political power).

AI Aenor: hear with chance 70 − Aenor's `zin_court_corruption` ÷ 2 (minimum 15). After `zin_aurevan_crowned`: 60 (the new king courts calm borders). Answer event `zin_elves.6` to the caller.

#### 5.3 Dragons over the Wall (proposed)

Mechanic-owned event `zin_elves.7` (trigger and mean time to happen are allowed in mechanic files). Fires for the Keeper when: `zin_dragons_free` ≥ 1, the Keeper is an elven realm, the Accord holds, the Keeper is not at war, and it has not fired in the last 730 days. Mean time 720 days. Text: a wild dragon of the mountain has taken herds on the Aenor side of the Wall.

- **Pay the herdsmen** (−25 political power, 0 with the flag `zin_magical_forest_wyrm_guard`; grievance −5; Aenor `zin_opinion_elven_goodwill`). AI 70.
- **The dragons are free** (grievance +5; Aenor `zin_opinion_cold_roads`). AI 30.

Aenor gets `zin_elves.8` (report). This is the vault's "guard against the dragons" in peace: it never starts a war.

#### 5.4 The New King's Customs

On `zin_aurevan_crowned`, every wall realm gets `zin_elves.9`: King Aurevan's envoys offer to lift the new tolls if houses of the Deliverer may stand along the elven roads.

- **Accept** (grievance −15; `zin_afrit_add_footholds` +1 on the realm, within the Afrit spec's elven cap). AI 30.
- **The woods keep no temples** (grievance +5; stability +2%). AI 70; historical ×1.5.

Text says "King Aurevan" and nothing more.

#### 5.5 The gates in wartime

With the flag `zin_magical_forest_wall_gates` (focus *Gates in Time of War*), the Magical Forest has two decisions while `zin_war_of_last_crowns` or `zin_eastern_invasion` is set:

- **Open the Wall Gates to Aenoran Companies:** `give_military_access` to Aenor and its subjects; Aenor `zin_opinion_elven_goodwill`. Men may come to help elves; this does not lift the Refusal. AI: only if an eastern invader controls a state of the Magical Forest or a Kindred member and Aenor is not at war with the Magical Forest; historical ×0.2.
- **Bar the Wall Gates:** ends that access (`diplomatic_relation = { country = <Aenor> relation = military_access active = no }`, and the same for each subject); timed idea `zin_elves_gates_barred` for 180 days: `stability_factor = 0.05`.

### 6. Herrodon and Andos Enda

`zin_elves_rivalry` (global, 0–100, start **45**): the heat of the old rivalry. Changed only through `zin_elves_add_rivalry`. This spec opens no war between them before 1 Thaw 4A 1750 (the feud decision below is the only route it gives), and their AI never takes that route under the historical rule.

| Change | Amount |
| --- | ---: |
| Monthly (old slights) | +0.3 |
| Monthly, while both are Kindred members | −0.5 |
| Mediation by the Magical Forest (decision or focus) | −15 |
| Events `zin_elves.20`–`.22` | ±3 to ±10 |
| One of them gone (annexed or puppeted by a non-elf) | set to 0 |

**Events** (mechanic-owned, mean time 540 days each, not while either is at war):

| Id | Title | For | Options (AI) |
| --- | --- | --- | --- |
| `.20` | The Boundary Groves | Herrodon | Set our markers (rivalry +10; AI 60) / Leave the groves to the trees (rivalry −5; AI 40) |
| `.21` | A Slight Remembered | Andos Enda | Answer it in kind (rivalry +8; AI 55) / Let it pass (rivalry −3, −10 political power; AI 45) |
| `.22` | The Roost Claim | the Keeper | Favour Herrodon (rivalry +10) / Favour Andos Enda (rivalry +10) / The roost belongs to the dragons (rivalry −5; `zin_elves_add_roost_bond` +5; AI 80) |

**Mediation.** Decision **Mediate Between Herrodon and Andos Enda** (Magical Forest; rivalry ≥ 30; 50 political power; cooldown 365 days, 180 with the focus flag `zin_magical_forest_mediator`): rivalry −15, kinship +5, both rivals `zin_opinion_elven_goodwill` toward the Magical Forest.

**The Feud of the Groves** (proposed). Decision **Settle the Feud of the Groves** for Herrodon or Andos Enda: rivalry ≥ 90; after 1 Thaw 4A 1750; neither at war; not both in the Kindred. Effect: `create_wargoal` type `take_state` on the boundary groves (Andos Enda) or on the Andos Enda state nearest it (Herrodon); sets `zin_elves_feud`; `zin_opinion_feud_of_groves` (−30) both ways; kinship −20; `zin_world_add_gathering_dark` +2; news `zin_elves.24`. The feud stays local: if it is still running after 365 days, `zin_elves.25` offers both a white peace (AI 80). Under `HISTORICAL` the AI never takes the decision, and the Magical Forest AI mediates whenever rivalry ≥ 70.

**Andos Enda and the Leren Compact** (S5). Andos Enda is bound by the Refusal and is not in the Compact at the start; Lerendor can court it through the Lerendor mechanic. While the Refusal binds it, the diplomacy spec's joining rule `zin_faction_rule_join_no_refusal` keeps it out of the Compact itself. This spec adds no Leren link; no text says it was never a member.

### 7. Nolorim's passes

Nolorim (two states, "southern frontier federation") guards the high passes of the Magical Lands (role proposed). The key sites table marks its states on the eastern coalition's mountain approach as `zin_is_site_nolorim_passes` (proposed site; working answer to the owner question on which approach they guard; both Nolorim states if the map shows no approach).

`zin_elves_pass_watch` (Nolorim, 0–100, start **30**). Changed only through `zin_elves_add_pass_watch` (scoped to Nolorim; a no-op if Nolorim does not exist).

- **Forts.** Every 20 points is one level of land fort in each pass state (`zin_elves_raise_pass_forts`; forts only rise, up to level 5). Start: level 1, built by `zin_elves.1`. The global variable `zin_elves_pass_fort_level` records the level granted; when floor(watch ÷ 20) exceeds it, every pass state gets the missing levels on its border provinces (`add_building_construction = { type = bunker level = <n> instant_build = yes province = { all_provinces = yes limit_to_border = yes } }`).
- **The high passes.** Pass states owned by Nolorim carry the state dynamic modifier **The High Passes** `zin_elves_high_passes`: `enemy_attrition = 0.10`, `enemy_army_speed_factor = -0.10`. At watch 60+ it is replaced by `zin_elves_high_passes_2`: `enemy_attrition = 0.15`, `enemy_army_speed_factor = -0.15`.
- **Wardens for the Passes** (decision, any Magical Lands elven realm except Nolorim; 30 political power; cooldown 180 days): watch +5, kinship +2. Event `zin_elves.40` to Nolorim (thanks; opinion).
- **On `zin_eastern_invasion`:** watch +20 at once (the kin send wardens).
- **The passes are lost** (`zin_elves.41`): when a non-elven enemy controls every pass state: kinship +10; `zin_world_add_gathering_dark` +1; to every Magical Lands elven realm. Once per war.

### 8. The dragons, from the elven side

The magic spec owns the pool (`zin_dragons_free`, proposed 6), the Keeper (`zin_world_is_dragon_keeper`, the owner of the Dragon Mountain state), the Dragon Pact decision and **Bound by Corruption**. Dragons fight on the air layer (S6, warfare dragon flights). The vault says the elven powers command dragons; Afrit can through corruption. This spec adds the bond that the elves keep with the mountain.

**The Keeper.** Proposed: the Magical Forest owns the Dragon Mountain state (its start court has Perlan, Warden of the Dragon Roosts). If the map gives the mountain to another elven realm, that realm is the Keeper and everything below follows it; the Magical Forest's roost focuses then act through opinion of the Keeper.

`zin_elves_roost_bond` (global, 0–100, start **50**): the trust between the Keeper and the dragons. Changed only through `zin_elves_add_roost_bond`.

| Change | Amount |
| --- | ---: |
| Monthly, while the Keeper employs Perlan (`zin_magical_forest_perlan`) or has the spirit *Songs for the Wyrms* (`zin_magical_forest_wyrm_songs` from the Magical Forest tree, or `zin_shared_magical_lands_wyrm_songs` from the shared Magical Lands tree; either counts once) | +0.5 |
| Monthly, while `zin_elves_roost_sickness` is set and `zin_elves_roosts_guarded` is not | −0.5 |
| Decision **Tend the Roosts** (Keeper; 25 political power; cooldown 90 days) | +5 |
| Each Dragon Pact (the runner compares the sum of every country's `zin_world_dragon_pacts` with `zin_elves_pacts_seen`; focus Pacts apply it directly and update the counter) | −10 |
| Each dragon bound by corruption (`zin_elves_on_dragon_corrupted`) | −20 |
| Eindil's dragon entrusted (the runner sees `zin_eindil_dragon_pact` once; guard flag `zin_elves_eindil_dragon_seen`) | −5 |
| The Roost Claim, third option | +5 |

Three rules belong in the magic spec's decisions, which read `zin_elves_roost_bond` ([magic](../03_gameplay/04_magic_and_world_systems.md), "Dragons"):

| Bond | Effect in the magic spec's decisions |
| --- | --- |
| below 40 | The Dragon Pact is not available to non-Keepers ("the dragons will not come for strangers") |
| 70+ | The Dragon Pact costs 100 political power instead of 150 for the Keeper (also with the flag `zin_magical_forest_old_pact`) |
| below 30 | **The Roosts Are Restless:** Bound by Corruption needs `zin_footholds` ≥ 2 in the Keeper instead of 3 |

The last rule matters: the Afrit spec caps footholds in elven realms at 2, so without a restless roost corruption is impossible. A neglected or overused mountain is what lets the Deliverer's servants in.

**When the Pact needs a war.** The magic spec's Pact requires war with a dark power or `zin_gathering_dark` ≥ 50; under the historical rule the Magical Forest takes a Pact in 4A 1755 "when the eastern invasion strikes". This spec provides `zin_elves_dragon_need` (the realm is at war with a dark power, or `zin_elves_eastern_threat`), which the magic spec's Pact uses as its war condition. The focus Pacts below use it directly.

**Pacts taken by focus.** The Magical Forest tree's *Wings Over the Woods* and *Dragons of the March* are the Dragon Pact taken through a focus instead of the decision. They run `zin_elves_focus_dragon_pact`: the magic spec's `zin_world_give_dragon` with `to = ROOT` (pool −1, `zin_war_grant_dragons` amount 1), `zin_world_dragon_pacts` +1 on the realm (the Pact's limit of 3 still counts them), country flag `zin_war_dragon_pact`, bond −10. They need pool ≥ 1 and fewer than 3 Pacts. On the historical path *Wings Over the Woods* **is** the one Pact of 4A 1755; the Magical Forest AI does not take the decision as well while the focus is available or within 365 days after it.

**Corruption.** When Bound by Corruption fires, `zin_elves_on_dragon_corrupted` runs once per bound dragon: called from the immediate effect of the magic spec's report event `zin_world.50` ("A dragon is bound"), and, as a safety net, by the monthly runner when the sum of every country's `zin_world_corrupted_dragons` exceeds `zin_elves_corruptions_seen` (the effect counts itself, so it never runs twice for one dragon). It sets `zin_elves_roost_sickness`; bond −20; event `zin_elves.45` to the Keeper, "A Dragon Flies East": *something called it away; it did not look back*.

- **Guard the roosts** (−50 political power; `zin_afrit_add_footholds` −1 on the Keeper; country flag `zin_elves_roosts_guarded` for 365 days, during which Bound by Corruption is unavailable; bond +5). AI 80.
- **The dragons are free** (nothing). AI 20.

Before `zin_afrit_revealed` the text never says who called the dragon. After it, the text may say the Deliverer's priests were seen on the mountain roads.

**Eindil's dragon.** The journey's event `zin_eindil.88` goes to the Keeper. The Magical Forest focus *A Free Ally From the Mountain* sets `zin_magical_forest_bearer_dragon_ready`, which the journey's event reads to make the AI take the "entrust" option at once (in the journey spec). Entrusting costs bond −5 and never lifts the Refusal (magic spec: a free ally).

### 9. Varner, a Lesser Spirit of the Magical Lands

At the start Varner is legend: the wizard of the Unbinding and his small purple servant. `zin_varner` is defined and recruited by nobody (characters spec). Text never says where he is.

- **Seek the Wizard** (decision, any Magical Lands elven realm with kinship ≥ 30; available when `zin_gathering_dark` ≥ 25, `zin_eindil_named` or `zin_zol_rising`; 50 political power; once every 1,825 days per realm): sets the country flag `zin_elves_varner_sought`. After 60 days, `zin_elves.50` "Word From the Wizard": an unsigned letter in an old hand; nobody says where it came from. The realm gets **Varner's Counsel** `zin_elves_varners_counsel` for 365 days: `research_speed_factor = 0.05`, `stability_factor = 0.03`, and `add_tech_bonus = { bonus = 0.5 uses = 1 category = zin_cat_wards }` (the builder writes the bonus only when the warfare module stages the category `zin_cat_wards`). He is not recruited.
- **With Eindil.** The journey's `zin_eindil.87` "Varner and Golbran" (90 days after the bearer reaches the Magical Forest) recruits them as advisors of the Magical Forest for stage 8. With the Magical Forest focus flag `zin_magical_forest_wizard_found` it fires after 30 days instead (proposed; the journey spec owns the delay and reads the flag).
- **His death.** On `zin_varner_dead` (set by the journey's `zin_eindil.97`), `zin_elves_on_varner_dead` gives every Magical Lands elven realm **The Wizard Is Gone** `zin_elves_wizard_gone` for 365 days: `stability_factor = -0.03`, `war_support_factor = 0.05`; event `zin_elves.51`. No permanent effect: what his death means for the Magical Lands is open in the vault. The Gathering Dark change for his death belongs to the tension spec.

### 10. The Worshipdom in their midst

The Worshipdom holds three valleys of the Zilin Hills inside the Magical Lands. Until `zin_afrit_revealed` it is, to every elf, a hermitage of pilgrims, healers and couriers. Its public face is Light, stance `zin_light_sanctuary`, led by "Aurevan the Deliverer" (D1; in game today). It turns Shadow only with `zin_afrit_revealed`. Pilgrims from every court cross elven roads to reach it. Every country except Volgan, Demon, Dolon, Nezer and Zol starts with the opinion "Pilgrim Road" (`zin_opinion_pilgrim_road`, +10) toward it (start-situation spec).

**Pilgrim-road policy** (pilgrim-road realms; country variable `zin_elves_pilgrim_roads`, start 2 = open). Decisions in category `zin_elves_kin`, cooldown 180 days each:

| Policy | Value | Effect |
| --- | ---: | --- |
| **Open the Roads to Pilgrims** | 2 | Idea `zin_elves_pilgrim_roads_open`: `stability_factor = 0.02`, `production_speed_buildings_factor = 0.03`. Every 12 months of open roads, `zin_afrit_add_footholds` +1 on the realm (within the elven cap) |
| **Toll the Pilgrims** | 1 | Idea `zin_elves_pilgrim_tolls`: `political_power_gain = 0.05`; Worshipdom opinion −10 (`zin_opinion_pilgrim_tolls`) |
| **Close the Pilgrim Roads** | 0 | No idea; on closing, `zin_afrit_add_footholds` −1 on the realm; Worshipdom opinion −25 (`zin_opinion_pilgrim_roads_closed`) |

`zin_elves_set_pilgrim_roads` (argument `value`) applies a policy; the decisions and focuses call it. The twelve-month counter is the country variable `zin_elves_pilgrim_months`.

The Worshipdom tree's *Friends Among the Elves* sends the Magical Forest `zin_worshipdom.3` (a non-aggression pact). The Magical Forest's AI answer is this spec's (the Worshipdom tree writes the event with these weights): grant 70 before the reveal (it is a quiet neighbour), 0 after.

**After the reveal.** On `zin_afrit_revealed`, every Magical Lands elven realm gets `zin_elves.60` "The Temple in the Hills":

- **Close every road** (policy 0 at once; `zin_afrit_add_footholds` −2). AI 80.
- **Watch and wait** (nothing). AI 20.

The Worshipdom becomes a dark power (diplomacy's `zin_diplo_is_dark_power`). Driving it out of the Zilin Hills is the elves' own defence, not help to men: the Magical Forest tree's *Drive Out the Temple* gives a war goal; it does not need `zin_refusal_lifted`. Under the historical rule the AI closes the roads and does not attack.

### 11. The eastern invasion

The eastern kings spec runs the coalition: it gathers 30 days after `zin_war_of_last_crowns`, crosses the rift 30 days later, declares war (`take_state_focus`) on up to three Magical Lands realms that own `zin_is_site_rift_west` states, and sets `zin_eastern_invasion`. 120 days later, or on 1 Deepwinter 4A 1756 under the historical path, it turns west against Aenor. The invasion does not break the Wall Accord.

This spec adds the elven response. When `zin_eastern_invasion` is set, the eastern kings spec's `zin_east.43` calls `zin_elves_on_eastern_invasion` ([eastern_kings.md](eastern_kings.md), section 5 step 4). As a safety net, the elves' monthly runner also calls it the first month it finds `zin_eastern_invasion` without the global flag `zin_elves_invasion_answered`; the effect sets that flag first, so it runs once. It:

1. Fires `zin_elves.70` "Sails on the Rift Sea" to every Magical Lands elven realm and to Aenor (news; no reveal of who stands behind the coalition).
2. Kinship +15; the Kindred becomes ready; *Raise the Kindred* costs 0.
3. Gives every Magical Lands elven realm at war with an East Lands country (capital in a `zin_is_region_east_lands` state) **Every Tree a Wall** `zin_elves_woods_defended` (`army_defence_factor = 0.10`, `army_core_defence_factor = 0.10`, `war_support_factor = 0.10`), renewed monthly while that war lasts and removed at peace.
4. Pass watch +20.
5. Makes `zin_elves_eastern_threat` true for rift realms and Kindred members at war with the coalition, which opens the Dragon Pact's war condition (section 8).
6. Sends Aenor and Kingson `zin_elves.71` "Elven Envoys at the Gate": *Keep the gates shut to all* (nothing; AI 70) / *Offer Aenoran companies* (the Magical Forest gets `zin_elves.72`: accept, as section 5.5 *Open the Wall Gates*, AI 20, historical ×0.5; or *We defend our own*, AI 80).

**Peace.** When an invader holds no Magical Lands state, `zin_elves.73` "The Rift Is Quiet" offers each elven realm at war with it a white peace (AI: 90; 20 if the realm took *Carry the War Across the Rift*). Elves do not pursue on the historical path.

**What the vault leaves open.** The vault says the coalition threatened the Magical Lands and later fought in the Middle Lands; it does not say how the elves fared. No event text states an outcome.

### 12. Gathering Dark from this spec

Only through `zin_world_add_gathering_dark`: Close the Wall Roads +1; the Feud of the Groves +2; the passes lost +1. The eastern invasion, dragons bound by corruption, the Wall breached and Varner's death are counted by their owners.

## Implementation

### Builder module and data

Everything below is written by a new content-builder module, `tools/content/modules/mech_elves.mjs` (`buildElves(staged, countries, …)`), called from `tools/content/build.mjs` after `characters` and before `vanilla_removal` (so the C3 reference scan sees its definitions), and applied in the same atomic transaction as the rest of the build. Nothing is hand-edited.

| Input | What the module reads |
| --- | --- |
| `tools/content/data/mechanics/elves.json` (new) | Every number of this spec (start values, drifts, costs, cooldowns, thresholds, AI weights), the decision and event tables, the picture key per event |
| `tools/content/data/countries.json`, `docs/design/countries.csv` | The Magical Lands elven realms (sheet "Magical Lands", people `elves`), and the tags of the Magical Forest, Herrodon, Andos Enda, Nolorim, Aenor, Kingson and the Worshipdom |
| `presentation-cells.json` (presentation module) | Checks that every picture and icon key named in the data exists with the right crop |
| Whether the warfare module staged `zin_cat_wards` | Writes Varner's research bonus only if it did |

No interim stub is replaced. The test file is `tools/content/mech_elves.test.mjs` (new), added to the `npm test` script in `tools/package.json` when the module lands.

### Files (all generated by `mech_elves.mjs`)

| Path | Content |
| --- | --- |
| `common/scripted_effects/zin_elves.txt` | Effects below |
| `common/scripted_triggers/zin_elves.txt` | Triggers below, including the generated `zin_elves_is_magical_realm` |
| `common/decisions/zin_elves.txt`, `common/decisions/categories/zin_elves.txt` | Categories `zin_elves_kin`, `zin_elves_wanderers`, `zin_elves_roosts` |
| `common/ideas/zin_elves.txt` | Ideas below (not `zin_elves_the_old_refusal`, which the start-situation module defines) |
| `common/dynamic_modifiers/zin_elves.txt` | `zin_elves_high_passes`, `zin_elves_high_passes_2`, `zin_elves_wandering_paths` (used by the Magical Forest tree) |
| `common/opinion_modifiers/zin_elves.txt` | Opinion modifiers below |
| `common/factions/templates/zin_elves.txt` | Template `zin_faction_kindred` (proposed addition beside the diplomacy spec's templates) |
| `common/factions/rules/zin_elves_rules.txt` | Joining rule `zin_faction_rule_join_elven_kin` |
| `common/factions/goals/zin_elves_manifest.txt` | Manifest `zin_faction_manifest_kindred` |
| `common/on_actions/zin_elves.txt` | `on_startup` → `zin_elves.1`; `on_monthly_<Magical Forest tag>` → `zin_elves_monthly`; `on_monthly` (every country) → the fallback runner, only when the Magical Forest does not exist and the country is the Magical Lands elven realm with most states; `on_capitulation` (passes lost, Kindred defence) |
| `common/ai_strategy/zin_elves.txt` | Strategies in the AI section |
| `events/zin_elves.txt` | Namespace `zin_elves`, ids 1–99 for this spec (the Lands of the Sun spec uses `zin_sun`; the Magical Forest tree `zin_magical_forest`) |
| `localisation/english/zin_elves_l_english.yml` | All text (UTF-8 with BOM) |

### Variables and flags

| Name | Kind | Range / start | Meaning |
| --- | --- | --- | --- |
| `zin_elves_kinship` | global variable | 0–100 / 35 | Unity of the Magical Lands elves |
| `zin_elves_rivalry` | global variable | 0–100 / 45 | Herrodon–Andos Enda heat |
| `zin_elves_wall_grievance` | global variable | 0–100 / 25 | Elven anger at the Wall customs |
| `zin_elves_roost_bond` | global variable | 0–100 / 50 | The Keeper's bond with Dragon Mountain |
| `zin_elves_pass_watch` | Nolorim variable | 0–100 / 30 | The high-pass watch |
| `zin_elves_pilgrim_roads` | country variable | 0–2 / 2 | Pilgrim-road policy |
| `zin_elves_pilgrim_months` | country variable | 0–12 | Months of open roads since the last foothold |
| `zin_elves_wanderers_out` | country variable | 0–3 | Active Wanderer missions |
| `zin_elves_kindred_formed` | global flag | — | The Kindred exists |
| `zin_elves_wall_roads_closed` | global flag | — | The elves have closed the Wall roads |
| `zin_elves_feud` | global flag | — | The Feud of the Groves is running |
| `zin_elves_march` | global flag | — | An elven realm has marched beyond its own defence (Magical Forest tree) |
| `zin_elves_roost_sickness` | global flag | — | A dragon has been bound by corruption |
| `zin_elves_roosts_guarded` | country flag, 365 days | — | Bound by Corruption unavailable |
| `zin_elves_roosts_sealed` | country flag | — | The Keeper sealed the roosts (*The Secret Roosts*); Bound by Corruption unavailable |
| `zin_elves_varner_sought` | country flag | — | The realm sought Varner |
| `zin_elves_wanderers_extra` | country flag | — | Defined here, set by the regional and shared Magical Lands trees' healer focuses: 3 Wanderer missions, 10 political power cheaper (section 4.2) |
| `zin_elves_invasion_answered` | global flag | — | `zin_elves_on_eastern_invasion` has run |
| `zin_elves_ai_marcher` | country flag | set by `zin_elves.1` | Under `zin_rule_ai_elves = RANDOM`, this AI realm marches (also read by the diplomacy spec's march way) |
| `zin_elves_monthly_done` | global flag, `days = 25` | — | Guards the fallback runner so it runs once a month |
| `zin_elves_wall_realm`, `zin_elves_rift_realm`, `zin_elves_pilgrim_realm` | country flags | set by `zin_elves.1` | The startup lists (section 2) |
| `zin_elves_cold_roads` | global flag | — | Grievance 50+ (cleared below 40); read by the economy spec's Wall customs |
| `zin_elves_pass_fort_level` | global variable | 1–5 / 1 | Fort levels granted in the pass states |
| `zin_elves_pacts_seen`, `zin_elves_corruptions_seen` | global variables | ≥0 / 0 | Dragon Pacts and corruptions the runner has already counted |
| `zin_elves_eindil_dragon_seen` | global flag | — | The entrusted dragon has cost its bond |

### Scripted triggers

| Trigger | Scope | True when |
| --- | --- | --- |
| `zin_elves_is_magical_realm` | country | Generated: `original_tag` is one of the Magical Lands elven realms (section 2) |
| `zin_elves_is_wall_realm`, `zin_elves_is_rift_realm`, `zin_elves_is_pilgrim_road_realm` | country | Has `zin_elves_wall_realm`, `zin_elves_rift_realm` or `zin_elves_pilgrim_realm` |
| `zin_elves_kindred_exists` | any | `zin_elves_kindred_formed` |
| `zin_elves_kindred_ready` | any | Section 3.2 |
| `zin_elves_eastern_threat` | country | Magical Lands elven realm at war with a country whose capital is in a `zin_is_region_east_lands` state and that controls a Magical Lands state, or a rift realm with `zin_eastern_invasion` set and at war with the coalition leader (`zin_east_coalition_leader`) |
| `zin_elves_dragon_need` | country | `zin_elves_is_magical_realm`, and at war with a country for which `zin_diplo_is_dark_power` is true, or `zin_elves_eastern_threat` |
| `zin_elves_march_allowed` | country | Section 4.3 |
| `zin_elves_marches_by_rule` | country | Section 4.3: `zin_rules_ai_branch_elves_march`, or `zin_rules_ai_random_elves` and `zin_elves_ai_marcher` |
| `zin_elves_refusal_question_open` | any | `zin_golden_king_dead`, or `zin_eindil_named`, or `zin_eastern_invasion`, or after 1 Thaw 4A 1751 (`1751.3.1`) |
| `zin_is_site_nolorim_passes`, `zin_is_site_boundary_groves` | state | Read, not defined here: key sites table (`common/scripted_triggers/zin_sites.txt`) |

### Scripted effects

| Effect | Scope | Arguments | Does |
| --- | --- | --- | --- |
| `zin_elves_add_kinship`, `zin_elves_add_rivalry`, `zin_elves_add_wall_grievance`, `zin_elves_add_roost_bond` | any | `value` | Add and clamp 0–100; grievance also applies the 50 and 40 thresholds |
| `zin_elves_add_pass_watch` | any | `value` | On Nolorim if it exists; clamps; calls `zin_elves_raise_pass_forts` |
| `zin_elves_raise_pass_forts` | any | — | Raises forts in every pass state to floor(watch ÷ 20), never lower than `zin_elves_pass_fort_level`, max 5 (section 7); refreshes `zin_elves_high_passes` / `_2` |
| `zin_elves_raise_kindred` | country (leader) | — | Section 3.2 |
| `zin_elves_join_kindred` | elven realm | — | Option *Stand with the kin* as an effect (also called by regional trees) |
| `zin_elves_begin_feud` | Herrodon or Andos Enda | `attacker` | The feud decision's effect (also called by Herrodon's and Andos Enda's focuses behind the same gates) |
| `zin_elves_join_kin_defence` | any | — | Section 3.2 |
| `zin_elves_sync_refusal` | country | — | Section 4.1 |
| `zin_elves_close_wall_roads`, `zin_elves_reopen_wall_roads` | any | — | Section 5.1 |
| `zin_elves_set_pilgrim_roads` | country | `value` | Section 10 |
| `zin_elves_goodwill` | country | `target` | `add_opinion_modifier` `zin_opinion_elven_goodwill` both ways |
| `zin_elves_on_eastern_invasion` | any | — | Section 11; guarded by `zin_elves_invasion_answered`; called by the eastern kings spec's `zin_east.43` and, as a safety net, by the runner |
| `zin_elves_on_dragon_corrupted` | any | — | Section 8; called by `zin_world.50` and by the runner's corruption count; counts itself in `zin_elves_corruptions_seen` so it runs once per dragon |
| `zin_elves_focus_dragon_pact` | country (the taker) | — | Section 8: a Dragon Pact through a focus |
| `zin_elves_on_varner_dead` | any | — | Section 9 |
| `zin_elves_monthly` | runner | — | Drifts of kinship, rivalry, grievance and bond; pilgrim months; Wanderer counters; Kindred defence and dissolution; refusal sync; thresholds; the Pact, corruption and entrusted-dragon counts; the eastern-invasion check; renewal of `zin_elves_woods_defended`; last, `mark_focus_tree_layout_dirty` for every Magical Lands elven realm (decision E4), so the elven trees' branches that read these variables refresh |

The runner is called from `on_monthly_<Magical Forest tag>`; if the Magical Forest does not exist, from `on_monthly` for the Magical Lands elven realm with the most states, guarded by `zin_elves_monthly_done` so it runs once a month.

Effects of other specs this spec calls: `zin_world_add_gathering_dark` (tension), `zin_world_give_dragon` (magic), `zin_war_grant_dragons` through it (warfare), `zin_afrit_add_footholds` (Afrit), `zin_economy_add_gold` (economy). The build fails if any is missing.

**Arguments** (decision E1). Scripted effects take no parameters in 1.19.3: each argument in the table compiles to a temporary variable `zin_arg_<name>` set just before the call (`zin_arg_value`; `zin_arg_target` and `zin_arg_attacker` hold a country). **Timeouts** (E2): every `zin_elves` event sets `timeout_days = 30` and takes its first option on timeout; none decides a historical checkpoint, so the option orders stay as written.

**Factions.** The template, joining rule and manifest of the Kindred are written by this module; the diplomacy spec lists them among the factions formed in play, and its one joining-rule group `zin_rule_group_joining` names `zin_faction_rule_join_elven_kin`.

### Ideas

| Id | Name | Modifiers | Added / removed |
| --- | --- | --- | --- |
| `zin_elves_the_old_refusal` | The Old Refusal | `justify_war_goal_time = 1.0`, `drift_defence_factor = 0.20` | Defined and applied by the start-situation module; swapped by `zin_elves_sync_refusal` (listed here for the swap, not written by this module) |
| `zin_elves_refusal_set_aside` | The Refusal Set Aside | `war_support_factor = 0.05`, `drift_defence_factor = 0.10` | While `zin_refusal_lifted` |
| `zin_elves_wanderers_lore` | Elven Wanderers | `research_speed_factor = 0.03`, `stability_factor = 0.02` | Timed, 365 days, on the target |
| `zin_elves_wanderers_lore_gala` | Healers of Gala | `research_speed_factor = 0.05`, `stability_factor = 0.02` | As above, in its place, when the sender is the Gala Elves with `zin_gala_healers` |
| `zin_elves_wanderers_wardens` | Elven Wardens Among Us | `army_org_factor = 0.03`, `recon_factor = 0.10`, `army_morale_factor = 0.03` | Timed, 180 days, on the target |
| `zin_elves_wall_roads_shut` | Roads Shut at the Wall | `consumer_goods_factor = 0.02`, `drift_defence_factor = 0.05` | While the roads are closed |
| `zin_elves_pilgrim_roads_open` | Pilgrims on Our Roads | `stability_factor = 0.02`, `production_speed_buildings_factor = 0.03` | Policy 2 |
| `zin_elves_pilgrim_tolls` | Tolls on the Pilgrim Roads | `political_power_gain = 0.05` | Policy 1 |
| `zin_elves_varners_counsel` | Varner's Counsel | `research_speed_factor = 0.05`, `stability_factor = 0.03` | Timed, 365 days |
| `zin_elves_wizard_gone` | The Wizard Is Gone | `stability_factor = -0.03`, `war_support_factor = 0.05` | Timed, 365 days, on `zin_varner_dead` |
| `zin_elves_woods_defended` | Every Tree a Wall | `army_defence_factor = 0.10`, `army_core_defence_factor = 0.10`, `war_support_factor = 0.10` | While at war with an eastern invader |
| `zin_elves_gates_barred` | The Gates Are Barred | `stability_factor = 0.05` | Timed, 180 days, on Bar the Wall Gates |

Idea pictures are icon-catalog keys (`picture = zin_<key>`): set aside `banner_plain`; Wanderers `healer_herbs`; Wardens `ranger_cloak`; roads shut `charter_wall`; pilgrims `courier_pilgrim`; tolls `toll_house`; Varner's Counsel `wizard_tower`; the Wizard Is Gone `scroll_sealed`; Every Tree a Wall `forest_ancient`; gates barred `fort_wall`.

State dynamic modifiers: `zin_elves_high_passes` (`enemy_attrition = 0.10`, `enemy_army_speed_factor = -0.10`) and `zin_elves_high_passes_2` (watch 60+: 0.15 and −0.15).

### Opinion modifiers

| Id | Value | Decay | Use |
| --- | ---: | --- | --- |
| `zin_opinion_elven_goodwill` | +15 | 0.25 a month | Mediation, Moots, compensations, focuses |
| `zin_opinion_kindred` | +20 | none; removed on leaving | Among Kindred members |
| `zin_opinion_cold_roads` | −10 | none; removed when grievance < 40 | Wall realms → Aenor |
| `zin_opinion_wall_roads_closed` | −15 | none; removed on reopening | Both ways |
| `zin_opinion_feud_of_groves` | −30 | 0.5 a month after peace | Herrodon ↔ Andos Enda |
| `zin_opinion_pilgrim_tolls`, `zin_opinion_pilgrim_roads_closed` | −10, −25 | none; removed on policy change | Worshipdom → realm |

### Decisions

Costs are political power unless stated. Ids are `zin_elves_<key>`.

| Decision (id) | Category | Who | Cost | Section |
| --- | --- | --- | --- | --- |
| Call the Elder Moot (`zin_elves_call_elder_moot`) | `zin_elves_kin` | Magical Forest | 50 | 3.1 |
| Raise the Kindred (`zin_elves_raise_the_kindred`) | `zin_elves_kin` | Magical Forest (or largest realm) | 75 / 0 | 3.2 |
| Mediate Between Herrodon and Andos Enda (`zin_elves_mediate_rivals`) | `zin_elves_kin` | Magical Forest | 50 | 6 |
| Settle the Feud of the Groves (`zin_elves_settle_the_feud`) | `zin_elves_kin` | Herrodon, Andos Enda | 50 | 6 |
| Wardens for the Passes (`zin_elves_wardens_for_the_passes`) | `zin_elves_kin` | Magical Lands elven realms except Nolorim | 30 | 7 |
| Call a Wall Moot at the Gate (`zin_elves_call_wall_moot`) | `zin_elves_kin` | Magical Forest, wall realms | 50 / 25 | 5.2 |
| Close / Reopen the Wall Roads (`zin_elves_close_the_wall_roads`, `zin_elves_reopen_the_wall_roads`) | `zin_elves_kin` | Magical Forest | 50 / 25 | 5.1 |
| Open / Bar the Wall Gates (`zin_elves_open_wall_gates`, `zin_elves_bar_wall_gates`) | `zin_elves_kin` | Magical Forest with `zin_magical_forest_wall_gates` | 25 / 0 | 5.5 |
| Open / Toll / Close the Pilgrim Roads (`zin_elves_pilgrim_roads_open_decision`, `_toll_decision`, `_close_decision`) | `zin_elves_kin` | Pilgrim-road realms | 0 / 25 / 25 | 10 |
| Seek the Wizard (`zin_elves_seek_the_wizard`) | `zin_elves_kin` | Magical Lands elven realms | 50 | 9 |
| Send Healers and Loremasters (`zin_elves_send_healers`); Send Wardens to a Friend in Need (`zin_elves_send_wardens`), both targeted | `zin_elves_wanderers` | Every elven realm | 35; 50 + 1,000 manpower | 4.2 |
| Tend the Roosts (`zin_elves_tend_the_roosts`) | `zin_elves_roosts` | The Keeper | 25 | 8 |

Decision ids never equal an idea, focus or effect id (the pilgrim-road decisions carry `_decision` because the ideas use the policy names).

### Events (namespace `zin_elves`)

| Id | Title | For | Trigger | Options | Picture |
| --- | --- | --- | --- | --- | --- |
| `.1` | (hidden) | — | `on_startup` | Sets variables, the startup lists, level-1 pass forts and the pilgrim-road ideas | — |
| `.5` | A Wall Moot at the Gate | Aenor | decision | Hear the elves / The crown's tolls stand | `concord_council` |
| `.6` | The Crown Answers | caller | `.5` | Result | `concord_council` |
| `.7` | Dragon Over the Wall | Keeper | trigger + `mean_time_to_happen` 720 days | Pay the herdsmen / The dragons are free | `generic_wilds` → `dragon_roosts` |
| `.8` | Herds Lost Below the Wall | Aenor | `.7` | Result | `generic_wilds` → `dragon_roosts` |
| `.9` | The New King's Customs | wall realms | `zin_aurevan_crowned` | Accept / The woods keep no temples | `concord_council` |
| `.10` | The Wall Roads Are Closed | Aenor, Kingson, wall realms (news) | roads closed | Acknowledge | `generic_court` |
| `.20` | The Boundary Groves | Herrodon | MTTH 540 | section 6 | `generic_wilds` → `elven_moot` |
| `.21` | A Slight Remembered | Andos Enda | MTTH 540 | section 6 | `generic_wilds` → `elven_moot` |
| `.22` | The Roost Claim | Keeper | MTTH 540 | section 6 | `generic_wilds` → `dragon_roosts` |
| `.23` | The Rivals Hear Mediation | Herrodon, Andos Enda | mediation | Result | `generic_wilds` → `elven_moot` |
| `.24` | The Feud of the Groves | Magical Lands elves (news) | feud decision | Acknowledge | `generic_war` |
| `.25` | An End to the Feud? | Herrodon, Andos Enda | feud war 365 days | White peace / Fight on | `generic_wilds` → `elven_moot` |
| `.30` | The Elder Moot | Magical Forest | decision | section 3.1 | `generic_wilds` → `elven_moot` |
| `.31` | The Kindred of the Woods | Magical Lands elven realms | raised | Stand with the kin / Keep our own counsel | `generic_wilds` → `elven_moot` |
| `.32` | The Kindred Is Raised | all Magical Lands countries, Aenor (news) | raised | Acknowledge | `generic_war` |
| `.40` | Wardens for the Passes | Nolorim | decision | Thanks | `generic_wilds` |
| `.41` | The Passes Are Lost | Magical Lands elves | all pass states lost | Acknowledge | `generic_war` |
| `.45` | A Dragon Flies East | Keeper | `zin_elves_on_dragon_corrupted` | Guard the roosts / The dragons are free | `generic_wilds` → `dragon_roosts` |
| `.50` | Word From the Wizard | seeker | 60 days after Seek the Wizard | Accept | `generic_wilds` |
| `.51` | The Wizard Is Gone | Magical Lands elves | `zin_varner_dead` | Acknowledge | `generic_court` |
| `.55`, `.56` | Elven Wanderers Arrive / Elven Wardens Arrive | target | Wanderer decisions | Welcome | `generic_peace` |
| `.60` | The Temple in the Hills | Magical Lands elves | `zin_afrit_revealed` | Close every road / Watch and wait | `unmasking` (gate `zin_afrit_revealed`) |
| `.70` | Sails on the Rift Sea | Magical Lands elves, Aenor (news) | `zin_eastern_invasion` | Acknowledge | `generic_sea` → `rift_sails` |
| `.71` | Elven Envoys at the Gate | Aenor, Kingson | `zin_eastern_invasion` | Keep the gates shut / Offer companies | `generic_sea` → `rift_sails` |
| `.72` | Aenor Offers Companies | Magical Forest | `.71` B | Accept / We defend our own | `generic_sea` → `rift_sails` |
| `.73` | The Rift Is Quiet | elven realms at war with an invader | invader holds no Magical Lands state | White peace / Fight on | `generic_sea` → `rift_sails` |

**Pictures** are icon-catalog keys (`GFX_zin_evt_<key>` for country events, `GFX_zin_news_<key>` for news). Every key before an arrow exists in game today with the crop the event needs (news events use keys with a news crop). The key after an arrow is a picture requested from the art pipeline and already listed in the catalog's requested keys: `dragon_roosts` (dragons circling a smoking peak, seen from elven woods; no gate), `elven_moot` (seats in a ring under silver trees; no gate), `rift_sails` (sails on a narrow sea seen from a wooded shore; gate `zin_eastern_invasion`); the builder switches to it once its art is accepted.

No `zin_elves` text names Afrit, calls the Deliverer or the Worshipdom dark before `zin_afrit_revealed`, says where Varner is, or says the elves will march.

### Game rules and defines

No new rule: `zin_rule_ai_elves` (defines spec) and `zin_rule_historical_path` govern the AI. No new define.

## AI

- **Peace (4A 1748–1754).** The Magical Forest AI calls the Elder Moot when kinship ≥ 40, mediates whenever rivalry ≥ 70 (historical) or ≥ 80 (otherwise), calls a Wall Moot when grievance ≥ 50, tends the roosts when bond < 50, and sends Healers and Loremasters to friendly Light realms (at most one a year). It never closes the Wall roads under `HISTORICAL`.
- **Rivals.** Herrodon and Andos Enda AI take the feud decision only under `FREE` and only at rivalry ≥ 95 with at least 365 days since the last mediation.
- **Pilgrim roads.** AI keeps roads open (historical), tolls them when political power is short, closes them after the reveal (80%).
- **Eastern invasion.** On `zin_eastern_invasion`: raise the Kindred within 30 days; `prepare_for_war` and `front_unit_request` toward rift states; take the Dragon Pact (magic spec) if bond ≥ 40; Wardens for the Passes once; never invade the East Lands under `HISTORICAL`; accept `.73` white peace.
- **Wanderers to friends in need.** After `zin_war_of_last_crowns`, the Magical Forest and Gala AI send wardens to one Light country at war with a dark power every 180 days.
- **Rule settings.** "Historical" above means `zin_rules_is_historical`. Under `PLAUSIBLE` the AI uses the historical choices with half their weight bonus and may take the other options; under `FREE` it follows its interests (feud at rivalry ≥ 95, roads closed at grievance ≥ 75, the march when `zin_elves_march_allowed`).
- **Strategies** (`common/ai_strategy/zin_elves.txt`): `befriend` 30 among Magical Lands elves; `antagonize` 15 between Herrodon and Andos Enda while rivalry ≥ 60; (`dont_join_wars_with` from bound realms toward human realms is the diplomacy spec's and is not repeated here); `protect` 50 by the Magical Forest for every Kindred member while at war.

## Acceptance

Each line says how it is decided: **(a)** a build test in `tools/content/mech_elves.test.mjs` (`npm test` in `tools/`), **(b)** the isolated Linux run (one in-game year from phase 3 on, S8; `error.log` has no new lines from ZIN files), **(c)** a scripted scenario run with HOI4 Agent Tools (`hoi4_scenario_test` / `hoi4_mechanic_test`) on the mod source.

1. **(c)** On 1 Thaw 4A 1748: kinship 35, rivalry 45, grievance 25, bond 50, pass watch 30 with level-1 forts in every pass state; no elven realm at war, with a claim, or in a faction; Wall and pilgrim roads open; `zin_elves_kindred_formed`, `zin_elves_feud`, `zin_elves_roost_sickness` not set; the wall, rift and pilgrim-road flags are set on the realms the startup rules give.
2. **(a)** No `zin_elves` localisation line reachable before `zin_afrit_revealed` names Afrit or calls the Deliverer or the Worshipdom dark (the compiler's secret scan); no line names a place for Varner (the scan finds no state, victory-point or region name in `.50`, `.51`, `zin_elves_varners_counsel` or `zin_elves_wizard_gone`); no line says the elves march or that Andos Enda was never in the Compact.
3. **(a)** Every id this spec defines is defined once; `zin_elves_the_old_refusal` is defined only by the start-situation module; every effect, trigger and event it calls from another spec is defined somewhere in the build; no name retired by N6 or the contract register appears in a `zin_elves` file; every modifier key is in the 1.19.3 modifier documentation; every picture and icon key exists with the crop its event needs.
4. **(c)** A 4A 1748–1760 historical run: the Kindred is raised within 60 days of `zin_eastern_invasion`; at least two rift realms join it; the Magical Forest takes one Dragon Pact in 4A 1755–1756; no Magical Lands elven realm sets `zin_refusal_lifted` before `zin_zol_manifested`; Herrodon and Andos Enda never fight; the Wall roads are never closed; `zin_wall_accord_broken` is not set.
5. **(c)** A Wanderer decision never moves a division, never sets `zin_refusal_lifted` and never adds a faction member; the sender loses 1,000 manpower for wardens.
6. **(c)** Kindred defence adds members to wars only against non-elven enemies holding a member's state; the Kindred never invites a non-elven country and dissolves 730 days after its last war.
7. **(c)** With bond < 30 and footholds 2 in the Keeper, the magic spec's Bound by Corruption becomes available after the reveal; with bond ≥ 30 it does not. One corruption fires `zin_world.50`, which runs `zin_elves_on_dragon_corrupted`; the runner's count does not run it a second time.
8. **(c)** `zin_elves_add_pass_watch` to 60 gives level-3 forts on the border provinces of every pass state and `zin_elves_high_passes_2`; lowering the watch never lowers a fort.
9. **(c)** Forcing `zin_eastern_invasion` gives `zin_elves_woods_defended` to every attacked realm, adds 20 to pass watch and 15 to kinship, and fires `.70` and `.71` once, whether the eastern hook calls `zin_elves_on_eastern_invasion` or the runner finds the flag (both wired: still once).
10. **(c)** A focus Pact (*Wings Over the Woods*) lowers `zin_dragons_free` by 1, raises `zin_world_dragon_pacts` by 1, lowers the bond by 10 exactly once, and is refused at 3 Pacts or an empty pool.
11. **(c)** No AI elven realm takes Break the Refusal or the march focus under `zin_rules_is_historical` with `zin_rule_ai_elves = DEFAULT` (12-year run).
12. **(b)** The one-year Linux run from the start adds no `error.log` line from `zin_elves` files or from `common/factions/*/zin_elves*`.
13. **(a)** `zin_elves_monthly` calls `mark_focus_tree_layout_dirty`; `zin_elves.1` sets `zin_elves_ai_marcher` only under `RANDOM` and only on AI elven realms; no `zin_elves` script reads `zin_rules_ai_branch_elves_march` directly except inside `zin_elves_marches_by_rule`.
14. **(c)** A Healers and Loremasters mission from the Gala Elves with `zin_gala_healers` and `zin_gala_friends_not_allies` costs 25 political power and gives `zin_elves_wanderers_lore_gala`; the bond rises 0.5 a month for a Keeper holding `zin_shared_magical_lands_wyrm_songs`.

## Open questions

Decided, no longer open here: Andos Enda is not in the Leren Compact at the start and Lerendor can court it (S5); the elves' start opinion of Aenor is `zin_opinion_old_estrangement` (N6); dragons use the air layer (S6); the Worshipdom shows Light until the reveal (D1).

Owner questions, listed in [../OPEN_QUESTIONS.md](../OPEN_QUESTIONS.md) (section "elves"); the work proceeds on each proposal:

1. Who keeps Dragon Mountain at the start? **Proposal:** the Magical Forest (its court has Perlan, Warden of the Dragon Roosts); every rule follows whichever elven realm owns the state.
2. May the Magical Lands elves march at all in a far-diverged game (the Kindred Marches, also opened by `zin_zol_manifested`)? **Proposal:** yes, as a player choice and under `zin_rule_ai_elves = MARCH`; never under the historical rule, and no text says they marched.
3. Is an elves-only defensive league (the Kindred of the Woods) acceptable under the Refusal? **Proposal:** yes; it never takes in men and never helps men.
4. Do timed healers, loremasters and wardens (the Wanderers) fit "individual travellers, healers or independent figures"? **Proposal:** yes, as timed ideas with no troops.
5. May a realm receive an unsigned letter from Varner before Eindil returns? **Proposal:** yes, if no text says where he is.
6. After the reveal, may the elves take the Zilin Hills by war (*Drive Out the Temple*)? **Proposal:** yes, as their own defence; the historical AI only closes its roads.
7. Which approach do Nolorim's high passes guard? **Proposal:** the eastern coalition's mountain approach (key sites row).
8. May the elves close the Wall roads (a customs quarrel short of war)? **Proposal:** yes; closing never breaks the Accord, and the historical AI never closes them.
