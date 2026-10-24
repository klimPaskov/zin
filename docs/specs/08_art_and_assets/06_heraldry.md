# Heraldry of Aoaz

**Status:** Draft. **Date:** 24 October 2026. **Requirement:** R-92 (acceptance A-92) and rule F4. **Phase:** art, after the roster redesign (R-21 to R-27).
**Data:** [tools/content/data/world/heraldry.json](../../../tools/content/data/world/heraldry.json) (schema `zin-heraldry/1`).
**Companions:** [01_art_pipeline.md](01_art_pipeline.md), [05_asset_manifest.md](05_asset_manifest.md), [../02_lore/05_world_bible.md](../02_lore/05_world_bible.md), [../00_foundation/03_peoples.md](../00_foundation/03_peoples.md), [../INTEGRATION_DECISIONS.md](../INTEGRATION_DECISIONS.md) (A1 to A4, K1 to K8).

## Purpose

The owner rejected the first flags, generated on 19 October 2026: they were drawn from a regional motif list (palm trees across the whole East, a skull for every Dark Lands realm, snowy peaks for the Cold Lands) and an ideology palette, so they said nothing about who lives under them.
This spec replaces that method with a heraldic system: every culture and people has a grammar (palette, lines of partition, divisions, stock of charges with their meanings, ornament, marks of rank and form, kinship), every country has a design record that states what its arms mean, and the build turns records into image jobs and checks the results.
The country records are provisional: the roster is being redesigned (fewer and smaller elven realms; new realms of dwarves, small folk, goblins, giants and others), and debug tags such as Y01 will be replaced.
The grammars are written per culture and per people so that the new realms inherit a finished language and need only a record each.

## Sources and canon

