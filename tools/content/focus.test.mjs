// Tests of the focus compiler (docs/specs/05_focus_trees/00_format_and_compiler.md, "Acceptance"). They compile the
// synthetic, project-owned trees under fixtures/focus/ and compare the staged files with fixtures/focus/expected/,
// and they plant one failure for every build check. Set ZIN_UPDATE_FOCUS_FIXTURES=1 to rewrite the expected files
// after a reviewed change of the compiler.
//   node --test tools/content/focus.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Staged } from './lib/core.mjs';
import { ZIN } from './lib/paths.mjs';
import { validateTree } from './lib/focus_schema.mjs';
import { absolutePositions } from './lib/focus_model.mjs';
import { PEOPLES } from './modules/peoples.mjs';
import { analyseTrees, buildFocusTrees, compileTree, expectedTreeIds, layoutFile, paceDate, prepareTrees, LAYOUT_FILE } from './modules/focus_compiler.mjs';
import {
  Registry, assertClean, checkCoverage, checkLayoutRefresh, codesFor, exclusiveClosure, gateWarnings, isValidModifier, loadArgCodes,
  loadCatalog, loadRetired, parseRetired, scanStaged, spiritIcon,
} from './checks/focus_checks.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const FIX = path.join(here, 'fixtures/focus');
const EXPECTED = path.join(FIX, 'expected');
const json = async f => JSON.parse(await readFile(f, 'utf8'));
const ROSTER = (await json(`${FIX}/roster.json`)).countries;
const BASE = {};
for (const name of (await readdir(`${FIX}/trees`)).sort()) BASE[name.slice(0, -5)] = await json(`${FIX}/trees/${name}`);
const TREE_IDS = Object.keys(BASE).sort();
const REGISTRY = {
  scripted_effects: ['zin_aenor_add_camp_support', 'zin_aenor_event_for_parim'],
  scripted_triggers: ['zin_mech_ready', 'zin_is_site_old_keep', 'zin_is_region_test_lands'],
  events: ['zin_mech.12'], ideas: ['zin_mech_idea'], opinion_modifiers: ['zin_mech_goodwill'], faction_templates: ['zin_faction_testing_league'],
  global_flags: ['zin_afrit_revealed'], branch: { refreshed_flags: ['zin_test_story'] },
};
const OPTS = { countries: ROSTER, tierRanges: null, expected: TREE_IDS, warn: () => {} };
const registry = (extra = {}) => { const d = structuredClone(REGISTRY); for (const [k, v] of Object.entries(extra)) d[k] = Array.isArray(v) ? [...(d[k] ?? []), ...v] : { ...(d[k] ?? {}), ...v }; return new Registry(d); };

// Runs every check on the base trees after `mutate` changed them. Returns the problems.
async function analyse(mutate, opts = {}) {
  const raw = structuredClone(BASE);
  mutate?.(raw);
  const entries = Object.entries(raw).map(([name, data]) => ({ name, data }));
  return analyseTrees(entries, new Staged(), { ...OPTS, registry: registry(), ...opts });
}
const codesOf = a => a.problems.map(p => p.code);
const failsWith = async (mutate, code, pattern, opts) => {
  const a = await analyse(mutate, opts);
  const hit = a.problems.filter(p => p.code === code);
  assert(hit.length, `expected ${code}, got ${[...new Set(codesOf(a))].join(', ') || 'no problem'}:\n${a.problems.map(p => p.message).join('\n')}`);
  if (pattern) assert(hit.some(p => pattern.test(p.message)), `no ${code} problem matches ${pattern}: ${hit.map(p => p.message).join(' | ')}`);
  return a;
};
const focus = (raw, tree, key) => raw[tree].focuses.find(f => f.key === key);

async function compileFixtures() {
  const staged = new Staged();
  const total = await buildFocusTrees(staged, { ...OPTS, dir: `${FIX}/trees`, registry: registry() });
  return { staged, total };
}
const read = (staged, rel) => staged.files.get(rel).toString('utf8');

// ------------------------------------------------------------------------------------------------ positive
test('The synthetic trees compile to exactly the expected files', async () => {
  const { staged, total } = await compileFixtures();
  assert.deepEqual(total, { trees: 3, focuses: 19, spirits: 7, events: 5, raw: 3, files: 22, warnings: 0 });
  assert.equal(staged.files.size, total.files);
  if (process.env.ZIN_UPDATE_FOCUS_FIXTURES) {
    await rm(EXPECTED, { recursive: true, force: true });
    for (const [rel, bytes] of staged.files) { await mkdir(path.dirname(path.join(EXPECTED, rel)), { recursive: true }); await writeFile(path.join(EXPECTED, rel), bytes); }
  }
  assert(existsSync(EXPECTED), 'expected files are missing; run with ZIN_UPDATE_FOCUS_FIXTURES=1 after review');
  const expectedFiles = [];
  const collect = async (dir, rel = '') => { for (const e of await readdir(dir, { withFileTypes: true })) { if (e.isDirectory()) await collect(path.join(dir, e.name), `${rel}${e.name}/`); else expectedFiles.push(`${rel}${e.name}`); } };
  await collect(EXPECTED);
  assert.deepEqual(expectedFiles.sort(), [...staged.files.keys()].sort());
  for (const [rel, bytes] of staged.files) assert(bytes.equals(await readFile(path.join(EXPECTED, rel))), `${rel} differs from the expected file`);
});

test('Compiling twice gives identical bytes', async () => {
  const a = (await compileFixtures()).staged, b = (await compileFixtures()).staged;
  assert.deepEqual([...a.files.keys()], [...b.files.keys()]);
  for (const [rel, bytes] of a.files) assert(bytes.equals(b.files.get(rel)), rel);
});

