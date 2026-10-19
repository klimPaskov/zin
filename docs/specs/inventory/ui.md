# Interface inventory (area UI)

172 rows in `ui.csv`, measured on game 1.19.3. Every file under `interface/`, `gfx/interface/`, `gfx/cursors`, `gfx/fonts`, `gfx/texticons`, `sound/gui` and all 207 English localisation files maps to a row.

**Disposition:** reskin 94, replace 46, keep-hidden 13, engine 8, override 7, remove 4.
**Status:** todo 131, partial 23, done 18. **GAP:** 17.

## Top 10 gaps

1. Vanilla UI text has no author: core (2,274 keys) and 26 system files (9,675) (UI-129, UI-130).
2. Tooltip text: triggers, effects, modifiers, about 4,100 keys (UI-131).
3. The pause-menu Wiki button opens the real HOI4 wiki (UI-144).
4. Career profile window, 231 textures (UI-022).
5. MIO and raid windows stay reachable, but spec 02 calls them unreachable (UI-106, UI-108).
6. Commander ranks and modern units in 248 keys (UI-134, UI-160).
7. Names of kept engine systems: buildings, battle plan codenames (UI-161).
8. Modifier icons; the focus shine glint is still vanilla art (UI-145, UI-170).
9. Non-English languages show vanilla text (UI-136).
10. Government in exile, rich presence, key icons (UI-093, UI-019, UI-045).

## Risks

- Hide `frontendmainview.gui` elements, never delete them; never empty `core.gfx`.
- Engine default sprites (unknown leader, idea, goal; medium technology) must exist.
- 125 vanilla sprites name .tga or .png but ship as .dds; spec 03 calls `country_selection_bg` TGA, it is DDS.
- Frame counts, alpha shapes and `buttonstate` shaders bind textures.
- Ten DLC `*_small_background.gfx` name thumbnails that `replace_path` removes.
- Duplicate `bitmapfont` names, sound effect redefinition and a missing `_shine` sprite log or fail.

## Owner questions (proposal)

1. Hide the Wiki button with an `ingamemenu.gui` override? Yes.
2. Career profile? Chrome only, awards emptied.
3. Translations? English only.
4. In-world distance and weight units? Days of march, loads.
5. Skin market, MIO, raids? Yes.
