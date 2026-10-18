# Volgan and the Southern Dominion

**Status:** Draft. **Priority:** 3. **Phase:** 3.

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
| The start: the Golden King reigns, Eindil has not appeared, Afrit is unrevealed, Erdae seems at peace. | owner, 18 October 2026 |

### Proposed (this spec or the vault's proposed notes)

- Dates: Volgan's strength returns about 4A 1650, when Demon, Dolon and Nezer swear to him; Mirolon fortifies its passes; a Mirolonese envoy is laughed out of Parim in 4A 1736 (vault *Fourth Age Chronology*, proposed). The 1755 reconquest and 1757 destruction dates are proposed.
- Every mechanism below: dominion strength numbers, the Veil of Storms, grave musters, member oaths, the Nether pact, Abyss envoys, Dark Lands pacts, Mirolon's proof and passes, the Black Compact, the Silent Throne and the Steward.
- Names: the Veil of Storms, the Black Compact, the Silent Throne, the Ember Herald, the Grave-Warden, Ghorvak of the Hundred Clubs, the Warden League, High Warden Maeric, Captain Selda Varrow, Scout-Master Hadric Thorne. All proposed.
- Mirolon's government: a free human realm whose High Warden is chosen for life by the pass-lords and lake towns. This reconciles the vault's "human kingdom" with the map's Light ideology and `zin_light_wardens` stance. Proposed; see open questions.

### Rules this spec keeps

- No text before `zin_afrit_revealed` names Afrit or calls the Deliverer a demon. Volgan's texts about the Abyss speak only of "a thief from the north".
- No text states whether Volgan's spirit survived, what the King of Demons owes Volgan, what became of Roka, or where Dardan lies.
- At the start nobody is at war. Nothing in this mechanic can start a war before 1 Deepwinter 4A 1750, and the AI waits for the War of the Last Crowns on the historical path.

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

**Monthly change** (hidden pulse, every 30 days):

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

**Effect:** a dynamic modifier `zin_dominion_hosts` whose values scale with strength *S*:

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
| 70 | `zin_volgan_great_host` | Break the Veil early; the March North (AI on the historical path needs only 60 after 1 Rainwake 1755) |
| 85 | — | Focus "A Host Greater Than the First Age" |
| 60 | `zin_volgan_children_ready` (part) | Children of Volgan ending, with other conditions |

### 2. The Veil of Storms

`zin_volgan_veil` (new, Volgan, 0 to 100) measures how well the storms, heat and silence of the Dead Lands hide the rebuilding. Everyone knows Volgan exists. The veil hides how strong he has become.

**Start:** 85.

**Monthly:** +1.5 while not at war, below 85, and no grave muster in the last 30 days; +0.5 more with spirit `zin_volgan_storm_rites`.

**Lowered by:** grave musters (−1 to −2, none for "Muster Beneath the Storms"), visible focuses (claims, wargoals), Mirolon's scouting (−3 to −5), Mirolon's proof reaching 75 (−10). **Set to 0** by Break the Veil, the Great Muster or the March North.

**Thresholds.** Each crossing downward fires once (country flags `zin_volgan_veil_70`, `_50`, `_30`):

| Veil | State | Consequence |
| --- | --- | --- |
| ≥ 70 | Hidden | No Gathering Dark from Volgan's preparations. Foreign AI treat Volgan as no threat. |
| 50–69 | Rumoured | Event `zin_dominion.2` to Mirolon and its neighbours. `zin_world_add_gathering_dark` +2. |
| 30–49 | Suspected | Mirolon's proof gains are doubled. `zin_dominion.5` to Aenor gains +25% weight on the heeding options. Gathering Dark +3. |
| < 30 | Seen | News event `zin_dominion.4` "The Dead Lands Are Arming" to every country. Gathering Dark +5. Volgan cannot get "Out of the Storms". |

**Surprise.** When Volgan declares war on Mirolon:

- Veil ≥ 50: Volgan gets `zin_dominion_out_of_the_storms` for 120 days (180 with spirit `zin_volgan_patience_of_ages`). If Mirolon's passes are below 60, Mirolon gets `zin_dominion_caught_unready` for 90 days.
- Veil < 30: Mirolon gets `zin_dominion_forewarned` for 180 days.

### 3. Grave musters

Decision category `zin_dominion_grave_musters` (Volgan only). Opened by focus "The Grave-Fields of the South" (flag `zin_volgan_musters_open`). Every muster adds 1 to `zin_volgan_musters` and sets country flag `zin_volgan_mustered` for 30 days (stops veil recovery).

| Decision | Requires | Cost | Effect | Cooldown |
| --- | --- | --- | --- | --- |
| Wake the Old Barrows | musters open | 50 PP | Strength +2, manpower +5,000, veil −2 | 180 days |
| Muster Beneath the Storms | strength ≥ 30, veil ≥ 40 | 75 PP | Strength +3, no veil loss | 365 days |
| Raise a Grave Host | strength ≥ 30 | 40 PP, 10 command power | 2 "Grave Host" divisions at Nafeher, veil −1 | 90 days |
| Bind the Restless | at war, focus "Bind the Restless" | 50 PP | Strength +3 | 90 days |
| Wake the Old Battlefields | `zin_volgan_marches`, flag `zin_volgan_battlefields_open`, controls ≥ 4 Middle Lands states | 100 PP, 20 command power | 3 Grave Host divisions in a controlled Middle Lands state, strength +5 | 365 days |

