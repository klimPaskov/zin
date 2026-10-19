# Languages of Erdae and the name generator

**Status:** Draft. **Date:** 19 October 2026. **Priority:** 2. **Phase:** 2 (replaces the syllable generator of `tools/content/modules/names.mjs`).
**Data:** [tools/content/data/world/languages.json](../../../tools/content/data/world/languages.json) (24 languages, 1,609 word-forms, 1,440 hand-built sample names). **Companions:** [05_world_bible.md](05_world_bible.md), [07_demography_and_settlement.md](07_demography_and_settlement.md), [08_world_in_game.md](08_world_in_game.md).

## Purpose

Today's names come from syllables cut from the owner's drawn labels. They sound like the map but belong to no language, so a Cold Lands town and a Sunhot town can share a name, and nothing says what a name means. This spec gives every culture a **language**: sounds, a dictionary of place-name elements, rules for building names, rules for personal names, and weights. A deterministic generator then names the 1,332 states, every victory point, every river, lake, mountain and sea that the drawn map and the geography model leave unnamed, and every ruler, councillor and house, without two worlds ever sharing a name.

The shipped contract is this file. The scripts that built and checked the data (a sound-change engine, a composer and a reference generator) are build aids, kept out of the repository; `names.mjs` is rewritten from the contract below.

## Labels

Every word, rule and name here is **proposed (P)**. Names that come from the vault or the drawn map are tagged **[E]** or **[W]** and are used exactly as given. Open questions stay open ([05_world_bible.md](05_world_bible.md) section 7).

## 1. How the languages relate

Families share roots and regular sound shifts. The proto-lexicon of each family is in `languages.json` (`families.*.proto`); each daughter is that lexicon passed through the ordered sound laws listed here, plus a small set of **irregular** forms (marked `irregular` in the data, kept for loans, taboo or old words) and **extra** forms (words for things only that people has).

Languages of one family are visibly related: *sira* (river) in Old Ainic is *sire* in Aenoran, *sir* in Leren, *zur* in Dondric and *hira* in Mirolic. Languages of different families sound different on purpose: the Ainic family is open and stately, the Boreal tongues are rough and rooted in w, gw and ch, the Eastern tongues carry q and kh or rh and th, the elvish tongues flow with iel, wen and ng, and the isolates each take one corner of the sound space.

### Families and sound laws

| Family | Members | Proto-language | How they relate |
| --- | --- | --- | --- |
| Ainic family | Old Ainic, Aenoran, Leren, Dondric, Mirolic, Rite-Tongue | ainic | The speech of the First Men (Old Ainic) and its daughters. Aenoran is the conservative daughter and the Common Speech; Leren is clipped and northern; Dondric is blunt; Mirolic is liquid and southern; the Rite-Tongue is Old Ainic bent by the necromantic orders. What "Ainu" means is open [O]. |
| Boreal family | Gunwaithic, Coldic, Tritonic | proto-boreal (reconstructed) | The older speech of the men of the north-west, met by Aenor's colonists in the First Age: Gunwaithic (West Lands), Coldic (Cold Lands) and Tritonic (Triton's Islands). Proposed. |
| Eastern family | Noric, Stabilic, Alerhic | proto-eastern (reconstructed) | The speech of the river, desert and road kingdoms of the East: Noric (desert), Stabilic (trade cities) and Alerhic (river kings). Proposed. |
| Elvish family | Sylvan, Galic, Sunhot | elder elvish (reconstructed) | The tongues of the Great Folk elves, all descended from an Elder Elvish that nobody speaks. Sylvan, Galic and Sunhot are daughters. Galic keeps the oldest forms. Whether Gala and Sunhot are kin beyond that is open [O]. |
| Orcish | Orcish, Goblin Cant | (none) | Orcish and the goblin cant, with a shared Horde Cant used between holds. |
| Isolates | Orran, Yonic, Trollish, Giants' Speech, Yeti Speech, the Long Speech, Infernal | (none) | Languages with no known relative: Orran (older than Ainic), Yonic (the southern islands), Trollish, the Giants' Speech, Yeti Speech, the Long Speech of the ents, and Infernal (proposed to descend from the lost Choral tongue). |

| Language | Ordered sound laws from its parent |
| --- | --- |
| Old Ainic | proto-language: stems as written in the family table |
| Aenoran | th > t; s > z between vowels; p t k > b d g between vowels; w > v; final -a > -e after a consonant |
| Leren | th > s; w > v; f > v; ae > ee, ai > ei, au > ou; final vowel lost in words of two or more syllables; final b d g > p t k |
| Dondric | th > d; ae > oa, ai > ua, ei > ui, au > o; p t k > b d g; initial s > z; f > b, h > g; final vowel lost in words of two or more syllables |
| Mirolic | ae > ia; au > o; th > l; s > h; k > g; w > v |
| Rite-Tongue | sh > x (via s > x); th > s; s > x; k > q; final -a > -um, -o > -os, -i > -is, -e > -es; w > v |
| Coldic | kw > kv; w > v before a vowel; th > t; s > z between vowels; ey > ae; final vowel lost in words of two or more syllables; final -a > -ar |
| Gunwaithic | kw > gw; initial h > ch; final -a lost in words of two or more syllables; ey > ei; k before e i y > c |
| Tritonic | kw > k; th > t; ch > h; dd > d; ey > ai; final consonant + -os; final -a > -ai |
| Noric | final vowel lost in words of two or more syllables; a u i o doubled before a final consonant in one-syllable roots |
| Stabilic | kh > c, q > c, sh > s, k > c; vowel lost between an initial stop and r; final -a, -u > -o; final -i > -io; c before e i > ch |
| Alerhic | kh > ch; q > k; sh > th; initial r > rh; ai > oi; final -a > -ia; -u, -i > -is; -e > -ae |
| Sylvan | t > th and k > h between vowels; final -u > -a; final -e > -iel; initial w > v; uel > wel |
| Galic | th > t; initial h lost; ae > ea; final -u > -o; final -i > -ien; y > i; initial k > c |
| Sunhot | th > s; k > h; r > l between vowels; final n or m > ng; ae > ai; final -u > -a, -e > -i; initial w > y |

A sample correspondence set, the Ainic family (Old Ainic / Aenoran / Leren / Dondric / Mirolic): river *sira / sire / sir / zir / hira*; lake *par / par / par / bol / mar*; coast *lith / lit / lis / lid / lil*; sea *mael / mael / meel / moal / mial*; stone *tal / tal / tal / dal / tal*; gold *aur / aur / gour / gor / or*. The Elvish family (Elder / Sylvan / Galic / Sunhot): river *nael / nael / neal / nail*; sea *thalu / thala / talo / sala*; city *kelun / kelun / celun / helung*; sun *hyal / hyal / ial / hyal*.

## 2. The 24 languages

| Language | Endonym | Family | Status | Spoken by | Script | Order and join | Elements | Samples | Capacity (places / people) |
| --- | --- | --- | --- | --- | --- | --- | ---: | ---: | --- |
| Old Ainic (`ainic`) | Ainic | ainic | liturgical | court of Aenor; Houses of the First Light; the Registers of the Lost; every dynasty that claims descent from Aen | Aenic hand | mod-head, closed | 76 | 60 | 3625 / 1388 |
| Aenoran (`aenoran`) | Aenoran | ainic | living | Lake Aenorans; Selen rangers; Steppe riders; Wall-folk; March-folk; Isle houses; Zilin pilgrims | Common hand | mod-head, closed | 80 | 60 | 6000 / 6000 |
| Leren (`leren`) | Leren | ainic | living | Leren of the Strait; Free Crowns of the North; Marchers of Molot | Leren strokes | mod-head, closed | 81 | 60 | 6000 / 6000 |
| Dondric (`dondric`) | Dondric | ainic | living | Dondor Brutes; Blackton freeholders | Notched marks | mod-head, closed | 78 | 60 | 4010 / 4141 |
| Mirolic (`mirolic`) | Mirolic | ainic | living | Mirolonese wardens; Dead Lands freeholds | Common hand with warden marks | mod-head, closed | 79 | 60 | 4664 / 6000 |
| Rite-Tongue (`grave_rite`) | Rite-Tongue | ainic | liturgical | necromantic orders of Volgan; officers of the grave hosts (titles only) | Ash script | mod-head, closed | 85 | 60 | 3572 / 491 |
| Coldic (`coldic`) | Koldic | boreal | living | Coldor Winter-Crown folk; Ice clans; Isengard warlords; Windwaith seafarers | Frost-runes | mod-head, closed | 79 | 60 | 5739 / 6000 |
| Gunwaithic (`gunwaithic`) | Gunwaithic | boreal | living | Gunwaith clans; Girdon wardens; Western guildmen; Buldor companies | Clan-ogham | head-mod, hyphen | 81 | 60 | 4454 / 5902 |
| Tritonic (`tritonic`) | Tritonic | boreal | living | Triton chart-islanders; Triton corsairs | Chart-hand | mod-head, closed | 84 | 60 | 4013 / 6000 |
| Noric (`noric`) | Noric | eastern | living | Noris camel warriors; desert kingdoms of the South Lands | Sand script | head-mod, hyphen | 79 | 60 | 4859 / 4769 |
| Stabilic (`stabilic`) | Stabilic | eastern | living | Stabilo caravan princes; southern trade cities | Ledger hand | head-mod, closed | 79 | 60 | 4395 / 5817 |
| Alerhic (`alerhic`) | Alerhic | eastern | living | River-Kings of the East; Lake Road cities; Red Lands | Reed letters | mod-head, closed | 79 | 60 | 3098 / 4325 |
| Sylvan (`sylvan`) | Silvaen | elvish | living | Magical Forest and its council houses; Hill Kingdom elves; Lake elves; Pass-Wardens; Rift-Coast elves | Leaf-script | mod-head, closed | 80 | 60 | 5156 / 6000 |
| Galic (`galic`) | Galic | elvish | living | Gala court; Gala, North Gala and the Gala Elves | Sun-hand | head-mod, space | 80 | 60 | 4234 / 1789 |
| Sunhot (`sunhot`) | Sunhot | elvish | living | Sunhot elves of the Lands of Light; Western Sanctuaries; Eastern Isles | Noon-script | head-mod, space | 80 | 60 | 4415 / 2763 |
| Orran (`orran`) | Orran | isolate | living | Redbark tribes; the Veiled Folk | Knot-script | head-mod, space | 49 | 60 | 1427 / 2477 |
| Yonic (`yonic`) | Yonic | isolate | living | Southern Islanders | Wave-tally | head-mod, space | 57 | 60 | 3237 / 846 |
| Orcish (`orcish`) | Gurkh | isolate | living | Volcano Clans; Iron Clans; Wild Holds; Sea Orcs | Scar-marks | mod-head, closed | 51 | 60 | 2909 / 3193 |
| Goblin Cant (`goblin`) | Snikk | orcish | living | Goblin Warrens (a minor people of some orc holds) | Scratch-tally | mod-head, closed | 41 | 60 | 1240 / 399 |
| Trollish (`trollish`) | Grum | isolate | living | Troll Forest tribes | Stone-heaps | mod-head, closed | 42 | 60 | 2043 / 466 |
| Giants' Speech (`gigantic`) | Oruun | isolate | living | Hiloron hill-giants; Titanos ice-giants | Cairn-tally | mod-head, closed | 42 | 60 | 1808 / 530 |
| Yeti Speech (`yetic`) | Huum | isolate | living | Yeti Lands clans | Hum-marks | mod-head, closed | 42 | 60 | 2181 / 452 |
| the Long Speech (`longspeech`) | Oollon | isolate | living | Kilinti ents | Ring-marks | mod-head, closed | 42 | 60 | 1701 / 506 |
| Infernal (`infernal`) | Zhaveth | isolate | living | Netherborn of Demon, Dolon and Nezer | Cinder-script | head-mod, hyphen | 43 | 60 | 1961 / 483 |

Capacity is the number of distinct names the reference generator drew before it ran dry (capped at 6,000). Reserved and unwritten: **Dwarvish** (homeland open), **Choral** (the angels), the speech of the **mycids**, of the **arcanists** and of **Roka's people**: no data, no generation. Zol's Mistake has no language.

## 3. Language by language

In each section "element" means a place-name word; the forms marked **ir** are irregular (kept despite the sound laws) and **+** extras only that people has. The sample names were composed by hand from the declared elements, suffixes and name stems, and the build recomputes each one from its recipe (`languages.json`, `samples`).

### 3.1 Old Ainic (`ainic`)

*Family:* ainic. *Status:* liturgical. *Spoken by:* court of Aenor; Houses of the First Light; the Registers of the Lost; every dynasty that claims descent from Aen. *Script:* Aenic hand, ring-and-stroke letters, one ring per consonant and a stroke for each vowel; carved in stone, written on wax and vellum; read left to right.

The speech of the First Men. Nobody speaks it now. It is kept for royal names, law, temple rites and the oldest place names.

| Sound | |
| --- | --- |
| Consonants | p t k b d g f v s h m n l r w y th |
| Vowels | a e i o u; diphthongs ae ai au ei |
| Syllable and endings | (C)(C)V(C); stop plus r is the only onset cluster; closing sounds: l r n s m th (st and rd in a few learned words) |
| Stress | first syllable |
| Written form | Plain Latin letters. Long vowels are not marked. th is one sound. |
| Rules | no doubled letters; every name ends in a vowel or l r n s m th; names of kings end in -dil, -or, -an or -ath |
| Signature | ae, ei, au, th, dil, ath |

**Building names.** Order: mod-head; join: closed. No article. Plural by -im. Genitive by -or after the possessor. The patronymic -dil follows the father or mother.

| Suffix kind | Forms (weight: meaning) |
| --- | --- |
| settlement | *im* (4: folk of); *en* (3: dweller of); *oth* (2: high place) |
| region | *or* (5: realm of); *dor* (3: land of); *im* (2: the people of) |
| river | *an* (3: flowing); *el* (2: water of) |
| sea | *ael* (3: great water) |
| mountain | *un* (2: mount) |

**Personal names.**

| Part | Pieces |
| --- | --- |
| Men: stems | ael, ein, dran, kor, thel, mar, sil, ron, tal, bor, nai, lor, sael, hun, wul, kir |
| Men: endings | dil, an, or, un, ar, ath, ael, in |
| Women: stems | ara, sael, nai, lyr, wen, sele, isa, vael, mael, ail |
| Women: endings | a, ia, ei, ae, ethe, in |
| Houses (none) | none |
| Patronymic | dil. Given name + dil + the parent's name: Eindil is "child of Ein" (P reading). |
| Epithets | dran "the old"; lor "the bright"; mas "the great"; sael "the holy"; kaur "the dark"; tir "the small" |
| Titles | ruler_m: ar; ruler_f: ara; lord: thel; warden: gera; first: aen |
| Notes | Regnal names are built from a stem and a royal ending and always take a number in Aenoran use. |

**Dictionary** (76 elements): river *sira*, mountain *karun*, lake *par*, valley *dael*, forest *sel*, ford *fas*, hill *hil*, coast *lith*, island *oro*, bridge *tuma*, wall *mur*, fort *dun*, hall *aul*, high *oth*, low *nim*, old *dran*, new *nai*, red *rus*, white *ail*, dark *dum*, bright *lor*, holy *sael*, king *ar*, queen *ara*, stone *tal*, iron *ker*, gold *aur*, sea *mael*, harbour *haf*, city *kaer*, town *bur*, field *lan*, road *ras*, gate *pael*, tower *thur*, spring *sul*, marsh *mos*, ice *kel*, fire *iru*, tree *bael*, wind *wen*, sun *ulan*, moon *nael*, star *isa*, grave *kuth*, north *bor*, south *nes*, east *eth*, west *wes*, great *mas*, small *tir*, black *kaur*, green *vael*, grey *gael*, deep *dol*, wolf *wul*, bear *bar*, eagle *kir*, horse *hun*, fish *ish*, raven *kor*, water *wae*, cliff *krag*, pass *thol*, house *ham*, lord *thel*, warden *gera*, silver *sil*, salt *sal*, ash *esh*, blood *rud*, bone *osu*, bell *bel*, lamp *lum*, oak *dar*, hearth *ard*.

**30 place names:** Othadun, Paror, Saelhil, Ailmur, Lorsira, Drankaer, Doldael, Taltuma, Kerpael, Auraul, Silsul, Rusmos, Wulhil, Kirakrag, Kaurathur, Vaelsel, Ethathol, Weslith, Borpael, Neshaf, Isard, Naelpar, Hunlan, Korathur, Darfas, Eshakarun, Sallith, Belathur, Lumkaer, Ardakaer.

**30 personal names:** Aeldil, Korath, Thelan, Maror, Silael, Ronun, Talar, Borin, Naor, Loran, Saelath, Hundil, Wular, Kiran, Dranor, Aelin, Aria, Saela, Naethe, Lyra, Wenei, Selia, Isae, Vaela, Maelia, Ailethe, Arin, Lyria, Saelethe, Wena.

**Established names:** 0 country and seat names belong here (0 fit the inventory, 0 adopted as drawn).

### 3.2 Aenoran (`aenoran`)

*Family:* ainic, daughter of ainic. *Status:* living. *Spoken by:* Lake Aenorans; Selen rangers; Steppe riders; Wall-folk; March-folk; Isle houses; Zilin pilgrims. *Script:* Common hand, a running script of joined letters, written with a reed pen on paper; the Houses of the First Light teach it to every child.

The Common Speech of Erdae: the language of Parim, of the Concord, of the charts and of trade from the North Lands to the East. Every other tongue of men borrows its titles and its road-words.

| Sound | |
| --- | --- |
| Consonants | p t k b d g f v s z h m n l r j |
| Vowels | a e i o u; diphthongs ae ai au ei |
| Syllable and endings | (C)V(C)(C); closing sounds: l r n m s t d |
| Stress | second to last syllable |
| Written form | Plain Latin letters. z appears only between vowels or as the sound of s between vowels (Herez). th and w are lost. |
| Rules | no th, no w; z only inside a name; names end in -an -on -im -en -or -ar -el -is -e |
| Signature | z between vowels, ends in e after a consonant, no th |

**Building names.** Order: mod-head; join: closed. Genitive by -an after the possessor. Chart names add -dor to a people or a ruler.

| Suffix kind | Forms (weight: meaning) |
| --- | --- |
| settlement | *im* (4: place of the); *en* (4: dwellers); *on* (3: town); *ar* (2: hold) |
| region | *or* (4: realm); *dor* (5: land of the charts); *an* (2: of); *ia* (1: country) |
| river | *ar* (4: river); *an* (3: river); *el* (3: water); *is* (2: stream) |
| sea | *ael* (2: water) |
| mountain | *un* (2: mount) |

