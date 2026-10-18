# Yeldenne and Glo

**Status:** Draft. **Priority:** 3. **Phase:** 3.

## Purpose

Glo is the one power in Erdae that can end Zol's dead, and the bridge through which the New Gods restore Eindil. This system covers:

- **Horos** and the **Castle of Yeldenne**, his one-state realm in Mp'E, the frozen north of the Cold Lands;
- **Glo**, the green crystal that is Horos's heart and holds part of the power of the New God **Glernaen**;
- **who can seek Glo**, what each seeker can and cannot win, and how the confrontation in the hall resolves;
- **what Glo does** once it leaves the castle, until the blue sword breaks.

It hands Glo to [Eindil's journey](eindil_journey.md) on the historical path and gives every other outcome a defined, lore-safe result. Yeldenne's focus tree is [regional/yeldenne.md](../05_focus_trees/regional/yeldenne.md).

## Lore basis

| Fact | Status | Source |
| --- | --- | --- |
| Horos is a Great Spirit, an enormous knight in yellow-green armour with branching helm points, blue eyes and a blue sword; lord of Castle Yeldenne in the Cold Lands | established | *Horos*, *Horos Visual References* |
| Glo is a green crystal and Horos's literal heart; it holds part of the power of Glernaen, a true New God of Power and Wisdom | established | *Castle of Yeldenne and Glo*, *Glernaen* |
| Horos guarded Glo through the ages and rejected every claimant who sought it for conquest; Eindil is the first he willingly entrusts | established | *The Fourth Age of Erdae* VII |
| The guardian's willing transfer matters; Glo cannot be seized merely by occupying the castle; possession of the castle no longer guarantees ownership | established | *Horos* |
| Afrit's artifact-amplified power is weaker inside Yeldenne, because Glernaen's old protections disrupt his artifacts | established | *Horos*, *The Fourth Age of Erdae* VII |
| Afrit comes first, names himself Aenor's king and god; Horos names him son of Ein and orders him out; they fight; Afrit teleports behind Horos and stabs his neck; Eindil arrives and wounds Afrit; Afrit flees to his private refuge | established | *Fourth Age Canon Register* |
| Horos reveals the family truth, takes Glo from his chest, gives Glo and his blue sword to Eindil, and turns to dust; the castle is left empty | established | *Castle of Yeldenne and Glo* |
| Glo and the sword destroy Zol's directly sustained dead; Glo is the bridge for the New Gods' restoration; Zol crushes the sword; a shard still wounds Zol's manifestation | established (bridge: proposed channel) | *Glernaen*, *Horos Sword* |
| Afrit wants Glo (seizure or corruption); Volgan wants possession; the Lost Cause wants it protected | established | *Kingdoms Factions and Conflicts* |
| Dates: the confrontation in 4A 1753 | proposed | *Fourth Age Chronology* |

**Open in the vault, and kept open here:** the castle's exact location and origin; the source and limits of Glo; what Glo leaves after the gods' gift and the sword's breaking; why only a worthy bearer may hold it (a working rule); the fate of Horos's spirit after his body turns to dust; Glernaen's character, symbols and cult (the vault says not to assign a doctrine).

**Proposed by this spec:** the wardens of Mp'E (a small human household that serves the hall, matching the roster's people "men"); the ward strength measure; Glo's power measure; the hall outcome rules for non-historical cases; sealed Glo, dimmed Glo and the second bearer; Volgan's grave hunt; the Lost Cause's northern watch; all numbers.

## Design

### The realm of Yeldenne

| Item | Value |
| --- | --- |
| Country | Yeldenne (Cold Lands, tier B) |
| Territory | One state, **Mp'E**; capital victory point **Castle of Yeldenne** ([map accuracy](../01_map/01_map_accuracy.md) S11, K7) |
| Ruler | Horos (`zin_horos`), Light, trait `zin_horos_guardian` |
| People | the wardens of Mp'E (proposed): herders, tithe-folk and guards of the frozen north who serve the hall |
| Start army | two warden companies (design target: two infantry divisions) |
| Start spirit | `zin_yeldenne_guardian_of_glo` |
| Diplomacy at start | at peace with everyone; no guarantees; no faction |

