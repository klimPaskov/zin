# Reference lessons: a post-apocalyptic total conversion (version 5.1.x, game 1.19)

Study date 19 October 2026. Read-only study of one installed total conversion. Everything below is the author's own paraphrase of design principles. No names, text, scripts or assets were copied. Counts come from walking the installed folders.

## Summary: what makes it feel different

The mod does not reskin HOI4. It removes the vanilla database almost entirely and rebuilds each layer, so the player has no base-game vocabulary left.

1. **Total replacement.** The descriptor lists 95 `replace_path` entries covering countries, characters, focuses, ideas, decisions, technologies, units, doctrines, AI, events, history, music and portraits.
2. **A new world.** A custom 5632x2304 map with 21,832 provinces (about 60 percent more than the base map), 1,524 states, six custom continents and its own terrain atlas.
3. **Vocabulary swap.** 44 localisation override files (4,705 lines) rename engine concepts: factories become workshops, railways become roads, fuel becomes cells, plus ranks, terrain, supply, tactics and top bar. Engine hooks stay; only the fiction changes.
4. **New economy.** The six vanilla strategic resources are replaced by six setting-specific ones; a parallel currency economy (ledger, market, trade routes) sits beside factories; tech is gated into three civilisation levels per branch.
5. **Dense hand-made content.** 15,188 focus nodes, 8,168 events, about 2,900 decisions, 2,547 characters, 1,095 technologies, 124 sub-unit types.
6. **Own interface.** 128 GUI files (88,000 lines), about 38,000 sprite definitions, 32 bitmap fonts, a rebuilt top bar, event window, tech tree, loading screen, menu, music player, and an in-game hub that explains regions, mechanics, changelog and credits.
7. **Own audio-visual identity.** Per-faction-type 3D models and voice banks, loading art, a bundled third-party soundtrack.

Cost: 32,186 files, about 3.6 GB, over six years and more than a hundred contributors. ZIN must beat it on cleverness, not volume.

## Principles

**1. Replace the base database wholesale.** Anything vanilla that leaks breaks the illusion.
- Evidence: `descriptor.mod` 95 replace paths; start date and end date (125 years later) redefined; bookmark gives per-country highlights; 69 loading-screen files (240 MB).
- ZIN: *adopt*. Replace every content folder; ship a stub file in each so none is empty. Set the 1 Thaw 4A 1748 start in defines and bookmark from day one. Note gfx, interface and localisation are overridden by file name, so base files can still show through.

**2. Rename engine concepts instead of rebuilding the engine.** Cheapest way to change feel.
- Evidence: `localisation/replace` 44 files, 4,705 lines.
- ZIN: *adopt*. Forges, roads, wards, hearth-fire or aether for fuel. Keep one master glossary so every string agrees.

**3. Swap the resource base.** What the map produces changes strategy.
- Evidence: `common/resources` six redefined; `common/buildings` and 557 define overrides rescale economy and supply.
- ZIN: *adapt*. Six resources tied to peoples (deep metal, ancient timber, mana crystal, grain, salt, soul-stone or similar); the reference kept the count at six, matching the base icon strip, which keeps UI work small.

**4. Gate technology with levels and invisible switches.** Three civilisation-level techs per branch gate unit types; 152 hidden techs act as flags that enable sub-units and load starting templates.
- Evidence: `common/technologies` 21 files, 1,095 techs, 39 level techs, 7 access techs.
- ZIN: *adapt*. Use ages and lore knowledge; hidden switches also allow people-restricted units. Keep the visible tree modest.

**5. Nation categories drive shared content.** Six categories each own portraits, names, voices, advisors, laws and a generic focus tree. One country flag opts in; opposite flags opt out.
- Evidence: `portraits`, per-tag `common/names` (hundreds of files), voice assets per category, shared faction templates, generic trees, category triggers in a single scripted-trigger file.
- ZIN: *adopt*. Make the ten peoples categories with the same kit; flags override per nation. Minor countries inherit everything from category.

**6. Regional shared focus trees.** One file serves many minor tags; branches check the tag. Big powers get bespoke trees.
- Evidence: about 40 shared, generic or puppet files of 192; biggest tree 366 KB; average roughly 85 foci per tree; 178 trees in total.
- ZIN: *adopt*. Budget about 80 foci for a bespoke tree, 40 for a shared one.

**7. Monsters and special troops are ordinary sub-units.** Creature equipment archetypes are non-buildable and acquired by script; special company slots, per-faction entities, a few unique units tied to one country.
- Evidence: 124 sub-units in 29 files; 321 equipment definitions; creature, robot, mutant, powered-armour and unique-unit files.
- ZIN: *adopt*. Dragons, trolls, giants, ents and the dead as non-buildable archetypes granted by events, decisions or special projects. Cap at 10 to 15 monster types.

