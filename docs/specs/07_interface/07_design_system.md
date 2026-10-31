# Interface design system

**Status:** Accepted (31 October 2026) under owner decisions K69 and K70 of [INTEGRATION_DECISIONS.md](../INTEGRATION_DECISIONS.md). **Acceptance basis:** K69 (the current interface is not approved; a complete design and implementation pass; vanilla layouts may be rebuilt; materials themed per area under shared rules; almost every focus its own icon; accidental reuse eliminated; "All surfaces must be changed") and K70 ("Mix by area": B Banner Hall, A Chancery and C Chronicle by area, one neutral family for tooltips, dialogs and buttons). The area mapping of §7 is the lead's mapping that K70 records as open to the owner's overrule; the token values are sampled from the three generated proposals in `docs/plans/ui_overhaul/directions/` (method in §1.1). **Supersedes:** the "visual language" of [02_full_ui_reskin.md](02_full_ui_reskin.md) §3 and the themed mechanic frames of [01_interface.md](01_interface.md) §12. **Audit behind it:** [01_audit.md](../../plans/ui_overhaul/01_audit.md). **Work plan:** [02_plan.md](../../plans/ui_overhaul/02_plan.md). **Machine-readable part:** `tools/content/data/ui/design_system.json` (tokens, window themes, font roles, icon family sizes, accepted chrome sheets, placeholders), read by the checks of §9.

## Purpose

The audit found that ZIN's interface is not one system: vanilla windows wear sliced theme-sheet textures fitted to vanilla outlines, ZIN's own panels use a separate frame, the same 175 catalogue pictures stand for about 3,000 different concepts, 648 technology, equipment and unit sprites show a window frame as their icon, and 280 vanilla content pictures still reach the screen. This document fixes the rules every surface follows, so that every window, icon and control reads as a part of the same game, and it says for each rule how it is checked.

It has two layers:

1. **Shared rules** (hierarchy, spacing, typography roles, states, icon rules, panel levels, checks). They hold in every area.
2. **Area themes** (materials, frames, headers, meters, tabs and their colour tokens). Three themes divide the windows by area (§7); a fourth, neutral family carries buttons, tooltips, dialogs and notifications everywhere.

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

The themes draw on these facts by area: **Banner Hall** on the realms' hand-made banners (the same craft as K63 to K65, so flags, emblems and the military chrome become one family); **Chancery** on the old and calm court where realms are governed; **Chronicle** on the illuminated record of the age, where knowledge, doctrine and the national path are written down.

## Principles

1. **One system, three materials.** Spacing, type, states, icon rules, panel levels and checks are the same everywhere. Materials, frames, header cloths and meters change by area (§7), never by mechanic or by realm inside an area. A mechanic's identity lives in its header art, its accent strip and its icons (§6.4).
2. **One concept, one icon.** Every distinct concept a player can see has its own picture. Reuse is allowed only by the deliberate rules of §4.3, recorded in `tools/content/data/ui/icon_shares.json`.
3. **Hierarchy first.** Each window has one title, at most three section levels, one primary action per section, and a reading surface where long text is read. The eye lands on state, then pressure, then action (the content budget of the `hoi4-scripted-gui` skill applies to every ZIN window).
4. **Readable before beautiful.** Text contrast, size and space are checked by script on renders (§9); ornament never sits under text.
5. **Quiet chrome, loud content.** Chrome is low-noise; colour, story and drama come from content (flags, portraits, event pictures, icons, the Gathering Dark).
6. **Spoiler-free at every date.** Inherited unchanged from [02_full_ui_reskin.md](02_full_ui_reskin.md) §1.5 and §3.6.
7. **Layouts may be rebuilt (K69).** A vanilla `.gui` may be overridden wherever the design needs it, keeping every element name the engine binds; every override is listed in the plan with its reason and checked for dropped names (builder check 8, extended to every override).
8. **Every surface changes (K69).** Next to nothing of vanilla stays visible. An element the engine draws and ZIN cannot replace is listed in the register of §10 with its reason; anything not in the register is ZIN's to change.

## 1. Themes and tokens

### 1.1 How the tokens were made

Each colour token is the mean colour of a named region of a direction image (`direction_<a|b|c>_<mockup|components>.png`), or the mean of the brightest or darkest 3% of the region's pixels where the token is a highlight or an ink; the region, its mode and its luminance deviation are recorded beside each token in `design_system.json`. Neutral tokens that average two directions say so. Values are design targets for prompts, cell selection and review; code never paints them on generated art, but the render checks of §9 measure rendered pixels against them (`tokens.sample`, ΔE 10).

Token names are roles, the same in every theme: `surface.window` (window body), `surface.section` (panel inside a window), `surface.inset` (lists, wells, grooves), `surface.reading` (long text), `surface.title` (title cloth or band), `border.frame` and `border.frame.highlight` (outer frame mid-tone and its lit edge), `text.title`, `text.ink` (text on the reading surface), `tab.normal`, `tab.selected`, `meter.fill`, `meter.groove`, `icon.plate`, `icon.rim`.

### 1.2 B Banner Hall (top bar, Aoaz bar, frontend, every military surface)

**Material.** Dyed wool in woad-black, madder red and woad blue; undyed linen as the reading cloth; couched gold cord on every hem and frame; appliqué emblems in stitched roundels; the title cloth is cut as a pennant along its lower edge. Weave is visible only at close view.

