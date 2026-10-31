# Interface design system

**Status:** Proposed (31 October 2026, UI overhaul stage 1). Nothing here is accepted until the owner picks one of the three visual directions in `docs/plans/ui_overhaul/directions/` and reviews this text. **Requirement:** the owner's interface brief of 31 October 2026 (complete UI overhaul). **Supersedes, once accepted:** the "visual language" of [02_full_ui_reskin.md](02_full_ui_reskin.md) §3 (which becomes direction A's material table) and the per-mechanic frames of [01_interface.md](01_interface.md) §12. **Audit behind it:** [docs/plans/ui_overhaul/01_audit.md](../../plans/ui_overhaul/01_audit.md). **Work plan:** [docs/plans/ui_overhaul/02_plan.md](../../plans/ui_overhaul/02_plan.md).

## Purpose

The audit found that ZIN's interface is not one system: vanilla windows wear sliced theme-sheet textures fitted to vanilla outlines, ZIN's own panels use a separate frame, the same 175 catalogue pictures stand for about 3,000 different concepts, 648 technology, equipment and unit sprites show a window frame as their icon, and 280 vanilla content pictures still reach the screen. This document fixes the rules every surface follows, so that every window, icon and control reads as a part of the same game, and it says for each rule how it is checked.

It is written in two layers:

1. **Structure** (hierarchy, spacing, typography roles, states, icon rules, panel levels, checks). These hold whichever direction the owner picks.
2. **Material tokens** (the concrete colours, textures and ornaments). One column per direction; the chosen column becomes the token set and the others are deleted.

## Lore basis

| Fact | Status | Source |
| --- | --- | --- |
| Aoaz in 4A 1748 has known peace for seventeen centuries; its realms are crowns, dominions, clans and island lordships, not modern states | established / campaign note | vault *The Campaign of 4A 1748*; [02_full_ui_reskin.md](02_full_ui_reskin.md) lore basis |
| Realm banners are hand-made: few colours, flat cut-cloth (appliqué) and embroidered shapes, bold silhouettes, a deep field and a cultural hem, in the spirit of the Lord of the Rings banners but never copied | owner decisions K53, K63, K65 | [INTEGRATION_DECISIONS.md](../INTEGRATION_DECISIONS.md) |
| Every realm's sign comes out of its own ancient history; relic objects go on a banner only when they are the realm's direct identity | owner decisions K67, K68 | `tools/content/data/world/history/*.json` (`roots`, `sign`), [realm_roots](../02_lore/realm_roots/) |
| Portraits are painted, imperfect, varied; non-human peoples keep their own anatomy | owner decisions K54, K57 | portrait pipeline |
| Every picture is image-generated with gpt-6-luna; code only slices, resizes and converts; nothing from other mods | owner rules, K50 | CLAUDE.md, [01_art_pipeline.md](../08_art_and_assets/01_art_pipeline.md) |
| The chrome is shared by every realm and is visible from the main menu, so it shows no faith, no realm, no dark power, no figure, no lettering, no veiled sun, no sigil of Zol | spec rule | [02_full_ui_reskin.md](02_full_ui_reskin.md) §1.4, §1.5, §3.6 |
| The secret rule: no text a non-Worshipdom player can read names Afrit before `zin_afrit_revealed` | spec rule | [00_shared_contract.md](../04_mechanics/00_shared_contract.md) |
| The Chronicle of Aoaz is the in-world record of the age | spec (Ready) | [04_chronicle_codex.md](04_chronicle_codex.md) |

The three directions draw on these facts differently: **A, the Chancery**, on the old and calm court (the existing reskin language, simplified); **B, the Banner Hall**, on the realms' hand-made banners (the same craft as K63 to K65, so flags, emblems and chrome become one family); **C, the Chronicle**, on the illuminated record of the age (high-contrast reading surfaces and ink-seal icons).

## Principles

