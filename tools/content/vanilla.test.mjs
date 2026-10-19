// Tests for vanilla removal stage 1 and checks C1-C7 (docs/specs/00_foundation/06_vanilla_removal_and_zero_errors.md).
// Run after `node tools/content/build.mjs [stagedDir]`, with ZIN_STAGED set when the staged tree is not the default:
//   node --test tools/content/vanilla.test.mjs
// The baseline classifier test reads the owner's 18 October 2026 log (ZIN_BASELINE_LOG) and is skipped without it.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { stagingDir, ZIN, GAME } from './lib/paths.mjs';
import { parse } from './lib/clausewitz.mjs';
import * as V from './checks/vanilla_refs.mjs';
import { classify, checkBudget, checkTextLog, declaredReplace } from './checks/error_budget.mjs';
import { scanStaged, removalStage } from './modules/vanilla_bridges.mjs';
import { syncLauncherText } from './sync/zin_mod_descriptor.mjs';
import { LAW_KEYS } from './modules/vanilla_removal.mjs';
import { silencedFiles, namesVanillaTag, vanillaTags } from './modules/vanilla_silence.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const STAGED = stagingDir(process.env.ZIN_STAGED);
const read = p => readFile(path.join(STAGED, p), 'utf8');
const disp = await V.loadDispositions();
const baseline = await V.loadJson('baseline_errors.json');
const { countries } = JSON.parse(await readFile(path.join(here, 'data/countries.json'), 'utf8'));
async function walkDir(d, b = d) { const o = []; for (const e of await readdir(d, { withFileTypes: true })) { const f = path.join(d, e.name); if (e.isDirectory()) o.push(...await walkDir(f, b)); else o.push(path.relative(b, f).split(path.sep).join('/')); } return o; }
const stagedFiles = new Map(); for (const r of await walkDir(STAGED)) stagedFiles.set(r, await readFile(path.join(STAGED, r)));
const staged = { files: stagedFiles };
// The mod after this build: world-owned files from the repository with the staged tree on top.
const modFiles = new Map();
for (const f of JSON.parse(await readFile(path.join(ZIN, '.hoi4-agent-world.json'), 'utf8')).files) modFiles.set(f.relativePath, await readFile(path.join(ZIN, f.relativePath)));
for (const [r, b] of stagedFiles) modFiles.set(r, b);
const tmp = () => mkdtemp(path.join(os.tmpdir(), 'zin-vr-'));
async function fakeGame(files) { const dir = await tmp(); for (const [rel, text] of Object.entries(files)) { await mkdir(path.dirname(path.join(dir, rel)), { recursive: true }); await writeFile(path.join(dir, rel), text); } return dir; }
const row = (p, action, stage, extra = {}) => ({ path: p, kind: /\.[a-z]+$/.test(p) ? 'file' : 'folder', action, stage, owner: 'test', zin: [], reason: 'test', ...extra });

// ------------------------------------------------------------------------------------------------------- C1
test('C1: every installed vanilla folder and top-level file has a disposition', async () => {
  assert.deepEqual(await V.checkCoverage(disp), { missing: [], bad: [] });
  assert.equal(disp.currentStage, 1);
  for (const r of disp.rows) assert(['replace', 'override', 'keep'].includes(r.action), r.path);
});
test('Negative C1: a folder with no disposition fails (a new game version adds one)', async () => {
  const game = await fakeGame({ 'common/ideas/a.txt': 'ideas = { }\n', 'common/brand_new_folder/b.txt': 'x = { }\n', 'common/new_file.txt': 'y = 1\n' });
  const r = await V.checkCoverage({ rows: [row('common/ideas', 'replace', 1)] }, game);
  assert.deepEqual(r.missing.sort(), ['common/brand_new_folder', 'common/new_file.txt']);
  assert.deepEqual((await V.checkCoverage({ rows: [row('common/ideas', 'remove', 1)] }, game)).bad, ['common/ideas']);
});