**Personal names.**

| Part | Pieces |
| --- | --- |
| Men: stems | cor, tar, hal, sef, ero, bel, dar, ron, mer, ald, hav, ren, gar, lis, mar, ed, tan, vel |
| Men: endings | wen, ec, mor, an, nel, ric, ovan, ian, ren, ald, in |
| Women: stems | is, il, fab, nor, ava, lys, ser, mir, tal, ael, bel, ren, ed, hel |
| Women: endings | ra, a, ia, ael, ine, wen, ene, ette |
| Houses (surname) | horn, leim, bel, vot, dal, aren, sel, kor, tar, ulr, hif, lot, sef, mon, fresh + an, on, ar, el, er, is |
| Patronymic | sen. Commoners may add -sen to the father's given name: used on the frontier and in the dominions, not in Parim. |
| Epithets | dran "the old"; lor "the bright"; mas "the great"; rus "the red"; kaur "the black"; gael "the grey"; tir "the small"; deli "the learned" |
| Titles | ruler_m: King; ruler_f: Queen; lord: Lord; lady: Lady; warden: Warden; marshal: Marshal; chancellor: Chancellor |
| Notes | The ruling house uses Ainic royal endings. The common stock uses short names ending in -an, -on or -ec. |

**Dictionary** (80 elements): river *sire*, mountain *karun*, lake *par*, valley *dael*, forest *sel*, ford *fas*, hill *hil*, coast *lit*, island *oro*, bridge *tume*, wall *mur*, fort *dun*, hall *aul*, high *ot*, low *nim*, old *dran*, new *nai*, red *rus*, white *ail*, dark *dum*, bright *lor*, holy *sael*, king *ar*, queen *arain* ir, stone *tal*, iron *ker*, gold *aur*, sea *mael*, harbour *haf*, city *kaer*, town *bur*, field *lan*, road *ras*, gate *pael* ir, tower *tur*, spring *sul*, marsh *mos*, ice *kel*, fire *iru*, tree *bael*, wind *ven*, sun *ulan* ir, moon *nael*, star *ize*, grave *kut*, north *bor*, south *nes*, east *et*, west *ves*, great *mas*, small *tir*, black *kaur*, green *vael*, grey *gael*, deep *dol*, wolf *vul*, bear *bar*, eagle *kir*, horse *hun*, fish *ish*, raven *kor*, water *vae*, cliff *krag*, pass *tol* ir, house *ham*, lord *tel*, warden *gere*, silver *sil*, salt *sal*, ash *esh*, blood *rud*, bone *ozu*, bell *bel*, lamp *lum*, oak *dar*, hearth *ard*, crown *koron* +, charter *kartan* +, toll *tolim* +, guild *gildan* +.

**30 place names:** Vulehilim, Otedun, Ailetume, Paren, Dranefas, Talekaer, Aurehaf, Vaeledaelon, Beletur, Darelan, Kerepael, Lumaul, Salelitim, Silesire, Gaelemur, Borepael, Hunelanen, Loresul, Saeleselon, Kirekrag, Ishefas, Dolepar, Naibur, Kauretur, Barehilon, Izard, Vesehaf, Taletumar, Naelesire, Seledor.

**30 personal names:** Corwen Hornan, Tarec Belon, Halmor Votar, Sefan Dalon, Eronel Arenis, Darric Selan, Ronovan Korer, Merian Taron, Alderen Leimar, Havin Monel, Renald Hifon, Garwen Lotar, Lisan Freshel, Marec Ulran, Tannel Sefel, Isra Leimar, Ila Selan, Fabra Dalan, Noria Selis, Avine Koron, Lysael Tarel, Sera Hornar, Mirwen Belan, Talene Voton, Aelra Arener, Belette Ulris, Renia Monan, Edine Loton, Hela Hifel, Velric Horner.

**Established names:** 54 country and seat names belong here (48 fit the inventory, 6 adopted as drawn). Proposed readings: **Aenor**: Open [O]. "Aen" + "-or" (realm) is a possible reading; whether Aenor is named for Aen stays open. **Parim**: Aenoran par "lake" + -im "place of": the lake-place. **Selen**: Aenoran sel "forest" + -en "dwellers": the forest-dwellers. **Hunhun**: Aenoran rider dialect: hun "horse" said twice, "many horses".

### 3.3 Leren (`leren`)

*Family:* ainic, daughter of ainic. *Status:* living. *Spoken by:* Leren of the Strait; Free Crowns of the North; Marchers of Molot. *Script:* Leren strokes, angular letters cut into driftwood and slate; a cursive form for ledgers.

The sea-speech of the North Lands: clipped, with long vowels and hard endings. It dropped the soft final vowels of Old Ainic and borrowed its sailing words from the Seaspeech of the northern coasts.

| Sound | |
| --- | --- |
| Consonants | p t k b d g f v s h m n l r ng |
| Vowels | a e i o u aa ee oo; diphthongs ei ou ai |
| Syllable and endings | (C)(C)V(C)(C); closing sounds: any single consonant; rk rn rd lk nd ng sk st |
| Stress | first syllable |
| Written form | Long vowels are doubled. w is written v. Final b d g are written p t k. |
| Rules | no word ends in an open vowel except -o and -a in loan names; names end in -ur -ar -ik -sk -nd -k -t; doubled vowels carry the stress |
| Signature | aa, ee, oo, sk, ends in consonant, vik, vaith |

**Building names.** Order: mod-head; join: closed. The definite article is a suffix -en (Sonargur-en "the Sonargur"), used only in speech. Compounds are closed. Genitive by -s.

| Suffix kind | Forms (weight: meaning) |
| --- | --- |
| settlement | *ur* (4: town); *vik* (3: bay); *gar* (3: enclosure); *ik* (2: little place); *heim* (1: home) |
| region | *dor* (4: land (chart form)); *vaith* (4: shore); *land* (1: land) |
| river | *a* (4: river); *elv* (2: water) |
| sea | *ocean* (1: ocean) |
| mountain | *fell* (2: fell) |

**Personal names.**

| Part | Pieces |
| --- | --- |
| Men: stems | ferl, hel, agn, ost, bran, ulv, sten, tor, rag, ing, sig, vald, gunn, orm, eir |
| Men: endings | in, ar, ek, ur, ik, olf, mund |
| Women: stems | ilse, agni, sig, ing, mael, astr, vig, hil, run, ost, el |
| Women: endings | a, rid, ya, vi, is, ild, id, da |
| Houses (surname) | solen, fargur, relend, brann, ostv, hesk, maelis, sonar, perh, korn + kov, son, dal, vik, ur, ov |
| Patronymic | son, dot. Given name + father's name + son (male) or dot (female). |
| Epithets | aar "the king"; gael "the grey"; kaur "the black"; mas "the great"; rus "the red"; tir "the small" |
| Titles | ruler_m: King; ruler_f: Queen; lord: Jarl; admiral: Sea-Lord; speaker: Speaker |
| Notes | A king takes a number: Ferlin III. A ruler of the union adds both crowns: of Lerendor and Lerenwaith. |

**Dictionary** (81 elements): river *sir*, mountain *karun*, lake *par*, valley *deel*, forest *sel*, ford *vas*, hill *hil*, coast *lis*, island *or*, bridge *tum*, wall *mur*, fort *dun*, hall *oul* ir, high *os*, low *nim*, old *dran*, new *nei*, red *rus*, white *eil*, dark *dum*, bright *lor*, holy *seel*, king *aar* ir, queen *aarna* ir, stone *tal*, iron *ker*, gold *gour* ir, sea *meel*, harbour *hav*, city *keer*, town *bur*, field *lan*, road *ras*, gate *peel* ir, tower *sur*, spring *sul*, marsh *mos*, ice *kel*, fire *ire* ir, tree *beel*, wind *ven*, sun *ulan* ir, moon *neel* ir, star *is*, grave *kus*, north *bor*, south *nes*, east *eis* ir, west *ves*, great *mas*, small *tir*, black *kour*, green *veel*, grey *geel*, deep *dol*, wolf *vul*, bear *bar*, eagle *kir*, horse *hun*, fish *ish*, raven *kor*, water *vee*, cliff *krak*, pass *sol* ir, house *ham*, lord *ferl* ir, warden *ger* ir, silver *sil*, salt *sal*, ash *esh*, blood *rut*, bone *bein* ir, bell *bel*, lamp *lum*, oak *dar*, hearth *art*, bay *vik* +, shore *vaith* +, skerry *skar* +, ship *knor* +, tide *flood* +.

**30 place names:** Geelhilur, Osdun, Talvik, Eilvik, Kourvas, Kergar, Drankeer, Sallisvik, Vulor, Dolvik, Borpeel, Kirkrak, Geelmur, Knorvik, Veshav, Veeldeel, Gourlis, Korhilik, Tumgar, Darlan, Surgar, Parur, Seelvik, Barkarun, Nesskar, Ishvik, Kelur, Lorvaith, Neivasur, Sirdor.

**30 personal names:** Ferlin Solenkov, Agnar Fargurvik, Ostek Brannson, Branur Heskov, Ulvik Sonardal, Stenmund Kornvik, Torolf Perhur, Ragar Relendkov, Ingar Ostvov, Sigmund Maelisson, Valdek Solenvik, Gunnar Fargurkov, Ormur Branndal, Eirik Sonarov, Helin Kornson, Ilse Relendkov, Agniva Fargurvik, Sigrid Solenson, Inga Heskov, Maelis Sonardal, Astrid Kornvik, Viga Perhur, Hilda Ostvov, Runa Branndal, Ostrid Maelisson, Elya Relendvik, Ingvi Fargurov, Agnivild Solendal, Ilseva Kornkov, Maelrid Heskson.

**Established names:** 56 country and seat names belong here (43 fit the inventory, 13 adopted as drawn). Proposed readings: **Lerendor**: Leren + chart -dor "land": the Leren land. Lerenwaith is the Leren shore.

### 3.4 Dondric (`dondric`)

*Family:* ainic, daughter of ainic. *Status:* living. *Spoken by:* Dondor Brutes; Blackton freeholders. *Script:* Notched marks, tally-like notches on staves, with a thin Common hand used by clerks.

The blunt tongue of the Dondor Brutes. It is Old Ainic worn down by centuries of living beside orc holds: voiced stops, a flat vowel stock and many words taken from Orcish.

| Sound | |
| --- | --- |
| Consonants | b d g z m n l r w y |
| Vowels | a o u i e; diphthongs oa ua ui |
| Syllable and endings | (C)(C)V(C)(C); closing sounds: any; final b d g are voiceless k t p |
| Stress | first syllable |
| Written form | Plain letters. oa is a broad a. No p, t or k at the start of a word. |
| Rules | stops are voiced at the start and inside; names end in -ak -ok -un -ar -and -dor; no th, no f, no h |
| Signature | initial b d g, oa, ends -ok -ak -and |

**Building names.** Order: mod-head; join: closed. No article. The tribal plural is -ung (Dondung "Dondor folk"). Orcish loans keep their gh as g.

| Suffix kind | Forms (weight: meaning) |
| --- | --- |
| settlement | *dun* (4: hold); *ok* (3: place); *ak* (3: place); *and* (2: stead) |
| region | *dor* (5: land (chart form)); *ung* (3: folk of) |
| river | *un* (3: water); *ar* (2: stream) |
| sea | *mal* (2: water) |
| mountain | *gar* (2: crag) |

**Personal names.**

| Part | Pieces |
| --- | --- |
| Men: stems | dun, gor, bar, mur, zul, drom, gul, borg, dag, rok, urd, brun, grim, dal |
| Men: endings | mar, ok, ak, un, ug, and, ar, ag |
| Women: stems | bro, dura, gwen, mara, zil, bera, dagna, hilda, urra |
| Women: endings | a, ra, ga, na, ka |
| Houses (clan) | gul, dun, bar, urd, brun, gor + ung, ok, and |
| Patronymic | ug. Son of is -ug after the father (Dunug). |
| Epithets | drun "the old"; mas "the big"; rus "the red"; kaur "the black"; tir "the small" |
| Titles | ruler_m: King; ruler_f: Queen; warlord: Warlord |
| Notes | Dondor kings are chosen by the clan-moot from the strongest line. |

**Dictionary** (78 elements): river *zir*, mountain *garun*, lake *bol* ir, valley *doal*, forest *zel*, ford *bas*, hill *gil*, coast *lid*, island *or*, bridge *dum*, wall *mur*, fort *dun*, hall *oul* ir, high *od*, low *nim*, old *drun* ir, new *nua*, red *rus*, white *ual*, dark *dumb* ir, bright *lur* ir, holy *zoal*, king *ark* ir, queen *aara* ir, stone *dal*, iron *ker* ir, gold *gor* ir, sea *moal*, harbour *gab*, city *goar*, town *bur*, field *lan*, road *ras*, gate *boal* ir, tower *dur*, spring *zul*, marsh *mos*, ice *gel*, fire *ir*, tree *beel* ir, wind *wen*, sun *ulan*, moon *noal*, star *is*, grave *gud*, north *bor*, south *nes*, east *edd* ir, west *wes*, great *mas*, small *dir*, black *gruk* ir, green *voal*, grey *goal*, deep *dol*, wolf *wul*, bear *bar* ir, eagle *gir*, horse *gun*, fish *isg*, raven *gorb* ir, water *woa*, cliff *grag*, pass *dolg* ir, house *gam*, lord *del*, warden *garra* ir, silver *zilb* ir, salt *zalt* ir, ash *asg* ir, blood *rud*, bone *os*, bell *bel*, lamp *lum*, oak *dar*, hearth *ard*, brute *garg* +, clan *gul* +.

**30 place names:** Daldun, Grukok, Rusgilak, Kerdun, Wuland, Oddun, Darbas, Gorok, Bardun, Doldoal, Guland, Gildor, Goalmur, Zelak, Zirun, Drundun, Gunlan, Zaltlid, Irgil, Gunak, Boldun, Gragok, Dumband, Ualdun, Gorbgil, Boalok, Edddun, Durak, Rasand, Gargung.

**30 personal names:** Dunmar Gulung, Gorok Dunok, Barak Barand, Murun Urdung, Zulug Brunok, Dromand Gorung, Gular Gulok, Borgag Dunand, Dagok Urdok, Rokun Barung, Urdak Brunand, Brunug Gorok, Grimar Dunung, Dalmar Guland, Dunak Urdand, Bra Gulung, Durara Dunok, Gwenga Barand, Marana Urdung, Zilka Brunok, Bera Gorung, Dagnara Gulok, Hildaga Dunand, Urrana Urdok, Broka Barung, Dura Brunand, Gwenna Gorok, Maraga Dunung, Zila Guland, Beraka Urdand.

**Established names:** 4 country and seat names belong here (2 fit the inventory, 2 adopted as drawn). Proposed readings: **Dondor**: Dondric don "hold" + dor "land": the hold-land.

### 3.5 Mirolic (`mirolic`)

*Family:* ainic, daughter of ainic. *Status:* living. *Spoken by:* Mirolonese wardens; Dead Lands freeholds. *Script:* Common hand with warden marks, the Common hand, with a signal alphabet of knotted cords used by the pass watch.

The liquid speech of the lake-country of the Dead Lands: a southern daughter of Old Ainic that lost p-less roots, k and s. It sounds of l, m, n and r.

| Sound | |
| --- | --- |
| Consonants | p b d g f v h m n l r |
| Vowels | a e i o u; diphthongs ia ei |
| Syllable and endings | (C)V(C); closing sounds: l m n r |
| Stress | first syllable |
| Written form | Plain letters. The language has no k, no s and no th: the letters never appear. |
| Rules | no k, s or th; names end in -on -en -ia -an -ol -ir -el; l, m, n and r make up half the letters |
| Signature | no k, no s, ends in -on -en -ia |

**Building names.** Order: mod-head; join: closed. The suffix -on makes a place from a people or a feature. Plural by -en.

| Suffix kind | Forms (weight: meaning) |
| --- | --- |
| settlement | *on* (6: place of); *en* (3: folk); *ol* (2: watch); *ir* (1: little) |
| region | *ia* (4: country); *on* (3: land); *or* (1: realm (chart)) |
| river | *el* (3: water); *an* (2: stream) |
| sea | *mial* (2: water) |
| mountain | *um* (2: mount) |

**Personal names.**

| Part | Pieces |
| --- | --- |
| Men: stems | mael, bar, lel, nor, hadr, ven, mol, del, fer, bael, ran, alm |
| Men: endings | ic, ar, on, ell, en, or, an |
| Women: stems | hel, mir, ven, lia, nael, dola, mara, iren, fael |
| Women: endings | a, ia, ra, ena, ine, ela |
| Houses (of) | mirol, bennal, luminor, gelon, miher, gal, varro, thorn, fell, marl + on, en, ol |
| Patronymic | ir. Rarely used. |
| Epithets | gael "the grey"; lor "the bright"; dran "the old"; tir "the small" |
| Titles | ruler_m: High Warden; ruler_f: High Warden; captain: Captain; scout: Scout-Master; envoy: Envoy |
| Notes | The ruling office is elective; the title is the same for both sexes. |

**Dictionary** (79 elements): river *hira*, mountain *garun*, lake *par*, valley *dial*, forest *hel* ir, ford *fah*, hill *hil*, coast *lil*, island *oro*, bridge *tuma*, wall *mur*, fort *dun*, hall *ahul* ir, high *olt* ir, low *nim*, old *dran*, new *nai*, red *ruh*, white *ail*, dark *dum* ir, bright *lor* ir, holy *hial* ir, king *ar*, queen *aria* ir, stone *tal*, iron *ger*, gold *or*, sea *mial* ir, harbour *haf*, city *giar*, town *bur*, field *lan*, road *rah*, gate *pial* ir, tower *lur* ir, spring *hul*, marsh *moh*, ice *gel*, fire *iru*, tree *bial*, wind *ven*, sun *ulan*, moon *nial* ir, star *iha*, grave *gul*, north *bor*, south *neh*, east *el*, west *veh*, great *mah*, small *tir*, black *gorn* ir, green *vial*, grey *gial* ir, deep *dol*, wolf *vul*, bear *bar*, eagle *gir*, horse *hun*, fish *ihh*, raven *gorv* ir, water *via*, cliff *grag* ir, pass *lol* ir, house *ham*, lord *lel* ir, warden *gera*, silver *hilm* ir, salt *hal* ir, ash *ehh*, blood *rud*, bone *ohu*, bell *bel*, lamp *lum*, oak *dar*, hearth *ard*, watch *valim* +, beacon *forn* +, mere *mel* +.

