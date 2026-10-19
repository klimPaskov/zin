# The Chronicle of Erdae

**Status:** Ready. Reviewed 19 October 2026 against CONVENTIONS "Status"; integrated 19 October 2026. **Priority:** 5. **Phase:** 7.

Text authoring and the builder module may start in phase 2 (the open entries are base lore); the story entries are finished in phase 5 with the events they record; the window, sprites and plates land in phase 7.

**Current state (19 October 2026, commit ca01fa3).** Nothing of the Chronicle is in the game yet. What it builds on is: the lore vault copy in `docs/lore/vault/` (staged by `tools/content/modules/lore.mjs`), the Realm button at x 8, y 86 (`modules/ui.mjs`), the 43 catalog event pictures whose raw generations the plates may reuse (`modules/presentation.mjs`), and the loading tips that already quote "The Chronicle of Erdae" as a source.

## Purpose

The Chronicle of Erdae is an in-game codex: one scripted window, opened from the top of the screen, in which a player can read the whole history of Erdae. It covers the cosmology, the Holy Seven, the Old and New Gods, the spirits, every age and its major events, and every figure, people, region, institution and relic in the owner's lore vault. It is the main way ZIN meets goal 5 of [PROGRAM.md](../PROGRAM.md) ("the whole history of Erdae is readable in game").

The Chronicle keeps the story's secrets. Most entries are open on 1 Thaw 4A 1748. Entries about Afrit, Eindil's identity, Glo's fate and the events of the War of the Last Crowns stay hidden until the shared story flags are set. Hidden entries are absent, not greyed out. So the Chronicle tells each game's history as it happens, never ahead of it.

The Chronicle is not the *Chronicle of the Age* (`zin_world.110`), the end-of-game event that sums up one campaign ([05_world_tension_and_endings.md](../03_gameplay/05_world_tension_and_endings.md)). The codex links to it through its ending entries and reuses its lines (section 9).

The Chronicle shows; it never decides. Its buttons only select categories, entries and pages. They never change a mechanic variable, fire an event or give a modifier.

## Lore basis

