# The pantheon of Aoaz

**Status:** Draft for the owner's approval. **Date:** 24 October 2026. **Requirements:** R-30 (pantheon), R-32 (faith in play); the calendar (R-31) is [calendar.md](calendar.md), and the new name for Edvoid (Q-10) is [edvoid_name.md](edvoid_name.md).
**Data:** [tools/content/data/world/pantheon.json](../../../tools/content/data/world/pantheon.json), which the builder reads for the month names, the festivals and the faith links.
**Sources read:** the vault (`docs/lore/vault/`: Canon Policy; `01 - Cosmology/*`; `03 - Figures/Glernaen.md`, `Zol.md`, `Volgan.md`, `Afrit.md`, `Afrit the Deliverer.md`, `Aurevan the Deliverer.md`; `05 - Geography/Zols Mistake.md`; `07 - History/*`, chiefly `The Fourth Age of Aoaz.md` section XI and `Fourth Age Chronology.md`; `09 - Development/Open Questions.md`), [knowledge_layers.md](knowledge_layers.md), [magic_and_wizards.md](magic_and_wizards.md) section 3.8, the world bible (`docs/specs/02_lore/05_world_bible.md`, section 4 and the culture entries), the faith data (`tools/content/data/world/cultures.json`, `tools/content/data/cultures_game.json`), the languages (`tools/content/data/world/languages.json`, `docs/specs/02_lore/06_languages.md`), the calendar (`tools/content/lib/calendar.mjs`, `docs/specs/00_foundation/01_start_and_calendar.md`) and `tools/content/data/world/reserved_names.json`.

This is a design document. It states hidden truths so that the builder can keep them out of player text; a line marked sealed or gated is never copied into localisation outside its gate.

## How to read the labels

| Label | Meaning |
| --- | --- |
| **E** | Established by the owner or the vault. |
| **P** | Proposed here, or proposed earlier in the vault and kept; not canon until the owner accepts it. |
| **O** | Open: deliberately left unanswered. |
| *public* | Player text may state it as fact once the owner approves the names. |
| *belief* | Player text states it only as someone's belief, with the believer named in the sentence ([knowledge_layers.md](knowledge_layers.md) rule 2). |
| *disputed* | Player text states it only as rumour or claim. |
| *gated* | True, and shown only behind the story flag named in the register of [knowledge_layers.md](knowledge_layers.md). |
| *sealed* | True in the authorial record and never shown in any form. |

Every god's name, need, symbol, rite, festival and month name below is **P** unless the line says E.

## 0. What is fixed

