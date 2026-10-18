# West Lands regional focus trees

**Status:** Draft. **Priority:** 6. **Phase:** 6.

## Purpose

This spec gives the six tier B countries of the West Lands their own focus trees: Girdon, Lambin, Buldor, Kradlon, Corogon and Varnondor. Gunwaith, the northern crown, has its major tree ([../major/gunwaith.md](../major/gunwaith.md)); the other fourteen western freeholds use the shared tree [../shared/shared_west_lands.md](../shared/shared_west_lands.md).

The West's Fourth Age story is carried by [the Western Crossing mechanic](../../04_mechanics/western_crossing.md): the old grudge against Aenor, the Truce of the Grey Ford, the Ford Council, the fleet, the Crossing, Parim, the evacuation and the stranded armies. Gunwaith drives it. These trees give the other western courts their own voice in it: Girdon on the far bank of the ford, Lambin as the peacemaker of the downs, Buldor's companies for hire, Kradlon's guild forges, Corogon's merchant fleet and Varnondor's harbours on the sea approaches.

| Country | Tree id | States | Stance at start | Grudge at start | Focuses |
| --- | --- | ---: | --- | ---: | ---: |
| Girdon | `regional_girdon` | 2 | `zin_light_council` | 40 | 37 |
| Lambin | `regional_lambin` | 10 | `zin_wild_freeholds` | 45 | 33 |
| Buldor | `regional_buldor` | 6 | `zin_wild_freeholds` | 35 | 32 |
| Kradlon | `regional_kradlon` | 6 | `zin_wild_freeholds` | 60 | 32 |
| Corogon | `regional_corogon` | 5 | `zin_light_council` | 50 | 32 |
| Varnondor | `regional_varnondor` | 4 | `zin_wild_freeholds` | 45 | 32 |

All six are realms of men.

## Lore basis

**Established** (vault: *Erdae and Its Regions*, *Peoples of Erdae*, *The First Age of Erdae*, *The Fourth Age of Erdae*, *War of the Last Crowns*, *Fourth Age Canon Register*):

- The West Lands lie south of the Cold Lands, joined by a broad neck. Gunwaith, Girdon, Kradlon, Corogon and Varnondor are there. The central sea between the West and the Middle Lands is much wider than the old maps drew.
- Gunwaith clans, Girdon wardens and Buldor companies are peoples of men.
- In the First Age Aenoran colonies, trade stations and claims in the West produced repeated wars with peoples who already lived there; the grievance survives into the Fourth Age.
- Eindil is taken south by West Lands travellers, makes peace between rivals and is chosen temporary war-king by several rulers of one western confederation; he lays the title down once the peace is secured.
- Western fleets cross the enlarged sea; the army lands, seizes ports, occupies the capital and claims the human throne. Zol's dead and Volgan make the occupation impossible; the fleet evacuates; some soldiers are stranded and join Eindil's coalition without their kingdoms becoming his subjects.

**Proposed (vault and earlier specs):** the Gunwaith–Girdon wars from about 4A 1702; the Truce of the Grey Ford (4A 1745); the Bridge of the Three Oaths and Girdon's Winter Ford; the Crossing in 4A 1755; the rulers Warden-Speaker Pernia Lothor, Lord Werl of Lambin, Company-Lord Datidon Rook, First Guildsman Trilo Kradd, Consul Sobra Canak and King Oslin of Varnondor ([characters](../../02_lore/02_characters.md)); grudge, truce, unity, resolve, fleet and the Ford Council ([western crossing](../../04_mechanics/western_crossing.md)); that Kradlon, Corogon, Varnondor, Lambin and the Buldor companies trade with Aenor and resent its tariffs.

**Proposed by this spec:** every focus, spirit, event and number below; the named lieutenants and advisors; Lambin's ruined Aenoran trade stations; Buldor's contract books; Kradlon's guild moot; Corogon's consuls and island routes; Varnondor's cape lights and staging harbours.

