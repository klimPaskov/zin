# Flavour and World Events

**Status:** Draft. **Priority:** 5. **Phase:** 5 (8 for the reserved ranges).

## Purpose

The first year must feel like a peaceful realm-management game: courts quarrel, prices rise, envoys take offence, and a few people see things nobody believes. Later, as the story moves, ordinary people should feel each great moment in their markets and temples. This spec defines that layer in namespace `zin_lore`:

1. **The opening events** `zin_lore.1`–`.15`: one per tier A power and for Dondor and Yeldenne, shown on the first day to human players.
2. **Peaceful-start flavour** `zin_lore.300`–`.399`: the Deliverer's temples, trade, omens nobody believes, island fishermen, Mirolon's scouts, and regional flavour for every region.
3. **World flavour** `zin_lore.400`–`.449`: small events that let every region feel the story's great moments after they happen.

The flavour events `zin_lore.101`–`.211` and the Worshipdom's private record `zin_lore.220`–`.221` are already specified in [04_fourth_age_history_for_play.md](../02_lore/04_fourth_age_history_for_play.md); this spec schedules them with the rest and does not repeat them.

The conventions C1 to C12 of [01_golden_king_and_succession.md](01_golden_king_and_succession.md) apply. Two more rules hold for everything here:

- **F1. Flavour never moves the story.** No flavour event sets or clears a contract story flag, starts a war or a war goal, changes `zin_gathering_dark`, or moves a mechanic's main variable by more than a token amount (at most 2 points, listed per event).
- **F2. Omens are not prophecies.** An omen is something people see and argue about. Its text never says what it means, never names a hidden power, and ends with the court not believing it. No omen foreshadows a sleeper in the ice (open question of the start spec), the Golden King's death, or Afrit.

## Lore basis

| Fact | Status | Source |
| --- | --- | --- |
| Erdae has known more than a thousand years of genuine peace, prosperity, schools, medicine and trade | established | *Fourth Age Canon Register* |
| The start: the Golden King reigns, Eindil has not appeared, Afrit is unrevealed, Erdae seems at peace | established (owner) | *The Campaign of 4A 1748* |
| The dangers exist, but only a few people see them: Mirolon's scouts, island fishermen, the Hidden Council | established direction (proposed wording) | *Fourth Age Chronology* |
| The Deliverer is publicly worshipped; his institutions (the proposed Houses of the First Light) are sincere charities to most who serve in them | established (worship); proposed (Houses) | *Afrit the Deliverer*, *Houses of the First Light* |
| Volgan rebuilds behind the Dead Lands' storms and heat; only Mirolon watches | established | *The Campaign of 4A 1748*, *Volgans Dead Lands* |
| Zol's dead stir in the islands of the Ocean of Zol; only fishermen see it; nobody at court believes them (4A 1744 tales proposed) | established direction, proposed date | *The Campaign of 4A 1748* |
| Regional names, peoples and roles | established names, working table, roster | *Erdae and Its Regions*, *Great Powers and Relations*, country roster |
| Every event, title, text, option and number below | **proposed** | this spec |

**Kept open:** no text names Zol's administrator, his servants, the King of Demons, Roka's people, Dardan's place, the Gala and Sunhot relationship, a sleeper in the ice, or what any omen means.

## Design

### The opening events (`zin_lore.1`–`.15`)

Fired by `zin_lore.100`'s startup block for human players only (`is_ai = no`), on day 1, for the matching country (by name, resolved to tag at build). Each has a three-paragraph description: **the situation**, **what the court believes**, **what it wants**. Nothing hidden from that country is said. One option. Picture as listed. These events set nothing.

