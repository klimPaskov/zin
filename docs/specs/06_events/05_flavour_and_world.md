# Flavour and World Events

**Status:** Ready. Reviewed 19 October 2026 against CONVENTIONS "Status"; integrated 19 October 2026. **Priority:** 5. **Phase:** 5 (8 for the reserved ranges).

## Purpose

The first year must feel like a peaceful realm-management game: courts quarrel, prices rise, envoys take offence, and a few people see things nobody believes. Later, as the story moves, ordinary people should feel each great moment in their markets and temples. This spec defines that layer in namespace `zin_lore`:

1. **The opening events** `zin_lore.1`–`.15`: one per tier A power and for Dondor and Yeldenne, shown on the first day to human players. [01_start_situation.md](../02_lore/01_start_situation.md) owns their firing and the facts they rest on; this spec writes their text.
2. **Peaceful-start flavour** `zin_lore.300`–`.399`: the Deliverer's temples, trade, omens nobody believes, island fishermen, Mirolon's scouts, and regional flavour for every region.
3. **World flavour** `zin_lore.400`–`.449`: small events that let every region feel the story's great moments after they happen.

The flavour events `zin_lore.101`–`.211` and the Worshipdom's private record `zin_lore.220`–`.221` are specified in [04_fourth_age_history_for_play.md](../02_lore/04_fourth_age_history_for_play.md); this spec schedules them with the rest and does not repeat them.

The conventions C1 to C12 of [01_golden_king_and_succession.md](01_golden_king_and_succession.md) apply. Two more rules hold for everything here:

- **F1. Flavour never moves the story.** No flavour event sets or clears a contract story flag, starts a war or a war goal, changes `zin_gathering_dark`, or moves a mechanic's main variable by more than a token amount (at most 2 points, listed per event).
- **F2. Omens are not prophecies.** An omen is something people see and argue about. Its text never says what it means, never names a hidden power, and ends with the court not believing it. No omen foreshadows a sleeper in the ice (open in the start spec), the Golden King's death, or Afrit.

## Lore basis

| Fact | Status | Source |
| --- | --- | --- |
| Erdae has known more than a thousand years of genuine peace, prosperity, schools, medicine and trade | established | *Fourth Age Canon Register* |
| The start: the Golden King reigns, Eindil has not appeared, Afrit is unrevealed, Erdae seems at peace | established (owner) | *The Campaign of 4A 1748* |
| The dangers exist, but only a few people see them: Mirolon's scouts, island fishermen, the Hidden Council | established direction (proposed wording) | *Fourth Age Chronology* |
| The Deliverer is publicly worshipped as a New God, credited with saving Aenor during Elzon's fall; his institutions (the proposed Houses of the First Light) are sincere charities to most who serve in them | established (worship, the credit for Elzon's fall); proposed (Houses) | *Afrit the Deliverer*, *The Fourth Age of Erdae*, *Houses of the First Light* |
| Volgan rebuilds behind the Dead Lands' storms and heat; only Mirolon watches | established | *The Campaign of 4A 1748*, *Volgans Dead Lands* |
| Zol's dead stir in the islands of the Ocean of Zol; only fishermen see it; nobody at court believes them (4A 1744 tales proposed) | established direction, proposed date | *The Campaign of 4A 1748* |
| "Seventeen centuries" of peace, the Golden King's nineteenth year (crowned 4A 1729), the toll of 4A 1716, the Truce of the Grey Ford (4A 1745) | proposed | [01_start_situation.md](../02_lore/01_start_situation.md) |
| Ilvane, High Confessor, the Council's one seat of worship | proposed | [INTEGRATION_DECISIONS.md](../INTEGRATION_DECISIONS.md) N10, [afrit_hidden_council.md](../04_mechanics/afrit_hidden_council.md) |
| Regional names, peoples and roles | established names, working table, roster | *Erdae and Its Regions*, *Great Powers and Relations*, country roster |
| Every event, title, text, option and number below | **proposed** | this spec |

**Kept open:** no text names Zol's administrator, his servants, the King of Demons, Roka's people, Dardan's place, the Gala and Sunhot relationship, a sleeper in the ice, the age of Kilinti's forest, who holds Vez Nan, or what any omen means.

## Design

### The opening events (`zin_lore.1`–`.15`)

Fired on day 1 by the hidden scheduler `zin_lore.100` (below) for human players only (`is_ai = no`), for the matching country (by name, resolved to tag at build). Title: **The Year 1748** (start spec). Each has a three-paragraph description: **the situation**, **what the court believes**, **what it wants**, following the start spec's power table. Nothing hidden from that country is said. One option. Picture as listed. These events set nothing but their seen flag.

| Id | Country | Situation (paragraph 1) | Believes (2) | Wants (3) | Option | Picture |
| --- | --- | --- | --- | --- | --- | --- |
| `.1` | Aenor | "For seventeen centuries the Middle Kingdom has known peace. The Golden King is in the nineteenth year of his reign. The Concord's dominions grumble at his taxes, and the Golden Court sells what it likes." | "The peace is permanent. The Deliverer protects the crown. Volgan is a legend; the dominions will obey." | "The King wants glory and gold, and a triumph for his Lost Cause. The court wants offices. The dominions want lower taxes." | **"Long live the Golden King."** | `golden_court` |
| `.2` | Worshipdom | "The hermitage of the Zilin Hills holds three valleys and almost no army. Its strength is the pilgrims, couriers and confessors who pass through it to every court." Worshipdom-only: "You are Afrit. The world knows you as $zin_name_aurevan$ the Deliverer." | "The Golden King is a liability. The Lost Cause could become a rival seat of power. The Council judged so in 4A 1746." | "To take Aenor's crown openly, keep the eastern courts as a reserve, and one day hold Glo." | **"The Council sits."** | `council_chamber` |
| `.3` | Lerendor | "The two crowns of Lerendor and Lerenwaith are one kingdom, and its fleets guard the Narrow Strait." | "Aenor despises the North. The toll of 4A 1716 proves it. The treaty serves Parim." | "To honour the Treaty of the Narrow Strait, break it, or bend it into Leren mastery of the strait." | **"The North remembers."** | `strait_toll` |
| `.4` | Volgan | "Behind the storms and the heat of the Dead Lands, the hosts drill where no ship can see. Demon, Dolon and Nezer are sworn to Volgan." | "The kingdoms of men always divide. Their time is passing." | "To retake Mirolon, march north, and possess the green crystal of the north." | **"Patience."** | `dead_lands_storm` |
| `.5` | Zol | Short and impersonal: "The black north is silent. The dead walk the wastes, and the islands of the Ocean of Zol lie dark." No court, no beliefs, no person; the country shows only its emblem, The Will of Zol (S4) | (none: "No one in Erdae can say what the north believes.") | "It grows, very slowly." | **"…"** | `black_isles_lights` |
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

