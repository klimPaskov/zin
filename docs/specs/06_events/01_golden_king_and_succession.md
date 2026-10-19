# The Golden King and the Succession: Events

**Status:** Ready. Reviewed 19 October 2026 against CONVENTIONS "Status"; integrated 19 October 2026. **Priority:** 5. **Phase:** 5.

## Purpose

This spec is the event layer of Aenor's story from the peaceful start to the flight of its god-king. It covers:

1. **The gilded years** (1 Thaw 4A 1748 to Mistfall 4A 1750): the Golden King's reign as players see it, and the hidden plot as the Worshipdom sees it.
2. **The King is dead**: the Mistfall feast, the death, the funeral and how Erdae hears of it.
3. **The Thirty Days**: the four camps of the succession (the Golden Court, the Free Dominions, the Deliverer's Faithful, the Stranger's Host) and their risings.
4. **Aurevan's coronation** and the first years of his reign, up to the reveal and the abandoned throne.
5. **The other roads**: the Regency of Gold, the Concord of Equals, the Hailed King before his time, the King who survives.

Most mechanics already exist in [aenor_court_and_succession.md](../04_mechanics/aenor_court_and_succession.md) (namespace `zin_aenor`) and [afrit_hidden_council.md](../04_mechanics/afrit_hidden_council.md) (namespace `zin_afrit`). This spec does three things with them:

- puts every event of the chain in one ordered list, with who receives it, what fires it, its text and its options;
- writes the text gist of the owners' events, so the implementer can write localisation without guessing;
- adds the story events no mechanic owns, in the new namespace **`zin_reign`**: the King's progress, the eve and the funeral, foreign reactions, the camps' voices, the coronation and the first edicts.

The section "Conventions for the event specs" below applies to every file in this folder ([02](02_eindil_journey.md), [03](03_war_of_the_last_crowns.md), [04](04_endings.md), [05](05_flavour_and_world.md)).

## Lore basis

| Fact | Status | Source |
| --- | --- | --- |
| The Golden King is a famously poor ruler: greedy, sells offices, rewards flatterers; strong institutions keep Aenor running | established | *Golden King* |
| He founded the Lost Cause, against the dark and for his own prestige | established | *The Lost Cause* |
| He is effectively Afrit's puppet; Afrit secretly engineers his death; the conspiracy is not broadly understood by ordinary worshippers | established | *Golden King*, *Fourth Age Canon Register* |
| The succession struggle involves the Golden Court, the Free Dominions, Afrit's supporters and Eindil's popular host; the victor is a possible ending, not settled history | established | *Kingdoms Factions and Conflicts* |
| Temple authorities proclaim the Deliverer; councillors pass him the seals; commanders swear, many sincerely; most of the capital celebrates; dissenters, rival claimants and scholars who question his genealogy are silenced | established | *The Fourth Age of Erdae* III |
| He takes the crown as King of Aenor, First of His Name, and New God of Men | established (title wording partly proposed) | *The Fourth Age of Erdae* III, *Aurevan the Deliverer* |
| A council member governs Aenor while Afrit goes north | established | *Afrits Hidden Council* |
| The public name **Aurevan**; **Chancellor Merovan**; the Golden Court as a palace district (4A 1733); the Lost Cause founded 4A 1741; the Council's verdict of 4A 1746; the death in Mistfall 4A 1750 | proposed | *Fourth Age Chronology*, *Chancellor Merovan (proposed)* |
| The four-camp mechanism, the Thirty Days, the collective regencies, Prince Eronel of Arcedor, Ilvane the High Confessor (the Council's seat of worship and Parim's public high priest, decision N10), Master Ilsabet Vothrim, Lord-Commander Tarec Belurith | proposed | Aenor spec, Afrit spec, [02_characters.md](../02_lore/02_characters.md) |
| Every event, title, text, option and number below | **proposed** | this spec |

**Kept open, and never closed by any text here:** the Golden King's personal name, relatives and heirs; how exactly he died (text says he "died in his sleep after the Mistfall feast" and nothing more); Merovan's true identity and his fate after Afrit's fall; whether the Lost Cause formally survives the final war; whether Afrit is truly a New God; the birth order of Ein's sons.

## Design

### Conventions for the event specs (all of 06_events)

These rules apply to every event in this folder. They restate the contract, [INTEGRATION_DECISIONS.md](../INTEGRATION_DECISIONS.md) (D1–D4) and the path spec in one place. The numbers C1–C12 are stable; the other files cite them.

| # | Rule |
| --- | --- |
| C1 | **The secret.** Before `zin_afrit_revealed`, no text a non-Worshipdom country can read names Afrit, calls the Deliverer a demon, says "Hidden Council", or says the Deliverer or his priests govern Aenor. The Deliverer's name is always written through `[zin_loc_deliverer]` ("Aurevan the Deliverer" while `zin_afrit_secret_kept`, "Afrit" after; the Worshipdom always sees "Afrit"). The Worshipdom's own country shows as Light, ruled by "Aurevan the Deliverer" (D1). The world learns the name Afrit at his flight east (historical Thaw 4A 1756), or earlier only when a player exposes the plot (D3); before that, warnings say "the king in Parim is not what the temples say", never the name. Any concept with a public and a true label uses its `zin_loc_<concept>` scripted localisation. |
| C2 | **The stranger.** Before `zin_eindil_named`, Eindil is written through `[zin_loc_eindil]` ("the Man from the Ice") or as "the stranger" / "the King Without a House" (D4). Before `zin_eindil_awake` no text mentions him at all. |
| C3 | **Two-face text.** An event that can fire on both sides of a story flag uses conditional `desc = { trigger = { … } text = … }` blocks keyed on `zin_afrit_secret_kept` or `zin_eindil_known_by_name`, never on a country tag. Worshipdom-only variants use `zin_afrit_is_hub`. Localisation keys: public text `zin_<ns>.<id>.d`; Worshipdom variant `zin_<ns>.<id>.d_hub`; post-reveal variant `zin_<ns>.<id>.d_revealed`. The secret scan (acceptance) skips only `_hub` keys and `_revealed` keys. |
| C4 | **Open questions stay open.** No text states an answer the vault marks open (the King's name and kin, Merovan's fate, which arm Eindil loses, Volgan's spirit, Zol's administrator and servants, Dardan's place, the Gala and Sunhot relationship, Ein's sons' birth order, what the Necklace does). Gameplay outcomes that are not history say "in this telling of the age". |
| C5 | **Who fires what.** Events in mechanics-owned files may declare `trigger` and `mean_time_to_happen`. Every event in the story namespaces (`zin_reign`, `zin_lastwar`, `zin_ending`) and in `zin_lore` is `is_triggered_only = yes` and is fired by an effect: an owner's event or effect (listed in the file's dependency table), a focus, a decision, a hook scripted effect `zin_<ns>_on_<moment>`, or the **story runner** (C6). |
| C6 | **Modules and the story runner.** Each event namespace of this folder has one builder module `tools/content/modules/events_<namespace>.mjs` (`events_zin_reign.mjs`, `events_zin_lastwar.mjs`, `events_zin_ending.mjs`, `events_zin_lore.mjs`; one namespace, one event file) reading `tools/content/data/events/<namespace>.json` (or the data file its spec names). `zin_story_tick` (scripted effect, owned by this folder, file `common/scripted_effects/zin_story.txt`, written by `events_zin_reign.mjs`) runs once a month as step 9 of the world tick ([05_world_tension_and_endings.md](../03_gameplay/05_world_tension_and_endings.md)), after the path tick. It only calls the namespace blocks `zin_story_tick_reign`, `zin_story_tick_lastwar`, `zin_story_tick_ending` and `zin_story_tick_lore`; each block lives in `common/scripted_effects/zin_<ns>_story.txt`, written by that namespace's module. A block checks each dated or conditional story event of its namespace once a month, fires it with `country_event` or `news_event` (with `days` and `random_days` where a window is given) and sets the global flag `zin_story_done_<ns>_<id>` (`<ns>` without the `zin_` prefix; a yearly repeat appends `_<year>`) so it fires once. Per-country events set the country flag `zin_story_seen_<ns>_<id>`. A block whose module is not in the build is not called. |
| C7 | **Dates.** Dates are engine dates in 4A years at the standard pace (month 1 Deepwinter, 2 Ironfrost, 3 Thaw, 4 Rainwake, 5 Sowing, 6 Highsun, 7 Goldfield, 8 Harvest, 9 Fallowing, 10 Emberleaf, 11 Mistfall, 12 Longnight; start `1748.3.1.12`, [01_start_and_calendar.md](../00_foundation/01_start_and_calendar.md)). The builder writes three date sets for `zin_story_pace` 0.75, 1.0 and 1.5 (date *d* becomes start + (*d* − start) × pace) and the runner tests the set that matches the global variable, as the path spec does for checkpoints. Text writes dates as "4A 1750" and Erdae month names. |
| C8 | **AI.** The historical option of each choice is marked `hist` in the data. `ai_chance`: under `zin_rules_is_historical` 100 for `hist`, 0 for the others; under PLAUSIBLE (neither `zin_rules_is_historical` nor `zin_rules_is_free`) 75 / 25, and 60 / 40 once `zin_path_divergence` ≥ 50; under `zin_rules_is_free` the weights in each table. A rule never chooses for a human player. The historical option is written first, except as C9 says. |
| C9 | **Player protection and timeouts.** Story events never force a battle result, a state's control, a capitulation or a human's choice. Engine fact (1.19.3): an unanswered event takes its **first** option when its timeout runs out; without `timeout_days` the timeout is 13 days (Paradox wiki snapshot, *Event modding*, "Additional arguments"; vanilla uses the key in `events/MUN_Czechoslovakia.txt`; the installed documentation lists no event keys). So every event of this folder writes `timeout_days = 30`, and the builder writes options in table order. An event that a human may receive and whose choice resolves a path checkpoint carries the data field `checkpoint` (CP number); its first option is the one that leaves the checkpoint to its owner and its latest date (refuse, wait or nothing), and its `hist` option comes second with the same `ai_chance`. A timeout therefore never counts as acceptance. A build test fails if a `checkpoint` event's first option is `hist`. |
| C10 | **Pictures.** Every event names a picture key that exists in the game today (`tools/content/data/presentation-cells.json`: 43 event pictures `GFX_zin_evt_<key>`, 28 news pictures `GFX_zin_news_<key>`). Country events use `GFX_zin_evt_<key>`; news events use `GFX_zin_news_<key>`, and only keys in the news list. A gated key (gates in the cells file) is used only by events that cannot fire before its gate flag: the data lists each event's `requires` flags and a build test checks that the gate is among them. A picture an event wants that does not exist yet is listed in the file's "Requested pictures" table with the existing key used until it is generated; generation follows the [icon catalog](../05_focus_trees/02_icon_catalog.md). All art is image-generated. |
| C11 | **Text style.** Titles are title-cased. Descriptions are one to three short sentences (CONVENTIONS); a file that needs more says so as an explicit exception. Options are short quoted lines. Localisation is UTF-8 with BOM, Windows-1252 characters only; "Šodolôro" in game text (S11). |
| C12 | **Effects.** Mechanic variables change only through their owners' scripted effects (for example `zin_aenor_add_court_corruption`, `zin_afrit_add_veil`, `zin_world_add_gathering_dark`). Numbers are design targets. Every engine effect, trigger and modifier a file names exists in 1.19.3 (each file lists them). |