**Kept open (text never answers):** who led the Crossing and who claimed the throne of men; where the fleets landed; which rulers made Eindil war-king (the journey builds the Grey Ford Confederation from regard; Lambin's tree only makes it likelier that Lambin leads it); what became of the stranded westerners after the war (every "home" focus says "in this telling"). Before `zin_eindil_awake` no visible focus mentions the stranger. Before `zin_afrit_revealed` no text names Afrit; Aenor's god-king is "King Aurevan" or "the Deliverer".

## Design

### Conventions for every tree in this file

- **Ids.** Tree id `regional_<name>`; focus ids `zin_regional_<name>_<key>`; spirits `zin_regional_<name>_<key>`; events namespace `zin_regional_<name>`; characters `zin_regional_<name>_<person>`; tree-declared effects and triggers `zin_regional_<name>_<verb>`. Spirit keys never repeat a focus key of the same tree.
- **Defaults.** Days 35 unless marked 70d; AI base 10 unless given; no `available` block unless given. Lines read `key` **Name** (x,y) ← prerequisites: effects. "a, b" means a **or** b; "a + b" means a **and** b.
- **Shorthand.** **grudge ±n self** is `call zin_west_add_grudge (n)` on ROOT; **truce ±n**, **unity ±n**, **fleet ±n** call `zin_west_add_truce`, `zin_west_add_unity`, `zin_west_add_fleet`; **regard**, **renown** call `zin_eindil_add_regard` (ROOT) and `zin_eindil_add_renown`; **LC +n** is `flag zin_lost_cause_member` plus `call zin_lost_cause_add_strength (n)`; **join coalition** is `call zin_eindil_join_coalition`; **friend** is `check zin_eindil_friend`.
- **Historical factor.** "hist ×f" applies while `zin_west_historical` is true.
- **Research.** Warfare categories `zin_cat_*`; equipment `zin_arms_equipment`, `zin_armour_equipment`.
- **Building `where`.** `capital`, `random_owned`, `random_coastal`, or the site key `grey_ford` (`zin_is_site_grey_ford`, own side).
- **Mechanic events.** A tree may fire a mechanic event with `event_for`; the mechanic file owns its text.

### Peace gates (all trees in this file)

| Kind of focus | Earliest |
| --- | --- |
| Any war goal or declaration | none in these trees; their countries go to war only through the mechanic (the Grey Ford Feud, the Crossing, the Relief) or through their own player choices with the diplomacy causes |
| Pledges, landings, stranded and coalition focuses | the mechanic's flags: `zin_west_pledged`, `zin_western_crossing`, `zin_west_stranded`, `zin_eindil_returned` |
| Lost Cause membership | `zin_gathering_dark` ≥ 25 (Buldor's Parim route), the relief route, or `zin_war_of_last_crowns` |

Everything available on 1 Thaw 4A 1748 is court, trade, forts, envoys, tolls and drill.

---

## Girdon

**Tree** `regional_girdon` · 2 states · men (tradition `zin_tradition_girdon_wardens`) · Light (`zin_light_council`, elections every 48 months) · ruler **Warden-Speaker Pernia Lothor** (proposed, characters spec) · 37 focuses · grid x 0–20, y 0–9.

### Situation in 4A 1748

Girdon is a small realm of two states on a great river: mill towns, river barges, river tolls and the wardens who hold the fords. An assembly of wardens chooses its Warden-Speaker. Pernia Lothor signed the Truce of the Grey Ford three years ago, after half a century of war with Gunwaith (proposed dates). Aenoran gold paid for part of that war, and Girdon resents the debt as much as the tariffs (grudge 40). The truce holds, uneasily (`zin_west_truce` 40; opinion "Truce of the Grey Ford", −10 both ways; an engine truce until 1 Thaw 4A 1750). Girdon's wardens still drill on the ford, and nobody on either bank believes the peace will last.

### Role

- **Historical path (proposed):** raids wear the truce down; in 4A 1750 Gunwaith's war-thanes break it and the Grey Ford Feud begins, a border war that Girdon defends. At Girdon's Winter Ford the stranger holds the crossing for the refugees (journey episode). The war-king's peace ends the feud. Girdon makes peace with Gunwaith, sends a delegate to the Ford Council and, its grudge raised by Aurevan's crowning and the council's grievances, pledges its wardens to the Crossing.
- **War of the Last Crowns:** Girdon's wardens cross with the West; some may be stranded and serve in Eindil's coalition.
- **Alternatives:** a lasting peace at the ford; Parim's old friend (Aenoran guarantee, no crossing); a league of councils with Corogon; or, if Gunwaith turns on it, *The River Will Not Bend*.

### Court and characters

| Id | Name | Role | Source |
| --- | --- | --- | --- |
| `<Girdon tag>_zin_ruler` | Warden-Speaker Pernia Lothor | Country leader, `zin_light_council` | characters spec (proposed) |
| `zin_regional_girdon_aldo` | Warden-Captain Aldo Ferrin | Corps commander, skill 3, traits `unyielding_defender`, `trait_engineer`; recruited by *Aldo's Wardens* | this spec (proposed) |
| `zin_regional_girdon_corla` | Corla Wend, Master of the Mills | Political advisor, trait `zin_adv_merchant_prince`; recruited by *The Mills of Girdon* | this spec (proposed) |

Start spirit (country history): `long_feuds_toll`, beside the start spec's `zin_west_old_claims`.

### Tree

| Branch | Columns | Rows | Opens | Drives |
| --- | --- | --- | --- | --- |
| A. The Wardens' Assembly | 0–3 | 0–3 | start | Court; truce party or feud party |
| B. The Grey Ford | 4–8 | 0–4 | start; the defence after `zin_west_truce_broken`; one focus hidden until `zin_eindil_awake` | `zin_west_truce`; the feud's defence; peace |
| C. The River's Wealth | 9–12 | 0–3 | start | Economy |
| D. Girdon's Friends | 13–17 | 0–3 | when no feud runs; three-way exclusive | Gunwaith's brotherhood, Parim's guarantee, or the councils' pact |
| E. The Wardens' Host | 18–20 | 0–3 | start | Army |
| F. The Sea Question | 4–8 | 6–9 | the Ford Council and the routes | Delegate, pledge, ships, stranded, relief |

**A. The Wardens' Assembly.** Icons: `council_table`, `olive_branch`, `war_drums`, `seal_royal`.

- `wardens_assembly` **The Wardens' Assembly** (1,0) 70d: political power 75. AI 100.
- `the_truce_party` **The Truce Party** (0,1) ← wardens_assembly: truce +3; stability 0.02. AI 15; hist ×0.5.
- `the_old_feud_party` **The Old Feud Party** (2,1) ← wardens_assembly: war support 0.03; truce −3. AI 15; hist ×2.
- `pernias_seal` **Pernia's Seal** (1,2) ← the_truce_party, the_old_feud_party: political power 50; stability 0.03.
- `the_assembly_united` **The Assembly United** (1,3) 70d ← pernias_seal: swap spirit `long_feuds_toll` → `wardens_of_the_river`.

**B. The Grey Ford.** Icons: `grey_ford`, `river_ford`, `fort_wall`, `coin_chest`.

- `the_ford_wardens` **The Ford Wardens** (6,0): political power 25; truce +2. AI 20.
- ★ `propose_the_commission` **Propose a Commission** (5,1) ← the_ford_wardens.
- `walls_at_the_ford` **Walls at the Ford** (7,1) ← the_ford_wardens: building bunker 1 `grey_ford`; truce −3. AI 20; hist ×2.
- `the_blood_price` **The Blood-Price** (5,2) ← propose_the_commission: truce +5; political power −25.
- ★ `defend_the_ford` **Defend the Ford** (7,2) ← walls_at_the_ford.
- ★ `a_lasting_peace` **A Lasting Peace** (5,3) ← the_blood_price.
- ★ `the_winter_ford_remembered` **The Winter Ford Remembered** (7,3) ← defend_the_ford, walls_at_the_ford.
- `peace_on_the_river` **Peace on the River** (6,4) ← a_lasting_peace, defend_the_ford, the_winter_ford_remembered: available not `zin_west_grey_ford_war`; stability 0.05; unity +5. AI 60.

**C. The River's Wealth.** Icons: `canal_lock`, `timber_mill`, `toll_house`, `shipwright_yard`, `forge_anvil`.

- `river_barges` **River Barges** (10,0): building infrastructure 1 random_owned. AI 25.
- `the_mills_of_girdon` **The Mills of Girdon** (9,1) ← river_barges: building industrial_complex 1 capital; recruit `zin_regional_girdon_corla`.
- `river_tolls` **River Tolls** (11,1) ← river_barges: political power 50.
- `the_river_mouth_yards` **The River-Mouth Yards** (10,2) ← the_mills_of_girdon, river_tolls: building dockyard 1 random_coastal; if `zin_west_council`: fleet +1.
- `arsenal_of_the_wardens` **The Wardens' Arsenal** (10,3) 70d ← the_river_mouth_yards: building arms_factory 1 capital.

**D. Girdon's Friends.** Icons: `handshake_oath`, `crown_gold`, `alliance_rings`, `fort_wall`.

- `girdons_friends` **Girdon's Friends** (15,0): available not `zin_west_grey_ford_war`; political power 25. AI 30.
- ★ `brothers_across_the_ford` **Brothers Across the Ford** (13,1) ← girdons_friends; exclusive with aenors_old_friend, the_southern_councils.
- ★ `aenors_old_friend` **Parim's Old Friend** (15,1) ← girdons_friends; exclusive with the other two.
- ★ `the_southern_councils` **The Southern Councils** (17,1) ← girdons_friends; exclusive with the other two.
- `the_river_league_answered` **The River League Answered** (13,2) ← brothers_across_the_ford: available flag `zin_regional_girdon_brothers`; stability 0.05; unity +5.
- `the_kings_guarantee` **The King's Guarantee** (15,2) ← aenors_old_friend: available flag `zin_regional_girdon_parims_friend`; spirit `kings_guarantee`.
- `a_league_of_councils` **A League of Councils** (17,2) ← the_southern_councils: available flag `zin_regional_girdon_council_pact`; spirit `council_league`.
- ★ `the_river_will_not_bend` **The River Will Not Bend** (15,3) ← the_river_league_answered, the_kings_guarantee, a_league_of_councils.

**E. The Wardens' Host.** Icons: `sword_shield`, `bow_archers`, `spear_levy`, `levy_muster`.

- `warden_companies` **Warden Companies** (19,0): army experience 10. AI 20.
- `river_bows` **River Bows** (18,1) ← warden_companies: research {zin_cat_bows} 0.5×1.
- `pike_and_shield` **Pike and Shield** (20,1) ← warden_companies: research {zin_cat_armour} 0.5×1.
- `aldos_wardens` **Aldo's Wardens** (19,2) ← river_bows, pike_and_shield: recruit `zin_regional_girdon_aldo`; spirit `warden_drill`.
- `the_river_levy` **The River Levy** (19,3) ← aldos_wardens: manpower 2,000.

**F. The Sea Question.** Icons: `scroll_treaty`, `banner_league`, `ship_voyage`, `banner_laid_down`.

- `a_delegate_to_the_ford` **A Delegate to the Ford Council** (6,6): available `zin_west_council`; unity +2; political power 25. AI 50.
- `the_wardens_cross` **The Wardens Cross** (5,7) ← a_delegate_to_the_ford: available flag `zin_west_pledged`; manpower 2,000; army experience 10. AI 100.
- `girdon_sends_ships` **Girdon Sends Ships** (7,7) ← a_delegate_to_the_ford: available `zin_west_route_crossing` or `zin_west_route_relief`; fleet +2; navy experience 5. AI 30.
- `stranded_wardens` **Wardens Beyond the Sea** (5,8) ← the_wardens_cross: available flag `zin_west_stranded` + `zin_eindil_returned`; join coalition. AI 300.
- `wardens_for_the_relief` **Wardens for the Relief** (7,8) ← girdon_sends_ships: available `zin_west_route_relief`; LC +3; regard +5. AI 50.
- `home_from_the_sea` **Home from the Sea** (6,9) ← stranded_wardens, wardens_for_the_relief, girdon_sends_ships: available `zin_afrit_dead` or `zin_eindil_crowned`; stability 0.05; political power 50. AI 60.

### Key focuses

| Key | Name | Prerequisites | Effects summary |
| --- | --- | --- | --- |
| `propose_the_commission` | Propose a Commission | the_ford_wardens | Available: Gunwaith exists; truce unbroken; no global flag `zin_west_ford_commission`. Event `commission_proposal` to Gunwaith. AI 15; hist ×0.2 |
| `defend_the_ford` | Defend the Ford | walls_at_the_ford | Available `zin_west_truce_broken`. Timed spirit `ford_defenders` 180 days; army experience 5. AI 100 |
| `a_lasting_peace` | A Lasting Peace | the_blood_price | Available `check zin_regional_girdon_truce_strong` (truce unbroken and `zin_west_truce` ≥ 60). Truce +15; unity +5. (Gunwaith's *The Ford Holds* alone sets the permanent truce.) AI 20; hist ×0 |
| `the_winter_ford_remembered` | The Winter Ford Remembered | defend_the_ford, walls_at_the_ford | `allow_branch` `zin_eindil_awake`. Available `check zin_regional_girdon_episodes_past` (journey stage ≥ 3). Regard +10; renown +2; manpower 1,000 (the refugees stayed). AI 30 |
| `brothers_across_the_ford` | Brothers Across the Ford | girdons_friends | Exclusive with aenors_old_friend, the_southern_councils. Available: Gunwaith exists; not at war with it. Event `brotherhood_offer` to Gunwaith. AI 30; hist ×5 |
| `aenors_old_friend` | Parim's Old Friend | girdons_friends | Exclusive. Grudge −15 self; spirit `parims_coin`; event `parims_friendship` to the Aenor realm that holds Parim. AI 10; hist ×0 |
| `the_southern_councils` | The Southern Councils | girdons_friends | Exclusive. Available Corogon exists. Event `council_pact` to Corogon. AI 15; hist ×0 |
| `the_river_will_not_bend` | The River Will Not Bend | any of the three children | Building bunker 2 capital; spirit `river_will_not_bend`. AI 20, ×5 if `check zin_regional_girdon_claimed` (Gunwaith holds claims on a Girdon state) |

### Spirits

| Key | Name | Modifiers | Added / removed |
| --- | --- | --- | --- |
| `long_feuds_toll` | The Long Feud's Toll | `war_support_factor` −0.05, `army_core_defence_factor` 0.10 | Start (history); swapped by *The Assembly United* |
| `wardens_of_the_river` | Wardens of the River | `army_core_defence_factor` 0.10, `stability_factor` 0.05 | *The Assembly United* |
| `ford_defenders` | Defenders of the Ford | `army_defence_factor` 0.15, `army_core_defence_factor` 0.10 | *Defend the Ford*, 180 days |
| `parims_coin` | Parim's Coin | `political_power_gain` 0.10, `war_support_factor` −0.05 | *Parim's Old Friend* |
| `kings_guarantee` | The King's Guarantee | `stability_factor` 0.05, `political_power_gain` 0.05 | *The King's Guarantee*; removed if the guarantee ends |
| `council_league` | A League of Councils | `opinion_gain_monthly_factor` 0.10, `stability_factor` 0.03 | *A League of Councils* |
| `river_will_not_bend` | The River Will Not Bend | `army_core_defence_factor` 0.15, `dig_in_speed_factor` 0.10 | *The River Will Not Bend* |
| `warden_drill` | Wardens' Drill | `army_org_factor` 0.05, `army_defence_factor` 0.05 | *Aldo's Wardens* |

### Events (namespace `zin_regional_girdon`)

| Id | Key | Title | To | Trigger | Options |
| --- | --- | --- | --- | --- | --- |
| 1 | `commission_proposal` | Girdon Proposes a Commission | Gunwaith | *Propose a Commission* | **Sit with them** (AI 50; ×0.2 if Gunwaith has `zin_gunwaith_war_thanes`; hist ×0.2): global flag `zin_west_ford_commission`; truce +10. **Refuse**: truce −5 |
| 2 | `brotherhood_offer` | Brothers Across the Ford? | Gunwaith | *Brothers Across the Ford* | **Clasp hands** (AI 50; hist ×2; ×2 after the war-king's peace): non-aggression pact with Girdon; opinion modifier `zin_regional_girdon_brothers` (+25) both ways; Girdon flag `zin_regional_girdon_brothers`; unity +5. **Not while the dead of the ford lie unburied**: nothing |
| 3 | `parims_friendship` | The River Wardens Seek Parim's Friendship | Aenor realm | *Parim's Old Friend* | **Guarantee them** (AI 40; 70 while ruled by Aurevan): the realm guarantees Girdon; Girdon flag `zin_regional_girdon_parims_friend`; opinion +20 both ways. **Decline**: Girdon grudge +5 |
| 4 | `council_pact` | A Pact of Councils | Corogon | *The Southern Councils* | **Sign** (AI 50): Corogon and Girdon guarantee each other; Girdon flag `zin_regional_girdon_council_pact`. **Decline**: nothing |

Mechanic and journey events that reach Girdon: `zin_west.20` (Ford Commission), `.21` (raids), `.22`, `.24`, `.30`, `.31`, `.61`–`.63`, `.70`; journey *Girdon's Winter Ford* (event 21) and *The War-King's Terms* (event 33). Their owners hold the text.

### Historical AI route

| Period | Focuses |
| --- | --- |
| 1748 | wardens_assembly, the_ford_wardens, river_barges, warden_companies |
| 1749 | the_old_feud_party, walls_at_the_ford, the_mills_of_girdon, river_tolls, pernias_seal |
| 1750 | defend_the_ford (feud from 1 Rainwake), the_winter_ford_remembered (after the episode), peace_on_the_river (after the war-king's peace), girdons_friends, brothers_across_the_ford |
| 1751–1752 | a_delegate_to_the_ford, the_river_league_answered, the_assembly_united, the_river_mouth_yards, river_bows, pike_and_shield |
| 1753–1754 | aldos_wardens, arsenal_of_the_wardens, the_river_will_not_bend, the_river_levy |
| 1755–1757 | the_wardens_cross (if pledged), girdon_sends_ships; stranded_wardens on `zin_eindil_returned` |
| 1758–1760 | home_from_the_sea |

The AI never takes `propose_the_commission`, `a_lasting_peace`, `aenors_old_friend` or `the_southern_councils` on the historical path.

---

## Lambin

**Tree** `regional_lambin` · 10 states · men · Wild (`zin_wild_freeholds`) · ruler **Lord Werl of Lambin** (proposed, characters spec) · 33 focuses · grid x 0–19, y 0–9.

### Situation in 4A 1748

Lambin is a lordship of ten states: chalk downs, grain fields, horse runs and mill towns. On its coast stand the ruins of trading stations that Aenor built in the First Age (proposed); the lords of Lambin pass them every day, and the grudge they keep is old and quiet (45). Lord Werl sells grain across the wide sea to Aenor and, all through the feud, sold it to both Gunwaith and Girdon (proposed). Lambin wants the western peace to last because peace sells grain. It is at peace with everyone.

### Role

- **Historical path (proposed):** Lambin works for the truce, and when it breaks it hosts talks. When the stranger comes south, Lambin welcomes him; with the highest regard among the third parties it is the likeliest leader of the Grey Ford Confederation (the journey picks the leader by regard; this is not fixed history). Later Lambin sends a delegate to the Ford Council, remembers the old claims and pledges its host to the Crossing.
- **War of the Last Crowns:** Lambin's lances cross with the West; its granaries feed the host; those left behind join the war-king's banner again.
- **Alternatives:** grain contracts with Parim instead of the old claims; keep to the downs if the West stays divided.

### Court and characters

| Id | Name | Role | Source |
| --- | --- | --- | --- |
| `<Lambin tag>_zin_ruler` | Lord Werl of Lambin | Country leader, `zin_wild_freeholds` | characters spec (proposed) |
| `zin_regional_lambin_essa` | Essa of the Downs | Corps commander, skill 3, traits `cavalry_leader`, `skirmisher`; recruited by *Riders of the Downs* | this spec (proposed) |
| `zin_regional_lambin_orrin` | Orrin the Grain-Reeve | Political advisor, trait `zin_adv_treasurer`; recruited by *The Grain Lords* | this spec (proposed) |

Start spirit (country history): `downs_granaries`.

### Tree

| Branch | Columns | Rows | Opens | Drives |
| --- | --- | --- | --- | --- |
| A. Lord Werl's Court | 0–3 | 0–3 | start | Court; the old stations |
| B. Downs and Granaries | 4–7 | 0–3 | start | Economy |
| C. The Peacemakers | 8–12 | 0–4 | start; two focuses hidden until `zin_eindil_awake` | Truce; the stranger; the confederation |
| D. The Old Claims | 13–16 | 0–3 | start; exclusive | Grudge; council; pledge |
| E. Lambin's Lances | 17–19 | 0–3 | start | Army |
| F. The Far Shore | 8–12 | 6–9 | a western route chosen | The Crossing, the downs kept, the stranded |

**A. Lord Werl's Court.** Icons: `feast_table`, `charter_old`, `granary`, `council_table`.

- `lord_werls_court` **Lord Werl's Court** (1,0) 70d: political power 75. AI 100.
- `ruins_of_the_old_stations` **Ruins of the Old Stations** (0,1) ← lord_werls_court: grudge +3 self; tooltip "Aenor's traders built here in the First Age. Their stones still stand." AI 15.
- `the_grain_lords` **The Grain Lords** (2,1) ← lord_werls_court: recruit `zin_regional_lambin_orrin`; political power 25.
- `a_neutral_hall` **A Neutral Hall** (1,2) ← ruins_of_the_old_stations, the_grain_lords: stability 0.03.
- `the_downs_united` **The Downs United** (1,3) 70d ← a_neutral_hall: swap spirit `downs_granaries` → `downs_united`.

**B. Downs and Granaries.** Icons: `granary`, `horse_cavalry`, `farm_sowing`, `timber_mill`.

- `granaries_of_the_downs` **Granaries of the Downs** (5,0): building industrial_complex 1 capital. AI 25.
- `horse_runs` **Horse Runs** (4,1) ← granaries_of_the_downs: spirit `horse_runs_kept`.
- `grain_for_the_sea` **Grain for the Sea** (6,1) ← granaries_of_the_downs: political power 50.
- `the_mill_towns` **The Mill Towns** (5,2) ← horse_runs, grain_for_the_sea: building industrial_complex 1 random_owned; building infrastructure 1 random_owned.
- `the_great_granary` **The Great Granary** (5,3) 70d ← the_mill_towns: stability 0.05; flag `zin_regional_lambin_great_granary`.

**C. The Peacemakers.** Icons: `olive_branch`, `envoy`, `grey_ford`, `banner_laid_down`, `handshake_oath`.

- `the_peace_of_the_west` **The Peace of the West** (10,0): political power 25; truce +3. AI 30.
- `envoys_to_the_ford` **Envoys to the Ford** (9,1) ← the_peace_of_the_west: truce +5; unity +2. AI 20; hist ×2.
- `grain_for_both_banks` **Grain for Both Banks** (11,1) ← the_peace_of_the_west: truce +5; stability 0.02.
- `the_neutral_ground` **The Neutral Ground** (10,2) ← envoys_to_the_ford, grain_for_both_banks: spirit `neutral_ground`.
- ★ `a_stranger_on_the_downs` **A Stranger on the Downs** (9,3) ← the_neutral_ground.
- ★ `host_the_peace_talks` **Host the Peace Talks** (11,3) ← the_neutral_ground.
- `the_war_kings_hosts` **Hosts of the War-King** (10,4) ← a_stranger_on_the_downs, host_the_peace_talks: available `zin_eindil_war_king`; regard +10; unity +5. AI 40.

**D. The Old Claims.** Icons: `charter_old`, `granary`, `scroll_treaty`, `banner_league`.

- `the_old_claims` **The Old Claims** (14,0): grudge +3 self; political power 25. AI 20.
- ★ `aenoran_grain_buyers` **Aenoran Grain Buyers** (13,1) ← the_old_claims; exclusive with the_claims_remembered.
- ★ `the_claims_remembered` **The Claims Remembered** (15,1) ← the_old_claims; exclusive with aenoran_grain_buyers.
- `a_delegate_from_lambin` **A Delegate from Lambin** (14,2) ← aenoran_grain_buyers, the_claims_remembered: available `zin_west_council`; unity +3; political power 25. AI 50.
- `bread_for_the_host` **Bread for the Host** (13,3) ← a_delegate_from_lambin: available `zin_west_route_crossing` or `zin_west_route_relief`; `call zin_regional_lambin_supply_convener`; political power 25. AI 30.
- `the_downs_pledge` **The Downs' Pledge** (15,3) ← a_delegate_from_lambin: available flag `zin_west_pledged`; manpower 4,000; war support 0.05. AI 60.

**E. Lambin's Lances.** Icons: `knight_lance`, `horse_cavalry`, `spear_levy`.

- `lances_of_lambin` **Lances of Lambin** (18,0): army experience 10. AI 20.
- `riders_of_the_downs` **Riders of the Downs** (17,1) ← lances_of_lambin: research {zin_cat_mounts} 0.5×1; recruit `zin_regional_lambin_essa`.
- `foot_of_the_mill_towns` **Foot of the Mill Towns** (19,1) ← lances_of_lambin: research {zin_cat_arms} 0.5×1.
- `the_lances_ride` **The Lances Ride** (18,2) 70d ← riders_of_the_downs, foot_of_the_mill_towns: spirit `lances_ride`.
- `the_downs_levy` **The Downs Levy** (18,3) ← the_lances_ride: manpower 5,000.

**F. The Far Shore.** Icons: `ship_voyage`, `granary`, `banner_laid_down`.

- `the_call_from_the_ford` **The Call from the Ford** (10,6): available `zin_west_route_crossing`, `zin_west_route_relief` or `zin_west_route_divided`; political power 50. AI 100.
- `lambin_crosses` **Lambin Crosses** (9,7) ← the_call_from_the_ford: available flag `zin_west_pledged` + `zin_western_crossing`; timed spirit `across_the_sea` 180 days. AI 100.
- `lambin_keeps_the_downs` **Lambin Keeps the Downs** (11,7) ← the_call_from_the_ford: available `zin_west_route_divided`, or no flag `zin_west_pledged`; stability 0.05; spirit `downs_kept`. AI 40.
- `bread_for_the_stranded` **Bread for the Stranded** (9,8) ← lambin_crosses: available flag `zin_west_stranded`; stability 0.03; political power 25. AI 60.
- `under_the_war_kings_banner_again` **Under the War-King's Banner Again** (9,9) ← bread_for_the_stranded: available `zin_eindil_returned`; join coalition; war support 0.05. AI 300.

### Key focuses

| Key | Name | Prerequisites | Effects summary |
| --- | --- | --- | --- |
| `a_stranger_on_the_downs` | A Stranger on the Downs | the_neutral_ground | `allow_branch` `zin_eindil_awake`. Regard +10; renown +2; tooltip "Traders brought a man south who settles quarrels and asks for nothing." AI 30; hist ×2 (makes Lambin the likeliest third-party leader of the Grey Ford Confederation) |
| `host_the_peace_talks` | Host the Peace Talks | the_neutral_ground | Available `zin_west_truce_broken`. Unity +5; timed spirit `peace_talks` 180 days; if `zin_eindil_awake`: regard +5. AI 40; hist ×2 |
| `aenoran_grain_buyers` | Aenoran Grain Buyers | the_old_claims | Exclusive with the_claims_remembered. Event `grain_contract` to the Aenor realm that holds Parim. AI 20; hist ×0 |
| `the_claims_remembered` | The Claims Remembered | the_old_claims | Exclusive. Grudge +5 self; war support 0.03. AI 40; hist ×10 |

### Spirits

| Key | Name | Modifiers | Added / removed |
| --- | --- | --- | --- |
| `downs_granaries` | Granaries of the Downs | `stability_factor` 0.03, `consumer_goods_factor` −0.02 | Start (history); swapped by *The Downs United* |
| `downs_united` | The Downs United | `political_power_gain` 0.10, `stability_factor` 0.05 | *The Downs United* |
| `horse_runs_kept` | Horse Runs | `army_speed_factor` 0.03 | *Horse Runs* |
| `neutral_ground` | The Neutral Ground | `political_power_gain` 0.05, `opinion_gain_monthly_factor` 0.10 | *The Neutral Ground* |
| `peace_talks` | Peace Talks at Lambin | `stability_factor` 0.05 | *Host the Peace Talks*, 180 days |
| `lances_ride` | The Lances Ride | `army_attack_factor` 0.05, `breakthrough_factor` 0.05 | *The Lances Ride* |
| `across_the_sea` | Across the Sea | `army_org_factor` 0.05, `supply_consumption_factor` −0.05 | *Lambin Crosses*, 180 days |
| `downs_kept` | The Downs Kept | `stability_factor` 0.05, `political_power_gain` 0.05 | *Lambin Keeps the Downs* |
| `grain_contract` | Grain for Parim | `political_power_gain` 0.05, `consumer_goods_factor` −0.02 | Event `grain_contract`, option *Sign* |

### Events (namespace `zin_regional_lambin`)

| Id | Key | Title | To | Trigger | Options |
| --- | --- | --- | --- | --- | --- |
| 1 | `grain_contract` | Grain from Lambin | Aenor realm | *Aenoran Grain Buyers* | **Sign the contract** (AI 60; 70 under Aurevan): Lambin gets `grain_contract`; Lambin grudge −10; the realm +25 political power. **Refuse**: Lambin grudge +5 |

Journey events that may reach Lambin: *The Bridge of the Three Oaths* (if Lambin owns the site), *The King Without a House*, *A Crown Offered*, *The War-King's Terms*, *The Crown Laid Down* (as confederation leader), *West Over the Sea* (as departure host). Mechanic events: `zin_west.30`, `.31`, `.61`–`.63`, `.70`.

### Historical AI route

| Period | Focuses |
| --- | --- |
| 1748 | lord_werls_court, the_peace_of_the_west, granaries_of_the_downs, the_old_claims |
| 1749 | envoys_to_the_ford, grain_for_both_banks, the_claims_remembered, the_grain_lords, ruins_of_the_old_stations |
| 1750 | the_neutral_ground, a_stranger_on_the_downs (once awake), host_the_peace_talks (after the truce breaks), the_war_kings_hosts |
| 1751–1752 | a_delegate_from_lambin, a_neutral_hall, horse_runs, grain_for_the_sea, lances_of_lambin |
| 1753–1754 | the_mill_towns, the_downs_united, the_great_granary, riders_of_the_downs, the_lances_ride |
| 1755 | the_call_from_the_ford, the_downs_pledge, bread_for_the_host, lambin_crosses |
| 1756–1757 | bread_for_the_stranded; under_the_war_kings_banner_again on `zin_eindil_returned` |
| 1758–1760 | leftovers |

The AI never takes `aenoran_grain_buyers` on the historical path.

---

## Buldor

**Tree** `regional_buldor` · 6 states · men (tradition `zin_tradition_buldor_companies`) · Wild (`zin_wild_freeholds`) · ruler **Company-Lord Datidon Rook** (proposed, characters spec) · 32 focuses · grid x 0–19, y 0–8.

### Situation in 4A 1748

Buldor is the land of the Buldor companies: six states of drill fields, arsenals and company halls whose soldiers hire out across the West and beyond. A council of captains elects the Company-Lord; Datidon Rook holds the books today. The companies serve whoever pays, Aenor included, and their grudge is the mildest in the West (35). Aenor's treasury can hire two of their regiments for a year (the economy spec's *Hire the Buldor Companies*). In 4A 1748 no one is buying a war, and the companies drill, guard caravans and wait.

### Role

- **Historical path (proposed):** Buldor sells contracts to whoever pays. Gunwaith's *Buldor Contracts* reach it; its AI usually sends its swords west. Its grudge rises with Aurevan's crowning and the council's grievances, and it pledges companies to the Crossing.
- **War of the Last Crowns:** the great war pays; Buldor's companies cross with the West, and those stranded take Eindil's contract.
- **Alternatives:** swear the companies to the West outright, or serve Parim and the Lost Cause.

### Court and characters

| Id | Name | Role | Source |
| --- | --- | --- | --- |
| `<Buldor tag>_zin_ruler` | Company-Lord Datidon Rook | Country leader, `zin_wild_freeholds` | characters spec (proposed) |
| `zin_regional_buldor_mara` | Captain Mara Holt | Corps commander, skill 3, traits `infantry_leader`, `skirmisher`; recruited by *The Captains' School* | this spec (proposed) |
| `zin_regional_buldor_ulric` | Paymaster Ulric Penn | Political advisor, trait `zin_adv_treasurer`; recruited by *The Paymaster's Ledger* | this spec (proposed) |

Start spirit (country history): `company_books`.

### Tree

| Branch | Columns | Rows | Opens | Drives |
| --- | --- | --- | --- | --- |
| A. The Company Hall | 0–3 | 0–3 | start | Court |
| B. Contracts | 4–9 | 0–3 | start; three-way exclusive | Who the companies serve; contract decisions |
| C. The Company Drill | 10–13 | 0–3 | start | Army quality |
| D. Arsenals and Pay | 14–16 | 0–2 | start | Economy |
| E. Recruiting Drums | 17–19 | 0–2 | start | Manpower |
| F. The Great War Pays | 10–13 | 5–7 | `zin_war_of_last_crowns` | Stranded companies; Eindil's contract |

**A. The Company Hall.** Icons: `guild_hall`, `council_table`, `ledger_coins`, `scroll_sealed`.

- `the_company_hall` **The Company Hall** (1,0) 70d: political power 75. AI 100.
- `council_of_captains` **The Council of Captains** (0,1) ← the_company_hall: political power 25.
- `the_paymasters_ledger` **The Paymaster's Ledger** (2,1) ← the_company_hall: recruit `zin_regional_buldor_ulric`; political power 25.
- `articles_of_the_companies` **Articles of the Companies** (1,2) ← council_of_captains, the_paymasters_ledger: stability 0.03.
- `the_free_companies` **The Free Companies** (1,3) 70d ← articles_of_the_companies: swap spirit `company_books` → `free_companies_sworn`.

**B. Contracts.** Icons: `coin_chest`, `banner_league`, `crown_gold`, `ledger_coins`.

- ★ `open_the_books` **Open the Books** (6,0).
- ★ `swords_for_the_west` **Swords for the West** (4,1) ← open_the_books; exclusive with whoever_pays, swords_for_parim.
- ★ `whoever_pays` **Whoever Pays** (6,1) ← open_the_books; exclusive with the other two.
- ★ `swords_for_parim` **Swords for Parim** (8,1) ← open_the_books; exclusive with the other two.
- `the_western_contracts` **The Western Contracts** (4,2) ← swords_for_the_west: unity +3; political power 25.
- `companies_for_the_crossing` **Companies for the Crossing** (4,3) ← the_western_contracts: available flag `zin_west_pledged`; manpower 3,000; army experience 10. AI 80.
- `contracts_in_every_court` **Contracts in Every Court** (6,2) ← whoever_pays: variable `zin_regional_buldor_contract_cap` +1; political power 25.
- `the_highest_bidder` **The Highest Bidder** (6,3) 70d ← contracts_in_every_court: spirit `highest_bidder`.
- `the_crowns_companies` **The Crown's Companies** (8,2) ← swords_for_parim: available `variable zin_gathering_dark above 24`; LC +2.
- `shields_for_the_concord` **Shields for the Concord** (8,3) ← the_crowns_companies: available `zin_war_of_last_crowns`; manpower 2,000; `call zin_lost_cause_add_strength (3)`. AI 50.

**C. The Company Drill.** Icons: `sword_shield`, `bow_archers`, `war_council_map`.

- `company_drill` **Company Drill** (11,0): army experience 10. AI 20.
- `pike_and_crossbow` **Pike and Crossbow** (10,1) ← company_drill: research {zin_cat_bows} 0.5×1.
- `veterans_of_many_wars` **Veterans of Many Wars** (12,1) ← company_drill: spirit `veterans`.
- `captains_school` **The Captains' School** (11,2) ← pike_and_crossbow, veterans_of_many_wars: recruit `zin_regional_buldor_mara`; army experience 5.
- `the_iron_discipline` **The Iron Discipline** (11,3) 70d ← captains_school: spirit `iron_discipline`.

**D. Arsenals and Pay.** Icons: `forge_anvil`, `market_stalls`, `coin_chest`.

- `the_arsenals` **The Arsenals** (15,0): building arms_factory 1 capital. AI 20.
- `plunder_markets` **The Plunder Markets** (14,1) ← the_arsenals: political power 50.
- `the_pay_chests` **The Pay-Chests** (16,1) ← the_arsenals: political power 50.
- `armourers_row` **Armourers' Row** (15,2) ← plunder_markets, the_pay_chests: building arms_factory 1 random_owned; equipment zin_armour_equipment 200.

**E. Recruiting Drums.** Icons: `war_drums`, `levy_muster`.

- `recruiting_drums` **Recruiting Drums** (18,0): manpower 3,000.
- `sons_of_every_land` **Sons of Every Land** (17,1) ← recruiting_drums: spirit `sons_of_every_land`.
- `the_company_roll` **The Company Roll** (19,1) ← recruiting_drums: manpower 3,000.
- `the_great_muster` **The Great Muster** (18,2) ← sons_of_every_land, the_company_roll: available at war, or `zin_war_of_last_crowns`; manpower 5,000.

**F. The Great War Pays.** Icons: `coin_chest`, `banner_laid_down`, `lone_sword`.

- `the_great_war_pays` **The Great War Pays** (11,5): available `zin_war_of_last_crowns`; political power 100. AI 200.
- `stranded_companies` **Companies Beyond the Sea** (10,6) ← the_great_war_pays: available flag `zin_west_stranded`; stability 0.03; army experience 10. AI 60.
- `contracts_with_the_heir` **A Contract with the Heir** (12,6) ← the_great_war_pays: available `zin_eindil_returned`, and friend or flag `zin_west_stranded`; join coalition; regard +5. AI 300.
- `the_companies_come_home` **The Companies Come Home** (11,7) ← stranded_companies, contracts_with_the_heir: available `zin_afrit_dead` or `zin_eindil_crowned`; stability 0.05; political power 50.

### Key focuses

| Key | Name | Prerequisites | Effects summary |
| --- | --- | --- | --- |
| `open_the_books` | Open the Books | — | Flag `zin_regional_buldor_books_open` (opens the decision category *The Company Books*); political power 25. AI 50 |
| `swords_for_the_west` | Swords for the West | open_the_books | Exclusive with whoever_pays, swords_for_parim. Grudge +10 self; flag `zin_west_buldor_west` (Aenor's *Hire the Buldor Companies* unavailable while it is set); contracts go only to West Lands countries. AI 20; hist ×0 |
| `whoever_pays` | Whoever Pays | open_the_books | Exclusive. Spirit `paid_swords`; contracts to any country that passes the decision's checks. AI 50; hist ×10 |
| `swords_for_parim` | Swords for Parim | open_the_books | Exclusive. Grudge −10 self; event `companies_offered` to the Aenor realm that holds Parim; contracts go only to Aenor realms and Lost Cause members. AI 15; hist ×0 |

### Decisions: The Company Books (proposed)

Category `zin_regional_buldor_contracts`, visible to Buldor with flag `zin_regional_buldor_books_open`. The focus compiler's data format has no decision block today; these two decisions are written by the content builder from this tree's data once the compiler gains an optional `decisions` block (dependency, below).

| Key | Target | Available | Cost | Effect | AI |
| --- | --- | --- | --- | --- | --- |
| `zin_regional_buldor_sell_contract` | a country at war, not Buldor's enemy, not Shadow, not `zin_diplo_is_dark_power`, allowed by the contract route | `zin_regional_buldor_contracts` < `zin_regional_buldor_contract_cap` (start 2); Buldor manpower ≥ 3,000 | 25 PP | Event `contract_offer` to the target | Whoever Pays: when a target is at war with a major; other routes: their allowed targets |
| `zin_regional_buldor_recall_company` | — | at least one contract active | 0 | Ends the newest contract early: the employer loses the idea; Buldor recovers 2,000 manpower | when Buldor itself is at war |

An accepted contract: the employer pays 50 PP and gets the timed idea `company_contract` (365 days); Buldor gains 75 PP and 5 army experience, pays 3,000 manpower and adds 1 to `zin_regional_buldor_contracts`. After 365 days the hidden event `contract_ends` lowers the count by 1 and returns 2,000 manpower (the veterans come home).

### Spirits

| Key | Name | Modifiers | Added / removed |
| --- | --- | --- | --- |
| `company_books` | The Company Books | `experience_gain_army_factor` 0.10, `stability_factor` −0.03 | Start (history); swapped by *The Free Companies* |
| `free_companies_sworn` | The Free Companies | `experience_gain_army_factor` 0.15, `political_power_gain` 0.05 | *The Free Companies* |
| `paid_swords` | Whoever Pays | `political_power_gain` 0.05, `trade_opinion_factor` 0.10 | *Whoever Pays* |
| `highest_bidder` | The Highest Bidder | `political_power_gain` 0.10 | *The Highest Bidder* |
| `veterans` | Veterans of Many Wars | `army_org_factor` 0.05, `experience_gain_army_factor` 0.05 | *Veterans of Many Wars* |
| `iron_discipline` | The Iron Discipline | `army_morale_factor` 0.05, `army_defence_factor` 0.05 | *The Iron Discipline* |
| `sons_of_every_land` | Sons of Every Land | `recruitable_population_factor` 0.05 | *Sons of Every Land* |
| `company_contract` | A Buldor Company | `army_attack_factor` 0.03, `army_defence_factor` 0.03, `experience_gain_army_factor` 0.05 | On an employer, 365 days |

### Events (namespace `zin_regional_buldor`)

| Id | Key | Title | To | Trigger | Options |
| --- | --- | --- | --- | --- | --- |
| 1 | `companies_offered` | The Buldor Companies Offer Their Swords | Aenor realm | *Swords for Parim* | **Take them into the king's pay** (AI 60): opinion +20 both ways; Buldor +50 PP. **Parim needs no hired swords**: Buldor grudge +5 |
| 2 | `contract_offer` | A Contract from Buldor | employer | decision | **Sign the contract** (AI 70 if at war with a major, else 30; ×0 under 50 PP): as above. **No**: nothing |
| 3 | `contract_ends` | (hidden) The contract ends | Buldor | 365 days after a signing | Count −1; manpower +2,000 |

Gunwaith's `zin_gunwaith.4` (*Contracts from Gunwaith*) also reaches Buldor; its "Our swords go west" option sets the same flag `zin_west_buldor_west` and does not lock this tree's route.

### Historical AI route

| Period | Focuses |
| --- | --- |
| 1748 | the_company_hall, open_the_books, company_drill, recruiting_drums |
| 1749 | whoever_pays, council_of_captains, the_paymasters_ledger, the_arsenals |
| 1750–1751 | contracts_in_every_court, articles_of_the_companies, pike_and_crossbow, veterans_of_many_wars |
| 1752–1754 | the_highest_bidder, the_free_companies, captains_school, the_iron_discipline, plunder_markets, the_pay_chests |
| 1755 | the_great_war_pays, the_great_muster; contracts sold to belligerents |
| 1756–1757 | stranded_companies (if stranded), contracts_with_the_heir on `zin_eindil_returned` |
| 1758–1760 | the_companies_come_home |

The AI never takes `swords_for_the_west` or `swords_for_parim` on the historical path; its pledge to the Crossing comes from the mechanic's *Call to Cross* by grudge.

---

## Kradlon

**Tree** `regional_kradlon` · 6 states · men · Wild (`zin_wild_freeholds`) · ruler **First Guildsman Trilo Kradd** (proposed, characters spec) · 32 focuses · grid x 0–20, y 0–4.

### Situation in 4A 1748

Kradlon is a league of guild towns: six states of forges, looms, wagon-works and smoke. The masters of the guilds choose a First Guildsman to wear the chain of office (proposed); Trilo Kradd wears it now. Kradlon's workshops make much of what the West sells and buys, and they pay the heaviest Aenoran duties of any western court, which makes its grudge the deepest (60). Its journeymen grumble in the taverns, its masters write petitions, and nobody yet speaks of war.

### Role

- **Historical path (proposed):** Kradlon petitions Aenor over the duties and is refused; the guilds remember. It sends a delegate to the Ford Council, pledges the most men of the smaller courts (grudge 60) and arms the western host from its forges.
- **War of the Last Crowns:** Kradlon's guild companies cross; its forges feed the host; stranded journeymen join Eindil's coalition.
- **Alternatives:** trade before grudge (an Aenoran market, a lower grudge, no taste for the Crossing).

### Court and characters

| Id | Name | Role | Source |
| --- | --- | --- | --- |
| `<Kradlon tag>_zin_ruler` | First Guildsman Trilo Kradd | Country leader, `zin_wild_freeholds` | characters spec (proposed) |
| `zin_regional_kradlon_hesta` | Forge-Mistress Hesta Varn | Political advisor, trait `zin_adv_merchant_prince`; recruited by *Forge Rows* | this spec (proposed) |
| `zin_regional_kradlon_bram` | Captain Bram Kettle | Corps commander, skill 2, traits `trait_engineer`, `unyielding_defender`; recruited by *Wagon-Forts* | this spec (proposed) |

Start spirit (country history): `aenoran_duties`.

### Tree

| Branch | Columns | Rows | Opens | Drives |
| --- | --- | --- | --- | --- |
| A. The Guild Moot | 0–3 | 0–3 | start | Court |
| B. Workshops of the West | 4–7 | 0–3 | start | Industry |
| C. The Tariff Quarrel | 8–12 | 0–3 | start; exclusive | Grudge; Aenor's market or the guilds' memory |
| D. The Guild Militia | 13–15 | 0–2 | start | Army |
| E. The Ford Council and the Sea | 16–19 | 0–4 | the Ford Council and the routes | Hulls, pledge, arms for the host, the stranded |
| F. The Stranger at the Forge | 20 | 0–1 | hidden until `zin_eindil_awake` | Regard |

**A. The Guild Moot.** Icons: `guild_hall`, `forge_anvil`, `workshop_tools`, `seal_royal`, `charter_free`.

- `the_guild_moot` **The Guild Moot** (1,0) 70d: political power 75. AI 100.
- `masters_of_the_forges` **Masters of the Forges** (0,1) ← the_guild_moot: political power 25.
- `the_journeymen` **The Journeymen** (2,1) ← the_guild_moot: stability 0.03.
- `the_first_guildsmans_chain` **The First Guildsman's Chain** (1,2) ← masters_of_the_forges, the_journeymen: political power 50.
- `apprentice_rolls` **Apprentice Rolls** (2,2) ← the_journeymen: manpower 1,500.
- `charter_of_the_guilds` **Charter of the Guilds** (1,3) 70d ← the_first_guildsmans_chain: swap spirit `aenoran_duties` → `guild_charter`.

**B. Workshops of the West.** Icons: `workshop_tools`, `roads_paved`, `forge_anvil`, `foundry_fire`, `mine_cart`.

- `workshops_of_the_west` **Workshops of the West** (5,0): building industrial_complex 1 capital. AI 25.
- `the_wagon_works` **The Wagon-Works** (4,1) ← workshops_of_the_west: building infrastructure 1 random_owned, twice.
- `forge_rows` **Forge Rows** (6,1) ← workshops_of_the_west: building arms_factory 1 capital; recruit `zin_regional_kradlon_hesta`.
- `the_great_hammer_halls` **The Great Hammer-Halls** (5,2) 70d ← the_wagon_works, forge_rows: building industrial_complex 1 random_owned.
- `coal_and_ore_carts` **Coal and Ore Carts** (7,2) ← forge_rows: building infrastructure 1 random_owned; political power 25.
- `master_smiths` **Master Smiths** (5,3) ← the_great_hammer_halls: research {zin_cat_arms} 0.5×2.

**C. The Tariff Quarrel.** Icons: `toll_house`, `scroll_sealed`, `ledger_coins`, `market_stalls`, `forge_anvil`.

- `the_tariff_quarrel` **The Tariff Quarrel** (10,0): grudge +3 self. AI 20.
- `the_guilds_petition` **The Guilds' Petition** (9,1) ← the_tariff_quarrel: `event_for` the Aenor realm that holds Parim: `zin_west.10` (*A Protest from the West*, protester = Kradlon). AI 15; hist ×2.
- `count_the_duties` **Count the Duties** (11,1) ← the_tariff_quarrel: political power 50.
- ★ `trade_before_grudge` **Trade Before Grudge** (9,2) ← the_guilds_petition, count_the_duties; exclusive with the_guilds_remember.
- ★ `the_guilds_remember` **The Guilds Remember** (11,2) ← the_guilds_petition, count_the_duties; exclusive with trade_before_grudge.
- `markets_across_the_sea` **Markets Across the Sea** (9,3) ← trade_before_grudge: spirit `sea_markets`.
- `arms_for_the_west` **Arms for the West** (11,3) ← the_guilds_remember: spirit `western_arsenal`; flag `zin_regional_kradlon_arms_west`.

**D. The Guild Militia.** Icons: `levy_muster`, `bow_archers`, `fort_wall`.

- `guild_militia` **The Guild Militia** (14,0): manpower 3,000. AI 15.
- `crossbow_guilds` **Crossbow Guilds** (13,1) ← guild_militia: research {zin_cat_bows} 0.5×1.
- `wagon_forts` **Wagon-Forts** (15,1) ← guild_militia: recruit `zin_regional_kradlon_bram`; spirit `wagon_forts_drill`.
- `the_militia_drilled` **The Militia Drilled** (14,2) ← crossbow_guilds, wagon_forts: army experience 10.

**E. The Ford Council and the Sea.** Icons: `scroll_treaty`, `shipwright_yard`, `banner_league`, `forge_anvil`, `banner_laid_down`.

- `voices_at_the_ford` **Voices at the Ford** (17,0): available `zin_west_council`; unity +3; political power 25. AI 50.
- `hulls_from_kradlon` **Hulls from Kradlon** (16,1) ← voices_at_the_ford: available `check zin_regional_kradlon_is_coastal`; fleet +3; building dockyard 1 random_coastal. AI 30.
- `the_guild_pledge` **The Guild Pledge** (18,1) ← voices_at_the_ford: available flag `zin_west_pledged`; manpower 4,000. AI 60.
- ★ `arm_the_western_host` **Arm the Western Host** (17,2) ← hulls_from_kradlon, the_guild_pledge.
- `the_guilds_across_the_sea` **The Guilds Across the Sea** (16,3) ← arm_the_western_host: available `zin_western_crossing`; timed spirit `guilds_abroad` 180 days. AI 60.
- `stranded_journeymen` **Journeymen Beyond the Sea** (18,3) ← arm_the_western_host: available flag `zin_west_stranded` + `zin_eindil_returned`; join coalition. AI 300.
- `the_long_road_home` **The Long Road Home** (17,4) ← the_guilds_across_the_sea, stranded_journeymen: available `zin_afrit_dead` or `zin_eindil_crowned`; stability 0.05. AI 60.

**F. The Stranger at the Forge.** Icons: `traders_road`, `scroll_sealed`.

- `the_stranger_at_the_forge` **The Stranger at the Forge** (20,0): `allow_branch` `zin_eindil_awake`; renown +2; regard +5. AI 20.
- `heed_the_warning` **Heed the Warning** (20,1) ← the_stranger_at_the_forge: available `zin_eindil_named` + flag `zin_eindil_heeded`; grudge −10 self; regard +10. AI 20; hist ×0.

### Key focuses

| Key | Name | Prerequisites | Effects summary |
| --- | --- | --- | --- |
| `trade_before_grudge` | Trade Before Grudge | the_guilds_petition, count_the_duties | Exclusive with the_guilds_remember. Grudge −15 self; event `kradlon_market` to the Aenor realm that holds Parim. AI 15; hist ×0 |
| `the_guilds_remember` | The Guilds Remember | the_guilds_petition, count_the_duties | Exclusive. Grudge +10 self; war support 0.05; unity +3. AI 40; hist ×10 |
| `arm_the_western_host` | Arm the Western Host | hulls_from_kradlon, the_guild_pledge | Available flag `zin_west_pledged` or `zin_west_route_relief`. `call zin_regional_kradlon_arm_convener` (sends 1,000 zin_arms_equipment to `global.zin_west_convener`; if Kradlon is the convener it keeps them). AI 40 |

### Spirits

| Key | Name | Modifiers | Added / removed |
| --- | --- | --- | --- |
| `aenoran_duties` | Aenoran Duties | `consumer_goods_factor` 0.03, `political_power_gain` −0.05 | Start (history); swapped by *Charter of the Guilds* |
| `guild_charter` | Charter of the Guilds | `production_factory_efficiency_gain_factor` 0.05, `political_power_gain` 0.05 | *Charter of the Guilds* |
| `sea_markets` | Markets Across the Sea | `trade_opinion_factor` 0.10, `consumer_goods_factor` −0.03 | *Markets Across the Sea* |
| `western_arsenal` | Arsenal of the West | `industrial_capacity_factory` 0.05, `war_support_factor` 0.03 | *Arms for the West* |
| `wagon_forts_drill` | Wagon-Forts | `army_defence_factor` 0.05, `supply_consumption_factor` −0.05 | *Wagon-Forts* |
| `guilds_abroad` | The Guilds Abroad | `army_org_factor` 0.05, `army_morale_factor` 0.05 | *The Guilds Across the Sea*, 180 days |
| `parim_market` | A Market in Parim | `consumer_goods_factor` −0.03, `political_power_gain` 0.05 | Event `kradlon_market`, option *Open the market* |

### Events (namespace `zin_regional_kradlon`)

| Id | Key | Title | To | Trigger | Options |
| --- | --- | --- | --- | --- | --- |
| 1 | `kradlon_market` | The Guilds of Kradlon Ask for a Market | Aenor realm | *Trade Before Grudge* | **Open the market** (AI 50): Kradlon gets `parim_market`; the realm +25 political power. **Refuse**: Kradlon grudge +10 |

`zin_west.10` (*A Protest from the West*) belongs to the mechanic; this tree fires it with Kradlon as FROM (dependency).

### Historical AI route

| Period | Focuses |
| --- | --- |
| 1748 | the_guild_moot, workshops_of_the_west, the_tariff_quarrel, guild_militia |
| 1749 | the_guilds_petition, count_the_duties, the_guilds_remember, masters_of_the_forges, the_journeymen |
| 1750–1751 | arms_for_the_west, forge_rows, the_wagon_works, the_first_guildsmans_chain, voices_at_the_ford (once the council sits) |
| 1752–1754 | the_great_hammer_halls, hulls_from_kradlon, charter_of_the_guilds, coal_and_ore_carts, crossbow_guilds, wagon_forts |
| 1755 | the_guild_pledge, arm_the_western_host, the_guilds_across_the_sea |
| 1756–1760 | stranded_journeymen (if stranded), the_long_road_home, leftovers |

The AI never takes `trade_before_grudge` or `heed_the_warning` on the historical path.

---

## Corogon

**Tree** `regional_corogon` · 5 states · men · Light (`zin_light_council`, elections every 48 months) · ruler **Consul Sobra Canak** (proposed, characters spec) · 32 focuses · grid x 0–19, y 0–7.

### Situation in 4A 1748

Corogon is a council realm of five harbour states on the southern West Lands coast. Its consuls are chosen by the ship-owners and the quays (proposed), and Consul Sobra Canak speaks for them now. Corogon trades with Aenor across the wide sea and with the islands of the Pupor Ocean, and Parim's tariffs squeeze it hard (grudge 50). Its counting-houses lend to half the West. It has ships, money and no army worth the name.

### Role

- **Historical path (proposed):** Corogon remembers the tariffs, sends delegates and hulls to the Ford Council and pays much of the crossing fleet. It pledges a host (grudge 50) and crosses.
- **War of the Last Crowns:** Corogon's purse is spent on the Crossing; its stranded marines may join Eindil's coalition.
- **Alternatives:** a merchants' peace under an Aenoran charter; ships for the Western Relief.

### Court and characters

| Id | Name | Role | Source |
| --- | --- | --- | --- |
| `<Corogon tag>_zin_ruler` | Consul Sobra Canak | Country leader, `zin_light_council` | characters spec (proposed) |
| `zin_regional_corogon_lio` | Captain Lio Marren | Navy leader, skill 3, traits `inshore_fighter`, `blue_water_expert`; recruited by *Sea-Captains of Corogon* | this spec (proposed) |
| `zin_regional_corogon_ves` | Ves Doran, Banker of the Quays | Political advisor, trait `zin_adv_merchant_prince`; recruited by *The Counting-Houses* | this spec (proposed) |

Start spirit (country history): `tariff_squeeze`.

### Tree

| Branch | Columns | Rows | Opens | Drives |
| --- | --- | --- | --- | --- |
| A. The Consuls | 0–3 | 0–3 | start | Court; elections; Raerby embassy |
| B. Southern Trade | 4–7 | 0–3 | start | Trade; island routes with Pollos |
| C. The Merchant Fleet | 8–11 | 0–3 | start | Navy; hulls for the West |
| D. Tariffs and the Sea | 12–16 | 0–3 | start; exclusive | Grudge; charter or crossing purse; relief |
| E. The Harbour Guard | 17–19 | 0–2 | start | Army |
| F. The Purse Spent | 8–11 | 5–7 | the stranger, the Crossing, the stranded | Late |

**A. The Consuls.** Icons: `council_table`, `harbour_lake`, `ledger_coins`, `envoy`, `charter_free`.

- `the_consuls` **The Consuls of Corogon** (1,0) 70d: political power 75. AI 100.
- `the_harbour_assembly` **The Harbour Assembly** (0,1) ← the_consuls: stability 0.03.
- `the_counting_houses` **The Counting-Houses** (2,1) ← the_consuls: political power 50; recruit `zin_regional_corogon_ves`.
- `elections_at_the_harbour` **Elections at the Harbour** (1,2) ← the_harbour_assembly, the_counting_houses: event `harbour_election`.
- `consul_canaks_embassy` **Consul Canak's Embassy** (2,2) ← the_counting_houses: available Raerby exists; event `corogon_embassy` to Raerby.
- `the_consular_charter` **The Consular Charter** (1,3) 70d ← elections_at_the_harbour: swap spirit `tariff_squeeze` → `consular_charter`.

**B. Southern Trade.** Icons: `harbour_lake`, `sea_charts`, `market_stalls`, `envoy`.

- `southern_trade` **Southern Trade** (5,0): building naval_base 1 random_coastal. AI 25.
- `the_island_routes` **The Island Routes** (4,1) ← southern_trade: available Pollos exists; event `island_routes` to Pollos.
- `spice_and_salt` **Spice and Salt** (6,1) ← southern_trade: political power 50.
- `the_market_quays` **The Market Quays** (5,2) ← the_island_routes, spice_and_salt: building industrial_complex 1 capital.
- `consulates_abroad` **Consulates Abroad** (5,3) ← the_market_quays: spirit `consulates`.

**C. The Merchant Fleet.** Icons: `shipwright_yard`, `anchor_rope`, `warship_sail`, `galley_oars`.

- `merchant_fleet` **The Merchant Fleet** (9,0): building dockyard 1 random_coastal. AI 20.
- `convoy_charters` **Convoy Charters** (8,1) ← merchant_fleet: political power 25; spirit `convoy_charters_kept`.
- `sea_captains_of_corogon` **Sea-Captains of Corogon** (10,1) ← merchant_fleet: recruit `zin_regional_corogon_lio`; navy experience 10.
- `the_long_keels` **The Long Keels** (9,2) 70d ← convoy_charters, sea_captains_of_corogon: building dockyard 1 random_coastal; research {zin_cat_warships} 0.5×1.
- `war_galleys_of_corogon` **War Galleys of Corogon** (11,2) ← sea_captains_of_corogon: research {zin_cat_galleys} 0.5×1.
- `hulls_for_hire` **Hulls for Hire** (9,3) ← the_long_keels: available `zin_west_council`; fleet +5; political power 25. AI 30; hist ×2.

**D. Tariffs and the Sea.** Icons: `toll_house`, `charter_golden`, `coin_chest`, `ship_voyage`, `banner_league`.

- `tariffs_and_the_sea` **Tariffs and the Sea** (14,0): grudge +3 self. AI 20.
- ★ `the_merchants_peace` **The Merchants' Peace** (12,1) ← tariffs_and_the_sea; exclusive with the_sea_remembers.
- ★ `the_sea_remembers` **The Sea Remembers** (16,1) ← tariffs_and_the_sea; exclusive with the_merchants_peace.
- `under_parims_charter` **Under Parim's Charter** (12,2) ← the_merchants_peace: available flag `zin_regional_corogon_charter_signed`; spirit `parims_charter_ships`.
- `relief_from_the_south_sea` **Relief from the South Sea** (14,2) ← the_merchants_peace, the_sea_remembers: available `zin_west_route_relief`; LC +3; fleet +3. AI 50.
- `the_purse_of_the_crossing` **The Purse of the Crossing** (16,2) ← the_sea_remembers: available `zin_west_route_crossing`; fleet +5; political power −50. AI 50.
- `the_corogon_pledge` **The Corogon Pledge** (16,3) ← the_purse_of_the_crossing: available flag `zin_west_pledged`; manpower 3,000. AI 60.

**E. The Harbour Guard.** Icons: `levy_muster`, `sword_shield`, `bow_archers`.

- `harbour_guard` **The Harbour Guard** (18,0): manpower 2,000. AI 15.
- `sea_soldiers_of_corogon` **Sea Soldiers of Corogon** (17,1) ← harbour_guard: spirit `corogon_sea_soldiers`.
- `crossbow_decks` **Crossbow Decks** (19,1) ← harbour_guard: research {zin_cat_bows} 0.5×1.
- `the_harbour_host` **The Harbour Host** (18,2) 70d ← sea_soldiers_of_corogon, crossbow_decks: army experience 10.

**F. The Purse Spent.** Icons: `ship_voyage`, `coin_chest`, `banner_laid_down`.

- `a_ship_for_the_houseless_king` **A Ship for the King Without a House** (9,5): `allow_branch` `zin_eindil_awake`; available `zin_eindil_war_king`; regard +5; renown +2. AI 20.
- `the_crossing_purse_spent` **The Crossing Purse Spent** (11,5): available `zin_western_crossing`; timed spirit `crossing_purse` 180 days. AI 50.
- `corogons_stranded` **Corogon's Stranded Marines** (10,6) ← a_ship_for_the_houseless_king, the_crossing_purse_spent: available flag `zin_west_stranded` + `zin_eindil_returned`; join coalition. AI 300.
- `home_ports` **Home Ports** (10,7) ← corogons_stranded, the_crossing_purse_spent: available `zin_afrit_dead` or `zin_eindil_crowned`; stability 0.05. AI 60.

### Key focuses

| Key | Name | Prerequisites | Effects summary |
| --- | --- | --- | --- |
| `the_merchants_peace` | The Merchants' Peace | tariffs_and_the_sea | Exclusive with the_sea_remembers. Grudge −15 self; event `corogon_charter` to the Aenor realm that holds Parim. AI 15; hist ×0 |
| `the_sea_remembers` | The Sea Remembers | tariffs_and_the_sea | Exclusive. Grudge +5 self; unity +3. AI 40; hist ×10 |

### Spirits

| Key | Name | Modifiers | Added / removed |
| --- | --- | --- | --- |
| `tariff_squeeze` | Squeezed by Parim's Tariffs | `consumer_goods_factor` 0.02, `trade_opinion_factor` 0.10 | Start (history); swapped by *The Consular Charter* |
| `consular_charter` | The Consular Charter | `political_power_gain` 0.10, `stability_factor` 0.05 | *The Consular Charter* |
| `consulates` | Consulates Abroad | `political_power_gain` 0.05, `trade_opinion_factor` 0.10 | *Consulates Abroad* |
| `convoy_charters_kept` | Convoy Charters | `convoy_escort_efficiency` 0.10 | *Convoy Charters* |
| `parims_charter_ships` | Under Parim's Charter | `consumer_goods_factor` −0.03, `trade_opinion_factor` 0.10 | *Under Parim's Charter* |
| `crossing_purse` | The Crossing Purse | `naval_invasion_prep_speed` 0.10, `army_org_factor` 0.03 | *The Crossing Purse Spent*, 180 days |
| `corogon_sea_soldiers` | Sea Soldiers of Corogon | `amphibious_invasion` 0.10, `army_morale_factor` 0.03 | *Sea Soldiers of Corogon* |
| `island_trade` | The Island Routes | `trade_opinion_factor` 0.05, `consumer_goods_factor` −0.01 | Event `island_routes` accepted: on Corogon and Pollos, 730 days |

### Events (namespace `zin_regional_corogon`)

| Id | Key | Title | To | Trigger | Options |
| --- | --- | --- | --- | --- | --- |
| 1 | `harbour_election` | Election at the Harbour | Corogon | *Elections at the Harbour* | **The ship-owners win** (AI 60): political power 50. **The quays win**: stability 0.03 |
| 2 | `corogon_charter` | A Charter for Corogon's Ships | Aenor realm | *The Merchants' Peace* | **Grant it** (AI 50; 70 under Aurevan): Corogon flag `zin_regional_corogon_charter_signed`; Corogon grudge −5; the realm +25 political power. **Refuse**: Corogon grudge +10 |
| 3 | `corogon_embassy` | An Embassy from Corogon | Raerby | *Consul Canak's Embassy* | **Receive them** (AI 80): opinion modifier `zin_regional_corogon_embassy` (+15) both ways. **Not now**: nothing |
| 4 | `island_routes` | The Island Routes | Pollos | *The Island Routes* | **Open the routes** (AI 80): both get timed idea `zin_regional_corogon_island_trade` (730 days). **Keep the market for islanders**: nothing |

### Historical AI route

| Period | Focuses |
| --- | --- |
| 1748 | the_consuls, southern_trade, merchant_fleet, tariffs_and_the_sea |
| 1749 | the_sea_remembers, the_harbour_assembly, the_counting_houses, the_island_routes, spice_and_salt |
| 1750–1751 | elections_at_the_harbour, consul_canaks_embassy, the_market_quays, convoy_charters, sea_captains_of_corogon |
| 1752–1754 | the_long_keels, hulls_for_hire (once the council sits), the_consular_charter, consulates_abroad, war_galleys_of_corogon, the_purse_of_the_crossing |
| 1755 | the_corogon_pledge, the_crossing_purse_spent, harbour_guard |
| 1756–1760 | corogons_stranded (if stranded), home_ports |

The AI never takes `the_merchants_peace` on the historical path.

---

## Varnondor

**Tree** `regional_varnondor` · 4 states · men · Wild (`zin_wild_freeholds`) · ruler **King Oslin of Varnondor** (proposed, characters spec) · 32 focuses · grid x 0–19, y 0–8.

### Situation in 4A 1748

Varnondor is a small kingdom of four states on an eastern peninsula of the West Lands, facing the wide central sea. Its capes guard the approaches that Aenor's fleets once used (western crossing spec), and its old cape forts were built against Aenoran landings in the First Age (proposed). King Oslin keeps lighthouses burning on every headland. Varnondor's grudge (45) is the grudge of a watchman: it remembers where the enemy came ashore. Its harbours are the nearest western anchorages to the Middle Lands. It is at peace.

### Role

- **Historical path (proposed):** Varnondor opens its approaches to the West: a delegate at the Ford Council, staging harbours for the crossing fleet, a pledge to the Crossing.
- **War of the Last Crowns:** the fleets gather in Varnondor's harbours; its sea soldiers are among the first ashore; some are stranded.
- **Alternatives:** close the approaches and keep out of every war; or keep lanterns for Parim.

### Court and characters

| Id | Name | Role | Source |
| --- | --- | --- | --- |
| `<Varnondor tag>_zin_ruler` | King Oslin of Varnondor | Country leader, `zin_wild_freeholds` | characters spec (proposed) |
| `zin_regional_varnondor_sevra` | Lady Sevra of the Capes | Navy leader, skill 3, traits `spotter`, `inshore_fighter`; recruited by *The Sea Watch* | this spec (proposed) |
| `zin_regional_varnondor_tomas` | Cape-Warden Tomas Reed | Corps commander, skill 2, trait `naval_invader`; recruited by *Sea Soldiers of the Capes* | this spec (proposed) |

Start spirit (country history): `approach_watchers`.

### Tree

| Branch | Columns | Rows | Opens | Drives |
| --- | --- | --- | --- | --- |
| A. King Oslin's Court | 0–3 | 0–3 | start | Court |
| B. The Blue-Sea Approaches | 4–7 | 0–3 | start | Coast forts, lighthouses, sea watch |
| C. Harbours for the Host | 8–11 | 0–2 | start; one focus needs a sailing route | Naval bases, dockyards, the staging harbour |
| D. The Old Grudge | 12–16 | 0–3 | start; three-way exclusive | Open, close or watch for Parim |
| E. The Cape Levy | 17–19 | 0–2 | start | Army |
| F. The Fleets Gather | 8–12 | 5–8 | `zin_western_crossing` | The landing, the stranded |

**A. King Oslin's Court.** Icons: `crown_iron`, `council_table`, `harbour_lake`, `charter_old`.

- `king_oslins_court` **King Oslin's Court** (1,0) 70d: political power 75. AI 100.
- `the_cape_lords` **The Cape Lords** (0,1) ← king_oslins_court: political power 25.
- `the_kings_harbour` **The King's Harbour** (2,1) ← king_oslins_court: building naval_base 1 random_coastal.
- `old_landings_remembered` **The Old Landings Remembered** (1,2) ← the_cape_lords, the_kings_harbour: grudge +3 self; tooltip "Aenor's fleets came ashore on these capes in the First Age."
- `the_peninsula_crown` **The Peninsula Crown** (1,3) 70d ← old_landings_remembered: spirit `peninsula_crown`.

**B. The Blue-Sea Approaches.** Icons: `lighthouse`, `fort_wall`, `eye_watchful`, `beacon`.

- `the_approaches` **The Blue-Sea Approaches** (5,0): building coastal_bunker 1 random_coastal. AI 25.
- `lighthouses_of_the_capes` **Lighthouses of the Capes** (4,1) ← the_approaches: spirit `cape_lights`.
- `cape_forts` **Cape Forts** (6,1) ← the_approaches: building coastal_bunker 1 random_coastal, twice.
- `the_sea_watch` **The Sea Watch** (5,2) ← lighthouses_of_the_capes, cape_forts: recruit `zin_regional_varnondor_sevra`; navy experience 10.
- `watch_on_the_far_shore` **Watch on the Far Shore** (5,3) 70d ← the_sea_watch: spirit `far_shore_watch`.

**C. Harbours for the Host.** Icons: `harbour_lake`, `shipwright_yard`, `anchor_rope`, `compass_rose`.

- `harbours_for_the_host` **Harbours of the Peninsula** (9,0): building naval_base 1 random_coastal. AI 20.
- `the_staging_yards` **The Staging Yards** (8,1) ← harbours_for_the_host: building dockyard 1 random_coastal; if `zin_west_council`: fleet +2.
- `anchorages_of_the_peninsula` **Anchorages of the Peninsula** (10,1) ← harbours_for_the_host: building naval_base 1 random_coastal.
- ★ `the_muster_harbour` **The Muster Harbour** (9,2) 70d ← the_staging_yards, anchorages_of_the_peninsula.
- `pilots_of_the_approaches` **Pilots of the Approaches** (10,2) ← anchorages_of_the_peninsula: navy experience 10; research {zin_cat_galleys} 0.5×1.

**D. The Old Grudge.** Icons: `charter_old`, `fort_wall`, `banner_league`, `lighthouse`, `scroll_treaty`.

- `the_old_grudge` **The Old Grudge** (14,0): grudge +3 self. AI 20.
- ★ `close_the_approaches` **Close the Approaches** (12,1) ← the_old_grudge; exclusive with open_the_approaches, watch_for_parim.
- ★ `open_the_approaches` **Open the Approaches** (14,1) ← the_old_grudge; exclusive with the other two.
- ★ `watch_for_parim` **Lanterns for Parim** (16,1) ← the_old_grudge; exclusive with the other two.
- `the_neutral_capes` **The Neutral Capes** (12,2) ← close_the_approaches: political power 50; stability 0.03.
- `a_delegate_from_the_capes` **A Delegate from the Capes** (14,2) ← open_the_approaches: available `zin_west_council`; unity +3. AI 50.
- `the_kings_lanterns` **The King's Lanterns** (16,2) ← watch_for_parim: available flag `zin_regional_varnondor_parims_friend`; spirit `kings_lanterns`; political power 25.
- `the_varnondor_pledge` **The Varnondor Pledge** (14,3) ← a_delegate_from_the_capes: available flag `zin_west_pledged`; manpower 2,500. AI 60.

**E. The Cape Levy.** Icons: `levy_muster`, `sword_shield`, `bow_archers`.

- `the_cape_levy` **The Cape Levy** (18,0): manpower 2,000. AI 15.
- `sea_soldiers_of_the_capes` **Sea Soldiers of the Capes** (17,1) ← the_cape_levy: recruit `zin_regional_varnondor_tomas`; spirit `cape_sea_soldiers`.
- `bows_of_the_capes` **Bows of the Capes** (19,1) ← the_cape_levy: research {zin_cat_bows} 0.5×1.
- `the_peninsula_host` **The Peninsula Host** (18,2) 70d ← sea_soldiers_of_the_capes, bows_of_the_capes: army experience 10.

**F. The Fleets Gather.** Icons: `warship_sail`, `ship_voyage`, `fort_wall`, `banner_laid_down`.

- `the_fleets_gather` **The Fleets Gather** (10,5): available `zin_western_crossing`; political power 50; fleet +3. AI 200.
- `first_ashore` **First Ashore** (9,6) ← the_fleets_gather: available flag `zin_west_pledged`; timed spirit `first_ashore_host` 180 days. AI 100.
- `the_capes_hold` **The Capes Hold** (11,6) ← the_fleets_gather: available no flag `zin_west_pledged`; building coastal_bunker 1 random_coastal; stability 0.03. AI 50.
- `stranded_on_the_far_shore` **Stranded on the Far Shore** (9,7) ← first_ashore: available flag `zin_west_stranded` + `zin_eindil_returned`; join coalition. AI 300.
- `the_capes_remember` **The Capes Remember** (10,8) ← first_ashore, the_capes_hold, stranded_on_the_far_shore: available `zin_afrit_dead` or `zin_eindil_crowned`; stability 0.05; political power 50. AI 60.

### Key focuses

| Key | Name | Prerequisites | Effects summary |
| --- | --- | --- | --- |
| `the_muster_harbour` | The Muster Harbour | the_staging_yards, anchorages_of_the_peninsula | Available `zin_west_route_crossing` or `zin_west_route_relief`. Fleet +5; spirit `muster_harbour`. AI 50; hist ×2 |
| `close_the_approaches` | Close the Approaches | the_old_grudge | Exclusive with open_the_approaches, watch_for_parim. Spirit `approaches_closed`. AI 20; hist ×0 |
| `open_the_approaches` | Open the Approaches | the_old_grudge | Exclusive. Grudge +5 self; unity +3. AI 40; hist ×10 |
| `watch_for_parim` | Lanterns for Parim | the_old_grudge | Exclusive. Grudge −10 self; event `lanterns_on_the_capes` to the Aenor realm that holds Parim. AI 10; hist ×0 |

### Spirits

| Key | Name | Modifiers | Added / removed |
| --- | --- | --- | --- |
| `approach_watchers` | Watchers of the Approaches | `naval_detection` 0.10, `coastal_bunker_effectiveness_factor` 0.10 | Start (history); permanent |
| `peninsula_crown` | The Peninsula Crown | `political_power_gain` 0.10, `stability_factor` 0.05 | *The Peninsula Crown* |
| `cape_lights` | Lighthouses of the Capes | `naval_detection` 0.10, `spotting_chance` 0.05 | *Lighthouses of the Capes* |
| `far_shore_watch` | Watch on the Far Shore | `naval_detection` 0.15, `army_intel_factor` 0.10 | *Watch on the Far Shore* |
| `muster_harbour` | The Muster Harbour | `naval_invasion_prep_speed` 0.10, `naval_invasion_capacity` 5 | *The Muster Harbour* |
| `approaches_closed` | The Approaches Closed | `stability_factor` 0.05, `coastal_bunker_effectiveness_factor` 0.10 | *Close the Approaches* |
| `kings_lanterns` | The King's Lanterns | `political_power_gain` 0.05, `naval_detection` 0.05 | *The King's Lanterns* |
| `cape_sea_soldiers` | Sea Soldiers of the Capes | `amphibious_invasion` 0.15 | *Sea Soldiers of the Capes* |
| `first_ashore_host` | First Ashore | `amphibious_invasion` 0.15, `army_attack_factor` 0.05 | *First Ashore*, 180 days |

### Events (namespace `zin_regional_varnondor`)

| Id | Key | Title | To | Trigger | Options |
| --- | --- | --- | --- | --- | --- |
| 1 | `lanterns_on_the_capes` | Lanterns on the Capes | Aenor realm | *Lanterns for Parim* | **Accept their friendship** (AI 50; 70 under Aurevan): opinion +20 both ways; Varnondor flag `zin_regional_varnondor_parims_friend`. **Ignore them**: Varnondor grudge +5 |

### Historical AI route

| Period | Focuses |
| --- | --- |
| 1748 | king_oslins_court, the_approaches, harbours_for_the_host, the_old_grudge |
| 1749 | open_the_approaches, the_cape_lords, the_kings_harbour, lighthouses_of_the_capes, cape_forts |
| 1750–1751 | old_landings_remembered, the_sea_watch, the_staging_yards, anchorages_of_the_peninsula, a_delegate_from_the_capes |
| 1752–1754 | the_muster_harbour (after the route), pilots_of_the_approaches, watch_on_the_far_shore, the_peninsula_crown, the_cape_levy, sea_soldiers_of_the_capes |
| 1755 | the_varnondor_pledge, the_fleets_gather, first_ashore |
| 1756–1760 | stranded_on_the_far_shore (if stranded), the_capes_remember |

The AI never takes `close_the_approaches` or `watch_for_parim` on the historical path.

---

## Implementation

### Files

For each tree `<t>` in `regional_girdon`, `regional_lambin`, `regional_buldor`, `regional_kradlon`, `regional_corogon`, `regional_varnondor`:

| Path | What |
| --- | --- |
| `docs/design/focus/<t>.json` | Tree data, `"tier": "regional"`, `"countries": ["<Name>"]` |
| `common/national_focus/zin_<t>.txt` | Compiled tree |
| `common/ideas/zin_focus_<t>.txt` | Spirits (including ideas applied to other countries by events: `company_contract`, `island_trade`, `grain_contract`, `parim_market`) |
| `events/zin_<t>.txt` | Events |
| `common/scripted_effects/zin_<t>.txt`, `common/scripted_triggers/zin_<t>.txt` | Below |
| `common/opinion_modifiers/zin_<t>.txt` | Below |
| `common/decisions/categories/zin_regional_buldor.txt`, `common/decisions/zin_regional_buldor.txt` | Buldor only (needs the compiler's `decisions` block) |
| `localisation/english/zin_focus_<t>_l_english.yml` | All text |

### Tree-declared scripted effects

| Effect | Tree | Does |
| --- | --- | --- |
| `zin_regional_<name>_recruit` (`character`) | all | Recruits the named proposed character |
| `zin_regional_lambin_supply_convener` | Lambin | `send_equipment` 500 `zin_arms_equipment` to `global.zin_west_convener` (kept if Lambin is the convener) |
| `zin_regional_kradlon_arm_convener` | Kradlon | `send_equipment` 1,000 `zin_arms_equipment` to `global.zin_west_convener` (kept if Kradlon is the convener) |
| `zin_regional_buldor_sign_contract` / `_end_contract` | Buldor | Contract bookkeeping (variable `zin_regional_buldor_contracts`, idea on the employer, manpower and PP transfers) |

### Tree-declared scripted triggers

| Trigger | Tree | True when |
| --- | --- | --- |
| `zin_regional_girdon_truce_strong` | Girdon | `zin_west_truce_broken` not set and `global.zin_west_truce` ≥ 60 |
| `zin_regional_girdon_episodes_past` | Girdon | `global.zin_eindil_stage` ≥ 3 |
| `zin_regional_girdon_claimed` | Girdon | Gunwaith has a claim on any Girdon-owned state |
| `zin_regional_kradlon_is_coastal` | Kradlon | `any_owned_state = { is_coastal = yes }` |
| `zin_regional_buldor_contract_allowed` | Buldor | Target passes the route's filter (West only / any / Aenor realms and Lost Cause members) and is not a dark power |

### Opinion modifiers

| Key | Value | Notes |
| --- | ---: | --- |
| `zin_regional_girdon_brothers` | +25 | Girdon ↔ Gunwaith; permanent until war between them |
| `zin_regional_corogon_embassy` | +15 | Corogon ↔ Raerby; decays 0.5 a month |

### Mechanic calls and reads

Western Crossing: `zin_west_add_grudge`, `zin_west_add_truce`, `zin_west_add_unity`, `zin_west_add_fleet`; triggers `zin_west_historical`; flags `zin_west_truce_broken`, `zin_west_grey_ford_war`, `zin_west_ford_commission`, `zin_west_council`, `zin_west_route_crossing`, `zin_west_route_relief`, `zin_west_route_divided`, `zin_west_pledged`, `zin_western_crossing`, `zin_west_stranded`, `zin_west_buldor_west`; variables `zin_west_truce`, `zin_west_convener`; event `zin_west.10`. Journey: `zin_eindil_add_regard`, `zin_eindil_add_renown`, `zin_eindil_join_coalition`, `zin_eindil_friend`; flags `zin_eindil_awake`, `zin_eindil_war_king`, `zin_eindil_named`, `zin_eindil_heeded`, `zin_eindil_returned`; variable `zin_eindil_stage`. Diplomacy: `zin_lost_cause_add_strength`, `zin_diplo_is_dark_power`. Gunwaith tree: spirit `zin_gunwaith_war_thanes` (read by Girdon's commission event).

### `allow_branch` roots

`the_winter_ford_remembered` (Girdon), `a_stranger_on_the_downs` (Lambin), `the_stranger_at_the_forge` (Kradlon) and `a_ship_for_the_houseless_king` (Corogon) carry `allow_branch = global_flag zin_eindil_awake`. The journey effect that sets the flag calls `mark_focus_tree_layout_dirty` for every West Lands country.

### Game rules and defines

No new game rules; the trees read `zin_west_historical` (`zin_rule_west_route` and `zin_rule_historical_path`). No defines.

### Icons and pictures

All focus icons come from the shared catalog; no new keys. Event pictures: `grey_ford_truce` (Girdon), `generic_court` (court and election events), `western_crossing` (late events), `generic_peace` (envoys and contracts). All art is image-generated.

## AI

- Weights and "hist" factors are in each section. Route focuses gated on the mechanic's flags have high weights (100 to 300) so the AI follows the West's course as soon as it is set.
- Under `zin_rules_is_free`: the grudge choices weigh by grudge (*remember* = grudge, *trade* = 100 − grudge, ×0.5 with `zin_west_aenoran_gold`); Buldor's three routes weigh grudge (West), 50 (whoever pays) and Lost Cause strength (Parim); Varnondor's *Lanterns for Parim* weighs Eindil regard + 10; Girdon's three friends weigh opinion of Gunwaith, opinion of Aenor and opinion of Corogon + 50.
- AI Buldor sells at most one contract per 90 days.
- No tree here has the AI declare a war; wars come from the mechanic.

## Acceptance

1. The compiler accepts the six trees: focus counts as tabled (37, 33, 32, 32, 32, 32); unique keys and positions; prerequisites above their focuses; exclusives symmetric; days multiples of 7; no `raw` blocks.
2. The HOI4 Agent Tools focus inspector reports no errors; each tree renders cleanly.
3. On 1 Thaw 4A 1748: no focus in these trees creates a war goal or joins a war; no visible focus mentions the stranger; no text names Afrit.
4. Historical observer run: Girdon takes `defend_the_ford` within 60 days of the truce breaking and `brothers_across_the_ford` after the war-king's peace; Lambin takes `a_stranger_on_the_downs` and `host_the_peace_talks` in 4A 1750; Kradlon fires `zin_west.10` and takes `the_guilds_remember`; Corogon and Varnondor raise the western fleet by at least 10 between them by Thaw 1755; at least four of the six pledge to the Crossing; every stranded country among them takes its coalition focus within 60 days of `zin_eindil_returned`.
5. Scenario: Buldor on *Whoever Pays* sells a contract to a country at war; the employer has `company_contract` for 365 days; Buldor's count returns to 0 after the hidden event.
6. Scenario: Varnondor completes `close_the_approaches`; with `zin_rule_west_route = divided`, Varnondor never joins a war with Aenor before 1760.
7. Every modifier in the spirit tables exists in the game's modifier documentation; every engine effect and trigger named exists in the documentation.

## Open questions

1. **Lambin and the confederation.** The tree makes Lambin the likeliest leader of the Grey Ford Confederation by raising its regard. Does the owner have another western court in mind, or should the confederation stay unnamed?
2. **Lambin's old stations.** Is a ruined First Age Aenoran trading station on Lambin's coast a welcome proposal?
3. **Buldor's contracts.** Should the companies be able to serve Volgan or Afrit's realm for pay? The spec says no ("not a dark power").
4. **Kradlon's guilds.** The roster calls Kradlon a workers' realm. Is a league of guild towns under a First Guildsman the right Fourth Age reading?
5. **Varnondor as the staging port.** The spec makes Varnondor's harbours the crossing fleet's anchorage. Is the eastern peninsula the right place, given that where the fleets crossed is open?
6. **Girdon in the Crossing.** Girdon pledges only if its grudge reaches 45. Should it cross with Gunwaith on the historical path at all?