**8. Keep the engine slots, retheme the war.** Land, sea and air slots stay; naval hulls shrink to four classes; air gets airships and gliders; doctrines are custom folders, tracks and perks; strategic weapons stay but become rare.
- Evidence: doctrines 2 folder files, 5 tracks, 5 grand doctrines; 75 perk techs; air 24 types; 11 ship module files.
- ZIN: *adapt*. Land as infantry, mounted, siege beasts; sea as a few hulls; dragons in the air slot; strategic weapons as rare rituals.

**9. Every major mechanic has a spec, variables, a screen and decisions.** Currency market, scavenging, border wars, refugee and population flow, elections, leader stat-and-perk system, inventory.
- Evidence: 131 scripted GUIs in 57 files; 14 balance-of-power files; 15 operation files; 11 design docs.
- ZIN: *adapt*. Five signature mechanics (artifact bearing, corruption or shadow meter, calendar and seasons, oaths, monster taming), each specced before content.

**10. Anti-snowball by population loss.** Transferring a state halves its industry and restores it on return; a richer refugee system later replaced it.
- Evidence: a design doc, exodus on_actions, a per-state opt-out flag and a scripted GUI that shows effects.
- ZIN: *adapt*. Frame it as razed fields and fled peoples, with story-state opt-outs.

**11. AI guidance from data, flags and rules.** 112 AI strategy files, 79 plans, 12 focus lists, 25 template files (creature, robot, garrison), 116 AI define overrides. A war-creation system gives AI claims and justifies wars through events; story nations carry protection flags; expensive checks run on a coarse tick.
- Evidence: `common/ai_*`, `ai_on_actions`; 176 game rules, about 40 of them per-nation "follow story or free" AI choices; 13 "unifier" rules merge regions at start for speed.
- ZIN: *adopt*. Per-realm story-or-free AI rules; monster division templates; tuned peace and tension defines.

**12. UI rebuilt screen by screen, with a hub.** Each vanilla screen gets its own GUI file and sprites.
- Evidence: `interface` 415 files; `gfx/interface` 15,679 files (977 MB): focus icons 7,677, ideas 3,297, technologies 792, equipment 690; tech-tree GUI 9,349 lines; top bar 1,104 lines.
- ZIN: *adapt*. Reskin menu, loading, top bar, event, focus, tech, decisions, production, designer, politics, map and diplomacy first; add a generated in-game guide.

**13. Generate repetitive content, validate everything.** Four repeating patterns come from YAML or CSV via scripts; a sanity script checks bad characters, line endings, merge markers, whitespace and mixed indents; other scripts evaluate supply areas and adjust state resources; icon shine variants are scripted.
- Evidence: `scripts` 10 files, `templates` 23 files, 2 shine tools.
- ZIN: *adopt*. Use the project's own MCP validators in place of Ruby. Note the shipped scenario-test folders are empty and only 3 AI test files exist, so automated tests were thin.

**14. Conventions and add-on hooks.** Country flags opt nations into categories, reserved character-ID ranges per country, leader-ID triggers independent of names, and a how-to for adding a country.
- Evidence: modder guide (22 KB), checklist doc, ID range table.
- ZIN: *adopt*. Reserve ranges per realm; use ID triggers.

**15. Map built on geography and engine limits.** Mountain ranges are impassable state blocks, navigable rivers are sea provinces, a tunnel terrain and a hazard terrain add variety, and straits get adjacency rules for enemy, friend and neutral.
- Evidence: 117 impassable states; provinces by terrain: plains 8,607, hills 3,788, desert 3,772, forest 1,805, jungle 806, urban 731, mountain 675, marsh 386, ocean 1,114, lake about 95, hazard 51; 610 adjacency rows; 226 strategic regions; 321 supply areas; 14 state categories (by settlement size); 3 terrain atlases.
- ZIN: *adapt*. Impassable ranges with named passes; one hazard terrain (blighted lands) and a deep-roads tunnel layer; settlement-size state categories. Keep provinces well under 15,000 for load time.

## Scale table