### Owners and namespaces in this chain

| Namespace | Owner | Ids used here |
| --- | --- | --- |
| `zin_aenor` | Aenor mechanic ([aenor_court_and_succession.md](../04_mechanics/aenor_court_and_succession.md)), ids 1–499 | 10–12, 20–22, 100, 151, 152, 200, 201, 210–216, 220, 240–242, 250, 260, 261, 300, 460 |
| `zin_afrit` | Afrit mechanic ([afrit_hidden_council.md](../04_mechanics/afrit_hidden_council.md)) | .10–.17, .20–.23, .32, .34, .40, .43, .45, .50, .53 |
| `zin_eindil` | Eindil's journey ([eindil_journey.md](../04_mechanics/eindil_journey.md)) | .82 *The Impostor*, the one warning event to Aenor's government (O4) |
| `zin_reign` | **this spec (new)** | 10–87 used (below); 1–9 and 88–99 free; 100–199 reserved for later reign flavour (phase 8) |
| `zin_lore` | [05_flavour_and_world.md](05_flavour_and_world.md) and [04_fourth_age_history_for_play.md](../02_lore/04_fourth_age_history_for_play.md) | .1 (Aenor opening), .2 (Worshipdom opening), .101–.104, .220, .221 |
| `zin_leren`, `zin_west`, `zin_elves`, `zin_east` | their mechanics | `zin_leren.40`, `.41`; `zin_west.15`; `zin_elves.9`; `zin_east` mourners (here as `zin_reign.21`) |

### The chain on the historical path

| When (proposed) | Beat | Events |
| --- | --- | --- |
| 1 Thaw 1748 | The opening; the Worshipdom reads the Council's ledger | `zin_lore.1` (Aenor), `zin_lore.2` and `.220` (Worshipdom) |
| Thaw 1748 – Mistfall 1750 | The gilded years: feasts, offices, the progress, the Lost Cause's parade, Mirolon's warning laughed at | `zin_reign.10`–`.17`, `zin_aenor.10`–`.22`, `.151`, `.152`, `zin_lore.101`–`.104` |
| Rainwake 1748 – Emberleaf 1750 | The plot, seen only by the Worshipdom | `zin_lore.221`, `zin_afrit.10`–`.15` |
| 1 Mistfall 1750 (±10 days) | The Mistfall feast; the King dies in his sleep | `zin_reign.19`, `zin_aenor.200` |
| Mistfall 1750 | Erdae hears: mourners, rumours, the funeral; dominions weigh their charters | `zin_reign.20`–`.26`, `zin_leren.40` |
| Mistfall – Longnight 1750 | The Thirty Days: four camps; dissenters silenced | `zin_aenor.201`, `zin_reign.30`–`.37`, `zin_aenor.215` |
| Longnight 1750 | The seals pass; Aurevan is crowned | `zin_aenor.210`, `zin_afrit.20`, `.21`, `zin_reign.40`–`.42`, `zin_leren.41`, `zin_west.15`, `zin_elves.9` |
| 4A 1751 | The first edict; dissenters; scholars question the genealogy; the Lost Cause's fate | `zin_afrit.22`, `zin_reign.43`–`.46` |
| 4A 1751 – 1755 | Parim under the Deliverer | `zin_reign.80`–`.84` |
| 4A 1753 | The King goes north; the Chancellor holds the seals; the King returns pale | `zin_reign.81`, `.82` |
| 4A 1754 | The stranger is denounced as an impostor | `zin_eindil.82`, `zin_reign.83`, `.84` |
| Thaw 1756 | The throne abandoned; the name is spoken at the flight east (D3); the Captains' Regency | `zin_afrit.50`, `.53`, `.43`, `.45`, `zin_aenor.300`, `zin_reign.85`–`.87` |

The War of the Last Crowns, Eindil's return and the coronation of Eindil continue in [03_war_of_the_last_crowns.md](03_war_of_the_last_crowns.md) and [04_endings.md](04_endings.md).

**"Aenor" as a recipient** means the ruling Aenor realm: the country with `zin_aenor_is_realm` that controls Parim (`zin_is_site_parim`), else the original Aenor country. "Every Concord dominion" means every country with `zin_aenor_is_concord_dominion`. "Every great power" means `is_major = yes`.

### Act I: The gilded years (4A 1748 to Mistfall 4A 1750)

The player must believe this is a realm-management game. Nothing here reveals the plot. The only hints are the King's health omens (`zin_aenor.240`) and, for the Worshipdom, its own private events.

#### Events seen by Aenor and the dominions

