# Handoff: the Burrikkrit and Nether regional focus trees

**Date:** 25 October 2026. **Author:** focus subagent, working autonomously while the owner is away. **Disposition:** implemented as design data and spec sections with compile and MCP evidence; **registration in the tiers spec and the roster's `focusTree` field is queued for the lead** (those files are outside this task's paths). Nothing here is owner-approved: every focus, spirit, event, number and route is proposed, and the owner questions are listed at the end.

## Files

| Path | What |
| --- | --- |
| `docs/design/focus/regional_burrikkrit.json` | Design data, tree `regional_burrikkrit` for Burrikkrit (BRR) |
| `docs/design/focus/regional_nether.json` | Design data, tree `regional_nether` for the Nether (NET) |
| `docs/specs/05_focus_trees/regional/middle_lands.md` | New section "12. Burrikkrit" (route plan, focus, spirit and event tables, AI, owner questions, registration) and one sentence in Purpose |
| `docs/specs/05_focus_trees/regional/ember_lands.md` | New section "The Nether" (same contents) and one bullet in Purpose |
| `docs/plans/focus_new_trees/burrikkrit_nether_handoff.md` | This file |

No file under `tools/content/`, `common/`, `localisation/` or another tree was edited.

## Size and routes

| Tree | Focuses | Spirits | Events | Opinion modifiers | Tree scripts | AI strategies | `raw` blocks |
| --- | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| `regional_burrikkrit` | 50 | 20 | 9 | 4 | 1 trigger | 4 | 6 (5 guarded `recruit_character`, 1 trigger body) |
| `regional_nether` | 46 | 13 | 7 | 5 | 1 trigger, 1 effect | 5 | 8 (4 guarded `recruit_character`, 4 tag checks) |

Both are inside the regional range of 30 to 50 focuses (Burrikkrit sits at the upper bound).

### Route coverage

| Required route (roster note and task) | Implemented branch | Status | Notes |
| --- | --- | --- | --- |
| Burrikkrit: the Lamp Truce | B "The Lamp Truce" (10) | Done | Relight (non-aggression, iron, truce sworn anew) or let it gutter (tunnels, war goal on Kunhrim in the war-years, galleries held) |
| Burrikkrit: the under-roads as a secret to sell | C "The Under-Roads" (11) | Done | Four exclusive answers: sell south (Puvulan; dominion strength, Gathering Dark), to the crown (Aenor), to the West (Gunwyn), or keep dark; Nolorim's pass watch rises on every sale |
| Burrikkrit: the hobgoblin succession | A "The Throne-Cave" (11) | Done | The Old Custom, Chosen at the Lamp, Feed an Heir (Nubbix); capstone upgrades the opening spirit |
| Burrikkrit: wurgh riders | D "Wurgh Riders and the Shield-Wall" (6) | Done | Mounts, riders (Blikkit), shield-wall, fire-pots (Krittik), hobgoblins carry the stone, warren host |
| Burrikkrit: gold-hunger | E "Gold-Hunger" (7) | Done | Counting-Cave, then Spend the Hoard or Fill the Hoard |
| Burrikkrit: war-years and divergences B18, B23 | F "The War-Years" (4) plus C and B | Done | Stand with the Pass-Lord or raid; dug in deep |
| Nether: the houses | A "The Houses of the Halls" (9) | Done | King's Favour or the Houses' Due; humble Agon's house or give it the Maw |
| Nether: the pacts | B "The Pacts" (7) | Done | Pact-heralds, a summoner, thralls, the king does not take the dead (K15), every bargain kept |
| Nether: the gates | C "The Gates" (7) | Done | Rings cleared and relit with Nezer's broken ring; gates for Nafeher or for the houses; fire from the rings in war |
| Nether: the bargain with Nafeher | D "The Bargain with Nafeher" (7) | Done | Renew, raise the price or refuse (moves `zin_nether_pact` on Puvulan); companies for hire or the Maw disputed |
| Nether: a choice when Volgan's body breaks | F "Silence in Nafeher" (5) | Done | Real three-way choice: hold the Steward to the bargain, call the freed kin home, or seal the Halls |
| Nether: economy, navy, devils and the lava rite | E "The Burning Shore" (8) | Done (proposed) | The Nether keeping the lava-rite pits is owner question NET-3 |
| Nether: war | G "The Houses at War" (3) | Done | Only when at war; the AI never invades the surface |