- The lore vault and its Canon Policy, with the owner corrections of 24 October 2026 (K1 to K8): the setting is Aoaz; the Great Wall of Aenor is a natural mountain range; twelve New Gods name the months and their names are undecided; Zol does not appear in the War of the Last Crowns; devils are corrupted Lesser Spirits who served an Old God; the wider world stays out of public text.
- Politics pages: the Houses of the First Light (lamp, loaf and hospital: the Deliverer's public charity), the Lantern Chain, Elzon's Order, the Lost Cause and Afrit's Hidden Council.
- Figures and artifacts: Horos's blue sword and Glo (reserved, see 1.5), Aen and the Reckoning of Lines, the Golden King, Zol's Mistake and its emblem leader The Will of Zol.
- The world bible's culture cards (rule, dress, colours, "arms bear ...", neighbours), `cultures.json`, `country_cultures.json`, `languages.json` (families: Ainic, Boreal, Eastern, Elvish, Orcish and isolates) and the bestiary cards (dwarves, small folk, goblins, hobgoblins, dwarf goblins, ogres, gnomes, devils, demons).
- The rejected sheets in `art/source/flags/` and the current pipeline `tools/content/art/flag-jobs.mjs` (16 flags per sheet from a region motif list and an ideology palette).
- The installed game's flags, read but not copied: large and medium flags are uncompressed 32-bit TGA (type 2), image descriptor 0x08, bottom-left origin; small flags are 10x7, 32-bit, descriptor 0x00, bottom-left origin (`gfx/flags/FRA_democratic.tga`, `medium/FRA_democratic.tga`, `small/GER.tga`, `small/FRA.tga`).

Everything not marked as owner canon in this spec is a ZIN proposal and stays replaceable.

## 1. Principles

### 1.1 What a flag must say

Every flag answers five questions, each on its own layer, so that a viewer can read them in order from the largest shape to the smallest.

| Layer | Carried by | Example |
| --- | --- | --- |
| People | The line of partition (each people or family draws its own: Ainic straight with a label, Boreal indented, Eastern stepped, Sylvan engrailed, Sunhot rayonny, orcish raguly, and so on) | Every Cold Lands clan and every Triton chart-house draws the indented line of the Boreal stock |
| Culture | The palette and the stock of charges | Lake blue, lamp gold and Parim white with lamps, bells and barges for the Lake Aenorans |
| Faith or tradition | One charge taken from the faith's own customs, never a real-world religious sign and never a named god | The clan fire of the Winter Hearth; the hearth-iron of Dondor; the well of the Well-Oath; the knot of the Old Knots |
| Political form | Marks of rank: crowns of the culture, council borders, the tripled charge of a league, the overlord's mark | The Concord charter border of lamp gold on every dominion of Aenor; the grave black base on every realm sworn to the Dominion |
| History | The secondary charge, canting arms (a charge that puns on the name, as medieval heralds did), borrowed kin tinctures | Mirolon's lamp turned south; the hawthorn of the Free Crowns in Allegro's arms; Stork bears a stork |

A design record states the meaning in one sentence.
If the sentence cannot be written, the design is not finished.

### 1.2 Legibility at the three sizes

The game shows a flag at 82x52, 41x26 and 10x7 pixels.
Each size has a job, and the design rules follow from it.

- **10x7 (the small flag in lists and the map).** Only the field reads: its division and its tinctures. Therefore the pair (division, field tinctures) is unique within each region, and the build measures the mean colour difference of every pair of small flags in a region.
- **41x26 (the medium flag in tooltips and the diplomacy screen).** The primary charge must read: it fills 40 to 60 percent of the height, it is drawn as one bold silhouette with a thin dark outline, and no detail is smaller than one fortieth of the height (under one pixel at this size).
- **82x52 (the large flag in the country screen).** Marks and the secondary charge read here: the label, the crown, the border, the small charge in base.

Rules that apply to every record:

1. **The rule of tincture.** A tincture is a metal when its relative luminance exceeds 0.30 and a colour otherwise. A charge must reach a luminance ratio of 2.2 against every field tincture it overlaps, or it is fimbriated (outlined) in a contrasting tincture of the same palette; the record says so. A charge below 1.6 on a single field tincture is a design error.
2. **The element budget.** Marks plus charges are at most four; five fails the build. The division does not count.
3. **One primary charge.** A league may triple it (two above one); nothing else is repeated.
4. **No gradients, no shading, no text.** Tinctures are flat; the only texture is a faint woven cloth.
5. **The flag is the arms.** There is no shield, no supporters, no motto scroll and no frame: the whole rectangle is the field.

### 1.3 Family resemblance and distinctness

Within a culture, flags share the palette, the line, the stock of charges and the marks of form, so that the realms of one people are recognisable as kin at a glance.
Within a region, flags must stay apart: no primary charge is used twice in a culture or more than twice in a region, no charge class (beast, bird, tool, building and so on) covers more than 40 percent of a region of ten or more flags, and no two small flags of a region share a field signature.
The current 305 records meet all three rules; the class shares per region are in section 6.

### 1.4 The forbidden list

**Regional clichés.**
- `palm_tree`: banned everywhere (the rejected 19 October sheets put palms across the East).
- `one_motif_per_region`: no primary charge more than twice in a region and never twice in a culture; no charge class above 40 percent of a region with ten or more flags.
- `camel`: once in all the East Lands (The Moco).
- `skull`: once per region at most (Gord in the Dark Lands); never for corsairs, never for the dead.
- `snowflake`: banned (the Cold Lands cliché).
- `sun_disc`: at most one per culture (the Lands of Light noon-door, the Land of the Sun's sun court).
- `igloo_scimitar_genie_lamp_pyramid`: banned.
- `wall_motifs`: no masonry, battlements, crenellation, brick courses or wall towers for the Great Wall of Aenor, which is a mountain range.

**Real-world flags and arms and their look-alikes.**
- Tricolours: any field of three equal upright or horizontal bands, with or without a charge.
- An unadorned two-band field.
- Stars and stripes: alternating stripes with a canton; stars in a canton or in rows; a ring of stars (including twelve).
- Crescent and star, a crescent alone.
- Any cross throughout: Nordic (offset), St George, St Andrew saltire, Greek or Latin cross charges, cross pattee, Maltese cross.
- Hammer and sickle, hammer and compasses, crossed tools, cogwheels.
- Eagles in national poses: displayed, double-headed, on a cactus, with a snake.
- A lion rampant of national type, three lions passant, a rose of the Tudor kind, a fleur-de-lis, a maple leaf, a cedar of the Lebanese kind, a harp of the Irish kind, a red dragon on green and white, a dragon on a diagonal bicolour.
- A red disc on white; a rising sun with rays to the edges; a sun with a face; a sun over waves; a canoe over a sun over waves; a frigate bird over a sun.
- A large plain disc or lozenge on a plain field (Japan, Bangladesh, Brazil types).
- A yurt roof-wheel, a spoked wheel of eight or twenty-four spokes.
- A skull and crossbones, a fouled anchor, a compass rose of four points.
- Chequy red and white, lozengy blue and white, gold with red pales, gyronny gold and black (Croatian, Bavarian, Aragonese, Campbell arms).
- Tartan, thistle, heather, shamrock, rainbow.

Look-alikes are caught twice: by the vocabulary scan of every record and prompt, and by a perceptual comparison of every generated flag with every flag of the installed game, which is a corpus of real national flags of the 1930s (section 8.5).

**Real religious symbols.** crosses of every form; crescent; star of David or any hexagram; pentagram and inverted pentagram; inverted cross; ankh; Om; dharma wheel; yin and yang; swastika of any form; khanda; torii; lotus; hand with an eye (hamsa); triquetra and the endless knot; valknut, sun cross, Celtic cross; ichthys, chalice, dove with olive branch, lamb with banner; eye of Horus, winged sun disc.

**Other fiction.** a white tree with stars and crown; a lidless or flaming eye; a white hand; a black tower on black; a white horse on green; a direwolf, kraken, three-headed dragon, sun pierced by a spear, golden rose on green; a round door (another work's heraldry, including the Lord of the Rings mods).

**Lettering.** No letters, numerals, runes, monograms, mottoes, signatures or maker's marks anywhere on a flag.

**The owner's emblem.** Never the owner's ZIN emblem: a square frame with its two diagonals crossed and an upright staff through the centre; no square frame with crossed diagonals in any arms. The emblem belongs to the branding (R-90), not to any realm.

### 1.5 Canon guards

- No named New God charge; no figure of Zol, Volgan, Afrit, Elzon, Horos or any named person.
- No Afrit or Hidden Council sign on the Worshipdom or Aenor public arms (deny-list in the Worshipdom record).
- Glo, Horos's blue sword and its shards are reserved charges: owner approval and a story gate are required.
- No device of Elzon's Order (the Pale Regency) on any living realm.
- Nothing of the wider world (Erdu, Dunda, Haven, Cerio, Lao and the small neighbouring continent).
- The Great Wall of Aenor is drawn as peaks, passes and snowlines: the Wall-Folk bear a pass-key under snow peaks, an ibex and a watch-horn, never a rampart.
- No realm is named after its leader, and no flag shows a leader: Zol's Mistake shows only the sigil of its emblem leader, The Will of Zol (broken concentric rings, the same sigil as its leader's portrait); Volgan's realm shows the Gate of Nafeher.
- The Worshipdom is Afrit's realm in secret. Its public arms show the hostel's charity (a hand offering a loaf, the stranger's lamp) and must never show an eye, a chain, ash, a mask, a veil, a serpent, horns, a fire-bird, two figures, a hidden face, a key in a hand, a closed door, or a crown before the King of the East.
- Twelve New Gods name the months, but the gods have no names yet: no charge stands for a god, and no ring of twelve appears until owner question Q-01 is answered.
- Gala and the Sunhot realms are kept visually unrelated (different lines, no shared sun), because their relation is open.
- Yeldenne is an ordinary northern town (decision L2): its arms show a whale-rib door arch, never Glo, a green crystal, a knight or a blue sword.

## 2. Shared vocabulary

### 2.1 Lines of partition

A line of partition is the edge between two parts of the field. In ZIN it is the mark of a people or family.

| Line | Drawn as | Used by |
| --- | --- | --- |
| straight | a straight line | Ainic men, Men under Sunhot patronage |
| indented | an indented line of small even teeth | Boreal men |
| stepped | a stepped line like a short stair (grady) | Eastern men |
| wavy | a wavy line (undy) | Southern islanders |
| nebuly | a cloud-like interlocking line (nebuly), like a cord pulled through loops | Orran men |
| engrailed | an engrailed line of small inward scallops | Sylvan elves, Elves (Great Folk) |
| invected | an invected line of small outward scallops | Gala elves |
| rayonny | a rayonny line of alternating straight and flame-shaped rays | Sunhot elves |
| raguly | a raguly line of lopped-branch stubs | Orcs, Ogres |
| dovetailed | a dovetailed line of joiner's mortises | Dwarves |
| potenty | a potenty line of T-shaped notches | Goblins, Hobgoblins |
| bevilled | a bevilled line with a single sharp offset step | Dwarf goblins |
| arched | a single broad arch (enarched) | Giants |
| double_arched | two low arches side by side | Small folk |
| dancetty | a dancetty line of three large zigzag peaks | Yeti |
| urdy | an urdy line of pointed stakes | Trolls |
| rooted | a rooted line from which short root-strands hang | Ents |
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
| High kingdom | The culture's crown over the primary charge, on the culture's honour field; Aenor bears no label, because Aen's own realm needs no difference |
| Kingdom | The culture's crown: a lamp-crown (Lake Aenorans), a white felt (Steppe Riders), a ship-crown (Leren), a crown worn at the beast's neck (Free Crowns), a torc (Gunwaith), a well-crown (Noris), a tusk crown (Volcano Clans), a leaf circlet (hill elves), a captain's ring (corsairs), and so on |
| City-state | No crown; a divided field, the trade or craft charge over all (guild cities are quartered in two guild colours) |
| Council (elected realms, moots, leagues of speakers) | No crown; sylvan realms add a narrow engrailed silver border |
| Clan | No crown; the clan beast or token; Gunwaith clans divide the field per pale in the clan pair |
| Confederation or league | The primary charge tripled, two above one (Noleksun's three ploughshares, Lccimio's three lantern towers) |
| Enclave | An orle (an inner frame) in the tincture of the surrounding realm: the land held inside another's land |
| Forest domain | Charges shown with their roots; the ents draw the rooted line |
| Horde | The standard of the host and a row of three small marks in base (hoof-marks for the steppe) |
| Theocracy | A plain metal field and the charge of the faith alone: no crown, no label, no beast |
| Sanctuary (Sunhot) | Never a crown and never "king"; sanctuary white in the field |
| Emblem realm | Zol's Mistake: the void field and the leader's sigil alone |
| Subject of Aenor | The charter border: a plain narrow border of lamp gold, the seal-cord of the Charters of Parim |
| Sworn to the Dominion | A narrow base of grave black: the realm stands on the Dominion's ground |
| Other subjects | A narrow border in the overlord culture's dissent tincture |

### 2.4 Charge classes

Every charge has one class for the regional share check: beast, bird, sea_creature, shell, insect, plant, tree, landform, water, celestial, fire, building, ship, tool, weapon, vessel, garment, token, body_part, crown, sigil.

## 3. Families and kinship

Kinship between cultures shows in three ways, which match the three ways peoples became kin in the lore.

- **By ancestry**, through the family mark: the line of partition (and, for Ainic realms, Aen's label).
- **By migration**, through a borrowed tincture: a people that settled among another takes one tincture from its new neighbours (the Leren sailors of Blackton keep strait blue under Dondor's feud-chain).
- **By conquest, oath or patronage**, through a borrowed charge or the overlord's mark: the charter border of the Concord, the grave base of the Dominion, the Sunhot patrons' rayonny chief over the Goodin guest-towns, the giants' cairn beside Hilofrim's horn.

| Family | Line | Mark | Meaning | Cultures |
| --- | --- | --- | --- | --- |
| Ainic men | straight | Aen's label: a narrow bar across the upper field with three short square pendants, in a metal of the culture | The label is the medieval mark of a son of the house. Realms of Ainic speech and stock bear it because their first crowns were among the kingdoms Aen joined, and the Reckoning of Lines counts their founding houses among the descendants of his sons (proposed reading). Aenor itself bears none: the crown of Aen's own realm needs no difference. A theocracy bears none, because a faith claims no line. | lake_aenoran, selen_ranger, steppe_rider, wall_folk, march_folk, isle_houses, leren_sea_kings, free_crowns_north, dondor_brutes, mirolon_wardens, dead_lands_freeholds, zilin_pilgrims |
| Boreal men | indented | every line of partition is indented: small even teeth | The indented line is the toothed north-western shore that the Aenoran charts met already peopled; Gunwaithic, Coldic and Tritonic realms all draw it, which is how a Triton chart-house and a Cold Lands clan show they share a stock older than the charts. | gunwaith_clans, girdon_wardens, western_guilds, buldor_companies, winter_crown, ice_clans, isengard_warlords, windwaith_seafarers, chart_islanders, corsair_lords |
| Eastern men | stepped | every line of partition is stepped like a temple stair (grady); never crenellated | The stepped line is the stair: the temple stairs above the flood-line, the terraced roads of the caravans and the wells cut in steps. Noric, Stabilic and Alerhic realms all draw it. | noris_riders, caravan_princes, river_kings, lake_road_cities, red_lands_tribunes |
| Orran men | nebuly | every line is nebuly, like a cord drawn through loops | The nebuly line is the cord of the Old Knots, the oldest custom of men in Aoaz, kept by the speech of the beaten kingdoms. | veiled_folk, redbark_tribes |
| Southern islanders | wavy | every line is wavy | The wavy line is the reef's surf, counted wave by wave in the Wave-Tally. | southern_islanders |
| Men under Sunhot patronage | straight | a chief whose lower edge is rayonny, in sun yellow | Men who serve the Sunhot sanctuaries carry the patrons' rayonny edge only on a chief: the sanctuary stands over the guest-town, it is not its kin. | goodin_sunfolk |
| Sylvan elves | engrailed | every line is engrailed, and elven silver appears in every achievement | The engrailed line is the edge of a leaf; silver is the Kindred Song. The five realms of the Magical Lands share both, so a hill hall and a lake court are known as kin at a glance. | forest_council_elves, hill_kingdom_elves, lake_elves, pass_wardens, rift_coast_elves |
| Gala elves | invected | every line is invected | The invected line is the rim of the Mirror of First Rain. It is deliberately not the Sunhot rayonny line: the kinship of Gala and the Sunhot realms is open, and the arms must not answer it. | gala_court |
| Sunhot elves | rayonny | every line is rayonny; a sun disc appears in at most one achievement of each culture | The rayonny line is noon light on a sanctuary threshold. It carries the Sunhot identity so that the charges are free to show what each sanctuary keeps, instead of a sun on every banner. | sunhot_light, sunhot_western, sunhot_isles |
| Orcs | raguly | every line is raguly, like a lopped branch | The raguly line is the hewn stake of the holds' palisades and the challenge ring; every hold draws it, which says the holds are kin without saying they obey one master. | volcano_clans, iron_clans, wild_holds, sea_orcs |
| Goblins | potenty | every line is potenty, like tunnel mouths | The potenty line is a warren seen in section: tunnel, chamber, tunnel. | goblin_warrens |
| Peoples without kin | own | each people keeps its own line (see the people grammar) | Trolls, giants, yeti, ents, the dead and the Netherborn share no line with anyone: their arms answer only their own people. | troll_tribes, hill_giants, ice_giants, yeti_clans, kilinti_ents, grave_hosts, zols_dead, netherborn |

## 4. Grammars of the cultures

Each card gives the palette (named tinctures with hex values; M = metal, C = colour), the favoured divisions, the stock of charges with their meaning in that culture, ornament, rank and form, kinship and the breakaway difference used for dynamic tags (section 7).
Charges marked as restoration are the culture's sign of a realm restored.

### Lake Aenorans (`lake_aenoran`)

*People:* men. *Family:* Ainic men. *Language:* aenoran. *Faith:* deliverer. *Line:* straight. *Countries today:* 11.

*Palette:* lake blue `#2f5d8a` (C); deep lake `#1d3a5c` (C); lamp gold `#d4ad45` (M); pale gold `#e8d9a0` (M); Parim white `#f2f0e6` (M); slate `#56677a` (C); bell bronze `#8e5f2c` (C).

*Divisions:* plain, per_fess, per_pale, per_bend, per_bend_sinister, chief, base, per_chevron.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `bowl_lamp` | a bowl-lamp with one flame | the lamp lit in a window for the traveller; the realm keeps the light for the stranger |
| `change_bell` | a bell | the change-bells of a chartered town and the bell-signalled formations of the Concord |
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

*Ornament:* Clean straight partitions, charges drawn like guild seals: centred, upright, generous margins. The label sits in chief; a Concord dominion adds the charter border of lamp gold.

*Rank and form:* high kingdom: plain lake blue, the charge under the lamp-crown, no label; kingdom: the lamp-crown over the charge; city state: a free lake town shows its charge on a divided field and no crown; subject: the charter border: a plain border of lamp gold (the seal-cord of the Charters of Parim). *Crown:* the lamp-crown: a gold circlet of five flame-shaped points.

*Breakaway difference:* the charter border cut away in chief, or for a non-dominion a border of slate (dissent tincture slate).

### Selen Rangers (`selen_ranger`)

*People:* men. *Family:* Ainic men. *Language:* aenoran. *Faith:* green_lords. *Line:* straight. *Countries today:* 3.

*Palette:* wood green `#3f6b2e` (C); deep green `#24401c` (C); bark brown `#6b4a2c` (C); ash silver `#c9d6c0` (M); hazel gold `#b8973f` (M); birch white `#eef0e4` (M).

*Divisions:* plain, per_fess, per_bend, base, chief.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `hollow_oak` | a hollow oak with its roots | the Moot Tree, and the dead buried standing in hollow oaks |
| `three_arrows` | three arrows, points down | the Three Arrows: the bride-gift, the poacher's fine and the midsummer shooting |
| `oak_bough` (restoration) | an oak bough with acorns | the woods held through the Third Age |
| `hunting_horn` | a curled hunting horn | the rangers' horn calls |
| `arrow_quiver` | a quiver of arrows | the bowyers and the longbow levy the moots may refuse |

*Ornament:* Woodland charges drawn whole, roots and fletching visible; nothing gilded except hazel gold.

*Rank and form:* council: a moot realm: no crown; the First Warden is shown by the hollow oak of the Moot Tree; subject: the Concord charter border of lamp gold (borrowed from the lake Aenorans).

*Breakaway difference:* a border of deep green engrailed with oak leaves (dissent tincture deep green).

### Steppe Riders (`steppe_rider`)

*People:* men. *Family:* Ainic men. *Language:* aenoran. *Faith:* horse_oath. *Line:* straight. *Countries today:* 4.

*Palette:* steppe red `#a8432c` (C); felt white `#e6e0cc` (M); steppe gold `#c9a45a` (M); horse brown `#6b4a30` (C); dusk blue `#4f6f8f` (C); black felt `#2b2622` (C).

*Divisions:* plain, per_fess, per_bend, per_chevron.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `horse_head` | a horse's head | the oath sworn on a horse and carried to the sky |
| `horsetail_standard` | a horse-tail standard on a pole | the standard of the summer Gathering |
| `steppe_saddle` | a saddle | the bride's family gives the saddle, the groom's the mare |
| `felt_tent` | a felt tent seen from the side | the tents of the oath at the Gathering |
| `milk_bowl` (restoration) | a wooden bowl | mare's milk: a guest drinks and is a guest for three days |
| `horse_barrow` | a barrow mound facing east | the dead buried with a horse in barrows facing east |

*Ornament:* Horse charges are heads or standards, never a whole running horse; no green fields (another fiction's white horse on green).

*Rank and form:* kingdom: the charge set on the white felt; horde: a Horse-Lord chosen at the Gathering: the horse-tail standard, and a row of three small hoof-marks in base; subject: the Concord charter border. *Crown:* the white felt: the charge set upon a spread white felt, as kings are acclaimed.

*Breakaway difference:* a border of black felt (dissent tincture black felt).

### Wall-Folk (`wall_folk`)

*People:* men. *Family:* Ainic men. *Language:* aenoran. *Faith:* stone_vigil. *Line:* straight. *Countries today:* 4.

*Palette:* range grey `#6b6f76` (C); granite `#3e4147` (C); pass bronze `#a98d54` (C); snowline white `#e8e6de` (M); lichen green `#5a6b4a` (C).

*Divisions:* per_chevron, plain, per_fess, chief, pile_reversed.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `pass_key` | a large key | the key of the pass that a Gate-Lord holds in the king's name |
| `cleft_peaks` | two peaks with a pass between them | the passes of the Great Wall range |
| `beacon_peak` (restoration) | a peak with a fire on its summit | the beacons that pass word along the range |
| `watch_horn` | a straight watch-horn | the horn of the watch-posts held by a family from birth |
| `mountain_ibex` | an ibex standing | the high pastures above the snowline |
| `crossbow` | a crossbow | the crossbows and pole-arms of the watch |
| `names_stone` | an upright stone with notches | the stone of the names of those who fell holding the Pale March |

*Ornament:* The Great Wall of Aenor is a mountain range: peaks, passes and snowlines, never masonry, battlements or brick courses.

*Rank and form:* march lordship: a pass held by a watch-family: the per chevron field (the range) with the charge below the peak; subject: the Concord charter border.

*Breakaway difference:* a border of granite (dissent tincture granite).

### March-Folk (`march_folk`)

*People:* men. *Family:* Ainic men. *Language:* aenoran. *Faith:* lamp_furrow. *Line:* straight. *Countries today:* 3.

*Palette:* march ochre `#b38a3a` (C); field green `#4e6b3a` (C); palisade brown `#5e452a` (C); chalk white `#e8e0c8` (M); beacon red `#b0472f` (C).

*Divisions:* plain, per_fess, per_chevron, base.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `beacon` | a beacon: a fire-basket on a pole | the beacon towers of the frontier farms |
| `ploughshare` | a ploughshare | free farmers who own their land |
| `ox_yoke` | an ox-yoke | land divided among sons, worked in common |
| `boundary_stone` (restoration) | a boundary stone | the moot that settles field-bounds |
| `sling` | a sling | the sling-militia of the marches |

*Ornament:* Farm tools drawn plainly; the beacon is the culture's honour charge.

*Rank and form:* confederation: a league of free farmers: the charge tripled (two and one); march lordship: a Marcher-Lord: the beacon alone, large; subject: the Concord charter border.

*Breakaway difference:* a border of palisade brown (dissent tincture palisade brown).

### Isle Houses of Asgard (`isle_houses`)

*People:* men. *Family:* Ainic men. *Language:* aenoran. *Faith:* isle_tide. *Line:* straight. *Countries today:* 1.

*Palette:* sea grey `#4a6f7c` (C); foam white `#ece4d0` (M); oar brown `#7e6040` (C); deep sea `#2c4a55` (C); sash red `#a8443a` (C).

*Divisions:* per_fess, base, plain.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `isle_lighthouse` | a lighthouse with a red fire | the lighthouse-shrines where the tide-houses name their dead |
| `tide_oar` (restoration) | an oar upright | the house boats and the tide-court |

*Ornament:* Sea charges stand on a calm base; the sash red appears once, as the lighthouse fire or a sash.

*Rank and form:* kingdom: a queen chosen from the great houses: the oar-crown; subject: the Concord charter border. *Crown:* the oar-crown: a circlet of five oar-blades.

*Breakaway difference:* a border of deep sea (dissent tincture deep sea).

### Leren of the Strait (`leren_sea_kings`)

*People:* men. *Family:* Ainic men. *Language:* leren. *Faith:* strait_litany. *Line:* straight. *Countries today:* 7.

*Palette:* strait blue `#2a5a82` (C); salt white `#e8e6dc` (M); Leren silver `#b8c4cc` (M); deep strait `#173a59` (C); kelp green `#3f5f4a` (C); clasp gold `#c4a24e` (M).

*Divisions:* plain, per_fess, per_pale, per_bend, base.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `two_waves` | two waves, one above the other | Lerendor and Lerenwaith under one High Crown |
| `leren_cog` | a high-prowed ship with one square sail | the fleets of the strait |
| `strait_gull` | a gull | the skerries and the herring grounds |
| `grey_seal` | a seal | sealskin and the hunting skerries |
| `salt_cellar` | a salt cellar | salt set on the arbitration table binds both parties |
| `steering_oar` | a steering oar | the steersman's right in the strait code |
| `skerry` | a black skerry rock | the low skerries of the outer coast |
| `quay_bell` (restoration) | a quay bell | the Singing Quay of Sonargur |

*Ornament:* Silver rather than gold; ships high-prowed with one square sail; no anchors and no fouled anchors.

*Rank and form:* high kingdom: two waves under the ship-crown: one High Crown over two realms; kingdom: the ship-crown over the charge; council: a Speakers' Hall seat: no crown. *Crown:* the ship-crown: a circlet whose points are raised prows.

*Breakaway difference:* a border of deep strait (dissent tincture deep strait).

### Free Crowns of the North (`free_crowns_north`)

*People:* men. *Family:* Ainic men. *Language:* leren. *Faith:* strait_litany. *Line:* straight. *Countries today:* 21.

*Palette:* earth brown `#7a6a54` (C); fir green `#4e5e4a` (C); hearth red `#9a3a2c` (C); hill grey `#8a8a80` (C); fleece white `#e4dccb` (M); straw gold `#c8b070` (M); peat black `#2e2a26` (C).

*Divisions:* plain, per_fess, per_pale, per_bend, per_bend_sinister, chief, base, per_chevron.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `north_bull` | a bull standing | the strong hand and the cattle-wealth of the hills |
| `badger` | a badger | the hill-fort dug in and stubborn |
| `grey_crane` | a crane standing | the marsh lowlands and a careful watch |
| `brown_bear` | a bear walking | the great forest and the oldest crown of the hills |
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

*Ornament:* One beast or one tree, whole, walking or standing; the crown at its neck or in its branches; Aen's label in chief.

*Rank and form:* kingdom: the gorged crown on the beast or in the tree (every Free Crown is a small kingdom). *Crown:* the gorged crown: the beast wears a small plain crown about its neck, or the crown hangs in the tree's branches.

*Breakaway difference:* the crown torn from the beast's neck and shown below it (dissent tincture peat black).

### Dondor Brutes (`dondor_brutes`)

*People:* men. *Family:* Ainic men. *Language:* dondric. *Faith:* hearth_iron. *Line:* straight. *Countries today:* 2.

*Palette:* hold black `#2a2a2e` (C); iron grey `#7a7a76` (C); rust `#7a4a2a` (C); ash `#a8a8a0` (M); bone `#d6ccb4` (M); ember red `#8a2e22` (C).

*Divisions:* plain, per_fess, per_bend, chief.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `bearded_axe` | a bearded axe | the clan war and the king chosen from the strongest line |
| `feud_chain` | a chain of three links | the blood-price: a death paid in iron or in blood |
| `hearth_iron` (restoration) | a forged bar with ring ends | the bar of iron kept at every hearth and passed to the eldest son |
| `stockade_gate` | a timber gate | the high stockades of the forest holds |

*Ornament:* Heavy iron-bound charges, square and blunt.

*Rank and form:* kingdom: the iron band over the charge; the king is chosen by the clan-moot from the strongest line. *Crown:* the iron band: a plain iron crown with no points.

*Breakaway difference:* a border of rust (dissent tincture rust).

### Wardens of Mirolon (`mirolon_wardens`)

*People:* men. *Family:* Ainic men. *Language:* mirolic. *Faith:* warden_vigil. *Line:* straight. *Countries today:* 1.

*Palette:* warden blue `#3c5f78` (C); lake grey `#9fa7ae` (M); beacon gold `#cbbd8e` (M); night blue `#233849` (C); heron white `#e6e8e4` (M); signal red `#a0442f` (C).

*Divisions:* plain, per_fess, chief.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `watch_heron` | a heron standing on one leg | the lake-watch: Mirolon's own name |
| `south_lamp` (restoration) | a lamp with its flame blown to one side | the lamp every tower keeps lit toward the south |
| `beacon_tower` | a stone beacon tower on a pass | the beacon towers of the passes |
| `stilt_house_m` | a house on stilts | the stilted lake towns |

*Ornament:* Watchful charges, upright and still.

*Rank and form:* council: the High Warden is elected: no crown; the lamp turned south is the vigil.

*Breakaway difference:* a border of night blue (dissent tincture night blue).

### Dead Lands Freeholders (`dead_lands_freeholds`)

*People:* men. *Family:* Ainic men. *Language:* mirolic. *Faith:* mourning_dust. *Line:* straight. *Countries today:* 8.

*Palette:* sand `#c9b58a` (M); sea teal `#3e6b78` (C); mud brick `#8a5a3a` (C); salt white `#ece8dc` (M); storm grey `#6a6e70` (C); tar black `#2b2826` (C).

*Divisions:* plain, per_fess, per_pale, per_bend, chief, base.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `gaff_hook` | a gaff hook | the warlord who takes the tolls |
| `flat_boat` | a flat-bottomed boat | the coast boats that came back from the north |
| `salt_pan` (restoration) | a salt-pan with heaped salt | the salt trade and the salt laid in every grave |
| `storm_lantern` | a storm lantern | a light kept against the storms (canting on Luminor) |
| `shore_crab` | a crab | the mud shore |
| `sun_hat` | a wide straw hat | the salt-pan workers under the sun |
| `storm_house` | a low mud-brick house | houses built low against the storms |
| `drag_net` | a drag net | the inshore fishing |

*Ornament:* Low, wide charges hugging the base; nothing names or shows the dead.

*Rank and form:* clan: a headman's freehold: no crown; warlord: a warlord's freehold: the charge is a weapon or a hook.

*Breakaway difference:* a border of tar black (dissent tincture tar black).

### Zilin Pilgrim-Folk (`zilin_pilgrims`)

*People:* men. *Family:* Ainic men. *Language:* aenoran. *Faith:* deliverer. *Line:* straight. *Countries today:* 1.

*Palette:* hostel white `#efe9d0` (M); pilgrim gold `#c9a24a` (M); sky blue `#7f9fc4` (M); bread brown `#9a6c3e` (C); chapel stone `#d8d2c0` (M).

*Divisions:* plain.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `offered_loaf` | a hand from the base offering a round loaf | the loaf given to the stranger; the hand is unarmed and gives |
| `hostel_lamp` (restoration) | a small standing lamp | the lamp kept for the stranger in the hostels of the Deliverer |
| `pilgrim_staff` | a pilgrim's staff | the pilgrims of the Zilin valleys |

*Ornament:* Plain hostel white; the charges of care only; no crown, no label, no weapon (no weapon passes the hostel gate).

*Rank and form:* theocracy: a plain metal field and the charge of the faith alone: no crown, no label, no beast.

*Breakaway difference:* a border of bread brown (dissent tincture bread brown).

### The Veiled (`veiled_folk`)

*People:* men. *Family:* Orran men. *Language:* orran. *Faith:* old_knots. *Line:* nebuly. *Countries today:* 1.

*Palette:* veil grey `#5a5560` (C); char `#2b2830` (C); ash lilac `#9d98a3` (M); undyed wool `#d8d0c0` (M); cord red `#7a3a34` (C).

*Divisions:* per_fess, plain, base.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `cord_knot` (restoration) | a single loose knot in a cord, both ends hanging | names are knots in a cord: a child is tied into her mother's line and the dead are never untied |
| `drop_spindle` | a drop spindle | the cord-mothers who spin the line |
| `grey_veil` | a hanging veil | the grey linen veils of the Veiled |

*Ornament:* Undyed, muted, half-hidden; a cord is always shown with its free ends hanging (never an endless knot, never a three-looped knot).

*Rank and form:* council: a council of cord-mothers: the charge is a cord or a woman's tool, never a crown.

*Breakaway difference:* a border of char (dissent tincture char).

### Redbark Tribes (`redbark_tribes`)

*People:* men. *Family:* Orran men. *Language:* orran. *Faith:* old_knots. *Line:* nebuly. *Countries today:* 1.

*Palette:* redbark `#8a2f26` (C); deep bark `#3b2a1c` (C); antler bone `#d4b89a` (M); moss `#4f5a34` (C); ochre `#a8743a` (C).

*Divisions:* per_pale, plain, per_fess.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `stag_attires` | a stag's antlers (attires) | antler-craft and the forest hunt |
| `knot_tree` (restoration) | a tree hung with cords | the knot-trees of the Bloody Forest |
| `beaded_cord` | a beaded cord hanging | kinship by tongue with the Veiled |

*Ornament:* Red-dyed hide colours, antler and cord.

*Rank and form:* clan: clans led by cord-mothers; a raid's war-chief is not shown.

*Breakaway difference:* a border of deep bark (dissent tincture deep bark).

### Winter-Crown Folk (`winter_crown`)

*People:* men. *Family:* Boreal men. *Language:* coldic. *Faith:* winter_hearth. *Line:* indented. *Countries today:* 1.

*Palette:* frost white `#eef2f5` (M); ice blue `#9fc0d8` (M); winter blue `#3e5672` (C); slate grey `#8a8f96` (C); hearth red `#a8402f` (C); deep night `#1f2b3a` (C).

*Divisions:* per_fess, plain, chief.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `hearth_ring` (restoration) | a fire inside a ring of stones | the hearth-law: no feud may be carried past a shared fire |
| `winter_wolf` | a wolf standing | the long winter hunts |

*Ornament:* No snowflakes (a regional cliché); the hearth is the culture's honour charge.

*Rank and form:* high kingdom: the winter crown over the clan fire: the crown passes to the eldest child and the clans relight their fires from the crown's. *Crown:* the winter crown: a white circlet of short icicle points.

*Breakaway difference:* a border indented of deep night (dissent tincture deep night).

### Ice Clans (`ice_clans`)

*People:* men. *Family:* Boreal men. *Language:* coldic. *Faith:* winter_hearth. *Line:* indented. *Countries today:* 25.

*Palette:* snow `#f0f2f2` (M); ice `#bcc6cf` (M); hide brown `#6b5a48` (C); fjord blue `#3f5870` (C); bone `#ddd3bd` (M); berry red `#8e3a3a` (C); lichen green `#6b7a52` (C); soot `#2e2f33` (C).

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

*Ornament:* One clan beast or clan token, drawn heavy and dark against snow, or pale against hide; no snowflakes, no igloos.

*Rank and form:* clan: a chieftain chosen by the moot: the clan beast or token, no crown; council: a clan moot that elects for the realm: the token stands on a plain indented base.

*Breakaway difference:* a border indented of soot (dissent tincture soot).

### Isengard Warlords (`isengard_warlords`)

*People:* men. *Family:* Boreal men. *Language:* coldic. *Faith:* storm_court. *Line:* indented. *Countries today:* 1.

*Palette:* forge black `#2f2f33` (C); war red `#8a2a2a` (C); iron grey `#9a9aa0` (M); storm white `#dcdcd8` (M); gunmetal `#4a4c52` (C).

*Divisions:* per_bend, per_fess, pile.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `spear_sheaf` | three spears bound in a sheaf | the oath-companies that hold the realm for the warlord |
| `storm_cloud` (restoration) | a storm cloud loosing three bolts | the Storm Court: the Black Gallery's bargains with the storms |
| `forge_chain` | a forged chain | the forges in every town |

*Ornament:* No tower and no hand or gauntlet (another fiction's fortress and white hand); storm and iron only.

*Rank and form:* warlord: the realm is held by oath-companies: the charge is a sheaf of their spears; no crown, because the heir is the best sworn man, not the eldest.

*Breakaway difference:* a border indented of gunmetal (dissent tincture gunmetal).

### Windwaith Seafarers (`windwaith_seafarers`)

*People:* men. *Family:* Boreal men. *Language:* coldic. *Faith:* storm_court. *Line:* indented. *Countries today:* 2.

*Palette:* sea teal `#3f6f74` (C); sail white `#d6d2c4` (M); tar brown `#6e5238` (C); storm grey `#5a6266` (C); gale blue `#2c4a5c` (C); amber `#c8963a` (M).

*Divisions:* per_bend_sinister, plain, per_fess.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `bellied_sail` | a ship under a bellied sail | ship-shares and the captains' council |
| `wind_tower` (restoration) | a slender wind-tower on a headland | the wind-towers of the Windwaith headlands |
| `storm_petrel` | a storm petrel | the bird that rides the storm |
| `wind_knots` | a cord tied with three wind-knots | the wind-tokens bargained from the Storm Court |

*Ornament:* Bellied sails and wind-cords; no compass rose (the chart-islanders' charge), no weathercock.

*Rank and form:* council: a Council of Captains: no crown; the ship is shown under sail, owned by shares.

*Breakaway difference:* a border indented of storm grey (dissent tincture storm grey).

### Gunwaith Clans (`gunwaith_clans`)

*People:* men. *Family:* Boreal men. *Language:* gunwaithic. *Faith:* clan_stones. *Line:* indented. *Countries today:* 7.

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

*Ornament:* No tartan, no thistle, no heather and no gyronny of gold and black (all real-world Scottish marks); the clan sett is shown as two clan colours divided per pale.

*Rank and form:* kingdom: the torc-crown; the king is acclaimed at a standing stone and bound by the Lawspeaker; clan: per pale in the clan pair, the clan's beast across both. *Crown:* the torc-crown: the king's crown is an open torc.

*Breakaway difference:* a border indented of moor brown (dissent tincture moor brown).

### Girdon Wardens (`girdon_wardens`)

*People:* men. *Family:* Boreal men. *Language:* gunwaithic. *Faith:* river_wardens. *Line:* indented. *Countries today:* 3.

*Palette:* river green `#4a6b52` (C); mud brown `#7e6342` (C); ford stone `#d8d0b8` (M); water blue `#4e7c94` (C); reed gold `#b5a35a` (M); dark pool `#2c3f36` (C).

*Divisions:* per_fess, plain, chief.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `stone_bridge` | a stone bridge of three arches | the bridge-towns and their water-gates |
| `ford_stones` (restoration) | three stepping stones | the ford kept clear by the wardens |
| `river_eel` | an eel | the river's keeper spirit is fed at the flood |
| `warden_hat` | a wide-brimmed hat | the ford-wardens' wide hats |

*Ornament:* Bridges and fords drawn from the side, water below.

*Rank and form:* council: a Warden-Speaker chosen by the ford-wardens: no crown; a bridge or a ford.

*Breakaway difference:* a border indented of dark pool (dissent tincture dark pool).

### Western Guildmen (`western_guilds`)

*People:* men. *Family:* Boreal men. *Language:* gunwaithic. *Faith:* guild_hall. *Line:* indented. *Countries today:* 10.

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

*Ornament:* Bright guild colours; one craft tool, drawn like a guild sign; never square-and-compasses, cogwheels or crossed tools (real-world emblems).

*Rank and form:* city state: a guild city: quartered in two guild colours, the craft tool over all; council: a guild council: the craft tool on a divided field.

*Breakaway difference:* a border indented of ink black (dissent tincture ink black).

### Buldor Companies (`buldor_companies`)

*People:* men. *Family:* Boreal men. *Language:* gunwaithic. *Faith:* company_banner. *Line:* indented. *Countries today:* 1.

*Palette:* company brown `#5a3f2f` (C); olive `#a8a36a` (M); steel blue `#2f3f5a` (C); livery red `#8e3b2e` (C); buff `#d8c9a2` (M).

*Divisions:* bordure, plain.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `halberd` | a halberd | the companies' weapon and the Banner-Oath sworn before it |
| `war_drum` (restoration) | a war drum | the Unfurling and the Last Muster |
| `sealed_contract` | a sealed roll | the contract-book |

*Ornament:* The bordure compony (a border of alternating livery blocks) is the companies' mark.

*Rank and form:* council: company-lords elect a Captain-General: the bordure compony and a weapon of the line, no crown.

*Breakaway difference:* the bordure compony broken in chief (dissent tincture company brown).

### Chart-Islanders (`chart_islanders`)

*People:* men. *Family:* Boreal men. *Language:* tritonic. *Faith:* tide_charts. *Line:* indented. *Countries today:* 16.

*Palette:* chart teal `#2f6f78` (C); chart paper `#e0d8be` (M); reef coral `#a8513a` (C); ink `#23323a` (C); sand gold `#c9a85a` (M); shallows `#7fb0ac` (M).

*Divisions:* plain, per_fess, per_pale, per_bend, per_bend_sinister, chief, base, per_chevron, pile_reversed.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `chart_rose` (restoration) | a chart-rose of sixteen thin points | the charts the islands sell to Aenor |
| `sounding_lead` | a sounding lead on its line | the soundings of every reef |
| `coral_reef` | a branching coral | the reef-spirits that spared the first pilot |
| `pilot_lantern` | a pilot's lantern | the harbour pilots |
| `rolled_chart` | a rolled chart | the chart-house archives |
| `astrolabe_ring` | a ring with a sighting rule across it | star-sighting |
| `sand_glass` | a sand-glass | the watch kept at sea |
| `reef_buoy` | a buoy | the marked channels |
| `rope_coil` | a coil of rope | the rope-walks |
| `seahorse` | a seahorse | the sheltered lagoons |
| `green_turtle` | a turtle | the turtle beaches |
| `flying_fish_t` | a flying fish | the open-water crossings |
| `reading_lens` | a round lens of ground glass | the lens-grinders (canting on The Lens) |
| `chart_house` | a chart-house on stilts | the stilt harbours |
| `tern` | a tern | the outer islets |
| `sperm_whale` | a whale | the whale grounds |

*Ornament:* Navigation and reef charges drawn like chart vignettes; the chart-rose has sixteen thin points and never four (another military emblem).

*Rank and form:* council: speakers elected from the chart-houses: no crown.

*Breakaway difference:* a border indented of ink (dissent tincture ink).

### Corsair Lords (`corsair_lords`)

*People:* men. *Family:* Boreal men. *Language:* tritonic. *Faith:* ransom_tide. *Line:* indented. *Countries today:* 18.

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
| `black_sail` | a ship under a black sail | the Black Flag Night |
| `boarding_pike` | a boarding pike | the boarding parties |
| `open_shackle` | an open shackle | a captive released on ransom |
| `masthead_lantern` | a masthead lantern | the night raids |
| `barracuda` | a barracuda | the fast raiders |
| `serpent_coil` | the coil of a sea-serpent rising from a wave | the sea-serpent waters the corsairs claim |
| `boarding_axe` | a boarding axe | the cliff harbours' crews |
| `harbour_chain` | a chain across a harbour mouth | the toll at the harbour mouth |
| `coin_purse` | a purse spilling coins | tribute from the chart-islands |
| `storm_sail_c` | a torn square sail blown out by the wind | the stormiest isles (canting on the Windy Lands) |

*Ornament:* Black and red with ransom gold; no skull, no crossed bones, no cutlass or curved sabre (real pirate and regional clichés).

*Rank and form:* kingdom: a king or captain-lord who holds an isle by the sword: the charge within the captain's ring. *Crown:* the captain's ring: the isle-lord's charge is set within a plain gold ring.

*Breakaway difference:* a border indented of rust (dissent tincture rust).

### Noris Camel Warriors (`noris_riders`)

*People:* men. *Family:* Eastern men. *Language:* noric. *Faith:* well_oath. *Line:* stepped. *Countries today:* 9.

*Palette:* indigo `#2b3f7a` (C); well ochre `#c9964a` (M); robe white `#efe3c4` (M); deep indigo `#1a2650` (C); silver `#c0c4c8` (M); desert rose `#b0624a` (C).

*Divisions:* plain, per_fess, per_pale, per_bend, chief, base, per_chevron.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `well_head` (restoration) | a well-head with rope and bucket | a well is a promise from the earth; the king is chosen by the well-lords |
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

*Rank and form:* kingdom: the well-crown; the king is chosen by the well-lords from one line; clan: a tribe of the well-oath: no crown, a water charge. *Crown:* the well-crown: a silver circlet set with small cups.

*Breakaway difference:* a border stepped of deep indigo (dissent tincture deep indigo).

### Caravan Princes (`caravan_princes`)

*People:* men. *Family:* Eastern men. *Language:* stabilic. *Faith:* scale_creed. *Line:* stepped. *Countries today:* 10.

*Palette:* bronze `#a8742a` (C); caravan red `#8a2f2a` (C); market green `#3f6b4a` (C); seal wax `#5e1c20` (C); linen `#e6dcc4` (M); colonnade stone `#c9b48a` (M); ink `#2a2622` (C).

*Divisions:* plain, per_fess, per_pale, per_bend, chief, base, per_chevron, quarterly.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `honest_scale` (restoration) | a balance | an honest weight pleases the New Gods; a false weight is the worst crime |
| `struck_coin` | a bronze coin stamped with a balance | the Pact's coinage |
| `milestone` | a milestone | the caravan roads |
| `wax_seal` | a hanging wax seal | contract law with written seals |
| `nested_weights` | nested cup-weights | the weighing halls |
| `measuring_rod` | a measuring rod | the ell of the cloth markets |
| `corded_bale` | a corded bale | the caravans' loads |
| `counting_frame` | a counting frame | the Treasurer's purse |
| `toll_bar` | a toll bar across a road | the road tolls |
| `colonnade` | a colonnade of three columns | the colonnaded market streets |

*Ornament:* Bronze charges drawn like market weights and seals; no coins with square holes, no images on coins.

*Rank and form:* council: a Prince chosen by the bench of merchant houses: no crown; the seal or the scale.

*Breakaway difference:* a border stepped of seal wax (dissent tincture seal wax).

### River-Kings of the East (`river_kings`)

*People:* men. *Family:* Eastern men. *Language:* alerhic. *Faith:* river_temples. *Line:* stepped. *Countries today:* 6.

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

*Ornament:* Every river-king's arms carry the king's river as a narrow wavy bendlet; no eyes, no lotus, no winged sun disc, no papyrus (real-world Egyptian marks).

*Rank and form:* kingdom: the river-diadem and the river bendlet: the king takes the name of his river; theocracy: the oldest river kingdom: a priest-king; the temple stair under the diadem. *Crown:* the river-diadem: a gold collar-crown worn low.

*Breakaway difference:* a border stepped of flood silt (dissent tincture flood silt).

### Lake Road Cities (`lake_road_cities`)

*People:* men. *Family:* Eastern men. *Language:* alerhic. *Faith:* lake_litany. *Line:* stepped. *Countries today:* 9.

*Palette:* lake silver-blue `#5a8aa8` (C); quay white `#d8d4c4` (M); rush green `#3f5f4a` (C); lantern amber `#d0963a` (M); fish grey `#7a7a6e` (C); deep water `#2a4256` (C).

*Divisions:* plain, per_fess, per_pale, per_bend, chief, base, per_chevron.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `quay_lantern` (restoration) | a lantern on a pole | the lantern quays of the Lake Road |
| `barbel` | a barbel | the lake fish |
| `stilt_house_l` | a house on stilts | the stilt towns |
| `fish_net_l` | a net | fishers and merchants pray together at the water |
| `eel_trap` | an eel trap | the lake shallows |
| `lantern_float` | a floating lantern | the Lantern Float of Longnight |
| `perch` | a perch | the lake's common fish |
| `lake_skiff` | a skiff | the lake ferries |
| `cattail` | a cattail | the reed shores |

*Ornament:* Silver and lantern amber; fish drawn by kind, never generic.

*Rank and form:* kingdom: the lantern-crown; council: a Speaker of the council: no crown. *Crown:* the lantern-crown: a silver circlet of small lantern points.

*Breakaway difference:* a border stepped of fish grey (dissent tincture fish grey).

### Red Lands Tribunes (`red_lands_tribunes`)

*People:* men. *Family:* Eastern men. *Language:* alerhic. *Faith:* red_hearth. *Line:* stepped. *Countries today:* 1.

*Palette:* red clay `#a8452f` (C); kiln ochre `#d4a46a` (M); umber `#5e3f30` (C); slip white `#e8dcc8` (M); ash grey `#8a8178` (C).

*Divisions:* per_chevron, plain.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `kiln` (restoration) | a domed kiln with fire at its mouth | the kiln-shrines and the Refiring each spring |
| `clay_jar` | a clay jar | the pots and grain the neighbours borrow |

*Ornament:* Clay shapes, thick and rounded.

*Rank and form:* council: a Tribune chosen each year: no crown; the kiln that is refired every spring.

*Breakaway difference:* a border stepped of umber (dissent tincture umber).

### Southern Islanders (`southern_islanders`)

*People:* men. *Family:* Southern islanders. *Language:* yonic. *Faith:* wave_tally. *Line:* wavy. *Countries today:* 19.

*Palette:* lagoon turquoise `#3f9aa8` (C); coral sand `#efe6c8` (M); coral red `#c9644a` (C); deep reef `#1f5a6a` (C); frond green `#4f8a4a` (C); lava black `#2a2a28` (C).

*Divisions:* plain, per_fess, per_pale, per_bend, per_bend_sinister, chief, base, per_chevron, pile_reversed.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `wave_tally` (restoration) | a notched tally stick | each island counts its dead as waves on the reef |
| `stilt_house_s` | a thatched house on stilts | the stilt houses on the reef |
| `fish_trap` | a woven fish trap | the reef fishing |
| `shell_necklace` | a shell necklace | the necklaces of the feasts |
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

*Ornament:* No palm trees, no canoe over a rising sun over waves, no frigate bird over a sun, no stars (all real-world island flags); shell and reef work instead.

*Rank and form:* council: an elder or speaker for each harbour: no crown; the feast bowl or the tally.

*Breakaway difference:* a border wavy of lava black (dissent tincture lava black).

### Goodin Sunfolk (`goodin_sunfolk`)

*People:* men. *Family:* Men under Sunhot patronage. *Language:* sunhot. *Faith:* noon_pilgrimage. *Line:* straight. *Countries today:* 3.

*Palette:* sun yellow `#e0b23a` (M); shade green `#4f7f42` (C); linen `#f2e6b8` (M); brick `#a8643a` (C); fig purple `#5e3452` (C).

*Divisions:* plain, per_fess, per_pale.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `shade_tree` (restoration) | a broad-crowned shade tree | guest-towns under shade trees |
| `ripe_fig` | a ripe fig | the orchards that feed the sanctuaries |
| `cool_jar` | a sweating water jar | the guest's cool water |

*Ornament:* Under the patrons' rayonny chief, homely guest-town charges.

*Rank and form:* council: elders of the guest-towns: no crown; the patron chief of sun yellow.

*Breakaway difference:* the patron chief removed (dissent tincture brick).

### Council Elves of the Magical Forest (`forest_council_elves`)

*People:* elves. *Family:* Sylvan elves. *Language:* sylvan. *Faith:* kindred_song. *Line:* engrailed. *Countries today:* 5.

*Palette:* leaf green `#4f9a5a` (C); deep wood `#2c5a3a` (C); elven silver `#d8e0d2` (M); moon white `#f4f6f0` (M); mist grey `#8a96a0` (C); amber sap `#c9a24a` (M).

*Divisions:* plain, per_fess, per_bend, flaunches, chief.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `song_bow` | a song-bow: a lyre of two curved horns with three strings | the Kindred Song: the world was sung and to listen well is a duty |
| `living_tree` | a green-leaved tree with its roots | the cities woven into living trees |
| `willow_leaf` | a long willow-shaped leaf | the leaf of the Magical Forest |
| `silver_bridge` | a filigree bridge | the silver bridges between the tree-cities |
| `precedent_book` | a book of precedents bound in green | the council's book renewed each century |
| `seedling` (restoration) | a seedling with two leaves | a house, not a person, inherits |
| `forest_heron` | a heron | the heron of the forest pools (canting on Heron) |

*Ornament:* Long, drawn-out charges; silver always present; no white tree on black (another fiction), no maple leaf, no harp of the real-world Irish kind (the elven song-bow is a curved horn lyre).

*Rank and form:* council: an elected First Speaker: a border engrailed of elven silver, no crown; forest domain: charges with their roots shown.

*Breakaway difference:* a border engrailed of mist grey (dissent tincture mist grey).

### Hill-Kingdom Elves (`hill_kingdom_elves`)

*People:* elves. *Family:* Sylvan elves. *Language:* sylvan. *Faith:* kindred_song. *Line:* engrailed. *Countries today:* 5.

*Palette:* hill green `#3f6f4a` (C); elven silver `#c9c9d2` (M); dragon red `#a8402f` (C); night slate `#2f3640` (C); gorge grey `#7a7f86` (C); scale gold `#c4a04a` (M).

*Divisions:* per_bend, plain, per_fess, chief, per_chevron.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `dragon_roost` | an open-topped roost tower | the dragon roosts the elves command |
| `dragon_scale` | a single dragon scale | dragon-scale traded for iron at the gate |
| `dragon_wing` | a single dragon wing | the dragons that guard the halls |
| `dragon_egg` | a dragon egg | the brood of the roosts |
| `hall_stair` (restoration) | a long stair cut into a hillside | halls cut into hillsides |

*Ornament:* Dragon parts (scale, wing, egg, roost), never a whole dragon passant (real-world Welsh and Bhutanese flags).

*Rank and form:* kingdom: a hall-acclaimed queen or king: the leaf circlet; council: a hall without a crown: the silver engrailed border. *Crown:* the leaf circlet: a silver circlet of upright leaves.

*Breakaway difference:* a border engrailed of night slate (dissent tincture night slate).

### Lake Elves (`lake_elves`)

*People:* elves. *Family:* Sylvan elves. *Language:* sylvan. *Faith:* kindred_song. *Line:* engrailed. *Countries today:* 3.

*Palette:* lake teal `#4a8a8a` (C); water silver `#d8e0e0` (M); willow green `#5f845a` (C); deep blue `#2f4f6a` (C); pearl white `#f2f4f2` (M).

*Divisions:* per_fess, plain, base.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `glass_boat` | a boat with a glass canopy | the boat-houses with glass roofs |
| `shell_clasp` | a pearl shell clasp | the shell clasp of their dress (canting on Perloia) |
| `lake_crane` | a crane | the water-courts that judge weirs |
| `willow_bridge` (restoration) | a bridge of braided willow | the braided bridges |

*Ornament:* Water charges; no water-lily (too close to a real-world religious flower).

*Rank and form:* council: a Speaker of the water-houses: the silver engrailed border.

*Breakaway difference:* a border engrailed of deep blue (dissent tincture deep blue).

### Pass-Warden Elves (`pass_wardens`)

*People:* elves. *Family:* Sylvan elves. *Language:* sylvan. *Faith:* kindred_song. *Line:* engrailed. *Countries today:* 2.

*Palette:* pass grey-green `#5f7a6a` (C); snow white `#eceeea` (M); granite `#565b64` (C); pine `#34503f` (C); dawn silver `#c9ceca` (M).

*Divisions:* per_chevron, plain.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `mountain_pass` (restoration) | two peaks with a path between them | the Nolorim Passes |
| `pass_token` | a carved pass-token on a cord | the token every courier shows at the gate |
| `warden_bow` | a long bow | the wardens' bows |

*Ornament:* Peaks drawn as the range, never as masonry.

*Rank and form:* council: a Pass-Warden elected until a vigil is broken: the silver engrailed border.

*Breakaway difference:* a border engrailed of granite (dissent tincture granite).

### Rift-Coast Elves (`rift_coast_elves`)

*People:* elves. *Family:* Sylvan elves. *Language:* sylvan. *Faith:* kindred_song. *Line:* engrailed. *Countries today:* 6.

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

*Ornament:* Shore towers with lantern roofs; a league of house-towers triples its charge.

*Rank and form:* council: a Warden elected by the houses of the coast: the silver engrailed border; confederation: a league of house-towers under one Warden-Speaker: the charge tripled.

*Breakaway difference:* a border engrailed of night sea (dissent tincture night sea).

### Gala Elves (`gala_court`)

*People:* elves. *Family:* Gala elves. *Language:* galic. *Faith:* rain_mirror. *Line:* invected. *Countries today:* 3.

*Palette:* court white `#f2eedc` (M); Gala gold `#d6b04e` (M); rain blue `#8aa8c9` (M); deep harbour `#2f4a6a` (C); keeper grey `#8a8a84` (C).

*Divisions:* plain, per_fess, chief.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `mirror_spring` (restoration) | a round pool rimmed in gold, with rain falling into it | the Mirror of First Rain: the past and the possible glimpsed, and never trusted plainly |
| `kings_ship` | a tall ship with white sails | the King's Ships in the harbour |
| `court_fountain` | a fountain | the open courts and fountains |

*Ornament:* No sun charge (kinship with the Sunhot is open), no rayonny line; rain and mirrored water instead.

*Rank and form:* kingdom: a king who reigns as long as he wills: the endless circlet. *Crown:* the endless circlet: a plain gold circlet with no points.

*Breakaway difference:* a border invected of keeper grey (dissent tincture keeper grey).

### Sunhot Elves of the Light (`sunhot_light`)

*People:* sun_elves. *Family:* Sunhot elves. *Language:* sunhot. *Faith:* noon_pilgrimage. *Line:* rayonny. *Countries today:* 1.

*Palette:* noon gold `#e0a02a` (M); sanctuary white `#f2e6c4` (M); flame orange `#b04a2a` (C); god-sea blue `#2f5f8a` (C); sky `#9ac0d8` (M).

*Divisions:* per_fess, plain.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `noon_door` (restoration) | a tall arched doorway with a sun disc resting in its arch | the sanctuary threshold where the light of the Sea of Gods is received |

*Ornament:* The noon-door is theirs alone; no rising sun with rays to the edges, no sun with a face, no red disc on white.

*Rank and form:* sanctuary: a Radiant Speaker chosen by the sanctuaries: never a crown, never called a king.

*Breakaway difference:* a border rayonny of flame orange (dissent tincture flame orange).

### Western Sanctuary Sunhot (`sunhot_western`)

*People:* sun_elves. *Family:* Sunhot elves. *Language:* sunhot. *Faith:* noon_pilgrimage. *Line:* rayonny. *Countries today:* 23.

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

*Ornament:* Tall, narrow charges; sanctuary things and the birds, beasts and plants of the sanctuary gardens; at most one sun disc in the culture; no weapons.

*Rank and form:* sanctuary: a Speaker chosen by its sanctuary: no crown; sanctuary white in the field.

*Breakaway difference:* a border rayonny of deep red (dissent tincture deep red).

### Isle Sunhot (`sunhot_isles`)

*People:* sun_elves. *Family:* Sunhot elves. *Language:* sunhot. *Faith:* noon_pilgrimage. *Line:* rayonny. *Countries today:* 17.

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

*Ornament:* Sanctuaries on shore terraces; no sun over waves (a real island flag), no dragon of the eastern kind.

*Rank and form:* sanctuary: a Speaker from each isle at the Council of the Chain: no crown.

*Breakaway difference:* a border rayonny of deep lagoon (dissent tincture deep lagoon).

### Volcano Clans (`volcano_clans`)

*People:* orcs. *Family:* Orcs. *Language:* orcish. *Faith:* skull_fire. *Line:* raguly. *Countries today:* 6.

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

*Ornament:* Black, red and ash; one skull at most in all the Dark Lands; no eye, no burning eye.

*Rank and form:* kingdom: a Warking acclaimed by the chiefs and broken in the ring: the tusk crown; clan: a clan chief: no crown. *Crown:* the tusk crown: a circlet of upturned tusks.

*Breakaway difference:* a border raguly of ash grey (dissent tincture ash grey).

### Iron Clans (`iron_clans`)

*People:* orcs. *Family:* Orcs. *Language:* orcish. *Faith:* skull_fire. *Line:* raguly. *Countries today:* 9.

*Palette:* iron `#5a5a60` (C); rust `#8a4a2a` (C); steel `#b0b0a8` (M); coal `#26262a` (C); forge orange `#c8642a` (C); slag green `#5a6a4a` (C).

*Divisions:* plain, per_fess, per_pale, per_bend, chief, base, per_chevron, pile_reversed.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `anvil` (restoration) | an anvil | the forge in every gate |
| `forge_tongs` | forge tongs holding a glowing bar | iron worked for Dondor and for sale |
| `ingot_stack` | a stack of ingots | iron prices set at the Free Moot |
| `forge_hammer` | a single forge hammer | the smith-chiefs |
| `crucible` | a crucible pouring | the smelters |
| `ore_pick` | an ore pick | the iron hills |
| `iron_chain` | an iron chain | tolls and captives |
| `moot_ring` | a ring of iron set with nine studs | the Free Moot of the holds |
| `toll_gate_bar` | a toll bar | the iron road tolls |

*Ornament:* Single smithing tools; no hammer crossed with any blade or sickle, no cogwheel.

*Rank and form:* clan: a hold-chief who keeps the iron and the ring until challenged: no crown; council: the Free Moot of the holds: the moot ring.

*Breakaway difference:* a border raguly of rust (dissent tincture rust).

### Wild Holds (`wild_holds`)

*People:* orcs. *Family:* Orcs. *Language:* orcish. *Faith:* hold_luck. *Line:* raguly. *Countries today:* 3.

*Palette:* hide brown `#6a5a40` (C); peat `#3a3a30` (C); lucky ochre `#a8a070` (M); bone `#d4c8a8` (M); moss `#5a6a3a` (C).

*Divisions:* plain, per_fess, base.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `bone_charm` | a bone charm on a cord | the luck of the hold |
| `holed_stone` (restoration) | a holed stone | the lucky stones of each hold |
| `casting_bones` | three casting bones | the Bone-Casting |

*Ornament:* Charms and luck, never priests' signs.

*Rank and form:* clan: a hold-chief by strength: no crown, no council.

*Breakaway difference:* a border raguly of peat (dissent tincture peat).

### Sea Orcs (`sea_orcs`)

*People:* orcs. *Family:* Orcs. *Language:* orcish. *Faith:* tide_skull. *Line:* raguly. *Countries today:* 3.

*Palette:* salt teal `#3a5a62` (C); drift grey `#8a8a82` (C); salt white `#e0dccf` (M); tar `#2a2c2e` (C); kelp `#4a5a3a` (C).

*Divisions:* per_fess, plain, chief.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `skerry_cairn` | a cairn on a skerry | the skerry-cairns of the Salt Tithe |
| `sea_gull_o` | a gull | the gull kingdom (canting) |
| `salt_cone` (restoration) | a cone of salt | the tithe of salt paid to the sea |

*Ornament:* Sea and salt; no skull (the Dark Lands' one skull is Gord's).

*Rank and form:* clan: a Sea-Chief by voyages won: no crown; council: a council of captains: the charge on a plain field.

*Breakaway difference:* a border raguly of tar (dissent tincture tar).

### Goblin Warrens (`goblin_warrens`)

*People:* goblins. *Family:* Goblins. *Language:* goblin. *Faith:* warren_luck. *Line:* potenty. *Countries today:* 0.

*Palette:* warren green `#5a6a3a` (C); cave black `#2a2a22` (C); hoard gold `#c8b050` (M); lamp yellow `#e0c860` (M); rust `#7e4a2c` (C).

*Divisions:* base, per_fess, chief, pile_reversed.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `warren_lamp` (restoration) | a lamp in a cave mouth | a lamp gone out is a warren doomed |
| `gold_hoard` | a heap of gold | goblins love gold and jewellery |
| `warren_trap` | a spring trap | the trap-rooms of the warren |
| `wolf_mount_head` | the head of a riding wolf | they ride wolves to move quickly on the surface (the card's word is under Q-14) |

*Ornament:* Lamps and gold in the dark; never a whole wolf-rider.

*Rank and form:* kingdom: a goblin kingdom under a hobgoblin king: the grown crown over the lamp; clan: a warren led by its cleverest goblin: no crown. *Crown:* the grown crown (hobgoblin): see the hobgoblin grammar.

*Breakaway difference:* a border potenty of rust (dissent tincture rust).

### Troll Tribes (`troll_tribes`)

*People:* trolls. *Family:* Peoples without kin. *Language:* trollish. *Faith:* stone_hunger. *Line:* urdy. *Countries today:* 1.

*Palette:* troll moss `#6d7a5a` (C); cave umber `#4a4030` (C); stone grey `#a09878` (M); bog black `#2a2a24` (C); bone `#cfc4a8` (M).

*Divisions:* per_fess, base, plain.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `boulder` | a great boulder | the stone that feeds them |
| `troll_club` | a knotted club | the challenge that decides who leads |
| `bog_pool` | a bog pool | the bogs where they lay their dead |
| `border_heap` (restoration) | a heap of stones | the stone-heaps at the tribe borders |

*Ornament:* Rough boulders and clubs; no metal tinctures.

*Rank and form:* clan: the oldest unbeaten troll leads: no crown; the boulder is the largest charge.

*Breakaway difference:* a border urdy of bog black (dissent tincture bog black).

### Hill Giants of Hiloron (`hill_giants`)

*People:* giants. *Family:* Peoples without kin. *Language:* gigantic. *Faith:* giant_cairn. *Line:* arched. *Countries today:* 1.

*Palette:* cairn brown `#7c6a58` (C); hill moss `#4f5a40` (C); stone `#b0a888` (M); deep earth `#3e3e36` (C); chalk `#e0dccb` (M).

*Divisions:* base, per_fess, plain.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `great_cairn` | a great cairn | a stone for every year of a giant's life; the cairns are the giants' memory |
| `year_stones` (restoration) | a row of standing stones of rising height | the counting of years by stones |

*Ornament:* One great stone filling the flag.

*Rank and form:* council: a High Chief chosen by the cairn-keepers: the great cairn, no crown; subject: if the realm is a Concord dominion (Q-05), the charter border.

*Breakaway difference:* a border arched of deep earth (dissent tincture deep earth).

### Ice Giants of Titanos (`ice_giants`)

*People:* giants. *Family:* Peoples without kin. *Language:* gigantic. *Faith:* giant_cairn. *Line:* arched. *Countries today:* 1.

*Palette:* glacier blue `#9fc4d8` (M); rime white `#e8eef2` (M); deep ice `#2f4a5a` (C); frost grey `#8a9aa4` (M).

*Divisions:* base, per_fess, plain.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `ice_throne` | a throne of ice | the Ice-Throne of Titanos |
| `frost_cairn` (restoration) | a cairn of ice blocks | the cold honoured as an old spirit of ice |

*Ornament:* Huge, simple ice shapes.

*Rank and form:* kingdom: a Frost-King chosen by the cairn-keepers: the ice throne is the crown.

*Breakaway difference:* a border arched of frost grey (dissent tincture frost grey).

### Yeti Clans (`yeti_clans`)

*People:* yeti. *Family:* Peoples without kin. *Language:* yetic. *Faith:* yeti_hum. *Line:* dancetty. *Countries today:* 1.

*Palette:* yeti white `#e6eef4` (M); hum blue `#8a9cb2` (M); rock slate `#3e4c5a` (C); dusk violet `#5e5476` (C).

*Divisions:* base, per_chevron.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `hum_cave` (restoration) | a dark cave mouth in a white peak | the Hum-Caves where the mountain's hum is answered at dusk |

*Ornament:* Three peaks; the hum is drawn as a cave answering, never as radiating arcs.

*Rank and form:* clan: the clan follows the voice that carries furthest: no crown.

*Breakaway difference:* a border dancetty of rock slate (dissent tincture rock slate).

### Ents of Kilinti (`kilinti_ents`)

*People:* ents. *Family:* Peoples without kin. *Language:* longspeech. *Faith:* ent_slow. *Line:* rooted. *Countries today:* 1.

*Palette:* ent green `#3f6b2e` (C); bark umber `#5e4e32` (C); moss pale `#a8b890` (M); deep grove `#263a20` (C); sap amber `#b89a4a` (M).

*Divisions:* plain, base.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `eldest_tree` | an ancient tree with spreading roots | the Eldest, who speaks last |
| `growth_rings` (restoration) | a cut trunk showing its rings | the Ent-Moot every seventh Thaw |
| `moot_grove` | a ring of trees | the Moot-Grove |

*Ornament:* Trees always with roots.

*Rank and form:* forest domain: the Eldest speaks last: a rooted tree, no crown; subject: the Concord charter border.

*Breakaway difference:* a border rooted of bark umber (dissent tincture bark umber).

### Grave Hosts of Volgan (`grave_hosts`)

*People:* the_dead. *Family:* Peoples without kin. *Language:* grave_rite. *Faith:* grave_cult. *Line:* straight. *Countries today:* 1.

*Palette:* grave black `#1e1a24` (C); ash violet `#5b5566` (C); ember red `#a83a2a` (C); bone `#cfc6b0` (M); pall grey `#3c3844` (C).

*Divisions:* plain.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `nafeher_gate` (restoration) | an arched gate standing open, dark within, with ember light at its threshold | the Gate of Nafeher and the rite of Names and Gates |
| `ring_of_names` | a ring of short notches | the names the necromantic orders keep |

*Ornament:* No eye (another fiction's dark lord), no skull, no figure; the Gate and the Names.

*Rank and form:* kingdom: the Dominion: the Gate, no crown, because the crown is not a person's to wear in the arms; overlord: sworn realms carry a base of grave black.

*Breakaway difference:* a border of pall grey (dissent tincture pall grey).

### Zol's Dead (`zols_dead`)

*People:* the_dead. *Family:* Peoples without kin. *Language:* None. *Faith:* none. *Line:* straight. *Countries today:* 1.

*Palette:* void black `#0a0a0c` (C); cold grey `#6a6a72` (C); ash dark `#2a2a30` (C).

*Divisions:* plain.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `broken_rings_sigil` (restoration) | a sigil of broken concentric rings | The Will of Zol, the emblem that leads the realm; nothing about who governs for Zol is said |

*Ornament:* Nothing but the sigil of the emblem that leads the realm.

*Rank and form:* emblem realm: led by an emblem, The Will of Zol: the field is void and the sigil is the whole achievement.

*Breakaway difference:* none: a realm of the dead does not break away in heraldry (dissent tincture ash dark).

### Netherborn (`netherborn`)

*People:* demons. *Family:* Peoples without kin. *Language:* infernal. *Faith:* pact_rite. *Line:* rent. *Countries today:* 3.

*Palette:* nether red `#9b2a2a` (C); ash black `#2a1a1a` (C); ember gold `#d8a060` (M); obsidian `#120c0c` (C); sulphur `#c8b04a` (M); ash white `#d8cfc4` (M).

*Divisions:* per_bend, per_fess, pile, plain.

| Charge | Drawn as | Meaning in this culture |
| --- | --- | --- |
| `pact_horn` | a single curved horn | the pact-horn of a lord of the Nether |
| `pact_seal` (restoration) | a blank wax seal with a thumb-print | the pact and the pact-name known only to the pact |
| `obsidian_blade` | an obsidian blade | oaths of blood and ash |

*Ornament:* Original pact sigils only: no pentagram, no inverted cross, no goat in a star (Q-24).

*Rank and form:* kingdom: a Lord or Queen of the pact: the pact-charge; sworn realms take the grave black base.

*Breakaway difference:* a border rent of obsidian (dissent tincture obsidian).

## 5. Grammars of the peoples

People grammars sit above the culture cards.
For peoples with culture entries they state what every culture of the people shares; for peoples with no culture entry (dwarves, small folk, hobgoblins, dwarf goblins, ogres, gnomes, devils) they are the whole grammar, ready for the realms the roster redesign adds.

### Men (`men`)

*Status:* culture entries exist. *Line:* by family (Ainic straight with the label, Boreal indented, Eastern stepped, Orran nebuly, Yonic wavy).

*Divisions:* plain, per_fess, per_pale, per_bend, chief, base, per_chevron, quarterly.

*Ornament:* Plain edges; crowns drawn as circlets of the culture; beasts walk or stand, never rampant in a lion-of-a-national-arms pose.

*Rank and form:* Monarchies wear the culture crown over the primary charge; councils and leagues wear none; subjects take their overlord's mark.

*Kinship:* Through the five family lines; mixed realms borrow one tincture or one secondary charge of their second culture.

*Cultures:* `lake_aenoran`, `selen_ranger`, `steppe_rider`, `wall_folk`, `march_folk`, `isle_houses`, `leren_sea_kings`, `free_crowns_north`, `dondor_brutes`, `mirolon_wardens`, `dead_lands_freeholds`, `zilin_pilgrims`, `veiled_folk`, `redbark_tribes`, `winter_crown`, `ice_clans`, `isengard_warlords`, `windwaith_seafarers`, `gunwaith_clans`, `girdon_wardens`, `western_guilds`, `buldor_companies`, `chart_islanders`, `corsair_lords`, `noris_riders`, `caravan_princes`, `river_kings`, `lake_road_cities`, `red_lands_tribunes`, `southern_islanders`, `goodin_sunfolk`.

### Elves (Great Folk) (`elves`)

*Status:* culture entries exist. *Line:* engrailed (Sylvan) or invected (Galic).

*Divisions:* plain, per_fess, per_bend, per_chevron, flaunches, chief, bordure.

*Ornament:* Silver in every achievement; long, drawn-out charges; no crown of points, only a leaf circlet for the few hill queens and kings.

*Rank and form:* Elected speakers wear an engrailed silver border; a hall-crowned queen or king wears the leaf circlet; leagues of house-towers triple their charge.

*Kinship:* Sylvan cultures share the engrailed line and silver; Gala keeps its own invected line because its relation to the Sunhot elves is open.

*Cultures:* `forest_council_elves`, `hill_kingdom_elves`, `lake_elves`, `pass_wardens`, `rift_coast_elves`, `gala_court`.

### Sunhot elves (`sun_elves`)

*Status:* culture entries exist. *Line:* rayonny.

*Divisions:* per_fess, per_pale, per_bend, chief, base, per_chevron, pile_reversed, bordure.

*Ornament:* Tall, narrow charges (the Sunhot stand over three metres); no weapons, because no weapon passes a sanctuary door.

*Rank and form:* No Sunhot realm is a kingdom: elders are never called kings. A Speaker's realm is shown by a sanctuary-white field part; the Lands of Light alone may bear the noon-door.

*Kinship:* The rayonny line. Men under Sunhot patronage carry it on a chief only.

*Cultures:* `sunhot_light`, `sunhot_western`, `sunhot_isles`.

### Dwarves (`dwarves`)

*Status:* no culture entry; homeland open (Q-19); no realm on the current roster. *Line:* dovetailed.

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

*Kinship:* Dovetailed lines only; no shared tincture with any elven arms (dwarves dislike elves). Dwarf goblins do not use the dovetail until Q-19 decides whether they are dwarves.

### Small folk (`small_folk`)

*Status:* no culture entry; the people's name and homeland are open (Q-06); no realm on the roster. *Line:* double_arched.

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

*Kinship:* None declared; the double-arched line is theirs alone until Q-06 is answered.

### Goblins (`goblins`)

*Status:* one culture entry (goblin_warrens, no realm today); a goblin kingdom is planned for the Middle Lands mountains (R-25). *Line:* potenty.

*Ornament:* See the goblin_warrens culture.

*Rank and form:* See the goblin_warrens culture.

*Kinship:* Potenty line; a goblin realm with hobgoblin defenders adds the hobgoblin's carried stone as secondary charge.

*Cultures:* `goblin_warrens`.

### Hobgoblins (`hobgoblins`)

*Status:* no culture entry; they live inside goblin warrens; Q-21 asks whether the goblin king is meant to rule the whole people. *Line:* potenty (heavier, two notches only).

*Palette:* warren green `#5a6a3a` (C); cave black `#2a2a22` (C); hoard gold `#c8b050` (M); quarry grey `#8a8676` (C); rust `#7e4a2c` (C).

*Divisions:* base, per_fess, pile_reversed, chief.

| Charge | Drawn as | Meaning |
| --- | --- | --- |
| `carried_stone` | a great stone slung on a yoke | the heavy labour of the warren |
| `stone_mallet` | a stone-headed mallet | the defenders' weapon from the cards |
| `grown_crown` | a goblin crown too small for its wearer, set on a mallet | the goblin king is a hobgoblin who simply grew very big |

*Ornament:* Goblin ornament scaled up: fewer, larger shapes.

*Rank and form:* A hobgoblin-led warren-realm puts the grown crown over the goblin charge; otherwise hobgoblins appear only as a secondary charge in goblin arms.

*Kinship:* Always paired with goblin tinctures; never a hobgoblin realm without goblins.

### Dwarf goblins (`dwarf_goblins`)

*Status:* no culture entry; whether they are dwarves, goblins or their own people is Q-19. *Line:* bevilled.

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

### Giants (`giants`)

*Status:* culture entries exist (Hiloron, Titanos); the Forgotten Giants are unplaced. *Line:* arched.

*Divisions:* base, per_fess, plain, pile_reversed.

*Ornament:* One huge charge filling the flag; giants do not draw small things.

*Rank and form:* A High Chief or Frost-King is shown by the seat or the cairn itself, not by a crown.

*Kinship:* The single arch is shared by every giant realm (the cairn seen from afar).

*Cultures:* `hill_giants`, `ice_giants`.

### Orcs (`orcs`)

*Status:* culture entries exist. *Line:* raguly.

*Divisions:* plain, per_fess, per_bend, per_chevron, pile_reversed, chief, base.

*Ornament:* Hard silhouettes, no fine detail; skulls capped at one per region.

*Rank and form:* A Warking wears a crown of tusks; a hold-chief none; a Free Moot shows its ring.

*Kinship:* Raguly line shared with ogres; goblins keep their own potenty line.

*Cultures:* `volcano_clans`, `iron_clans`, `wild_holds`, `sea_orcs`.

### Trolls (`trolls`)

*Status:* culture entry exists (troll_tribes). *Line:* urdy.

*Divisions:* per_fess, base, plain.

*Ornament:* Rough boulder shapes; no metal tinctures except bone.

*Rank and form:* The oldest unbeaten troll is shown by the boulder being the largest charge; no crowns (Q-21 on Smash).

*Kinship:* None declared; ogres resemble trolls in look but are drawn with the orcish line.

*Cultures:* `troll_tribes`.

### Ogres (`ogres`)

*Status:* no culture entry; few in number, in caves and mountains or with orcs in forests. *Line:* raguly.

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

### Gnomes (`gnomes`)

*Status:* no culture entry; homes inside trees or in the ground; places on the cards are unplaced (Q-23). *Line:* escartelly.

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

### Yeti (`yeti`)

*Status:* culture entry exists (yeti_clans). *Line:* dancetty.

*Divisions:* base, per_chevron, plain.

*Ornament:* Three big peaks; sound is drawn as a cave answering, never as radiating arcs.

*Rank and form:* The clan follows the one whose song carries furthest: no crowns, no seats.

*Kinship:* Old pacts with the ice clans and Titanos are shown by sharing the snow white tincture, not a line.

*Cultures:* `yeti_clans`.

### Ents (`ents`)

*Status:* culture entry exists (kilinti_ents). *Line:* rooted.

*Divisions:* plain, base, per_fess.

*Ornament:* Every tree is shown with its roots.

*Rank and form:* The Eldest speaks last: no crown; a forest domain is shown by the rooted line.

*Kinship:* The men at the forest edge may add one tincture or charge of their own culture as secondary. Coniferons (Q-18) would share the rooted line if they are kin.

*Cultures:* `kilinti_ents`.

### The dead (`the_dead`)

*Status:* culture entries exist (grave_hosts, zols_dead); the relation between the two realms is open. *Line:* none.

*Divisions:* plain, base.

*Ornament:* No beasts, no plants, no persons. Volgan's realm shows a gate; Zol's Mistake shows only its leader's sigil.

*Rank and form:* Sworn realms of Volgan carry a grave black base; nothing in any dead realm's arms states who rules for Zol.

*Kinship:* None: the two realms of the dead share no device, because their relation is open.

*Cultures:* `grave_hosts`, `zols_dead`.

### Demons (`demons`)

*Status:* culture entry exists (netherborn); Afrit's demons are never shown. *Line:* rent.

*Divisions:* per_bend, per_fess, pile, plain.

*Ornament:* Original sigils only: no pentagram, no inverted cross, no goat's head in a star (Q-24).

*Rank and form:* A lord or queen of a pact-realm shows its pact-charge; sworn realms take Volgan's grave base.

*Kinship:* The rent line; devils use the fracted line and are never confused with demons.

*Cultures:* `netherborn`.

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

## 6. The country designs

Each record in `heraldry.json` `countries` holds: tag, name, region, culture (and second culture), people, family, form, overlord, the field (division, line, tinctures with hex and source), the primary charge (id, name, meaning, class, tincture, count, contrast, fimbriation), the secondary charge, the marks, a blazon (the image prompt's description), the meaning in one sentence, a design hash and `provisional: true`; some carry a canon note.
The tables below give the design in short and its meaning; the blazon in the JSON is the full description.

| Region | Flags | Largest charge classes |
| --- | ---: | --- |
| Middle Lands | 30 | tool 9, building 3, token 3 |
| North Lands | 28 | beast 10, tree 6, bird 4 |
| Dark Lands | 24 | token 9, tool 5, landform 3 |
| Dead Lands | 13 | weapon 2, tool 2, building 2 |
| Magical Lands | 22 | building 5, body_part 3, bird 3 |
| Cold Lands | 31 | beast 8, bird 6, sea_creature 5 |
| West Lands | 21 | tool 6, token 3, beast 3 |
| Triton's Islands | 34 | tool 9, sea_creature 7, token 5 |
| East Lands | 35 | tool 7, building 5, vessel 3 |
| Islands of the South | 19 | sea_creature 6, shell 3, tool 3 |
| Lands of the Sun | 47 | building 9, tool 6, fire 4 |
| Zol's Mistake | 1 | sigil 1 |

### Middle Lands

| Tag | Name | Culture | Design | Meaning |
| --- | --- | --- | --- | --- |
| Y0L | Aenor | lake_aenoran | plain, lake blue; a bowl-lamp with one flame in lamp gold [crown] | Aenor bears the lamp of the traveller under the lamp-crown on lake blue and no label, because the crown of Aen's own realm needs no difference; the arms say the realm keeps the light for every stranger. |
| Y0R | Safeton | lake_aenoran | base, Parim white and lake blue; a lake barge with a square sail in bell bronze [label, charter border] | Safeton's barge rides a base of lake blue: the second harbour of the Great Lake, where every barge between Parim and the passes takes on cargo, sealed into the Concord by the charter border. |
| Y4M | Fotan | lake_aenoran | per fess, pale gold and lake blue; a bell in deep lake [label] | Fotan rings its own bell: a lake town that sealed no charter of Parim, so it carries Aen's label of kinship but no charter border. |
| Y4N | Ulgus | lake_aenoran | plain, deep lake; a pike swimming in pale gold [label, charter border] | Ulgus bears the pike of the lake fisher-guilds on deep water: a dominion that feeds Parim's tables in the fasting weeks. |
| Y4P | Stendorler | lake_aenoran | chief, Parim white and lake blue; a single-arched canal bridge in slate [label, charter border] | Stendorler's single-arched bridge of pale stone stands for the canal town that holds the lake road's one crossing; the blue chief is the water it spans. |
| Y4S | Tieri | lake_aenoran | per bend, slate and Parim white; an arched window with a lamp in it in lamp gold [label, charter border] | Tieri's lit window is the inn-town on the high road, where a lamp burns in every window by charter; slate and white are its roofs and walls. |
| Y4X | Dariap | lake_aenoran | per pale, lake blue and Parim white; a round loaf in bell bronze [label, charter border] | Dariap bears the guest's loaf across lake blue and white: a granary dominion whose charter owes bread to Parim in hard years. |
| Y4Y | Novez | lake_aenoran | plain, slate; a swan swimming in Parim white [label, charter border] | Novez bears a white swan on slate: the reed-shore estates of the old lake families, quiet and rich. |
| Y50 | Mondon | lake_aenoran | per bend sinister, deep lake and pale gold; a straw skep in bell bronze [label, charter border] | Mondon's straw skep is the honey of the lake meadows that becomes the Concord's honey ale. |
| Y51 | Freshon | lake_aenoran | per chevron, Parim white and lake blue; a sheaf of barley in lamp gold [label, charter border] | Freshon bears barley over a chevron of lake blue: four states of grain land watered from the lake, the bread-basket of the southern shore. |
| Y53 | Pazoma | lake_aenoran | chief, lake blue and pale gold; a closed book with clasps in Parim white [label, charter border] | Pazoma bears the clasped book of statute: the dominion whose clerks copy the Reckoning of Lines for the Concord courts. |
| Y0M | Selen | selen_ranger | plain, wood green; a hollow oak with its roots in birch white; three arrows, points down [label, charter border] | Selen bears the Moot Tree with the Three Arrows: the woodland moots choose the First Warden under the oak and keep the Quiet Law, inside the Concord by charter but never under a crown. |
| Y4O | Vothrim | selen_ranger | per fess, deep green and bark brown; three arrows, points down in ash silver [label, charter border] | Vothrim bears the Three Arrows alone: the ranger country of the poachers' fines, where a debt to the moot is paid in arrows. |
| Y4R | Svenlor | selen_ranger | per bend, wood green and birch white; a curled hunting horn in bark brown [label, charter border] | Svenlor's curled horn is the call of the wardens who ride the western woods between Selen and the passes. |
| Y0N | Konori | steppe_rider | plain, steppe red; a horse's head in black felt [label, crown, charter border] | Konori's horse's head on the white felt says the king is acclaimed on a felt by the horse-lords and that his oath is carried to the sky on a horse. |
| Y4V | Kunhrim | steppe_rider | per fess, felt white and horse brown; a saddle in steppe red [label, charter border] | Kunhrim bears the bride's saddle: a dominion of horse-breeders who bind clans by the horse-gift marriage. |
| Y4W | Hunhun | steppe_rider | per bend, felt white and steppe red; a horse-tail standard on a pole in black felt [label, host marks, charter border] | Hunhun, 'many horses', bears the horse-tail standard of the Gathering where its Horse-Lord is chosen, and the hoof-marks of the host beneath it. |
| Y4Z | Noloreh | steppe_rider | per chevron, dusk blue and steppe gold; a wooden bowl in felt white; a beacon: a fire-basket on a pole [label, charter border] | Noloreh bears the guest's milk bowl with the march-folk beacon beneath it: riders and farmers of the steppe edge who share the bowl and the watch-fire. |
| Y0P | Kingson | wall_folk | per chevron, snowline white and range grey; a large key in pass bronze [label, charter border] | Kingson's key under the snow peaks is the Gate-Lord's charge: the family that holds the great pass in the king's name and trades at its gate. |
| Y4Q | Olvinc-un | wall_folk | plain, granite; an ibex standing in snowline white [label, charter border] | Olvinc-un bears the ibex of the high pastures: a watch-family country above the snowline of the range. |
| Y4T | Hilofrim | wall_folk | per fess, range grey and lichen green; a straight watch-horn in snowline white; a great cairn [label, charter border] | Hilofrim sounds the watch-horn above a giants' cairn: men of the watch who live at the foot of the giants' hills and keep the old pact with them. |
| Y4U | Klungori Guard | wall_folk | pile reversed, lichen green and range grey; a crossbow in snowline white [label, charter border] | The Klungori Guard bears the crossbow of the watch under a rising peak: a garrison country whose posts pass from parent to eldest child. |
| Y0S | Noleksun | march_folk | plain, field green; a ploughshare (three) in chalk white [label, charter border] | Noleksun's three ploughshares are its households: a confederacy of free farmers whose Chief Speaker is chosen by every hearth. |
| Y52 | Belurithon | march_folk | per fess, march ochre and field green; an ox-yoke in palisade brown [label, charter border] | Belurithon bears the shared ox-yoke: farms divided among sons and still ploughed together. |
| Y55 | Herez | march_folk | per chevron, chalk white and palisade brown; a beacon: a fire-basket on a pole in beacon red [label, charter border] | Herez bears the beacon alone: the Marcher-Lord's stone fort on the pass lights the first fire of the southern frontier. |
| Y0T | Asgard | isle_houses | per fess, foam white and sea grey; a lighthouse with a red fire in deep sea [label, crown, charter border] | Asgard bears its lighthouse-shrine under the oar-crown of the queen the great houses choose: the isle names its dead at the flood and Parim's ships steer by its fire. |
| Y54 | Cursed Lands | veiled_folk | per fess, veil grey and char; a single loose knot in a cord, both ends hanging in undyed wool | The Cursed Lands bear a cord tied in one knot with its ends hanging free: the Veiled keep every name tied into its mother's line, and no register of the Lost has untied them. |
| Y8E | Bloody Forest | redbark_tribes | per pale, redbark and deep bark; a stag's antlers (attires) in antler bone; a beaded cord hanging | The Bloody Forest bears a stag's antlers with a beaded cord: the hunting clans of the cord-mothers, kin by tongue to the Veiled and never tamed by Parim. |
| Y0Q | Hiloron | hill_giants | base, hill moss and cairn brown; a great cairn in chalk [charter border] | Hiloron, the giants' hill, bears a great cairn on its hill: its High Chief is chosen by the cairn-keepers, and a dispute is won by naming the older cairn. |
| Y0O | Kilinti | kilinti_ents | plain, deep grove; an ancient tree with spreading roots in moss pale; three arrows, points down [charter border] | Kilinti bears the Eldest with its roots spread and the Selen rangers' arrows beneath: a forest whose moot takes years to say a sentence, while the men at its edge keep its accounts and its charter with Parim. |

### North Lands

| Tag | Name | Culture | Design | Meaning |
| --- | --- | --- | --- | --- |
| Y0G | Lerendor | leren_sea_kings | plain, strait blue; two waves, one above the other in salt white [label, crown] | Lerendor bears two waves under the ship-crown: one High Crown over Lerendor and Lerenwaith, the northern counterweight to Parim. |
| Y0I | Eekedor | leren_sea_kings | per fess, salt white and strait blue; a salt cellar in deep strait [label] | Eekedor bears the salt cellar of the arbitration table, where the Free Crowns bring their feuds and salt shared binds both sides. |
| Y0J | R'en | leren_sea_kings | plain, deep strait; a gull in salt white [label, crown] | R'en's gull over deep water is the skerry kingdom of the herring grounds, a crown of the Leren Compact. |
| Y0K | Tolhon | leren_sea_kings | per bend, strait blue and Leren silver; a seal in deep strait [label, crown] | Tolhon bears the seal of the hunting skerries, whose sealskin clothes the strait. |
| Y2M | Allegro | leren_sea_kings | per pale, kelp green and salt white; a high-prowed ship with one square sail in deep strait; a hawthorn in blossom [label, crown] | Allegro's ship with the hawthorn of the inland crowns says it is a Leren harbour married into the Free Crowns of the hills. |
| Y2N | Keredor-Hellekton | leren_sea_kings | per pale, strait blue and kelp green; a steering oar in salt white [label, crown] | Keredor-Hellekton, two lordships under one crown, is impaled blue and green with the steering oar across both: one helm for two shores. |
| Y2U | Low-ness Islands | leren_sea_kings | base, salt white and strait blue; a black skerry rock in deep strait [label] | The Low-ness Islands bear a black skerry above the sea: low rocks of the outer coast governed by their boat-owners. |
| Y0H | Molot | free_crowns_north | plain, hearth red; a bull standing in fleece white [label, crown] | Molot's crowned bull on hearth red is the strong hand of its lords and their cattle-wealth; of all the Free Crowns it leans closest to Lerendor's court. |
| Y2O | Belg | free_crowns_north | plain, fir green; a badger in fleece white [label, crown] | Belg's badger is the dug-in hill-fort that has outlasted every feud around it. |
| Y2P | Goran | free_crowns_north | plain, straw gold; a crane standing in peat black [label, crown] | Goran's crane stands in the marsh lowlands it rules, watching. |
| Y2Q | Sensai | free_crowns_north | per fess, fleece white and fir green; a bear walking in peat black [label, crown] | Sensai, the largest of the Free Crowns, bears the walking bear of the great forest and the oldest crown of the hills. |
| Y2R | Gil'dul | free_crowns_north | plain, peat black; an owl in straw gold [label, crown] | Gil'dul's owl is the patience of a small crown that wins its feuds at Eekedor's table. |
| Y2S | Ashorn | free_crowns_north | plain, hill grey; an ash tree in peat black [label, crown] | Ashorn bears an ash with its crown in the branches, canting on its name and its moot hill. |
| Y2T | Gul'dur | free_crowns_north | per bend, earth brown and peat black; a wolf walking in fleece white [label, crown] | Gul'dur's crowned wolf remembers the winter raids it endured and returned in kind. |
| Y2V | Heodwa Lands | free_crowns_north | plain, fleece white; a rowan tree in berry in hearth red [label, crown] | The Heodwa Lands bear the rowan planted at every hall door against ill luck. |
| Y2W | Nuatax | free_crowns_north | chief, fleece white and hearth red; an otter in earth brown [label, crown] | Nuatax's otter keeps the river-fords and eel weirs of its two valleys. |
| Y2X | Solenkovi | free_crowns_north | plain, earth brown; a hare in fleece white [label, crown] | Solenkovi's hare is the open downs and the quick riders of its three states. |
| Y2Y | Stork | free_crowns_north | per fess, straw gold and earth brown; a stork in fleece white [label, crown] | Stork bears a stork, canting on its name: the birds nest on its hall roofs every spring. |
| Y2Z | Cinargo | free_crowns_north | per pale, hill grey and hearth red; a lynx in straw gold [label, crown] | Cinargo's lynx is the high wood above a crown that is small and hard to catch. |
| Y30 | The Hold | free_crowns_north | base, hill grey and fir green; a timber hall on a mound in peat black [label, crown] | The Hold bears its own timber hall on a mound, the hill-fort that names it, with the crown hung on the gable. |
| Y31 | Mustnom | free_crowns_north | per bend sinister, straw gold and fir green; a ram in peat black [label, crown] | Mustnom's ram is the wool of the hill farms that pays its crown. |
| Y32 | Ferlinon | free_crowns_north | chief, earth brown and straw gold; a yew tree in fleece white [label, crown] | Ferlinon bears a yew: the bow-staves its woods send to every hall of the North. |
| Y33 | Thowson | free_crowns_north | per fess, peat black and fir green; a birch tree in fleece white [label, crown] | Thowson's birch is the northern birch wood where its crown is chosen. |
| Y34 | Mina | free_crowns_north | per chevron, fleece white and hill grey; a miner's pick in peat black [label, crown] | Mina bears the miner's pick of the hill mines that make it rich among the Free Crowns. |
| Y35 | Mine Din | free_crowns_north | base, fir green and peat black; a mole in fleece white [label, crown] | Mine Din's mole is its miners, who work unseen under the hill; old heraldry honoured the mole for the same reason. |
| Y36 | Oirt | free_crowns_north | per pale, fleece white and earth brown; a hawthorn in blossom in hearth red [label, crown] | Oirt bears the hawthorn of hedged fields and of the marriage-boughs carried at crown-sharing weddings. |
| Y37 | Pertawn | free_crowns_north | chief, fir green and fleece white; an alder tree in straw gold [label, crown] | Pertawn's alder stands in the wet valleys that are its whole kingdom. |
| Y38 | Filit | free_crowns_north | per bend, fir green and hill grey; a fox in hearth red [label, crown] | Filit's fox is cunning in feud: the smallest crown, and never yet swallowed. |

### Dark Lands

| Tag | Name | Culture | Design | Meaning |
| --- | --- | --- | --- | --- |
| Y19 | Dondor | dondor_brutes | plain, hold black; a bearded axe in ash; a forged bar with ring ends [label, crown] | Dondor bears the bearded axe over the hearth-iron under its iron band: the hold-land whose king is chosen from the strongest line and who leads the Dark Sea Accord against Goldoroth. |
| Y4I | Blackton | dondor_brutes | per fess, hold black and strait blue; a chain of three links in bone [label, crown] | Blackton's feud-chain over sea-blue says the Leren sailors who settled the Dark Lands coast took Dondor's blood-law and kept their own sea. |
| Y1A | Goldoroth | volcano_clans | plain, obsidian; a fire-mountain with a plume of flame in lava red [crown] | Goldoroth, the high gold-land, bears the Fire-Mountain under the tusk crown of a Warking who holds the throne until a stronger orc breaks him in the ring. |
| Y48 | Sungodor | volcano_clans | per fess, ash black and lava red; a fire in a stone bowl in sulphur | Sungodor bears the clan fire that never goes out. |
| Y49 | Dark Gate | volcano_clans | per chevron, ember orange and ash black; a black ridge split by a narrow gap in obsidian | Dark Gate bears the black ridge split by its narrow gap, canting on its name. |
| Y4A | Zuriath | volcano_clans | chief, ash grey and obsidian; a ring of upright stakes in bone | Zuriath's ring of stakes is the challenge ring where its chiefs are made and broken. |
| Y4B | Bold | volcano_clans | per bend, lava red and obsidian; a curved war-horn in bone | Bold bears the war-horn that musters the clans. |
| Y4C | Gord | volcano_clans | plain, ash grey; a skull on a cairn of stones in ash black | Gord bears the skull cairn where the clan honours its dead: the only skull in the arms of the Dark Lands. |
| Y43 | Bordon | iron_clans | plain, coal; an anvil in steel | Bordon bears the anvil: a hold kept separate by its own forge and its own ring. |
| Y44 | Dreson | iron_clans | per fess, iron and rust; forge tongs holding a glowing bar in forge orange | Dreson's tongs hold a glowing bar: iron worked for Dondor and sold to anyone else. |
| Y4D | Beriath | iron_clans | chief, coal and rust; a stack of ingots in steel | Beriath bears the ingots it brings to the Free Moot. |
| Y4F | Britadon | iron_clans | per bend, slag green and coal; a single forge hammer in steel | Britadon bears the single hammer of its smith-chiefs. |
| Y4H | Dulundur | iron_clans | plain, rust; a ring of iron set with nine studs in steel | Dulundur bears the studded iron ring of the Free Moot of the holds, which meets there to settle tolls and iron prices. |
| Y4J | Colost | iron_clans | base, steel and coal; a crucible pouring in rust | Colost bears the pouring crucible of its smelters. |
| Y4K | The Darks | iron_clans | per pale, coal and iron; an ore pick in forge orange | The Darks bear the ore pick of the iron hills. |
| Y4L | Dunbulinor | iron_clans | per chevron, iron and coal; an iron chain in steel | Dunbulinor bears an iron chain: tolls taken and captives held. |
| Y8C | Fondor | iron_clans | pile reversed, slag green and steel; a toll bar in coal | Fondor bears the toll bar of the iron road it straddles. |
| Y1C | Dun | wild_holds | plain, hide brown; a holed stone in bone | Dun bears the holed lucky stone of its hold. |
| Y46 | The Doltu | wild_holds | per fess, moss and peat; a bone charm on a cord in bone | The Doltu bear a bone charm: the luck of a hold that trusts no priest. |
| Y47 | Wild Lands | wild_holds | base, lucky ochre and peat; three casting bones in peat | The Wild Lands bear the three bones of the Bone-Casting. |
| Y1B | Belonton | sea_orcs | per fess, salt teal and tar; a cairn on a skerry in salt white | Belonton bears a skerry-cairn: the sea orcs who pay the sea its tithe and keep faith with Dondor. |
| Y4E | Gull Kingdom | sea_orcs | plain, drift grey; a gull in tar | The Gull Kingdom bears a gull, canting on its name. |
| Y4G | Lestern Isles | sea_orcs | chief, kelp and salt teal; a cone of salt in salt white | The Lestern Isles bear the cone of salt their council of captains pays to the sea each season. |
| Y45 | Troll Forest | troll_tribes | per fess, troll moss and bog black; a great boulder in stone grey; a heap of stones | The Troll Forest bears a great boulder over the border stone-heap: the stone that feeds the tribes, and the warning at their edge that the free holds heed. |

### Dead Lands

| Tag | Name | Culture | Design | Meaning |
| --- | --- | --- | --- | --- |
| Y0Y | Mirolon | mirolon_wardens | plain, night blue; a heron standing on one leg in heron white; a lamp with its flame blown to one side [label] | Mirolon, the lake-watch, bears a heron keeping watch over the lamp turned south: the wardens' monthly vigil against an enemy the rest of Aoaz laughed at. |
| Y0Z | Nan | dead_lands_freeholds | per bend, tar black and sand; a gaff hook in salt white [label] | Nan's gaff hook is its warlord's toll on every boat that passes: the one freehold ruled by force. |
| Y7M | Mirodor | dead_lands_freeholds | plain, sea teal; a flat-bottomed boat in sand [label] | Mirodor bears the flat boat of the Mirolonese who fled north and came back to the coast. |
| Y7N | Mencnon | dead_lands_freeholds | per fess, sand and sea teal; a salt-pan with heaped salt in tar black [label] | Mencnon bears the salt-pan: its salt is traded along the coast and laid in every grave. |
| Y7O | Luminor | dead_lands_freeholds | plain, tar black; a storm lantern in sand [label] | Luminor bears a storm lantern, canting on its name: a light kept burning against the Dead Lands storms. |
| Y7P | Bennen | dead_lands_freeholds | base, salt white and sea teal; a crab in mud brick [label] | Bennen's crab is its mud shore and the patience of a people that does not leave. |
| Y7Q | Gelon | dead_lands_freeholds | plain, mud brick; a wide straw hat in sand [label] | Gelon bears the salt-worker's straw hat: a freehold of the open pans. |
| Y7R | Olen | dead_lands_freeholds | chief, sand and storm grey; a low mud-brick house in mud brick [label] | Olen's low house under a storm-grey chief is the coast's way of building: low, thick and deep against the weather. |
| Y7S | Dra | dead_lands_freeholds | per pale, storm grey and sand; a drag net in tar black [label] | Dra bears the drag net of the inshore fishers who hold the last cove before the storms. |
| Y8D | Volgan | grave_hosts | plain, grave black; an arched gate standing open, dark within, with ember light at its threshold in bone; a ring of short notches | The Dominion bears the open Gate of Nafeher ringed by notched names: the rite of Names and Gates kept by its necromantic orders; it shows no person, because the realm must not be its master's portrait. |
| Y10 | Nezer | netherborn | per bend, nether red and ash black; a single curved horn in ember gold [grave base] | Nezer bears the pact-horn of its lord, sworn to the Dominion. |
| Y7T | Demon | netherborn | pile, ash black and nether red; an obsidian blade in ash white [grave base] | Demon bears an obsidian blade: oaths of blood and ash, sworn to the Dominion. |
| Y7U | Dolon | netherborn | per fess, obsidian and nether red; a blank wax seal with a thumb-print in sulphur [grave base] | Dolon bears the blank pact-seal pressed with a thumb: its pact-name is known only to the pact. |

### Magical Lands

| Tag | Name | Culture | Design | Meaning |
| --- | --- | --- | --- | --- |
| Y8G | Worshipdom | zilin_pilgrims | plain, hostel white; a hand from the base offering a round loaf in pilgrim gold; a small standing lamp | The Worshipdom bears a hand offering a loaf, with the stranger's lamp beneath it, on hostel white: the public charity of the Deliverer's hostels in the Zilin valleys, where no weapon passes the gate. |
| Y8F | Magical Forest | forest_council_elves | per fess, leaf green and deep wood; a song-bow: a lyre of two curved horns with three strings in elven silver [council border] | The Magical Forest bears the song-bow within a silver engrailed border: the oldest realm of the Kindred, governed by a First Speaker the houses elect, never conquered, holding its land by memory and song. |
| Y80 | Kingdom | forest_council_elves | plain, moon white; a green-leaved tree with its roots in leaf green | The Kingdom bears a living tree with its roots: a city woven into the trees, kingdom only in name, kept by its houses. |
| Y87 | Greenland | forest_council_elves | flaunches, deep wood and elven silver; a long willow-shaped leaf in leaf green [council border] | Greenland bears the long leaf of the forest between silver flaunches. |
| Y8A | Dulo-Dulo | forest_council_elves | chief, deep wood and amber sap; a filigree bridge in elven silver [council border] | Dulo-Dulo's filigree bridge joins its two tree-cities. |
| Y8B | Heron | forest_council_elves | per bend, mist grey and deep wood; a heron in moon white [council border] | Heron bears a heron, canting on its name: the forest pools where its council meets. |
| Y0V | Herrodon | hill_kingdom_elves | per bend, hill green and night slate; an open-topped roost tower in elven silver [crown] | Herrodon bears the open-topped dragon roost under the leaf circlet of its queen, acclaimed in the hall: the hill realm that commands dragons and is Andos Enda's old rival. |
| Y7V | Sacomananos | hill_kingdom_elves | plain, night slate; a single dragon scale in scale gold [council border] | Sacomananos bears a dragon scale: the scale it trades for iron at the Wall gates. |
| Y7W | Velakton | hill_kingdom_elves | per fess, elven silver and hill green; a single dragon wing in dragon red [council border] | Velakton's dragon wing is the dragons that guard its halls. |
| Y7X | Teste | hill_kingdom_elves | chief, hill green and gorge grey; a dragon egg in elven silver [council border] | Teste bears a dragon egg: the brood of its roosts. |
| Y7Y | Filion | hill_kingdom_elves | per chevron, gorge grey and hill green; a long stair cut into a hillside in elven silver [council border] | Filion bears the long stair of the halls it cuts into eight hillsides. |
| Y0W | Andos Enda | lake_elves | per fess, lake teal and deep blue; a boat with a glass canopy in water silver [council border] | Andos Enda bears the glass-roofed boat of its water-houses, whose Speaker the houses elect; Lerendor would court it and Herrodon remembers it as a rival. |
| Y88 | Perloia | lake_elves | plain, willow green; a pearl shell clasp in pearl white [council border] | Perloia bears the pearl shell clasp, canting on its name. |
| Y89 | Ossa | lake_elves | base, pearl white and lake teal; a crane in deep blue [council border] | Ossa's crane is its Water-Court, which judges every dispute over weirs and boats. |
| Y0X | Nolorim | pass_wardens | per chevron, snow white and pass grey-green; two peaks with a path between them in pine [council border] | Nolorim bears the pass between two peaks: the Pass-Warden holds office until a vigil is broken. |
| Y7Z | Nolivorak | pass_wardens | plain, pine; a carved pass-token on a cord in dawn silver [council border] | Nolivorak's pass-token is the carved token every courier must show at its gates. |
| Y81 | Endelond | rift_coast_elves | per fess, quay silver and rift teal; a lantern in night sea [council border] | Endelond bears the lantern its houses wear as a clasp. |
| Y82 | The End | rift_coast_elves | plain, night sea; a long pier running out to sea in quay silver | The End bears a long pier running out to sea: the last land of the coast, a league of house-towers that holds the shore. |
| Y83 | Lccimio | rift_coast_elves | per bend, rift teal and night sea; a slender shore tower with a lantern roof (three) in quay silver | Lccimio bears three lantern towers: a league of house-towers under one Warden-Speaker, the largest on the rift coast. |
| Y84 | Luv-zhise | rift_coast_elves | base, sea glass and rift teal; a gannet diving in night sea [council border] | Luv-zhise bears the diving gannet of its sea fishers. |
| Y85 | Lengoli | rift_coast_elves | chief, rift teal and lantern gold; a glass float in a net in quay silver [council border] | Lengoli's glass float is the glassmakers of its quays. |
| Y86 | Lusteli | rift_coast_elves | flaunches, quay silver and rift teal; a breaking wave in night sea [council border] | Lusteli bears a breaking wave of the rift sea. |

### Cold Lands

| Tag | Name | Culture | Design | Meaning |
| --- | --- | --- | --- | --- |
| Y01 | Coldor | winter_crown | per fess, frost white and winter blue; a fire inside a ring of stones in hearth red [crown] | Coldor bears the clan fire in its ring of stones under the winter crown: the realm that united the interior by letting every clan relight its hearth from the crown's fire in the Long Dark. |
| Y03 | Horidor | ice_clans | chief, snow and fjord blue; a musk ox in soot; a fire inside a ring of stones | Horidor's musk ox stands like the clan ring against the storm, with Coldor's hearth beneath it: the great clan-realm allied to the Winter Crown. |
| Y05 | Holdon | ice_clans | chief, ice and fjord blue; a snowy owl in soot | Holdon's snowy owl is the winter moot that elects its speakers: the clans of Holdon decide together before the Long Dark. |
| Y06 | Wonderland | ice_clans | per bend, fjord blue and snow; a hide boat in hide brown; a cord tied with three wind-knots | Wonderland bears the hide boat of its summer crossings with the Windwaith wind-cord: a clan that trades along the coast and bargains with the storms. |
| Y1I | Celen | ice_clans | plain, hide brown; a reindeer in snow | Celen's reindeer is the herding clan that follows the herds to the coast each thaw. |
| Y1K | Radeon | ice_clans | per pale, snow and ice; a wolverine in soot | Radeon bears the wolverine: a clan that yields to nobody, not Coldor and not Isengard. |
| Y1L | Orewele | ice_clans | base, snow and hide brown; an elk in fjord blue | Orewele's elk is the forest clan of the southern ice. |
| Y1M | Gaadon | ice_clans | plain, fjord blue; a walrus in bone | Gaadon's walrus is the ivory coast and its carvers. |
| Y1N | Portogalor | ice_clans | per chevron, snow and soot; a white bear in ice | Portogalor bears the white bear of the coast ice and its seal hunt. |
| Y1O | Omar | ice_clans | per fess, ice and hide brown; an arctic fox in snow | Omar's arctic fox is the trapping clan of the inland tundra, rich in winter furs. |
| Y1P | Felkond | ice_clans | plain, soot; a snow hare in snow | Felkond bears the snow hare of the tundra clans, white on the dark of the Long Dark. |
| Y1R | Yeneldmore | ice_clans | plain, bone; a raven in soot | Yeneldmore's raven is the clan that finds the herds for others and takes its share. |
| Y1S | Rion | ice_clans | per bend sinister, fjord blue and ice; an orca in soot | Rion bears the orca of the sea clans who hunt in packs along the fjords. |
| Y1T | Xison | ice_clans | chief, hide brown and snow; a sledge in bone | Xison's sledge is the winter road over the ice that the clan keeps open. |
| Y1U | Hendair | ice_clans | per pale, fjord blue and hide brown; a leaping salmon in bone | Hendair bears the leaping salmon of its river clans. |
| Y1V | Agoron | ice_clans | plain, lichen green; a ptarmigan in snow | Agoron's ptarmigan is the high tundra, white in winter and brown in summer. |
| Y1W | Belor | ice_clans | base, fjord blue and snow; an eider duck in snow | Belor bears the eider of the down-gatherers on the skerries. |
| Y1Y | Pertolor | ice_clans | per bend, snow and berry red; a gyrfalcon perched in soot | Pertolor's perched gyrfalcon is its falconers, whose birds are a gift fit for the Winter Crown. |
| Y1Z | Londor | ice_clans | pile reversed, fjord blue and snow; a mountain of two peaks in soot | Londor bears the two-peaked mountain of the clan that holds the passes into the interior. |
| Y20 | Naepu | ice_clans | per fess, berry red and soot; an ermine in snow | Naepu's ermine is the fur trade that clothes the halls of Fandanar. |
| Y21 | Fearno | ice_clans | per chevron, ice and fjord blue; a harpoon in soot | Fearno, the widest of the clan-realms, bears the whale harpoon: its moot rules twenty-five states of coast and ice and feeds them from the sea. |
| Y22 | Neridor | ice_clans | plain, ice; a narwhal in fjord blue | Neridor bears the narwhal of the far ice. |
| Y23 | Poloto | ice_clans | chief, snow and lichen green; a snowshoe in hide brown | Poloto's snowshoe is the long walk to the winter moot that it never misses. |
| Y24 | Worlond | ice_clans | per bend sinister, hide brown and soot; a seal on an ice floe in bone | Worlond bears the seal on its floe: the floe hunters of the outer coast. |
| Y25 | Hozoson | ice_clans | per pale, soot and ice; an antler comb in bone | Hozoson's antler comb is its bone-carvers, whose work is traded down the coast. |
| Y8H | Yeldenne | ice_clans | plain, snow; an arch of two whale ribs in soot | Yeldenne bears the whale-rib arch of its hall door: an ordinary northern town of the clans, governed by its moot. |
| Y02 | Isengard | isengard_warlords | per bend, forge black and war red; three spears bound in a sheaf in iron grey; a storm cloud loosing three bolts | Isengard bears the bound spears of its oath-companies under a storm cloud: a warlord's realm held by sworn men and bargains with the storms, rival to the Winter Crown. |
| Y04 | Windwaith | windwaith_seafarers | per bend sinister, sea teal and sail white; a ship under a bellied sail in tar brown | Windwaith, the wind-shore, bears a ship under a bellied sail: owned by shares and governed by a Council of Captains who elect their Speaker. |
| Y1Q | Greenle | windwaith_seafarers | plain, gale blue; a storm petrel in sail white | Greenle's storm petrel rides the gale its captains sail in. |
| Y1J | Titanos | ice_giants | base, deep ice and rime white; a throne of ice in glacier blue | Titanos bears the Ice-Throne on its glacier: the Frost-King chosen by the cairn-keepers sits on it, and the cold itself is honoured as an old spirit of ice. |
| Y1X | Yeti Lands | yeti_clans | base, dusk violet and yeti white; a dark cave mouth in a white peak in rock slate | The Yeti Lands bear a dark hum-cave in the white peaks at dusk: the mountain hums and must be answered, and a clan with no hum is lost. |

### West Lands

| Tag | Name | Culture | Design | Meaning |
| --- | --- | --- | --- | --- |
| Y07 | Gunwaith | gunwaith_clans | per pale, clan madder and clan green; a ring of standing stones in torc gold [crown] | Gunwaith bears the Oath-Ring under the torc-crown on the clan pair: its king is acclaimed at the standing stones and bound by the Lawspeaker, while the chiefs keep the real power. |
| Y0B | Varnondor | gunwaith_clans | plain, clan green; a stag standing in lime white | Varnondor's stag is the hunting clan of the western hills. |
| Y26 | Werlendor | gunwaith_clans | per fess, lime white and moor brown; a boar in clan madder | Werlendor bears the boar of the old feud-clans, who want the old claims buried with honour. |
| Y27 | Lambin | gunwaith_clans | plain, clan madder; a round ring-fort seen from above in lime white | Lambin's ring-fort is the hill country of ten states held by ring-forts on every height. |
| Y28 | Thenon | gunwaith_clans | per bend, slate blue and torc gold; a hound running in clan madder | Thenon's running hound is its war-band, hired to every feud in the hills. |
| Y29 | Hky | gunwaith_clans | chief, moor brown and lime white; an open torc in torc gold | Hky bears the open torc of the chief's bond to the clan. |
| Y2A | Lothoro | gunwaith_clans | base, slate blue and clan green; a single standing stone in lime white | Lothoro's standing stone is the oath it swore at the Grey Ford and keeps. |
| Y08 | Girdon | girdon_wardens | per fess, river green and water blue; a stone bridge of three arches in ford stone | Girdon's three-arched bridge is its river-court and its bridge-towns: a Warden-Speaker's realm, Gunwaith's rival under the Truce of the Grey Ford. |
| Y2I | Argo | girdon_wardens | plain, mud brown; three stepping stones in ford stone | Argo bears the three stepping stones of the ford its wardens keep clear. |
| Y2J | Pernogon | girdon_wardens | chief, dark pool and reed gold; an eel in ford stone | Pernogon's eel is the river that is fed a loaf at the flood so that it treats the town as a guest. |
| Y09 | Kradlon | western_guilds | quarterly, guild wine and ivory; a weaver's shuttle in guild gold | Kradlon, seat of the great guild-halls, bears the weavers' shuttle on wine and ivory quarters: a council of guilds that answers to its book, not to a crown. |
| Y0A | Corogon | western_guilds | quarterly, guild blue and guild gold; cloth shears in ivory | Corogon bears the clothiers' shears: the second great guild-city, whose Fair of Contracts sets prices for the West. |
| Y2C | Toples | western_guilds | per pale, vermilion and ivory; a barrel in ink black | Toples bears the coopers' barrel of a one-state port that packs the West's trade. |
| Y2D | Sarudon | western_guilds | plain, guild green; a candle in ivory | Sarudon's candle is the chandlers' town that lights the guild-halls. |
| Y2E | Saopon | western_guilds | per fess, guild gold and ink black; a mortar and pestle in vermilion | Saopon bears the apothecaries' mortar: its physic-gardens supply three states. |
| Y2F | Sobre | western_guilds | chief, ivory and guild wine; a boot in ink black | Sobre's boot is the cordwainers' guild that shoes the companies of Buldor. |
| Y2G | Canako | western_guilds | plain, guild wine; a wool comb in ivory | Canako bears the wool-comb of the combers who prepare the hill wool for Kradlon's looms. |
| Y2H | Forbo | western_guilds | per bend, guild blue and vermilion; a pair of bellows in ivory | Forbo's bellows are the smiths' guild of a one-state forge town. |
| Y2K | Oslinod | western_guilds | base, ivory and guild green; a glove in guild wine | Oslinod bears the glovers' glove: the town's fine leather is sent to every court. |
| Y2L | Trilino | western_guilds | per chevron, ink black and guild gold; a corded bale in ivory | Trilino's corded bale is the merchant-adventurers who carry the guilds' goods abroad. |
| Y2B | Buldor | buldor_companies | bordure, steel blue and livery red; a halberd in buff; a war drum [bordure compony] | Buldor bears a halberd and drum within a border of livery blocks: the companies' banner-towns, whose Captain-General is elected by the company-lords and who serve Gunwaith and Girdon alike. |

### Triton's Islands

| Tag | Name | Culture | Design | Meaning |
| --- | --- | --- | --- | --- |
| Y0C | Adel | chart_islanders | per fess, chart paper and chart teal; a chart-rose of sixteen thin points in reef coral | Adel bears the sixteen-pointed chart-rose: the senior chart-house of Triton's Islands, whose charts Aenor buys. |
| Y0D | Pollos | chart_islanders | plain, chart teal; a sounding lead on its line in chart paper | Pollos bears the sounding lead of the pilots who have sounded every reef of its single island. |
| Y0F | Raerby | chart_islanders | chief, chart paper and ink; a branching coral in reef coral | Raerby's branching coral honours the reef-spirits that spared its first pilot. |
| Y39 | Ziza | chart_islanders | per bend, chart teal and sand gold; a pilot's lantern in ink | Ziza bears the pilot's lantern of the harbour that guides ships through two islands' channels. |
| Y3A | The Lens | chart_islanders | plain, ink; a round lens of ground glass in chart paper | The Lens bears a round lens of ground glass, canting on its name: the lens-grinders whose glasses read the charts. |
| Y3B | Fineger | chart_islanders | base, chart paper and reef coral; a rolled chart in ink | Fineger bears a rolled chart from its chart-house archive. |
| Y3C | Tses - The Vestes | chart_islanders | per pale, chart teal and chart paper; a ring with a sighting rule across it in ink | Tses - The Vestes bears the sighting ring of the star-readers who hold its two isles. |
| Y3D | Beemste | chart_islanders | plain, sand gold; a sand-glass in ink | Beemste's sand-glass is the watch kept at sea. |
| Y3E | Hiohon | chart_islanders | per bend sinister, shallows and ink; a buoy in reef coral | Hiohon bears the buoy that marks its channels. |
| Y3F | Anbei | chart_islanders | chief, chart teal and chart paper; a coil of rope in sand gold | Anbei's coil of rope is its rope-walk, which rigs half the island fleets. |
| Y3G | Seite Islands | chart_islanders | per chevron, chart paper and chart teal; a turtle in ink | The Seite Islands bear the turtle of their beaches and of the reef-shrines that stand above them. |
| Y3H | Mondeluz | chart_islanders | plain, reef coral; a seahorse in chart paper | Mondeluz bears the seahorse of its sheltered lagoon. |
| Y3I | Kile Islands | chart_islanders | base, shallows and chart teal; a flying fish in ink | The Kile Islands bear the flying fish of the open crossings between them. |
| Y3J | Hesos | chart_islanders | per fess, ink and shallows; a tern in chart paper | Hesos's tern is the outer islet it holds alone. |
| Y3U | Halenor | chart_islanders | pile reversed, chart teal and sand gold; a chart-house on stilts in ink | Halenor, the largest chart-house realm, bears its stilt chart-house: four states of harbours governed from it. |
| Y3W | Urbolon | chart_islanders | per pale, ink and chart teal; a whale in chart paper | Urbolon bears the whale of its whale grounds. |
| Y0E | Nondondor | corsair_lords | plain, corsair black; a short straight hanger sword in bone [crown] | Nondondor, first of the corsair isles, bears the straight hanger sword within the captain's gold ring: its captain-lord holds the isle by the sword and lives by the Ransoming. |
| Y3K | Aatah | corsair_lords | per fess, corsair black and blood red; a grapnel in bone [crown] | Aatah's grapnel is its boarding crews. |
| Y3L | Previous Dark | corsair_lords | plain, sea ink; a masthead lantern in ransom gold [crown] | Previous Dark bears the masthead lantern of the night raids it is named for. |
| Y3M | Benan | corsair_lords | per pale, blood red and corsair black; a rope cut through in bone [crown] | Benan bears a cut rope: a hostage freed when the ransom is paid. |
| Y3N | Bono | corsair_lords | chief, blood red and corsair black; a banded chest in ransom gold [crown] | Bono's banded chest is the ransom-chest of its tide-court. |
| Y3O | The Cursed Square | corsair_lords | per bend, corsair black and rust; a moray eel in bone [crown] | The Cursed Square bears the moray of its hidden coves. |
| Y3P | Kusu | corsair_lords | plain, blood red; a cormorant with wings spread to dry in corsair black [crown] | Kusu's cormorant drying its wings is the diver that takes and gives back. |
| Y3Q | Santon | corsair_lords | base, sea ink and blood red; a shark's tooth in bone [crown] | Santon bears a shark's tooth, the raider's trophy. |
| Y3R | Dani | corsair_lords | per fess, bone and sea ink; a bell hung from a post in the surf in blood red [crown] | Dani's bell in the surf calls its tide-court to judge the captives. |
| Y3S | Kim | corsair_lords | per chevron, blood red and corsair black; a ship under a black sail in bone [crown] | Kim bears a ship under a black sail for the Black Flag Night. |
| Y3T | Tined | corsair_lords | per bend sinister, sea ink and ransom gold; a boarding pike in blood red [crown] | Tined's boarding pike is its crews. |
| Y3V | Li | corsair_lords | plain, rust; an open shackle in ransom gold [crown] | Li bears an open shackle: its captives go home when the ransom comes. |
| Y3X | Lemo | corsair_lords | chief, corsair black and ransom gold; a barracuda in blood red [crown] | Lemo's barracuda is its fast raiders. |
| Y3Y | Arpos | corsair_lords | pile, sea ink and blood red; the coil of a sea-serpent rising from a wave in bone [crown] | Arpos bears the coil of a sea-serpent: it claims the serpent waters. |
| Y3Z | Sondor | corsair_lords | per pale, sea ink and rust; a boarding axe in bone [crown] | Sondor's boarding axe is its cliff-harbour crew. |
| Y40 | Cheko | corsair_lords | base, corsair black and sea ink; a chain across a harbour mouth in ransom gold [crown] | Cheko bears the chain across its harbour mouth, where every ship pays. |
| Y41 | Amarelo | corsair_lords | plain, ransom gold; a purse spilling coins in corsair black [crown] | Amarelo's spilling purse is the tribute of the chart-islands. |
| Y42 | Windy Lands | corsair_lords | per bend, blood red and sea ink; a torn square sail blown out by the wind in bone [crown] | The Windy Lands bear a torn sail blown out by the wind: the stormiest of the corsair isles. |

### East Lands

| Tag | Name | Culture | Design | Meaning |
| --- | --- | --- | --- | --- |
| Y14 | Noris | noris_riders | plain, indigo; a well-head with rope and bucket in well ochre [crown] | Noris, the New Country, bears the well-head under the well-crown on indigo: its king is chosen by the well-lords, and water is never refused under his law. |
| Y12 | Gondolin | noris_riders | per fess, robe white and indigo; a bowl brimming with water in desert rose [crown] | Gondolin bears the shared bowl: water given and taken that made it Noris's sworn kin in the Noris Treaty. |
| Y56 | Woqood | noris_riders | chief, well ochre and indigo; a sandgrouse in deep indigo | Woqood bears the sandgrouse that carries water to its young: a tribe that keeps the wells of the deep desert. |
| Y57 | Hacsen | noris_riders | per bend, indigo and robe white; a water-skin in well ochre | Hacsen's water-skin is the Salt Road crossing its riders guard. |
| Y58 | Vigodor | noris_riders | plain, deep indigo; a wind-catcher tower in robe white | Vigodor bears the wind-catcher tower of its oasis cities. |
| Y59 | Fladev | noris_riders | base, robe white and well ochre; a jerboa in deep indigo | Fladev's jerboa is the small night-desert tribe that survives where others die. |
| Y5A | Orato | noris_riders | per pale, desert rose and indigo; an oryx in robe white | Orato bears the oryx of the open desert it rides. |
| Y5H | Mylunur | noris_riders | per chevron, indigo and well ochre; a silver anklet in robe white | Mylunur's silver anklet is the wealth its riders wear. |
| Y5K | The Moco | noris_riders | plain, well ochre; a camel kneeling in deep indigo | The Moco bears the only camel in the arms of the East, kneeling at the well as a guest: the caravan-tribe that waters every road. |
| Y16 | Stabilo | caravan_princes | plain, caravan red; a balance in bronze | Stabilo bears the honest balance in bronze on caravan red: the Hall of Scales at Postondoroth, where a Prince chosen by the merchant houses rules and a false weight is the worst crime. |
| Y15 | Drak | caravan_princes | per fess, bronze and caravan red; a hanging wax seal in linen | Drak bears the hanging seal of the Stabilo Pact it signed first. |
| Y5L | Mostok | caravan_princes | chief, market green and bronze; a milestone in linen | Mostok's milestone is the caravan road it was built on. |
| Y5N | Azano | caravan_princes | per bend, linen and market green; a bronze coin stamped with a balance in bronze | Azano bears the struck coin of the Pact's mint. |
| Y5O | Oreton | caravan_princes | base, linen and caravan red; nested cup-weights in ink | Oreton's nested weights are its weighing halls. |
| Y5Q | Arcon | caravan_princes | per pale, seal wax and colonnade stone; a measuring rod in ink | Arcon bears the measuring rod of its cloth markets. |
| Y5R | Obmi | caravan_princes | plain, market green; a corded bale in colonnade stone | Obmi's corded bale is the caravans' load that passes its gates. |
| Y5S | Pornivior | caravan_princes | quarterly, bronze and ink; a counting frame in linen | Pornivior bears the counting frame of the houses' treasurers. |
| Y5T | Furro | caravan_princes | per chevron, colonnade stone and seal wax; a toll bar across a road in ink | Furro bears the toll bar across the road it taxes. |
| Y5U | Olor | caravan_princes | plain, seal wax; a colonnade of three columns in colonnade stone | Olor's colonnade is its long market street under bronze roofs. |
| Y5W | Alerhia | river_kings | plain, river gold; a temple stair of seven steps in lapis [river bendlet] | Alerhia, oldest of the river kingdoms, bears the temple stair under the river-diadem with its river: a priest-king above the Flood-Court. |
| Y18 | Miaed | river_kings | per fess, river blue and river gold; a river boat with a high stern in linen white [crown, river bendlet] | Miaed bears the high-sterned river boat: nineteen states of river trade under a king named for his river. |
| Y5I | Fosoco | river_kings | chief, reed green and river gold; a kingfisher in linen white [crown, river bendlet] | Fosoco's kingfisher is the river it takes its king's name from. |
| Y5J | Delbiz Grasslands | river_kings | per chevron, river gold and reed green; a bound bundle of reeds in flood silt [crown, river bendlet] | The Delbiz Grasslands bear the bound reeds of the floodplain grass that feeds their herds. |
| Y5P | Erco | river_kings | per bend, lapis and linen white; a tall water jar in river gold; a balance [crown, river bendlet] | Erco bears the water jar with the caravan balance: a river crown that borrows from the merchant princes. |
| Y5V | Plutondo | river_kings | base, linen white and river blue; a stair-gauge standing in water in lapis [crown, river bendlet] | Plutondo bears the flood-gauge its scribes read each year. |
| Y11 | Ostoroth | lake_road_cities | plain, deep water; a lantern on a pole in lantern amber; a river boat with a high stern [crown] | Ostoroth bears the quay lantern under the lantern-crown with the river boat of the river kings: the king of the Lake Road who keeps the old crowns' favour. |
| Y13 | Mora | lake_road_cities | per fess, quay white and lake silver-blue; a perch in deep water | Mora bears the perch of its fishers, governed by the Speaker of a council of fishers and merchants. |
| Y5B | Ernois | lake_road_cities | chief, lake silver-blue and quay white; a house on stilts in deep water | Ernois bears its stilt town. |
| Y5C | Cream | lake_road_cities | plain, rush green; a cattail in lantern amber | Cream's cattail is its reed shores. |
| Y5D | Nethnu | lake_road_cities | per bend, deep water and quay white; a floating lantern in lantern amber | Nethnu bears the floating lantern of the Longnight festival. |
| Y5E | Eraver | lake_road_cities | base, quay white and rush green; a barbel in lake silver-blue | Eraver's barbel is the lake fish that feeds its markets. |
| Y5F | Grova | lake_road_cities | per pale, lake silver-blue and fish grey; a net in quay white | Grova bears the net its fishers and merchants share. |
| Y5G | Lorvens | lake_road_cities | per chevron, quay white and deep water; an eel trap in rush green | Lorvens bears the eel trap of its shallows. |
| Y5M | Kersian | lake_road_cities | plain, lake silver-blue; a skiff in quay white | Kersian's skiff is the ferry that carries the Lake Road across its water. |
| Y17 | Avalon | red_lands_tribunes | per chevron, kiln ochre and red clay; a domed kiln with fire at its mouth in umber | Avalon bears the domed kiln where each house refires its clay first mother every spring; its Tribune is chosen for a single year. |

### Islands of the South

| Tag | Name | Culture | Design | Meaning |
| --- | --- | --- | --- | --- |
| Y1D | Howan | southern_islanders | per fess, coral sand and lagoon turquoise; a notched tally stick in deep reef | Howan bears the notched tally of the Wave-Tally: its elders count the island's dead as waves on the reef. |
| Y1E | Nara | southern_islanders | plain, lagoon turquoise; a stone cairn on a reef in coral sand | Nara bears the stone cairn of its reef-shrine. |
| Y5X | Dunn | southern_islanders | chief, coral sand and coral red; a thatched house on stilts in deep reef | Dunn's thatched stilt house stands on its reef. |
| Y5Y | Finn | southern_islanders | plain, deep reef; a conch in coral sand | Finn bears the conch that calls the Reef-Opening. |
| Y5Z | Lua | southern_islanders | per bend, lagoon turquoise and coral sand; a cowrie shell in coral red | Lua bears the cowrie of the feast shell-money. |
| Y60 | Verde | southern_islanders | base, coral sand and frond green; a sea turtle in deep reef | Verde's turtle is its turtle beach. |
| Y61 | Angsutz | southern_islanders | per pale, coral red and coral sand; a woven fish trap in lava black | Angsutz bears its woven fish trap. |
| Y62 | Enhis Is Rond | southern_islanders | plain, coral red; a nautilus in coral sand | Enhis Is Rond bears the nautilus of the deep water beyond its reef. |
| Y63 | Yowi-yoor | southern_islanders | per bend sinister, deep reef and lagoon turquoise; a manta ray in coral sand | Yowi-yoor's manta glides its reef channel. |
| Y64 | Yongyong | southern_islanders | per chevron, coral sand and deep reef; a shell necklace in coral red | Yongyong bears the feast necklace. |
| Y65 | Jingar | southern_islanders | chief, lagoon turquoise and lava black; a parrotfish in coral sand | Jingar's parrotfish is the reef that makes its sand. |
| Y66 | Torsor | southern_islanders | base, deep reef and coral sand; a carved paddle in coral red | Torsor bears the carved paddle of its crossings. |
| Y67 | Yongrost | southern_islanders | plain, frond green; a net float in coral sand | Yongrost bears the net float of its lagoon nets. |
| Y68 | Meng | southern_islanders | per fess, deep reef and coral red; a dolphin in coral sand | Meng's dolphin is the companion of its boats. |
| Y69 | Sidea Islands | southern_islanders | per pale, lagoon turquoise and deep reef; a flying fish in coral sand | The Sidea Islands bear the flying fish of the crossings between them. |
| Y6A | Kea | southern_islanders | pile reversed, lagoon turquoise and coral sand; a carved feast bowl in deep reef | Kea bears the carved feast bowl: three states that share their land at the feasts. |
| Y6B | Agla | southern_islanders | per bend, frond green and coral sand; a woven sail in deep reef | Agla bears the woven sail of the boats that link its three states. |
| Y6C | Yumbo | southern_islanders | chief, deep reef and lagoon turquoise; a branch of coral in coral red | Yumbo bears the coral of its reef. |
| Y6D | Pon | southern_islanders | plain, lava black; a hermit crab in coral sand | Pon's hermit crab is a small island living in a borrowed shell. |

### Lands of the Sun

| Tag | Name | Culture | Design | Meaning |
| --- | --- | --- | --- | --- |
| Y6Z | Goodin | goodin_sunfolk | plain, shade green; a broad-crowned shade tree in linen [patron chief] | Goodin bears the shade tree of its guest-towns under the sun-yellow chief of the sanctuaries it serves. |
| Y70 | Goodton | goodin_sunfolk | per fess, linen and fig purple; a ripe fig in shade green [patron chief] | Goodton bears the fig of the orchards that feed the sanctuaries. |
| Y71 | Guuden | goodin_sunfolk | per pale, brick and shade green; a sweating water jar in linen [patron chief] | Guuden's water jar is the cool water given to every pilgrim at its gate. |
| Y73 | Gala | gala_court | plain, court white; a round pool rimmed in gold, with rain falling into it in deep harbour [crown] | Gala bears the Mirror of First Rain under the endless circlet of a king who reigns as long as he wills: the oldest memory of the elves, which distrusts every prophecy shown too plainly. |
| Y6V | North Gala | gala_court | per fess, court white and deep harbour; a tall ship with white sails in Gala gold [crown] | North Gala bears the King's Ships that lie in its harbour. |
| Y6X | Gala Elves | gala_court | chief, rain blue and court white; a fountain in court white [crown] | The Gala Elves bear the fountain of their open courts. |
| Y6U | The Lands of Light | sunhot_light | per fess, sanctuary white and noon gold; a tall arched doorway with a sun disc resting in its arch in god-sea blue | The Lands of Light bear the noon-door, a tall doorway with the sun resting in its arch: the sanctuaries nearest the Sea of Gods, led by a Radiant Speaker who is never called a king. |
| Y1G | Elvana | sunhot_western | per fess, sanctuary white and shade blue; a tall double door, open in sanctuary gold | Elvana bears a tall open double door: its sanctuary turns no visitor away. |
| Y1H | Igara | sunhot_western | per pale, sanctuary gold and sanctuary white; a tall keeper's hat in deep red | Igara bears the tall hat of its Keepers. |
| Y6W | Godrela | sunhot_western | chief, sanctuary white and flame orange; an almond branch in blossom in deep red | Godrela's almond blossom opens its sanctuary year. |
| Y6Y | Sunweli | sunhot_western | per bend, shade blue and sanctuary white; a swallow in deep red | Sunweli bears the swallow that returns each year, like its pilgrims. |
| Y72 | Land of the Sun | sunhot_western | plain, sanctuary white; a square court with a disc set in its pavement in sanctuary gold | The Land of the Sun bears the culture's one sun disc, set in the pavement of a sun court where visitors rest. |
| Y74 | Godson | sunhot_western | base, sanctuary white and olive; a cypress in olive | Godson bears the tall cypress of its three sanctuary hills. |
| Y75 | Beforelands of Gulia | sunhot_western | per bend sinister, ochre stone and shade blue; a road winding up to a door in sanctuary white | The Beforelands of Gulia bear the road winding up to a door: the first sanctuary a pilgrim reaches. |
| Y76 | Menga | sunhot_western | pile reversed, shade blue and sanctuary gold; a bee in deep red | Menga bears a bee: the sanctuary hives that sweeten the guest's bread. |
| Y77 | Sono | sunhot_western | per chevron, sanctuary gold and deep red; a stone basin of water in sanctuary white | Sono's stone basin is the water of rest given to visitors. |
| Y78 | Sunny | sunhot_western | chief, shade blue and sanctuary gold; a sundial in sanctuary white | Sunny bears the sundial that marks noon for the sanctuary. |
| Y79 | Via | sunhot_western | per fess, ochre stone and olive; a stair-street climbing between houses in sanctuary white | Via bears the stair-street that is its whole town. |
| Y7A | Lovis | sunhot_western | per pale, shade blue and ochre stone; a hoopoe in sanctuary white | Lovis's hoopoe nests in its sanctuary gardens. |
| Y7B | Sensun | sunhot_western | plain, shade blue; a bell in sanctuary gold | Sensun bears the noon bell of its sanctuary. |
| Y7C | Sun God Land | sunhot_western | bordure, sanctuary white and sanctuary gold; an open sanctuary book in deep red | Sun God Land bears the open sanctuary book that is its law, within a gold border. |
| Y7D | Godland | sunhot_western | per bend, sanctuary gold and deep red; a door with a sword laid on the ground before it in sanctuary white | Godland bears a door with a sword laid on the ground before it: no weapon passes its threshold. |
| Y7E | Godton | sunhot_western | base, shade blue and ochre stone; a tall pilgrim's staff in sanctuary white | Godton's tall staff is the pilgrims' road through its three sanctuaries. |
| Y7F | Flame | sunhot_western | plain, deep red; a single tall flame in sanctuary gold | Flame bears a single tall flame, canting on its name. |
| Y7G | Sali | sunhot_western | per chevron, sanctuary white and ochre stone; a crocus in deep red | Sali's crocus is its saffron fields. |
| Y7H | Helen | sunhot_western | chief, olive and sanctuary white; a gazelle in sanctuary white | Helen bears the gazelle of its open hills. |
| Y7I | Heaven | sunhot_western | pile reversed, sanctuary white and shade blue; a flame-lamp on a stand in sanctuary gold | Heaven bears the flame-lamp that lights its stair-streets toward the Sea of Gods. |
| Y7J | Him | sunhot_western | per fess, deep red and sanctuary gold; a brazier in sanctuary white | Him bears the noon brazier of its sanctuary. |
| Y7K | Dreamland | sunhot_western | per bend sinister, shade blue and sanctuary white; a hound asleep in deep red | Dreamland bears a hound asleep: rest and dreams for the visitor, canting on its name. |
| Y7L | Dein Lands | sunhot_western | per pale, olive and sanctuary gold; a striped shade canopy in sanctuary white | The Dein Lands bear the striped canopy that shades their guests across four states. |
| Y1F | Hengyang | sunhot_isles | per fess, terrace white and isle teal; a garland of linked rings in isle gold | Hengyang bears the garland of linked rings: the Council of the Chain where every isle sends a Speaker. |
| Y6E | Soyano | sunhot_isles | plain, isle teal; an arched door standing in the shallows in terrace white | Soyano bears an arched door standing in the shallows: a sanctuary open to the sea. |
| Y6F | Tangsie | sunhot_isles | per pale, isle gold and deep lagoon; a spotted ray in terrace white | Tangsie bears the spotted ray of the channel between its isles. |
| Y6G | Wenyene | sunhot_isles | chief, terrace white and coral rose; a cuttlefish in deep lagoon | Wenyene's cuttlefish is its lagoon. |
| Y6H | Pinion | sunhot_isles | per bend, deep lagoon and isle teal; an egret in terrace white | Pinion bears the egret of its shallows. |
| Y6I | Sus | sunhot_isles | base, terrace white and isle teal; a bronze bell on a frame in deep lagoon | Sus bears the tide-court bell. |
| Y6J | Tei | sunhot_isles | plain, deep lagoon; an abalone shell in isle gold | Tei's abalone is its shell-divers. |
| Y6K | Armic | sunhot_isles | per chevron, isle teal and terrace white; a jellyfish in coral rose | Armic bears a jellyfish of the warm currents. |
| Y6L | Hel | sunhot_isles | per bend sinister, coral rose and deep lagoon; a silk sail in terrace white | Hel bears the silk sail of its trade. |
| Y6M | Ofos | sunhot_isles | pile reversed, deep lagoon and isle gold; a set of reed pipes in terrace white | Ofos bears the reed pipes of its sanctuary music. |
| Y6N | Hol | sunhot_isles | per fess, isle gold and isle teal; a colonnade facing the sea in deep lagoon | Hol bears the colonnade that faces its sea. |
| Y6O | Poyang | sunhot_isles | chief, isle teal and isle gold; a terrace stair rising from the water in terrace white | Poyang, the largest isle realm, bears the terrace stair rising from the water to its five sanctuaries. |
| Y6P | Heilmon | sunhot_isles | plain, coral rose; a comb set with pearls in terrace white | Heilmon bears a comb set with pearls. |
| Y6Q | Yungin | sunhot_isles | per pale, terrace white and isle teal; a sea-lily on its stalk in coral rose | Yungin's sea-lily is its reef garden. |
| Y6R | Rana | sunhot_isles | base, deep lagoon and coral rose; a terrace lamp in isle gold | Rana bears the lamp of its sea terraces. |
| Y6S | Loyol | sunhot_isles | per bend, isle gold and terrace white; a silk kite in deep lagoon | Loyol bears the silk kite of its festival. |
| Y6T | Biggen | sunhot_isles | per chevron, deep lagoon and isle teal; a lagoon skiff in isle gold | Biggen's skiff is the ferry between the isles. |

### Zol's Mistake

| Tag | Name | Culture | Design | Meaning |
| --- | --- | --- | --- | --- |
| Y0U | Zol's Mistake | zols_dead | plain, void black; a sigil of broken concentric rings in cold grey | Zol's Mistake bears only the cold grey sigil of broken concentric rings on void: the emblem called The Will of Zol, the same sigil its leader's portrait shows, and nothing more, because nothing more is known. |

## 7. Dynamic tags

The 75 dynamic tags D01 to D75 serve every civil war, released realm and formed realm in the game.
They are a shared pool, so a file named D07.tga cannot know whose breakaway it will carry.

- Dynamic tags D01 to D75 are a shared pool (zz_zin_dynamic_countries.txt, dynamic_tags = yes); the installed game ships no flag file for them.
- start_civil_war and create_dynamic_country both run an effect block on the new country (effects_documentation.md), so every creation site can set_cosmetic_tag there.
- A dynamic country keeps original_tag = its parent; ZIN ships no ideology flag variants (asset manifest section 6), so without a cosmetic tag a breakaway would show its parent's flag or the D-tag fallback (probe AP5).

**The rule.** Every script that creates a dynamic country sets a cosmetic tag in the same effect block. A story creation uses its named cosmetic tag (story list). Any other creation uses zin_dyn_<PARENT>_<kind> whose design is derived from the parent record and its culture grammar by the algorithm below. The D-tag base files are a fallback the build forbids reaching.

### 7.1 Breakaway

*When:* A civil war breakaway (start_civil_war) or a rebel realm splitting from a parent.

1. Start from the parent's record.
2. Counterchange the field: swap the order of the two field tinctures; a plain field takes the primary charge's tincture and the charge takes the field's.
3. Keep the primary charge: the breakaway claims the same realm. Drop the secondary charge.
4. Add the culture's breakaway mark (difference.breakaway_mark): a border in the culture's line, tinctured with difference.dissent_tincture. A Concord dominion instead shows the charter border broken open at the top; a Free Crown shows its crown torn from the beast.
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
6. If the releaser keeps it as a subject, add the releaser's subject mark (charter border, grave base or the releaser's dissent tincture as a narrow border).

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

**Worked example.** Gunwaith (per pale indented clan madder and clan green, the Oath-Ring in torc gold under the torc-crown) breaks apart in a Dominion rising: the breakaway is per pale indented clan green and clan madder (counterchanged), the Oath-Ring kept, a border indented of moor brown added (its breakaway mark), and the torc-crown kept because the overlay is Dominion.
Under a Wild rising the torc-crown would be dropped and the border alone would mark it.

### 7.5 Story cosmetic tags

Scripted outcomes with names of their own get designed flags, gated by the story flag that creates them.

| Cosmetic tag | Name | Gate | Design | Meaning |
| --- | --- | --- | --- | --- |
| `zin_cosmetic_aenor_golden_court` | The Golden Court | Aenor succession war, court camp (aenor_court_and_succession section 7) | A field divided across, lamp gold above and lake blue below. A bowl-lamp with one flame in deep lake, large in the centre, under a circlet of five flame-shaped points in deep lake. A plain narrow border of bell bronze. | The court's gold laid over the realm's blue, with the lamp darkened and a bronze border of difference: the party of the gilded halls that sells offices and still claims the crown. |
| `zin_cosmetic_aenor_faithful` | Aenor of the Faithful | Aenor succession war, Faithful camp, before zin_afrit_revealed | A field of Parim white with a base of lake blue. A bowl-lamp with one flame in lamp gold, outlined in deep lake, large in the centre; a round loaf in bell bronze, small, beneath it. A plain narrow border of slate. | The lamp and the loaf of the Deliverer's public charity on white: the camp that puts the faith before the crown. Nothing on it shows who leads the faith. |
| `zin_cosmetic_aenor_ashen` | Aenor of Afrit (the Ashen Throne) | zin_afrit_revealed | A field divided diagonally, slate above and deep lake below. A bowl-lamp in Parim white whose flame is a plume of grey ash, large in the centre, under a circlet of five flame-shaped points in lamp gold. | After the reveal the lamp of the traveller burns ash: the crown of Aenor held by the god-king the realm worshipped. |
| `zin_cosmetic_aenor_strangers_host` | The Stranger's Host | Aenor succession war, host camp, before zin_eindil_named | A field divided diagonally from the upper hoist corner, Parim white above and lake blue below. A wayfarer's staff bendwise in bell bronze with a small lamp in lamp gold hung from its head. | A traveller's staff carrying the lamp: the host gathered by a stranger from the north whose name is not yet known; nothing shows his blood. |
| `zin_host_of_eindil` | The Host of Eindil | zin_eindil_named | A plain field of lake blue. Across the upper half a broad label of three square points in Parim white, large. Beneath it a wayfarer's staff in bell bronze with a small lamp in lamp gold, upright. | The label, every Ainic realm's small mark of descent, becomes the whole charge: the host of the son of Ein, son of Aen, whose claim is the line itself; uncrowned until the realm crowns him. |
| `zin_cosmetic_aenor_free_dominions` | The Free Dominions | Aenor succession war, Free Dominions | A plain field of lake blue. In chief a narrow label of three short square points in lamp gold. A closed book with clasps in Parim white, large in the centre. A plain narrow border of lamp gold, broken open at the top. | The Charters of Parim held by the dominions themselves: the charter border broken open at the top where the crown once sealed it, and no crown. |
| `zin_cosmetic_aenor_restored` | Aenor (the crowned heir of Aen) | zin_eindil_crowned | A plain field of lake blue. A bowl-lamp with one flame in lamp gold, large in the centre, under an ancient plain circlet of pale gold set with one white stone. | Aenor's own arms under the ancient crown of Aen instead of the lamp-crown: the realm restored to the line it was founded by. Glo and the blue sword are not shown (reserved charges). |
| `zin_cosmetic_worshipdom_east` | The Dominion of the East | zin_afrit_king_of_east | A field of hostel white with a chief of pilgrim gold. A standing lamp in sky blue, large, under a tall plain crown of bread brown; beneath it a hand offering a round loaf in bread brown, small. | The hostel lamp crowned: the pilgrims' realm proclaimed a kingdom of the East; the arms still show only the public faith. |
| `zin_cosmetic_goldoroth_great` | Great Goldoroth | zin_goldoroth_one_kingdom | A plain field of obsidian. A fire-mountain with a plume of flame in lava red within a ring of upright stakes in ash grey, large in the centre, under a circlet of upturned tusks in bone. | The Fire-Mountain inside one challenge ring: every hold that bent to the Warking now stands in his ring. |

### 7.6 Fallback flags D01 to D75

The build check fails any `start_civil_war` or `create_dynamic_country` block that does not set a cosmetic tag, so the D-tag base files should never be seen.
They still exist in three sizes (AC9 of the asset manifest), drawn from a neutral grammar, "the unsettled banners": a palette of undyed linen, smoke grey, dun, faded red, faded blue and soot, straight lines, and five charges that say a realm is not yet settled (a plain ring for an oath not yet sealed, a bare stake for a claim, a broken rod of office, an unlit torch, an empty bowl).
Each of the 75 combines one of 15 divisions, one charge and one tincture pair, all different; the list is `dynamic.fallback`.

## 8. Production pipeline

### 8.1 From record to job

`tools/content/art/flag-jobs.mjs` is rewritten (by the art module owner; this spec does not edit it) to read `heraldry.json` instead of its motif lists.
For every tag, cosmetic tag and dynamic fallback it takes the record's `blazon` as the flag's line in the prompt; it never adds words of its own to a flag line.
Sheets are filled in the order family, culture, region, tag, so one sheet carries one family's grammar; a sheet never mixes the dead or demons with living cultures.
A sheet is 4 columns by 3 rows (12 flags) on a 1536x1024 canvas of #000000, flags at an aspect of 41:26 (82x52), gutters of at least 24 pixels.
Twelve flags per sheet instead of sixteen gives each flag about 350x220 pixels of the roughly 1.57 megapixels the model returns (decision A1), which is what heraldic detail needs.
The 305 roster flags take 26 sheets, the 9 story flags one sheet and the 75 fallbacks 7 sheets.

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
Row 1, left to right: 1. A plain field of lake blue. A bowl-lamp with one flame in lamp gold, large in the centre. Above the charge a circlet of five flame-shaped points in lamp gold. 2. A field of Parim white with a base (a band across the bottom, two sevenths of the height) of lake blue edged by a straight line. In chief a narrow label of three short square points in deep lake. A lake barge with a square sail in bell bronze, large, standing on the base. A plain narrow border of lamp gold. 3. A field divided across, pale gold above and lake blue below, by a straight line. In chief a narrow label of three short square points in deep lake. A bell in deep lake, outlined in Parim white, large in the centre.
```

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

| Check | Rule |
| --- | --- |
| Coverage | every tag in common/country_tags (305 roster tags and D01-D75) and every cosmetic tag in common/countries/cosmetic.txt has a design record and gfx/flags/<TAG>.tga, medium/<TAG>.tga and small/<TAG>.tga; no flag file without a tag |
| Headers | large 82x52 and medium 41x26: TGA type 2, 32-bit, descriptor 0x08, bottom-left origin; small 10x7: TGA type 2, 32-bit, descriptor 0x00, bottom-left origin (installed game gfx/flags/FRA_democratic.tga, medium/FRA_democratic.tga, small/GER.tga and small/FRA.tga (24 October 2026)) |
| Palette within the culture | k-means on the 82x52 image with k = declared tinctures + 1; every cluster above 6 percent of pixels lies within Delta E 2000 of 12 of a declared tincture of the record (culture palette, declared borrowings, overlord marks) |
| Contrast | primary charge tincture against each field tincture it overlaps: luminance ratio at least 2.2, or the record declares fimbriation |
| Element budget | marks plus charges at most 4 (5 is a hard failure) |
| Repeated primary charge | at most 1 per culture and 2 per region; the cliché register of 1.4 on top |
| Charge class share | at most 40 percent of a region of 10 or more flags |
| Small-flag signature | (division, field tinctures) unique within a region; at 10x7 the mean Delta E 2000 between any two flags of a region at least 10 |
| No duplicate designs | design_hash (division, line, field, primary, secondary, marks) unique across all records |
| Near-duplicates | 64-bit difference hash (grey 9x8) and 64-bit average hash; distance = larger Hamming distance; ZIN flags at least 10 of 64 apart (declared sibling sets 6), as in the asset manifest; 3x2 mean colour grid; a pair closer than 10 hashes is also compared by grid, mean Delta E 2000 under 18 fails |
| Real-world look-alikes | every flag at least 12 of 64 from every flag of the installed game, computed at build time, read-only, from every flag of the installed game gfx/flags (a corpus of real national flags of the 1930s); nothing is copied or stored |
| Forbidden vocabulary | record blazons and prompts are scanned for the forbidden vocabulary; the generated large sheet gets an OCR pass that must find no glyphs |
| Canon gates | reserved charges only in gated records; the Worshipdom and Aenor public arms pass the hidden-identity deny-list |
| Provenance | each sheet has one line in art/source/provenance.jsonl (id, prompt, prompt sha256, record design_hash list, reference images, output, output sha256, review); each flag file has a line in art/source/flags_manifest.json (source sheet, cell, crop box, operations, output sha256) |

The record-level checks (contrast, budget, caps, class share, signature, duplicates, forbidden vocabulary, coverage of the 305 rows) already pass on the data as written; the image-level checks run when the sheets exist.

## 9. What the rejected flags did wrong

The first sheets (`art/source/flags/flags-sheet-01.png` to `-20.png`) show why the method changed:

- a crowned Tudor-type rose, displayed eagles, a lion rampant on a blue and white triband, Nordic crosses with a crown and a ring of stars, a hammer on a field per saltire (real-world flags and arms, and a saltire close to the emblem of the owner);
- palm trees, a scimitar, a genie lamp, a jackal and a scorpion in the East (sheet 12), and motif lists in the job code that gave every Dark Lands realm a skull, spider, bat or fanged maw and every Cold Lands realm peaks, crystals or a frost star (regional clichés);
- a white running horse on red and grey (the horse-lords of another fiction);
- divisions and tinctures picked at random from the ideology, so two neighbours of one people looked unrelated and two strangers looked alike.

None of these can be produced by the new records, and the checks of 8.5 reject them if the image model draws them anyway.

## 10. Open questions for the owner

1. **Aen's label.** The label marks every Ainic realm of men as a younger branch of the kingdoms Aen joined. Is it right for the Leren, the Free Crowns, Dondor, Mirolon and the Dead Lands freeholds, or only for the Aenoran-speaking realms of the Middle Lands? *Proceeds on:* all Ainic realms of men.
2. **Glo and Horos's blue sword as charges.** They are reserved: no flag uses them. May a story flag (Eindil's crowned Aenor, the Host after `zin_eindil_bearer_of_glo`) show them, and in what form? *Proceeds on:* never; the crowned Aenor uses the ancient crown of Aen instead.
3. **Zol's Mistake.** Its flag repeats the sigil of its emblem leader, The Will of Zol (broken concentric rings on void). Accept, or should the realm's arms differ from the leader's emblem? *Proceeds on:* the same sigil.
4. **The Twelve.** May the faith of the New Gods ever be shown by a ring or a set of twelve (Q-01)? *Proceeds on:* no number-twelve device.
5. **The Dominion of the East and the Ashen Throne.** After the reveal, may the arms of Aenor of Afrit and the Dominion of the East show Afrit's nature (ash, the black flame), or must they stay faith-only? *Proceeds on:* the Ashen Throne shows an ash flame; the Dominion of the East stays faith-only.
6. **Gunwaith and real-world Scotland.** The world bible gives the Gunwaith clans plaid, kilts and torcs. The arms avoid tartan, thistle and heather as real-world marks and show clans as two colours per pale. Accept? *Proceeds on:* yes.
7. **Names under Q-11 and Q-14** (Isengard, Asgard, Avalon, Gondolin, Heaven, Godland, Gul'dur and others). No arms cant on them, so a rename changes only the record's name.
8. **Hiloron under Q-05.** The arms carry the Concord charter border because the roster makes it a dominion; if the giants' kingdom is sovereign, the border goes.

## 11. Acceptance (A-92)

1. `heraldry.json` has a grammar for every culture of `cultures.json` and every people of R-21, and a record for every row of `countries.json`, every dynamic tag and every cosmetic tag; the record-level checks of 8.5 pass with zero findings.
2. The rewritten flag jobs produce sheets whose prompts are the records' blazons inside the template of 8.2; every sheet is reviewed by eye against its records (the reviewer's note goes to the provenance line).
3. The image-level checks of 8.5 pass: palette fit, near-duplicates, real-world look-alikes, OCR, headers and coverage in three sizes.
4. In the isolated Linux run, the country selection, diplomacy and map show the new flags at all three sizes, a scripted civil war shows its derived cosmetic flag, and no D-tag fallback appears.
5. When the roster redesign lands, every new realm gets a record from its culture or people grammar, and the checks still pass.