// ------------------------------------------------------------------------------------------------------- C2
test('C2: descriptor.mod carries the stage-1 replace_path lines and every replaced folder ships a ZIN definition', async () => {
  const descriptor = await read('descriptor.mod'), paths = V.replacePathsOf(descriptor);
  for (const p of ['common/decisions/categories', 'common/national_focus', 'common/continuous_focus', 'common/focus_inlay_windows', 'common/ai_focuses', 'common/ideas', 'common/characters', 'common/scripted_effects', 'common/scripted_triggers', 'common/scripted_localisation', 'common/scripted_guis', 'common/dynamic_modifiers', 'common/opinion_modifiers', 'common/script_constants', 'common/collections', 'common/mtth', 'common/ai_faction_theaters', 'history/general'])
    assert(paths.includes(p), p);
  assert.equal(paths.length, V.replacedFolders(disp).length); assert(paths.length >= 34, 'the 34 lines of stage 1 plus the stage 2 slices wired so far');
  // Pulled forward: the menu art, and the tag list with its name lists (the flag-sheet divide-by-zero crash).
  for (const p of ['gfx/loadingscreens', 'common/frontend/backgrounds', 'common/country_tags', 'common/names']) assert(paths.includes(p), p);
  for (const p of ['common/scorers/country', 'music']) assert(!paths.includes(p), `${p} is a later stage`);
  // The launcher descriptor as the sync step will write it (mod/zin.mod; other lines kept).
  const launcherPath = path.join(path.dirname(ZIN), 'zin.mod');
  const launcher = existsSync(launcherPath) ? syncLauncherText(await readFile(launcherPath, 'utf8'), descriptor) : descriptor;
  assert.deepEqual(V.checkDescriptor(disp, { descriptor, launcher, modFiles }), []);
  if (existsSync(launcherPath)) assert.match(launcher, /^path="(?:mod\/zin|[A-Za-z]:\/.*\/mod\/zin)"$/m, 'zin.mod keeps its path line (relative or the absolute launcher path)');
});
test('Negative C2: a descriptor mismatch, an empty replaced folder and a stray replace_path fail', () => {
  const d = { currentStage: 1, rows: [row('common/ideas', 'replace', 1), row('common/names', 'replace', 1), row('common/units', 'replace', 2)] };
  const files = new Map([['common/ideas/zin.txt', Buffer.from('ideas = { country = { zin_x = { } } }\n')], ['common/names/zin.txt', Buffer.from('# nothing\n')]]);
  const descriptor = 'replace_path="common/ideas"\nreplace_path="common/names"\n';
  const problems = V.checkDescriptor(d, { descriptor, launcher: 'replace_path="common/ideas"\n', modFiles: files });
  assert(problems.some(p => /differ in replace_path/.test(p)), 'mismatch');
  assert(problems.some(p => /common\/names has no ZIN file with a definition/.test(p)), 'empty folder');
  assert(V.checkDescriptor(d, { descriptor: descriptor + 'replace_path="common/units"\n', modFiles: files }).some(p => /common\/units is not a replace row in effect/.test(p)), 'stray line');
  assert.equal(syncLauncherText('name="ZIN"\nreplace_path="a"\npath="mod/zin"\nreplace_path="b"\n', 'replace_path="c"\nreplace_path="d"\n'), 'name="ZIN"\nreplace_path="c"\nreplace_path="d"\npath="mod/zin"\n');
});