| Fact | Status | Source |
| --- | --- | --- |
| The vault is canon. Established facts are fixed. Proposals stay proposals until the owner adopts them. Open questions stay open | owner rule | *Canon Policy*, [CONVENTIONS.md](../CONVENTIONS.md) |
| Start on 1 Thaw 4A 1748: the Golden King reigns, Eindil has not appeared, Afrit is unrevealed, Erdae seems at peace | owner-fixed | *The Campaign of 4A 1748* |
| Ordinary people know the Deliverer, not the name Afrit | established | *Fourth Age Canon Register* |
| No text may name Afrit or call the Deliverer a demon before `zin_afrit_revealed`, except text shown only to Afrit's own country | contract rule | [00_shared_contract.md](../04_mechanics/00_shared_contract.md), "The secret" |
| Public and true labels (the Deliverer / Afrit, the Man from the Ice / Eindil, "a crystal of old and holy power" / Horos's heart) | spec rule | [03_names_and_terms.md](../02_lore/03_names_and_terms.md), "Labels before and after a reveal" |
| "The Kingdom Behind the Throne" and any statement that the Deliverer's people govern Aenor appear only to the Worshipdom or after the reveal | spec rule | [04_fourth_age_history_for_play.md](../02_lore/04_fourth_age_history_for_play.md) |
| Eindil learns his name at Gala; the courts learn it only when he gives his warnings (stage 8) | spec rule | [eindil_journey.md](../04_mechanics/eindil_journey.md), stage 5 |
| Proposed lore reads in game as the world's own history; documents keep the label | owner direction, 18 October 2026 | [PROGRAM.md](../PROGRAM.md) §5 |
| Šodolôrō is written Šodolôro in game (the font cannot draw ō) | integration decision S11 | [INTEGRATION_DECISIONS.md](../INTEGRATION_DECISIONS.md) |
| All art is image-generated; code only slices, resizes and converts | owner rule | [01_art_pipeline.md](../08_art_and_assets/01_art_pipeline.md) |
| The Chronicle's name, framing, categories, layout, unlock rules, entry list, every title and every plate subject | **proposed** | this spec |

The Chronicle never closes a question the vault leaves open: the birth order of Ein's sons and why Ein refused Afrit; where and how Eindil was put to sleep; which arm Eindil loses; where Dardan, the palace cliff and the western war-kingdom lie; whether Volgan's spirit survives; who keeps Furviatlon for Zol; what the dead of the Mistake are; Zol's servants' names; the King of Demons' name; Agon's rank; Roka's fate and his people's name; Volgan's former patron; Glernaen's fellow gods; whether the Gala elves are kin to the Sunhot elves; where the dwarves first dwelt; the names of the Holy Seven; anything about He Who Was, Is and Will Be beyond his title and place; Golbran's origin; the Golden King's personal name; what the Necklace will do to Eindil.

## Design

### 1. Framing and voice

The Chronicle presents itself as the histories "kept by the scholars of Parim and Selen" (proposed framing; the universities date from 4A 340 in the proposed chronology). This gives the text one in-world voice and an honest way to say what nobody knows.

Voice rules (the builder checks the mechanical ones, section 12):

1. **In-world.** Past tense for history, present tense for what still holds in 4A 1748. No meta words: canon, established, proposed, lore, vault, owner, player, game, mod, map (except a map inside the world), spec, ZIN.
2. **Plain and concrete.** One idea per sentence. No modern words (factory, rifle, democracy, percent, 1936).
3. **Open questions are said as open.** Fixed phrases: "No chronicle tells…", "The scholars do not agree whether…", "It is not known…", "The elves say… The chronicles of men do not." Text never picks one of the vault's mutually exclusive alternatives (the possible natures of the Abyss, Agon's possible roles, the King of Demons' possible origins, the unselected names for the Holy Seven, the alternative public names for Afrit).
4. **Proposed lore reads as history.** A proposed name or date is written as a name or date. Its paragraph is marked `proposed` in the data (section 10), so the owner can review and replace it.
5. **Established lore stays itself.** An established paragraph keeps every fact and the key wording of its vault section. Editing is limited to shortening, reordering, joining sentences, removing status labels and hedges about canon, and replacing modern words.
6. **No foreshadowing.** An entry open at the start describes the world up to 1 Thaw 4A 1748. It never says what will happen ("he would later…"). Later fates are added as new pages when their flags are set.
7. **Dialogue.** At most two quoted lines per entry, attributed ("so the stranger later told it"). Only lines from the vault chronicle.
8. **Names.** Canonical spellings (Eindil, Zol's Mistake, Aenor, Šodolôro, Golbran, Kilinti, Hunhun). Never Einendil, Edvoid, Rush, Gorbat, Klinti, Huhun, "Sovereign Spirit". Adjectives as the names spec says (Aenoran, Leren, Mirolonese).

### 2. Categories

Eleven categories, in this order. Each has a sigil (24 × 24) and a category plate used by entries that have no plate of their own.

| # | Key | Name | Covers | Entries | Open at start |
| ---: | --- | --- | --- | ---: | ---: |
| 1 | `order` | The Order of Being | The Creator, the Holy Seven, gods, spirits, the Fading, magic, the Void | 15 | 15 |
| 2 | `first_age` | The First Age | Aen to Dardan and Edran's Folly | 10 | 9 |
| 3 | `second_age` | The Second Age | The Long Grief to the Fall of Aenor | 12 | 11 |
| 4 | `third_age` | The Third Age | Elzon's Order to the Last Tithe | 9 | 9 |
| 5 | `fourth_age` | The Fourth Age | The Restoration to 4A 1748 | 18 | 16 |
| 6 | `last_crowns` | The End of the Age | Everything from the Man from the Ice to the coronation and the endings | 30 | 0 |
| 7 | `figures` | Figures | Every named person and power of the vault | 25 | 22 |
| 8 | `peoples` | Peoples | Folk of every order | 18 | 18 |
| 9 | `lands` | Lands and Places | The thirteen regions, Aenor Isle and the named places | 26 | 26 |
| 10 | `orders` | Realms and Orders | Crowns, pacts, courts, faiths and councils | 10 | 8 |
| 11 | `relics` | Relics and Wonders | Glo, the blue sword, the Necklace and the rest | 7 | 4 |
| | | **Total** | | **180** | **138 (77%)** |

The End of the Age has no open entries at the start; its category button is hidden until its first entry unlocks (`zin_eindil_awake` or `zin_golden_king_dead` on the historical path). Every other category is visible from the first day.

### 3. Entry layout

Each entry has:

| Part | Content | Limit (section 7) |
| --- | --- | --- |
| Id | Stable number: category × 100 + position (101, 1104). Never reused or renumbered, because saves store it | — |
| Key | `snake_case`, unique | — |
| Title | Full title on the page; may change once with a flag (two-face titles) | ≤ 432 px in `hoi_24header` (about 36 characters) |
| List title | Shown in the entry list and on link buttons; equals the title unless a `short` is given | ≤ 200 px in `hoi_16mbs` (about 28 characters) |
| Subtitle | "Era · Kind", for example "Second Age · Event", "Fourth Age · Great Spirit", "Before the Ages · Order of Being" | one line, ≤ 432 px in `hoi_16mbs` |
| Plate | One generated illustration, or the category plate | 432 × 162 |
| Text | One to four pages; more pages may join later when their flags are set | each page ≤ 10 lines of 432 px in `hoi_16mbs` |
| See also | Up to four related entries | link hidden while its target is locked |

The page shows the plate, the title, the subtitle, the current text page, page controls ("2 / 3") and the "See also" links. A small marker beside a list title means the entry has unread pages.

When the window opens for the first time, it shows the **Foreword** (not counted as an entry): two short paragraphs saying what the Chronicle is and that "where the scholars do not know, they say so". After that it reopens on the last entry read.

### 4. The window

**Window** `zin_chronicle_window`, scripted GUI `zin_chronicle`, 980 × 560, `orientation = center_up`, position x = −490, y = 124 (below the Erdae bar, which ends at y = 118). At 1280 × 720 the window spans y 124 to 684. Moveable. Frame `GFX_zin_frame_chronicle` (nine-slice). Close button `GFX_closebutton` at (936, 12) with `shortcut = "ESCAPE"`.

Coordinates are relative to the window (targets; the GUI renderer check settles them):

| Block | Position, size | Elements |
| --- | --- | --- |
| Header | (24, 14), 880 × 32 | Title "The Chronicle of Erdae" (`hoi_24header`); a rule `GFX_zin_rule` at y = 62 |
| Categories | inset `GFX_zin_chr_inset` at (16, 76), 204 × 468 | Eleven buttons `zin_chr_cat_<n>` (190 × 30, `GFX_zin_chr_category`, sigil at left) at (23, 84 + 36 × (n − 1)); selected overlay `GFX_zin_chr_category_selected`; below them the line "[?zin_chr_read_count] of [?zin_chr_open_count] read" at (24, 500) |
| Entry list | inset at (228, 76), 268 × 468 | Category name at (240, 84) in `hoi_18mbs`; thirteen slot buttons `zin_chr_slot_<n>` (240 × 28, `GFX_zin_chr_row`) at (236, 112 + 30 × (n − 1)); per slot a selected overlay and an unread marker `GFX_zin_chr_new` (12 × 12) at the slot's right edge; list paging at y = 510: `zin_chr_list_prev` (240, 510), text "1 / 2" centred in (268–436), `zin_chr_list_next` (464, 510) |
| Page | page ground `GFX_zin_chr_page` at (504, 76), 460 × 468 | Plate `zin_chr_plate` (432 × 162) at (518, 88) with `GFX_zin_chr_plate_frame` over it at (514, 84); title (518, 256), 432 × 28, `hoi_24header`; subtitle (518, 286), 432 × 18, `hoi_16mbs`, muted colour; body `zin_chr_body` (518, 310), 432 × 160, `hoi_16mbs`, `format = left`, `fixedsize = yes`; "See also" label (518, 474); text paging `zin_chr_page_prev` (870, 472), "2 / 3" (894–926), `zin_chr_page_next` (930, 472); four link buttons `zin_chr_link_<k>` (212 × 24, `GFX_zin_chr_link`) at (518, 492), (736, 492), (518, 518), (736, 518) |

Engine constructs, chosen for stability. Each is documented in the installed `common/scripted_guis/_documentation.md` (game 1.19.3); the first four are also used by vanilla scripted GUIs, and `player_context` already runs in game in ZIN's Realm panel:

- Visibility by `<element>_visible` triggers; clicks by `<element>_click` effects.
- Text through scripted localisation keys in `text` and `buttonText`.
- The plate through `properties = { zin_chr_plate = { image = "[zin_chr_plate]" } }` (the vanilla `image = "[scripted_loc]"` pattern of `AST_cabinet_trust_scripted_gui.txt`).
- Frames by `frame = <variable>` for the marker sprites.
- `context_type = player_context` and `dirty = zin_ui_tick` (the interface spec's global dirty counter).

Not used (proposed): `dynamic_lists`, `gridboxType` filled from arrays, element positions driven by variables, `parent_window_window`. They are documented, but no vanilla scripted GUI exercises them and fixed slots are simpler to render and test. The list therefore uses thirteen fixed slots filled by an effect (section 5), as the interface spec's panels do.

The window is hidden (`visible` false) when closed, so it costs nothing while closed. `ai_enabled = { always = no }`.

### 5. How the window works

All state is per player, on the player's country (ROOT in `player_context`):

| Name | Kind | Meaning |
| --- | --- | --- |
| `zin_chr_open` | country flag | Window open |
| `zin_chr_cat` | variable | Current category, 1–11 |
| `zin_chr_entry` | variable | Current entry id (0 = Foreword) |
| `zin_chr_tpage`, `zin_chr_tpages` | variables | Current text page and number of unlocked pages of the current entry |
| `zin_chr_lpage`, `zin_chr_lpages` | variables | Current list page and number of list pages in the current category |
| `zin_chr_slot_1` … `zin_chr_slot_13` | variables | Entry id shown in each list slot (0 = empty, hidden) |
| `zin_chr_seen_<id>` | variable, one per entry | Number of unlocked parts when the player last read the entry (0 = never) |
| `zin_chr_unread`, `zin_chr_open_count`, `zin_chr_read_count` | variables | Counts for the markers and the footer line |

Effects (generated, `common/scripted_effects/zin_chronicle.txt`):

| Effect | Does |
| --- | --- |
| `zin_chr_open` | Calls `zin_ui_close_panels` (until the interface spec's effect is built, clears `zin_realm_open` instead), sets `zin_chr_open`; if `zin_chr_entry` is unset, shows the Foreword and selects category 1; calls `zin_chr_fill_slots`, `zin_chr_count_unread`; adds 1 to `global.zin_ui_tick` |
| `zin_chr_close` | Clears `zin_chr_open`; adds 1 to `global.zin_ui_tick` |
| `zin_chr_select_category` (`cat`) | Sets `zin_chr_cat`, `zin_chr_lpage = 0`; calls `zin_chr_fill_slots` |
| `zin_chr_fill_slots` | Walks the current category's entries in order and counts the unlocked ones with a temp variable; the entries whose running count falls on the current list page go into slots 1–13; empty slots get 0; sets `zin_chr_lpages`. One generated `if` per entry of the category (at most 30) |
| `zin_chr_show` (`id`) | Sets `zin_chr_entry`, `zin_chr_tpage = 1`, computes `zin_chr_tpages`, sets `zin_chr_seen_<id>` to the entry's unlocked part count, calls `zin_chr_count_unread` |
| `zin_chr_follow_link` (`k`) | Looks up link `k` of the current entry; if the target is unlocked, selects its category, its list page and shows it |
| `zin_chr_page_next`, `zin_chr_page_prev`, `zin_chr_list_next`, `zin_chr_list_prev` | Move within bounds |
| `zin_chr_count_unread` | For every entry: unlocked → add to `zin_chr_open_count`; part count > `zin_chr_seen_<id>` → add to `zin_chr_unread`; `zin_chr_seen_<id>` ≥ part count → add to `zin_chr_read_count`. 180 generated `if`s |

Click effects in the scripted GUI call these and nothing else: `zin_chr_cat_<n>_click`, `zin_chr_slot_<n>_click` (calls `zin_chr_show` with the slot's id), `zin_chr_link_<k>_click`, the four paging buttons, `zin_chr_close_click`.

Triggers (generated, `common/scripted_triggers/zin_chronicle.txt`):

| Trigger | True when |
| --- | --- |
| `zin_chr_unlocked_<id>` | The entry's unlock condition holds (section 6), evaluated with ROOT = the viewing player |
| `zin_chr_part_<id>_<n>` | Later part *n* of the entry is unlocked |
| `zin_chr_heir_known` | `has_global_flag = zin_eindil_named` and (`check_variable = { global.zin_eindil_stage > 7 }` or ROOT is the current host, `zin_eindil_is_host`) |
| `zin_chr_viewer_is_hub` | ROOT `zin_afrit_is_hub` |
| `zin_chr_cat_<n>_has_open` | At least one entry of category *n* is unlocked (category button visibility) |

Scripted localisation (generated, `common/scripted_localisation/zin_chronicle.txt`), each a `defined_text` with one branch per entry or part, most specific first:

| Key | Returns |
| --- | --- |
| `zin_chr_title` | Title key of `zin_chr_entry`, the after-flag title when its condition holds |
| `zin_chr_subtitle` | Subtitle key |
| `zin_chr_body` | Page key for (`zin_chr_entry`, `zin_chr_tpage`) |
| `zin_chr_plate` | Sprite name, for example `GFX_zin_chr_plate_horos`, or the after-flag plate, or the category plate |
| `zin_chr_slot_<n>_title` (13) | List title of the entry in slot *n* |
| `zin_chr_link_<k>_label` (4) | List title of link *k* of the current entry |
| `zin_chr_cat_name` | Name of the current category |

Visibility triggers: a slot shows when its variable is not 0; its unread marker when that entry's part count exceeds its `zin_chr_seen`; a link when the current entry has a link *k* whose target is unlocked; paging buttons when there is somewhere to go; the End of the Age category button when `zin_chr_cat_6_has_open`.

Cost: the window refreshes only when `zin_ui_tick` changes. The longest effect is `zin_chr_count_unread` (180 checks), run on open, on each entry shown and once a month for human players. Nothing runs for AI countries.

**Multiplayer.** Each player has its own state on its own country. Two players who share one country in co-op share the window state; this is accepted.

**Saves.** Unlocks are computed from global flags, so a save never stores what is unlocked. It stores only the per-player variables above. Entry ids never change, so old saves open on the right page; an id that no longer exists shows the Foreword.

### 6. Unlock rules

Notation used in the entry list:

| Code | Means |
| --- | --- |
| `start` | Readable by everyone from 1 Thaw 4A 1748 |
| `F:<flag>` | The global flag is set (shared contract or the contract additions register) |
| `rev` | `zin_afrit_revealed` |
| `hub` | The viewer is the Worshipdom (`zin_chr_viewer_is_hub`); it reads its own private record from the start |
| `heir` | `zin_chr_heir_known` |
| `S≥n` | `global.zin_eindil_stage` ≥ *n* |
| `,` and `|` | and, or |

Rules:

1. **Open by default.** Everything that happened before 4A 1748, every people, land, order and relic, and every figure whose existence is public knowledge is open at the start. Open entries contain nothing that the start must hide.
2. **The secret of Afrit.** Any text that names Afrit, the Hidden Council, the Kingdom Behind the Throne, the Council's decision of 4A 1746, the thief Sevrin, the Ring of Doors, the Crown of Witnesses or the Bracelet of the First Seal, or that links the Deliverer to demons, false godhood or the Golden King's murder, requires `rev`, or `rev | hub`. Before `rev`, no open text sets the Deliverer beside the "false gods" discussion of *Worship and Rank*.
3. **The heir.** The name Eindil, his descent from Ein and anything learned at Gala or Yeldenne require `heir` (the courts learn his name at stage 8; the host knows earlier). Before that he is "the Man from the Ice" or "the stranger". His kinship with Afrit requires `heir, rev`.
4. **Glo.** Before `F:zin_horos_dead, S≥8` Glo is "a crystal of old and holy power" kept by Horos and said to hold part of Glernaen's power. That it is Horos's heart, and who carries it, require those flags. Divergent fates of Glo have their own parts (relic 1101).
5. **The war and the end of the age.** Each story entry unlocks on the flag of its event. Its text says only what that flag guarantees. Details that need further flags are separate parts.
6. **Divergence.** If a flag never fires, its entry never appears. Divergent outcomes that the mechanics name (the Golden King survives, Glo sealed, a western crown holds Parim, the proposed endings) have their own entries or parts, so the Chronicle of a diverging game is still true.
7. **Global flags only** decide unlocks, plus the two viewer tests `hub` and the host clause of `heir`. Every viewer at the same date reads the same public text.

### 7. Text limits and localisation

| Item | Limit |
| --- | --- |
| Encoding | UTF-8 with BOM; every character in Windows-1252. Š, ô, é, ’, “ ”, – and · are allowed; ō, ā and any other character outside Windows-1252 are refused |
| Title | ≤ 432 px measured in `hoi_24header` |
| List title (`short`) | ≤ 200 px in `hoi_16mbs` (the slot is 240 px; marker and padding take 40) |
| Subtitle | One line, ≤ 432 px in `hoi_16mbs` |
| Page | ≤ 10 lines when word-wrapped at 432 px in `hoi_16mbs` (line height 16); paragraphs separated by `\n\n`, and a blank line counts as a line |
| Pages per part | First part ≤ 4 pages; each later part ≤ 2 pages; an entry ≤ 8 pages in all |
| Characters | About 550 per page; the measurement decides, not the count |
| Forbidden in text | Straight double quotes (use “ ”), `$`, `£`, `§` colour codes, `[` and `]` (the builder inserts the only bracket keys) |
| Keys | `zin_chr_<id>_title`, `_title_after`, `_short`, `_sub`, `_p<n>` (first part), `_x<part>_p<n>` (later parts), `zin_chr_cat_<n>_name`, `zin_chr_foreword_p1`, `zin_chr_foreword_p2`, UI strings `ZIN_CHR_*` |
| File | `localisation/english/zin_chronicle_l_english.yml` (about 250 KB) |

Measurement uses the glyph advances and kerning of the installed `gfx/fonts/hoi_16mbs.fnt` and `hoi_24header.fnt`, read for measurement only (nothing is copied), with a 4 px safety margin per line. A paragraph never splits across pages; the builder packs whole paragraphs into pages and refuses a paragraph longer than one page.

### 8. Art

**Plates.** One generated illustration per major entry: 125 entry plates, 2 after-flag plates (`castle_yeldenne_empty`, `mirolon_fallen`) and 11 category plates, 138 in all. Minor entries show their category plate.

| Item | Value |
| --- | --- |
| Generation | Single, `quality: high`, aspect 8:3. The model returns about 1.57 megapixels in that aspect, about 2048 × 768 (decision A1) |
| Reuse | Where the icon catalog already has an accepted event-picture generation of the same subject (column "Plate" says `reuse <key>`; 43 catalog pictures are in game), the plate is an 8:3 crop of that raw generation at its full width; the manifest records the crop box. The reviewer may refuse a crop that loses the subject; then a new single is generated |
| Output | 432 × 162, Lanczos 3, DDS A8R8G8B8, no mipmaps, `gfx/interface/zin/chronicle/plates/<plate>.dds` |
| Sprite | `GFX_zin_chr_plate_<plate>`; category plates `GFX_zin_chr_plate_cat_<category>` |
| Prompt | The house style line, then "wide panoramic painted illustration for a chronicle", then the subject, then "no text, no letters, no frames, no labels" |

Plate rules (the icon catalog's rules apply in full):

1. No plate shows Zol in any form, a servant of Zol, a New God's figure, the Holy Seven, or any symbol of He Who Was, Is and Will Be (those entries use the category plate).
2. No plate shows the face or figure of Afrit or Aurevan. Afrit's demonic form appears in no plate (the Chronicle needs none).
3. Eindil appears only in plates of gated entries, always seen from far away or from behind, cloaked so that neither arm can be judged.
4. Horos is drawn from the established text only (yellow-green armour, blue eyes, thorn-like helm, large blue sword, green crystal at his breast), not from the owner's private drawings, until the owner says otherwise (decision A6).
5. Golbran is small, purple and humanoid, nothing more. Sunhot elves are over three metres tall; Gala elves are never drawn beside Sunhot elves in a way that settles their kinship.
6. No plate places Dardan, the palace cliff or Yeldenne on a recognisable map. No lettered maps.

**Interface theme `chronicle`** (one UI theme sheet, the art pipeline's free layout, black background; "a leather-bound book with brass corners, parchment pages, no lettering"):

| Sprite | Type | Size (frame) | Frames | File |
| --- | --- | --- | ---: | --- |
| `GFX_zin_frame_chronicle` | `corneredTileSpriteType`, border 32 | 128 × 128 | 1 | `gfx/interface/zin/chronicle/frame.dds` |
| `GFX_zin_chr_inset` | `corneredTileSpriteType`, border 12 | 64 × 64 | 1 | `inset.dds` |
| `GFX_zin_chr_page` | `corneredTileSpriteType`, border 24 | 128 × 128 | 1 | `page.dds` |
| `GFX_zin_chr_category` | `spriteType`, `buttonstate.lua` | 190 × 30 | 3 | `category.dds` |
| `GFX_zin_chr_category_selected` | `spriteType` | 190 × 30 | 1 | `category_selected.dds` |
| `GFX_zin_chr_row` | `spriteType`, `buttonstate.lua` | 240 × 28 | 3 | `row.dds` |
| `GFX_zin_chr_row_selected` | `spriteType` | 240 × 28 | 1 | `row_selected.dds` |
| `GFX_zin_chr_link` | `spriteType`, `buttonstate.lua` | 212 × 24 | 3 | `link.dds` |
| `GFX_zin_chr_arrow_prev`, `GFX_zin_chr_arrow_next` | `spriteType`, `buttonstate.lua` | 20 × 20 | 3 | `arrow_prev.dds`, `arrow_next.dds` |
| `GFX_zin_chr_plate_frame` | `spriteType`, transparent centre | 440 × 170 | 1 | `plate_frame.dds` |
| `GFX_zin_chr_new` | `spriteType` | 12 × 12 | 1 | `new.dds` |
| `GFX_zin_chr_sigil_<category>` (11) | `spriteType` | 24 × 24 | 1 | `sigils/<category>.dds` (one 6 × 6 sheet on black, 1:1) |
| `GFX_zin_chr_book_button` | `spriteType`, `buttonstate.lua` | 30 × 30 | 3 | `book_button.dds` (from the same sigil sheet) |
| `GFX_zin_chr_age_button` | `spriteType`, `buttonstate.lua` | 96 × 28 | 3 | `age_button.dds` |

Category sigils (proposed): order, a ring of seven faint stars; first_age, a plain crown on a spear; second_age, a cracked bell; third_age, a pale lantern; fourth_age, a sun over a lake; last_crowns, five converging banners; figures, a quill; peoples, a circle of hands; lands, a compass rose without letters; orders, a seal and ribbon; relics, a faceted crystal.

Category plates (proposed subjects): order, stars over a black sea with one pale band of light; first_age, ancient banners on a windswept hill; second_age, mourners at rebuilt walls in rain; third_age, a grey city under pale lanterns; fourth_age, Parim's towers above the Great Lake; last_crowns, smoke over a crossroads where banners meet; figures, an empty scriptorium desk with a lamp; peoples, a crowded market of many folk seen from above; lands, mountains, sea and forest folding into each other at dusk; orders, a long table of seals and ribbons; relics, a dark velvet case with empty hollows.

Owner approval follows the art pipeline: plates showing Horos, Eindil, Varner or Golbran are in the owner-approval group. Until approved they show the category plate, so nothing waits.

Budget: 138 plates, of which 30 are crops of catalog event generations; 108 new single generations plus retries (about 135 calls), one theme sheet, one sigil sheet.

### 9. Access

| Access | What | When |
| --- | --- | --- |
| **Top bar, now** | Scripted GUI `zin_chr_button`, window `zin_chr_button_window` at x = 144, y = 86 (`upper_left`), 30 × 30, attached like today's Realm button (main window, no parent token) so the two stay aligned, button `zin_chr_book_button` beside the existing Realm button; tooltip "The Chronicle of Erdae" plus "New pages: [?zin_chr_unread]" when there are any; the unread marker `GFX_zin_chr_new` sits on its corner | Ships with the Chronicle, before the Erdae bar exists |
| **Erdae bar, later** | The bar's age label ("4A 1748", slot width 96) becomes the button `zin_chr_age_button`; clicking the age opens the Chronicle; the unread marker sits at its top right. `zin_chr_button_window` is then removed | When [01_interface.md](01_interface.md)'s Erdae bar lands (its section 2 already names the age button) |
| **Realm panel** | Button `zin_realm_chronicle_button` "The Chronicle of Erdae" ([01_interface.md](01_interface.md) §3) | With the Realm panel's extension |
| **Story news** | Story events that unlock an entry may add the tooltip line `zin_chr_new_page_tt` ("A new page is written in the Chronicle of Erdae.") to an option. They never open the window by themselves | Phase 5, optional per event spec |
| **End screen** | The *Chronicle of the Age* (`zin_world.110`) mentions the Chronicle; ending entries 627–630 reuse its `zin_loc_chronicle_*` lines as their last page | Phase 5 |

Opening any mechanic panel closes the Chronicle and opening the Chronicle closes them: `zin_ui_close_panels` also clears `zin_chr_open` ([01_interface.md](01_interface.md), scripted effects). Escape closes it. No keyboard shortcut opens it (proposed: vanilla hotkeys are dense).

**Main menu: not possible.** The main menu runs without a game state; scripted GUIs, flags and scripted localisation exist only inside a running game, and front-end `.gui` buttons cannot call script. A button added to `interface/frontendmainview.gui` would do nothing. Re-using the credits screen (`interface/credits.txt`) would remove Paradox's credits and is refused. Instead (proposed): the bookmark description ([03_main_menu_and_frontend.md](03_main_menu_and_frontend.md) §3) ends with "The histories of Erdae are kept in the Chronicle: open it from the age of the world at the top of the screen", and the loading tips ([02_loading_screens_and_quotes.md](../08_art_and_assets/02_loading_screens_and_quotes.md)) may quote the first sentence of open Chronicle entries, so the history is already present before the game starts. The escape menu (`interface/ingamemenu.gui`) has no scripted GUI token and is not used.

Observers see the Chronicle of the country they observe through, with the same unlocks.

### 10. The entry data

Source of truth: `tools/content/data/chronicle/` (builder data). The builder publishes the generated review files under `docs/design/chronicle/`.

| File | Content |
| --- | --- |
| `categories.json` | The eleven categories: key, number, name, sigil, category plate |
| `entries/<category>.json` | The entries of one category, in order |
| `coverage.json` | Every vault note and section in scope → the entries citing it, or an exclusion with a reason |
| `foreword.json` | The Foreword's two paragraphs |
| `docs/design/chronicle/source_index.json` | **Generated** (published, not builder input). The staged vault parsed into notes and sections with hashes |
| `docs/design/chronicle/canon_status.json` | **Generated** (published). Every paragraph with its status and sources, for the owner's review |

Entry schema (JSON Schema `tools/content/data/chronicle/entry.schema.json`):

```json
{
  "id": 1101,
  "key": "glo",
  "title": "Glo",
  "short": null,
  "title_after": null,
  "subtitle": "Fourth Age · Relic",
  "plate": "glo",
  "plate_after": [],
  "unlock": "start",
  "parts": [
    { "when": "start",
      "paragraphs": [
        { "text": "In the Castle of Yeldenne …", "status": "established",
          "sources": [ { "note": "08 - Artifacts/Castle of Yeldenne and Glo.md", "section": "Castle Yeldenne and Glo", "sha256": "…" } ] }
      ] },
    { "when": "F:zin_horos_dead, S>=8", "paragraphs": [ … ] }
  ],
  "related": [ "horos", "glernaen", "castle_yeldenne", "blue_sword" ],
  "secrets": [ "glo" ]
}
```

- `unlock` and `when` use the notation of section 6 as a small boolean language (`start`, `F:<flag>`, `rev`, `hub`, `heir`, `S>=n`, `,`, `|`, parentheses). The builder compiles them to triggers and checks every flag name against the shared contract and the contract additions register.
- `status` is `established`, `proposed` or `mixed`; `mixed` paragraphs carry a `note` saying which clause is proposed.
- `sources` cite a vault note and section heading; `sha256` is the hash of that section's normalised text when the paragraph was written.
- `secrets` declares which secret classes the entry touches (`afrit`, `heir`, `glo`, `story`); the builder's checks use them as a second guard.

### 11. From the vault to the game (content builder)

Module `tools/content/modules/chronicle.mjs` (new; `buildChronicle(staged)`, called from `tools/content/build.mjs` after `stageLore`), helpers `tools/content/lib/fontmetrics.mjs` (new; reads `.fnt` metrics from the installed game at `HOI4_GAME` for measurement only) and `tools/content/lib/condlang.mjs` (new; the unlock language). Author commands run as `node tools/content/chronicle.mjs <command>` (new CLI); `check` and `emit` also run inside every build:

1. **`index`.** Parses the staged vault `docs/lore/vault/**/*.md` (copied by `modules/lore.mjs`), excluding `Sources/`, `Maps/` and `ZIN Lore Master Compendium.md` (a concatenation of the other notes). For each note: path, front-matter `status`, title, and each section (heading path, normalised text, sha256, and the status markers it contains: "Established", "Proposed", "Open", "Unknown", "Undecided"). Writes `source_index.json`.
2. **`draft <note>`.** Prints a note's sections with their markers as a starting sheet for an author. It never writes entry text. Entry text is written by an author (agent or person) following the voice rules.
3. **`check`.** Runs every check of section 12. Any failure stops the build.
4. **`emit`.** Stages the game files of the Implementation section, deterministic and sorted by id; `tools/content/apply.mts` writes them through the shared atomic rewrite engine with the rest of the build.
5. **`status`.** Writes `canon_status.json`: per entry and paragraph, status and sources, with totals (established, proposed, mixed paragraphs).

**Staleness.** When a vault section's hash differs from a paragraph's recorded `sha256`, the paragraph is stale. A stale paragraph is a build warning in development and a failure for a release build. The author rereads the section, updates the text and the hash.

**Coverage.** Every note in `01 - Cosmology` to `08 - Artifacts` and the history registers is in scope; `09 - Development` is excluded except *Open Questions* and *Names and Retcons*, which drive the forbidden-claims and spelling checks. Every in-scope section must be cited by at least one paragraph or carry an exclusion in `coverage.json` with a reason ("open questions list; enforced by forbidden claims", "meta note on the map file", "superseded estimate"). This is how "the whole lore is implemented" is checked.

Canon Policy in practice:

| Vault material | In the Chronicle |
| --- | --- |
| Established fact | Kept, edited for voice; `status: established` |
| Proposed name, date, episode adopted by the specs or the proposed chronology (Aurevan, Harion, Merovan, Sevrin, the Charters of Parim, the Wall Accord, the Thirteen Days, the Pale Regency, the Black Roots, the Last Tithe, the Mirror of First Rain, the lesser artifacts) | Written as history; `status: proposed` |
| Proposals the vault gives as unselected alternatives | Not used; the text says the matter is unknown |
| Open question | Said as open (voice rule 3); the forbidden-claims list guards it |
| Superseded material (Einendil, Edvoid, Rush, the 100,000-year and 5,000-year figures, the 128-year Third Age) | Never used |

### 12. Builder checks

1. **Schema and ids.** Every entry validates; ids are unique, stable and in their category's range; every `related` key exists; 120 ≤ entries ≤ 180; every category has at least 5 entries.
2. **Conditions.** Every flag in `unlock` and `when` exists in the shared contract or the additions register; every later part's condition implies its entry's unlock condition.
3. **Links.** No link from an entry to a target whose unlock is not implied by the source's unlock is shown before the target unlocks (checked by construction: the link's visibility trigger includes the target's unlock).
4. **Secrecy by implication.** For each text variant the builder computes the conjunction of flags its conditions guarantee. Text whose conditions do not imply `rev | hub` must not match the Afrit list: "Afrit", "Hidden Council", "Kingdom Behind the Throne", "Sevrin", "Ring of Doors", "Crown of Witnesses", "Bracelet of the First Seal", "demon" within one sentence of "Deliverer" or "Aurevan", "false god" within one paragraph of "Deliverer" or "Aurevan", "murder" within one sentence of "Deliverer", "Aurevan" or "Council". Text that does not imply `heir` must not contain "Eindil" or "son of Ein". Text that does not imply `F:zin_horos_dead, S>=8` must not call Glo a heart. The compiler's own secrecy scan (validation spec, G2 check 3) also covers the generated localisation.
5. **No future at the start.** Text whose condition is `start` must not contain any phrase of `tools/content/data/chronicle/future_terms.json` (the Man from the Ice, Eindil, War of the Last Crowns, Western Crossing, King of the East, Thirty Days, the Four Camps, Black Compact, the names of late-age battles and deaths).
6. **Forbidden claims.** No text matches `docs/design/validation/forbidden_claims.json`.
7. **Spellings and words.** No superseded name; no modern word from the shared word list; no meta word (voice rule 1).
8. **Encoding and fit.** Section 7.
9. **Coverage and staleness.** Section 11.
10. **Art.** Every plate and theme sprite resolves to a DDS of the declared size with an accepted provenance line; every entry with `plate: null` uses its category plate.
11. **Determinism.** Two builds produce byte-identical files.

Each check has a negative test with a planted bad entry: an "Afrit" in a `start` paragraph, an "Eindil" behind `F:zin_eindil_awake` only, a page of eleven lines, an "ō", a link to a locked entry, an unknown flag, a stale hash, an uncovered vault section.

### 13. The entry list

180 entries. Columns: **Id**, **Key**, **Title** (list title in brackets when shorter), **Unlock**, **Later parts**, **Plate** (subject, `reuse <catalog key>`, or "cat" for the category plate), **St.** (status of the entry's content: E established, P proposed, M mixed, W working table), **Sources** (vault notes; § marks a section of *The Fourth Age of Erdae* unless another note is named).

#### 1. The Order of Being (`order`)

| Id | Key | Title | Unlock | Later parts | Plate | St. | Sources |
| ---: | --- | --- | --- | --- | --- | --- | --- |
| 101 | he_who_was | He Who Was, Is and Will Be | start | — | cat | E | *He Who Was, Is and Will Be* |
| 102 | holy_seven | The Holy Seven | start | — | cat | M | *Holy Seven* (only the working combination: "the Seven Before Names" in old writings, "the Seven Who Never Were" among sceptics) |
| 103 | order_of_being | The Order of Being | start | — | five empty stone thrones receding into mist | M | *Hierarchy of Being* |
| 104 | old_gods | The Old Gods | start | — | colossal faceless ruins half sunk in a grey sea | M | *Old Gods*, *The Fading* |
| 105 | new_gods | The New Gods | start | rev: whether Afrit was ever of their order is not known | a temple of many empty niches lit by lamps | M | *New Gods*, *Afrit the Deliverer* |
| 106 | the_fading | The Fading | start | — | stars dimming over a dark horizon | E | *The Fading* |
| 107 | magic_of_erdae | The Magic of Erdae | start | — | threads of pale light rising from forest and stone | M | *Magic and Sustenance in Erdae* |
| 108 | worship_and_rank | Worship and Rank | start | rev: the Deliverer as the great example of worship that proves nothing | cat | M | *Religious Knowledge and False Gods*, *Hierarchy of Being* |
| 109 | zol | Zol, Old God of Death | start | F:zin_zol_rising: his dead walk beyond the Mistake; F:zin_zol_manifested: the rare body; F:zin_zol_withdrawn: withdrawn, not slain | black islands under a starless sky, no figure | E | *Zol*, *Zols Mistake*, *The Fading* |
| 110 | servants_of_zol | Those Who Sustain Zol | start | — | cat | E | *Magic and Sustenance in Erdae*, *Zol*, *Spirits and Their Ranks* |
| 111 | glernaen | Glernaen | start | F:zin_eindil_restored: his voice in the crystal | green light filling a vast dark hall, no figure | E | *Glernaen* |
| 112 | spirits | Great and Lesser Spirits | start | — | storm and mountain shapes suggesting vast presences, no faces | M | *Spirits and Their Ranks* |
| 113 | natures_of_spirits | The Natures of Spirits | start | — | cat | P | *Spirit Natures*, *Spirit Origins*, *Spirit Manifestation States* |
| 114 | damned_spirits | The Damned Spirits | start | — | a fissure under a mountain, cold lights far below | M | *Damned Spirits* |
| 115 | the_void | The Void | start | — | cat | E | *Second Age Canon Register* (continuity boundaries), *The Return of Volgan* |

#### 2. The First Age (`first_age`)

| Id | Key | Title | Unlock | Later parts | Plate | St. | Sources |
| ---: | --- | --- | --- | --- | --- | --- | --- |
| 201 | first_age | The First Age | start | — | ancient banners over a newly united realm at dawn | M | *The First Age of Erdae*, *Ages of Erdae*, *Timeline* |
| 202 | war_of_men | The War of Men | start | — | hosts of ancient men under many kings' banners | M | *War of Men* |
| 203 | founding_of_aenor | The Founding of Aenor | start | — | lords kneeling around an oath-stone | M | *The First Age of Erdae* §1, *Aen*, *Middle Lands and Aenor* |
| 204 | roads_of_aen | The Roads of Aen | start | — | ships leaving a harbour for a far western shore | M | *The First Age of Erdae* §2, *Middle Lands and Aenor* |
| 205 | long_weakening | The Long Weakening | start | — | cat | M | *The First Age of Erdae* §3 |
| 206 | volgan_comes | Volgan Comes North | start | — | a royal city burning under a southern storm | M | *The First Age of Erdae* §4, *Volgans Dead Lands* |
| 207 | grand_alliance | The Grand Alliance | start | — | banners of men, elves, dwarves and giants in one camp | M | *Grand Alliance*, *King Edran*, *The First Age of Erdae* §5 (the Charter of Free Banners, proposed) |
| 208 | dardan | The Battle of Dardan | start | — | an immense battlefield turning to wasteland, no landmarks | M | *Battle of Dardan*, *The First Age of Erdae* §6 (the Thirteen Days, proposed) |
| 209 | edrans_folly | Edran's Folly | start | — | an army retreating through heat-haze and ash | M | *The First Age of Erdae* §7, *The Elven Refusal* |
| 210 | hidden_hand_dardan | The Hidden Hand at Dardan | rev \| hub | — | cat | E | *Afrits Ascension*, *Second Age Canon Register*, *The First Age of Erdae* (retrospective revelation) |

#### 3. The Second Age (`second_age`)

| Id | Key | Title | Unlock | Later parts | Plate | St. | Sources |
| ---: | --- | --- | --- | --- | --- | --- | --- |
| 301 | second_age | The Second Age | start | — | masons and mourners at a rebuilt wall | M | *The Second Age of Erdae*, *Second Age Canon Register*, *Second Age Proposed Timeline* |
| 302 | long_mourning | The Long Mourning | start | — | a king's bier in a half-rebuilt hall, empty chairs at a council table | M | *Second Age Progress and Recovery*, *The Second Age of Erdae* §II (the Council of the Empty Chairs, proposed), *King Edran* |
| 303 | wars_of_remnants | The Wars of the Remnants | start | — | cat | M | *The Second Age of Erdae* §I, §III (the Ash Networks, proposed), *Elzon* |
| 304 | hard_centuries | The Hard Centuries | start | — | healers and granaries in a plague-year town | M | *Second Age Progress and Recovery*, *The Second Age of Erdae* §IV (plague names, proposed) |
| 305 | open_gates | The Open Gates | start | — | a burning portal inside a border fort | M | *The Second Age of Erdae* §IV (the Burning Gate of Nezer, proposed), *Nether*, *Agon* |
| 306 | prophecies | Prophecies of the Return | start | — | cat | M | *The Second Age of Erdae* §V (the Watchers of Dardan, proposed) |
| 307 | return_of_volgan | The Return of Volgan | start | — | a storm gathering into a shape over red desert | M | *The Return of Volgan*, *Elzon* |
| 308 | stirring_of_zol | The First Stirring of Zol | start | — | a still black sea and silent graves at night | M | *The Second Age of Erdae* §VII, *Zol* |
| 309 | elven_refusal | The Elven Refusal | start | — | an elven gate closed against smoke on the horizon | E | *The Elven Refusal* |
| 310 | hollow_crown | The War of the Hollow Crown | start | — | a royal host facing the risen dead before a capital | P | *The Second Age of Erdae* §IX–X, *The Fall of Aenor* |
| 311 | fall_of_aenor | The Fall of Aenor | start | — | pale banners raised over a fallen capital | M | *The Fall of Aenor*, *Elzons Order*, *Middle Lands and Aenor* |
| 312 | thousand_oaths | The Night of a Thousand Oaths (Thousand Oaths) | rev \| hub | — | cat | M | *Afrits Ascension*, *The Second Age of Erdae* §VIII |

#### 4. The Third Age (`third_age`)

| Id | Key | Title | Unlock | Later parts | Plate | St. | Sources |
| ---: | --- | --- | --- | --- | --- | --- | --- |
| 401 | third_age | The Third Age | start | — | a grey occupied city under pale lanterns | M | *The Third Age of Erdae*, *Third Age Canon Register* |
| 402 | elzons_order | Elzon's Order | start | — | a pale fortress above tribute roads | M | *Elzons Order* (the Pale Regency, proposed) |
| 403 | long_occupation | The Long Occupation | start | — | cat | P | *The Third Age of Erdae* (proposed 1,260-year chronology) |
| 404 | unconquered_forest | The Unconquered Forest | start | — | elven wardens at a forest edge, the dead halted at the trees | E | *Third Age Canon Register*, *Varner*, *The Elven Refusal* |
| 405 | black_roots | The Black Roots | start | — | black veins spreading beneath a burial field | P | *Black Roots* |
| 406 | lantern_chain | The Lantern Chain | start | — | cat | P | *Lantern Chain* |
| 407 | war_of_unbinding | The War of Unbinding | start | — | rebels breaking a carved anchor-stone | P | *War of Unbinding* |
| 408 | last_tithe | The Last Tithe | start | — | a black light collapsing over a capital | M | *The Last Tithe*, *Elzon*, *The Necromancy of Elzon* |
| 409 | deliverers_rescue | The Deliverer's Rescue | start | rev: the rescuer was Afrit, and what the rescue won him | a radiant shield over a fleeing crowd, no face | M | *The Last Tithe*, *Afrit the Deliverer*, *The Third Age of Erdae* |

#### 5. The Fourth Age (`fourth_age`)

| Id | Key | Title | Unlock | Later parts | Plate | St. | Sources |
| ---: | --- | --- | --- | --- | --- | --- | --- |
| 501 | fourth_age | The Fourth Age | start | — | Parim's towers above the Great Lake in sunlight | M | § Prologue, *Fourth Age Chronology* (year count, months), *Fourth Age Canon Register* |
| 502 | restoration | The Restoration | start | — | a coronation at Parim before rebuilt walls | M | *Harion the Restorer (proposed)*, *Fourth Age Chronology* I |
| 503 | charters_of_parim | The Charters of Parim | start | — | cat | P | *Fourth Age Chronology* I |
| 504 | varners_unbinding | Varner's Unbinding | start | — | ploughmen in old grave-fields under a wizard's lantern | M | *Fourth Age Chronology* I, *Varner* |
| 505 | wall_accord | The Wall Accord | start | F:zin_wall_accord_broken: the accord broken by war | cat | P | *Fourth Age Chronology* I |
| 506 | concord_council | The First Concord Council | start | — | a hall of dominion banners; university cloisters | P | *Fourth Age Chronology* II |
| 507 | leren_union | The Union of the Leren Crowns (The Leren Union) | start | — | cat | P | *Fourth Age Chronology* II |
| 508 | far_crowns | The Far Crowns Grow Rich | start | — | a caravan crossing eastern dunes | P | *Fourth Age Chronology* II (caravan roads, Triton charts, Coldor) |
| 509 | jubilee | The Thousand-Year Jubilee | start | — | a feast in Parim under sun-marked temple banners | P | *Fourth Age Chronology* II |
| 510 | blessed_centuries | The Blessed Centuries; after rev \| hub: The Kingdom Behind the Throne | start | rev \| hub: the Council governed through the kings | cat | M | § Prologue, *Fourth Age Chronology* III, *Afrits Hidden Council* |
| 511 | goldoroth_rises | The Rise of Goldoroth | start | — | orc war-banners over a Dark Lands hold | P | *Fourth Age Chronology* III |
| 512 | theft_of_necklace | The Theft of the Necklace | rev \| hub | — | a lone figure climbing out of a chasm, back turned | M | *Necklace of the Abyss*, *Sevrin the Unending (proposed)*, *Roka*, § II |
| 513 | western_wars | The Gunwaith–Girdon Wars | start | F:zin_west_truce_broken: the truce broken | reuse `grey_ford_truce` | P | *Fourth Age Chronology* III–IV, *The Campaign of 4A 1748* |
| 514 | toll_quarrel | The Toll Quarrel | start | F:zin_leren_withdrawal: what the quarrel became | reuse `strait_toll` | P | *Fourth Age Chronology* III |
| 515 | gilded_years | The Gilded Years | start | — | gilded halls, office-buyers queuing at a door | M | *Fourth Age Chronology* IV, *Golden King* |
| 516 | voices_at_edges | Voices at the Edges | start | — | reuse `black_ships_tale` | P | *Fourth Age Chronology* IV (the Mirolonese envoy, the black ships), *The Campaign of 4A 1748* |
| 517 | council_decides | The Council's Decision | rev \| hub | — | cat | P | *Fourth Age Chronology* IV |
| 518 | erdae_1748 | Erdae in 4A 1748 | start | — | Parim at dawn over the Great Lake | P | *The Campaign of 4A 1748* (the public face only: no Council, no hidden pressures named) |

#### 6. The End of the Age (`last_crowns`)

| Id | Key | Title | Unlock | Later parts | Plate | St. | Sources |
| ---: | --- | --- | --- | --- | --- | --- | --- |
| 601 | man_from_ice | The Man from the Ice | F:zin_eindil_awake | S≥2: the traders' road south | reuse `man_in_ice` | E | *The Journey of Eindil*, *Eindil*, § IV |
| 602 | king_without_house | The King Without a House | F:zin_eindil_war_king | — | reuse `war_king` | M | § IV (western episodes, proposed), *The Journey of Eindil* |
| 603 | golden_king_dies | The Death of the Golden King | F:zin_golden_king_dead | rev: the murder was Afrit's | reuse `king_is_dead` | E | *Golden King*, § III |
| 604 | plot_exposed | The Plot Against the King | F:zin_golden_king_plot_exposed | F:zin_golden_king_survives: the King lives; rev: whose plot it was | cat | P | *The Campaign of 4A 1748* (where history can turn), *Afrits Hidden Council* |
| 605 | deliverer_crowned | The Deliverer Crowned | F:zin_aurevan_crowned | rev: Afrit on Aenor's throne | reuse `coronation` | M | § III, *Aurevan the Deliverer* |
| 606 | storm_voyage | The Storm and the Islands | S≥5 | — | reuse `storm_wreck` | M | § IV (island legends, proposed), *The Journey of Eindil* |
| 607 | naming_at_gala | The Naming at Gala | heir | — | a spring in an old elven courtyard at night | M | § V, *Lorien*, *Mirror of First Rain (proposed)* |
| 608 | hall_of_horos | The Ambush and the Hall of Horos (The Hall of Horos) | F:zin_horos_dead, S≥8 | rev: the intruder was Afrit, son of Ein, and he fled wounded | reuse `yeldenne_hall` | E | § VI, § VII, *Horos*, *Castle of Yeldenne and Glo* |
| 609 | unheeded_warnings | The Unheeded Warnings | S≥8 | F:zin_afrit_impostor_denounced: denounced as an impostor | a cloaked stranger speaking in a crowded square, seen from behind | M | § VIII, *Alleria of Selen* |
| 610 | last_crowns | The War of the Last Crowns (The Last Crowns) | F:zin_war_of_last_crowns | — | reuse `last_crowns` | M | *War of the Last Crowns* |
| 611 | western_crossing | The Western Crossing | F:zin_western_crossing | F:zin_west_parim_taken: Parim taken; F:zin_west_evacuated: the evacuation | reuse `western_crossing` | E | *War of the Last Crowns*, § IX |
| 612 | north_apart | The North Stands Apart | F:zin_leren_withdrawal | — | cat | E | *War of the Last Crowns*, § IX |
| 613 | volgan_marches | Volgan Marches North | F:zin_volgan_marches | F:zin_mirolon_fallen: the fall of Mirolon | a dark host pouring through mountain passes | E | *War of the Last Crowns*, *Volgan* |
| 614 | host_from_east | The Host from the East | F:zin_eastern_invasion | — | eastern banners crossing the rift sea | E | § IX |
| 615 | dead_of_mistake | The Dead of the Mistake | F:zin_zol_rising | F:zin_volgan_zol_clash: the dead against the dead | reuse `zol_rising` (shapes indistinct) | E | *Zol*, *War of the Last Crowns*, § IX |
| 616 | name_of_afrit | The Name of Afrit | F:zin_afrit_revealed | — | reuse `unmasking` | E | *Fourth Age Canon Register*, *Afrit* |
| 617 | king_of_east | The King of the East | F:zin_afrit_king_of_east, rev | — | reuse `eastern_court` | E | § IX, *Afrits Hidden Council* |
| 618 | dragon_return | The Return on the Dragon | F:zin_eindil_returned | — | reuse `dragon_return` | E | § X |
| 619 | varners_ward | Varner's Last Ward | F:zin_varner_dead | F:zin_volgan_struck_down_eindil: the stranger-king cast down by Volgan | a ward of light held against a dark tide | E | § X, *Varner*, *Golbran* (his survival here, proposed) |
| 620 | new_gods_gather | The Gathering of the New Gods (Gathering of the Gods) | F:zin_eindil_restored | — | a lamp that never went out; rain over ploughed fields | M | § XI, *Glernaen* |
| 621 | breaking_volgan | The Breaking of Volgan | F:zin_volgan_body_destroyed | F:zin_black_compact: the brief compact of the dark powers | reuse `volgan_broken` | E | § XII, *Volgan* |
| 622 | black_sky | The Old God Beneath the Black Sky (Beneath the Black Sky) | F:zin_zol_manifested | F:zin_zol_withdrawn: the withdrawal; F:zin_lorien_dead: Lorien's last battle | reuse `vast_shadow` | E | § XIII, *Zol*, *Lorien*, *Horos Sword* |
| 623 | second_betrayal | The Second Betrayal | F:zin_eindil_cast_down, rev | — | reuse `cliff` | E | § XIV, *The Last Battle in the Palace* |
| 624 | palace_battle | The Battle in the Palace | F:zin_afrit_dead, rev | F:zin_golbran_dead: Golbran's last gift | reuse `palace_battle` | E | *The Last Battle in the Palace*, § XV, *Afrits Collected Artifacts* (artifact names proposed) |
| 625 | king_of_men | The King of Men | F:zin_eindil_crowned | — | reuse `crown_of_aen` | E | § XVI |
| 626 | after_coronation | After the Coronation | F:zin_eindil_crowned | — | cat | M | *Fifth Age Seeds* (established consequences only) |
| 627 | ending_lost_cause | The Lost Cause Prevails | F:zin_ending_lost_cause | last page: the Chronicle of the Age lines | reuse `ending_lost_cause` | E | *Possible Endings* |
| 628 | ending_children | The Children of Volgan | F:zin_ending_children_of_volgan | last page: the Chronicle of the Age lines | reuse `ending_children_of_volgan` | E | *Possible Endings* |
| 629 | ending_ashen | The Ashen Throne | F:zin_ending_ashen_throne | last page: the Chronicle of the Age lines | reuse `ending_ashen_throne` | E | *Possible Endings* |
| 630 | other_ending | How the Age Ended | F:zin_ending_golden_court \| F:zin_ending_western_crown \| F:zin_ending_strait_master \| F:zin_ending_eastern_king \| F:zin_ending_unfinished | one part per outcome flag; last page: the Chronicle of the Age lines | cat | P | *The Campaign of 4A 1748* (proposed additional outcomes) |

#### 7. Figures (`figures`)

| Id | Key | Title | Unlock | Later parts | Plate | St. | Sources |
| ---: | --- | --- | --- | --- | --- | --- | --- |
| 701 | aen | Aen, First of His Name | start | — | an ancient king on a hill above his hosts | E | *Aen*, *The Ainu*, *Royal Line of Aen* |
| 702 | ein | Ein, Son of Aen | start | heir: father of Eindil; heir, rev: father of Afrit too, who was refused the throne | cat | M | *Ein*, *Royal Line of Aen* |
| 703 | eindil | The Man from the Ice; after heir: Eindil, Son of Ein | F:zin_eindil_awake | heir: his name and line; heir, rev: Afrit's brother; F:zin_glo_with_eindil; F:zin_eindil_restored; F:zin_eindil_cast_down, rev; F:zin_eindil_crowned | a cloaked figure on a snow ridge, from behind | E | *Eindil*, *The Journey of Eindil* |
| 704 | the_deliverer | The Deliverer | start | F:zin_aurevan_crowned: King of Aenor; rev: the Deliverer was Afrit | a sun-disc above a temple door, no face | M | *Afrit the Deliverer*, *Aurevan the Deliverer*, *New Gods* |
| 705 | afrit | Afrit | rev \| hub | F:zin_afrit_king_of_east; F:zin_afrit_dead | a cracked golden mask on dark stone | M | *Afrit*, *Fourth Age Canon Register*, *Afrits Ascension* |
| 706 | golden_king | The Golden King | start | F:zin_golden_king_dead: his death; rev: his murderer; F:zin_golden_king_survives: he lives | a heavy crowned man under too much gold leaf | E | *Golden King* |
| 707 | edran | King Edran | start | — | a weary king before many banners | M | *King Edran* |
| 708 | lorien | Lorien, King of the Gala | start | heir: he named the stranger; F:zin_lorien_dead: his death | reuse `gala_court` | E | *Lorien* |
| 709 | horos | Horos of Yeldenne | start | F:zin_horos_dead, S≥8: his death and his heart; F:zin_horos_endures: he held his hall | Horos standing with the blue sword, from the established description (A6) | E | *Horos*, *Horos Visual References* |
| 710 | varner | Varner | start | F:zin_varner_dead | an old wizard with a lantern among standing stones | E | *Varner* |
| 711 | golbran | Golbran | start | F:zin_golbran_dead | a small purple humanoid figure at a wizard's side | E | *Golbran* |
| 712 | alleria | Alleria of Selen | start | S≥8: she shelters the stranger; F:zin_afrit_dead: her arrow in the palace | a ranger drawing a bow at a forest edge | M | *Alleria of Selen* |
| 713 | volgan | Volgan | start | F:zin_volgan_marches; F:zin_volgan_body_destroyed: his body broken, his spirit's fate unknown | a storm-shrouded vast shadow over red desert, no clear face | E | *Volgan* |
| 714 | elzon | Elzon, the Great Necromancer (Elzon) | start | — | a pale robed shape among risen dead, face in shadow | M | *Elzon*, *The Necromancy of Elzon* |
| 715 | roka | Roka of the Abyss | start | — | a rhinoceros-headed giant in a deep chasm | E | *Roka* |
| 716 | agon | Agon | start | — | cat | E | *Agon* |
| 717 | king_of_demons | The King of Demons | start | — | cat | E | *King of Demons* |
| 718 | harion | Harion the Restorer | start | — | a crowned ranger before a rebuilt gate | P | *Harion the Restorer (proposed)* |
| 719 | merovan | Chancellor Merovan | start | rev \| hub: his seat on the Council; F:zin_aurevan_went_north: left to hold the seals | cat | P | *Chancellor Merovan (proposed)*, *Afrits Hidden Council* |
| 720 | sevrin | Sevrin the Unending | rev \| hub | — | cat | P | *Sevrin the Unending (proposed)*, *Necklace of the Abyss* |
| 721 | free_banners | The Free Banners of Dardan | start | — | cat | P | *First Age Proposed Characters* (Sirael, Taryn of Gunwaith, Senra of Triton's Islands, Brunek of the Stone Roads, Rovek of Dondor) |
| 722 | binding_spirits | Ithren and Maerul | start | — | cat | P | *First Age Proposed Characters*, *Second Age Proposed Characters* |
| 723 | vareth | Vareth the Pale | start | — | cat | P | *First Age Proposed Characters* |
| 724 | second_age_defenders | Defenders of the Second Age | start | — | cat | P | *Second Age Proposed Characters* (Avarin of Lerenwaith, Seron of Selen, Tavriel of the Magical Forest) |
| 725 | arelon | Arelon, Keeper of the Last Seal (Arelon) | start | — | cat | P | *Second Age Proposed Characters*, *The Fall of Aenor* |

#### 8. Peoples (`peoples`)

| Id | Key | Title | Unlock | Later parts | Plate | St. | Sources |
| ---: | --- | --- | --- | --- | --- | --- | --- |
| 801 | men | The Peoples of Men | start | — | a crowded crossroads market of many kinds of men | M | *Peoples of Erdae* |
| 802 | first_men | The First Men | start | — | tall ancient men in a ruined hall of giant stones | M | *The Ainu*, *Aen* |
| 803 | line_of_aen | The Line of Aen | start | heir: Ein's line returns; heir, rev: the two sons of Ein | cat | M | *Royal Line of Aen* |
| 804 | forest_elves | Elves of the Magical Forest | start | — | an elven council under great trees | M | *Peoples of Erdae*, *The Campaign of 4A 1748* |
| 805 | sunhot_elves | The Sunhot Elves | start | — | very tall elves on white-gold terraces | E | *Peoples of Erdae* |
| 806 | gala_elves | The Gala Elves | start | F:zin_lorien_dead: after Lorien | an ancient white court in southern light | E | *Peoples of Erdae*, *Lorien* |
| 807 | god_forest_keepers | The God Forest Keepers | start | — | cat | E | *Peoples of Erdae* |
| 808 | angels_demons | Angels and Demons | start | rev: Afrit's demons | Netherborn on a volcanic pass, seen far off | M | *Peoples of Erdae*, *Hierarchy of Being* |
| 809 | dwarves | The Dwarves | start | — | cat | E | *Peoples of Erdae* |
| 810 | giants | The Giants | start | — | giants beside a mountain road | E | *Peoples of Erdae* |
| 811 | ents | The Ents of Kilinti | start | — | tree-folk walking through a misty forest | E | *Peoples of Erdae* |
| 812 | yeti | The Yeti | start | — | cat | E | *Peoples of Erdae*, *Erdae and Its Regions* |
| 813 | mycids_arcanists | Mycids and Arcanists | start | — | cat | E | *Peoples of Erdae* |
| 814 | orcs_goblins | Orcs and Goblins | start | — | orc and goblin warbands at a hold gate | M | *Peoples of Erdae*, *Kingdoms Factions and Conflicts* |
| 815 | trolls_ogres | Trolls and Ogres | start | — | cat | E | *Peoples of Erdae* |
| 816 | the_dead | The Restless Dead | start | F:zin_zol_rising: the dead that ordinary weapons cannot end | mist over barrows, figures far away | M | *Peoples of Erdae*, *The Necromancy of Elzon*, *Zols Mistake*, *War of the Last Crowns* |
| 817 | dragons | The Dragons | start | F:zin_eindil_dragon_pact: a dragon given as an ally | dragons circling a high mountain | E | *Peoples of Erdae* |
| 818 | abyss_folk | The People of the Abyss | start | — | cat | E | *Roka*, *Necklace of the Abyss* |

#### 9. Lands and Places (`lands`)

| Id | Key | Title | Unlock | Later parts | Plate | St. | Sources |
| ---: | --- | --- | --- | --- | --- | --- | --- |
| 901 | erdae | Erdae | start | — | cat | E | *Erdae and Its Regions*, *Fourth Age Map of Erdae* |
| 902 | middle_lands | The Middle Lands | start | — | fields and forests around a great lake | M | *Middle Lands and Aenor*, *Erdae and Its Regions* |
| 903 | aenor_isle | Aenor Isle | start | — | cat | E | *Erdae and Its Regions* |
| 904 | cold_lands | The Cold Lands | start | — | a caravan on an ice road under a pale sky | E | *Erdae and Its Regions*, *The Campaign of 4A 1748* |
| 905 | west_lands | The West Lands | start | — | green hills crowded with small castles | E | *Erdae and Its Regions* |
| 906 | tritons_islands | Triton's Islands | start | — | cat | E | *Erdae and Its Regions* |
| 907 | north_lands | The North Lands | start | — | sea-green fleets in a narrow strait | E | *Erdae and Its Regions* |
| 908 | dark_lands | The Dark Lands | start | — | holds on a dark shore by a black-green sea | E | *Erdae and Its Regions*, *Kingdoms Factions and Conflicts* |
| 909 | magical_lands | The Magical Lands | start | — | a forest of silver and leaf-green light | E | *Erdae and Its Regions* |
| 910 | zols_mistake | Zol's Mistake | start | F:zin_zol_rising | reuse `black_isles_lights` | E | *Zols Mistake* |
| 911 | east_lands | The East Lands | start | — | domed cities by a rift sea | E | *Erdae and Its Regions* |
| 912 | south_lands | The South Lands | start | — | cat | E | *Erdae and Its Regions* |
| 913 | dead_lands | The Dead Lands | start | — | reuse `dead_lands_storm` | E | *Volgans Dead Lands* |
| 914 | islands_of_south | The Islands of the South | start | — | cat | E | *Erdae and Its Regions* |
| 915 | lands_of_sun | The Lands of the Sun | start | — | white-gold towers in hard southern light | E | *Erdae and Its Regions*, *Peoples of Erdae* |
| 916 | parim | Parim and the Great Lake | start | F:zin_west_parim_taken; F:zin_afrit_claims_erdae, rev | a lake harbour with merchant ships below the palace towers | M | *Middle Lands and Aenor*, § Prologue |
| 917 | selen | Selen | start | — | rangers at a forest road | E | *Selen* |
| 918 | great_wall | The Great Wall of Aenor | start | F:zin_wall_accord_broken | a stone wall running over hills toward mountains | M | *Fourth Age Chronology* I, *The Campaign of 4A 1748* |
| 919 | refuse_crown | Lands That Refuse the Crown | start | — | cat | E | *Middle Lands and Aenor*, *Great Powers and Relations* (the Cursed Lands and the Bloody Forest) |
| 920 | mirolon | Mirolon | start | F:zin_mirolon_fallen (plate `mirolon_fallen`) | reuse `mirolon_passes` | E | *Volgans Dead Lands* |
| 921 | nether | The Nether | start | — | a red sky over volcanic passes | E | *Nether* |
| 922 | abyss | The Abyss | start | — | cat | E | *Abyss* |
| 923 | furviatlon | Furviatlon and Šodolôro | start | — | cat | M | *Zols Mistake*, *Great Powers and Relations* |
| 924 | dragon_mountain | Dragon Mountain | start | — | a lone peak with dragons above it | E | *Peoples of Erdae* |
| 925 | dardan | The Field of Dardan | start | — | cat | M | *Battle of Dardan* (its place is never named) |
| 926 | castle_yeldenne | The Castle of Yeldenne | start | F:zin_horos_dead, S≥8: the empty hall (plate `castle_yeldenne_empty`) | a dark castle in deep snow | E | *Castle of Yeldenne and Glo* |

#### 10. Realms and Orders (`orders`)

| Id | Key | Title | Unlock | Later parts | Plate | St. | Sources |
| ---: | --- | --- | --- | --- | --- | --- | --- |
| 1001 | great_powers | The Crowns of Erdae | start | — | cat | W | *Great Powers and Relations*, *Kingdoms Factions and Conflicts* (Leren Compact, Northern Accord, Noris Treaty, Stabilo Pact, Dark Sea Accord), *The Campaign of 4A 1748* |
| 1002 | aenor_concord | Aenor and the Concord | start | — | dominion banners around a throne hall | M | *Middle Lands and Aenor*, *Great Powers and Relations*, *Fourth Age Chronology* |
| 1003 | golden_court | The Golden Court | start | — | cat | P | *The Campaign of 4A 1748*, *Fourth Age Chronology* IV |
| 1004 | lost_cause | The Lost Cause | start | F:zin_lost_cause_shield: shield of the Concord; F:zin_lost_cause_with_eindil: the heir's army | companies of the Lost Cause under a plain banner | M | *The Lost Cause*, *Kingdoms Factions and Conflicts*, *Golden King*, *Fourth Age Chronology* IV |
| 1005 | houses_first_light | The Houses of the First Light (Houses of the First Light) | start | rev \| hub: what the Houses became | reuse `houses` | P | *Houses of the First Light*, *The Second Age of Erdae* §VIII (the Houses of Refuge, proposed) |
| 1006 | worshipdom | The Worshipdom | start | rev \| hub: the hub of the Deliverer's network | reuse `hermitage` | P | *Fourth Age Chronology* III, *The Campaign of 4A 1748* |
| 1007 | hidden_council | The Hidden Council | rev \| hub | F:zin_afrit_dead: what became of it is not told | cat | M | *Afrits Hidden Council* |
| 1008 | southern_dominion | The Southern Dominion | start | F:zin_volgan_body_destroyed | demon banners at a desert fortress | W | *Great Powers and Relations*, *Volgans Dead Lands*, *Fourth Age Chronology* III |
| 1009 | narrow_strait | The Treaty of the Narrow Strait | start | F:zin_leren_withdrawal; F:zin_leren_treaty_honoured | cat | P | *Fourth Age Chronology* II, *The Campaign of 4A 1748* |
| 1010 | four_camps | The Four Camps | F:zin_golden_king_dead | rev: the Deliverer's Faithful named for what they were | reuse `thirty_days` | E | *Kingdoms Factions and Conflicts* (camp labels two-faced as the names spec says) |

#### 11. Relics and Wonders (`relics`)

| Id | Key | Title | Unlock | Later parts | Plate | St. | Sources |
| ---: | --- | --- | --- | --- | --- | --- | --- |
| 1101 | glo | Glo | start | F:zin_horos_dead, S≥8: Horos's heart, given away; F:zin_glo_with_eindil; F:zin_eindil_restored: the bridge of the gods; F:zin_horos_sword_broken; divergences: F:zin_glo_sealed, F:zin_glo_dimmed (Glo never passes to Afrit, O3) | a green crystal glowing before a dark throne | E | *Castle of Yeldenne and Glo*, *Glernaen*, *Horos* |
| 1102 | blue_sword | The Blue Sword of Horos (The Blue Sword) | start | F:zin_eindil_returned: struck into the earth; F:zin_volgan_body_destroyed; F:zin_horos_sword_broken: the shards | a huge blue blade across a stone table | E | *Horos Sword* |
| 1103 | necklace | The Necklace of the Abyss | start | rev \| hub: Afrit's greatest relic; F:zin_afrit_lost_necklace, rev: torn from him; F:zin_eindil_wears_necklace: worn by the new king, its price unknown | a heavy dark necklace on black stone | M | *Necklace of the Abyss* |
| 1104 | ring_of_doors | The Ring of Doors | rev \| hub | F:zin_afrit_lost_ring | cat | P | *Afrits Collected Artifacts* |
| 1105 | crown_witnesses | The Crown of Witnesses | rev \| hub | F:zin_afrit_lost_crown | cat | P | *Afrits Collected Artifacts* |
| 1106 | bracelet_seal | The Bracelet of the First Seal (Bracelet of the First Seal) | rev \| hub | F:zin_afrit_lost_bracelet | cat | P | *Afrits Collected Artifacts* |
| 1107 | mirror | The Mirror of First Rain | start | heir: what it showed the stranger; F:zin_mirror_stilled: the stilled spring | a moonlit spring in an elven courtyard | P | *Mirror of First Rain (proposed)* |

**Totals.** 180 entries; 138 open at the start, 42 gated (30 story entries, 10 entries behind `rev | hub`, the Four Camps behind `F:zin_golden_king_dead`, Eindil’s entry behind `F:zin_eindil_awake`). Entry plates: 125 (30 of them crops of catalog event generations); with 2 after-flag plates and 11 category plates, 138 plates.

#### Hard cases (worked)

These entries carry the most risk; their texts follow these outlines.

- **104 The Old Gods, 109 Zol.** Zol is the only Old God in Erdae, the God of Death; the Fading and Erdae's magic keep him from a body; his power grows slowly; servants sustain him and without them he could fade from Erdae. Never: what feeding is, who his servants are, who keeps Furviatlon, that he wants or will do anything.
- **108 Worship and Rank.** Before `rev` it uses only generic examples (a town's temple to a local spirit; Volgan called a god yet a Great Spirit). The Deliverer is not mentioned. The `rev` part adds Afrit as the great example and leaves his true order open.
- **409 The Deliverer's Rescue, 704 The Deliverer.** The public story as the temples tell it: the Deliverer shielded the people when Elzon fell and was hailed a New God of Deliverance, Protection and Renewal; his Houses keep grain, hospitals and birth rolls. Nothing doubts him before `rev`. The `rev` parts say the Deliverer was Afrit, son of Ein, and that whether he was ever a true New God is not known.
- **510 The Blessed Centuries.** The open text tells the centuries as the people remember them: kings reigned in peace; priests taught princes; the Houses kept the rolls. The `rev | hub` part and title tell the truth.
- **603 The Death of the Golden King.** Before `rev`: he died suddenly in Mistfall (when the flag fires on the historical date); the temples and the council named the Deliverer protector. After `rev`: Afrit arranged the death.
- **608 The Hall of Horos.** Before `rev` the intruder is "a crowned stranger from the south who came for Glo"; he wounded Horos from behind and fled bleeding when the Man from the Ice struck him. The `rev` part names him.
- **703 Eindil.** At `F:zin_eindil_awake`: found alive in the ice, no memory, extraordinary strength, unwilling to misuse it. With `heir`: Eindil, son of Ein, son of Aen. Never his age, the arm he loses, how or why he slept, or whether he or Afrit is the elder.
- **713 Volgan, 621 The Breaking of Volgan.** His manifested body is destroyed. Whether his spirit survives is not known (and under `zin_rule_volgan_spirit = UNRESOLVED` the text keeps that line; other rule values may add the mechanic's own line).
- **806 The Gala Elves.** Lorien's people; they fought at Dardan; they remember Edran's Folly. "Whether the Gala are kin to the Sunhot elves, no chronicle of men can say."
- **925 The Field of Dardan.** A wasteland where millions died and spirits bound Volgan. "No map of this age marks it, and the scholars do not agree where it lay."

## Implementation

### Files (all generated by the content builder; written through the shared atomic rewrite engine)

No vanilla file is overridden. Every game file below is staged by `tools/content/modules/chronicle.mjs` and written to the mod by `tools/content/apply.mts`.

| Path | Content |
| --- | --- |
| `tools/content/data/chronicle/categories.json`, `entries/*.json`, `coverage.json`, `foreword.json`, `future_terms.json`, `entry.schema.json` | Source data (section 10) |
| `docs/design/chronicle/source_index.json`, `canon_status.json` | Published by `node tools/content/chronicle.mjs index` and `status` |
| `tools/content/art/chronicle-jobs.mjs` (new) | Writes `$ZIN_ART/jobs/chronicle-jobs.json`: one job per plate (id `chronicle-<plate>`, aspect 8:3, subject, or `reuse` with the catalog key and crop box), the theme sheet and the sigil sheet, for `tools/content/imagegen.mjs` |
| `tools/content/modules/chronicle.mjs` | Check, emit; stages the plates and theme art from accepted sources with manifest lines in `art/source/chronicle_manifest.json` |
| `tools/content/chronicle.mjs` | Author CLI: index, draft, check, status |
| `tools/content/lib/fontmetrics.mjs`, `tools/content/lib/condlang.mjs` | Text measurement; unlock language |
| `tools/content/chronicle.test.mjs` | The builder checks of section 12 and their negative tests |
| `common/scripted_guis/zin_chronicle.txt` | `zin_chronicle` (window) and `zin_chr_button` (interim book button); `context_type = player_context`, `dirty = zin_ui_tick`, `ai_enabled = { always = no }` |
| `interface/zin_chronicle.gui` | `zin_chronicle_window`, `zin_chr_button_window` |
| `interface/zin_chronicle.gfx` | Theme sprites, sigils, 138 plate sprites |
| `common/scripted_triggers/zin_chronicle.txt` | `zin_chr_unlocked_<id>`, `zin_chr_part_<id>_<n>`, `zin_chr_heir_known`, `zin_chr_viewer_is_hub`, `zin_chr_cat_<n>_has_open` |
| `common/scripted_effects/zin_chronicle.txt` | `zin_chr_open`, `zin_chr_close`, `zin_chr_select_category`, `zin_chr_fill_slots`, `zin_chr_show`, `zin_chr_follow_link`, paging effects, `zin_chr_count_unread` |
| `common/scripted_localisation/zin_chronicle.txt` | `zin_chr_title`, `zin_chr_subtitle`, `zin_chr_body`, `zin_chr_plate`, `zin_chr_slot_<n>_title`, `zin_chr_link_<k>_label`, `zin_chr_cat_name`, `zin_chr_page_label`, `zin_chr_list_page_label` |
| `localisation/english/zin_chronicle_l_english.yml` | All Chronicle text and UI strings |
| `gfx/interface/zin/chronicle/` | Theme DDS files, `sigils/`, `plates/` |
| `tools/content/tests/ui/chronicle_*.json` | GUI scenarios (Acceptance) |
| `tools/content/tests/packages/chronicle.json` | `hoi4.package_check` manifest |

Until a flag's owning system is built, an entry or part behind that flag is still emitted: its trigger reads a global flag that is simply never set, so the entry stays hidden and no undefined name loads.

### Shared names this spec adds (to be registered in the contract additions)

| Name | Kind | Scope |
| --- | --- | --- |
| `zin_chr_open` | country flag | player country |
| `zin_chr_cat`, `zin_chr_entry`, `zin_chr_tpage`, `zin_chr_tpages`, `zin_chr_lpage`, `zin_chr_lpages`, `zin_chr_slot_1`…`_13`, `zin_chr_seen_<id>`, `zin_chr_unread`, `zin_chr_open_count`, `zin_chr_read_count` | variables | player country |
| `zin_chr_unlocked_<id>`, `zin_chr_part_<id>_<n>`, `zin_chr_heir_known`, `zin_chr_viewer_is_hub`, `zin_chr_cat_<n>_has_open` | scripted triggers | any (ROOT = viewer) |
| `zin_chr_open`, `zin_chr_close`, `zin_chr_select_category`, `zin_chr_fill_slots`, `zin_chr_show`, `zin_chr_follow_link`, `zin_chr_count_unread` | scripted effects | player country |
| `zin_chr_new_page_tt` | localisation key | event option tooltips |

Read, not owned: every story flag in the entry list, `global.zin_eindil_stage`, `zin_eindil_is_host`, `zin_afrit_is_hub`, `global.zin_ui_tick`, `zin_ui_close_panels`, `zin_loc_chronicle_*`, `zin_rule_volgan_spirit`.

### Integration items for other specs

1. [01_interface.md](01_interface.md): done in that spec (age button, `zin_ui_close_panels` clears `zin_chr_open`, the Realm panel's Chronicle button, the stranger's name through `zin_chr_heir_known`).
2. The world tick ([05_world_tension_and_endings.md](../03_gameplay/05_world_tension_and_endings.md)) calls `zin_chr_count_unread` once a month for every human player, with `zin_ui_refresh`.
3. [03_main_menu_and_frontend.md](03_main_menu_and_frontend.md): done (the bookmark description's last sentence).
4. [09_validation/01_acceptance.md](../09_validation/01_acceptance.md): add the Chronicle scenarios to G3 and the Linux case below to G4.
5. `zin_loc_eindil` (contract additions, lore digest) switches on `zin_eindil_named`; this spec and the journey spec make the name public only at stage 8 or to the host. The Chronicle uses `zin_chr_heir_known`; the lore digest's key should use the same condition.

### Variables, events, game rules, defines

No events, game rules or defines. The UI variables are listed above. Ending entries read the world spec's scripted localisation; the Volgan entry reads `zin_rule_volgan_spirit` for one line.

## AI

None. The AI never opens the Chronicle; `ai_enabled = { always = no }` on both scripted GUIs, and no mechanic reads any `zin_chr_*` name.

## Acceptance

1. **Count.** The data holds between 120 and 180 entries (180 at this spec), every category at least 5; the builder's schema, id and link checks pass.
2. **Coverage.** `node tools/content/chronicle.mjs check` reports every in-scope vault section cited or excluded with a reason, and no stale paragraph in a release build.
3. **Open at the start.** In the scenario `chronicle_start_aenor` (Aenor viewer, 1 Thaw 1748, no story flags), exactly the 138 entries marked `start` are reachable through categories, slots and links; the End of the Age category button is hidden; no visible string in any reachable title, subtitle, page or link contains "Afrit", "Hidden Council", "Kingdom Behind the Throne", "Eindil", "the Man from the Ice", "Sevrin", "Ring of Doors" or "Glo" with "heart".
4. **Hub.** In `chronicle_start_hub` (Worshipdom viewer, no flags) the 10 `rev | hub` entries are also reachable, and still nothing names Eindil.
5. **Story unlocks.** For each flag in the entry list, a scenario setting the historical flags up to that point unlocks exactly the listed entries and parts, and no other. `chronicle_heir_hidden` (`zin_eindil_named` set, stage 5, viewer not the host) shows "The Man from the Ice" and no "Eindil"; the same with stage 8 shows "Eindil, Son of Ein".
6. **Divergence.** `chronicle_king_survives` (`zin_golden_king_plot_exposed`, `zin_golden_king_survives`, no `zin_golden_king_dead`) shows entry 604 with the survival part and never entry 603; `chronicle_glo_sealed` shows the sealed part of Glo and no "carried by" text.
7. **Secrecy scans.** The builder's implication check and the compiler's secrecy scan both pass; each negative test of section 12 makes the build fail.
8. **Fit.** Every page measures at most 10 lines; every title and list title fits its box; `hoi4.gui_render` of `zin_chronicle_window` in the `long-text` state (the longest page, the longest title, the longest list title) shows no overflow at 1280 × 720, 1600 × 900, 1920 × 1080 and 2560 × 1440 at UI scale 1, and at 1920 × 1080 at UI scale 1.25.
9. **Window.** `hoi4.gui_inspect` reports no missing sprite, font or localisation key for `zin_chronicle_window` and `zin_chr_button_window`; the window lies inside 1280 × 720 below y = 118; the overlay collision check with the vanilla `topbar` window passes; Escape closes it; opening a mechanic panel closes it and opening it closes the panels.
10. **Encoding.** The localisation file has a BOM and only Windows-1252 characters; "Šodolôro" appears and "Šodolôrō" does not.
11. **Art.** All 138 plates and the theme sprites resolve to DDS files of the declared sizes with accepted provenance; the art review checklist is recorded for each; no plate breaks the plate rules of section 8.
12. **Validators.** `hoi4.script_validate` on the four generated `common/` files reports no syntax, scope or command error; `hoi4.package_check` with `tools/content/tests/packages/chronicle.json` reports zero `absent` and `shadowed`.
13. **Determinism.** Two builds are byte-identical.
14. **Linux run** (G4). As Aenor on 1 Thaw 1748: open the Chronicle from the book button, select every visible category, page through three multi-page entries, follow two links, close with Escape; run 60 days; open it again (the unread marker clears when the entries are read); save, reload, open it on the same page. No crash; no `error.log` line from a Chronicle file. Repeat the open-and-browse step as the Worshipdom.

## Open questions

Each proceeds on the proposal; the owner may overrule.

1. **Hub exception.** The hub reads its private record (10 entries) from the start, as the contract's secret rule allows for text shown only to Afrit's own country (proposed).
2. **When the heir's name is public.** Stage 8 or the host (`zin_chr_heir_known`), as the journey spec says (proposed; integration item 5).
3. **Framing.** "The histories kept by the scholars of Parim and Selen" is the in-world voice (proposed).
4. **Proposed figures.** The First and Second Age proposed characters (entries 721–725) appear as history, labelled proposed in the data (proposed; PROGRAM §5).
5. **Main menu.** A main-menu codex is impossible; the bookmark sentence and the loading-tip quotations are the substitute (proposed).
6. **Shortcut.** No key opens the Chronicle (proposed).
7. **Spoiler rule.** No game rule opens every entry, because it would break the secret for everyone in a multiplayer game (proposed).
8. **Gauge of completeness.** The footer shows "x of y read" over open entries only, so it never hints how much is still hidden (proposed).