**30 place names:** Paron, Oltehilon, Vialdial, Nialpar, Ailia, Gialtuma, Lorhira, Talon, Valimol, Fornehil, Dranfah, Vulen, Borpial, Dolmel, Gerpial, Orahul, Ruhmoh, Ihhon, Daron, Gragol, Lolon, Lurir, Gornia, Hunhil, Bialen, Belhil, Lumon, Ihia, Iruhil, Hafon.

**30 personal names:** Maelic of Mirolen, Barar of Miheron, Lelon of Galen, Norell of Luminorol, Hadren of Gelonon, Venor of Bennalen, Molan of Varron, Delic of Thornen, Ferar of Fellol, Baelon of Marlon, Ranell of Mirolen, Almen of Miherol, Maelor of Gelonen, Baran of Bennalon, Lelic of Luminoren, Hela of Mirolol, Miria of Miheren, Venra of Galon, Liena of Luminoron, Naeline of Gelonol, Dolela of Bennalon, Mara of Varren, Irenia of Thornon, Faelra of Fellen, Helena of Marlol, Mirine of Mirolen, Venela of Miheron, Lia of Galol, Naelia of Luminoren, Dolara of Gelonon.

**Established names:** 18 country and seat names belong here (11 fit the inventory, 7 adopted as drawn). Proposed readings: **Mirolon**: Mirolic mir (an old root, "lake") + ol "watch" + -on: the lake-watch.

### 3.6 Rite-Tongue (`grave_rite`)

*Family:* ainic, daughter of ainic. *Status:* liturgical. *Spoken by:* necromantic orders of Volgan; officers of the grave hosts (titles only). *Script:* Ash script, thin straight strokes burned or scratched into bone, slate and lead tablets; no curves.

The ritual speech of the necromantic orders of Volgan and, in memory, of Elzon's Order. It is Old Ainic funeral formulas bent into a cold, fixed form. The dead do not speak it: they speak the tongue they spoke alive. Offices, binding-names and gate-names are written in it.

| Sound | |
| --- | --- |
| Consonants | p t q b d g f v x h m n l r |
| Vowels | a e i o u; diphthongs ae ai au |
| Syllable and endings | (C)V(C); closing sounds: l r n m x s |
| Stress | last syllable |
| Written form | x stands for the hiss of old s; q for old k. Names are never given a double letter. |
| Rules | every word ends in -um -os -is -es -x -l -r; no th, no k, no s: x and q replace them |
| Signature | x, q, ends in -um -os -is |

**Building names.** Order: mod-head; join: closed. Offices are written head first: the thing, then its place or number. A binding-name ends in -x.

| Suffix kind | Forms (weight: meaning) |
| --- | --- |
| settlement | *um* (4: place); *os* (3: house); *is* (3: of) |
| region | *um* (3: realm) |
| river | *x* (3: water) |
| sea | *um* (2: water) |
| mountain | *os* (2: mount) |

**Personal names.**

| Part | Pieces |
| --- | --- |
| Men: stems | qor, vel, xar, noq, dex, mar, tul, ost, qru, pal |
| Men: endings | x, um, os, is, ul, ar |
| Women: stems | xel, noq, vira, xael, quta, lun |
| Women: endings | x, um, is, ia, ul |
| Houses (none) | none |
| Patronymic | The dead carry no father's name. |
| Epithets | dran "the old"; dum "the dark"; kaur "the black"; tir "the small" |
| Titles | warden: Gera; herald: Hera; judge: Dex; keeper: Qeper |
| Notes | A name remembered from life shrinks to a binding-name of one or two syllables. |

**Dictionary** (85 elements): river *xira* ir, mountain *qarun*, lake *par*, valley *dael*, forest *xel*, ford *fax*, hill *hil*, coast *lix*, island *oros*, bridge *tumum*, wall *mur*, fort *dun*, hall *aul* ir, high *ox*, low *nim*, old *dran*, new *nai*, red *rux*, white *ail*, dark *dum*, bright *lor*, holy *xael*, king *arx* ir, queen *arux* ir, stone *tal*, iron *qer*, gold *aur*, sea *mael* ir, harbour *haf*, city *qaer* ir, town *bur*, field *lan*, road *rax*, gate *pael* ir, tower *xur* ir, spring *xul*, marsh *mox*, ice *qel*, fire *iru*, tree *bael*, wind *ven*, sun *ulan*, moon *nael*, star *ixum*, grave *quxa* ir, north *bor*, south *nex*, east *ex*, west *vex*, great *mex* ir, small *tir*, black *qaur*, green *vael*, grey *gael*, deep *dol*, wolf *vul*, bear *bar*, eagle *qir*, horse *hun*, fish *ix* ir, raven *qor*, water *vae*, cliff *qrag*, pass *xol*, house *ham*, lord *texl* ir, warden *gerum*, silver *xil*, salt *xal*, ash *exh*, blood *rud*, bone *oxu*, bell *bel*, lamp *lum*, oak *dar*, hearth *ard*, name *noqu* +, silence *taxu* +, shroud *pall* +, dust *puvu* +, crypt *qrux* +, urn *urum* +, host *ostu* +, tithe *dexu* +, vigil *vigil* +.

**30 place names:** Quxapael, Oxaul, Exhuhil, Puvulan, Qruxpael, Taxufax, Urxur, Qaurmur, Exhupael, Noqutal, Pallutumum, Dumpael, Dranqaer, Dexaul, Vigilhil, Qerpael, Qelard, Naelpael, Ixaul, Rudtal, Xallan, Boruqrux, Nexpael, Doluqrux, Gaelaul, Oxxur, Vaepael, Lumuqrux, Belxur, Oxulan.

**30 personal names:** Qorx, Velum, Xaros, Noqis, Dexul, Marul, Tulx, Ostum, Qros, Palis, Qorul, Velar, Xarx, Noqum, Dexos, Xelx, Lunx, Viris, Xaelia, Qutax, Lunul, Xelis, Noqia, Virax, Xaelum, Qutul, Lunis, Xelia, Noqul, Virum.

**Established names:** 2 country and seat names belong here (2 fit the inventory, 0 adopted as drawn).

### 3.7 Coldic (`coldic`)

*Family:* boreal, daughter of boreal. *Status:* living. *Spoken by:* Coldor Winter-Crown folk; Ice clans; Isengard warlords; Windwaith seafarers. *Script:* Frost-runes, upright runes cut with a knife into bone, birch bark and ice-stone; a pen form for the chanceries of Fandanar.

The hard speech of the Cold Lands: v and z, a short ae, and endings that close on r, k or m. It is the oldest living tongue of men in the north-west and has borrowed only road-words from Aenoran.

| Sound | |
| --- | --- |
| Consonants | p t k b d g f v s z h m n l r |
| Vowels | a e i o u; diphthongs ae ai ei oi |
| Syllable and endings | (C)(C)V(C)(C); closing sounds: r k m n d t l |
| Stress | first syllable |
| Written form | Plain letters. w is written v. The Common chart spelling keeps w in old names (Windwaith). |
| Rules | v for w; z for s between vowels; ae is one vowel; names end in -ar -or -ak -ok -om -an -ia -ald |
| Signature | v, z, ae, ends -ar -ak -om |

**Building names.** Order: mod-head; join: closed. No article. The genitive is -s after a vowel. Compounds are closed.

| Suffix kind | Forms (weight: meaning) |
| --- | --- |
| settlement | *ar* (4: place); *gard* (3: stronghold); *ak* (3: place); *om* (2: home); *heim* (1: home) |
| region | *dor* (5: land (chart form)); *vait* (4: shore); *ia* (1: country) |
| river | *a* (3: river); *elv* (2: water) |
| sea | *mar* (2: sea) |
| mountain | *berg* (1: mount); *hron* (2: mount) |

**Personal names.**

| Part | Pieces |
| --- | --- |
| Men: stems | vaes, essen, grin, ezh, esr, hend, kol, ulv, bran, ker, tor, sten, zor, yor, ald |
| Men: endings | dok, ar, an, ek, im, or, ak, ald |
| Women: stems | vaesti, alor, lun, sigr, ilv, ket, zena, hild, essa |
| Women: endings | a, ia, ra, id, ka |
| Houses (surname) | hend, azl, ezh, siul, grind, hozen, esrom, azen, vorda + air, ing, son, ak |
| Patronymic | son, dot. Given name + father's name + son or dot, used by clanfolk who have no surname. |
| Epithets | kold "the cold"; gael "the grey"; tawr "the king"; mawr "the great"; senn "the old"; bykk "the small" |
| Titles | ruler_m: King; ruler_f: Queen; chieftain: Chieftain; speaker: Speaker; warlord: Warlord |
| Notes | The Winter Crown passes in the female line as often as the male. |

**Dictionary** (79 elements): river *vaennar*, mountain *braenn*, lake *loch* ir, valley *dolv*, forest *tarv*, ford *rawd*, hill *tumm*, coast *vait* ir, island *ael* ir, bridge *tolv*, wall *murt*, fort *gard* ir, hall *halv* ir, high *hot*, low *nidd*, old *saenn*, new *nov*, red *ruv*, white *kvit*, dark *moruk*, bright *ligh*, holy *halg*, king *tawr* ir, queen *tawra* ir, stone *staenn*, iron *isen* ir, gold *gold*, sea *marg*, harbour *havn*, city *burg*, town *tunn*, field *faaenn*, road *rodd*, gate *yaett*, tower *skarr*, spring *velk*, marsh *pellk*, ice *kold* ir, fire *tan* ir, tree *bet* ir, wind *vind*, sun *heul*, moon *lun* ir, star *sterr* ir, grave *karn*, north *norr*, south *sudd*, east *aust*, west *vest*, great *mawr*, small *bykk*, black *melk*, green *grewn*, grey *graear*, deep *doun*, wolf *ulv*, bear *bern*, eagle *arn*, horse *hest*, fish *fyskar*, raven *bran*, water *vat*, cliff *klev*, pass *gast* ir, house *huz*, lord *yarl*, warden *vord* ir, silver *silf*, salt *salt* ir, ash *ask*, blood *blod* ir, bone *bayn* ir, bell *klok*, lamp *lykt* ir, oak *derv* ir, snow *snev*, sled *slak* +, glacier *jokul* +, furs *pelz* +.

**30 place names:** Koldar, Kvitbraenn, Staenngard, Ulvak, Hotgard, Dounloch, Melkrawd, Vindar, Snevak, Bernom, Saltvait, Graeargard, Ruvtumm, Saennhavn, Norrgard, Arnar, Grewndolv, Branak, Tawrgard, Klevar, Koldbraenn, Margak, Fyskarhavn, Dervar, Tolvak, Skarrom, Vatar, Jokulak, Isentumm, Goldgard.

**30 personal names:** Grinek Azling, Ezhor Ezhair, Esrek Siuling, Hendar Grindak, Kolek Hozenson, Ulvak Esroming, Branald Azenair, Kerim Vordavak, Toran Azlson, Stenor Ezhing, Zorak Siulair, Yorek Grindson, Aldan Hozening, Vaesar Esromair, Essenim Azenak, Vaestiva Azling, Aloria Ezhair, Lunra Siuling, Sigrid Grindak, Ilva Hozenson, Ketka Esroming, Zenavia Azenair, Hilda Vordavak, Essara Azlson, Vaestivid Ezhing, Alora Siulair, Lunka Grindson, Sigria Hozening, Ilvra Esromair, Kolan Azlair.

**Established names:** 58 country and seat names belong here (45 fit the inventory, 13 adopted as drawn). Proposed readings: **Coldor**: Coldic kold "ice" + chart -dor "land": the ice-land. **Isengard**: Coldic isen "iron" + gard "stronghold". **Windwaith**: Coldic vind "wind" + vait "shore" (native Vindvait; the chart spelling keeps w).

### 3.8 Gunwaithic (`gunwaithic`)

*Family:* boreal, daughter of boreal. *Status:* living. *Spoken by:* Gunwaith clans; Girdon wardens; Western guildmen; Buldor companies. *Script:* Clan-ogham, notches along the edge of a stave or a standing stone; guildmen use the Common hand for contracts.

The clan-speech of the West Lands, the tongue that Aenor's colonists met on the western shores. It puts the noun first and the adjective after, and it has gw, ch and a soft th. Chart forms spell its names with Aenoran endings.

| Sound | |
| --- | --- |
| Consonants | p t c k b d g gw w f v s h ch m n l r |
| Vowels | a e i o u y; diphthongs ai ei ow aw ia |
| Syllable and endings | (C)(C)V(C)(C); closing sounds: r l n th d t |
| Stress | second to last |
| Written form | gw is one sound; ch is the sound in Scottish loch; y is a vowel as in "myth". |
| Rules | noun first, adjective after, joined by a hyphen; names end in -ith -on -yn -ow -wyn -ic -id; no z, no x, no j |
| Signature | gw, ch, ith, ow, wyn, hyphen compounds |

**Building names.** Order: head-mod; join: hyphen. Descriptive names are head-first and hyphenated (Chalwe-Gwit, "White Hall"). Eponym names are closed. Chart forms add -on or -in to a stem.

| Suffix kind | Forms (weight: meaning) |
| --- | --- |
| settlement | *on* (5: place (chart)); *ith* (3: shore-place); *in* (2: little place); *wyn* (2: the folk of) |
| region | *waith* (5: shore); *on* (3: land); *dor* (2: land (chart)) |
| river | *ow* (3: river); *aw* (2: stream) |
| sea | *mar* (2: sea) |
| mountain | *ben* (2: mount) |

**Personal names.**

| Part | Pieces |
| --- | --- |
| Men: stems | her, ilur, dat, sar, tar, osl, wer, gwil, bran, cad, dyf, emr, ruar, gar |
| Men: endings | lic, ic, id, yn, an, ow, orn, wyn |
| Women: stems | ilur, pern, sar, nesi, brea, cadi, eira, myr, gwen |
| Women: endings | da, ia, wen, eth, ith, a |
| Houses (clan) | werl, bolp, rook, lothor, canak, trilin, sarud, bulligon + wyn, ow, ith |
| Patronymic | ap. Given + ap + father's name (Tarlic ap Dat). Women use ach. |
| Epithets | gwit "the white"; moruk "the dark"; mawr "the great"; bykk "the small"; senn "the old"; rhuva "the red" |
| Titles | ruler_m: King; ruler_f: Queen; thane: Thane; lawspeaker: Lawspeaker; warden: Warden; consul: Consul |
| Notes | A clan king is acclaimed at a standing stone and bound by the Lawspeaker. |

**Dictionary** (81 elements): river *wennar*, mountain *brenn*, lake *loch* ir, valley *dolw*, forest *tarwe*, ford *rawd*, hill *tumm*, coast *waith*, island *eil*, bridge *tolw*, wall *murth*, fort *garth* ir, hall *chalwe* ir, high *choth*, low *nidd*, old *senn*, new *now*, red *ruv*, white *gwit*, dark *moruk*, bright *ligh*, holy *chalg*, king *tawr* ir, queen *tawra* ir, stone *stenn*, iron *isen* ir, gold *gold*, sea *marg*, harbour *chavn*, city *burg*, town *tunn*, field *faenn*, road *rodd*, gate *iatt*, tower *skarr*, spring *welce*, marsh *pellk*, ice *cold* ir, fire *tanu*, tree *bethu*, wind *wind*, sun *cheulu* ir, moon *lun* ir, star *sterr*, grave *karne*, north *norr*, south *sudd*, east *aust*, west *west*, great *mawr*, small *bykk*, black *melk*, green *grewn*, grey *grei*, deep *doun*, wolf *ulw*, bear *bern*, eagle *arn*, horse *chest*, fish *fyska*, raven *bran*, water *wat*, cliff *klev*, pass *gast* ir, house *chus*, lord *yarl*, warden *gwarden* ir, silver *silf*, salt *salt*, ash *ask*, blood *blodd*, bone *bayn*, bell *klok*, lamp *lykta*, oak *derwu*, snow *snew*, sled *slak*, clan *plaid* +, oath *gwed* +, hill_fort *caer* +, moot *senedd* +.

**30 place names:** Chalwe-Gwit, Garth-Moruk, Wennar-Ruv, Rawdon, Stennith, Tummin, Ulwon, Garth-Choth, Loch-Doun, Derwuon, Isenith, Tolwon, Chalwe-Gold, Bernwyn, Arnin, Branith, Chavnon, Iatt-Norr, Waith-Salt, Klevon, Skarr-Gwit, Dolw-Grewn, Stenn-Grei, Garth-Senn, Chestwyn, Lochon, Bethuin, Chalwe-Lun, Margith, Tawron.

**30 personal names:** Herlic Werlwyn, Ilurid Bolpow, Datan Rookwyn, Saric Lothorith, Tarwyn Canakwyn, Oslan Trilinow, Werow Sarudith, Gwilid Bulligonwyn, Branorn Werlow, Cadwyn Bolpwyn, Dyfan Rookith, Emric Lothorwyn, Ruarid Canakow, Garyn Trilinwyn, Heran Sarudwyn, Ilurda Werlwyn, Pernia Bolpow, Sarwen Rookwyn, Nesia Lothorith, Breaeth Canakwyn, Cadiith Trilinow, Eirada Sarudith, Myria Bulligonwyn, Gwena Werlow, Ilurwen Bolpwyn, Perneth Rookith, Saria Lothorwyn, Nesida Canakow, Breaith Trilinwyn, Branic Lothorow.

**Established names:** 42 country and seat names belong here (42 fit the inventory, 0 adopted as drawn). Proposed readings: **Gunwaith**: Gunwaithic gun- (a clan name, open) + waith "shore".

### 3.9 Tritonic (`tritonic`)

*Family:* boreal, daughter of boreal. *Status:* living. *Spoken by:* Triton chart-islanders; Triton corsairs. *Script:* Chart-hand, small joined letters written with fine pens on sea-charts; islanders also tally with knotted cords.

The island speech of the Pupor Ocean: an open tongue that gives every word a vowel ending and loves the sound ai. Its sailors named the reefs, tides and straits that every chart now carries.

| Sound | |
| --- | --- |
| Consonants | p t k b d g f v s h m n l r |
| Vowels | a e i o u; diphthongs ai ei au oi ia |
| Syllable and endings | CV(C), almost always open; closing sounds: s n l |
| Stress | second to last |
| Written form | Plain letters. ai is always two sounds said fast. |
| Rules | almost every name ends in a vowel or -os -on -an; ai and ei are the marks of the tongue; no clusters of three consonants |
| Signature | ai, ei, ends -os -ai -ko -ni |