## Compile and check evidence

All runs used private scratch folders (`TEMP` and `TMP` set to the run folder) under the session scratchpad, `brrnet_focus/`.

1. **Builder compiler.** A scratch script (`brrnet_focus/compile_new_trees.mjs`) imports `tools/content/modules/focus_compiler.mjs` and calls `buildFocusTrees` on a folder holding only the two files, with the roster built from `tools/content/data/world/roster.json` (at the time of the first runs the builder's own roster did not yet hold Burrikkrit, the Nether, Puvulan, Khorvrath or Gunwyn; see registration step 1 for the check after the merge) and the default registry (`focus_registry.json` plus every `focus_registry_<slice>.json`). Result: 2 trees, 96 focuses, 33 spirits, 16 events, 17 staged files, no problem from the compiler checks of `tools/content/checks/focus_checks.mjs` (`checkTrees`, `checkCollisions`, `checkModifiers`, `checkLayoutRefresh`: structure, prerequisites, exclusives, positions, days, icons, event pictures, references, calls and argument codes, `allow_branch`, Windows-1252 text, retired and superseded names, the Afrit secret, tier range). Warnings: the coverage wait (only 2 trees present) and the two `raw` counts.
2. **Text scan.** `node tools/content/checks/text_scan.mjs <staged> --report <file>`: zero ZIN findings of any check (no banned word of error or review severity, `zinBannedError` 0, `zinBannedReview` 0); the run "fails" only on 1,165 X3 findings, which are vanilla keys a partial staging cannot replace and are unrelated to these trees.
3. **Knowledge-layer scan.** The builder has no implementation of the `kl_*` rules of `docs/lore/references/knowledge_layers.md`, so a scratch scanner (`brrnet_focus/kl_scan.mjs`) applied all 64 parsable rules to the compiled English localisation. The first run found two hits (`kl_mystery_018` "the dwarves of the Deep Hall"; `kl_mystery_005` a sentence opening "The King of Demons has..."); both were reworded and the final run has 0 hits.
4. **Voice.** Texts follow `docs/specs/02_lore/09_voice_and_style.md`: whole sentences, British spelling, no implementation talk, no exact ages, no firearm named, the king never named, Volgan's fate left open with the Ember Lands spec's phrases.

## MCP evidence

The session's `hoi4_agent_tools` server is bound to the real mod, and `hoi4.focus_inspect` returns `FOCUS_SOURCE_NOT_FOUND` for files outside the indexed game folders (tried `.tmp/brrnet_focus/...`). So the compiled output was placed in a **staged mod copy** (`brrnet_focus/mods/zin_brrnet_staged/`: the mod's `descriptor.mod`, the compiled files, `common/continuous_focus/zin_continuous.txt`, the helper files `common/scripted_effects/zin_dominion.txt`, `zin_elves.txt`, `zz_zin_pending_effects.txt`, the catalog GFX and `gfx/interface/goals/zin/`), and the installed server (same package) was started on it with a private configuration written by `hoi4-agent-tools-setup --init --config <scratch>/mcp_config.json --mod-root <scratch>/mods` (no global or client setting changed). A small stdio client (`brrnet_focus/mcp_call.mjs`) called `hoi4.focus_inspect` and `hoi4.focus_raster` for both trees. The session server was also used for `hoi4.reference_context` (surface focus) and `hoi4.reference_read` (wiki "National focus modding", Examples, lines 680 to 739) and for a precedent inspect of `zin_regional_nezer`.

