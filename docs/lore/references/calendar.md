# The Reckoning of the Twelve: the calendar of Aoaz

**Status:** The twelve month names, their order and the start on 1 Lumae are accepted by the owner (decision K28); the local reckonings follow decision K30; the rest is proposed. Implemented in the content builder on 24 October 2026 (section 8). **Date:** 24 October 2026. **Requirement:** R-31 (calendar).
**Companions:** [pantheon.md](pantheon.md) (R-30, the gods and their needs), [edvoid_name.md](edvoid_name.md) (Q-10). **Data:** the month fields and `calendar` block of [tools/content/data/world/pantheon.json](../../../tools/content/data/world/pantheon.json), which `tools/content/lib/calendar.mjs` is to read.
**Sources read:** `tools/content/lib/calendar.mjs`, `tools/content/modules/calendar.mjs`, `tools/content/calendar.test.mjs`, `docs/specs/00_foundation/01_start_and_calendar.md`, the vault's `07 - History/Fourth Age Chronology.md`, `Ages of Aoaz.md`, `Canon Policy.md` and `09 - Development/Names and Retcons.md` (K3), the faith festivals of `tools/content/data/cultures_game.json`, and the month keys of the installed game's localisation in all ten languages (`core_l_<language>.yml`, `combat_l_<language>.yml`).

Labels as in [pantheon.md](pantheon.md): **E** established, **P** proposed, **O** open. The twelve month names and their order are **E** (decision K28); their short forms, abbreviations, festivals and history are **P**.

## 1. What is fixed

- Aoaz keeps **twelve months, each named after one of the twelve main New Gods** (E, owner, 24 October 2026). The earlier farming-year names (Deepwinter to Longnight) are superseded as names (E, vault K3) but their seasons stay as the calendar mechanic (owner instruction for this task).
- **Glernaen** names one month (E); which one is proposed here.
- **Afrit's cult adds a feast, not a month** (E).
- **The game starts on the first day of the third month of 4A 1748** (E situation; the engine date `1748.3.1.12` stays).
- The vault's seasons: months 1, 2 and 12 winter; 3 to 5 spring; 6 to 8 summer; 9 to 11 autumn (`Fourth Age Chronology.md`, P, kept).
- The engine counts twelve months with Earth's lengths and has no leap day; month lengths do not change.

## 2. The twelve months

The order follows the farming year of the Middle Lands, where the Reckoning was made: each month is named for the god whose need presses hardest in that season (P).

