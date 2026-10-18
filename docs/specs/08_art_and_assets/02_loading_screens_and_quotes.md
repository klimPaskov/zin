# Loading screens and quotes

**Status:** Draft. **Priority:** 5. **Phase:** 7.

The text half (quotes, tips, status lines) has no art dependency and may ship as early as phase 2.

## Purpose

The loading screen is the first and the most frequent thing a ZIN player sees. Today it shows vanilla Second World War photographs, Paradox's 1930s quotes and English status lines about shaders. This spec replaces all of it with Erdae:

1. **24 image-generated loading screens**, each tied to a region, people or scene of the Fourth Age, all spoiler-free for the whole game.
2. **The loading screen chrome**: the tip band, the status band and the progress bar, re-textured with generated art.
3. **150 in-world quotes and 40 gameplay tips**, given here in full, which replace every vanilla loading tip.
4. **The loading status lines** ("Loading Map (Creating Terrain)...") in Erdae words.
5. The **main-menu background list**, so that the background picker offers only ZIN pictures.

It also fixes the file names, sizes and formats, the builder modules that produce them, and how the result is checked.

This spec takes over §13 "Loading screens" of [07_interface/01_interface.md](../07_interface/01_interface.md). That section asks for nine screens named `load_1` to `load_9`. This spec raises the count to 24, keeps the interface spec's nine subjects among them, and moves the thumbnails (see Implementation). The main-menu picture `zin_menu_parim` and the bookmark picture stay with the interface spec. The art pipeline's inventory row "Loading screens and main menu: 10 (+10 small), ~14 calls" becomes 25 (+25 small) and about 34 calls ([01_art_pipeline.md](01_art_pipeline.md) §8).

## Lore basis

| Fact or rule | Status | Source |
| --- | --- | --- |
| The start: the Golden King reigns, Eindil has not appeared, Afrit is unrevealed, Erdae seems at peace | owner-fixed | *The Campaign of 4A 1748*, CONVENTIONS |
| No text a player can read names Afrit or calls the Deliverer a demon before `zin_afrit_revealed`, except text shown only to the Worshipdom | contract rule | [00_shared_contract.md](../04_mechanics/00_shared_contract.md), "The secret" |
| "Eindil" never appears in text reachable before `zin_eindil_named`; before that he is "the Man from the Ice" | integration D4 | [INTEGRATION_DECISIONS.md](../INTEGRATION_DECISIONS.md), [03_names_and_terms.md](../02_lore/03_names_and_terms.md) |
| No text names a sleeper in the ice, Ein's sons, Zol's administrator, the King of Demons, Dardan's place, the Gala–Sunhot relationship or Varner's whereabouts | lore rules | [04_fourth_age_history_for_play.md](../02_lore/04_fourth_age_history_for_play.md), [03_names_and_terms.md](../02_lore/03_names_and_terms.md) |
| Loading screens and the main menu are spoiler-free for the whole game; no Eindil, no Afrit's true form, no Zol, no battles | art and interface rules | [01_art_pipeline.md](01_art_pipeline.md) rule 4, [01_interface.md](../07_interface/01_interface.md) §13 |
| All art is image-generated; code only slices, resizes and converts; nothing from other mods or games | owner rule | CONVENTIONS |
| Region palettes | catalog rule | [02_icon_catalog.md](../05_focus_trees/02_icon_catalog.md) rule 6 |
| Established facts each quote and picture rests on | established (E), working table (W) or proposed (P), per row | vault notes named in each row |
| Every quote text, every attribution to a named figure, every source title, every picture brief, every tip | **proposed** | this spec |

**Why everything must be spoiler-free.** The engine picks a loading picture and a loading tip at random and shows them before any save is loaded, so no flag can gate them. A quote that is safe in 4A 1760 but not in 4A 1748 is therefore not safe at all. For that reason this spec does not use the phrase "the Man from the Ice" at all, even though the assignment allowed it: a loading tip cannot know whether he has woken, and the history-for-play spec already rules out any legend of a sleeper in the ice (open question 1).

**What the quotes may say.** Only what the peoples of Erdae know or believe on 1 Thaw 4A 1748, in the voices the history-for-play spec gives them: pride in the long peace, quiet shame at the Golden King, love of the Deliverer, the West's grudge, the North's treaty, Mirolon's unheeded warnings, fishermen's tales of the black north, the elves' long memory. Dramatic irony is allowed (a sincere hymn to the Deliverer); revelation is not.

## Design

### 1. How the vanilla game does it (measured from the installed game)

| Item | Vanilla | Source file |
| --- | --- | --- |
| Loading pictures | `gfx/loadingscreens/load_1.dds` … `load_9.dds`, each 1920×1440, uncompressed 32-bit DDS (A8R8G8B8), no mipmaps. Every file in that folder is loaded regardless of its name (wiki). | `gfx/loadingscreens/` |
| Thumbnails | `load_<n>_small.dds`, 192×144, in the same folder, used only by the main-menu background picker through sprites `GFX_load_<n>_small` | `interface/small_background.gfx` |
| Thumbnail frame | `GFX_frontend_loading_screen_border_small` → `gfx/loadingscreens/loading_screen_border_small.dds` (192×144) | `interface/small_background.gfx` |
| DLC pictures | `load_lar`, `load_nsb`, `load_nsb2`, `load_bba`, `load_aat`, `load_aat2`, `load_ww`, `load_ncns_chi`, `load_ncns_jap` (and others listed in the background file) in each DLC's `gfx/loadingscreens/` | `dlc/*/gfx/loadingscreens/` |
| Main-menu background database | One entry per picture name: `load_1 = {}` … `load_9 = {}`, DLC entries with `dlc_allowed`, optional `locale`. Each entry needs a sprite `GFX_<name>_small`. The background manager swaps the texture of `GFX_frontend_bg`. | `common/frontend/backgrounds/base_backgrounds.txt`, `interface/frontendmainviewbg.gfx` |
| Screen layout | Window `load_screen` (full screen). Status window at the top centre: background `GFX_loadingstatus_bg` (1400×92) at x −700, status text in font `loadscreen_header` (max width 800), progress bar `GFX_loadingstatus_progress` (934×35) at y 62. Tip window at the bottom centre: background `GFX_loadingtip_bg` (1400×148) at y −147, tip text in font `loadscreen_tip` (`hoi_24header`), max 900×200, centred both ways. Paradox and Clausewitz logos at the lower left and lower right corners. | `interface/load_screen.gui`, `interface/load_screen.gfx`, `interface/load_screen_font.gfx` |
| Chrome textures | `gfx/interface/Loadingscreen_loadingtip.dds` 1400×148, `gfx/interface/Loadingscreen_loadingstatus.dds` 1400×92, `gfx/interface/LoadingScreen_Progress_1.dds` and `_2.dds` 934×40; all A8R8G8B8 with alpha. In the progress bar, `textureFile1` (the fill) is `_Progress_2` and `textureFile2` (the track) is `_Progress_1`. File names are mixed case. | `interface/load_screen.gfx` |
| Loading tips | `localisation/english/loading_tips_l_english.yml`: keys `LOADING_TIP_0` … `LOADING_TIP_162` (163 keys, no gaps), each a quote followed by `\n- Attribution`. No separate gameplay-tip keys exist. | same |
| Status lines | 18 keys in `core_l_english.yml` (table in §8) | `localisation/english/core_l_english.yml` |
| Tip colours | `loadscreen_tip` defines colour codes G, R, Y, H, T, so `§Y…§!` works in tips | `interface/load_screen_font.gfx` |

### 2. What ZIN does

1. **Replace the folders.** `descriptor.mod` and the launcher's `zin.mod` both gain `replace_path="gfx/loadingscreens"` and `replace_path="common/frontend/backgrounds"` (the wiki requires the line in both files). No vanilla or DLC loading picture, thumbnail or background entry then loads. Each folder keeps ZIN content, as the wiki requires of every replaced folder.
2. **Use the vanilla names as well.** ZIN's pictures are named `load_1` … `load_24`. The first nine therefore also override the vanilla files of the same name, which covers the case where the very first launch screen is drawn before `replace_path` takes effect (open question 3).
3. **Keep the loading folder pure.** `gfx/loadingscreens/` holds exactly the 24 pictures and the interface spec's `zin_menu_parim.dds`, nothing else. Thumbnails and the thumbnail frame live in `gfx/interface/zin/loadingscreens/`, because every file in the loading folder may be drawn as a loading screen. The menu picture therefore also appears as a 25th loading screen, which is intended (it is spoiler-free).
4. **Re-texture the chrome** by shipping ZIN textures under the exact vanilla paths and file names (same mixed case, which matters on Linux). No `.gui` or `.gfx` file of the loading screen is overridden, and the Paradox and Clausewitz logos stay as they are.
5. **Replace every loading tip** through `localisation/replace/`, with 190 keys (`LOADING_TIP_0` … `LOADING_TIP_189`). Because the replace folder overrides keys and 190 > 163, no vanilla tip can survive even though the vanilla file still loads.
6. **Replace the 18 status lines** through `localisation/replace/`.
7. **The main-menu picker** lists `zin_menu_parim` first, then `load_1` … `load_24` (proposed: every loading screen can be chosen as the menu background).

### 3. Rotation

The engine chooses the picture and the tip independently and at random each time a loading screen is shown (game launch, starting a game, loading a save, returning to the menu). There is no weighting, no condition and no memory of what was shown before; repeats happen. ZIN does not try to control this, which is why every picture and every tip must be safe at any moment of any game. With 25 pictures and 190 tips, a player sees on average a new picture in four loads out of five, and the chance of seeing the same tip twice within ten loads is about one in four.