// ------------------------------------------------------------------------------------------------------- C3
test('C3: no loaded file (kept vanilla, overridden, ZIN) names a definition that no loaded file defines', async () => {
  const { dangling } = await scanStaged(disp, staged);
  assert.deepEqual(dangling.map(g => `${g.cat} ${g.name} ${g.uses[0]}`), []);
});
test('Negative C3: a planted dangling decision reference is found, in a kept vanilla file and in a ZIN file', async () => {
  const game = await fakeGame({ 'common/decisions/v.txt': 'cat = { vanilla_decision = { } }\n', 'common/technologies/t.txt': 'technologies = { t1 = { allow = { has_decision = vanilla_decision } } }\n', 'common/scripted_triggers/v.txt': 'vanilla_trigger = { always = yes }\n', 'common/bop/b.txt': 'b = { x = { vanilla_trigger = yes } }\n' });
  const d = { currentStage: 1, rows: [row('common/decisions', 'replace', 1), row('common/scripted_triggers', 'replace', 1), row('common/technologies', 'replace', 2), row('common/bop', 'keep', 0)] };
  const mod = new Map([['common/national_focus/zin.txt', Buffer.from('focus_tree = { focus = { id = zin_f available = { has_decision = zin_missing_decision } } }\n')]]);
  const loaded = await V.loadedScripts(d, mod, { game });
  const universe = V.definitions([...(await V.allGameScripts(game)), ...loaded.filter(f => f.source === 'mod')]);
  const found = V.groupDangling(V.danglingReferences(loaded, universe)).map(g => `${g.cat} ${g.name}`);
  assert.deepEqual(found.sort(), ['decision vanilla_decision', 'decision zin_missing_decision', 'trigger vanilla_trigger']);
  // The kept bop file is never removed: its trigger needs a permanent definition, not a bridge.
  assert.equal(removalStage(d, 'common/technologies/t.txt'), 2);
  assert.equal(removalStage(d, 'common/bop/b.txt'), null);
});

