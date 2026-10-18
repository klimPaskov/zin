# The Golden King and the Succession: Events

**Status:** Draft. **Priority:** 5. **Phase:** 5.

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
| The four-camp mechanism, the Thirty Days, the collective regencies, Prince Eronel of Arcedor, Hierarch Aubren, Master Ilsabet Vothrim, Lord-Commander Tarec Belurith | proposed | Aenor spec, [02_characters.md](../02_lore/02_characters.md) |
| Every event, title, text, option and number below | **proposed** | this spec |

**Kept open, and never closed by any text here:** the Golden King's personal name, relatives and heirs; how exactly he died (text says he "died in his sleep after the Mistfall feast" and nothing more); Merovan's true identity and his fate after Afrit's fall; whether the Lost Cause formally survives the final war; whether Afrit is truly a New God; the birth order of Ein's sons.

## Design

### Conventions for the event specs (all of 06_events)

These rules apply to every event in this folder. They restate the contract and the path spec in one place.

| # | Rule |
| --- | --- |
| C1 | **The secret.** Before `zin_afrit_revealed`, no text a non-Worshipdom country can read names Afrit, calls the Deliverer a demon, or says the Deliverer or his priests govern Aenor. The Deliverer's name is always written through `[zin_loc_deliverer]` ("Aurevan the Deliverer" while `zin_afrit_secret_kept`, "Afrit" after; the Worshipdom always sees "Afrit"). Any concept with a public and a true label uses its `zin_loc_<concept>` scripted localisation. |
| C2 | **The stranger.** Before `zin_eindil_named`, Eindil is written through `[zin_loc_eindil]` ("the Man from the Ice") or as "the stranger" / "the King Without a House". Before `zin_eindil_awake` no text mentions him at all. |
| C3 | **Two-face text.** An event that can fire on both sides of a story flag uses conditional `desc = { trigger = { … } text = … }` blocks keyed on `zin_afrit_secret_kept` or `zin_eindil_known_by_name`, never on a country tag. Worshipdom-only variants use `zin_afrit_is_hub`. |
| C4 | **Open questions stay open.** No text states an answer the vault marks open (the King's name and kin, Merovan's fate, which arm Eindil loses, Volgan's spirit, Zol's administrator and servants, Dardan's place, the Gala and Sunhot relationship, Ein's sons' birth order, what the Necklace does). Gameplay outcomes that are not history say "in this telling of the age". |
| C5 | **Who fires what.** Events in mechanics-owned files may declare `trigger` and `mean_time_to_happen`. Every event in the new story namespaces (`zin_reign`, `zin_lastwar`, `zin_ending`) and in `zin_lore` is fired by an effect: an owner's effect, a focus, a decision, or the **story runner** `zin_story_tick` (below). |
| C6 | **The story runner.** `zin_story_tick` (scripted effect, new) runs once a month as step 9 of the world tick ([05_world_tension_and_endings.md](../03_gameplay/05_world_tension_and_endings.md)). It checks each dated or conditional story event of this folder once, fires it with `country_event` or `news_event` (with `days` and `random_days` where a window is given), and sets the global flag `zin_story_done_<namespace>_<id>` so it fires once. Per-country events set the country flag `zin_story_seen_<namespace>_<id>`. |
| C7 | **Dates.** Dates are engine dates at the standard pace (month 1 Deepwinter … 12 Longnight). The builder writes pace-shifted date sets from `zin_story_pace`, as the path spec does for checkpoints. Text writes dates as "4A 1750" and Erdae month names. |
| C8 | **AI.** Every choice that matters to the historical path puts the historical option first. `ai_chance`: under `zin_rules_is_historical` 100 / 0; under PLAUSIBLE 75 / 25 (60 / 40 once `zin_path_divergence` ≥ 50); under FREE the weights in each table. A rule never chooses for a human player. |
| C9 | **Player protection.** Story events never force a battle result, a state's control or a human's choice. Where the path spec asks for `timeout_days = 30` on player choices, the implementer confirms in the Linux run which option the engine takes on timeout; if it takes the first, the timeout is not used and the path's latest date resolves the checkpoint instead. |
| C10 | **Pictures.** Every event names a picture key from the [icon catalog](../05_focus_trees/02_icon_catalog.md); news events use the news crop of the same key. A gated key is used only by events that cannot fire before its gate flag. Keys marked *proposed key* below are additions this folder asks the catalog to make; until they exist the builder uses the listed fallback. All art is image-generated. |
| C11 | **Text style.** Titles are title-cased. Descriptions are one to four short sentences. Options are short quoted lines. Windows-1252 only; "Šodolôro" in game text. |
| C12 | **Effects.** Mechanic variables change only through their owners' scripted effects (for example `zin_aenor_add_court_corruption`, `zin_afrit_add_veil`, `zin_world_add_gathering_dark`). Numbers are design targets. |

### Owners and namespaces in this chain

| Namespace | Owner | Ids used here |
| --- | --- | --- |
| `zin_aenor` | Aenor mechanic ([aenor_court_and_succession.md](../04_mechanics/aenor_court_and_succession.md)) | 1–499; this chain uses 2, 10–22, 100–103, 151, 152, 200–261, 300, 310, 460 |
| `zin_afrit` | Afrit mechanic ([afrit_hidden_council.md](../04_mechanics/afrit_hidden_council.md)) | .10–.23, .41–.45, .50–.53 |
| `zin_reign` | **this spec (new)** | 1–99 (below); 100–199 reserved for later reign flavour |
| `zin_lore` | [05_flavour_and_world.md](05_flavour_and_world.md) and [04_fourth_age_history_for_play.md](../02_lore/04_fourth_age_history_for_play.md) | 101–104, 220, 221 |
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
| 4A 1754 – 1756 | The name is spoken; Aenor's court answers | `zin_afrit.43`, `.45`, `zin_reign.85` |
| Early 4A 1756 | The throne abandoned; the Captains' Regency | `zin_afrit.50`, `.53`, `zin_aenor.300`, `zin_reign.86`, `.87` |

The War of the Last Crowns, Eindil's return and the coronation of Eindil continue in [03_war_of_the_last_crowns.md](03_war_of_the_last_crowns.md) and [04_endings.md](04_endings.md).

### Act I: The gilded years (4A 1748 to Mistfall 4A 1750)

The player must believe this is a realm-management game. Nothing here reveals the plot. The only hints are the King's health omens (`zin_aenor.240`) and, for the Worshipdom, its own private events.

#### Events seen by Aenor and the dominions

| Id | Title | To | Fired by | Hist. | Text gist | Options (effects; AI) |
| --- | --- | --- | --- | --- | --- | --- |
| `zin_reign.10` | The King's Nineteenth Year | Aenor | runner, 1 Rainwake 1748 | Rainwake 1748 | "Nineteen years ago the Golden King took the crown. The court asks how the anniversary should be kept." | **"A day of gold for Parim."** −50 PP; `zin_aenor_add_court_corruption` +3; timed idea `zin_reign_anniversary` (180 days: `stability_factor` +0.03, `consumer_goods_factor` +0.02) (AI 70, hist 100). **"A day of prayer at the temples."** `zin_aenor_add_council_influence` +2; stability +0.02 (AI 30) |
| `zin_reign.11` | The Gilded Progress | Aenor | runner, 1 Goldfield 1748 | Goldfield 1748 | "The King will tour his dominions. His treasurers ask which road the progress takes." | **"Through the rich lake cities."** −25 PP; corruption +2; every Concord dominion with no Great Lake state: `zin_aenor_add_concord_loyalty` −2 (AI 60, hist 100). **"To Selen first, as the Restorer did."** −50 PP; fires `zin_reign.12` to Selen (AI 30). **"Send his portrait instead."** +25 PP; every dominion loyalty −1 (AI 10) |
| `zin_reign.12` | The Progress Comes to Selen | Selen | option B of `.11` | — | "The King's gilded carriages roll into Selen. The First Warden must receive him." | **"Honour the King, as the Charters ask."** loyalty +8; Selen −25 PP (AI 60). **"Honour the Restorer's memory, not this king."** loyalty −3; Selen stability +0.03; Aenor opinion −5 (AI 40) |
| `zin_reign.13` | A Portrait for the Hall of Kings | Aenor | runner, 1 Thaw 1749 | Thaw 1749 | "The court painter asks how much gold leaf the King's portrait may carry." | **"All of it."** corruption +2; +25 PP (AI 80). **"Paint him as he is."** corruption −1; stability −0.01 (AI 20). Pure flavour of vanity |
| `zin_reign.14` | Muster Day of the Lost Cause | Aenor | runner, 1 Sowing 1749 | Sowing 1749 | "The league against the powers of the dark musters on the Field of Banners. Its frontier captains ask for pay, the court for a parade." Shows `zin_aenor_lost_cause`. | **"A parade for the King's league."** −50 PP; war support +0.02; `zin_aenor_add_lost_cause` −2 (AI 70, hist 100). **"Pay the frontier companies."** −75 PP; `zin_aenor_add_lost_cause` +6; fires `zin_reign.15` (AI 30) |
| `zin_reign.15` | Lord-Commander Tarec's Thanks | Aenor | option B of `.14` | — | "Lord-Commander Tarec Belurith thanks the crown. His companies on the frontier have not been paid in a year." | **"See that it does not happen again."** stability +0.01. Flavour; makes `zin_tarec` visible as the frontier's voice |
| `zin_reign.16` | The Chancellor's Accounts | Aenor | runner, 1 Longnight 1748 and 1 Longnight 1749 | Longnight | Public text: "Chancellor Merovan presents the year's accounts. They balance, as they always do." Worshipdom-only line is not shown here (C3). | **"Thank the Chancellor."** council +2; +25 PP (AI 80, hist 100). **"Ask for the ledgers of the temple houses."** −25 PP; council −2; country flag `zin_reign_asked_ledgers` (+10% to the Aenor spec's *Follow the Poisoner's Coin* success while the King lives) (AI 20) |
| `zin_reign.17` | The Dominions Count Their Taxes | Aenor | runner monthly check: average `zin_concord_loyalty` < 50, King alive, at most once a year | any | "Envoys of the dominions bring a petition about the King's new taxes." | **"The crown's needs come first."** +50 PP; every dominion loyalty −2 (AI 70). **"Remit a year's tax."** −75 PP; every dominion loyalty +4 (AI 30) |
| `zin_aenor.10` | A Feast in the Golden Court | Aenor | mechanic MTTH | any | "Another feast in the gilded halls. Half the court is invited; the other half is offended." | As the Aenor spec |
| `zin_aenor.11` | Offices for Sale | Aenor | mechanic MTTH | any | "A merchant house offers gold for a judgeship in the lake cities." | As the Aenor spec |
| `zin_aenor.12` | A Scandal in the Gilded Halls | Aenor | mechanic (Gilded Rot) | any | "A minister bought his seat and the whole city knows it." | As the Aenor spec |
| `zin_aenor.20` | The Chancellor's Counsel | Aenor | mechanic (council dominant) | any | "Chancellor Merovan has already drafted the King's answer. He asks only for the seal." | As the Aenor spec. Text never says whose will the draft serves |
| `zin_aenor.21` | Gifts from the Houses | Aenor | mechanic | any | "The Houses of the First Light offer grain for the poor quarters of Parim." | As the Aenor spec |
| `zin_aenor.151` | Warnings from Mirolon | Aenor | mechanic, 1748–1750 | 1749 | "A Mirolonese envoy says the Dead Lands are arming. The court remembers 4A 1736 and laughs." | As the Aenor spec; historical: laugh |
| `zin_aenor.152` | Tales of Black Ships | Aenor | mechanic | any | "Fishermen tell of black hulls in the north. Nobody at court believes them." | As the Aenor spec |
| `zin_aenor.240` | The King's Physicians | Aenor | decision | any | Health in words: "sound", "tired" or "failing". Never a cause, never a name | One option; sets `zin_aenor_king_health` |
| `zin_lore.101`–`.104` | The Jubilee Remembered; The Price of a Seat; The Lost Cause Parades; A Joke at Court | Aenor | `zin_lore_schedule_flavour` | 1748 | As [04_fourth_age_history_for_play.md](../02_lore/04_fourth_age_history_for_play.md) | As there |

`zin_reign.13`, `.16` and `.17` are the reign's only repeating beats. Together with the Aenor mechanic's MTTH events they give Aenor roughly one court event a month, never a war.

#### Events seen only by the Worshipdom

All are owned by the Afrit spec. Text may name Afrit (C1). Picture `council_chamber` (hub-only key).

| Id | Title | Fired by | Hist. | Text gist | Options |
| --- | --- | --- | --- | --- | --- |
| `zin_lore.220` | The Ledger of Kings | flavour scheduler | Thaw 1748 | The Council's own record of the Kingdom Behind the Throne, from the Deliverer's acclamation to the verdict of 4A 1746 | One option |
| `zin_lore.221` | The Decision of 4A 1746 | flavour scheduler | Rainwake 1748 | "Two years ago the Council judged the Golden King a liability. The preparations continue." | One option; hands over to `zin_afrit.10` |
| `zin_afrit.10` | The Council's Verdict | focus *Prayers for the King* | 1748 | Afrit hears Merovan, the High Confessor and the Master of Couriers. The King's taxes anger the dominions; his league could become a rival seat of power | One option |
| `zin_afrit.11` | Choose the Instrument | focus *A Vigil for the King* | Longnight 1748 | "How shall the King leave us?" The three instruments of the Afrit spec | Physician (hist) / Hunt / Fever |
| `zin_afrit.12`, `.13` | A Taster Falls Ill; The Lost Cause Asks Questions | complications | possible | As the Afrit spec | As the Afrit spec |
| `zin_afrit.14` | The Plot Is Ready | plot 100 | 1750 | "Everything is in place. Only the night remains." | One option |
| `zin_afrit.15` | Choose the Night | *The Mistfall Vigil* or AI | Emberleaf 1750 | "The Mistfall feast is the King's favourite. He always sleeps late after it." | At Mistfall (hist) / Tonight / Not this year / Stay the hand |

#### The eve

| Id | Title | To | Fired by | Hist. | Text gist | Options |
| --- | --- | --- | --- | --- | --- | --- |
| `zin_reign.19` | The Mistfall Feast | Aenor; news-lite variant (country event with no choices of weight) to every Concord dominion | the Aenor mechanic's clock tick when `zin_aenor_king_clock` ≤ 3, or 1 day after `zin_afrit_regicide_ready` if the clock is overridden by the plot; never if `zin_golden_king_plot_exposed` | 1 Mistfall 1750 (−1 day) | "The Mistfall feast runs past midnight. The King laughs louder than anyone and leaves the hall last. The candles of the Golden Court burn until dawn." No omen, no hint. | **"Another feast, another year."** +10 PP (AI 100). Dominions: **"The King feasts; we pay."** nothing |

The eve exists so that, in hindsight, the player remembers the night. It must never state or imply the cause of what follows.

### Act II: The King is dead (Mistfall 4A 1750)

`zin_aenor.200` *The King Is Dead* is the pivot. Its effects belong to the Aenor spec (`zin_aenor_open_succession`). This spec fixes its text and adds the world's reactions.

| Id | Title | To | Fired by | Hist. | Text gist | Options |
| --- | --- | --- | --- | --- | --- | --- |
| `zin_aenor.200` | The King Is Dead | news, every country | death clock / `zin_afrit_regicide_ready` + up to 30 days | Mistfall 1750 | "The Golden King died in his sleep after the Mistfall feast. He reigned twenty-one years. He leaves no heir of his body (if open question 4 of the start spec is settled otherwise, this line is removed), and the seals of Parim lie on an empty cushion." Picture `king_is_dead` | Aenor: **"The bells of Parim toll."** Others: **"A king is dead in Parim."** |
| `zin_reign.20` | The Bells of Parim | Aenor | 1 day after `zin_aenor.200` | Mistfall 1750 | "Every bell in Parim tolls for a day. Chancellor Merovan seals the palace and sends riders to every dominion." Shows the four camps' starting support. | **"Let the court mourn."** stability +0.02. Hands over to `zin_aenor.201` |
| `zin_reign.21` | Mourners to Parim | every great power, every country with opinion of Aenor ≥ 25, every East Lands court with `zin_footholds` ≥ 2; never Lerendor (`zin_leren.40`), Volgan, his subjects, Zol or Yeldenne | 7 days after `zin_aenor.200` | Mistfall 1750 | "Parim's envoys bring word that the Golden King is dead. Our court must decide how to mourn a king it did not love." | **"Send a great embassy."** −25 PP; opinion modifier `zin_reign_mourned_king` (+10 Aenor toward us, 3 years) (AI 40, ×2 for East Lands courts: "eastern courts send mourners"). **"A letter of condolence."** nothing (AI 50). **"Say nothing."** Aenor's opinion −5 (AI 10) |
| `zin_reign.22` | Talk in the Taverns | Aenor | 14 days after `zin_aenor.200` | Mistfall 1750 | "In the lake quarters people say the King was strong at supper and cold by dawn. Some say the gods took him for his greed. Some say worse, and lower their voices." Never names a suspect. | **"Hang the loudest tongues."** stability +0.02; `zin_aenor_add_council_influence` +2; `zin_world_add_gathering_dark` +0.5 (AI 60, hist 100). **"Let them talk; they always do."** stability −0.01 (AI 30). **"Ask the royal physicians what they saw."** only with `zin_aenor_royal_physicians`; `zin_aenor_add_lost_cause` +3; Worshipdom gets `zin_afrit.13` if the plot is still running (it never is after the death; then nothing) (AI 10) |
| `zin_reign.23` | The King's Funeral | Aenor | 10 days after `zin_aenor.200` | Mistfall 1750 | "The Golden King goes to the vault of kings in a coffin of gilded oak. The court asks how great a funeral the treasury can bear." | **"Gold, as he would have wished."** −75 PP; `zin_aenor_add_camp_support` court +5 (AI 50). **"The temples will lead the rites."** `zin_aenor_add_camp_support` faithful +5; council +2 (AI 50, hist 100). **"A soldier's burial; the Lost Cause carries him."** `zin_aenor_add_camp_support` host +5 if `zin_aenor_host_available`, else dominions +3; Lost Cause +3 (AI 0 hist) |
| `zin_reign.24` | Word Reaches the Dominions | every Concord dominion | 5 days after `zin_aenor.200` | Mistfall 1750 | "Riders from Parim: the King is dead. Our lord must choose words for the Concord Council and words for our own hall." | **"Grief for the crown."** loyalty +3 (AI loyalty ≥ 50: 70). **"The Charters of Parim bind us to the crown, not to the court."** loyalty −3; Aenor `zin_aenor_add_camp_support` dominions +1 per dominion choosing it (AI loyalty < 50: 70) |
| `zin_reign.25` | Selen Asks Who Rules | Aenor; text news to Concord dominions | 12 days after `zin_aenor.200`, if Selen is a Concord dominion | Mistfall 1750 | "The First Warden of Selen asks the council a plain question: who holds the seals, and by what right?" | **"The council holds them until the crown is given."** council +3; Selen loyalty −5 (AI 70, hist 100). **"The Concord shall be heard."** dominions +5; Selen loyalty +5 (AI 30) |
| `zin_reign.26` | A Rival in the Gilded Halls | Aenor | 15 days after `zin_aenor.200`, if `zin_aenor_camp_court` ≥ 25 | Mistfall 1750 | "Prince Eronel of Arcedor, a cousin of an old collateral line of Aen, is seen everywhere in the Golden Court. Office-buyers fill his rooms." The text names no tie to the late King himself. | **"Watch the prince."** nothing (AI 70). **"Invite him to the council."** court +5; corruption +2 (AI 30) |

**Other mechanics' reaction events at this beat:** `zin_leren.40` *The Golden King Is Dead* (Lerendor); `zin_east` uses `zin_reign.21` for its "mourners" flavour; `zin_world` applies the meter's +8 for `zin_golden_king_dead`.

### Act III: The Thirty Days

After `zin_aenor.200`, `zin_aenor.201` *Whom Will You Follow?* asks Aenor's player (or AI) to back a camp. For thirty days the camps contend. On day 30, `zin_aenor.210` *The Seals of Parim* gives the crown to the chosen camp; every other camp at support ≥ 30 rises (`zin_aenor.211`–`.214`), and every camp below 30 is silenced (`zin_aenor.215`).

#### The camps' public names

| Camp | Name before the reveal | Name after | Text voice |
| --- | --- | --- | --- |
| Court | The Golden Court | The Golden Court | Office-buyers and merchant houses: order, gold, continuity "in the crown's name" |
| Dominions | The Free Dominions | The Free Dominions | Dominion lords: the Charters of Parim, lower taxes, the crown as first among equals |
| Faithful | The Deliverer's Faithful (`zin_loc_camp_faithful`) | Afrit's Supporters | Temples and councillors: "the god who has guarded Aenor since Elzon's fall" |
| Host | The Stranger's Host (`zin_loc_camp_host`) | Eindil's Host | Frontier companies, scholars, commoners. Only exists when `zin_aenor_host_available`; on the historical path it does not exist in 4A 1750 |

#### Events of the Thirty Days

| Id | Title | To | Fired by | Hist. | Text gist | Options (effects; AI) |
| --- | --- | --- | --- | --- | --- | --- |
| `zin_aenor.201` | Whom Will You Follow? | Aenor | 1 day after `zin_reign.20` | Mistfall 1750 | "The seals lie on an empty cushion. Four voices claim to speak for Aenor. Whom will you follow?" Tooltip lists each camp's support | One option per camp; Host only if available. Historical AI: the Faithful |
| `zin_reign.30` | The Golden Court Opens Its Purses | Aenor | 3 days after `.201` if `zin_aenor_camp_court` ≥ 15 | Mistfall 1750 | "The office-buyers will not lose what they paid for. Gold flows to every captain in Parim." | **"Take their gold."** +50 PP; court +5; corruption +3 (AI: ruling camp Court 100, else 30). **"Refuse it."** court −5 (AI 70; hist under Faithful 100) |
| `zin_reign.31` | The Temples Speak | Aenor; text variant shown as news to every Concord dominion | 5 days after `.201` | Mistfall 1750 | Public: "From every temple of Parim the priests preach the same sermon: the Deliverer has guarded Aenor since Elzon's fall; let him guard it now." Worshipdom variant: the sermons are the Council's, written by the High Confessor. | **"Let the people hear them."** faithful +8; council +3 (AI 100 hist). **"Order the sermons cut short."** faithful −5; stability −0.02; only if the ruling camp is not the Faithful (AI 0 hist, 40 otherwise) |
| `zin_reign.32` | The Charters Remembered | Aenor; each Concord dominion with loyalty < 50 | 7 days after `.201` | Mistfall 1750 | "Lords of the dominions read the Charters of Parim aloud in their halls. The crown, they say, is a partner, not a master." | Aenor: **"The Charters are honoured."** dominions +3; all loyalty +2 (AI 50). **"The Charters are paper."** dominions +6; all loyalty −3 (AI 50, hist 100). Dominion: **"Stand with the other lords."** that dominion's loyalty −3 (AI 60) / **"Wait for the crown."** loyalty +2 (AI 40) |
| `zin_reign.33` | The Stranger's Name in the Streets | Aenor | 7 days after `.201`, only if `zin_aenor_host_available` | never hist. in 1750 | "Frontier men and scholars talk of a man of the First Men who warned of the dark. They want him crowned." | **"Let the Host be heard."** host +8 (AI 60 if ruling camp Host). **"Disperse the gatherings."** host −8; stability +0.02 (AI 40) |
| `zin_reign.34` | Riot at the Gilded Gate | Aenor | random day 10–20 of the Thirty Days, if two camps are ≥ 30 | possible | "Liveried servants of the office-buyers and pilgrims from the temples fight at the Gilded Gate. Three are dead." | **"Call out the guard."** stability +0.02; the two strongest non-ruling camps −3 each (AI 70). **"Let the camps settle it."** stability −0.03; the strongest non-ruling camp +5 (AI 30) |
| `zin_reign.35` | Captains Choose a Side | Aenor | day 20 of the Thirty Days | Longnight 1750 | "The captains of the Parim garrison ask the council a question no captain should ask: whose orders will they follow next month?" | **"The crown's, whoever wears it."** the ruling camp +5 (AI 100). **"The Lost Cause's."** only if not ruled by Faithful: host or dominions +5; Lost Cause +3 (AI 0 hist) |
| `zin_reign.36` | The Seals Are Counted | Aenor | day 25 | Longnight 1750 | Summary: "Five days remain. The council counts who stands where." Shows each camp's support and which will rise. | **"Let the thirtieth day come."** One option |
| `zin_aenor.210` | The Seals of Parim | Aenor; news to all | day 30 | Longnight 1750 | "The seals of Parim are given." Variant per ruling camp | As the Aenor spec |
| `zin_aenor.211`–`.214` | The Golden Court Rises; The Faithful Rise; The Host Rises; The Dominions Declare Themselves Free | news to all | risings | if a camp ≥ 30 | "Parim's [camp] will not accept the seals. [Breakaway] raises its own banners." | One option each |
| `zin_aenor.215` | The Dissenters Silenced | Aenor | camps under 30 | Longnight 1750 | "Those who would not accept the new order have been sent from Parim, or are quiet." Under the Faithful, this is the established silencing | One option |
| `zin_reign.37` | A Dominion Chooses Freedom | each dominion that secedes (`zin_aenor.220`) | after secession | 0–2 in hist. | "Our lord has torn up the charter. The Concord's banner comes down in our hall." | **"Free, and afraid."** stability −0.02, war support +0.03 |

**Historical outcome.** Court about 39, Faithful about 68, Dominions about 30, Host 0 at the death (Aenor spec numbers). The AI Faithful take *The Temples Speak*, refuse the Court's gold and use *Silence the Dissenters*. Nobody rises. Zero to two Defiant dominions secede. The seals pass to the Faithful on day 30.

### Act IV: Aurevan's coronation (historical)

When the Faithful take the seals, `zin_aenor.210` calls the Afrit spec's `zin_afrit_crown_aurevan` (through `zin_afrit.20` on the hub's side). The world hears `zin_afrit.21`.

