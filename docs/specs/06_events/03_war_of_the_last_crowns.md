# The War of the Last Crowns: Events

**Status:** Ready. Reviewed 19 October 2026 against CONVENTIONS "Status"; integrated 19 October 2026. **Priority:** 5. **Phase:** 5.

## Purpose

The War of the Last Crowns is several wars that overlap (established), not one attack on one day. Each front already belongs to a mechanic: the West to the Western Crossing, the North to Lerendor and Zol's Mistake, the East to the eastern kings, the South to Volgan, the heir to Eindil's journey, the false god to Afrit. This spec is the event chain that runs through all of them, from the day the war begins (4A 1755) to Eindil's coronation (4A 1760):

1. the beginning and the five fronts;
2. Aenor beset; Afrit's flight and the King of the East; the western capture of Parim and the evacuation;
3. Eindil's return; Varner; the New Gods; Volgan's broken body;
4. Zol's manifestation, the shard, Lorien's last ride and Zol's withdrawal;
5. Afrit's return, the cliff, the claim to all Erdae;
6. the battle in the palace and the coronation.

For each beat it lists every event in order, with the owner, recipients, trigger, text gist, options and effects, flags and historical timing. It fixes the order where two specs claim the same moment, and adds cross-front story events no mechanic owns in the namespace **`zin_lastwar`** (contract addition: ids 10–113 used in ranges, the rest reserved; never starts a war).

The conventions C1 to C12 of [01_golden_king_and_succession.md](01_golden_king_and_succession.md) apply. The decisions of [INTEGRATION_DECISIONS.md](../INTEGRATION_DECISIONS.md) are applied throughout, in particular N1 (`zin_horos_sword_broken`), N2 (`zin_black_compact`), N3 (`zin_eindil_cast_down`), S1 (the Dominion of the East and its subjects), S2 (the Host of Eindil is Selen), S4 (Zol is "The Will of Zol" with numbered hosts), S6 (dragons fly in the air layer), and from the review to Ready O1 (Eindil moves to Aenor only at his coronation), O2 (the Afrit spec owns the palace rolls and `zin_afrit_die`), O4 (one owner per shared moment), R5 (one runner file per namespace) and R6 (the actor's owning spec times the actor). The endings that follow the coronation, or replace it, are in [04_endings.md](04_endings.md).

## Lore basis

| Fact | Status | Source |
| --- | --- | --- |
| Aenor is beset from several directions: the West crosses the wide sea and seizes the capital; eastern coalitions threaten the Magical Lands; the North Lands withdraw from the old alliance; Zol's dead advance from the north; Volgan retakes Mirolon and marches | established | *War of the Last Crowns*, *Fourth Age Canon Register* |
| The god-king abandons Aenor and takes power over an eastern host as King of the East; not every eastern state submits | established | same |
| The western occupation becomes untenable; the fleet evacuates; some eastern and western soldiers are stranded | established | *The Fourth Age of Erdae* IX |
| Zol's and Volgan's forces clash first, then briefly join against Eindil | established | same |
| Eindil returns on a dragon with Varner and Golbran; Glo and Horos's blade destroy Zol's dead; the surviving peoples form a desperate common army; he does not demand that the western and northern kingdoms give up their independence | established | same, X |
| Volgan casts Eindil down; Varner dies shielding the living from Zol's death-magic; Golbran spends nearly all his magic and lives | established (Golbran's survival proposed as the vault's continuity decision) | *Varner*, *Golbran* |
| The New Gods restore Eindil through Glo; he destroys Volgan's manifested body; whether Volgan's spirit survives is open | established; open | *War of the Last Crowns*, *Volgan* |
| Zol manifests bodily for a rare, costly moment, crushes the blue sword, is wounded by a shard; Lorien and ancient spirits die forcing him to withdraw; he is not slain | established | *Zol*, *Lorien* |
| Afrit returns from the East, cuts off Eindil's arm, casts him from a cliff, retakes the capital and claims kingship over all Erdae | established (which arm: open) | *The Last Battle in the Palace* |
| Eindil survives; with Alleria and Golbran he strips Afrit's artifacts in the palace; Golbran removes the Necklace; Eindil kills Afrit; Golbran gives his last life to save Eindil and dies; Eindil wears the Necklace and is crowned King of Aenor | established | same |
| The name War of the Last Crowns; the dates 1755–1760; Alleria finding Eindil below the cliff; the dragon entrusted by the elves; the Ring of Doors, Crown of Witnesses and Bracelet of the First Seal; the staged palace battle | proposed | vault proposal notes, *Fourth Age Chronology* |
| Every event, title, text, option and number below | **proposed** | this spec and the owners' specs |

**Kept open:** where the western fleets crossed and landed; which western ruler claimed the throne; which eastern kings followed Afrit willingly; Merovan's fate; what the King of Demons does; whether Volgan's spirit survives; what Zol is and what remains of him; who his servants are; how Zol manifests; which arm Eindil loses; how exactly he survives the fall; what Glo keeps after the sword breaks; what the Necklace does; what becomes of the temples, the stranded armies and the West after the war.

## Design

### The war in one table (historical path)

| When (proposed) | Beat | Owner | Main events |
| --- | --- | --- | --- |
| 1 Rainwake 1755 | The war begins | world | `zin_world.20`, `zin_lastwar.10`, `.11` |
| Rainwake 1755 | Volgan declares war on Mirolon | Volgan | `zin_dominion.10`, `zin_mirolon.10` |
| Sowing 1755 | Lerendor withdraws | Lerendor | `zin_leren.35` or `.36`, `zin_leren.30`–`.32`, `zin_lastwar.14` |
| Sowing – Goldfield 1755 | Zol's dead rise | Zol | `zin_mistake.10`, `.11`, `zin_leren.51`, `zin_dark.80`, `zin_lastwar.30` |
| Sowing – Goldfield 1755 | The Western Crossing | West | `zin_west.31`, `.40`–`.44`, `zin_lastwar.20`, `.21` |
| Goldfield 1755 | The eastern invasion | East | `zin_east.41`–`.43`, `zin_elves.70`, `.71` |
| Emberleaf – Mistfall 1755 | Mirolon falls; the march north | Volgan | `zin_dominion.11`, `.12`, `.24`, `zin_lastwar.40`, `.41` |
| By 1 Deepwinter 1756 | The East turns west | East | `zin_east.44` |
| Thaw – Rainwake 1756 | The god-king flees east; King of the East | Afrit, East | `zin_afrit.50`, `.43`, `.51`, `.53`, `.52`, `zin_aenor.300`, `zin_reign.86`, `.87`, `zin_east.50`, `.51`, `.45`, `zin_lastwar.50`–`.52` |
| Sowing 1756 | The Captains yield Parim to the West | West, Aenor | `zin_west.55`–`.57`, `zin_lastwar.60` |
| 1756 | The dead against the dead | Volgan, Zol | `zin_dominion.13`, `zin_lastwar.61` |
| Mistfall 1756 – Ironfrost 1757 | The western evacuation; the stranded | West | `zin_west.60`–`.66`, `zin_lastwar.62` |
| 1 Thaw 1757 | Eindil returns on a dragon | journey | `zin_eindil.90`–`.95`, `zin_east.46`, `zin_aenor.320` or `.321`, `zin_lastwar.70` |
| Rainwake 1757 | The Black Compact | Volgan, Zol | `zin_dominion.14`, `zin_mistake.16`, `zin_dominion.15`, `zin_lastwar.71` |
| 1 Highsun 1757 | Volgan casts Eindil down; Varner's last wards | journey, Volgan, magic | `zin_eindil.96`, `.97`, `zin_dominion.16`, `zin_world.40`, `zin_elves.51`, `zin_lastwar.72` |
| 1 Goldfield 1757 | The New Gods restore Eindil | journey, magic | `zin_eindil.98`, `zin_world.45` |
| 1 Harvest 1757 | Volgan's manifested body is destroyed | journey, Volgan | `zin_eindil.100`, `zin_dominion.17`, `.18`, `.19`, `.23`, `zin_war.7`, `zin_dark.82` |
| Harvest 1757 | Zol comes forth; the sword is crushed; the shard | Zol, journey | `zin_mistake.20`, `.21`, `zin_eindil.101`, `zin_war.6` |
| Harvest – Fallowing 1757 | Lorien rides and falls; Zol withdraws | Zol, Lands of the Sun | `zin_mistake.22`, `zin_sun.40`, `zin_lastwar.73`, `zin_mistake.23`, `zin_sun.42`, `zin_mistake.24`, `zin_lastwar.80` |
| Fallowing 1757 | Hailed as king | journey | `zin_eindil.102` |
| Deepwinter – Ironfrost 1758 | Afrit returns from the East | Afrit, East | `zin_afrit.60`, `zin_east.52`, `zin_lastwar.90` |
| Thaw 1758 | The cliff | Afrit, journey | `zin_afrit.61`, `zin_eindil.110`–`.112` |
| Thaw – Fallowing 1758 | Lord of all Erdae | Afrit | `zin_afrit.62`, `zin_lastwar.91`, `.92` |
| Fallowing 1758 | Eindil returns from the dead | journey | `zin_eindil.113` |
| Thaw 1759 | The battle in the palace | journey, Afrit | `zin_afrit.70`–`.75`, `zin_eindil.120`–`.126` |
| 1759 | After the false god | many | `zin_east.60`, `zin_west.70`, `zin_lastwar.110`–`.112` |
| Thaw 1760 | The coronation | Aenor, journey | `zin_eindil.130`, `zin_lastwar.113`, `zin_aenor.400`–`.402`, `zin_eindil.131` |

Dates are written pace-shifted from `zin_story_pace` (C7, V4).

### One owner per moment (reconciliation)

Rows marked **decision** apply [INTEGRATION_DECISIONS.md](../INTEGRATION_DECISIONS.md). The others are dependencies on the owner specs named; this is the order implemented, and each is reported to the integrator.

| Moment | Specs involved | Owner and order |
| --- | --- | --- |
| The crushing of the blue sword | journey, Zol `zin_mistake.21`, Glo, warfare `zin_war.6` | **Decisions N1, O4.** `zin_mistake.21` *One Finger* is the one event, shown to Zol and to the Host. Its immediate block sets **`zin_horos_sword_broken`** (its only setter) and fires `zin_eindil.101` to the Host, which applies the wound. The Glo spec's hall pulse sees the flag and runs `zin_glo_on_sword_broken`; the Glo spec has no event for this moment. `zin_war.6` fires when `zin_horos_sword_broken` is set, not on `zin_zol_manifested` (the blade is whole until then) |
| The clash of the two darks | Volgan `zin_dominion.13`, Zol | **Decision O4.** One clash: Volgan's `zin_dominion.13`; the Volgan pulse sets `zin_volgan_zol_clash` the first month the two are at war. Zol has no clash event; a player Zol may strike first by focus (Zol spec, `zin_zol_strike_volgan`) |
| The brief accord | Volgan `zin_dominion.14`–`.15`, Zol `zin_mistake.16` | **Decisions N2, O4.** The compact is offered once, by Volgan's `zin_dominion.14` (Volgan's focus). Zol's answer is the Zol spec's `zin_mistake.16` *The Brief Accord* (proposed), which `zin_dominion.14` fires for Zol; acceptance sets **`zin_black_compact`** and fires `zin_dominion.15` to Volgan |
| The accord ends | Volgan `zin_dominion.23`, Zol `zin_mistake.17` | `zin_dominion.23` only (sets `zin_black_compact_ended`); `zin_mistake.17` is retired |
| Lorien's death | Zol `zin_mistake.23`, Lands of the Sun | **Decision O4.** `zin_mistake.23` *Lorien Challenges Zol* is the world's one news of his death. `zin_sun_lorien_falls`, called from it, sends no death news of its own; it still fires `zin_sun.42` to the Gala Elves 14 days later |
| The cliff | Afrit `zin_afrit.61`, journey `zin_eindil.110` | **Decision N3.** `zin_afrit.61` (hub, private) only fires `zin_eindil.110` to the Host and, as a public variant, to the hub. `zin_eindil.110` sets **`zin_eindil_cast_down`** (the journey owns the cliff). `zin_afrit.62` reads it |
| The return from the East | journey, Afrit | Every reader uses the Afrit spec's `zin_afrit_returned`, the one flag for the return |
| The palace battle | Afrit `zin_afrit.70`–`.76` (stage rolls, defences); journey `zin_eindil.120`–`.127` (narrative) | The decision *Enter the Palace* calls `zin_afrit_begin_palace_battle`. Each Afrit stage resolves its roll; on success its immediate block fires the matching journey event to the Host (mapping below). On failure `zin_afrit.76` fires and `zin_eindil.127` follows to the Host |
| Afrit's death | Afrit, journey | **Decision O2.** The Afrit chain calls **`zin_afrit_die`** once, in the immediate block of its news `zin_afrit.75` after `zin_afrit.74` succeeds (the count is 0 by then, as the magic rule requires). `zin_eindil.124` is the Host's narrative of that moment, fired by `zin_afrit.75`; it calls nothing |
| The coronation | journey `zin_eindil.130`–`.131`; Aenor `zin_aenor.400`–`.402`, `zin_aenor_people_choose` | **Decision O1.** The journey stores the crowning realm (`zin_eindil_crowning_realm`); `zin_eindil.130` *The Crown Is Offered* goes to the Host and that realm and calls `zin_aenor_people_choose`; 7 days later `zin_aenor.400` *The Crown of Aen* runs `zin_aenor_crown_eindil`, which first moves Eindil to the realm (`zin_aenor_receive_eindil`) and then crowns him; `zin_aenor.401` is the news. `zin_eindil.131` becomes *The Host Comes Home* (dynamic Host only) |

