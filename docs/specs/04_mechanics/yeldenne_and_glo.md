# Yeldenne and Glo

**Status:** Ready. Reviewed 19 October 2026 against CONVENTIONS "Status"; integrated 19 October 2026. **Priority:** 3. **Phase:** 3. **Depends on** the calendar ([00_foundation/01_start_and_calendar.md](../00_foundation/01_start_and_calendar.md)): the game still starts on 1936.1.1 until that spec is built. Dates below are Erdae engine dates (`1753.3.1` is 1 Thaw 4A 1753).

## Purpose

Glo is the one power in Erdae that can end Zol's dead, and the bridge through which the New Gods restore Eindil. This system covers:

- **Horos** and the **Castle of Yeldenne**, his one-state realm in Mp'E, the frozen north of the Cold Lands;
- **Glo**, the green crystal that is Horos's heart and holds part of the power of the New God **Glernaen**;
- **who can seek Glo**, what each seeker can and cannot win, and how the confrontation in the hall resolves;
- **what Glo does** once it leaves the castle, until the blue sword breaks.

It hands Glo to [Eindil's journey](eindil_journey.md) on the historical path and gives every other outcome a defined, lore-safe result. The two specs use the same names for every shared flag, event and effect. Yeldenne's focus tree is [regional/yeldenne.md](../05_focus_trees/regional/yeldenne.md); the world rules for Glo are in [03_gameplay/04_magic_and_world_systems.md](../03_gameplay/04_magic_and_world_systems.md).

## Lore basis

| Fact | Status | Source |
| --- | --- | --- |
| Horos is a Great Spirit, an enormous knight in yellow-green armour with branching helm points, glowing blue eyes and a blue sword; lord of Castle Yeldenne in the Cold Lands | established | *Horos*, *Horos Visual References* |
| Glo is a green crystal and Horos's literal heart; it holds part of the power of Glernaen, a true New God of Power and Wisdom | established | *Castle of Yeldenne and Glo*, *Glernaen* |
| Horos guarded Glo through the ages and rejected every claimant who sought it for conquest; Eindil is the first he willingly entrusts | established | *The Fourth Age of Erdae* VII |
| The guardian's willing transfer matters; Glo cannot be seized merely by occupying the castle; possession of the castle no longer guarantees ownership | established | *Horos*, *The Fourth Age of Erdae* VII |
| Horos resists the artifact-amplified Afrit far better inside the castle; Glernaen's old protections disrupt Afrit's artifacts there | established | *Horos*, *The Fourth Age of Erdae* VII |
| Afrit comes first and names himself Aenor's king and god; Horos names him Afrit, son of Ein, Eindil's brother, and orders him out; they fight; Horos seizes him; Afrit passes behind him and stabs the back of his neck; Eindil arrives and wounds Afrit; Afrit flees to his private refuge | established | *Castle of Yeldenne and Glo*, *Horos*, *Fourth Age Canon Register* |
| The escape artifact in that moment is the Ring of Doors | proposed | *The Fourth Age of Erdae* VII |
| Horos reveals the family truth, takes Glo from his chest, gives Glo and his blue sword to Eindil, and turns to dust; the castle is left empty | established | *Castle of Yeldenne and Glo* |
| The sword driven into the earth sends Glo's power through a front of Zol's dead; Glo and the sword end Zol's directly sustained dead; Zol crushes the sword; a shard still wounds Zol's manifestation | established | *Horos's Blue Sword*, *Glernaen* |
| Glo is the bridge for the New Gods' restoration of Eindil | proposed channel | *Glernaen*, *Castle of Yeldenne and Glo* |
| Afrit wants Glo (seizure or corruption); Volgan wants possession; the Lost Cause wants it protected | established | *Kingdoms Factions and Conflicts* |
| That Glo is Horos's heart is kept as a late reveal in game text, until `zin_horos_dead` | rule of the start situation | [02_lore/01_start_situation.md](../02_lore/01_start_situation.md) |
| Dates: the confrontation in 4A 1753 | proposed | *Fourth Age Chronology* |

**Open in the vault, and kept open here:** the castle's exact location and origin; the source and limits of Glo; what Glo leaves after the gods' gift and the sword's breaking; why only a worthy bearer may hold it (a working rule); the fate of Horos's spirit after his body turns to dust; Glernaen's character, symbols and cult (the vault says not to assign a doctrine).

**Proposed by this spec:** the wardens of Mp'E (a small human household that serves the hall, matching the roster's people "men") and their Warden; the ward strength measure; Glo's power measure; the hall outcome rules for non-historical cases; sealed Glo, dimmed Glo and the second bearer; the worthiness test; Volgan's grave hunt; the Lost Cause's northern watch; all numbers.

## Design

### The realm of Yeldenne

| Item | Value |
| --- | --- |
| Country | Yeldenne (Cold Lands, tier B), Light |
| Territory | One state, **Mp'E**; capital victory point **Castle of Yeldenne** ([map accuracy](../01_map/01_map_accuracy.md) S11, K7; today the politics step still names the capital Simoto, a phase 1 map fix) |
| Ruler | Horos (`zin_horos`), Light, trait `zin_horos_guardian`. The characters module renames Yeldenne's generated ruler to the contract id ([02_lore/02_characters.md](../02_lore/02_characters.md)) |
| People | men (roster): the wardens of Mp'E (proposed), herders, tithe-folk and guards of the frozen north who serve the hall |
| Start army | none: the castle's guard is this mechanic, not an army ([03_gameplay/01_warfare.md](../03_gameplay/01_warfare.md)). The politics step's order of battle for Yeldenne drops the one division it writes today |
| Start spirit | `zin_yeldenne_guardian_of_glo` |
| Diplomacy at start | at peace with everyone; no guarantees; no faction; `zin_footholds` cap 0 (Afrit spec) |

