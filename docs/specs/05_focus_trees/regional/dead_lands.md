# Regional Trees: The Dead Lands

**Status:** Draft. **Priority:** 6. **Phase:** 6 (tier B).

## Purpose

This spec gives the five tier B countries of the Dead Lands their own focus trees: the three demon realms of Volgan's Southern Dominion, **Nezer**, **Demon** and **Dolon**, and the two free human realms **Olen** and **Nan** ([../01_tiers_and_coverage.md](../01_tiers_and_coverage.md)). Volgan ([../major/volgan.md](../major/volgan.md)) and Mirolon ([../major/mirolon.md](../major/mirolon.md)) have major trees; the six small freeholds share [../shared/shared_dead_lands.md](../shared/shared_dead_lands.md).

The trees play [Volgan and the Southern Dominion](../../04_mechanics/volgan_southern_dominion.md) from below:

- **The sworn realms** hold to Nafeher through `zin_dominion_oath`, feed Volgan's strength, deal with the Nether's court, march when Volgan marches, may seek their own road when the oath weakens, and answer the silence after Volgan's body breaks.
- **The free realms** live in Nafeher's shadow: they keep the old quiet with tribute, stand with Mirolon's wardens, or wall themselves in, and they watch the storms.

| Tree id | Country | Focuses | Grid | Events | Spirits |
| --- | --- | ---: | --- | --- | --- |
| `regional_nezer` | Nezer | 32 | x 0–18, y 0–8 | `zin_regional_nezer` | `zin_regional_nezer_<key>` |
| `regional_demon` | Demon | 30 | x 0–18, y 0–8 | `zin_regional_demon` | `zin_regional_demon_<key>` |
| `regional_dolon` | Dolon | 30 | x 0–14, y 0–8 | `zin_regional_dolon` | `zin_regional_dolon_<key>` |
| `regional_olen` | Olen | 32 | x 0–20, y 0–8 | `zin_regional_olen` | `zin_regional_olen_<key>` |
| `regional_nan` | Nan | 30 | x 0–20, y 0–8 | `zin_regional_nan` | `zin_regional_nan_<key>` |

## Lore basis

**Established** (vault): the Dead Lands lie south of the Middle Lands and are Volgan's principal dominion; they include Mirolon, Nan, Demon, Dolon, Nezer and the Nether (*Volgans Dead Lands*). They were hard to reach because of fierce storms at sea and oppressive heat farther south. Volgan's realm includes grave hosts, Netherborn demons, orcs, ogres, monster clans and necromantic orders; his authority does not extend automatically to independent factions. The Nether, in the south of the Dead Lands, is the seat of the King of Demons, whose name, powers and relation to Volgan are open; demons need not all serve Volgan. The Abyss lies in the Dead Lands and is tied to Roka and the Necklace of the Abyss; Roka's fate and his people's name are open; the Void, the Nether and the Abyss are distinct. Volgan retakes Mirolon and marches north in the Fourth Age; his manifested body is destroyed; whether his spirit survives is open. Seat Nafeher; the Southern Dominion of Demon, Dolon and Nezer; rival Mirolon (working table). The start: the Golden King reigns, Eindil has not appeared, Afrit is unrevealed, Erdae seems at peace.

**Proposed elsewhere and used here:** Volgan's strength returns and Demon, Dolon and Nezer swear to him about 4A 1650 (vault chronology); the Burning Gate of Nezer, a portal fought over in the Second Age (vault, *The Second Age of Erdae*, proposed episode); the rulers Hazarel the Horned, Morvath of the Dead Sea, Queen Nazara of Nezerun, Warlord Dumar of Vez Nan and Olena of the Holy Breeze ([../../02_lore/02_characters.md](../../02_lore/02_characters.md)); every mechanic of the Volgan spec (strength, the veil, oaths, the Nether pact, the Black Compact, the Steward, client crowns, Mirolon's proof and passes, the Warden League); the Abyss-folk as a descriptive name.

**Proposed here:** every focus, spirit, event, advisor and number; the Ember Coast of Nezer; Dolon's salt "Dead Sea"; Olen's Holy Breeze; Nan's storm pilots and the Stair; all character names below.

**Kept open (no text closes them):** what remains of Volgan after his body breaks; the King of Demons' name, rank and obligations; who owns the Nether; Roka's fate and his people's name; where Dardan lies; how Zol's dead relate to Volgan's. Texts call the Abyss's people "the Abyss-folk" and the thief only "a stranger from the north". No text names Afrit.

## Design

### Rules for every tree in this spec

- **Peaceful start.** Nothing available on 1 Thaw 4A 1748 declares war, creates a war goal or a claim. The sworn realms go to war only as Volgan's subjects when Volgan does (his war needs `zin_volgan_war_open`); their war branches need `at_war`. The free realms' war branches need `at_war`.
- **No Houses in the Dominion.** The demon realms' footholds cap is 0 (Afrit spec); no focus touches `zin_footholds` there.
- **Volgan's numbers stay hidden.** Sworn realms add to `zin_dominion_strength` and the Nether pact through Volgan's effects; their focus text never states the size of his hosts.
- **Volgan's fate is open.** After `zin_volgan_body_destroyed`, texts say only that "the throne in Nafeher does not answer" and "what remains, no one living can say".
- **Prerequisites.** A focus with no "←" in its entry has no prerequisite: every row-0 focus and every branch head in rows 6 and below. A branch head's gate is its `available` (and `allow_branch` where stated).
- **Days** 35 unless marked 70; war focuses may be 21. **AI** "hist" = `check zin_rules_is_historical`; "free" = `check zin_rules_is_free`.

### Notation