### Act I: The war begins (Rainwake 4A 1755)

`zin_world.20` sets `zin_war_of_last_crowns` (world spec; HISTORICAL 1 Rainwake 1755, PLAUSIBLE by 1 Thaw 1756, FREE on conditions). The flag forces no war; each front's owner starts its own.

| Id | Title | To | Fired by | Hist. | Text gist | Options (effects; AI) |
| --- | --- | --- | --- | --- | --- | --- |
| `zin_world.20` | The War of the Last Crowns | news, every country | world tick | 1 Rainwake 1755 | "Crowns are arming on every shore. Old grudges have become plans, and old legends banners. Chroniclers will call this the War of the Last Crowns." Names no hidden power. Picture `GFX_zin_news_last_crowns` | **"So it begins."** |
| `zin_lastwar.10` | The Warnings Remembered | every country with `zin_eindil_heeded` or any `zin_sun_heeded_<sight>` | 3 days after `zin_world.20` | Rainwake 1755 | "A year ago [zin_loc_eindil] told our court what is happening now. We listened." Lands of the Sun variant: "The King of Gala's envoys told us what the water showed. We listened." | **"Then we are ready."** `add_war_support` 0.05; army experience +10 |
| `zin_lastwar.11` | Aenor Beset | the ruling Aenor realm | when two or more of `zin_western_crossing`, `zin_leren_withdrawal`, `zin_zol_rising`, `zin_volgan_marches`, `zin_eastern_invasion` are set; again at four | Goldfield 1755; Mistfall 1755 | "Sails in the west, oaths torn in the north, the dead on the northern coast, the south moving, eastern banners over the rift. The council must choose where Aenor fights first." | Each option sets a timed country flag (180 days) read by `common/ai_strategy/zin_lastwar.txt`: **"Hold the west shore."** `zin_lastwar_hold_west` (front requests on `zin_is_site_west_landing_isle` and `_shore` states); war support +0.03. **"Hold the north against the dead."** `zin_lastwar_hold_north` (`zin_is_site_strait_south` states and states bordering Zol). **"Hold the south against the Dominion."** `zin_lastwar_hold_south` (states bordering Volgan). **"Hold Parim and nothing else."** `zin_lastwar_hold_parim` (`zin_is_site_parim` and its neighbours); stability +0.03 (AI hist: Parim under Aurevan; west under the Captains; FREE 25 each) |
| `zin_lastwar.12` | The Concord Calls Its Levies | every Concord dominion | 30 days after `zin_world.20`, if Aenor is at war | Sowing 1755 | "Parim calls every dominion's levy. The charters say the crown may ask; they do not say the dominions must come." | **"Send the levy."** manpower −2,000; `zin_aenor_add_concord_loyalty` +5; Aenor manpower +2,000 (AI loyalty ≥ 50: 80). **"Guard our own borders."** loyalty −5 (AI loyalty < 50: 70; Selen hist: guard, it is sheltering the heir) |
| `zin_lastwar.13` | Refugees on the Roads | every Middle Lands country | the runner counts two or more front flags set and an enemy division in a `zin_is_region_middle_lands` state | Highsun 1755 | "The roads to the Great Lake are full of carts. Nobody knows which way is safe." | **"Open the granaries."** −25 PP; stability +0.02 (AI 70). **"Close the roads."** stability −0.02; war support +0.02 (AI 30) |

### Act II: The five fronts

#### The North: the old alliance abandoned (Lerendor)

| Id | Title | To | Fired by | Hist. | Text gist | Options |
| --- | --- | --- | --- | --- | --- | --- |
| `zin_leren.35` / `.36` | (hidden) The Court Decides / The War and the Treaty | Lerendor (AI / human) | 30 / 14 days after the war | Sowing 1755 | As the Lerendor spec | As the Lerendor spec |
| `zin_leren.30`–`.32` | The Treaty of the Narrow Strait Is Ended; The North Withdraws; The Narrow Strait Treaty Ends | Lerendor, Aenor, all | `zin_leren_withdraw` | Sowing 1755 | "Lerendor has left the Treaty of the Narrow Strait. The North will hold its own shores." No war on Aenor | One option each |
| `zin_lastwar.14` | Northern Ships Turn Home | the ruling Aenor realm | 7 days after `zin_leren.31` | Sowing 1755 | "The Leren squadrons that watched the strait for Aenor sail home. The strait's southern forts are ours alone." | **"Man the forts."** −25 PP; `add_building_construction` `coastal_bunker` level 1 (`instant_build`) on the coastal provinces of every owned `zin_is_site_strait_south` state (AI 100). **"Let them go."** nothing |
| `zin_leren.33` | The Old Alliance Holds | news | honour route | divergence | "Lerendor keeps the old promise." | One option |

#### The North: the dead rise (Zol)

Zol speaks through no person (S4): his country is led by the emblem "The Will of Zol" and his armies are numbered hosts. No text names a commander or a servant.