| No. | God | English game form (full key) | Short form (prose) | Abbreviation (short key) | Engine keys | Former name | Season | What the land is doing | Why the month is this god's |
| ---: | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Glernaen | **Glernaen** | Glern | **Gler** | `January`, `Jan` | Deepwinter | winter | Fields asleep under frost; stores counted and rationed; councils sit and laws are read | The year opens with the need for strength and counsel: a wrong decision now starves a village by spring |
| 2 | Sulethe | **Sulethe** | Sule | **Sul** | `February`, `Feb` | Ironfrost | winter | The hardest frost and the hunger gap; fevers in shut houses; only the warm springs run | Healing is most needed in the month of fevers |
| 3 | Lumae | **Lumae** | Lumae | **Lum** | `March`, `Mar` | Thaw | spring (thaw) | Thaw; doors opened, roofs mended, houses aired, every fire relit at the Lamp-Lighting | Thanks for the shelter that held through winter |
| 4 | Maelwen | **Maelwen** | Mael | **Mael** | `April`, `Apr` | Rainwake | spring (floods) | Rains and floods; rivers rise; the seas open for sailing | Fair weather and safe waters decide the year's planting and fishing |
| 5 | Vaelei | **Vaelei** | Vaelei | **Vael** | `May` (both forms) | Sowing | spring (sowing) | Sowing, lambing and calving; weddings after the sowing | Kin and birth: the seed, the flock and the family grow together |
| 6 | Rasthel | **Rasthel** | Rast | **Ras** | `June`, `Jun` | Highsun | summer | The roads dry; fairs, caravans and pilgrimages; the longest days | Safe roads and fair exchange, when everyone travels |
| 7 | Kerun | **Kerun** | Kerun | **Ker** | `July`, `Jul` | Goldfield | summer | The grain stands in the field; the season when raiders and armies march | Protection of the standing harvest |
| 8 | Aurlan | **Aurlan** | Aurlan | **Aur** | `August`, `Aug` | Harvest | summer (harvest) | Reaping and binding | Daily bread, gathered |
| 9 | Ailtal | **Ailtal** | Ailtal | **Ail** | `September`, `Sep` | Fallowing | autumn | Threshing done; rents, tithes and debts settled; courts open; boundaries walked | Justice and kept promises, when every account comes due |
| 10 | Irumas | **Irumas** | Irumas | **Iru** | `October`, `Oct` | Emberleaf | autumn | Farm work ends; forges and kilns relit; building before the frost; apprentices bound | Skill and work fill the months the fields do not |
| 11 | Gaelor | **Gaelor** | Gaelor | **Gael** | `November`, `Nov` | Mistfall | autumn | Mists; beasts that cannot be fed through winter are slaughtered; the dead remembered | A good death and remembrance, in the month of slaughter and mourning |
| 12 | Naisa | **Naisa** | Naisa | **Nai** | `December`, `Dec` | Longnight | winter (long nights) | The longest nights; waiting for the turn of the year | Hope in the darkest month |

**Forms.** The full form is the value of the engine's full month key and the name players read in every date. The abbreviation (at most four letters) is the value of the engine's short key. The short form is a clipped everyday form for compact prose (ledger lines, tight tooltips), never written to an engine key; it equals the full form when the name has six letters or fewer.
**The fifth month.** Vanilla has no short key for May: the key `May` serves both forms, so the fifth month reads **Vaelei** in full in both places, which its six letters allow.
**Encoding.** Every name is plain ASCII: valid Windows-1252, with no diacritic any game font lacks.
**Unique forms.** The twelve full forms and the twelve abbreviations are each unique, as `calendar.test.mjs` requires.
**Old echoes.** Three former names survive as meanings: Emberleaf's embers in Irumas's forge month, Goldfield's gold in Aurlan's "golden field", and the Longnight vigil in Naisa's Star Vigil.

## 3. Seasons and the seasonal mechanic

The seasonal mechanic stays exactly as the overhaul plan describes it ("the calendar drives thaw, harvest, floods, long nights, supply and movement through seasons", `docs/specs/00_master_overhaul_plan.md` item 4), keyed by **month index** so that a renamed month changes nothing in the scripts.

| Mechanic | Months (index) | Month names | Note |
| --- | --- | --- | --- |
| Long nights (winter supply and movement) | 12, 1 (and 2 in the cold regions) | Naisa, Glernaen (Sulethe) | The geography model keeps its regional winters: the Cold Lands stay frozen from month 1 to month 3 (`05_geography_model.md`) |
| Thaw (mud, rivers opening) | 3 | Lumae | The game starts on its first day |
| Floods | 4 | Maelwen | |
| Sowing | 5 | Vaelei | |
| Harvest | 8 | Aurlan | |
| Autumn gales (coasts) | 9 to 11 | Ailtal, Irumas, Gaelor | Where the geography model gives gales in autumn |

