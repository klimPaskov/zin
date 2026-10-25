# Realm life and the shape of the age

**Status:** Implemented 25 October 2026 (`tools/content/modules/realm_life.mjs`, `tools/content/modules/start_variety.mjs`); the Linux observer runs are pending. **Owner:** realm life. **Design:** [alternate_history.md](../../design/alternate_history.md) sections 7 and 8 (G1 to G10, V1 to V13) and its twin `alternate_history.json`; owner decision K34 of [INTEGRATION_DECISIONS.md](../INTEGRATION_DECISIONS.md).

**Acceptance basis.** The owner accepted three things in K34: the generic realm systems may visit every country once a month in four weekly batches, the full start variety may open with at most two small border feuds between minor realms, and the great powers stay at peace. Everything else in this file (the rates, chances, texts, the lists of raiders and feud groups, the shelter order of the Golden King, the temper traits) is **proposed**, implemented within canon and open to the owner's questions in [realm_life_handoff.md](../../plans/story/realm_life_handoff.md). No text states an age, names Afrit before the reveal, names the heir before the naming, or makes Zol appear.

## 1. What it does

Realm life gives every realm of Aoaz the ordinary business of a crown while the story keeps its own moments: rulers age and die, heirs take the crown or rule through a council of regency, a crown without an heir falls into crisis, captains reach for the crown, subjects stir and occupied lands rise, long wars end in terms, royal houses marry and call on their kin, raiders ride, and fallen courts live in exile and come home. The start variety lets a campaign begin a little differently from the chronicle, within the ranges the design documents, and is switched off for a historical game.

## 2. How it works, step by step

### 2.1 The pulse (K34)

