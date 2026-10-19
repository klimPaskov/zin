# The world in the game

**Status:** Draft. **Date:** 19 October 2026. **Priority:** 2. **Phase:** 2 to 5 (names and characters in phase 2; art and units in phases 5 to 7).
**Reads:** [05_world_bible.md](05_world_bible.md), [06_languages.md](06_languages.md), [07_demography_and_settlement.md](07_demography_and_settlement.md). **Data:** [tools/content/data/world/](../../../tools/content/data/world/) (`languages.json`, `cultures.json`, `country_cultures.json`, `demography.json`).

## Purpose

The bible, the languages and the demography exist to be read by the game. This spec says how each of them reaches every system: names, places, characters, portraits, flags, national spirits, units, buildings, events, focus trees, the Chronicle, loading tips and music. It gives a coverage matrix (what is unique to a culture, what is shared), the asset budgets, and the checks the build and the Linux run use to prove it.

Every number is a design target. Every culture, language and faith named here is proposed unless the bible says otherwise.

## 1. One culture key for every system

The 53 cultures of the bible are the unit. Each country carries four flags on startup, written beside the people flag by `tools/content/modules/peoples.mjs`:

| Flag | Value | Used for |
| --- | --- | --- |
| `zin_culture_<id>` | The country's dominant culture | Names, portraits, flags, units, spirits, events, focus flavour |
| `zin_culture2_<id>` | The second culture, where truly mixed | Events and minor portrait pools |
| `zin_language_<id>` | The language of the culture | Name generation, ruler titles |
| `zin_faith_<id>` | The faith of the country | Spirits, events, the Chronicle |

Scripted triggers `zin_culture_is_<id>` and `zin_faith_is_<id>` are generated, as the people triggers are ([03_peoples.md](../00_foundation/03_peoples.md) section 6). The mapping of countries to cultures is the data file `country_cultures.json`; `docs/design/countries.csv` gets three new columns (`culture`, `culture2`, `faith`), filled from it and owner-editable like the people column. A change in the CSV changes the flags, the portrait pool, the names and the art of that country only (the determinism test of the foundation spec).

## 2. Names

| System | How the bible reaches it | File and module |
| --- | --- | --- |
| Country names | Kept as drawn. Native forms appear in the Chronicle and in loading tips only | `localisation/replace/world_l_english.yml` (politics step) |
| State names (1,332) | `resolveName` with kind `region` or `settlement`; the state's culture; the toponym layers | Politics step, reading `names_resolved.json` |
| Victory points and capitals | `settlement` patterns by size; the eight working seats and the 18 drawn capitals stay | Politics step |
| Province names | `settlement` pattern, hamlet size | `localisation/english/province_names_l_english.yml` |
| Strategic regions (275) | The dominant feature of the geography model, in the language of the region's culture | `localisation/english/strategic_region_names_l_english.yml` |
| Rivers, lakes, seas, mountains | The geography model's names where they exist; the generator for the rest | Map labels and the Chronicle |
| Characters | See section 3 | `modules/characters.mjs` |
| Ideology, party and faction names | Faith and culture words from the language (`titles`): "the Speakers' Hall", "the Bench of Houses", "the Well-Lords" | `modules/ideologies.mjs` and the politics step |
| Dynamic tags (75) | Names from the language of the civil war's culture | `common/names/zin_names.txt` default pool |

The replacement of `names.mjs` is specified in [06_languages.md](06_languages.md) section 9. The `default` pool, which names the 75 dynamic tags, comes from the Aenoran and Coldic lists (the Common Speech), so that civil-war leaders sound like Erdae.

## 3. Characters and ruler naming