| Id | Title | To | Fired by | Hist. | Text gist | Options |
| --- | --- | --- | --- | --- | --- | --- |
| `zin_mistake.10` | Whither the Dead | Zol | `zin_zol_rise` | Sowing – Goldfield 1755 | No person speaks. "The dead stand on every black isle. The tide turns south." | Aenor (hist) / Lerendor / the elven edge |
| `zin_mistake.11` | The Dead Come Out of the North | news, every country | rising | same | "Black hulls came ashore on the northern coasts. The fishermen were right." Picture `zol_rising` | **"So the fishermen were right."** |
| `zin_leren.51` | The Dead on the Northern Shore | Lerendor, coastal North Lands | rising | same | As the Lerendor spec | As there |
| `zin_dark.80` | Dead on the Dark Shore | coastal Dark Lands | rising | same | As the Dark Lands spec | As there |
| `zin_lastwar.30` | The Dead Do Not Stay Down | the ruling Aenor realm and every country at war with Zol, once each | first 30 days of war with Zol, before `zin_mistake.12` | Goldfield 1755 | "Our soldiers broke their ranks. In the morning the same ranks stood again." | **"Burn them."** war support +0.03 (AI 100). Leads into `zin_mistake.12` |
| `zin_mistake.12` | Ordinary Arms Fail | each country, once | 10,000 casualties inflicted on Zol without potent magic | 1755–1756 | "Steel breaks their shapes. It does not end them." | **"Then we need more than steel."** |
| `zin_war.4`, `.5` | Shapes That Will Not Stay Broken; Wards Against Death | as the warfare spec | rising | 1755 | As the warfare spec | As there |

#### The West: the Crossing

| Id | Title | To | Fired by | Hist. | Text gist | Options |
| --- | --- | --- | --- | --- | --- | --- |
| `zin_west.31` | The Call to Cross | West Lands countries | `zin_west_call_pledges` | Rainwake 1755 | "The Ford Council has chosen. The West will cross the wide sea to end the old quarrel with Aenor for good." | Pledge the host / Send ships, not men / Refuse |
| `zin_west.40`, `.41` | Where Shall the Host Land?; The Western Crossing | leader; news | launch | Sowing – Goldfield 1755 | "The western fleet has crossed the wide sea." Picture `western_crossing` | Aenor Isle first (hist) / Straight to the mainland shore |
| `zin_lastwar.20` | Sails Off Aenor Isle | Asgard; the ruling Aenor realm | the first sailing lands on a `zin_is_site_west_landing_isle` state | Goldfield 1755 | "The western host is ashore on Aenor Isle." Asgard variant: "Our harbours were the first the Aenoran ships reached, long ago. Now the western ships take them." | Asgard: **"Fight from every quay."** war support +0.05 (AI 70). **"Spare the harbour towns."** `add_compliance` +5 in every Asgard state the West controls (AI 30). Aenor: **"Send the lake fleet."** −25 PP; timed flag `zin_lastwar_hold_west` (180 days) |
| `zin_west.42`, `.44` | Sails on the Western Sea; Storm and Sail | Aenor; leader | each sailing | 1755 | As the western spec | As there |
| `zin_lastwar.21` | The West Remembers | every West Lands country in the Crossing | 30 days after the first landing | Highsun 1755 | "Our grandfathers' grandfathers were ruled from Parim. Our sons are on its shore." | **"For the old claims."** war support +0.05. One option |

#### The East: across the rift

| Id | Title | To | Fired by | Hist. | Text gist | Options |
| --- | --- | --- | --- | --- | --- | --- |
| `zin_east.41`–`.43` | (hidden) The Coalition Gathers; The Eastern Coalition Asks; The Crossing of the Rift | runner; candidate courts; news | the eastern spec's section 5 | Goldfield 1755 | "Eastern banners have crossed the rift sea into the Magical Lands." | As the eastern spec |
| `zin_elves.70`, `.71` | Sails on the Rift Sea; Elven Envoys at the Gate | elves, Aenor; Aenor, Kingson | `zin_eastern_invasion` | Goldfield 1755 | As the elves spec | As there |
| Magical Forest tree | *Wings Over the Woods* (the one Dragon Pact of 4A 1755) | Magical Forest | focus | 1755 | As the tree | — |
| `zin_east.44` | The Host Turns West | news | 120 days after `zin_eastern_invasion`, or 1 Deepwinter 1756 | Deepwinter 1756 | "The eastern host has turned from the elven woods toward Aenor." Sets `zin_east_turns_west` | One option |

#### The South: Mirolon falls; the march

| Id | Title | To | Fired by | Hist. | Text gist | Options |
| --- | --- | --- | --- | --- | --- | --- |
| `zin_dominion.10` | Out of the Storms | Volgan, Mirolon | Volgan declares war on Mirolon | Rainwake 1755 | "The storms of the Dead Lands open. An army greater than any since the First Age comes out of them." | Applies surprise spirits |
| `zin_mirolon.10` | The Storm Comes | Mirolon | focus *The Storm Comes* | Rainwake 1755 | "To the passes!" | One option |
| `zin_lastwar.40` | The Passes Burn | every Middle Lands and Dead Lands country, and Aenor (country event) | Volgan first controls a `zin_is_site_mirolon_passes` state | Highsun 1755 | "Mirolon's watchtowers on the passes are burning. For twenty years Mirolon told the north this day would come." | **"Mirolon was right."** One option; Aenor variant adds **"Send the Lost Cause south."** −50 PP; `send_equipment` 1,000 `zin_arms_equipment` to Mirolon (`infantry_equipment` until warfare stage 2) (AI 0 under Aurevan, 50 under the Captains) |
| `zin_dominion.11`, `.24` | Mirolon Falls; A Court in Exile | news; Mirolon | Mirolon taken | Emberleaf 1755 | "Mirolon has fallen. Its court lives on in exile." Sets `zin_mirolon_fallen` | As the Volgan spec |
| `zin_dominion.12` | The March North | news | `zin_volgan_begin_march` | Mistfall 1755 | "The south is moving." | One option |
| `zin_lastwar.41` | Herez Holds the Marches | Herez | `zin_volgan_marches` and Herez at war with Volgan | Mistfall 1755 | "The southern marches of the Concord face the whole Dominion." | **"Hold every ford."** war support +0.10; timed idea `zin_lastwar_marches_hold` (180 days: `army_core_defence_factor` +0.10, `dig_in_speed_factor` +0.20) (AI 80). **"Fall back to the Great Lake."** nothing (AI 20) |

### Act III: The god-king flees; Parim falls to the West (4A 1756)

S1 applies: Afrit's realm is the Worshipdom under the cosmetic name "the Dominion of the East"; courts that kneel become its subjects with the autonomy state `zin_autonomy_eastern_client`, not faction members. Which courts kneel is decided in each game.

| Id | Title | To | Fired by | Hist. | Text gist | Options (effects; AI) |
| --- | --- | --- | --- | --- | --- | --- |
| `zin_afrit.50` | Aenor Cannot Hold | Worshipdom (private) | pressure or 1 Thaw 1756 | Thaw 1756 | See [01](01_golden_king_and_succession.md) | Checkpoint 17: Hold for now / Go east (hist) / Flee to the hermitage / Stand in Parim |
| `zin_afrit.43` | The Name Behind the Deliverer | news | `zin_afrit_reveal` (the flight calls it if the name is still secret) | by Thaw 1756 | "The god the kingdom worshipped is Afrit, son of Ein." Picture `unmasking` | One option |
| `zin_afrit.51` | The Deliverer Comes East | each eastern candidate | flight | Thaw 1756 | "Afrit, who ruled Aenor as its god, asks our court to kneel and name him King of the East." | Checkpoint 17: Refuse / Kneel (calls `zin_east_prepare_kneel` first; becomes a subject, S1) (Afrit spec table) |
| `zin_afrit.53` | The Chancellor's Choice | Worshipdom | flight | Thaw 1756 | Merovan follows or stays; 50/50; his fate is open | Follows / Stays |
| `zin_afrit.52` | A King in the East | news | 30 days after the flight | Rainwake 1756 | "In the East, kings have knelt to Afrit and named him King of the East. Not every eastern crown agrees." Picture `eastern_court` (gate `zin_afrit_abandoned_aenor`) | One option |
| `zin_aenor.300` | The Throne Abandoned | Aenor | `zin_afrit_abandoned_aenor` (flight east or to the hermitage) | Thaw 1756 | "The King has gone east. The captains of the Lost Cause hold the seals." | As the Aenor spec |
| `zin_reign.86`, `.87` | The Captains' Regency; Empty Temples in Parim | Aenor | after `.300` | Rainwake 1756 | See [01](01_golden_king_and_succession.md) | |
| `zin_east.50`, `.51`, `.45` | A King in the East; First of the Free Crowns; The Coalition Breaks | courts | proclamation | Sowing 1756 | As the eastern spec | As there |
| `zin_lastwar.50` | The False God Gone | every Concord dominion | 7 days after `zin_aenor.300` | Rainwake 1756 | "The god who wore Aenor's crown has fled east. The Captains in Parim ask the dominions to hold." | **"Hold with the Captains."** `zin_aenor_add_concord_loyalty` +10 (AI loyalty ≥ 40: 80). **"Every dominion for itself."** loyalty −15; below 25 the Aenor spec's secession runs (AI 20) |
| `zin_lastwar.51` | The Faithful Divided | every country with `zin_footholds` ≥ 3 that is not the Worshipdom or its subject | 14 days after `zin_afrit.52` | Sowing 1756 | "The Houses of the First Light are full of people who never knew whom they served. Some priests have gone east. Most are still feeding the poor." | **"Close the Houses."** `zin_afrit_purge_houses` (AI Light 60). **"Keep the hospitals, dismiss the priests."** `zin_afrit_add_footholds` −1; stability −0.01 (AI 30). **"Leave them be."** nothing (AI 10) |
| `zin_lastwar.52` | Eastern Banners in the Middle Lands | the ruling Aenor realm | the eastern host first controls a `zin_is_region_middle_lands` state | 1756 | "The eastern host that crossed the rift is in the Middle Lands now. Its banners are the King of the East's, or its own." | **"Fight them at the Wall."** timed flag `zin_lastwar_hold_wall` (180 days; front requests on `zin_is_site_great_wall` states); war support +0.03 |
| `zin_west.55`–`.57` | The Keys of Parim; Western Banners over Parim; The Throne of Men | Aenor; news; leader | Captains' Regency and western divisions near Parim, from Sowing 1756 | Sowing 1756 | "The Captains yield the city to spare it." "Western banners fly over Parim. Their leader claims the throne of men." The claimant is not named | As the western spec |
| `zin_lastwar.60` | Parim Under Western Banners | the ruling Aenor realm (now at its fallback seat) | `zin_west_parim_taken` | Sowing 1756 | "The Captains' Regency rules from [ROOT.Capital.GetName]. Parim's people watch the westerners and count the days until the dead or the south arrive." | **"We will take it back."** war support +0.05 (AI 100) |

