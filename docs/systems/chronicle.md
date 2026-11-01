# The Chronicle of Aoaz (in-game codex)

**Spec:** [04_chronicle_codex.md](../specs/07_interface/04_chronicle_codex.md). **Design system:** [07_design_system.md](../specs/07_interface/07_design_system.md) §1.4 (Chronicle theme, owner decision K70). **Builder:** `tools/content/modules/chronicle.mjs`. **Lane:** UI overhaul W9 (handoff [W9.md](../plans/ui_overhaul/handoffs/W9.md)).

## What it is

One scripted window in which a player reads the history of Aoaz: the order of being, the fallen realms before Aen, the four ages, the end of the age, figures, peoples, lands, every realm's roots and sign, orders and relics.
It opens from the age on the Aoaz bar ("4A 1748").
It shows and never decides: its buttons only select categories, entries and pages; no mechanic reads a `zin_chr_*` name; the AI never opens it.

Thirteen categories, 343 entries: 188 written from the lore vault (the spec's eleven categories, Kusven added to Figures, and the six fallen realms with an opening entry, owner decision K64), and 155 Roots and Signs entries built from the regional histories (`tools/content/data/world/history/*.json`, owner decision K67).

## How it works

1. **Data.** `tools/content/data/chronicle/`: `categories.json` (order, names, sigil and plate subjects), `entries/<category>.json` (authored entries; schema in spec §10), `realm_ids.json` (stable ids of the generated realm entries, `node tools/content/chronicle.mjs ids`), `foreword.json`, `axioms.json` (facts of the mechanics the secrecy check may assume, each with its reason), `future_terms.json`, `coverage.json` (vault sections deliberately not cited, each with a reason), `codex_sheet.json` (the theme sheet).
2. **Unlocks.** Each entry and each later part has a condition in the unlock language of `tools/content/lib/condlang.mjs` (`start`, `F:<global flag>`, `rev`, `hub`, `heir`, `S>=n`, `D:<fallen realm>`, `,` and `|`). The builder compiles them to scripted triggers (`zin_chr_unlocked_<id>`, `zin_chr_part_<id>_<n>`). Only global flags decide, plus the viewer tests `hub` (`zin_afrit_is_hub`), `heir` (`zin_chr_heir_known`: named, and stage 8 or the host) and `D:` (the named branch of the deep past's category titles, copied from `modules/deep_past.mjs`'s scripted localisation). Hidden entries are absent, never greyed out.
3. **Checks** (every build and `node tools/content/chronicle.mjs check`): ids, keys, links, conditions (later parts imply their entry's unlock); secrecy by implication (Afrit terms need `rev | hub`, Eindil needs `heir`, Glo as a heart needs `F:zin_horos_dead, S>=8`, fallen-realm names need their gate, no end-of-age term in open text), the knowledge-layer register's sealed, mystery and gated rules (`docs/lore/references/knowledge_layers.md`; an open question said as open passes), banned and meta words, Windows-1252, page fit measured with the installed fonts' metrics (`tools/content/lib/fontmetrics.mjs`; Garamond 16 at 428 px, 10 lines), title widths, vault sources and their hashes (stale paragraphs warn, fail with `ZIN_RELEASE=1`), and coverage of every in-scope vault section. Sentences of the regional histories that a rule catches are left out of the realm entries and listed in the build log.
4. **State** (per player, on the player's country): flag `zin_chr_open`; variables `zin_chr_cat`, `zin_chr_entry` (0 = Foreword), `zin_chr_tpage`, `zin_chr_tpages`, `zin_chr_apage` (absolute page), `zin_chr_lpage`, `zin_chr_lpage_shown`, `zin_chr_lpages`, `zin_chr_unread`, `zin_chr_open_count`, `zin_chr_read_count`; arrays `zin_chr_list` (the entry ids of the list page) and `zin_chr_list_new`; read flags `zin_chr_read_<id>_<part>` (a part is read once its entry is shown while the part is unlocked; this replaces the spec's `zin_chr_seen_<id>` counts so that a part unlocked out of order is still marked new).
5. **Effects** (`common/scripted_effects/zin_chronicle.txt`): `zin_chr_open` (closes the mechanic panels of `lib/mech_court_gui.mjs` `PANEL_FLAGS`), `zin_chr_close`, `zin_chr_toggle`, `zin_chr_select_category`, `zin_chr_fill_slots`, `zin_chr_show`, `zin_chr_resolve_page`, `zin_chr_follow_link_<k>`, `zin_chr_find_list_page`, the four paging effects and `zin_chr_count_unread` (also run monthly by the Aoaz bar's refresh, for the unread mark on the age).
6. **Text** (`common/scripted_localisation/zin_chronicle.txt`): `zin_chr_title`, `zin_chr_subtitle`, `zin_chr_body` (dispatched by groups of 16 entries, then by entry and absolute page), `zin_chr_plate` (sprite name), `zin_chr_slot_<k>_title` (dispatched by category), `zin_chr_link_<k>_label`, `zin_chr_cat_name`, `zin_chr_unread_line`. Localisation: `localisation/english/zin_chronicle_l_english.yml` (keys `zin_chr_<id>_title`, `_title_after`, `_short`, `_sub`, `_p<n>`, `_x<part>_p<n>`, `_plate`, `zin_chr_cat_<n>_name`, `zin_chr_foreword_*`, UI strings `ZIN_CHR_*`, and `zin_chr_new_page_tt` for story events).
7. **Window** (`interface/zin_chronicle.gui`, scripted GUI `zin_chronicle`): 980 × 560 at x −490, y 124 (`center_up`, moveable), below the Aoaz bar; rubric title cloth, the close button (Escape), thirteen category buttons with sigils and a "read" footer, thirteen list slots with selected and unread marks and list paging, the vellum page with plate, title, subtitle, body (`hoi4_typewriter16`, the Garamond alias), text paging and four "See also" links.
8. **Access.** The Aoaz bar's age (`zin_aoaz_age_button`, `modules/ui.mjs`, the bar part) toggles the window and carries the unread mark; the bar's panel buttons and the Realm button close it.

## Interaction with other systems

- Lore vault (`modules/lore.mjs`): read for sources, hashes and coverage; never copied into the game.
- Shared contract flags: read only. Entries behind flags that no system sets yet stay hidden.
- Deep past (`modules/deep_past.mjs`): the knowledge gates of the six fallen realms are its category-title conditions.
- Regional histories (`data/world/history`): the Roots and Signs entries. W2's "Roots and Sign" page of the politics view shows the same data for the viewer's own realm.
- The end-of-game Chronicle of the Age (`zin_world.110`) is separate; the ending entries carry their own closing paragraph.

## Icons and sprites

All in `interface/zin_chronicle.gfx`, textures under `gfx/interface/zin/chronicle/`, cut from the tracked theme sheet `art/source/ui/chronicle/ui-chronicle-codex.png` (gpt-6-luna) or fitted from the tracked plate bands `art/source/chronicle/plates/<plate>.png`:

| Sprite | Texture | Size | Use |
| --- | --- | --- | --- |
| `GFX_zin_chr_inset`, `GFX_zin_chr_page`, `GFX_zin_chr_title_cloth` | `inset.dds`, `page.dds`, `title_cloth.dds` | nine-slice | category and list wells, the vellum page, the title band |
| `GFX_zin_chr_category` (3 frames), `GFX_zin_chr_category_selected` | `category.dds`, `category_selected.dds` | 188 × 24 | category buttons |
| `GFX_zin_chr_row` (3), `GFX_zin_chr_row_selected` | `row.dds`, `row_selected.dds` | 240 × 24 | list slots |
| `GFX_zin_chr_link` (3) | `link.dds` | 204 × 24 | "See also" links |
| `GFX_zin_chr_arrow_prev`, `GFX_zin_chr_arrow_next` (3) | `arrow_prev.dds`, `arrow_next.dds` | 20 × 20 | paging |
| `GFX_zin_chr_new` | `new.dds` | 16 × 16 | unread mark (slots, the age) |
| `GFX_zin_chr_age_button` (3) | `age_button.dds` | 76 × 24 | the age on the Aoaz bar |
| `GFX_zin_chr_plate_frame` | `plate_frame.dds` | 440 × 168 | frame over the plate |
| `GFX_zin_chr_sigil_<category>` (13) | `sigils/<category>.dds` | 24 × 24 | category sigils |
| `GFX_zin_chr_plate_<plate>`, `GFX_zin_chr_plate_cat_<category>` | `plates/<plate>.dds` | 432 × 160 | entry and category plates |

The window frame is the shared `GFX_zin_frame_chronicle` (lane C3). Image jobs: `node tools/content/art/chronicle-jobs.mjs`, then `tools/content/imagegen.mjs`; `--band` cuts the tracked bands.

## Future plans and suggestions

- Owner review of the proposed paragraphs (`node tools/content/chronicle.mjs status` writes `docs/design/chronicle/canon_status.json`) and of the owner-approval plates (Horos, Eindil, Varner, Golbran, Elzon, Roka and the stranger's scenes), which show their category plate until approved.
- Story events may add `zin_chr_new_page_tt` to an option that unlocks a page.
- The Realm panel could carry a second Chronicle button (spec §9).
- The ending entries could quote the Chronicle of the Age's `zin_loc_chronicle_*` lines on their last page once that system writes them.
- A search or an index of names, and a "recently written" list for entries with new parts.
- Realm entries could show the realm's own flag in the plate once a flag-in-plate sprite exists.