| Run | Burrikkrit | Nether |
| --- | --- | --- |
| Inspect 1 | 50 focuses, 56 connectors, 0 crossings, 0 node intersections, 0 too-close pairs; 11 errors: 5 missing characters, 6 missing helpers (helpers not yet in the staged copy) | 46 focuses, 0 crossings; 13 errors (4 characters, 9 helpers); warning `FOCUS_LAYOUT_LINEAR_DETOUR` on `the_obsidian_galleries` → `fire_glass_and_sulphur` |
| Fix | Helper files added to the staged copy | Burning Shore re-laid so each single-child link is straight (fire-glass under the galleries, forts under the galleys, devils and the lava rite one column right, `the_shore_holds` centred) |
| Inspect 2 and 3 | 0 crossings, 0 detours; 5 errors left: `FOCUS_GAMEPLAY_REFERENCE_MISSING` for `zin_burrikkrit_snikit`, `_nubbix`, `_zigka`, `_blikkit`, `_krittik` | 0 crossings, 0 detours; 4 errors left: `zin_nether_khorvael`, `_zhorara`, `_zarek`, `_thazira` |
| Raster | Rendered PNG reviewed: six branch families read clearly, exclusive pairs on one row, no overlaps, short connectors | Rendered PNG reviewed: seven families, the Volgan choice centred under the gates, no overlaps |

The remaining errors are expected: the characters exist in `tools/content/data/world/characters/*.json` but no builder module writes them to `common/characters/` yet. They clear when the characters module builds the new roster's courts.

Not run: a scenario audit of the AI weights through `hoi4_ai_probability_auditor` (the weights are new, not a patch of an existing weighted source; the lead may route a baseline audit before balance tuning).

## Registration steps for the lead

