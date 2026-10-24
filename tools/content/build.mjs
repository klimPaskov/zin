// ZIN content builder. Deterministic: the same data always yields the same bytes.
//   node tools/content/build.mjs [stagedDir]     (default: <OS temp>/zin-content-staged, never inside the repository)
// The staged tree is applied to ZIN with tools/content/apply.mts in one atomic transaction. Paths: lib/paths.mjs.
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Staged } from './lib/core.mjs';
import { ZIN, GAME, stagingDir, provenanceFile } from './lib/paths.mjs';
import { buildPeoples } from './modules/peoples.mjs';
import { loadCountryTable, writeCountryTable, buildCountryPackage } from './modules/countries.mjs';
import { countryTable, loadRoster } from './lib/roster.mjs';
import { checkTags } from './lib/tags.mjs';
import { buildIdeologies } from './modules/ideologies.mjs';
import { buildCharacters } from './modules/characters.mjs';
import { buildUi } from './modules/ui.mjs';
import { loadArt, stageArtSources, stageRealmFlags } from './modules/art.mjs';
import { stageLore } from './modules/lore.mjs';
import { buildNames } from './modules/names.mjs';
import { buildPortraits } from './modules/portraits.mjs';
import { buildUnits3d } from './modules/units3d.mjs';
import { buildPresentation } from './modules/presentation.mjs';
import { PEOPLES } from './modules/peoples.mjs';
import { buildVanillaRemoval, writeEngineFiles, writeLocalisation } from './modules/vanilla_removal.mjs';
import { computeBridges, writeBridgeFiles, scanStaged } from './modules/vanilla_bridges.mjs';
import { definitions } from './checks/vanilla_refs.mjs';
import { scriptText } from './lib/clausewitz.mjs';
import { buildSilenced } from './modules/vanilla_silence.mjs';
import { buildCalendar } from './modules/calendar.mjs';
import { buildDefines } from './modules/defines.mjs';
import { buildFocusTrees } from './modules/focus_compiler.mjs';
import { buildAssets } from './modules/assets.mjs';
import { buildCultures } from './modules/cultures.mjs';
import { buildDiplomacy } from './modules/diplomacy.mjs';
import { buildTechnologies } from './modules/technologies.mjs';
import { buildWarfare } from './modules/warfare.mjs';
import { buildForces } from './modules/forces.mjs';
import { buildEventsCrown } from './modules/events_crown.mjs';
import { buildEventsWorld } from './modules/events_world.mjs';
import { buildAenor } from './modules/mech_aenor.mjs';
import { buildAfrit } from './modules/mech_afrit.mjs';
import { buildZol } from './modules/mech_zol.mjs';
import { buildYeldenneGlo } from './modules/mech_yeldenne.mjs';
import { buildEindilJourney } from './modules/mech_eindil.mjs';
import { buildWesternCrossing } from './modules/mech_crossing.mjs';
import { buildElves } from './modules/mech_elves.mjs';
import { buildLerendor } from './modules/mech_lerendor.mjs';
import { buildVolgan } from './modules/mech_volgan.mjs';
import { buildPowersUi } from './modules/mech_powers_ui.mjs';
import { buildMechCold } from './modules/mech_cold.mjs';
import { buildMechDark } from './modules/mech_dark.mjs';
import { buildMechEast } from './modules/mech_east.mjs';
import { buildMechSun } from './modules/mech_sun.mjs';
import { buildRules } from './modules/rules.mjs';
import { loadPending, resolvePending, writePendingStandIns } from './modules/pending_names.mjs';
import { buildDecisionsRegional } from './modules/decisions_regional.mjs';
import { buildFocusMajorC } from './modules/focus_major_c.mjs';
import { buildSharedBCompanion } from './modules/focus_shared_b.mjs';
import { buildEconomy } from './modules/economy.mjs';
import { buildInstitutions, requiredEnumEntries } from './modules/institutions.mjs';
import { buildTextSweep } from './modules/text_sweep.mjs';
import { runTextScan, writeScanReport, assertTextScan, summariseScan } from './checks/text_scan.mjs';
import { loadInventory } from './modules/ui_inventory.mjs';
import { loadReskin, loadSheets, buildReskin, publishUiData } from './modules/ui_reskin.mjs';
import { runUiChecks, scriptReferences } from './checks/ui_checks.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
export { ZIN };
const out = stagingDir(process.argv[2]);