**Building names.** Order: mod-head; join: closed. The island is named for its first harbour. Plural by -ai.

| Suffix kind | Forms (weight: meaning) |
| --- | --- |
| settlement | *os* (4: place); *ai* (4: the folk); *on* (3: harbour); *ko* (2: little place); *ni* (1: cove) |
| region | *ai* (4: islands); *os* (3: isle); *dor* (1: land (chart)) |
| river | *a* (2: stream) |
| sea | *ai* (2: sea) |
| mountain | *os* (2: peak) |

**Personal names.**

| Part | Pieces |
| --- | --- |
| Men: stems | saner, hes, lem, ben, son, kus, kil, ur, ar, pam, tin, han, dai, rae |
| Men: endings | os, ai, o, ei, on, ios, an |
| Women: stems | aun, mond, sei, eis, ilo, tal, nai, halen, lus |
| Women: endings | a, ai, ei, ia, oa, ina |
| Houses (surname) | pol, raer, fin, hes, kil, andai, mond, sei, lusti + ai, os, on |
| Patronymic | idas. Rare: Given + father's name + idas. |
| Epithets | kwit "the white"; moruk "the dark"; mawr "the great"; bykk "the small"; senna "the old" |
| Titles | ruler_m: Speaker; ruler_f: Speaker; captain: Captain-Speaker; guildmaster: Guild-Master; king: King |
| Notes | Most island lords are elected Speakers; the few kings (Nondondor) are sea-kings. |

**Dictionary** (84 elements): river *wennaros*, mountain *brennos*, lake *lohu*, valley *dolwai*, forest *tarwe*, ford *rawdos*, hill *tumai* ir, coast *waitos* ir, island *ailai*, bridge *tolwai*, wall *murtos* ir, fort *gardai*, hall *halwe*, high *hoto* ir, low *nidos*, old *sennai*, new *nowai*, red *ruvai*, white *kitos*, dark *morukos*, bright *lighai*, holy *halgai*, king *tawros* ir, queen *tawrai* ir, stone *stennai*, iron *isenos* ir, gold *goldai*, sea *margai*, harbour *havnai*, city *burgai*, town *tunnai*, field *faennos*, road *rodai*, gate *yaettos*, tower *skarrai*, spring *welke*, marsh *pellkos*, ice *koldai* ir, fire *tanu*, tree *betu*, wind *windai* ir, sun *heulu*, moon *lunnai*, star *sterrai*, grave *karne*, north *norrai*, south *sudai*, east *austai*, west *westai*, great *mawros*, small *bykkos*, black *melkos*, green *grewnos*, grey *graiai*, deep *dounos*, wolf *ulwai*, bear *bernai*, eagle *arnai*, horse *hestai*, fish *fyskai*, raven *branos*, water *watai*, cliff *klevo* ir, pass *gastai*, house *husai*, lord *yarlai*, warden *vordai*, silver *silfai*, salt *saltai*, ash *askai*, blood *blodos*, bone *baynai*, bell *klokai*, lamp *lyktai*, oak *derwu*, snow *snewai*, sled *slakai*, reef *rifai* +, strait *strato* +, cape *kapos* +, tide *tidai* +, ship *nauos* +, shoal *shoalo* +, current *streima* +.

**30 place names:** Rifos, Kapai, Tidon, Havnai, Shoalos, Straton, Kitorifai, Ruvohavnai, Windai, Saltos, Ulwoko, Arnoni, Stennos, Goldohavnai, Derwai, Norrokapos, Dounohavnai, Branos, Fyskon, Margai, Skarros, Sterrorifai, Lunnohavnai, Bernos, Hotoklevo, Grewnai, Naon, Tanurifai, Melkoni, Streimos.

**30 personal names:** Saneros Polai, Hesai Raeros, Lemei Finon, Benei Hesai, Sonon Kilos, Kusios Andaon, Kilan Mondai, Uros Seos, Arai Luston, Pamo Polos, Tinei Raerai, Hanon Finos, Daos Heson, Raai Kilai, Saneran Andaos, Auna Polai, Mondai Raeros, Seei Finon, Eisia Hesai, Iloa Kilos, Talina Andaon, Naa Mondai, Halenai Seos, Lusei Luston, Aunia Polos, Mondoa Raerai, Seina Finos, Eisa Heson, Ilai Kilai, Lemos Andaai.

**Established names:** 68 country and seat names belong here (58 fit the inventory, 10 adopted as drawn).

### 3.10 Noric (`noric`)

*Family:* eastern, daughter of eastern. *Status:* living. *Spoken by:* Noris camel warriors; desert kingdoms of the South Lands. *Script:* Sand script, flowing letters joined along a baseline, written right to left with a reed; caravan marks are knotted on cords.

The desert speech of the camel kings: long vowels, q and kh, and words that end on a hard stop. It is the tongue of wells, caravans and sworn oaths.

| Sound | |
| --- | --- |
| Consonants | b d g h k kh q m n l r s sh t w y z |
| Vowels | a e i o u aa ii uu oo; diphthongs ai au |
| Syllable and endings | (C)V(C)(C); closing sounds: any single consonant; rq rb rz lk |
| Stress | last syllable |
| Written form | Long vowels are doubled. q is a throat k. kh is the sound in loch. |
| Rules | short words: one or two syllables; names end on a consonant: -ud -iq -ar -aq -ir -um -ak; q, kh and doubled vowels mark the tongue |
| Signature | q, kh, aa, uu, ends in a consonant |

**Building names.** Order: head-mod; join: hyphen. Construct state: the thing comes first and the quality follows, joined by a hyphen (Wahe-Rakh, "Red Oasis"). A people is named with -ud.

| Suffix kind | Forms (weight: meaning) |
| --- | --- |
| settlement | *ud* (3: people of); *iq* (3: well-place); *ar* (2: camp); *um* (2: city) |
| region | *is* (4: country); *ud* (3: folk of); *dor* (2: land (chart)) |
| river | *aa* (2: water) |
| sea | *um* (2: water) |
| mountain | *aq* (2: mount) |

**Personal names.**

| Part | Pieces |
| --- | --- |
| Men: stems | esiurt, alod, tum, fur, qas, khad, bar, yak, zar, mel, ras, nur, kers |
| Men: endings | ar, ud, iq, an, im, ek, o |
| Women: stems | shar, len, mai, shin, zah, nur, yar, tamar |
| Women: endings | a, i, ah, un, ia |
| Houses (tribe) | kers, furan, ras, dun, khad, zahu, tir, mel + i, ud, an |
| Patronymic | ben. Given + ben (son) or bat (daughter) + father's name; used by every free man of the sand. |
| Epithets | leb "the white"; kal "the dark"; rabu "the great"; qatan "the small"; sen "the old"; rakh "the red" |
| Titles | ruler_m: King; ruler_f: Queen; sheikh: Well-Lord; master: Master of Caravans; rider: Rider-General |
| Notes | The king of Noris is the war-leader of the tribes, chosen by the well-lords from one line. |

**Dictionary** (79 elements): river *shaar*, mountain *khadar*, lake *meq* ir, valley *yaal*, forest *oor*, ford *qaas*, hill *tuul* ir, coast *saah*, island *iim*, bridge *tarq*, wall *khoor*, fort *barud* ir, hall *duum*, high *khaar*, low *zem*, old *sen*, new *nuuv*, red *rakh*, white *leb*, dark *kaal*, bright *shiin*, holy *qaad*, king *saar* ir, queen *saari* ir, stone *kaar*, iron *barz* ir, gold *zaah*, sea *naam* ir, harbour *poor*, city *urum*, town *viik*, field *maar*, road *tirak* ir, gate *dwaar* ir, tower *sakar* ir, spring *ber*, marsh *luum*, ice *sheek* ir, fire *nuur*, tree *ilan*, wind *ruuh*, sun *shem*, moon *len*, star *kook*, grave *tumb*, north *zaaf*, south *neq*, east *sharq*, west *maqr*, great *raab*, small *qatan*, black *kush*, green *yaar*, grey *rem*, deep *amq*, camel *gaml*, horse *es*, fish *nuun*, hawk *baaz*, water *mai*, sand *hool*, salt *mel*, oasis *wahat* ir, dune *duun*, caravan *kerev*, well *biir*, cliff *sel*, pass *maaq*, house *bet*, lord *beq* ir, warden *nasar* ir, silver *arg*, ash *ash*, blood *daam*, bone *ats*, bell *ziil*, lamp *ner*, date *tamar*, cedar *erez*.

**30 place names:** Wahat-Rakh, Biir-Leb, Duuniq, Gamlar, Hoolum, Tamarud, Meliq, Kerevum, Erezar, Baaziq, Kaarud, Zaahum, Wahat-Kaal, Biir-Amq, Ruuhar, Shemum, Leniq, Kookar, Selud, Barud-Rakh, Dwaar-Khaar, Sakar-Leb, Tarqiq, Shaarum, Tuular, Barzud, Argum, Maiiq, Tirakar, Saarum.

**30 personal names:** Esiurtar Kersi, Alodud Furani, Tumiq Rasi, Furan Duni, Qasim Khadi, Khadek Zahui, Baro Tiri, Yakar Meli, Zarud Kersud, Meliq Furanud, Rasan Rasud, Nurim Dunud, Kersek Khadud, Tumar Zahuan, Alodiq Tiran, Shara Kersi, Leni Furani, Maiah Rasi, Shinun Duni, Zahia Khadi, Nura Zahui, Yari Tiri, Tamarah Meli, Sharun Kersud, Lenia Furanud, Maia Rasud, Shini Dunud, Zahah Khadud, Nurun Zahuan, Alodan Rasan.

**Established names:** 18 country and seat names belong here (11 fit the inventory, 7 adopted as drawn). Proposed readings: **Noris**: Noric nuuv "new" + -is "country": the New Country of the tribes who crossed the plain.

### 3.11 Stabilic (`stabilic`)

*Family:* eastern, daughter of eastern. *Status:* living. *Spoken by:* Stabilo caravan princes; southern trade cities. *Script:* Ledger hand, upright letters with long tails, written in ink on rolled paper; seals are cut in bronze.

The merchant tongue of the southern trade cities: it drops the vowel after a first stop, ends every word in -o, -a or -io, and has the clusters pl, pr, st and tr. It is the language of contracts and scales.

| Sound | |
| --- | --- |
| Consonants | p t c ch b d g f v s z m n l r |
| Vowels | a e i o u; diphthongs ia io eo ai |
| Syllable and endings | (C)(C)V(C); closing sounds: n r s l |
| Stress | second to last |
| Written form | c is always hard, ch is soft, as in "church". |
| Rules | names end in -o -a -io -ia or -on; clusters pl pr tr st cr bl are allowed at the start; no kh, no q, no sh |
| Signature | pl, pr, tr, cr, ends -o -a -io |

**Building names.** Order: head-mod; join: closed. Descriptive names put the quality last and join with -o- (Portocairo). The merchant's mark follows the town (Postondoroth-Gold).

| Suffix kind | Forms (weight: meaning) |
| --- | --- |
| settlement | *io* (4: place); *ia* (3: town); *on* (3: great); *ino* (2: little) |
| region | *ia* (5: country); *dor* (3: land (chart)); *on* (1: land) |
| river | *ino* (3: stream) |
| sea | *namo* (1: sea) |
| mountain | *on* (2: mount) |

**Personal names.**

| Part | Pieces |
| --- | --- |
| Men: stems | cer, hard, pos, tab, mil, cor, bel, nar, ful, pru, dem, tel, arc, pler |
| Men: endings | o, io, an, ar, eo, ino, on |
| Women: stems | myl, azan, lav, sar, nel, pel, tra, ful |
| Women: endings | a, ia, ina, ella, ana |
| Houses (surname) | azan, shind, cer, prud, tabl, dolgi, fund, cro + o, ia, on, i |
| Patronymic | di. Rare: Given + di + father's given name. |
| Epithets | altro "the high"; cloro "the dark"; rabo "the great"; seno "the old"; catan "the small" |
| Titles | ruler_m: Prince; ruler_f: Princess; treasurer: Treasurer of the Pact; general: General; factor: Factor |
| Notes | The prince of Stabilo is first among the factors, chosen by the bench of houses. |

**Dictionary** (79 elements): river *sharo* ir, mountain *cadar*, lake *meco*, valley *yalo*, forest *oro*, ford *casio* ir, hill *tlo* ir, coast *saho*, island *imo*, bridge *ponto* ir, wall *muro* ir, fort *castro* ir, hall *dumo* ir, high *altro* ir, low *zemo*, old *seno* ir, new *nuvo*, red *raco*, white *lebo*, dark *cloro* ir, bright *sino*, holy *cado*, king *princo* ir, queen *prinza* ir, stone *cairo* ir, iron *barzo* ir, gold *zaho* ir, sea *namo* ir, harbour *porto* ir, city *urum*, town *vico*, field *maro*, road *tirac* ir, gate *dwaro*, tower *sacaro* ir, spring *berio* ir, marsh *lumo*, ice *seco*, fire *nuro* ir, tree *ilan*, wind *ruho*, sun *semo*, moon *leno*, star *coco* ir, grave *tumbo*, north *zafo*, south *neche*, east *sarc*, west *macro*, great *rabo*, small *catan*, black *cuso*, green *yaro*, grey *remo*, deep *amco*, camel *gamlo*, horse *eso*, fish *nuno*, hawk *bazio*, water *mai*, sand *holo*, salt *melo*, oasis *wahe*, dune *duno*, caravan *crev*, well *bro* ir, cliff *selo*, pass *maco* ir, house *beto*, lord *beco*, warden *nasar*, silver *argio*, ash *aso*, blood *damo*, bone *atso*, bell *zilo*, lamp *nero*, date *tamar*, cedar *erez*.

**30 place names:** Portio, Zahia, Cairon, Castrino, Sharia, Esio, Sacaraltro, Pontia, Mecon, Melio, Dwarino, Tlia, Porton, Barzio, Argia, Ilanino, Semio, Lenia, Gamlon, Berio, Lumia, Lumino, Urumon, Portozafo, Cocio, Holia, Namio, Brino, Tiracia, Erezon.

**30 personal names:** Cero Azani, Hardio Shindia, Posan Ceron, Tabar Prudi, Mileo Tablo, Corino Dolgia, Belon Fundon, Naro Cri, Fulio Azani, Pran Shindo, Demar Ceri, Teleo Prudon, Arcino Tablia, Pleron Dolgo, Ceran Fundi, Myla Azani, Azania Shindia, Lavina Ceron, Sarella Prudi, Nelana Tablo, Pela Dolgia, Tria Fundon, Fulina Cri, Mylella Azania, Azanana Shindo, Lava Ceri, Saria Prudon, Nelina Tablia, Pelella Dolgo, Hardo Ceria.

**Established names:** 20 country and seat names belong here (16 fit the inventory, 4 adopted as drawn). Proposed readings: **Postondoroth**: Stabilic porto "harbour" + -on "great" + dor + oth "high": the great high harbour-land. **Stabilo**: Stabilic stab- (a house name) + -ilo, a diminutive of respect.

### 3.12 Alerhic (`alerhic`)

*Family:* eastern, daughter of eastern. *Status:* living. *Spoken by:* River-Kings of the East; Lake Road cities; Red Lands. *Script:* Reed letters, rounded letters pressed into clay and written in ink on papyrus-like reed sheets; court seals are cut in stone.

The court tongue of the river kingdoms of the East: stately, with rh and th, and endings in -ia, -is and -oth. It was the language of scribes and priests long before the caravan roads.

| Sound | |
| --- | --- |
| Consonants | p t k b d g f s th ch m n l r rh w y z |
| Vowels | a e i o u; diphthongs ai oi ae ia io |
| Syllable and endings | (C)(C)V(C); closing sounds: n r s th l |
| Stress | second to last |
| Written form | rh is a rolled, breathy r at the start of a word. th is one sound. ch is the Scottish sound. |
| Rules | names end in -ia -is -os -oth -ae -on; rh only at the start; no q, no sh |
| Signature | rh, th, oi, ends -ia -is -oth |

**Building names.** Order: mod-head; join: closed. Genitive by -on after the possessor (Alerh-on-ia). Kingdoms end in -ia.

| Suffix kind | Forms (weight: meaning) |
| --- | --- |
| settlement | *is* (4: city); *oth* (3: high place); *ia* (3: town); *on* (3: seat); *ae* (1: little) |
| region | *ia* (6: kingdom); *oth* (2: high land); *dor* (2: land (chart)) |
| river | *is* (3: water); *os* (2: stream) |
| sea | *os* (2: sea) |
| mountain | *oth* (3: mount) |

**Personal names.**

| Part | Pieces |
| --- | --- |
| Men: stems | alerh, ocell, blos, furan, ker, ernoi, thar, morod, esiur, rhan, kers, mirod |
| Men: endings | an, is, ios, oth, on, eus, ian |
| Women: stems | obm, lorv, rhai, thea, moir, kai, eraver, alerh |
| Women: endings | ia, a, ena, is, ae |
| Houses (surname) | alerh, furan, ernois, cream, ostor, kers, plut, mia + ides, os, is |
| Patronymic | ides. Son of is -ides after the father's stem. |
| Epithets | kalia "the dark"; leb "the white"; rabis "the great"; qatan "the small"; senis "the old" |
| Titles | ruler_m: King; ruler_f: Queen; lord: Lord; speaker: Speaker; tribune: Tribune; prince: Prince |
| Notes | Kings take a number and the name of the river that crowned them. |

**Dictionary** (79 elements): river *tharis*, mountain *chadar*, lake *mekia*, valley *yalia*, forest *oris*, ford *kasis*, hill *tulia*, coast *sahia*, island *imis*, bridge *tarkis*, wall *choria*, fort *barudia*, hall *dumis*, high *charia*, low *zemia*, old *senis* ir, new *nuvia*, red *rhachia*, white *lebia*, dark *kalia*, bright *thinia*, holy *kadia*, king *saria*, queen *saris* ir, stone *karis* ir, iron *barzis* ir, gold *zahis*, sea *namia*, harbour *poria*, city *urum* ir, town *vikia*, field *marae* ir, road *tirak*, gate *dwaria* ir, tower *sakaris* ir, spring *beris*, marsh *lumia*, ice *thekia*, fire *nuria*, tree *ilan*, wind *rhuhia*, sun *themia*, moon *lenia*, star *kokia*, grave *tumbia*, north *zafis*, south *nekae*, east *thark*, west *makria*, great *rhabis*, small *katan*, black *kuthia*, green *yaria*, grey *rhemia*, deep *amkia*, camel *gamlia*, horse *esis*, fish *nunia*, hawk *bazis*, water *moi*, sand *holia*, salt *melia*, oasis *wahae*, dune *dunia*, caravan *kerev*, well *biria*, cliff *selia*, pass *makia*, house *betia*, lord *bekia* ir, warden *nasaris* ir, silver *argis*, ash *athis*, blood *damia*, bone *atsia*, bell *zilia*, lamp *neria*, date *tamar*, cedar *erez*.