Horos is **not** a general. He never leaves the hall. His strength in play is the realm's spirit, the wards and the hall rules below.

### The wards

`zin_yeldenne_wards` (global, 0–100, start 50) measures Glernaen's old protections around the hall. It is global, because it belongs to the site, not the country. It changes only through `zin_yeldenne_add_wards`.

| Source | Change |
| --- | --- |
| Yeldenne focuses (root and Watch branch) | +5 to +15 each, +65 in total |
| Yeldenne focuses after an attack or Horos's death (`the_guardian_endures`, `keep_the_empty_hall`, `seal_the_hall`) | +10 to +20 |
| The Lost Cause's northern watch (accepted guard) | +10 |
| Horos repels an attack (hall outcome "The Hall Holds") | −20 |
| Horos dies | wards fall to 20 (empty hall) or stay as they are (sealed hall) |

**While Horos lives, the hall cannot be taken** (lore: Glo cannot be seized by occupying the castle):

- Mp'E carries the dynamic modifier `zin_yeldenne_hall_wards`: `enemy_attrition` +0.20, `enemy_army_speed_factor` −0.25, `enemy_local_supplies` −0.50.
- Every 7 days, if an enemy of Mp'E's owner controls Mp'E or has divisions there, `damage_units` hits that enemy's divisions in the state (`org_damage` 0.5; `str_damage` 0.05 below 50 wards, 0.10 at 50–79, 0.15 at 80 or more; `ratio = yes`).
- `on_state_control_changed` records the day an enemy takes Mp'E (state variable `zin_glo_occupied_since`). After 28 days of enemy control, **The Hall Expels the Intruders**: Mp'E's owner takes control back (`set_state_controller`).
- At startup every AI country gets `add_ai_strategy` `conquer` −500 toward Yeldenne. It is cancelled (+500) when Horos dies.
- If Yeldenne is annexed anyway (a player peace deal), **The Hall Remains** fires to the annexer: it owns Mp'E, but Horos stays in the hall and Glo stays with him. From then on every hall event targets the owner of Mp'E. Horos is a site, not a vassal.

### Glo

`zin_glo_state` (global):

| Value | Meaning | How it is reached |
| ---: | --- | --- |
| 0 | With Horos at Yeldenne | start |
| 1 | Carried by Eindil (`zin_glo_with_eindil`) | Horos's willing gift, or the seal opens for him |
| 2 | Sealed in the empty hall (`zin_glo_sealed`) | Horos slain before a worthy bearer came |
| 3 | Dimmed (`zin_glo_dimmed`): defiled by the dark, useless to anyone | a dark power completes the defilement of the sealed hall |
| 4 | Carried by a second bearer | only after `zin_eindil_lost`; a worthy claimant takes it |

**Nobody unworthy ever holds Glo** (magic spec invariant 2). Afrit and Volgan can kill Horos, seal Glo or dim it. They can never hold or use it: Glo never passes to Afrit on any path (decision O3), and no Glo state stands for it. Glo moves only through `zin_glo_transfer`.

`zin_glo_power` (global, 0–100) is how much of Glernaen's power the bearer can spend. It changes only through `zin_glo_add_power`, which clamps to 0 and the current cap (100; 50 after `zin_horos_sword_broken`):

| Event | Glo power |
| --- | --- |
| Glo passes to a bearer | set to 100 |
| Every 28 days while carried | +3 |
| Glo's Wave | −30 |
| The New Gods restore Eindil (journey `zin_eindil.98`, needs Glo state 1) | +100 (to the cap) |
| Zol crushes the sword and draws out the gods' gifts (`zin_horos_sword_broken`) | set to 25; cap 50 from then on |

### What Glo gives

| Holder | Gift |
| --- | --- |
| Horos (state 0) | The wards and hall rules above; Yeldenne's start spirit |
| Eindil (state 1) | Trait `zin_eindil_bearer_of_glo` (journey); Horos's blue sword; the host spirit `zin_glo_glernaens_light`; the decision **Glo's Wave**; potent magic (the magic spec's `zin_has_potent_magic` through `zin_glo_is_bearer_host`); the New Gods' restoration ([journey](eindil_journey.md), stage 9) |
| Second bearer (state 4) | Trait `zin_glo_second_bearer`; the host spirit; Glo's Wave; potent magic. No sword and no restoration: the gods' gift came to Eindil because he freely accepted the burden (proposed rule; magic spec: the New Gods restore once, never a second bearer) |

**Glo's Wave** (scripted effect `zin_glo_wave` with args `state` and `first`; decision `zin_glo_wave_decision`): in one state where the bearer's army stands, or next to it (journey trigger `zin_eindil_army_near`; for a second bearer, the same test on that character):

- **The first wave** (`first = yes`, the journey's `zin_eindil.91` on Eindil's return, "the sword in the earth"): destroys Zol's divisions in that state and in every adjacent Zol-controlled state: `damage_units` with `limit` on divisions owned by Zol or Zol's subjects, `org_damage` 1.0, `str_damage` 1.0, `ratio = yes`, once for the state and once per adjacent state. No Zol or warfare effect takes part: the wave is this spec's alone; losses from `damage_units` never return through Zol's `zin_zol_return_the_fallen`;
- **Later waves:** `damage_units` on every division owned by Zol or Zol's subjects in the state: `org_damage` 1.0, `str_damage` 0.5, `ratio = yes`;
- either way, the state flag `zin_glo_cleansed` for 60 days: the Zol spec does not place newly raised dead in a cleansed state (dependency on [zols_mistake.md](zols_mistake.md));
- the decision costs 30 Glo power and has a 60-day cooldown (the first wave is free).

Only Zol's dead are unmade. Volgan's hosts are hurt by the sword-bearer's ordinary prowess (traits), not by the wave (lore: Glo destroys Zol's directly sustained dead). Casualties the bearer's host inflicts on Zol do not return to him, because the host has potent magic (Zol spec).