1. **One system.** Vanilla-derived and ZIN windows use the same panel levels, the same frame, the same title band, the same buttons, the same close control and the same icon frames. There are no per-mechanic window materials; a mechanic's identity lives in its header art, its accent strip and its icons (section 6.4).
2. **One concept, one icon.** Every distinct concept a player can see has its own picture. Reuse is allowed only by the deliberate rules of section 4.3 and is recorded.
3. **Hierarchy first.** Each window has one title, at most three section levels, one primary action per section, and a reading surface where long text is read. The eye lands on state, then pressure, then action (the content budget of the `hoi4-scripted-gui` skill applies to every ZIN window).
4. **Readable before beautiful.** Text contrast, size and space are checked by script on renders (section 9); ornament never sits under text.
5. **Quiet chrome, loud content.** Chrome is low-noise and neutral; colour, story and drama come from content (flags, portraits, event pictures, icons, the Gathering Dark).
6. **Spoiler-free at every date.** Inherited unchanged from [02_full_ui_reskin.md](02_full_ui_reskin.md) §1.5 and §3.6.
7. **Layouts may change.** Replacing textures inside vanilla layouts (spec 02 principle 1) is not enough to fix the hierarchy and clipping problems the audit found. A vanilla `.gui` override is allowed when a render shows a layout defect that textures cannot fix; every override is listed in the plan with its reason and checked for dropped element names (builder check 8 is extended to every override). This needs the owner's acceptance (open question 1).

## 1. Colour tokens

Tokens are named by role, not by colour, so the rules stay the same whatever direction is chosen. The values below are design targets for prompts, cell selection and review; code never paints them on generated art, but the deterministic checks of section 9 measure rendered pixels against them.

### 1.1 Semantic tokens

| Token | Role | A Chancery | B Banner Hall | C Chronicle |
| --- | --- | --- | --- | --- |
| `surface.window` | Window body | walnut `#2E2219` | dyed wool, deep woad-black `#1F2430` | slate `#2A3036` |
| `surface.section` | Section panel inside a window | walnut deep `#1E1610` | wool deep `#171B24` | slate deep `#20252A` |
| `surface.inset` | Lists, wells, sunken rows | `#17110C` | `#12151C` | `#181C20` |
| `surface.reading` | Long text: event body, focus and spirit descriptions, the Chronicle | vellum `#F2E7CF` | undyed linen `#E9DFC8` | vellum `#F1E8D2` |
| `surface.raised` | Hover row, raised plate | `#4A3626` | `#2C3344` | `#3A424A` |
| `border.frame` | Outer window frame | bronze `#A8814A` | gold-thread cord `#C8A35A` | inlaid bronze `#9C7A48` |
| `border.rule` | Section dividers | bronze shadow `#7A5A30` | braided cord `#8C6E3E` | double ink line `#4A4038` on reading, `#6B7680` on slate |
| `accent.gilt` | Selected rim, focus in progress, primary button rim | gold `#D9B562` | gold thread `#E0BE6A` | gold leaf `#D8B45C` |
| `text.primary` | Body text on dark surfaces | `#F4ECDC` | `#F1EADB` | `#F2EDE2` |
| `text.secondary` | Labels, captions | `#C3B091` | `#BFB49C` | `#B9C0C6` |
| `text.disabled` | Disabled labels | `#7D7366` | `#77706A` | `#737B82` |
| `text.ink` | Text on `surface.reading` | `#2A1F17` | `#2B2118` | iron-gall `#231B14` |
| `text.title` | Window and section titles | `#E9C260` | `#EBCB78` | `#F2EDE2` with rubric `#A8372C` initial |
| `state.good` | Gains, completed, allowed | verdigris `#76B262` | weld green `#7DB56A` | verdigris `#6FAE6A` |
| `state.warning` | Thresholds, caution | amber `#E28C34` | weld yellow `#E3A23A` | amber `#E09A3C` |
| `state.danger` | Losses, war, blocked | cinnabar `#DE5240` | madder `#D9503E` | rubric `#D4533F` |
| `state.info` | Links, map selection | lapis `#84BAE2` | woad `#86AEDC` | lapis `#86B4DE` |

The text colour codes (`§W`, `§Y`, `§G`, `§R`, `§O`, `§C`, `§B`, `§g`, `§b`) keep their vanilla meaning and move to the token values through the additive `interface/zz_zin_textcolors.gfx` of spec 02 §3.4 (not yet built; plan step F2). `§Y` and `§H` map to `text.title`, `§G` to `state.good`, `§R` to `state.danger`, `§O` to `state.warning`, `§C` and `§B` to `state.info`, `§W` to `text.primary`, `§g` to `text.secondary`, `§b` to `text.ink`.

