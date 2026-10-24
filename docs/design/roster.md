# The roster of Aoaz at 4A 1748: reconciliation report

**Status:** Draft for the owner's review. **Date:** 24 October 2026. Everything below that the vault does not mark established is proposed (P).

**Files.** The roster is `tools/content/data/world/roster.json` (155 realms, the 305-row migration, the calendars and the totals). New languages are in `tools/content/data/world/languages_new.json`, new and split cultures and faiths in `tools/content/data/world/cultures_new.json`. None of the three is read by the builder yet; merging them into `languages.json`, `cultures.json`, `country_cultures.json`, `countries.json` and `demography.json` is a separate step for the builder's owner.

**Inputs.** The fifteen regional dossiers of `docs/lore/regions/` (two writers: the Cold, West, North and Dark Lands, the Islands of the South, Triton's Islands and Zol's Mistake by one; the Middle Lands, Hirolon, the Magical Lands, the Ember Lands, the Nether, the East, the South and the Lands of the Sun by the other), the current roster `tools/content/data/countries.json`, the culture, language, demography, heraldry and pantheon data, the focus designs of `docs/design/focus/`, the mechanic specs of `docs/specs/04_mechanics/` and the vault (`06 - Politics`, `04 - Peoples/Peoples of Aoaz.md`, `07 - History/The Campaign of 4A 1748.md`).

**Owner decisions applied (24 October 2026).** Aoaz is the setting; no country is named after its leader; real tags from the names and none vanilla; fewer, smaller, varied elven realms; a varied Middle Lands; race, culture and state kept apart; Hirolon a sovereign giant kingdom; dwarves in the great ranges of the West and North Lands and the Great Wall range; dwarf goblins a people of their own near Lerendor; goblins in the sheltered southern valleys of the Cold Lands; Smash and the hobgoblin king rule their own realms only; original names for the small folk, the tree people of the Aenor Forest and the flower creature; names from other fiction, real myth and "-waith" replaced; gunpowder common in some realms; no exact ages; Kusven becomes Kusven and the sea north of the Mistake the Kusmeel; no body of water is called an "Ocean"; the Ember Lands become the Ember Lands (`ember_lands`); the twelve New Gods of `pantheon.json` are accepted, but realms keep their own faiths and dating systems where they have them.

## 1. Conflicts between the two halves and how they are settled