| Token | Value | Sampled from |
| --- | --- | --- |
| `surface.window` | `#141E25` | woad-black board wool (mock-up) |
| `surface.section` | `#102134` | woad header cloth (components) |
| `surface.inset` | `#13283F` | woad tab cloth |
| `surface.reading` | `#CEBCA6` | linen body (deviation 0.055: the generated cells must be calmer, §5.2) |
| `surface.title` | `#811F14`; deep `#6B0C0D` | madder title cloth |
| `border.frame` | `#B28339`; highlight `#FAEC98` | gold cord |
| `text.title` | `#F5EAD1` | title letters |
| `text.ink` | `#190D07` | ink on linen |
| `tab.normal` / `tab.selected` | `#13283F` / `#7D0309` | woad and madder tabs |
| `meter.fill` / `meter.groove` | `#760A0C` / `#C4B096`; progress `#176C9C` | madder fill on a linen groove; the woad-blue focus progress of the mock-up |
| `icon.plate` / selected | `#850B0E` / `#122E47` | madder roundel; woad plate of the selected focus |
| `icon.rim` | `#FBE68F` | gold cord of the roundel |

| Part | Specification |
| --- | --- |
| Frame | Nine-slice gold cord couched on a woad-black field, border 16, corner 32 with a small knotted cord diamond; no metal |
| Header | Madder title cloth 40 high across the window, pennant-cut lower edge (points at most 12 deep, outside the content box), title centred in `text.title`; a woad cloth variant marks a secondary panel |
| Meter | Linen groove inside a cord hem, madder fill, threshold marks as small stitched diamonds; value text beside it |
| Tabs | Woad cloth tabs with pennant points; the selected tab is madder with a brighter cord rim |
| Icons | Appliqué emblems in stitched madder roundels (round family frame); the focus plaque of the Banner Hall is the madder square of the mock-up |

### 1.3 A Chancery (politics, diplomacy, decisions, events, court and realm mechanics)

**Material.** Dark oiled walnut, one cast-bronze moulding with small gilt corner leaves and inset stones, cream vellum reading panels, painted miniature icons in round bronze bezels.

| Token | Value | Sampled from |
| --- | --- | --- |
| `surface.window` | `#2D1D13` | walnut band (mock-up) |
| `surface.section` | `#3B231A` | walnut title band (components) |
| `surface.inset` | `#251D17` | meter groove |
| `surface.reading` | `#E4D7C2` | vellum body (deviation 0.016) |
| `surface.title` | `#3B231A` | walnut title band |
| `border.frame` | `#634027`; highlight `#E0AB6D` | bronze moulding |
| `text.title` | `#FCF5DB` | title letters |
| `text.ink` | `#100301` | ink on vellum |
| `tab.normal` / `tab.selected` | `#372117` / `#DAC5A8` | walnut tab; the selected tab turns vellum |
| `meter.fill` / `meter.groove` | `#34633B` / `#251D17` | verdigris fill in a walnut groove |
| `icon.rim` | `#F9CE81` | bronze bezel highlight |

| Part | Specification |
| --- | --- |
| Frame | Nine-slice bronze moulding on walnut, border 16, corner 32 with a gilt leaf and a small green inset stone |
| Header | Walnut title band 40 high with a thin bronze rule under it; title centred; a small bronze scroll flourish either side, outside the text box |
| Meter | Walnut groove in a bronze casing with leaf terminals; verdigris fill (or the semantic state); value text beside it |
| Tabs | Walnut tabs in a bronze rail; the selected tab is a raised vellum tab with ink lettering |
| Icons | Painted miniatures in round bronze bezels for content icons; decision seals keep the small round decision family frame (§4.2) |

### 1.4 C Chronicle (research, technology, doctrines, the Chronicle of Aoaz, lore panels, the focus tree)

**Material.** Carved blue-grey slate frames with inlaid bronze lines and diamond studs, vellum reading leaves with rubricated initials, ink-engraved line icons in slate roundels, a rubric-red title cloth with a tooth-cut edge.

| Token | Value | Sampled from |
| --- | --- | --- |
| `surface.window` | `#2D353A` | slate frame |
| `surface.section` | `#2B3236` | slate tab |
| `surface.inset` | `#2C3235` | meter groove |
| `surface.reading` | `#E2D1B5` | vellum leaf (deviation 0.028) |
| `surface.title` | `#5C1714` | rubric title cloth |
| `border.frame` | `#78664C`; highlight `#CAB289` | inlaid bronze line |
| `text.title` | `#FBF3C8` | title letters |
| `text.ink` | `#060404` | iron-gall ink |
| `text.rubric` | the rubric red `#5C1714` for initials, `#8B5E34` for the initial's frame | rubricated initial |
| `tab.normal` / `tab.selected` | `#2B3236` / `#5A1C16` | slate; the selected tab is rubric red with a bronze rim |
| `meter.fill` / `meter.groove` | `#43775F` / `#2C3235` | verdigris fill in a slate groove |
| `icon.plate` / `icon.rim` | `#E2D1B5` / `#504737` | vellum roundel in a slate bezel |

| Part | Specification |
| --- | --- |
| Frame | Nine-slice carved slate with an inlaid bronze line and diamond studs at the corners, border 16, corner 32 |
| Header | Rubric title cloth 40 high with tooth-cut ends; title in `text.title`; a reading page may open with one rubricated initial (never in a list or a button) |
| Meter | Slate groove with bronze end studs; verdigris fill; value text beside it |
| Tabs | Slate tabs; the selected tab is rubric with a bronze rim |
| Icons | Ink-engraved line drawings on vellum in slate roundels (technology, doctrine, focus in the Chronicle area); one line weight, one touch of red or gold at most |

