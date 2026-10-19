# Vanilla text sweep

**Status:** Draft. Written 19 October 2026 for the master plan's gap list ([00_master_overhaul_plan.md](../00_master_overhaul_plan.md) sections 6 and 7). **Priority:** 3. **Phase:** 3 (the glossary, the inventory and the scan start in wave 1; the families finish with the ruleset in wave 3; the whole-file conversion is stage 4).

Two points follow the Ready specs where the master plan's wording is older. The plan's P5 says the energy system becomes fuel from "charcoal and coal"; the Ready [economy spec](../03_gameplay/02_economy.md) makes it Provisions fed by Grain and bans the word coal, so the glossary and the banned list follow the economy spec. The plan's section 6 writes every family to `localisation/replace/`; [06_vanilla_removal_and_zero_errors.md](../00_foundation/06_vanilla_removal_and_zero_errors.md) section 3.5 ends the `replace` folder at stage 4, so this spec writes `replace` files in waves 1 to 3 and converts them to same-name whole-file overrides at stage 4 (section 5).

## Purpose

About 130,000 English localisation keys ship with the game. Roughly 39,000 of them sit in files a player reads while playing: window labels, tooltips, alerts, technology and unit text, the diplomacy window, the rule screens. They speak of factories, rifles, tanks, aircraft, democracy and 1936. None of them has an author yet. [PROGRAM.md](../PROGRAM.md) T3 requires that no modern word is shown anywhere, and the scan that proves it has to know every key the game can still display.

This spec defines the whole job: one master glossary that fixes every Erdae term once; the key families with their files, counts, writer modules and wording owners; the template mechanism that turns the glossary into text without copying a vanilla sentence; the scan that proves completeness and reports what is left; the banned-word list; and the order of work against vanilla removal stage 2. The glossary (`tools/content/data/glossary.json`) and the banned list (`tools/content/data/banned_words.json`) are written with this spec and are the first data the builder reads.

Out of scope here, and owned elsewhere: the wording of Erdae objects (technology, equipment, unit, focus, event and idea text belongs to the modules that define the objects), the month names ([01_start_and_calendar.md](../00_foundation/01_start_and_calendar.md)), the main menu, bookmark and difficulty wording ([03_main_menu_and_frontend.md](03_main_menu_and_frontend.md)), loading tips ([02_loading_screens_and_quotes.md](../08_art_and_assets/02_loading_screens_and_quotes.md)), music titles ([04_music_and_sound.md](../08_art_and_assets/04_music_and_sound.md)) and the decisions about rank names, weekday names, honours and the career screens ([06_career_honours.md](06_career_honours.md)). This spec supplies their keys to the scan and their glossary entries.

## Lore basis