The Reckoning describes the year of the Middle Lands. Regions whose climate differs (the two seasons of the Lands of the Sun, the dim year of Zol's Mistake) keep their own seasonal effects by index from the geography model; the month names are the same everywhere the Reckoning is kept.

## 4. The start date

| Item | Value |
| --- | --- |
| Engine date | `1748.3.1.12` (unchanged) |
| Shown in the top bar | **1 Lumae 1748**, with the Aoaz bar's age button reading "4A" (the engine's date format stays, as `01_start_and_calendar.md` decides) |
| Written in prose | **1 Lumae, 4A 1748** |
| What the day is | **The Lamp-Lighting**, Lumae's festival: at dawn every fire is relit, and in Aenor the Houses of the First Light carry the fire through Parim ([pantheon.md](pantheon.md) 3.3 and 7) |
| Bookmark | "The Fourth Age" bookmark keeps its date; its description may open on the Lamp-Lighting once the names are approved |

## 5. The ten game languages

Proper names stay the same in every language: the gods' Old Ainic names are written identically in all ten localisation folders, as ZIN writes every proper name. Only the formula around the name changes, and only where the vanilla language wraps its month in a counter.

| Folder | Vanilla full / short (third month) | ZIN full key | ZIN short key | Notes |
| --- | --- | --- | --- | --- |
| `english` | March / Mar | `{name}`: Lumae | `{abbr}`: Lum | |
| `german` | März / Mär | Lumae | Lum | |
| `french` | mars / mar | Lumae | Lum | A god's name keeps its capital, unlike French month names. |
| `spanish` | marzo / Mar | Lumae | Lum | Capital kept, as in French. |
| `braz_por` | Março / Mar | Lumae | Lum | |
| `polish` | marca / Mar | Lumae | Lum | Vanilla writes the genitive; a proper name is not inflected. |
| `russian` | Марта / Мар | Lumae | Lum | Vanilla writes the genitive in Cyrillic; ZIN keeps the Latin proper name, uninflected, as it does for every name until a translation pass decides otherwise. |
| `japanese` | 3月 / 3月 | `{name}月`: Lumae月 | Lumae月 | Vanilla uses the same counter form for both keys; the god's name takes the place of the number. |
| `simp_chinese` | 3月 / 3月 | Lumae月 | Lumae月 | As Japanese. |
| `korean` | 3월 / 3월 | `{name}월`: Lumae월 | Lumae월 | As Japanese, with the Korean counter. |

The engine decides the order of day, month and year in each language; ZIN changes only the month strings. The formulas are in `pantheon.json` (`calendar.languageFormula`) so that `tools/content/modules/calendar.mjs` writes each folder from one table.

## 6. From the old names to the new