- **Rulers.** `characters.mjs` stops reading syllable pools and calls `resolveName` with kind `given_m` or `given_f`, then the culture's house style. Ruler titles come from `person.titles`. The canon rulers (the Golden King, Volgan, the Will of Zol, Aurevan the Deliverer, Horos, King Lorien) keep their fixed ids and names. Named councillors of the characters spec keep their names; where a name in [02_characters.md](../02_lore/02_characters.md) does not fit its culture's language, the characters spec gives the language-driven alternative in the Chronicle notes and the owner decides.
- **Sex and age.** Rulers of Great Folk never expire ([03_peoples.md](../00_foundation/03_peoples.md)); rulers of men draw an age from the culture (Gala and Sunhot rulers are old; Steppe Riders young; Wall-Folk middle-aged).
- **Do-not-generate list.** The Golden King's own name, the King of Demons, Zol's administrator, Roka's people, the dwarves, the angels and every New God but Glernaen have no entry in any language.
- **Hearth-names.** Not in the game; text may mention that Aenorans have them.
- **Houses.** A noble house of a culture with surnames has a house name; the same house recurs in a country's councillors, generals and ambassadors.

## 4. Portraits and culture pools

Portraits stay image-generated ([08_art_and_assets/01_art_pipeline.md](../08_art_and_assets/01_art_pipeline.md)). Today there are two per sex per people (`VARIANTS = 2`). The bible moves the unit to the culture:

- **Tier 1 cultures (12):** 6 portraits per sex (12), unique to the culture. These are the cultures of the great powers and story realms.
- **Tier 2 cultures (17):** 4 per sex (8), unique.
- **Tier 3 cultures (24):** 2 per sex (4) built on the people kit with a local colour or dress (goblins 1 per sex).
- **Total:** about 374 culture portraits, replacing the 20 people portraits (the people kit stays as a fallback). Named characters keep their own portraits ([02_characters.md](../02_lore/02_characters.md): about 140 images).
- **Prompts.** The look line of each culture (flag, portrait, building, unit, music) in the bible's "In the game" row is the art direction. A portrait prompt adds: the people (Common Folk faces mortal, Great Folk ageless), the dress of the culture, the dark neutral background and warm key light of the leader style, and the frame lines of art decision A4 ("no signature, no lettering, no real-world religious symbol").
- **Portrait pool file.** `portraits/zin_portraits.txt` gains one block per culture; the country block lists its culture's sprites first and the people kit second. Zol uses emblems only (S4); the hosts have numeral emblems.

## 5. Flags and heraldry

- **Base flags (305)** exist. They are regenerated only when the owner asks. New flag jobs follow each culture's **grammar**: field colours (the palette in `cultures.json`), charge family (lamp, bell, wave, arrow, horse head, tower, ship, well, scale, river, leaf, flame, tree and so on from the culture's heraldry line), shape (rectangular for most; swallow-tail for Leren; pennant for steppe), and rules (no written letters, no real-world symbol).
- **Ideology and cosmetic-name flags** are made only for the countries whose government the story can change ([04_countries_and_states.md](../00_foundation/04_countries_and_states.md) section 4), in their culture's grammar.
- **Faction and subject banners** reuse the leader's grammar with a border for the league.
- **Dynamic tags (75)** take a grammar by the culture of the civil war.
- The budget for the bible adds no new flags by itself; it adds **53 grammar sheets** (one reference sheet each) so that flag jobs for any country of a culture stay consistent.

## 6. National spirits and laws per culture and faith

Spirits are small and permanent, in the style of the regional economic spirits of [02_economy.md](../03_gameplay/02_economy.md). Numbers belong to the ideas spec; the bible gives the direction.

| Spirit kind | Id pattern | Given to | Direction |
| --- | --- | --- | --- |
| Culture spirit | `zin_culture_<id>` | Every country of a tier 1 or tier 2 culture | One idea of the culture's way of war or livelihood: Peace of the One Crown for Lake Aenorans (internal wars cost more), the Quiet Law for Selen (bow bonus in woods), the Horse-Oath for riders (cavalry), the Stone Vigil for Wall-Folk (forts), the Well-Oath for Noris (desert supply), the Honest Scale for Stabilo (trade), the Slow Rite for ents, the Hum for yeti, the Skull and the Fire for the Volcano Clans |
| Faith spirit | `zin_faith_<id>` | Every country of a faith not already covered by a culture spirit | Stability or opinion themes: the Deliverer's houses (stability, clinic and school; **hidden effects**), the Lamp and the Furrow (grain and morale), the Kindred Song (research) |
| Region-culture spirit | `zin_regional_culture_<region>_<kind>` | Tier 3 cultures | One shared spirit for the whole group (March-Folk, Free Crowns of the North, Corsair Lords) |