### 1.2 Fixed colour families (shared by all directions)

| Family | Values | Rule |
| --- | --- | --- |
| Ideologies (Light, Dominion, Shadow, Wild) | spec 02 §3.5 | Used only for ideology emblems, party swatches, map and charts; never for chrome |
| The Gathering Dark (10 tiers) | a single cold-violet ramp from `#6A6F86` to `#3A1E4A` with a red-ember top tier `#8C2A2A` | Used only by the Gathering Dark readout, its map overlay and its super events |
| Realm colours | the country colours of `common/countries` | Used only for flags, map and the realm's accent strip in its own panels |
| Mechanic accents | one accent per mechanic panel (court gold, council ash, dominion storm, watch stone, strait sea-green, presence black, horde ember, accord sea) | Only the 4 px header accent strip and the header art; never the frame or the body (section 6.4) |

### 1.3 Use rules

- At most one accent colour per control; `accent.gilt` is the only highlight in chrome.
- `state.*` colours never fill a large surface; they appear as text, a 4 to 8 px inset lamp, a meter fill or an icon badge.
- Every state shown by colour also has a non-colour cue (shape, icon, text or position).

## 2. Typography

### 2.1 Faces

Only installed HOI4 bitmap fonts are used (`gfx/fonts/` of the game, 1.19.3): `hoi_36header`, `hoi_30header`, `hoi_24header`, `hoi_20bs`, `hoi_20b`, `hoi_18mbs`, `hoi_16mbs`, `garamond_14`, `garamond_16`, `garamond_24`, `cg_16b` (the engine's tooltip face), and the typewriter faces, which are aliased to Garamond by the additive font file of spec 02 §3.7 (plan step F2). No font is added.

| Role | Face | Size at 1080p | Case | Colour | Where |
| --- | --- | ---: | --- | --- | --- |
| Display | `hoi_36header` | 36 | Title case | `text.title` | Super events, main menu, Chronicle cover only |
| Window title | `hoi_24header` | 24 | Title case (no forced small caps) | `text.title` | Title band of every window |
| Section heading | `hoi_20bs` | 20 | Sentence case | `text.title` | Section bands, tab labels |
| Body | `hoi_18mbs` | 18 | Sentence case | `text.primary` or `text.ink` | Descriptions, event text |
| Label and value | `hoi_16mbs` | 16 | Sentence case | `text.secondary` label, `text.primary` value | Rows, meters, buttons |
| Reading (long text on `surface.reading`) | `garamond_16` | 16 | Sentence case | `text.ink` | Event bodies, Chronicle entries |
| Tooltip | `cg_16b` (engine) | 16 | Sentence case | engine colours remapped by §1.1 | All tooltips |

### 2.2 Rules

1. Nothing smaller than 16 px at 1920×1080 and UI scale 1, except numbers inside icons (14 px minimum).
2. Contrast: 4.5:1 for text under 20 px, 3:1 for 20 px and larger, measured on the render against the mean colour of the text's background box (spec 02 acceptance 6).
3. Line length on reading surfaces 45 to 75 characters; body text is left-aligned; only titles and button labels are centred.
4. No text sits on a busy texture: the luminance standard deviation of the background box behind any text element stays under 0.06 (on a 0 to 1 scale) after the text pixels are masked.
5. Long-text renders: every text element stays inside its plate or window (`containedBy`), and wraps or truncates by design (`fixedsize`, `maxHeight`), never by being cut off by a neighbouring element.
6. Placeholder or engine keys (`leader_name`, `ideology`, `[dynamic_loc]`, raw localisation keys) never reach a shipped render; the render review fails on any visible key.
7. The calendar, month names and the age prefix ("4A") follow [01_start_and_calendar.md](../00_foundation/01_start_and_calendar.md); the vanilla Gregorian date format with a 1936–1939 year never appears.

## 3. Spacing, grid and composition

| Token | Value (1080p, UI scale 1) | Use |
| --- | ---: | --- |
| `space.unit` | 4 px | Every offset and size is a multiple of 4 |
| `space.s` | 8 px | Between a label and its value; icon to text |
| `space.m` | 12 px | Between rows of controls; inside a section |
| `space.l` | 16 px | Window padding; between sections |
| `space.xl` | 24 px | Between major groups; around the reading surface |
| `frame.border` | 16 px (nine-slice corner 32) | Visible frame thickness of every window |
| `band.title` | 40 px | Title band height; close control 28×28 inset 8 from the top-right corner |
| `row.compact` / `row.standard` / `row.tall` | 24 / 32 / 48 px | List rows; one row height per list |
| `icon.xs` / `icon.s` / `icon.m` / `icon.l` | 16 / 24 / 32 / 64 px | Text icons / inline / row icons / feature icons; content icon families keep their engine sizes (section 4.2) |

Composition rules:

1. Every window aligns its content to a single left edge at `frame.border + space.l`; columns use the same gutter (`space.l`).
2. Title band, then a state strip (the one to three key values of the window), then the body, then the actions row at the bottom; actions align right, the primary action rightmost.
3. Windows fit 1280×720 below the top bar at UI scale 1 (spec 01 principle 5) and are checked at 1280×720, 1920×1080 and 2560×1440 (UI scale 1) and 1920×1080 at UI scale 1.25.
4. No element overlaps another element's click region unless it is a deliberate stack with exactly one visible member (the audit found the vanilla top bar's speed and pause buttons reported as overlapping stacks; those are engine stacks and are exempted by name, not by tolerance).

