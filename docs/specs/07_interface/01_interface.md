# Interface

**Status:** Ready. Reviewed 19 October 2026 against CONVENTIONS "Status"; integrated 19 October 2026. **Priority:** 5. **Phase:** 7 (the Realm panel and the Erdae bar's skeleton may land in phase 3 with the mechanics they show).

## Purpose

ZIN's mechanics only work if players can read them. This spec defines every ZIN window: the Erdae bar under the flag (age, the Gathering Dark and the viewing country's own meters), the existing Realm panel, the mechanic panels (Aenor's court and succession, the Hidden Council, the Southern Dominion and Mirolon's watch, Zol's Mistake, Lerendor's strait, Eindil's journey), the footholds map mode and the themed frames. It also says how each window is built and checked offline with the HOI4 Agent Tools GUI inspector and renderer before the Linux run.

The interface shows; it does not decide. Every number and band comes from the mechanics specs. Every action stays a decision, focus or event owned by its mechanic. A panel button only opens, closes, switches tabs, pages or selects a row.

Re-texturing vanilla windows belongs to [02_full_ui_reskin.md](02_full_ui_reskin.md). The frontend belongs to [03_main_menu_and_frontend.md](03_main_menu_and_frontend.md). The Chronicle of Erdae belongs to [04_chronicle_codex.md](04_chronicle_codex.md). Loading screens belong to [02_loading_screens_and_quotes.md](../08_art_and_assets/02_loading_screens_and_quotes.md).

## Current state (19 October 2026, commit ca01fa3)

| Item | In game | Writer |
| --- | --- | --- |
| Realm button `zin_realm_toggle` in window `zin_realm_button_window` (132 × 30 at x 8, y 86, `upper_left`, main window, no parent token) | yes | `tools/content/modules/ui.mjs` |
| Realm panel `zin_realm_window` (600 × 460, centred, moveable, frame `GFX_zin_frame`): title, people emblem (`GFX_zin_people_strip`, frame variable `zin_people_frame`), people line and description, alignment, stance and description, footer | yes | same |
| Scripted GUIs `zin_realm_button` and `zin_realm` (`common/scripted_guis/zin_realm.txt`, `player_context`), flag `zin_realm_open` | yes | same |
| Sprites `GFX_zin_frame`, `GFX_zin_button` (3 frames), `GFX_zin_rule`, `GFX_zin_people_strip` in `interface/zin_ui.gfx`; art from the accepted generations `ui-frame`, `ui-button`, `ui-rule` and `emblems-peoples` | yes | `modules/ui.mjs`, `modules/art.mjs` |
| Erdae bar, mechanic panels, footholds map mode, themes, gauges | no | this spec |

## Lore basis

| Fact | Status | Source |
| --- | --- | --- |
| Start on 1 Thaw 4A 1748: the Golden King reigns, Eindil has not appeared, Afrit is unrevealed, Erdae seems at peace | owner-fixed | *The Campaign of 4A 1748* |
| Ordinary people do not know the name Afrit; they revere the Deliverer | established | *Fourth Age Canon Register* |
| The Deliverer's public name **Aurevan** | proposed | *Aurevan the Deliverer* |
| Month names (Deepwinter … Longnight) and the 4A year count | proposed | *Fourth Age Chronology* |
| Zol has no body at the start and cannot manifest; nothing may name, rank or show his servants | established; rule from [zols_mistake.md](../04_mechanics/zols_mistake.md) | *Zol*, *Zol's Mistake* |
| Eindil does not know his name until Lorien gives it ("the Man from the Ice" before); courts learn the name only in stage 8 | established event; label decided (D4); stage rule from [eindil_journey.md](../04_mechanics/eindil_journey.md) | *The Journey of Eindil* |
| The meters sit in a new Erdae bar under the flag; only Aenor sees the Golden Court's gold | decided | [INTEGRATION_DECISIONS.md](../INTEGRATION_DECISIONS.md) S7 |
| The Gathering Dark starts at 10 | decided | V1 |
| Every window, label, colour, layout, meter name not already in a mechanics spec | **proposed** | this spec |

Text in windows follows the contract's secret rule ([00_shared_contract.md](../04_mechanics/00_shared_contract.md), "The secret"): before `zin_afrit_revealed`, no window a non-hub player can open names Afrit, calls the Deliverer a demon or describes the Council, the plot or the artifacts. Open vault questions stay open in every label and tooltip (Zol's keeper, Volgan's spirit, Dardan, Gala and the Sunhot elves, Ein's sons' birth order).

## Design

### 1. Principles

1. **Own meters only.** A player sees the meters of the country it plays. Other countries' hidden numbers never appear, except where a mechanic spec explicitly shares a band (Mirolon sees Volgan's veil band; everyone sees the Gathering Dark). Only Aenor sees the Golden Court's gold (S7).
2. **Nothing at the start spoils the story.** On 1 Thaw 4A 1748 no window shows Eindil, names Afrit, shows a war meter as "at war", or shows a later-state picture. Elements tied to story flags are hidden until the flag is set, not greyed out.
3. **Panels never run domain logic.** Click effects only set or clear `zin_ui_*` flags and variables and call `zin_ui_close_panels`, `zin_ui_open_panel`, `zin_ui_refresh` or the Chronicle's `zin_chr_open`. Decisions remain the only way to act.
4. **One window at a time.** Opening a mechanic panel, the Realm panel or the Chronicle closes the others. Escape closes the open one.
5. **Readable at 1280×720.** Every window fits inside 1280×720 at UI scale 1 below the top bar, and stays legible at 1920×1080 and 2560×1440 and at UI scale 1.25.
6. **Vanilla fonts only.** `hoi_16mbs`, `hoi_18mbs`, `hoi_20bs`, `hoi_24header`, `hoi_36header` (all in the installed `gfx/fonts/`). Text is Windows-1252.
7. **No vanilla layout overrides.** ZIN adds its own windows through scripted GUIs. This spec overrides no vanilla `.gui` file; in particular it never overrides `interface/topbar.gui` (window `topbar`). It uses two vanilla definitions by name: the scripted-GUI token `top_bar` and the sprite `GFX_closebutton` (`interface/general_stuff.gfx`). Vanilla text is re-themed only through localisation: `WORLD_TENSION_NAME` (here) and the month keys (calendar spec).

### 2. The Erdae bar (Fourth Age top bar)

A horizontal strip under the country flag, below the vanilla top bar background, where the Realm button sits today.