| Id | Title | To | Fired by | Hist. | Text gist | Options (effects; AI) |
| --- | --- | --- | --- | --- | --- | --- |
| `zin_reign.10` | The King's Nineteenth Year | Aenor | runner, 1 Rainwake 1748 | Rainwake 1748 | "Nineteen years ago the Golden King took the crown. The court asks how the anniversary should be kept." | **"A day of gold for Parim."** −50 PP; `zin_aenor_add_court_corruption` +3; timed idea `zin_reign_anniversary` (180 days: `stability_factor` +0.03, `consumer_goods_factor` +0.02) (hist; FREE 70). **"A day of prayer at the temples."** `zin_aenor_add_council_influence` +2; stability +0.02 (FREE 30) |
| `zin_reign.11` | The Gilded Progress | Aenor | runner, 1 Goldfield 1748 | Goldfield 1748 | "The King will tour his dominions. His treasurers ask which road the progress takes." | **"Through the rich lake cities."** −25 PP; corruption +2; every Concord dominion that owns no Great Lake port state (`zin_is_site_great_lake_ports`, generated from the key-sites row "The Great Lake ports" into `zin_sites.txt`): `zin_aenor_add_concord_loyalty` −2 (hist; FREE 60). **"To Selen first, as the Restorer did."** −50 PP; fires `zin_reign.12` to Selen (FREE 30). **"Send his portrait instead."** +25 PP; `zin_aenor_add_concord_loyalty_all` −1 (FREE 10) |
| `zin_reign.12` | The Progress Comes to Selen | Selen | option B of `.11` | — | "The King's gilded carriages roll into Selen. The First Warden must receive him." | **"Honour the King, as the Charters ask."** loyalty +8; Selen −25 PP (FREE 60). **"Honour the Restorer's memory, not this king."** loyalty −3; Selen stability +0.03; Aenor's opinion of Selen −5 (FREE 40) |
| `zin_reign.13` | A Portrait for the Hall of Kings | Aenor | runner, 1 Thaw 1749 | Thaw 1749 | "The court painter asks how much gold leaf the King's portrait may carry." | **"All of it."** corruption +2; +25 PP (hist; FREE 80). **"Paint him as he is."** corruption −1; stability −0.01 (FREE 20). Pure flavour of vanity |
| `zin_reign.14` | Muster Day of the Lost Cause | Aenor | runner, 1 Sowing 1749 | Sowing 1749 | "The league against the powers of the dark musters on the Field of Banners. Its frontier captains ask for pay, the court for a parade." Tooltip shows `zin_aenor_lost_cause`. | **"A parade for the King's league."** −50 PP; war support +0.02; `zin_aenor_add_lost_cause` −2 (hist; FREE 70). **"Pay the frontier companies."** −75 PP; `zin_aenor_add_lost_cause` +6; fires `zin_reign.15` (FREE 30) |
| `zin_reign.15` | Lord-Commander Tarec's Thanks | Aenor | option B of `.14`, 3 days | — | "Lord-Commander Tarec Belurith thanks the crown. His companies on the frontier have not been paid in a year." | **"See that it does not happen again."** stability +0.01. Flavour; makes `zin_tarec` visible as the frontier's voice |
| `zin_reign.16` | The Chancellor's Accounts | Aenor | runner, 1 Longnight 1748 and 1 Longnight 1749 (flags `zin_story_done_reign_16_1748`, `_1749`) | Longnight | Public text: "Chancellor Merovan presents the year's accounts. They balance, as they always do." Worshipdom-only line is not shown here (C3). | **"Thank the Chancellor."** council +2; +25 PP (hist; FREE 80). **"Ask for the ledgers of the temple houses."** −25 PP; council −2; country flag `zin_reign_asked_ledgers` (+10 to the Aenor spec's *Follow the Poisoner's Coin* success chance while the King lives; dependency) (FREE 20) |
| `zin_reign.17` | The Dominions Count Their Taxes | Aenor | runner monthly check: `zin_aenor_concord_avg` < 50, `zin_aenor_king_alive`, Aenor lacks the country flag `zin_story_seen_reign_17` (set for 365 days when it fires) | any | "Envoys of the dominions bring a petition about the King's new taxes." | **"The crown's needs come first."** +50 PP; `zin_aenor_add_concord_loyalty_all` −2 (hist; FREE 70). **"Remit a year's tax."** −75 PP; `zin_aenor_add_concord_loyalty_all` +4 (FREE 30) |
| `zin_aenor.10` | A Feast in the Golden Court | Aenor | mechanic MTTH | any | "Another feast in the gilded halls. Half the court is invited; the other half is offended." | As the Aenor spec |
| `zin_aenor.11` | Offices for Sale | Aenor | mechanic MTTH | any | "A merchant house offers gold for a judgeship in the lake cities." | As the Aenor spec |
| `zin_aenor.12` | A Scandal in the Gilded Halls | Aenor | mechanic (Gilded Rot) | any | "A minister bought his seat and the whole city knows it." | As the Aenor spec |
| `zin_aenor.20` | The Chancellor's Counsel | Aenor | mechanic (council dominant) | any | "Chancellor Merovan has already drafted the King's answer. He asks only for the seal." | As the Aenor spec. Text never says whose will the draft serves |
| `zin_aenor.21` | Gifts from the Houses | Aenor | mechanic | any | "The Houses of the First Light offer grain for the poor quarters of Parim." | As the Aenor spec |
| `zin_aenor.22` | The Temples Lose Favour | Aenor | mechanic (council ≤ 35) | possible | "The temples' friends at court are fewer this year." | As the Aenor spec |
| `zin_aenor.151` | Warnings from Mirolon | Aenor | mechanic, 1748–1750 | 1749 | "A Mirolonese envoy says the Dead Lands are arming. The court remembers 4A 1736 and laughs." | As the Aenor spec; historical: laugh |
| `zin_aenor.152` | Tales of Black Ships | Aenor | mechanic | any | "Fishermen tell of black hulls in the north. Nobody at court believes them." | As the Aenor spec |
| `zin_aenor.240` | The King's Physicians | Aenor | decision | any | Health in words: "sound", "tired" or "failing". Never a cause, never a name | One option; sets `zin_aenor_king_health` |
| `zin_lore.101`–`.104` | The Jubilee Remembered; The Price of a Seat; The Lost Cause Parades; A Joke at Court | Aenor | `zin_lore_schedule_flavour` | 1748 | As [04_fourth_age_history_for_play.md](../02_lore/04_fourth_age_history_for_play.md) | As there |

`zin_reign.16` and `.17` are the reign's only repeating beats. Together with the Aenor mechanic's MTTH events they give Aenor roughly one court event a month, never a war.

#### Events seen only by the Worshipdom

All are owned by the Afrit spec. Text may name Afrit (C1). Picture `council_chamber` (hub-only key).

| Id | Title | Fired by | Hist. | Text gist | Options |
| --- | --- | --- | --- | --- | --- |
| `zin_lore.220` | The Ledger of Kings | flavour scheduler | Thaw 1748 | The Council's own record of the Kingdom Behind the Throne, from the Deliverer's acclamation to the verdict of 4A 1746 | One option |
| `zin_lore.221` | The Decision of 4A 1746 | flavour scheduler | Rainwake 1748 | "Two years ago the Council judged the Golden King a liability. The preparations continue." | One option; hands over to `zin_afrit.10` |
| `zin_afrit.10` | The Council's Verdict | focus *Prayers for the King* | 1748 | Afrit hears Merovan, Ilvane the High Confessor and Corvel, Master of Couriers. The King's taxes anger the dominions; his league could become a rival seat of power | One option |
| `zin_afrit.11` | Choose the Instrument | focus *A Vigil for the King* | Longnight 1748 | "How shall the King leave us?" The three instruments of the Afrit spec | Physician (hist) / Hunt / Fever |
| `zin_afrit.12`, `.13` | A Taster Falls Ill; The Lost Cause Asks Questions | complications | possible | As the Afrit spec | As the Afrit spec |
| `zin_afrit.14` | The Plot Is Ready | plot 100 | 1750 | "Everything is in place. Only the night remains." | One option |
| `zin_afrit.15` | Choose the Night | *The Mistfall Vigil* or AI | Emberleaf 1750 | "The Mistfall feast is the King's favourite. He always sleeps late after it." | Checkpoint 05 (C9): Not this year / At Mistfall (hist) / At the First Chance / Stay the hand. As the Afrit spec |

#### The eve

| Id | Title | To | Fired by | Hist. | Text gist | Options |
| --- | --- | --- | --- | --- | --- | --- |
| `zin_reign.19` | The Mistfall Feast | Aenor; a variant with one option to every Concord dominion | The Aenor mechanic, at the moment the death falls due (death clock at 0, or the end of the delay after `zin_afrit_regicide_ready`): it fires `zin_reign.19` at once and `zin_aenor.200` with `days = 1` (dependency). Never once `zin_golden_king_plot_exposed` is set (the clock has stopped) | 1 Mistfall 1750 (−1 day) | "The Mistfall feast runs past midnight. The King laughs louder than anyone and leaves the hall last. The candles of the Golden Court burn until dawn." No omen, no hint. | **"Another feast, another year."** +10 PP (hist; FREE 100). Dominions: **"The King feasts; we pay."** nothing |

The eve exists so that, in hindsight, the player remembers the night. It must never state or imply the cause of what follows.

### Act II: The King is dead (Mistfall 4A 1750)

`zin_aenor.200` *The King Is Dead* is the pivot. Its effects belong to the Aenor spec (`zin_aenor_open_succession`). This spec fixes its text and adds the world's reactions.