Horos is **not** a general. He never leaves the hall. His strength in play is the realm's spirit, the wards and the hall rules below.

### The wards

`zin_yeldenne_wards` (global, 0–100, start 50) measures Glernaen's old protections around the hall. It is global, because it belongs to the site, not the country.

| Source | Change |
| --- | --- |
| Yeldenne focuses (root and Watch branch) | +5 to +15 each, +65 in total |
| Yeldenne focuses after an attack or Horos's death (`the_guardian_endures`, `keep_the_empty_hall`, `seal_the_hall`) | +10 to +20 |
| The Lost Cause's northern watch (decision `zin_glo_guard_the_hall`) | +10 |
| Horos repels an attack (hall outcome "The Hall Holds") | −20 |
| Horos dies | wards fall to 20 (empty hall) or stay as they are (sealed hall) |

**While Horos lives, the hall cannot be taken** (lore: Glo cannot be seized by occupying the castle):

- Mp'E carries the dynamic modifier `zin_yeldenne_hall_wards`: `enemy_attrition` +0.20, `enemy_army_speed_factor` −0.25, `enemy_local_supplies` −0.50.
- Every 7 days, if an enemy of Yeldenne controls Mp'E or has divisions there, `damage_units` hits that enemy's divisions in the state (org 0.5, strength 0.10 × wards ÷ 50).
- After 28 days of enemy control, **The Hall Expels the Intruders**: control returns to Yeldenne (`set_state_controller`).
- At startup every AI country gets `add_ai_strategy` "conquer" −500 toward Yeldenne while Horos lives.
- If Yeldenne is annexed anyway (a player peace deal), **The Hall Remains** fires to the annexer: it owns Mp'E, but Horos stays in the hall and Glo stays in his breast. From then on every hall event targets the owner of Mp'E. Horos is a site, not a vassal.

### Glo

`zin_glo_state` (global):

| Value | Meaning | How it is reached |
| ---: | --- | --- |
| 0 | In Horos's breast at Yeldenne | start |
| 1 | Carried by Eindil (`zin_glo_with_eindil`) | Horos's willing gift, or the seal opens for him |
| 2 | Sealed in the empty hall (`zin_glo_sealed`) | Horos slain before a worthy bearer came |
| 3 | Dimmed (`zin_glo_dimmed`): defiled by the dark, useless to anyone | a dark power completes the defilement of the sealed hall |
| 4 | Carried by a second bearer | only after `zin_eindil_lost`; a worthy claimant takes it |

**Nobody unworthy ever holds Glo.** Afrit and Volgan can kill Horos, seal Glo or dim it. They can never use it. This keeps the vault's working rule in every outcome.

`zin_glo_power` (global, 0–100) is how much of Glernaen's power the bearer can spend:

| Event | Glo power |
| --- | --- |
| Glo passes to a bearer | set to 100 |
| Each month while carried | +3 (cap 100; cap 50 after `zin_horos_sword_broken`) |
| Glo's Wave | −30 |
| The New Gods restore Eindil (needs Glo state 1) | set to 100 |
| Zol takes the sword and draws out the gods' gifts | set to 25 |

### What Glo gives

| Holder | Gift |
| --- | --- |
| Horos (state 0) | The wards and hall rules above; Yeldenne's start spirit |
| Eindil (state 1) | Trait `zin_eindil_bearer_of_glo`; Horos's blue sword; the host spirit `zin_glo_glernaens_light`; the decision **Glo's Wave**; the New Gods' restoration ([journey](eindil_journey.md), stage 9) |
| Second bearer (state 4) | Trait `zin_glo_second_bearer`; the host spirit; Glo's Wave. No sword and no restoration: the gods' gift came to Eindil because he freely accepted the burden (proposed rule) |

**Glo's Wave** (scripted effect `zin_glo_wave`, decision `zin_glo_wave_decision`): in one state where the bearer's army stands, or next to it:

- `damage_units` on every division owned by Zol or Zol's subjects: organisation 1.0, strength 0.5 (the first wave on Eindil's return: strength 0.8);
- the state flag `zin_glo_cleansed` for 60 days: the Zol system's rule that its dead rise again ([major/zol.md](../05_focus_trees/major/zol.md) and the Zol's Mistake mechanic) must not act in a cleansed state;
- cost 30 Glo power; 60-day cooldown.

