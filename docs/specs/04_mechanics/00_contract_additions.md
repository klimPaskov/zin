# Contract additions register

**Status:** Draft. **Priority:** 3. **Phase:** 3. Generated from the spec authors' reports on 18 October 2026.

## Purpose

The spec authors introduced shared names beyond [00_shared_contract.md](00_shared_contract.md). This register lists every one with the spec that introduced it. Implementation adopts a name into the contract when the system that owns it is built. A name declared by more than one spec is listed under **Declared by several specs**: implementation must confirm both specs mean the same thing before using it.

642 names from 20 specs; 9 declared by more than one spec.

## Declared by several specs

| Name | Declared by | Kinds and meanings |
| --- | --- | --- |
| `zin_aenor_crown_eindil` | aenor, eindil and glo | scripted effect: Coronation effects; sets zin_eindil_crowned / scripted effect (proposed, owned by Aenor succession): Crowns Eindil, sets zin_eindil_crowned, merges a dynamic Host into Aenor |
| `zin_afrit_add_footholds` | lerendor, afrit | scripted effect: Add $value$ to zin_footholds of the scoped country, clamped 0-5 (proposed name for the Afrit system; use the Afrit spec's name if it defines another) / scripted effects: Afrit system effects; zin_afrit_add_veil is called by the Aenor and Eindil specs, zin_afrit_wound by the Yeldenne spec, zin_afrit_begin_palace_battle by the Eindil spec |
| `zin_afrit_crown_aurevan` | aenor, afrit | scripted effect (owned by the Afrit spec): Makes Aurevan the leader of the scoped Aenor realm and sets zin_aurevan_crowned; called by zin_aenor.210 / scripted effects: Afrit system effects; zin_afrit_add_veil is called by the Aenor and Eindil specs, zin_afrit_wound by the Yeldenne spec, zin_afrit_begin_palace_battle by the Eindil spec |
| `zin_eastern_invasion` | world systems, east lands | global flag: The eastern coalition has invaded the Magical Lands; set by the eastern kings spec (4A 1755 historically) / global flag: The eastern coalition has crossed the rift into the Magical Lands (name from the diplomacy spec; set by zin_east.43; historical 4A 1755) |
| `zin_goldoroth_refuses_masters` | volgan and mirolon, dark lands | scripted trigger (expected): Optional override the Goldoroth spec may define so Goldoroth refuses Volgan's envoys / scripted triggers: Multipliers for the AI chance of Volgan's envoy event zin_dominion.8 (Goldoroth refusing becomes x0, seeking the south x4, tributaries, Moot members, fear, gifts, war with Goldoroth) |
| `zin_has_potent_magic` | zol, world systems | scripted trigger: Country can permanently end Zol's deathless dead (owned by magic and world systems) / scripted trigger: Potent magic: Glo carried (zin_glo_state 1 or 4), country flag zin_potent_magic (only from Eindil's journey and Zol's Lorien event), or Varner's wards spirit |
| `zin_lost_cause_with_eindil` | aenor, eindil and glo | global flag: The Lost Cause's frontier and scholarly branches follow Eindil; feeds the Lost Cause ending / global flag: The Lost Cause faction has passed to Eindil's Host |
| `zin_volgan_destroy_body` | eindil and glo, volgan and mirolon | scripted effect (proposed, owned by Volgan): Destroys Volgan's manifested body; sets zin_volgan_body_destroyed / scripted effect: Called by the Eindil spec at the second duel: sets zin_volgan_body_destroyed; removes Volgan's leader and marshal roles without killing him; Ember Herald becomes Steward; strength capped at 40; reveals the Silent Throne branch |
| `zin_world_add_gathering_dark` | zol, world systems | scripted effect: Used with positive and negative values; assumed to be defined by world systems as named in the contract's naming example / scripted effect: Arg value; gains scaled by zin_gathering_dark_rate and by 1.0/0.6/0.4 below 50/50-74/75+; losses unscaled; clamps 0-100 |

## All additions

| Name | Kind | Scope | Meaning | Declared by |
| --- | --- | --- | --- | --- |
| `_south_far)` | site scripted triggers (state scope) | state | Dark Lands sites generated in zin_sites.txt from the key sites table | dark lands |
| `_south_shore)` | site scripted triggers (state scope) | state | Dark Lands sites generated in zin_sites.txt from the key sites table | dark lands |
| `angels` | reserved people keys | peoples | Rejected by the build until the owner settles their lore and place on the map | foundation |
| `arcanists` | reserved people keys | peoples | Rejected by the build until the owner settles their lore and place on the map | foundation |
| `art/source/manifest.json` | data file | art | Maps every shipped DDS or TGA to its source generation id, cell, operations and hashes; the builder fails without it | interface art validation |
| `category_zin_archers` | sub_unit_category | unit_tags | New unit categories for doctrines, techs and scripts | warfare |
| `category_zin_dead` | sub_unit_category | unit_tags | New unit categories for doctrines, techs and scripts | warfare |
| `category_zin_great_beings` | sub_unit_category | unit_tags | New unit categories for doctrines, techs and scripts | warfare |
| `category_zin_monsters` | sub_unit_category | unit_tags | New unit categories for doctrines, techs and scripts | warfare |
| `category_zin_siege` | sub_unit_category | unit_tags | New unit categories for doctrines, techs and scripts | warfare |
| `dwarves` | reserved people keys | peoples | Rejected by the build until the owner settles their lore and place on the map | foundation |
| `Event ranges` | namespaces | events | zin_world 1-29 tension and war, 30-69 magic, 100-119 endings; zin_diplo; zin_economy; zin_path | world systems |
| `GFX_idea_zin_<key>` | sprite naming | art | Sprite names for icon catalog keys (focus, idea) and picture keys (event 210x176, news 397x153); files under gfx/interface/goals/zin/, gfx/interface/ideas/zin/, gfx/event_pictures/zin/ | interface art validation |
| `GFX_zin_evt_<key>` | sprite naming | art | Sprite names for icon catalog keys (focus, idea) and picture keys (event 210x176, news 397x153); files under gfx/interface/goals/zin/, gfx/interface/ideas/zin/, gfx/event_pictures/zin/ | interface art validation |
| `GFX_zin_focus_<key>` | sprite naming | art | Sprite names for icon catalog keys (focus, idea) and picture keys (event 210x176, news 397x153); files under gfx/interface/goals/zin/, gfx/interface/ideas/zin/, gfx/event_pictures/zin/ | interface art validation |
| `GFX_zin_focus_<key>_shine` | sprite naming | art | Sprite names for icon catalog keys (focus, idea) and picture keys (event 210x176, news 397x153); files under gfx/interface/goals/zin/, gfx/interface/ideas/zin/, gfx/event_pictures/zin/ | interface art validation |
| `GFX_zin_news_<key>` | sprite naming | art | Sprite names for icon catalog keys (focus, idea) and picture keys (event 210x176, news 397x153); files under gfx/interface/goals/zin/, gfx/interface/ideas/zin/, gfx/event_pictures/zin/ | interface art validation |
| `goblins` | people keys (new) | peoples | Split goblins from orcs; add ogres | foundation |
| `gods_gathering` | event picture keys (proposed catalog additions) | 05_focus_trees/02_icon_catalog.md | Temple nave without figures (fallback hermitage); light from clouds over a fallen man, gate zin_eindil_restored (fallback dragon_return); burning pass watchtowers, gate zin_war_of_last_crowns (fallback mirolon_passes) | events |
| `mycids` | reserved people keys | peoples | Rejected by the build until the owner settles their lore and place on the map | foundation |
| `ogres` | people keys (new) | peoples | Split goblins from orcs; add ogres | foundation |
| `passes_burning` | event picture keys (proposed catalog additions) | 05_focus_trees/02_icon_catalog.md | Temple nave without figures (fallback hermitage); light from clouds over a fallen man, gate zin_eindil_restored (fallback dragon_return); burning pass watchtowers, gate zin_war_of_last_crowns (fallback mirolon_passes) | events |
| `temple_parim_interior` | event picture keys (proposed catalog additions) | 05_focus_trees/02_icon_catalog.md | Temple nave without figures (fallback hermitage); light from clouds over a fallen man, gate zin_eindil_restored (fallback dragon_return); burning pass watchtowers, gate zin_war_of_last_crowns (fallback mirolon_passes) | events |
| `The Free Steadings (Fearno) and The Pupor Charter (Pollos or Adel)` | factions created in play by focuses (create_faction) | diplomacy | Two proposed factions formed during play; the diplomacy spec may want templates zin_faction_free_steadings / zin_faction_pupor_charter | regions: cold, west, tritons |
| `The Warden League` | faction | Mirolon | Proposed faction Mirolon leads with willing free Dead Lands realms (mutually exclusive with joining the Lost Cause) | volgan and mirolon |
| `zin_<tree>_<name>` | character id pattern | characters | Id for a character used by one country only, where <tree> is the country's focus tree id. Shared characters keep zin_<name>; rulers keep <TAG>_zin_ruler, except Volgan, Lorien, Horos and the Deliverer, who use the contract ids zin_volgan, zin_lorien, zin_horos and zin_aurevan. | lore digest |
| `zin_<tree>_opinion + common/opinion_modifiers/zin_<tree>.txt` | tree-declared helper pattern (compiler extension) | focus compiler | Trees declare opinion modifiers in an opinion_modifiers block compiled to their own file; helper effect adds them (same mechanism the Goldoroth tree's zin_goldoroth_opinion assumes) | regions: dark, magical, dead |
| `zin_adv_<trait>` | advisor traits (12) | character | Political advisor traits: treasurer, court_favourite, sage, road_warden, whisper_master, high_priest, envoy, merchant_prince, muster_master, elder, war_speaker, grave_binder | foundation |
| `zin_aenor event ids` | event namespace allocation | events | Namespace zin_aenor: ids 1-499 mechanics (events/zin_aenor_court.txt), 500-699 focus tree (events/zin_aenor.txt) | aenor |
| `zin_aenor_add_concord_loyalty` | scripted effect | dominion | Add to zin_concord_loyalty (arg value) and clamp | aenor |
| `zin_aenor_add_council_influence` | scripted effect | any | Add to zin_council_influence (arg value); callable from any scope, targets the ruling Aenor realm; used by the Afrit spec | aenor |
| `zin_aenor_add_court_corruption` | scripted effect | Aenor realm | Add to zin_court_corruption (arg value), clamp, refresh modifiers | aenor |
| `zin_aenor_captains_regency` | characters | Aenor realm | Collective leaders for the Court camp, the Dominions camp and the post-flight regency (proposed) | aenor |
| `zin_aenor_concord_avg` | variable | Aenor realm | Average zin_concord_loyalty of current dominions; shown in the UI and usable by the Aenor spec's Dominions camp formula | interface art validation |
| `zin_aenor_concord_speaker` | characters | Aenor realm | Collective leaders for the Court camp, the Dominions camp and the post-flight regency (proposed) | aenor |
| `zin_aenor_council_dominant` | scripted trigger | Aenor realm | zin_council_influence >= 70 | aenor |
| `zin_aenor_crown_eindil` | scripted effect | Aenor realm | Coronation effects; sets zin_eindil_crowned | aenor, eindil and glo |
| `zin_aenor_eindil_can_be_crowned` | scripted trigger | any | Coronation conditions: Afrit dead, Eindil named and returned, an Aenor realm with Eindil controls Parim | aenor |
| `zin_aenor_fallback_seat` | generated site/region triggers | state / strategic region | New rows for the key sites table (01_map/02_key_sites.md) | west and cold lands |
| `zin_aenor_gold` | variable | Aenor (0-2000) | The Golden Court's treasury; changed only through zin_economy_add_gold | world systems |
| `zin_aenor_golden_regency` | characters | Aenor realm | Collective leaders for the Court camp, the Dominions camp and the post-flight regency (proposed) | aenor |
| `zin_aenor_hasten_death_clock` | scripted effect | any | Afrit spec hastens the Golden King's death (arg days, at most 180 in total) | aenor |
| `zin_aenor_host_available` | scripted trigger | any | zin_eindil_named and Eindil has reached the Middle Lands (proposed zin_eindil_stage >= 9) | aenor |
| `zin_aenor_is_concord_dominion` | scripted trigger | country | Subject of an Aenor realm and not a seceded Free Dominion | aenor |
| `zin_aenor_is_realm` | scripted trigger | country | Country's original_tag is Aenor's (covers civil-war breakaways) | aenor |
| `zin_aenor_king_alive` | scripted trigger | any | zin_golden_king_dead not set | aenor |
| `zin_aenor_king_health` | variable | Aenor | 0 sound, 1 tired, 2 failing; set by omen event zin_aenor.240 so the Court panel can show the last omen | interface art validation |
| `zin_aenor_lost_cause` | variable | Aenor realm | Real strength of the Lost Cause, 0-100, start 20 | aenor |
| `zin_aenor_regency_while_king_lost / zin_aenor_restore_hailed_king` | scripted effect | Aenor realm | Called by the Eindil spec when Eindil is cast from the cliff and when he returns | aenor |
| `zin_aenor_ruled_by_court / _faithful / _dominions / _host / _captains` | scripted trigger | Aenor realm | Which succession camp governs the Aenor realm | aenor |
| `zin_aenor_ruling_camp` | variable | Aenor realm | Who rules the Aenor realm: 0 Golden King, 1 Court, 2 Faithful, 3 Dominions, 4 Host, 5 Captains' Regency | aenor |
| `zin_afrit_abandoned_aenor` | global flag | global | Afrit has fled Aenor (the flight east) | afrit |
| `zin_afrit_add_footholds` | scripted effect | country | Add $value$ to zin_footholds of the scoped country, clamped 0-5 (proposed name for the Afrit system; use the Afrit spec's name if it defines another) | lerendor, afrit |
| `zin_afrit_add_plot` | scripted effects | as specified in afrit_hidden_council.md | Afrit system effects; zin_afrit_add_veil is called by the Aenor and Eindil specs, zin_afrit_wound by the Yeldenne spec, zin_afrit_begin_palace_battle by the Eindil spec | afrit |
| `zin_afrit_add_veil` | scripted effects | as specified in afrit_hidden_council.md | Afrit system effects; zin_afrit_add_veil is called by the Aenor and Eindil specs, zin_afrit_wound by the Yeldenne spec, zin_afrit_begin_palace_battle by the Eindil spec | afrit |
| `zin_afrit_ashen_throne_ready` | scripted trigger | any | Conditions for the Ashen Throne ending are met; world systems read it | afrit |
| `zin_afrit_at_yeldenne` | global flag | global | Afrit's expedition reached Yeldenne | afrit |
| `zin_afrit_attune_artifact` | scripted effects | as specified in afrit_hidden_council.md | Afrit system effects; zin_afrit_add_veil is called by the Aenor and Eindil specs, zin_afrit_wound by the Yeldenne spec, zin_afrit_begin_palace_battle by the Eindil spec | afrit |
| `zin_afrit_attuned_ring / zin_afrit_attuned_crown / zin_afrit_attuned_bracelet / zin_afrit_attuned_necklace` | global flags | global | That artifact's power is fully woken (graces at 100%) | afrit |
| `zin_afrit_begin_palace_battle` | scripted effects | as specified in afrit_hidden_council.md | Afrit system effects; zin_afrit_add_veil is called by the Aenor and Eindil specs, zin_afrit_wound by the Yeldenne spec, zin_afrit_begin_palace_battle by the Eindil spec | afrit |
| `zin_afrit_can_deepen_foothold` | scripted trigger | country | Target is below its foothold cap, not at war with the hub, not purged | afrit |
| `zin_afrit_cast_down_eindil` | global flag | global | Afrit has cast Eindil from the cliff; the Eindil spec owns the aftermath | afrit |
| `zin_afrit_claim_middle_lands` | scripted effects | as specified in afrit_hidden_council.md | Afrit system effects; zin_afrit_add_veil is called by the Aenor and Eindil specs, zin_afrit_wound by the Yeldenne spec, zin_afrit_begin_palace_battle by the Eindil spec | afrit |
| `zin_afrit_claims_erdae` | global flag | global | Afrit has retaken Parim and claims kingship over all Erdae | afrit |
| `zin_afrit_compute_watch` | scripted effects | as specified in afrit_hidden_council.md | Afrit system effects; zin_afrit_add_veil is called by the Aenor and Eindil specs, zin_afrit_wound by the Yeldenne spec, zin_afrit_begin_palace_battle by the Eindil spec | afrit |
| `zin_afrit_council` | decision category | Worshipdom | The Hermitage Chapter / The Hidden Council; visible only to the hub | afrit |
| `zin_afrit_crown_aurevan` | scripted effect (owned by the Afrit spec) | Aenor realm | Makes Aurevan the leader of the scoped Aenor realm and sets zin_aurevan_crowned; called by zin_aenor.210 | aenor, afrit |
| `zin_afrit_die` | scripted effects | as specified in afrit_hidden_council.md | Afrit system effects; zin_afrit_add_veil is called by the Aenor and Eindil specs, zin_afrit_wound by the Yeldenne spec, zin_afrit_begin_palace_battle by the Eindil spec | afrit |
| `zin_afrit_eastern_candidate` | scripted trigger | country | East Lands country with footholds 4+, not at war with the hub, not Volgan's, not Aenor's subject | afrit |
| `zin_afrit_eastern_client` | country flag | country | Knelt to the King of the East | afrit |
| `zin_afrit_flee_east` | scripted effects | as specified in afrit_hidden_council.md | Afrit system effects; zin_afrit_add_veil is called by the Aenor and Eindil specs, zin_afrit_wound by the Yeldenne spec, zin_afrit_begin_palace_battle by the Eindil spec | afrit |
| `zin_afrit_graces` | dynamic modifiers | country | Public effect of footholds in a country; artifact graces on the realm Afrit leads | afrit |
| `zin_afrit_holds_parim` | scripted trigger | any | Parim is controlled by Afrit's realm, the Worshipdom, its faction or its subject | afrit |
| `zin_afrit_houses` | dynamic modifiers | country | Public effect of footholds in a country; artifact graces on the realm Afrit leads | afrit |
| `zin_afrit_houses_purged` | country flag | country | This country closed the Houses (365 days, no deepening) | afrit |
| `zin_afrit_impostor_denounced` | global flag | global | The crown has denounced Eindil as an impostor; halves veil loss from his warnings | afrit |
| `zin_afrit_is_hub` | scripted trigger | country | Country is the original Worshipdom (the Council's hub) | afrit |
| `zin_afrit_is_secret` | scripted trigger | any | zin_afrit_revealed is not set | afrit |
| `zin_afrit_kingdom_behind_throne` | global flag | global | The Council rules through a living Golden King or a puppet heir instead of crowning Aurevan | afrit |
| `zin_afrit_knows_brother` | global flag | global | Afrit has learned that Eindil lives and was named by Lorien | afrit |
| `zin_afrit_lose_artifact` | scripted effects | as specified in afrit_hidden_council.md | Afrit system effects; zin_afrit_add_veil is called by the Aenor and Eindil specs, zin_afrit_wound by the Yeldenne spec, zin_afrit_begin_palace_battle by the Eindil spec | afrit |
| `zin_afrit_lost_cause_watched` | global flag | global | The Council watches the Lost Cause's court branch (slows its investigation) | afrit |
| `zin_afrit_lost_ring / zin_afrit_lost_crown / zin_afrit_lost_bracelet / zin_afrit_lost_necklace` | global flags | global | That artifact has been stripped from Afrit (palace battle) | afrit |
| `zin_afrit_palace_held` | global flag | global | A palace stage failed; Afrit holds the palace (Ashen Throne path a) | afrit |
| `zin_afrit_proclaim_king_of_east` | scripted effects | as specified in afrit_hidden_council.md | Afrit system effects; zin_afrit_add_veil is called by the Aenor and Eindil specs, zin_afrit_wound by the Yeldenne spec, zin_afrit_begin_palace_battle by the Eindil spec | afrit |
| `zin_afrit_purge_houses` | scripted effects | as specified in afrit_hidden_council.md | Afrit system effects; zin_afrit_add_veil is called by the Aenor and Eindil specs, zin_afrit_wound by the Yeldenne spec, zin_afrit_begin_palace_battle by the Eindil spec | afrit |
| `zin_afrit_raise_eastern_host` | scripted effects | as specified in afrit_hidden_council.md | Afrit system effects; zin_afrit_add_veil is called by the Aenor and Eindil specs, zin_afrit_wound by the Yeldenne spec, zin_afrit_begin_palace_battle by the Eindil spec | afrit |
| `zin_afrit_raise_seat` | scripted effects | as specified in afrit_hidden_council.md | Afrit system effects; zin_afrit_add_veil is called by the Aenor and Eindil specs, zin_afrit_wound by the Yeldenne spec, zin_afrit_begin_palace_battle by the Eindil spec | afrit |
| `zin_afrit_ready_regicide` | scripted effects | as specified in afrit_hidden_council.md | Afrit system effects; zin_afrit_add_veil is called by the Aenor and Eindil specs, zin_afrit_wound by the Yeldenne spec, zin_afrit_begin_palace_battle by the Eindil spec | afrit |
| `zin_afrit_refresh_graces` | scripted effects | as specified in afrit_hidden_council.md | Afrit system effects; zin_afrit_add_veil is called by the Aenor and Eindil specs, zin_afrit_wound by the Yeldenne spec, zin_afrit_begin_palace_battle by the Eindil spec | afrit |
| `zin_afrit_refused_east` | country flag | country | Refused the King of the East | afrit |
| `zin_afrit_regicide_exposed` | global flag | global | The murder plot was exposed; the Golden King may turn on the Council | afrit |
| `zin_afrit_regicide_plot` | variable | global | Council's preparation of the Golden King's murder (0-100, start 20) | afrit |
| `zin_afrit_regicide_ready` | global flag | global | The plot is ready; Aenor's succession fires the Golden King's death within 30 days | afrit |
| `zin_afrit_retake_aenor` | scripted effects | as specified in afrit_hidden_council.md | Afrit system effects; zin_afrit_add_veil is called by the Aenor and Eindil specs, zin_afrit_wound by the Yeldenne spec, zin_afrit_begin_palace_battle by the Eindil spec | afrit |
| `zin_afrit_return` | scripted effects | as specified in afrit_hidden_council.md | Afrit system effects; zin_afrit_add_veil is called by the Aenor and Eindil specs, zin_afrit_wound by the Yeldenne spec, zin_afrit_begin_palace_battle by the Eindil spec | afrit |
| `zin_afrit_returned` | global flag | global | Afrit has returned from the East with a host | afrit |
| `zin_afrit_returns_west` | global flag | global, set by the Afrit system | Afrit's eastern host marches west to retake Aenor (hist 4A 1758); starts journey stage 10 | eindil and glo |
| `zin_afrit_reveal` | scripted effects | as specified in afrit_hidden_council.md | Afrit system effects; zin_afrit_add_veil is called by the Aenor and Eindil specs, zin_afrit_wound by the Yeldenne spec, zin_afrit_begin_palace_battle by the Eindil spec | afrit |
| `zin_afrit_rules_here` | scripted trigger | country | Country's leader is zin_aurevan | afrit |
| `zin_afrit_scholars_bought` | global flag | global | Scholars of the First Men are bought; read by the Eindil spec to slow belief in Eindil | afrit |
| `zin_afrit_seat_censers` | variable | global | Level of the Seat of Censers, worship (0-5, start 2) | afrit |
| `zin_afrit_seat_relics` | variable | global | Level of the Seat of Relics, artifacts (0-5, start 2) | afrit |
| `zin_afrit_seat_seals` | variable | global | Level of the Council's Seat of Seals, royal administration (0-5, start 3) | afrit |
| `zin_afrit_seat_whispers` | variable | global | Level of the Seat of Whispers, foreign agents (0-5, start 1) | afrit |
| `zin_afrit_secret_kept` | scripted_trigger | any | True while the global flag zin_afrit_revealed is unset. Every text or effect that differs before and after the reveal uses it. | lore digest |
| `zin_afrit_slay / zin_afrit_lose_artifacts / zin_afrit_country` | scripted effects and trigger (proposed, owned by Afrit) | Afrit | Afrit's death (sets zin_afrit_dead), artifact loss in the palace, and the trigger identifying Afrit's country | eindil and glo |
| `zin_afrit_spread_footholds` | scripted effects | as specified in afrit_hidden_council.md | Afrit system effects; zin_afrit_add_veil is called by the Aenor and Eindil specs, zin_afrit_wound by the Yeldenne spec, zin_afrit_begin_palace_battle by the Eindil spec | afrit |
| `zin_afrit_stand_in_parim` | global flag | global | Afrit chose to hold Parim instead of fleeing (Ashen Throne path) | afrit |
| `zin_afrit_suspicious` | country flag | country | This court suspects the Houses (730 days); may close them | afrit |
| `zin_afrit_unmasked_early` | global flag | global | Afrit was revealed before the crowning | afrit |
| `zin_afrit_veil` | variable | global | Strength of Afrit's secret (0-100, start 80); at 0 calls zin_afrit_reveal | afrit |
| `zin_afrit_veil_last_change` | variable | global | Veil change over the last month; set by the Afrit monthly pulse for the hub's Council panel | interface art validation |
| `zin_afrit_wargoal_refuser` | scripted effects | as specified in afrit_hidden_council.md | Afrit system effects; zin_afrit_add_veil is called by the Aenor and Eindil specs, zin_afrit_wound by the Yeldenne spec, zin_afrit_begin_palace_battle by the Eindil spec | afrit |
| `zin_afrit_wound` | scripted effects | as specified in afrit_hidden_council.md | Afrit system effects; zin_afrit_add_veil is called by the Aenor and Eindil specs, zin_afrit_wound by the Yeldenne spec, zin_afrit_begin_palace_battle by the Eindil spec | afrit |
| `zin_afrit_wounded` | global flag | global | Afrit was wounded at Yeldenne | afrit |
| `zin_afrit_wounded_at_yeldenne` | global flag | global | Afrit bled at Yeldenne (hist 4A 1753); the Afrit system decides further effects | eindil and glo |
| `zin_asgard_harbours_barred / zin_asgard_spared` | country flags | Asgard | Proposed Western Crossing hook: when barred, the West's first sailing goes to the mainland shore | regions: middle and north |
| `zin_aurevan_went_north` | global flag | global | The Deliverer left Parim to meet the heir near Yeldenne; Merovan holds the seals (hist 4A 1753) | eindil and glo |
| `zin_autonomy_chartered_dominion / zin_autonomy_sworn_realm / zin_autonomy_client_crown` | autonomy states | subjects | Concord dominions, Volgan's sworn realms, Afrit's eastern client crowns | world systems |
| `zin_autonomy_tributary_hold` | autonomy state | subjects of Goldoroth | Tributary Hold: Goldoroth's yoked holds (min_freedom_level 0.4, cannot declare war, manpower share 0.2) | dark lands |
| `zin_black_compact` | global flag | global | Volgan and Zol made a temporary truce against Eindil: white peace and mutual access, no shared faction (historical 4A 1757) | volgan and mirolon |
| `zin_black_compact_ended` | global flag | global | The Black Compact has ended (body destroyed or Zol withdrawn); the compact is active while zin_black_compact is set and this flag is not | volgan and mirolon |
| `zin_blue_sword_broken` | global flag | global | Zol has crushed Horos's blue sword (set once by zin_mistake.21); read by Eindil's journey and the palace battle | zol |
| `zin_cat_arms ... zin_cat_skies (13 categories)` | technology_category | technology_tags | Research-bonus categories that focus trees and ideas must name | warfare |
| `zin_cb_free_east` | casus belli (dynamic modifier, diplomacy spec) | country | Refusers of the King of the East against the Eastern Throne and its members, while zin_afrit_king_of_east holds and zin_afrit_dead does not | east lands |
| `zin_cb_high_king` | casus belli (dynamic modifier, diplomacy spec) | country | Noris or Stabilo on its unification route against courts leaning to the rival or kneeling to the King of the East; only after zin_war_of_last_crowns or zin_afrit_king_of_east | east lands |
| `zin_cb_hold_defiance` | casus belli (dynamic modifier via zin_diplo_grant_cb) | Goldoroth | Goldoroth against a hold that refused the Iron Yoke; 365 days; only from 1750.1.1 | dark lands |
| `zin_cold_guides_north / zin_cold_watch_fires / zin_cold_hall_respected / zin_cold_far_ice_charted` | country flags (Coldor) | country | Coldor's hooks into the journey ambush, the forewarning of the Castle of Yeldenne, Dominion petitions and the journey's event 11 wardens option | west and cold lands |
| `zin_cold_isengard_settled` | scripted trigger | any | Isengard has sworn to the Accord, or is Coldor's subject, or is gone and Coldor owns its capital | west and cold lands |
| `zin_cold_joins_crossing` | global flag | global | Coldor joined the Western Crossing; the faction's joining rule reads it | west and cold lands |
| `zin_cold_lean / zin_cold_isengard_defiance / zin_cold_accord_reach / zin_cold_winter` | variables | country / global | Clan lean (-100 Isengard to +100 Fandanar), Isengard's defiance, the Accord's reach, this winter's severity (global 0-2) | west and cold lands |
| `zin_cold_neck_road` | global flag | global | The Neck Road between the Cold Lands and the West Lands is open; read by the journey's 'The Traders' Road South' | west and cold lands |
| `zin_concord_add_own_loyalty` | scripted effect (arg value) | country (dominion) | Adds to ROOT's zin_concord_loyalty via zin_aenor_add_concord_loyalty only while ROOT is a Concord dominion; otherwise does nothing | regions: middle and north |
| `zin_concord_ask_for_charter` | scripted effect | country | A free Middle Lands land asks the Aenor realm holding Parim to take it into the Concord (zin_shared_concord_dominions.3) | regions: middle and north |
| `zin_concord_back_camp` | scripted effect (args camp, value) | country | After zin_golden_king_dead and before zin_eindil_crowned, calls zin_aenor_add_camp_support in the overlord Aenor realm, or else in the Aenor realm holding Parim; before the King's death it does nothing | regions: middle and north |
| `zin_concord_join_free_dominions` | scripted effect | country | ROOT joins the faction led by the Free Dominion that leads a faction | regions: middle and north |
| `zin_concord_petition_charter` | scripted effect (arg charter: free/shield/golden/old) | country (dominion) | Fires zin_shared_concord_dominions.1 (charter petition) to the dominion's overlord; respects the 180-day charter cooldown | regions: middle and north |
| `zin_corvel` | character | Worshipdom | Corvel, Master of Couriers, Seat of Whispers (proposed) | afrit |
| `zin_cosmetic_<country>_<key>` | cosmetic tag naming | country | Story names of realms, for example zin_cosmetic_aenor_ashen after the reveal | foundation |
| `zin_dark / zin_goldoroth` | event namespaces | global | Dark Lands mechanic events / Goldoroth tree events | dark lands |
| `zin_dark_accord_holds` | global flags (mechanic-local, not story flags) | global | The Free Moot of the holds exists; Goldoroth and Dondor are in a truce against Zol's dead; Accord resolve >= 60 | dark lands |
| `zin_dark_accord_resolve` | global variable (0-100, start 40) | global | Cohesion of the Dark Sea Accord; scales dynamic modifier zin_dark_accord_shield on members | dark lands |
| `zin_dark_add_volgan_pact` | scripted effect (args target, value) | any | Adds to Volgan's zin_volgan_pact, clamps 0-3, never raises a country to 3 (level 3 only via Volgan's Sworn to Nafeher) | dark lands |
| `zin_dark_border_tension` | global variable (0-100, start 35) | global | How near Goldoroth and the Dark Sea Accord are to open war; read by every Dark Lands tree and by Lerendor | dark lands |
| `zin_dark_found_free_moot` | scripted effect | Dark Lands hold (country) | Effect of the decision Call the Free Moot without its cost (sets zin_dark_free_moot, founder flag, fires zin_dark.70), so focuses can call it | regions: dark, magical, dead |
| `zin_dark_free_moot` | global flags (mechanic-local, not story flags) | global | The Free Moot of the holds exists; Goldoroth and Dondor are in a truce against Zol's dead; Accord resolve >= 60 | dark lands |
| `zin_dark_gifts_returned` | country flag | country (hold) | Hold sent back Cocanoor's gifts; Send Gifts of Black Iron gives this target +5 sway instead of +10 | regions: dark, magical, dead |
| `zin_dark_hold_at_war_with_goldoroth` | scripted triggers | Dark Lands countries | Multipliers for the AI chance of Volgan's envoy event zin_dominion.8 (Goldoroth refusing becomes x0, seeking the south x4, tributaries, Moot members, fear, gifts, war with Goldoroth) | dark lands |
| `zin_dark_hold_fears_cocanoor` | scripted triggers | Dark Lands countries | Multipliers for the AI chance of Volgan's envoy event zin_dominion.8 (Goldoroth refusing becomes x0, seeking the south x4, tributaries, Moot members, fear, gifts, war with Goldoroth) | dark lands |
| `zin_dark_hold_in_moot` | scripted triggers | Dark Lands countries | Multipliers for the AI chance of Volgan's envoy event zin_dominion.8 (Goldoroth refusing becomes x0, seeking the south x4, tributaries, Moot members, fear, gifts, war with Goldoroth) | dark lands |
| `zin_dark_hold_under_cocanoor` | scripted triggers | Dark Lands countries | Multipliers for the AI chance of Volgan's envoy event zin_dominion.8 (Goldoroth refusing becomes x0, seeking the south x4, tributaries, Moot members, fear, gifts, war with Goldoroth) | dark lands |
| `zin_dark_join_free_moot` | scripted effect | Dark Lands hold (country) | The accept option of zin_dark.70 as an effect: zin_dark_moot_member, spirit zin_dark_free_moot, opinion zin_dark_moot_kin with members | regions: dark, magical, dead |
| `zin_dark_oath_sworn` | country flag | country (Belonton and other Accord members) | Accord member has sworn the Accord oath; halves AI chance of 'Take the gold' (zin_goldoroth.8) and 'Leave the Accord' (zin_goldoroth.19) | regions: dark, magical, dead |
| `zin_dark_petitioned_parim` | country flag | country (Dondor / Accord leader) | Petition Parim (zin_dark.30) has been used; shared by the mechanic decision and Dondor's focus Notbuton Asks Parim | regions: dark, magical, dead |
| `zin_dark_shore_barred` | scripted trigger | global | Proposed hook for the Zol's Mistake spec: the Dark Lands side of the northern Dark Strait is held against Zol with coastal forts >= 2 | dark lands |
| `zin_dark_took_southern_gifts` | scripted triggers | Dark Lands countries | Multipliers for the AI chance of Volgan's envoy event zin_dominion.8 (Goldoroth refusing becomes x0, seeking the south x4, tributaries, Moot members, fear, gifts, war with Goldoroth) | dark lands |
| `zin_dark_truce_against_dead` | global flags (mechanic-local, not story flags) | global | The Free Moot of the holds exists; Goldoroth and Dondor are in a truce against Zol's dead; Accord resolve >= 60 | dark lands |
| `zin_deathless_equipment` | equipment | country | Equipment that cannot be produced; only the warfare effects above grant or remove it | warfare |
| `zin_diplo_grant_cb` | scripted effect | country | Args cb, target, days: adds a casus belli dynamic modifier (zin_cb_*) with a targeted generate_wargoal_tension_against | world systems |
| `zin_diplo_is_dark_power` | scripted trigger | country | Volgan, a Southern Dominion member, Zol, or after zin_afrit_revealed the realm zin_afrit_rules_here or the Worshipdom | world systems |
| `zin_diplo_lift_refusal` | scripted effect | country | Lifts the Refusal for the scoped realm (called by Zol's zin_mistake.22, the Break the Refusal decision, the MARCH rule) | world systems |
| `zin_diplo_peace_breaker` | idea | country | 180-day penalty for declaring war while zin_world_peace_holds; story wars exempt via country flag zin_story_war | world systems |
| `zin_diplo_refusal_binds` | scripted trigger | country | Elven or Sunhot elven realm without zin_refusal_lifted | world systems |
| `zin_dom_divine` | stance (ideology type, Dominion) | country leader ideology | Divine Crown: Aenor after zin_aurevan_crowned and before zin_afrit_revealed; never names Afrit | foundation |
| `zin_dominion` | event namespace | events/zin_dominion.txt | Volgan/Mirolon mechanic events; separate from the tree namespaces zin_volgan and zin_mirolon to avoid collision. Others call: .5 (Mirolon's warning, to Aenor), .14 (Black Compact offer, to Zol), .16 (first duel, Volgan side) | volgan and mirolon |
| `zin_dominion_grave_musters / zin_dominion_court / zin_dominion_mirolon_watch` | decision categories | Volgan / Mirolon | Mechanic decisions: grave musters; court (oaths, envoys, Nether Gate, client crowns); Mirolon's scouting | volgan and mirolon |
| `zin_dominion_oath` | variable | Demon, Dolon, Nezer | 0-100; member loyalty to Nafeher; start 60/55/50; read by the members' tier B trees | volgan and mirolon |
| `zin_dominion_own_road` | country flag | Demon, Dolon, Nezer | Set by the 'seek its own road' option of zin_dominion.22; opens the sworn realms' Our Own Road branch | regions: dark, magical, dead |
| `zin_dominion_tributary_friend` | country flag | free Dead Lands country (Olen, Nan, shared_dead_lands realms) | A free Dead Lands realm keeps the old quiet with Nafeher (tribute accepted); Volgan AI plans no war on it before zin_volgan_marches and offers client-crown terms after | regions: dark, magical, dead |
| `zin_dragon_equipment` | equipment | country | Equipment that cannot be produced; only the warfare effects above grant or remove it | warfare |
| `zin_dragon_flights` | variable | country | Dragon flights a country may hold under its pact (0-10); dragons held never exceed 3 x this | warfare |
| `zin_dragons_free` | global variable | global (0-6) | Dragon grants Dragon Mountain can still give; never refills | world systems |
| `zin_drift_dominion` | variables | country | Queued popularity drift for this month | foundation |
| `zin_drift_light` | variables | country | Queued popularity drift for this month | foundation |
| `zin_drift_resistance` | variable (0-0.5) | country | Share of ZIN drift ignored, set from stance | foundation |
| `zin_drift_shadow` | variables | country | Queued popularity drift for this month | foundation |
| `zin_drift_wild` | variables | country | Queued popularity drift for this month | foundation |
| `zin_east_add_lean / zin_east_add_rivalry / zin_east_add_road_influence / zin_east_add_all_roads` | scripted effect | court / any / Noris or Stabilo | The only write paths for lean, rivalry and road influence (tier B and C eastern trees call them) | east lands |
| `zin_east_after_the_king` | scripted effect | various | Coalition peace offers, Free Crowns and unification causes, the united-East outcome, the aftermath of Afrit's death in the East | east lands |
| `zin_east_caravan_war` | global flag | global | Noris and Stabilo are at war with each other (cleared at peace) | east lands |
| `zin_east_caravan_war_open` | scripted trigger | country / any | Eastern court tests, South Lands court test, rift-facing test, route-junction gate, Caravan War gate, refuser-while-the-King-reigns test | east lands |
| `zin_east_coalition_member / zin_east_coalition_leader` | country flag | country | Member or leader of the eastern coalition that invades the Magical Lands | east lands |
| `zin_east_companies_with_eindil` | country flag | country | An eastern country's stranded companies serve Eindil's coalition (for the Eindil spec's Call the Stranded Armies) | east lands |
| `zin_east_court_audit` | country flag | country (East Lands courts) | The court audited the temples ('Count the Temple Gold', Mora's 'Ledgers of the Temples'). Proposed reader: the 'Accept the loan' option of zin_east.30 gets AI weight 0 (the mechanic's 'audit flag from a tree'). | regions: east, south isles, sun |
| `zin_east_declare_united` | scripted effect | various | Coalition peace offers, Free Crowns and unification causes, the united-East outcome, the aftermath of Afrit's death in the East | east lands |
| `zin_east_dominance` | variable | Noris, Stabilo | Share of East Lands states held by Noris or Stabilo and their subjects (plus half of faction members' states), 0-100 | east lands |
| `zin_east_faces_rift` | scripted trigger | country / any | Eastern court tests, South Lands court test, rift-facing test, route-junction gate, Caravan War gate, refuser-while-the-King-reigns test | east lands |
| `zin_east_free_crown` | scripted trigger | country / any | Eastern court tests, South Lands court test, rift-facing test, route-junction gate, Caravan War gate, refuser-while-the-King-reigns test | east lands |
| `zin_east_free_crowns_leader` | country flag | country | First of the Free Crowns (leader of courts that refused the King of the East) | east lands |
| `zin_east_grant_free_cb` | scripted effect | various | Coalition peace offers, Free Crowns and unification causes, the united-East outcome, the aftermath of Afrit's death in the East | east lands |
| `zin_east_grant_high_king_cb` | scripted effect | various | Coalition peace offers, Free Crowns and unification causes, the united-East outcome, the aftermath of Afrit's death in the East | east lands |
| `zin_east_in_crisis` | country flag | country | Lost a road charter, capitulated or stability below 30% within 365 days; raises temple loans, coalition weight and kneel bias | east lands |
| `zin_east_is_court` | scripted trigger | country / any | Eastern court tests, South Lands court test, rift-facing test, route-junction gate, Caravan War gate, refuser-while-the-King-reigns test | east lands |
| `zin_east_is_south_court` | scripted trigger | country / any | Eastern court tests, South Lands court test, rift-facing test, route-junction gate, Caravan War gate, refuser-while-the-King-reigns test | east lands |
| `zin_east_kneel_bias` | variable | each East Lands country | Eastern pressures toward kneeling to the King of the East, -100 to 100; proposed input to the Afrit spec's zin_afrit.51 acceptance chance and historical tie-break | east lands |
| `zin_east_lean` | variable | each East Lands court | East Lands court lean, -100 (Postondoroth) to +100 (Furvior) | east lands |
| `zin_east_ledger` | decision category | Stabilo | Stabilo's Ledger decisions (specified in stabilo.md, implemented in the mechanic's decision file) | east lands |
| `zin_east_offer_coalition_peace` | scripted effect | various | Coalition peace offers, Free Crowns and unification causes, the united-East outcome, the aftermath of Afrit's death in the East | east lands |
| `zin_east_pledged` | country flag | country | Court has pledged itself to the Deliverer's friends; proposed: the Afrit spec treats it as an eastern candidate at footholds 3+ | east lands |
| `zin_east_prepare_kneel` | scripted effect | court | Makes a court leave the Noris Treaty or Stabilo Pact before joining the Eastern Throne; proposed to be called first by the kneel option of zin_afrit.51 | east lands |
| `zin_east_question_open` | scripted trigger | country / any | Eastern court tests, South Lands court test, rift-facing test, route-junction gate, Caravan War gate, refuser-while-the-King-reigns test | east lands |
| `zin_east_rift_ambition` | country flag | country (East Lands courts) | The court chose to lead the crossing of the rift (Alerhia's 'Lord of the Crossing'; other trees may reuse it). Proposed reader: +15 coalition weight in the eastern kings mechanic's zin_east.41 selection. | regions: east, south isles, sun |
| `zin_east_rivalry` | variable | global | Caravan rivalry between Noris and Stabilo, 0-100, start 40 | east lands |
| `zin_east_roads_concord` | global flag | global | Noris and Stabilo have signed the Concord of the Roads | east lands |
| `zin_east_route_resist` | country flag | country (East Lands courts) | A tier B or C eastern court took the resist route ('Our Court Kneels to No God', Alerhia's 'Warden of the Rift'). Proposed reader: the eastern kings mechanic gives kneel bias -100 (its row 'a tree's resist route flag') and coalition weight -50. | regions: east, south isles, sun |
| `zin_east_turns_west` | global flag | global | The eastern coalition has declared war on Aenor (feeds the Afrit spec's flight condition; historical by 1 Deepwinter 4A 1756) | east lands |
| `zin_east_united` | global flag | global | Proposed outcome: the East united under Noris or Stabilo, not Afrit | east lands |
| `zin_east_wells` | state flag + state dynamic modifier | state | A South Lands state has wells (otherwise zin_east_dry_land applies) | east lands |
| `zin_eastern_invasion` | global flag | global | The eastern coalition has invaded the Magical Lands; set by the eastern kings spec (4A 1755 historically) | world systems, east lands |
| `zin_economy_add_gold` | scripted effect | Aenor | Adds arg value to the treasury, clamps 0-2000, applies Crown Debts on underflow | world systems |
| `zin_eindil_add_renown / zin_eindil_add_regard / zin_eindil_add_delay / zin_eindil_set_host / zin_eindil_raise_host / zin_eindil_join_coalition / zin_eindil_aid_host / zin_eindil_advance_stage` | scripted effects | journey system | Journey measures, host moves, Host of Eindil creation, joining his coalition, sending aid to his Host | eindil and glo |
| `zin_eindil_cast_down` | global flag | global | Afrit cast Eindil from the cliff (hist 4A 1758) | eindil and glo |
| `zin_eindil_delay` | variable | global, 0-900 days | Accumulated delay added to every later journey floor date | eindil and glo |
| `zin_eindil_dragon_pact` | global flag | global | Magical Lands elves entrusted a dragon to Eindil (hist 4A 1756-57) | eindil and glo |
| `zin_eindil_heeded` | country flag | country | Country heeded Eindil's warnings in stage 8 | eindil and glo |
| `zin_eindil_host` | variable (country reference) | global | Current host country of Eindil; unset while he is at sea | eindil and glo |
| `zin_eindil_is_host / zin_eindil_has_host / zin_eindil_friend / zin_eindil_resents / zin_eindil_historical / zin_eindil_can_lead / zin_eindil_floor_reached` | scripted triggers | journey system | Host, regard, rule and stage-floor checks | eindil and glo |
| `zin_eindil_known_by_name` | scripted_trigger | any | True when the global flag zin_eindil_named is set. | lore digest |
| `zin_eindil_lost` | global flag | global | Gameplay divergence only: the heir is out of the story (never set on the historical path) | eindil and glo |
| `zin_eindil_reef_island` | country flag (permanent) | country (Islands of the South) | Set by the journey's event 42 'The Reef of Drowned Voices' on the island that receives it. Read by Nara's 'The Silent Reef'. | regions: east, south isles, sun |
| `zin_eindil_regard` | variable | every country, -100-100 | How Eindil (later his Host) remembers that country; >=25 friend, <=-25 resentment | eindil and glo |
| `zin_eindil_renown` | variable | global, 0-100 | How widely Eindil's deeds are told; drives heeding, Host size, Afrit reveal speed | eindil and glo |
| `zin_eindil_restored` | global flag | global | The New Gods restored Eindil through Glo (hist 4A 1757) | eindil and glo |
| `zin_eindil_safe_harbour` | country flag (proposed journey hook) | country | In stage 6 ports of call, the AI weight of 'Resupply the ship' is doubled under the dynamic rule only; no effect under the historical rule | regions: cold, west, tritons |
| `zin_eindil_sworn` | country flag | country | Country swore to raise Eindil's host; offered to become the Host of Eindil in stage 9 | eindil and glo |
| `zin_eindil_wears_necklace` | global flag | global | Eindil took and wears the Necklace of the Abyss (hist 4A 1759) | eindil and glo |
| `zin_eindil.150-.169` | event ids (journey namespace) | events/zin_eindil.txt | New journey events (Old Siula's Tale ... The Dragon Chooses); 170-199 reserved | events |
| `zin_elven_refusal` | global flag | global | The Elven Refusal stands; set at start, never cleared in the Fourth Age | world systems |
| `zin_elves` | event namespaces | events | Elves mechanic, Lands of the Sun mechanic, Magical Forest tree, Gala Elves tree | elves |
| `zin_elves_begin_feud` | scripted effect (arg attacker) | Herrodon or Andos Enda | Effect of the decision Settle the Feud of the Groves, callable from Herrodon's and Andos Enda's focuses behind the same gates | regions: dark, magical, dead |
| `zin_elves_dragon_need` | scripted trigger | country | A Magical Lands elven realm at war with a dark power or facing the eastern invasion; proposed to satisfy the Dragon Pact's war condition in the magic spec | elves |
| `zin_elves_focus_dragon_pact` | scripted effect | country | A Dragon Pact taken through a focus: zin_world_give_dragon(to = ROOT), zin_world_dragon_pacts +1, zin_war_dragon_pact, bond -10; counts against the Pact limit | elves |
| `zin_elves_join_kindred` | scripted effect | elven realm (country) | Accept option of zin_elves.31 as an effect: the scoped elven realm joins the Kindred of the Woods with zin_opinion_kindred | regions: dark, magical, dead |
| `zin_elves_kindred_formed` | global flag | global | The Kindred of the Woods (elves-only defensive faction of the Magical Lands) exists | elves |
| `zin_elves_lorien_falls (proposed name)` | scripted effect | Gala Elves | Elves-owned effect that kills Lorien and sets zin_lorien_dead; called by zin_mistake.23 | zol |
| `zin_elves_march` | global flag | global | An elven realm of the Magical Lands has marched beyond its own defence (Kindred Marches route) | elves |
| `zin_elves_on_dragon_corrupted` | scripted effect | any | Hook in the immediate block of the magic spec's zin_world.50 when a dragon is bound by corruption: roost sickness, bond -20, zin_elves.45 to the Keeper | elves |
| `zin_elves_on_eastern_invasion` | scripted effect | any | Elven response to zin_eastern_invasion; meant to be called from the eastern kings spec's zin_east.43, with a monthly-runner fallback guarded by zin_elves_invasion_answered | elves |
| `zin_elves_roost_bond` | global variable 0-100 (start 50) | global | Trust between the Keeper of Dragon Mountain and the dragons; below 30 lowers Bound by Corruption's footholds requirement to 2, below 40 closes the Pact to non-Keepers, 70+ makes the Keeper's Pact cheaper (proposed rules for the magic spec) | elves |
| `zin_elves_roosts_guarded` | country flags | the Keeper; read by the magic spec | Bound by Corruption is unavailable against this Keeper (guarded: 365 days; sealed: while held) | elves |
| `zin_elves_roosts_sealed` | country flags | the Keeper; read by the magic spec | Bound by Corruption is unavailable against this Keeper (guarded: 365 days; sealed: while held) | elves |
| `zin_elves_the_old_refusal / zin_west_old_claims / zin_mirolon_watchers_of_the_passes / zin_aenor_seventeen_centuries` | ideas | elves, West Lands, Mirolon, Aenor | Proposed start national spirits. Modifiers are listed in 01_start_situation.md; the owning mechanics specs may replace them. | lore digest |
| `zin_elves_wanderers_extra` | country flag | elven realm | Wanderer decisions allow 3 active missions instead of 2 and cost 10 political power less | regions: dark, magical, dead |
| `zin_ending` | event namespace | events/zin_ending.txt | Ending lead-up (1-9) and per-ending aftermath events (10-89); never sets or clears an ending flag | events |
| `zin_ending_eastern_king` | global flags | global | Proposed outcomes outside canon, judged on 1 Deepwinter 4A 1762; fallback in 4A 1770 | world systems |
| `zin_ending_golden_court` | global flags | global | Proposed outcomes outside canon, judged on 1 Deepwinter 4A 1762; fallback in 4A 1770 | world systems |
| `zin_ending_reached` | global flag and variable | global | An ending has been reached; which one (1-8) | world systems |
| `zin_ending_start_epilogue` | scripted effect (arg ending) | global | Fires the ending's zin_ending aftermath events and zin_world.110 after 14 days; called by zin_world_reach_ending | events |
| `zin_ending_strait_master` | global flags | global | Proposed outcomes outside canon, judged on 1 Deepwinter 4A 1762; fallback in 4A 1770 | world systems |
| `zin_ending_unfinished` | global flags | global | Proposed outcomes outside canon, judged on 1 Deepwinter 4A 1762; fallback in 4A 1770 | world systems |
| `zin_ending_western_crown` | global flags | global | Proposed outcomes outside canon, judged on 1 Deepwinter 4A 1762; fallback in 4A 1770 | world systems |
| `zin_eronel` | character | Aenor succession | Prince Eronel of Arcedor (proposed): the Golden Court's candidate in the succession, a cousin from a collateral line of Aen. He is a court figure and is not a leader at the start. | lore digest |
| `zin_faction_<key> and zin_faction_rule_join_<key>` | faction templates and joining rules | common/factions | Templates for the seven working factions and zin_faction_western_crossing, with region and refusal joining rules | world systems |
| `zin_faction_free_north / zin_faction_rule_join_free_north` | faction template and joining rule (diplomacy spec) | factions | The Free Crowns of the North, an optional defensive league Sensai may found. Joiners: North Lands capital, not Lerendor, not in Lerendor's faction, not Shadow, lean between -40 and 40 | regions: middle and north |
| `zin_faction_rule_join_elven_kin` | faction rules | diplomacy spec's common/factions/rules | Joining rules for the Kindred of the Woods (Magical Lands elves) and the Noon League (Lands of the Sun elves and Sunhot elves) | elves |
| `zin_faction_rule_join_sun_realms` | faction rules | diplomacy spec's common/factions/rules | Joining rules for the Kindred of the Woods (Magical Lands elves) and the Noon League (Lands of the Sun elves and Sunhot elves) | elves |
| `zin_faction_western_crossing / zin_faction_rule_join_crossing` | faction template / joining rule | diplomacy spec | The Western Crossing faction, led by the convener of the Ford Council | west and cold lands |
| `zin_footholds_map_mode` | scripted map mode | player | Footholds map mode in common/map_modes/zin_footholds.txt: the hub sees levels 0 to 5; others see only countries with a House (footholds 2 or more); public name 'Houses of the First Light' | interface art validation |
| `zin_gala` | event namespaces | events | Elves mechanic, Lands of the Sun mechanic, Magical Forest tree, Gala Elves tree | elves |
| `zin_gala_crew_chosen` | country flags | Gala Elves / Magical Forest; read by Eindil's journey | Journey modifiers: voyage north 120 days instead of 150; Lorien's Gift regard +5; crew drawn from many peoples; Varner and Golbran event zin_eindil.87 after 30 days instead of 90 | elves |
| `zin_gala_gift_armour` | country flags | Gala Elves / Magical Forest; read by Eindil's journey | Journey modifiers: voyage north 120 days instead of 150; Lorien's Gift regard +5; crew drawn from many peoples; Varner and Golbran event zin_eindil.87 after 30 days instead of 90 | elves |
| `zin_gala_great_ship` | country flags | Gala Elves / Magical Forest; read by Eindil's journey | Journey modifiers: voyage north 120 days instead of 150; Lorien's Gift regard +5; crew drawn from many peoples; Varner and Golbran event zin_eindil.87 after 30 days instead of 90 | elves |
| `zin_gala_word_kept` | country flag | Gala Elves; read by the Afrit spec | Adds 60 days to the Afrit spec's zin_afrit.31 report delay | elves |
| `zin_gathering_dark_rate` | global variable (0.5/1.0/1.5) | global | Multiplier on Gathering Dark gains, from zin_rule_gathering_dark | foundation |
| `zin_gd_last_change` | global variables | global | Meter sources for the tooltip, last change, world casualties in thousands | world systems |
| `zin_gd_src_<key>` | global variables | global | Meter sources for the tooltip, last change, world casualties in thousands | world systems |
| `zin_glo` | event namespace | Yeldenne and Glo system | Events of the Glo system (hall, race, seekers, seal) | eindil and glo |
| `zin_glo_blade_equipment` | equipment | country | Equipment that cannot be produced; only the warfare effects above grant or remove it | warfare |
| `zin_glo_cleansed` | state flag (60 days) | state | Glo's Wave struck here; the Zol system must not let its dead rise again in this state | eindil and glo |
| `zin_glo_conqueror` | country flag | country | Country annexed another by war after the start; fails the Glo worthiness test | eindil and glo |
| `zin_glo_dimmed` | global flag | global | A dark power defiled sealed Glo; nobody can use it (divergence) | eindil and glo |
| `zin_glo_power` | variable | global, 0-100 | Glernaen's power the bearer can spend (Glo's Wave costs 30) | eindil and glo |
| `zin_glo_sealed` | global flag | global | Horos was slain before a worthy bearer came; Glo bound to the empty hall (divergence) | eindil and glo |
| `zin_glo_state` | variable | global, 0-4 | Where Glo is: 0 Horos's breast, 1 Eindil, 2 sealed in the empty hall, 3 dimmed, 4 second bearer | eindil and glo |
| `zin_glo_wave / zin_glo_transfer / zin_glo_resolve_hall / zin_glo_add_power / zin_yeldenne_add_wards / zin_yeldenne_install_warden / zin_glo_request_northern_watch` | scripted effects | Yeldenne and Glo system | Glo's wave, Glo transfers, hall resolution, wards, Warden installation, Lost Cause guard request | eindil and glo |
| `zin_glo_with_afrit` | global flag | global | Off-path outcome: Afrit holds Glo (set only by the Yeldenne and Glo spec) | afrit |
| `zin_glo_worthy_claimant / zin_horos_alive / zin_glo_in_play / zin_glo_is_bearer_host / zin_glo_hall_owner / zin_is_site_yeldenne` | scripted triggers | Yeldenne and Glo system | Worthiness test, Horos alive, Glo carried, bearer host, Mp'E owner, Mp'E site | eindil and glo |
| `zin_golden_king_plot_exposed` | global flag | global | The plot against the Golden King has been exposed; the death clock stops and the Council's War follows | aenor |
| `zin_golden_king_survives` | global flag | global | The Golden King survived the Council's War; the succession war never happens | aenor |
| `zin_goldoroth_kneel` | scripted effect | Goldoroth | Goldoroth becomes Volgan's sworn realm (zin_autonomy_sworn_realm, Shadow, stance zin_shadow_horde); counts as a Volgan subject for zin_volgan_children_ready | dark lands |
| `zin_goldoroth_no_masters` | country flags | Goldoroth | Goldoroth chose independence (Black Iron Crown) or Volgan (Southern Bargain); read by Volgan's and Lerendor's event AI | dark lands |
| `zin_goldoroth_rask` | characters (proposed) | Goldoroth | Forge-Mistress Ulgra (Iron Clans), Snikkit Many-Knives (Goblin Warrens), Rask Black-Sail (corsair navy leader) | dark lands |
| `zin_goldoroth_refuses_masters` | scripted trigger (expected) | Goldoroth | Optional override the Goldoroth spec may define so Goldoroth refuses Volgan's envoys | volgan and mirolon, dark lands |
| `zin_goldoroth_seeks_the_south` | scripted triggers | Dark Lands countries | Multipliers for the AI chance of Volgan's envoy event zin_dominion.8 (Goldoroth refusing becomes x0, seeking the south x4, tributaries, Moot members, fear, gifts, war with Goldoroth) | dark lands |
| `zin_goldoroth_snikkit` | characters (proposed) | Goldoroth | Forge-Mistress Ulgra (Iron Clans), Snikkit Many-Knives (Goblin Warrens), Rask Black-Sail (corsair navy leader) | dark lands |
| `zin_goldoroth_southern_bargain` | country flags | Goldoroth | Goldoroth chose independence (Black Iron Crown) or Volgan (Southern Bargain); read by Volgan's and Lerendor's event AI | dark lands |
| `zin_goldoroth_sway` | country variable (0-100) | each Dark Lands country except Goldoroth | How far a Dark Lands country bends toward Cocanoor; gates the Iron Yoke | dark lands |
| `zin_goldoroth_temper / zin_goldoroth_favour_volcano\|iron\|war\|warrens` | country variables (0-100) | Goldoroth | Horde politics: restlessness of the war-clans and favour of the four clan blocs | dark lands |
| `zin_goldoroth_ulgra` | characters (proposed) | Goldoroth | Forge-Mistress Ulgra (Iron Clans), Snikkit Many-Knives (Goblin Warrens), Rask Black-Sail (corsair navy leader) | dark lands |
| `zin_goldoroth_unity` | country variable (0-100) | Goldoroth | Share of the 47 Dark Lands states owned by Goldoroth and its subjects | dark lands |
| `zin_great_spirit_equipment` | equipment | country | Equipment that cannot be produced; only the warfare effects above grant or remove it | warfare |
| `zin_has_potent_magic` | scripted trigger | country | Country can permanently end Zol's deathless dead (owned by magic and world systems) | zol, world systems |
| `zin_herez_shelters_mirolon / zin_herez_heard_mirolon` | country flags | Herez | Herez's answers to Mirolon; the Volgan exile rule may prefer a sheltering Herez | regions: middle and north |
| `zin_hierarch` | character | Aenor; Afrit mechanic | Hierarch Aubren of Parim (proposed): the Deliverer's highest priest in Aenor and Council seat of worship, shown as such only to the Worshipdom. Starts as Aenor's theorist. | lore digest |
| `zin_horos_endures` | global flag | global | Horos repelled an attack on the hall (divergence) | eindil and glo |
| `zin_horos_sword_broken` | global flag | global | Zol crushed Horos's blue sword (hist 4A 1757); caps Glo power at 50 | eindil and glo |
| `zin_ilsabet` | character | Aenor; Eindil's journey | Master Ilsabet Vothrim (proposed): the Lost Cause's scholar of the First Men and an Aenor theorist. Can later gather proof of Eindil's ancestry. | lore digest |
| `zin_ilvane` | character | Worshipdom | Ilvane, High Confessor, Seat of Censers; leads the Worshipdom while Afrit rules elsewhere (proposed) | afrit |
| `zin_is_dark_lands_state` | site scripted triggers (state scope) | state | Dark Lands sites generated in zin_sites.txt from the key sites table | dark lands |
| `zin_is_lerendor` | scripted trigger | country | Generated tag check for Lerendor | lerendor |
| `zin_is_mirolon` | scripted trigger | country | This country is Mirolon (generated tag check) | interface art validation |
| `zin_is_region_cold_lands` | generated site/region triggers | state / strategic region | New rows for the key sites table (01_map/02_key_sites.md) | west and cold lands |
| `zin_is_region_dark_lands` | scripted trigger (site table) | state | Leren-shore strait states; far-shore strait states; state is in the North Lands / Dark Lands region. zin_is_site_sonargur from the existing key sites row | lerendor |
| `zin_is_region_dead_lands` | scripted_trigger | state | The state lies in the Dead Lands region (used by grave-host strain) | warfare |
| `zin_is_region_east_lands` | scripted trigger (site) | state | Generated state lists for the East Lands, the South Lands desert band, the two seats, the five roads and both rift coasts (for the key sites table) | east lands |
| `zin_is_region_far_northwest` | generated site/region triggers | state / strategic region | New rows for the key sites table (01_map/02_key_sites.md) | west and cold lands |
| `zin_is_region_middle_lands` | generated site/region triggers | state / strategic region | New rows for the key sites table (01_map/02_key_sites.md) | west and cold lands |
| `zin_is_region_mpe_approach` | generated site/region triggers | state / strategic region | New rows for the key sites table (01_map/02_key_sites.md) | west and cold lands |
| `zin_is_region_north_lands` | scripted trigger (site table) | state | Leren-shore strait states; far-shore strait states; state is in the North Lands / Dark Lands region. zin_is_site_sonargur from the existing key sites row | lerendor |
| `zin_is_region_south_lands` | scripted trigger (site) | state | Generated state lists for the East Lands, the South Lands desert band, the two seats, the five roads and both rift coasts (for the key sites table) | east lands |
| `zin_is_region_west_lands` | generated site/region triggers | state / strategic region | New rows for the key sites table (01_map/02_key_sites.md) | west and cold lands |
| `zin_is_sea_central` | generated site/region triggers | state / strategic region | New rows for the key sites table (01_map/02_key_sites.md) | west and cold lands |
| `zin_is_site_boundary_groves` | state scripted triggers (key sites) | state; generated in zin_sites.txt | Gala's capital and the Mirror; Nolorim's high-pass states; the Herrodon state facing Andos Enda; elven states adjacent to a Great Wall state | elves |
| `zin_is_site_cocanoor` | site scripted triggers (state scope) | state | Dark Lands sites generated in zin_sites.txt from the key sites table | dark lands |
| `zin_is_site_dark_strait_far_shore (_north_far` | site scripted triggers (state scope) | state | Dark Lands sites generated in zin_sites.txt from the key sites table | dark lands |
| `zin_is_site_dark_strait_north` | site scripted triggers (state scope) | state | Dark Lands sites generated in zin_sites.txt from the key sites table | dark lands |
| `zin_is_site_dark_strait_shore (_north_shore` | site scripted triggers (state scope) | state | Dark Lands sites generated in zin_sites.txt from the key sites table | dark lands |
| `zin_is_site_dark_strait_south` | site scripted triggers (state scope) | state | Dark Lands sites generated in zin_sites.txt from the key sites table | dark lands |
| `zin_is_site_east_north_coast` | scripted trigger (site), generated in zin_sites.txt | state | An East Lands coastal state on the Ocean of Zol (today Woqood, Orato, Fladev, Hacsen, Vigodor, Cream and possibly Gondolin). New row for the key sites table. | regions: east, south isles, sun |
| `zin_is_site_elven_wall` | state scripted triggers (key sites) | state; generated in zin_sites.txt | Gala's capital and the Mirror; Nolorim's high-pass states; the Herrodon state facing Andos Enda; elven states adjacent to a Great Wall state | elves |
| `zin_is_site_furviatlon / zin_is_site_sodoloro / zin_is_site_ocean_of_zol_island` | scripted trigger | state | Key-site triggers for Zol's seat, Šodolôrō and the black island state list | zol |
| `zin_is_site_furvior` | scripted trigger (site) | state | Generated state lists for the East Lands, the South Lands desert band, the two seats, the five roads and both rift coasts (for the key sites table) | east lands |
| `zin_is_site_gala` | state scripted triggers (key sites) | state; generated in zin_sites.txt | Gala's capital and the Mirror; Nolorim's high-pass states; the Herrodon state facing Andos Enda; elven states adjacent to a Great Wall state | elves |
| `zin_is_site_goldoroth_march` | site scripted triggers (state scope) | state | Dark Lands sites generated in zin_sites.txt from the key sites table | dark lands |
| `zin_is_site_great_wall` | scripted_trigger | state | The state is a Great Wall of Aenor state (generated from the map's wall list) | warfare |
| `zin_is_site_grey_ford` | generated site/region triggers | state / strategic region | New rows for the key sites table (01_map/02_key_sites.md) | west and cold lands |
| `zin_is_site_isengard_march` | generated site/region triggers | state / strategic region | New rows for the key sites table (01_map/02_key_sites.md) | west and cold lands |
| `zin_is_site_nafeher / zin_is_site_abyss / zin_is_site_nether / zin_is_site_mirolon_passes / zin_is_site_mirolon_seat` | scripted triggers (sites) | state | Site triggers to be generated in zin_sites.txt with the key-sites table; mirolon_passes = Mirolon states bordering Volgan's realm | volgan and mirolon |
| `zin_is_site_neck_road` | generated site/region triggers | state / strategic region | New rows for the key sites table (01_map/02_key_sites.md) | west and cold lands |
| `zin_is_site_nolorim_passes` | state scripted triggers (key sites) | state; generated in zin_sites.txt | Gala's capital and the Mirror; Nolorim's high-pass states; the Herrodon state facing Andos Enda; elven states adjacent to a Great Wall state | elves |
| `zin_is_site_notbuton` | site scripted triggers (state scope) | state | Dark Lands sites generated in zin_sites.txt from the key sites table | dark lands |
| `zin_is_site_ocean_of_zol_coast` | scripted trigger (key site) | state | State has a coastal province on an Ocean of Zol sea region; generated in zin_sites.txt (same list as the Zol rumour roll and zin_lore.180) | regions: dark, magical, dead |
| `zin_is_site_postondoroth` | scripted trigger (site) | state | Generated state lists for the East Lands, the South Lands desert band, the two seats, the five roads and both rift coasts (for the key sites table) | east lands |
| `zin_is_site_rift_east` | scripted trigger (site) | state | Generated state lists for the East Lands, the South Lands desert band, the two seats, the five roads and both rift coasts (for the key sites table) | east lands |
| `zin_is_site_rift_west` | scripted trigger (site) | state | Generated state lists for the East Lands, the South Lands desert band, the two seats, the five roads and both rift coasts (for the key sites table) | east lands |
| `zin_is_site_road_salt/_gold/_rift/_lake/_sand` | scripted trigger (site) | state | Generated state lists for the East Lands, the South Lands desert band, the two seats, the five roads and both rift coasts (for the key sites table) | east lands |
| `zin_is_site_sea_of_darkness_coast` | site scripted triggers (state scope) | state | Dark Lands sites generated in zin_sites.txt from the key sites table | dark lands |
| `zin_is_site_strait_north` | scripted trigger (site table) | state | Leren-shore strait states; far-shore strait states; state is in the North Lands / Dark Lands region. zin_is_site_sonargur from the existing key sites row | lerendor |
| `zin_is_site_strait_south` | scripted trigger (site table) | state | Leren-shore strait states; far-shore strait states; state is in the North Lands / Dark Lands region. zin_is_site_sonargur from the existing key sites row | lerendor |
| `zin_is_site_troll_forest` | site scripted triggers (state scope) | state | Dark Lands sites generated in zin_sites.txt from the key sites table | dark lands |
| `zin_is_site_west_landing_isle` | generated site/region triggers | state / strategic region | New rows for the key sites table (01_map/02_key_sites.md) | west and cold lands |
| `zin_is_site_west_landing_shore` | generated site/region triggers | state / strategic region | New rows for the key sites table (01_map/02_key_sites.md) | west and cold lands |
| `zin_is_site_yeldenne_landing` | scripted trigger (site) | key sites table | New key-site row: the coastal state nearest Mp'E where Eindil lands and is ambushed | eindil and glo |
| `zin_is_volgan` | scripted trigger | country | This country is Volgan (generated tag check, same pattern as zin_is_zol and zin_is_lerendor) | interface art validation |
| `zin_is_zol` | scripted trigger | country | This country is Zol (tag resolved at build) | zol |
| `zin_is_zol_coast_country` | scripted trigger (generated) | country | Country owns a coastal state on an Ocean of Zol sea region (same list as the Zol rumour roll); used by flavour events | events |
| `zin_kessarion` | character | Worshipdom; Afrit and East mechanics | Kessarion the Envoy (proposed): Council seat of foreign agents and head of the eastern branch. Recruited by the Worshipdom only. | lore digest |
| `zin_kingson_gates_shut / zin_kingson_gates_open` | country flags | Kingson | Kingson's choice at the eastern invasion; the elves spec may read gates_open | regions: middle and north |
| `zin_lastwar` | event namespace | events/zin_lastwar.txt | Cross-front story events of the War of the Last Crowns (ids 10-113 used in ranges, rest reserved); never starts a war | events |
| `zin_leren` | event namespace | events/zin_leren.txt | Treaty of the Narrow Strait mechanic events (mechanic-owned; may use trigger and MTTH) | lerendor |
| `zin_leren_add_lean` | scripted effect | target country | Add $value$ to the scoped country's zin_leren_lean (negative for Parim's courting) | lerendor |
| `zin_leren_add_strait_standing` | scripted effect | any | Add $value$ to zin_strait_standing while the treaty is in force; clamp and refresh the band. The only way other specs change standing | lerendor |
| `zin_leren_admiral_ostvar` | characters (proposed) | Lerendor | Maelis of Lerenwaith (advisor), Brannoc the Toll-Master (advisor), Ostvar Greysail (navy leader), Torvald Hesk (field marshal) | lerendor |
| `zin_leren_chancellor_maelis` | characters (proposed) | Lerendor | Maelis of Lerenwaith (advisor), Brannoc the Toll-Master (advisor), Ostvar Greysail (navy leader), Torvald Hesk (field marshal) | lerendor |
| `zin_leren_companies_with_eindil` | country flag | Lerendor | Leren free or northern companies serve in Eindil's coalition; read by the Eindil spec | lerendor |
| `zin_leren_hegemony` | variable | Lerendor | Lerendor's lead over the North Lands 0-100, recomputed monthly | lerendor |
| `zin_leren_holds_strait` | scripted trigger | any | Lerendor or its subjects control Sonargur and every zin_is_site_strait_north state | lerendor |
| `zin_leren_honours_treaty / zin_leren_stands_apart / zin_leren_seeks_supremacy` | scripted trigger | any | Lerendor has taken the honour / break / supremacy route (country flags zin_leren_route_honour / _break / _supremacy) | lerendor |
| `zin_leren_in_lost_cause` | country flag | Lerendor | Lerendor answered the Lost Cause (honour route); read by the Aenor spec | lerendor |
| `zin_leren_lean` | variable | each North Lands country and each Dark Lands coastal country | Lean toward Sonargur (+) or Parim (-), -100 to 100; Aenor may court the same crowns through zin_leren_add_lean | lerendor |
| `zin_leren_marshal_hesk` | characters (proposed) | Lerendor | Maelis of Lerenwaith (advisor), Brannoc the Toll-Master (advisor), Ostvar Greysail (navy leader), Torvald Hesk (field marshal) | lerendor |
| `zin_leren_seeks_wards` | country flag | Lerendor | Lerendor seeks the old wards against Zol's dead; the world-systems spec decides what this grants | lerendor |
| `zin_leren_strait_barred` | scripted trigger | any | Lerendor holds the strait, is at war with Zol and has completed Hold the Capes or The Watch Holds; proposed hook for the Zol spec to slow the dead's crossing | lerendor |
| `zin_leren_strait_supremacy` | global flag | global | Lerendor proclaimed itself Sovereign of the Narrow Sea (proposed outcome 'Lerendor becomes master of the strait') | lerendor |
| `zin_leren_toll_level` | variable | Lerendor | Strait dues level 0-4 (start 1) | lerendor |
| `zin_leren_tollmaster_brannoc` | characters (proposed) | Lerendor | Maelis of Lerenwaith (advisor), Brannoc the Toll-Master (advisor), Ostvar Greysail (navy leader), Torvald Hesk (field marshal) | lerendor |
| `zin_leren_treaty_honoured` | global flag | global | Lerendor joined Aenor's defensive war under the Treaty of the Narrow Strait (an outcome, not history) | lerendor |
| `zin_leren_treaty_in_force` | scripted trigger | any | Lerendor and Aenor exist and zin_leren_withdrawal is not set | lerendor |
| `zin_leren_union_cohesion` | variable | Lerendor | Unity of the Lerendor and Lerenwaith crowns 0-100 (start 55) | lerendor |
| `zin_leren_withdraw` | scripted effect | any | Perform the withdrawal: sets zin_leren_withdrawal, ends military access, opinion modifiers, Gathering Dark +4, events zin_leren.30-.32 | lerendor |
| `zin_lerendor` | event namespace | events/zin_lerendor.txt | Lerendor focus tree events (effect-triggered only) | lerendor |
| `zin_loc_<concept>` | scripted_localisation naming pattern | localisation | One defined_text for each public/true label pair in 03_names_and_terms.md, for example council influence, footholds and the succession camps. | lore digest |
| `zin_loc_camp_faithful` | scripted localisation | localisation | Two-face succession camp names (the Deliverer's Faithful / Afrit's Supporters; the Stranger's Host / Eindil's Host) | events |
| `zin_loc_camp_host` | scripted localisation | localisation | Two-face succession camp names (the Deliverer's Faithful / Afrit's Supporters; the Stranger's Host / Eindil's Host) | events |
| `zin_loc_chronicle_cp01..cp26` | scripted localisation | localisation | Chronicle of the Age lines chosen by checkpoint state; the player's epilogue line by country status | events |
| `zin_loc_chronicle_heading` | scripted localisation | localisation | Chronicle of the Age lines chosen by checkpoint state; the player's epilogue line by country status | events |
| `zin_loc_chronicle_meter` | scripted localisation | localisation | Chronicle of the Age lines chosen by checkpoint state; the player's epilogue line by country status | events |
| `zin_loc_chronicle_unknown` | scripted localisation | localisation | Chronicle of the Age lines chosen by checkpoint state; the player's epilogue line by country status | events |
| `zin_loc_deliverer` | scripted_localisation | localisation | Afrit's display name. It shows 'Aurevan the Deliverer' while the secret is kept and 'Afrit' after the reveal. The Worshipdom always sees 'Afrit'. | lore digest |
| `zin_loc_eindil` | scripted_localisation | localisation | Eindil's display name. It shows 'the Man from the Ice' before zin_eindil_named and 'Eindil' after. | lore digest |
| `zin_loc_your_part` | scripted localisation | localisation | Chronicle of the Age lines chosen by checkpoint state; the player's epilogue line by country status | events |
| `zin_lore` | event namespace | events/zin_lore.txt | Lore events. Ids 1-15 are the opening events per power, 20 is the debug start check, 100 is the hidden flavour scheduler, 101-211 are regional flavour, and 220-221 are Worshipdom-only chronicle events. | lore digest |
| `zin_lore_schedule_flavour` | scripted_effect | country | Schedules each country's flavour events inside their date windows using country_event with days and random_days. | lore digest |
| `zin_lore_seen_<n>` | country flag pattern | country | Marks that a country has seen flavour event zin_lore.<n>, so each event fires once. | lore digest |
| `zin_lore.300-.414` | event ids | events/zin_lore.txt | Peaceful-start flavour (300-380) and world flavour (400-414); 415-499 reserved | events |
| `zin_lorien_rides` | global flag | global; read by the Zol spec and news | Lorien's last march has begun (set by zin_sun_lorien_rides when the Gala Elves ride against the manifested Zol) | elves |
| `zin_lost_cause_add_strength` | scripted effect | any | Arg value: runs Aenor's zin_aenor_add_lost_cause in the original Aenor realm (entry point for non-Aenor specs) | world systems |
| `zin_lost_cause_exists` | scripted trigger (proposed, owned by Aenor / Lost Cause) | global | The Lost Cause faction exists and has a leader | eindil and glo |
| `zin_lost_cause_member` | country flag | country | Honorary or full member of the Lost Cause | aenor |
| `zin_lost_cause_shield` | global flag | global | The Lost Cause has become the Concord's shield (faction renamed The Lost Cause, foreign crowns may join) | aenor |
| `zin_lost_cause_with_eindil` | global flag | global | The Lost Cause's frontier and scholarly branches follow Eindil; feeds the Lost Cause ending | aenor, eindil and glo |
| `zin_magical_forest` | event namespaces | events | Elves mechanic, Lands of the Sun mechanic, Magical Forest tree, Gala Elves tree | elves |
| `zin_magical_forest_wizard_found` | country flags | Gala Elves / Magical Forest; read by Eindil's journey | Journey modifiers: voyage north 120 days instead of 150; Lorien's Gift regard +5; crew drawn from many peoples; Varner and Golbran event zin_eindil.87 after 30 days instead of 90 | elves |
| `zin_mirolon_add_proof / zin_mirolon_add_passes / zin_mirolon_raise_pass_forts / zin_mirolon_scout / zin_mirolon_scorch / zin_mirolon_raise_resistance / zin_mirolon_restore` | scripted effects | Mirolon | Mirolon mechanic effects used by the Mirolon tree | volgan and mirolon |
| `zin_mirolon_fallen` | global flag | global | Volgan has retaken Mirolon (historical Emberleaf 4A 1755) | volgan and mirolon |
| `zin_mirolon_maeric / zin_mirolon_selda / zin_mirolon_hadric` | characters | Mirolon | Proposed: High Warden Maeric (country leader, zin_light_wardens), Captain Selda Varrow (general), Scout-Master Hadric Thorne (advisor) | volgan and mirolon |
| `zin_mirolon_parim_laughed / zin_mirolon_lost_cause_friend / zin_mirolon_league_friend / zin_herez_marches_pact / zin_gala_rangers_mirolon` | country flags | Mirolon, invitees, Herez, Mirolon | Cross-spec diplomacy outcomes set by zin_dominion.5 and zin_mirolon.3-7; read by the Aenor, Herez, Gala and free Dead Lands specs | volgan and mirolon |
| `zin_mirolon_passes` | variable | Mirolon | 0-100; readiness of the pass forts; start 30; fort level floor(passes/20)+1, max 6, in pass states | volgan and mirolon |
| `zin_mirolon_proof` | variable | Mirolon | 0-100; evidence of Volgan's arming; start 15; thresholds 25/50/75 | volgan and mirolon |
| `zin_mirror_clarity` | global variable 0-100 (start 60) | global | How clearly the Mirror of First Rain answers; the journey's naming event zin_eindil.52 spends 30 | elves |
| `zin_mirror_stilled` | global flag | global | The Mirror gives no visions because a non-elven, non-Sunhot country controls Gala's site | elves |
| `zin_mistake` | event namespace | events | Zol's Mistake mechanic events (the tree uses zin_zol) | zol |
| `zin_name_<key>` | localisation key pattern | localisation | One key per proposed name, so the owner can rename it in one place. For example, zin_name_aurevan holds the Deliverer's public name. | lore digest |
| `zin_name_halenor_ruler` | localisation keys (zin_name_<key> pattern) | localisation | Proposed names the owner can change in one place | regions: cold, west, tritons |
| `zin_name_horidor_cairn_king` | localisation keys (zin_name_<key> pattern) | localisation | Proposed names the owner can change in one place | regions: cold, west, tritons |
| `zin_name_seite_ruler` | localisation keys (zin_name_<key> pattern) | localisation | Proposed names the owner can change in one place | regions: cold, west, tritons |
| `zin_nether_pact` | variable | Volgan | 0-100; how far the Nether's court sends Netherborn to Volgan; start 20; 40 Netherborn, 70 gate pact; cap 75 if bent | volgan and mirolon |
| `zin_north_ask_compact_seat` | scripted effect | country | A North Lands crown asks Lerendor for a Leren Compact seat (zin_shared_north_lands.1) | regions: middle and north |
| `zin_north_ask_parim_shield` | scripted effect | country | A North Lands crown asks the Aenor realm holding Parim for a guarantee (zin_shared_north_lands.2) | regions: middle and north |
| `zin_opinion_<key>` | opinion modifier pattern | common/opinion_modifiers/zin_start.txt | Start relation modifiers: toll_of_1716, northern_pride, old_claims, grey_ford_truce, caravan_rivalry, cold_rivalry, border_raids, old_rivalry, watchers_of_the_passes, edrans_folly, concord_charters, pilgrim_road. | lore digest |
| `zin_opinion_old_estrangement` | static opinion modifier | diplomacy | -10 opinion of elven countries toward Aenor (established estrangement) | foundation |
| `zin_ossar` | character | Worshipdom; Afrit, Yeldenne and Glo | Magister Velan Ossar (proposed): Council seat of artifact recovery. Recruited by the Worshipdom only. | lore digest |
| `zin_path_cp01 ... zin_path_cp26` | global variables and flag | global | Checkpoint states (0 pending, 1 historical, 2 diverged, 3 skipped), divergence 0-100, watchdog failure marker | world systems |
| `zin_path_divergence` | global variables and flag | global | Checkpoint states (0 pending, 1 historical, 2 diverged, 3 skipped), divergence 0-100, watchdog failure marker | world systems |
| `zin_path_stalled` | global variables and flag | global | Checkpoint states (0 pending, 1 historical, 2 diverged, 3 skipped), divergence 0-100, watchdog failure marker | world systems |
| `zin_people_includes_<key>` | scripted triggers | country | Primary people; primary or minor people | foundation |
| `zin_people_is_<key>` | scripted triggers | country | Primary people; primary or minor people | foundation |
| `zin_people_is_common_folk` | scripted triggers | country | Great Folk = elves, Sunhot elves, demons (angels if added); Common Folk = men (dwarves if added); nothing else classified | foundation |
| `zin_people_is_great_folk` | scripted triggers | country | Great Folk = elves, Sunhot elves, demons (angels if added); Common Folk = men (dwarves if added); nothing else classified | foundation |
| `zin_people_minor_<key>` | country flag | country | Minor people of a country (up to two); unlocks units and branches, no modifiers | foundation |
| `zin_politics` | event namespace | events | Elections, the post-reveal council split, hidden stance change | foundation |
| `zin_politics_add_drift` | scripted effect (params IDEOLOGY, VALUE) | country | Queue monthly popularity drift in percentage points; the only way mechanics move ideology popularity | foundation |
| `zin_politics_apply_drift` | scripted effect | country | Monthly: apply queued drift times (1 - zin_drift_resistance) with add_popularity, then clear the queue | foundation |
| `zin_politics_has_elections` | scripted triggers | country | Politics queries used by other systems | foundation |
| `zin_politics_is_dark_realm` | scripted triggers | country | Politics queries used by other systems | foundation |
| `zin_politics_is_light_realm` | scripted triggers | country | Politics queries used by other systems | foundation |
| `zin_politics_set_stance` | scripted effect | country | Change ruler stance, swap the stance spirit and drift resistance | foundation |
| `zin_potent_magic` | country flag | any country | Fallback for zin_has_potent_magic until the magic spec defines it; set on Eindil's country while he carries Glo, while Varner fights with it, and on Gala Elves while Lorien rides | zol |
| `zin_refusal_lifted` | country flag | elven realm | This realm has set the Refusal aside for now; set by zin_diplo_lift_refusal | world systems |
| `zin_region_<key>` | country flag | every country | Roster region of origin, set on startup (middle_lands, north_lands, cold_lands, west_lands, tritons_islands, dark_lands, magical_lands, zols_mistake, dead_lands, east_lands, islands_of_the_south, lands_of_the_sun); already read by the Western Crossing spec | world systems |
| `zin_regional_<name> / zin_shared_dark_lands / zin_shared_magical_lands / zin_shared_dead_lands` | event namespaces | events | Effect-triggered events of the 16 tier B trees and 3 shared trees in this region set | regions: dark, magical, dead |
| `zin_regional_<tree> (16 trees) / zin_shared_concord_dominions / zin_shared_north_lands` | event namespaces | events | One namespace per regional tree (selen, noleksun, herez, konori, kilinti, kingson, hunhun, hiloron, bloody_forest, cursed_lands, asgard, sensai, mina, r_en, molot, eekedor) plus the two shared trees | regions: middle and north |
| `zin_regional_<tree>_<who>` | character id pattern (instances) | characters | Advisors and generals of each tier B court table, e.g. zin_regional_selen_morrade, zin_regional_kingson_stone; rulers keep <TAG>_zin_ruler | regions: middle and north |
| `zin_regional_blackton_free_harbour` | country flags | Blackton | Goldoroth AI Corsair Raid on Blackton x0.25; Lerendor may offer protection (zin_leren_offer_protection) at lean 60; Blackton AI declines every faction invitation | regions: dark, magical, dead |
| `zin_regional_blackton_paid_corsairs (730 days)` | country flags | Blackton | Goldoroth AI Corsair Raid on Blackton x0.25; Lerendor may offer protection (zin_leren_offer_protection) at lean 60; Blackton AI declines every faction invitation | regions: dark, magical, dead |
| `zin_regional_blackton_seeks_protection` | country flags | Blackton | Goldoroth AI Corsair Raid on Blackton x0.25; Lerendor may offer protection (zin_leren_offer_protection) at lean 60; Blackton AI declines every faction invitation | regions: dark, magical, dead |
| `zin_regional_buldor_contracts category (zin_regional_buldor_sell_contract` | decisions and variables | Buldor | Buldor sells timed company contracts (idea zin_regional_buldor_company_contract on the employer) | regions: cold, west, tritons |
| `zin_regional_buldor_recall_company); variables zin_regional_buldor_contracts / zin_regional_buldor_contract_cap` | decisions and variables | Buldor | Buldor sells timed company contracts (idea zin_regional_buldor_company_contract on the employer) | regions: cold, west, tritons |
| `zin_regional_dondor_beacon_chain` | country flags | Dondor | Light the Sea Beacons cooldown 120 days; Muster the Brutes cooldown 240 days; Dondor AI accepts Goldoroth's truce against the dead (zin_goldoroth.18) at 100 | regions: dark, magical, dead |
| `zin_regional_dondor_muster_drill` | country flags | Dondor | Light the Sea Beacons cooldown 120 days; Muster the Brutes cooldown 240 days; Dondor AI accepts Goldoroth's truce against the dead (zin_goldoroth.18) at 100 | regions: dark, magical, dead |
| `zin_regional_dondor_stands_with_living` | country flags | Dondor | Light the Sea Beacons cooldown 120 days; Muster the Brutes cooldown 240 days; Dondor AI accepts Goldoroth's truce against the dead (zin_goldoroth.18) at 100 | regions: dark, magical, dead |
| `zin_regional_nan_pilots_of_nafeher` | idea (defined in Nan's tree file, given to Volgan) | Volgan | Pilots of Nan: naval_speed_factor 0.05, naval_invasion_prep_speed 0.20; removed if Volgan goes to war with Nan | regions: dark, magical, dead |
| `zin_regional_titanos_open_to_pacts / zin_regional_titanos_apart` | country flags | Titanos / Yeti Lands | Proposed AI hooks: zin_cold.52 / zin_cold.51 acceptance x2 or x0, and zin_cold_renew_old_pact unavailable when apart | regions: cold, west, tritons |
| `zin_regional_windwaith_free_harbours` | country flag | Windwaith | Windwaith chose Free Harbours; the cold mechanic's zin_cold.71 AI should refuse the compact | regions: cold, west, tritons |
| `zin_regional_yeti_lands_open_to_truce / zin_regional_yeti_lands_apart` | country flags | Titanos / Yeti Lands | Proposed AI hooks: zin_cold.52 / zin_cold.51 acceptance x2 or x0, and zin_cold_renew_old_pact unavailable when apart | regions: cold, west, tritons |
| `zin_reign` | event namespace | events/zin_reign.txt | Story events of the Golden King's reign, death, the Thirty Days, Aurevan's coronation and reign (ids 1-99 used, 100-199 reserved); fired only by effects or the story runner | events |
| `zin_reign_asked_ledgers` | country flags | Aenor | Asked for the temple ledgers (+10% to Follow the Poisoner's Coin); Lost Cause left to the frontier (Shield focus AI x2); Prince Eronel crowned | events |
| `zin_reign_eronel_crowned` | country flags | Aenor | Asked for the temple ledgers (+10% to Follow the Poisoner's Coin); Lost Cause left to the frontier (Shield focus AI x2); Prince Eronel crowned | events |
| `zin_reign_league_to_frontier` | country flags | Aenor | Asked for the temple ledgers (+10% to Follow the Poisoner's Coin); Lost Cause left to the frontier (Shield focus AI x2); Prince Eronel crowned | events |
| `zin_reign_mourned_king` | opinion modifier | diplomacy | +10 Aenor toward a court that sent a great embassy to the Golden King's funeral | events |
| `zin_reign_on_crowning` | scripted effect (hook) | Aenor | Fires zin_reign.40-.46; called at the end of zin_afrit_crown_aurevan | events |
| `zin_reign_on_king_dead` | scripted effect (hook) | Aenor | Fires zin_reign.20-.26; to be called at the end of the Aenor spec's zin_aenor_open_succession | events |
| `zin_reign_on_thirty_days` | scripted effect (hook) | Aenor | Fires zin_reign.30-.36; called from zin_aenor.201's immediate block | events |
| `zin_reign_scholars_free` | country flag | Aenor | Aenor left the scholars free to debate Aurevan's genealogy; lets Master Ilsabet's rolls reach the heir (zin_eindil.165) | events |
| `zin_rule_afrit` | game rule | global | Afrit's Path: DEFAULT (follows zin_rule_historical_path), HISTORICAL, FREE, ASHEN, DORMANT | afrit |
| `zin_rule_ai_aenor_succession` | game rules | game | Twelve ZIN rules; per-power rules default to DEFAULT = follow zin_rule_historical_path | foundation |
| `zin_rule_ai_east` | game rules | game | Twelve ZIN rules; per-power rules default to DEFAULT = follow zin_rule_historical_path | foundation |
| `zin_rule_ai_elves` | game rules | game | Twelve ZIN rules; per-power rules default to DEFAULT = follow zin_rule_historical_path | foundation |
| `zin_rule_ai_goldoroth` | game rule (DEFAULT, INDEPENDENT, SWORN_TO_VOLGAN, RANDOM) | global | AI Goldoroth's choice between the Black Iron Crown and the Southern Bargain; triggers zin_rules_ai_branch_goldoroth_independent / _sworn_to_volgan | dark lands |
| `zin_rule_ai_lerendor` | game rules | game | Twelve ZIN rules; per-power rules default to DEFAULT = follow zin_rule_historical_path | foundation |
| `zin_rule_ai_west` | game rules | game | Twelve ZIN rules; per-power rules default to DEFAULT = follow zin_rule_historical_path | foundation |
| `zin_rule_cold_isengard` | game rule | global | historical / open_hand / conquest / free | west and cold lands |
| `zin_rule_dark_powers` | game rules | game | Twelve ZIN rules; per-power rules default to DEFAULT = follow zin_rule_historical_path | foundation |
| `zin_rule_deathless` | game_rule | global | canon (default: ordinary arms cannot end the deathless) / softened | warfare |
| `zin_rule_debug_checks` | game rule | game rules | Debug builds only. When on, zin_lore.20 logs to the error log if any contract story flag is set or any war exists on the first day. | lore digest |
| `zin_rule_eindil_journey` | game rule | global | DYNAMIC (default) or HISTORICAL AI choices in the journey; forced HISTORICAL by zin_rule_historical_path | eindil and glo |
| `zin_rule_eindil_waking` | game rules | game | Twelve ZIN rules; per-power rules default to DEFAULT = follow zin_rule_historical_path | foundation |
| `zin_rule_elections` | game rules | game | Twelve ZIN rules; per-power rules default to DEFAULT = follow zin_rule_historical_path | foundation |
| `zin_rule_gathering_dark` | game rules | game | Twelve ZIN rules; per-power rules default to DEFAULT = follow zin_rule_historical_path | foundation |
| `zin_rule_golden_king` | game rules | game | Twelve ZIN rules; per-power rules default to DEFAULT = follow zin_rule_historical_path | foundation |
| `zin_rule_golden_king_death` | game rule | global | historical / dynamic (default) / late timing of the Golden King's death | aenor |
| `zin_rule_historical_path (HISTORICAL/PLAUSIBLE/FREE)` | game rules | game | Twelve ZIN rules; per-power rules default to DEFAULT = follow zin_rule_historical_path | foundation |
| `zin_rule_leren_route` | game rule | game rules | Lerendor AI route: historical (default, break), honour, supremacy, free; overridden by zin_rule_historical_path | lerendor |
| `zin_rule_skies` | game_rule | global | beasts (default: griffins and dragons) / dragons_only / none | warfare |
| `zin_rule_story_pace` | game rules | game | Twelve ZIN rules; per-power rules default to DEFAULT = follow zin_rule_historical_path | foundation |
| `zin_rule_volgan_early_war` | game rule | global | AI_HISTORICAL (default): AI never breaks the veil; AI_FREE: AI may break the veil at strength 80 or more | volgan and mirolon |
| `zin_rule_volgan_spirit` | game rule | global | UNRESOLVED (default): nothing returns and no text states Volgan's fate; STIRRING: non-canon sandbox that can restore Volgan without a body from 4A 1765 | volgan and mirolon |
| `zin_rule_west_route` | game rule | global | historical / crossing_hold / relief / divided / free | west and cold lands |
| `zin_rule_zol_behaviour` | game rule | global | AI Zol: HISTORICAL / DORMANT / EARLY / FREE | zol |
| `zin_rules_ai_branch_<power>_<option>` | scripted triggers | any | Wrappers over has_game_rule so a rule rename touches one file | foundation |
| `zin_rules_ai_branch_elves_march` | scripted trigger (naming per the defines spec's zin_rules_ai_branch_<power>_<option> pattern) | country | True when zin_rule_ai_elves = MARCH, or RANDOM and the realm has zin_elves_ai_marcher | elves |
| `zin_rules_is_free` | scripted triggers | any | Wrappers over has_game_rule so a rule rename touches one file | foundation |
| `zin_rules_is_historical` | scripted triggers | any | Wrappers over has_game_rule so a rule rename touches one file | foundation |
| `zin_selen_hidden_paths / zin_selen_knows_the_passages / zin_selen_proof_of_blood` | country flags | Selen | Proposed journey hooks: -10% to the discovery roll while Selen hosts him; the Host's Find the Old Service Passages takes 15 days; Selen has gathered proof of the Heir's blood | regions: middle and north |
| `zin_selen_voice_of_dominions` | country flag | Selen | Proposed hook: +5 Dominions camp support when the Aenor mechanic computes support at the King's death | regions: middle and north |
| `zin_sensai_free_crowns / zin_sensai_no_crown / zin_r_en_neutral / zin_eekedor_court_open / zin_north_heard_whispers` | country flags | Sensai, R'en, Eekedor, North crowns | North Lands tree states readable by the Lerendor mechanic and AI | regions: middle and north |
| `zin_shachihata_equipment` | equipment | country | Equipment that cannot be produced; only the warfare effects above grant or remove it | warfare |
| `zin_shared_cold_lands_friends_of_the_hall` | country flag (proposed journey hook) | country | When this country owns zin_is_site_yeldenne_landing, 'Send guides inland' gets AI weight x2 under the dynamic rule only; adds no guide flag | regions: cold, west, tritons |
| `zin_shared_cold_lands_lean_neighbours` | scripted effect (arg value) | country | Adds zin_cold_lean to every neighbouring Cold Lands clan realm; called by the regional Cold Lands trees too | regions: cold, west, tritons |
| `zin_shared_east_lands / zin_shared_islands_of_the_south / zin_shared_lands_of_the_sun / zin_regional_<name>` | event namespaces | events | Events of the three shared trees and of the 20 tier B trees (for example zin_regional_alerhia, zin_regional_enhis_is_rond, zin_regional_the_lands_of_light). zin_shared_east_lands.1 and .2 go to Noris and Stabilo; zin_regional_mora.1 goes to Noris; zin_regional_elvana.3 goes to the Gala Elves; zin_regional_goodin.1 goes to The Lands of Light. | regions: east, south isles, sun |
| `zin_shared_east_lands_at_war_magical` | scripted effects and triggers declared by the shared_east_lands tree | country | Road infrastructure, halving lean through zin_east_add_lean, goodwill with the rift-facing Magical Lands realms, white peace with Magical and Middle Lands enemies, and three country checks. Called by the tier B eastern trees too. | regions: east, south isles, sun |
| `zin_shared_east_lands_halve_lean` | scripted effects and triggers declared by the shared_east_lands tree | country | Road infrastructure, halving lean through zin_east_add_lean, goodwill with the rift-facing Magical Lands realms, white peace with Magical and Middle Lands enemies, and three country checks. Called by the tier B eastern trees too. | regions: east, south isles, sun |
| `zin_shared_east_lands_north_coast` | scripted effects and triggers declared by the shared_east_lands tree | country | Road infrastructure, halving lean through zin_east_add_lean, goodwill with the rift-facing Magical Lands realms, white peace with Magical and Middle Lands enemies, and three country checks. Called by the tier B eastern trees too. | regions: east, south isles, sun |
| `zin_shared_east_lands_on_road` | scripted effects and triggers declared by the shared_east_lands tree | country | Road infrastructure, halving lean through zin_east_add_lean, goodwill with the rift-facing Magical Lands realms, white peace with Magical and Middle Lands enemies, and three country checks. Called by the tier B eastern trees too. | regions: east, south isles, sun |
| `zin_shared_east_lands_rift_goodwill` | scripted effects and triggers declared by the shared_east_lands tree | country | Road infrastructure, halving lean through zin_east_add_lean, goodwill with the rift-facing Magical Lands realms, white peace with Magical and Middle Lands enemies, and three country checks. Called by the tier B eastern trees too. | regions: east, south isles, sun |
| `zin_shared_east_lands_road_infra` | scripted effects and triggers declared by the shared_east_lands tree | country | Road infrastructure, halving lean through zin_east_add_lean, goodwill with the rift-facing Magical Lands realms, white peace with Magical and Middle Lands enemies, and three country checks. Called by the tier B eastern trees too. | regions: east, south isles, sun |
| `zin_shared_east_lands_withdraw` | scripted effects and triggers declared by the shared_east_lands tree | country | Road infrastructure, halving lean through zin_east_add_lean, goodwill with the rift-facing Magical Lands realms, white peace with Magical and Middle Lands enemies, and three country checks. Called by the tier B eastern trees too. | regions: east, south isles, sun |
| `zin_shared_has_coast / zin_shared_is_island_realm / zin_shared_borders_<region>` | scripted triggers (generic, one file zin_shared_trees.txt) | country | Owns a coastal state; capital is an island state; neighbours a country with flag zin_region_<region> (dead_lands, magical_lands, dark_lands, ...) | regions: middle and north |
| `zin_shared_lands_of_the_sun_islands_goodwill` | scripted effects declared by the shared_lands_of_the_sun tree | country | Join the Noon League through its leader when it exists and zin_faction_rule_join_sun_realms allows; zin_elves_goodwill with every coastal Islands of the South country. Called by the tier B Sun trees too. | regions: east, south isles, sun |
| `zin_shared_lands_of_the_sun_join_league` | scripted effects declared by the shared_lands_of_the_sun tree | country | Join the Noon League through its leader when it exists and zin_faction_rule_join_sun_realms allows; zin_elves_goodwill with every coastal Islands of the South country. Called by the tier B Sun trees too. | regions: east, south isles, sun |
| `zin_shared_north_in_compact` | scripted trigger | country | ROOT is in Lerendor's faction and not its subject | regions: middle and north |
| `zin_stabilo_debt` | variable | each East Lands court | What a court owes Stabilo's Ledger, 0-100; read by the mechanic's kneel bias and temple-loan event | east lands |
| `zin_stance_<stance>` | national spirit family (17 ideas) | country | Permanent spirit matching the ruler's stance; a major mechanic spec may replace it | foundation |
| `zin_story_done_<namespace>_<id>` | global flag pattern | global | A once-only story event of that namespace has fired | events |
| `zin_story_pace` | global variable (0.75/1.0/1.5) | global | Multiplier on story date windows and mean times, from zin_rule_story_pace | foundation |
| `zin_story_seen_<namespace>_<id>` | country flag pattern | country | A per-country story event has fired for this country | events |
| `zin_story_tick` | scripted effect | global (common/scripted_effects/zin_story.txt) | Story runner called as step 9 of the monthly world tick; fires dated/conditional story events of 06_events once; calls zin_story_tick_reign, zin_story_tick_lastwar, zin_story_tick_ending, zin_story_tick_lore | events |
| `zin_story_tick_lore` | scripted effect | global | Monthly check that fires the 400-series world flavour after its story flag and delay | events |
| `zin_sun` | event namespaces | events | Elves mechanic, Lands of the Sun mechanic, Magical Forest tree, Gala Elves tree | elves |
| `zin_sun_heeded_<sight>` | country flags (730 days) | country | The country heeded Gala's warning about the north, south, seas or east; readable by other systems (e.g. Zol AI 'forewarned') | elves |
| `zin_sun_lorien_falls` | scripted effect | any | Hook for the Zol spec's zin_mistake.23 before zin_zol_withdraw: sets zin_lorien_dead (guarded), kills or retires zin_lorien, old lords to 0, The King Has Fallen, mourning, news zin_sun.43, After the King zin_sun.42 | elves |
| `zin_sun_lorien_rides` | scripted effect | Gala Elves | Hook for option A of the Zol spec's zin_mistake.22: Gala joins the war on Zol, The King's Ride, The Old Powers Stand by old lords, news zin_sun.40 | elves |
| `zin_tarec` | character | Aenor; Lost Cause; Eindil's journey | Lord-Commander Tarec Belurith (proposed): commander of the Lost Cause's frontier companies and an Aenor corps commander. | lore digest |
| `zin_tradition_<key>` | country flag | country | Regional tradition of men (middle_kingdom, dondor_brutes, camel_riders, gunwaith_clans, girdon_wardens, buldor_companies, isle_houses, sunfolk, rangers, riders) | foundation |
| `zin_trait_ancient_king` | country leader traits | character | Traits of the Golden King, Aurevan, Volgan, Lorien, Horos and generated leaders | foundation |
| `zin_trait_beloved_god` | country leader traits | character | Traits of the Golden King, Aurevan, Volgan, Lorien, Horos and generated leaders | foundation |
| `zin_trait_dread_lord` | country leader traits | character | Traits of the Golden King, Aurevan, Volgan, Lorien, Horos and generated leaders | foundation |
| `zin_trait_eldest_of_the_moot` | country leader traits | character | Konori/Hunhun (cavalry_attack_factor 0.10, stability_factor 0.03); Kilinti (army_core_defence 0.10, drift_defence 0.10, political_power_factor -0.05); Kingson (trade_opinion 0.10, army_core_defence 0.05); Cursed Lands (drift_defence 0.25, army_core_defence 0.10, opinion_gain_monthly -0.10) | regions: middle and north |
| `zin_trait_elected_speaker` | country leader traits | character | Traits of the Golden King, Aurevan, Volgan, Lorien, Horos and generated leaders | foundation |
| `zin_trait_gilded_fool` | country leader traits | character | Traits of the Golden King, Aurevan, Volgan, Lorien, Horos and generated leaders | foundation |
| `zin_trait_glo_bearer` | unit_leader_trait | character zin_eindil | Eindil's trait while he carries Glo | warfare |
| `zin_trait_guardian_spirit` | country leader traits | character | Traits of the Golden King, Aurevan, Volgan, Lorien, Horos and generated leaders | foundation |
| `zin_trait_horse_lord` | country leader traits | character | Konori/Hunhun (cavalry_attack_factor 0.10, stability_factor 0.03); Kilinti (army_core_defence 0.10, drift_defence 0.10, political_power_factor -0.05); Kingson (trade_opinion 0.10, army_core_defence 0.05); Cursed Lands (drift_defence 0.25, army_core_defence 0.10, opinion_gain_monthly -0.10) | regions: middle and north |
| `zin_trait_keeper_of_the_gate` | country leader traits | character | Konori/Hunhun (cavalry_attack_factor 0.10, stability_factor 0.03); Kilinti (army_core_defence 0.10, drift_defence 0.10, political_power_factor -0.05); Kingson (trade_opinion 0.10, army_core_defence 0.05); Cursed Lands (drift_defence 0.25, army_core_defence 0.10, opinion_gain_monthly -0.10) | regions: middle and north |
| `zin_trait_veiled_elder` | country leader traits | character | Konori/Hunhun (cavalry_attack_factor 0.10, stability_factor 0.03); Kilinti (army_core_defence 0.10, drift_defence 0.10, political_power_factor -0.05); Kingson (trade_opinion 0.10, army_core_defence 0.05); Cursed Lands (drift_defence 0.25, army_core_defence 0.10, opinion_gain_monthly -0.10) | regions: middle and north |
| `zin_trait_warband_chief` | country leader traits | character | Traits of the Golden King, Aurevan, Volgan, Lorien, Horos and generated leaders | foundation |
| `zin_tritons_add_piracy / zin_tritons_refresh_seas` | scripted effects | any | The only write path for piracy (initialises it to 35 on first use, clamps it, refreshes the band ideas on every Triton's country) | regions: cold, west, tritons |
| `zin_tritons_banks_accord` | flags | global / country | Southern Banks outcomes | regions: cold, west, tritons |
| `zin_tritons_banks_quarrel` | opinion modifiers | diplomacy | -20 Nondondor <-> Seite Islands (decays 0.5/month); -10 mediator to refuser | regions: cold, west, tritons |
| `zin_tritons_banks_yielded (global)` | flags | global / country | Southern Banks outcomes | regions: cold, west, tritons |
| `zin_tritons_chart_house` | country flags | country | The island's side in the Pupor Ocean system | regions: cold, west, tritons |
| `zin_tritons_charter_exists` | scripted triggers | any / country | Journey stage >= 6; Triton's region flag; the Charter exists with a leader | regions: cold, west, tritons |
| `zin_tritons_charter_founded (global)` | flags | global / country | Pupor Charter state | regions: cold, west, tritons |
| `zin_tritons_charter_invited (country)` | flags | global / country | Pupor Charter state | regions: cold, west, tritons |
| `zin_tritons_charter_leader` | flags | global / country | Pupor Charter state | regions: cold, west, tritons |
| `zin_tritons_corsair_haven` | country flags | country | The island's side in the Pupor Ocean system | regions: cold, west, tritons |
| `zin_tritons_found_charter / zin_tritons_join_charter` | scripted effects | country | Found the Pupor Charter faction (name key zin_faction_pupor_charter) or ask its leader to join | regions: cold, west, tritons |
| `zin_tritons_is_island_realm` | scripted triggers | any / country | Journey stage >= 6; Triton's region flag; the Charter exists with a leader | regions: cold, west, tritons |
| `zin_tritons_join_crossing` | scripted effect | country | A Triton's country joins the Western Crossing faction and its war against the Aenor realm (after zin_western_crossing; never historical); sets country flag zin_tritons_with_the_crossing | regions: cold, west, tritons |
| `zin_tritons_mediation_accepted (country)` | flags | global / country | Southern Banks outcomes | regions: cold, west, tritons |
| `zin_tritons_mediation_refused` | opinion modifiers | diplomacy | -20 Nondondor <-> Seite Islands (decays 0.5/month); -10 mediator to refuser | regions: cold, west, tritons |
| `zin_tritons_offer_banks_mediation / zin_tritons_make_banks_accord` | scripted effects | country / any | Raerby's mediation of the Southern Banks and the accord that ends the quarrel | regions: cold, west, tritons |
| `zin_tritons_piracy` | variable (global, 0-100, start 35, lazily initialised) | global | How lawless the Pupor Ocean is; quiet below 25, corsair seas at 60+ | regions: cold, west, tritons |
| `zin_tritons_sea_band` | variable (global, 0-2) | global | Current piracy band: 0 quiet, 1 wary, 2 corsair | regions: cold, west, tritons |
| `zin_tritons_set_side` | scripted effect (arg side = chart/haven/none) | country | Makes a Triton's country a chart house or a corsair haven (country flags zin_tritons_chart_house / zin_tritons_corsair_haven) | regions: cold, west, tritons |
| `zin_tritons_ship_has_sailed` | scripted triggers | any / country | Journey stage >= 6; Triton's region flag; the Charter exists with a leader | regions: cold, west, tritons |
| `zin_ui_<meter>_frame` | variable | country | Integer gauge frames (value/5, or (value+100)/10 for signed gauges) computed by zin_ui_refresh; formatting only | interface art validation |
| `zin_ui_close_panels` | scripted effect | country | Clears zin_realm_open and every zin_ui_<panel>_open flag | interface art validation |
| `zin_ui_council_open` | country flag | country | Mechanic panel open for that player (the existing zin_realm_open flag stays as it is) | interface art validation |
| `zin_ui_court_open` | country flag | country | Mechanic panel open for that player (the existing zin_realm_open flag stays as it is) | interface art validation |
| `zin_ui_dominion_open` | country flag | country | Mechanic panel open for that player (the existing zin_realm_open flag stays as it is) | interface art validation |
| `zin_ui_has_any_panel` | scripted trigger | country | Whether the viewing country may see each mechanic panel (wrap zin_aenor_is_realm, zin_afrit_is_hub, zin_is_volgan, zin_is_mirolon, zin_is_zol, zin_is_lerendor, zin_eindil_is_host) | interface art validation |
| `zin_ui_has_council_panel` | scripted trigger | country | Whether the viewing country may see each mechanic panel (wrap zin_aenor_is_realm, zin_afrit_is_hub, zin_is_volgan, zin_is_mirolon, zin_is_zol, zin_is_lerendor, zin_eindil_is_host) | interface art validation |
| `zin_ui_has_court_panel` | scripted trigger | country | Whether the viewing country may see each mechanic panel (wrap zin_aenor_is_realm, zin_afrit_is_hub, zin_is_volgan, zin_is_mirolon, zin_is_zol, zin_is_lerendor, zin_eindil_is_host) | interface art validation |
| `zin_ui_has_dominion_panel` | scripted trigger | country | Whether the viewing country may see each mechanic panel (wrap zin_aenor_is_realm, zin_afrit_is_hub, zin_is_volgan, zin_is_mirolon, zin_is_zol, zin_is_lerendor, zin_eindil_is_host) | interface art validation |
| `zin_ui_has_journey_panel` | scripted trigger | country | Whether the viewing country may see each mechanic panel (wrap zin_aenor_is_realm, zin_afrit_is_hub, zin_is_volgan, zin_is_mirolon, zin_is_zol, zin_is_lerendor, zin_eindil_is_host) | interface art validation |
| `zin_ui_has_mistake_panel` | scripted trigger | country | Whether the viewing country may see each mechanic panel (wrap zin_aenor_is_realm, zin_afrit_is_hub, zin_is_volgan, zin_is_mirolon, zin_is_zol, zin_is_lerendor, zin_eindil_is_host) | interface art validation |
| `zin_ui_has_strait_panel` | scripted trigger | country | Whether the viewing country may see each mechanic panel (wrap zin_aenor_is_realm, zin_afrit_is_hub, zin_is_volgan, zin_is_mirolon, zin_is_zol, zin_is_lerendor, zin_eindil_is_host) | interface art validation |
| `zin_ui_has_watch_panel` | scripted trigger | country | Whether the viewing country may see each mechanic panel (wrap zin_aenor_is_realm, zin_afrit_is_hub, zin_is_volgan, zin_is_mirolon, zin_is_zol, zin_is_lerendor, zin_eindil_is_host) | interface art validation |
| `zin_ui_journey_open` | country flag | country | Mechanic panel open for that player (the existing zin_realm_open flag stays as it is) | interface art validation |
| `zin_ui_mistake_open` | country flag | country | Mechanic panel open for that player (the existing zin_realm_open flag stays as it is) | interface art validation |
| `zin_ui_open_panel` | scripted effect | country | Argument panel: closes the other panels, opens this one, resets tab and page, refreshes | interface art validation |
| `zin_ui_page` | variable | country | Per-player panel state: active tab, list page, selected row (UI only) | interface art validation |
| `zin_ui_refresh` | scripted effect | country (ROOT player) | Raises zin_ui_tick, recomputes gauge frames and zin_aenor_concord_avg; never changes a mechanic variable. Called by the monthly world tick for human players and by mechanic effects that change displayed values | interface art validation |
| `zin_ui_selected` | variable | country | Per-player panel state: active tab, list page, selected row (UI only) | interface art validation |
| `zin_ui_strait_open` | country flag | country | Mechanic panel open for that player (the existing zin_realm_open flag stays as it is) | interface art validation |
| `zin_ui_tab` | variable | country | Per-player panel state: active tab, list page, selected row (UI only) | interface art validation |
| `zin_ui_tick` | variable | global | Dirty counter for every ZIN scripted GUI; +1 on every zin_ui_refresh call | interface art validation |
| `zin_ui_watch_open` | country flag | country | Mechanic panel open for that player (the existing zin_realm_open flag stays as it is) | interface art validation |
| `zin_varner_wards_raised` | global flag | global | Varner's wards have risen (once) | world systems |
| `zin_volgan_add_dominion_strength` | scripted effect | Volgan | Adds to and clamps zin_dominion_strength (halved above 75; cap 40 after the body breaks) and refreshes the zin_dominion_hosts modifier | volgan and mirolon |
| `zin_volgan_add_veil / zin_volgan_add_nether_pact / zin_volgan_add_oath / zin_volgan_court_dark_lands / zin_volgan_spawn_grave_host / zin_volgan_begin_march / zin_volgan_take_field / zin_volgan_raise_northern_front / zin_volgan_wargoal_parim / zin_volgan_make_client / zin_volgan_steward_rule / zin_volgan_refresh_strength` | scripted effects | Volgan | Mechanic effects used by the Volgan tree; zin_volgan_begin_march sets zin_volgan_marches | volgan and mirolon |
| `zin_volgan_children_proclaimed` | country flag | Volgan | Set by focus The Children of Volgan; world systems may read it alongside zin_volgan_children_ready | volgan and mirolon |
| `zin_volgan_children_ready` | scripted trigger | Volgan | Children of Volgan readiness: body intact, Volgan or a subject holds Parim, at least 4 subjects, strength >= 60, Eindil not crowned. World systems read it to set zin_ending_children_of_volgan | volgan and mirolon |
| `zin_volgan_destroy_body` | scripted effect (proposed, owned by Volgan) | Volgan | Destroys Volgan's manifested body; sets zin_volgan_body_destroyed | eindil and glo, volgan and mirolon |
| `zin_volgan_ember_herald / zin_volgan_grave_warden / zin_volgan_ghorvak` | characters | Volgan | Proposed lieutenants (generals); the Ember Herald becomes Steward of Nafeher after the body breaks | volgan and mirolon |
| `zin_volgan_pact` | variable | each Dark Lands country | 0-3; 1 envoys received, 2 Pact of Spoils (access at the march), 3 Sworn to Nafeher (joins the Southern Dominion faction) | volgan and mirolon |
| `zin_volgan_presence_equipment` | equipment | country | Equipment that cannot be produced; only the warfare effects above grant or remove it | warfare |
| `zin_volgan_struck_down_eindil` | global flag | global | Volgan cast Eindil down in their first duel (historical 4A 1757); set by zin_dominion.16, which the Eindil spec fires | volgan and mirolon |
| `zin_volgan_veil` | variable | Volgan | 0-100; how hidden Volgan's rebuilding is (Veil of Storms); start 85; thresholds 70/50/30 fire once | volgan and mirolon |
| `zin_volgan_veil_band` | variable | global | 0 Hidden, 1 Rumoured, 2 Suspected, 3 Seen; set by the Volgan spec's veil refresh so Mirolon's panel shows only the band | interface art validation |
| `zin_volgan_war_open / zin_volgan_hosts_stirring / zin_volgan_hosts_ready / zin_volgan_great_host / zin_volgan_veil_intact / zin_volgan_may_break_veil / zin_volgan_mirolon_taken / zin_volgan_body_intact / zin_volgan_mirolon_clientable / zin_mirolon_passes_held / zin_mirolon_occupied` | scripted triggers | Volgan / Mirolon | Mechanic gates; zin_volgan_war_open = zin_war_of_last_crowns or Volgan's own zin_volgan_veil_broken | volgan and mirolon |
| `zin_volgan_zol_clash` | global flag | global | Volgan's and Zol's hosts are at war with each other (historical 4A 1756) | volgan and mirolon |
| `zin_wall_accord / zin_wall_accord_broken` | global flags | global | The Wall Accord holds / was broken by war across the wall | world systems |
| `zin_war` | event_namespace | global | Warfare events: zin_war.1-7 and the hidden monthly zin_war.20 | warfare |
| `zin_war_build_great_wall` | scripted_effect | global | Sets the Great Wall fort levels and the zin_war_great_wall state modifier | warfare |
| `zin_war_can_shockwave` | scripted_trigger | country | The country holds the bearer of Glo, zin_glo_with_eindil is set and zin_zol_manifested is not | warfare |
| `zin_war_dragon_pact` | country_flag | country | The country has a dragon pact with Dragon Mountain (set by world systems) | warfare |
| `zin_war_feed_deathless` | scripted_effect | Zol | Adds zin_mistake_power x 25 deathless bonds to Zol's stockpile (capped before zin_zol_rising); called monthly by the Zol mechanic | warfare |
| `zin_war_glo_shockwave` | scripted_effect | state | Damages Zol's divisions in a state (damage_units, org 1.0, str 0.6) and fires zin_war.3 | warfare |
| `zin_war_grant_dragons` | scripted_effect | country | Argument amount: adds dragon equipment, raises zin_dragon_flights and grants dragon lore, or a timed idea when the sky rule is none. World systems decides who gets dragons and when | warfare |
| `zin_war_grant_glo_bearer` | scripted_effect | country | Gives the country holding Eindil the bearer-of-Glo equipment, the Eindil host template and division, and the zin_trait_glo_bearer trait | warfare |
| `zin_war_grant_great_spirit` | scripted_effect | Volgan | Adds one great spirit company to Volgan (max 3) | warfare |
| `zin_war_grant_shachihata` | scripted_effect | country | Adds one Shachihata (demons, Volgan) | warfare |
| `zin_war_grant_volgan_presence / zin_war_remove_volgan_presence` | scripted_effect | Volgan | Adds Volgan's presence company on zin_volgan_marches; removes it on zin_volgan_body_destroyed | warfare |
| `zin_war_grant_zol_manifestation / zin_war_remove_zol_manifestation` | scripted_effect | Zol | Zol mechanic's time-limited manifestation company (on zin_zol_manifested / zin_zol_withdrawn) | warfare |
| `zin_war_great_wall` | dynamic_modifier | state | Great Wall state modifier: land_bunker_effectiveness_factor 0.20, local_supply_impact_factor -0.10, enemy_army_speed_factor -0.10 | warfare |
| `zin_war_has_deathless_in_state` | scripted_trigger | state | Zol has deathless divisions in this state | warfare |
| `zin_west_add_fleet` | scripted effect | any | Adds to the global zin_west_fleet with clamping; called by Coldor's timber sales | west and cold lands |
| `zin_west_crossing_ready` | scripted trigger | any | The Western Crossing can launch: crossing route chosen, 3 or more pledges, fleet 50 or more, resolve 60 or more, and the War of the Last Crowns has begun (or the early-crossing conditions are met) | west and cold lands |
| `zin_west_end_ford_war` | scripted effect | any | The only way the Grey Ford Feud ends (how = peace/decided/escalated); the journey's War-King's Terms must call it instead of white_peace | west and cold lands |
| `zin_west_evacuation / zin_west_evacuated` | global flags | global | Western evacuation started / finished | west and cold lands |
| `zin_west_ford_blood` | opinion modifier | country | -30 between Gunwaith and Girdon when the truce breaks, decaying 1 a month; removed by the war-king's peace | west and cold lands |
| `zin_west_grey_ford_war` | global flag | global | The Grey Ford Feud (border war between Gunwaith and Girdon) is running; cleared at peace. Eindil's journey reads it as 'a western war is running'. | west and cold lands |
| `zin_west_grudge / zin_west_unity / zin_west_resolve / zin_west_fleet / zin_west_strain / zin_west_truce` | variables | country / global | Grudge: per West Lands country, 0-100. The other five are global, 0-100: the West's unity, will to cross, crossing shipping, occupation strain and truce strength. | west and cold lands |
| `zin_west_holds_parim` | global flag | global | Outcome only (never history): a western crown holds Parim; read by world systems | west and cold lands |
| `zin_west_parim_taken` | global flag | global | A western army has held Parim | west and cold lands |
| `zin_west_remembers_war_king` | global flag | global | The war-king laid his title down and was released with honour; adds a bonus when stranded countries are asked to join the coalition | west and cold lands |
| `zin_west_route_crossing / zin_west_route_divided / zin_west_route_relief / zin_west_route_hold` | global flags (+ variable zin_west_route 0-4) | global | The course the West chose at the Ford Council | west and cold lands |
| `zin_west_stranded` | country flag | country | Part of this western country's army stayed in the Middle Lands after the evacuation. Read by Eindil's coalition invitation (journey event 94). | west and cold lands |
| `zin_west_truce_broken` | global flag | global | The Truce of the Grey Ford is broken. Never cleared. | west and cold lands |
| `zin_world_add_gathering_dark` | scripted effect | any | Used with positive and negative values; assumed to be defined by world systems as named in the contract's naming example | zol, world systems |
| `zin_world_check_endings` | scripted effect (owned by world systems) | any | Evaluates endings after Eindil's coronation and sets zin_ending_lost_cause | aenor |
| `zin_world_check_endings / zin_world_reach_ending` | scripted effects | any | Monthly ending check; reach an ending by key (lost_cause, children_of_volgan, ashen_throne, golden_court, western_crown, strait_master, eastern_king, unfinished) | world systems |
| `zin_world_dead_k` | global variables | global | Meter sources for the tooltip, last change, world casualties in thousands | world systems |
| `zin_world_ending` | global flag and variable | global | An ending has been reached; which one (1-8) | world systems |
| `zin_world_long_peace` | idea | every country except Volgan, Demon, Dolon, Nezer, Zol and the Worshipdom | Start spirit for almost every country: war_support_factor -0.10, justify_war_goal_time 0.5, army_org_factor -0.05. Removed when the country goes to war or when zin_war_of_last_crowns is set. Proposed; the world-tension spec may replace it. | lore digest |
| `zin_world_lord_of_a_ruined_world` | idea ids | common/ideas/zin_world_endings.txt | Ids for the ending spirits the world spec describes but did not name (Children of Volgan, Ashen Throne, each proposed outcome) | events |
| `zin_world_outcome_<key>` | idea ids | common/ideas/zin_world_endings.txt | Ids for the ending spirits the world spec describes but did not name (Children of Volgan, Ashen Throne, each proposed outcome) | events |
| `zin_world_peace_holds` | scripted trigger | any | Meter below 25 and no war with a major on each side | world systems |
| `zin_world_raise_varners_wards / zin_world_grant_new_gods_gift` | scripted effects | Eindil's host | Exact effects of the two one-time interventions, called by the journey's events zin_eindil.97 and .98 | world systems |
| `zin_world_the_worshipped_king` | idea ids | common/ideas/zin_world_endings.txt | Ids for the ending spirits the world spec describes but did not name (Children of Volgan, Ashen Throne, each proposed outcome) | events |
| `zin_world_tick_month / zin_world_tick_week` | timed global flags | global | Guards so the world tick runs once per month/week from on_monthly/on_weekly | world systems |
| `zin_world.110 / .111 / .112` | event ids (in the world spec's reserved 100-119 range) | events/zin_world.txt | The Chronicle of the Age; Your Part in the Age; The Age Has Turned (end screen) | events |
| `zin_yeldenne_forewarned / zin_yeldenne_hall_unyielding / zin_yeldenne_coast_watch / zin_yeldenne_beacon / zin_yeldenne_guides / zin_yeldenne_awaits_heir / zin_yeldenne_seal_warded / zin_yeldenne_calls_heir / zin_yeldenne_calls_bearer` | global flags | global, set by Yeldenne focuses | Read by the Glo system (hall score, test length, defilement time, seal) and the journey (ambush strength -1 each for coast watch, beacon, guides) | eindil and glo |
| `zin_yeldenne_warden` | character | Yeldenne | The Warden of Mp'E (proposed title, personal name open); Yeldenne's leader after Horos dies | eindil and glo |
| `zin_yeldenne_wards` | variable | global, 0-100 | Strength of Glernaen's old protections at the Castle of Yeldenne; drives the hall score | eindil and glo |
| `zin_zol` | character | Zol | Zol as country leader; non-figurative emblem portrait, no body, no person-like traits | zol |
| `zin_zol_add_mistake_power / zin_zol_add_convergence` | scripted effect | any (acts on Zol) | Clamped changes to Zol's power and convergence, callable by other systems | zol |
| `zin_zol_bane / zin_zol_forewarned` | idea | other countries | Ideas put on other countries: targeted bonuses against Zol for potent-magic holders and for forewarned countries | zol |
| `zin_zol_bond_great / zin_zol_bond_lesser / zin_zol_bond_divine` | variable | Zol | 0-5 strength of service of each established servant order (not identities or counts) | zol |
| `zin_zol_break_front` | scripted effect | state | Destroy all Zol divisions in a state and adjacent Zol-controlled states with no manpower return, -3 power; called by Eindil's journey (Glo's wave) | zol |
| `zin_zol_can_rise / zin_zol_can_manifest` | scripted trigger | Zol | Conditions for the rising and the manifestation | zol |
| `zin_zol_convergence` | variable | Zol | 0-100 readiness of conditions for Zol's rare temporary manifestation (proposed) | zol |
| `zin_zol_is_manifest` | scripted trigger | any | zin_zol_manifested set and zin_zol_withdrawn not set | zol |
| `zin_zol_islands_stirring` | variable | Zol | Count of black islands of the Ocean of Zol that stir; readable by Aenor/Lost Cause/Lerendor | zol |
| `zin_zol_manifestation_equipment` | equipment | country | Equipment that cannot be produced; only the warfare effects above grant or remove it | warfare |
| `zin_zol_rise / zin_zol_manifest / zin_zol_withdraw` | scripted effect | Zol | Set zin_zol_rising / zin_zol_manifested / zin_zol_withdrawn with their full consequences | zol |
| `zin_zol_volgan_accord` | global flag | global | Zol and Volgan made their brief accord against Eindil; it counts as active while zin_volgan_body_destroyed and zin_zol_withdrawn are both unset | zol |
| `zin_zol_volgan_clash` | global flag | global | Zol's dead and Volgan's forces have gone to war with each other | zol |
| `zin_zol_will` | character | Zol | The Will of Zol: Zol's leader as an emblem, not a person; does not say who administers the Mistake | foundation |