**The sword breaks.** The Zol spec's `zin_mistake.21` *One Finger* is the one sword-break event and the only setter of `zin_horos_sword_broken` (N1, O4). This system has no event of its own for the moment: its hall pulse `zin_glo.2` sees the flag once (guard flag `zin_glo_sword_handled`) and runs `zin_glo_on_sword_broken`: Glo power to 25, cap 50. The shard's wound to Zol is narrated in Zol's event; Glo itself is not destroyed. What remains of Glo after the war is open: the system adds no new Glo effect after the coronation (magic spec).

### Who can seek Glo

| Seeker | How | When | Possible results |
| --- | --- | --- | --- |
| **Eindil** | [journey](eindil_journey.md) stage 7 | historically 4A 1753 | Glo given (state 1); or the seal opens for him (state 1) |
| **Afrit**, through the Worshipdom (the Afrit spec's hub, `zin_afrit_is_hub`) | the Afrit spec's `zin_afrit.31` and voyage, then `zin_glo.11` and the decision `zin_glo_enter_the_hall` | after `zin_eindil_named` and that spec's delay, or after the early warning `zin_glo.5` | Kills Horos and is wounded by Eindil (historical); or is driven off; or is repelled; or kills Horos and seals Glo. Never holds it |
| **Volgan** | decision `zin_glo_grave_hunt` | from `1753.3.1`; Volgan has `zin_volgan_seeks_glo` (Volgan tree, *The Green Crystal*); Glo state 0 or 2; Volgan not at war with a neighbour | Kills Horos and seals Glo; or is repelled. Never holds it |
| **The Lost Cause** (its leader, `zin_glo_lost_cause_leader`) | decision `zin_glo_guard_the_hall`, or Yeldenne's request `zin_glo.64` | any time while Horos lives; peaceful | Protects: guarantee, wards +10. Never holds it |
| **Any crown** (Coldor, Isengard, any other) | decision `zin_glo_petition_horos` | any time; once per country | Refused. Light petitioners, and any petitioner with the Cold Lands spec's `zin_cold_hall_respected` (Coldor's *Leave the Hall in Peace*), part as friends; other Dominion petitioners are rebuked |
| **Any country at war with Mp'E's owner** | conquest | — | The hall holds while Horos lives; annexation leaves Glo in the hall |
| **A dark power holding the sealed hall** (the Worshipdom, a realm Afrit rules, or Volgan) | decision `zin_glo_defile_seal` | Glo state 2; controls Mp'E | Dims Glo (state 3) after a year. Never holds it |
| **A second bearer** | decision `zin_glo_seek_as_bearer` | only `zin_eindil_lost`; Glo state 0 or 2; the country passes `zin_glo_worthy_claimant` | Glo to that country's highest-skill field marshal (state 4) |

`zin_glo_lost_cause_leader` (proposed): the leader of the faction named The Lost Cause when `zin_lost_cause_shield` is set; else the original Aenor realm, which holds the institution (S3); after `zin_lost_cause_with_eindil`, the Host of Eindil. Never a country Afrit rules (`zin_afrit_rules_here`): Horos would not let the Deliverer's guard stand at his door.

`zin_glo_worthy_claimant` (proposed test of the working rule): government Light; no offensive war (`has_offensive_war`); no country flag `zin_glo_conqueror`; `zin_footholds` below 3; and either `zin_eindil_regard` ≥ 50, the country flag `zin_lost_cause_member` (Aenor spec), or membership of the Host's coalition. `zin_glo_conqueror` is set by `on_declare_war` on any country that declares a war after the start, except a war on Zol, Volgan, a subject of either, or (after `zin_afrit_revealed`) the Worshipdom or a realm Afrit rules.

### The race to Yeldenne

When Lorien names Eindil, the Deliverer's agents in the Lands of the Sun report it. The report is the Afrit spec's private `zin_afrit.31` *Word from the Lands of the Sun* (N8); this spec has no report event of its own. The Afrit spec owns the event, its delay, its option order (E2) and its options, the union of both specs. This spec reads what was chosen:

| `zin_afrit.31` option | Afrit spec's effect | Read here | The hall |
| --- | --- | --- | --- |
| **Go north and lie in wait** (hist) | voyage (60 days, 30 with `zin_worshipdom_cold_maps`; the Afrit spec's timing, R6); `zin_aurevan_went_north`; arrival sets `zin_afrit_at_yeldenne` | the party waits at the approach: `zin_glo.11` to the Worshipdom; `zin_glo_enter_the_hall` opens | case A after the ambush; B1 if Eindil is already inside; C if it strikes first |
| **Go north and take Glo at once** | as above, plus `zin_afrit_hall_at_once` (the Afrit spec's flag) | on arrival `zin_glo.20` fires at once | C, or B1 if Eindil is already inside |
| **Send others** | `zin_afrit_sent_others` (the Afrit spec's flag); the Council's agents ambush the crew (strength −1) | no Afrit in the hall | B2 |
| **Stay in Parim** | nothing | — | B2 |

AI weights belong to the Afrit spec. This spec proposes, for the free rule: lie in wait 60 %, take Glo at once 20 %, send others 10 %, stay 10 % (Afrit goes himself 80 %, as that spec says).

While lying in wait, the Worshipdom has the decision `zin_glo_enter_the_hall` (strike now). Under the free rule the AI takes it if the heir has not landed 365 days after the party arrived, or within 20 days with 50 % if the heir is in the hall (case B1). Under the historical rule it waits for the ambush.

### The hall: outcomes

The confrontation fires as **`zin_glo.20` Who Walks Here?** to the owner of Mp'E, with a private variant for the Worshipdom. It resolves by who is present:

| Case | Who is in the hall | When it fires | Outcome | Event |
| --- | --- | --- | --- | --- |
| **A. Historical** | Afrit enters first; Eindil arrives during the fight | 14 days after the journey's `zin_eindil.71` resolves with 2 or more (Afrit reached the hall first) | Horos seizes Afrit and is struck from behind and falls. Eindil wounds Afrit; Afrit flees to his refuge. Horos tells Eindil the hidden history, gives Glo and the blue sword, turns to dust | `zin_glo.21` The Heart of Horos |
| **B1. Two against one** | Eindil is already in the hall when Afrit attacks | the Worshipdom takes `zin_glo_enter_the_hall` during case B2's test | Afrit is driven off, badly wounded. Horos, wounded, judges the heir proven: he gives Glo and turns to dust | `zin_glo.23` Two Against One |
| **B2. The willing gift** | Eindil comes; Afrit does not enter | Eindil reaches the castle with Horos alive | Horos tests Eindil for 60 days (30 with `zin_yeldenne_awaits_heir`), then gives Glo and turns to dust of his own will | `zin_glo.22` The Willing Gift |
| **C. Afrit alone** | Afrit strikes before Eindil comes | `zin_glo_enter_the_hall`, or arrival with `zin_afrit_hall_at_once` | Score test below: Horos repels him (C1) or is slain and seals Glo (C2) | `zin_glo.24` The Hall Holds / `zin_glo.25` The Sealed Heart |
| **D. Volgan's hunt** | Volgan's hunters strike | 180 days after `zin_glo_grave_hunt` | Score test: repelled (D1) or Horos slain, Glo sealed (D2) | `zin_glo.41` The Grave Hunt |

**Score test (cases C and D, proposed):**

`score = zin_yeldenne_wards + 30 + 10 if zin_yeldenne_forewarned + 10 if zin_yeldenne_hall_unyielding + random(−10 … +10) − attacker`

- `attacker` = 15 × `zin_afrit_artifacts` for Afrit (historically 4: −60); 40 for Volgan's hunt.
- score ≥ 50: the attacker is repelled. Wards −20; `zin_horos_endures` set; Glo state 0. Afrit: `zin_afrit_wound` (Afrit spec). Volgan: spirit `zin_glo_wound_of_yeldenne` (365 days). Gathering Dark −3 (tension spec value, applied here once).
- score < 50: Horos is slain. Dying, he binds Glo to the empty hall: `zin_glo_sealed`, Glo state 2, and the common effects below.

With start wards (50) and four artifacts the score is 10 to 30: Afrit alone always kills Horos, as he does in the historical fight. A Yeldenne player who raises the wards to 80 or more and takes both forewarning focuses always holds the hall against him (score 60 or more). Volgan's hunt against start wards scores 30 to 50 and succeeds unless the dice are at their best for Horos.

**Effects common to every case where Horos dies:** `zin_horos_dead`; `zin_yeldenne_install_warden` (if Yeldenne exists), then `retire_character = zin_horos`; `zin_yeldenne_guardian_of_glo` removed and `zin_yeldenne_the_empty_throne` added (365 days); the hall modifier changes to `zin_yeldenne_empty_hall` (or `zin_yeldenne_sealed_hall` if sealed); the AI conquest block is cancelled; news `zin_glo.30` Silence in the North to every country; `zin_world_add_gathering_dark` +5 (tension spec value, once).

**Effects when Glo passes to Eindil (A, B1, B2, seal opened):** `zin_glo_transfer` with `to = eindil`: `zin_glo_with_eindil`; Glo state 1; Glo power 100; `zin_glo_follow_bearer` gives the bearer's host `zin_glo_glernaens_light`; the journey adds `zin_eindil_bearer_of_glo` (its `zin_eindil.73`).

**Afrit wounded (A, B1, C1):** this spec calls the Afrit spec's `zin_afrit_wound`, which sets `zin_afrit_wounded`, gives the realm Afrit leads *The Deliverer Rests* and lowers the veil. The Afrit spec decides what else the wound feeds.

### After the hall

- **Sealed Glo, the heir comes** (Glo state 2, journey stage 7 or later, not `zin_eindil_lost`): **`zin_glo.80` The Seal Opens for the Heir**, 30 days after he arrives (the same day with `zin_yeldenne_calls_heir`, and renown +10). Glo knows him. Through Glo's vision he learns that the king in Parim is his brother, son of Ein. Glo state 1.
- **Horos endures, the heir comes later:** case B2 applies when he arrives.
- **Sealed Glo, a dark power holds Mp'E:** decision `zin_glo_defile_seal` (365 days, 545 with `zin_yeldenne_seal_warded`; fails if control of Mp'E is lost). `zin_glo.50` The Seal Resists fires every 90 days of it. Success: **`zin_glo.51` Glo Dims**: Glo state 3, `zin_glo_dimmed`, Gathering Dark +10 (tension spec value, once). Nobody, including Eindil, can use Glo after this. Eindil's journey continues without Glo; the New Gods' restoration then fails ("The Heir Does Not Rise").
- **The heir is lost** (`zin_eindil_lost`): the decision `zin_glo_seek_as_bearer` opens for worthy claimants (Glo state 0 with Horos alive, or 2). With Horos alive he judges; with Glo sealed, the seal judges. Success: Glo state 4.

### Peaceful start

At 1 Thaw 1748 the system shows only Yeldenne's spirit and the petition and guard decisions. No event fires before `zin_eindil_named` except those a player starts by decision, and none of them names Afrit or the heir. No text says Glo is Horos's heart before `zin_horos_dead` (start situation rule); the petition and guard texts call it "the green crystal the guardian keeps".

## Implementation

### Builder module

| Item | Value |
| --- | --- |
| Module | `tools/content/modules/mech_yeldenne_glo.mjs`, exporting `buildYeldenneGlo(staged, data)`, called from `tools/content/build.mjs`; it returns its startup snippet for `common/on_actions/zin_startup.txt` |
| Data | `tools/content/data/mechanics/yeldenne_glo.json`: spirits, traits, dynamic modifiers, decisions, events with pictures, the score constants, AI weights and localisation |
| Test | `tools/content/mech_yeldenne_glo.test.mjs`, added to the `test` script in `tools/package.json` (the integrator edits it) |
| Countries | named in the data (Yeldenne, Worshipdom, Volgan, Zol, Aenor, Coldor, Isengard), resolved to tags from `tools/content/data/countries.json` |
| Replaces | no interim stub |

### Files written by the module

| Path | Contents |
| --- | --- |
| `common/characters/zin_yeldenne_glo.txt` | `zin_yeldenne_warden` (not recruited at start; portrait `GFX_zin_portrait_men_male_2` until the art pipeline makes one) |
| `common/country_leader/zin_yeldenne_glo.txt` | `zin_horos_guardian`, `zin_yeldenne_warden_trait` |
| `common/unit_leader/zin_yeldenne_glo.txt` | `zin_glo_second_bearer` |
| `common/ideas/zin_glo.txt` | spirits below (icons `picture = zin_<catalog key>`) |
| `common/dynamic_modifiers/zin_glo.txt` | hall modifiers |
| `common/opinion_modifiers/zin_glo.txt` | `zin_glo_friend_of_the_hall` (+20), `zin_glo_rebuked` (−20) |
| `common/scripted_effects/zin_glo.txt`, `common/scripted_triggers/zin_glo.txt` | below |
| `common/decisions/zin_glo.txt`, `common/decisions/categories/zin_glo.txt` | categories `zin_glo_seekers`, `zin_glo_bearer` |
| `events/zin_glo.txt` | namespace `zin_glo` |
| `common/on_actions/zin_glo.txt` | `on_state_control_changed` (Mp'E), `on_annex` ("The Hall Remains"), `on_declare_war` (`zin_glo_conqueror`) |
| `interface/zin_glo.gfx` | `GFX_decision_zin_<key>` sprites pointing at existing catalog idea textures |
| `localisation/english/zin_glo_l_english.yml` | all text (UTF-8 BOM through `yml()`) |

The startup snippet sets Glo state 0, wards 50 and power 0; adds `zin_yeldenne_hall_wards` to Mp'E, `zin_yeldenne_guardian_of_glo` to Yeldenne and `zin_horos_guardian` to Horos; adds the AI conquest block; starts the hall pulse `zin_glo.2`. The Mp'E site trigger `zin_is_site_yeldenne` comes from the key-sites table.

### Variables and flags

From the contract: `zin_horos_dead`, `zin_glo_with_eindil` (set here), `zin_afrit_artifacts` (read), `zin_footholds` (read), `zin_gathering_dark` (through `zin_world_add_gathering_dark`). Read from other specs: `zin_eindil_named`, `zin_eindil_stage`, `zin_eindil_lost`, `zin_eindil_regard`, `zin_horos_sword_broken` (journey, Zol); `zin_afrit_at_yeldenne`, `zin_afrit_revealed`, `zin_worshipdom_cold_maps` (Afrit); `zin_volgan_seeks_glo` (Volgan tree); `zin_lost_cause_shield`, `zin_lost_cause_member`, `zin_lost_cause_with_eindil` (Aenor).

Shared names this spec owns (in the contract additions register):

| Name | Kind | Meaning |
| --- | --- | --- |
| `zin_glo_state` | global variable 0–4 | where Glo is (table above) |
| `zin_glo_power` | global variable 0–100 | Glernaen's power the bearer can spend |
| `zin_yeldenne_wards` | global variable 0–100 | strength of the hall's protections |
| `zin_glo_sealed` | global flag | Horos died without a worthy bearer; Glo bound to the empty hall |
| `zin_glo_dimmed` | global flag | the dark defiled sealed Glo |
| `zin_horos_endures` | global flag | Horos repelled an attack on the hall |
| `zin_glo_cleansed` | state flag, 60 days | Glo's Wave struck here; the Zol spec places no newly raised dead here |
| `zin_glo_conqueror` | country flag | declared a war after the start (unworthy) |
| `zin_yeldenne_forewarned`, `zin_yeldenne_hall_unyielding` | global flags | set by Yeldenne focuses; +10 each to the hall score |
| `zin_yeldenne_coast_watch`, `zin_yeldenne_beacon`, `zin_yeldenne_guides` | global flags | set by Yeldenne focuses; −1 each to the journey's ambush strength |
| `zin_yeldenne_awaits_heir` | global flag | Horos's test in case B2 takes 30 days, not 60 |
| `zin_yeldenne_seal_warded` | global flag | defiling the seal takes 545 days, not 365 |
| `zin_yeldenne_calls_heir` | global flag | the seal opens the day the heir arrives; renown +10 |
| `zin_yeldenne_calls_bearer` | global flag | "Seek Glo as Its Bearer" costs no political power |

Set by the Afrit spec's `zin_afrit.31` options: `zin_afrit_hall_at_once` and `zin_afrit_sent_others` (global flags). The wound flag is the Afrit spec's `zin_afrit_wounded`, set by `zin_afrit_wound`. `zin_aurevan_went_north` is the Afrit spec's (set by `zin_afrit.32`).

Internal: `zin_glo_occupied_since` (state variable on Mp'E), `zin_glo_defile_progress`, `zin_glo_wave_cooldown`, `zin_glo_sword_handled`, character flag `zin_glo_bearer` (the second bearer).

### Characters

| Id | Who | Roles | Notes |
| --- | --- | --- | --- |
| `zin_horos` | Horos (established) | country leader of Yeldenne, Light, trait `zin_horos_guardian` | Defined by the characters module. Portrait image-generated from the established description only (decision A6); the owner's private drawings are not used until the owner agrees ([OPEN_QUESTIONS.md](../OPEN_QUESTIONS.md), short list 14) and never enter the repository |
| `zin_yeldenne_warden` | The Warden of Mp'E (proposed title; no personal name) | country leader of Yeldenne after Horos, Light, trait `zin_yeldenne_warden_trait` | recruited by `zin_yeldenne_install_warden` (`recruit_character`, `add_country_leader_role` with `promote_leader = yes`) |

| Trait | Type | Modifiers |
| --- | --- | --- |
| `zin_horos_guardian` | country leader | `stability_factor` +0.10, `political_power_gain` +0.25 |
| `zin_yeldenne_warden_trait` | country leader | `army_core_defence_factor` +0.05 |
| `zin_glo_second_bearer` | unit leader | `army_attack_factor` +0.10, `army_org_factor` +0.10 |

### Spirits

| Key | Name | Icon | Modifiers | Added / removed |
| --- | --- | --- | --- | --- |
| `zin_yeldenne_guardian_of_glo` | Guardian of Glo | `crystal_green` | `army_core_defence_factor` +0.25, `drift_defence_factor` +0.50, `stability_factor` +0.15 | Yeldenne start; removed when Horos dies |
| `zin_yeldenne_the_empty_throne` | The Empty Throne | `empty_throne` | `stability_factor` −0.10, `political_power_gain` −0.20 | Yeldenne when Horos dies; 365 days |
| `zin_glo_glernaens_light` | Glernaen's Light | `new_gods_light` | `army_org_factor` +0.05, `attrition` −0.05, `stability_factor` +0.05 | the bearer's host while Glo state is 1 or 4; moves with the bearer (`zin_glo_follow_bearer`) |
| `zin_glo_wound_of_yeldenne` | The Wound of Yeldenne | `castle_ice` | `political_power_gain` −0.20, `stability_factor` −0.05 | Volgan after case D1; 365 days. Afrit's wound is the Afrit spec's `zin_afrit_deliverer_rests` |
| `zin_glo_northern_watch` | The Northern Watch | `ward_circle` | `political_power_gain` −0.10 | the Lost Cause leader while it guards the hall; removed if the guarantee ends |

Dynamic modifiers (state Mp'E):

| Key | Modifiers | When |
| --- | --- | --- |
| `zin_yeldenne_hall_wards` | `enemy_attrition` +0.20, `enemy_army_speed_factor` −0.25, `enemy_local_supplies` −0.50 | while Horos lives |
| `zin_yeldenne_sealed_hall` | `enemy_attrition` +0.15, `enemy_local_supplies` −0.30 | Glo state 2 |
| `zin_yeldenne_empty_hall` | `enemy_attrition` +0.05 | Horos dead, Glo not sealed |

### Scripted triggers

| Trigger | True when |
| --- | --- |
| `zin_horos_alive` | not `zin_horos_dead` |
| `zin_glo_in_play` | Glo state is 1 or 4 |
| `zin_glo_is_bearer_host` | ROOT employs the bearer: `zin_eindil` with Glo state 1, or a unit leader with character flag `zin_glo_bearer` with state 4 (read by the magic spec's `zin_has_potent_magic`) |
| `zin_glo_worthy_claimant` | the worthiness test above |
| `zin_glo_lost_cause_leader` | the Lost Cause leader rule above |
| `zin_glo_hall_owner` | ROOT owns Mp'E |
| `zin_glo_heir_in_hall` | Eindil has reached the castle and case B2's test is running |

Read from other systems: `zin_is_site_yeldenne` (key sites), `zin_afrit_is_hub`, `zin_afrit_rules_here` (Afrit), `zin_eindil_is_host`, `zin_eindil_army_near` (journey).

### Scripted effects

| Effect | Does |
| --- | --- |
| `zin_yeldenne_add_wards` (`value`) | clamps 0–100 |
| `zin_glo_resolve_hall` (`case`) | applies case A, B1, B2, C or D; computes the score for C and D |
| `zin_glo_transfer` (`to`) | sets Glo state, power, flags, traits and spirits |
| `zin_glo_follow_bearer` | moves `zin_glo_glernaens_light` to the bearer's current host (called by the journey's `zin_eindil_set_host`) |
| `zin_glo_wave` (`state`, `first`) | the wave as designed |
| `zin_glo_add_power` (`value`) | clamps to 0 and the current cap |
| `zin_glo_on_sword_broken` | power to 25, cap 50 (once) |
| `zin_yeldenne_install_warden` | recruits `zin_yeldenne_warden` in Yeldenne as country leader; removes the regional tree's wards spirits (`zin_regional_yeldenne_glernaens_wards`, `zin_regional_yeldenne_glernaens_wards_2`, F4) unless Glo is sealed |
| `zin_glo_clear_seal_keepers` | removes the regional tree's spirit `zin_regional_yeldenne_seal_keepers` from Yeldenne; `zin_glo_transfer` calls it whenever Glo state becomes 1, 3 or 4 (Glo leaves the hall or dims) |
| `zin_glo_request_northern_watch` | from Yeldenne's focus: fires `zin_glo.64` to the Lost Cause leader |

**Arguments (E1).** Scripted effects take no parameters: each argument is the temporary variable `zin_arg_<name>` set just before the call. Codes: `case` A 1, B1 2, B2 3, C 4, D 5; `to` eindil 1, second_bearer 2, seal 3; `first` 0 or 1; `state` is the state id; `value` a number.

Effects of other systems called: `zin_afrit_wound` (Afrit), `zin_world_add_gathering_dark` (world). The wave itself uses the engine's `damage_units`; it calls no Zol effect.

### Decisions

| Category / decision | Who | Cost / time | Effect |
| --- | --- | --- | --- |
| `zin_glo_seekers` / Petition the Guardian | any country except Mp'E's owner and the Worshipdom; once | 50 PP | `zin_glo.61` after 30 days: refused; Light, or `zin_cold_hall_respected`: opinion `zin_glo_friend_of_the_hall`; other Dominion: `zin_glo_rebuked` |
| `zin_glo_seekers` / Guard the Northern Hall | `zin_glo_lost_cause_leader`; Horos alive | 100 PP | `zin_glo.60` to Yeldenne: accept: guarantee (`give_guarantee`), wards +10, `zin_glo_northern_watch`; Horos lets the guard stand outside the hall, never inside |
| `zin_glo_seekers` / Hunt the Crystal in the North | Volgan; as in the seekers table | 150 PP; 180 days | `zin_glo.40` now; `zin_glo.41` (case D) at the end |
| `zin_glo_seekers` / Enter the Hall | the Worshipdom, party waiting (`zin_afrit_at_yeldenne`), Horos alive | — | case C, or B1 if the heir is in the hall |
| `zin_glo_seekers` / Defile the Seal | the Worshipdom, a realm Afrit rules, or Volgan; Glo state 2; controls Mp'E | 200 PP; 365 days | `zin_glo.51` |
| `zin_glo_seekers` / Seek Glo as Its Bearer | `zin_eindil_lost`; `zin_glo_worthy_claimant`; Glo state 0 or 2 | 100 PP (0 with `zin_yeldenne_calls_bearer`); 180 days | `zin_glo.70`: Glo to the country's highest-skill field marshal |
| `zin_glo_bearer` / Glo's Wave (`zin_glo_wave_decision`) | the bearer's host; Glo power ≥ 30; a state near the bearer's army holds Zol divisions | 30 Glo power; 60-day cooldown | `zin_glo_wave` |

The Worshipdom's decisions are visible only to it (Afrit spec, "The secret"). Their names before `zin_afrit_revealed` are mask-safe ("Enter the Hall", "Defile the Seal").

### Events (namespace `zin_glo`)

| Id | Title | To | Trigger | Picture |
| --- | --- | --- | --- | --- |
| 1 | (hidden) Glo setup | Yeldenne | on_startup (with the snippet) | — |
| 2 | (hidden) Hall pulse | owner of Mp'E | every 7 days: damage intruders, expel after 28 days, Glo power every 28 days, the sword check | — |
| 5 | A Castaway Who Speaks of Aen | the Worshipdom only | an island sells news (journey stage 4): Dismiss (AI) / Send hunters | `storm_wreck` |
| 11 | The Approach to Yeldenne | the Worshipdom only | `zin_afrit_at_yeldenne` | `cold_shore` |
| 20 | Who Walks Here? | owner of Mp'E; private variant for the Worshipdom | someone enters the hall | `yeldenne_hall` |
| 21 | The Heart of Horos | owner of Mp'E, Eindil's witness | case A | `glo_given` |
| 22 | The Willing Gift | owner of Mp'E | case B2 | `glo_given` |
| 23 | Two Against One | owner of Mp'E; variant for the Worshipdom | case B1 | `glo_given` |
| 24 | The Hall Holds | owner of Mp'E; variant for the attacker | case C1 or D1 | `yeldenne_hall` |
| 25 | The Sealed Heart | owner of Mp'E; variant for the attacker | case C2 or D2 | `yeldenne_hall` |
| 30 | Silence in the North | news, all | Horos dies | `yeldenne_hall` |
| 40 | The Grave Hunt Sets Out | Volgan | decision taken | `dead_lands_storm` |
| 41 | The Grave Hunt | owner of Mp'E, Volgan | 180 days later | `dead_lands_storm` |
| 50 | The Seal Resists | defiler | every 90 days of defilement | `vast_shadow` |
| 51 | Glo Dims | news, all | defilement done | `vast_shadow` |
| 60 | Guard the Northern Hall | Yeldenne | decision | `yeldenne_hall` |
| 61 | The Guardian Refuses | petitioner | 30 days after petition | `yeldenne_hall` |
| 62 | The Hall Expels the Intruders | intruder | 28 days of enemy control | `yeldenne_hall` |
| 63 | The Hall Remains | annexer of Yeldenne | annexation while Horos lives | `yeldenne_hall` |
| 64 | The Hall Asks for Guards | Lost Cause leader | Yeldenne focus `petition_the_lost_cause`: **Send the guard** (as the decision, no cost) / **We cannot spare them** (−10 opinion with Yeldenne) | `yeldenne_hall` |
| 70 | A Second Bearer | claimant, news | decision done | `glo_given` |
| 80 | The Seal Opens for the Heir | Eindil's host or witness | Eindil reaches sealed Glo | `glo_given` |

Ids 10 and 90 are not used: the report of the naming is the Afrit spec's `zin_afrit.31` (N8), and the sword-break is Zol's `zin_mistake.21`, handled by the pulse `.2` (O4). Every event writes `timeout_days = 30` (E2); none decides a path checkpoint for a human. Every picture key exists in game; the Horos pictures `yeldenne_hall` and `glo_given` are drawn from the established text only (A6).

**Requested pictures and art** (image-generated only):

| Key | Shows | Gate | Used by (now using) |
| --- | --- | --- | --- |
| Warden of Mp'E portrait | A hooded human warden in grey furs before a pale stone gate, no face detail, no lettering | — | `zin_yeldenne_warden` (`GFX_zin_portrait_men_male_2`) |

**Secret-safe text.** Event 20 follows the vault's dialogue with one change for every country but the Worshipdom: Horos says "Son of Ein. I know why your father denied you." He does not say the name. The Worshipdom's private variant keeps "Afrit, son of Ein". After `zin_afrit_revealed`, the Yeldenne retelling (the journey's "The Bearer Leaves Yeldenne" and later flavour) may name him. Localisation keys that may name Afrit end in `_hub` or `_revealed`, as in the journey. No key that can show before `zin_horos_dead` says Glo is Horos's heart.

### Game rules

No new rule. The journey's `zin_eindil_historical` (its rule, or the path rule HISTORICAL) forces Afrit's option "Go north and lie in wait" and blocks Volgan's hunt, the defilement and Enter the Hall before the ambush for the AI.

## AI

- **Yeldenne:** follows its tree's historical route ([regional/yeldenne.md](../05_focus_trees/regional/yeldenne.md)); never declares war; accepts the northern watch.
- **The Worshipdom:** historical: lies in wait, enters the hall only after the ambush (case A). Free: the race weights above; strikes after 365 days of waiting.
- **Volgan:** never hunts on the historical path. Free: 10 % per year from 1753 while Glo is in state 0 or 2, `zin_volgan_seeks_glo` is set and Volgan is not at war; 30 % if Glo is sealed.
- **Defilement:** free rule only; the Worshipdom, a realm Afrit rules, or Volgan, if it already controls Mp'E.
- **The Lost Cause leader:** free rule only: guards the hall with 30 % per year while the Golden King lives and Erdae is at peace.
- **Petitions:** AI petitions only as flavour, 5 % per year for Coldor and Isengard.
- **Bearer's host:** uses Glo's Wave whenever possible against Zol's largest stack near its armies.

## Acceptance

(a) build test (`npm test`), (b) the isolated Linux run (one in-game year from phase 3 on, S8; no new error.log lines from ZIN files), (c) a scenario run with HOI4 Agent Tools (`hoi4_scenario_test`, `hoi4_mechanic_test`) on the mod source.

1. (a) Every `zin_glo` event id is defined once and ids 10 and 90 do not exist; every referenced event, decision, idea, trait, modifier and effect is defined; every option has localisation and an `ai_chance`; every picture key exists.
2. (a) No localisation key outside the `_hub` and `_revealed` sets contains "Afrit"; no key reachable before `zin_horos_dead` calls Glo Horos's heart.
3. (a) Every modifier in the trait, spirit and dynamic modifier tables is in the 1.19.3 modifier documentation (the three hall modifiers in its state scope); every effect and trigger named is in the effect and trigger documentation.
4. (a) No script of this spec sets `zin_potent_magic` or gives Glo to the Worshipdom, a realm Afrit rules or Volgan (O3); no generated file contains a name from the contract register's retired table.
5. (b) At start, Glo state is 0, wards are 50, Yeldenne is led by Horos with `zin_yeldenne_guardian_of_glo` and has no division; no Glo event fires in the run's year.
6. (c) On the historical path the hall resolves as case A in 4A 1753: `zin_horos_dead`, `zin_glo_with_eindil`, Glo state 1, Glo power 100, `zin_afrit_wounded`; Yeldenne is led by the Warden.
7. (c) A scenario of each case (A, B1, B2, C1, C2, D1, D2) gives the outcome in the tables, and in no case does the Worshipdom, a realm Afrit rules or Volgan gain Glo (negative tests).
8. (c) With wards 100, `zin_yeldenne_forewarned` and `zin_yeldenne_hall_unyielding`, Afrit alone with four artifacts is repelled for every random value.
9. (c) An enemy army occupying Mp'E while Horos lives loses control within 28 days and takes damage every week.
10. (c) Annexing Yeldenne while Horos lives leaves Glo state 0 and moves hall events to the annexer.
11. (c) Glo's Wave damages only Zol's and Zol's subjects' divisions and sets `zin_glo_cleansed` (mixed armies in one state).
12. (c) Glo power never exceeds 50 after `zin_horos_sword_broken`, and `zin_glo_on_sword_broken` runs exactly once.
13. (c) A Dominion petitioner with `zin_cold_hall_respected` gets `zin_glo_friend_of_the_hall`, not `zin_glo_rebuked`; Glo leaving the sealed hall removes `zin_regional_yeldenne_seal_keepers`.

## Open questions

The owner's questions are in [OPEN_QUESTIONS.md](../OPEN_QUESTIONS.md), "eindil and glo" 6–11, "warfare" 14 and the short list 14. The work proceeds on these proposals:

1. **The wardens of Mp'E.** A human household of wardens serves the hall; an unnamed Warden rules after Horos; historically they keep the empty hall.
2. **Can Horos survive in play?** Yes, as a gameplay outcome: he repels Afrit or Volgan only when Eindil has not come, and still gives Glo when the heir arrives.
3. **Sealed, dimmed and second-bearer Glo.** Gameplay-only outcomes on the working rule that only a worthy bearer can hold Glo; the dark can dim Glo but never use it.
4. **Volgan's hunt.** Plausible only after Volgan's tree turns him toward the crystal (`zin_volgan_seeks_glo`), and never on the historical path.
5. **Where is the castle?** The map holds it in Mp'E; text never says more.
6. **Horos's words.** Only the Worshipdom reads the name Afrit in the hall before `zin_afrit_revealed`.
7. **Glernaen and the drawings.** Glernaen is only "a New God of Power and Wisdom", with no symbols or cult. Horos's art comes from the established text until the owner allows his drawings as references.
8. **Yeldenne's army.** No division at start (warfare spec).