| Id | Title | To | Fired by | Hist. | Text gist | Options (effects; AI) |
| --- | --- | --- | --- | --- | --- | --- |
| `zin_afrit.20` | The Seals Pass to the Deliverer | Worshipdom (private) | `zin_golden_king_dead`, plot not exposed | Longnight 1750 | "Merovan lays the seals before you. After seventeen centuries behind the throne, you may sit on it." | Take the crown (hist) / Raise a pliant heir (/ Rule from Parim in person, human only). As the Afrit spec |
| `zin_afrit.21` | Aurevan, First of His Name | news, every country | `zin_afrit_crown_aurevan` | Longnight 1750 | "The King is dead. The council and the temples have laid the crown before `[zin_loc_deliverer]`, who has guarded Aenor since the fall of Elzon. He is King of Aenor, First of His Name, and New God of Men." Picture `coronation` (the crowned figure seen from far behind) | One option |
| `zin_reign.40` | The Crown Laid Before the Deliverer | Aenor | 2 days after `zin_aurevan_crowned` | Longnight 1750 | "In the great temple of Parim the Hierarch lifts the crown. The people outside sing. Some commanders swear because they believe, some because they fear another war, and some say nothing at all." | **"Let all Parim celebrate."** −50 PP; stability +0.05; council +3 (AI 100 hist). **"A solemn rite, no feast."** stability +0.02; corruption −2 (AI 0 hist, 40 free) |
| `zin_reign.41` | Envoys to the Coronation | every great power and every country with opinion of Aenor ≥ 0 that is not a Concord dominion, Volgan, his subjects, Zol, Yeldenne, Lerendor (`zin_leren.41`), a West Lands country (`zin_west.15`) or a wall realm (`zin_elves.9`) | 7 days after `zin_aurevan_crowned` | Longnight 1750 | "Parim invites every crown to honour King Aurevan, the god who guards Aenor." (Through `[zin_loc_deliverer]`.) | **"Send gifts to the god-king."** −25 PP; opinion of Aenor +15; `zin_afrit_add_footholds` +1 on ROOT (within cap) (AI 50; Dominion ×1.5; East Lands ×1.5). **"Send an envoy, no more."** nothing (AI 40). **"Our temples honour him; our court does not."** opinion −10 (AI 10; Light ×2) |
| `zin_reign.42` | The Oath to King Aurevan | every Concord dominion | 10 days after `zin_aurevan_crowned` | Longnight 1750 | "The new king asks every dominion to swear to him as it swore to the crown. The temples of our land are full of people who already have." | **"Swear gladly."** loyalty +5; `zin_afrit_add_footholds` +1 (AI loyalty ≥ 50: 70). **"Swear by the Charters, not by the god."** nothing (AI 25). **"Refuse the oath."** only Restless or Defiant: loyalty −15; if loyalty then < 25 the Aenor spec's `zin_aenor_secede_dominion` runs (AI loyalty < 30: 50, else 5; Selen hist: swear by the Charters) |
| `zin_elves.9`, `zin_leren.41`, `zin_west.15` | The New King's Customs; Envoys of the New King; A God on Aenor's Throne | as their owners | crowning | Longnight 1750 | As their owners | As their owners |

