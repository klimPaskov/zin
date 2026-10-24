# ZIN branding (R-90)

This note records where the mod shows its own logo, which owner files and generations the shipped art comes from, and every adaptation step. The builder reads only the tracked folder `art/source/branding/`; it never reads the art working folder for branding.

## Surfaces

| Surface | Vanilla name and file | Shipped file | Size and format | Alpha | Wiring |
| --- | --- | --- | --- | --- | --- |
| Main-menu logo | `GFX_frontend_game_logo` in `interface/frontendmainview.gfx`, `gfx/interface/logo_game.dds` | `gfx/interface/logo_game.dds` | 448x175, A8R8G8B8, no mips | transparent outside the emblem | vanilla sprite name, no `.gfx` written |
| Main-menu backdrop (fourth background, not the default) | `common/frontend/backgrounds`, `gfx/loadingscreens/` | `gfx/loadingscreens/zin_menu_backdrop.dds`, thumbnail `gfx/interface/zin/loadingscreens/zin_menu_backdrop_small.dds` | 1920x1440 and 192x144, A8R8G8B8 | opaque | `interface/small_background.gfx`, `common/frontend/backgrounds/zin_backgrounds.txt` |
| Mod picture | `descriptor.mod` `picture=` (not set yet) | `thumbnail.png` at the mod root | 250x250 PNG, opaque | none | the lead wires `picture = "thumbnail.png"` in the descriptor step |

Not wired: the loading screen itself shows only the Clausewitz and PDX logos (`interface/load_screen.gui`), which are not ZIN's, so no ZIN emblem appears there. The banner `branding_banner_v1.png` has no vanilla surface that fits it and stays a source only. The bookmark picture (`gfx/interface/bookmarks/zin_fourth_age.dds`) is a scene, not a logo, and is unchanged.

## Sources

Owner originals (read only, never tracked): `C:/Users/klimp/Documents/ZIN/Themed/Logos/ZinLogoCut.png`, `Logos/ColorfulZinLogo.PNG`, `Logos/ZinLogo.png`, `Backgrounds/ZIN.LOGO.BACKGROUND.png`, `Backgrounds/ZIN.png`. Their hashes are in `art/source/branding/branding_manifest.json` and `tools/content/branding_prepare.mjs` refuses to run when one changes.

Accepted generations (tracked copies in `art/source/branding/`, provenance lines in `art/source/provenance.jsonl`, ids `branding_emblem_v1`, `branding_menu_backdrop_v1`, `branding_banner_v1`):

- `branding_emblem_v1.png`: 1024x1024, the owner's emblem redrawn with the same geometry (a square frame, an X, and a longer vertical staff) as tarnished silver on pure black, made with the owner's two logo drawings as references.
- `branding_menu_backdrop_v1.png`: 1536x864 painted backdrop with the same emblem on drifting mist.
- `branding_banner_v1.png`: 1536x512 banner, emblem plus the word ZIN.

Derived: `owner_emblem_matte.png` (203x236 RGBA), the owner drawing matted to alpha. It is the reference of the logo and is not shipped.

## Adaptation steps

1. `branding_prepare.mjs` checks the five owner hashes and the three generation hashes, copies the generations into `art/source/branding/`, and writes `owner_emblem_matte.png`.
2. Matte of the owner drawing: ink = (255 - luma) / 255 times alpha; ink is stretched from 0.10 to 0.55 onto alpha; colour is the fixed silver 214, 220, 228.
3. Logo: `branding_emblem_v1.png` with the black ground keyed to alpha (alpha rises from luma 10 to full at 50, colour kept), resized with Lanczos 3 to fit 440x167 with aspect kept, padded 4 px transparent to 448x175, written as A8R8G8B8 DDS.
4. Backdrop: centre crop to 4:3 (1152x864 from x 192), Lanczos 3 to 1920x1440 (the frontend slot is 4:3), DDS; thumbnail is the exact 10x box downscale to 192x144.
5. Mod picture: `branding_emblem_v1.png` Lanczos 3 cover to 250x250, PNG without alpha.

Choices and reasons: the menu logo uses the refined emblem rather than the owner matte because the matte at 448x175 is too faint and sketchy; the matte is kept as the record of the owner drawing. The backdrop is a fourth background so the default Parim stays; a 16:9 image cannot fill the 4:3 slot without a crop or bands.

## Acceptance

`tools/content/presentation.test.mjs` checks each surface's size and format, the logo transparency, the mod picture's opacity, the backdrop and thumbnail, the owner and source hashes, and the provenance records. The asset checker accepts the owner-path references in the generation records through `docs/design/validation/asset_baseline.json`, with the reason above.

## Open items

- Descriptor: `descriptor.mod` has no `picture=` line; the shared descriptor step must add it.
- The loading screen shows no ZIN emblem; adding one needs a `load_screen.gui` change outside this scope.
- The banner has no surface.