// The country table is the roster of Aoaz (tools/content/data/world/roster.json, read through lib/roster.mjs).
const countries = countryTable();
// The tag check (A-27, lib/tags.mjs): real tags, none vanilla, none twice, and the total with the dynamic tags below the crash limit.
const tagCheck = checkTags(countries.map(c => ({ tag: c.tag, name: c.name })), { dynamic: loadRoster().dynamicTags });
if (tagCheck.errors.length) throw new Error(`The tag check failed:\n  ${tagCheck.errors.map(e => e.message).join('\n  ')}`);
const { labels } = JSON.parse(await readFile(path.join(here, 'data/labels.json'), 'utf8'));
const staged = new Staged();

// The owner-editable country table drives peoples, ideologies and (via the politics step) ruling parties.
const table = await loadCountryTable(countries, `${ZIN}/docs/design/countries.csv`);
const assignment = new Map([...table].map(([tag, t]) => [tag, t.people]));
writeCountryTable(staged, countries, table);
const lore = await stageLore(staged, ZIN);
buildIdeologies(staged);
// Every picture is image-generated; the build only slices and converts it (modules/art.mjs).
const art = await loadArt(countries);
await stageArtSources(staged, art);
const presentation = await buildPresentation(staged);
// Interface reskin (docs/design/stage2/ui_infrastructure.md): after presentation, which owns the loading chrome, the logo and the
// bookmark art. It builds only what an accepted raw sheet covers; every other row stays pending and the build does not fail.
const uiInventory = loadInventory(), uiReskin = loadReskin(), uiSheets = loadSheets();
const provenance = existsSync(provenanceFile()) ? (await readFile(provenanceFile(), 'utf8')).split('\n').filter(Boolean).map(l => JSON.parse(l)) : [];
const ui = await buildReskin(staged, { inventory: uiInventory, reskin: uiReskin, sheets: uiSheets, provenance });
publishUiData(staged, { reskin: uiReskin, sheets: uiSheets });
const peopleStartup = await buildPeoples(staged, countries, assignment, art);
// Cultures, faiths and the per-state culture data (docs/design/stage2/cultures.md): after buildPeoples, whose on_startup block it joins.
const cultures = await buildCultures(staged, { countries });
const pools = buildNames(staged, countries, labels);
buildPortraits(staged, countries, assignment, art);
// 3D land units from the kit's 3D pipeline job roots, one infantry entity per people (modules/units3d.mjs).
const units3d = await buildUnits3d(staged, ZIN, Object.keys(PEOPLES));

