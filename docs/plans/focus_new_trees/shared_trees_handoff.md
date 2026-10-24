# Handoff: the new shared trees (delving holds, middle free, small folk)

**Date:** 24 to 25 October 2026. **Author:** shared-trees subagent (Claude Code), working autonomously while the owner was away. **For:** the implementation lead. **Status of the content:** proposed; nothing here is owner-approved beyond the decisions it cites.

## Files

| File | What |
| --- | --- |
| `docs/design/focus/shared_delving_holds.json` | 69 focuses, 23 spirits, 4 events, 11 opinion modifiers, 4 AI strategies; Kunhrim, Hrakbrund, Brundahrim, Gromkerm |
| `docs/design/focus/shared_middle_free.json` | 58 focuses, 19 spirits, 5 events, 11 opinion modifiers, 5 AI strategies; Olodor, Dunelaeth, Aenor Forest |
| `docs/design/focus/shared_small_folk.json` | 42 focuses, 12 spirits, 3 events, 5 opinion modifiers, 3 AI strategies; Dobbum, Tirlan |
| `docs/specs/05_focus_trees/shared/shared_delving_holds.md` | spec: purpose, the three-region exception, lore basis, route plans, spirit lifecycle, AI, icons, full focus, spirit, event and opinion tables, route coverage, owner questions |
| `docs/specs/05_focus_trees/shared/shared_middle_free.md` | spec, same structure |
| `docs/specs/05_focus_trees/shared/shared_small_folk.md` | spec, same structure, with the reason for a new shared tree instead of a module |
| this file | handoff |

No builder file, compiled game file, localisation file or existing tree was edited. The specs' tables were generated from the JSON by a scratch script, so they match the data exactly.

## Focus counts and routes

| Tree | Focuses | Shared part | Country parts | Tier range (shared 40 to 70) |
| --- | ---: | ---: | --- | --- |
| `shared_delving_holds` | 69 | 33 | 9 each (Kunhrim, Hrakbrund, Brundahrim, Gromkerm) | in range |
| `shared_middle_free` | 58 | 21 | Olodor 13, Dunelaeth 12, Aenor Forest 12 | in range |
| `shared_small_folk` | 42 | 24 | 9 each (Dobbum, Tirlan) | in range |

Routes (details in the specs):

- **Delving holds:** the council of the hold (Council of Clans, Wild / Forge-Masters, Dominion / Wardens of the Gate, Light), the gate-trade, the deep halls, the powder secret (keep or sell; the buyer focuses fire one shared event to Kingson, Lerendor, Kradlon, Buldor or Gunwyn), axes and hammers (no bows), the old grudge (keep or bury; an elven envoy event); Kunhrim's Iron Charter (iron for the crown, a charter petition to Parim, the iron embargo after the Golden King's death, the Lamp Truce with Burrikkrit); Hrakbrund's Hill Pact (guarantee of the Heodwa Lands, bombards for Sonargur through the lean); Brundahrim's fire-hold (the Ronbo Oath guarantee of Dobbum, powder for the West, fire for the Crossing or not, through Western unity); Gromkerm's old hold (Saopon's looting, the weregild event, the bowshot rule, bombards for Gunwyn alone).
- **Middle free:** how the world finds us (unseen / friends in Parim / near neighbours), what the land gives, the old defences, when the dead come; Olodor's hidden holts with the luck count `zin_olodor_luck`, the door under the bridge (Parim brings gold or takes it), a chance to be found; Dunelaeth's lost kin (return east as Herrodon's subject, stay as guides, or join the Kindred), the word with Kunhrim; the Aenor Forest's stands (voices to Selen, the felling question, the Burnt Edge, a stand that moves, shelter or wake in the war).
- **Small folk:** the moot, the harvest with the stores count `zin_small_folk_stores`, the hearth-leaf (through the guards or to the markets), stay home or answer a friend, when the war comes (hide the children, bread for the hungry, the small folk go out with bread for their overlord or Thenon); Dobbum's Ronbo Watch (Thenon's guarantee, the two passes, slings, leaf and cheese for Brundahrim, the Orchard Gift); Tirlan's Old Promise (the harvest share for Hirolon, the cairn-halls, a stranger at the Saddle, the Warden's walk to Parim).

Cross-tree hooks: Dunelaeth's event to Kunhrim and Kunhrim's elven envoy event share the flag `zin_delving_grudge_eased`; Dobbum's event to Brundahrim mirrors Brundahrim's *The Ronbo Oath Kept*.

## Compile evidence

Scratch script `compile_trees.mjs` in the session scratchpad (not committed) imports `tools/content/modules/focus_compiler.mjs` (`analyseTrees`, `compileTree`, `layoutFile`) and `tools/content/checks/focus_checks.mjs` (`gateWarnings`, `countRaw`). It used:

- the three tree files only;
- a country table built from `tools/content/data/world/roster.json` (name, tag, legacy scan label), because the builder's current `data/countries.json` is the old 305-row table in which these realms do not exist under these names (the roster migration on `roster-int` replaces it with `lib/roster.mjs`; the trees name countries exactly as that roster does);
- a registry built from every compiled `.txt` under the mod's `common/` and `events/`, read through the compiler's own `scanStaged`, so mechanic effects, triggers, ideas, flags and other trees' ids count as written;
- `expected: []`, so the all-countries coverage check waits (the other trees are not in the run).

Result on the final files: **0 problems** from `checkTrees` (schema, keys, prerequisites and positions, durations, icons and pictures, modifiers against the game's documentation, references, collisions with every compiled id, allow_branch rules, text charset and retired names, tier range, raw count) for all three trees; **0 raw blocks**; no gate warnings. Problems found and fixed on the way: four opinion modifiers whose ids equalled a focus or spirit id (renamed), one focus not below its prerequisite (moved), one spirit with no icon (icon added).

Text scan: `node tools/content/checks/text_scan.mjs <scratch>/out --report …` on the compiled output. **No finding on any key of the three trees** after two review hits ("Fighters" in a focus name, "fighters" in a spirit description) were reworded. The scan's overall result reads FAILED with 1,165 X3 errors: those are vanilla keys that have no ZIN replacement in a staged folder holding only these three trees' files, and none of them is a key of these trees.

## MCP evidence

The connected `hoi4_agent_tools` server resolves only its own workspace (the mod), and its focus routes found no source outside `common/national_focus/` (`.tmp/` and `artifacts/private/` returned `FOCUS_SOURCE_NOT_FOUND`). To work on a staged mod copy without touching `common/`, the subagent ran the same installed server (`hoi4-agent-tools.cmd`) over stdio from the scratchpad with its own configuration (`hoi4-agent-tools-setup --init --config <scratch>/mcp_config.json --mod-root <scratch>/stageroot`, then `HOI4_AGENT_CONFIG` pointing at it), with the working directory at `<scratch>/stageroot/zinstage`: the compiled files of the three trees plus copies of the mod's `descriptor.mod`, catalog icon `.gfx` files and textures, `common/continuous_focus`, `common/scripted_effects`, `common/scripted_triggers`, `common/ideas`, `events` and the foundation localisation. Workspace id `mod_zinstage_a33c667c7455`.

| Route | Tree | Result |
| --- | --- | --- |
| `hoi4.focus_inspect` | delving holds | `FOCUS_INSPECTED`, 69 focuses; first run: 11 `FOCUS_GAMEPLAY_REFERENCE_MISSING` errors because the staged copy lacked the mechanic effects (fixed by copying `common/scripted_effects` and `scripted_triggers`; the compiler had already resolved them); final: 2 warnings `FOCUS_LAYOUT_LONG_CONNECTOR` (root to *The Clan Moot*, 10 columns; root to *The Old Grudge*, 11 columns), no other diagnostic |
| `hoi4.focus_inspect` | middle free | first run: 1 warning `FOCUS_LAYOUT_LINEAR_DETOUR` (*Voices in the Wood* to *Water at the Edge*); fixed by moving the Aenor Forest branch (voices to 16,7, felling question to 20,7, no axe to 19,8, fallen wood to 21,8, tzikor to 20,9); final: no diagnostic |
| `hoi4.focus_inspect` | small folk | no diagnostic |
| `hoi4.focus_raster` (review scale 0.5) | all three | PNG, SVG, HTML and plan rendered and looked at: no overlapping boxes, no crossing connectors, no connector through a focus; the shared rows read as separate branch families and each country band sits below them in its own columns. The two long connectors of the delving tree are the root's fan-out to its outermost branches (six branch heads on one row cannot all sit within eight columns of one root); they run along the top of row 1 and cross nothing. Kept and recorded |
| `hoi4.probability_inspect` (`national_focus_ai_will_do`) | all three | **Blocked:** `PROBABILITY_GAME_VERSION_UNSUPPORTED`, the adapters are verified for 1.19.2.0 (d245) and the installed game is 1.19.3.0.c01a; the same error on the existing `zin_shared_north_lands` through the session's own server. No probability evidence exists for these weights |

Reference evidence: `hoi4.reference_search` on the offline wiki's National focus modding page (mutual exclusion, prerequisites, shared focuses; section ids recorded in the session) before writing.

## Registration the lead must do (builder and other trees)

1. **Tiers spec and coverage.** Regenerate `docs/specs/05_focus_trees/01_tiers_and_coverage.md` from the new roster with the three tree ids (`expectedTreeIds` reads backticked ids), recording the delving tree's three-region exception.
2. **Country lists of other trees.** Remove **Dobbum** from `shared_west_lands`' `countries` (the `roster-int` worktree's WIP list is Werlendor, Thenon, Dobbum, Saopon, Wennarith; it becomes four). **Kunhrim** already leaves `shared_concord_dominions` in that worktree; confirm. Hrakbrund, Brundahrim, Gromkerm, Olodor, Dunelaeth, the Aenor Forest and Tirlan are in no other tree.
3. **Roster.** Set `focusTree` of Dobbum and Tirlan to `shared_small_folk` in `tools/content/data/world/roster.json` (now `shared_west_lands` and `new`), and the `focusNote` of Dobbum.
4. **Names.** The trees name countries as the 24 October roster does (Kunhrim, Hrakbrund, Brundahrim, Gromkerm, Olodor, Dunelaeth, Aenor Forest, Dobbum, Tirlan, Aenor, Kingson, Burrikkrit, Heodwa Lands, Lerendor, Kradlon, Buldor, Gunwyn, Saopon, Thenon, Herrodon, Hirolon, Selen, Konori, Bloody Forest, Magical Forest). If `canon_renames.mjs` renames any of them later, these files are in its path rules' scope.
5. **Compile in the real build** once the roster migration lands: `node tools/content/build.mjs`; nothing in the builder needs a change for these trees (no new keyword codes, no registry entries: the trees declare no scripted effects or triggers, and every flag they read is set inside the three trees or already known).
6. **Powder equipment.** When the warfare owner adds black-powder equipment (K19), swap `zin_catapult_equipment` and `zin_trebuchet_equipment` in *The Bombard Foundries* and in the delving tree's event 2.
7. **Icons.** Add the requested catalog keys if the art budget allows (`dwarf_hold_gate`, `powder_casks`, `bombard_casting`, `dwarf_axe_hammer`, `gnome_holt_door`, `walking_conifer`, `elven_guide_horn`, `smoking_leaf`, `round_door_hearth`, `giant_watch`); until then the trees use the nearest existing keys and build without them.
8. **Decision families.** Each spec proposes a small decision family (gate market, sworn buyers, Notch packmen, closing the gate; bringing gold to Olodor, hiring Dunelaeth's guides; sending grain, selling leaf). The focus format writes no decisions; the flags they need are already set by the trees.
9. **Probability audit.** Run the `hoi4_ai_probability_auditor` cycle on these weights when the probability adapters support 1.19.3.

## Simplifications, omissions and blockers

- **No expansion branches.** None of the nine realms expands in its lore (holds sell and defend, the free realms hide, the small folk stay home); each spec records this against the focus skill's large-tree rule.
- **No decisions, no scripted GUI, no scripted localisation**: the format does not write them. The two counts (`zin_olodor_luck`, `zin_small_folk_stores`) are shown through focus tooltips only, and *Bread for the Hungry* shows a raw variable test as its requirement.
- **Bombards are stand-ins** (catapult and trebuchet equipment, siege research, siege-attack modifiers) until powder equipment exists.
- **`max_dig_in` 2 and 4** in the Gromkerm spirits are on the engine's small scale, a documented exception to the multiples-of-five rule.
- **Two long-connector warnings** remain in the delving tree (root fan-out), recorded above.
- **AI weights are unaudited** (MCP probability adapters blocked by the game version).
- **No leader, advisor, portrait or flag changes**: shared tier C trees; the political routes change ideology and spirits only.
- **No achievements.**
- **No in-game test**: compile, text scan and MCP evidence only.

## Owner questions (also in the specs)

1. May text name "bombards" and "black powder" for the dwarf holds, given the voice spec's rule that no text names a firearm until the powder realms are settled?
2. Should a hold's council change its ideology (Forge-Lord to Dominion, Charter of the Gate to Light), or should every hold stay Wild?
3. Is Kunhrim's Iron Charter a sixth charter of the Aenor mechanic, or a name for its Old Charter?
4. Does the Lamp Truce mean a non-aggression pact between Kunhrim and Burrikkrit in game terms?
5. Should Dunelaeth's return east make it Herrodon's subject (as here) or remove it from the map?
6. May the Baelim leave their forest to fight, or only defend it?
7. When Olodor is found, does all of Parim know (a global flag, as here)?
8. Are the small folk called Bykkwyn (West) and Tirim (Hirolon) in text, or "the small folk" everywhere (as here)?
9. May the small folk keep a Watch of their own instead of the men of the Ronbo Watch?

## Skills used

`hoi4-focus-trees` (with its layout, rewards, route-design and completion references), `hoi4-feature-planning` principles for the specs. No skill was created or updated.
