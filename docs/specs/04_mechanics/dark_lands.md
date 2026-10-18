# The Dark Lands

**Status:** Draft. **Priority:** 3. **Phase:** 3.

## Purpose

The Dark Lands lie between the North Lands and the Middle Lands, across narrow straits on either side. They hold Goldoroth, the orc kingdom that wants the whole region; Dondor, the human kingdom that leads the Dark Sea Accord against it; and a crowd of orc, goblin and troll holds and human freeholds that answer to nobody. Volgan's agents court them all. Most still answer only to themselves.

This mechanic makes the region play as an **armed peace that can break**. At the start nobody is at war. Goldoroth must feed its restless war-clans without starting a war it cannot win. It bends the free holds with gifts, fear and the Iron Yoke. Dondor keeps the Accord alive with beacons, blood-prices and friends across the straits. The holds choose between Cocanoor, the Accord, the South and their own Free Moot. When the War of the Last Crowns begins, or a hold defies Goldoroth, the region's own wars open: the war for the holds, the war for the Sea of Darkness, and Goldoroth's choice between independence and Volgan.

The mechanic serves the major tree of [Goldoroth](../05_focus_trees/major/goldoroth.md), the tier B trees of Dondor, Bordon, Dreson, Dulundur, the Troll Forest and Blackton (`regional_*`, [01_tiers_and_coverage.md](../05_focus_trees/01_tiers_and_coverage.md)), and the shared tree `shared_dark_lands`. It reads and writes the Volgan mechanic's Dark Lands pact ([volgan_southern_dominion.md](volgan_southern_dominion.md), section 7) and Lerendor's lean on the Dark Shore ([lerendor_narrow_strait.md](lerendor_narrow_strait.md), section 9).

## Lore basis

### Established (lore vault)

| Fact | Source |
| --- | --- |
| The Dark Lands lie between Lerendor and the Middle Lands across narrow straits. They contain Bordon, Dreson, Dulundur, the Troll Forest, Dondor, Goldoroth and the Sea of Darkness. | *Erdae and Its Regions* |
| Goldoroth is an expansionist Dark Lands power, seat Cocanoor (working), no listed alliance, rival Dondor. | *Great Powers and Relations* (working table) |
| Dondor is the northern Dark Lands kingdom, seat Notbuton (working); with Belonton it forms the **Dark Sea Accord**; rival Goldoroth. | *Great Powers and Relations* (working table) |
| Bordon, Dreson, Dulundur and the Troll Forest must stay separate polities on the map. | *Great Powers and Relations* |
| Not all Dark Lands monsters serve Volgan. The Dark Lands have independent men, orcs, goblins, trolls, ogres, giants and demons under separate rulers. | *Kingdoms Factions and Conflicts*, *Peoples of Erdae* |
| The independent Dark Lands are not automatically Volgan's subjects. His authority does not extend to independent Dark Lands factions. | *Volgan*, *Volgans Dead Lands* |
| Dondor Brutes are a people of men. Orcs, goblins, trolls and ogres are distinct peoples; monster societies are independent and diverse. | *Peoples of Erdae* |
| In the First Age Volgan opened contacts with powers in the Dark Lands; parts of the Dark Lands joined the Grand Alliance against him. | *The First Age of Erdae*, *Grand Alliance* |
| In the Second Age the Dark Lands were never one nation; orcs and goblins do not serve one master by nature; some supported Elzon and others resisted him. | *The Second Age of Erdae* |
| In the Fourth Age the great invasions of orcs and goblins had ceased. | *The Fourth Age of Erdae* |
| Late in the Fourth Age Zol's forces move from the black north "through islands and straits" toward the settled kingdoms. | *The Fourth Age of Erdae*, *War of the Last Crowns* |
| The start: the Golden King reigns, Eindil has not appeared, Afrit is unrevealed, Erdae seems at peace. | owner, 18 October 2026 |

### Proposed

- **Vault proposals** (*Fourth Age Chronology*): orc warlords unite the inner Dark Lands as Goldoroth about 4A 1450, and its wars with Dondor begin then. *The First Age of Erdae* proposes Rovek of Dondor, a Dark Lands leader of the Grand Alliance.
- **Earlier specs** (proposed): Goldoroth and Dondor in an armed peace with border raids ([02_lore/01_start_situation.md](../02_lore/01_start_situation.md)); the rulers Warking Gorduth of Cocanoor, Bredo the Fire-Speaker, Sungor of the Volcano Clans, Warchief Britag, King Dunmar of Dondor, Chief Belon, Troy the Old, Chiefs Bordag, Dresk and Dulgash, Lord Haclton of Blackton ([02_lore/02_characters.md](../02_lore/02_characters.md)); the Dark Sea Accord's faction rules and `zin_cb_orc_raids` ([03_gameplay/03_diplomacy_and_factions.md](../03_gameplay/03_diplomacy_and_factions.md)); `zin_volgan_pact` and the envoys ([volgan_southern_dominion.md](volgan_southern_dominion.md)); Lerendor's lean on the Dark Shore ([lerendor_narrow_strait.md](lerendor_narrow_strait.md)).
- **This spec** (all proposed): border tension, the Accord's resolve, the horde's temper and the four clan blocs (the Volcano Clans, the Iron Clans, the War-Clans and the Goblin Warrens), sway and the Iron Yoke, tributary holds, Goldoroth's unity, the Free Moot of the holds, the Fire-Mountain above Cocanoor, sea mastery, shore tolls, the Dark Straits as named sites, the new characters Forge-Mistress Ulgra, Snikkit Many-Knives and Rask Black-Sail, and every number and date.

### Kept open

- The **status of the independent Dark Lands** in earlier ages beyond the established lines (the vault leaves it to future decisions). Texts speak of old wars and old gifts, never of settled treaties.
- **Which holds are goblins or ogres** rather than orcs: the owner assigns them ([00_foundation/03_peoples.md](../00_foundation/03_peoples.md)). Until then texts say "orc and goblin holds" for the region and never call a named hold goblin.
- **Where Dardan lies**: the Dark Lands chronicles may "remember the price paid at Dardan"; no text places the battle.
- **The relationship of Zol's dead and Volgan's dead**: the Dark Lands texts describe only what the holds see.
- **The exact place of the straits** and whether either is Lerendor's Narrow Strait (see Open questions).

### Rules this spec keeps

- At the start nobody in the Dark Lands is at war. No Dark Lands war can begin before 1 Deepwinter 4A 1749 (`1749.1.1`). Goldoroth and Dondor cannot go to war before the War of the Last Crowns, Volgan's march, or a casus belli earned through raids while the Gathering Dark is at least 25.
- Raids are decisions and events, never declared wars. Border clashes are engine border wars, which are not wars (`has_war` stays false).
- Nothing names Afrit. Afrit's footholds in orc, goblin and troll realms start at 0 ([afrit_hidden_council.md](afrit_hidden_council.md)); this spec never raises them.
- Volgan's envoys are named as envoys from Nafeher. No Dark Lands text tells the size of Volgan's hosts while his veil holds.
- Fire does not end Zol's dead. Dark Lands texts may say fire "breaks their shapes"; only potent magic ends them (established).

## Design

### The region at the start

24 countries, 47 states (roster). Values are start targets.

| Country | States | People | Stance | Role at the start | Sway | Volgan pact | Leren lean |
| --- | ---: | --- | --- | --- | ---: | ---: | ---: |
| Goldoroth | 6 | orcs (minor: trolls) | Conquering Host | Orc kingdom of the inner Dark Lands | — | 0 | −20 |
| Dondor | 1 | men (Dondor Brutes) | Warlordship | Human kingdom; leads the Dark Sea Accord | 0 (never) | 0 | 10 |
| Belonton | 1 | orcs | Tribal Chieftaincy | Southern confederacy; Dondor's ally in the Accord | 5 | 0 | 0 |
| Blackton | 5 | men | Freeholds | Free human towns of the coast | 0 (cap 40) | 0 | 10 |
| Dulundur | 4 | orcs | Tribal Chieftaincy | The largest free hold; proud | 15 | 0 | 0 |
| Bordon | 1 | orcs | Tribal Chieftaincy | Free hold | 25 | 0 | 0 |
| Dreson | 1 | orcs | Tribal Chieftaincy | Free hold | 25 | 0 | 0 |
| Troll Forest | 1 | trolls | Tribal Chieftaincy | Troll realm under Troy the Old | 10 | 0 | 0 |
| Dun | 1 | orcs | Tribal Chieftaincy | Eastern crown; swing power on the dark seas | 10 | 0 | 0 |
| 15 other holds (The Darks, Colost, Dunbulinor, Fondor, Bold, Dark Gate, Beriath, Britadon, Gord, Gull Kingdom, Lestern Isles, Sungodor, The Doltu, Wild Lands, Zuriath) | 1–4 | orcs | Tribal Chieftaincy | Free holds | 20 | 0 | 0 |

The builder adds +10 sway to every hold that borders Goldoroth at the start (not Dondor or Blackton). Leren lean exists only on coastal countries ([lerendor_narrow_strait.md](lerendor_narrow_strait.md)).

### Phases