1. The world tick (`zin_world_tick`, once a month on the runner `zin_world_runner`) calls `zin_story_tick` at its step 9; `zin_story_tick` calls `zin_story_tick_realm` (the crown module's story blocks list `realm`, convention C6).
2. `zin_story_tick_realm` sets `global.zin_realm_batch` to 0 and runs `zin_realm_run_batch` at once, then schedules the hidden event `zin_realm.1` on the runner 7, 14 and 21 days on; each `zin_realm.1` raises the batch by one and runs it.
3. `zin_realm_run_batch` first houses the Golden King's court if `zin_golden_king_exiled` is set and nothing has housed it (`zin_realm_gk_court`), then runs `zin_realm_pulse` on every country whose `zin_realm_slot` equals the batch. Slots 0 to 3 are given at the start in roster order; a country without a slot (a dynamic tag) runs in batch 0. So every country is visited once a month, a quarter of them each week, and nothing uses an every-country `on_monthly`.
4. The pulse runs inside the runner's chain, so ROOT there is the runner: every effect of realm life uses THIS and PREV and passes the other party of an event as an event target (`zin_realm_terms_from`, `zin_realm_suitor`, `zin_realm_raider` and the rest).

### 2.2 G1 Rulers' years

- Rulers age by the year (owner answer Q-85, K55: reigns last decades). On startup each realm gets `zin_ruler_rate` from its ruler's people and `zin_ruler_vigour`, which counts the years left in a man's life (0 to 60): from the ruler's year of birth where the courts give one (the years left to the people's span times the rate, at least three years), otherwise a seeded draw from 10 to 40. Rates: men 1, orcs and goblins 1.3, dwarves 0.6, giants 0.5, elves 0.05 (the design's); the small folk as men, gnomes 0.8, hobgoblins, ogres and trolls as orcs, yeti as giants, ents, the Baelim, the mycids and the demon lords as elves (proposed). The dead and the spirits have no rate. Every sitting ruler is marked known (`zin_realm_known`, a character flag).
- Each pulse `zin_realm_note_ruler` gives any ruler it has not seen (a successor, a usurper, a ruler a focus raised) a fresh vigour (15 to 40 years; a crowned heir of known birth keeps the years his own age gives him, `zin_realm_vigour_given`) and, when the start variety is not off, a 50 in 100 chance of a temper (`zin_variety_temper_new_ruler`, AI realms).
- `zin_realm_age_ruler` lowers the vigour each month by the rate over the twelve months of a year, half as much again at war and again when the war goes badly (surrender above 0.3). Below 0.01 the ruler dies; below 5 years the ruler may die any month (`mtth:zin_realm_frail_death`, 3 in 100 times the rate, more at war or in disorder, less for a cautious or fortunate ruler, more for a weary or melancholy one). A man of the mean fresh vigour reigns about a quarter of a century; elves, ents, the Baelim, the mycids and the demon lords (rate 0.05) reign for centuries, dwarves and giants for many lifetimes of men.
- `zin_realm_mortal` exempts the story rulers (`zin_realm_is_story_ruler`: the Golden King, Aurevan, Lorien, Volgan, Horos, the Will of Zol, the King of Demons, the heir, every `zin_trait_ancient_king`, the Warden of Yeldenne, the whole line of the Aenor court and the rulers of the Worshipdom, Puvulan, Zol's Mistake and Yeldenne), the story realms whose beat is pending (`zin_realm_story_pending`: Mirolon before CP15, Gala before CP23), and, on the historical path, tier A rulers and the courts the chronicle names (Selen, Girdon, Yeldenne).

### 2.3 G2 Heirs and regencies

- The named heirs of `tools/content/data/world/characters/` and the 109 pre-built heirs of `tools/content/data/world/heirs.json` (owner answer Q-87, K59; the characters module defines them with a country leader role and recruits none) are recruited in their country histories after the court (`heirsToRecruit`, handed to the country package by `build.mjs`), so the ruler, recruited first, rules and the heir waits. Heirs another module owns (Prince Eronel, Maeric of Miherta) and the heirs of story realms are left to their owners. No heir is recruited during play.
- `zin_realm_succeed` (the ruler has died): a waiting named heir (`zin_realm_has_named_heir`) is promoted (`zin_realm_crown_heir`). An heir younger than 16 (`zin_realm_heir_born` against `global.year`) reigns through `zin_realm_regency` until grown, at least two and at most five years, and `zin_realm.11` A Child on the Throne asks who governs; a grown heir gives `zin_realm.10` The Crown Passes. When the regency idea runs out, `zin_realm.14` The Regency Ends.
- A kinsman named by the decision Name an Heir (`zin_realm_heir_named`) takes the crown quietly (`zin_realm.10`, way 3). A realm that chooses by its own custom (a moot, a council, a guild) gets the successor the engine names and `zin_realm.10`, way 4. A realm whose custom nobody knows (`zin_realm_open_custom`) gets the engine's successor and `zin_realm.10`, way 5.
- The succession custom comes from the heir notes of the courts: a named heir means the crown passes by blood (`zin_realm_inherits`); a note that settles the crown by combat (the ring, whoever is largest, taken not inherited) means `zin_realm_contested_custom`; a note that says nothing is known means `zin_realm_open_custom`; anything else is elective.

### 2.4 G3 Succession crises

- A crown that passes by blood or by combat and has no heir opens a crisis when `zin_realm_crisis_allowed` (not a story realm while its beat is pending: Aenor before CP06, the Worshipdom, Puvulan, Zol's Mistake, Gala before CP23, Mirolon before CP15, the heir's host; never tier A on the historical path): `zin_realm_open_crisis` gives `zin_realm_crisis` (a year at most) and `zin_realm.12` No Heir of the Body.
- `zin_realm.12`: let the claimants plead (`zin_realm.13` fifteen days on) or proclaim the nearest kinsman for 100 authority (way 5).
- `zin_realm.13` The Claimants: the council elects (way 1); the captain-general takes the crown (way 4, `zin_realm_has_captain`); the claimants fight for it (way 2, a civil war of the same allegiance, `start_civil_war` with `ruling_party`, when `zin_realm_crown_may_be_contested`: four states at least and fewer than twelve contested crowns so far, the S12 tag budget counted in `global.zin_realm_contested_crowns`); a prince of the house we married into (way 3, `zin_realm_match_may_reign`: a sworn realm of that house when the course of the age is free, its guarantee otherwise). On the historical path tier B realms may only elect (`zin_realm_crisis_may_turn`).
- `zin_realm_settle_crisis` ends the crisis and fires `zin_realm.15` The Crisis Settled with the way in `zin_realm_crisis_way`.

### 2.5 G4 Usurpation

- Off on the historical path. When calm is below a quarter, the realm has a captain-general and no crisis, `mtth:zin_realm_ambition_chance` (3 in 100, more in disorder, at war or losing) marks the ablest captain (`zin_char_ambitious`) and fires `zin_realm.20` A Captain's Ambition: buy the captain off (75 authority), strip the command (seven in ten `zin_realm.22` The Usurper Fails, three in ten `zin_realm.21` The Usurper Crowned), or let the captain come (`zin_realm.21`).
- `zin_realm_crown_captain` makes the captain the ruler in the ruling stance (one branch per stance) and gives `zin_realm_usurper_rule` for a year. Foreign plots stay with the institutions' Raise the Captains operation.

### 2.6 G5 Rebellions and risings

- Off on the historical path for subjects. A subject whose opinion of its overlord is below -25 while the overlord is at war gets `zin_realm.30` The Subject Stirs: break free (`end_puppet`), a looser bond (`add_autonomy_ratio`) or keep faith. The Concord, Volgan's and Zol's sworn realms and the clients of the East before `zin_afrit_dead` keep their own rules (`zin_realm_bond_owned`).
- A controlled state that is not our core and whose resistance is above 50 gives `zin_realm.31` A Rising in Occupied Lands (hang, treat, leave it); `zin_realm.32` The Rising Ends when the resistance is below 25 again or the land is no longer ours.

### 2.7 G6 Peace

- `zin_realm_war_months` counts the months of war. An AI realm a year into a war that no story owner ends (`zin_realm_story_war_side`: the Aenor court, the Deliverer's seat, the dark powers and their sworn realms, Mirolon, Gala, Selen, the Grey Ford pair, Lerendor, Yeldenne, the heir's host, the clients of the East while the false god lives) offers terms to an enemy (`zin_realm_offer_terms`): peace on the old borders, the land its hosts hold that it claims (when the foe is losing), or silver for peace (when it is losing). `zin_realm.40` Terms Offered, `zin_realm.41` The Answer to Our Terms. A player offers terms with the decision.
- An AI realm makes peace (`zin_realm.42` War Without Purpose) in a war it cannot fight after a year and a half (no border with the foe), and at once with any court of the East after `zin_afrit_dead`.

### 2.8 G7 Marriages and alliances

- The decision Seek a Match is open between royal houses (`zin_realm_is_monarchy`) of compatible peoples (`zin_realm_kin_<class>`: men, elves, giants, orcs, dwarves) that are not at war, think well enough of each other and hold no match; houses whose bonds a story mechanic owns are left out (`zin_realm_alliance_owned`). `zin_realm.60` A Royal Match Proposed; `zin_realm.61` The Match Accepted (both houses hold `zin_realm_match`, opinion `zin_realm_royal_match` +25, and the suitor may pledge a guarantee); `zin_realm.62` The Match Refused (`zin_realm_match_refused`, -15).
- When the kin fights a defensive war we have no part in, `zin_realm.63` The Kinship Called: join it, send silver, or refuse (the bond ends, -20). A house we married into is the foreign candidate of a crisis (G3).
- The AI seeks matches by `mtth:zin_realm_match_will` (more under threat, without an heir, with a generous ruler; half outside the free course; never on the historical path, where only the start bonds and V9 stand).

### 2.9 G8 Raids

- Twenty-five raiding realms (`zin_realm_is_raider`: the orc, goblin and troll holds of the Dark Lands outside Goldoroth's own raids, Halenor, Santon, Benan, Nondondor and the Windy Lands among the Triton islands, Halia in the Ember Lands, Horidor, Glimkit, Omar and Orewele in the Cold Lands, and the riders of Konori, Hunhun, Noris and Delbiz; owner answer Q-89, K59, and its follow-up of 25 October 2026 for Noris and Delbiz). The corsairs (`zin_realm_is_corsair`: Belonton, Halenor, Santon, Benan, Nondondor, the Windy Lands) raid by sea, a coastal neighbour first and else a coastal realm of their own land, and come home with sea craft (`navy_experience`); the steppe riders (`zin_realm_is_steppe_rider`) raid only by land into a neighbour, half as often again, and come home with the craft of the saddle (`army_experience`); a chartered dominion never raids the crown or the Concord. The others ride now and then while at peace (`mtth:zin_realm_raid_chance`, 3 in 100 a month, more when the course is free or the ruler bold or grasping, less for a cautious one) into a neighbour, or into a coastal realm of their own land (`zin_realm_land_<region>`), never into a great power before the War of the Last Crowns and once a year at most.
- `zin_realm.70` Raiders on the March: ride out after them (the cause `zin_realm_cb_raiders` for a year), pay them, or bar the gates (`zin_realm_raided` for half a year). `zin_realm.71` The Raid Answered tells the raiders. The decision Punish the Raiders gives the cause and `zin_realm_punitive_host` to a realm raided in the last year.

### 2.10 G9 Courts in exile

- A capitulated or annexed realm keeps a court in exile when `zin_realm_court_may_flee` (never on the historical path, where only the story's courts go into exile; never the Aenor court, the Deliverer's seat or the dark powers): `zin_realm_found_exile_court` looks for an ally still in the field, the house it married into, a neighbour, or any realm that thinks well of it, never the conqueror (`zin_realm_conqueror`), and fires `zin_realm.50` A Court in Exile there. Keeping it gives `zin_realm_exiled_court` and claims on the fallen realm's cores that others hold.
- The shelter's pulse fires `zin_realm.51` The Exiles Return when the fallen realm is gone and the shelter owns one of its cores (release it free, release it as a sworn realm, or keep the land) or when the fallen realm stands again and its war is over (the court goes home).
- The decision Shelter the Exiles takes in the court of a capitulated realm.
- **The Golden King** (SL-25; owner question Q-65's default: he keeps a court in exile that can return): once `zin_golden_king_exiled` is set (Aenor's `zin_aenor_exile_king`), `zin_realm_house_golden_king` sends his court to the first of Lerendor, Selen and the old Concord dominions (Kingson, Konori, Hunhun, Herez, Noleksun, Orohaf, Kunhrim) that stands, has not capitulated, does not hold Parim and is not the Deliverer's seat; the on_capitulation and on_annex hooks do it at once and the weekly batch catches it otherwise. Its restoration sets `zin_golden_king_restored`.

### 2.11 G10 Story roles

The role registry and its news belong to the historical path (`zin_path_role_<key>`, `zin_path.11` to `.17`, see the framework handoff). `zin_realm.80` A Duty Passes is not written, because it would announce the same change twice (superseded, with that reason, in `docs/design/alternate_history.json`).

### 2.12 The start variety (V1 to V13)

- The rule `zin_rule_start_variety` (The Shape of the Age): DEFAULT follows the path rule (off, light, full), OFF, LIGHT, FULL. The wrappers are the generated `zin_rules_ai_branch_variety_off`, `_light`, `_full`.
- `common/on_actions/zin_start_variety.txt` draws once in on_startup (after `zin_rules.txt`, which sets the pace): each value is a `random_list` over the values of `tools/content/data/start_variety.json`, into `global.zin_sv_<key>`, and sets `zin_start_variety_drawn` (and `zin_start_variety_full`). The hidden `zin_variety.1` applies the draws on day 3, after every owner's start values.
- LIGHT: V1 the death clock moves by -180 to +180 days (not under the historical death rule; the floor date holds) and the court has a temper (`zin_gk_temper_gilded`, `_restless`, `_fearful`, read by the AI of the King's reign events); V2 the plot 10 to 35 and the veil 70 to 90; V3 each camp shifted -10 to +10 at the King's death (`global.zin_sv_camp_<camp>`, read by `zin_aenor_compute_camps`) and Prince Eronel's standing `zin_aenor_eronel_favour` 0 to 2 (5 points of the Golden Court's camp each, `constant:zin_variety.eronel_favour_camp`); V4 tier A and B rulers who are not canon figures have a 50 in 100 chance of one temper `zin_trait_temper_<key>`, drawn by weight from twenty (owner answer Q-91, K59): the common bold, cautious, pious, grasping, scholarly, vengeful, generous, weary, just (Even-Handed), suspicious, ambitious and idle (10 each), the uncommon cruel, silver_tongued, builder and stern (4), the rare melancholy and fortunate (2) and the rarest touched and beloved (1). Beyond their modifiers the tempers move realm life: the frail death (fortunate, melancholy), ambition (suspicious, cruel, touched, beloved), raids (ambitious, idle), matches (silver_tongued, ambitious), the succession dispute (just, beloved, cruel, touched), the election dispute (just) and the heir's death (fortunate); V5 Volgan's strength 40 to 50, Zol's power 30 to 40, the Gathering Dark 8 to 12; V7 the truce 30 to 50 and the unity 10 to 20; V10 a foothold more in two eastern courts and one fewer in two others, within the cap; V11 Mirolon's passes and proof -10 to +10; V12 Lerendor's standing -15 to +15; V13 under the historical waking only, 0 to 40 more days of jitter.
- FULL also: V6 at most two small border feuds (K34) between AI realms of one feud group that share a border (the Dark Lands holds with the Troll Forest, the Triton lordships), `start_border_war` with no land changing hands, cancelled ninety days on by `zin_variety.2`; V8 for each pair (Gunwyn and Girdon, Coldor and Melkgard, Noris and Stabilo, Goldoroth and Dondor, Herrodon and Andos Enda, Lerendor and R'en) a one in two chance that a border state that is not a capital starts with the other claimant (the giver keeps its core and gains a claim); V9 at most one bond: a Leren courtship of Andos Enda (`zin_realm_courtship`, +25 both ways, outside the Compact), a Stabilo guarantee of Alerhia or a Coldor pact with Nivaros.
- The changes that land on one realm are made for AI realms only under LIGHT; under FULL the tempers, feuds, disputed lands and bonds reach player realms too (owner answer Q-92, K59). No option starts a war between great powers, changes a league, recruits the heir, reveals the Deliverer or touches a canon figure.

### 2.13 Pre-built heirs and dynamic succession (owner answer Q-87, K59)

**Acceptance basis.** The owner answered Q-87 on 25 October 2026: every realm has pre-built heirs, but sometimes no heir can be determined and civil wars or other crises follow, everything dynamic. The heirs' names, offices, births and texts, the customs, the chances and the event texts are proposed.

- **The heirs.** `tools/content/data/world/heirs.json` gives 109 realms whose courts named no heir a pre-built, named heir (`zin_heir_<realm key>`), written in each realm's naming style from its court; `loadCharacterData` sets each as its court's heir (`prebuilt`), so the characters module defines him with a country leader role in the realm's stance and the country package recruits him in the realm's history after the ruler (`heirsToRecruit`). Every heir is a man (K54, Q-104: only eight women remain), or of no sex for the ents and the Baelim, as their rulers are. Nine realms have none: Yeldenne (retired, K56), Puvulan, the Worshipdom and Zol's Mistake (their rulers are the story's), Gala (who follows Lorien is left to the owner), the Nether (open in the vault), the God Forest and the Mushroom Forest (no ruler named), and Goldoroth (the Dark Lands mechanic names its heir).
- **The customs.** Each realm has one custom of succession (`custom`): **blood** (an ordered line by blood, age or pact; `zin_realm_inherits`), **elective** (a moot, a council or a guild chooses and the heir is its favoured candidate; `zin_realm_elective_custom`), **contested** (the crown is taken in the ring or by the biggest; `zin_realm_contested_custom`) or **open** (the custom is not told to men; `zin_realm_open_custom`). A pre-built heir carries his realm's custom; a court's own named heir means blood unless `customs` in `heirs.json` says otherwise (Stabilo, Kingson, Hunhun, Nan, Herrodon and Miaed choose; Noris, Azano and Nezer keep their line).
- **When the ruler dies** (`zin_realm_succeed`): with a waiting named heir, a roll against `mtth:zin_realm_succession_dispute` (10 in 100, +25 for a choosing custom, +40 for a contested one, -5 for an open one, +10 in disorder, +10 when losing a war, +10 with an ambitious captain; halved by a just or beloved ruler, half as much again for a cruel one, doubled for a touched one, a quarter on the historical path) decides whether the succession is disputed, when the crown may fall into crisis (`zin_realm_crisis_allowed`). Undisputed, the heir is seated (`zin_realm_seat_heir`; a child through a regency of two to five years) and told by `zin_realm.10` or `.11`. Disputed, `zin_realm.16` A Disputed Succession asks who rules: crown the heir over the rival (`zin_realm_disputed_crown` for a year: stability -8%, authority -0.15 a day), pass him over (he is retired and the custom chooses, `zin_realm.10` way 6), let the sword decide (`zin_realm_crown_may_be_contested` and `zin_realm_crisis_may_turn`: the heir is crowned and the rival's civil war follows, `zin_realm.15` way 2), or let the captain-general end the quarrel (`zin_realm_has_captain`: a usurper's crown, way 4). A choosing realm without an heir may fail to agree (`mtth:zin_realm_election_dispute`, 15 in 100, more in disorder or at war) and fall into No Heir of the Body (`zin_realm.12`, which tells it as an election that cannot agree); a crown that passes in a line or by combat without an heir falls into it as before.
- **No heir can be determined.** Each month a waiting heir may die before the ruler (`mtth:zin_realm_heir_death`, 0.1 in 100 a month times the people rate, more at war or losing, halved for a fortunate ruler; only where the ruler is mortal): `zin_realm_remove_heir` retires him and `zin_realm.17` The Heir Is Dead offers to name another of the blood (50 authority; the flag `zin_realm_heir_named`) or to leave it to the custom. The decision Name an Heir stays open to a realm with no heir; its AI weighs the ruler's years left (`heir_worry_vigour` 10, `heir_urgent_vigour` 5) and a lost heir.
- **AI.** The weights of `zin_realm.16` favour the heir in a line and in a calm realm (and always on the historical path), passing him over in a choosing realm or in disorder, the sword in a contested custom or under a bold ruler (never on the historical path), and the captain when an ambitious captain waits or at war. `zin_realm.17` names another heir when the realm has the authority, and leaves it to the custom in a choosing realm.
- **Portraits.** The heirs need pool portraits of their culture, people and sex, which the portrait work makes (`docs/plans/story/owner_answers_k59_handoff.md` lists every heir). Until the plan lists an heir, `characters.mjs` gives him a free member of his culture pool within the serving cap, or no portrait of his own when the pool is full, so the portrait database of his realm serves him as it serves the Dark Lands chiefs (`pendingPortraits`).

### 2.14 Temper icons (owner answer Q-91)

The twenty tempers carry no icon in the game files: ZIN's country leader traits show none (`characters.mjs` writes none). If the art pass gives leader traits icons, each temper takes a frame of a ZIN leader-trait strip (`sprite = <frame>` in `common/country_leader/zin_temper_traits.txt`); the frames are registered in `docs/plans/zin-art/pending_from_integration.md`.

## 3. Interactions

| System | How realm life touches it |
| --- | --- |
| World tick (`world_tension.mjs`) | Step 9 calls `zin_story_tick`, which calls `zin_story_tick_realm` on the runner. |
| Crown events (`events_crown.mjs`) | Story block `realm`; the V1 tempers weight the options of `zin_reign.10`, `.14` and `.16` (they apply where the crown events' free weights apply). |
| Aenor court (`mech_aenor_script.mjs`) | `zin_aenor_compute_camps` adds the V3 shifts; `zin_aenor_exile_king` sets `zin_golden_king_exiled`, which houses the King's court; the whole Aenor line is a story ruler. |
| The Council (`mech_afrit*.mjs`) | V2 sets the plot and the veil; V10 moves footholds; the clients of the East are exempt from G5 and G6 while the false god lives; `zin_afrit_dead` opens G6's peace. |
| Volgan, Zol, Lerendor, the West, the journey | V5, V7, V11, V12 and V13 move their start values; their realms and their wars are exempt where their mechanics own them. |
| Diplomacy | The raiders' cause is a dynamic modifier in the diplomacy spec's form (`generate_wargoal_tension_against`). |
| Characters and the country package | The named heirs are recruited in the histories after the courts. |
| The historical path | Reads nothing of realm life; realm life reads `zin_path_cp06_done`, `zin_path_cp15_done` and `zin_path_cp23_done`. |

## 4. Files

| File | Written by |
| --- | --- |
| `common/script_constants/zin_realm.txt`, `common/scripted_triggers/zin_realm_life.txt`, `common/scripted_effects/zin_realm_life.txt`, `common/mtth/zin_realm.txt`, `common/ideas/zin_realm_life.txt`, `common/opinion_modifiers/zin_realm_life.txt`, `common/dynamic_modifiers/zin_realm_life.txt`, `common/decisions/categories/zin_realm_court.txt`, `common/decisions/zin_realm_court.txt`, `common/on_actions/zin_realm_life.txt`, `events/zin_realm.txt`, `interface/zz_zin_realm_life.gfx`, `localisation/english/zin_realm_life_l_english.yml` | `realm_life.mjs` from `data/realm_life.json` |
| `common/script_constants/zin_variety.txt`, `common/scripted_triggers/zin_start_variety.txt`, `common/scripted_effects/zin_start_variety.txt`, `common/on_actions/zin_start_variety.txt`, `common/country_leader/zin_temper_traits.txt`, `events/zin_variety.txt`, `localisation/english/zin_start_variety_l_english.yml` | `start_variety.mjs` from `data/start_variety.json` |
| `common/game_rules/zin_game_rules.txt`, `common/scripted_triggers/zin_rules.txt` (the rule and its wrappers) | `rules.mjs` from `data/game_rules.json` |

Localisation is English only, as every mechanic module writes it.

## 5. Icons and assets

No new art is needed: every picture and icon is a catalog key until the art pass.

| Asset | Sprite | Defined in | Key used |
| --- | --- | --- | --- |
| Decision category The Court | `GFX_decision_category_zin_realm_court` | `interface/zz_zin_realm_life.gfx` | catalog icon `crown_iron` |
| Name an Heir | `GFX_decision_zin_realm_heir_rolls` | same | `heir_rolls` |
| Seek a Match | `GFX_decision_zin_realm_two_crowns` | same | `two_crowns` |
| Offer Terms | `GFX_decision_zin_realm_olive_branch` | same | `olive_branch` |
| Shelter the Exiles | `GFX_decision_zin_realm_exile_court` | same | `exile_court` |
| Punish the Raiders | `GFX_decision_zin_realm_goblin_raiders` | same | `goblin_raiders` |
| Ideas | `GFX_idea_zin_<key>` (presentation module) | `interface/zin_catalog_ideas.gfx` | `regency_seals`, `crown_broken`, `crown_iron`, `exile_court`, `goblin_raiders`, `coin_chest`, `sword_shield` |
| Event pictures | `GFX_zin_evt_<key>` | `interface/zin_event_pictures.gfx` | `generic_court`, `concord_council`, `generic_peace`, `generic_war`, `generic_wilds` (no two events one step apart share one; `court_feast` is at its cap of eight events) |
| Temper traits | none | `common/country_leader/zin_temper_traits.txt` | ZIN's country leader traits carry no icon, as `characters.mjs` writes them; the design's `GFX_trait_zin_temper_<key>` would be needed only if the art pass gives leader traits icons |

When the art pass draws the category, it replaces the texture of `GFX_decision_category_zin_realm_court` under the same name; the decision icons and ideas keep their sprite names (`docs/plans/zin-art/pending_from_integration.md`).

## 6. Future extensions

- Named regents: a regent advisor drawn from the realm's own council (recruited in history and given the role by `add_advisor_role`) instead of the idea alone.
- A second generation of named heirs: when a pre-built heir is crowned, the realm has only the kinsman Name an Heir names; named sons for the crowned heirs, recruited in history and entering by role, would carry the line further.
- Royal marriages that pass a claim: a child of a match inherits a claim on the kin's crown, so a crisis may bring a foreign heir who already belongs to both houses.
- Native raids (`common/raids`, the hoi4-native-raids workflow) for the raiders, replacing the event raid where the game's raid interface is available.
- Exiled courts that raise a host of exiles in their shelter's land, and a restoration war led by the shelter.
- A Chronicle page for each succession, crisis and restoration, fed by the ways the events record.
- Rival claimants as characters: the rival of `zin_realm.16` as a named character of the realm's court who leads the civil war's side.