### Act IV: Crushed between (1756 to early 1757)

| Id | Title | To | Fired by | Hist. | Text gist | Options (effects; AI) |
| --- | --- | --- | --- | --- | --- | --- |
| `zin_dominion.13` | The Dead Against the Dead | Volgan; news to others | the Volgan spec's condition (reconciliation, O4) | 1756 | "The dead of the north and the hosts of the south met in the Middle Lands, and fell on each other." No reason given; only what is seen | As the owner; sets `zin_volgan_zol_clash` |
| `zin_lastwar.61` | Crushed Between Two Darks | every Middle Lands country with Zol and Volgan divisions in its states | `zin_volgan_zol_clash` and both have divisions in the Middle Lands | 1756 | "Between the dead from the north and the hosts from the south, there is nowhere left to stand." | **"Hold on."** war support +0.05; stability −0.05 (AI 100). `zin_world_add_gathering_dark` +1 once (global flag `zin_story_done_lastwar_61`) |
| `zin_west.60` | The Shore Calls | West leader | strain, or 1 Mistfall 1756 | Mistfall 1756 | "The dead in the north, the Dominion in the south, eastern banners in the east: Parim cannot be held." | Sail home (hist) / Hold what we took |
| `zin_west.61`–`.66` | The Fleet at the Shore … The Western Fleet Sails Home | members, Aenor, all | evacuation | Mistfall 1756 – Ironfrost 1757 | "Some sailed home. Some were still on the march when the fleet left." | As the western spec |
| `zin_lastwar.62` | Stranded Beside the Conquered | every country with `zin_west_stranded`, and every East Lands country still at war in the Middle Lands after `zin_east.45` | 30 days after `zin_west_evacuated` | Ironfrost 1757 | "Our soldiers who missed the ships are camped beside the Aenorans they fought a season ago. Both are fighting the dead now." | **"They are our men still."** −25 PP; war support +0.03 (AI 60). **"They chose their road."** nothing (AI 40) |

### Act V: The return of the king without a kingdom (Thaw 1757)

Stage 9 of the journey. The battles below fire on their historical dates under the historical rule even if the conditions are not met; under the dynamic rule they wait for their conditions ([eindil_journey.md](../04_mechanics/eindil_journey.md), stage 9).

**The Host (S2).** On the historical path the Host of Eindil is Selen: Eindil leads Selen's armies as its field marshal and ruler-in-waiting, and Selen keeps its ruler. If Selen no longer exists, the Host is the sworn country; only if there is none is a dynamic country created (journey step 2). The Host moves `zin_varner` and `zin_golbran` from the Magical Forest to its own advisors when it is raised.

