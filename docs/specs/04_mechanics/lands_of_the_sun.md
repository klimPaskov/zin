# The Lands of the Sun: Gala, Lorien and the Sunhot Realms

**Status:** Ready. Reviewed 19 October 2026 against CONVENTIONS "Status"; integrated 19 October 2026. **Priority:** 3. **Phase:** 3. Dates are Erdae engine dates and depend on the calendar ([../00_foundation/01_start_and_calendar.md](../00_foundation/01_start_and_calendar.md)); today the game still starts in 1936.

## Purpose

Far in the south-west, the Lands of the Sun hold forty-one Sunhot realms, the court of the **Gala elves** and its king, **Lorien**, who fought at Dardan. Nothing there is at war in 4A 1748, and almost nothing there moves armies. What the region holds is memory: Lorien remembers the First Age; his spring, the proposed **Mirror of First Rain**, shows true traces of the past and uncertain futures. Late in the age (4A 1752, proposed date) a stranger from the Islands of the South comes to Gala and leaves with a name. When Zol takes a body (4A 1757, proposed date) Lorien rides against him and dies.

This spec gives the region one mechanic:

- **Lorien's counsel:** Gala's standing among the Sunhot realms and the shores around them, and what it can ask of them.
- **The Noon Council and the Sunhot realms:** a proposed council led by the Lands of Light, its unity, and a defensive league it can raise.
- **The Mirror of First Rain:** clarity, visions, warnings, and the fear a prophecy can cause.
- **Lorien's last march and death:** the ride against Zol, the old lords who go with him, his death, and Gala after him.

The Gala Elves' focus tree is [../05_focus_trees/major/gala.md](../05_focus_trees/major/gala.md). The Magical Lands elves, the Wanderers and the Refusal's play rules are in [elves_wall_and_dragons.md](elves_wall_and_dragons.md).

### What other specs own