Only Zol's dead are unmade. Volgan's hosts are hurt by the sword-bearer's ordinary prowess (traits), not by the wave (lore: Glo destroys Zol's directly sustained dead).

**The sword breaks.** When the journey's "The Old God Comes Forth" fires, `zin_horos_sword_broken` is set: Glo power drops to 25 and its cap to 50. The shard's wound to Zol is narrated in that event; Glo itself is not destroyed. What remains of Glo after the war is open: the system adds no new Glo effect after the coronation.

### Who can seek Glo

| Seeker | How | When | Possible results |
| --- | --- | --- | --- |
| **Eindil** | [journey](eindil_journey.md) stage 7 | historically 4A 1753 | Glo given (state 1); or the seal opens for him (state 1) |
| **Afrit** (as Aurevan), through his country: the Worshipdom, or Aenor once he is crowned (the Afrit system's trigger `zin_afrit_country`) | event `zin_glo.10` and decision `zin_glo_enter_the_hall` | after `zin_eindil_named` (+30 days), or after the early warning `zin_glo.5` | Kills Horos (historical), is wounded by Eindil; or is repelled; or seals Glo. Never holds it |
| **Volgan** | decision `zin_glo_grave_hunt` | from 1 Thaw 1753, Glo state 0 or 2, Volgan not at war with a neighbour | Kills Horos and seals Glo; or is repelled. Never holds it |
| **The Lost Cause** (its leader: Aenor while the Golden King lives, later whoever leads it) | decision `zin_glo_guard_the_hall` | any time; peaceful | Protects: guarantee, wards +10. Never holds it |
| **Any crown** (Coldor, Isengard, any other) | decision `zin_glo_petition_horos` | any time; once per country | Refused. Light petitioners part as friends; Dominion petitioners are rebuked |
| **Any country at war with Yeldenne** | conquest | — | The hall holds while Horos lives; annexation leaves Glo in the hall |
| **A dark power holding the sealed hall** (Afrit's country or Volgan) | decision `zin_glo_defile_seal` | Glo state 2, controls Mp'E | Dims Glo (state 3) after a year. Never holds it |
| **A second bearer** | decision `zin_glo_seek_as_bearer` | only `zin_eindil_lost`; Glo state 0 or 2; the country passes `zin_glo_worthy_claimant` | Glo to that country's best field marshal (state 4) |

`zin_glo_worthy_claimant` (proposed test of the working rule): government Light; not in an offensive war; no country flag `zin_glo_conqueror` (set by `on_annex` on any country that annexes another by war after the start); fewer than 3 `zin_footholds`; and either `zin_eindil_regard` ≥ 50 or membership of the Lost Cause.

### The race to Yeldenne

When Lorien names Eindil, the Deliverer's agents in the Lands of the Sun report it. Thirty days after `zin_eindil_named`, Afrit's country gets **`zin_glo.10` A Man of Aen's Line** (text only for Afrit's country):

| Option | Effect | AI |
| --- | --- | --- |
| **Go north and lie in wait** (hist) | sets `zin_aurevan_went_north`; Chancellor Merovan holds the seals in Parim (Aenor system); Afrit's party reaches the approach in 120 days and waits for the heir's landfall, then sets the ambush (journey stage 7) | historical: always; dynamic: 70 % |
| Go north and take Glo at once | as above, but on arrival the party enters the hall at once | dynamic: 20 % |
| Stay in Parim | nothing; no ambush; Eindil meets Horos alone | dynamic: 10 % |

While lying in wait, Afrit's country has the decision `zin_glo_enter_the_hall` (strike now). The AI takes it if the heir has not landed 365 days after the party arrived.

### The hall: outcomes

The confrontation fires as **`zin_glo.20` Who Walks Here?** to the owner of Mp'E, with a variant for Afrit's country. It resolves by who is present:

| Case | Who is in the hall | Outcome | Event |
| --- | --- | --- | --- |
| **A. Historical** | Afrit enters first; Eindil arrives during the fight (after the ambush) | Horos is struck from behind and falls. Eindil wounds Afrit; Afrit flees to his refuge. Horos tells Eindil the hidden history, gives Glo and the blue sword, turns to dust | `zin_glo.21` The Heart of Horos |
| **B1. Two against one** | Eindil is already in the hall when Afrit attacks (failed ambush or early arrival) | Afrit is driven off, badly wounded. Horos, wounded, judges the heir proven: he gives Glo and turns to dust | `zin_glo.23` Two Against One |
| **B2. The willing gift** | Eindil comes; Afrit never comes (stays in Parim) | Horos tests Eindil for 60 days (30 with `zin_yeldenne_awaits_heir`), then gives Glo and turns to dust of his own will | `zin_glo.22` The Willing Gift |
| **C. Afrit alone** | Afrit strikes before Eindil comes | Score test below: Horos repels him (C1) or is slain and seals Glo (C2) | `zin_glo.24` The Hall Holds / `zin_glo.25` The Sealed Heart |
| **D. Volgan's hunt** | Volgan's hunters strike | Score test: repelled (D1) or Horos slain, Glo sealed (D2) | `zin_glo.41` The Grave Hunt |

**Score test (cases C and D, proposed):**

`score = zin_yeldenne_wards + 30 + 10 if zin_yeldenne_forewarned + 10 if zin_yeldenne_hall_unyielding + random(−10 … +10) − attacker`

- `attacker` = 15 × `zin_afrit_artifacts` for Afrit (historically 4: −60); 40 for Volgan's hunt.
- score ≥ 50: the attacker is repelled. Wards −20; `zin_horos_endures` set; Glo state 0. Afrit (or Volgan) gets `zin_glo_wound_of_yeldenne` for 365 days. Gathering Dark −3.
- score < 50: Horos is slain. Dying, he binds Glo to the empty hall: `zin_horos_dead`, `zin_glo_sealed`, Glo state 2. Gathering Dark +5.

With start wards (50) and four artifacts the score is 10 to 30: Afrit alone always kills Horos, as he does in the historical fight. A Yeldenne player who raises the wards to 80 or more and takes both forewarning focuses always holds the hall against him (score 60 or more). Volgan's hunt against start wards scores 30 to 50 and succeeds unless the dice are at their best for Horos.

**Effects common to every case where Horos dies:** `zin_horos_dead`; Horos's character leaves Yeldenne (`retire_character`); Yeldenne's leader becomes the Warden of Mp'E (`zin_yeldenne_warden`); `zin_yeldenne_guardian_of_glo` is removed and `zin_yeldenne_the_empty_throne` added (365 days); the hall modifier changes to `zin_yeldenne_empty_hall` (or `zin_yeldenne_sealed_hall` if sealed); news `zin_glo.30` Silence in the North to every country; `zin_world_add_gathering_dark` +5.

**Effects when Glo passes to Eindil (A, B1, B2, seal opened):** `zin_glo_with_eindil`; Glo state 1; Glo power 100; the journey adds `zin_eindil_bearer_of_glo`; the bearer's host gets `zin_glo_glernaens_light`.

**Afrit wounded (A, B1, C1):** `zin_afrit_wounded_at_yeldenne` and the spirit `zin_glo_wound_of_yeldenne` on Afrit's country (365 days; 730 days in B1). The Afrit system decides whether the wound feeds the reveal; this system only marks it.

### After the hall

- **Sealed Glo, the heir comes** (Glo state 2, journey stage 7 or later, not `zin_eindil_lost`): **`zin_glo.80` The Seal Opens for the Heir**. Glo knows him. Through Glo's vision he learns that the king in Parim is his brother, son of Ein. Glo state 1.
- **Horos endures, the heir comes later:** case B2 applies when he arrives.
- **Sealed Glo, a dark power holds Mp'E:** decision `zin_glo_defile_seal` (365 days, 545 with `zin_yeldenne_seal_warded`; fails if control of Mp'E is lost). Success: **`zin_glo.51` Glo Dims**: Glo state 3, `zin_glo_dimmed`, Gathering Dark +10. Nobody, including Eindil, can use Glo after this. Eindil's journey continues without Glo; the New Gods' restoration then fails ("The Heir Does Not Rise").
- **The heir is lost** (`zin_eindil_lost`): the decision `zin_glo_seek_as_bearer` opens for worthy claimants (Glo state 0 with Horos alive, or 2). With Horos alive he judges; with Glo sealed, the seal judges. Success: Glo state 4.