"Grave Host" divisions use the template created by `zin_volgan_spawn_grave_host`. Until the warfare phase adds a `zin_grave_host` sub-unit ([03_gameplay](../03_gameplay/)), the template is 8 infantry battalions named "Grave Host". The text calls them grave hosts and never says whether they are the same kind of dead as Zol's.

### 4. The Southern Dominion

Demon, Dolon and Nezer are Volgan's subjects at the start (roster). The Southern Dominion is Volgan's faction.

`zin_dominion_oath` (new, each member, 0 to 100): how firmly the member holds to Nafeher. **Start:** Demon 60, Dolon 55, Nezer 50.

- Drift: −0.2 per month unless Volgan took "Summon the Dominion" in the last 180 days.
- Decisions (category `zin_dominion_court`; "Summon the Dominion" is open from the start, the other two need focus "Hold Court at Nafeher", flag `zin_volgan_court_open`):

| Decision | Cost | Effect | Cooldown |
| --- | --- | --- | --- |
| Summon the Dominion | 25 PP | Oath +10 for every member | 180 days |
| Demand Tribute of [member] | — | Strength +2, that member's oath −8 | 120 days per member |
| Grant Spoils to [member] | Volgan owns a non-core state | Transfer one owned non-core state to the member, oath +20 | 365 days |

- Oath ≥ 50: the member counts toward monthly strength and joins Volgan's wars at once.
- Oath < 25: event `zin_dominion.22` "The Oath Falters" for the member: renew the oath (oath +15, member loses 50 PP) or seek its own road (member AI gets `autonomy_gain` pressure through its own tree; Volgan gets −5 stability). Members' own trees (tier B: `regional_demon`, `regional_dolon`, `regional_nezer`) read the oath.
- When Volgan's body is destroyed: every member's oath −30, then `zin_dominion.18` "Old Allegiances" for each member: oath ≥ 40 stays; otherwise the member breaks free (`end_puppet`, leaves the faction).

### 5. The Nether and the King of Demons

The King of Demons is not a country on the map today (see [01_map_accuracy.md](../01_map/01_map_accuracy.md), K4 and open question 3). He is modelled as a court Volgan deals with, not as Volgan's subject.

`zin_nether_pact` (new, Volgan, 0 to 100): how far the Nether's court will send Netherborn to Volgan's wars. **Start:** 20.

Volgan chooses an approach in his tree (mutually exclusive):

- **Bargain** (flag `zin_volgan_nether_bargain`): slow and safe; the pact can reach 100.
- **Bend** (flag `zin_volgan_nether_bent`): quick manpower now; spirit `zin_volgan_nether_unrest` for a year; the pact is capped at 75 (enough for the gate pact, never the full bargain).

| Pact | Effect |
| ---: | --- |
| 40 | Strength +0.1 per month; focus "Netherborn Companies" available |
| 70 | Flag `zin_volgan_gate_pact`: Nether Gate decisions at war |

**Nether Gate** (decision, at war, gate pact): target an enemy-controlled state that borders Volgan or one of his subjects. Cost 50 PP and 2 pact; cooldown 60 days. Effect: `damage_building` infrastructure 2 levels, `add_resistance` 10 if the state is occupied by the target, and static state modifier `zin_dominion_gate_scars` for 90 days (`local_manpower` −0.25, `state_production_speed_buildings_factor` −0.25). Event `zin_dominion.21` reports the raid. This echoes the Second Age portal raids without saying who opened the gates.

Texts call the arrangement "the bargain of this reign". They never say what the King of Demons owes Volgan by right.

### 6. The Abyss

The Abyss is a site (`zin_is_site_abyss`), not a country. Volgan can send envoys down into it (tree branch "The Abyss"). Event `zin_volgan.8` picks one outcome with fixed weights:

| Outcome | Weight | Effect |
| --- | ---: | --- |
| The depths answer | 50 | Flag `zin_volgan_abyss_answered`: focuses "Abyss-Born Companies" and "Lords of the Deep" open |
| The depths are silent | 35 | 25 PP refunded; may try again after 365 days (decision "Descend Again") |
| The depths answer in wrath | 15 | Strength −2, 40 PP lost; may try again after 365 days |

The people of the Abyss are called "the Abyss-folk" (descriptive, proposed; their name is open). Texts never say whether Roka lives, rules or guards anything now. Volgan learns only that "a thief from the north" once robbed the Abyss.

### 7. The independent Dark Lands

Volgan's agents court the Dark Lands; most answer only to themselves.

`zin_volgan_pact` (new, each Dark Lands country, 0 to 3): 0 none, 1 envoys received, 2 Pact of Spoils, 3 Sworn to Nafeher.

**Decision "Send Envoys to [country]"** (category `zin_dominion_court`, opened by focus "Voices to the Dark Lands"): any Dark Lands country (region from the roster) that is not Volgan's subject and is not at war with Volgan. Cost 25 PP; takes 30 days; cooldown 180 days per target. On completion the target gets `zin_dominion.8` "Envoys from Nafeher":