| Id | Title | To | Fired by | Hist. | Text gist | Options |
| --- | --- | --- | --- | --- | --- | --- |
| `zin_aenor.200` | The King Is Dead | news, every country | 1 day after `zin_reign.19` | Mistfall 1750 | "The Golden King died in his sleep after the Mistfall feast. He reigned twenty-one years. The seals of Parim lie on an empty cushion." The text names no heir and no kin (C4; [OPEN_QUESTIONS.md](../OPEN_QUESTIONS.md) events 1). Picture `king_is_dead` (news crop) | Aenor: **"The bells of Parim toll."** Others: **"A king is dead in Parim."** |
| `zin_reign.20` | The Bells of Parim | Aenor | `zin_reign_on_king_dead`, 1 day | Mistfall 1750 | "Every bell in Parim tolls for a day. Chancellor Merovan seals the palace and sends riders to every dominion." Tooltip shows the four camps' starting support. | **"Let the court mourn."** stability +0.02. Hands over to `zin_aenor.201` |
| `zin_reign.21` | Mourners to Parim | every great power, every country with opinion of Aenor ≥ 25, every East Lands court (`zin_east_is_court`) with `zin_footholds` ≥ 2; never Lerendor (`zin_leren.40`), Volgan, his subjects, Zol, Yeldenne or a Concord dominion | `zin_reign_on_king_dead`, 7 days | Mistfall 1750 | "Parim's envoys bring word that the Golden King is dead. Our court must decide how to mourn a king it did not love." | **"Send a great embassy."** −25 PP; Aenor gets opinion modifier `zin_reign_mourned_king` toward us (+10, 3 years) (FREE 40, ×2 for East Lands courts: "eastern courts send mourners"). **"A letter of condolence."** nothing (hist; FREE 50). **"Say nothing."** Aenor's opinion of us −5 (FREE 10) |
| `zin_reign.22` | Talk in the Taverns | Aenor | `zin_reign_on_king_dead`, 14 days | Mistfall 1750 | "In the lake quarters people say the King was strong at supper and cold by dawn. Some say the gods took him for his greed. Some say worse, and lower their voices." Never names a suspect. | **"Hang the loudest tongues."** stability +0.02; `zin_aenor_add_council_influence` +2; `zin_world_add_gathering_dark` +0.5 (hist; FREE 60). **"Let them talk; they always do."** stability −0.01 (FREE 30). **"Ask the royal physicians what they saw."** only with the country flag `zin_aenor_royal_physicians`; `zin_aenor_add_lost_cause` +3 (FREE 10) |
| `zin_reign.23` | The King's Funeral | Aenor | `zin_reign_on_king_dead`, 10 days | Mistfall 1750 | "The Golden King goes to the vault of kings in a coffin of gilded oak. The court asks how great a funeral the treasury can bear." | **"The temples will lead the rites."** `zin_aenor_add_camp_support` faithful +5; council +2 (hist; FREE 50). **"Gold, as he would have wished."** −75 PP; `zin_aenor_add_camp_support` court +5 (FREE 50). **"A soldier's burial; the Lost Cause carries him."** `zin_aenor_add_camp_support` host +5 if `zin_aenor_host_available`, else dominions +3; `zin_aenor_add_lost_cause` +3 (FREE 0 under HISTORICAL; player choice) |
| `zin_reign.24` | Word Reaches the Dominions | every Concord dominion | `zin_reign_on_king_dead`, 5 days | Mistfall 1750 | "Riders from Parim: the King is dead. Our lord must choose words for the Concord Council and words for our own hall." | **"Grief for the crown."** loyalty +3 (AI at loyalty ≥ 50: 70). **"The Charters of Parim bind us to the crown, not to the court."** loyalty −3; Aenor `zin_aenor_add_camp_support` dominions +1 per dominion choosing it (AI at loyalty < 50: 70) |
| `zin_reign.25` | Selen Asks Who Rules | Aenor; the same text as a one-option event to every Concord dominion | `zin_reign_on_king_dead`, 12 days, if Selen passes `zin_aenor_is_concord_dominion` | Mistfall 1750 | "The First Warden of Selen asks the council a plain question: who holds the seals, and by what right?" | **"The council holds them until the crown is given."** council +3; Selen loyalty −5 (hist; FREE 70). **"The Concord shall be heard."** dominions +5; Selen loyalty +5 (FREE 30) |
| `zin_reign.26` | A Rival in the Gilded Halls | Aenor | `zin_reign_on_king_dead`, 15 days, if `zin_aenor_camp_court` ≥ 25 | Mistfall 1750 | "Prince Eronel of Arcedor, a cousin of an old collateral line of Aen, is seen everywhere in the Golden Court. Office-buyers fill his rooms." The text names no tie to the late King himself. | **"Watch the prince."** nothing (hist; FREE 70). **"Invite him to the council."** court +5; corruption +2 (FREE 30) |

`zin_reign_on_king_dead` (scripted effect, this spec) is called at the end of the Aenor spec's `zin_aenor_open_succession` (dependency; registered in the contract additions).

**Other mechanics' reaction events at this beat:** `zin_leren.40` *The Golden King Is Dead* (Lerendor); `zin_east` uses `zin_reign.21` for its "mourners" flavour; `zin_world` applies the meter's +8 for `zin_golden_king_dead`.

### Act III: The Thirty Days

After `zin_aenor.200`, `zin_aenor.201` *Whom Will You Follow?* asks Aenor's player (or AI) to back a camp. For thirty days the camps contend. On day 30, `zin_aenor.210` *The Seals of Parim* gives the crown to the chosen camp; every other camp at support ≥ 30 rises (`zin_aenor.211`–`.214`), and every camp below 30 is silenced (`zin_aenor.215`).

#### The camps' public names

| Camp | Name before the reveal | Name after | Text voice |
| --- | --- | --- | --- |
| Court | The Golden Court | The Golden Court | Office-buyers and merchant houses: order, gold, continuity "in the crown's name" |
| Dominions | The Free Dominions | The Free Dominions | Dominion lords: the Charters of Parim, lower taxes, the crown as first among equals |
| Faithful | The Deliverer's Faithful (`zin_loc_camp_faithful`) | Afrit's Supporters | Temples and councillors: "the god who has guarded Aenor since Elzon's fall" |
| Host | The Stranger's Host (`zin_loc_camp_host`, keyed on `zin_eindil_known_by_name`) | Eindil's Host | Frontier companies, scholars, commoners. Only exists when `zin_aenor_host_available`; on the historical path it does not exist in 4A 1750 |

#### Events of the Thirty Days

`zin_reign_on_thirty_days` (scripted effect, this spec), called from `zin_aenor.201`'s immediate block (dependency), fires `.30`–`.36` with the delays below; "day N" counts from `zin_aenor.201`.

| Id | Title | To | Fired by | Hist. | Text gist | Options (effects; AI) |
| --- | --- | --- | --- | --- | --- | --- |
| `zin_aenor.201` | Whom Will You Follow? | Aenor | 1 day after `zin_reign.20` | Mistfall 1750 | "The seals lie on an empty cushion. Four voices claim to speak for Aenor. Whom will you follow?" Tooltip lists each camp's support | Checkpoint 06 (C9): **"Let the council decide."** first (the camp with the highest support), then the Faithful (hist), then one option per other camp; Host only if available. Historical AI: the Faithful |
| `zin_reign.30` | The Golden Court Opens Its Purses | Aenor | day 3, if `zin_aenor_camp_court` ≥ 15 | Mistfall 1750 | "The office-buyers will not lose what they paid for. Gold flows to every captain in Parim." | **"Refuse it."** court −5 (hist under the Faithful; FREE 70). **"Take their gold."** +50 PP; court +5; corruption +3 (FREE: ruling camp Court 100, else 30) |
| `zin_reign.31` | The Temples Speak | Aenor; the public text as a one-option event to every Concord dominion | day 5 | Mistfall 1750 | Public: "From every temple of Parim the priests preach the same sermon: the Deliverer has guarded Aenor since Elzon's fall; let him guard it now." Worshipdom variant (`_hub`): the sermons are the Council's, written by the High Confessor. | **"Let the people hear them."** faithful +8; council +3 (hist; FREE 60). **"Order the sermons cut short."** faithful −5; stability −0.02; only if the ruling camp is not the Faithful (FREE 40) |
| `zin_reign.32` | The Charters Remembered | Aenor; each Concord dominion with loyalty < 50 | day 7 | Mistfall 1750 | "Lords of the dominions read the Charters of Parim aloud in their halls. The crown, they say, is a partner, not a master." | Aenor: **"The Charters are paper."** dominions +6; all loyalty −3 (hist; FREE 50). **"The Charters are honoured."** dominions +3; all loyalty +2 (FREE 50). Dominion: **"Stand with the other lords."** that dominion's loyalty −3 (FREE 60) / **"Wait for the crown."** loyalty +2 (FREE 40) |
| `zin_reign.33` | The Stranger's Name in the Streets | Aenor | day 7, only if `zin_aenor_host_available` | never hist. in 1750 | "Frontier men and scholars talk of a man of the First Men who warned of the dark. They want him crowned." | **"Let the Host be heard."** host +8 (FREE 60 if ruling camp Host, else 40). **"Disperse the gatherings."** host −8; stability +0.02 (FREE 40, or 60 if not Host) |
| `zin_reign.34` | Riot at the Gilded Gate | Aenor | random day 10–20 (`days = 10 random_days = 11`), if two camps are ≥ 30 when it fires | possible | "Liveried servants of the office-buyers and pilgrims from the temples fight at the Gilded Gate. Three are dead." | **"Call out the guard."** stability +0.02; the two strongest non-ruling camps −3 each (hist; FREE 70). **"Let the camps settle it."** stability −0.03; the strongest non-ruling camp +5 (FREE 30) |
| `zin_reign.35` | Captains Choose a Side | Aenor | day 20 | Longnight 1750 | "The captains of the Parim garrison ask the council a question no captain should ask: whose orders will they follow next month?" | **"The crown's, whoever wears it."** the ruling camp +5 (hist; FREE 100). **"The Lost Cause's."** only if not ruled by the Faithful: host (if available) or dominions +5; `zin_aenor_add_lost_cause` +3 (player choice; AI 0) |
| `zin_reign.36` | The Seals Are Counted | Aenor | day 25 | Longnight 1750 | "Five days remain. The council counts who stands where." Tooltip shows each camp's support and which will rise. | **"Let the thirtieth day come."** One option |
| `zin_aenor.210` | The Seals of Parim | Aenor; news to all | day 30 | Longnight 1750 | "The seals of Parim are given." Variant per ruling camp | As the Aenor spec |
| `zin_aenor.211`–`.214` | The Golden Court Rises; The Faithful Rise; The Host Rises; The Dominions Declare Themselves Free | news to all | risings | if a camp ≥ 30 | "Parim's [camp] will not accept the seals. [Breakaway] raises its own banners." | One option each |
| `zin_aenor.215` | The Dissenters Silenced | Aenor | camps under 30 | Longnight 1750 | "Those who would not accept the new order have been sent from Parim, or are quiet." Under the Faithful, this is the established silencing | One option |
| `zin_reign.37` | A Dominion Chooses Freedom | each dominion that secedes | fired by the Aenor spec's `zin_aenor_secede_dominion`, with `zin_aenor.220` (dependency) | 0–2 in hist. | "Our lord has torn up the charter. The Concord's banner comes down in our hall." | **"Free, and afraid."** stability −0.02, war support +0.03 |