Text rules: `.2` is the only opening event that names Afrit, and only the Worshipdom can receive it (C1; the build whitelists it by recipient, like `.220` and `.221`). `$zin_name_aurevan$` is the localisation key of the public name ([02_characters.md](../02_lore/02_characters.md)), nested so the owner can rename Aurevan in one place. `.15` never says that Glo is Horos's heart (that label changes on `zin_horos_dead`, names spec). `.5` never names a keeper of Furviatlon or any servant. `.4` says "the green crystal of the north", not Glo's name; Volgan alone reads it.

### Scheduling

**Startup.** The engine's `on_startup` is not run in a country scope, so the builder writes `common/on_actions/zin_lore.txt` with one `on_startup` effect: if the global flag `zin_lore_started` is not set, set it and fire the hidden event `zin_lore.100` for every country (`every_country = { country_event = { id = zin_lore.100 } }`). The flag keeps a reloaded game from scheduling twice.

**`zin_lore.100`** (hidden, `is_triggered_only`, every country) does nothing if the country flag `zin_lore_scheduled` is set; otherwise it sets it and calls `zin_lore_schedule_flavour`:

- If the country is human (`is_ai = no`) and is one of the fifteen opening countries, fire its opening event on day 1.
- For each event of the tables below (and of the history-for-play spec) whose recipient test matches ROOT, fire `country_event = { id = zin_lore.<n> days = <window start offset> random_days = <window length> }`. Window offsets are counted in days from the start date (1 Thaw 1748, `1748.3.1`), so the schedule keeps its shape before and after the calendar spec lands. "any" means the first year: offset 14, length 350.
- Events marked "random share" are scheduled only for that share of matching countries (`random_list` with the share and its remainder).

Every scheduled event's `trigger` repeats its recipient test and `NOT = { has_country_flag = zin_lore_seen_<n> }`, so a country that changed in the meantime is skipped; the first effect of every option's `immediate` sets `zin_lore_seen_<n>`.

**World flavour** (`zin_lore.400`–`.449`) depends on story flags, which do not exist at startup. It is fired by the lore block `zin_story_tick_lore` of the story runner (C6; `zin_story_tick` calls it each month): for each 400-series event whose story flag is set and whose global flag `zin_story_done_lore_<n>` is not (C6: the namespace without its `zin_` prefix), it sets that flag and fires the event to every recipient with `days = <delay>` and `random_days = 7`. The monthly tick can add up to 30 days to a delay. Delays are counted from when the tick sees the flag, so `zin_story_pace` does not touch them (V4 concerns floor dates only).

**Recipient tests.** "Region" is the region column of [01_tiers_and_coverage.md](../05_focus_trees/01_tiers_and_coverage.md), read at run time from the country flag `zin_region_<key>` that the economy spec sets on startup for every country ([02_economy.md](../03_gameplay/02_economy.md); keys `middle_lands` (Aenor Isle included), `north_lands`, `cold_lands`, `west_lands`, `tritons_islands`, `dark_lands`, `magical_lands`, `zols_mistake`, `dead_lands`, `east_lands`, `islands_of_the_south`, `lands_of_the_sun`). The other words in the tables mean:

| Word | Test |
| --- | --- |
| Middle Lands countries | flag `zin_region_middle_lands` (Asgard on Aenor Isle included) |
| Concord dominion | `is_subject_of` Aenor |
| Light country | `has_government = democratic` |
| footholds ≥ n | `check_variable = { zin_footholds > n−1 }` ([afrit_hidden_council.md](../04_mechanics/afrit_hidden_council.md)) |
| Sunhot realm | people `sun_elves` (`has_country_flag = zin_people_sun_elves`) |
| elven realm of the Magical Lands | flag `zin_region_magical_lands` and `has_country_flag = zin_people_elves` |
| wall realm | `zin_elves_is_wall_realm` ([elves_wall_and_dragons.md](../04_mechanics/elves_wall_and_dragons.md)) |
| coastal | `any_owned_state = { is_coastal = yes }` |
| the coast list | `zin_is_zol_coast_country`: `any_owned_state = { zin_is_site_ocean_of_zol_coast = yes }` (the key-site trigger the Zol rumour roll and `zin_lore.180` use); never Zol itself |
| a named country | `original_tag` of that country, and the country exists |

### Peaceful-start flavour (`zin_lore.300`–`.399`)

Window: 1 Thaw 1748 to 1 Thaw 1749 unless stated. Effects are design targets. AI weights in brackets. "PP" is political power; "stability +0.01" is `add_stability = 0.01`; "opinion" changes use the opinion modifiers below, and "X's opinion of us" means X gains the modifier towards ROOT.

#### The Deliverer's temples (300–309)