**30 place names:** Tharis, Mekia, Chartuloth, Lebia, Karis, Kadoth, Zahis, Barzon, Tarkis, Dwarae, Sakaroth, Barudia, Poris, Urumis, Beria, Oris, Namis, Themoth, Lenae, Kokis, Rhachia, Kaloth, Argoth, Esis, Nunae, Nuron, Dumia, Meloth, Erezis, Choron.

**30 personal names:** Alerhan Alerhides, Ocellis Furanos, Blosios Ernoisis, Furanoth Creamides, Keron Ostoros, Ernoeus Kersis, Tharian Plutides, Morodan Mios, Esiuris Alerhis, Rhanios Furanides, Kersoth Ernoisos, Mirodon Creamis, Alerheus Ostorides, Ocellian Kersos, Blosan Plutis, Obmia Alerhides, Lorva Furanos, Rhaena Ernoisis, Theis Creamides, Moirae Ostoros, Kaia Kersis, Eravera Plutides, Alerhena Mios, Obmis Alerhis, Lorvae Furanides, Rhaia Ernoisos, Thea Creamis, Moirena Ostorides, Kais Kersos, Alerhoth Creamides.

**Established names:** 32 country and seat names belong here (25 fit the inventory, 7 adopted as drawn). Proposed readings: **Mora**: Alerhic mora, "field". **Alerhia**: Alerhic alerh (the river-people) + -ia "kingdom".

### 3.13 Sylvan (`sylvan`)

*Family:* elvish, daughter of elder. *Status:* living. *Spoken by:* Magical Forest and its council houses; Hill Kingdom elves; Lake elves; Pass-Wardens; Rift-Coast elves. *Script:* Leaf-script, flowing joined letters drawn with a brush, each word a single curved line; carved on bark-paper and on the stone of the Great Wall's elven gates.

The flowing speech of the elves of the Magical Lands. It lenites its inner consonants, ends many words in -iel and puts a soft v where Elder Elvish had w. The elected houses debate in it and write their laws in it.

| Sound | |
| --- | --- |
| Consonants | p t th k h b d g f v s m n l r w y |
| Vowels | a e i o u; diphthongs ae ia ie ea |
| Syllable and endings | (C)V(C), open syllables favoured; closing sounds: l n r th s |
| Stress | second to last |
| Written form | Plain letters; th is one sound. iel is three sounds said as one. |
| Rules | names end in -iel -an -ian -eth -wen -ion -ith; between vowels t becomes th and k becomes h; no hard clusters of three consonants |
| Signature | iel, wen, th between vowels, ae, ia |

**Building names.** Order: mod-head; join: closed. Genitive by -in after the possessor. House names are used as a prefix to the person (Velakorin Lusiel in the council; Lusiel Velakorin in speech).

| Suffix kind | Forms (weight: meaning) |
| --- | --- |
| settlement | *iel* (4: fair place); *ion* (3: great place); *wen* (2: maiden / little place); *lond* (2: haven) |
| region | *ia* (4: country); *lor* (3: land); *dor* (1: land (chart)) |
| river | *ar* (3: river); *iel* (2: water) |
| sea | *iel* (2: water) |
| mountain | *orn* (2: peak) |

**Personal names.**

| Part | Pieces |
| --- | --- |
| Men: stems | lus, per, her, vel, sir, tav, var, ael, ith, dor, fen, lorn, aen |
| Men: endings | iel, an, ian, eth, wen, ion, ar, ith |
| Women: stems | aenw, sir, tav, lus, nym, ilw, orn, lyr |
| Women: endings | iel, a, wen, ia, eth, ane |
| Houses (surname) | velak, lozar, lust, taur, silv, ael, orn, dren + orin, ael, ion, iel |
| Patronymic | in. Rare; elves count by house. |
| Epithets | luni "the white"; nuru "the dark"; aila "the bright"; eldu "the old"; mara "the great"; tiri "the small" |
| Titles | ruler_m: Speaker; ruler_f: Speaker; marshal: Marshal; warden: Warden; loremaster: Loremaster; captain: Captain |
| Notes | The first among the houses is called First Speaker and is elected for a term of years that can be long. |

**Dictionary** (80 elements): river *nael*, mountain *orniel*, lake *ila*, valley *veniel*, forest *laeth*, ford *sarn*, hill *tham*, coast *faen*, island *welo*, bridge *rana*, wall *dren*, fort *korin*, hall *aleth*, high *aran*, low *neriel*, old *elda*, new *neth*, red *saril* ir, white *luni*, dark *nura*, bright *aila*, holy *ael*, king *dunei* ir, queen *dunai* ir, stone *tor*, iron *angiel*, gold *olar*, sea *thala*, harbour *ossiel*, city *kelun*, town *mana*, field *yara*, road *fera*, gate *vaen*, tower *tumel*, spring *lisiel*, marsh *mora*, ice *ryne*, fire *kaera*, tree *gala*, wind *vael*, sun *hyal*, moon *nyel*, star *isel*, grave *umbiel*, north *boreth*, south *nesa*, east *etha*, west *vesa*, great *mara*, small *tiri*, black *kael*, green *yaviel*, grey *gaeliel*, deep *dola*, wolf *vula*, bear *bara*, eagle *thori*, horse *roha*, fish *isha*, raven *kora*, water *uis*, cliff *kraniel*, pass *thola*, house *hamiel*, lord *hael*, warden *gerith* ir, silver *thyl*, salt *sala*, ash *esha*, blood *rudiel*, bone *osth*, bell *bela*, lamp *lumi*, oak *dara*, leaf *ruth*, song *lyra*, dawn *aura*, mist *mish*, root *ruan*.

**30 place names:** Ailnael, Luniliel, Aranatham, Aellaeth, Eldasarn, Yavveniel, Thyllisiel, Iselaleth, Nyelila, Dariel, Ruthion, Lyriel, Aurwen, Mishanael, Ruanlond, Olaratham, Dolveniel, Ailossiel, Vaeliel, Galion, Lunirana, Koriniel, Torion, Thoriel, Vulatham, Aranvaen, Hyalion, Gaelsarn, Borethafaen, Laethia.

**30 personal names:** Lusiel Lozarael, Feneth Taurion, Lornith Aeliel, Aenar Drenorin, Lusan Lozarael, Periel Taurion, Lorneth Aeliel, Aenith Drenorin, Peran Lozarael, Heriel Taurion, Heran Aeliel, Veliel Drenorin, Velan Lozarael, Siriel Taurion, Siran Aeliel, Lusane Taurion, Orna Aeliel, Nymeth Drenorin, Aenwiel Lozarael, Lyriel Taurion, Ilwia Aeliel, Ornawen Drenorin, Nymane Lozarael, Aenwa Taurion, Lyra Aeliel, Ilweth Drenorin, Siriel Lozarael, Sira Taurion, Taviel Aeliel, Tava Drenorin.

**Established names:** 42 country and seat names belong here (34 fit the inventory, 8 adopted as drawn).

### 3.14 Galic (`galic`)

*Family:* elvish, daughter of elder. *Status:* living. *Spoken by:* Gala court; Gala, North Gala and the Gala Elves. *Script:* Sun-hand, tall letters with a bar across the top like a horizon, painted in gold ink on pale vellum.

The court language of the Gala elves. It keeps the oldest forms of Elder Elvish: long vowels split into ea and ie, final -ien, and names written as two stately words. Whether it is kin to Sunhot beyond the common Elder root is left open.

| Sound | |
| --- | --- |
| Consonants | p t c b d g f v s m n l r w y |
| Vowels | a e i o u; diphthongs ea ie io ia ae |
| Syllable and endings | (C)V(C); closing sounds: n l r t s |
| Stress | first syllable |
| Written form | Plain letters; c is always hard. There is no th and no h at the start of a word. |
| Rules | no th, no initial h; names end in -ien -iel -eon -ion -eya -oth; descriptive names are two words, noun first |
| Signature | ea, ien, eya, no th, no initial h |

**Building names.** Order: head-mod; join: space. The noun comes first, then the quality: Corin Aila "Bright Fort". Place names with a suffix are one word.

| Suffix kind | Forms (weight: meaning) |
| --- | --- |
| settlement | *ien* (4: place); *eya* (3: fair place); *oth* (2: high place) |
| region | *ion* (4: country); *and* (3: land); *dor* (1: land (chart)) |
| river | *ae* (3: river) |
| sea | *ion* (2: water) |
| mountain | *oth* (2: peak) |

**Personal names.**

| Part | Pieces |
| --- | --- |
| Men: stems | lor, sul, tang, hev, ael, cal, mir, ond, thal, ven |
| Men: endings | ien, iel, eon, ion, oth, ael |
| Women: stems | hev, gal, ael, lis, ond, mir, ela |
| Women: endings | eya, ia, iel, ene, ien |
| Houses (of) | gala, sodol, yunless, tang, hev, cal + ien, ion |
| Patronymic | None; the Gala remember lineages by the Mirror's keepers and not by names. |
| Epithets | luni "the white"; nuro "the dark"; aila "the bright"; eldo "the old"; mara "the great" |
| Titles | ruler_m: King; ruler_f: Queen; keeper: Keeper of the Mirror; captain: Captain; master: Master of the Ships |
| Notes | Kings hold the crown for as long as they will. Lorien's name is unique and is never given. |

**Dictionary** (80 elements): river *neal*, mountain *orne*, lake *ilo*, valley *wene*, forest *leat*, ford *sarn*, hill *tam*, coast *fean*, island *uelo*, bridge *rano*, wall *dren*, fort *corin*, hall *alet* ir, high *aran*, low *nere*, old *eldo*, new *net*, red *saro*, white *lunien*, dark *nuro*, bright *aila*, holy *iael* ir, king *dunei*, queen *dunia* ir, stone *tor*, iron *ange*, gold *olar*, sea *talo*, harbour *osse*, city *celun*, town *mano*, field *iaro*, road *fero*, gate *vean*, tower *tumel*, spring *lise*, marsh *moro*, ice *rine*, fire *cearo*, tree *galo*, wind *weal*, sun *ial* ir, moon *niel*, star *isiel* ir, grave *umbe*, north *boret*, south *neso*, east *eta*, west *weso*, great *mara*, small *tirien*, black *ceal*, green *iave*, grey *geale*, deep *dolo*, wolf *wulo*, bear *baro*, eagle *torien*, horse *roho*, fish *isho*, raven *coro*, water *uis*, cliff *crane*, pass *tolo*, house *ame*, lord *eal* ir, warden *gerit* ir, silver *til*, salt *salo*, ash *esho*, blood *rude*, bone *ost*, bell *belo*, lamp *lumien*, oak *dara*, leaf *rut*, song *lira*, dawn *aura*, mist *mish*, root *ruan*.

**30 place names:** Corin Aila, Neal Lunien, Alet Iael, Sarn Eldo, Tam Aran, Il Dolo, Wene Iave, Alet Isiel, Alet Ial, Il Niel, Aurien, Lireya, Rutien, Osse Olar, Lise Til, Galeya, Toroth, Talion, Torien, Vean Aran, Ran Lunien, Corineya, Neal Mish, Darien, Wealoth, Tumel Belo, Alet Lumien, Fean Boret, Leation, Ruanien.

**30 personal names:** Lorien of Sodolion, Thaliel of Tangien, Miroth of Calion, Venien of Sodolien, Ondion of Tangion, Loriel of Calien, Thaleon of Sodolion, Mirael of Tangien, Sulien of Calion, Veniel of Sodolien, Ondoth of Tangion, Suliel of Calien, Tangien of Sodolion, Tangiel of Tangien, Hevien of Calion, Ondia of Tangien, Aelien of Calion, Mireya of Sodolien, Heveya of Tangion, Lisene of Calien, Ondiel of Sodolion, Miria of Tangien, Hevia of Calion, Lisien of Sodolien, Eleya of Tangion, Galeya of Calien, Ondene of Sodolion, Miriel of Tangien, Heviel of Calion, Elia of Sodolien.

**Established names:** 6 country and seat names belong here (5 fit the inventory, 1 adopted as drawn).

### 3.15 Sunhot (`sunhot`)

*Family:* elvish, daughter of elder. *Status:* living. *Spoken by:* Sunhot elves of the Lands of Light; Western Sanctuaries; Eastern Isles. *Script:* Noon-script, round open letters like rising suns, written with a wide brush in bright mineral inks on silk and on the doors of sanctuaries.

The warm, open speech of the Sunhot elves. It turns th into s, k into h and a final n or m into ng, so that names ring: Hengyang, Poyang. Two dialects exist, Western Sanctuary and Eastern Isle.

| Sound | |
| --- | --- |
| Consonants | p t k h b d g s m n ng l y w v |
| Vowels | a e i o u; diphthongs ai ya ye yu ia |
| Syllable and endings | (C)V(C), open syllables favoured; closing sounds: n ng l s |
| Stress | last syllable |
| Written form | ng is one sound and may close a word. y is a glide. r is written l between vowels. |
| Rules | names end in -ng -n -a -i -e; no th, no ae; words are short and bright |
| Signature | ng, ya, yu, l for r between vowels, ends -a -i -ng |

**Building names.** Order: head-mod; join: space. Noun first, quality second, as separate words (Yeni Alang, "High Valley"). Single-word names take a bare root.

| Suffix kind | Forms (weight: meaning) |
| --- | --- |
| settlement | *ang* (4: place); *ya* (3: little place); *lia* (2: sanctuary); *in* (2: house of) |
| region | *ang* (3: lands); *ia* (3: country); *dor* (1: land (chart)) |
| river | *ya* (3: river) |
| sea | *ang* (2: water) |
| mountain | *yang* (3: peak) |

**Personal names.**

| Part | Pieces |
| --- | --- |
| Men: stems | soy, heng, poy, yung, wen, tang, hel, el, ig, lov, sal, ran, sen |
| Men: endings | an, ang, in, ya, a, i, e |
| Women: stems | elva, iga, soya, lovi, sali, hela, wena, tala |
| Women: endings | a, e, ia, yi, ai |
| Houses (of) | eldoga, hengya, poya, yungi, elva, iga, soya + ang, in |
| Patronymic | None. |
| Epithets | luni "the white"; aila "the bright"; hailo "the dark"; elda "the old"; mala "the great" |
| Titles | ruler_m: Speaker; ruler_f: Speaker; radiant: Radiant Speaker; warden: Sanctuary-Warden; keeper: Keeper |
| Notes | The largest realm is led by a Radiant Speaker, chosen by the sanctuaries. Elders are never called king. |

**Dictionary** (80 elements): river *nail*, mountain *orni*, lake *ila*, valley *yeni*, forest *lais*, ford *sarn*, hill *sang*, coast *faing*, island *uelo*, bridge *rana*, wall *dreng*, fort *holing*, hall *ales*, high *alang*, low *neli*, old *elda*, new *nes*, red *sula* ir, white *luni*, dark *nula*, bright *aila*, holy *ail*, king *dunei*, queen *dunia* ir, stone *tor*, iron *angi*, gold *olar*, sea *sala* ir, harbour *ossi*, city *helung*, town *mana*, field *yala*, road *fela*, gate *vaing* ir, tower *tumeli* ir, spring *lisi*, marsh *mola*, ice *ryni* ir, fire *haila*, tree *gala*, wind *yail*, sun *hyal*, moon *nyel*, star *isel*, grave *umbi*, north *boles*, south *nesa*, east *esa*, west *yesa*, great *mala*, small *tilu* ir, black *hailo* ir, green *yavi*, grey *gaili*, deep *dola*, wolf *yula*, bear *bala*, eagle *soli*, horse *roha*, fish *isha*, raven *hola*, water *uis*, cliff *hrani*, pass *sola*, house *hami*, lord *hailu* ir, warden *gelis*, silver *syl*, salt *salo* ir, ash *esha*, blood *rudi*, bone *oss*, bell *bela*, lamp *lumi*, oak *dala*, leaf *rus*, song *lyra*, dawn *aula*, mist *mish*, root *ruang*.

**30 place names:** Yen Alang, Nail Luni, Ales Aila, Sang Ail, Sarn Elda, Il Dola, Hyalang, Nyelya, Iselalia, Aulang, Lyrin, Rusya, Salang, Nail Mish, Oss Olar, Lis Syl, Galalia, Yailya, Torang, Solin, Holingalia, Ranya, Dalin, Vaing Alang, Faing Boles, Yen Yavi, Sang Sula, Laisang, Tumel Bela, Ales Lumi.

**30 personal names:** Soan of Hengyin, Ranya of Yungang, Love of Igin, Senin of Eldogang, Sali of Poyin, Soang of Elvang, Rana of Soyin, Hengan of Hengyang, Senya of Yungin, Sale of Igang, Hengang of Eldogin, Poan of Poyang, Poang of Elvin, Yungan of Soyang, Yungang of Hengyin, Salia of Yungang, Hele of Igin, Elva of Eldogang, Lovai of Poyin, Wena of Elvang, Salyi of Soyin, Helia of Hengyang, Elve of Yungin, Wene of Igang, Iga of Eldogin, Tala of Poyang, Ige of Elvin, Tale of Soyang, Soya of Hengyin, Soye of Yungang.

**Established names:** 88 country and seat names belong here (62 fit the inventory, 26 adopted as drawn).

### 3.16 Orran (`orran`)

*Family:* isolate. *Status:* living. *Spoken by:* Redbark tribes; the Veiled Folk. *Script:* Knot-script, strings of knots and notched sticks; the forest tribes write nothing on paper and bar it.

The speech of the kingdoms Aen defeated: a language older than Ainic that survives in the Bloody Forest, among the Cursed Lands and under the river-names of the Middle Lands. It has no known relative.

| Sound | |
| --- | --- |
| Consonants | p b t d k g tz z kh m n l r rr |
| Vowels | a e i o u; diphthongs ai |
| Syllable and endings | (C)V(C)(C); closing sounds: k r z n l tz |
| Stress | last syllable |
| Written form | tz and kh are single sounds. rr is a rolled r. No f, no v, no h by itself, no w, no y. |
| Rules | no f v w y; names end in -ar -ek -oz -ik -ur -an -ez -tz; rr and tz are the marks of the language |
| Signature | tz, kh, rr, ends in -oz -ek -ik |