### Peaceful start

At 1 Thaw 1748 the system shows only Yeldenne's spirit and the petition and guard decisions. No event fires before `zin_eindil_named` except those a player starts by decision, and none of them names Afrit or the heir.

## Implementation

### Files

| Path | Contents |
| --- | --- |
| `history/countries/<Yeldenne>.txt` (generated) | Horos as leader; start spirit; two divisions; no faction |
| `common/characters/zin_story_characters.txt` | `zin_horos` (country leader, Yeldenne), `zin_yeldenne_warden` (not recruited at start) |
| `common/country_leader/zin_glo_traits.txt` | `zin_horos_guardian`, `zin_yeldenne_warden_trait` |
| `common/unit_leader/zin_glo_traits.txt` | `zin_glo_second_bearer` |
| `common/ideas/zin_glo.txt` | spirits below |
| `common/dynamic_modifiers/zin_glo.txt` | hall modifiers |
| `common/opinion_modifiers/zin_glo.txt` | `zin_glo_friend_of_the_hall`, `zin_glo_rebuked` |
| `common/scripted_effects/zin_glo.txt`, `common/scripted_triggers/zin_glo.txt` | below |
| `common/decisions/zin_glo.txt`, category file | `zin_glo_seekers`, `zin_glo_bearer` |
| `events/zin_glo.txt` | namespace `zin_glo` |
| `common/on_actions/zin_glo_on_actions.txt` | startup; weekly hall pulse; `on_annex` (conqueror flag, "The Hall Remains") |
| `localisation/english/zin_glo_l_english.yml` | all text |