| Id | Title | To | Window | Text gist | Options (effects; AI) |
| --- | --- | --- | --- | --- | --- |
| `.300` | The Feast of Deliverance | every country with footholds ≥ 1, except the Worshipdom, Volgan, Zol and their subjects | 1 Highsun 1748 (offset 92, length 0) | "Today the temples remember how the Deliverer shielded the people when Elzon fell. Bread is blessed and given away." | **"Keep the feast."** −10 PP; stability +0.01 (70). **"A day like any other."** +10 PP (30) |
| `.301` | A Healer Who Asks Nothing | random share 30% of countries with footholds ≥ 1 | any | "A healer of the Houses of the First Light saved a lord's child from fever and would not take payment." | **"Reward the Houses."** −10 PP; our opinion of the Worshipdom `zin_opinion_lore_goodwill` (60). **"Thank the healer."** stability +0.01 (40) |
| `.302` | The Birth Rolls | every Concord dominion with footholds ≥ 2 | any | "The Houses ask to copy our birth rolls, to keep them safe with Parim's." | **"Let them copy the rolls."** stability +0.01; `zin_aenor_add_council_influence` value 1 (70). **"We keep our own rolls."** +10 PP (30; Selen 100) |
| `.303` | A Sermon on Gratitude | Aenor | Rainwake 1748 | "The High Confessor preaches in Parim that seventeen centuries of peace are the Deliverer's gift, and that a grateful kingdom is a safe one." | **"So it is sung."** stability +0.01 |
| `.304` | Grain From the Temple Stores | random share 20% of countries with footholds ≥ 2 and stability below 50% | any | "A poor harvest in the hills. The Houses opened their grain stores before our own officials had counted the sacks." | **"Be grateful."** stability +0.02 (80). **"Ask who paid for the grain."** −10 PP; nothing else (20) |
| `.305` | A Temple Too Rich | random share 15% of Light countries with footholds ≥ 2 | any | "A provincial governor complains that the local temple owns more land than he does." | **"Let the temple keep its gifts."** nothing (60). **"Tax the temple land."** +25 PP; stability −0.01 (40) |

None of these says who the Deliverer is, what the Houses gather, or that the Council exists. `.302`'s token council change (1 point) is the only mechanic effect (F1). `.303`'s preacher is the public office of Ilvane (N10); the text gives no personal name and says nothing of a council seat.

#### Trade (310–319)

| Id | Title | To | Window | Text gist | Options (effects; AI) |
| --- | --- | --- | --- | --- | --- |
| `.310` | The Lake Fleet Comes In | Aenor | Harvest 1748 | "The grain fleet of the Great Lake is in. The harbours of Parim are full to the breakwater." | **"Store it."** stability +0.02 (50). **"Sell it abroad."** +25 PP (50) |
| `.311` | A Caravan From Beyond the Wall | Konori, Noleksun, Kingson | any | "An eastern caravan came through the elven roads with pepper, glass and stories of rich courts." | **"Buy the spices."** −10 PP; stability +0.01 (50). **"Tax the caravan."** +15 PP (50) |
| `.312` | Furs for the South | Coldor, Windwaith, and a random half of the other coastal Cold Lands countries | Emberleaf 1748 | "The fur ships sail south before the ice. The West Lands pay well this year." | **"Send the best furs."** +20 PP |
| `.313` | Sun-Silk at the Harbour | every Islands of the South country; coastal Lands of the Sun countries | any | "Traders from the tall folk's realms bring white-gold silk and buy salt fish." | **"Trade fairly."** our opinion of one random coastal Lands of the Sun country `zin_opinion_lore_goodwill` (a Lands of the Sun recipient picks another one) |
| `.314` | The Price of Salt | every Dark Lands country except Goldoroth | any | "Salt from Cocanoor's pans costs twice what it did. Nobody else sells it." | **"Pay it."** −10 PP (60). **"Make do without."** stability −0.01 (40) |
| `.315` | Timber Rafts on the River | Gunwaith, Girdon, Lambin | Sowing 1748 | "Log rafts come down the rivers from the northern forests, bound for the shipyards." | **"Build boats."** navy experience +3 (50). **"Sell the timber to Aenor."** +15 PP; Aenor's opinion of us `zin_opinion_lore_regard` (50) |
| `.316` | Pirates Hanged at Adel | Adel, Pollos, Raerby | any | "Three pirates are hanged on the quay. Their captain swears he was a merchant who missed a toll." | **"Hang him too."** stability +0.01 (60). **"Fine him and let him sail."** +15 PP (40) |
| `.317` | A Merchant Prince's Wedding | Stabilo | Goldfield 1748 | "Two houses of Postondoroth marry their fortunes. The feast lasts nine days." | **"Attend."** −10 PP; stability +0.01 |

#### Omens nobody believes (320–329)

Every omen follows F2: the text describes, the court dismisses, nothing is explained.

