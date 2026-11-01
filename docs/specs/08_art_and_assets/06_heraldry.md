# Heraldry of Aoaz

**Status:** Revised for the K65 rulings (owner decisions of 25 October 2026, with the lead's review of the same day): the realm devices are the generated K65 designs in `k65_designs.mjs`, drawn from each realm's own culture, and every flag is a full-bleed single image. **Date:** 25 October 2026 (K65 revision; K53 revision 25 October; original 24 October 2026). **Requirement:** R-92 (acceptance A-92) and rule F4. **Phase:** art, after the roster redesign (R-21 to R-27).
**Data:** [tools/content/data/world/heraldry.json](../../../tools/content/data/world/heraldry.json) (schema `zin-heraldry/2`), written by [tools/content/heraldry/build_heraldry.mjs](../../../tools/content/heraldry/build_heraldry.mjs) from the realm overrides of [tools/content/heraldry/k65_designs.mjs](../../../tools/content/heraldry/k65_designs.mjs) and the culture vocabulary of [k53_vocabulary.mjs](../../../tools/content/heraldry/k53_vocabulary.mjs); tested by [build_heraldry.test.mjs](../../../tools/content/heraldry/build_heraldry.test.mjs).
**Design table:** [docs/plans/zin-art/flags_k65_design_table.md](../../plans/zin-art/flags_k65_design_table.md) (one row per realm and one row per culture, with the lead's rulings applied).
**Companions:** [01_art_pipeline.md](01_art_pipeline.md), [05_asset_manifest.md](05_asset_manifest.md), [../02_lore/05_world_bible.md](../02_lore/05_world_bible.md), [../02_lore/10_fallen_realms.md](../02_lore/10_fallen_realms.md) (K64, the heirs of the fallen realms), [../00_foundation/03_peoples.md](../00_foundation/03_peoples.md), [../INTEGRATION_DECISIONS.md](../INTEGRATION_DECISIONS.md), [../../design/roster.md](../../design/roster.md).

## Purpose

The owner rejected the first flags (19 October 2026), which were drawn from a regional motif list and an ideology palette, and then the K53 sheets, which still read as region-based symbols and everyday objects.
This spec now describes the K65 system: every realm of the roster has one device that its own culture gives it, and the build turns the records into single full-bleed image jobs and checks the designs.

Each record answers the five questions of section 1.1 in order (people, culture, faith, political form, history).
A culture gives its hand (how a device is cut and stitched), its hem (the border row) and its ground (the field habit), with at most four flat tinctures and one metal thread; the realm gives its device, which is a founder's or oath beast, a crown, a weapon held as a sign, a sacred object, a ship of a seafaring culture, a mythic creature or a strong abstract mark, drawn from its own founding, dynasty, oath, custom or deed (docs/specs/02_lore/10_fallen_realms.md for the realms that are heirs of a fallen realm).

Regional signs are the exception and must be justified in full: only a charge that shows the region's landscape, local fauna or goods as such is regional. Ten realms carry one (SEL, KIL, ANR, MAG, MSH, AUT, SEI, NRS, KEA, MIR), each with its justification in `k65_designs.mjs`.
Animals that a culture reveres (founder's, oath or sacred beasts such as the horse of the Konori, the bear of Tolvael, the hound of Dunelaeth) are culture signs, not regional ones.

Utensils, tools, vessels and structures are not devices.
Weapons are allowed as signs when the realm's history ties them to the realm (a sword, spear-head, crossbow, halberd, war-axe or war-hammer).
Ships are limited to five in all: Lerendor, Blackton, Poloto, Soyano and Fineger.
No star, cross, fleur-de-lis, crescent, battlement, roundel, disc on a plain field, fire, raised fist, clasped hands, knotwork or equal bands carrying the device appears on any flag.

## How the data is made

`build_heraldry.mjs` is the source of the realm designs, the new and renamed grammars and the renames; `heraldry.json` is its output, and the generated regions of this spec (between `<!-- generated:NAME:start -->` and `<!-- generated:NAME:end -->`) are rewritten from the same build.

```text
node tools/content/heraldry/build_heraldry.mjs            build and check; writes nothing
node tools/content/heraldry/build_heraldry.mjs --write    build, check, write heraldry.json and the generated regions of this spec
node tools/content/heraldry/build_heraldry.mjs --verify   fail if heraldry.json differs from a fresh build
node --test tools/content/heraldry/build_heraldry.test.mjs
```

The generator reads the vocabulary, the older grammars, the dynamic-tag rules and the check register from `heraldry.json`, the realms from `roster.json`, the new cultures and the renames from `cultures_new.json` and the twelve gods with their arms from `pantheon.json`.
It has no randomness: every choice is a table entry or a deterministic rule (mark tinctures are the palette tincture with the best contrast, ties broken by name), and the design hash is the first 16 hex digits of the sha256 of the canonical design key.
Every grammar step sets values, so a second run over its own output gives the same file (a test proves it).
The file is written atomically (a temporary file renamed over the old one); it is a design data file, not mod output, so the shared rewrite engine of the content builder is not involved.

## Sources and canon

- The lore vault and its Canon Policy, with the owner corrections of 24 October 2026: the setting is Aoaz; the Great Wall of Aenor is a natural mountain range, so no masonry motif stands for it; Kusven (formerly Edvoid), Zol's most loyal servant, and Afrit's true nature never appear on public arms; demon sigils may use the pentagram, never the cross; no names from other fiction; the twelve gods have names (Glernaen, Sulethe, Lumae, Maelwen, Vaelei, Rasthel, Kerun, Aurlan, Ailtal, Irumas, Gaelor, Naisa), and no national flag shows a named god; Eastern and Southern realms keep their own faiths; the dead are Zol's; Hirolon is a sovereign giant kingdom; the region of the freeholds is the Ember Lands.
- `roster.json` (156 realms: key, tag, culture, second culture, people, faith, calendar, political form, overlord, subject type, story role, former labels and the migration table of the 305 old rows).
- The regional dossiers in `docs/lore/regions/*.md` and the histories in `tools/content/data/world/history/*.json`: every meaning sentence of section 6 cites a founding, a custom or a present fact of its realm.
- `cultures_new.json` (30 cultures, 9 faiths and the renames of `isengard_warlords`, `windwaith_seafarers`, `gunwaith_clans`, `wall_folk`, `ember_lands_freeholds`, the people of `goblin_warrens` and the faiths `stone_vigil` and `river_temples`), `languages_new.json` (Dwarvish, Gnomish, Hearth-Speech, Pack-Tongue, the Low Speech of the Baelim).
- `pantheon.json`: the twelve gods each have arms (a field, a charge and a tincture), so their devices are kept off every national flag (1.5).
- Politics pages: the Houses of the First Light (lamp, loaf and hospital: the Deliverer's public charity), the Lantern Chain, Elzon's Order, the Lost Cause and Afrit's Hidden Council.
- The rejected sheets in `art/source/flags/` and the current pipeline `tools/content/art/flag-jobs.mjs` (16 flags per sheet from a region motif list and an ideology palette).
- The installed game's flags, read but not copied: large and medium flags are uncompressed 32-bit TGA (type 2), image descriptor 0x08, bottom-left origin; small flags are 10x7, 32-bit, descriptor 0x00, bottom-left origin (`gfx/flags/FRA_democratic.tga`, `medium/FRA_democratic.tga`, `small/GER.tga`, `small/FRA.tga`).
- The Python scripts that wrote the provisional designs of the old roster are kept for reference in `docs/design/heraldry_authoring/`; nothing reads them.

Everything not marked as owner canon in this spec is a ZIN proposal and stays replaceable.

## 1. Principles

### 1.1 What a flag must say

Every flag answers five questions, each on its own layer, so that a viewer can read them in order from the largest shape to the smallest.

| Layer | Carried by | Example |
| --- | --- | --- |
| People | The line of partition (each people or family draws its own: Ainic straight with a label, Boreal indented, Eastern stepped, Sylvan engrailed, Sunhot rayonny, orcish raguly, dwarven dovetailed, and so on) | Every Cold Lands clan and every Triton chart-house draws the indented line of the Boreal stock |
| Culture | The palette and the stock of charges | Lake blue, lamp gold and Parim white with bells, barges and loaves for the Lake Aenorans |
| Faith or tradition | One charge taken from the faith's own customs, never a real-world religious sign, never a named god and never a god's device | The clan fire of the Winter Hearth; the hearth-iron of Dondor; the well of the Well-Oath; the knot of the Old Knots; the pass fire of the Pass Fires |
| Political form | Marks of rank: crowns of the culture, council borders, the tripled charge of a league, the overlord's mark | The Concord charter border of lamp gold on every dominion of Aenor; the grave black base on every realm sworn to the Dominion |
| History | The primary and secondary charges, canting arms, borrowed kin tinctures | Kunhrim's rock-cut gate; Dobbum's Famine Bread; Tirlan's grain ship; The Darks' haunch of meat |

A design record states the meaning in one sentence.
If the sentence cannot be written, the design is not finished.

### 1.2 Legibility at the three sizes

The game shows a flag at 82x52, 41x26 and 10x7 pixels.
Each size has a job, and the design rules follow from it.

- **10x7 (the small flag in lists and the map).** Only the field reads: its division and its tinctures. Therefore the pair (division, field tinctures) is unique within each region, and the build measures the colour difference of every pair of small flags in a region (8.5).
- **41x26 (the medium flag in tooltips and the diplomacy screen).** The primary charge must read: it fills 40 to 60 percent of the height, it is drawn as one bold silhouette with a thin dark outline, and no detail is smaller than one fortieth of the height (under one pixel at this size).
- **82x52 (the large flag in the country screen).** Marks and the secondary charge read here: the label, the crown, the border, the small charge in base.

Rules that apply to every record:

1. **The rule of tincture.** A tincture is a metal when its relative luminance exceeds 0.30 and a colour otherwise. A charge must reach a luminance ratio of 2.2 against every field tincture it overlaps, or it is fimbriated (outlined) in a contrasting tincture of the same palette; the record says so. A charge below 1.6 on a single field tincture, or a secondary charge below 1.6, is a design error.
2. **The element budget.** Marks plus charges are at most four; five fails the build. The division does not count.
3. **One primary charge.** A league or confederation may triple it (two above one); nothing else is repeated.
4. **No gradients, no shading, no text.** Tinctures are flat; the only texture is a faint woven cloth.
5. **The flag is the arms.** There is no shield, no supporters, no motto scroll and no frame: the whole rectangle is the field.

### 1.3 Family resemblance and distinctness

Within a culture, flags share the palette, the line, the stock of charges and the marks of form, so that the realms of one people are recognisable as kin at a glance.
Within a region, flags must stay apart: no primary charge is used twice in a culture or more than twice in a region, no charge class (beast, bird, tool, building and so on) covers more than 40 percent of a region of ten or more flags, and no two small flags of a region share a field signature.
Across all of Aoaz no two designs are identical or near-identical: the build measures a distance between every pair of designs over the division, the line, the field tinctures, the charges and their tinctures, the count and the marks (8.5).
The 156 records meet every rule; the class shares per region are in section 6.

### 1.4 The forbidden list

**Regional clichés.**
- `palm_tree`: banned everywhere (the rejected 19 October sheets put palms across the East); the culture card of Wahatud asks for three palms, and the arms show four wells instead.
- `one_motif_per_region`: no primary charge more than twice in a region and never twice in a culture; no charge class above 40 percent of a region with ten or more flags.
- `camel`: once in all the East and South (Noris, which has taken in the Moco tribes).
- `skull`: once per region at most; never for corsairs, never for the dead (no realm of the new roster bears one).
- `snowflake`: banned (the Cold Lands cliché).
- `sun_disc`: at most one per culture (the Lands of Light noon-door); no sun for Gala or the God Forest Keepers.
- `igloo_scimitar_genie_lamp_pyramid`: banned.
- `wall_motifs`: no masonry, battlements, crenellation, brick courses, gate-towers or wall towers for the Great Wall of Aenor, which is a mountain range; the realms of the range (Kingson, the Klungori Guard, Kunhrim, Burrikkrit and the herders of Hirolon) are checked for any tower or wall word.
- `pentagram`: only inside a demon sigil, and once in Aoaz (the Nether's King's seal).

**Real-world flags and arms and their look-alikes.**
- Tricolours: any field of three equal upright or horizontal bands, with or without a charge.
- An unadorned two-band field.
- Stars and stripes: alternating stripes with a canton; stars in a canton or in rows; a ring of stars (including twelve).
- Crescent and star, a crescent alone.
- Any cross throughout: Nordic (offset), St George, St Andrew saltire, Greek or Latin cross charges, cross pattee, Maltese cross.
- Hammer and sickle, hammer and compasses, crossed tools, cogwheels.
- Eagles in national poses: displayed, double-headed, on a cactus, with a snake.
- A lion rampant of national type, three lions passant, a rose of the Tudor kind, a fleur-de-lis, a maple leaf, a cedar of the Lebanese kind, a harp of the Irish kind, a red dragon on green and white, a dragon on a diagonal bicolour (the roost-keepers of Yavieth show a shed scale and the mountain, never the dragon).
- A red disc on white; a rising sun with rays to the edges; a sun with a face; a sun over waves; a canoe over a sun over waves; a frigate bird over a sun.
- A large plain disc or lozenge on a plain field (Japan, Bangladesh, Brazil types); a coin, a lens or a gem never stands alone on a plain field.
- A yurt roof-wheel, a spoked wheel of eight or twenty-four spokes.
- A skull and crossbones, a fouled anchor, a compass rose of four points.
- Chequy red and white, lozengy blue and white, gold with red pales, gyronny gold and black (Croatian, Bavarian, Aragonese, Campbell arms).
- Tartan, thistle, heather, shamrock, rainbow; a trident (the culture card of the Nether asks for one, and its arms show the King's seal instead).

Look-alikes are caught twice: by the vocabulary scan of every record and prompt, and by a perceptual comparison of every generated flag with every flag of the installed game, which is a corpus of real national flags of the 1930s (section 8.5).

**Real religious symbols.** crosses of every form and arrangement, upright or inverted, on every realm including the demons; crescent; star of David or any hexagram; pentagram and inverted pentagram, except a pentagram inside a demon sigil (owner, 24 October 2026); ankh; Om; dharma wheel; yin and yang; swastika of any form; khanda; torii; lotus; hand with an eye (hamsa); triquetra and the endless knot; valknut, sun cross, Celtic cross; ichthys, chalice, dove with olive branch, lamb with banner; eye of Horus, winged sun disc.

**Other fiction.** a white tree with stars and crown, or any crowned tree (the culture card of Dunelaeth asks for a crowned tree, and its arms show the beech without a crown); a lidless or flaming eye; a white hand; a black tower on black; a white horse on green; a direwolf, kraken, three-headed dragon, sun pierced by a spear, golden rose on green; a round door (the culture card of Dobbum asks for a round green door, and its arms show the Famine Bread instead); a pointed red cap for gnomes.

**Lettering.** No letters, numerals, runes, monograms, mottoes, signatures or maker's marks anywhere on a flag.

**The owner's emblem.** Never the owner's ZIN emblem: a square frame with its two diagonals crossed and an upright staff through the centre; no square frame with crossed diagonals in any arms, so an enclave's orle never sits on a gyronny field. The emblem belongs to the branding (R-90), not to any realm.

### 1.5 Canon guards

- **The twelve gods.** The twelve have names and arms in `pantheon.json` (an open eye beneath a circlet for Glernaen, a white bowl brimming over for Sulethe, a lit lamp with one flame for Lumae, three wavy bars beneath a cloud for Maelwen, a ring with a rising shoot for Vaelei, an open gate with a road-staff for Rasthel, a tower on a mount for Kerun, a sheaf under falling rain for Aurlan, a white standing stone bound with a cord for Ailtal, a flaming anvil for Irumas, a furled grey sail for Gaelor, a six-rayed star for Naisa). No national flag names a god or reproduces a god's device; the build scans every charge drawing for the twelve devices. Lamps with an open flame are therefore gone from national arms (lanterns, which are enclosed, remain), Aenor's bowl-lamp became the lamp-crown of the High Kingdom, and the dwarves of Kunhrim show their rock-cut gate instead of an anvil.
- No figure of Zol, Volgan, Afrit, Elzon, Horos or any named person.
- No Afrit or Hidden Council sign on the Worshipdom or Aenor public arms (deny-list below); Afrit's true nature never appears on public arms, so the Ashen Throne shows Aenor's bell cracked and nothing of the power behind it.
- **Zol's servant.** Kusven (formerly Edvoid) never appears on any flag, nor his dwelling of the black oval or his beasts. Zol's Mistake shows only the sigil of its emblem leader, The Will of Zol (broken concentric rings on the void, the same sigil as its leader's portrait); no realm is named after its leader, and no flag shows a leader.
- Volgan's realm, Puvulan, shows the Gate of Nafeher within the ring of names; the gate appears on no other flag.
- Glo, Horos's blue sword and its shards are reserved charges: owner approval and a story gate are required.
- No device of Elzon's Order (the Pale Regency) on any living realm; Nezer, which holds Elzon's old seat, shows its galley and nothing of him.
- Nothing of the wider world (Erdu, Dunda, Haven, Cerio, Lao and the small neighbouring continent).
- The Great Wall of Aenor is drawn as peaks, passes, snowlines and the ringed vale: Kingson bears a sword upright on a plain snowline-white field for the watch-families who took the forts, the Klungori Guard a crossbow on the rising pass, Kunhrim the Deep King's crown of Gromatrak, never a rampart or a gate-tower.
- The Worshipdom is Afrit's realm in secret. Its public arms show the hostel's charity (a hand offering a loaf, the pilgrim's staff) and must never show an eye, a chain, ash, a mask, a veil, a serpent, horns, a fire-bird, two figures, a hidden face, a key in a hand, a closed door, a lamp with an open flame, or a crown before the King of the East.
- No ring or set of twelve stands for the gods (Q-01 is answered by the names, not by a device).
- Gala and the Sunhot realms are kept visually unrelated (different lines, no shared sun), because their relation is open; the God Forest Keepers draw a line of their own and no sun, because their kin is open.
- Yeldenne is an ordinary northern town (decision L2): its arms show a whale-rib door arch and the loaf of the Silent Road, never Glo, a green crystal, a knight or a blue sword.
- Kvittumm's arms show only herds and the winter moot: nothing hints at who sleeps in its ice.
- The mycids are drawn only by what the vault knows (the forest and its fungi), as a proposal until the owner rules on them.

## 2. Shared vocabulary

### 2.1 Lines of partition

A line of partition is the edge between two parts of the field. In ZIN it is the mark of a people or family.

| Line | Drawn as | Used by |
| --- | --- | --- |
| straight | a straight line | Ainic men, Men under Sunhot patronage, the dead |
| indented | an indented line of small even teeth | Boreal men |
| stepped | a stepped line like a short stair (grady) | Eastern men |
| wavy | a wavy line (undy) | Southern islanders |
| nebuly | a cloud-like interlocking line (nebuly), like a cord pulled through loops | Orran men |
| engrailed | an engrailed line of small inward scallops | Sylvan elves |
| invected | an invected line of small outward scallops | Gala elves |
| rayonny | a rayonny line of alternating straight and flame-shaped rays | Sunhot elves |
| raguly | a raguly line of lopped-branch stubs | Orcs and ogres |
| dovetailed | a dovetailed line of joiner's mortises | Dwarves |
| potenty | a potenty line of T-shaped notches | Goblins and hobgoblins |
| bevilled | a bevilled line with a single sharp offset step | Dwarf goblins |
| arched | a single broad arch (enarched) | Giants |
| double_arched | two low arches side by side | Small folk |
| dancetty | a dancetty line of three large zigzag peaks | Yeti |
| urdy | an urdy line of pointed stakes | Trolls |
| rooted | a rooted line from which short root-strands hang | Ents |
| gnarled | a gnarled line of slow, uneven swellings like old bark | The Baelim (tree-people) |
| gilled | a gilled line of fine close upright ribs, like the underside of a mushroom cap | Mycids |
| wattled | a wattled line woven over and under like a hurdle of branches | The God Forest Keepers |
| rent | a rent line, jagged like torn hide | Demons |
| fracted | a fracted line, broken and offset halfway along | Devils |
| escartelly | an escartelly line with one square notch | Gnomes |

### 2.2 Divisions of the field

| Division | Drawn as |
| --- | --- |
| plain | a plain field of A |
| per_pale | a field divided upright, A at the hoist and B at the fly, by the line |
| per_fess | a field divided across, A above and B below, by the line |
| per_bend | a field divided diagonally from the upper hoist corner, A above and B below, by the line |
| per_bend_sinister | a field divided diagonally from the upper fly corner, A above and B below, by the line |
| per_chevron | a field divided chevron-wise like a broad roof, A above and B below, by the line |
| chief | a field of A with a chief (a band across the top, two sevenths of the height) of B edged by the line |
| base | a field of A with a base (a band across the bottom, two sevenths of the height) of B edged by the line |
| quarterly | a field quartered A and B, the upper hoist quarter A, by the line |
| gyronny | a field gyronny of eight pieces A and B |
| pile | a field of A with a pile (a broad wedge from the top edge narrowing to a point near the bottom) of B edged by the line |
| pile_reversed | a field of A with a reversed pile (a broad wedge rising from the bottom edge to a point near the top) of B edged by the line |
| flaunches | a field of A with flaunches (two curved segments at hoist and fly) of B edged by the line |
| bordure | a field of A within a border of B edged by the line |

Three equal bands, upright or across, are not in the vocabulary (tricolours).
A plain two-part field always carries a charge.
The saltire, every cross and the canton are not in the vocabulary.

### 2.3 Marks of rank and political form

| Form | How it shows |
| --- | --- |
| High kingdom | Aenor alone: the lamp-crown alone on lake blue and no label, because Aen's own realm needs no difference |
| Kingdom | The culture's crown: a lamp-crown (Lake Aenorans), a white felt (Steppe Riders), an oar-crown (Isle Houses), a ship-crown (Leren), a crown worn at the beast's neck (Free Crowns), an iron band (Dondor), an icicle crown (Coldor), a tine crown (Holdon), a torc (Gunwyn), a well-crown (Noris), a sea-crown (Naamis), a river-diadem (the river-kings), a lantern-crown (Ostoroth), a leaf circlet (Herrodon), an endless circlet (Gala), a tusk crown (Goldoroth), a crown of bone charms (Dun), the grown crown (the hobgoblin king of Burrikkrit), the hall-crown (the King of Demons), a captain's ring (Nondondor). Kingdoms of peoples without crowns show rank by their charge: Hirolon and Nivaros by the cairn and the throne, the Troll Forest by the boulder, Mirolon by the heron of its High Warden |
| City-state | No crown; a divided field, the trade or craft charge over all (guild cities are quartered in two guild colours) |
| Council (elected realms, moots, leagues of speakers) | No crown; sylvan councils add a narrow engrailed silver border (the Magical Forest, Lccimio) |
| Clan | No crown; the clan beast or token |
| Confederation or league | The primary charge tripled, two above one (Noleksun's three geese, Kvittumm's three antlered heads, Adel's three charts); a realm whose charge already counts its members (Dulundur's four fires, Wahatud's four wells) or whose field is divided between its crowns (Nezer) says so in a form note, and quartered guild leagues show the guild colours instead |
| Enclave | An orle (an inner frame) in a tincture of the surrounding realm: Olodor in Aenor's lake blue, Hoorunoron in Dondor's iron grey, the Mushroom Forest in the rift coast's teal |
| Forest domain | Charges shown with their roots; the ents draw the rooted line, the Baelim the gnarled line |
| Boss-warrens | The boss's iron ring round the charge (Mustnom) |
| Theocracy and sanctuary | A metal in the field and the charge of the faith: no crown, no label, no beast; the Sunhot realms are never kingdoms |
| Emblem realm | Zol's Mistake: the void field and the Will of Zol alone |
| Subject of Aenor | The charter border: a plain narrow border of lamp gold, the seal-cord of the Charters of Parim (all thirteen dominions, including Kunhrim's Iron Charter and Kilinti) |
| Sworn to the Dominion | A narrow base of grave black: the realm stands on the Dominion's ground (Khorvrath, Dolon, Nezer) |
| Tributary of Goldoroth | The Iron Yoke: a narrow border raguly of ash grey (the Dark Gate) |
| Protectorate | The protector's ward: a narrow border of cairn brown for Hirolon's Tirlan, a narrow border engrailed of night slate for Herrodon's Teste |
| Sovereign | No overlord mark of any kind: Hirolon treats with Aenor under the Cairn Treaty from outside the Charters |

### 2.4 Charge classes

Every charge has one class for the regional share check: beast, bird, sea_creature, shell, insect, plant, tree, landform, water, celestial, fire, building, ship, tool, weapon, vessel, garment, token, body_part, crown, sigil. Only a charge marked regional (the ten K65 regional signs, each justified in full) counts as a regional sign; a culture animal keeps its class and counts only in the class share.

## 3. Families and kinship

Kinship between cultures shows in three ways, which match the three ways peoples became kin in the lore.

- **By ancestry**, through the family mark: the line of partition (and, for Ainic realms, Aen's label).
- **By migration**, through a borrowed tincture: a people that settled among another takes one tincture from its new neighbours (the Leren of Blackton bring the strait's blue to Dondor's black; Hirolon's field is the Grano green of its Hilofrim tenants; Gala's shore is the green of its Sunfolk villages; Luv-zhise's far shore is the silver of the elves who chartered it).
- **By conquest, oath or patronage**, through a borrowed charge or the overlord's mark: the charter border of the Concord, the grave base of the Dominion, the Iron Yoke of Goldoroth, the wards of Hirolon and Herrodon, the Sunhot patrons' rayonny chief over Goodin, the dwarves' hammer of the Hill Pact under Heodwa's rowans, Coldor's clan fire under Horidor's cairn, the ogres' haunch on the orc colours of The Darks.

A realm borrows at most one tincture of another culture (the build counts them).

<!-- generated:families:start -->
| Family | Line | Mark | Meaning | Cultures |
| --- | --- | --- | --- | --- |
| Ainic men | straight | Aen's label: a narrow bar across the upper field with three short square pendants, in a metal of the culture | The label is the medieval mark of a son of the house. Realms of Ainic speech and stock bear it because their first crowns were among the kingdoms Aen joined, and the Reckoning of Lines counts their founding houses among the descendants of his sons (proposed reading). Aenor itself bears none: the crown of Aen's own realm needs no difference. A theocracy bears none, because a faith claims no line. | lake_aenoran, selen_ranger, steppe_rider, vale_folk, hilofrim_herders, march_folk, isle_houses, strait_folk, teste_valley_folk, leren_sea_kings, free_crowns_north, dondor_brutes, mirolon_wardens, ember_freeholds, zilin_pilgrims |
| Boreal men | indented | every line of partition is indented: small even teeth | The indented line is the toothed north-western shore that the Aenoran charts met already peopled; Gunwyn, Coldic and Tritonic realms all draw it, which is how a Triton chart-house and a Cold Lands clan show they share a stock older than the charts. | gunwyn_clans, girdon_wardens, western_guilds, buldor_companies, winter_crown, ice_clans, reindeer_clans, melkgard_warlords, vindael_seafarers, chart_islanders, corsair_lords |
| Eastern men | stepped | every line of partition is stepped like a temple stair (grady); never crenellated | The stepped line is the stair: the temple stairs above the flood-line, the terraced roads of the caravans and the wells cut in steps. Noric, Stabilic and Alerhic realms all draw it, from the snow coast of Woqood to the passes of Miaed and the wells of Wahatud; the line marks the stock, and each realm keeps its own faith. | noris_riders, caravan_princes, river_kings, lake_road_cities, red_lands_tribunes, naamis_sea_crown, woqood_sealers, orato_fishers, quay_folk, miaed_pass_lords, wahatud_oasis_folk |
| Orran men | nebuly | every line is nebuly, like a cord drawn through loops | The nebuly line is the cord of the Old Knots, the oldest custom of men in Aoaz, kept by the speech of the beaten kingdoms. | veiled_folk, redbark_tribes |
| Southern islanders | wavy | every line is wavy | The wavy line is the reef's surf, counted wave by wave in the Wave-Tally. | southern_islanders |
| Men under Sunhot patronage | straight | a chief whose lower edge is rayonny, in sun yellow | Men who serve the Sunhot sanctuaries carry the patrons' rayonny edge only on a chief: the sanctuary stands over the guest-town, it is not its kin. | goodin_sunfolk |
| Sylvan elves | engrailed | every line is engrailed, and elven silver appears in every achievement | The engrailed line is the edge of a leaf; silver is the Kindred Song. The realms of the Magical Lands and the household of Dunelaeth on the wrong side of the range share both, so a hill hall and a lake court are known as kin at a glance. | forest_council_elves, hill_kingdom_elves, lake_elves, pass_wardens, rift_coast_elves, kingdom_forest_elves, roost_keepers |
| Gala elves | invected | every line is invected | The invected line is the rim of the Mirror of First Rain. It is deliberately not the Sunhot rayonny line: the kinship of Gala and the Sunhot realms is open, and the arms must not answer it. | gala_court |
| Sunhot elves | rayonny | every line is rayonny; a sun disc appears in at most one achievement of each culture | The rayonny line is noon light on a sanctuary threshold. It carries the Sunhot identity so that the charges are free to show what each sanctuary keeps, instead of a sun on every banner. | sunhot_light, sunhot_western, sunhot_isles |
| Orcs and ogres | raguly | every line is raguly, like a lopped branch | The raguly line is the hewn stake of the holds' palisades and the challenge ring; every hold draws it, which says the holds are kin without saying they obey one master. Ogres draw it too, because an ogre is like a giant orc and lives among them. | volcano_clans, iron_clans, wild_holds, sea_orcs, ogre_clans, plateau_soldiery |
| Goblins | potenty | every line is potenty, like tunnel mouths | The potenty line is a warren seen in section: tunnel, chamber, tunnel. The free warrens of Burnikit, the hobgoblin king's warrens of Burrikkrit and the warm-spring warrens of Glimkit all draw it. | goblin_warrens, king_warrens, spring_warrens |
| Dwarves | dovetailed | every line is dovetailed, like a joiner's mortise cut true into rock | The dovetailed line is a hall cut true into the mountain. The hold-folks of the Great Wall range, the West Lands and the High Mountains all draw it, and no tincture of theirs is shared with any elven arms. | wall_delvers, west_delvers, north_delvers |
| Peoples without kin | own | each people keeps its own line (see the people grammar) | Trolls, giants, yeti, ents, the Baelim, the mycids, the small folk, the gnomes, the dwarf goblins, the God Forest Keepers, the dead and the demons share no line with anyone outside their people: their arms answer only their own people. | troll_tribes, hill_giants, ice_giants, cairn_giants, yeti_clans, height_yeti, kilinti_ents, baelim, mycid_rings, hearth_folk, holt_gnomes, road_warrens, god_forest_keepers, grave_hosts, zols_dead, netherborn, nether_houses, veshazel_court |
<!-- generated:families:end -->

## 4. Grammars of the cultures

Each card gives the palette (named tinctures with hex values; M = metal, C = colour), the favoured divisions, the stock of charges with their meaning in that culture, ornament, rank and form, kinship and the breakaway difference used for dynamic tags (section 7).
Charges marked as restoration are the culture's sign of a realm restored.
The realm count is the number of roster realms whose first culture the grammar is; realms whose second culture it is are named after it.

This revision adds the grammars of the 30 cultures of `cultures_new.json`, rewrites the four renamed ids under their new names (`melkgard_warlords` for `isengard_warlords`, `vindael_seafarers` for `windwaith_seafarers`, `gunwyn_clans` for `gunwaith_clans`, `ember_freeholds` for `ember_lands_freeholds`; the roster still writes the old ids and both resolve to the new grammar), retires `wall_folk` (split into `vale_folk` and `hilofrim_herders`, because there is no wall), moves `goblin_warrens` to the goblins and renames the faiths `stone_vigil` and `river_temples` to `pass_vigil` and `flood_stair`.
Where a culture card of `cultures_new.json` asks for a motif the register forbids (a round door, palms, a trident, a red cap, a crowned tree, a sun for the God Forest, a gate-tower in the pass, a gold anvil, a black sail), the grammar says what it draws instead under *Not drawn from the culture card*.

<!-- generated:cultures:start -->
### Lake Aenorans (`lake_aenoran`)

*People:* men. *Family:* Ainic men. *Language:* aenoran. *Faith:* deliverer. *Line:* straight. *Realms:* 4 (Aenor, Safeton, Freshon, Pazoma); second culture of 1.

*Palette:* lake blue `#2f5d8a` (C); deep lake `#1d3a5c` (C); lamp gold `#d4ad45` (M); pale gold `#e8d9a0` (M); Parim white `#f2f0e6` (M); slate `#56677a` (C); bell bronze `#8e5f2c` (C).

*Divisions:* plain, per_fess, per_pale, per_bend, per_bend_sinister, chief, base, per_chevron.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `bowl_lamp` | a bowl-lamp with one flame | the lamp lit in a window for the traveller; the realm keeps the light for the stranger |
| `change_bell` | a great bell | the change-bells of the chartered towns and the bell-signalled formations of the Concord of Aen's joined kingdoms |
| `lake_wave` | a single lake wave | the Great Lake that feeds the basin |
| `lake_barge` | a lake barge with a square sail | the barge-trade between Parim, the lake ports and the passes |
| `guest_loaf` | a round loaf | bread on the board: a guest is fed for a night |
| `statute_book` | a closed book with clasps | written statute and the Reckoning of Lines |
| `canal_bridge` | a single-arched canal bridge | the canals and bridges of the lake cities |
| `lake_pike` | a pike swimming | the fisher-guilds of the lake shore |
| `barley_sheaf` | a sheaf of barley | barley bread and honey ale: the bread-basket of the basin |
| `glass_flask` | a lake-glass flask | the glassworks of the shore towns |
| `scribe_quill` | a quill | the scribes who keep the rolls and the charters |
| `lit_window` (restoration) | an arched window with a lamp in it | hospitality: the lamp in the window for the traveller |
| `reed_swan` | a swan swimming | the reed-shore estates of the lake |
| `honey_skep` | a straw skep | the honey of the lake meadows |
| `golden_seal` | a hanging gold seal on a cord | the Golden Charter a town buys from the court |
| `clasped_hands` | two hands clasped at the wrist | the Concord of Aen's joined kingdoms, sworn hand to hand |
| `rod_of_office` | a long tapering sceptre with a flared head | the staff the Harbour-Master of Safeton holds over the ships of the charter |
| `gold_disc` | a plain gold disc ringed by a thin band | the hanging seal of the Golden Charter, drawn as a disc of the court |
| `glass_goblet` | a broad glass goblet on a tall foot | the glassmakers of Pazoma and their clear work for the Concord |
| `glass_drops` | a ring of six glass drops round a bare centre | the glassmakers of Pazoma and their clear work for the Concord |

*Ornament:* Clean straight partitions, charges drawn like guild seals: centred, upright, generous margins. The label sits in chief; a Concord dominion adds the charter border of lamp gold.

*Rank and form:* high kingdom: Plain lake blue, the charge under the lamp-crown, no label; kingdom: The lamp-crown over the charge; city state: A free lake town shows its charge on a divided field and no crown; subject: The charter border: a plain border of lamp gold (the seal-cord of the Charters of Parim). *Crown:* the lamp-crown: a gold circlet of five flame-shaped points.

*Breakaway difference:* the charter border cut away in chief, or for a non-dominion a border of slate (dissent tincture slate).

### Selen Rangers (`selen_ranger`)

*People:* men. *Family:* Ainic men. *Language:* aenoran. *Faith:* green_lords. *Line:* straight. *Realms:* 1 (Selen).

*Palette:* wood green `#3f6b2e` (C); deep green `#24401c` (C); bark brown `#6b4a2c` (C); ash silver `#c9d6c0` (M); hazel gold `#b8973f` (M); birch white `#eef0e4` (M).

*Divisions:* plain, per_fess, per_bend, base, chief.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `hollow_oak` | a hollow oak with its roots | the Moot Tree, and the dead buried standing in hollow oaks |
| `three_arrows` | three arrows, points down | the Three Arrows: the bride-gift, the poacher's fine and the midsummer shooting |
| `oak_bough` (restoration) | an oak bough with acorns | the woods held through the Third Age |
| `hunting_horn` | a curled hunting horn | the rangers' horn calls |
| `arrow_quiver` | a quiver of arrows | the bowyers and the longbow levy the moots may refuse |
| `longbow` | a longbow strung upright | the arm of the Quiet Law, the bow of the woodland moots |

*Ornament:* Woodland charges drawn whole, roots and fletching visible; nothing gilded except hazel gold.

*Rank and form:* council: A moot realm: no crown; the First Warden is shown by the hollow oak of the Moot Tree; subject: The Concord charter border of lamp gold (borrowed from the lake Aenorans).

*Breakaway difference:* a border of deep green engrailed with oak leaves (dissent tincture deep green).

### Steppe Riders (`steppe_rider`)

*People:* men. *Family:* Ainic men. *Language:* aenoran. *Faith:* horse_oath. *Line:* straight. *Realms:* 2 (Konori, Hunhun).

*Palette:* steppe red `#a8432c` (C); felt white `#e6e0cc` (M); steppe gold `#c9a45a` (M); horse brown `#6b4a30` (C); dusk blue `#4f6f8f` (C); black felt `#2b2622` (C).

*Divisions:* plain, per_fess, per_bend, per_chevron.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `horse_head` | a flat horse's head silhouette in black felt, outlined in gold, with one curl of mane | the riders kingdom and the ford of the Aenar |
| `horsetail_standard` | a horse-tail standard on a pole | the standard of the summer Gathering |
| `steppe_saddle` | a saddle | the bride's family gives the saddle, the groom's the mare |
| `felt_tent` | a felt tent seen from the side | the tents of the oath at the Gathering |
| `milk_bowl` (restoration) | a wooden bowl | mare's milk: a guest drinks and is a guest for three days |
| `horse_barrow` | a barrow mound facing east | the dead buried with a horse in barrows facing east |

*Ornament:* Horse charges are heads or standards, never a whole running horse; no green fields (another fiction's white horse on green).

*Rank and form:* kingdom: The charge set on the white felt; horde: A Horse-Lord chosen at the Gathering: the horse-tail standard, and a row of three small hoof-marks in base; subject: The Concord charter border; moot: A riders' moot under a Horse-Lord: the horse-tail standard and the hoof-marks of the host. *Crown:* the white felt: the charge set upon a spread white felt, as kings are acclaimed.

*Breakaway difference:* a border of black felt (dissent tincture black felt).

### March-Folk (`march_folk`)

*People:* men. *Family:* Ainic men. *Language:* aenoran. *Faith:* lamp_furrow. *Line:* straight. *Realms:* 2 (Herez, Noleksun).

*Palette:* march ochre `#b38a3a` (C); field green `#4e6b3a` (C); palisade brown `#5e452a` (C); chalk white `#e8e0c8` (M); beacon red `#b0472f` (C).

*Divisions:* plain, per_fess, per_chevron, base.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `beacon` | a beacon: a fire-basket on a pole | the beacon towers of the frontier farms |
| `ploughshare` | a ploughshare | free farmers who own their land |
| `ox_yoke` | an ox-yoke | land divided among sons, worked in common |
| `boundary_stone` (restoration) | a boundary stone | the moot that settles field-bounds |
| `sling` | a sling | the sling-militia of the marches |
| `linked_rings` | a row of three linked iron rings | the three leagues of free farmers, joined by their oath |

*Ornament:* Farm tools drawn plainly; the beacon is the culture's honour charge.

*Rank and form:* confederation: A league of free farmers: the charge tripled (two and one); march lordship: A Marcher-Lord: the beacon alone, large; subject: The Concord charter border; march: A march lordship: the beacon, no crown.

*Breakaway difference:* a border of palisade brown (dissent tincture palisade brown).

### Isle Houses of Asgard (`isle_houses`)

*People:* men. *Family:* Ainic men. *Language:* aenoran. *Faith:* isle_tide. *Line:* straight. *Realms:* 1 (Orohaf).

*Palette:* sea grey `#4a6f7c` (C); foam white `#ece4d0` (M); oar brown `#7e6040` (C); deep sea `#2c4a55` (C); sash red `#a8443a` (C).

*Divisions:* per_fess, base, plain.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `isle_lighthouse` | a lighthouse with a red fire | the lighthouse-shrines where the tide-houses name their dead |
| `tide_oar` (restoration) | an oar upright | the house boats and the tide-court |
| `sea_fire` | three tongues of sea-fire rising from one base | the fire of the Borrak lighthouse-shrine, kept lit for every fleet from the West |
| `isle_crown` | a low crown of five points | the crown of the queen the eldest women of the five Isle Houses choose for life |

*Ornament:* Sea charges stand on a calm base; the sash red appears once, as the lighthouse fire or a sash.

*Rank and form:* kingdom: A queen chosen from the great houses: the oar-crown; subject: The Concord charter border. *Crown:* the oar-crown: a circlet of five oar-blades.

*Breakaway difference:* a border of deep sea (dissent tincture deep sea).

### Leren of the Strait (`leren_sea_kings`)

*People:* men. *Family:* Ainic men. *Language:* leren. *Faith:* strait_litany. *Line:* straight. *Realms:* 4 (Lerendor, Eekedor, R'en, Keredor-Hellekton); second culture of 1.

*Palette:* strait blue `#2a5a82` (C); salt white `#e8e6dc` (M); Leren silver `#b8c4cc` (M); deep strait `#173a59` (C); kelp green `#3f5f4a` (C); clasp gold `#c4a24e` (M).

*Divisions:* plain, per_fess, per_pale, per_bend, base.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `two_waves` | two waves, one above the other | Lerendor and Lerendor's North under one High Crown |
| `leren_cog` | a high-prowed ship with one square sail | the fleets of the strait |
| `strait_gull` | a gull | the skerries and the herring grounds |
| `grey_seal` | a seal | sealskin and the hunting skerries |
| `salt_cellar` | a salt cellar | salt set on the arbitration table binds both parties |
| `steering_oar` | a steering oar | the steersman's right in the strait code |
| `skerry` | a black skerry rock | the low skerries of the outer coast |
| `quay_bell` (restoration) | a quay bell | the Singing Quay of Sonargur |
| `joined_oars` | two steering oars joined by one ring | two coast crowns steered as one |
| `cape_watch` | a watch-house on a low cape | the forts on the strait cape that the first prince of R'en built and refused to pay for |
| `salt_ring` | a ring of six white salt-stones set round a bare centre | the salt shared at the table, which binds both sides of a quarrel in the Arbitration Court |
| `refused_gate` | a plain gateway of two posts and no lintel | the watch-house gate that the first prince of R'en built on the strait cape and refused to pay for |
| `joined_crowns` | two low crowns joined by one ring | the double crown of Keredor and Hellekton, whose court crowns every heir twice |
| `twin_rings` | two rings joined one through the other | the double crown of Keredor and Hellekton, whose court crowns every heir twice |

*Ornament:* Silver rather than gold; ships high-prowed with one square sail; no anchors and no fouled anchors.

*Rank and form:* high kingdom: Two waves under the ship-crown: one High Crown over two realms; kingdom: The ship-crown over the charge; council: A Speakers' Hall seat: no crown. *Crown:* the ship-crown: a circlet whose points are raised prows.

*Breakaway difference:* a border of deep strait (dissent tincture deep strait).

### Free Crowns of the North (`free_crowns_north`)

*People:* men. *Family:* Ainic men. *Language:* leren. *Faith:* strait_litany. *Line:* straight. *Realms:* 6 (Molot, Tolvael, Tolhon, Heodwa Lands, Mina, Dolpar).

*Palette:* earth brown `#7a6a54` (C); fir green `#4e5e4a` (C); hearth red `#9a3a2c` (C); hill grey `#8a8a80` (C); fleece white `#e4dccb` (M); straw gold `#c8b070` (M); peat black `#2e2a26` (C).

*Divisions:* plain, per_fess, per_pale, per_bend, per_bend_sinister, chief, base, per_chevron.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `north_bull` | a bull standing | the strong hand and the cattle-wealth of the hills |
| `badger` | a badger | the hill-fort dug in and stubborn |
| `grey_crane` | a crane standing | the marsh lowlands and a careful watch |
| `brown_bear` | a bear standing on its hind legs, forepaws raised | the bear of Tolvael, the first of the free crowns of the North |
| `night_owl` | an owl | the arbiters' patience |
| `ash_tree` | an ash tree | the ash of the moot hill (canting on the name) |
| `grey_wolf_north` | a wolf walking | the winter raids it endured and returned |
| `rowan` | a rowan tree in berry | the rowan planted at every hall door |
| `otter` | an otter | the river-fords and the eel weirs |
| `hare` | a hare | the open downs and quick riders |
| `white_stork` | a stork | the nesting storks of the hall roofs (canting on the name) |
| `lynx` | a lynx | the high woods |
| `hall_mound` | a timber hall on a mound | the hill-fort that names the realm |
| `ram` | a ram | the wool of the hill farms |
| `yew_tree` | a yew tree | the bow-staves of the hills |
| `silver_birch` | a birch tree | the northern birch woods |
| `miner_pick` | a miner's pick | the hill mines |
| `mole` | a mole | the miners of the hill, who work unseen |
| `hawthorn` | a hawthorn in blossom | the hedged fields and the marriage-boughs of crown-sharing weddings |
| `alder` | an alder tree | the wet valleys |
| `red_fox` | a fox | cunning in feud |
| `linked_crowns` (restoration) | two small crowns linked | the crown-sharing marriages that join neighbouring kingdoms |
| `raised_wings` | a pair of wings raised high | the crane that watches over the marsh of Molot, and the fortress line that took the raiders |
| `three_arch_bridge` | a bridge of three round arches | the toll-bridge at Sirtum, which keeps Tolhon at a distance from everyone else |
| `hill_crown` | a small plain crown with a single point | the hill crown of Heodwa, Nuatax and Agniy under the Hill Pact |
| `notched_crown` | a crown whose rim is cut with notches, like a mine stope | the crown that the king of Mina earns by working a season in the Delvings |
| `lake_fires` | four fires set in a row | the four walled towns round the deep lake of Dolpar |

*Ornament:* One beast or one tree, whole, walking or standing; the crown at its neck or in its branches; Aen's label in chief.

*Rank and form:* kingdom: The gorged crown on the beast or in the tree (every Free Crown is a small kingdom); march: A margravate: no crown; the beast keeps watch; principality: A prince of a coast: no crown; confederation: The hill crowns' charge tripled, two above one; league: The lake towns' charge tripled, two above one. *Crown:* the gorged crown: the beast wears a small plain crown about its neck, or the crown hangs in the tree's branches.

*Breakaway difference:* the crown torn from the beast's neck and shown below it (dissent tincture peat black).

### Dondor Brutes (`dondor_brutes`)

*People:* men. *Family:* Ainic men. *Language:* dondric. *Faith:* hearth_iron. *Line:* straight. *Realms:* 2 (Dondor, Blackton).

*Palette:* hold black `#2a2a2e` (C); iron grey `#7a7a76` (C); rust `#7a4a2a` (C); ash `#a8a8a0` (M); bone `#d6ccb4` (M); ember red `#8a2e22` (C).

*Divisions:* plain, per_fess, per_bend, chief.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `bearded_axe` | a bearded axe | the clan war and the king chosen from the strongest line |
| `feud_chain` | a chain of three links | the blood-price: a death paid in iron or in blood |
| `hearth_iron` (restoration) | a forged bar with ring ends | the bar of iron kept at every hearth and passed to the eldest son |
| `stockade_gate` | a timber gate | the high stockades of the forest holds |
| `iron_fist` | a clenched iron fist | the Brute-Kings and the insult taken for a boast |
| `sail_bar` | a single square sail hung from a bar | the harbour towns of Blackton and their black sail |

*Ornament:* Heavy iron-bound charges, square and blunt.

*Rank and form:* kingdom: The iron band over the charge; the king is chosen by the clan-moot from the strongest line. *Crown:* the iron band: a plain iron crown with no points.

*Breakaway difference:* a border of rust (dissent tincture rust).

### Wardens of Mirolon (`mirolon_wardens`)

*People:* men. *Family:* Ainic men. *Language:* mirolic. *Faith:* warden_vigil. *Line:* straight. *Realms:* 1 (Mirolon).

*Palette:* warden blue `#3c5f78` (C); lake grey `#9fa7ae` (M); beacon gold `#cbbd8e` (M); night blue `#233849` (C); heron white `#e6e8e4` (M); signal red `#a0442f` (C).

*Divisions:* plain, per_fess, chief.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `watch_heron` | a heron standing on one leg | the lake-watch: Mirolon's own name |
| `south_lamp` (restoration) | a lamp with its flame blown to one side | the lamp every tower keeps lit toward the south |
| `beacon_tower` | a stone beacon tower on a pass | the beacon towers of the passes |
| `stilt_house_m` | a house on stilts | the stilted lake towns |

*Ornament:* Watchful charges, upright and still.

*Rank and form:* council: The High Warden is elected: no crown; the lamp turned south is the vigil; kingdom: A High Warden chosen for life over a realm that would never again have kings: no crown.

*Breakaway difference:* a border of night blue (dissent tincture night blue).

### Zilin Pilgrim-Folk (`zilin_pilgrims`)

*People:* men. *Family:* Ainic men. *Language:* aenoran. *Faith:* deliverer. *Line:* straight. *Realms:* 1 (Worshipdom).

*Palette:* hostel white `#efe9d0` (M); pilgrim gold `#c9a24a` (M); sky blue `#7f9fc4` (M); bread brown `#9a6c3e` (C); chapel stone `#d8d2c0` (M).

*Divisions:* plain.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `offered_loaf` | a hand from the base offering a round loaf | the loaf given to the stranger; the hand is unarmed and gives |
| `hostel_lamp` (restoration) | a small standing lamp | the lamp kept for the stranger in the hostels of the Deliverer |
| `pilgrim_staff` | a pilgrim's staff | the pilgrims of the Zilin valleys |

*Ornament:* Plain hostel white; the charges of care only; no crown, no label, no weapon (no weapon passes the hostel gate). No lamp with an open flame: a lit lamp with one flame is the arms of Lumae of the twelve.

*Rank and form:* theocracy: A plain metal field and the charge of the faith alone: no crown, no label, no beast.

*Breakaway difference:* a border of bread brown (dissent tincture bread brown).

### The Veiled (`veiled_folk`)

*People:* men. *Family:* Orran men. *Language:* orran. *Faith:* old_knots. *Line:* nebuly. *Realms:* 1 (Cursed Lands).

*Palette:* veil grey `#5a5560` (C); char `#2b2830` (C); ash lilac `#9d98a3` (M); undyed wool `#d8d0c0` (M); cord red `#7a3a34` (C).

*Divisions:* per_fess, plain, base.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `cord_knot` (restoration) | a single loose knot in a cord, both ends hanging | names are knots in a cord: a child is tied into her mother's line and the dead are never untied |
| `drop_spindle` | a drop spindle | the cord-mothers who spin the line |
| `grey_veil` | a hanging veil | the grey linen veils of the Veiled |

*Ornament:* Undyed, muted, half-hidden; a cord is always shown with its free ends hanging (never an endless knot, never a three-looped knot).

*Rank and form:* council: A council of cord-mothers: the charge is a cord or a woman's tool, never a crown.

*Breakaway difference:* a border of char (dissent tincture char).

### Redbark Tribes (`redbark_tribes`)

*People:* men. *Family:* Orran men. *Language:* orran. *Faith:* old_knots. *Line:* nebuly. *Realms:* 1 (Bloody Forest).

*Palette:* redbark `#8a2f26` (C); deep bark `#3b2a1c` (C); antler bone `#d4b89a` (M); moss `#4f5a34` (C); ochre `#a8743a` (C).

*Divisions:* per_pale, plain, per_fess.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `stag_attires` | a stag's antlers (attires) | antler-craft and the forest hunt |
| `knot_tree` (restoration) | a tree hung with cords | the knot-trees of the Bloody Forest |
| `beaded_cord` | a beaded cord hanging | kinship by tongue with the Veiled |

*Ornament:* Red-dyed hide colours, antler and cord.

*Rank and form:* clan: Clans led by cord-mothers; a raid's war-chief is not shown.

*Breakaway difference:* a border of deep bark (dissent tincture deep bark).

### Winter-Crown Folk (`winter_crown`)

*People:* men. *Family:* Boreal men. *Language:* coldic. *Faith:* winter_hearth. *Line:* indented. *Realms:* 1 (Coldor).

*Palette:* frost white `#eef2f5` (M); ice blue `#9fc0d8` (M); winter blue `#3e5672` (C); slate grey `#8a8f96` (C); hearth red `#a8402f` (C); deep night `#1f2b3a` (C).

*Divisions:* per_fess, plain, chief.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `hearth_ring` (restoration) | a fire inside a ring of stones | the hearth-law: no feud may be carried past a shared fire |
| `winter_wolf` | a wolf standing | the long winter hunts |
| `winter_sheaf` | a sheaf of winter rye bound with a white cord | the crown granaries whose bread holds the clans through the long winters |
| `rye_bundle` | a bundle of rye-stalks bound with a white cord | the crown granaries whose bread holds the clans through the long winters |

*Ornament:* No snowflakes (a regional cliché); the hearth is the culture's honour charge.

*Rank and form:* high kingdom: The winter crown over the clan fire: the crown passes to the eldest child and the clans relight their fires from the crown's. *Crown:* the winter crown: a white circlet of short icicle points.

*Breakaway difference:* a border indented of deep night (dissent tincture deep night).

### Ice Clans (`ice_clans`)

*People:* men. *Family:* Boreal men. *Language:* coldic. *Faith:* winter_hearth. *Line:* indented. *Realms:* 10 (Horidor, Fearno, Austklev, Worlond, Holdon, Xison, Pertolor, Omar, Portogalor, Orewele).

*Palette:* snow `#f0f2f2` (M); ice `#bcc6cf` (M); hide brown `#6b5a48` (C); fjord blue `#3f5870` (C); bone `#ddd3bd` (M); berry red `#8e3a3a` (C); lichen green `#6b7a52` (C); soot `#2e2f33` (C); amber `#c89a3a` (M).

*Divisions:* plain, per_fess, per_pale, per_bend, per_bend_sinister, chief, base, per_chevron, pile_reversed.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `reindeer` | a reindeer | the herding clans |
| `elk` | an elk | the forest clans of the southern ice |
| `musk_ox` | a musk ox | the clan that stands in a ring against the storm |
| `white_bear` | a white bear | the coast ice and the seal hunt |
| `wolverine` | a wolverine | a small clan that yields to nobody |
| `arctic_fox` | an arctic fox | the trappers |
| `snow_hare` | a snow hare | the tundra clans |
| `ermine` | an ermine | the fur trade |
| `walrus` | a walrus | the ivory coast |
| `narwhal` | a narwhal | the far ice and its single-tusked whale |
| `orca` | an orca | the sea clans |
| `leaping_salmon` | a leaping salmon | the river clans |
| `ringed_seal` | a seal on an ice floe | the floe hunters |
| `snowy_owl` | a snowy owl | the winter moot's wisdom |
| `raven_north` | a raven | the clan that finds the herds |
| `ptarmigan` | a ptarmigan | the high tundra |
| `eider` | an eider duck | the down-gatherers of the skerries |
| `gyrfalcon` | a gyrfalcon perched | the falconers |
| `bone_arch` (restoration) | an arch of two whale ribs | the bone arches of the halls |
| `sledge` | a sledge | winter roads over the ice |
| `harpoon` | a harpoon | the whale hunt |
| `hide_boat` | a hide boat | the summer crossings |
| `snowshoe` | a snowshoe | the long walk of the winter moot |
| `antler_comb` | an antler comb | the bone-carvers |
| `twin_peak` | a mountain of two peaks | the clan of the mountains |
| `gap_cairn` | a cairn in a mountain gap | the cairns of the Neridor Gap road, where every western cart pays the cairn-due |
| `road_loaf` | a round loaf set on a stone | the loaf left each Long Dark at the start of the Silent Road |
| `waystation` | a turf waystation with a smoking roof | the forest stages of the Neck Road kept stocked with fodder and dry wood |
| `fair_pole` | a tall pole with a crossbar, hung with three pelts | the fair-pole of Fentene, which keeps the snowline fair |
| `vale_ewe` | a ewe standing | the one valley of the north where sheep do better than reindeer |
| `iron_bloom` | a bloom of raw iron set on a ring | the iron the Orewell lowland digs and sells by the cartload |
| `amber_drop` | a drop of amber | the amber traded on the high road |
| `gap_stones` | three stones piled one on another in a gap | the cairn of the Neridor Gap road |
| `harpoon_bundle` | three harpoons bound together with one cord | the steadings that refused both Fannarn and Coldor and keep their own moot |
| `turf_roof` | a turf roof with a smoke-hole in its crown | the turf waystation of the Neck Road, smoking on the ridge |
| `wool_skein` | a skein of pale wool wound on a bar | the wool-market valley of the north |
| `clenched_fist` | a clenched fist | the oath of the one clan that yields to nobody |
| `ice_axe` | an ice-axe upright | the sealers of the Frozen Sea and the last raider of their line |

*Ornament:* One clan beast or clan token, drawn heavy and dark against snow, or pale against hide; no snowflakes, no igloos.

*Rank and form:* clan: A chieftain chosen by the moot: the clan beast or token, no crown; council: A clan moot that elects for the realm: the token stands on a plain indented base; kingdom: The tine crown over the charge: a king of the clans, judged by his people; lordship: A lord of a valley, a coast or a forest: no crown; league: The road clans' charge tripled, two above one; confederation: The steadings' charge tripled, two above one; domain: An ordinary valley town: no crown, no mark. *Crown:* the tine crown: a circlet of short antler tines.

*Breakaway difference:* a border indented of soot (dissent tincture soot).

### Girdon Wardens (`girdon_wardens`)

*People:* men. *Family:* Boreal men. *Language:* gunwaithic. *Faith:* river_wardens. *Line:* indented. *Realms:* 2 (Girdon, Wennarith).

*Palette:* river green `#4a6b52` (C); mud brown `#7e6342` (C); ford stone `#d8d0b8` (M); water blue `#4e7c94` (C); reed gold `#b5a35a` (M); dark pool `#2c3f36` (C).

*Divisions:* per_fess, plain, chief, base.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `stone_bridge` | a stone bridge of three arches | the bridge-towns and their water-gates |
| `ford_stones` (restoration) | three stepping stones in a row across a ford | the stepping stones of the ford of Arligon |
| `river_eel` | an eel | the river's keeper spirit is fed at the flood |
| `warden_hat` | a wide-brimmed hat | the ford-wardens' wide hats |
| `ferry_raft` | a ferry raft on its rope | the ferry-wardens who keep every crossing of the peninsula's rivers |
| `ferry_ring` | a ring hung on a rope | the ferry-wardens' rope across the river |

*Ornament:* Bridges and fords drawn from the side, water below.

*Rank and form:* council: A Warden-Speaker chosen by the ford-wardens: no crown; a bridge or a ford.

*Breakaway difference:* a border indented of dark pool (dissent tincture dark pool).

### Western Guildmen (`western_guilds`)

*People:* men. *Family:* Boreal men. *Language:* gunwaithic. *Faith:* guild_hall. *Line:* indented. *Realms:* 3 (Saopon, Kradlon, Corogon).

*Palette:* guild wine `#7a3b4e` (C); guild gold `#c9a24a` (M); guild blue `#3f5f7a` (C); guild green `#3f6b4a` (C); vermilion `#b8432f` (C); ivory `#ece6d6` (M); ink black `#26242a` (C).

*Divisions:* quarterly, per_pale, per_fess, per_bend, chief, base, per_chevron, plain.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `weaver_shuttle` | a weaver's shuttle | the weavers' guild |
| `cloth_shears` | cloth shears | the clothiers |
| `cooper_barrel` | a barrel | the coopers |
| `chandler_candle` | a candle | the chandlers |
| `smith_bellows` | a pair of bellows | the smiths |
| `mortar_pestle` | a mortar and pestle | the apothecaries |
| `cordwain_boot` | a boot | the cordwainers |
| `wool_comb` | a wool comb | the wool-combers |
| `glove` | a glove | the glovers |
| `corded_bale_w` | a corded bale | the merchant-adventurers |
| `guild_book` (restoration) | a book bound with a cord | contracts are sworn on the guild book, not on a god |
| `paired_seals` | two wax seals hanging side by side from one cord | two consuls chosen each year by the great houses, who seal together |
| `league_rings` | two rings linked on one cord | the league the towns of the Kulolo swore on their guild book |
| `fuse_flame` | a flame at the end of a fuse-cord | the powder the workshops of Bolbin sell to any buyer |

*Ornament:* Bright guild colours; one craft tool, drawn like a guild sign; never square-and-compasses, cogwheels or crossed tools (real-world emblems).

*Rank and form:* city state: A guild city: quartered in two guild colours, the craft tool over all; council: A guild council: the craft tool on a divided field.

*Breakaway difference:* a border indented of ink black (dissent tincture ink black).

### Buldor Companies (`buldor_companies`)

*People:* men. *Family:* Boreal men. *Language:* gunwaithic. *Faith:* company_banner. *Line:* indented. *Realms:* 1 (Buldor).

*Palette:* company brown `#5a3f2f` (C); olive `#a8a36a` (M); steel blue `#2f3f5a` (C); livery red `#8e3b2e` (C); buff `#d8c9a2` (M).

*Divisions:* bordure, plain.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `halberd` | a halberd | the companies' weapon and the Banner-Oath sworn before it |
| `war_drum` (restoration) | a war drum | the Unfurling and the Last Muster |
| `sealed_contract` | a sealed roll | the contract-book |
| `company_banner` | a square company banner on a halberd shaft | the Banner-Oath: the banner is the company's soul, and a fallen banner ends a company |
| `seal_ring` | a signet ring set with a plain stone | the sealed contract-book of the companies |

*Ornament:* The bordure compony (a border of alternating livery blocks) is the companies' mark.

*Rank and form:* council: Company-lords elect a Captain-General: the bordure compony and a weapon of the line, no crown.

*Breakaway difference:* the bordure compony broken in chief (dissent tincture company brown).

### Chart-Islanders (`chart_islanders`)

*People:* men. *Family:* Boreal men. *Language:* tritonic. *Faith:* tide_charts. *Line:* indented. *Realms:* 7 (Adel, Raerby, Pollos, Fineger, Halenor, Seite Islands, The Lens).

*Palette:* chart teal `#2f6f78` (C); chart paper `#e0d8be` (M); reef coral `#a8513a` (C); ink `#23323a` (C); sand gold `#c9a85a` (M); shallows `#7fb0ac` (M).

*Divisions:* plain, per_fess, per_pale, per_bend, per_bend_sinister, chief, base, per_chevron, pile_reversed.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `chart_rose` (restoration) | a chart-rose of sixteen thin points | the charts the islands sell to Aenor |
| `sounding_lead` | a sounding lead on its line | the soundings of every reef |
| `coral_reef` | a branching coral | the reef-spirits that spared the first pilot |
| `pilot_lantern` | a pilot's lantern | the harbour pilots |
| `rolled_chart` | a chart rolled and tied with a cord | the chart-houses that copy every chart in one house at Sanderz |
| `astrolabe_ring` | a ring with a sighting rule across it | star-sighting |
| `sand_glass` | a sand-glass | the watch kept at sea |
| `reef_buoy` | a ringed float on a pole | the buoy that marks the banks the broker-captains of Ese mediate |
| `rope_coil` | a coil of rope | the rope-walks |
| `seahorse` | a seahorse | the sheltered lagoons |
| `green_turtle` | a turtle | the turtle beaches |
| `flying_fish_t` | a flying fish | the open-water crossings |
| `reading_lens` | a great round lens with rays | the great lens of the Lamp-House, which keeps the northern passages lit |
| `chart_house` | a chart-house on stilts | the stilt harbours |
| `tern` | a tern | the outer islets |
| `sperm_whale` | a whale | the whale grounds |
| `strongroom_key` | a great ring with a single bit | the key of the strong-room where the chart-houses keep their treasury |
| `shore_fire` | a fire on a shore rock | the shore-fires the wreck-lord may light or leave dark |

*Ornament:* Navigation and reef charges drawn like chart vignettes; the chart-rose has sixteen thin points and never four (another military emblem).

*Rank and form:* council: Speakers elected from the chart-houses: no crown; league: The chart-houses' charge tripled, two above one; city state: A free isle: no crown; lordship: A wreck-lord: no crown; moot: An isle moot: no crown; order: A sworn order: no crown and no label.

*Breakaway difference:* a border indented of ink (dissent tincture ink).

### Corsair Lords (`corsair_lords`)

*People:* men. *Family:* Boreal men. *Language:* tritonic. *Faith:* ransom_tide. *Line:* indented. *Realms:* 4 (Nondondor, Windy Lands, Santon, Benan).

*Palette:* corsair black `#2a2a2e` (C); blood red `#a83a2a` (C); ransom gold `#c8a85a` (M); sea ink `#24343e` (C); bone `#e2d6bc` (M); rust `#7e4a2c` (C).

*Divisions:* plain, per_fess, per_pale, per_bend, per_bend_sinister, chief, base, per_chevron, pile.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `hanger_sword` | a short straight hanger sword | an isle held by the sword |
| `ransom_ring` (restoration) | a heavy gold ring | the Ransoming: a captive ransomed is under the harbour's god |
| `grapnel` | a grapnel | boarding |
| `cut_rope` | a rope cut through | the hostage set free on payment |
| `ransom_chest` | a banded chest | the ransom-chest of the tide-courts |
| `moray` | a moray eel | the hidden coves |
| `cormorant` | a cormorant with wings spread to dry | the diver that takes and returns |
| `shark_tooth` | a shark's tooth | a raider's trophy |
| `tide_bell_c` | a bell hung from a post in the surf | the tide-courts' bell |
| `black_sail` | a black sail hung from a bar | the captain who took the strait-place harbour of Straton |
| `boarding_pike` | a boarding pike | the boarding parties |
| `open_shackle` | an open shackle | a captive released on ransom |
| `masthead_lantern` | a masthead lantern | the night raids |
| `barracuda` | a barracuda | the fast raiders |
| `serpent_coil` | the coil of a sea-serpent rising from a wave | the sea-serpent waters the corsairs claim |
| `boarding_axe` | a boarding axe | the cliff harbours' crews |
| `harbour_chain` | a chain across a harbour mouth | the toll at the harbour mouth |
| `coin_purse` | a purse spilling coins | tribute from the chart-islands |
| `storm_sail_c` | a torn square sail blown out by the wind | the stormiest isles (canting on the Windy Lands) |
| `fishing_kite` | a fishing kite on its line | the kite-fishers of the windward capes |
| `mountain_cove` | a cove-arch under a peak | the cove under the mountain that no fleet can find without a Benan pilot |

*Ornament:* Black and red with ransom gold; no skull, no crossed bones, no cutlass or curved sabre (real pirate and regional clichés).

*Rank and form:* kingdom: A king or captain-lord who holds an isle by the sword: the charge within the captain's ring; captaincy: A captain's haven: no crown; league: The cape-lords' charge tripled, two above one. *Crown:* the captain's ring: the isle-lord's charge is set within a plain gold ring.

*Breakaway difference:* a border indented of rust (dissent tincture rust).

### Noris Camel Warriors (`noris_riders`)

*People:* men. *Family:* Eastern men. *Language:* noric. *Faith:* well_oath. *Line:* stepped. *Realms:* 1 (Noris).

*Palette:* indigo `#2b3f7a` (C); well ochre `#c9964a` (M); robe white `#efe3c4` (M); deep indigo `#1a2650` (C); silver `#c0c4c8` (M); desert rose `#b0624a` (C).

*Divisions:* plain, per_fess, per_pale, per_bend, chief, base, per_chevron.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `well_head` (restoration) | a plain disc with seven rays fanning from its lower edge | the Seven Wells of Furvior |
| `shared_bowl` | a bowl brimming with water | sharing water makes kin |
| `sandgrouse` | a sandgrouse | the bird that carries water to its young |
| `water_skin` | a water-skin | the Salt Road crossings |
| `wind_catcher` | a wind-catcher tower | the oasis cities' wind-towers |
| `oryx` | an oryx | the open desert |
| `jerboa` | a jerboa | the sand and the night |
| `silver_anklet` | a silver anklet | the silver of the indigo-robed riders |
| `road_cairn` | a road cairn | the Salt Road markers |
| `kneeling_camel` | a camel kneeling | the guest's camel kneels at the well |

*Ornament:* Water is the honour: wells, bowls and the birds that carry water; no palm tree, no crescent, no stars, no curved sword; the camel at most once in the whole East.

*Rank and form:* kingdom: The well-crown; the king is chosen by the well-lords from one line; clan: A tribe of the well-oath: no crown, a water charge. *Crown:* the well-crown: a silver circlet set with small cups.

*Breakaway difference:* a border stepped of deep indigo (dissent tincture deep indigo).

### Caravan Princes (`caravan_princes`)

*People:* men. *Family:* Eastern men. *Language:* stabilic. *Faith:* scale_creed. *Line:* stepped. *Realms:* 6 (Stabilo, Drak, Mostok, Azano, Obmi, Pornivior).

*Palette:* bronze `#a8742a` (C); caravan red `#8a2f2a` (C); market green `#3f6b4a` (C); seal wax `#5e1c20` (C); linen `#e6dcc4` (M); colonnade stone `#c9b48a` (M); ink `#2a2622` (C).

*Divisions:* plain, per_fess, per_pale, per_bend, chief, base, per_chevron, quarterly.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `honest_scale` (restoration) | a balance | an honest weight pleases the New Gods; a false weight is the worst crime |
| `struck_coin` | a bronze disc with a plain rim | the bronze of the caravan cities |
| `milestone` | a milestone | the caravan roads |
| `wax_seal` | a hanging wax seal | contract law with written seals |
| `nested_weights` | three rings nested one within another | the weights of the market of Mostok |
| `measuring_rod` | a measuring rod | the ell of the cloth markets |
| `corded_bale` | a corded bale | the caravans' loads |
| `counting_frame` | a counting frame | the Treasurer's purse |
| `toll_bar` | a toll bar across a road | the road tolls |
| `colonnade` | a colonnade of three columns | the colonnaded market streets |
| `furnace_cone` | a cone-shaped furnace with a flame at its mouth | the smoking mountain cone of Drak |
| `powder_cask` | a spark in a ring of powder | the powder cask of Drak |
| `tapped_trunk` | a drop of resin on a bar | the tapping of the hardwood trunks of Obmi |
| `tithe_bowl` | a heaped ring of grain-ears | the tithe of the caravan princes |
| `bench_seal` | a banker's seal hung on a cord | the sealed bond of the bench of houses that built the Gold Road from the bronze mines to the sea |

*Ornament:* Bronze charges drawn like market weights and seals; no coins with square holes, no images on coins.

*Rank and form:* council: A Prince chosen by the bench of merchant houses: no crown; the seal or the scale.

*Breakaway difference:* a border stepped of seal wax (dissent tincture seal wax).

### River-Kings of the East (`river_kings`)

*People:* men. *Family:* Eastern men. *Language:* alerhic. *Faith:* flood_stair. *Line:* stepped. *Realms:* 4 (Alerhia, Erco, Plutondo, Delbiz).

*Palette:* river gold `#c9a24a` (M); river blue `#2f5f8a` (C); reed green `#4a7a4a` (C); flood silt `#8a6a3a` (C); linen white `#ece4cc` (M); lapis `#24406a` (C).

*Divisions:* plain, per_fess, per_bend, chief, base, per_chevron.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `temple_stair` | a temple stair of seven steps | the tall temples above the flood-line |
| `flood_gauge` (restoration) | a stair-gauge standing in water | the flood measured by the temple scribes |
| `river_boat` | a river boat with a high stern | the river trade |
| `gold_collar` | a broad gold collar | the court's gold collars |
| `water_jar_r` | a tall water jar | the water-courts below the temples |
| `kingfisher` | a kingfisher | the river's bird |
| `reed_bundle` | a bound bundle of reeds | the reed boats and mats |
| `canal_sluice` | a canal sluice | the canal quays |
| `shut_pass` | two mountains with a bar across the pass between them | the pass of Erco that the river kings shut |
| `ash_sheaf` | a sprout of grain rising from ash | the grain grown from black ash in the flood silt |
| `fair_horse` | a horsehair pennant on a pole | the fair of Delbiz |

*Ornament:* Every river-king's arms carry the king's river as a narrow wavy bendlet; no eyes, no lotus, no winged sun disc, no papyrus (real-world Egyptian marks).

*Rank and form:* kingdom: The river-diadem and the river bendlet: the king takes the name of his river; theocracy: The oldest river kingdom: a priest-king; the temple stair under the diadem; principality: A river princedom: no crown; the river's band. *Crown:* the river-diadem: a gold collar-crown worn low.

*Breakaway difference:* a border stepped of flood silt (dissent tincture flood silt).

### Lake Road Cities (`lake_road_cities`)

*People:* men. *Family:* Eastern men. *Language:* alerhic. *Faith:* lake_litany. *Line:* stepped. *Realms:* 3 (Ostoroth, Mora, Kersian).

*Palette:* lake silver-blue `#5a8aa8` (C); quay white `#d8d4c4` (M); rush green `#3f5f4a` (C); lantern amber `#d0963a` (M); fish grey `#7a7a6e` (C); deep water `#2a4256` (C).

*Divisions:* plain, per_fess, per_pale, per_bend, chief, base, per_chevron.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `quay_lantern` (restoration) | a flame on a pole | the lantern of the lake quays |
| `barbel` | a barbel | the lake fish |
| `stilt_house_l` | a house on stilts | the stilt towns |
| `fish_net_l` | a net | fishers and merchants pray together at the water |
| `eel_trap` | an eel trap | the lake shallows |
| `lantern_float` | a floating lantern | the Lantern Float of Longnight |
| `perch` | a perch | the lake's common fish |
| `lake_skiff` | a skiff | the lake ferries |
| `cattail` | a cattail | the reed shores |
| `harvest_basket` | a heap of grain in a ring | the harvests the fishers and farmers of Gonnois bought their rights with |
| `market_gate` | a market gate | the walled market where the Lake Road crosses the Gold Road |

*Ornament:* Silver and lantern amber; fish drawn by kind, never generic.

*Rank and form:* kingdom: The lantern-crown; council: A Speaker of the council: no crown; city state: A free city: no crown. *Crown:* the lantern-crown: a silver circlet of small lantern points.

*Breakaway difference:* a border stepped of fish grey (dissent tincture fish grey).

### Red Lands Tribunes (`red_lands_tribunes`)

*People:* men. *Family:* Eastern men. *Language:* alerhic. *Faith:* red_hearth. *Line:* stepped. *Realms:* 1 (Rhachia).

*Palette:* red clay `#a8452f` (C); kiln ochre `#d4a46a` (M); umber `#5e3f30` (C); slip white `#e8dcc8` (M); ash grey `#8a8178` (C).

*Divisions:* per_chevron, plain.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `kiln` (restoration) | a domed kiln with fire at its mouth | the kiln-shrines and the Refiring each spring |
| `clay_jar` | a clay jar | the pots and grain the neighbours borrow |

*Ornament:* Clay shapes, thick and rounded.

*Rank and form:* council: A Tribune chosen each year: no crown; the kiln that is refired every spring.

*Breakaway difference:* a border stepped of umber (dissent tincture umber).

### Southern Islanders (`southern_islanders`)

*People:* men. *Family:* Southern islanders. *Language:* yonic. *Faith:* wave_tally. *Line:* wavy. *Realms:* 8 (Enhis Is Rond, Howan, Verde, Nara, Yongyong, Kamu Lamo, Kea, Sidea).

*Palette:* lagoon turquoise `#3f9aa8` (C); coral sand `#efe6c8` (M); coral red `#c9644a` (C); deep reef `#1f5a6a` (C); frond green `#4f8a4a` (C); lava black `#2a2a28` (C).

*Divisions:* plain, per_fess, per_pale, per_bend, per_bend_sinister, chief, base, per_chevron, pile_reversed.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `wave_tally` (restoration) | a spiral conch shell | the tally the caves of the south keep for the dead |
| `stilt_house_s` | a thatched house on stilts | the stilt houses on the reef |
| `fish_trap` | a weir of three stakes in a curve | the fish trap the villages lift only by day |
| `shell_necklace` | a ring of carved shells | the shell the villages carve for the ring-council of the Yong lagoon |
| `feast_bowl` | a carved feast bowl | land shared at feasts |
| `net_float` | a net float | the lagoon nets |
| `paddle` | a carved paddle | the island crossings |
| `reef_shrine` | a stone cairn on a reef | the reef-shrines |
| `woven_sail` | a woven sail | the woven sails of the island boats |
| `coral_branch` | a branch of coral | the reef |
| `cowrie` | a cowrie shell | the shell-money of the feasts |
| `conch` | a conch | the call to the Reef-Opening |
| `nautilus` | a nautilus | the deep water beyond the reef |
| `sea_turtle` | a sea turtle | the turtle beaches |
| `flying_fish_s` | a flying fish | the open crossings |
| `manta` | a manta ray | the reef channels |
| `parrotfish` | a parrotfish | the reef that makes the sand |
| `dolphin_s` | a dolphin | the companions of the boats |
| `hermit_crab` | a hermit crab | a small island in a borrowed shell |
| `wreck_house` | a long house on stilts with its door open | the house kept for the shipwrecked |
| `rice_terrace` | three stepped terraces on a rising slope | the terrace council of Kea, Agla and the Rice Islands |
| `storm_drum` | three strokes of a slit drum, one above another | the drum that carries the first warning of every storm to the Great Isle |

*Ornament:* No palm trees, no canoe over a rising sun over waves, no frigate bird over a sun, no stars (all real-world island flags); shell and reef work instead.

*Rank and form:* council: An elder or speaker for each harbour: no crown; the feast bowl or the tally; theocracy: Priest-Elders: a metal field and the shrine alone; moot: A moot of heads or elders: no crown; clan: A clan hall: no crown.

*Breakaway difference:* a border wavy of lava black (dissent tincture lava black).

### Goodin Sunfolk (`goodin_sunfolk`)

*People:* men. *Family:* Men under Sunhot patronage. *Language:* sunhot. *Faith:* noon_pilgrimage. *Line:* straight. *Realms:* 1 (Goodin); second culture of 1.

*Palette:* sun yellow `#e0b23a` (M); shade green `#4f7f42` (C); linen `#f2e6b8` (M); brick `#a8643a` (C); fig purple `#5e3452` (C).

*Divisions:* plain, per_fess, per_pale.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `shade_tree` (restoration) | a broad-crowned shade tree | guest-towns under shade trees |
| `ripe_fig` | a ripe fig | the orchards that feed the sanctuaries |
| `cool_jar` | a sweating water jar | the guest's cool water |

*Ornament:* Under the patrons' rayonny chief, homely guest-town charges.

*Rank and form:* council: Elders of the guest-towns: no crown; the patron chief of sun yellow.

*Breakaway difference:* the patron chief removed (dissent tincture brick).

### Council Elves of the Magical Forest (`forest_council_elves`)

*People:* elves. *Family:* Sylvan elves. *Language:* sylvan. *Faith:* kindred_song. *Line:* engrailed. *Realms:* 1 (Magical Forest).

*Palette:* leaf green `#4f9a5a` (C); deep wood `#2c5a3a` (C); elven silver `#d8e0d2` (M); moon white `#f4f6f0` (M); mist grey `#8a96a0` (C); amber sap `#c9a24a` (M).

*Divisions:* plain, per_fess, per_bend, flaunches, chief.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `song_bow` | a song-bow: a lyre of two curved horns with three strings | the Kindred Song: the world was sung and to listen well is a duty |
| `living_tree` | a flat heraldic tree of seven leaves in a fan on one straight trunk | the tree of the Singing Grove |
| `willow_leaf` | a long willow-shaped leaf | the leaf of the Magical Forest |
| `silver_bridge` | a filigree bridge | the silver bridges between the tree-cities |
| `precedent_book` | a ring of seven small rings | the elected council of the Magical Forest and its precedents |
| `seedling` (restoration) | a seedling with two leaves | a house, not a person, inherits |
| `forest_heron` | a heron | the heron of the forest pools (canting on Heron) |

*Ornament:* Long, drawn-out charges; silver always present; no white tree on black (another fiction), no maple leaf, no harp of the real-world Irish kind (the elven song-bow is a curved horn lyre).

*Rank and form:* council: An elected First Speaker: a border engrailed of elven silver, no crown; forest domain: An elected council of houses over a forest domain: the tree with its roots and the engrailed silver border of elected speakers.

*Breakaway difference:* a border engrailed of mist grey (dissent tincture mist grey).

### Hill-Kingdom Elves (`hill_kingdom_elves`)

*People:* elves. *Family:* Sylvan elves. *Language:* sylvan. *Faith:* kindred_song. *Line:* engrailed. *Realms:* 1 (Herrodon).

*Palette:* hill green `#3f6f4a` (C); elven silver `#c9c9d2` (M); dragon red `#a8402f` (C); night slate `#2f3640` (C); gorge grey `#7a7f86` (C); scale gold `#c4a04a` (M).

*Divisions:* per_bend, plain, per_fess, chief, per_chevron.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `dragon_roost` | an open-topped roost tower | the dragon roosts the elves command |
| `dragon_scale` | a single dragon scale | dragon-scale traded for iron at the gate |
| `dragon_wing` | a single dragon wing | the dragons that guard the halls |
| `dragon_egg` | a dragon egg | the brood of the roosts |
| `hall_stair` (restoration) | a long stair cut into a hillside | halls cut into hillsides |
| `hill_road` | a silver bar across the field | the road west to the lost kin, which the hill queens still remember |

*Ornament:* Dragon parts (scale, wing, egg, roost), never a whole dragon passant (real-world Welsh and Bhutanese flags).

*Rank and form:* kingdom: A hall-acclaimed queen or king: the leaf circlet; council: A hall without a crown: the silver engrailed border; protector: Herrodon's ward: a realm under its protection carries a narrow border engrailed of night slate. *Crown:* the leaf circlet: a silver circlet of upright leaves.

*Breakaway difference:* a border engrailed of night slate (dissent tincture night slate).

### Lake Elves (`lake_elves`)

*People:* elves. *Family:* Sylvan elves. *Language:* sylvan. *Faith:* kindred_song. *Line:* engrailed. *Realms:* 1 (Andos Enda).

*Palette:* lake teal `#4a8a8a` (C); water silver `#d8e0e0` (M); willow green `#5f845a` (C); deep blue `#2f4f6a` (C); pearl white `#f2f4f2` (M).

*Divisions:* per_fess, plain, base.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `glass_boat` | a boat with a glass canopy | the boat-houses with glass roofs |
| `shell_clasp` | a pearl shell clasp | the shell clasp of their dress (canting on Perloia) |
| `lake_crane` | a crane | the water-courts that judge weirs |
| `willow_bridge` (restoration) | a bridge of braided willow | the braided bridges |

*Ornament:* Water charges; no water-lily (too close to a real-world religious flower).

*Rank and form:* council: A Speaker of the water-houses: the silver engrailed border; confederation: The lake groves' charge tripled, two above one.

*Breakaway difference:* a border engrailed of deep blue (dissent tincture deep blue).

### Pass-Warden Elves (`pass_wardens`)

*People:* elves. *Family:* Sylvan elves. *Language:* sylvan. *Faith:* kindred_song. *Line:* engrailed. *Realms:* 1 (Nolorim).

*Palette:* pass grey-green `#5f7a6a` (C); snow white `#eceeea` (M); granite `#565b64` (C); pine `#34503f` (C); dawn silver `#c9ceca` (M).

*Divisions:* per_chevron, plain.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `mountain_pass` (restoration) | a pass between two snow-capped points | the Nolorim East Pass kept by the pass-wardens |
| `pass_token` | a carved pass-token on a cord | the token every courier shows at the gate |
| `warden_bow` | a long bow | the wardens' bows |

*Ornament:* Peaks drawn as the range, never as masonry.

*Rank and form:* council: A Pass-Warden elected until a vigil is broken: the silver engrailed border.

*Breakaway difference:* a border engrailed of granite (dissent tincture granite).

### Rift-Coast Elves (`rift_coast_elves`)

*People:* elves. *Family:* Sylvan elves. *Language:* sylvan. *Faith:* kindred_song. *Line:* engrailed. *Realms:* 2 (Lccimio, Eldafaen); second culture of 1.

*Palette:* rift teal `#3f8a8a` (C); quay silver `#d6dce0` (M); sea glass `#8ac0b8` (M); night sea `#23404a` (C); lantern gold `#d6b25a` (M).

*Divisions:* plain, per_fess, per_bend, base, chief, flaunches.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `lantern_tower` | a slender shore tower with a lantern roof | the house-towers of the shore |
| `rift_lantern` (restoration) | a lantern | the lantern clasp of the coast |
| `long_pier` | a long pier running out to sea | the coast held against the sea |
| `glass_float` | a glass float in a net | the glassmakers of the quays |
| `gannet` | a gannet diving | the sea fishing |
| `rift_wave` | a breaking wave | the rift sea |
| `archive_scroll` | a rolled scroll tied with a silver cord | the Archive: the names, letters and songs of the elves who died in the Alliance's wars |
| `silver_circlet` | a silver circlet of five points | the Archive of the loremasters, which keeps the names and songs of the elves who died in the Alliance's wars |

*Ornament:* Shore towers with lantern roofs; a league of house-towers triples its charge.

*Rank and form:* council: A Warden elected by the houses of the coast: the silver engrailed border; confederation: A league of house-towers under one Warden-Speaker: the charge tripled.

*Breakaway difference:* a border engrailed of night sea (dissent tincture night sea).

### Gala Elves (`gala_court`)

*People:* elves. *Family:* Gala elves. *Language:* galic. *Faith:* rain_mirror. *Line:* invected. *Realms:* 1 (Gala).

*Palette:* court white `#f2eedc` (M); Gala gold `#d6b04e` (M); rain blue `#8aa8c9` (M); deep harbour `#2f4a6a` (C); keeper grey `#8a8a84` (C).

*Divisions:* plain, per_fess, chief, base.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `mirror_spring` (restoration) | a round pool rimmed in gold, with rain falling into it | the Mirror of First Rain: the past and the possible glimpsed, and never trusted plainly |
| `kings_ship` | a tall ship with white sails | the King's Ships in the harbour |
| `court_fountain` | a fountain | the open courts and fountains |

*Ornament:* No sun charge (kinship with the Sunhot is open), no rayonny line; rain and mirrored water instead.

*Rank and form:* kingdom: A king who reigns as long as he wills: the endless circlet. *Crown:* the endless circlet: a plain gold circlet with no points.

*Breakaway difference:* a border invected of keeper grey (dissent tincture keeper grey).

### Sunhot Elves of the Light (`sunhot_light`)

*People:* sun elves. *Family:* Sunhot elves. *Language:* sunhot. *Faith:* noon_pilgrimage. *Line:* rayonny. *Realms:* 1 (The Lands of Light).

*Palette:* noon gold `#e0a02a` (M); sanctuary white `#f2e6c4` (M); flame orange `#b04a2a` (C); god-sea blue `#2f5f8a` (C); sky `#9ac0d8` (M).

*Divisions:* per_fess, plain.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `noon_door` (restoration) | a tall arched doorway with a sun disc resting in its arch | the sanctuary threshold where the light of the Sea of Gods is received |

*Ornament:* The noon-door is theirs alone; no rising sun with rays to the edges, no sun with a face, no red disc on white.

*Rank and form:* sanctuary: A Radiant Speaker chosen by the sanctuaries: never a crown, never called a king.

*Breakaway difference:* a border rayonny of flame orange (dissent tincture flame orange).

### Western Sanctuary Sunhot (`sunhot_western`)

*People:* sun elves. *Family:* Sunhot elves. *Language:* sunhot. *Faith:* noon_pilgrimage. *Line:* rayonny. *Realms:* 4 (Elvana, Igara, Yeni Alang, Tor Luni).

*Palette:* sanctuary gold `#d89a2a` (M); sanctuary white `#f2e6c4` (M); flame orange `#a8452a` (C); ochre stone `#c9a46a` (M); shade blue `#3e6a86` (C); deep red `#6e2a22` (C); olive `#6b7a42` (C).

*Divisions:* per_fess, per_pale, per_bend, per_bend_sinister, chief, base, per_chevron, pile_reversed, bordure, plain.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `threshold_door` (restoration) | a door with a sword laid on the ground before it | no weapon passes the sanctuary door |
| `double_door` | a tall double door, open | sanctuaries open to every visitor |
| `keeper_hat` | a tall keeper's hat | the tall hats of the Keepers |
| `flame_lamp` | a flame-lamp on a stand | the flame-lamps of the stair-streets |
| `brazier` | a brazier | the noon fire |
| `stair_street` | a stair-street climbing between houses | the stair-streets |
| `sun_court` | a square court with a disc set in its pavement | the sun courts where visitors rest |
| `sundial` | a sundial | the hour of noon |
| `noon_bell` | a bell | the noon bell of the sanctuary |
| `pilgrim_road` | a road winding up to a door | the roads kept open for pilgrims |
| `rest_basin` | a stone basin of water | rest for the visitor |
| `shade_canopy` | a striped shade canopy | shade for the guest |
| `sun_lizard` | a basking lizard | the noon heat |
| `hoopoe` | a hoopoe | the sanctuary gardens |
| `swallow` | a swallow | the pilgrims who return each year |
| `gazelle` | a gazelle | the open hills |
| `honey_bee` | a bee | the sanctuary hives |
| `almond_blossom` | an almond branch in blossom | the first spring of the sanctuary year |
| `saffron_crocus` | a crocus | the saffron fields |
| `cypress` | a cypress | the tall sanctuary trees |
| `sanctuary_book` | an open sanctuary book | the sanctuary book that is the law |
| `pilgrim_staff_s` | a tall pilgrim's staff | the pilgrims' road |
| `noon_flame` | a single tall flame | the flame that names the realm (canting on Flame) |
| `sleeping_hound` | a hound asleep | rest and dreams for the visitor (canting on Dreamland) |
| `spindle_skein` | a skein of thread wound on a ring | the weavers of the cape sanctuary of Elvana |
| `shallows_crane` | a crane wading | the shrine of the shallows on Sun Lake and its cranes |
| `seen_wings` | a pair of wings seen from below | the wings seen over the terraces on a still day, kept in the Roll of Wings |
| `uncut_stones` | three standing stones of uneven height | the standing stones older than any Sunhot record, kept uncut among the quarries |
| `shallows_reeds` | three reeds bound at the head | the shrine of the shallows on Sun Lake |

*Ornament:* Tall, narrow charges; sanctuary things and the birds, beasts and plants of the sanctuary gardens; at most one sun disc in the culture; no weapons.

*Rank and form:* sanctuary: A Speaker chosen by its sanctuary: no crown; sanctuary white in the field.

*Breakaway difference:* a border rayonny of deep red (dissent tincture deep red).

### Isle Sunhot (`sunhot_isles`)

*People:* sun elves. *Family:* Sunhot elves. *Language:* sunhot. *Faith:* noon_pilgrimage. *Line:* rayonny. *Realms:* 2 (Ihuy, Soyano).

*Palette:* isle teal `#2f8a8a` (C); isle gold `#dcae3a` (M); terrace white `#f0e8cc` (M); deep lagoon `#1d4f5a` (C); coral rose `#c47a5a` (C).

*Divisions:* per_fess, per_pale, per_bend, per_bend_sinister, chief, base, per_chevron, pile_reversed, plain.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `chain_of_isles` (restoration) | a garland of linked rings | the Council of the Chain |
| `sea_terrace` | a terrace stair rising from the water | the shore terraces |
| `sea_door` | an arched door standing in the shallows | a sanctuary open to the sea |
| `tide_court_bell` | a bronze bell on a frame | the tide-court |
| `shore_colonnade` | a colonnade facing the sea | colonnades facing the sea |
| `silk_sail` | a silk sail | the silk trade |
| `cuttlefish` | a cuttlefish | the lagoon |
| `eagle_ray` | a spotted ray | the channels between the isles |
| `sea_lily` | a sea-lily on its stalk | the reef gardens |
| `terrace_lamp` | a terrace lamp | the lamps of the sea terraces |
| `egret` | an egret | the shallows |
| `abalone` | an abalone shell | the shell-divers |
| `jellyfish` | a jellyfish | the warm currents |
| `reed_pipes` | a set of reed pipes | the sanctuary music |
| `pearl_comb` | a comb set with pearls | the pearl trade |
| `silk_kite` | a silk kite | the festival kites |
| `lagoon_skiff` | a lagoon skiff | the ferries between the isles |
| `smoking_isle` | a plume of smoke rising from one cone | Hol, whose Great Volcano threw ash over every island at once |
| `white_ship` | a tall white ship | the white ships of the south and the hulls of Gala's court |

*Ornament:* Sanctuaries on shore terraces; no sun over waves (a real island flag), no dragon of the eastern kind.

*Rank and form:* sanctuary: A Speaker from each isle at the Council of the Chain: no crown.

*Breakaway difference:* a border rayonny of deep lagoon (dissent tincture deep lagoon).

### Volcano Clans (`volcano_clans`)

*People:* orcs. *Family:* Orcs and ogres. *Language:* orcish. *Faith:* skull_fire. *Line:* raguly. *Realms:* 2 (Goldoroth, Dark Gate).

*Palette:* ash black `#2a2a2e` (C); lava red `#a83a26` (C); ash grey `#7a7a74` (C); ember orange `#d2662a` (C); obsidian `#161618` (C); sulphur `#c9b04a` (M); bone `#d8ccb0` (M).

*Divisions:* plain, per_fess, per_bend, per_chevron, pile_reversed, chief.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `fire_mountain` | a fire-mountain with a plume of flame | the Fire-Mountain above Cocanoor, whose nature the orcs do not speak of |
| `undying_fire` (restoration) | a fire in a stone bowl | the clan fire that never goes out |
| `skull_cairn` | a skull on a cairn of stones | the cairn of skulls where the clan honours its dead |
| `challenge_ring` | a ring of upright stakes | the ring where a Warking is broken by a stronger challenger |
| `war_horn_o` | a curved war-horn | the muster of the clans |
| `cleft_ridge` | a black ridge split by a narrow gap | the dark gate in the ridge (canting on Dark Gate) |
| `cleft_gate` | a gate split down its middle by a narrow gap | the only pass from the Goldoroth arm to the south, which the gate-hold tolls |

*Ornament:* Black, red and ash; one skull at most in all the Dark Lands; no eye, no burning eye.

*Rank and form:* kingdom: A Warking acclaimed by the chiefs and broken in the ring: the tusk crown; clan: A clan chief: no crown; overlord: The Iron Yoke: a tributary hold carries a narrow border raguly of ash grey; hold: A gate-hold: no crown. *Crown:* the tusk crown: a circlet of upturned tusks.

*Breakaway difference:* a border raguly of ash grey (dissent tincture ash grey).

### Iron Clans (`iron_clans`)

*People:* orcs. *Family:* Orcs and ogres. *Language:* orcish. *Faith:* skull_fire. *Line:* raguly. *Realms:* 6 (Bordon, Dreson, Dulundur, The Darks, Skragdurg, Britadon).

*Palette:* iron `#5a5a60` (C); rust `#8a4a2a` (C); steel `#b0b0a8` (M); coal `#26262a` (C); forge orange `#c8642a` (C); slag green `#5a6a4a` (C).

*Divisions:* plain, per_fess, per_pale, per_bend, chief, base, per_chevron, pile_reversed.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `anvil` (restoration) | an anvil | the forge in every gate |
| `forge_tongs` | forge tongs holding a glowing bar | iron worked for Dondor and for sale |
| `ingot_stack` | a stack of ingots | iron prices set at the Free Moot |
| `forge_hammer` | a war-hammer head upright, without its haft | the iron hills that Bredesk of the Brakgul made one hold |
| `crucible` | a crucible pouring | the smelters |
| `ore_pick` | an ore pick | the iron hills |
| `iron_chain` | an iron chain | tolls and captives |
| `moot_ring` | a ring of iron set with nine studs | the Free Moot of the holds |
| `toll_gate_bar` | a toll bar | the iron road tolls |
| `fen_reeds` | a bundle of fen reeds | the reed-council of the fens |
| `four_fires` | four flames rising from one hearth | the Four Fires lit in one hall at Lesderle |
| `charcoal_clamp` | a smoking charcoal clamp | the charcoal of the Fonoor Forest |
| `reed_knot` | three upright strokes bound together at the head | the reeds of the fens, where the reed-council lives on eels and peat |
| `smoulder` | a low smouldering fire | the charcoal clamps of the Fonoor Forest |
| `reed_crown` | a low crown of three pointed reeds | the reeds of the fens, where the reed-council lives on eels and peat |

*Ornament:* Single smithing tools; no hammer crossed with any blade or sickle, no cogwheel.

*Rank and form:* clan: A hold-chief who keeps the iron and the ring until challenged: no crown; council: The Free Moot of the holds: the moot ring.

*Breakaway difference:* a border raguly of rust (dissent tincture rust).

### Wild Holds (`wild_holds`)

*People:* orcs. *Family:* Orcs and ogres. *Language:* orcish. *Faith:* hold_luck. *Line:* raguly. *Realms:* 2 (Dun, Wild Lands).

*Palette:* hide brown `#6a5a40` (C); peat `#3a3a30` (C); lucky ochre `#a8a070` (M); bone `#d4c8a8` (M); moss `#5a6a3a` (C).

*Divisions:* plain, per_fess, base.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `bone_charm` | a bone charm on a cord | the luck of the hold |
| `holed_stone` (restoration) | a holed stone | the lucky stones of each hold |
| `casting_bones` | three casting bones on a cord | the bones that decide whose winter it is on the moor |
| `swing_gate` | a gate hung to swing both ways | the toll-king who swings to whichever neighbour pays best |

*Ornament:* Charms and luck, never priests' signs.

*Rank and form:* clan: A hold-chief by strength: no crown, no council; kingdom: The toll-king's crown over the charge; wild land: No council and no crown: whoever stays through a winter holds the land. *Crown:* the toll-king's crown: a circlet hung with small bone charms.

*Breakaway difference:* a border raguly of peat (dissent tincture peat).

### Sea Orcs (`sea_orcs`)

*People:* orcs. *Family:* Orcs and ogres. *Language:* orcish. *Faith:* tide_skull. *Line:* raguly. *Realms:* 1 (Belonton).

*Palette:* salt teal `#3a5a62` (C); drift grey `#8a8a82` (C); salt white `#e0dccf` (M); tar `#2a2c2e` (C); kelp `#4a5a3a` (C).

*Divisions:* per_fess, plain, chief.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `skerry_cairn` | a cairn on a skerry | the skerry-cairns of the Salt Tithe |
| `sea_gull_o` | a gull | the gull kingdom (canting) |
| `salt_cone` (restoration) | a cone of salt | the tithe of salt paid to the sea |

*Ornament:* Sea and salt; no skull (the Dark Lands' one skull is Gord's).

*Rank and form:* clan: A Sea-Chief by voyages won: no crown; council: A council of captains: the charge on a plain field.

*Breakaway difference:* a border raguly of tar (dissent tincture tar).

### Goblin Warrens (`goblin_warrens`)

*People:* goblins. *Family:* Goblins. *Language:* goblin. *Faith:* warren_luck. *Line:* potenty. *Realms:* 1 (Burnikit); second culture of 1.

*Palette:* warren green `#5a6a3a` (C); cave black `#2a2a22` (C); hoard gold `#c8b050` (M); lamp yellow `#e0c860` (M); rust `#7e4a2c` (C).

*Divisions:* base, per_fess, chief, pile_reversed.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `warren_lamp` (restoration) | a lamp in a cave mouth | a lamp gone out is a warren doomed |
| `gold_hoard` | a heap of gold | goblins love gold and jewellery |
| `warren_trap` | a spring trap | the trap-rooms of the warren |
| `wolf_mount_head` | the head of a riding wolf | they ride wolves to move quickly on the surface (the card's word is under Q-14) |
| `powder_pouch` | a bulging powder pouch with a smouldering cord | the best powder of the Dark Lands, sold to whoever pays most |
| `warren_fuse` | a flame at the end of a fuse-cord | the powder the best powder-makers of the Dark Lands sell to whoever pays |

*Ornament:* Lamps and gold in the dark; never a whole wolf-rider.

*Rank and form:* kingdom: A goblin kingdom under a hobgoblin king: the grown crown over the lamp; clan: A warren led by its cleverest goblin: no crown; hold: A free warren-hold under a Big Snik: no crown, because the Big Snik is a boss and not the hobgoblin king.

*Breakaway difference:* a border potenty of rust (dissent tincture rust).

### Troll Tribes (`troll_tribes`)

*People:* trolls. *Family:* Peoples without kin. *Language:* trollish. *Faith:* stone_hunger. *Line:* urdy. *Realms:* 1 (Troll Forest).

*Palette:* troll moss `#6d7a5a` (C); cave umber `#4a4030` (C); stone grey `#a09878` (M); bog black `#2a2a24` (C); bone `#cfc4a8` (M).

*Divisions:* per_fess, base, plain.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `boulder` | a great boulder | the great boulder of the troll king |
| `troll_club` | a knotted club | the challenge that decides who leads |
| `bog_pool` | a bog pool | the bogs where they lay their dead |
| `border_heap` (restoration) | a heap of stones | the stone-heaps at the tribe borders |

*Ornament:* Rough boulders and clubs; no metal tinctures.

*Rank and form:* clan: The oldest unbeaten troll leads: no crown; the boulder is the largest charge; kingdom: Smash is king of these trolls only: no crown; the boulder is the largest charge.

*Breakaway difference:* a border urdy of bog black (dissent tincture bog black).

### Hill Giants of Hirolon (`hill_giants`)

*People:* giants. *Family:* Peoples without kin. *Language:* gigantic. *Faith:* giant_cairn. *Line:* arched. *Realms:* 1 (Hirolon).

*Palette:* cairn brown `#7c6a58` (C); hill moss `#4f5a40` (C); stone `#b0a888` (M); deep earth `#3e3e36` (C); chalk `#e0dccb` (M).

*Divisions:* base, per_fess, plain.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `great_cairn` | a great cairn | a stone for every year of a giant's life; the cairns are the giants' memory |
| `year_stones` (restoration) | a row of standing stones of rising height | the counting of years by stones |

*Ornament:* One great stone filling the flag.

*Rank and form:* council: A High Chief chosen by the cairn-keepers: the great cairn, no crown; kingdom: A sovereign High Chief: the Eldest Cairn on the arched hill, no crown and no charter border (Hirolon treats with Aenor from outside the Charters under the Cairn Treaty); protector: Hirolon's ward: a realm under its protection carries a narrow border of cairn brown.

*Breakaway difference:* a border arched of deep earth (dissent tincture deep earth).

### Ice Giants of Nivaros (`ice_giants`)

*People:* giants. *Family:* Peoples without kin. *Language:* gigantic. *Faith:* giant_cairn. *Line:* arched. *Realms:* 1 (Nivaros).

*Palette:* glacier blue `#9fc4d8` (M); rime white `#e8eef2` (M); deep ice `#2f4a5a` (C); frost grey `#8a9aa4` (M).

*Divisions:* base, per_fess, plain.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `ice_throne` | a throne of ice | the Ice-Throne of the Frost-King of Nivaros |
| `frost_cairn` (restoration) | a cairn of ice blocks | the cold honoured as an old spirit of ice |
| `ice_sun` | a sun with rays cut in ice | the Frost-King and the glacier that keeps its own time |

*Ornament:* Huge, simple ice shapes.

*Rank and form:* kingdom: A Frost-King chosen by the cairn-keepers: the ice throne is the crown.

*Breakaway difference:* a border arched of frost grey (dissent tincture frost grey).

### Yeti Clans (`yeti_clans`)

*People:* yeti. *Family:* Peoples without kin. *Language:* yetic. *Faith:* yeti_hum. *Line:* dancetty. *Realms:* 1 (Yeti Lands).

*Palette:* yeti white `#e6eef4` (M); hum blue `#8a9cb2` (M); rock slate `#3e4c5a` (C); dusk violet `#5e5476` (C).

*Divisions:* base, per_chevron, plain, bordure.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `hum_cave` (restoration) | a dark cave mouth in a white peak | the Hum-Caves where the mountain's hum is answered at dusk |
| `cave_arch` | a round-headed cave-mouth, dark within | the cave that answers the Eldest's song |

*Ornament:* Three peaks; the hum is drawn as a cave answering, never as radiating arcs.

*Rank and form:* clan: The clan follows the voice that carries furthest: no crown.

*Breakaway difference:* a border dancetty of rock slate (dissent tincture rock slate).

### Ents of Kilinti (`kilinti_ents`)

*People:* ents. *Family:* Peoples without kin. *Language:* longspeech. *Faith:* ent_slow. *Line:* rooted. *Realms:* 1 (Kilinti).

*Palette:* ent green `#3f6b2e` (C); bark umber `#5e4e32` (C); moss pale `#a8b890` (M); deep grove `#263a20` (C); sap amber `#b89a4a` (M).

*Divisions:* plain, base.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `eldest_tree` | an ancient tree with spreading roots | the Eldest, who speaks last |
| `growth_rings` (restoration) | a cut trunk showing its rings | the Ent-Moot every seventh Thaw |
| `moot_grove` | a ring of trees | the Moot-Grove |

*Ornament:* Trees always with roots.

*Rank and form:* forest domain: The Eldest speaks last: a rooted tree, no crown; subject: The Concord charter border of lamp gold.

*Breakaway difference:* a border rooted of bark umber (dissent tincture bark umber).

### Grave Hosts of Volgan (`grave_hosts`)

*People:* the dead. *Family:* Peoples without kin. *Language:* grave_rite. *Faith:* grave_cult. *Line:* straight. *Realms:* 1 (Puvulan).

*Palette:* grave black `#1e1a24` (C); ash violet `#5b5566` (C); ember red `#a83a2a` (C); bone `#cfc6b0` (M); pall grey `#3c3844` (C).

*Divisions:* plain.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `nafeher_gate` (restoration) | an arched gate standing open, dark within, with ember light at its threshold | the Gate of Nafeher and the rite of Names and Gates |
| `ring_of_names` | a ring of short notches | the names the necromantic orders keep |

*Ornament:* No eye (another fiction's dark lord), no skull, no figure; the Gate and the Names.

*Rank and form:* kingdom: The Dominion: the Gate, no crown, because the crown is not a person's to wear in the arms; overlord: Realms sworn to the Dominion carry a narrow base of grave black: they stand on the Dominion's ground.

*Breakaway difference:* a border of pall grey (dissent tincture pall grey).

### Zol's Dead (`zols_dead`)

*People:* the dead. *Family:* Peoples without kin. *Language:* unrecorded. *Faith:* none. *Line:* straight. *Realms:* 1 (Zol's Mistake).

*Palette:* void black `#0a0a0c` (C); cold grey `#6a6a72` (C); ash dark `#2a2a30` (C).

*Divisions:* plain.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `broken_rings_sigil` (restoration) | a sigil of broken concentric rings | The Will of Zol, the emblem that leads the realm; nothing about who governs for Zol is said |

*Ornament:* Nothing but the sigil of the emblem that leads the realm.

*Rank and form:* emblem realm: Zol's Mistake shows only the sigil of its emblem leader, the Will of Zol, on the void: broken concentric rings, the same sigil as the leader's portrait. Nothing states who administers Furviatlon, and nothing of Zol's servant appears.

*Breakaway difference:* none: a realm of the dead does not break away in heraldry (dissent tincture ash dark).

### Netherborn (`netherborn`)

*People:* demons. *Family:* Peoples without kin. *Language:* infernal. *Faith:* pact_rite. *Line:* rent. *Realms:* 3 (Khorvrath, Dolon, Nezer).

*Palette:* nether red `#9b2a2a` (C); ash black `#2a1a1a` (C); ember gold `#d8a060` (M); obsidian `#120c0c` (C); sulphur `#c8b04a` (M); ash white `#d8cfc4` (M).

*Divisions:* per_bend, per_fess, pile, plain.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `pact_horn` | a single curved horn | the pact-horn of a lord of the Nether |
| `pact_seal` (restoration) | a blank wax seal with a thumb-print | the pact and the pact-name known only to the pact |
| `obsidian_blade` | an obsidian blade | oaths of blood and ash |
| `brine_cauldron` | a cauldron of brine over fire | salt and sulphur made into black powder |
| `lava_galley` | a galley on a wave of fire | the galleys that cross the Sea of Lava, which only demons sail |
| `maw_fire` | a fire rising from the sulphur of the Maw | the sulphur of the Maw that makes the Dominion's black powder |
| `burning_gate` | a broken gate with fire through its arch | the broken Burning Gate on the coast of Nezer |

*Ornament:* Original pact sigils; a pentagram only inside a demon sigil (owner, 24 October 2026, used once, by the Nether), never a cross or an inverted cross, never a goat in a star.

*Rank and form:* kingdom: A Lord or Queen of the pact: the pact-charge; sworn realms take the grave black base; lordship: A demon lord shows its pact-charge; confederation: Two crowns of one house: the field divided between them; sworn: Sworn to Nafeher: a narrow base of grave black.

*Breakaway difference:* a border rent of obsidian (dissent tincture obsidian).

### Vale-Folk of Kingson (`vale_folk`)

*People:* men. *Family:* Ainic men. *Language:* aenoran. *Faith:* pass_vigil. *Line:* straight. *Realms:* 2 (Kingson, Klungori Guard). *Supersedes:* `wall_folk` (retired).

*Palette:* vale slate `#5a5a6a` (C); pass gold `#d8c080` (M); charter blue `#2f5d8a` (C); snowline white `#e8e6de` (M); granite `#3e4147` (C); lichen green `#5a6b4a` (C).

*Divisions:* per_chevron, plain, per_fess, chief, pile_reversed, base.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `pass_key` | a large key | the Pass Charter: the key of the only wheel road through the range, held by the Pass-Lord in the crown's name |
| `cleft_peaks` | two peaks with a pass between them | the passes of the Great Wall of Aenor, a natural range |
| `beacon_peak` (restoration) | a peak with a fire on its summit | the vigil fire of the pass, which is never let out |
| `watch_horn` | a straight watch-horn | the watch of the passes, handed from father to son |
| `mountain_ibex` | an ibex standing | the high pastures above the snowline |
| `crossbow` | a crossbow | the crossbows of the sworn pass companies |
| `names_stone` | an upright stone with notches | the stone on which the dead of the passes are named |
| `ringed_vale` | a ring of hills round a green vale | the ringed Kingson Vale, held through the whole Third Age under the Order's forts |
| `vigil_flame` | a tall vigil flame between two pale points | the fire of the pass that is never let out |
| `pass_spear` | a spear upright, its point crowned by a ring | the sworn pass companies and their watch on the South Pass |

*Ornament:* Peaks, passes, snowlines and the ringed vale: the Great Wall of Aenor is a natural range, so the arms never show masonry, gate-towers, battlements or brick courses.

*Rank and form:* pass lordship: The per chevron field (the range) with the charge beneath the peak; no crown, because the Pass-Lord holds by charter; garrison company: The charge of the watch on a reversed pile, the pass rising; subject: The Concord charter border of lamp gold.

*Breakaway difference:* a border of granite (dissent tincture granite).

*Not drawn from the culture card:* The source card's gate-tower is not drawn: a tower in the pass reads as masonry of the Great Wall, which is a natural range.

### Hill-Herders of Hilofrim (`hilofrim_herders`)

*People:* men. *Family:* Ainic men. *Language:* aenoran. *Faith:* lamp_furrow. *Line:* straight. *Realms:* 0; second culture of 1. *Supersedes:* `wall_folk` (retired).

*Palette:* Grano green `#6a7a4a` (C); fleece cream `#e8e0c0` (M); turf brown `#5a4a3a` (C); saddle grey `#8a8a7c` (C); sky wool `#c8d0d0` (M).

*Divisions:* per_fess, base, plain, per_bend.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `hill_sheep` | a horned hill sheep standing | the flocks of the Grano that pay the giants' grazing due |
| `shepherd_crook` | a shepherd's crook | the village headmen who answer to the High Chief |
| `shepherd_sling` | a shepherd's sling | the herders' slings, their only arms |
| `grano_saddle` | a low saddle between two hills | the Grano Saddle, over which the herders guide armies |
| `stone_fold` (restoration) | a round stone sheepfold | the low stone farms of the Grano |

*Ornament:* Low, broad charges of the open hill; no peaks of the range and no masonry of any wall.

*Rank and form:* tenant: No realm of its own: the herders are Hirolon's tenants, and Hirolon's arms borrow the Grano green from them.

*Breakaway difference:* a border of turf brown (dissent tincture turf brown).

### Strait-Folk of Fotan (`strait_folk`)

*People:* men. *Family:* Ainic men. *Language:* aenoran. *Faith:* strait_litany (with deliverer). *Line:* straight. *Realms:* 1 (Fotan).

*Palette:* toll blue `#2f4a6a` (C); quay white `#e0e0d0` (M); chain red `#8a2a2a` (C); toll brass `#c4a050` (M); tar black `#2a2a2e` (C).

*Divisions:* per_fess, per_pale, plain, base, per_bend_sinister.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `toll_chain` | a chain stretched fesswise from edge to edge | the chain Ostvar's house stretched across the narrowest landing of the strait |
| `toll_boat` | a small toll-boat under oars | the toll-boats, the best-handled small craft on the strait |
| `toll_house` (restoration) | a squat toll-house on a quay | the toll-house the Order burned twice and never kept them out of |
| `joined_rings` | two plain rings linked | the Leren captain and the Aenoran ferry-house married into one house |
| `boathook` | a boathook | the ferrymen of the narrowest crossing |
| `toll_ring` | a heavy toll-ring with a bar through it | the toll-ring that stretches across the narrow strait |

*Ornament:* Charges of the crossing drawn fesswise, from shore to shore.

*Rank and form:* lordship: A free lordship outside the Charters: Aen's label, no charter border and no crown.

*Breakaway difference:* a border of tar black (dissent tincture tar black).

### Teste Valley-Folk (`teste_valley_folk`)

*People:* men. *Family:* Ainic men. *Language:* aenoran. *Faith:* lamp_furrow. *Line:* straight. *Realms:* 1 (Teste).

*Palette:* vale green `#5a7a3a` (C); straw `#e0d0a0` (M); lake slate `#3a5a7a` (C); loam brown `#6a4a30` (C); linen white `#ece6d4` (M).

*Divisions:* chief, per_fess, plain, base.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `plough_furrow` (restoration) | a furrow of three lines ploughed across the field | the one fertile vale under the Herrodon rim |
| `reeve_staff` | a reeve's staff with a hooked head | the Reeve chosen at the harvest moot |
| `oat_sheaf` | a sheaf of oats | the grain Teste sends to Herrodon and Andos Enda |
| `ash_leaf` | a single ash leaf | the old ranger speech the valley still keeps |

*Ornament:* Plain farm charges; nothing elven except the protector's border.

*Rank and form:* commune: No crown: a moot of farms; the protector's hall-ward border of Herrodon.

*Breakaway difference:* a border of loam brown (dissent tincture loam brown).

### Reindeer Clans of Kvittumm (`reindeer_clans`)

*People:* men. *Family:* Boreal men. *Language:* coldic. *Faith:* winter_hearth. *Line:* indented. *Realms:* 1 (Kvittumm).

*Palette:* fell grey `#6a7a8a` (C); white hills `#f0f0f0` (M); hide red `#7a3a2a` (C); turf brown `#5c4a36` (C); lichen gold `#c8b46a` (M).

*Divisions:* plain, per_fess, per_bend, base.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `antlered_head` | a reindeer's head with full antlers | the herd, which is the clan's wealth |
| `hide_tent` | a hide tent of the herd-camps | the camps that move with the herds between the giants' foothills and the Orewell lowland |
| `herd_bell` | a herd bell | the lead reindeer of a clan's herd |
| `moot_fire` (restoration) | a moot-fire in a plain ring | the winter moot fire of the reindeer clans at Esrom |
| `ice_road_cairn` | a cairn on a frozen road | the old ice-roads the clans keep |

*Ornament:* Herd charges, drawn whole and plain; nothing on the arms speaks of anything but herds, weather and the moot.

*Rank and form:* confederation: The clans' charge tripled, two above one; no crown.

*Breakaway difference:* a border indented of turf brown (dissent tincture turf brown).

### Sealers of Woqood (`woqood_sealers`)

*People:* men. *Family:* Eastern men. *Language:* noric. *Faith:* well_oath. *Line:* stepped. *Realms:* 1 (Woqood).

*Palette:* snow coast `#e8f0f0` (M); seal water `#3a5a6a` (C); harpoon red `#8a2a2a` (C); whalebone `#d8ccb4` (M); sled black `#2a2a2e` (C).

*Divisions:* chief, per_fess, plain, base.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `woqood_harpoon` | a harpoon with its coiled line | the Harpoon-Speaker who holds the peace of the moot of Pehami |
| `whalebone_hall` | a turf hall framed in whalebone | the halls of the snow coast |
| `snow_well` (restoration) | a well-head cut into snow | the Well-Oath of the Noric boat clans, kept on the snow coast |
| `seal_head` | a seal's head rising from water | the seal grounds the clans share without blood |
| `sled` | a sled | the sled-men of the coast |

*Ornament:* Noric stepped lines on a coast of snow: the riders' stock under a northern sky, and no camel or desert charge.

*Rank and form:* league: The Harpoon-Speaker's charge tripled for the clans of Pehami, Cream and Lorvens; no crown.

*Breakaway difference:* a border stepped of sled black (dissent tincture sled black).

### Sea-Crown Folk of Naamis (`naamis_sea_crown`)

*People:* men. *Family:* Eastern men. *Language:* noric. *Faith:* well_oath. *Line:* stepped. *Realms:* 1 (Naamis).

*Palette:* naam blue `#1f4a7a` (C); harbour gold `#e0c070` (M); coast white `#f0f0e8` (M); deep naam `#142c4a` (C); sail ochre `#b08a4a` (C).

*Divisions:* plain, per_fess, per_pale, chief, base.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `twin_harbour` | two harbour moles curving round one basin | Hacsen and Vigodor, the two harbours one marriage made a crown |
| `coast_hall` | a long hall with a stepped roof | the coast hall of Duum-Saah built between the two harbours |
| `sea_well` (restoration) | a well-head on a shore | the Noris Treaty: the sea crown keeps the Well-Oath of the riders |
| `deep_hull` | a deep-hulled ship | the ships that carry the Salt Road's goods to the rift |

*Ornament:* White harbour charges on the blue of the north coast.

*Rank and form:* kingdom: The sea-crown over the charge; the crown passes in one line of captains. *Crown:* the sea-crown: a gold circlet of small wave-crest points.

*Breakaway difference:* a border stepped of deep naam (dissent tincture deep naam).

### Island Fishers of Orato (`orato_fishers`)

*People:* men. *Family:* Eastern men. *Language:* noric. *Faith:* well_oath. *Line:* stepped. *Realms:* 1 (Orato).

*Palette:* isle blue `#3a6a8a` (C); net white `#e0e0d0` (M); boat brown `#5a3a2a` (C); catch silver `#b8c0c4` (M); dark water `#1e2e3a` (C).

*Divisions:* per_pale, per_fess, plain, base.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `orato_cod` | a cod swimming | the catch the isles sell to the Naamis ship-masters |
| `stone_harbour` (restoration) | a stone harbour mole | the harbour at Nodoqood that every boat of the isle can use |
| `fishing_skiff` | a fishing skiff | the boats of the fishing families |
| `net_floats` | a net hung with floats | the families who chose one lord of the boats |
| `net_ring` | a ring of net-floats strung on a cord | the cod the families of Orato sell to the Naamis ship-masters |

*Ornament:* Plain fishing charges; nothing of what the fishermen say they saw among the northern islands.

*Rank and form:* lordship: One lord of the boats: no crown; the two isles impaled per pale.

*Breakaway difference:* a border stepped of dark water (dissent tincture dark water).

*Not drawn from the culture card:* The source card's black sail is not drawn: public arms do not show the black ships of the north.

### Quay-Folk of Luv-zhise (`quay_folk`)

*People:* men. *Family:* Eastern men. *Language:* alerhic. *Faith:* lake_litany. *Line:* stepped. *Realms:* 1 (Luv-zhise).

*Palette:* narrows teal `#2a5a6a` (C); quay ochre `#d0b070` (M); ferry plum `#6a3a5a` (C); foam white `#e4e0d4` (M); piling black `#262628` (C).

*Divisions:* per_pale, per_fess, plain, base.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `rift_ferry` | a ferry-rope stretched between two posts | the ferry crossing between the two shores of the Rift Narrows |
| `ferry_rope` | a ferry-rope drawn between two posts | the crossing itself |
| `stilt_quay` (restoration) | a quay-house on stilts | the quay-houses whose heads sit as the port's council |
| `pilot_pole` | a pilot's sounding pole | the pilots of the Narrows |

*Ornament:* The crossing drawn across a field divided per pale, one shore at the hoist and one at the fly.

*Rank and form:* city state: A free port: the crossing over the two shores; no crown.

*Breakaway difference:* a border stepped of piling black (dissent tincture piling black).

### Pass-Lords of Miaed (`miaed_pass_lords`)

*People:* men. *Family:* Eastern men. *Language:* alerhic. *Faith:* pass_fires. *Line:* stepped. *Realms:* 1 (Miaed).

*Palette:* pass ochre `#c08a3a` (C); gorge red `#6a2a1a` (C); sand white `#f0e0c0` (M); fire gold `#e0b040` (M); night pass `#2a2430` (C).

*Divisions:* per_fess, per_chevron, plain, chief, pile_reversed.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `pass_fire` (restoration) | a fire burning in a mountain pass | the fires the pass-lords keep for the spirits of the high road, who lead caravans through the sand-storms |
| `fire_tower` | a slender fire-tower | the fire-towers of the Hardtmuth passes |
| `gorge_road` | a road winding through a gorge | the gorges where the Sand Road's first caravans came through |
| `glass_sand_jar` | a jar of glass sand | the glass sand of the coast |
| `caravan_bell` | a caravan bell | the passage the lords sell to whoever pays more |

*Ornament:* The pass-lords respect strangers' gods and show none: their charge is their own fire.

*Rank and form:* lordship: The pass-lords elect the Lord of Erdozan: no crown; the fire stands in the pass.

*Breakaway difference:* a border stepped of night pass (dissent tincture night pass).

### Oasis-Folk of Wahatud (`wahatud_oasis_folk`)

*People:* men. *Family:* Eastern men. *Language:* noric. *Faith:* water_share. *Line:* stepped. *Realms:* 1 (Wahatud).

*Palette:* oasis green `#3a8a7a` (C); dune `#e8d8a8` (M); mud brick `#8a6a3a` (C); well blue `#2a5a7a` (C); water silver `#c8d4d0` (M).

*Divisions:* plain, per_fess, base, chief.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `four_wells` | four well-heads set in a ring | the Well-Moot that the clan-mothers swore at Biir-Raab |
| `offered_cup` (restoration) | a cup held out | the water always offered to refugees |
| `well_bucket` | a well-bucket on its rope | water sold by the skin to caravans that are not refugees |
| `dune_staff` | a guide's staff | the guides who cross the dune sea without fear |

*Ornament:* Water is drawn as wells, cups and buckets; never a palm tree (banned everywhere) and never a camel (the one camel of the East and South belongs to Noris).

*Rank and form:* league: The Well-Moot: no crown; the wells are the charge.

*Breakaway difference:* a border stepped of mud brick (dissent tincture mud brick).

*Not drawn from the culture card:* The source card's palms are not drawn: palm trees are banned everywhere.

### the Kingdom Forest Company (`kingdom_forest_elves`)

*People:* elves. *Family:* Sylvan elves. *Language:* sylvan. *Faith:* kindred_song. *Line:* engrailed. *Realms:* 1 (Dunelaeth).

*Palette:* kingdom green `#2a5a3a` (C); old silver `#c8c0a0` (M); western bark `#5a3a2a` (C); moon white `#f0f0e8` (M); dusk `#3a4048` (C).

*Divisions:* plain, per_fess, per_chevron, base.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `kept_beech` | a beech in full leaf over a low grassed mound | the household that would not leave the forests where its dead lay |
| `silver_road` | a silver road winding up to a pass between two hills | the road to the Kingson Pass that the household guides travellers on |
| `guide_lantern` (restoration) | a guide's lantern on a staff | the guides of the Kingdom Forests |
| `guide_flame` | a single flame standing on a plain base | the guide-lantern of the household that would not leave the forests |

*Ornament:* Silver in every achievement; never a crowned tree (another fiction's white tree and crown).

*Rank and form:* household: One household under its eldest: no crown and no council border.

*Breakaway difference:* a border engrailed of dusk (dissent tincture dusk).

*Not drawn from the culture card:* The source card's crown on the tree is not drawn: a crowned tree is another fiction's arms.

### Roost-Keepers of Yavieth (`roost_keepers`)

*People:* elves. *Family:* Sylvan elves. *Language:* sylvan. *Faith:* kindred_song. *Line:* engrailed. *Realms:* 1 (Yavieth).

*Palette:* slope green `#3a6a2a` (C); dragon red `#c0302a` (C); goat cream `#e0d0a0` (M); keeper silver `#d0d4cc` (M); roost slate `#3a3a40` (C).

*Divisions:* plain, per_chevron, base, per_fess.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `three_spurs` (restoration) | a mountain with three spurs | Dragon Mountain, on whose three spurs the dragons roost |
| `gift_scale` | a single shed dragon scale | the scales the dragons shed, which the keepers trade at Kingson |
| `keeper_goat` | a goat standing | the dragon-shy goats the dragons are allowed to take |
| `roost_ledge` | a shelter on a mountain ledge | the keepers' shelters on the slopes |
| `roost_flame` | three flames rising in a row | the roosts of Dragon Mountain, where the keepers go up to listen |

*Ornament:* Dragons are shown only by a scale or the mountain, never as a whole beast: a red dragon on green and white and a dragon on a diagonal bicolour are real-world flags.

*Rank and form:* fellowship: A fellowship without a ruler: no crown and no border.

*Breakaway difference:* a border engrailed of roost slate (dissent tincture roost slate).

### Keepers of the God Forest (`god_forest_keepers`)

*People:* elves. *Family:* Peoples without kin. *Language:* sunhot. *Faith:* kindred_song. *Line:* wattled. *Realms:* 1 (God Forest).

*Palette:* god-wood green `#1f4a3a` (C); glade gold `#e8d070` (M); keeper white `#f0f0e0` (M); shadow `#142a22` (C); bark grey `#6a6a5a` (C).

*Divisions:* base, plain, per_fess.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `branch_gate` | a closed gate of woven branches | the wood the Keepers close to everyone |
| `round_glade` (restoration) | a round glade in a wood | the Keepers' Glade |
| `upright_leaf` | a single long leaf held upright | the silence the Sunhot treat as holy |

*Ornament:* No sun disc, no rayonny and no invected line: whether the Keepers are Sunhot, Gala or a kin of their own is open, and the arms must not answer it. The wattled line is theirs alone.

*Rank and form:* household: The Keepers' household: no crown, no border.

*Breakaway difference:* a border wattled of shadow (dissent tincture shadow).

*Not drawn from the culture card:* The source card's gold sun is not drawn: a sun would answer the open question of the Keepers' kin.

### Delving-Clans of Kunhrim (`wall_delvers`)

*People:* dwarves. *Family:* Dwarves. *Language:* dwarvish. *Faith:* deep_reckoning. *Line:* dovetailed. *Realms:* 1 (Kunhrim).

*Palette:* delving brown `#4a3b2f` (C); anvil gold `#c9973a` (M); stone grey `#8f8f8a` (C); black powder `#1e1c1c` (C); lamp white `#e6e0d2` (M).

*Divisions:* plain, bordure, chief, per_chevron, pile_reversed, per_fess, base.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `rock_gate` (restoration) | a squared gate cut into a rock face | the Western Gate the clans cut into the Lunhrim massif to trade with Aen's kingdom |
| `powder_horn` | a powder horn | the black powder the hold sells to the crown and nobody else |
| `ore_basket` | a carrying basket heaped with ore | the iron that goes west, which the clans can withhold from any ruler in Parim |
| `founders_stone` | a squared stone cut with plain notches | the founders' reckoning cut in stone in the deep hall |
| `rock_arch` | a round-headed arch cut into a rock face | the Western Gate cut into the Lunhrim massif |

*Ornament:* Rock-cut gates and squared charges: the Great Wall of Aenor is a natural range, so no masonry, battlements or brick courses. No flaming anvil (the arms of a named god).

*Rank and form:* subject: The Iron Charter is a Concord charter: the border of lamp gold; hold: The Lord of the Deep Hall and the clan-elders: no crown.

*Breakaway difference:* a border dovetailed of black powder (dissent tincture black powder).

*Not drawn from the culture card:* The source card's anvil is not drawn (a gold anvil on a dark field is the arms of Irumas of the twelve) and its stone arch is cut from rock, not built; the Iron Charter is shown by the Concord's lamp-gold border like every other charter.

### Western Hold-Folk (`west_delvers`)

*People:* dwarves. *Family:* Dwarves. *Language:* dwarvish. *Faith:* deep_reckoning. *Line:* dovetailed. *Realms:* 2 (Brundahrim, Gromkerm).

*Palette:* hold dark `#3d3a36` (C); rim gold `#c8a048` (M); forge red `#a33a2a` (C); ash white `#dcd6ca` (M); grey stone `#8a8680` (C); iron black `#222224` (C).

*Divisions:* plain, bordure, chief, per_fess, pile_reversed, per_chevron, base.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `forge_flame` | a forge-flame on a hearth-stone | Hrennost, the fire-hold, ruled from its deepest hall |
| `outer_gate` (restoration) | a squared outer gate in a rock face, shut | the Outer Gate where men trade and beyond which they have never been |
| `bombard` | a squat bombard on a timber bed | the siege bombards cast for sale |
| `powder_keg` | a bound powder-keg | the powder-pieces sold to whoever wins the hold's favour |
| `gold_ingot` | a gold ingot | the gold and gems of the Herlitz and the Dusty Mountains |

*Ornament:* Heavy squared charges and a dovetailed chief or base; no tincture shared with elven arms.

*Rank and form:* hold: The lord of the deepest hall: no crown; the masters of the forges advise.

*Breakaway difference:* a border dovetailed of iron black (dissent tincture iron black).

### High Hold-Folk (`north_delvers`)

*People:* dwarves. *Family:* Dwarves. *Language:* dwarvish. *Faith:* deep_reckoning. *Line:* dovetailed. *Realms:* 1 (Hrakbrund).

*Palette:* high slate `#2e3a45` (C); snow white `#d8d8d0` (M); bronze `#9a7a3a` (C); gate black `#1e1e22` (C); ice grey `#a8b0b4` (M).

*Divisions:* pile_reversed, chief, per_chevron, per_fess.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `high_gate` (restoration) | a squared black gate in a snowline rock face | the High Gate, the only place where men are received |
| `pact_hammer` | a war-hammer held upright | the Hill Pact of the dwarves and the hills |
| `deck_bombard` | a bombard on a ship's carriage | the bombards that ride on Sonargur's ships |

*Ornament:* A white peak and a black gate: the hall under the snows.

*Rank and form:* hold: The Lord of the White Hall with a council of clans: no crown.

*Breakaway difference:* a border dovetailed of gate black (dissent tincture gate black).

### Hearth-Folk of Dobbum (`hearth_folk`)

*People:* small folk. *Family:* Peoples without kin. *Language:* hearthspeech. *Faith:* hearth_table. *Line:* double_arched. *Realms:* 2 (Dobbum, Tirlan).

*Palette:* basin green `#4f7a3a` (C); harvest yellow `#e3c77a` (M); hearth brown `#8a5a33` (C); loaf cream `#efe4c8` (M); hedge dark `#2f4a2a` (C); berry `#9a3a3a` (C).

*Divisions:* base, per_fess, plain, chief, flaunches.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `famine_bread` | a ring of grain-ears set in a circle | the Famine Bread the small folk carried to starving clansmen |
| `grain_ship` | a round-bellied grain ship with a patched square sail | the Aenoran grain ship that carried the first households of Tirlan south to the Hilorn mouth |
| `harvest_stone` (restoration) | a rounded harvest stone | the harvest stone at the moot-hall and the harvest-share paid to the giants |
| `apple_bough` | a young apple bough with fruit | the Orchard Gift of cuttings sent over the passes to Thenon |
| `three_valleys` | three low valleys between rounded hills | the three valleys of the Hilorn, Tirlan's small fields |

*Ornament:* Rounded, homely charges with square doors; never a round door (another fiction's mark).

*Rank and form:* moot: No crowns: the charge on a double-arched base, the hills of home; protectorate: Tirlan carries Hirolon's ward: a narrow border of cairn brown.

*Breakaway difference:* a border double-arched of hedge dark (dissent tincture hedge dark).

*Not drawn from the culture card:* The source card's round green door is not drawn: a round door is another fiction's mark.

### Holt-Folk of Olodor (`holt_gnomes`)

*People:* gnomes. *Family:* Peoples without kin. *Language:* gnomish. *Faith:* full_pot. *Line:* escartelly. *Realms:* 1 (Olodor).

*Palette:* holt green `#2f6b3a` (C); bird red `#b23a2a` (C); pot gold `#d4a93a` (M); root brown `#5a3e2a` (C); lamp cream `#e8dcb8` (M).

*Divisions:* per_fess, base, plain, flaunches.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `root_door` (restoration) | a small square door among the roots of a hill | the holts hidden under the hills, doors that look like roots |
| `tally_rim` | the notched rim of a pot | the village king's tally of the pots |
| `hidden_oak` | an old oak with a small square door in its trunk | houses inside trees |
| `gold_torc` | a gold torc, a plain neck-ring with open ends | the gold of the holts, given freely and never taken |

*Ornament:* One hidden detail in each design (the escartelly notch is the door); no pointed red cap, no rainbow, no clover.

*Rank and form:* enclave: An orle of the surrounding realm: holts hidden inside another's land; the pot uncrowned, because every village has its own king.

*Breakaway difference:* a border escartelly of root brown (dissent tincture root brown).

*Not drawn from the culture card:* The source card's red cap is not drawn (the gnome grammar forbids pointed red caps).

### Road-Warrens of Mustnom (`road_warrens`)

*People:* dwarf goblins. *Family:* Peoples without kin. *Language:* pack_tongue. *Faith:* road_due. *Line:* bevilled. *Realms:* 1 (Mustnom).

*Palette:* pack brown `#5a4a3a` (C); road moss `#7a8a4a` (C); trade brass `#c0a060` (M); salt white `#e0dcd0` (M); boss black `#262420` (C).

*Divisions:* per_bend, per_bend_sinister, per_fess, chief, plain.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `laden_pack` | a laden travel pack | half of every family always on the road with goods |
| `news_horn` | a pedlar's horn | news of a landing carried faster than any courier |
| `cave_market` (restoration) | a cave mouth hung with goods | the cave-markets of the southern hills |
| `salt_pinch` | a pinch of salt on a flat stone | the spirits of the road, thanked with a pinch of salt |
| `long_staff_ring` | a long staff with an iron ring at its head | the packmen of Mustnom and the news they carry faster than any courier |

*Ornament:* Diagonal compositions: everything is on the road.

*Rank and form:* clan: The boss's iron ring round the charge; no crown, because no boss is a king.

*Breakaway difference:* a border bevilled of boss black (dissent tincture boss black).

### Warrens of the Hobgoblin King (`king_warrens`)

*People:* goblins. *Family:* Goblins. *Language:* goblin. *Faith:* warren_luck. *Line:* potenty. *Realms:* 1 (Burrikkrit).

*Palette:* deep moss `#4a5a2a` (C); pit black `#2a2a22` (C); salvage gold `#d0b050` (M); wurgh grey `#7a7468` (C); fire-pot orange `#c86a2a` (C).

*Divisions:* plain, bordure, base, per_fess, chief, pile_reversed.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `under_road` | a tunnel mouth under a mountain peak | the under-roads, the one hidden way through the range, which the king sells in war |
| `wurgh_head` | a wurgh's head | the wurgh riders of the southern roads |
| `fire_pot` | a fire-pot with a burning fuse | the crude powder thrown in the tunnel fights |
| `truce_lantern` (restoration) | a shuttered lantern | the Lamp Truce with the dwarves |
| `salvage_heap` | a heap of salvage | the salvage traded at the edges of the range |
| `truce_fire` | a small fire set in a plain circle | the Lamp Truce kept at the tunnel mouth of Burrikkrit |

*Ornament:* Goblin ornament scaled up for the king's warrens: fewer, larger shapes.

*Rank and form:* kingdom: The grown crown over the warren's charge: the king is a hobgoblin who grew very big, and he rules these warrens only. *Crown:* the grown crown: a goblin crown too small for its wearer.

*Breakaway difference:* a border potenty of wurgh grey (dissent tincture wurgh grey).

### Warrens of the Warm Springs (`spring_warrens`)

*People:* goblins. *Family:* Goblins. *Language:* goblin. *Faith:* warren_luck. *Line:* potenty. *Realms:* 1 (Glimkit).

*Palette:* steam green `#5a7a5a` (C); warren dark `#3a3a2a` (C); lamp-fat yellow `#e8d070` (M); spring white `#e4e8e0` (M); hound brown `#6a5038` (C).

*Divisions:* plain, bordure, base, per_fess, chief.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `steaming_spring` (restoration) | a round spring sending up three plumes of steam | Drikzig, the hall of the warm water, dug round the largest spring |
| `fat_lantern` | a lantern burning rendered fat | the best lamps of the north, sold at the snowline fair |
| `spring_snare` | a spring snare | the best traps of the north |
| `bone_hound` | a shaggy bone-hound | the summer riders of the valleys |
| `three_plumes` | three plumes of steam rising from one round spring | the steaming spring of Drikzig and its warm valleys |

*Ornament:* Steam and snares; warm valleys under a cold sky.

*Rank and form:* clan: A hobgoblin chief, not the king: no crown.

*Breakaway difference:* a border potenty of warren dark (dissent tincture warren dark).

### Ogre Clans (`ogre_clans`)

*People:* ogres. *Family:* Orcs and ogres. *Language:* orcish. *Faith:* hold_luck. *Line:* raguly. *Realms:* 0; second culture of 1.

*Palette:* hall timber `#5a4a3a` (C); meat red `#8a3a2a` (C); ogre bone `#c0b090` (M); smoke grey `#6a645a` (C); cave char `#2a2622` (C).

*Divisions:* plain, per_fess, base, pile_reversed.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `offered_haunch` | a haunch of meat | the meat Grimduth carried into the ogres' caves instead of spears, which made one moot of orcs and ogres |
| `ogre_cauldron` (restoration) | a great cauldron | the clans who eat only meat |
| `timber_hall` | a great timber hall | the timber halls of the Dark Forests |
| `knotted_club` | a great knotted club | the clan under the biggest |

*Ornament:* Orcish ornament, larger and fewer charges.

*Rank and form:* moot: Among orcs the ogres take the host hold's tinctures and show their own charge beside the orcs'.

*Breakaway difference:* a border raguly of cave char (dissent tincture cave char).

### Soldiery of the Plateau (`plateau_soldiery`)

*People:* orcs. *Family:* Orcs and ogres. *Language:* orcish. *Faith:* skull_fire. *Line:* raguly. *Realms:* 0; second culture of 1.

*Palette:* barrack brown `#3a2a2a` (C); muster red `#8a1a1a` (C); scar bone `#c0a080` (M); powder black `#222024` (C).

*Divisions:* plain, per_fess.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `scar_marks` | three parallel scars | the only marks the companies keep of their own |
| `company_pike` | a pike of the companies | the orc companies of the necromantic orders |
| `muster_drum` (restoration) | a muster drum | the Musters the Dominion counts instead of months |

*Ornament:* No realm of its own: the companies march under the Dominion's arms.

*Rank and form:* companies: Nothing of theirs is added to the Gate of Nafeher; their marks are scars.

*Breakaway difference:* a border raguly of powder black (dissent tincture powder black).

### Cairn-Keepers of the Giant Forest (`cairn_giants`)

*People:* giants. *Family:* Peoples without kin. *Language:* gigantic. *Faith:* giant_cairn. *Line:* arched. *Realms:* 1 (Hoorunoron).

*Palette:* giant-forest green `#4a5a3a` (C); cairn grey `#a0a090` (M); forest earth `#6a4a2a` (C); lichen white `#dcdcc8` (M); river dark `#2e3a34` (C).

*Divisions:* base, per_fess, plain.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `three_stone_cairn` (restoration) | a cairn of three great stones | the cairns that name the dead, kept by the oldest giant |
| `cairn_line` | a line of small cairns across a hill | the Borderline of Giants, which is not to be crossed |
| `giant_oak` | a vast oak | the Giant Forest by the Giant River |

*Ornament:* One huge charge; giants do not draw small things.

*Rank and form:* enclave: No king: the oldest giant keeps the line; an orle of the surrounding realm.

*Breakaway difference:* a border arched of river dark (dissent tincture river dark).

### Height Clans of Ghaahu (`height_yeti`)

*People:* yeti. *Family:* Peoples without kin. *Language:* yetic. *Faith:* yeti_hum. *Line:* dancetty. *Realms:* 1 (Ghaahu).

*Palette:* height white `#e8e8f0` (M); cloud grey `#6a7a8a` (C); deep rock `#3a3a4a` (C); dusk blue `#4a5a7a` (C).

*Divisions:* per_chevron, base, plain.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `herd_horns` | a pair of curved wild-herd horns | the wild herds the height clans follow among the Cold Mountains |
| `song_cave_fire` (restoration) | a fire in a cave mouth | the fire at Huummal by which the height Eldest let the first envoy sit |
| `high_peaks` | three high peaks | the high snows of Ghaahu |

*Ornament:* Three big peaks; sound is drawn as a cave answering, never as radiating arcs.

*Rank and form:* clan: The clan follows the one whose song carries furthest: no crown.

*Breakaway difference:* a border dancetty of deep rock (dissent tincture deep rock).

### the Baelim (`baelim`)

*People:* tree people. *Family:* Peoples without kin. *Language:* lowspeech. *Faith:* standing_silence. *Line:* gnarled. *Realms:* 1 (Aenor Forest).

*Palette:* stand green `#2a4a2a` (C); root brown `#6a5a3a` (C); pale leaf `#a8b880` (M); dew silver `#d4dcc8` (M); deep shade `#1a2a1a` (C).

*Divisions:* base, plain, per_fess.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `rooted_fir` | a tall fir whose roots spread as wide as its crown | a stand of the Baelim, one and many, which has never let a man build among it |
| `fallen_cone` (restoration) | a fir cone | a sapling, which belongs to the stand it roots beside |
| `edge_water_jar` | a water jar set on the ground | the water Selen's rangers leave at the forest's edge in dry summers |
| `three_firs` | three firs standing close | Graulvoa, the oldest stand |

*Ornament:* Conifers only, tall and narrow with their roots shown; never a broadleaf tree and never the rooted line, which are the ents' marks.

*Rank and form:* forest domain: No crown: the slow moot shows the stand itself.

*Breakaway difference:* a border gnarled of deep shade (dissent tincture deep shade).

### Mycids of the Mushroom Forest (`mycid_rings`)

*People:* mycids. *Family:* Peoples without kin. *Language:* unrecorded. *Faith:* none. *Line:* gilled. *Realms:* 1 (Mushroom Forest).

*Palette:* spore purple `#6a4a6a` (C); cap cream `#d0c0a0` (M); loam dark `#3a2a2a` (C); pale gill `#e0d4c8` (M); fungus brown `#7a5a3a` (C).

*Divisions:* plain, base, per_fess.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `ring_of_caps` (restoration) | a ring of pale mushroom caps | the fungal belt of the rift shore |
| `giant_cap` | a giant mushroom with a broad cap | the giant fungi of the Mushroom Forest |

*Ornament:* Proposed until the owner rules on the mycids: only what is known (the forest and its fungi) is drawn; nothing about their rule.

*Rank and form:* enclave: An orle of the surrounding rift coast; nothing about their rule is shown, because nothing is known.

*Breakaway difference:* a border gilled of loam dark (dissent tincture loam dark).

### Houses of the Nether (`nether_houses`)

*People:* demons. *Family:* Peoples without kin. *Language:* infernal. *Faith:* pact_rite. *Line:* rent. *Realms:* 1 (Nether).

*Palette:* hall black `#1a0a0a` (C); lava red `#c0301a` (C); pact gold `#e0a040` (M); sulphur white `#e8e0b0` (M); cinder ash `#5a5048` (C).

*Divisions:* per_fess, per_bend, pile, plain.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `kings_seal` | a five-pointed figure drawn in one unbroken line inside a ring of flame | the King of Demons' seal over the pacts of every house |
| `pact_fires` (restoration) | two flames rising side by side | the pact-fires of the houses, bound by pacts and not by blood |
| `descending_stair` | a stair going down into fire | the Halls beneath the burning shore |
| `lava_wave` | a wave of lava | the Sea of Lava that rings the island |

*Ornament:* Original sigils; a pentagram is allowed in a demon sigil (owner, 24 October 2026), never a cross or an inverted cross, and never a trident (a real-world mark).

*Rank and form:* kingdom: The hall-crown over the King's seal; the King's name is the owner's to give and is never shown. *Crown:* the hall-crown: a circlet of flame-points.

*Breakaway difference:* a border rent of cinder ash (dissent tincture cinder ash).

*Not drawn from the culture card:* The source card's trident is not drawn (a real-world mark); the two flames stay as a charge of the houses.

### the Ash Court of Veshazel (`veshazel_court`)

*People:* demons. *Family:* Peoples without kin. *Language:* infernal. *Faith:* pact_rite. *Line:* rent. *Realms:* 1 (Veshazel).

*Palette:* ash-hall black `#2a1a1a` (C); cinder red `#a04020` (C); ash grey `#b0b0a0` (M); ember gold `#d09040` (M); soot `#181414` (C).

*Divisions:* plain, per_bend, per_fess.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `ash_flame` (restoration) | an ash-grey flame | the Goldoroth Ash Fields, where ash covers everything and nothing grows |
| `blank_seal` | a seal with a blank face | the pact-name that only the lord's pact knows |
| `ash_hall` | a hall of ash | the hall raised at Ozmath-Vesh in 4A 1180 |

*Ornament:* Ash and a blank seal: the court names nobody.

*Rank and form:* lordship: Sworn to no one: no grave base and no crown.

*Breakaway difference:* a border rent of soot (dissent tincture soot).

### Melkgard Warlords (`melkgard_warlords`)

*People:* men. *Family:* Boreal men. *Language:* coldic. *Faith:* storm_court. *Line:* indented. *Realms:* 1 (Melkgard). *Formerly:* `isengard_warlords` (the roster still writes the old id; both resolve here).

*Palette:* forge black `#2f2f33` (C); war red `#8a2a2a` (C); iron grey `#9a9aa0` (M); storm white `#dcdcd8` (M); gunmetal `#4a4c52` (C).

*Divisions:* plain, bordure, per_bend, per_fess, pile, per_chevron.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `spear_sheaf` | three spears bound in a sheaf | the oath-companies that hold the march for the warlord |
| `storm_cloud` (restoration) | a storm cloud loosing three bolts | the Storm Court, whose captains keep their tokens in the Black Gallery |
| `forge_chain` | a forged chain | the forges in every town |
| `black_gallery` | a dark gallery mouth cut into a cliff | the Black Gallery below Minnolomak, cut by Zorak's men |

*Ornament:* No tower and no hand or gauntlet (another fiction's fortress and white hand); storm, iron and black stone only.

*Rank and form:* warlord: The march is held by oath-companies: the charge is a sheaf of their spears; no crown, because the heir is the best sworn man, not the eldest.

*Breakaway difference:* a border indented of gunmetal (dissent tincture gunmetal).

### Vindael Seafarers (`vindael_seafarers`)

*People:* men. *Family:* Boreal men. *Language:* coldic. *Faith:* storm_court. *Line:* indented. *Realms:* 2 (Poloto, Vindael). *Formerly:* `windwaith_seafarers` (the roster still writes the old id; both resolve here).

*Palette:* sea teal `#3f6f74` (C); sail white `#d6d2c4` (M); tar brown `#6e5238` (C); storm grey `#5a6266` (C); gale blue `#2c4a5c` (C); amber `#c8963a` (M).

*Divisions:* per_bend_sinister, plain, per_fess, base.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `bellied_sail` | a ship under a bellied sail | ship-shares and the captains' council |
| `wind_tower` (restoration) | a slender wind-tower hung with cords | the wind-towers of the Vindael headlands |
| `storm_petrel` | a storm petrel | the bird that rides the storm |
| `wind_knots` | three knots tied in one cord | the sailors' knots of the shares, tied by captains who keep their council by them |
| `fur_bale` | a round bale of furs tied with cord | the fur the Fandan carries down to the free port at its mouth |

*Ornament:* Bellied sails and wind-cords; no compass rose (the chart-islanders' charge), no weathercock.

*Rank and form:* council: A Council of Captains: no crown; the ship is shown under sail, owned by shares; city state: A free port: the trade charge on a divided field and no crown.

*Breakaway difference:* a border indented of storm grey (dissent tincture storm grey).

### Gunwyn Clans (`gunwyn_clans`)

*People:* men. *Family:* Boreal men. *Language:* gunwaithic. *Faith:* clan_stones. *Line:* indented. *Realms:* 5 (Gunwyn, Werlendor, Lambin, Thenon, Varnondor). *Formerly:* `gunwaith_clans` (the roster still writes the old id; both resolve here).

*Palette:* clan madder `#6b2f2a` (C); clan green `#2f5a4a` (C); torc gold `#d4c07a` (M); moor brown `#5a4632` (C); slate blue `#3a4f66` (C); lime white `#e6e2d4` (M).

*Divisions:* per_pale, plain, per_fess, per_bend, chief, base.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `stone_ring` | a ring of standing stones | the Oath-Ring where kings are acclaimed and oaths bind |
| `standing_stone` (restoration) | a single standing stone | the Stone of the Grey Ford and the law of the stones |
| `clan_stag` | a stag standing | the hunting clans of the hills |
| `wild_boar` | a boar | the old feud-clans |
| `torc` | an open torc | the chief's bond to the clan |
| `ring_fort` | a round ring-fort seen from above | the ring-forts of the hills |
| `clan_hound` | a hound running | the war-bands |
| `stone_granary` | a round stone granary with a conical roof | Branorn's granaries below the hills of Faennon, which fed every clan in the famine years |
| `olive_tree` | an olive tree in fruit | the olives of the West's mildest corner |
| `cape_lantern` | a lantern on a cape | the lanterns King Oslin set on the western capes to watch the old approaches |
| `feud_blade` | a short broad blade with a ring at its hilt | the feud-clans of the old boar country, sworn to the Oath-Ring |
| `peace_cup` | a bar balanced level on a point | the peace the lowland kingdom of Thenon bought with cattle and olives |
| `sea_watch_flame` | a tall watch-flame on a cape-point | the lantern King Oslin first set on the western capes |

*Ornament:* No tartan, no thistle, no heather and no gyronny of gold and black (all real-world Scottish marks); the clan sett is shown as two clan colours divided per pale.

*Rank and form:* kingdom: The torc-crown; the king is acclaimed at a standing stone and bound by the Lawspeaker; clan: Per pale in the clan pair, the clan's beast across both; lordship: A lord of the downs: no crown; the charge of his trust on the clan colours. *Crown:* the torc-crown: the king's crown is an open torc.

*Breakaway difference:* a border indented of moor brown (dissent tincture moor brown).

### Ember Coast Freeholders (`ember_freeholds`)

*People:* men. *Family:* Ainic men. *Language:* mirolic. *Faith:* mourning_dust. *Line:* straight. *Realms:* 3 (Halia, Nan, Olen). *Formerly:* `ember_lands_freeholds` (the roster still writes the old id; both resolve here).

*Palette:* sand `#c9b58a` (M); sea teal `#3e6b78` (C); mud brick `#8a5a3a` (C); salt white `#ece8dc` (M); storm grey `#6a6e70` (C); tar black `#2b2826` (C).

*Divisions:* plain, per_fess, per_pale, per_bend, chief, base.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `gaff_hook` | a gaff hook | the warlord who takes the tolls |
| `flat_boat` | a flat-bottomed boat | the coast boats that came back from the north |
| `salt_pan` (restoration) | a salt-pan with heaped salt | the salt trade and the salt laid in every grave |
| `storm_lantern` | a storm lantern | a light kept against the storms (canting on Luminor and the lamp-cliffs of Olen) |
| `shore_crab` | a crab | the mud shore |
| `sun_hat` | a wide straw hat | the salt-pan workers under the sun |
| `storm_house` | a low mud-brick house | houses built low against the storms |
| `drag_net` | a drag net | the inshore fishing |
| `salt_stones` | three white salt-stones in a row | the three salt-pans of the freeholds of the salt coast, paying one toll as one league |
| `tolling_spear` | a spear with a hooked head | the warlord who takes its tolls in the Nan Mountains |
| `holy_breeze_flame` | a flame standing alone on a cliff-top | the lantern the Holy Breeze kept lit on the cliffs of Olen for a whole winter |

*Ornament:* Low, wide charges hugging the base; nothing names or shows the dead.

*Rank and form:* clan: A headman's freehold: no crown; warlord: A warlord's freehold: the charge is a weapon or a hook; league: A league of freeholds: the charge tripled, two above one; theocracy: The lamp-keepers' isle: a metal field and the lamp alone, no label.

*Breakaway difference:* a border of tar black (dissent tincture tar black).
<!-- generated:cultures:end -->

## 5. Grammars of the peoples

People grammars sit above the culture cards.
For peoples with culture entries they state what every culture of the people shares; for peoples whose culture cards are thin (hobgoblins, devils) they are the whole grammar.
This revision adds the tree-people (the Baelim of the Aenor Forest, who are not ents) and the mycids of the Mushroom Forest, and every people that had no realm before now has one.

<!-- generated:peoples:start -->
### Men (`men`)

*Status:* culture entries exist. *Line:* by family (Ainic straight with the label, Boreal indented, Eastern stepped, Orran nebuly, Yonic wavy).

*Divisions:* plain, per_fess, per_pale, per_bend, chief, base, per_chevron, quarterly.

*Ornament:* Plain edges; crowns drawn as circlets of the culture; beasts walk or stand, never rampant in a lion-of-a-national-arms pose.

*Rank and form:* Monarchies wear the culture crown over the primary charge; councils and leagues wear none; subjects take their overlord's mark.

*Kinship:* Through the five family lines; mixed realms borrow one tincture or one secondary charge of their second culture.

*Cultures:* `lake_aenoran`, `selen_ranger`, `steppe_rider`, `march_folk`, `isle_houses`, `leren_sea_kings`, `free_crowns_north`, `dondor_brutes`, `mirolon_wardens`, `zilin_pilgrims`, `veiled_folk`, `redbark_tribes`, `winter_crown`, `ice_clans`, `girdon_wardens`, `western_guilds`, `buldor_companies`, `chart_islanders`, `corsair_lords`, `noris_riders`, `caravan_princes`, `river_kings`, `lake_road_cities`, `red_lands_tribunes`, `southern_islanders`, `goodin_sunfolk`, `vale_folk`, `hilofrim_herders`, `strait_folk`, `teste_valley_folk`, `reindeer_clans`, `woqood_sealers`, `naamis_sea_crown`, `orato_fishers`, `quay_folk`, `miaed_pass_lords`, `wahatud_oasis_folk`, `melkgard_warlords`, `vindael_seafarers`, `gunwyn_clans`, `ember_freeholds`.

### Elves (Great Folk) (`elves`)

*Status:* culture entries exist. *Line:* engrailed (Sylvan) or invected (Galic).

*Divisions:* plain, per_fess, per_bend, per_chevron, flaunches, chief, bordure.

*Ornament:* Silver in every achievement; long, drawn-out charges; no crown of points, only a leaf circlet for the few hill queens and kings.

*Rank and form:* Elected speakers wear an engrailed silver border; a hall-crowned queen or king wears the leaf circlet; leagues of house-towers triple their charge.

*Kinship:* Sylvan cultures share the engrailed line and silver; Gala keeps its own invected line because its relation to the Sunhot elves is open.

*Cultures:* `forest_council_elves`, `hill_kingdom_elves`, `lake_elves`, `pass_wardens`, `rift_coast_elves`, `gala_court`, `kingdom_forest_elves`, `roost_keepers`, `god_forest_keepers`.

### Sunhot elves (`sun_elves`)

*Status:* culture entries exist. *Line:* rayonny.

*Divisions:* per_fess, per_pale, per_bend, chief, base, per_chevron, pile_reversed, bordure.

*Ornament:* Tall, narrow charges (the Sunhot stand over three metres); no weapons, because no weapon passes a sanctuary door.

*Rank and form:* No Sunhot realm is a kingdom: elders are never called kings. A Speaker's realm is shown by a sanctuary-white field part; the Lands of Light alone may bear the noon-door.

*Kinship:* The rayonny line. Men under Sunhot patronage carry it on a chief only.

*Cultures:* `sunhot_light`, `sunhot_western`, `sunhot_isles`.

### Dwarves (`dwarves`)

*Status:* culture entries exist (wall_delvers, west_delvers, north_delvers): the holds of the Great Wall range, the West Lands and the High Mountains (owner, 24 October 2026: dwarves in the great ranges). *Line:* dovetailed.

*Palette:* hall granite `#55565c` (C); vein gold `#c9a23f` (M); garnet `#7e2430` (C); forge iron `#2f3034` (C); lamp-black `#1c1b1e` (C); beard white `#e2ddd0` (M).

*Divisions:* per_chevron, pile_reversed, chief, base, per_fess, quarterly.

| Charge | Drawn as | Meaning |
| --- | --- | --- |
| `great_axe` | a two-handed great axe | the dwarf's own weapon; never a bow |
| `mattock` | a mattock | the mine and the hall cut from the mountain |
| `braided_beard` | a braided beard bound with three rings | age and standing; a beard is a dwarf's record of years |
| `cut_gem` | a cut gem | the gold and precious stones they mine |
| `hall_door_plain` | a squared hall door in a rock face, unadorned | the hall under the mountain; deliberately plain, with no star, tree or rune |
| `ore_cart` | an ore cart on rails | the deep workings |

*Ornament:* Square-cut, heavy charges; a dovetailed border for the oldest halls.

*Rank and form:* A hall-king wears a squared crown of four flat points; a council of hall-elders shows its charges in a dovetailed chief.

*Kinship:* Dovetailed lines only; no shared tincture with any elven arms (dwarves dislike elves). Dwarf goblins do not use the dovetail while Q-19 leaves open whether they are dwarves.

*Cultures:* `wall_delvers`, `west_delvers`, `north_delvers`.

### Small folk (`small_folk`)

*Status:* culture entry exists (hearth_folk): Dobbum in the West Lands and its kin in Tirlan under Hirolon's ward. *Line:* double_arched.

*Palette:* meadow green `#5f8a45` (C); barley gold `#d6b85a` (M); hearth brown `#6e4a2e` (C); berry red `#9a3a3a` (C); cream `#efe6cc` (M); hedge green `#2f4f2a` (C).

*Divisions:* base, per_fess, plain, chief, flaunches.

| Charge | Drawn as | Meaning |
| --- | --- | --- |
| `clay_pipe` | a long clay pipe | the pipe and the evening bench; a life without danger |
| `beehive` | a straw beehive | orchards, honey and a settled year |
| `guard_hedge` | a thick hedge across the field | the guards who keep evil out of the land |
| `bare_footprint` | a bare footprint | they rarely wear boots |
| `orchard_tree` | a round-crowned apple tree | farming and plenty |
| `milk_churn` | a milk churn | the dairy farm |

*Ornament:* Rounded, homely charges; never a round door (another fiction's mark).

*Rank and form:* No crowns: a moot of families shows its charge on a double-arched base, the hills of home.

*Kinship:* Dobbum and Tirlan share the double-arched line and the hearth-folk palette; Tirlan adds Hirolon's ward border.

*Cultures:* `hearth_folk`.

### Goblins (`goblins`)

*Status:* culture entries exist (goblin_warrens of Burnikit, king_warrens of Burrikkrit, spring_warrens of Glimkit). *Line:* potenty.

*Ornament:* See the goblin_warrens culture.

*Rank and form:* See the goblin_warrens culture.

*Kinship:* Potenty line; a goblin realm with hobgoblin defenders adds the hobgoblin's carried stone as secondary charge.

*Cultures:* `goblin_warrens`, `king_warrens`, `spring_warrens`.

### Hobgoblins (`hobgoblins`)

*Status:* no culture entry of their own: they guard and haul in every warren, and the king of Burrikkrit is a hobgoblin who rules these warrens only (the grown crown is the king_warrens crown). *Line:* potenty (heavier, two notches only).

*Palette:* warren green `#5a6a3a` (C); cave black `#2a2a22` (C); hoard gold `#c8b050` (M); quarry grey `#8a8676` (C); rust `#7e4a2c` (C).

*Divisions:* base, per_fess, pile_reversed, chief.

| Charge | Drawn as | Meaning |
| --- | --- | --- |
| `carried_stone` | a great stone slung on a yoke | the heavy labour of the warren |
| `stone_mallet` | a stone-headed mallet | the defenders' weapon from the cards |
| `grown_crown` | a goblin crown too small for its wearer, set on a mallet | the goblin king is a hobgoblin who simply grew very big |

*Ornament:* Goblin ornament scaled up: fewer, larger shapes.

*Rank and form:* The grown crown of the king_warrens grammar over the goblin charge; otherwise hobgoblins appear only as a secondary charge in goblin arms.

*Kinship:* Always paired with goblin tinctures; never a hobgoblin realm without goblins.

### Dwarf goblins (`dwarf_goblins`)

*Status:* culture entry exists (road_warrens of Mustnom); whether they are dwarves, goblins or their own people is still Q-19. *Line:* bevilled.

*Palette:* pack brown `#6e5338` (C); trader red `#9c4430` (C); purse gold `#cfae4e` (M); road grey `#7c7a70` (C); cave dark `#2c2a26` (C).

*Divisions:* per_bend, per_bend_sinister, per_fess, chief, plain.

| Charge | Drawn as | Meaning |
| --- | --- | --- |
| `travel_pack` | a laden travel pack | they are rarely at home and travel the world for food and goods |
| `gold_bag` | a small tied bag of gold | meat sold for a small bag of gold: the trader's bargain |
| `iron_bar_issued` | an iron bar | the boss gives iron to the smith for axes and swords |
| `road_staff` | a short road-staff | the long walk of the traders |

*Ornament:* Diagonal compositions: everything is on the road.

*Rank and form:* A boss-led cave-realm adds a boss's iron ring around the primary charge; no crowns.

*Kinship:* The bevilled line keeps them apart from both dwarves (dovetailed) and goblins (potenty) until Q-19 is answered.

*Cultures:* `road_warrens`.

### Giants (`giants`)

*Status:* culture entries exist (hill_giants of Hirolon, ice_giants of Nivaros, cairn_giants of Hoorunoron). *Line:* arched.

*Divisions:* base, per_fess, plain, pile_reversed.

*Ornament:* One huge charge filling the flag; giants do not draw small things.

*Rank and form:* A High Chief or Frost-King is shown by the seat or the cairn itself, not by a crown.

*Kinship:* The single arch is shared by every giant realm (the cairn seen from afar).

*Cultures:* `hill_giants`, `ice_giants`, `cairn_giants`.

### Orcs (`orcs`)

*Status:* culture entries exist. *Line:* raguly.

*Divisions:* plain, per_fess, per_bend, per_chevron, pile_reversed, chief, base.

*Ornament:* Hard silhouettes, no fine detail; skulls capped at one per region.

*Rank and form:* A Warking wears a crown of tusks; a hold-chief none; a Free Moot shows its ring.

*Kinship:* Raguly line shared with ogres; goblins keep their own potenty line.

*Cultures:* `volcano_clans`, `iron_clans`, `wild_holds`, `sea_orcs`, `plateau_soldiery`.

### Trolls (`trolls`)

*Status:* culture entry exists (troll_tribes). *Line:* urdy.

*Divisions:* per_fess, base, plain.

*Ornament:* Rough boulder shapes; no metal tinctures except bone.

*Rank and form:* The oldest unbeaten troll is shown by the boulder being the largest charge; no crowns (Q-21 on Smash).

*Kinship:* None declared; ogres resemble trolls in look but are drawn with the orcish line.

*Cultures:* `troll_tribes`.

### Ogres (`ogres`)

*Status:* culture entry exists (ogre_clans), the second people of the moot of The Darks. *Line:* raguly.

*Palette:* hide grey `#6a645a` (C); cave umber `#4a3a2c` (C); bone `#d6cbb0` (M); meat red `#8a3a30` (C); moss `#566040` (C).

*Divisions:* plain, per_fess, base, pile_reversed.

| Charge | Drawn as | Meaning |
| --- | --- | --- |
| `ogre_club` | a great knotted club | the club that kills their prey |
| `thrown_stone` | a large stone in mid-flight | they throw stones at what they hunt |
| `meat_bone` | a meat bone | they eat only meat |
| `cave_mouth_ogre` | a cave mouth in a mountain | caves and mountains |

*Ornament:* Orcish ornament, larger and fewer charges.

*Rank and form:* An ogre band living with orcs takes the host hold's tinctures and its own club as secondary.

*Kinship:* The raguly line marks ogres as kin of the orcs (the card: an ogre is like a giant orc).

*Cultures:* `ogre_clans`.

### Gnomes (`gnomes`)

*Status:* culture entry exists (holt_gnomes of Olodor, under the Stendorler quarries near Parim). *Line:* escartelly.

*Palette:* bark brown `#6a4c34` (C); moss green `#4f7040` (C); gift gold `#d4ae3e` (M); bird red `#b0403a` (C); loam black `#2a2420` (C).

*Divisions:* per_fess, base, plain, flaunches.

| Charge | Drawn as | Meaning |
| --- | --- | --- |
| `tree_door` | a small door in a tree trunk | homes hidden inside trees; civilisations hard to find |
| `gold_pot` | a pot brimming with gold | a gnome is crowned when his pot is full; a gift of gold brings luck |
| `red_bird` | a small red bird | the red birds of the gnome drawing |
| `miner_pick_small` | a small pick | gnome miners dig the gold |

*Ornament:* One hidden detail in each design (the escartelly notch is the door); no rainbows, no clover leaves, no pointed red hats.

*Rank and form:* A village king shows the gold pot crowned; others show it uncrowned.

*Kinship:* None declared; the escartelly line is theirs alone.

*Cultures:* `holt_gnomes`.

### Yeti (`yeti`)

*Status:* culture entries exist (yeti_clans of the shelf, height_yeti of Ghaahu). *Line:* dancetty.

*Divisions:* base, per_chevron, plain.

*Ornament:* Three big peaks; sound is drawn as a cave answering, never as radiating arcs.

*Rank and form:* The clan follows the one whose song carries furthest: no crowns, no seats.

*Kinship:* Old pacts with the ice clans and Nivaros are shown by sharing a snow-white tincture, not a line.

*Cultures:* `yeti_clans`, `height_yeti`.

### Ents (`ents`)

*Status:* culture entry exists (kilinti_ents). *Line:* rooted.

*Divisions:* plain, base, per_fess.

*Ornament:* Every tree is shown with its roots.

*Rank and form:* The Eldest speaks last: no crown; a forest domain is shown by the rooted line.

*Kinship:* The men at the forest edge may add one tincture or charge of their own culture as secondary. The Baelim of the Aenor Forest are not kin and never share a forest with the ents; they draw the gnarled line.

*Cultures:* `kilinti_ents`.

### The dead (`the_dead`)

*Status:* culture entries exist (grave_hosts, zols_dead); the relation between the two realms is open. *Line:* none.

*Divisions:* plain, base.

*Ornament:* No beasts, no plants, no persons. Volgan's realm shows the Gate of Nafeher; Zol's Mistake shows only its emblem leader's sigil, the Will of Zol. Zol's servant never appears.

*Rank and form:* Sworn realms of Volgan carry a grave black base; nothing in any dead realm's arms states who rules for Zol.

*Kinship:* None: the two realms of the dead share no device, because their relation is open.

*Cultures:* `grave_hosts`, `zols_dead`.

### Demons (`demons`)

*Status:* culture entries exist (netherborn of the sworn realms, nether_houses of the Nether, veshazel_court of Veshazel); Afrit's demons are never shown. *Line:* rent.

*Divisions:* per_bend, per_fess, pile, plain.

*Ornament:* Original sigils; a pentagram is allowed in a demon sigil (owner, 24 October 2026), never a cross, an inverted cross or a goat's head in a star.

*Rank and form:* A lord or queen of a pact-realm shows its pact-charge; sworn realms take Volgan's grave base.

*Kinship:* The rent line; devils use the fracted line and are never confused with demons.

*Cultures:* `netherborn`, `nether_houses`, `veshazel_court`.

### Devils (`devils`)

*Status:* no culture entry and no realm; corrupted Lesser Spirits who served an Old God (owner, 24 October 2026); immortality and revival open (Q-07). *Line:* fracted.

*Palette:* brimstone `#c9a83a` (M); lava `#b4401f` (C); cinder `#2a2220` (C); char grey `#5a524c` (C); bone `#d8ccb6` (M).

*Divisions:* per_bend_sinister, pile_reversed, per_fess, plain.

| Charge | Drawn as | Meaning |
| --- | --- | --- |
| `broken_collar` | a broken collar | devils escaped the service of an Old God |
| `ram_horns` | a pair of ram's horns | the ram-horned devil of the cards |
| `lava_tongue` | a tongue of lava | their country of fire |

*Ornament:* The fracted line breaks every partition: a service broken.

*Rank and form:* Devils serving Volgan bear the grave black base; free devils bear nothing over the broken collar. The lava revival rite is not shown until Q-07.

*Kinship:* None with demons (demons are corrupted angels; devils corrupted Lesser Spirits).

### Tree-people (the Baelim) (`tree_people`)

*Status:* culture entry exists (baelim): the walking tree-people of the Aenor Forest, separate from the ents (owner, 24 October 2026). *Line:* gnarled.

*Divisions:* base, plain, per_fess.

*Ornament:* Conifers with their roots shown; no broadleaf tree and no rooted line, which are the ents' marks.

*Rank and form:* No crown: the Eldest speaks for the stand.

*Kinship:* None with the ents: the two tree-peoples never share a forest, and their arms never share a line, a tree or a tincture.

*Cultures:* `baelim`.

### Mycids (`mycids`)

*Status:* culture entry exists (mycid_rings); everything beyond their home in the Mushroom Forest is open in the vault. *Line:* gilled.

*Divisions:* plain, base, per_fess.

*Ornament:* Only the forest and its fungi are drawn; nothing about their rule, speech or faith is invented.

*Rank and form:* Unknown; an enclave orle of the surrounding rift coast.

*Kinship:* None declared.

*Cultures:* `mycid_rings`.
<!-- generated:peoples:end -->

## 6. The country designs

Each record in `heraldry.json` `countries` holds: key and tag (from the roster), name, region, culture (the grammar id after renames) and second culture, people, family, political form, overlord and subject type, the field (division, line, tinctures with hex and source), the primary charge (id, name, meaning, class, source grammar, tincture, count, contrast, fimbriation), the secondary charge, the marks, the meaning in one sentence, the blazon (the image prompt's flag line), a design hash and `provisional: true`; some carry a form note or a canon note.
The tables below give the design in short and its meaning; the blazon in the JSON is the full description.
Every design was written from the realm's history entry (founding, dynasties, events, today) and its dossier row; no realm takes a design of the old roster unchanged without a reason in its story.

<!-- generated:countries:start -->
| Region | Flags | Largest charge classes |
| --- | ---: | --- |
| Middle Lands | 23 | token 6, beast 4, crown 4 |
| North Lands | 12 | token 4, bird 2, sea_creature 2 |
| Cold Lands | 19 | token 7, beast 3, sea_creature 2 |
| West Lands | 14 | token 5, bird 2, landform 2 |
| Dark Lands | 17 | token 5, beast 2, building 2 |
| Ember Lands | 9 | bird 3, building 1, crown 1 |
| Zol's Mistake | 1 | token 1 |
| Magical Lands | 11 | bird 3, body_part 2, tree 2 |
| Lands of the Sun | 10 | landform 2, beast 1, bird 1 |
| East Lands | 18 | beast 4, weapon 3, bird 2 |
| South Lands | 2 | beast 1, token 1 |
| Islands of the South | 8 | token 3, building 2, insect 1 |
| Triton's Islands | 11 | beast 2, sea_creature 2, token 2 |
| All | 155 | |

### Middle Lands

| Tag | Realm | Culture | Design | Meaning |
| --- | --- | --- | --- | --- |
| AEN | Aenor | lake_aenoran | plain, lake blue; five-point lamp-crown in lamp gold | Aen joined the kingdoms under one crown, and the Concord keeps their union. |
| SFT | Safeton | lake_aenoran | plain, deep lake; sturgeon in pale gold [charter border] | The sturgeon of the Safen mouth, the harbour beast of the charter ships. |
| FRE | Freshon | lake_aenoran | plain, slate; kneeling ox in Parim white [charter border] | The drovers' ox that struck the spring: the beast and identity of the realm. |
| PAZ | Pazoma | lake_aenoran | plain, Parim white; sword upright in deep lake [charter border] | The sword of the Peace: the swords sworn on the Peace were beaten into the guild bell, and the sword is the oath the guild keeps. |
| ORH | Orohaf | isle_houses | plain, sea grey; seated woman at the steering-oar in foam white [charter border] | The eldest woman of the Water clan at the steering-oar through the Night of the Sea, the mother of the five houses of the isle. |
| SEL | Selen | selen_ranger | plain, wood green; hollow oak of the Moot Tree in birch white [charter border] | The Moot Tree at the Selenar ford, where the Quiet Law was sworn. |
| KIN | Kingson | vale_folk | per chevron, snowline white and vale slate; a tall vigil flame between two pale points in pass gold [charter border] | The Pass Vigil fire, the watch-families' oldest law, drawn as one flat flame. |
| KLU | Klungori Guard | vale_folk | plain, pass gold; goblin war-helm inverted, set alone on the field with no backing shape in granite [charter border] | The helm taken in the Tunnel Fight and hung on the Accord tower. |
| HIR | Hirolon | hill_giants | plain, Grano green; a single upright tapered standing stone, a flat solid block with straight sides and a flat top in chalk | The first stone of the Eldest Cairn, with the dike's tally-notch. |
| TIR | Tirlan | hearth_folk | base, harvest yellow and basin green; wicker grain-pannier in harvest yellow [ward border] | The first harvest-share basket, the household's identity relic carried to every harvest. |
| KON | Konori | steppe_rider | plain, steppe red; horse's head in black felt [charter border] | The Konori horse: each Hundred's horse-mark and the ford of the Aenar. |
| HNH | Hunhun | steppe_rider | per bend, felt white and steppe red; mare courant in steppe red [host marks, charter border] | The banner-mare of the last battle, running with empty stirrups, the beast of the Horse-Oath. |
| HER | Herez | march_folk | plain, palisade brown; sword upright, pommel down in march ochre [charter border] | The sword of Edran's march, raised by the captain who held the Kalioth road. |
| NOL | Noleksun | march_folk | plain, march ochre; hare courant in chalk white [charter border] | The quick hare of the drained downs, for the eight towns. |
| KIL | Kilinti | kilinti_ents | base, deep grove and bark umber; eldest tree with three root-strands in sap amber [charter border] | The eldest oak whose bough was the ents' answer, the regional tree. |
| FOT | Fotan | strait_folk | plain, chain red; two iron chain-links hooked together in tar black | The Ostvar anchor-chain link hammered into the toll-post, the realm's mark. |
| KUN | Kunhrim | wall_delvers | plain, delving brown; five-point deep-king crown in lamp white [charter border] | The Deep King's crown, drawn with five points so that no battlement shows. |
| BRR | Burrikkrit | king_warrens | plain, deep moss; crown of bent iron in salvage gold | The hobgoblin king's crown of bent iron, which holds the throne by the lantern. |
| OLO | Olodor | holt_gnomes | plain, bird red; five-point crown of pot gold in pot gold [enclave orle] | The crown beaten from the rim of the first king's pot. |
| DNL | Dunelaeth | kingdom_forest_elves | plain, kingdom green; whole beech tree on a mound in old silver | The grave-beech the household keeps: the realm's grave, a whole tree on its mound. |
| ANR | Aenor Forest | baelim | base, dew silver and stand green; gnarled tree of three trunks in deep shade | Graulvoa, the Baelim's regional tree, standing before the sea reached the coast. |
| CUR | Cursed Lands | veiled_folk | plain, veil grey; straight cord hanging down with both ends loose, no knot in char | The Last Cord, hanging with both ends free and unknotted. |
| BLO | Bloody Forest | redbark_tribes | plain, deep bark; raven with spread wings in antler bone | The raven of the Raven clan, one of the three clans of the Redbark raids. |

### North Lands

| Tag | Realm | Culture | Design | Meaning |
| --- | --- | --- | --- | --- |
| LER | Lerendor | leren_sea_kings | plain, strait blue; whale flukes rising from the sea in salt white | The strait-whale's flukes, the Leren's own beast under the Strait Litany. |
| EEK | Eekedor | leren_sea_kings | plain, salt white; curved sword hung on a hook in strait blue | The raider's own sword hung on the weighing hook of 2A 1205. |
| REN | R'en | leren_sea_kings | plain, Leren silver; black cormorant in deep strait | The cormorant, the sign's emblem. |
| KER | Keredor-Hellekton | leren_sea_kings | plain, kelp green; open double torc of two gold bands, linked by a straight bar, with no rings in clasp gold | The double crown, silver above gold, the one crown the two coast halves share. |
| MOO | Molot | free_crowns_north | plain, hearth red; a plain upright square-ended post, a flat solid bar with straight edges and no point in fleece white | The moved stake of Helmund's night, the margraves' own mark. |
| TLV | Tolvael | free_crowns_north | plain, fir green; unsplit pine log with a broken axe-head lying across it, the axes of the envoys that broke on the Kerhil log in peat black | The unsplit pine log of the crowning, the vale's own timber. |
| TOL | Tolhon | free_crowns_north | plain, straw gold; leaping herring in fir green | The herring, the beast of the Herring Peace. |
| HEO | Heodwa Lands | free_crowns_north | plain, fleece white; great horn banded in gold in peat black | The horn of Pand, one horn for one council, with its three bands. |
| HRA | Hrakbrund | north_delvers | pile reversed, high slate and snow white; stair descending from upper right to lower left in snow white | The Coming-Down Stair the dwarves took down to the valley. |
| MIA | Mina | free_crowns_north | plain, earth brown; iron pick with a circlet on its haft in straw gold | The crowned pick of the Mina kings, the tool that buried a king who was crowned on it. |
| DOL | Dolpar | free_crowns_north | plain, hill grey; four-oared boat seen from above in fleece white | The four-oared boat of the Mid-Lake Moot, one of the five ships allowed in Aoaz. |
| MUS | Mustnom | road_warrens | plain, pack brown; magpie in salt white | The magpie of the packmen's roads, the thief-bird that trades and steals on the long road. |

### Cold Lands

| Tag | Realm | Culture | Design | Meaning |
| --- | --- | --- | --- | --- |
| CLD | Coldor | winter_crown | plain, slate grey; curved aurochs horn bound in bronze in frost white | The Ember-Horn bound in bronze, the hearth-law's own relic. |
| MLK | Melkgard | melkgard_warlords | plain, gunmetal; unworn iron crown hung from a hook in storm white | The unworn iron crown hung from its hook, the march's refusal of rule by birth. |
| HOR | Horidor | ice_clans | plain, fjord blue; pole with a streaming rag in soot | The guide-pole with its red rag, the road-wardens' mark on the Neridor Gap. |
| FEA | Fearno | ice_clans | plain, berry red; spear upright in ice | One spear of the Bound Spears, the oath each lord swears to the steadings. |
| AUT | Austklev | ice_clans | plain, soot; spiral whale-tusk upright in snow | The white spiral whale-tusk, the founder's beast of the east coast. |
| WRL | Worlond | ice_clans | plain, lichen green; two firs grown from one trunk in soot | The Twin Firs grown from one trunk, the forest's tree of the parting. |
| HLD | Holdon | ice_clans | per fess, fjord blue and bone; seal lying on the ice in soot | The seal of the seal-grounds that the Hunting Truce divided. |
| GLI | Glimkit | spring_warrens | plain, steam green; running hound in spring white | The bone-hounds that came over the ice with the warrens. |
| XIS | Xison | ice_clans | plain, bone; row of three chain links in berry red | The Akahew Chain, forged from the riders' stirrups. |
| PRT | Pertolor | ice_clans | plain, amber; black-faced ram in snow | The black-faced ram of the Mp'E flock, the vale's beast of the ram's due. |
| OMR | Omar | ice_clans | plain, hide brown; reindeer skull with full antlers in ice | The Refusal Skull, the one skull the Cold Lands carry. |
| POT | Portogalor | ice_clans | plain, ice; hull turned keel-up in soot | The Keel-Hall, the sealers' founding hull, one of the five ships allowed in Aoaz. |
| ORW | Orewele | ice_clans | plain, snow; bog-iron bloom in amber | The bog-iron bloom, the first lump of the sky's iron laid back in the bog. |
| KVI | Kvittumm | reindeer_clans | plain, fell grey; two reindeer bulls facing each other in white hills | The Moot-Fire Herd: two reindeer bulls at one fire, one voice at one moot. |
| NIV | Nivaros | ice_giants | base, deep ice and rime white; stone-headed hammer in frost grey | The Frost-King's maul, the sign's emblem. |
| YEI | Yeti Lands | yeti_clans | plain, hum blue; yeti footprint in yeti white | The Ice-Mark, a yeti footprint: the mark the shelf clans sing this ice for. |
| GHH | Ghaahu | height_yeti | plain, deep rock; inward spiral with notched edges in height white | The Song-Whorl, the height clans' one song, a spiral that waits for each broken turn. |
| VND | Vindael | vindael_seafarers | plain, storm grey; skua feather slanting upward in sail white | The Wind-Feather, the arm's token of the gales its crews survived. |
| PLT | Poloto | vindael_seafarers | plain, gale blue; burned steering oar upright in sail white | The Burned Oar: the Harbour-Master's oar that pushed the Necromancer's ship away. |

### West Lands

| Tag | Realm | Culture | Design | Meaning |
| --- | --- | --- | --- | --- |
| GNW | Gunwyn | gunwyn_clans | plain, clan madder; rook with a barley-ear in lime white | The rook and the barley-ear, the clan song's birds and grain. |
| WER | Werlendor | gunwyn_clans | plain, moor brown; half torc with a jagged end in torc gold | The half torc the Erg claim keeps, the half Dyfan pressed into his younger son's hand. |
| LAB | Lambin | gunwyn_clans | plain, clan green; standing stone in torc gold | The standing stone of the common field above Faennon, where no blood may be shed on sown ground. |
| THN | Thenon | gunwyn_clans | plain, torc gold; an olive tree in fruit in moor brown | The Mother Olive, the eldest grafted tree the kings are acclaimed under. |
| VRN | Varnondor | gunwyn_clans | plain, lime white; hawk in clan green | The hawk of the capes, watching the approaches the clans kept since the Settler Wars. |
| GIR | Girdon | girdon_wardens | plain, river green; five stepping-stones in ford stone | The five stepping-stones of the wardens, each carried from his ford. |
| WEN | Wennarith | girdon_wardens | plain, dark pool; uncut rope in an arc in reed gold | The uncut ferry-rope the wardens swore on. |
| SAO | Saopon | western_guilds | plain, vermilion; leaping carp in ivory | The river carp of the Kulolo, the fish the boatmen followed down to the lagoon. |
| KRA | Kradlon | western_guilds | plain, guild wine; crossbow upright in guild gold | The crossbow the walled settlers fought the clans with for two centuries. |
| CRG | Corogon | western_guilds | plain, guild blue; unbroken lozenge seal-stamp in guild gold | The sealed claim of Oslodon, the letter of claim the merchant houses swore never to open, kept under two locks. |
| BLD | Buldor | buldor_companies | bordure, steel blue and livery red; swallow-tailed pennon in buff [bordure compony] | The white swallow-tailed pennon, seamed by a black stitch, the company's own soul. |
| DOB | Dobbum | hearth_folk | plain, basin green; oblong loaf with a score in loaf cream | The Famine Bread, the basin's loaf that the small folk carried over the passes. |
| BRU | Brundahrim | west_delvers | plain, hold dark; badger in forge red | The badger that digs the deep roads of the dwarves and held the Sea-Door. |
| GRO | Gromkerm | west_delvers | plain, grey stone; gate-bolt drawn back in iron black | The gate-bolt the hold keeps shut for its grudges and opens to a knock. |

### Dark Lands

| Tag | Realm | Culture | Design | Meaning |
| --- | --- | --- | --- | --- |
| GOL | Goldoroth | volcano_clans | plain, lava red; crown of broken blades in bone | The Crown of Broken Blades, beaten from the swords of every chief the Warking broke. |
| DRK | Dark Gate | volcano_clans | plain, ember orange; three chain links in an arc in ash black [yoke border] | The Gate-Chain of Doldes, three arced links that made the pass free. |
| DND | Dondor | dondor_brutes | plain, ember red; open garrison helm with a ridge-crest in iron grey | The garrison helm of Dondor, set on the head of every Brute-King in the crown's place. |
| BLK | Blackton | dondor_brutes | plain, iron grey; high-backed empty seat in bone | The empty seat of the moot, sworn to stay empty so that no master rules. |
| BLN | Belonton | sea_orcs | plain, salt teal; open shackle snapped at one side in salt white | The broken shackle of the rowers, the oath that no sea orc rows for a master again. |
| BOR | Bordon | iron_clans | plain, rust; war-horn with two bands in coal | The horn of the Road-Peace, blown for every caravan in the gorge. |
| DRE | Dreson | iron_clans | plain, iron; three upright piles in coal | The three piles driven at Dolido by the first path-elders. |
| DUL | Dulundur | iron_clans | plain, coal; four flames rising side by side in forge orange | The Four Fires of Lesderle, the four valleys' oath. |
| DAK | The Darks | iron_clans | per pale, coal and iron; spear grounded point down in steel | The grounded spear of the Meat Moot, point down. |
| SKR | Skragdurg | iron_clans | plain, slag green; broad felling axe in steel | Grashdug's axe, the tool that felled the Old Black. |
| BRT | Britadon | iron_clans | plain, steel; running boar in rust | The boar that led the hill clans out of the Hollow. |
| DUN | Dun | wild_holds | plain, hide brown; crown of bone charms in bone | The crown of bone charms of the toll-kings, the crooked ancestor's own crown. |
| WIL | Wild Lands | wild_holds | plain, lucky ochre; bare pole with three streaming strips in peat | The rag-pole of Zudertu, the moor's one rule and the winter's place. |
| TRO | Troll Forest | troll_tribes | plain, bog black; crouched standing-stone troll in bone | The King-Stone, the form the trolls' kings take when they become stone. |
| HOO | Hoorunoron | cairn_giants | plain, giant-forest green; tall stacked cairn in cairn grey [enclave orle] | The Dike-Cairn, the giants' line that holds back the sea. |
| BUN | Burnikit | goblin_warrens | per fess, rust and cave black; flat flame in hoard gold | The Fire at the Door, the one lie that saved the warrens. |
| VES | Veshazel | veshazel_court | plain, ash-hall black; three claw-scores in cinder red | The three claw-scores, the mark of the hall's bounds and of every thrall. |

### Ember Lands

| Tag | Realm | Culture | Design | Meaning |
| --- | --- | --- | --- | --- |
| PUV | Puvulan | grave_hosts | plain, grave black; Gate of Nafeher in bone | The Gate of Nafeher, the canon guard of Puvulan. |
| MIR | Mirolon | mirolon_wardens | plain, night blue; heron standing on one leg in heron white | The heron of the swamp watch. |
| KHO | Khorvrath | netherborn | plain, ash black; curved horn broken off at its tip in ember gold [grave base] | The broken horn of the first lord, the proof that the way back is closed. |
| DLN | Dolon | netherborn | plain, obsidian; crown of salt crystals in ash white | The salt crown of the first queen, the realm's crown and law. |
| NEZ | Nezer | netherborn | plain, nether red; two-oared galley hull in ember gold [grave base] | The two-oared galley, Nezer's canon identity and one of the five ships allowed in Aoaz. |
| NET | Nether | nether_houses | plain, cinder ash; a flat plume of sulphur smoke rising from a low cone of the Nether in sulphur white | The King's seal with its one pentagram, the canon guard. |
| HAL | Halia | ember_freeholds | plain, storm grey; grave-oar upright in tar black | The grave-oar of the freeholders, the league's only speech of the dead. |
| NAN | Nan | ember_freeholds | plain, sand; storm-petrel skimming low in tar black | The petrel, the wayfinders' guide through the Tempest Reach. |
| OLE | Olen | ember_freeholds | plain, salt white; windhover in tar black | The hovering kestrel of the Holy Breeze. |

### Zol's Mistake

| Tag | Realm | Culture | Design | Meaning |
| --- | --- | --- | --- | --- |
| ZOL | Zol's Mistake | zols_dead | plain, void black; straight bar snapped in two, the two ends apart on the field in cold grey | The Will of Zol: broken arcs, open to the north and never closed. |

### Magical Lands

| Tag | Realm | Culture | Design | Meaning |
| --- | --- | --- | --- | --- |
| WOR | Worshipdom | zilin_pilgrims | plain, hostel white; hand offering a round loaf in bread brown | The Worshipdom's canon loaf-hand, the one hand allowed on a banner. |
| MAG | Magical Forest | forest_council_elves | plain, deep wood; fallen bough laid level in mist grey [council border] | The Speaking Bough laid level, the council's direct identity. |
| HRR | Herrodon | hill_kingdom_elves | plain, night slate; white owl with wings raised in elven silver | The Hall-Owl that led the First Queen down into the hollow. |
| ANE | Andos Enda | lake_elves | plain, lake teal; swan in pearl white | The swan of the Water-Court, which sits on open water so that no grove owns the ground. |
| NLR | Nolorim | pass_wardens | plain, pass grey-green; curved war-horn with a split bell in dawn silver | The cracked horn of Ennaton, the warning that came too late. |
| LCC | Lccimio | rift_coast_elves | plain, sea glass; round-headed tree on one trunk in night sea [council border] | The Pledge-Tree grown from the eastern seed. |
| ELD | Eldafaen | rift_coast_elves | plain, night sea; two spear halves laid parallel in quay silver | The broken spears of the road's end, laid parallel and never crossed. |
| YAV | Yavieth | roost_keepers | plain, slope green; shed dragon scale in keeper silver | The First Scale: the dragon itself is never drawn. |
| TES | Teste | teste_valley_folk | chief, vale green and straw; swallow in loam brown [ward border] | The Dusk Swallow of Testebur. |
| LUV | Luv-zhise | quay_folk | plain, narrows teal; half arch broken at its crown in quay ochre | The Western Gate, the arch broken at its crown, where the quay-masters are sworn. |
| MSH | Mushroom Forest | mycid_rings | plain, spore purple; gilled dome in cap cream [enclave orle] | The bale-mark of the mycids, the pale cap rising from its root. |

### Lands of the Sun

| Tag | Realm | Culture | Design | Meaning |
| --- | --- | --- | --- | --- |
| GAA | Gala | gala_court | plain, deep harbour; silver hind in court white | The white hind of the First Rain. |
| LIG | The Lands of Light | sunhot_light | plain, noon gold; tall doorway with the sun standing in it in sanctuary white | The noon-door with the one sun standing in it, the canon guard of the Lands of Light. |
| ELV | Elvana | sunhot_western | plain, sanctuary white; silk-moth with broad wings spread in shade blue | The silk-moth of the cape, the healers' and weavers' thread-beast. |
| IGA | Igara | sunhot_western | plain, sanctuary gold; sun-crane dancing with one leg lifted in deep red | The dancing crane of the Weavers' Judgement. |
| YEN | Yeni Alang | sunhot_western | bordure, shade blue and sanctuary gold; raised wing in sanctuary white | The raised wing of the sighting the Roll of Wings records. |
| TOR | Tor Luni | sunhot_western | bordure, deep red and sanctuary gold; uncut standing stone in sanctuary white | The uncut standing stone: the stones of the high places are not to be cut. |
| IHU | Ihuy | sunhot_isles | plain, isle gold; cone with a rising ash plume in deep lagoon | The cone of Hol with its ash plume, the council's own mountain. |
| SOY | Soyano | sunhot_isles | plain, isle teal; bare curved keel with stem and stern posts in terrace white | The Mother-Keel of Ileslia, from which every keel is measured, one of the five ships allowed in Aoaz. |
| GOO | Goodin | goodin_sunfolk | plain, shade green; spear reversed with its point on the ground in sun yellow [patron chief] | The guests' reversed spear, the sign of guest-right. |
| GOF | God Forest | god_forest_keepers | plain, god-wood green; winged seed with one long curved wing in glade gold | The Keepers' winged seed, their only word and the sign of the wood. |

### East Lands

| Tag | Realm | Culture | Design | Meaning |
| --- | --- | --- | --- | --- |
| NRS | Noris | noris_riders | plain, deep indigo; lance with a gourd hung beneath the blade in silver | The gourd-lance, the Khadi's standard and the Well-Oath's gourd. |
| NAA | Naamis | naamis_sea_crown | plain, naam blue; double-prowed ship without mast or sail in harbour gold | The Returning Ship that rows out each year and comes back, one of the five ships allowed in Aoaz. |
| WOQ | Woqood | woqood_sealers | plain, seal water; harpoon upright with a barbed toggle head in whalebone | The harpoon laid on the ice to treat with strangers, the moot's own. |
| ORA | Orato | orato_fishers | plain, dark water; gull on the watch in net white | The gull of the heights, the watch kept on every headland through the Breaking, blown to call the boats home. |
| STA | Stabilo | caravan_princes | plain, caravan red; crouching ox in bronze | The King's Measure, the bench's bronze ox, the weight of the old road. |
| DRA | Drak | caravan_princes | plain, ink; open iron collar broken at its hinge in bronze | The open collar broken at its hinge, the forge houses' mark of the broken yoke. |
| MOS | Mostok | caravan_princes | plain, colonnade stone; sheathed sword with a cord bound round the scabbard, no crossguard in bronze | The tied blade, the scabbard bound by a white cord that is never cut. |
| AZA | Azano | caravan_princes | plain, seal wax; tortoise in bronze | The tortoise of the paymasters' creed: every debt is real until it is paid, and a debt outlives the debtor. |
| OBM | Obmi | caravan_princes | plain, linen; hornbill with a great curved casque in ink | The hornbill, the cutters' bird of the high ground that led the town upslope. |
| PON | Pornivior | caravan_princes | plain, bronze; cone-shaped mountain with three smoke-curls in ink | The Smoking Teeth, the mountain the tithe is paid to. |
| ALR | Alerhia | river_kings | plain, river gold; stair of five steps with a narrow crown in lapis [river bendlet] | The stair and its crown, raised above the flood as the king's own. |
| ERC | Erco | river_kings | plain, flood silt; walled diadem of seven points in lapis [river bendlet] | The walled diadem of seven points, the crown of the mine-lords who rule nobody. |
| PLO | Plutondo | river_kings | plain, river blue; salamander of the vents in linen white [river bendlet] | The salamander of the vents, the breath of whatever sleeps beneath the East. |
| DLB | Delbiz | river_kings | plain, reed green; horse's head in lapis [river bendlet] | The horse's head, the oath-capital cut from Qadurum. |
| OST | Ostoroth | lake_road_cities | plain, deep water; highland conifer in quay white | The conifer of the highland clans, carried west to roof the halls of the march. |
| MOA | Mora | lake_road_cities | plain, rush green; steam-eel rising in an S-curve in quay white | The steam-eel, the one fish that lives in the hottest water and kept the shore alive. |
| KRS | Kersian | lake_road_cities | plain, lake silver-blue; leaping trout of the Vale rivers in quay white | The trout of the Vale rivers, the water the exiles carried out and poured into the cistern, sworn to be carried home. |
| RHA | Rhachia | red_lands_tribunes | plain, slip white; seated armless clay mother-figure in red clay | The eldest clay mother, the relic carried through the villages each spring. |

### South Lands

| Tag | Realm | Culture | Design | Meaning |
| --- | --- | --- | --- | --- |
| MIE | Miaed | miaed_pass_lords | plain, pass ochre; ibex with long horns swept back in night pass | The ibex, the gorge-mother's beast and the way through the Hardtmuth. |
| WAH | Wahatud | wahatud_oasis_folk | plain, oasis green; single long feather upright in dune | The long feather the Well-Moot was sworn over, the league's direct identity relic. |

### Islands of the South

| Tag | Realm | Culture | Design | Meaning |
| --- | --- | --- | --- | --- |
| ENH | Enhis Is Rond | southern_islanders | plain, coral sand; cord hung down to a stone weight in deep reef | The diving cord the Priest-Elder carries down to the drowned shrine. |
| HWN | Howan | southern_islanders | plain, coral red; saddle-backed roof with upswept ends in coral sand | The upswept roof of the house for the shipwrecked, with straight-cut ends. |
| VER | Verde | southern_islanders | plain, deep reef; mangrove tree on arched stilt-roots in frond green | The mangrove, the first tree the clans asked and the realm's own tree. |
| NAR | Nara | southern_islanders | per fess, coral sand and deep reef; quenched torch in coral sand | The quenched torch of the Day Rule oath, lit by no flame. |
| YON | Yongyong | southern_islanders | plain, lagoon turquoise; spider in coral sand | The weaver's spider: all the villages are the children of one weaver, Yong. |
| KAM | Kamu Lamo | southern_islanders | plain, frond green; three stacked waves in coral sand | Three waves carved below the first hands, every dead person counted as one wave. |
| KEA | Kea | southern_islanders | plain, lava black; three stepped terraces on a rising slope in coral sand | The divider of the Tuwang cisterns: one stream dividing into two parallel channels. |
| SDE | Sidea | southern_islanders | per pale, coral red and lagoon turquoise; upright slit-drum in deep reef | The drum of Yumbo, the islets' summons and their voice. |

### Triton's Islands

| Tag | Realm | Culture | Design | Meaning |
| --- | --- | --- | --- | --- |
| ADE | Adel | chart_islanders | plain, chart paper; a sounding lead on its line in chart teal | The sounding lead, the chart-houses' oath that nothing is named until the lead has proved it. |
| RAE | Raerby | chart_islanders | plain, ink; fish cut in two in chart paper | The cut fish, the banks-court's first fish, cut in two before both crews. |
| PLL | Pollos | chart_islanders | plain, chart teal; hound of the strong-room in sand gold | The hound of the strong-room that guards the league's money. |
| FNG | Fineger | chart_islanders | plain, reef coral; ram's head with heavy curled horns in chart paper | The ram of the first crossing to the Kile Islands, the pilots' own sign. |
| HLN | Halenor | chart_islanders | per bend, sand gold and ink; brazier on tall legs with a flat flame in ink | The brazier of the wreck-lords on its tall legs, the choice of whether the shore is lit. |
| SEI | Seite Islands | chart_islanders | plain, shallows; seal with its head raised in chart teal | The seal, the reef-spirits' messenger that spared the first pilots. |
| LEN | The Lens | chart_islanders | plain, sand gold; gannet in ink | The one lamp of the Keepers' oath, blown in one breath at Lighon. |
| NND | Nondondor | corsair_lords | plain, corsair black; crown twisted from an anchor cable in ransom gold | The cable crown twisted from Kusion's anchor rope. |
| WND | Windy Lands | corsair_lords | plain, blood red; diamond-shaped kite with one tail in corsair black | The fishing kite of the capes, flown by the four cape-lords in every gale. |
| SNT | Santon | corsair_lords | plain, sea ink; black sword upright in blood red | The black sword of the captaincy, the mark of the captains who came in under black sails. |
| BEN | Benan | corsair_lords | plain, rust; hermit crab in a spiral shell in bone | The crab in a borrowed shell, Urai the Lame's saying and the haven's sign. |
<!-- generated:countries:end -->

## 7. Dynamic tags

The 75 dynamic tags D01 to D75 serve every civil war, released realm and formed realm in the game.
They are a shared pool, so a file named D07.tga cannot know whose breakaway it will carry.

- Dynamic tags D01 to D75 are a shared pool (zz_zin_dynamic_countries.txt, dynamic_tags = yes); the installed game ships no flag file for them.
- start_civil_war and create_dynamic_country both run an effect block on the new country (effects_documentation.md), so every creation site can set_cosmetic_tag there.
- A dynamic country keeps original_tag = its parent; ZIN ships no ideology flag variants (asset manifest section 6), so without a cosmetic tag a breakaway would show its parent's flag or the D-tag fallback (probe AP5).

**The rule.** Every script that creates a dynamic country sets a cosmetic tag in the same effect block. A story creation uses its named cosmetic tag (story list). Any other creation uses zin_dyn_<PARENT>_<kind> whose design is derived from the parent record and its culture grammar by the algorithm below. The D-tag base files are a fallback the build forbids reaching.
`dynamic.parent_index` in the JSON maps every roster tag to its realm key, grammar and design hash, so a derivation always starts from the current record.

### 7.1 Breakaway

*When:* A civil war breakaway (start_civil_war) or a rebel realm splitting from a parent.

1. Start from the parent's record.
2. Counterchange the field: swap the order of the two field tinctures; a plain field takes the primary charge's tincture and the charge takes the field's.
3. Keep the primary charge: the breakaway claims the same realm. Drop the secondary charge.
4. Add the culture's breakaway mark (difference.breakaway_mark): a border in the culture's line, tinctured with difference.dissent_tincture. A Concord dominion instead shows the charter border broken open at the top; a Free Crown shows its crown torn from the beast; a realm sworn to the Dominion keeps the grave base, which it cannot break.
5. Keep the family mark (Aen's label, the family line). Never add or remove a people mark.
6. Apply the ideology overlay of the breakaway's ruling ideology.
7. Re-run contrast, palette and near-duplicate checks; the derived flag must be at least 10 of 64 from its parent.

### 7.2 Released

*When:* A land given its own realm (create_dynamic_country for a people or province with no tag of its own).

1. Take the grammar of the released land's majority culture, not the releaser's.
2. Division: the first entry of the culture's divisions list whose (division, field tinctures) signature is unused in the region.
3. Field: the first pair of culture tinctures (one metal, one colour) unused with that division in the region.
4. Primary charge: the first culture charge not used as a primary charge in the region.
5. Secondary charge: the culture's restoration charge (difference.restoration_charge), small in base: the realm restored.
6. If the releaser keeps it as a subject, add the releaser's subject mark (charter border of Aenor, grave base of the Dominion, the Iron Yoke of Goldoroth, the ward border of Hirolon or Herrodon, or for any other releaser its dissent tincture as a narrow border).

### 7.3 Formed

*When:* A union of two or more founders (a formable that is created as a dynamic country).

1. Impale: divide per pale in the family line of the senior founder; the hoist half carries the senior founder's first field tincture and primary charge, the fly half the junior founder's.
2. With three or more founders, the fly half is the senior culture's darkest colour charged with the junior founders' primary charges small, two above one.
3. If the formed realm is a kingdom, the senior culture's crown is placed over the line of impalement.
4. Never quarter more than four pieces and never tierce in three equal upright bands (a real-world tricolour).

### 7.4 Ideology overlay

Heraldry belongs to the realm, not to a party: a country's base flag does not change with its government, and ZIN ships no ideology variants.
The overlay applies only to a derived breakaway, so that two sides of a civil war never share a flag.

| Engine ideology | ZIN name | Overlay |
| --- | --- | --- |
| democratic | Light | The metal part of the field becomes the culture's lightest metal; no crown is added. |
| fascism | Dominion | The culture's crown is added over the charge; a culture without a crown uses a plain circlet in its lightest metal. |
| communism | Shadow | The colour part of the field becomes the culture's darkest tincture and the charge its palest; nothing else changes (no new symbols of the dark powers on a mortal realm). |
| neutrality | Wild | Any crown is removed; the counterchanged field stands alone. |

**Worked example.** Gunwyn (per pale indented clan madder and clan green, the Oath-Ring in torc gold under the torc-crown) breaks apart in a Dominion rising: the breakaway is per pale indented clan green and clan madder (counterchanged), the Oath-Ring kept, a border indented of moor brown added (its breakaway mark), and the torc-crown kept because the overlay is Dominion.
Under a Wild rising the torc-crown would be dropped and the border alone would mark it.

### 7.5 Story cosmetic tags

Scripted outcomes with names of their own get designed flags, gated by the story flag that creates them.
Their parents are the new roster tags (AEN, SEL, WOR, GOL); the Aenor flags follow Aenor's bell, because the old bowl-lamp is the arms of Lumae, and the Ashen Throne no longer shows ash.
A story flag of the same realm as its parent (the restored Aenor, Great Goldoroth) is a declared sibling and must stay at a distance of at least 1 from its parent; every other pair keeps the distance of 3.

<!-- generated:story:start -->
| Cosmetic tag | Name | Parent | Gate | Design | Meaning |
| --- | --- | --- | --- | --- | --- |
| `zin_cosmetic_aenor_golden_court` | The Golden Court | AEN | Aenor succession war, court camp (aenor_court_and_succession section 7) | A field divided across, lamp gold above and lake blue below, by a straight line. A great bell in deep lake, outlined in Parim white, large in the centre, under a circlet of five flame-shaped points in deep lake. A plain narrow border of bell bronze. | The court's gold laid over the realm's blue, with Aenor's bell darkened and a bronze border of difference: the party of the gilded halls that sells offices and still claims the crown. |
| `zin_cosmetic_aenor_faithful` | Aenor of the Faithful | AEN | Aenor succession war, Faithful camp, before zin_afrit_revealed | A field of Parim white with a base of lake blue edged by a straight line. A round loaf in lamp gold, outlined in deep lake, large in the centre; a great bell in bell bronze, small, beneath it. A plain narrow border of slate. | The loaf of the Houses of the First Light's public charity above Aenor's bell: the camp that puts the faith before the crown. Nothing on it shows who leads the faith. |
| `zin_cosmetic_aenor_ashen` | The Ashen Throne | AEN | zin_afrit_revealed | A field divided diagonally from the upper hoist corner, slate above and deep lake below, by a straight line. A great bell in Parim white with a crack running down its side, large in the centre, under a circlet of five flame-shaped points in lamp gold. | After the reveal Aenor's bell is cracked: the Concord of Aen's kingdoms broken under a throne it did not choose. The arms say nothing of the power behind the throne. |
| `zin_cosmetic_aenor_strangers_host` | The Stranger's Host | AEN | Aenor succession war, host camp, before zin_eindil_named | A field divided diagonally from the upper hoist corner, Parim white above and lake blue below, by a straight line. A wayfarer's staff bendwise in bell bronze with a small shuttered lantern in lamp gold hung from its head. | A traveller's staff carrying a lantern: the host gathered by a stranger from the north whose name is not yet known; nothing shows his blood. |
| `zin_host_of_eindil` | The Host of Eindil | host realm (SEL, Selen, in the historical path) | zin_eindil_named | A plain field of lake blue. Across the upper half a broad label of three square points in Parim white, large. Beneath it a wayfarer's staff in bell bronze with a small shuttered lantern in lamp gold, upright. | The label, every Ainic realm's small mark of descent, becomes the whole charge: the host of the son of Ein, son of Aen, whose claim is the line itself; uncrowned until the realm crowns him. |
| `zin_cosmetic_aenor_free_dominions` | The Free Dominions | the dominions of the Concord (formed) | Aenor succession war, Free Dominions | A plain field of lake blue. In chief a narrow label of three short square points in lamp gold. A closed book with clasps in Parim white, large in the centre. A plain narrow border of lamp gold, broken open at the top. | The Charters of Parim held by the dominions themselves: the charter border broken open at the top where the crown once sealed it, and no crown. |
| `zin_cosmetic_aenor_restored` | Aenor (the crowned heir of Aen) | AEN | zin_eindil_crowned | A plain field of lake blue. A great bell in lamp gold, large in the centre, under an ancient plain circlet of pale gold set with one white stone. | Aenor's own arms under the ancient crown of Aen instead of the lamp-crown: the realm restored to the line it was founded by. Glo and the blue sword are not shown (reserved charges). |
| `zin_cosmetic_worshipdom_east` | The Dominion of the East | WOR | zin_afrit_king_of_east | A field of hostel white with a chief of pilgrim gold edged by a straight line. A hand from the base offering a round loaf in bread brown, large, under a tall plain crown of bread brown; beside it a pilgrim's staff in sky blue, small. | The pilgrims' charity crowned: the realm proclaimed a kingdom of the East. The arms still show only the public faith and nothing of what leads it. |
| `zin_cosmetic_goldoroth_great` | Great Goldoroth | GOL | zin_goldoroth_one_kingdom | A plain field of ash black. A fire-mountain with a plume of flame in ember orange within a ring of upright stakes in ash grey, large in the centre, under a circlet of upturned tusks in bone. | The Fire-Mountain inside one challenge ring: every hold that bent to the Warking now stands in his ring. |
<!-- generated:story:end -->

### 7.6 Fallback flags D01 to D75

The build check fails any `start_civil_war` or `create_dynamic_country` block that does not set a cosmetic tag, so the D-tag base files should never be seen.
They still exist in three sizes (AC9 of the asset manifest), drawn from a neutral grammar, "the unsettled banners": a palette of undyed linen, smoke grey, dun, faded red, faded blue and soot, straight lines, and five charges that say a realm is not yet settled (a plain ring for an oath not yet sealed, a bare stake for a claim, a broken rod of office, an unlit torch, an empty bowl).
Each of the 75 combines one of 15 divisions, one charge and one tincture pair, all different; the list is `dynamic.fallback`, and the build checks that every tag D01 to D75 has exactly one and that none repeats another.
They name no realm, so the roster redesign changes none of them.

## 8. Production pipeline

### 8.1 From record to job

`tools/content/art/flag-jobs.mjs` is rewritten (by the art module owner; this spec does not edit it) to read `heraldry.json` instead of its motif lists.
For every tag, cosmetic tag and dynamic fallback it takes the record's `blazon` as the flag's line in the prompt; it never adds words of its own to a flag line.
Sheets are filled in the order family, culture, region, tag, so one sheet carries one family's grammar; a sheet never mixes the dead or demons with living cultures.
A sheet is 4 columns by 3 rows (12 flags) on a 1536x1024 canvas of #000000, flags at an aspect of 41:26 (82x52), gutters of at least 24 pixels.
Twelve flags per sheet instead of sixteen gives each flag about 350x220 pixels of the roughly 1.57 megapixels the model returns (decision A1), which is what heraldic detail needs.
The 156 roster flags take 13 sheets, the 9 story flags one sheet and the 75 fallbacks 7 sheets (`pipeline.sheets_needed`).

### 8.2 The prompt template

The template carries the art frame rules of decision A4 word for word.

```text
A flat asset sheet of {n} distinct heraldic flags for a medieval-fantasy strategy game, arranged in an exact {cols} columns by {rows} rows grid. The background is solid flat pure black (#000000) everywhere between and around the flags: no glow, no blur, no gradient, no texture. Every flag is a perfectly flat, front-facing rectangle with an aspect ratio of 41 to 26, all the same size, evenly spaced with identical black gutters; no perspective, no waving, no folds, no shadows, no frames, no poles. Painted heraldic style: flat tinctures exactly as named, bold silhouettes with a thin dark outline, a faint woven-cloth texture inside each flag, no gradients, no fine detail smaller than one fortieth of the flag's height. No lettering, no letters, numbers or runes anywhere; no signature or maker's mark; corners and bottom edge hold only plain ground; no real-world religious symbol; no real national flag or coat of arms; no crosses, stars, crescents or eagles; no masonry or battlements. {family_style}
{rows_text}
```

`{family_style}` is: Family style: {family.mark_text}. Shared palette of this sheet: {palette names}.
`{rows_text}` is one line per row: Row {r}, left to right: {k}. {blazon} ...

Example row (the first three Lake Aenoran records):

```text
Row 1, left to right: 1. A plain field of lake blue. A great bell in lamp gold, large in the centre. Above the charge a circlet of five flame-shaped points in lamp gold. 2. A field of Parim white with a base (a band across the bottom, two sevenths of the height) of lake blue edged by a straight line. In chief a narrow label of three short square points in deep lake. A lake barge with a square sail in bell bronze, large, standing on the base. A plain narrow border of lamp gold. 3. A field of lake blue with a chief (a band across the top, two sevenths of the height) of pale gold edged by a straight line. In chief a narrow label of three short square points in deep lake. A sheaf of barley in Parim white, large in the field below the chief. A hanging gold seal on a cord in lamp gold, small, beneath it. A plain narrow border of lamp gold.
```

The Nether's sheet needs one word of care: the prompt frame says "no stars", and the King's seal is described as "a five-pointed figure drawn in one unbroken line inside a ring of flame", which the reviewer checks by eye; the demons' sheet never carries a living culture.
After the first accepted sheet, the job passes that sheet as a layout-only reference ("copy its black background, grid, flag size and spacing exactly; copy none of its designs").

### 8.3 Slicing

1. Find the 12 flag rectangles by the black-gutter layout check (existing flag-jobs check: expected count, columns, rows, aspect 1.4 to 1.75).
2. Inset each rectangle by 2 percent on every side to drop edge fringe.
3. Large: Lanczos-3 resize to 82x52.
4. Medium: Lanczos-3 resize of the inset source to 41x26.
5. Small: box-filter (area) downscale of the inset source to 10x7; this squeezes the 41:26 artwork horizontally as the game's own small flags do.
6. Write uncompressed 32-bit TGA, bottom-left origin, alpha 255, descriptor as measured (0x08 large and medium, 0x00 small).
7. No recolouring, palette snapping or redrawing: if a size fails a check, the sheet is regenerated.

### 8.4 Files

`gfx/flags/<TAG>.tga`, `gfx/flags/medium/<TAG>.tga` and `gfx/flags/small/<TAG>.tga` for every roster tag, every dynamic tag D01 to D75 and every cosmetic tag; no feature folders (asset skill rule).
The source sheets stay in `art/source/flags/`, each generation is a line in `art/source/provenance.jsonl`, and the module writes `art/source/flags_manifest.json` (decision A8).

### 8.5 Build checks

The record-level checks run in the generator on every build and in its test; the image-level checks run when the sheets exist.

| Check | Level | Rule |
| --- | --- | --- |
| Coverage | record | every realm of `roster.json` has exactly one design, under its key and tag; no design without a realm; no tag twice |
| Coverage | image | every tag in common/country_tags (156 roster tags and D01-D75) and every cosmetic tag in common/countries/cosmetic.txt has gfx/flags/<TAG>.tga, medium/<TAG>.tga and small/<TAG>.tga; no flag file without a tag |
| Grammars | record | every culture of `cultures_new.json` and every renamed id has a grammar; charge ids unique across all grammars; every palette has a metal and a colour (the void palette of Zol's Mistake is exempt, with its reason); classes follow luminance; dissent tincture and restoration charge exist; no dwarven tincture is an elven tincture; the Baelim share no line or tincture with the ents |
| Palette within the culture | record | every tincture of a record is in its culture's palette, or one declared borrowing of a kin culture, or an overlord or enclave mark |
| Palette within the culture | image | k-means on the 82x52 image with k = declared tinctures + 1; every cluster above 6 percent of pixels lies within Delta E 2000 of 12 of a declared tincture of the record |
| Grammar fit | record | division and line from the culture's grammar; a plain field takes one tincture and a divided field two different ones |
| Contrast | record | primary charge against each field tincture it overlaps: luminance ratio at least 2.2, or fimbriated; never below 1.6 on a single tincture; a secondary charge at least 1.6 |
| Element budget | record | marks plus charges at most 4 (5 is a hard failure) |
| Marks of form | record | every dominion of Aenor has the charter border and nothing else has it; every realm sworn to the Dominion has the grave base and nothing else has it; every subject has its overlord's mark and no sovereign realm has one (Hirolon); Tirlan has Hirolon's ward; every kingdom of a crowned culture wears the crown and nothing else does; a theocracy wears no crown or label, has a metal in its field and no beast; a confederation or league triples its charge or states why; an enclave has its orle; every Ainic realm but Aenor and the theocracies bears the label |
| Repeated primary charge | record | at most 1 per culture and 2 per region; the cliché register of 1.4 on top |
| Charge class share | record | at most 40 percent of a region of 10 or more flags |
| Small-flag signature | record | (division, field tinctures) unique within a region; the mean Delta E 2000 of an approximate 3x2 small-flag grid (field by division, the primary charge over the centre) between any two flags of a region at least 6 |
| Small-flag signature | image | at 10x7 the mean Delta E 2000 between any two flags of a region at least 10 |
| No duplicate designs | record | design_hash (division, line, field tinctures, primary charge and tincture, count, secondary charge and tincture, marks with tinctures) unique across all records |
| Near-duplicates | record | distance over division (3, or 1 for the line alone), each field tincture (1.5, scaled by Delta E 2000 over 25), the primary charge (4 for another class, 3 for another charge of the class), its tincture (1, scaled), the count (1), the secondary charge (2) and each mark (0.5); every pair of country designs, and every story design against every country, at least 3 apart; a declared sibling story flag at least 1 from its parent |
| Near-duplicates | image | 64-bit difference hash (grey 9x8) and 64-bit average hash; distance = larger Hamming distance; ZIN flags at least 10 of 64 apart (declared sibling sets 6), as in the asset manifest; 3x2 mean colour grid; a pair closer than 10 hashes is also compared by grid, mean Delta E 2000 under 18 fails |
| Real-world look-alikes | image | every flag at least 12 of 64 from every flag of the installed game, computed at build time, read-only, from every flag of the installed game gfx/flags (a corpus of real national flags of the 1930s); nothing is copied or stored |
| Forbidden vocabulary | record | blazons and charge drawings are scanned for the regional clichés, the real-world flags and arms, the real religious symbols, other fiction, lettering and the owner's emblem; meanings and grammar prose for the retired names, Zol's servant and the wider world (grammar prose that states a prohibition is not read as the motif); structural rules for a plain disc or lozenge on a plain field and a frame on gyronny |
| Forbidden vocabulary | image | the generated large sheet gets an OCR pass that must find no glyphs |
| Canon gates | record | no god's name in any record and no god's device in any charge drawing; no named person drawn; the Afrit deny-list on the Worshipdom and Aenor public arms and on the public story flags; the Will of Zol alone on Zol's Mistake and nowhere else; the Gate of Nafeher only on Puvulan; the pentagram only in a demon sigil and once; reserved charges never; no tower or wall word on a realm of the Great Wall range |
| Dynamic tags | record | nine story flags with roster parents (no old debug tag); 75 fallback designs D01 to D75, none repeated |
| Provenance | image | each sheet has one line in art/source/provenance.jsonl (id, prompt, prompt sha256, record design_hash list, reference images, output, output sha256, review); each flag file has a line in art/source/flags_manifest.json (source sheet, cell, crop box, operations, output sha256) |

Every rule has at least one negative test in `build_heraldry.test.mjs`: a copy of the data broken in that one way, which the check must reject.
The results of the last build:

<!-- generated:checks:start -->
| Check group | Findings |
| --- | ---: |
| coverage | 0 |
| grammars | 0 |
| records | 0 |
| forms | 0 |
| distinctness | 0 |
| caps | 0 |
| forbidden | 0 |
| dynamic | 0 |

The closest pair of designs is konori and delbiz at a distance of 3.38 (minimum 3).
<!-- generated:checks:end -->

## 9. What the rejected flags did wrong

The first sheets (`art/source/flags/flags-sheet-01.png` to `-20.png`) show why the method changed:

- a crowned Tudor-type rose, displayed eagles, a lion rampant on a blue and white triband, Nordic crosses with a crown and a ring of stars, a hammer on a field per saltire (real-world flags and arms, and a saltire close to the emblem of the owner);
- palm trees, a scimitar, a genie lamp, a jackal and a scorpion in the East (sheet 12), and motif lists in the job code that gave every Dark Lands realm a skull, spider, bat or fanged maw and every Cold Lands realm peaks, crystals or a frost star (regional clichés);
- a white running horse on red and grey (the horse-lords of another fiction);
- divisions and tinctures picked at random from the ideology, so two neighbours of one people looked unrelated and two strangers looked alike.

None of these can be produced by the new records, and the checks of 8.5 reject them if the image model draws them anyway.

## 10. Decisions of this revision

These are proposals made while writing the designs for the new roster; each is reversible by a table edit in the generator.

1. **Aenor's charge.** The old bowl-lamp reproduces the arms of Lumae of the twelve ("a lit lamp with one flame"), and the owner rule forbids a named god on a national flag, so Aenor bears the great bell of the Concord (the change-bells of the chartered towns and the bell-signalled formations of Aen's joined kingdoms) under the lamp-crown. The story flags of Aenor follow the bell, and Pazoma, which casts the bells, bears its glass and its quill instead.
2. **Lamps and anvils.** Every lamp with an open flame is off the national arms (the Worshipdom's hostel lamp became the pilgrim's staff, Mirolon's southern lamp was dropped, Glimkit's lamp became a snare); enclosed lanterns remain. No anvil appears (Irumas), so Kunhrim shows its rock-cut Western Gate.
3. **Culture cards overruled by the register.** The round door of Dobbum, the palms of Wahatud, the trident of the Nether, the red cap of Olodor, the crowned tree of Dunelaeth, the sun of the God Forest, the gate-tower of Kingson, the gold anvil of Kunhrim and the black sail of Orato are not drawn; each grammar records what replaces it.
4. **The Iron Charter.** Kunhrim's card asks for a narrow blue border for the Iron Charter; the arms carry the Concord's lamp-gold charter border like every other dominion, so the thirteen dominions read as one Concord.
5. **The pentagram.** The owner allows it in a demon sigil; it is used once, for the King of Demons' seal on the Nether, and the build forbids a second one and any outside the demons.
6. **The Ashen Throne.** The story flag after `zin_afrit_revealed` keeps its cosmetic tag but shows Aenor's bell cracked, with no ash or flame, because Afrit's true nature never appears on public arms; the record's name is "The Ashen Throne".
7. **Mark tinctures of protectors.** Hirolon's ward over Tirlan is a narrow border of cairn brown, Herrodon's over Teste a narrow border engrailed of night slate, Goldoroth's Iron Yoke over the Dark Gate a narrow border raguly of ash grey.
8. **Enclave orles.** Olodor's orle is Aenor's lake blue (the holts lie within a day's walk of Parim), Hoorunoron's is Dondor's iron grey (the Giant Forest by the lower Giant River), and the Mushroom Forest's is the rift coast's teal (Lccimio's shore).
9. **New lines.** The Baelim draw a gnarled line, the mycids a gilled line and the God Forest Keepers a wattled line, so none of them answers a question of kinship the vault leaves open.

## 11. Open questions for the owner

1. **Aen's label.** The label marks every Ainic realm of men as a younger branch of the kingdoms Aen joined. Is it right for the Leren, the Free Crowns, Dondor, Mirolon, Fotan, Teste and the Ember Lands freeholds, or only for the Aenoran-speaking realms of the Middle Lands? *Proceeds on:* all Ainic realms of men.
2. **Glo and Horos's blue sword as charges.** They are reserved: no flag uses them. May a story flag (Eindil's crowned Aenor, the Host after `zin_eindil_bearer_of_glo`) show them, and in what form? *Proceeds on:* never; the crowned Aenor uses the ancient crown of Aen instead.
3. **Zol's Mistake.** Its flag repeats the sigil of its emblem leader, The Will of Zol. Accept, or should the realm's arms differ from the leader's emblem? *Proceeds on:* the same sigil.
4. **The gods' devices.** The twelve gods' arms in `pantheon.json` keep their devices off national flags (Aenor's bell instead of the lamp). Should a temple-state or a story flag ever show a god's device, for example a faith's own banner? *Proceeds on:* never on a realm's flag.
5. **The Dominion of the East.** After `zin_afrit_king_of_east` the arms stay faith-only (the loaf crowned). *Proceeds on:* yes.
6. **Gunwyn and real-world Scotland.** The world bible gives the Gunwyn clans plaid, kilts and torcs. The arms avoid tartan, thistle and heather as real-world marks and show clans as two colours per pale. Accept? *Proceeds on:* yes.
7. **The mycids.** Their arms are a ring of pale caps on spore purple inside an orle of the rift coast, drawn only from what the vault knows. *Proceeds on:* proposed until the owner rules on the mycids.
8. **The God Forest Keepers.** Their kin is open (Sunhot, Gala or their own); the arms draw a line of their own and no sun. *Proceeds on:* the wattled line.

## 12. Acceptance (A-92)

1. `heraldry.json` has a grammar for every culture of `cultures.json` and `cultures_new.json` and every people of the roster, and exactly one record for every realm of `roster.json`, every dynamic tag and every cosmetic tag; the record-level checks of 8.5 pass with zero findings (`node tools/content/heraldry/build_heraldry.mjs`), and `node --test tools/content/heraldry/build_heraldry.test.mjs` passes.
2. The rewritten flag jobs produce sheets whose prompts are the records' blazons inside the template of 8.2; every sheet is reviewed by eye against its records (the reviewer's note goes to the provenance line).
3. The image-level checks of 8.5 pass: palette fit, near-duplicates, real-world look-alikes, OCR, headers and coverage in three sizes.
4. In the isolated Linux run, the country selection, diplomacy and map show the new flags at all three sizes, a scripted civil war shows its derived cosmetic flag, and no D-tag fallback appears.
5. When the roster changes, the generator's design table gets a row for every new realm from its culture or people grammar, and the checks still pass.

## K68 per-realm hem and mark overrides (31 October 2026)

The lead ruled that a realm's hem may differ from its culture's hem, and that one grave-base mark stays in the lore but is not drawn on the banner. The tables are `K68_REALM_HEM`, `K68_REALM_HEM_TEXT` and `K68_MARK_WAIVED` in `tools/content/heraldry/k68_designs.mjs`, applied by `realmStyleText` and `markWaived` in `build_heraldry.mjs`. Dolon (DLN), Dondor (DND) and Kvittumm (KVI) take a plain sewn border instead of their culture's hem; the culture rows keep their hems for every other realm. Dolon draws no grave base, and the form check accepts this only through the waiver table. The waiver table is checked both ways: a waived mark drawn on the banner is a finding.

## Lead rulings, round 6 (31 October 2026)

No five-pointed star appears on any banner. Nether's seal is its sign element (a flat sulphur plume). Hirolon's device is the great cairn and Molot's the raised wings; Zol's Will is a non-circular broken bar; Mustnom's magpie stands alone on a plain field (the road_warrens grammar gains a plain division, and the boss ring is waived for Mustnom); Worshipdom's ground is plain (`K68_REALM_GROUND`); Kea's device is its three stepped rice terraces. Yeldenne is retired (K56) and is dropped from the generator's realms (`RETIRED_REALMS`), so the designs match the 155 realms.

Round 6 results: HIR and MOO failed three generation attempts and are not served (their best image is kept, needs_user_review). Yeldenne's roster row still exists in `roster.json`; the country table reads that roster, so its removal is pending the owner.

Round 7 (31 October 2026): Hirolon's device is a single upright tapered standing stone and Molot's a plain upright square-ended post; both realms carry the flat-solid hand override (`K68_REALM_HAND`), so no curl, scroll or volute can appear.