**Historical outcome.** Court about 39, Faithful about 68, Dominions about 30, Host 0 at the death (Aenor spec numbers). The AI Faithful take *The Temples Speak*, refuse the Court's gold and use *Silence the Dissenters*. Nobody rises. Zero to two Defiant dominions secede. The seals pass to the Faithful on day 30.

`zin_aenor.210` also fires the other roads' first events (Act V) from its immediate block: `zin_reign.50` when the Court rules, `.55` when the Dominions rule, `.60` when the Host rules (dependency).

### Act IV: Aurevan's coronation (historical)

When the Faithful take the seals, `zin_aenor.210` calls the Afrit spec's `zin_afrit_crown_aurevan` (through `zin_afrit.20` on the hub's side). The world hears `zin_afrit.21`. `zin_reign_on_crowning` (scripted effect, this spec), called at the end of `zin_afrit_crown_aurevan` (dependency), fires `.40`–`.46` with the delays below.

| Id | Title | To | Fired by | Hist. | Text gist | Options (effects; AI) |
| --- | --- | --- | --- | --- | --- | --- |
| `zin_afrit.20` | The Seals Pass to the Deliverer | Worshipdom (private) | `zin_golden_king_dead`, plot not exposed | Longnight 1750 | "Merovan lays the seals before you. After seventeen centuries behind the throne, you may sit on it." | Checkpoint 06 (C9): Let the seals wait / Take the crown (hist) / Raise a pliant heir (/ Rule from Parim in person, human only). As the Afrit spec |
| `zin_afrit.21` | Aurevan, First of His Name | news, every country | `zin_afrit_crown_aurevan` | Longnight 1750 | "The King is dead. The council and the temples have laid the crown before [zin_loc_deliverer], who has guarded Aenor since the fall of Elzon. He is King of Aenor, First of His Name, and New God of Men." Picture `coronation` (news crop; the crowned figure seen from far behind) | One option |
| `zin_reign.40` | The Crown Laid Before the Deliverer | Aenor | `zin_reign_on_crowning`, 2 days | Longnight 1750 | "In the great temple of Parim the High Confessor lifts the crown. The people outside sing. Some commanders swear because they believe, some because they fear another war, and some say nothing at all." | **"Let all Parim celebrate."** −50 PP; stability +0.05; council +3 (hist; FREE 60). **"A solemn rite, no feast."** stability +0.02; corruption −2 (FREE 40) |
| `zin_reign.41` | Envoys to the Coronation | every great power and every country with opinion of Aenor ≥ 0 that is not a Concord dominion, Volgan, his subjects, Zol, Yeldenne, Lerendor (`zin_leren.41`), a West Lands country (`zin_west.15`) or a wall realm (`zin_elves.9`) | `zin_reign_on_crowning`, 7 days | Longnight 1750 | "Parim invites every crown to honour King [zin_loc_deliverer], the god who guards Aenor." | **"Send an envoy, no more."** nothing (hist; FREE 40). **"Send gifts to the god-king."** −25 PP; opinion of Aenor +15; `zin_afrit_add_footholds` +1 on ROOT (within cap) (FREE 50; Dominion government ×1.5; East Lands ×1.5). **"Our temples honour him; our court does not."** opinion −10 (FREE 10; Light ×2) |
| `zin_reign.42` | The Oath to King Aurevan | every Concord dominion | `zin_reign_on_crowning`, 10 days | Longnight 1750 | "The new king asks every dominion to swear to him as it swore to the crown. The temples of our land are full of people who already have." | **"Swear gladly."** loyalty +5; `zin_afrit_add_footholds` +1 (AI at loyalty ≥ 50: 70; hist except Selen). **"Swear by the Charters, not by the god."** nothing (FREE 25; Selen hist). **"Refuse the oath."** only Restless or Defiant: loyalty −15; if loyalty then < 25 the Aenor spec's `zin_aenor_secede_dominion` runs (AI at loyalty < 30: 50, else 5) |
| `zin_elves.9`, `zin_leren.41`, `zin_west.15` | The New King's Customs; Envoys of the New King; A God on Aenor's Throne | as their owners | crowning | Longnight 1750 | As their owners | As their owners |

#### The first year of the new reign (4A 1751)

| Id | Title | To | Fired by | Hist. | Text gist | Options (effects; AI) |
| --- | --- | --- | --- | --- | --- | --- |
| `zin_afrit.22` | Dissenters at Court | Worshipdom (private) | 30 days after `zin_afrit.21` | Deepwinter 1751 | "Some still ask questions: a judge, two lords of the lake cities, a captain of the Lost Cause." | Silence (hist) / Spare. As the Afrit spec |
| `zin_reign.43` | The First Edict | Aenor (only while `zin_afrit_rules_here`) | `zin_reign_on_crowning`, 60 days | Ironfrost 1751 | "King Aurevan's first edict will set the tone of the reign. The chancery has drafted three." | **"An Edict of Mercy."** the debts of the poor quarters remitted: −50 PP; stability +0.05; `zin_afrit_add_veil` +3 (hist; FREE 60). **"An Edict of the Temples."** the Houses of the First Light take the birth rolls of every dominion: council +5; every Concord dominion `zin_afrit_add_footholds` +1 (within cap); `zin_aenor_add_concord_loyalty_all` −2 (FREE 30). **"An Edict of Accounts."** offices sold by the late King are audited: corruption −8; court −10; +50 PP (FREE 10) |
| `zin_reign.44` | Scholars Question the Genealogy | Aenor | `zin_reign_on_crowning`, 120 days, if Aenor `has_character = zin_ilsabet` (the University of Parim's scholar of the First Men is still in Aenor) | Thaw 1751 | "Masters at the University of Parim ask an old question aloud: which line of Aen does the new king descend from? The rolls are silent." No answer is given. | **"Buy their silence with chairs and pensions."** −50 PP; `set_global_flag = zin_afrit_scholars_bought` (the Afrit spec's flag); `zin_afrit_add_veil` +2 (hist; FREE 60). **"Close the university for a season."** stability −0.02; council +3; `zin_world_add_gathering_dark` +1 (FREE 30). **"Let them debate; the god does not fear rolls."** `zin_afrit_add_veil` −3; `zin_aenor_add_lost_cause` +5; country flag `zin_reign_scholars_free` (Ilsabet may later gather proof, see [02](02_eindil_journey.md)) (FREE 10; a human player only while Aurevan rules) |
| `zin_reign.45` | What Is the Lost Cause For? | Aenor | `zin_reign_on_crowning`, 180 days | Sowing 1751 | "The league the Golden King founded has lost its founder. Its frontier captains ask whom they serve; its court branch asks for new banners." | **"Keep it as the King's ornament."** nothing; stays Ornament (hist; FREE 70). **"Fold it into the temple guard."** `zin_aenor_add_lost_cause` −10; council +5 (FREE 20). **"Let the frontier keep it."** `zin_aenor_add_lost_cause` +5; country flag `zin_reign_league_to_frontier` (the Aenor tree doubles the AI weight of *The Shield of the Concord*; dependency) (FREE 10). None of these closes the league's later fate |
| `zin_reign.46` | The Golden Court Changes Its Robes | Aenor | `zin_reign_on_crowning`, 240 days | Goldfield 1751 | "The office-buyers who backed the late King now buy candles for the temples. Some keep their seats; some do not." | **"Strip the worst of them."** corruption −6; court −10; stability −0.02 (hist; FREE 60). **"Let them keep what they bought."** corruption +3; court +5 (FREE 40) |

### Act V: The other roads

None of these is history. Their text says "in this telling" where it describes an outcome.