**Building names.** Order: head-mod; join: space. The adjective follows the noun. A place is marked by -ar. The plural is -ak.

| Suffix kind | Forms (weight: meaning) |
| --- | --- |
| settlement | *ak* (5: the many); *oz* (3: little); *in* (2: place) |
| region | *ak* (4: the many); *ar* (3: country) |
| river | *ek* (3: water) |
| sea | *ek* (2: water) |
| mountain | *ur* (2: mount) |

**Personal names.**

| Part | Pieces |
| --- | --- |
| Men: stems | tzor, kharr, ukh, mok, ozk, belz, iztar, kel, tzeg, orr, nekh, gorr |
| Men: endings | ek, ar, oz, ik, ur, an, ez |
| Women: stems | izkal, pelz, tzali, amaz, nekhi, olz, kozi, ulaz |
| Women: endings | a, e, i, ua, ar |
| Houses (clan) | urnak, tzamor, kaztir, moketz, kozik, ilur + ak, ar |
| Patronymic | en. Mother-line: Given name + mother's name + en. Orran descent runs through mothers. |
| Epithets | orrun "the old"; kuzor "the dark"; rokhez "the red"; pelz "the pale" |
| Titles | ruler_m: Chief; ruler_f: Mother-Chief; elder: Elder |
| Notes | Chiefs are women or men chosen by the clan-mothers. |

**Dictionary** (49 elements): river *zerrak*, mountain *korrak*, lake *lamitz*, valley *azbel*, forest *otzar*, ford *pazar*, hill *kotz*, coast *ekhatz*, island *ozkal*, bridge *tzarob*, wall *tzurk*, fort *kharazt*, hall *ozelk*, high *ankhaz*, low *muzer*, old *orrun*, new *nekhi*, red *rokhez*, white *pelz*, dark *kuzor*, bright *tzalir*, holy *amazk*, king *ukhar*, queen *ukharin*, stone *tzorr*, iron *tzegor*, gold *khazil*, sea *omak*, tree *bezk*, wolf *urnak*, bear *tzamor*, eagle *kaztir*, horse *moketz*, raven *kozik*, water *ilur*, thorn *tzikor*, moss *ulaz*, root *etzur*, ash *ozkur*, blood *gurmez*, bone *tzizk*, fire *zakhor*, grave *mokhaz*, north *kharr*, south *tzega*, east *izkor*, west *oktzer*, lord *ozkar*, warden *kharkur*.

**30 place names:** Otzarak, Zerrakoz, Kotzak, Urnakak, Tzamorin, Tzorrak, Otzar Rokhez, Zerrak Kuzor, Kotz Orrun, Kotz Kozik, Bezkak, Ulazin, Tzikorak, Zerrak Gurmez, Kotz Tzizk, Mokhazin, Otzar Kharr, Kotz Ankhaz, Lamitzoz, Tzarobak, Ozkurin, Etzurak, Kharaztoz, Tzurkak, Tzegorin, Kotz Khazil, Moketzak, Kotz Kaztir, Omakek, Bezk Amazk.

**30 personal names:** Tzorek Urnakak, Kharrar Tzamorar, Ukhoz Kaztirak, Mokik Moketzar, Ozkur Kozikak, Belzan Ilurar, Iztarez Urnakar, Kelek Tzamorak, Tzegar Kaztirar, Orroz Moketzak, Nekhik Kozikar, Gorrur Ilurak, Ukhan Urnakak, Mokez Tzamorar, Kharrek Kaztirak, Izkala Urnakak, Pelze Tzamorar, Tzala Kaztirak, Amazi Moketzar, Nekhua Kozikak, Olza Ilurar, Koze Urnakar, Ulazi Tzamorak, Izkalar Kaztirar, Pelzua Moketzak, Tzale Kozikar, Amaza Ilurak, Nekhi Urnakak, Olze Tzamorar, Kozua Kaztirak.

**Established names:** 4 country and seat names belong here (2 fit the inventory, 2 adopted as drawn).

### 3.17 Yonic (`yonic`)

*Family:* isolate. *Status:* living. *Spoken by:* Southern Islanders. *Script:* Wave-tally, rows of short strokes and loops cut on bamboo-like canes and shell; a Common hand is taught in the harbour towns.

The island speech of the Islands of the South: open syllables, y and w glides, and a final n or ng. Names are repeated for the plural (Yongyong "many Yong"). Its sailors share a trade vocabulary with the eastern Sunhot isles.

| Sound | |
| --- | --- |
| Consonants | p t k b d g m n ng l r s h w y j |
| Vowels | a e i o u; diphthongs ua ao ei |
| Syllable and endings | CV(n/ng); closing sounds: n ng |
| Stress | last syllable |
| Written form | ng is one sound. y and w are glides. Every syllable has one vowel. |
| Rules | open syllables, closing only on n or ng; no consonant clusters; plural by repeating the word |
| Signature | ng, yo, yu, wa, ends in -n -ng -a -o |

**Building names.** Order: head-mod; join: space. The head comes first and the quality second, as separate words (Kamu Ronga, "Red Isle"). A single island takes a bare root. Plural by repetition.

| Suffix kind | Forms (weight: meaning) |
| --- | --- |
| settlement | *ng* (3: place); *wan* (3: harbour); *yo* (2: little) |
| region | *ang* (4: islands); *yan* (2: country) |
| river | *an* (3: water) |
| sea | *un* (2: sea) |
| mountain | *ka* (2: peak) |

**Personal names.**

| Part | Pieces |
| --- | --- |
| Men: stems | tik, how, an, lua, ver, nuo, wan, yon, pan, kea, tao, rum |
| Men: endings | a, an, ang, o, i, ui, yo |
| Women: stems | yu, mai, ngiru, lani, sua, wiku, pilu, nuwa |
| Women: endings | a, i, yan, ua, ana |
| Houses (none) | none |
| Patronymic | nau. Given + nau + the name of the island or the elder who raised the child. |
| Epithets | pilu "the white"; kolan "the dark"; yoru "the great"; piku "the small"; omiyo "the old" |
| Titles | ruler_m: Elder; ruler_f: Elder; speaker: Speaker; chief: Chief |
| Notes | An elder speaks for a harbour and its fields. The title does not separate the sexes. |

**Dictionary** (57 elements): river *yuwan*, mountain *yongka*, lake *mawi*, valley *wunyo*, forest *nawa*, ford *tari*, hill *bukon*, coast *pesang*, island *kamu*, bridge *jeng*, wall *hata*, fort *sengwa*, hall *rumi*, high *yaso*, low *bawu*, old *omiyo*, new *miyo*, red *ronga*, white *pilu*, dark *kolan*, bright *sinya*, holy *suyo*, king *aran*, queen *arin*, stone *tonka*, iron *wengo*, gold *ringa*, sea *lawun*, harbour *pelo*, town *wakan*, city *yongwa*, field *tuwa*, road *liwang*, gate *tobin*, tower *hunyo*, spring *yuku*, marsh *nuwa*, tree *tamo*, sun *ngari*, moon *ngiru*, star *tipa*, wind *hawin*, rain *yawo*, reef *riwa*, fish *wiku*, turtle *wanu*, palm *paluo*, boat *kenu*, shell *kora*, sand *suna*, north *tahe*, south *nipa*, east *ahiyo*, west *monu*, great *yoru*, small *piku*, deep *lamo*.

**30 place names:** Kamu Ronga, Kamu Pilu, Pelo Kolan, Riwa Ronga, Paluong, Sunawan, Korang, Wanuwan, Wikung, Yawoyyo, Ngariwan, Ngirung, Tipayyo, Bukonang, Yuwanawan, Mawiyyo, Nawang, Kenuwan, Tamoyyo, Hawinang, Tonkayyo, Ringawan, Wakanang, Tuwayyo, Yukuwan, Kamu Yoru, Kamu Piku, Riwa Pilu, Pelo Sinya, Bukon Suyo.

**30 personal names:** Tika, Howang, Anang, Luayo, Veri, Nuoyui, Wanyo, Yona, Panan, Keayang, Taoyo, Rumi, Tikui, Howyo, Ana, Yuya, Maiyi, Ngiruyyan, Laniyua, Suayana, Wikuya, Piluyi, Nuwayyan, Yuyua, Maiyana, Ngiruya, Laniyi, Suayyan, Wikuyua, Piluyana.

**Established names:** 38 country and seat names belong here (29 fit the inventory, 9 adopted as drawn).

### 3.18 Orcish (`orcish`)

*Family:* isolate. *Status:* living. *Spoken by:* Volcano Clans; Iron Clans; Wild Holds; Sea Orcs. *Script:* Scar-marks, straight scratches cut with a blade into bone, iron and leather; a tally of kills and debts; clerks of the larger holds use the Common hand.

The war-speech of the orc holds: closed syllables, hard stops and the sounds gh, kh, zg and zh. Holds differ: the Volcano Clans of Goldoroth speak slow and deep, the Iron Clans clipped and fast, the Wild Holds with many loan-words. A Horde Cant of mixed words is used between holds and in armies.

| Sound | |
| --- | --- |
| Consonants | b d g gh k kh m n r s sh t z zg zh l w |
| Vowels | a o u i; diphthongs ou |
| Syllable and endings | (C)(C)V(C)(C); closing sounds: g k r z gh sh th rk rg zg lk |
| Stress | first syllable |
| Written form | gh and kh are throat sounds; zg and zh are single sounds; there is no e. |
| Rules | no e at all; names end in a consonant: -ag -ash -uth -gor -ak -ok -ug -esk; a name of one or two syllables |
| Signature | gh, zg, kh, no e, ends in a consonant |

**Building names.** Order: mod-head; join: closed. No article. Plural by -ash. Compounds are closed and stress the first part.

| Suffix kind | Forms (weight: meaning) |
| --- | --- |
| settlement | *durg* (4: hold); *gor* (3: high place); *uk* (3: place); *esh* (2: camp); *oth* (2: great place (chart form)) |
| region | *oroth* (3: great land); *gor* (3: high land); *ash* (2: the clans of) |
| river | *agh* (3: water) |
| sea | *agh* (2: water) |
| mountain | *ak* (3: mount) |

**Personal names.**

| Part | Pieces |
| --- | --- |
| Men: stems | gor, bred, sung, brit, bord, dresk, dul, grim, zug, ghor, skar, urg, rukh, karg |
| Men: endings | duth, ag, ash, gor, uk, ok, ug, esk |
| Women: stems | ghul, zura, brak, nagh, ruk, bol |
| Women: endings | a, ga, ka, esh |
| Houses (clan) | krum, zhag, urg, ghash, brak, skarg, gruzg + gul, ak |
| Patronymic | ug. Mother-line is counted: Given + ug + the mother's name is a boast, not a rule. |
| Epithets | ghor "the dark"; mogh "the great"; snag "the small"; rukh "the red"; grum "the old"; blar "the pale" |
| Titles | ruler_m: Warking; ruler_f: Warqueen; chief: Chief; warchief: Warchief; shaman: Fire-Speaker |
| Notes | A chief holds his hold until a stronger challenger breaks him in the ring. The Warking of Goldoroth is acclaimed by the clan chiefs. |

**Dictionary** (51 elements): river *zargh*, mountain *gorak*, lake *dulg*, valley *ghul*, forest *skrag*, ford *ratz*, hill *dumb*, coast *grask*, island *urzg*, bridge *bragh*, wall *zurk*, fort *durg*, hall *ogh*, high *gor*, low *nug*, old *grum*, new *zik*, red *rukh*, white *blar*, dark *ghor*, bright *zhal*, holy *ogrim*, king *karg*, queen *karga*, stone *grod*, iron *durk*, gold *gruzg*, forge *brak*, fire *ghash*, ash *skurm*, blood *ruk*, bone *gnash*, skull *krum*, war *bazg*, clan *gul*, pit *urg*, smoke *ghum*, volcano *ghashurg*, tusk *zhag*, wolf *wurgh*, boar *grunt*, raven *krah*, night *nagh*, sword *skarg*, chain *ghrim*, gate *durgol*, black *ghur*, great *mogh*, small *snag*, south *surz*, north *nurg*.

**30 place names:** Ghurdurg, Durkdurg, Rukhdumbgor, Skurmdurg, Ghashgor, Krumuk, Gnashesh, Rukzargh, Zhaggor, Ghumuk, Ghashurgoth, Bazgdurg, Urgesh, Brakgor, Wurghuk, Gruntdurg, Krahuk, Naghgor, Skargdurg, Ghrimesh, Grodgor, Gruzgoth, Gordurg, Ghorzargh, Grumdurg, Guldurg, Ghurgorak, Surzdumb, Nurgoth, Moghratz.

**30 personal names:** Gorduth Zhagak, Rukhug Ghashgul, Kargok Skargak, Gorag Krumgul, Rukhesk Urgak, Bredduth Brakgul, Kargug Gruzgak, Bredag Zhaggul, Sungduth Ghashak, Sungag Skarggul, Britduth Krumak, Britag Urggul, Bordduth Brakak, Bordag Gruzggul, Dreskduth Zhagak, Zuresh Ghashgul, Brakka Skargak, Ghula Krumgul, Bolesh Urgak, Naghga Brakgul, Ruka Gruzgak, Brakesh Zhaggul, Ghulga Ghashak, Naghka Skarggul, Zura Krumak, Rukga Urggul, Ghulka Brakak, Bola Gruzggul, Naghesh Zhagak, Zuraga Ghashgul.

**Established names:** 42 country and seat names belong here (20 fit the inventory, 22 adopted as drawn). Proposed readings: **Goldoroth**: Chart form gold + dor + oth "high": the high gold-land. The orcs' own name is Gruzgoroth (P).

### 3.19 Goblin Cant (`goblin`)

*Family:* orcish, daughter of orcish. *Status:* living. *Spoken by:* Goblin Warrens (a minor people of some orc holds). *Script:* Scratch-tally, quick scratches on tunnel walls, with arrows for direction; nothing is ever written to be kept.

The quick cant of the goblin warrens: a high, clipped speech of short words, doubled k and t, and many words for tunnels, traps and light. Goblins of different warrens understand each other; orcs mostly do not try.

| Sound | |
| --- | --- |
| Consonants | b d g k kk p r s sk sn t tt z w l |
| Vowels | i e u a; diphthongs ik |
| Syllable and endings | CVC, short; closing sounds: k t x p b |
| Stress | first syllable |
| Written form | kk and tt are doubled for sharpness. i is the favoured vowel. |
| Rules | one or two syllables; names end in -ik -it -ix -kit -ik; i and k carry the tongue |
| Signature | ik, it, ix, kk, sk- |

**Building names.** Order: mod-head; join: closed. Plural by -s in Cant (a loan from the Common Speech).

| Suffix kind | Forms (weight: meaning) |
| --- | --- |
| settlement | *ik* (4: burrow); *it* (3: nest); *ix* (2: hole); *kit* (2: little place) |
| region | *ik* (3: warrens) |
| river | *ik* (2: trickle) |
| sea | *ik* (1: pool) |
| mountain | *it* (2: bump) |

**Personal names.**

| Part | Pieces |
| --- | --- |
| Men: stems | snik, rik, zit, skrit, pip, nub, krit, blik, dwib, plick |
| Men: endings | it, ik, ix, kit, ip |
| Women: stems | snik, zig, pip, rit, glim, nip |
| Women: endings | a, ka, kit, ix |
| Houses (none) | none |
| Patronymic | None; goblins know their warren, not their parents. |
| Epithets | glit "the bright"; dusk "the dark"; grib "the old"; nip "the new" |
| Titles | ruler_m: Big Snik; ruler_f: Big Snik; trapper: Trapper |
| Notes | A warren obeys its loudest and cleverest. |

**Dictionary** (41 elements): river *snik*, mountain *krit*, lake *blip*, valley *zit*, forest *skrit*, ford *plick*, hill *nub*, coast *skrib*, island *blot*, bridge *zwick*, wall *krick*, fort *burrick*, hall *zig*, high *upit*, low *dwib*, old *grib*, new *nip*, red *rik*, white *blik*, dark *dusk*, bright *glit*, holy *glint*, king *snikbak*, queen *snikkit*, stone *rit*, iron *klink*, gold *glimmit*, tunnel *burrik*, trap *snarit*, knife *skiv*, rat *skrat*, bat *flik*, mushroom *spurk*, rope *twik*, lamp *glim*, pit *dip*, gate *hatik*, fire *burnik*, water *drik*, tree *stik*, night *duskik*.

**30 place names:** Skratik, Spurkit, Burrikix, Snaritkit, Flikik, Skivit, Twikik, Glimix, Dipkit, Duskburrik, Rikspurk, Gribsnarit, Glitglim, Dwibdip, Ritik, Klinkit, Glimmitik, Upitnub, Snikzig, Nipburrik, Blikkrick, Flikzig, Skratburrik, Duskikik, Burnikdip, Drikit, Stikix, Duskhatik, Dwibzig, Snikbakik.

**30 personal names:** Snikit, Nubip, Plickit, Blikkit, Dwibix, Snikik, Plickik, Rikit, Blikip, Glimit, Dwibkit, Rikik, Glimik, Pipit, Pipik, Zigix, Pipkit, Snika, Nipix, Ritka, Glima, Pipix, Snikka, Ritkit, Ziga, Glimka, Snikkit, Nipa, Ritix, Zigka.

**Established names:** 0 country and seat names belong here (0 fit the inventory, 0 adopted as drawn).

### 3.20 Trollish (`trollish`)

*Family:* isolate. *Status:* living. *Spoken by:* Troll Forest tribes. *Script:* Stone-heaps, trolls write nothing; they pile stones in patterns at tribe borders.

The slow speech of the troll tribes: few words, long vowels and heavy closed syllables. Trolls name things for their weight. A name is one or two beats and is said low.

| Sound | |
| --- | --- |
| Consonants | b g m n r t d k w l |
| Vowels | u o a oo uu; diphthongs none |
| Syllable and endings | CV(C)(C), one or two syllables; closing sounds: m n g k rr mm gg |
| Stress | last syllable |
| Written form | Long vowels are doubled. Doubled consonants are held. |
| Rules | no i, no e; names end in -um -og -ug -ok -oom -ur; a name never has more than two syllables |
| Signature | oo, uu, um, og, no i, no e |

**Building names.** Order: mod-head; join: closed. Plural by repeating the last syllable (Grumum "many Grum").

| Suffix kind | Forms (weight: meaning) |
| --- | --- |
| settlement | *um* (4: heap); *og* (3: den); *ug* (3: place); *oom* (2: big place) |
| region | *um* (3: the many); *oom* (2: great) |
| river | *og* (2: water) |
| sea | *og* (1: water) |
| mountain | *um* (3: heap) |