// Stage 2 slices. They run before vanilla removal, whose reference scan (C3) must see every file they stage.
// Order: diplomacy first (it owns common/technology_sharing); technologies after it (their sharing sync effect adds members
// to the diplomacy groups); warfare after buildNames (it draws names from the pools), before economy (script_enums.txt and the
// tokens file list the archetypes staged under common/units/equipment); economy; institutions last (it needs the name pools).
const diplomacy = await buildDiplomacy(staged, { countries });
const externalSharing = diplomacy.definitions.sharing.map(id => ({ id, template: `zin_faction_${id.replace(/^zin_research_/, '')}` }));
const technologies = await buildTechnologies(staged, { countries, assignment, externalSharing });
const warfare = await buildWarfare(staged, { countries, pools });
// Starting forces, AI templates and designs, generic AI strategies, designer pieces (docs/design/stage2/forces.md): after warfare (names) and technologies (start packages).
const forces = await buildForces(staged, { countries, assignment, table });
// script_enums.txt and the tokens file list the archetypes and types warfare staged; every equipment type the workshops of the
// institutions slice name must be among them (otherwise a workshop bonus is silently ignored).
const economy = await buildEconomy(staged, { countries });
{
  const listed = new Set(staged.files.get('common/script_enums.txt').toString('utf8').split('\n').map(l => l.replace(/#.*/, '').trim()));
  const missing = (await requiredEnumEntries()).filter(k => !listed.has(k));
  if (missing.length) throw new Error(`The institutions workshops name equipment that warfare does not define: ${missing.join(', ')}`);
}
const institutions = await buildInstitutions(staged, { countries, table, pools });
// The mechanic slices (docs/design/stage2/integration_r3.md): after institutions (the staged technology tags, flags and name pools),
// before the crown and world events that call their effects, and before vanilla removal and the focus compiler, whose reference scans (C3)
// must see every name they define. Order inside: the court first (Aenor, Afrit, Zol own the names the others read), the journey (Glo before
// Eindil, whose hall rules call Glo; the crossing reads Eindil's hosts), the powers (the UI reads the three kits, so it runs last of them),
// then the four regions.
const mechAenor = await buildAenor(staged, { countries });
const mechAfrit = await buildAfrit(staged, { countries, table });
const mechZol = await buildZol(staged, { countries });
const mechGlo = await buildYeldenneGlo(staged, { countries });
// No Host of Eindil flag: the journey would recolour Selen's flag in code, which is new art, and the cosmetic tag that would show it is not
// shipped yet; the flag is listed in docs/plans/zin-art/pending_from_integration.md.
const mechEindil = await buildEindilJourney(staged, { countries, eindil: { hostFlag: false } });
const mechWest = await buildWesternCrossing(staged, { countries });
const powersElves = await buildElves(staged, { countries, table });
const powersLeren = await buildLerendor(staged, { countries, table });
const powersVolgan = await buildVolgan(staged, { countries });
await buildPowersUi(staged, { countries });
const mechCold = await buildMechCold(staged, { countries });
const mechDark = await buildMechDark(staged, { countries, assignment });
const mechEast = await buildMechEast(staged, { countries });
const mechSun = await buildMechSun(staged, { countries, assignment });
// The courts of the realms (data/world/characters): after the mechanic slices, whose own characters they leave to them.
const characters = await buildCharacters(staged, { countries });
// The country package (tags, country files, histories, names, the bookmark) and the realms' flags: after the courts (recruits), the
// diplomacy slice (the start leagues) and the technologies (start packages).
const countryPackage = buildCountryPackage(staged, { countries, table, recruits: characters.recruits, factions: diplomacy.factions, starts: JSON.parse(staged.files.get('docs/design/technology/start_packages.json').toString('utf8')), zin: ZIN, cultures: cultures.model.world.cultures });
const flags = await stageRealmFlags(staged, countries);
// The foundation's game rules and their wrapper triggers (05_defines_and_rules.md section 2): after the slices whose own rule files
// (Lerendor, the West, Eindil) the generated branch triggers read.
const rules = await buildRules(staged);
// The world story events (docs/design/stage2/events_world.md): the Eindil narrative, the War of the Last Crowns and the lore events.
const world = await buildEventsWorld(staged, { countries });
// The crown events (docs/design/stage2/events_crown.md): after presentation (picture keys), before vanilla removal and the text sweep. It owns
// common/scripted_effects/zin_story.txt, whose zin_story_tick calls the runner block of every story namespace (convention C6).
const crown = await buildEventsCrown(staged, { countries, storyBlocks: ['reign', 'lastwar', 'ending', 'lore'] });
// Buldor's company books (regional decisions) come after the compiler; the focus companions (dynamic modifiers of Noris and Stabilo,
// Triton's opinion modifiers) write what the compiler cannot, so they run before it.
const focusMajorC = await buildFocusMajorC(staged);
const focusSharedB = await buildSharedBCompanion(staged);

// Startup: apply each country's people once, when a campaign begins.
const uiStartup = buildUi(staged, art);
staged.text('common/on_actions/zin_startup.txt', `# Generated by the ZIN content builder.\non_actions = {\n\ton_startup = {\n\t\teffect = {\n${peopleStartup}\n${cultures.startup}\n${uiStartup}\n\t\t}\n\t}\n}\n`);

// Vanilla removal (stage 1): replace_path lines, ZIN replacements, interim stubs, overrides, engine hooks, and the
// bridges check C3 asks for. It runs last because the reference scan reads everything staged above.
// The generated councillors serve only the courts that have no named advisors.
const vr = await buildVanillaRemoval(staged, { zin: ZIN, countries, councilCountries: countries.filter(c => !characters.withAdvisors.has(c.tag)) });
const silenced = await buildSilenced(staged);
const calendar = await buildCalendar(staged, { countries });
const defines = await buildDefines(staged, { countries });
const ENGINE_FILES = ['common/scripted_triggers/00_zin_engine_hooks.txt', 'common/scripted_effects/00_zin_engine.txt', 'common/dynamic_modifiers/zin_dynamic_modifiers.txt'];
writeEngineFiles(staged, vr.engine, { triggers: [], effects: [], dynamicModifiers: [] });
const bridges = await computeBridges(vr.disp, staged, { deferZin: true });
for (const f of ENGINE_FILES) staged.files.delete(f);
writeEngineFiles(staged, vr.engine, bridges);
await writeBridgeFiles(staged, bridges, vr.loc);
writeLocalisation(staged, vr.loc);
// Text sweep (docs/design/stage2/text_sweep.md): after every module has staged its text, so it leaves alone any key another module wrote.
const textSweep = await buildTextSweep(staged);
const rescan = await scanStaged(vr.disp, staged);
{
  // No scripted definition may exist twice in the ZIN files (two slices writing the same id).
  const twice = [];
  for (const [cat, names] of definitions(rescan.loaded.filter(f => f.source === 'mod'))) if (!['constant', 'opinion_modifier'].includes(cat)) for (const [name, fl] of names) if (new Set(fl).size > 1) twice.push(`${cat} ${name} (${[...new Set(fl)].join(', ')})`);
  if (twice.length) throw new Error(`Defined in more than one ZIN file:\n  ${twice.join('\n  ')}`);
}
{
  // Every name a kept vanilla file uses is bridged; the ZIN names are held to the final pass below (a mechanic file may name a tree focus).
  const vanillaLeft = rescan.dangling.filter(g => g.gameFiles.size);
  if (vanillaLeft.length) throw new Error(`C3: ${vanillaLeft.length} names still dangle after bridging: ${vanillaLeft.map(g => `${g.cat} ${g.name}`).join(', ')}`);
}
const bridgeCounts = Object.fromEntries([...bridges.triggers.map(b => 'trigger'), ...bridges.effects.map(() => 'effect'), ...bridges.dynamicModifiers.map(() => 'dynamic_modifier'), ...bridges.other.map(b => b.cat)].reduce((m, c) => m.set(c, (m.get(c) ?? 0) + 1), new Map()));

// Focus trees (docs/design/focus/*.json): compiled last, so the checks see every name the other modules stage.
const focusTrees = await buildFocusTrees(staged, { countries });
// Regional decisions come after the compiler: they name spirits the Buldor tree writes, which the C3 scan above cannot see.
const decisionsRegional = await buildDecisionsRegional(staged, { countries });
// Final reference pass (C3) over the finished tree: the compiled trees, their helpers and the regional decisions included. A name that
// dangles stops the build unless tools/content/data/pending_names.json declares it with the owner that will define it; each declared name
// gets an inert stand-in (modules/pending_names.mjs). A declared name that a module now defines, or that nothing uses, stops the build too.
const pending = await loadPending();
let pendingCounts;
{
  const scan = await scanStaged(vr.disp, staged);
  const zinDefs = definitions(scan.loaded.filter(f => f.source === 'mod'));
  const r = resolvePending(pending, scan.dangling, (cat, name) => zinDefs.get(cat)?.has(name));
  const list = gs => gs.map(g => `${g.cat} ${g.name} (${[...(g.modFiles ?? []), ...(g.gameFiles ?? [])].slice(0, 2).join(', ') || g.owner})`).join('\n  ');
  const errors = [];
  if (r.undeclared.length) errors.push(`C3: ${r.undeclared.length} names dangle in the finished tree and no pending owner is declared for them:\n  ${list(r.undeclared)}`);
  if (r.landed.length) errors.push(`${r.landed.length} pending names are defined now; remove them from data/pending_names.json:\n  ${list(r.landed)}`);
  if (r.unused.length) errors.push(`${r.unused.length} pending names are used by no ZIN file; remove them from data/pending_names.json:\n  ${list(r.unused)}`);
  if (errors.length) throw new Error(errors.join('\n'));
  pendingCounts = writePendingStandIns(staged, r.used, pending);
  const after = await scanStaged(vr.disp, staged);
  if (after.dangling.length) throw new Error(`C3: ${after.dangling.length} names dangle after the pending stand-ins:\n  ${list(after.dangling)}`);
  // No scripted definition may exist twice in the ZIN files (two slices, or a slice and a stand-in, writing the same id).
  const twice = [];
  for (const [cat, names] of definitions(after.loaded.filter(f => f.source === 'mod'))) if (!['constant', 'opinion_modifier'].includes(cat)) for (const [name, fl] of names) if (new Set(fl).size > 1) twice.push(`${cat} ${name} (${[...new Set(fl)].join(', ')})`);
  if (twice.length) throw new Error(`Defined in more than one ZIN file:\n  ${twice.join('\n  ')}`);
}
// Text scan (X1 to X15) over the finished staged tree; the report is staged beside the other validation data.
const textScan = await runTextScan(staged);
writeScanReport(staged, textScan);
console.error(summariseScan(textScan));
assertTextScan(textScan);
// Interface reskin checks (ui_infrastructure.md, section 1): every module has staged its files, so the checks read them all.
const uiTexts = [...staged.files].filter(([k]) => /^(common|events|history|interface|localisation)\//.test(k)).map(([, v]) => v.toString('utf8'));
const uiReport = await runUiChecks({ inventory: uiInventory, reskin: uiReskin, sheets: uiSheets, files: staged.files, game: GAME, provenance, scriptRefs: scriptReferences(uiTexts, uiInventory) });
// The full result is published. Check 4 (reachability) is reported and not enforced yet: with the stage 2 slices staged, ZIN script and
// text name hundreds of vanilla sprites that the plan files as unreachable (U/H), and some of the hits are identifiers that merely
// equal a sprite name (weather, research). The plan (lib/ui_plan.mjs) must promote the true ones to R first; see docs/specs/INTEGRATION_DECISIONS.md, "Stage 2 integration".
staged.add('docs/design/ui/check_report.json', Buffer.from(JSON.stringify({ ok: uiReport.ok, pending: uiReport.pending, checks: uiReport.checks.map(c => ({ id: c.id, name: c.name, status: c.status, problems: c.problems, pending: c.pending.length, notes: c.notes })) }, null, 1) + '\n'));
const uiEnforced = uiReport.checks.filter(c => c.status === 'fail' && c.id !== 4);
if (uiEnforced.length) throw new Error(uiEnforced.map(c => `ui check ${c.id} ${c.name}: ${c.problems.slice(0, 5).map(p => p.message).join('; ')}`).join('\n'));
// Asset manifest and completeness check (docs/specs/08_art_and_assets/05_asset_manifest.md): the very last step, so it
// sees every staged file. It reports everything and fails only on errors that docs/design/validation/asset_baseline.json
// does not list.
const assets = await buildAssets(staged);
await staged.write(out);
const counts = {}; for (const rel of staged.files.keys()) { const top = rel.split('/').slice(0, 2).join('/'); counts[top] = (counts[top] ?? 0) + 1; }
console.log(JSON.stringify({ staged: out, files: staged.files.size, lore, units3d, counts, presentation: presentation.counts, focusTrees, assets: assets.summary, calendar, defines, cultures: cultures.counts, warfare, forces, pendingStandIns: pendingCounts, rules: rules.counts, world, mechanics: { aenor: mechAenor.counts, afrit: mechAfrit.counts, zol: mechZol.counts, glo: mechGlo.counts, eindil: mechEindil.counts, west: mechWest.counts, elves: powersElves.counts, lerendor: powersLeren.counts, volgan: powersVolgan.counts, cold: mechCold.counts, dark: mechDark.counts, east: mechEast.counts, sun: mechSun.counts }, crown: crown.counts, tags: tagCheck.stats, characters: characters.counts, countryPackage, flags: { kept: flags.kept.length, none: flags.none.map(f => f.tag) }, decisionsRegional, focusMajorC, focusSharedB, diplomacy: diplomacy.counts, technologies, economy, institutions, textSweep, textScan: textScan.counts, ui: { ...ui.counts, checks: uiReport.checks.map(c => `${c.id}:${c.status}`) }, vanillaRemoval: { silenced: silenced.silenced, replacePaths: vr.disp.rows.filter(r => r.action === 'replace' && r.kind === 'folder' && r.stage <= vr.disp.currentStage).length, theaters: vr.theaters, bridges: bridgeCounts }, peoples: Object.fromEntries([...assignment.values()].reduce((m, p) => m.set(p, (m.get(p) ?? 0) + 1), new Map())), stances: Object.fromEntries([...table.values()].reduce((m, t) => m.set(t.stance, (m.get(t.stance) ?? 0) + 1), new Map())) }));