### Variables and flags

From the contract: `zin_horos_dead`, `zin_glo_with_eindil`, `zin_afrit_artifacts` (read), `zin_footholds` (read), `zin_gathering_dark` (through `zin_world_add_gathering_dark`).

New shared names (reported for the contract):

| Name | Kind | Meaning |
| --- | --- | --- |
| `zin_glo_state` | global variable 0–4 | where Glo is (table above) |
| `zin_glo_power` | global variable 0–100 | Glernaen's power the bearer can spend |
| `zin_yeldenne_wards` | global variable 0–100 | strength of the hall's protections |
| `zin_glo_sealed` | global flag | Horos died without a worthy bearer; Glo bound to the empty hall |
| `zin_glo_dimmed` | global flag | the dark defiled sealed Glo |
| `zin_horos_endures` | global flag | Horos repelled an attack on the hall |
| `zin_afrit_wounded_at_yeldenne` | global flag | Afrit bled at Yeldenne |
| `zin_glo_cleansed` | state flag, 60 days | Glo's Wave struck here; Zol's dead cannot rise again here |
| `zin_glo_conqueror` | country flag | annexed a country by war after the start (unworthy) |
| `zin_yeldenne_forewarned`, `zin_yeldenne_hall_unyielding` | global flags | set by Yeldenne focuses; +10 each to the hall score |
| `zin_yeldenne_coast_watch`, `zin_yeldenne_beacon`, `zin_yeldenne_guides` | global flags | set by Yeldenne focuses; −1 each to the journey's ambush strength |
| `zin_yeldenne_awaits_heir` | global flag | Horos's test of the heir in case B2 takes 30 days, not 60 |
| `zin_yeldenne_seal_warded` | global flag | defiling the seal takes 545 days, not 365 |
| `zin_yeldenne_calls_heir` | global flag | the seal opens the day the heir arrives (no 30-day wait); renown +10 |
| `zin_yeldenne_calls_bearer` | global flag | "Seek Glo as Its Bearer" costs no political power |
| `zin_aurevan_went_north` | global flag | the Deliverer left Parim for the north (also listed in the journey spec) |