- Aoaz has **twelve main New Gods** who answer **the twelve needs of mortals**; the twelve months are named after them, one god per month (E, owner, 24 October 2026).
- **Glernaen**, New God of power and wisdom, is the mightiest of the twelve; part of his might resides in Glo (E; the Glo link is gated, E3).
- **Lesser New Gods** exist besides the twelve, have no month, and are stronger than most Great Spirits (E; the comparison is sealed, C27).
- At least some New Gods serve **Zol**, and **Volgan** once served a New God whom he overpowered (E; both sealed, C9 and C11).
- **Afrit** is publicly recognised as a New God at the end of the Third Age, and his cult adds **a feast, not a month** (E); his true order is not decided (O, C15).
- The New Gods restore Eindil through Glo in the last war, and they cannot remain in Aoaz to fight it themselves (E restoration; the reason is the chronicle's proposal).
- The gods are born and trained on a continent the people of Aoaz do not know, and traditions place their dwelling in Lao (W6 sealed; W12 belief, W13 kept mystery). Nothing in this file puts either in public text.
- No being's exact age is stated anywhere (E, owner rule). Dates below are by Age and year, never by a god's years.

## 1. The twelve needs of mortals

People turn to gods for what they cannot secure alone: enough to eat, a roof and a fire, health, weather they cannot command, children and kin, safe travel and fair dealing, protection from harm, justice, work that feeds them, a good death and remembrance, hope against what they cannot know, and strength and counsel for those who must decide for many.
The twelve needs below are that list, ordered by the months (section 2 of [calendar.md](calendar.md) explains the order).

| No. | Need | Kind | What it covers | Why mortals pray for it | God |
| ---: | --- | --- | --- | --- | --- |
| 1 | **Strength and counsel** | social, spiritual | Rightful power, wise rule, good counsel, learning, the reckoning of stores | Someone must decide for the many, and decide well; a wrong decision in deep winter starves a village | Glernaen |
| 2 | **Healing** | personal, practical | Health of body and mind, clean water, care of the sick, mercy at the sickbed | Sickness comes to everyone and most cures are not in mortal hands | Sulethe |
| 3 | **Shelter and the hearth** | practical, personal | A roof, a fire, a lit window, the household and the common people who keep it | Without a house and a fire nobody survives a winter | Lumae |
| 4 | **Fair weather and safe waters** | practical | Rain in its season, rivers that rise and fall as they should, winds and seas that let ships come home | Weather is the power no king commands | Maelwen |
| 5 | **Kin and birth** | personal, social | Children, safe childbirth, marriage, the bond of kin, the increase of flocks | Birth is the most dangerous day of a life, and kin is the only lasting wealth most people have | Vaelei |
| 6 | **Safe roads and fair exchange** | social, practical | Travel, markets, the welcome of strangers, heralds and envoys | No land has everything it needs, and a stranger on the road can be a guest or a thief | Rasthel |
| 7 | **Protection** | social | Walls, watch and defence of the weak; war only to keep the people safe | Raiders, beasts and worse come, and the weak cannot stand alone | Kerun |
| 8 | **Daily bread** | practical | Harvest, grain, the ploughed field, granaries, relief in famine | Hunger is the oldest fear; Aenor remembers centuries of it | Aurlan |
| 9 | **Justice and kept promises** | social | Oaths, contracts, fair measure, boundaries, the settling of debts, judgement | No one can live beside a neighbour whose word means nothing | Ailtal |
| 10 | **Skill and work** | practical, social | Craft, forge and kiln, building, tools, apprenticeship, the dignity of labour | Most people live by their hands, and a skill is a gift that can be lost | Irumas |
| 11 | **A good death and remembrance** | spiritual | Passage, funerals, mourning, the names of the dead kept, the forgotten remembered | Everyone dies; nobody wants to be forgotten, or to leave the dead unquiet | Gaelor |
| 12 | **Hope and fortune** | spiritual, personal | Hope in the dark, luck and lots, the turning of the year, the stars that guide by night | What cannot be known can still be hoped for | Naisa |

**Coverage.** The list holds survival (bread, shelter, healing, weather), security (protection, justice), belonging (kin, the guest on the road), livelihood (skill, exchange), mortality (death and remembrance), uncertainty (hope and fortune) and order (strength and counsel): every reason the world bible's 38 faiths give for their rites falls under at least one need.
**Deliberate overlaps.** Rain belongs to Maelwen who sends it and to Aurlan who receives it; fire to Lumae's hearth and Irumas's forge; the bed of birth and the bed of death to Sulethe with Vaelei and with Gaelor; the stranger to Rasthel on the road and to Lumae at the fire; fair measure to Ailtal who judges it and Rasthel who carries it; wisdom to Glernaen, skill to Irumas.
Each overlap is where two cults share a rite, and where two temples quarrel, so the gods stay distinct by what they ask of the believer: Maelwen is begged, Aurlan is thanked; Lumae's fire is kept, Irumas's is fed.
**What is absent on purpose.** No god of conquest: conquest is not a need of mortals, so the temples teach that a king who prays for it prays to Kerun in vain (P); the cults that worship strength for its own sake worship Volgan, a Great Spirit (E). No separate god of love or beauty: the bond of lovers is Vaelei's marriage and Lumae's hearth. No god of the dead's power: Death itself is Zol's (E), and Gaelor answers only the need for a good passage and a kept name (the vault's own working idea in `Old Gods.md`).

## 2. The twelve at a glance

| Month | God | Need | Chief domains | Symbol (heraldry) | Festival | Clergy |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | **Glernaen** (he) | Strength and counsel | Power, wisdom (E), rightful rule, learning | The Crowned Eye: gold eye beneath a circlet on counsel blue | The Year's Counsel, 1st day | Counsellors |
| 2 | **Sulethe** (she) | Healing | Healing, springs and wells, herb-lore | A white bowl brimming over on spring green | The Drawing of Waters, 14th | Bowl-Bearers |
| 3 | **Lumae** (she) | Shelter and the hearth | Hearth, home, the common people | A gold lamp with one flame on hearth red | The Lamp-Lighting, 1st (the first day of play) | Lamp-Mothers |
| 4 | **Maelwen** (he) | Fair weather and safe waters | Sea, wind, rain, rivers | Three silver wavy bars beneath a cloud on sea green | The Opening of the Waters, 15th | Rain-Priests |
| 5 | **Vaelei** (she) | Kin and birth | Birth, marriage, kinship, sowing | A rose ring with a green shoot rising, on sowing green | The Day of Cradles, 12th | Cradle-Wives |
| 6 | **Rasthel** (he) | Safe roads and fair exchange | Roads, markets, guests, envoys | A gold open gate with a road-staff on road sky | The Stranger's Table, 21st (midsummer) | Guest-Masters |
| 7 | **Kerun** (he) | Protection | Walls, watch, defence | An iron tower on a mount on watch red | The Walking of the Walls, 7th | Watch-Chaplains |
| 8 | **Aurlan** (she) | Daily bread | Harvest, grain, granaries | A gold sheaf under three lines of rain on furrow brown | The Last Sheaf, 31st | Furrow-Priests |
| 9 | **Ailtal** (she) | Justice and kept promises | Oaths, contracts, measure, boundaries | A white standing stone bound with a cord on oath purple | The Day of the White Stone, 15th | Oath-Keepers |
| 10 | **Irumas** (he) | Skill and work | Craft, forge, building | An orange flaming anvil on forge black | The Kindling of the Forges, 1st | Anvil-Priests |
| 11 | **Gaelor** (he) | A good death and remembrance | Passage, mourning, the names of the dead | A furled white-grey sail on mourning grey | The Night of Names, 1st | Name-Readers |
| 12 | **Naisa** (she) | Hope and fortune | Hope, lots, stars, the turning year | A silver six-rayed star on night blue | The Star Vigil, 21st (the longest night) | Star-Watchers |

Every field tincture is a colour and every charge a metal under the heraldry rule (`tools/content/data/world/heraldry.json`, `tincture_rule`); the luminance ratios run from 3.0 (Rasthel) to 12.4 (Naisa), all above the required 2.2. The hex values are in `pantheon.json`.

**Worship common to all twelve (P).** A market town keeps one twelve-house with twelve niches, and the niche of the month's god is uncovered for that month; only great cities raise separate temples to single gods. The calendar-keepers who decide the feast days are the **Reckoners**, an order without a god of its own that serves all twelve. At Parim the **Hall of the Twelve** has twelve bays in a ring, and each month the bay of its god is opened; the Hall of the Twelve and the House of the First Light stand on the same square (P), which is the visible shape of the quarrel in section 7. Temples of the twelve do not teach about the Holy Seven: the Seven appear only in the oldest manuscripts, where most readers take them for fable (C2 belief).

## 3. The twelve gods

### 3.1 Glernaen, month 1

| Field | Content |
| --- | --- |
| Names | **Glernaen** (E). Liturgical: **Glernaen Masthel**, "Glernaen the Great Lord" (*mas* great, *thel* lord). The name keeps the onset *gl-*, which Old Ainic does not allow, so it is an irregular sacred word that every daughter tongue inherits almost unchanged: Leren *Glerneen*, Mirolic *Glernian*, Dondric *Glernoan*. Epithets of other tongues: Coldic *Mawryarl*, Gunwaithic *Yarl-Mawr*, Noric *Beq-Raab*, Sylvan *Marahael*, Galic *Eal Mara*, Sunhot *Hailu Mala* ("the Great Lord" in each). |
| Need and domains | Strength and counsel. Power and wisdom (E); rightful rule, counsel, learning and the reckoning of stores (P). |
| Symbol and colours | The Crowned Eye: an open eye beneath a circlet, crown gold `#d9b443` on counsel blue `#1f3a78`. |
| Worship | His bay is the first in the Hall of the Twelve at Parim, where the **First Counsellor** sits. Every royal court keeps a counsel-chamber under his eye. **Counsellors** swear to give counsel unasked and unpaid, and the universities of the learned art open their terms in his month ([magic_and_wizards.md](magic_and_wizards.md) 3.6). Offerings: a tally of the year's stores, a book, the first coin struck in a reign. A ruler is crowned with the oath "to rule with strength and counsel". |
| Festival | **The Year's Counsel**, 1 Glernaen. Rulers sit with their councils at dawn, the stores are counted aloud and the year's laws are read; in a village the elders count the granary in front of everyone. |
| Bonds | Ailtal (power under law), Naisa (the year ends with her and begins with him), Kerun (the strong arm that answers to counsel); all eleven in section 4. |
| Place in the hierarchy | A New God, the mightiest of the twelve (E). The temples teach that his need stands under all the others, because without strength and counsel no other need is met (P). After him the temples hold the eleven equal (P). |
| History | Before 1A the kings of the Age of Kingdoms claimed many patrons, and no single cult of counsel existed (P). In the First Age Aen's court set his door first in the Reckoning of the Twelve (P). The Second Age's learning in farming, famine prevention and plague treatment (E) is credited in temple tradition to his Counsellors (P). The Necromancer's court abolished the Year's Counsel in the Third Age (P), and the first restored king revived it in 4A 1 (P). In 4A 1748 the Golden King keeps the feast and ignores its counsel (P). In the chronicle's proposed account of 4A 1757 Glernaen speaks last at the gathering that restores Eindil (P; the event is gated). |
| Strongest where, and why | Aenor and every court that claims Aen's line, because a crown needs his sanction; the Winter Crown of the Cold Lands, which swears at the Frost-Hall of Fandanar because the north honours strength that keeps a hall alive through winter; the priest-kings of the River Temples. |
| Favoured and shunned | Favoured by the Lake Aenorans, the Isle Houses of Asgard, the Winter-Crown folk and the River-Kings. Shunned by the Wild Holds, who distrust every priest, and by the Red Lands Tribunes, who distrust a god of kings. |
| Belief and truth | *Belief:* Counsellors say he sees every counsel given in his name and blinds liars. *Belief:* pilgrims say he dwells in Lao (W12). *Truth (E):* he is the mightiest of the twelve; part of his might resides in Glo (gated, E3). *Truth (P, chronicle):* he cannot remain in Aoaz to act. *Open:* whether he answers temple rites at all ([magic_and_wizards.md](magic_and_wizards.md) question 11). |

### 3.2 Sulethe, month 2

| Field | Content |
| --- | --- |
| Names | **Sulethe** (*sul* spring + *-ethe*, "she of the springs"). Liturgical: **Sulethe Ailsul**, "of the White Spring". Common Speech *Sulede*; Leren *Sules*; Mirolic *Hulele*; Dondric *Zuled*. Epithets: Coldic *Kvitvelk*, Gunwaithic *Welce-Gwit*, Noric *Ber-Leb*, Stabilic *Beriolebo*, Alerhic *Lebiaberis*, Sylvan *Lunilisiel*, Galic *Lise Lunien*, Sunhot *Lisi Luni* ("the White Spring"). |
| Need and domains | Healing. Warm springs and wells, herb-lore, the sickbed, clean water, mercy to the sick. |
| Symbol and colours | A white bowl brimming over, spring white `#e9eee8` on spring green `#2f6b4a`. |
| Worship | **Spring-houses** stand over wells and warm springs with a sick-hall beside them. **Bowl-Bearers**, women and men, swear never to refuse the sick. Offerings: herbs, clean linen, a cup of water poured back into the spring. The sick drink from a common bowl; when a fever leaves a house a bowl is broken on the threshold. |
| Festival | **The Drawing of Waters**, 14 Sulethe. Every household draws water from the spring-house at dawn and washes its doorposts, and the Bowl-Bearers bless the town wells. It falls in the hunger gap of late winter, the month of fevers. |
| Bonds | Gaelor (they meet at every deathbed: she sits at the head, he waits at the foot), Vaelei (together at every birth), Kerun (she binds what his wars break, and her Bowl-Bearers resent him). |
| Place in the hierarchy | One of the twelve; second in the temple order of the months only. |
| History | In the plagues of the Second Age (E) her spring-houses multiplied and the learned houses studied plague there (P). Late in that age the hidden Houses of Refuge gave medicine without naming their giver (vault P), and her houses could not match them. Under the Necromancer many spring-houses stayed open because the sick still had to be tended (P). In the Fourth Age the healers of the Houses of the First Light serve most Aenoran towns, and the spring-houses dwindle to the countryside, the Lake and the fords (P). |
| Strongest where, and why | The Lake country of Aenor, the Girdon fords, the Lake Road cities and the Southern Islands: lands of springs and old spring-houses, where the Houses of the First Light came late. |
| Favoured and shunned | Favoured by the Lake Aenorans, the Girdon Wardens, the Lake Road Cities and the Southern Islanders. The grave hosts of Volgan shun her. |
| Belief and truth | *Belief:* Bowl-Bearers say the warm springs are her breath and a fever breaks when she passes. *Truth (gated, A8):* the healing worked by the Houses of the First Light flows from the Deliverer's power, not from her. *Open:* whether she answers her own rites. |

### 3.3 Lumae, month 3

| Field | Content |
| --- | --- |
| Names | **Lumae** (*lum* lamp + *-ae*, "she of the lamp"). Liturgical: **Lumae Ardlum**, "of the Hearth-Lamp". Common Speech *Lumae*; in Leren and Dondric she is simply *Lum*, which is also their word for lamp; Mirolic *Lumia*. Epithets: Coldic *Huzlykt*, Gunwaithic *Lykta-Chus*, Noric *Ner-Bet*, Stabilic *Nerobeto*, Alerhic *Betianeria*, Galic *Lumien Ame*, Sunhot *Lumi Hami* ("the House-Lamp"), Sylvan *Lumi* ("the Lamp"). |
| Need and domains | Shelter and the hearth. Home and household, the common people, the lit window, the guest at the fire. |
| Symbol and colours | A lit lamp with one flame, lamp gold `#e2b24a` on hearth red `#7a2e1e`. |
| Worship | She has no temples outside the Hall of the Twelve: the hearth is her altar. The **Lamp-Mother**, the eldest woman of each house, keeps her rites; in towns the Lamp-Mothers' halls take in widows and the houseless. Offerings: the first oil of the year, a crust laid in the hearth, a lamp in the window for those out at night. No lamp is let go out in a house where someone is ill or travelling. |
| Festival | **The Lamp-Lighting**, 1 Lumae, the first day of play. On the last night of Sulethe's month every fire in the village is put out; at dawn the Lamp-Mother brings fire from the common hearth and relights each house. The Winter Hearth's Relighting and the Thaw Lamp of the Lamp and the Furrow are this rite under their own names. In Aenor the Houses of the First Light carry the fire from their own lamps, and many townsfolk think the day the Deliverer's (section 7). |
| Bonds | Aurlan (the Lamp and the Furrow, the best-loved pair of the folk faith), Vaelei (sisters of the house), Irumas (the old quarrel over who owns fire). |
| Place in the hierarchy | One of the twelve. In the chronicle's proposed gathering of 4A 1757 the god who bears "a lamp that had never gone out" and speaks of the common people is Lumae (P). |
| History | The hearth cult is older than any temple (P). In the Second Age, the age of raids and plagues, a lamp in the window became the sign of a house that would take in the fleeing (P). When temples closed in the Third Age the Lamp-Lighting survived as a household rite (P). In the Fourth Age the Houses of the First Light took up the lamp as their own emblem (E that believers keep a lamp for the stranger; P that it was hers first), and by 4A 1748 the confusion is general in Aenor. |
| Strongest where, and why | Everywhere the Lamp and the Furrow is kept, most of all where winters are long: the Middle Lands, the Wall marches, the Free Crowns of the North and the Cold Lands. |
| Favoured and shunned | Favoured by the Lake Aenorans, the March-Folk, the Wall-Folk, the Free Crowns and the Winter-Crown folk. The goblin warrens keep a lamp and no god. The grave hosts shun her. |
| Belief and truth | *Belief:* village tales say she walks the roads on the longest night and knocks at houses that keep no lamp lit. *Truth (gated, A3):* the Houses of the First Light, whose lamp the faithful take for hers, answer to Afrit. |

### 3.4 Maelwen, month 4

| Field | Content |
| --- | --- |
| Names | **Maelwen** (*mael* sea + *wen* wind, "sea-wind"). Liturgical: **Maelwen Dolmael**, "of the Deep Sea". Common Speech *Maelven*; Leren *Meelven*; Mirolic *Mialven*; Dondric *Moalwen*. Epithets: Coldic *Margvind*, Gunwaithic *Wind-Marg*, Noric *Ruuh-Naam*, Stabilic *Ruhonamo*, Sylvan *Thalavael*, Galic *Weal Talo*, Sunhot *Yail Sala* ("the Sea-Wind"); the river kingdoms call him Alerhic *Chariamoi*, "the High Water". |
| Need and domains | Fair weather and safe waters. Sea, wind, rain, rivers and floods, weather, seafarers. |
| Symbol and colours | Three wavy bars beneath a cloud, spray silver `#d5dde0` on sea green `#245f6e`. |
| Worship | Rain-priests keep the rain-stones inland; sea-chapels stand on the skerries; the river kingdoms keep flood-courts below their temples. The Leren litany-singers sing to him at each tide. Offerings: salt, the first catch, a ship's first coil of rope. No ship is launched without his name; the Leren will not call the storm that takes their ships a god, and say Maelwen grieves it too. |
| Festival | **The Opening of the Waters**, 15 Maelwen. The seas are declared open for the year and the first ships go out; inland the rain-stones are washed and the fords marked. |
| Bonds | Aurlan (the tense pair: his rain feeds her field and his flood drowns it), Glernaen (sailors' tales make him the only god who refuses counsel), Naisa (pilots steer by her star across his sea), Gaelor (the drowned). |
| Place in the hierarchy | One of the twelve; the temple tellings make him the most wilful. |
| History | The colonists' fleets of the First Age sailed to the North Lands and the West under his name (P). The Treaty of the Narrow Strait of 4A 512 was sworn on the Singing Quay at Sonargur under Maelwen and Ailtal (P treaty, P rite). |
| Strongest where, and why | The Leren coasts, Triton's Islands, the island houses of Asgard, the river kingdoms of the East and the desert of Noris, where the Well-Oath honours the New Gods in the rain they send: every people whose living hangs on water. |
| Favoured and shunned | Favoured by the Leren, the Chart-Islanders, the Isle Houses, the River-Kings, the Noris riders and the Windwaith seafarers. The Storm Court bargains with storm spirits and keeps him at arm's length. |
| Belief and truth | *Belief:* inland folk say storms are his anger; the Leren say the storm is something else. *Truth:* the still seas of the north coast, which sailors fear more than storms, are not his (a sign of Zol's influence, C6, seen only as fishermen's tales). Whether Volgan's storms are Volgan's own working stays open (V22). |

### 3.5 Vaelei, month 5

| Field | Content |
| --- | --- |
| Names | **Vaelei** (*vael* green + *-ei*, "the green one"). Liturgical: **Vaelei Naivael**, "of the New Green". Common Speech *Vaelei*; Leren *Veelei*; Mirolic *Vialei*; Dondric *Voalui*. Epithets: Coldic *Grewntawra*, Gunwaithic *Tawra-Grewn*, Noric *Saari-Yaar*, Stabilic *Prinzayaro*, Alerhic *Yariasaris*, Sylvan *Yavieldunai*, Galic *Dunia Iave*, Sunhot *Dunia Yavi* ("the Green Queen"). |
| Need and domains | Kin and birth. Children, marriage, kinship, the increase of flocks, the sowing. |
| Symbol and colours | A ring from which a green shoot rises, cradle rose `#ecc6cc` on sowing green `#3f7a2c`. |
| Worship | Birth-houses stand at the edge of villages. **Cradle-Wives**, midwife-priestesses, attend births, bless marriages and once wrote the birth rolls. Offerings: the first sown seed, a lock of a newborn's hair, a ring. A newborn is carried round the hearth (Lumae's) and then shown to the field (Aurlan's); a marriage is bound with a green cord. |
| Festival | **The Day of Cradles**, 12 Vaelei. The children born since the last Day are named before the village, and the brides of the year sow the first row of the common field. |
| Bonds | Gaelor (the cradle and the grave; a folk tale says they were wed and parted), Lumae (sisters of the house), Kerun (the levy takes the sons she gave), Naisa (a child's lot is cast in her name). |
| Place in the hierarchy | One of the twelve. |
| History | The cord-mothers of the Orran tied births into their cords before her cult reached them (P, world bible). In the First Age her Cradle-Wives wrote the first birth rolls of Aen's houses (P). In the Fourth Age the confessors of the Houses of the First Light write the birth rolls (world bible faith data), and the Cradle-Wives have lost their oldest office (P): whoever holds the rolls knows every house (A3, gated). |
| Strongest where, and why | The marches, the Free Crowns, whose crowns pass by marriage, the Red Lands, the Southern Islands and the Lake: peoples who count wealth in kin. |
| Favoured and shunned | Favoured by the March-Folk, the Free Crowns of the North, the Red Lands Tribunes, the Southern Islanders and the Lake Aenorans. Shunned by the grave hosts and the Netherborn. |
| Belief and truth | *Belief:* Cradle-Wives say she knows every child's name before it is born. *Belief:* the Veiled and the Redbark say the cords were tied before any god was named. *Open:* which is older. |

### 3.6 Rasthel, month 6

| Field | Content |
| --- | --- |
| Names | **Rasthel** (*ras* road + *thel* lord, "road-lord"). Liturgical: **Rasthel Ethwes**, "Rasthel East-and-West" (*eth* east, *wes* west). Common Speech *Rastel*; Leren *Rassel*; Mirolic *Rahlel*; Dondric *Rasdel*. Epithets: Coldic *Roddyarl*, Gunwaithic *Yarl-Rodd*, Noric *Beq-Tirak*, Alerhic *Tirakbekia*, Sylvan *Ferahael*, Galic *Eal Fero*, Sunhot *Hailu Fela* ("the Road-Lord"); Stabilo calls him *Becodwaro*, "Lord of the Gate". |
| Need and domains | Safe roads and fair exchange. Travel, markets, hospitality to strangers, heralds and envoys, pilgrims. |
| Symbol and colours | An open gate with a road-staff, road gold `#e6c06a` on road sky `#3d6f9e`. |
| Worship | Road-shrines stand at crossroads, fords and milestones; **Guest-Masters** keep the guest-halls of market towns. Offerings: a coin at the milestone, salt and bread for a stranger. Heralds and envoys swear by him, and a guest under a roof that honours him may not be harmed (P). |
| Festival | **The Stranger's Table**, 21 Rasthel, at midsummer when the roads are driest. Every household sets one place for a stranger, tolls are waived for the day in Aenor and Stabilo, and caravans are blessed. |
| Bonds | Kerun (they share the gate: Rasthel opens it, Kerun shuts it), Ailtal (fair measure), Irumas (merchant against guild), Lumae (the guest who comes to the fire). |
| Place in the hierarchy | One of the twelve. |
| History | His road-shrines mark the routes of Aen's first charts (P). In the Second Age many were walled into refuges against raiders (P). In the Fourth Age the Concord's trade and the Lake Road prosper under him, and the Zilin pilgrims walk his roads to the Deliverer's hostels (P). |
| Strongest where, and why | Stabilo's caravan cities, the Lake Road, the steppe and the pilgrim roads: peoples who live by moving. |
| Favoured and shunned | Favoured by the Caravan Princes, the Lake Road Cities, the Steppe Riders and the Zilin Pilgrim-Folk. |
| Belief and truth | *Belief:* Guest-Masters say he walks the roads as a stranger, and whoever turns a guest away turns him away. *Open:* everything about his acts. |

### 3.7 Kerun, month 7

| Field | Content |
| --- | --- |
| Names | **Kerun** (*ker* iron + *-un* mount, "the iron mount"). Liturgical: **Kerun Gera**, "Kerun the Warden". Common Speech and Leren *Kerun*; Mirolic and Dondric *Gerun*. Epithets: Coldic *Isenbraenn*, Gunwaithic *Brenn-Isen*, Noric *Khadar-Barz*, Stabilic *Cadarbarzo*, Alerhic *Barzischadar*, Sylvan *Angielorniel*, Galic *Orne Ange*, Sunhot *Orni Angi* ("the Iron Mountain"). |
| Need and domains | Protection. Walls and the watch, defence of the weak, the war that keeps the people safe, soldiers' oaths, beacons. |
| Symbol and colours | A tower on a mount, iron `#c9ccd1` on watch red `#8e2620`. |
| Worship | Every tower keeps a watch-shrine; the **Watch-Chaplains** of the Stone Vigil serve him. Offerings: a whetstone, a night's watch kept in his name. Soldiers swear "to stand, not to take". |
| Festival | **The Walking of the Walls**, 7 Kerun. The walls are walked, the beacons tested and the year's fallen named at the gate. His month is the season of standing grain, when raiders come and the fields must be guarded; the temples hold a war begun in his month for conquest to be cursed (P). |
| Bonds | Ailtal (no just war without her stone; the most argued bond of the twelve), Irumas (who arms him), Gaelor (who reads the names of his dead), Rasthel (the shared gate). |
| Place in the hierarchy | One of the twelve. There is no god of conquest among them (P). |
| History | The soldiers of the Grand Alliance swore by Kerun before Dardan (P; the battle is E, its place O). The Pale March held through the Third Age, and the Stone Vigil keeps faith with its dead (world bible). Since the Wall Accord of 4A 96 (P) the watch-chaplains have served the towers of the range. In the chronicle's proposed gathering of 4A 1757 the voice that speaks of "wars prevented" is his (P). |
| Strongest where, and why | The Wall marches, Mirolon, the Pass-Warden elves and the Buldor companies: frontier peoples who live by the watch. |
| Favoured and shunned | Favoured by the Wall-Folk, the March-Folk, the Mirolon wardens, the Pass-Wardens and the Buldor companies. Conquerors pray to him in vain, the folk say. |
| Belief and truth | *Belief:* watch-chaplains say a wall hallowed to him cannot be taken by the dead. *Truth (E):* Zol's dead cannot be ended by ordinary arms; Glo's magic and the New Gods' power end them. *Open:* what a hallowed wall does. |

### 3.8 Aurlan, month 8

| Field | Content |
| --- | --- |
| Names | **Aurlan** (*aur* gold + *lan* field, "golden field"). Liturgical: **Aurlan Waelan**, "of the Watered Field". Common Speech *Aurlan*; Leren *Ourlan*; Mirolic and Dondric *Orlan*. Epithets: Coldic *Goldfaaenn*, Gunwaithic *Faenn-Gold*, Noric *Maar-Zaah*, Stabilic *Marozaho*, Alerhic *Zahismarae*, Sylvan *Olaryara*, Galic *Iaro Olar*, Sunhot *Yala Olar* ("the Golden Field"). |
| Need and domains | Daily bread. Harvest, grain and bread, the ploughed field, the rain upon it, granaries, relief in famine. |
| Symbol and colours | A sheaf under three falling lines of rain, sheaf gold `#e0bd45` on furrow brown `#5e4228`. |
| Worship | The village keeps a rain-stone in the field and the town a granary-shrine; **Furrow-Priests** serve both. Offerings: the last sheaf, a tithe of grain to the common granary. The first furrow is ploughed to a song, and bread is broken at every village oath. |
| Festival | **The Last Sheaf**, which the folk call Harvest Home, 31 Aurlan. The last sheaf is bound into a figure and kept until the sowing. |
| Bonds | Lumae (the Lamp and the Furrow), Maelwen (rain and flood), Glernaen (who counts what she gives), Ailtal (the tithe and the fair share). |
| Place in the hierarchy | One of the twelve. In the chronicle's proposed gathering of 4A 1757 the god who "wore the likeness of rain over ploughed fields" and remembered Aenor's hunger is Aurlan (P). |
| History | In the famines of the Second Age (E) the common granaries were hallowed to her (P), and the hidden Houses of Refuge gave grain whose giver was never named (vault P). In the Fourth Age the Deliverer's faithful give a tenth of the first harvest to the Houses of the First Light (world bible); that tithe was Aurlan's (P). |
| Strongest where, and why | The farming heartlands: the Lake, the marches, the river kingdoms, the Goodin sunfolk and Girdon. |
| Favoured and shunned | Favoured by the Lake Aenorans, the March-Folk, the River-Kings, the Goodin Sunfolk and the Girdon Wardens. |
| Belief and truth | *Belief:* the furrow-priests say a field ploughed without the song bears less. *Open:* everything about her acts. |

### 3.9 Ailtal, month 9

| Field | Content |
| --- | --- |
| Names | **Ailtal** (*ail* white + *tal* stone, "white stone"). Liturgical: **Ailtal Salara**, "the Salt-Queen" (*sal* salt + *ara* queen), because an oath is sworn with salt. Common Speech *Ailtal*; Leren *Eiltal*; Mirolic *Ailtal*; Dondric *Ualdal*. Epithets: Coldic *Kvitstaenn*, Gunwaithic *Stenn-Gwit*, Noric *Kaar-Leb*, Stabilic *Cairolebo*, Alerhic *Lebiakaris*, Galic *Tor Lunien*, Sunhot *Tor Luni* ("the White Stone"); the Sylvan elves say *Aeltor*, "the Holy Stone". |
| Need and domains | Justice and kept promises. Oaths, contracts, fair measure, boundaries, the settling of debts. |
| Symbol and colours | A white standing stone bound with a cord, stone white `#f0efe9` on oath purple `#4f3a72`. |
| Worship | Every court and market keeps an oath-stone; **Oath-Keepers** witness oaths and keep the stone. The Lawspeakers of the West and the Weighers of Stabilo honour her under their own titles. Offerings: salt laid on the stone, a broken tally of a paid debt. An oath is sworn with salt on the tongue; a broken oath is cut into the stone's cord. |
| Festival | **The Day of the White Stone**, 15 Ailtal. After the harvest debts are settled and rents paid, boundaries are walked, the stone is bound with a new cord and the courts open for the year. |
| Bonds | Kerun (restraint), Glernaen (some temples call her his conscience), Rasthel (fair measure), Irumas (the contracts of apprentices), Naisa (lots decide what the stone cannot). |
| Place in the hierarchy | One of the twelve. In the chronicle's proposed gathering of 4A 1757 the voice that speaks of "promises kept" is hers (P). |
| History | The standing stones of the West are older than Aenor's temples, and the clans took Ailtal's name for what they already kept (P). Aen's law codes were sworn on her stone (P). The Truce of the Grey Ford is kept on her Truce-Day, and the Bridge of the Three Oaths (4A 1750, P episode) is sworn under her (P). |
| Strongest where, and why | The West Lands (Gunwaith's Oath-Ring, Girdon), Stabilo's Hall of Scales, the Leren strait with its written code of the strait and the salt, the Buldor companies: peoples who live by contract and oath. |
| Favoured and shunned | Favoured by the Gunwaith Clans, the Girdon Wardens, the Caravan Princes, the Buldor Companies and the Leren. The Netherborn, who bind by pact, shun her. |
| Belief and truth | *Belief:* Oath-Keepers say a false oath on her stone shows a crack by morning. *Open:* everything about her acts. |

### 3.10 Irumas, month 10

| Field | Content |
| --- | --- |
| Names | **Irumas** (*iru* fire + the epithet *mas* great, "Fire the Great"). Liturgical: **Irumas Kerard**, "of the Forge" (*ker* iron + *ard* hearth). Common Speech, Leren and Dondric *Irumas*; Mirolic *Irumah*. Epithets: Coldic *Mawrtan*, Gunwaithic *Tanu-Mawr*, Noric *Nuur-Raab*, Stabilic *Nurorabo*, Alerhic *Rhabisnuria*, Sylvan *Marahaera*, Galic *Cearo Mara*, Sunhot *Haila Mala* ("the Great Fire"). |
| Need and domains | Skill and work. Craft, forge and kiln, building, tools, apprenticeship, honest work. |
| Symbol and colours | A flaming anvil, forge orange `#e8913e` on forge black `#2a2624`. |
| Worship | Every forge keeps an anvil-shrine; the guild-halls of Kradlon and Corogon honour him under a craft aspect for each guild (the Guild Halls faith); **Anvil-Priests** serve the towns. Offerings: the first nail of a new house, a broken tool given back to the fire. Apprentices are bound before his anvil, and a master's mark is registered in his hall. |
| Festival | **The Kindling of the Forges**, 1 Irumas. When the harvest is in the forges and kilns are relit for the winter's work and the year's apprentices are bound. |
| Bonds | Kerun (smith and soldier), Lumae (the quarrel over fire), Rasthel (guild against merchant), Ailtal (contracts). |
| Place in the hierarchy | One of the twelve. |
| History | The Second Age's long recovery and its discoveries (E) raised the first guilds under him (P). In the Fourth Age the Western guilds swear their guild books in his halls, and Dondor's Hearth-Iron honours the New Gods as the forges that make iron (world bible). |
| Strongest where, and why | The West (Kradlon, Corogon), Dondor and the kilns of the Red Lands: peoples who live by craft. |
| Favoured and shunned | Favoured by the Western Guildmen, the Dondor Brutes and the Red Lands Tribunes. |
| Belief and truth | *Belief:* the guilds say a tool made on his feast never fails its first master. *Open:* everything about his acts. |

### 3.11 Gaelor, month 11

| Field | Content |
| --- | --- |
| Names | **Gaelor** (*gael* grey + *-or*, "the grey one"). Liturgical: **Gaelor Dolthol**, "of the Deep Pass" (*dol* deep + *thol* pass). Common Speech *Gaelor*; Leren *Geelor*; Mirolic *Gialor*; Dondric *Goalor*. Epithets: Coldic *Graearyarl*, Gunwaithic *Yarl-Grei*, Noric *Beq-Rem*, Stabilic *Becoremo*, Alerhic *Rhemiabekia*, Galic *Eal Geale*, Sunhot *Hailu Gaili* ("the Grey Lord"); the Sylvan elves say *Gaeliel*, "the Grey". |
| Need and domains | A good death and remembrance. The passage of the dying, funerals and mourning, the names of the dead, the forgotten, rest. |
| Symbol and colours | A furled grey sail, shroud white `#e6e4de` on mourning grey `#5f6266`. |
| Worship | **Name-Readers** keep the rolls of the dead and read them at his feast; the grave-wives of the villages prepare the dead. Offerings: a lamp on the grave, a coin in the hand, salt. The name of the dead is said aloud three times so that it is not lost; the Leren burn their dead on a boat at the ebb with a coin for the harbour (world bible). The temples teach that Gaelor does not rule death, which is not a god's gift to give, but walks with those who pass (P). |
| Festival | **The Night of Names**, 1 Gaelor. At dusk the names of the year's dead are read and a lamp is set on every grave. His month is the slaughter month, when beasts that cannot be fed through winter are killed and the dead are remembered. |
| Bonds | Sulethe (the deathbed), Vaelei (cradle and grave), Kerun (the fallen), Naisa (the dark and the star; Afrit's feast falls between their months, section 7). |
| Place in the hierarchy | One of the twelve. In the chronicle's proposed gathering of 4A 1757 the voice that speaks for "those whom kings had forgotten" is his (P). |
| History | The necromantic orders of the Third Age bound the dead instead of letting them pass; his rites were forbidden in occupied Aenor and the names of the dead were read in secret (P). The faithful of the Deliverer set their feast on the last day of his month at the age's end (P). In the Fourth Age the Stone Vigil reads the Names Wall of the Pale March and the Gala read the dead of Dardan in his month (world bible). |
| Strongest where, and why | The Leren coasts, the Wall marches, the salt-graves of the Dead Lands freeholds, the island houses of Asgard and Gala: peoples who live close to their dead. |
| Favoured and shunned | Favoured by the Leren, the Wall-Folk, the Dead Lands Freeholders, the Isle Houses and the Gala. Reviled by the grave hosts and necromantic orders of Volgan, whose binding of the dead denies passage, and by the Netherborn. |
| Belief and truth | *Belief:* Name-Readers say Gaelor carries the named dead to Lao (W12). *Disputed:* in the north some whisper that the Grey serves the black north; the rumour is false of Gaelor (P, authorial). *Sealed:* a lesser goddess honoured as his handmaid, Gaelkuth, serves Zol (section 6; C9, C10). *Open:* what becomes of souls (C22, W13). |

### 3.12 Naisa, month 12

| Field | Content |
| --- | --- |
| Names | **Naisa** (*nai* new + *isa* star, "new star"). Liturgical: **Naisa Dumlor**, "the Bright-in-Dark" (*dum* dark + *lor* bright). Common Speech *Naize*; Leren *Neis*; Mirolic *Naiha*; Dondric *Nuas*. Epithets: Coldic *Novsterr*, Gunwaithic *Sterr-Now*, Noric *Kook-Nuuv*, Alerhic *Nuviakokia*, Sylvan *Nethisel*, Galic *Isiel Net*, Sunhot *Isel Nes* ("the New Star"); Stabilo says *Neronuvo*, "the New Lamp". |
| Need and domains | Hope and fortune. Luck and lots, the turning of the year, the stars, wayfinding by night. |
| Symbol and colours | A six-rayed star, star silver `#dfe3ec` on night blue `#172040`. |
| Worship | She has no temples. **Star-Watchers** keep vigils on the hill above each town. Offerings: a lamp put out, so that the dark is given to her; a wish tied on a thread. Lots are cast in her name, and a newborn's lot is cast at the Day of Cradles. |
| Festival | **The Star Vigil**, 21 Naisa, the longest night. Every lamp but one is put out; the watchers on the hill wait for the first star and then for dawn, and at dawn the lots for the coming year are cast. Eleven days later the year opens with the Year's Counsel. |
| Bonds | Glernaen (the turning of the year), Gaelor (the dark and the star), Maelwen (pilots), Ailtal (lots where the stone cannot decide). |
| Place in the hierarchy | One of the twelve. |
| History | When Aen's astronomers fixed the year (vault P), the Reckoners took Naisa as the keeper of its turning (P). The Star Vigil grew in the plague years of the Second Age and was kept on hills in secret when gatherings were forbidden in the Third (P). |
| Strongest where, and why | The desert of Noris and its star-readers, the pilots of Triton, the elves of the Long Listening and Gala: peoples who travel or wait by night. |
| Favoured and shunned | Favoured by the Noris riders, the Chart-Islanders, the Council Elves and the Gala. The Gala honour her hope and refuse her lots, because a vision shown too plainly makes men do what it shows (world bible). |
| Belief and truth | *Belief:* Star-Watchers say the first star seen at the vigil shows the year to come. *Open:* everything about her acts; no text makes a lot or a prophecy come true by narration. |

## 4. The sixty-six bonds

Each pair of the twelve, as the temples tell it (P). The tellings are mortal: they make the gods kin, rivals and friends in the way men are, and the authorial truth about how the gods stand to one another is not written beyond their acting together for Eindil (E). Rows are ordered by the first god's month.

| Pair | Bond as the temples tell it |
| --- | --- |
| Glernaen and Sulethe | He taught her the use of herbs; physicians swear by both. |
| Glernaen and Lumae | The hearth is the first kingdom; a king swears to keep every lamp lit, and Counsellors read by her lamp. |
| Glernaen and Maelwen | The weather no counsel rules: sailors' tales make Maelwen the one god who refused Glernaen's counsel. |
| Glernaen and Vaelei | He blesses heirs, she the births; every succession rite calls on both. |
| Glernaen and Rasthel | Lord and herald: Rasthel carries Glernaen's word along the roads. |
| Glernaen and Kerun | The strong arm and the head: no war but by counsel. |
| Glernaen and Aurlan | The steward's bond: the year opens with the reckoning of what she gave. |
| Glernaen and Ailtal | Power under law; some temples call her his conscience, and rulers' oaths name both. |
| Glernaen and Irumas | Glernaen planned the first crown and Irumas made it. |
| Glernaen and Gaelor | Power ends at Gaelor's pass; even kings' names are kept by him. |
| Glernaen and Naisa | He knows what is and she what may be; the year turns between them. |
| Sulethe and Lumae | Sisters of the house: the bowl and the lamp stand together in every sickroom. |
| Sulethe and Maelwen | Her springs are his waters made gentle; floods bring fevers, and her Bowl-Bearers blame him. |
| Sulethe and Vaelei | Together at every birth. |
| Sulethe and Rasthel | Her spring-houses shelter the sick on his roads. |
| Sulethe and Kerun | She binds what his wars break, and does not forgive him for it. |
| Sulethe and Aurlan | Bread is the first medicine: Aurlan's gifts end Sulethe's month of fevers. |
| Sulethe and Ailtal | The healers' oath is sworn on Ailtal's stone. |
| Sulethe and Irumas | He makes her knives and bowls. |
| Sulethe and Gaelor | The hardest bond: she sits at the head of the deathbed and he waits at the foot, and she gives up the dying only when he asks. |
| Sulethe and Naisa | Hope is kept for the sick when cures fail. |
| Lumae and Maelwen | The lamp and the storm: his wind puts lamps out, and her lamps in harbour windows bring his ships home. |
| Lumae and Vaelei | Sisters of the house: a marriage brings a bride to a new hearth. |
| Lumae and Rasthel | The guest: Rasthel's stranger comes to Lumae's fire. |
| Lumae and Kerun | Soldiers carry an ember from home to the watch-fire. |
| Lumae and Aurlan | The Lamp and the Furrow, the best-loved pair of the folk faith. |
| Lumae and Ailtal | Betrothals are promised at the hearth. |
| Lumae and Irumas | Fire divided: her tame flame and his great fire, and an old tale of who owns fire. |
| Lumae and Gaelor | A lamp on every grave on the Night of Names; her lamp lights the way of the dead, the folk say. |
| Lumae and Naisa | The small light and the far light: on the longest night all lamps but one go out. |
| Maelwen and Vaelei | No seed grows without his rain. |
| Maelwen and Rasthel | The road ends at his shore; sea-traders and road-traders pray to both and quarrel over which pays. |
| Maelwen and Kerun | Storms that break fleets save coasts; sailors say Maelwen fought for Aenor once. |
| Maelwen and Aurlan | The tense pair: his rain feeds her field and his flood drowns it, and the River Temples keep both. |
| Maelwen and Ailtal | Sailors say no oath holds at sea, so the Leren swear on the quay, never on deck. |
| Maelwen and Irumas | Water quenches fire; the smith needs both. |
| Maelwen and Gaelor | The drowned: Maelwen gives them up late, and the Leren burn their dead at the ebb under both. |
| Maelwen and Naisa | Pilots steer by her star across his sea. |
| Vaelei and Rasthel | Brides travel his roads to new villages. |
| Vaelei and Kerun | He guards the children, and his levy takes her sons. |
| Vaelei and Aurlan | Field and womb are kin: sowing month and harvest month answer each other. |
| Vaelei and Ailtal | Marriage oaths, inheritance and the law of kin. |
| Vaelei and Irumas | Cradles and looms. |
| Vaelei and Gaelor | The cradle and the grave, two ends of one thread; a folk tale says they were wed and parted. |
| Vaelei and Naisa | A child's lot is cast in Naisa's name on Vaelei's day. |
| Rasthel and Kerun | They share the gate: Rasthel opens it and Kerun shuts it; tolls are their quarrel. |
| Rasthel and Aurlan | The markets after harvest; carts on the roads. |
| Rasthel and Ailtal | Contracts are sworn to Ailtal and carried by Rasthel. |
| Rasthel and Irumas | Trade carries craft; merchant and guild never agree on the price. |
| Rasthel and Gaelor | The last road: a traveller who dies on the road is buried beside it under both. |
| Rasthel and Naisa | The luck of the road. |
| Kerun and Aurlan | He guards the standing grain in his month, and she feeds his levies. |
| Kerun and Ailtal | No just war without her stone: his readiness against her restraint. |
| Kerun and Irumas | Smith and soldier. |
| Kerun and Gaelor | Gaelor reads the names of Kerun's dead; a grim respect. |
| Kerun and Naisa | The lot for the night watch. |
| Aurlan and Ailtal | Tithes and fair shares: her harvest month is followed by the month of settled debts. |
| Aurlan and Irumas | Sickle and plough are his gifts to her. |
| Aurlan and Gaelor | The slaughter month follows the harvest; grain is laid with the dead. |
| Aurlan and Naisa | Seed kept through winter is hope of the next harvest. |
| Ailtal and Irumas | Guild books and apprentices' contracts are sworn on her stone. |
| Ailtal and Gaelor | She judges the living and he never judges; a dead man's debts are forgiven at Gaelor's pass. |
| Ailtal and Naisa | Where the stone cannot decide, lots are cast. |
| Irumas and Gaelor | He carves the grave-markers. |
| Irumas and Naisa | The forge-glow and the star: smiths say both are seen best at night. |
| Gaelor and Naisa | The dark and the star: Gaelor's month ends where Naisa's begins, and the Deliverer's feast stands between them. |

## 5. How the names were built

**Canonical names are Old Ainic.** Old Ainic is the liturgical tongue, kept "for royal names, law, temple rites and the oldest place names" (`06_languages.md` 3.1), so the temples and the Reckoning use Old Ainic names and every language of the game writes them unchanged. Each name is an Old Ainic compound or a stem with a personal ending from the dictionary of `languages.json`; Old Ainic stresses the first syllable, joins compounds closed with the modifier first, allows no doubled letters, and ends every name in a vowel or *l r n s m th*.
**Glernaen** is the exception: its onset *gl-* is not Old Ainic (only stop plus *r* may begin a syllable), so the name is irregular, the kind of old word the language data keep despite the sound laws. That the mightiest god keeps the one name older than the speech of the First Men fits his place; the temples explain nothing about it.

| God | Old Ainic elements | Gloss | Liturgical style | Gloss |
| --- | --- | --- | --- | --- |
| Glernaen | irregular | "the strength that knows" (temple gloss) | Glernaen Masthel | the Great Lord |
| Sulethe | *sul* spring + *-ethe* | she of the springs | Sulethe Ailsul | of the White Spring |
| Lumae | *lum* lamp + *-ae* | she of the lamp | Lumae Ardlum | of the Hearth-Lamp |
| Maelwen | *mael* sea + *wen* wind | sea-wind | Maelwen Dolmael | of the Deep Sea |
| Vaelei | *vael* green + *-ei* | the green one | Vaelei Naivael | of the New Green |
| Rasthel | *ras* road + *thel* lord | road-lord | Rasthel Ethwes | East-and-West |
| Kerun | *ker* iron + *-un* mount | the iron mount | Kerun Gera | the Warden |
| Aurlan | *aur* gold + *lan* field | golden field | Aurlan Waelan | of the Watered Field |
| Ailtal | *ail* white + *tal* stone | white stone | Ailtal Salara | the Salt-Queen |
| Irumas | *iru* fire + *mas* great | Fire the Great | Irumas Kerard | of the Forge |
| Gaelor | *gael* grey + *-or* | the grey one | Gaelor Dolthol | of the Deep Pass |
| Naisa | *nai* new + *isa* star (the run *ii* reduced, since Old Ainic doubles no letter) | new star | Naisa Dumlor | the Bright-in-Dark |

**Daughters of Old Ainic.** The four living Ainic daughters inherit the names through their ordered sound laws (`06_languages.md` section 1): Aenoran *th > t; s > z* and *p t k > b d g* between vowels; *w > v*; final *-a > -e* after a consonant. Leren *th > s; w > v; ae > ee, ai > ei, au > ou*; a final single vowel lost in words of two or more syllables. Mirolic *ae > ia; au > o; th > l; s > h; k > g; w > v*. Dondric *th > d; ae > oa, ai > ua, ei > ui, au > o; p t k > b d g*; initial *s > z*; a final vowel lost in words of two or more syllables. A final diphthong counts as one vowel: Leren and Dondric keep *-ei* and *-ui*, as in Leren *nei* and Dondric *nua* in the dictionary, but lose the long *-ee* and *-oa* of *Lumae*, which leaves *Lum*.
**Other families.** The Boreal, Eastern and Elvish tongues do not descend from Old Ainic, so they name each god by a calque of the same idea, built from their own dictionary with their own word order and join: Coldic, Alerhic and Sylvan put the modifier first and close the compound; Gunwaithic and Noric put the head first with a hyphen; Stabilic puts the head first, closed; Galic and Sunhot put the head first as two words. Where a calque broke a language rule, the idea was changed rather than the rule: Alerhic allows *rh* only at the start of a word, so the river kingdoms call Maelwen *Chariamoi*, "the High Water", not "the sea-wind"; Sylvan turns *t* between vowels into *th*, which would give a name ending in *-thor*, so the Sylvan elves call Ailtal *Aeltor*, "the Holy Stone"; Stabilic's star is the irregular *coco*, so Stabilo calls Naisa *Neronuvo*, "the New Lamp".

| God | Aenoran | Leren | Mirolic | Dondric | Coldic | Gunwaithic | Noric | Stabilic | Alerhic | Sylvan | Galic | Sunhot |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Glernaen | Glernaen | Glerneen | Glernian | Glernoan | Mawryarl | Yarl-Mawr | Beq-Raab | Becorabo | Rhabisbekia | Marahael | Eal Mara | Hailu Mala |
| Sulethe | Sulede | Sules | Hulele | Zuled | Kvitvelk | Welce-Gwit | Ber-Leb | Beriolebo | Lebiaberis | Lunilisiel | Lise Lunien | Lisi Luni |
| Lumae | Lumae | Lum | Lumia | Lum | Huzlykt | Lykta-Chus | Ner-Bet | Nerobeto | Betianeria | Lumi | Lumien Ame | Lumi Hami |
| Maelwen | Maelven | Meelven | Mialven | Moalwen | Margvind | Wind-Marg | Ruuh-Naam | Ruhonamo | Chariamoi | Thalavael | Weal Talo | Yail Sala |
| Vaelei | Vaelei | Veelei | Vialei | Voalui | Grewntawra | Tawra-Grewn | Saari-Yaar | Prinzayaro | Yariasaris | Yavieldunai | Dunia Iave | Dunia Yavi |
| Rasthel | Rastel | Rassel | Rahlel | Rasdel | Roddyarl | Yarl-Rodd | Beq-Tirak | Becodwaro | Tirakbekia | Ferahael | Eal Fero | Hailu Fela |
| Kerun | Kerun | Kerun | Gerun | Gerun | Isenbraenn | Brenn-Isen | Khadar-Barz | Cadarbarzo | Barzischadar | Angielorniel | Orne Ange | Orni Angi |
| Aurlan | Aurlan | Ourlan | Orlan | Orlan | Goldfaaenn | Faenn-Gold | Maar-Zaah | Marozaho | Zahismarae | Olaryara | Iaro Olar | Yala Olar |
| Ailtal | Ailtal | Eiltal | Ailtal | Ualdal | Kvitstaenn | Stenn-Gwit | Kaar-Leb | Cairolebo | Lebiakaris | Aeltor | Tor Lunien | Tor Luni |
| Irumas | Irumas | Irumas | Irumah | Irumas | Mawrtan | Tanu-Mawr | Nuur-Raab | Nurorabo | Rhabisnuria | Marahaera | Cearo Mara | Haila Mala |
| Gaelor | Gaelor | Geelor | Gialor | Goalor | Graearyarl | Yarl-Grei | Beq-Rem | Becoremo | Rhemiabekia | Gaeliel | Eal Geale | Hailu Gaili |
| Naisa | Naize | Neis | Naiha | Nuas | Novsterr | Sterr-Now | Kook-Nuuv | Neronuvo | Nuviakokia | Nethisel | Isiel Net | Isel Nes |

The Rite-Tongue of the necromantic orders gives the gods no names of its own: the orders number the months instead (see [calendar.md](calendar.md) section 7).
The Orcish, Trollish, Giants', Yeti, Long Speech, Yonic, Orran and Infernal speakers honour none of the twelve by a name of their own (section 8); those who meet the twelve use the Common Speech forms.

**Collision check.** Every canonical, liturgical, regional and lesser name above was compared, with letters only and case, accents and hyphens ignored, against `reserved_names.json`, every sample and established name of `languages.json`, every capitalised word of `docs/lore/` (vault, regions, references, sources), `docs/specs/02_lore/`, `docs/generation/name_assignments.json` and `docs/design/countries.csv` (8,363 forms), counting an exact match or a match within one edit for names of five letters or more.
No canonical god name collides. Near matches that remain, all with generated sample names rather than canon: *Kerun* and the Dondric sample *Kerdun*; *Gaelor* and the Aenoran sample *Maelor*; the Leren regional *Geelor* and the Long Speech sample *Gellor*; Mirolic *Lumia* equals a Stabilic sample, and is also the name of a commercial phone line, so the owner may prefer Mirolic *Lum*. *Aurlan*, "golden field", is one edit from the proposed Dead Lands district *Qaurlan*, Rite-Tongue "black field" (`docs/lore/regions/dead_lands.md`); the pair reads as a deliberate opposite, but the owner may rename one.
Names were also checked by hand against the myths and fiction the author knows: several first candidates were dropped for that reason (one edit from a Greek Muse, a Warcraft people, an archangel, a ferryman of Greek myth, a Yoruba word for gods, a demon of the grimoires, the capital of Estonia), and none of the twelve, their liturgical styles or the lesser gods is a known name from another work or a real religion.

## 6. The lesser New Gods

Lesser New Gods belong to the same divine order as the twelve and are weaker than them, though stronger than most Great Spirits (E; the comparison is sealed, C27). They have no month. Their feasts fall inside the months of the twelve, and believers often make them a child, servant or handmaid of one of the twelve (*belief*). They are not the same as the Lesser Spirits that villages mistake for gods, such as the river-keepers of the River Wardens' Rite and the Lords of the Green (C16).

**Proposed classification.** The New Gods who serve Zol, and the New God whom Volgan once served and overpowered, are **lesser New Gods**, not any of the twelve (P). This keeps the twelve whole for the faith of Aoaz, matches the vault's rule that rank records a kind of being and not victory (Volgan, a Great Spirit, overpowered a lesser god, which "stronger than most Great Spirits" allows), and keeps Zol's divine servants small enough to be hidden among shrines. Which lesser gods serve Zol is still the owner's to decide (C10); the two marked below are proposals for the authorial record and are sealed in every layer.

| Lesser god | Name and language | Domain | Following | Believers place it under | Local feast | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| **Hunvael** | Old Ainic and Aenoran, *hun* horse + *vael* green, "the pasture" | Herds, horses and pasture | The Steppe Riders; the herders of Hunhun | Vaelei | The Foaling, 20 Lumae | The Horse-Oath swears on horses; the riders feast Hunvael when the mares foal. |
| **Dolker** | Old Ainic *dol* deep + *ker* iron, "deep iron"; Dondric *Dolger* | Mines, ore and the deep galleries | The iron-keepers of Dondor; the miners of the Western guilds | Irumas, as his son | The Descent, 15 Irumas | Miners carry Lumae's ember underground and pray to Dolker at the shaft-head. |
| **Biir-Shiin** | Noric, *biir* well + *shiin* bright, "the bright well" | Wells, oases and the salt road | The Noris camel warriors; the caravans of Stabilo | Maelwen, as his daughter in rain-form | The First Water, 1 Maelwen | The Well-Oath's "promise from the earth" is sworn in her name at the Seven Wells. |
| **Tidai** | Tritonic *tidai*, "the tide" | Tides, harbours and the ransoming of captives | The Corsair Lords; the Chart-Islanders; the Isle Houses | Maelwen | The Ransoming, 20 Irumas | The Ransom Tide's "god of the harbour", under whom a ransomed captive stands. |
| **Parethe** | Old Ainic *par* lake + *-ethe*, "she of the lake" | The Great Lake of Parim, its fishers and ferries | The Lake Aenorans | Maelwen | The Lake-Blessing, 1 Vaelei | The lake-place of Parim takes its name from the lake, not from her (`06_languages.md` 3.2); the Lake folk say otherwise (*belief*). |
| **Lunvat** | Coldic *lun* moon + *vat* water, "moon-water" | Calm seas and windless nights, as sailors pray for them | The Windwaith seafarers; the storm-speakers of the Ice Clans and Isengard | Maelwen | The Calm, 10 Rasthel | **Serves Zol (sealed, P).** Sailors pray to her for calm and fear the still seas of the north; nobody connects the two in any text. |
| **Gaelkuth** | Old Ainic *gael* grey + *kuth* grave, "grey grave"; Common Speech *Gaelkut*, Leren *Geelkus* | An easy death, the sleep of the old and the sick, the quiet of graves | The grave-wives of the Dead Lands freeholds; hospices of Aenor; old women of the Leren coasts | Gaelor, as his handmaid | The Quiet Night, 15 Gaelor | **Serves Zol (sealed, P).** The dying pray to her for a gentle end. What a servant does for Zol stays open (C8): this file does not say what her service is. |
| **The Herdsman of the South** (working label; no name proposed) | none | The southern wilds and their beasts | Once the peoples of the south before the numbered ages (unknown); none now | none | none | **The New God Volgan served and overpowered (sealed, C11; P that it was a lesser New God).** Its name and its fate stay open (C12); no shrine or text remembers it. |

## 7. Afrit's feast: the Day of Deliverance

| Field | Content |
| --- | --- |
| Name | **The Day of Deliverance** (world bible); the faithful call it **the Day Between** (P). |
| Date | **30 Gaelor**, the last day of the eleventh month (P day; the world bible already places the Day of Deliverance in this month). |
| Origin | The Houses of the First Light first kept it in 4A 1, on the anniversary of the Great Necromancer's fall at the end of the Third Age, when the Deliverer was acclaimed a New God (E acclaim; P date). |
| Rites | A silence at dawn for the dead of the Third Age; every lamp in the house relit from a lamp carried from the nearest House of the First Light; bread and oil given at the Houses; the High Confessor reads the Deliverance in the Zilin Hills and a confessor reads it in every House; children receive a lamp-token. |
| Who keeps it | The Lake Aenorans and the Zilin Pilgrim-Folk as their great feast; most of Aenor and its dominions as a public holiday; the Leren north, the West and the East keep it thinly or not at all. |

**Why it sits uneasily beside the twelve.** The temples of the twelve hold that there are twelve needs and so twelve months, and when the Deliverer's faithful asked for a month at the age's end the Reckoners answered that no need was left unanswered (P). The Houses accepted a feast, and teach that the Deliverer answers every need at once, which quietly puts him above the twelve without saying so.
The day is written in the Reckoning as a day of Gaelor's month, but the Houses' calendars print it as no god's day, "between" the month of the dead and the month of hope, and the Name-Readers resent a feast of rejoicing on the last night of their mourning month.
The Houses also lead or carry rites that belong to the twelve: they bring the fire to Lumae's Lamp-Lighting, heal where Sulethe's spring-houses stood, write the birth rolls the Cradle-Wives kept, take the harvest tithe that was Aurlan's and teach the princes whom Glernaen's Counsellors once taught (world bible and vault; the earlier ownership is P). The cult has grown inside the faith of the twelve, not beside it.

**After the reveal.** Once `zin_afrit_revealed` is set the feast becomes a test for every court: keep it, strike it from the Reckoning, or turn it into a day of mourning for the Golden King (section 8). Its meaning flips for the player as the meaning of the Houses' blessings does ([magic_and_wizards.md](magic_and_wizards.md) 3.8).

**Knowledge layers.** The feast is public (C15 truth). The Deliverer's godhood is only ever the believers' claim, with doubt voiced by sceptics (C15); no month is ever named for him; the Houses' answer to Afrit is gated (A1, A3).

## 8. Faith in play (R-32)

### 8.1 Faith spirits

The 38 faith spirits of `cultures_game.json` stay; none is replaced by a cult of the twelve, because the twelve are worshipped through those faiths. `pantheon.json` adds `faithLinks`, which lists for each faith the gods it favours, the lesser gods it keeps and the gods it shuns (the grave cult and the Pact-Rite shun Gaelor; the Pact-Rite also shuns Ailtal and Vaelei). The builder uses the links for three things: which festivals give a country its timed modifier (8.3), which god a faith's flavour text may name, and the patron line in the faith tooltip ("Honours Maelwen and Gaelor above the rest").
The world bible's sentence "No faith names a New God" is superseded when the owner accepts the names.

### 8.2 Holy sites

Each god has holy sites in `pantheon.json` (`holySites`), with existing site ids where the world bible already holds a shrine there: Parim's Hall of the Twelve (Glernaen and Lumae's bays), the Frost-Hall of Fandanar (Glernaen), the Singing Quay of Sonargur, the Flood-Court of Alerhia and the Seven Wells of Noris (Maelwen), the kiln-shrines of Avalon (Vaelei), Stabilo and Mora (Rasthel), the Gate at Kingson and Mirolon's beacons (Kerun), the Hall of Scales at Postondoroth, Gunwaith's Oath-Ring and the Bridge of the Three Oaths (Ailtal), Kradlon and Notbuton (Irumas). Sites without an id are the shrines every town has (the spring-house, the rain-stone, the vigil-hill) and are flavour, not map objects.
A holy site gives its state a small permanent stability modifier while its owner's faith favours the god, and is the target of the pilgrimage decision (8.4).

### 8.3 Festivals as timed modifiers

Every god's festival and every faith festival becomes a timed modifier keyed by **month index** (1 to 12) and day, never by month name, so that the calendar can change its names without touching the faith data: `cultures_game.json` replaces `"month": "Thaw"` with `"month": 3` by the table in [calendar.md](calendar.md) section 6.
A country whose faith favours the god receives the festival's modifier for 30 days from the feast day; a country whose faith shuns the god receives nothing. Values live in one script-constants file (`common/script_constants/zin_festivals.txt`, proposed) so that tuning is in one place.

| Festival | Day | Effect while it lasts (proposed; tokens checked against the installed modifier documentation at implementation) |
| --- | --- | --- |
| The Year's Counsel | 1 Glernaen | small gain to daily political power; cheaper advisor changes |
| The Drawing of Waters | 14 Sulethe | lower attrition; small gain to monthly population |
| The Lamp-Lighting | 1 Lumae | small stability gain |
| The Opening of the Waters | 15 Maelwen | small gain to naval organisation and speed |
| The Day of Cradles | 12 Vaelei | small gain to monthly population |
| The Stranger's Table | 21 Rasthel | better trade opinion; cheaper improve-relations |
| The Walking of the Walls | 7 Kerun | faster fort construction; small gain to defence |
| The Last Sheaf | 31 Aurlan | lower consumer-goods share |
| The Day of the White Stone | 15 Ailtal | small stability gain; slower justification of war goals for the month |
| The Kindling of the Forges | 1 Irumas | small gain to production efficiency growth |
| The Night of Names | 1 Gaelor | small gain to recovery and to resistance against raised dead (the Eindil and Zol mechanics' own variables) |
| The Star Vigil | 21 Naisa | small gain to war support while at war, to stability at peace |
| The Day of Deliverance | 30 Gaelor | for the Deliverer's faith: stability and the Afrit mechanic's devotion; after `zin_afrit_revealed`, the effect is chosen by the decision in 8.4 |

**Firing.** One hidden event per festival is scheduled from game start on a single host scope and re-schedules itself each year with `days =` set from a variable; when it fires it gives the modifier to the countries whose faith favours the god. That is a world iteration about fourteen times a year, and project rule 8 requires the owner's permission before any whole-world iteration, so the firing route is an owner question (section 9, question 9); the alternative is a per-country chain started for each country on its own startup.

### 8.4 Decisions

| Decision | Who | What it does |
| --- | --- | --- |
| **Keep the feast of [god]** | Any country whose faith favours the god, in the month before the feast | Costs political power; doubles the festival modifier and adds a stability pulse; the AI takes it when stability is low. |
| **Endow a temple of [god]** | Any country with a favouring faith | One-time cost; a state modifier in a chosen state; one temple per god per country. |
| **Pilgrimage to [holy site]** | A country whose faith favours the site's god | Sends a delegation; opinion with the site's owner and a timed national bonus; impossible at war with the owner. |
| **Petition [god]** | In a matching crisis: Sulethe in a sickness event, Aurlan in a famine event, Maelwen in a flood or storm event, Kerun when attacked | Removes or shortens the crisis modifier at a cost; the god's answer is shown only as the believers' account. |
| **Who carries the fire** | Aenor, before 1 Lumae each year | "Let the Houses carry the fire" (Afrit devotion up; the Lamp-Mothers' halls fall silent) or "Keep the fire with the Lamp-Mothers" (stability up; the Hidden Council notices). |
| **The Day Between** | Every court that keeps the feast, after `zin_afrit_revealed` | Keep it (the faithful content, the betrayed angry), strike it from the Reckoning (the Reckoners pleased, unrest in Parim) or make it a day of mourning for the Golden King. |

### 8.5 Events

- **Festival flavour**, one per god, firing on the feast day for one favouring country a year, with two or three options and no world-changing effect.
- **The Lamp-Lighting at Parim**, on the first day of play for Aenor: the Houses of the First Light carry the fire through the city, and the old Lamp-Mother of the Hall of the Twelve waits at the square with her own.
- **False gods** (the vault's own proposals made playable): a town raises a temple to a river-keeper and calls it a New God; a preacher proclaims a new god of a mountain; a scholar's tract says the Holy Seven never were. Each resolves as belief or dispute, never as a verdict (C16, C2).
- **The heresy of the Grey**: northern rumour that Gaelor serves the black north; the Name-Readers ask the crown to silence it. The rumour is never confirmed in any branch, and the true servant (Gaelkuth) is never named as one.
- **The Reckoners' quarrel**: the Houses ask again for a month for the Deliverer; the player's answer moves the Afrit mechanic.
- **The gathering** (Eindil's chain, 4A 1757 on the historical path): the New Gods restore Eindil; after its flag the codex may name the lamp-bearer, the rain-bringer and the others as the twelve.

### 8.6 How belief stays apart from truth

- **The twelve, once approved, are public**: their names, needs, symbols, rites and festivals may be stated plainly, because the people of Aoaz know their gods (C13, C14 change from mystery to public when the owner accepts the names).
- **What the gods do is belief.** "Sulethe broke the fever" is written as the Bowl-Bearers' account; whether the twelve answer ordinary rites stays open ([magic_and_wizards.md](magic_and_wizards.md) question 11).
- **Lao is belief** (W12), always with a believer; **Erdu is never written** (W6); the Holy Seven appear only as the oldest myth, preferably in a sceptic's voice (C2).
- **Glernaen and Glo** are joined only behind the gate of E3.
- **The Deliverer** is a New God only in the mouths of his faithful; sceptics and the temples of the twelve may doubt it aloud, and no text settles it (C15).
- **Zol's divine servants** (Lunvat, Gaelkuth) are worshipped lesser gods in public text and nothing more; their service is sealed (C9, C10). **Volgan's former master** never appears (C11, C12).
- **No age** of any god, lesser god or spirit is stated, in any text (V23).

### 8.7 Follow-ups for other owners once the names are approved

These changes are outside this file's scope and are listed for the agents who own the files.

1. `docs/lore/references/knowledge_layers.md`: rule `kl_mystery_001` must except the twelve and the publicly named lesser gods; rule `kl_mystery_003` is retired after the calendar keys are renamed; new sealed rules must catch any sentence that ties Lunvat or Gaelkuth to Zol or that names Volgan's former master; C13 and C14 move to *public*.
2. `tools/content/data/world/reserved_names.json`: add the twelve, their liturgical styles, the lesser gods and the proposed name of Zol's servant (see [edvoid_name.md](edvoid_name.md)); replace "Any New God other than Glernaen" in `doNotGenerate` with "Any New God not in pantheon.json"; add the twelve old month names to `superseded`.
3. `tools/content/data/cultures_game.json` and `tools/content/data/world/cultures.json`: festival months by index; the Deliverer's Lamp-Lighting becomes Lumae's festival with the Houses' part as flavour; the faith texts may name their patron gods.
4. `docs/specs/02_lore/05_world_bible.md` section 4: the sentence "No faith names a New God" and the old month names in the festival column.
5. `tools/content/lib/calendar.mjs` and its test, as [calendar.md](calendar.md) section 8 describes.
6. The vault: `01 - Cosmology/New Gods.md`, `03 - Figures/Glernaen.md`, `07 - History/Fourth Age Chronology.md` and Open Questions Q-01, Q-02 and Q-10, recorded as the owner decides.

## 9. Questions for the owner

1. **The twelve needs.** Do the twelve needs of section 1 match what you meant by "the twelve needs of mortals", or should one be replaced (for example love, music or the hunt instead of hope)?
2. **The names.** Do you accept Sulethe, Lumae, Maelwen, Vaelei, Rasthel, Kerun, Aurlan, Ailtal, Irumas, Gaelor and Naisa beside Glernaen, and Old Ainic as the tongue of their canonical names?
3. **Glernaen's month.** Glernaen holds the first month, the head of the year and the season of counsel. Would you rather he held midsummer (month 6) or another month?
4. **The gods' sexes.** Six goddesses and six gods are proposed (section 2). Are any of the twelve without sex, or other than proposed?
5. **Lesser New Gods as Zol's and Volgan's.** Are the New Gods who serve Zol, and the one Volgan overpowered, lesser New Gods rather than any of the twelve? May a lesser god that serves Zol be openly worshipped by people who do not know it, as Lunvat and Gaelkuth are proposed?
6. **Answered rites.** Do the twelve answer ordinary temple rites in Aoaz despite its resistance to outside power, or only through vessels and rare gifts like Glo?
7. **Afrit's feast.** Is the Day of Deliverance on 30 Gaelor, "the Day Between", the feast you meant? Should the Lamp-Lighting on 1 Lumae belong to Lumae, with the Houses of the First Light only carrying its fire, as proposed, or remain the Deliverer's own?
8. **Lesser gods in text.** May the lesser New Gods be named in player text (knowledge layers question 11), or only described ("the lake-goddess of Parim")?
9. **Festival firing.** May the festival chain iterate over all countries about fourteen times a year (project rule 8), or should each country run its own chain?
10. **The elves and the twelve.** Do the Great Folk elves worship the New Gods, revere them as fellow singers, or keep apart from them, as section 3 proposes for the Kindred Song?
11. **Qaurlan and Aurlan.** Keep the near-echo between the Dead Lands district Qaurlan, "black field", and the harvest goddess Aurlan, "golden field", or rename one?