The tips are not interleaved by kind. Quotes take the keys 0 to 149 and gameplay tips 150 to 189, so roughly one load in five shows a gameplay tip.

### 4. Pictures: format, composition and prompts

| Item | Value |
| --- | --- |
| Generation | `generate_image`, one scene per call, 2048×1536, `quality: high`; up to three attempts per screen (art pipeline §3) |
| Shipped picture | `gfx/loadingscreens/load_<n>.dds`, 1920×1440, uncompressed DDS A8R8G8B8, top-left origin, no mipmaps (as vanilla); 11,059,328 bytes each |
| Shipped thumbnail | `gfx/interface/zin/loadingscreens/load_<n>_small.dds`, 192×144, same format, made from the shipped 1920×1440 picture by an exact 10× box downscale |
| Resize | 2048×1536 → 1920×1440 with Lanczos 3 (art pipeline §4 step 5); no crop, both are 4:3 |
| Budget | 24 pictures ≈ 265 MB uncompressed. If the owner prefers a smaller repository, BC1 (DXT1) without alpha is the fallback (about 1.4 MB each); the manifest records the format (open question 4) |
| Approval | The owner approves every loading screen (art pipeline §6). The review checklist and the composition check below are recorded for each one |

**Composition.** The engine either crops the 4:3 picture to the screen's width or fits it to the screen's height; both happen depending on resolution. The loading bars cover the top 92 and the bottom 148 screen pixels, and the logos sit in the lower corners. One rule works in both cases:

| Zone of the 1920×1440 canvas | Rule |
| --- | --- |
| x 240–1680, y 300–1040 | The subject: the city, the people, the landmark. Everything that makes the picture recognisable |
| y 0–300 | Quiet sky, canopy or mist; no faces, no key landmark |
| y 1040–1440 | Quiet ground, water or snow; no faces, no key landmark |
| x 0–240 and x 1680–1920 | Continuation of the scene; nothing that the picture needs |

The review renders each accepted picture at 1920×1080 (cropped), 1280×720 and 2560×1440 with the tip and status bars drawn over it (tool-generated evidence, not a game screenshot) and rejects pictures whose subject is covered.

**Prompt.** Every job uses the builder's style line and this frame (proposed):

> Painted dark-fantasy strategy-game art in a consistent style: rich oil-paint texture, dramatic soft lighting, muted earthy palette with gold accents. A wide 4:3 painted scene for the loading screen of a fantasy strategy game, filling the whole image edge to edge, no border. *[Brief from the table, then light and palette.]* Keep the main subject in the middle of the picture, with quiet sky above and quiet ground below. No text, no letters, no numbers, no runes, no frames, no labels, no logos, no watermark. No modern objects. No battle, no corpses, no blood.