Laws: no new law categories. The existing trade, economy and mobilisation laws are renamed by the economy spec; the culture decides which law its AI prefers (Leren: free trade; Stabilo: scale-taxed trade; Noris: caravan tolls; Gala: closed trade).

**Secrecy.** The Faith of the Deliverer has two descriptions: the public one, safe for every player, and the hub one, shown only to the Worshipdom. The same rule as the labels of [03_names_and_terms.md](../02_lore/03_names_and_terms.md) applies to every [secret] row of the bible.

## 6a. Culture and the AI

AI strategy files choose a stance by culture where the vault allows. They never lock a country into a story route. Peaceful start values stay as in the foundation spec.

## 7. Units, buildings and the 3D look

- **Unit look groups (21):** aenoran_blue, ranger_green, steppe_riders, north_sea, iron_brute, orc_horde, warden_blue, winter_crown, western_clan, island_marines, desert_riders, bronze_merchants, elven, sun_elven, troll, giant, yeti, ent, dead, demon, forest_tribes. The graphical culture of the unit models is `zin_<group>_gfx`; the people graphical cultures of today (`zin_<people>_gfx`) become the fallback. 3D models for the new groups come from the Meshy pipeline ([08_art_and_assets/01_art_pipeline.md](../08_art_and_assets/01_art_pipeline.md) section 7) in tiers: the five existing infantry kits first (warrior, revenant, brute, warden, plus the Aenoran blue), then the other groups as credits allow.
- **Building kits (51):** lake_stone, wall_grey, march_palisade, forest_timber, felt_tents, harbour_stone, turf_halls, tree_halls, quay_timber, hill_fort, iron_hall, stilt_beacon, mud_brick_sea, frost_stone, turf_hall, black_fort, harbour_wood, hill_ring_fort, bridge_town, guild_canal, barracks, stilt_harbour, cliff_harbour, stilt_reef, mud_wind_tower, bronze_colonnade, stair_temple, stilt_lantern, kiln_brick, sun_brick, living_tree, hillside_hall, water_garden, pass_fort_elf, shore_tower, white_gold_hall, sun_sanctuary, shore_sanctuary, black_cliff_city, hold_town, burrow, cliff_harbour_orc, warren, cave_heap, giant_hall, ice_hall, cave_home, grove, black_fortress, black_ruin, obsidian_hall. A kit is a set of generated 2D building icons and, later, 3D props. The state pass picks the kit by the culture of the owner.
- **Landmarks:** the Golden Court, the Great Wall gate at Kingson, the Singing Quay at Sonargur, the Frost-Hall at Fandanar, the Hall of Scales at Postondoroth and the Flood-Court of Alerhia are the first landmarks. Each belongs to a tier 1 or 2 culture.

## 8. Events and decisions

- Flavour events fire by the `zin_culture_*` and `zin_faith_*` flags: a festival of the culture's calendar (the Lamp-Lighting, the Foaling, the Relighting, the First Water), a faith event on a holy day, a regional custom (hospitality at the Wall, the ransoming at a corsair harbour).
- Events never name Afrit before the reveal; the Faith of the Deliverer is safe in every culture, with the hub description reserved for the Worshipdom.
- Decisions use the culture's verbs (call the Gathering, light the Clan Fire, send for the Well-Lords, summon the Speaker's Hall). The cost palette of the planning standard applies: grain, horses, favour, watch-posts and ships, not only political power.

## 9. Focus-tree flavour

- Tier 1 cultures have a **flavour branch** in their major tree (Lake Aenorans: the Concord and the Houses; Leren: the strait; Noris: the wells; Stabilo: the bench of houses; Volcano Clans: the Fire-Mountain; Gala: the Mirror; the Magical Forest: the Kindred).
- Tier 2 cultures carry a **flavour set** (three to five focuses) in their regional trees.
- Tier 3 cultures use the shared regional tree with names drawn from the culture's verbs and festivals.
- Focus names and descriptions follow the writing standard of the planning skill (no pasteable sample lines here); this spec gives only the direction.