Internal: `zin_glo_afrit_waiting` (Afrit's party at the approach), `zin_glo_afrit_arrival_date`, `zin_glo_defile_progress`, `zin_glo_wave_cooldown`.

### Characters

| Id | Who | Roles | Notes |
| --- | --- | --- | --- |
| `zin_horos` | Horos (established) | country leader of Yeldenne, Light, trait `zin_horos_guardian` | Portrait image-generated from the owner's three drawings as reference (silhouette, yellow-green armour, thorned helm, blue eyes, blue sword, green crystal). The drawings stay private and out of the repository; only the generated portrait ships |
| `zin_yeldenne_warden` | The Warden of Mp'E (proposed title; personal name left to the owner) | country leader of Yeldenne after Horos, Light, trait `zin_yeldenne_warden_trait` | recruited by `zin_yeldenne_install_warden` |

| Trait | Type | Modifiers |
| --- | --- | --- |
| `zin_horos_guardian` | country leader | `stability_factor` +0.10, `political_power_gain` +0.25 |
| `zin_yeldenne_warden_trait` | country leader | `army_core_defence_factor` +0.05 |
| `zin_glo_second_bearer` | unit leader | `army_attack_factor` +0.10, `army_org_factor` +0.10 |

### Spirits

| Key | Name | Modifiers | Added / removed |
| --- | --- | --- | --- |
| `zin_yeldenne_guardian_of_glo` | Guardian of Glo | `army_core_defence_factor` +0.25, `drift_defence_factor` +0.50, `stability_factor` +0.15 | Yeldenne start; removed when Horos dies |
| `zin_yeldenne_the_empty_throne` | The Empty Throne | `stability_factor` −0.10, `political_power_gain` −0.20 | Yeldenne when Horos dies; 365 days |
| `zin_glo_glernaens_light` | Glernaen's Light | `army_org_factor` +0.05, `attrition` −0.05, `stability_factor` +0.05 | the bearer's host country while Glo state is 1 or 4; moves with the bearer |
| `zin_glo_wound_of_yeldenne` | The Wound of Yeldenne | `political_power_gain` −0.20, `stability_factor` −0.05 | Afrit's or Volgan's country after a hall wound; 365 or 730 days. Its text is shown only to Afrit's country (or Volgan's) |
| `zin_glo_northern_watch` | The Northern Watch | `political_power_gain` −0.10 | the Lost Cause leader while it guards the hall; removed if the guarantee ends |