### 1.5 Neutral family (buttons, tooltips, dialogs, notifications, in every area)

**Material.** Blackened iron plate with a thin muted-bronze rim and four small corner studs. It is close to the Chancery and Chronicle buttons and sits between the warm wool and walnut and the cold slate, so a button reads the same in every window.

| Token | Value | Derived from |
| --- | --- | --- |
| `button.face` | `#282B2C` | mean of the Chancery (`#1E1D1C`) and Chronicle (`#33393C`) normal faces |
| `button.face.hover` | `#3F4140` | mean of the two hover faces |
| `button.face.pressed` | `#272725` | mean of the two pressed faces |
| `button.face.disabled` | `#3E3C3A` | mean of the two disabled faces |
| `button.rim.selected` | `#EBCA80` | mean of the two selected rims |
| `button.label` / hover / disabled | `#FCF9E3` / `#FAE993` / `#AFA89E` | labels of the two directions |
| `tooltip.surface`, `dialog.surface` | `#242422` | mean of the Chancery and Chronicle page grounds |
| `tooltip.rim` | `#CAB289` | Chronicle bronze inlay |

The Banner Hall's red cloth buttons of its component sheet are **not** used: K70 gives every area the neutral buttons. A Banner Hall window may set its primary action on the neutral plate with a madder accent lamp (§6.2 "warning" position), never on a red face.

### 1.6 Shared semantic tokens

| Token | Value | Role |
| --- | --- | --- |
| `text.primary` | `#F4ECDC` | body text on dark surfaces |
| `text.secondary` | `#C3B091` | labels, captions |
| `text.disabled` | `#7D7366` | disabled labels |
| `text.highlight` | `#EBCA80` | emphasis in text (`§Y`, `§H`); the neutral gilt of `button.rim.selected` |
| `state.good` | `#76B262` | gains, completed, allowed |
| `state.warning` | `#E28C34` | thresholds, caution |
| `state.danger` | `#DE5240` | losses, war, blocked |
| `state.info` | `#84BAE2` | links, map selection |