| No. | Former name | Former short | New name | New short | Former faith festivals in this month, now in the god's month |
| ---: | --- | --- | --- | --- | --- |
| 1 | Deepwinter | Dpw | Glernaen | Gler | none listed |
| 2 | Ironfrost | Irf | Sulethe | Sul | none listed |
| 3 | Thaw | Tha | Lumae | Lum | the Lamp-Lighting (Lumae's own, section 4), the Thaw Lamp, the Green-Waking, the Foaling, the Spring Tide, the Ship-Blessing, the Relighting, the Truce-Day, the Unfurling, the Opening of the Roads, the Refiring, the First Leaf, the Thawing, the Stone-Laying, the Ent-Moot, the Forging |
| 4 | Rainwake | Rnw | Maelwen | Mael | the Rain-Feast, the Tying, the First Flood, the Charting Day, the First Water, the Reef-Opening, the First Rain |
| 5 | Sowing | Sow | Vaelei | Vael | none listed |
| 6 | Highsun | Hsn | Rasthel | Ras | the Three Arrows, the Gathering, the Calm, the Ring-Moot, the Night of Stars, Noon-Day |
| 7 | Goldfield | Gld | Kerun | Ker | the Fair of Contracts, the Fish-Fair |
| 8 | Harvest | Hrv | Aurlan | Aur | Harvest Home (Aurlan's Last Sheaf), the Weighing |
| 9 | Fallowing | Fal | Ailtal | Ail | the Hallow Month, the First Gale |
| 10 | Emberleaf | Emb | Irumas | Iru | the Boat-Burning, the Ransoming |
| 11 | Mistfall | Mis | Gaelor | Gael | the Day of Deliverance (30 Gaelor, Afrit's feast), the Last Ride, the Last Muster, the Reading of the Dead of Dardan |
| 12 | Longnight | Lng | Naisa | Nai | the Vigil of Longnight (Naisa's Star Vigil), the Night Watch, the Untying of the Year, the Reading of the Lost, the Lantern Float, the Long Listening, the Winter Hum |

`cultures_game.json` stores these festivals with `"month": "<former name>"`; the builder converts them by `pantheon.json` (`calendar.oldNames`) to month indices, and every faith festival without a month keeps `null`. A festival name that carries an old month name becomes the god's name or a plain season word: the Vigil of Longnight becomes the Star Vigil, the Hallow Month keeps its name (it is the rangers' own phrase for the month of Ailtal), and "the end of the Long Dark" stays as a season word.

## 7. The Reckoning in history

**Before the Reckoning.** The Age of Kingdoms before Aen had many reckonings: by moons, by seasons, by the years of a king, by the floods of a river. The numbered years begin with Aen's victory (E: the ages are reckoned from it), and the time before is undated (E). Dates from before the Reckoning are written by season and the old count of the kingdom that kept them, never with a god's month: "in the thaw of the ninth year of the kings of the lake", or simply "before Aen". Scholars of the Fourth Age do not convert them (P).
**The Reckoning of the Twelve (P).** Early in the First Age Aen's court proclaimed the Reckoning: Aen's astronomers fixed the months' lengths (vault P), and the temples named each month for the god whose need the season pressed hardest, so that the year itself became a round of the twelve needs. The Reckoners, the calendar-keepers of the Hall of the Twelve, keep it still. Within the First Age dates carry the god's month from the proclamation on; for the years before it in the reign of Aen, the chronicles give the season.
**How it spread (P).** The Ainic kingdoms took it in the First Age with Aen's crown. The Boreal and Eastern kingdoms took it from Aenor's charts and trade during the First and Second Ages: they count the same months and call the gods by their own epithets ([pantheon.md](pantheon.md) section 5). The elves keep their own count of seasons among themselves and use the Reckoning with men. The orc holds, trolls, giants, yeti and ents count by seasons and have no months. Volgan's Dominion numbers its months in the Rite-Tongue ("the Third Muster") and will not say the gods' names. Zol's Mistake keeps no calendar anyone knows.
**The months by number (P).** Under the Great Necromancer the decrees of occupied Aenor numbered the months and forbade the gods' names in public writing for the whole Third Age; the households kept the names. The first restored king brought the names back in 4A 1. (This is why the oldest Fourth Age records and the vault's present chronology give months by number.)
**Afrit's recognition (E that it came at the Third Age's end and added only a feast).** The Deliverer's faithful asked for a month; the Reckoners answered that there are twelve needs and twelve months, and the cult received a feast: **the Day of Deliverance, 30 Gaelor**, first kept in 4A 1 ([pantheon.md](pantheon.md) section 7). The Reckoning itself did not change: no month was renamed, added or split, and the Houses' calendars only print the day as "the Day Between".
**Writing dates now.** A vault date "in the eleventh month of 4A 1750" becomes "in Gaelor, 4A 1750" once the names are approved; a date before the Reckoning keeps its season.

## 8. Implementation notes

Items 1 to 3 and 6 are implemented; item 4 is implemented for every staged text (the list of rewritten lines is in [docs/design/calendar_localisation.md](../../design/calendar_localisation.md) section 5); item 5 concerns a document rule and is unchanged.
The Japanese, Chinese and Korean counters 月 and 월 are the only characters outside Windows-1252 in ZIN text; the text scan allows exactly these characters, only in the calendar files of those languages, because the installed game writes its own months with them in the same fonts.

1. `tools/content/lib/calendar.mjs`: `MONTHS` reads `name` from `monthName` and `abbr` from `monthAbbr` of `pantheon.json`, ordered by `monthIndex`; `START_DATE` stays `1748.3.1.12`.
2. `tools/content/modules/calendar.mjs`: writes each language folder from `calendar.languageFormula` (`{name}`, `{abbr}`), keeping the `assertKeysExist` check and the `May` exception.
3. `tools/content/calendar.test.mjs`: the assertion `MONTHS[2].name === 'Thaw'` becomes `'Lumae'`; the uniqueness checks stay; a new check asserts that no old month name appears as a month value in any language folder.
4. Text that names an old month (events, loading tips, game rules, focus text and `zin_lore.106`, among the files that match "Thaw", "Longnight" and the rest in `tools/content/data/`) is rewritten with the god's month or a season word.
5. `docs/lore/references/knowledge_layers.md` rule `kl_mystery_003` keeps blocking the old names; rule `kl_mystery_001` must allow the twelve once the owner approves them.
6. `docs/specs/00_foundation/01_start_and_calendar.md` records the new names, short forms and the start "1 Lumae 1748".

## 9. Questions for the owner

1. Do you accept the month order of section 2, with Glernaen first and the start on 1 Lumae?
2. Should the Reckoning date from Aen's First Age, as proposed, or be older than the numbered ages?
3. Do you accept the Third Age's months by number under the Great Necromancer, restored in 4A 1?
4. Should Russian and the Asian languages keep the Latin names, as proposed, or should a later translation pass transliterate them?

## 10. Local reckonings

Not every realm keeps the Reckoning of the Twelve (decision K30). The engine shows every date in the twelve months; a realm whose roster field `calendar` names another count writes its own dates in its own text through the scripted localisation `zin_reckoning_date`, whose use is described in [docs/design/calendar_localisation.md](../../design/calendar_localisation.md). The data is [tools/content/data/world/reckonings.json](../../../tools/content/data/world/reckonings.json).

**The shared year count (P, from the R-45 histories).** Years run in one count from the victory of Aen: 1A 1 is year 1, 2A 1 is 1676, 3A 1 is 3809 and 4A 1 is 5069, so 4A 1748 is 6816.

| Reckoning (`calendar`) | How a date reads in 4A 1748 | Conversion | Label |
| --- | --- | --- | --- |
| The Count of the Wells (`well_count`) | the 3952nd year of the Wells | Wells year = 4A year + 2204; the Seven Wells were dug in 2A 1190 | P (East Lands history) |
| The Ledger Count (`ledger_count`) | the 1108th year of the Ledger | Ledger year = 4A year - 640; the Gold Road opened in 4A 641 | P (East Lands history) |
| The Count of the Floods (`flood_count`) | the twelfth Rising of the country leader (Alerhia) | the Rising of the ruler's reign, counted from the Rising he was crowned in; the year turns on 1 Maelwen, the floods month of the seasonal mechanic | P; Alerhia 12, Erco 9 and Plutondo 4 from the histories; Delbiz and Rhachia are **O** (no Rising written) and read "the reign of" their ruler |
| The Musters (`numbered_musters`) | the Third Muster of 4A 1748 | the month number in words | P |
| By the seasons (`season_count`), the elven seasons (`elven_seasons`) | the spring | the season of the month (section 3) | P |
| The Delving Count (`delving_count`) | the spring shifts of the hold | the season; the holds keep their year count from outsiders | P; the year count is **O** |
| The Cords (`knot_cords`) | the spring of the eldest cord | the season; the knots are not numbered | P; the year count is **O** |
| The Storm Years (`storm_years`) | the spring tides | the season; the storms are not named | P; the storm names are **O** |
| The Count of the Halls (`nether_count`) | the reign of the country leader | the reign; no pact is dated | P; the pact years are **O** |
| No calendar (`none`) and the twelve | Lumae, 4A 1748 | the engine's month and the 4A year | P |