| Phase | Historical (proposed) | What happens | Ends when |
| --- | --- | --- | --- |
| 1. The armed peace | 4A 1748 to 1755 | Raids, gifts, tribute, beacons, envoys from the south; no war | `zin_war_of_last_crowns`, `zin_volgan_marches`, or a casus belli is used |
| 2. The war for the Dark Lands | 1755 to 1757 | Goldoroth takes the defiant holds; the Accord stands or breaks; sworn holds open Volgan's northern front | Volgan's body breaks, or Goldoroth's wars end |
| 3. The dead on the shore | from `zin_zol_rising` | The coasts of the northern strait watch for Zol's dead | `zin_zol_withdrawn` |
| 4. Aftermath | 1757 to 1760 | Sworn holds lose their master; Goldoroth consolidates | End of game |

### 1. The map: seats, sites, the sea and the straits

Scripts find places through site triggers generated from the key sites table ([01_map/02_key_sites.md](../01_map/02_key_sites.md)), never through state numbers. New sites (all proposed):

| Site trigger | Scope | What | Map requirement |
| --- | --- | --- | --- |
| `zin_is_site_cocanoor` | state | Goldoroth's seat | Rename the capital victory point to Cocanoor (map accuracy S6) |
| `zin_is_site_notbuton` | state | Dondor's seat | Rename to Notbuton (S7) |
| `zin_is_site_goldoroth_march` | state | Goldoroth's states that border Dondor or Belonton at the start | Generated list |
| `zin_is_site_sea_of_darkness_coast` | state | Every state with a coastal province on the Sea of Darkness sea region(s) | The sea region named "Sea of Darkness" (map accuracy N1) |
| `zin_is_site_dark_strait_north` | state | Both shores of the strait(s) between the Dark Lands and the North Lands | Owner confirms the place (Open question 1) |
| `zin_is_site_dark_strait_south` | state | Both shores of the strait(s) between the Dark Lands and the Middle Lands | as above |
| `zin_is_site_dark_strait_shore` | state | The Dark Lands side of either strait (subsets `_north_shore`, `_south_shore`) | Generated |
| `zin_is_site_dark_strait_far_shore` | state | The far side of either strait (subsets `_north_far`, `_south_far`) | Generated |
| `zin_is_site_troll_forest` | state | The Troll Forest's state | exists |
| `zin_is_dark_lands_state` | state | Every state whose owner had `zin_region_dark_lands` at the start (frozen collection, 47 states) | Diplomacy spec's region collections |

The **Fire-Mountain** above Cocanoor (proposed) is not a state. It is a Cocanoor flavour site for events and icons.

If the map defines a land crossing (adjacency) over a strait, armies may walk it; otherwise they cross by sea. This spec works either way. The map phase records which straits are crossings.

### 2. The armed peace

**Border tension.** `zin_dark_border_tension` (global, 0 to 100, start 35) measures how near Goldoroth and the Dark Sea Accord are to open war. It is the regional thermometer every Dark Lands tree reads.

| Band | Range | Meaning |
| --- | --- | --- |
| Quiet | 0–29 | Raids are rare; the Accord's resolve slips |
| Uneasy | 30–59 | The ordinary armed peace |
| Bloody | 60–79 | Border clashes are possible; the Accord stiffens |
| On the brink | 80–100 | Each raid can give a casus belli (below) |

**Monthly change:** −0.5 while above 30 and no raid on an Accord member in the last 90 days; +0.5 while `zin_gathering_dark` ≥ 40.

**One-off changes:** listed with each decision, focus and event. All go through `zin_dark_add_border_tension` (clamped).