| # | Conflict | Settlement | Why |
| --- | --- | --- | --- |
| 1 | **Olodor** (gnomes) appears twice: in the North Forests of the West Wood (`west_lands.md`) and in the Deodolor Hills under Stendorler (`middle_lands.md`). | One gnome realm, **Olodor**, in the Deodolor Hills of the Middle Lands. The North Forests stay with the West Lands realm that holds them on the map, with no gnome realm. | The card names "Olodor and Steadtler"; the drawn Deodolor contains "Olodor" and the drawn Stendorler matches "Steadtler", and the chiromaw card puts the same Olodor beside "the Wall of Rush", the Great Wall range. The West's placement has no drawn anchor. It also keeps the Middle Lands varied, as the owner asked. |
| 2 | **The hobgoblin king** is given two realms: Glimik in the Great Wall range (`middle_lands.md`, "the caves of Ellenmoor" renamed Burrikkrit) and Burnikit under the Goldoroth Mountains (`dark_lands.md`, capital Ellenmoor). | The hobgoblin king rules **Burrikkrit** in the Cursed and Giant Mountains, the owner's "goblin kingdom in the mountains". **Burnikit** stays a free goblin warren-hold of the Dark Lands under a Big Snik, not a king; its capital becomes **Burnikzig**. | Card 29 makes the goblin king a hobgoblin and puts the most hobgoblins in the caves of Ellenmoor: one king, one cave country. The vault (Kingdoms Factions and Conflicts) gives the Dark Lands independent goblins under separate rulers, so the Dark Lands keep a goblin realm, but not a second king. "Ellenmoor" itself is retired (it echoes the Ettenmoors). |
| 3 | **Glimik** (Middle Lands) and **Glimkit** (Cold Lands) are one letter apart, and "Glimik" is a Goblin Cant personal-name sample. | The Middle Lands realm takes the name of its caves, **Burrikkrit** ("tunnel-mountain"), with the throne-cave **Glimzig** as capital. **Glimkit** stays in the Cold Lands; its capital, which repeated the realm's name, becomes **Drikzig** ("the hall of the waters", the warm springs). | The generator refuses names within one edit of each other; a realm should not share a name with a common personal name. |
| 4 | **The dwarf holds** carry names from unrelated languages: Kunhrim (a drawn label read as Dwarvish), Chalwe-Brenn and Garth-Stenn (Gunwyn), Karundun (Leren). Dwarvish was reserved. | A new Dwarvish language (family `delving`, regular sound laws from a reconstructed proto-delving) names all four holds from one dictionary: **Kunhrim** "deep hall", **Brundahrim** "mountain hall", **Gromkerm** "stone fort", **Hrakbrund** "iron mountain"; capitals **Hrakkerm**, **Hrennost**, **Hrunost**, **Ilmahrim**. The men's names are kept as exonyms: Chalwe-Brenn and Garth-Stenn are exact Gunwyn calques of Brundahrim and Gromkerm, Karundun the Leren name of Hrakbrund. | The holds now share *hrim*, *brund*, *kerm*, *hrak* and *-ost*, so a western and a northern hold name are visibly kin. The drawn massif **Lunhrim** reads in Dwarvish as "high hall". The Aenoran-looking working capital Kerdun is replaced. |
| 5 | **The small folk** get two homelands and two names: Dolw-Grewn in the Ronbo basin, people Bykkwyn (`west_lands.md`), and Tirlan inside Hirolon's ring, people Tirim (`hirolon.md`); both read card 32. | One homeland, in the West: **Dobbum**, Hearth-Speech "the home vale", the drawn Hky. **Dolw-Grewn** stays the Gunwyn name of the land; **Bykkwyn** (Gunwyn) and **Tirim** (Common Speech) stay as exonyms of the people. Tirlan is not created; the Hilorn valleys are farmed by the Hilofrim herders. | Hirolon stays the giants' kingdom the owner decided; the West keeps a people besides men and dwarves once the gnomes go to the Middle Lands; an existing row (Hky) is reused instead of a new tag; the dwarves who close the high passes and the Ronbo Watch are the card's "guards". The alternative (homeland in Hirolon's ring) is question 1 below. |
| 6 | **Gaelmael**, the strait between the Dark Lands and the Middle Lands, is used by both dossiers. | Kept: both mean the same water, and the Dark Lands dossier adopts the Middle Lands name. | No conflict once read side by side. |
| 7 | **Celen** (Cold Lands, drawn) and **Selen** (Middle Lands, Alleria's realm) are one sound in unrelated languages. | Celen becomes **Kvittumm**, Coldic "the white hills" (*kvit* + *tumm*); Celen is its former label. | Selen is a story realm. |
| 8 | **Fondor** (Dark Lands orcs) and **Dondor** (Dark Lands men) are one letter apart across unrelated peoples. | Fondor becomes **Skragdurg**, Orcish "forest-hold" (*skrag* + *durg*); Fondor is its former label. | Dondor is a great power of the working table. |
| 9 | **Miherze** (capital of the demon realm) and **Miherta** (capital of Mirolon) sound alike across Infernal and Mirolic. | Khorvrath's capital becomes **Khorvazel** ("horn-hold"), the name the Ember Lands dossier gave its drawn Demonwig. | Mirolon is the story realm. |
| 10 | **Lamowan** (Howan) and **Tamowan** (Verde) are one letter apart in one language. | Verde's capital becomes **Pelo Tamo**, Yonic "harbour of trees". | The generator refuses near-duplicates inside a language. |
| 11 | **The Hold** (North Lands lake league) is an English word as a realm name; its tag would derive as "THE". | The league takes its lake's name, **Dolpar**; the Hold stays one of its towns. | The same reason the other half renamed Kingdom and The End. |
| 12 | **Luv-zhise** had its capital named like itself. | Capital **Hisemrak**, the old roster's quay town. | Realm and capital keys must differ. |
| 13 | **Hirolon** (owner spelling) has no Giants' Speech reading and resembles Mirolic Mirolon. | Kept by owner decision; `languages_new.json` proposes the Giants' Speech word *hir* "ring" so that Hirolon reads "the ring-land". | Question 4 below. |
| 14 | **"Ocean" names** in both halves (Pupor, Kradlon, Leren, Santon, Crown, Frozen, Norrai and others, and the Kusmeel). | The roster names no ocean: the north sea of the Mistake is the **Kusmeel**; extents say "Sea". The dossiers and the geography model still carry about twenty "... Ocean" labels, which the map's owner renames. | Owner decision. |
| 15 | **"Dead" names** in the Ember Lands and beyond. | The region is the Ember Lands; the drawn "Goldoroth Ember Lands" (Veshazel's land) become the **Goldoroth Ash Fields**; the culture `ember_lands_freeholds` is proposed for renaming to `ember_freeholds` and the tree `shared_ember_lands` becomes `regional_halia`. | Owner decision. |

Within each half the dossiers already resolved their own duplicates (merged rows, renamed seas); those settlements are kept and are recorded in each realm's `formerLabels` and in the migration table.

## 2. Counts before and after

### By region

| Region | Before | After | Population before (model) | Population after |
| --- | ---: | ---: | ---: | ---: |
| Middle Lands (with Aenor Isle and Hirolon) | 30 | 22 | 24,500,000 | 21,848,500 |
| East Lands | 34 | 18 | 20,712,000 | 19,796,000 |
| West Lands | 21 | 14 | 8,200,100 | 8,110,000 |
| North Lands | 28 | 12 | 6,800,100 | 3,910,000 |
| Cold Lands | 31 | 20 | 10,499,800 | 2,511,000 |
| Lands of the Sun | 47 | 10 | 3,999,200 | 1,959,000 |
| Ember Lands (former label Dead Lands), with the Nether | 13 | 9 | 1,900,200 | 1,936,200 |
| Dark Lands | 24 | 17 | 3,399,700 | 1,623,000 |
| Triton's Islands | 34 | 11 | 2,000,700 | 1,200,000 |
| Islands of the South | 19 | 8 | 1,300,500 | 1,000,000 |
| South Lands | 1 | 2 | 788,100 | 670,000 |
| Magical Lands | 22 | 11 | 2,400,000 | 671,000 |
| Zol's Mistake (living only) | 1 | 1 | 140,000 | 20,000 |
| **Total** | **305** | **155** | **86,640,400** | **65,254,700** |

The world total falls by about a quarter, to 65.3 million, still inside the demography spec's assumed range of 60 to 120 million. The fall comes from the dossiers' density arguments: the frozen Cold Lands (10.5 to 2.5 million), the North Lands (6.8 to 3.9), the Dark Lands (3.4 to 1.6), the elves (Great Folk who bear few children: 3.56 million Sunhot elves become about 420,000, the Magical Lands' 2.2 million elves about 380,000), and the yeti, giants and ents. The East's figures are the old model's sums of the merged rows, less the snow coast of Woqood (1.07 million to 250,000) and part of Pornivior below the devils' mountains, to reach the dossier's 19.8 million. Per-realm figures are in `roster.json`; the dead are not counted.

### By people (the people that rules and names the realm)

| People | Before | After |
| --- | ---: | ---: |
| Men | 209 | 101 |
| Elves (Magical Lands, Gala, the God Forest Keepers) | 24 | 10 |
| Sun elves | 41 | 7 |
| Orcs | 21 | 11 |
| Demons | 3 | 5 |
| Dwarves | 0 | 4 |
| Goblins (with hobgoblins) | 0 | 3 |
| Giants | 2 | 3 |
| Yeti | 1 | 2 |
| The dead (Puvulan, Zol's Mistake) | 2 | 2 |
| Ents, trolls | 1 each | 1 each |
| Small folk, gnomes, dwarf goblins, Baelim (tree people), mycids | 0 each | 1 each |

Mixed societies are recorded in each realm's `peoples` shares: Kilinti is ruled by ents but its people are mostly men; Hirolon has 8,000 giants and their herder tenants; the Lands of the Sun are ruled by elves and farmed by a Sunfolk majority; Luv-zhise is a port of men, elves and mycid traders; the demon realms rule thralls, orcs, goblins and men; Goldoroth keeps its goblin powder-quarters.

### Elven realms

Before: 65 (21 in the Magical Lands, 41 Sunhot, 3 Gala rows). After: 17. Magical Lands: Magical Forest, Herrodon, Andos Enda, Nolorim, Lccimio, Eldafaen, Yavieth. Middle Lands: Dunelaeth. Lands of the Sun: Gala, the Lands of Light, Elvana, Igara, Yeni Alang, Tor Luni, Ihuy, Soyano, the God Forest. States held by Magical Lands elves fall from 128 of 131 to about 21; the rest goes to the men of Teste and Luv-zhise, the mycids and the wild lands (the Lustras Hills of the krors, the Lost Lands, the Fallen Forest).

### By political form

The old roster had no political form. After: kingdom 31, lordship 14, city-state 12, council 12, league 11, hold 10, clan 9, theocracy 8, confederation 8, moot 7, principality 4, dominion 3, march 3, commonwealth 3, forest domain 3, enclave 3, captaincy 2, household 2, and one each of merchant principality, domain, garrison company, company state, wild land, order, wardenship, house, fellowship and commune.

### By focus tier

| Tier | Before | After |
| --- | ---: | ---: |
| Major | 13 | 13 |
| Regional | 71 | 73 |
| Shared | 221 | 69 |

### Faith and calendar

109 realms follow the twelve New Gods (each with its favoured gods and lesser gods, from `pantheon.json` faithLinks), 44 keep their own faith, 2 have none recorded (Zol's Mistake, the Mushroom Forest). The calendars: the Reckoning of the Twelve (`twelve`) 77; the elven count of seasons (`elven_seasons`) 17; the seasons only (`season_count`: orcs, trolls, giants, yeti, ents, Baelim, goblins) 22; the Storm Years of the southern islands 8; the Count of the Wells (`well_count`: Noris, Naamis, Woqood, Orato, Wahatud, Miaed) 6; the Ledger Count of the caravan princes (`ledger_count`) 6; the Count of the Floods of the river-kings (`flood_count`: Alerhia, Erco, Plutondo, Delbiz, Rhachia) 5; the Delving Count of the dwarf holds 4; the Musters of Volgan's Dominion 4; the Cords of the Orran peoples 2; the Count of the Halls of the demon houses 2; none 2. In the East and South Lands the river-kings, the pass-lords of Miaed and the oasis-folk of Wahatud keep their own faiths (`flood_stair`, `pass_fires`, `water_share`, new in `cultures_new.json`); the Noric and Stabilic realms honour the twelve under their own epithets but date by their own counts.

### Gunpowder

The dossiers suggest powder weapons in 16 realms: the four dwarf holds (Kunhrim, Brundahrim, Gromkerm, Hrakbrund), Kingson (Kunhrim's bombards in the pass forts) and Aenor (which buys Kunhrim's powder), Lerendor (bombards on its royal ships), Kradlon (workshops that bought the dwarves' secret) and Buldor (gunners for hire), Burrikkrit (mining powder and fire-pots) and Burnikit (the Dark Lands' best powder and handguns), Goldoroth (bombards) and Dondor (a few guns bought from the goblins), Drak (powder from the Furnace's sulphur) and Stabilo (bombards and hand-tubes), and Dolon (the Dominion's forge). Gunwyn despises guns; Noris may adopt or scorn them in its tree; Puvulan's orc companies get powder only after the "Dolon's Forge" focus.

## 3. The tag check

Tags come from `assignTags` in priority order (great powers and story realms first: Aenor AEN, Lerendor LER, Coldor CLD, Noris NRS because NOR is vanilla, Stabilo STA, Goldoroth GOL, Dondor DND, Puvulan PUV, Zol's Mistake ZOL, Mirolon MIR, Worshipdom WOR, Magical Forest MAG, Gala GAA, Gunwyn GNW, Selen SEL, Kingson KIN, Hirolon HIR). Dun's only possible tag is DUN, which Dunelaeth would take first, so Dun is given DUN as a fixed tag and Dunelaeth derives DNL.

`checkTags` result: no errors; 155 country tags and 75 dynamic tags make 230, below the crash limit of 439.

## 4. Names and languages

The new languages of `languages_new.json` are **Dwarvish** (family `delving`, 91 regular words, all matching their proto-forms under the five declared sound laws), **Gnomish**, the small folk's **Hearth-Speech**, the dwarf goblins' **Pack-Tongue** and the Baelim's **Low Speech** (isolates). Each passes the repository's reference run (250 place names and 250 persons each, no failure, no duplicate; signature shares 0.77 to 0.99), and every sample name passes the generator's checks. Merged into `languages.json` as they stand, they would take six personal names that other languages now generate (Leren Krakur, Mirolic Dolara, Orran Kelua and Gorre, Trollish Grumum and Baara) because the new name spaces sort earlier; nothing else in the existing pools changes. The mycids' speech stays reserved (the vault does not describe them), so the Mushroom Forest has no language; Dwarvish is lifted from the reserved list and from `reserved_names.json` doNotGenerate by the owner's placement of the dwarves.

Every realm name and capital of the roster was checked: no two are equal, and the only pair within one edit across languages is **Mirolon / Hirolon**, both the owner's. The banned-substring filter hits four established names (Zol's Mistake, Keredor-Hellekton, Pornivior, God Forest), which are exempt as drawn or vault names. Names the owner drew in English (the Cursed Lands, the Bloody Forest, the Troll Forest, the Windy Lands, the Wild Lands, the Dark Gate, the Darks, the Lens, the Lands of Light, the Yeti Lands, the God Forest, the Mushroom Forest, the Magical Forest, the Aenor Forest) are kept; "The Hold" is the one English realm name replaced (conflict 11). Endonyms are recorded where the realm's name is an exonym: Gruzgoroth (Goldoroth), Grootoom (Troll Forest), Haruhu (Yeti Lands), Goamboarv (Aenor Forest).

## 5. Focus trees

**Kept as they are (by id):** 11 of the 13 major trees (`aenor`, `lerendor`, `coldor`, `noris`, `stabilo`, `goldoroth`, `mirolon`, `worshipdom`, `magical_forest`, `gala`, `zol`) and 58 regional trees whose realm keeps its name.

**Kept and renamed with their realm:** `gunwaith` (Gunwyn), `volgan` (Puvulan), `regional_isengard` (Melkgard), `regional_titanos` (Nivaros), `regional_windwaith` (Vindael), `regional_asgard` (Orohaf), `regional_hiloron` (Hirolon; rethemed from "lake republic" to the Ring), `regional_demon` (Khorvrath), `regional_gondolin` (Naamis), `regional_avalon` (Rhachia), `regional_heaven` (Yeni Alang), `regional_godland` (Tor Luni), `regional_hengyang` (Soyano), `regional_the_end` (Eldafaen). The `gala` tree's country list changes from "Gala Elves" to Gala.

**Merged or re-tiered:** `regional_poyang` folds into the Soyano tree and is retired; `shared_ember_lands` (six freeholds) becomes Halia's own tree, `regional_halia`. The shared trees keep their ids but lose the merged rows: `shared_concord_dominions` 18 to 5 countries (Klungori Guard, Safeton, Freshon, Pazoma, Fotan; Kunhrim leaves it), `shared_cold_lands` 23 to 12, `shared_north_lands` 22 to 5, `shared_west_lands` 14 to 5, `shared_dark_lands` 17 to 10, `shared_east_lands` 24 to 9 (with Wahatud of the South Lands), `shared_tritons_islands` 28 to 5, `shared_islands_of_the_south` 15 to 4, `shared_lands_of_the_sun` 39 to 3, `shared_magical_lands` 15 to 4. Each shrinking shared tree needs new modules where a new people joins it: goblins and yeti in the Cold Lands, the small folk in the West, the dwarf goblins in the North, goblins, giants and demons in the Dark Lands, sealers, island watchers and an oasis module in the East, a port and a mycid module in the Magical Lands.

**To write:** two new regional trees, **Burrikkrit** (the hobgoblin king: the Lamp Truce, the under-roads as a secret to sell, the hobgoblin succession, wurgh riders, gold-hunger) and the **Nether** (the houses, the pacts, the gates, the bargain with Nafeher, the choice when Volgan's body breaks); and two new shared trees, **`shared_delving_holds`** for the four dwarf holds across three regions (the deep halls, the gate-trade, the powder secret, the Iron Charter, the Hill Pact, the old grudge against elves) and **`shared_middle_free`** for the free realms of the Middle Lands outside the Charters (Olodor, Dunelaeth, the Aenor Forest). The dwarf tree breaks the tier spec's rule of one shared tree per region; the alternative is one module in each of three regional shared trees.

The tier table of `docs/specs/05_focus_trees/01_tiers_and_coverage.md` must be regenerated from the new roster.

## 6. Mechanics and events that name changed realms

| Old name | Mentions in the mechanic specs | Mentions in the focus designs | New |
| --- | --- | --- | --- |
| Volgan (as a country) | `volgan_southern_dominion`, `dark_lands`, `eindil_journey`, the contract (about 530 mentions, most of them the person) | 119 across 15 trees | Puvulan |
| Gunwaith | `western_crossing` 73, `eindil_journey` 12, `cold_lands` 7 | 62 | Gunwyn |
| Isengard | `cold_lands` 88 | 66 | Melkgard |
| Gala Elves, North Gala | `lands_of_the_sun` 72, `eindil_journey` 16 | 44 | Gala |
| Gondolin, Avalon | `eastern_kings` 14 | 49 | Naamis, Rhachia |
| Demon | `volgan_southern_dominion` 10 | 35 | Khorvrath |
| Windwaith, Titanos, Wonderland, Celen, the Yeti Lands split | `cold_lands` 45 | 50 | Vindael, Nivaros, Austklev, Kvittumm, Yeti Lands and Ghaahu |
| Hiloron, Hilofrim | `aenor_court_and_succession`, `afrit_hidden_council`, `eindil_journey`, `lands_of_the_sun` | 25 | Hirolon |
| Lerenwaith | `lerendor_narrow_strait` 9 | 22 | Veskel, inside Lerendor |
| Asgard | `western_crossing` 9 | 13 | Orohaf |
| Heaven, Godland, Hengyang, Poyang | `lands_of_the_sun` 11 | 50 | Yeni Alang, Tor Luni, Soyano |
| The End, Greenland and the merged elven rows | `elves_wall_and_dragons`, `eastern_kings` | 25 | Eldafaen, Yavieth, merged |
| The Hold | `lerendor_narrow_strait` 3, `dark_lands` 2 | 15 | Dolpar |
| Fondor | `dark_lands` 1 | 6 | Skragdurg |
| Kunhrim (riders), Hky, Mustnom, The Darks (people changed) | `aenor_court_and_succession` 1 | 10 | dwarves, small folk (Dobbum), dwarf goblins, orcs and ogres |
| The 13 dominion rows merged into Aenor, Selen, Kingson, Hunhun, Herez, Safeton and Hirolon | `aenor_court_and_succession` dominion table | `shared_concord_dominions` | 26 charter-seats held by 13 dominions (question 2) |
| The Great Wall, the Wall Accord, Wall-Folk, Stone Vigil | `elves_wall_and_dragons`, `eastern_kings`, the contract | 18 | a natural range; the Accord of the Passes, Vale-Folk of Kingson, the Pass Vigil |
| The 41 Sunhot rows merged into seven | `lands_of_the_sun` (the Noon Council's seats) | `shared_lands_of_the_sun` | seven Sunhot realms plus Gala and Goodin as guests |
| The merged eastern courts | `eastern_kings` (lean table, road waypoints) | `shared_east_lands` | 18 courts; the Salt Road runs Furvior to Duum-Saah, the Gold Road Vobibiz, Postondoroth, Mostok, Kersian, Azano and Porrenva |
| Kusven | `zols_mistake` (the manifestation) | `zol` | Kusven takes the field in Zol's stead (sealed in player text) |

The new realms with mechanics of their own are proposed in the dossiers and listed in each realm's `storyRole`: the dwarf gate-trade and powder, the Ronbo Watch, gold for luck, the warm valleys, the snowline fair, the under-roads, the cairn-line, the Nether pact, the Well-Moot. None has a spec yet.

## 7. Questions for the owner

1. **The small folk's homeland.** This roster puts it in the West, in the Ronbo basin (**Dobbum**, men's Dolw-Grewn), guarded by the Ronbo Watch and the dwarves of the passes. The other dossier proposes the three Hilorn valleys inside Hirolon's ring, guarded by the giants (Tirlan, a protectorate of Hirolon). Which do you want?
2. **The Concord's 26 charters.** May 26 charter-seats be held by 13 dominions (Selen, Konori, Hunhun, Kingson, Klungori Guard, Herez, Noleksun, Kilinti, Safeton, Freshon, Pazoma, Orohaf, Kunhrim), or must 26 separate dominions exist on the map?
3. **The dwarf hold names.** Do you accept Kunhrim, Brundahrim, Gromkerm and Hrakbrund, built from one Dwarvish dictionary, with the men's names Chalwe-Brenn, Garth-Stenn and Karundun kept as exonyms?
4. **Hirolon and Mirolon.** They are one letter apart and both important. Keep both, or respell one? (The roster keeps both and gives Hirolon a Giants' Speech reading.)
5. **Burnikit.** May the Dark Lands keep a free goblin warren under its own boss beside the hobgoblin king's Burrikkrit in the Middle Lands, or should the Dark Lands goblins live only inside the orc holds?
6. **Eastern faiths.** Do you accept that the river-kings (`flood_stair`), the pass-lords of Miaed (`pass_fires`) and the oasis-folk of Wahatud (`water_share`) keep their own faiths outside the twelve, and the calendars listed in section 2?
7. **The mycids and the God Forest Keepers.** The Mushroom Forest is a realm without a language until you describe the mycids; the God Forest Keepers are given Sunhot speech as a working assumption. Is that right?

## 8. Limitations

The roster is a design file: tags, populations, cultures and trees are not yet in the builder's data, and the states of each realm are given as the dossiers' descriptions or state counts, not as geography-model state ids, because the state map is not part of this task. Capital site ids are given only where the geography model has a matching site. Heraldry grammars exist for the new peoples (dwarves, small folk, goblins, hobgoblins, dwarf goblins, gnomes) but not yet for the new cultures, and not at all for the Baelim and the mycids. The working capital name of Yeldenne (Simoto) waits for the owner's reading of the drawn "Hul..." label.