| Item | Reference mod | Note |
| --- | --- | --- |
| Files / disk | 32,186 / about 3.6 GB | gfx 2.7 GB, music 0.5 GB, map 0.18 GB, sound 0.13 GB |
| Script lines | about 2.19 million | common 1.29 million, events 217,000, country history 41,600 |
| Provinces / states | 21,832 / 1,524 | 5632x2304 |
| Strategic regions / supply areas | 226 / 321 | |
| Country tags / histories | about 360 / 354 | about 95 bespoke trees |
| Focus trees / foci | 178 / 15,188 | includes shared, generic, puppet, joke trees |
| Events | 8,168 in 237 files | |
| Decisions / ideas | about 2,900 / about 7,000 | |
| Characters / leader traits | 2,547 / 411 | |
| Technologies / sub-units / equipment | 1,095 / 124 / 321 | 152 hidden techs |
| Scripted effects / triggers / GUIs | 1,695 / 2,527 / 131 | on_action blocks 1,093 |
| Game rules | 176 | |
| Localisation | 1,056 files, about 150,000 lines | English only; other languages are separate community mods |
| GUI files / sprites | 128 / about 38,000 | 2,726 window definitions |
| DDS / TGA | 19,290 / 3,063 | flags 3,048, leaders 1,377, event pictures 943 |
| 3D | 221 meshes, 212 animations, about 2,600 entities | 833 MB |
| Fonts / loading images | 32 / about 34 | |
| Music / sound | 218 tracks, 8 stations / 645 wav, 1,982 effect entries | soundtrack is third-party |
| Docs / scripts / templates | 11 / 10 / 23 | |

## Pitfalls (from the mod's own 227-entry changelog and layout)

The changelog says "fixed" 213 times, "AI" 104, rebalance words 116, "missing" 89, civil war 70, crash 45, performance 13.

1. **Script crashes.** Causes: focuses that move characters, retired or removed characters, auto-joined wars in conversion civil wars, divide by zero, endless reroll loops, capitalisation mismatches, misspelled follow-up event IDs, starting divisions that reference missing templates or ship types, AI files pointing at deleted tags, the trait menu, alert GUIs at low resolution. ZIN: validate every ID reference and every tag in AI files.
2. **Missing assets and strings.** Portraits, divisions, icons, advisor art and localisation recur as fixes, and a placeholder image still ships. ZIN: a build check for missing sprites, strings and flags.
3. **Civil wars and conversions are the biggest bug source** (twenty-plus entries). ZIN: few of them, each tested, release paths scripted by flags.
4. **Balance volatility.** Signature units and economy rebalanced again and again. ZIN: baseline stats in a spreadsheet and early playtests.
5. **Performance.** Country-wide triggers, advisor and law checks, distance calculations and diplomacy effects were optimised after release; coarse ticks and map unifiers came later. ZIN: budget provinces and tags; no per-country loops in daily on_actions.
6. **Exploits.** A supply exploit let soldiers generate supplies; snowballing forced a conquest penalty. ZIN: test conquest and supply with every new modifier.
7. **Branches stuck on missing realms.** Bypass logic was added so trees continue when a realm does not exist. ZIN: write bypasses for cross-realm dependencies.
8. **Install friction.** Launcher quirks, conflicts with old copies, a required clean mod list, fixed resolution and UI scale. ZIN: declare supported setup.
9. **Third-party content.** Bundled soundtrack and imported art limit distribution. ZIN: original audio only.
10. **Replaced folders left empty** can crash or hide features. ZIN: stub files.

## Ideas for ZIN (going beyond it)

1. **A living calendar.** The reference keeps ordinary dates. ZIN can let named Erdae months drive harvest, thaw, flood and long-night effects through seasons, supply defines and dynamic modifiers.
2. **Peoples that change rules, not only skins.** Elves with leaders that never age out; orcs with a horde meter in place of manpower; the dead with no population but upkeep; ents moving by season; giants with few, huge units; demons bound by oaths. Use modifiers, dynamic modifiers and bespoke laws.
3. **Artifacts as map objects.** The reference uses inventory screens. ZIN can place artifacts on the map, bound to states or characters, with bearers, corruption and a global race to seize them.
4. **Magic as research.** A spell track in the special-projects slot, tied to leaders and artifacts, with failure risk.
5. **A shared hidden-hand story state.** The Golden King, Eindil and Afrit threads as visible variables so each event reveals a piece; endings depend on seals broken.
6. **Procedural lore text.** Scripted localisation varies names and titles by people so minor countries feel specific without bespoke trees.
7. **Data-driven everything.** Generate trees, laws, decisions and templates from one data set per people, checked by the repository's MCP validators on every commit.
8. **Generated guide.** An in-game hub built from the same data as the mechanics, so it never goes stale.
9. **Smaller and sharper.** About 25 bespoke trees, 10 people categories, 60 shared trees and 1,500 events, each system tied to the story.