**Raids** (decision category `zin_dark_raids`, Goldoroth only, opened by the tree's "The Armed Peace", flag `zin_goldoroth_raids_open`). A raid is a 30-day mission that ends in event `zin_dark.10`; it never declares war.

| Decision | Requires | Cost | On completion | Cooldown |
| --- | --- | --- | --- | --- |
| Raid the Dondor Marches | Not at war with Dondor; no border war with Dondor | 25 PP | Goldoroth: 150 `zin_arms_equipment`, 10 army experience, temper −8, War-Clans favour +5. Tension +8. Dondor gets `zin_dark.11`. Gathering Dark +0.25 (raids add at most +3 in a game, counted in `zin_dark_raid_dark_added`) | 90 days (60 with `zin_goldoroth_swift_raids`) |
| Raid a Free Hold [target] | Target: an independent Dark Lands country bordering Goldoroth, not its tributary, not at war | 15 PP | 100 `zin_arms_equipment`; temper −5; target sway +5 if Goldoroth has at least three times the target's divisions, else −5; target gets opinion `zin_dark_raided` (−15) and `zin_dark.12`; tension +2 | 90 days per target |
| Corsair Raid [target] | Flag `zin_goldoroth_corsairs`; target owns a `zin_is_site_sea_of_darkness_coast` state and is an Accord member, Blackton or a free hold | 25 PP | 100 `zin_arms_equipment` and 25 PP; temper −5; tension +6 if the target is in the Accord; if the target is Blackton, Lerendor's opinion of Goldoroth −10; target gets `zin_dark.13` | 120 days |
| Clash on the March | Flag `zin_goldoroth_clash_open`; tension ≥ 60; date ≥ 1749.1.1; not at war with Dondor; no border war | 50 PP, 10 command power | `zin_dark_start_border_clash` (target Dondor) | 365 days |

Every raid sets country flag `zin_goldoroth_fed` for 90 days (it stops temper growth, section 4) and target flag `zin_dark_raided_recently` for 365 days.

**The victim's answer** (`zin_dark.11` for Dondor, `zin_dark.12` for a hold, `zin_dark.13` for a corsair target):

| Option | Effect | AI weight |
| --- | --- | --- |
| "Light the beacons." | Accord resolve +3 (holds: opinion of Dondor +5) | 50 |
| "Pay the blood-price." | Target −40 PP; tension −15; Goldoroth +25 PP (+50 and temper −5 with `zin_goldoroth_blood_price`); Goldoroth opinion of target +10 (`zin_dark_blood_price_paid`) | 30; ×2 if tension ≥ 50 |
| "Answer in kind." | Target war support +0.03; tension +5 | 20; ×2 for Dondor's AI when tension ≥ 70 |

**Casus belli from raids.** When a raid on an Accord member resolves while `zin_gathering_dark` ≥ 25 and tension ≥ 60, `zin_diplo_grant_cb` gives `zin_cb_orc_raids` (365 days) to Goldoroth against the victim and to the victim against Goldoroth. This is the "raid event" of the diplomacy spec's casus belli table; this spec adds the tension condition.

**Border clashes.** `zin_dark_start_border_clash` (args `target`) calls `start_border_war` between a `zin_is_site_goldoroth_march` state and the target's bordering state: `change_state_after_war = no` (always before `zin_war_of_last_crowns`), combat width 40, minimum 21 days, 3 provinces each side. Callbacks:

| Callback | Event | Effect |
| --- | --- | --- |
| Goldoroth wins | `zin_dark.16` | Goldoroth +50 PP, temper −20; Dondor stability −0.05; tension +10 |
| Goldoroth loses | `zin_dark.17` | Goldoroth temper +10, War-Clans favour −10; Accord resolve +10 |
| Cancelled | `zin_dark.18` | Tension +5 |

Each clash adds +1 to the Gathering Dark and fires the regional news `zin_dark.15` "Fire on the March" for every Dark Lands country, Lerendor and Aenor.

**When war can begin.** Scripted trigger `zin_goldoroth_war_open` is true when any of these holds:

- global flag `zin_war_of_last_crowns` or `zin_volgan_marches`;
- Goldoroth holds a live `zin_cb_hold_defiance` or `zin_cb_orc_raids`, and the date is at least 1750.1.1;
- Goldoroth is already at war.

`zin_goldoroth_may_war_dondor` is true when `zin_war_of_last_crowns` or `zin_volgan_marches` is set, or Goldoroth holds `zin_cb_orc_raids` against Dondor; and Goldoroth has no truce against the dead with Dondor (`zin_dark_truce_against_dead`, section 9).

A Dark Lands war declared while `zin_gathering_dark` < 25 still brings the diplomacy spec's peace-breaker penalty.

### 3. The Dark Sea Accord

The Accord is one of the seven working factions (Dondor leads, Belonton is a member; template `zin_faction_dark_sea_accord`; joining rules: Dark Lands, not bound by the Elven Refusal, not Shadow). Belonton is an orc confederacy in a human-led Accord (roster): the Dark Lands do not split by people.

**Resolve.** `zin_dark_accord_resolve` (global, 0 to 100, start 40): how firmly the Accord holds together.

| Source | Change |
| --- | --- |
| Monthly, tension ≥ 60 | +0.3 |
| Monthly, tension < 30 ("the danger seems far") | −0.2 |
| Monthly, any member at war with Goldoroth | +0.5 |
| Monthly, each member beyond two | +0.2 (max +0.6) |
| Light the Sea Beacons | +5 |
| A raid answered with the beacons | +3 |
| A new member | +5 |
| A great power guarantees Dondor (`zin_dark.30`, `zin_dark.31`) | +10 |
| Goldoroth's unity first reaches 50 | +10 |
| Goldoroth's "Sow Doubt in the Accord" | −8 |
| Belonton takes Cocanoor's gold (`zin_goldoroth.8`) | −3 |
| A member capitulates | −15 |

**Effect.** Dynamic modifier `zin_dark_accord_shield` on every member, scaled by resolve *R*:

| Modifier | Value | At R = 100 |
| --- | --- | ---: |
| `army_defence_factor` | 0.001 × R | +0.10 |
| `army_core_defence_factor` | 0.001 × R | +0.10 |
| `war_support_factor` | 0.0005 × R | +0.05 |

**Thresholds.** R ≥ 60 sets global flag `zin_dark_accord_holds` while true (Goldoroth's AI weighs it). R < 20 fires `zin_dark.22` "The Accord Frays" for every member except the leader: stay (opinion of Dondor +10) or leave the faction (AI chance 100 − opinion of Dondor).

**Accord decisions** (category `zin_dark_accord`, visible to the Accord's leader, normally Dondor):

| Decision | Requires | Cost | Effect | Cooldown |
| --- | --- | --- | --- | --- |
| Light the Sea Beacons | — | 25 PP | Resolve +5 | 180 days |
| Pay the Blood-Price | Tension ≥ 40 | 40 PP | As the victim's option above | 365 days |
| Invite [hold] into the Accord | Target: Dark Lands country, in no faction, not a subject, not Shadow, sway < 40, Volgan pact ≤ 1 | 25 PP | `zin_dark.20` to the target | 180 days per target |
| Muster the Brutes | Tension ≥ 60, or at war with Goldoroth | 50 PP | Timed idea `zin_dark_brutes_mustered` (180 days) | 365 days |
| Petition Parim | Once per game | 25 PP | `zin_dark.30` to Aenor | — |
| Call on the North | Lerendor exists and is not at war with Dondor | 25 PP | `zin_dark.31` to Lerendor | 365 days |

**Invitation** (`zin_dark.20`). Accept: `add_to_faction`; resolve +5. AI chance: 20 + tension ÷ 2 + max(0, unity − 25) ÷ 2 − sway; ×1.5 if `zin_dark_raided_recently`; ×0.75 if a Free Moot member; ×0 if Volgan pact ≥ 2 or Shadow.

**Parim's answer** (`zin_dark.30`, Aenor):

| Option | Effect | AI weight |
| --- | --- | --- |
| "The Golden King sends his blessing." | Dondor +10 PP | 100 × (1 + `zin_court_corruption` ÷ 50) |
| "Aenor guarantees Dondor." | `give_guarantee` Dondor; resolve +10 | 10 + tension ÷ 2 |
| "Invite Dondor into the Lost Cause." | Fires the diplomacy spec's invitation `zin_diplo.23` for Dondor | 20 + `zin_lost_cause_strength` ÷ 2 |

On the historical path the Golden Court sends its blessing.

**Sonargur's answer** (`zin_dark.31`, Lerendor): "Ships for Notbuton." (`give_guarantee` Dondor; Leren lean on Dondor +10; resolve +10; AI 30 + Dondor's lean ÷ 2, ×2 if Lerendor completed Friends of the Dark Sea Accord, ×0 if it completed Bargain with Goldoroth) / "Words, not ships." (lean −5; AI 50). Lerendor's own tree also has The Shield of Dondor; a second guarantee does nothing more.

### 4. Goldoroth's horde

Goldoroth is a kingdom of clans. The Warking rules as long as the clans are fed and heard.

**Temper.** `zin_goldoroth_temper` (Goldoroth, 0 to 100, start 55): how restless the war-clans are.

| Source | Change |
| --- | --- |
| Monthly, at peace and no `zin_goldoroth_fed` | +0.6 |
| Monthly, War-Clans favour ≥ 70 | +0.3 more |
| Monthly, `zin_goldoroth_ash_rites` | −0.2 |
| Monthly, at war | −1.5 |
| Raids, contests, clashes, feasts, moots | Listed with each |

| Temper | Effect |
| --- | --- |
| ≤ 25 | Spirit `zin_dark_settled_hearths` |
| ≥ 70 | Spirit `zin_dark_restless_clans`; event `zin_dark.43` "The Clans Grow Restless" (once per crossing) |
| ≥ 90 | Event `zin_dark.42` "The Clans Demand Blood" (once per crossing) |

A crossing re-arms when temper falls 10 below its threshold (flags `zin_goldoroth_temper_70`, `zin_goldoroth_temper_90`).

`zin_dark.42` options: "Then let them raid." (a free Raid the Dondor Marches resolves now through `zin_dark.10`; tension +10; AI 50) / "Blood at Cocanoor." (−50 PP; temper −25; AI 40) / "The Warking says no." (stability −0.08; War-Clans favour −15; AI 10).

**The four clan blocs** (proposed). Each has a favour variable, 0 to 100.

| Bloc | Variable | Start | Chief (character) | Wants |
| --- | --- | ---: | --- | --- |
| The Volcano Clans | `zin_goldoroth_favour_volcano` | 55 | Sungor of the Volcano Clans | Rites, omens, the Fire-Mountain honoured |
| The Iron Clans | `zin_goldoroth_favour_iron` | 50 | Forge-Mistress Ulgra | Forges, trade, tithes |
| The War-Clans | `zin_goldoroth_favour_war` | 60 | Warchief Britag | Raids, war, spoils |
| The Goblin Warrens | `zin_goldoroth_favour_warrens` | 35 | Snikkit Many-Knives | A voice at the moot; a share of the spoils |

- The Warrens lose 0.3 favour a month unless Goldoroth has spirit `zin_goldoroth_warrens_heard`.
- Favour ≥ 75 gives the bloc's boon spirit (`zin_dark_boon_<bloc>`); favour ≤ 25 gives its sulk spirit (`zin_dark_sulk_<bloc>`). Both are added and removed by the monthly pulse.
- Favour ≤ 10, date ≥ 1749.1.1, Goldoroth at peace, and no flag `zin_goldoroth_master_of_clans`: event `zin_dark.44` "A Challenge at the Moot". The bloc's chief challenges the Warking.

| Option | Effect | AI weight |
| --- | --- | --- |
| "Meet the challenge." | Hidden roll: the Warking wins with chance 50 + War-Clans favour ÷ 4 (at most 75). Win: `zin_dark.46` "The Warking Stands" (stability +0.05; that bloc's favour set to 35). Loss: `zin_dark.45` "A New Warking" (`zin_goldoroth_crown_heir`) | 40 |
| "Buy their peace." | −100 PP; that bloc's favour +25 | 60 if PP ≥ 100, else 0 |

`zin_goldoroth_crown_heir` kills the reigning Warking and makes a new one: the chief of the bloc named heir by `zin_goldoroth.2` (flag `zin_goldoroth_heir_<bloc>`), or else the challenger. The new Warking keeps the Conquering Host stance. Stability −0.15; every other bloc −10 favour; the Warking's own bloc +25.

**Moot decisions** (category `zin_dark_horde`, Goldoroth, opened by "The Warking of Cocanoor", flag `zin_goldoroth_moot_open`):

| Decision | Cost | Effect | Cooldown |
| --- | --- | --- | --- |
| Hold the Great Moot | 75 PP | `zin_dark.40`: one option per bloc (that bloc +15, the others −5); temper −10 | 365 days (180 with `zin_goldoroth_centralised`) |
| Feast the Clans | 50 PP; removes 300 `zin_arms_equipment` | Every favour +5; temper −5 | 180 days |
| Blood Contest | 25 PP (15 with `zin_goldoroth_contests`) | Temper −12 (−15 with contests); 5 army experience; War-Clans +3 | 120 days |

### 5. Sway, the Iron Yoke and unity

**Sway.** `zin_goldoroth_sway` (each Dark Lands country except Goldoroth, 0 to 100): how far that country bends toward Cocanoor. Start values are in the region table.

- **Caps:** Dondor 0 (Goldoroth takes Dondor only by war); Blackton 40; Accord members 30; countries at Volgan pact 3: 20.
- **Gains are halved** for a target at Volgan pact 2 or in the Free Moot.
- **Monthly drift:** independent countries −0.25 (not below their start value − 10). Tributaries +0.5 with `zin_goldoroth_light_yoke`, +0.25 otherwise.

**Sway decisions** (category `zin_dark_sway`, Goldoroth, flag `zin_goldoroth_sway_open`):

| Decision | Requires | Cost | Effect | Cooldown |
| --- | --- | --- | --- | --- |
| Send Gifts of Black Iron [target] | Target not at war with Goldoroth | 25 PP (15 with `zin_goldoroth_tallymen`); removes 200 `zin_arms_equipment` | Sway +10; target opinion `zin_dark_gifts` (+10) | 120 days per target |
| Bind by Marriage of Chiefs [target] | Target is an orc, goblin or troll realm | 50 PP | Sway +15 | once per target |
| Show the Host [target] | Goldoroth has at least three times the target's divisions | 25 PP | Sway +8; target opinion −5; temper −3; tension +2 if the target borders Dondor | 180 days per target |
| Offer the Iron Yoke [target] | Sway ≥ 50 (≥ 40 with `zin_goldoroth_yoke_cheap`); target in no faction; not at war; date ≥ 1748.9.1 | 50 PP | `zin_dark.50` to the target | 365 days per target |
| One Fire Under Cocanoor [tributary] | Tributary for 365 days and sway ≥ 80 (180 days and 70 with `zin_goldoroth_hard_yoke`) | 100 PP | `annex_country`; news `zin_dark.52` for the Dark Lands | — |
| Hunt the Southern Envoys [target] | Flag `zin_goldoroth_hunt_open`; target's Volgan pact ≥ 1 and (sway ≥ 30 or tributary) | 50 PP | See section 7 | 180 days |

**The Iron Yoke** (`zin_dark.50`, to the hold):

| Option | Effect | AI chance |
| --- | --- | --- |
| "Bend the knee to Cocanoor." | `zin_goldoroth_take_tributary`: Goldoroth `puppet`s the hold, `set_autonomy` to `zin_autonomy_tributary_hold`; the hold gets spirit `zin_dark_tributary_hold` and starts counting `zin_dark_tribute_days`; Goldoroth gets `zin_dark.51` | sway − 20 + unity × 0.3; +10 with `zin_goldoroth_light_yoke`; −20 if a Free Moot member; ×0.5 at Volgan pact 2; ×0 at pact 3 or in the Accord |
| "Our hall answers to no one." | Sway −10; the hold gets country flag `zin_dark_refused_yoke`; Goldoroth's opinion modifier `zin_dark_yoke_refused` (−20); if date ≥ 1750.1.1, `zin_diplo_grant_cb` gives Goldoroth `zin_cb_hold_defiance` against the hold for 365 days | the rest |

**Tributary holds.** Autonomy state `zin_autonomy_tributary_hold` "Tributary Hold": `min_freedom_level = 0.4`, `can_not_declare_war = yes`, `can_decline_call_to_war = no`, `autonomy_manpower_share = 0.2`, `extra_trade_to_overlord_factor = 0.2`. A tributary that reaches full freedom leaves the yoke; its sway falls by 30.

**Unity.** `zin_goldoroth_unity` (Goldoroth, 0 to 100): 100 × Dark Lands states (`zin_is_dark_lands_state`) owned by Goldoroth or its subjects ÷ 47. Recomputed monthly. Start about 13.

| Unity | Effect |
| ---: | --- |
| 25 | Focus "Lord of the Inner Dark" can be taken |
| 30 | Holds may call the Free Moot (section 6) |
| 50 | News `zin_dark.60` "Cocanoor Rises" (Dark Lands, Lerendor, Aenor), once; Accord resolve +10; focus "Overlord of the Holds" |
| 75 | Focus "The Dark Lands Are One" (also needs Dondor gone or a Goldoroth subject) |

### 6. The free holds

The holds are free (established). The mechanic gives them three tools of their own.

**The Free Moot** (proposed: a league of the holds, not one of the seven factions). Decision "Call the Free Moot" (category `zin_dark_free_holds`):

- **Who:** an independent orc, goblin or troll Dark Lands country, not Goldoroth, not a subject, Volgan pact ≤ 2, not in the Southern Dominion.
- **When:** no Moot exists, and Goldoroth's unity ≥ 30, or Goldoroth holds `zin_cb_hold_defiance` against any hold, or Goldoroth is at war with a hold.
- **Cost:** 50 PP. Sets global flag `zin_dark_free_moot`, the founder's flag `zin_dark_moot_member`, and sends `zin_dark.70` "The Free Moot Is Called" to every eligible hold. Accept: member flag, spirit `zin_dark_free_moot`, opinion `zin_dark_moot_kin` (+15) with every member. AI chance: 30 + (unity − 30) + 20 if `zin_dark_raided_recently` − sway ÷ 2; ×0 for a tributary.
- **The call:** when a country that is not a member declares war on a member, every other member gets `zin_dark.71` "The Moot Rides": "The Moot rides." (`add_to_war` on the defender's side) / "Not this time." (counter `zin_dark_moot_refusals` +1; at 2 the member leaves). AI: ride 60 if bordering the attacker, else 30.
- **Ending:** a member may leave by decision "Leave the Free Moot". When fewer than two members remain, `zin_dark.72` "The Moot Breaks" clears `zin_dark_free_moot`. It can be called again.

**The Troll Forest.** Troy the Old's realm (proposed ruler). Spirit `zin_dark_forest_nobody_enters` (Troll Forest, permanent): `army_core_defence_factor` 0.15, `attrition` −0.1. Static state modifier `zin_dark_troll_woods` on its state: `local_supplies` −2. Decision "Hire the Troll-Kin" (category `zin_dark_free_holds`, every Dark Lands country except the Troll Forest): Troll Forest's opinion of the buyer ≥ 25, or the buyer has flag `zin_dark_trolls_for_pay`; 75 PP and 300 `zin_arms_equipment`; buyer gets timed idea `zin_dark_troll_hirelings` (365 days); Troll Forest gets 50 PP and 300 arms through `zin_dark.75`. Cooldown 365 days.

**Blackton.** The free human towns (roster: 5 states, Freeholds). Sway is capped at 40, so Goldoroth cannot yoke Blackton; only war takes it. Lerendor may protect it ([lerendor_narrow_strait.md](lerendor_narrow_strait.md), section 9). Blackton may join the Accord.

**Bordon, Dreson, Dulundur.** Tier B holds with their own trees. They read sway, Volgan pact, the Moot and the Accord through the triggers in Implementation. Dulundur, the largest hold, is the AI's first choice to call the Free Moot (AI weight ×3).

### 7. Volgan's agents in the Dark Lands

The Volgan spec owns the envoys, `zin_volgan_pact` and the Dark Lands acceptance table ([volgan_southern_dominion.md](volgan_southern_dominion.md), section 7). This spec owns the Dark Lands side: how the holds and Goldoroth answer.

**Acceptance factors** multiplied into the AI chance of `zin_dominion.8` "Envoys from Nafeher" (scripted triggers defined here; the Volgan event reads them):

| Trigger | True when | Factor |
| --- | --- | ---: |
| `zin_goldoroth_refuses_masters` | Scope is Goldoroth with flag `zin_goldoroth_no_masters` | ×0 (replaces the Volgan spec's ×0.5) |
| `zin_goldoroth_seeks_the_south` | Scope is Goldoroth with flag `zin_goldoroth_southern_bargain` | ×4 (replaces ×0.5) |
| `zin_dark_hold_under_cocanoor` | Scope is Goldoroth's tributary | ×0 if Goldoroth refuses masters; ×2 if it seeks the south |
| `zin_dark_hold_in_moot` | Scope has `zin_dark_moot_member` | ×0.5 |
| `zin_dark_hold_fears_cocanoor` | Independent, sway 40–79, and Goldoroth refuses masters | ×1.5 (fear of Cocanoor drives a hold south) |
| `zin_dark_took_southern_gifts` | Scope accepted "Gifts from the South" (`zin_lore.161`) | ×1.5 |
| `zin_dark_hold_at_war_with_goldoroth` | At war with Goldoroth | ×2 |

**Gifts from the South.** The flavour event `zin_lore.161` ([02_lore/04_fourth_age_history_for_play.md](../02_lore/04_fourth_age_history_for_play.md)) uses this hook: "Accept" sets country flag `zin_dark_took_southern_gifts`. It changes no pact.

**Goldoroth and the envoy.** Volgan's tree event `zin_volgan.13` "An Envoy from the South" reaches Goldoroth. Its AI weights are overridden here: with `zin_goldoroth_no_masters`, "Goldoroth bows to no spirit" 100; with `zin_goldoroth_southern_bargain`, "Dondor would make fine spoils" 100; otherwise the Volgan spec's 30/70, and under `zin_rule_ai_goldoroth` = `SWORN_TO_VOLGAN`, 90/10. The monthly pulse sets Goldoroth's flag `zin_goldoroth_envoy_heard` once Volgan has completed `zin_volgan_goldoroth_question` or Goldoroth's pact is at least 1.

**Hunting the envoys** (Goldoroth decision, section 5). Target's pact −1 (`zin_dark_add_volgan_pact`); Volgan's veil −1 (`zin_volgan_add_veil`, the hunt is noticed); Volgan gets `zin_dark.85` "Envoys Hunted" and opinion −10 of Goldoroth; the target's opinion of Goldoroth −10 unless it is a tributary.

**Pact changes from this spec.** `zin_dark_add_volgan_pact` (args `target`, `value`) adds to `zin_volgan_pact`, clamps to 0–3 and never raises a country to 3: level 3 comes only from Volgan's "Sworn to Nafeher", as the Volgan spec says.

**Shadow drift.** The ideologies spec's drift source "Volgan's agents" (Dark Lands, Shadow +0.2 a month once the Gathering Dark is 50 or Volgan marches) skips Goldoroth and its tributaries while Goldoroth has `zin_goldoroth_no_shadow_drift`, and doubles for countries at pact 3.

### 8. The Sea of Darkness

**Mastery.** The monthly pulse sums naval base levels (`building_level@naval_base`) in each country's `zin_is_site_sea_of_darkness_coast` states. The country with the highest sum is master when the sum is at least 4 and at least 1.5 times the next. The master gets country flag `zin_dark_sea_master` and idea `zin_dark_sea_master`; scripted trigger `zin_dark_is_sea_master` reads the flag. Mastery passes on the next pulse when the sums change.

**Corsairs.** Goldoroth's Corsair Raid (section 2). Other coastal Dark Lands countries meet corsairs only as victims.

**The Accord's sea.** The Dark Sea Accord's faction manifest (`zin_faction_manifest_hold_the_dark_sea`, diplomacy spec) measures Dark Lands states not controlled by Goldoroth. This spec does not change it.

**Zol's black ships.** The flavour event `zin_lore.180` "Black Ships" already reaches Dark Lands countries with a coast on the Ocean of Zol. Whether the Sea of Darkness opens to that ocean is an open question.

### 9. The straits

The Dark Lands lie between the North Lands and the Middle Lands across narrow straits (established). This spec calls them the **northern Dark Strait** and the **southern Dark Strait** (proposed descriptive names).

**Holding a shore.** Scripted trigger `zin_dark_holds_strait_shore` (args `strait` = `north` or `south`): the scope or its subjects control every Dark Lands-side state of that strait.

**Shore tolls** (Goldoroth decision "Levy Shore Tolls", category `zin_dark_straits`, flag `zin_goldoroth_tolls_open`): requires `zin_dark_holds_strait_shore` for one strait and peace with the far shore's largest owner. Gives +40 PP. Opinion `zin_dark_shore_tolls` (−10, decays 1 a month) from Lerendor (north) or Aenor (south). Cooldown 180 days. Tolls never apply while Goldoroth is a subject.

**Closing a strait** (decision "Close a Dark Strait", flag `zin_goldoroth_strait_wardens`): at war, holds the shore; target is at war with Goldoroth; 50 PP; the target gets `zin_dark_strait_closed` for 180 days. Cooldown 180 days.

**The southern strait and Volgan's march.** When Volgan marches, Dark Lands countries sworn to him (pact 3) attack Dondor or a bordering Concord dominion (Volgan spec, northern front). Goldoroth on the Southern Bargain route crosses the southern strait (`zin_goldoroth_wargoal_strait_south`: `take_state` on one `_south_far` state owned by Aenor or a Concord dominion).

**The northern strait and Zol's dead.** On `zin_zol_rising` every Dark Lands country with a `_north_shore` state or an Ocean of Zol coast gets `zin_dark.80` "Dead on the Dark Shore": "Watch the shore." (timed idea `zin_dark_watch_the_shore`, 365 days; AI 70) / "The dead are the North's trouble." (+25 PP; AI 30).

Scripted trigger `zin_dark_shore_barred` (proposed hook for the Zol's Mistake spec): every `_north_shore` state is controlled by a country at war with Zol and has `coastal_bunker` ≥ 2. The Zol spec decides whether it slows or redirects a crossing; this spec only provides the trigger.

**Truce against the dead.** If Goldoroth and Dondor are both at war with Zol, Goldoroth's focus "The Living Together" offers `zin_goldoroth.18` to Dondor. Accept: white peace between them if at war, `diplomatic_relation` non-aggression, global flag `zin_dark_truce_against_dead` while both are at war with Zol, tension −30, Gathering Dark −1. AI accepts at 80.

### 10. The War of the Last Crowns in the Dark Lands

The vault says nothing of the Dark Lands in the final war. The paths below are proposed and keep the region a side theatre.

| Route | How it opens | What follows |
| --- | --- | --- |
| **The Black Iron Crown** (independence; historical AI) | Goldoroth refuses Volgan | Goldoroth brings the defiant holds to heel; stands against holds sworn to Volgan once he marches; attacks Dondor only when no outside great power shields it |
| **The Southern Bargain** (Volgan) | Goldoroth accepts Volgan's envoys and sends its own | Pact 2, then Sworn (Volgan's focus) or Kneel (Goldoroth becomes Volgan's sworn realm); the northern front against Dondor and across the southern strait |
| **The holds' own war** | A hold refuses the yoke; Goldoroth uses `zin_cb_hold_defiance` | The Free Moot rides; the Accord may invite the defenders |
| **The Accord's war** | `zin_cb_orc_raids`, the great war, or Volgan's march | Dondor, Belonton and their guarantors against Goldoroth |
| **The living together** | Zol's dead reach the Dark Lands | Truce between old enemies |

**Kneeling** (`zin_goldoroth_kneel`, from `zin_goldoroth.14` when Volgan accepts): Goldoroth first annexes tributaries at sway ≥ 60 and releases the rest from the yoke (sway −20). Volgan then `puppet`s Goldoroth and sets `zin_autonomy_sworn_realm`. Goldoroth's government becomes Shadow with stance `zin_shadow_horde` (`zin_politics_set_stance`), it gets spirit `zin_goldoroth_sworn_to_nafeher`, Volgan gets strength +5 (`zin_volgan_add_dominion_strength`), Volgan's veil −15 if `zin_volgan_marches` is unset, Gathering Dark +3, and news `zin_dark.62` "Cocanoor Kneels". A kneeling Goldoroth counts as a Volgan subject for `zin_volgan_children_ready` and becomes a dark power for the Lost Cause's musters (`zin_diplo_is_dark_power`, Southern Dominion member).

**When Volgan's body breaks.** The Volgan spec lowers every Dark Lands pact by 2. This spec then fires `zin_dark.82` "The South Falls Silent" for each Dark Lands country that was at pact 3 or Volgan's subject: "Make our own peace." (seek white peace with Goldoroth and the Accord; AI 70) / "Fight on." (AI 30). Goldoroth on the Southern route gets its tree's "When the South Falls Silent".

### 11. The Gathering Dark

All changes go through `zin_world_add_gathering_dark`.

| Cause | Change |
| --- | --- |
| A raid on an Accord member | +0.25 (raids add at most +3 in a game) |
| A border clash | +1 |
| Focus The Long Grudge | +1 |
| Focus Lord of the Inner Dark | +1 |
| Focus Overlord of the Holds | +2 |
| Goldoroth's war on Dondor (The Accord Must Break) | +2 |
| Focus The Dark Sea Is Ours | +2 |
| Goldoroth kneels to Nafeher | +3 |
| Focus The Northern Front | +2 |
| Focus The Dark Lands Are One | +3 |
| Focus Beyond the Straits | +2 |
| The truce against the dead | −1 |

### Historical path (proposed dates)

| Date | Event | State |
| --- | --- | --- |
| 1 Thaw 1748 | Start | Tension 35, resolve 40, temper 55, unity 13, no war |
| 1748 to 1749 | Goldoroth's court, forges and gifts; a few raids when the temper passes 65; Dondor lights the beacons, petitions Parim (the Golden King sends his blessing); Lerendor's Shield of Dondor | Tension 35–55 |
| 1750 | Volgan's envoys reach the holds and Goldoroth; Goldoroth "bows to no spirit" | Some holds at pact 1 |
| 1751 | Goldoroth takes The Black Iron Crown and hunts the envoys | `zin_goldoroth_no_masters` |
| 1752 to 1753 | The Iron Yoke: one to three holds become tributaries; one or two refuse | Unity 20–30 |
| Deepwinter 1754 | The Long Grudge: claims on Dondor | Tension 55–70 |
| Rainwake 1755 | The War of the Last Crowns: Goldoroth brings the defiant holds to heel; the Free Moot may ride | Unity 30–45 |
| Mistfall 1755 | Volgan marches; sworn holds (if any) attack Dondor; Goldoroth stands against them | — |
| 1757 | Volgan's body breaks; sworn holds make peace | `zin_dark.82` |
| 1758 to 1760 | Goldoroth consolidates. Dondor survives under its guarantors | Unity 40–55 |

## Implementation

### Files

| Path | Content |
| --- | --- |
| `common/scripted_effects/zin_dark.txt` | Effects below |
| `common/scripted_triggers/zin_dark.txt` | Triggers below |
| `common/decisions/zin_dark.txt`, `common/decisions/categories/zin_dark.txt` | Categories `zin_dark_raids`, `zin_dark_horde`, `zin_dark_sway`, `zin_dark_accord`, `zin_dark_free_holds`, `zin_dark_straits` |
| `common/dynamic_modifiers/zin_dark.txt` | `zin_dark_accord_shield` |
| `common/modifiers/zin_dark.txt` | Static state modifier `zin_dark_troll_woods` |
| `common/ideas/zin_dark.txt` | Mechanic spirits below |
| `common/opinion_modifiers/zin_dark.txt` | Opinion modifiers below |
| `common/autonomous_states/zin_tributary_hold.txt` | `zin_autonomy_tributary_hold` |
| `common/characters/zin_dark.txt` | New characters below |
| `common/unit_leader/zin_dark_traits.txt` | `zin_trait_black_iron_warlord` |
| `common/on_actions/zin_dark.txt` | `on_startup`: `zin_dark.1`; `on_declare_war`: the Moot's call, resolve, Accord membership checks; `on_capitulation`: `zin_goldoroth_tribute_on_capitulation`, resolve −15 |
| `common/ai_strategy/zin_dark.txt` | Strategies in the AI section |
| `events/zin_dark.txt` | Namespace `zin_dark` |
| `localisation/english/zin_dark_l_english.yml` | All text |
| `docs/design/start_situation.json` | Start values of every variable below |

The Goldoroth tree's files come from the focus compiler; its events use namespace `zin_goldoroth`. The two namespaces never collide.

### Variables

| Variable | Scope | Range | Start | Meaning |
| --- | --- | --- | --- | --- |
| `zin_dark_border_tension` | global | 0–100 | 35 | Goldoroth against the Accord |
| `zin_dark_accord_resolve` | global | 0–100 | 40 | Cohesion of the Dark Sea Accord |
| `zin_goldoroth_temper` | Goldoroth | 0–100 | 55 | Restlessness of the war-clans |
| `zin_goldoroth_favour_volcano`, `_iron`, `_war`, `_warrens` | Goldoroth | 0–100 | 55 / 50 / 60 / 35 | Clan bloc favour |
| `zin_goldoroth_sway` | each Dark Lands country except Goldoroth | 0–100 | region table | Bend toward Cocanoor |
| `zin_goldoroth_unity` | Goldoroth | 0–100 | 13 | Share of the Dark Lands under Goldoroth |
| `zin_dark_tribute_days` | each tributary | 0+ | 0 | Days under the yoke |
| `zin_dark_raid_dark_added` | global | 0–3 | 0 | Gathering Dark already added by raids |
| `zin_dark_sea_bases` | each coastal country (temporary) | 0+ | — | Pulse working value |
| `zin_dark_moot_refusals` | each Moot member | 0–2 | 0 | Calls refused |
| `zin_dark_states_total` | global | 47 | 47 | Frozen Dark Lands state count |

All are clamped by the effects that change them.

### Flags

Global (local to this mechanic; none is a shared story flag): `zin_dark_accord_holds` (while true), `zin_dark_free_moot`, `zin_dark_truce_against_dead`.

Country, Goldoroth: `zin_goldoroth_moot_open`, `zin_goldoroth_raids_open`, `zin_goldoroth_swift_raids`, `zin_goldoroth_blood_price`, `zin_goldoroth_contests`, `zin_goldoroth_tallymen`, `zin_goldoroth_centralised`, `zin_goldoroth_master_of_clans`, `zin_goldoroth_heir_volcano` / `_iron` / `_war` / `_warrens`, `zin_goldoroth_sway_open`, `zin_goldoroth_yoke_cheap`, `zin_goldoroth_light_yoke`, `zin_goldoroth_hard_yoke`, `zin_goldoroth_clash_open`, `zin_goldoroth_fed` (90 days), `zin_goldoroth_temper_70`, `zin_goldoroth_temper_90`, `zin_goldoroth_envoy_heard`, `zin_goldoroth_southern_question`, `zin_goldoroth_no_masters`, `zin_goldoroth_southern_bargain`, `zin_goldoroth_hunt_open`, `zin_goldoroth_no_shadow_drift`, `zin_goldoroth_watching_south`, `zin_goldoroth_ally_south`, `zin_goldoroth_spoils_promised`, `zin_goldoroth_corsairs`, `zin_goldoroth_tolls_open`, `zin_goldoroth_strait_wardens`, `zin_goldoroth_shore_barred`, `zin_goldoroth_mercy`, `zin_goldoroth_omens_south`, `zin_goldoroth_ash_rites`, `zin_goldoroth_unity_50`, `zin_goldoroth_one_kingdom`.

Country, other Dark Lands countries: `zin_dark_refused_yoke`, `zin_dark_raided_recently` (365 days), `zin_dark_moot_member`, `zin_dark_took_southern_gifts`, `zin_dark_trolls_for_pay`, `zin_dark_sea_master` (any country).

### Scripted triggers

| Trigger | True when |
| --- | --- |
| `zin_goldoroth_war_open` | Section 2 |
| `zin_goldoroth_may_war_dondor` | Section 2 |
| `zin_goldoroth_refuses_masters`, `zin_goldoroth_seeks_the_south` | Section 7 |
| `zin_dark_hold_under_cocanoor`, `zin_dark_hold_in_moot`, `zin_dark_hold_fears_cocanoor`, `zin_dark_took_southern_gifts`, `zin_dark_hold_at_war_with_goldoroth` | Section 7 |
| `zin_dark_is_hold` | Dark Lands country, not Goldoroth, not Dondor, primary people orcs, goblins or trolls (`zin_people_orcs`, `zin_people_goblins` once added, `zin_people_trolls`) |
| `zin_dark_is_free_hold` | `zin_dark_is_hold`, not a subject |
| `zin_dark_is_tributary` | Subject of Goldoroth with `zin_autonomy_tributary_hold` |
| `zin_dark_is_accord_member` | In the faction led by the Dark Sea Accord's leader |
| `zin_dark_is_sea_master` | Scope has `zin_dark_sea_master` |
| `zin_dark_holds_strait_shore` | Section 9 (arg `strait`) |
| `zin_dark_shore_barred` | Section 9 |
| `zin_dark_tension_band_<quiet / uneasy / bloody / brink>` | Tension bands |
| `zin_goldoroth_unity_at_least` | Arg `value` |
| `zin_rules_ai_branch_goldoroth_independent`, `zin_rules_ai_branch_goldoroth_sworn_to_volgan` | Rule pattern of the defines spec |
| Site triggers | Section 1, generated in `zin_sites.txt` |

### Scripted effects

| Effect | Arguments | Does |
| --- | --- | --- |
| `zin_dark_add_border_tension` | `value` | Adds and clamps tension |
| `zin_dark_add_accord_resolve` | `value` | Adds, clamps, refreshes `zin_dark_accord_shield` on every member |
| `zin_goldoroth_add_temper` | `value` | Adds, clamps, fires threshold events |
| `zin_goldoroth_add_favour` | `bloc`, `value` | Adds, clamps; refreshes boon and sulk spirits |
| `zin_goldoroth_add_sway` | `target` (country, `bordering`, `holds`), `value` | Adds with caps and halving rules; `bordering` = every free hold bordering Goldoroth; `holds` = every free hold |
| `zin_goldoroth_yoke_check` | `target` | If sway ≥ the yoke threshold and the target is eligible, fires `zin_dark.50` |
| `zin_goldoroth_take_tributary` | `target` | Section 5 |
| `zin_goldoroth_tribute_on_capitulation` | — | With `zin_goldoroth_mercy`: a capitulating hold becomes a tributary at sway 60 instead of being annexed in the peace |
| `zin_goldoroth_refresh_unity` | — | Recomputes unity; fires its thresholds |
| `zin_goldoroth_crown_heir` | — | Section 4 |
| `zin_goldoroth_kneel` | — | Section 10 |
| `zin_goldoroth_proclaim_one_kingdom` | — | Sets `zin_goldoroth_one_kingdom`; `set_cosmetic_tag` to Great Goldoroth (proposed name); stability +0.1; political power +100; Gathering Dark +3; news `zin_dark.61` |
| `zin_goldoroth_core_dark_lands` | — | `add_core_of` on every owned `zin_is_dark_lands_state` |
| `zin_goldoroth_claim_strait_shores` | — | `add_state_claim` on every `zin_is_site_dark_strait_far_shore` state |
| `zin_goldoroth_wargoal_defiant` | — | `create_wargoal` `annex_everything` on every hold with `zin_dark_refused_yoke` that borders Goldoroth or a tributary, if Goldoroth holds `zin_cb_hold_defiance` against it, or `zin_war_of_last_crowns` or `zin_volgan_marches` is set (the old refusal is enough once the great war has begun) |
| `zin_goldoroth_wargoal_sworn` | — | `annex_everything` war goal on every Dark Lands country at pact 3 that borders Goldoroth or a tributary |
| `zin_goldoroth_wargoal_strait_south` | — | Section 9 |
| `zin_goldoroth_rally_free_dark` | — | Every Dark Lands country with sway ≥ 40 and pact ≤ 1 gives Goldoroth military access; opinion +10 |
| `zin_goldoroth_offer_access_against_dead` | — | Military access both ways with every Dark Lands country at war with Zol |
| `zin_goldoroth_warking_takes_field` | — | Adds the field marshal role (skill 4) and `zin_trait_black_iron_warlord` to the Warking |
| `zin_dark_add_volgan_pact` | `target`, `value` | Section 7 |
| `zin_dark_start_border_clash` | `target` | Section 2 |
| `zin_dark_resolve_raid` | `target`, `kind` (`march`, `hold`, `corsair`) | The raid results in section 2 |
| Shared, called | — | `zin_world_add_gathering_dark`, `zin_diplo_grant_cb`, `zin_politics_set_stance`, `zin_volgan_add_dominion_strength`, `zin_volgan_add_veil`, `zin_leren_add_lean` |

### Decisions

Listed in sections 2 to 9. All have `ai_will_do` blocks from the AI section. Decision ids are `zin_dark_<name>`, for example `zin_dark_raid_marches`, `zin_dark_raid_hold`, `zin_dark_corsair_raid`, `zin_dark_clash_on_the_march`, `zin_dark_great_moot`, `zin_dark_feast_the_clans`, `zin_dark_blood_contest`, `zin_dark_send_gifts`, `zin_dark_bind_by_marriage`, `zin_dark_show_the_host`, `zin_dark_offer_iron_yoke`, `zin_dark_one_fire`, `zin_dark_hunt_envoys`, `zin_dark_light_beacons`, `zin_dark_pay_blood_price`, `zin_dark_invite_to_accord`, `zin_dark_muster_brutes`, `zin_dark_petition_parim`, `zin_dark_call_on_the_north`, `zin_dark_call_free_moot`, `zin_dark_leave_free_moot`, `zin_dark_hire_troll_kin`, `zin_dark_shore_tolls`, `zin_dark_close_strait`.

### Mechanic spirits (`common/ideas/zin_dark.txt`)

| Key | Name | Modifiers | Added / removed |
| --- | --- | --- | --- |
| `zin_dark_restless_clans` | Restless Clans | `stability_factor` −0.05, `political_power_gain` −0.1, `war_support_factor` 0.05 | Goldoroth, temper ≥ 70; removed below 60 |
| `zin_dark_settled_hearths` | Settled Hearths | `stability_factor` 0.05, `war_support_factor` −0.1 | Goldoroth, temper ≤ 25; removed above 35 |
| `zin_dark_boon_volcano` | The Fire-Speakers Bless the Warking | `stability_factor` 0.05 | Volcano favour ≥ 75; removed below 65 |
| `zin_dark_boon_iron` | The Forges Roar | `production_speed_arms_factory_factor` 0.1 | Iron favour ≥ 75 |
| `zin_dark_boon_war` | The War-Clans Hunger | `army_attack_factor` 0.05, `army_morale_factor` 0.05 | War favour ≥ 75 |
| `zin_dark_boon_warrens` | The Warrens Swarm | `recruitable_population_factor` 0.1 | Warrens favour ≥ 75 |
| `zin_dark_sulk_volcano` | The Fire-Speakers Sulk | `stability_factor` −0.05 | Volcano favour ≤ 25; removed above 35 |
| `zin_dark_sulk_iron` | Cold Forges | `production_speed_buildings_factor` −0.1 | Iron favour ≤ 25 |
| `zin_dark_sulk_war` | The War-Clans Mutter | `army_org_factor` −0.05 | War favour ≤ 25 |
| `zin_dark_sulk_warrens` | The Warrens Hide | `recruitable_population_factor` −0.05 | Warrens favour ≤ 25 |
| `zin_dark_tributary_hold` | Under the Iron Yoke | `political_power_gain` −0.1, `army_defence_factor` 0.05 | Each tributary; removed when it leaves the yoke |
| `zin_dark_free_moot` | The Free Moot | `army_core_defence_factor` 0.05, `war_support_factor` 0.03 | Moot members |
| `zin_dark_forest_nobody_enters` | The Forest Nobody Enters | `army_core_defence_factor` 0.15, `attrition` −0.1 | Troll Forest, start, permanent |
| `zin_dark_troll_hirelings` | Troll Hirelings | `army_armor_attack_factor` 0.05, `breakthrough_factor` 0.05 | Hire the Troll-Kin; 365 days |
| `zin_dark_brutes_mustered` | The Brutes Mustered | `army_org_factor` 0.05, `army_defence_factor` 0.05 | Muster the Brutes; 180 days |
| `zin_dark_sea_master` | Master of the Sea of Darkness | `trade_opinion_factor` 0.1, `naval_detection` 0.1 | The sea master; moved by the pulse |
| `zin_dark_strait_closed` | The Dark Strait Is Closed | `naval_speed_factor` −0.1, `naval_invasion_prep_speed` −0.25 | Close a Dark Strait; 180 days |
| `zin_dark_watch_the_shore` | Watch on the Shore | `army_core_defence_factor` 0.05, `coastal_bunker_effectiveness_factor` 0.1 | `zin_dark.80`; 365 days |

### Dynamic and static modifiers

- `zin_dark_accord_shield` (each Accord member): values from variables `zin_dark_shield_def`, `zin_dark_shield_core`, `zin_dark_shield_ws`, set by `zin_dark_add_accord_resolve` and the pulse.
- `zin_dark_troll_woods` (state, Troll Forest's state, permanent): `local_supplies` −2.

### Opinion modifiers

| Id | Value | Decay | Use |
| --- | ---: | --- | --- |
| `zin_dark_raided` | −15 | 1 a month | Raid victims toward Goldoroth |
| `zin_dark_gifts` | +10 | 0.5 a month | Gifts of Black Iron |
| `zin_dark_blood_price_paid` | +10 | 1 a month | Goldoroth toward a payer |
| `zin_dark_yoke_refused` | −20 | none | Goldoroth toward a refuser |
| `zin_dark_moot_kin` | +15 | none while members | Among Moot members |
| `zin_dark_refused_nafeher` | −25 | none | Volgan toward Goldoroth |
| `zin_dark_bargain_struck` | +20 | none | Volgan toward Goldoroth |
| `zin_dark_envoys_hunted` | −10 | 1 a month | Volgan, and the target, toward Goldoroth |
| `zin_dark_shore_tolls` | −10 | 1 a month | Lerendor or Aenor toward Goldoroth |
| `zin_dark_against_the_dead` | +25 | none | Truce against the dead, both ways |

The start opinion modifier `zin_opinion_orc_wars` (Goldoroth and Dondor, −40) belongs to the diplomacy spec.

### Casus belli

New: `zin_cb_hold_defiance` (Goldoroth → a hold that refused the yoke; 365 days; granted only from 1750.1.1) through `zin_diplo_grant_cb`, in the same form as the diplomacy spec's causes. Used: `zin_cb_orc_raids` (diplomacy spec), with the extra tension condition of section 2.

### Characters

Existing (proposed, [02_lore/02_characters.md](../02_lore/02_characters.md)): Warking Gorduth of Cocanoor (`<Goldoroth>_zin_ruler`), Bredo the Fire-Speaker (`zin_goldoroth_bredo`), Sungor of the Volcano Clans (`zin_goldoroth_sungor`, chief of the Volcano Clans), Warchief Britag (`zin_goldoroth_britag`, chief of the War-Clans), King Dunmar of Dondor, Chief Belon, Troy the Old, Chiefs Bordag, Dresk and Dulgash, Lord Haclton.

New (all proposed; portraits image-generated):

| Id | Name | Starts as | Role |
| --- | --- | --- | --- |
| `zin_goldoroth_ulgra` | Forge-Mistress Ulgra | Goldoroth political advisor (trait `zin_trait_forge_mistress`: `production_speed_arms_factory_factor` 0.05) | Chief of the Iron Clans |
| `zin_goldoroth_snikkit` | Snikkit Many-Knives | Goldoroth corps commander (skill 2, `trickster`) | Chief of the Goblin Warrens |
| `zin_goldoroth_rask` | Rask Black-Sail | Navy leader (skill 2); hidden until "The Black-Sail Corsairs" | Corsair captain |

`zin_trait_black_iron_warlord` (unit leader trait, field marshal): `army_attack_factor` 0.05, `army_morale_factor` 0.05.

### Events (namespace `zin_dark`)

| Id | Title | For | Trigger | Options |
| --- | --- | --- | --- | --- |
| 1 | (hidden) Dark Lands pulse | Goldoroth (or the Accord leader if Goldoroth is gone) | `on_startup`, then every 30 days | Temper, favours, sway drift, tributary days, unity, tension and resolve drift, sea mastery, Moot health, envoy flag |
| 10 | The Raiders Return | Goldoroth | Raid decision completes | "Share the spoils." |
| 11 | Raiders on the Marches | Dondor | Raid on Dondor | Beacons / blood-price / in kind (section 2) |
| 12 | Raiders from Cocanoor | the hold | Raid on a hold | As 11 |
| 13 | Black Sails | the target | Corsair raid | As 11 |
| 15 | Fire on the March | Dark Lands, Lerendor, Aenor (news) | Border clash starts | "The orcs test the line again." |
| 16, 17, 18 | The Clash Won / The Clash Lost / The Clash Ends | Goldoroth, Dondor | Border war callbacks | Section 2 |
| 20 | An Invitation to the Accord | target hold | Accord invitation | Join / decline |
| 21 | The Hold Answers | Accord leader | Reply to 20 | Result text |
| 22 | The Accord Frays | members | Resolve < 20 | Stay / leave |
| 30 | Notbuton Asks Parim | Aenor | Petition Parim | Section 3 |
| 31 | Notbuton Calls on the North | Lerendor | Call on the North | Section 3 |
| 40 | The Great Moot | Goldoroth | Decision | One option per bloc |
| 42 | The Clans Demand Blood | Goldoroth | Temper ≥ 90 | Section 4 |
| 43 | The Clans Grow Restless | Goldoroth | Temper ≥ 70 | "Their blood is up." |
| 44 | A Challenge at the Moot | Goldoroth | Favour ≤ 10 | Section 4 |
| 45 | A New Warking | Goldoroth; news for the Dark Lands | Challenge lost | "Long may the new one last." |
| 46 | The Warking Stands | Goldoroth | Challenge won | "Who else?" |
| 50 | The Iron Yoke | the hold | Offer the Iron Yoke or a tree yoke check | Section 5 |
| 51 | The Hold's Answer | Goldoroth | Reply to 50 | Result text |
| 52 | One Fire | Dark Lands (news) | One Fire Under Cocanoor | "Another hall goes dark." |
| 60 | Cocanoor Rises | Dark Lands, Lerendor, Aenor (news) | Unity 50 | "Watch the inner Dark." |
| 61 | The Dark Lands Are One | all (news) | `zin_goldoroth_proclaim_one_kingdom` | "One king for the Dark." |
| 62 | Cocanoor Kneels | all (news) | `zin_goldoroth_kneel` | "The orcs have found a master." |
| 70 | The Free Moot Is Called | eligible holds | Call the Free Moot | Join / decline |
| 71 | The Moot Rides | members | War on a member | Ride / not this time |
| 72 | The Moot Breaks | members | Fewer than two members | "Every hall for itself." |
| 75 | Troll Silver | Troll Forest | Hire the Troll-Kin | "Trolls fight for pay." |
| 80 | Dead on the Dark Shore | coastal Dark Lands | `zin_zol_rising` | Section 9 |
| 82 | The South Falls Silent | pact-3 and Volgan-subject Dark Lands countries | `zin_volgan_body_destroyed` | Section 10 |
| 85 | Envoys Hunted | Volgan | Hunt the Southern Envoys | "Cocanoor has chosen." |

News events 15, 52, 60, 61 and 62 name no hidden power. No `zin_dark` text names Afrit, states the size of Volgan's hosts, or says fire ends Zol's dead.

### Game rules

| Rule | Options (default first) | Effect |
| --- | --- | --- |
| `zin_rule_ai_goldoroth` | `DEFAULT`, `INDEPENDENT`, `SWORN_TO_VOLGAN`, `RANDOM` | AI Goldoroth's choice between The Black Iron Crown and The Southern Bargain. `DEFAULT` follows `zin_rule_historical_path` (Black Iron Crown). Added to the rules table of [00_foundation/05_defines_and_rules.md](../00_foundation/05_defines_and_rules.md). |

### Interface

A Horde panel for Goldoroth (temper, the four blocs, unity, sway per hold, tributaries) and an Accord panel for the Accord's leader (resolve, tension band, members). Other Dark Lands countries see only their own sway as a band: Free (0–24), Courted (25–49), Pressed (50–79), Under the Yoke (tributary). Layout belongs to [07_interface](../07_interface/).

### Hooks for the regional and shared trees

The tier B trees (`regional_dondor`, `regional_bordon`, `regional_dreson`, `regional_dulundur`, `regional_troll_forest`, `regional_blackton`) and the shared tree `shared_dark_lands` use only the effects and triggers above. Required minimum:

- Dondor: at least one focus each for resolve, the beacons, the invitation decisions and a guarantor (Parim or Sonargur).
- Every hold tree: a branch that raises its own defence against sway (focus effect `zin_goldoroth_add_sway` with a negative value on ROOT), a branch toward the Free Moot, and a branch that answers Volgan's envoys either way.
- Blackton: a branch toward Lerendor's protection.
- The Troll Forest: a branch that sells troll-kin (`zin_dark_trolls_for_pay`).

### Defines

None.

## AI

**Goldoroth before the war.** Raids when temper ≥ 65 and the raid is off cooldown (Dondor first if tension < 70, else a free hold; never two raids in 60 days). Holds a Blood Contest when temper ≥ 75 and PP ≥ 50. Feasts when any favour ≤ 30. Holds the Great Moot for the lowest-favour bloc when that bloc is ≤ 25. Sends gifts to the two holds with the highest sway below the yoke threshold; offers the yoke as soon as it can. Shows the host only when temper ≥ 60. Never takes Clash on the March under `zin_rule_historical_path` = `HISTORICAL` before 1 Deepwinter 1754. AI strategies: `antagonize` Dondor 20; `befriend` the three free holds with the highest sway; `influence` every free hold.

**Goldoroth at war.** On `zin_goldoroth_war_open`: wars on defiant holds first. Takes The Accord Must Break only when `zin_goldoroth_may_war_dondor` is true and either no great power outside the Accord guarantees Dondor, or that guarantor is at war elsewhere and Goldoroth's divisions are at least 1.5 times the Accord's; never while `zin_dark_accord_holds` and the ratio is below 2. On the Black Iron route after Volgan marches: `conquer` the sworn holds. Accepts the truce against the dead.

**Dondor.** Lights the beacons when resolve < 50; pays the blood-price when tension ≥ 70 and PP ≥ 100; invites every eligible hold with sway < 30 once; petitions Parim in 1748; calls on the North when tension ≥ 50. AI strategy `prepare_for_war` against Goldoroth (defensive) from tension 60.

**Holds.** Answer the yoke and the Accord by the chances above. Dulundur calls the Free Moot when allowed. Ride with the Moot by the weights above. Volgan's envoys: the Volgan spec's base chances times this spec's factors.

**Volgan.** Unchanged; the factors above shape who answers.

**Lerendor and Aenor.** As their specs; `zin_dark.30` and `zin_dark.31` weights above.

## Acceptance

1. A new game on 1 Thaw 1748: no Dark Lands country is at war or in a border war; tension 35, resolve 40, temper 55, favours 55/50/60/35, unity 12 to 14; sway values as the region table (with the bordering bonus); Dondor and Belonton in the Dark Sea Accord.
2. No Dark Lands war or border clash can begin before 1 Deepwinter 1749 (scenario test with the console attempts: decisions unavailable, focus unavailable).
3. A raid resolves without `has_war` becoming true; tension rises by 8; the raid Gathering Dark total never exceeds 3.
4. With `zin_gathering_dark` ≥ 25 and tension ≥ 60, a raid on Dondor gives `zin_cb_orc_raids` both ways for 365 days.
5. A border clash with `change_state_after_war = no` leaves the state owners unchanged; its callbacks apply their effects once.
6. Temper crossing 70 and 90 fires `zin_dark.43` and `zin_dark.42` once per crossing, and again only after falling 10 below.
7. A clan favour at 10 with all conditions fires `zin_dark.44`; a lost challenge replaces the Warking with the named heir's chief.
8. An accepted Iron Yoke makes the hold Goldoroth's subject under `zin_autonomy_tributary_hold`; a refusal after 1750.1.1 gives Goldoroth `zin_cb_hold_defiance`.
9. Unity equals 100 × (Goldoroth's and its subjects' Dark Lands states) ÷ 47 within one pulse of any change.
10. `zin_dark_add_volgan_pact` never sets a country to 3; `zin_goldoroth_refuses_masters` makes Goldoroth's acceptance of `zin_dominion.8` zero.
11. In a 12-year historical AI run: Goldoroth takes The Black Iron Crown before 1753, declares no war before `zin_war_of_last_crowns` or a casus belli, gains at least one tributary, and Dondor exists in 4A 1760.
12. With `zin_rule_ai_goldoroth` = `SWORN_TO_VOLGAN`, the AI takes The Southern Bargain and, after Volgan's march, The Northern Front.
13. The localisation check finds no "Afrit", no named size of Volgan's hosts, no claim that fire ends Zol's dead, and no named goblin hold in `zin_dark` texts.
14. The HOI4 Agent Tools script validator reports no unknown effects, triggers or modifiers in the `zin_dark` files.

## Open questions

1. **The straits.** Where exactly are the strait between the Dark Lands and the North Lands and the strait between the Dark Lands and the Middle Lands? Is either one Lerendor's Narrow Strait? Can armies cross either on foot (a map crossing), or only by sea?
2. **The Sea of Darkness.** Is it an inland sea of the Dark Lands, or does it open to the Ocean of Zol or the central sea?
3. **Dondor's size.** Dondor holds one state but is a great power in the working table (also asked in the countries spec). A one-state Dondor cannot stand against Goldoroth without its friends. Should it grow?
4. **Belonton.** The roster makes Belonton an orc confederacy allied with human Dondor. Is that right? This spec treats it as a sign that the Dark Lands do not split by people.
5. **Goblins and ogres.** Which holds are goblin or ogre holds?
6. **Goldoroth and Volgan.** This spec makes independence Goldoroth's default ("Goldoroth bows to no spirit"). Do you want that, or should Goldoroth lean south?
7. **The Free Moot.** Is a league of free holds acceptable, or does it go against "they belong to nobody"?
8. **The great war.** On the historical path Goldoroth fights the defiant holds but not Dondor, and Dondor survives to 4A 1760. Do you want a bigger Dark Lands war in 4A 1755?
9. **Names.** Do you approve the four clan blocs, the Fire-Mountain, the Iron Yoke, Tributary Hold, the Free Moot, Forge-Mistress Ulgra, Snikkit Many-Knives, Rask Black-Sail, Great Goldoroth and the Dark Straits?
10. **Zol on the Dark shore.** Should Zol's dead ever land in the Dark Lands, or only pass through the straits toward the Middle Lands and the North?