test('Zero tree files, or no folder, compile to nothing and do not fail', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'zin-focus-empty-'));
  try {
    for (const d of [dir, path.join(dir, 'missing')]) {
      const staged = new Staged();
      const total = await buildFocusTrees(staged, { ...OPTS, dir: d, registry: registry() });
      assert.equal(total.trees, 0);
      assert.equal(staged.files.size, 0);
    }
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test('Every call with arguments sets zin_arg_ variables and then calls the effect; keywords become their codes', async () => {
  const { staged } = await compileFixtures();
  const text = read(staged, 'common/national_focus/zin_testland.txt');
  assert.match(text, /set_temp_variable = \{ zin_arg_value = 5 \}\n\t+set_temp_variable = \{ zin_arg_who = FROM \}\n\t+set_temp_variable = \{ zin_arg_charter = 1 \}\n\t+zin_testland_offer_treaties = yes/);
  assert.match(text, /set_temp_variable = \{ zin_arg_camp = 4 \}\n\t+set_temp_variable = \{ zin_arg_value = 10 \}\n\t+zin_aenor_add_camp_support = yes/);
  // The Aenor helper (F7) is the mechanic's effect followed by the event for the saved target.
  assert.match(text, /zin_aenor_event_for_parim = yes\n\t+event_target:zin_aenor_parim_realm = \{\n\t+country_event = \{\n\t+id = zin_testland\.500\n\t+days = 3/);
});

test('Doctrine research compiles to add_doctrine_cost_reduction and other research to add_tech_bonus', async () => {
  const text = read((await compileFixtures()).staged, 'common/national_focus/zin_testland.txt');
  assert.equal((text.match(/add_doctrine_cost_reduction = \{/g) ?? []).length, 2);
  assert.match(text, /add_tech_bonus = \{\n\t+name = zin_testland_builders\n\t+bonus = 0\.5\n\t+uses = 1\n\t+category = construction_tech\n\t+category = industry/);
  assert.doesNotMatch(text, /add_tech_bonus = \{[^}]*land_doctrine/);
});

test('Every compiled event sets timeout_days = 30 and is fired only by effects', async () => {
  const { staged } = await compileFixtures();
  for (const rel of ['events/zin_testland.txt', 'events/zin_shared_testlands.txt']) {
    const text = read(staged, rel);
    const events = (text.match(/^(country|news)_event = \{/gm) ?? []).length;
    assert.equal((text.match(/timeout_days = 30/g) ?? []).length, events, rel);
    assert.equal((text.match(/is_triggered_only = yes/g) ?? []).length, events, rel);
    assert.doesNotMatch(text, /mean_time_to_happen|trigger = \{/);
  }
  const events = read(staged, 'events/zin_testland.txt');
  assert.match(events, /add_namespace = zin_testland\n/);
  assert.match(events, /picture = GFX_zin_news_strait_toll/);
  assert.match(events, /hidden = yes[\s\S]*immediate = \{\n\t+set_country_flag = zin_testland_quiet/);
});

test('Mutual exclusions are written on both focuses', async () => {
  const text = read((await compileFixtures()).staged, 'common/national_focus/zin_testland.txt');
  assert.match(text, /id = zin_testland_free_path[\s\S]*?mutually_exclusive = \{\n\t+focus = zin_testland_court_path/);
  assert.match(text, /id = zin_testland_court_path[\s\S]*?mutually_exclusive = \{\n\t+focus = zin_testland_free_path/);
  const closure = exclusiveClosure((await analyse()).trees.get('testland'));
  assert.deepEqual([...closure.get('court_path')], ['free_path']);
  assert.deepEqual([...closure.get('free_path')], ['court_path']);
});

test('One layout file names the six on_actions of E4', async () => {
  const { staged } = await compileFixtures();
  assert.equal([...staged.files.keys()].filter(k => k === LAYOUT_FILE).length, 1);
  const text = read(staged, LAYOUT_FILE);
  for (const a of ['on_ruling_party_change', 'on_puppet', 'on_release_as_puppet', 'on_subject_free', 'on_annex', 'on_peaceconference_ended']) assert.match(text, new RegExp(`\\t${a} = \\{`));
  assert.equal(text, layoutFile());
});

test('A copy block gives the module the tree\'s ids, moves it and renames its helpers', async () => {
  const { staged } = await compileFixtures();
  const text = read(staged, 'common/national_focus/zin_regional_northmark.txt');
  assert.match(text, /id = zin_regional_northmark_watch_root\n[\s\S]*?x = 10\n\t+y = 1\n\t+prerequisite = \{\n\t+focus = zin_regional_northmark_north_root/);
  assert.match(text, /id = zin_regional_northmark_watch_tower\n[\s\S]*?x = 10\n\t+y = 2/);
  assert.match(text, /id = zin_regional_northmark_watch_banner\n[\s\S]*?x = 11\n\t+y = 2/);
  assert.match(text, /zin_regional_northmark_ready = yes/);
  assert.match(text, /zin_regional_northmark_ring = yes/);
  assert.match(text, /modifier = zin_regional_northmark_watch_thanks/);
  assert.match(text, /add_ideas = zin_regional_northmark_tower_spirit/);
  assert(!/shared_testlands/.test(text));
  assert.match(read(staged, 'common/scripted_effects/zin_regional_northmark.txt'), /^zin_regional_northmark_ring = \{/m);
  assert.match(read(staged, 'common/scripted_triggers/zin_regional_northmark.txt'), /^zin_regional_northmark_ready = \{/m);
  assert.match(read(staged, 'common/opinion_modifiers/zin_regional_northmark.txt'), /zin_regional_northmark_watch_thanks = \{/);
  assert.match(read(staged, 'common/ideas/zin_focus_regional_northmark.txt'), /zin_regional_northmark_tower_spirit = \{\n\t+picture = zin_lighthouse/);
});

test('The opinion helper takes zin_arg_who, zin_arg_modifier and zin_arg_both', async () => {
  const text = read((await compileFixtures()).staged, 'common/scripted_effects/zin_testland.txt');
  assert.match(text, /^zin_testland_opinion = \{/m);
  assert.match(text, /zin_arg_modifier = 1[\s\S]*zin_testland_envoys_welcomed[\s\S]*zin_arg_modifier = 2[\s\S]*zin_testland_gifts_refused/);
  assert.match(text, /target = var:zin_arg_who/);
  assert.match(text, /zin_arg_both = 1/);
});

test('Dynamic icons, search filters, costs in weeks and story-pace dates are written', async () => {
  const text = read((await compileFixtures()).staged, 'common/national_focus/zin_testland.txt');
  assert.match(text, /icon = \{\n\t+GFX_focus_zin_throne_ashen = \{\n\t+has_global_flag = zin_afrit_revealed\n\t+\}\n\t+GFX_focus_zin_censer = yes\n\t+\}\n\t+dynamic = yes/);
  assert.match(text, /search_filters = \{ FOCUS_FILTER_POLITICAL FOCUS_FILTER_STABILITY FOCUS_FILTER_WAR_SUPPORT FOCUS_FILTER_MANPOWER FOCUS_FILTER_ARMY_XP FOCUS_FILTER_NAVY_XP FOCUS_FILTER_AIR_XP \}/);
  assert.match(text, /id = zin_testland_court_path[\s\S]*?cost = 10\n/);
  for (const p of ['1', '1.5', '0.75']) assert.match(text, new RegExp(`global\\.zin_story_pace = ${p.replace('.', '\\.')} \\}`));
  assert.equal((text.match(/date > /g) ?? []).length, 3);
  assert.equal((text.match(/date < /g) ?? []).length, 3);
});

test('Localisation is UTF-8 with a BOM and holds every focus, spirit, event and option text', async () => {
  const { staged } = await compileFixtures();
  const bytes = staged.files.get('localisation/english/zin_focus_testland_l_english.yml');
  assert.deepEqual([...bytes.subarray(0, 3)], [0xef, 0xbb, 0xbf]);
  const text = bytes.toString('utf8');
  for (const key of ['zin_testland_root', 'zin_testland_root_desc', 'zin_testland_golden_court', 'zin_testland_golden_court_desc', 'zin_testland.500.t', 'zin_testland.500.d', 'zin_testland.500.a', 'zin_testland.500.b', 'zin_testland_envoys_welcomed', 'zin_testland_gifts_refused']) assert(text.includes(` ${key}:0 `), key);
  assert.match(text, /zin_testland_gifts_refused:0 "Gifts Refused"/);
});

test('Every compiled icon and picture is a catalog key and no file uses <= or >=', async () => {
  const { staged } = await compileFixtures();
  const catalog = await loadCatalog();
  for (const [rel, bytes] of staged.files) {
    const text = bytes.toString('utf8');
    assert.doesNotMatch(text, /<=|>=/, rel);
    for (const [, key] of text.matchAll(/GFX_focus_zin_([a-z0-9_]+)/g)) assert(catalog.icons.has(key), `${rel}: ${key}`);
    for (const [, key] of text.matchAll(/GFX_zin_(?:evt|news)_([a-z0-9_]+)/g)) assert(catalog.events.has(key), `${rel}: ${key}`);
    for (const [, key] of text.matchAll(/picture = zin_([a-z0-9_]+)/g)) assert(catalog.icons.has(key), `${rel}: ${key}`);
  }
});

test('Spirit icons follow catalog rule 2', async () => {
  const a = await analyse();
  const t = a.trees.get('testland');
  assert.equal(spiritIcon(t, 'golden_court'), 'censer');     // the default face of the first focus that adds it
  assert.equal(spiritIcon(t, 'open_court'), 'council_table');  // its own icon wins
  assert.equal(spiritIcon(t, 'road_wardens'), 'council_table');
});

test('Absolute positions follow relative_to', async () => {
  const a = await analyse(raw => { Object.assign(focus(raw, 'testland', 'concord'), { relative_to: 'court_path', x: 4, y: 2 }); });
  const { pos } = absolutePositions(a.trees.get('testland'));
  assert.deepEqual(pos.get('concord'), { x: 6, y: 3 });
  assert.match(compileTree(a.trees.get('testland'), a.ctx).files.get('common/national_focus/zin_testland.txt'), /relative_position_id = zin_testland_court_path\n\t+x = 4\n\t+y = 2/);
});

test('Story dates move with the pace', () => {
  assert.equal(paceDate('1750.1.1', 1), '1750.1.1');
  const slow = paceDate('1750.1.1', 1.5), fast = paceDate('1750.1.1', 0.75);
  assert.notEqual(slow, '1750.1.1');
  assert.notEqual(fast, '1750.1.1');
  const toDays = d => { const [y, m, day] = d.split('.').map(Number); return Date.UTC(y, m - 1, day) / 86400000; };
  const start = toDays('1748.3.1');
  assert(Math.abs((toDays(slow) - start) - 1.5 * (toDays('1750.1.1') - start)) <= 1);
  assert(Math.abs((toDays(fast) - start) - 0.75 * (toDays('1750.1.1') - start)) <= 1);
});

// ------------------------------------------------------------------------------------------------ schema
test('The schema rejects unknown fields, unknown effects and conditions, and malformed values', async () => {
  const ctx = { countries: new Set(ROSTER.map(c => c.name)), regions: new Set(ROSTER.map(c => c.scan)), people: new Set(Object.keys(PEOPLES)) };
  const bad = fn => { const t = structuredClone(BASE.testland); fn(t); return validateTree(t, ctx); };
  assert.deepEqual(validateTree(BASE.testland, ctx), []);
  assert(bad(t => { t.extra = 1; }).some(e => e.path === '$.extra'));
  assert(bad(t => { t.focuses[0].extra = 1; }).some(e => /focuses\[0\]\.extra/.test(e.path)));
  assert(bad(t => { t.focuses[0].effects.push({ teleport: 1 }); }).some(e => /not a known effect/.test(e.message)));
  assert(bad(t => { t.focuses[0].effects.push({ stability: 1, war_support: 1 }); }).some(e => /exactly one effect/.test(e.message)));
  assert(bad(t => { t.focuses[0].available = [{ weather: 'rain' }]; }).some(e => /not a known condition/.test(e.message)));
  assert(bad(t => { t.focuses[0].effects.push({ annex: 'Nowhere' }); }).some(e => /not a country/.test(e.message)));
  assert(bad(t => { t.focuses[0].effects.push({ building: { type: 'bunker', level: 0, where: 'capital' } }); }).some(e => /integer/.test(e.message)));
  assert(bad(t => { t.focuses[0].effects.push({ popularity: { ideology: 'purple', value: 1 } }); }).some(e => /one of light/.test(e.message)));
  assert(bad(t => { t.focuses[0].filters = ['luck']; }).some(e => /one of political/.test(e.message)));
  assert(bad(t => { t.events.feast.trigger = []; }).some(e => /mechanic-owned/.test(e.message)));
  assert(bad(t => { t.events.quiet.title = 'x'; }).some(e => /hidden event/.test(e.message)));
  assert(bad(t => { delete t.events.feast.n; }).some(e => /every event carries n or none/.test(e.message)));
  assert(bad(t => { t.tier = 'regional'; }).some(e => /regional_/.test(e.message)));
  assert(bad(t => { t.focuses[0].key = 'zin_root'; }).some(e => /must not start with zin_/.test(e.message)));
  assert(bad(t => { t.countries = []; }).some(e => /at least 1/.test(e.message)));
  assert(bad(t => { t.ai_strategies[0].type = 'tickle'; }).some(e => /must be one of/.test(e.message)));
  assert(bad(t => { t.focuses[0].effects.push({ call: 'zin_x', args: { bad: [] } }); }).some(e => /must be a number, a country/.test(e.message)));
  assert(bad(t => { t.focuses[0].available = [{ country: 'ROOT' }]; }).some(e => /not a country/.test(e.message)));
});

test('A tree file that is not valid JSON stops the build', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'zin-focus-bad-'));
  try {
    await writeFile(path.join(dir, 'broken.json'), '{ "id": ');
    await assert.rejects(buildFocusTrees(new Staged(), { ...OPTS, dir, registry: registry() }), /broken\.json: invalid JSON/);
  } finally { await rm(dir, { recursive: true, force: true }); }
});
test('An invalid tree stops the build with every error listed', async () => {
  const raw = structuredClone(BASE);
  raw.testland.focuses[0].days = 'soon';
  raw.testland.bogus = true;
  const a = await analyseTrees(Object.entries(raw).map(([name, data]) => ({ name, data })), new Staged(), { ...OPTS, registry: registry() });
  assert(a.problems.filter(p => p.code === 'schema').length >= 2);
  assert.throws(() => assertClean(a.problems), /The focus compiler found problems/);
  const b = await analyseTrees([{ name: 'broken', error: 'invalid JSON: nope' }], new Staged(), { ...OPTS, registry: registry() });
  assert(b.problems.some(p => /invalid JSON/.test(p.message)));
  const c = await analyseTrees([{ name: 'other', data: { ...structuredClone(BASE.regional_northmark) } }], new Staged(), { ...OPTS, registry: registry() });
  assert(c.problems.some(p => /must equal the file name/.test(p.message)));
});

// ------------------------------------------------------------------------------------------------ structure checks
test('Fails: duplicate focus key', async () => {
  await failsWith(raw => { raw.testland.focuses.push({ ...structuredClone(focus(raw, 'testland', 'root')), x: 20, y: 9 }); }, 'duplicate_key', /root/);
});
test('Fails: two focuses on one position', async () => {
  await failsWith(raw => { Object.assign(focus(raw, 'testland', 'concord'), { x: 2, y: 1 }); }, 'duplicate_position', /2,1/);
});
test('Fails: a prerequisite at or below its focus', async () => {
  await failsWith(raw => { Object.assign(focus(raw, 'testland', 'treaties'), { y: 1 }); }, 'prerequisite_above', /treaties/);
});
test('Fails: a prerequisite that is not a focus', async () => {
  await failsWith(raw => { focus(raw, 'testland', 'treaties').prerequisite = [['ghost']]; }, 'prerequisite_missing', /ghost/);
});
test('Fails: prerequisites that form a loop', async () => {
  await failsWith(raw => { focus(raw, 'testland', 'root').prerequisite = [['diplomacy']]; }, 'prerequisite_cycle', /root/);
});
test('Fails: an exclusive focus that does not exist, or one the focus needs', async () => {
  await failsWith(raw => { focus(raw, 'testland', 'free_path').mutually_exclusive = ['ghost']; }, 'exclusive_missing', /ghost/);
  await failsWith(raw => { focus(raw, 'testland', 'treaties').mutually_exclusive = ['court_path']; }, 'exclusive_prerequisite', /treaties/);
});
test('Fails: days that are not a multiple of seven, or out of range', async () => {
  await failsWith(raw => { focus(raw, 'testland', 'root').days = 36; }, 'days_multiple', /36/);
  await failsWith(raw => { focus(raw, 'testland', 'root').days = 147; }, 'days_range', /147/);
});
test('Fails: a relative_to that loops', async () => {
  await failsWith(raw => { Object.assign(focus(raw, 'testland', 'root'), { relative_to: 'treaties' }); Object.assign(focus(raw, 'testland', 'treaties'), { relative_to: 'root' }); }, 'relative_position', /loop/);
});

// ------------------------------------------------------------------------------------------------ art
test('Fails: an icon that is not in the catalog', async () => {
  await failsWith(raw => { focus(raw, 'testland', 'root').icon = 'unlisted_icon'; }, 'icon_unknown', /unlisted_icon/);
  await failsWith(raw => { focus(raw, 'testland', 'court_path').icon.after[0].icon = 'unlisted_icon'; }, 'icon_unknown', /unlisted_icon/);
});
test('Fails: a spirit with no icon that no focus adds', async () => {
  await failsWith(raw => { raw.testland.spirits.orphan = { name: 'Orphan', desc: 'No focus adds it.', modifier: { stability_factor: 0.01 } }; }, 'spirit_icon_missing', /orphan/);
});
test('Fails: an event picture that is not in the catalog, or has the wrong crop', async () => {
  await failsWith(raw => { raw.testland.events.feast.picture = 'unlisted_picture'; }, 'picture_unknown', /unlisted_picture/);
  await failsWith(raw => { raw.testland.events.toll.picture = 'court_feast'; }, 'picture_crop', /news events/);
  await failsWith(raw => { raw.testland.events.feast.picture = 'last_crowns'; }, 'picture_crop', /country events/);
});
test('Warns: a gated picture fired from a site that is not provably behind its gate', async () => {
  assert.deepEqual(gateWarnings((await analyse()).trees.get('testland'), (await analyse()).ctx), []);
  const a = await analyse(raw => { delete focus(raw, 'testland', 'reveal').available; });
  assert.equal(a.problems.length > 0, true);   // the Afrit text loses its proof too, which fails the build
  assert(gateWarnings(a.trees.get('testland'), a.ctx).some(w => /unmasking/.test(w) && /zin_afrit_revealed/.test(w)));
});

// ------------------------------------------------------------------------------------------------ references
test('Fails: references that do not resolve', async () => {
  await failsWith(raw => { focus(raw, 'testland', 'root').effects.push({ add_spirit: 'ghost' }); }, 'spirit_unknown', /ghost/);
  await failsWith(raw => { focus(raw, 'testland', 'root').effects.push({ add_spirit: 'zin_unknown_idea' }); }, 'spirit_unresolved', /zin_unknown_idea/);
  await failsWith(raw => { focus(raw, 'testland', 'root').effects.push({ event: 'ghost' }); }, 'event_unknown', /ghost/);
  await failsWith(raw => { focus(raw, 'testland', 'root').effects.push({ event: 'zin_nowhere.7' }); }, 'event_unresolved', /zin_nowhere\.7/);
  await failsWith(raw => { focus(raw, 'testland', 'root').available = [{ flag: 'never_set' }]; }, 'flag_unresolved', /never_set/);
  await failsWith(raw => { focus(raw, 'testland', 'root').available = [{ global_flag: 'never_set_global' }]; }, 'flag_unresolved', /never_set_global/);
  await failsWith(raw => { focus(raw, 'testland', 'root').effects.push({ call: 'zin_nowhere_effect' }); }, 'effect_unresolved', /zin_nowhere_effect/);
  await failsWith(raw => { focus(raw, 'testland', 'root').available = [{ check: 'zin_nowhere_trigger' }]; }, 'trigger_unresolved', /zin_nowhere_trigger/);
  await failsWith(raw => { focus(raw, 'testland', 'root').available = [{ focus_done: 'ghost' }]; }, 'focus_done_unknown', /ghost/);
  await failsWith(raw => { focus(raw, 'testland', 'root').effects.push({ opinion: { target: 'Northmark', modifier: 'ghost' } }); }, 'opinion_unknown', /ghost/);
  await failsWith(raw => { focus(raw, 'testland', 'root').effects.push({ opinion: { target: 'Northmark', modifier: 'zin_ghost' } }); }, 'opinion_unresolved', /zin_ghost/);
  await failsWith(raw => { focus(raw, 'testland', 'root').effects.push({ faction: 'ghost_league' }); }, 'faction_unresolved', /zin_faction_ghost_league/);
  await failsWith(raw => { focus(raw, 'testland', 'root').effects.push({ building: { type: 'bunker', level: 1, where: 'ghost_site' } }); }, 'site_unresolved', /zin_is_site_ghost_site/);
  await failsWith(raw => { focus(raw, 'testland', 'root').effects.push({ building: { type: 'bunker', level: 1, where: 'region:ghost' } }); }, 'site_unresolved', /zin_is_region_ghost/);
  await failsWith(raw => { raw.testland.scripted_effects.zin_other_name = { effects: [] }; }, 'name_prefix', /zin_other_name/);
});
test('Fails: a research bonus inside a scripted effect', async () => {
  await failsWith(raw => { raw.testland.scripted_effects.zin_testmech_ring_bells.effects.push({ research: { categories: ['industry'], bonus: 0.5, uses: 1 } }); }, 'research_context', /ring_bells/);
});

// ------------------------------------------------------------------------------------------------ F3 collisions
test('Fails (F3): a spirit key equal to a focus key', async () => {
  await failsWith(raw => { raw.testland.spirits.treaties = { name: 'Treaties', desc: 'Same key as the focus.', icon: 'seal_royal', modifier: { stability_factor: 0.01 } }; }, 'key_collision', /spirit key treaties equals a focus key/);
});
test('Fails (F3): a tree id equal to an id a mechanic writes', async () => {
  const a = await analyse(null, { registry: registry({ decisions: ['zin_testland'] }) });
  assert(a.problems.some(p => p.code === 'collision_mechanic' && /tree id testland/.test(p.message)), a.problems.map(p => p.message).join('\n'));
  const b = await analyse(null, { registry: registry({ sub_units: ['zin_regional_northmark'] }) });
  assert(b.problems.some(p => p.code === 'collision_mechanic' && /regional_northmark/.test(p.message)));
});
test('Fails (F3): a focus, spirit or opinion id equal to a mechanic\'s idea, decision, sub-unit, character or modifier', async () => {
  for (const kind of ['ideas', 'decisions', 'sub_units', 'characters', 'opinion_modifiers']) {
    const a = await analyse(null, { registry: registry({ [kind]: ['zin_testland_treaties', 'zin_testland_golden_court'] }) });
    assert(a.problems.filter(p => p.code === 'collision_mechanic').length >= 2, kind);
  }
});
test('Fails (F3): a scripted effect, trigger or event id that another module writes', async () => {
  await failsWith(null, 'collision_mechanic', /scripted effect zin_testland_offer_treaties/, { registry: registry({ scripted_effects: ['zin_testland_offer_treaties'] }) });
  await failsWith(null, 'collision_mechanic', /scripted trigger zin_testland_court_open/, { registry: registry({ scripted_triggers: ['zin_testland_court_open'] }) });
  await failsWith(null, 'collision_event', /zin_testland\.500/, { registry: registry({ events: ['zin_testland.500'] }) });
});
test('Fails (F3): ids shared by two trees', async () => {
  const mini = (id, key) => ({ name: id, data: { id, tier: 'major', countries: [id === 'a_b' ? 'Testland' : 'Northmark'], focuses: [{ key, name: 'A', desc: 'B', icon: 'crown_gold', x: 0, y: 0, days: 7 }] } });
  const a = await analyseTrees([mini('a_b', 'c'), mini('a', 'b_c')], new Staged(), { ...OPTS, registry: registry(), expected: [] });
  assert(a.problems.some(p => p.code === 'collision_tree' && /zin_a_b_c/.test(p.message)), a.problems.map(p => p.message).join('\n'));
});
test('Fails (F3): two event numbers that compile to one id', async () => {
  await failsWith(raw => { raw.testland.events.toll.n = 0; }, 'event_duplicate', /zin_testland\.500/);
});

// ------------------------------------------------------------------------------------------------ calls (E1)
test('Fails (E1): a keyword argument without a code', async () => {
  await failsWith(raw => { focus(raw, 'testland', 'treaties').effects.push({ call: 'zin_aenor_add_camp_support', args: { camp: 'senate', value: 1 } }); }, 'call_keyword_nocode', /senate/);
  await failsWith(raw => { focus(raw, 'testland', 'treaties').effects.push({ call: 'zin_testland_offer_treaties', args: { value: 1, who: 'ROOT', charter: 'steel' } }); }, 'call_keyword_nocode', /steel/);
});
test('Fails (E1): an argument the tree-declared effect reads but the call does not pass, or does not declare', async () => {
  await failsWith(raw => { focus(raw, 'testland', 'treaties').effects.push({ call: 'zin_testland_offer_treaties', args: { value: 1, who: 'ROOT' } }); }, 'call_arg_missing', /charter/);
  await failsWith(raw => { focus(raw, 'testland', 'treaties').effects.push({ call: 'zin_testland_offer_treaties', args: { value: 1, who: 'ROOT', charter: 'old', extra: 2 } }); }, 'call_arg_unknown', /extra/);
  await failsWith(raw => { focus(raw, 'testland', 'treaties').effects.push({ call: 'zin_testland_offer_treaties', args: { value: 'many', who: 'ROOT', charter: 'old' } }); }, 'call_arg_kind', /value/);
  await failsWith(raw => { raw.testland.scripted_effects.zin_testland_offer_treaties.effects.push({ raw: 'set_temp_variable = { a = zin_arg_hidden }' }); }, 'effect_arg_undeclared', /zin_arg_hidden/);
});
test('Fails (E1): the Aenor event helper without an event', async () => {
  await failsWith(raw => { focus(raw, 'testland', 'treaties').effects.push({ call: 'zin_aenor_event_for_parim', args: { days: 1 } }); }, 'call_arg_missing', /event/);
});
test('focus_arg_codes.json agrees with the specs it copies', async () => {
  const codes = await loadArgCodes();
  assert(codes.owners.length >= 9);
  for (const owner of codes.owners) {
    const spec = (await readFile(path.join(ZIN, owner.spec), 'utf8')).replace(/−/g, '-').toLowerCase();
    for (const [arg, table] of Object.entries(owner.args)) {
      assert(spec.includes(`\`${arg}\``), `${owner.owner}: ${arg} is not named in the spec`);
      for (const [word, code] of Object.entries(table)) {
        const w = word.replace(/_/g, '[_ ]');
        // The specs write "word code" ("seals 1", "bordering -1") or "code word" ("1 Coldor"); a word may be in backticks.
        assert(new RegExp(`\\b${w}\\b\`?[ =]*${code}(?![0-9])|(?<![0-9-])${code}[ ]*(?:for )?\\b${w}\\b`).test(spec), `${owner.owner}: ${arg} ${word} ${code} is not in the spec`);
      }
    }
  }
  assert.deepEqual(codesFor(codes, 'zin_aenor_add_camp_support', 'camp'), { court: 1, faithful: 2, dominions: 3, host: 4 });
  assert.deepEqual(codesFor(codes, 'zin_dark_anything', 'target'), { bordering: -1, holds: -2 });
  assert.deepEqual(codesFor(codes, 'zin_volgan_anything', 'target'), { all: -1, orcs: -2 });
  assert.equal(codesFor(codes, 'zin_aenor_x', 'bloc'), undefined);
});

// ------------------------------------------------------------------------------------------------ allow_branch (E4)
test('Fails (E4): a condition in allow_branch that changes in play and has no refresh', async () => {
  await failsWith(raw => { focus(raw, 'testland', 'conditions').allow_branch.push({ flag: 'zin_testland_court' }); }, 'allow_branch_changing', /zin_testland_court/);
  await failsWith(raw => { focus(raw, 'testland', 'conditions').allow_branch.push({ at_war: true }); }, 'allow_branch_changing', /at_war/);
  await failsWith(raw => { focus(raw, 'testland', 'conditions').allow_branch.push({ variable: { name: 'zin_testland_counter', above: 1 } }); }, 'allow_branch_changing', /counter/);
  await failsWith(raw => { focus(raw, 'testland', 'conditions').allow_branch.push({ after: '1750.1.1' }); }, 'allow_branch_changing', /after/);
  await failsWith(raw => { focus(raw, 'testland', 'conditions').allow_branch.push({ check: 'zin_mech_ready' }); }, 'allow_branch_changing', /zin_mech_ready/);
});
test('Fails (E4): a refreshed condition in allow_branch that the branch head does not repeat in available', async () => {
  await failsWith(raw => { const f = focus(raw, 'testland', 'conditions'); f.available = f.available.filter(c => !c.ideology); }, 'allow_branch_not_repeated', /ideology/);
  await failsWith(raw => { focus(raw, 'testland', 'conditions').allow_branch.push({ global_flag: 'zin_test_story' }); }, 'allow_branch_not_repeated', /zin_test_story/);
});
test('Accepts (E4): fixed conditions, a tree trigger made of fixed conditions, and a refreshed flag repeated in available', async () => {
  const a = await analyse(raw => {
    const f = focus(raw, 'testland', 'conditions');
    raw.testland.scripted_triggers.zin_testland_fixed = { conditions: [{ people: 'men' }, { country: 'Testland' }] };
    f.allow_branch.push({ check: 'zin_testland_fixed' }, { global_flag: 'zin_test_story' });
    f.available.push({ global_flag: 'zin_test_story' });
    focus(raw, 'testland', 'root').effects.push({ global_flag: 'zin_test_story' });
  });
  assert.deepEqual(a.problems.map(p => p.message), []);
});
test('Fails (E4): a tree without the layout refresh file', async () => {
  const a = await analyse(null, { layout: '# nothing here\n' });
  assert(a.problems.some(p => p.code === 'layout_refresh_missing' && /on_annex/.test(p.message)));
  assert.deepEqual(checkLayoutRefresh([], ''), []);
  assert.equal(checkLayoutRefresh([{}], layoutFile().replace('on_puppet', 'on_other')).length, 1);
});

// ------------------------------------------------------------------------------------------------ text
test('Fails: empty text and characters outside Windows-1252', async () => {
  await failsWith(raw => { focus(raw, 'testland', 'root').name = '   '; }, 'text_empty', /focus root name/);
  await failsWith(raw => { focus(raw, 'testland', 'root').desc = 'Nine 九 is not drawn.'; }, 'text_charset', /focus root desc/);
  const a = await analyse(raw => { focus(raw, 'testland', 'root').desc = 'Dashes — and “quotes” are drawn, so is café.'; });
  assert.deepEqual(a.problems, []);
});
test('Fails: superseded names', async () => {
  await failsWith(raw => { focus(raw, 'testland', 'root').desc = 'The hall of Einendil.'; }, 'text_superseded', /Einendil/);
  await failsWith(raw => { focus(raw, 'testland', 'root').desc = 'Edvoid watches.'; }, 'text_superseded', /Edvoid/);
  await failsWith(raw => { focus(raw, 'testland', 'root').desc = 'Rush the gates.'; }, 'text_superseded', /Rush/);
});
test('Fails (N16): a retired name in text or in a script reference', async () => {
  await failsWith(raw => { focus(raw, 'testland', 'root').desc = 'Ask the Hierarch.'; }, 'retired_name', /Hierarch/);
  await failsWith(raw => { focus(raw, 'testland', 'root').effects.push({ flag: 'zin_afrit_is_secret' }); }, 'retired_name', /zin_afrit_is_secret/);
  await failsWith(raw => { focus(raw, 'testland', 'root').effects.push({ event: 'zin_glo.10' }); }, 'retired_name', /zin_glo\.10/, { registry: registry({ events: ['zin_glo.10'] }) });
  const a = await analyse(raw => { focus(raw, 'testland', 'root').effects.push({ call: 'zin_regional_x_event_for_parim' }); }, { registry: registry({ scripted_effects: ['zin_regional_x_event_for_parim'] }) });
  assert(a.problems.some(p => p.code === 'retired_name' && /zin_regional_x_event_for_parim/.test(p.message)));
});
test('The retired table of the contract register is parsed; kind-qualified rows are skipped', async () => {
  const real = await loadRetired();
  for (const id of ['zin_blue_sword_broken', 'zin_glo.10', 'zin_afrit_name', 'zin_hierarch']) assert(real.ids.has(id), id);
  assert(real.texts.includes('Hierarch'));
  assert(!real.ids.has('zin_zol') && !real.ids.has('zin_zol_will'));
  assert(real.patterns.some(re => re.test('zin_regional_x_event_for_parim')));
  assert(real.patterns.some(re => re.test('GFX_zin_focus_crown')));
  assert(!real.ids.has('zin_rule_golden_king_death'));
  const sample = parseRetired('## Retired names\n\n| Retired | Use | Why |\n| --- | --- | --- |\n| `zin_old` | `zin_new` | x |\n| `zin_gone` (character) | y | z |\n| "Old Name" | "New" | t |\n| `zin_<tree>_old` | q | r |\n\n## Patterns\n| `zin_pattern` | a |\n');
  assert.deepEqual([...sample.ids], ['zin_old']);
  assert.deepEqual(sample.texts, ['Old Name']);
  assert.equal(sample.patterns.length, 1);
});
test('Fails (D1): Afrit or the Hidden Council in text reachable before the reveal', async () => {
  await failsWith(raw => { focus(raw, 'testland', 'root').desc = 'Afrit is not named yet.'; }, 'secret_leak', /focus root desc/);
  await failsWith(raw => { raw.testland.events.feast.desc = 'The Hidden Council meets.'; }, 'secret_leak', /event feast desc/);
  await failsWith(raw => { focus(raw, 'testland', 'treaties').effects.push({ tooltip: 'Afrit is told.' }); }, 'secret_leak', /tooltip/);
  await failsWith(raw => { raw.testland.spirits.golden_court.desc = 'Afrit rules the court.'; }, 'secret_leak', /spirit golden_court/);
});
test('The secret scan accepts text declared as gated when the gate is provable', async () => {
  const a = await analyse(raw => { focus(raw, 'testland', 'reveal').desc = 'Afrit is named.'; focus(raw, 'testland', 'reveal').text_gate = 'zin_afrit_revealed'; focus(raw, 'testland', 'reveal').allow_branch = [{ global_flag: 'zin_afrit_revealed' }]; });
  assert.equal(a.problems.filter(p => p.code.startsWith('secret')).length, 0, a.problems.map(p => p.message).join('\n'));
});
test('Fails (D1): an opinion modifier whose generated text names Afrit', async () => {
  await failsWith(raw => { raw.testland.opinion_modifiers.afrit_pleased = { value: 5 }; }, 'secret_leak', /opinion afrit_pleased/);
});
test('Fails (D1): a text_gate that is the wrong flag or cannot be proven', async () => {
  await failsWith(raw => { raw.testland.events.mask.text_gate = 'zin_other_flag'; }, 'secret_gate_flag', /zin_other_flag/);
  await failsWith(raw => { delete focus(raw, 'testland', 'reveal').available; }, 'secret_gate_unproven', /event/);
  await failsWith(raw => { focus(raw, 'testland', 'root').desc = 'Afrit.'; focus(raw, 'testland', 'root').text_gate = 'zin_afrit_revealed'; }, 'secret_gate_unproven', /focus/);
});

// ------------------------------------------------------------------------------------------------ modifiers
test('Spirit modifiers are checked against the game, including the templated families', async () => {
  assert.equal(await isValidModifier('political_power_gain'), true);
  assert.equal(await isValidModifier('production_speed_industrial_complex_factor'), true);
  assert.equal(await isValidModifier('state_production_speed_arms_factory_factor'), true);
  assert.equal(await isValidModifier('production_speed_moonlight_factor'), false);
  assert.equal(await isValidModifier('made_up_modifier'), false);
  await failsWith(raw => { raw.testland.spirits.golden_court.modifier.made_up_modifier = 0.1; }, 'modifier_unknown', /made_up_modifier/);
  await failsWith(raw => { raw.testland.spirits.golden_court.modifier.production_speed_moonlight_factor = 0.1; }, 'modifier_unknown', /moonlight/);
});

// ------------------------------------------------------------------------------------------------ tiers and raw blocks
test('Fails (F6): a tree outside its tier\'s focus range, counted over the whole tree', async () => {
  const a = await analyse(null, { tierRanges: undefined });
  assert.deepEqual(a.problems.filter(p => p.code === 'tier_range').map(p => p.tree).sort(), ['regional_northmark', 'shared_testlands', 'testland']);
  const b = await analyse(null, { tierRanges: { major: [10, 20], regional: [4, 6], shared: [4, 6] } });
  assert.equal(b.problems.filter(p => p.code === 'tier_range').length, 0);     // regional counts the 3 copied focuses: 1 + 3 = 4
  const c = await analyse(null, { tierRanges: { major: [10, 20], regional: [5, 6], shared: [4, 6] } });
  assert.deepEqual(c.problems.filter(p => p.code === 'tier_range').map(p => p.tree), ['regional_northmark']);
});
test('Fails: more raw blocks than a major tree may use', async () => {
  await failsWith(raw => { for (let i = 0; i < 9; i++) focus(raw, 'testland', 'root').effects.push({ raw: `add_command_power = ${i + 1}` }); }, 'raw_limit', /uses 12/);
  const a = await analyse(null);
  assert.equal(a.problems.filter(p => p.code === 'raw_limit').length, 0);   // three raw blocks are only counted
});

// ------------------------------------------------------------------------------------------------ coverage
test('Fails: a country with no tree once every tree is present, and a country with two', async () => {
  await failsWith(raw => { raw.shared_testlands.countries = ['Eastmark', 'Sunreach']; }, 'coverage_none', /Weststead/);
  await failsWith(raw => { raw.shared_testlands.countries.push('Testland'); }, 'coverage_many', /Testland/);
  const partial = await analyse(raw => { raw.shared_testlands.countries = ['Eastmark', 'Sunreach']; }, { expected: [...TREE_IDS, 'regional_missing'] });
  assert.equal(partial.problems.filter(p => p.code === 'coverage_none').length, 0);   // the tree list is not complete yet
  const partialDup = await analyse(raw => { raw.shared_testlands.countries.push('Testland'); }, { expected: [...TREE_IDS, 'regional_missing'] });
  assert(partialDup.problems.some(p => p.code === 'coverage_many'));                    // a country in two trees always fails
  assert.deepEqual(checkCoverage([], [{ name: 'A', tag: 'A01' }]).map(p => p.code), ['coverage_none']);
  assert.deepEqual(checkCoverage([], [{ name: 'A', tag: 'A01' }], { requireAll: false }), []);
});
test('The tiers spec lists the expected trees', async () => {
  const ids = await expectedTreeIds();
  for (const id of ['aenor', 'worshipdom', 'regional_noleksun', 'regional_r_en', 'shared_north_lands', 'shared_lands_of_the_sun']) assert(ids.includes(id), id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(ids.filter(i => i.startsWith('shared_')).length, 11);
});

// ------------------------------------------------------------------------------------------------ copy blocks
test('Fails: a copied position on top of a tree focus', async () => {
  await failsWith(raw => { raw.regional_northmark.copy[0].root_at = [10, 0]; }, 'duplicate_position', /copied from shared_testlands:E4/);
});
test('Fails: a copy of a module that does not exist, of a tree that is not shared, or of a module without one root', async () => {
  await failsWith(raw => { raw.regional_northmark.copy[0].module = 'E9'; }, 'copy', /no focus tagged module E9/);
  await failsWith(raw => { raw.regional_northmark.copy[0].from = 'testland'; }, 'copy', /not a shared tree/);
  await failsWith(raw => { raw.regional_northmark.copy[0].from = 'ghost'; }, 'copy', /not a tree/);
  await failsWith(raw => { focus(raw, 'shared_testlands', 'watch_tower').prerequisite = [['shared_root']]; focus(raw, 'shared_testlands', 'watch_banner').prerequisite = [['shared_root']]; }, 'copy', /exactly one root/);
  await failsWith(raw => { focus(raw, 'shared_testlands', 'watch_tower').prerequisite = [['watch_root'], ['shared_root']]; }, 'copy', /outside module/);
});
test('Fails: a copied key that collides with the tree\'s own', async () => {
  await failsWith(raw => { raw.regional_northmark.focuses.push({ key: 'watch_root', name: 'A', desc: 'B', icon: 'crown_iron', x: 12, y: 5, days: 7 }); }, 'duplicate_key', /watch_root/);
  await failsWith(raw => { raw.regional_northmark.spirits.tower_spirit = { name: 'Own', desc: 'Own.', icon: 'crown_iron', modifier: { stability_factor: 0.01 } }; }, 'copy', /spirits tower_spirit already exists/);
});

// ------------------------------------------------------------------------------------------------ registry
test('The registry reads the names that earlier modules stage', async () => {
  const staged = new Staged();
  staged.text('common/scripted_effects/zin_mech.txt', 'zin_mech_effect = {\n\tset_country_flag = zin_mech_flag\n\tset_global_flag = { flag = zin_mech_global days = 3 }\n}\n');
  staged.text('common/scripted_triggers/zin_mech.txt', 'zin_mech_trigger = { always = yes }\n');
  staged.text('events/zin_mech.txt', 'add_namespace = zin_mech\ncountry_event = {\n\tid = zin_mech.4\n\tis_triggered_only = yes\n}\nnews_event = {\n\tid = zin_mech.5\n}\n');
  staged.text('common/ideas/zin_mech.txt', 'ideas = {\n\tcountry = {\n\t\tzin_mech_idea = {\n\t\t\tpicture = x\n\t\t}\n\t\tlaw = yes\n\t}\n}\n');
  staged.text('common/decisions/zin_mech.txt', 'zin_mech_category = {\n\tzin_mech_decision = {\n\t\tcost = 1\n\t}\n}\n');
  staged.text('common/decisions/categories/zin_mech.txt', 'zin_mech_category = {\n\tvisible = { always = yes }\n}\n');
  staged.text('common/opinion_modifiers/zin_mech.txt', 'opinion_modifiers = {\n\tzin_mech_opinion = { value = 5 }\n}\n');
  staged.text('common/units/zin_mech.txt', 'sub_units = {\n\tzin_mech_unit = { sprite = x }\n}\n');
  staged.text('common/characters/zin_mech.txt', 'characters = {\n\tzin_mech_char = { name = x }\n}\n');
  const reg = scanStaged(staged);
  for (const [kind, name] of [['scripted_effects', 'zin_mech_effect'], ['scripted_triggers', 'zin_mech_trigger'], ['events', 'zin_mech.4'], ['events', 'zin_mech.5'], ['namespaces', 'zin_mech'], ['ideas', 'zin_mech_idea'], ['decisions', 'zin_mech_decision'], ['opinion_modifiers', 'zin_mech_opinion'], ['sub_units', 'zin_mech_unit'], ['characters', 'zin_mech_char'], ['flags', 'zin_mech_flag'], ['global_flags', 'zin_mech_global']]) assert(reg.has(kind, name), `${kind} ${name}`);
  assert(!reg.has('decisions', 'zin_mech_category'));
  assert(!reg.has('ideas', 'law'));
  const a = await analyse(raw => { focus(raw, 'testland', 'root').effects.push({ call: 'zin_mech_effect' }); }, { registry: registry().merge(reg) });
  assert.deepEqual(a.problems.map(p => p.message), []);
});
test('The shipped registry data and catalog load', async () => {
  const catalog = await loadCatalog();
  assert.equal(catalog.icons.size, 175);
  assert.equal(catalog.events.size, 52);
  assert.equal(catalog.events.get('unmasking').gate, 'zin_afrit_revealed');
  const prepared = prepareTrees(Object.entries(BASE).map(([name, data]) => ({ name, data })), ROSTER);
  assert.equal(prepared.problems.length, 0);
  assert.equal(prepared.trees.get('regional_northmark').focuses.length, 4);
});