## 4. Iconography

### 4.1 One concept, one icon

A **concept** is anything a player can distinguish by name: a focus, a national spirit, a law, a decision, a decision category, a mission, a technology, a doctrine, an equipment type, a sub-unit, a trait, a building, a resource, a special project, an operation, an agency upgrade, a faction, a map mode, a top-bar value, a mechanic meter, an event moment.

Rules:

1. Each concept has its own icon id in a registry, `tools/content/data/ui/icon_registry.json` (plan step I1): concept id, family, sprite name, texture path, source generation id, and `sharedWith` when deliberate reuse applies.
2. A texture file serves exactly one concept unless the registry records one of the deliberate reuse rules below.
3. No placeholder ships: a concept without accepted art is a build error in release mode (the shared frame `gfx/interface/zin/frame.dds` serving 648 sprites today is exactly what this rule forbids).
4. No vanilla content picture reaches the screen (the reachability check, builder check 4, passes with zero findings).

### 4.2 Families and frames

Each family has one frame shape, one size, one rendering style and one background treatment, so the family is recognisable at a glance and different families are never confused.

| Family | Engine size (px) | Frame | Style of the picture inside | Count to produce (audit) |
| --- | --- | --- | --- | ---: |
| Focus | 89 × 80 (vanilla goal) | The focus plaque of the chosen direction (shared by all focuses) | A painted scene or object, one subject, readable at 50% | see plan I3 |
| National spirit, law, advisor idea | 64 × 64 class (idea) | Square idea frame | A painted emblem or object | see plan I4 |
| Decision | 26 × 29 class | Small round seal | Flat emblem, two to three colours | see plan I5 |
| Decision category | 51 × 40 and the category picture | Category tab | Emblem of the mechanic | see plan I5 |
| Technology | engine `_medium` size | Technology plate | The object or practice researched, painted | 285 |
| Equipment | engine `_medium` size and designer sizes | Equipment plate | The equipment itself, three-quarter view, same light | 151 (35 archetypes + 116 types) |
| Sub-unit | engine unit icon (2 frames) | Unit plate | The troop type as a symbol, not a figure scene | 65 |
| Counter | engine counter sizes | vanilla-green counter family (owner rule) | Bespoke per custom unit | per custom unit |
| Trait | 23 × 33 class | Trait banner | Flat emblem | 306 (unit leader, country leader, scholar) |
| Doctrine | engine doctrine sizes | Doctrine plate | Painted (86 generated; review only) | 0 new |
| Event picture | 210 × 176 | Event frame | Painted scene, one per event chain beat | see plan I6 |
| News picture | 397 × 153 | News frame | Painted scene | see plan I6 |
| Super event | full window | Super-event frame | Painted moment | 32 (art pending) |
| Map mode, top bar, alerts, text icons | engine sizes | Their reskin families | Flat emblems on the chrome material | reskin rows |
| Faction | engine faction logo sizes | Faction shield | The league's own sign (K67 rule) | 19 factions × 2 sizes |
| Realm sign | flag sizes | Banner | K65/K67 banners | flags workstream |