| System | Owner | Names used here |
| --- | --- | --- |
| Eindil at Gala: the stranger's arrival, the weeks of talk, the naming, Lorien's gift, the ship north | [eindil_journey.md](eindil_journey.md) | `zin_eindil.50`–`.60`, `zin_eindil_stage`, `zin_eindil_named`, `zin_eindil_elven_crew`, `zin_eindil_host` |
| Lorien's ride and the challenge | [zols_mistake.md](zols_mistake.md) | `zin_mistake.22` "The Old Lords Ride", `zin_mistake.23` "Lorien Challenges Zol" (the one news of Lorien's death, decision O4), `zin_zol_withdraw`; the Zol spec calls this spec's `zin_sun_lorien_rides` and `zin_sun_lorien_falls` |
| The Gala Elves' tree, which calls this mechanic | [../05_focus_trees/major/gala.md](../05_focus_trees/major/gala.md) | namespace `zin_gala`, the `zin_gala_*` flags read here |
| The Sunhot realms' trees | [../05_focus_trees/regional/lands_of_the_sun.md](../05_focus_trees/regional/lands_of_the_sun.md), [../05_focus_trees/shared/shared_lands_of_the_sun.md](../05_focus_trees/shared/shared_lands_of_the_sun.md) | call `zin_sun_add_concord`, `zin_sun_add_gala_counsel`, `zin_sun_add_clarity`, `zin_sun_form_noon_league`; read `zin_sun_league_needed`, `zin_sun_noon_council`, `zin_sun_noon_league`, `zin_sun_council_president` |
| Potent magic during the ride | [../03_gameplay/04_magic_and_world_systems.md](../03_gameplay/04_magic_and_world_systems.md) | `zin_potent_magic` on the Gala Elves for 30 days (set by the Zol spec only) |
| The Refusal and its lifting | [../03_gameplay/03_diplomacy_and_factions.md](../03_gameplay/03_diplomacy_and_factions.md) | `zin_refusal_lifted`, `zin_diplo_lift_refusal` (way "The Old Lords Ride"), `zin_diplo.30` (news: a realm breaks the Refusal), `zin_diplo.31` (a realm returns to it) |
| Lorien's death in the meter | [../03_gameplay/05_world_tension_and_endings.md](../03_gameplay/05_world_tension_and_endings.md) | `zin_lorien_dead` counts +1 to `zin_gathering_dark` there, not here |
| Afrit's agents in the Lands of the Sun | [afrit_hidden_council.md](afrit_hidden_council.md) | `zin_footholds`, `zin_afrit_add_footholds`, `zin_afrit.31` (the agents' report, decision N8), `zin_afrit_add_veil` |
| Characters | [../02_lore/02_characters.md](../02_lore/02_characters.md) | `zin_lorien`, `zin_gala_heveneya`, `zin_gala_sulestien`, `zin_gala_tangsiel`, `zin_trait_memory_of_dardan` (decision N7) |
| The goodwill effect | [elves_wall_and_dragons.md](elves_wall_and_dragons.md) | `zin_elves_goodwill` (`target`) |
| Region flags | [../03_gameplay/02_economy.md](../03_gameplay/02_economy.md) | `zin_region_<key>` country flags (read through this spec's own region trigger until the economy module is built) |

## Lore basis

**Established** (vault):

- Lorien is the king of the **Gala elves** of the Lands of the Sun, of extraordinary age and power. He led the Gala elves in Edran's Grand Alliance in the First Age and fought at Dardan. He remembers the War of Men, Dardan, the collapse of Aenor and Elzon's reign (*Lorien*, *Grand Alliance*).
- Edran's attack on the Dead Lands brought needless elven deaths and a long estrangement; the elves refused to fight Elzon's war for Aenor. Lorien still cares for the fate of all Erdae and distrusts human rulers who turn a common victory into lasting dominion (*Lorien*, *The Elven Refusal*, *The Fourth Age of Erdae* V).
- Late in the Fourth Age Lorien receives a stranger from the Islands of the South, speaks with him for weeks, names him **Eindil, son of Ein, grandson of Aen**, uses a vision to warn of the catastrophe, sends him to Horos at Yeldenne for Glo, and gives him a remarkable ship, armour, a sword and a crew of western friends, island navigators and Gala elves (*Lorien*, *Fourth Age Canon Register*, *The Journey of Eindil*, *The Fourth Age of Erdae* V).
- Afrit's hidden agents operated even in the Lands of the Sun; one reported that the stranger had left Lorien with a ship (*The Fourth Age of Erdae* VI).
- During Zol's brief embodiment Lorien returns with ancient lords and spirits to defend all the living peoples, challenges Zol directly and **dies** in the struggle, helping force the Old God to withdraw. He came not to restore an Aenoran empire but because an Old God's victory would destroy the freedom of elves and men alike (*Lorien*, *The Fourth Age of Erdae* XIII).
- The **Sunhot elves** live in the Lands of the Sun; they are over three metres tall and among the strongest and most peaceful peoples of Erdae (*Peoples of Erdae*). God Forest Keepers are also elves (*Peoples of Erdae*).
- The Lands of the Sun lie in the far south-west and run beyond the southern map edge; named places include Elvana, Igara, Hengyang, the Sea of Gods, Heaven, Flame and Godland (*Erdae and Its Regions*).

**Proposed in the vault** (stay proposed): the **Mirror of First Rain** as Lorien's spring in an old elven courtyard, showing true traces of the past and possible futures, never an infallible future; Lorien's warning that prophecies can frighten people into the deeds they predict; the islanders' saying "when the tales of men grow too old for any man to explain, carry them to Gala"; the Lands of Light as the leading Sunhot realm; the Sunhot realms honouring Lorien's memory (*Mirror of First Rain (proposed)*, *The Fourth Age of Erdae* IV–V, *The Campaign of 4A 1748*).

**Open, and kept open:** the relationship between the Gala elves and the Sunhot elves. The vault carries a proposal; this spec neither uses nor states it. No text calls the Sunhot elves Gala's kin, subjects or lords, or the reverse. The roster's separate countries **Gala** and **North Gala** have no stated link to the Gala Elves. Who succeeds Lorien and what Gala becomes after him is open (*The Fourth Age of Erdae*, follow-up 6; *Fifth Age Seeds*, seed 5); play may offer choices, text never states one as history. Who the "ancient lords and spirits" are is not named.

**Proposed in this spec:** Lorien's counsel, the Noon Council and the Noon League, the Mirror's clarity and visions, the warnings and their fear, the old lords as a count, the Old Powers Stand, the steward choice, every name of a decision, spirit and event, every date and every number.

## Design

### 1. The peaceful start

On 1 Thaw 4A 1748 no realm of the Lands of the Sun is at war or holds a claim; the Noon Council sits; the Mirror is clear; Lorien reigns. Gala holds one state (state 786, about 40,000 people), so its levy is a few hundred. Every lever is counsel, festivals, ships, envoys and the Mirror. War content waits for `zin_zol_rising`, `zin_zol_manifested` or an attack on the region.

**The secret.** Before `zin_eindil_named`, no vision, warning or focus text shows a man of Aen's line or the stranger's name; before `zin_afrit_revealed`, no text names Afrit or calls the Deliverer or his priests anything but what people see.

### 2. The realms

The roster's Lands of the Sun (`countries.json` scan "Sunhot") hold 47 countries: 41 Sunhot realms, the Gala Elves, Gala, North Gala and three realms of men. All are Light except the men's realms (Wild, `zin_wild_freeholds`); the Sunhot realms have stance `zin_light_sanctuary`, the three elven ones `zin_light_kinship`. By tier ([../05_focus_trees/01_tiers_and_coverage.md](../05_focus_trees/01_tiers_and_coverage.md)): the Gala Elves are tier A; seven realms have tier B trees (the Lands of Light, Poyang, Godland, Hengyang, Elvana, Heaven and Goodin); the other 39 countries share the tier C tree: 35 Sunhot realms, Gala, North Gala, Goodton and Guuden. So 41 Sunhot realms = 6 tier B + 35 tier C.

| Realm | People | Role |
| --- | --- | --- |
| **Gala Elves** | `elves` | Lorien's court, the Mirror, the King's Ships; tier A tree `gala` |
| **The Lands of Light** | `sun_elves` | Largest Sunhot realm (15 states); presides over the Noon Council (proposed); tier B tree `regional_the_lands_of_light` |
| Poyang, Godland, Hengyang, Elvana, Heaven | `sun_elves` | Tier B Sunhot realms. Elvana and Igara are commercial rivals (roster) |
| 35 other Sunhot realms (Igara among them) | `sun_elves` | Shared tree `shared_lands_of_the_sun` |
| Goodin | `men` | Goodin Sunfolk (*Peoples of Erdae*); tier B tree; not a Council member (it may win a guest's seat through its tree) |
| Goodton, Guuden | `men` | Shared tree; not Council members |
| Gala, North Gala | `elves` | Shared tree (tier C); no stated link to the Gala Elves |

God Forest Keepers: the owner assigns their country (peoples spec); until then no realm carries the name.

### 3. Lorien's counsel

`zin_gala_counsel` (Gala Elves variable, 0–100, start **50**): the weight Lorien's word carries among the Sunhot realms, the Islands of the South and the elves. Changed only through `zin_sun_add_gala_counsel`.

| Change | Amount |
| --- | ---: |
| Monthly, while `zin_lorien` leads the Gala Elves | +0.2 |
| Decision **Lorien's Audience** | +5 |
| Focuses of the Gala tree | as tabled |
| Asks below | −20 to −30 |
| `zin_lorien_dead` | halved; no monthly gain until *Gala Endures* |

**Lorien's Audience** (decision, Gala Elves, with the focus flag `zin_gala_audiences`; 25 political power; cooldown 120 days; target any country of the Lands of the Sun, the Islands of the South or an elven realm): counsel +5; `zin_elves_goodwill` with the target (elves spec effect). Event `zin_sun.5` to the target (flavour: the King speaks of Dardan; one option).

**Asks** (category `zin_sun_counsel`):

| Ask | Needs | Spends | Effect |
| --- | --- | --- | --- |
| **Ask the Noon Council for Timber and Ships** | counsel ≥ 40 | 20 counsel | Gala gets **Timber From the Sun Realms** `zin_sun_council_timber` for 365 days: `industrial_capacity_dockyard = 0.15`, `production_speed_buildings_factor = 0.05` (Timber builds hulls, decision V2) |
| **Ask the Sun Guard to Watch Gala's Borders** | counsel ≥ 60; `zin_gathering_dark` ≥ 50 or Gala at war | 30 counsel | Event `zin_sun.6` "Gala Asks the Sun Guard" to the Council president (the Lands of Light, or the realm with `zin_sun_council_president`): "The Sun Guard will watch." (`give_guarantee` to the Gala Elves; AI 80, 10 if the president is at war or its opinion of the Gala Elves is below 0) / "We cannot spare the spears." (15 counsel returned) |
| **Speak for a Sunhot Quarrel** | flag `zin_gala_mediator` | 10 counsel | Targeted: Elvana and Igara, or any two Sunhot realms whose opinion of each other is negative: `zin_elves_goodwill` between them; `zin_sun_add_concord` +5 |

### 4. The Noon Council (proposed)

The Sunhot realms meet as **the Noon Council** under the presidency of the Lands of Light. It is a body of custom, not an HOI4 faction. Global flag `zin_sun_noon_council` is set at start and stays set while any Sunhot realm exists. If the Lands of Light ceases to exist, the Sunhot realm with the most states presides (country flag `zin_sun_council_president`, moved by the monthly runner). The Council is cleared only when no Sunhot realm is left.

`zin_sun_concord` (global, 0–100, start **40**): how far the Sunhot realms act as one. Changed only through `zin_sun_add_concord`.

| Change | Amount |
| --- | ---: |
| Monthly, while no two Sunhot realms are at war with each other | +0.1 |
| A war between two Sunhot realms begins (`on_declare_war`, ROOT and FROM both Sunhot) | −10 |
| A country from outside the Lands of the Sun takes control of a Lands of the Sun state in war (`on_state_control_changed`) | +10, once until no such war remains (global flag `zin_sun_concord_rallied`, cleared by the runner) |
| Gala and Lands of Light focuses, *Speak for a Sunhot Quarrel* | as tabled |
| `zin_lorien_dead` | +5 (the realms close ranks in mourning) |

**The Gala Elves at the Council.** Gala attends as an honoured guest: it is not a member and does not vote. This leaves the open question of the two peoples' relationship open.

**The Noon League** (proposed). When concord ≥ 60 and `zin_sun_league_needed` (a country from outside the Lands of the Sun, at war with a Sunhot realm or the Gala Elves, controls a Lands of the Sun state; or `zin_gathering_dark` ≥ 60), the president may take **Raise the Noon League** (decision; 50 political power), answer the Gala tree's *The Noon Council Arms* (`zin_gala.7`), or take the regional tree's focus *Raise the Noon League*. Each calls `zin_sun_form_noon_league`, which does nothing if `zin_sun_noon_league` is already set; otherwise it runs, in the president's scope, `create_faction_from_template = zin_faction_noon_league` (template and joining rule written by this module, see Implementation), sets `zin_sun_noon_league`, sends news `zin_sun.30`, and invites every Sunhot realm and the Gala Elves with `zin_sun.31` ("Join the League" `add_to_faction` / "Keep apart"; AI join 40 + concord ÷ 2). Joining rule `zin_faction_rule_join_sun_realms`: a Lands of the Sun country (`zin_sun_is_lands_of_the_sun_country`) whose people is `sun_elves` or `elves`. This module writes the template and the rule; the diplomacy spec lists the League among the factions formed in play and names the rule in its one joining-rule group `zin_rule_group_joining`. The League is defensive: AI members never declare war outside the Lands of the Sun except to recover their own states. The runner counts `zin_sun_league_peace_days` (+30 a month while the president is at peace, reset to 0 at war); at 730 the president runs `dismantle_faction` and `zin_sun_noon_league` is cleared, so it can be raised again.

The League binds only elves and Sunhot elves defending their own region, so it is not the human alliance the Refusal forbids (proposed reading of *The Elven Refusal*; the diplomacy spec's joining rules keep bound realms out of human factions).

**Sunhot elves at war** (warfare open question 11, proposed answer). The Sunhot AI never starts a war. It defends, joins the League's defensive wars and recovers its own states. The diplomacy spec binds the Sunhot elves by the Refusal as a proposed gameplay choice; this spec follows it.

### 5. The Mirror of First Rain (proposed)

The Mirror is a spring in an old courtyard of Gala, not an object (names spec). It is a scripted site at the Gala Elves' capital (`zin_is_site_gala`), not a state.

`zin_mirror_clarity` (global, 0–100, start **60**): how clearly the water answers. Changed only through `zin_sun_add_clarity` and `zin_sun_spend_clarity`.

| Change | Amount |
| --- | ---: |
| Monthly regain | +2 (+1 more with the spirit *Still Water*) |
| A vision | −25 (−15 with `zin_gala_true_traces`) |
| A vision that shows only rain | half the cost |
| Lorien names the stranger (`zin_eindil.52`) | −30, or all that is left if below 30 |
| `zin_lorien_dead` | halved (his reading of the water is gone) |

**Available** (`zin_sun_mirror_available`): the Mirror is not stilled. **Stilled** (`zin_mirror_stilled`): set by `on_state_control_changed` when a country that is not an elven or Sunhot realm takes control of the `zin_is_site_gala` state (with the Gala tree's flag `zin_gala_courtyard_guarded`, the hidden event `zin_sun.36` sets it 30 days later if the site is still held); cleared when an elven or Sunhot realm controls it again. `zin_sun.35` tells the Gala Elves and the occupier. A stilled Mirror gives no visions and no regain.

**Visions.** Decision **Look Into the Mirror** (Gala Elves with the flag `zin_gala_mirror_open`; mirror available; clarity ≥ 30; 50 political power; cooldown 180 days), or the Gala tree's vision focuses. `zin_sun_mirror_vision` (argument `sight`: `north`, `south`, `seas`, `east`, `centre` or `any`) checks the hidden world state for that sight. `any` checks every sight and shows the first true one in this order: centre, south, north, seas, east.

| Sight | Shows when | The image (text) | Sets on the Gala Elves (730 days) |
| --- | --- | --- | --- |
| `north` | Zol's `zin_mistake_power` ≥ 30 | Black sails among northern islands; the dead do not lie still | `zin_sun_sight_north` |
| `south` | Volgan's `zin_dominion_strength` ≥ 40 | Banners in the heat-haze; a gate in the south held by few | `zin_sun_sight_south` |
| `seas` | `zin_west_resolve` ≥ 40 | Ships beyond counting on a wide sea, sailing east | `zin_sun_sight_seas` |
| `east` | Any East Lands court has `zin_east_rift_talk`, or `zin_war_of_last_crowns` | Sails gathering on a narrow sea; gold changing hands in eastern halls | `zin_sun_sight_east` |
| `centre` | Before `zin_golden_king_dead`: `zin_afrit_regicide_ready`, or Aenor's `zin_council_influence` ≥ 70 | A cup passed in a golden hall. The water does not show whose hand | `zin_sun_sight_centre` |
| none true | — | Only rain on still water | nothing |

With the start values of decision V1 (Zol's power 35, Volgan's strength 45), the north and south sights are already true on 1 Thaw 1748: the dangers exist from the start and only a few see them (*Fourth Age Chronology*), so the first vision is a true one. `any` then shows the south first.

The centre image follows the Aenor spec's proposed poisoner (*Follow the Poisoner's Coin*); if the owner chooses another way for the King to die, the image changes with it. Event `zin_sun.10` "The Water Stills" shows the image (Lorien and the Keeper of the Mirror look; one option). The images never show a person, never name the Deliverer and never show the stranger before `zin_eindil_named`. A sight is a gameplay hint: it states nothing that the vault leaves open.

**Warnings.** Decision **Send Word of the Vision** (Gala Elves; needs one `zin_sun_sight_*` flag; targeted; 50 political power, 25 less each with `zin_gala_share_sight` and `zin_gala_kings_warning`, minimum 0). The target gets `zin_sun.20` "A Warning From Gala":

- **Heed it.** The target gets the matching flag `zin_sun_heeded_<sight>` (country, 730 days) and timed idea for 365 days:

| Idea | Modifiers |
| --- | --- |
| `zin_sun_heeded_north` | `coastal_bunker_effectiveness_factor = 0.10`, `army_core_defence_factor = 0.05` |
| `zin_sun_heeded_south` | `army_core_defence_factor = 0.05`, `dig_in_speed_factor = 0.10` |
| `zin_sun_heeded_seas` | `coastal_bunker_effectiveness_factor = 0.10`, `naval_detection = 0.10` |
| `zin_sun_heeded_east` | `army_core_defence_factor = 0.05`, `war_support_factor = 0.03` |
| `centre` (Aenor only) | no idea: `zin_afrit_add_veil` −3 (the Afrit spec's evidence measure) |

- **Old elves see ghosts in water.** Nothing; the Gala Elves' opinion of the target −5 (`zin_opinion_warning_dismissed`).

**The fear of prophecy.** When a warning is heeded, there is a 20% chance (10% with `zin_gala_cautious_seers`) that fear does the prophecy's work: the target gets `add_war_support = 0.05`, and `zin_world_add_gathering_dark` +1; `zin_sun.21` tells Gala. This is the vault's proposed rule that prophecy can frighten people into the deeds it predicts.

**AI heeding:** 10 + opinion of the Gala Elves ÷ 2; +30 for Selen, Mirolon, Kingson, Hiloron, the Magical Forest and other elven realms (the frontier and scholarly realms that heed Eindil in his journey spec); the ruling Aenor realm's AI 10 before `zin_golden_king_dead` (the court laughs), 0 once `zin_aurevan_crowned` is set. Other systems may read `zin_sun_heeded_<sight>` (for example "forewarned" in the Zol spec's AI).

**The naming.** The journey's `zin_eindil.52` "The Mirror of First Rain" sets `zin_eindil_named`. This spec adds: it calls `zin_sun_spend_clarity` 30. If the Mirror is stilled, the journey spec has Lorien name the stranger from memory and the records of the First Men 60 days later, without the vision (canon is kept: Lorien names him in any case).

### 6. Lorien

`zin_lorien` leads the Gala Elves from the start with the trait `zin_trait_memory_of_dardan` (characters spec, decision N7). Today the game still has him as the generated ruler `<Gala Elves>_zin_ruler` named "King Lorien"; the characters module moves him to the contract id `zin_lorien`, and this mechanic depends on that. The engine never removes a country leader by itself, and no ZIN effect removes Lorien except this spec's `zin_sun_lorien_falls`.

- **If Gala falls.** When the Gala Elves capitulate before Lorien's ride, `on_capitulation_immediate` runs `become_exiled_in = { target = <host> legitimacy = 60 }`. ROOT is the Gala Elves only (`original_tag` test) and `zin_lorien_rides` is not set. The host is the Lands of Light if it exists and is at peace with the conqueror (FROM), else the elven or Sunhot realm with the most states that is at peace with FROM, else the Magical Forest. Lorien stays their leader, and the court in exile keeps its tree, its Mirror flags and its role in the journey (the journey spec's host rule already falls back to "the country that has recruited `zin_lorien`"). Annexation of Gala's state does not end the court while Lorien lives.
- **Eindil at Gala** (stage 5, 4A 1752). The journey spec owns the events; Gala's tree adds counsel, clarity and the means to pay Lorien's gift (*Armour and Sword* gives the arms, *A Crew of Many Peoples* the crew) and speeds the ship (*A Ship Beyond Compare*). The journey spec charges the Gift 1,000 manpower and 500 infantry equipment, while Gala's own levy is a few hundred; the two Gala focuses add exactly that (500 equipment, 1,000 manpower), so the AI, which takes them, pays in full. For a Gala that skipped them, the journey spec's Gift takes what Gala has, never driving manpower or equipment below 0, and the regard bonus does not depend on the full payment (owner question "elves" 18; the work proceeds on it).
- **Who hears of it.** The agents' report is the Afrit spec's `zin_afrit.31` "Word from the Lands of the Sun", with the union of both specs' options (decision N8: the one report of the stranger leaving Gala). Its delay is 30 days after the naming if the Gala Elves have footholds ≥ 1, else 120, with the Afrit spec's reductions. The Gala tree's *No Word Leaves Gala* adds 60 days (flag `zin_gala_word_kept`).

### 7. The old lords and Lorien's last march

`zin_gala_old_lords` (Gala Elves variable, 0–5, start **1**): the ancient lords and spirits, survivors since Dardan, who will ride with Lorien (established that they exist; unnamed). Changed only by `zin_sun_add_old_lords`. Raised by the Gala tree (*The Old Lords*, *Summon the Ancient Lords*, *Spirits Who Remember Dardan*, *For All the Living*) and by decision **Send Word to the Old Lords** (Gala Elves; `zin_zol_rising` or `zin_gathering_dark` ≥ 60; 75 political power; cooldown 365 days; +1).

**The ride.** When `zin_zol_manifested` is set and Lorien lives, the Zol spec sends `zin_mistake.22` "The Old Lords Ride" to the Gala Elves. Option A calls **`zin_sun_lorien_rides`** (the Zol spec makes that call):

1. Sets global flag `zin_lorien_rides`. The Refusal is set aside by the same option through the diplomacy spec (`zin_diplo_lift_refusal` on the Gala Elves, way "The Old Lords Ride"; its news is `zin_diplo.30`). This effect does not touch `zin_refusal_lifted` itself; if the option ran without the diplomacy call, it calls `zin_diplo_lift_refusal` as a safety net.
2. The Gala Elves join the war against Zol: `add_to_war` with `targeted_alliance` = Eindil's host (`global.zin_eindil_host`) if it is at war with Zol, else the country at war with Zol that controls the most Middle Lands states; `enemy` = Zol. If nobody is at war with Zol, they declare war on Zol themselves (`declare_war_on`, type `annex_everything`; the Zol spec turns any capitulation into a withdrawal).
3. The Gala Elves get **The King's Ride** `zin_sun_kings_ride` for 30 days: `army_attack_factor = 0.20`, `army_morale_factor = 0.20`. The Zol spec separately gives them `zin_potent_magic` for 30 days; nothing here touches potent magic.
4. Every country at war with Zol on that side gets **The Old Powers Stand** for 14 + 7 × old lords days (at most 49): strength by old lords, `zin_sun_old_powers_stand_1` (0–1 lords: `army_defence_factor = 0.05`, `army_org_factor = 0.03`), `_2` (2–3: 0.10, 0.05), `_3` (4–5: 0.15, 0.08). These are ordinary help, not potent magic.
5. With the flag `zin_gala_ready_to_ride`, old lords +1 first.
6. News `zin_sun.40` "The Old Lords Ride" to every country: "The King of Gala has ridden north with the oldest lords of the world." Nothing in the text says he will die.

Option B ("This is not our war") does nothing here. Lorien lives; the Zol spec lets the form burn out. That is a proposed outcome, not history; text does not say so.

**The fall.** The Zol spec's `zin_mistake.23` "Lorien Challenges Zol" calls **`zin_sun_lorien_falls`** before `zin_zol_withdraw`:

1. Sets global flag `zin_lorien_dead` (guard: does nothing if it is already set). The tension spec adds its +1 to `zin_gathering_dark` for this flag; this effect adds nothing to the meter.
2. Removes `zin_lorien`: `kill_country_leader` in the country he leads (the Gala Elves, at home or in exile); if he leads none, `retire_character = zin_lorien` in the country that has him (`has_character`).
3. `zin_gala_old_lords` = 0 (the old powers are spent; established that several great spirits were destroyed or broken). Clarity and counsel halve; concord +5.
4. The Gala Elves get **The King Has Fallen** `zin_sun_king_fallen` for 730 days: `stability_factor = -0.10`, `war_support_factor = 0.10`, `political_power_gain = -0.10`. Every elven and Sunhot realm gets **Mourning for Lorien** `zin_sun_mourning` for 180 days: `stability_factor = -0.02`.
5. No news of its own: the news to every country is the Zol spec's `zin_mistake.23` "Lorien Challenges Zol", which calls this effect (decision O4 retires this spec's former `zin_sun.43` for that moment; the id stays unused).
6. `zin_sun.42` "After the King" to the Gala Elves, 14 days later.

**After the King** (`zin_sun.42`; gameplay choice, not history). Who keeps the court?

| Option | Effect | AI |
| --- | --- | --- |
| **The Keeper of the Mirror** | `zin_gala_heveneya` (recruited first if needed) gains a country-leader role (`add_country_leader_role`, ideology `zin_light_kinship`, `promote_leader = yes`) and leads; clarity +20 | 40 |
| **The Master of the King's Ships** | `zin_gala_sulestien` the same way; navy experience +25 | 30 |
| **A Council of the Old Houses** | `create_country_leader` "The Council of Gala" (ideology `zin_light_kinship`, picture `GFX_idea_zin_elven_council`: no portrait of a person); stability +5% | 30 |

The option text says only that the Gala elves must choose who keeps the court. Every option sets `zin_gala_steward_chosen`.

If Lorien never rides and Zol withdraws, Lorien lives on; no text comments.

### 8. Afrit's agents in the Lands of the Sun

The Afrit spec caps footholds in elven realms at 2 and the Worshipdom tree's *Houses Under the Sun* adds them. The Gala tree's *Watch on the Harbours* branch lets Gala welcome the healing houses (+1 foothold, historical) or keep a courteous distance (−1). Text says only that foreign priests and traders ask many questions at the quays. *No Word Leaves Gala* delays the hub's report by 60 days (flag `zin_gala_word_kept`; proposed dependency for `zin_afrit.31`). On the historical path Gala's footholds stay at 1 or more, so the report arrives as the chronicle says: an agent tells the hub that the stranger left Lorien with a ship.

### 9. Gathering Dark from this spec

Through `zin_world_add_gathering_dark` only: a heeded warning that turns to fear +1. Lorien's death is counted by the tension spec (+1 for `zin_lorien_dead`), never twice.

## Implementation

### Builder

Everything below is written by one new content-builder module, **`tools/content/modules/mech_lands_of_the_sun.mjs`** (`buildLandsOfTheSun(staged, countries, assignment)`, imported and called by `tools/content/build.mjs`), into the `Staged` set that `tools/content/apply.mts` applies in one transaction. It reads:

- `tools/content/data/countries.json` (politics step output): the tags of the Gala Elves, the Lands of Light, Elvana, Igara, the Magical Forest, Aenor, Selen, Mirolon, Kingson, Hiloron and the Worshipdom by name; the Gala Elves' `capitalState` (786 today); the roster regions (`scan`) "Sunhot" (the Lands of the Sun) and "Islands of The South";
- the people assignment that `build.mjs` already passes to the peoples module (`docs/design/countries.csv`), to list the Sunhot realms (`sun_elves`) and elven realms (`elves`) at build time;
- `tools/content/data/mechanics/lands_of_the_sun.json` (new): every number of this spec (start values, drifts, costs, cooldowns, sight thresholds, idea values, AI weights) and the localisation text.

The site trigger `zin_is_site_gala` (the Gala Elves' `capitalState`) is the key-sites table's row ([../01_map/02_key_sites.md](../01_map/02_key_sites.md)), written into `common/scripted_triggers/zin_sites.txt` by `tools/content/modules/sites.mjs`, which runs before this module; this module defines no site trigger. Tests: `tools/content/mech_lands_of_the_sun.test.mjs`, added to the `npm test` script in `tools/package.json`. This mechanic replaces no interim stub.

### Files

| Path | Content |
| --- | --- |
| `common/scripted_effects/zin_sun.txt` | Effects below |
| `common/scripted_triggers/zin_sun.txt` | Triggers below |
| `common/decisions/zin_sun.txt`, `common/decisions/categories/zin_sun.txt` | Categories `zin_sun_counsel`, `zin_sun_mirror`, `zin_sun_council` and their decisions |
| `common/ideas/zin_sun.txt` | Ideas below |
| `common/opinion_modifiers/zin_sun.txt` | `zin_opinion_warning_dismissed` (−5, decay 0.25 a month) |
| `common/factions/templates/zin_sun.txt` | Template `zin_faction_noon_league` ("The Noon League"; script-only: `visible = { always = no }` and `can_leader_join_other_factions = no`, as the diplomacy spec's templates, so no player picks it by hand); rules `zin_faction_rule_join_sun_realms`, `war_declaration_rule_faction_leader_only`, `call_to_war_rule_faction_leader_only` |
| `common/factions/rules/zin_sun.txt` | Joining rule `zin_faction_rule_join_sun_realms` (`type = joining_rules`; the joiner passes `zin_sun_is_lands_of_the_sun_country` and has `zin_people_sun_elves` or `zin_people_elves`) |
| `common/on_actions/zin_sun.txt` | `on_startup` (`zin_sun_startup`: variables, Council flag); `on_monthly` (`zin_sun_monthly` in the runner's scope: the Gala Elves, or the Council president if the Gala Elves are gone); `on_declare_war` (a war between Sunhot realms, concord −10); `on_capitulation_immediate` (Gala's exile); `on_state_control_changed` (concord rally; Mirror stilled or restored) |
| `common/ai_strategy/zin_sun.txt` | Sunhot strategies (AI section) |
| `events/zin_sun.txt` | Namespace `zin_sun` |
| `localisation/english/zin_sun_l_english.yml` | All text (`staged.loc('zin_sun', …)`), UTF-8 with BOM |

The Gala tree's files and its namespace `zin_gala` come from the focus compiler; the Gala tree only calls the effects here.

### Variables and flags

| Name | Kind | Range / start | Meaning |
| --- | --- | --- | --- |
| `zin_gala_counsel` | Gala Elves variable | 0–100 / 50 | Lorien's standing |
| `zin_sun_concord` | global variable | 0–100 / 40 | Unity of the Sunhot realms |
| `zin_mirror_clarity` | global variable | 0–100 / 60 | How clearly the Mirror answers |
| `zin_gala_old_lords` | Gala Elves variable | 0–5 / 1 | Ancient lords who will ride |
| `zin_sun_league_peace_days` | global variable | 0+ / 0 | Days the League's president has been at peace |
| `zin_sun_noon_council` | global flag | set at start | The Noon Council sits |
| `zin_sun_council_president` | country flag | — | Presides when the Lands of Light is gone |
| `zin_sun_noon_league` | global flag | — | The Noon League exists |
| `zin_sun_concord_rallied` | global flag | — | The concord rally of a foreign war has been paid |
| `zin_mirror_stilled` | global flag | — | The Mirror gives no visions |
| `zin_sun_sight_<sight>` | Gala country flag, 730 days | — | Gala has seen that sight |
| `zin_sun_heeded_<sight>` | country flag, 730 days | — | The country heeded that warning |
| `zin_lorien_rides` | global flag | — | Lorien's last march has begun |
| `zin_lorien_dead` | global flag (contract) | — | Lorien has died |
| `zin_gala_steward_chosen` | Gala country flag | — | After the King answered |

Read here and set by the Gala tree: `zin_gala_audiences`, `zin_gala_mirror_open`, `zin_gala_true_traces`, `zin_gala_cautious_seers`, `zin_gala_share_sight`, `zin_gala_kings_warning`, `zin_gala_mediator`, `zin_gala_courtyard_guarded`, `zin_gala_ready_to_ride`; `zin_gala_word_kept` is read by the Afrit spec.

### Scripted triggers

| Trigger | Scope | True when |
| --- | --- | --- |
| `zin_sun_is_lands_of_the_sun_country` | country | `original_tag` is one of the roster's Lands of the Sun countries (scan "Sunhot"); the same set as the economy spec's flag `zin_region_lands_of_the_sun` |
| `zin_sun_is_sunhot_realm` | country | `zin_people_sun_elves` |
| `zin_sun_is_elven_realm` | country | `zin_people_elves` or `zin_people_sun_elves` |
| `zin_sun_is_gala` | country | `has_character = zin_lorien`, or `original_tag` is the Gala Elves' |
| `zin_sun_mirror_available` | any | Not `zin_mirror_stilled` |
| `zin_sun_league_needed` | any | Section 4 |
| `zin_is_site_gala` | state | Read, not defined here: the Gala Elves' capital state (key sites row "Gala and the Mirror of First Rain", `zin_sites.txt`) |

### Scripted effects

| Effect | Scope | Arguments | Does |
| --- | --- | --- | --- |
| `zin_sun_add_gala_counsel`, `zin_sun_add_concord`, `zin_sun_add_old_lords` | any | `value` | Add and clamp (counsel and old lords live on the Gala Elves, whatever the calling scope) |
| `zin_sun_add_clarity`, `zin_sun_spend_clarity` | any | `value` | Add or subtract, clamp 0–100; no gain while `zin_mirror_stilled` |
| `zin_sun_mirror_vision` | Gala Elves | `sight` | Section 5 |
| `zin_sun_send_warning` | Gala Elves | `target`, `sight` | Section 5; fires `zin_sun.20` |
| `zin_sun_form_noon_league` | president | — | Section 4; guarded by `zin_sun_noon_league` |
| `zin_sun_lorien_rides` | Gala Elves | — | Section 7 (hook for `zin_mistake.22` A) |
| `zin_sun_lorien_falls` | any | — | Section 7 (hook for `zin_mistake.23`); guarded by `zin_lorien_dead` |
| `zin_sun_monthly` | runner | — | Counsel, concord and clarity drifts; president check; League peace count; concord rally reset; last, `mark_focus_tree_layout_dirty` for every Lands of the Sun country (decision E4) |

**Arguments** (decision E1). Scripted effects take no parameters in 1.19.3: `value` compiles to the temporary variable `zin_arg_value`, `target` to `zin_arg_target` (a country), and the keyword `sight` to `zin_arg_sight` with the codes north 1, south 2, seas 3, east 4, centre 5, any 0. **Timeouts** (E2): every `zin_sun` event sets `timeout_days = 30` and takes its first option on timeout; `.20` therefore lists *Old elves see ghosts in water* first and *Heed it* second, and `.31` lists *Keep apart* first, so a timeout never commits a player; AI chances are unchanged.

### Ideas

Pictures are idea icons in game (`GFX_idea_zin_<key>`). Every modifier key is a `## <key>` heading of the 1.19.3 modifier documentation, which the builder's `assertModifiers` checks.

| Id | Name | Modifiers | Icon | Added / removed |
| --- | --- | --- | --- | --- |
| `zin_sun_council_timber` | Timber From the Sun Realms | `industrial_capacity_dockyard = 0.15`, `production_speed_buildings_factor = 0.05` | `timber_mill` | Ask; 365 days |
| `zin_sun_heeded_north`, `_south`, `_seas`, `_east` | Heeded: The North / The South / The Seas / The East | Section 5 table | `beacon`, `fort_wall`, `lighthouse`, `eye_watchful` | Warning heeded; 365 days |
| `zin_sun_kings_ride` | The King's Ride | `army_attack_factor = 0.20`, `army_morale_factor = 0.20` | `gala_sun` | Ride; 30 days |
| `zin_sun_old_powers_stand_1`, `_2`, `_3` | The Old Powers Stand | `army_defence_factor` 0.05 / 0.10 / 0.15, `army_org_factor` 0.03 / 0.05 / 0.08 | `forest_ancient` | Ride; 14–49 days |
| `zin_sun_king_fallen` | The King Has Fallen | `stability_factor = -0.10`, `war_support_factor = 0.10`, `political_power_gain = -0.10` | `banner_laid_down` | Lorien's death; 730 days; swapped by *Gala Endures* |
| `zin_sun_mourning` | Mourning for Lorien | `stability_factor = -0.02` | `tree_silver` | Lorien's death; 180 days |

### Decisions

| Decision | Category | Who | Cost | Section |
| --- | --- | --- | --- | --- |
| Lorien's Audience | `zin_sun_counsel` | Gala Elves (flag `zin_gala_audiences`) | 25 | 3 |
| Ask the Noon Council for Timber and Ships; Ask the Sun Guard to Watch Gala's Borders; Speak for a Sunhot Quarrel | `zin_sun_counsel` | Gala Elves (the last needs `zin_gala_mediator`) | counsel | 3 |
| Look Into the Mirror | `zin_sun_mirror` | Gala Elves (flag `zin_gala_mirror_open`) | 50 | 5 |
| Send Word of the Vision | `zin_sun_mirror` | Gala Elves | 50 (less with flags) | 5 |
| Send Word to the Old Lords | `zin_sun_mirror` | Gala Elves | 75 | 7 |
| Raise the Noon League | `zin_sun_council` | Council president | 50 | 4 |

Counsel costs are a `custom_cost_trigger` on `zin_gala_counsel`, with the spend in the effect.

### Events (namespace `zin_sun`)

| Id | Title | For | Trigger | Options | Picture |
| --- | --- | --- | --- | --- | --- |
| `.1` | — | — | reserved (start-up is the `on_startup` effect, not an event) | — | — |
| `.5` | An Audience With the King | target | Lorien's Audience | One option | `gala_court` |
| `.6` | Gala Asks the Sun Guard | Council president | Ask the Sun Guard | Watch / cannot spare the spears | `gala_court` |
| `.10` | The Water Stills | Gala Elves | vision | One option; shows the image | `mirror_courtyard` (requested) |
| `.20` | A Warning From Gala | target | Send Word of the Vision | Old elves see ghosts in water / Heed it | `mirror_courtyard` (requested) |
| `.21` | Fear Does the Prophecy's Work | Gala Elves | 20% of heeded warnings | One option | `gala_court` |
| `.30` | The Noon League | Sunhot realms, Gala Elves (news) | League raised | Acknowledge | news `generic_war` |
| `.31` | A Call From the Noon Council | Sunhot realms, Gala Elves | League raised | Keep apart / Join | `generic_war` |
| `.35` | The Mirror Is Stilled | Gala Elves, the occupier | `zin_mirror_stilled` set | One option | `generic_court` |
| `.36` | (hidden) | Gala Elves | 30 days after Gala's site is lost with `zin_gala_courtyard_guarded` | Sets `zin_mirror_stilled` if a non-elven, non-Sunhot country still holds the site | — |
| `.40` | The Old Lords Ride | all (news) | `zin_sun_lorien_rides` | Acknowledge | news `vast_shadow` (gate `zin_zol_manifested`) |
| `.42` | After the King | Gala Elves | 14 days after `zin_lorien_dead` | Three stewards | `king_fallen_gala` (requested; gate `zin_lorien_dead`, set before `.42` fires) |
| `.43` | — | — | unused (O4: Lorien's death news is `zin_mistake.23`) | — | — |

`mirror_courtyard` and `king_fallen_gala` are proposed keys already listed in the icon catalog ([../05_focus_trees/02_icon_catalog.md](../05_focus_trees/02_icon_catalog.md)) with no art yet. Until they are generated, `.10` and `.20` use `gala_court`, and `.42` uses `gala_court` too (the event is a standard event, so the catalog's news fallback `vast_shadow` does not apply). No picture shows Lorien's death or Zol. Every event is fired by an effect or an on_action; none uses a mean time to happen.

### Game rules, defines, interface

No new rule. `zin_rule_ai_elves` and `zin_rule_historical_path` (through `zin_rules_is_historical`) govern the AI ([../00_foundation/05_defines_and_rules.md](../00_foundation/05_defines_and_rules.md)). No defines. The interface spec gives the Gala Elves a row in the Erdae bar (*proposed*, emitted once this mechanic is built; visible for this spec's `zin_sun_is_gala`): Counsel (`zin_gala_counsel`), Clarity (`global.zin_mirror_clarity`) and Old Lords (`zin_gala_old_lords` of 5), opening the Realm panel ([../07_interface/01_interface.md](../07_interface/01_interface.md)). There is no Gala panel; the decisions' tooltips also show counsel and clarity (`[?zin_gala_counsel]`, `[?global.zin_mirror_clarity]`). The row only reads these variables.

## AI

Decision AI is each decision's `ai_will_do`. Event weights follow [../03_gameplay/06_historical_path_and_ai.md](../03_gameplay/06_historical_path_and_ai.md): historical option 100/0 under `HISTORICAL`, 75/25 under `PLAUSIBLE` (60/40 once divergence ≥ 50), the tabled weights under `FREE`.

- **Gala, in peace:** Lorien's Audience every 120–240 days (the Lands of Light first, then Islands of the South realms on Eindil's route); Look Into the Mirror whenever clarity ≥ 50; Send Word of the Vision to the heeding realms (Selen, Mirolon, Kingson, the Magical Forest) and once to the ruling Aenor realm; never to the Worshipdom.
- **The stranger (stage 5):** Gala's AI takes every "hist" option of the journey events and the *Stranger at Gala* branch at weights 150–200.
- **The ride:** `zin_mistake.22` option A at 100 under `HISTORICAL`, 80 otherwise (Zol spec). Send Word to the Old Lords at once after `zin_zol_rising`.
- **Sunhot realms:** `common/ai_strategy/zin_sun.txt` gives every Sunhot realm `befriend` (value 20) toward the Gala Elves and the Lands of Light, and `conquer` (value −100) toward every other Lands of the Sun country (tag lists from the roster). They join the Noon League when asked at the table chance, recover lost states, and never attack beyond the region.
- **After the King:** pick by the table weights under every rule (the vault does not say who followed him).
- **Rule settings.** `FREE` lets Gala keep a courteous distance from foreign priests and warn more often (Gala tree weights). No rule lets the Sunhot AI start a war.

## Acceptance

Each check names how it is decided: **build** (`npm test` in `tools/`, `tools/content/mech_lands_of_the_sun.test.mjs` on the staged tree), **Linux** (the isolated Linux run: one in-game year from phase 3 on, decision S8, with no new `error.log` line from a ZIN file), or **scenario** (HOI4 Agent Tools `hoi4_scenario_test` / `hoi4_mechanic_test` on the mod source).

1. **Build.** Every file in "Files" exists; every `zin_sun` event id is defined once; every event, decision, idea, effect, trigger, faction template and rule, and opinion modifier named here is defined (here or in the module that owns it); every localisation key used exists in `zin_sun_l_english.yml`, UTF-8 with BOM, Windows-1252 characters only.
2. **Build.** Every modifier key passes `assertModifiers`; every effect, trigger and on_action named here appears in the 1.19.3 `documentation/` files or vanilla `common/on_actions`.
3. **Build.** The roster lists resolve: 41 Sunhot realms, the Lands of Light, and the Gala Elves with an existing capital state.
4. **Build.** Secret and canon scan over `zin_sun_l_english.yml`: no text reachable before `zin_eindil_named` contains "Eindil" or "son of Ein"; no text names Afrit; no text calls the Sunhot elves Gala's kin, subjects or lords (or the reverse), or ties the Gala Elves to the countries Gala and North Gala; no `zin_sun` event is fired by `zin_sun_lorien_falls` except `.42`, and `zin_sun.43` is not defined (O4).
5. **Linux.** A new game (on the 1936 start until the calendar is built): counsel 50, concord 40, clarity 60, old lords 1; `zin_sun_noon_council` set; no Lands of the Sun realm at war, in a faction or holding a claim; no new error lines.
6. **Scenario.** A vision with no true sight costs half and sets no flag; a vision with a true sight sets exactly one `zin_sun_sight_*` flag (forced variables).
7. **Scenario.** Historical observer run 4A 1748–1760: `zin_eindil_named` is set in 4A 1752 and clarity falls by 30; on `zin_zol_manifested` the Gala Elves ride (option A) and join the war against Zol; `zin_lorien_dead` is set in 4A 1757 before `zin_zol_withdrawn`; `zin_sun.42` fires once; the Noon League is never raised.
8. **Scenario.** Forcing Gala's capitulation before the ride makes it a government in exile with Lorien as its leader; the court survives the peace conference and still receives the journey's stage 5 events.
9. **Scenario.** `zin_sun_lorien_falls` run twice changes nothing the second time; `zin_sun_form_noon_league` run twice creates one faction.
10. **Scenario.** The Old Powers Stand never makes `zin_has_potent_magic` true.
11. **Scenario.** A non-elven occupier of the Gala site sets `zin_mirror_stilled` at once, or after 30 days with `zin_gala_courtyard_guarded`; returning the site to an elven realm clears it.
12. **Build.** Every `zin_sun` event sets `timeout_days = 30`; `zin_sun_monthly` contains `mark_focus_tree_layout_dirty`; the decision is named *Speak for a Sunhot Quarrel* in every file (the Gala tree's call uses this name).

## Open questions

All of these are owner questions in [OPEN_QUESTIONS.md](../OPEN_QUESTIONS.md) (section "elves"); the work proceeds on the proposal given. The former questions on Lorien's trait and on the agents' report are settled by decisions N7 and N8; Lorien's death news is the Zol spec's (O4). The quarrel decision keeps this spec's name, *Speak for a Sunhot Quarrel*, because this module defines it (the Gala tree's "Mediate a Sunhot Quarrel" follows it).

| # | Question | Proposal the spec uses | Listed as |
| --- | --- | --- | --- |
| 1 | Is the Noon Council acceptable, with Gala as a guest who does not vote? | Yes, as specified | "elves" 11 |
| 2 | Do the Sunhot elves share the Refusal? | Yes (the diplomacy spec's proposal) | "elves" 12 |
| 3 | May the Mirror show the Golden King's danger before he dies? | Yes: "a cup in a golden hall", never whose hand | "elves" 13 |
| 4 | Who keeps Gala after Lorien? | A gameplay choice among three stewards; none is history | "elves" 14 |
| 5 | Should the ancient lords who ride with Lorien be named? | No; a count only | "elves" 15 |
| 6 | Is one state the intended scale for Lorien's realm? | Yes, as the map has it | "elves" 16 |
| 7 | Should Lorien's gift take only what Gala has? | Yes (the journey spec does so) | "elves" 18 |
| 8 | Should Gala be able to keep foreign priests at a distance? | Yes, outside the historical path | "elves" 21 |