**Personal names.**

| Part | Pieces |
| --- | --- |
| Men: stems | grum, bor, dun, ug, moog, tum, rok, gunn, groo, bruk |
| Men: endings | um, og, ug, ok, oom, ur |
| Women: stems | baar, gloo, muu, nuun, woo |
| Women: endings | a, oo, ga, ma |
| Houses (none) | none |
| Patronymic | None. |
| Epithets | groom "the old"; mogg "the dark"; torr "the high"; dum "the low" |
| Titles | ruler_m: Eldest; ruler_f: Eldest |
| Notes | The oldest troll who has not been beaten leads the tribe. |

**Dictionary** (42 elements): river *wumm*, mountain *brum*, lake *bolm*, valley *dun*, forest *groot*, ford *tok*, hill *tum*, coast *brak*, island *moog*, bridge *tuut*, wall *rok*, fort *gunn*, hall *boom*, high *torr*, low *dum*, old *groom*, new *nuun*, red *rug*, white *bleg*, dark *mogg*, bright *shon*, holy *ooma*, king *baaru*, queen *baara*, stone *ruk*, iron *dung*, gold *glor*, tree *oot*, root *rutt*, moss *mum*, mud *glob*, bog *bogg*, bone *gnum*, rock *rokk*, cave *hull*, swamp *murg*, oak *oott*, bear *urrum*, toad *blorp*, hunger *gurm*, night *nogg*, thunder *rumm*.

**30 place names:** Boggum, Murgog, Rokkug, Hullum, Globog, Mumug, Oottum, Ruttog, Blorpug, Urrumum, Rummog, Gurmug, Noggum, Rukoom, Groommurg, Moggbogg, Torrrokk, Dumdun, Rugglob, Blegrokk, Dumbogg, Grootum, Wummog, Tumug, Gnumum, Dungog, Tuutug, Rokum, Bolmog, Baarug.

**30 personal names:** Grumum, Groog, Rokoom, Brukum, Gunnok, Grumog, Groug, Rokur, Borum, Brukog, Gunnoom, Borog, Dunum, Dunog, Ugum, Muoo, Baara, Nuuna, Glooma, Wooma, Muuga, Baaroo, Nuunoo, Gloa, Woa, Muuma, Baarga, Nuunga, Glooo, Wooo.

**Established names:** 2 country and seat names belong here (0 fit the inventory, 2 adopted as drawn).

### 3.21 Giants' Speech (`gigantic`)

*Family:* isolate. *Status:* living. *Spoken by:* Hiloron hill-giants; Titanos ice-giants. *Script:* Cairn-tally, single great strokes scratched on standing stones; each stone carries one word.

The slow, deep speech of the giants: long vowels, r, n and m, and words that take a breath to say. Hiloron's hill-giants and Titanos's ice-giants speak two dialects that differ in their vowels and in the Titanos love of cold words.

| Sound | |
| --- | --- |
| Consonants | b d g h m n r t l s p |
| Vowels | a e i o u aa oo uu; diphthongs au ae |
| Syllable and endings | (C)V(C), usually three or more syllables; closing sounds: n m r |
| Stress | second syllable |
| Written form | Long vowels are doubled. There is no sharp sound: no k, no z, no x. |
| Rules | no k, no z; names end in -on -os -un -ar -oron -um; three or four syllables are normal for a place |
| Signature | oro, uun, ron, no k, long vowels |

**Building names.** Order: mod-head; join: closed. The Titanos dialect shortens final -un to -u and prefers cold words. Hiloron keeps -un.

