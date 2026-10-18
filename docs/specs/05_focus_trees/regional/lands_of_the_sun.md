# Lands of the Sun Regional Trees

**Status:** Draft. **Priority:** 6. **Phase:** 6 (tier B).

## Purpose

This spec defines the seven tier B focus trees of the Lands of the Sun: **The Lands of Light, Poyang, Godland, Hengyang, Elvana, Goodin and Heaven**. Six are Sunhot realms; Goodin is a realm of men, the Goodin Sunfolk. Each tree has a unique core and copies whole modules of the shared tree [../shared/shared_lands_of_the_sun.md](../shared/shared_lands_of_the_sun.md) (modules S1 to S10). They play the Lands of the Sun mechanic ([../../04_mechanics/lands_of_the_sun.md](../../04_mechanics/lands_of_the_sun.md)) beside the Gala Elves' major tree ([../major/gala.md](../major/gala.md)): the Noon Council and its concord, the Noon League, Lorien's counsel and the Mirror's clarity, the Deliverer's healers, and the long border the Lands of Light share with the East.

## Lore basis

**Established** (vault): the Lands of the Sun lie far in the south-west and run beyond the southern map edge; Elvana, Igara, Hengyang, the Sea of Gods, Heaven, Flame and Godland are named there; the Sunhot elves are over three metres tall and among the strongest and most peaceful peoples of Erdae; the Goodin Sunfolk are a people of men; Lorien, king of the Gala elves, fought at Dardan, cares for all Erdae and distrusts kings who turn victories into dominion; Afrit's agents operate even in the Lands of the Sun; Lorien dies opposing Zol.

**Roster facts:** The Lands of Light holds 15 states; Poyang 5; Godland 4; Hengyang 3 (a northern sun-sea archipelago republic); Elvana 1 (Elvana and Elvini united; commercial rival of Igara); Goodin 1 (men, Wild freeholds); Heaven 1. Every Sunhot realm is Light, stance `zin_light_sanctuary`. The Lands of Light borders the East Lands' Alerhia and Miaed (eastern kings spec).

**Proposed in the vault:** the Lands of Light as the leading Sunhot realm; the Sunhot realms honouring Lorien's memory; the Mirror of First Rain and its warning that prophecy can frighten people into the deeds it foretells; the saying "carry it to Gala".

**Proposed in other specs and used here:** the Noon Council under the presidency of the Lands of Light, `zin_sun_concord`, the Noon League, the Sun Guard ask, the Mirror's clarity (Lands of the Sun mechanic); Radiant Speaker Soyan (characters spec); the Refusal binding Sunhot realms (diplomacy spec).

**Proposed here:** every focus, spirit, event and number; the rulers of Poyang, Godland, Hengyang, Elvana, Goodin and Heaven; the customs and offices below.

**Open and kept open:** the relationship between the Gala elves and the Sunhot elves (no text in these trees states it; Gala is a neighbour and an honoured guest); whether the Sunhot elves took part in the Refusal; who follows Lorien; what lies beyond the southern map edge. Godland's and Heaven's names are established places; this spec gives them no religion or god of their own.

## Design

### Rules for every tree in this spec