#### The Regency of Gold (Court rules)

| Id | Title | To | Fired by | Text gist | Options (effects; AI) |
| --- | --- | --- | --- | --- | --- |
| `zin_reign.50` | The Regency of the Golden Court | Aenor | `zin_aenor.210` when Court rules | "No king is named. The Regency rules in the crown's name, and the crown's name is good for business." | **"Gold keeps the peace."** corruption +5; +100 PP (FREE 70). **"The Regency will be honest."** corruption −5; court −5 (FREE 30) |
| `zin_reign.51` | The Temples Are Displeased | Aenor | `.50` + 60 days, if council ≥ 50 | "The High Confessor preaches that a crown without a king offends the god." | **"Endow the temples."** −75 PP; council +5; faithful −5 (FREE 60). **"The Regency answers to the Concord, not the temples."** faithful +5; council −5 (FREE 40) |
| `zin_reign.52` | Prince Eronel Asks for the Crown | Aenor | `.50` + 180 days | "Prince Eronel of Arcedor asks the Regency to crown him." | **"Crown the prince."** `recruit_character = zin_eronel`, `promote_character = zin_eronel` (leader trait `zin_trait_gilded_heir`); court +10; country flag `zin_reign_eronel_crowned` (FREE 50). **"The Regency is enough."** court −5 (FREE 50) |
| `zin_reign.53` | A Regency Without End | Aenor | runner, 1 Thaw 1754, if `zin_aenor_ruled_by_court` | "Three years on, the Regency still rules for a crown nobody wears." | **"So be it."** No effect; the Aenor spec sets `zin_aenor_regency_endures` itself if the Court still rules in 4A 1760 |

#### The Concord of Equals (Dominions rule)

| Id | Title | To | Fired by | Text gist | Options |
| --- | --- | --- | --- | --- | --- |
| `zin_reign.55` | The Speaker of the Concord | Aenor; a one-option variant to every Concord dominion | `zin_aenor.210` when Dominions rule | "The dominion lords elect a Speaker to hold the seals. Every charter is rewritten as a Free Charter." | **"The crown is first among equals."** stability −0.03 (the loyalty gain is the mechanic's) |
| `zin_reign.56` | The Temples Ask Their Place | Aenor | `.55` + 30 days | "The High Confessor asks what the Concord wants of the god's temples." | **"Keep the temples as they are."** stability +0.02 (FREE 60). **"The temples answer to each dominion."** council −10; `zin_afrit_add_veil` −3 (FREE 40) |
| `zin_reign.57` | A Concord Council Every Year | Aenor | `.55` + 365 days | "The Concord Council meets again, as it did in 4A 212." | One option; calls `zin_aenor_convene_concord_council` (fires `zin_aenor.100`) |

#### The Hailed King before his time (Host rules)

Only possible when `zin_aenor_host_available` at the death (for example under `zin_rule_golden_king_death = DELAYED` with an early journey). `zin_aenor.210` makes `zin_eindil` the Hailed King. Story events: `zin_reign.60` *The People's King* (Aenor, fired by `zin_aenor.210`: "He is hailed, not crowned. He asks for the Lost Cause, not a throne." One option: `zin_aenor_add_lost_cause` +10; sets `zin_lost_cause_with_eindil` through the Aenor spec's effect), and `zin_reign.61` *The Temples Do Not Kneel* (Aenor, `.60` + 30 days: "The temples will not bless a king without a house." **"Let them pray as they like."** council −5 / **"The temples serve the realm."** council −15, stability −0.05; never names Afrit before the reveal). The coronation itself still waits for the Aenor spec's `zin_aenor_eindil_can_be_crowned` ([04_endings.md](04_endings.md)).

#### The Kingdom Behind the Throne (a pliant heir)

