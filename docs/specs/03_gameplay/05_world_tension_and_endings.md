# World tension and endings

**Status:** Ready. Reviewed 19 October 2026 against CONVENTIONS "Status"; integrated 19 October 2026. **Priority:** 3 (the meter), 5 (the endings). **Phase:** 3 and 5.

## Purpose

Vanilla world tension measures how close the world is to a world war. ZIN replaces it, as the meter players watch, with **the Gathering Dark** (`zin_gathering_dark`): how near Erdae is to catastrophe. It starts low because the world seems at peace. It rises through pressures nobody sees whole, jumps at the great moments of the story, and falls when the dark powers are beaten. Engine tension stays underneath and follows it, so the engine's diplomacy keeps working.

This spec also owns the **War of the Last Crowns** flag, the **world tick** that runs ZIN's global logic, and the **endings**: the three canon endings (the Lost Cause, Children of Volgan, the Ashen Throne), the proposed alternative outcomes, how each is detected and how it is shown.

## Lore basis

**Established:**

- The world seems at peace at the start; the dangers exist but few see them (owner, 18 October 2026).
- Hidden pressures build at once: the rot at the centre (Aenor ruled by the Hidden Council), the dark in the south (Volgan), the dead in the north (Zol), old grudges in the west and north, ambition in the east (*The Campaign of 4A 1748* frames them; each pressure is established in its own note).
- The War of the Last Crowns is several overlapping wars, not one attack on one day (*The Fourth Age of Erdae*, IX). The name is proposed (*War of the Last Crowns*).
- The original compendium defines three **alternative** endings, not three events that all happen (*Possible Endings*):
  - **The Lost Cause:** the alliance under Eindil prevails and refuses imperial domination.
  - **Children of Volgan:** Volgan dominates a ruined world through monsters, grave hosts and client states.
  - **The Ashen Throne:** Afrit rules through worship, bargains, corruption and captured institutions.
- The precise mechanics leading to each ending are **open** in the vault. The established story ends with Eindil's coronation, which is the Lost Cause.

**Proposed in the vault:** four additional outcomes, explicitly outside canon: the Golden Court endures under a surviving Golden King; a western crown holds Parim; Lerendor becomes master of the strait; the East unites under one king who is not Afrit (*The Campaign of 4A 1748*).

**Proposed in this spec:** the meter's tiers and sources, the damping above 50, every number, the detection rules, the fallback "The Age Unfinished".