- Accept: pact +1, Volgan opinion +20 (opinion modifier `zin_volgan_envoys_received`).
- Refuse: pact unchanged; at pact 0, opinion −20.

**AI acceptance** (base 20):

| Condition | Factor |
| --- | ---: |
| People orcs, trolls or goblins (`zin_people_orcs`, `zin_people_trolls`) | ×2 |
| Ideology Shadow or Dominion | ×2 |
| Ideology Light | ×0 |
| At war with a country Volgan is also at war with | ×2 |
| Goldoroth (its own spec may override through a scripted trigger `zin_goldoroth_refuses_masters`) | ×0.5 |
| Dondor | ×0.1 |
| `zin_volgan_body_destroyed` | ×0 |

- Pact 2 needs focus "The Pact of Spoils": the country grants Volgan military access when `zin_volgan_marches` is set and may send volunteers.
- Pact 3 needs focus "Sworn to Nafeher": the country joins the Southern Dominion faction when the march begins. At most three Dark Lands countries may be sworn.
- When Volgan's body is destroyed, every pact falls by 2.

### 8. Mirolon's watch and the passes

Mirolon is the only power that takes the danger seriously at the start. Two variables (new, Mirolon scope):

- `zin_mirolon_proof` (0 to 100): evidence of Volgan's arming that a court cannot laugh away. **Start:** 15.
- `zin_mirolon_passes` (0 to 100): readiness of the forts on the passes between Mirolon and Volgan's Dead Lands. **Start:** 30.

**Scouting** (decision category `zin_dominion_mirolon_watch`, Mirolon only, opened by focus "The Watch on the Passes", flag `zin_mirolon_watch_open`):

| Decision | Cost | Effect | Cooldown |
| --- | --- | --- | --- |
| Send Scouts South | 25 PP | Proof +5 (×2 if veil < 50), veil −3. If veil ≥ 70: 30% chance of `zin_dominion.6` "Scouts Lost" instead (proof +1 only, Mirolon −10 PP, veil unchanged) | 90 days |
| Send Word to Parim | 50 PP, proof ≥ 25 | Event `zin_dominion.5` to Aenor | 365 days |
| Raise the Pass Forts | 50 PP | Passes +10 | 120 days |

Volgan's counter: decision **Silence the Watchers** (Volgan, focus "Silence the Watchers", flag `zin_volgan_silence_open`, 50 PP, cooldown 180 days): Mirolon's proof −5, veil +3; Mirolon gets `zin_dominion.7` "Scouts Found Dead".

**Proof thresholds** (each fires once; Mirolon country flags `zin_mirolon_proof_25`, `_50`, `_75`):

| Proof | Effect |
| ---: | --- |
| 25 | Herez and the free Dead Lands realms get `zin_dominion.3` "Mirolon's Fears"; opinion of Mirolon +10 |
| 50 | Aenor's heeding options in `zin_dominion.5` gain weight; Lost Cause frontier companies may answer (Aenor spec) |
| 75 | News event "Mirolon's Proof"; Gathering Dark +3; veil −10; Mirolon loses `zin_mirolon_unheeded_warnings` |

**Mirolon's warning to Parim** (`zin_dominion.5`, to Aenor). Options and AI weights:

| Option | Effect | AI weight |
| --- | --- | --- |
| "Volgan is a nursery tale." (the Golden Court laughs) | Aenor +10 PP; Mirolon opinion of Aenor −15; Mirolon country flag `zin_mirolon_parim_laughed` | 100 × (1 + `zin_court_corruption` / 50) |
| "Let the Lost Cause send its frontier companies." | Mirolon gets 1,000 infantry equipment and timed spirit `zin_dominion_heeded_warning` (365 days); Aenor −25 PP | 20 + proof |
| "Aenor guarantees Mirolon." | `guarantee` Mirolon; Gathering Dark +2 | proof − 40 (min 0) |

On the historical path the Golden Court laughs, as it did in 4A 1736.

**Passes.** Each 20 points of passes adds one level of land fort (`bunker`) to every pass state (`zin_is_site_mirolon_passes`), up to level 6 at 100 (`zin_mirolon_raise_pass_forts`). At war with Volgan, passes ≥ 80 and proof ≥ 50 give Mirolon `zin_dominion_hold_the_passes`.

**Holding.** If Mirolon is at war with Volgan for 365 days and Volgan controls no pass state, flag `zin_mirolon_holds` is set. Volgan loses 15 strength and gets `zin_dominion_march_stalls` for 365 days. This is an alternative outcome, not history.

### 9. The reconquest of Mirolon

**A war may begin** when `zin_volgan_war_open` is true:

- global flag `zin_war_of_last_crowns` (world systems; 4A 1755 on the historical path), or
- country flag `zin_volgan_veil_broken` (Volgan's own choice, focus "Break the Veil": not before 1 Deepwinter 1750, strength ≥ 70, not at war).

and strength ≥ 50.

- **War goal:** `annex_everything` on Mirolon (focus "The Old Conquest"). Volgan already claims Mirolon after "The Old Claim on Mirolon".
- **On war start:** event `zin_dominion.10` "Out of the Storms" applies the surprise rules above. Volgan's members join.
- **Mirolon falls** when it capitulates or Volgan controls its capital and every pass state: `zin_dominion.11` sets global flag `zin_mirolon_fallen`, strength +10, all member oaths +10, Gathering Dark +5.
- **Exile.** If Mirolon took "The Exile Court", on capitulation it becomes a government in exile (`become_exiled_in`) in Herez if Herez exists and is not at war with Volgan, else Aenor, else the Gala Elves (`zin_dominion.24`).
- After the war Volgan may hold Mirolon with a dead garrison or make it a client crown (Volgan tree).
- **Client crowns.** Decision "Make a Client Crown" (category `zin_dominion_court`, flag `zin_volgan_client_crowns` from the focus "Client Crowns"): for any capitulated or annexed realm of the Middle Lands or Dead Lands whose capital Volgan controls. Cost 100 PP; cooldown 90 days. Calls `zin_volgan_make_client`. Client crowns count toward `zin_volgan_children_ready`.

### 10. The march north

`zin_volgan_begin_march` (focus "The March North"; requires `zin_mirolon_fallen` or Mirolon a Volgan subject or Mirolon gone, and strength ≥ 70, or ≥ 60 for the historical AI after 1 Rainwake 1755):

1. Global flag `zin_volgan_marches`; veil 0; Gathering Dark +10; news `zin_dominion.12` "The March North".
2. War goals (`annex_everything`) on Herez and on the country that controls Parim (Aenor, or whoever holds it). Volgan declares war at once on the Parim holder; the war joins every country already at war with Volgan.
3. Sworn Dark Lands countries (pact 3) join the faction; Pact of Spoils countries grant military access.
4. Remove `zin_volgan_veil_of_storms`, `zin_volgan_storm_rites`.
5. If country flag `zin_volgan_abyss_march` is set (focus "Lords of the Deep"), spawn two "Abyss Host" divisions at Nafeher (template of 6 infantry battalions until the warfare phase adds an Abyss-folk sub-unit).

**The northern front** (`zin_volgan_raise_northern_front`, focus "A Second Front in the North"): every sworn Dark Lands country (pact 3) gets a war goal (`take_state`) on one bordering state of Dondor or of a Concord dominion, and grants Volgan military access. Countries with no such neighbour get 20 army experience instead.

**Volgan takes the field** (`zin_volgan_take_field`, focus): `zin_volgan` gains a field marshal role (skill 6, attack 6, defence 4, planning 4, logistics 3; trait `zin_trait_great_spirit_in_arms`: `army_attack_factor` +0.1, `army_org_factor` +0.1 for his army). He cannot be killed in battle by normal means; only `zin_volgan_destroy_body` removes him.

### 11. Zol: the clash and the Black Compact

Zol's side belongs to the Zol's Mistake spec (`04_mechanics/`, Zol). This spec defines Volgan's side and the shared flags.

- **The clash.** When `zin_volgan_marches` and `zin_zol_rising` are both set and a state Volgan controls borders a state Zol controls, event `zin_dominion.13` "The Dead Against the Dead" fires for Volgan. Volgan declares war on Zol (no annexation goal; war goal `take_state` on the bordering state). Global flag `zin_volgan_zol_clash`. Each side's AI fights the other while both fight the living.
- **The Black Compact.** When `zin_eindil_returned` is set and both Volgan and Zol are at war with the country that has character `zin_eindil` (`has_character = zin_eindil`), Volgan's focus "The Black Compact" sends `zin_dominion.14` to Zol. If Zol accepts (Zol spec; historical AI accepts): white peace between them, military access both ways, global flag `zin_black_compact`. They do **not** join one faction: the vault says they never settled on common command.
- **The Compact ends** when `zin_volgan_body_destroyed` or `zin_zol_withdrawn` is set: `zin_dominion.23` sets global flag `zin_black_compact_ended`, revokes access and removes `zin_volgan_two_darks`. Neither side declares war on the other automatically.

### 12. Eindil and the broken body

The Eindil's journey spec owns the duels: when and where Eindil and Volgan meet. This spec provides the effects.

- **First duel** (historical 1757): the Eindil spec fires `zin_dominion.16` "Then I Will Bury Them Together" for Volgan. Volgan gets timed spirit `zin_dominion_champion_falls` (180 days) and global flag `zin_volgan_struck_down_eindil`. The Eindil spec then runs the New Gods' restoration.
- **Second duel** (historical 1757, after the restoration stage): the Eindil spec calls `zin_volgan_destroy_body`.

`zin_volgan_destroy_body` (does nothing if `zin_volgan_body_destroyed` is already set):

1. Global flag `zin_volgan_body_destroyed`; news `zin_dominion.17` "The Body Breaks".
2. Remove the field marshal and country leader roles from `zin_volgan`. The character is not killed or retired: his fate is not stated.
3. The Ember Herald (`zin_volgan_ember_herald`) becomes country leader as Steward of Nafeher; country flag `zin_volgan_silent_throne`.
4. Strength set to the lower of current and 25; recovery stops; cap 40.
5. `damage_units`: every Volgan division loses 50% organisation and 25% strength.
6. Timed spirit `zin_dominion_broken_host` (365 days), then `zin_dominion_silent_throne` (permanent until the Silent Throne branch replaces it).
7. Member oaths −30 and `zin_dominion.18` for each member; Dark Lands pacts −2.
8. Gathering Dark −10 (`zin_world_add_gathering_dark`).
9. `mark_focus_tree_layout_dirty` so the Silent Throne branch appears.
10. AI strategy: seek white peace with every enemy outside the Dead Lands.

**What remains.** Event texts say only that his body broke and that "what remains of Volgan, no one living can say". The Steward rules "in a name that does not answer". The game rule `zin_rule_volgan_spirit` controls sandbox play:

| Option | Effect |
| --- | --- |
| Unresolved (default) | Nothing returns. No event says the spirit died or lived. |
| A stirring (non-canon sandbox) | From 1 Thaw 1765, hidden MTTH 10 years: `zin_dominion.25` "A Stirring in Nafeher" restores `zin_volgan` as country leader without a body, at strength 30. The text opens "In this telling of the age". Never fires with the default rule. |

**The Steward and Mirolon.** If Volgan holds Mirolon's states when the body breaks, `zin_dominion.19` asks the Steward: "Let Mirolon go" (release Mirolon or end its exile; white peace with Mirolon; proposed historical choice) or "Hold what we took" (keep; Mirolon resistance +15 in its cores).

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
| 1757 | Eindil returns; the Black Compact; Volgan strikes Eindil down; the body breaks | `zin_black_compact`, `zin_volgan_struck_down_eindil`, `zin_volgan_body_destroyed` |
| 1757 to 1758 | The Steward lets Mirolon go: the exiled Mirolon court returns to its cores; white peace | `zin_volgan_silent_throne` |

## Implementation

### Files

| Path | Content |
| --- | --- |
| `common/scripted_effects/zin_dominion.txt` | Effects below |
| `common/scripted_triggers/zin_dominion.txt` | Triggers below |
| `common/decisions/zin_dominion.txt`, `common/decisions/categories/zin_dominion.txt` | Categories `zin_dominion_grave_musters`, `zin_dominion_court`, `zin_dominion_mirolon_watch` |
| `common/dynamic_modifiers/zin_dominion.txt` | `zin_dominion_hosts` |
| `common/modifiers/zin_dominion.txt` | Static state modifier `zin_dominion_gate_scars` |
| `common/ideas/zin_dominion.txt` | Mechanic spirits below |
| `common/opinion_modifiers/zin_dominion.txt` | `zin_volgan_envoys_received`, `zin_volgan_envoys_refused` |
| `common/unit_leader/zin_dominion_traits.txt` | `zin_trait_great_spirit_in_arms` |
| `common/characters/zin_dominion.txt` | Characters below |
| `common/game_rules/zin_dominion.txt` | Rules below |
| `common/on_actions/zin_dominion.txt` | `on_startup`: fire `zin_dominion.1`; `on_declare_war`: `zin_dominion.10` check |
| `events/zin_dominion.txt` | Namespace `zin_dominion` |
| `localisation/english/zin_dominion_l_english.yml` | Text |

The tree files (`zin_volgan.txt`, `zin_mirolon.txt`) come from the focus compiler. Events of the trees use namespaces `zin_volgan` and `zin_mirolon`; the mechanic uses `zin_dominion` so the two never collide.

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

All are clamped by the effects that change them.

### Flags

Global (set once, never cleared): `zin_volgan_marches`, `zin_volgan_body_destroyed` (shared contract); `zin_mirolon_fallen`, `zin_volgan_zol_clash`, `zin_black_compact`, `zin_black_compact_ended`, `zin_volgan_struck_down_eindil` (new).

Country, Volgan: `zin_volgan_veil_broken`, `zin_volgan_musters_open`, `zin_volgan_court_open`, `zin_volgan_silence_open`, `zin_volgan_whispers_parim`, `zin_volgan_abyss_march`, `zin_volgan_client_crowns`, `zin_volgan_battlefields_open`, `zin_volgan_seeks_glo`, `zin_volgan_mustered` (30 days), `zin_volgan_veil_70`, `zin_volgan_veil_50`, `zin_volgan_veil_30`, `zin_volgan_nether_bargain`, `zin_volgan_nether_bent`, `zin_volgan_gate_pact`, `zin_volgan_abyss_answered`, `zin_volgan_envoys_open`, `zin_volgan_silent_throne`, `zin_volgan_children_proclaimed`.

Country, Mirolon: `zin_mirolon_proof_25`, `zin_mirolon_proof_50`, `zin_mirolon_proof_75`, `zin_mirolon_holds`, `zin_mirolon_exile_ready`, `zin_mirolon_parim_laughed`, `zin_mirolon_watch_open`. The Mirolon tree adds its own flags (listed in its spec).

### Scripted triggers

| Trigger | True when |
| --- | --- |
| `zin_volgan_hosts_stirring` | Strength ≥ 30 |
| `zin_volgan_hosts_ready` | Strength ≥ 50 |
| `zin_volgan_great_host` | Strength ≥ 70 (≥ 60 for the AI under `zin_rule_historical_path` after 1755.4.1) |
| `zin_volgan_veil_intact` | Veil ≥ 50 |
| `zin_volgan_may_break_veil` | Date ≥ 1750.1.1, strength ≥ 70, not at war, not `zin_volgan_body_destroyed` |
| `zin_volgan_war_open` | Global flag `zin_war_of_last_crowns` or country flag `zin_volgan_veil_broken` |
| `zin_volgan_mirolon_taken` | Mirolon does not exist, or is Volgan's subject, or Volgan controls Mirolon's capital and every pass state |
| `zin_volgan_body_intact` | Not `zin_volgan_body_destroyed` |
| `zin_volgan_mirolon_clientable` | Mirolon does not exist, or exists and is not a government in exile |
| `zin_mirolon_occupied` | Volgan or one of its subjects controls a Mirolon core state |
| `zin_volgan_children_ready` | See section 13 |
| `zin_mirolon_passes_held` | Mirolon at war with Volgan and Volgan controls no `zin_is_site_mirolon_passes` state |
| Site triggers | `zin_is_site_nafeher`, `zin_is_site_abyss`, `zin_is_site_nether`, `zin_is_site_mirolon_passes`, `zin_is_site_mirolon_seat`, `zin_is_site_parim`, generated in `zin_sites.txt` ([02_key_sites.md](../01_map/02_key_sites.md)) |

### Scripted effects

| Effect | Arguments | Does |
| --- | --- | --- |
| `zin_volgan_add_dominion_strength` | `value` | Adds and clamps 0–100 (cap 40 after the body breaks); refreshes `zin_dominion_hosts` |
| `zin_volgan_refresh_strength` | — | Recomputes the dynamic modifier values from strength |
| `zin_volgan_add_veil` | `value` | Adds and clamps; fires threshold events once |
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
| `zin_volgan_steward_rule` | — | Sets the Steward's ideology (`zin_shadow_dread`) and applies the Silent Throne |
| `zin_mirolon_add_proof` | `value` | Adds (doubled if veil < 50), clamps, fires thresholds |
| `zin_mirolon_add_passes` | `value` | Adds, clamps, calls `zin_mirolon_raise_pass_forts` |
| `zin_mirolon_raise_pass_forts` | — | Sets `bunker` level floor(passes / 20) + 1 (max 6) in pass states Mirolon controls |
| `zin_mirolon_scout` | — | The Send Scouts South resolution |
| `zin_mirolon_scorch` | — | `damage_building` infrastructure 2 in each pass state Mirolon controls |
| `zin_mirolon_raise_resistance` | — | `add_resistance` 20 in every Mirolon core state controlled by Volgan |
| `zin_mirolon_restore` | — | Sends `zin_dominion.19` to Volgan if the Steward rules; otherwise a war goal on Volgan for Mirolon's cores |
| Shared | — | `zin_world_add_gathering_dark` (world systems) |

### Dynamic and static modifiers

- `zin_dominion_hosts` (Volgan): four values from variables `zin_dominion_org`, `zin_dominion_morale`, `zin_dominion_recruit`, `zin_dominion_training`, set by `zin_volgan_refresh_strength`.
- `zin_dominion_gate_scars` (state, 90 days): `local_manpower` −0.25, `state_production_speed_buildings_factor` −0.25.

### Mechanic spirits (`common/ideas/zin_dominion.txt`)

| Key | Name | Modifiers | Added / removed |
| --- | --- | --- | --- |
| `zin_dominion_out_of_the_storms` | Out of the Storms | `army_attack_factor` 0.15, `breakthrough_factor` 0.1 | Volgan, war on Mirolon with veil ≥ 50; 120 or 180 days |
| `zin_dominion_caught_unready` | Caught Unready | `army_org_factor` −0.1, `army_defence_factor` −0.05 | Mirolon, same moment, passes < 60; 90 days |
| `zin_dominion_forewarned` | Forewarned | `army_defence_factor` 0.1, `max_dig_in` 3 | Mirolon, war start with veil < 30; 180 days |
| `zin_dominion_hold_the_passes` | Hold the Passes | `army_defence_factor` 0.15, `army_core_defence_factor` 0.05 | Mirolon at war with Volgan, passes ≥ 80, proof ≥ 50; removed when a pass state falls |
| `zin_dominion_heeded_warning` | A Warning Heeded | `war_support_factor` 0.05, `army_defence_factor` 0.03 | Mirolon, from `zin_dominion.5`; 365 days |
| `zin_dominion_march_stalls` | The March Stalls | `army_attack_factor` −0.1, `war_support_factor` −0.1 | Volgan, `zin_mirolon_holds`; 365 days |
| `zin_dominion_champion_falls` | The Champion Falls | `army_morale_factor` 0.1, `war_support_factor` 0.1 | Volgan, first duel; 180 days |
| `zin_dominion_broken_host` | The Broken Host | `army_org_factor` −0.3, `army_morale_factor` −0.3, `stability_factor` −0.2, `recruitable_population_factor` −0.3 | Volgan, body destroyed; 365 days |
| `zin_dominion_silent_throne` | The Silent Throne | `political_power_gain` −0.2, `army_org_factor` −0.1 | Volgan, after Broken Host; replaced by the tree's Silent Throne focuses |

### Characters (`common/characters/zin_dominion.txt`)

| Id | Name | Status | Role |
| --- | --- | --- | --- |
| `zin_volgan` | Volgan | established (contract) | Country leader `zin_shadow_dread`; field marshal from "Volgan Takes the Field" |
| `zin_volgan_ember_herald` | The Ember Herald | proposed | General (Great Spirit of Volgan's court); Steward of Nafeher after the body breaks |
| `zin_volgan_grave_warden` | The Grave-Warden | proposed | General; heads the necromantic orders |
| `zin_volgan_ghorvak` | Ghorvak of the Hundred Clubs | proposed | General; ogre clan chief of the Dead Lands |
| `zin_mirolon_maeric` | High Warden Maeric | proposed | Mirolon's country leader `zin_light_wardens`; replaces the generated ruler |
| `zin_mirolon_selda` | Captain Selda Varrow | proposed | Mirolon general (Pass Watch) |
| `zin_mirolon_hadric` | Hadric Thorne, Scout-Master | proposed | Mirolon advisor (intelligence) |

The three Volgan generals are hidden until "The Lieutenants Assemble". Portraits are image-generated ([08_art_and_assets](../08_art_and_assets/)).

### Events (namespace `zin_dominion`)

| Id | Title | For | Trigger | Options |
| --- | --- | --- | --- | --- |
| 1 | (hidden) Dominion pulse | Volgan | `on_startup`, then every 30 days | Monthly strength, veil, oath, proof and holding counters; Mirolon passes counter |
| 2 | Rumours from the South | Mirolon, Herez, free Dead Lands realms | Veil drops below 70 | "We have heard such talk before." |
| 3 | Mirolon's Fears | Herez, free Dead Lands realms | Mirolon proof 25 | "Watch with them." (opinion +10) / "Mirolon frets." |
| 4 | The Dead Lands Are Arming | all (news) | Veil below 30 | "So the legends wake." |
| 5 | Mirolon's Warning | Aenor | Decision "Send Word to Parim" or focus | See section 8 |
| 6 | Scouts Lost | Mirolon | Scouting with veil ≥ 70 (30%) | "Their names go on the wall." |
| 7 | Scouts Found Dead | Mirolon | Volgan's "Silence the Watchers" | "Double the watch." (passes +3) / "Keep it quiet." (stability +0.02) |
| 8 | Envoys from Nafeher | Dark Lands target | Envoy decision or focus | "Hear them." (pact +1) / "Send them back south." |
| 9 | The Envoys Return | Volgan | Reply to 8 | "As expected." |
| 10 | Out of the Storms | Volgan, Mirolon | Volgan declares war on Mirolon | Applies surprise spirits |
| 11 | Mirolon Falls | all (news) | `zin_volgan_mirolon_taken` while at war | Sets `zin_mirolon_fallen` |
| 12 | The March North | all (news) | `zin_volgan_begin_march` | "The south is moving." |
| 13 | The Dead Against the Dead | Volgan (news for others) | Section 11 | "Then we break them too." |
| 14 | The Black Compact | Zol | Volgan focus | Accept / refuse (Zol spec sets AI) |
| 15 | The Compact Holds | Volgan | Zol accepts | "For now." |
| 16 | Then I Will Bury Them Together | Volgan | Called by the Eindil spec | "Bury them." |
| 17 | The Body Breaks | all (news) | `zin_volgan_destroy_body` | "What remains, no one can say." |
| 18 | Old Allegiances | Demon, Dolon, Nezer | Body destroyed | Stay with Nafeher / go our own way (AI by oath) |
| 19 | The Steward's Choice | Volgan | Body destroyed while Volgan holds Mirolon, or `zin_mirolon_restore` | "Let Mirolon go." (AI 90) / "Hold what we took." (AI 10) |
| 20 | The Passes Held | Volgan, Mirolon | `zin_mirolon_holds` | "The march waits." |
| 21 | Fire from the Gate | Volgan | Nether Gate decision | "Again, when the gate allows." |
| 22 | The Oath Falters | member | Oath below 25 | Renew / seek our own road |
| 23 | The Compact Ends | Volgan, Zol | Body destroyed or `zin_zol_withdrawn` | "Each to his own dark." |
| 24 | A Court in Exile | Mirolon | Capitulation with `zin_mirolon_exile_ready` | "Mirolon lives while we do." |
| 25 | A Stirring in Nafeher | Volgan | Rule "A stirring" only | "In this telling, the throne answers." |

Event 1 is the only MTTH-free recurring event. Events 4, 11, 12 and 17 are news events. No event text before `zin_afrit_revealed` names Afrit.

### Game rules

| Rule | Options | Default |
| --- | --- | --- |
| `zin_rule_volgan_spirit` | `UNRESOLVED`, `STIRRING` | `UNRESOLVED` |
| `zin_rule_volgan_early_war` | `AI_HISTORICAL` (AI never takes Break the Veil), `AI_FREE` (AI may break the veil when strength ≥ 80) | `AI_HISTORICAL` |

`zin_rule_historical_path` (shared) also forces the historical AI choices listed in the trees.

### Interface

A Dominion panel for Volgan (strength, veil, Nether pact, member oaths, sworn Dark Lands realms) and a Watch panel for Mirolon (proof, passes, veil band: Hidden, Rumoured, Suspected, Seen). Mirolon sees only the band, never Volgan's numbers. Layout belongs to [07_interface](../07_interface/).

### Defines

None.

## AI

**Volgan, before the war.** Never declares war while `zin_volgan_war_open` is false. Takes "Wake the Old Barrows" and "Muster Beneath the Storms" when off cooldown, PP ≥ 100 and strength is below the schedule 50 + 5 × (year − 4A 1748) (so 60 in 1750, 80 in 1754); a player may muster faster; "Raise a Grave Host" when strength ≥ 40 and fewer than 24 divisions. Summons the Dominion when any oath is below 45. Sends envoys to every orc and troll Dark Lands country once, then repeats on refusers every 365 days. Takes "Silence the Watchers" when Mirolon's proof ≥ 40. AI strategies: `prepare_for_war` on Mirolon from 1 Thaw 1753; `antagonize` Mirolon.

**Volgan, at war.** Declares on Mirolon the month `zin_volgan_war_open` and `zin_volgan_hosts_ready` are true. Uses Nether Gate on Mirolon's pass states first, then Herez. After the march: `conquer` on the Parim holder; `area_priority` on the Middle Lands south of the Great Lake. Accepts the Black Compact path. After the body breaks: seek white peace outside the Dead Lands; "Let Mirolon go".

**Mirolon.** Scouts whenever off cooldown and PP ≥ 50 (on the historical path only while proof is below 65, so that no court is convinced before the war); sends word to Parim at proof 25, 50 and 75; raises pass forts until passes reach 80. On the historical path it takes "The Exile Court", so that a Mirolon court survives the fall; otherwise it takes "The Exile Court" if proof < 50 at the declaration of war, else "The Last Stand at the Passes". AI strategy `prepare_for_war` against Volgan from start (defensive only).

**Members.** Join every Volgan war while oath ≥ 50. After the body breaks, AI follows option weights by oath.

**Dark Lands.** Acceptance weights in section 7. Sworn countries attack the northern Concord dominions when the march begins.

## Acceptance

1. A new game on 1 Thaw 1748: Volgan has strength 45, veil 85, pact 20; members' oaths 60, 55, 50; Mirolon proof 15, passes 30; nobody is at war.
2. Over a scripted 7-year run with `zin_rule_historical_path`, Volgan declares no war before `zin_war_of_last_crowns`, strength is between 70 and 95 and the veil between 50 and 80 on 1 Rainwake 1755, and Mirolon's proof stays below 75.
3. "Break the Veil" is unavailable before 1 Deepwinter 1750 and below strength 70 (focus inspector shows the condition).
4. Veil thresholds fire their events once each, in order, and never fire again after a rise and fall.
5. Mirolon's proof at 75 removes "Unheeded Warnings", fires the news event and lowers the veil by 10.
6. Pass fort levels in pass states match floor(passes / 20) + 1, capped at 6.
7. On the historical run Mirolon falls in 4A 1755, `zin_volgan_marches` is set in 1755, `zin_volgan_zol_clash` before `zin_black_compact`, and the compact ends when the body breaks.
8. `zin_volgan_destroy_body` sets the flag once, removes both of Volgan's roles without killing the character, makes the Ember Herald leader, caps strength at 40, and reveals the Silent Throne branch.
9. With the default rule no event after the body breaks states that Volgan's spirit died or survived (localisation check for the phrases "is dead", "destroyed forever", "survives", "lives on" in `zin_dominion` and `zin_volgan` texts tied to Volgan).
10. No text in `zin_dominion`, `zin_volgan` or `zin_mirolon` names Afrit, Roka's fate, the King of Demons' name or Dardan's location (compiler text check).
11. In a non-historical test where `zin_eindil` is removed, `zin_volgan_children_ready` becomes true when Volgan holds Parim with four subjects and strength ≥ 60.
12. The HOI4 Agent Tools script validator reports no unknown effects, triggers or modifiers in the `zin_dominion` files.

## Open questions

1. Who owns the Nether on the map: Volgan, or the King of Demons as his own realm? This spec works either way, but a separate realm would turn the Nether pact into diplomacy with a country.
2. Mirolon's government: is it a kingdom (vault phrasing) or the elective warden-realm proposed here (fits the map's Light, `zin_light_wardens` stance)? Do you want a named ruler?
3. Geography of the passes: the vault speaks of Mirolon's "northern passes", while Mirolon lies north of Volgan. Are the passes on Mirolon's border with Volgan (assumed here)?
4. After the body breaks, should the Steward let Mirolon go on the historical path? The vault says nothing of Mirolon after the war.
5. Do you approve the names the Ember Herald, the Grave-Warden, Ghorvak of the Hundred Clubs, High Warden Maeric, Selda Varrow and Hadric Thorne?
6. Should the King of Demons ever appear as a character (no name, title only) in the Nether events?
7. Should the "A stirring" sandbox rule exist at all, or should Volgan's fate stay entirely untouched by gameplay?