- **Peace.** No focus declares war, creates a war goal or claims land, at any date. War content answers danger that has come (S10, the Lands of Light's Sun Guard and eastern border).
- **Text.** Before `zin_afrit_revealed`, the Deliverer's people are "priests from afar" or "healers of the Deliverer". Before `zin_eindil_named`, nothing names the stranger; these trees never show him.
- **Shorthands** as in the shared tree: **Concord +n**, **Counsel +n**, **Goodwill X**, **Footholds ±n**, **Drift X +n**; **Clarity +n** = `call zin_sun_add_clarity(value = n)`. Days are 70 unless marked 35d.
- **Copied modules.** A tree that "copies S7" takes that module of `shared_lands_of_the_sun` whole: same keys (ids `zin_regional_<name>_<key>`), same effects and inner prerequisites, `allow_branch` dropped unless stated, the root placed where this spec says and the other focuses at their shared offsets. Prerequisites outside the module become the tree's root. Spirits are re-declared under the tree's prefix; events are referenced by full id.
- **Root.** Each tree's root sits at (10,0), except The Lands of Light's (12,0). The copied S10 sits with its root at (12,6) and uses rows 6 to 8 of columns 10 to 14 alone.
- **Rulers** keep `<TAG>_zin_ruler`. New proper names come from `zin_name_<key>` keys. Events use the namespace `zin_regional_<name>`.

### Overview

| Realm | Tree | States | People | Ruler (proposed) | Focuses | Copied |
| --- | --- | ---: | --- | --- | ---: | --- |
| The Lands of Light | `regional_the_lands_of_light` | 15 | sun_elves | Radiant Speaker Soyan (characters spec) | 40 | S1, S7, S10 |
| Poyang | `regional_poyang` | 5 | sun_elves | High Gardener Yanthe | 32 | S5, S6, S7, S10 |
| Godland | `regional_godland` | 4 | sun_elves | Keeper Aldoreth of the High Places | 32 | S2, S7, S10 |
| Hengyang | `regional_hengyang` | 3 | sun_elves | Tide-Speaker Hengara | 33 | S2, S7, S10 |
| Elvana | `regional_elvana` | 1 | sun_elves | Speaker Vinael of the Two Shores | 33 | S2, S5, S7, S10 |
| Goodin | `regional_goodin` | 1 | men | Steward Odun of Goodin | 32 | S1, S7, S10 |
| Heaven | `regional_heaven` | 1 | sun_elves | Cloud-Warden Ithrael | 32 | S2, S7, S10 |

### Notation of the branch lists

`key` **Name** (x,y; ← prerequisites; ✕ exclusive with): effects. AI: weight.

---

## The Lands of Light (`regional_the_lands_of_light`)

### Situation in 4A 1748

The Lands of Light is the largest Sunhot realm: fifteen states of bright valleys, white-stone towns and long roads, reaching from the Sea of Gods to the border of the East Lands, where it meets Alerhia and Miaed (roster, mechanic). Its Radiant Speaker, Soyan, presides over the Noon Council, the custom by which the Sunhot realms meet, settle quarrels and speak with one voice when they must (mechanic, proposed). The Council is old and slow; its concord is middling (40). The King of Gala attends as an honoured guest who does not vote. The Sun Guard, the Lands of Light's few, very tall spearmen, has not fought in living memory, which for Sunhot elves is a long time (proposed).

### Role

- **Historical path.** The Lands of Light presides in peace. It honours the King of Gala at the Council (Gala's event `zin_gala.5`), keeps its eastern border quiet while the East goes to war, and in 4A 1757 mourns Lorien with every Sunhot realm. On the historical path the south-west is not attacked, and the Noon League is never raised.
- **Alternatives.** If danger reaches the region (an eastern court or anyone else attacks a Sunhot realm or the Gala Elves, or the Gathering Dark passes 60), the Lands of Light raises the Noon League, guards Gala's borders, and fortifies the eastern border.

### Ruler

Radiant Speaker Soyan (`<The Lands of Light>_zin_ruler`), Light `zin_light_sanctuary`, trait `zin_trait_speaker_of_houses`. The mechanic treats the Lands of Light as the Council's president while it exists; the flag `zin_sun_council_president` is only set on a successor if it falls.

### Tree

| Branch | Columns | Rows | Focuses | Opens |
| --- | --- | --- | ---: | --- |
| Root: The Radiant Seat | 12 | 0 | 1 | start |
| A. The Radiant Speaker | 0–3 | 1–3 | 5 | start |
| B. Presidency of the Noon Council | 4–8 | 1–4 | 8 | `zin_sun_noon_council` |
| C. The Sun Guard | 11–13 | 1–4 | 6 | start; one focus needs danger |
| D. The Eastern Border | 16–18 | 1–4 | 6 | start; two focuses need eastern war |
| E. Sun-Blessed Fields (copy of S1) | 20–22 | 1–3 | 5 | start |
| F. Priests From Afar (copy of S7) | 24–26 | 1–3 | 4 | start |
| G. When Shadows Reach the Sun (copy of S10) | 10–14 | 6–8 | 5 | danger |

- `the_radiant_seat` **The Radiant Seat** (12,0): political_power 50; stability 0.03. AI 100.

**A. The Radiant Speaker.**

- `the_radiant_speaker` **The Radiant Speaker** (1,1; ← root): add_spirit radiant_speaker. AI 40.
- `the_bright_roads` **The Bright Roads** (3,1; ← root): building infrastructure 1 @capital; building infrastructure 1 @random_owned. AI 30.
- `halls_of_light` **Halls of Light** (0,2; ← the_radiant_speaker): political_power 75. AI 25.
- `the_long_noon` **The Long Noon** (2,2; ← the_radiant_speaker / the_bright_roads): stability 0.05. AI 25.
- `light_over_every_valley` **Light Over Every Valley** (1,3; ← halls_of_light / the_long_noon): swap_spirit radiant_speaker → light_over_valleys. AI 25.

**B. Presidency of the Noon Council.**

- `presidency_of_noon` **The Presidency of Noon** (6,1; ← root; 35d): Avail: `global_flag` zin_sun_noon_council. Concord +5; political_power 50. AI 60.
- `the_council_meets` **The Council Meets** (5,2; ← presidency_of_noon): event regional_the_lands_of_light.1. AI 40.
- `a_guest_from_gala` **A Guest From Gala** (7,2; ← presidency_of_noon): Avail: exists Gala Elves. Goodwill Gala Elves; Counsel +5. AI 40; hist ×1.5.
- `judges_of_quarrels` **Judges of Quarrels** (4,3; ← the_council_meets): call zin_regional_the_lands_of_light_settle_quarrels; Concord +3. AI 25.
- `one_voice_at_noon` **One Voice at Noon** (6,3; ← the_council_meets / a_guest_from_gala): key focus.
- `the_noon_charter` **The Noon Charter** (8,3; ← a_guest_from_gala): political_power 50; stability 0.03. AI 20.
- `raise_the_noon_league` **Raise the Noon League** (5,4; ← judges_of_quarrels / one_voice_at_noon): key focus.
- `first_among_the_sun_realms` **First Among the Sun Realms** (7,4; ← one_voice_at_noon / the_noon_charter): add_spirit first_among_sun_realms. AI 20.

**C. The Sun Guard.**

- `the_sun_guard` **The Sun Guard** (12,1; ← root): add_spirit sun_guard; army_experience 5. AI 30.
- `the_tall_spears` **The Tall Spears** (11,2; ← the_sun_guard): research [zin_cat_arms] 50% ×1. AI 20.
- `ballistae_of_the_sun` **Ballistae of the Sun** (13,2; ← the_sun_guard): research [zin_cat_siege] 50% ×1. AI 15.
- `watch_over_gala` **Watch Over Gala** (11,3; ← the_tall_spears): key focus.
- `the_guard_drills` **The Guard Drills** (13,3; ← ballistae_of_the_sun): army_experience 10. AI 15.
- `the_sun_guard_rides` **The Sun Guard Rides** (12,4; ← watch_over_gala / the_guard_drills): swap_spirit sun_guard → sun_guard_rides. AI 15; ×4 if `zin_sun_noon_league` is set.

**D. The Eastern Border.** The Lands of Light meets the East Lands at Alerhia and Miaed.

- `the_eastern_border` **The Eastern Border** (17,1; ← root; 35d): political_power 25; tooltip "Our valleys end where the eastern courts begin." AI 30.
- `traders_from_alerhia` **Traders From Alerhia** (16,2; ← the_eastern_border): Avail: exists Alerhia; not at war with Alerhia. Goodwill Alerhia; political_power 50. AI 25.
- `the_passes_of_miaed` **The Passes of Miaed** (18,2; ← the_eastern_border): Avail: exists Miaed; not at war with Miaed. non_aggression Miaed. AI 20.
- `border_forts_of_light` **Border Forts of Light** (16,3; ← traders_from_alerhia / the_passes_of_miaed): call zin_regional_the_lands_of_light_fortify_east. AI 10; ×5 after `zin_eastern_invasion`.
- `watch_the_rift_war` **Watch the Rift War** (18,3; ← the_passes_of_miaed): Avail: `global_flag` zin_eastern_invasion. add_spirit eastern_watch; war_support 0.05. AI 100 when available.
- `no_eastern_banner_here` **No Eastern Banner Here** (17,4; ← border_forts_of_light / watch_the_rift_war): Avail: `zin_eastern_invasion` or `zin_afrit_king_of_east`. building bunker 1 @capital; Concord +5. AI 100 when available.

**E. Copy of S1:** root `sun_terraces` at (21,1). **F. Copy of S7:** root `priests_from_afar` at (25,1). **G. Copy of S10:** root `when_shadows_reach_the_sun` at (12,6). Outside prerequisites become the root.

### Key focuses

| Key | Name | Prerequisites | Effects summary |
| --- | --- | --- | --- |
| `presidency_of_noon` | The Presidency of Noon | root | Avail: `zin_sun_noon_council`. Concord +5; political_power 50 |
| `one_voice_at_noon` | One Voice at Noon | the_council_meets / a_guest_from_gala | Concord +10; add_spirit one_voice. AI 30 |
| `raise_the_noon_league` | Raise the Noon League | judges_of_quarrels / one_voice_at_noon | Avail: check zin_sun_league_needed. If `zin_sun_concord` ≥ 60: call zin_sun_form_noon_league; else Concord +10 and tooltip "The realms are not yet of one mind." AI 0; 100 when available. The same action as the mechanic's decision and Gala's event `zin_gala.7`; the mechanic's effect is guarded so it forms the League once |
| `watch_over_gala` | Watch Over Gala | the_tall_spears | Avail: exists Gala Elves; Gala Elves at war, or `zin_gathering_dark` ≥ 25. guarantee Gala Elves; Counsel +3. AI 20; ×3 if the Gala Elves are at war |
| `no_eastern_banner_here` | No Eastern Banner Here | border_forts_of_light / watch_the_rift_war | bunker; Concord +5 |
| `when_shadows_reach_the_sun` (S10) | When Shadows Reach the Sun | root | As S10; the Lands of Light, as the League's leader, does not take S10's `the_realms_close_ranks` (it already leads) |

### Spirits

| Key | Name | Modifiers | Source |
| --- | --- | --- | --- |
| `radiant_speaker` | The Radiant Speaker | stability_factor 0.03, political_power_gain 0.05 | the_radiant_speaker; replaced by light_over_valleys |
| `light_over_valleys` | Light Over Every Valley | stability_factor 0.05, political_power_gain 0.10, opinion_gain_monthly_factor 0.10 | light_over_every_valley |
| `one_voice` | One Voice at Noon | political_power_gain 0.05, improve_relations_maintain_cost_factor −0.20 | one_voice_at_noon |
| `first_among_sun_realms` | First Among the Sun Realms | opinion_gain_monthly_factor 0.15, stability_factor 0.03 | first_among_the_sun_realms |
| `sun_guard` | The Sun Guard | army_defence_factor 0.05, army_org_factor 0.05 | the_sun_guard; replaced by sun_guard_rides |
| `sun_guard_rides` | The Sun Guard Rides | army_defence_factor 0.10, army_attack_factor 0.05, army_org_factor 0.05 | the_sun_guard_rides |
| `eastern_watch` | Watch on the East | army_core_defence_factor 0.10, army_intel_factor 0.10 | watch_the_rift_war |
| copies | S1, S7, S10 spirits | as the shared tree | copied modules |

### Events (namespace `zin_regional_the_lands_of_light`)

| Id | Title | For | Fired by | Options (AI) |
| --- | --- | --- | --- | --- |
| .1 | The Council Meets | The Lands of Light | the_council_meets | Speakers of the Sunhot realms gather at noon in the white hall. "Speak of peace among us" (Concord +5) / "Speak of the markets" (political_power 50) / "Ask the King of Gala's counsel" (Counsel +5; Concord +2; only if the Gala Elves exist). AI 40/30/30 |

### Tree-declared scripts

| Name | Kind | Does |
| --- | --- | --- |
| `zin_regional_the_lands_of_light_settle_quarrels` | effect | For every pair of Sunhot realms with negative opinion of each other (Elvana and Igara first): `zin_elves_goodwill` both ways |
| `zin_regional_the_lands_of_light_fortify_east` | effect | Bunker +1 in up to three owned states that border an East Lands country |

---

## Poyang (`regional_poyang`)

### Situation in 4A 1748

Poyang is a realm of five garden valleys, terraced and watered from the hills, whose fruit and flowers are sold at every Sunhot fair (proposed). It is ruled by its High Gardener, Yanthe, chosen by the valley households for the care of the land rather than for wealth or war (proposed). Poyang sends seeds as gifts to other realms; the Noon Council calls it "the garden" and listens to it on matters of peace.

### Role

- **Historical path.** Poyang grows its gardens, sits quietly at Noon, mourns Lorien in 4A 1757.
- **Alternatives.** It can make itself the Council's mediator, tie its harbours to the Sea of Gods, and keep or close the healing houses.

### Ruler

High Gardener Yanthe (`<Poyang>_zin_ruler`, proposed), Light `zin_light_sanctuary`, trait `zin_trait_elected_speaker`.

### Tree

| Branch | Columns | Rows | Focuses | Opens |
| --- | --- | --- | ---: | --- |
| Root: The Garden Court | 10 | 0 | 1 | start |
| A. The High Gardener | 0–2 | 1–4 | 5 | start |
| B. Terraces of Poyang | 4–8 | 1–4 | 6 | start |
| C. Poyang's Voice at Noon | 9–11 | 1–3 | 4 | `zin_sun_noon_council` |
| D. The Counsel of Gala (copy of S6) | 13–15 | 1–2 | 3 | start |
| E. Priests From Afar (copy of S7) | 17–19 | 1–3 | 4 | start |
| F. The Sea of Gods (copy of S5) | 21–23 | 1–3 | 4 | coastal state (`allow_branch` kept) |
| G. When Shadows Reach the Sun (copy of S10) | 10–14 | 6–8 | 5 | danger |

- `the_garden_court` **The Garden Court** (10,0): political_power 50; stability 0.02. AI 100.

**A. The High Gardener.**

- `high_gardener_yanthe` **The High Gardener** (1,1; ← root): add_spirit high_gardener. AI 40.
- `the_gardeners_council` **The Gardeners' Council** (0,2; ← high_gardener_yanthe): political_power 50. AI 25.
- `the_five_valleys` **The Five Valleys** (2,2; ← high_gardener_yanthe): building infrastructure 1 @random_owned. AI 25.
- `seeds_for_every_realm` **Seeds for Every Realm** (1,3; ← the_gardeners_council / the_five_valleys): key focus.
- `the_eternal_garden` **The Eternal Garden** (1,4; ← seeds_for_every_realm): swap_spirit high_gardener → eternal_garden. AI 20.

**B. Terraces of Poyang.**

- `terraces_of_poyang` **Terraces of Poyang** (6,1; ← root): building industrial_complex 1 @capital. AI 35.
- `water_from_the_hills` **Water From the Hills** (5,2; ← terraces_of_poyang): building infrastructure 1 @capital. AI 25.
- `the_flower_markets` **The Flower Markets** (7,2; ← terraces_of_poyang): add_spirit flower_markets. AI 25.
- `granaries_of_poyang` **Granaries of Poyang** (5,3; ← water_from_the_hills): stability 0.03; political_power 25. AI 20.
- `healers_herbs` **Healers' Herbs** (7,3; ← the_flower_markets): add_spirit healers_herbs. AI 20.
- `the_richest_gardens` **The Richest Gardens** (6,4; ← granaries_of_poyang / healers_herbs): political_power 75; building industrial_complex 1 @random_owned. AI 20.

**C. Poyang's Voice at Noon.**

- `poyangs_voice_at_noon` **Poyang's Voice at Noon** (10,1; ← root; 35d): Avail: `zin_sun_noon_council`. Concord +3. AI 30.
- `support_the_president` **Support the President** (9,2; ← poyangs_voice_at_noon): Avail: exists The Lands of Light. Goodwill The Lands of Light; Concord +2. AI 25.
- `a_garden_for_the_council` **A Garden for the Council** (11,2; ← poyangs_voice_at_noon; 35d): event regional_poyang.1. AI 20.
- `the_quiet_mediators` **The Quiet Mediators** (10,3; ← support_the_president / a_garden_for_the_council): Concord +5; add_spirit quiet_mediators. AI 20.

**D. Copy of S6:** root `envoys_to_gala` at (14,1); `mourning_for_lorien` (15,2) hangs from the root. **E. Copy of S7:** root at (18,1). **F. Copy of S5:** root at (22,1). **G. Copy of S10:** root at (12,6).

### Key focuses

| Key | Name | Prerequisites | Effects summary |
| --- | --- | --- | --- |
| `seeds_for_every_realm` | Seeds for Every Realm | the_gardeners_council / the_five_valleys | call zin_regional_poyang_seed_gifts (Goodwill with every Sunhot realm bordering Poyang); Concord +3. AI 25 |
| `the_quiet_mediators` | The Quiet Mediators | support_the_president / a_garden_for_the_council | Concord +5; add_spirit quiet_mediators |
| `the_richest_gardens` | The Richest Gardens | granaries_of_poyang / healers_herbs | political_power 75; a factory |
| `mourning_for_lorien` (S6) | Mourning for Lorien | root | After `zin_lorien_dead`: stability 0.03; Concord +2 |

### Spirits

| Key | Name | Modifiers | Source |
| --- | --- | --- | --- |
| `high_gardener` | The High Gardener | stability_factor 0.03, monthly_population 0.05 | high_gardener_yanthe; replaced by eternal_garden |
| `eternal_garden` | The Eternal Garden | stability_factor 0.05, monthly_population 0.10 | the_eternal_garden |
| `flower_markets` | The Flower Markets | trade_opinion_factor 0.10, consumer_goods_factor −0.02 | the_flower_markets |
| `healers_herbs` | Healers' Herbs | recruitable_population_factor 0.03, stability_factor 0.02 | healers_herbs |
| `quiet_mediators` | The Quiet Mediators | opinion_gain_monthly_factor 0.15, improve_relations_maintain_cost_factor −0.10 | the_quiet_mediators |
| copies | S5, S6, S7, S10 spirits | as the shared tree | copied modules |

### Events (namespace `zin_regional_poyang`)

| Id | Title | For | Fired by | Options (AI) |
| --- | --- | --- | --- | --- |
| .1 | A Garden for the Council | Poyang | a_garden_for_the_council | The gardeners offer to plant a garden at the Noon Council's hall. "Plant it in our colours" (Concord +3) / "Let every realm bring a seed" (Concord +5; political_power −25). AI 50/50 |

### Tree-declared scripts

| Name | Kind | Does |
| --- | --- | --- |
| `zin_regional_poyang_seed_gifts` | effect | `zin_elves_goodwill` with every Sunhot realm that borders Poyang |

---

## Godland (`regional_godland`)

### Situation in 4A 1748

Godland is a realm of four high states, named on the oldest maps (established place name). Its high places are crowned with standing stones older than any Sunhot record; whoever raised them, nobody now says (proposed, deliberately open). Keeper Aldoreth and the keepers of the high places govern a quiet land of shepherds, masons and pilgrims who climb to the stones at midsummer (proposed). Godland's white stone builds half the towns of the Lands of the Sun.

### Role

- **Historical path.** Godland keeps the stones, sells stone, and sits at the Noon Council.
- **Alternatives.** It can send the stones' tales to Gala, wall the high places, and lend its masons to the Council's defence.

### Ruler

Keeper Aldoreth of the High Places (`<Godland>_zin_ruler`, proposed), Light `zin_light_sanctuary`, trait `zin_trait_elder_memory`.

### Tree

| Branch | Columns | Rows | Focuses | Opens |
| --- | --- | --- | ---: | --- |
| Root: The High Places | 10 | 0 | 1 | start |
| A. The Keepers' Court | 0–2 | 1–4 | 5 | start |
| B. The Old Stones | 4–8 | 1–4 | 7 | start |
| C. Stones and Quarries | 9–11 | 1–3 | 4 | start |
| D. The Noon Council (copy of S2) | 14–16 | 1–4 | 6 | start (Godland is Sunhot) |
| E. Priests From Afar (copy of S7) | 18–20 | 1–3 | 4 | start |
| F. When Shadows Reach the Sun (copy of S10) | 10–14 | 6–8 | 5 | danger |

- `the_high_places` **The High Places** (10,0): political_power 50; stability 0.02. AI 100.

**A. The Keepers' Court.**

- `keeper_aldoreth` **The Keeper of the High Places** (1,1; ← root): add_spirit keepers_court. AI 40.
- `the_keepers_law` **The Keepers' Law** (0,2; ← keeper_aldoreth): stability 0.03. AI 25.
- `the_four_lands` **The Four Lands** (2,2; ← keeper_aldoreth): building infrastructure 1 @random_owned. AI 25.
- `the_keepers_council` **The Keepers' Council** (1,3; ← the_keepers_law / the_four_lands): political_power 75. AI 20.
- `the_long_keeping` **The Long Keeping** (1,4; ← the_keepers_council): swap_spirit keepers_court → long_keeping. AI 20.

**B. The Old Stones.**

- `the_old_stones` **The Old Stones** (6,1; ← root; 35d): event regional_godland.1. AI 35.
- `stone_readers` **The Stone-Readers** (5,2; ← the_old_stones): research [industry] 50% ×1. AI 20.
- `the_sanctuary_paths` **The Sanctuary Paths** (7,2; ← the_old_stones): building infrastructure 1 @capital. AI 20.
- `pilgrims_to_the_high_places` **Pilgrims to the High Places** (5,3; ← stone_readers / the_sanctuary_paths): stability 0.03; Concord +2. AI 25.
- `the_hidden_terraces` **The Hidden Terraces** (7,3; ← the_sanctuary_paths): building industrial_complex 1 @random_owned. AI 20.
- `songs_of_the_old_stones` **Songs of the Old Stones** (6,4; ← pilgrims_to_the_high_places / the_hidden_terraces): add_spirit songs_of_stones. AI 20.
- `carry_the_stones_tale_to_gala` **Carry the Stones' Tale to Gala** (8,4; ← the_hidden_terraces; 35d): Avail: exists Gala Elves. Counsel +3; research [industry] 30% ×1; tooltip "A tale too old for anyone here to explain." AI 15.

**C. Stones and Quarries.**

- `white_stone_quarries` **White Stone Quarries** (10,1; ← root): building industrial_complex 1 @capital. AI 30.
- `masons_of_godland` **Masons of Godland** (9,2; ← white_stone_quarries): political_power 50; add_spirit masons. AI 20.
- `the_stone_roads` **The Stone Roads** (11,2; ← white_stone_quarries): building infrastructure 1 @random_owned. AI 20.
- `walls_of_the_high_places` **Walls of the High Places** (10,3; ← masons_of_godland / the_stone_roads): building bunker 1 @capital; research [zin_cat_walls] 50% ×1. AI 15; ×3 when `zin_sun_league_needed`.

**D. Copy of S2:** root `a_seat_at_noon` at (15,1). **E. Copy of S7:** root at (19,1). **F. Copy of S10:** root at (12,6).

### Key focuses

| Key | Name | Prerequisites | Effects summary |
| --- | --- | --- | --- |
| `the_old_stones` | The Old Stones | root | event .1 (the stones' origin stays unknown) |
| `songs_of_the_old_stones` | Songs of the Old Stones | pilgrims_to_the_high_places / the_hidden_terraces | add_spirit songs_of_stones |
| `walls_of_the_high_places` | Walls of the High Places | masons_of_godland / the_stone_roads | bunker; walls research |
| `ready_for_the_noon_league` (S2) | Ready for the Noon League | S2 | Joins the League when it exists |

### Spirits

| Key | Name | Modifiers | Source |
| --- | --- | --- | --- |
| `keepers_court` | The Keepers' Court | stability_factor 0.03, drift_defence_factor 0.10 | keeper_aldoreth; replaced by long_keeping |
| `long_keeping` | The Long Keeping | stability_factor 0.05, drift_defence_factor 0.15, research_speed_factor 0.02 | the_long_keeping |
| `songs_of_stones` | Songs of the Old Stones | research_speed_factor 0.03, stability_factor 0.02 | songs_of_the_old_stones |
| `masons` | Masons of Godland | production_speed_buildings_factor 0.10 | masons_of_godland |
| copies | S2, S7, S10 spirits | as the shared tree | copied modules |

### Events (namespace `zin_regional_godland`)

| Id | Title | For | Fired by | Options (AI) |
| --- | --- | --- | --- | --- |
| .1 | The Old Stones | Godland | the_old_stones | At midsummer the pilgrims climb to the stones. Nobody remembers who raised them. "Read the marks on the stones" (research [industry] 30% ×1) / "Let them stand as they are" (stability 0.02). AI 50/50 |

---

## Hengyang (`regional_hengyang`)

### Situation in 4A 1748

Hengyang is the northern archipelago of the Lands of the Sun: three island states on the sun-sea, governed as a republic by a council of the isles under a Tide-Speaker, Hengara (roster; proposed offices). Its white ships are the best of the Sunhot fleets. Its traders reach the Islands of the South, and they repeat the islanders' saying: when the tales of men grow too old for any man to explain, carry them to Gala (established saying).

### Role

- **Historical path.** Hengyang trades, sails and sits at Noon. In 4A 1752 to 1753 its harbours are among the places where Lorien's ship may call (journey ports of call draw the Islands of the South first; Hengyang offers a harbour if asked).
- **Alternatives.** It can carry the League's ships north when the League forms, and bind the Islands of the South to Gala's counsel.

### Ruler

Tide-Speaker Hengara (`<Hengyang>_zin_ruler`, proposed), Light `zin_light_sanctuary`, trait `zin_trait_port_master`.

### Tree

| Branch | Columns | Rows | Focuses | Opens |
| --- | --- | --- | ---: | --- |
| Root: The Archipelago Council | 10 | 0 | 1 | start |
| A. The Tide-Speaker | 0–2 | 1–4 | 5 | start |
| B. The Sun-Sea Fleets | 4–8 | 1–4 | 7 | start; one focus needs the League |
| C. Sea Roads to the Isles | 9–11 | 1–4 | 5 | start |
| D. The Noon Council (copy of S2) | 14–16 | 1–4 | 6 | start |
| E. Priests From Afar (copy of S7) | 18–20 | 1–3 | 4 | start |
| F. When Shadows Reach the Sun (copy of S10) | 10–14 | 6–8 | 5 | danger |

- `the_archipelago_council` **The Archipelago Council** (10,0): political_power 50; stability 0.02. AI 100.

**A. The Tide-Speaker.**

- `tide_speaker_hengara` **The Tide-Speaker** (1,1; ← root): add_spirit tide_speaker. AI 40.
- `the_three_isles` **The Three Isles** (0,2; ← tide_speaker_hengara): building infrastructure 1 @random_owned. AI 25.
- `the_isle_councils` **The Isle Councils** (2,2; ← tide_speaker_hengara): stability 0.03. AI 25.
- `voices_of_the_tides` **Voices of the Tides** (1,3; ← the_three_isles / the_isle_councils): political_power 75. AI 20.
- `the_tide_charter` **The Tide Charter** (1,4; ← voices_of_the_tides): swap_spirit tide_speaker → tide_charter. AI 20.

**B. The Sun-Sea Fleets.**

- `the_sun_sea_fleets` **The Sun-Sea Fleets** (6,1; ← root): building dockyard 1 @random_coastal; navy_experience 5. AI 35.
- `elven_hulls_of_hengyang` **Elven Hulls of Hengyang** (5,2; ← the_sun_sea_fleets): research [zin_cat_galleys] 50% ×1. AI 25.
- `harbour_of_the_three_isles` **Harbour of the Three Isles** (7,2; ← the_sun_sea_fleets): building naval_base 1 @random_coastal. AI 25.
- `the_white_fleet` **The White Fleet** (5,3; ← elven_hulls_of_hengyang): research [zin_cat_warships] 50% ×1. AI 20.
- `pilots_of_the_sun_sea` **Pilots of the Sun-Sea** (7,3; ← harbour_of_the_three_isles): navy_experience 10. AI 20.
- `masters_of_the_sun_sea` **Masters of the Sun-Sea** (6,4; ← the_white_fleet / pilots_of_the_sun_sea): add_spirit sun_sea_masters. AI 20.
- `ships_with_the_league` **Ships With the League** (8,4; ← pilots_of_the_sun_sea; 35d): Avail: `global_flag` zin_sun_noon_league. navy_experience 15; war_support 0.03. AI 100 when available.

**C. Sea Roads to the Isles.**

- `sea_roads_to_the_isles` **Sea Roads to the Isles** (10,1; ← root): political_power 25; navy_experience 5. AI 30.
- `trade_with_the_southern_isles` **Trade With the Southern Isles** (9,2; ← sea_roads_to_the_isles): political_power 50; call zin_shared_lands_of_the_sun_islands_goodwill. AI 25.
- `tales_from_the_isles` **Tales From the Isles** (11,2; ← sea_roads_to_the_isles): research [industry] 50% ×1. AI 20.
- `the_saying_of_the_isles` **The Saying of the Isles** (10,3; ← trade_with_the_southern_isles / tales_from_the_isles; 35d): event regional_hengyang.1. AI 25.
- `a_harbour_for_strangers` **A Harbour for Strangers** (10,4; ← the_saying_of_the_isles): building naval_base 1 @random_coastal; if `zin_eindil_stage` = 6: call zin_eindil_add_regard(value = 10). AI 20; ×3 when `zin_eindil_stage` = 6.

**D. Copy of S2:** root at (15,1). **E. Copy of S7:** root at (19,1). **F. Copy of S10:** root at (12,6).

### Key focuses

| Key | Name | Prerequisites | Effects summary |
| --- | --- | --- | --- |
| `the_sun_sea_fleets` | The Sun-Sea Fleets | root | dockyard; navy_experience 5 |
| `masters_of_the_sun_sea` | Masters of the Sun-Sea | the_white_fleet / pilots_of_the_sun_sea | add_spirit sun_sea_masters |
| `the_saying_of_the_isles` | The Saying of the Isles | trade_with_the_southern_isles / tales_from_the_isles | event .1 |
| `a_harbour_for_strangers` | A Harbour for Strangers | the_saying_of_the_isles | naval base; regard +10 while Lorien's ship is at sea |
| `ships_with_the_league` | Ships With the League | pilots_of_the_sun_sea | Avail: the League exists. navy_experience 15 |

### Spirits

| Key | Name | Modifiers | Source |
| --- | --- | --- | --- |
| `tide_speaker` | The Tide-Speaker | stability_factor 0.03, naval_speed_factor 0.05 | tide_speaker_hengara; replaced by tide_charter |
| `tide_charter` | The Tide Charter | stability_factor 0.05, political_power_gain 0.05, naval_speed_factor 0.05 | the_tide_charter |
| `sun_sea_masters` | Masters of the Sun-Sea | naval_damage_factor 0.05, navy_org_factor 0.05, naval_detection 0.10 | masters_of_the_sun_sea |
| copies | S2, S7, S10 spirits | as the shared tree | copied modules |

### Events (namespace `zin_regional_hengyang`)

| Id | Title | For | Fired by | Options (AI) |
| --- | --- | --- | --- | --- |
| .1 | The Saying of the Isles | Hengyang | the_saying_of_the_isles | Island traders bring a tale nobody can explain and say it must go to Gala. "Carry it to Gala" (Counsel +3; only if the Gala Elves exist) / "Keep it in our archive" (research [industry] 30% ×1). AI 60/40 |

---

## Elvana (`regional_elvana`)

### Situation in 4A 1748

Elvana is one state on two shores: the old towns of Elvana and Elvini, united under one council and a Speaker of the Two Shores, Vinael (roster: Elvana and Elvini united; proposed offices). Elvana's fairs are the busiest of the Sunhot realms, and its merchants' great rival is Igara next door, an independent solar republic that undercuts every price (roster; established places). The rivalry is old, loud and bloodless; the Noon Council is tired of hearing about it (proposed).

### Role

- **Historical path.** Elvana trades and quarrels with Igara by price, never by arms. Gala's "Speak for a Sunhot Quarrel" often names Elvana and Igara.
- **Alternatives.** Elvana can undercut Igara, make a fair market with it, or ask the King of Gala to judge.

### Ruler

Speaker Vinael of the Two Shores (`<Elvana>_zin_ruler`, proposed), Light `zin_light_sanctuary`, trait `zin_trait_caravan_broker`.

### Tree

| Branch | Columns | Rows | Focuses | Opens |
| --- | --- | --- | ---: | --- |
| Root: Elvana and Elvini | 10 | 0 | 1 | start |
| A. The Two Shores United | 0–2 | 1–4 | 5 | start |
| B. The Markets of Elvana | 4–8 | 1–4 | 8 | start |
| C. The Noon Council (copy of S2) | 11–13 | 1–4 | 6 | start |
| D. The Sea of Gods (copy of S5) | 15–17 | 1–3 | 4 | coastal state (`allow_branch` kept) |
| E. Priests From Afar (copy of S7) | 19–21 | 1–3 | 4 | start |
| F. When Shadows Reach the Sun (copy of S10) | 10–14 | 6–8 | 5 | danger |

- `elvana_and_elvini` **Elvana and Elvini** (10,0): political_power 50; stability 0.02. AI 100.

**A. The Two Shores United.**

- `speaker_of_two_shores` **The Speaker of Two Shores** (1,1; ← root): add_spirit two_shores_speaker. AI 40.
- `the_union_feast` **The Union Feast** (0,2; ← speaker_of_two_shores; 35d): event regional_elvana.1. AI 25.
- `elvini_remembers` **Elvini Remembers** (2,2; ← speaker_of_two_shores): stability 0.03. AI 25.
- `one_council_two_shores` **One Council, Two Shores** (1,3; ← the_union_feast / elvini_remembers): political_power 75. AI 20.
- `the_union_endures` **The Union Endures** (1,4; ← one_council_two_shores): swap_spirit two_shores_speaker → union_endures. AI 20.

**B. The Markets of Elvana.** **Mutual exclusions:** `undercut_igara` / `a_fair_market_with_igara`.

- `markets_of_elvana` **The Markets of Elvana** (6,1; ← root): building industrial_complex 1 @capital. AI 35.
- `the_rival_at_igara` **The Rival at Igara** (5,2; ← markets_of_elvana; 35d): Avail: exists Igara. event regional_elvana.2. AI 30.
- `the_sun_fairs` **The Sun Fairs** (7,2; ← markets_of_elvana): add_spirit sun_fairs. AI 25.
- `undercut_igara` **Undercut Igara** (4,3; ← the_rival_at_igara; ✕ a_fair_market_with_igara): political_power 75; Concord −2. AI 15.
- `a_fair_market_with_igara` **A Fair Market With Igara** (6,3; ← the_rival_at_igara; ✕ undercut_igara): Goodwill Igara; Concord +3; political_power 25. AI 25; hist ×1.5.
- `ask_gala_to_judge` **Ask Gala to Judge** (8,3; ← the_sun_fairs; 35d): Avail: exists Gala Elves; exists Igara. event_for Gala Elves regional_elvana.3. AI 15.
- `merchant_houses_of_elvana` **Merchant Houses of Elvana** (5,4; ← undercut_igara / a_fair_market_with_igara): add_spirit merchant_houses. AI 20.
- `the_first_market_of_the_sun` **The First Market of the Sun** (7,4; ← a_fair_market_with_igara / ask_gala_to_judge / the_sun_fairs): political_power 50; stability 0.03. AI 20.

**C. Copy of S2:** root at (12,1). **D. Copy of S5:** root at (16,1). **E. Copy of S7:** root at (20,1). **F. Copy of S10:** root at (12,6).

### Key focuses

| Key | Name | Prerequisites | Effects summary |
| --- | --- | --- | --- |
| `the_rival_at_igara` | The Rival at Igara | markets_of_elvana | event .2 |
| `undercut_igara` | Undercut Igara | the_rival_at_igara | political_power 75; Concord −2 |
| `a_fair_market_with_igara` | A Fair Market With Igara | the_rival_at_igara | Goodwill Igara; Concord +3 |
| `ask_gala_to_judge` | Ask Gala to Judge | the_sun_fairs | event_for Gala Elves .3 |
| `the_union_endures` | The Union Endures | one_council_two_shores | add_spirit union_endures |

### Spirits

| Key | Name | Modifiers | Source |
| --- | --- | --- | --- |
| `two_shores_speaker` | The Speaker of Two Shores | stability_factor 0.03, political_power_gain 0.05 | speaker_of_two_shores; replaced by union_endures |
| `union_endures` | The Union Endures | stability_factor 0.05, political_power_gain 0.05, drift_defence_factor 0.10 | the_union_endures |
| `sun_fairs` | The Sun Fairs | trade_opinion_factor 0.10, consumer_goods_factor −0.02 | the_sun_fairs |
| `merchant_houses` | Merchant Houses of Elvana | trade_opinion_factor 0.10, production_speed_buildings_factor 0.05 | merchant_houses_of_elvana |
| copies | S2, S5, S7, S10 spirits | as the shared tree | copied modules |

### Events (namespace `zin_regional_elvana`)

| Id | Title | For | Fired by | Options (AI) |
| --- | --- | --- | --- | --- |
| .1 | The Union Feast | Elvana | the_union_feast | The two shores keep the day they became one council. "Feast on the Elvana shore" (political_power 25) / "Feast on the Elvini shore" (stability 0.03). AI 50/50 |
| .2 | The Rival at Igara | Elvana | the_rival_at_igara | Igara's merchants sell sun-silk below our price again. "Lower our prices" (political_power −25; stability 0.02) / "Complain to the Council" (Concord −2; political_power 25). AI 50/50 |
| .3 | Elvana Asks the King to Judge | Gala Elves | ask_gala_to_judge | "The King will speak for peace between them" (Elvana and Igara: Goodwill both ways; Concord +5; Counsel +3) / "Gala does not judge markets" (nothing). AI 80/20 |

---

## Goodin (`regional_goodin`)

### Situation in 4A 1748

Goodin is a realm of men among the Sunhot realms: the steadings of the Goodin Sunfolk (established people), led by a Steward, Odun, and a moot of steading-heads (proposed). The Sunfolk are farmers, caravan-men and spear-carriers for hire. They live beside neighbours more than a head taller than themselves, and are proud of it. Goodin is not a member of the Noon Council (mechanic); its neighbours Goodton and Guuden are realms of men too.

### Role

- **Historical path.** Goodin trades and farms; it asks for a guest's seat at Noon and may get it.
- **Alternatives.** It can hire out its spears, bind itself to Goodton and Guuden, and stand with the Sunhot realms if danger comes (though the Noon League's joining rule admits only Sunhot and elven realms).

### Ruler

Steward Odun of Goodin (`<Goodin>_zin_ruler`, proposed), Wild `zin_wild_freeholds`, trait `zin_trait_lawspeaker`. Goodin carries the tradition flag `zin_tradition_sunfolk`.

### Tree

| Branch | Columns | Rows | Focuses | Opens |
| --- | --- | --- | ---: | --- |
| Root: The Sunfolk Steadings | 10 | 0 | 1 | start |
| A. The Steward and the Moot | 0–2 | 1–4 | 5 | start |
| B. Men Among the Sunhot | 4–8 | 1–4 | 6 | start |
| C. Caravans and Spears | 10–12 | 1–4 | 6 | start |
| D. Sun-Blessed Fields (copy of S1) | 14–16 | 1–3 | 5 | start |
| E. Priests From Afar (copy of S7) | 18–20 | 1–3 | 4 | start |
| F. When Shadows Reach the Sun (copy of S10) | 10–14 | 6–8 | 5 | danger |

- `the_sunfolk_steadings` **The Sunfolk Steadings** (10,0): political_power 50; stability 0.02. AI 100.

**A. The Steward and the Moot.**

- `steward_odun` **The Steward** (1,1; ← root): add_spirit steward_of_goodin. AI 40.
- `the_steading_moot` **The Steading Moot** (0,2; ← steward_odun): Drift wild +3; stability 0.02. AI 25.
- `sunfolk_customs` **Sunfolk Customs** (2,2; ← steward_odun): stability 0.03. AI 25.
- `the_sunfolk_way` **The Sunfolk Way** (1,3; ← the_steading_moot / sunfolk_customs): political_power 50. AI 20.
- `the_steadings_endure` **The Steadings Endure** (1,4; ← the_sunfolk_way): swap_spirit steward_of_goodin → steadings_endure. AI 20.

**B. Men Among the Sunhot.**

- `men_among_the_tall` **Men Among the Tall** (6,1; ← root; 35d): political_power 25. AI 35.
- `gifts_to_the_lands_of_light` **Gifts to the Lands of Light** (5,2; ← men_among_the_tall): Avail: exists The Lands of Light. Goodwill The Lands of Light; political_power −10. AI 25.
- `a_guest_seat_at_noon` **A Guest's Seat at Noon** (7,2; ← men_among_the_tall; 35d): Avail: `zin_sun_noon_council`; exists The Lands of Light. event_for The Lands of Light regional_goodin.1. AI 25.
- `neighbours_of_goodton_and_guuden` **Neighbours of Goodton and Guuden** (5,3; ← gifts_to_the_lands_of_light): non_aggression Goodton (if it exists); non_aggression Guuden (if it exists); stability 0.02. AI 25.
- `sunfolk_and_sunhot` **Sunfolk and Sunhot** (7,3; ← a_guest_seat_at_noon): stability 0.03; if flag zin_regional_goodin_guest_seat: Concord +2 and political_power 25. AI 20.
- `the_tall_folks_trust` **The Tall Folk's Trust** (6,4; ← neighbours_of_goodton_and_guuden / sunfolk_and_sunhot): add_spirit tall_folks_trust. AI 20.

**C. Caravans and Spears.**

- `caravans_of_the_sunfolk` **Caravans of the Sunfolk** (11,1; ← root): add_spirit sunfolk_caravans. AI 30.
- `markets_beyond_the_sun` **Markets Beyond the Sun** (10,2; ← caravans_of_the_sunfolk; 35d): political_power 50. AI 20.
- `hired_spears_of_goodin` **Hired Spears of Goodin** (12,2; ← caravans_of_the_sunfolk): manpower 500; army_experience 5. AI 20.
- `sunfolk_bows` **Sunfolk Bows** (10,3; ← markets_beyond_the_sun / hired_spears_of_goodin): research [zin_cat_bows] 50% ×1. AI 15.
- `the_spear_companies` **The Spear Companies** (12,3; ← hired_spears_of_goodin): add_spirit spear_companies. AI 15.
- `captains_of_the_sunfolk` **Captains of the Sunfolk** (11,4; ← sunfolk_bows / the_spear_companies): army_experience 10. AI 15.

**D. Copy of S1:** root at (15,1). **E. Copy of S7:** root at (19,1). **F. Copy of S10:** root at (12,6); its `the_realms_close_ranks` is never available to Goodin (the League admits only Sunhot and elven realms) and stays as a visible dead end with its availability tooltip.

### Key focuses

| Key | Name | Prerequisites | Effects summary |
| --- | --- | --- | --- |
| `a_guest_seat_at_noon` | A Guest's Seat at Noon | men_among_the_tall | event_for The Lands of Light .1 (grant or decline a guest's seat) |
| `the_tall_folks_trust` | The Tall Folk's Trust | neighbours_of_goodton_and_guuden / sunfolk_and_sunhot | add_spirit tall_folks_trust |
| `the_spear_companies` | The Spear Companies | hired_spears_of_goodin | add_spirit spear_companies |
| `the_steadings_endure` | The Steadings Endure | the_sunfolk_way | add_spirit steadings_endure |

### Spirits

| Key | Name | Modifiers | Source |
| --- | --- | --- | --- |
| `steward_of_goodin` | The Steward of Goodin | stability_factor 0.03, political_power_gain 0.05 | steward_odun; replaced by steadings_endure |
| `steadings_endure` | The Steadings Endure | stability_factor 0.05, production_speed_buildings_factor 0.05 | the_steadings_endure |
| `tall_folks_trust` | The Tall Folk's Trust | opinion_gain_monthly_factor 0.15, stability_factor 0.02 | the_tall_folks_trust |
| `sunfolk_caravans` | Caravans of the Sunfolk | trade_opinion_factor 0.10, consumer_goods_factor −0.02 | caravans_of_the_sunfolk |
| `spear_companies` | The Spear Companies | army_org_factor 0.05, conscription_factor 0.03 | the_spear_companies |
| copies | S1, S7, S10 spirits | as the shared tree | copied modules |

### Events (namespace `zin_regional_goodin`)

| Id | Title | For | Fired by | Options (AI) |
| --- | --- | --- | --- | --- |
| .1 | The Sunfolk Ask for a Guest's Seat | The Lands of Light | a_guest_seat_at_noon | "Let the Sunfolk sit as guests" (Goodin: flag zin_regional_goodin_guest_seat; Concord +2; Goodin opinion of the Lands of Light +15) / "The Council is for the Sunhot realms" (Goodin opinion −10). AI 70/30 |

---

## Heaven (`regional_heaven`)

### Situation in 4A 1748

Heaven is one high state (established place name): terraces above the clouds where the air is still and the sky is close (proposed). Its Cloud-Warden, Ithrael, keeps the old tables of the stars and the storm-readers who watch the weather over the whole south-west (proposed). Pilgrims climb its stairs for the view and the quiet. Heaven's watchers write to the keepers of the Mirror of First Rain at Gala, and they are careful never to call what they see a prophecy (proposed, after the vault's warning that prophecy can frighten people into the deeds it foretells).

### Role

- **Historical path.** Heaven watches, writes and welcomes pilgrims; it sits at Noon.
- **Alternatives.** It can lend the Mirror a little clarity by its letters, and keep its peace when the world goes to war.

### Ruler

Cloud-Warden Ithrael (`<Heaven>_zin_ruler`, proposed), Light `zin_light_sanctuary`, trait `zin_trait_elder_memory`.

### Tree

| Branch | Columns | Rows | Focuses | Opens |
| --- | --- | --- | ---: | --- |
| Root: The High Terraces | 10 | 0 | 1 | start |
| A. The Cloud-Warden | 0–2 | 1–4 | 5 | start |
| B. Watchers of the Sky | 4–8 | 1–4 | 7 | start |
| C. Pilgrims to Heaven | 10–12 | 1–3 | 4 | start |
| D. The Noon Council (copy of S2) | 14–16 | 1–4 | 6 | start |
| E. Priests From Afar (copy of S7) | 18–20 | 1–3 | 4 | start |
| F. When Shadows Reach the Sun (copy of S10) | 10–14 | 6–8 | 5 | danger |

- `the_high_terraces` **The High Terraces** (10,0): political_power 50; stability 0.02. AI 100.

**A. The Cloud-Warden.**

- `cloud_warden_ithrael` **The Cloud-Warden** (1,1; ← root): add_spirit cloud_warden. AI 40.
- `terraces_above_the_clouds` **Terraces Above the Clouds** (0,2; ← cloud_warden_ithrael): building infrastructure 1 @capital. AI 25.
- `the_wardens_hall` **The Warden's Hall** (2,2; ← cloud_warden_ithrael): political_power 50. AI 25.
- `the_still_air` **The Still Air** (1,3; ← terraces_above_the_clouds / the_wardens_hall): stability 0.05. AI 20.
- `heaven_keeps_its_peace` **Heaven Keeps Its Peace** (1,4; ← the_still_air): swap_spirit cloud_warden → heavens_peace. AI 20.

**B. Watchers of the Sky.**

- `watchers_of_the_sky` **Watchers of the Sky** (6,1; ← root): research [industry] 50% ×1. AI 35.
- `the_star_tables` **The Star Tables** (5,2; ← watchers_of_the_sky): research [industry] 30% ×1; political_power 25. AI 25.
- `storm_readers` **The Storm-Readers** (7,2; ← watchers_of_the_sky): add_spirit storm_readers. AI 25.
- `omens_in_the_sky` **Omens in the Sky** (5,3; ← the_star_tables; 35d): event regional_heaven.1. AI 20.
- `letters_to_the_mirror_keepers` **Letters to the Mirror's Keepers** (7,3; ← storm_readers): key focus.
- `the_long_sight` **The Long Sight** (6,4; ← omens_in_the_sky / letters_to_the_mirror_keepers): add_spirit long_sight. AI 20.
- `what_the_sky_cannot_show` **What the Sky Cannot Show** (8,4; ← letters_to_the_mirror_keepers): key focus.

**C. Pilgrims to Heaven.**

- `pilgrims_to_heaven` **Pilgrims to Heaven** (11,1; ← root): stability 0.03. AI 30.
- `the_pilgrim_stairs` **The Pilgrim Stairs** (10,2; ← pilgrims_to_heaven): building infrastructure 1 @capital. AI 20.
- `houses_for_pilgrims` **Houses for Pilgrims** (12,2; ← pilgrims_to_heaven): political_power 50. AI 20.
- `heaven_welcomes_all` **Heaven Welcomes All** (11,3; ← the_pilgrim_stairs / houses_for_pilgrims): Concord +3; add_spirit heaven_welcomes. AI 20.

**D. Copy of S2:** root at (15,1). **E. Copy of S7:** root at (19,1). **F. Copy of S10:** root at (12,6).

### Key focuses

| Key | Name | Prerequisites | Effects summary |
| --- | --- | --- | --- |
| `letters_to_the_mirror_keepers` | Letters to the Mirror's Keepers | storm_readers | Avail: exists Gala Elves; not `zin_mirror_stilled`. Clarity +5; Goodwill Gala Elves. AI 25 |
| `what_the_sky_cannot_show` | What the Sky Cannot Show | letters_to_the_mirror_keepers | stability 0.03; tooltip "A sign read as a certainty can frighten people into the deeds it foretells." AI 20 |
| `omens_in_the_sky` | Omens in the Sky | the_star_tables | event .1 |
| `heaven_welcomes_all` | Heaven Welcomes All | the_pilgrim_stairs / houses_for_pilgrims | Concord +3; add_spirit heaven_welcomes |

### Spirits

| Key | Name | Modifiers | Source |
| --- | --- | --- | --- |
| `cloud_warden` | The Cloud-Warden | stability_factor 0.03, research_speed_factor 0.02 | cloud_warden_ithrael; replaced by heavens_peace |
| `heavens_peace` | Heaven Keeps Its Peace | stability_factor 0.05, research_speed_factor 0.03, drift_defence_factor 0.10 | heaven_keeps_its_peace |
| `storm_readers` | The Storm-Readers | army_intel_factor 0.10, naval_detection 0.05 | storm_readers |
| `long_sight` | The Long Sight | research_speed_factor 0.03, army_intel_factor 0.05 | the_long_sight |
| `heaven_welcomes` | Heaven Welcomes All | stability_factor 0.03, opinion_gain_monthly_factor 0.10 | heaven_welcomes_all |
| copies | S2, S7, S10 spirits | as the shared tree | copied modules |

### Events (namespace `zin_regional_heaven`)

| Id | Title | For | Fired by | Options (AI) |
| --- | --- | --- | --- | --- |
| .1 | Omens in the Sky | Heaven | omens_in_the_sky | The watchers see a long-tailed star and storms that do not move. They write that it is a sign of weather, not of fate. "Send the tables to Gala" (Clarity +5; Counsel +2; only if the Gala Elves exist and the Mirror is not stilled) / "Keep them in the hall" (stability 0.02). AI 60/40 |

---

## Implementation

### Files (per tree)

| Path | Content |
| --- | --- |
| `docs/design/focus/regional_<name>.json` | Tree data, `"tier": "regional"` |
| `common/national_focus/zin_regional_<name>.txt` | Compiled tree |
| `common/ideas/zin_focus_regional_<name>.txt` | Spirits, including re-declared copies |
| `events/zin_regional_<name>.txt` | Every tree has events |
| `common/scripted_effects/zin_regional_<name>.txt` | The Lands of Light and Poyang |
| `localisation/english/zin_focus_regional_<name>_l_english.yml` | All text |

Names: `the_lands_of_light`, `poyang`, `godland`, `hengyang`, `elvana`, `goodin`, `heaven`. Copying uses the builder step of the other regions (`"copy": [ { "from": "shared_lands_of_the_sun", "module": "S7", "root_at": [25,1] } ]`).

### Characters

Six new rulers, each `<TAG>_zin_ruler` with one image-generated portrait (Sunhot elves are over three metres tall; portraits show stature through framing, not by naming kinship with the Gala elves): High Gardener Yanthe (Poyang), Keeper Aldoreth of the High Places (Godland), Tide-Speaker Hengara (Hengyang), Speaker Vinael of the Two Shores (Elvana), Steward Odun of Goodin (Goodin, a man of the Sunfolk), Cloud-Warden Ithrael (Heaven). Radiant Speaker Soyan comes from the characters spec. Names are proposed and stored as `zin_name_<key>` keys.

### Names used from other systems

Lands of the Sun: `zin_sun_add_concord`, `zin_sun_add_gala_counsel`, `zin_sun_add_clarity`, `zin_sun_form_noon_league`, `zin_sun_league_needed`, `zin_sun_noon_council`, `zin_sun_noon_league`, `zin_mirror_stilled`, `zin_lorien_dead`. Elves: `zin_elves_goodwill`. Journey: `zin_eindil_stage`, `zin_eindil_add_regard`. East: `zin_eastern_invasion`, `zin_afrit_king_of_east`. Afrit: `zin_afrit_add_footholds`, `zin_afrit_purge_houses`. Politics: `zin_politics_add_drift`. The shared tree's effects. No new shared names.

## AI

| Realm | Peace (4A 1748–1754) | When danger comes | 4A 1757 |
| --- | --- | --- | --- |
| The Lands of Light | Radiant Speaker, Presidency, A Guest From Gala (hist ×1.5), Council Meets, Sun Guard, Eastern Border | Raise the Noon League, Watch Over Gala, Border Forts, No Eastern Banner Here, S10 | Mourning through the mechanic |
| Poyang | Gardener, Terraces, Voice at Noon, Seeds | S10; League | Mourning for Lorien (S6) |
| Godland | Keepers, Old Stones, Quarries, S2 | Walls of the High Places; S10 | — |
| Hengyang | Fleets, Sea Roads; A Harbour for Strangers while Lorien's ship sails | Ships With the League; S10 | — |
| Elvana | Union, Markets; A Fair Market With Igara (hist ×1.5) | S10 | — |
| Goodin | Steward, Men Among the Tall, Caravans | Hired spears; S10 except the League | — |
| Heaven | Cloud-Warden, Watchers, Letters to the Mirror's Keepers, Pilgrims | S10 | — |

No AI realm in this spec declares war. On the historical path the Noon League never forms, because nothing attacks the Lands of the Sun.

## Acceptance

1. Each of the seven trees compiles with 30 to 50 focuses, unique positions and every focus below its prerequisites; the compiler and the HOI4 Agent Tools focus inspector pass.
2. No focus in these trees declares war or creates a war goal or claim (scan).
3. `raise_the_noon_league` forms the League only when `zin_sun_league_needed` holds and concord is 60 or more, and never twice (with the mechanic's decision and Gala's `zin_gala.7` in the same game).
4. No text states a relationship between the Gala elves and the Sunhot elves (review checklist); no text names Afrit before `zin_afrit_revealed` (compiler secret scan).
5. Godland's and Heaven's texts give no god, cult or origin to the stones or the sky (review).
6. Heaven's clarity gifts go through `zin_sun_add_clarity` and do nothing while the Mirror is stilled.
7. On a historical observer run no realm of this spec is at war before 4A 1760 unless attacked.
8. Every modifier in the spirits tables exists in the modifier documentation.

## Open questions

1. **Rulers.** Do you accept the six proposed rulers and their offices (High Gardener, Keeper of the High Places, Tide-Speaker, Speaker of the Two Shores, Steward, Cloud-Warden)?
2. **Godland and Heaven.** Their names are established places. This spec gives them standing stones and star-watchers with no god or origin. Do you have a meaning for these names that the trees should follow?
3. **Goodin at the Noon Council.** Should the Goodin Sunfolk be able to win a guest's seat at the Council, as proposed?
4. **The Lands of Light's eastern border.** The map puts the Lands of Light beside Alerhia and Miaed. Should the eastern coalition ever look south-west instead of across the rift, or should the border stay quiet in every game unless a player breaks it?
5. **Heaven and the Mirror.** May Heaven's watchers lend the Mirror of First Rain a little clarity? It ties a Sunhot realm to Gala's Mirror without saying anything about the two peoples.
