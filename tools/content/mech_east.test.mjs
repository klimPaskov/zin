// Tests of the eastern kings mechanic (docs/design/stage2/mech_east.md, spec docs/specs/04_mechanics/eastern_kings.md): the caravan
// roads and charters, the rivalry, the courts' lean, the kneel bias, the coalition and the invasion, the King of the East as the East
// lives it, the unified East and the South Lands desert. They call the builder directly with the roster (lib/roster.mjs) and
// assert on the staged files; nothing needs a prior build. The installed game is read for engine vocabulary (effects, triggers, modifiers).
// Every rule has at least one negative test: a mutated input or output that the check or the module refuses.
// Run: cd tools && node --test content/mech_east.test.mjs
import test from 'node:test';
import { countryTable } from './lib/roster.mjs';
import assert from 'node:assert/strict';
import { readFile, mkdtemp, writeFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Staged } from './lib/core.mjs';
import { parse, tokenize, walk } from './lib/clausewitz.mjs';
import { buildMechEast, loadEastData, eastExternals, EAST_DEPENDENCIES, TREE_EFFECTS, ROADS } from './modules/mech_east.mjs';
import { checkCommands, engineVocabulary } from './lib/mp_check.mjs';
import { paceDate, dateTrigger } from './lib/mech_kit.mjs';
import { readable, notCp1252, checkMods } from './lib/inst_util.mjs';
import { loadRuleSet, compileBanned, findBanned } from './lib/banned.mjs';
import { loadGlossary } from './lib/text_engine.mjs';
import { ZIN } from './lib/paths.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const json = async f => JSON.parse(await readFile(path.join(here, 'data', f), 'utf8'));
const countries = countryTable();
const DATA_RAW = await readFile(path.join(here, 'data/mech_regions_east.json'), 'utf8');
const D = await loadEastData();
const fresh = () => JSON.parse(DATA_RAW);
const build = async (data, extra = {}) => { const s = new Staged(); const r = await buildMechEast(s, { countries, ...(data ? { data } : {}), ...extra }); return { s, r }; };
const { s: staged, r: east } = await build();
const text = rel => { const b = staged.files.get(rel); assert(b, `missing staged file ${rel}`); return b.toString('utf8'); };
const scriptFiles = new Map([...staged.files].filter(([k]) => k.endsWith('.txt')).map(([k, v]) => [k, v.toString('utf8')]));
const allScript = [...scriptFiles.values()].join('\n');
const LOC = 'localisation/english/zin_east_l_english.yml';
const locOf = t => Object.fromEntries([...t.matchAll(/^ ([A-Za-z0-9_.@-]+):0 "(.*)"$/gm)].map(m => [m[1], m[2].replace(/\\n/g, '\n').replace(/\\"/g, '"')]));
const loc = locOf(text(LOC));
const tagOf = n => countries.find(c => c.name === n).tag;
const NOR = tagOf('Noris'), STA = tagOf('Stabilo'), AEN = tagOf('Aenor'), WOR = tagOf('Worshipdom');
// The Magical Lands realms the coalition may cross to (the roster's Magical Lands countries without the Worshipdom): 11 in the roster of
// 24 October 2026, where the debug-tag roster had 21; the East Lands sheet has 20 realms (35 before the merges).
const MAGICAL = countries.filter(c => c.scan === D.roster.magicalScan && c.tag !== WOR);
const EFF = 'common/scripted_effects/zin_east.txt', TRG = 'common/scripted_triggers/zin_east.txt', EVT = 'events/zin_east.txt', DEC = 'common/decisions/zin_east.txt';
/** The body of a top-level definition of a script file. */
const body = (rel, name) => {
  const t = text(rel), i = t.indexOf(`\n${name} = {\n`);
  assert(i >= 0, `${name} is not defined in ${rel}`);
  return t.slice(i + 1, t.indexOf('\n}\n', i + 1) + 2);
};
const eventBlock = id => { const t = text(EVT), i = t.indexOf(`\tid = ${id}\n`); assert(i >= 0, `${id} is not defined`); return t.slice(t.lastIndexOf('\n', i - 2), t.indexOf('\n}\n', i) + 2); };
const decisionBlock = id => { const t = text(DEC), i = t.indexOf(`\t${id} = {\n`); assert(i >= 0, `${id} is not defined`); return t.slice(i, t.indexOf('\n\t}\n', i) + 3); };
const defined = kind => new Set(east.definitions[kind]);

// ------------------------------------------------------------------------------------------------ checks reused by the negative tests
/** Lines that compare with an operator HOI4 does not parse. */
const badOperators = files => [...files].flatMap(([f, t]) => t.split('\n').map((l, i) => [l, i]).filter(([l]) => /<=|>=/.test(l)).map(([, i]) => `${f}:${i + 1}`));
/** Brace problems of a script text: the final depth and the lowest depth reached. */
const braces = t => { let depth = 0, min = 0; for (const tk of tokenize(t)) { if (tk.t === '{') depth++; if (tk.t === '}') { depth--; min = Math.min(min, depth); } } return { depth, min }; };
/** Every-country periodic hooks (rule 8 of CLAUDE.md): on_daily, on_weekly, on_monthly, and their every-country variants. */
const periodicHooks = files => [...files].filter(([f]) => f.startsWith('common/on_actions/')).flatMap(([f, t]) => [...t.matchAll(/^\t(on_(?:daily|weekly|monthly))\s*=/gm)].map(m => `${f}: ${m[1]}`));
/** A raw date test outside the generated story-pace triggers (acceptance item 4). */
const rawDates = files => [...files].flatMap(([f, t]) => {
  const outside = f === TRG ? t.replace(/^zin_east_after_[a-z_]+ = \{[\s\S]*?\n\}\n/gm, '') : t;
  return [...outside.matchAll(/\bdate [<>]/g)].map(() => f);
});
/** A cause of war outside the gated effects (the peace gates of the spec). */
const GATED = { zin_east_cross_rift: 'zin_eastern_invasion', zin_east_turn_west: 'zin_east_coalition_leader', zin_east_claim_road: 'zin_east_claims_open = yes', zin_east_claim_rift: 'has_global_flag = zin_eastern_invasion' };
const ungatedWar = files => {
  const out = [];
  for (const [f, t] of files) {
    let rest = t;
    if (f === EFF) for (const [name, gate] of Object.entries(GATED)) {
      const m = new RegExp(`^${name} = \\{[\\s\\S]*?\\n\\}\\n`, 'm').exec(rest);
      if (m && m[0].indexOf(gate) >= 0 && m[0].indexOf(gate) < m[0].search(/declare_war_on|add_claim_by/)) rest = rest.replace(m[0], '');
    }
    // the homage refusal claims only behind zin_east_claims_open; the Caravan Peace transfers claimed states, it creates no claim
    if (f === EVT) rest = rest.replace(/limit = \{ zin_east_claims_open = yes \}[\s\S]*?add_claim_by = FROM/, '');
    for (const m of rest.matchAll(/\b(declare_war_on|create_wargoal|add_state_claim|add_claim_by)\b/g)) out.push(`${f}: ${m[1]}`);
  }
  return out;
};
/** Commands whose blocks are parameters but that mp_check walks as commands; the vocabulary test collapses them first. */
const PARAM_BLOCKS = ['strength_ratio', 'has_dynamic_modifier', 'set_politics'];
const collapseParams = t => t.replace(new RegExp(`\\b(${PARAM_BLOCKS.join('|')}) = \\{[^{}\\n]*\\}`, 'g'), '$1 = yes');
/** Duplicate keys inside one JSON object of a raw text (JSON.parse keeps the last silently). */
const duplicateKeys = raw => {
  const out = [], stack = [];
  for (const m of raw.matchAll(/"((?:[^"\\]|\\.)*)"\s*:|[{}[\]]/g)) {
    if (m[0] === '{') stack.push(new Set()); else if (m[0] === '}') stack.pop(); else if (m[0] === '[' || m[0] === ']') { if (m[0] === '[') stack.push(null); else stack.pop(); }
    else if (stack.at(-1)) { if (stack.at(-1).has(m[1])) out.push(m[1]); stack.at(-1).add(m[1]); }
  }
  return out;
};
const compiledBanned = compileBanned(await loadRuleSet({ glossary: await loadGlossary() }));
const bannedHits = entries => Object.entries(entries).flatMap(([k, v]) => findBanned(readable(v), compiledBanned, ['error']).map(h => `${k}: ${h.word} (${h.id})`));
const SECRET = /Afrit|Hidden Council|demon|Sunhot|Eindil|Einendil|Erdae|\bArda\b/i;
const secretHits = entries => Object.entries(entries).filter(([k, v]) => SECRET.test(v) || /afrit|demon/i.test(k)).map(([k]) => k);
const HUB_TEXT = /^zin_east\.31\.|^zin_east_(feed_the_quarrel|whisper_of_the_rift|report)(_desc)?$/;
// "the Council" (capitalised) is the Hidden Council's short name; a lower-case council hall is an ordinary room
const councilOutsideHub = entries => Object.entries(entries).filter(([k, v]) => (/\bCouncil\b/.test(v) || /eastern branch/i.test(v)) && !HUB_TEXT.test(k)).map(([k]) => k);

// ------------------------------------------------------------------------------------------------ build shape
test('Counts: the staged content matches the spec tables', () => {
  const c = east.counts;
  assert.equal(east.files.length, 12, 'the Files table without the site rows and the faction template (other owners)');
  assert.equal(c.decisions, 22, 'five caravans, four road decisions, dig wells, five court decisions, four Ledger decisions, three hub decisions');
  assert.equal(c.categories, 4, 'roads, the desert, courts, Ledger');
  assert.equal(c.ideas, 9, 'the eight ideas of the spec and the rationed water of zin_east.36');
  assert.equal(c.opinions, 10);
  assert.equal(c.dynamicModifiers, 5, 'caravan wealth, dry land, wells and the two causes');
  assert.equal(c.events, 26, 'twenty-one visible events and five hidden runners');
  assert.equal(c.aiStrategies, 2 + 2 * MAGICAL.length, 'free crowns, Aenor, and conquest plus front request toward each Magical Lands realm'); assert(MAGICAL.length > 5);
  assert.equal(c.scriptedLocs, 6);
  assert.equal(east.statesTotal, 337, 'the East Lands hold 337 states at start');
  assert.equal(countries.filter(x => x.scan === 'South-Earth').length, D.roster.expectedCountries);
});

test('Determinism: a second build yields the same bytes', async () => {
  const { s } = await build();
  assert.deepEqual([...s.files.keys()], [...staged.files.keys()]);
  for (const [k, v] of staged.files) assert(v.equals(s.files.get(k)), `${k} differs between builds`);
});

test('Files: the Files table is staged, LF only, the text is UTF-8 with BOM; other owners\' files are not staged', () => {
  for (const rel of ['common/scripted_effects/zin_east.txt', 'common/scripted_triggers/zin_east.txt', 'common/ideas/zin_east.txt', 'common/dynamic_modifiers/zin_east.txt', 'common/opinion_modifiers/zin_east.txt', 'common/decisions/categories/zin_east.txt', 'common/decisions/zin_east.txt', 'events/zin_east.txt', 'common/on_actions/zin_east.txt', 'common/scripted_localisation/zin_east.txt', 'common/ai_strategy/zin_east.txt', LOC]) assert(staged.files.has(rel), `${rel} is not staged`);
  assert(staged.files.get(LOC).subarray(0, 3).equals(Buffer.from([0xef, 0xbb, 0xbf])), 'no byte order mark');
  assert(!/[\u0080-￿]/.test(text(LOC).slice(1).replace(/[ -ÿ‘’“”–—…§]/g, '')), 'only Windows-1252 characters');
  for (const [k, v] of staged.files) assert(!v.includes(0x0d), `${k} has CR line ends`);
  assert(![...staged.files.keys()].some(k => /zin_sites|factions\//.test(k)), 'the site rows (sites.mjs) and the Free Crowns template (diplomacy) belong to other owners');
  assert(!/zin_lore\.191/.test(allScript), 'O4: the lore spec\'s temple loan is retired');
});

test('Scripts: every staged script parses with balanced braces and uses no <= or >=', () => {
  for (const [f, t] of scriptFiles) {
    const { depth, min } = braces(t);
    assert.equal(depth, 0, `${f} is unbalanced`); assert.equal(min, 0, `${f} closes too early`);
    assert.doesNotThrow(() => parse(t), f);
  }
  assert.deepEqual(badOperators(scriptFiles), []);
});

test('Negative: the script checks refuse an unbalanced block, an early close and a >= comparison', () => {
  assert.notEqual(braces('a = {\n\tb = { c = 1 }\n').depth, 0);
  assert(braces('a = { }\n}\nb = {').min < 0);
  assert.equal(badOperators(new Map([['x.txt', 'limit = { check_variable = { a >= 1 } }']])).length, 1);
  assert.equal(badOperators(new Map([['x.txt', 'limit = { check_variable = { a <= 1 } }']])).length, 1);
});

// ------------------------------------------------------------------------------------------------ engine vocabulary
test('Engine vocabulary: every command is in the installed effect or trigger documentation, defined here, or declared external', async () => {
  const known = new Set([...defined('effects'), ...defined('triggers'), ...eastExternals('effects'), ...eastExternals('triggers')]);
  const collapsed = new Map([...scriptFiles].map(([k, v]) => [k, collapseParams(v)]));
  assert.deepEqual(await checkCommands(collapsed, known), []);
});

test('Engine vocabulary: every loop scope (every_, random_, any_) is a documented command', async () => {
  const { effects, triggers } = await engineVocabulary();
  const loops = new Set([...allScript.matchAll(/\b((?:every|random|any)_[a-z_]+) = \{/g)].map(m => m[1]));
  assert(loops.size > 5);
  assert.deepEqual([...loops].filter(l => !effects.has(l) && !triggers.has(l)), []);
  assert(!effects.has('every_owned_states') && !triggers.has('any_owned_states'), 'Negative: a misspelt loop is not documented');
});

test('Negative: the vocabulary check finds an unknown trigger, an unknown effect and an undefined helper', async () => {
  const bad = new Map([['common/scripted_triggers/zin_x.txt', 'zin_x_t = {\n\tthis_trigger_does_not_exist = yes\n}\n'], ['common/scripted_effects/zin_x.txt', 'zin_x_e = {\n\tif = {\n\t\tlimit = { always = yes }\n\t\tadd_political_powerr = 5\n\t}\n\tzin_east_helper_nobody_wrote = yes\n}\n']]);
  const problems = await checkCommands(bad, new Set(['zin_x_t', 'zin_x_e']));
  assert.equal(problems.length, 3, problems.join('; '));
  assert.equal(collapseParams('strength_ratio = { tag = ROOT ratio > 1 }'), 'strength_ratio = yes');
});

test('Modifiers: every key of every idea and dynamic modifier is in the installed modifier documentation', async () => {
  for (const f of ['common/ideas/zin_east.txt', 'common/dynamic_modifiers/zin_east.txt']) {
    const mods = {};
    walk(parse(text(f)), (e, a) => { if (e.k && !Array.isArray(e.v) && (a.at(-1)?.k === 'modifier' || (f.includes('dynamic') && a.length === 1)) && !/^(enable|always|icon)$/.test(e.k)) mods[e.k] = 1; });
    assert(Object.keys(mods).length >= 3, f);
    await checkMods(f, mods);
  }
  for (const m of ['political_power_gain', 'trade_opinion_factor', 'consumer_goods_factor', 'supply_factor', 'truck_attrition_factor', 'local_resources_factor', 'stability_factor', 'war_support_factor', 'army_attack_factor', 'army_defence_factor', 'generate_wargoal_tension_against']) assert(allScript.includes(`${m} =`), `the spec's modifier ${m} is used`);
  await assert.rejects(() => checkMods('bad', { trade_opinion_factorr: 0.1 }), /Unknown modifier/);
});

// ------------------------------------------------------------------------------------------------ names: definitions, references, externals
test('References: every call, event, idea, opinion, category, flag and variable resolves here or is declared external with its owner', () => {
  const callable = new Set([...defined('effects'), ...defined('triggers'), ...eastExternals('effects'), ...eastExternals('triggers')]);
  const calls = [...new Set([...allScript.matchAll(/\b(zin_[a-z0-9_]+) = (?:yes|no)\b/g)].map(m => m[1]))];
  assert.deepEqual(calls.filter(c => !callable.has(c)), [], 'called but defined nowhere');
  const events = new Set([...allScript.matchAll(/\bid = (zin_[a-z]+\.\d+)/g)].map(m => m[1]));
  assert.deepEqual([...events].filter(e => !defined('events').has(e) && !eastExternals('events').includes(e)), []);
  const ideas = new Set([...allScript.matchAll(/\b(?:add_ideas|remove_ideas|has_idea|idea) = (zin_[a-z0-9_]+)/g)].map(m => m[1]));
  assert.deepEqual([...ideas].filter(i => !defined('ideas').has(i)), []);
  const mods = new Set([...allScript.matchAll(/\bmodifier = (zin_[a-z0-9_]+)/g)].map(m => m[1]));
  assert.deepEqual([...mods].filter(o => !defined('opinions').has(o) && !defined('dynamicModifiers').has(o) && !eastExternals('dynamicModifiers').includes(o)), []);
  const cats = parse(text(DEC)).map(e => e.k);
  assert.deepEqual(cats.filter(x => !defined('categories').has(x) && !eastExternals('categories').includes(x)), []);
  const templates = [...allScript.matchAll(/create_faction_from_template = (\w+)/g)].map(m => m[1]);
  assert.deepEqual(templates.filter(x => !eastExternals('templates').includes(x)), []);
  // flags: every flag read is set by this slice or declared external
  const setFlags = new Set([...allScript.matchAll(/\bset_(?:country|global|state)_flag = (?:\{ flag = )?(zin_[a-z0-9_]+)/g)].map(m => m[1]));
  const readFlags = new Set([...allScript.matchAll(/\bhas_(?:country|global|state)_flag = (zin_[a-z0-9_]+)/g)].map(m => m[1]));
  const extFlags = new Set([...eastExternals('countryFlags'), ...eastExternals('globalFlags')]);
  assert.deepEqual([...readFlags].filter(f => !setFlags.has(f) && !extFlags.has(f)), [], 'flags read that nobody sets');
  // variables: every zin_ variable read is written here or declared external
  const written = new Set([...allScript.matchAll(/\b(?:set|add_to|subtract_from|multiply|divide|clamp)_(?:temp_)?variable = \{ (?:var = )?(?:global\.|PREV\.)?(zin_[a-z0-9_]+)/g)].map(m => m[1]));
  const read = new Set([...allScript.matchAll(/check_variable = \{ (?:global\.)?(zin_[a-z0-9_]+)/g)].map(m => m[1]));
  assert.deepEqual([...read].filter(v => !written.has(v) && !eastExternals('variables').includes(v)), [], 'variables read that nobody writes');
  const scripted = new Set([...Object.values(loc).join('\n').matchAll(/\[(zin_[a-z0-9_]+)\]/g)].map(m => m[1]));
  assert.deepEqual([...scripted].filter(x => !defined('scriptedLocs').has(x) && !eastExternals('scriptedLoc').includes(x)), []);
});

test('Externals: every declared external is used, has an owner and a spec, and is not defined here', () => {
  const everything = [...staged.files.values()].map(b => b.toString('utf8')).join('\n');
  for (const d of EAST_DEPENDENCIES) {
    assert(d.owner && d.spec, `an owner group lacks its owner or spec: ${JSON.stringify(d).slice(0, 80)}`);
    for (const [kind, names] of Object.entries(d)) if (Array.isArray(names)) for (const n of names) {
      assert(everything.includes(n), `${n} (${kind}, ${d.owner}) is declared external but never used`);
      if (defined(kind)?.has) assert(!defined(kind).has(n), `${n} is declared external and defined here`);
    }
  }
  for (const e of eastExternals('events')) assert(!defined('events').has(e), `${e} belongs to its owner`);
  for (const e of Object.keys(TREE_EFFECTS)) assert(!new RegExp(`^${e} = \\{`, 'm').test(allScript), `${e} is the tree's`);
});

/** Ids of different kinds that share one localisation key (a decision and an opinion modifier of one name show one text). */
const sharedTextKeys = defs => {
  const seen = new Map(), out = [];
  for (const kind of ['decisions', 'categories', 'ideas', 'opinions', 'dynamicModifiers']) for (const id of defs[kind]) { if (seen.has(id)) out.push(`${id}: ${seen.get(id)} and ${kind}`); seen.set(id, kind); }
  return out;
};
test('Text keys: no decision, category, idea, opinion or modifier shares its name (and so its text) with another', () => {
  assert.deepEqual(sharedTextKeys(east.definitions), []);
  assert.deepEqual(sharedTextKeys({ decisions: ['zin_east_court_gifts'], categories: [], ideas: [], opinions: ['zin_east_court_gifts'], dynamicModifiers: [] }), ['zin_east_court_gifts: decisions and opinions'], 'Negative: the spec\'s shared name is caught');
  assert.deepEqual(sharedTextKeys({ decisions: [], categories: ['zin_east_wells'], ideas: [], opinions: [], dynamicModifiers: ['zin_east_wells'] }).length, 1, 'Negative: a category named like the wells modifier is caught');
});

test('Ownership: no stub is staged, no name is defined twice, every id carries the zin prefix', () => {
  assert(!/\bstub\b/i.test(allScript), 'nothing staged is a stub');
  for (const [kind, list] of Object.entries(east.definitions)) {
    assert.equal(list.length, new Set(list).size, `${kind} defined twice`);
    for (const id of list) assert(/^zin_/.test(id), `${kind} ${id} lacks the zin_ prefix`);
  }
  const top = [...text(EFF).matchAll(/^(zin_[a-z0-9_]+) = \{/gm)].map(m => m[1]);
  assert.equal(top.length, new Set(top).size);
  assert.deepEqual(top.sort(), [...defined('effects')].sort());
});

test('Negative: the module refuses to stage a stub when a tree does not declare a name it calls', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'zin-east-trees-'));
  try {
    const noris = JSON.parse(await readFile(path.join(ZIN, 'docs/design/focus/noris.json'), 'utf8'));
    const stabilo = JSON.parse(await readFile(path.join(ZIN, 'docs/design/focus/stabilo.json'), 'utf8'));
    delete stabilo.scripted_effects.zin_stabilo_add_debt;
    await writeFile(path.join(dir, 'noris.json'), JSON.stringify(noris));
    await writeFile(path.join(dir, 'stabilo.json'), JSON.stringify(stabilo));
    await assert.rejects(() => build(undefined, { treeDir: dir }), /zin_stabilo_add_debt.*writes no stub/);
    await rm(path.join(dir, 'noris.json'));
    await assert.rejects(() => build(undefined, { treeDir: dir }), /zin_noris_monthly/);
  } finally { await rm(dir, { recursive: true, force: true }); }
});

// ------------------------------------------------------------------------------------------------ text
test('Localisation: every key the script names exists, nothing is empty, no banned or modern word, only Windows-1252', () => {
  const need = new Set();
  for (const [f, t] of scriptFiles) if (!f.includes('scripted_localisation')) for (const m of t.matchAll(/\b(?:title|desc|name|text|localization_key) = ([A-Za-z0-9_.]+)/g)) if (/^zin_/.test(m[1])) need.add(m[1]);
  for (const m of text('common/scripted_localisation/zin_east.txt').matchAll(/localization_key = ([A-Za-z0-9_.]+)/g)) need.add(m[1]);
  for (const id of [...defined('decisions'), ...defined('categories'), ...defined('ideas')]) { need.add(id); need.add(`${id}_desc`); }
  for (const id of [...defined('opinions'), 'zin_east_caravan_wealth', 'zin_east_dry_land', 'zin_east_wells']) need.add(id);
  assert.deepEqual([...need].filter(k => !(k in loc)), []);
  for (const [k, v] of Object.entries(loc)) assert(v.trim().length > 0, `${k} is empty`);
  assert.deepEqual(bannedHits(loc), []);
  assert.deepEqual(notCp1252(loc), []);
  assert.deepEqual(east.text, Object.fromEntries(Object.entries(loc)), 'the staged text is the module\'s text');
});

test('Negative: the text rules catch a modern word, a banned unit and a character the font cannot draw; the build refuses them', async () => {
  const hits = bannedHits({ a: 'The tank division moves with its manpower', b: 'Forty kilometres of road', c: 'An envoy of the nations' });
  assert(hits.length >= 3, hits.join('; '));
  assert.equal(notCp1252({ k: 'Šodolôrō' }).length, 1);
  const d = fresh(); d.text['zin_east.40.d'] = 'The tank division rolls toward the rift.';
  await assert.rejects(() => build(d), /text problems/);
});

test('Negative: the data may hold no unused text and no duplicate key (JSON keeps the last silently)', async () => {
  assert.deepEqual(duplicateKeys(DATA_RAW), []);
  assert.deepEqual(duplicateKeys('{ "a": 1, "b": { "a": 2 }, "a": 3 }'), ['a']);
  const d = fresh(); d.text.zin_east_never_shown = 'A line nothing shows.';
  await assert.rejects(() => build(d), /text nothing uses: zin_east_never_shown/);
});

test('Secrets: no text names Afrit, the Hidden Council, a demon, Eindil, Erdae or Arda; the Deliverer only through zin_loc_deliverer; the Council only in hub texts', () => {
  assert.deepEqual(secretHits(loc), []);
  assert.deepEqual(Object.entries(loc).filter(([, v]) => /\bDeliverer\b|Aurevan|(?<!High )King of the East/.test(v.replace(/\[zin_loc_deliverer\]/g, ''))).map(([k]) => k), [], 'the master is named only through [zin_loc_deliverer]');
  assert.deepEqual(councilOutsideHub(loc), []);
  for (const id of ['zin_east_feed_the_quarrel', 'zin_east_whisper_of_the_rift', 'zin_east_report']) assert(/visible = \{\n\t\t\tzin_afrit_is_hub = yes/.test(decisionBlock(id)) && decisionBlock(id).includes('allowed = {\n\t\t\tzin_afrit_is_hub = yes'), `${id} is hub-only`);
  assert(body(EFF, 'zin_east_make_report').length && text(DEC).indexOf('country_event = { id = zin_east.31 }') > text(DEC).indexOf('zin_afrit_council = {'), 'zin_east.31 is fired only from the hub category');
  assert.equal([...allScript.matchAll(/id = zin_east\.31\b/g)].length, 2, 'defined once and fired once');
});

test('Negative: the secret rules catch the name, a key with the name, the Council in public text and Eindil', () => {
  assert.deepEqual(secretHits({ a: 'Afrit smiles.', zin_east_afrit_note: 'x', b: 'The stranger is Eindil.', c: 'Old roads of Arda.', d: 'Nothing secret.' }), ['a', 'zin_east_afrit_note', 'b', 'c']);
  assert.deepEqual(councilOutsideHub({ 'zin_east.40.d': 'The Council sends word.', 'zin_east.31.d': 'The Council sends word.', 'zin_east.15.d': 'The Eastern Branch pays.', 'zin_east.16.d': 'The council hall is cold.' }), ['zin_east.40.d', 'zin_east.15.d']);
});

// The retired names of the contract register (00_contract_additions.md, "Retired"): ids in backticks and game words in quotes.
const ADDITIONS = await readFile(path.join(ZIN, 'docs/specs/04_mechanics/00_contract_additions.md'), 'utf8');
const RETIRED = (() => {
  const section = ADDITIONS.slice(ADDITIONS.indexOf('| Retired | Use instead | Why |'), ADDITIONS.indexOf('## Patterns'));
  const first = section.split('\n').filter(l => l.startsWith('| ') && !l.startsWith('| Retired') && !l.startsWith('| ---')).map(l => l.split('|')[1]);
  return { ids: first.flatMap(c => [...c.matchAll(/`([^`]+)`/g)].map(m => m[1])).filter(x => !x.includes('<')), words: first.flatMap(c => [...c.matchAll(/"([^"]+)"/g)].map(m => m[1])) };
})();
const retiredHits = (files, entries) => [
  ...[...files].flatMap(([f, t]) => RETIRED.ids.filter(id => new RegExp(`(?<![A-Za-z0-9_.])${id.replace(/\./g, '\\.')}(?![A-Za-z0-9_])`).test(t)).map(id => `${f}: ${id}`)),
  ...Object.entries(entries).flatMap(([k, v]) => RETIRED.words.filter(w => v.includes(w)).map(w => `${k}: "${w}"`)),
];
test('Names: no staged script or text uses a retired name of the contract register (N16, O4, O5)', () => {
  assert(RETIRED.ids.length > 40 && RETIRED.ids.includes('zin_lore.191') && RETIRED.ids.includes('zin_autonomy_client_crown') && RETIRED.words.includes('The Eastern Throne'));
  assert.deepEqual(retiredHits(scriptFiles, loc), []);
});

test('Negative: the retired-name check flags a retired id in script and a retired word in text', () => {
  const hits = retiredHits(new Map([['x.txt', 'set_autonomy = { target = FROM autonomy_state = zin_autonomy_client_crown }\nzin_afrit_name = yes']]), { k: 'The courts swear to The Eastern Throne.' });
  assert.equal(hits.length, 3, hits.join('; '));
});

// ------------------------------------------------------------------------------------------------ events
const PICTURES = { '.10': 'evt_generic_peace', '.15': 'evt_generic_war', '.16': 'evt_generic_court', '.20': 'evt_generic_peace', '.21': 'evt_grey_ford_truce', '.23': 'evt_generic_peace', '.24': 'news_generic_peace', '.25': 'news_generic_war', '.26': 'evt_generic_court', '.27': 'news_generic_peace', '.30': 'evt_houses', '.31': 'evt_council_chamber', '.32': 'evt_generic_peace', '.35': 'evt_generic_wilds', '.36': 'evt_generic_wilds', '.40': 'evt_generic_court', '.70': 'evt_generic_court', '.71': 'evt_generic_court', '.72': 'evt_concord_council', '.73': 'evt_generic_court', '.80': 'news_generic_court' };
test('Events: the spec\'s pictures, 30-day timeouts, news crops, hidden runners; the war events spec\'s ids are fired, not defined', async () => {
  const cells = await json('presentation-cells.json');
  const pics = new Map(cells.events.map(e => [e.key, e]));
  const seen = new Set();
  for (const ev of parse(text(EVT)).filter(e => /^(country|news)_event$/.test(e.k))) {
    const get = k => ev.v.find(x => x.k === k)?.v, id = get('id');
    seen.add(id);
    if (get('hidden') === 'yes') { assert(ev.v.some(x => x.k === 'immediate') && !ev.v.some(x => x.k === 'option'), `${id} hidden`); continue; }
    assert.equal(get('timeout_days'), '30', `${id} E2`);
    const want = PICTURES[id.slice('zin_east'.length)];
    assert.equal(get('picture'), `GFX_zin_${want}`, `${id} picture`);
    const m = /^GFX_zin_(evt|news)_(.+)$/.exec(get('picture')), cell = pics.get(m[2]);
    assert(cell, `${id}: ${m[2]} is not in the catalog`);
    // a gated picture only where its gate holds when the event fires (E5): the council chamber is for the hub's own report
    assert(!cell.gate || (cell.gate === 'hub-only events' && id === 'zin_east.31'), `${id}: ${m[2]} is gated by ${cell.gate}`);
    assert.equal(ev.k === 'news_event', m[1] === 'news', `${id} news kind`);
    if (ev.k === 'news_event') assert(['both', 'news'].includes(cell.crop), `${id}: no news crop`);
  }
  assert.deepEqual([...seen].sort(), ['zin_east.1', 'zin_east.2', 'zin_east.3', 'zin_east.5', 'zin_east.6', ...Object.keys(PICTURES).map(k => `zin_east${k}`)].sort());
  assert(!/traders_road_south|eastern_court/.test(text(EVT)), 'no gated caravan or court picture here');
  for (const id of eastExternals('events').filter(e => e.startsWith('zin_east.'))) assert(new RegExp(`id = ${id.replace('.', '\\.')}\\b`).test(allScript), `${id} is never fired`);
});

test('Events: choice events put the non-committal option first (E2), and the AI follows the spec\'s weights', () => {
  const firstName = id => /option = \{\n\t\tname = ([a-z0-9_.]+)/.exec(eventBlock(id))[1];
  assert.equal(loc[firstName('zin_east.30')], 'Decline politely.');
  assert.equal(loc[firstName('zin_east.70')], 'Decline.');
  assert.equal(loc[firstName('zin_east.71')], 'Refuse.');
  assert.equal(loc[firstName('zin_east.73')], 'Refuse.');
  assert.equal(loc[firstName('zin_east.26')], 'We fight on.');
  assert.equal(loc[firstName('zin_east.40')], 'Old tales.');
  const loan = eventBlock('zin_east.30');
  assert(loan.includes('base = 40') && loan.includes('base = 60') && loan.includes('add = 30') && loan.includes('add = 50'), 'the loan weights 40 / 60 (+30 in crisis) / 50');
  assert(/factor = 0\n\t\t\t\tOR = \{\n\t\t\t\t\thas_country_flag = zin_east_court_audit\n\t\t\t\t\thas_country_flag = zin_noris_audit\n\t\t\t\t\thas_country_flag = zin_stabilo_audit/.test(loan), 'an audit closes the loan to the AI');
  assert(loan.includes('check_variable = { zin_footholds > 1.99 }') && loan.includes('has_stability < 0.4') && loan.includes('days = 730') && loan.includes('NOT = { has_global_flag = zin_afrit_dead }'));
  assert(loan.includes('zin_afrit_add_footholds = yes') && loan.includes('days = 1095') && loan.includes('zin_stabilo_add_debt = yes') && loan.includes('id = zin_east.32'));
  const invite = eventBlock('zin_east.70');
  // AI acceptance = |lean| - 20: eight 10-point bands above 20 for each power, +20 bordering the inviter, -30 bordering the rival, 70 for the Free Crowns
  assert.equal([...invite.matchAll(/check_variable = \{ zin_east_lean > (\d+\.\d+) \}/g)].length, 2 * 8);
  assert(invite.includes('zin_east_lean > 29.99') && invite.includes('zin_east_lean < -99.99') && invite.includes('add = 70') && invite.includes('add = -70') && invite.includes('add = 20') && invite.includes('add = -30'));
  const protect = eventBlock('zin_east.71');
  assert(protect.includes('zin_east_lean > 49.99') && !protect.includes('zin_east_lean > 39.99') && protect.includes('factor = 2') && protect.includes('strength_ratio = { tag = ROOT ratio > 1 }'), 'AI = |lean| - 40, x2 against a stronger neighbour');
  const wells = eventBlock('zin_east.15');
  assert(wells.includes('days = 240') && wells.includes('check_variable = { global.zin_east_rivalry > 59.99 }') && wells.includes('global.zin_east_wells_turn'), 'Trouble at the Wells: rivalry 60+, mean 240 days, alternating');
  assert(wells.includes('add_political_power = -25') && wells.includes('add_war_support = 0.02'));
});

test('Negative: the event pictures check refuses a gated picture and the build refuses a picture outside the catalog', async () => {
  const cells = await json('presentation-cells.json');
  assert.equal(cells.events.find(e => e.key === 'traders_road_south')?.gate, 'zin_eindil_awake', 'the catalog marks its gated pictures');
  assert(cells.events.find(e => e.key === 'eastern_court')?.gate, 'the eastern court picture is gated');
  const { renderEvent } = await import('./lib/mech_kit.mjs');
  assert.throws(() => renderEvent({ id: 'zin_east.99', options: [{ key: 'a' }] }, { use: k => k }), /no picture/);
  const src = await readFile(path.join(here, 'modules/mech_east_content.mjs'), 'utf8');
  assert(src.includes("is not in the catalog`)"), 'the module refuses a picture that is not a catalog key');
});

// ------------------------------------------------------------------------------------------------ decisions
const COSTS = { zin_east_send_caravan_salt: 30, zin_east_buy_road_lords: 50, zin_east_undercut_rival: 50, zin_east_talks_at_the_wells: 75, zin_east_concord_of_the_roads: 100, zin_east_dig_wells: 40, zin_east_court_envoys: 25, zin_east_send_court_gifts: 50, zin_east_invite_to_league: 25, zin_east_offer_protection: 100, zin_east_rally_free_crowns: 25, zin_stabilo_lend: 50, zin_stabilo_great_loan: 100, zin_stabilo_call_in_debt: 10, zin_stabilo_forgive_debt: 25, zin_east_feed_the_quarrel: 50, zin_east_whisper_of_the_rift: 75, zin_east_report: 0 };
const COOLDOWNS = { zin_east_send_caravan_gold: 60, zin_east_buy_road_lords: 120, zin_east_undercut_rival: 120, zin_east_talks_at_the_wells: 365, zin_east_dig_wells: 30, zin_east_court_envoys: 120, zin_east_send_court_gifts: 365, zin_east_invite_to_league: 180, zin_east_offer_protection: 365, zin_east_rally_free_crowns: 90, zin_stabilo_lend: 180, zin_stabilo_great_loan: 365, zin_stabilo_call_in_debt: 180, zin_stabilo_forgive_debt: 365, zin_east_feed_the_quarrel: 180 };
test('Decisions: the spec\'s costs, cooldowns and categories; every decision has allowed, AI, an icon of the catalog and its text; targeted ones a pre-check', () => {
  const cats = Object.fromEntries(parse(text(DEC)).map(c => [c.k, c.v.map(d => d.k)]));
  assert.deepEqual(Object.keys(cats).sort(), ['zin_afrit_council', 'zin_east_courts', 'zin_east_desert', 'zin_east_ledger', 'zin_east_roads']);
  assert.deepEqual(cats.zin_afrit_council, ['zin_east_feed_the_quarrel', 'zin_east_whisper_of_the_rift', 'zin_east_report']);
  assert.deepEqual(cats.zin_east_ledger, ['zin_stabilo_lend', 'zin_stabilo_great_loan', 'zin_stabilo_call_in_debt', 'zin_stabilo_forgive_debt']);
  assert.equal(cats.zin_east_roads.length, 9);
  for (const [id, cost] of Object.entries(COSTS)) assert(decisionBlock(id).includes(`\t\tcost = ${cost}\n`), `${id} costs ${cost}`);
  for (const [id, days] of Object.entries(COOLDOWNS)) assert(decisionBlock(id).includes(`days_re_enable = ${days}\n`), `${id} cooldown ${days}`);
  assert(decisionBlock('zin_east_whisper_of_the_rift').includes('fire_only_once = yes'));
  const sprites = new Set(['GFX_idea_zin_caravan', 'GFX_idea_zin_granary', 'GFX_idea_zin_envoy', 'GFX_idea_zin_banner_league', 'GFX_idea_zin_ledger_coins', 'GFX_idea_zin_eye_watchful']);
  for (const cat of parse(text(DEC))) for (const d of cat.v) {
    const has = k => d.v.some(x => x.k === k);
    assert(has('allowed') && has('ai_will_do') && has('cost') && has('complete_effect'), `${d.k} lacks a block`);
    assert(sprites.has(d.v.find(x => x.k === 'icon').v), `${d.k} icon ${d.v.find(x => x.k === 'icon').v} is not the spec's`);
    if (has('target_trigger')) assert(has('target_root_trigger'), `${d.k} is targeted without a pre-check`);
    assert(d.k in loc && `${d.k}_desc` in loc, `${d.k} text`);
  }
  assert(decisionBlock('zin_east_dig_wells').includes('state_target = any_owned_state'), 'state-targeted');
  assert(decisionBlock('zin_east_invite_to_league').includes(`is_guaranteed_by = ${STA}`), 'the AI never invites a court the rival guarantees');
  assert(decisionBlock('zin_east_undercut_rival').includes('zin_rules_is_free = yes') && decisionBlock('zin_east_undercut_rival').includes('global.zin_east_rivalry < 60'));
  assert(decisionBlock('zin_east_talks_at_the_wells').includes('zin_east_after_rift_talk = yes') && decisionBlock('zin_east_concord_of_the_roads').includes('base = 100'));
  const cat = text('common/decisions/categories/zin_east.txt');
  assert(cat.includes('zin_east_desert = {') && /zin_east_desert = \{[\s\S]*?has_country_flag = zin_east_wells_unlocked/.test(cat), 'the desert category opens with the trees\' wells flag');
  assert(!/^zin_east_wells = \{/m.test(cat), 'the category does not share the wells modifier\'s key');
});

test('Negative: the cost check refuses a decision priced off the spec', () => {
  const d = decisionBlock('zin_east_talks_at_the_wells').replace('cost = 75', 'cost = 70');
  assert(!d.includes('\t\tcost = 75\n'));
});

// ------------------------------------------------------------------------------------------------ the roads and the charters
test('Roads: the start charters and influences of section 1, the road counts and the caravan wealth', () => {
  const st = body(EFF, 'zin_east_startup');
  for (const [k, c] of Object.entries({ salt: 1, gold: 2, rift: 0, lake: 0, sand: 0 })) assert(st.includes(`set_variable = { global.zin_east_road_${k} = ${c} }`), `${k} charter`);
  const inf = { salt: [70, 10], gold: [10, 70], rift: [40, 30], lake: [35, 25], sand: [25, 40] };
  const nor = st.slice(st.indexOf(`${NOR} = {\n\t\t\tsave_global_event_target_as = zin_east_noris`)), sta = st.slice(st.indexOf(`${STA} = {\n\t\t\tsave_global_event_target_as = zin_east_stabilo`));
  for (const [k, [n, s]] of Object.entries(inf)) { assert(nor.includes(`zin_east_inf_${k} = ${n} }`), `Noris ${k}`); assert(sta.includes(`zin_east_inf_${k} = ${s} }`), `Stabilo ${k}`); }
  for (const r of ROADS) assert(st.includes(`limit = { zin_is_site_road_${r.key} = yes }\n\t\t\tadd_to_variable = { global.zin_east_roadn_${r.key} = 1 }`), `${r.key} count`);
  const w = body(EFF, 'zin_east_refresh_wealth');
  assert(w.includes('multiply_variable = { zin_east_cw_pp = 0.05 }') && w.includes('multiply_variable = { zin_east_cw_trade = 0.05 }') && w.includes('multiply_variable = { zin_east_cw_cg = -0.01 }') && w.includes('set_variable = { zin_east_charters = 2.5 }'), 'wealth per charter; a Concord road counts half');
  assert(text('common/dynamic_modifiers/zin_east.txt').includes('political_power_gain = zin_east_cw_pp'));
});

test('Roads: the monthly rules of the charters, the drift, conquest, the gone power and the court drift', () => {
  const m = body(EFF, 'zin_east_roads_month');
  const salt = m.slice(m.indexOf('# salt'), m.indexOf('# gold'));
  assert(salt.includes('check_variable = { zin_e_n > 59.99 }') && salt.includes('check_variable = { zin_e_lead > 19.99 }'), 'a free road goes at 60 with a lead of 20');
  assert(salt.includes('check_variable = { zin_e_n < 40 }') && salt.includes('check_variable = { zin_e_s > 59.99 }'), 'a held road passes under 40 against 60');
  assert(salt.includes('multiply_temp_variable = { zin_e_total3 = 2 }') && salt.includes('multiply_temp_variable = { zin_e_n3 = 3 }') && salt.includes('set_variable = { zin_east_inf_salt = 100 }'), 'two thirds by conquest');
  assert(salt.includes('add_to_variable = { zin_east_inf_salt = 0.5 }') && salt.includes('add_to_variable = { zin_east_inf_salt = 0.3 }') && salt.includes('add_to_variable = { zin_east_inf_salt = zin_east_caravan_bonus }') && salt.includes('add_to_variable = { zin_east_inf_salt = -0.2 }'), 'the drift table');
  assert(new RegExp(`NOT = \\{ country_exists = ${NOR} \\}\\n\\t\\t\\tcheck_variable = \\{ global\\.zin_east_road_salt = 1 \\}\\n\\t\\t\\}\\n\\t\\tset_variable = \\{ global\\.zin_east_road_salt = 0 \\}`).test(salt), 'a gone power frees only its own charters');
  assert(salt.indexOf('NOT = { has_global_flag = zin_east_roads_concord }') < salt.indexOf('zin_e_total3') && salt.indexOf('add_to_variable = { zin_east_inf_salt = 0.5 }') < salt.indexOf('NOT = { has_global_flag = zin_east_roads_concord }'), 'the Concord freezes the charters, not the drift');
  assert(salt.includes('check_variable = { zin_e_moved = 0 }') && salt.includes('zin_east_charter_changed = yes') && salt.includes('set_temp_variable = { zin_arg_value = 5 }'), 'one change a month, +5 rivalry');
  assert(salt.includes('set_temp_variable = { zin_arg_value = 0.1 }') && salt.includes('set_temp_variable = { zin_arg_value = -0.1 }'), 'courts drift 0.1 toward the holder');
  assert(m.includes('set_global_flag = zin_east_noris_gone') && m.includes('set_temp_variable = { zin_arg_value = 20 }'), 'the survivor gains 20 once');
  const ch = body(EFF, 'zin_east_charter_changed');
  assert(ch.includes('flag = zin_east_in_crisis days = 365') && ch.includes('modifier = zin_east_charter_lost') && (ch.match(/id = zin_east\.10/g) ?? []).length === 2 + ROADS.length, 'news to both powers and to the courts of the road');
});

test('Site rows (E7): the five roads follow the spec\'s waypoints; every eastern site and region the script reads has a row; none is written here', () => {
  const rows = new Map(east.siteRows.map(r => [r.key, r]));
  const path = k => rows.get(`road_${k}`).rule.path.map(w => (typeof w === 'string' ? w : 'nearest'));
  // Mylunur joined Noris and Gondolin is Naamis (roster of 24 October 2026): the salt road runs through their capitals.
  assert.deepEqual(path('salt'), ['site:furvior', 'capital:Noris', 'capital:Naamis']);
  assert.deepEqual(path('gold'), ['capital:Plutondo', 'site:postondoroth', 'capital:Stabilo', 'capital:Mostok', 'capital:Kersian', 'capital:Azano', 'capital:Alerhia']);
  assert.deepEqual(path('rift'), ['site:furvior', 'capital:Delbiz', 'nearest']);
  assert.deepEqual(rows.get('road_rift').rule.path[2].nearest.filter, { owned: 'Alerhia', naval_base: true, site: 'rift_east' });
  // Ernois joined Ostoroth, Olor and Arcon joined Stabilo (roster of 24 October 2026): their waypoints fall to the realms that hold them.
  assert.deepEqual(path('lake'), ['site:furvior', 'capital:Mora', 'capital:Ostoroth']);
  assert.deepEqual(path('sand'), ['capital:Stabilo', 'capital:Obmi', 'capital:Erco']);
  assert.deepEqual(rows.get('road_sand').rule.branches, [['capital:Obmi', 'capital:Stabilo', 'capital:Pornivior', 'capital:Miaed']]);
  assert.equal(rows.get('south_lands').rule.min_row, 1550);
  assert.equal(rows.get('furvior').rule.capital, 'Noris'); assert.equal(rows.get('postondoroth').rule.vp, 'Postondoroth');
  const triggers = new Set(east.siteRows.map(r => r.trigger));
  const read = new Set([...allScript.matchAll(/\b(zin_is_(?:site|region)_[a-z_]+) = yes/g)].map(m => m[1]));
  const others = ['zin_is_region_magical_lands', 'zin_is_region_middle_lands'];
  assert.deepEqual([...read].filter(t => !triggers.has(t) && !others.includes(t)), [], 'an eastern site the script reads has no row');
  assert(!/^zin_is_(site|region)_[a-z_]+ = \{/m.test(allScript), 'the site triggers are the key-sites module\'s');
});

test('Negative: the site rows refuse a waypoint that names no country or no row, and a missing road', async () => {
  let d = fresh(); d.sites.rows.find(r => r.key === 'road_lake').rule.path[1] = 'capital:Atlantis';
  await assert.rejects(() => build(d), /capital:Atlantis names no country/);
  d = fresh(); d.sites.rows.find(r => r.key === 'road_salt').rule.path[0] = 'site:nowhere';
  await assert.rejects(() => build(d), /site:nowhere names no site row/);
  d = fresh(); d.sites.rows = d.sites.rows.filter(r => r.key !== 'road_gold');
  await assert.rejects(() => build(d), /no road_gold/);
});

test('Negative: the module refuses a start charter, influence or lean off the spec\'s ranges, and a lean on a power', async () => {
  let d = fresh(); d.numbers.roads.salt.charter = 3; await assert.rejects(() => build(d), /start charter must be 0, 1 or 2/);
  d = fresh(); d.numbers.roads.gold.stabilo = 120; await assert.rejects(() => build(d), /influence must lie in 0 to 100/);
  d = fresh(); d.roster.leans.Mora = -140; await assert.rejects(() => build(d), /lean of Mora/);
  d = fresh(); d.roster.leans.Noris = 10; await assert.rejects(() => build(d), /Noris is a power/);
  d = fresh(); delete d.numbers.roads.lake; await assert.rejects(() => build(d), /no start row for the lake road/);
});

// ------------------------------------------------------------------------------------------------ the rivalry
test('Rivalry: start 40, the sources and the drift of section 2, the Concord and its cap, the Caravan War gate', () => {
  assert(body(EFF, 'zin_east_startup').includes('set_variable = { global.zin_east_rivalry = 40 }'));
  const add = body(EFF, 'zin_east_add_rivalry');
  assert(add.includes('clamp_variable = { var = global.zin_east_rivalry min = 0 max = 100 }') && add.includes('has_global_flag = zin_east_roads_concord_cap') && add.includes('global.zin_east_rivalry = 30 }'));
  const r = body(EFF, 'zin_east_rivalry_month');
  assert(r.includes('zin_arg_value = 0.3') && r.includes('zin_arg_value = -0.5') && r.includes('zin_arg_value = 1 }') && r.includes('zin_arg_value = -0.2') && r.includes('zin_arg_value = 0.2'), 'contested roads, both refuse, split, drift');
  assert(r.includes('check_variable = { zin_east_inf_salt > 39.99 }'), 'contested at 40 each');
  assert(body(EFF, 'zin_east_undercut').includes('zin_arg_value = 3') && body(EFF, 'zin_east_undercut').includes('zin_arg_value = -5'));
  assert(eventBlock('zin_east.20').includes('zin_arg_value = -10') && eventBlock('zin_east.20').includes('zin_arg_value = 3'), 'talks -10, refused +3');
  assert(eventBlock('zin_east.16').includes('zin_arg_value = -3') && eventBlock('zin_east.16').includes('zin_arg_value = 2'), 'inquiry -3, refused +2');
  assert(decisionBlock('zin_east_feed_the_quarrel').includes('zin_arg_value = 5') && decisionBlock('zin_east_feed_the_quarrel').includes('global.zin_east_rivalry < 90'));
  const c = body(EFF, 'zin_east_sign_concord');
  assert(c.includes('flag = zin_east_roads_concord_cap days = 1825') && c.includes('add_ideas = zin_east_shared_roads') && c.includes('modifier = zin_east_concord') && c.includes('id = zin_east.24'));
  const war = body(EFF, 'zin_east_on_declare_war');
  assert(war.includes('clr_global_flag = zin_east_roads_concord') && war.includes('remove_opinion_modifier') && war.includes('set_global_flag = zin_east_caravan_war') && war.includes('zin_east_caravan_war_strain') && war.includes('id = zin_east.25'));
  assert(body(EFF, 'zin_east_on_peace').includes('clr_global_flag = zin_east_caravan_war'));
  const gate = body(TRG, 'zin_east_caravan_war_open');
  assert(gate.includes('global.zin_east_rivalry > 74.99') && gate.includes('global.zin_gathering_dark > 24.99') && gate.includes('zin_east_after_caravan_war = yes') && gate.includes('has_global_flag = zin_war_of_last_crowns'));
  assert(decisionBlock('zin_east_concord_of_the_roads').includes('global.zin_east_rivalry < 15.01'), 'the Concord at 15 or less');
});

// ------------------------------------------------------------------------------------------------ the courts
// The spec's lean table on the roster of 24 October 2026: Gondolin is Naamis, Delbiz Grasslands Delbiz and Avalon Rhachia; Mylunur and The Moco
// joined Noris and Oreton joined Stabilo, so their rows went with them (the powers themselves hold no lean).
const LEANS = { Naamis: 70, Delbiz: 20, Ostoroth: 15, Mora: 10, Alerhia: 0, Kersian: 0, Miaed: -10, Rhachia: -10, Mostok: -15, Erco: -20, Obmi: -20, Plutondo: -30, Drak: -70 };
test('Courts: the start leans of section 3, every other court at 0, the clamp, dominance and the startup AI', () => {
  const st = body(EFF, 'zin_east_startup');
  for (const [n, v] of Object.entries(LEANS)) assert(st.includes(`${tagOf(n)} = { set_variable = { zin_east_lean = ${v} } }`), `${n} leans ${v}`);
  assert(st.indexOf('set_variable = { zin_east_lean = 0 }') < st.indexOf(`${tagOf('Naamis')} = { set_variable = { zin_east_lean = 70 } }`), 'every court starts at 0, then the table');
  assert(!st.includes(`${NOR} = { set_variable = { zin_east_lean`) && !st.includes(`${STA} = { set_variable = { zin_east_lean`));
  assert(body(EFF, 'zin_east_add_lean').includes('clamp_variable = { var = zin_east_lean min = -100 max = 100 }'));
  assert.equal([...allScript.matchAll(/(?:set_variable|add_to_variable) = \{ zin_east_lean = (?!0 \}|-?\d+ \} \})/g)].length, 1, 'zin_east_add_lean is the only way to change the lean after the start');
  const dom = body(EFF, 'zin_east_update_dominance');
  assert(dom.includes('multiply_temp_variable = { zin_east_allies = 0.5 }') && dom.includes('divide_temp_variable = { zin_east_mine = global.zin_east_states_total }'), 'dominance: own and subjects, half for faction members, over the frozen count');
  assert(st.includes(`add_ai_strategy = { type = antagonize id = "${STA}" value = 20 }`) && st.includes(`add_ai_strategy = { type = befriend id = "${tagOf('Alerhia')}" value = 10 }`));
  for (const n of ['Naamis', 'Mora']) assert(st.slice(st.indexOf('zin_east_noris'), st.indexOf('zin_east_stabilo')).includes(`befriend id = "${tagOf(n)}"`), n);
  for (const n of ['Drak', 'Plutondo', 'Obmi']) assert(st.slice(st.indexOf('zin_east_stabilo')).includes(`befriend id = "${tagOf(n)}"`), n);
  const inv = decisionBlock('zin_east_invite_to_league');
  assert(inv.includes('zin_east_lean > 49.99') && inv.includes('zin_east_lean < -49.99') && inv.includes('has_country_flag = zin_noris_open_treaty') && inv.includes('has_country_flag = zin_stabilo_open_pact'));
  const pr = decisionBlock('zin_east_offer_protection');
  assert(pr.includes('zin_east_lean > 79.99') && pr.includes('zin_east_lean > 59.99') && pr.includes('has_country_flag = zin_noris_route_high_king'));
  assert(eventBlock('zin_east.71').includes('puppet = ROOT'), 'protection makes a subject');
});

// ------------------------------------------------------------------------------------------------ the kneel bias
test('Kneel bias: every factor of section 4 with its value, the clamp, 0 on day one, the rule wrappers', () => {
  const b = body(EFF, 'zin_east_update_bias');
  const factor = (when, v) => assert(new RegExp(`${when}[^]*?add_to_temp_variable = \\{ zin_east_b = ${v} \\}`).test(b), `${when} gives ${v}`);
  factor('has_country_flag = zin_east_coalition_member', 15);
  factor('has_country_flag = zin_east_owes_temples', 10);
  factor('has_country_flag = zin_east_in_crisis', 10);
  factor('is_faction_leader = yes \\}', -15);
  factor('has_country_flag = zin_afrit_refused_east', -20);
  factor('has_country_flag = zin_stabilo_rival_banks', -20);
  assert(b.includes('check_variable = { zin_stabilo_debt > 29.99 }') && b.includes('else = { add_to_temp_variable = { zin_east_b = -10 } }'));
  factor('has_country_flag = zin_east_pledged', 100);
  factor('has_country_flag = zin_stabilo_route_free', -100);
  factor('has_country_flag = zin_stabilo_route_empire', -50);
  factor('zin_east_rule_unite = yes', -100);
  assert(b.includes('clamp_variable = { var = zin_east_kneel_bias min = -100 max = 100 }'));
  assert(body(EFF, 'zin_east_startup').includes('set_variable = { zin_east_kneel_bias = 0 }'));
  assert(body(EFF, 'zin_east_country_month').includes('zin_east_update_bias = yes'));
});

test('Rule reads: zin_rule_ai_east is read only through the rules wrappers; RANDOM rolls once on startup', () => {
  assert(!/has_game_rule/.test(allScript), 'no raw rule read');
  for (const t of ['zin_rules_ai_branch_east_refuse_afrit', 'zin_rules_ai_branch_east_unite_without_afrit']) assert.equal([...allScript.matchAll(new RegExp(`\\b${t} = yes`, 'g'))].length, 1, `${t} is read once, by its wrapper`);
  assert(body(TRG, 'zin_east_rule_refuse').includes('is_ai = yes') && body(TRG, 'zin_east_rule_refuse').includes('global.zin_east_rule_roll = 1') && body(TRG, 'zin_east_rule_unite').includes('global.zin_east_rule_roll = 2'));
  const st = body(EFF, 'zin_east_startup');
  assert(/zin_rules_ai_random_east = yes \}\n\t\t\trandom_list = \{\n\t\t\t\t34 = \{ set_variable = \{ global\.zin_east_rule_roll = 0 \} \}\n\t\t\t\t33 = \{ set_variable = \{ global\.zin_east_rule_roll = 1 \} \}\n\t\t\t\t33 = \{ set_variable = \{ global\.zin_east_rule_roll = 2 \} \}/.test(st));
  assert(text(EFF).includes('zin_rules_is_historical = yes') && text(EFF).includes('zin_rules_is_historical = no'), 'the historical path is read through its wrapper');
});

// ------------------------------------------------------------------------------------------------ the coalition and the invasion
test('Coalition: the weight factors, the leader, the asks, the historical floor', () => {
  const w = body(EFF, 'zin_east_compute_weight');
  for (const [s, v] of [['zin_east_faces_rift = yes', 20], ['has_country_flag = zin_east_rift_ambition', 15], ['has_government = fascism', 10], ['has_country_flag = zin_east_in_crisis', 10], ['has_country_flag = zin_east_rift_whispered', 10], ['has_government = democratic', -30], ['has_war = yes', -20], ['has_country_flag = zin_east_route_resist', -50], ['has_country_flag = zin_stabilo_route_free', -100]]) assert(new RegExp(`${s}[^]*?add_to_temp_variable = \\{ zin_e_w = ${v} \\}`).test(w), `${s} weighs ${v}`);
  assert(w.includes('multiply_temp_variable = { zin_e_w = 10 }') && w.includes('divide_temp_variable = { zin_e_states = 2 }') && w.includes('round_temp_variable = zin_e_states') && w.includes('max = 15') && w.includes('divide_temp_variable = { zin_e_bias5 = 5 }'));
  const floor = x => Math.round(x / 2 - 0.25);
  assert.deepEqual([7, 8, 9, 26].map(floor), [3, 4, 4, 13], 'states / 2 rounded down');
  const lead = body(EFF, 'zin_east_pick_leader');
  assert(lead.includes('check_variable = { num_owned_states > 7.99 }') && lead.includes('zin_east_rank > PREV.zin_east_rank') && lead.includes('id = zin_east.42'), 'leader: 8+ states, ties by states then tag, a human leader is asked');
  const form = body(EFF, 'zin_east_form_coalition');
  assert(form.includes('check_variable = { zin_east_coalition_weight > 49.99 }') && form.includes('id = zin_east.3 days = 30') && form.includes('set_global_flag = zin_east_coalition_formed'));
  assert(body(EFF, 'zin_east_stay_out').includes('zin_east_pick_leader = yes'), 'a leader that declines passes the lead');
  const hist = body(EFF, 'zin_east_enforce_coalition');
  assert.equal((hist.match(/zin_east_join_coalition = yes/g) ?? []).length, 2) ;
  assert(hist.includes('is_ai = yes') && hist.includes('zin_e_joined < 1.99'));
  const ranks = [...body(EFF, 'zin_east_startup').matchAll(/^\t\t([A-Z][0-9A-Z]{2}) = \{ set_variable = \{ zin_east_rank = (\d+) \} \}/gm)].map(m => [m[1], +m[2]]);
  assert.equal(ranks.length, D.roster.expectedCountries + MAGICAL.length, 'every East Lands realm and every Magical Lands realm');
  assert.deepEqual(ranks.map(r => r[0]), [...ranks.map(r => r[0])].sort(), 'tag order');
  assert(!ranks.some(r => r[0] === WOR), 'the Worshipdom is no realm of the crossing');
});

test('Invasion: the gather, the crossing and the turn west of section 5, with the story-war flag before every declaration', () => {
  const story = body(EFF, 'zin_east_story_month');
  assert(story.includes('id = zin_east.41 days = 30') && story.includes('global.zin_gathering_dark > 69.99') && story.includes('zin_east_after_early_coalition = yes') && story.includes('zin_rules_is_historical = no'));
  const x = body(EFF, 'zin_east_cross_rift');
  assert(x.indexOf('zin_east_enforce_coalition = yes') < x.indexOf('set_global_flag = zin_eastern_invasion'));
  assert.equal((x.match(/declare_war_on = \{ target = event_target:zin_east_rift_foe type = take_claimed_state \}/g) ?? []).length, 3, 'up to three realms');
  for (const part of x.split('set_country_flag = zin_east_rift_target').slice(1)) {
    assert(part.indexOf('add_claim_by = event_target:zin_east_leader') < part.indexOf('declare_war_on'), 'the coast is claimed first');
    assert(part.indexOf('flag = zin_story_war days = 1') < part.indexOf('declare_war_on'), 'zin_story_war is set before the declaration');
    assert(part.includes('single_target_only = yes'));
  }
  assert(x.includes('zin_elves_is_magical_realm = yes') && x.includes('zin_east_rift_count > PREV.zin_east_rift_count') && x.includes('zin_is_site_rift_west = yes'));
  assert(x.includes('modifier = zin_cb_eastern_ambition scope = PREV days = 730') && x.includes(`modifier = zin_cb_eastern_ambition scope = ${AEN} days = 730`) && x.includes('check_variable = { zin_footholds > 2.99 }'));
  assert(x.includes('zin_elves_on_eastern_invasion = yes') && x.includes('every_country = { news_event = { id = zin_east.43 } }') && x.includes('flag = zin_east_invasion_young days = 120'));
  assert(!/zin_world_add_gathering_dark/.test(allScript), 'the invasion adds nothing to the meter itself');
  const w = body(EFF, 'zin_east_turn_west');
  assert(w.indexOf('flag = zin_story_war days = 1') < w.indexOf(`declare_war_on = { target = ${AEN}`) && w.includes('set_global_flag = zin_east_turns_west') && w.includes('id = zin_east.44'));
  assert(story.includes('zin_e_held > 2.99') && story.includes('NOT = { has_global_flag = zin_east_invasion_young }') && story.includes('zin_east_after_turn_west = yes') && story.includes('zin_rules_is_historical = yes'));
  const ai = text('common/ai_strategy/zin_east.txt');
  const realms = MAGICAL;
  assert(realms.length > 5);
  for (const r of realms) assert(ai.includes(`zin_east_coalition_toward_${r.tag.toLowerCase()} = {`) && ai.includes(`type = front_unit_request\n\t\ttag = ${r.tag}\n\t\tvalue = 60`), r.tag);
  assert(ai.includes('type = conquer\n\t\tid = "' + realms[0].tag + '"\n\t\tvalue = 80') && ai.includes(`id = "${AEN}"\n\t\tvalue = 100`) && !ai.includes(`toward_${WOR.toLowerCase()}`));
});

test('Peace gates: every claim and declaration of war sits behind its gate; nothing is reachable on day one', () => {
  assert.deepEqual(ungatedWar(scriptFiles), []);
  assert(body(TRG, 'zin_east_claims_open').includes('zin_east_caravan_war_open = yes') && body(TRG, 'zin_east_claims_open').includes('has_global_flag = zin_afrit_king_of_east'));
  assert(!/declare_war_on|add_claim_by|create_wargoal/.test(body(EFF, 'zin_east_startup')) && !/declare_war_on|create_wargoal/.test(text(DEC)));
});

test('Negative: the peace-gate check flags a declaration in the startup and a claim outside its gate', () => {
  const bad = new Map([[EFF, text(EFF).replace('set_global_flag = zin_east_started', `set_global_flag = zin_east_started\n\t\tdeclare_war_on = { target = ${STA} type = annex_everything }`)]]);
  assert.equal(ungatedWar(bad).length, 1);
  const bad2 = new Map([[EVT, text(EVT).replace('limit = { zin_east_claims_open = yes }', 'limit = { always = yes }')]]);
  assert(ungatedWar(bad2).length >= 1);
});

// ------------------------------------------------------------------------------------------------ the King of the East
test('King of the East: the kneel keeps the ideology and the elections, leaves the faction, keeps a subject\'s overlord (S1, O5)', () => {
  const k = body(EFF, 'zin_east_prepare_kneel');
  assert(/has_government = democratic \}\n\t\tset_variable = \{ zin_east_old_ideology = 0 \}[\s\S]*has_government = fascism \}\n\t\tset_variable = \{ zin_east_old_ideology = 1 \}[\s\S]*has_government = communism \}\n\t\tset_variable = \{ zin_east_old_ideology = 2 \}[\s\S]*else = \{\n\t\tset_variable = \{ zin_east_old_ideology = 3 \}/.test(k), '0 Light, 1 Dominion, 2 Shadow, 3 Wild');
  assert(k.includes('has_elections = yes') && k.includes('leave_faction = yes') && k.includes('modifier = zin_east_knelt') && k.includes(`give_military_access = ${WOR}`) && k.includes('is_subject = yes'));
  assert(!/add_to_faction|create_faction|puppet|set_autonomy/.test(k), 'the kneel joins no faction; the Afrit spec makes the subject');
  const rs = body(EFF, 'zin_east_restore_ideology');
  assert(rs.includes('set_politics = { ruling_party = democratic elections_allowed = yes }') && rs.includes('set_politics = { ruling_party = neutrality elections_allowed = no }'));
  const notice = body(EFF, 'zin_east_king_notice');
  assert(notice.includes('zin_afrit_eastern_candidate = yes') && notice.includes('id = zin_east.50'));
  const story = body(EFF, 'zin_east_story_month');
  assert(story.includes('id = zin_east.5 days = 30') && story.includes('id = zin_east.6 days = 60') && story.includes('id = zin_east.45') && story.includes('id = zin_east.46') && story.includes('id = zin_east.52'));
  assert(story.includes('has_country_flag = zin_noris_riders_for_host') && story.includes('set_country_flag = zin_east_sent_levies'), 'Noris\'s riders count as levies');
  assert(eventBlock('zin_east.6').includes('zin_east_enforce_refusers = yes\n\t\tzin_east_name_first_crown = yes'));
  const ref = body(EFF, 'zin_east_enforce_refusers');
  assert(ref.includes('zin_rules_is_historical = yes') && ref.includes('zin_east_kneel_bias < PREV.zin_east_kneel_bias') && (ref.match(/zin_east_refuse_king = yes/g) ?? []).length === 2);
  const free = body(EFF, 'zin_east_free_crowns_month');
  assert(free.indexOf('zin_east_client_set') < free.indexOf('zin_east_free_crown = yes'), 'clients first');
  assert((free.match(/modifier = zin_east_free_crown_kin/g) ?? []).length === 2, 'kinship both ways');
  assert(free.includes('add_ideas = zin_east_free_crowns') && free.includes('zin_east_grant_free_cb = yes'));
  const cb = body(EFF, 'zin_east_grant_free_cb');
  assert(cb.includes(`modifier = zin_cb_free_east scope = ${WOR} days = 1825`) && cb.includes('has_country_flag = zin_afrit_eastern_client'));
  assert(body(EFF, 'zin_east_send_levies').includes('add_manpower = -10000') && body(EFF, 'zin_east_send_gold').includes(`${WOR} = { add_political_power = 100 }`) && body(EFF, 'zin_east_delay_host').includes('modifier = zin_east_host_delayed'));
  assert(body(EFF, 'zin_east_serve_stranger').includes('army_experience = 10') && body(EFF, 'zin_east_order_home').includes('add_manpower = 5000'));
});

test('After the King: clients released and indebted, refusers vindicated, the Free Crowns end, the rivalry back to 50', () => {
  const a = body(EFF, 'zin_east_after_the_king');
  assert(a.includes(`${WOR} = { end_puppet = PREV }`) && a.includes('idea = zin_east_kings_debt days = 730') && a.includes('idea = zin_east_vindicated days = 730') && a.includes('zin_east_restore_ideology = yes'));
  assert(a.includes('remove_ideas = zin_east_free_crowns') && a.includes(`remove_dynamic_modifier = { modifier = zin_cb_free_east scope = ${WOR} }`) && a.includes('remove_dynamic_modifier = { modifier = zin_cb_free_east scope = PREV }'));
  assert(a.includes('global.zin_east_rivalry < 50') && a.includes('set_variable = { global.zin_east_rivalry = 50 }') && a.includes('id = zin_east.60') && a.includes('zin_east_after_king_done'));
  assert(body(EFF, 'zin_east_story_month').includes('has_global_flag = zin_afrit_dead }\n\t\tzin_east_after_the_king = yes'));
});

// ------------------------------------------------------------------------------------------------ the unified East
test('Unified East: the declaration needs dominance 50, no client, no other; the cause waits for the war or the King', () => {
  const u = body(EFF, 'zin_east_declare_united');
  assert(u.includes('zin_east_dominance > 49.99') && u.includes('NOT = { has_country_flag = zin_afrit_eastern_client }') && u.includes('NOT = { has_global_flag = zin_east_united }') && u.includes('add_ideas = zin_east_united_crown') && u.includes('every_country = { news_event = { id = zin_east.80 } }'));
  assert(!/zin_ending_/.test(allScript), 'no ending flag here');
  const h = body(EFF, 'zin_east_grant_high_king_cb');
  assert(h.includes('has_global_flag = zin_war_of_last_crowns') && h.includes('has_global_flag = zin_afrit_king_of_east') && h.includes('modifier = zin_cb_high_king scope = PREV days = 730') && h.includes('zin_east_lean < 0') && h.includes('zin_east_lean > 0'));
  assert(/outcome of this game/.test(loc['zin_east.80.d']) && /outcome of this game/.test(loc.zin_east_united_crown_desc), 'the text says outcome, never history');
});

// ------------------------------------------------------------------------------------------------ the desert
test('Desert: dry land on the South Lands, wells, dry years, the deep sand', () => {
  const st = body(EFF, 'zin_east_startup');
  assert(st.includes('zin_is_region_south_lands = yes\n\t\t\t\tNOT = { has_state_flag = zin_east_wells }\n\t\t\t}\n\t\t\tadd_dynamic_modifier = { modifier = zin_east_dry_land }'));
  const dyn = text('common/dynamic_modifiers/zin_east.txt');
  assert(/zin_east_dry_land = \{[^}]*supply_factor = -0\.25\n\ttruck_attrition_factor = 0\.25/.test(dyn.replace(/\tenable = \{ always = yes \}\n/g, '')) && /zin_east_wells = \{[^}]*supply_factor = 0\.1\n\tlocal_resources_factor = 0\.1/.test(dyn.replace(/\tenable = \{ always = yes \}\n/g, '')));
  const wells = body(EFF, 'zin_east_dig_wells_in');
  assert(wells.includes('set_state_flag = zin_east_wells') && wells.includes('remove_dynamic_modifier = { modifier = zin_east_dry_land }') && wells.includes('add_dynamic_modifier = { modifier = zin_east_wells }') && wells.includes('type = infrastructure level = 1'));
  const dry = eventBlock('zin_east.36');
  assert(dry.includes('days = 540') && dry.includes('zin_east_is_south_court = yes') && dry.includes('add_political_power = -25') && dry.includes('idea = zin_east_rationed_water days = 90'));
  assert(text('common/ideas/zin_east.txt').includes('stability_factor = -0.03'));
  assert(eventBlock('zin_east.35').includes('zin_east_wells_random = yes') && eventBlock('zin_east.35').includes('add_political_power = 25'));
  assert(!/beyond the (map|edge)|what lies beyond/i.test(loc['zin_east.35.d']), 'the deep sand never says what lies beyond');
  assert(body(EFF, 'zin_east_country_month').includes('set_country_flag = zin_east_south_court') && body(EFF, 'zin_east_country_month').includes('multiply_temp_variable = { zin_e_diff = 2 }'), 'a South Lands court owns half its states in the desert');
});

// ------------------------------------------------------------------------------------------------ start values, the runner, the dates
test('Start values and the runner: zin_east.1 a day after the start; the self-scheduling zin_east.2; no every-country periodic hook; layouts refreshed last', () => {
  const oa = text('common/on_actions/zin_east.txt');
  assert(oa.includes(`${NOR} = { country_event = { id = zin_east.1 days = 1 } }`));
  assert.deepEqual(periodicHooks(scriptFiles), []);
  assert(eventBlock('zin_east.1').includes('fire_only_once = yes') && body(EFF, 'zin_east_startup').includes('zin_east_schedule_month = yes'));
  assert(eventBlock('zin_east.2').includes('zin_east_monthly = yes\n\t\tzin_east_schedule_month = yes'));
  const sched = body(EFF, 'zin_east_schedule_month');
  assert(sched.includes('event_target:zin_east_runner = { country_event = { id = zin_east.2 days = 30 } }'));
  const run = body(EFF, 'zin_east_pick_runner');
  assert(run.indexOf(NOR) < run.indexOf(STA) && run.includes('num_owned_states > PREV.num_owned_states'), 'Noris, then Stabilo, then the largest East Lands country');
  const mo = body(EFF, 'zin_east_monthly');
  assert(mo.lastIndexOf('mark_focus_tree_layout_dirty = yes') > mo.indexOf('zin_stabilo_monthly = yes') && mo.lastIndexOf('mark_focus_tree_layout_dirty') > mo.indexOf('zin_east_story_month'), 'E4: layouts last');
  for (const s of ['global.zin_east_states_total', 'global.zin_east_wells_turn = 1', 'zin_east_caravan_bonus = 0', 'add_dynamic_modifier = { modifier = zin_east_caravan_wealth }', 'zin_east_update_dominance = yes']) assert(body(EFF, 'zin_east_startup').includes(s), s);
  assert(body(TRG, 'zin_east_in_region').includes('capital_scope = { zin_is_region_east_lands = yes }'), 'an East Lands country by its capital');
});

/** capital_scope blocks not preceded, in the same block, by the capital guard (r3b log: 1,520 "capital_scope: invalid event target"). */
const unguardedCapitals = files => {
  const out = [];
  for (const [f, t] of files) walk(parse(t), e => {
    if (!Array.isArray(e.v)) return;
    e.v.forEach((x, i) => { if (x.k === 'capital_scope' && !e.v.slice(0, i).some(y => y.k === 'zin_east_has_capital' && y.v === 'yes')) out.push(`${f}:${x.line}`); });
  });
  return out;
};
test('Every capital_scope of the East Lands follows the capital guard (exists, controls a state)', () => {
  assert.equal(body(TRG, 'zin_east_has_capital').trimEnd(), 'zin_east_has_capital = {\n\texists = yes\n\tnum_of_controlled_states > 0\n}');
  assert.match(body(TRG, 'zin_east_in_region'), /^zin_east_in_region = \{\n\tzin_east_has_capital = yes\n\tcapital_scope = \{/);
  assert(allScript.includes('capital_scope'), 'the East Lands read capitals');
  assert.deepEqual(unguardedCapitals(scriptFiles), []);
});
test('Negative: the capital guard check flags a bare capital_scope', () => {
  assert.equal(unguardedCapitals(new Map([['x.txt', 't = {\n\tcapital_scope = { is_coastal = yes }\n}\n']])).length, 1);
  assert.equal(unguardedCapitals(new Map([['x.txt', 't = {\n\tzin_east_has_capital = yes\n\tcapital_scope = { is_coastal = yes }\n}\n']])).length, 0);
});

test('Negative: the periodic-hook check flags an every-country on_monthly block', () => {
  const bad = new Map([['common/on_actions/zin_east.txt', 'on_actions = {\n\ton_monthly = {\n\t\teffect = { }\n\t}\n\ton_weekly = {\n\t}\n}\n']]);
  assert.equal(periodicHooks(bad).length, 2);
});

test('Story pace: each floor date is written three times, once per pace, and no other script compares a raw date', () => {
  const dates = { caravan_war: '1751.3.1', rift_talk: '1753.3.1', early_coalition: '1754.3.1', turn_west: '1756.1.1' };
  for (const [key, d] of Object.entries(dates)) {
    const t = body(TRG, `zin_east_after_${key}`);
    const [y, m, dd] = d.split('.').map(Number);
    const want = [1, 1.5, 0.75].map(p => paceDate(y, m, dd, p));
    assert.equal(new Set(want).size, 3, `${key}: three distinct paces`);
    for (const w of want) assert(t.includes(`date > ${w}`), `${key}: ${w}`);
    assert.equal(new Set([...t.matchAll(/date > ([\d.]+)/g)].map(x => x[1])).size, 3, `${key}: exactly three dates`);
    assert.equal([...t.matchAll(/global\.zin_story_pace/g)].length >= 3, true);
  }
  assert.equal(east.definitions.dateTriggers.length, 4);
  assert.deepEqual(rawDates(scriptFiles), []);
});

test('Negative: the raw-date check flags a date test outside the story-pace triggers; a date trigger holds three paces', () => {
  assert.equal(rawDates(new Map([[EFF, 'zin_x = {\n\tif = { limit = { date > 1751.3.1 } }\n}\n']])).length, 1);
  const t = dateTrigger('zin_x_after', 1760, 1, 1);
  assert.equal(new Set([...t.matchAll(/date > ([\d.]+)/g)].map(x => x[1])).size, 3);
});

// ------------------------------------------------------------------------------------------------ the roster
test('Negative: the module refuses a roster that does not match its data', async () => {
  let d = fresh(); d.roster.expectedCountries = 34; await assert.rejects(() => build(d), /expects 34/);
  d = fresh(); d.roster.expectedStates = 300; await assert.rejects(() => build(d), /expects 300/);
  d = fresh(); d.roster.leans['Nowhere Land'] = 5; await assert.rejects(() => build(d), /not in the roster/);
  d = fresh(); d.roster.great = ['Aenor']; await assert.rejects(() => build(d), /as a South-Earth country/);
  d = fresh(); delete d.report; await assert.rejects(() => build(d), /report needs a head/);
});

test('Report: the hub\'s report lists every East Lands country by tag and names the master only through zin_loc_deliverer', () => {
  const r = loc['zin_east.31.d'];
  for (const c of countries.filter(x => x.scan === 'South-Earth')) assert(r.includes(`[${c.tag}.GetName]: footholds §Y[?${c.tag}.zin_footholds|0]§!`), c.tag);
  assert(r.includes('[zin_loc_deliverer]') && !/Afrit/.test(r));
  assert(body(EFF, 'zin_east_make_report').includes('zin_east_compute_weight = yes'));
});