### 4.3 Deliberate reuse (the only allowed kinds)

| Rule | Example | How it is recorded and drawn |
| --- | --- | --- |
| **Same concept, two surfaces** | A focus that grants a spirit of the same name; a decision category and its picture | Registry `sharedWith`; the art is recut to each family's frame and size, never stretched into another family's frame |
| **Tiers of one concept** | Equipment marks I to III; spirit stages | One base picture plus a tier mark (pip or numeral seal) drawn into the art or as a separate overlay sprite; each tier is still its own sprite name |
| **Shared family badge** | The "Gathering Dark" badge on all its decisions | A small overlay sprite composited in the `.gui`, never baked into a different concept's picture |
| **Generic engine fallbacks** | `GFX_goal_unknown`, `GFX_idea_unknown` | One designed "unknown" icon per family; it never appears in a shipped ZIN render |

Everything else is accidental reuse: a different concept on the same texture, an icon from another family used as a stand-in (idea pictures as agency logos, special projects, operations, map-mode buttons and panel markers today), or a picture whose subject does not name the concept.

### 4.4 Icon meaning

1. The subject of an icon names its concept: a reader who knows the concept's name can say why the picture fits.
2. Icons of mutually exclusive choices differ in silhouette, not only in colour.
3. A realm-specific concept may carry the realm's sign (K67) only where the concept is about the realm's identity.
4. Icons never contain lettering, numerals (except tier marks), crosses, real-world symbols, or spoilers (the veiled sun and Zol rules of spec 02 §3.6 apply to icons visible before the reveal).

## 5. Panels, borders, textures and backgrounds

### 5.1 Panel levels

| Level | Token | Frame | Used for |
| --- | --- | --- | --- |
| 0 Window | `surface.window` | `border.frame`, nine-slice, corner 32, border 16 | Every top-level window, vanilla or ZIN |
| 1 Section | `surface.section` | thin `border.rule` | Groups inside a window |
| 2 Inset | `surface.inset` | none or 1 px shadow | Lists, wells, meter grooves |
| R Reading | `surface.reading` | thin `border.rule` | Long text only |

At most three levels are nested in any window.

### 5.2 Texture rules

1. Texture contrast is low: the luminance standard deviation of a panel body at 1080p is at most 0.05; grain or weave is visible only at close view.
2. No visible tiling: a repeated texture is generated seamless and checked by a seam score (mean absolute luminance step across the tile boundary at most 0.02).
3. No enlargement beyond 1.0: a source cell is never upscaled into a target larger than itself (the audit found blocky, pixel-doubled borders where small sheet cells were stretched to large frames).
4. Frames are nine-sliced from a cell whose painted border width is declared; corners are never stretched.
5. Backgrounds behind full-screen views (focus tree, research, the super event) are their own generated plates, one per view, never a stretched panel texture.

### 5.3 Ornament

Ornament comes from the neutral vocabulary of spec 02 §3.6 and from the chosen direction (A: mouldings, rivets, gilt corners; B: stitched hems, cord, grommets; C: bevels, inlaid lines, knotwork). Ornament is placed only in frame corners, title bands and dividers; it is never under text and never inside a list.

## 6. Controls and states

### 6.1 Buttons

| Kind | Size (1080p) | Use |
| --- | --- | --- |
| Primary | height 32, width from 120 | The one main action of a section |
| Secondary | height 32 | Other actions |
| Small | height 24 | Row actions |
| Icon button | 28 × 28 minimum click area | Close, toggle, sigil; always with a tooltip |
| Tab | height 32 | Up to four tabs per window |

### 6.2 States