**Never in any loading picture** (in addition to the art pipeline's checklist): Eindil or any lone heroic stranger from the north; any figure that could be read as the Deliverer, Aurevan or Afrit (no radiant robed figure, no statue or painted image with a face in a temple); demons; the undead; Zol in any form, a skull sigil or ships of the dead; Horos or Glo itself; Volgan; a recognisable face of Lorien, the Golden King or any other lore figure; a battle, siege or burning town; dwarves in a homeland (their homeland is open); Sunhot elves and Gala elves in the same picture.

### 5. The 24 loading screens

Palettes follow the icon catalog: Middle Lands gold and red; North Lands sea-green and iron; Cold Lands white and pale blue; West Lands green and brown; East Lands ochre and turquoise; Dark Lands rust and black; Dead Lands ash and ember; Magical Lands silver and leaf-green; Lands of the Sun white gold; the Mistake black and cold grey. Region coverage: Middle Lands 8, Magical Lands 3, Cold Lands 3, Lands of the Sun 2, and one each for the North Lands, West Lands, Triton's Islands, Islands of the South, Dark Lands, Dead Lands border, East Lands and Zol's shores. Peoples shown: men, elves, Sunhot elves, giants, ents, yeti, orcs and goblins. Demons and the dead are left out on purpose.

| N | File | Title (internal, never shown) | Region, people | Brief: subject and composition | Light and palette | Lore basis |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | `load_1` | Parim at dawn | Middle Lands; men | A great walled city of pale stone and gilded roofs on the shore of a vast still lake at sunrise. Towers and temple domes topped with plain sun discs, grain barges and fishing boats on mirror-calm water. The city fills the middle band, the lake the foreground, sky above. | Warm dawn haze; gold and red | Parim (W), the Great Lake (E); interface list |
| 2 | `load_2` | The stair of the Golden Court | Middle Lands; men | The palace district of Parim at evening: gilded halls, colonnades heavy with gold leaf, a broad marble stair crowded with richly dressed petitioners carrying purses and sealed scrolls toward a tall bronze door. No king is visible. Opulent and slightly overripe. | Lamplight and sunset; gold and red | The Golden Court (P), sale of offices (E) |
| 3 | `load_3` | The Great Lake ports | Middle Lands; men | A busy lake harbour at midday: timber cranes, stone quays, round-bellied cogs and lake galleys, warehouses with grain sacks, dock workers, gulls. A second city shore faint across the water. | Clear noon; gold, red and lake blue | Ports rebuilt (P), Fourth Age trade (E); interface list |
| 4 | `load_4` | The rangers of Selen | Middle Lands; men | A timber ranger lodge at the edge of a deep green forest at dusk. Hooded rangers with longbows walk out in single file, small in the frame and seen from behind; no single figure stands out. | Low dusk light through trees; green and gold | Selen's rangers (E) |
| 5 | `load_5` | The ents of Kilinti | Middle Lands; ents, men | An ancient oak forest in morning mist. Two or three ents (bark skin, mossy beards, leafy crowns, amber eyes) walk slowly between the trees beside a woodcutters' village whose people have stopped work to watch. | Soft mist; green, gold, bark brown | Ents of Kilinti (E) |
| 6 | `load_6` | The stone-raisers of Hiloron | Middle Lands; giants, men | A high pasture under a wide sky. Giants (craggy faces, braided beards, fur mantles) raise a great standing stone while human shepherds and their sheep give scale. | Overcast with sun breaking through; gold and grey-green | Hiloron giants (E) |
| 7 | `load_7` | The ploughed grave-fields | Middle Lands; men | Broad farmland in spring. Ploughmen with oxen turn dark earth between weathered burial cairns and broken grey markers now overgrown with wildflowers. A distant village. Hopeful, ordinary, alive. | Fresh spring light; gold and green | Varner's lifting of the grave-field curse (E deed, P dates) |
| 8 | `load_8` | The Wall at Kingson | Middle Lands, Magical Lands border; men, elves | A massive grey stone wall runs over rolling hills to the horizon. At a fortified gate-town, elven traders in silver and green wait with pack animals beside human customs men at a toll table. A silver-green forest on the far side. | Late afternoon; grey stone, gold, silver-green | The Great Wall of Aenor and Kingson (E), the Wall Accord's customs line (P) |
| 9 | `load_9` | The council of the houses | Magical Lands; elves | A vast glade under silver-barked trees. Elves of many houses sit in a wide ring of carved wooden seats, debating; pale lanterns hang from the branches. No figure is raised above the others. | Twilight; silver and leaf-green | Democratic elves of the Magical Forest (E), elected houses (P); interface list |
| 10 | `load_10` | Dragon Mountain | Magical Lands; elves | A jagged lone mountain at sunset, seen from an elven watch-post on a cliff. Dragons circle the far peak as small silhouettes. One elven warden watches, back to the viewer. Nothing burns. | Ember sunset sky; silver and leaf-green below | Dragon Mountain; elves command dragons (E) |
| 11 | `load_11` | The hermitage of Zilin | Magical Lands; many peoples | Three green valleys among hills. A modest white hermitage with gold sun-disc banners on a hillside; a long, slow line of pilgrims of many peoples on the road; couriers on horseback passing them. No statue, no painted face, no priest at the centre. | Soft morning; white, gold, leaf-green | The Worshipdom in the Zilin Hills (E hub, P look); interface list |
| 12 | `load_12` | Sonargur on the strait | North Lands; men | A fortified port city of dark stone on cliffs above a narrow strait. A fleet of warships and galleys under sea-green sails; banners showing two crowns side by side; the far shore faint. | Brisk wind, broken cloud; sea-green and iron | Sonargur (W), the united Leren crowns (E one crown, P date), the strait (E); interface list |
| 13 | `load_13` | Fandanar in winter | Cold Lands; men | A white-stone citadel above a frozen harbour, ships held in the ice, smoke rising from many chimneys, an aurora above. | Night with aurora; white and pale blue | Coldor's seat Fandanar (W) |
| 14 | `load_14` | The ice road | Cold Lands; men, yeti | A caravan of sledges drawn by shaggy beasts crosses an endless ice plain under a pale low sun. Fur-clad traders walk beside them; two yeti guides lead. Wind-blown snow at ground level. | Pale sun; white and pale blue | Cold Lands trade (P), the Yeti (E); interface list |
| 15 | `load_15` | The silent castle | Cold Lands (Mp'E) | A distant dark castle on a frozen ridge under a starry night. One faint green light in a high window. In the foreground, sledge tracks in the snow that turn back. Nobody in or near the castle. | Starlight; white, deep blue, one point of green | The Castle of Yeldenne (E), the travellers' tale of the green light (P) |
| 16 | `load_16` | The Grey Ford | West Lands; men | A broad, shallow river ford among green and brown hills. A tall plain grey truce stone on a gravel bar. Two encampments on either bank under different banner colours (plaids on one side, pale wardens' colours on the other), smoke rising peacefully, a few people crossing. | Grey morning; green and brown | Truce of the Grey Ford (P), Gunwaith and Girdon (E) |
| 17 | `load_17` | The chart-house | Triton's Islands; men | A cliff-top chart-house above a turquoise ocean, island arcs on the horizon. Chart-makers bend over a long table spread with sea charts drawn as lines and coasts only. Sail ships and outriggers below. | Bright sea light; turquoise, white, weathered wood | Triton's Islands and the Pupor Ocean (E), the charts of 4A 702 (P) |
| 18 | `load_18` | The tide shrine | Islands of the South; men | A small stone shrine half under the sea at low sun, its steps running into the water, oil lamps lit on the steps. Island priests in pale robes; fishing canoes drawn up nearby. Poor, gentle, hospitable. No carving or inscription. | Low golden sun; sand, sea, lamp gold | The shrine of the old name (P), the Islands of the South (E) |
| 19 | `load_19` | Under the sun | Lands of the Sun; Sunhot elves, men | A white-gold city of terraces beside a bright sea. Sunhot elves over three metres tall (bronze skin, white and gold robes, sun-disc diadems) walk among human merchants who reach only to their chests. Calm, generous, unhurried. | High sun; white gold | The Sunhot elves (E), the Sea of Gods (E) |
| 20 | `load_20` | The court of Gala | Lands of the Sun; Gala elves | An ancient elven hall open to the sky: pale stone columns overgrown with flowering vines, elven courtiers in white and gold. At the far end a throne bathed in light, its occupant small and indistinct. No spring or basin at the centre, no ship, no stranger. No Sunhot elves. | Warm sunlight; white gold and green | Gala's court and King Lorien (E); interface list |
| 21 | `load_21` | The forges of Cocanoor | Dark Lands; orcs, goblins | A city of black iron on the slopes of a smoking volcano at night. Orc and goblin smiths work at open forges; channels of molten light run between the buildings. Work, not war: no captives, no army. | Lava glow; rust and black | Goldoroth's seat Cocanoor (W), the Volcano Clans (P) |
| 22 | `load_22` | The watch on the passes | Dead Lands border; men | A stone watchtower on a high mountain pass. A lone scout with a dust-scarf looks south, where a towering storm wall and heat haze cover the horizon and faint dust plumes rise far away. No army, no figure in the south. | Ash and ember sky | Mirolon watches the Dead Lands (E rivalry), the storms and heat (E); interface list |
| 23 | `load_23` | The salt road | East Lands; men | A long camel caravan crosses ochre dunes at dusk toward a caravan city with turquoise domes. Camel riders ride escort along its flank. | Dusk; ochre and turquoise | The caravan roads (P), Noris camel warriors (E) |
| 24 | `load_24` | The black island | Ocean of Zol; men | Small fishing boats with lanterns row away at dusk from a jagged black island under a cold grey sky, mist on the water. Nothing and nobody on the island. | Dusk; black and cold grey, lantern gold | Zol's Mistake and its black islands (E), the fishermen's rumours (P); interface list |

### 6. The loading screen chrome

| Texture (exact path and case) | Size | Generated as | Rule |
| --- | --- | --- | --- |
| `gfx/interface/Loadingscreen_loadingtip.dds` | 1400×148 | Strip 1 of the chrome sheet | A dark weathered leather band with a fine gold filigree edge along the top and bottom; ends fading softly into the key colour. The centre must stay dark (mean luminance at most 25%) so the white tip text reads |
| `gfx/interface/Loadingscreen_loadingstatus.dds` | 1400×92 | Strip 2 | The same band, thinner |
| `gfx/interface/LoadingScreen_Progress_1.dds` (track, `textureFile2`) | 934×40 | Strip 3 | An empty iron groove with a thin gold rim |
| `gfx/interface/LoadingScreen_Progress_2.dds` (fill, `textureFile1`) | 934×40 | Strip 4 | The same groove filled with molten gold light |
| `gfx/interface/zin/loadingscreens/zin_thumb_border.dds` | 192×144 | Single job | A thin gold frame with a transparent centre, for the background picker |

**Chrome sheet job** `loading-chrome` (proposed): 1536×1024, flat magenta `#FF00FF` background, four horizontal strips stacked top to bottom with wide gutters, in the order above, each spanning about 90% of the width (aspects about 9.5:1, 15:1, 23:1 and 23:1). Slicing: `findRegionsAdaptive` with `expected: 4`, aspect range 8 to 30, cells ordered top to bottom; alpha matte and despill from the key (art pipeline §4 step 4); resize each strip to its target with `fit: 'fill'`.

**Thumbnail frame job** `loading-thumb-border`: 1024×768 on magenta, a thin ornamental gold frame touching all four edges with a magenta centre; keyed, then resized to 192×144.

### 7. Loading quotes and tips

#### Format

| Item | Rule |
| --- | --- |
| Keys | `LOADING_TIP_0` … `LOADING_TIP_189`, consecutive, no gaps (the engine reads the numbered keys from 0) |
| Quotes | Keys 0–149. String: `<text>\n- <attribution>`, as vanilla. No quotation marks around the text |
| Tips | Keys 150–189. String: `§YCounsel:§! <text>` |
| Length | Quote and tip text under 220 characters (the longest quote here is 147, the longest tip 184); the whole string under 300 |
| Characters | Windows-1252 only. The texts below are plain ASCII; `§` (0xA7) appears only in the tip prefix. No `"`, `$`, `[` or `]` in any text |
| File | `localisation/replace/zin_loading_tips_l_english.yml`, UTF-8 with BOM, header `l_english:` |
| Order | As in the tables below; the builder never reorders, so a key keeps its text across builds |

Example lines:

```
l_english:
 LOADING_TIP_0: "A crown is gold on the outside and work on the inside. Most kings only look at the outside.\n- Saying of the Middle Lands"
 LOADING_TIP_150: "§YCounsel:§! The Erdae bar under your flag shows the year of the Fourth Age, the Gathering Dark and up to three meters of your own realm. Hover any of them to learn what it means."
```

#### Attribution style

- **Sayings of peoples** name the people or place: "Saying of the Gunwaith clans", "Fishermen's saying, Ocean of Zol".
- **Lines from chronicles** name a source (all titles proposed): *The Chronicle of Erdae* with its age (the same name as the in-game codex, [04_chronicle_codex.md](../07_interface/04_chronicle_codex.md)), *The Annals of Parim*, *The Annals of Gunwaith*, *The Harbour Rolls of Sonargur*, *The Litany of the Deliverer*, *A western reading of the Chronicle*, *A commentary on the Chronicle*.
- **Words of figures** name the figure with a title. Every attributed line is **proposed**, including those given to established figures (Aen, King Edran, Lorien, Varner, the Golden King, Alleria). Lines for Aen and Varner are framed as remembered ("Words the heralds give to Aen", "as the elves remember him"), because nobody alive heard them. Proposed characters come from [02_characters.md](../02_lore/02_characters.md) and the vault's proposed First and Second Age characters; the High Confessor is **Ilvane** (integration N10), never the retired "Hierarch Aubren".
- **Volgan** speaks only through Mirolon's songs. Zol, the Deliverer himself, Horos and Eindil are never quoted.

The "Basis" column gives the vault fact each line rests on and its status (E, W, P). Every quote text itself is proposed.

### Quotes (complete text)

#### Middle Lands and Aenor

| Key | Text | Attribution | Basis |
| --- | --- | --- | --- |
| `LOADING_TIP_0` | A crown is gold on the outside and work on the inside. Most kings only look at the outside. | Saying of the Middle Lands | The Golden King's love of gold (E) |
| `LOADING_TIP_1` | Parim was built on the Great Lake so that no king could forget where the grain comes from. | Proverb of the lake-country | Parim and the Great Lake heartland (W, E) |
| `LOADING_TIP_2` | Plough the old fields deep. The wizard pulled up what the Necromancer sowed there, but the earth remembers. | Ploughmen's saying, Middle Lands | Varner lifted the curse of the grave-fields (E deed, P dates) |
| `LOADING_TIP_3` | The Charters call the dominions partners of the crown. Partners are asked. Subjects are told. | Saying of the Concord dominions | Charters of Parim (P) |
| `LOADING_TIP_4` | Buy a judgeship in Highsun, sell it again at Harvest. At the Golden Court even justice has a season. | Jest of the Parim markets | Sale of offices (E); month names (P) |
| `LOADING_TIP_5` | More than a thousand years without a war worth the name. Every veteran in Parim is made of bronze. | Tavern saying of Parim | The long peace (E) |
| `LOADING_TIP_6` | Aen had hundreds of sons. That is why every lord in the Middle Lands can prove he is royal, and none can prove he is king. | Saying of the heralds of Parim | Aen's hundreds of sons (E); competing branches (P) |
| `LOADING_TIP_7` | Selen gave Aenor a king when Aenor had none. Selen has not let Aenor forget it. | Saying of the Middle Lands | Harion of Selen (P) |
| `LOADING_TIP_8` | The giants of Hiloron do not hurry. The hills they stand on have not hurried either. | Saying of Hiloron's neighbours | Hiloron giants (E) |
| `LOADING_TIP_9` | Never ask an ent the way. You will arrive, but your grandchildren will be there to greet you. | Saying of the Kilinti woodcutters | Ents of Kilinti (E) |
| `LOADING_TIP_10` | A rider of Hunhun owns three things: his horse, his word and the sky above the steppe. | Horse-lords' saying, Hunhun | Riders of Hunhun (E) |
| `LOADING_TIP_11` | Asgard was the first harbour Aenor's ships ever found, and Asgard's houses have charged harbour dues ever since. | Saying of Aenor Isle | Asgard, Aenor Isle houses (E); first port (P) |
| `LOADING_TIP_12` | The Wall keeps the elves on their side, the customs men on ours, and the dragons, we are told, far away. | Gate-wardens' jest at Kingson | The Wall Accord's reasons (P) |
| `LOADING_TIP_13` | Behind the Wall the elves count in centuries. In front of it the customs men count in coins. | Saying of Kingson | Great Wall of Aenor (E); customs line (P) |
| `LOADING_TIP_14` | Herez faces south so that Parim can go on facing its mirrors. | Marcher saying of Herez | Herez on the southern marches (E) |
| `LOADING_TIP_15` | A full grain store is a sermon nobody argues with. | Saying of the Houses of the First Light | Houses keep the grain stores (P) |

#### Chronicles of the ages

| Key | Text | Attribution | Basis |
| --- | --- | --- | --- |
| `LOADING_TIP_16` | Men lived for thousands of years before Aen. He was not the first of men. He was the first of his name. | The Chronicle of Erdae: the First Age | Aen, First of His Name (E) |
| `LOADING_TIP_17` | For centuries the kingdoms of men fought over whether there should be one crown. Aen answered the question. | The Chronicle of Erdae: the First Age | The War of Men (E) |
| `LOADING_TIP_18` | The western shores were not empty when Aenor's ships arrived. That is the whole quarrel, and it has lasted four ages. | A western reading of the Chronicle | Aenor's wars in the West (E) |
| `LOADING_TIP_19` | The Dead Lands guarded themselves. Storms turned back the ships, and the heat turned back the men who landed. | The Chronicle of Erdae: the First Age | Dead Lands storms and heat (E) |
| `LOADING_TIP_20` | When the capital fell to Volgan, its archives burned with it. The kingdom lost its memory before it lost its walls. | The Chronicle of Erdae: the First Age | The capital fell (E); archives (P) |
| `LOADING_TIP_21` | Men, elves, dwarves, giants and spirits stood in one alliance. It happened once. The chroniclers still argue about why it worked. | The Chronicle of Erdae: the Grand Alliance | The Grand Alliance (E) |
| `LOADING_TIP_22` | Dardan cost millions of lives and left a wasteland. The victory was real. So was the price. | The Chronicle of Erdae: the First Age | Battle of Dardan (E) |
| `LOADING_TIP_23` | The spirits did not destroy Volgan. They stripped his strength and cast him into the Void. A banishment is a door, and doors open. | A commentary on the Chronicle | Banishment to the Void, later return (E) |
| `LOADING_TIP_24` | King Edran won the war and lost the peace. He would not stop at Dardan, and the elves paid for it in the Dead Lands. | The Chronicle of Erdae: the First Age | Edran's failed Dead Lands campaign (E) |
| `LOADING_TIP_25` | They called the Second Age the Long Grief. Yet its farmers learned to keep seed, its healers to end plagues, its builders to raise walls that held. | The Chronicle of Erdae: the Second Age | Second Age advances (E) |
| `LOADING_TIP_26` | King Edran, greatest of kings since Aen, died of a sickness no sword could reach. | The Chronicle of Erdae: the Second Age | Edran died of disease (E) |
| `LOADING_TIP_27` | When the Necromancer came, the elves did not. Men called it betrayal. The elves called it memory. | The Chronicle of Erdae: the Second Age | The Elven Refusal (E) |
| `LOADING_TIP_28` | Elzon raised the dead who fell fighting him. Every lost battle cost Aenor twice. | The Chronicle of Erdae: the Second Age | Elzon raised Aenor's fallen (E) |
| `LOADING_TIP_29` | In the two thousand one hundred and thirty-third year of the Second Age, Elzon took Aenor. So began the Third Age. | The Chronicle of Erdae: the Second Age | 2A 2133 (E) |
| `LOADING_TIP_30` | The Necromancer's dead faded, and Aenor's earth would not feed his magic. He ruled for twelve centuries on borrowed strength. | The Chronicle of Erdae: the Third Age | Fading undead; at least 1,200 years (E) |
| `LOADING_TIP_31` | Elzon did not fade, and he did not sleep. He died, wholly and for good. | The Chronicle of Erdae: the Third Age | Elzon's permanent death (E) |
| `LOADING_TIP_32` | When the Necromancer fell, the Deliverer stood between the people and the ruin. That day the temples were full, and they have been full since. | The Chronicle of Erdae: the Fourth Age | The Deliverer acclaimed at Elzon's fall (E, public) |
| `LOADING_TIP_33` | Harion of Selen took up a crown that had waited twelve hundred years, and found that it still fitted a good man. | The Annals of Parim | A good king restores Aenor (E); Harion (P) |
| `LOADING_TIP_34` | 4A 96. The elves and the crown agreed to keep the Necromancer's wall. The elves wanted their old distance. The kings wanted the tolls. | The Annals of Parim | The Wall Accord (P) |
| `LOADING_TIP_35` | 4A 1000. Parim feasted a thousand years of peace. Envoys came from every coast, and nobody brought a sword. | The Annals of Parim | The Thousand-Year Jubilee (P) |
| `LOADING_TIP_36` | 4A 1736. An envoy of Mirolon warned the court that the Dead Lands were arming. The court laughed. The annalist did not record the joke. | The Annals of Parim | The unheeded envoy (P) |
| `LOADING_TIP_37` | 4A 1744. Fishermen speak of black ships among the islands of the Ocean of Zol. Entered here as a curiosity. | The Harbour Rolls of Sonargur | Black ships rumour (P) |
| `LOADING_TIP_38` | 4A 1745. Gunwaith and Girdon sign the Truce of the Grey Ford. The West is quiet. The scribes do not trust it. | The Annals of Gunwaith | Truce of the Grey Ford (P) |
| `LOADING_TIP_39` | If the walls cannot be saved, save the books. A kingdom can be rebuilt from its memory. | Arelon, Keeper of the Last Seal | Second Age proposed character (P) |

#### Figures of the ages

| Key | Text | Attribution | Basis |
| --- | --- | --- | --- |
| `LOADING_TIP_40` | One crown, so that no more crowns need be buried. | Words the heralds give to Aen, First of His Name | Aen's unification (E); speech (P) |
| `LOADING_TIP_41` | Let every banner keep its own colour. We march together; we do not march as one. | King Edran to the Grand Alliance | Edran (E); Charter of Free Banners (P) |
| `LOADING_TIP_42` | Taryn of Gunwaith would not march for Aenor until Aenor wrote down that she was not its subject. Then she marched to Dardan and did not stop. | Song of Taryn's banner, Gunwaith | Western banners at Dardan (E); Taryn (P) |
| `LOADING_TIP_43` | Senra's ships carried bread to Dardan when no road could. The islands fed the Grand Alliance and sent the bill afterwards. | Island song of Senra | Island supply of the Alliance (E); Senra (P) |
| `LOADING_TIP_44` | A healer does not ask which banner a wound was made under. | Tavriel of the Magical Forest | Second Age proposed character (P) |
| `LOADING_TIP_45` | The dead are not wicked. They are only tired, and someone will not let them rest. | Varner, as the elves remember him | Varner lifted the curse of the dead (E); speech (P) |
| `LOADING_TIP_46` | A kingdom is restored by its grain stores before it is restored by its crowns. | Harion the Restorer, in the Annals of Parim | Harion (P); fair grain storage (P) |
| `LOADING_TIP_47` | I remember the War of Men. I remember Dardan. Forgive me if I do not hurry to remember your war. | King Lorien of Gala | Lorien remembers the War of Men and Dardan (E); speech (P) |
| `LOADING_TIP_48` | Do not frighten your people with prophecy. Frightened people make prophecies come true. | King Lorien of Gala | Lorien's warning about prophecy (P, vault) |
| `LOADING_TIP_49` | Gold does not rust. Neither, I am pleased to say, do I. | The Golden King | His love of gold (E); speech (P) |
| `LOADING_TIP_50` | The Lost Cause shall guard Erdae against the powers of the dark. See that the triumph is painted in gold. | The Golden King, founding the Lost Cause, 4A 1741 | Founding of the Lost Cause (E); date (P) |
| `LOADING_TIP_51` | The seals of the kingdom are heavy. I carry them so that the King need not. | Chancellor Merovan | Merovan holds the seals (P) |
| `LOADING_TIP_52` | Everything at court has a price. I am only the one man honest enough to write it down. | Lord Treasurer Halmor Infous | Golden Court office-sellers (P) |
| `LOADING_TIP_53` | An army is not a parade that happens to carry swords. | Marshal Corwen Hornan of Aenor | Aenor's honest marshal (P) |
| `LOADING_TIP_54` | The court branch of the Lost Cause wears the badge. The frontier companies earn it. | Lord-Commander Tarec Belurith | Lost Cause frontier companies are real (E direction) |
| `LOADING_TIP_55` | Every great house in Parim descends from Aen. I have checked. I have also checked what they paid the heralds. | Master Ilsabet Vothrim, University of Parim | Many lines of Aen (E); scholar (P) |
| `LOADING_TIP_56` | In Selen we teach children two things: how to read tracks, and how to keep quiet about what they read. | Alleria of Selen | Alleria, ranger of Selen (E); speech (P) |
| `LOADING_TIP_57` | Selen loves the crown the way the forest loves the road. It lets it through. | First Warden Daeric Svenlor of Selen | Selen's pride (P) |
| `LOADING_TIP_58` | Hurry is a thing that happens to men. | Eldest Gronnar of Kilinti | Ents of Kilinti (E); ruler (P) |
| `LOADING_TIP_59` | The temples ask for nothing but your trust. Trust is the only tithe that grows. | Ilvane, High Confessor of the Deliverer | Public worship (E); Ilvane (P) |
| `LOADING_TIP_60` | Zilin has three valleys, no army and the busiest roads in Erdae. | Abbot-Steward Lozan Heron of the Worshipdom | The Worshipdom's valleys and pilgrims (P) |
| `LOADING_TIP_61` | The houses have debated the matter for forty years. We are nearly ready to begin. | First Speaker Lusiel Velakorin of the Magical Forest | Elected houses of the Magical Forest (P constitution) |
| `LOADING_TIP_62` | A dragon is not a weapon. It is a neighbour who has agreed, for now, to be polite. | Perlan, Warden of the Dragon Roosts | Elves command dragons (E); office (P) |
| `LOADING_TIP_63` | We did not refuse Aenor. We refused King Edran, a little late and for a very long time. | Loremaster Aenwe Lozari of the Magical Forest | The Elven Refusal (E); speaker (P) |
| `LOADING_TIP_64` | We were not humiliated in Parim in 4A 1716. We were taught the price of a toll. We have been studying it since. | King Ferlin III of Lerendor and Lerenwaith | The toll quarrel (P) |
| `LOADING_TIP_65` | A queen of the Cold Lands rules ice, wind and men, in that order of obedience. | Queen Vaestia of Coldor | Coldor's crown (P) |
| `LOADING_TIP_66` | I signed the truce at the Grey Ford with my left hand. My right was on my sword, out of habit. | King Herlic of Gunwaith | Truce of the Grey Ford (P) |
| `LOADING_TIP_67` | The law of Gunwaith binds the king as it binds the shepherd. The shepherd finds this more comforting than the king does. | Lawspeaker Ilurda of Gunwaith | Gunwaith's lawspeaker (P) |
| `LOADING_TIP_68` | A truce is only a war that has decided to rest. | Thane Datid Werlen of Gunwaith | Gunwaith's war party (P) |
| `LOADING_TIP_69` | A caravan is a kingdom that moves. Mine simply moves faster than Stabilo's. | King Esiurth II of Noris | Noris and the caravan roads (P) |
| `LOADING_TIP_70` | Noris owns the desert. We own the people who must cross it. | Prince Cereos of Postondoroth | Stabilo's rivalry with Noris (W, P) |
| `LOADING_TIP_71` | A warking who cannot win a fight cannot keep a crown. A warking who must fight every day has already lost it. | Warking Gorduth of Cocanoor | Goldoroth (W); ruler (P) |
| `LOADING_TIP_72` | Mirolon does not ask the north to love us. Only to look south once a year. | First Warden Aldis Veleran of Mirolon | Mirolon watches the south (E rivalry, P ruler) |
| `LOADING_TIP_73` | I told the court in Parim that the Dead Lands were arming. They laughed so hard the King spilt his wine. I hope it stained. | Envoy Hessa Mencnor of Mirolon | The envoy of 4A 1736 (P) |
| `LOADING_TIP_74` | Watch the dust on the southern road. Dust does not lie, and it does not laugh at you in Parim. | Captain Bennar of the Passes | Mirolon's scouts (P) |

#### The Deliverer and the temples

Public faith only. These lines are sincere, and they stay true to what believers know.

| Key | Text | Attribution | Basis |
| --- | --- | --- | --- |
| `LOADING_TIP_75` | He stood between us and the ruin when the Necromancer fell. Ask nothing more of a god. | The Litany of the Deliverer | Public worship of the Deliverer (E) |
| `LOADING_TIP_76` | Deliverance for the fallen, protection for the faithful, renewal for the land. | The threefold blessing of the temples | New God of Deliverance, Protection and Renewal (P) |
| `LOADING_TIP_77` | The Houses of the First Light keep three books: the grain, the sick and the born. A kingdom written down is a kingdom cared for. | Rule of the Houses of the First Light | Grain stores, hospitals and birth rolls (P) |
| `LOADING_TIP_78` | Come to Zilin with empty hands. You will leave with a blessing and a letter for a friend in your own city. | Pilgrims' saying of the Zilin Hills | Pilgrims and couriers of the Worshipdom (P) |
| `LOADING_TIP_79` | Every court in Erdae has a friend of the temples. That is why the roads are so safe. | Merchants' saying of the East Lands | The Deliverer's friends in eastern courts (E direction, public view P) |
| `LOADING_TIP_80` | Pray to the Deliverer for rain and he sends rain. Pray to him for wisdom and he sends a priest. | Peasants' jest of the Middle Lands | Public worship (E) |
| `LOADING_TIP_81` | A god who heals the sick asks only gratitude. Gratitude is cheap. Pay it gladly. | Teaching of the Faithful, as preached in Parim | Real blessings of the Deliverer (E) |
| `LOADING_TIP_82` | Old scrolls speak of Seven who made the gods. Old scrolls also speak of fish that sing to sailors. | Lecture-room jest, University of Parim | Almost nobody believes in the Holy Seven (E) |

#### Gods, spirits and the world

| Key | Text | Attribution | Basis |
| --- | --- | --- | --- |
| `LOADING_TIP_83` | The Old Gods are dead, says one priest. Asleep, says another. The fishermen of the north say nothing, and do not sail at night. | Saying of the North Lands coasts | Conflicting accounts of the Old Gods (E) |
| `LOADING_TIP_84` | Only one Old God dwells in Erdae, and he cannot walk in it. That is the best news the north has ever had. | Saying of the northern shores | Zol is the only Old God in Erdae and cannot take a body (E) |
| `LOADING_TIP_85` | Great Spirit or god, what does it matter to the village it burns? The priests can argue over the ashes. | Saying of the Mirolon passes | Mortals confuse spirits with gods (E) |
| `LOADING_TIP_86` | The New Gods are young, the proverb says. Young as the mountains are young. | Saying of the Magical Lands | New Gods are younger than the Old (E) |
| `LOADING_TIP_87` | There are spirits under the mountains that have never seen the sun. Miners who dig too deep come back quiet, or not at all. | Miners' saying of the Dark Lands | Damned Spirits deep underground (E) |
| `LOADING_TIP_88` | Spirits come in two ranks, the scholars say: Great and Lesser. The farmer whose barn is burning does not ask which. | Lecture-room jest, University of Selen | Two spirit ranks (E) |
| `LOADING_TIP_89` | Whatever you met in the forest, do not call it a god. It may agree with you. | Saying of the Magical Lands frontier | Lesser spirits taken for gods (E) |
| `LOADING_TIP_90` | Zol was old before Aen was born. His land was black before anyone thought to give it a name. | Saying of the northern shores | Zol arrived before Aen (E) |

#### The elves

| Key | Text | Attribution | Basis |
| --- | --- | --- | --- |
| `LOADING_TIP_91` | We hold elections in the Magical Forest because no elf alive is old enough to be trusted alone. | Saying of the houses of the Magical Forest | Democratic Magical Forest (E) |
| `LOADING_TIP_92` | Men ask why we keep the Wall. We kept our distance long before there was a wall. The stones only made it visible. | An elder of the Magical Forest | The Wall Accord (P) |
| `LOADING_TIP_93` | Herrodon and Andos Enda have quarrelled for so long that their grudges have grandchildren. | Saying of Nolorim | Herrodon and Andos Enda rivalry (W) |
| `LOADING_TIP_94` | Nolorim keeps the high passes. Nobody remembers asking Nolorim to. Nobody remembers Nolorim asking. | Saying of the Magical Lands | Nolorim guards the passes (E name, P role) |
| `LOADING_TIP_95` | Only the elves can call the dragons of Dragon Mountain. Men have tried. Men have stopped trying. | Saying of the gate-wardens of Kingson | Elven powers command dragons (E) |
| `LOADING_TIP_96` | The elves were never conquered, not even by the Necromancer. They mention it rarely, and never by accident. | Saying of Aenoran envoys | The elves were never conquered (E) |
| `LOADING_TIP_97` | The wizard and his small purple servant walked our roads in the worst of the Third Age. Where the wizard went, the dead lay down. | Elven tale of Varner and Golbran | Varner and Golbran in the Third Age (E) |
| `LOADING_TIP_98` | Varner never asked to be thanked. So the elves thank him every spring, loudly, in case he is listening. | Custom of the Magical Forest | Varner's lasting influence (E); custom (P) |
| `LOADING_TIP_99` | The mycids of the Mushroom Forest are older than your kingdom and considerably more polite. | Elven saying | Mycids of the Mushroom Forest (E) |

#### The North Lands

| Key | Text | Attribution | Basis |
| --- | --- | --- | --- |
| `LOADING_TIP_100` | Two crowns, one kingdom, one fleet. Lerendor married Lerenwaith, and the strait has paid the dowry ever since. | Saying of Sonargur | Union of the Leren crowns (P date, E one crown) |
| `LOADING_TIP_101` | The Treaty of the Narrow Strait is an old promise. Parim keeps the promise. Sonargur keeps the strait. | Saying of the Leren court | The old alliance (E); treaty name (P) |
| `LOADING_TIP_102` | Sensai answers to no crown, and sells timber to all of them. | Saying of Sensai | Sensai's timber (P) |
| `LOADING_TIP_103` | Molot and R'en sit between two masters of the strait. Small crowns learn to smile in both directions. | Saying of the North Lands | Molot and R'en (E names) |
| `LOADING_TIP_104` | Never run the narrow strait without paying the dues. The Leren fleet does not argue. It collects. | Sailors' saying, Sea of R'en | Leren fleets guard the strait (P) |

#### The Cold Lands

| Key | Text | Attribution | Basis |
| --- | --- | --- | --- |
| `LOADING_TIP_105` | In the Cold Lands a guest is fed first and questioned in spring. | Hospitality law of the Cold Lands tribes | Cold Lands tribes (E); custom (P) |
| `LOADING_TIP_106` | Coldor has one crown for the whole frozen interior. Isengard has one answer to it: no. | Saying of Fandanar | Coldor and Isengard (W) |
| `LOADING_TIP_107` | Winter is the only king every tribe of the Cold Lands obeys. | Saying of the Cold Lands | Cold Lands peoples (E) |
| `LOADING_TIP_108` | There is a castle in the far north where nobody goes. On clear nights a green light burns in it. Turn your sledge around. | Traders' tale of Mp'E | Castle of Yeldenne (E); travellers' tale (P) |
| `LOADING_TIP_109` | The yeti will trade you furs for salt, and directions for silence. Take the directions. | Saying of the ice road | Yeti Lands (E) |
| `LOADING_TIP_110` | The ice-giants of Titanos remember every winter. That is why they are so seldom cheerful. | Saying of the Cold Lands coast | Titanos ice giants (E) |
| `LOADING_TIP_111` | The Cold Lands run off the edge of every map. Mapmakers are honest men. They simply stop drawing. | Saying of Coldor's ports | The Cold Lands reach off the map (E) |

#### The West Lands

| Key | Text | Attribution | Basis |
| --- | --- | --- | --- |
| `LOADING_TIP_112` | Aenor calls it discovery. We call it what happened to our grandfathers' grandfathers. | Saying of the Gunwaith clans | Aenor's colonial wars (E) |
| `LOADING_TIP_113` | The sea between us and Aenor is wide. That is the only reason we are still friends. | Saying of the harbours of Kradlon | The wide central sea (E) |
| `LOADING_TIP_114` | Fifty years of war and one truce at the Grey Ford. In the West we call that a short quarrel. | Saying of the Girdon wardens | Gunwaith and Girdon wars (E rivalry, P dates) |
| `LOADING_TIP_115` | A clan forgives a debt, a feud and a bad harvest. A clan does not forgive a tariff. | Saying of the Corogon traders | Western resentment of Aenoran tariffs (P) |
| `LOADING_TIP_116` | The Buldor companies will fight for anyone. They will not fight for free. | Saying of the West Lands | Buldor companies (E people) |

#### The islands

| Key | Text | Attribution | Basis |
| --- | --- | --- | --- |
| `LOADING_TIP_117` | The Pupor Ocean has no king. Every captain who tried to be one is now part of the reef. | Saying of Triton's Islands | Triton's Islands and the Pupor Ocean (E) |
| `LOADING_TIP_118` | We charted the Pupor Ocean and sold the charts to every crown. Each crown believes it bought the only copy. | Chart-makers' saying of Adel | Pupor charts (P) |
| `LOADING_TIP_119` | When the tales of men grow too old for any man to explain, carry them to Gala. | Saying of the Islands of the South | The islanders' saying (chronicle detail) |
| `LOADING_TIP_120` | At the tide shrine the priests sing a name they do not understand. They sing it carefully, in case it understands them. | Saying of the Islands of the South | The shrine of the old name (P) |
| `LOADING_TIP_121` | Do not cross the reef of voices at night. The voices know your name. You do not know theirs. | Fisherfolk's saying, Islands of the South | The reef of voices (P) |
| `LOADING_TIP_122` | A stranger who lands on our beach is fed. A stranger who lands twice is family. | Hospitality saying of Howan | Island hospitality (P) |

#### The Lands of the Sun

| Key | Text | Attribution | Basis |
| --- | --- | --- | --- |
| `LOADING_TIP_123` | The Sunhot elves stand over three metres tall and have never once needed to raise their voices. | Saying of the Goodin Sunfolk | Sunhot elves' height and peace (E) |
| `LOADING_TIP_124` | The strongest people in Erdae are also the most peaceful. The philosophers find this inconvenient. | Lecture-room jest, University of Selen | Sunhot elves (E) |
| `LOADING_TIP_125` | The Gala host marched to Dardan for a king it barely knew. Gala does not regret Dardan. It regrets what came after. | Saying of the court of Gala | Gala at Dardan; Edran's folly (E) |
| `LOADING_TIP_126` | The Lands of Light lead the Sunhot realms by never once giving an order. | Saying of the Sea of Gods | Lands of Light (P role) |
| `LOADING_TIP_127` | The white ships of Hengyang have long memories and short patience with pirates. | Saying of Hengyang's Tide-Speakers | Hengyang's fleets (P) |

#### The Dark Lands

| Key | Text | Attribution | Basis |
| --- | --- | --- | --- |
| `LOADING_TIP_128` | Goldoroth was many holds and many chiefs. Now it is one hold, one chief and many graves. | Saying of Cocanoor | Goldoroth's uniting (P date) |
| `LOADING_TIP_129` | Dondor has held the line against Goldoroth for three hundred years. In Notbuton they call it a pastime. | Saying of Notbuton | Dondor and Goldoroth (W rivalry, P dates) |
| `LOADING_TIP_130` | Bordon, Dreson and Dulundur answer to nobody. They have done it so long that nobody bothers to ask any more. | Saying of the Dark Lands | Independent Dark Lands holds (E) |
| `LOADING_TIP_131` | In the Troll Forest the trees are old and the trolls are older. Neither cares for visitors. | Saying of the Dark Lands | Troll Forest (E) |
| `LOADING_TIP_132` | The fire-speakers read the smoke above Cocanoor. When the smoke drifts south, they stop talking. | Saying of the Volcano Clans | Goldoroth's fire-speakers (P) |
| `LOADING_TIP_133` | Strangers from the south bring good iron and better promises. Take the iron. | Saying of the free holds | Gifts from the south (P) |

#### The Dead Lands and Mirolon

| Key | Text | Attribution | Basis |
| --- | --- | --- | --- |
| `LOADING_TIP_134` | Volgan has been quiet longer than Aenor has had kings. Quiet is not the same as gone. | Saying of the watch of Mirolon | Volgan rebuilding (E); phrase (P) |
| `LOADING_TIP_135` | Mirolon was the first kingdom Volgan took. It means to be the last he ever tries to take. | Saying of the passes | Volgan's First Age conquest of Mirolon (E) |
| `LOADING_TIP_136` | The kingdoms of men always divide. I have only to wait. | Words that Mirolon's old songs give to Volgan | Volgan's patience (P voice) |
| `LOADING_TIP_137` | No ship has seen what lies behind the storms of the Dead Lands. The ships that might have are on the sea floor. | Saying of the southern coasts | Dead Lands storms (E) |
| `LOADING_TIP_138` | The south is hot, the seas are wild, and the Nether lies farther south than both. Travellers' advice: go north. | Saying of the Herez marches | The Nether in the far south (E) |

#### Zol's Mistake and the northern seas

| Key | Text | Attribution | Basis |
| --- | --- | --- | --- |
| `LOADING_TIP_139` | Nothing lives in Zol's Mistake. Things walk there anyway. | Fishermen's saying, Ocean of Zol | Roamed by the dead (E) |
| `LOADING_TIP_140` | Never put in at a black island. The islands are patient, and you are not. | Fishermen's saying of the north | The black islands (E) |
| `LOADING_TIP_141` | Why is it called Zol's Mistake? Ask the scholars. Then ask why none of them has gone to look. | Saying of the Leren harbours | The name is unexplained (E) |
| `LOADING_TIP_142` | A man killed in battle stays dead. The dead of the north were never told. | Saying of the northern coasts | Ordinary weapons cannot end Zol's dead (E) |
| `LOADING_TIP_143` | Black ships among the islands, the fishermen said. The court said fishermen drink. Both were telling the truth. | Saying of the Sonargur docks | Black ships rumour (P) |

#### The East Lands

| Key | Text | Attribution | Basis |
| --- | --- | --- | --- |
| `LOADING_TIP_144` | Noris and Stabilo fight over every road east. The camels have not noticed. | Saying of the salt road | Noris and Stabilo rivalry (W) |
| `LOADING_TIP_145` | A Noris camel rider can cross the desert on one skin of water and one insult to Stabilo. | Saying of Furvior | Noris camel warriors (E) |
| `LOADING_TIP_146` | In Postondoroth they weigh gold, salt and promises on the same scale. Only the gold never comes up short. | Saying of the Stabilo Pact | Stabilo's trade (P) |
| `LOADING_TIP_147` | The East is the richest land in Erdae and the most divided. Every merchant says the two are related. Every king blames the other king. | Saying of the caravan masters | East Lands rich and divided (E) |
| `LOADING_TIP_148` | Gondolin, Drak, Alerhia, Miaed: four courts, forty quarrels and one road for all of them. | Caravan saying of the East Lands | East Lands courts (W, map) |
| `LOADING_TIP_149` | Easterlings, the old charts call us. We were here before the charts. | Saying of the East Lands | Easterlings in First Age usage (E) |

### Gameplay tips (complete text)

Each tip names only systems that the specs define and stays true if their numbers are tuned. The "Refs" field in the data file (Implementation) lists the spec each tip depends on, so a rename shows up in review. No tip mentions a story flag, a hidden figure or a later-game unit (no bearer of Glo, no Host of Eindil, no manifestation).

| Key | Topic | Text | Refs |
| --- | --- | --- | --- |
| `LOADING_TIP_150` | Interface | The Erdae bar under your flag shows the year of the Fourth Age, the Gathering Dark and up to three meters of your own realm. Hover any of them to learn what it means. | interface §2 |
| `LOADING_TIP_151` | Interface | The Realm button opens the Realm panel: your people, your alignment and stance, and your standing among the crowns of Erdae. | interface §3 |
| `LOADING_TIP_152` | Interface | Great powers have their own panel. Open it from the small sigil at the end of the Erdae bar. Panels show; decisions act. | interface §1–2, §4 |
| `LOADING_TIP_153` | World | The Gathering Dark measures how near Erdae is to catastrophe. It starts low, because the world seems at peace, and rises as hidden pressures build. | world tension |
| `LOADING_TIP_154` | World | Erdae counts twelve months from Deepwinter to Longnight. The campaign opens on 1 Thaw, 4A 1748, the first day of spring. | calendar |
| `LOADING_TIP_155` | World | Every realm belongs to one of ten peoples. Your people decides which hosts you can raise and which arms your armouries can make. | peoples, warfare §1 |
| `LOADING_TIP_156` | Politics | Four alignments divide Erdae: Light, Dominion, Shadow and the Wild. Each has its own stances, and each treats war and alliances differently. | ideologies |
| `LOADING_TIP_157` | Diplomacy | At the start nobody can simply justify a war. A cause, such as a broken truce or an old grudge, lets one realm press a claim on one rival. | diplomacy, war justification |
| `LOADING_TIP_158` | Diplomacy | Declare war while the long peace holds and you are branded a breaker of the peace: stability and war support fall, and the Gathering Dark rises. | diplomacy, `zin_diplo_peace_breaker` |
| `LOADING_TIP_159` | Diplomacy | Seven leagues stand at the start: the Middle Kingdom Concord, the Leren Compact, the Northern Accord, the Noris Treaty, the Stabilo Pact, the Dark Sea Accord and the Southern Dominion. | diplomacy, factions |
| `LOADING_TIP_160` | Diplomacy | The elves keep the Elven Refusal. They defend their own lands, but they will not send armies to fight for Aenor. | diplomacy, Elven Refusal |
| `LOADING_TIP_161` | Economy | Erdae runs on Iron, Timber, Horses, Stone, Gold, Essence and Grain. Timber builds hulls, Horses mount riders, Essence feeds magical arms. | integration V2 |
| `LOADING_TIP_162` | Economy | Guild Workshops build for the realm, Armouries forge arms for the hosts, and Shipwrights lay down hulls. Balance them to your needs. | economy, buildings |
| `LOADING_TIP_163` | Economy | Roads, High Roads and Depots carry supply. A host far from any road starves faster than any enemy can kill it. | economy, buildings |
| `LOADING_TIP_164` | Warfare | Ballista companies pierce the hides of trolls, giants and the other great kin. A host without them barely scratches such foes. | warfare §5 |
| `LOADING_TIP_165` | Warfare | Ordinary arms hardly harm Zol's deathless. Wards and hallowed arms help a little; only potent magic truly ends them. | warfare §5, magic |
| `LOADING_TIP_166` | Warfare | Knights and heavy foot are the hammer of the hosts of men. They hit hard and cost dearly, so keep them where the battle is decided. | warfare §2 |
| `LOADING_TIP_167` | Warfare | Support companies matter: scouts find the enemy, sappers break walls, healers return the wounded, and wardens stand against the dead. | warfare §2, §4.8 |
| `LOADING_TIP_168` | Warfare | Rangers, hill companies, sea soldiers and temple wardens are the special forces of Erdae. Few realms can field many of them. | warfare §2 |
| `LOADING_TIP_169` | Warfare | Dragons cannot be bred or built. Only pacts with Dragon Mountain bring them, and a dragon lost in battle is never replaced. | warfare §6.3, magic |
| `LOADING_TIP_170` | Warfare | The Great Wall of Aenor is a line of stone forts from the Organ Mountains past Lunhrim to Kingson. It needs upkeep, and every breach matters. | magic, Great Wall |
| `LOADING_TIP_171` | Navy | Galleys cannot cross the wide central sea. A fleet bound from the West Lands to the Middle Lands needs deep-water hulls. | warfare §7.3 |
| `LOADING_TIP_172` | Navy | The seas around the Dead Lands are wracked by storms. Without storm rigging, a fleet loses ships there before it meets an enemy. | warfare §7.3 |
| `LOADING_TIP_173` | Navy | Merchant cogs carry your trade and your armies across the water. Guard them: corsairs hunt the sea lanes. | warfare §2, §7.1 |
| `LOADING_TIP_174` | Navy | A war galley's ram strikes hard at close quarters. Warships carry ballista decks and the reach to stay at sea for long. | warfare §7.1 |
| `LOADING_TIP_175` | Rules | The Historical Path rule decides whether the AI follows the chronicle of the age, leans toward it, or follows only its own interests. | `zin_rule_historical_path` |
| `LOADING_TIP_176` | Rules | The Story Pace rule stretches or shortens the time between the great moments of the age. It never changes what can happen. | `zin_rule_story_pace` |
| `LOADING_TIP_177` | Rules | With the skies rule off, there are no griffin riders in the air, and dragons fight beside armies instead of as wings. | `zin_rule_skies`, warfare §6.3 |
| `LOADING_TIP_178` | Aenor | Playing Aenor? The Golden Court meter shows how rotten your court is. A gilded court is rich, but rot weakens everything it touches. | interface §2, Aenor |
| `LOADING_TIP_179` | Aenor | Concord dominions show their loyalty as Steadfast, Loyal, Restless or Defiant. Keep them content, or they will ask for freer charters. | interface §2, shared Concord tree |
| `LOADING_TIP_180` | Aenor | The Lost Cause begins as the King's ornament inside Aenor. Its frontier companies are real soldiers, and what it becomes is up to you. | integration S3, Aenor |
| `LOADING_TIP_181` | Lerendor | Playing Lerendor? Your standing under the Treaty of the Narrow Strait decides how far the crowns of the strait trust you. | Lerendor |
| `LOADING_TIP_182` | Mirolon | Playing Mirolon? Parim will not listen to rumours. Send scouts south and gather proof that no court can laugh away. | Volgan spec, Mirolon's proof |
| `LOADING_TIP_183` | West Lands | The West Lands are many crowns in an uneasy calm. The Truce of the Grey Ford holds at the start, and whether it lasts shapes the West. | Western Crossing |
| `LOADING_TIP_184` | East Lands | The caravan roads make Noris and Stabilo rich, and keep them rivals. A price war on the salt road can turn into a real one. | economy, `zin_cb_caravan_roads` |
| `LOADING_TIP_185` | Dark powers | Playing Volgan? Your grave hosts fray far from the Dead Lands. Necromancers slow the decay; patience serves you better than haste. | warfare §6.5 |
| `LOADING_TIP_186` | Dark powers | Playing Zol? Your presence in Erdae grows slowly and can thin away. Tend it, and let the dead do the walking. | Zol's Mistake |
| `LOADING_TIP_187` | Worshipdom | Playing the Worshipdom? Your three valleys hold almost no army. Your strength lies in pilgrims, temples and friends in other courts. | Worshipdom (public face) |
| `LOADING_TIP_188` | Events | Read your events. Many options open or close whole roads of history, and the age can end in more than one way. | events, endings |
| `LOADING_TIP_189` | Focus | Every realm has its own focus tree. Some branches open only as the age moves, so look again when the world changes. | focus trees |

### 8. Loading status lines

Shown in the status band (font `loadscreen_header`, max width 800, so at most 40 characters). `$NAME$` must be kept. File: `localisation/replace/zin_loading_status_l_english.yml`.

| Key | Vanilla | ZIN (proposed) |
| --- | --- | --- |
| `LOADING_GUI` | Loading GUI | Raising the halls |
| `LOADING_HISTORY` | Loading History | Reading the chronicles |
| `LOADING_SAVEGAME` | Loading savegame: $NAME$ | Opening the chronicle: $NAME$ |
| `LOADING_SAVEGAME_NO_NAME` | Loading savegame | Opening the chronicle |
| `LOADING_DATABASES` | Loading databases | Gathering the records of Erdae |
| `LOADING_MAP_SPRITES` | Loading sprites | Painting the banners |
| `LOAD_GFX_PDXMAP_SHADERS` | Loading Map(Creating Shaders)... | Mixing the inks... |
| `LOAD_GFX_PDXMAP_TERRAIN` | Loading Map(Creating Terrain)... | Raising the mountains... |
| `LOAD_GFX_PDXMAP_BORDERS` | Loading Map(Creating Borders)... | Drawing the borders of the realms... |
| `LOAD_GFX_PDXMAP_TEXTURES` | Loading Map(Creating Textures)... | Painting the lands... |
| `LOAD_GFX_PDXMAP_TREES` | Loading Map(Creating Trees)... | Planting the forests... |
| `LOAD_GFX_PDXMAP_RIVERS` | Loading Map(Creating Rivers)... | Filling the rivers... |
| `LOAD_GFX_PDXMAP_STATIC_OBJECTS` | Loading Map(Creating objects)... | Building the cities... |
| `LOAD_INIT` | Initializing Game... | Setting Erdae in motion... |
| `LOAD_EVENTS` | Loading Events | Gathering the tales |
| `LOAD_GFX` | Loading Graphics | Preparing the paints |
| `LOAD_FLAGS` | Creating Flags | Sewing the banners |
| `LOADING_MAIN_MENU` | Loading main menu | Opening the gates of Parim |

The builder reads the vanilla `core_l_english.yml` at build time (when the installed game is present) and fails if a key in this table no longer exists, or if a vanilla key whose English value begins with "Loading", "Creating" or "Initializing" is missing from the table.

## Implementation

### Files in the mod (all generated by the content builder and written through the shared atomic rewrite engine)

| Path | Content |
| --- | --- |
| `descriptor.mod` and the launcher file `../zin.mod` | Add `replace_path="gfx/loadingscreens"` and `replace_path="common/frontend/backgrounds"` |
| `gfx/loadingscreens/load_1.dds` … `load_24.dds` | The 24 screens, 1920×1440 A8R8G8B8 |
| `gfx/loadingscreens/zin_menu_parim.dds` | Main-menu picture (interface spec owns its art); the only other file allowed in this folder |
| `gfx/interface/zin/loadingscreens/load_1_small.dds` … `load_24_small.dds`, `zin_menu_parim_small.dds` | Thumbnails, 192×144 |
| `gfx/interface/zin/loadingscreens/zin_thumb_border.dds` | Picker frame, 192×144 |
| `gfx/interface/Loadingscreen_loadingtip.dds`, `gfx/interface/Loadingscreen_loadingstatus.dds`, `gfx/interface/LoadingScreen_Progress_1.dds`, `gfx/interface/LoadingScreen_Progress_2.dds` | Chrome, exact vanilla names and case, A8R8G8B8 with alpha |
| `interface/small_background.gfx` | Overrides the vanilla file of the same name. Sprites `GFX_load_1_small` … `GFX_load_24_small` and `GFX_zin_menu_parim_small` → the thumbnails above; `GFX_frontend_loading_screen_border_small` → `zin_thumb_border.dds`. No sprite points into the vanilla `gfx/loadingscreens/` |
| `common/frontend/backgrounds/zin_backgrounds.txt` | `zin_menu_parim = {}`, then `load_1 = {}` … `load_24 = {}`; no `dlc_allowed`, no `locale` |
| `localisation/replace/zin_loading_tips_l_english.yml` | `LOADING_TIP_0` … `LOADING_TIP_189` |
| `localisation/replace/zin_loading_status_l_english.yml` | The 18 status lines |

The interface spec keeps `GFX_frontend_bg` and `GFX_frontend_bg_basic` (vanilla `interface/frontendmainviewbg.gfx`, `frontendmainviewbg_basic.gfx`) pointing at `zin_menu_parim` rather than vanilla `load_5`; this spec only requires that neither points at a vanilla file.

### Design data (source of truth)

| Path | Content |
| --- | --- |
| `docs/design/loading_screens.json` (new) | One record per screen: `n`, `title`, `region`, `peoples`, `brief`, `light`, `palette`, `forbid` (extra exclusions), `basis`, `status` (`placeholder`, `generated`, `accepted`) |
| `docs/design/loading_tips.json` (new) | One record per key in key order: `key`, `kind` (`quote` or `tip`), `group` or `topic`, `text`, `attribution` (quotes), `basis`, `refs` (tips), `status` (`proposed`) |
| `docs/design/loading_status.json` (new) | The status-line table |

The tables in this spec are the initial content of these files. After the first build the JSON files are the source; this spec records the final values when they change.

### Builder modules (today under `.tmp/zin-content/`, moving to `tools/content/` per integration S10)

| Module | Role |
| --- | --- |
| `art/loading-jobs.mjs` (new) | Emits the 24 screen jobs (`loading-screen-<n>`, 2048×1536, high), the `loading-chrome` sheet and the `loading-thumb-border` job from `loading_screens.json`, with the prompt frame in §4. Writes `loading-jobs.json` beside the other job lists |
| `lib/raster.mjs` | Existing `dds()`; add a Lanczos 3 resize (art pipeline builder change) and an exact integer box downscale for thumbnails |
| `lib/sheets.mjs` | Existing `findRegionsAdaptive` and `cropRegion`, with the key-colour matte the art pipeline adds |
| `modules/loading.mjs` (new) | Stages the screens, thumbnails, chrome and frame from accepted sources; writes `interface/small_background.gfx`, `common/frontend/backgrounds/zin_backgrounds.txt` (taking the menu entry from `docs/design/interface.json`) and both localisation files; adds the manifest lines; runs the checks below |
| `build.mjs` | Calls `buildLoading(staged, art)` after the UI module; adds the two `replace_path` lines to the descriptor it stages and verifies the launcher file |

Until a screen is accepted, the builder ships nothing for that number (the engine simply has fewer pictures) and warns once; it never ships a vanilla or placeholder picture under a ZIN name. Phase 7 fails the build if any of the 24 is not accepted.

### Builder checks

1. `gfx/loadingscreens/` in the staged mod holds exactly `load_1.dds` … `load_24.dds` and `zin_menu_parim.dds` (phase 7), and nothing else.
2. Every DDS listed above has the size and format in this spec (DDS header read): pictures 1920×1440, thumbnails 192×144, chrome as §6, no mipmaps; or BC1 if the owner picks it and the manifest says so.
3. Every background entry has a picture in `gfx/loadingscreens/` and a `GFX_<name>_small` sprite whose file exists.
4. Loading tips: keys `LOADING_TIP_0` to `LOADING_TIP_<N−1>` with no gap or duplicate; N ≥ the vanilla count read from the installed `loading_tips_l_english.yml` (163 today; constant fallback 163 when the game is absent).
5. Every quote and tip text is under 220 characters and every full string under 300; Windows-1252 only; no unescaped `"`; no `$`, `[` or `]`; `§` only in the tip prefix.
6. The secret scan of [03_names_and_terms.md](../02_lore/03_names_and_terms.md) runs over both files with **no** whitelist: no gated term (Afrit, Hidden Council, Eindil, the thief's name, the lesser artifacts, the plot), and additionally none of: Ein (as a word), "the Man from the Ice", sleeper, Necklace, Roka, Glernaen, heart (with Glo or Horos), demon (with Deliverer).
7. The superseded-name check (Einendil, Edvoid, Rush, Klinti, Gorbat, Sovereign Spirit) and the modern-word check (factory, rifle, democracy, 1936 and the program's list) pass.
8. The four chrome files exist with the exact vanilla case; a test build that writes `loadingscreen_loadingtip.dds` in lower case fails.
9. Both `.mod` files contain both `replace_path` lines.
10. Every shipped image has a manifest line and an accepted provenance line (art pipeline checks).

### Variables, events, game rules, defines

None. Nothing in this spec runs in a game.

## AI

None.

## Acceptance

1. The builder checks above pass on a fresh build, and re-slicing and re-resizing the accepted sources gives byte-identical files.
2. `hoi4.package_check` and `hoi4.gui_inspect` report no missing texture or sprite for `small_background.gfx`, the chrome textures or the background entries.
3. **Linux run** (acceptance L7 of [01_acceptance.md](../09_validation/01_acceptance.md), widened): three cold launches, one new game as Aenor, one save load and one return to the menu. In every loading screen captured by the isolated run: the picture is one of the 25 ZIN pictures; the tip is a ZIN text; the tip and status bands and the progress bar are the ZIN textures; the status line is a ZIN line. No vanilla or DLC picture, tip or status line appears.
4. The main-menu background picker lists exactly the 25 ZIN entries, with ZIN thumbnails in the ZIN frame, and nothing from vanilla or a DLC.
5. `error.log` has no line about `gfx/loadingscreens`, `small_background.gfx`, `zin_backgrounds.txt`, `LOADING_TIP_*` or the status keys.
6. Each accepted screen has a recorded composition check (§4, three resolutions with the bands drawn over it), the art review checklist and the owner's approval.
7. A reviewer reads all 190 tip strings in the staged file and confirms each against this spec's rules: nothing that is untrue at 1 Thaw 4A 1748 for any country, nothing that is a spoiler at any later date.

## Open questions

1. **The Man from the Ice.** The assignment allowed the phrase "the Man from the Ice" in loading text. This spec uses it nowhere, because a loading tip cannot know whether he has woken and the history-for-play spec rules out any legend of a sleeper in the ice. Should the owner want foreshadowing, one Cold Lands line could be added (for example a hospitality saying about strangers found in the snow), but it would show in every game from the first day.
2. **Thumbnails in the loading folder.** Vanilla keeps `_small` files beside the pictures, and every file in that folder is said to be loaded. This spec moves ZIN's thumbnails out of the folder to be safe. Does the engine skip `_small` files anyway? The Linux run can show this; nothing in the design depends on the answer.
3. **The first launch screen.** Is the very first loading screen at game start drawn before `replace_path` takes effect? Naming the first nine screens `load_1` … `load_9` covers vanilla. If DLC pictures still appear there, the fallback is to ship ZIN copies under the DLC names (`load_lar`, `load_nsb`, `load_nsb2`, `load_bba`, `load_aat`, `load_aat2`, `load_ww`, `load_ncns_chi`, `load_ncns_jap` and the older DLC names in `base_backgrounds.txt`), about 15 more files.
4. **Size.** 24 uncompressed screens are about 265 MB in a public repository. Keep the vanilla format, or ship BC1 (about 34 MB in all)?
5. **Attributed lines.** Are the proposed lines given to Aen, King Edran, Lorien, Varner, the Golden King and Alleria acceptable, and are the First and Second Age proposals (Taryn, Senra, Tavriel, Arelon) welcome as remembered names?
6. **Source titles.** Approve or replace "The Chronicle of Erdae: the First Age" (and the other ages), "The Annals of Parim", "The Annals of Gunwaith", "The Harbour Rolls of Sonargur" and "The Litany of the Deliverer".
7. **Other languages.** ZIN ships English text only. Players running the game in another language still see vanilla tips and status lines. Should the builder copy the English files to the other language folders?
8. **Menu backgrounds.** May every loading screen also be offered as a main-menu background (proposed here), or only `zin_menu_parim`?
9. **Calendar phrases.** Lines 30 and 33 say "twelve centuries" and "twelve hundred years" for the Third Age, which is at least 1,200 years (established) and 1,260 (proposed). Acceptable?