| Suffix kind | Forms (weight: meaning) |
| --- | --- |
| settlement | *on* (4: hall); *os* (3: seat); *un* (3: great place); *ar* (2: place) |
| region | *oron* (4: giant's land); *on* (3: land) |
| river | *uun* (2: water) |
| sea | *an* (2: water) |
| mountain | *ar* (3: peak) |

**Personal names.**

| Part | Pieces |
| --- | --- |
| Men: stems | oron, hilor, tiran, maru, dorun, bruun, gorun, huum, ulmar, nivar |
| Men: endings | as, on, os, un, ar, um |
| Women: stems | aura, nuumo, marana, tiran, oronar |
| Women: endings | a, ara, ia, ena |
| Houses (none) | none |
| Patronymic | None; a giant gives his steps instead. |
| Epithets | urmaar "the old"; morun "the dark"; tiran "the white"; aurun "the bright"; hum "the low" |
| Titles | ruler_m: High Chief; ruler_f: High Chief; frost: Frost-King |
| Notes | Giants live long and name late: a child is called "Small" for forty years. |

**Dictionary** (42 elements): river *maruun*, mountain *orunar*, lake *nuumo*, valley *ulmar*, forest *hoorun*, ford *dorun*, hill *hilor*, coast *tanuum*, island *oroon*, bridge *tarmon*, wall *bruun*, fort *gorun*, hall *ooloram*, high *orn*, low *hum*, old *urmaar*, new *neru*, red *rhuun*, white *tiran*, dark *morun*, bright *aurun*, holy *oruun*, king *oronar*, queen *oronara*, stone *groon*, iron *dunor*, gold *aurum*, giant *oron*, ice *tiruun*, snow *nivar*, sky *oraun*, thunder *bronduun*, sleep *hunum*, step *daron*, throne *torunal*, sea *maran*, fire *pyrun*, tree *tarun*, wind *aeron*, sun *helun*, moon *selun*, star *astar*.

**30 place names:** Ornooloram, Urmaarogroon, Tiranorunar, Oraunos, Nivarar, Tiruunun, Bronduunon, Hunumar, Daronos, Torunalon, Maranun, Pyrunohilor, Tarunos, Aeronar, Helunon, Selunos, Astarun, Humulmar, Morunonuumo, Aurunomaruun, Groonon, Dunoros, Aurumun, Hoorunon, Hilorar, Bruunos, Gorunon, Tarmonar, Dorunos, Tanuumun.

**30 personal names:** Oronas, Ulmaron, Gorunar, Nivaras, Huumun, Oronon, Ulmaros, Gorunum, Hiloras, Nivaron, Huumar, Hiloron, Tiranas, Tiranon, Maras, Maranara, Aura, Tirana, Nuumena, Oronarena, Marania, Aurara, Tiranara, Nuuma, Oronara, Maranena, Auria, Tirania, Nuumara, Oronarara.

**Established names:** 4 country and seat names belong here (3 fit the inventory, 1 adopted as drawn). Proposed readings: **Hiloron**: Aenoran hil "hill" + Giants' oron "giant": the giants' hill. **Titanos**: Giants' Speech tiran "white, cold" with the Titanos plural -os.

### 3.22 Yeti Speech (`yetic`)

*Family:* isolate. *Status:* living. *Spoken by:* Yeti Lands clans. *Script:* Hum-marks, none in the human sense: clan marks scratched on ice and a counting of pebbles; men write yeti words in the Common hand.

The sung speech of the yeti: soft h and m, long u and a, and calls that rise and fall. Yeti hum their names as much as say them.

| Sound | |
| --- | --- |
| Consonants | h hh m n g gh r l y w s |
| Vowels | u a o i uu aa; diphthongs au ow |
| Syllable and endings | (C)V(C); closing sounds: m n l h gh |
| Stress | long vowel |
| Written form | hh is a breath. gh is soft, in the throat. Doubled vowels are held. |
| Rules | no p, no t, no k, no b, no d; names end in -hal -um -hu -ar -uum -am; every name has an h or an m |
| Signature | hh, mh, uu, no stops, hal, hu |

**Building names.** Order: mod-head; join: closed. Plural by lengthening the vowel.

| Suffix kind | Forms (weight: meaning) |
| --- | --- |
| settlement | *hu* (3: den); *al* (3: cave); *um* (3: place); *uu* (2: high place) |
| region | *hu* (3: country); *uum* (2: the great) |
| river | *a* (2: water) |
| sea | *uum* (1: water) |
| mountain | *hi* (3: peak) |

**Personal names.**

| Part | Pieces |
| --- | --- |
| Men: stems | gru, hum, hal, ghor, umh, nahl, ruug, mhor, gar, huu |
| Men: endings | hal, um, hu, ar, uum, am |
| Women: stems | huuma, nuhi, humha, yala, maho |
| Women: endings | a, i, ya, mu |
| Houses (none) | none |
| Patronymic | None; a yeti is known by the song of his clan. |
| Epithets | huhal "the old"; mhor "the dark"; hiyu "the white"; yala "the bright" |
| Titles | ruler_m: Eldest; ruler_f: Eldest |
| Notes | The eldest sings the clan's names at the winter gathering. |

**Dictionary** (42 elements): river *huuma*, mountain *garhu*, lake *nahl*, valley *umha*, forest *hurru*, ford *lamh*, hill *ghum*, coast *haru*, island *mumo*, bridge *raum*, wall *hhor*, fort *garmu*, hall *ulhu*, high *ghaa*, low *uum*, old *huhal*, new *nimu*, red *rhum*, white *hiyu*, dark *mhor*, bright *yala*, holy *huuyu*, king *ruugh*, queen *humha*, stone *ghor*, iron *sharm*, gold *yallu*, snow *nuhi*, ice *hiim*, wind *hhuu*, cave *umbhu*, fur *maho*, herd *gharu*, hunt *rawa*, song *huumma*, peak *garhi*, glacier *hiimar*, storm *rhaaw*, moon *lumhu*, star *yalan*, warm *mhaa*, great *ghuum*.

**30 place names:** Nuhihu, Hiimal, Hhuum, Umbhuhu, Mahal, Gharum, Rawuu, Huummahu, Garhal, Hiimarum, Rhaawuhu, Lumhal, Yalanum, Mhaumbhu, Hiyugarhi, Huhalumbhu, Ghaagarhi, Mhorumbhu, Yalanahl, Uumumha, Ghoruhu, Huumal, Hurrum, Ghumuhu, Hiimugarhu, Ghuumuhiimar, Nuhumha, Hiyunahl, Ghaalamh, Uumughum.

**30 personal names:** Gruhal, Garum, Ruuguum, Huuhal, Mhorar, Grum, Garuhu, Ruugam, Humuhal, Huum, Mhoruum, Humum, Haluhal, Halum, Ghoruhal, Humhi, Huuma, Yala, Nuhimu, Mahomu, Humhya, Huumi, Yali, Nuha, Maha, Humhamu, Huumya, Yalya, Nuhi, Mahi.

**Established names:** 2 country and seat names belong here (0 fit the inventory, 2 adopted as drawn).

### 3.23 the Long Speech (`longspeech`)

*Family:* isolate. *Status:* living. *Spoken by:* Kilinti ents. *Script:* Ring-marks, concentric rings carved into the bark of old trees; each ring is a year and a syllable.

The language of the ents: slow, doubled and deep. A word can take a minute to say and a name is a short song. Ents rarely say anything twice, and men learn only a few words of it.

| Sound | |
| --- | --- |
| Consonants | g h l m n r s b d |
| Vowels | a o u e i aa oo; diphthongs ai au |
| Syllable and endings | V(C)CV(C), long; closing sounds: m n r l ll nn rr mm |
| Stress | first syllable |
| Written form | Doubled letters are held a long time. There is no k, no t and no p. |
| Rules | no k, no t, no p; names end in -or -ar -an -um -ell -onn -orum; a place is three or four syllables |
| Signature | ll, nn, rr, oo, no k t p |

**Building names.** Order: mod-head; join: closed. No article. A name is built from two or three roots said slowly.

| Suffix kind | Forms (weight: meaning) |
| --- | --- |
| settlement | *orum* (3: grove); *ell* (3: place); *onn* (3: old place); *an* (2: home) |
| region | *oran* (4: the forest); *orum* (3: grove) |
| river | *ell* (2: water) |
| sea | *um* (1: water) |
| mountain | *onn* (2: height) |

**Personal names.**

| Part | Pieces |
| --- | --- |
| Men: stems | oll, gron, ann, ell, oon, aal, ill, umm, hor, rann |
| Men: endings | or, ar, an, orum, oran, ellu, onnar |
| Women: stems | illu, ennil, aalenn, olla, rannu |
| Women: endings | a, ara, ell, ia |
| Houses (none) | none |
| Patronymic | None; ents name their groves. |
| Epithets | ollolor "the old"; ummor "the dark"; allin "the white"; ommall "the slow" |
| Titles | ruler_m: Eldest; ruler_f: Eldest |
| Notes | The Eldest is the one who has said the fewest words in the year. |

**Dictionary** (42 elements): river *llorumm*, mountain *hromm*, lake *oonallu*, valley *ammaroon*, forest *oolloran*, ford *rannoss*, hill *bornna*, coast *sallamm*, island *ennolo*, bridge *annarell*, wall *mmorun*, fort *hornoll*, hall *oolmarr*, high *aalorr*, low *ummen*, old *ollolor*, new *nillen*, red *rorrun*, white *allin*, dark *ummor*, bright *aillan*, holy *oonallor*, king *oronnar*, queen *oronnara*, stone *gronn*, iron *ellorr*, gold *allumm*, tree *oolla*, root *rannu*, leaf *illun*, sap *ollu*, bark *gronna*, seed *ennil*, moss *mmoss*, rain *llewen*, sun *aalumm*, moon *ellun*, slow *ommall*, long *aallon*, deep *oonnor*, grove *olloren*, dawn *aalenn*.

**30 place names:** Oollorum, Rannell, Illunonn, Ollan, Gronnorum, Ennilell, Mmossonn, Llewenan, Aalummorum, Ellunell, Aalennonn, Ollorenan, Oonnoroolloran, Aallonollorumm, Ommallollorumm, Olloloroolla, Allinoonallu, Ummorolloren, Aillanobornna, Aalorroolmarr, Ummenammaroon, Gronnonn, Llorummell, Oolloranoran, Bornnonn, Oonallan, Rannossell, Ennolorum, Oolloran, Aalennorum.

**30 personal names:** Ollor, Hororum, Illonnar, Rannan, Ummellu, Ollar, Hororan, Gronor, Rannorum, Ummonnar, Gronar, Annor, Annar, Ellor, Ellar, Aalennara, Illa, Olla, Ennilia, Rannia, Aalennell, Illara, Ollara, Ennila, Ranna, Aalennia, Illell, Ollell, Ennilara, Rannara.

**Established names:** 2 country and seat names belong here (1 fit the inventory, 1 adopted as drawn). Proposed readings: **Kilinti**: Long Speech kilin "grove" + -ti, a plural of respect (P).

### 3.24 Infernal (`infernal`)

*Family:* isolate. *Status:* living. *Spoken by:* Netherborn of Demon, Dolon and Nezer. *Script:* Cinder-script, angular sharp glyphs burned into black stone with a hot point; the demons of Dolon also write in salt.

The harsh tongue of the demons of the Nether: z, v, th, kh and rolled rr, with endings in -ath and -azel. It is said to be the old Choral speech of the angels, bent and hardened (the corruption account is proposed, and the angels' own tongue is not written).

| Sound | |
| --- | --- |
| Consonants | b d g z v th kh zh s sh k t r rr n m l |
| Vowels | a e i o u; diphthongs ae ia |
| Syllable and endings | (C)(C)V(C)(C); closing sounds: th k r z l m n |
| Stress | last syllable |
| Written form | kh and zh are single sounds. rr is rolled hard. th is as in "thin". |
| Rules | names end in -ath -azel -ek -ael -uum -ith; z, kh and th are the marks of the tongue; no w |
| Signature | z, kh, zh, rr, ath, azel |

**Building names.** Order: head-mod; join: hyphen. The thing first, the quality after, joined by a hyphen (Vorath-Nazur, "Dark Gate"). A lord is named with his house as a suffix: -ath.

| Suffix kind | Forms (weight: meaning) |
| --- | --- |
| settlement | *ath* (4: seat); *azel* (3: hold); *ek* (3: place); *uum* (1: great) |
| region | *rath* (4: realm); *un* (2: land) |
| river | *ir* (2: water) |
| sea | *ir* (2: water) |
| mountain | *ath* (3: crag) |

**Personal names.**

| Part | Pieces |
| --- | --- |
| Men: stems | haz, mor, nazar, zar, vor, khor, thaz, vel, zeru |
| Men: endings | el, vath, ath, ek, uum, ael, arel |
| Women: stems | naz, vira, zhor, khira, sath |
| Women: endings | ara, a, ia, ith, ael |
| Houses (none) | none |
| Patronymic | None; demons name their pact. |
| Epithets | nazur "the dark"; zarrek "the red"; azur "the high"; kharuum "the old" |
| Titles | ruler_m: Lord; ruler_f: Queen; king: King |
| Notes | A lord of the Nether takes a name of two beats and a pact-name that only the pact knows. |

**Dictionary** (43 elements): river *vazir*, mountain *khorrath*, lake *thazum*, valley *zeruth*, forest *vokh*, ford *ruzek*, hill *khazu*, coast *sathrek*, island *zhoruv*, bridge *vethar*, wall *karrath*, fort *khazel*, hall *ozmath*, high *azur*, low *zeth*, old *kharuum*, new *virek*, red *zarrek*, white *thiel*, dark *nazur*, bright *azel*, holy *sathel*, king *zarkhan*, queen *zarkha*, stone *khraz*, iron *vorrek*, gold *thazir*, fire *ashkar*, ash *vesh*, ember *kherith*, smoke *zhav*, throne *zarath*, gate *vorath*, pact *thezek*, oath *zeruum*, horn *khorv*, wing *avirr*, night *nazrath*, blood *vorrath*, heat *kharsh*, storm *zavrek*, south *surrath*, fall *veluth*.

**30 place names:** Vorath-Nazur, Zarath-Zarrek, Khazel-Nazur, Veshath, Kherithazel, Zhavek, Ashkarath, Khorvazel, Avirrek, Nazrathath, Vazir-Vorrath, Zavrekek, Kharshazel, Thezekath, Zeruumek, Zarathath, Zarath-Azur, Vorath-Kharuum, Vazir-Nazur, Khazu-Zarrek, Vorrekazel, Thazirath, Khrazek, Veluthath, Vorath-Surrath, Khazel-Azel, Vorath-Sathel, Zeruth-Zeth, Vetharazel, Karrathath.

**30 personal names:** Hazel, Velek, Khorarel, Zerath, Thazael, Hazvath, Veluum, Morel, Zerek, Thazarel, Morvath, Nazarel, Nazarvath, Zarel, Zarvath, Khira, Virael, Sathael, Virara, Sathara, Zhorith, Khiria, Vira, Satha, Zhorael, Zhorara, Khirith, Viria, Sathia, Zhora.

**Established names:** 6 country and seat names belong here (5 fit the inventory, 1 adopted as drawn).

## 4. The generator contract

A language-driven generator replaces `buildNames` in `tools/content/modules/names.mjs`. It lives in a new module `tools/content/modules/naming.mjs` and reads `languages.json`, `cultures.json`, `country_cultures.json` and the geography model. Nothing else in the builder invents a name.

### Inputs

```text
NameRequest {
  kind:       'settlement' | 'region' | 'river' | 'lake' | 'sea' | 'strait' | 'mountain' | 'site'
            | 'given_m' | 'given_f' | 'house' | 'ruler_title' | 'epithet'
  entityId:   stable id (state id, victory-point province id, geography feature id, character id)
  cultureId:  key of cultures.json, resolved from the owner at the start, or the nearest culture
  size?:      'hamlet' | 'village' | 'town' | 'city' | 'great_city' | 'capital'   (settlements)
  features?:  geography tags of the place: river, lake, coast, ford, bridge, pass, mine, forest, hill, mountain, island, marsh
  parent?:    the name of the containing entity (a state for its victory points, a house for its members)
  seed:       the build seed
}
```

### Output

```text
Name { text, key, language, dialect, parts, gloss, attempts }
```

`key` is the lowercase letters of `text` with spaces, hyphens and apostrophes removed. `parts` lists the element keys and suffixes used. `gloss` is the English meaning (for tooltips and the Chronicle).

### Algorithm

1. Look up the culture's language and dialect. For a place, apply the **toponym layers** of the region (section 5): a layer picks the language of the name (the current language, a substrate language or an Aenoran chart form).
2. Choose a pattern by weight from the language's `place_patterns[kind]` (defaults in `generator.default_patterns`). A pattern is a string of slots: Q quality, H settlement head, F feature, A animal, M material, N direction, R rank, L land head, W water head, S suffix of the kind, E eponym stem. The slots that need a geographic feature (F, L, W) prefer an element matching the place's `features`.
3. Fill each slot with a random element of the right tag, weighted (core elements x2). A lexical token uses its **bound stem** when something follows it.
4. Compose by the language's `morphology`: order (modifier-head or head-modifier), join (closed, hyphen or space) and junction rules (vowel-vowel, consonant-consonant, link vowel, maximum consonant run).
5. Filter. A candidate is rejected if it has fewer than 4 or more than 18 letters (places), three equal letters in a row, five consonants in a row, a banned substring, a modern whole word, a name equal to an established name, or a letter the language does not draw (language signature, section 6).
6. Check uniqueness against the world registry (below). On a clash, redraw.
7. For a person: draw a given name from `person.male` or `person.female` (stem plus ending, or a bare stem in one draw of eight), then a house name, patronymic or epithet by the language's `house.style`. Titles come from `person.titles`.

### Determinism

Every draw uses `rng("zin-names:" + kind + ":" + entityId)` (the builder's seeded `rng`), re-seeded with `#n` for the nth redraw. Entities are processed in ascending id order within a fixed kind order (regions, states, settlements, waters, mountains, people, houses). The same inputs always give the same names, and adding a state changes only the names of entities after it in the order.

### Uniqueness across the whole world

- One **registry** holds the key of every name in the world, established or generated. It is seeded with the 305 country names, their capitals, the 711 drawn labels, the vault's names (section 7) and the geography model's named features.
- No generated name may equal a registry key. In the same language, a new name must also be at least two edits away from every existing name of five letters or more.
- On a clash the generator redraws up to 24 times with the seed suffixes #1 to #24; then adds one more element or a suffix; then adds an eponym stem for places or a house stem for people; then fails the build, naming the entity.
- Reference run (build aid, 19 October 2026): 24 languages x 250 place names and 250 personal names, drawn in language order against one shared registry, gave 12,000 unique names with no failure. The measured capacity of each language, before redraws run dry, is in the table of section 3; the largest need is Aenoran, Leren, Coldic and the Eastern tongues.

### The banned-name filter

- Substrings from `names.mjs` `BANNED`: rush, klinti, sunhot, edvoid, zol, volgan, afrit, hell, dead, death, devil, demon, god, sex, ass, tit, cum, dick, cock, kill, rape, slut, piss, shit, fuck, nazi. This spec adds: cunt, twat, whore, bitch, fagg, nigg, spic, kike, chink, anus, arse, boob, porn, turd, crap, damn, hitler, satan, jesus, christ, allah, zeus, gandalf, frodo, sauron, mordor.
- Whole words from `generator.modern_blocklist` (about 140 modern first names and everyday words such as Mark, Maria, Sara, taxi, pizza).
- Established names are **exempt** from the substring filter (Titanos contains "tit"; Pornivior contains "porn"; Hellekton contains "hell"). The filter applies to generated names only.
- The **do-not-generate list**: the Golden King, the King of Demons, the administrator of Zol's Mistake, the name of Roka's people, the dwarves, the angels, any New God other than Glernaen. These have no entry in any language.

### Alphabet

Generated names use the letters A to Z and a to z, with an apostrophe or a hyphen between letter groups, and no accents: `^[A-Za-z]+(?:['-][A-Za-z]+)*$`, or two such words separated by a space. This is inside Windows-1252 and inside every font ZIN uses. Long vowels are written by doubling (Noric, Leren, Gigantic, Yetic, Long Speech). The one exception is **Šodolôrō**, an established name: documents keep it, game text writes **Šodolôro**.

### Names of established things that are not generated

| Kind | Rule |
| --- | --- |
| Countries (305) | Kept as drawn; never generated. Native forms appear only in text that wants them |
| Capitals and seats | Only 18 of the 305 capitals are drawn labels. The others were constructed by the politics step from drawn syllables, and the vault says such seat names can be replaced. The generator gives each a language-driven name once the owner approves; until then they stay. The working seats Cocanoor, Notbuton, Nafeher, Furviatlon, Sonargur, Fandanar, Furvior and Postondoroth are used as given |
| Drawn labels (711) | Kept for features the geography model keeps; labels with an uncertain reading are used only if the owner confirms |
| Vault names | Used as given (section 7) |

## 5. Toponym layers: why old places have older names

Real maps carry layers of speech. The generator applies one when it names a place.

| Layer | Meaning | Weight for settlements | Weight for rivers, mountains and forests |
| --- | --- | ---: | ---: |
| Current language | The culture's own speech | 70% | 40% |
| Substrate | An older tongue the land was named in | 5% | 40% |
| Chart form | Aenoran chart endings (*-dor*, *-waith*) given in the First Age | 15% | 10% |
| Holy form | Old Ainic or Galic, for sanctuaries and ruins | 10% | 10% |

| Region | Substrate language | Why |
| --- | --- | --- |
| Middle Lands | Orran (rivers, forests), Old Ainic (holy sites) | The beaten kingdoms of the War of Men; the First Men |
| North Lands | Old Ainic | Early Ainic settlement of the strait |
| Cold Lands | Giants' Speech, Yeti Speech (high places) | Peoples older than the clans |
| West Lands | Orran-like pre-Gunwaithic (not recorded) uses Gunwaithic archaic forms | The settlers met people already there |
| Triton's Islands | Tritonic archaic forms | Seafarers named reefs first |
| Dark Lands | Orcish (mountains, pits), Dondric (forests) | Holds name their own |
| Magical Lands | Elder Elvish forms of Sylvan | The oldest settled land |
| East Lands | Alerhic (rivers), Noric (wells) | River kingdoms and desert tribes |
| Lands of the Sun | Galic (holy places) | Gala and the sanctuaries |
| Dead Lands | Mirolic (coast), Infernal (the Nether), Rite-Tongue (gates) | The north coast, the south, the dead |
| Islands of the South | Yonic archaic forms | Reef names |
| Zol's Mistake | none | No people is recorded |

## 6. Language signatures and the name-leak check

Each language lists a **signature**: letters, groups and endings that mark it (the `sound.signature` array). The check runs on every batch of generated names and is measured per language:

- **Own signature.** At least 55% of the names of a language must carry one of its signature features.
- **Inventory.** A generated name may use only letters that the language's `sound` block draws (its consonants, vowels and diphthongs).
- **Leak markers.** A generated name must not carry a marker that belongs to another language. The markers that no other language uses (measured on the 1,440 samples and 1,800 word-forms of the data):

| Marker | Belongs to | Marker | Belongs to |
| --- | --- | --- | --- |
| tz | Orran | wyn | Gunwaithic |
| zg | Orcish | vik | Leren |
| mh | Yeti Speech | gard | Coldic |
| azel, vath | Infernal | eya | Galic |
| q | Noric and Rite-Tongue | x | Rite-Tongue and Goblin Cant |
| iel | Sylvan and Galic | ien | Galic (one Mirolic exception) |

A name that fails the check is redrawn. A country keeps its drawn name even when the check fails ("adopted as drawn"). Of the 608 country and capital names that belong to a culture in the roster, 464 pass the inventory check of their culture's language and 144 are adopted as drawn (chart forms and loans).

## 7. How the vault's names fit

The vault's names are used exactly as given. This table says which language each belongs to. A language assignment is a proposal and does not explain the name's meaning.

| Name | Kind | Language | Note |
| --- | --- | --- | --- |
| Aen, Ein, Eindil, Afrit, Ainu | Persons, people | Old Ainic | *Eindil* can be read "child of Ein" with the Ainic patronymic -dil [P]. What "Ainu" means stays open [O] |
| Aenor | Realm | Old Ainic or Aenoran | The reading *Aen + -or* is possible; whether Aenor is named for Aen stays open [O] |
| Edran, Harion, Merovan, Sevrin, Aurevan | Persons | Aenoran | Aurevan carries an Ainic royal ending [P] |
| Alleria, Seron, Arelon | Persons | Aenoran (Selen ranger dialect) | |
| Lorien | Person | Galic | |
| Sirael, Tavriel, Vareth | Persons | Sylvan | |
| Taryn | Person | Gunwaithic | |
| Senra | Person | Tritonic | |
| Rovek | Person | Dondric | |
| Avarin | Person | Leren | |
| Brunek | Person | none | The dwarves have no homeland or language [O] |
| Elzon, Volgan, Zol, Horos, Varner, Golbran, Agon, Roka, Ithren, Maerul | Spirits, gods, great beings | **Elder names** | The names of Great Spirits, Lesser Spirits, Old Gods and demons are older than any mortal language. They belong to no language, are kept as given and are never built by the generator |
| Glernaen | New God | Elder names | The only New God named [E] |
| Parim, Selen, Hunhun, Konori, Herez, Asgard | Places | Aenoran | *Parim* "lake-place", *Selen* "forest-dwellers", *Hunhun* "many horses" [P readings] |
| Kilinti | Place | Long Speech | |
| Hiloron | Place | Aenoran with a Giants' Speech word | "the giants' hill" [P] |
| Coldor, Isengard, Windwaith | Places | Coldic | *Coldor* "ice-land", *Isengard* "iron stronghold", *Windwaith* "wind-shore" (chart spelling) [P] |
| Lerendor, Lerenwaith, Sonargur, Eekedor, R'en | Places | Leren | |
| Gunwaith, Girdon, Kradlon, Corogon | Places | Gunwaithic | |
| Goldoroth | Place | Orcish, chart form | The orcs' own form is Gruzgoroth [P] |
| Dondor | Place | Dondric | |
| Mirolon | Place | Mirolic | *mir-ol-on* "lake-watch" [P] |
| Noris, Furvior | Places | Noric | |
| Stabilo, Postondoroth | Places | Stabilic | |
| Alerhia, Miaed | Places | Alerhic | |
| Gala, Sunhot, Elvana, Igara | Places, people | Galic and Sunhot | The relation of Gala and Sunhot stays open [O] |
| Nafeher | Seat | Constructed working name | Replaceable |
| Cocanoor, Notbuton, Sonargur, Fandanar, Furvior, Postondoroth | Seats | Constructed working names | Replaceable [W] |
| Furviatlon, Šodolôrō | Places in Zol's Mistake | none | No language is recorded for Zol's Mistake [O] |
| Mp'E, Yeldenne, Dragon Mountain | Places | Coldic (Mp'E, Yeldenne); none (Dragon Mountain) | |
| The Nether, the Abyss, the Void | Realms | none | Open [O] |
| Dardan | Battle | none | Not placed [O] |


## 8. How every kind of name is produced

The geography model ([05_geography_model.md](../01_map/05_geography_model.md)) already names 44 seas, 32 rivers, 12 lakes, 63 mountain ranges and 86 sites, some from the drawn map and some proposed in the English of the Common Speech. The generator keeps those and names everything else.

| Entity | Language and pattern | Rule |
| --- | --- | --- |
| **State** (1,332) | The state's culture; `region` or `settlement` pattern | A state that holds a drawn settlement takes its name. Otherwise it takes the name of its largest settlement, or a land name (`region` pattern: feature plus suffix, e.g. *Selenar*, a river-name, for a river valley) |
| **Strategic region** (275) | The nearest culture; `region` pattern | Named for its dominant geographic feature from the geography model, in the culture's language (for example the Vale of Aenor becomes a name built with the Aenoran *lan* "field" and *dael* "valley"); sea regions use the drawn or model name |
| **Victory point and settlement** (about 1,500) | The state's culture; `settlement` pattern | By size: a capital uses the language's `site` pattern, a hamlet takes a bare stem plus a small suffix. Settlements on rivers, fords, bridges, mines and passes prefer elements matching the feature (a ford gets *ford*, a pass gets *pass*) |
| **River** | Substrate (Orran, Old Ainic or Elder forms) 40%, current language 40%, chart form 10%, holy form 10%; `river` pattern | The geography model's 32 rivers are kept. Unnamed rivers take a river suffix of the language: Aenoran *-ar* (River Aenar, Selenar, Konorar are the model's own), Leren *-a*, Noric *-aa* |
| **Lake** | Current language; `lake` pattern | The model's lakes are kept. A named lake that is a "Sea" (Ergo Sea, Evian Sea) keeps its drawn name |
| **Mountain, range, hill** | Giants' or Yeti Speech in high Cold Lands ranges; Orcish for volcanoes; otherwise the culture's language; `mountain` pattern | The model's 63 ranges are kept. Volcanoes in orc country take Orcish *ghash* "fire" or *ghashurg* "volcano" |
| **Sea, strait, gulf** | The language of the nearest coast, with chart forms for open ocean; `sea` pattern | The model's 44 seas and 13 straits are kept; the Narrow Strait is the owner's "Narrow Strait" in Common Speech |
| **Pass, ford, bridge, gate** | The culture; `site` pattern | The model's 20 passes are kept; the Grey Ford is proposed [P] |
| **Island** | The culture; `region` pattern with *island* or a bare stem | Islands of Triton's Islands and the Islands of the South use single stems (a one-word name) |
| **Character** | The culture's language; `person` blocks | Given name by sex, then a house name, patronymic or epithet by the language's style |
| **House, dynasty, clan** | `person.house` block | Aenoran, Leren, Coldic, Alerhic and Sylvan take surnames from place stems; Gunwaithic and Orcish take clan names; Noric takes tribe names; Gala, Sunhot and Mirolic use "of X"; Yonic, Troll, Giant, Yeti, Ent and Infernal use none |
| **Ruler title** | `person.titles` | King, Queen, Speaker, Warden and the like in the culture's own word where the data has one; the Common Speech title for text that needs the English |
| **Epithet** | `person.epithets` | About one in four kings and heroes; never for a ruler whose epithet is established |

### Culture-specific rules

- **Hearth-names and use-names.** A character of the Aenoran, Selen, Hunhun, Leren and West cultures has a **use-name** (the given name the world hears) and a **hearth-name** (never printed). The generator draws the use-name only. The hearth-name is not in the game; text may say it exists.
- **Chart forms.** For any people named by Aenor's First Age charts, the country name uses the chart ending (*-dor*, *-waith*) and the people's own name appears only in Chronicle entries and loading tips.
- **Gala and the Sunhot realms** never share a name stem: Gala names use Galic, Sunhot names use Sunhot, so that no text implies kinship.
- **Zol's Mistake** has no language. Settlements there keep drawn names, and host ordinals are numbers.
- **The dead of Volgan** use the Rite-Tongue for offices and gates only.

## 9. Replacing `names.mjs`

| Item | Today | After |
| --- | --- | --- |
| Source of syllables | Labels of the drawn sheets, cut into syllables | The 24 languages of `languages.json` |
| Region flavour | By drawn sheet | By culture (53), then language and dialect |
| Output | `common/names/zin_names.txt` (male, female, surnames and callsigns per tag) | The same file, filled from the languages; plus `docs/design/names_resolved.json` (every state and settlement name with its parts and gloss) for the politics step |
| Uniqueness | Names unique within a pool | Unique across the world (section 4) |
| Blocklist | `BANNED` only | The banned filter of section 4 plus the do-not-generate list |
| Banned names file | `tools/content/data/name_blocklist.json` proposed by the characters spec | Absorbed into the filter; the file lists whole names that must never be produced |

Interface kept: `buildNames(staged, countries, labels)` still returns pools keyed by scan so that `characters.mjs` works unchanged until it is moved to cultures (see [08_world_in_game.md](08_world_in_game.md)). A second export, `resolveName(request)`, answers the `NameRequest` of section 4 for the politics step.

## 10. Acceptance

1. `languages.json` parses; every language has at least 40 elements including the 27 core ones; every sample name obeys the declared rules (recomputed by the build from its recipe).
2. A planted element form with a banned substring or a modern word fails the build.
3. The reference generator, run for 250 places and 250 people per language over one registry, returns no duplicate and no failure.
4. No generated name equals a drawn label, a country name, a capital or a vault name; none is within one edit of a country name of five letters or more.
5. The leak check of section 6 passes for every language.
6. Two builds with the same seed give byte-identical `names_resolved.json`; adding one state changes only the names after it in the order.
7. No file names Zol's administrator, the King of Demons, Roka's people, the dwarves' homeland or any New God other than Glernaen.

## 11. Open questions

All proceed on their proposals.

1. Should the capitals the politics step constructed (287 of 305) be renamed by the generator? **Proposal in use:** yes, once the owner has approved the first 30; the eight working seats stay.
2. Should the Common Speech names of regions (Cold Lands, West Lands) be kept in English in game text and the native names used only in the Chronicle? **Proposal in use:** yes.
3. Are the chart forms (*-dor*, *-waith*) acceptable as the country names the owner drew? **Proposal in use:** yes, as chart forms.
4. Should the Galic and Sunhot name stems remain separate, since their relation is open? **Proposal in use:** yes.