| State | Rendering rule (all directions) | Non-colour cue |
| --- | --- | --- |
| Normal | base material, `border.frame` rim | — |
| Hover | face one step lighter (+8% luminance), rim brightens | brighter rim |
| Pressed | face one step darker (−10%), content offset 1 px down | inset shadow |
| Disabled | desaturated face (saturation ≤ 15%), no rim, label `text.disabled`, the cursor shows not-allowed via tooltip reason | missing rim and dimmed label |
| Selected | `accent.gilt` rim 2 px, face as normal | gilt rim |
| Warning | `state.warning` inset lamp at the left of the label | lamp shape |

Frame order in every multi-frame button sprite follows the vanilla sprite (normal, hover, pressed[, disabled]); ZIN sprites use the same order. A control that cannot be used is visibly disabled with a reason tooltip, or hidden if the reason would spoil the story (spec 01 principle 2).

### 6.3 Tooltips and dialogs

- Tooltip: the engine `ToolTip` sprite reskinned as a level-0 panel with a 1 px `border.frame`; width 300 to 420 px; first line the name in `§H`, then two to four lines; effects and costs after a blank line; no tooltip longer than 12 lines except engine-generated modifier lists.
- Dialog (confirm, popup, diplomacy request): level-0 panel, title band, one to three lines of body, buttons right-aligned, the confirming action rightmost and primary; destructive actions use `state.danger` text, not a red button face.
- Notifications (alerts, message popups): alerts keep the engine sizes and use one alert frame family; each alert meaning has its own emblem (alert frames in `data/ui/alert_frames.json`).

### 6.4 ZIN windows and mechanic identity

- Every ZIN window is a level-0 window with the shared title band and close control (`GFX_closebutton`).
- A mechanic's identity is carried by: a 600 × 96 header illustration, a 4 px accent strip in its mechanic accent under the title band, its own icons and meters. The eight themed frame materials of spec 01 §12 are not built; this rule replaces them (open question 2).
- Meters: one meter sprite family (groove, fill, threshold mark) shared by every ZIN gauge; the fill colour is the meter's semantic state or the mechanic accent; the exact value always appears beside it as text.
- The Aoaz bar (spec 01 §2, not yet built) uses `row.standard` height, `icon.s` icons and `hoi_16mbs` values.

## 7. Vanilla-derived and ZIN windows together