| Id | Title | To | Window | Text gist | Options (effects; AI) |
| --- | --- | --- | --- | --- | --- |
| `.320` | The Lake Is Too Still | Aenor | Highsun 1748 | "For three days the Great Lake did not ripple. The priests call it a blessing. The fishermen do not go out." | **"A blessing."** stability +0.01 (90). **"Ask the university."** `zin_aenor_add_lost_cause` value 1 (10) |
| `.321` | Birds Leave the Northern Cliffs | the coast list | any | "The seabirds have left the northern cliffs a month early. Old women say it means a hard winter." | **"A hard winter, then."** nothing |
| `.322` | Ash on the Wind | Mirolon, Herez | any | "Grey ash fell on the passes in a week without clouds. It came from the south." | Mirolon: **"Write it down."** `zin_mirolon_add_proof` value 1. Herez: **"Volcanoes in the Dead Lands."** nothing |
| `.323` | A Two-Headed Calf | random share 25% of Middle Lands countries | any | "A calf with two heads was born in a village near the capital. Half the province has come to see it." | **"Sell it to a travelling show."** +10 PP (60). **"Let the priests bless it."** stability +0.01 (40) |
| `.324` | A Red Moon Over Cocanoor | Goldoroth, Dondor | Emberleaf 1748 | Goldoroth: "The Fire-Speakers say the red moon wants war." Dondor: "The moon was red over the orc country. Our watchmen counted the fires." | Goldoroth: **"Not this year."** stability +0.01 (80) / **"The clans grow restless."** war support +0.02 (20). Dondor: **"Light the beacons."** nothing |
| `.325` | A Star Falls in the East | random share 30% of East Lands countries | any | "A star fell over the desert. Court astrologers write three opinions and charge for each." | **"Pay for the best one."** −10 PP; stability +0.01 (50). **"Dismiss them."** nothing (50) |
| `.326` | Smoke Seen From the Elven Hills | random share 40% of elven realms of the Magical Lands | any | "An elder says she saw smoke far to the south and far to the north on the same evening. The young ones laugh." | **"Let the young laugh."** nothing |
| `.327` | The Bell That Rang by Itself | random share 15% of North Lands countries | any | "A harbour bell rang at midnight with no one in the tower. The wind, says the harbour master." | **"The wind."** nothing |

#### Island fishermen (330–339)

To the coast list, which holds every North Lands crown, island or not, that faces the Ocean of Zol. Separate from the Zol mechanic's rumour roll (`zin_mistake.2`, [zols_mistake.md](../04_mechanics/zols_mistake.md)), which alone can add to `zin_gathering_dark` or forewarn a court (`zin_zol_forewarned`); these do neither (F1).

| Id | Title | To | Window | Text gist | Options (effects; AI) |
| --- | --- | --- | --- | --- | --- |
| `.330` | Nets Full of Black Water | random share 50% of the coast list | any | "The fishermen of the north coast say their nets came up full of water as black as ink, and no fish." | **"Fishermen's tales."** nothing (90). **"Send a clerk to look."** −5 PP (10) |
| `.331` | The Boat That Came Back Empty | random share 30% of the coast list | any | "A fishing boat drifted home with its nets folded and its crew gone. There was no storm." | **"Pay the widows."** −10 PP; stability +0.01 (70). **"Keep it in the village."** nothing (30) |
| `.332` | A Fisherman Before the Court | the tier A countries in the coast list, and Lerendor | Fallowing 1748 | "An old fisherman insists before the court that he saw men walking on the sea floor among the black islands. The court laughs. He does not." | **"Laugh with the court."** +5 PP (90). **"Give him a pension and silence."** −10 PP (10) |
| `.333` | The Fleet Stays South | random share 30% of the coast list | Thaw 1749 (offset 365, length 30) | "This spring the fishing fleets will not sail north of the last cape. No captain will say why." | **"Order them north."** +10 PP; stability −0.01 (40). **"Let them fish where they like."** nothing (60) |

#### Mirolon's scouts (340–349)

To Mirolon unless stated. Proof and pass changes go through `zin_mirolon_add_proof` and `zin_mirolon_add_passes` ([volgan_southern_dominion.md](../04_mechanics/volgan_southern_dominion.md)). Together the `zin_lore` events add at most 6 proof in 4A 1748 before the owner's doubling (the owner doubles gains while Volgan's veil is below 50, so at most 12), which keeps the historical path's proof below 75 (Volgan spec acceptance).

| Id | Title | To | Window | Text gist | Options (effects; AI) |
| --- | --- | --- | --- | --- | --- |
| `.340` | The Wall of Names | Mirolon | Thaw 1748 | "On the wardens' wall in the passes, the names of scouts who never came back fill four hundred years of stone." | **"Add none this year."** stability +0.01 (60). **"Read them aloud."** war support +0.02 (40) |
| `.341` | Tracks in the Ash | Mirolon | any | "Scouts found tracks in the ash south of the passes: many feet, in step, not all of them human." | **"Copy them for the archives."** proof +2 (80). **"Tracks blow away."** nothing (20) |
| `.342` | A Scout Comes Back Changed | Mirolon | any | "A scout came back from beyond the storms. He eats and sleeps. He will not speak of what he saw." | **"Give him a pension."** −10 PP; stability +0.01 (70). **"Send him back south."** proof +1; stability −0.01 (30) |
| `.343` | The Night Fires Counted | Mirolon | Emberleaf 1748 | "The wardens counted the fires in the Dead Lands this autumn. There are more than last year. There were more last year than the year before." | **"Send the count to Parim."** Aenor's opinion of us `zin_opinion_lore_regard`; nothing else (50). **"Keep counting."** proof +2 (50) |
| `.344` | A Letter From Mirolon | Herez | any | "The High Warden writes to Herez again: watch the south. Herez's lords have read such letters before." | **"Watch with them."** our opinion of Mirolon `zin_opinion_lore_goodwill` (40). **"Mirolon frets."** nothing (60) |
| `.345` | The Lake Towns Count the Cost | Mirolon | Longnight 1748 | "The lake towns pay for the watch on the passes. Their councils ask how long they must pay for a war nobody else believes in." | **"As long as Volgan lives."** stability −0.01; war support +0.02 (70). **"Lighten the levy."** +15 PP; `zin_mirolon_add_passes` value −2 (30) |
| `.346` | Mirolonese Students in Parim | Aenor | any | "Students from Mirolon at the University of Parim are mocked as 'the boys who fear the dark'." | **"Boys will be boys."** nothing (80). **"Let the masters hear them."** `zin_aenor_add_lost_cause` value 1 (20) |

#### Regional flavour (350–399)