| Fact | Status | Source |
| --- | --- | --- |
| Erdae has known more than seventeen centuries of peace; its realms are crowns, dominions, clans and island lordships, not modern states | proposed (campaign note) | *The Campaign of 4A 1748*, [02_full_ui_reskin.md](02_full_ui_reskin.md) |
| The Fourth Age is counted from the first restored king; the start is 1 Thaw, 4A 1748 | proposed | *Fourth Age Chronology*, [01_start_and_calendar.md](../00_foundation/01_start_and_calendar.md) |
| Ordinary people do not know the name Afrit before the reveal; Eindil is "the Man from the Ice" before he is named | established; labels proposed | [03_names_and_terms.md](../02_lore/03_names_and_terms.md), decisions D3, D4 |
| Proper names, spellings and the retired names (Einendil, Edvoid, Rush, Klinti, Gorbat, Huhun, Hierarch, Sovereign Spirit) | established | [03_names_and_terms.md](../02_lore/03_names_and_terms.md) |
| Every common-noun term the glossary introduces (Authority, Calm, Levies, host, company, Art, Study, Reign, and the rest; Orders, the Valour pools, the ranks and the institutions are the institutions spec's proposals) | **proposed** | this spec; each is one glossary entry the owner can change |

The vault names no mechanical term. Nothing in the glossary closes an open question: no entry names Zol's administrator, the King of Demons, Roka's people or Volgan's former patron, and the veiled sun, the Deliverer's public sign, is not used as an image in any term or weekday.

## Design

### 1. What the game says today (measured)

Measured on the installed 1.19.3.0 by the first builder run (`modules/text_inventory.mjs`, see Implementation): 207 English files, 129,541 keys, 10 languages with the same file set plus a few extras (French has 211). Counts are keys. "Label" means an upper-case key such as an interface string; "other" means object ids and mixed-case keys. The classes are an approximation; the scan resolves objects exactly (section 6). "Error hits" counts keys whose vanilla value contains at least one word of an error-severity rule of the banned list (section 8), whole words only, after colour codes, icon codes, `$VARIABLE$` placeholders and `[calls]` are removed.

| Family | Files | Keys | Label | Other | With § | With £ | With $…$ | Error hits |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| core | 9 | 2,495 | 2,316 | 179 | 796 | 90 | 1,004 | 378 |
| platform | 12 | 963 | 896 | 67 | 53 | 0 | 52 | 335 |
| tooltips | 4 | 4,109 | 2,555 | 1,554 | 243 | 37 | 1,824 | 954 |
| alerts | 1 | 236 | 60 | 176 | 128 | 7 | 89 | 50 |
| tech | 4 | 3,507 | 802 | 2,705 | 220 | 65 | 415 | 1,176 |
| unit | 9 | 4,485 | 1,157 | 3,328 | 709 | 84 | 665 | 1,058 |
| equipment | 8 | 10,391 | 753 | 9,638 | 146 | 40 | 355 | 3,037 |
| ledger | 2 | 686 | 671 | 15 | 47 | 4 | 361 | 159 |
| diplomacy | 10 | 2,904 | 1,727 | 1,177 | 463 | 80 | 939 | 809 |
| politics | 3 | 596 | 313 | 283 | 248 | 155 | 213 | 112 |
| factions | 1 | 1,190 | 524 | 666 | 198 | 42 | 273 | 346 |
| mapmodes | 3 | 147 | 141 | 6 | 30 | 2 | 15 | 14 |
| intelligence | 10 | 1,304 | 436 | 868 | 370 | 24 | 315 | 320 |
| production | 5 | 2,607 | 743 | 1,864 | 289 | 44 | 866 | 609 |
| trade | 2 | 428 | 428 | 0 | 162 | 35 | 224 | 76 |
| supply | 1 | 124 | 117 | 7 | 23 | 5 | 76 | 26 |
| battle | 1 | 400 | 368 | 32 | 99 | 6 | 189 | 104 |
| naval | 1 | 104 | 96 | 8 | 44 | 26 | 54 | 10 |
| air | 1 | 470 | 458 | 12 | 229 | 3 | 147 | 125 |
| ranks (with weekday and division-title keys) | 2 | 375 | 236 | 139 | 22 | 11 | 58 | 36 |
| rules | 2 | 865 | 859 | 6 | 57 | 0 | 12 | 518 |
| difficulty | 1 | 2 | 0 | 2 | 0 | 0 | 0 | 2 |
| achievements | 3 | 650 | 490 | 160 | 49 | 7 | 70 | 210 |
| **Swept families** | **95** | **39,038** | **16,146** | **22,892** | **4,625** | **767** | **8,216** | **10,464** |
| music (04_music_and_sound) | 23 | 245 | | | | | | |
| tutorial (hidden, 03) | 1 | 187 | | | | | | |
| map names (state, region, victory point, supply area) | 4 | 4,108 | | | | | | |
| content (focus, events, ideas, decisions, characters, countries, parties, DLC) | 84 | 85,963 | | | | | | |
| **All English** | **207** | **129,541** | | | | | | |

The swept families hold 39,038 keys; 26.8% of them contain an error-class word. About 17,700 of the keys need an author: the 16,146 label keys and the 1,554 modifier and object ids ZIN keeps. Of those, the 1,030 trigger and 487 effect sentences and the 2,582 modifier names (4,100 keys) are formulaic and are written through frames and stems (section 4). The 10,391 equipment keys are mostly ids of equipment that stage 2 removes; the scan drops them (section 6).

The measurements also show three things the design depends on. First, 11,365 keys carry colour codes, 1,433 carry text icons and 12,743 carry `$…$` placeholders, so a ZIN value that drops one breaks a tooltip. Second, tag-prefixed keys (a vanilla country tag followed by an underscore) are the bulk of the content files and are unreachable once only ZIN tags exist. Third, the kept engine ids live inside "content" files: the ideology names in `parties_l_english.yml`, the laws in `ideas_l_english.yml`, the state categories in `state_l_english.yml`, the autonomy states in `autonomy_l_english.yml`. A key belongs to a family by what it names, not by the file it sits in (section 5).

### 2. The master glossary

`tools/content/data/glossary.json` is the single source of Erdae terms. Every builder, every family data file and the characters, focus and event modules read it through `tools/content/lib/text_engine.mjs`. The first set has **253 entries** (written with this spec).

**Entry.** One engine concept.

| Field | Meaning |
| --- | --- |
| `id` | Stable concept id (snake case). Not a game identifier |
| `kind` | One of 23 kinds: stat, resource, building, state_category, logistics, system, unit, unit_class, ship_class, institution, rank, role, tech, politics, diplomacy, war, map, time, measure, honour, meta, forbidden, keep |
| `engine.words` | The vanilla words and short phrases the concept replaces. Single words and short phrases only, never a sentence; the scan uses them to explain a hit |
| `engine.loc`, `engine.def` | The vanilla localisation keys that carry the concept and the engine definition ids it keeps. A build test checks each against the installed game |
| `term` | `s` and `p` (singular and plural label forms), `lc` and `lcp` (running-text forms). Common nouns are lower-cased in running text, proper nouns keep their capitals |
| `article` | `auto` (a or an by the first letter), `the`, `a`, `an` or `none` |
| `case` | `common` or `proper` |
| `people` | Optional variants by people (`men`, `elves`, `sun_elves`, `orcs`, `trolls`, `giants`, `ents`, `yeti`, `demons`, `the_dead`) |
| `forbid` | Words that must not appear in text about this concept |
| `guidance` | For `forbidden` entries: how a writer rewrites the sentence |
| `status` | `D` decided by a Ready spec, an integration decision or an adopted proposal; `P` proposed here; `K` keep (the vanilla word is plain English) |
| `source` | The spec that owns the decision |

**Entries by kind.** stat 19, resource 11, building 17, state category 13, logistics 6, system 14, unit 12, unit class 15, ship class 4, institution 7, rank 14, role 4, tech 9, politics 13, diplomacy 16, war 7, map 3, time 8, measure 6, honour 8, meta 9, forbidden 14, keep 24. By status: 85 are `D` (the seven resources, energy and fuel, all 17 buildings, all 13 state categories, the warfare unit and ship classes, league, vassal, the four ideologies, the difficulty names and a few more, because a Ready spec already fixed them), 132 are `P` and 36 are `K` (the 24 plain words kept and a few more). The terms of [08_institutions.md](../03_gameplay/08_institutions.md) (a Draft written the same day) are `P` with that spec as the source; they win for their domain, and if the institutions spec changes a term, it changes one line of the glossary.

**Decisions the glossary makes** (each is a one-line change in the file):

| Concept | Term | Why this one |
| --- | --- | --- |
| Political power | Authority | The master plan's sketch says favour; Aenor's meter is already Temple Favour, so a second Favour would collide on one screen |
| Stability, war support, national unity | Calm, Will to War, Unity | The inventory asks for the three statistics in Erdae words (PS-180); each names what it measures |
| Manpower | Levies | Master plan section 1 (the top bar names levies). Variants: Horde (orcs), Risen (the dead), Oathbound (demons), after the plan's people rules |
| Command power; the three experience pools | Orders; Army Valour, Fleet Valour, Sky Valour | The institutions spec. The inventory suggested Renown; Renown is Eindil's gauge, so the pools take Valour |
| Officer corps window, its chairs, ranks and role names | Council of Captains; Master of the Host, Lord of the Fleet, Master of the Eyries, Marshal of the Council, Master of Lore; Banneret, Warden of Hosts, Captain-General, Marshal of the Crown; Host-Captain, Marshal, Sea-Lord | The institutions spec. [02_full_ui_reskin.md](02_full_ui_reskin.md) section 8 still says War Council for the window; one of the two changes ("Changes this spec asks of other specs") |
| Division, template, battalion, army group | Host, Host Roll, Company, Grand Army | Master plan section 6 says division to host. Variants for orcs, trolls, the dead, demons and yeti |
| Technology, research, scientist | Art, Study, Scholar | The research window is titled Scholars ([02_full_ui_reskin.md](02_full_ui_reskin.md) section 8) and the institutions spec calls the people scholars; the folders of the warfare spec keep their names |
| Country, nation | Realm | Every Ready spec says realm |
| Faction, puppet | League, Vassal | The diplomacy spec |
| Lend-lease, licence, attaché, embargo, market, consumer goods | Sending Arms, Guild Licence, Lent Captains, Close the Roads, Great Fairs, Folk Wares | Master plan P6 and the institutions spec; the attaché and embargo terms are already in `localisation/replace/zin_rethemed_l_english.yml` and the economy spec |
| Special project, military-industrial organisation, intelligence agency | Spell, Guild, Court of Whispers | The institutions spec |
| Victory points | Worth | Short, and the score of a seat stays a number |
| Kilometre, kilogram, ton | mile, pound, load | Inventory owner question 4: days of march and loads |
| Wiki | Chronicle of Erdae | The in-game encyclopedia ([04_chronicle_codex.md](04_chronicle_codex.md)) |

**Slots.** A template writes a concept as `{id}` or `{id:modifier}`. Modifiers combine left to right: `s` (default), `p`, `lc`, `lcp`, `a`, `the`, `uc1`, `people`. `{name:key}` inlines the in-game spelling of a proper name from the names spec's data at build time. `{loc:concept}` writes the scripted localisation call of the two-face labels (`[zin_loc_deliverer]` and its kind), so a secret term never enters the glossary.

**People variants.** A variant is a scripted localisation `zin_term_<id>` (file `common/scripted_localisation/zin_terms.txt`, written by `text_sweep.mjs`) that tests the people flag `zin_people_<key>` of the current scope and returns the key `zin_term_<id>_<people>` or `zin_term_<id>_default`. The scripted localisation takes the current scope (the Localisation wiki, "Scripted localisation"), so the modifier `people` is allowed only in families whose text is shown with a country in scope: politics, diplomacy, factions, ledger, intelligence, production, trade and the content texts of the other tracks. In `core`, `tooltips` (label keys), `alerts`, `ranks` and every key the engine draws with no scope, `people` resolves to the default form and the scan reports a use as an error (check X6). Two entries carry variants now (manpower with three, division with five); the mechanism exists so more can follow without touching a family file.

**Forbidden and keep entries.** A `forbidden` entry has no term. It lists the words and tells the writer how to rewrite the sentence (for example, the armour role is said with heavy foot, knights or the great kin). A `keep` entry records that a plain word stays (war, peace, treaty, fort, state, province, decision, focus, trait), so no writer renames it and no reviewer asks.

**Stems.** `glossary.json` also holds `stems`, a map of 70 key-name tokens to Erdae tokens. A modifier is named by its own id (`army_attack_factor`); the stem rule composes the label from the id's tokens through this map, so every modifier that mentions a workshop, a host or a pool reads the same everywhere.

**Style block.** British spelling; title case for labels (short articles, conjunctions and prepositions stay lower-case); sentence case for descriptions; the realm speaks as "we" in alerts and prompts; digits in tooltips; Windows-1252 only; and the secret rule (anything gated by a reveal goes through `{loc:concept}`).

**Names clash.** [03_names_and_terms.md](../02_lore/03_names_and_terms.md) also plans a data file named `tools/content/data/glossary.json` (a table of proper names, with status labels and spellings). The master plan names this path for the concept glossary, so the names spec's file is renamed `tools/content/data/proper_names.json`; its module `terms.mjs` and its checks T1 to T6 stay as written. The two files do not overlap: concepts here, names there.

### 3. Key families

Each family has a data file `tools/content/data/ui_text/<family>.json`, one owner of wording and one writer. The writer for every family below is `tools/content/modules/text_sweep.mjs` unless another module is named; it is data-driven, so the families differ in data, not in code. The rule for which keys a family must supply is the same everywhere: every **label** key of its vanilla files, plus every **object** key whose object is still defined after stage 2 (section 6). A key may belong to only one family (`ownership.json`, section 5).

| Family | Vanilla files (English) | What it covers | Wording owner | Writer |
| --- | --- | --- | --- | --- |
| core | `core`, `topbar`, `state`, `terrain`, `province_names`, `strategic_locations`, `names`, `dlc019`, `la_resistance_preorder_bonus` | Interface shell: labels of every window, top bar, state view, terrain names, loading status lines. Month keys go to `calendar.mjs`, weekday and rank keys to `ranks`, loading status lines to the loading spec | this spec | `text_sweep.mjs` |
| platform | `frontend`, `multiplayer`, `pdxonline`, `subscription`, `popserror`, `chat`, `richpresence`, `social_gui`, `nudge`, `no_translation_required`, `bookmarks`, `loading_tips` | Menu, lobby and account text. Frontend, bookmark and difficulty wording are [03](03_main_menu_and_frontend.md); loading tips are the art spec; the rest is engine-generic (section 7). Rich presence (10 keys) is decided here | 03; this spec for rich presence | `frontend.mjs`; `text_sweep.mjs` |
| tooltips | `triggers`, `effects`, `modifiers`, `scripted_triggers` | The sentences of every focus, decision, event and idea tooltip, and modifier names | this spec | `text_sweep.mjs` |
| alerts | `alerts` | 55 alerts and their instant, delayed and entry texts | this spec | `text_sweep.mjs` |
| tech | `research`, `doctrines`, `technology_sharing`, `special_projects` | Research window labels, doctrine screens, Spells (the special projects). Names of ZIN technologies and doctrines are the warfare and economy specs' | warfare, economy | `text_sweep.mjs` (labels), warfare and economy modules (objects) |
| unit | `unit`, `army`, `army_hq`, `deployment`, `abilities`, `tactics`, `battleplan_codenames`, `traits`, `theater` | Unit view, army view, deployment, abilities, tactics, battle plan names (432 keys), commander traits, theatres | warfare | `text_sweep.mjs` |
| equipment | `equipment`, `equip_air`, `equip_naval`, `ship_modules`, `tank_modules`, `plane_designer`, `designer`, `POL_equipment` | Equipment, designer and module text. Almost all ids go away at stage 2; the kept keys (`convoy`, `train_equipment`, `motorized_equipment`, the archetypes) and the designer labels stay | warfare | `text_sweep.mjs` (labels, kept ids); warfare (ZIN equipment) |
| ledger | `intel_ledger`, `stats` | The ledger pages and the 424 statistic names | this spec | `text_sweep.mjs` |
| diplomacy | `diplomacy`, `autonomy`, `government_in_exile`, `goals`, `peace`, `resistance_and_occupation`, `collections`, `treaty_org`, `war`, `waroverview` | The diplomacy window, relations, treaties, subject types, war goals, peace conference, occupation, war overview | diplomacy | `text_sweep.mjs` |
| politics | `politics`, `country`, `decisions` | The Throne window, the three core statistics and their explanation lines, the decisions window | foundation (ideologies) | `text_sweep.mjs` |
| factions | `factions` | The league window: goals, rules, upgrades | diplomacy | `text_sweep.mjs` |
| mapmodes | `mapmode`, `adjacency_rules`, `focus_filter_tag` | Map mode names and tooltips, strait and permission names, focus filters | this spec; key sites for strait names | `text_sweep.mjs` |
| intelligence | `operatives`, `intelligence_agencies`, `military_raids`, `lar_operations`, `TAOG_operations`, `TAOG_SIA_operations`, `TAOG_raids`, `TAOG_flags`, `wtt_infiltration`, `wtt_border_conflict` | Courts of Whispers, agents, schemes, Seals and Codes. The raids and DLC operation files are reachable only if their systems stay; the scan decides | diplomacy | `text_sweep.mjs` |
| production | `production`, `constructions`, `buildings`, `military_industrial_organization`, `military_industrial_organization_department` | Armouries window, Works window, building names, Guilds | economy | `text_sweep.mjs` |
| trade | `trade`, `international_market` | Trade window and the market (renamed by the economy and institutions specs) | economy | `text_sweep.mjs` |
| supply | `logistics` | Supply window | economy | `text_sweep.mjs` |
| battle | `combat` | Land combat view | warfare | `text_sweep.mjs` |
| naval | `navy` | Fleets view and naval missions | warfare | `text_sweep.mjs` |
| air | `air` | Wings view and air missions | warfare | `text_sweep.mjs` |
| ranks | `ranks`, `unit_medals` (and the weekday keys of `core`) | Rank titles, division titles, weekday names, citation and history text | titles: [08_institutions.md](../03_gameplay/08_institutions.md); weekdays and honours: [06_career_honours.md](06_career_honours.md) | `text_honours.mjs` |
| rules | `game_rules`, `rules` | The 19 kept engine rules and their options; ZIN rules are the defines spec's | foundation | `text_sweep.mjs` |
| difficulty | `difficulty` (and the `diff_*` keys of `core`, `FE_DIFFICULTY_*` of `frontend`) | Difficulty labels | [03](03_main_menu_and_frontend.md) | `frontend.mjs`; this spec checks |
| achievements | `achievements`, `career_profile_achievements`, `career_profile_more_customization` | Hidden surfaces; only the texts that stay reachable are written (see the career spec) | [06](06_career_honours.md) | `text_honours.mjs` |

Files outside the families keep their own owner: `music*` and the DLC music title files (23 files) to the music spec, `state_names`, `victory_points`, `strategic_region_names` and `supply_area_names` to the map track, `tutorial` (hidden, 187 keys) to the frontend spec, and the 84 content files (vanilla focuses, events, ideas, decisions, characters, countries, parties and DLC text) to the content tracks. The 84 content files hold 85,963 keys; the scan proves that none is reachable except the kept ids named above (section 6).

**Notes that prevent mistakes.**

- **Alerts.** Each alert id (`alert_x`) has the keys `alert_x_instant`, `alert_x_delayed` and entry or list variants; the scan takes every key that starts with a live alert id. The alerts of removed systems (cryptography, operatives, raids) stay defined in `common/alerts.txt`; their text is written so a stray one cannot show a modern word.
- **Tooltips.** A trigger is shown by `TRIGGER_<NAME>` and an effect by `EFFECT_<NAME>`; the keys that matter are those of triggers and effects ZIN scripts use in a tooltip, plus the engine's own. A modifier is named by its id in three possible shapes (`<id>`, `modifier_<id>`, `MODIFIER_<ID>`); the scan takes all three.
- **Resources.** The seven resources are named by `PRODUCTION_MATERIALS_<RESOURCE>` in the production file and by `state_resource_`, `temporary_state_resource_` and `country_resource_` prefixes in the modifier file; the glossary lists each key under the concept.
- **Buildings.** A building has `<id>`, `<id>_plural` and `<id>_desc`. State categories are named in `state_l_english.yml`, not in the building file.
- **Ranks.** The engine reads `rank1` to `rank4` and `naval_rank1` to `naval_rank4` (with `_desc` keys), `LEADER_RANK_*` lines that nest the rank, and `DIVISION_EXPERIENCE_TITLE_ARMY_EXPERIENCE_0` to `_4` with a default. Rank shows as text and as two badge strips the engine binds by name and no `.gui` file names (`GFX_leader_rank_strip`, 4 frames; `GFX_naval_leader_rank_strip`, 5 frames); the reskin replaces both.
- **Nesting.** A value may nest another key as `$KEY$`, but the Localisation wiki records that a `pdx_tooltip` shows the dollar signs instead of expanding. The builder therefore expands every nesting of ZIN keys at build time and writes plain text; only engine variables stay as `$VAR$` (check X10).

### 4. The template mechanism

Nothing in the repository holds a vanilla sentence. Text is written in three layers.

1. **Glossary** (section 2): the terms.
2. **Frames** (`ui_text/frames.json`): ZIN-written sentence shapes with named slots. A frame has an id, the slot list, the placeholders it must carry, and one English body. Frames exist for the repeated shapes of the engine: a statistic line, a requirement ("needs at least n of x"), a gain or loss, a cost, an unlock, a "click to" hint, a list header, a window title, a modifier name, a trigger or effect sentence about a scope. The body is ZIN text. The design target is about 400 frames, written once and reused by all families.
3. **Rows** (`ui_text/<family>.json`): one row per key or per key pattern. A row is a literal, a frame call, or a stem.

| Row kind | Shape | Used for |
| --- | --- | --- |
| `lit` | key, English body with `{slot}` tokens and the engine placeholders it needs | Window labels, alerts, anything with a voice |
| `frame` | key (or key regex), frame id, slot values (glossary ids or literals) | Trigger and effect sentences, requirement lines, cost lines |
| `stem` | key regex with capture groups, frame id, token map | Modifier names composed from the id (`army_attack_factor` → host, attack) |
| `same` | key, key | A key whose text equals another ZIN key; expanded at build time, never as `$KEY$` |
| `neutral` | key, reason | Keys whose plain word is already neutral and must stay (Close, Cancel, Yes); the list is short and every entry names the reason |
| `engine` | key, reason | Keys of engine-generic files kept as the game ships them (section 7) |

An author reads the vanilla file to learn **what a key says and which placeholders it carries**, then writes ZIN text from the glossary and the frames. The builder checks against the same file, but only on facts that are not text: the set of placeholders, the colour codes the key needs, and whether the new value differs from the old one.

**Why this is not a copy.** Three checks stop one from slipping in. X4 fails a ZIN value that is byte-identical to the vanilla value of the same key unless the key is on the `neutral` list. X4 also fails a value whose normalised words overlap the vanilla value by 85% or more when it has five words or more (the overlap test uses the installed game at build time and prints only the key and the rule id, never the vanilla text). X5 fails any banned word. Together with the placeholder parity check (X9) this means a writer can reuse structure but must write new words.

**Authoring.** Agents write the families in parallel, one data file each, with the glossary and the frames open. A family's gate (`files.json`) is `warn` until its author marks it done; the scan then fails the build on that family. Frames are the one shared file, with a single owner at a time (the first family agent writes them; later agents add and never change a frame another family uses).

**Colour and icon codes.** A ZIN value uses the engine colour codes as the vanilla key would: gold names and values, green for good, red for bad, the grey-brown note, orange for warning. The text colours themselves are re-toned by `interface/zz_zin_textcolors.gfx` ([02_full_ui_reskin.md](02_full_ui_reskin.md) section 3.4); the codes are untouched. A text icon names a sprite by its engine name (`£political_power` style); the picture behind it is the reskin's. The scan lists every icon name used in ZIN text for the reskin's reachability check.

### 5. Ownership, files and languages

**Ownership is by key.** `ui_text/ownership.json` maps key patterns to the module that writes them, and this takes precedence over the file a key sits in. Examples: the month keys to `calendar.mjs`; the weekday, rank and division-title keys to `text_honours.mjs`; `WORLD_TENSION_NAME` and every `ZIN_*` key to the interface modules; `FE_DIFFICULTY_*`, `diff_*` and `ZIN_MENU_*` to `frontend.mjs`; ideology names in `parties_l_english.yml` to `ideologies.mjs`; laws in `ideas_l_english.yml` to the economy module. A key owned twice fails the build (X14).

**File dispositions.** `ui_text/files.json` has one row per installed English file:

| Mode | Meaning | Rows |
| --- | --- | ---: |
| `sweep` | Part of a family. Gets a `replace` file now and a same-name whole-file override at stage 4 | 85 |
| `owned` | Another spec writes it: music (23), map names (4), tutorial (1), and the frontend, bookmark and loading-tip files (3) | 31 |
| `engine` | Kept as shipped: engine-generic account, lobby and error text, each with a reason (all seven sit in the platform family) | 7 |
| `content` | Vanilla content text; reachable keys are only kept engine ids and are moved into `sweep` families by `ownership.json`; the rest stays unreachable and the scan proves it | 84 |

Rows are generated from the installed game by `text_inventory.mjs` and checked in. A new game version that adds a file fails X1 until it has a row.

**Waves 1 to 3.** `text_sweep.mjs` writes one `localisation/replace/zin_<family>_l_english.yml` per family, UTF-8 with BOM, header `l_english:`, entries sorted by key, quotes and newlines escaped by the existing `yml()` of `lib/core.mjs`. A `replace` file overrides the same keys in the vanilla files (Localisation wiki, "Replacing"); the engine logs one collision line for it (decision B12, at most two lines while any `replace` file remains).

**Stage 4.** The same entries are written as same-name whole-file overrides in `localisation/english/<vanilla file>`, with exactly the keys the scan found reachable. A vanilla file with no reachable key is left alone (`content`, unreachable) and listed with the proof. After the conversion no `replace` file remains unless the allowlist names it, and `localisation/replace/` holds only `zin_calendar_*` if the calendar still needs it. A probe (P2, acceptance 10) confirms on the Linux run that a same-name file replaces the vanilla file whole, including a header-only file. Whether a `replace_path` on a localisation folder is safe is not assumed; the conversion works without it (open question 1).

**Other languages.** The master plan keeps English as the written language and copies it. For every ZIN English file the builder writes the same keys under `l_<language>:` in nine files, named by the same pattern: `localisation/replace/zin_<family>_l_<language>.yml` in waves 1 to 3 (as `calendar.mjs` already does for the months) and `localisation/<language>/<vanilla name>_l_<language>.yml` at stage 4. The file lists differ by language (French has four extra vanilla files); the builder reads each language's installed list and overrides the files that carry reachable keys. A key missing in a language falls back to the English file of the engine; the probe P4 confirms it and the explicit copy does not depend on it.

### 6. The scan

`tools/content/checks/text_scan.mjs` runs on every build over the staged tree and from `npm test`. It proves three things: every key the game can still display has ZIN text; no displayed text holds a banned word; and every code in the text is valid. It never prints a vanilla value.

**Inputs.**

- **V**, the vanilla key table: every key and its placeholder set from the installed game, `HOI4_GAME`, for the 10 languages (`text_inventory.mjs`; metadata only is checked in).
- **Z**, the ZIN table: every localisation key of the staged tree, with its file, its mode (`replace`, `override`, `new`) and its family.
- **E**, the effective table, computed as the engine does: start from V; remove each file that a same-name ZIN file replaces; add Z; a key in a `replace` folder wins over every other definition.
- The loaded GUI and script: the installed `interface/**/*.gui` files that stay loaded, ZIN's own, and the staged tree; the installed `common/**` folders that remain loaded; the scripted GUIs and scripted localisation.

**The reach set R** is the set of keys the game can still display. It is the union of five sources, closed under nesting.

| Source | Rule |
| --- | --- |
| S1 GUI | Every key named by the attributes `text`, `buttonText`, `pdx_tooltip`, `pdx_tooltip_delayed`, `tooltip`, `context_aware_text`, `context_aware_tooltip`, `pdx_disabled_tooltip` and `pdx_disabled_tooltip_delayed` (the attributes the installed `.gui` files use for keys, measured 19 October 2026) in a window that is not hidden by an override. A hidden element (moved off screen with the empty sprite) adds nothing |
| S2 Objects | For every object loaded after stage 2, its derived keys: `<id>`, `<id>_desc`, `<id>_short`, `<id>_plural`, `<id>_tt` as the kind uses them (`ui_text/reach_rules.json`, one row per kind: technology, equipment, sub-unit, building, idea, ideology, terrain, state category, autonomy state, map mode, alert, resource, medal, game rule, difficulty, modifier, trigger, effect) |
| S3 Script tokens | Any identifier or quoted token in a loaded script file that equals a defined key (a `custom_tooltip`, a `localization_key`, a `title`). This over-approximates, which is safe |
| S4 Label files | Every upper-case label key of the files in a swept family, unless it is on the exemption list with a reason |
| S5 Engine fixed | Keys the engine reads with no reference in any file (weekday and month names, rank keys, the loading lines). The list is `ui_text/engine_keys.json`, built by reading `core` and the titles files for keys no GUI or script mentions |

**Exemptions.** A key leaves R when it is a tag-prefixed key of a tag that does not exist (only ZIN tags and the dynamic tags exist after stage 1), when its object is not loaded (removed equipment, technologies, units), or when it is on `ui_text/exempt.json` with a reason and the stage that retires it.

**Checks.** Each check has an id, a failure condition and a negative test.

| # | Check | Fails when |
| --- | --- | --- |
| X1 | Inventory freshness | The game version or the vanilla file list differs from `inventory.json`; a file has no `files.json` row |
| X2 | Missing | A key in R has no definition in E |
| X3 | Vanilla shown | A key in R resolves to a vanilla value, in a file not marked `engine` with a reason (a family marked done); a `warn` family reports it |
| X4 | Copy | A ZIN value equals the vanilla value of the same key or overlaps it by 85% or more at five words or more, and the key is not `neutral` |
| X5 | Banned words | A rendered ZIN value (after glossary expansion and nesting up to six levels) matches an `error` rule of `banned_words.json` and no allowance covers the key; `review` rules are listed and must be cleared or allowed before the stage-4 gate |
| X6 | Glossary | A token names no glossary id; a `forbid` word of the concept appears; a `people` modifier appears in a family with no scope; a `forbidden` concept is used as a term |
| X7 | Colour codes | A `§` is followed by a character outside the 23 codes of `interface/core.gfx` (`C L W B G R b g Y H T O 0 to 9 t`) and `!`; a multi-byte character follows a `§` (the engine reads its last byte and fails with "Could not find coloring"); a code is left open at the end of a value |
| X8 | Icon codes | A `£name` does not name a sprite `GFX_name` of the loaded `.gfx` files; a `£name\|n` frame exceeds `noOfFrames`; an icon is classified unreachable in the reskin. The scan writes the used names to `icons_used.json` |
| X9 | Placeholder parity | The multiset of engine placeholders (`$X$`, `$X\|fmt$`, `[scope.Function]`, `[?var]`, `@TAG`) of a ZIN value differs from the vanilla key's, or a new key's declared set |
| X10 | Nesting | A `$KEY$` names no key; a cycle; depth above six; a nested ZIN key inside a key that a `pdx_tooltip` shows |
| X11 | Format | Missing BOM or header; a character outside Windows-1252 or missing from the font the element uses (the names spec's T3 and T4 rules); an empty value not on the `empty_ok` list; a key with illegal characters |
| X12 | Duplicates | A key defined twice in ZIN files; a `replace` key defined in a whole-file override of its own family |
| X13 | Languages | A ZIN English file lacks its nine copies, or a copy differs from the English values |
| X14 | Ownership | A key owned by two families or modules, or by none |
| X15 | People | A `zin_term_<id>` lacks the default or a variant the glossary lists |
| X16 | Length | A label key used by a GUI element with a `maxWidth` has a longer estimated width than the element (an estimate from the font metrics; the render pass of the interface spec is the authority). Reported as a warning |

**Reporting.** The scan writes `docs/design/text/scan_report.json` (deterministic: sorted by family, check, key) and a short `scan_report.md`. The summary per family has: files, keys in R, authored, missing, vanilla shown, banned hits (error and review), code findings. Each finding is `{ check, family, key, file, rule?, detail }`; `detail` quotes only the ZIN value, cut at 80 characters. `icons_used.json` and `reach.json` (each key in R with its source) are written beside it. The exit code is 1 when any family marked `fail` has an error finding, or any family at all has an X1, X11, X12 or X14 finding. Warnings never fail.

**The Linux run adds what a static scan cannot.** The engine builds some keys by code. After each family is done, the run executes the console commands `loc_check`, `loc_check_modifiers`, `loc_check_national_spirits` and `dump_equipment_loc` (documented in the installed `console_commands_documentation.md`) and reads `text.log` and `error.log`. Any key reported missing that is not in R is added to `engine_keys.json` with its reason, so the static scan learns it.

### 7. Engine-generic text kept as shipped

Seven files are marked `engine` with a reason: `pdxonline` (account sign-in, 93 keys), `popserror` (15), `chat` (5), `social_gui` (52), `multiplayer` (183), `nudge` (5) and `no_translation_required` (2). They belong to screens ZIN does not change ([02_full_ui_reskin.md](02_full_ui_reskin.md) section 4.11). The scan still checks them against the classes of the banned list that apply (industry, society and superseded names) and allows brand names through the `al_platform_files` allowance. `subscription` (96 keys) is mixed: its subscription-widget lines are hidden, its career-profile lines are handled by [06_career_honours.md](06_career_honours.md), and the remaining platform lines are `engine`. `richpresence` (10 keys, what a friends list shows) is decided here: ZIN wording through the glossary, keeping every `$COUNTRY$` and `$YEAR$`; the year the engine prints is the game year, which reads 1748 as the calendar spec intends.

### 8. The banned words

`tools/content/data/banned_words.json` is the list, as data. **136 rules** in 9 classes. A rule has an id (`bw_<class>_<nnn>`), a regular expression without delimiters, a severity (`error` fails the build; `review` is reported and must be cleared before the stage-4 gate), a replacement hint and the reason (the spec or inventory row it comes from).

| Class | Rules | Examples of what it catches |
| --- | ---: | --- |
| modern_industry | 50 | factory, industrial, oil, coal, steel, aluminium, rubber, tungsten, chromium, fuel, electricity, radio, radar, computer, cryptography, nuclear, rocket, jet, aircraft, plane, airfield, bomber, gun, cannon, rifle, tank, truck, motorised, railway, artillery, submarine, destroyer, cruiser, battleship, torpedo, convoy |
| units_of_measure | 6 | km, km/h, kg, mm, hp (error); tons, inches, feet, knots (review) |
| modern_society | 24 | democracy, fascism, communism, nazi, socialism, capitalism, colonial, satellite, puppet, prime minister, president, senate, parliament, cabinet, minister, Axis, Allies, NATO, Lend-Lease, government in exile, world war, Holocaust |
| military_modern | 14 | division, field marshal, commodore, rear admiral, vice admiral, brigadier, commando, marine, compliance, political power, war support, national unity, manpower, command power, stability, national focus, victory points |
| real_world | 13 | real countries and nationalities, continents, cities, people and titles, forces and machines, English month and weekday names, any year from 1801 on, A.D. and B.C., Christmas and the like |
| third_party_ip | 1 | Middle-earth, Mordor, Sauron, Gandalf, Frodo, Hogwarts, Westeros and similar names that are not in the owner's vault |
| game_and_platform | 7 | Hearts of Iron, Paradox, DLC, wiki (error); Steam, Discord, forum, ironman, playthrough, career profile (review) |
| superseded_names | 12 | the retired Erdae names of the names spec, including the long o of Šodolôrō |
| us_spelling | 9 | armor, defense, color, honor, favor, organization, center, harbor, plow, mobilization (review) |

The glossary words "division", "manpower", "stability" and the rest of the renamed statistics are in the list as errors because their Erdae terms are decided; a writer who needs the plain word in a sentence rewrites it. The list is a floor. The glossary's per-concept `forbid` lists add the words of each concept.

**Matching.** The scan matches the text a player reads: the value after glossary expansion and nesting, with colour codes, icon codes, `$…$` placeholders, `[calls]` and `\n` removed. Rules match whole words (letters, digits and apostrophes make a word; a hyphen separates words, so "anti-tank" still hits "tank"), case-insensitively unless the rule says otherwise. Keys, engine ids and file names are never matched.

**Allowances.** `banned_words.json` carries a short allowance list: the language registry (the real language names), the credits text (the publisher's name), the pause-menu link tooltips and the seven engine-generic files. An allowance names rules and keys or files and has a reason. The scan prints the allowances it used and fails on an allowance that matched nothing.

**Measured result on the vanilla text.** Applying the error rules to the 39,038 keys of the swept families hits 10,464 of them (table in section 1). The list does not catch grammar or tone; the frames and the review do. It does not replace the names spec's checks: T1 (superseded names) and T2 (gated terms) stay in `checks/text_terms.mjs`, and a test asserts that the `superseded_names` class equals the names spec's table so the two never drift.

### 9. Order of work against stage 2

The sweep and the stage-2 replacement of the vanilla folders ([06_vanilla_removal_and_zero_errors.md](../00_foundation/06_vanilla_removal_and_zero_errors.md) section 5) depend on each other. The rule: **label keys do not depend on stage 2 and go first; object keys follow the module that defines the object.**

| Wave and stage | Sweep deliverable | Depends on |
| --- | --- | --- |
| 1 (stage 1 done) | Glossary, banned list, `text_engine.mjs`, `text_inventory.mjs`, `files.json`, `ownership.json`; scan with X1, X7, X11, X12, X14; the `core` and `platform` labels a player meets in the first minute (top bar, menus, pause, alerts shell) as `replace` files; the weekday names and ranks ([06](06_career_honours.md)) | nothing |
| 2 | `tooltips` (frames, stems, the sentences of the triggers and effects ZIN's trees use), `alerts`, `mapmodes`, `rules`, `ledger`; scan X2 to X6, X8 to X10 in warn mode | focus compiler (which triggers and effects exist) |
| 3, stage 2 | `tech`, `unit`, `battle`, `naval`, `air` labels with the warfare module; `production`, `trade`, `supply` with the economy module; `diplomacy`, `factions`, `politics`, `intelligence` with the diplomacy module. As each stage-2 folder is replaced, its vanilla object keys leave R and the scan stops asking for them | warfare, economy, diplomacy modules |
| 3, stage 3 | `ranks` and `achievements` (profile files overridden) | [06](06_career_honours.md) |
| 4 | Whole-file conversion, the nine copies as same-name files, the gate: every family `fail`, every `review` rule cleared, X3 clean | all |

Until a family is done, vanilla keys it does not cover still show vanilla text. That is why the banned-word scan runs in `warn` mode per family and why the error budget allows the B12 collision lines only until stage 4.

## Implementation

### Files

| Path | Kind | Content | Writer |
| --- | --- | --- | --- |
| `tools/content/data/glossary.json` | builder data | The master glossary (253 entries, 70 stems) | written with this spec; later by the owner of each decision |
| `tools/content/data/banned_words.json` | builder data | 136 rules, 9 classes, allowances | written with this spec |
| `tools/content/data/ui_text/files.json` | builder data | One row per installed English file: mode, family, gate (`warn` or `fail`), reason | `text_inventory.mjs`, then by hand for reasons |
| `tools/content/data/ui_text/inventory.json` | builder data | Per key: file, family, class, placeholder multiset, colour-code multiset, icon names. Metadata only; no vanilla value | `text_inventory.mjs` |
| `tools/content/data/ui_text/ownership.json`, `reach_rules.json`, `engine_keys.json`, `exempt.json`, `neutral.json`, `empty_ok.json` | builder data | Section 5 and 6 tables | by hand |
| `tools/content/data/ui_text/frames.json` | builder data | The sentence frames | first family agent |
| `tools/content/data/ui_text/<family>.json` | builder data | Rows of one family; 22 files | one agent each |
| `localisation/replace/zin_<family>_l_<language>.yml` | generated | Waves 1 to 3; 10 languages | `text_sweep.mjs` |
| `localisation/<language>/<vanilla name>_l_<language>.yml` | generated | Stage 4 whole-file overrides, 10 languages | `text_sweep.mjs` |
| `common/scripted_localisation/zin_terms.txt` | generated | One `defined_text` `zin_term_<id>` per glossary entry that has people variants | `text_sweep.mjs` |
| `localisation/replace/zin_terms_l_<language>.yml` | generated | Keys `zin_term_<id>_<people>` and `_default` | `text_sweep.mjs` |
| `docs/design/text/inventory.json`, `scan_report.json`, `scan_report.md`, `icons_used.json`, `reach.json` | generated review copies | The builder publishes them as it does for `data/vanilla/` | `text_scan.mjs`, `text_inventory.mjs` |

### Modules and tests

| Module | State | Does |
| --- | --- | --- |
| `tools/content/lib/text_engine.mjs` | new | Loads the glossary, the frames and a family file; expands `lit`, `frame`, `stem`, `same`; resolves slots and modifiers; compiles people variants; exposes `term(id, form)` to every other module (focus compiler, characters, names) |
| `tools/content/modules/text_inventory.mjs` | new | Reads the installed localisation (read-only, `HOI4_GAME`) and the installed `.gui` and `common` folders; writes `inventory.json` and the `files.json` skeleton. A pure function of the input files |
| `tools/content/modules/text_sweep.mjs` | new | Runs every family file; applies the ownership map; writes `replace` files or whole-file overrides by stage; writes the nine copies; writes `zin_terms.txt`; called from `build.mjs` after `buildCalendar` and `buildDefines` |
| `tools/content/modules/text_honours.mjs` | new, [06](06_career_honours.md) | Ranks, division titles, weekday names, citation and history text, honours text |
| `tools/content/checks/text_scan.mjs` | new | Checks X1 to X16; runs last in `build.mjs`, after the focus compiler, because it reads every staged key |
| `tools/content/text.test.mjs` | new | A test per check (below) and the glossary tests |

`build.mjs` calls `buildTextSweep(staged, { stage })` after the calendar and defines, and `runTextScan(staged)` after `buildFocusTrees`. The stage comes from `files.json`'s current stage, the same value vanilla removal uses.

### Identifiers

Created by this spec: `zin_term_<id>` (scripted localisation names, one per glossary entry with variants), `zin_term_<id>_<people>` and `zin_term_<id>_default` (localisation keys), the family files and data above. No game rule, flag, variable, event, decision or idea. [03_names_and_terms.md](../02_lore/03_names_and_terms.md) keeps `zin_loc_<concept>` and `zin_name_<key>`.

### Engine facts checked (installed game 1.19.3.0, 19 October 2026)

- The 207 English files and 129,541 keys of section 1; the file `ranks_l_english.yml` has 16 keys (`rank1` to `rank4`, `naval_rank1` to `naval_rank4` and eight empty `_desc` keys); the seven weekday keys are in `core_l_english.yml`; `unit_medals_l_english.yml` holds the 128 `*DIVISION_EXPERIENCE_TITLE*` keys, the commander and citation labels and 31 history lines.
- The key shapes of section 3: buildings (`<id>`, `_plural`, `_desc`), resources (`PRODUCTION_MATERIALS_STEEL` and the six others, `state_resource_steel`, `country_resource_steel`), ideology names in `parties_l_english.yml`, state categories in `state_l_english.yml`, `autonomy_puppet` in `autonomy_l_english.yml`, map modes (`MAPMODE_<ID>`), the three styles of modifier keys.
- The 23 colour codes of the `textcolors` block in `interface/core.gfx`.
- The GUI attributes that carry keys (section 6), measured over the 130 `.gui` files directly in `interface/`; the files in its subfolders are read the same way.
- The console commands `loc_check`, `loc_check_decisions`, `loc_check_events`, `loc_check_focuses`, `loc_check_modifiers`, `loc_check_national_spirits`, `loc_check_characters` and `dump_equipment_loc` in `documentation/console_commands_documentation.md`; the documented formatters in `loc_formatter_documentation.md`.
- The `localisation/replace` priority rule, the BOM and header rules, the colour-code errors and the `pdx_tooltip` nesting limit are the Localisation wiki's (snapshot in `paradox_wiki/`).

**Crash and error risks.** A localisation file without the BOM or without its `l_<language>:` header breaks, and the wiki records a crash (0xC0000005) for a file with keys and no language header. A `§` followed by a multi-byte character logs "Could not find coloring". Dollar-sign nesting inside a `pdx_tooltip` shows raw dollar signs. A file named for the wrong language is not loaded. A same-name stub with only the header is expected to be valid; probe P2 proves it before the stage-4 conversion relies on it. `localisation/languages.yml` and `ignored_loc_keys.txt` are never overridden.

### Tests (`tools/content/text.test.mjs`)

Each check has a negative test on a synthetic fixture: a planted banned word (one per class), a dropped placeholder, an unbalanced colour code, a `§` before a long o, an unknown icon, a missing key, a vanilla value copied, a near copy, a `people` modifier in `core`, a key owned twice, a missing language copy, and a nesting inside a tooltip key. Glossary tests: unique ids; every term passes the banned list; every `engine.loc` and `engine.def` exists in the installed game; every `D` entry's term matches the spec named in `source` (a table of expected strings read from the spec); the `superseded_names` class equals the names spec's table. Determinism: a rebuild gives identical bytes.

## AI

None.

## Acceptance

1. **Inventory.** `inventory.json` matches the installed game (207 files, 129,541 keys, 10 languages); `files.json` has a row for every file; the counts of section 1 reproduce.
2. **Glossary.** At least 150 entries (253 shipped); every entry is valid against the schema; every term passes the banned list; every `engine.loc` and `engine.def` resolves in the installed game; no `D` entry disagrees with its source spec.
3. **Banned list.** 136 rules compile; the vanilla measurement of section 8 reproduces (10,464 error-hit keys in the swept families); each class has a planted-word negative test.
4. **Coverage.** For every family marked done: X2 and X3 report zero; for all families at the stage-4 gate: zero `review` findings and zero uncleared allowances.
5. **Codes.** X7, X8, X9 and X10 report zero over the whole staged tree; `icons_used.json` lists only icons the reskin classifies as reachable.
6. **No copies.** X4 reports zero for every family marked done; the `neutral` list has at most 400 keys, each with a reason.
7. **Languages.** Each ZIN English file has nine copies with identical values (X13).
8. **Ownership.** X14 reports zero; every key of the 22 families has exactly one writer.
9. **People.** The scripted localisation compiles in the Linux run; a console test gives an orc realm the orc variant of a term and a human realm the default; no `people` modifier appears in a no-scope family.
10. **Linux run (stage 4 and after each family).** `loc_check`, `loc_check_modifiers`, `loc_check_national_spirits` and `dump_equipment_loc` list no missing key outside `engine_keys.json`; `text.log` has no duplicate key beyond the declared `replace` files; `error.log` has no "Could not find coloring" line. Probes: P1 a `replace` key wins over the vanilla key; P2 a same-name whole-file override (and a header-only stub) replaces the vanilla file; P3 optional: `replace_path` on a localisation folder; P4 a missing key in a non-English language falls back to English; P5 a scripted localisation called from a tooltip with a country in scope returns the people variant; P6 a nested `$KEY$` inside a `pdx_tooltip` shows raw dollar signs (confirms the wiki, so X10 stays).
11. **Captures.** Linux screenshots of the main menu, the top bar, the pause menu, the diplomacy window, research, production, the ledger and ten tooltips read as Erdae to a reviewer with the banned list in hand. These are acceptance evidence, never Windows game screenshots.

**Inventory rows this spec supplies text for** (closed when the family's scan passes): UI-019, UI-073, UI-129, UI-130, UI-131, UI-132, UI-134, UI-135 (platform part), UI-136, UI-137, UI-160, UI-161, UI-162, UI-165; PS-013, PS-014, PS-045, PS-095, PS-098, PS-100 (text), PS-101, PS-174, PS-180, PS-182, PS-184, PS-191; WE-027, WE-037, WE-058, WE-066, WE-103, WE-111, WE-113, WE-127, WE-140, WE-141, WE-196, WE-197, WE-198, WE-199, WE-200, WE-201, WE-202, WE-203; MA-047, MA-048, MA-122, MA-137 to MA-151. That is 14 rows of the UI inventory, 12 of the politics inventory, 18 of the warfare inventory and 18 of the map inventory: **62 rows**. The rank rows (PS-045, WE-141, UI-134, WE-202) are closed jointly with [06_career_honours.md](06_career_honours.md) and [08_institutions.md](../03_gameplay/08_institutions.md); the weekday row PS-166 is closed by 06 alone.

## Open questions

All proceed on the proposal; those only the owner can answer go to [OPEN_QUESTIONS.md](../OPEN_QUESTIONS.md).

1. May the stage-4 conversion use `replace_path` on the localisation folders instead of about 85 same-name files? **Proposal, in use:** no; same-name overrides and stubs, with probe P3 recording whether `replace_path` would work.
2. Is the currency Authority? **Proposal, in use:** Authority (the master plan sketch says favour; the glossary entry is one line to change).
3. Do the three experience pools take Valour (the institutions spec) or the inventory's Renown? **Proposal, in use:** Valour, because Renown is Eindil's gauge.
4. Should near-copy detection (X4) block, or only warn? **Proposal, in use:** block at the 85% overlap on five words or more, tunable in `text_scan.mjs`; the vanilla-removal spec's C5 gains the `neutral` list as its allowlist (its present allowlist is proper nouns only).
5. Should British spelling be a rule for all ZIN text? **Proposal, in use:** yes (every Ready spec already uses it); the review class `us_spelling` enforces it.
6. How many people variants does the owner want? **Proposal, in use:** two entries now (manpower and division); more are added by data only.
7. Are the modifier stem labels ("Host Attack", "Craft Capacity") acceptable as composed text, or should the modifiers a player sees most be written by hand? **Proposal, in use:** composed by default; the 120 modifiers that ZIN ideas and laws show most often get literal rows (`lit` beats `stem`).

## Names this spec registers

| Name | Kind | Meaning |
| --- | --- | --- |
| `tools/content/data/glossary.json` | builder data | The master glossary. The names spec's file of the same path becomes `proper_names.json` |
| `tools/content/data/banned_words.json` | builder data | The banned list, 136 rules |
| `tools/content/data/ui_text/` | data folder | `files.json`, `inventory.json`, `ownership.json`, `reach_rules.json`, `engine_keys.json`, `exempt.json`, `neutral.json`, `empty_ok.json`, `frames.json`, `<family>.json` |
| `tools/content/lib/text_engine.mjs` | builder library | Glossary and template engine |
| `tools/content/modules/text_inventory.mjs`, `text_sweep.mjs`, `text_honours.mjs` | builder modules | Inventory, family writer, honours text |
| `tools/content/checks/text_scan.mjs`, `tools/content/text.test.mjs` | check and test | Checks X1 to X16 |
| `zin_term_<id>` | scripted localisation (pattern) | Per-people term variant |
| `zin_term_<id>_<people>`, `zin_term_<id>_default` | localisation keys (pattern) | Variant texts |
| `bw_<class>_<nnn>` | rule id (pattern) | Banned-word rules |
| `X1` to `X16`, `P1` to `P6` | check and probe ids | Section 6 and acceptance 10 |
| `localisation/replace/zin_<family>_l_<language>.yml` | generated file (pattern) | Waves 1 to 3 text |
| `docs/design/text/` | review copies | Inventory, scan report, icon and reach lists |

## Changes this spec asks of other specs

- [03_names_and_terms.md](../02_lore/03_names_and_terms.md): rename its `tools/content/data/glossary.json` to `proper_names.json`; keep `terms.mjs` and checks T1 to T6; add a test that its superseded-names table equals the `superseded_names` class.
- [06_vanilla_removal_and_zero_errors.md](../00_foundation/06_vanilla_removal_and_zero_errors.md): C5's allowlist (proper nouns only) gains the sweep's `neutral` list; section 3.5's "tools/content/data/ui_text/<file>.json" becomes `<family>.json`; the sweep's stage-4 conversion and the nine copies are added to stage 4.
- [02_full_ui_reskin.md](02_full_ui_reskin.md): the window titles of section 8 become glossary entries; the staff office window reads Council of Captains (the institutions spec) or the institutions spec changes to War Council, whichever the integrator picks; the banned list of section 8 is replaced by `banned_words.json`.
- [08_institutions.md](../03_gameplay/08_institutions.md): its terms (ranks, chairs, Valour, Folk Wares, Great Fairs, Sending Arms, Guild Licence, Courts of Whispers, Spells, Guilds) are glossary entries with the spec as source; its working labels are checked by the banned list.
- [01_warfare.md](../03_gameplay/01_warfare.md): the terms of section 2 and the support-company names are glossary entries; it keeps wording of its own objects.
- [02_economy.md](../03_gameplay/02_economy.md): acceptance 1's word list is the `modern_industry` class.
- The master plan: P5's "charcoal and coal" reads "Provisions and Stored Essence" (the economy spec).