1. Both use the same level-0 frame texture (the reskin's `GFX_tiled_window*` replacements and ZIN's `GFX_zin_frame` become the same cell family).
2. Both use the same close control, title band, buttons, tabs, scroll bars and list rows (the reskin's `chrome_controls` and `chrome_bars` families), so a ZIN panel opened beside the politics view looks like a sibling.
3. Vanilla windows that show data ZIN replaced (calendar dates, ideology names, the world tension name, resources) show ZIN wording through `localisation/replace/` and the text sweep.
4. Vanilla windows whose layout carries a meaning ZIN does not have (DLC banners, 1936 bookmarks, carriers, nuclear, the faction logo picker) are overridden or hidden by the closed override list of the plan, never left with vanilla content.

## 8. Main menu, loading and full-screen views

The frontend follows [03_main_menu_and_frontend.md](03_main_menu_and_frontend.md) for layout; its chrome uses the level-0 window and the display face. Full-screen views (focus tree, research, doctrine, the super event) each get one generated background plate in the chosen direction's material, and their item plates (focus, technology) follow the icon family frames of section 4.2.

## 9. Acceptance checks

Each rule has a check. **Script** checks are deterministic and run in the builder or `tools/content/checks/ui_checks.mjs`; **render** checks run on `hoi4.gui_render` outputs (offline, tool-generated) and are scored by script where a metric exists, otherwise reviewed by eye against the review checklist; **Linux** checks run in the isolated Linux live run.

| Rule | Check | Kind | Pass condition |
| --- | --- | --- | --- |
| §4.1.2 one concept, one icon | `icon.registry`: resolve every concept's sprite to its texture; group by texture | script | every texture with more than one concept has a `sharedWith` registry entry of an allowed kind |
| §4.1.3 no placeholder | `icon.placeholder`: no shipped sprite resolves to `gfx/interface/zin/frame.dds` or to a texture listed as a placeholder | script | 0 findings |
| §4.1.4 no vanilla content | builder check 4 (reachability) | script | 0 findings (280 today) |
| §4.2 family frames and sizes | `icon.family_size`: every sprite of a family has the family's width, height and frame count; every family texture is used by that family only | script | 0 findings |
| §4.4.4 no lettering, crosses, spoilers | art review checklist on the icon review sheets | render (eye) | reviewer sign-off per sheet |
| §1.1 tokens | `tokens.sample`: the mean colour of each panel level and each button state on the reference renders lies within ΔE 10 of its token | render (script) | all within tolerance |
| §1.3 colour plus cue | review of state renders | render (eye) | every state distinguishable in greyscale |
| §2.2.1 minimum size | `text.size`: every text element's font is in the role table and not below 16 px (14 for icon numerals) | script (from `.gui` and the layout report) | 0 findings |
| §2.2.2 contrast | `text.contrast`: luminance contrast of text colour against the background box mean, from the render image and layout JSON (spec 02 acceptance 6) | render (script) | ≥ 4.5:1 (≥ 3:1 at 20 px+) |
| §2.2.4 quiet ground | `text.ground`: luminance standard deviation of the masked background box | render (script) | ≤ 0.06 |
| §2.2.5 overflow | `long-text` renders with `containedBy` expectations | render (script, MCP diagnostics) | no `GUI_TEXT_OVERFLOW`, no clipping finding |
| §2.2.6 no raw keys | `text.raw_keys`: render text runs matching a key pattern or `[dynamic_loc]` with scenario values supplied | render (script) | 0 findings |
| §3 grid | `layout.grid`: element positions and sizes of ZIN `.gui` files are multiples of 4 | script | 0 findings in ZIN-owned `.gui` |
| §3.3 fits 1280×720 | `hoi4.gui_render` at 1280×720 | render (script) | window inside the viewport below the top bar |
| §3.4 click regions | MCP `GUI_CONFLICTING_CLICK_REGIONS` | render (script) | 0 findings except the named engine stacks |
| §5.2.1 low-noise textures | `texture.noise`: luminance standard deviation of every level-0, 1 and 2 cell | script (on built files) | ≤ 0.05 |
| §5.2.2 seams | `texture.seam` on repeat-fit outputs | script | ≤ 0.02 |
| §5.2.3 no enlargement | `fit.scale`: every fit's scale factor from cell to target | script (fit log) | ≤ 1.0 |
| §6.2 states | `button.states`: every multi-frame button sprite has distinct frames (mean absolute difference ≥ 3% between normal, hover, pressed; disabled saturation ≤ 15%) | script | 0 findings |
| §6.2 disabled visible | hover, disabled and selected renders of every ZIN window | render (eye) | disabled reads as unusable with a reason |
| §6.3 tooltips | MCP tooltip previews (`scenario.tooltip`) for one control per window | render (eye + script bounds) | inside the viewport, ≤ 12 lines |
| §7 one frame family | `chrome.family`: every level-0 window texture in the reskin and ZIN gfx comes from the accepted chrome sheet set | script | 0 findings |
| whole system | Linux captures (spec 02 acceptance 9) at 1600×900 as Aenor and the Magical Forest | Linux | owner review of the capture sheet |

## Open questions

1. May ZIN override vanilla `.gui` layouts where a render shows a defect textures cannot fix (principle 7), instead of the closed list of spec 02 §2.3? Proposed: yes, each override listed and checked.
2. Do the eight themed mechanic frames of spec 01 §12 give way to one shared frame with mechanic header art and accent strips (section 6.4)? Proposed: yes.
3. Which visual direction (A Chancery, B Banner Hall, C Chronicle)? The owner chooses from the mock-ups and component sheets.
4. Should focus icons be per focus (about 4,800) or per focus with deliberate shared art inside one tree's repeated patterns (for example the same "fortify" focus in regional trees recut with the realm sign)? Proposed: per concept, where a concept is a distinct name and effect; identical generic focuses shared by many regional trees may share one icon each through the "same concept" rule, recorded in the registry.