One or two events per region. Window: any, unless stated. Recipients by name; a missing country is skipped.

| Id | Title | To | Text gist | Options (effects; AI) |
| --- | --- | --- | --- | --- |
| `.350` | The Restorer's Statue | Selen | "Selen's square has a new statue of Harion the Restorer. It is taller than any statue of a king in Parim." | **"Let Parim see it."** stability +0.01; Aenor's opinion of us `zin_opinion_lore_slight` (60). **"Move it to the hall."** nothing (40) |
| `.351` | Ents Count the Rings | Kilinti | "The ents have counted the rings of the oldest tree in the forest again. They lost count, and began again." | **"Let them count."** stability +0.01 |
| `.352` | The Giants' Fair | Hiloron | "Giants come down to the lake for the fair. Merchants sell them boots that are never big enough." | **"Trade."** +10 PP |
| `.353` | Horse Fair at Hunhun | Hunhun | "The riders' horse fair. A lord of Parim offers too little for the best stallion and is laughed home." | **"Sell to the riders."** army experience +3 (50). **"Sell to Parim anyway."** +15 PP (50) |
| `.354` | Gate Day at Kingson | Kingson | "Once a year the great gate in the Wall stands open from dawn to dusk, and elves and men trade in its shadow." | **"Keep the old custom."** the Magical Forest's opinion of us `zin_opinion_lore_regard` |
| `.355` | Every Envoy Returned | Cursed Lands | "The Veiled Elder sent back every envoy of the year with their letters unopened." Nothing more is invented about the realm | **"We wish to be left alone."** stability +0.01 |
| `.356` | Raids From the Red Woods | Bloody Forest; every Concord dominion that borders it (`is_neighbor_of` Bloody Forest) | Bloody Forest: "Our young men raided a farm across the border. The farmer's dog bit one of them." Neighbours: "Raiders from the Bloody Forest burned a barn." | Bloody Forest: **"Good hunting."** war support +0.01. Neighbours: **"Double the border watch."** −10 PP. Never a war |
| `.357` | The First Port | Asgard | "Asgard remembers that its harbour was the first the Aenoran ships reached, long ago." | **"Ring the harbour bells."** stability +0.01 |
| `.358` | Between Two Masters | Molot | "Sonargur and Parim both sent envoys this month. Each asked for the same thing." | **"Smile at both."** +15 PP |
| `.359` | The Gateway Toll | R'en | "Ships between the Leren and the Aenoran seas pay R'en's toll. Both seas' captains complain." | **"Raise it."** +20 PP; Lerendor's opinion of us `zin_opinion_lore_slight` (50). **"Keep it."** nothing (50) |
| `.360` | The Long Hunt | Yeti Lands | "The yeti of the white valleys go on the long hunt. They come back with more than they need and share it." | **"Share it."** stability +0.01 |
| `.361` | The Frost-King's Riddle | Titanos | "The Frost-King sets a riddle for every envoy. Nobody has answered it in a hundred years." | **"Set it again."** stability +0.01 |
| `.362` | The Windwaith Regatta | Windwaith | "The maritime republic races its ships around the capes. Coldor's captains lose again." | **"To the winners."** navy experience +3 |
| `.363` | Isengard's New Fort | Isengard; Coldor | Isengard: "Another fort rises on the march." Coldor: "Isengard builds another fort." | Isengard: **"Let Fandanar see it."** war support +0.01. Coldor: **"Count it."** nothing |
| `.364` | Companies for Hire | Buldor | "The Buldor companies look for contracts. In a year of peace the only buyers are merchants who want guards." | **"Guard the caravans."** +15 PP |
| `.365` | The Guild Strike | Kradlon | "Kradlon's guilds stop the forges for a week over Aenoran tariffs on their iron." | **"Back the guilds."** stability +0.01; Aenor's opinion of us `zin_opinion_lore_slight` (60). **"End the strike."** +10 PP; stability −0.01 (40) |
| `.366` | Ledger Day in Corogon | Corogon | "The trading republic opens its ledgers to the citizens once a year. They balance." | **"Publish them."** stability +0.01 |
| `.367` | Storm Season in the Pupor Ocean | random share 40% of Triton's Islands countries | "The autumn storms came early. Two charts were wrong." | **"Redraw the charts."** navy experience +2 |
| `.368` | Blackton's Free Market | Blackton | "Orcs, men and goblins trade in Blackton's market under one rule: no blades drawn." | **"Keep the rule."** stability +0.01; +5 PP |
| `.369` | The Troll Bridge Toll | Troll Forest | "Travellers through the Troll Forest pay at the old bridge. The trolls take payment in iron, not gold." | **"Iron, then."** +10 PP |
| `.370` | Grove Songs in Herrodon | Herrodon; Andos Enda | Herrodon: "The grove songs this year name an old slight from Andos Enda." Andos Enda: "Herrodon is singing about us again." | Herrodon: **"Sing louder."** our opinion of Andos Enda `zin_opinion_lore_slight`. Andos Enda: **"Sing back."** our opinion of Herrodon `zin_opinion_lore_slight` |
| `.371` | Wardens of the High Passes | Nolorim | "Nolorim's pass-wardens change the guard on the high road, as they have every spring for ages." | **"The passes are ours."** army experience +3 |
| `.372` | The Mushroom Forest Blooms | the owner of a Mushroom Forest state (`zin_is_site_mushroom_forest`, a key-site row that does not exist yet) | "The giant mushrooms bloomed in one night. The glow could be seen from the Wall." | **"A good year."** stability +0.01 |
| `.373` | The Holy Breeze | Olen | "The breeze from the sea that Olen calls holy blew for nine days this summer." | **"Give thanks."** stability +0.01 |
| `.374` | The Warlord's Games | Nan | "Nan's warlord holds games. The winners join his guard." | **"Watch the games."** army experience +3 |
| `.375` | The Lake Assembly | Mora | "Mora's lake towns send their speakers to the assembly. It argues for a month about fishing rights." | **"Vote."** stability +0.01 |
| `.376` | Red Banners | Avalon | "Avalon's revolutionaries celebrate the anniversary of their republic. The neighbouring kings close their borders for a day." | **"Let them close them."** war support +0.01 |
| `.377` | The Rice Harvest | Howan | "The rice terraces of Howan gave a double harvest." | **"Store it."** stability +0.01 |
| `.378` | The Canoe Race | Nara, Verde | "The islands race their canoes across the strait. Both claim the victory." | **"We won."** stability +0.01 |
| `.379` | The Noon Festival | every Sunhot realm (The Lands of Light among them) | "At noon on the longest day the tall folk gather in silence to watch the sun stand still." | **"Keep the silence."** stability +0.01 |
| `.380` | Pilgrims to the Sea of Gods | random share 30% of Lands of the Sun countries | "Pilgrims walk to the shore of the Sea of Gods to throw flowers on the water." | **"Walk with them."** stability +0.01 |