| Id | Title | To | Fired by | Hist. | Text gist | Options (effects; AI) |
| --- | --- | --- | --- | --- | --- | --- |
| `zin_eindil.90` | On Dragon's Wings | news, every country | stage 9 (`zin_eindil_advance_stage` sets `zin_eindil_returned` first) | 1 Thaw 1757 | "A dragon came down over the northern front with three riders: a man with a green light at his breast, an old wizard, and a small purple companion. The man leapt down and struck the earth with a blue sword. The dead around him fell and did not rise." | **"The heir has come back."** / Volgan's and Zol's variant: **"Who is this?"** |
| `zin_eindil.91` | The Wave of Glo | the Host, Zol | `.90` + 1 day | Thaw 1757 | "A wave of green light ran across the ground. A whole front of the dead was unmade." Calls the Glo spec's `zin_glo_wave` (`first` = 1) on the battlefield state; no Zol or warfare effect takes part | One option |
| `zin_eindil.92` | Raise the Host of Eindil | Selen (S2) | `.90` + 1 day | Thaw 1757 | "Selen swore to raise the heir's host. He is here." | **"Raise the Host."** cosmetic name "The Host of Eindil"; spirit `zin_eindil_host_of_the_heir`; claims on Aenor-cored states; Eindil its field marshal (hist). **"Stand beside him, remain ourselves."** Selen keeps its name and claims nothing; Eindil still leads its armies. Both: the magic spec grants one dragon flight (`zin_war_grant_dragons` amount 1, air layer, S6) |
| `zin_eindil.93` | Ride with the Heir | human players with regard ≥ 50 whose country is not the Host | after the Host exists | Thaw 1757 | "Will you ride with the heir?" | Switch to the Host (`change_tag_from`) / Keep our country |
| `zin_eindil.95` | Give the Lost Cause to the Heir | the Lost Cause's leader, if the Lost Cause has become a faction (S3) | `.92` + 7 days | Thaw 1757 | "The league the Golden King founded for his own glory asks to serve the heir. Its frontier captains were already at his fires." | **"Give it to him."** the faction passes to the Host; sets `zin_lost_cause_with_eindil` (hist). **"The league is the crown's."** the Host founds its own coalition. If the Lost Cause is still Aenor's institution, the Host founds the coalition and this event does not fire |
| `zin_eindil.94` | The Coalition of the Living | every country with regard ≥ 25; every country with stranded armies (`zin_west_stranded`, `zin_east_companies_with_eindil`, Lerendor's free companies) | `.92` + 7 days | Thaw 1757 | "The heir asks every crown that fights the dead and the south to stand together. He asks no crown to kneel, and no kingdom to give up its own." | **"Stand together."** `zin_eindil_join_coalition` (AI 30 + regard, +40 stranded, +15 with `zin_west_remembers_war_king`; hist: friends and stranded accept). **"We fight our own war."** nothing |
| `zin_east.46` | Abandoned Companies | eastern countries at war in the Middle or Magical Lands | `zin_eindil_returned` | Thaw 1757 | As the eastern spec | Let them serve the stranger / Order them home |
| `zin_aenor.320` / `.321` | The Hailed King / The Host Rises | Aenor | `zin_eindil_returned` | Thaw 1757 | "Aenoran survivors hail him as king." | As the Aenor spec (hist: hail him). The hailing changes no leader: Eindil stays Selen's general until his coronation (O1) |
| `zin_lastwar.70` | Beside Former Foes | every coalition member that was at war with an Aenor realm in the last 365 days | 30 days after joining | Rainwake 1757 | "Our captains share a fire with Aenorans they fought last year. Nobody speaks of it." | **"For now, we are one army."** army experience +10; `add_opinion_modifier` `zin_lastwar_beside_former_foes` (+20) toward every Aenor realm in the coalition |
| `zin_dominion.14`, `zin_mistake.16`, `zin_dominion.15` | The Black Compact; The Brief Accord; The Compact Holds | Zol, Volgan | Volgan's focus after `zin_eindil_returned` (the one offer, O4) | Rainwake 1757 | Text reports only what is seen: "The dead of the north and the hosts of the south have stopped fighting each other." | Zol answers in `zin_mistake.16`: Accept (hist) / Refuse; acceptance sets `zin_black_compact` (N2) and fires `zin_dominion.15` |
| `zin_lastwar.71` | Two Darks, One Field | every coalition member | `zin_black_compact` | Rainwake 1757 | "The dead and the Dominion no longer fight each other. They fight us." | **"Then we fight both."** war support +0.05; `zin_world_add_gathering_dark` +2 once |

#### Volgan casts Eindil down; Varner's last wards

| Id | Title | To | Fired by | Hist. | Text gist | Options |
| --- | --- | --- | --- | --- | --- | --- |
| `zin_eindil.96` | Volgan at the Southern Front | the Host, Volgan; coalition members (country event) | Eindil's army borders or stands in a Volgan-controlled state; hist 1 Highsun 1757 | Highsun 1757 | Host: "Volgan himself stood on the southern front. 'You swear that men are united,' he said, 'and in a hundred years their sons come to me asking help against their brothers.' 'Because these men have chosen to stand together,' said Eindil. 'Then I will bury them together.' His blast threw the heir to the ground." (Vault dialogue, proposed wording.) Fires `zin_dominion.16` to Volgan and `.97` | **"Carry him from the field."** Eindil's journey traits suspended 60 days; Host timed spirit `zin_eindil_heir_has_fallen` (60 days) |
| `zin_dominion.16` | Then I Will Bury Them Together | Volgan | `.96` | Highsun 1757 | "The champion of men is down." | **"Bury them."** timed spirit `zin_dominion_champion_falls`; sets `zin_volgan_struck_down_eindil` |
| `zin_eindil.97` | Varner's Last Wards | the Host, the Magical Forest; coalition members | with `.96` | Highsun 1757 | "The dead rolled down from the north while the heir lay on the field. Varner stood in their way. He lifted curses, opened roads for the living, and held until there was nothing left of him to hold with. His small companion poured his own magic into the wards and fell beside him. Those who saw thought both were dead." | **"The wizard is gone."** sets `zin_varner_dead`; calls `zin_world_raise_varners_wards`; Host country flag `zin_golbran_spent` (Golbran lives, unseen); `retire_character` `zin_varner` and `zin_golbran` |
| `zin_world.40` | Varner's Wards Hold | the Host and its allies | `zin_world_raise_varners_wards` | Highsun 1757 | "For ninety days the living march where the dead cannot follow." | One option |
| `zin_elves.51` | The Wizard Is Gone | Magical Lands elves | `zin_varner_dead` | Highsun 1757 | "The wizard of the Unbinding died in the Middle Lands, shielding men." | One option |
| `zin_lastwar.72` | Where Is Golbran? | the Host | 30 days after `.97` | Goldfield 1757 | "Nobody has seen the wizard's small companion since the wards fell. Alleria's scouts found no body." Keeps his survival a question for the player | **"Keep looking."** nothing; Golbran is hidden until the palace |

#### The New Gods

| Id | Title | To | Fired by | Hist. | Text gist | Options |
| --- | --- | --- | --- | --- | --- | --- |
| `zin_eindil.98` | The Gathering of the New Gods | the Host | 30 days after `.96`, needs `zin_glo_state` = 1 | 1 Goldfield 1757 | "The heir did not wake. His friends say his spirit went somewhere else. Through the green light at his breast, the New Gods gathered around him. He could not see them all clearly. Last came one whose voice he knew from the crystal: Glernaen, the New God of Power and Wisdom. 'What will you do if you rise?' 'I will return to them.' 'Then carry what we can give. You may yet fall, and we cannot promise to raise you again.'" No god but Glernaen is named; no face is described | **"He rises."** sets `zin_eindil_restored`; `zin_world_grant_new_gods_gift`; trait `zin_eindil_blessed_of_the_new_gods`; `zin_glo_add_power` to 100; portrait restored |
| `zin_world.45` | The Gods' Gift | the Host | `.98` | Goldfield 1757 | "The heir's eyes shine with lightning. The sword of Horos burns brighter than it ever did in the guardian's hand." | One option |
| `zin_eindil.99` | The Heir Does Not Rise | news | `.98`'s date without Glo in state 1 | divergence | "The heir did not wake. In this telling of the age, the war goes on without him." Sets `zin_eindil_lost` | One option |

#### Volgan's broken body

| Id | Title | To | Fired by | Hist. | Text gist | Options |
| --- | --- | --- | --- | --- | --- | --- |
| `zin_eindil.100` | The Blue Sword Through Volgan | the Host, Volgan | 30 days after `.98`, Eindil's army fighting Volgan's or in a Volgan state; hist 1 Harvest 1757 | Harvest 1757 | "The restored heir broke the southern host's engines and its commanders, then met the Great Spirit again. This time the blue sword went through him. Volgan's body broke apart, and a storm of magic tore through the southern host." | **"His body is broken."** calls `zin_volgan_destroy_body` |
| `zin_dominion.17` | The Body Breaks | news | `zin_volgan_destroy_body` | Harvest 1757 | "Volgan's manifested body is destroyed. What remains of him, no one living can say." Picture `volgan_broken` | **"What remains, no one can say."** |
| `zin_dominion.18`, `.23`, `.19` | Old Allegiances; The Compact Ends; The Steward's Choice | members; Volgan, Zol; Volgan | body destroyed | Harvest 1757 | As the Volgan spec | As there |
| `zin_war.7` | (hidden) | Volgan | body destroyed | Harvest 1757 | Removes his presence company | — |
| `zin_dark.82` | The South Falls Silent | sworn Dark Lands countries | body destroyed | Harvest 1757 | As the Dark Lands spec | As there |

The text of every event above keeps Volgan's spirit open: "his body broke", never "Volgan is dead" (C4).

### Act VI: The Old God comes forth (Harvest 1757)

Zol's spec owns the manifestation. On the historical path, Zol manifests within 7 days of `zin_volgan_body_destroyed` (catch-up). Lorien's challenge follows 14 days after his ride (the Zol spec's gap).

| Id | Title | To | Fired by | Hist. | Text gist | Options (effects; AI) |
| --- | --- | --- | --- | --- | --- | --- |
| `zin_mistake.20` | Zol Comes Forth | news, every country | `zin_zol_manifest` | Harvest 1757 | "The sky went dark over the battlefield. Something that had no body took one, for a time. Witnesses do not agree on what they saw." No shape is described. Picture `vast_shadow` | **"Hold the line."** |
| `zin_mistake.21` | One Finger | Zol; the Host | 7 days after `.20`, Zol at war with the Host, `zin_glo_with_eindil` (without Glo, `zin_zol_manifest` fires `zin_eindil.101` itself and nothing breaks) | Harvest 1757 | "The heir charged. The dark stopped him with one finger, took the blue sword and crushed it into glittering shards. It took him by the throat and the light in his armour dimmed. With what strength he had left, he caught a shard of the broken blade and drove it into the form the dark had made. A shard of the broken blade still carried Glernaen's power. The form shook." | **"…"** sets `zin_horos_sword_broken` (N1); Zol +5 then −15 power; mission −21 days; fires `zin_eindil.101` to the Host |
| `zin_eindil.101` | The Old God Comes Forth | the Host | `zin_mistake.21`, or `zin_zol_manifest` when Eindil carries no Glo | Harvest 1757 | "The heir is down, badly wounded. The dead are overrunning the field." | **"Hold the field for him."** `zin_eindil_wound` 120 days; Host war support −0.05. Sets no flag; the Glo spec's pulse applies the broken sword (Glo power to 25, cap 50) |
| `zin_war.6` | The Blade Is Broken | the Host | `zin_horos_sword_broken` | Harvest 1757 | "Horos's sword is shards. The light of Glo still burns, but dimmer." | One option |
| `zin_mistake.22` | The Old Lords Ride | Gala Elves | `zin_zol_manifested`, Lorien alive | Harvest 1757 | "Word has come from the north: an Old God walks. Lorien rises from his seat." | Checkpoint 23 (C9): **"This is not our war."** is written first (below), then **"We ride, for all the living."** `zin_sun_lorien_rides` (sets `zin_lorien_rides`; `zin_diplo_lift_refusal` on the Gala Elves); `zin_potent_magic` 30 days; `.23` in 14 days (hist 100, else 80). **"This is not our war."** nothing |
| `zin_sun.40` | The Old Lords Ride | news | `zin_sun_lorien_rides` | Harvest 1757 | "The King of Gala has ridden north with the oldest lords of the world." Nothing says he will die | One option |
| `zin_lastwar.73` | Lorien on the Field | the Host; every coalition member | 7 days after `zin_sun.40` | Fallowing 1757 | "Elves in white and gold, and things older than elves, came onto the field. They did not come to restore any crown. They came because an Old God's victory would end the freedom of every living people." | **"They came."** The Old Powers Stand (Lands of the Sun spec) already applies; war support +0.05 |
| `zin_mistake.23` | Lorien Challenges Zol | news, every country | 14 days after `.22` A | Fallowing 1757 | "Lorien, King of Gala, who fought at Dardan, challenged the Old God directly and died in the struggle. Other ancient lords were broken beside him. The Old God withdrew." | **"…"** calls `zin_sun_lorien_falls` (sets `zin_lorien_dead`; `zin_sun.42` in 14 days; no other death news, O4), then `zin_zol_withdraw` |
| `zin_sun.42` | After the King | Gala Elves | 14 days after the fall | Fallowing 1757 | As the Lands of the Sun spec | As there |
| `zin_mistake.24` | Zol Withdraws | news, every country | `zin_zol_withdraw` | Fallowing 1757 | "He withdrew into the dark of his domain. He was not slain. He left a wasteland and a continent full of dead." | **"Bury the dead."** |
| `zin_mistake.25` | The Form Is Spent | Zol; news | other withdrawal causes | divergence | "The form could not last." | One option |
| `zin_lastwar.80` | A Field Full of Dead | every Middle Lands country; every coalition member | 14 days after `zin_mistake.24` or `.25` | Fallowing 1757 | "The dead of the north have lost their hold or gone home. The Dominion's hosts are scattered. The living count who is left." | **"Bury them all, ours and theirs."** −25 PP; stability +0.03 (AI 70). **"Rebuild the walls first."** `add_building_construction` `bunker` level 1 (`instant_build`) on the capital state's provinces (AI 30) |
| `zin_eindil.102` | Hailed as King | coalition | after `zin_mistake.24` or its skip | Fallowing 1757 | "When the soldiers helped the heir to his feet, nobody on that field doubted that he had earned the crown of Aenor." | **"Hail the king."** renown +10; every member regard +10 |

**Divergences.** If Lorien does not ride, the form burns out by itself (`zin_mistake.25`) and Lorien lives; text does not comment. If Eindil is not at war with Zol when Zol manifests, `zin_mistake.21` does not fire and the sword is not broken; the Zol spec's other ends apply.

### Act VII: The second betrayal (4A 1758)

| Id | Title | To | Fired by | Hist. | Text gist | Options (effects; AI) |
| --- | --- | --- | --- | --- | --- | --- |
| `zin_afrit.60` | The Return from the East | Worshipdom (private) | `zin_afrit_return` | Deepwinter – Ironfrost 1758 | "Volgan's body is broken. The Old God has withdrawn. Your brother is wounded. Aenor lies open." | One option; `zin_afrit_return` sets `zin_afrit_returned` |
| `zin_east.52` | The King Calls His Host | eastern subjects of the Dominion of the East | `zin_afrit_returned` | Ironfrost 1758 | As the eastern spec | Send levies / Send gold / Delay |
| `zin_lastwar.90` | The King of the East Marches West | news, every country | 7 days after `zin_afrit_returned` | Ironfrost 1758 | "Afrit has come back from the East with a new host. He demands that the exhausted kingdoms recognise him as ruler of the East and the Middle Lands." | **"Never."** (coalition); **"So be it."** (his subjects); others: **"Watch."** |
| `zin_afrit.61` | Brother Against Brother | Worshipdom (private) | `zin_afrit_returned`, the hub at war with the country that employs `zin_eindil`, the hub's side controls a Middle Lands state | Thaw 1758 | "Your brother is on the cliff road, weak from the Old God's hand." Private: Afrit tells him he hated him since their father's refusal. The refusal is not explained | One option; immediate: fires `zin_eindil.110` (which sets `zin_eindil_cast_down`, N3) |
| `zin_eindil.110` | The Cliff | the Host; public variant to the hub | `zin_afrit.61` | Thaw 1758 | "The brothers met on a cliff road above a gorge. [zin_loc_deliverer] took one of the heir's arms with a single stroke, drove a blade through him and threw him over the edge. He watched him fall and did not look for a body." Which arm is never said | **"…"** sets `zin_eindil_cast_down` (N3); suspends Eindil's role (`retire_character`, re-recruited by `.113`); Host spirit `zin_eindil_king_is_dead`; if Eindil led a country, a regent leads (Aenor: `zin_aenor_regency_while_king_lost`; a dynamic Host: Alleria, else its previous leader); fires `.111` in 3 days and `.112` in 7 days |
| `zin_eindil.111` | Below the Cliff | Alleria's employer (Selen on the historical path) | `.110` + 3 days | Thaw 1758 | "Alleria will not believe what the soldiers say. She takes her scouts down the gorge by night." (Proposed rescue) | **"Search the ravine."** he is found; `.113` in 180 days (hist). **"Mourn him."** `.113` in 365 days. If no country employs Alleria, `.113` fires in 365 days |
| `zin_eindil.112` | Word of the King's Death | news, every country | `.110` + 7 days | Thaw 1758 | "They say the heir of Aen fell from a cliff in the Middle Lands. They say no man could live through such a fall." | One option |
| `zin_afrit.62` | Lord of All Erdae | news, every country | `zin_eindil_cast_down` and `zin_afrit_holds_parim` (forced under the historical rule by 1 Fallowing 1758) | Rainwake – Fallowing 1758 | "Afrit has retaken Parim. He proclaims himself king of Aenor, of the East and of every people of Erdae. The claim is larger than the lands he holds." | One option; sets `zin_afrit_claims_erdae` |
| `zin_lastwar.91` | The Claim of All Erdae | every great power that is not the Worshipdom or its subject | 14 days after `zin_afrit.62` | 1758 | "Envoys from Parim demand that our court recognise Afrit as king over all Erdae." | **"Never."** `add_opinion_modifier` `zin_lastwar_refused_the_claim` (−50) toward Afrit's realm; war support +0.05 (AI 90). **"Send no answer."** nothing (AI 10). **"Recognise him."** only with footholds ≥ 4: joins nothing; `zin_lastwar_recognised_the_claim` (+25); `zin_world_add_gathering_dark` +1 (AI 0 under HISTORICAL) |
| `zin_lastwar.92` | Opposition Is Punished | every Concord dominion; every Middle Lands country Afrit's side controls a state of | 30 days after `zin_afrit.62` | 1758 | "In Parim the old council has resumed its work. Those who spoke against the false god have been taken." | **"Endure."** stability −0.03; `add_resistance` +5 in its states Afrit's side controls. One option |
| `zin_eindil.113` | The King Returns from the Dead | the Host; coalition members | recovery done | Fallowing 1758 | "The heir is alive. He has one arm, and a simpler sword, and wounds that would have killed any other man. The green light at his breast is dim but burning. Alleria's scouts carried him out of the gorge." | **"The king lives."** re-recruited by the Host; trait `zin_eindil_maimed_unbroken`; Host spirit removed; `zin_aenor_restore_hailed_king` if Aenor hailed him; portrait maimed |

### Act VIII: The battle in the palace (4A 1759)

The Host's decisions (category `zin_eindil_palace`: *Find the Old Service Passages*, *Rally the Palace Rebels*, *Enter the Palace*) open the chain. *Enter the Palace* calls `zin_afrit_begin_palace_battle` (needs `zin_afrit_claims_erdae` or `zin_afrit_stand_in_parim`). Each Afrit stage rolls (base and modifiers in the Afrit spec; every stage succeeds under the historical rule). The hub's defences are chosen in `zin_afrit.71`–`.74`. Picture `palace_battle` (gate rule below).

| Afrit stage | On success fires | Host event | Text gist | Effects |
| --- | --- | --- | --- | --- |
| `zin_afrit.70` The Palace Wards | — | — | Hub: "Someone is in the service passages." | starts stage 1 |
| `zin_afrit.71` The Eye and the Ring | `zin_eindil.120` | **An Arrow in the Eye** | "Afrit showed himself to direct the palace's defences. Alleria's arrow took him in the eye. While his protections healed it, Eindil seized his hand, cut off a finger and tore away a ring." | the Afrit stage calls `zin_afrit_lose_artifact` (ring) |
| `zin_afrit.72`, `.73` The Seals of the Crown; The Bracelet | `zin_eindil.121` (after `.73`) | **The Seals Broken** | "Alleria and the palace rebels broke the seals that fed the crown he wore. Eindil turned one of Afrit's own spells against the band on his wrist. Each loss made him bleed more easily." | the stages call `zin_afrit_lose_artifact` (crown, bracelet); count 1 |
| — | `zin_eindil.122` (fired by `.121`) | **Into the Private Realm** | "Afrit opened a passage out of the world with the necklace. Eindil caught its chain and was carried through with him, into a place that was Afrit's alone." | — |
| `zin_afrit.74` The Necklace | `zin_eindil.123` | **Golbran's Last Working** | "Afrit had the heir on the floor and his blade at his throat. Then a small purple figure, who had followed through the same passage, climbed onto his back and tore the necklace from his neck." Needs Golbran with the Host (country flag `zin_golbran_spent` or `zin_golbran` employed) and `zin_golbran_dead` not set; without him stage 4 fails (journey rule) | the stage calls `zin_afrit_lose_artifact` (necklace); count 0 |
| `zin_afrit.75` The False God Falls (news) | `zin_eindil.124` | **The Death of a False God** | "Without his artifacts Afrit was a mortal man of Aen's line. Eindil cut his throat. He died without a miracle." | none; the Afrit chain has already called `zin_afrit_die` (sets `zin_afrit_dead`) |
| — | `zin_eindil.125` (fired by `.124`) | **Golbran's Gift** | "Eindil was dying too. Golbran gave the last of his life and magic to close his worst wounds, and died beside the two brothers. Where he came from, nobody ever learned." | sets `zin_golbran_dead`; `zin_golbran` retired |
| — | `zin_eindil.126` (fired by `.125`) | **The Necklace** | "To find the way back from that place, Eindil put the necklace around his own neck. He came back into the palace carrying proof of the false king's fall, and an artifact whose price nobody knows." | sets `zin_eindil_wears_necklace`; no modifier (magic rule) |
| `zin_afrit.76` The Palace Holds | `zin_eindil.127` | **The Palace Holds** | "The attempt failed. Eindil escaped wounded through the passages." | Host stability −25% for 180 days (timed idea); the chain may restart after 180 days (the Afrit spec's timing, R6); a second failure sets `zin_eindil_lost` |

`zin_afrit.75` is the world's news. Its text after the reveal: "Afrit, who was worshipped as the Deliverer, is dead. His brother Eindil killed him in the palace of Parim." Every name in the chain goes through `[zin_loc_deliverer]` (C1), so the chain stays secret-safe on the stand-in-Parim route.

**Palace picture gate.** `palace_battle` is gated on `zin_afrit_returned`, but on the stand-in-Parim route the chain runs without a return. This spec requests the gate `zin_afrit_returned` or `zin_afrit_stand_in_parim`. The builder reads the gate from `presentation-cells.json`: while it does not admit `zin_afrit_stand_in_parim`, it writes `generic_war` for `.120`–`.127` and `zin_afrit.75`; once it does, `palace_battle`.

### Act IX: After the false god, and the coronation (4A 1759 to 1760)

| Id | Title | To | Fired by | Hist. | Text gist | Options (effects; AI) |
| --- | --- | --- | --- | --- | --- | --- |
| `zin_lastwar.110` | The False God Is Dead | every Concord dominion, every Light country | 7 days after `zin_afrit_dead` | 1759 | "[zin_loc_deliverer] is dead. His temples are full of people who loved a god that was never what they thought." No outcome for the temples is stated | **"Let the people mourn what they believed."** stability +0.02 (AI 60). **"Tear down his images."** `zin_afrit_purge_houses` if it has footholds; stability −0.02; war support +0.02 (AI 40) |
| `zin_east.60` | The King of the East Is Fallen | every East Lands court | `zin_afrit_dead` | 1759 | As the eastern spec | Text by status |
| `zin_west.70` | The Long Way Home | stranded countries | `zin_afrit_dead` or `zin_eindil_crowned` | 1759 | "In this telling" | Bring them home / Let those who wish stay |
| `zin_lastwar.111` | The Worshipdom Without Its God | the Worshipdom | 7 days after `zin_afrit_dead` | 1759 | "The hermitage is quiet. Ilvane keeps the doors open for the pilgrims who still come." (`zin_ilvane` leads, Afrit spec; N10) | **"Keep the doors open."** stability +0.03. Nothing is said about the Council's survivors (open) |
| `zin_lastwar.112` | Peace With the Living | every AI country on Afrit's side whose every war is with the Host's side | `zin_afrit_dead` | 1759 | The path spec's rule; no text beyond "The war that brought us here has no master now." | **"Enough."** `white_peace` with each enemy |
| `zin_eindil.130` | The Crown Is Offered | the Host and the crowning realm | the journey's `zin_eindil_go_to_parim` on or after its floor (1 Thaw 1760, pace-shifted), once it has set `zin_eindil_crowning_realm` | Thaw 1760 | "The captains, the lords of the dominions and the stranded soldiers of half of Erdae ask the heir to take the crown of Aenor." | **"For them, not for myself."** calls `zin_aenor_people_choose` (coronation in 7 days); fires `zin_lastwar.113` in 3 days |
| `zin_lastwar.113` | Envoys to the Coronation | every coalition member; every great power not at war with the Host; the Free Dominions | 3 days after `.130` | Thaw 1760 | "Parim invites every crown to the coronation of Eindil, son of Ein. Banners that faced each other a year ago will stand in one hall." | **"Send our envoy."** `zin_lastwar_coronation_envoy` (+20) toward Aenor; regard +5 (AI 70; regard ≥ 0). **"Send a letter."** nothing (AI 25). **"Stay away."** `zin_lastwar_coronation_snub` (−10) (AI 5) |
| `zin_aenor.400` | The Crown of Aen | the Host / Aenor | 7 days after `.130` | Thaw 1760 | "Eindil, son of Ein, grandson of Aen, is crowned King of Aenor in the ruins of Parim. Around his neck he wears the Necklace of the Abyss. Its price is not yet known." Picture: the Aenor spec's (see Pictures) | **"Long live the king."** `zin_aenor_crown_eindil`: Eindil becomes the realm's leader (O1), `zin_eindil_crowned` is set, portrait E7 crowned |
| `zin_aenor.401` | Eindil Is Crowned | news, every country | `.400` | Thaw 1760 | "The Fourth Age has a king of Aen's line again. His coronation did not erase the grievances of those who watched it." Picture `crown_of_aen` | One option |
| `zin_aenor.402` | A Charter of Equals | every Concord and Free Dominion | `.400` | Thaw 1760 | "The new king offers every dominion a Free Charter, or freedom. He forces neither." | Rejoin / Stay free |
| `zin_eindil.131` | The Host Comes Home | the dynamic Host of Eindil (if it exists) | `.400` | Thaw 1760 | "The Host of Eindil has a kingdom now. Its banners go into Aenor's." | One option; Aenor takes its states, units and player (`change_tag_from`). Selen as Host drops the cosmetic name and stays independent (journey stage 12) |
| `zin_eindil.132` | The Crown Withheld | the Host | Parim held by an enemy | divergence | "The crown waits in Parim, and Parim is not ours." | `create_wargoal` `take_state_focus` on Parim's state against its controller |

The world spec's ending check follows the coronation ([04_endings.md](04_endings.md)).

### Divergent wars (outside the historical path)

| Situation | What changes | Events |
| --- | --- | --- |
| Afrit stands in Parim (`zin_afrit_stand_in_parim`) | No flight, no King of the East; the West must storm Parim; the palace battle happens with Afrit already in Parim | `zin_west.55` does not fire; `zin_afrit.62` does not fire; the palace chain needs only `zin_afrit_stand_in_parim` |
| Afrit flees only to the hermitage (fewer than two eastern candidates) | No proclamation, no Dominion of the East; the return is weak | `zin_afrit.52`, `zin_east.50`–`.52`, `zin_lastwar.90` do not fire |
| Lerendor honours the treaty | Lerendor fights for Aenor; `zin_leren.33` | `zin_lastwar.14` does not fire |
| The West stays divided or sails in relief | No western capture of Parim; no stranded westerners | `zin_west.50`, `.51` (relief); `zin_lastwar.20`, `.21`, `.60` do not fire |
| Zol never rises (`DORMANT`) | No dead front; no manifestation; Lorien lives | the Zol rows do not fire; the journey skips the Zol battle |
| Volgan's body already destroyed or Volgan gone | Battles 1 and 3 skipped; the New Gods' restoration still needs a fall: none happens, so the gift is never given | `.96`, `.98`, `.100` skipped |
| No Glo with Eindil | No wave; the restoration fails | `zin_eindil.99`; `zin_eindil_lost` |
| The palace holds twice | `zin_eindil_lost`; Ashen Throne path (a) | `zin_eindil.127`; [04](04_endings.md) |
| The war never begins | Stage 9 is a quiet return on 1 Thaw 1758 | `zin_eindil.90` quiet variant: "The heir came home on a dragon. There was no battle to win, only a crown in the wrong hands." |

## Implementation

### Builder and files

| Path | Written by | Content |
| --- | --- | --- |
| `tools/content/data/events/lastwar.json` | data (proposed location) | The `zin_lastwar` events: id, title and text keys with variant triggers, recipients rule, firing (runner condition or parent), window, picture key, options (effects as data, `ai_chance` by rule) |
| `tools/content/modules/events_lastwar.mjs` | new module (this spec) | Writes the files below from the data; applied in the builder's single transaction (`tools/content/build.mjs`, `tools/content/apply.mts`) |
| `events/zin_lastwar.txt` | `events_lastwar.mjs` | Namespace `zin_lastwar`; every event fired by an effect, a parent or the story runner (C5); none uses `mean_time_to_happen` |
| `common/scripted_effects/zin_lastwar_story.txt` | `events_lastwar.mjs` | `zin_story_tick_lastwar` (R5, C6: `zin_<ns>_story.txt`; `zin_story.txt` holds only `zin_story_tick`): the runner block for `.10`–`.14`, `.30`, `.40`, `.41`, `.50`–`.52`, `.60`–`.62`, `.70`, `.71`, `.80`, `.90`–`.92`, `.110`–`.112`; sets `zin_story_done_lastwar_<id>` / `zin_story_seen_lastwar_<id>` (C6). Called by `zin_story_tick` ([01](01_golden_king_and_succession.md)) |
| `common/ideas/zin_lastwar.txt` | `events_lastwar.mjs` | `zin_lastwar_marches_hold` |
| `common/opinion_modifiers/zin_lastwar.txt` | `events_lastwar.mjs` | `zin_lastwar_beside_former_foes` (+20), `zin_lastwar_refused_the_claim` (−50), `zin_lastwar_recognised_the_claim` (+25), `zin_lastwar_coronation_envoy` (+20), `zin_lastwar_coronation_snub` (−10) |
| `common/ai_strategy/zin_lastwar.txt` | `events_lastwar.mjs` | `front_unit_request` entries enabled by the timed flags `zin_lastwar_hold_west`, `_north`, `_south`, `_parim`, `_wall`, with `state_trigger` on the site and region triggers named in `.11` and `.52` |
| `localisation/english/zin_lastwar_l_english.yml` | `events_lastwar.mjs` | Text (UTF-8 with BOM), with two-face variants for the reveal and the naming |

The owners' event texts go into their own modules and files (`zin_eindil` through `events_eindil.mjs`, see [02](02_eindil_journey.md)); this spec fixes their gist and order. Dates are 4A engine dates and need the calendar of [01_start_and_calendar.md](../00_foundation/01_start_and_calendar.md) (Ready, not yet in the game); this module is built in phase 5.

### Ids (`zin_lastwar`)

| Range | Use | Used |
| --- | --- | --- |
| 1–9 | Reserved (hidden helpers) | — |
| 10–19 | The war begins; Aenor beset | 10–14 |
| 20–29 | The West | 20, 21 |
| 30–39 | The dead in the north | 30 |
| 40–49 | The south | 40, 41 |
| 50–59 | The flight and the East | 50–52 |
| 60–69 | Crushed between; Parim taken; the stranded | 60–62 |
| 70–79 | The return and the coalition | 70–73 |
| 80–89 | After the two darks | 80 |
| 90–99 | The second betrayal | 90–92 |
| 100–109 | Reserved for palace flavour | — |
| 110–119 | After the false god; the coronation | 110–113 |
| 120–199 | Reserved (phase 8) | — |

### Hooks the owners must add (dependencies)

| Owner | Hook |
| --- | --- |
| Zol | `zin_mistake.21` sets `zin_horos_sword_broken` and fires `zin_eindil.101`; `zin_zol_manifest` fires `.101` when Eindil has no Glo; no clash event; `zin_mistake.16` is Zol's answer to `zin_dominion.14`; `.17` not used |
| Volgan | `zin_dominion.13` is the one clash event; `zin_dominion.14` is the one offer and fires `zin_mistake.16` for Zol (O4) |
| Glo | the hall pulse runs `zin_glo_on_sword_broken` on `zin_horos_sword_broken`; no Glo event for the moment |
| Warfare | `zin_war.6` fires on `zin_horos_sword_broken` |
| Lands of the Sun | `zin_sun_lorien_falls` sends no death news of its own when called from `zin_mistake.23` (O4) |
| Afrit | `zin_afrit.61` only fires `zin_eindil.110`; `zin_afrit.62` reads `zin_eindil_cast_down`; stages `.71`, `.73`, `.74` fire `zin_eindil.120`, `.121`, `.123`; `.75` calls `zin_afrit_die` and fires `zin_eindil.124`; `.76` fires `zin_eindil.127`; restart after 180 days |
| Journey | `zin_eindil.110` sets `zin_eindil_cast_down`; read `zin_afrit_returned`; never call `zin_afrit_die`; `zin_eindil_go_to_parim` sets `zin_eindil_crowning_realm` and fires `.130`, which calls `zin_aenor_people_choose`; `.131` repurposed; the Host is Selen (S2) |
| Aenor | `zin_aenor.300` fires on `zin_afrit_abandoned_aenor`; `zin_aenor.400` fires 7 days after `zin_aenor_people_choose`; `zin_aenor_eindil_can_be_crowned` accepts Eindil serving Selen (S2) and uses the journey floor 1 Thaw 1760; `zin_aenor_crown_eindil` moves Eindil to the realm first (O1) |
| World | `zin_story_tick` as step 9 of the monthly tick (its order lists 8 steps today) |

### Flags touched

Contract story flags in historical order: `zin_war_of_last_crowns`, `zin_leren_withdrawal`, `zin_zol_rising`, `zin_western_crossing`, `zin_volgan_marches`, `zin_afrit_revealed`, `zin_afrit_king_of_east`, `zin_eindil_returned`, `zin_varner_dead`, `zin_volgan_body_destroyed`, `zin_zol_manifested`, `zin_lorien_dead`, `zin_zol_withdrawn`, `zin_afrit_dead`, `zin_golbran_dead`, `zin_eindil_crowned`. Owners' flags: `zin_eastern_invasion`, `zin_east_turns_west`, `zin_mirolon_fallen`, `zin_afrit_abandoned_aenor`, `zin_west_parim_taken`, `zin_west_evacuated`, `zin_west_stranded`, `zin_volgan_zol_clash`, `zin_black_compact`, `zin_black_compact_ended`, `zin_volgan_struck_down_eindil`, `zin_eindil_restored`, `zin_horos_sword_broken`, `zin_lorien_rides`, `zin_afrit_returned`, `zin_eindil_cast_down`, `zin_afrit_claims_erdae`, `zin_afrit_lost_*`, `zin_eindil_wears_necklace`, `zin_lost_cause_with_eindil`. Internal: `zin_lastwar_hold_<front>` (timed country flags), `zin_story_done_lastwar_<id>`, `zin_story_seen_lastwar_<id>`.

### Pictures

Bare ids are `zin_lastwar`; other namespaces are written out. Owners' events not listed keep the picture their spec names. A gated key is used only by events that cannot fire before its flag; a flag set by the firing effect before the event is called counts as set.

| Events | Key |
| --- | --- |
| `.10`, `.11`, `.13`, `.61`, `.62`, `.80` | `generic_war` |
| `.12`, `.50` | `concord_council` |
| `.14` | `generic_sea` |
| `.20`, `.21`, `.60` | `western_crossing` (gate `zin_western_crossing`) |
| `.30` | `zol_rising` (gate `zin_zol_rising`) |
| `.40` | `mirolon_passes`; requested `passes_burning` |
| `.41` | `dead_lands_storm` |
| `.51`, `.110` | `houses` |
| `.52` | `generic_war` |
| `.70`, `.71`, `.72` | `dragon_return` (gate `zin_eindil_returned`) |
| `.73` | `vast_shadow` (gate `zin_zol_manifested`) |
| `.90` (news), `.91` | `eastern_court` (gate `zin_afrit_abandoned_aenor`) |
| `.92`, `.113` | `generic_court` |
| `.111` | `hermitage` |
| `.112` | `generic_peace` |
| `zin_eindil.90` (news), `.91`–`.95`, `.102`, `.113` | `dragon_return` (gate `zin_eindil_returned`) |
| `zin_eindil.96`, `.97`, `.99` (news), `.100`, `.132`, `.140` (news) | `generic_war` |
| `zin_eindil.98` | `dragon_return`; requested `gods_gathering` |
| `zin_eindil.101` | `vast_shadow` (gate `zin_zol_manifested`) |
| `zin_eindil.110`, `.111` | `cliff` (gate `zin_eindil_cast_down`, set by `zin_afrit.61` first) |
| `zin_eindil.112` (news) | `GFX_zin_news_generic_war` until `cliff` has a news crop (requested) |
| `zin_eindil.120`–`.127` | `palace_battle` or `generic_war` (gate rule in Act VIII) |
| `zin_eindil.130`, `.131` | `lost_cause_triumph` |
| `zin_aenor.400` | `coronation` (the Aenor spec's choice; the gate `zin_eindil_crowned` of `crown_of_aen` is set only inside its option) |
| `zin_aenor.401` | `crown_of_aen` (`zin_aenor_crown_eindil` sets the gate before it fires the news, E5) |

**Requested pictures (catalog additions).**

| Key | Shows | Gate | Used by | Until then |
| --- | --- | --- | --- | --- |
| `gods_gathering` | Shafts of light from clouds over a fallen armoured man; no figures, no faces | `zin_volgan_struck_down_eindil` | `zin_eindil.98`, `zin_world.45` | `dragon_return` |
| `passes_burning` | Watchtowers burning on a mountain pass at dusk | `zin_war_of_last_crowns` | `zin_lastwar.40` | `mirolon_passes` |
| `cliff` news crop | The existing picture, news crop | `zin_eindil_cast_down` | `zin_eindil.112` | `GFX_zin_news_generic_war` |
| `palace_battle` gate widened | The existing picture; gate `zin_afrit_returned` or `zin_afrit_stand_in_parim` | as named | `zin_eindil.120`–`.127`, `zin_afrit.75` on the stand-in-Parim route | `generic_war` on that route |

### Engine names used

Effects: `country_event`, `news_event`, `set_global_flag`, `set_country_flag` (with `days`), `add_war_support`, `add_stability`, `add_political_power`, `add_manpower`, `army_experience`, `add_timed_idea`, `add_opinion_modifier`, `add_compliance`, `add_resistance`, `add_building_construction` (`coastal_bunker`, `bunker`), `send_equipment`, `white_peace`, `create_wargoal`, `change_tag_from`, `retire_character`, `recruit_character`, `create_dynamic_country`. Triggers: `has_global_flag`, `has_country_flag`, `has_war_with`, `controls_state`, `divisions_in_state`, `is_subject_of`, `has_capitulated`. AI: `common/ai_strategy` with `front_unit_request` and `state_trigger`. Modifiers: `army_core_defence_factor`, `dig_in_speed_factor`. All exist in 1.19.3.

## AI

- Every `zin_lastwar` choice that matters takes the hist option under `zin_rules_is_historical` (C8); PLAUSIBLE uses the C8 weights; FREE weights are in the tables.
- `zin_lastwar.11` sets AI front requests for 180 days only; the path spec's war-direction strategies stay in force.
- `zin_lastwar.112` is the path spec's rule that AI countries make white peace once Afrit is dead.
- No `zin_lastwar` event starts a war; wars start only through the owners' effects.

## Acceptance

Build tests run with `npm test` in `tools/`; run checks use the isolated Linux run.

1. **Ids and options (build).** `events/zin_lastwar.txt` holds exactly the used ids of the id table, all unique; every option has localisation and an `ai_chance`; no event has `mean_time_to_happen`.
2. **Firing (build).** Every `zin_lastwar` event is fired from `zin_story_tick_lastwar`, a parent or an owner effect, and every runner condition includes `has_global_flag = zin_war_of_last_crowns`.
3. **Retired names (build).** No generated file contains a name from the contract register's retired table (the name check, N16), a `zin_mistake` event with id 15 or 17, or a Glo event for the sword-break.
4. **Pictures (build).** Every event names a key in `presentation-cells.json`; news events use news-crop keys; gated keys follow the gate rule, including the palace rule of Act VIII.
5. **Text (build scan).** No text says Volgan died or survived; no text describes Zol's form or names a servant or commander; no text says which arm Eindil lost or what the Necklace does; no text names a western claimant or an eastern king as Afrit's willing follower; no text reachable before `zin_afrit_revealed` by a non-Worshipdom country contains "Afrit" outside `[zin_loc_deliverer]`.
6. **References and engine names (build).** Every event id, scripted effect and trigger referenced exists in a generated file or its owner's data; every engine name above appears in the 1.19.3 documentation or the game's `common/` folders.
7. **War start (Linux scenario: 1 Ironfrost 1755, historical, one year).** No `zin_lastwar` event fires before `zin_war_of_last_crowns`; `zin_lastwar.10` fires 3 days after `zin_world.20`; `.11` fires once two front flags are set.
8. **Sword and compact (Linux scenario: 1 Rainwake 1757, Eindil returned, Selen the Host, one year).** `zin_black_compact` is set only by `zin_mistake.16` accept, after `zin_dominion.14`; `zin_horos_sword_broken` is set by `zin_mistake.21` only, and `zin_war.6` fires after it; Lorien's death produces one news event.
9. **Palace (Linux scenario: 1 Thaw 1759, Eindil recovered, Afrit holding Parim, one year).** The Host events fire once each, in order 120 to 126; `zin_afrit_die` runs once, from `zin_afrit.75` after `zin_afrit.74`; a failed stage blocks the restart for 180 days; `zin_afrit_artifacts` is 0 when `zin_afrit_dead` is set; `zin_eindil.130` and `zin_aenor.400` follow, and `zin_eindil_crowned` is set in 4A 1760.
10. **Divergences (Linux scenarios).** Each divergent-war row runs from its console setup without `zin_path_stalled` being set.
11. **Path (the path spec's three-seed historical observer run).** The contract flags appear in the order of "Flags touched"; every event in the act tables fires within 60 days of its historical month.

## Open questions

These proceed on the labelled proposals; the owner's answers go to [OPEN_QUESTIONS.md](../OPEN_QUESTIONS.md), section "events".

1. Should Alleria's rescue below the cliff be the historical text, and should Golbran be believed dead between Varner's death and the palace (question 10)? Proposal: yes to both; `zin_eindil.111` shows the rescue and `zin_lastwar.72` keeps Golbran unseen.
2. May players read Afrit's cliff words, given that the reason for the refusal is open (question 11)? Proposal: only the hub reads them, in `zin_afrit.61`, and they do not explain the refusal.
3. May foreign crowns recognise Afrit's claim to all Erdae (question 12)? Proposal: yes, only with footholds ≥ 4, never under HISTORICAL.

Settled by [INTEGRATION_DECISIONS.md](../INTEGRATION_DECISIONS.md) and applied above: the sword flag (N1), the compact flag (N2), the cliff flag (N3), the Host (S2). The 14-day gap between the ride and the challenge is the Zol spec's.