They are shared so that a text colour code means one thing everywhere. The codes keep their vanilla meaning and move to these values through the additive `interface/zz_zin_textcolors.gfx` of spec 02 §3.4 (plan lane C2): `§Y` and `§H` to `text.highlight`, `§T` to `text.title`, `§G` to `state.good`, `§R` to `state.danger`, `§O` to `state.warning`, `§C` and `§B` to `state.info`, `§W` to `text.primary`, `§g` to `text.secondary`, `§b` to `text.ink`. The highlight codes keep a distinct gold so emphasis stays readable in tooltips (lead decision, 31 October 2026, on lane C2's finding that `text.title` made them nearly equal to `§W`); `text.highlight` measures 9.84:1 on `tooltip.surface`, 10.70:1 on the Banner Hall window, 10.25:1 on the Chancery window, 7.90:1 on the Chronicle window and 9.03:1 on `button.face`. One text-colour table serves all themes, so `text.title` there is `#F5EAD1` (the Banner Hall value; the Chancery `#FCF5DB` and Chronicle `#FBF3C8` titles are the same warm white, slightly lighter).

### 1.7 Fixed colour families

| Family | Values | Rule |
| --- | --- | --- |
| Ideologies (Light, Dominion, Shadow, Wild) | spec 02 §3.5 | ideology emblems, party swatches, map and charts only; never chrome |
| The Gathering Dark (10 tiers) | a cold-violet ramp from `#6A6F86` to `#3A1E4A` with a red-ember top tier `#8C2A2A` | its readout, map overlay and super events only |
| Realm colours | the country colours of `common/countries` | flags, map and the realm's accent strip in its own panels only |
| Mechanic accents | one per mechanic panel (court gold, council ash, dominion storm, watch stone, strait sea-green, presence black, horde ember, accord sea, journey frost) | the 4 px accent strip under the title and the header art only (§6.4) |

### 1.8 Use rules

- At most one accent colour per control; the theme's frame highlight is the only highlight in chrome.
- `state.*` colours never fill a large surface; they appear as text, a 4 to 8 px inset lamp, a meter fill or an icon badge.
- Every state shown by colour also has a non-colour cue (shape, icon, text or position).
- Two themes never meet inside one window. A window opened beside another of a different area (a Chancery event over a Banner Hall production view) is separated by its own frame; nothing of one theme is drawn inside the other.

## 2. Typography

### 2.1 Faces

Only installed HOI4 bitmap fonts are used (`gfx/fonts/` of the game, 1.19.3): `hoi_36header`, `hoi_30header`, `hoi_24header`, `hoi_20bs`, `hoi_20b`, `hoi_18mbs`, `hoi_16mbs`, `garamond_14`, `garamond_16`, `garamond_24`, `cg_16b` (the engine's tooltip face), and the typewriter faces, which are aliased to Garamond by the additive font file of spec 02 §3.7 (lane C2). No font is added. The faces are the same in every theme; only the title colour changes.

| Role | Face | Size at 1080p | Case | Colour | Where |
| --- | --- | ---: | --- | --- | --- |
| Display | `hoi_36header` | 36 | Title case | `text.title` | Super events, main menu, Chronicle cover only |
| Window title | `hoi_24header` | 24 | Title case (no forced small caps) | `text.title` | Title band of every window |
| Section heading | `hoi_20bs` | 20 | Sentence case | `text.title` | Section bands, tab labels |
| Body | `hoi_18mbs` | 18 | Sentence case | `text.primary` or `text.ink` | Descriptions, event text |
| Label and value | `hoi_16mbs` | 16 | Sentence case | `text.secondary` label, `text.primary` value | Rows, meters, buttons |
| Reading (long text on `surface.reading`) | `garamond_16` | 16 | Sentence case | `text.ink` | Event bodies, Chronicle entries |
| Tooltip | `cg_16b` (engine) | 16 | Sentence case | engine colours remapped by §1.6 | All tooltips |

### 2.2 Rules

1. Nothing smaller than 16 px at 1920×1080 and UI scale 1, except numbers inside icons (14 px minimum).
2. Contrast: 4.5:1 for text under 20 px, 3:1 for 20 px and larger, measured on the render against the mean colour of the text's background box with the glyphs masked; a text colour with alpha is measured as drawn (blended).
3. Line length on reading surfaces 45 to 75 characters; body text is left-aligned; only titles and button labels are centred.
4. No text sits on a busy texture: the luminance standard deviation of the background box behind any text element stays under 0.06 (0 to 1 scale) after the text pixels are masked.
5. Long-text renders: every text element stays inside its plate or window (`containedBy`), and wraps or truncates by design (`fixedsize`, `maxHeight`), never by being cut off by a neighbouring element.
6. Placeholder or engine keys (`leader_name`, `ideology`, `[dynamic_loc]`, raw localisation keys) never reach a shipped render.
7. The calendar, month names and the age prefix ("4A") follow [01_start_and_calendar.md](../00_foundation/01_start_and_calendar.md); the vanilla Gregorian date format with a 1936 to 1939 year never appears.

## 3. Spacing, grid and composition

| Token | Value (1080p, UI scale 1) | Use |
| --- | ---: | --- |
| `space.unit` | 4 px | Every offset and size is a multiple of 4 |
| `space.s` | 8 px | Between a label and its value; icon to text |
| `space.m` | 12 px | Between rows of controls; inside a section |
| `space.l` | 16 px | Window padding; between sections |
| `space.xl` | 24 px | Between major groups; around the reading surface |
| `frame.border` | 16 px (nine-slice corner 32) | Visible frame thickness of every window, in every theme |
| `band.title` | 40 px | Title band or cloth height; close control 28×28 inset 8 from the top-right corner |
| `row.compact` / `row.standard` / `row.tall` | 24 / 32 / 48 px | List rows; one row height per list |
| `icon.xs` / `icon.s` / `icon.m` / `icon.l` | 16 / 24 / 32 / 64 px | Text icons / inline / row icons / feature icons; content icon families keep their engine sizes (§4.2) |

Composition rules:

1. Every window aligns its content to a single left edge at `frame.border + space.l`; columns use the same gutter (`space.l`).
2. Title band, then a state strip (the one to three key values of the window), then the body, then the actions row at the bottom; actions align right, the primary action rightmost.
3. Windows fit 1280×720 below the top bar at UI scale 1 (spec 01 principle 5) and are checked at 1280×720, 1920×1080 and 2560×1440 (UI scale 1) and 1920×1080 at UI scale 1.25.
4. No element overlaps another element's click region unless it is a deliberate stack with exactly one visible member (the vanilla top bar's speed and pause buttons are engine stacks and are exempted by name, not by tolerance).
5. Ornament that overhangs a frame (pennant points, leaf terminals, tooth-cut ends) stays outside every text and click box.

## 4. Iconography

### 4.1 One concept, one icon

A **concept** is anything a player can distinguish by name: a focus, a national spirit, a law, an officer-corps spirit, a decision or mission, a decision category and its picture, a technology, a doctrine, an equipment type or archetype, a sub-unit, a trait, a special project, an operation, an agency upgrade or logo, an MIO or MIO trait, a scholar trait, a faction, a map mode, a resource, an event moment, a super event.

Rules:

1. Each concept is listed in the icon registry, `tools/content/data/ui/icon_registry.json`, written by `tools/content/modules/icon_registry.mjs` from a staged build (`node tools/content/modules/icon_registry.mjs [stagedDir]`) and recomputed in every build: family, concept id, sprite name, texture path (with the frame of an engine strip).
2. A texture file serves exactly one concept unless one entry of `tools/content/data/ui/icon_shares.json` covers all its concepts with a deliberate reuse kind of §4.3 and a reason.
3. No placeholder ships: a concept without accepted art is a build error in release mode (the shared frame `gfx/interface/zin/frame.dds` serving 648 sprites today is exactly what this rule forbids).
4. No vanilla content picture reaches the screen (builder check 4 passes with zero findings).

### 4.2 Families and frames

Each family has one frame shape, one size, one rendering style and one background treatment, so the family is recognisable at a glance and different families are never confused. Sizes are recorded per family in `design_system.json` (`iconFamilies`) and checked by check 12. The frame follows the theme of the window that shows the family most (focus in the Chronicle, decisions in the Chancery, units in the Banner Hall); the picture style is the theme's.

| Family | Engine size (px, frames) | Theme of the frame | Style of the picture inside |
| --- | --- | --- | --- |
| Focus | 100 × 88 | Chronicle focus plaque | One subject, readable at 50%, ink-engraved line drawing |
| National spirit, law, officer-corps spirit | 64 × 64 (ZIN idea standard) | Chancery square idea frame | Painted emblem or object |
| Decision and mission | 32 × 32 | Chancery small round seal | Flat emblem, two to three colours |
| Decision category / category picture | 52 × 40 / 114 × 101 | Chancery category tab / picture | Emblem of the mechanic / painted scene |
| Technology | 64 × 64 (lane I1 confirms against the technology tree slot) | Chronicle technology plate | The object or practice researched, engraved |
| Doctrine | 64 × 64 | Chronicle doctrine plate | The 86 accepted doctrine pictures (K51, K58); review only |
| Equipment type and archetype | 146 × 54 | Banner Hall equipment plate | The equipment itself, three-quarter view, same light |
| Sub-unit | 152 × 42, 2 frames | Banner Hall unit plate | The troop type as an appliqué symbol |
| Counter | engine counter sizes | vanilla-green counter family (owner rule) | Bespoke per custom unit |
| Trait (unit and country leader) | 23 × 33 | Banner Hall trait banner | Flat appliqué emblem |
| Scholar trait | 24 × 33 | Chronicle trait leaf | Engraved emblem |
| Special project / operation / agency upgrade / agency logo | 76 × 76 / 85 × 85 / 164 × 50 / 234 × 119, 2 frames | Chronicle (projects) and Chancery (intelligence) | Painted or engraved by area |
| MIO / MIO trait | 60 × 60 / 48 × 48 | Banner Hall | Appliqué workshop marks |
| Faction | 200 × 100, 2 frames | Chancery faction shield | The league's own sign (K67 rule) |
| Event / news picture | 210 × 176 / 397 × 153 | Chancery event frame / news frame | Painted scene, one per event moment |
| Super event | full window | its own frame (Chancery family) | Painted moment (31 picture sprites in the build, none shipped) |
| Map mode, top bar, alerts, text icons, resources | engine sizes (map mode 44 × 21, 2 frames) | Banner Hall | Flat appliqué emblems |
| Realm sign | flag sizes | Banner | K65/K67 banners |

### 4.3 Deliberate reuse (the only allowed kinds)

| Kind (`icon_shares.json`) | Example | How it is recorded and drawn |
| --- | --- | --- |
| `same_concept` | A focus that grants a spirit of the same name; a decision category and its picture; two events that show one moment | One entry naming every concept; the art is recut to each family's frame and size, never stretched into another family's frame |
| `tiers` | Equipment marks I to III; spirit stages | One base picture plus a tier mark drawn into the art or as a separate overlay sprite; each tier is still its own sprite name |
| `family_badge` | The "Gathering Dark" badge on all its decisions | A small overlay sprite composited in the `.gui`, never baked into a different concept's picture |
| `engine_fallback` | `GFX_goal_unknown`, `GFX_idea_unknown` | One designed "unknown" icon per family; it never appears in a shipped ZIN render |
| `general_focus` (K69) | "Houses of Healing", the same story branch in eleven regional trees | One icon for every copy of a genuinely general focus (§4.5) |

Everything else is accidental reuse: a different concept on the same texture, an icon from another family used as a stand-in (idea pictures as agency logos, special projects, operations, map-mode buttons and panel markers today), or a picture whose subject does not name the concept.

### 4.4 Icon meaning

1. The subject of an icon names its concept: a reader who knows the concept's name can say why the picture fits.
2. Icons of mutually exclusive choices differ in silhouette, not only in colour.
3. A realm-specific concept may carry the realm's sign (K67) only where the concept is about the realm's identity.
4. Icons never contain lettering, numerals (except tier marks), crosses, real-world symbols, or spoilers (the veiled sun and Zol rules of spec 02 §3.6 apply to icons visible before the reveal).

### 4.5 Targets (K69)

A focus is **genuinely general** when two or more focus trees carry a focus with the same localised name built from the same template (its id is `<tree file stem>_<slug>` with the same slug); every copy is the same story branch. Those copies share one icon; no other focus shares one. On the phase 0 build that rule finds 226 groups holding 730 focuses (for example "Houses of Healing" and "When the King Falls" in eleven trees, "Levies for the Host" in ten); they are listed in `icon_shares.json` as `general_focus` entries with status **proposed**, for the owner to confirm or cut. The registry computes the targets below from the concepts and the share list; `today` is the number of distinct textures on the phase 0 build.

| Family | Concepts | Pictures to have (K69) | Today | Rule |
| --- | ---: | ---: | ---: | --- |
| Focus | 4,817 | 4,313 | 178 | one per focus; the 226 general groups one each |
| National spirit | 1,614 | 1,614 | 175 | one per spirit (a same-named focus may lend its art, recut, as `same_concept`) |
| Law | 18 | 18 | 18 (vanilla) | one per law |
| Officer-corps spirit | 27 | 27 | 26 | one per spirit |
| Decision and mission | 249 | 249 | 105 | one seal each |
| Decision category / picture | 50 / 15 | 50 / 15 | 39 / 15 | one each |
| Event | 1,213 | at most 1,213 | 42 | one per event; follow-ups of one moment may share as `same_concept`, recorded per chain by lane I10 |
| News event | 84 | 84 | 26 | one each |
| Technology | 292 | 292 | 2 | one each |
| Equipment type / archetype | 116 / 35 | 116 / 35 | 4 / 4 | one each; marks by the tiers rule |
| Sub-unit | 85 | 85 | 2 | one each, including the 20 without an icon |
| Trait | 306 | 306 | 0 | one emblem each |
| Special project, operation, agency upgrade, agency logo | 9, 20, 21, 15 | 9, 20, 21, 15 | 9, 19, 20, 15 (all idea pictures) | one each, in their own families |
| MIO / MIO trait | 9 / 90 | 9 / 90 | 9 / 14 | one each |
| Scholar trait | 9 | 9 | 9 (idea pictures) | one each |
| Doctrine | 63 | 63 | 63 | done (own art) |
| Faction | 18 | 18 | 17 (vanilla logos) | one shield each, both sizes |
| Map mode | 1 | 1 | 1 (an idea picture) | one button with distinct selected and deselected frames |
| Resource | 7 | 7 | 7 strip frames | one frame each |
| Super event | 31 sprites | 31 | 0 shipped | one painted moment each |

## 5. Panels, borders, textures and backgrounds

### 5.1 Panel levels

| Level | Token | Frame | Used for |
| --- | --- | --- | --- |
| 0 Window | `surface.window` | the theme's frame, nine-slice, corner 32, border 16 | Every top-level window, vanilla or ZIN |
| 1 Section | `surface.section` | thin `border.frame` line | Groups inside a window |
| 2 Inset | `surface.inset` | none or 1 px shadow | Lists, wells, meter grooves |
| R Reading | `surface.reading` | thin `border.frame` line | Long text only |

At most three levels are nested in any window.

### 5.2 Texture rules

1. Texture contrast is low: the luminance standard deviation of a panel body at 1080p is at most 0.05; weave, grain or speckle is visible only at close view.
2. No visible tiling: a repeated texture is generated seamless and checked by a seam score (mean absolute luminance step across the tile boundary at most 0.02).
3. No enlargement beyond 1.0: a source cell is never upscaled into a target larger than itself.
4. Frames are nine-sliced from a cell whose painted border width is declared; corners are never stretched.
5. Backgrounds behind full-screen views (focus tree, research, the super event) are their own generated plates, one per view, never a stretched panel texture.

### 5.3 Ornament

Ornament comes from the neutral vocabulary of spec 02 §3.6 and from the theme (Banner Hall: cord, knotted diamonds, stitched hems, pennant cuts; Chancery: mouldings, gilt leaves, small inset stones; Chronicle: inlaid lines, diamond studs, knotwork, tooth-cut cloth). Ornament is placed only in frame corners, title bands and dividers; it is never under text and never inside a list. The rules of spec 02 §3.6 still hold: no figure, face, animal head, letter, number or rune in chrome (the horse of the mock-ups is a realm sign, which is content, not chrome).

## 6. Controls and states

### 6.1 Buttons (neutral family)

| Kind | Size (1080p) | Use |
| --- | --- | --- |
| Primary | height 32, width from 120 | The one main action of a section |
| Secondary | height 32 | Other actions |
| Small | height 24 | Row actions |
| Icon button | 28 × 28 minimum click area | Close, toggle, sigil; always with a tooltip |
| Tab | height 32 | Up to four tabs per window; tabs are themed (§1.2 to §1.4) |

### 6.2 States

| State | Rendering rule | Non-colour cue |
| --- | --- | --- |
| Normal | `button.face`, thin bronze rim | — |
| Hover | `button.face.hover` (about +8% luminance), rim brightens, label `button.label.hover` | brighter rim |
| Pressed | `button.face.pressed` (about −10%), content offset 1 px down | inset shadow |
| Disabled | `button.face.disabled`, saturation at most 15%, no rim highlight, label `button.label.disabled`; the reason in the tooltip | dimmed label and plain rim |
| Selected | `button.rim.selected` rim 2 px, face as normal | gilt rim |
| Warning | `state.warning` inset lamp at the left of the label | lamp shape |

Frame order in every multi-frame button sprite follows the vanilla sprite (normal, hover, pressed[, disabled]); ZIN sprites use the same order. A control that cannot be used is visibly disabled with a reason tooltip, or hidden if the reason would spoil the story (spec 01 principle 2).

### 6.3 Tooltips and dialogs (neutral family)

- Tooltip: the engine `ToolTip` sprite reskinned as a `tooltip.surface` plate with a 1 px `tooltip.rim`; dark, because engine-generated modifier lists use the shared semantic colours, which are built for dark grounds; width 300 to 420 px; first line the name in `§H`, then two to four lines; effects and costs after a blank line; no tooltip longer than 12 lines except engine-generated modifier lists.
- Dialog (confirm, popup, diplomacy request): `dialog.surface` panel, a neutral title band, one to three lines of body, buttons right-aligned, the confirming action rightmost and primary; destructive actions use `state.danger` text, not a red button face.
- Notifications (alerts, message popups): alerts keep the engine sizes and use one alert frame family; each alert meaning has its own emblem (alert frames in `data/ui/alert_frames.json`).

### 6.4 ZIN windows and mechanic identity

- Every ZIN window is a level-0 window of its area's theme (§7) with the theme's title band and the shared close control (`GFX_closebutton`).
- A mechanic's identity is carried by a 600 × 96 header illustration, a 4 px accent strip in its mechanic accent under the title band, its own icons and meters. The eight themed frame materials of spec 01 §12 are not built; this rule and the area themes replace them.
- Meters: one meter sprite family per theme (groove, fill, threshold mark) shared by every gauge of that area; the fill colour is the meter's semantic state, the theme's `meter.fill` or the mechanic accent; the exact value always appears beside it as text.
- The Aoaz bar (spec 01 §2, not yet built; lane W1) is Banner Hall, uses `row.standard` height, `icon.s` icons and `hoi_16mbs` values.

## 7. Windows and their themes

Every window of the audit (01_audit.md §2) and the windows the plan adds, with its theme. The same table is `windowThemes` in `design_system.json`; the render harness labels every render with it. Rows marked "lead mapping" are K70's area rule applied by the lead where K70 names no window; the owner may move them.

| Window | Surface | Theme | Basis |
| --- | --- | --- | --- |
| `topbar`, `zin_aoaz_bar_window` | Top bar, Aoaz bar | Banner Hall | K70 |
| `clock_window`, `mini_map_interface`, `MapmodesInterface_Ingame`, `musicplayer_window`, `global_alerticon_window` | Clock, minimap, map modes, music, alerts | Banner Hall | K70 (top bar area; lead mapping) |
| `frontend_background`, `mainmenu_panel_bottom`, `mainmenu_single_player`, `frontendgamesetupview`, `gamesetup_country_details`, `game_rule_window`, `load_screen` | Frontend and loading | Banner Hall | K70 |
| `ingamemenu` | Pause menu | Banner Hall | K70 frontend (lead mapping) |
| `countryproductionlineview`, `countryconstructionsview`, `countrylogisticsview`, `countrydeploymentview` | Production, construction, logistics, recruitment | Banner Hall | K70 |
| `countrytradeview`, `countrystateview` | Trade, state view | Banner Hall | lead mapping (economy beside production) |
| `countryarmyview`, `naviesview_window`, `strategicairview`, `theatre_selection_window`, `landcombatview`, `navalcombatview`, `unitleaderwindow` | Army, navy, air, theatres, combat, leaders | Banner Hall | K70 |
| `countrypoliticsview`, `countrydiplomacyview`, `countrydecisionview`, `peaceconference_full_window` | Politics, diplomacy, decisions, peace conference | Chancery | K70 |
| `countryintelligenceagencyview`, `countryintelledger` | Intelligence | Chancery | lead mapping (court intrigue) |
| `EventWindow`, `EventWindow_News`, `zin_super_event_window` | Events, news, super events | Chancery | K70 |
| `zin_realm_window`, `zin_realm_button_window`, `zin_court_window`, `zin_court_button_window`, `zin_council_window` | Realm panel, Golden Court, Hidden Council | Chancery | K70 |
| `zin_horde_window`, `zin_accord_window`, `zin_dominion_window`, `zin_watch_window`, `zin_strait_window`, `zin_mistake_window`, `zin_journey_window` | Other realm mechanics | Chancery | K70 |
| `nationalfocusview`, `zin_interim_inlay_window` | Focus tree and its inlay | Chronicle | K70 |
| `countrytechnologyview`, `countrytechtreeview`, `countrydoctrineview` | Research, technology tree, doctrines | Chronicle | K70 |
| `zin_chronicle_window` | Chronicle of Aoaz (spec 04, lane W9) | Chronicle | K70 |
| `world_tension_popup` | The Gathering Dark history | Chronicle | lead mapping (a record of the age) |
| `menu_settings`, `diplomacy_standard_popup_window`, confirmations, message popups, tooltips | Settings, dialogs, tooltips | Neutral | K70 |

## 8. Main menu, loading and full-screen views

The frontend follows [03_main_menu_and_frontend.md](03_main_menu_and_frontend.md) for layout in the Banner Hall theme; its chrome uses the level-0 window and the display face. Full-screen views (focus tree and research in the Chronicle; the super event in the Chancery) each get one generated background plate in their theme's material, and their item plates (focus, technology) follow the icon family frames of §4.2.

## 9. Acceptance checks

Each rule has a check. **Builder** checks run in `tools/content/checks/ui_checks.mjs` in every build (`runDesignChecks`); checks 10 to 18 report against `tools/content/data/ui/check_baseline.json` and fail only a release build (`ZIN_RELEASE=1`) until the plan phases that satisfy them land. **Render** checks run in the review harness `tools/content/ui_review.mjs` (check 19) on `hoi4.gui_render` outputs. **Linux** checks run in the isolated Linux live run.

| Rule | Check | Kind | Pass condition | Baseline (31 October) |
| --- | --- | --- | --- | ---: |
| §4.1.2 one concept, one icon | 10 `icon.registry` | builder | every texture with two or more concepts is covered by one share entry of an allowed kind; the share list is valid and not stale | 400 textures (8,698 concepts) |
| §4.1.3 no placeholder | 11 `icon.placeholder` | builder | no ZIN sprite draws a listed placeholder | 648 |
| §4.2 family frames and sizes | 12 `icon.family_size` | builder | family size and frames; no missing texture; no cross-family texture without a share | 428 (260 size, 31 missing, 137 cross-family) |
| §7, §5.1 themed level-0 frames | 13 `chrome.family` | builder | every level-0 window texture is cut from an accepted chrome sheet of its theme (`acceptedChromeSheets`) | 115 |
| §5.2.1 low-noise textures | 14 `texture.noise` | builder | panel body deviation ≤ 0.05 | 3 (10 pending) |
| §5.2.2 seams | 15 `texture.seam` | builder | ≤ 0.02 at every tile join | 91 (12 pending) |
| §5.2.3 no enlargement | 16 `fit.scale` | builder (fit log `scale <n>` in the reskin manifest) | ≤ 1.0 | 292 |
| §6.2 states | 17 `button.states` | builder | normal, hover and pressed differ by 3% or more; disabled saturation ≤ 15% | 766 (708 same frames, 58 coloured disabled) |
| §3 grid, §2.1 roles | 18 `layout.grid` | builder (ZIN `.gui` files) | positions and sizes on 4 px; fonts from the role table | 1,060 (1,024 grid, 36 font; 815 in the technology tree window) |
| §2.2.2, §2.2.4, §2.2.5, §2.2.6 | 19 `text.render_metrics` | render (harness) | contrast ≥ 4.5:1 (≥ 3:1 from 20 px), ground ≤ 0.06, no raw key, no overflow | in `docs/plans/ui_overhaul/renders/review/metrics.md` |
| §4.1.4 no vanilla content | builder check 4 (reachability) | builder | 0 | 280 |
| §4.4.4 no lettering, crosses, spoilers | art review on the icon sheets | render (eye) | reviewer sign-off per sheet | — |
| §1 tokens | `tokens.sample`: mean colour of each panel level and button state on the reference renders within ΔE 10 of its theme token | render (script, after phase 1) | all within tolerance | — |
| §1.8 colour plus cue | review of state renders | render (eye) | every state distinguishable in greyscale | — |
| §3.3 fits 1280×720 | `hoi4.gui_render` at 1280×720 | render | inside the viewport below the top bar | — |
| §3.4 click regions | MCP `GUI_CONFLICTING_CLICK_REGIONS` | render | 0 except the named engine stacks | — |
| §6.2 disabled visible | hover, disabled and selected renders of every ZIN window | render (eye) | disabled reads as unusable with a reason | — |
| §6.3 tooltips | MCP tooltip previews for one control per window | render (eye + bounds) | inside the viewport, ≤ 12 lines | — |
| §10 vanilla kept | the register below against the Linux captures | Linux | nothing vanilla visible that is not in the register | — |
| whole system | Linux captures (spec 02 acceptance 9) at 1600×900 as Aenor and the Magical Forest | Linux | owner review of the capture sheet | — |

## 10. Vanilla kept register

K69: every surface changes; a vanilla element stays only where the engine draws it and ZIN cannot replace it. This is the complete list. **Confirmed** means the reason is established by the engine's file formats (no script, `.gui` or `.gfx` entry exists for it); **to verify** means the reason is the best current reading and the Linux run of plan step "Review and Linux" 2 must confirm it, otherwise the element moves to the plan. Everything not listed is ZIN's to change, and a Linux capture that shows another vanilla element is a defect.

| Element | Where the player sees it | Why it stays | What ZIN does instead | State |
| --- | --- | --- | --- | --- |
| The Paradox launcher, its playset and mod screens | before the game starts | outside the game; not moddable, and the owner's rules forbid touching the launcher | nothing | confirmed |
| The operating-system window, title bar and taskbar icon | around the game window | taken from the executable's resources | nothing | confirmed |
| Startup splash and the first loading bar before the mod's interface is read | first seconds of a start | drawn before mod files load | the ZIN loading screens and tips take over as soon as the interface loads | to verify |
| Glyph shapes of the bitmap fonts | all text | ZIN keeps the installed faces (§2.1, a design choice under spec 01 principle 6: adding fonts is possible but not wanted); the typewriter faces are aliased to Garamond | colours through the text-colour file; sizes and roles by §2 | confirmed (choice) |
| Engine-generated tooltip text structure (modifier lists, cost breakdowns, "requires" lines) | tooltips | composed by the engine; only its localisation keys and colours are moddable | wording through `localisation/replace/` and the text sweep; colours through §1.6 | confirmed |
| Number, percentage and time formatting ("1.2k", "45%", "12d") | top bar, lists | engine formatting | none | confirmed |
| Pie charts and line charts (`GFX_political_chart*`, `GFX_strategicair_linechart`, the production and trade charts) | politics, air, statistics | the engine draws the wedges and lines; only their frame, background and the ideology colours are moddable | frame and background in the theme; ideology colours from spec 02 §3.5 | confirmed |
| Map rendering itself (terrain shaders, borders, fog, selection outline, arrows' geometry) | the map | engine rendering; its textures are map work, not interface | map textures belong to the map workstream; arrow and outline textures are reskinned (`icons-map-arrows`) | confirmed |
| Unit counter layout (bars, numbers, stacking) | the map | engine layout of the counter; its sprites are moddable | counter sprites per the vanilla-green counter family; frames reskinned | confirmed |
| Edit-box caret and text selection highlight | search boxes, save names | engine-drawn | the box frame is reskinned | to verify |
| Drag rectangle (box selection) and the battle-plan drawing preview | the map | engine-drawn lines | their textures are reskinned where a sprite exists | to verify |
| Multiplayer lobby and Paradox account panels (server browser, sign-in) | frontend, multiplayer | partly engine-owned; the `.gui` exists but some panels are drawn by the online service | reskinned frames and buttons where a `.gui` exists; hidden where the menu offers them and ZIN has no use (spec 03) | to verify |
| Debug and console overlays | only with the debug flag | developer surfaces, never seen in a normal game | nothing | confirmed |
| Crash reporter and error dialogs of the executable | on a crash | outside the interface | nothing | confirmed |
| Steam overlay and achievements popups | over the game | Steam; achievements are off with mods | the achievements window is hidden (spec 03) | confirmed |

## Open questions

1. The lead mapping of §7 (pause menu, trade and state view in the Banner Hall; intelligence in the Chancery; the Gathering Dark popup in the Chronicle) stands until the owner overrules it (K70).
2. The 226 general focus groups of §4.5 are proposed; the owner may cut groups whose copies should look different per realm.
3. Icon family sizes marked "confirms" in `design_system.json` (technology, special project, map mode) are confirmed by their phase 3 lanes before art is produced.