**Decisions applied** ([INTEGRATION_DECISIONS.md](../INTEGRATION_DECISIONS.md)): V1 (the meter starts at 10), V3 (the sandbox runs to 4A 1800), V4 and R2 (every fixed date here reads `zin_story_pace`), R5 (the monthly tick's ninth step calls `zin_story_tick`), E1 (arguments compile to `zin_arg_<name>`), D3 (the world learns the name Afrit at his flight east), D6 (Dominion and Shadow `generate_wargoal_tension = 0.25`, so nobody justifies freely at the start).

## Design

### The meter

`zin_gathering_dark`: global variable, 0 to 100. **Start: 10** (V1; set on startup by this spec).

| Tier | Range | Name (proposed) | What it opens (owners in brackets) |
| --- | --- | --- | --- |
| 1 | 0–24 | **Seeming Peace** | Only causes allow wars; peace-breakers are punished (diplomacy) |
| 2 | 25–49 | **Unease** | Caravan, raid and crown-defied causes (diplomacy); the Grey Ford may break by decision (West); Dominion and Shadow may justify freely from 35 (diplomacy) |
| 3 | 50–74 | **The Gathering Dark** | `zin_cb_against_the_dark`; the Dragon Pact (magic); Wild realms justify from 60 |
| 4 | 75–100 | **The Last Crowns** | Break the Refusal (diplomacy) |

The first time the meter enters tiers 2, 3 and 4, a news event fires (`zin_world.10`, `.11`, `.12`). Their text describes the mood of courts and markets, never names Afrit, and never mentions Eindil before `zin_eindil_awake`.

### Changing the meter

Every change goes through `zin_world_add_gathering_dark` (argument `value`). Gains are scaled; losses are not:

- × `zin_gathering_dark_rate` (the foundation's game rule `zin_rule_gathering_dark`: 1.0, 0.5 or 1.5);
- × 1.0 below 50, × 0.6 from 50 to 74, × 0.4 from 75 up (the darker the world, the less each new blow moves it; this keeps the meter readable through the war).

The effect clamps to 0–100, stores the change in `zin_gd_last_change`, and fires the tier news on first entry.

### Replacing world tension

- **Display.** The Erdae bar shows the Gathering Dark; the native world tension widget is relabelled and keeps working ([07_interface/01_interface.md](../07_interface/01_interface.md)). The tooltip lists the active monthly sources by label with their values, last month's change and the tier.
- **Engine tension follows the meter.** Engine world tension still drives justification, guarantees, faction joining and war support. Its target is (`zin_gathering_dark` − 10) ÷ 100, never below 0, so it is 0 at the start as the foundation's defines require. Each month the world tick:
  1. if `threat` is below the target by more than 0.02, adds named threat (`add_named_threat = { threat = <2, 5 or 10> name = zin_world_threat_gathering_dark }`, shown as "The Gathering Dark") to the country behind the largest active source (Volgan for the south, Zol for the north, Aenor for the court, council and envoys, the largest aggressor for wars), repeating up to three steps;
  2. if `threat` rose by more than 0.02 since last month (engine wars, annexations), adds half of that rise to the meter as "Wars of the Living";
  3. never lets engine tension push a falling meter back up. Engine tension then decays by the foundation's tension defines.
- Tension defines (time scale, decay, war and annexation values) belong to the foundation ([00_foundation/05_defines_and_rules.md](../00_foundation/05_defines_and_rules.md)); this spec sets none.

### Monthly sources

Applied by the world tick. Labels before `zin_afrit_revealed` must not hint at Afrit.

| Key | Label before the reveal / after | Condition | Per month |
| --- | --- | --- | ---: |
| `court` | The Court's Excess | Aenor's `zin_court_corruption` ≥ 50 / ≥ 75 | +0.05 / +0.10 |
| `council` | A Hidden Cause / The Hidden Council | Aenor's `zin_council_influence` ≥ 60; doubled after `zin_aurevan_crowned` | +0.05 / +0.10 |
| `south` | The South Stirs | Volgan's `zin_dominion_strength` ≥ 50 / ≥ 75 | +0.10 / +0.20 |
| `north` | Black Ships in the North | Zol's `zin_mistake_power` ≥ 40 / ≥ 70 | +0.10 / +0.20 |
| `envoys` | Restless Envoys / The Deliverer's Web | Sum of all `zin_footholds` ≥ 150 / ≥ 300 | +0.05 / +0.10 |
| `wars` | Wars of the Living | Each active war with a major on either side | +0.10 each, at most +0.40 |
| `dead_march` | The Dead March | Zol controls states outside Zol's Mistake | +0.02 per state, at most +0.30 |
| `dominion_march` | The Dominion Marches | Volgan and its subjects control states outside the Dead Lands | +0.02 per state, at most +0.30 |
| `glo` | Glo Carried by the Worthy | `zin_glo_state` 1 or 4 | −0.10 |
| `league` | The Lost Cause Stands | `zin_aenor_lost_cause` ≥ 60 | −0.10 |
| `peace` | The Long Peace | `zin_world_peace_holds` (never below 5) | −0.05 |
| `age_turns` | The Age Turns | An ending has been reached (never below 10) | −0.50 |

Each source's current value is stored in `zin_gd_src_<key>` for the tooltip.

### One-time changes

Each moment's owner applies its value through `zin_world_add_gathering_dark`. Values set in the mechanic specs are listed so the whole budget is visible; values marked "world" are applied by this spec when the flag is first seen by the world tick.

| Moment | Flag | Change | Applied by |
| --- | --- | ---: | --- |
| Fishermen's tales (each, at most +5 in all) | — | +0.5 | Zol's Mistake |
| Volgan's veil falls to Rumoured / Suspected / Seen | — | +2 / +3 / +5 | Volgan |
| Dissenters at court silenced; other Council deeds | — | +1 to +3 | Afrit |
| The Golden King dies | `zin_golden_king_dead` | +8 | world |
| Aurevan is crowned | `zin_aurevan_crowned` | +4 | world |
| Horos dies | `zin_horos_dead` | +5 | Yeldenne and Glo |
| Horos repels an attacker | `zin_horos_endures` | −3 | Yeldenne and Glo |
| Glo dims | `zin_glo_dimmed` | +10 | Yeldenne and Glo |
| Eindil is denounced in Aenor | `zin_aenor_eindil_denounced` | +2 | world |
| The War of the Last Crowns begins | `zin_war_of_last_crowns` | +6 | world |
| Lerendor leaves the treaty | `zin_leren_withdrawal` | +4 | Lerendor |
| The Western Crossing (early crossing) | `zin_western_crossing` | +5 (+10) | Western Crossing |
| The eastern invasion | `zin_eastern_invasion` | +2 | world |
| Zol's dead rise | `zin_zol_rising` | +10 | Zol's Mistake |
| Mirolon falls | `zin_mirolon_fallen` | +5 | Volgan |
| Volgan marches north | `zin_volgan_marches` | +10 | Volgan |
| The name Afrit is known (unmasked early) | `zin_afrit_revealed` | +5 (+10) | Afrit |
| The Host of the East | — | +5 | Afrit |
| Zol manifests | `zin_zol_manifested` | +10 | Zol's Mistake |
| Volgan's body is destroyed | `zin_volgan_body_destroyed` | −10 | Volgan |
| Zol withdraws | `zin_zol_withdrawn` | −12 | world |
| Varner, Lorien or Golbran dies (each) | `zin_varner_dead`, `zin_lorien_dead`, `zin_golbran_dead` | +1 | world |
| Afrit returns from the East | `zin_afrit_returned` | +5 | Afrit |
| Afrit dies | `zin_afrit_dead` | −15 | world |
| Eindil is lost to the story | `zin_eindil_lost` | +10 | world |
| Eindil is crowned | `zin_eindil_crowned` | −15 | world |
| Wall breached / Wall Accord broken / peace-breaker war / dragon corrupted | — | +3 / +3 / +2 / +1 | magic, diplomacy |
| Wall roads closed / Feud of the Groves / the elven passes lost (once per war) | `zin_elves_feud` (feud) | +1 / +2 / +1 | [elves](../04_mechanics/elves_wall_and_dragons.md) |
| A heeded warning of Gala turns to fear | — | +1 | [Lands of the Sun](../04_mechanics/lands_of_the_sun.md) |
| Mirolon's proof reaches 75 / Aenor guarantees Mirolon | — | +3 / +2 | Volgan |
| A Goldoroth raid on the Accord (at most +3 in all) / a border clash / Goldoroth's war focuses (each) / Goldoroth kneels to Volgan / the truce against the dead | — | +0.25 / +1 / +1 to +3 / +3 / −1 | [Dark Lands](../04_mechanics/dark_lands.md) section 11 |
| A western claimant takes Parim's throne / the West sails as Aenor's relief | `zin_west_throne_claimed` | +3 / −3 | Western Crossing |

The "world" values are applied once per flag (global flags `zin_gd_done_<flag>` record it).

### Calibration on the historical path

Design targets under `zin_rule_historical_path = HISTORICAL` and the normal rate. The implementation tunes the monthly sources until a 12-year observer run lands within ±5 of each value.

| Date (4A) | Moment | Meter |
| --- | --- | ---: |
| 1 Thaw 1748 | Start | 10 |
| Mistfall 1750 | Before the Golden King's death | 18 |
| Longnight 1750 | After the death and the crowning | 30 |
| Late 1753 | After Horos's death | 50 |
| Late 1754 | Eindil denounced | 58 |
| Late 1755 | The war on every front | 82 |
| Early 1757 | Before Volgan's body is destroyed | 88 |
| Late 1757 | After Zol withdraws | 73 |
| 1759 | After Afrit's death | 64 |
| Thaw 1760 | Coronation | 49 |
| 1767 | Sandbox | 10–15 |

### The War of the Last Crowns

The contract assigns `zin_war_of_last_crowns` to world systems. Event `zin_world.20` "The War of the Last Crowns" sets it:

| Rule (`zin_rule_historical_path`) | When |
| --- | --- |
| `HISTORICAL` | 1 Rainwake 4A 1755 (`1755.4.1`), moved by the story pace: start + (date - start) × `zin_story_pace` (V4; see [06_historical_path_and_ai.md](06_historical_path_and_ai.md)) |
| `PLAUSIBLE` | The first of: the meter ≥ 65 after 1 Thaw 4A 1754; a dark power (`zin_diplo_is_dark_power`) at war with a major that is not a dark power; 1 Thaw 4A 1756 (both dates moved by the story pace, R2) |
| `FREE` | The first of the first two conditions above; no date |

The flag marks that the age's great war has begun. It forces no war itself: each front is its owner's (Volgan's war on Mirolon, the Western Crossing, the eastern invasion, Lerendor's withdrawal, Zol's rising). News to everyone; the text speaks of crowns arming on every shore and names no hidden power.

### The endings

Exactly one ending can be reached per game: global flag `zin_ending_reached`, variable `zin_world_ending`. Every ending goes through `zin_world_reach_ending` (argument `ending`), which focuses and other specs may call when their own trigger allows (for example the Worshipdom's *The Ashen Throne* focus). `zin_world_check_endings` runs the checks below; the world tick calls it monthly and the Aenor spec calls it at the coronation.

#### Canon endings (checked any time)

| Ending | `ending` key, flag, number | Detected when |
| --- | --- | --- |
| **The Lost Cause** | `lost_cause`, `zin_ending_lost_cause`, 1 | `zin_eindil_crowned` is set (the Aenor spec's coronation, which already requires Afrit dead and Eindil holding Parim). If `zin_lost_cause_with_eindil` is not set yet, the ending sets it: the coronation is the league's victory under Eindil. |
| **Children of Volgan** | `children_of_volgan`, `zin_ending_children_of_volgan`, 2 | `zin_volgan_children_ready` (Volgan spec: Volgan's body intact, Parim held by Volgan or a subject, at least four subjects, strength ≥ 60, Eindil not crowned), checked from 1 Thaw 4A 1756 |
| **The Ashen Throne** | `ashen_throne`, `zin_ending_ashen_throne`, 3 | `zin_afrit_ashen_throne_ready` (Afrit spec: Afrit alive with the Necklace, holding Parim, 12 countries at footholds 4+, and one of its three late conditions) |

If two canon endings qualify in the same check, the order above decides.

#### Proposed outcomes (outside canon; judged once)

On 1 Deepwinter 4A 1762 (`1762.1.1` at the standard pace; like every date here it is moved by `zin_story_pace`, R2), if no ending has been reached, the world tick checks these in order and reaches the first that holds. Judging them after the historical end keeps them from cutting a canon ending short.

| # | Outcome | Key, flag | Holds when |
| --- | --- | --- | --- |
| 4 | **The Golden Court Endures** | `golden_court`, `zin_ending_golden_court` | `zin_golden_king_dead` not set (the Aenor spec's `zin_golden_king_survives`, or the Afrit spec's Kingdom Behind the Throne with the King alive) |
| 5 | **A Western Crown in Parim** | `western_crown`, `zin_ending_western_crown` | `zin_west_holds_parim` (Western Crossing spec) |
| 6 | **Master of the Strait** | `strait_master`, `zin_ending_strait_master` | `zin_leren_strait_supremacy` and `zin_leren_holds_strait` (Lerendor spec) |
| 7 | **One King in the East** | `eastern_king`, `zin_ending_eastern_king` | `zin_east_united` (eastern kings spec), and `zin_afrit_dead` or `zin_afrit_king_of_east` never set |
| 8 | **The Age Unfinished** (fallback) | `unfinished`, `zin_ending_unfinished` | Checked on 1 Deepwinter 4A 1770 (moved by the story pace): no ending yet |

The two judgement dates are the generated triggers `zin_world_date_judgement` and `zin_world_date_unfinished` (the historical path's `zin_<system>_date_<key>` pattern, three date sets), which the endings spec's warnings one and two years before also read.

The vault leaves Zol's intentions open, so **no Zol ending is designed** (open question 2).

### How an ending is shown

1. **News for everyone** (`zin_world.100`–`.107`, one per ending; events and text written by the [endings spec](../06_events/04_endings.md) in `events/zin_world_endings.txt`): picture (`gfx/event_pictures/zin/zin_ending_*.dds`, image-generated; icon catalog keys `ending_*`), title, two or three sentences. Canon texts paraphrase the established summaries and close nothing open: no word on Volgan's spirit, the Necklace's price, Zol's fate or the Fifth Age. Proposed outcomes say "in this telling of the age".
2. **The secret.** If `zin_afrit_revealed` is not set when the Ashen Throne is reached, `zin_world_reach_ending` first calls the Afrit spec's `zin_afrit_reveal`; the ending then names him, as the Afrit spec expects. Its private event `zin_afrit.80` goes to the Worshipdom.
3. **The Chronicle of the Age** (`zin_world.110`, every human player; event and its scripted localisation in `common/scripted_localisation/zin_ending.txt` belong to the endings spec): built from the historical path's checkpoint states (which moments happened as in history, which went another way, which never came), the final meter and the date.
4. **Lasting marks** (proposed): the winner gets a permanent spirit. Lost Cause: Eindil's Aenor gets **No Crown over Crowns** (`zin_world_no_crown_over_crowns`: `political_power_factor = 0.10`, `annex_cost_factor = 0.50`; the settlement refuses imperial domination). Children of Volgan: Volgan gets **Lord of a Ruined World** (`army_attack_factor = 0.10`, `stability_factor = -0.10`). Ashen Throne: Afrit's realm gets **The Worshipped King** (`stability_factor = 0.15`, `political_power_factor = 0.10`). Each proposed outcome gives its holder a small spirit named after it (`political_power_factor = 0.05`, `stability_factor = 0.05`).
5. **After the ending** the meter's label reads "The Age Has Turned"; `age_turns` lowers it toward 10; the sandbox runs to 4A 1800. No other ending can fire.

## Implementation

### What is in the game today (commit `ca01fa3`)

Nothing of this spec is in the game. The vanilla world tension widget still shows. `events/zin_world.txt` holds one hidden interim event (`zin_world.1`, vanilla removal stub), which this spec's events replace.

### Builder module and data

A new content-builder module, `tools/content/modules/world_tension.mjs`, writes every file below. It writes the `zin_world` namespace header in `events/zin_world.txt` and its own ids 1–29; the magic module adds ids 30–69 to the same file. The ending ids 100–119 are reserved here but written by the endings spec's module `events_zin_ending.mjs` in its own file `events/zin_world_endings.txt` (convention C6: one namespace may span files, one module per file), so `events/zin_world.txt` holds no id from 100 to 119.

| Path | Kind | Content |
| --- | --- | --- |
| `tools/content/data/world_tension.json` (new) | builder data | Tiers, monthly sources, one-time values, calibration table, endings and their spirits |
| `common/scripted_effects/zin_world_tension.txt` | generated | `zin_world_add_gathering_dark` (arg `value`), `zin_world_tension_tick`, `zin_world_sync_engine_tension`, `zin_world_check_endings`, `zin_world_reach_ending` (arg `ending`), `zin_world_start_last_crowns` |
| `common/scripted_triggers/zin_world_tension.txt` | generated | `zin_world_gd_tier_1` … `_4`, `zin_world_peace_holds` (meter < 25 and no war with a major on each side), `zin_world_great_war_exists` |
| `common/scripted_localisation/zin_world_tension.txt` | generated | Source lines (secret-aware), tier names. The Chronicle's lines are the endings spec's (`common/scripted_localisation/zin_ending.txt`) |
| `common/scripted_triggers/zin_world_dates.txt` | generated | `zin_world_date_last_crowns`, `zin_world_date_plausible_meter`, `zin_world_date_plausible_latest`, `zin_world_date_judgement`, `zin_world_date_unfinished`, `zin_world_date_children` (1 Thaw 4A 1756 for Children of Volgan): one `date >` test per pace value, through `tools/content/lib/story_dates.mjs` (R2) |
| `common/ideas/zin_world_endings.txt` | generated | Ending spirits |
| `common/on_actions/zin_world.txt` | generated | `on_startup` (meter 10) and the monthly and weekly world tick |
| `events/zin_world.txt` | generated | Namespace `zin_world`: 1–29 tension, tiers and the war (30–69 belong to the magic spec; 100–119 to the endings spec's `events/zin_world_endings.txt`) |
| `localisation/english/zin_world_tension_l_english.yml` | generated | Text, including the named threat `zin_world_threat_gathering_dark` and the relabelled world tension keys (`WORLD_TENSION_NAME` and its tooltip, under the whole-file rule of the vanilla removal spec §3.5) |
| `gfx/event_pictures/zin/zin_ending_*.dds` | generated art (presentation module) | Ending pictures, icon catalog keys `ending_*`. Until they exist, the endings use the event pictures already in the game: `coronation` (Lost Cause), `grave_muster` (Children of Volgan), `unmasking` (Ashen Throne) and `chronicle` (proposed outcomes), each shown only after its flag |

The game rule `zin_rule_gathering_dark` and the variable `zin_gathering_dark_rate` are defined by the foundation's rules file ([05_defines_and_rules.md](../00_foundation/05_defines_and_rules.md)).

### The world tick

ZIN's global logic runs once a month and once a week whichever countries exist:

- `on_monthly` runs for every country. Its effect starts with `if = { limit = { NOT = { has_global_flag = zin_world_tick_month } } set_global_flag = { flag = zin_world_tick_month value = 1 days = 25 } … }`, so the world block runs once a month from whichever country is processed first.
- `on_weekly` does the same with `zin_world_tick_week` (`value = 1 days = 5`) for the magic spec's pulses.
- Monthly order: (1) sum `casualties_k` of every country into `zin_world_dead_k`; (2) one-time "world" values for new flags; (3) monthly sources; (4) the engine sync; (5) the War of the Last Crowns check; (6) tier news; (7) ending checks; (8) the historical path's tick `zin_path_tick` ([06_historical_path_and_ai.md](06_historical_path_and_ai.md)); (9) the events' story runner `zin_story_tick` ([06_events](../06_events/01_golden_king_and_succession.md), convention C6, decision R5), which runs every namespace's runner block; (10) for every human player (`every_country = { limit = { is_ai = no } … }`), the interface's `zin_ui_refresh` ([07_interface/01_interface.md](../07_interface/01_interface.md)) and the Chronicle's `zin_chr_count_unread` ([07_interface/04_chronicle_codex.md](../07_interface/04_chronicle_codex.md)), so panels and the unread count follow the month's changes.

### Variables and flags

| Name | Kind | Meaning |
| --- | --- | --- |
| `zin_gathering_dark` | global variable, 0–100 | The meter (contract) |
| `zin_gd_src_<key>` | global variables | Current value of each monthly source |
| `zin_gd_last_change`, `zin_world_last_threat`, `zin_world_dead_k` | global variables | Last change; last month's engine threat; world casualties in thousands |
| `zin_gd_done_<flag>` | global flags | A "world" one-time change was applied |
| `zin_world_tick_month`, `zin_world_tick_week` | timed global flags | Tick guards |
| `zin_ending_reached` | global flag | An ending has been reached |
| `zin_world_ending` | global variable, 1–8 | Which ending |
| `zin_ending_golden_court`, `zin_ending_western_crown`, `zin_ending_strait_master`, `zin_ending_eastern_king`, `zin_ending_unfinished` | global flags | Proposed outcomes |

## AI

The meter has no AI of its own. It shapes AI through engine tension (the ideology thresholds), the AI strategies the tiers enable in other specs, and these rules:

- In tier 1 every AI has `prepare_for_war` −50 toward every country against which it holds no cause.
- From tier 3, AI realms bordering a dark power raise `build_building` weight for stone forts by 50%.
- Ending conditions are never AI goals in themselves; the dark powers' AI pursues their mechanics, and the endings follow from the map.

## Acceptance

1. On 1 Thaw 4A 1748 the meter reads 10, engine tension is 0, and no source label names or hints at Afrit (Linux run, console `list_vars`; names spec check T2).
2. Over 24 months of AI play under HISTORICAL, the meter stays within ±5 of the calibration table and engine `threat` within 0.10 of the target; engine tension stays below 0.10 until `zin_golden_king_dead` (Linux observer run, 3 seeds; the foundation's test).
3. The tier news events fire once each, in order, never before their tier (Linux observer run log).
4. `zin_war_of_last_crowns` is set on 1 Rainwake 4A 1755 under HISTORICAL at the standard pace, and by 1 Thaw 4A 1756 under PLAUSIBLE (Linux observer runs under each rule).
5. Each canon ending is reachable in a scenario run: the Lost Cause on the historical path; Children of Volgan with Volgan given Parim, four subjects and strength 60 by console; the Ashen Throne with the Afrit spec's scenario test.
6. Each proposed outcome is reachable in a scenario run by setting its owner's flag and advancing to 1 Deepwinter 4A 1762.
7. Exactly one ending flag is ever set per game (every scenario and observer run above checks the count).
8. The Ashen Throne never shows the name Afrit to a player before `zin_afrit_revealed` is set (scenario test reaching it with the flag unset: `zin_world_reach_ending` calls `zin_afrit_reveal` first).
9. Without any ending, `zin_ending_unfinished` is set on 1 Deepwinter 4A 1770 (scenario run under FREE with `zin_eindil_lost` set and Volgan and Afrit removed by console in 4A 1756).
10. Every modifier, trigger and effect named here exists in the 1.19.3 documentation (builder check).
11. The monthly tick's effect calls, in this order, `zin_path_tick`, `zin_story_tick` and, inside an `is_ai = no` country loop, `zin_ui_refresh` and `zin_chr_count_unread`; `events/zin_world.txt` defines no id from 100 to 119; no `zin_world` script compares a raw date outside the generated `zin_world_date_*` triggers (builder test).
12. At the slow story pace (`zin_story_pace` 1.5), `zin_war_of_last_crowns` under HISTORICAL and the proposed-outcome judgement fall on the shifted dates (scenario test with the pace rule set).

## Open questions

All proceed on the labelled proposal; the owner's answers go to [OPEN_QUESTIONS.md](../OPEN_QUESTIONS.md).

1. Are "the Gathering Dark" and the four tier names right for players? **Proposal, in use:** as above.
2. Should there be a Zol ending (the dead hold the living lands)? **Proposal, in use:** none, because the vault leaves his intentions open (world systems question 9).
3. Should the Lost Cause ending also require that Eindil's Aenor holds no subjects outside the Middle Lands ("refuses imperial domination")? **Proposal, in use:** no; the coronation is enough (world systems question 10).
4. Should more than one ending be possible in a long sandbox? **Proposal, in use:** no; exactly one ending per game.

Settled: the meter starts at 10 (V1); the interface spec's "8" is corrected there.