| Id | Country | Situation (paragraph 1) | Believes (2) | Wants (3) | Option | Picture |
| --- | --- | --- | --- | --- | --- | --- |
| `.1` | Aenor | "For seventeen centuries the Middle Kingdom has known peace. The Golden King has reigned for nineteen years. The Concord's dominions grumble at his taxes, and the Golden Court sells what it likes." | "The peace is permanent. The Deliverer protects the crown. Volgan is a legend; the dominions will obey." | "The King wants glory and gold, and a triumph for his Lost Cause. The court wants offices. The dominions want lower taxes." | **"Long live the Golden King."** | `golden_court` |
| `.2` | Worshipdom | "The hermitage of the Zilin Hills holds three valleys and almost no army. Its strength is the pilgrims, couriers and confessors who pass through it to every court." Worshipdom-only: "You are Afrit. The world knows you as `[zin_name_aurevan]` the Deliverer." | "The Golden King is a liability. The Lost Cause could become a rival seat of power. The Council judged so in 4A 1746." | "To take Aenor's crown openly, keep the eastern courts as a reserve, and one day hold Glo." | **"The Council sits."** | `council_chamber` |
| `.3` | Lerendor | "The two crowns of Lerendor and Lerenwaith are one kingdom, and its fleets guard the Narrow Strait." | "Aenor despises the North. The toll of 4A 1716 proves it. The treaty serves Parim." | "To honour the Treaty of the Narrow Strait, break it, or bend it into Leren mastery of the strait." | **"The North remembers."** | `strait_toll` |
| `.4` | Volgan | "Behind the storms and the heat of the Dead Lands, the hosts drill where no ship can see. Demon, Dolon and Nezer are sworn to Nafeher." | "The kingdoms of men always divide. Their time is passing." | "To retake Mirolon, march north, and possess the green crystal of the north." | **"Patience."** | `dead_lands_storm` |
| `.5` | Zol | Short and impersonal: "The black north is silent. The dead walk the wastes, and the islands of the Ocean of Zol lie dark." No court, no beliefs, no person | (none: "No one in Erdae can say what the north believes.") | "It grows, very slowly." | **"…"** | `black_isles_lights` |
| `.6` | Magical Forest | "The oldest and most peaceful of the elven realms is ruled by its council of houses. The Great Wall keeps the kings of men on their side of it." | "Men break alliances. The Elven Refusal still stands. The Wall keeps the peace." | "To stay apart, keep the dragons safe, and keep the Wall a customs line, not a border of war." | **"The woods endure."** | `generic_wilds` |
| `.7` | Gala Elves | "King Lorien, who fought at Dardan, keeps his ancient court among the realms of the Lands of the Sun." | "Human kings turn common victories into dominion. Still, Erdae's fate matters." | "To keep Gala's memory and its distance." | **"Memory is a duty."** | `gala_court` |
| `.8` | Coldor | "The Winter Crown rules the frozen interior and the western ports. Horidor stands with it in the Northern Accord; Isengard stands against it." | "Isengard is the enemy. The Cold Lands are a world of their own." | "To bring Isengard to heel and keep the Accord." | **"The winter is long."** | `generic_wilds` |
| `.9` | Noris | "Noris holds the Salt Road and the desert and leads the Noris Treaty with Gondolin." | "Stabilo is the rival that matters. Aenor is a distant market." | "To own the caravan roads." | **"The roads are ours."** | `generic_peace` |
| `.10` | Stabilo | "Stabilo's merchant princes rule from Postondoroth and lead the Stabilo Pact with Drak." | "Noris is the rival that matters." | "To win the southern trade routes." | **"Every road ends in Postondoroth."** | `generic_peace` |
| `.11` | Gunwaith | "After fifty years of war with Girdon, Gunwaith keeps the Truce of the Grey Ford, signed three years ago." | "The truce is fragile. Aenor once tried to rule the West and still taxes it through its tariffs." | "Peace at home, lower tariffs, and the old claims of Parim buried for good." | **"The clans are weary."** | `grey_ford_truce` |
| `.12` | Goldoroth | "The Warking of Cocanoor rules the inner Dark Lands. Dondor and its Accord stand in the way." | "The Dark Lands should be one kingdom: ours." | "To subdue Dondor and the free holds." | **"Iron and fire."** | `generic_war` |
| `.13` | Mirolon | "Mirolon is free again, long after Volgan took it in the First Age. Its wardens watch the passes to the south." | "Volgan is arming. Nobody in the north will listen." | "To hold the passes and win allies." | **"The watch never sleeps."** | `mirolon_passes` |
| `.14` | Dondor | "Dondor holds the northern Dark Lands with Belonton's help in the Dark Sea Accord." | "Goldoroth is the danger." | "To survive Goldoroth." | **"Light the beacons."** | `generic_war` |
| `.15` | Yeldenne | "In the frozen north of the Cold Lands, the Castle of Yeldenne keeps its silence. Its lord, Horos, guards Glo, a crystal of old and holy power." | (Horos's view, briefly: "Glo is for the worthy.") | "To keep Glo from the unworthy." | **"Who walks here?"** | `yeldenne_hall` |

Text rule: `.15` never says that Glo is Horos's heart (that label changes on `zin_horos_dead`, names spec). `.5` never names a keeper of Furviatlon or any servant.

### Scheduling

`zin_lore.100` (hidden, `on_startup`, every country) calls `zin_lore_schedule_flavour`. For each event in the tables below whose recipient test matches ROOT, it fires `country_event = { id = zin_lore.<n> days = <window start − today> random_days = <window length> }`. Events marked "random share" are scheduled only for that share of matching countries (`random_list`). Each event sets `zin_lore_seen_<n>` on its recipient and does nothing if the flag is already set.

World flavour (`zin_lore.400`–`.449`) depends on story flags, which do not exist at startup. It is fired by the story runner's lore block `zin_story_tick_lore` (new; called by `zin_story_tick`, C6): each month it checks each 400-series event's flag and delay and fires it to its recipients once.

**Budget.** In 4A 1748 a typical country receives 3 to 6 flavour events; a great power 6 to 10, counting `zin_lore.101`–`.211`. The 400-series adds about one event per country per story moment it can feel.

### Peaceful-start flavour (`zin_lore.300`–`.399`)

Window: 1 Thaw 1748 to 1 Thaw 1749 unless stated. Effects are design targets. AI weights in brackets.

#### The Deliverer's temples (300–309)

| Id | Title | To | Window | Text gist | Options (effects; AI) |
| --- | --- | --- | --- | --- | --- |
| `.300` | The Feast of Deliverance | every country with `zin_footholds` ≥ 1, except the Worshipdom and Volgan, Zol and their subjects | 1 Highsun 1748 | "Today the temples remember the night the Deliverer shielded the people when Elzon fell. Bread is blessed and given away." | **"Keep the feast."** −10 PP; stability +0.01 (70). **"A day like any other."** +10 PP (30) |
| `.301` | A Healer Who Asks Nothing | random share 30% of countries with footholds ≥ 1 | any | "A healer of the Houses of the First Light saved a lord's child from fever and would not take payment." | **"Reward the Houses."** −10 PP; opinion of the Worshipdom +10 (60). **"Thank the healer."** stability +0.01 (40) |
| `.302` | The Birth Rolls | every Concord dominion with footholds ≥ 2 | any | "The Houses ask to copy our birth rolls, to keep them safe with Parim's." | **"Let them copy the rolls."** stability +0.01; `zin_aenor_add_council_influence` +0.5 (70). **"We keep our own rolls."** +10 PP (30; Selen 100) |
| `.303` | A Sermon on Gratitude | Aenor | Rainwake 1748 | "The Hierarch preaches in Parim that seventeen centuries of peace are the Deliverer's gift, and that a grateful kingdom is a safe one." | **"Amen."** stability +0.01 |
| `.304` | Grain From the Temple Stores | random share 20% of countries with footholds ≥ 2 and stability below 50% | any | "A poor harvest in the hills. The Houses opened their grain stores before our own officials had counted the sacks." | **"Be grateful."** stability +0.02 (80). **"Ask who paid for the grain."** −10 PP; nothing else (20) |
| `.305` | A Temple Too Rich | random share 15% of Light countries with footholds ≥ 2 | any | "A provincial governor complains that the local temple owns more land than he does." | **"Let the temple keep its gifts."** nothing (60). **"Tax the temple land."** +25 PP; stability −0.01 (40) |

None of these says who the Deliverer is, what the Houses gather, or that the Council exists. `.302`'s token council change is the only mechanic effect (F1).

#### Trade (310–319)

| Id | Title | To | Window | Text gist | Options (effects; AI) |
| --- | --- | --- | --- | --- | --- |
| `.310` | The Lake Fleet Comes In | Aenor | Harvest 1748 | "The grain fleet of the Great Lake is in. The harbours of Parim are full to the breakwater." | **"Store it."** stability +0.02 (50). **"Sell it abroad."** +25 PP (50) |
| `.311` | A Caravan From Beyond the Wall | Konori, Noleksun, Kingson | any | "An eastern caravan came through the elven roads with pepper, glass and stories of rich courts." | **"Buy the spices."** −10 PP; stability +0.01 (50). **"Tax the caravan."** +15 PP (50) |
| `.312` | Furs for the South | Coldor, Windwaith, every Cold Lands country with a western port | Emberleaf 1748 | "The fur ships sail south before the ice. The West Lands pay well this year." | **"Send the best furs."** +20 PP |
| `.313` | Sun-Silk at the Harbour | every Islands of the South country; Lands of the Sun countries with a port | any | "Traders from the tall folk's realms bring white-gold silk and buy salt fish." | **"Trade fairly."** opinion with a random Lands of the Sun realm +10 |
| `.314` | The Price of Salt | every Dark Lands country except Goldoroth | any | "Salt from Cocanoor's pans costs twice what it did. Nobody else sells it." | **"Pay it."** −10 PP (60). **"Make do without."** stability −0.01 (40) |
| `.315` | Timber Rafts on the River | Gunwaith, Girdon, Lambin | Sowing 1748 | "Log rafts come down the rivers from the northern forests, bound for the shipyards." | **"Build boats."** navy experience +3 (50). **"Sell the timber to Aenor."** +15 PP; Aenor opinion +5 (50) |
| `.316` | Pirates Hanged at Adel | Adel, Pollos, Raerby | any | "Three pirates are hanged on the quay. Their captain swears he was a merchant who missed a toll." | **"Hang him too."** stability +0.01 (60). **"Fine him and let him sail."** +15 PP (40) |
| `.317` | A Merchant Prince's Wedding | Stabilo | Goldfield 1748 | "Two houses of Postondoroth marry their fortunes. The feast lasts nine days." | **"Attend."** −10 PP; stability +0.01 |

#### Omens nobody believes (320–329)

Every omen follows F2: the text describes, the court dismisses, nothing is explained.

| Id | Title | To | Window | Text gist | Options (effects; AI) |
| --- | --- | --- | --- | --- | --- |
| `.320` | The Lake Is Too Still | Aenor | Highsun 1748 | "For three days the Great Lake did not ripple. The priests call it a blessing. The fishermen do not go out." | **"A blessing."** stability +0.01 (90). **"Ask the university."** `zin_aenor_add_lost_cause` +1 (10) |
| `.321` | Birds Leave the Northern Cliffs | every country with a coast on the Ocean of Zol (`zin_is_zol_coast_country`, new generated trigger) | any | "The seabirds have left the northern cliffs a month early. Old women say it means a hard winter." | **"A hard winter, then."** nothing |
| `.322` | Ash on the Wind | Mirolon, Herez | any | "Grey ash fell on the passes in a week without clouds. It came from the south." | **"Write it down."** Mirolon: `zin_mirolon_add_proof` +1. Herez: **"Volcanoes in the Dead Lands."** nothing |
| `.323` | A Two-Headed Calf | random share 25% of Middle Lands countries | any | "A calf with two heads was born in a village near the capital. Half the province has come to see it." | **"Sell it to a travelling show."** +10 PP (60). **"Let the priests bless it."** stability +0.01 (40) |
| `.324` | A Red Moon Over Cocanoor | Goldoroth, Dondor | Emberleaf 1748 | Goldoroth: "The Fire-Speakers say the red moon wants war." Dondor: "The moon was red over the orc country. Our watchmen counted the fires." | Goldoroth: **"Not this year."** stability +0.01 (80) / **"The clans grow restless."** war support +0.02 (20). Dondor: **"Light the beacons."** nothing |
| `.325` | A Star Falls in the East | random share 30% of East Lands courts | any | "A star fell over the desert. Court astrologers write three opinions and charge for each." | **"Pay for the best one."** −10 PP; stability +0.01 (50). **"Dismiss them."** nothing (50) |
| `.326` | Smoke Seen From the Elven Hills | random share 40% of Magical Lands elven realms | any | "An elder says she saw smoke far to the south and far to the north on the same evening. The young ones laugh." | **"Let the young laugh."** nothing |
| `.327` | The Bell That Rang by Itself | random share 15% of North Lands countries | any | "A harbour bell rang at midnight with no one in the tower. The wind, says the harbour master." | **"The wind."** nothing |

#### Island fishermen (330–339)

To countries with a coast on the Ocean of Zol (`zin_is_zol_coast_country`), and to island crowns of the North Lands. Separate from the Zol mechanic's rumour roll (`zin_mistake.2`), which alone adds to `zin_gathering_dark` and sets `zin_zol_forewarned`; these do neither (F1).

| Id | Title | To | Window | Text gist | Options (effects; AI) |
| --- | --- | --- | --- | --- | --- |
| `.330` | Nets Full of Black Water | random share 50% of the coast list | any | "The fishermen of the north coast say their nets came up full of water as black as ink, and no fish." | **"Fishermen's tales."** nothing (90). **"Send a clerk to look."** −5 PP (10) |
| `.331` | The Boat That Came Back Empty | random share 30% of the coast list | any | "A fishing boat drifted home with its nets folded and its crew gone. There was no storm." | **"Pay the widows."** −10 PP; stability +0.01 (70). **"Keep it in the village."** nothing (30) |
| `.332` | A Fisherman Before the Court | the coast list's great powers and Lerendor | Fallowing 1748 | "An old fisherman insists before the court that he saw men walking on the sea floor among the black islands. The court laughs. He does not." | **"Laugh with the court."** +5 PP (90). **"Give him a pension and silence."** −10 PP (10) |
| `.333` | The Fleet Stays South | random share 30% of the coast list | Thaw 1749 | "This spring the fishing fleets will not sail north of the last cape. No captain will say why." | **"Order them north."** +10 PP; stability −0.01 (40). **"Let them fish where they like."** nothing (60) |

#### Mirolon's scouts (340–349)

To Mirolon unless stated. Proof changes go through `zin_mirolon_add_proof`; together they add at most 6 in 4A 1748, so the historical path keeps proof below 75 (Volgan spec).

| Id | Title | To | Window | Text gist | Options (effects; AI) |
| --- | --- | --- | --- | --- | --- |
| `.340` | The Wall of Names | Mirolon | Thaw 1748 | "On the wardens' wall in the passes, the names of scouts who never came back fill four hundred years of stone." | **"Add none this year."** stability +0.01 (60). **"Read them aloud."** war support +0.02 (40) |
| `.341` | Tracks in the Ash | Mirolon | any | "Scouts found tracks in the ash south of the passes: many feet, in step, not all of them human." | **"Copy them for the archives."** proof +2 (80). **"Tracks blow away."** nothing (20) |
| `.342` | A Scout Comes Back Changed | Mirolon | any | "A scout came back from beyond the storms. He eats and sleeps. He will not speak of what he saw." | **"Give him a pension."** −10 PP; stability +0.01 (70). **"Send him back south."** proof +1; stability −0.01 (30) |
| `.343` | The Night Fires Counted | Mirolon | Emberleaf 1748 | "The wardens counted the fires in the Dead Lands this autumn. There are more than last year. There were more last year than the year before." | **"Send the count to Parim."** opinion of Aenor +5; nothing else (50). **"Keep counting."** proof +2 (50) |
| `.344` | A Letter From Mirolon | Herez | any | "The High Warden writes to Herez again: watch the south. Herez's lords have read such letters before." | **"Watch with them."** opinion of Mirolon +10 (40). **"Mirolon frets."** nothing (60) |
| `.345` | The Lake Towns Count the Cost | Mirolon | Longnight 1748 | "The lake towns pay for the watch on the passes. Their councils ask how long they must pay for a war nobody else believes in." | **"As long as Volgan lives."** stability −0.01; war support +0.02 (70). **"Lighten the levy."** +15 PP; `zin_mirolon_add_passes` −2 (30) |
| `.346` | Mirolonese Students in Parim | Aenor | any | "Students from Mirolon at the University of Parim are mocked as 'the boys who fear the dark'." | **"Boys will be boys."** nothing (80). **"Let the masters hear them."** `zin_aenor_add_lost_cause` +1 (20) |

#### Regional flavour (350–399)

One or two events per region. Window 1748 unless stated. Recipients by name; a missing country is skipped.

| Id | Title | To | Text gist | Options (effects; AI) |
| --- | --- | --- | --- | --- |
| `.350` | The Restorer's Statue | Selen | "Selen's square has a new statue of Harion the Restorer. It is taller than any statue of a king in Parim." | **"Let Parim see it."** stability +0.01; Aenor opinion −5 (60). **"Move it to the hall."** nothing (40) |
| `.351` | Ents Count the Rings | Kilinti | "The ents have counted the rings of the oldest tree in the forest again. They say it was young when Elzon came." | **"Let them count."** stability +0.01 |
| `.352` | The Giants' Fair | Hiloron | "Giants come down to the lake for the fair. Merchants sell them boots that are never big enough." | **"Trade."** +10 PP |
| `.353` | Horse Fair at Hunhun | Hunhun | "The riders' horse fair. A lord of Parim offers too little for the best stallion and is laughed home." | **"Sell to the riders."** army experience +3 (50). **"Sell to Parim anyway."** +15 PP (50) |
| `.354` | Gate Day at Kingson | Kingson | "Once a year the great gate in the Wall stands open from dawn to dusk, and elves and men trade in its shadow." | **"Keep the old custom."** opinion with the Magical Forest +5 |
| `.355` | Every Envoy Returned | Cursed Lands | "The Veiled Elder sent back every envoy of the year with their letters unopened." Nothing more is invented about the realm | **"We wish to be left alone."** stability +0.01 |
| `.356` | Raids From the Red Woods | Bloody Forest; its Concord neighbours | Bloody Forest: "Our young men raided a farm across the border. The farmer's dog bit one of them." Neighbours: "Raiders from the Bloody Forest burned a barn." | Bloody Forest: **"Good hunting."** war support +0.01. Neighbours: **"Double the border watch."** −10 PP. Never a war |
| `.357` | The First Port | Asgard | "Asgard remembers that its harbour was the first the Aenoran ships reached, long ago." | **"Ring the harbour bells."** stability +0.01 |
| `.358` | Between Two Masters | Molot | "Sonargur and Parim both sent envoys this month. Each asked for the same thing." | **"Smile at both."** +15 PP |
| `.359` | The Gateway Toll | R'en | "Ships between the Leren and the Aenoran seas pay R'en's toll. Both seas' captains complain." | **"Raise it."** +20 PP; opinion of Lerendor −5 (50). **"Keep it."** nothing (50) |
| `.360` | The Long Hunt | Yeti Lands | "The yeti of the white valleys go on the long hunt. They come back with more than they need and share it." | **"Share it."** stability +0.01 |
| `.361` | The Frost-King's Riddle | Titanos | "The Frost-King sets a riddle for every envoy. Nobody has answered it in a hundred years." | **"Set it again."** stability +0.01 |
| `.362` | The Windwaith Regatta | Windwaith | "The maritime republic races its ships around the capes. Coldor's captains lose again." | **"To the winners."** navy experience +3 |
| `.363` | Isengard's New Fort | Isengard; Coldor | Isengard: "Another fort rises on the march." Coldor: "Isengard builds another fort." | Isengard: **"Let Fandanar see it."** war support +0.01. Coldor: **"Count it."** nothing |
| `.364` | Companies for Hire | Buldor | "The Buldor companies look for contracts. In a year of peace the only buyers are merchants who want guards." | **"Guard the caravans."** +15 PP |
| `.365` | The Guild Strike | Kradlon | "Kradlon's workers' guilds stop the forges for a week over Aenoran tariffs on their iron." | **"Back the guilds."** stability +0.01; Aenor opinion −5 (60). **"End the strike."** +10 PP; stability −0.01 (40) |
| `.366` | Ledger Day in Corogon | Corogon | "The trading republic opens its ledgers to the citizens once a year. They balance." | **"Publish them."** stability +0.01 |
| `.367` | Storm Season in the Pupor Ocean | random share 40% of Triton's Islands countries | "The autumn storms came early. Two charts were wrong." | **"Redraw the charts."** navy experience +2 |
| `.368` | Blackton's Free Market | Blackton | "Orcs, men and goblins trade in Blackton's market under one rule: no blades drawn." | **"Keep the rule."** stability +0.01; +5 PP |
| `.369` | The Troll Bridge Toll | Troll Forest | "Travellers through the Troll Forest pay at the old bridge. The trolls take payment in iron, not gold." | **"Iron, then."** +10 PP |
| `.370` | Grove Songs in Herrodon | Herrodon; Andos Enda | Herrodon: "The grove songs this year name an old slight from Andos Enda." Andos Enda: "Herrodon is singing about us again." | Herrodon: **"Sing louder."** opinion of Andos Enda −5. Andos Enda: **"Sing back."** opinion of Herrodon −5 |
| `.371` | Wardens of the High Passes | Nolorim | "Nolorim's pass-wardens change the guard on the high road, as they have every spring for ages." | **"The passes are ours."** army experience +3 |
| `.372` | The Mushroom Forest Blooms | Magical Lands countries owning a Mushroom Forest state (site row needed; otherwise skipped) | "The giant mushrooms bloomed in one night. The glow could be seen from the Wall." | **"A good year."** stability +0.01 |
| `.373` | The Holy Breeze | Olen | "The breeze from the sea that Olen calls holy blew for nine days this summer." | **"Give thanks."** stability +0.01 |
| `.374` | The Warlord's Games | Nan | "The warlord of Vez Nan holds games. The winners join his guard." | **"Watch the games."** army experience +3 |
| `.375` | The Lake Assembly | Mora | "Mora's lake towns send their speakers to the assembly. It argues for a month about fishing rights." | **"Vote."** stability +0.01 |
| `.376` | Red Banners | Avalon | "Avalon's revolutionaries celebrate the anniversary of their republic. The neighbouring kings close their borders for a day." | **"Let them close them."** war support +0.01 |
| `.377` | The Rice Harvest | Howan | "The rice terraces of Howan gave a double harvest." | **"Store it."** stability +0.01 |
| `.378` | The Canoe Race | Nara, Verde | "The islands race their canoes across the strait. Both claim the victory." | **"We won."** stability +0.01 |
| `.379` | The Noon Festival | The Lands of Light and every Sunhot realm | "At noon on the longest day the tall folk gather in silence to watch the sun stand still." | **"Keep the silence."** stability +0.01 |
| `.380` | Pilgrims to the Sea of Gods | random share 30% of Lands of the Sun countries | "Pilgrims walk to the shore of the Sea of Gods to throw flowers on the water." | **"Walk with them."** stability +0.01 |

### World flavour (`zin_lore.400`–`.449`)

Fired by `zin_story_tick_lore` once a story flag is set. Each is short, has one or two options with token effects, and tells ordinary life, not the story itself (the owners' news events do that). Pre-reveal and pre-naming rules (C1, C2) apply to the text at the moment the event fires.

| Id | Title | To | Fired | Text gist | Options (effects; AI) |
| --- | --- | --- | --- | --- | --- |
| `.400` | Black Ribbons in the Market | every Middle Lands country | `zin_golden_king_dead` + 5 days | "The markets are hung with black ribbons. The cloth merchants have never sold so much." | **"Mourn the King."** stability +0.01 |
| `.401` | Hymns for the God-King | every country with footholds ≥ 2, except Aenor and the Worshipdom | `zin_aurevan_crowned` + 30 days | "The temples sing new hymns: the Deliverer wears Aenor's crown." | **"Sing them."** stability +0.01 (70). **"Our court keeps its own hymns."** nothing (30) |
| `.402` | Songs of the Grey Ford | every West Lands country | `zin_eindil_war_king` + 60 days | "Bards sing of the war-king who made the peace at the Grey Ford and gave the crown back." Uses "the King Without a House" | **"Sing it again."** stability +0.01 |
| `.403` | The Castle Road Is Open | Coldor, Horidor, Fearno and the owner of `zin_is_site_yeldenne_landing` | `zin_horos_dead` + 30 days | "Traders say the silent castle in the north is empty now, its gates open, its lord gone. Nobody goes in." Never says what Glo was | **"Nobody goes in."** nothing |
| `.404` | Bread Doubles in Price | every country at war, and every country bordering one, once | `zin_war_of_last_crowns` + 60 days | "The price of bread has doubled in a season." | **"Open the granaries."** −15 PP; stability +0.01 (60). **"Let the market settle it."** stability −0.01 (40) |
| `.405` | Swords for Hire | Buldor and every West Lands country with mercenary companies | `zin_war_of_last_crowns` + 30 days | "Every company in the West has a contract now. Some have two." | **"Sign the best."** +25 PP |
| `.406` | Empty Villages on the Coast | every country on the coast list | `zin_zol_rising` + 30 days | "The fishing villages of the north coast are empty. The fishermen were right." | **"Bring them inland."** −10 PP; manpower +1,000 |
| `.407` | Broken Images | every Light country with footholds ≥ 1 | `zin_afrit_revealed` + 14 days | "In the night someone broke the Deliverer's image at the temple door. In the morning the poor still came for bread." | **"Punish the breakers."** stability +0.01 (40). **"Leave the images broken."** war support +0.01 (60) |
| `.408` | The Storms Thin | Mirolon (or its court in exile), Olen, Nan, every free Dead Lands realm | `zin_volgan_body_destroyed` + 30 days | "Sailors say the storms over the south are thinner this season. Nobody knows what that means." Says nothing of Volgan's fate | **"Watch the south."** nothing |
| `.409` | White Banners in the South | every Sunhot realm | `zin_lorien_dead` + 30 days | "The tall folk hang white banners from their towers for the King of Gala." | **"Hang them."** stability +0.01 |
| `.410` | Refugees Come Home | every Middle Lands country | `zin_zol_withdrawn` + 90 days | "The roads to the Great Lake are full again, this time going home." | **"Help them home."** −10 PP; stability +0.02 |
| `.411` | Bells for a New King | every country at peace with Aenor | `zin_eindil_crowned` + 7 days | "Bells ring in Parim for a king of Aen's line. In our own streets, people argue whether that is good news." | **"It is."** opinion of Aenor +5 (60). **"We will see."** nothing (40) |
| `.412` | A Dragon Leaves the Roosts | every Magical Lands elven realm | `zin_eindil_dragon_pact` + 7 days | "A dragon has left the high roosts with a rider. The roost wardens say it went of its own will." | **"It chose."** nothing |
| `.413` | The Wall Without Its Watch | Kingson, every wall realm | `zin_aenor.300` + 30 days | "Half the Wall's watchtowers are empty. The garrisons went to Parim, or east, or home." | **"Man our side."** −15 PP; army experience +3 |
| `.414` | Ships in Every Harbour | every Triton's Islands country | `zin_western_crossing` + 14 days | "Every hull that can float has been hired for the western crossing. Our harbours are empty and our purses full." | **"Count the silver."** +20 PP |

Reserved: `.415`–`.449` (phase 8 world flavour); `.450`–`.499` (post-war sandbox flavour after an ending).

## Implementation

### Files

| Path | Content |
| --- | --- |
| `docs/design/lore_events.json` | All `zin_lore` flavour as data (the history-for-play spec's file, extended with the 300- and 400-series) |
| `events/zin_lore.txt` | Generated; namespace `zin_lore` |
| `common/scripted_effects/zin_lore.txt` | `zin_lore_schedule_flavour` (startup windows, random shares) |
| `common/scripted_effects/zin_story.txt` | `zin_story_tick_lore` (400-series) |
| `common/scripted_triggers/zin_sites.txt` | `zin_is_zol_coast_country` (generated from the sea regions of the Ocean of Zol, the same list the Zol spec's rumour roll uses) |
| `localisation/english/zin_lore_l_english.yml` | Text |

### Ids (`zin_lore`)

| Range | Owner | Use |
| --- | --- | --- |
| 1–15 | this spec (text) / start spec (firing) | Opening events |
| 20 | start spec | Debug start check |
| 100 | history-for-play spec | Hidden scheduler |
| 101–211 | history-for-play spec | Regional flavour of memory |
| 220–221 | history-for-play spec | Worshipdom's record |
| 300–309 | this spec | The Deliverer's temples |
| 310–319 | this spec | Trade |
| 320–329 | this spec | Omens nobody believes |
| 330–339 | this spec | Island fishermen |
| 340–349 | this spec | Mirolon's scouts |
| 350–399 | this spec | Regional flavour (350–380 used) |
| 400–449 | this spec | World flavour (400–414 used) |
| 450–499 | reserved | Post-war sandbox flavour |

### Flags

| Name | Kind | Meaning |
| --- | --- | --- |
| `zin_lore_seen_<n>` | country flag | The country has seen `zin_lore.<n>` (contract pattern) |

No other flag is set by this spec.

### Pictures

| Events | Key |
| --- | --- |
| `.300`–`.305` | `houses` or `hermitage` (`.303` `temple_parim_interior`, proposed key in [01](01_golden_king_and_succession.md)) |
| `.310`–`.317` | `generic_peace` (`.310`, `.312`, `.313`, `.316` `generic_sea`) |
| `.320`–`.327` | `generic_wilds` (`.324` `generic_war`) |
| `.330`–`.333` | `black_ships_tale` |
| `.340`–`.346` | `mirolon_passes` (`.343` `dead_lands_storm`; `.346` `generic_court`) |
| `.350`–`.380` | regional: `generic_peace`, `generic_court`, `generic_wilds`, `generic_sea` as fits; `.354` `concord_council`; `.379`, `.380` `gala_court` is not used (it shows Lorien's court); `generic_peace` instead |
| `.400`–`.414` | `.400` `king_is_dead`; `.401` `coronation`; `.402` `war_king`; `.403` `generic_wilds`; `.404`, `.405` `generic_war`; `.406` `zol_rising`; `.407` `unmasking`; `.408` `dead_lands_storm`; `.409`, `.410`, `.411` `generic_peace`; `.412` `dragon_return` is gated on `zin_eindil_returned`, so `generic_wilds`; `.413` `generic_war`; `.414` `generic_sea` |

Every gated key above is used only by an event that fires after its gate flag (C10).

## AI

- AI options follow the weights in brackets; the cautious, in-character choice is the heavier one.
- No AI option in this spec starts a war, a war goal, or a story flag (F1).
- Under `zin_rules_is_historical` the weights do not change: flavour has no historical option.

## Acceptance

1. Every human player of the fifteen countries gets its opening event on day 1, and no other opening event; `zin_lore.2` is the only one that names Afrit.
2. A 400-day AI observer run from 1 Thaw 1748: every scheduled 300-series event fires once for each eligible country inside its window; no war starts; `zin_gathering_dark` does not change because of any `zin_lore` event; `zin_mirolon_proof` changes by at most 6 from `zin_lore` events.
3. Secret scan: no `zin_lore` text outside `.2`, `.220` and `.221` contains "Afrit", "Hidden Council" or "demon" before `zin_afrit_revealed`; no text contains "Eindil" before `zin_eindil_named` or mentions the stranger before `zin_eindil_awake`; no text mentions a man in the ice before `zin_eindil_awake`.
4. No `zin_lore` text names Zol's administrator or servants, the King of Demons, Roka's people, Dardan's place, or what the Gala elves are to the Sunhot elves (phrase scan and review).
5. Every 400-series event fires once, after its flag and delay, only to its recipients.
6. Every event has option text and an `ai_chance`; ids are unique; `hoi4.event_inspect` shows every scheduled event reachable.

## Open questions

1. Is a fixed "Feast of Deliverance" on 1 Highsun acceptable? The day the Deliverer shielded the people is not dated in the vault.
2. Should the island fishermen's tales (`.330`–`.333`) be able to forewarn a court against Zol, or must that stay with the Zol mechanic's own rumour event, as here?
3. May Kilinti's ents say their oldest tree "was young when Elzon came" (`.351`)? It dates the forest only loosely.
4. `.5` (Zol's opening) has no beliefs or wants. Should Zol's player get any opening text at all beyond the land's description?
5. Should the Mushroom Forest be a key-site row so `.372` can fire, or should the event be dropped?