#### The first year of the new reign (4A 1751)

| Id | Title | To | Fired by | Hist. | Text gist | Options (effects; AI) |
| --- | --- | --- | --- | --- | --- | --- |
| `zin_afrit.22` | Dissenters at Court | Worshipdom (private) | 30 days after `zin_afrit.21` | Deepwinter 1751 | "Some still ask questions: a judge, two lords of the lake cities, a captain of the Lost Cause." | Silence (hist) / Spare. As the Afrit spec |
| `zin_reign.43` | The First Edict | Aenor (only while `zin_afrit_rules_here`) | 60 days after `zin_aurevan_crowned` | Ironfrost 1751 | "King Aurevan's first edict will set the tone of the reign. The chancery has drafted three." | **"An Edict of Mercy."** the debts of the poor quarters remitted: −50 PP; stability +0.05; `zin_afrit_add_veil` +3 (AI 60, hist 100). **"An Edict of the Temples."** the Houses of the First Light take the birth rolls of every dominion: council +5; every dominion `zin_afrit_add_footholds` +1 (cap); dominions loyalty −2 (AI 30). **"An Edict of Accounts."** offices sold by the late King are audited: corruption −8; court −10; +50 PP (AI 10) |
| `zin_reign.44` | Scholars Question the Genealogy | Aenor | 120 days after `zin_aurevan_crowned`, if `zin_ilsabet` exists or any Concord dominion has a university state | Thaw 1751 | "Masters at the University of Parim ask an old question aloud: which line of Aen does the new king descend from? The rolls are silent." No answer is given. | **"Buy their silence with chairs and pensions."** −50 PP; calls the Afrit spec to set `zin_afrit_scholars_bought` (dependency); `zin_afrit_add_veil` +2 (AI 60, hist 100). **"Close the university for a season."** stability −0.02; council +3; `zin_world_add_gathering_dark` +1 (AI 30). **"Let them debate; the god does not fear rolls."** `zin_afrit_add_veil` −3; `zin_aenor_add_lost_cause` +5; flag `zin_reign_scholars_free` (Ilsabet may later gather proof, see [02](02_eindil_journey.md)) (AI 10; player only under Aurevan) |
| `zin_reign.45` | What Is the Lost Cause For? | Aenor | 180 days after `zin_aurevan_crowned` | Sowing 1751 | "The league the Golden King founded has lost its founder. Its frontier captains ask whom they serve; its court branch asks for new banners." | **"Keep it as the King's ornament."** nothing; stays Ornament (AI 70, hist 100). **"Fold it into the temple guard."** Lost Cause −10; council +5 (AI 20). **"Let the frontier keep it."** Lost Cause +5; country flag `zin_reign_league_to_frontier` (raises the AI weight of the Aenor tree's *The Shield of the Concord* ×2) (AI 10). None of these closes the league's later fate |
| `zin_reign.46` | The Golden Court Changes Its Robes | Aenor | 240 days after `zin_aurevan_crowned` | Goldfield 1751 | "The office-buyers who backed the late King now buy candles for the temples. Some keep their seats; some do not." | **"Let them keep what they bought."** corruption +3; court +5 (AI 40). **"Strip the worst of them."** corruption −6; court −10; stability −0.02 (AI 60, hist 100) |

### Act V: The other roads

None of these is history. Their text says "in this telling" where it describes an outcome.

#### The Regency of Gold (Court rules)

| Id | Title | To | Fired by | Text gist | Options (effects; AI) |
| --- | --- | --- | --- | --- | --- |
| `zin_reign.50` | The Regency of the Golden Court | Aenor | `zin_aenor.210` when Court rules | "No king is named. The Regency rules in the crown's name, and the crown's name is good for business." | **"Gold keeps the peace."** corruption +5; +100 PP (AI 70). **"The Regency will be honest."** corruption −5; court −5 (AI 30) |
| `zin_reign.51` | The Temples Are Displeased | Aenor | 60 days after `.50`, if council ≥ 50 | "The Hierarch preaches that a crown without a king offends the god." | **"Endow the temples."** −75 PP; council +5; faithful −5 (AI 60). **"The Regency answers to the Concord, not the temples."** faithful +5; council −5 (AI 40) |
| `zin_reign.52` | Prince Eronel Asks for the Crown | Aenor | 180 days after `.50`, if `zin_eronel` exists | "Prince Eronel of Arcedor asks the Regency to crown him." | **"Crown the prince."** `zin_eronel` becomes country leader with `zin_trait_gilded_heir`; court +10; country flag `zin_reign_eronel_crowned` (AI 50). **"The Regency is enough."** court −5 (AI 50) |
| `zin_reign.53` | A Regency Without End | Aenor | 1 Thaw 1754 if Court still rules | "Three years on, the Regency still rules for a crown nobody wears." | **"So be it."** sets the Aenor spec's `zin_aenor_regency_endures` path toward the proposed outcome |

#### The Concord of Equals (Dominions rule)

| Id | Title | To | Fired by | Text gist | Options |
| --- | --- | --- | --- | --- | --- |
| `zin_reign.55` | The Speaker of the Concord | Aenor; news to dominions | `zin_aenor.210` when Dominions rule | "The dominion lords elect a Speaker to hold the seals. Every charter is rewritten as a Free Charter." | **"The crown is first among equals."** stability −0.03; every dominion loyalty +5 (already applied by the mechanic) |
| `zin_reign.56` | The Temples Ask Their Place | Aenor | 30 days after `.55` | "The Hierarch asks what the Concord wants of the god's temples." | **"Keep the temples as they are."** stability +0.02 (AI 60). **"The temples answer to each dominion."** council −10; `zin_afrit_add_veil` −3 (the Council loses its grip and must work harder) (AI 40) |
| `zin_reign.57` | A Concord Council Every Year | Aenor | 365 days after `.55` | "The Concord Council meets again, as it did in 4A 212." Fires the Aenor spec's `zin_aenor.100` | As `zin_aenor.100` |

#### The Hailed King before his time (Host rules)

Only possible when `zin_aenor_host_available` at the death (for example under `zin_rule_golden_king_death = late` with an early journey). `zin_aenor.210` makes `zin_eindil` the Hailed King. Story events: `zin_reign.60` *The People's King* (Aenor: "He is hailed, not crowned. He asks for the Lost Cause, not a throne." One option: Lost Cause +10, sets `zin_lost_cause_with_eindil` through the Aenor spec's effect), and `zin_reign.61` *The Temples Do Not Kneel* (Aenor, 30 days later: "The temples will not bless a king without a house." **"Let them pray as they like."** council −5 / **"The temples serve the realm."** council −15, stability −0.05; never names Afrit before the reveal). The coronation itself still waits for the Aenor spec's `zin_aenor_eindil_can_be_crowned` ([04_endings.md](04_endings.md)).