1. **Roster.** The roster merge (`981d6d01`, landed while this task ran) gives the builder the new names, and the trees are written for them (Puvulan, not Volgan, for the country; Gunwyn; Khorvrath). A final read-only analysis with the builder's own roster and registry over all 99 tree files of `docs/design/focus/` (`analyseTrees`, scratch `brrnet_focus/check_all.mjs`) reports **no problem about either new tree**; the one problem in the whole set is a `coverage_many` that belongs to another country.
2. Add `regional_burrikkrit` to the Middle Lands tier B list and `regional_nether` to the Ember Lands tier B list of `docs/specs/05_focus_trees/01_tiers_and_coverage.md` (the compiler's `expectedTreeIds` reads it), and set `focusTree` of both roster rows from `new` to the tree ids.
3. The characters module must write the eleven court records named in the spec sections (`zin_burrikkrit_snikit`, `_zigka`, `_krittik`, `_blikkit`, `_nubbix`; `zin_nether_khorvael`, `_zhorara`, `_zarek`, `_thazira`, plus the rulers). The tree's recruit is guarded with `has_character`, so a character already recruited by history is left alone, but the game will log an unknown character if the id is not defined.
4. `raw` blocks name the new roster tags `KUN`, `NEZ`, `KHO` and `DLN`; if the merge changes a tag, update the two tree-declared scripts.
5. No registry entry is needed: every called helper, checked trigger and read flag is in `focus_registry*.json` or set by the trees. Optional hooks for other owners: the sale flags `zin_burrikkrit_road_sold_south`, `_crown`, `_west` and `zin_burrikkrit_road_kept` (the map owner's hidden adjacency under the range), and `zin_nether_pacts_open`, `zin_nether_pacts_deep`, `zin_nether_keeps_lava_rite` (the dossier's "Call on the King of Demons" decisions and the bestiary's "The Lava Rite" decision).
6. Building slots: both realms are 1 to 2 states, and Burrikkrit's tree adds up to six slot buildings (three `industrial_complex`, three `arms_factory`, exclusive routes included) and the Nether's four (two `industrial_complex`, one `arms_factory`, one `dockyard`), most of them at the capital. Check the capitals' slot counts after the map step; `add_building_construction` does nothing when no slot is free.

## Icons

All focus icons are existing catalog keys of `docs/specs/05_focus_trees/02_icon_catalog.md` (`presentation-cells.json`), and spirits take the icon of the focus that adds them.

- **Burrikkrit (38 keys):** lantern_chain, throne_gold, council_table, crown_broken, giant_hammer, seal_wax, feast_table, war_drums, seal_royal, granary, handshake_oath, traders_road, pass_fort, scroll_sealed, beacon, chain_broken, forge_anvil, mine_cart, scroll_treaty, goblin_raiders, quarry_stone, map_unrolled, scout_lantern, coin_chest, ring_doors, banner_black, palace_parim, ship_voyage, fort_wall, grave_host, tribute_chest, wild_hunt, sword_shield, foundry_fire, ledger_coins, market_stalls, workshop_tools, crown_gold. Event pictures: generic_court, generic_war, generic_wilds, grave_muster.
- **Nether (32 keys):** throne_ashen, crown_iron, demon_horn, scroll_sealed, seal_royal, council_table, chain_broken, nether_gate, rune_stone, envoy, censer, seal_wax, levy_muster, grave_field, handshake_oath, ring_doors, quarry_stone, banner_black, tribute_chest, fort_wall, scroll_treaty, ember_desert, mine_cart, galley_oars, foundry_fire, ashen_waste, bones_risen, war_drums, beacon, silent_throne, banner_league, ward_circle. Event pictures: ember_lands_storm, grave_muster, volgan_broken (gated by `zin_volgan_body_destroyed`; its only firing focus requires the flag).

**New icons worth generating** (proposed catalog additions for the art phase; none is required to compile): `warren_lamp` (a goblin lamp in a throne-cave, for `the_lamp_in_the_throne_cave`, `the_lamp_passes`), `wurgh_rider` (a goblin on a pale-eyed warren wurgh, for `wurgh_pens_of_darkhere`, `riders_by_night`), `under_road` (a chalk-marked tunnel mouth, for `the_under_roads`, `chalk_marks_in_the_dark`), `hobgoblin_shield` (a door-sized shield, for `the_hobgoblin_shield_wall`); `throne_of_embers` (an obsidian throne in slow fire), `portal_ring` (a standing ring of black stone with fire running round it, for `the_portal_rings`, `the_rings_relit`), `pact_seal` (a seal with the card's pentagram, allowed by K26, for the pact branch), `devil_lair` (a devil on the Burning Shore, for `devils_of_the_burning_shore`), `fire_galley` (a black iron galley on the Sea of Lava). Images use gpt-6-luna only (K50) and are recorded in `art/source/provenance.jsonl`.

## Simplifications, omissions and blockers

- **Not registered** (queued, reason: the tiers spec and the roster are outside this task's paths; see steps 2 and 3). The trees are not in the game files until the lead runs the build and apply.
- **Characters** are recruited by `raw` blocks and are not yet defined in `common/characters/` (MCP errors listed above).
- **No hidden adjacency** is created by the under-road sale: the trees set flags, and the map owner decides whether the sale opens the route the dossier proposes.
- **No "Call on the King of Demons" decision family**: the dossier proposes it as a mechanic; the tree only sets the hook flags. The pacts in the tree are events and focuses.
- **No AI probability audit** was run (see MCP evidence).
- **Gathering Dark** values (+1 or +2 per pact, ring or sale) are proposed and not tuned against the world-tension spec's budget.
- The Nether's spec section supersedes, for this tree only, the Volgan spec's older statement that the Nether is not a country; the Volgan spec itself was not edited (outside this task's paths).
- A shared-scratchpad collision: the first compile run of this task wrote to the scratchpad folder `out/`, which a sibling agent was also using; later runs used the private folder `brrnet_focus/`. If the sibling agent finds its `out/` folder changed, it should rebuild it.

## Owner questions

| # | Question | Proposed answer used |
| --- | --- | --- |
| BRR-1 | Historically, does Burrikkrit keep the under-roads secret in the war, or sell them (and to whom)? | Keeps them dark; every sale is a divergence |
| BRR-2 | May the hobgoblin succession be a choice among the old custom, a council of lamps and a fed heir? | Yes; the old custom is historical |
| BRR-3 | Is a second Tunnel Fight against Kunhrim acceptable as a divergence in the war-years? | Yes, never historical |
| BRR-4 | Confirm the stance `zin_wild_tribes` for Burrikkrit | Assumed |
| NET-1 | Historically, does the king renew the bargain and hold the Steward to it after the body breaks? | Yes |
| NET-2 | May the king call the freed demon realms of the island home as friends after the break? | Yes, as a divergence (guarantee and opinion only) |
| NET-3 | Who performs the lava rite? May the Nether's houses keep the pits on the Burning Shore? | The tree lets the Nether keep them |
| NET-4 | Does the house of Agon stay a house of the Halls (Nether dossier question 3)? | Yes; only its lord Khorvael is named |
| NET-5 | Confirm the stance `zin_shadow_dread` for a realm not sworn to Volgan | Assumed |