// ------------------------------------------------------------------------------------------------------- C4
test('C4: interim stubs are gated off and every bridge is due in a later stage', async () => {
  assert.deepEqual(V.checkStubs(disp, modFiles), []);
  let bridges = 0;
  for (const [rel, b] of stagedFiles) for (const m of b.toString('latin1').matchAll(/# bridge: remove in stage (\d+)/g)) { bridges++; assert(Number(m[1]) > disp.currentStage, rel); }
  assert(bridges > 0);
});
test('Negative C4: a visible stub, a due bridge and a stub whose owner shipped fail', () => {
  const d = { currentStage: 2, rows: [row('common/decisions', 'replace', 0, { stub: 'common/decisions/zin_decisions_interim.txt' })] };
  const files = new Map([
    ['common/decisions/zin_decisions_interim.txt', Buffer.from('zin_interim_category = {\n\tzin_interim_noop = { visible = { always = yes } }\n}\n')],
    ['common/decisions/zin_aenor.txt', Buffer.from('zin_aenor_category = { zin_aenor_buy_loyalty = { } }\n')],
    ['common/scripted_triggers/00_zin_engine_hooks.txt', Buffer.from('old_trigger = { # bridge: remove in stage 2\n\talways = no\n}\n')],
  ]);
  const p = V.checkStubs(d, files);
  assert(p.some(x => /zin_interim_noop is not gated off/.test(x)), 'visible stub');
  assert(p.some(x => /has visible = \{ always = yes \}/.test(x)), 'always yes');
  assert(p.some(x => /bridge due in stage 2 remains/.test(x)), 'due bridge');
  assert(p.some(x => /owner has shipped common\/decisions\/zin_aenor\.txt/.test(x)), 'owner shipped');
});

// ------------------------------------------------------------------------------------------------------- C5
test('C5: no ZIN localisation value copies the vanilla value of the same key; every allowlist entry carries its evidence', async () => {
  assert.deepEqual(V.checkVanillaText(modFiles, await V.vanillaLocalisation()), []);
  for (const e of (await V.loadJson('error_allowlist.json')).entries) { new RegExp(e.pattern); assert(e.reason && e.controlRun?.date && e.controlRun?.gameVersion && e.added, e.pattern); }
});
test('Negative C5: a copied vanilla localisation value fails', () => {
  const vanilla = new Map([['civilian_economy', 'Civilian Economy']]);
  const files = new Map([['localisation/replace/zin_rethemed_l_english.yml', Buffer.from('\uFEFFl_english:\n civilian_economy:0 "Civilian Economy"\n')]]);
  assert.equal(V.checkVanillaText(files, vanilla).length, 1);
  assert.deepEqual(V.checkVanillaText(files, vanilla, ['civilian_economy']), []);
});

// --------------------------------------------------------------------------------------------------- C6, C7
test('C6: the baseline classifier reproduces the 18 October 2026 counts (1,902 lines)', { skip: !existsSync(process.env.ZIN_BASELINE_LOG ?? path.join(ZIN, '../../crashes/hoi4_20261018_231011/logs/error.log')) }, async () => {
  const r = classify(await readFile(process.env.ZIN_BASELINE_LOG ?? path.join(ZIN, '../../crashes/hoi4_20261018_231011/logs/error.log'), 'utf8'), baseline);
  assert.equal(r.total, 1902); assert.deepEqual(r.unclassified, []);
  for (const c of baseline.categories) assert.equal(r.counts[c.id], c.count, c.id);
  assert.deepEqual(checkBudget(r, baseline, 0), []);
  assert(checkBudget(r, baseline, 1).length > 0, 'the baseline is far over the stage-1 budget');
});
test('Negative C6: a log over budget, with a disallowed category or a new category fails', () => {
  const line = msg => `[00:00:00][no_game_date][x.cpp:1]: ${msg}`;
  const ok = [...Array(12)].map(() => line('Entity referenced in equipment graphic database does not exist: "X", associated with GER y')).concat(line('The game has loc key collisions. Check logs/text.log for more details')).join('\n');
  assert.deepEqual(checkBudget(classify(ok, baseline), baseline, 1), []);
  const over = ok + '\n' + [...Array(9)].map(() => line('Entity referenced in equipment graphic database does not exist: "X", associated with GER y')).join('\n');
  assert(checkBudget(classify(over, baseline), baseline, 1).some(p => /22 lines, budget 20/.test(p)));
  assert(checkBudget(classify(line('Invalid Decision ID for unlock_decision_tooltip X'), baseline), baseline, 1).some(p => /B1, not allowed/.test(p)));
  // B8 left with the vanilla tags in stage 1: a single line fails.
  const b8 = n => [...Array(n)].map(() => line('GER - is missing a history file.')).join('\n');
  assert(checkBudget(classify(b8(1), baseline), baseline, 1).some(p => /B8, not allowed after stage 1/.test(p)));
  // The exemption for a category a later stage removes (synthetic budget): within its cap it is free, beyond it fails.
  const ex = { ...baseline, budget: [{ stage: 1, max: 0, allowed: [], exempt: { B8: 2 } }] };
  assert.deepEqual(checkBudget(classify(b8(2), baseline), ex, 1), []);
  assert(checkBudget(classify(b8(3), baseline), ex, 1).some(p => /exempt only up to 2/.test(p)));
  assert(checkBudget(classify(line('Something nobody has seen'), baseline), baseline, 1).some(p => /new category/.test(p)));
  assert(checkBudget(classify(line('The game has loc key collisions') + '\n' + line('The game has loc key collisions') + '\n' + line('The game has loc key collisions'), baseline), baseline, 1).some(p => /B12, limit 2/.test(p)));
});
test('C7: text.log duplicates are allowed only for declared localisation/replace files, and none from stage 4', () => {
  const log = '[x][localize.cpp:658]: l_english: Duplicate localization found, key: civilian_economy, file: localisation/english/ideas_l_english.yml, value: a\n[x][localize.cpp:658]: l_english: Duplicate localization found, key: civilian_economy, file: localisation/replace/zin_rethemed_l_english.yml, value: b\n';
  assert.deepEqual(checkTextLog(log, declaredReplace(1)), []);
  assert.equal(checkTextLog(log, declaredReplace(4)).length, 1);
  assert.equal(checkTextLog(log.replaceAll('localisation/replace/', 'localisation/english/'), declaredReplace(1)).length, 1);
});

// --------------------------------------------------------------------------------------------- stage-1 content
test('Stage 1 ships the ZIN replacements, interim stubs and overrides the dispositions name', async () => {
  for (const r of V.rowsInEffect(disp).filter(r => r.stage === 1)) for (const z of r.zin) {
    if (z.includes('*') || z.includes('<')) continue;
    if (z.startsWith('localisation/english/state_names') || z.startsWith('localisation/english/victory_points') || z.startsWith('localisation/english/strategic_region') || z.startsWith('common/country_tags/')) continue; // politics step
    assert(stagedFiles.has(z) || modFiles.has(z), `${r.path}: ${z}`);
  }
  assert.match(await read('tutorial/tutorial.txt'), /^tutorial = \{ \}$/m);
  assert.match(await read('common/achievements.txt'), /possible = \{ always = no \}/);
  const rules = parse(await read('common/game_rules/00_game_rules.txt')).filter(e => e.k);
  assert.equal(rules.length, 19);
  assert(!rules.some(r => /_ai_behavior$|_status$/i.test(r.k)), 'country rules dropped');
});
test('Laws define every key the histories add; the engine hooks keep their names', async () => {
  const laws = await read('common/ideas/00_zin_laws.txt');
  for (const k of ['limited_conscription', 'civilian_economy', 'export_focus', 'volunteer_only']) assert.match(laws, new RegExp(`^\\t\\t${k} = \\{`, 'm'), k);
  assert(!/original_tag|has_dlc|has_completed_focus/.test(laws), 'no vanilla country or DLC conditions');
  assert.equal(LAW_KEYS.length, 18);
  const hooks = await read('common/scripted_triggers/00_zin_engine_hooks.txt');
  for (const k of ['should_initiate_resistance', 'should_activate_active_crypto_bonuses', 'should_not_activate_active_crypto_bonuses', 'is_diplomatic_action_valid_stage_coup', 'is_diplomatic_action_valid_boost_party_popularity']) assert.match(hooks, new RegExp(`^${k} = \\{\\n`, 'm'), k);
  for (const k of ['improve_relation', 'guarantee', 'embargo']) assert.match(await read('common/opinion_modifiers/00_zin_opinion_modifiers.txt'), new RegExp(`\\t${k} = \\{`), k);
  assert.match(await read('common/ideas/zin_hidden.txt'), /received_attache = \{/);
});
test('Every ZIN country gets the interim tree and three ZIN councillors; no vanilla advisors remain', async () => {
  const tree = await read('common/national_focus/zin_interim_default.txt');
  assert.match(tree, /default = yes/); assert.equal([...tree.matchAll(/^\t\tid = zin_long_peace_/gm)].length, 6);
  assert(!/declare_war|create_wargoal|add_state_core/.test(tree), 'the interim tree keeps the peace');
  const general = await read('history/general/zin_general.txt');
  for (const c of countries) assert.match(general, new RegExp(`tag = ${c.tag}\\b`), c.tag);
  assert.equal([...general.matchAll(/generate_character = \{/g)].length, 3);
  assert(![...stagedFiles.keys()].some(f => f === 'history/general/generic_advisors.txt'));
  for (const t of general.matchAll(/traits = \{ (\w+) \}/g)) assert.match(await read('common/country_leader/00_zin_leader_traits.txt'), new RegExp(`\\t${t[1]} = \\{`), t[1]);
});
test('AI faction theaters name only Erdae strategic regions, each once (B10)', async () => {
  const regions = new Set((await readdir(path.join(ZIN, 'map/strategicregions'))).filter(f => f.endsWith('.txt')).map(f => Number(f.split('-')[0])));
  const seen = [];
  for (const t of parse(await read('common/ai_faction_theaters/zin_theaters.txt'))) if (t.k) seen.push(...t.v.find(e => e.k === 'regions').v.map(e => Number(e.v)));
  assert(seen.length > 100); assert.equal(new Set(seen).size, seen.length);
  for (const id of seen) assert(regions.has(id), `region ${id}`);
});
test('Bridges carry identifiers only and never become visible', async () => {
  for (const [rel, b] of stagedFiles) {
    if (!/zz_zin_bridge_|00_zin_engine|zin_dynamic_modifiers|zin_constants/.test(rel)) continue;
    const t = b.toString('latin1');
    if (rel.endsWith('zin_constants.txt')) continue; // special-project numbers
    const body = t.replace(/# .*$/gm, '');
    // The permanent engine definitions are the only bodies with commands; a bridge line holds none.
    for (const l of body.split('\n').filter(l => /^\S+ = \{ (\} |enable|allowed|random|value|name|id|input|regions)/.test(l) || /^\t\S+ = \{ (allowed|random|value|name)/.test(l))) assert(!/always = yes|\b(add|set|create|declare)_\w+ =/.test(l), `${rel}: ${l}`);
  }
  for (const f of ['common/national_focus/zz_zin_bridge_focuses.txt', 'common/ideas/zz_zin_bridge_ideas.txt', 'common/decisions/categories/zz_zin_bridge_categories.txt']) if (stagedFiles.has(f)) for (const l of (await read(f)).split('\n').filter(l => /bridge: remove/.test(l) && !/^focus_tree = \{/.test(l))) assert.match(l, /always = no/, `${f}: ${l}`);
  if (stagedFiles.has('common/national_focus/zz_zin_bridge_focuses.txt')) for (const t of parse(await read('common/national_focus/zz_zin_bridge_focuses.txt')).filter(e => e.k === 'focus_tree')) assert.equal(t.v.find(e => e.k === 'country').v[0].v, '0', 'bridged trees never apply to a country');
  // Since the stage 2 slices were wired no kept vanilla file names a removed event: the file exists only while one does.
  const events = stagedFiles.has('events/zz_zin_bridge_events.txt') ? await read('events/zz_zin_bridge_events.txt') : '';
  for (const l of events.split('\n').filter(l => /_event = \{/.test(l))) assert.match(l, /hidden = yes is_triggered_only = yes/, l);
  void GAME;
});

// ------------------------------------------------------------------------------------------------- silenced
test('Vanilla files written for one vanilla country are silenced by comment-only ZIN files; generic files stay', async () => {
  const files = await silencedFiles();
  assert(files.length === 2, `${files.length} silenced`);
  for (const f of files) {
    const b = stagedFiles.get(f.rel); assert(b, f.rel);
    assert.equal(parse(b.toString('utf8')).filter(e => e.k).length, 0, `${f.rel} defines nothing`);
  }
  const rels = new Set(files.map(f => f.rel));
  for (const kept of ['common/autonomous_states/puppet.txt', 'common/ai_navy/goals/goals_generic.txt', 'common/ai_templates/generic.txt', 'common/units/names_railway_guns/common_railway_gun_names.txt', 'common/military_industrial_organization/organizations/00_generic_organization.txt'])
    assert(!rels.has(kept), `${kept} stays loaded`);
  for (const gone of ['common/country_tag_aliases/tag_aliases.txt', 'common/difficulty_settings/00_difficulty.txt'])
    assert(rels.has(gone), `${gone} is silenced`);
});
test('Negative: the file-name rule only matches a vanilla tag standing alone', async () => {
  const tags = await vanillaTags();
  for (const n of ['GER_naval.txt', 'goals_ENG.txt', '00_SOV_names.txt', 'LaR_FRA_operations.txt', 'GER.txt']) assert(namesVanillaTag(n, tags), n);
  for (const n of ['generic.txt', 'goals_generic.txt', 'GERMAN_names.txt', 'zin_names.txt', 'common_railway_gun_names.txt']) assert(!namesVanillaTag(n, tags), n);
  await assert.rejects(silencedFiles({ data: { folders: { 'common/ai_templates': { reason: 'x', extra: ['no_such_file.txt'] } } } }), /does not have/);
});