| Item | Value (target) |
| --- | --- |
| Window | `zin_erdae_bar_window`, scripted GUI `zin_erdae_bar` |
| Attachment | `parent_window_token = top_bar` (documented in the installed `common/scripted_guis/_documentation.md`), so full-screen views hide it with the top bar. If the Linux run shows it misplaced, it attaches to the main window like today's Realm button; the overlay check (Implementation, step 5) decides |
| Position | `orientation = upper_left`, x = 8, y = 86 (the Realm button's current place) |
| Size | 600 × 32 at most; the right end never passes x = 608 |
| Visible | always (`player_context`) |
| Frame | `GFX_zin_bar_frame` (thin nine-slice, neutral theme) |

Slots, left to right:

| Slot | Width | Shows | Tooltip |
| --- | ---: | --- | --- |
| Realm button | 132 | The existing `zin_realm_toggle` ("Realm"), moved into the bar | Opens the Realm panel |
| Age button | 96 | Button `zin_chr_age_button` (sprite `GFX_zin_chr_age_button`, [04_chronicle_codex.md](04_chronicle_codex.md) §9) with the text "4A [GetYear]" in `hoi_18mbs`, gold; the Chronicle's unread marker `GFX_zin_chr_new` at its top right | "The Fourth Age of Erdae. Years are counted from the first restored king." and "Open the Chronicle of Erdae." Clicking it calls `zin_chr_open` |
| Gathering Dark | 104 | Icon `GFX_zin_gathering_dark` (frame = tier, 4 frames) and the value, "10" at the start | Tier name, value, last month's change (`zin_gd_last_change`), active sources by label ([05_world_tension_and_endings.md](../03_gameplay/05_world_tension_and_endings.md)). Before `zin_afrit_revealed` the council source reads "a hidden cause" |
| Meter 1–3 | 88 each | Country meters from the table below: small icon, short value or band word | Meter name, value, band, what the band does, the mechanic spec's own wording |
| Panel button | 28 | Small sigil button `zin_erdae_bar_panel` (sprite `GFX_zin_bar_sigil_<panel>`) that opens the country's mechanic panel | Panel name (public name for the hub, section 6) |

The vanilla date stays where it is. Month names, including the short month keys `Jan` … `Dec`, come from [01_start_and_calendar.md](../00_foundation/01_start_and_calendar.md); the age button carries "4A" because the calendar spec leaves the engine's date format unchanged (its open question 1).

When the bar lands, `zin_realm_button_window` and the Chronicle's interim `zin_chr_button_window` are removed in the same build.

The native world tension widget (top right of `topbar`) keeps working because engine tension follows the Gathering Dark (world tension spec). Its name key `WORLD_TENSION_NAME` is relabelled "The Gathering Dark". The Erdae bar's readout is the exact meter with ZIN's tooltip.

#### Country meters

The bar shows at most three meters. A country matching no row shows only the Realm button, the age button and the Gathering Dark. Rows are checked top to bottom; the first match wins.

| Who (scripted trigger) | Meter 1 | Meter 2 | Meter 3 | Panel |
| --- | --- | --- | --- | --- |
| Aenor realm (`zin_aenor_is_realm`) before `zin_golden_king_dead` | **The Golden Court** (`zin_court_corruption`, value) | **Temple Favour** / **The Hidden Hand** (`zin_council_influence`, value; label switches on country flag `zin_aenor_hidden_hand_seen`) | **The Concord** (`zin_aenor_concord_avg`, band word) | Court |
| Aenor realm after `zin_golden_king_dead` | Ruling camp (word, from `zin_aenor_camp_*`) | Temple Favour / The Hidden Hand | The Concord | Court |
| Worshipdom (`zin_afrit_is_hub`) | **The Veil** (`zin_afrit_veil`) until `zin_afrit_revealed`, then **The Faithful** (count of countries at footholds 5) | **The Plot** (`zin_afrit_regicide_plot`) until `zin_golden_king_dead`, then **Artifacts** (`zin_afrit_artifacts` of 4) | **Houses** (countries with footholds ≥ 2) | Hidden Council |
| Volgan (`zin_is_volgan`) | **Hosts** (`zin_dominion_strength`) | **Veil of Storms** (`zin_volgan_veil`) | **Nether Pact** (`zin_nether_pact`) | Southern Dominion |
| Mirolon (`zin_is_mirolon`) | **Proof** (`zin_mirolon_proof`) | **Passes** (`zin_mirolon_passes`) | **The South** (band word from `global.zin_volgan_veil_band`) | Watch |
| Zol (`zin_is_zol`) | **The Presence** (band word from `zin_mistake_power`; value in tooltip) | **Service** (sum of the three bonds, of 15) | **Isles** (`zin_zol_islands_stirring`) until `zin_zol_rising`, then **Convergence** (`zin_zol_convergence`) | Mistake |
| Lerendor (`zin_is_lerendor`) | **The Strait** (`zin_strait_standing`, signed) | **Dues** (`zin_leren_toll_level` name) | **Hegemony** (`zin_leren_hegemony`) | Strait |
| Current host of Eindil (`zin_eindil_is_host`) | **The Stranger** / **Eindil** (stage name; label switches on `zin_eindil_named`, because the host knows the name) | **Renown** (`zin_eindil_renown`) | **Glo** (`zin_glo_power`) once `zin_glo_with_eindil` | Journey |
| Goldoroth (`zin_ui_has_horde_panel`) | **Temper** (`zin_goldoroth_temper`) | **Unity** (`zin_goldoroth_unity`) | **The Border** (band word from `zin_dark_tension_band_*`; `global.zin_dark_border_tension` in the tooltip) | Horde |
| Leader of the Dark Sea Accord (`zin_ui_has_accord_panel`) | **Resolve** (`global.zin_dark_accord_resolve`) | **The Border** (band word, as above) | **Members** (count of `zin_dark_is_accord_member` countries) | Accord |
| Dark Lands hold (`zin_dark_is_hold`) | **Sway** (band word of its own `zin_goldoroth_sway`; never the number) | — | — | Realm |
| Gala Elves (`zin_sun_is_gala`; *proposed*, an optional row emitted once the Lands of the Sun mechanic is built) | **Counsel** (`zin_gala_counsel`) | **Clarity** (`global.zin_mirror_clarity`) | **Old Lords** (`zin_gala_old_lords` of 5) | Realm |
| Concord dominion (subject of the Aenor realm with `zin_concord_loyalty`) | **Loyalty** (band word; exact only for the dominion itself) | **Charter** (charter name) | — | Realm |
| North Lands crown (`zin_leren_is_north_crown`) | **Leaning** (`zin_leren_lean` as "Sonargur"/"Parim"/"Neither") | — | — | Realm |

Bands use the mechanics specs' names: corruption (Gilded Rot ≥ 80, Honest Court ≤ 30), council (Council dominant ≥ 70; shown to Aenor only as "The temples hold the offices"), loyalty (Steadfast, Loyal, Restless, Defiant), veil (Hidden, Rumoured, Suspected, Seen), Presence (Faint, Stirring, Waking, Gathered), standing (Trusted, Strained, Broken Faith), Dark Lands border tension (Quiet, Uneasy, Bloody, Brink), sway (Free 0–24, Courted 25–49, Pressed 50–79, Under the Yoke for a tributary).

Colour of a meter value: neutral gold (`§Y`) in the safe band, amber (`§O`) in a warning band, red (`§R`) in a crisis band, as each mechanic defines them. No colour implies "good" or "evil" for a camp.

### 3. The Realm panel (existing, extended)

Today: `zin_realm_window`, 600 × 460 (see Current state). It opens from `zin_realm_toggle` and closes on Escape.

Target (same window, grown to 620 × 540; positions are targets):

| Block | y | Content |
| --- | ---: | --- |
| Title | 22 | "The Realm of [ROOT.GetName]" (existing key `ZIN_REALM_TITLE`) |
| People | 70 | Unchanged: emblem strip, people name, description |
| Alignment and stance | 190 | Unchanged |
| Standing | 300 | Up to three context lines, first matches of: Concord charter and loyalty band (dominions); "Leaning toward Sonargur/Parim" (North Lands crowns); "Rumours of [the stranger's name]: [stage name], renown [value]" once `zin_eindil_awake` (everyone; the tooltip shows Eindil's regard toward this country); "A House of the First Light serves here" when the country's `zin_footholds` ≥ 1 (public face only, never the level) |
| Mechanic | 420 | A button `zin_realm_panel_button` with the country's panel name, shown only when a mechanic panel exists for it ("The Golden Court", "The Hermitage", "The Southern Dominion", "The Watch on the Passes", "The Horde of Cocanoor", "The Dark Sea Accord", "The Presence", "The Narrow Strait", "The Road of the Stranger") |
| Chronicle | 420 | Button `zin_realm_chronicle_button` "The Chronicle of Erdae" (calls `zin_chr_open`), right of the mechanic button |
| Footer | 480 | The age and the Gathering Dark tier in one line |

Nothing in the Realm panel shows Eindil at stage 0. The stranger's name in the standing line comes from the scripted localisation `zin_ui_stranger_name`: "the Man from the Ice" unless `zin_chr_heir_known` holds (the Chronicle's trigger: `zin_eindil_named` and stage 8 or later, or the viewer is the host), then "Eindil".

### 4. Mechanic panels: shared layout

Every mechanic panel is one window, 620 × 540 (target), centred, moveable, with a themed nine-slice frame, a 600 × 96 header illustration, a title, up to four tabs, and a close button (`GFX_closebutton`, `shortcut = "ESCAPE"`).

| Element | Sprite (section 12) | Note |
| --- | --- | --- |
| Frame | `GFX_zin_frame_<theme>` | nine-slice, border 32 |
| Header art | `GFX_zin_header_<panel>` | image-generated, 600 × 96 |
| Tabs | `GFX_zin_tab` (3 frames: normal, hover, selected) | tab state in country variable `zin_ui_tab` |
| Gauge | `GFX_zin_gauge_<theme>` (21 frames, 0 to 100 in steps of 5) | frame from `zin_ui_<meter>_frame` |
| Signed gauge | `GFX_zin_gauge_signed` (21 frames, −100 to 100 in steps of 10) | Lerendor standing, Eindil's regard |
| Threshold mark | `GFX_zin_gauge_mark` | placed at band edges |
| Pips | `GFX_zin_pips` (6 frames, 0 to 5) | seats, bonds, pact levels |
| Row background | `GFX_zin_row` (2 frames: normal, selected) | lists |
| Small icons | idea-size catalog icons (`GFX_idea_zin_<key>`) | charters, artifacts, camps |

Gauges are frame strips driven by integer mirror variables (`zin_ui_*_frame`) that `zin_ui_refresh` computes. A gauge's exact value always appears beside it as text (`[?var|0]`).

Lists (dominions, Dark Lands pacts, North Lands crowns, top footholds) use **fixed rows**: 13 row slots per page, each with a `<row>_visible` trigger, filled by `zin_ui_refresh` into the country variables `zin_ui_row_1` … `zin_ui_row_13` from the array or country list the mechanic already keeps, with page buttons (`zin_ui_page`). This is the Chronicle's method; `dynamic_lists` are not used (proposed: fixed rows are simpler to test with the renderer and need no gridbox).

Each panel's scripted GUI uses `dirty = zin_ui_tick` (global, documented in the installed scripted GUI documentation). `zin_ui_tick` rises by 1 on every `zin_ui_refresh` call: the monthly world tick, every mechanic's scripted effect that changes a displayed variable, and every panel open, tab or page click.

### 5. The Golden Court panel (Aenor)

| Item | Value |
| --- | --- |
| Window, scripted GUI | `zin_court_window`, `zin_court` |
| Visible | `zin_ui_has_court_panel` and country flag `zin_ui_court_open` |
| Theme | `gold` |
| Title | "The Golden Court" |

Tabs:

1. **The Court.** Gauge *The Golden Court* (`zin_court_corruption`) with marks at 30 and 80 and the band name (Honest Court / — / Gilded Rot). Gauge *Temple Favour* or *The Hidden Hand* (`zin_council_influence`) with marks at 15, 35 and 70; the caption reads "how many offices are held by friends of the temples". No label names the Council or Afrit before `zin_afrit_revealed`. Line *The Lost Cause*: strength `zin_aenor_lost_cause` and its path (Ornament; The Shield of the Concord with `zin_lost_cause_shield`; Eindil's army with `zin_lost_cause_with_eindil`). The death clock never appears. With the country flag `zin_aenor_royal_physicians` a line "The King's health: [sound/tired/failing]" appears, read from `zin_aenor_king_health` (0–2, set by zin_aenor.240).
2. **The Concord.** One row per dominion (26 at the start, two pages): flag, name, charter icon (`charter_old`, `charter_golden`, `charter_shield`, `charter_free`, `charter_wall`), loyalty band word. With the Aenor focus flag `zin_aenor_envoys` the exact loyalty replaces the band. Seceded dominions show "Free Dominion" in grey. Selecting a row (`zin_ui_selected`) shows the charter's effects and the "Reissue the Charter" decision's state as text ("Available in [days] days"). The tab footer shows the Concord average and the count per band.
3. **The Empty Throne.** Hidden until `zin_golden_king_dead`. Four bars for `zin_aenor_camp_court`, `_faithful`, `_dominions`, `_host` (the Host bar only when `zin_aenor_host_available`), with the rising threshold mark at 30 and the rival mark at 50. Ruling camp highlighted. During the Thirty Days a countdown line. Camp names use the pre- and post-reveal party names (Aenor spec): "The Deliverer's Faithful" until `zin_afrit_revealed`.
4. **The Crown.** Hidden until `zin_eindil_returned`. The three conditions of `zin_aenor_eindil_can_be_crowned` as a checklist with ticks, and the 30-day hold counter.

Breakaway Aenor realms see the same panel (`zin_aenor_is_realm` tests the original tag).

### 6. The Hidden Council panel (Worshipdom only)

| Item | Value |
| --- | --- |
| Window, scripted GUI | `zin_council_window`, `zin_council` |
| Visible | `zin_ui_has_council_panel` (`zin_afrit_is_hub`, not `zin_afrit_dead`) and country flag `zin_ui_council_open` |
| Theme | `hermitage` (ivory and ash, a thin gold line) |
| Title | "The Hidden Council" (hub-private; this window never opens for another country) |

The panel's open button exists only for the hub, in the Erdae bar and the Realm panel. Its label and tooltip are the public face, "The Hermitage", so a spectator never reads the true name on the main screen.

Tabs:

1. **The Veil.** Gauge `zin_afrit_veil` with marks at 30 (the Veil Thins) and 0 (the reveal). Text: last month's change from `zin_afrit_veil_last_change`. Gauge `zin_afrit_regicide_plot` with a mark at 100, shown until `zin_golden_king_dead`. After `zin_afrit_revealed` the veil gauge is replaced by "The name is known" and the date.
2. **The Four Seats.** Four rows: seat name (true name and public chapter name), holder portrait (`zin_merovan`, `zin_ilvane`, `zin_corvel`, `zin_sevrin` once hired; an empty seal otherwise), level pips 0–5, and the per-level effect line from the Afrit spec.
3. **The Relics.** Four slots: Necklace of the Abyss, Ring of Doors, Crown of Witnesses, Bracelet of the First Seal (catalog icons `necklace_deep`, `ring_doors`, `crown_witnesses`, `bracelet_seal`). Each shows held, attuned (gold edge) or lost (dark, struck; flags `zin_afrit_lost_necklace`, `_ring`, `_crown`, `_bracelet`). Text: the current graces of `zin_afrit_graces` and the realm they apply to. Glo never passes to Afrit (O3), so the tab has no Glo slot.
4. **The Houses.** Counts of countries at footholds 1–5; the ten deepest countries (flag, name, level pips, `zin_afrit_suspicious` marked); a line telling the player to open the "Houses of the First Light" map mode (section 11), with a button that refreshes it.

### 7. The Southern Dominion panel (Volgan) and the Watch panel (Mirolon)

**Southern Dominion** (`zin_dominion_window`, `zin_panel_dominion`; visible for `zin_ui_has_dominion_panel` with `zin_ui_dominion_open`; theme `storm`):

| Block | Content |
| --- | --- |
| Hosts | Gauge `zin_dominion_strength`, marks at 30, 50, 70, 85; trigger names as captions (Stirring, Ready, Great Host) |
| Veil of Storms | Gauge `zin_volgan_veil`, marks at 30, 50, 70; band word (Hidden, Rumoured, Suspected, Seen) |
| The Nether | Gauge `zin_nether_pact`, mark at 40 |
| The Sworn | Three rows: Demon, Dolon, Nezer with `zin_dominion_oath` and a warning colour below 45 |
| The Dark Lands | Rows of every Dark Lands country with `zin_volgan_pact` ≥ 1: flag, name, pact pips 0–3 |
| Musters | `zin_volgan_musters` and whether `zin_volgan_mustered` blocks veil recovery this month |

After `zin_volgan_body_destroyed` the header art switches to the broken-host variant (`GFX_zin_header_dominion_broken`) and the Hosts gauge shows the cap of 40. The text never says what became of Volgan's spirit; under `zin_rule_volgan_spirit = UNRESOLVED` it reads "What remains of the Lord of the Dead Lands is not known."

**The Watch on the Passes** (`zin_watch_window`, `zin_watch`; visible for `zin_ui_has_watch_panel` with `zin_ui_watch_open`; theme `stone`): gauge `zin_mirolon_proof` (marks 25, 50, 75), gauge `zin_mirolon_passes` (marks every 20, with the current fort level), the band "The South: Hidden / Rumoured / Suspected / Seen" from the global mirror `zin_volgan_veil_band`, and the cooldowns of the three scouting decisions as text. Mirolon never sees Volgan's numbers.

### 7a. The Horde panel (Goldoroth) and the Accord panel (Dark Sea Accord)

Both show the Dark Lands mechanic ([dark_lands.md](../04_mechanics/dark_lands.md), "Interface"). Every value comes from that spec's variables; the panels change nothing.

**The Horde of Cocanoor** (`zin_horde_window`, `zin_horde`; visible for `zin_ui_has_horde_panel` with `zin_ui_horde_open`; theme `storm`):

| Block | Content |
| --- | --- |
| Temper | Gauge `zin_goldoroth_temper` with the mechanic's thresholds as marks |
| The four blocs | Four rows (the Volcano Clans, the Iron Clans, the War-Clans, the Goblin Warrens): favour gauges `zin_goldoroth_favour_volcano`, `_iron`, `_war`, `_warrens` with marks at 25 (sulk) and 75 (boon), and the heir's bloc marked when `zin_goldoroth_heir_<bloc>` is set |
| Unity | Gauge `zin_goldoroth_unity` (share of the Dark Lands states held) |
| Sway | Fixed rows (`zin_ui_row_1` … `_13`, pages) of every Dark Lands hold: flag, name, `zin_goldoroth_sway` as value and band, "tributary" for `zin_dark_is_tributary` |
| The Border | `global.zin_dark_border_tension` as value and band |

**The Dark Sea Accord** (`zin_accord_window`, `zin_accord`; visible for `zin_ui_has_accord_panel` with `zin_ui_accord_open`; theme `sea`):

| Block | Content |
| --- | --- |
| Resolve | Gauge `global.zin_dark_accord_resolve` with the mechanic's thresholds as marks |
| The Border | `global.zin_dark_border_tension` as value and band |
| Members | Fixed rows of every `zin_dark_is_accord_member` country: flag, name |

Other Dark Lands holds see only their own sway band, in the Erdae bar and the Realm panel's standing line ("Cocanoor's sway: Courted"). Neither panel shows Volgan's pacts, which stay in the Southern Dominion panel.

### 8. The Presence panel (Zol)

| Item | Value |
| --- | --- |
| Window, scripted GUI | `zin_mistake_window`, `zin_panel_mistake` |
| Visible | `zin_ui_has_mistake_panel` and `zin_ui_mistake_open` |
| Theme | `black` (black stone, no gold, a cold grey line) |
| Title | "The Presence" |

The realm should feel silent. Four blocks, no portraits, no figures:

1. **The Presence:** gauge `zin_mistake_power`, marks at 25, 50, 75 (and a small mark at 15 for the warning); band name. Tooltip: "How much of his presence can act in Erdae. Not his whole power, which no one has measured." With `zin_zol_presence_lapsed` the gauge greys and the text reads "Whether he returns is not for us to know. The servants keep faith."
2. **Those Who Serve:** three rows, Great Spirits, Lesser Spirits, New Gods, each with bond pips 0–5. No names, ranks or persons. Each row's icon is a sigil (`order_great`, `order_lesser`, `order_divine`).
3. **The Black Isles:** `zin_zol_islands_stirring` of the scripted island list, and the hosts alive against the cap (`zin_zol_hosts`).
4. **The Convergence:** hidden until `zin_zol_rising`; gauge `zin_zol_convergence` with a mark at 100 and the tooltip wording the Zol spec gives for this proposed source.

The seat line reads "Furviatlon, seat of the Mistake". No line names who keeps it.

### 9. The Narrow Strait panel (Lerendor)

| Item | Value |
| --- | --- |
| Window, scripted GUI | `zin_strait_window`, `zin_strait` |
| Visible | `zin_ui_has_strait_panel` and `zin_ui_strait_open` |
| Theme | `sea` |

Tabs:

1. **The Treaty.** Signed gauge `zin_strait_standing` (−100 to 100) with marks at −40 and 40; band name. Treaty state: in force, or "Withdrawn on [date]" with `zin_leren_withdrawal` (the gauge freezes). Route line once chosen: Honour the Treaty, The North Stands Apart, Mastery of the Strait.
2. **The Dues.** The five toll levels as a row of five plates (0 Free Passage … 4 The Iron Toll) with the current one lit and locked ones dark; current monthly standing drift as text.
3. **The North.** Gauge `zin_leren_union_cohesion` (mark at 25). Gauge `zin_leren_hegemony` (marks 20, 40, 60, 80 with the unlock names). The North Lands crowns as rows with a lean bar (−100 Parim to +100 Sonargur), Compact members marked.

### 10. The Road of the Stranger (Eindil's journey tracker)

Two forms:

- **The rumour line** (everyone): in the Realm panel from `zin_eindil_awake` (section 3).
- **The tracker panel** (`zin_journey_window`, `zin_journey`; theme `ice`): visible to the current host (`zin_eindil_is_host`) and, from `zin_eindil_crowned`, to the Aenor realm. Opened from the Erdae bar.

| Block | Content |
| --- | --- |
| Road | Twelve stage plates (`GFX_zin_stage_plate`) in a line. Reached stages show their name (journey spec stage names). The current stage is lit. Future stages are blank plates with no name: the tracker never reveals what comes. |
| Name | "The Man from the Ice" until `zin_eindil_named`, then "Eindil" (the host learns the name with him) |
| Measures | Renown gauge (`zin_eindil_renown`); this country's regard (`zin_eindil_regard`, signed gauge, marks at −25 and 25) with "friend" or "resentful"; delay as a word from `zin_eindil_delay` ("on time", "delayed", "long delayed" at 0, 1–179, 180+ days) |
| Glo | Hidden until `zin_glo_with_eindil`; gauge `zin_glo_power` with a mark at 30 (Glo's Wave) and the cap mark at 50 after `zin_horos_sword_broken` |
| Guest rules | Text reminder while he is a guest: an offensive war against anyone but Zol, Volgan or their subjects makes him leave |

At stage 0 nothing of this exists on screen. The panel's open button is hidden until the country is a host.

### 11. The footholds map mode

`zin_footholds_map_mode` is a scripted map mode in `common/map_modes/zin_footholds.txt`, inside `scripted_map_modes = { … }` (format of the installed `common/map_modes/documentation.md`): `top = { type = country color = { … } targets = { … } }`, `bottom = { type = none }`. The colour block runs with the player as scope and the coloured country as FROM, and sets the temp variables `red`, `green`, `blue`, `alpha` and, for pulsing, `highlighted`.

| Viewer | What it colours |
| --- | --- |
| The hub (`zin_afrit_is_hub` on the player) | Every country by `zin_footholds`: 0 none, 1 to 5 a ramp from pale ivory to deep gold; `zin_afrit_suspicious` countries pulse (`highlighted = 1`); countries whose footholds are capped at 0 dark grey |
| Everyone else | Countries where a House of the First Light serves (footholds ≥ 2) in one flat warm colour; nothing else. Name: "Houses of the First Light". It reveals no depth. |

Localisation keys follow the engine pattern for the map mode name: `MAPMODE_ZIN_FOOTHOLDS_MAP_MODE`, `MAPMODE_ZIN_FOOTHOLDS_MAP_MODE_NAME` ("Houses of the First Light"), `MAPMODE_ZIN_FOOTHOLDS_MAP_MODE_DESCRIPTION`, `zin_footholds_map_mode_tooltip`, `zin_footholds_map_mode_tooltip_delayed`. Button icons `GFX_mapmode_buttons_deselected_small_zin_footholds_map_mode` and `GFX_mapmode_buttons_selected_small_zin_footholds_map_mode` (20 × 18, image-generated) in `interface/zin_mapmodes.gfx`. The Houses tab's button calls `force_update_map_mode = { mapmode = zin_footholds_map_mode }` for the player, which rebuilds the colours; switching map modes stays the player's click in the map-mode bar.

### 12. Themed frames

Eight themes. Each is one generated theme sheet on a flat black ground (decision A2), sliced into a nine-slice frame, a gauge pair (empty and full), a tab strip and a row strip ([01_art_pipeline.md](../08_art_and_assets/01_art_pipeline.md) §4).

| Theme | Used by | Look (prompt core) |
| --- | --- | --- |
| `neutral` | Erdae bar, Realm panel | dark walnut and brass; the existing `GFX_zin_frame` stays as the neutral frame (alias `GFX_zin_frame_neutral` points at the same texture) |
| `gold` | Golden Court | gilded filigree on deep red lacquer |
| `hermitage` | Hidden Council | ivory parchment, ash-grey stone, one thin gold line, a veiled sun motif; no demon imagery |
| `storm` | Southern Dominion, the Horde of Cocanoor | basalt and bronze under a storm-grey wash |
| `stone` | Watch on the Passes | weathered sandstone and iron rivets |
| `black` | The Presence | black stone, cold grey line, no ornament |
| `sea` | Narrow Strait, the Dark Sea Accord | sea-green bronze, rope and wave border |
| `ice` | The Road of the Stranger | frost-white stone, pale blue line |

One themed frame per mechanic is the working proposal (OPEN_QUESTIONS, interface 6). The two Dark Lands panels reuse `storm` and `sea` with their own headers (`GFX_zin_header_horde`, `GFX_zin_header_accord`: a fire-lit moot hall and dark ships under a cliff fort, no faces), so the eight sheets stay eight.

### 13. Loading screens, bookmark and main menu

Moved. The 24 loading screens, the three main-menu backgrounds (decision A5) and the 180 × 104 bookmark picture are in the game today and are specified in [02_loading_screens_and_quotes.md](../08_art_and_assets/02_loading_screens_and_quotes.md) and [03_main_menu_and_frontend.md](03_main_menu_and_frontend.md). The nine subjects this section once listed are loading screens 1, 3, 9, 11, 12, 14, 20, 22 and 24 there.

## Implementation

### Builder modules and data

All files are generated by the ZIN content builder (`tools/content/build.mjs`) and written to the mod through `tools/content/apply.mts` (the shared atomic rewrite engine). Nothing is hand-edited.

| Module | State | Writes |
| --- | --- | --- |
| `tools/content/modules/ui.mjs` | existing; extended | The Realm panel (`interface/zin_realm.gui`, `common/scripted_guis/zin_realm.txt`, `common/scripted_localisation/zin_realm.txt`, `ZIN_REALM_*` keys in `localisation/english/zin_ui_l_english.yml`) and the shared sprites in `interface/zin_ui.gfx`. Gains the standing block, the mechanic and Chronicle buttons, and the 620 × 540 size |
| `tools/content/modules/ui_panels.mjs` | new | The Erdae bar, the nine mechanic panels, the map mode and their scripted effects, triggers and localisation (file table below); stages the theme, header, gauge, pip, tab, row, sigil, stage-plate and map-mode-button art from accepted sources, recording each output in `art/source/ui_manifest.json` (the format of `art/source/presentation_manifest.json`) |
| `tools/content/art/ui-jobs.mjs` | new | Writes the image jobs (`$ZIN_ART/jobs/ui-jobs.json`): 8 theme sheets, 10 headers, the sigil and icon sheet, run through `tools/content/imagegen.mjs` |
| `tools/content/data/interface.json` | new (builder data, like `data/loading_tips.json`) | Source of truth: windows, slots, meter rows, bands, colours, themes, element positions, tab lists, panel names, the scenario list |
| `tools/content/ui_panels.test.mjs` | new | Builder tests for this spec (Acceptance 1–7, 10, 11) |

### Files

| Path | Content | Module |
| --- | --- | --- |
| `common/scripted_guis/zin_realm.txt` | Existing; extended with the standing block and the buttons | `ui.mjs` |
| `common/scripted_guis/zin_erdae_bar.txt` | `zin_erdae_bar` | `ui_panels.mjs` |
| `common/scripted_guis/zin_panels.txt` | `zin_court`, `zin_council`, `zin_panel_dominion`, `zin_watch`, `zin_horde`, `zin_accord`, `zin_panel_mistake`, `zin_strait`, `zin_journey` | same |
| `interface/zin_realm.gui` | Existing; grown to 620 × 540 | `ui.mjs` |
| `interface/zin_erdae_bar.gui` | `zin_erdae_bar_window` | `ui_panels.mjs` |
| `interface/zin_panels.gui` | One `containerWindowType` per panel | same |
| `interface/zin_ui.gfx` | Existing sprites plus themes, gauges, pips, tabs, rows, headers, sigils, stage plates, `GFX_zin_gathering_dark` | `ui.mjs` (existing sprites), `ui_panels.mjs` (new sprites, same file assembled once) |
| `interface/zin_mapmodes.gfx` | Map-mode button sprites | `ui_panels.mjs` |
| `common/map_modes/zin_footholds.txt` | `zin_footholds_map_mode` | same |
| `common/scripted_effects/zin_ui.txt` | `zin_ui_refresh`, `zin_ui_close_panels`, `zin_ui_open_panel` | same |
| `common/scripted_triggers/zin_ui.txt` | Panel visibility triggers (below) | same |
| `common/scripted_localisation/zin_ui.txt` | Band words, meter labels, two-face labels, `zin_ui_stranger_name` | same |
| `gfx/interface/zin/` | Frames, gauges, headers, tabs, pips, sigils (DDS A8R8G8B8) | same |
| `localisation/english/zin_ui_l_english.yml` | All interface text (existing file, extended) | `ui.mjs`, `ui_panels.mjs` |
| `localisation/replace/zin_ui_replace_l_english.yml` | `WORLD_TENSION_NAME` ("The Gathering Dark") | `ui_panels.mjs` |

### Scripted GUIs

All use `context_type = player_context`, `dirty = zin_ui_tick` and `ai_enabled = { always = no }`.

| Scripted GUI | Window | `visible` |
| --- | --- | --- |
| `zin_erdae_bar` | `zin_erdae_bar_window` | `always = yes` |
| `zin_realm_button` | `zin_realm_button_window` | existing; removed when the bar lands (its button moves into the bar) |
| `zin_realm` | `zin_realm_window` | `has_country_flag = zin_realm_open` (existing) |
| `zin_court` | `zin_court_window` | `zin_ui_has_court_panel` and `has_country_flag = zin_ui_court_open` |
| `zin_council` | `zin_council_window` | `zin_ui_has_council_panel` and `zin_ui_council_open` |
| `zin_panel_dominion` | `zin_dominion_window` | `zin_ui_has_dominion_panel` and `zin_ui_dominion_open` |
| `zin_watch` | `zin_watch_window` | `zin_ui_has_watch_panel` and `zin_ui_watch_open` |
| `zin_horde` | `zin_horde_window` | `zin_ui_has_horde_panel` and `zin_ui_horde_open` |
| `zin_accord` | `zin_accord_window` | `zin_ui_has_accord_panel` and `zin_ui_accord_open` |
| `zin_panel_mistake` | `zin_mistake_window` | `zin_ui_has_mistake_panel` and `zin_ui_mistake_open` |
| `zin_strait` | `zin_strait_window` | `zin_ui_has_strait_panel` and `zin_ui_strait_open` |
| `zin_journey` | `zin_journey_window` | `zin_ui_has_journey_panel` and `zin_ui_journey_open` |

Click effects (all panels): `<panel>_close_click` clears the panel flag; `<panel>_tab_<n>_click` sets `zin_ui_tab` to n and calls `zin_ui_refresh`; `<panel>_row_<n>_click` sets `zin_ui_selected`; `<panel>_page_next_click`/`_prev_click` change `zin_ui_page` and call `zin_ui_refresh`. The Erdae bar's panel button calls `zin_ui_open_panel` with the panel's key; its age button calls `zin_chr_open`. Every `<element>_click_enabled` is `always = yes`. The AI never clicks interface buttons.

### Scripted triggers (`common/scripted_triggers/zin_ui.txt`)

| Trigger | True when |
| --- | --- |
| `zin_ui_has_court_panel` | `zin_aenor_is_realm` |
| `zin_ui_has_council_panel` | `zin_afrit_is_hub` and not `zin_afrit_dead` |
| `zin_ui_has_dominion_panel` | `zin_is_volgan` |
| `zin_ui_has_watch_panel` | `zin_is_mirolon` |
| `zin_ui_has_horde_panel` | `original_tag` is Goldoroth's tag (resolved from the name at build time) |
| `zin_ui_has_accord_panel` | `zin_dark_is_accord_member` and `is_faction_leader = yes` |
| `zin_ui_has_mistake_panel` | `zin_is_zol` |
| `zin_ui_has_strait_panel` | `zin_is_lerendor` |
| `zin_ui_has_journey_panel` | `zin_eindil_is_host`, or `zin_aenor_is_realm` with `zin_eindil_crowned` |
| `zin_ui_has_any_panel` | any of the above |

The country triggers they wrap (`zin_aenor_is_realm`, `zin_afrit_is_hub`, `zin_is_volgan`, `zin_is_mirolon`, `zin_is_zol`, `zin_is_lerendor`, `zin_eindil_is_host`, `zin_leren_is_north_crown`, `zin_dark_is_accord_member`, `zin_dark_is_hold`, `zin_dark_tension_band_*`, `zin_sun_is_gala`) are owned by the mechanic specs and listed in the contract additions register. Until a mechanic is built, `ui_panels.mjs` does not emit its panel, its meter row or its trigger reference, so no undefined trigger is ever loaded.

### Scripted effects (`common/scripted_effects/zin_ui.txt`)

| Effect | Does |
| --- | --- |
| `zin_ui_refresh` | Adds 1 to `global.zin_ui_tick`; recomputes every `zin_ui_*_frame` mirror for ROOT (gauge frame = value ÷ 5 rounded down, signed gauge = (value + 100) ÷ 10); fills `zin_ui_row_1` … `_13` for the open list; recomputes `zin_aenor_concord_avg` on the Aenor realm. Pure formatting: it never changes a mechanic variable |
| `zin_ui_close_panels` | Clears `zin_realm_open`, every `zin_ui_<panel>_open` flag and the Chronicle's `zin_chr_open` on ROOT |
| `zin_ui_open_panel` (`panel`) | `zin_ui_close_panels`, then sets `zin_ui_<panel>_open`, sets `zin_ui_tab` to 1, `zin_ui_page` to 0, calls `zin_ui_refresh` |

The world tick ([05_world_tension_and_endings.md](../03_gameplay/05_world_tension_and_endings.md), monthly order) calls `zin_ui_refresh` once a month in the scope of every human player (`every_country = { limit = { is_ai = no } }`). Each mechanic's `refresh` or `add_*` effect for a displayed variable also calls it.

### Variables and flags (UI state only)

| Name | Kind | Scope | Meaning |
| --- | --- | --- | --- |
| `zin_ui_tick` | variable | global | Dirty counter for every ZIN scripted GUI |
| `zin_ui_tab`, `zin_ui_page`, `zin_ui_selected` | variable | country | Panel state of that player |
| `zin_ui_row_1` … `zin_ui_row_13` | variable | country | Country or entry shown in each list row (proposed; registered in the contract additions as `zin_ui_row_<n>`) |
| `zin_ui_<meter>_frame` | variable | country | Gauge frames (generated list, one per displayed meter) |
| `zin_ui_court_open`, `zin_ui_council_open`, `zin_ui_dominion_open`, `zin_ui_watch_open`, `zin_ui_horde_open`, `zin_ui_accord_open`, `zin_ui_mistake_open`, `zin_ui_strait_open`, `zin_ui_journey_open` | country flag | country | Panel open |
| `zin_realm_open` | country flag | country | Existing; kept |
| `zin_aenor_concord_avg` | variable | Aenor realm | Average `zin_concord_loyalty` of current dominions (also the input the Aenor spec's Dominions camp formula needs) |
| `zin_volgan_veil_band` | variable | global | 0 Hidden, 1 Rumoured, 2 Suspected, 3 Seen; set by the Volgan spec's veil refresh, so Mirolon's panel can show the band without reading Volgan |
| `zin_aenor_king_health` | variable | Aenor | 0 sound, 1 tired, 2 failing; set by the omen event zin_aenor.240 |
| `zin_afrit_veil_last_change` | variable | global | Veil change over the last month; set by the Afrit monthly pulse |

### Sprites (`interface/zin_ui.gfx`)

| Sprite | Type | Size (frame) | Frames |
| --- | --- | --- | ---: |
| `GFX_zin_frame` (existing; neutral) and `GFX_zin_frame_<theme>` (7 more) | `corneredTileSpriteType`, `borderSize` 32 | 128 × 128 | 1 |
| `GFX_zin_bar_frame` | `corneredTileSpriteType`, `borderSize` 12 | 64 × 32 | 1 |
| `GFX_zin_header_<panel>` (9 + `dominion_broken`) | `spriteType` | 600 × 96 | 1 |
| `GFX_zin_gauge_<theme>` (8) | `spriteType` | 240 × 16 | 21 |
| `GFX_zin_gauge_signed` | `spriteType` | 240 × 16 | 21 |
| `GFX_zin_gauge_mark` | `spriteType` | 4 × 20 | 1 |
| `GFX_zin_pips` | `spriteType` | 72 × 12 | 6 |
| `GFX_zin_tab` | `spriteType`, `effectFile = "gfx/FX/buttonstate.lua"` | 140 × 30 | 3 |
| `GFX_zin_row` | `spriteType` | 560 × 30 | 2 |
| `GFX_zin_button` | existing | 132 × 30 | 3 |
| `GFX_zin_bar_sigil_<panel>` (9) | `spriteType` | 24 × 24 | 3 |
| `GFX_zin_gathering_dark` | `spriteType` | 28 × 28 | 4 (tiers) |
| `GFX_zin_stage_plate` | `spriteType` | 40 × 40 | 3 (blank, reached, current) |

Gauge frames are assembled from a generated empty and a generated full gauge (art pipeline §4, gauge frames).

### Events, game rules and defines

No events, game rules or defines of its own. Panels never fire events. The interface reads `zin_rule_volgan_spirit` for one line of text.

### Build and check with HOI4 Agent Tools

Every window is checked offline before any Linux run.

1. **Inspect.** `hoi4.gui_inspect` with `windowName` for each window and a start scenario: no missing sprite, font or localisation key; no `GUI_UNRESOLVED_VISIBILITY_OVERLAP` in a scenario with `closedFlags: true` and the flags of one tab.
2. **Render.** `hoi4.gui_render` per window at 1280×720, 1600×900 (the Linux run's size), 1920×1080 and 2560×1440 at UI scale 1, and 1920×1080 at UI scale 1.25. States: `normal`, `hover`, `selected`, `minimum-value`, `maximum-value`, `long-text`, `missing-localisation`. `generatedScenarios` with `seed` fixed per window, `count` 4, `visibility: "varied"`.
3. **Scenarios** (each a file under `tools/content/tests/ui/`, generated from `data/interface.json` and run through `hoi4.scenario_test`):

| Scenario id | Window | Flags and variables |
| --- | --- | --- |
| `start_aenor` | Erdae bar, Realm, Court | date 1748.3.1; `zin_court_corruption` 70, `zin_council_influence` 65, `zin_aenor_concord_avg` 57, `zin_gathering_dark` 10; no story flags; `closedFlags: true` |
| `court_empty_throne` | Court tab 3 | `zin_golden_king_dead`; camps 39/68/30/0 |
| `court_revealed` | Court | `zin_afrit_revealed`, `zin_aenor_hidden_hand_seen` |
| `start_worshipdom` | Erdae bar, Council (four tabs) | veil 80, plot 20, seats 3/2/1/2, artifacts 4 |
| `council_unmasked` | Council | `zin_afrit_revealed`, `zin_afrit_lost_necklace` |
| `start_volgan`, `volgan_broken` | Dominion | strength 45, veil 85, pact 20; then `zin_volgan_body_destroyed` |
| `start_mirolon` | Watch | proof 15, passes 30, band 0 |
| `start_goldoroth` | Erdae bar, Horde | temper 55, unity 13, bloc favours 50, border tension 35, four holds with sway 10, 30, 55 and a tributary |
| `start_dondor` | Erdae bar, Accord | resolve 40, border tension 35, Belonton a member |
| `start_zol`, `zol_risen`, `zol_lapsed` | Presence | power 35, bonds 1/2/1; then `zin_zol_rising` with convergence 60; then `zin_zol_presence_lapsed` |
| `start_lerendor`, `lerendor_withdrawn` | Strait | standing −15, toll 1, cohesion 55; then `zin_leren_withdrawal` |
| `journey_stage1`, `journey_named_glo` | Journey | stage 1, renown 5; then stage 8, `zin_eindil_named`, `zin_glo_with_eindil`, Glo 100 |
| `start_minor` | Erdae bar, Realm | a tier C country of men, no mechanic |

4. **Expectations** in each scenario: `visible` lists the elements that must show; `hidden` lists every element tied to a story flag not set (for example in `start_aenor`: the Empty Throne tab, the Crown tab, the stranger line, any "Hidden Hand" label); `containedBy` keeps every element inside its window and every text inside its plate.
5. **Overlay collision.** The builder renders the vanilla `topbar` window (`interface/topbar.gui`) and `zin_erdae_bar_window` at each resolution and intersects the element boxes from both `layout.json` files. Any intersection fails the build.
6. **Secrecy.** The compiler's localisation scan covers `zin_ui_l_english.yml` and every scripted localisation branch reachable without `zin_afrit_revealed` from a window whose visibility does not require `zin_afrit_is_hub`.
7. **Review images.** The render PNGs of the start scenarios go into the phase report as offline renders, labelled as tool-generated, never as game screenshots.

## AI

The AI does not use the interface. `ai_enabled = { always = no }` on every ZIN scripted GUI. No mechanic may depend on a panel being opened.

## Acceptance

1. `hoi4.gui_inspect` reports no missing sprite, font or localisation for any ZIN window.
2. `hoi4.gui_render` of every scenario in the table passes its expectations at all five resolutions with no element outside its window and no text overflow in `long-text`.
3. The overlay collision check finds no intersection with the vanilla `topbar` window.
4. In `start_aenor`, `start_worshipdom` seen as a non-hub (Aenor) viewer, and `start_minor`, no visible text contains "Afrit", "demon" or "Hidden Council", and nothing about Eindil is visible.
5. The Council window is never visible in any scenario whose viewer is not the hub, including with `zin_ui_council_open` forced on.
6. No future stage name appears in the journey tracker in `journey_stage1`.
7. The Presence panel contains no portrait sprite and no servant name.
8. Linux run (G4, case L3 of [01_acceptance.md](../09_validation/01_acceptance.md)) on 1 Thaw 4A 1748 at 1600×900: the Erdae bar shows "4A 1748" and the Gathering Dark at 10; the Realm panel opens and closes; the age button opens the Chronicle; as Aenor, Volgan, Zol, Lerendor, Goldoroth, Dondor and the Worshipdom the country panel opens on every tab; nothing crashes; `error.log` has no line whose source is a ZIN interface file. (The date reading "1 Thaw" is the calendar spec's acceptance.)
9. Opening any panel closes the others and the Chronicle; Escape closes the open one (scenario test with two flags set, then one click).
10. `ui_panels.test.mjs` passes: every sprite named in a ZIN `.gui` exists in a ZIN `.gfx` or is `GFX_closebutton`; every DDS has its declared size and frame count; a second build is byte-identical.
11. Negative tests make the build fail: a planted "Afrit" in a non-hub label, a panel without a close button, a window wider than 1280 at UI scale 1, a meter row naming a trigger that no built mechanic defines.

## Open questions

All proceed on the proposal; none blocks the work.

1. Erdae bar placement and who sees the gold: settled by decision S7.
2. Should non-hub players get the "Houses of the First Light" map mode at all? Proposal: yes, flat colour only (OPEN_QUESTIONS, interface 3).
3. Are the panel names right? Proposal: as in section 3 (OPEN_QUESTIONS, interface 4).
4. Should the journey tracker also show to every friend of Eindil (regard ≥ 25)? Proposal: host only, plus the rumour line for everyone (OPEN_QUESTIONS, interface 5).
5. One themed frame per mechanic, or one Erdae frame everywhere? Proposal: one per mechanic (OPEN_QUESTIONS, interface 6).