| Shorthand | Effect |
| --- | --- |
| oath ±n | `for_country Volgan: call zin_volgan_add_oath(target = ROOT, value = n)` |
| oath ≥ n | check `zin_regional_<tree>_oath_at_least` (arg `value`): ROOT's `zin_dominion_oath` ≥ n |
| strength ±n | `for_country Volgan: call zin_volgan_add_dominion_strength(value = n)` |
| nether pact ±n | `for_country Volgan: call zin_volgan_add_nether_pact(value = n)` |
| proof ±n | `for_country Mirolon: call zin_mirolon_add_proof(value = n)` |
| autonomy +r | `call zin_<tree>_gain_autonomy(value = r)` (`add_autonomy_ratio`) |
| own road | country flag `zin_dominion_own_road` (proposed: set by the "seek its own road" option of the Volgan spec's `zin_dominion.22`) |
| regard ±n | `call zin_eindil_add_regard(value = n)` |
| opinion X ±n (k) | `call zin_<tree>_opinion(who = X, modifier = k)` |

---

## Nezer

### Situation in 4A 1748

Nezer is the southern confederacy of the Dominion: two lands of one demon family, Nezer and Nezerun, on a coast of black glass and smoking vents that Nezer's demons call the Ember Coast (proposed). Queen Nazara of Nezerun rules both from a court of ember-lit halls. Nezer swore to Nafeher a century ago, when Volgan's strength returned; its oath is the weakest of the three, and its houses remember older things. In the Second Age a gate of fire was opened in one of its border strongholds and fought over by men, elves and dark soldiers together (vault, proposed episode); Nezer's demons still argue about who opened it, and do not say.

### Role

- **Historical path (proposed):** Nezer answers Volgan's summons, sends its war-bands, keeps its oath above 50 through the peace, and joins the war on Mirolon and the march north (4A 1755). When Volgan's body breaks (4A 1757) its oath falls by 30; on the historical path the queen then goes her own way (the Volgan spec's `zin_dominion.18`), as Nezer's oath ends the war below 40. That outcome is a proposal, not lore.
- **Alternatives:** a Nezer that keeps the gate sealed and seeks its own road early; a Nezer that opens the gate for Nafeher and stays with the Steward.

### Ruler and court (proposed)

| Id | Name | Role | Traits |
| --- | --- | --- | --- |
| `<Nezer>_zin_ruler` | Queen Nazara of Nezerun | Country leader, `zin_shadow_dread` | — |
| `zin_regional_nezer_vharos` | Vharos Ember-Tongue | Political advisor | `zin_adv_whisper_master` |
| `zin_regional_nezer_kezra` | Kezra of the Gate | Political advisor | `zin_adv_war_speaker` |
| `zin_regional_nezer_ummath` | Ummath the Tallykeeper | Political advisor | `zin_adv_treasurer` |
| `zin_regional_nezer_zarrek` | Zarrek of the War-Bands | Corps commander, skill 3 | `trait_reckless` |

### Tree `regional_nezer` (32 focuses)

**A. The Two Crowns of Nezer** (x 0–2, rows 0–4). Exclusive: *The Queen's Hand* / *The Houses Rule*.
- `two_crowns_of_nezer` The Two Crowns of Nezer (1,0; 70) `demon_horn`: political_power 50; event `two_crowns`. AI 40.
- `nazaras_court` Nazara's Court (0,1; ← crowns) `throne_gold`: political_power 25; stability 0.03. AI 20.
- `the_nezerun_houses` The Nezerun Houses (2,1; ← crowns) `council_table`: stability 0.05. AI 20.
- `one_family` One Family (1,2; ← court + houses) `handshake_oath`: add_spirit `one_family`. AI 15.
- `the_queens_hand` The Queen's Hand (0,3; ← family; excl houses_rule) `sceptre`: swap_spirit `one_family` → `queens_hand`. AI 15; hist ×2.
- `the_houses_rule` The Houses Rule (2,3; ← family; excl queens_hand) `council_table`: swap_spirit `one_family` → `houses_rule`. AI 10.
- `the_ember_coast` The Ember Coast (1,4; ← either; 70) `ember_desert`: political_power 75; stability 0.03. AI 15.

**B. Bound to Nafeher** (x 4–6, rows 0–2). The oath.
- `answer_the_summons` Answer the Summons (5,0) `banner_black`: oath +5; political_power 25. AI 30; hist ×2.
- `war_bands_for_the_dominion` War-Bands for the Dominion (4,1; ← summons) `demon_horn`: army_experience 10; strength +1. AI 20.
- `tribute_of_nezer` The Tribute of Nezer (6,1; ← summons) `tribute_chest`: oath +5; political_power −25. AI 15.
- `the_dominions_vanguard` The Dominion's Vanguard (5,2; ← both; 70) `war_drums`: Avail: oath ≥ 50. add_spirit `dominion_vanguard`; oath +10. AI 20.

**C. The Burning Gate** (x 8–10, rows 0–2). Exclusive: *Keep the Gate Sealed* / *Open the Gate for Nafeher*.
- `the_burning_gate_remembered` The Burning Gate Remembered (9,0) `nether_gate`: event `burning_gate`. AI 25.
- `wardens_of_the_gate` Wardens of the Gate (8,1; ← gate) `fort_wall`: building bunker 1 @capital. AI 15.
- `old_portal_lore` Old Portal Lore (10,1; ← gate) `nether_gate`: research [zin_cat_dark_rites] 50% ×1. AI 15.
- `keep_the_gate_sealed` Keep the Gate Sealed (8,2; ← wardens / lore; excl open) `fort_wall`: add_spirit `sealed_gate`; oath −5. AI 10; hist ×0.5.
- `open_the_gate_for_nafeher` Open the Gate for Nafeher (10,2; ← wardens / lore; excl sealed) `nether_gate`: nether pact +5; oath +5. AI 15; hist ×2.

**D. Our Own Road** (x 12–14, rows 0–2). Head `available`: variable `zin_dominion_oath` below 40, or flag own road.
- `the_oath_weighs_heavy` The Oath Weighs Heavy (13,0) `chain_broken`: autonomy +0.10. AI 0; 20 when available.
- `quiet_councils` Quiet Councils (12,1; ← oath_weighs) `council_table`: political_power 50. AI 15.
- `ember_trade` Ember Trade (14,1; ← oath_weighs) `caravan`: add_spirit `ember_trade`. AI 15.
- `a_crown_not_a_chain` A Crown, Not a Chain (13,2; ← both; 70) `crown_broken`: autonomy +0.15; oath −10. AI 10; hist ×0.2 before `zin_volgan_body_destroyed`.

**E. Ember Forges** (x 16–18, rows 0–2).
- `ember_forges` Ember Forges (17,0; 70) `foundry_fire`: building arms_factory 1 @capital. AI 30.
- `obsidian_quarries` Obsidian Quarries (16,1; ← forges) `quarry_stone`: building industrial_complex 1 @random_owned. AI 15.
- `the_hot_roads` The Hot Roads (18,1; ← forges) `roads_paved`: building infrastructure 1 @capital. AI 15.
- `nezers_furnaces` Nezer's Furnaces (17,2; ← quarries + roads) `forge_anvil`: add_spirit `nezers_furnaces`. AI 15.

**F. The War-Bands Ride** (x 4–6, rows 6–8). Head `available`: `at_war`.
- `the_war_bands_ride` The War-Bands Ride (5,6; 21) `demon_horn`: war_support 0.10; manpower 2000. AI 0; 300 when available.
- `nezer_marches_north` Nezer Marches North (4,7; ← ride; 21) `banner_black`: Avail: global_flag `zin_volgan_marches`. army_experience 15. AI 100.
- `burning_vanguard` The Burning Vanguard (6,7; ← ride; 21) `nether_gate`: timed_spirit `burning_vanguard` 180. AI 100.
- `the_ember_host` The Ember Host (5,8; ← either) `war_drums`: army_experience 10; oath +5. AI 100.

**G. When the Throne Is Silent** (x 12–14, rows 6–8). Head `available`: global_flag `zin_volgan_body_destroyed`. Exclusive: *Stand with the Steward* / *The Queen's Own Crown*.
- `a_name_that_does_not_answer` A Name That Does Not Answer (13,6) `silent_throne`: stability 0.05; event `silent_south`. AI 0; 300 when available.
- `stand_with_the_steward` Stand with the Steward (12,7; ← name; excl own_crown) `banner_black`: Avail: ROOT is Volgan's subject. oath +20; stability 0.05. AI 20; ×3 if oath ≥ 40.
- `the_queens_own_crown` The Queen's Own Crown (14,7; ← name; excl steward) `crown_iron`: call `zin_regional_nezer_crown_free` (if still Volgan's subject: autonomy +0.5; if free: add_spirit `own_crown`). AI 20; ×3 if oath < 40.
- `the_ember_coast_endures` The Ember Coast Endures (13,8; ← either) `ember_desert`: political_power 50; stability 0.05. AI 100.

### Key focuses

| Key | Name | Prerequisites | Effects summary |
| --- | --- | --- | --- |
| `answer_the_summons` | Answer the Summons | — | Oath +5 |
| `war_bands_for_the_dominion` | War-Bands for the Dominion | answer_the_summons | Strength +1 to Volgan; army experience |
| `the_dominions_vanguard` | The Dominion's Vanguard | war_bands + tribute; oath ≥ 50 | Attack spirit; oath +10 |
| `open_the_gate_for_nafeher` | Open the Gate for Nafeher | wardens / lore | Nether pact +5 (toward Netherborn companies and the gate pact); oath +5. Text never says what the King of Demons owes anyone |
| `keep_the_gate_sealed` | Keep the Gate Sealed | wardens / lore | Defensive spirit; oath −5: Nezer's first step toward its own road |
| `the_oath_weighs_heavy` | The Oath Weighs Heavy | — (oath < 40 or own road) | Autonomy +10% |
| `a_name_that_does_not_answer` | A Name That Does Not Answer | — (`zin_volgan_body_destroyed`) | Opens the aftermath choice; the text keeps Volgan's fate open |

### Spirits

| Key | Name | Modifiers | Added / removed |
| --- | --- | --- | --- |
| `one_family` | One Family | `stability_factor` 0.05 | `one_family`; replaced by the next two |
| `queens_hand` | The Queen's Hand | `political_power_gain` 0.10, `stability_factor` 0.03 | `the_queens_hand` |
| `houses_rule` | The Houses Rule | `stability_factor` 0.08, `political_power_factor` −0.05 | `the_houses_rule` |
| `dominion_vanguard` | The Dominion's Vanguard | `army_attack_factor` 0.05, `war_support_factor` 0.05 | `the_dominions_vanguard`; removed when Nezer leaves Volgan |
| `sealed_gate` | The Gate Kept Sealed | `army_core_defence_factor` 0.10, `drift_defence_factor` 0.10 | `keep_the_gate_sealed` |
| `ember_trade` | Ember Trade | `trade_opinion_factor` 0.10 | `ember_trade` |
| `nezers_furnaces` | Nezer's Furnaces | `production_speed_arms_factory_factor` 0.05, `production_speed_buildings_factor` 0.05 | `nezers_furnaces` |
| `burning_vanguard` | The Burning Vanguard | `army_attack_factor` 0.10, `breakthrough_factor` 0.05 | timed, 180 days |
| `own_crown` | The Queen's Own Crown | `stability_factor` 0.10, `drift_defence_factor` 0.15 | `the_queens_own_crown` (free Nezer) |

### Events (namespace `zin_regional_nezer`)

| # | Key | Title | To | Trigger | Options |
| ---: | --- | --- | --- | --- | --- |
| 1 | `two_crowns` | Two Crowns, One Family | Nezer | The Two Crowns of Nezer | "Nezerun leads." (political_power 25) / "Nezer and Nezerun as equals." (stability 0.03) |
| 2 | `burning_gate` | The Burning Gate | Nezer | The Burning Gate Remembered | One option. Text: in an older age a gate of fire stood open in one of Nezer's strongholds; men, elves and dark soldiers closed it together and forgot it together. Nobody in Nezer says who opened it |
| 3 | `silent_south` | The Silence from Nafeher | Nezer | A Name That Does Not Answer | One option. Text: the summons have stopped; the Steward speaks in a name that does not answer; what remains of the master of Nafeher, no one living can say |

### Historical AI route

1748–1750: two_crowns_of_nezer, answer_the_summons, ember_forges, nazaras_court, the_nezerun_houses, war_bands_for_the_dominion, tribute_of_nezer. 1750–1754: one_family, the_queens_hand, the_dominions_vanguard, the_burning_gate_remembered, wardens_of_the_gate, old_portal_lore, open_the_gate_for_nafeher, obsidian_quarries, the_hot_roads, nezers_furnaces, the_ember_coast. 1755–1757: war branch. After the body breaks: a_name_that_does_not_answer, then the option the oath favours.

---

## Demon

### Situation in 4A 1748

Demon is the horned court of the Dominion: one land of cinder plains and vents on the northern edge of the heat that leads toward the Nether (proposed), ruled by Hazarel the Horned. Its houses raise the Netherborn levies that Volgan calls on, and its envoys are the ones who go south into the heat to speak with the Nether's court. What the King of Demons is to Demon's lords, or to Volgan, is a question Demon's own texts do not answer. Demon's oath to Nafeher is the strongest of the three.

### Role

- **Historical path (proposed):** Demon is first of the sworn: it keeps its oath high, sends levies, speaks with the Nether for Nafeher, and fights in the war on Mirolon and the march north. When the body breaks, its oath (still 40 or more) keeps it with the Steward.
- **Alternatives:** a horned crown that seeks its own road; a Demon that frees itself after the silence.

### Ruler and court (proposed)

| Id | Name | Role | Traits |
| --- | --- | --- | --- |
| `<Demon>_zin_ruler` | Hazarel the Horned | Country leader, `zin_shadow_dread` | — |
| `zin_regional_demon_azuth` | Azuth Cinder-Voice | Political advisor | `zin_adv_envoy` |
| `zin_regional_demon_merakh` | Merakh the Horned Steward | Political advisor | `zin_adv_treasurer` |
| `zin_regional_demon_vrael` | Vrael of the Levies | Political advisor | `zin_adv_muster_master` |

### Tree `regional_demon` (30 focuses)

**A. The Horned Court** (x 0–2, rows 0–3). Exclusive: *The Horned Throne* / *The House Council*.
- `the_horned_court` The Horned Court (1,0; 70) `demon_horn`: political_power 50; event `horned_court`. AI 40.
- `hazarels_word` Hazarel's Word (0,1; ← court) `seal_royal`: political_power 25. AI 20.
- `the_netherborn_houses` The Netherborn Houses (2,1; ← court) `council_table`: stability 0.05. AI 20.
- `the_horned_throne` The Horned Throne (0,2; ← word / houses; excl council) `crown_iron`: add_spirit `horned_throne`. AI 15; hist ×2.
- `the_house_council` The House Council (2,2; ← word / houses; excl throne) `council_table`: add_spirit `house_council`. AI 10.
- `court_of_cinders` The Court of Cinders (1,3; ← either; 70) `ember_desert`: political_power 75. AI 15.

**B. First of the Sworn** (x 4–6, rows 0–2).
- `first_of_the_sworn` First of the Sworn (5,0) `banner_black`: oath +10. AI 30; hist ×2.
- `netherborn_levies_for_nafeher` Netherborn Levies for Nafeher (4,1; ← first) `demon_horn`: manpower 2000; strength +1. AI 20.
- `the_dominions_due` The Dominion's Due (6,1; ← first) `tribute_chest`: oath +5; political_power 25. AI 15.
- `first_into_the_storm` First into the Storm (5,2; ← both; 70) `war_drums`: Avail: oath ≥ 50. add_spirit `first_into_the_storm`. AI 20.

**C. The Nether's Edge** (x 8–10, rows 0–2).
- `the_nethers_edge` The Nether's Edge (9,0) `nether_gate`: event `southern_heat`. AI 25.
- `envoys_below` Envoys Below (8,1; ← edge) `envoy`: nether pact +3; political_power −25. AI 15; hist ×2.
- `old_portal_sites` Old Portal Sites (10,1; ← edge) `nether_gate`: research [zin_cat_dark_rites] 50% ×1. AI 15.
- `the_bargain_of_this_reign` The Bargain of This Reign (9,2; ← both; 70) `scroll_sealed`: Avail: Volgan has country flag `zin_volgan_nether_bargain` or `zin_volgan_nether_bent`. nether pact +5; oath +5. AI 20.

**D. Our Own Road** (x 12–14, rows 0–2). Head `available`: variable `zin_dominion_oath` below 40, or flag own road.
- `the_horned_crown_alone` The Horned Crown Alone (13,0) `chain_broken`: autonomy +0.10. AI 0; 20 when available.
- `counsel_of_cinders` Counsel of Cinders (12,1; ← alone) `council_table`: political_power 50. AI 15.
- `trade_with_the_free` Trade with the Free (14,1; ← alone) `caravan`: add_spirit `cinder_trade`. AI 15.
- `a_court_of_our_own` A Court of Our Own (13,2; ← both; 70) `crown_broken`: autonomy +0.15; oath −10. AI 10; hist ×0.2 before the body breaks.

**E. Cinder Forges** (x 16–18, rows 0–2).
- `cinder_forges` Cinder Forges (17,0; 70) `foundry_fire`: building arms_factory 1 @capital. AI 30.
- `vent_mines` Vent Mines (16,1; ← forges) `mine_cart`: building industrial_complex 1 @capital. AI 15.
- `the_burning_roads` The Burning Roads (18,1; ← forges) `roads_paved`: building infrastructure 1 @capital. AI 15.
- `furnaces_of_demon` Furnaces of Demon (17,2; ← mines + roads) `forge_anvil`: add_spirit `furnaces_of_demon`. AI 15.

**F. The Horned Host** (x 4–6, rows 6–8). Head `available`: `at_war`.
- `the_horned_host` The Horned Host (5,6; 21) `demon_horn`: war_support 0.10; manpower 2000. AI 0; 300 when available.
- `netherborn_vanguard` The Netherborn Vanguard (4,7; ← host; 21) `banner_black`: Avail: global_flag `zin_volgan_marches`. army_experience 15. AI 100.
- `fire_at_the_gate` Fire at the Gate (6,7; ← host; 21) `nether_gate`: Avail: Volgan has country flag `zin_volgan_gate_pact`. nether pact +5. AI 100.
- `the_host_returns` The Host Returns (5,8; ← either) `war_drums`: Avail: not at_war. stability 0.05; oath +5. AI 100.

**G. A Silent Throne in the South** (x 12–14, rows 6–8). Head `available`: global_flag `zin_volgan_body_destroyed`. Exclusive: *Stand with the Steward* / *The Horned Crown Free*.
- `silence_from_nafeher` Silence from Nafeher (13,6) `silent_throne`: stability 0.05; event `silence_from_nafeher`. AI 0; 300 when available.
- `stand_with_the_steward` Stand with the Steward (12,7; ← silence; excl free) `banner_black`: Avail: ROOT is Volgan's subject. oath +20; stability 0.05. AI 20; ×3 if oath ≥ 40.
- `the_horned_crown_free` The Horned Crown Free (14,7; ← silence; excl steward) `crown_iron`: call `zin_regional_demon_crown_free` (as Nezer's). AI 20; ×3 if oath < 40.
- `cinders_cool` The Cinders Cool (13,8; ← either) `ember_desert`: political_power 50; stability 0.05. AI 100.

### Key focuses

| Key | Name | Prerequisites | Effects summary |
| --- | --- | --- | --- |
| `first_of_the_sworn` | First of the Sworn | — | Oath +10 |
| `netherborn_levies_for_nafeher` | Netherborn Levies for Nafeher | first_of_the_sworn | 2,000 manpower; strength +1 |
| `envoys_below` | Envoys Below | the_nethers_edge | Nether pact +3 for Volgan |
| `the_bargain_of_this_reign` | The Bargain of This Reign | envoys + sites; Volgan chose an approach | Nether pact +5; oath +5. Uses the Volgan spec's phrase; never names the King of Demons |
| `fire_at_the_gate` | Fire at the Gate | the_horned_host; gate pact | Nether pact +5 (more Nether Gate raids for Volgan) |
| `stand_with_the_steward` | Stand with the Steward | silence_from_nafeher | Oath +20 (stay in the Dominion through `zin_dominion.18`) |

### Spirits

| Key | Name | Modifiers | Added / removed |
| --- | --- | --- | --- |
| `horned_throne` | The Horned Throne | `political_power_gain` 0.10, `war_support_factor` 0.05 | `the_horned_throne` |
| `house_council` | The House Council | `stability_factor` 0.08 | `the_house_council` |
| `first_into_the_storm` | First into the Storm | `army_attack_factor` 0.05, `army_morale_factor` 0.05 | `first_into_the_storm`; removed when Demon leaves Volgan |
| `cinder_trade` | Trade with the Free | `trade_opinion_factor` 0.10 | `trade_with_the_free` |
| `furnaces_of_demon` | Furnaces of Demon | `production_speed_arms_factory_factor` 0.05, `production_speed_buildings_factor` 0.05 | `furnaces_of_demon` |
| `own_crown` | The Horned Crown Free | `stability_factor` 0.10, `drift_defence_factor` 0.15 | `the_horned_crown_free` (free Demon) |

### Events (namespace `zin_regional_demon`)

| # | Key | Title | To | Trigger | Options |
| ---: | --- | --- | --- | --- | --- |
| 1 | `horned_court` | The Horned Court Sits | Demon | The Horned Court | "Hazarel speaks." (political_power 25) / "The houses speak." (stability 0.03) |
| 2 | `southern_heat` | Into the Southern Heat | Demon | The Nether's Edge | One option. Text: Demon's envoys walk south into the heat toward the Nether's court and come back with answers they keep to themselves. Nothing names the King of Demons or what he owes |
| 3 | `silence_from_nafeher` | Silence from Nafeher | Demon | Silence from Nafeher | One option. Same rule as Nezer's event 3 |

### Historical AI route

1748–1750: the_horned_court, first_of_the_sworn, cinder_forges, hazarels_word, the_netherborn_houses, netherborn_levies_for_nafeher, the_dominions_due. 1750–1754: the_horned_throne, first_into_the_storm, the_nethers_edge, envoys_below, old_portal_sites, the_bargain_of_this_reign, vent_mines, the_burning_roads, furnaces_of_demon, court_of_cinders. 1755–1757: war branch. After the body breaks: stand_with_the_steward.

---

## Dolon

### Situation in 4A 1748

Dolon is the forge of the Dominion: one land of salt flats, ash kilns and black galleys on the shore of a bitter inland water its demons call the Dead Sea (proposed), ruled by Morvath of the Dead Sea from a counting-house as much as a throne. Its forges arm Volgan's hosts; its galleys are among the few that sail the storm coasts, because the storms spare those who were born under them. Morvath keeps the Dominion's ledgers and keeps a few of his own.

### Role

- **Historical path (proposed):** Dolon forges for Nafeher, sends arms north, and keeps its galleys in harbour; it fights in 4A 1755 as a subject. After the body breaks, its fate follows its oath (proposed: it stays with the Steward if its oath is 40 or more).
- **Alternatives:** a Dolon that trades beyond the storms and buys its own road.

### Ruler and court (proposed)

| Id | Name | Role | Traits |
| --- | --- | --- | --- |
| `<Dolon>_zin_ruler` | Morvath of the Dead Sea | Country leader, `zin_shadow_dread` | — |
| `zin_regional_dolon_krevan` | Salt-Lord Krevan | Political advisor | `zin_adv_merchant_prince` |
| `zin_regional_dolon_ossira` | Ossira Forge-Mother | Political advisor | `zin_adv_road_warden` |
| `zin_regional_dolon_vorusk` | Thane Vorusk | Political advisor | `zin_adv_war_speaker` |
| `zin_regional_dolon_thuul` | Thuul of the Black Galleys | Navy leader, skill 2 | — |

### Tree `regional_dolon` (30 focuses)

**A. The Court of the Dead Sea** (x 0–2, rows 0–3). Exclusive: *The Iron Steward* / *The Salt Council*.
- `court_of_the_dead_sea` The Court of the Dead Sea (1,0; 70) `storm_sea`: political_power 50; event `dead_sea_court`. AI 40.
- `morvaths_ledger` Morvath's Ledger (0,1; ← court) `ledger_coins`: political_power 25. AI 20.
- `the_salt_lords` The Salt-Lords (2,1; ← court) `granary`: stability 0.05. AI 20.
- `the_iron_steward` The Iron Steward (0,2; ← ledger / lords; excl salt_council) `seal_royal`: add_spirit `iron_steward`. AI 15; hist ×2.
- `the_salt_council` The Salt Council (2,2; ← ledger / lords; excl iron) `council_table`: add_spirit `salt_council`. AI 10.
- `dolon_endures` Dolon Endures (1,3; ← either; 70) `ember_desert`: political_power 75. AI 15.

**B. The Forges of Dolon** (x 4–6, rows 0–3).
- `forges_of_dolon` The Forges of Dolon (5,0; 70) `forge_anvil`: building arms_factory 1 @capital; oath +5. AI 30.
- `salt_of_the_dead_sea` Salt of the Dead Sea (4,1; ← forges) `granary`: add_spirit `dead_sea_salt`. AI 15.
- `ash_kilns` Ash Kilns (6,1; ← forges) `foundry_fire`: building arms_factory 1 @capital. AI 15.
- `deep_salt_pans` Deep Salt-Pans (4,2; ← salt) `quarry_stone`: building industrial_complex 1 @capital. AI 10.
- `arms_for_nafeher` Arms for Nafeher (6,2; ← kilns) `tribute_chest`: Avail: ROOT is Volgan's subject. call `zin_regional_dolon_send_arms` (`send_equipment` 500 `zin_arms_equipment` to Volgan); strength +1; oath +5. AI 20; hist ×2.
- `arms_of_dolon` The Arms of Dolon (5,3; ← pans / arms; 70) `forge_anvil`: add_spirit `arms_of_dolon`. AI 15.

**C. Black Galleys of the Storm Coast** (x 8–10, rows 0–3). `allow_branch` and `available` on the head: check `zin_regional_dolon_is_coastal`.
- `black_galleys` Black Galleys (9,0) `galley_oars`: building dockyard 1 @random_coastal. AI 20.
- `storm_pilots_of_dolon` Storm Pilots of Dolon (8,1; ← galleys) `storm_sea`: navy_experience 10; research [zin_cat_galleys] 50% ×1. AI 15.
- `salt_harbour` The Salt Harbour (10,1; ← galleys) `harbour_lake`: building naval_base 1 @random_coastal. AI 15.
- `galleys_for_the_dominion` Galleys for the Dominion (9,2; ← pilots + harbour) `corsair_raider`: navy_experience 10; oath +3. AI 15.
- `storm_harbour_chain` The Storm-Harbour Chain (9,3; ← galleys_for) `strait_chain`: building coastal_bunker 1 @random_coastal. AI 10.

**D. Our Own Road** (x 12–14, rows 0–3). Head `available`: variable `zin_dominion_oath` below 40, or flag own road.
- `a_ledger_of_our_own` A Ledger of Our Own (13,0) `ledger_coins`: autonomy +0.10. AI 0; 20 when available.
- `trade_beyond_the_storms` Trade Beyond the Storms (12,1; ← ledger) `ship_voyage`: add_spirit `beyond_the_storms`. AI 15.
- `quiet_from_nafeher` Quiet from Nafeher (14,1; ← ledger) `seal_wax`: political_power 50. AI 15.
- `a_steward_of_salt` A Steward of Salt (13,2; ← both; 70) `crown_broken`: autonomy +0.15; oath −10. AI 10; hist ×0.2 before the body breaks.
- `dolon_for_dolon` Dolon for Dolon (13,3; ← steward) `banner_plain`: Avail: ROOT is not a subject. stability 0.10; add_spirit `own_crown`. AI 100 when available.

**E. Dolon Marches** (x 4–6, rows 6–8). Head `available`: `at_war`.
- `dolon_marches` Dolon Marches (5,6; 21) `banner_black`: war_support 0.10; manpower 1500. AI 0; 300 when available.
- `forges_never_rest` The Forges Never Rest (4,7; ← marches; 21) `foundry_fire`: timed_spirit `forges_never_rest` 365. AI 100.
- `shields_of_dolon` Shields of Dolon (6,7; ← marches; 21) `sword_shield`: Avail: global_flag `zin_volgan_marches`. army_experience 15. AI 100.
- `dolon_at_peace` Dolon at Peace (5,8; ← either) `olive_branch`: Avail: not at_war. stability 0.05. AI 100.

**F. The Throne That Does Not Answer** (x 12–14, rows 6–8). Head `available`: global_flag `zin_volgan_body_destroyed`. Exclusive: *Stand with the Steward* / *Free Dolon*.
- `a_throne_that_does_not_answer` A Throne That Does Not Answer (13,6) `silent_throne`: stability 0.05; event `silence_on_the_dead_sea`. AI 0; 300 when available.
- `stand_with_the_steward` Stand with the Steward (12,7; ← throne; excl free) `banner_black`: Avail: ROOT is Volgan's subject. oath +20. AI 20; ×3 if oath ≥ 40.
- `free_dolon` Free Dolon (14,7; ← throne; excl steward) `chain_broken`: call `zin_regional_dolon_crown_free` (as Nezer's). AI 20; ×3 if oath < 40.
- `salt_and_iron_endure` Salt and Iron Endure (13,8; ← either) `forge_anvil`: political_power 50; stability 0.05. AI 100.

### Key focuses

| Key | Name | Prerequisites | Effects summary |
| --- | --- | --- | --- |
| `forges_of_dolon` | The Forges of Dolon | — | An armoury; oath +5 (pairs with Volgan's own *The Forges of Dolon*) |
| `arms_for_nafeher` | Arms for Nafeher | ash_kilns; Volgan's subject | 500 arms sent to Volgan; strength +1; oath +5 |
| `galleys_for_the_dominion` | Galleys for the Dominion | pilots + harbour | Navy experience; oath +3. Dead Lands fleets are spared the storm pulse (magic spec) |
| `a_ledger_of_our_own` | A Ledger of Our Own | — (oath < 40 or own road) | Autonomy +10% |
| `free_dolon` | Free Dolon | a_throne_that_does_not_answer | Autonomy +50% or a free realm's spirit |

### Spirits

| Key | Name | Modifiers | Added / removed |
| --- | --- | --- | --- |
| `iron_steward` | The Iron Steward | `political_power_gain` 0.10, `production_factory_efficiency_gain_factor` 0.03 | `the_iron_steward` |
| `salt_council` | The Salt Council | `stability_factor` 0.05, `trade_opinion_factor` 0.10 | `the_salt_council` |
| `dead_sea_salt` | Salt of the Dead Sea | `consumer_goods_factor` −0.03 | `salt_of_the_dead_sea` |
| `arms_of_dolon` | The Arms of Dolon | `production_speed_arms_factory_factor` 0.10 | `arms_of_dolon` |
| `beyond_the_storms` | Trade Beyond the Storms | `trade_opinion_factor` 0.10, `political_power_gain` 0.05 | `trade_beyond_the_storms` |
| `own_crown` | Dolon for Dolon | `stability_factor` 0.10, `drift_defence_factor` 0.15 | `dolon_for_dolon` or `free_dolon` (free Dolon) |
| `forges_never_rest` | The Forges Never Rest | `production_speed_arms_factory_factor` 0.10, `industrial_capacity_factory` 0.05 | timed, 365 days |

### Events (namespace `zin_regional_dolon`)

| # | Key | Title | To | Trigger | Options |
| ---: | --- | --- | --- | --- | --- |
| 1 | `dead_sea_court` | The Court of the Dead Sea | Dolon | The Court of the Dead Sea | "Count the ledgers." (political_power 25) / "Feast the salt-lords." (stability 0.03) |
| 2 | `silence_on_the_dead_sea` | Silence on the Dead Sea | Dolon | A Throne That Does Not Answer | One option. Same rule as Nezer's event 3 |

### Historical AI route

1748–1750: court_of_the_dead_sea, forges_of_dolon, black_galleys (if coastal), morvaths_ledger, the_salt_lords, ash_kilns, salt_of_the_dead_sea. 1750–1754: the_iron_steward, arms_for_nafeher, deep_salt_pans, arms_of_dolon, storm_pilots_of_dolon, salt_harbour, galleys_for_the_dominion, dolon_endures. 1755–1757: war branch. After the body breaks: the option the oath favours.

---

## Olen

### Situation in 4A 1748

Olen is a free realm of men on the cliffs of the Dead Lands' coast: three provinces of terraces, cisterns and windmills where a cool wind comes off the sea in the evenings, the only cool air for a hundred leagues. Its people call that wind the Holy Breeze and keep shrines to it on the cliff-tops (proposed). Olena of the Holy Breeze, keeper of the chief shrine, rules with the freeholders. Olen trades salt and dried fish with the storm-born galleys of the Dominion and with Mirolon's lake towns, and keeps the old quiet with Nafeher: it does not ask what drills behind the storms, and Nafeher does not ask anything of Olen. Pilgrims of the Deliverer have begun to come south with healers and bread, and the shrine-keepers are divided about them.

### Role

- **Historical path (proposed):** Olen stands with Mirolon's wardens when Mirolon invites the free realms, joins the Warden League if Mirolon forms it, and fights in 4A 1755 when Volgan's war comes; how it fares is left to play. Its shrines shelter refugees from the march north. Olen welcomes the Houses' healers (footholds 2) without knowing whose they are.
- **Alternatives:** keep the old quiet with tribute to Nafeher (Volgan's AI leaves tribute-payers alone before the march); wall in behind the cliffs; keep the shrines free of the Houses.

### Ruler and court (proposed)

| Id | Name | Role | Traits |
| --- | --- | --- | --- |
| `<Olen>_zin_ruler` | Olena of the Holy Breeze | Country leader, `zin_wild_freeholds` | — |
| `zin_regional_olen_cael` | Brother Cael of the Cliffs | Political advisor | `zin_adv_high_priest` (a priest of the Breeze) |
| `zin_regional_olen_marra` | Marra Cisternwright | Political advisor | `zin_adv_road_warden` |
| `zin_regional_olen_joss` | Captain Joss Ardel | Political advisor | `zin_adv_muster_master` |

### Tree `regional_olen` (32 focuses)

**A. The Holy Breeze** (x 0–2, rows 0–4). Exclusive: *The Breeze and the Lamp* / *The Breeze Alone*.
- `the_holy_breeze` The Holy Breeze (1,0; 70) `lighthouse`: political_power 50; event `breeze_rises`. AI 40.
- `olenas_counsel` Olena's Counsel (0,1; ← breeze) `book_lore`: political_power 25; stability 0.02. AI 20.
- `breeze_shrines` The Breeze Shrines (2,1; ← breeze) `rune_stone`: stability 0.05. AI 20.
- `the_breeze_keepers` The Breeze-Keepers (1,2; ← counsel + shrines) `hymn_choir`: add_spirit `breeze_keepers`. AI 15.
- `the_breeze_and_the_lamp` The Breeze and the Lamp (0,3; ← keepers; excl alone) `house_first_light`: footholds +1; stability 0.05; add_spirit `breeze_and_lamp`. Text: healers of the Houses of the First Light are welcomed beside the shrines. AI 20; hist ×1.5.
- `the_breeze_alone` The Breeze Alone (2,3; ← keepers; excl lamp) `banner_plain`: footholds −1; add_spirit `breeze_alone`. Text: Olen keeps its own shrines and its own healers. AI 15.
- `olen_at_peace` Olen at Peace (1,4; ← either; 70) `olive_branch`: political_power 75; stability 0.03. AI 15.

**B. Cool Wind, Hot Land** (x 4–6, rows 0–3).
- `cliff_terraces` Cliff Terraces (5,0; 70) `farm_sowing`: add_spirit `cliff_terraces`. AI 30.
- `windmills_of_the_cliffs` Windmills of the Cliffs (4,1; ← terraces) `workshop_tools`: building industrial_complex 1 @random_owned. AI 15.
- `cistern_roads` Cistern Roads (6,1; ← terraces) `roads_paved`: building infrastructure 1 @random_owned. AI 15.
- `the_cool_harbour` The Cool Harbour (4,2; ← windmills) `harbour_lake`: Avail: check `zin_regional_olen_is_coastal`. building dockyard 1 @random_coastal. AI 15.
- `breeze_markets` Breeze Markets (6,2; ← cisterns) `market_stalls`: add_spirit `breeze_markets`. AI 15.
- `olen_prospers` Olen Prospers (5,3; ← harbour / markets; 70) `coin_chest`: building industrial_complex 1 @random_owned; political_power 50. AI 15.

**C. Nafeher's Shadow** (x 8–12, rows 0–2). Three-way exclusive at row 1.
- `the_southern_storm` The Southern Storm (10,0) `storm_veil`: event `rumours_from_nafeher`. AI 30.
- `keep_the_old_quiet` Keep the Old Quiet (8,1; ← storm; excl wardens, cliffs) `tribute_chest`: Avail: exists Volgan. event_for Volgan `olen_offers_tribute`. AI 20; hist ×0.5.
- `stand_with_the_wardens` Stand with the Wardens (10,1; ← storm; excl quiet, cliffs) `warden_crown`: Avail: exists Mirolon. event_for Mirolon `olen_offers_friendship`; proof +2. AI 20; hist ×2.
- `behind_our_cliffs` Behind Our Cliffs (12,1; ← storm; excl quiet, wardens) `fort_wall`: building bunker 2 @capital; building coastal_bunker 1 @random_coastal. AI 15.
- `the_quiet_kept` The Quiet Kept (8,2; ← quiet) `olive_branch`: Avail: flag `zin_dominion_tributary_friend`. stability 0.05; political_power 50. AI 20.
- `the_warden_league` The Warden League (10,2; ← wardens) `banner_league`: Avail: flag `zin_mirolon_league_friend`; Mirolon leads a faction. `join_faction_of` Mirolon. AI 30; hist ×2.
- `the_cliffs_hold` The Cliffs Hold (12,2; ← cliffs) `pass_fort`: add_spirit `cliffs_hold`. AI 15.

**D. The Breeze Healers** (x 14–16, rows 0–2).
- `breeze_healers` The Breeze Healers (15,0) `healer_herbs`: add_spirit `breeze_healers`. AI 20.
- `healers_to_mirolon` Healers to Mirolon (14,1; ← healers) `lake_town`: Avail: exists Mirolon. opinion Mirolon +15 (`healers_sent`) both ways; proof +2. AI 15.
- `healers_to_the_north` Healers to the North (16,1; ← healers) `envoy`: Avail: exists Aenor. opinion Aenor +10 (`healers_sent`). AI 10.
- `the_breeze_carries_word` The Breeze Carries Word (15,2; ← either) `scout_lantern`: Avail: global_flag `zin_eindil_named`; global variable `zin_eindil_stage` above 7. regard +15; renown +2. Description uses `[zin_loc_eindil]`. AI 0; 50 when available.

**E. The Breeze Guard** (x 18–20, rows 0–2).
- `breeze_guard` The Breeze Guard (19,0; 70) `spear_levy`: army_experience 10; research [zin_cat_arms] 50% ×1. AI 25.
- `cliff_archers` Cliff Archers (18,1; ← guard) `bow_archers`: research [zin_cat_bows] 50% ×1. AI 15.
- `sea_watch` The Sea Watch (20,1; ← guard) `lighthouse`: add_spirit `sea_watch`. AI 15.
- `guard_of_the_breeze` Guard of the Breeze (19,2; ← archers + watch; 70) `sword_shield`: add_spirit `guard_of_the_breeze`. AI 15.

**F. The Breeze Turns** (x 8–10, rows 6–8). Head `available`: `at_war`.
- `the_breeze_turns` The Breeze Turns (9,6; 21) `storm_sea`: war_support 0.10; manpower 1500. AI 0; 300 when available.
- `hold_the_cliffs` Hold the Cliffs (8,7; ← turns; 21) `fort_wall`: building bunker 1 @capital; timed_spirit `hold_the_cliffs` 180. AI 100.
- `the_shrines_shelter` The Shrines Shelter (10,7; ← turns; 21) `healer_herbs`: Avail: global_flag `zin_volgan_marches`. manpower 2000; stability 0.05. Text: refugees from the north climb to the shrines. AI 100.
- `the_breeze_returns` The Breeze Returns (9,8; ← either) `olive_branch`: Avail: not at_war. stability 0.10. AI 100.

### Key focuses

| Key | Name | Prerequisites | Effects summary |
| --- | --- | --- | --- |
| `keep_the_old_quiet` | Keep the Old Quiet | the_southern_storm | Event to Volgan: accept Olen's tribute (non-aggression; Olen gets `zin_dominion_tributary_friend`, so Volgan's AI does not target it before the march) |
| `stand_with_the_wardens` | Stand with the Wardens | the_southern_storm | Event to Mirolon: friendship (`zin_mirolon_league_friend`; opinion); Mirolon's proof +2 |
| `the_warden_league` | The Warden League | stand_with_the_wardens; Mirolon leads a faction | Joins Mirolon's faction |
| `the_breeze_and_the_lamp` | The Breeze and the Lamp | the_breeze_keepers | Footholds +1 (cap 3): the Houses' healers come to Olen |
| `the_breeze_alone` | The Breeze Alone | the_breeze_keepers | Footholds −1; drift defence |
| `the_shrines_shelter` | The Shrines Shelter | the_breeze_turns; `zin_volgan_marches` | Manpower and stability from refugees |

### Spirits

| Key | Name | Modifiers | Added / removed |
| --- | --- | --- | --- |
| `breeze_keepers` | The Breeze-Keepers | `stability_factor` 0.05, `drift_defence_factor` 0.05 | `the_breeze_keepers` |
| `breeze_and_lamp` | The Breeze and the Lamp | `monthly_population` 0.05, `stability_factor` 0.02 | `the_breeze_and_the_lamp` |
| `breeze_alone` | The Breeze Alone | `drift_defence_factor` 0.15 | `the_breeze_alone` |
| `cliff_terraces` | Cliff Terraces | `monthly_population` 0.05, `consumer_goods_factor` −0.02 | `cliff_terraces` |
| `breeze_markets` | Breeze Markets | `trade_opinion_factor` 0.10 | `breeze_markets` |
| `cliffs_hold` | The Cliffs Hold | `army_core_defence_factor` 0.10, `amphibious_invasion_defence` 0.20 | `the_cliffs_hold` |
| `breeze_healers` | The Breeze Healers | `army_org_factor` 0.03, `stability_factor` 0.02 | `breeze_healers` |
| `sea_watch` | The Sea Watch | `naval_detection` 0.10 | `sea_watch` |
| `guard_of_the_breeze` | Guard of the Breeze | `army_defence_factor` 0.05, `army_morale_factor` 0.05 | `guard_of_the_breeze` |
| `hold_the_cliffs` | Hold the Cliffs | `army_defence_factor` 0.10 | timed, 180 days |

### Events (namespace `zin_regional_olen`)

| # | Key | Title | To | Trigger | Options |
| ---: | --- | --- | --- | --- | --- |
| 1 | `breeze_rises` | The Evening Breeze | Olen | The Holy Breeze | "Light the shrines." (stability 0.03) / "Open the cisterns." (political_power 25) |
| 2 | `rumours_from_nafeher` | Rumours from Nafeher | Olen | The Southern Storm | One option. Text: the galleys of Dolon buy more salt than a peaceful land eats; the storms over Nafeher have not lifted in a year |
| 3 | `olen_offers_tribute` | Tribute from Olen | Volgan | Keep the Old Quiet | "The quiet holds." (`diplomatic_relation` non_aggression_pact with Olen; Volgan +25 political power; Olen −50 political power; Olen country flag `zin_dominion_tributary_friend`; AI 80) / "Nafeher takes no gifts from the north." (AI 20) |
| 4 | `olen_offers_friendship` | Friendship from Olen | Mirolon | Stand with the Wardens | "Stand together." (Olen flag `zin_mirolon_league_friend`; opinion `healers_sent` +15 both ways; AI 80) / "We keep our own counsel." (AI 20) |
| 5 | `an_answer_on_the_wind` | An Answer on the Wind | Olen | Reply to 3 and 4 | Result text |

### Historical AI route

1748–1750: the_holy_breeze, cliff_terraces, the_southern_storm, olenas_counsel, breeze_shrines, stand_with_the_wardens, breeze_healers, breeze_guard. 1750–1754: the_breeze_keepers, the_breeze_and_the_lamp, the_warden_league (when it exists), windmills_of_the_cliffs, cistern_roads, breeze_markets, healers_to_mirolon, cliff_archers, sea_watch. 1755 onward: war branch; the_shrines_shelter on the march; the rest.

---

## Nan

### Situation in 4A 1748

Nan is a warlord's realm of islands and peninsulas: Nan and Vez Nan, held together by Warlord Dumar of Vez Nan and his captains (roster; names proposed). Its sailors are storm pilots who know the reefs and the storm belt of the Dead Lands' coast, where foreign fleets founder; no other men sail those waters for a living. Inland, beyond Vez Nan's hills, the elders say there is a stair that goes down into the dark, and that long ago a stranger from the north went down it and came back up (proposed telling of an established theft; no more is said). Nan answers to no one and sells to anyone.

### Role

- **Historical path (proposed):** Nan keeps its storm for itself: it sells pilots to no power, fortifies its isles, and stays out of the war unless the war comes to it. It listens to Mirolon's invitation and keeps its own counsel.
- **Alternatives:** pilots for Nafeher (Volgan's fleet and landings gain from Nan's skill; Nan gets coin and is left alone before the march); pilots for the wardens (Nan ferries Mirolon's exiles north when the passes fall).

### Ruler and court (proposed)

| Id | Name | Role | Traits |
| --- | --- | --- | --- |
| `<Nan>_zin_ruler` | Warlord Dumar of Vez Nan | Country leader, `zin_dom_warlord` | — |
| `zin_regional_nan_seska` | Pilot-Master Seska | Political advisor | `zin_adv_envoy` |
| `zin_regional_nan_rook` | Rook Saltjaw | Political advisor | `zin_adv_war_speaker` |
| `zin_regional_nan_vennick` | Old Vennick of the Rim | Political advisor | `zin_adv_whisper_master` |
| `zin_regional_nan_isra` | Captain Isra Vane | Navy leader, skill 3 | — |

### Tree `regional_nan` (30 focuses)

**A. The Warlord of Vez Nan** (x 0–2, rows 0–3). Exclusive: *One Warlord* / *The Captains' Moot*.
- `warlord_of_vez_nan` The Warlord of Vez Nan (1,0; 70) `crown_iron`: political_power 50; event `warlord_speaks`. AI 40.
- `dumars_captains` Dumar's Captains (0,1; ← warlord) `war_council_map`: army_experience 5; political_power 25. AI 20.
- `the_island_lords` The Island Lords (2,1; ← warlord) `anchor_rope`: stability 0.05. AI 20.
- `one_warlord` One Warlord (0,2; ← captains / lords; excl moot) `sword_shield`: add_spirit `one_warlord`. AI 15; hist ×2.
- `the_captains_moot` The Captains' Moot (2,2; ← captains / lords; excl one) `council_table`: add_spirit `captains_moot`. AI 10.
- `nan_and_vez_nan` Nan and Vez Nan (1,3; ← either; 70) `alliance_rings`: add_spirit `nan_and_vez_nan`; political_power 50. AI 15.

**B. The Storm Pilots** (x 4–6, rows 0–3).
- `storm_pilots` The Storm Pilots (5,0; 70) `storm_sea`: add_spirit `storm_pilots`; navy_experience 10. AI 35.
- `black_reefs_charted` The Black Reefs Charted (4,1; ← pilots) `sea_charts`: research [zin_cat_galleys] 50% ×1; building dockyard 1 @random_coastal. AI 15.
- `harbour_of_nan` The Harbour of Nan (6,1; ← pilots) `harbour_lake`: building naval_base 1 @capital. AI 15.
- `the_storm_is_our_wall` The Storm Is Our Wall (5,2; ← both; 70) `storm_sea`: building coastal_bunker 2 @capital; add_spirit `storm_wall`. AI 20.
- `pilots_for_hire` Pilots for Hire (5,3; ← wall) `coin_chest`: political_power 50. AI 15.

**C. The Stair Below** (x 8–10, rows 0–2).
- `tales_of_the_stair` Tales of the Stair (9,0) `abyss_stair`: event `tales_of_the_stair`. AI 20.
- `watchers_on_the_rim` Watchers on the Rim (8,1; ← tales) `eye_watchful`: add_spirit `rim_watch`. AI 15.
- `leave_the_deep_alone` Leave the Deep Alone (10,1; ← tales) `olive_branch`: stability 0.05. AI 15.
- `what_the_deep_keeps` What the Deep Keeps (9,2; ← either) `book_lore`: political_power 25; research [zin_cat_dark_rites] 25% ×1. Text: the elders say the Abyss-folk keep to their dark, and Nan keeps to its sea. AI 10.

**D. Between Storm and Sea** (x 12–16, rows 0–2). Three-way exclusive at row 1.
- `between_storm_and_sea` Between Storm and Sea (14,0) `scroll_treaty`: political_power 25. AI 30.
- `pilots_for_nafeher` Pilots for Nafeher (12,1; ← between; excl wardens, no_one) `banner_black`: Avail: exists Volgan. event_for Volgan `nan_offers_pilots`. AI 10; hist ×0.3; free ×2.
- `pilots_for_the_wardens` Pilots for the Wardens (14,1; ← between; excl nafeher, no_one) `warden_crown`: Avail: exists Mirolon. event_for Mirolon `nan_offers_pilots`. AI 10; hist ×0.5.
- `pilots_for_no_one` Pilots for No One (16,1; ← between; excl nafeher, wardens) `storm_sea`: add_spirit `own_storms`. AI 15; hist ×3.
- `dark_coin` Dark Coin (12,2; ← nafeher) `coin_chest`: political_power 50; equipment zin_arms_equipment 300. AI 20.
- `the_exiles_road` The Exiles' Road (14,2; ← wardens) `ship_voyage`: Avail: global_flag `zin_mirolon_fallen`, or Mirolon at_war_with Volgan. event_for Mirolon `ships_for_the_exiles`. AI 100 when available.
- `the_warlords_neutrality` The Warlord's Neutrality (16,2; ← no_one) `banner_plain`: stability 0.05; political_power 25. AI 20.

**E. Island Warbands** (x 18–20, rows 0–2).
- `island_warbands` Island Warbands (19,0; 70) `sword_shield`: army_experience 10; research [zin_cat_arms] 50% ×1. AI 25.
- `reef_raiders` Reef Raiders (18,1; ← warbands) `corsair_raider`: army_experience 5; navy_experience 5. AI 15.
- `peninsula_forts` Peninsula Forts (20,1; ← warbands) `fort_wall`: building bunker 1 @capital. AI 15.
- `the_warlords_host` The Warlord's Host (19,2; ← both; 70) `war_drums`: add_spirit `warlords_host`. AI 15.

**F. The Isles at War** (x 8–10, rows 6–8). Head `available`: `at_war`.
- `the_isles_at_war` The Isles at War (9,6; 21) `storm_sea`: war_support 0.10; manpower 1000. AI 0; 300 when available.
- `the_storm_shelters_us` The Storm Shelters Us (8,7; ← isles; 21) `storm_sea`: timed_spirit `storm_shelter` 365. AI 100.
- `raiders_of_the_reefs` Raiders of the Reefs (10,7; ← isles; 21) `corsair_raider`: navy_experience 15. AI 100.
- `the_isles_endure` The Isles Endure (9,8; ← either) `anchor_rope`: Avail: not at_war. stability 0.10. AI 100.

### Key focuses

| Key | Name | Prerequisites | Effects summary |
| --- | --- | --- | --- |
| `storm_pilots` | The Storm Pilots | — | Spirit: Nan's fleets move and fight well in the storm belt |
| `pilots_for_nafeher` | Pilots for Nafeher | between_storm_and_sea | Event to Volgan: take the pilots (Volgan gets timed idea `zin_regional_nan_pilots_of_nafeher`; Nan gets coin, non-aggression and `zin_dominion_tributary_friend`) |
| `pilots_for_the_wardens` | Pilots for the Wardens | between_storm_and_sea | Event to Mirolon: friendship (`zin_mirolon_league_friend`) and Nan's promise to carry the exiles |
| `the_exiles_road` | The Exiles' Road | pilots_for_the_wardens; Mirolon at war with Volgan or fallen | Event to Mirolon: Nan's ships carry 3,000 of Mirolon's people north (Mirolon manpower +3,000; opinion) |
| `pilots_for_no_one` | Pilots for No One | between_storm_and_sea | The historical road: Nan keeps its storm for itself |
| `tales_of_the_stair` | Tales of the Stair | — | Flavour; nothing names Roka's fate, the thief or his master |

### Spirits

| Key | Name | Modifiers | Added / removed |
| --- | --- | --- | --- |
| `one_warlord` | One Warlord | `political_power_gain` 0.10, `war_support_factor` 0.05 | `one_warlord` |
| `captains_moot` | The Captains' Moot | `stability_factor` 0.05, `naval_detection` 0.05 | `the_captains_moot` |
| `nan_and_vez_nan` | Nan and Vez Nan | `stability_factor` 0.05, `political_power_gain` 0.05 | `nan_and_vez_nan` |
| `storm_pilots` | The Storm Pilots | `naval_speed_factor` 0.05, `navy_org_factor` 0.05, `naval_detection` 0.10 | `storm_pilots` |
| `storm_wall` | The Storm Is Our Wall | `amphibious_invasion_defence` 0.25, `coastal_bunker_effectiveness_factor` 0.10 | `the_storm_is_our_wall` |
| `rim_watch` | Watchers on the Rim | `army_intel_factor` 0.05, `enemy_operative_detection_chance_factor` 0.10 | `watchers_on_the_rim` |
| `own_storms` | Pilots for No One | `drift_defence_factor` 0.10, `trade_opinion_factor` 0.05 | `pilots_for_no_one` |
| `warlords_host` | The Warlord's Host | `army_attack_factor` 0.05, `army_org_factor` 0.03 | `the_warlords_host` |
| `storm_shelter` | The Storm Shelters Us | `amphibious_invasion_defence` 0.25, `army_defence_factor` 0.05 | timed, 365 days |
| `pilots_of_nafeher` (given to Volgan, idea `zin_regional_nan_pilots_of_nafeher`) | Pilots of Nan | `naval_speed_factor` 0.05, `naval_invasion_prep_speed` 0.20 | Volgan; removed if Volgan goes to war with Nan |

### Events (namespace `zin_regional_nan`)

| # | Key | Title | To | Trigger | Options |
| ---: | --- | --- | --- | --- | --- |
| 1 | `warlord_speaks` | The Warlord Speaks | Nan | The Warlord of Vez Nan | "The captains obey." (political_power 25) / "The isles are heard." (stability 0.03) |
| 2 | `tales_of_the_stair` | Tales of the Stair | Nan | Tales of the Stair | One option. Text: inland of Vez Nan a stair goes down into the dark; long ago a stranger from the north went down it and came back up; the elders do not say what he carried, and no one in Nan has gone to look |
| 3 | `nan_offers_pilots` | Pilots from Nan | Volgan or Mirolon | Pilots for Nafeher / for the Wardens | Volgan: "Take the pilots." (add idea `zin_regional_nan_pilots_of_nafeher`; non-aggression with Nan; Nan +50 political power; Nan flag `zin_dominion_tributary_friend`; AI 70) / "Nafeher needs no ships." (AI 30). Mirolon: "Take their hands." (Nan flag `zin_mirolon_league_friend`; opinion +15 both ways; AI 70) / "Nan sells to anyone." (AI 30) |
| 4 | `ships_for_the_exiles` | Ships for the Exiles | Mirolon | The Exiles' Road | "Carry our people north." (Mirolon manpower +3,000; Mirolon opinion of Nan +20; AI 100) |
| 5 | `an_answer_from_the_isles` | An Answer from the Isles | Nan | Reply to 3 and 4 | Result text |

### Historical AI route

1748–1750: warlord_of_vez_nan, storm_pilots, island_warbands, dumars_captains, the_island_lords, black_reefs_charted, harbour_of_nan, tales_of_the_stair. 1750–1754: one_warlord, the_storm_is_our_wall, between_storm_and_sea, pilots_for_no_one, the_warlords_neutrality, watchers_on_the_rim, reef_raiders, peninsula_forts, nan_and_vez_nan. 1755 onward: war branch only if attacked; the rest.

---

## Implementation

### Files (per tree)

| Path | Content |
| --- | --- |
| `docs/design/focus/regional_<name>.json` | Tree data, `"tier": "regional"` |
| `common/national_focus/zin_regional_<name>.txt` | Compiled tree |
| `common/ideas/zin_focus_regional_<name>.txt` | Spirits (Nan's file also holds `zin_regional_nan_pilots_of_nafeher`, given to Volgan) |
| `events/zin_regional_<name>.txt` | Events (effect-triggered only) |
| `common/scripted_effects/zin_regional_<name>.txt`, `common/scripted_triggers/zin_regional_<name>.txt` | Below |
| `common/opinion_modifiers/zin_regional_olen.txt` | `healers_sent` (+15, decay 0.25) |
| `common/characters/zin_regional_<name>.txt` | Advisors and generals |
| `localisation/english/zin_focus_regional_<name>_l_english.yml` | Text |

### Tree-declared scripted triggers and effects

| Name | Kind | Tree | Does / true when |
| --- | --- | --- | --- |
| `zin_regional_<tree>_oath_at_least` (`value`) | trigger | Nezer, Demon, Dolon | `check_variable = { zin_dominion_oath >= $value$ }` |
| `zin_regional_<tree>_gain_autonomy` (`value`) | effect | Nezer, Demon, Dolon | `add_autonomy_ratio = { value = $value$ }` if ROOT is a subject |
| `zin_regional_<tree>_crown_free` | effect | Nezer, Demon, Dolon | If ROOT is Volgan's subject: autonomy +0.5. If free: add the tree's `own_crown` spirit; stance stays `zin_shadow_dread` |
| `zin_regional_dolon_send_arms` | effect | Dolon | `send_equipment = { target = Volgan type = zin_arms_equipment amount = 500 }` |
| `zin_regional_dolon_is_coastal`, `zin_regional_olen_is_coastal` | trigger | Dolon, Olen | `any_owned_state = { is_coastal = yes }` |
| `zin_regional_<tree>_opinion` | effect | Olen | Tree opinion modifier helper |

### Names other systems read or this spec needs

| Name | Kind | Owner | Use |
| --- | --- | --- | --- |
| `zin_dominion_own_road` | country flag (proposed) | set by the Volgan spec's `zin_dominion.22` option "seek its own road" | Opens the sworn realms' branch D before oath falls below 40 |
| `zin_dominion_tributary_friend` | country flag (proposed) | set by Olen's and Nan's events to Volgan, and by the shared Dead Lands tree | Volgan's AI does not plan war on this realm before `zin_volgan_marches`; after the march it offers client-crown terms rather than conquest (dependency on the Volgan spec's AI) |
| `zin_mirolon_league_friend` | country flag (Mirolon tree) | set here by Mirolon's answers | Mirolon's *The Warden League* invites the realm |
| `zin_dominion_oath` | variable (Volgan spec) | read and changed through `zin_volgan_add_oath` | Sworn realms' branches |

### Raw blocks

None in the trees; `check_variable` and `send_equipment` live in tree-declared scripts.

### Icons

Catalog keys only; none new. Event pictures: `dead_lands_storm` (storm and rumour events), `generic_court` (court events), `grave_muster` (silence events, no figure), `mirolon_passes` (friendship events with Mirolon), `generic_sea` (Nan's ships).

## AI

- Historical routes above apply under `check zin_rules_is_historical`; PLAUSIBLE halves the "hist" factors' distance from 1; FREE uses base weights.
- **Sworn realms** keep their oath: each takes its oath focuses in 4A 1748–1750, and the "own road" head stays at weight 0 until it becomes available. They take the war head the month Volgan's war begins. After the body breaks the aftermath choice follows the oath (×3 toward the side the oath favours), which agrees with the Volgan spec's `zin_dominion.18`.
- **Olen** takes *Stand with the Wardens* (hist ×2) and joins the Warden League if Mirolon forms it; **Nan** takes *Pilots for No One* (hist ×3).
- **AI strategies** (`common/ai_strategy/zin_regional_dead.txt`): sworn realms `befriend` Volgan 50; Olen `befriend` Mirolon 30; Nan none.

## Acceptance

1. Each tree compiles with its focus count, unique positions and every focus below its prerequisites; the compiler and the HOI4 Agent Tools focus inspector pass.
2. On 1 Thaw 4A 1748 no focus available to the five countries declares war, creates a war goal or claim; no sworn realm's focus touches `zin_footholds`.
3. A 12-year historical run: Demon, Dolon and Nezer's oaths stay at 50 or more until 4A 1755; each sworn realm takes its war head within 30 days of Volgan's war on Mirolon; Olen takes *Stand with the Wardens*; Nan takes *Pilots for No One*.
4. After `zin_volgan_body_destroyed`, each sworn realm's aftermath head becomes available and no `zin_regional_*` text states that Volgan's spirit died, survived or lives on (localisation check for "is dead", "destroyed forever", "survives", "lives on").
5. *Open the Gate for Nafeher*, *Envoys Below*, *The Bargain of This Reign* and *Fire at the Gate* change `zin_nether_pact` through `zin_volgan_add_nether_pact` only.
6. Olen's event 3 sets `zin_dominion_tributary_friend`; Volgan's AI declares no war on Olen before `zin_volgan_marches` in a test with Volgan's war open early (FREE rule).
7. No text names Afrit, names the King of Demons, states Roka's fate or places Dardan.
8. Every modifier in the spirit tables exists in the modifier documentation; every called effect and trigger exists in the staged files.

## Open questions

1. **Who owns the Nether?** Demon's tree speaks of "the Nether's edge" and the Nether's court without owning it. If the owner gives the Nether to a separate demon realm, Demon's branch C should become diplomacy with that country.
2. **Vez Nan and the Abyss.** The map's state "Vez Nan / Abyss" lies in Volgan's realm, while the roster says Nan holds Nan and Vez Nan. Which is right, and does Nan border the Abyss?
3. **The sworn realms after the body breaks.** This spec expects Demon to stay with the Steward and Nezer to go its own way, by their oaths. Should the historical path fix this?
4. **Olen's Holy Breeze.** May Olen keep a faith of the sea wind (proposed), and may the Houses of the First Light work beside it?
5. **Nan's storm pilots.** May Nan's men sail the storm belt that wrecks other fleets (the magic spec spares Dead Lands realms)?
6. **Dolon's Dead Sea.** Is "of the Dead Sea" in Morvath's name a place (a salt inland water, proposed) or only an epithet?