#### The Kingdom Behind the Throne (a pliant heir)

When the Worshipdom chooses *Raise a pliant heir* in `zin_afrit.20`, the Aenor spec crowns a puppet heir and `zin_afrit.23` *A New King in Parim* is the public news. Proposed: the heir is **Prince Eronel of Arcedor** (`zin_eronel`), the court's candidate, because he is the only defined claimant; this names no relative of the Golden King. Story events:

| Id | Title | To | Text gist | Options |
| --- | --- | --- | --- | --- |
| `zin_reign.65` | King Eronel | Aenor | "Prince Eronel is crowned with the temples' blessing. The Chancellor stands at his right hand." | **"Long live the King."** stability +0.03; council +5 |
| `zin_reign.66` | A King Who Signs | Aenor | 180 days later: "The new king signs everything the Chancellor brings him. The court calls it a gift for administration." | **"The realm runs smoothly."** +50 PP; council +3 |

#### The plot exposed and the King who survives

The Aenor spec owns the investigation (`zin_aenor.240`–`.242`), the exposure (`.250`), the Council's War (`.260`), the King enduring (`.261`) and the King and the Stranger (`.460`). The Afrit spec owns `zin_afrit.16` and the public `zin_afrit.17` *Treason in the Golden Court* ("servants of the temples" accused; no name). This spec adds:

| Id | Title | To | Fired by | Text gist | Options |
| --- | --- | --- | --- | --- | --- |
| `zin_reign.70` | The King Afraid | Aenor | 3 days after `zin_aenor.250` | "The Golden King has not slept since the proof was laid before him. He eats nothing his own tasters have not touched. For the first time in twenty years he asks the Lost Cause for guards." | **"Give him the frontier companies."** Lost Cause +10; spirit `zin_aenor_kings_tasters` renewed 365 days (AI 100). |
| `zin_reign.71` | The Temples Close Their Doors | Aenor | with `zin_aenor.260` if the Faithful rise | "Half the temples of Parim bar their doors to the King's men. The other half open them to the frightened." | **"The King is still the King."** war support +0.05 |
| `zin_reign.72` | The Golden King Rides Out | news, every country | when the King's side wins a battle in the Council's War (first time) | "In this telling, the Golden King rides at the head of his league for the first time in his life." | One option |
| `zin_reign.73` | A King Who Lived | Aenor | with `zin_aenor.261` | "The King lives. In this telling of the age, the Golden Court goes on, and so does its gold." | **"Long live the Golden King."** stability +0.05; corruption +5 |

### Act VI: Parim under the Deliverer (4A 1751 to 1756)

| Id | Title | To | Fired by | Hist. | Text gist | Options (effects; AI) |
| --- | --- | --- | --- | --- | --- | --- |
| `zin_reign.80` | The God-King's City | Aenor while `zin_afrit_rules_here` | runner, 1 Thaw 1752 and 1 Thaw 1753 | Thaw | "Parim has never been cleaner or quieter. The granaries are full. Fewer people ask questions in the taverns." | **"Peace and order."** stability +0.02; council +2 (AI 100). Two-face line for the Worshipdom: the quiet is the Seat of Whispers' work |
| `zin_reign.81` | The King Withdraws to Pray | Aenor; news-lite to Concord dominions | `zin_aurevan_went_north` (journey/Glo) | 1753 | Public: "King Aurevan has gone into retreat beyond the sea to pray for the realm. Chancellor Merovan holds the seals." The north and the castle are not named. | **"The Chancellor governs."** if the hub lacks `zin_worshipdom_merovan_charge`, stability −0.05 until the King returns (the Afrit spec's rule) |
| `zin_reign.82` | The King Returns Pale | Aenor | `zin_afrit_wound` | 1753 | "The King is back in Parim. He walks slowly and receives no one for a month. The temples say the god bears the realm's sorrows." | **"Pray for the King."** stability −0.02 (the Afrit spec's *The Deliverer Rests* applies). After the reveal this event cannot fire |
| `zin_reign.83` | Talk of an Impostor | Aenor | `zin_afrit.40` option *Denounce him*, or the journey's `zin_eindil.82` historical option | 1754 | "The chancery warns every dominion: a foreign impostor claims the blood of Aen and speaks against the King." | **"Spread the warning."** flag already set by the owner; every Concord dominion loyalty +1 (AI 100 hist) |
| `zin_reign.84` | The Dominions and the Impostor | every Concord dominion | 30 days after `.83` | 1754 | "Parim says the stranger is a liar. Our own captains say he talks sense." | **"Parim knows best."** loyalty +3 (AI 70; Selen 0 hist). **"Let him speak in our halls."** loyalty −5; `zin_eindil_add_regard` +10 on ROOT; `zin_afrit_add_veil` −2 (AI 30; Selen hist: this option is replaced by the journey's *Alleria's Watch*, so Selen gets no `.84`) |
| `zin_afrit.43` | The Name Behind the Deliverer | news, every country | `zin_afrit_reveal` | 1754–1756 | "The name is spoken in Parim at last. The god the kingdom worshipped is Afrit, son of Ein, brother of the stranger." Picture `unmasking` | One option |
| `zin_reign.85` | What Is Owed to a False God? | Aenor | 3 days after `zin_afrit_revealed` | 1754–1756 | If Aurevan rules Aenor: "The court knows what its king is. Some lords leave Parim by night. Most stay, from faith or from fear." Otherwise: "The temples of Aenor stand accused." | Under Afrit's rule: **"The King is the King."** stability −0.05; council +5 (AI 100). **"Let the lords who flee go."** every non-ruling camp +10; `zin_aenor.216` may follow (AI 0 hist). Otherwise: **"Close the Houses."** calls `zin_afrit_purge_houses` on ROOT (AI 80) / **"Watch them."** nothing |
| `zin_afrit.45` | The Houses Under Suspicion | every Light country | reveal | 1754–1756 | "The Houses of the First Light served the false god. Many who work in them did not know." | As the Afrit spec |

### Act VII: The abandoned throne (early 4A 1756)

| Id | Title | To | Fired by | Hist. | Text gist | Options |
| --- | --- | --- | --- | --- | --- | --- |
| `zin_afrit.50` | Aenor Cannot Hold | Worshipdom (private) | pressure or 1 Thaw 1756 | Thaw 1756 | "Western sails, northern oaths torn, the dead in the north, Volgan in the south, eastern banners. Aenor is lost to you. The East is not." | Go east (hist) / Flee to the hermitage / Stand in Parim |
| `zin_afrit.53` | The Chancellor's Choice | Worshipdom (private) | flight | Thaw 1756 | "Merovan asks whether he follows you east or stays with the seals." Both offered; AI 50/50 because his fate is open | Follows / Stays |
| `zin_aenor.300` | The Throne Abandoned | Aenor | `zin_afrit_king_of_east` | 1756 | "The King has gone east. The Chancellor's chair is empty. The captains of the Lost Cause hold the seals." | As the Aenor spec |
| `zin_reign.86` | The Captains' Regency | Aenor | 1 day after `zin_aenor.300` when the Captains' Regency takes power | 1756 | "Lord-Commander Tarec and the frontier captains have taken the seals 'until a king returns'. Nobody asks which king." | **"Hold the walls."** war support +0.05; Lost Cause +5 (AI 100). Hands over to [03](03_war_of_the_last_crowns.md) |
| `zin_reign.87` | Empty Temples in Parim | Aenor | 14 days after `.86` | 1756 | "Half the priests have gone east with their god. The other half pray for forgiveness. The poor still come for bread." | **"Feed them from the crown's stores."** −50 PP; stability +0.03 (AI 70). **"Close the temples."** `zin_afrit_purge_houses` on Aenor; stability −0.03 (AI 30) |

`zin_reign.87` does not close what becomes of Afrit's former temples and innocent believers, which the vault leaves open: it describes only the first fortnight.

## Implementation

### Files

| Path | Content |
| --- | --- |
| `docs/design/events/zin_reign.json` | The `zin_reign` events as data (id, title, to, fired by, window, text keys, options, picture) for the content builder |
| `events/zin_reign.txt` | Generated; namespace `zin_reign` |
| `common/scripted_effects/zin_story.txt` | `zin_story_tick` (C6) and the per-namespace runner blocks it calls: `zin_story_tick_reign` (this spec), `zin_story_tick_lastwar` ([03](03_war_of_the_last_crowns.md)), `zin_story_tick_ending` ([04](04_endings.md)) |
| `common/opinion_modifiers/zin_reign.txt` | `zin_reign_mourned_king` (+10, decays 0.3 a month) |
| `common/ideas/zin_reign.txt` | `zin_reign_anniversary` |
| `common/scripted_localisation/zin_lore.txt` | `zin_loc_camp_faithful`, `zin_loc_camp_host` (two-face camp names) |
| `localisation/english/zin_reign_l_english.yml` | All text; public and Worshipdom variants as separate keys |

The texts of the owners' events (`zin_aenor.*`, `zin_afrit.*`) go into the owners' localisation files; this spec only fixes their gist.

### Firing rules

- **Runner-dated events** (`zin_reign.10`, `.11`, `.13`, `.14`, `.16`, `.80`) fire on their dates while their conditions hold: Aenor exists, `zin_aenor_king_alive` (except `.80`), not `zin_golden_king_plot_exposed`. If the condition fails on the date the event is skipped, not delayed.
- **Chained events** fire from their parent's immediate block or option with `country_event = { id = … days = … }`.
- **Death-relative events** (`zin_reign.20`–`.26`) are fired by one hidden effect `zin_reign_on_king_dead` that the Aenor spec's `zin_aenor_open_succession` calls at its end (dependency).
- **Thirty Days events** (`zin_reign.30`–`.36`) are fired by `zin_reign_on_thirty_days`, called from `zin_aenor.201`'s immediate block (dependency).
- **Crowning events** (`zin_reign.40`–`.46`) are fired by `zin_reign_on_crowning`, called at the end of `zin_afrit_crown_aurevan` (dependency).
- **Recipients by rule.** Lists of recipients are evaluated when the event fires; countries that do not exist are skipped.

### Ids

| Range | Use |
| --- | --- |
| `zin_reign.1` | (hidden) startup: nothing visible; asserts no `zin_reign` flag is set (debug builds) |
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
| `zin_story_done_reign_<id>` | global flag | A once-only `zin_reign` event has fired |
| `zin_story_seen_reign_<id>` | country flag | A per-country `zin_reign` event has fired for this country |
| `zin_reign_asked_ledgers` | country flag (Aenor) | Asked for the temple ledgers; +10% to *Follow the Poisoner's Coin* |
| `zin_reign_scholars_free` | country flag (Aenor) | The scholars were left free to debate |
| `zin_reign_league_to_frontier` | country flag (Aenor) | The Lost Cause was left to the frontier |
| `zin_reign_eronel_crowned` | country flag (Aenor) | Prince Eronel was crowned (Court road or pliant heir) |

### Pictures

| Events | Key |
| --- | --- |
| `.10`, `.11`, `.13`, `.16`, `.17`, `.26`, `.30`, `.46`, `.50`–`.53` | `golden_court` or `court_feast` |
| `.12`, `.24`, `.25`, `.32`, `.37`, `.42`, `.55`–`.57`, `.84` | `concord_council` |
| `.14`, `.15`, `.35`, `.45`, `.70`, `.86` | `lost_cause_triumph` |
| `.19` | `court_feast` |
| `.20`, `.22`, `.23` | `king_is_dead` (gate `zin_golden_king_dead`) |
| `.21` | `king_is_dead` |
| `.31`, `.80`, `.81`, `.82`, `.87` | `temple_parim_interior` (*proposed key*: a white temple nave with sun windows, no figure; fallback `hermitage`) |
| `.33`, `.34`, `.36` | `thirty_days` |
| `.40`, `.41`, `.65` | `coronation` |
| `.43`, `.44`, `.66`, `.83` | `generic_court` |
| `.60`, `.61` | `lost_cause_triumph` (`crown_of_aen` is gated on `zin_eindil_crowned` and may not be used) |
| `.71`–`.73` | `generic_war` |
| `.85` | `unmasking` (gate `zin_afrit_revealed`) |

## AI

- Under `zin_rules_is_historical` every `zin_reign` choice takes the option marked hist above. Its effect on the camps keeps the Aenor spec's historical outcome: Faithful about 68, nobody rises.
- Under FREE the weights in the tables apply, scaled by the Aenor spec's camp: a ruling camp never takes an option that lowers its own support.
- AI dominions answer `zin_reign.24`, `.32` and `.42` by loyalty band (Steadfast and Loyal: the loyal options; Restless and Defiant: the others). Selen follows its hist line.
- AI foreign courts answer `zin_reign.21` and `.41` by opinion of Aenor and footholds; East Lands courts favour the great embassy and the gifts.

## Acceptance

1. On 1 Thaw 4A 1748 no `zin_reign` event is pending or has fired, and no `zin_story_done_reign_*` flag is set.
2. Historical observer run: `zin_reign.10`, `.11`, `.13`, `.14`, `.16` fire on their dates in 1748–1749; `zin_reign.19` fires the day before `zin_aenor.200`; `zin_aenor.200` falls in Mistfall 1750; `zin_reign.20`–`.25` fire within 15 days after it; the Thirty Days events fire inside the thirty days; `zin_aurevan_crowned` is set within 31 days of the death; `zin_reign.40`–`.42` fire within 10 days of it; no Aenor civil war starts.
3. Secret scan: no `zin_reign` key reachable by a non-Worshipdom country before `zin_afrit_revealed` contains "Afrit", "demon" or "Hidden Council"; every mention of the Deliverer goes through `[zin_loc_deliverer]`.
4. No `zin_reign` text states the Golden King's personal name, any relative of his, the cause or agent of his death, or Merovan's fate (review checklist and a phrase scan for "poison", "murder", "Afrit killed").
5. With `zin_golden_king_plot_exposed` set by console before the death, `zin_reign.19`–`.46` never fire and `zin_reign.70`–`.73` follow the Council's War.
6. With the Court forced as ruling camp, `zin_reign.50`–`.53` fire and `zin_aurevan_crowned` is never set.
7. Every event has an option with text and an `ai_chance`; every id is unique (`hoi4.mod_index`); `hoi4.event_inspect` shows every event reachable and none firing at the start.
8. Every modifier named here exists in the game's modifier documentation; every engine effect and trigger named exists in the effect and trigger documentation.

## Open questions

1. Does the Golden King have an heir of his body? The death event text depends on it ([start situation](../02_lore/01_start_situation.md), open question 4). This spec assumes none.
2. Is Prince Eronel of Arcedor acceptable as the pliant heir of the Kingdom Behind the Throne, or should the Council's puppet be a collective regency too?
3. Should the funeral (`zin_reign.23`) let the Lost Cause carry the coffin on the historical path? It would make the league's frontier branch visible a year before the reveal.
4. The vault says scholars questioned Aurevan's genealogy and were silenced. Is "buying their silence" (`zin_reign.44`) the right historical option, or should it be harsher?
5. `zin_reign.81` tells the public that the King went "into retreat beyond the sea". Should the public know nothing at all, with Merovan simply holding the seals?
6. The Afrit spec names the High Confessor of the Seat of Censers `zin_ilvane`, while the characters spec names `zin_hierarch` (Hierarch Aubren) as the Council's seat of worship. This spec uses the Hierarch as Parim's public high priest (the coronation) and Ilvane as the Worshipdom's Keeper. Are they one person or two?
7. The foundation rules name `zin_rule_golden_king` (HISTORICAL / DELAYED / NO_AI_PLOT); the Aenor spec names `zin_rule_golden_king_death` (historical / dynamic / late). Which rule gates `zin_reign.19`?