## 10. Chronicle codex

[04_chronicle_codex.md](../07_interface/04_chronicle_codex.md) gains entries from the bible, in its categories *Peoples* and *Lands and Places*:

- One entry for each tier 1 culture (about 2 each: 24), one for each tier 2 culture (17) and one per group for tier 3 (about 12). About 53 entries.
- One entry per **faith** that players can meet openly (about 20; the hub description of the Deliverer's faith is an unlockable entry after the reveal).
- Eight entries on **languages**: Old Ainic and the Common Speech, the Boreal tongues, the Eastern tongues, the elvish tongues, Orran, the orc tongues, the Giants' and Yeti speech, Infernal. Each shows a few words and what a name means.
- Unlock rules: a culture entry unlocks when the player controls or borders a country of that culture, or visits its capital; faith entries when a state of that faith is controlled; language entries with the first culture of the family.
- Text limits of the Chronicle (7) apply: two paragraphs. Text is written from the bible's rows; secrets are not shown.

## 11. Loading tips

`tools/content/data/loading_tips.json` gains about 94 tips: one to three per culture, each one sentence about a custom, a festival or a place (for example the lamp in the window of Aenor, the tide-chamber of Asgard, the knot-cords of the Bloody Forest). No tip names Afrit; none uses a secret row.

## 12. Music mood

Music is synthesised in code from ZIN-written scores (decision A9). The bible gives 14 **mood palettes**: choral_bells, woodland, steppe_drums, sea_horns, iron_drums, northern_throat, western_pipes, desert_reeds, lyre_bronze, warden_horns, elven_voices, gong_flute, dread, slow_bass. A country plays its culture's palette in peace and the war palette of its unit kit in war. Tier 1 and 2 cultures have unique palettes; tier 3 share one.

## 13. Coverage matrix

U = unique to the culture; V = variant of a shared kit; S = shared. "Names" is always unique because every culture has its own language (Zol's Dead have none: numbered hosts).

| Culture | Tier | People | Names | Portraits | Flags | Spirits | Units | Buildings | Events | Focus | Chronicle | Tips | Music |
| --- | ---: | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ---: | --- |
| Lake Aenorans | 1 | Men | U | U 12 | U grammar | U culture + faith | U aenoran_blue | U lake_stone | U | U branch | 2 entries | 3 | U choral_bells |
| Selen Rangers | 2 | Men | U | U 8 | U grammar | U culture | V ranger_green | V forest_timber | V region | V flavour | 1 entry | 2 | U woodland |
| Steppe Riders | 2 | Men | U | U 8 | U grammar | U culture | V steppe_riders | V felt_tents | V region | V flavour | 1 entry | 2 | U steppe_drums |
| Wall-Folk | 2 | Men | U | U 8 | U grammar | U culture | V aenoran_blue | V wall_grey | V region | V flavour | 1 entry | 2 | U choral_bells |
| March-Folk | 3 | Men | U | V 4 | V grammar | V region + faith | V aenoran_blue | S march_palisade | S region | S shared tree | group entry | 1 | V woodland |
| Isle Houses of Asgard | 2 | Men | U | U 8 | U grammar | U culture | V aenoran_blue | V harbour_stone | V region | V flavour | 1 entry | 2 | U sea_horns |
| The Veiled | 3 | Men | U | V 4 | V grammar | V region + faith | V forest_tribes | S turf_halls | S region | S shared tree | group entry | 1 | V woodland |
| Redbark Tribes | 3 | Men | U | V 4 | V grammar | V region + faith | V forest_tribes | S tree_halls | S region | S shared tree | group entry | 1 | V woodland |
| Leren of the Strait | 1 | Men | U | U 12 | U grammar | U culture + faith | U north_sea | U quay_timber | U | U branch | 2 entries | 3 | U sea_horns |
| Free Crowns of the North | 3 | Men | U | V 4 | V grammar | V region + faith | V north_sea | S hill_fort | S region | S shared tree | group entry | 1 | V sea_horns |
| Dondor Brutes | 2 | Men | U | U 8 | U grammar | U culture | V iron_brute | V iron_hall | V region | V flavour | 1 entry | 2 | U iron_drums |
| Wardens of Mirolon | 2 | Men | U | U 8 | U grammar | U culture | V warden_blue | V stilt_beacon | V region | V flavour | 1 entry | 2 | U warden_horns |
| Dead Lands Freeholders | 3 | Men | U | V 4 | V grammar | V region + faith | V warden_blue | S mud_brick_sea | S region | S shared tree | group entry | 1 | V warden_horns |
| Winter-Crown Folk | 1 | Men | U | U 12 | U grammar | U culture + faith | U winter_crown | U frost_stone | U | U branch | 2 entries | 3 | U northern_throat |
| Ice Clans | 3 | Men | U | V 4 | V grammar | V region + faith | V winter_crown | S turf_hall | S region | S shared tree | group entry | 1 | V northern_throat |
| Isengard Warlords | 2 | Men | U | U 8 | U grammar | U culture | V iron_brute | V black_fort | V region | V flavour | 1 entry | 2 | U iron_drums |
| Windwaith Seafarers | 3 | Men | U | V 4 | V grammar | V region + faith | V winter_crown | S harbour_wood | S region | S shared tree | group entry | 1 | V sea_horns |
| Gunwaith Clans | 1 | Men | U | U 12 | U grammar | U culture + faith | U western_clan | U hill_ring_fort | U | U branch | 2 entries | 3 | U western_pipes |
| Girdon Wardens | 2 | Men | U | U 8 | U grammar | U culture | V western_clan | V bridge_town | V region | V flavour | 1 entry | 2 | U western_pipes |
| Western Guildmen | 3 | Men | U | V 4 | V grammar | V region + faith | V western_clan | S guild_canal | S region | S shared tree | group entry | 1 | V western_pipes |
| Buldor Companies | 3 | Men | U | V 4 | V grammar | V region + faith | V western_clan | S barracks | S region | S shared tree | group entry | 1 | V western_pipes |
| Chart-Islanders | 2 | Men | U | U 8 | U grammar | U culture | V island_marines | V stilt_harbour | V region | V flavour | 1 entry | 2 | U sea_horns |
| Corsair Lords | 3 | Men | U | V 4 | V grammar | V region + faith | V island_marines | S cliff_harbour | S region | S shared tree | group entry | 1 | V sea_horns |
| Noris Camel Warriors | 1 | Men | U | U 12 | U grammar | U culture + faith | U desert_riders | U mud_wind_tower | U | U branch | 2 entries | 3 | U desert_reeds |
| Caravan Princes | 1 | Men | U | U 12 | U grammar | U culture + faith | U bronze_merchants | U bronze_colonnade | U | U branch | 2 entries | 3 | U lyre_bronze |
| River-Kings of the East | 2 | Men | U | U 8 | U grammar | U culture | V bronze_merchants | V stair_temple | V region | V flavour | 1 entry | 2 | U lyre_bronze |
| Lake Road Cities | 3 | Men | U | V 4 | V grammar | V region + faith | V bronze_merchants | S stilt_lantern | S region | S shared tree | group entry | 1 | V lyre_bronze |
| Red Lands Tribunes | 3 | Men | U | V 4 | V grammar | V region + faith | V bronze_merchants | S kiln_brick | S region | S shared tree | group entry | 1 | V lyre_bronze |
| Southern Islanders | 3 | Men | U | V 4 | V grammar | V region + faith | V island_marines | S stilt_reef | S region | S shared tree | group entry | 1 | V sea_horns |
| Zilin Pilgrim-Folk | 1 | Men | U | U 12 | U grammar | U culture + faith | U aenoran_blue | U lake_stone | U | U branch | 2 entries | 3 | U choral_bells |
| Goodin Sunfolk | 3 | Men | U | V 4 | V grammar | V region + faith | V sun_elven | S sun_brick | S region | S shared tree | group entry | 1 | V gong_flute |
| Council Elves of the Magical Forest | 1 | Elves | U | U 12 | U grammar | U culture + faith | U elven | U living_tree | U | U branch | 2 entries | 3 | U elven_voices |
| Hill-Kingdom Elves | 3 | Elves | U | V 4 | V grammar | V region + faith | V elven | S hillside_hall | S region | S shared tree | group entry | 1 | V elven_voices |
| Lake Elves | 3 | Elves | U | V 4 | V grammar | V region + faith | V elven | S water_garden | S region | S shared tree | group entry | 1 | V elven_voices |
| Pass-Warden Elves | 3 | Elves | U | V 4 | V grammar | V region + faith | V elven | S pass_fort_elf | S region | S shared tree | group entry | 1 | V elven_voices |
| Rift-Coast Elves | 3 | Elves | U | V 4 | V grammar | V region + faith | V elven | S shore_tower | S region | S shared tree | group entry | 1 | V elven_voices |
| Gala Elves | 1 | Elves | U | U 12 | U grammar | U culture + faith | U sun_elven | U white_gold_hall | U | U branch | 2 entries | 3 | U elven_voices |
| Sunhot Elves of the Light | 2 | Sunhot elves | U | U 8 | U grammar | U culture | V sun_elven | V sun_sanctuary | V region | V flavour | 1 entry | 2 | U gong_flute |
| Western Sanctuary Sunhot | 3 | Sunhot elves | U | V 4 | V grammar | V region + faith | V sun_elven | S sun_sanctuary | S region | S shared tree | group entry | 1 | V gong_flute |
| Isle Sunhot | 3 | Sunhot elves | U | V 4 | V grammar | V region + faith | V sun_elven | S shore_sanctuary | S region | S shared tree | group entry | 1 | V gong_flute |
| Volcano Clans | 1 | Orcs | U | U 12 | U grammar | U culture + faith | U orc_horde | U black_cliff_city | U | U branch | 2 entries | 3 | U iron_drums |
| Iron Clans | 2 | Orcs | U | U 8 | U grammar | U culture | V orc_horde | V hold_town | V region | V flavour | 1 entry | 2 | U iron_drums |
| Wild Holds | 3 | Orcs | U | V 4 | V grammar | V region + faith | V orc_horde | S burrow | S region | S shared tree | group entry | 1 | V iron_drums |
| Sea Orcs | 3 | Orcs | U | V 4 | V grammar | V region + faith | V orc_horde | S cliff_harbour_orc | S region | S shared tree | group entry | 1 | V iron_drums |
| Goblin Warrens | 3 | Orcs | U | V 2 | V grammar | V region + faith | V orc_horde | S warren | S region | S shared tree | group entry | 1 | V iron_drums |
| Troll Tribes | 2 | Trolls | U | U 8 | U grammar | U culture | V troll | V cave_heap | V region | V flavour | 1 entry | 2 | U slow_bass |
| Hill Giants of Hiloron | 2 | Giants | U | U 8 | U grammar | U culture | V giant | V giant_hall | V region | V flavour | 1 entry | 2 | U slow_bass |
| Ice Giants of Titanos | 3 | Giants | U | V 4 | V grammar | V region + faith | V giant | S ice_hall | S region | S shared tree | group entry | 1 | V slow_bass |
| Yeti Clans | 2 | Yeti | U | U 8 | U grammar | U culture | V yeti | V cave_home | V region | V flavour | 1 entry | 2 | U northern_throat |
| Ents of Kilinti | 2 | Ents | U | U 8 | U grammar | U culture | V ent | V grove | V region | V flavour | 1 entry | 2 | U slow_bass |
| Grave Hosts of Volgan | 1 | The dead | U | U 12 | U grammar | U culture + faith | U dead | U black_fortress | U | U branch | 2 entries | 3 | U dread |
| Zol's Dead | 1 | The dead | U | U 12 | U grammar | U culture + faith | U dead | U black_ruin | U | U branch | 2 entries | 3 | U dread |
| Netherborn | 2 | Demons | U | U 8 | U grammar | U culture | V demon | V obsidian_hall | V region | V flavour | 1 entry | 2 | U dread |

### Budget of the bible

| Asset | Count | Basis |
| --- | ---: | --- |
| Culture portraits | about 374 | Tier 1 x 12, tier 2 x 8, tier 3 x 4 (minor 2) |
| Culture grammar sheets for flags | 53 | One per culture |
| Culture spirits and faith spirits | about 61 | Tier 1 two each, tier 2 one each, about 20 faith spirits |
| Unit look groups | 21 | Five 3D kits exist; the rest follow credits |
| Building kits (2D icon sets) | 51 | One per culture group |
| Chronicle entries | about 81 | Cultures, faiths, languages |
| Loading tips | about 94 | One to three per culture |
| Music mood palettes | 14 | Code-synthesised |
| Languages | 24 | In `languages.json`; no art |

## 14. Checks

### Build checks (offline)

1. **Name-leak check.** For each language, 55% of generated names carry a signature feature and none carries another language's leak marker ([06_languages.md](06_languages.md) section 6). A planted Sunhot name in an Orcish pool fails.
2. **Population-versus-geography check.** Region totals within 1% of the targets; no wasteland state above 30,000 people; river and lake states denser than their inland neighbours ([07_demography_and_settlement.md](07_demography_and_settlement.md) section 9).
3. **Culture coverage check.** Every country has exactly one dominant culture; every culture is used (the goblin warrens excepted); every culture has a language (Zol's Dead excepted), a faith, a portrait set, a unit kit, a building kit, a music palette and at least one loading tip.
4. **Faith coverage check.** Every faith in the table of the bible is kept by at least one culture; no faith names a New God except Glernaen.
5. **Secret check.** No player-visible string derived from a [secret] row names Afrit, the Hidden Council or the birth rolls before `zin_afrit_revealed` (the term check T2 of the names spec, extended with the bible's rows).
6. **Do-not-generate check.** No generated name matches the list of [06_languages.md](06_languages.md) section 4.
7. **Banned-name check.** No generated name contains a banned substring or a modern word.
8. **Determinism.** Two builds give identical `names_resolved.json`, `state_population.json` and culture flags.
9. **Label check.** The bible, the language file and this spec carry no TODO or TBD, and every proposal is either unmarked in a proposal table or marked P.

### Linux run (start as Aenor, Lerendor, Noris, Coldor, the Magical Forest, Volgan)

1. A console read of `zin_culture_*`, `zin_language_*` and `zin_faith_*` on the six countries returns the table values.
2. The state list of each country shows language-driven state and victory-point names with no `District` name.
3. A scan of the localisation loaded in the game finds no name from the do-not-generate list.
4. World population reported by the statistics screen is within 5% of 86.6 million.
5. A ruler of each culture shows a name from the right language; the Worshipdom's ruler shows the public name; Zol's leader shows the emblem name.
6. The clock runs for the S8a duration with no new errors.

## 15. Implementation

| File or module | Change | Written by |
| --- | --- | --- |
| `tools/content/modules/naming.mjs` (new) | The generator of the language contract | Content builder |
| `tools/content/modules/names.mjs` | Becomes a thin wrapper over `naming.mjs` | Content builder |
| `tools/content/modules/peoples.mjs` | Writes the culture, language and faith flags and triggers | Content builder |
| `tools/content/modules/characters.mjs` | Reads cultures for rulers and houses | Content builder |
| `tools/content/modules/portraits.mjs` | Culture portrait pools | Content builder |
| `tools/content/modules/terms.mjs` | The label table gains the bible's [secret] rows | Content builder |
| `tools/content/modules/units3d.mjs` | `cultureOf` returns the unit look group | Content builder |
| `tools/content/data/world/*.json` | The four data files of this package | Design (this package) |
| `tools/content/checks/world_data.mjs` | The checks of section 14 | Content builder |
| `docs/design/countries.csv` | Columns `culture`, `culture2`, `faith` | Content builder, owner-editable |

## 16. Open questions

All proceed on their proposals.

1. Should the unit kit follow the culture (21 groups) or stay with the people (10)? **Proposal in use:** the culture, with the people kit as fallback.
2. Should every tier 3 culture really share a portrait kit? **Proposal in use:** yes; tier 3 gets a local colour only.
3. May the Chronicle show the hub description of the Faith of the Deliverer to Aenor after the reveal? **Proposal in use:** yes (owner question 20).
4. Do the owner's drawings of Horos stay private and unused? **Proposal in use:** yes (A6).