When the Worshipdom chooses *Raise a pliant heir* in `zin_afrit.20`, the puppet heir is crowned and `zin_afrit.23` *A New King in Parim* is the public news. Proposed: the heir is **Prince Eronel of Arcedor** (`zin_eronel`), the court's candidate, because he is the only defined claimant; this names no relative of the Golden King ([OPEN_QUESTIONS.md](../OPEN_QUESTIONS.md) events 2). The crowning effect is `recruit_character` and `promote_character` on `zin_eronel` in Aenor plus country flag `zin_reign_eronel_crowned`, run by `zin_afrit.23`'s immediate block (the Afrit spec's `zin_afrit_raise_pliant_heir` fires it). Story events, fired from `zin_afrit.23`'s immediate block:

| Id | Title | To | Text gist | Options |
| --- | --- | --- | --- | --- |
| `zin_reign.65` | King Eronel | Aenor, 2 days after `zin_afrit.23` | "Prince Eronel is crowned with the temples' blessing. The Chancellor stands at his right hand." | **"Long live the King."** stability +0.03; council +5 |
| `zin_reign.66` | A King Who Signs | Aenor, `.65` + 180 days | "The new king signs everything the Chancellor brings him. The court calls it a gift for administration." | **"The realm runs smoothly."** +50 PP; council +3 |

#### The plot exposed and the King who survives

The Aenor spec owns the investigation (`zin_aenor.240`–`.242`), the exposure (`.250`), the Council's War (`.260`), the King enduring (`.261`) and the King and the Stranger (`.460`). The Afrit spec owns `zin_afrit.16` and the public `zin_afrit.17` *Treason in the Golden Court* ("servants of the temples" accused; no name). This spec adds:

| Id | Title | To | Fired by | Text gist | Options |
| --- | --- | --- | --- | --- | --- |
| `zin_reign.70` | The King Afraid | Aenor | `zin_aenor.250` + 3 days | "The Golden King has not slept since the proof was laid before him. He eats nothing his own tasters have not touched. For the first time in twenty years he asks the Lost Cause for guards." | **"Give him the frontier companies."** `zin_aenor_add_lost_cause` +10; `add_timed_idea` `zin_aenor_kings_tasters` 365 days (FREE 100) |
| `zin_reign.71` | The Temples Close Their Doors | Aenor | `zin_aenor.260`, when the Faithful rise | "Half the temples of Parim bar their doors to the King's men. The other half open them to the frightened." | **"The King is still the King."** war support +0.05 |
| `zin_reign.72` | The Golden King Rides Out | news, every country | runner monthly check: 60 days after `zin_aenor.260` (global flag set there by the hook below), the Golden King's Aenor still controls Parim and is at war with a Faithful breakaway | "In this telling of the age, the Golden King rides at the head of his league for the first time in his life." | One option |
| `zin_reign.73` | A King Who Lived | Aenor | `zin_aenor.261` | "The King lives. In this telling of the age, the Golden Court goes on, and so does its gold." | **"Long live the Golden King."** stability +0.05; corruption +5 |

`zin_aenor.260` sets the internal global flag `zin_reign_councils_war` when it fires `.71`, so the runner can time `.72`.

### Act VI: Parim under the Deliverer (4A 1751 to 1756)

| Id | Title | To | Fired by | Hist. | Text gist | Options (effects; AI) |
| --- | --- | --- | --- | --- | --- | --- |
| `zin_reign.80` | The God-King's City | Aenor while `zin_afrit_rules_here` | runner, 1 Thaw 1752 and 1 Thaw 1753 (yearly flags) | Thaw | "Parim has never been cleaner or quieter. The granaries are full. Fewer people ask questions in the taverns." Worshipdom variant (`_hub`): the quiet is the Couriers' Chapter's work. | **"Peace and order."** stability +0.02; council +2 (hist; FREE 100) |
| `zin_reign.81` | The King Withdraws to Pray | Aenor; a one-option variant to every Concord dominion | `zin_afrit.32` *The Northern Voyage*, which sets `zin_aurevan_went_north` (dependency), if Aurevan rules Aenor | 1753 | Public: "King Aurevan has withdrawn into retreat to pray for the realm. Chancellor Merovan holds the seals." The north, the sea and the castle are not named. | **"The Chancellor governs."** If the hub lacks `zin_worshipdom_merovan_charge`, the Afrit spec's stability −0.05 applies until the King returns |
| `zin_reign.82` | The King Returns Pale | Aenor | `zin_afrit.34` *Return from Yeldenne* (dependency), if Aurevan rules Aenor and `zin_afrit_secret_kept` | 1753 | "The King is back in Parim. He walks slowly and receives no one for a month. The temples say the god bears the realm's sorrows." | **"Pray for the King."** stability −0.02 (the Afrit spec's *The Deliverer Rests* also applies) |
| `zin_reign.83` | Talk of an Impostor | Aenor | `zin_afrit.40` option *Denounce him*, or the historical option of `zin_eindil.82` *The Impostor* (dependency), once (`zin_story_done_reign_83`) | 1754 | "The chancery warns every dominion: a foreign impostor claims the blood of Aen and speaks against the King." | **"Spread the warning."** every Concord dominion loyalty +1 (the owners have already set `zin_afrit_impostor_denounced` or `zin_aenor_eindil_denounced`) |
| `zin_reign.84` | The Dominions and the Impostor | every Concord dominion except Selen | `.83` + 30 days | 1754 | "Parim says the stranger is a liar. Our own captains say he talks sense." | **"Parim knows best."** loyalty +3 (hist; FREE 70). **"Let him speak in our halls."** loyalty −5; `zin_eindil_add_regard` +10 on ROOT; `zin_afrit_add_veil` −2 (FREE 30). Selen answers through the journey's *Alleria's Watch* instead |
| `zin_afrit.43` | The Name Behind the Deliverer | news, every country | `zin_afrit_reveal` | Thaw 1756 (at the flight east; earlier only if a player exposes the plot, D3) | "The name is spoken in Parim at last. The god the kingdom worshipped is Afrit, son of Ein, brother of the stranger." Picture `unmasking` (news crop) | One option |
| `zin_reign.85` | What Is Owed to a False God? | every Aenor realm | `zin_afrit_reveal`, 3 days (dependency) | Thaw 1756 | If Aurevan still rules this realm (`zin_afrit_rules_here`): "The court knows what its king is. Some lords leave Parim by night. Most stay, from faith or from fear." Otherwise: "The temples of Aenor stand accused." | Under Afrit's rule: **"The King is the King."** stability −0.05; council +5 (FREE 100). **"Let the lords who flee go."** every non-ruling camp +10; `zin_aenor.216` may follow (FREE 0; player choice). Otherwise: **"Close the Houses."** `zin_afrit_purge_houses` on ROOT (hist; FREE 80) / **"Watch them."** nothing (FREE 20) |
| `zin_afrit.45` | The Houses Under Suspicion | every Light country | reveal | Thaw 1756 | "The Houses of the First Light served the false god. Many who work in them did not know." | As the Afrit spec |

On the historical path the reveal comes inside `zin_afrit_flee_east`, after Aurevan has left Aenor, so `zin_reign.85` takes its "Otherwise" text. The "Under Afrit's rule" text appears only when a player exposed the plot while he reigned.

### Act VII: The abandoned throne (early 4A 1756)

| Id | Title | To | Fired by | Hist. | Text gist | Options |
| --- | --- | --- | --- | --- | --- | --- |
| `zin_afrit.50` | Aenor Cannot Hold | Worshipdom (private) | pressure or 1 Thaw 1756 | Thaw 1756 | "Western sails, northern oaths torn, the dead in the north, Volgan in the south, eastern banners. Aenor is lost to you. The East is not." | Checkpoint 17 (C9): Hold for now / Go east (hist) / Flee to the hermitage / Stand in Parim |
| `zin_afrit.53` | The Chancellor's Choice | Worshipdom (private) | flight | Thaw 1756 | "Merovan asks whether he follows you east or stays with the seals." Both offered; AI 50/50 because his fate is open | Follows / Stays |
| `zin_aenor.300` | The Throne Abandoned | Aenor | `zin_afrit_abandoned_aenor` (the flight east or to the hermitage) | 1756 | "The King has gone east. The Chancellor's chair is empty. The captains of the Lost Cause hold the seals." | As the Aenor spec |
| `zin_reign.86` | The Captains' Regency | Aenor | `zin_aenor.300` + 1 day, when the Captains' Regency takes power (dependency) | 1756 | "Lord-Commander Tarec and the frontier captains have taken the seals 'until a king returns'. Nobody asks which king." | **"Hold the walls."** war support +0.05; `zin_aenor_add_lost_cause` +5 (FREE 100). Hands over to [03](03_war_of_the_last_crowns.md) |
| `zin_reign.87` | Empty Temples in Parim | Aenor | `.86` + 14 days | 1756 | "Half the priests have gone east with their god. The other half pray for forgiveness. The poor still come for bread." | **"Feed them from the crown's stores."** −50 PP; stability +0.03 (hist; FREE 70). **"Close the temples."** `zin_afrit_purge_houses` on Aenor; stability −0.03 (FREE 30) |

`zin_reign.87` does not close what becomes of Afrit's former temples and innocent believers, which the vault leaves open: it describes only the first fortnight.

### Decisions recorded here (proposed, closing this spec's former open questions)

- **The funeral** (`zin_reign.23`): the temples lead the rites on the historical path; the Lost Cause carrying the coffin is a player choice (AI 0 under HISTORICAL), so the league's frontier branch is not shown a year before the reveal.
- **The scholars** (`zin_reign.44`): "buying their silence" is the historical option; it is the vault's silencing in its mildest form and keeps `zin_afrit_scholars_bought` meaningful for the journey spec.
- **The King's retreat** (`zin_reign.81`): the public hears only that the King withdrew to pray and that Merovan holds the seals; no place is named.
- **The seat of worship** (N10, N16): Parim's public high priest is Ilvane, the High Confessor of the Censer Chapter; no other title or character is used for the office.
- **The death rule** (N4, N15): the game rule is `zin_rule_golden_king_death` with the options `DYNAMIC`, `HISTORICAL`, `DELAYED` and `NO_AI_PLOT`; `zin_reign.19` fires one day before the scheduled death.

## Implementation

### Builder modules and files

No event module exists today; the only `events/` files are the builder's interim stubs (`events/zin_world.txt` with the hidden `zin_world.1`, written by `vanilla_removal.mjs`) and bridges, and every country still runs the interim "Long Peace" tree. New module **`tools/content/modules/events_zin_reign.mjs`**, called by `tools/content/build.mjs` after `buildPresentation` (it validates picture keys). It reads `tools/content/data/events/zin_reign.json` (new, proposed): one record per event (id, recipients rule, firing source, delay, window, runner date or condition, `requires` flags, picture key, `checkpoint` if any, text keys, options with effects, `hist` marker and FREE weights), and `tools/content/data/presentation-cells.json` for picture keys and gates. It writes, through the shared atomic rewrite engine (`tools/content/apply.mts`):

| Path | Content |
| --- | --- |
| `events/zin_reign.txt` | Namespace `zin_reign`; every event `is_triggered_only = yes`, `timeout_days = 30` |
| `localisation/english/zin_reign_l_english.yml` | All text (UTF-8 with BOM); public, `_hub` and `_revealed` variants as separate keys (C3) |
| `common/scripted_effects/zin_reign.txt` | Hooks `zin_reign_on_king_dead`, `zin_reign_on_thirty_days`, `zin_reign_on_crowning` |
| `common/scripted_effects/zin_reign_story.txt` | `zin_story_tick_reign`: runner checks for `.10`, `.11`, `.13`, `.14`, `.16`, `.17`, `.53`, `.72`, `.80` |
| `common/scripted_effects/zin_story.txt` | `zin_story_tick` (C6): calls `zin_story_tick_reign`, `_lastwar`, `_ending`, `_lore` for every namespace module present in the build |
| `common/opinion_modifiers/zin_reign.txt` | `zin_reign_mourned_king` (`value = 10`, `years = 3`, `decay = 1`) |
| `common/ideas/zin_reign.txt` | `zin_reign_anniversary` (`stability_factor` 0.03, `consumer_goods_factor` 0.02; used as a timed idea) |
| `common/scripted_localisation/zin_reign.txt` | `zin_loc_camp_faithful`, `zin_loc_camp_host` (two-face camp names) |

The texts of the owners' events (`zin_aenor.*`, `zin_afrit.*`) go into the owners' modules and localisation files; this spec only fixes their gist. `zin_story_tick` is called by the world tick (step 9; the world spec's module writes `common/on_actions/zin_world.txt`). Until that tick exists, the runner is written but not called, and the runner-dated events do not fire.

### Firing rules

- **Runner-dated events** (`zin_reign.10`, `.11`, `.13`, `.14`, `.16`, `.80`, `.53`) fire on their dates while their conditions hold: the Aenor realm exists, `zin_aenor_king_alive` (except `.53`, `.80`), not `zin_golden_king_plot_exposed`. If the condition fails on the date the event is skipped, not delayed (the runner sets the done flag anyway).
- **Chained events** fire from their parent's option or immediate block with `country_event = { id = … days = … }`.
- **Hooks.** Death-relative events (`.20`–`.26`) through `zin_reign_on_king_dead`; Thirty Days events (`.30`–`.36`) through `zin_reign_on_thirty_days`; crowning events (`.40`–`.46`) through `zin_reign_on_crowning`.
- **Recipients by rule** are evaluated when the event fires (`every_country` with the table's limit); countries that do not exist are skipped.

### Dependencies on owner specs

| Owner | Must do | For |
| --- | --- | --- |
| Aenor | When the death falls due, fire `zin_reign.19` one day before `zin_aenor.200` (N15) | `.19` |
| Aenor | Call `zin_reign_on_king_dead` at the end of `zin_aenor_open_succession`; `zin_reign_on_thirty_days` in `zin_aenor.201`'s immediate block | Acts II, III |
| Aenor | `zin_aenor.210`: fire `.50`, `.55` or `.60` by ruling camp; `zin_aenor_secede_dominion`: fire `.37`; `.250` → `.70` (3 days); `.260` → `.71` and set `zin_reign_councils_war`; `.261` → `.73`; `.300` → `.86` (1 day) | Acts III, V, VII |
| Aenor | Add `zin_reign_asked_ledgers` (+10) to *Follow the Poisoner's Coin* | `.16` |
| Afrit | Call `zin_reign_on_crowning` at the end of `zin_afrit_crown_aurevan`; `zin_afrit.21` carries the full title ("and New God of Men"); `zin_afrit.23` crowns Eronel and fires `.65`; `zin_afrit.32` fires `.81`; `zin_afrit.34` fires `.82`; `zin_afrit.40` *Denounce him* fires `.83`; `zin_afrit_reveal` fires `.85` (3 days) to every Aenor realm; `zin_afrit_scholars_bought` is the flag `.44` sets | Acts IV–VI |
| Eindil's journey | `zin_eindil.82` historical option (*Denounce and hunt*) fires `.83` | `.83` |
| Aenor tree | *The Shield of the Concord* AI weight ×2 with `zin_reign_league_to_frontier` | `.45` |
| World | Call `zin_story_tick` as step 9 of the monthly tick | C6 |

### Ids

| Range | Use |
| --- | --- |
| `zin_reign.1`–`.9` | Free |
| `.10`–`.19` | The gilded years and the eve |
| `.20`–`.29` | The death and the world's reaction |
| `.30`–`.39` | The Thirty Days |
| `.40`–`.49` | The coronation and the first year |
| `.50`–`.79` | The other roads |
| `.80`–`.99` | Parim under the Deliverer and the abandoned throne |
| `.100`–`.199` | Reserved for later reign flavour (phase 8) |

### Flags and variables (new, internal to this namespace)

| Name | Kind | Meaning |
| --- | --- | --- |
| `zin_story_done_reign_<id>` (and `_<id>_<year>` for `.16`, `.80`) | global flag | A once-only `zin_reign` event has fired |
| `zin_story_seen_reign_<id>` | country flag | A per-country `zin_reign` event has fired for this country (`.17`: timed 365 days) |
| `zin_reign_asked_ledgers` | country flag (Aenor) | Asked for the temple ledgers; +10 to *Follow the Poisoner's Coin* |
| `zin_reign_scholars_free` | country flag (Aenor) | The scholars were left free to debate |
| `zin_reign_league_to_frontier` | country flag (Aenor) | The Lost Cause was left to the frontier |
| `zin_reign_eronel_crowned` | country flag (Aenor) | Prince Eronel was crowned (Court road or pliant heir) |
| `zin_reign_councils_war` | global flag | `zin_aenor.260` fired with the Faithful rising; times `.72` |

### Pictures

Country events use `GFX_zin_evt_<key>`; `.72` is news and uses `GFX_zin_news_generic_war`.

| Events | Key | Gate |
| --- | --- | --- |
| `.10`, `.11`, `.13`, `.16`, `.26`, `.30`, `.46`, `.50`–`.53` | `golden_court` | — |
| `.19` | `court_feast` | — |
| `.12`, `.17`, `.24`, `.25`, `.32`, `.37`, `.42`, `.55`–`.57`, `.84` | `concord_council` | — |
| `.14`, `.15`, `.35`, `.45`, `.60`, `.61`, `.70`, `.86` | `lost_cause_triumph` | — (`crown_of_aen` is gated on `zin_eindil_crowned` and may not be used by `.60`, `.61`) |
| `.20`–`.23` | `king_is_dead` | `zin_golden_king_dead` |
| `.33`, `.34`, `.36` | `thirty_days` | `zin_golden_king_dead` |
| `.40`, `.41`, `.65` | `coronation` | `zin_golden_king_dead` |
| `.31`, `.81`, `.82` | `hermitage` (until `temple_parim_interior` exists) | — |
| `.80`, `.87` | `houses` (until `temple_parim_interior` exists) | — |
| `.43`, `.44`, `.66`, `.83` | `generic_court` | — |
| `.71`, `.73` | `generic_war` | — |
| `.85` | `unmasking` | `zin_afrit_revealed` |

**Requested pictures.**

| Key | Shows | Gate | Used by (now using) |
| --- | --- | --- | --- |
| `temple_parim_interior` (proposed key; already in the contract register) | A white temple nave in Parim with sun windows, no figure | — | `.31`, `.81`, `.82` (`hermitage`); `.80`, `.87` (`houses`) |

### Engine names used

Effects: `country_event` (`days`, `random_days`), `news_event`, `every_country`, `add_political_power`, `add_stability`, `add_war_support`, `add_timed_idea`, `add_opinion_modifier`, `set_country_flag`, `set_global_flag`, `recruit_character`, `promote_character`. Triggers: `has_global_flag`, `has_country_flag`, `has_character`, `is_major`, `has_opinion`, `has_government`, `is_ai`, `exists`, `check_variable`, `has_game_rule`. Modifiers: `stability_factor`, `consumer_goods_factor`. Event keys: `is_triggered_only`, `timeout_days`, `hidden`. All exist in 1.19.3 (effects, triggers and modifiers documentation; event keys in vanilla `events/`).

## AI

- Under `zin_rules_is_historical` every `zin_reign` choice takes the option marked hist above. Its effect on the camps keeps the Aenor spec's historical outcome: Faithful about 68, nobody rises.
- Under FREE the weights in the tables apply, scaled by the Aenor spec's camp: a ruling camp never takes an option that lowers its own support.
- AI dominions answer `zin_reign.24`, `.32` and `.42` by loyalty band (Steadfast and Loyal: the loyal options; Restless and Defiant: the others). Selen follows its hist line.
- AI foreign courts answer `zin_reign.21` and `.41` by opinion of Aenor and footholds; East Lands courts favour the great embassy and the gifts.
- No `zin_reign` event is a checkpoint choice (C9): checkpoints 05 and 06 are resolved by the Aenor and Afrit events (`zin_afrit.15`, `zin_afrit.20`, `zin_aenor.201`), which carry `checkpoint` and list their non-committal option first (decision E2).

## Acceptance

Build tests (`npm test` in `tools/`, new `tools/content/events.test.mjs`):

1. `events/zin_reign.txt` defines every id in the tables above exactly once, each `is_triggered_only = yes` with `timeout_days = 30`; every option has a localisation key with text and an `ai_chance`; no id outside 10–87 is used.
2. Every event's picture key is in `presentation-cells.json` (event list for country events, news list for `.72`); every gated key's gate is in that event's `requires` flags; no `checkpoint` event has `hist` as its first option.
3. Secret scan: no `zin_reign` localisation key other than `_hub` and `_revealed` keys contains "Afrit", "demon" or "Hidden Council"; every mention of the Deliverer's name goes through `[zin_loc_deliverer]`.
4. Phrase scan: no `zin_reign` text contains "poison", "murder", "Afrit killed", a personal name for the Golden King, or an heir or relative of his.
5. Every effect, trigger and modifier the module writes is in the 1.19.3 documentation; `hoi4.script_validate` reports no errors in the generated files.

Offline tools (G3) and the isolated Linux run (G4), once the calendar spec has moved the start to `1748.3.1.12`:

6. Day 1 (L3, as Aenor): no `zin_reign` event is pending or has fired; no `zin_story_done_reign_*` flag is set.
7. One in-game year as Aenor (to 1 Thaw 1749): `.10`, `.11` and `.16` fire on their dates (±1 day at pace 1.0); the error log shows no ZIN `zin_reign` errors (L8).
8. Historical observer run (L5): `.13`, `.14` and the second `.16` fire in 1749; `.19` fires exactly one day before `zin_aenor.200`; `zin_aenor.200` falls in Mistfall 1750; `.20`–`.25` fire within 15 days after it; `.30`–`.36` inside the thirty days; `zin_aurevan_crowned` is set within 31 days of the death; `.40`–`.42` within 10 days of it; no Aenor civil war starts; `.85` fires after `zin_afrit_revealed` and takes the "Otherwise" text.
9. Forced test: with `zin_golden_king_plot_exposed` set by console before the death, `.19`–`.46` never fire and `.70`, `.71` and `.73` follow the Council's War.
10. Forced test: with the Court forced as ruling camp (`zin_aenor.201` Court option by a player), `.50`–`.52` fire and `zin_aurevan_crowned` is never set.
11. `hoi4.event_inspect` shows every `zin_reign` event reachable from its firing source and none firing at the start.

## Open questions

Each proceeds on its proposal; both are listed in [OPEN_QUESTIONS.md](../OPEN_QUESTIONS.md) ("events").

1. Does the Golden King have an heir of his body (events 1)? Proposal: none is named and no text states one; `zin_aenor.200` says only that the seals lie on an empty cushion.
2. Is Prince Eronel of Arcedor acceptable as the Council's pliant heir (events 2)? Proposal: yes, because he is the only defined claimant and is no relative of the Golden King.