`.372` is built only when the key-sites table ([01_map/02_key_sites.md](../01_map/02_key_sites.md)) has a Mushroom Forest row; until then the builder leaves it out and reports it (see Open questions). `.374` says "Nan's warlord", not where he sits, because the owner of Vez Nan is open (OPEN_QUESTIONS "regions: dark, magical, dead" 10). `.368` names goblins among Blackton's traders and never calls a hold goblin (owner question 12).

### World flavour (`zin_lore.400`–`.449`)

Fired by `zin_story_tick_lore` once a story flag is set. Each is short, has one or two options with token effects, and tells ordinary life, not the story itself (the owners' news events do that). Pre-reveal and pre-naming rules (C1, C2) apply to the text at the moment the event fires.

| Id | Title | To | Fired | Text gist | Options (effects; AI) |
| --- | --- | --- | --- | --- | --- |
| `.400` | Black Ribbons in the Market | every Middle Lands country | `zin_golden_king_dead` + 5 days | "The markets are hung with black ribbons. The cloth merchants have never sold so much." | **"Mourn the King."** stability +0.01 |
| `.401` | Hymns for the God-King | every country with footholds ≥ 2, except Aenor and the Worshipdom | `zin_aurevan_crowned` + 30 days | "The temples sing new hymns: [zin_loc_deliverer] wears Aenor's crown." | **"Sing them."** stability +0.01 (70). **"Our court keeps its own hymns."** nothing (30) |
| `.402` | Songs of the Grey Ford | every West Lands country | `zin_eindil_war_king` + 60 days | "Bards sing of the war-king who made the peace at the Grey Ford and gave the crown back." Calls him "the King Without a House", never by name | **"Sing it again."** stability +0.01 |
| `.403` | Silence at the Castle | Coldor, Horidor, Fearno and the owner of `zin_is_site_yeldenne_landing` | `zin_horos_dead` + 30 days | "Traders say the lord of the silent castle in the north is dead. A warden keeps its gates now. Nobody goes in." Never says what Glo was or where it went | **"Nobody goes in."** nothing |
| `.404` | Bread Doubles in Price | every country at war (`has_war = yes`), and every country bordering one (`any_neighbor_country = { has_war = yes }`) | `zin_war_of_last_crowns` + 60 days | "The price of bread has doubled in a season." | **"Open the granaries."** −15 PP; stability +0.01 (60). **"Let the market settle it."** stability −0.01 (40) |
| `.405` | Swords for Hire | Buldor, and a random half of the other West Lands countries | `zin_war_of_last_crowns` + 30 days | "Every company in the West has a contract now. Some have two." | **"Sign the best."** +25 PP |
| `.406` | Empty Villages on the Coast | the coast list | `zin_zol_rising` + 30 days | "The fishing villages of the north coast are empty. The fishermen were right." | **"Bring them inland."** −10 PP; manpower +1,000 |
| `.407` | Broken Images | every Light country with footholds ≥ 1 | `zin_afrit_revealed` + 14 days | "In the night someone broke the Deliverer's image at the temple door. In the morning the poor still came for bread." | **"Punish the breakers."** stability +0.01 (40). **"Leave the images broken."** war support +0.01 (60) |
| `.408` | The Storms Thin | Mirolon if it exists, Olen, Nan, and every Dead Lands country that is neither Volgan nor its subject | `zin_volgan_body_destroyed` + 30 days | "Sailors say the storms over the south are thinner this season. Nobody knows what that means." Says nothing of Volgan's fate | **"Watch the south."** nothing |
| `.409` | White Banners in the South | every Lands of the Sun country except the Gala Elves | `zin_lorien_dead` + 30 days | "The towers of the south hang white banners for the King of Gala." Says nothing of kinship | **"Hang them."** stability +0.01 |
| `.410` | Refugees Come Home | every Middle Lands country | `zin_zol_withdrawn` + 90 days | "The roads to the Great Lake are full again, this time going home." | **"Help them home."** −10 PP; stability +0.02 |
| `.411` | Bells for a New King | every country not at war with Aenor, except Aenor | `zin_eindil_crowned` + 7 days | "Bells ring in Parim for a king of Aen's line. In our own streets, people argue whether that is good news." | **"It is."** our opinion of Aenor `zin_opinion_lore_regard` (60). **"We will see."** nothing (40) |
| `.412` | A Dragon Leaves the Roosts | every elven realm of the Magical Lands | `zin_eindil_dragon_pact` + 7 days | "A dragon has left the high roosts with a rider. The roost wardens say it went of its own will." | **"It chose."** nothing |
| `.413` | The Wall Without Its Watch | Kingson and every wall realm | `zin_afrit_abandoned_aenor` + 30 days | "Half the Wall's watchtowers are empty. The garrisons went to Parim, or east, or home." | **"Man our side."** −15 PP; army experience +3 |
| `.414` | Ships in Every Harbour | every Triton's Islands country | `zin_western_crossing` + 14 days | "Every hull that can float has been hired for the western crossing. Our harbours are empty and our purses full." | **"Count the silver."** +20 PP |

Reserved: `.415`–`.449` (phase 8 world flavour); `.450`–`.499` (post-war sandbox flavour after an ending).

## Implementation

### Builder and files

The new builder module **`tools/content/modules/events_zin_lore.mjs`** writes the whole `zin_lore` namespace, because one namespace is one event file: the opening events and the debug check of the start spec (1–20), the scheduler and flavour of the history-for-play spec (100–221; id 191 is not written, because the eastern courts' summons is the eastern kings' `zin_east.30`, decision O4), and this spec's 300- and 400-series. `tools/content/modules/lore.mjs` keeps its one job (staging the vault). No `zin_lore` file exists in the game today; the interim stubs `events/zin_world.txt` and `common/decisions/zin_decisions_interim.txt` (written by `vanilla_removal.mjs`) belong to other specs and are not touched here.

| Path | Written by | Content |
| --- | --- | --- |
| `tools/content/data/lore_events.json` | data (read) | Every `zin_lore` event as data: id, title, desc, picture, recipients, window or story flag and delay, random share, options with effects and AI weights (the history-for-play spec's file, extended with the 1–15, 300- and 400-series) |
| `tools/content/data/countries.json` | data (read) | Names and tags; named recipients resolve to tags here |
| `events/zin_lore.txt` | `events_zin_lore.mjs` | Namespace `zin_lore`; every event `is_triggered_only = yes` |
| `common/on_actions/zin_lore.txt` | `events_zin_lore.mjs` | The guarded `on_startup` effect that fires `zin_lore.100` for every country |
| `common/scripted_effects/zin_lore.txt` | `events_zin_lore.mjs` | `zin_lore_schedule_flavour` (opening events, startup windows, random shares) |
| `common/scripted_effects/zin_lore_story.txt` | `events_zin_lore.mjs` | `zin_story_tick_lore` (400-series); called by `zin_story_tick` (C6), whose file `zin_story.txt` another module writes |
| `common/scripted_triggers/zin_lore_flavour.txt` | `events_zin_lore.mjs` | `zin_is_zol_coast_country` |
| `common/opinion_modifiers/zin_lore.txt` | `events_zin_lore.mjs` | The three opinion modifiers below |
| `localisation/english/zin_lore_l_english.yml` | `events_zin_lore.mjs` | All text, UTF-8 with BOM, Windows-1252 characters only |

`common/scripted_triggers/zin_lore.txt` and `common/scripted_localisation/zin_lore.txt` are the start and names specs' files; this spec only reads `zin_loc_deliverer`, `zin_loc_eindil` and `zin_name_aurevan` from them. `zin_is_site_ocean_of_zol_coast`, `zin_is_site_yeldenne_landing` and (when its row exists) `zin_is_site_mushroom_forest` come from `common/scripted_triggers/zin_sites.txt`, generated from the key-sites table.

### Engine names used

Effects: `country_event` (with `days`, `random_days`), `every_country`, `random_country`, `random_list`, `add_political_power`, `add_stability`, `add_war_support`, `army_experience`, `navy_experience`, `add_manpower`, `add_opinion_modifier`, `set_country_flag`, `set_global_flag`. Triggers: `is_ai`, `original_tag`, `exists`, `has_country_flag`, `has_global_flag`, `has_government`, `is_subject_of`, `is_neighbor_of`, `has_war`, `has_war_with`, `any_neighbor_country`, `any_owned_state`, `is_coastal`, `check_variable`, `has_stability`. On action: `on_startup`. All exist in 1.19.3 (game documentation and `common/on_actions/00_on_actions.txt`). Mechanic calls: `zin_aenor_add_council_influence`, `zin_aenor_add_lost_cause` ([aenor_court_and_succession.md](../04_mechanics/aenor_court_and_succession.md)), `zin_mirolon_add_proof`, `zin_mirolon_add_passes` ([volgan_southern_dominion.md](../04_mechanics/volgan_southern_dominion.md)), each with `value`.

### Ids (`zin_lore`)

| Range | Owner | Use |
| --- | --- | --- |
| 1–15 | start spec (firing, facts) / this spec (text) | Opening events |
| 20 | start spec | Debug start check (`zin_rule_debug_checks`) |
| 100 | history-for-play spec | Hidden scheduler |
| 101–211 | history-for-play spec | Regional flavour of memory (191 not used, O4) |
| 220–221 | history-for-play spec | Worshipdom's record |
| 300–309 | this spec | The Deliverer's temples |
| 310–319 | this spec | Trade |
| 320–329 | this spec | Omens nobody believes |
| 330–339 | this spec | Island fishermen |
| 340–349 | this spec | Mirolon's scouts |
| 350–399 | this spec | Regional flavour (350–380 used) |
| 400–449 | this spec | World flavour (400–414 used, 415–449 reserved) |
| 450–499 | reserved | Post-war sandbox flavour |

This matches the contract register's `zin_lore.300-.414` with 415–499 reserved.

### Flags and opinion modifiers

| Name | Kind | Meaning |
| --- | --- | --- |
| `zin_lore_seen_<n>` | country flag | The country has seen `zin_lore.<n>` (contract pattern) |
| `zin_lore_scheduled` | country flag | `zin_lore.100` has scheduled this country |
| `zin_lore_started` | global flag | The startup block has run |
| `zin_story_done_lore_<n>` | global flag | A 400-series event has been sent (contract pattern `zin_story_done_<namespace>_<id>`, C6) |
| `zin_opinion_lore_goodwill` | opinion modifier | +10, decays 1 a month |
| `zin_opinion_lore_regard` | opinion modifier | +5, decays 1 a month |
| `zin_opinion_lore_slight` | opinion modifier | −5, decays 1 a month |

No story flag is set by this spec.

### Pictures

Every key below exists today as `GFX_zin_evt_<key>` (`tools/content/data/presentation-cells.json`).

| Events | Key |
| --- | --- |
| `.1`–`.15` | As in the opening table |
| `.300`–`.305` | `houses` (`.300` `hermitage`; `.303` `houses` until the requested key `temple_parim_interior` exists, then that key; the request is in [01](01_golden_king_and_succession.md)) |
| `.310`–`.317` | `generic_peace` (`.310`, `.312`, `.313`, `.316` `generic_sea`) |
| `.320`–`.327` | `generic_wilds` (`.324` `generic_war`) |
| `.330`–`.333` | `black_ships_tale` |
| `.340`–`.346` | `mirolon_passes` (`.343` `dead_lands_storm`; `.346` `generic_court`) |
| `.350`–`.380` | `generic_court` for `.350`, `.355`, `.358`, `.359`, `.365`, `.366`, `.375`, `.376`; `concord_council` for `.354`; `generic_sea` for `.357`, `.362`, `.367`, `.378`; `generic_war` for `.356`, `.363`, `.364`, `.374`; `generic_peace` for `.352`, `.353`, `.368`, `.369`, `.377`, `.379`, `.380`; `generic_wilds` for `.351`, `.360`, `.361`, `.370`, `.371`, `.372`, `.373` |
| `.400`–`.414` | `.400` `king_is_dead`; `.401` `coronation`; `.402` `war_king`; `.403` `generic_wilds`; `.404`, `.405` `generic_war`; `.406` `zol_rising`; `.407` `unmasking`; `.408` `dead_lands_storm`; `.409`, `.410`, `.411` `generic_peace`; `.412` `generic_wilds` (`dragon_return` is gated on `zin_eindil_returned`); `.413` `generic_war`; `.414` `generic_sea` |

Gated keys are used only after their gate: `council_chamber` by `.2` (Worshipdom only); `king_is_dead` and `coronation` after `zin_golden_king_dead`; `war_king` after `zin_eindil_awake`; `zol_rising` after `zin_zol_rising`; `unmasking` after `zin_afrit_revealed` (C10). `gala_court` is used only by `.7`, because it shows Lorien's court.

## AI

- AI options follow the weights in brackets; the cautious, in-character choice is the heavier one.
- No AI option in this spec starts a war, a war goal, or a story flag (F1).
- Under `zin_rules_is_historical` the weights do not change: flavour has no historical option.

## Acceptance

Build tests (`npm test` in `tools/`):

1. Ids in `events/zin_lore.txt` are unique and inside the ranges above, no event has id 191, and every event writes `timeout_days = 30` (E2); every event has a title, a description, at least one option with text and an `ai_chance`, and a picture whose `GFX_zin_evt_<key>` exists.
2. Every gated picture key is used only by an event whose recipient test or story flag implies its gate.
3. Secret scan of `zin_lore_l_english.yml`: outside `.2`, `.220` and `.221` no text contains "Afrit" or "Hidden Council", and none puts "demon" beside "Deliverer"; no text before `.400` mentions Eindil, a stranger, the Man from the Ice or a man in the ice; `.402` does not contain "Eindil". `.2`, `.220` and `.221` can be received only by the Worshipdom.
4. Phrase scan and review: no `zin_lore` text names Zol's administrator or servants, the King of Demons, Roka's people, Dardan's place, what the Gala elves are to the Sunhot elves, or Vez Nan; no text uses a modern word or a real-world religious word ("Amen").
5. Every option's effects stay inside F1: no story flag, war, war goal or `zin_gathering_dark`; mechanic calls only those listed, each with an absolute value of at most 2.
6. `.372` is absent while the key-sites table has no Mushroom Forest row.

Isolated Linux run (one in-game year from 1 Thaw 1748):

7. Started as Aenor, the player receives `zin_lore.1` on day 1 and no other opening event; an observer run shows no opening event.
8. Every scheduled 300-series event fires at most once for each eligible country, inside its window; no war starts; `zin_gathering_dark` changes by nothing attributable to `zin_lore` events; `zin_mirolon_proof` changes by at most 12 from `zin_lore` events.
9. Saving and loading in the first month schedules nothing twice (`zin_lore_started`, `zin_lore_scheduled`).
10. A run with the story flags set by console fires each 400-series event once, after its flag and delay, only to its recipients; `hoi4.event_inspect` shows every scheduled event reachable.

## Open questions

These proceed on the proposal shown; the owner's answer goes into [OPEN_QUESTIONS.md](../OPEN_QUESTIONS.md) ("events").

1. *A fixed Feast of Deliverance on 1 Highsun* (events 16). Proposal: keep it. The vault credits the Deliverer with saving Aenor during Elzon's fall but does not date the rescue; the feast is a temple custom, not a date of history.
2. *May the fishermen's tales forewarn a court?* (events 17). Proposal: no. Forewarning (`zin_zol_forewarned`) stays with the Zol mechanic's rumour event `zin_mistake.2`.
3. *A Mushroom Forest key-site row* (events 18). Proposal: add the row `zin_is_site_mushroom_forest` inside the elven realm that holds the forest on the map (owner question 12: the Mushroom Forest lies inside an elven realm). Until the row exists, `.372` is not built.

Settled here (proposed): Kilinti's ents do not date their forest (`.351` no longer says "young when Elzon came"); Zol's player gets only the land's description in `.5`, as the start spec writes no beliefs for Zol.