Dynamic modifiers (state Mp'E):

| Key | Modifiers | When |
| --- | --- | --- |
| `zin_yeldenne_hall_wards` | `enemy_attrition` +0.20, `enemy_army_speed_factor` −0.25, `enemy_local_supplies` −0.50 | while Horos lives |
| `zin_yeldenne_sealed_hall` | `enemy_attrition` +0.15, `enemy_local_supplies` −0.30 | Glo state 2 |
| `zin_yeldenne_empty_hall` | `enemy_attrition` +0.05 | Horos dead, Glo not sealed |

### Scripted triggers

| Trigger | True when |
| --- | --- |
| `zin_is_site_yeldenne` | the state is Mp'E (from the key-sites table) |
| `zin_horos_alive` | not `zin_horos_dead` |
| `zin_glo_in_play` | Glo state is 1 or 4 |
| `zin_glo_is_bearer_host` | ROOT employs the bearer (Eindil with Glo state 1, or the second bearer) |
| `zin_glo_worthy_claimant` | the worthiness test above |
| `zin_glo_hall_owner` | ROOT owns Mp'E |

Read from other systems (names proposed there): `zin_afrit_country` (Afrit system), `zin_eindil_is_host` (journey).

### Scripted effects

| Effect | Does |
| --- | --- |
| `zin_yeldenne_add_wards` (`value`) | clamps 0–100; updates the hall pulse's damage |
| `zin_glo_resolve_hall` (`case`) | applies case A, B1, B2, C or D; computes the score for C and D |
| `zin_glo_transfer` (`to` = eindil, second_bearer, seal) | sets Glo state, power, flags, traits and spirits |
| `zin_glo_wave` (`state`) | the wave as designed |
| `zin_glo_add_power` (`value`) | clamps to 0 and the current cap |
| `zin_yeldenne_install_warden` | recruits `zin_yeldenne_warden` in Yeldenne as country leader; removes the tree's wards spirits (`zin_yeldenne_glernaens_wards`, `zin_yeldenne_glernaens_wards_2`) unless Glo is sealed |
| `zin_glo_request_northern_watch` | from Yeldenne's focus: fires `zin_glo.64` to the Lost Cause leader |

### Decisions

| Category / decision | Who | Cost / time | Effect |
| --- | --- | --- | --- |
| `zin_glo_seekers` / Petition the Guardian | any country except Yeldenne and Afrit's; once | 50 PP | `zin_glo.61` after 30 days: refused; Light: opinion `zin_glo_friend_of_the_hall` (+20); Dominion: `zin_glo_rebuked` (−20) |
| `zin_glo_seekers` / Guard the Northern Hall | the Lost Cause leader; Horos alive | 100 PP | `zin_glo.60` to Yeldenne: accept: guarantee, wards +10, `zin_glo_northern_watch`; Horos lets the guard stand outside the hall, never inside |
| `zin_glo_seekers` / Hunt the Crystal in the North | Volgan; from 1 Thaw 1753; Glo state 0 or 2 | 150 PP; 180 days | `zin_glo.41` (case D) |
| `zin_glo_seekers` / Enter the Hall | Afrit's country, party waiting | — | case C, or B1 if Eindil is already inside |
| `zin_glo_seekers` / Defile the Seal | Afrit's country or Volgan; Glo state 2; controls Mp'E | 200 PP; 365 days | `zin_glo.51` |
| `zin_glo_seekers` / Seek Glo as Its Bearer | `zin_eindil_lost`; `zin_glo_worthy_claimant`; Glo state 0 or 2 | 100 PP; 180 days | `zin_glo.70`: Glo to the country's highest-skill field marshal |
| `zin_glo_bearer` / Glo's Wave (`zin_glo_wave_decision`) | the bearer's host; Glo power ≥ 30; bearer's army in or next to a state with Zol divisions | 30 Glo power; 60-day cooldown | `zin_glo_wave` |

### Events (namespace `zin_glo`)

| Id | Title | To | Trigger |
| --- | --- | --- | --- |
| 1 | (hidden) Glo setup | Yeldenne | on_startup: Glo state 0, wards 50, hall modifier |
| 2 | (hidden) Hall pulse | owner of Mp'E | every 7 days: damage intruders, expel after 28 days, monthly Glo power |
| 5 | A Castaway Who Speaks of Aen | Afrit's country only | an island sells news (journey stage 4): Dismiss (AI) / Send hunters |
| 10 | A Man of Aen's Line | Afrit's country only | `zin_eindil_named` + 30 days |
| 11 | The Approach to Yeldenne | Afrit's country only | party arrives |
| 20 | Who Walks Here? | owner of Mp'E; variant for Afrit's country | someone enters the hall |
| 21 | The Heart of Horos | owner of Mp'E, Eindil's witness | case A |
| 22 | The Willing Gift | owner of Mp'E | case B2 |
| 23 | Two Against One | owner of Mp'E; variant for Afrit's country | case B1 |
| 24 | The Hall Holds | owner of Mp'E; variant for the attacker | case C1 or D1 |
| 25 | The Sealed Heart | owner of Mp'E; variant for the attacker | case C2 or D2 |
| 30 | Silence in the North | news, all | Horos dies |
| 40 | The Grave Hunt Sets Out | Volgan | decision taken |
| 41 | The Grave Hunt | owner of Mp'E, Volgan | 180 days later |
| 50 | The Seal Resists | defiler | every 90 days of defilement |
| 51 | Glo Dims | news, all | defilement done |
| 60 | Guard the Northern Hall | Yeldenne | decision |
| 61 | The Guardian Refuses | petitioner | 30 days after petition |
| 62 | The Hall Expels the Intruders | intruder | 28 days of enemy control |
| 63 | The Hall Remains | annexer of Yeldenne | annexation while Horos lives |
| 64 | The Hall Asks for Guards | Lost Cause leader | Yeldenne focus `petition_the_lost_cause`: **Send the guard** (as the decision, no cost) / **We cannot spare them** (−10 opinion with Yeldenne) |
| 70 | A Second Bearer | claimant, news | decision done |
| 80 | The Seal Opens for the Heir | Eindil's witness | Eindil reaches sealed Glo |
| 90 | The Sword Breaks | bearer's host | with journey event "The Old God Comes Forth" |

**Secret-safe text.** Event 20 follows the vault's dialogue with one change for every country but Afrit's: Horos says "Son of Ein. I know why your father denied you." He does not say the name. Afrit's own variant keeps "Afrit, son of Ein". After `zin_afrit_revealed`, the Yeldenne retelling (journey event "The Bearer Leaves Yeldenne" and later flavour) may name him.

**Visual.** Event pictures for 20–25 are image-generated from the owner's Horos drawings as reference: the dark throne hall, stone pillars, Horos seated, the green light of Glo. No game screenshots, no art from other mods.

### Game rules

No new rule. `zin_rule_eindil_journey` HISTORICAL and `zin_rule_historical_path` force Afrit's option "Go north and lie in wait" and block Volgan's hunt and the defilement for the AI.

## AI

- **Yeldenne:** follows its tree's historical route ([regional/yeldenne.md](../05_focus_trees/regional/yeldenne.md)); never declares war; accepts the northern watch.
- **Afrit's country:** historical: lies in wait, strikes the hall only after the ambush. Dynamic: weights in the race table; strikes after 365 days of waiting.
- **Volgan:** never hunts on the historical path. Dynamic: 10 % per year from 1753 while Glo is in state 0 or 2 and Volgan is not at war; 30 % if Glo is sealed.
- **Defilement:** dynamic only; Afrit's country or Volgan, if it already controls Mp'E.
- **The Lost Cause leader:** dynamic only: guards the hall with 30 % per year while the Golden King lives and Erdae is at peace.
- **Petitions:** AI petitions only as flavour, 5 % per year for Coldor and Isengard.
- **Bearer's host:** uses Glo's Wave whenever possible against Zol's largest stack next to its armies.

## Acceptance

1. At start, Glo state is 0, wards are 50, Yeldenne is led by Horos with `zin_yeldenne_guardian_of_glo`, and no Glo event is pending.
2. On the historical path the hall resolves as case A in 4A 1753: `zin_horos_dead`, `zin_glo_with_eindil`, Glo state 1, Glo power 100, `zin_afrit_wounded_at_yeldenne`; Yeldenne is led by the Warden.
3. A test scenario of each case (A, B1, B2, C1, C2, D1, D2) gives the outcome in the tables, and in no case does Afrit's or Volgan's country gain Glo (negative tests).
4. With wards 100, `zin_yeldenne_forewarned` and `zin_yeldenne_hall_unyielding`, Afrit alone with four artifacts is repelled for every random value.
5. An enemy army occupying Mp'E while Horos lives loses control within 28 days and takes damage every week (scenario test).
6. Annexing Yeldenne while Horos lives leaves Glo state 0 and moves hall events to the annexer.
7. Glo's Wave damages only Zol's and Zol's subjects' divisions and sets `zin_glo_cleansed` (scenario test with mixed armies in one state).
8. Glo power never exceeds 50 after `zin_horos_sword_broken`.
9. No text reachable by any country but Afrit's names Afrit before `zin_afrit_revealed` (compiler).
10. All modifiers named here exist in the game's modifier documentation; all effects and triggers named exist in its effect and trigger documentation.

## Open questions

1. **The wardens of Mp'E.** The roster gives Yeldenne the people "men". The spec proposes a small household of human wardens who serve the hall, and a Warden who leads after Horos. Does the owner accept this, and does the Warden have a name?
2. **Can Horos survive in play?** The spec lets him repel Afrit or Volgan only when Eindil never comes, and he still gives Glo when the heir arrives. Is a surviving Horos acceptable as a gameplay outcome?
3. **Sealed, dimmed and second-bearer Glo.** These are gameplay-only outcomes built on the working rule that only a worthy bearer can hold Glo. Does the owner accept them, especially that the dark can dim Glo but never use it?
4. **Volgan's hunt.** The vault says Volgan wants Glo. Is a hunt to the far north plausible from the Dead Lands, or should Volgan only pursue Glo once Eindil carries it?
5. **Where is the castle?** The map holds it in Mp'E; the vault lists the exact place as open.
6. **Horos's words.** Should the Yeldenne player see the name Afrit in the hall (see the journey spec, question 6)?
7. **Glernaen in the text.** The spec calls Glernaen only "a New God of Power and Wisdom" and gives no symbols or cult. Confirm.
